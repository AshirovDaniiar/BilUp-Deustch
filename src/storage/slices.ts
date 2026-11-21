/**
 * Independent records for the preferences and the tutor transcript (S1, STORAGE_S1_FINAL_DESIGN.md §1, §3, §4).
 *
 * Pure: no I/O. The in-memory `Core` / `UserProgress` shape is unchanged — these helpers only decide how its three GROUPS are stored:
 *   core   = everything except the two groups below (the record `bilup-deutsch:v2:<course>`, `layout: 1`)
 *   prefs  = name, lang, theme, level, weeklyGoal (+ `settingsAt` as `updatedAt`)        → `bilup-deutsch:prefs`
 *   tutor  = tutor messages (+ `tutorAt`, `tutorClearedAt`)                                → `bilup-deutsch:tutor:<course>`
 * Every slice carries the `epoch` of the core it belongs to: a slice from an older epoch is stale (ignored), one from a newer epoch is
 * anomalous (quarantined). A slice is self-describing (`record`) so quarantined bytes can be identified later.
 */
import type { UserProgress } from '../data/types'
import type { Core } from './core'
import { defaultProgress } from './defaults'
import { isPlainObject, sanitizeProgress, type Issue } from './validate'

export const SLICE_VERSION = 1
/**
 * 0 = monolith (everything in one record, the only format before S1); 1 = preferences and tutor are separate records (S1);
 * 2 = the detailed attempt history is a separate record too (S2). A build that knows a smaller layout is read-only on a larger one.
 */
export const LAYOUT = 2

export type Group = 'core' | 'prefs' | 'tutor' | 'results'
export type SliceName = 'prefs' | 'tutor'

export type PrefsFields = Pick<UserProgress, 'name' | 'lang' | 'theme' | 'level' | 'weeklyGoal'>
export interface PrefsRecord extends PrefsFields {
  record: 'prefs'
  v: number
  epoch: number
  updatedAt: number
}
export interface TutorRecord {
  record: 'tutor'
  v: number
  epoch: number
  updatedAt: number
  clearedAt: number
  messages: UserProgress['tutor']['messages']
}

export type SliceRead<T> =
  | { state: 'absent' }
  | { state: 'ok'; rec: T; issues: Issue[] }
  /** not parseable / not the expected record: the exact bytes must be quarantined before anything replaces them */
  | { state: 'damaged'; reason: string }
  /** written by a newer version: left untouched, defaults in memory, never rewritten */
  | { state: 'future' }

/** Fields of the progress that live in the preferences record / the tutor record. */
export const PREF_KEYS = ['name', 'lang', 'theme', 'level', 'weeklyGoal'] as const

export const prefsOf = (c: Core): PrefsFields => ({
  name: c.progress.name,
  lang: c.progress.lang,
  theme: c.progress.theme,
  level: c.progress.level,
  weeklyGoal: c.progress.weeklyGoal,
})

export const serializePrefs = (c: Core): string =>
  JSON.stringify({ record: 'prefs', v: SLICE_VERSION, epoch: c.epoch, updatedAt: c.settingsAt, ...prefsOf(c) } satisfies PrefsRecord)

export const serializeTutor = (c: Core): string =>
  JSON.stringify({
    record: 'tutor',
    v: SLICE_VERSION,
    epoch: c.epoch,
    updatedAt: c.tutorAt,
    clearedAt: c.tutorClearedAt,
    messages: c.progress.tutor.messages,
  } satisfies TutorRecord)

const parse = (raw: string): unknown => {
  try {
    return JSON.parse(raw)
  } catch {
    return undefined
  }
}

const nonNeg = (v: unknown): number => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0)

/** shared envelope check; returns the parsed object or the classification */
function envelope(raw: string | null, record: SliceName): { ok: true; o: Record<string, unknown> } | { ok: false; read: SliceRead<never> } {
  if (raw === null) return { ok: false, read: { state: 'absent' } }
  const o = parse(raw)
  if (!isPlainObject(o)) return { ok: false, read: { state: 'damaged', reason: 'not a JSON object' } }
  if (o.record !== record) return { ok: false, read: { state: 'damaged', reason: `not a ${record} record` } }
  if (typeof o.v !== 'number' || !Number.isInteger(o.v) || o.v < 1)
    return { ok: false, read: { state: 'damaged', reason: 'missing version' } }
  if (o.v > SLICE_VERSION) return { ok: false, read: { state: 'future' } }
  return { ok: true, o }
}

export function readPrefs(raw: string | null): SliceRead<PrefsRecord> {
  const e = envelope(raw, 'prefs')
  if (!e.ok) return e.read
  const sp = sanitizeProgress(Object.fromEntries(PREF_KEYS.filter(k => k in e.o).map(k => [k, e.o[k]])))
  if (!sp) return { state: 'damaged', reason: 'not a JSON object' }
  const issues = [...sp.issues]
  for (const k of ['epoch', 'updatedAt'] as const)
    if (e.o[k] !== undefined && nonNeg(e.o[k]) !== e.o[k]) issues.push({ path: k, problem: 'expected a non-negative whole number' })
  const p = sp.value
  return {
    state: 'ok',
    issues,
    rec: {
      record: 'prefs',
      v: SLICE_VERSION,
      epoch: nonNeg(e.o.epoch),
      updatedAt: nonNeg(e.o.updatedAt),
      name: p.name,
      lang: p.lang,
      theme: p.theme,
      level: p.level,
      weeklyGoal: p.weeklyGoal,
    },
  }
}

export function readTutor(raw: string | null): SliceRead<TutorRecord> {
  const e = envelope(raw, 'tutor')
  if (!e.ok) return e.read
  if (!Array.isArray(e.o.messages)) return { state: 'damaged', reason: 'messages is not a list' }
  const sp = sanitizeProgress({ tutor: { messages: e.o.messages } })
  if (!sp) return { state: 'damaged', reason: 'not a JSON object' }
  const issues = [...sp.issues]
  for (const k of ['epoch', 'updatedAt', 'clearedAt'] as const)
    if (e.o[k] !== undefined && nonNeg(e.o[k]) !== e.o[k]) issues.push({ path: k, problem: 'expected a non-negative whole number' })
  return {
    state: 'ok',
    issues,
    rec: {
      record: 'tutor',
      v: SLICE_VERSION,
      epoch: nonNeg(e.o.epoch),
      updatedAt: nonNeg(e.o.updatedAt),
      clearedAt: nonNeg(e.o.clearedAt),
      messages: sp.value.tutor.messages,
    },
  }
}

/** Tolerant look at a stored slice for the write guards: never throws, never judges content. */
export function sliceMeta(raw: string | null): { epoch: number | null; future: boolean; readable: boolean } {
  if (raw === null) return { epoch: null, future: false, readable: true }
  const o = parse(raw)
  if (!isPlainObject(o) || (o.record !== 'prefs' && o.record !== 'tutor')) return { epoch: null, future: false, readable: false }
  const future = typeof o.v === 'number' && o.v > SLICE_VERSION
  return { epoch: typeof o.epoch === 'number' && Number.isFinite(o.epoch) ? o.epoch : 0, future, readable: true }
}

/** Defaults for the two groups (what a missing, stale or replaced slice means). */
export const defaultPrefs = (): PrefsFields => {
  const d = defaultProgress()
  return { name: d.name, lang: d.lang, theme: d.theme, level: d.level, weeklyGoal: d.weeklyGoal }
}

export function withPrefs(c: Core, p: PrefsRecord | null): Core {
  const f = p ?? { ...defaultPrefs(), updatedAt: 0 }
  return {
    ...c,
    progress: { ...c.progress, name: f.name, lang: f.lang, theme: f.theme, level: f.level, weeklyGoal: f.weeklyGoal },
    settingsAt: p ? p.updatedAt : 0,
  }
}

export function withTutor(c: Core, t: TutorRecord | null): Core {
  return {
    ...c,
    progress: { ...c.progress, tutor: { messages: t ? t.messages : [] } },
    tutorAt: t ? t.updatedAt : 0,
    tutorClearedAt: t ? t.clearedAt : 0,
  }
}

/**
 * Takes the named groups from `remote` and the rest from `ours`. Used for cross-tab merges so that a change to ONE record never drags in
 * another group of the other tab's state (which would resurrect things this tab has just removed). A different epoch means a deliberate
 * replacement: the remote state is adopted as a whole.
 */
export function pickGroups(remote: Core, ours: Core, changed: ReadonlySet<Group>): Core {
  if (remote.epoch !== ours.epoch) return remote
  const c = changed.has('core') ? remote : ours
  const p = changed.has('prefs') ? remote : ours
  const t = changed.has('tutor') ? remote : ours
  const r = changed.has('results') ? remote : ours
  return {
    ...c,
    progress: { ...c.progress, ...prefsOf(p), tutor: t.progress.tutor },
    settingsAt: p.settingsAt,
    tutorAt: t.tutorAt,
    tutorClearedAt: t.tutorClearedAt,
    // the history is its own group (never taken along with the core group); mergeCores then UNIONS it — nothing is ever removed
    activity: { ...c.activity, results: r.activity.results },
    resultsMeta: r.resultsMeta,
  }
}

/** Total order for two preference states (S1 design §3.1): epoch, then updatedAt, then canonical JSON. > 0 when `a` wins. */
export function comparePrefs(
  a: { epoch: number; updatedAt: number; fields: PrefsFields },
  b: { epoch: number; updatedAt: number; fields: PrefsFields },
): number {
  if (a.epoch !== b.epoch) return a.epoch - b.epoch
  if (a.updatedAt !== b.updatedAt) return a.updatedAt - b.updatedAt
  const ja = JSON.stringify(PREF_KEYS.map(k => a.fields[k]))
  const jb = JSON.stringify(PREF_KEYS.map(k => b.fields[k]))
  return ja === jb ? 0 : ja > jb ? 1 : -1
}
