/**
 * Deterministic merge of two states of the SAME learner (05 §9): used when another tab wrote the record, and to fold in
 * progress that a stale app version wrote to the legacy key.
 *
 * Properties (all property-tested):
 *   idempotent      merge(a, a) ≡ a
 *   commutative     merge(a, b) ≡ merge(b, a)          (so tabs converge regardless of who merges first)
 *   monotonic       nothing the learner earned in either state disappears: ledger entries, completions, results, mastery attempts
 * Deliberate replacements (reset/restore) carry a higher `epoch`; the higher epoch is ADOPTED, not merged, so a reset in one tab
 * cannot be undone by a stale tab.
 *
 * Known approximations (documented limits, not silent): removals do not propagate (un-saving a word in one tab can be undone by a
 * merge); score histories take the longer side; the tutor transcript is a union by id with a clear watermark (mergeTutor); per-day summaries take the larger counters.
 */
import type { UserProgress } from '../data/types'
import { compareKeys, pruneActivity, type ActivityState, type Completion, type Summary } from './activity'
import { mergeResultLists, mergeResultsMeta } from './results'
import type { CreditEntry } from './credit'
import type { Core } from './core'
import { LIMITS, stampTutorMessages } from './validate'

/** JSON with object keys sorted, so equal values compare equal regardless of insertion order */
const j = (v: unknown): string =>
  JSON.stringify(v, (_k, val) =>
    val && typeof val === 'object' && !Array.isArray(val)
      ? Object.fromEntries(Object.entries(val as Record<string, unknown>).sort(([x], [y]) => (x < y ? -1 : x > y ? 1 : 0)))
      : val,
  )
const byJson = <T>(a: T, b: T): T => (j(a) >= j(b) ? a : b) // total order for deterministic tie-breaks

function unionBy<T>(a: readonly T[], b: readonly T[], key: (t: T) => string, pick: (x: T, y: T) => T = byJson): T[] {
  const m = new Map<string, T>()
  for (const t of [...a, ...b]) {
    const k = key(t)
    const prev = m.get(k)
    m.set(k, prev === undefined ? t : pick(prev, t))
  }
  return [...m.values()]
}

const ledgerOrder = (x: CreditEntry, y: CreditEntry) => x.at - y.at || (x.id < y.id ? -1 : x.id > y.id ? 1 : 0)

function mergeMastery(a: UserProgress['mastery'], b: UserProgress['mastery']): UserProgress['mastery'] {
  const out: UserProgress['mastery'] = {}
  for (const id of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const x = a[id]
    const y = b[id]
    if (!x || !y) out[id] = x ?? y
    else if (x.seen !== y.seen)
      out[id] = x.seen > y.seen ? x : y // more practice = more recent state
    else if (x.due !== y.due) out[id] = x.due > y.due ? x : y
    else out[id] = byJson(x, y)
  }
  return out
}

function mergeCompletion(x: Completion, y: Completion): Completion {
  const passed = [x, y]
    .filter(c => c.firstPassedAt !== null)
    .sort((p, q) => (p.firstPassedAt as number) - (q.firstPassedAt as number) || (j(p) < j(q) ? -1 : 1))
  const first = passed[0]
  return {
    firstPassedAt: first?.firstPassedAt ?? null,
    bestScore: x.bestScore === null ? y.bestScore : y.bestScore === null ? x.bestScore : Math.max(x.bestScore, y.bestScore),
    attempts: Math.max(x.attempts, y.attempts),
    passingResultId: first?.passingResultId ?? null,
    source: x.source === 'result' || y.source === 'result' ? 'result' : 'migration',
  }
}

function mergeSummaries(a: Record<string, Summary>, b: Record<string, Summary>): Record<string, Summary> {
  const out: Record<string, Summary> = {}
  for (const d of [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()) {
    const x = a[d]
    const y = b[d]
    out[d] =
      !x || !y
        ? { ...(x ?? y) }
        : {
            results: Math.max(x.results, y.results),
            correct: Math.max(x.correct, y.correct),
            total: Math.max(x.total, y.total),
            activeMs: Math.max(x.activeMs, y.activeMs),
            xp: Math.max(x.xp, y.xp),
          }
  }
  return out
}

function mergeActivity(a: ActivityState, b: ActivityState, now: number): ActivityState {
  const completions: Record<string, Completion> = {}
  for (const k of [...new Set([...Object.keys(a.completions), ...Object.keys(b.completions)])].sort()) {
    const x = a.completions[k]
    const y = b.completions[k]
    completions[k] = x && y ? mergeCompletion(x, y) : { ...(x ?? y) }
  }
  // history is append-only: a plain union, nothing is ever folded or dropped (S2, owner decision C4)
  const results = mergeResultLists(a.results, b.results)
  const tombstones = unionBy(
    a.tombstones,
    b.tombstones,
    t => t.resultId,
    (x, y) => (x.at <= y.at ? x : y),
  ).sort((x, y) => (x.resultId < y.resultId ? -1 : 1))
  // reserved/inactive: merged by max, never decided on
  const pt = a.prunedThrough && b.prunedThrough ? (compareKeys(a.prunedThrough, b.prunedThrough) >= 0 ? a.prunedThrough : b.prunedThrough) : (a.prunedThrough ?? b.prunedThrough)
  // tombstone expiry (unchanged rule) is the only thing pruneActivity does
  return pruneActivity(
    { completions, results, tombstones, summaries: mergeSummaries(a.summaries, b.summaries), ...(pt ? { prunedThrough: pt } : {}) },
    now,
  )
}

/** A deliberate replacement (higher epoch) wins for the CORE data — but the history is independent of epochs and is always unioned (STO-90). */
function withHistory(w: Core, a: Core, b: Core): Core {
  const have = new Set(w.activity.results.map(r => r.resultId))
  const missing = [...a.activity.results, ...b.activity.results].some(r => !have.has(r.resultId))
  const meta = mergeResultsMeta(a.resultsMeta, b.resultsMeta)
  if (!missing && j(meta) === j(w.resultsMeta)) return w
  return { ...w, activity: { ...w.activity, results: mergeResultLists(a.activity.results, b.activity.results) }, resultsMeta: meta }
}

const pairMax = (x: [number, number], y: [number, number]): [number, number] => [Math.max(x[0], y[0]), Math.max(x[1], y[1])]

type TutorState = { messages: UserProgress['tutor']['messages']; clearedAt: number }

/**
 * Tutor transcript merge (S1 design §3.2; same-id collisions refined to keep both unrenamed to preserve associativity). Total, deterministic, commutative, idempotent:
 *   - `clearedAt` = max; messages at or before it are dropped (a clear propagates and cannot be undone by a stale tab);
 *   - union of identical messages; two DIFFERENT messages with the same id are both kept (never renamed or dropped);
 *   - order by (at, id); the newest 60 are kept. When one side extends the other this is exactly the longer side, as before.
 */
export function mergeTutor(a: TutorState, b: TutorState): TutorState {
  const clearedAt = Math.max(a.clearedAt, b.clearedAt)
  // identity = id + role + text (NOT the time): the same message seen with two different positions/times (e.g. once as a position-based
  // stamp, once with its real time) appears once, with the LATER time; two DIFFERENT messages that happen to share an id are both kept
  // (no renaming, so the result does not depend on which other variants are present — that keeps the merge associative)
  const unique = new Map<string, UserProgress['tutor']['messages'][number]>()
  for (const m of [...stampTutorMessages(a.messages), ...stampTutorMessages(b.messages)]) {
    const key = j({ id: m.id, role: m.role, text: m.text })
    const seen = unique.get(key)
    unique.set(key, seen && (seen.at ?? 0) >= (m.at ?? 0) ? seen : m)
  }
  const out = [...unique.values()]
  const kept = out
    .filter(m => (m.at ?? 0) > clearedAt)
    .sort((x, y) => (x.at ?? 0) - (y.at ?? 0) || (x.id < y.id ? -1 : x.id > y.id ? 1 : 0) || (j(x) < j(y) ? -1 : j(x) > j(y) ? 1 : 0))
  return { messages: kept.length > LIMITS.tutorMessages ? kept.slice(-LIMITS.tutorMessages) : kept, clearedAt }
}

function mergeProgress(a: Core, b: Core, xp: number): UserProgress {
  const x = a.progress
  const y = b.progress
  const sx = pickSettings(x)
  const sy = pickSettings(y)
  const settings = a.settingsAt !== b.settingsAt ? (a.settingsAt > b.settingsAt ? sx : sy) : j(sx) >= j(sy) ? sx : sy
  const daily: UserProgress['daily'] = {}
  for (const d of [...new Set([...Object.keys(x.daily), ...Object.keys(y.daily)])].sort()) {
    const p = x.daily[d]
    const q = y.daily[d]
    daily[d] =
      !p || !q
        ? { ...(p ?? q) }
        : {
            date: d,
            vocab: pairMax(p.vocab, q.vocab),
            grammar: pairMax(p.grammar, q.grammar),
            listening: pairMax(p.listening, q.listening),
            speaking: p.speaking || q.speaking,
          }
  }
  const scores = { ...x.scores }
  for (const k of Object.keys(scores) as (keyof UserProgress['scores'])[]) {
    const s1 = x.scores[k]
    const s2 = y.scores[k]
    scores[k] = s1.length !== s2.length ? (s1.length > s2.length ? s1 : s2) : byJson(s1, s2)
  }
  const completed = [...new Set([...x.completed, ...y.completed])].sort() // no ordering semantics: sorted for a canonical form
  const tutor = mergeTutor({ messages: x.tutor.messages, clearedAt: a.tutorClearedAt }, { messages: y.tutor.messages, clearedAt: b.tutorClearedAt })
  return {
    name: settings.name,
    lang: settings.lang,
    theme: settings.theme,
    level: settings.level,
    weeklyGoal: settings.weeklyGoal,
    xp,
    activeDates: [...new Set([...x.activeDates, ...y.activeDates])].sort().slice(-LIMITS.activeDates),
    studySeconds: Math.max(x.studySeconds, y.studySeconds),
    completed,
    mastery: mergeMastery(x.mastery, y.mastery),
    saved: [...new Set([...x.saved, ...y.saved])].sort(),
    mistakes: unionBy(x.mistakes, y.mistakes, m => `${m.at}|${m.kind}|${m.ref}|${m.concept ?? ''}`)
      .sort((p, q) => p.at - q.at || (j(p) < j(q) ? -1 : 1))
      .slice(-LIMITS.mistakes),
    scores,
    daily,
    tests: unionBy(x.tests, y.tests, t => `${t.id}|${t.at}`)
      .sort((p, q) => p.at - q.at || (p.id < q.id ? -1 : 1))
      .slice(-LIMITS.tests),
    tutor: { messages: tutor.messages },
  }
}

const pickSettings = (p: UserProgress) => ({ name: p.name, lang: p.lang, theme: p.theme, level: p.level, weeklyGoal: p.weeklyGoal })

export function mergeCores(a: Core, b: Core, now: number): Core {
  if (a.epoch !== b.epoch) return withHistory(a.epoch > b.epoch ? a : b, a, b) // a deliberate replacement wins over anything older — except the history, which is never invalidated
  const entries = unionBy(a.credit.entries, b.credit.entries, e => e.id).sort(ledgerOrder)
  const xp = entries.reduce((s, e) => s + e.xp, 0)
  const progress = mergeProgress(a, b, xp)
  // the completion projection and the completion records must agree after the union
  const activity = mergeActivity(a.activity, b.activity, now)
  const missing = Object.entries(activity.completions)
    .filter(([k, c]) => (c.firstPassedAt !== null || c.source === 'migration') && !progress.completed.includes(k))
    .map(([k]) => k)
  if (missing.length) progress.completed = [...progress.completed, ...missing].sort()
  const extras: Record<string, unknown> = {}
  for (const k of [...new Set([...Object.keys(a.extras), ...Object.keys(b.extras)])].sort())
    extras[k] = k in a.extras && k in b.extras ? byJson(a.extras[k], b.extras[k]) : (a.extras[k] ?? b.extras[k])
  return {
    progress,
    credit: { entries },
    activity,
    extras,
    origin:
      a.origin && b.origin
        ? a.origin.legacyFingerprint === b.origin.legacyFingerprint
          ? byJson(a.origin, b.origin)
          : a.origin.migratedAt >= b.origin.migratedAt
            ? a.origin
            : b.origin
        : (a.origin ?? b.origin),
    epoch: a.epoch,
    settingsAt: Math.max(a.settingsAt, b.settingsAt),
    tutorAt: Math.max(a.tutorAt, b.tutorAt),
    tutorClearedAt: Math.max(a.tutorClearedAt, b.tutorClearedAt),
    upgrade: a.upgrade && b.upgrade ? (a.upgrade.at >= b.upgrade.at ? a.upgrade : b.upgrade) : (a.upgrade ?? b.upgrade),
    resultsMeta: mergeResultsMeta(a.resultsMeta, b.resultsMeta),
  }
}

/** Order-independent comparison form used to decide whether a write would change anything. */
export const canonicalJson = (c: Core, now = 0): string => j(mergeCores(c, c, now))
