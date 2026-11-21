// @vitest-environment node
/**
 * P2 remediation of the final B1 audit (B1_FINAL_AUDIT.md §9 items 5, 6 and 7): (7) option-length bias and the variety of reading question types, (5) the vocabulary-gap classification and the Kyrgyz collision
 * analysis. (Item 6, the PWA banner, is tested in tests/pwa/reserve-space.test.tsx.) Nothing here approves a decision or confirms a translation.
 */
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { lemmaKeys } from '../../scripts/content-validate/b1/lemma'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { KY_GLOSS_COLLISIONS_WITH_A2 } from '../../src/data/b1/glossary'
import { A2_ENTRIES_WITHOUT_KY_EXAMPLE, B1_VOCAB_GAPS, KY_COLLISION_ANALYSIS } from '../../src/data/b1/vocab-review'
import { courseLevel } from '../../src/data/course'

type Q = { q: string; options: string[]; answer: number }
const STMT = 'richtig|falsch|steht nicht im Text'
const isStatement = (q: Q) => q.options.join('|') === STMT
/** the correct option is STRICTLY longer than every wrong one (ties do not count) */
const longest = (q: Q) => q.options.every((o, i) => i === q.answer || o.length < q.options[q.answer].length)
const shortest = (q: Q) => q.options.every((o, i) => i === q.answer || o.length > q.options[q.answer].length)
const readingQs = () => B1_CONTENT.reading.flatMap(r => r.questions.map(q => ({ ...q, unit: r.unit, id: r.id })))
const listeningQs = () => B1_CONTENT.listening.flatMap(l => l.questions.map(q => ({ ...q, unit: l.unit, id: l.id })))

describe('P2-A: the comprehension questions of the readings and listenings are not biased towards the longest option (audit: 62 % and 57 %)', () => {
  it('readings: of the choice questions at most 40 % have the correct option strictly longest (before: 45 of 73 = 62 %)', () => {
    const c = readingQs().filter(q => !isStatement(q))
    expect(c.length).toBeGreaterThan(50)
    expect(c.filter(longest).length / c.length).toBeLessThanOrEqual(0.4)
  })
  it('listenings: at most 40 % (before: 55 of 96 = 57 %)', () => {
    const c = listeningQs()
    expect(c).toHaveLength(96)
    expect(c.filter(longest).length / c.length).toBeLessThanOrEqual(0.4)
  })
  it('the correct option is strictly SHORTEST in at least 8 % of both (length is no cue in either direction)', () => {
    for (const c of [readingQs().filter(q => !isStatement(q)), listeningQs()])
      expect(c.filter(shortest).length / c.length).toBeGreaterThanOrEqual(0.08)
  })
  it('no unit is biased as a whole: in no unit does the correct option win on length in more than 5 of its 8 listening questions or 4 of its choice reading questions', () => {
    for (let u = 21; u <= 32; u++) {
      expect(listeningQs().filter(q => q.unit === u && longest(q)).length, `listening ${u}`).toBeLessThanOrEqual(5)
      expect(readingQs().filter(q => q.unit === u && !isStatement(q) && longest(q)).length, `reading ${u}`).toBeLessThanOrEqual(4)
    }
  })
  it('the lengthened distractors stay wrong: the validator (scope guards, answer-position rule, band rules) still finds 0 errors and 0 warnings; options stay distinct and the answer appears once', () => {
    const is = validateContent(fullBundle())
    expect(is.filter(i => i.severity === 'error' || i.severity === 'warning')).toEqual([])
    for (const q of [...readingQs(), ...listeningQs()]) {
      expect(new Set(q.options).size, q.q).toBe(q.options.length)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(q.options.length)
    }
  })
  it('unit tests and exercises are still not biased when measured strictly (≤ 40 %; unchanged from the P0 correction)', () => {
    const all = B1_CONTENT.finalTests.flatMap(f => f.questions)
    expect(all.filter(q => q.options.every(o => o === q.answer || o.length < q.answer.length)).length / all.length).toBeLessThanOrEqual(0.4)
  })
})

describe('P2-B: the reading question types are varied BEFORE Unit 32 (audit: "vary reading question types before Unit 32")', () => {
  const st = (unit: number) => readingQs().filter(q => q.unit === unit && isStatement(q))
  it('Units 21–25 keep the three-option questions (the statement format is introduced at Unit 26); Units 26–31 carry two statement questions each; Unit 32 keeps its own', () => {
    for (let u = 21; u <= 25; u++) expect(st(u), `unit ${u}`).toHaveLength(0)
    for (let u = 26; u <= 31; u++) expect(st(u), `unit ${u}`).toHaveLength(2)
    expect(st(32).length).toBeGreaterThanOrEqual(4)
  })
  it('every statement question has the fixed options and an "Aussage:" stem; each reading still has 3 questions (4 for Unit 32) and at least one choice question', () => {
    for (const q of readingQs().filter(isStatement)) {
      expect(q.q).toMatch(/^Aussage: /)
      expect(q.options).toEqual(['richtig', 'falsch', 'steht nicht im Text'])
    }
    for (const r of B1_CONTENT.reading.filter(x => x.unit <= 31)) {
      expect(r.questions).toHaveLength(3)
      expect(r.questions.some(q => !isStatement(q))).toBe(true)
    }
  })
  it('the twelve new statements use all three answers equally (4 / 4 / 4) — no answer type dominates', () => {
    const s = B1_CONTENT.reading
      .filter(r => r.unit >= 26 && r.unit <= 31)
      .flatMap(r => r.questions)
      .filter(isStatement)
    expect(s).toHaveLength(12)
    expect([0, 1, 2].map(a => s.filter(q => q.answer === a).length)).toEqual([4, 4, 4])
  })
  it('every new statement is decided by the text: "richtig" and "falsch" are supported or contradicted by a sentence, "steht nicht im Text" is not mentioned at all', () => {
    const t = (id: string) => B1_CONTENT.reading.find(r => r.id === id)!.body.join(' ')
    const key = (id: string, stem: string) => B1_CONTENT.reading.find(r => r.id === id)!.questions.find(q => q.q.startsWith(stem))!
    // richtig
    expect(key('b1-re-26-01', 'Aussage: Jana hält es für ein Gerücht').answer).toBe(0)
    expect(t('b1-re-26-01')).toMatch(/Es heißt, dass die Stadt viel Geld ausgegeben hat\. Das ist nur ein Gerücht/)
    expect(key('b1-re-27-02', 'Aussage: Lena schreibt jeden Sonntag').answer).toBe(0)
    expect(t('b1-re-27-02')).toMatch(/Jeden Sonntag schreibe ich auf, was ich ausgegeben habe/)
    expect(key('b1-re-28-02', 'Aussage: Eine Teilnehmerin plant').answer).toBe(0)
    expect(t('b1-re-28-02')).toMatch(/Ich plane meine Woche genau/)
    expect(key('b1-re-30-01', 'Aussage: Der Verein „Nachbarn helfen Nachbarn“ besteht seit drei Jahren').answer).toBe(0)
    expect(t('b1-re-30-01')).toMatch(/seit drei Jahren den Verein „Nachbarn helfen Nachbarn“/)
    // falsch
    expect(key('b1-re-26-02', 'Aussage: Die Autorin stimmt den Kritikern zu').answer).toBe(1)
    expect(t('b1-re-26-02')).toMatch(/der Film zu langsam; ich finde das nicht/)
    expect(key('b1-re-28-01', 'Aussage: Die Person hat im Auslandsjahr nur Urlaub').answer).toBe(1)
    expect(t('b1-re-28-01')).toMatch(/einen Sprachkurs belegt und abends in einem Café gearbeitet/)
    expect(key('b1-re-29-01', 'Aussage: Aigerim hatte schon vor ihrer Ankunft').answer).toBe(1)
    expect(t('b1-re-29-01')).toMatch(/Nachdem ich angekommen war, habe ich zuerst eine Wohnung gesucht/)
    expect(key('b1-re-30-02', 'Aussage: Der Hof hinter dem Gemeindehaus gehört dem Verein').answer).toBe(1)
    expect(t('b1-re-30-02')).toMatch(/Der Hof gehört der Stadt/)
    // steht nicht im Text
    expect(key('b1-re-27-01', 'Aussage: Paul Weiß hat dem Händler schon vorher').answer).toBe(2)
    expect(t('b1-re-27-01')).not.toMatch(/vorher|schon einmal|früher geschrieben/)
    expect(key('b1-re-29-02', 'Aussage: Das Hotel Seeblick hat einen eigenen Parkplatz').answer).toBe(2)
    expect(t('b1-re-29-02')).not.toMatch(/Parkplatz/)
    expect(key('b1-re-31-01', 'Aussage: Herr Kaya hat seinen Antrag online gestellt').answer).toBe(2)
    expect(t('b1-re-31-01')).not.toMatch(/online/i)
    expect(key('b1-re-31-02', 'Aussage: Frau Okan hat ihren Vertrag online abgeschlossen').answer).toBe(2)
    expect(t('b1-re-31-02')).not.toMatch(/online/i)
  })
})

describe('P2-C: the vocabulary-gap register CLASSIFIES, it adds nothing (audit: Medien, Grund, Folge, Wunsch, Zukunft, Gefühl …)', () => {
  const b = fullBundle()
  const lemmas = new Set(b.vocabulary.flatMap(v => lemmaKeys(v.de)))
  it('no vocabulary was added or removed: still exactly 40 words per unit, 480 in B1, none of the registered words is a headword', () => {
    expect(B1_CONTENT.vocabulary).toHaveLength(480)
    for (let u = 21; u <= 32; u++)
      expect(
        B1_CONTENT.vocabulary.filter(v => v.unit === u),
        `unit ${u}`,
      ).toHaveLength(40)
    for (const g of B1_VOCAB_GAPS)
      expect(
        lemmaKeys(g.word).some(k => lemmas.has(k)),
        g.word,
      ).toBe(false)
  })
  it('the six ESSENTIAL thematic words are exactly Medien, Grund, Folge, Wunsch, Zukunft and Gefühl, each tied to the unit whose topic needs it; everything is pending the OWNER (no entry is decided)', () => {
    const ess = B1_VOCAB_GAPS.filter(g => g.category === 'essential-thematic')
    expect(ess.map(g => g.word)).toEqual(['Medien', 'Grund', 'Folge', 'Wunsch', 'Zukunft', 'Gefühl'])
    expect(ess.map(g => g.topicUnit)).toEqual([26, 22, 30, 27, 28, 25])
    for (const g of B1_VOCAB_GAPS) expect(g.status).toBe('pending-owner')
  })
  it('the four categories are distinguished: essential, useful-receptive (R), optional (not recommended) and out of scope by design (law, politics, religion)', () => {
    const by = (c: string) => B1_VOCAB_GAPS.filter(g => g.category === c).map(g => g.word)
    expect(by('useful-receptive')).toEqual(['Ursache', 'Chance', 'Vergleich', 'Freiwillige'])
    expect(by('out-of-scope-by-design')).toEqual(expect.arrayContaining(['Gesetz', 'Politik', 'Regierung', 'Wirtschaft', 'Religion']))
    for (const g of B1_VOCAB_GAPS.filter(x => x.category === 'useful-receptive' || x.category === 'optional')) expect(g.proposed).toBe('R')
    for (const g of B1_VOCAB_GAPS.filter(x => x.category === 'out-of-scope-by-design')) expect(g.proposed).toBe('-')
  })
  it('`seenIn` is true: each listed text really contains the word, and a word with an empty list occurs in NO reading, listening or vocabulary example (checked now)', () => {
    const pools: [string, string][] = [
      ...B1_CONTENT.reading.map(r => [r.id, r.body.join(' ')] as [string, string]),
      ...B1_CONTENT.listening.map(l => [l.id, l.lines.map(x => x.text).join(' ')] as [string, string]),
      ...B1_CONTENT.vocabulary.map(v => [v.id, v.example] as [string, string]),
    ]
    const forms: Record<string, string[]> = {
      Grund: ['Grund', 'Gründe'],
      Folge: ['Folge', 'Folgen'],
      Wunsch: ['Wunsch', 'Wünsche'],
      Gefühl: ['Gefühl', 'Gefühle'],
      Chance: ['Chance', 'Chancen'],
      Freiwillige: ['Freiwillige', 'Freiwilligen'],
      Wahl: ['Wahl', 'Wahlen'],
    }
    for (const g of B1_VOCAB_GAPS) {
      const f = forms[g.word] ?? [g.word]
      const hits = pools.filter(([, t]) => f.some(w => new RegExp(`(^|[^\\p{L}])${w}(?![\\p{L}])`, 'u').test(t))).map(([id]) => id)
      expect(hits.sort(), g.word).toEqual([...g.seenIn].sort())
    }
  })
})

describe('P2-D: the six Kyrgyz collisions are ANALYSED, not changed', () => {
  it('every collision of the P1 register has exactly one analysis with a cause, a verdict on whether the distinction can be made, and a concrete question for a native reviewer', () => {
    expect(KY_COLLISION_ANALYSIS.map(a => a.id).sort()).toEqual(KY_GLOSS_COLLISIONS_WITH_A2.map(c => c.id).sort())
    for (const a of KY_COLLISION_ANALYSIS) {
      expect(a.status).toBe('native-review-pending')
      expect(a.question.length).toBeGreaterThan(60)
      expect(a.source).toMatch(/^(same-root-derivation|near-synonyms|a2-gloss-doubtful|one-kyrgyz-verb-for-two-german-verbs)$/)
    }
    expect(KY_COLLISION_ANALYSIS.filter(a => a.source === 'a2-gloss-doubtful').map(a => a.id)).toEqual(['v26-10', 'v27-23'])
  })
  it('the Kyrgyz glosses of all eleven entries are UNCHANGED (the P1 test pins them); the A2 side was not touched', () => {
    const v = new Map(fullBundle().vocabulary.map(x => [x.id, x]))
    expect(v.get('v26-10')!.ky).toBe('жарнама')
    expect(v.get('v13-1')!.ky).toBe('жарнама')
    expect(v.get('v27-23')!.ky).toBe('арзандатуу')
    expect(v.get('v9-13')!.ky).toBe('арзандатуу')
    expect(v.get('v27-33')!.ky).toBe('алмаштыруу')
    expect(v.get('v9-6')!.ky).toBe('алмаштыруу')
  })
  it('an observation outside B1 is recorded: the A2 entries Angebot and umtauschen have no Kyrgyz example sentence', () => {
    const v = new Map(fullBundle().vocabulary.map(x => [x.id, x]))
    for (const id of A2_ENTRIES_WITHOUT_KY_EXAMPLE) expect(v.get(id)!.exampleKy, id).toBeUndefined()
  })
  it('B1 stays planned with no released locale', () => {
    expect(courseLevel('B1')).toMatchObject({ status: 'beta', releasedLocales: ['ru', 'ky'] })
  })
})
