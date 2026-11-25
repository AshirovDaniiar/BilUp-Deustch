// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { lemmaKeys } from '../../scripts/content-validate/b1/lemma'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_V2_VOCABULARY } from '../../src/data/b1/v2-vocabulary-units-01-10'
import type { VocabularyItem } from '../../src/data/types'

const SOURCE: Record<number, string[]> = {
  301: [
    'der Vorfall', 'der Augenblick', 'der Zwischenfall', 'die Begebenheit', 'die Hauptfigur', 'der Erzähler', 'die Erzählerin',
    'die Handlung', 'der Abschnitt', 'das Kapitel', 'die Szene', 'der Ablauf', 'berichten', 'schildern', 'beschreiben', 'auftauchen',
    'erschrecken', 'erschöpfen', 'gelingen', 'misslingen', 'geschehen', 'die Zielsetzung', 'die Durchführung', 'die Betrachtung',
    'die Einschätzung',
  ],
  302: [
    'der Vorlauf', 'die Vorgeschichte', 'die Vorbereitungsphase', 'der Ausgangspunkt', 'die Zwischenzeit', 'der Vorabend', 'die Vorwoche',
    'der Vorbesitzer', 'die Vorentscheidung', 'die Vorinformation', 'der Rückblick', 'die Rückkehr', 'der Ablaufplan', 'die Vorarbeit',
    'die Vorbedingung', 'vorbereiten', 'vorhersehen', 'nachholen', 'nachweisen', 'zurückliegen', 'vorausgehen', 'zurücklassen', 'verpassen',
    'verzögern', 'abschließen',
  ],
  303: [
    'der Zeitabschnitt', 'der Zeitraum', 'der Lebensabschnitt', 'die Zeitspanne', 'der Zeitplan', 'der Zeitrahmen', 'die Entwicklungslinie',
    'der Ausblick', 'die Veränderungsrate', 'andauern', 'fortsetzen', 'ablaufen', 'vergehen', 'bevorstehen', 'zurückblicken',
    'vorausschauen', 'fortschreiten', 'sich entwickeln', 'die Umsetzung', 'die Verknüpfung', 'die Wahrnehmung', 'die Darstellung',
    'verdeutlichen', 'einschätzen', 'verdecken',
  ],
  304: [
    'die Prognose', 'die Vorhersage', 'die Annahme', 'die Tendenz', 'die Zukunftsforschung', 'der Klimawandel', 'die Digitalisierung',
    'die Automatisierung', 'die künstliche Intelligenz', 'die Energieversorgung', 'die Mobilität', 'die Bevölkerungsentwicklung',
    'die Arbeitswelt', 'prognostizieren', 'vorhersagen', 'annehmen', 'vermutlich', 'voraussichtlich', 'wahrscheinlich', 'möglicherweise',
    'langfristig', 'kurzfristig', 'erfordern', 'verfügen', 'umsetzen',
  ],
  305: [
    'die Auseinandersetzung', 'die Rücksicht', 'die Vereinbarkeit', 'die Abhängigkeit', 'die Beteiligung', 'die Anerkennung',
    'die Kritikfähigkeit', 'die Enttäuschung', 'die Erwartungshaltung', 'die Verabredung', 'die Verständigung', 'der Konflikt',
    'die Annäherung', 'sich auseinandersetzen', 'sich verlassen', 'sich beziehen', 'sich einigen', 'sich gewöhnen', 'sich entschließen',
    'sich beschränken', 'grundlegend', 'erheblich', 'allmählich', 'überwiegend', 'hinsichtlich',
  ],
  306: [
    'die Anwendung', 'die Kenntnis', 'die Verfügung', 'Anwendung finden', 'Verantwortung übernehmen', 'eine Entscheidung treffen',
    'in Betracht ziehen', 'zur Verfügung stehen', 'in Frage kommen', 'Kritik üben', 'Kenntnis nehmen', 'Maßnahmen ergreifen',
    'Einfluss nehmen', 'folglich', 'die Aufgabenteilung', 'die Arbeitsleistung', 'die Arbeitsbedingung', 'die Arbeitsbelastung',
    'die Entscheidungsgrundlage', 'die Dienstleistung', 'die Arbeitsanweisung', 'die Fristverlängerung', 'durchführen', 'gewährleisten',
    'die Sachkenntnis',
  ],
  307: [
    'die Vorbereitungszeit', 'die Nachbereitung', 'der Arbeitsbeginn', 'der Dienstschluss', 'die Übergabe', 'die Abreise', 'die Ankunft',
    'die Zwischenstation', 'die Wartezeit', 'die Frist', 'der Zeitbedarf', 'der Anschluss', 'nachbereiten', 'abschicken', 'einreichen',
    'übergeben', 'abreisen', 'fortfahren', 'erledigen', 'die Vorlaufzeit', 'die Abgabefrist', 'der Abgabetermin', 'die Dienstreise',
    'die Dienstübergabe', 'die Anreise',
  ],
  308: [
    'die Belastbarkeit', 'die Widerstandskraft', 'die Niederlage', 'der Rückschlag', 'die Unsicherheit', 'die Benachteiligung',
    'die Überforderung', 'die Beharrlichkeit', 'der Durchhaltewille', 'die Entschlossenheit', 'die Widerstandsfähigkeit',
    'die Belastungsgrenze', 'durchhalten', 'bewältigen', 'überwinden', 'allerdings', 'gleichwohl', 'standhalten', 'scheitern',
    'sich behaupten', 'die Krisensituation', 'die Bewältigung', 'die Notlage', 'die Überwindung', 'die Entbehrung',
  ],
  309: [
    'die Doppelbelastung', 'die Nebenbeschäftigung', 'die Hauptaufgabe', 'die Nebenaufgabe', 'die Schichtarbeit', 'der Arbeitsvorgang',
    'die Betreuung', 'die Beaufsichtigung', 'die Koordination', 'die Gleichzeitigkeit', 'die Unterbrechung', 'die Konzentration',
    'die Ablenkung', 'die Arbeitsphase', 'die Freizeitphase', 'parallel', 'währenddessen', 'unterdessen', 'begleiten',
    'beaufsichtigen', 'koordinieren', 'konzentrieren', 'die Arbeitsunterbrechung', 'die Betreuungskraft', 'die Pflegearbeit',
  ],
  310: [
    'der Wendepunkt', 'die Umstellung', 'die Eingewöhnung', 'die Neuorientierung', 'der Neuanfang', 'die Übergangsphase',
    'der Lebenswandel', 'die Anpassung', 'der Zustand', 'die Stabilität', 'die Verbesserung', 'sich einleben', 'sich umstellen',
    'sich anpassen', 'fortbestehen', 'sich festigen', 'sich verschlechtern', 'die Lebensphase', 'der Neubeginn',
    'die Lebensumstellung', 'die Eingliederung', 'die Veränderungsbereitschaft', 'die Gewöhnungsphase', 'die Übergangszeit', 'der Umbruch',
  ],
}

const sourceHeadword = (item: VocabularyItem) => `${item.article ? `${item.article} ` : ''}${item.de}`
const itemsOf = (unit: number) => B1_V2_VOCABULARY.filter(item => item.unit === unit)

describe('B1 curriculum-v2 vocabulary Units 01–10', () => {
  it('matches the 250 German source entries in the original order and unit assignments', () => {
    expect(Object.keys(SOURCE).map(Number)).toEqual([301, 302, 303, 304, 305, 306, 307, 308, 309, 310])
    for (const [unitText, expected] of Object.entries(SOURCE)) {
      const unit = Number(unitText)
      expect(itemsOf(unit), `unit ${unit}`).toHaveLength(25)
      expect(itemsOf(unit).map(sourceHeadword), `unit ${unit}`).toEqual(expected)
    }
    expect(B1_V2_VOCABULARY).toHaveLength(250)
    expect(B1_CONTENT.vocabulary.filter(item => item.unit >= 301 && item.unit <= 310)).toEqual(B1_V2_VOCABULARY)
  })

  it('uses stable, unique ids and complete localized vocabulary fields with valid parts of speech', () => {
    expect(new Set(B1_CONTENT.vocabulary.map(item => item.id)).size).toBe(B1_CONTENT.vocabulary.length)
    for (const [unitText, expected] of Object.entries(SOURCE)) {
      const unit = Number(unitText)
      const entries = itemsOf(unit)
      expect(entries.map(item => item.id)).toEqual(expected.map((_, index) => `v${unit}-${index + 1}`))
      expect(new Set(entries.flatMap(item => lemmaKeys(item.de))).size).toBe(entries.length)
      for (const item of entries) {
        expect(item.de.trim()).not.toBe('')
        expect(item.ru.trim()).not.toBe('')
        expect(item.ky.trim()).not.toBe('')
        expect(item.example.trim()).not.toBe('')
        expect(item.exampleRu.trim()).not.toBe('')
        expect(item.exampleKy?.trim()).not.toBe('')
        expect(item.ky).not.toBe(item.ru)
        expect(item.exampleKy).not.toBe(item.exampleRu)
        expect(item.pos).toMatch(/^(noun|verb|adj|phrase|other)$/)
        if (item.pos === 'noun') expect(item.article).toMatch(/^(der|die|das)$/)
        else expect(item.article).toBeUndefined()
      }
    }
  })

  it('keeps the Russian gloss of Rückschlag fully Russian', () => {
    const item = itemsOf(308).find(entry => entry.id === 'v308-4')
    expect(item, 'v308-4').toBeDefined()
    expect(item!.de).toBe('Rückschlag')
    expect(item!.ru).toBe('неудача, шаг назад')
    expect(item!.ru, 'no English word in the Russian gloss').not.toMatch(/[A-Za-z]/)
  })

  it('keeps the Phase 5B.2A Russian and Kyrgyz corrections', () => {
    const byId = new Map(B1_V2_VOCABULARY.map(item => [item.id, item]))
    expect(byId.get('v302-20')?.de).toBe('zurückliegen')
    expect(byId.get('v302-20')?.ru).toBe('быть в прошлом, оставаться позади')
    expect(byId.get('v304-4')?.ky).toBe('тенденция, умтулуу')
    expect(byId.get('v304-18')?.ky).toBe('болжолу, күтүлүүдө')
  })

  it('keeps the Phase 5B.2B duplicate-example correction', () => {
    const byId = new Map(B1_V2_VOCABULARY.map(item => [item.id, item]))
    const v307 = byId.get('v307-18')
    const v309 = byId.get('v309-11')
    expect(v309?.exampleRu).toBe('После короткой паузы мы снова приступили к работе.')
    expect(v309?.exampleKy).toBe('Кыска үзгүлтүктөн кийин кайра иштей баштадык.')
    expect(v309?.exampleRu).not.toBe(v307?.exampleRu)
    expect(v309?.exampleKy).not.toBe(v307?.exampleKy)
  })

  it('keeps related-word links inside the same unit and enforces the existing B1 duplicate rule', () => {
    const byId = new Map(B1_V2_VOCABULARY.map(item => [item.id, item]))
    for (const item of B1_V2_VOCABULARY)
      for (const id of item.related) expect(byId.get(id)?.unit, `${item.id} → ${id}`).toBe(item.unit)

    const bundle = fullBundle()
    const duplicate = { ...itemsOf(301)[0], id: 'v301-26' }
    const issues = validateContent({ ...bundle, vocabulary: [...bundle.vocabulary, duplicate] })
    expect(issues.some(issue => issue.rule === 'b1-vocab-duplicate-in-level' && issue.where === 'vocabulary:v301-26')).toBe(true)
  })
})
