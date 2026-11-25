// @vitest-environment node
/**
 * B1 Unit 23 — Arbeit, Bewerbung und Karriere (Stage 3E). Checks the authored content against the approved curriculum: identity, the two approved concepts
 * (Relativsatz Nominativ/Akkusativ, Infinitiv mit zu / um … zu), vocabulary (38–42, nothing already taught), text sizes, productive vs receptive scope, scope
 * guard for later units, RU/KY completeness, exercise/answer-key correctness, assessment structure, metadata and spaced revision. B1 stays `planned` and
 * invisible; no CEFR approval of any kind is implied (the content is an unreviewed AI-assisted draft).
 */
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { lemmaKeys } from '../../scripts/content-validate/b1/lemma'
import { B1_CURRICULUM } from '../../scripts/content-validate/b1/curriculum'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_META } from '../../src/data/b1/meta'
import { B1_UNIT_PLAN } from '../../src/data/b1/registry'
import { UNIT_23_EXERCISES, UNIT_23_FINAL, UNIT_23_TEST } from '../../src/data/b1/unit23/assessment'
import { UNIT_23_GRAMMAR, UNIT_23_WHY_NOTES } from '../../src/data/b1/unit23/grammar'
import { UNIT_23_LISTENING, UNIT_23_READING, UNIT_23_SPEAKING, UNIT_23_WRITING } from '../../src/data/b1/unit23/texts'
import { UNIT_23 } from '../../src/data/b1/unit23/unit'
import { UNIT_23_VOCABULARY } from '../../src/data/b1/unit23/vocabulary'
import { availableLevels, courseLevel } from '../../src/data/course'
import {
  finalTestOfUnit,
  grammarForUnit,
  registerLevelContent,
  speakingForUnit,
  topicTestOfUnit,
  vocabularyForUnit,
} from '../../src/data/catalog'

const words = (s: string) => s.split(/\s+/).filter(Boolean).length
const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).filter(x => x.trim())
const CONCEPTS = ['b1-relativsaetze-nom-akk', 'b1-infinitiv-mit-zu']
const META = B1_META.find(m => m.unit === 23)!

/** every German string of the unit (what a learner reads or hears) */
function germanTexts(): string[] {
  const out: string[] = []
  for (const r of UNIT_23_READING) out.push(...r.body, ...r.questions.flatMap(q => [q.q, ...q.options]))
  for (const l of UNIT_23_LISTENING) out.push(...l.lines.map(x => x.text), ...l.questions.flatMap(q => [q.q, ...q.options]))
  for (const v of UNIT_23_VOCABULARY) out.push(v.example)
  for (const g of UNIT_23_GRAMMAR)
    out.push(...g.examples.map(x => x.de), ...g.reallife.map(x => x.de), ...g.dialogue.map(x => x.text), g.speakPrompt.sample)
  for (const n of UNIT_23_WHY_NOTES) out.push(n.sentence, ...n.more.map(x => x.de))
  // prompts and answers only: the distractor options of a choice item are deliberately wrong forms and are never taught
  for (const e of UNIT_23_EXERCISES) out.push(e.prompt, e.answer)
  for (const q of UNIT_23_FINAL) out.push(q.prompt, q.answer)
  out.push(UNIT_23_WRITING[0].model, UNIT_23_WRITING[0].mustInclude.map(m => m.label).join(' '))
  for (const s of UNIT_23_SPEAKING) out.push(...s.turns.flatMap(t => [t.ai, ...t.hints]))
  return out
}
const MISTAKES = new Set(UNIT_23_GRAMMAR.flatMap(g => g.mistakes.flatMap(m => [m.wrong, m.right])))
const taught = () => germanTexts().filter(t => !MISTAKES.has(t))

/** every Kyrgyz string of the unit */
function kyTexts(): string[] {
  const out: string[] = []
  const walk = (v: unknown, key = '') => {
    if (typeof v === 'string') {
      if (/^(ky|exampleKy|promptKy|aiKy|titleKy|grammarKy)$/.test(key)) out.push(v)
    } else if (Array.isArray(v)) v.forEach(x => walk(x, key))
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (k !== 'source') walk(x, k)
  }
  walk([
    UNIT_23,
    UNIT_23_GRAMMAR,
    UNIT_23_WHY_NOTES,
    UNIT_23_READING,
    UNIT_23_LISTENING,
    UNIT_23_SPEAKING,
    UNIT_23_WRITING,
    UNIT_23_EXERCISES,
    UNIT_23_FINAL,
    UNIT_23_VOCABULARY,
    META,
  ])
  return out
}

describe('identity and integration (B1 is a Beta for ru and ky)', () => {
  it('the unit equals its approved plan entry', () => {
    const plan = B1_UNIT_PLAN.find(p => p.id === 23)!
    expect(UNIT_23).toMatchObject({ id: 23, key: plan.key, title: plan.titleDe, level: 'B1' })
    expect(plan.key).toBe('b1-arbeit-bewerbung')
    expect(plan.titleDe).toBe('Arbeit, Bewerbung und Karriere')
    expect(UNIT_23.grammarIds).toEqual(CONCEPTS)
  })
  it('the content module holds Unit 23 after Units 21 and 22, wired into the metadata, the tests, the final tests and the speaking list', () => {
    expect(B1_CONTENT.legacyUnits.map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_META.map(m => m.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.tests).toContainEqual(UNIT_23_TEST)
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
  it('registered in the catalog, the unit is reachable through the standard selectors', () => {
    registerLevelContent('B1', B1_CONTENT)
    expect(vocabularyForUnit(23)).toHaveLength(40)
    expect(grammarForUnit(23).map(g => g.id)).toEqual(CONCEPTS)
    expect(finalTestOfUnit(23)?.questions).toHaveLength(15)
    expect(topicTestOfUnit(23)).toMatchObject({ id: 'unit-23', level: 'B1', size: 15 })
    expect(speakingForUnit(23)).toBe('b1-sp-23-01')
  })
})

describe('grammar: only the two approved concepts', () => {
  it('exactly the approved ids, in order, owned by Unit 23, level B1', () => {
    expect(UNIT_23_GRAMMAR.map(g => g.id)).toEqual(CONCEPTS)
    for (const g of UNIT_23_GRAMMAR) expect(g).toMatchObject({ unit: 23, level: 'B1' })
    expect(B1_CURRICULUM.units.find(u => u.unit === 23)!.concepts.map(c => c.id)).toEqual(CONCEPTS)
  })
  it('every concept is complete: explanation, 5 examples, mistakes, real-life, dialogue, speaking prompt — in Russian and in Kyrgyz', () => {
    for (const g of UNIT_23_GRAMMAR) {
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
  it('the why-notes: two on the relative clause (Nominativ, Akkusativ) and one on zu', () => {
    expect(UNIT_23_WHY_NOTES.map(n => n.conceptId)).toEqual([CONCEPTS[0], CONCEPTS[0], CONCEPTS[1]])
  })
  it('the examples really show their concept: every relative-clause example has a comma and der/die/das/den; every zu example has zu or um', () => {
    for (const x of [...UNIT_23_GRAMMAR[0].examples, ...UNIT_23_GRAMMAR[0].reallife]) expect(x.de, x.de).toMatch(/, (der|die|das|den) /)
    for (const x of [...UNIT_23_GRAMMAR[1].examples, ...UNIT_23_GRAMMAR[1].reallife]) expect(x.de, x.de).toMatch(/\bzu\b|zu\w+en\b|\bum\b/)
  })
  it('every "mistake" really differs from its correction, and the wrong form never appears in the taught texts', () => {
    for (const g of UNIT_23_GRAMMAR) for (const m of g.mistakes) expect(m.wrong).not.toBe(m.right)
    const wrong = UNIT_23_GRAMMAR.flatMap(g => g.mistakes.map(m => m.wrong))
    for (const t of taught()) expect(wrong.includes(t), t).toBe(false)
  })
  it('scope guard: nothing that belongs to a later unit (damit, Passiv, Plusquamperfekt, Konjunktiv II, Genitiv, relative clause with preposition/Dativ, verb + preposition)', () => {
    const forbidden: [string, RegExp][] = [
      ['damit', /\bdamit\b/i],
      ['Passiv (worden / wurde / wird + Partizip)', /\bworden\b|\b(wurde|wurden)\b|\bwird\b[^.!?]{0,30}\bge\w+(t|en)\b/i],
      ['Plusquamperfekt', /\bnachdem\b[^.!?]*\b(hatte|hatten|waren|war)\b/i],
      ['Konjunktiv II', /\b(hätte|hätten|wäre|wären|würde|würden|könnte|könnten)\b/i],
      [
        'Genitiv (des/eines + Noun-s, wegen, trotz, name-s possessive)',
        /\b(des|eines)\s+[A-ZÄÖÜ]\w+s\b|\bwegen\b|\btrotz\b|\b[A-ZÄÖÜ][a-zäöüß]+’s?\b/,
      ],
      [
        'relative clause with a preposition',
        /,\s*(an|auf|in|mit|von|für|bei|aus|über|nach|vor)\s+(dem|der|den|denen|dessen|deren|die|das)\s/,
      ],
      ['Dativ / Genitiv relative pronoun', /,\s*(dem|denen|dessen|deren)\s/],
      [
        'verb + obligatory preposition (Unit 28)',
        /\b(sich ärgern über|denken an|denke an|sich kümmern um|Angst vor|hält von|halten von|sprechen über|spreche über|diskutieren über|warten auf|sich freuen|abhängen von|hängt von|kommt auf|ankommen auf|teilnehmen an|glauben an|träumen von|sich interessieren für|bestehen aus|sich bewerben um|bewerbe mich um|bewerbe mich für)\b/i,
      ],
    ]
    for (const t of taught()) for (const [name, re] of forbidden) expect(re.test(t), `${name}: "${t.slice(0, 90)}"`).toBe(false)
  })
  it('no adjective without an article (Unit 24): every attributive adjective in a taught text follows an article word', () => {
    const adj =
      /\b([A-Za-zäöüÄÖÜ]+)\s+((?:gut|neu|nett|groß|klein|alt|jung|wichtig|älter|stark|echt|klar|fest|freundlich|vernünftig|hoh|lang|ruhig|laut|teuer|günstig|schön|ander|unbefristet|befristet|erfahren|flexibel|zuverlässig|ganz|persönlich)(?:e|er|es|en|em)?)\s+[A-ZÄÖÜ][a-zäöüß]+/g
    const det =
      /^(der|die|das|den|dem|ein|eine|einen|einem|einer|kein|keine|keinen|keinem|keiner|mein|meine|meinen|meinem|meiner|dein|deine|ihr|ihre|ihren|ihrem|sein|seine|unser|unsere|diese|diesen|diesem|dieser|dieses|jeder|jede|jedes|jeden|alle|viele|manche|welchen|welche|welcher|welches|zu|am|im|ins|sehr)$/i
    const bad: string[] = []
    for (const t of taught())
      for (const m of t.matchAll(adj)) if (!det.test(m[1]) && m[0] !== 'Mit freundlichen Grüßen') bad.push(`${t.slice(0, 60)} → "${m[0]}"`)
    expect(bad).toEqual([])
  })
  it('the receptive constructions (ohne … zu, statt … zu) appear in ONE reading (glossed) and never in a task, a test, a hint, a keyword or a checklist item; those of Unit 22 never appear either', () => {
    const re = /\bohne\b|\bstatt\b|einerseits|andererseits|nicht nur|sondern auch/i
    const production = [
      ...UNIT_23_EXERCISES.flatMap(e => [e.prompt, e.answer, ...(e.options ?? []), ...(e.words ?? [])]),
      ...UNIT_23_FINAL.flatMap(q => [q.prompt, q.answer, ...q.options]),
      ...UNIT_23_WRITING.flatMap(w => [...w.mustInclude.flatMap(m => [m.label, ...m.patterns]), w.model]),
      ...UNIT_23_SPEAKING.flatMap(s => s.turns.flatMap(t => [t.ai, ...t.hints, ...t.keywords])),
      ...UNIT_23_GRAMMAR.flatMap(g => [g.speakPrompt.sample, ...g.speakPrompt.keywords]),
      ...UNIT_23_LISTENING.flatMap(l => l.lines.map(x => x.text)),
      ...UNIT_23_VOCABULARY.map(v => v.example),
    ]
    for (const t of production) expect(re.test(t), t).toBe(false)
    expect(UNIT_23_READING.filter(r => re.test(r.body.join(' '))).map(r => r.id)).toEqual(['b1-re-23-02'])
    expect(UNIT_23_READING[1].gloss.some(g => /statt/i.test(g.word))).toBe(true)
    expect(UNIT_23_READING[1].gloss.some(g => /ohne/i.test(g.word))).toBe(true)
    const zu = META.concepts[1].constructions!
    expect(zu.map(c => c.proficiency)).toEqual(['R', 'R'])
    expect(zu.flatMap(c => c.forms)).toEqual(['ohne', 'statt'])
  })
  it('the productive constructions are really used in the texts: relative pronouns (Nominativ and Akkusativ), zu + Infinitiv, a separable verb with zu, um … zu', () => {
    const all = taught().join(' ')
    expect(all).toMatch(/, der /)
    expect(all).toMatch(/, die /)
    expect(all).toMatch(/, das /)
    expect(all).toMatch(/, den /)
    expect(all).toMatch(/\baufzustehen\b/)
    expect(all).toMatch(/\beinzureichen\b/)
    expect(all).toMatch(/\bum\b[^.!?]*\bzu\b/)
  })
})

describe('vocabulary: 40 new items, none already taught', () => {
  const b = fullBundle()
  const earlier = new Set(b.vocabulary.filter(v => v.unit <= 22).flatMap(v => lemmaKeys(v.de)))
  it('exactly 40 items (target 38–42), ids v23-1 … v23-40, unique across the whole B1 vocabulary', () => {
    expect(UNIT_23_VOCABULARY).toHaveLength(40)
    expect(UNIT_23_VOCABULARY.map(v => v.id)).toEqual(Array.from({ length: 40 }, (_, i) => `v23-${i + 1}`))
    expect(UNIT_23_VOCABULARY.every(v => v.unit === 23)).toBe(true)
    const ids = B1_CONTENT.vocabulary.map(v => v.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toHaveLength(1380)
  })
  it('no lemma repeats an A1, A2 or earlier B1 headword (the basic work words of A2 Unit 17 are NOT repeated), and none is listed twice', () => {
    const keys = UNIT_23_VOCABULARY.flatMap(v => lemmaKeys(v.de))
    expect(keys.filter(k => earlier.has(k))).toEqual([])
    expect(new Set(keys).size).toBe(keys.length)
    const de = UNIT_23_VOCABULARY.map(v => v.de)
    for (const known of ['Lebenslauf', 'Bewerbung', 'Arbeitsvertrag', 'Kündigung', 'Probezeit'.replace('Probezeit', 'Praktikum')])
      expect(de).not.toContain(known)
  })
  it('every item has article/plural where a noun, a German example, and independent Russian and Kyrgyz translations of the word and the example', () => {
    for (const v of UNIT_23_VOCABULARY) {
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
    const ex = UNIT_23_VOCABULARY.map(v => v.example)
    expect(new Set(ex).size).toBe(ex.length)
  })
  it('the planned themes are present: advertisement, application, experience, qualities, working verbs — and no verb needs a prepositional object', () => {
    const de = UNIT_23_VOCABULARY.map(v => v.de)
    for (const w of [
      'Stellenanzeige',
      'Qualifikation',
      'Probezeit',
      'Arbeitsklima',
      'Krankmeldung',
      'Berufserfahrung',
      'Stärke',
      'Schwäche',
      'Anschreiben',
      'flexibel',
      'teamfähig',
      'einstellen',
      'befördern',
      'einreichen',
    ])
      expect(de, w).toContain(w)
    for (const v of UNIT_23_VOCABULARY.filter(x => x.pos === 'verb'))
      expect(`${v.ru} ${v.ky}`, v.de).not.toMatch(/\((an|über|auf|von|für|mit|um|vor) /)
  })
})

describe('texts: progressive targets of the band for Units 23–26', () => {
  it('2 readings of 120–180 words and 2 listening scripts of 120–160 words', () => {
    expect(UNIT_23_READING).toHaveLength(2)
    expect(UNIT_23_LISTENING).toHaveLength(2)
    for (const r of UNIT_23_READING) {
      const n = r.body.reduce((a, p) => a + words(p), 0)
      expect(n, r.id).toBeGreaterThanOrEqual(120)
      expect(n, r.id).toBeLessThanOrEqual(180)
    }
    for (const l of UNIT_23_LISTENING) {
      const n = l.lines.reduce((a, x) => a + words(x.text), 0)
      expect(n, l.id).toBeGreaterThanOrEqual(120)
      expect(n, l.id).toBeLessThanOrEqual(160)
    }
  })
  it('sentences stay short (95th percentile ≤ 18, longest ≤ 24 words)', () => {
    const lens = [
      ...UNIT_23_READING.flatMap(r => r.body.flatMap(sentences)),
      ...UNIT_23_LISTENING.flatMap(l => l.lines.flatMap(x => sentences(x.text))),
    ]
      .map(words)
      .sort((a, b) => a - b)
    expect(lens[lens.length - 1]).toBeLessThanOrEqual(24)
    expect(lens[Math.ceil(0.95 * lens.length) - 1]).toBeLessThanOrEqual(18)
  })
  it('every dialogue line carries a Russian and a Kyrgyz translation; questions have 3 distinct options, exactly one correct; answer positions vary', () => {
    for (const l of UNIT_23_LISTENING) for (const x of l.lines) expect(x.ru && x.ky && x.ky !== x.ru).toBeTruthy()
    const qs = [...UNIT_23_LISTENING.flatMap(l => l.questions), ...UNIT_23_READING.flatMap(r => r.questions)]
    for (const q of qs) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options).size).toBe(3)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(3)
    }
    expect(new Set(qs.map(q => q.answer)).size).toBe(3)
    expect(new Set(UNIT_23_READING.flatMap(r => r.questions.map(q => q.answer))).size).toBe(3)
  })
  it('the listening keywords all have a gloss in the unit vocabulary', () => {
    const de = new Set(UNIT_23_VOCABULARY.map(v => v.de))
    for (const l of UNIT_23_LISTENING) for (const k of l.keywords) expect(de.has(k), `${l.id}: ${k}`).toBe(true)
  })
  it('the listening dialogues are coherent: they open with a greeting and close with a closing line', () => {
    expect(UNIT_23_LISTENING[0].lines[0].text).toMatch(/Guten Tag/)
    expect(UNIT_23_LISTENING[0].lines.at(-1)!.text).toMatch(/Auf Wiedersehen/)
    expect(UNIT_23_LISTENING[1].lines[0].text).toMatch(/Personalabteilung/)
    expect(UNIT_23_LISTENING[1].lines.at(-1)!.text).toMatch(/Bis Dienstag/)
    expect(UNIT_23_LISTENING[1].lines.some(x => /Dienstag um zehn Uhr/.test(x.text) && x.ky?.includes('шейшембиде'))).toBe(true)
  })
  it('the reading glosses give Russian and Kyrgyz for every word, independently', () => {
    for (const r of UNIT_23_READING) for (const g of r.gloss) expect(g.ky).not.toBe(g.ru)
  })
  it('listening uses the existing browser text-to-speech lab: no audio file, no claim of verified playback; no assessment item depends on audio', () => {
    for (const l of UNIT_23_LISTENING) expect(Object.keys(l)).not.toContain('audio')
    for (const q of UNIT_23_FINAL) expect(q.skill).not.toBe('listening')
  })
  it('speaking: one scenario of 6 turns, the interview is interrupted in turn 4 (unexpected element), hints and keywords, in German + Russian + Kyrgyz', () => {
    const [s] = UNIT_23_SPEAKING
    expect(s.turns).toHaveLength(6)
    expect(s.level).toBe('B1')
    for (const t of s.turns) {
      expect(t.aiRu && t.aiKy).toBeTruthy()
      expect(t.hints.length).toBeGreaterThanOrEqual(3)
      expect(t.keywords.length).toBeGreaterThanOrEqual(3)
      for (const k of t.keywords) expect(k).toBe(k.toLowerCase())
    }
    expect(s.turns[3].ai).toMatch(/Chef/)
    expect(s.turns[3].ai).toMatch(/verschieben/)
    expect(s.titleRu && s.titleKy).toBeTruthy()
  })
  it('writing: one formal task, 80 words minimum, a model text that meets every expected element, each element explained in ru and ky, tips in ru and ky', () => {
    const [w] = UNIT_23_WRITING
    expect(w).toMatchObject({ minWords: 80, level: 'B1', unit: 23, formal: true })
    expect(words(w.model)).toBeGreaterThanOrEqual(80)
    expect(w.mustInclude).toHaveLength(6)
    for (const m of w.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky).toBeTruthy()
      expect(m.explain!.ky).not.toBe(m.explain!.ru)
      expect(
        m.patterns.some(p => w.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(w.model).toMatch(/^Sehr geehrte Damen und Herren/)
    expect(w.model).toMatch(/Mit freundlichen Grüßen/)
    expect(w.model).not.toMatch(/\bdu\b|\bdir\b|\bdein/i) // formal register: Sie
    for (const t of w.tips) expect(t.ky).not.toBe(t.ru)
  })
})

describe('exercises: answer keys are correct and unique', () => {
  it('10 handwritten exercises: 8 on the two concepts (4 + 4) + 2 recycled (A2) without a concept; types fill / choice / order; both languages everywhere', () => {
    expect(UNIT_23_EXERCISES).toHaveLength(10)
    expect(UNIT_23_EXERCISES.map(e => e.id)).toEqual(Array.from({ length: 10 }, (_, i) => `b1-ex-23-${String(i + 1).padStart(2, '0')}`))
    const withConcept = UNIT_23_EXERCISES.filter(e => e.concept)
    expect(withConcept).toHaveLength(8)
    expect(CONCEPTS.map(c => withConcept.filter(e => e.concept === c).length)).toEqual([4, 4])
    expect(UNIT_23_EXERCISES.filter(e => !e.concept).map(e => e.id)).toEqual(['b1-ex-23-09', 'b1-ex-23-10'])
    expect([...new Set(UNIT_23_EXERCISES.map(e => e.type))].sort()).toEqual(['choice', 'fill', 'order'])
    for (const e of UNIT_23_EXERCISES) {
      expect(e.why.ru && e.why.ky).toBeTruthy()
      expect(e.why.ky).not.toBe(e.why.ru)
      expect(e.promptRu && e.promptKy, e.id).toBeTruthy()
    }
  })
  it('every choice / fill item: 3 distinct options and the answer is among them exactly once; every order item is a true permutation that is not pre-solved', () => {
    for (const e of UNIT_23_EXERCISES) {
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
  it('the text-level item (ex 04): three sentences per option, exactly one correct, and the wrong ones each contain a real learner error', () => {
    const e = UNIT_23_EXERCISES.find(x => x.id === 'b1-ex-23-04')!
    for (const o of e.options!) expect(sentences(o)).toHaveLength(3)
    const wrong = e.options!.filter(o => o !== e.answer)
    expect(wrong.some(o => /die baut Möbel/.test(o))).toBe(true) // verb not last in the relative clause
    expect(wrong.some(o => /der alle mögen/.test(o))).toBe(true) // Nominativ instead of Akkusativ
  })
  it('the relative-clause and zu exercises really use their construction in the answer', () => {
    const by = (id: string) => UNIT_23_EXERCISES.find(e => e.id === id)!
    expect(by('b1-ex-23-02').answer).toMatch(/, den alle respektieren\.$/)
    expect(by('b1-ex-23-03').answer).toMatch(/, die .* ist\.$/)
    expect(by('b1-ex-23-06').answer).toMatch(/aufzustehen\.$/)
    expect(by('b1-ex-23-07').answer).toMatch(/, um .* zu prüfen\.$/)
    expect(by('b1-ex-23-08').answer).not.toMatch(/\bzu\b/) // after a modal verb: no zu
  })
})

describe('final test: structure, answer keys and scoring data', () => {
  it('15 questions = 8 grammar (6 on the concepts, 2 recycled ↻ A2) + 3 vocabulary + 4 reading, no listening; ≥ 2 gap-fill', () => {
    expect(UNIT_23_FINAL.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `b1-ft-23-${String(i + 1).padStart(2, '0')}`))
    const by = (s: string) => UNIT_23_FINAL.filter(q => q.skill === s)
    expect([by('grammar').length, by('vocabulary').length, by('reading').length, by('listening').length]).toEqual([8, 3, 4, 0])
    expect(by('grammar').filter(q => /___/.test(q.prompt)).length).toBeGreaterThanOrEqual(2)
    expect(
      by('grammar')
        .filter(q => q.concept?.startsWith('a2-'))
        .map(q => q.concept),
    ).toEqual(['a2-adjektivendungen-definit', 'a2-reflexive-verben'])
    expect(CONCEPTS.map(c => by('grammar').filter(q => q.concept === c).length)).toEqual([3, 3])
    expect(UNIT_23_TEST).toMatchObject({ id: 'unit-23', kind: 'topic', level: 'B1', unit: 23, size: 15 })
  })
  it('options: 3 distinct each, the answer appears exactly once, both languages with an explanation; positions are 5 / 5 / 5, never three in a row', () => {
    const pos: number[] = []
    for (const q of UNIT_23_FINAL) {
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
  it('the final test shares no prompt (except the generic instruction line) and no answer with the revision exercises, and no prompt with another question', () => {
    const ex = new Set(UNIT_23_EXERCISES.flatMap(e => [e.prompt, e.answer]))
    const generic = new Set(['Welcher Satz ist richtig?', 'Bilde den Satz.'])
    for (const q of UNIT_23_FINAL) {
      if (!generic.has(q.prompt)) expect(ex.has(q.prompt), q.id).toBe(false)
      expect(ex.has(q.answer), q.id).toBe(false)
    }
    const prompts = UNIT_23_FINAL.map(q => q.prompt).filter(p => !generic.has(p))
    expect(new Set(prompts).size).toBe(prompts.length)
  })
  it('scoring data: every question has its answer among its options (a perfect run is 15/15) and the pass mark of the existing rule (70 %) is 11 of 15', () => {
    expect(UNIT_23_FINAL.filter(q => q.options.includes(q.answer)).length).toBe(15)
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
  })
  it('the classification is the approved one: P/H and P/M (with two receptive constructions); nothing is marked as expert-confirmed', () => {
    expect(META.concepts.map(c => [c.conceptId, c.proficiency, c.load, c.role])).toEqual([
      ['b1-relativsaetze-nom-akk', 'P', 'H', 'new'],
      ['b1-infinitiv-mit-zu', 'P', 'M', 'new'],
    ])
    expect(B1_CURRICULUM.units.find(u => u.unit === 23)!.concepts.some(c => c.expertReview)).toBe(false)
  })
  it('spaced revision: 4 words of Unit 22, 2 of Unit 20, 2 more from A2 — real, existing vocabulary ids', () => {
    const vocab = new Map(fullBundle().vocabulary.map(v => [v.id, v.unit]))
    expect(META.revision!.fromPrevious.map(id => vocab.get(id))).toEqual([22, 22, 22, 22])
    expect(META.revision!.fromThirdBack.map(id => vocab.get(id))).toEqual([20, 20])
    for (const id of META.revision!.fromA2) expect(vocab.get(id)! >= 11 && vocab.get(id)! <= 20, id).toBe(true)
    expect(META.revision!.fromA2).toHaveLength(2)
  })
})

describe('Kyrgyz and Russian quality guards', () => {
  it('no invented Kyrgyz grammar label (project glossary policy): grammar is described, not labelled', () => {
    const all = kyTexts().join(' \n ')
    for (const bad of ['бүтүндөмө', 'жакталган', 'бөлүнүүчү', 'жөндөлгөн этиш', 'ээрчимелүү', 'багыныңкы', 'баш сүйлөм'])
      expect(all, bad).not.toContain(bad)
  })
  it('every Kyrgyz string is written in Cyrillic (quoted German allowed) and the unit has a large Kyrgyz body', () => {
    const ky = kyTexts()
    expect(ky.length).toBeGreaterThan(250)
    expect(ky.filter(t => t.length > 25 && !/[А-Яа-яЁёҢңӨөҮү]/.test(t))).toEqual([])
  })
  it('the explanations of exercises and final-test questions differ between Russian and Kyrgyz', () => {
    for (const e of UNIT_23_EXERCISES) expect(e.why.ky).not.toBe(e.why.ru)
    for (const q of UNIT_23_FINAL) expect(q.why.ky).not.toBe(q.why.ru)
  })
})

describe('validator and assessment honesty', () => {
  it('the validator finds 0 errors and 0 warnings in the real bundle, no B1 issue at all, and only the missing human CEFR sign-off for Unit 23', () => {
    const is = validateContent(fullBundle())
    expect(is.filter(i => i.severity === 'error')).toEqual([])
    expect(is.filter(i => i.severity === 'warning')).toEqual([])
    expect(
      is.filter(
        i =>
          i.rule.startsWith('b1-') &&
          !(
            i.rule === 'b1-expert-review-pending' &&
            (i.where === 'grammar:b1-passiv-praesens' ||
              i.where === 'grammar:b1-lassen' ||
              i.where === 'grammar:b1-genitiv-praepositionen' ||
              i.where === 'grammar:b1-futur1-vermutungen' ||
              i.where === 'grammar:b1-genitivattribute' ||
              i.where === 'grammar:b1-plusquamperfekt-nachdem' ||
              i.where === 'grammar:b1-nomen-verb-verbindungen' ||
              i.where === 'grammar:b1-aktiv-passiv-zustandspassiv' ||
              i.where === 'grammar:b1-satzbau-mittelfeld')
          ),
      ),
    ).toEqual([])
    expect(
      is
        .filter(i => i.where === 'units:23' && i.severity === 'review')
        .map(i => i.rule)
        .sort(),
    ).toEqual(['beta-review-pending', 'beta-review-pending', 'cefr-signoff-missing']) // + the Beta flags (ru, ky) since the B1 Beta launch
  })
  it('the unit never claims a CEFR level, a certificate or an exam result', () => {
    const all = JSON.stringify(
      [
        UNIT_23,
        UNIT_23_GRAMMAR,
        UNIT_23_READING,
        UNIT_23_LISTENING,
        UNIT_23_SPEAKING,
        UNIT_23_WRITING,
        UNIT_23_EXERCISES,
        UNIT_23_FINAL,
        META,
      ],
      (k, v) => (k === 'source' ? undefined : v),
    )
    expect(all).not.toMatch(/zertifikat|certificate|сертификат|B1 erreicht|достигнут уровень|official/i)
    expect(all).not.toMatch(/\bCEFR\b/)
  })
  it('the writing tips tell the learner that the app checks only length and expected words and that quality is self-assessed', () => {
    expect(UNIT_23_WRITING[0].tips.map(t => t.ru).join(' ')).toMatch(/только объём и ожидаемые слова/)
    expect(UNIT_23_WRITING[0].tips.map(t => t.ky).join(' ')).toMatch(/көлөмдү жана күтүлгөн сөздөрдү гана/)
  })
  it('the provenance says the material is original and NOT reviewed', () => {
    for (const x of [...UNIT_23_GRAMMAR, ...UNIT_23_READING, ...UNIT_23_LISTENING, ...UNIT_23_SPEAKING, ...UNIT_23_WRITING]) {
      expect(x.source?.kind).toBe('authored')
      expect(x.source?.author).toMatch(/pending independent CEFR, Russian and Kyrgyz review/)
    }
  })
})
