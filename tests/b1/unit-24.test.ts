// @vitest-environment node
/**
 * B1 Unit 24 — Wohnen, Umzug und Umwelt (Stage 3F). Checks the authored content against the approved curriculum: identity, the two approved concepts
 * (Passiv Präsens, Adjektive ohne Artikel), vocabulary (38–42, nothing already taught), text sizes, productive vs receptive scope (Passiv Perfekt is receptive),
 * scope guard for later units, RU/KY parity, exercise/answer-key correctness, assessment structure, metadata, the opinion micro-task and spaced revision.
 * B1 stays `planned` and invisible; no CEFR approval of any kind is implied (the content is an unreviewed AI-assisted draft).
 */
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { lemmaKeys } from '../../scripts/content-validate/b1/lemma'
import { B1_CURRICULUM } from '../../scripts/content-validate/b1/curriculum'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_META } from '../../src/data/b1/meta'
import { B1_UNIT_PLAN } from '../../src/data/b1/registry'
import { UNIT_24_EXERCISES, UNIT_24_FINAL, UNIT_24_TEST } from '../../src/data/b1/unit24/assessment'
import { UNIT_24_GRAMMAR, UNIT_24_WHY_NOTES } from '../../src/data/b1/unit24/grammar'
import { UNIT_24_LISTENING, UNIT_24_READING, UNIT_24_SPEAKING, UNIT_24_WRITING } from '../../src/data/b1/unit24/texts'
import { UNIT_24 } from '../../src/data/b1/unit24/unit'
import { UNIT_24_VOCABULARY } from '../../src/data/b1/unit24/vocabulary'
import { availableLevels, courseLevel } from '../../src/data/course'
import {
  finalTestOfUnit,
  grammarForUnit,
  registerLevelContent,
  speakingForUnit,
  topicTestOfUnit,
  vocabularyForUnit,
  writingForUnit,
} from '../../src/data/catalog'

const words = (s: string) => s.split(/\s+/).filter(Boolean).length
const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).filter(x => x.trim())
const CONCEPTS = ['b1-passiv-praesens', 'b1-adjektive-ohne-artikel']
const META = B1_META.find(m => m.unit === 24)!
const MAIN = UNIT_24_WRITING[0]
const MICRO = UNIT_24_WRITING[1]

/** every German string of the unit (what a learner reads or hears) */
function germanTexts(): string[] {
  const out: string[] = []
  for (const r of UNIT_24_READING) out.push(...r.body, ...r.questions.flatMap(q => [q.q, ...q.options]))
  for (const l of UNIT_24_LISTENING) out.push(...l.lines.map(x => x.text), ...l.questions.flatMap(q => [q.q, ...q.options]))
  for (const v of UNIT_24_VOCABULARY) out.push(v.example)
  for (const g of UNIT_24_GRAMMAR)
    out.push(...g.examples.map(x => x.de), ...g.reallife.map(x => x.de), ...g.dialogue.map(x => x.text), g.speakPrompt.sample)
  for (const n of UNIT_24_WHY_NOTES) out.push(n.sentence, ...n.more.map(x => x.de))
  // prompts and answers only: the distractor options of a choice item are deliberately wrong forms and are never taught
  for (const e of UNIT_24_EXERCISES) out.push(e.prompt, e.answer)
  for (const q of UNIT_24_FINAL) out.push(q.prompt, q.answer)
  for (const w of UNIT_24_WRITING) out.push(w.model, w.mustInclude.map(m => m.label).join(' '))
  for (const s of UNIT_24_SPEAKING) out.push(...s.turns.flatMap(t => [t.ai, ...t.hints]))
  return out
}
const MISTAKES = new Set(UNIT_24_GRAMMAR.flatMap(g => g.mistakes.flatMap(m => [m.wrong, m.right])))
const taught = () => germanTexts().filter(t => !MISTAKES.has(t))

const ALL_DATA = () => [
  UNIT_24,
  UNIT_24_GRAMMAR,
  UNIT_24_WHY_NOTES,
  UNIT_24_READING,
  UNIT_24_LISTENING,
  UNIT_24_SPEAKING,
  UNIT_24_WRITING,
  UNIT_24_EXERCISES,
  UNIT_24_FINAL,
  UNIT_24_VOCABULARY,
  META,
]

/** every Kyrgyz string of the unit */
function kyTexts(): string[] {
  const out: string[] = []
  const walk = (v: unknown, key = '') => {
    if (typeof v === 'string') {
      if (/^(ky|exampleKy|promptKy|aiKy|titleKy|grammarKy)$/.test(key)) out.push(v)
    } else if (Array.isArray(v)) v.forEach(x => walk(x, key))
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (k !== 'source') walk(x, k)
  }
  walk(ALL_DATA())
  return out
}

describe('identity and integration (B1 is a Beta for ru and ky)', () => {
  it('the unit equals its approved plan entry', () => {
    const plan = B1_UNIT_PLAN.find(p => p.id === 24)!
    expect(UNIT_24).toMatchObject({ id: 24, key: plan.key, title: plan.titleDe, level: 'B1' })
    expect(plan.key).toBe('b1-wohnen-umwelt')
    expect(plan.titleDe).toBe('Wohnen, Umzug und Umwelt')
    expect(UNIT_24.grammarIds).toEqual(CONCEPTS)
  })
  it('the content module holds Unit 24 after Units 21–23, wired into the metadata, the tests, the final tests and the speaking list', () => {
    expect(B1_CONTENT.units.map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_META.map(m => m.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.tests).toContainEqual(UNIT_24_TEST)
    expect(B1_CONTENT.unitSpeaking).toEqual([
      'b1-sp-21-01',
      'b1-sp-22-01',
      'b1-sp-23-01',
      'b1-sp-24-01',
      'b1-sp-25-01',
      'b1-sp-26-01',
      'b1-sp-27-01',
      'b1-sp-28-01',
      'b1-sp-29-01',
      'b1-sp-30-01',
      'b1-sp-31-01',
      'b1-sp-32-01',
    ])
    expect(B1_CONTENT.finalTests.map(f => f.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
  })
  it('B1 is a Beta: released for ru and ky only, offered to those interfaces and never to the German one', () => {
    expect(courseLevel('B1')).toMatchObject({ status: 'beta', releasedLocales: ['ru', 'ky'] })
    for (const lang of ['ru', 'ky'] as const) expect(availableLevels(lang)).toContain('B1')
    expect(availableLevels('de')).not.toContain('B1')
  })
  it('registered in the catalog, the unit is reachable through the standard selectors; the main writing task comes first', () => {
    registerLevelContent('B1', B1_CONTENT)
    expect(vocabularyForUnit(24)).toHaveLength(40)
    expect(grammarForUnit(24).map(g => g.id)).toEqual(CONCEPTS)
    expect(finalTestOfUnit(24)?.questions).toHaveLength(15)
    expect(topicTestOfUnit(24)).toMatchObject({ id: 'unit-24', level: 'B1', size: 15 })
    expect(speakingForUnit(24)).toBe('b1-sp-24-01')
    expect(writingForUnit(24).map(w => w.id)).toEqual(['b1-wr-24-01', 'b1-wr-24-02'])
  })
})

describe('grammar: only the two approved concepts', () => {
  it('exactly the approved ids, in order, owned by Unit 24, level B1', () => {
    expect(UNIT_24_GRAMMAR.map(g => g.id)).toEqual(CONCEPTS)
    for (const g of UNIT_24_GRAMMAR) expect(g).toMatchObject({ unit: 24, level: 'B1' })
    expect(B1_CURRICULUM.units.find(u => u.unit === 24)!.concepts.map(c => c.id)).toEqual(CONCEPTS)
  })
  it('every concept is complete: explanation, 5 examples, mistakes, real-life, dialogue, speaking prompt — in Russian and in Kyrgyz', () => {
    for (const g of UNIT_24_GRAMMAR) {
      expect(g.examples).toHaveLength(5)
      expect(g.mistakes.length).toBeGreaterThanOrEqual(4)
      expect(g.reallife).toHaveLength(3)
      expect(g.dialogue.length).toBeGreaterThanOrEqual(4)
      for (const l of [g.title, g.summary, g.discover, g.why, ...g.when, g.speakPrompt.prompt, ...g.mistakes.map(m => m.note)]) {
        expect(l.ru.length).toBeGreaterThan(5)
        expect((l.ky ?? '').length).toBeGreaterThan(5)
        expect(l.ky).not.toBe(l.ru)
      }
      for (const x of [...g.examples, ...g.reallife, ...g.dialogue]) {
        expect(x.ru).toBeTruthy()
        expect(x.ky).toBeTruthy()
        expect(x.ky).not.toBe(x.ru)
      }
    }
  })
  it('the why-notes: two on the Passiv and two on the adjectives without article', () => {
    expect(UNIT_24_WHY_NOTES.map(n => n.conceptId)).toEqual([CONCEPTS[0], CONCEPTS[0], CONCEPTS[1], CONCEPTS[1]])
  })
  it('the examples really show their concept: every Passiv example has wird/werden + a Partizip II; every adjective example has an adjective without article', () => {
    for (const x of [...UNIT_24_GRAMMAR[0].examples, ...UNIT_24_GRAMMAR[0].reallife])
      expect(x.de, x.de).toMatch(/\b(wird|werden)\b[^.!?]*\b\w+(t|en)\.$/)
    const adj = /(^|[\s,])(helle|ruhige|kaltes|kalten|zentraler|starken|großem|neuer|frischer|alten|neue)\s/i
    for (const x of [...UNIT_24_GRAMMAR[1].examples, ...UNIT_24_GRAMMAR[1].reallife]) expect(x.de, x.de).toMatch(adj)
  })
  it('the Passiv examples cover: singular, plural, von + Dativ and a separable verb; the adjective examples cover Nominativ, Akkusativ and Dativ', () => {
    const p = UNIT_24_GRAMMAR[0].examples.map(x => x.de).join(' ')
    expect(p).toMatch(/\bwird\b/)
    expect(p).toMatch(/\bwerden\b/)
    expect(p).toMatch(/\bvom\b/)
    expect(p).toMatch(/\babgeholt\b/)
    const a = UNIT_24_GRAMMAR[1].examples.map(x => x.focus ?? '').join(' ')
    for (const c of ['Nominativ', 'Akkusativ', 'Dativ']) expect(a).toContain(c)
    for (const e of ['-e', '-es', '-en', '-em', '-er']) expect(a).toContain(e)
  })
  it('every "mistake" really differs from its correction, and the wrong form never appears in the taught texts', () => {
    for (const g of UNIT_24_GRAMMAR) for (const m of g.mistakes) expect(m.wrong).not.toBe(m.right)
    const wrong = UNIT_24_GRAMMAR.flatMap(g => g.mistakes.map(m => m.wrong))
    for (const t of taught()) expect(wrong.includes(t), t).toBe(false)
  })
  it('scope guard: nothing that belongs to a later unit (Passiv with a modal / Präteritum, Konjunktiv II, damit, Genitiv, relative clause with preposition/Dativ, verb + preposition)', () => {
    const forbidden: [string, RegExp][] = [
      ['damit (Unit 30)', /\bdamit\b/i],
      ['Passiv Präteritum (Unit 26)', /\b(wurde|wurden)\b/i],
      [
        'Passiv with a modal verb (Unit 26)',
        /\b(muss|müssen|kann|können|soll|sollen|darf|dürfen|will|wollen|möchte|möchten)\b[^.!?]*\b\w+(t|en)\s+werden\b/i,
      ],
      ['Konjunktiv II (Unit 25)', /\b(hätte|hätten|wäre|wären|würde|würden|könnte|könnten|sollte|sollten|müsste|müssten)\b/i],
      ['Genitiv (des/eines + Noun-s, wegen, trotz)', /\b(des|eines)\s+[A-ZÄÖÜ]\w+s\b|\bwegen\b|\btrotz\b/],
      [
        'relative clause with a preposition (Unit 29)',
        /,\s*(an|auf|in|mit|von|für|bei|aus|über|nach|vor)\s+(dem|der|den|denen|dessen|deren)\s/,
      ],
      ['Dativ / Genitiv relative pronoun (Unit 29)', /,\s*(dem|denen|dessen|deren)\s/],
      [
        'verb + obligatory preposition (Unit 28)',
        /\b(sich ärgern über|denken an|denke an|sich kümmern um|Angst vor|hält von|halten von|sprechen über|spreche über|diskutieren über|warten auf|sich freuen|abhängen von|hängt von|teilnehmen an|glauben an|träumen von|sich interessieren für|bestehen aus|sich bewerben um)\b/i,
      ],
      ['Partizip I as adjective (Unit 26)', /\b(steigend|fallend|laufend|wachsend)(e|en|er|es|em)\b/i],
      ['Zustandspassiv (Unit 31)', /\bist\s+(geschlossen|geöffnet|gestrichen|repariert|renoviert)\b/i],
    ]
    // a greeting such as "Liebe Frau Roth, in der Küche …" is not a relative clause
    for (const t0 of taught())
      for (const [name, re] of forbidden) {
        const t = t0.replace(/Liebe[rn]? \w+ \w+, /g, '')
        expect(re.test(t), `${name}: "${t.slice(0, 90)}"`).toBe(false)
      }
  })
  it('the receptive construction (Passiv Perfekt, "worden") appears in ONE reading (glossed) and never in a task, a test, a hint, a keyword or a checklist item; those of Units 22 and 23 never appear either', () => {
    const re = /\bworden\b|\bohne\b|\bstatt\b|einerseits|andererseits|nicht nur|sondern auch/i
    const production = [
      ...UNIT_24_EXERCISES.flatMap(e => [e.prompt, e.answer, ...(e.options ?? []), ...(e.words ?? [])]),
      ...UNIT_24_FINAL.flatMap(q => [q.prompt, q.answer, ...q.options]),
      ...UNIT_24_WRITING.flatMap(w => [...w.mustInclude.flatMap(m => [m.label, ...m.patterns]), w.model]),
      ...UNIT_24_SPEAKING.flatMap(s => s.turns.flatMap(t => [t.ai, ...t.hints, ...t.keywords])),
      ...UNIT_24_GRAMMAR.flatMap(g => [
        g.speakPrompt.sample,
        ...g.speakPrompt.keywords,
        ...g.examples.map(x => x.de),
        ...g.reallife.map(x => x.de),
      ]),
      ...UNIT_24_GRAMMAR.flatMap(g => g.dialogue.map(x => x.text)),
      ...UNIT_24_LISTENING.flatMap(l => [...l.lines.map(x => x.text), ...l.questions.flatMap(q => [q.q, ...q.options])]),
      ...UNIT_24_VOCABULARY.map(v => v.example),
    ]
    // the name of the checklist item "Ein Adjektiv ohne Artikel" is not the receptive construction `ohne … zu`
    for (const t of production) expect(re.test(t.replace(/ohne Artikel/gi, '')), t).toBe(false)
    expect(UNIT_24_READING.filter(r => re.test(r.body.join(' '))).map(r => r.id)).toEqual(['b1-re-24-02'])
    expect(UNIT_24_READING[1].gloss.filter(g => /worden/.test(g.word))).toHaveLength(2)
    const c = META.concepts[0].constructions!
    expect(c.map(x => [x.label, x.proficiency, x.forms])).toEqual([['Passiv Perfekt (ist … worden)', 'R', ['worden']]])
  })
  it('the productive constructions are really used in the texts: Passiv with singular and plural, von + Dativ, a separable verb; adjectives without article in three cases', () => {
    const all = taught().join(' ')
    expect(all).toMatch(/\bwird\b[^.!?]*\b(gereinigt|kontrolliert|repariert|gestrichen)\b/)
    expect(all).toMatch(/\bwerden\b[^.!?]*\b(abgestellt|gemeldet|gestrichen|repariert|gesammelt)\b/)
    expect(all).toMatch(/\bvom Hausmeister\b/)
    expect(all).toMatch(/\bwird\b[^.!?]*\babgeholt\b/)
    expect(all).toMatch(/\bmit (großem|neuer|kleinem) /)
    expect(all).toMatch(/\bin (ruhiger|zentraler) Lage\b/)
    expect(all).toMatch(/\bHelle /)
  })
})

describe('vocabulary: 40 new items, none already taught', () => {
  const b = fullBundle()
  const earlier = new Set(b.vocabulary.filter(v => v.unit <= 23).flatMap(v => lemmaKeys(v.de)))
  it('exactly 40 items (target 38–42), ids v24-1 … v24-40, unique across the whole B1 vocabulary', () => {
    expect(UNIT_24_VOCABULARY).toHaveLength(40)
    expect(UNIT_24_VOCABULARY.map(v => v.id)).toEqual(Array.from({ length: 40 }, (_, i) => `v24-${i + 1}`))
    expect(UNIT_24_VOCABULARY.every(v => v.unit === 24)).toBe(true)
    const ids = B1_CONTENT.vocabulary.map(v => v.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toHaveLength(480)
  })
  it('no lemma repeats an A1, A2 or earlier B1 headword (the basic housing words of A2 Unit 13 are NOT repeated), and none is listed twice', () => {
    const keys = UNIT_24_VOCABULARY.flatMap(v => lemmaKeys(v.de))
    expect(keys.filter(k => earlier.has(k))).toEqual([])
    expect(new Set(keys).size).toBe(keys.length)
    const de = UNIT_24_VOCABULARY.map(v => v.de)
    for (const known of [
      'Mietvertrag',
      'Kaution',
      'Nebenkosten',
      'Hausordnung',
      'Mülltrennung',
      'Heizung',
      'Nachbar',
      'Vermieter',
      'Umzug',
      'umziehen',
      'besichtigen',
    ])
      expect(de).not.toContain(known)
  })
  it('every item has article/plural where a noun, a German example, and independent Russian and Kyrgyz translations of the word and the example', () => {
    for (const v of UNIT_24_VOCABULARY) {
      if (v.pos === 'noun') expect(v.article, v.de).toBeTruthy()
      for (const f of [v.de, v.ru, v.ky, v.example, v.exampleRu, v.exampleKy ?? '']) expect(f.trim().length, v.id).toBeGreaterThan(1)
      expect(v.ky).not.toBe(v.ru)
      expect(v.exampleKy).not.toBe(v.exampleRu)
      expect(v.example.toLowerCase()).toContain(
        v.de
          .replace(/^sich /, '')
          .split(' ')[0]
          .slice(0, 3)
          .toLowerCase(),
      )
    }
    const ex = UNIT_24_VOCABULARY.map(v => v.example)
    expect(new Set(ex).size).toBe(ex.length)
  })
  it('the planned themes are present: housing contract and conditions, defects, moving, energy and environment — and no verb needs a prepositional object', () => {
    const de = UNIT_24_VOCABULARY.map(v => v.de)
    for (const w of [
      'Hausmeister',
      'Hausverwaltung',
      'Kaltmiete',
      'Heizkosten',
      'Kündigungsfrist',
      'Nachmieter',
      'Mangel',
      'Schimmel',
      'Wasserhahn',
      'undicht',
      'defekt',
      'Umzugskarton',
      'Umwelt',
      'Klima',
      'Energie',
      'Strom',
      'Verpackung',
      'umweltfreundlich',
      'nachhaltig',
      'vermeiden',
      'recyceln',
    ])
      expect(de, w).toContain(w)
    for (const v of UNIT_24_VOCABULARY.filter(x => x.pos === 'verb'))
      expect(`${v.ru} ${v.ky}`, v.de).not.toMatch(/\((an|über|auf|von|für|mit|um|vor) /)
  })
  it('the unit REUSES established housing words as revision in its texts without listing them as new', () => {
    const all = germanTexts().join(' ')
    for (const w of ['Mietvertrag', 'Kaution', 'Nebenkosten', 'Mülltrennung|Müll', 'Heizung', 'Wohnung', 'Miete'])
      expect(all, w).toMatch(new RegExp(w))
  })
})

describe('texts: progressive targets of the band for Units 23–26 (and the curriculum text for Unit 24)', () => {
  it('2 readings of 120–160 words and 2 listening scripts of 120–140 words', () => {
    expect(UNIT_24_READING).toHaveLength(2)
    expect(UNIT_24_LISTENING).toHaveLength(2)
    for (const r of UNIT_24_READING) {
      const n = r.body.reduce((a, p) => a + words(p), 0)
      expect(n, r.id).toBeGreaterThanOrEqual(120)
      expect(n, r.id).toBeLessThanOrEqual(160)
    }
    for (const l of UNIT_24_LISTENING) {
      const n = l.lines.reduce((a, x) => a + words(x.text), 0)
      expect(n, l.id).toBeGreaterThanOrEqual(120)
      expect(n, l.id).toBeLessThanOrEqual(140)
    }
  })
  it('sentences stay short (95th percentile ≤ 18, longest ≤ 24 words)', () => {
    const lens = [
      ...UNIT_24_READING.flatMap(r => r.body.flatMap(sentences)),
      ...UNIT_24_LISTENING.flatMap(l => l.lines.flatMap(x => sentences(x.text))),
    ]
      .map(words)
      .sort((a, b) => a - b)
    expect(lens[lens.length - 1]).toBeLessThanOrEqual(24)
    expect(lens[Math.ceil(0.95 * lens.length) - 1]).toBeLessThanOrEqual(18)
  })
  it('every dialogue line carries a Russian and a Kyrgyz translation; questions have 3 distinct options, exactly one correct; answer positions vary', () => {
    for (const l of UNIT_24_LISTENING) for (const x of l.lines) expect(x.ru && x.ky && x.ky !== x.ru).toBeTruthy()
    const qs = [...UNIT_24_LISTENING.flatMap(l => l.questions), ...UNIT_24_READING.flatMap(r => r.questions)]
    for (const q of qs) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options).size).toBe(3)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(3)
    }
    expect(new Set(qs.map(q => q.answer)).size).toBe(3)
    expect(new Set(UNIT_24_READING.flatMap(r => r.questions.map(q => q.answer))).size).toBeGreaterThanOrEqual(2)
    expect(new Set(UNIT_24_LISTENING.flatMap(l => l.questions.map(q => q.answer))).size).toBe(3)
  })
  it('the listening keywords all have a gloss in the unit vocabulary', () => {
    const de = new Set(UNIT_24_VOCABULARY.map(v => v.de))
    for (const l of UNIT_24_LISTENING) for (const k of l.keywords) expect(de.has(k), `${l.id}: ${k}`).toBe(true)
  })
  it('the listening dialogues are coherent: they open with a greeting and close with a closing line; the numbers are the ones the questions ask for', () => {
    expect(UNIT_24_LISTENING[0].lines[0].text).toMatch(/Guten Tag/)
    expect(UNIT_24_LISTENING[0].lines.at(-1)!.text).toMatch(/Auf Wiedersehen/)
    expect(UNIT_24_LISTENING[1].lines[0].text).toMatch(/Hausmeister Kurz/)
    expect(UNIT_24_LISTENING[1].lines.at(-1)!.text).toMatch(/Bis morgen/)
    expect(UNIT_24_LISTENING[0].lines.some(x => /Kaltmiete beträgt 620 Euro/.test(x.text))).toBe(true)
    expect(UNIT_24_LISTENING[1].lines.some(x => /Seit vier Tagen/.test(x.text))).toBe(true)
  })
  it('the listening answer keys agree with the script (every correct option is supported by the text, no distractor is)', () => {
    const l1 = UNIT_24_LISTENING[0].lines.map(x => x.text).join(' ')
    const q1 = UNIT_24_LISTENING[0].questions
    expect(q1[0].options[q1[0].answer]).toBe('620 Euro.')
    expect(l1).not.toMatch(/\b(520|720) Euro/)
    expect(q1[1].options[q1[1].answer]).toBe('Sie hat ein kleines Kind.')
    expect(l1).not.toMatch(/Hund|zu Hause arbeit/)
    expect(q1[2].options[q1[2].answer]).toBe('Der Wasserhahn.')
    expect(l1).toMatch(/Er wird nächste Woche repariert/)
    expect(q1[3].options[q1[3].answer]).toBe('Per E-Mail.')
    const l2 = UNIT_24_LISTENING[1].lines.map(x => x.text).join(' ')
    const q2 = UNIT_24_LISTENING[1].questions
    expect(q2[0].options[q2[0].answer]).toBe('Die Heizung.')
    expect(q2[1].options[q2[1].answer]).toBe('Seit vier Tagen.')
    expect(q2[2].options[q2[2].answer]).toBe('Die Hausverwaltung.')
    expect(l2).toMatch(/Dafür ist die Hausverwaltung zuständig/)
    expect(q2[3].options[q2[3].answer]).toBe('Das Bad mehrmals am Tag lüften.')
  })
  it('the reading answer keys agree with the text', () => {
    const [r1, r2] = UNIT_24_READING
    expect(r1.questions.map(q => q.options[q.answer])).toEqual(['Sie wird frisch gestrichen.', 'In den Keller.', 'Dem Hausmeister.'])
    expect(r1.body.join(' ')).toMatch(/Bevor Sie einziehen, wird die Wohnung frisch gestrichen/)
    expect(r1.body.join(' ')).toMatch(/Fahrräder werden im Keller abgestellt/)
    expect(r1.body.join(' ')).toMatch(/Mängel werden dem Hausmeister gemeldet/)
    expect(r2.questions.map(q => q.options[q.answer])).toEqual([
      'Es wird Müll gesammelt.',
      'Sie findet Plastik schlecht für das Klima.',
      'Energie.',
    ])
    expect(r2.body.join(' ')).toMatch(/wird im Park Müll gesammelt/)
    expect(r2.body.join(' ')).toMatch(/weniger Energie verbraucht/)
  })
  it('the reading glosses give Russian and Kyrgyz for every word, independently', () => {
    for (const r of UNIT_24_READING) for (const g of r.gloss) expect(g.ky).not.toBe(g.ru)
  })
  it('listening uses the existing browser text-to-speech lab: no audio file, no claim of verified playback; no assessment item depends on audio', () => {
    for (const l of UNIT_24_LISTENING) expect(Object.keys(l)).not.toContain('audio')
    for (const q of UNIT_24_FINAL) expect(q.skill).not.toBe('listening')
  })
  it('speaking: one scenario of 6 turns, the unexpected Nebenkostenabrechnung in turn 4, hints and keywords, in German + Russian + Kyrgyz; realistic housing situation', () => {
    const [s] = UNIT_24_SPEAKING
    expect(s.turns).toHaveLength(6)
    expect(s.level).toBe('B1')
    for (const t of s.turns) {
      expect(t.aiRu && t.aiKy).toBeTruthy()
      expect(t.hints.length).toBeGreaterThanOrEqual(3)
      expect(t.keywords.length).toBeGreaterThanOrEqual(3)
      for (const k of t.keywords) expect(k).toBe(k.toLowerCase())
    }
    expect(s.turns[3].ai).toMatch(/Nebenkostenabrechnung/)
    expect(s.turns[0].ai).toMatch(/Hausverwaltung/)
    expect(s.titleRu && s.titleKy).toBeTruthy()
  })
})

describe('writing: the mail to the Hausverwaltung and the opinion micro-task', () => {
  it('main task: formal, 70 words minimum, six expected elements, a model that meets every one, each element explained in ru and ky, at least two Passiv sentences in the model', () => {
    expect(MAIN).toMatchObject({ id: 'b1-wr-24-01', minWords: 70, level: 'B1', unit: 24, formal: true })
    expect(words(MAIN.model)).toBeGreaterThanOrEqual(70)
    expect(MAIN.mustInclude).toHaveLength(6)
    for (const m of MAIN.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky).toBeTruthy()
      expect(m.explain!.ky).not.toBe(m.explain!.ru)
      expect(
        m.patterns.some(p => MAIN.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect((MAIN.model.match(/\b(wird|werden)\b/g) ?? []).length).toBeGreaterThanOrEqual(2)
    expect(MAIN.model).toMatch(/^Sehr geehrte Damen und Herren/)
    expect(MAIN.model).toMatch(/Mit freundlichen Grüßen/)
    expect(MAIN.model).not.toMatch(/\bdu\b|\bdir\b|\bdein/i) // formal register: Sie
    for (const t of MAIN.tips) expect(t.ky).not.toBe(t.ru)
  })
  it('the micro-task (kind "meinung") is a second, short writing task with opinion + reason + a word of the topic; its model meets every element', () => {
    expect(MICRO).toMatchObject({ id: 'b1-wr-24-02', minWords: 30, level: 'B1', unit: 24, formal: false })
    expect(META.microTasks).toEqual([{ kind: 'meinung', taskId: 'b1-wr-24-02' }])
    expect(words(MICRO.model)).toBeGreaterThanOrEqual(30)
    expect(MICRO.mustInclude).toHaveLength(3)
    for (const m of MICRO.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky && m.explain.ky !== m.explain.ru).toBeTruthy()
      expect(
        m.patterns.some(p => MICRO.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(MICRO.model).toMatch(/\bIch finde\b/)
    expect(MICRO.model).toMatch(/\bdenn\b|\bweil\b/)
  })
  it('the writing tips tell the learner that the app checks only length and expected words and that quality is self-assessed (both tasks)', () => {
    for (const w of UNIT_24_WRITING) {
      expect(w.tips.map(t => t.ru).join(' ')).toMatch(/только объём и ожидаемые слова/)
      expect(w.tips.map(t => t.ky).join(' ')).toMatch(/көлөмдү жана күтүлгөн сөздөрдү гана/)
    }
  })
})

describe('exercises: answer keys are correct and unique', () => {
  it('10 handwritten exercises: 8 on the two concepts (4 + 4) + 2 recycled (A2) without a concept; types fill / choice / order; both languages everywhere', () => {
    expect(UNIT_24_EXERCISES).toHaveLength(10)
    expect(UNIT_24_EXERCISES.map(e => e.id)).toEqual(Array.from({ length: 10 }, (_, i) => `b1-ex-24-${String(i + 1).padStart(2, '0')}`))
    const withConcept = UNIT_24_EXERCISES.filter(e => e.concept)
    expect(withConcept).toHaveLength(8)
    expect(CONCEPTS.map(c => withConcept.filter(e => e.concept === c).length)).toEqual([4, 4])
    expect(UNIT_24_EXERCISES.filter(e => !e.concept).map(e => e.id)).toEqual(['b1-ex-24-09', 'b1-ex-24-10'])
    expect([...new Set(UNIT_24_EXERCISES.map(e => e.type))].sort()).toEqual(['choice', 'fill', 'order'])
    expect(['fill', 'choice', 'order'].map(t => UNIT_24_EXERCISES.filter(e => e.type === t).length)).toEqual([3, 5, 2])
    for (const e of UNIT_24_EXERCISES) {
      expect(e.why.ru && e.why.ky).toBeTruthy()
      expect(e.why.ky).not.toBe(e.why.ru)
      expect(e.promptRu && e.promptKy, e.id).toBeTruthy()
    }
  })
  it('every choice / fill item: 3 distinct options and the answer is among them exactly once; every order item is a true permutation that is not pre-solved', () => {
    for (const e of UNIT_24_EXERCISES) {
      if (e.type === 'order') {
        expect([...(e.words ?? [])].sort().join('|')).toBe(e.answer.split(' ').sort().join('|'))
        expect(e.words!.join(' ')).not.toBe(e.answer)
      } else {
        expect(e.options).toHaveLength(3)
        expect(new Set(e.options).size).toBe(3)
        expect(e.options!.filter(o => o === e.answer)).toHaveLength(1)
      }
    }
  })
  it('a fill item has exactly one gap and exactly one option makes a grammatical sentence (checked for the Passiv and the adjective gaps)', () => {
    const by = (id: string) => UNIT_24_EXERCISES.find(e => e.id === id)!
    for (const e of UNIT_24_EXERCISES.filter(x => x.type === 'fill')) expect(e.prompt.match(/___/g)).toHaveLength(1)
    // singular subject → wird; "ist" and "werden" cannot be completed with a Partizip II of a singular subject
    expect(by('b1-ex-24-01').answer).toBe('wird')
    expect(by('b1-ex-24-05').answer).toBe('helle')
    expect(by('b1-ex-24-09').answer).toBe('stelle')
  })
  it('the text-level item (ex 04): three sentences per option, exactly one correct, and the wrong ones each contain a real learner error', () => {
    const e = UNIT_24_EXERCISES.find(x => x.id === 'b1-ex-24-04')!
    for (const o of e.options!) expect(sentences(o)).toHaveLength(3)
    const wrong = e.options!.filter(o => o !== e.answer)
    expect(wrong.some(o => /Die Zimmer wird/.test(o))).toBe(true) // plural subject with wird
    expect(wrong.some(o => /wird im Mai renovieren/.test(o))).toBe(true) // infinitive instead of Partizip II
    expect(e.answer).not.toMatch(/Zimmer wird|renovieren/)
  })
  it('the Passiv and adjective exercises really use their construction in the answer', () => {
    const by = (id: string) => UNIT_24_EXERCISES.find(e => e.id === id)!
    expect(by('b1-ex-24-02').answer).toMatch(/werden gestrichen\.$/)
    expect(by('b1-ex-24-03').answer).toMatch(/ wird .* repariert\.$/)
    expect(by('b1-ex-24-06').answer).toMatch(/kalte Luft\.$/)
    expect(by('b1-ex-24-07').answer).toMatch(/kalten Kaffee\.$/)
    expect(by('b1-ex-24-08').answer).toMatch(/mit dicken Wänden\.$/)
  })
})

describe('final test: structure, answer keys and scoring data', () => {
  it('15 questions = 8 grammar (3 Passiv, 2 adjectives, 3 recycled ↻) + 3 vocabulary + 4 reading, no listening; ≥ 2 gap-fill', () => {
    expect(UNIT_24_FINAL.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `b1-ft-24-${String(i + 1).padStart(2, '0')}`))
    const by = (s: string) => UNIT_24_FINAL.filter(q => q.skill === s)
    expect([by('grammar').length, by('vocabulary').length, by('reading').length, by('listening').length]).toEqual([8, 3, 4, 0])
    expect(by('grammar').filter(q => /___/.test(q.prompt)).length).toBeGreaterThanOrEqual(2)
    expect(CONCEPTS.map(c => by('grammar').filter(q => q.concept === c).length)).toEqual([3, 2])
    expect(
      by('grammar')
        .filter(q => q.concept && !CONCEPTS.includes(q.concept))
        .map(q => q.concept),
    ).toEqual(['a2-positionsverben', 'a2-wenn-saetze', 'b1-relativsaetze-nom-akk'])
    expect(UNIT_24_TEST).toMatchObject({ id: 'unit-24', kind: 'topic', level: 'B1', unit: 24, size: 15 })
  })
  it('the recycled concepts really exist in earlier units (A2 Unit 13/14, B1 Unit 23)', () => {
    const owner = new Map(fullBundle().grammar.map(g => [g.id, g.unit]))
    for (const q of UNIT_24_FINAL.filter(x => x.concept && !CONCEPTS.includes(x.concept)))
      expect(owner.get(q.concept!)! < 24, q.concept).toBe(true)
  })
  it('options: 3 distinct each, the answer appears exactly once, both languages with an explanation; positions are 5 / 5 / 5, never three in a row', () => {
    const pos: number[] = []
    for (const q of UNIT_24_FINAL) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options).size).toBe(3)
      expect(q.options.filter(o => o === q.answer)).toHaveLength(1)
      expect(q.promptRu && q.promptKy).toBeTruthy()
      expect(q.why.ru && q.why.ky).toBeTruthy()
      expect(q.why.ky).not.toBe(q.why.ru)
      pos.push(q.options.indexOf(q.answer))
    }
    expect([0, 1, 2].map(p => pos.filter(x => x === p).length)).toEqual([5, 5, 5])
    for (let i = 2; i < pos.length; i++) expect(pos[i] === pos[i - 1] && pos[i] === pos[i - 2]).toBe(false)
  })
  it('the passive question really tests the meaning change: exactly one Passiv option keeps the roles of the active sentence', () => {
    const q = UNIT_24_FINAL.find(x => x.id === 'b1-ft-24-03')!
    const good = q.options.filter(o => /^Die Heizung wird vom Hausmeister kontrolliert\.$/.test(o))
    expect(good).toEqual([q.answer])
    expect(q.options.filter(o => /Hausmeister wird von der Heizung/.test(o))).toHaveLength(1)
  })
  it('the final test shares no prompt (except the generic instruction line) and no answer with the revision exercises, and no prompt with another question', () => {
    const ex = new Set(UNIT_24_EXERCISES.flatMap(e => [e.prompt, e.answer]))
    const generic = new Set(['Welcher Satz ist richtig?', 'Bilde den Satz.'])
    for (const q of UNIT_24_FINAL) {
      if (!generic.has(q.prompt)) expect(ex.has(q.prompt), q.id).toBe(false)
      expect(ex.has(q.answer), q.id).toBe(false)
    }
    const prompts = UNIT_24_FINAL.map(q => q.prompt).filter(p => !generic.has(p))
    expect(new Set(prompts).size).toBe(prompts.length)
  })
  it('scoring data: every question has its answer among its options (a perfect run is 15/15) and the pass mark of the existing rule (70 %) is 11 of 15', () => {
    expect(UNIT_24_FINAL.filter(q => q.options.includes(q.answer)).length).toBe(15)
    expect(Math.ceil(0.7 * 15)).toBe(11)
  })
})

describe('unit metadata, objectives and the spaced-revision set', () => {
  it('2–3 can-do goals and one objective per skill, each "Ich kann …" with independent Russian and Kyrgyz', () => {
    expect(META.canDo.length).toBeGreaterThanOrEqual(2)
    expect(META.canDo.length).toBeLessThanOrEqual(3)
    for (const t of [
      ...META.canDo,
      ...Object.values(META.objectives),
      META.differenceFromA2!,
      META.scenario.unexpectedElement,
      META.strands.strategyNote!,
      ...META.strands.repairChunks,
    ]) {
      expect(t.de && t.ru && t.ky).toBeTruthy()
      expect(t.ky).not.toBe(t.ru)
    }
    for (const t of [...META.canDo, ...Object.values(META.objectives)]) expect(t.de.startsWith('Ich kann')).toBe(true)
    expect(Object.keys(META.objectives)).toEqual(['lesen', 'hoeren', 'sprechen', 'schreiben'])
    expect(META.strands.repairChunks.length).toBeGreaterThanOrEqual(3)
    expect(META.scenario.id).toBe('b1-sp-24-01')
  })
  it('the classification is the approved one: P/H (Passiv Perfekt receptive) and P/M; the Passiv decision D-5 is still OPEN (nothing is marked as expert-confirmed)', () => {
    expect(META.concepts.map(c => [c.conceptId, c.proficiency, c.load, c.role])).toEqual([
      ['b1-passiv-praesens', 'P', 'H', 'new'],
      ['b1-adjektive-ohne-artikel', 'P', 'M', 'new'],
    ])
    const spec = B1_CURRICULUM.units.find(u => u.unit === 24)!
    expect(spec.concepts[0].expertReview).toMatchObject({ status: 'pending', decision: 'D-5' })
    expect(spec.concepts[1].expertReview).toBeUndefined()
  })
  it('spaced revision: 4 words of Unit 23, 2 of Unit 21, 3 from A2 — real, existing vocabulary ids', () => {
    const vocab = new Map(fullBundle().vocabulary.map(v => [v.id, v.unit]))
    expect(META.revision!.fromPrevious.map(id => vocab.get(id))).toEqual([23, 23, 23, 23])
    expect(META.revision!.fromThirdBack.map(id => vocab.get(id))).toEqual([21, 21])
    for (const id of META.revision!.fromA2) expect(vocab.get(id)! >= 11 && vocab.get(id)! <= 20, id).toBe(true)
    expect(META.revision!.fromA2.length).toBeGreaterThanOrEqual(2)
    // A2 housing words are what this unit revises
    expect(META.revision!.fromA2.map(id => vocab.get(id))).toEqual([13, 13, 13])
  })
  it('the Wiederholungsblock holds at least 20 distinct words of Units 21–23, none of Unit 24 itself', () => {
    const vocab = new Map(fullBundle().vocabulary.map(v => [v.id, v.unit]))
    const block = META.revision!.block!
    expect(block.length).toBeGreaterThanOrEqual(20)
    expect(new Set(block).size).toBe(block.length)
    for (const id of block) expect([21, 22, 23], id).toContain(vocab.get(id))
  })
  it('the two kinds of vocabulary are kept apart: the 40 new items of Unit 24 vs. revision ids that are all earlier words', () => {
    const newIds = new Set(UNIT_24_VOCABULARY.map(v => v.id))
    const rev = [...META.revision!.fromPrevious, ...META.revision!.fromThirdBack, ...META.revision!.fromA2, ...META.revision!.block!]
    for (const id of rev) expect(newIds.has(id), id).toBe(false)
  })
})

describe('RU / KY parity and quality guards', () => {
  it('parity: every German item with a Russian text has a Kyrgyz text that is not identical, in every structure of the unit', () => {
    const missing: string[] = []
    const walk = (v: unknown, path: string) => {
      if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${path}[${i}]`))
      if (!v || typeof v !== 'object') return
      const o = v as Record<string, unknown>
      for (const [k, x] of Object.entries(o)) {
        if (k === 'source') continue
        const pair: Record<string, string> = {
          ru: 'ky',
          exampleRu: 'exampleKy',
          promptRu: 'promptKy',
          aiRu: 'aiKy',
          titleRu: 'titleKy',
          grammar: 'grammarKy',
        }
        const ky = pair[k]
        if (ky && typeof x === 'string' && x.trim()) {
          const y = o[ky]
          if (typeof y !== 'string' || !y.trim() || (y === x && /[А-Яа-я]/.test(x))) missing.push(`${path}.${k}`)
        }
        walk(x, `${path}.${k}`)
      }
    }
    walk(ALL_DATA(), 'unit24')
    expect(missing).toEqual([])
  })
  it('the Russian and the Kyrgyz are of comparable size (no half-translated string)', () => {
    const bad: string[] = []
    for (const v of UNIT_24_VOCABULARY) {
      if (v.ky.length < v.ru.length * 0.3 || v.ky.length > v.ru.length * 3.5) bad.push(`${v.id} ${v.ru} / ${v.ky}`)
      if ((v.exampleKy ?? '').length < v.exampleRu.length * 0.5) bad.push(`${v.id} example`)
    }
    expect(bad).toEqual([])
  })
  it('no invented Kyrgyz grammar label (project glossary policy): grammar is described, not labelled', () => {
    const all = kyTexts().join(' \n ')
    for (const bad of [
      'бүтүндөмө',
      'жакталган',
      'бөлүнүүчү',
      'жөндөлгөн этиш',
      'ээрчимелүү',
      'багыныңкы',
      'баш сүйлөм',
      'страдательдик',
      'пассивдик',
    ])
      expect(all, bad).not.toContain(bad)
  })
  it('every Kyrgyz string is written in Cyrillic (quoted German allowed) and the unit has a large Kyrgyz body', () => {
    const ky = kyTexts()
    expect(ky.length).toBeGreaterThan(250)
    expect(ky.filter(t => t.length > 25 && !/[А-Яа-яЁёҢңӨөҮү]/.test(t))).toEqual([])
  })
  it('the explanations of exercises and final-test questions differ between Russian and Kyrgyz', () => {
    for (const e of UNIT_24_EXERCISES) expect(e.why.ky).not.toBe(e.why.ru)
    for (const q of UNIT_24_FINAL) expect(q.why.ky).not.toBe(q.why.ru)
  })
})

describe('validator and assessment honesty', () => {
  it('the validator finds 0 errors and 0 warnings in the real bundle; the review flags of Unit 24 are exactly: missing human CEFR sign-off, the open decision D-5, and the receptive Passiv Perfekt heuristic', () => {
    const is = validateContent(fullBundle())
    expect(is.filter(i => i.severity === 'error')).toEqual([])
    expect(is.filter(i => i.severity === 'warning')).toEqual([])
    expect(is.filter(i => i.rule.startsWith('b1-') && i.severity !== 'review')).toEqual([])
    expect(
      is
        .filter(i => i.where === 'units:24' && i.severity === 'review')
        .map(i => i.rule)
        .sort(),
    ).toEqual(['beta-review-pending', 'beta-review-pending', 'cefr-signoff-missing']) // + the Beta flags (ru, ky) since the B1 Beta launch
    expect(is.filter(i => i.rule === 'b1-expert-review-pending').map(i => i.where)).toEqual([
      'grammar:b1-passiv-praesens',
      'grammar:b1-lassen',
      'grammar:b1-genitiv-praepositionen',
      'grammar:b1-futur1-vermutungen',
      'grammar:b1-genitivattribute',
      'grammar:b1-plusquamperfekt-nachdem',
      'grammar:b1-nomen-verb-verbindungen',
      'grammar:b1-aktiv-passiv-zustandspassiv',
      'grammar:b1-satzbau-mittelfeld',
    ])
    expect(is.filter(i => i.rule === 'cefr-structure-passiv-perfekt').map(i => i.where)).toEqual(['reading:b1-re-24-02#body[2]'])
  })
  it('the unit never claims a CEFR level, a certificate or an exam result', () => {
    const all = JSON.stringify(ALL_DATA(), (k, v) => (k === 'source' ? undefined : v))
    expect(all).not.toMatch(/zertifikat|certificate|сертификат|B1 erreicht|достигнут уровень|official/i)
    expect(all).not.toMatch(/\bCEFR\b/)
  })
  it('speaking and writing feedback is a checklist and a self-assessment: no numeric CEFR or score field in the unit data', () => {
    const all = JSON.stringify([UNIT_24_SPEAKING, UNIT_24_WRITING])
    expect(all).not.toMatch(/"(score|points|cefrScore|level_score)"/)
  })
  it('the provenance says the material is original and NOT reviewed', () => {
    for (const x of [...UNIT_24_GRAMMAR, ...UNIT_24_READING, ...UNIT_24_LISTENING, ...UNIT_24_SPEAKING, ...UNIT_24_WRITING]) {
      expect(x.source?.kind).toBe('authored')
      expect(x.source?.author).toMatch(/pending independent CEFR, Russian and Kyrgyz review/)
    }
  })
})
