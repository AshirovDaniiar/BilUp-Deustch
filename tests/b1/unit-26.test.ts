// @vitest-environment node
/**
 * B1 Unit 26 — Medien, Technik und Nachrichten (Stage 3H). Checks the authored content against the approved curriculum: identity, the three approved concepts
 * (Passiv with modal verb / Präteritum, lassen on a closed list, Wiedergeben in the Indicative), vocabulary (38–42, nothing already taught), text sizes, the
 * receptive constructions (sich lassen, Partizip I as adjective, Passiv Perfekt), the scope guard for later units — including REGRESSION samples proving that
 * genuine out-of-scope German is still detected — media-literacy safety (everything fictional), RU/KY parity, exercise/answer-key correctness, assessment
 * structure, metadata, the two micro-tasks, topic evidence and spaced revision. B1 stays `planned` and invisible; no CEFR approval of any kind is implied.
 */
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { lemmaKeys } from '../../scripts/content-validate/b1/lemma'
import { B1_CURRICULUM } from '../../scripts/content-validate/b1/curriculum'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_META } from '../../src/data/b1/meta'
import { B1_UNIT_PLAN } from '../../src/data/b1/registry'
import { UNIT_26_EXERCISES, UNIT_26_FINAL, UNIT_26_TEST } from '../../src/data/b1/unit26/assessment'
import { UNIT_26_GRAMMAR, UNIT_26_WHY_NOTES } from '../../src/data/b1/unit26/grammar'
import { UNIT_26_LISTENING, UNIT_26_READING, UNIT_26_SPEAKING, UNIT_26_WRITING } from '../../src/data/b1/unit26/texts'
import { UNIT_26 } from '../../src/data/b1/unit26/unit'
import { UNIT_26_VOCABULARY } from '../../src/data/b1/unit26/vocabulary'
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
const CONCEPTS = ['b1-passiv-praeteritum-modal', 'b1-lassen', 'b1-wiedergeben-indikativ']
const META = B1_META.find(m => m.unit === 26)!
const [MAIN, MICRO_O, MICRO_M] = UNIT_26_WRITING

/** the closed list of Passiv Präteritum participles and the stems of the six `lassen` expressions */
const PRAET_PARTICIPLES = /veröffentlicht|gegründet|gebaut|erfunden|eröffnet|abgesagt/
const LASSEN_STEMS = /reparieren|ändern|prüfen|Haare schneiden|schicken|liefern/

/** every German string of the unit (what a learner reads or hears) */
function germanTexts(): string[] {
  const out: string[] = []
  for (const r of UNIT_26_READING) out.push(...r.body, ...r.questions.flatMap(q => [q.q, ...q.options]))
  for (const l of UNIT_26_LISTENING) out.push(...l.lines.map(x => x.text), ...l.questions.flatMap(q => [q.q, ...q.options]))
  for (const v of UNIT_26_VOCABULARY) out.push(v.example)
  for (const g of UNIT_26_GRAMMAR)
    out.push(...g.examples.map(x => x.de), ...g.reallife.map(x => x.de), ...g.dialogue.map(x => x.text), g.speakPrompt.sample)
  for (const n of UNIT_26_WHY_NOTES) out.push(n.sentence, ...n.more.map(x => x.de))
  // prompts and answers only: the distractor options of a choice item are deliberately wrong forms and are never taught
  for (const e of UNIT_26_EXERCISES) out.push(e.prompt, e.answer)
  for (const q of UNIT_26_FINAL) out.push(q.prompt, q.answer)
  for (const w of UNIT_26_WRITING) out.push(w.model, w.mustInclude.map(m => m.label).join(' '))
  for (const s of UNIT_26_SPEAKING) out.push(...s.turns.flatMap(t => [t.ai, ...t.hints]))
  return out
}
const MISTAKES = new Set(UNIT_26_GRAMMAR.flatMap(g => g.mistakes.flatMap(m => [m.wrong, m.right])))
const taught = () => germanTexts().filter(t => !MISTAKES.has(t))

const ALL_DATA = () => [
  UNIT_26,
  UNIT_26_GRAMMAR,
  UNIT_26_WHY_NOTES,
  UNIT_26_READING,
  UNIT_26_LISTENING,
  UNIT_26_SPEAKING,
  UNIT_26_WRITING,
  UNIT_26_EXERCISES,
  UNIT_26_FINAL,
  UNIT_26_VOCABULARY,
  META,
]

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

/** the out-of-scope rules (later units and receptive-only constructions); exported to the regression test below */
const FORBIDDEN: [string, RegExp][] = [
  ['damit (Unit 30)', /\bdamit\b/i],
  ['Passiv Perfekt (receptive in Unit 24 only)', /\bworden\b/i],
  ['Konjunktiv I / indirect speech in the subjunctive (B2)', /\b(er|sie|es|man)\s+sei\b|\bheiße es\b|\bgebe es\b|\bseien\b/i],
  [
    'unreal condition (Unit 27): wenn … hätte/wäre/würde/könnte',
    /\bwenn\b[^.!?]*\b(hätte|hätten|wäre|wären|würde|würden|könnte|könnten)\b/i,
  ],
  ['unreal wish (Unit 27)', /\b(wünschte|wünschten)\b|\bals ob\b/i],
  ['Konjunktiv II of the past (receptive, Unit 31)', /\b(hätte|hätten|hättest|wäre|wären)\b[^.!?,]*\b(ge\w+(t|en)|\w+iert)\s*[.!?,]/i],
  ['Genitiv (des/eines + Noun-s, wegen, trotz)', /\b(des|eines)\s+[A-ZÄÖÜ]\w+s\b|\bwegen\b|\btrotz\b/],
  [
    'relative clause with a preposition (Unit 29)',
    /,\s*(an|auf|in|mit|von|für|bei|aus|über|nach|vor)\s+(dem|der|den|denen|dessen|deren)\s(?![^.!?]*\bzu \w+)/,
  ],
  ['Dativ / Genitiv relative pronoun (Unit 29)', /,\s*(dem|denen|dessen|deren)\s/],
  [
    'verb + obligatory preposition (Unit 28)',
    /\b(sich ärgern über|denken an|denke an|sich kümmern um|Angst vor|hält von|halten von|sprechen über|spreche über|diskutieren über|warten auf|sich freuen|abhängen von|hängt von|teilnehmen an|glauben an|träumen von|sich interessieren für|bestehen aus|sich bewerben um|nachdenken über|berichten über|berichtet über)\b|\b(warte|wartest|wartet) auf\b|\b(denke|denkst|denkt) an\b|\b(spreche|sprichst|spricht) über\b|\b(diskutiere|diskutiert) über\b|\b(träume|träumt) von\b|\b(glaube|glaubt) an\b|\b(ärgere|ärgert) \w+ über\b/i,
  ],
  [
    'receptive constructions of Units 22–24 (ohne … zu, statt … zu, einerseits)',
    /\bohne\b|\bstatt\b|einerseits|andererseits|nicht nur|sondern auch/i,
  ],
]

describe('identity and integration (B1 is a Beta for ru and ky)', () => {
  it('the unit equals its approved plan entry', () => {
    const plan = B1_UNIT_PLAN.find(p => p.id === 26)!
    expect(UNIT_26).toMatchObject({ id: 26, key: plan.key, title: plan.titleDe, level: 'B1' })
    expect(plan.key).toBe('b1-medien-technik')
    expect(plan.titleDe).toBe('Medien, Technik und Nachrichten')
    expect(UNIT_26.grammarIds).toEqual(CONCEPTS)
  })
  it('the content module holds Unit 26 after Units 21–25, wired into the metadata, the tests, the final tests and the speaking list', () => {
    expect(B1_CONTENT.units.map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_META.map(m => m.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.tests).toContainEqual(UNIT_26_TEST)
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
    expect(vocabularyForUnit(26)).toHaveLength(40)
    expect(grammarForUnit(26).map(g => g.id)).toEqual(CONCEPTS)
    expect(finalTestOfUnit(26)?.questions).toHaveLength(15)
    expect(topicTestOfUnit(26)).toMatchObject({ id: 'unit-26', level: 'B1', size: 15 })
    expect(speakingForUnit(26)).toBe('b1-sp-26-01')
    expect(writingForUnit(26).map(w => w.id)).toEqual(['b1-wr-26-01', 'b1-wr-26-02', 'b1-wr-26-03'])
  })
})

describe('grammar: only the three approved concepts', () => {
  it('exactly the approved ids, in order, owned by Unit 26, level B1', () => {
    expect(UNIT_26_GRAMMAR.map(g => g.id)).toEqual(CONCEPTS)
    for (const g of UNIT_26_GRAMMAR) expect(g).toMatchObject({ unit: 26, level: 'B1' })
    expect(B1_CURRICULUM.units.find(u => u.unit === 26)!.concepts.map(c => c.id)).toEqual(CONCEPTS)
  })
  it('every concept is complete: explanation, 5 examples, mistakes, real-life, dialogue, speaking prompt — in Russian and in Kyrgyz', () => {
    for (const g of UNIT_26_GRAMMAR) {
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
  it('the why-notes: two on Passiv, one on lassen, one on Wiedergeben', () => {
    expect(UNIT_26_WHY_NOTES.map(n => n.conceptId)).toEqual([CONCEPTS[0], CONCEPTS[0], CONCEPTS[1], CONCEPTS[2]])
  })
  it('the examples really show their concept: modal Passiv / wurde + Partizip II; lassen + Infinitiv; sagt/schreibt/fragte/heißt/steht/laut', () => {
    for (const x of UNIT_26_GRAMMAR[0].examples)
      expect(x.de, x.de).toMatch(/\b(muss|müssen|kann|können|soll|sollen)\b[^.!?]*\b\w+ werden\.$|\b(wurde|wurden)\b/)
    for (const x of [...UNIT_26_GRAMMAR[1].examples, ...UNIT_26_GRAMMAR[1].reallife])
      expect(x.de, x.de).toMatch(/\b(lasse|lässt|lassen|[Ll]ass)\b/)
    for (const x of [...UNIT_26_GRAMMAR[2].examples, ...UNIT_26_GRAMMAR[2].reallife])
      expect(x.de, x.de).toMatch(/\b(sagt|schreibt|fragte|fragt|heißt|steht|Laut|laut)\b/)
  })
  it('every "mistake" really differs from its correction, and the wrong form never appears in the taught texts', () => {
    for (const g of UNIT_26_GRAMMAR) for (const m of g.mistakes) expect(m.wrong).not.toBe(m.right)
    const wrong = UNIT_26_GRAMMAR.flatMap(g => g.mistakes.map(m => m.wrong))
    for (const t of taught()) expect(wrong.includes(t), t).toBe(false)
  })
  it('scope guard: nothing that belongs to a later unit or is receptive-only (Passiv Perfekt, Konjunktiv I, unreal conditions, Genitiv, relative clause with preposition, verb + preposition, ohne/statt … zu)', () => {
    // a greeting such as "Liebe Frau Roth, in der Küche …" is not a relative clause
    for (const t0 of taught())
      for (const [name, re] of FORBIDDEN) {
        const t = t0.replace(/Liebe[rn]? \w+, /g, '')
        expect(re.test(t), `${name}: "${t.slice(0, 90)}"`).toBe(false)
      }
  })
  it('REGRESSION of the scope guard: genuine out-of-scope German IS still detected (the heuristics were narrowed only for false positives)', () => {
    const bad: [string, string][] = [
      ['damit (Unit 30)', 'Ich lerne viel, damit ich besser spreche.'],
      ['Passiv Perfekt (receptive in Unit 24 only)', 'Die Heizung ist erneuert worden.'],
      ['Konjunktiv I / indirect speech in the subjunctive (B2)', 'Er sagt, er sei krank.'],
      ['unreal condition (Unit 27): wenn … hätte/wäre/würde/könnte', 'Wenn ich Zeit hätte, würde ich kommen.'],
      ['unreal wish (Unit 27)', 'Ich wünschte, ich wäre reich.'],
      ['Konjunktiv II of the past (receptive, Unit 31)', 'Ich wäre gestern gern ins Kino gegangen.'],
      ['Genitiv (des/eines + Noun-s, wegen, trotz)', 'Wegen des Wetters bleiben wir hier.'],
      ['relative clause with a preposition (Unit 29)', 'Das ist der Mann, mit dem ich gesprochen habe.'],
      ['Dativ / Genitiv relative pronoun (Unit 29)', 'Das ist der Mann, dem ich geholfen habe.'],
      ['verb + obligatory preposition (Unit 28)', 'Ich warte auf den Bus.'],
      ['receptive constructions of Units 22–24 (ohne … zu, statt … zu, einerseits)', 'Er geht, ohne sich zu verabschieden.'],
    ]
    for (const [name, text] of bad) {
      const re = FORBIDDEN.find(([n]) => n === name)![1]
      expect(re.test(text), `${name}: "${text}" must be detected`).toBe(true)
    }
    const sichLassen = /lässt sich (lösen|erklären)|lassen sich (lösen|erklären)/
    expect(sichLassen.test('Das Problem lässt sich lösen.')).toBe(true)
    expect(sichLassen.test('Sie lässt sich die Haare schneiden.')).toBe(false) // productive reflexive lassen is not the receptive construction
    // and the two narrowed cases stay allowed: an infinitive clause after a comma, and plain Perfekt after wäre-free sentences
    const mitDem = FORBIDDEN.find(([n]) => n.startsWith('relative clause'))![1]
    expect(mitDem.test('Es wäre gut, mit dem Hausarzt zu sprechen.')).toBe(false)
    const past = FORBIDDEN.find(([n]) => n.startsWith('Konjunktiv II of the past'))![1]
    expect(past.test('Auch Zeit mit Freunden wäre wichtig, denn Beziehungen geben Kraft.')).toBe(false)
  })
  it('Passiv Präteritum is LIMITED: every sentence with wurde/wurden uses a verb of the closed list (veröffentlichen, gründen, bauen, erfinden, eröffnen, absagen)', () => {
    const hits = taught()
      .flatMap(sentences)
      .filter(x => /\b(wurde|wurden)\b/.test(x) && words(x) > 2)
    expect(hits.length).toBeGreaterThanOrEqual(8)
    for (const h of hits) expect(h, h).toMatch(PRAET_PARTICIPLES)
    expect(META.concepts[0].constructions!.map(c => [c.proficiency, c.forms])).toEqual([['P-lim', ['wurde', 'wurden']]])
  })
  it('lassen is LIMITED: every sentence with a form of lassen uses one of the six listed expressions; `sich lassen` appears only in the glossed reading', () => {
    const hits = taught()
      .flatMap(sentences)
      .filter(
        x =>
          /\b(lasse|lässt|lassen|[Ll]ass)\b/.test(x) && words(x) > 2 && !/lässt sich [^.!?]*erklären|lassen sich [^.!?]*erklären/.test(x),
      )
    expect(hits.length).toBeGreaterThanOrEqual(8)
    for (const h of hits) expect(h, h).toMatch(LASSEN_STEMS)
    const rec = META.concepts[1].constructions!
    expect(rec.map(c => c.proficiency)).toEqual(['R'])
    expect(rec[0].forms).toEqual(['lässt sich lösen', 'lässt sich erklären', 'lassen sich lösen', 'lassen sich erklären'])
  })
  it('the receptive constructions (sich lassen, Partizip I as adjective) appear in ONE reading each, glossed, and never in a task, a test, a hint, a keyword, a checklist item or a dialogue', () => {
    const re = /lässt sich (lösen|erklären)|lassen sich (lösen|erklären)|\bsteigenden\b/i
    const production = [
      ...UNIT_26_EXERCISES.flatMap(e => [e.prompt, e.answer, ...(e.options ?? []), ...(e.words ?? [])]),
      ...UNIT_26_FINAL.flatMap(q => [q.prompt, q.answer, ...q.options]),
      ...UNIT_26_WRITING.flatMap(w => [...w.mustInclude.flatMap(m => [m.label, ...m.patterns]), w.model]),
      ...UNIT_26_SPEAKING.flatMap(s => s.turns.flatMap(t => [t.ai, ...t.hints, ...t.keywords])),
      ...UNIT_26_GRAMMAR.flatMap(g => [
        g.speakPrompt.sample,
        ...g.speakPrompt.keywords,
        ...g.examples.map(x => x.de),
        ...g.reallife.map(x => x.de),
      ]),
      ...UNIT_26_GRAMMAR.flatMap(g => g.dialogue.map(x => x.text)),
      ...UNIT_26_LISTENING.flatMap(l => [...l.lines.map(x => x.text), ...l.questions.flatMap(q => [q.q, ...q.options])]),
      ...UNIT_26_VOCABULARY.map(v => v.example),
    ]
    for (const t of production) expect(re.test(t), t).toBe(false)
    expect(UNIT_26_READING.filter(r => /\bsteigenden\b/.test(r.body.join(' '))).map(r => r.id)).toEqual(['b1-re-26-01'])
    expect(UNIT_26_READING.filter(r => /lässt sich/.test(r.body.join(' '))).map(r => r.id)).toEqual(['b1-re-26-02'])
    expect(UNIT_26_READING[0].gloss.some(g => /steigenden/.test(g.word))).toBe(true)
    expect(UNIT_26_READING[1].gloss.some(g => /lässt sich/.test(g.word))).toBe(true)
    expect(META.receptiveOnly!.map(c => [c.label, c.forms])).toEqual([
      ['Partizip I als Adjektiv (die steigenden Besucherzahlen)', ['steigenden']],
    ])
  })
  it('the productive constructions are really used: Passiv with modal verbs, wurde + Partizip II, lassen, sagt/schreibt/fragt … dass/ob, Es heißt, laut + Dativ', () => {
    const all = taught().join(' ')
    expect(all).toMatch(/\b(muss|müssen|kann|können)\b[^.!?]*\b\w+ werden\b/)
    expect(all).toMatch(/\bwurde\b[^.!?]*\b(eröffnet|gebaut|veröffentlicht|abgesagt|gegründet)\b/)
    expect(all).toMatch(/\bwurden\b[^.!?]*\b(abgesagt|gegründet)\b/)
    expect(all).toMatch(/\bsagt, dass\b/)
    expect(all).toMatch(/\bschreibt, dass\b/)
    expect(all).toMatch(/\bfragte, ob\b/)
    expect(all).toMatch(/\bEs heißt, dass\b/)
    expect(all).toMatch(/\bLaut (dem|der|den) /)
  })
})

describe('media literacy and safety: everything is fictional, facts are separated from opinions and rumours, the discussion is balanced', () => {
  it('every news item, film and person is labelled as invented, and no real brand, medium or public person is named', () => {
    const all = [
      ...UNIT_26_READING.flatMap(r => [r.title, ...r.body]),
      ...UNIT_26_LISTENING.flatMap(l => [l.title, ...l.lines.map(x => x.text)]),
    ].join(' ')
    for (const r of UNIT_26_READING) expect(`${r.title} ${r.body.join(' ')}`, r.id).toMatch(/erfunden|Erfundene/)
    expect(UNIT_26_LISTENING[0].title + UNIT_26_LISTENING[0].lines[0].text).toMatch(/erfunden/)
    expect(all).not.toMatch(
      /Google|Facebook|WhatsApp|Instagram|TikTok|Twitter|YouTube|Apple|Samsung|Netflix|BBC|Spiegel|Tagesschau|Merkel|Putin|Trump|Biden|Musk/,
    )
    expect(UNIT_26_SPEAKING[0].goal.ru).toMatch(/вымышлен/)
    expect(UNIT_26_SPEAKING[0].goal.ky).toMatch(/ойдон чыгарылган/)
    expect(MICRO_M.situation.ru).toMatch(/вымышлен/)
    expect(MICRO_M.situation.ky).toMatch(/ойдон чыгарылган/)
    expect(UNIT_26.title).toBe('Medien, Technik und Nachrichten')
  })
  it('the unit teaches fact vs opinion vs rumour: Tatsache / Meinung / Gerücht / Es heißt appear in the texts, tasks and the final test', () => {
    const all = taught().join(' ')
    for (const w of ['Tatsache', 'Meinung', 'Gerücht', 'Es heißt', 'Quelle', 'überprüfen', 'kritisch']) expect(all, w).toContain(w)
    expect(UNIT_26_READING[0].body.join(' ')).toMatch(/Das ist nur ein Gerücht/)
    expect(UNIT_26_READING[1].body.join(' ')).toMatch(/Eine Meinung ist keine Tatsache/)
    expect(UNIT_26_SPEAKING[0].turns[3].hints.join(' ')).toMatch(/nur eine Meinung, keine Tatsache/)
    const q = UNIT_26_FINAL.find(x => x.id === 'b1-ft-26-14')!
    expect(q.answer).toBe('Der Film dauert zwei Stunden.')
    expect(q.options.filter(o => /dauert/.test(o))).toEqual([q.answer])
  })
  it('the discussion is balanced: both advantages and disadvantages of technology and social media are named (the main task requires one of each)', () => {
    expect(MAIN.mustInclude.some(m => /Vorteil und ein Nachteil/.test(m.label))).toBe(true)
    expect(MAIN.model).toMatch(/Vorteile/)
    expect(MAIN.model).toMatch(/Nachteil/)
    expect(MICRO_O.model).toMatch(/nützlich/)
    expect(MICRO_O.model).toMatch(/Datenschutz/)
    expect(MICRO_O.situation.ru).toMatch(/плюсы, и минусы/)
  })
  it('the media topics of the curriculum are covered: social network, privacy/password, news sources, technical problem (Handy reparieren lassen), advertising, streaming/film', () => {
    const all = germanTexts().join(' ')
    for (const w of [
      'Netzwerk',
      'Datenschutz',
      'Passwort',
      'Quelle',
      'Akku',
      'Bildschirm',
      'Werbung',
      'Stream',
      'Kundendienst',
      'Hauptfigur',
    ])
      expect(all, w).toContain(w)
  })
})

describe('vocabulary: 40 new items, none already taught', () => {
  const b = fullBundle()
  const earlier = new Set(b.vocabulary.filter(v => v.unit <= 25).flatMap(v => lemmaKeys(v.de)))
  it('exactly 40 items (target 38–42), ids v26-1 … v26-40, unique across the whole B1 vocabulary', () => {
    expect(UNIT_26_VOCABULARY).toHaveLength(40)
    expect(UNIT_26_VOCABULARY.map(v => v.id)).toEqual(Array.from({ length: 40 }, (_, i) => `v26-${i + 1}`))
    expect(UNIT_26_VOCABULARY.every(v => v.unit === 26)).toBe(true)
    const ids = B1_CONTENT.vocabulary.map(v => v.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toHaveLength(480)
  })
  it('no lemma repeats an A1, A2 or earlier B1 headword (the A2 media words are NOT repeated), and none is listed twice', () => {
    const keys = UNIT_26_VOCABULARY.flatMap(v => lemmaKeys(v.de))
    expect(keys.filter(k => earlier.has(k))).toEqual([])
    expect(new Set(keys).size).toBe(keys.length)
    const de = UNIT_26_VOCABULARY.map(v => v.de)
    for (const known of [
      'Nachricht',
      'Zeitung',
      'Internet',
      'Handy',
      'App',
      'Fernseher',
      'Foto',
      'herunterladen',
      'Reparatur',
      'reparieren',
      'empfehlen',
      'teilen',
      'spannend',
      'Verbindung',
    ])
      expect(de).not.toContain(known)
  })
  it('every item has article/plural where a noun, a German example, and independent Russian and Kyrgyz translations of the word and the example', () => {
    for (const v of UNIT_26_VOCABULARY) {
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
    const ex = UNIT_26_VOCABULARY.map(v => v.example)
    expect(new Set(ex).size).toBe(ex.length)
  })
  it('the planned themes are present, and no verb needs a prepositional object', () => {
    const de = UNIT_26_VOCABULARY.map(v => v.de)
    for (const w of [
      'Schlagzeile',
      'Meldung',
      'Quelle',
      'Tatsache',
      'Gerücht',
      'Datenschutz',
      'Passwort',
      'Nutzer',
      'Werbung',
      'Handlung',
      'Hauptfigur',
      'Spannung',
      'glaubwürdig',
      'unseriös',
      'veröffentlichen',
      'bewerten',
      'aktualisieren',
      'überprüfen',
    ])
      expect(de, w).toContain(w)
    for (const v of UNIT_26_VOCABULARY.filter(x => x.pos === 'verb'))
      expect(`${v.ru} ${v.ky}`, v.de).not.toMatch(/\((an|über|auf|von|für|mit|um|vor) /)
  })
  it('Wortbildung strand: -ung, -er, compounds and un- are present as items and explained in the metadata in three languages', () => {
    const de = UNIT_26_VOCABULARY.map(v => v.de)
    for (const w of ['Meldung', 'Handlung', 'Werbung', 'Leser', 'Nutzer', 'Schauspieler', 'Datenschutz', 'Bildschirm', 'unseriös'])
      expect(de, w).toContain(w)
    const n = META.strands.wortbildungNote!
    expect(n.de && n.ru && n.ky).toBeTruthy()
    expect(n.ky).not.toBe(n.ru)
    for (const w of ['-ung', '-er', 'Datenschutz', 'un-']) expect(n.de).toContain(w)
  })
  it('the unit REUSES established media words as revision in its texts without listing them as new', () => {
    const all = germanTexts().join(' ')
    for (const w of ['Nachricht', 'Zeitung', 'Internet', 'Handy', 'App', 'Foto|Fotos', 'Kino', 'empfehlen', 'reparier'])
      expect(all, w).toMatch(new RegExp(w))
  })
})

describe('texts: progressive targets (band for Units 23–26 and the curriculum text for Unit 26)', () => {
  it('2 readings of 140–180 words and 2 listening scripts of 120–150 words', () => {
    expect(UNIT_26_READING).toHaveLength(2)
    expect(UNIT_26_LISTENING).toHaveLength(2)
    for (const r of UNIT_26_READING) {
      const n = r.body.reduce((a, p) => a + words(p), 0)
      expect(n, r.id).toBeGreaterThanOrEqual(140)
      expect(n, r.id).toBeLessThanOrEqual(180)
    }
    for (const l of UNIT_26_LISTENING) {
      const n = l.lines.reduce((a, x) => a + words(x.text), 0)
      expect(n, l.id).toBeGreaterThanOrEqual(120)
      expect(n, l.id).toBeLessThanOrEqual(150)
    }
  })
  it('sentences stay short (95th percentile ≤ 18, longest ≤ 24 words)', () => {
    const lens = [
      ...UNIT_26_READING.flatMap(r => r.body.flatMap(sentences)),
      ...UNIT_26_LISTENING.flatMap(l => l.lines.flatMap(x => sentences(x.text))),
    ]
      .map(words)
      .sort((a, b) => a - b)
    expect(lens[lens.length - 1]).toBeLessThanOrEqual(24)
    expect(lens[Math.ceil(0.95 * lens.length) - 1]).toBeLessThanOrEqual(18)
  })
  it('every dialogue line carries a Russian and a Kyrgyz translation; questions have 3 distinct options, exactly one correct; answer positions vary', () => {
    for (const l of UNIT_26_LISTENING) for (const x of l.lines) expect(x.ru && x.ky && x.ky !== x.ru).toBeTruthy()
    const qs = [...UNIT_26_LISTENING.flatMap(l => l.questions), ...UNIT_26_READING.flatMap(r => r.questions)]
    for (const q of qs) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options).size).toBe(3)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(3)
    }
    expect(new Set(qs.map(q => q.answer)).size).toBe(3)
    expect(new Set(UNIT_26_READING.flatMap(r => r.questions.map(q => q.answer))).size).toBe(3)
    expect(new Set(UNIT_26_LISTENING.flatMap(l => l.questions.map(q => q.answer))).size).toBe(3)
  })
  it('the listening keywords all have a gloss in the unit vocabulary', () => {
    const de = new Set(UNIT_26_VOCABULARY.map(v => v.de))
    for (const l of UNIT_26_LISTENING) for (const k of l.keywords) expect(de.has(k), `${l.id}: ${k}`).toBe(true)
  })
  it('the listening texts are coherent: the radio news open and close like news, the shop dialogue greets and closes; numbers and names are present (listening strategy)', () => {
    expect(UNIT_26_LISTENING[0].lines[0].text).toMatch(/Nachrichten um zwölf Uhr/)
    expect(UNIT_26_LISTENING[0].lines.at(-1)!.text).toMatch(/Danke fürs Zuhören/)
    expect(UNIT_26_LISTENING[1].lines[0].text).toMatch(/Guten Tag/)
    expect(UNIT_26_LISTENING[1].lines.at(-1)!.text).toMatch(/Bis Freitag/)
    expect(UNIT_26_LISTENING[0].lines.map(x => x.text).join(' ')).toMatch(/drei Millionen Euro/)
    expect(UNIT_26_LISTENING[1].lines.map(x => x.text).join(' ')).toMatch(/89 Euro/)
    expect(META.strands.strategyNote!.de).toMatch(/Zahlen und Namen/)
  })
  it('the listening answer keys agree with the script (every correct option is supported by the text, no distractor is)', () => {
    const l1 = UNIT_26_LISTENING[0].lines.map(x => x.text).join(' ')
    const q1 = UNIT_26_LISTENING[0].questions
    expect(q1.map(q => q.options[q.answer])).toEqual([
      'Gestern.',
      'Drei Millionen Euro.',
      'Es heißt, dass der Platz zu nass ist.',
      'Es regnet.',
    ])
    expect(l1).toMatch(/gestern die neue Brücke eröffnet/)
    expect(l1).toMatch(/kostete drei Millionen Euro/)
    expect(l1).toMatch(/Am Nachmittag regnet es/)
    expect(l1).not.toMatch(/zwei Millionen|zwölf Millionen|schneit|sonnig/)
    const l2 = UNIT_26_LISTENING[1].lines.map(x => x.text).join(' ')
    const q2 = UNIT_26_LISTENING[1].questions
    expect(q2.map(q => q.options[q.answer])).toEqual(['Der Bildschirm.', '89 Euro.', 'Am Freitag.', 'Sie ist im Internet billiger.'])
    expect(l2).toMatch(/Der Bildschirm muss ausgetauscht werden/)
    expect(l2).toMatch(/am Freitag abholen/)
    expect(l2).toMatch(/Mein Mann sagt, dass die Reparatur im Internet billiger ist/)
    expect(l2).not.toMatch(/\b(19|99) Euro|Montag|Mittwoch/)
  })
  it('the reading answer keys agree with the text', () => {
    const [r1, r2] = UNIT_26_READING
    const t1 = r1.body.join(' ')
    expect(r1.questions.map(q => q.options[q.answer])).toEqual(['Gestern.', 'Bücher ausleihen.', 'richtig'])
    expect(t1).toMatch(/wurde gestern nach einem Jahr wieder eröffnet/)
    expect(t1).toMatch(/digital ausgeliehen werden/)
    expect(t1).toMatch(/Es heißt, dass die Stadt viel Geld ausgegeben hat\. Das ist nur ein Gerücht/)
    const t2 = r2.body.join(' ')
    expect(r2.questions.map(q => q.options[q.answer])).toEqual([
      'Sie verpasst den letzten Zug.',
      'falsch',
      'Allen, die ruhige Filme mögen.',
    ])
    expect(t2).toMatch(/verpasst nachts den letzten Zug/)
    expect(t2).toMatch(/Laut den Kritikern in der Zeitung ist der Film zu langsam/)
    expect(t2).toMatch(/allen empfehlen, die ruhige Filme mögen/)
  })
  it('the reading glosses give Russian and Kyrgyz for every word, independently', () => {
    for (const r of UNIT_26_READING) for (const g of r.gloss) expect(g.ky).not.toBe(g.ru)
    for (const r of UNIT_26_READING) for (const g of r.gloss) expect(g.grammarKy).not.toBe(g.grammar)
  })
  it('listening uses the existing browser text-to-speech lab: no audio file, no claim of verified playback; no assessment item depends on audio', () => {
    for (const l of UNIT_26_LISTENING) expect(Object.keys(l)).not.toContain('audio')
    for (const q of UNIT_26_FINAL) expect(q.skill).not.toBe('listening')
  })
  it('speaking: one scenario of 6 turns (recommend a fictional film); in turn 4 the friend quotes "Im Netz heißt es …" and the learner must tell opinion from fact', () => {
    const [s] = UNIT_26_SPEAKING
    expect(s.turns).toHaveLength(6)
    expect(s.level).toBe('B1')
    for (const t of s.turns) {
      expect(t.aiRu && t.aiKy).toBeTruthy()
      expect(t.hints.length).toBeGreaterThanOrEqual(3)
      expect(t.keywords.length).toBeGreaterThanOrEqual(3)
      for (const k of t.keywords) expect(k).toBe(k.toLowerCase())
    }
    expect(s.turns[3].ai).toMatch(/Im Netz heißt es, dass/)
    expect(s.turns[3].keywords).toEqual(expect.arrayContaining(['meinung', 'tatsache']))
    expect(s.turns[0].hints.join(' ')).toMatch(/empfehlen/)
    expect(s.titleRu && s.titleKy).toBeTruthy()
  })
})

describe('writing: the main comment and the two micro-tasks (opinion, mediation)', () => {
  it('main task: informal, 80 words minimum, six expected elements, a model that meets every one, with a modal Passiv, lassen and a source (laut / es heißt)', () => {
    expect(MAIN).toMatchObject({ id: 'b1-wr-26-01', minWords: 80, level: 'B1', unit: 26, formal: false })
    expect(words(MAIN.model)).toBeGreaterThanOrEqual(80)
    expect(MAIN.mustInclude).toHaveLength(6)
    for (const m of MAIN.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky).toBeTruthy()
      expect(m.explain!.ky).not.toBe(m.explain!.ru)
      expect(
        m.patterns.some(p => MAIN.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(MAIN.model).toMatch(/\b(muss|kann|müssen|können)\b[^.!?]*\b\w+ werden\./)
    expect(MAIN.model).toMatch(/\blasse\b[^.!?]*\b(ändern|prüfen)\b/)
    expect(MAIN.model).toMatch(/Laut dem Artikel/)
    expect(MAIN.model).toMatch(/Es heißt, dass/)
    for (const t of MAIN.tips) expect(t.ky).not.toBe(t.ru)
  })
  it('the opinion micro-task (kind "meinung"): opinion + reason + a word of the topic; its model meets every element and is balanced (advantage and a risk)', () => {
    expect(MICRO_O).toMatchObject({ id: 'b1-wr-26-02', minWords: 30, level: 'B1', unit: 26, formal: false })
    expect(words(MICRO_O.model)).toBeGreaterThanOrEqual(30)
    expect(MICRO_O.mustInclude).toHaveLength(3)
    for (const m of MICRO_O.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky && m.explain.ky !== m.explain.ru).toBeTruthy()
      expect(
        m.patterns.some(p => MICRO_O.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(MICRO_O.model).toMatch(/\bIch finde\b/)
    expect(MICRO_O.model).toMatch(/\bdenn\b|\bweil\b/)
  })
  it('the mediation micro-task (kind "mediation"): relays a (fictional) shop message in own words — pronouns shifted, no copying, every fact kept', () => {
    expect(MICRO_M).toMatchObject({ id: 'b1-wr-26-03', minWords: 30, level: 'B1', unit: 26, formal: false })
    expect(words(MICRO_M.model)).toBeGreaterThanOrEqual(30)
    expect(MICRO_M.mustInclude).toHaveLength(4)
    for (const m of MICRO_M.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky && m.explain.ky !== m.explain.ru).toBeTruthy()
      expect(
        m.patterns.some(p => MICRO_M.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(MICRO_M.model).toMatch(/schreibt, dass/)
    expect(MICRO_M.model).not.toMatch(/\bIhr\b|\bSie können\b|\bIhren\b/)
    for (const f of ['Freitag', '89 Euro', 'Ausweis']) expect(MICRO_M.model).toContain(f)
    for (const f of ['Freitag', '89 Euro', 'Ausweis']) expect(MICRO_M.situation.ru).toContain(f)
  })
  it('both micro-tasks are declared in the metadata with the right kinds', () => {
    expect(META.microTasks).toEqual([
      { kind: 'meinung', taskId: 'b1-wr-26-02' },
      { kind: 'mediation', taskId: 'b1-wr-26-03' },
    ])
  })
  it('the writing tips tell the learner that the app checks only length and expected words and that quality is self-assessed (all tasks)', () => {
    for (const w of UNIT_26_WRITING) {
      expect(w.tips.map(t => t.ru).join(' ')).toMatch(/только объём и ожидаемые слова/)
      expect(w.tips.map(t => t.ky).join(' ')).toMatch(/көлөмдү жана күтүлгөн сөздөрдү гана/)
    }
  })
})

describe('exercises: answer keys are correct and unique', () => {
  it('10 handwritten exercises: 8 on the three concepts (3 + 2 + 3) + 2 recycled without a concept; types fill / choice / order; both languages everywhere', () => {
    expect(UNIT_26_EXERCISES).toHaveLength(10)
    expect(UNIT_26_EXERCISES.map(e => e.id)).toEqual(Array.from({ length: 10 }, (_, i) => `b1-ex-26-${String(i + 1).padStart(2, '0')}`))
    const withConcept = UNIT_26_EXERCISES.filter(e => e.concept)
    expect(withConcept).toHaveLength(8)
    expect(CONCEPTS.map(c => withConcept.filter(e => e.concept === c).length)).toEqual([3, 2, 3])
    expect(UNIT_26_EXERCISES.filter(e => !e.concept).map(e => e.id)).toEqual(['b1-ex-26-09', 'b1-ex-26-10'])
    expect(['fill', 'choice', 'order'].map(t => UNIT_26_EXERCISES.filter(e => e.type === t).length)).toEqual([4, 4, 2])
    for (const e of UNIT_26_EXERCISES) {
      expect(e.why.ru && e.why.ky).toBeTruthy()
      expect(e.why.ky).not.toBe(e.why.ru)
      expect(e.promptRu && e.promptKy, e.id).toBeTruthy()
    }
  })
  it('every choice / fill item: 3 distinct options and the answer is among them exactly once; every order item is a true permutation that is not pre-solved', () => {
    for (const e of UNIT_26_EXERCISES) {
      if (e.type === 'order') {
        expect([...(e.words ?? [])].sort().join('|')).toBe(e.answer.split(' ').sort().join('|'))
        expect(e.words!.join(' ')).not.toBe(e.answer)
      } else {
        expect(e.options).toHaveLength(3)
        expect(new Set(e.options).size).toBe(3)
        expect(e.options!.filter(o => o === e.answer)).toHaveLength(1)
      }
    }
    for (const e of UNIT_26_EXERCISES.filter(x => x.type === 'fill')) expect(e.prompt.match(/___/g)).toHaveLength(1)
  })
  it('the text-level item (ex 08): three sentences per option, exactly one correct, and the wrong ones each contain a real learner error', () => {
    const e = UNIT_26_EXERCISES.find(x => x.id === 'b1-ex-26-08')!
    for (const o of e.options!) expect(sentences(o)).toHaveLength(3)
    const wrong = e.options!.filter(o => o !== e.answer)
    expect(wrong.some(o => /dass die Bibliothek ist länger/.test(o))).toBe(true)
    expect(wrong.some(o => /dass ich die Meldung gelesen hat/.test(o))).toBe(true)
    expect(e.answer).not.toMatch(/Bibliothek ist länger|dass ich/)
  })
  it('the exercises really use their construction in the answer, and stay inside the closed lists', () => {
    const by = (id: string) => UNIT_26_EXERCISES.find(e => e.id === id)!
    expect(by('b1-ex-26-01').answer).toBe('werden')
    expect(by('b1-ex-26-02').answer).toMatch(/wurde gestern veröffentlicht\.$/)
    expect(by('b1-ex-26-03').answer).toMatch(/muss geändert werden\.$/)
    expect(by('b1-ex-26-04').answer).toBe('lasse')
    expect(by('b1-ex-26-05').answer).toMatch(/lässt .* reparieren\.$/)
    expect(by('b1-ex-26-06').answer).toBe('er')
    expect(by('b1-ex-26-07').answer).toMatch(/fragte, ob ich .* gelesen habe\.$/)
    for (const e of UNIT_26_EXERCISES.filter(x => x.concept === 'b1-passiv-praeteritum-modal' && /wurde/.test(`${x.prompt} ${x.answer}`)))
      expect(e.answer).toMatch(PRAET_PARTICIPLES)
  })
})

describe('final test: structure, answer keys and scoring data', () => {
  it('15 questions = 8 grammar (2 Passiv, 2 lassen, 2 Wiedergeben, 2 recycled ↻) + 3 vocabulary + 4 reading, no listening; ≥ 2 gap-fill', () => {
    expect(UNIT_26_FINAL.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `b1-ft-26-${String(i + 1).padStart(2, '0')}`))
    const by = (s: string) => UNIT_26_FINAL.filter(q => q.skill === s)
    expect([by('grammar').length, by('vocabulary').length, by('reading').length, by('listening').length]).toEqual([8, 3, 4, 0])
    expect(by('grammar').filter(q => /___/.test(q.prompt)).length).toBeGreaterThanOrEqual(2)
    expect(CONCEPTS.map(c => by('grammar').filter(q => q.concept === c).length)).toEqual([2, 2, 2])
    expect(
      by('grammar')
        .filter(q => q.concept && !CONCEPTS.includes(q.concept))
        .map(q => q.concept),
    ).toEqual(['b1-passiv-praesens', 'b1-relativsaetze-nom-akk'])
    expect(UNIT_26_TEST).toMatchObject({ id: 'unit-26', kind: 'topic', level: 'B1', unit: 26, size: 15 })
  })
  it('the recycled concepts really exist in earlier units (Units 24 and 23)', () => {
    const owner = new Map(fullBundle().grammar.map(g => [g.id, g.unit]))
    for (const q of UNIT_26_FINAL.filter(x => x.concept && !CONCEPTS.includes(x.concept)))
      expect(owner.get(q.concept!)! < 26, q.concept).toBe(true)
  })
  it('options: 3 distinct each, the answer appears exactly once, both languages with an explanation; positions are 5 / 5 / 5, never three in a row', () => {
    const pos: number[] = []
    for (const q of UNIT_26_FINAL) {
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
  it("the reporting question tests the pronoun shift: exactly one option reports Lara's sentence correctly", () => {
    const q = UNIT_26_FINAL.find(x => x.id === 'b1-ft-26-05')!
    expect(q.options.filter(o => /^Lara sagt, dass sie die Nachricht gelesen hat\.$/.test(o))).toEqual([q.answer])
    expect(q.options.filter(o => /dass ich/.test(o))).toHaveLength(1)
  })
  it('the final test shares no prompt (except the generic instruction line) and no answer with the revision exercises, and no prompt with another question', () => {
    const ex = new Set(UNIT_26_EXERCISES.flatMap(e => [e.prompt, e.answer]))
    const generic = new Set(['Welcher Satz ist richtig?', 'Bilde den Satz.'])
    for (const q of UNIT_26_FINAL) {
      if (!generic.has(q.prompt)) expect(ex.has(q.prompt), q.id).toBe(false)
      expect(ex.has(q.answer), q.id).toBe(false)
    }
    const prompts = UNIT_26_FINAL.map(q => q.prompt).filter(p => !generic.has(p))
    expect(new Set(prompts).size).toBe(prompts.length)
  })
  it('scoring data: every question has its answer among its options (a perfect run is 15/15) and the pass mark of the existing rule (70 %) is 11 of 15', () => {
    expect(UNIT_26_FINAL.filter(q => q.options.includes(q.answer)).length).toBe(15)
    expect(Math.ceil(0.7 * 15)).toBe(11)
  })
})

describe('unit metadata, objectives, topic evidence and the spaced-revision set', () => {
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
    expect(META.scenario.id).toBe('b1-sp-26-01')
    // the learner-facing German of the metadata does not use the subjunctive of indirect speech either
    expect(JSON.stringify(META.scenario)).not.toMatch(/\bsei\b|\bheiße\b/)
  })
  it('the classification is the approved one: P/M (Präteritum P-lim), P-lim/L with a closed list of 6 and receptive `sich lassen`, P/M; the placement of `lassen` (X-1; mislabelled D-1 before the P1 remediation) is still OPEN', () => {
    expect(META.concepts.map(c => [c.conceptId, c.proficiency, c.load, c.role])).toEqual([
      ['b1-passiv-praeteritum-modal', 'P', 'M', 'new'],
      ['b1-lassen', 'P-lim', 'L', 'new'],
      ['b1-wiedergeben-indikativ', 'P', 'M', 'new'],
    ])
    expect(META.concepts[1].closedList).toHaveLength(6)
    expect(new Set(META.concepts[1].closedList).size).toBe(6)
    const spec = B1_CURRICULUM.units.find(u => u.unit === 26)!
    expect(spec.concepts[1].expertReview).toMatchObject({ status: 'pending', decision: 'X-1' })
    expect(spec.concepts[0].expertReview).toBeUndefined()
    expect(spec.concepts[2].expertReview).toBeUndefined()
  })
  it('the topic "book-film" is evidenced by real items of the unit', () => {
    const items = new Set([
      ...UNIT_26_VOCABULARY.map(v => v.id),
      ...UNIT_26_READING.map(r => r.id),
      ...UNIT_26_LISTENING.map(l => l.id),
      ...UNIT_26_EXERCISES.map(e => e.id),
      ...UNIT_26_WRITING.map(w => w.id),
      'b1-sp-26-01',
    ])
    expect(META.topics!.map(t => t.topic)).toEqual(['book-film'])
    for (const t of META.topics!) {
      expect(t.itemIds.length).toBeGreaterThanOrEqual(5)
      for (const id of t.itemIds) expect(items.has(id), id).toBe(true)
    }
  })
  it('spaced revision: 4 words of Unit 25, 2 of Unit 23, 3+ from A2 (Unit 16) — real, existing vocabulary ids', () => {
    const vocab = new Map(fullBundle().vocabulary.map(v => [v.id, v.unit]))
    expect(META.revision!.fromPrevious.map(id => vocab.get(id))).toEqual([25, 25, 25, 25])
    expect(META.revision!.fromThirdBack.map(id => vocab.get(id))).toEqual([23, 23])
    expect(META.revision!.fromA2.length).toBeGreaterThanOrEqual(2)
    for (const id of META.revision!.fromA2) expect(vocab.get(id), id).toBe(16)
  })
  it('the two kinds of vocabulary are kept apart: the 40 new items of Unit 26 vs. revision ids that are all earlier words', () => {
    const newIds = new Set(UNIT_26_VOCABULARY.map(v => v.id))
    const rev = [...META.revision!.fromPrevious, ...META.revision!.fromThirdBack, ...META.revision!.fromA2]
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
    walk(ALL_DATA(), 'unit26')
    expect(missing).toEqual([])
  })
  it('the Russian and the Kyrgyz are of comparable size (no half-translated string)', () => {
    const bad: string[] = []
    for (const v of UNIT_26_VOCABULARY) {
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
      'шарттуу ыңгай',
      'кайтарым',
      'страдательдик',
      'пассивдик',
      'туура эмес сөз',
    ])
      expect(all, bad).not.toContain(bad)
  })
  it('every Kyrgyz string is written in Cyrillic (quoted German allowed) and the unit has a large Kyrgyz body', () => {
    const ky = kyTexts()
    expect(ky.length).toBeGreaterThan(300)
    expect(ky.filter(t => t.length > 25 && !/[А-Яа-яЁёҢңӨөҮү]/.test(t))).toEqual([])
  })
  it('the explanations of exercises and final-test questions differ between Russian and Kyrgyz', () => {
    for (const e of UNIT_26_EXERCISES) expect(e.why.ky).not.toBe(e.why.ru)
    for (const q of UNIT_26_FINAL) expect(q.why.ky).not.toBe(q.why.ru)
  })
})

describe('validator and assessment honesty', () => {
  it('the validator finds 0 errors and 0 warnings in the real bundle; the review flags of Unit 26 are exactly: missing human CEFR sign-off and the open decision D-1 for `lassen`', () => {
    const is = validateContent(fullBundle())
    expect(is.filter(i => i.severity === 'error')).toEqual([])
    expect(is.filter(i => i.severity === 'warning')).toEqual([])
    expect(is.filter(i => i.rule.startsWith('b1-') && i.severity !== 'review')).toEqual([])
    expect(
      is
        .filter(i => i.where === 'units:26' && i.severity === 'review')
        .map(i => i.rule)
        .sort(),
    ).toEqual(['beta-review-pending', 'beta-review-pending', 'cefr-signoff-missing']) // + the Beta flags (ru, ky) since the B1 Beta launch
    expect(is.filter(i => i.where === 'grammar:b1-lassen' && i.severity === 'review').map(i => i.rule)).toEqual([
      'b1-expert-review-pending',
    ])
    expect(
      is.filter(
        i =>
          /^(grammar:b1-(passiv-praeteritum|wiedergeben)|reading:b1-re-26|listening:b1-li-26|writing:b1-wr-26)/.test(i.where) &&
          i.severity === 'review',
      ),
    ).toEqual([])
  })
  it('the unit never claims a CEFR level, a certificate or an exam result', () => {
    const all = JSON.stringify(ALL_DATA(), (k, v) => (k === 'source' ? undefined : v))
    expect(all).not.toMatch(/zertifikat|certificate|сертификат|B1 erreicht|достигнут уровень|official/i)
    expect(all).not.toMatch(/\bCEFR\b/)
  })
  it('speaking and writing feedback is a checklist and a self-assessment: no numeric CEFR or score field in the unit data', () => {
    const all = JSON.stringify([UNIT_26_SPEAKING, UNIT_26_WRITING])
    expect(all).not.toMatch(/"(score|points|cefrScore|level_score)"/)
  })
  it('the provenance says the material is original, fictional where it reports news, and NOT reviewed', () => {
    for (const x of [...UNIT_26_GRAMMAR, ...UNIT_26_READING, ...UNIT_26_LISTENING, ...UNIT_26_SPEAKING, ...UNIT_26_WRITING]) {
      expect(x.source?.kind).toBe('authored')
      expect(x.source?.author).toMatch(/pending independent CEFR, Russian and Kyrgyz review/)
    }
  })
})
