// @vitest-environment node
/**
 * Stage 4 (decision D-4): answer-position randomisation for listening AND reading questions.
 * All randomness in these tests comes from fixed seeds — nothing depends on chance.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LISTENING } from '../src/data/listening'
import { READING } from '../src/data/reading'
import { TESTS } from '../src/data/reallife'
import type { ListeningExercise, ReadingText, TestDef } from '../src/data/types'
import { attemptOptions } from '../src/features/tests/answerOrder'
import {
  buildDaily,
  buildLevelDaily,
  buildTest,
  listeningQuestions,
  readingQuestions,
  type Question,
} from '../src/features/tests/questions'
import { newSeed, seeded } from '../src/utils/random'
import { withSeed } from './regression/a1-snapshot'

const baseline = JSON.parse(readFileSync(join(__dirname, 'regression/baselines/a1-behaviour.json'), 'utf8')).questions as {
  listeningAll: Record<string, Question[]>
  readingAll: Record<string, Question[]>
}
const deepFreeze = <T>(x: T): T => {
  if (x && typeof x === 'object') {
    Object.freeze(x)
    for (const v of Object.values(x)) deepFreeze(v)
  }
  return x
}
const SEEDS = Array.from({ length: 60 }, (_, i) => `attempt-${i}`)
const BIAS_SEEDS = Array.from({ length: 600 }, (_, i) => `bias-${i}`)
const sorted = (xs: readonly string[] | undefined) => [...(xs ?? [])].sort()

/** both skills expose the same shape: a source (authored question list) and a builder. */
const SKILLS = [
  {
    name: 'listening',
    sources: LISTENING as readonly (ListeningExercise | ReadingText)[],
    build: (src: ListeningExercise | ReadingText, seed: string) => listeningQuestions(src as ListeningExercise, seed),
    pinned: baseline.listeningAll,
  },
  {
    name: 'reading',
    sources: READING as readonly (ListeningExercise | ReadingText)[],
    build: (src: ListeningExercise | ReadingText, seed: string) => readingQuestions(src as ReadingText, seed),
    pinned: baseline.readingAll,
  },
]

describe.each(SKILLS)('$name: correctness is preserved by the shuffle', ({ sources, build, pinned }) => {
  it('every original option appears exactly once and the correct answer stays the same text', () => {
    for (const src of sources) {
      const qs = build(src, 'correctness')
      expect(qs.length, src.id).toBe(src.questions.length)
      src.questions.forEach((sq, i) => {
        const q = qs[i]
        expect(sorted(q.options), `${src.id} q${i} options`).toEqual(sorted(sq.options)) // a permutation: nothing lost, added or duplicated
        expect(new Set(q.options).size).toBe(q.options?.length)
        expect(q.answer, `${src.id} q${i} answer`).toBe(sq.options[sq.answer])
        expect(q.options).toContain(q.answer)
        expect(q.prompt).toBe(sq.q)
      })
    }
  })

  it('all other fields equal the pinned pre-change contract (ids, prompts, answers, explanations, audio, skill, kind, option SET)', () => {
    for (const src of sources) {
      const now = build(src, 'contract').map(q => ({ ...q, options: sorted(q.options) }))
      expect(now, src.id).toEqual(pinned[src.id])
    }
  })

  it('never modifies the authored data (sources can be frozen)', () => {
    const frozen = deepFreeze(structuredClone(sources[0]))
    expect(() => build(frozen, 'frozen')).not.toThrow()
    for (const src of sources) {
      const before = JSON.stringify(src)
      build(src, 'mutation-check')
      expect(JSON.stringify(src)).toBe(before)
    }
  })

  it('scoring by text is correct in every position: the option whose text equals the answer is found exactly once', () => {
    for (const src of sources)
      for (const seed of SEEDS.slice(0, 10))
        for (const q of build(src, seed)) expect(q.options?.filter(o => o === q.answer)).toHaveLength(1)
  })
})

describe.each(SKILLS)('$name: stable within an attempt, different across attempts', ({ sources, build }) => {
  it('the same attempt seed always gives the same order (rebuilding, re-rendering, revisiting)', () => {
    for (const src of sources) for (const seed of SEEDS.slice(0, 5)) expect(build(src, seed)).toEqual(build(src, seed))
  })

  it("a question's order depends only on (attempt seed, question id): never on the other questions or any other random draw", () => {
    for (const src of sources) {
      const all = build(src, 'independent')
      src.questions.forEach((sq, i) => {
        const alone = build({ ...src, questions: [src.questions[i]] } as typeof src, 'independent')
        // same id only for i = 0 in the one-question exercise, so compare via the pure function with the real id
        expect(all[i].options).toEqual(attemptOptions(sq.options, 'independent', all[i].id))
        expect(alone).toHaveLength(1)
      })
    }
  })

  it('a new attempt (new seed) gives a different order — every multi-option question shows more than one order over the fixed seeds', () => {
    for (const src of sources) {
      const orders = src.questions.map(() => new Set<string>())
      for (const seed of SEEDS) build(src, seed).forEach((q, i) => orders[i].add((q.options ?? []).join('|')))
      src.questions.forEach((sq, i) => expect(orders[i].size, `${src.id} q${i}`).toBeGreaterThan(sq.options.length > 1 ? 1 : 0))
    }
  })

  it('two specific attempts differ for at least one question of every exercise that has 3+ options somewhere', () => {
    for (const src of sources) {
      const a = build(src, 'attempt-A').map(q => q.options?.join('|'))
      const found = SEEDS.some(seed => build(src, seed).some((q, i) => q.options?.join('|') !== a[i]))
      expect(found, src.id).toBe(true)
    }
  })
})

describe('no systematic bias in where the correct answer ends up', () => {
  const positions = (
    sources: readonly (ListeningExercise | ReadingText)[],
    build: (s: ListeningExercise | ReadingText, seed: string) => Question[],
  ) => {
    const byK = new Map<number, number[]>() // option count → counts per position
    const perQuestion: { id: string; k: number; counts: number[] }[] = []
    for (const src of sources) {
      const counts = src.questions.map(q => new Array(q.options.length).fill(0) as number[])
      for (const seed of BIAS_SEEDS) build(src, seed).forEach((q, i) => counts[i][(q.options ?? []).indexOf(q.answer)]++)
      counts.forEach((c, i) => {
        perQuestion.push({ id: `${src.id}#${i}`, k: c.length, counts: c })
        const agg = byK.get(c.length) ?? new Array(c.length).fill(0)
        c.forEach((n, p) => (agg[p] += n))
        byK.set(c.length, agg)
      })
    }
    return { byK, perQuestion }
  }

  it.each(SKILLS)('$name: pooled over all questions each position is within 3 points of uniform', ({ sources, build }) => {
    const { byK } = positions(sources, build)
    expect(byK.size).toBeGreaterThan(0)
    for (const [k, counts] of byK) {
      const total = counts.reduce((a, b) => a + b, 0)
      counts.forEach((n, p) => expect(Math.abs(n / total - 1 / k), `${k} options, position ${p + 1}`).toBeLessThan(0.03))
    }
  })

  it.each(SKILLS)(
    '$name: every single question puts its correct answer in every position, none above 8 points from uniform',
    ({ sources, build }) => {
      for (const { id, k, counts } of positions(sources, build).perQuestion) {
        const total = counts.reduce((a, b) => a + b, 0)
        counts.forEach((n, p) => {
          expect(n, `${id} never at position ${p + 1}`).toBeGreaterThan(0)
          expect(Math.abs(n / total - 1 / k), `${id} position ${p + 1}`).toBeLessThan(0.08)
        })
      }
    },
  )

  it('the authored source IS biased (the reason for D-4): the correct option is first in most reading questions and last in almost no listening question', () => {
    const firstShare = (qs: { answer: number }[]) => qs.filter(q => q.answer === 0).length / qs.length
    const lastShare = (qs: { answer: number; options: string[] }[]) => qs.filter(q => q.answer === q.options.length - 1).length / qs.length
    expect(firstShare(READING.flatMap(r => r.questions))).toBeGreaterThan(0.7)
    expect(lastShare(LISTENING.flatMap(l => l.questions))).toBeLessThan(0.1)
  })
})

describe('where the builders get their attempt seed', () => {
  it('a built test is one attempt: seeded randomness gives an identical test, options included; the next build differs', () => {
    const def = TESTS.find(t => t.kind === 'listening') as TestDef
    const a = withSeed('attempt-x', () => buildTest(def))
    const b = withSeed('attempt-x', () => buildTest(def))
    expect(b).toEqual(a)
    expect(a.length).toBe(def.size)
    const others = ['attempt-y', 'attempt-z', 'attempt-w'].map(s => withSeed(s, () => buildTest(def)))
    expect(others.some(o => JSON.stringify(o) !== JSON.stringify(a))).toBe(true)
    // same exercises in both builds (a big test takes them all), different attempts: the option order of the SAME questions differs
    const all = { ...def, size: 1000 }
    const first = new Map(withSeed('attempt-1', () => buildTest(all)).map(q => [q.id, q.options?.join('|')]))
    const second = withSeed('attempt-2', () => buildTest(all))
    expect(second.length).toBe(first.size)
    expect(second.some(q => first.get(q.id) !== q.options?.join('|'))).toBe(true)
    // every question of the test is an authored A1 listening question, its option SET untouched
    const byId = new Map<string, ListeningExercise['questions'][number]>(
      LISTENING.flatMap(l => l.questions.map((q, i) => [`lq-${l.id}-${i}`, q] as [string, ListeningExercise['questions'][number]])),
    )
    for (const q of a) {
      const src = byId.get(q.id)
      expect(src, q.id).toBeDefined()
      expect(sorted(q.options)).toEqual(sorted(src?.options))
      expect(q.answer).toBe(src?.options[src.answer])
    }
  })

  it('the daily challenge is the same for everyone on a date: deterministic, with its listening order a function of the date', () => {
    for (const date of ['2026-01-01', '2026-02-14', '2026-03-31', '2026-11-16']) {
      const d = buildDaily(date)
      expect(buildDaily(date)).toEqual(d)
      expect(buildLevelDaily(date, 'A1')).toEqual(d)
      for (const q of d.listening) {
        const [, exId, qi] = /^lq-(.+)-(\d+)$/.exec(q.id) as RegExpExecArray
        const src = LISTENING.find(l => l.id === exId)!.questions[Number(qi)]
        expect(q.options).toEqual(attemptOptions(src.options, `daily-${date}`, q.id))
        expect(q.answer).toBe(src.options[src.answer])
      }
    }
  })

  it('newSeed: reproducible from a seeded generator, different between attempts', () => {
    expect(newSeed(seeded('s'))).toBe(newSeed(seeded('s')))
    const rnd = seeded('s')
    expect(newSeed(rnd)).not.toBe(newSeed(rnd))
    expect(newSeed()).not.toBe(newSeed())
  })
})

describe('level isolation and empty catalogs', () => {
  const fakeA2Listening = {
    id: 'a2-li-x',
    level: 'A2',
    unit: 11,
    title: 'A2',
    lines: [{ speaker: 'A', text: 'Hallo', ru: 'x' }],
    keywords: [],
    questions: [{ q: 'Wer?', options: ['Ali', 'Bea', 'Cem'], answer: 2 }],
  } as ListeningExercise
  const fakeA2Reading = {
    id: 'a2-re-x',
    level: 'A2',
    unit: 11,
    title: 'A2',
    body: ['Text'],
    gloss: [],
    questions: [{ q: 'Was?', options: ['eins', 'zwei', 'drei', 'vier'], answer: 3 }],
  } as ReadingText

  it('a question is shuffled within its own exercise only: its options never contain another exercise, level or pool', () => {
    for (const seed of SEEDS.slice(0, 20)) {
      const l = listeningQuestions(fakeA2Listening, seed)[0]
      expect(sorted(l.options)).toEqual(['Ali', 'Bea', 'Cem'])
      expect(l.answer).toBe('Cem')
      const r = readingQuestions(fakeA2Reading, seed)[0]
      expect(sorted(r.options)).toEqual(['drei', 'eins', 'vier', 'zwei'])
      expect(r.answer).toBe('vier')
    }
  })

  it('A1 listening tests contain only A1 exercises; a test of a level without content is empty (nothing borrowed, nothing invented)', () => {
    const a1 = TESTS.find(t => t.kind === 'listening') as TestDef
    const ids = new Set(LISTENING.map(l => l.id))
    for (const q of withSeed('iso', () => buildTest(a1))) expect(ids.has(q.id.replace(/^lq-/, '').replace(/-\d+$/, ''))).toBe(true)
    expect(buildTest({ ...a1, id: 'x', level: 'B1' })).toEqual([])
    expect(buildLevelDaily('2026-05-05', 'B1')).toBeNull() // a level without content: no challenge, so no listening question either
  })

  it('degenerate exercises are safe: no questions, no options, one option', () => {
    expect(listeningQuestions({ ...fakeA2Listening, questions: [] }, 's')).toEqual([])
    expect(readingQuestions({ ...fakeA2Reading, questions: [] }, 's')).toEqual([])
    expect(attemptOptions([], 's', 'q')).toEqual([])
    expect(attemptOptions(['only'], 's', 'q')).toEqual(['only'])
  })
})
