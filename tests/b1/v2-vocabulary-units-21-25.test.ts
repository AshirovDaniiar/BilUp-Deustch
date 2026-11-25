// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { lemmaKeys } from '../../scripts/content-validate/b1/lemma'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_V2_VOCABULARY } from '../../src/data/b1/v2-vocabulary-units-01-10'
import { B1_V2_VOCABULARY_11_20 } from '../../src/data/b1/v2-vocabulary-units-11-20'
import { B1_V2_VOCABULARY_21_25 } from '../../src/data/b1/v2-vocabulary-units-21-25'
import type { VocabularyItem } from '../../src/data/types'

const SOURCE: Record<number, string[]> = {
  321: [
    'die Wunschvorstellung', 'die Lebensentscheidung', 'die Auswanderung', 'die berufliche Neuorientierung', 'die Lebensplanung',
    'die Erfüllung', 'die Vorstellungskraft', 'die Wunschliste', 'die Traumwohnung', 'sich wünschen', 'sich erträumen',
    'vorziehen', 'wagen', 'ausprobieren', 'bedauern', 'die Lebensalternative', 'der Herzenswunsch', 'die Selbstbestimmung',
    'die Entscheidungsfreiheit', 'die Entfaltung', 'die Zukunftsperspektive', 'sich sehnen', 'sich ausmalen', 'sich trauen',
    'sich verwirklichen',
  ],
  322: [
    'der Ratschlaggeber', 'die Beratungsstelle', 'die Handlungsmöglichkeit', 'die Vorsichtsmaßnahme', 'die Beratung',
    'abraten', 'raten', 'warnen', 'beraten', 'überdenken', 'vorschlagen', 'die Lebensberatung', 'die Konfliktberatung',
    'die Handlungsoption', 'die Folgenabschätzung', 'die Risikobewertung', 'die Problemlösung', 'die Entscheidungsfindung',
    'die Interessenlage', 'die Hilfestellung', 'die Verhaltensweise', 'in Erwägung ziehen', 'in Betracht kommen',
    'davon abraten', 'nahelegen',
  ],
  323: [
    'die Aussage', 'die Äußerung', 'die Stellungnahme', 'die Pressemitteilung', 'der Sprecher', 'die Sprecherin',
    'der Augenzeuge', 'die Augenzeugin', 'die Zeugenaussage', 'das Zitat', 'die Ankündigung', 'äußern', 'ankündigen',
    'bestreiten', 'zugeben', 'zitieren', 'die Wortmeldung', 'die Nachfrage', 'die Gegendarstellung', 'die Presseerklärung',
    'die Zurückweisung', 'wiederholen', 'präzisieren', 'einräumen', 'verneinen',
  ],
  324: [
    'die Nachrichtensendung', 'der Nachrichtensprecher', 'die Nachrichtensprecherin', 'die Meldung', 'die Presse',
    'die Redaktion', 'die Journalistin', 'die Presseagentur', 'die Schlagzeile', 'der Kommentar', 'die Pressekonferenz',
    'die Veröffentlichung', 'die Berichterstattung', 'veröffentlichen', 'melden', 'verkünden', 'übermitteln', 'verbreiten',
    'kommentieren', 'wiedergeben', 'dementieren', 'die Nachrichtenquelle', 'die Nachrichtensprache', 'die Liveübertragung',
    'der Nachrichtenwert',
  ],
  325: [
    'die Abstammung', 'die Zugehörigkeit', 'die Eigentümerschaft', 'der Ursprung', 'die Nachkommenschaft',
    'die Verwandtschaft', 'die Erbschaft', 'der Familienzweig', 'die Ahnenreihe', 'das Familienwappen',
    'die Besitzurkunde', 'das Vermögen', 'der Besitzstand', 'abstammen', 'entstammen', 'herrühren', 'zugehören',
    'vererben', 'übertragen', 'enthalten', 'beinhalten', 'die Familiengeschichte', 'die Familienzugehörigkeit',
    'die Abstammungslinie', 'der Familienname',
  ],
}

const sourceHeadword = (item: VocabularyItem) => `${item.article ? `${item.article} ` : ''}${item.de}`
const itemsOf = (unit: number) => B1_V2_VOCABULARY_21_25.filter(item => item.unit === unit)

describe('B1 curriculum-v2 vocabulary Units 21–25', () => {
  it('matches the 125 source entries in order and registers exactly five units', () => {
    expect(Object.keys(SOURCE).map(Number)).toEqual([321, 322, 323, 324, 325])
    expect(B1_V2_VOCABULARY_21_25).toHaveLength(125)
    for (const [unitText, expected] of Object.entries(SOURCE)) {
      const unit = Number(unitText)
      const entries = itemsOf(unit)
      expect(entries, `unit ${unit}`).toHaveLength(25)
      expect(entries.map(sourceHeadword), `unit ${unit}`).toEqual(expected)
    }
    expect(B1_CONTENT.vocabulary.filter(item => item.unit >= 321 && item.unit <= 325)).toEqual(B1_V2_VOCABULARY_21_25)
  })

  it('uses stable, unique IDs and complete localized fields', () => {
    expect(new Set(B1_V2_VOCABULARY_21_25.map(item => item.id)).size).toBe(125)
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
    const byId = new Map(B1_V2_VOCABULARY_21_25.map(item => [item.id, item]))
    for (const item of B1_V2_VOCABULARY_21_25) {
      expect(new Set(item.related).size, item.id).toBe(item.related.length)
      expect(item.related, item.id).not.toContain(item.id)
      for (const id of item.related) expect(byId.get(id)?.unit, `${item.id} → ${id}`).toBe(item.unit)
    }
  })

  it('rejects a same-unit duplicate lemma through the v2 validator rule', () => {
    const bundle = fullBundle()
    const duplicate = { ...itemsOf(321)[0], id: 'v321-26' }
    const issues = validateContent({ ...bundle, vocabulary: [...bundle.vocabulary, duplicate] })
    expect(issues.some(issue => issue.rule === 'b1-vocab-duplicate-in-level' && issue.where === 'vocabulary:v321-26')).toBe(true)
  })

  it('keeps the Phase 5B.2A Russian and Kyrgyz corrections', () => {
    const byId = new Map(B1_V2_VOCABULARY_21_25.map(item => [item.id, item]))
    expect(byId.get('v323-1')?.ru).toBe('высказывание, заявление; показание')
    expect(byId.get('v324-1')?.ky).toBe('жаңылыктар программасы')
    expect(byId.get('v324-1')?.exampleKy).toBe('Жаңылыктар программасы ар күнү кечки сегизде башталат.')
  })

  it('keeps the Phase 5B.2B Russian gloss and example correction', () => {
    const item = B1_V2_VOCABULARY_21_25.find(entry => entry.id === 'v322-3')
    expect(item?.de).toBe('Handlungsmöglichkeit')
    expect(item?.ru).toBe('вариант действий')
    expect(item?.exampleRu).toBe('У нас ещё есть вариант действий: мы можем перенести встречу.')
    expect(item?.ky).toBe('аракет кылуу мүмкүнчүлүгү')
  })

  it('keeps Units 01–20 and the twelve legacy units intact', () => {
    expect(B1_CONTENT.vocabulary.filter(item => item.unit >= 301 && item.unit <= 310)).toEqual(B1_V2_VOCABULARY)
    expect(B1_CONTENT.vocabulary.filter(item => item.unit >= 311 && item.unit <= 320)).toEqual(B1_V2_VOCABULARY_11_20)
    expect(B1_CONTENT.legacyUnits.map(item => item.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.vocabulary.filter(item => item.unit >= 21 && item.unit <= 32)).toHaveLength(480)
  })
})
