import { describe, expect, it } from 'vitest'
import '../load-a2'
import { A2_VOCABULARY } from '../../src/data/a2/vocabulary'
import { levelOfUnit, vocabularyForUnit } from '../../src/data/catalog'

const sourceEntries: Record<number, string[]> = {
  221: [
    'der Familienbesitz', 'das Eigentum', 'der Erbe', 'die Erbin', 'das Erbe', 'der Nachlass', 'das Grundstück',
    'das Eigentumsrecht', 'der Mietvertrag', 'der Kaufvertrag', 'die Unterschrift', 'die Vollmacht', 'der Ausweis',
    'die Urkunde', 'der Stammbaum', 'der Verwandte', 'die Verwandte', 'der Cousin', 'die Cousine', 'der Schwager',
    'die Schwägerin', 'die Schwiegermutter', 'der Schwiegervater', 'der Neffe', 'die Nichte',
  ],
  222: [
    'der Mensch', 'der Nachbar', 'der Kunde', 'der Experte', 'der Student', 'der Praktikant', 'der Journalist', 'der Tourist',
    'der Polizist', 'der Patient', 'der Assistent', 'der Präsident', 'der Lieferant', 'der Fotograf', 'der Biologe',
    'der Architekt', 'der Kollege', 'der Erwachsene', 'der Jugendliche', 'der Fremde', 'der Zeuge', 'der Bote', 'der Name',
    'der Gedanke', 'der Wille',
  ],
  223: [
    'das Missverständnis', 'die Aussprache', 'der Streitpunkt', 'die Versöhnung', 'die Entschuldigung', 'das Vertrauen',
    'die Bekanntschaft', 'die Freundschaft', 'die Partnerschaft', 'die Rückmeldung', 'die Nachricht', 'der Anruf',
    'die Mitteilung', 'die Vereinbarung', 'die Unterstützung', 'sich entschuldigen', 'sich bedanken', 'sich versöhnen',
    'sich vertragen', 'zuhören', 'unterbrechen', 'informieren', 'beruhigen', 'überzeugen', 'enttäuschen',
  ],
  224: [
    'die Menge', 'die Mehrheit', 'die Minderheit', 'die Auswahl', 'die Anzahl', 'die Gruppe', 'die Gesamtheit',
    'der Einzelne', 'die Einzelne', 'der Rest', 'der Anteil', 'die Ausnahme', 'die Vielfalt', 'die Reihe', 'die Verteilung',
    'jemand', 'niemand', 'etwas', 'nichts', 'alle', 'einige', 'mehrere', 'manche', 'wenige', 'sämtliche',
  ],
  225: [
    'der Bekannte', 'die Bekannte', 'der Freundeskreis', 'die Bekanntschaft', 'der Vereinskollege', 'die Vereinskollegin',
    'der Mitbewohner', 'die Mitbewohnerin', 'der Gastgeber', 'die Gastgeberin', 'der Gesprächspartner',
    'die Gesprächspartnerin', 'der Ansprechpartner', 'die Ansprechpartnerin', 'der Vorgesetzte', 'die Vorgesetzte',
    'der Rentner', 'die Rentnerin', 'der Teilnehmer', 'die Teilnehmerin', 'der Ehrenamtliche', 'die Ehrenamtliche',
    'der Stammgast', 'die Stammkundin', 'der Stammkunde',
  ],
  226: [
    'das Haushaltsgerät', 'der Staubsauger', 'die Waschmaschine', 'der Trockner', 'der Geschirrspüler', 'der Wasserkocher',
    'die Kaffeemaschine', 'der Toaster', 'der Kühlschrank', 'der Gefrierschrank', 'das Bügeleisen', 'die Steckdose',
    'das Verlängerungskabel', 'die Glühbirne', 'der Werkzeugkasten', 'der Schraubenzieher', 'der Hammer', 'die Zange',
    'der Nagel', 'die Schraube', 'das Klebeband', 'die Schere', 'der Ordner', 'die Mappe', 'der Hefter',
  ],
  227: [
    'die Großstadt', 'die Kleinstadt', 'das Dorf', 'die Innenstadt', 'der Stadtrand', 'das Wohngebiet', 'die Landschaft',
    'die Natur', 'die Luftqualität', 'die Lebensqualität', 'die Einwohnerzahl', 'die Bevölkerungsdichte',
    'die Infrastruktur', 'das Nahverkehrsnetz', 'die Einkaufsmöglichkeit', 'ruhig', 'lebendig', 'dicht', 'weitläufig',
    'bezahlbar', 'überfüllt', 'umweltfreundlich', 'ländlich', 'städtisch', 'erreichbar',
  ],
  228: [
    'das Highlight', 'der Rekord', 'der Spitzenplatz', 'die Auszeichnung', 'der Preis', 'die Medaille', 'der Favorit',
    'die Favoritin', 'der Spitzenreiter', 'die Spitzenreiterin', 'die Meisterschaft', 'das Meisterwerk',
    'die Höchstleistung', 'die Bestleistung', 'die Lieblingsbeschäftigung', 'hervorragend', 'ausgezeichnet',
    'beeindruckend', 'einzigartig', 'außergewöhnlich', 'unglaublich', 'erstklassig', 'ideal', 'perfekt', 'unvergesslich',
  ],
  229: [
    'der Wandel', 'die Entwicklung', 'der Unterschied', 'die Ähnlichkeit', 'der Vergleich', 'der Lebensstil',
    'die Lebensweise', 'die Generation', 'der Fortschritt', 'der Rückgang', 'der Trend', 'die Veränderung',
    'die Gewohnheit', 'die Tradition', 'die Moderne', 'früher', 'heutzutage', 'inzwischen', 'mittlerweile', 'damals',
    'ähnlich', 'verschieden', 'vergleichbar', 'traditionell', 'modern',
  ],
  230: [
    'das Gute', 'das Schlechte', 'das Neue', 'das Alte', 'das Schöne', 'das Schwierige', 'das Wichtige', 'das Unbekannte',
    'der Erwachsene', 'die Erwachsene', 'der Jugendliche', 'die Jugendliche', 'der Arbeitslose', 'die Arbeitslose',
    'der Kranke', 'die Kranke', 'der Fremde', 'die Fremde', 'der Angestellte', 'die Angestellte', 'der Reisende',
    'die Reisende', 'der Verletzte', 'die Verletzte', 'der Verantwortliche', 'die Verantwortliche',
  ],
}

describe('A2 curriculum vocabulary Units 21–30', () => {
  it('preserves every source entry, unit assignment, and order', () => {
    for (const [unitText, expected] of Object.entries(sourceEntries)) {
      const unit = Number(unitText)
      const actual = vocabularyForUnit(unit)
      expect(levelOfUnit(unit)).toBe('A2')
      expect(actual, `unit ${unit} entry count`).toHaveLength(unit === 230 ? 26 : 25)
      expect(actual).toEqual(A2_VOCABULARY.filter(item => item.unit === unit))
      expect(
        actual.map(item => `${item.article ? `${item.article} ` : ''}${item.de}`),
        `unit ${unit} source order`,
      ).toEqual(expected)
      expect(actual.map(item => item.id)).toEqual(expected.map((_, i) => `v${unit}-${i + 1}`))
    }

    expect(Object.values(sourceEntries).reduce((sum, entries) => sum + entries.length, 0)).toBe(251)
  })

  it('has complete A2 fields, valid related references, and no duplicates within a unit', () => {
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

  it('preserves vocabulary repetitions and the source 26-entry count for Unit 30', () => {
    expect(A2_VOCABULARY.filter(item => item.unit === 230)).toHaveLength(26)
    expect(A2_VOCABULARY.filter(item => item.de === 'Erwachsene' && [222, 230].includes(item.unit))).toHaveLength(3)
    expect(A2_VOCABULARY.filter(item => item.de === 'Jugendliche' && [222, 230].includes(item.unit))).toHaveLength(3)
    expect(A2_VOCABULARY.filter(item => item.de === 'Fremde' && [222, 230].includes(item.unit))).toHaveLength(3)
    expect(A2_VOCABULARY.find(item => item.id === 'v224-16')?.pos).toBe('other')
    expect(A2_VOCABULARY.find(item => item.id === 'v227-16')?.pos).toBe('adj')
  })
})
