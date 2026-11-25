// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { lemmaKeys } from '../../scripts/content-validate/b1/lemma'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_V2_VOCABULARY } from '../../src/data/b1/v2-vocabulary-units-01-10'
import { B1_V2_VOCABULARY_11_20 } from '../../src/data/b1/v2-vocabulary-units-11-20'
import { B1_V2_VOCABULARY_21_25 } from '../../src/data/b1/v2-vocabulary-units-21-25'
import { B1_V2_VOCABULARY_26_30 } from '../../src/data/b1/v2-vocabulary-units-26-30'
import { B1_V2_VOCABULARY_31_36 } from '../../src/data/b1/v2-vocabulary-units-31-36'
import type { VocabularyItem } from '../../src/data/types'

const SOURCE: Record<number, string[]> = {
  331: [
    'der Schriftverkehr', 'die Geschäftssprache', 'der Geschäftsbrief', 'die Anfrage', 'das Anschreiben',
    'die Bekanntmachung', 'die Geschäftsordnung', 'das Protokoll', 'der Antrag', 'die Korrespondenz',
    'die Formulierung', 'formulieren', 'beantragen', 'genehmigen', 'vereinbaren', 'veranlassen', 'vermerken',
    'der Behördenbrief', 'die Geschäftskorrespondenz', 'die Formvorschrift', 'die Geschäftsbedingung',
    'die Empfangsbestätigung', 'die Eingangsbestätigung', 'die Sachbearbeitung', 'die Antragsstellung',
  ],
  332: [
    'der Widerspruch', 'die Gegensätzlichkeit', 'die Gegenposition', 'die Abweichung', 'die Diskrepanz',
    'die Unstimmigkeit', 'der Kontrast', 'die Widerrede', 'die Gegenleistung', 'obgleich', 'obschon',
    'wenngleich', 'nichtsdestotrotz', 'die Unvereinbarkeit', 'die Gegenmeinung', 'die Ausnahmeregelung',
    'die Gegenwirkung', 'die Unwahrscheinlichkeit', 'die Überraschungswirkung', 'bewerten', 'festlegen',
    'veranschaulichen', 'erläutern', 'begründen', 'unterscheiden',
  ],
  333: [
    'die Folgeerscheinung', 'die Begleiterscheinung', 'das Resultat', 'der Effekt', 'die Nebenwirkung',
    'die Tragweite', 'die Konsequenzkette', 'die Folgefrage', 'daher', 'demzufolge', 'dermaßen', 'derart',
    'sodass', 'weshalb', 'die Begleitwirkung', 'die Wirkungskette', 'die Ergebnislage', 'die Schadensfolge',
    'zuordnen', 'einordnen', 'zusammenfassen', 'ergänzen', 'erweitern', 'sicherstellen', 'voraussetzen',
  ],
  334: [
    'der Verwendungszweck', 'die Absichtserklärung', 'der Förderantrag', 'die Bewerbungsvoraussetzung',
    'die Zielvereinbarung', 'der Bildungsweg', 'die Berufsausbildung', 'die Qualifikation',
    'die Zusatzqualifikation', 'qualifizieren', 'ausbilden', 'weiterbilden', 'die Fördermöglichkeit',
    'die Berufschance', 'die Ausbildungsstelle', 'der Förderplan', 'die Lernförderung', 'die Bildungsmaßnahme',
    'die Qualifizierung', 'die Weiterbildungsmöglichkeit', 'die Karriereplanung', 'die Zukunftsplanung',
    'zweckorientiert', 'zielbewusst', 'förderlich',
  ],
  335: [
    'die Umweltbelastung', 'die Luftverschmutzung', 'die Abfallentsorgung', 'die Mülltrennung',
    'die Artenvielfalt', 'der Klimaschutz', 'die Energiewende', 'der Ressourcenverbrauch', 'die Umweltpolitik',
    'die Bevölkerung', 'die Ungleichheit', 'die Chancengleichheit', 'die Integration', 'der gesellschaftliche Wandel',
    'angesichts', 'anlässlich', 'infolge', 'mangels', 'mithilfe', 'seitens', 'zugunsten', 'zulasten',
    'die Umweltveränderung', 'die Umweltzerstörung', 'die Ressourcenknappheit',
  ],
  336: [
    'die Relevanz', 'worauf', 'woran', 'womit', 'wodurch', 'worüber', 'wovon', 'woraus', 'wofür', 'wogegen',
    'wobei', 'die Bezugnahme', 'die Ausrichtung', 'beeinträchtigen', 'bewirken', 'demgegenüber', 'weitgehend',
    'ausführlich', 'eindeutig', 'nachvollziehbar', 'angemessen', 'verbindlich', 'verfügbar', 'erforderlich',
    'geeignet',
  ],
}

const sourceHeadword = (item: VocabularyItem) => `${item.article ? `${item.article} ` : ''}${item.de}`
const itemsOf = (unit: number) => B1_V2_VOCABULARY_31_36.filter(item => item.unit === unit)

describe('B1 curriculum-v2 vocabulary Units 31–36', () => {
  it('matches the 150 source entries in order and registers exactly six units', () => {
    expect(Object.keys(SOURCE).map(Number)).toEqual([331, 332, 333, 334, 335, 336])
    expect(B1_V2_VOCABULARY_31_36).toHaveLength(150)
    for (const [unitText, expected] of Object.entries(SOURCE)) {
      const unit = Number(unitText)
      const entries = itemsOf(unit)
      expect(entries, `unit ${unit}`).toHaveLength(25)
      expect(entries.map(sourceHeadword), `unit ${unit}`).toEqual(expected)
    }
    expect(B1_CONTENT.vocabulary.filter(item => item.unit >= 331 && item.unit <= 336)).toEqual(B1_V2_VOCABULARY_31_36)
  })

  it('uses stable, unique IDs and complete localized fields', () => {
    expect(new Set(B1_V2_VOCABULARY_31_36.map(item => item.id)).size).toBe(150)
    expect(new Set(B1_CONTENT.vocabulary.map(item => item.id)).size).toBe(B1_CONTENT.vocabulary.length)
    expect(B1_CONTENT.vocabulary).toHaveLength(1380)
    for (const [unitText, expected] of Object.entries(SOURCE)) {
      const unit = Number(unitText)
      const entries = itemsOf(unit)
      expect(entries.map(item => item.id)).toEqual(expected.map((_, index) => `v${unit}-${index + 1}`))
      const seen = new Map<string, string>()
      for (const item of entries) {
        for (const key of lemmaKeys(item.de)) {
          expect(seen.get(key) ?? item.id, `unit ${unit} repeats lemma "${key}"`).toBe(item.id)
          seen.set(key, item.id)
        }
      }
      for (const item of entries) {
        expect(item.unit, item.id).toBe(unit)
        expect(item.de.trim(), item.id).not.toBe('')
        expect(item.ru.trim(), item.id).not.toBe('')
        expect(item.ky.trim(), item.id).not.toBe('')
        expect(item.example.trim(), item.id).not.toBe('')
        expect(item.exampleRu.trim(), item.id).not.toBe('')
        expect(item.exampleKy?.trim(), item.id).not.toBe('')
        expect(item.ky, item.id).not.toBe(item.ru)
        expect(item.exampleKy, item.id).not.toBe(item.exampleRu)
        expect(item.pos, item.id).toMatch(/^(noun|verb|adj|phrase|other)$/)
        if (item.pos === 'noun') expect(item.article, item.id).toMatch(/^(der|die|das)$/)
        else expect(item.article, item.id).toBeUndefined()
        if (item.plural !== undefined) expect(item.plural.trim(), item.id).not.toBe('')
      }
    }
  })

  it('has no duplicate examples inside the new batch', () => {
    const examples = B1_V2_VOCABULARY_31_36.map(item => item.example)
    expect(new Set(examples).size).toBe(examples.length)
  })

  it('keeps related links valid, unique and inside the same unit', () => {
    const byId = new Map(B1_V2_VOCABULARY_31_36.map(item => [item.id, item]))
    for (const item of B1_V2_VOCABULARY_31_36) {
      expect(new Set(item.related).size, item.id).toBe(item.related.length)
      expect(item.related, item.id).not.toContain(item.id)
      for (const id of item.related) expect(byId.get(id)?.unit, `${item.id} → ${id}`).toBe(item.unit)
    }
  })

  it('rejects a same-unit duplicate lemma through the v2 validator rule', () => {
    const bundle = fullBundle()
    const duplicate = { ...itemsOf(331)[0], id: 'v331-26' }
    const issues = validateContent({ ...bundle, vocabulary: [...bundle.vocabulary, duplicate] })
    expect(issues.some(issue => issue.rule === 'b1-vocab-duplicate-in-level' && issue.where === 'vocabulary:v331-26')).toBe(true)
  })

  it('keeps the Phase 5B.2A Kyrgyz example correction', () => {
    const item = B1_V2_VOCABULARY_31_36.find(entry => entry.id === 'v332-10')
    expect(item?.exampleKy).toBe('Жамгыр жааса да, майрам бакчада өттү.')
    expect(item?.exampleKy).not.toContain('балакча')
  })

  it('keeps the Phase 5B.2B Kyrgyz gloss corrections', () => {
    const byId = new Map(B1_V2_VOCABULARY_31_36.map(item => [item.id, item]))
    expect(byId.get('v332-18')?.ky).toBe('болушунун кыйындыгы')
    expect(byId.get('v335-16')?.ky).toBe('байланыштуу')
  })

  it('keeps Units 01–30 and the twelve legacy units intact', () => {
    expect(B1_CONTENT.vocabulary.filter(item => item.unit >= 301 && item.unit <= 310)).toEqual(B1_V2_VOCABULARY)
    expect(B1_CONTENT.vocabulary.filter(item => item.unit >= 311 && item.unit <= 320)).toEqual(B1_V2_VOCABULARY_11_20)
    expect(B1_CONTENT.vocabulary.filter(item => item.unit >= 321 && item.unit <= 325)).toEqual(B1_V2_VOCABULARY_21_25)
    expect(B1_CONTENT.vocabulary.filter(item => item.unit >= 326 && item.unit <= 330)).toEqual(B1_V2_VOCABULARY_26_30)
    expect(B1_CONTENT.legacyUnits.map(item => item.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.vocabulary.filter(item => item.unit >= 21 && item.unit <= 32)).toHaveLength(480)
  })
})
