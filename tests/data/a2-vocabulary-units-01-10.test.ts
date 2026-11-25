import { describe, expect, it } from 'vitest'
import '../load-a2'
import { A2_VOCABULARY } from '../../src/data/a2/vocabulary'
import { levelOfUnit, vocabularyForUnit } from '../../src/data/catalog'

const sourceEntries: Record<number, string[]> = {
  201: [
    'das Erlebnis', 'der Aufenthalt', 'die Reise', 'der Umzug', 'der Abschluss', 'der Erfolg', 'der Misserfolg', 'die Veränderung',
    'die Entscheidung', 'die Gelegenheit', 'der Ausflug', 'die Veranstaltung', 'der Wettbewerb', 'das Praktikum', 'der Kurs',
    'die Prüfung', 'bestehen', 'erleben', 'teilnehmen', 'erreichen', 'verlieren', 'gewinnen', 'sich erinnern', 'sich entscheiden', 'plötzlich',
  ],
  202: [
    'die Erinnerung', 'die Begegnung', 'der Besuch', 'die Einladung', 'die Feier', 'die Hochzeit', 'der Geburtstag', 'das Abenteuer',
    'der Unfall', 'die Überraschung', 'der Ausflug', 'die Entdeckung', 'der Moment', 'der Eindruck', 'die Erfahrung', 'entdecken',
    'begegnen', 'besuchen', 'einladen', 'feiern', 'vergessen', 'behalten', 'verlieren', 'erscheinen', 'verschwinden',
  ],
  203: [
    'die Kindheit', 'das Spielzeug', 'der Spielplatz', 'die Grundschule', 'der Schulweg', 'der Mitschüler', 'die Mitschülerin',
    'der Lehrer', 'die Lehrerin', 'das Lieblingsfach', 'die Pause', 'das Märchen', 'die Geschichte', 'der Wunsch', 'das Verbot',
    'dürfen', 'sollen', 'wollen', 'müssen', 'können', 'mögen', 'glauben', 'hoffen', 'träumen', 'vermissen',
  ],
  204: [
    'der Wecker', 'das Badezimmer', 'die Dusche', 'die Zahnbürste', 'die Zahnpasta', 'der Kamm', 'die Bürste', 'das Handtuch',
    'die Seife', 'das Shampoo', 'die Creme', 'der Spiegel', 'die Kleidung', 'der Schlafanzug', 'der Feierabend', 'sich beeilen',
    'sich verspäten', 'sich ausruhen', 'sich entspannen', 'sich umziehen', 'sich vorbereiten', 'sich anmelden', 'sich beschäftigen',
    'sich fühlen', 'sich erholen',
  ],
  205: [
    'die Körperpflege', 'die Haut', 'das Haar', 'die Frisur', 'der Rücken', 'der Nacken', 'die Schulter', 'das Knie', 'der Ellenbogen',
    'der Fuß', 'die Erkältung', 'das Fieber', 'der Husten', 'der Schnupfen', 'die Wunde', 'sich kämmen', 'sich rasieren',
    'sich schminken', 'sich verletzen', 'sich erkälten', 'sich schonen', 'sich untersuchen lassen', 'sich Sorgen machen',
    'sich gesund ernähren', 'sich bewegen',
  ],
  206: [
    'der Nachbar', 'die Nachbarin', 'der Kollege', 'die Kollegin', 'der Gast', 'der Fremde', 'die Fremde', 'der Bedürftige',
    'die Bedürftige', 'die Unterstützung', 'die Hilfeleistung', 'der Rat', 'der Hinweis', 'der Vorschlag', 'der Dank',
    'gratulieren', 'danken', 'helfen', 'begegnen', 'folgen', 'gehören', 'fehlen', 'passen', 'schmecken', 'vertrauen',
  ],
  207: [
    'das Geschenk', 'die Aufmerksamkeit', 'das Paket', 'die Verpackung', 'das Geschenkpapier', 'die Schleife', 'die Grußkarte',
    'der Gutschein', 'der Schmuck', 'die Halskette', 'das Armband', 'der Ohrring', 'die Praline', 'der Blumenstrauß',
    'die Überraschungsparty', 'schenken', 'überreichen', 'empfehlen', 'anbieten', 'erklären', 'zeigen', 'schicken', 'leihen',
    'verkaufen', 'versprechen',
  ],
  208: [
    'das Gesprächsthema', 'die Meinung', 'die Diskussion', 'das Argument', 'der Streit', 'die Beziehung', 'die Bewerbung',
    'die Hoffnung', 'die Angst', 'das Interesse', 'die Verantwortung', 'die Teilnahme', 'die Vorbereitung', 'die Reaktion',
    'der Einfluss', 'sich interessieren für', 'sich freuen auf', 'sich freuen über', 'warten auf', 'denken an', 'sprechen über',
    'sprechen mit', 'sich kümmern um', 'sich ärgern über', 'sich erinnern an',
  ],
  209: [
    'der Zukunftsplan', 'das Berufsziel', 'die Weiterbildung', 'die Ausbildung', 'die Karriere', 'die Möglichkeit',
    'die Voraussetzung', 'die Herausforderung', 'die Entwicklung', 'der Wunschberuf', 'der Arbeitsplatz', 'die Selbstständigkeit',
    'die Bewerbung', 'das Vorstellungsgespräch', 'der Lebenslauf', 'planen', 'vorhaben', 'sich bewerben', 'sich weiterbilden',
    'umziehen', 'gründen', 'sich verbessern', 'sich verändern', 'hoffen', 'erwarten',
  ],
  210: [
    'der Anfang', 'das Ende', 'der Verlauf', 'der Höhepunkt', 'die Reihenfolge', 'der Zusammenhang', 'der Grund', 'die Folge',
    'der Zufall', 'die Nachricht', 'der Bericht', 'der Zeuge', 'die Zeugin', 'der Schauplatz', 'die Situation', 'zuerst',
    'danach', 'inzwischen', 'anschließend', 'schließlich', 'gleichzeitig', 'damals', 'plötzlich',
  ],
}

describe('A2 curriculum vocabulary Units 01–10', () => {
  it('preserves every source entry, unit assignment, and order', () => {
    for (const [unitText, expected] of Object.entries(sourceEntries)) {
      const unit = Number(unitText)
      const actual = vocabularyForUnit(unit)
      expect(levelOfUnit(unit)).toBe('A2')
      expect(actual, `unit ${unit} entry count`).toHaveLength(expected.length)
      expect(actual).toEqual(A2_VOCABULARY.filter(item => item.unit === unit))
      expect(
        actual.map(item => `${item.article ? `${item.article} ` : ''}${item.de}`),
        `unit ${unit} source order`,
      ).toEqual(expected)
      expect(actual.map(item => item.id)).toEqual(expected.map((_, i) => `v${unit}-${i + 1}`))
    }

    expect(Object.values(sourceEntries).reduce((sum, entries) => sum + entries.length, 0)).toBe(248)
  })

  it('has complete A2 fields, valid related references, and no duplicates within a unit', () => {
    const ids = new Set(A2_VOCABULARY.map(item => item.id))

    for (const unit of Object.keys(sourceEntries).map(Number)) {
      const words = A2_VOCABULARY.filter(item => item.unit === unit)
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

  it('preserves source repetitions across Units and leaves Unit 10 at 23 entries', () => {
    expect(A2_VOCABULARY.filter(item => item.unit === 210)).toHaveLength(23)
    expect(A2_VOCABULARY.filter(item => item.de === 'Ausflug' && [201, 202].includes(item.unit))).toHaveLength(2)
    expect(A2_VOCABULARY.filter(item => item.de === 'verlieren' && [201, 202].includes(item.unit))).toHaveLength(2)
    expect(A2_VOCABULARY.filter(item => item.de === 'plötzlich' && [201, 210].includes(item.unit))).toHaveLength(2)
  })
})
