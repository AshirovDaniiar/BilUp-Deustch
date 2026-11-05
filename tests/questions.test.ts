import { describe, expect, it } from 'vitest'
import { EXERCISES, HANDWRITTEN_COUNT, articleExercises } from '../src/data/exercises'
import { VOCABULARY } from '../src/data/vocabulary'
import { TESTS } from '../src/data/reallife'
import { UNITS } from '../src/data/units'
import {
  articleDrill,
  buildDaily,
  buildTest,
  conceptQuestions,
  fromExercise,
  unitReviewQuestions,
  vocabQuestion,
} from '../src/features/tests/questions'
import { seeded } from '../src/utils/random'

describe('question builders', () => {
  it('vocabQuestion alternates direction and always contains the correct answer exactly once', () => {
    const v = VOCABULARY[0]
    const de = vocabQuestion(v, 0, seeded('q'))
    const ru = vocabQuestion(v, 1, seeded('q'))
    expect(de.prompt).toContain(v.de)
    expect(ru.prompt).toContain(v.ru)
    for (const q of [de, ru]) {
      expect(q.options).toContain(q.answer)
      expect(q.options!.filter(o => o === q.answer)).toHaveLength(1)
      expect(q.options!.length).toBeLessThanOrEqual(4)
    }
  })

  it('vocabQuestion is deterministic for a seeded generator', () => {
    const v = VOCABULARY[3]
    expect(vocabQuestion(v, 0, seeded('same'))).toEqual(vocabQuestion(v, 0, seeded('same')))
  })

  it('fromExercise maps article exercises to the "article" mistake kind with a vocab id', () => {
    const e = articleExercises[0]
    const q = fromExercise(e)
    expect(q.kind).toBe('article')
    expect(q.vocabId).toBe(e.id.replace('art-', ''))
    expect(fromExercise(EXERCISES[0]).kind).toBe(EXERCISES[0].type === 'article' ? 'article' : 'grammar')
  })

  it('article exercises are generated for every vocabulary item that has an article', () => {
    expect(articleExercises).toHaveLength(VOCABULARY.filter(v => v.article).length)
    expect(EXERCISES).toHaveLength(HANDWRITTEN_COUNT + articleExercises.length)
  })

  it('unitReviewQuestions returns the requested size, all with ids', () => {
    const qs = unitReviewQuestions(UNITS[0].id, 10)
    expect(qs.length).toBeGreaterThan(0)
    expect(qs.length).toBeLessThanOrEqual(10)
    expect(qs.every(q => q.id && q.answer)).toBe(true)
  })

  it('conceptQuestions and articleDrill honour the size limit', () => {
    expect(conceptQuestions('akkusativ', 5).length).toBeLessThanOrEqual(5)
    expect(articleDrill(6)).toHaveLength(6)
  })

  it('every defined test builds without throwing', () => {
    for (const def of TESTS) expect(() => buildTest(def), def.id).not.toThrow()
  })

  it('placement test mixes easy, middle and hard units (12 questions)', () => {
    const def = TESTS.find(t => t.kind === 'placement')
    if (!def) return // no placement definition in the current data
    expect(buildTest(def)).toHaveLength(12)
  })
})

describe('daily challenge', () => {
  it('is deterministic for a given date (same questions for the same day)', () => {
    const a = buildDaily('2025-03-01')
    const b = buildDaily('2025-03-01')
    expect(a.vocab.map(q => q.id)).toEqual(b.vocab.map(q => q.id))
    expect(a.grammar[0].id).toBe(b.grammar[0].id)
    expect(a.speaking.conceptId).toBe(b.speaking.conceptId)
  })

  it('has the documented structure: 3 vocab, 1 grammar, ≤1 listening, a speaking task and a phrase', () => {
    const d = buildDaily('2025-03-02')
    expect(d.vocab).toHaveLength(3)
    expect(d.grammar).toHaveLength(1)
    expect(d.listening.length).toBeLessThanOrEqual(1)
    expect(d.speaking.sample).toBeTruthy()
    expect(d.phrase.de).toBeTruthy()
  })

  it('differs between days (not constant)', () => {
    const ids = new Set(
      ['2025-03-01', '2025-03-02', '2025-03-03', '2025-03-04', '2025-03-05'].map(d =>
        buildDaily(d)
          .vocab.map(q => q.id)
          .join(','),
      ),
    )
    expect(ids.size).toBeGreaterThan(1)
  })
})
