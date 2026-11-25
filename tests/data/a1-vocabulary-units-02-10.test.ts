import { describe, expect, it } from 'vitest'
import { vocabularyForUnit } from '../../src/data/catalog'
import { caseForms, vocabForUnit, VOCABULARY } from '../../src/data/vocabulary'

const curriculumUnitIds = Array.from({ length: 9 }, (_, index) => 102 + index)
const nextCurriculumUnitIds = Array.from({ length: 10 }, (_, index) => 111 + index)

describe('A1 curriculum Vocabulary, Units 02–10', () => {
  it('provides 25 ordered entries in each stable unit id', () => {
    for (const unit of curriculumUnitIds) {
      const words = vocabularyForUnit(unit)
      expect(words).toHaveLength(25)
      expect(words.map(word => word.id)).toEqual(Array.from({ length: 25 }, (_, index) => `v${unit}-${index + 1}`))
      expect(words.every(word => word.unit === unit)).toBe(true)
    }

    expect(curriculumUnitIds.reduce((count, unit) => count + vocabularyForUnit(unit).length, 0)).toBe(225)
    expect(new Set(VOCABULARY.map(word => word.id)).size).toBe(VOCABULARY.length)
  })

  it('has translations and examples in both languages and keeps related-word references inside the unit', () => {
    const items = curriculumUnitIds.flatMap(unit => vocabularyForUnit(unit))
    const byId = new Map(VOCABULARY.map(word => [word.id, word]))

    for (const word of items) {
      expect(word.de.trim()).not.toBe('')
      expect(word.ru.trim()).not.toBe('')
      expect(word.ky.trim()).not.toBe('')
      expect(word.example.trim()).not.toBe('')
      expect(word.exampleRu.trim()).not.toBe('')
      expect(word.exampleKy?.trim()).toBeTruthy()
      for (const relatedId of word.related) expect(byId.get(relatedId)?.unit).toBe(word.unit)
    }
  })

  it('preserves repeated source entries as separate unit-owned records', () => {
    const unit5Telephone = vocabForUnit(105).find(word => word.de === 'Telefonnummer')
    const unit7Telephone = vocabForUnit(107).find(word => word.de === 'Telefonnummer')

    expect(unit5Telephone?.id).toBe('v105-8')
    expect(unit7Telephone?.id).toBe('v107-14')
    expect(unit5Telephone?.id).not.toBe(unit7Telephone?.id)
  })

  it('uses plural case forms for plural-only family nouns without changing Unit 01', () => {
    const parents = vocabForUnit(104).find(word => word.de === 'Eltern')

    expect(parents && caseForms(parents)).toEqual({
      nom: 'die Eltern',
      akk: 'die Eltern',
      dat: 'den Eltern',
    })
    expect(vocabForUnit(1)).toHaveLength(23)
  })
})

describe('A1 curriculum Vocabulary, Units 11–20', () => {
  it('provides 25 ordered entries in each stable unit id', () => {
    for (const unit of nextCurriculumUnitIds) {
      const words = vocabularyForUnit(unit)
      expect(words).toHaveLength(25)
      expect(words.map(word => word.id)).toEqual(Array.from({ length: 25 }, (_, index) => `v${unit}-${index + 1}`))
      expect(words.every(word => word.unit === unit)).toBe(true)
    }

    expect(nextCurriculumUnitIds.reduce((count, unit) => count + vocabularyForUnit(unit).length, 0)).toBe(250)
    expect(new Set(VOCABULARY.map(word => word.id)).size).toBe(VOCABULARY.length)
  })

  it('has translations and examples in both languages and keeps related-word references inside the unit', () => {
    const items = nextCurriculumUnitIds.flatMap(unit => vocabularyForUnit(unit))
    const byId = new Map(VOCABULARY.map(word => [word.id, word]))

    for (const word of items) {
      expect(word.de.trim()).not.toBe('')
      expect(word.ru.trim()).not.toBe('')
      expect(word.ky.trim()).not.toBe('')
      expect(word.example.trim()).not.toBe('')
      expect(word.exampleRu.trim()).not.toBe('')
      expect(word.exampleKy?.trim()).toBeTruthy()
      for (const relatedId of word.related) expect(byId.get(relatedId)?.unit).toBe(word.unit)
    }
  })

  it('preserves selected source distinctions and leaves earlier A1 units unchanged', () => {
    expect(vocabForUnit(112).map(word => word.de).slice(0, 3)).toEqual(['Kugelschreiber', 'Bleistift', 'Radiergummi'])
    expect(vocabForUnit(116).map(word => word.de).slice(0, 3)).toEqual(['mein Vater', 'meine Mutter', 'mein Bruder'])
    expect(vocabForUnit(117).map(word => word.de).slice(0, 5)).toEqual([
      'welcher Preis', 'welche Größe', 'welche Farbe', 'welches Modell', 'welche Marke',
    ])
    expect(vocabForUnit(118).map(word => word.de).slice(0, 3)).toEqual(['dieser Mann', 'diese Frau', 'dieses Kind'])
    expect(vocabForUnit(119).find(word => word.de === 'spazieren gehen')?.pos).toBe('verb')
    expect(vocabForUnit(1)).toHaveLength(23)
    for (const unit of curriculumUnitIds) expect(vocabularyForUnit(unit)).toHaveLength(25)
  })

  it('uses plural case forms for plural-only vocabulary in the new block', () => {
    for (const [unit, word, dative] of [
      [111, 'Möbel', 'den Möbeln'],
      [113, 'Nudeln', 'den Nudeln'],
      [117, 'Schuhe', 'den Schuhen'],
      [120, 'Geschwister', 'den Geschwistern'],
    ] as const) {
      const item = vocabForUnit(unit).find(entry => entry.de === word)
      expect(item && caseForms(item)?.dat).toBe(dative)
    }
  })
})
