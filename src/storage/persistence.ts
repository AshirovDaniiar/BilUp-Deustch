/**
 * Load / migrate / save / recover for learner progress (05 §6–§9, §11).
 *
 * Guarantees (each one is covered by tests/storage/*):
 *  G1  `loadProgress` never throws and never deletes or modifies a key it did not create. The legacy key `bilup-deutsch:v1` is read-only for us.
 *  G2  Nothing unreadable or repaired is overwritten before a verified quarantine/backup copy of its exact bytes exists.
 *  G3  A legacy record is migrated only if (a) it is interpretable, (b) a verified backup exists, (c) the destination passes a
 *      validation round trip, and (d) the destination write is read back and verified.
 *  G4  Migration is idempotent: the destination is a single key written atomically; re-running it (after a crash at any point or
 *      on purpose) yields the same record, creates no duplicate backups and never double-counts XP.
 *  G5  If we cannot guarantee G2/G3 (quota, unavailable storage, newer schema) the app runs from memory and sets `writesDisabled`.
 *  G6  RECOVERY IS NEVER AUTOMATIC-DESTRUCTIVE: when the current record is unreadable we only quarantine it and propose a candidate
 *      in memory; the stored bytes are replaced only after an explicit learner action (`restoreFrom` / `startFresh`).
 *  G7  Progress written to the legacy key by a STALE app version is merged forward (never discarded, never double counted).
 *  G8  Concurrent tabs converge: every save re-reads the record and merges (storage/merge.ts); deliberate replacements carry a higher epoch.
 */
import type { UserProgress } from '../data/types'
import { sanitizeActivity, type ActivityState } from './activity'
import { deriveCredited, POLICY_VERSION, reconcileXp, sanitizeEntries, totalXp, type CreditEntry, type CreditState } from './credit'
import { freshCore, nextEpoch, type Core, type OriginInfo, type UpgradeInfo } from './core'
import { COURSE_ID, LEGACY_PLACEHOLDER_NAME } from './defaults'
import { fingerprint } from './hash'
import { setVerified, StorageError, type KeyValueStore } from './kv'
import { canonicalJson, mergeCores, mergeTutor } from './merge'
import {
  emptyResultsMeta,
  mergeResultLists,
  mergeResultsMeta,
  readResults,
  sameResultsRecord,
  serializeResults,
  type ResultsMeta,
  type ResultsRead,
} from './results'
import {
  comparePrefs,
  LAYOUT,
  pickGroups,
  prefsOf,
  readPrefs,
  readTutor,
  serializePrefs,
  serializeTutor,
  sliceMeta,
  withPrefs,
  withTutor,
  type Group,
  type PrefsRecord,
  type SliceName,
  type SliceRead,
  type TutorRecord,
} from './slices'
import { isPlainObject, sanitizeProgress, type Issue, type SanitizedProgress } from './validate'

export { freshCore, type Core, type OriginInfo }

/** Version of the record envelope. Fields added later are OPTIONAL with defaults, so older P1 records load and upgrade in place. */
export const SCHEMA_VERSION = 2
export const BACKUPS_KEPT = 2
export const KEYS = {
  /** legacy store — never written or removed by P1 */
  legacy: 'bilup-deutsch:v1',
  current: `bilup-deutsch:v2:${COURSE_ID}`,
  /** S1: preferences and tutor transcript are separate records (learner-wide preferences carry no course id) */
  prefs: 'bilup-deutsch:prefs',
  tutor: `bilup-deutsch:tutor:${COURSE_ID}`,
  /** S2: the learner's detailed attempt history (independent of Core epochs; never removed automatically) */
  results: `bilup-deutsch:results:${COURSE_ID}`,
  backup: 'bilup-deutsch:backup:',
  quarantine: 'bilup-deutsch:quarantine:',
} as const

/** XP the legacy migrator treats as already credited. Must not be lower than the amounts of src/progress/policy.ts (checked by a test). */
export const LEGACY_AWARDS = { word: 3, topic: 20, speak: 20, real: 10, write: 15, daily: 25, quiz: 10 } as const

/** Content ids needed to map legacy completion keys onto credit keys. */
export interface LegacyIds {
  writing: ReadonlySet<string>
  /** ids of reading texts and listening exercises (their quiz paid a completion bonus) */
  quizLike: ReadonlySet<string>
  /** unit number → id of the test definition that completes `<unit>:test` */
  testByUnit: Readonly<Record<number, string>>
}
const NO_IDS: LegacyIds = { writing: new Set(), quizLike: new Set(), testByUnit: {} }

export interface ProgressRecordV2 {
  schemaVersion: typeof SCHEMA_VERSION
  courseId: string
  updatedAt: number
  epoch: number
  /** absent/0 = monolith (preferences and tutor inside `progress`); 1 = they live in their own records (S1) */
  layout?: number
  /** monolith form only (also used by composite snapshots) */
  settingsAt?: number
  tutorAt?: number
  tutorClearedAt?: number
  /** split form only: the pinned exact-bytes backup taken before the monolith was split */
  upgrade?: UpgradeInfo | null
  progress: UserProgress | Omit<UserProgress, 'name' | 'lang' | 'theme' | 'level' | 'weeklyGoal' | 'tutor'>
  credit: { entries: CreditEntry[] }
  /** layout 2: no `results` (they live in their own record) */
  activity: ActivityState | Omit<ActivityState, 'results'>
  /** composite snapshots: what the copy deliberately does not contain, e.g. ['history'] (STO-76) */
  omitted?: string[]
  extras: Record<string, unknown>
  origin: OriginInfo | null
}

/** A preference/tutor record that could not be used as stored (S1 design §4). The exact bytes are kept in quarantine. */
export interface SliceNotice {
  slice: SliceName | 'results'
  /** damaged = unreadable/repaired/anomalous (replaced by defaults, original quarantined); newer = from a newer version (left untouched); unsafe = no safe copy could be made, so it was left as it is */
  kind: 'damaged' | 'newer' | 'unsafe'
  quarantineKey: string | null
}

export type LoadStatus =
  | 'fresh'
  | 'ok'
  | 'migrated'
  | 'repaired'
  | 'recovered'
  /** the current record is unreadable; a candidate is loaded IN MEMORY and nothing is replaced until the learner confirms */
  | 'recovery-pending'
  | 'unreadable'
  | 'future-version'
  | 'unwritable'

export type DriftStatus = 'none' | 'merged' | 'unreadable' | 'deferred'

export interface RecoveryCandidate {
  /** key of the backup/quarantine copy, or the legacy key */
  key: string
  kind: 'backup' | 'quarantine' | 'legacy'
  xp: number
  completed: number
  issues: number
}

export interface LoadReport {
  status: LoadStatus
  issues: Issue[]
  backupKey: string | null
  quarantineKey: string | null
  fromLegacy: boolean
  /** true when overwriting stored data would not be safe (or needs the learner's decision): the session runs from memory only */
  writesDisabled: boolean
  reason: string | null
  /** the legacy key was changed after migration (e.g. by a stale app version) */
  legacyChangedAfterMigration: boolean
  drift: DriftStatus
  reconciledXp: number
  candidate: RecoveryCandidate | null
  /** preferences / tutor records that were damaged or newer; never blocks learning (S1 design §4) */
  sliceNotices: SliceNotice[]
  /** split = preferences and tutor are separate records; monolith = a development profile whose split could not be completed yet (saves keep the old single record) */
  layout: 'split' | 'layout1' | 'monolith'
  /** the monolith / layout-1 record was upgraded to layout 2 during this load */
  upgraded: boolean
  /** the history record was written by a newer version: results are never written this session (STO-96 history-readonly) */
  historyReadonly: boolean
  /** the operation was refused because the layout-2 upgrade has not completed (owner decision C5): nothing was written */
  blocked?: Blocked
}

export interface LoadResult {
  core: Core
  report: LoadReport
}

export interface LoadOptions {
  now: number
  ids?: LegacyIds
}

// ---------------------------------------------------------------------------------------------------------------- helpers

const report = (status: LoadStatus, over: Partial<LoadReport> = {}): LoadReport => ({
  status,
  issues: [],
  backupKey: null,
  quarantineKey: null,
  fromLegacy: false,
  writesDisabled: false,
  reason: null,
  legacyChangedAfterMigration: false,
  drift: 'none',
  reconciledXp: 0,
  candidate: null,
  sliceNotices: [],
  layout: 'split',
  upgraded: false,
  historyReadonly: false,
  ...over,
})

const parseJson = (raw: string): { ok: true; value: unknown } | { ok: false } => {
  try {
    return { ok: true, value: JSON.parse(raw) }
  } catch {
    return { ok: false }
  }
}

export type SchemaKind = 'v2' | 'future' | 'legacy' | 'invalid'

/** Version detection. Legacy v1 records carry no version field. */
export function detectSchema(value: unknown): SchemaKind {
  if (!isPlainObject(value)) return 'invalid'
  if (!('schemaVersion' in value)) return 'legacy'
  const v = value.schemaVersion
  if (typeof v !== 'number' || !Number.isInteger(v) || v < 1) return 'invalid'
  if (v > SCHEMA_VERSION) return 'future'
  if (v !== SCHEMA_VERSION || !isPlainObject(value.progress)) return 'invalid'
  return layoutOf(value) > LAYOUT ? 'future' : 'v2' // a layout this build does not know is treated exactly like a newer schema: read-only
}

/** 0 for records without a marker; a malformed marker counts as unknown (Infinity) so the record is never rewritten by mistake. */
export function layoutOf(value: Record<string, unknown>): number {
  if (value.layout === undefined) return 0
  return typeof value.layout === 'number' && Number.isInteger(value.layout) && value.layout >= 0 ? value.layout : Infinity
}

/**
 * The COMPOSITE (monolith) form: one record holding everything, exactly what builds before S1 wrote. Used for composite snapshots
 * (interim snapshot rule R-S1-2) and for importing/reading development profiles. Never carries `layout` or `upgrade`.
 */
export const serialize = (core: Core, now: number, withHistory = true): string =>
  JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    courseId: COURSE_ID,
    updatedAt: now,
    epoch: core.epoch,
    settingsAt: core.settingsAt,
    tutorAt: core.tutorAt,
    tutorClearedAt: core.tutorClearedAt,
    progress: core.progress,
    credit: { entries: core.credit.entries },
    // a composite SAFETY snapshot never contains the detailed attempt history (STO-76) and says so
    activity: withHistory ? core.activity : { ...core.activity, results: [] },
    extras: core.extras,
    origin: core.origin,
    ...(withHistory ? {} : { omitted: ['history'] }),
  } satisfies ProgressRecordV2)

const withoutSliceFields = (core: Core) => {
  const { name: _n, lang: _l, theme: _t, level: _v, weeklyGoal: _w, tutor: _u, ...rest } = core.progress
  void [_n, _l, _t, _v, _w, _u]
  return rest
}

/** The course record of layout 2: no preference/tutor fields and NO detailed history — those live in their own records. */
export function serializeCore(core: Core, now: number): string {
  const { results: _r, ...activity } = core.activity
  void _r
  return JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    courseId: COURSE_ID,
    updatedAt: now,
    epoch: core.epoch,
    layout: LAYOUT,
    upgrade: core.upgrade,
    progress: withoutSliceFields(core),
    credit: { entries: core.credit.entries },
    activity,
    extras: core.extras,
    origin: core.origin,
  } satisfies ProgressRecordV2)
}

/**
 * COMPATIBILITY form (layout 1, S1): preferences/tutor are separate, the history is still INSIDE the course record. Written only while the
 * layout-2 upgrade has not completed (design §13.13); never otherwise.
 */
export function serializeCoreLayout1(core: Core, now: number): string {
  return JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    courseId: COURSE_ID,
    updatedAt: now,
    epoch: core.epoch,
    layout: 1,
    upgrade: core.upgrade,
    progress: withoutSliceFields(core),
    credit: { entries: core.credit.entries },
    activity: core.activity,
    extras: core.extras,
    origin: core.origin,
  } satisfies ProgressRecordV2)
}

function sanitizeUpgrade(v: unknown): UpgradeInfo | null {
  if (!isPlainObject(v) || typeof v.backupKey !== 'string' || typeof v.at !== 'number') return null
  const earlier = Array.isArray(v.earlier) ? v.earlier.filter((k): k is string => typeof k === 'string') : []
  return { backupKey: v.backupKey, at: v.at, ...(earlier.length ? { earlier } : {}) }
}

function sanitizeOrigin(v: unknown): OriginInfo | null {
  if (!isPlainObject(v) || v.from !== 'legacy-v1') return null
  if (typeof v.backupKey !== 'string' || typeof v.legacyFingerprint !== 'string' || typeof v.migratedAt !== 'number') return null
  const o: OriginInfo = { from: 'legacy-v1', migratedAt: v.migratedAt, backupKey: v.backupKey, legacyFingerprint: v.legacyFingerprint }
  if (typeof v.legacyXp === 'number' && Number.isFinite(v.legacyXp) && v.legacyXp >= 0) o.legacyXp = Math.floor(v.legacyXp)
  return o
}

/** Reads a parsed v2 record. Always succeeds; every repair is reported. */
function readRecord(value: Record<string, unknown>, now: number): { core: Core; issues: Issue[]; reconciled: number } {
  const sp = sanitizeProgress(value.progress) ?? {
    value: freshCore().progress,
    extras: {},
    issues: [{ path: 'progress', problem: 'missing' }],
    recognized: 0,
  }
  const issues = [...sp.issues]
  const creditRaw = isPlainObject(value.credit) ? value.credit.entries : value.credit === undefined ? undefined : null
  if (creditRaw === null) issues.push({ path: 'credit', problem: 'expected object' })
  const se = sanitizeEntries(creditRaw ?? undefined)
  issues.push(...se.issues)
  const rec = reconcileXp(se.entries, sp.value.xp, now)
  if (rec.reconciled > 0)
    issues.push({
      path: 'xp',
      problem: `credit ledger was ${rec.reconciled} XP below the stored total; the difference was kept as a reconcile entry`,
    })
  else if (rec.xp !== sp.value.xp)
    issues.push({ path: 'xp', problem: `stored XP (${sp.value.xp}) was below the credit ledger total (${rec.xp}); ledger total used` })
  const sa = sanitizeActivity(value.activity, sp.value.completed)
  issues.push(...sa.issues)
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0)
  const progress = { ...sp.value, xp: rec.xp, completed: sa.completed }
  const extras = { ...(isPlainObject(value.extras) ? value.extras : {}), ...sp.extras }
  return {
    core: {
      progress,
      credit: { entries: rec.entries },
      activity: sa.activity,
      extras,
      origin: sanitizeOrigin(value.origin),
      epoch: num(value.epoch),
      settingsAt: num(value.settingsAt),
      tutorAt: num(value.tutorAt),
      tutorClearedAt: num(value.tutorClearedAt),
      upgrade: sanitizeUpgrade(value.upgrade),
      resultsMeta: emptyResultsMeta(),
    },
    issues,
    reconciled: rec.reconciled,
  }
}

const hasActivity = (p: UserProgress) =>
  p.xp > 0 ||
  p.completed.length > 0 ||
  p.activeDates.length > 0 ||
  Object.keys(p.mastery).length > 0 ||
  p.mistakes.length > 0 ||
  p.tests.length > 0 ||
  Object.keys(p.daily).length > 0 ||
  Object.values(p.scores).some(a => a.length > 0)

/**
 * Legacy `UserProgress` → credit ledger entries: an opening balance plus one "already credited" seed, so past activity can never re-earn
 * first-time credit (05 §11). `suffix` makes the ids unique when the same mapping is applied again to later legacy changes.
 */
export function legacyCredit(p: UserProgress, now: number, ids: LegacyIds = NO_IDS, suffix = '', openingXp = p.xp): CreditEntry[] {
  const entries: CreditEntry[] = []
  if (openingXp > 0)
    entries.push({
      id: `legacy-opening${suffix}`,
      kind: 'legacy-opening',
      key: 'legacy',
      xp: openingXp,
      policyVersion: POLICY_VERSION,
      at: now,
    })
  const credits: Record<string, number> = {}
  for (const [id, m] of Object.entries(p.mastery)) if (m.seen > 0) credits[`word:${id}`] = LEGACY_AWARDS.word
  for (const c of p.completed) {
    if (c.startsWith('topic:')) credits[`bonus:${c}`] = LEGACY_AWARDS.topic
    else if (c.startsWith('speak:')) credits[`bonus:${c}`] = LEGACY_AWARDS.speak
    else if (c.startsWith('ex:real-')) credits[`bonus:${c}`] = LEGACY_AWARDS.real
    else if (c.startsWith('ex:') && ids.writing.has(c.slice(3))) credits[`bonus:${c}`] = LEGACY_AWARDS.write
    else if (c.startsWith('ex:') && ids.quizLike.has(c.slice(3))) credits[`bonus:${c}`] = LEGACY_AWARDS.quiz
    else if (/^\d+:review$/.test(c)) credits[`bonus:${c}`] = LEGACY_AWARDS.quiz
    else if (/^\d+:test$/.test(c) && ids.testByUnit[Number(c.split(':')[0])])
      credits[`bonus:test:${ids.testByUnit[Number(c.split(':')[0])]}`] = LEGACY_AWARDS.quiz
  }
  for (const [date, d] of Object.entries(p.daily)) if (d.speaking) credits[`bonus:daily:${date}`] = LEGACY_AWARDS.daily
  if (Object.keys(credits).length)
    entries.push({ id: `legacy-seed${suffix}`, kind: 'legacy-seed', key: 'legacy', xp: 0, credits, policyVersion: POLICY_VERSION, at: now })
  return entries
}

/** Legacy blob (sanitised) → in-memory state. The old placeholder name is cleared when the learner never used the app (05 §11, V-15). */
function coreFromLegacy(sp: SanitizedProgress, now: number, ids: LegacyIds): Core {
  let progress = sp.value
  if (progress.name === LEGACY_PLACEHOLDER_NAME && !hasActivity(progress)) progress = { ...progress, name: '' }
  const a = sanitizeActivity(undefined, progress.completed)
  return {
    progress,
    credit: { entries: legacyCredit(progress, now, ids) },
    activity: a.activity,
    extras: sp.extras,
    origin: null,
    epoch: 0,
    settingsAt: 0,
    tutorAt: 0,
    tutorClearedAt: 0,
    upgrade: null,
    resultsMeta: emptyResultsMeta(),
  }
}

/** Writes an exact copy of `raw` under a content-addressed key (same bytes → same key → no duplicates). Verified by read-back. */
export function ensureCopy(kv: KeyValueStore, prefix: string, raw: string, now: number): string {
  const fp = fingerprint(raw)
  for (const k of kv.keys(prefix)) if (k.endsWith(`:${fp}`) && kv.get(k) === raw) return k
  let key = `${prefix}${String(now).padStart(13, '0')}:${fp}`
  while (kv.get(key) !== null) key += '+'
  setVerified(kv, key, raw)
  return key
}

/** The fingerprint a content-addressed copy claims to have (last segment of its key). */
const claimedFingerprint = (key: string) => key.slice(key.lastIndexOf(':') + 1).replace(/\+$/g, '')
const isContentAddressed = (key: string) => key.startsWith(KEYS.backup) || key.startsWith(KEYS.quarantine)

/**
 * Keeps the newest `keep` backups PLUS the pinned ones (the pristine pre-migration copy). `fresh` — the copy that was just created — is
 * never removed, even if its timestamp sorts oddly. Never touches quarantine copies, the legacy key or the current record.
 */
export function rotateBackups(kv: KeyValueStore, keep: number, pinned: readonly string[] = [], fresh?: string): string[] {
  const keys = kv.keys(KEYS.backup).filter(k => !pinned.includes(k))
  const removable = keys.filter(k => k !== fresh).slice(0, Math.max(0, keys.length - keep))
  for (const k of removable) kv.remove(k)
  return removable
}

/**
 * The backups that must survive rotation: the pristine pre-migration copy of the legacy bytes, and (S1) the exact bytes of a monolith
 * record taken before it was split. Both are named by the current record.
 */
function pinnedBackups(kv: KeyValueStore): string[] {
  try {
    const raw = kv.get(KEYS.current)
    const p = raw === null ? null : parseJson(raw)
    if (!p || !p.ok || !isPlainObject(p.value)) return []
    const origin = sanitizeOrigin(p.value.origin)
    const upgrade = sanitizeUpgrade(p.value.upgrade)
    return [...(origin ? [origin.backupKey] : []), ...(upgrade ? [upgrade.backupKey, ...(upgrade.earlier ?? [])] : [])]
  } catch {
    return []
  }
}

// ------------------------------------------------------------------------------------------------- slices: compose / resolve (S1)

type SliceStatus = 'absent' | 'applied' | 'repaired' | 'stale' | 'anomalous' | 'damaged' | 'future'

interface Composed {
  core: Core
  layout: 0 | 1 | 2
  status: Record<SliceName | 'results', SliceStatus>
}

/** The history record's own state is never "stale"/"anomalous": it is independent of Core epochs (STO-90). */
function resultsStatus(read: ResultsRead): SliceStatus {
  return read.state === 'absent' ? 'absent' : read.state === 'ok' ? (read.issues.length > 0 ? 'repaired' : 'applied') : read.state
}

/** History in the course record (layout 0/1) UNION the history record: nothing is ever dropped. */
function withResults(core: Core, read: ResultsRead): Core {
  if (read.state !== 'ok') return core
  return {
    ...core,
    activity: { ...core.activity, results: mergeResultLists(core.activity.results, read.results) },
    resultsMeta: mergeResultsMeta(core.resultsMeta, read.meta),
  }
}

/**
 * Monolith record + whatever slices already exist (a crash between the steps of the split leaves both). Preferences: the slice wins only
 * if it is not older (epoch, updatedAt, canonical JSON — S1 design §3.1). Tutor: the two are MERGED, so no message is ever lost.
 * A slice from an older epoch is ignored; one from a newer epoch replaces the monolith's value. Pure.
 */
function mergeMonolithWithSlices(core: Core, prefs: SliceRead<PrefsRecord>, tutor: SliceRead<TutorRecord>): Core {
  let c = core
  if (prefs.state === 'ok' && prefs.rec.epoch >= core.epoch) {
    const mono = { epoch: core.epoch, updatedAt: core.settingsAt, fields: prefsOf(core) }
    if (comparePrefs({ epoch: prefs.rec.epoch, updatedAt: prefs.rec.updatedAt, fields: prefs.rec }, mono) >= 0) c = withPrefs(c, prefs.rec)
  }
  if (tutor.state === 'ok' && tutor.rec.epoch >= core.epoch) {
    if (tutor.rec.epoch > core.epoch) c = withTutor(c, tutor.rec)
    else {
      const m = mergeTutor(
        { messages: c.progress.tutor.messages, clearedAt: c.tutorClearedAt },
        { messages: tutor.rec.messages, clearedAt: tutor.rec.clearedAt },
      )
      c = {
        ...c,
        progress: { ...c.progress, tutor: { messages: m.messages } },
        tutorAt: Math.max(c.tutorAt, tutor.rec.updatedAt),
        tutorClearedAt: m.clearedAt,
      }
    }
  }
  return c
}

function classify(read: SliceRead<{ epoch: number }>, coreEpoch: number): SliceStatus {
  if (read.state === 'absent') return 'absent'
  if (read.state === 'damaged') return 'damaged'
  if (read.state === 'future') return 'future'
  if (read.rec.epoch < coreEpoch) return 'stale'
  if (read.rec.epoch > coreEpoch) return 'anomalous'
  return read.issues.length > 0 ? 'repaired' : 'applied'
}

/** Pure: interprets the three stored strings as one state. Never writes. `value` is the parsed core record (detectSchema === 'v2'). */
function compose(
  value: Record<string, unknown>,
  rawPrefs: string | null,
  rawTutor: string | null,
  rawResults: string | null,
  now: number,
): Composed & { r: ReturnType<typeof readRecord> } {
  const r = readRecord(value, now)
  const prefs = readPrefs(rawPrefs)
  const tutor = readTutor(rawTutor)
  const results = readResults(rawResults)
  const layout = layoutOf(value) as 0 | 1 | 2
  if (layout === 0) {
    const status = (read: SliceRead<{ epoch: number }>): SliceStatus =>
      read.state === 'absent' ? 'absent' : read.state === 'ok' ? 'applied' : read.state
    return {
      r,
      core: withResults(mergeMonolithWithSlices(r.core, prefs, tutor), results),
      layout,
      status: { prefs: status(prefs), tutor: status(tutor), results: resultsStatus(results) },
    }
  }
  const status = { prefs: classify(prefs, r.core.epoch), tutor: classify(tutor, r.core.epoch), results: resultsStatus(results) }
  let core = r.core
  if (prefs.state === 'ok' && (status.prefs === 'applied' || status.prefs === 'repaired')) core = withPrefs(core, prefs.rec)
  if (tutor.state === 'ok' && (status.tutor === 'applied' || status.tutor === 'repaired')) core = withTutor(core, tutor.rec)
  return { r, core: withResults(core, results), layout, status }
}

/** Which groups of a stored state are meaningful to merge: slices that are absent, stale, damaged or from a newer version are not. */
function mergeableGroups(
  c: Composed,
  coreChanged: boolean,
  prefsChanged: boolean,
  tutorChanged: boolean,
  resultsChanged: boolean,
): Set<Group> {
  const g = new Set<Group>()
  if (coreChanged) g.add('core')
  const usable = (s: SliceStatus) => s === 'applied' || s === 'repaired'
  if (c.layout === 0) {
    if (coreChanged) {
      g.add('prefs')
      g.add('tutor')
    }
  } else {
    if (prefsChanged && usable(c.status.prefs)) g.add('prefs')
    if (tutorChanged && usable(c.status.tutor)) g.add('tutor')
  }
  // history: it travels with the course record before layout 2, and is its own record from layout 2 on; it is only ever UNIONED
  if ((c.layout < 2 && coreChanged) || (c.layout === 2 && resultsChanged && usable(c.status.results))) g.add('results')
  return g
}

/** Round trip: what we are about to write must read back as the same state (all three records). */
function roundTripOk(core: Core, now: number): boolean {
  const back = parseJson(serializeCore(core, now))
  if (!back.ok || detectSchema(back.value) !== 'v2') return false
  const c = compose(
    back.value as Record<string, unknown>,
    serializePrefs(core),
    serializeTutor(core),
    core.activity.results.length > 0 ? serializeResults(core.activity.results, core.resultsMeta, core.epoch, now) : null,
    now,
  )
  return (
    c.r.issues.length === 0 &&
    c.layout === 2 &&
    c.status.prefs === 'applied' &&
    c.status.tutor === 'applied' &&
    JSON.stringify(c.core.progress) === JSON.stringify(core.progress) &&
    c.core.settingsAt === core.settingsAt &&
    c.core.tutorAt === core.tutorAt &&
    c.core.tutorClearedAt === core.tutorClearedAt &&
    totalXp(c.core.credit.entries) === core.progress.xp
  )
}

const memoryResult = (core: Core, r: LoadReport): LoadResult => ({ core, report: r })

/**
 * First write of a whole state. Creations (legacy migration) write the slices FIRST and the core LAST — the core is the commit marker,
 * so a crash leaves no half-adopted state. Replacements (restore, start fresh) write the CORE first: slices of the older epoch are then
 * ignored, and a slice that could not be written is healed by the next save.
 */
function commitSplit(kv: KeyValueStore, core: Core, now: number, order: 'slices-first' | 'core-first'): void {
  const writeCore = () => setVerified(kv, KEYS.current, serializeCore(core, now))
  const writeSlices = () => {
    setVerified(kv, KEYS.prefs, serializePrefs(core))
    setVerified(kv, KEYS.tutor, serializeTutor(core))
  }
  if (order === 'slices-first') {
    writeSlices()
    writeCore()
  } else {
    writeCore()
    try {
      writeSlices()
    } catch {
      /* stale-epoch slices are ignored on load and the next save writes the missing ones */
    }
  }
}

const quarantine = (kv: KeyValueStore, raw: string, now: number): string | null => {
  try {
    return ensureCopy(kv, KEYS.quarantine, raw, now)
  } catch {
    return null
  }
}

/**
 * Layout-1 load: decides for each slice whether it is used, and repairs what must be repaired — exact bytes in quarantine FIRST
 * (S1 design §4). A stale-epoch slice is the expected leftover of a deliberate replacement and is overwritten by defaults silently.
 */
function resolveSlices(kv: KeyValueStore, core: Core, now: number): { core: Core; notices: SliceNotice[] } {
  const notices: SliceNotice[] = []
  let c = core
  const one = <T extends { epoch: number }>(
    name: SliceName,
    key: string,
    raw: string | null,
    read: SliceRead<T>,
    rawDefault: () => string,
    rawSanitized: (rec: T) => string,
    apply: (rec: T) => void,
  ) => {
    const status = classify(read, core.epoch)
    const replaceWith = (text: string) => {
      try {
        setVerified(kv, key, text)
      } catch {
        /* runs from memory; the next save writes it */
      }
    }
    if (status === 'absent') return
    if (status === 'future') return void notices.push({ slice: name, kind: 'newer', quarantineKey: null })
    if (status === 'stale') return replaceWith(rawDefault())
    if (raw === null) return
    if (status === 'applied' && read.state === 'ok') return apply(read.rec)
    // damaged | anomalous | repaired: keep the exact bytes before anything is replaced
    const q = quarantine(kv, raw, now)
    if (q === null) {
      notices.push({ slice: name, kind: 'unsafe', quarantineKey: null })
      if (status === 'repaired' && read.state === 'ok') apply(read.rec) // usable in memory; the stored bytes stay as they are
      return
    }
    notices.push({ slice: name, kind: 'damaged', quarantineKey: q })
    if (status === 'repaired' && read.state === 'ok') {
      apply(read.rec)
      replaceWith(rawSanitized(read.rec))
    } else replaceWith(rawDefault())
  }
  one(
    'prefs',
    KEYS.prefs,
    kv.get(KEYS.prefs),
    readPrefs(kv.get(KEYS.prefs)),
    () => serializePrefs(withPrefs(core, null)),
    rec => serializePrefs(withPrefs(core, rec)),
    rec => (c = withPrefs(c, rec)),
  )
  one(
    'tutor',
    KEYS.tutor,
    kv.get(KEYS.tutor),
    readTutor(kv.get(KEYS.tutor)),
    () => serializeTutor(withTutor(core, null)),
    rec => serializeTutor(withTutor(core, rec)),
    rec => (c = withTutor(c, rec)),
  )
  return { core: c, notices }
}

/**
 * Layout-2 load: the history record (S2). It is independent of Core epochs. Damaged ⇒ the exact bytes are quarantined FIRST, then the
 * record is replaced by a valid one holding the same entries (none) — never silently; newer version ⇒ left untouched, history-readonly.
 * With `write: false` (read-only sessions) it only reads.
 */
function settleResults(
  kv: KeyValueStore,
  core: Core,
  now: number,
  write: boolean,
): { core: Core; notices: SliceNotice[]; historyReadonly: boolean } {
  const raw = kv.get(KEYS.results)
  const read = readResults(raw)
  if (read.state === 'absent') return { core, notices: [], historyReadonly: false }
  if (read.state === 'future') return { core, notices: [{ slice: 'results', kind: 'newer', quarantineKey: null }], historyReadonly: true }
  if (read.state === 'damaged') {
    if (!write || raw === null) return { core, notices: [], historyReadonly: false }
    const q = quarantine(kv, raw, now)
    if (q === null) return { core, notices: [{ slice: 'results', kind: 'unsafe', quarantineKey: null }], historyReadonly: false }
    try {
      setVerified(kv, KEYS.results, serializeResults(core.activity.results, core.resultsMeta, core.epoch, now))
    } catch {
      /* runs from memory; the next save writes it */
    }
    return { core, notices: [{ slice: 'results', kind: 'damaged', quarantineKey: q }], historyReadonly: false }
  }
  const merged = withResults(core, read)
  if (read.issues.length > 0 && write) {
    const q = quarantine(kv, raw!, now)
    if (q === null) return { core: merged, notices: [{ slice: 'results', kind: 'unsafe', quarantineKey: null }], historyReadonly: false }
    try {
      setVerified(kv, KEYS.results, serializeResults(merged.activity.results, merged.resultsMeta, core.epoch, now))
    } catch {
      /* the next save writes it */
    }
    return { core: merged, notices: [{ slice: 'results', kind: 'damaged', quarantineKey: q }], historyReadonly: false }
  }
  return { core: merged, notices: [], historyReadonly: false }
}

interface UpgradeOutcome {
  core: Core
  /**
   * split = layout 2 reached (or already reached by another tab);
   * layout1 / monolith = COMPATIBILITY MODE: the upgrade could not be completed, saves keep the old record form (history stays inside it) and
   * Reset / Start Fresh / Core Restore / Rollback are REFUSED until it succeeds (owner decision C5, design §13.13)
   */
  mode: 'split' | 'layout1' | 'monolith'
  upgraded: boolean
  notices: SliceNotice[]
  /** another writer changed the core while the upgrade ran: start over from what is stored now */
  raced?: boolean
  /** stored data from a newer version: nothing may be written */
  blocked?: string
  /** the history record is from a newer version */
  historyReadonly?: boolean
}

/**
 * Development profiles only (STO-13): upgrade a layout-0 (monolith) or layout-1 (S1) course record to layout 2. Steps, each verified:
 *   R1 exact-bytes backup of the stored course record (pinned once the new core names it)
 *   (layout 0 only: the preferences and tutor records are written first — the S1 steps U2/U3)
 *   R2 the history record: UNION of the history found inside the course record and any existing history record — merged, never replaced
 *   R3 verification (every attempt id present in the history record; the course record unchanged by anyone else), then the course
 *      record WITHOUT history and with \`layout: 2\` and the pin — written LAST: it is the only completion marker.
 * Nothing is destructive before R3, and R3 only drops fields whose values are already in verified records. Idempotent and resumable at any
 * point. A failure leaves ALL data intact and the session in compatibility mode (history stays inside the course record, in memory it is
 * already the union).
 */
function upgradeToLayout2(kv: KeyValueStore, raw: string, core: Core, layout: 0 | 1, now: number): UpgradeOutcome {
  const compat: 'layout1' | 'monolith' = layout === 0 ? 'monolith' : 'layout1'
  let merged = core
  const notices: SliceNotice[] = []
  let rawPrefs: string | null = null
  let rawTutor: string | null = null
  if (layout === 0) {
    rawPrefs = kv.get(KEYS.prefs)
    rawTutor = kv.get(KEYS.tutor)
    const prefs = readPrefs(rawPrefs)
    const tutor = readTutor(rawTutor)
    if (prefs.state === 'future' || tutor.state === 'future')
      return {
        core,
        mode: compat,
        upgraded: false,
        notices: [],
        blocked: 'a stored preferences or tutor record was written by a newer version of the app',
      }
    merged = mergeMonolithWithSlices(core, prefs, tutor)
    for (const [name, rawS, read] of [
      ['prefs', rawPrefs, prefs],
      ['tutor', rawTutor, tutor],
    ] as const) {
      if (rawS === null || read.state === 'absent') continue
      if (read.state === 'damaged' || (read.state === 'ok' && read.issues.length > 0)) {
        const q = quarantine(kv, rawS, now)
        notices.push({ slice: name, kind: q === null ? 'unsafe' : 'damaged', quarantineKey: q })
        if (q === null) return { core: merged, mode: compat, upgraded: false, notices }
      }
    }
  }
  const rawResults = kv.get(KEYS.results)
  const res = readResults(rawResults)
  if (res.state === 'future')
    return {
      core: merged,
      mode: compat,
      upgraded: false,
      notices: [...notices, { slice: 'results', kind: 'newer', quarantineKey: null }],
      historyReadonly: true,
    }
  if (res.state === 'damaged' || (res.state === 'ok' && res.issues.length > 0)) {
    const q = quarantine(kv, rawResults!, now) // exact bytes first; R2 then writes a valid record containing everything that is known
    notices.push({ slice: 'results', kind: q === null ? 'unsafe' : 'damaged', quarantineKey: q })
    if (q === null) return { core: merged, mode: compat, upgraded: false, notices }
  }
  merged = withResults(merged, res)
  const unsafe = (): UpgradeOutcome => ({ core: merged, mode: compat, upgraded: false, notices })

  let backupKey: string
  try {
    backupKey = ensureCopy(kv, KEYS.backup, raw, now) // R1: the complete original bytes
  } catch {
    return unsafe()
  }
  try {
    if (layout === 0) {
      const p = serializePrefs(merged)
      if (rawPrefs !== p) setVerified(kv, KEYS.prefs, p) // U2
      const t = serializeTutor(merged)
      if (rawTutor !== t) setVerified(kv, KEYS.tutor, t) // U3
    }
    // R2: merge-write the history record (it may already exist: a crash between R2 and R3 leaves both)
    const next = serializeResults(merged.activity.results, merged.resultsMeta, core.epoch, now)
    if (merged.activity.results.length > 0 || rawResults !== null) {
      if (rawResults === null || !sameResultsRecord(rawResults, next) || res.state !== 'ok') setVerified(kv, KEYS.results, next)
    }
    // R3: verify BEFORE the completion marker is written
    if (merged.activity.results.length > 0) {
      const back = readResults(kv.get(KEYS.results))
      if (back.state !== 'ok') return unsafe()
      const have = new Set(back.results.map(r => r.resultId))
      if (merged.activity.results.some(r => !have.has(r.resultId))) return unsafe()
    }
    // another tab may have written the course record (or finished this very upgrade) meanwhile — never overwrite it
    if (kv.get(KEYS.current) !== raw) return { core: merged, mode: compat, upgraded: false, notices, raced: true }
    if (kv.get(backupKey) !== raw) backupKey = ensureCopy(kv, KEYS.backup, raw, now)
    const earlier = core.upgrade ? [core.upgrade.backupKey, ...(core.upgrade.earlier ?? [])] : []
    const done: Core = { ...merged, upgrade: { backupKey, at: now, ...(earlier.length ? { earlier } : {}) } }
    setVerified(kv, KEYS.current, serializeCore(done, now))
    return { core: done, mode: 'split', upgraded: true, notices }
  } catch {
    return unsafe()
  }
}

// ---------------------------------------------------------------------------------------------------------------- write (S1)

/** Equal ignoring the record's own write time (`updatedAt`), so an unchanged record is not rewritten just because time passed. */
function sameRecord(stored: string | null, next: string): boolean {
  if (stored === null) return false
  if (stored === next) return true
  const a = parseJson(stored)
  const b = parseJson(next)
  if (!a.ok || !b.ok || !isPlainObject(a.value) || !isPlainObject(b.value)) return false
  return JSON.stringify({ ...a.value, updatedAt: 0 }) === JSON.stringify({ ...b.value, updatedAt: 0 })
}

/**
 * Whether the stored course record already holds the state we are about to write. Textual equality (ignoring the write time) is the fast
 * path; otherwise both are read and compared in canonical form, so a state that was merely re-ordered by a merge is not rewritten.
 */
function sameCoreRecord(stored: string | null, next: string): boolean {
  if (sameRecord(stored, next)) return true
  if (stored === null) return false
  const a = parseJson(stored)
  const b = parseJson(next)
  if (!a.ok || !b.ok || !isPlainObject(a.value) || !isPlainObject(b.value)) return false
  if (detectSchema(a.value) !== 'v2' || detectSchema(b.value) !== 'v2' || layoutOf(a.value) !== layoutOf(b.value)) return false
  return canonicalJson(readRecord(a.value, 0).core, 0) === canonicalJson(readRecord(b.value, 0).core, 0)
}

function storedCoreEpoch(kv: KeyValueStore): number {
  const raw = kv.get(KEYS.current)
  const p = raw === null ? null : parseJson(raw)
  return p && p.ok && isPlainObject(p.value) && typeof p.value.epoch === 'number' ? p.value.epoch : 0
}

type WriteMode = 'split' | 'layout1' | 'monolith'

interface Written {
  core: string | null
  prefs: string | null
  tutor: string | null
  results: string | null
  /** another tab replaced the state (higher epoch) while we were writing: our CORE records were not (or are no longer) authoritative */
  conflict: boolean
  /** the history record could not be written (the core may still have been): the entries stay pending in memory (STO-96) */
  resultsError?: Error
  /** the history record is from a newer version: it is never written this session (history-readonly) */
  historyReadonly?: boolean
  /** history entries held in memory that are NOT in the stored history record */
  pending: number
}

/**
 * The history record (S2): ALWAYS read → union-merge → write. It ignores the core's replace mode and the core-epoch guard (STO-90): a
 * replacement of the core never replaces or empties the history, and a stale tab can only ADD entries. Entries are never removed. A damaged
 * record is quarantined before it is replaced; a record from a newer version is never touched. Never throws (STO-80: a history failure must
 * not block the credit): the failure is returned.
 */
function writeResultsRecord(
  kv: KeyValueStore,
  core: Core,
  now: number,
): { raw: string | null; error?: Error; readonly?: boolean; pending: number } {
  let stored: string | null = null
  try {
    stored = kv.get(KEYS.results)
    const read = readResults(stored)
    if (read.state === 'future') return { raw: stored, readonly: true, pending: core.activity.results.length }
    let storedResults: StoredResultList = []
    let storedMeta: ResultsMeta = emptyResultsMeta()
    if (read.state === 'ok') {
      storedResults = read.results
      storedMeta = read.meta
    } else if (read.state === 'damaged' && stored !== null) ensureCopy(kv, KEYS.quarantine, stored, now) // throws: nothing is replaced
    const merged = mergeResultLists(storedResults, core.activity.results)
    const meta = mergeResultsMeta(storedMeta, core.resultsMeta)
    if (stored === null && merged.length === 0 && !meta.deletions && Object.keys(meta.ext).length === 0) return { raw: null, pending: 0 }
    const next = serializeResults(merged, meta, core.epoch, now)
    if (read.state === 'ok' && sameResultsRecord(stored, next)) return { raw: stored, pending: 0 }
    setVerified(kv, KEYS.results, next)
    return { raw: next, pending: 0 }
  } catch (e) {
    const have = new Set(readResultsIds(stored))
    return {
      raw: stored,
      error: e instanceof Error ? e : new Error(String(e)),
      pending: core.activity.results.filter(r => !have.has(r.resultId)).length,
    }
  }
}
type StoredResultList = Core['activity']['results']
const readResultsIds = (raw: string | null): string[] => {
  const r = readResults(raw)
  return r.state === 'ok' ? r.results.map(x => x.resultId) : []
}

/**
 * Writes every record whose content changed and ONLY those (write isolation, STO-02/STO-81). Order (design §3.3): the HISTORY record
 * first (additions before the core), then the course record, then preferences, then tutor. Guards (S1 design §6): a slice is never
 * written over a stored slice or core of a HIGHER epoch (the other tab's replacement wins); after writing, the core epoch is checked
 * again and a conflict is reported. A slice from a newer version is never rewritten; a damaged one is quarantined first. A course record
 * of an older layout is preserved byte-for-byte before a newer layout replaces it. Compatibility modes keep the old record forms.
 */
function writeChanged(kv: KeyValueStore, core: Core, now: number, mode: WriteMode, slicesFirst = false): Written {
  const out: Written = {
    core: null,
    prefs: kv.get(KEYS.prefs),
    tutor: kv.get(KEYS.tutor),
    results: kv.get(KEYS.results),
    conflict: false,
    pending: 0,
  }
  if (mode === 'split') {
    const r = writeResultsRecord(kv, core, now)
    out.results = r.raw
    out.resultsError = r.error
    out.historyReadonly = r.readonly
    out.pending = r.pending
  }
  const storedCore = kv.get(KEYS.current)
  if (mode === 'monolith') {
    const next = serialize(core, now)
    const same = sameCoreRecord(storedCore, next)
    if (!same) setVerified(kv, KEYS.current, next)
    out.core = same ? storedCore : next
    return out
  }
  const nextCore = mode === 'split' ? serializeCore(core, now) : serializeCoreLayout1(core, now)
  if (storedCore !== null && storedCoreEpoch(kv) > core.epoch) {
    out.core = storedCore
    out.conflict = true // another tab replaced the state after we last looked: its records win, nothing of ours is written over them
    return out
  }
  const outLayout = mode === 'split' ? LAYOUT : 1
  const writeCoreRecord = () => {
    if (sameCoreRecord(storedCore, nextCore)) {
      out.core = storedCore
      return
    }
    if (storedCore !== null) {
      const p = parseJson(storedCore)
      if (p.ok && isPlainObject(p.value) && detectSchema(p.value) === 'v2' && layoutOf(p.value) < outLayout)
        ensureCopy(kv, KEYS.backup, storedCore, now) // throws: nothing is overwritten
    }
    setVerified(kv, KEYS.current, nextCore)
    out.core = nextCore
  }
  // Normally the core goes first. When the core carries a "processed up to here" marker (legacy drift), the records it summarises go
  // FIRST, so a crash can only repeat the (idempotent) merge, never lose it.
  // the same applies whenever a save moves the drift marker (the `storage` event path saves the merged state normally)
  if (!slicesFirst && storedCore !== null) {
    const sp = parseJson(storedCore)
    const before = sp.ok && isPlainObject(sp.value) ? sanitizeOrigin(sp.value.origin)?.legacyFingerprint : undefined
    slicesFirst = core.origin !== null && core.origin.legacyFingerprint !== before
  }
  if (!slicesFirst) writeCoreRecord()
  const slices = [
    { name: 'prefs' as const, key: KEYS.prefs, next: serializePrefs(core), read: readPrefs },
    { name: 'tutor' as const, key: KEYS.tutor, next: serializeTutor(core), read: readTutor },
  ]
  for (const s of slices) {
    const stored = kv.get(s.key)
    if (stored === s.next) continue
    const meta = sliceMeta(stored)
    if (meta.future) continue // a newer version's record is never rewritten
    if ((meta.epoch ?? 0) > core.epoch || storedCoreEpoch(kv) > core.epoch) {
      out.conflict = true // someone replaced the state after we last looked: do not write over it
      continue
    }
    if (stored !== null && s.read(stored).state === 'damaged') ensureCopy(kv, KEYS.quarantine, stored, now) // throws: not replaced
    setVerified(kv, s.key, s.next)
    out[s.name] = s.next
    if (storedCoreEpoch(kv) > core.epoch) out.conflict = true // a replacement landed between our check and our write: ours is stale and will be ignored
  }
  if (slicesFirst) writeCoreRecord()
  return out
}

// ----------------------------------------------------------------------------------------------- preserving the whole current state

export interface Preserved {
  /** false = a copy that would be needed could not be made: the caller must NOT go on to destroy anything */
  ok: boolean
  /** the single record that contains the composed state (null when there was nothing stored) */
  key: string | null
  /** records that are NOT inside `key` (damaged or from a newer version); their exact bytes were quarantined separately */
  omitted: Array<SliceName | 'history'>
  error?: string
}

/**
 * Interim snapshot rule (STO-17, S1 design §2): one content-addressed record in the monolith format holding core + preferences + tutor,
 * so no snapshot silently omits either. A slice that cannot be composed (damaged, newer) is quarantined byte-for-byte and listed in
 * `omitted`. When the core itself is unreadable its exact bytes are kept and each existing slice is kept byte-for-byte too.
 */
export function preserveCurrent(kv: KeyValueStore, now: number, prefix: string): Preserved {
  try {
    const rawCore = kv.get(KEYS.current)
    const rawPrefs = kv.get(KEYS.prefs)
    const rawTutor = kv.get(KEYS.tutor)
    if (rawCore === null && rawPrefs === null && rawTutor === null) return { ok: true, key: null, omitted: [] }
    const p = rawCore === null ? null : parseJson(rawCore)
    const readable = p && p.ok && isPlainObject(p.value) && detectSchema(p.value) === 'v2'
    if (!readable) {
      const key = rawCore === null ? null : ensureCopy(kv, prefix, rawCore, now)
      if (rawPrefs !== null) ensureCopy(kv, KEYS.quarantine, rawPrefs, now)
      if (rawTutor !== null) ensureCopy(kv, KEYS.quarantine, rawTutor, now)
      return { ok: true, key, omitted: [] }
    }
    // the history record is deliberately NOT read: a composite safety snapshot never contains the detailed attempt history (STO-76)
    const c = compose((p as { value: Record<string, unknown> }).value, rawPrefs, rawTutor, null, now)
    const omitted: Array<SliceName | 'history'> = []
    for (const [name, rawS] of [
      ['prefs', rawPrefs],
      ['tutor', rawTutor],
    ] as const) {
      const st = c.status[name]
      if (rawS !== null && (st === 'damaged' || st === 'anomalous' || st === 'future' || st === 'repaired')) {
        ensureCopy(kv, KEYS.quarantine, rawS, now)
        if (st !== 'repaired') omitted.push(name)
      }
    }
    omitted.push('history') // always, and visibly (the marker is also written into the snapshot)
    return { ok: true, key: ensureCopy(kv, prefix, serialize(c.core, now, false), now), omitted }
  } catch (e) {
    return { ok: false, key: null, omitted: [], error: (e as Error).message }
  }
}

// ------------------------------------------------------------------------------------------------------------------ load

export function loadProgress(kv: KeyValueStore, opts: LoadOptions): LoadResult {
  let rawCurrent: string | null
  let rawLegacy: string | null
  try {
    rawCurrent = kv.get(KEYS.current)
    rawLegacy = kv.get(KEYS.legacy)
  } catch (e) {
    return memoryResult(freshCore(), report('unwritable', { writesDisabled: true, reason: `storage unavailable: ${(e as Error).message}` }))
  }
  try {
    return settleLoaded(kv, loadInner(kv, rawCurrent, rawLegacy, opts), opts.now)
  } catch (e) {
    // last-resort guard: an unforeseen error must neither crash the app nor lead to any write
    return memoryResult(
      freshCore(),
      report('unwritable', { writesDisabled: true, reason: `unexpected error: ${(e as Error)?.message ?? String(e)}` }),
    )
  }
}

/**
 * The history record is independent of everything the loader decided about the core (STO-90): whatever core was produced — migrated, fresh,
 * recovered, candidate — the stored history is attached to it (read-only sessions only read). Compatibility modes already carry the union.
 */
function settleLoaded(kv: KeyValueStore, res: LoadResult, now: number): LoadResult {
  if (res.report.status === 'future-version' || res.report.layout !== 'split') return res
  const s = settleResults(kv, res.core, now, !res.report.writesDisabled)
  if (s.notices.length === 0 && !s.historyReadonly && s.core === res.core) return res
  return {
    core: s.core,
    report: {
      ...res.report,
      sliceNotices: [...res.report.sliceNotices, ...s.notices],
      historyReadonly: res.report.historyReadonly || s.historyReadonly,
    },
  }
}

function loadInner(kv: KeyValueStore, rawCurrent: string | null, rawLegacy: string | null, opts: LoadOptions, attempt = 0): LoadResult {
  if (rawCurrent !== null) {
    const parsed = parseJson(rawCurrent)
    if (parsed.ok) {
      const kind = detectSchema(parsed.value)
      if (kind === 'future') {
        return memoryResult(
          freshCore(),
          report('future-version', { writesDisabled: true, reason: 'stored data was written by a newer version of the app' }),
        )
      }
      if (kind === 'v2') return loadCurrent(kv, rawCurrent, parsed.value as Record<string, unknown>, rawLegacy, opts, attempt)
    }
    return recoverUnusableCurrent(kv, rawCurrent, rawLegacy, opts)
  }
  if (rawLegacy !== null) return migrateLegacy(kv, rawLegacy, opts)
  return adoptOrphans(kv, opts)
}

/** No course record and no legacy record: preferences / tutor records that survive on their own are the learner's — adopt them. */
function adoptOrphans(kv: KeyValueStore, opts: LoadOptions): LoadResult {
  const { now } = opts
  const rawPrefs = kv.get(KEYS.prefs)
  const rawTutor = kv.get(KEYS.tutor)
  if (rawPrefs === null && rawTutor === null) return memoryResult(freshCore(), report('fresh'))
  let core = freshCore()
  const notices: SliceNotice[] = []
  const prefs = readPrefs(rawPrefs)
  const tutor = readTutor(rawTutor)
  for (const [name, rawS, read] of [
    ['prefs', rawPrefs, prefs],
    ['tutor', rawTutor, tutor],
  ] as const) {
    if (read.state === 'future') notices.push({ slice: name, kind: 'newer', quarantineKey: null })
    else if (rawS !== null && (read.state === 'damaged' || (read.state === 'ok' && read.issues.length > 0))) {
      const q = quarantine(kv, rawS, now)
      notices.push({ slice: name, kind: q === null ? 'unsafe' : 'damaged', quarantineKey: q })
    }
  }
  const epoch = Math.max(prefs.state === 'ok' ? prefs.rec.epoch : 0, tutor.state === 'ok' ? tutor.rec.epoch : 0)
  core = { ...core, epoch }
  if (prefs.state === 'ok') core = withPrefs(core, prefs.rec)
  if (tutor.state === 'ok') core = withTutor(core, tutor.rec)
  return memoryResult(core, report('fresh', { sliceNotices: notices }))
}

function loadCurrent(
  kv: KeyValueStore,
  raw: string,
  value: Record<string, unknown>,
  rawLegacy: string | null,
  opts: LoadOptions,
  attempt = 0,
): LoadResult {
  const { now } = opts
  const r = readRecord(value, now)

  // Repairs were needed: keep the exact original bytes FIRST, only then rewrite the sanitised record.
  let quarantineKey: string | null = null
  if (r.issues.length > 0) {
    try {
      quarantineKey = ensureCopy(kv, KEYS.quarantine, raw, now)
    } catch (e) {
      return memoryResult(
        r.core,
        report('unwritable', { issues: r.issues, writesDisabled: true, reason: `could not quarantine original: ${(e as Error).message}` }),
      )
    }
  }

  let core = r.core
  let notices: SliceNotice[] = []
  let mode: 'split' | 'layout1' | 'monolith' = 'split'
  let upgraded = false
  let historyReadonly = false
  const layout = layoutOf(value)
  if (layout === 1) {
    const rs = resolveSlices(kv, core, now) // layout 1 (S1): preferences/tutor records first
    core = rs.core
    notices = rs.notices
  } else if (layout === 2) {
    const rs = resolveSlices(kv, core, now)
    core = rs.core
    notices = rs.notices
  }
  if (layout === 0 || layout === 1) {
    // the upgrade to layout 2 (migration plan R0–R4); a failure leaves ALL data intact and the session in compatibility mode (C5)
    const up = upgradeToLayout2(kv, raw, core, layout, now)
    if (up.blocked) return memoryResult(up.core, report('future-version', { writesDisabled: true, reason: up.blocked }))
    if (up.raced && attempt < 2) return loadInner(kv, kv.get(KEYS.current), rawLegacy, opts, attempt + 1) // adopt what the other writer stored
    core = up.core
    notices = [...notices, ...up.notices]
    mode = up.mode
    upgraded = up.upgraded
    historyReadonly = up.historyReadonly === true
  }

  const d = applyLegacyDrift(kv, core, rawLegacy, now, opts.ids ?? NO_IDS)
  if (r.issues.length > 0 || d.drift === 'merged' || d.drift === 'unreadable') {
    try {
      writeChanged(kv, d.core, now, mode, d.drift === 'merged')
    } catch {
      /* the state still runs from memory; later saves retry and surface the problem */
    }
  }
  return memoryResult(
    d.core,
    report(r.issues.length > 0 ? 'repaired' : 'ok', {
      issues: r.issues,
      quarantineKey,
      reconciledXp: r.reconciled,
      drift: d.drift,
      legacyChangedAfterMigration: d.drift !== 'none',
      sliceNotices: notices,
      layout: mode,
      upgraded,
      historyReadonly,
    }),
  )
}

/** Creation time encoded in a tutor message id (`u1738600000000`), or null for any other id shape. */
const idTime = (id: string): number | null => {
  const m = /^[ua](\d{12,14})$/.exec(id)
  return m ? Number(m[1]) : null
}

/** Ids of tutor lines found in the pristine migration copy and in stored copies of earlier legacy writes. Best effort, read-only. */
function tutorIdsInCopies(kv: KeyValueStore, origin: OriginInfo, except: string): Set<string> {
  const ids = new Set<string>()
  try {
    for (const key of [origin.backupKey, ...kv.keys(KEYS.backup)]) {
      if (key === except) continue // the copy of the write being processed would make every line look "old"
      const raw = kv.get(key)
      const p = raw === null ? null : parseJson(raw)
      const t = p && p.ok && isPlainObject(p.value) && isPlainObject(p.value.tutor) ? p.value.tutor.messages : null
      if (Array.isArray(t)) for (const m of t) if (isPlainObject(m) && typeof m.id === 'string') ids.add(m.id)
    }
  } catch {
    /* best effort */
  }
  return ids
}

// -------------------------------------------------------------------------------------------------------- stale-shell drift

/**
 * A stale app version (e.g. a cached shell from before this release) keeps writing the legacy key after the record was created.
 * Merge those changes FORWARD into the current state — union semantics, the XP increase as a one-off delta — and remember the
 * fingerprint, so the same bytes are never merged twice. The drifted bytes are backed up first; if that fails nothing is merged yet.
 */
export function applyLegacyDrift(
  kv: KeyValueStore,
  core: Core,
  rawLegacy: string | null,
  now: number,
  ids: LegacyIds = NO_IDS,
): { core: Core; drift: DriftStatus; backupKey: string | null } {
  const origin = core.origin
  if (!origin || rawLegacy === null) return { core, drift: 'none', backupKey: null }
  const fp = fingerprint(rawLegacy)
  if (fp === origin.legacyFingerprint) return { core, drift: 'none', backupKey: null }

  let backupKey: string
  try {
    backupKey = ensureCopy(kv, KEYS.backup, rawLegacy, now)
  } catch {
    return { core, drift: 'deferred', backupKey: null }
  }
  const pinned = [origin.backupKey, ...pinnedBackups(kv)]
  const housekeeping = () => {
    try {
      rotateBackups(kv, BACKUPS_KEPT, pinned, backupKey)
    } catch {
      /* housekeeping */
    }
  }
  const parsed = parseJson(rawLegacy)
  const sp = parsed.ok ? sanitizeProgress(parsed.value) : null
  if (!sp || (sp.recognized === 0 && parsed.ok && Object.keys(parsed.value as object).length > 0)) {
    housekeeping()
    return { core: { ...core, origin: { ...origin, legacyFingerprint: fp } }, drift: 'unreadable', backupKey } // bytes preserved in the backup; do not retry forever
  }
  const delta = origin.legacyXp === undefined ? 0 : Math.max(0, sp.value.xp - origin.legacyXp)
  // Tutor messages of a stale write: the ones we already hold keep OUR timestamps (so they do not appear twice); new ones are placed after
  // everything we hold, in their own order (S1 design §11.4 — deterministic, never sorted to the start of the conversation).
  const held = new Map(core.progress.tutor.messages.map(m => [m.id, m]))
  let newest = Math.max(0, core.tutorClearedAt, ...core.progress.tutor.messages.map(m => m.at ?? 0))
  // A stale shell keeps rewriting the transcript it last saw. If the learner CLEARED the chat here, those old lines must not come back:
  // a line whose id carries its creation time (`u<ms>` / `a<ms>`, how the app has always named them) is dropped when it is not newer
  // than the clear; a line without such an id is dropped when it is in the pristine migration backup or a stored copy of an older v1 write.
  const known = tutorIdsInCopies(kv, origin, backupKey)
  const staleTutor: UserProgress['tutor']['messages'] = []
  for (const m of sp.value.tutor.messages) {
    const have = held.get(m.id)
    if (have) {
      staleTutor.push(have)
      continue
    }
    const created = idTime(m.id)
    if (core.tutorClearedAt > 0 && (created !== null ? created <= core.tutorClearedAt : known.has(m.id))) continue // cleared here: stays cleared
    staleTutor.push({ ...m, at: created !== null ? created : ++newest })
  }
  const stale: Core = {
    progress: { ...sp.value, tutor: { messages: staleTutor } },
    credit: { entries: legacyCredit(sp.value, now, ids, `@${fp}`, delta) },
    activity: sanitizeActivity(undefined, sp.value.completed).activity,
    extras: sp.extras,
    origin: null,
    epoch: core.epoch,
    settingsAt: -1, // the current state's settings always win over stale ones
    tutorAt: 0,
    tutorClearedAt: 0,
    upgrade: null,
    resultsMeta: emptyResultsMeta(),
  }
  const merged = mergeCores(core, stale, now)
  housekeeping()
  return { core: { ...merged, origin: { ...origin, legacyFingerprint: fp, legacyXp: sp.value.xp } }, drift: 'merged', backupKey }
}

// ------------------------------------------------------------------------------------------------------------------ recovery

interface Evaluated {
  core: Core
  issues: Issue[]
  kind: 'legacy' | 'snapshot'
  /** snapshot copies: 0 = composite (contains preferences and tutor), >= 1 = CORE-ONLY copy (STO-92) */
  layout: number
}

/** Pure interpretation of a stored string as progress (no I/O). */
function evaluateRaw(raw: string, opts: LoadOptions): Evaluated | null {
  const p = parseJson(raw)
  if (!p.ok) return null
  // a preferences / tutor record is not a progress record (it would otherwise be mistaken for a legacy one)
  if (isPlainObject(p.value) && (p.value.record === 'prefs' || p.value.record === 'tutor' || p.value.record === 'results')) return null
  const kind = detectSchema(p.value)
  if (kind === 'v2') {
    const value = p.value as Record<string, unknown>
    const r = readRecord(value, opts.now)
    const issues = [...r.issues]
    if (layoutOf(value) >= 1)
      issues.push({ path: 'layout', problem: 'this copy holds progress only; preferences and tutor chat are kept in separate copies' })
    return { core: r.core, issues, kind: 'snapshot', layout: layoutOf(value) }
  }
  if (kind === 'legacy') {
    const sp = sanitizeProgress(p.value)
    if (!sp || (sp.recognized === 0 && Object.keys(p.value as object).length > 0)) return null
    return { core: coreFromLegacy(sp, opts.now, opts.ids ?? NO_IDS), issues: sp.issues, kind: 'legacy', layout: 0 }
  }
  return null
}

/** The current record is unreadable. We quarantine it (copy only) and PROPOSE a candidate; nothing is replaced without the learner. */
function recoverUnusableCurrent(kv: KeyValueStore, rawCurrent: string, rawLegacy: string | null, opts: LoadOptions): LoadResult {
  const { now } = opts
  let quarantineKey: string
  try {
    quarantineKey = ensureCopy(kv, KEYS.quarantine, rawCurrent, now)
  } catch (e) {
    return memoryResult(
      freshCore(),
      report('unwritable', {
        writesDisabled: true,
        reason: `current record unreadable and could not be quarantined: ${(e as Error).message}`,
      }),
    )
  }
  const issues: Issue[] = [{ path: KEYS.current, problem: 'stored record is unreadable (original kept in quarantine, not modified)' }]

  const sources: { key: string; kind: RecoveryCandidate['kind']; raw: string }[] = []
  if (rawLegacy !== null) sources.push({ key: KEYS.legacy, kind: 'legacy', raw: rawLegacy })
  for (const k of [...kv.keys(KEYS.backup)].reverse()) {
    const b = kv.get(k)
    if (b !== null && claimedFingerprint(k) === fingerprint(b)) sources.push({ key: k, kind: 'backup', raw: b })
  }
  for (const s of sources) {
    const ev = evaluateRaw(s.raw, opts)
    if (!ev) continue
    const candidate: RecoveryCandidate = {
      key: s.key,
      kind: s.kind,
      xp: ev.core.progress.xp,
      completed: ev.core.progress.completed.length,
      issues: ev.issues.length,
    }
    return memoryResult(
      ev.core,
      report('recovery-pending', {
        issues,
        quarantineKey,
        writesDisabled: true,
        candidate,
        reason: 'confirmation required before the stored record is replaced',
        fromLegacy: s.kind === 'legacy',
      }),
    )
  }
  return memoryResult(
    freshCore(),
    report('unreadable', {
      issues,
      quarantineKey,
      writesDisabled: true,
      reason: 'no usable legacy record or backup; starting fresh requires confirmation',
    }),
  )
}

// ------------------------------------------------------------------------------------------------------------- migration

/** Legacy v1 → current record, under guarantees G2–G5. Safe to call repeatedly. */
export function migrateLegacy(kv: KeyValueStore, rawLegacy: string, opts: LoadOptions, epoch = 0): LoadResult {
  const { now } = opts
  const unreadable = (problem: string): LoadResult => {
    let quarantineKey: string | null = null
    try {
      quarantineKey = ensureCopy(kv, KEYS.quarantine, rawLegacy, now)
    } catch {
      /* the legacy key itself is untouched, so the bytes still exist */
    }
    // v1 is not overwritten and there is no current record, so saving to the new key is safe
    return memoryResult(
      freshCore(),
      report('unreadable', { quarantineKey, issues: [{ path: KEYS.legacy, problem }], fromLegacy: true, reason: problem }),
    )
  }

  const parsed = parseJson(rawLegacy)
  if (!parsed.ok) return unreadable('legacy record is not valid JSON')
  const sp = sanitizeProgress(parsed.value)
  if (!sp) return unreadable('legacy record is not an object')
  if (sp.recognized === 0 && Object.keys(parsed.value as object).length > 0)
    return unreadable('legacy record contains no recognisable progress fields')

  const unsavedCore: Core = { ...coreFromLegacy(sp, now, opts.ids ?? NO_IDS), epoch }

  let backupKey: string
  try {
    backupKey = ensureCopy(kv, KEYS.backup, rawLegacy, now) // (b) verified backup
  } catch (e) {
    return memoryResult(
      unsavedCore,
      report('unwritable', {
        issues: sp.issues,
        fromLegacy: true,
        writesDisabled: true,
        reason: `backup failed, migration not attempted: ${(e as Error).message}`,
      }),
    )
  }
  const core: Core = {
    ...unsavedCore,
    origin: { from: 'legacy-v1', migratedAt: now, backupKey, legacyFingerprint: fingerprint(rawLegacy), legacyXp: unsavedCore.progress.xp },
  }

  if (!roundTripOk(core, now)) {
    // (c) the destination would not validate: never write it
    return memoryResult(
      core,
      report('unwritable', {
        issues: sp.issues,
        fromLegacy: true,
        backupKey,
        writesDisabled: true,
        reason: 'migrated record failed validation; not written',
      }),
    )
  }
  // Another tab may have migrated while we prepared (the boot read happened earlier): never overwrite its record — which may already
  // hold newer progress — adopt it instead. Only the first writer of a record creates it.
  if (epoch === 0 && kv.get(KEYS.current) !== null) return loadProgress(kv, opts)
  try {
    commitSplit(kv, core, now, epoch === 0 ? 'slices-first' : 'core-first') // (d) verified writes; the core is the commit marker of a creation
  } catch (e) {
    try {
      if (epoch === 0 && kv.get(KEYS.current) !== null) kv.remove(KEYS.current) // remove only our own, unverified artefact
    } catch {
      /* ignore */
    }
    return memoryResult(
      core,
      report('unwritable', {
        issues: sp.issues,
        fromLegacy: true,
        backupKey,
        reason: `could not save migrated record: ${(e as Error).message}`,
      }),
    )
  }
  try {
    rotateBackups(kv, BACKUPS_KEPT, [backupKey])
  } catch {
    /* rotation is housekeeping */
  }
  return memoryResult(core, report('migrated', { issues: sp.issues, fromLegacy: true, backupKey }))
}

// -------------------------------------------------------------------------------------------------------- save / recovery

export type SaveResult =
  | {
      ok: true
      core: Core
      changed: boolean
      /** the course record as stored after this save (kept under this name for existing callers) */
      raw: string | null
      rawPrefs: string | null
      rawTutor: string | null
      rawResults: string | null
      /** another tab replaced the state while we were saving: the caller must adopt the stored state */
      conflict: boolean
      /** the history record could not be written; the core may have been (STO-80). The entries stay pending in memory and are retried. */
      resultsFailed?: { error: Error; pending: number }
      /** history entries held in memory but not in the stored history record */
      pending: number
      /** the history record is from a newer version: it is not written this session */
      historyReadonly: boolean
    }
  | { ok: false; error: Error; core: Core; future?: boolean }

export interface SaveOptions {
  replace?: boolean
  /** the course record as this writer last read or wrote it */
  lastRaw?: string | null
  /** the preferences / tutor records as this writer last read or wrote them */
  lastSliceRaw?: { prefs?: string | null; tutor?: string | null; results?: string | null }
  /** which record form to write: split = layout 2; layout1 / monolith = compatibility mode (the layout-2 upgrade has not completed) */
  mode?: 'split' | 'layout1' | 'monolith'
  /** @deprecated use mode: 'monolith' */
  monolith?: boolean
}

/**
 * Routine save (05 §9): re-read what another tab (or a restore) wrote, merge it GROUP BY GROUP (only groups whose record changed under
 * us), then write only the records whose content changed — core, preferences, tutor, in that order. A record that cannot be read is
 * quarantined before being replaced; a record from a newer version is never touched.
 */
export function saveProgress(kv: KeyValueStore, core: Core, now: number, opts: SaveOptions = {}): SaveResult {
  try {
    let merged = core
    if (!opts.replace) {
      const rawCore = kv.get(KEYS.current)
      if (rawCore !== null) {
        const rawPrefs = kv.get(KEYS.prefs)
        const rawTutor = kv.get(KEYS.tutor)
        const rawResults = kv.get(KEYS.results)
        // A record whose stored bytes still equal what this writer last saw was written by nobody else: our state is authoritative for it
        // (so local removals stay removed). Only a record that CHANGED underneath us is merged.
        const coreChanged = opts.lastRaw === undefined || rawCore !== opts.lastRaw
        const prefsChanged = opts.lastSliceRaw?.prefs === undefined || rawPrefs !== opts.lastSliceRaw.prefs
        const tutorChanged = opts.lastSliceRaw?.tutor === undefined || rawTutor !== opts.lastSliceRaw.tutor
        const resultsChanged = opts.lastSliceRaw?.results === undefined || rawResults !== opts.lastSliceRaw.results
        if (coreChanged || prefsChanged || tutorChanged || resultsChanged) {
          const p = parseJson(rawCore)
          const kind = p.ok ? detectSchema(p.value) : 'invalid'
          if (kind === 'future')
            return { ok: false, error: new StorageError('verify', 'stored record is from a newer version'), core, future: true }
          if (p.ok && kind === 'v2') {
            const stored = compose(p.value as Record<string, unknown>, rawPrefs, rawTutor, rawResults, now)
            const groups = mergeableGroups(stored, coreChanged, prefsChanged, tutorChanged, resultsChanged)
            if (groups.size > 0) merged = mergeCores(core, pickGroups(stored.core, core, groups), now)
          } else if (coreChanged) {
            ensureCopy(kv, KEYS.quarantine, rawCore, now) // unreadable bytes are preserved before being replaced
          }
        }
      }
    }
    const mode = opts.mode ?? (opts.monolith === true ? 'monolith' : 'split')
    const w = writeChanged(kv, merged, now, mode)
    // the history record may hold entries this tab did not know (another tab, a restore source): they are UNIONED into memory, never dropped
    if (mode === 'split') merged = withResults(merged, readResults(w.results))
    return {
      ok: true,
      core: merged,
      changed: merged !== core,
      raw: w.core,
      rawPrefs: w.prefs,
      rawTutor: w.tutor,
      rawResults: w.results,
      conflict: w.conflict,
      ...(w.resultsError ? { resultsFailed: { error: w.resultsError, pending: w.pending } } : {}),
      pending: w.pending,
      historyReadonly: w.historyReadonly === true,
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e : new StorageError('unavailable', String(e)), core }
  }
}

/** Reads another writer's state without writing (used for the `storage` event). null when unreadable or from a newer version. */
export function readStored(
  kv: KeyValueStore,
  now: number,
): { core: Core; raw: string; rawPrefs: string | null; rawTutor: string | null; rawResults: string | null } | null {
  try {
    const raw = kv.get(KEYS.current)
    if (raw === null) return null
    const p = parseJson(raw)
    if (!p.ok || detectSchema(p.value) !== 'v2') return null
    const rawPrefs = kv.get(KEYS.prefs)
    const rawTutor = kv.get(KEYS.tutor)
    const rawResults = kv.get(KEYS.results)
    return {
      core: compose(p.value as Record<string, unknown>, rawPrefs, rawTutor, rawResults, now).core,
      raw,
      rawPrefs,
      rawTutor,
      rawResults,
    }
  } catch {
    return null
  }
}

/**
 * A rotating safety copy of the whole current state (core + preferences + tutor in one record), taken before a destructive learner
 * action. `ok: false` means the copy could not be made — the caller must then refuse the action (STO-17).
 */
export function snapshotComposite(kv: KeyValueStore, now: number): Preserved {
  const res = preserveCurrent(kv, now, KEYS.backup)
  if (res.ok && res.key !== null) {
    try {
      rotateBackups(kv, BACKUPS_KEPT, pinnedBackups(kv), res.key)
    } catch {
      /* rotation is housekeeping */
    }
  }
  return res
}

/** Kept for existing callers: the key of the copy, or null when none was made. */
export function snapshotCurrent(kv: KeyValueStore, now: number): string | null {
  const res = snapshotComposite(kv, now)
  return res.ok ? res.key : null
}

/** The highest epoch of any of the three records, so a replacement is always above every stale slice. */
const storedEpoch = (kv: KeyValueStore): number => {
  try {
    const own = (raw: string | null): number => {
      const p = raw === null ? null : parseJson(raw)
      return p && p.ok && isPlainObject(p.value) && typeof p.value.epoch === 'number' && Number.isFinite(p.value.epoch) ? p.value.epoch : 0
    }
    return Math.max(own(kv.get(KEYS.current)), own(kv.get(KEYS.prefs)), own(kv.get(KEYS.tutor)))
  } catch {
    return 0
  }
}

/**
 * Owner decision C5 (design §13.13): while the course record is still of an older layout (the upgrade to layout 2 has not completed
 * successfully — compatibility mode, history may live inside it) Reset, Start Fresh, Core Restore and Rollback are REFUSED, completely and
 * BEFORE any write. null = allowed. An unreadable or absent course record is not compatibility mode (those are the recovery flows).
 */
export type Blocked = 'upgrade-pending'
export function replacementBlocked(kv: KeyValueStore): Blocked | null {
  try {
    const raw = kv.get(KEYS.current)
    const p = raw === null ? null : parseJson(raw)
    if (p && p.ok && isPlainObject(p.value) && detectSchema(p.value) === 'v2' && layoutOf(p.value) < LAYOUT) return 'upgrade-pending'
  } catch {
    /* unreadable storage: the operations fail on their own */
  }
  return null
}
const BLOCKED_REASON = 'the storage upgrade must finish first; nothing was changed'

/** The stored history (read-only), or an empty list. Used to keep the history independent of every core replacement (STO-90). */
function storedHistory(kv: KeyValueStore): { results: Core['activity']['results']; meta: ResultsMeta; state: ResultsRead['state'] } {
  const read = readResults(kv.get(KEYS.results))
  return read.state === 'ok'
    ? { results: read.results, meta: read.meta, state: 'ok' }
    : { results: [], meta: emptyResultsMeta(), state: read.state }
}

/**
 * Explicit recovery chosen by the learner: adopt a verified copy (backup, quarantine copy or the legacy record).
 * The current state (core AND preferences AND tutor) is preserved first; if that is impossible nothing is replaced (STO-17).
 * Content-addressed copies must match their own fingerprint.
 */
export function restoreFrom(kv: KeyValueStore, key: string, opts: LoadOptions): LoadResult {
  const fail = (reason: string, quarantineKey: string | null = null) =>
    memoryResult(freshCore(), report('unwritable', { writesDisabled: true, quarantineKey, reason }))
  try {
    const raw = kv.get(key)
    if (raw === null) return fail(`copy "${key}" not found`)
    if (isContentAddressed(key) && claimedFingerprint(key) !== fingerprint(raw))
      return fail('copy failed its integrity check; not restored')
    if (key !== KEYS.legacy && !isContentAddressed(key)) return fail('not a recoverable copy')
    const ev = evaluateRaw(raw, opts)
    if (!ev) return fail('copy is not usable; not restored')
    if (replacementBlocked(kv) !== null)
      return {
        ...fail(BLOCKED_REASON),
        report: report('unwritable', { writesDisabled: true, reason: BLOCKED_REASON, blocked: 'upgrade-pending' }),
      }
    let quarantineKey: string | null = null
    if (kv.get(KEYS.current) !== raw) {
      const kept = preserveCurrent(kv, opts.now, KEYS.quarantine)
      if (!kept.ok)
        return fail(`a safe copy of the current data could not be made; nothing was replaced (${kept.error ?? 'unknown error'})`)
      quarantineKey = kept.key
    }
    const epoch = nextEpoch(storedEpoch(kv), opts.now)
    // HISTORY (STO-90/92): the stored history is never replaced; history that the restore source carries (S1-era snapshots, the pinned
    // layout-1 backup) is MERGED into it BEFORE anything of the core is replaced. If that cannot be written nothing is replaced.
    const hist = storedHistory(kv)
    if (hist.state === 'future') return fail('the history record was written by a newer version of the app; nothing was replaced')
    const mergedHistory = mergeResultLists(hist.results, ev.core.activity.results)
    const adds = mergedHistory.length > hist.results.length
    if (adds) {
      try {
        setVerified(kv, KEYS.results, serializeResults(mergedHistory, mergeResultsMeta(hist.meta, ev.core.resultsMeta), epoch, opts.now))
      } catch (e) {
        return fail(`the history could not be merged, so nothing was replaced (${(e as Error).message})`, quarantineKey)
      }
    }
    if (ev.kind === 'legacy') {
      const res = migrateLegacy(kv, raw, opts, epoch)
      return {
        core: withHistoryList(res.core, mergedHistory),
        report: { ...res.report, status: res.report.status === 'migrated' ? 'recovered' : res.report.status, quarantineKey },
      }
    }
    let core: Core = withHistoryList({ ...ev.core, epoch }, mergedHistory)
    if (ev.layout >= 1) {
      // STO-92: a CORE-ONLY copy restores the Core and PRESERVES the current preferences and tutor (it does not contain them)
      const cur = readStored(kv, opts.now)
      if (!cur) {
        // F1: the course record may be unreadable (that is exactly when Restore is offered). The preferences and tutor records are
        // independent of the core's health: valid ones are kept exactly; absent / damaged / newer ones follow their existing behaviour.
        const p = readPrefs(kv.get(KEYS.prefs))
        const t = readTutor(kv.get(KEYS.tutor))
        if (p.state === 'ok') core = withPrefs(core, { ...p.rec, epoch })
        if (t.state === 'ok') core = withTutor(core, { ...t.rec, epoch })
      } else
        core = {
          ...withTutor(withPrefs(core, { ...prefsOfCore(cur.core), record: 'prefs', v: 1, epoch, updatedAt: cur.core.settingsAt }), {
            record: 'tutor',
            v: 1,
            epoch,
            updatedAt: cur.core.tutorAt,
            clearedAt: cur.core.tutorClearedAt,
            messages: cur.core.progress.tutor.messages,
          }),
        }
    }
    try {
      commitSplit(kv, core, opts.now, 'core-first')
    } catch (e) {
      return memoryResult(
        core,
        report('unwritable', { issues: ev.issues, quarantineKey, reason: `restore could not be saved: ${(e as Error).message}` }),
      )
    }
    return memoryResult(core, report('recovered', { issues: ev.issues, quarantineKey, backupKey: key }))
  } catch (e) {
    return fail(`restore failed: ${(e as Error).message}`)
  }
}

const prefsOfCore = (c: Core) => ({
  name: c.progress.name,
  lang: c.progress.lang,
  theme: c.progress.theme,
  level: c.progress.level,
  weeklyGoal: c.progress.weeklyGoal,
})
const withHistoryList = (c: Core, results: Core['activity']['results']): Core => ({ ...c, activity: { ...c.activity, results } })

/** Kept for existing callers/tests. */
export const restoreFromBackup = restoreFrom

/**
 * Learner-confirmed fresh start after an unreadable record: the damaged bytes (and the preferences / tutor records) are kept (verified)
 * before anything is replaced. If they cannot be kept, nothing changes.
 */
export function startFresh(kv: KeyValueStore, opts: LoadOptions): LoadResult {
  try {
    if (replacementBlocked(kv) !== null)
      return memoryResult(freshCore(), report('unwritable', { writesDisabled: true, reason: BLOCKED_REASON, blocked: 'upgrade-pending' }))
    const kept = preserveCurrent(kv, opts.now, KEYS.quarantine)
    if (!kept.ok)
      return memoryResult(
        freshCore(),
        report('unwritable', {
          writesDisabled: true,
          reason: `a safe copy could not be made, so nothing was replaced (${kept.error ?? 'unknown error'})`,
        }),
      )
    // the history is independent of the core (STO-90): the fresh core carries the STORED history; the history record is not written here
    const hist = storedHistory(kv)
    const core: Core = withHistoryList(
      { ...freshCore(), epoch: nextEpoch(storedEpoch(kv), opts.now), resultsMeta: hist.meta },
      hist.results,
    )
    commitSplit(kv, core, opts.now, 'core-first')
    return memoryResult(core, report('fresh', { quarantineKey: kept.key, historyReadonly: hist.state === 'future' }))
  } catch (e) {
    return memoryResult(
      freshCore(),
      report('unwritable', { writesDisabled: true, reason: `could not start fresh: ${(e as Error).message}` }),
    )
  }
}

/**
 * Non-destructive rollback to the legacy snapshot: the current state is preserved (not deleted) first, so the next load migrates `v1`
 * again. Only the app's own records are removed, and only after their copies are verified; `bilup-deutsch:v1` is never touched.
 */
export function rollbackToLegacy(
  kv: KeyValueStore,
  now: number,
): { ok: true; quarantineKey: string | null } | { ok: false; reason: string; blocked?: Blocked } {
  try {
    if (replacementBlocked(kv) !== null) return { ok: false, reason: BLOCKED_REASON, blocked: 'upgrade-pending' }
    const current = kv.get(KEYS.current)
    if (kv.get(KEYS.legacy) === null) return { ok: false, reason: 'no legacy record to roll back to' }
    const kept = preserveCurrent(kv, now, KEYS.quarantine)
    if (!kept.ok) return { ok: false, reason: kept.error ?? 'a safe copy could not be made' }
    // The app's own CORE, PREFERENCES and TUTOR keys only — NEVER the history record (STO-90): it survives a rollback untouched.
    // slices first, the core last: a crash in between leaves a core with default slices — a valid state
    if (kv.get(KEYS.prefs) !== null) kv.remove(KEYS.prefs)
    if (kv.get(KEYS.tutor) !== null) kv.remove(KEYS.tutor)
    if (current !== null) kv.remove(KEYS.current)
    return { ok: true, quarantineKey: kept.key }
  } catch (e) {
    return { ok: false, reason: (e as Error).message }
  }
}

export interface RecoveryItem {
  key: string
  kind: 'backup' | 'quarantine' | 'legacy'
  raw: string
}

/** Everything a learner or support person may need to recover data by hand. Exact bytes, nothing interpreted. */
export function listRecoveryItems(kv: KeyValueStore): RecoveryItem[] {
  const items: RecoveryItem[] = []
  try {
    for (const [prefix, kind] of [
      [KEYS.quarantine, 'quarantine'],
      [KEYS.backup, 'backup'],
    ] as const) {
      for (const key of kv.keys(prefix)) {
        const raw = kv.get(key)
        if (raw !== null) items.push({ key, kind, raw })
      }
    }
    const legacy = kv.get(KEYS.legacy)
    if (legacy !== null) items.push({ key: KEYS.legacy, kind: 'legacy', raw: legacy })
  } catch {
    /* best effort */
  }
  return items
}

export interface CopyInfo {
  key: string
  kind: RecoveryItem['kind']
  /** time encoded in the key, when there is one */
  savedAt: number | null
  bytes: number
  /** content-addressed copies: the bytes still match the fingerprint in their key (always true for the legacy key) */
  intact: boolean
  /** interpretable as progress */
  usable: boolean
  /** safe to offer "restore": intact AND usable */
  restorable: boolean
  xp: number
  completed: number
  issues: number
}

/** Verifies every preserved copy WITHOUT writing anything, so the recovery screen only offers restores that can succeed. */
export function inspectCopies(kv: KeyValueStore, opts: LoadOptions): CopyInfo[] {
  return listRecoveryItems(kv).map(i => {
    const intact = i.kind === 'legacy' ? true : claimedFingerprint(i.key) === fingerprint(i.raw)
    const ev = intact ? evaluateRaw(i.raw, opts) : null
    const ts = i.kind === 'legacy' ? null : Number(i.key.slice((i.kind === 'backup' ? KEYS.backup : KEYS.quarantine).length).split(':')[0])
    return {
      key: i.key,
      kind: i.kind,
      savedAt: ts !== null && Number.isFinite(ts) && ts > 0 ? ts : null,
      bytes: i.raw.length,
      intact,
      usable: !!ev,
      restorable: intact && !!ev,
      xp: ev?.core.progress.xp ?? 0,
      completed: ev?.core.progress.completed.length ?? 0,
      issues: ev?.issues.length ?? 0,
    }
  })
}

export { deriveCredited }
export type { CreditState }
