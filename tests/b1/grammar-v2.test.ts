import { describe, expect, it } from 'vitest'
import { B1_V2_EXERCISES, B1_V2_GRAMMAR, B1_V2_LESSON_OF_UNIT, B1_V2_ORIGIN } from '../../src/data/b1/grammar-v2'
import { B1_CONTENT } from '../../src/data/b1/b1-content'

const unitIds = Array.from({ length: 36 }, (_, i) => 301 + i)

describe('B1 v2 grammar: 36 lessons, one per unit 301–336', () => {
  it('every new unit has exactly one lesson, and no lesson is shared', () => {
    expect(Object.keys(B1_V2_LESSON_OF_UNIT)).toHaveLength(36)
    const ids = Object.values(B1_V2_LESSON_OF_UNIT)
    expect(new Set(ids).size).toBe(36)
    for (const u of unitIds) {
      const unit = B1_CONTENT.units.find(x => x.id === u)!
      expect(unit.grammarIds, String(u)).toEqual([B1_V2_LESSON_OF_UNIT[u - 300]])
    }
  })
  it('lesson and exercise ids are unique and the legacy lessons are untouched', () => {
    const g = B1_V2_GRAMMAR.map(x => x.id)
    const e = B1_V2_EXERCISES.map(x => x.id)
    expect(new Set(g).size).toBe(g.length)
    expect(new Set(e).size).toBe(e.length)
    const legacy = B1_CONTENT.grammar.filter(x => x.unit < 100)
    expect(legacy).toHaveLength(29)
    for (const x of B1_V2_GRAMMAR) expect(legacy.some(l => l.id === x.id), x.id).toBe(false)
    expect(Object.keys(B1_V2_ORIGIN)).toHaveLength(36)
  })
  it('each lesson reaches the quality target: 8 examples with RU+KY, 8 questions, mistakes, dialogue, speaking prompt', () => {
    for (const c of B1_V2_GRAMMAR) {
      expect(c.examples.length, c.id).toBeGreaterThanOrEqual(8)
      for (const x of c.examples) expect(x.de && x.ru && x.ky, c.id).toBeTruthy()
      expect(c.mistakes.length, c.id).toBeGreaterThanOrEqual(4)
      expect(c.dialogue?.length, c.id).toBeGreaterThanOrEqual(4)
      expect(c.speakPrompt, c.id).toBeTruthy()
      const ex = B1_V2_EXERCISES.filter(x => x.concept === c.id)
      expect(ex.length, c.id).toBeGreaterThanOrEqual(8)
      for (const q of ex) {
        expect(q.why?.ru && q.why?.ky, q.id).toBeTruthy()
        expect(q.why!.ky, q.id).not.toBe(q.why!.ru)
        if (q.type !== 'order') expect(q.options!.includes(q.answer as string), q.id).toBe(true)
      }
    }
  })
  it('the correct choice/fill answer is spread over the three positions', () => {
    const pos = [0, 0, 0]
    for (const q of B1_V2_EXERCISES) if (q.type !== 'order') pos[q.options!.indexOf(q.answer as string)]++
    for (const n of pos) expect(n).toBeGreaterThan(B1_V2_EXERCISES.length * 0.15)
  })
})
