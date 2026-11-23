import { describe, expect, it } from 'vitest'
import { A1_CURRICULUM_TITLES, A1_GRAMMAR_TOPICS, A1_LEGACY_UNITS, A1_UNITS } from '../../src/data/a1-curriculum'
import { grammarIndex, grammarOf } from '../../src/data/catalog'
import { UNITS } from '../../src/data/units'

describe('A1 grammar mapping: existing lessons are REFERENCED, never created or copied', () => {
  it('covers all 38 approved topics, aligned with the 38 unit titles', () => {
    expect(A1_GRAMMAR_TOPICS).toHaveLength(38)
    expect(A1_GRAMMAR_TOPICS[0].topic).toBe('Alphabet und Aussprache')
    expect(A1_GRAMMAR_TOPICS[20].topic).toBe('Nominativ')
    expect(A1_GRAMMAR_TOPICS[37].topic).toBe('Zusammengesetzte Verben')
    expect(A1_CURRICULUM_TITLES[20]).toBe('Wer oder was?')
  })
  it('16 topics reference an existing lesson (15 full, 1 approved PARTIAL); each lesson is referenced by at most one NEW unit', () => {
    const concepts = A1_GRAMMAR_TOPICS.flatMap(t => (t.concept ? [t.concept] : []))
    expect(concepts).toHaveLength(16)
    expect(new Set(concepts).size).toBe(16)
    expect(A1_GRAMMAR_TOPICS.filter(t => t.concept && !t.partial)).toHaveLength(15)
    expect(A1_GRAMMAR_TOPICS.filter(t => t.partial).map(t => t.topic)).toEqual(['Modalverben: können, müssen, wollen, dürfen'])
    for (const c of concepts) {
      const g = grammarIndex.get(c)
      expect(g, c).toBeDefined()
      expect(g!.level, `${c} must be an A1-tagged lesson`).toBe('A1')
    }
  })
  it('the new units reference exactly those lessons, in their approved positions', () => {
    A1_GRAMMAR_TOPICS.forEach((t, i) => {
      const unit = A1_UNITS[i]
      if (i === 0) return // Unit 01 is the reused legacy unit and keeps its own lessons
      expect(unit.grammarIds).toEqual(t.concept ? [t.concept] : [])
    })
    expect(A1_UNITS.slice(1).filter(u => u.grammarIds.length > 0)).toHaveLength(16)
    expect(A1_UNITS.slice(1).filter(u => u.grammarIds.length === 0)).toHaveLength(21)
  })
  it('no grammar content was created: the same 20 legacy lessons exist; Unit 01 and the hidden units are untouched; no A2-tagged lesson is used', () => {
    expect(grammarOf('A1')).toHaveLength(20)
    expect(A1_UNITS[0]).toBe(UNITS[0])
    expect(UNITS[0].grammarIds).toEqual(['articles', 'sein-haben', 'questions', 'nominativ'])
    for (const u of A1_LEGACY_UNITS) expect(u.grammarIds).toEqual(UNITS.find(x => x.id === u.id)!.grammarIds)
    const used = new Set(A1_UNITS.flatMap(u => u.grammarIds))
    expect(used.has('genitiv')).toBe(false)
    expect([...used].some(id => id.startsWith('a2-'))).toBe(false)
    // lessons without a confirmed match stay unreferenced by new units (partial matches await manual review)
    for (const id of ['questions', 'negation', 'conjunctions']) expect(A1_UNITS.slice(1).some(u => u.grammarIds.includes(id))).toBe(false)
  })

  it('approved decisions: 06 → verb-position (full); 27 → modal as PARTIAL (möchte, kann, muss) and nothing else is partial; 28 and the other open matches stay empty', () => {
    const by = (title: string) => A1_UNITS.find(u => u.title === title)!
    expect(by('Mein Leben in Deutschland').grammarIds).toEqual(['verb-position'])
    expect(by('Mein Leben in Deutschland').grammarPartial).toBeUndefined()
    const u27 = by('Was kann und muss ich?')
    expect(u27.grammarIds).toEqual(['modal'])
    expect(u27.grammarPartial).toEqual({ modal: 'möchte, kann, muss' })
    expect(JSON.stringify(u27.grammarPartial)).not.toMatch(/wollen|dürfen/)
    expect(A1_UNITS.filter(u => u.grammarPartial).map(u => u.title)).toEqual(['Was kann und muss ich?'])
    for (const t of ['Meine Wünsche und Möglichkeiten', 'Ich stelle mich vor', 'Neue Bekanntschaften', 'Fragen über mich', 'Was machst du gern?', 'In meinem Zimmer', 'Was mache ich nicht?', 'Was habe ich nicht?', 'Meine Freizeit und Hobbys', 'Unterwegs in der Stadt'])
      expect(by(t).grammarIds, t).toEqual([])
    // the lesson itself is untouched: same id, still the A1 "Modalverben" lesson of legacy unit 4
    expect(grammarIndex.get('modal')).toMatchObject({ id: 'modal', unit: 4, level: 'A1' })
  })
})
