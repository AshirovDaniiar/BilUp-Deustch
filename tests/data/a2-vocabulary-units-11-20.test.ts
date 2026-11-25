import { describe, expect, it } from 'vitest'
import '../load-a2'
import { A2_VOCABULARY } from '../../src/data/a2/vocabulary'
import { levelOfUnit, vocabularyForUnit } from '../../src/data/catalog'

const sourceEntries: Record<number, string[]> = {
  211: [
    'der Grund', 'die Ursache', 'die Erklärung', 'der Verkehr', 'der Stau', 'die Verspätung', 'der Ausfall', 'die Baustelle',
    'die Reparatur', 'der Lärm', 'die Ruhe', 'die Müdigkeit', 'der Stress', 'die Sorge', 'die Schwierigkeit', 'verursachen',
    'sich beschweren', 'ausfallen', 'sich verspäten', 'fehlen', 'funktionieren', 'sparen', 'vermeiden', 'sich konzentrieren',
    'sich ärgern',
  ],
  212: [
    'die Überzeugung', 'die Vermutung', 'die Nachricht', 'die Tatsache', 'die Behauptung', 'die Information', 'die Erkenntnis',
    'der Eindruck', 'die Hoffnung', 'die Befürchtung', 'die Möglichkeit', 'die Wahrscheinlichkeit', 'die Meinung',
    'der Standpunkt', 'das Gerücht', 'vermuten', 'behaupten', 'feststellen', 'erfahren', 'mitteilen', 'informieren',
    'bezweifeln', 'zustimmen', 'ablehnen', 'überzeugen',
  ],
  213: [
    'der Notfall', 'die Lösung', 'der Plan', 'die Bedingung', 'die Möglichkeit', 'die Alternative', 'die Regel', 'die Ausnahme',
    'die Hilfe', 'der Kontakt', 'die Telefonnummer', 'die Adresse', 'der Schlüssel', 'der Ersatz', 'der Ausweg', 'reagieren',
    'handeln', 'entscheiden', 'anrufen', 'Bescheid geben', 'absagen', 'verschieben', 'organisieren', 'lösen', 'sich melden',
  ],
  214: [
    'die Geburt', 'der Schulanfang', 'der Schulabschluss', 'der erste Arbeitstag', 'der Umzugstag', 'die Verlobung',
    'die Trennung', 'die Geburtstagsfeier', 'der Abschied', 'das Wiedersehen', 'der Urlaubstag', 'die Jugend',
    'das Erwachsenenalter', 'die Vergangenheit', 'die Gegenwart', 'stattfinden', 'beginnen', 'enden', 'passieren',
    'sich ereignen', 'aufwachsen', 'sich kennenlernen', 'sich verabschieden', 'zurückkehren', 'weitergehen',
  ],
  215: [
    'die Auskunft', 'die Information', 'der Schalter', 'die Anmeldung', 'die Öffnungszeit', 'die Sprechstunde', 'die Durchsage',
    'die Wegbeschreibung', 'die Verbindung', 'der Fahrplan', 'die Haltestelle', 'die Zimmernummer', 'die Reservierung',
    'die Bestätigung', 'die Zuständigkeit', 'sich erkundigen', 'nachfragen', 'mitteilen', 'erklären', 'bestätigen',
    'überprüfen', 'herausfinden', 'empfehlen', 'sich wenden an', 'Auskunft geben',
  ],
  216: [
    'das Lebensziel', 'der Vorsatz', 'die Gewohnheit', 'die Fähigkeit', 'die Chance', 'die Absicht', 'die Motivation',
    'die Geduld', 'die Disziplin', 'die Selbstständigkeit', 'die Herausforderung', 'der Fortschritt', 'der Rückschritt',
    'die Entscheidung', 'der Versuch', 'versuchen', 'beabsichtigen', 'vorhaben', 'aufhören', 'anfangen', 'vermeiden',
    'vergessen', 'schaffen', 'sich bemühen', 'sich entscheiden',
  ],
  217: [
    'die Konsequenz', 'die Auswirkung', 'der Vorteil', 'der Nachteil', 'der Schaden', 'der Nutzen', 'die Ursache', 'die Folge',
    'die Maßnahme', 'die Lösung', 'das Ergebnis', 'der Verbrauch', 'die Rechnung', 'die Kosten', 'der Preis', 'beeinflussen',
    'führen zu', 'entstehen', 'sich ergeben', 'verhindern', 'reduzieren', 'erhöhen', 'senken', 'verursachen', 'profitieren',
  ],
  218: [
    'das Aussehen', 'die Augenfarbe', 'die Haarfarbe', 'die Körpergröße', 'die Figur', 'das Gesicht', 'die Stirn', 'die Wange',
    'das Kinn', 'die Augenbraue', 'die Wimper', 'der Bart', 'der Schnurrbart', 'die Stimme', 'das Lächeln', 'attraktiv', 'schlank',
    'kräftig', 'blass', 'gebräunt', 'lockig', 'glatzköpfig', 'freundlich', 'höflich', 'selbstbewusst',
  ],
  219: [
    'die Persönlichkeit', 'der Charakter', 'die Eigenschaft', 'die Stärke', 'die Schwäche', 'die Geduld', 'der Humor',
    'die Ehrlichkeit', 'die Zuverlässigkeit', 'die Offenheit', 'die Hilfsbereitschaft', 'die Kreativität', 'die Schüchternheit',
    'die Neugier', 'die Sensibilität', 'zuverlässig', 'ehrlich', 'geduldig', 'neugierig', 'schüchtern', 'großzügig',
    'aufmerksam', 'ehrgeizig', 'tolerant', 'empfindlich',
  ],
  220: [
    'die Tapferkeit', 'die Höflichkeit', 'die Pünktlichkeit', 'die Freundlichkeit', 'die Selbstsicherheit', 'die Bescheidenheit',
    'die Großzügigkeit', 'die Faulheit', 'die Ordnung', 'die Unordnung', 'die Sauberkeit', 'die Genauigkeit', 'die Flexibilität',
    'die Aktivität', 'die Kreativität', 'mutig', 'vorsichtig', 'fleißig', 'ordentlich', 'chaotisch', 'sparsam', 'großzügig',
    'aktiv', 'passiv', 'verantwortungsbewusst',
  ],
}

describe('A2 curriculum vocabulary Units 11–20', () => {
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

    expect(Object.values(sourceEntries).reduce((sum, entries) => sum + entries.length, 0)).toBe(250)
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

  it('keeps source repetitions across Units and marks plural-only Kosten correctly', () => {
    expect(A2_VOCABULARY.filter(item => item.de === 'Ursache' && [211, 217].includes(item.unit))).toHaveLength(2)
    expect(A2_VOCABULARY.filter(item => item.de === 'Möglichkeit' && [212, 213].includes(item.unit))).toHaveLength(2)
    expect(A2_VOCABULARY.filter(item => item.de === 'Information' && [212, 215].includes(item.unit))).toHaveLength(2)
    expect(A2_VOCABULARY.find(item => item.id === 'v217-14')).toMatchObject({
      pos: 'noun',
      article: 'die',
      plural: 'Kosten',
      pluralOnly: true,
    })
  })
})
