import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_V2_VOCABULARY_11_20 } from '../../src/data/b1/v2-vocabulary-units-11-20'

const SOURCE: Record<number, string[]> = {
  311: [
    'die Verwirklichung', 'die Bereitschaft', 'die Verpflichtung', 'die Notwendigkeit', 'die Entscheidungskraft',
    'die Selbstdisziplin', 'unterlassen', 'sich weigern', 'gelten', 'scheinen', 'drohen', 'pflegen',
    'die Lernbereitschaft', 'die Eigeninitiative', 'die Zielerreichung', 'die Zielvorgabe', 'der Ehrgeiz',
    'die Selbstmotivation', 'die Leistungsbereitschaft', 'sich vornehmen', 'unternehmen', 'durchsetzen',
    'die Fachkenntnis', 'die Vorgehensweise', 'die Denkweise',
  ],
  312: [
    'der Beweggrund', 'die Zielgruppe', 'der Zweck', 'der Mehrwert', 'die Wirksamkeit', 'die Strategie',
    'der Lösungsweg', 'der Aufwand', 'die Investition', 'die Förderung', 'anstreben', 'bezwecken', 'fördern',
    'erleichtern', 'optimieren', 'einsparen', 'unterstützen', 'die Zielorientierung', 'die Lernstrategie',
    'die Fördermaßnahme', 'der Bildungsabschluss', 'die Berufsperspektive', 'die Arbeitserleichterung',
    'der Zeitgewinn', 'die Kostenersparnis',
  ],
  313: [
    'die Gegenüberstellung', 'die Auswahlmöglichkeit', 'die Bandbreite', 'die Unterscheidung', 'die Präferenz',
    'entweder', 'weder', 'sowohl', 'als auch', 'nicht nur', 'sondern', 'einerseits', 'andererseits', 'teils',
    'die Paarung', 'beziehungsweise', 'die Arbeitsgrundlage', 'die Aussagekraft', 'die Durchsetzung',
    'die Vereinfachung', 'die Veranschaulichung', 'die Beschreibung', 'die Beurteilung', 'die Bewertung',
    'die Untersuchung',
  ],
  314: [
    'die Schlussfolgerung', 'die Begründung', 'die Folgerung', 'die Einordnung', 'die Erläuterung', 'der Einwand',
    'die Widerlegung', 'die Perspektive', 'die Argumentation', 'demnach', 'infolgedessen', 'hingegen',
    'außerdem', 'darüber hinaus', 'somit', 'die Argumentationsweise', 'die Gedankenkette', 'die Beweisführung',
    'die Erklärungskraft', 'die Schlussbemerkung', 'die Einleitung', 'der Hauptteil', 'der Übergang',
    'die Zusammenfassung', 'die Gegenargumentation',
  ],
  315: [
    'der Mentor', 'die Mentorin', 'der Auftraggeber', 'die Auftraggeberin', 'der Geschäftspartner',
    'die Geschäftspartnerin', 'der Vereinsvorsitzende', 'die Vereinsvorsitzende', 'der Ausbilder',
    'die Ausbilderin', 'der Betreuer', 'die Betreuerin', 'der Stifter', 'die Stifterin', 'der Begünstigte',
    'die Begünstigte', 'der Fachmann', 'die Fachfrau', 'der Fachkundige', 'die Fachkundige', 'der Gleichgesinnte',
    'der Fachkollege', 'die Fachkollegin', 'der Auftragnehmer', 'die Auftragnehmerin',
  ],
  316: [
    'der Gesprächsanlass', 'die Gesprächsgrundlage', 'der Bezugspunkt', 'die Grundlage', 'die Angelegenheit',
    'die Sachlage', 'das Thema', 'die Fachrichtung', 'das Fachgebiet', 'die Fragestellung', 'der Schwerpunkt',
    'der Bezug', 'die Wirkung', 'der Anlass', 'die Quelle', 'der Hintergrund', 'die Bezugsperson',
    'der Mitwirkende', 'die Mitwirkende', 'der Fachberater', 'die Fachberaterin', 'der Vermittler',
    'die Vermittlerin', 'der Beteiligte', 'die Beteiligte',
  ],
  317: [
    'das Ereignis', 'das Wichtigste', 'das Wesentliche', 'das Entscheidende', 'das Ungewöhnliche',
    'das Erstaunliche', 'das Wertvolle', 'das Alltägliche', 'der Standort', 'der Treffpunkt', 'der Zufluchtsort',
    'der Geburtsort', 'der Lernort', 'der Rückzugsort', 'der Aufenthaltsort', 'der Ausgangsort', 'der Zielort',
    'der Fundort', 'das Besondere', 'das Gemeinsame', 'das Ungeklärte', 'das Erforderliche',
    'das Unvorhersehbare', 'das Mögliche', 'das Unmögliche',
  ],
  318: [
    'die Herstellung', 'die Verarbeitung', 'die Produktion', 'die Fertigung', 'die Montage', 'die Lieferung',
    'die Qualitätskontrolle', 'der Rohstoff', 'die Zutat', 'das Bauteil', 'die Maschine',
    'die Produktionsstätte', 'das Fließband', 'herstellen', 'verarbeiten', 'fertigen', 'montieren',
    'verpacken', 'liefern', 'prüfen', 'sortieren', 'lagern', 'recyceln', 'der Produktionsschritt',
    'die Produktionskette',
  ],
  319: [
    'die Handarbeit', 'die Heimarbeit', 'die Fabrikarbeit', 'die Werkstatt', 'die Manufaktur', 'der Handwerker',
    'die Handwerkerin', 'der Lehrling', 'die Lehrwerkstatt', 'das Werkzeug', 'die Dampfmaschine',
    'die Schreibmaschine', 'der Webstuhl', 'die Landwirtschaft', 'die Industrialisierung', 'anfertigen',
    'bearbeiten', 'schmieden', 'weben', 'nähen', 'ernten', 'transportieren', 'reparieren', 'bedienen',
    'verrichten',
  ],
  320: [
    'der Wartungszustand', 'die Beschaffenheit', 'die Oberfläche', 'die Ausstattung', 'die Beschädigung',
    'der Verschleiß', 'die Abnutzung', 'die Verfügbarkeit', 'die Zugänglichkeit', 'die Fertigstellung',
    'die Instandhaltung', 'beschädigt', 'abgeschlossen', 'geöffnet', 'geschlossen', 'besetzt', 'reserviert',
    'ausverkauft', 'gereinigt', 'repariert', 'installiert', 'die Betriebsbereitschaft',
    'die Funktionsfähigkeit', 'die Gebrauchstauglichkeit', 'die Einsatzbereitschaft',
  ],
}

describe('B1 curriculum-v2 vocabulary Units 11–20', () => {
  it('matches the authoritative German headwords and order in every source Unit', () => {
    for (const [unitText, expected] of Object.entries(SOURCE)) {
      const unit = Number(unitText)
      const entries = B1_V2_VOCABULARY_11_20.filter(item => item.unit === unit)
      expect(entries, `unit ${unit} count`).toHaveLength(25)
      expect(
        entries.map(item => `${item.article ? `${item.article} ` : ''}${item.de}`),
        `unit ${unit} source order`,
      ).toEqual(expected)
    }
    expect(B1_V2_VOCABULARY_11_20).toHaveLength(250)
  })

  it('registers unique stable IDs, complete localized fields, and valid in-unit related references', () => {
    const ids = B1_V2_VOCABULARY_11_20.map(item => item.id)
    expect(new Set(ids).size).toBe(250)
    for (const [unitText] of Object.entries(SOURCE)) {
      const unit = Number(unitText)
      const items = B1_V2_VOCABULARY_11_20.filter(item => item.unit === unit)
      const localIds = new Set(items.map(item => item.id))
      expect(items.map(item => item.id)).toEqual(Array.from({ length: 25 }, (_, index) => `v${unit}-${index + 1}`))
      for (const item of items) {
        expect(item.ru.trim(), item.id).not.toBe('')
        expect(item.ky.trim(), item.id).not.toBe('')
        expect(item.ky, item.id).not.toBe(item.ru)
        expect(item.example.trim(), item.id).not.toBe('')
        expect(item.exampleRu.trim(), item.id).not.toBe('')
        expect(item.exampleKy?.trim(), item.id).not.toBe('')
        expect(item.exampleKy, item.id).not.toBe(item.exampleRu)
        if (item.pos === 'noun') expect(item.article, item.id).toMatch(/^(der|die|das)$/)
        else expect(item.article, item.id).toBeUndefined()
        expect(item.related.every(id => localIds.has(id)), item.id).toBe(true)
      }
    }
  })

  it('distinguishes gendered noun entries while still rejecting an exact duplicate in the same Unit', () => {
    const bundle = fullBundle()
    const original = B1_V2_VOCABULARY_11_20.find(item => item.id === 'v315-7')!
    const issues = validateContent(bundle)
    expect(issues.filter(issue => issue.rule === 'b1-vocab-duplicate-in-level')).toEqual([])

    const duplicate = { ...original, id: 'v315-26' }
    const withDuplicate = validateContent({ ...bundle, vocabulary: [...bundle.vocabulary, duplicate] })
    expect(
      withDuplicate.some(issue => issue.rule === 'b1-vocab-duplicate-in-level' && issue.where === 'vocabulary:v315-26'),
    ).toBe(true)
  })

  it('uses the correct weak-declension plurals for the nominalized adjectives', () => {
    const expected: Record<string, string> = {
      'v315-7': 'Vereinsvorsitzenden',
      'v315-8': 'Vereinsvorsitzenden',
      'v315-15': 'Begünstigten',
      'v315-16': 'Begünstigten',
      'v315-19': 'Fachkundigen',
      'v315-20': 'Fachkundigen',
      'v315-21': 'Gleichgesinnten',
      'v316-18': 'Mitwirkenden',
      'v316-19': 'Mitwirkenden',
      'v316-24': 'Beteiligten',
      'v316-25': 'Beteiligten',
    }
    for (const [id, plural] of Object.entries(expected)) {
      const item = B1_V2_VOCABULARY_11_20.find(entry => entry.id === id)
      expect(item, id).toBeDefined()
      expect(item!.plural, id).toBe(plural)
    }
  })

  it('keeps the Phase 5B.2A Russian and Kyrgyz corrections', () => {
    const byId = new Map(B1_V2_VOCABULARY_11_20.map(item => [item.id, item]))
    const alsAuch = byId.get('v313-9')
    expect(alsAuch?.example).toBe('Sie spricht sowohl Deutsch als auch Kyrgyzisch.')
    expect(alsAuch?.exampleRu).toBe('Она говорит как по-немецки, так и по-кыргызски.')
    expect(alsAuch?.exampleKy).toBe('Ал немисче да, кыргызча да сүйлөйт.')
    expect(byId.get('v314-20')?.ky).toBe('аяктоочу сөз')
    expect(byId.get('v314-24')?.ky).toBe('кыскача жыйынтык')
    expect(byId.get('v314-24')?.exampleKy).toBe('Кыскача жыйынтыкта эң маанилүү натыйжалар көрсөтүлөт.')
    expect(byId.get('v318-6')?.exampleKy).toBe('Жабдуулар эртең эрте менен жеткирилет.')
    expect(byId.get('v320-1')?.ru).toBe('техническое состояние; состояние обслуживания')
  })

  it('keeps the Phase 5B.2B Russian example correction', () => {
    const item = B1_V2_VOCABULARY_11_20.find(entry => entry.id === 'v311-4')
    expect(item?.de).toBe('Notwendigkeit')
    expect(item?.exampleRu).toBe('Она поняла необходимость лучшего планирования.')
  })

  it('preserves the prior vocabulary and keeps all 1380 B1 entry ids unique', () => {
    expect(B1_CONTENT.vocabulary).toHaveLength(1380)
    expect(new Set(B1_CONTENT.vocabulary.map(item => item.id)).size).toBe(1380)
    for (let unit = 311; unit <= 320; unit++)
      expect(B1_CONTENT.vocabulary.filter(item => item.unit === unit), `unit ${unit}`).toHaveLength(25)
  })
})
