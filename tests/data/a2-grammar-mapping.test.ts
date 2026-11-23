import { describe, expect, it } from 'vitest'
import '../load-a2'
import { A2_CURRICULUM_TITLES, A2_GRAMMAR_TOPICS, A2_LEGACY_UNITS, A2_VISIBLE_UNITS } from '../../src/data/a2/curriculum'
import { A2_UNITS } from '../../src/data/a2/units'
import { grammarIndex, grammarOf } from '../../src/data/catalog'
import { requiredSections } from '../../src/features/progress/stats'

const attached = A2_GRAMMAR_TOPICS.flatMap((t, i) => (t.concept ? [{ i, ...t }] : []))

describe('A2 grammar mapping: existing lessons are REFERENCED, never created or copied', () => {
  it('covers all 43 approved topics, aligned with the 43 unit titles', () => {
    expect(A2_GRAMMAR_TOPICS).toHaveLength(43)
    expect(A2_CURRICULUM_TITLES).toHaveLength(43)
    expect(A2_GRAMMAR_TOPICS[0].topic).toBe('Perfekt: Vertiefung')
    expect(A2_CURRICULUM_TITLES[0]).toBe('Mein letztes Jahr')
    expect(A2_GRAMMAR_TOPICS[31].topic).toBe('Wechselpräpositionen: Wo und Wohin?')
    expect(A2_CURRICULUM_TITLES[31]).toBe('Meine Wohnung und mein Wohnort')
    expect(A2_GRAMMAR_TOPICS[42].topic).toBe('Imperativ: Vertiefung')
    expect(A2_CURRICULUM_TITLES[42]).toBe('Ratschläge und Anweisungen')
  })
  it('13 topics are confirmed matches, each lesson is attached at most once, and every one is an existing A2-tagged lesson', () => {
    expect(attached.map(a => a.i + 1)).toEqual([1, 4, 8, 13, 14, 15, 17, 18, 19, 23, 27, 32, 43])
    const ids = attached.map(a => a.concept!)
    expect(new Set(ids).size).toBe(13)
    for (const id of ids) {
      const g = grammarIndex.get(id)
      expect(g, id).toBeDefined()
      expect(g!.level, `${id} must be A2-tagged (no B1 / A1 import)`).toBe('A2')
      expect(g!.unit, id).toBeGreaterThanOrEqual(11)
      expect(g!.unit, id).toBeLessThanOrEqual(20)
    }
  })
  it('the new units reference exactly those lessons; everything else stays empty', () => {
    A2_GRAMMAR_TOPICS.forEach((t, i) => expect(A2_VISIBLE_UNITS[i].grammarIds).toEqual(t.concept ? [t.concept] : []))
    expect(A2_VISIBLE_UNITS.filter(u => u.grammarIds.length > 0)).toHaveLength(13)
    expect(A2_VISIBLE_UNITS.filter(u => u.grammarIds.length === 0)).toHaveLength(30)
    for (const u of A2_VISIBLE_UNITS) expect(requiredSections(u.id)).toEqual(u.grammarIds.length ? ['grammar'] : [])
  })
  it('combined lessons are not duplicated; partial, cross-level and duplicate topics stay unassigned', () => {
    const used = A2_VISIBLE_UNITS.flatMap(u => u.grammarIds)
    expect(new Set(used).size).toBe(used.length)
    const by = (n: number) => A2_VISIBLE_UNITS[n - 1].grammarIds
    // partial matches awaiting approval
    for (const n of [2, 3, 5, 6, 7, 9, 10, 11, 12, 24, 28, 29, 41]) expect(by(n), `topic ${n}`).toEqual([])
    // cross-level candidates (B1 / hidden legacy A1): not imported
    for (const n of [16, 20, 21, 25, 26, 33, 34, 35, 37, 38, 39, 42]) expect(by(n), `topic ${n}`).toEqual([])
    // no lesson / duplicate topic (36 = 17)
    for (const n of [22, 30, 31, 36, 40]) expect(by(n), `topic ${n}`).toEqual([])
    expect(by(9)).not.toContain('a2-zukunft-praesens-werden') // Präsens + time word is not Futur I
    expect(by(41)).not.toContain('a2-hoefliche-bitten') // a memorised phrase is not Konjunktiv II
    expect(used.some(id => id.startsWith('b1-') || id === 'genitiv')).toBe(false)
    // the combined lessons have one primary destination
    expect(by(23)).toEqual(['a2-personalpronomen-dativverben'])
    expect(by(27)).toEqual(['a2-komparativ-superlativ'])
    expect(by(17)).toEqual(['a2-deshalb-darum'])
  })
  it('nothing was created or changed: the same 27 legacy lessons, the ten legacy units untouched, ids 201–243 unchanged', () => {
    expect(grammarOf('A2')).toHaveLength(27)
    expect(A2_LEGACY_UNITS).toEqual(A2_UNITS)
    expect(A2_VISIBLE_UNITS.map(u => u.id)).toEqual(Array.from({ length: 43 }, (_, i) => 201 + i))
    expect(A2_UNITS.map(u => u.grammarIds.length)).toEqual([3, 2, 3, 3, 3, 3, 2, 2, 3, 3])
  })
})
