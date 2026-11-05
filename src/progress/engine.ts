/**
 * The single place where an ActivityResult becomes XP, completion and history (03 §4, 05 §4.2). Pure: Core in, Core out,
 * so the whole effect of a result is applied by ONE state update and persisted by ONE atomic write.
 *
 *  1 validate                                 → invalid results change nothing
 *  2 idempotency by `resultId`                → a replayed result (also after pruning, via the tombstone) changes nothing
 *  3 reward from DURABLE state                → first-time item credit and the first-completion bonus come from the credit ledger
 *  4 completion                               → derived from the pass rule of the policy (V-05: a 0 % test no longer completes anything)
 *  5 bounded audit buffer + tombstone         → raw detail may be pruned without changing any total (storage/activity.ts)
 * Mastery is NOT touched here: the SRS state is updated per answer by `answerVocab` (unchanged algorithm), and is durable on its own.
 */
import { LEVELS } from '../data/types'
import { migrationCompletion, pruneActivity, RETENTION, type Completion, type StoredResult } from '../storage/activity'
import { award, validKey, type CreditState } from '../storage/credit'
import type { Core } from '../storage/core'
import { COURSE_ID } from '../storage/defaults'
import { dayKey } from '../utils/date'
import { POLICIES, policyFor } from './policy'
import { ACTIVITY_KINDS, type ActivityResult, type ItemOutcome, type RecordOutcome, type RewardPolicy } from './types'

const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)
const isId = (v: unknown): v is string => typeof v === 'string' && v.length > 0 && v.length <= RETENTION.maxId && v.trim() === v

/** Returns an explanation when the result is unusable. Results are untrusted input (UI code, replays, future sync). */
export function validateResult(r: unknown): string | null {
  if (typeof r !== 'object' || r === null) return 'not an object'
  const x = r as Record<string, unknown>
  if (!isId(x.resultId)) return 'resultId'
  if (x.courseId !== COURSE_ID) return 'unknown course'
  if (!isId(x.activityId)) return 'activityId'
  if (!ACTIVITY_KINDS.includes(x.kind as never)) return 'kind'
  if (!(LEVELS as readonly unknown[]).includes(x.levelId)) return 'levelId'
  if (!isNum(x.startedAt) || !isNum(x.finishedAt) || x.finishedAt < x.startedAt) return 'times'
  if (!isNum(x.activeMs) || x.activeMs < 0) return 'activeMs'
  if (typeof x.assisted !== 'boolean') return 'assisted'
  if (!Array.isArray(x.items) || x.items.length > 500) return 'items'
  for (const i of x.items as ItemOutcome[]) {
    if (typeof i !== 'object' || i === null || !isId(i.itemRef) || !['correct', 'incorrect', 'partial', 'skipped'].includes(i.outcome))
      return 'item'
  }
  if (x.score !== null) {
    const s = x.score as { earned?: unknown; possible?: unknown } | undefined
    if (!s || !isNum(s.earned) || !isNum(s.possible) || s.possible <= 0 || s.earned < 0 || s.earned > s.possible) return 'score'
  }
  if (!Array.isArray(x.completes) || x.completes.length > 10 || !x.completes.every(isId)) return 'completes'
  if (!['measured', 'heuristic', 'self-reported'].includes(x.evidence as string)) return 'evidence'
  return null
}

export const scoreFraction = (r: Pick<ActivityResult, 'score'>): number | null =>
  r.score && r.score.possible > 0 ? r.score.earned / r.score.possible : null

/** The pass rule: participation-based when the policy has no threshold, otherwise the score must reach it. */
export function passes(r: Pick<ActivityResult, 'score'>, policy: RewardPolicy): boolean {
  if (policy.passThreshold === null) return true
  const f = scoreFraction(r)
  return f !== null && f >= policy.passThreshold
}

const scale = (n: number, factor: number) => Math.floor(Math.max(0, n) * Math.min(1, Math.max(0, factor)))

export interface RecordResultOutput {
  core: Core
  outcome: RecordOutcome
}

export function recordResult(
  core: Core,
  result: ActivityResult,
  now: number,
  table: Record<ActivityResult['kind'], RewardPolicy> = POLICIES,
): RecordResultOutput {
  const rejected = (detail: string): RecordResultOutput => ({
    core,
    outcome: { applied: false, reason: 'invalid', detail, xpAwarded: 0, passed: false, completionsGained: [] },
  })
  const bad = validateResult(result)
  if (bad) return rejected(bad)

  // idempotency: Core TOMBSTONES are the sole duplicate-credit authority (S2, STO-98). The history record never grants or denies first-time XP.
  if (core.activity.tombstones.some(t => t.resultId === result.resultId)) {
    return { core, outcome: { applied: false, reason: 'duplicate', xpAwarded: 0, passed: false, completionsGained: [] } }
  }

  const policy = policyFor(result.kind, table)
  const passed = passes(result, policy)
  const factor = result.assisted ? policy.assistedFactor : 1

  // ---- reward, from durable state
  let credit: CreditState = core.credit
  let xp = 0
  const give = (key: string, amount: number) => {
    if (!validKey(key)) return
    const r = award(credit, key, amount, now, policy.policyVersion)
    credit = r.state
    xp += r.awarded
  }
  if (policy.xpBasis === 'perCorrectFirstTime') {
    const seen = new Set<string>()
    for (const item of result.items) {
      if (seen.has(item.itemRef)) continue
      seen.add(item.itemRef)
      if (item.outcome === 'correct') give(item.itemRef, scale(policy.xpPerUnit, factor))
      else if (item.outcome === 'incorrect' || item.outcome === 'partial') give(item.itemRef, scale(policy.xpPerIncorrect, factor))
    }
  }
  if (passed && policy.firstCompletionBonus > 0) give(`bonus:${result.activityId}`, scale(policy.firstCompletionBonus, factor))
  if (
    policy.repeat.creditAfterFirst === 'daily-cap' &&
    xp === 0 &&
    (core.activity.completions[result.activityId]?.attempts ?? 0) +
      core.activity.results.filter(r => r.activityId === result.activityId).length >
      0
  ) {
    const correct = result.items.filter(i => i.outcome === 'correct').length
    const cap = policy.repeat.dailyCapXp ?? 0
    const key = `repeat:${result.kind}:${dayKey(new Date(now))}`
    const have = credit.entries.filter(e => e.kind === 'earn' && e.key === key).reduce((m, e) => Math.max(m, e.creditedTo ?? 0), 0)
    give(key, Math.min(cap, have + scale(correct * policy.xpPerUnit * (policy.repeat.reducedFactor ?? 1), factor)))
  }

  // ---- completion (derived from the pass rule)
  const completions: Record<string, Completion> = { ...core.activity.completions }
  const frac = scoreFraction(result)
  const keys = [...new Set([...(policy.completesSelf ? [result.activityId] : []), ...result.completes])]
  const gained: string[] = []
  const completed = new Set(core.progress.completed)
  for (const k of keys) {
    const prev = completions[k] ?? { ...migrationCompletion(), source: 'result' as const }
    const next: Completion = {
      ...prev,
      attempts: prev.attempts + 1,
      bestScore: frac === null ? prev.bestScore : prev.bestScore === null ? frac : Math.max(prev.bestScore, frac),
    }
    if (passed && next.firstPassedAt === null && next.source === 'result') {
      next.firstPassedAt = result.finishedAt
      next.passingResultId = result.resultId
    }
    completions[k] = next
    if (passed && !completed.has(k)) gained.push(k)
  }

  const stored: StoredResult = {
    resultId: result.resultId,
    activityId: result.activityId,
    kind: result.kind,
    finishedAt: result.finishedAt,
    activeMs: Math.floor(result.activeMs),
    assisted: result.assisted,
    score: result.score,
    passed,
    xp,
    items: result.items.slice(0, RETENTION.itemsPerResult).map(i => ({ itemRef: i.itemRef, outcome: i.outcome })),
    // attempt-level fields that exist in ActivityResult and used to be dropped (S2, STO-82); present only when valid, never invented
    ...(Number.isFinite(result.startedAt) ? { startedAt: Math.floor(result.startedAt) } : {}),
    ...(typeof result.levelId === 'string' ? { levelId: result.levelId } : {}),
    ...(result.evidence === 'measured' || result.evidence === 'heuristic' || result.evidence === 'self-reported' ? { evidence: result.evidence } : {}),
  }
  const activity = pruneActivity(
    {
      ...core.activity,
      completions,
      // history is append-only; an entry that is already held (e.g. loaded from the history record without a tombstone) is not duplicated
      results: core.activity.results.some(r => r.resultId === stored.resultId) ? core.activity.results : [...core.activity.results, stored],
      tombstones: [...core.activity.tombstones, { resultId: result.resultId, at: now }],
    },
    now,
  )

  // ---- active day + projection kept for the existing selectors
  const day = dayKey(new Date(now))
  const progress = {
    ...core.progress,
    xp: core.progress.xp + xp,
    completed: gained.length ? [...core.progress.completed, ...gained] : core.progress.completed,
    activeDates: core.progress.activeDates.includes(day) ? core.progress.activeDates : [...core.progress.activeDates, day].slice(-400),
  }
  return { core: { ...core, progress, credit, activity }, outcome: { applied: true, xpAwarded: xp, passed, completionsGained: gained } }
}
