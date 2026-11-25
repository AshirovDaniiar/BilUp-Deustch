import { describe, expect, it } from 'vitest'
import { vocabularyForUnit } from '../../src/data/catalog'
import { vocabForUnit, VOCABULARY } from '../../src/data/vocabulary'

const unitIds = Array.from({ length: 8 }, (_, index) => 131 + index)

describe('A1 curriculum Vocabulary, Units 31–38', () => {
  it('provides 25 ordered, unique entries in each stable unit id', () => {
    for (const unit of unitIds) {
      const words = vocabularyForUnit(unit)
      expect(words).toHaveLength(25)
      expect(words.map(word => word.id)).toEqual(Array.from({ length: 25 }, (_, index) => `v${unit}-${index + 1}`))
      expect(words.every(word => word.unit === unit)).toBe(true)
      expect(new Set(words.map(word => word.de)).size).toBe(25)
    }

    expect(unitIds.reduce((count, unit) => count + vocabularyForUnit(unit).length, 0)).toBe(200)
    expect(new Set(VOCABULARY.map(word => word.id)).size).toBe(VOCABULARY.length)
  })

  it('has translations and examples in both languages and keeps related-word references inside the unit', () => {
    const items = unitIds.flatMap(unit => vocabularyForUnit(unit))
    const byId = new Map(VOCABULARY.map(word => [word.id, word]))

    for (const word of items) {
      expect(word.de.trim()).not.toBe('')
      expect(word.ru.trim()).not.toBe('')
      expect(word.ky.trim()).not.toBe('')
      expect(word.example.trim()).not.toBe('')
      expect(word.exampleRu.trim()).not.toBe('')
      expect(word.exampleKy?.trim()).toBeTruthy()
      expect(word.pos).toBeTruthy()
      for (const relatedId of word.related) expect(byId.get(relatedId)?.unit).toBe(word.unit)
    }
  })

  it('preserves source phrases, forms, and repeated vocabulary as separate records', () => {
    expect(vocabForUnit(131).map(word => word.de).slice(15, 20)).toEqual([
      'spazieren gehen', 'Rad fahren', 'Fußball spielen', 'Musik hören', 'Freunde treffen',
    ])
    expect(vocabForUnit(131).slice(15, 20).every(word => word.pos === 'verb')).toBe(true)
    expect(vocabForUnit(132).find(word => word.de === 'von ... bis')?.pos).toBe('phrase')
    expect(vocabForUnit(133).map(word => word.de).slice(0, 3)).toEqual(['in den Park', 'ins Kino', 'in die Schule'])
    expect(vocabForUnit(134).find(word => word.de === 'zu Hause')?.pos).toBe('phrase')
    expect(vocabForUnit(135).find(word => word.de === 'zwischen den Stühlen')).toBeTruthy()
    expect(vocabForUnit(136).find(word => word.de === 'als Kind')?.pos).toBe('phrase')
    expect(vocabForUnit(137).map(word => word.de).slice(14, 20)).toEqual([
      'aufgestanden', 'angerufen', 'eingekauft', 'aufgeräumt', 'angekommen', 'abgefahren',
    ])
    expect(vocabForUnit(138).map(word => word.de).slice(10, 14)).toEqual([
      'Haltestelle', 'Fahrplan', 'Fahrkarte', 'Fahrkartenautomat',
    ])

    const unit33Park = vocabForUnit(133).find(word => word.de === 'Park')
    const unit34Park = vocabForUnit(134).find(word => word.de === 'Park')
    const unit38Ticket = vocabForUnit(138).find(word => word.de === 'Fahrkarte')
    const unit20Ticket = vocabForUnit(120).find(word => word.de === 'Fahrkarte')
    expect(unit33Park?.id).toBe('v133-12')
    expect(unit34Park?.id).toBe('v134-11')
    expect(unit38Ticket?.id).toBe('v138-13')
    expect(unit20Ticket?.id).toBe('v120-8')
    expect(unit33Park?.id).not.toBe(unit34Park?.id)
    expect(unit38Ticket?.id).not.toBe(unit20Ticket?.id)
  })

  it('leaves Unit 01 and previously populated A1 units intact', () => {
    expect(vocabForUnit(1)).toHaveLength(23)
    for (let unit = 102; unit <= 130; unit++) expect(vocabularyForUnit(unit)).toHaveLength(25)
  })
})
