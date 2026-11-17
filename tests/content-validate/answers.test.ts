// @vitest-environment node
/**
 * Stage 6A — answer rules for Listening and Reading: structure (options present, valid mapping), and position-bias detection.
 * The bias test is an EXACT binomial test on authored data: no simulation, no randomness, so every result here is reproducible.
 */
import { describe, expect, it } from 'vitest'
import { MIN_QUESTIONS_FOR_DISTRIBUTION, P_ERROR, P_WARN, positionCounts, RUN_LIMIT } from '../../scripts/content-validate/rules/answers'
import { binomialPmf, binomialTwoSidedP } from '../../scripts/content-validate/stats'
import type { ContentBundle, Issue } from '../../scripts/content-validate/types'
import { validateContent } from '../../scripts/content-validate/validate'
import { emptyA2Bundle, validA2Bundle } from './fixtures'

const run = (b: ContentBundle): Issue[] => validateContent(b)
const rules = (b: ContentBundle, sev: Issue['severity']) =>
  run(b)
    .filter(i => i.severity === sev)
    .map(i => i.rule)

/** the fixture reading text with the given correct-answer positions (3 options each) */
function withAnswers(positions: number[], skill: 'reading' | 'listening' = 'reading'): ContentBundle {
  const b = validA2Bundle()
  const qs = positions.map((answer, i) => ({ q: `Frage ${i}?`, options: ['eins', 'zwei', 'drei'], answer }))
  if (skill === 'reading') b.reading.find(r => r.id === 'a2-re-11-01')!.questions = qs
  else b.listening.find(l => l.id === 'a2-li-11-01')!.questions = qs
  return b
}
const bias = (b: ContentBundle) => run(b).filter(i => i.rule === 'answer-position-bias')

describe('exact statistics (cross-checked against closed forms; no randomness)', () => {
  it('binomial mass and two-sided p-values match known values', () => {
    expect(binomialPmf(10, 5, 0.5)).toBeCloseTo(252 / 1024, 12)
    expect(binomialTwoSidedP(10, 5, 0.5)).toBeCloseTo(1, 12)
    expect(binomialTwoSidedP(10, 9, 0.5)).toBeCloseTo((2 * 11) / 1024, 12) // 2·(1+10)/1024
    expect(binomialTwoSidedP(10, 10, 0.5)).toBeCloseTo(2 / 1024, 12)
    expect(binomialTwoSidedP(12, 12, 1 / 3)).toBeCloseTo((1 / 3) ** 12, 14) // all 12 in one position: only that single outcome is as extreme
  })

  it('it is a pure function: identical inputs give identical results, call after call', () => {
    const a = [binomialTwoSidedP(35, 1, 1 / 3), binomialTwoSidedP(18, 14, 1 / 3)]
    for (let i = 0; i < 5; i++) expect([binomialTwoSidedP(35, 1, 1 / 3), binomialTwoSidedP(18, 14, 1 / 3)]).toEqual(a)
    expect(a[0]).toBeCloseTo(1.7e-5, 6)
    expect(a[1]).toBeCloseTo(1.4e-4, 5)
  })
})

describe('position-bias detection in A2 content', () => {
  const n = MIN_QUESTIONS_FOR_DISTRIBUTION + 3 // 12

  it('every answer in the same position is an ERROR', () => {
    for (const skill of ['reading', 'listening'] as const) {
      const found = bias(withAnswers(new Array(n).fill(0), skill))
      expect(
        found.map(i => i.severity),
        skill,
      ).toEqual(['error'])
      expect(found[0].where).toBe(`${skill} A2`)
      expect(found[0].message).toMatch(/exact binomial p = /)
    }
  })

  it('every position is detected, not only the first', () => {
    for (const pos of [0, 1, 2]) expect(bias(withAnswers(new Array(n).fill(pos))).map(i => i.severity)).toEqual(['error'])
  })

  it('a clear but not extreme skew is a WARNING (suspicious), a balanced set is clean', () => {
    // 9 of 12 in one position: exact p = 3.9e-3 — below the warning line (0.01), above the error line (0.001)
    const skew = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1]
    const p = binomialTwoSidedP(12, 9, 1 / 3)
    expect(p).toBeLessThan(P_WARN)
    expect(p).toBeGreaterThan(P_ERROR)
    expect(bias(withAnswers(skew)).map(i => i.severity)).toEqual(['warning'])
    expect(bias(withAnswers([0, 1, 2, 0, 1, 2, 2, 0, 1, 1, 0, 2]))).toEqual([])
    expect(
      run(withAnswers([0, 1, 2, 0, 1, 2, 2, 0, 1, 1, 0, 2])).some(
        i => i.rule === 'answer-distribution' && i.severity === 'info' && /no concentration/.test(i.message),
      ),
    ).toBe(true)
  })

  it('too few questions are reported as skipped, never as "fine" and never as a failure', () => {
    const issues = run(withAnswers([0, 0, 0, 0]))
    expect(issues.some(i => i.rule === 'answer-distribution-skipped' && i.severity === 'info')).toBe(true)
    expect(bias(withAnswers([0, 0, 0, 0]))).toEqual([])
    expect(MIN_QUESTIONS_FOR_DISTRIBUTION).toBe(9)
  })

  it('the same position RUN_LIMIT or more times in a row is a warning; shorter runs are not', () => {
    const b = withAnswers([0, 1, 2, 0, 1, 2, 0, 1, 2])
    const longRun = validA2Bundle()
    longRun.reading.find(r => r.id === 'a2-re-11-01')!.questions = [1, 1, 1, 1, 0, 2].map((answer, i) => ({
      q: `F${i}?`,
      options: ['a', 'b', 'c'],
      answer,
    }))
    expect(run(b).some(i => i.rule === 'answer-position-run')).toBe(false)
    const flagged = run(longRun).filter(i => i.rule === 'answer-position-run')
    expect(flagged).toHaveLength(1)
    expect(flagged[0].severity).toBe('warning')
    expect(RUN_LIMIT).toBe(4)
    const three = validA2Bundle()
    three.reading.find(r => r.id === 'a2-re-11-01')!.questions = [1, 1, 1, 0, 2].map((answer, i) => ({
      q: `F${i}?`,
      options: ['a', 'b', 'c'],
      answer,
    }))
    expect(run(three).some(i => i.rule === 'answer-position-run')).toBe(false)
  })

  it('skills and levels are judged separately (a biased listening set is not hidden by a balanced reading set)', () => {
    const b = withAnswers(new Array(n).fill(2), 'listening')
    b.reading.find(r => r.id === 'a2-re-11-01')!.questions = [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2].map((answer, i) => ({
      q: `F${i}?`,
      options: ['a', 'b', 'c'],
      answer,
    }))
    expect(bias(b).map(i => i.where)).toEqual(['listening A2'])
  })

  it('option counts are judged separately (2-option and 3-option questions are not mixed)', () => {
    const counts = positionCounts([
      { options: ['a', 'b'], answer: 0 },
      { options: ['a', 'b', 'c'], answer: 2 },
    ])
    expect([...counts.entries()]).toEqual([
      [2, [1, 0]],
      [3, [0, 0, 1]],
    ])
  })
})

describe('answer structure (A2)', () => {
  const mutate = (fn: (qs: { q: string; options: string[]; answer: number }[]) => void) => {
    const b = validA2Bundle()
    fn(b.reading.find(r => r.id === 'a2-re-11-01')!.questions)
    return b
  }

  it('a correct answer index that points at no option is rejected', () => {
    for (const bad of [-1, 3, 7, 1.5, Number.NaN])
      expect(
        rules(
          mutate(q => (q[0].answer = bad)),
          'error',
        ),
        String(bad),
      ).toEqual(expect.arrayContaining(['answer-mapping']))
  })

  it('fewer than two options, an empty option and duplicate options are rejected', () => {
    expect(
      rules(
        mutate(q => (q[0].options = ['nur eine'])),
        'error',
      ),
    ).toContain('options-missing')
    expect(
      rules(
        mutate(q => (q[0].options[1] = '  ')),
        'error',
      ),
    ).toContain('option-empty')
    expect(
      rules(
        mutate(q => (q[0].options[1] = q[0].options[0].toUpperCase())),
        'error',
      ),
    ).toContain('option-duplicate')
    expect(
      rules(
        mutate(q => (q[0].options = ['a', 'b', 'c', 'd', 'e', 'f'])),
        'error',
      ),
    ).toContain('options-count')
  })

  it('an empty question text is rejected; an unusual option count (not 3) is a warning', () => {
    expect(
      rules(
        mutate(q => (q[0].q = '')),
        'error',
      ),
    ).toContain('question-empty')
    expect(
      rules(
        mutate(q => q[0].options.push('vier')),
        'warning',
      ),
    ).toContain('options-count')
  })

  it('options are never taken from another question: each keeps its own set (the mapping is per question)', () => {
    const b = mutate(q => (q[1].options = ['x', 'y', 'z']))
    expect(rules(b, 'error')).toEqual([])
  })
})

describe('A1 is measured, not failed', () => {
  it('the real A1 bias is reported with exact numbers as legacy information (the app shuffles per attempt)', () => {
    const info = run(emptyA2Bundle()).filter(i => i.rule === 'answer-distribution')
    expect(info.map(i => i.where).sort()).toEqual(['listening A1', 'reading A1'])
    for (const i of info) {
      expect(i.severity).toBe('info')
      expect(i.message).toMatch(/Legacy level: measured only/)
    }
    expect(info.find(i => i.where === 'listening A1')?.message).toMatch(/17\/17\/1/)
    expect(info.find(i => i.where === 'reading A1')?.message).toMatch(/14\/4\/0/)
  })

  it('A1 has no answer errors, warnings or review flags, and the structure rules find nothing in it', () => {
    expect(run(emptyA2Bundle()).filter(i => i.severity !== 'info')).toEqual([])
    expect(run(emptyA2Bundle()).filter(i => /^(options-|option-|question-|answer-mapping)/.test(i.rule))).toEqual([])
  })

  it('the same bias in A2 would FAIL while in A1 it is only measured', () => {
    const a2 = withAnswers(new Array(12).fill(0))
    expect(bias(a2)[0].severity).toBe('error')
    expect(run(emptyA2Bundle()).some(i => i.rule === 'answer-position-bias')).toBe(false)
  })
})

describe('the validator never depends on chance', () => {
  it('validating twice gives identical results, in the same order', () => {
    const b = withAnswers([0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 1, 2])
    expect(run(b)).toEqual(run(b))
    expect(run(emptyA2Bundle())).toEqual(run(emptyA2Bundle()))
  })

  it('Math.random is never consulted', () => {
    const real = Math.random
    Math.random = () => {
      throw new Error('the validator must not use randomness')
    }
    try {
      expect(() => run(withAnswers(new Array(12).fill(1)))).not.toThrow()
    } finally {
      Math.random = real
    }
  })
})
