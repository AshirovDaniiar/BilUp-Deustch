/**
 * Validation + sanitisation of persisted learner progress (05 §7).
 *
 * Principles
 *  - NEVER throws, whatever the input.
 *  - Salvage before discard: values are coerced/clamped where the intent is unambiguous (numeric strings, out-of-range numbers);
 *    only entries that cannot be interpreted are dropped, and every repair is reported as an Issue.
 *  - Dropped/changed data is not lost: callers keep the raw original in a quarantine copy before anything is rewritten.
 *  - Unknown top-level fields are preserved verbatim in `extras` (forward compatibility).
 *  - Idempotent: sanitising sanitised output yields identical output and no issues.
 */
import { LEVELS, type Lang, type Mistake, type SkillName, type TestResult, type UserProgress } from '../data/types'
import { defaultProgress, emptyScores } from './defaults'

export interface Issue {
  path: string
  problem: string
}

export const LIMITS = {
  name: 80,
  id: 120,
  activeDates: 400,
  completed: 5000,
  mastery: 5000,
  saved: 5000,
  mistakes: 300,
  scoresPerSkill: 30,
  daily: 400,
  tests: 50,
  /** results of placement and level tests that are kept per test id, in addition to the `tests` cap for ordinary results */
  protectedTestsPerId: 10,
  tutorMessages: 60,
  tutorText: 4000,
  maxBox: 5,
  maxCount: 1_000_000,
  maxXp: 1_000_000_000,
} as const

const LANGS: Lang[] = ['ru', 'ky', 'de']
const THEMES = ['auto', 'light', 'dark'] as const
const SKILLS: SkillName[] = ['vocabulary', 'grammar', 'listening', 'reading', 'writing', 'speaking']
const MISTAKE_KINDS: Mistake['kind'][] = ['article', 'vocabulary', 'grammar', 'listening', 'writing']
export const KNOWN_KEYS = Object.keys(defaultProgress())

export const isPlainObject = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v)
const isFiniteNumber = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
const NUMERIC_STRING = /^\s*\d+(\.\d+)?\s*$/

/** number, or a purely numeric string (legacy blobs edited by hand or stringified), else undefined */
const toNumber = (v: unknown): number | undefined =>
  isFiniteNumber(v) ? v : typeof v === 'string' && NUMERIC_STRING.test(v) ? Number(v) : undefined

export function isDayKey(s: unknown): s is string {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const [y, m, d] = s.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, d))
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d
}

type Ctx = { issues: Issue[] }
const note = (c: Ctx, path: string, problem: string) => void c.issues.push({ path, problem })

function str(c: Ctx, path: string, v: unknown, max: number, fallback: string): string {
  if (typeof v !== 'string') {
    note(c, path, `expected string, got ${v === null ? 'null' : typeof v}`)
    return fallback
  }
  const t = v.trim()
  if (t.length === 0) return fallback // an empty value is not an error for optional text such as the name
  if (t.length > max) {
    note(c, path, `string longer than ${max}, truncated`)
    return t.slice(0, max)
  }
  return t
}

function count(c: Ctx, path: string, v: unknown, fallback: number, max: number = LIMITS.maxCount): number {
  const n = toNumber(v)
  if (n === undefined) {
    note(c, path, `expected number, got ${v === null ? 'null' : typeof v}`)
    return fallback
  }
  if (n < 0) {
    note(c, path, 'negative number, using 0')
    return 0
  }
  if (n > max) {
    note(c, path, `number above ${max}, clamped`)
    return max
  }
  if (!Number.isInteger(n)) return Math.floor(n) // a fractional count is harmless; not worth an issue
  return n
}

function oneOf<T extends string>(c: Ctx, path: string, v: unknown, allowed: readonly T[], fallback: T): T {
  if (typeof v === 'string' && (allowed as readonly string[]).includes(v)) return v as T
  note(c, path, `unsupported value ${JSON.stringify(typeof v === 'string' ? v.slice(0, 30) : v)}`)
  return fallback
}

function strList(c: Ctx, path: string, v: unknown, max: number, itemMax: number = LIMITS.id): string[] {
  if (!Array.isArray(v)) {
    note(c, path, `expected array, got ${v === null ? 'null' : typeof v}`)
    return []
  }
  const seen = new Set<string>()
  const out: string[] = []
  let dropped = 0
  for (const x of v) {
    if (typeof x !== 'string' || x.trim() === '' || x.length > itemMax) {
      dropped++
      continue
    }
    if (seen.has(x)) continue // duplicates are harmless; silently collapsed
    seen.add(x)
    out.push(x)
  }
  if (dropped) note(c, path, `${dropped} invalid item(s) dropped`)
  if (out.length > max) {
    note(c, path, `more than ${max} items, oldest dropped`)
    return out.slice(-max)
  }
  return out
}

function pair(v: unknown): [number, number] | null {
  if (!Array.isArray(v) || v.length !== 2) return null
  const a = toNumber(v[0])
  const b = toNumber(v[1])
  return a === undefined || b === undefined || a < 0 || b < 0
    ? null
    : [Math.floor(Math.min(a, LIMITS.maxCount)), Math.floor(Math.min(b, LIMITS.maxCount))]
}

function sanitizeMastery(c: Ctx, v: unknown): UserProgress['mastery'] {
  if (!isPlainObject(v)) {
    if (v !== undefined) note(c, 'mastery', `expected object, got ${v === null ? 'null' : typeof v}`)
    return {}
  }
  const out: UserProgress['mastery'] = {}
  let dropped = 0
  let fixed = 0
  for (const [id, e] of Object.entries(v)) {
    if (id === '' || id.length > LIMITS.id || !isPlainObject(e) || Object.keys(out).length >= LIMITS.mastery) {
      dropped++
      continue
    }
    const box = toNumber(e.box)
    const seen = toNumber(e.seen)
    const wrong = toNumber(e.wrong)
    const due = toNumber(e.due)
    const entry = {
      box: Math.max(0, Math.min(LIMITS.maxBox, Math.floor(box ?? 0))),
      due: due !== undefined && due >= 0 ? due : 0,
      seen: Math.max(0, Math.min(LIMITS.maxCount, Math.floor(seen ?? 0))),
      wrong: Math.max(0, Math.min(LIMITS.maxCount, Math.floor(wrong ?? 0))),
    }
    if (entry.box !== e.box || entry.due !== e.due || entry.seen !== e.seen || entry.wrong !== e.wrong) fixed++
    out[id] = entry
  }
  if (dropped) note(c, 'mastery', `${dropped} uninterpretable entr${dropped === 1 ? 'y' : 'ies'} dropped`)
  if (fixed) note(c, 'mastery', `${fixed} entr${fixed === 1 ? 'y' : 'ies'} had out-of-range or missing fields, normalised`)
  return out
}

function sanitizeMistakes(c: Ctx, v: unknown): Mistake[] {
  if (!Array.isArray(v)) {
    if (v !== undefined) note(c, 'mistakes', `expected array, got ${v === null ? 'null' : typeof v}`)
    return []
  }
  const out: Mistake[] = []
  let dropped = 0
  for (const m of v) {
    if (
      !isPlainObject(m) ||
      !isFiniteNumber(m.at) ||
      typeof m.ref !== 'string' ||
      m.ref === '' ||
      m.ref.length > LIMITS.id ||
      !(MISTAKE_KINDS as unknown[]).includes(m.kind)
    ) {
      dropped++
      continue
    }
    const entry: Mistake = { at: m.at, kind: m.kind as Mistake['kind'], ref: m.ref }
    if (typeof m.concept === 'string' && m.concept !== '' && m.concept.length <= LIMITS.id) entry.concept = m.concept
    out.push(entry)
  }
  if (dropped) note(c, 'mistakes', `${dropped} invalid entr${dropped === 1 ? 'y' : 'ies'} dropped`)
  return out.length > LIMITS.mistakes ? out.slice(-LIMITS.mistakes) : out
}

function sanitizeScores(c: Ctx, v: unknown): UserProgress['scores'] {
  const out = emptyScores()
  if (v === undefined) return out
  if (!isPlainObject(v)) {
    note(c, 'scores', `expected object, got ${v === null ? 'null' : typeof v}`)
    return out
  }
  for (const k of SKILLS) {
    const raw = v[k]
    if (raw === undefined) continue
    if (!Array.isArray(raw)) {
      note(c, `scores.${k}`, `expected array, got ${raw === null ? 'null' : typeof raw}`)
      continue
    }
    const nums = raw.map(toNumber).filter((n): n is number => n !== undefined)
    if (nums.length !== raw.length) note(c, `scores.${k}`, `${raw.length - nums.length} non-numeric value(s) dropped`)
    const clamped = nums.map(n => Math.round(Math.max(0, Math.min(100, n))))
    out[k] = clamped.length > LIMITS.scoresPerSkill ? clamped.slice(-LIMITS.scoresPerSkill) : clamped
  }
  return out
}

function sanitizeDaily(c: Ctx, v: unknown): UserProgress['daily'] {
  if (!isPlainObject(v)) {
    if (v !== undefined) note(c, 'daily', `expected object, got ${v === null ? 'null' : typeof v}`)
    return {}
  }
  const out: UserProgress['daily'] = {}
  let dropped = 0
  let fixed = 0
  for (const [date, e] of Object.entries(v).sort(([a], [b]) => (a < b ? -1 : 1))) {
    if (!isDayKey(date) || !isPlainObject(e)) {
      dropped++
      continue
    }
    const vocab = pair(e.vocab)
    const grammar = pair(e.grammar)
    const listening = pair(e.listening)
    if (!vocab || !grammar || !listening || typeof e.speaking !== 'boolean') fixed++
    out[date] = { date, vocab: vocab ?? [0, 0], grammar: grammar ?? [0, 0], listening: listening ?? [0, 0], speaking: e.speaking === true }
  }
  if (dropped) note(c, 'daily', `${dropped} invalid entr${dropped === 1 ? 'y' : 'ies'} dropped`)
  if (fixed) note(c, 'daily', `${fixed} entr${fixed === 1 ? 'y' : 'ies'} had missing/invalid fields, normalised`)
  const keys = Object.keys(out)
  if (keys.length > LIMITS.daily) {
    note(c, 'daily', `more than ${LIMITS.daily} days, oldest dropped`)
    for (const k of keys.slice(0, keys.length - LIMITS.daily)) delete out[k]
  }
  return out
}

const TEST_KINDS = ['placement', 'level', 'topic', 'grammar', 'vocabulary', 'listening', 'speaking'] as const

/** Placement and level results (by kind, or by the fixed ids when the kind is absent) are protected from eviction by ordinary test results. */
export const isProtectedTest = (t: Pick<TestResult, 'id' | 'kind'>): boolean =>
  t.kind === 'placement' || t.kind === 'level' || /^(placement|level-)/.test(t.id)

/**
 * Retention of test results (input in chronological order, output in the same order): the ordinary results keep the last `LIMITS.tests`; placement
 * and level results are NOT counted against that cap, only the last `LIMITS.protectedTestsPerId` of each id are kept. With fewer than `LIMITS.tests`
 * results nothing is removed, exactly as before.
 */
export function capTests<T extends Pick<TestResult, 'id' | 'kind'>>(list: readonly T[]): T[] {
  const keep = new Set<T>()
  const ordinary = list.filter(t => !isProtectedTest(t))
  for (const t of ordinary.slice(-LIMITS.tests)) keep.add(t)
  const perId = new Map<string, T[]>()
  for (const t of list) if (isProtectedTest(t)) perId.set(t.id, [...(perId.get(t.id) ?? []), t])
  for (const items of perId.values()) for (const t of items.slice(-LIMITS.protectedTestsPerId)) keep.add(t)
  return list.filter(t => keep.has(t))
}

function sanitizeTestExtras(t: Record<string, unknown>): Partial<TestResult> {
  const out: Partial<TestResult> = {}
  if (typeof t.kind === 'string' && (TEST_KINDS as readonly string[]).includes(t.kind)) out.kind = t.kind as TestResult['kind']
  if (typeof t.outcome === 'string' && t.outcome !== '' && t.outcome.length <= 40) out.outcome = t.outcome
  if (typeof t.blueprint === 'string' && t.blueprint !== '' && t.blueprint.length <= 40) out.blueprint = t.blueprint
  if (isPlainObject(t.parts)) {
    const parts: Record<string, [number, number]> = {}
    const entries = Object.entries(t.parts)
    let ok = entries.length > 0 && entries.length <= 20
    for (const [k, p] of entries) {
      if (!ok) break
      if (k.length > 40 || !Array.isArray(p) || p.length !== 2 || !isFiniteNumber(p[0]) || !isFiniteNumber(p[1]) || p[0] < 0 || p[1] < p[0] || p[1] > 500) ok = false
      else parts[k] = [Math.round(p[0]), Math.round(p[1])]
    }
    if (ok) out.parts = parts
  }
  return out
}

function sanitizeTests(c: Ctx, v: unknown): UserProgress['tests'] {
  if (!Array.isArray(v)) {
    if (v !== undefined) note(c, 'tests', `expected array, got ${v === null ? 'null' : typeof v}`)
    return []
  }
  const out: UserProgress['tests'] = []
  let dropped = 0
  const ids = (x: unknown) =>
    Array.isArray(x) ? x.filter((s): s is string => typeof s === 'string' && s !== '' && s.length <= LIMITS.id) : []
  for (const t of v) {
    const pct = isPlainObject(t) ? toNumber(t.pct) : undefined
    if (
      !isPlainObject(t) ||
      typeof t.id !== 'string' ||
      t.id === '' ||
      t.id.length > LIMITS.id ||
      !isFiniteNumber(t.at) ||
      pct === undefined
    ) {
      dropped++
      continue
    }
    out.push({ id: t.id, at: t.at, pct: Math.round(Math.max(0, Math.min(100, pct))), weak: ids(t.weak), strong: ids(t.strong), ...sanitizeTestExtras(t) })
  }
  if (dropped) note(c, 'tests', `${dropped} invalid entr${dropped === 1 ? 'y' : 'ies'} dropped`)
  return capTests(out)
}

function sanitizeTutor(c: Ctx, v: unknown): UserProgress['tutor'] {
  if (v === undefined) return { messages: [] }
  if (!isPlainObject(v) || !Array.isArray(v.messages)) {
    note(c, 'tutor', 'expected { messages: [] }')
    return { messages: [] }
  }
  const messages: UserProgress['tutor']['messages'] = []
  let dropped = 0
  for (const m of v.messages) {
    if (!isPlainObject(m) || typeof m.id !== 'string' || (m.role !== 'user' && m.role !== 'ai') || typeof m.text !== 'string') {
      dropped++
      continue
    }
    const msg: UserProgress['tutor']['messages'][number] = { id: m.id.slice(0, LIMITS.id), role: m.role, text: m.text.slice(0, LIMITS.tutorText) }
    if (isFiniteNumber(m.at) && m.at >= 0) msg.at = Math.floor(m.at)
    messages.push(msg)
  }
  if (dropped) note(c, 'tutor.messages', `${dropped} invalid message(s) dropped`)
  return { messages: stampTutorMessages(messages.length > LIMITS.tutorMessages ? messages.slice(-LIMITS.tutorMessages) : messages) }
}

/**
 * Messages without a time get `at = position + 1` (S1 design §3.2, refined): the value depends only on the list itself, so every tab and
 * every source (an old monolith record, a stale legacy write, a test fixture) derives the same ordering, and it sorts before any real
 * timestamp. Idempotent: stamped messages are returned unchanged.
 */
export function stampTutorMessages(messages: UserProgress['tutor']['messages']): UserProgress['tutor']['messages'] {
  return messages.every(m => m.at !== undefined) ? messages : messages.map((m, i) => (m.at !== undefined ? m : { ...m, at: i + 1 }))
}

export interface SanitizedProgress {
  value: UserProgress
  /** unknown top-level fields, preserved verbatim */
  extras: Record<string, unknown>
  issues: Issue[]
  /** how many of the known progress fields were present in the input */
  recognized: number
}

/** Returns null when the input is not a plain object at all (nothing to salvage). */
export function sanitizeProgress(input: unknown): SanitizedProgress | null {
  if (!isPlainObject(input)) return null
  const c: Ctx = { issues: [] }
  const d = defaultProgress()
  const has = (k: string) => Object.prototype.hasOwnProperty.call(input, k) && input[k] !== undefined
  const recognized = KNOWN_KEYS.filter(has).length

  const value: UserProgress = {
    name: has('name') ? str(c, 'name', input.name, LIMITS.name, d.name) : d.name,
    lang: has('lang') ? oneOf(c, 'lang', input.lang, LANGS, d.lang) : d.lang,
    theme: has('theme') ? oneOf(c, 'theme', input.theme, THEMES, d.theme) : d.theme,
    level: has('level') ? oneOf(c, 'level', input.level, LEVELS, d.level) : d.level,
    xp: has('xp') ? count(c, 'xp', input.xp, 0, LIMITS.maxXp) : 0,
    activeDates: [],
    studySeconds: has('studySeconds') ? count(c, 'studySeconds', input.studySeconds, 0) : 0,
    completed: has('completed') ? strList(c, 'completed', input.completed, LIMITS.completed) : [],
    mastery: sanitizeMastery(c, input.mastery),
    saved: has('saved') ? strList(c, 'saved', input.saved, LIMITS.saved) : [],
    mistakes: sanitizeMistakes(c, input.mistakes),
    scores: sanitizeScores(c, input.scores),
    daily: sanitizeDaily(c, input.daily),
    tests: sanitizeTests(c, input.tests),
    weeklyGoal: d.weeklyGoal,
    tutor: sanitizeTutor(c, input.tutor),
  }

  if (has('activeDates')) {
    const raw = input.activeDates
    if (!Array.isArray(raw)) note(c, 'activeDates', `expected array, got ${raw === null ? 'null' : typeof raw}`)
    else {
      const days = raw.filter(isDayKey)
      if (days.length !== raw.length) note(c, 'activeDates', `${raw.length - days.length} invalid date(s) dropped`)
      const uniq = [...new Set(days)]
      value.activeDates = uniq.length > LIMITS.activeDates ? uniq.slice(-LIMITS.activeDates) : uniq
    }
  }
  if (has('weeklyGoal')) {
    const n = toNumber(input.weeklyGoal)
    if (n === undefined || n < 1 || n > 7) note(c, 'weeklyGoal', 'expected a number from 1 to 7')
    else value.weeklyGoal = Math.round(n)
  }

  const extras: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(input)) if (!KNOWN_KEYS.includes(k)) extras[k] = v
  return { value, extras, issues: c.issues, recognized }
}
