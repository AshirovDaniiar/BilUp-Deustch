import { describe, expect, it } from 'vitest'
import { vocabularyForUnit } from '../../src/data/catalog'
import { caseForms, vocabForUnit, VOCABULARY } from '../../src/data/vocabulary'

const unitIds = Array.from({ length: 10 }, (_, index) => 121 + index)

describe('A1 curriculum Vocabulary, Units 21–30', () => {
  it('provides 25 ordered entries in each stable unit id', () => {
    for (const unit of unitIds) {
      const words = vocabularyForUnit(unit)
      expect(words).toHaveLength(25)
      expect(words.map(word => word.id)).toEqual(Array.from({ length: 25 }, (_, index) => `v${unit}-${index + 1}`))
      expect(words.every(word => word.unit === unit)).toBe(true)
    }

    expect(unitIds.reduce((count, unit) => count + vocabularyForUnit(unit).length, 0)).toBe(250)
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

  it('preserves source forms, order, and repeated entries across units', () => {
    expect(vocabForUnit(121).map(word => word.de).slice(0, 4)).toEqual(['Arzt', 'Ärztin', 'Verkäufer', 'Verkäuferin'])
    expect(vocabForUnit(123).map(word => word.de).slice(0, 9)).toEqual([
      'mich', 'dich', 'ihn', 'sie', 'es', 'uns', 'euch', 'sie (Plural)', 'Sie',
    ])
    expect(vocabForUnit(130).map(word => word.de).slice(0, 3)).toEqual(['bestellen', 'bringen', 'nehmen'])

    const unit22Bread = vocabForUnit(122).find(word => word.de === 'Brot')
    const unit13Bread = vocabForUnit(113).find(word => word.de === 'Brot')
    const unit23Mich = vocabForUnit(123).find(word => word.de === 'mich')
    const unit26Mich = vocabForUnit(126).find(word => word.de === 'mich')
    expect(unit22Bread?.id).toBe('v122-3')
    expect(unit13Bread?.id).toBe('v113-1')
    expect(unit23Mich?.id).toBe('v123-1')
    expect(unit26Mich?.id).toBe('v126-1')
    expect(unit22Bread?.id).not.toBe(unit13Bread?.id)
    expect(unit23Mich?.id).not.toBe(unit26Mich?.id)
  })

  it('uses plural dative forms for plural entries and leaves earlier A1 units populated', () => {
    for (const [unit, word, dative] of [
      [123, 'Zähne', 'den Zähnen'],
      [123, 'Haare', 'den Haaren'],
      [123, 'Schuhe', 'den Schuhen'],
      [125, 'Blumen', 'den Blumen'],
    ] as const) {
      const item = vocabForUnit(unit).find(entry => entry.de === word)
      expect(item && caseForms(item)?.dat).toBe(dative)
    }

    expect(vocabForUnit(1)).toHaveLength(23)
    for (let unit = 102; unit <= 120; unit++) expect(vocabularyForUnit(unit)).toHaveLength(25)
  })
})
