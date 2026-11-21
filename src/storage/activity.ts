/**
 * Persisted shapes of the activity-result system (05 §3, §4.4): durable completions, the BOUNDED raw-results buffer,
 * idempotency tombstones and permanent per-day summaries. Validation here mirrors storage/validate.ts: never throws, salvage first.
 *
 * The processing logic lives in src/progress/engine.ts; this file only owns what is written to disk.
 */
import type { Issue } from './validate'
import { isDayKey, isPlainObject } from './validate'

/**
 * Retention parameters. S2 (owner-approved): detailed Results history is NEVER pruned, folded or deleted automatically, so
 * `resultsMin`/`resultsDays` are no longer applied anywhere (kept only because older tests/documents name them). Tombstone expiry is unchanged.
 */
export const RETENTION = {
  /** NOT APPLIED since S2 (no automatic folding of results) */
  resultsMin: 500,
  /** NOT APPLIED since S2 */
  resultsDays: 90,
  /** idempotency tombstones live at least this long (longer than any replay window) */
  tombstoneDays: 400,
  itemsPerResult: 50,
  maxId: 120,
} as const

const DAY_MS = 86_400_000

export interface Completion {
  /** null while only failed attempts exist */
  firstPassedAt: number | null
  /** best score fraction 0..1, null when never scored */
  bestScore: number | null
  attempts: number
  passingResultId: string | null
  /** 'migration': grandfathered from the legacy store (05 §11), never required to pass a new threshold */
  source: 'result' | 'migration'
}

export interface StoredItem {
  itemRef: string
  outcome: 'correct' | 'incorrect' | 'partial' | 'skipped'
  /** unknown optional fields (written by a later version / S2b) survive sanitisation and rewrites */
  [extra: string]: unknown
}

/**
 * One attempt in the learner's history (S2 design §13.8). Optional fields are absent for entries migrated from S1 and are NEVER invented.
 * `xp` is informational ("XP computed at the time"): it never grants XP — rewards are governed by the Core ledger and tombstones.
 */
export interface StoredResult {
  resultId: string
  activityId: string
  kind: string
  finishedAt: number
  activeMs: number
  assisted: boolean
  score: { earned: number; possible: number } | null
  passed: boolean
  xp: number
  items: StoredItem[]
  startedAt?: number
  levelId?: string
  evidence?: 'measured' | 'heuristic' | 'self-reported'
  /** absent ⇒ 1 */
  entrySchema?: number
  /** unknown optional fields survive sanitisation and rewrites (STO-82 condition) */
  [extra: string]: unknown
}

/** Order key of an attempt: (finishedAt, resultId). Reserved for the future deletion stage; no S2 code decides anything with it. */
export interface OrderKey {
  finishedAt: number
  resultId: string
}
export const compareKeys = (a: OrderKey, b: OrderKey): number =>
  a.finishedAt - b.finishedAt || (a.resultId < b.resultId ? -1 : a.resultId > b.resultId ? 1 : 0)

export interface Tombstone {
  resultId: string
  at: number
}

export interface Summary {
  results: number
  correct: number
  total: number
  activeMs: number
  xp: number
}

export interface ActivityState {
  completions: Record<string, Completion>
  results: StoredResult[]
  tombstones: Tombstone[]
  /** permanent, keyed by local day; S2 folds nothing new into it (existing S1 summaries are kept and merged as before) */
  summaries: Record<string, Summary>
  /** RESERVED / INACTIVE in S2 (STO-74): validated, preserved, merged by max, never written with a value, never read to decide anything */
  prunedThrough?: OrderKey | null
}

export const emptyActivity = (): ActivityState => ({ completions: {}, results: [], tombstones: [], summaries: {} })

export const migrationCompletion = (): Completion => ({
  firstPassedAt: null,
  bestScore: null,
  attempts: 0,
  passingResultId: null,
  source: 'migration',
})

const OUTCOMES = ['correct', 'incorrect', 'partial', 'skipped'] as const
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
const isId = (v: unknown): v is string => typeof v === 'string' && v !== '' && v.length <= RETENTION.maxId

export const localDay = (ms: number): string => {
  const d = new Date(ms)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function sanitizeCompletions(input: unknown, issues: Issue[]): Record<string, Completion> {
  const out: Record<string, Completion> = {}
  if (input === undefined) return out
  if (!isPlainObject(input)) {
    issues.push({ path: 'activity.completions', problem: 'expected object' })
    return out
  }
  let dropped = 0
  for (const [key, c] of Object.entries(input)) {
    if (!isId(key) || !isPlainObject(c)) {
      dropped++
      continue
    }
    out[key] = {
      firstPassedAt: isNum(c.firstPassedAt) ? c.firstPassedAt : null,
      bestScore: isNum(c.bestScore) ? Math.max(0, Math.min(1, c.bestScore)) : null,
      attempts: isNum(c.attempts) && c.attempts >= 0 ? Math.floor(c.attempts) : 0,
      passingResultId: isId(c.passingResultId) ? c.passingResultId : null,
      source: c.source === 'migration' ? 'migration' : 'result',
    }
  }
  if (dropped) issues.push({ path: 'activity.completions', problem: `${dropped} invalid entr${dropped === 1 ? 'y' : 'ies'} dropped` })
  return out
}

const KNOWN_ENTRY = new Set([
  'resultId',
  'activityId',
  'kind',
  'finishedAt',
  'activeMs',
  'assisted',
  'score',
  'passed',
  'xp',
  'items',
  'startedAt',
  'levelId',
  'evidence',
  'entrySchema',
])
const KNOWN_ITEM = new Set(['itemRef', 'outcome'])
const EVIDENCE = ['measured', 'heuristic', 'self-reported'] as const
const unknownKeys = (o: Record<string, unknown>, known: Set<string>): Record<string, unknown> =>
  Object.fromEntries(Object.entries(o).filter(([k]) => !known.has(k)))

/** Validates a list of history entries. Unknown optional fields are PRESERVED; nothing is invented; invalid entries are reported (callers quarantine the exact bytes first). */
export function sanitizeResults(input: unknown, issues: Issue[]): StoredResult[] {
  if (input === undefined) return []
  if (!Array.isArray(input)) {
    issues.push({ path: 'activity.results', problem: 'expected array' })
    return []
  }
  const seen = new Set<string>()
  const out: StoredResult[] = []
  let dropped = 0
  for (const r of input) {
    if (
      !isPlainObject(r) ||
      !isId(r.resultId) ||
      !isId(r.activityId) ||
      typeof r.kind !== 'string' ||
      !isNum(r.finishedAt) ||
      seen.has(r.resultId)
    ) {
      dropped++
      continue
    }
    seen.add(r.resultId)
    const score =
      isPlainObject(r.score) && isNum(r.score.earned) && isNum(r.score.possible) && r.score.possible > 0 && r.score.earned >= 0
        ? { earned: Math.min(r.score.earned, r.score.possible), possible: r.score.possible }
        : null
    const items: StoredItem[] = Array.isArray(r.items)
      ? r.items
          .filter(
            (i): i is Record<string, unknown> =>
              isPlainObject(i) && isId(i.itemRef) && (OUTCOMES as readonly unknown[]).includes(i.outcome),
          )
          .slice(0, RETENTION.itemsPerResult)
          .map(i => ({ itemRef: i.itemRef as string, outcome: i.outcome as StoredItem['outcome'], ...unknownKeys(i, KNOWN_ITEM) }))
      : []
    const optional: Partial<StoredResult> = {}
    if (isNum(r.startedAt) && r.startedAt >= 0) optional.startedAt = Math.floor(r.startedAt)
    if (typeof r.levelId === 'string' && r.levelId !== '' && r.levelId.length <= 16) optional.levelId = r.levelId
    if ((EVIDENCE as readonly unknown[]).includes(r.evidence)) optional.evidence = r.evidence as StoredResult['evidence']
    if (isNum(r.entrySchema) && Number.isInteger(r.entrySchema) && r.entrySchema >= 1) optional.entrySchema = r.entrySchema
    // canonical field order (known fields first, then the optional ones, then unknown optional fields) so a re-read entry serialises identically
    out.push({
      resultId: r.resultId,
      activityId: r.activityId,
      kind: r.kind,
      finishedAt: r.finishedAt,
      activeMs: isNum(r.activeMs) && r.activeMs >= 0 ? Math.floor(r.activeMs) : 0,
      assisted: r.assisted === true,
      score,
      passed: r.passed === true,
      xp: isNum(r.xp) && r.xp >= 0 ? Math.floor(r.xp) : 0,
      items,
      ...optional,
      ...unknownKeys(r, KNOWN_ENTRY),
    })
  }
  if (dropped)
    issues.push({ path: 'activity.results', problem: `${dropped} invalid or duplicate entr${dropped === 1 ? 'y' : 'ies'} dropped` })
  return out
}

function sanitizeTombstones(input: unknown, issues: Issue[]): Tombstone[] {
  if (input === undefined) return []
  if (!Array.isArray(input)) {
    issues.push({ path: 'activity.tombstones', problem: 'expected array' })
    return []
  }
  const seen = new Map<string, number>()
  for (const t of input)
    if (isPlainObject(t) && isId(t.resultId) && isNum(t.at)) seen.set(t.resultId, Math.min(t.at, seen.get(t.resultId) ?? Infinity))
  if (seen.size !== input.length) issues.push({ path: 'activity.tombstones', problem: 'invalid or duplicate entries dropped' })
  return [...seen].map(([resultId, at]) => ({ resultId, at }))
}

function sanitizeSummaries(input: unknown, issues: Issue[]): Record<string, Summary> {
  const out: Record<string, Summary> = {}
  if (input === undefined) return out
  if (!isPlainObject(input)) {
    issues.push({ path: 'activity.summaries', problem: 'expected object' })
    return out
  }
  const n = (v: unknown) => (isNum(v) && v >= 0 ? Math.floor(v) : 0)
  for (const [day, s] of Object.entries(input)) {
    if (!isDayKey(day) || !isPlainObject(s)) continue
    out[day] = { results: n(s.results), correct: n(s.correct), total: n(s.total), activeMs: n(s.activeMs), xp: n(s.xp) }
  }
  return out
}

/**
 * Validates a persisted ActivityState and reconciles it with the `completed` projection kept in `UserProgress`:
 * nothing is ever dropped from either side — a key present in only one place is added to the other.
 */
export function sanitizeActivity(
  input: unknown,
  completed: readonly string[],
): { activity: ActivityState; completed: string[]; issues: Issue[] } {
  const issues: Issue[] = []
  const src = isPlainObject(input) ? input : {}
  if (input !== undefined && !isPlainObject(input)) issues.push({ path: 'activity', problem: 'expected object' })
  const completions = sanitizeCompletions(src.completions, issues)
  const done = [...completed]
  const have = new Set(done)
  for (const [key, c] of Object.entries(completions)) {
    if ((c.firstPassedAt !== null || c.source === 'migration') && !have.has(key)) {
      done.push(key) // a passed completion must be visible in the projection
      have.add(key)
    }
  }
  for (const key of done) if (!completions[key]) completions[key] = migrationCompletion() // grandfathered, e.g. pre-P1 or legacy data
  return {
    activity: {
      completions,
      results: sanitizeResults(src.results, issues),
      tombstones: sanitizeTombstones(src.tombstones, issues),
      summaries: sanitizeSummaries(src.summaries, issues),
      ...(isPlainObject(src.prunedThrough) && isNum(src.prunedThrough.finishedAt) && isId(src.prunedThrough.resultId)
        ? { prunedThrough: { finishedAt: src.prunedThrough.finishedAt, resultId: src.prunedThrough.resultId } }
        : {}),
    },
    completed: done,
    issues,
  }
}

/** Folds a pruned raw result into the permanent per-day summary. */
export function summarise(into: Record<string, Summary>, r: StoredResult): void {
  const day = localDay(r.finishedAt)
  const s = (into[day] ??= { results: 0, correct: 0, total: 0, activeMs: 0, xp: 0 })
  s.results += 1
  s.correct += r.items.filter(i => i.outcome === 'correct').length
  s.total += r.items.length
  s.activeMs += r.activeMs
  s.xp += r.xp
}

/**
 * S2 (owner decision C4): this function ONLY expires tombstones older than `tombstoneDays` (unchanged rule, reward-idempotency data).
 * Detailed Results are NEVER folded, pruned or removed — the former retention rule (500 results / 90 days) is gone. Pure and idempotent.
 */
export function pruneActivity(a: ActivityState, now: number): ActivityState {
  const tcut = now - RETENTION.tombstoneDays * DAY_MS
  const tombstones = a.tombstones.filter(t => t.at >= tcut)
  if (tombstones.length === a.tombstones.length) return a
  return { ...a, tombstones }
}
