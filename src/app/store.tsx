import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { LISTENING } from '../data/listening'
import { READING } from '../data/reading'
import { TESTS } from '../data/reallife'
import { WRITING } from '../data/writing'
import type { AIMessage, DailyResult, Lang, Mistake, SkillName, UserProgress } from '../data/types'
import { makeT, type TFn } from '../i18n'
import { ActiveTimeTracker } from '../progress/activeTime'
import { recordResult } from '../progress/engine'
import { newResultId } from '../progress/ids'
import type { ActivityKind, ActivityResult, ItemOutcome, RecordOutcome } from '../progress/types'
import { review } from '../services/srs'
import { emptyActivity } from '../storage/activity'
import { COURSE_ID, defaultProgress } from '../storage/defaults'
import { localStorageKV, type KeyValueStore } from '../storage/kv'
import { mergeCores } from '../storage/merge'
import {
  applyLegacyDrift,
  freshCore,
  inspectCopies,
  KEYS,
  listRecoveryItems,
  loadProgress,
  readStored,
  replacementBlocked,
  restoreFrom,
  saveProgress,
  snapshotComposite,
  startFresh,
  type Core,
  type CopyInfo,
  type LegacyIds,
  type LoadReport,
  type RecoveryItem,
} from '../storage/persistence'
import { nextEpoch } from '../storage/core'
import { pickGroups, type Group } from '../storage/slices'
import { emptyResultsMeta } from '../storage/results'
import { dayKey } from '../utils/date'

/** Same factory as before P1 (the shape of `UserProgress` is unchanged); it now lives in `storage/defaults`. */
export const defaultState = defaultProgress

/** Content ids the legacy migrator needs to map old completion keys onto credit keys. */
const LEGACY_IDS: LegacyIds = {
  writing: new Set(WRITING.map(w => w.id)),
  quizLike: new Set([...READING.map(r => r.id), ...LISTENING.map(l => l.id)]),
  testByUnit: Object.fromEntries(TESTS.filter(t => t.unit !== undefined).map(t => [t.unit as number, t.id])),
}

export interface Actions {
  /**
   * The ONLY way XP and completion change (03 §3.2): report what happened; the engine decides credit and completion.
   * Idempotent by `result.resultId`.
   */
  record: (result: ActivityResult) => RecordOutcome
  answerVocab: (id: string, correct: boolean) => void
  addMistake: (m: Omit<Mistake, 'at'>) => void
  toggleSaved: (id: string) => void
  addScore: (skill: SkillName, pct: number) => void
  setProfile: (p: Partial<Pick<UserProgress, 'name' | 'lang' | 'theme' | 'weeklyGoal' | 'level'>>) => void
  setDaily: (date: string, patch: Partial<DailyResult>) => void
  addTest: (t: UserProgress['tests'][number]) => void
  pushTutor: (msgs: AIMessage[]) => void
  clearTutor: () => void
  /**
   * Starts over after a verified safety copy of the current state (STO-17). The detailed attempt history is KEPT (STO-90).
   * 'no-snapshot' / 'upgrade-pending' (owner decision C5): the operation was REFUSED before any write; nothing changed.
   */
  reset: () => ResetOutcome
}
export type ResetOutcome = 'done' | 'no-snapshot' | 'upgrade-pending'

export interface StorageInfo {
  /** what happened when the stored data was loaded (migration, repair, recovery …) */
  report: LoadReport
  /** the last attempt to save failed (storage full or unavailable) */
  saveFailed: boolean
  /** progress is NOT being saved because overwriting stored data would not be safe, or needs the learner's decision */
  readOnly: boolean
  /** informational notices only: dismissal is scoped to a notice episode — a new failure or kind transition re-arms it (STO-94/100) */
  noticeDismissed: boolean
  dismissNotice: () => void
  /** history entries held in memory that are NOT yet in the stored history record (STO-96); shown, never discarded */
  historyPending: number
  /** the history record is from a newer version: it is not written this session (history-readonly) */
  historyReadonly: boolean
  /** the last adoption of another tab's replacement discarded unsaved progress (STO-95) */
  replacedNotice: boolean
  /** the layout-2 upgrade has not completed: Reset / Start Fresh / Restore / Rollback are refused (C5) */
  upgradePending: boolean
  /** exact copies of backups / quarantined data, for the learner to download */
  recoveryItems: () => RecoveryItem[]
  /** every preserved copy, verified (integrity + usability) without writing anything */
  copies: () => CopyInfo[]
  /** learner-confirmed: adopt a verified copy; the current record is quarantined first */
  restore: (key: string) => LoadReport
  /** learner-confirmed: accept the candidate proposed after an unreadable record */
  confirmRecovery: () => LoadReport | null
  /** learner-confirmed: start empty after an unreadable record (the damaged bytes are kept) */
  startFresh: () => LoadReport
  /** re-run the loader without changing anything; adopts the result only if it is healthy */
  retry: () => LoadReport
  /** try to save the current state again (after a full or unavailable storage) */
  retrySave: () => boolean
}

interface Ctx {
  state: UserProgress
  actions: Actions
  t: TFn
  lang: Lang
  storage: StorageInfo
  timer: { mark: () => number; touch: () => void }
}
const AppCtx = createContext<Ctx | null>(null)

const HEALTHY: LoadReport['status'][] = ['fresh', 'ok', 'migrated', 'repaired', 'recovered']

/** The three stored records as this tab last saw them. */
interface Raws {
  core: string | null
  prefs: string | null
  tutor: string | null
  results: string | null
}
const ALL_GROUPS: ReadonlySet<Group> = new Set<Group>(['core', 'prefs', 'tutor', 'results'])
function readRaws(store: KeyValueStore): Raws {
  try {
    return { core: store.get(KEYS.current), prefs: store.get(KEYS.prefs), tutor: store.get(KEYS.tutor), results: store.get(KEYS.results) }
  } catch {
    return { core: null, prefs: null, tutor: null, results: null }
  }
}

export function AppProvider({ children, kv }: { children: ReactNode; kv?: KeyValueStore }) {
  const store = useMemo(() => kv ?? localStorageKV(), [kv])
  // Loading may migrate/repair stored data; it is idempotent, so React's double-invoked initialiser in dev is harmless.
  const [boot] = useState(() => loadProgress(store, { now: Date.now(), ids: LEGACY_IDS }))
  const [core, setCore] = useState<Core>(boot.core)
  const [report, setReport] = useState<LoadReport>(boot.report)
  const [readOnly, setReadOnly] = useState(boot.report.writesDisabled)
  const state = core.progress
  const [saveFailed, setSaveFailed] = useState(false)
  // notice episodes (STO-94/100): informational notices are dismissed PER EPISODE; any new failure or relevant transition starts a new one
  const [episode, setEpisode] = useState(0)
  const [dismissedEpisode, setDismissedEpisode] = useState(-1)
  const noticeDismissed = dismissedEpisode === episode
  const [historyPending, setHistoryPending] = useState(0)
  const [historyReadonly, setHistoryReadonly] = useState(boot.report.historyReadonly)
  const [replacedNotice, setReplacedNotice] = useState(false)
  const pendingRef = useRef(0)
  const saveFailedRef = useRef(false)
  const failureKindRef = useRef<string | null>(null)
  /** ledger ids this tab has persisted (or loaded): credit that is NOT in it is unsaved progress (for the conflict notice) */
  const persistedIds = useRef<Set<string>>(new Set(boot.core.credit.entries.map(e => e.id)))
  const lastSaved = useRef<Core>(boot.core)
  // each record exactly as this tab last read or wrote it: if the stored bytes still equal it, nobody else wrote and our state is authoritative
  // for that record (S1: course, preferences and tutor are three independent records)
  const lastRaws = useRef<Raws | undefined>(undefined)
  if (lastRaws.current === undefined) lastRaws.current = readRaws(store)
  const coreRef = useRef(core)
  coreRef.current = core
  const readOnlyRef = useRef(readOnly)
  readOnlyRef.current = readOnly
  // while the layout-2 upgrade has not completed (compatibility mode) saves keep writing the old record form (design §13.13)
  const modeRef = useRef<'split' | 'layout1' | 'monolith'>(report.layout)
  modeRef.current = report.layout
  const historyReadonlyRef = useRef(historyReadonly)
  historyReadonlyRef.current = historyReadonly

  /** a new failure or a relevant state transition: the matching notice becomes visible again */
  const armNotice = () => setEpisode(e => e + 1)
  /** applies the outcome of a save to the failure state; arms the notice on every new failure / kind transition */
  const applySave = (res: ReturnType<typeof saveProgress>) => {
    const failed = !res.ok
    const pending = res.ok ? res.pending : pendingRef.current
    const readonly = res.ok ? res.historyReadonly : historyReadonlyRef.current
    saveFailedRef.current = failed
    pendingRef.current = pending
    setSaveFailed(failed)
    setHistoryPending(pending)
    setHistoryReadonly(readonly)
    const kind = failed ? 'save-failed' : readonly ? 'history-readonly' : pending > 0 ? 'history-not-saved' : null
    if (kind !== failureKindRef.current && kind !== null) armNotice()
    failureKindRef.current = kind
  }

  /** Adopts what is stored now for the given records (used for storage events and after a detected conflict). */
  const syncFromStorage = (groups: ReadonlySet<Group>) => {
    const now = Date.now()
    const seen = readStored(store, now)
    if (!seen) return
    // we have now seen these versions: our next save is authoritative over them
    lastRaws.current = {
      core: groups.has('core') ? seen.raw : lastRaws.current!.core,
      prefs: groups.has('prefs') ? seen.rawPrefs : lastRaws.current!.prefs,
      tutor: groups.has('tutor') ? seen.rawTutor : lastRaws.current!.tutor,
      results: groups.has('results') ? seen.rawResults : lastRaws.current!.results,
    }
    // STO-95: another tab replaced the state (higher epoch) while this tab held credit that was never persisted — say so, never silently
    if (seen.core.epoch > coreRef.current.epoch) {
      const lostCredit = coreRef.current.credit.entries.some(e => !persistedIds.current.has(e.id) && !seen.core.credit.entries.some(x => x.id === e.id))
      if (lostCredit) {
        setReplacedNotice(true)
        armNotice()
      }
    }
    const merged = mergeCores(coreRef.current, pickGroups(seen.core, coreRef.current, groups), now)
    if (seen.core.epoch > coreRef.current.epoch) persistedIds.current = new Set(seen.core.credit.entries.map(e => e.id))
    if (merged !== coreRef.current) {
      coreRef.current = merged
      setCore(merged)
    }
  }

  // persist: re-read + merge + ONE atomic write; failures are surfaced, never swallowed; nothing is written in read-only mode
  useEffect(() => {
    if (core === lastSaved.current || readOnly) return
    const res = saveProgress(store, core, Date.now(), {
      replace: core.epoch !== lastSaved.current.epoch,
      lastRaw: lastRaws.current!.core,
      lastSliceRaw: { prefs: lastRaws.current!.prefs, tutor: lastRaws.current!.tutor, results: lastRaws.current!.results },
      mode: modeRef.current,
    })
    lastSaved.current = res.core
    if (res.ok) {
      lastRaws.current = { core: res.raw, prefs: res.rawPrefs, tutor: res.rawTutor, results: res.rawResults }
      // STO-95: the merge adopted another tab's REPLACEMENT (higher epoch) and the credit this tab had earned is not part of it
      if (res.core.epoch > core.epoch && core.credit.entries.some(e => !persistedIds.current.has(e.id) && !res.core.credit.entries.some(x => x.id === e.id))) {
        setReplacedNotice(true)
        armNotice()
      }
      if (!res.conflict && !res.resultsFailed) persistedIds.current = new Set(res.core.credit.entries.map(e => e.id))
      applySave(res)
      if (res.core !== core) setCore(res.core) // another tab contributed: adopt the merged state
      if (res.conflict) syncFromStorage(ALL_GROUPS) // another tab replaced the state meanwhile: adopt it (our stale write is ignored on load)
    } else {
      applySave(res)
      if (res.future) setReadOnly(true) // a newer app version owns the record: never write
    }
  // syncFromStorage only touches refs and setCore (stable)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [core, readOnly, store])

  // theme + document language
  useEffect(() => {
    const root = document.documentElement
    if (state.theme === 'auto') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', state.theme)
    root.lang = state.lang
  }, [state.theme, state.lang])

  // ---- active study time (05 §5): accumulate in memory, flush on result / hide / pagehide; no ticker, no idle counting
  const tracker = useRef<ActiveTimeTracker>()
  if (!tracker.current) tracker.current = new ActiveTimeTracker(Date.now())
  useEffect(() => {
    const tr = tracker.current!
    const touch = () => tr.touch(Date.now())
    // STO-97: best-effort SYNCHRONOUS flush. It also runs when there are no study seconds but something is pending or unsaved
    // (pending history entries, a failed save, unrendered state). It never throws; it cannot persist into unavailable/full storage and
    // gives NO durability guarantee (a killed page, a crash, a forced termination or bfcache may never fire these events).
    const flush = (sync: boolean) => {
      const seconds = tr.consumeSeconds(Date.now())
      const dirty = coreRef.current !== lastSaved.current || pendingRef.current > 0 || saveFailedRef.current
      if (seconds <= 0 && !dirty) return
      const next =
        seconds > 0
          ? { ...coreRef.current, progress: { ...coreRef.current.progress, studySeconds: coreRef.current.progress.studySeconds + seconds } }
          : coreRef.current
      if (seconds > 0) {
        coreRef.current = next
        setCore(next)
      }
      if (sync && !readOnlyRef.current) {
        try {
          const res = saveProgress(store, next, Date.now(), {
            lastRaw: lastRaws.current!.core,
            lastSliceRaw: { prefs: lastRaws.current!.prefs, tutor: lastRaws.current!.tutor, results: lastRaws.current!.results },
            mode: modeRef.current,
          })
          lastSaved.current = res.core
          if (res.ok) {
            lastRaws.current = { core: res.raw, prefs: res.rawPrefs, tutor: res.rawTutor, results: res.rawResults }
            if (!res.conflict && !res.resultsFailed) persistedIds.current = new Set(res.core.credit.entries.map(e => e.id))
          }
          applySave(res)
        } catch {
          /* best effort */
        }
      }
    }
    const onVisibility = () => {
      const visible = document.visibilityState === 'visible'
      if (!visible) flush(true)
      tr.setVisible(visible, Date.now())
    }
    const onPageHide = () => flush(true)
    const events = ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'] as const
    for (const e of events) window.addEventListener(e, touch, { passive: true, capture: true })
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', onPageHide)
    return () => {
      for (const e of events) window.removeEventListener(e, touch, { capture: true })
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', onPageHide)
    }
    // applySave only touches refs and state setters (stable)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store])

  // ---- other tabs and stale app versions (05 §9)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (readOnlyRef.current) return
      if (e.key !== null && e.key !== KEYS.current && e.key !== KEYS.prefs && e.key !== KEYS.tutor && e.key !== KEYS.results && e.key !== KEYS.legacy) return
      const now = Date.now()
      // only the record that changed is merged: a change to one never drags in another group of the other tab's state
      const groups = new Set<Group>()
      if (e.key === null || e.key === KEYS.current) groups.add('core')
      if (e.key === null || e.key === KEYS.prefs) groups.add('prefs')
      if (e.key === null || e.key === KEYS.tutor) groups.add('tutor')
      if (e.key === null || e.key === KEYS.results) groups.add('results')
      if (groups.size > 0) syncFromStorage(groups)
      if (e.key === null || e.key === KEYS.legacy) {
        const d = applyLegacyDrift(store, coreRef.current, store.get(KEYS.legacy), now, LEGACY_IDS)
        if (d.drift === 'merged' || d.drift === 'unreadable') {
          coreRef.current = d.core
          setCore(d.core)
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store])

  // progress-only update; returning the same object keeps identity (no re-render, no write)
  const setState = (f: (p: UserProgress) => UserProgress) =>
    setCore(c => {
      const p = f(c.progress)
      return p === c.progress ? c : { ...c, progress: p }
    })

  const touchDay = (s: UserProgress): UserProgress => {
    const k = dayKey()
    return s.activeDates.includes(k) ? s : { ...s, activeDates: [...s.activeDates, k].slice(-400) }
  }

  const actions = useMemo<Actions>(
    () => ({
      record: result => {
        const now = Date.now()
        // study time accumulated so far is flushed together with the result (05 §5), in one update
        const seconds = tracker.current!.consumeSeconds(now)
        const preview = recordResult(coreRef.current, result, now).outcome
        setCore(c => {
          const withTime = seconds > 0 ? { ...c, progress: { ...c.progress, studySeconds: c.progress.studySeconds + seconds } } : c
          return recordResult(withTime, result, now).core
        })
        return preview
      },
      answerVocab: (id, correct) => setState(s => touchDay({ ...s, mastery: { ...s.mastery, [id]: review(s.mastery[id], correct) } })),
      addMistake: m => setState(s => ({ ...s, mistakes: [...s.mistakes, { ...m, at: Date.now() }].slice(-300) })),
      toggleSaved: id => setState(s => ({ ...s, saved: s.saved.includes(id) ? s.saved.filter(x => x !== id) : [...s.saved, id] })),
      addScore: (skill, pct) =>
        setState(s => touchDay({ ...s, scores: { ...s.scores, [skill]: [...s.scores[skill], Math.round(pct)].slice(-30) } })),
      // the time never goes backwards, so a newer edit always sorts after an older one even if the clock moved (S1 design 3.1)
      setProfile: p => setCore(c => ({ ...c, progress: { ...c.progress, ...p }, settingsAt: Math.max(Date.now(), c.settingsAt + 1) })),
      setDaily: (date, patch) =>
        setState(s => {
          const prev = s.daily[date] ?? { date, vocab: [0, 0], grammar: [0, 0], listening: [0, 0], speaking: false }
          return touchDay({ ...s, daily: { ...s.daily, [date]: { ...prev, ...patch } } })
        }),
      addTest: t => setState(s => touchDay({ ...s, tests: [...s.tests, t].slice(-50) })),
      pushTutor: msgs =>
        setCore(c => {
          const now = Date.now()
          // every message gets a time that is later than everything before it (S1 design §3.2)
          let last = Math.max(c.tutorClearedAt, ...c.progress.tutor.messages.map(m => m.at ?? 0))
          const stamped = msgs.map(m => ({ ...m, at: (last = Math.max(m.at ?? now, last + 1)) }))
          return {
            ...c,
            progress: { ...c.progress, tutor: { messages: [...c.progress.tutor.messages, ...stamped].slice(-60) } },
            tutorAt: Math.max(now, c.tutorAt + 1),
          }
        }),
      clearTutor: () =>
        setCore(c => {
          // the watermark is later than every message held, so the clear also wins over a stale tab's copy of them
          const t = Math.max(Date.now(), c.tutorAt + 1, c.tutorClearedAt + 1, ...c.progress.tutor.messages.map(m => (m.at ?? 0) + 1))
          return { ...c, progress: { ...c.progress, tutor: { messages: [] } }, tutorAt: t, tutorClearedAt: t }
        }),
      reset: () => {
        // owner decision C5: refused COMPLETELY (before any write) while the layout-2 upgrade has not completed
        if (replacementBlocked(store) !== null) return 'upgrade-pending'
        // a verified copy of the current state (course + preferences + tutor; NOT the history, STO-76) is kept first; without it nothing is destroyed
        if (!snapshotComposite(store, Date.now()).ok) return 'no-snapshot'
        // a higher epoch makes other tabs ADOPT the reset instead of merging their old state back in.
        // The detailed attempt history is INDEPENDENT of the core (STO-90): the fresh core carries it over and the history record is untouched.
        setCore(c => ({
          ...freshCore(),
          epoch: nextEpoch(c.epoch, Date.now()),
          activity: { ...emptyActivity(), results: c.activity.results },
          resultsMeta: c.resultsMeta ?? emptyResultsMeta(),
        }))
        return 'done'
      },
    }),
    [store],
  )

  const t = useMemo(() => makeT(state.lang), [state.lang])
  const storage = useMemo<StorageInfo>(() => {
    const adopt = (res: { core: Core; report: LoadReport }) => {
      lastSaved.current = res.core
      lastRaws.current = readRaws(store)
      persistedIds.current = new Set(res.core.credit.entries.map(e => e.id))
      coreRef.current = res.core
      setCore(res.core)
      setReport(res.report)
      setReadOnly(res.report.writesDisabled)
      setSaveFailed(res.report.status === 'unwritable' && !res.report.writesDisabled)
      saveFailedRef.current = res.report.status === 'unwritable' && !res.report.writesDisabled
      pendingRef.current = 0
      setHistoryPending(0)
      setHistoryReadonly(res.report.historyReadonly)
      setReplacedNotice(false)
      armNotice()
      return res.report
    }
    const opts = () => ({ now: Date.now(), ids: LEGACY_IDS })
    return {
      report,
      saveFailed,
      readOnly,
      noticeDismissed,
      dismissNotice: () => setDismissedEpisode(episode),
      historyPending,
      historyReadonly,
      replacedNotice,
      upgradePending: report.layout !== 'split',
      recoveryItems: () => listRecoveryItems(store),
      copies: () => inspectCopies(store, opts()),
      restore: key => {
        const res = restoreFrom(store, key, opts())
        // a failed restore must not replace what the learner is looking at
        if (res.report.status === 'unwritable' && res.report.writesDisabled) {
          setReport(res.report)
          return res.report
        }
        return adopt(res)
      },
      confirmRecovery: () => {
        const key = report.candidate?.key
        if (!key) return null
        const res = restoreFrom(store, key, opts())
        if (res.report.status === 'unwritable' && res.report.writesDisabled) {
          setReport({ ...report, reason: res.report.reason })
          return res.report
        }
        return adopt(res)
      },
      startFresh: () => adopt(startFresh(store, opts())),
      retry: () => {
        const res = loadProgress(store, opts())
        if (HEALTHY.includes(res.report.status) && !res.report.writesDisabled) return adopt(res)
        setReport(res.report)
        return res.report
      },
      retrySave: () => {
        const res = saveProgress(store, coreRef.current, Date.now(), {
          lastRaw: lastRaws.current!.core,
          lastSliceRaw: { prefs: lastRaws.current!.prefs, tutor: lastRaws.current!.tutor, results: lastRaws.current!.results },
          mode: modeRef.current,
        })
        applySave(res)
        if (res.ok) {
          lastSaved.current = res.core
          lastRaws.current = { core: res.raw, prefs: res.rawPrefs, tutor: res.rawTutor, results: res.rawResults }
          // F2 / STO-95: same stale-epoch detection as the save effect — the merge adopted another tab's replacement and the credit
          // this tab had earned is not part of it. Detected once: persistedIds is refreshed below, so a second Retry cannot re-raise it.
          const mine = coreRef.current
          if (res.core.epoch > mine.epoch && mine.credit.entries.some(e => !persistedIds.current.has(e.id) && !res.core.credit.entries.some(x => x.id === e.id))) {
            if (!replacedNotice) armNotice() // no duplicate notice for the same replacement
            setReplacedNotice(true)
          }
          if (!res.conflict && !res.resultsFailed) persistedIds.current = new Set(res.core.credit.entries.map(e => e.id))
          if (res.core !== coreRef.current) {
            coreRef.current = res.core
            setCore(res.core)
          }
        }
        return res.ok && !res.resultsFailed
      },
    }
    // applySave only touches refs and state setters (stable)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report, saveFailed, readOnly, noticeDismissed, episode, historyPending, historyReadonly, replacedNotice, store])
  const timer = useMemo(() => ({ mark: () => tracker.current!.mark(Date.now()), touch: () => tracker.current!.touch(Date.now()) }), [])
  const value = useMemo(() => ({ state, actions, t, lang: state.lang, storage, timer }), [state, actions, t, storage, timer])
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useApp() {
  const c = useContext(AppCtx)
  if (!c) throw new Error('useApp must be used inside AppProvider')
  return c
}

/**
 * Audio playback counts as active time for its duration (05 §5): while `playing` is true the learner is treated as active even without
 * pointer or key events. A short interval re-asserts activity; it stops as soon as playback stops, so it can never keep an idle tab "active".
 */
export function useKeepActive(playing: boolean) {
  const { timer } = useApp()
  useEffect(() => {
    if (!playing) return
    timer.touch()
    const id = window.setInterval(timer.touch, 20_000)
    return () => window.clearInterval(id)
  }, [playing, timer])
}

/** What a feature supplies when an attempt ends; identity, timing, course and evidence defaults are filled in by the attempt. */
export interface AttemptReport {
  activityId: string
  kind: ActivityKind
  items?: ItemOutcome[]
  score?: { earned: number; possible: number } | null
  completes?: string[]
  assisted?: boolean
  evidence?: ActivityResult['evidence']
}

/**
 * One attempt at an activity. The result id is created when the attempt STARTS (03/05), so a double-fired finish handler or a replay
 * of the same attempt is a no-op in the engine. `renew()` starts the next attempt (retry, "again").
 */
export function useAttempt() {
  const { timer, actions, state } = useApp()
  const cur = useRef<{ id: string; startedAt: number; activeStart: number } | null>(null)
  if (!cur.current) cur.current = { id: newResultId(), startedAt: Date.now(), activeStart: timer.mark() }
  const levelRef = useRef(state.level)
  levelRef.current = state.level
  return useMemo(() => {
    /** builds the full result for this attempt without recording it */
    const build = (r: AttemptReport): ActivityResult => {
      const a = cur.current!
      const finishedAt = Date.now()
      return {
        resultId: a.id,
        courseId: COURSE_ID,
        activityId: r.activityId,
        kind: r.kind,
        levelId: levelRef.current,
        startedAt: a.startedAt,
        finishedAt,
        activeMs: Math.max(0, Math.min(finishedAt - a.startedAt, timer.mark() - a.activeStart)),
        assisted: r.assisted ?? false,
        items: r.items ?? [],
        score: r.score ?? null,
        evidence: r.evidence ?? 'measured',
        completes: r.completes ?? [],
      }
    }
    return {
      build,
      /** records this attempt (idempotent: calling it twice for the same attempt changes nothing) */
      finish: (r: AttemptReport): RecordOutcome => actions.record(build(r)),
      renew: () => {
        cur.current = { id: newResultId(), startedAt: Date.now(), activeStart: timer.mark() }
      },
    }
  }, [actions, timer])
}
