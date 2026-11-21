// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { recordResult, passes, validateResult } from '../../src/progress/engine'
import { POLICIES } from '../../src/progress/policy'
import type { ActivityKind, ActivityResult, RewardPolicy } from '../../src/progress/types'
import { RETENTION, pruneActivity } from '../../src/storage/activity'
import { freshCore, type Core } from '../../src/storage/core'
import { totalXp } from '../../src/storage/credit'
import { seeded } from '../../src/utils/random'

const NOW = 1_760_000_000_000
const DAY = 86_400_000
let n = 0
const result = (over: Partial<ActivityResult> = {}): ActivityResult => ({
  resultId: `r${++n}`,
  courseId: 'de-general',
  activityId: 'topic:a',
  kind: 'lesson',
  levelId: 'A1',
  startedAt: NOW - 1000,
  finishedAt: NOW,
  activeMs: 800,
  assisted: false,
  items: [],
  score: null,
  evidence: 'measured',
  completes: [],
  ...over,
})
const quiz = (id: string, correct: number, total: number, over: Partial<ActivityResult> = {}) =>
  result({
    activityId: id,
    kind: 'quiz',
    items: Array.from({ length: total }, (_, i) => ({
      itemRef: `q:${id}-${i}`,
      outcome: i < correct ? ('correct' as const) : ('incorrect' as const),
    })),
    score: { earned: correct, possible: total },
    ...over,
  })
const apply = (c: Core, r: ActivityResult, now = NOW) => recordResult(c, r, now)
const run = (rs: ActivityResult[], c: Core = freshCore(), now = NOW) => rs.reduce((core, r) => apply(core, r, now).core, c)

describe('validateResult', () => {
  it('accepts a well-formed result', () => {
    expect(validateResult(result())).toBeNull()
  })

  it.each([
    ['null', null],
    ['string', 'x'],
    ['no id', { ...result(), resultId: '' }],
    ['padded id', { ...result(), resultId: ' x ' }],
    ['over-long id', { ...result(), resultId: 'x'.repeat(121) }],
    ['other course', { ...result(), courseId: 'en-general' }],
    ['unknown kind', { ...result(), kind: 'nope' }],
    ['unknown level', { ...result(), levelId: 'Z9' }],
    ['finished before started', { ...result(), startedAt: NOW, finishedAt: NOW - 1 }],
    ['NaN time', { ...result(), finishedAt: NaN }],
    ['negative active time', { ...result(), activeMs: -5 }],
    ['assisted not boolean', { ...result(), assisted: 'yes' }],
    ['items not array', { ...result(), items: 'x' }],
    ['too many items', { ...result(), items: Array.from({ length: 501 }, (_, i) => ({ itemRef: `q:${i}`, outcome: 'correct' })) }],
    ['bad item outcome', { ...result(), items: [{ itemRef: 'q:1', outcome: 'maybe' }] }],
    ['earned > possible', { ...result(), score: { earned: 3, possible: 2 } }],
    ['possible 0', { ...result(), score: { earned: 0, possible: 0 } }],
    ['negative earned', { ...result(), score: { earned: -1, possible: 2 } }],
    ['completes not strings', { ...result(), completes: [5] }],
    ['too many completes', { ...result(), completes: Array.from({ length: 11 }, (_, i) => `k${i}`) }],
    ['bad evidence', { ...result(), evidence: 'trust-me' }],
  ])('rejects: %s', (_name, bad) => {
    expect(validateResult(bad)).not.toBeNull()
  })

  it('an invalid result changes nothing, returns the SAME core object and reports why', () => {
    const c = freshCore()
    const out = apply(c, { ...result(), score: { earned: 9, possible: 2 } })
    expect(out.core).toBe(c)
    expect(out.outcome).toMatchObject({ applied: false, reason: 'invalid', xpAwarded: 0 })
  })
})

describe('idempotency by resultId', () => {
  it('replaying a result changes nothing and returns the same core object', () => {
    const r = result({ activityId: 'topic:x' })
    const first = apply(freshCore(), r)
    expect(first.outcome).toMatchObject({ applied: true, xpAwarded: 20 })
    const again = apply(first.core, r)
    expect(again.core).toBe(first.core)
    expect(again.outcome).toMatchObject({ applied: false, reason: 'duplicate', xpAwarded: 0 })
  })

  it('a result keeps counting as a duplicate AFTER its raw detail was pruned (tombstone)', () => {
    const r = result({ activityId: 'topic:x' })
    let c = apply(freshCore(), r).core
    c = { ...c, activity: { ...c.activity, results: [] } } // raw buffer emptied
    const again = apply(c, r)
    expect(again.outcome.reason).toBe('duplicate')
    expect(again.core.progress.xp).toBe(20)
  })

  it('tombstones expire after 400 days; until then replays are blocked', () => {
    const r = result({ activityId: 'topic:x' })
    const c = apply(freshCore(), r).core
    expect(pruneActivity(c.activity, NOW + 399 * DAY).tombstones).toHaveLength(1)
    expect(pruneActivity(c.activity, NOW + 401 * DAY).tombstones).toHaveLength(0)
  })

  it('even a replay after tombstone expiry cannot re-earn: the credit ledger, not the buffer, is the record', () => {
    const r = result({ activityId: 'topic:x' })
    let c = apply(freshCore(), r).core
    c = { ...c, activity: pruneActivity(c.activity, NOW + 500 * DAY) }
    const late = apply(c, r, NOW + 500 * DAY)
    expect(late.core.progress.xp).toBe(20) // applied again as an attempt, credit unchanged
  })
})

describe('reward policy (first-time credit, bonus, repeat)', () => {
  it('quiz: 5 XP per never-credited correct item + 10 on first completion (participation quiz always passes)', () => {
    const out = apply(freshCore(), quiz('qz', 2, 3))
    expect(out.outcome.xpAwarded).toBe(2 * 5 + 10)
    expect(out.core.credit.entries.map(e => e.key).sort()).toEqual(['bonus:qz', 'q:qz-0', 'q:qz-1'])
  })

  it('a repeat of the same quiz earns nothing; improving only pays for newly correct items', () => {
    let c = apply(freshCore(), quiz('qz', 1, 3)).core
    const x1 = c.progress.xp
    c = apply(c, quiz('qz', 1, 3)).core
    expect(c.progress.xp).toBe(x1)
    c = apply(c, quiz('qz', 3, 3)).core
    expect(c.progress.xp).toBe(x1 + 2 * 5) // two newly correct items; the bonus was already taken
  })

  it('duplicate itemRefs inside one result are credited once', () => {
    const r = result({
      kind: 'quiz',
      activityId: 'dup',
      items: [
        { itemRef: 'q:1', outcome: 'correct' },
        { itemRef: 'q:1', outcome: 'correct' },
      ],
      score: { earned: 2, possible: 2 },
    })
    expect(apply(freshCore(), r).outcome.xpAwarded).toBe(5 + 10)
  })

  it('incorrect items pay nothing under the quiz policy; word-practice pays 1 for an incorrect attempt, then tops up to 3', () => {
    const w = (o: 'correct' | 'incorrect') =>
      result({ kind: 'word-practice', activityId: 'word-practice:w', items: [{ itemRef: 'word:w', outcome: o }] })
    expect(apply(freshCore(), quiz('qz', 0, 2)).outcome.xpAwarded).toBe(10) // no item credit; the participation bonus only
    const a = apply(freshCore(), w('incorrect'))
    expect(a.outcome.xpAwarded).toBe(1)
    const b = apply(a.core, w('correct'))
    expect(b.outcome.xpAwarded).toBe(2)
    expect(apply(b.core, w('correct')).outcome.xpAwarded).toBe(0)
  })

  it.each<[ActivityKind, string, number]>([
    ['lesson', 'topic:x', 20],
    ['speaking-scenario', 'speak:x', 20],
    ['speaking-prompt', 'topicspeak:x', 8],
    ['writing', 'ex:wr01', 15],
    ['daily', 'daily:2025-03-01', 25],
  ])('%s pays its first-completion bonus once (%i XP) and never again', (kind, activityId, xp) => {
    const a = apply(freshCore(), result({ kind, activityId }))
    expect(a.outcome.xpAwarded).toBe(xp)
    expect(apply(a.core, result({ kind, activityId })).outcome.xpAwarded).toBe(0)
  })

  it('real-life challenge pays only for a correct answer (threshold 1.0)', () => {
    const rl = (earned: number) => result({ kind: 'real-life', activityId: 'ex:real-x', score: { earned, possible: 1 } })
    const wrong = apply(freshCore(), rl(0))
    expect(wrong.outcome).toMatchObject({ xpAwarded: 0, passed: false })
    expect(wrong.core.progress.completed).toEqual([])
    const right = apply(wrong.core, rl(1))
    expect(right.outcome).toMatchObject({ xpAwarded: 10, passed: true })
    expect(right.core.progress.completed).toEqual(['ex:real-x'])
  })

  it('assisted attempts are scaled by the policy factor (mechanism; the shipped table keeps factor 1)', () => {
    const table = { ...POLICIES, lesson: { ...POLICIES.lesson, assistedFactor: 0.5 } } as Record<ActivityKind, RewardPolicy>
    const out = recordResult(freshCore(), result({ assisted: true }), NOW, table)
    expect(out.outcome.xpAwarded).toBe(10)
    expect(apply(freshCore(), result({ assisted: true })).outcome.xpAwarded).toBe(20)
  })

  it('daily-cap repeat credit (mechanism; disabled in the shipped table): repeats pay up to the daily cap, then nothing', () => {
    const table = {
      ...POLICIES,
      quiz: { ...POLICIES.quiz, firstCompletionBonus: 0, repeat: { creditAfterFirst: 'daily-cap', dailyCapXp: 8, reducedFactor: 1 } },
    } as Record<ActivityKind, RewardPolicy>
    let c = recordResult(freshCore(), quiz('rp', 1, 1), NOW, table).core // first time: 5 for the item
    expect(c.progress.xp).toBe(5)
    // repeats with the same item: the item is already credited, so only the capped repeat credit applies
    c = recordResult(c, quiz('rp', 1, 1), NOW, table).core
    expect(c.progress.xp).toBe(5 + 5)
    c = recordResult(c, quiz('rp', 1, 1), NOW, table).core
    expect(c.progress.xp).toBe(5 + 8) // capped at 8 for the day
    c = recordResult(c, quiz('rp', 1, 1), NOW, table).core
    expect(c.progress.xp).toBe(13)
    // the next day the cap resets
    c = recordResult(c, quiz('rp', 1, 1), NOW + DAY, table).core
    expect(c.progress.xp).toBeGreaterThan(13)
  })

  it('the shipped table pays nothing for repeats (no daily-cap)', () => {
    for (const p of Object.values(POLICIES)) expect(p.repeat.creditAfterFirst).toBe('none')
  })
})

describe('completion is derived from the pass rule (V-05)', () => {
  const test = (correct: number, total = 10) =>
    quiz('t3', correct, total, { kind: 'assessment', activityId: 'test:t3', completes: ['3:test'] })

  it('a 0 % unit test does NOT complete the unit section', () => {
    const out = apply(freshCore(), test(0))
    expect(out.outcome).toMatchObject({ passed: false, completionsGained: [] })
    expect(out.core.progress.completed).toEqual([])
    expect(out.core.activity.completions['3:test']).toMatchObject({ firstPassedAt: null, attempts: 1, bestScore: 0 })
  })

  it('the threshold is 70 %: 69 % fails, 70 % passes (boundary)', () => {
    expect(apply(freshCore(), test(69, 100)).outcome.passed).toBe(false)
    expect(apply(freshCore(), test(70, 100)).outcome.passed).toBe(true)
    expect(apply(freshCore(), test(7, 10)).core.progress.completed).toEqual(['3:test'])
    expect(apply(freshCore(), test(6, 10)).core.progress.completed).toEqual([])
  })

  it('an assessment without a score cannot pass', () => {
    const noScore = result({ kind: 'assessment', activityId: 'test:t3', completes: ['3:test'], score: null })
    expect(apply(freshCore(), noScore).outcome.passed).toBe(false)
    expect(passes({ score: null }, POLICIES.assessment)).toBe(false)
    expect(passes({ score: null }, POLICIES.lesson)).toBe(true)
  })

  it('unit reviews follow the same threshold', () => {
    const review = (c: number) => quiz('r3', c, 10, { kind: 'review', activityId: '3:review', completes: ['3:review'] })
    expect(apply(freshCore(), review(2)).core.progress.completed).toEqual([])
    expect(apply(freshCore(), review(8)).core.progress.completed).toEqual(['3:review'])
  })

  it('a failed attempt then a pass: attempts are counted, bestScore keeps the maximum, firstPassedAt/passingResultId come from the pass', () => {
    let c = apply(freshCore(), test(2)).core
    const passing = test(9)
    c = apply(c, passing, NOW + 5).core
    expect(c.activity.completions['3:test']).toMatchObject({ attempts: 2, bestScore: 0.9, passingResultId: passing.resultId })
    expect(c.activity.completions['3:test'].firstPassedAt).toBe(passing.finishedAt)
    c = apply(c, test(5), NOW + 9).core
    expect(c.activity.completions['3:test']).toMatchObject({ attempts: 3, bestScore: 0.9, passingResultId: passing.resultId })
    expect(c.progress.completed).toEqual(['3:test'])
  })

  it('a later failure never un-completes', () => {
    const c = run([test(10), test(0)])
    expect(c.progress.completed).toEqual(['3:test'])
  })

  it('grandfathered completions are untouched by thresholds: a legacy "3:test" stays completed even if the next attempt fails', () => {
    let c = freshCore()
    c = {
      ...c,
      progress: { ...c.progress, completed: ['3:test'] },
      activity: {
        ...c.activity,
        completions: { '3:test': { firstPassedAt: null, bestScore: null, attempts: 0, passingResultId: null, source: 'migration' } },
      },
    }
    const out = apply(c, test(0))
    expect(out.core.progress.completed).toEqual(['3:test'])
    expect(out.core.activity.completions['3:test'].source).toBe('migration')
  })

  it('participation kinds complete whatever the score; practice quizzes and word practice never create completion keys', () => {
    const listening = apply(freshCore(), quiz('ex1', 0, 3, { kind: 'listening', activityId: 'ex:li01', completes: ['2:listening'] }))
    expect(listening.core.progress.completed.sort()).toEqual(['2:listening', 'ex:li01'])
    const practice = apply(freshCore(), quiz('topic:a:practice', 1, 3))
    expect(practice.core.progress.completed).toEqual([])
    expect(Object.keys(practice.core.activity.completions)).toEqual([])
    const word = apply(
      freshCore(),
      result({ kind: 'word-practice', activityId: 'word-practice:w', items: [{ itemRef: 'word:w', outcome: 'correct' }] }),
    )
    expect(word.core.progress.completed).toEqual([])
  })

  it('"topic:" completions are not polluted by practice quizzes (the badge counter reads completed keys)', () => {
    const c = run([quiz('topic:a:practice', 3, 3, { activityId: 'topic:a:practice' }), result({ activityId: 'topic:a', kind: 'lesson' })])
    expect(c.progress.completed.filter(k => k.startsWith('topic:'))).toEqual(['topic:a'])
  })

  it('all completion keys of a passed result are completed together (activity + sections)', () => {
    const out = apply(freshCore(), result({ kind: 'writing', activityId: 'ex:wr01', completes: ['1:writing'] }))
    expect(out.core.progress.completed.sort()).toEqual(['1:writing', 'ex:wr01'])
    expect(out.outcome.completionsGained.sort()).toEqual(['1:writing', 'ex:wr01'])
  })
})

describe('bounded raw-results buffer, summaries and reproducibility (05 §4.4, §12)', () => {
  const many = (count: number, start = NOW, step = 1000) =>
    Array.from({ length: count }, (_, i) =>
      quiz(`g${i % 40}`, i % 3, 3, {
        resultId: `bulk${i}`,
        finishedAt: start + i * step,
        startedAt: start + i * step - 500,
        activityId: `g${i % 40}`,
      }),
    )

  // S2 (owner decisions STO-71/87/C4): the former 500-result / 90-day folding rule is GONE — detailed history is never pruned or folded.
  it('S2: NO automatic folding — 600 results over 300 days all stay raw, summaries stay empty (the old retention rule is not applied)', () => {
    let c = freshCore()
    // 600 results spread over 300 days
    for (const r of many(600, NOW - 300 * DAY, (300 * DAY) / 600)) c = recordResult(c, r, r.finishedAt).core
    c = { ...c, activity: pruneActivity(c.activity, NOW) }
    expect(c.activity.results.length).toBeGreaterThanOrEqual(RETENTION.resultsMin)
    expect(c.activity.results.every((r, i, a) => i === 0 || a[i - 1].finishedAt <= r.finishedAt)).toBe(true)
    expect(c.activity.results).toHaveLength(600) // nothing is ever folded or removed
    expect(Object.keys(c.activity.summaries)).toEqual([])
  })

  it('PRUNING ALL RAW RESULTS LEAVES XP, COMPLETION AND CREDIT IDENTICAL (property, 30 random histories)', () => {
    const rnd = seeded('prune-prop')
    for (let k = 0; k < 30; k++) {
      const rs = Array.from({ length: 40 }, (_, i) =>
        quiz(`h${Math.floor(rnd() * 6)}`, Math.floor(rnd() * 4), 3, {
          resultId: `p${k}-${i}`,
          kind: rnd() > 0.5 ? 'assessment' : 'quiz',
          completes: rnd() > 0.5 ? [`${Math.floor(rnd() * 5)}:test`] : [],
          finishedAt: NOW - i * DAY,
        }),
      )
      const c = run(rs, freshCore(), NOW)
      const pruned: Core = { ...c, activity: { ...c.activity, results: [], summaries: {} } }
      expect(pruned.progress.xp).toBe(c.progress.xp)
      expect(totalXp(pruned.credit.entries)).toBe(totalXp(c.credit.entries))
      expect(pruned.progress.completed).toEqual(c.progress.completed)
      // …and replaying everything afterwards (tombstones still held) changes nothing at all
      const replayed = rs.reduce((core, r) => recordResult(core, r, NOW).core, pruned)
      expect(replayed).toBe(pruned)
    }
  })

  it('totals are order-independent: applying the same results in any order gives the same XP and completions (property)', () => {
    const rnd = seeded('order-prop')
    for (let k = 0; k < 30; k++) {
      const rs = Array.from({ length: 25 }, (_, i) =>
        quiz(`o${Math.floor(rnd() * 5)}`, Math.floor(rnd() * 4), 3, {
          resultId: `o${k}-${i}`,
          kind: 'assessment',
          completes: [`${i % 4}:test`],
        }),
      )
      const shuffled = [...rs].sort(() => rnd() - 0.5)
      const a = run(rs)
      const b = run(shuffled)
      expect(b.progress.xp).toBe(a.progress.xp)
      expect([...b.progress.completed].sort()).toEqual([...a.progress.completed].sort())
    }
  })

  it('XP reproducibility: total XP always equals the sum of the ledger, and replaying the original results on a fresh state reproduces it', () => {
    const rs = many(80)
    const live = run(rs)
    expect(live.progress.xp).toBe(totalXp(live.credit.entries))
    const again = run(rs)
    expect(again.progress.xp).toBe(live.progress.xp)
    expect(again.progress.completed).toEqual(live.progress.completed)
  })

  it('the ledger is bounded by distinct credit keys, not by attempts: 3000 results over 40 activities', () => {
    let c = freshCore()
    for (const r of many(3000)) c = recordResult(c, r, r.finishedAt).core
    const keys = new Set(c.credit.entries.map(e => e.key))
    expect(c.credit.entries.length).toBeLessThanOrEqual(keys.size * 2) // at most one entry per key plus a top-up
    expect(keys.size).toBeLessThanOrEqual(40 * 3 + 40) // 3 items and 1 bonus per activity at most
    expect(c.progress.xp).toBe(totalXp(c.credit.entries))
  })

  it('S2: the only thing pruneActivity does is expire tombstones; it is idempotent and never touches results or summaries', () => {
    let c = freshCore()
    for (const r of many(700, NOW - 400 * DAY, (400 * DAY) / 700)) c = recordResult(c, r, r.finishedAt).core
    const once = pruneActivity(c.activity, NOW)
    const twice = pruneActivity(once, NOW)
    expect(twice).toBe(once)
    expect(once.results).toHaveLength(700)
    expect(once.summaries).toEqual({})
  })

  it('each stored result keeps the compact audit detail only (items capped, no free text)', () => {
    const big = result({
      kind: 'quiz',
      activityId: 'big',
      items: Array.from({ length: 200 }, (_, i) => ({ itemRef: `q:big${i}`, outcome: 'correct' as const })),
      score: { earned: 200, possible: 200 },
    })
    const c = apply(freshCore(), big).core
    expect(c.activity.results[0].items).toHaveLength(RETENTION.itemsPerResult)
    expect(Object.keys(c.activity.results[0]).sort()).toEqual(
      [
        'activityId',
        'assisted',
        'activeMs',
        'evidence',
        'finishedAt',
        'items',
        'kind',
        'levelId',
        'passed',
        'resultId',
        'score',
        'startedAt',
        'xp',
      ].sort(), // S2: startedAt/levelId/evidence are kept (STO-82)
    )
  })

  it('the engine never mutates the Core it receives', () => {
    const c = apply(freshCore(), quiz('m', 2, 3)).core
    const frozen = JSON.stringify(c)
    apply(c, quiz('m2', 3, 3))
    expect(JSON.stringify(c)).toBe(frozen)
  })
})
