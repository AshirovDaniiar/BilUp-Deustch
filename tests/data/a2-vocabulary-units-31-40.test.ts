import { describe, expect, it } from 'vitest'
import '../load-a2'
import { A2_VOCABULARY } from '../../src/data/a2/vocabulary'
import { levelOfUnit, vocabularyForUnit } from '../../src/data/catalog'

const sourceEntries: Record<number, string[]> = {
  231: [
    'derzeit', 'inzwischen', 'künftig', 'gelegentlich', 'regelmäßig', 'selten', 'häufig', 'täglich', 'wöchentlich',
    'monatlich', 'jährlich', 'draußen', 'drinnen', 'oben', 'unten', 'überall', 'irgendwo', 'nirgendwo', 'daneben',
    'gegenüber', 'deshalb', 'trotzdem', 'besonders', 'gemeinsam', 'sorgfältig',
  ],
  232: [
    'das Erdgeschoss', 'das Dachgeschoss', 'der Kellerraum', 'der Dachboden', 'der Flur', 'der Eingangsbereich',
    'der Balkon', 'die Terrasse', 'der Innenhof', 'die Garage', 'der Parkplatz', 'der Aufzug', 'das Treppenhaus',
    'die Etage', 'die Wohnfläche', 'der Grundriss', 'die Miete', 'die Nebenkosten', 'die Kaution', 'der Vermieter', 'die Vermieterin',
    'der Mieter', 'die Mieterin', 'möbliert', 'unmöbliert',
  ],
  233: [
    'der Zusammenhang', 'der Vorschlag', 'die Absicht', 'die Reaktion', 'die Antwort', 'die Rückfrage', 'die Zustimmung',
    'die Ablehnung', 'die Kritik', 'das Lob', 'die Beschwerde', 'die Diskussion', 'die Vereinbarung', 'der Kompromiss',
    'die Erwartung', 'reagieren', 'antworten', 'zustimmen', 'widersprechen', 'sich beziehen auf', 'verzichten auf',
    'bestehen auf', 'sich freuen über', 'sich ärgern über', 'sich verlassen auf',
  ],
  234: [
    'die Umgebung', 'die Gegend', 'die Region', 'der Bezirk', 'das Viertel', 'die Grenze', 'die Nähe', 'die Entfernung',
    'die Richtung', 'der Bereich', 'die Seite', 'die Mitte', 'der Rand', 'der Eingang', 'der Ausgang', 'außerhalb',
    'innerhalb', 'während', 'trotz', 'wegen', 'statt', 'aufgrund', 'entlang', 'oberhalb', 'unterhalb',
  ],
  235: [
    'das Hindernis', 'die Panne', 'der Defekt', 'der Fehler', 'die Störung', 'der Ärger', 'die Belastung', 'der Zeitdruck',
    'die Herausforderung', 'die Geduld', 'die Ausdauer', 'die Anstrengung', 'die Unterstützung', 'der Ersatz',
    'die Notlösung', 'schwierig', 'anstrengend', 'unbequem', 'ärgerlich', 'unerwartet', 'kompliziert', 'lösbar',
    'belastend', 'trotzdem', 'dennoch',
  ],
  236: [
    'die Entscheidung', 'die Konsequenz', 'die Verantwortung', 'das Risiko', 'die Priorität', 'das Ziel', 'die Gelegenheit',
    'die Möglichkeit', 'die Einschränkung', 'die Voraussetzung', 'die Auswirkung', 'die Folge', 'der Entschluss',
    'die Abwägung', 'der Kompromiss', 'entscheiden', 'abwägen', 'auswählen', 'bevorzugen', 'verzichten', 'riskieren',
    'ermöglichen', 'einschränken', 'berücksichtigen', 'verantworten',
  ],
  237: [
    'das Wahrzeichen', 'die Sehenswürdigkeit', 'das Denkmal', 'das Museum', 'die Ausstellung', 'die Bibliothek',
    'das Theater', 'die Oper', 'die Galerie', 'der Konzertsaal', 'der Stadtpark', 'der Wochenmarkt', 'die Fußgängerzone',
    'das Einkaufszentrum', 'die Altstadt', 'kulturell', 'historisch', 'sehenswert', 'zentral', 'vielfältig', 'öffentlich',
    'kostenlos', 'barrierefrei', 'beliebt', 'bekannt',
  ],
  238: [
    'die Wahl', 'die Entscheidungshilfe', 'die Möglichkeit', 'die Alternative', 'die Option', 'die Vorliebe',
    'die Abwechslung', 'der Kompromiss', 'die Priorität', 'die Auswahl', 'die Fahrkarte', 'die Unterkunft',
    'das Reiseziel', 'die Freizeitaktivität', 'die Studienrichtung', 'wählen', 'entscheiden', 'vergleichen', 'bevorzugen',
    'verzichten', 'kombinieren', 'wechseln', 'buchen', 'stornieren', 'überlegen',
  ],
  239: [
    'die Kombination', 'die Mischung', 'die Verbindung', 'die Ergänzung', 'die Zusammenarbeit', 'die Teamarbeit',
    'die Doppelrolle', 'die Vielfalt', 'die Gemeinsamkeit', 'der Gegensatz', 'die Balance', 'die Fähigkeit', 'die Erfahrung',
    'die Kompetenz', 'gleichzeitig', 'gemeinsam', 'zusätzlich', 'beides', 'ebenso', 'vielseitig', 'praktisch',
    'theoretisch', 'beruflich', 'privat',
  ],
  240: [
    'der Wert', 'die Bedeutung', 'die Priorität', 'die Leidenschaft', 'die Überzeugung', 'das Engagement',
    'die Verantwortung', 'die Nachhaltigkeit', 'die Gerechtigkeit', 'die Gleichberechtigung', 'die Freiheit',
    'die Sicherheit', 'die Gesundheit', 'die Bildung', 'die Gemeinschaft', 'wichtig', 'wesentlich', 'entscheidend',
    'wertvoll', 'sinnvoll', 'sozial', 'persönlich', 'beruflich', 'nachhaltig', 'gerecht',
  ],
}

describe('A2 curriculum vocabulary Units 31–40', () => {
  it('preserves the source entries, unit assignments, and order', () => {
    for (const [unitText, expected] of Object.entries(sourceEntries)) {
      const unit = Number(unitText)
      const actual = vocabularyForUnit(unit)
      const expectedCount = unit === 239 ? 24 : 25
      expect(levelOfUnit(unit)).toBe('A2')
      expect(actual, `unit ${unit} entry count`).toHaveLength(expectedCount)
      expect(actual).toEqual(A2_VOCABULARY.filter(item => item.unit === unit))
      expect(
        actual.map(item => `${item.article ? `${item.article} ` : ''}${item.de}`),
        `unit ${unit} source order`,
      ).toEqual(expected)
      expect(actual.map(item => item.id)).toEqual(expected.map((_, i) => `v${unit}-${i + 1}`))
    }

    expect(Object.values(sourceEntries).reduce((sum, entries) => sum + entries.length, 0)).toBe(249)
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

  it('keeps the short source Unit 39 and plural-only Nebenkosten', () => {
    expect(vocabularyForUnit(239)).toHaveLength(24)
    expect(A2_VOCABULARY.find(item => item.id === 'v232-18')).toMatchObject({
      pos: 'noun',
      article: 'die',
      plural: 'Nebenkosten',
      pluralOnly: true,
    })
    expect(A2_VOCABULARY.filter(item => item.de === 'Priorität' && [236, 240].includes(item.unit))).toHaveLength(2)
    expect(A2_VOCABULARY.filter(item => item.de === 'trotzdem' && [231, 235].includes(item.unit))).toHaveLength(2)
  })
})
