import { describe, expect, it } from 'vitest'
import '../load-a2'
import { A2_VOCABULARY } from '../../src/data/a2/vocabulary'
import { levelOfUnit, vocabularyForUnit } from '../../src/data/catalog'

const sourceEntries: Record<number, string[]> = {
  241: [
    'die Rezeption', 'der Empfang', 'die Reservierung', 'die Buchungsnummer', 'der Zimmerservice', 'das Einzelzimmer',
    'das Doppelzimmer', 'das Frühstücksbuffet', 'die Speisekarte', 'die Tageskarte', 'die Rechnung', 'das Trinkgeld',
    'die Bedienung', 'der Kellner', 'die Kellnerin', 'der Gast', 'die Beschwerde', 'der Wunsch', 'die Decke',
    'das Kopfkissen', 'das Handgepäck', 'die Gepäckaufbewahrung', 'die Klimaanlage', 'die Heizung', 'die Aussicht',
  ],
  242: [
    'der Wunschtraum', 'die Sehnsucht', 'die Vorstellung', 'die Fantasie', 'der Traum', 'die Freiheit', 'die Auszeit',
    'die Weltreise', 'das Sabbatjahr', 'die Veränderung', 'die Selbstverwirklichung', 'die Möglichkeit',
    'die Unabhängigkeit', 'die Zufriedenheit', 'das Abenteuer', 'träumen', 'wünschen', 'sich vorstellen', 'hoffen',
    'bevorzugen', 'genießen', 'entdecken', 'verreisen', 'auswandern', 'verwirklichen',
  ],
  243: [
    'die Anleitung', 'die Gebrauchsanweisung', 'der Hinweis', 'die Warnung', 'die Empfehlung', 'der Ratschlag',
    'die Vorschrift', 'die Regel', 'die Reihenfolge', 'der Schritt', 'die Voraussetzung', 'die Sicherheit',
    'die Vorsicht', 'der Notruf', 'der Erste-Hilfe-Kasten', 'beachten', 'befolgen', 'vermeiden', 'überprüfen',
    'kontrollieren', 'aufpassen', 'festhalten', 'loslassen', 'einschalten', 'ausschalten',
  ],
}

describe('A2 curriculum vocabulary Units 41–43', () => {
  it('preserves every source entry, unit assignment, and order', () => {
    for (const [unitText, expected] of Object.entries(sourceEntries)) {
      const unit = Number(unitText)
      const actual = vocabularyForUnit(unit)
      expect(levelOfUnit(unit)).toBe('A2')
      expect(actual, `unit ${unit} entry count`).toHaveLength(25)
      expect(actual).toEqual(A2_VOCABULARY.filter(item => item.unit === unit))
      expect(
        actual.map(item => `${item.article ? `${item.article} ` : ''}${item.de}`),
        `unit ${unit} source order`,
      ).toEqual(expected)
      expect(actual.map(item => item.id)).toEqual(expected.map((_, i) => `v${unit}-${i + 1}`))
    }

    expect(Object.values(sourceEntries).reduce((sum, entries) => sum + entries.length, 0)).toBe(75)
  })

  it('has complete fields, valid related references, and no duplicates within each unit', () => {
    const ids = new Set(A2_VOCABULARY.map(item => item.id))

    for (const unit of Object.keys(sourceEntries).map(Number)) {
      const words = vocabularyForUnit(unit)
      const entries = words.map(item => `${item.article ?? ''}:${item.de.toLocaleLowerCase('de')}`)
      expect(new Set(entries).size, `unit ${unit} duplicate entry`).toBe(entries.length)

      for (const item of words) {
        expect(item.de.trim()).not.toBe('')
        expect(item.ru.trim()).not.toBe('')
        expect(item.ky.trim()).not.toBe('')
        expect(item.example.trim()).not.toBe('')
        expect(item.exampleRu.trim()).not.toBe('')
        expect(item.exampleKy?.trim()).toBeTruthy()
        expect(item.related.length).toBeGreaterThan(0)
        expect(item.related.every(id => ids.has(id))).toBe(true)
        expect(item.related.every(id => A2_VOCABULARY.find(related => related.id === id)?.unit === unit)).toBe(true)
        if (item.pos === 'noun') expect(item.article, item.id).toBeDefined()
      }
    }
  })

  it('preserves repeated source vocabulary across Units', () => {
    expect(A2_VOCABULARY.filter(item => item.de === 'Beschwerde' && [233, 241].includes(item.unit))).toHaveLength(2)
    expect(A2_VOCABULARY.filter(item => item.de === 'Voraussetzung' && [236, 243].includes(item.unit))).toHaveLength(2)
    expect(A2_VOCABULARY.filter(item => item.de === 'Sicherheit' && [240, 243].includes(item.unit))).toHaveLength(2)
  })
})
