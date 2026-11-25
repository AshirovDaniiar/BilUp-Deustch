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
import type { VocabularyItem } from '../../src/data/types'

const SOURCE: Record<number, string[]> = {
  326: [
    'die Beschichtung', 'die Ausführung', 'die Qualität', 'die Haltbarkeit', 'die Leistungsfähigkeit',
    'die Benutzerfreundlichkeit', 'die Besonderheit', 'die Auffälligkeit', 'robust', 'strapazierfähig',
    'leistungsstark', 'pflegeleicht', 'benutzerfreundlich', 'hochwertig', 'minderwertig', 'präzise',
    'zweckmäßig', 'die Materialqualität', 'die Oberflächenstruktur', 'die Formgebung', 'die Verarbeitungstechnik',
    'die Maßgenauigkeit', 'die Leistungsgrenze', 'die Strapazierfähigkeit', 'die Zweckmäßigkeit',
  ],
  327: [
    'der Bewerber', 'die Bewerberin', 'die Kundin', 'die Expertin', 'der Diplomat', 'die Diplomatin',
    'die Lieferantin', 'der Demonstrant', 'die Demonstrantin', 'die Präsidentin', 'der Musikant',
    'die Musikantin', 'die Biologin', 'der Kandidat', 'die Kandidatin', 'die Praktikantin', 'die Assistentin',
    'die Patientin', 'die Beobachtung', 'die Feststellung', 'die Umgestaltung', 'die Erleichterung',
    'die Entlastung', 'die Berechtigung', 'beurteilen',
  ],
  328: [
    'die Ausstrahlung', 'die Erscheinung', 'die Haltung', 'die Bewegung', 'der Gesichtsausdruck',
    'die Körperhaltung', 'die Atmosphäre', 'die Stimmung', 'die Beleuchtung', 'die Geräuschkulisse',
    'die Menschenmenge', 'das Verhalten', 'faszinierend', 'überzeugend', 'verwirrend', 'beruhigend',
    'erschreckend', 'überraschend', 'gelungen', 'misslungen', 'die Ausführlichkeit', 'die Ausdruckskraft',
    'die Glaubwürdigkeit', 'die Nachdenklichkeit', 'die Lebhaftigkeit',
  ],
  329: [
    'die Satzklammer', 'das Satzglied', 'die Angabe', 'die Betonung', 'die Hervorhebung', 'die Gewichtung',
    'der Informationsschwerpunkt', 'die Aussageabsicht', 'der Empfänger', 'der Absender', 'die Verständlichkeit',
    'die Gliederung', 'zunächst', 'grundsätzlich', 'insbesondere', 'ausdrücklich', 'gegebenenfalls',
    'üblicherweise', 'möglichst', 'vor allem', 'im Allgemeinen', 'die Satzstruktur', 'die Satzstellung',
    'die Informationsverteilung', 'die Satzmelodie',
  ],
  330: [
    'die Abmeldung', 'die Genehmigung', 'die Erweiterung', 'die Verschlechterung', 'die Überprüfung',
    'die Eröffnung', 'die Schließung', 'die Einführung', 'die Abschaffung', 'die Erneuerung', 'die Erhöhung',
    'die Senkung', 'die Bereitstellung', 'die Bewilligung', 'die Bearbeitung', 'die Bescheinigung',
    'die Umwandlung', 'die Umverteilung', 'die Neuregelung', 'die Festlegung', 'die Erfassung', 'die Auswertung',
    'die Abwicklung', 'die Übertragung', 'die Freigabe',
  ],
}

const sourceHeadword = (item: VocabularyItem) => `${item.article ? `${item.article} ` : ''}${item.de}`
const itemsOf = (unit: number) => B1_V2_VOCABULARY_26_30.filter(item => item.unit === unit)

describe('B1 curriculum-v2 vocabulary Units 26–30', () => {
  it('matches the 125 source entries in order and registers exactly five units', () => {
    expect(Object.keys(SOURCE).map(Number)).toEqual([326, 327, 328, 329, 330])
    expect(B1_V2_VOCABULARY_26_30).toHaveLength(125)
    for (const [unitText, expected] of Object.entries(SOURCE)) {
      const unit = Number(unitText)
      const entries = itemsOf(unit)
      expect(entries, `unit ${unit}`).toHaveLength(25)
      expect(entries.map(sourceHeadword), `unit ${unit}`).toEqual(expected)
    }
    expect(B1_CONTENT.vocabulary.filter(item => item.unit >= 326 && item.unit <= 330)).toEqual(B1_V2_VOCABULARY_26_30)
  })

  it('uses stable, unique IDs and complete localized fields', () => {
    expect(new Set(B1_V2_VOCABULARY_26_30.map(item => item.id)).size).toBe(125)
    expect(new Set(B1_CONTENT.vocabulary.map(item => item.id)).size).toBe(B1_CONTENT.vocabulary.length)
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

  it('keeps related links valid, unique and inside the same unit', () => {
    const byId = new Map(B1_V2_VOCABULARY_26_30.map(item => [item.id, item]))
    for (const item of B1_V2_VOCABULARY_26_30) {
      expect(new Set(item.related).size, item.id).toBe(item.related.length)
      expect(item.related, item.id).not.toContain(item.id)
      for (const id of item.related) expect(byId.get(id)?.unit, `${item.id} → ${id}`).toBe(item.unit)
    }
  })

  it('rejects a same-unit duplicate lemma through the v2 validator rule', () => {
    const bundle = fullBundle()
    const duplicate = { ...itemsOf(326)[0], id: 'v326-26' }
    const issues = validateContent({ ...bundle, vocabulary: [...bundle.vocabulary, duplicate] })
    expect(issues.some(issue => issue.rule === 'b1-vocab-duplicate-in-level' && issue.where === 'vocabulary:v326-26')).toBe(true)
  })

  it('keeps the Phase 5B.2A Kyrgyz example correction', () => {
    const item = B1_V2_VOCABULARY_26_30.find(entry => entry.id === 'v326-9')
    expect(item?.exampleKy).toBe('Үстөл бакча үчүн жетишерлик бекем.')
    expect(item?.exampleKy).not.toContain('балакча')
  })

  it('keeps Units 01–25 and the twelve legacy units intact', () => {
    expect(B1_CONTENT.vocabulary.filter(item => item.unit >= 301 && item.unit <= 310)).toEqual(B1_V2_VOCABULARY)
    expect(B1_CONTENT.vocabulary.filter(item => item.unit >= 311 && item.unit <= 320)).toEqual(B1_V2_VOCABULARY_11_20)
    expect(B1_CONTENT.vocabulary.filter(item => item.unit >= 321 && item.unit <= 325)).toEqual(B1_V2_VOCABULARY_21_25)
    expect(B1_CONTENT.legacyUnits.map(item => item.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.vocabulary.filter(item => item.unit >= 21 && item.unit <= 32)).toHaveLength(480)
  })
})
