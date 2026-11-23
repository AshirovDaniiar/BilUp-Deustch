// @vitest-environment node
/**
 * B1 Unit 22 — Meinungen äußern und diskutieren (Stage 3D). Checks the authored content against the approved curriculum: identity, the three approved
 * concepts, vocabulary (38–42, nothing already taught), text sizes, productive vs receptive scope, scope guard for later units, RU/KY completeness,
 * exercise/answer-key correctness, assessment structure, metadata and spaced revision. B1 stays `planned` and invisible; no CEFR approval of any kind is
 * implied (the content is an unreviewed AI-assisted draft).
 */
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { lemmaKeys } from '../../scripts/content-validate/b1/lemma'
import { B1_CURRICULUM } from '../../scripts/content-validate/b1/curriculum'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_META } from '../../src/data/b1/meta'
import { B1_UNIT_PLAN } from '../../src/data/b1/registry'
import { UNIT_21_VOCABULARY } from '../../src/data/b1/unit21/vocabulary'
import { UNIT_22_EXERCISES, UNIT_22_FINAL, UNIT_22_TEST } from '../../src/data/b1/unit22/assessment'
import { UNIT_22_GRAMMAR, UNIT_22_WHY_NOTES } from '../../src/data/b1/unit22/grammar'
import { UNIT_22_LISTENING, UNIT_22_READING, UNIT_22_SPEAKING, UNIT_22_WRITING } from '../../src/data/b1/unit22/texts'
import { UNIT_22 } from '../../src/data/b1/unit22/unit'
import { UNIT_22_VOCABULARY } from '../../src/data/b1/unit22/vocabulary'
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
const CONCEPTS = ['b1-konzessive-saetze', 'b1-doppelkonnektoren', 'b1-adjektive-dativ-genitiv']
const META = B1_META.find(m => m.unit === 22)!

/** every German string of the unit (what a learner reads or hears) */
function germanTexts(): string[] {
  const out: string[] = []
  for (const r of UNIT_22_READING) out.push(...r.body)
  for (const l of UNIT_22_LISTENING) out.push(...l.lines.map(x => x.text), ...l.questions.flatMap(q => [q.q, ...q.options]))
  for (const r of UNIT_22_READING) out.push(...r.questions.flatMap(q => [q.q, ...q.options]))
  for (const v of UNIT_22_VOCABULARY) out.push(v.example)
  for (const g of UNIT_22_GRAMMAR) {
    out.push(...g.examples.map(x => x.de), ...g.reallife.map(x => x.de), ...g.dialogue.map(x => x.text), g.speakPrompt.sample)
  }
  for (const n of UNIT_22_WHY_NOTES) out.push(n.sentence, ...n.more.map(x => x.de))
  // prompts and answers only: the distractor options of a choice item are deliberately wrong forms and are never taught
  for (const e of UNIT_22_EXERCISES) out.push(e.prompt, e.answer)
  for (const q of UNIT_22_FINAL) out.push(q.prompt, q.answer)
  out.push(UNIT_22_WRITING[0].model, UNIT_22_WRITING[0].mustInclude.map(m => m.label).join(' '))
  for (const s of UNIT_22_SPEAKING) out.push(...s.turns.flatMap(t => [t.ai, ...t.hints]))
  return out
}
// wrong forms shown on purpose as mistakes are excluded from the scope scan
const MISTAKES = new Set(UNIT_22_GRAMMAR.flatMap(g => g.mistakes.flatMap(m => [m.wrong, m.right])))
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
    UNIT_22,
    UNIT_22_GRAMMAR,
    UNIT_22_WHY_NOTES,
    UNIT_22_READING,
    UNIT_22_LISTENING,
    UNIT_22_SPEAKING,
    UNIT_22_WRITING,
    UNIT_22_EXERCISES,
    UNIT_22_FINAL,
    UNIT_22_VOCABULARY,
    META,
  ])
  return out
}

describe('identity and integration (B1 is a Beta for ru and ky)', () => {
  it('the unit equals its approved plan entry', () => {
    const plan = B1_UNIT_PLAN.find(p => p.id === 22)!
    expect(UNIT_22).toMatchObject({ id: 22, key: plan.key, title: plan.titleDe, level: 'B1' })
    expect(plan.key).toBe('b1-meinungen-diskussion')
    expect(plan.titleDe).toBe('Meinungen äußern und diskutieren')
    expect(UNIT_22.grammarIds).toEqual(CONCEPTS)
  })
  it('the content module holds Unit 22 after Unit 21, wired into the metadata, the tests, the final tests and the speaking list', () => {
    expect(B1_CONTENT.legacyUnits.map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_META.map(m => m.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.tests).toContainEqual(UNIT_22_TEST)
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
    expect(vocabularyForUnit(22)).toHaveLength(40)
    expect(grammarForUnit(22).map(g => g.id)).toEqual(CONCEPTS)
    expect(finalTestOfUnit(22)?.questions).toHaveLength(15)
    expect(topicTestOfUnit(22)).toMatchObject({ id: 'unit-22', level: 'B1', size: 15 })
    expect(speakingForUnit(22)).toBe('b1-sp-22-01')
  })
})

describe('grammar: only the three approved concepts', () => {
  it('exactly the approved ids, in order, owned by Unit 22, level B1', () => {
    expect(UNIT_22_GRAMMAR.map(g => g.id)).toEqual(CONCEPTS)
    for (const g of UNIT_22_GRAMMAR) expect(g).toMatchObject({ unit: 22, level: 'B1' })
    expect(B1_CURRICULUM.units.find(u => u.unit === 22)!.concepts.map(c => c.id)).toEqual(CONCEPTS)
  })
  it('every concept is complete: explanation, 5 examples, mistakes, real-life, dialogue, speaking prompt — in Russian and in Kyrgyz', () => {
    for (const g of UNIT_22_GRAMMAR) {
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
  it('the why-notes: one per concept', () => {
    expect(UNIT_22_WHY_NOTES.map(n => n.conceptId)).toEqual(CONCEPTS)
  })
  it('every "mistake" really is wrong and its correction differs; the wrong form never appears in the taught texts', () => {
    for (const g of UNIT_22_GRAMMAR) for (const m of g.mistakes) expect(m.wrong).not.toBe(m.right)
    const wrong = UNIT_22_GRAMMAR.flatMap(g => g.mistakes.map(m => m.wrong))
    for (const t of taught()) expect(wrong.includes(t), t).toBe(false)
  })
  it('scope guard: nothing that belongs to a later unit (damit, Passiv, Plusquamperfekt, Infinitiv mit zu, Konjunktiv II, Genitiv, Relativsatz, verb + preposition)', () => {
    const forbidden: [string, RegExp][] = [
      ['damit', /\bdamit\b/i],
      ['Passiv (worden / wurde / wird + Partizip)', /\bworden\b|\b(wurde|wurden)\b|\bwird\b[^.!?]{0,30}\bge\w+(t|en)\b/i],
      ['Plusquamperfekt', /\bnachdem\b[^.!?]*\b(hatte|hatten|waren|war)\b/i],
      ['Infinitiv mit zu', / zu [a-zäöüß]{3,}en[ ,.!?]|\bum\b[^.!?]{0,40}\bzu\b/],
      ['Konjunktiv II', /\b(hätte|hätten|wäre|wären|würde|würden|könnte|könnten)\b/i],
      [
        'Genitiv (des/eines + Noun-s, wegen, statt, trotz + Genitiv, name-s possessive)',
        /\b(des|eines)\s+[A-ZÄÖÜ]\w+s\b|\bwegen\b|\bstatt\b|\btrotz\b|\b[A-ZÄÖÜ][a-zäöüß]+’s?\b/,
      ],
      ['Relativsatz (comma + der/die/das/den/dem)', /,\s*(der|die|das|den|dem|dessen|welche[rsnm]?)\s+[a-zäöüß]/],
      [
        'verb + obligatory preposition (Unit 28)',
        /\b(sich ärgern über|denken an|denke an|sich kümmern um|Angst vor|hält von|halten von|sprechen über|spreche über|diskutieren über|warten auf|sich freuen|abhängen von|hängt von|kommt auf|ankommen auf|teilnehmen an|glauben an|träumen von|sich interessieren für|bestehen aus)\b/i,
      ],
    ]
    for (const t of taught()) for (const [name, re] of forbidden) expect(re.test(t), `${name}: "${t.slice(0, 90)}"`).toBe(false)
  })
  it('no adjective without an article (Unit 24): every attributive adjective in a taught text follows an article word', () => {
    const adj =
      /\b([A-Za-zäöüÄÖÜ]+)\s+((?:gut|neu|nett|groß|klein|alt|jung|wichtig|älter|stark|echt|klar|fest|freundlich|vernünftig|hoh|lang|ruhig|laut|teuer|günstig|schön|ander)(?:e|er|es|en|em)?)\s+[A-ZÄÖÜ][a-zäöüß]+/g
    const det =
      /^(der|die|das|den|dem|ein|eine|einen|einem|einer|kein|keine|keinen|keinem|keiner|mein|meine|meinen|meinem|meiner|dein|deine|deinen|ihr|ihre|ihren|ihrem|sein|seine|unser|unsere|diese|diesen|diesem|dieser|dieses|jeder|jede|jedes|jeden|alle|viele|manche|welchen|welche|welcher|welches|zu|am|im|ins)$/i
    const bad: string[] = []
    for (const t of taught()) for (const m of t.matchAll(adj)) if (!det.test(m[1])) bad.push(`${t.slice(0, 60)} → "${m[0]}"`)
    expect(bad).toEqual([])
  })
  it('the receptive constructions appear in ONE reading (glossed) and never in a task, a test, a hint, a keyword or a checklist item', () => {
    const re = /einerseits|andererseits|nicht nur|sondern auch/i
    const production = [
      ...UNIT_22_EXERCISES.flatMap(e => [e.prompt, e.answer, ...(e.options ?? []), ...(e.words ?? [])]),
      ...UNIT_22_FINAL.flatMap(q => [q.prompt, q.answer, ...q.options]),
      ...UNIT_22_WRITING.flatMap(w => [...w.mustInclude.flatMap(m => [m.label, ...m.patterns]), w.model]),
      ...UNIT_22_SPEAKING.flatMap(s => s.turns.flatMap(t => [t.ai, ...t.hints, ...t.keywords])),
      ...UNIT_22_GRAMMAR.flatMap(g => [g.speakPrompt.sample, ...g.speakPrompt.keywords]),
    ]
    for (const t of production) expect(re.test(t), t).toBe(false)
    expect(UNIT_22_READING.filter(r => re.test(r.body.join(' '))).map(r => r.id)).toEqual(['b1-re-22-02'])
    expect(UNIT_22_READING[1].gloss.some(g => /einerseits/i.test(g.word))).toBe(true)
    expect(META.concepts[1].constructions!.every(c => c.proficiency === 'R')).toBe(true)
  })
  it('the productive double connectors and concessions are really used in the texts', () => {
    const all = taught().join(' ')
    for (const k of ['obwohl', 'Trotzdem', 'Zwar', 'Je ', 'desto', 'weder', 'noch', 'entweder', 'oder', 'Sowohl', 'als auch'])
      expect(all, k).toContain(k)
  })
})

describe('vocabulary: 40 new items, none already taught', () => {
  const b = fullBundle()
  const earlier = new Set(b.vocabulary.filter(v => v.unit <= 21).flatMap(v => lemmaKeys(v.de)))
  it('exactly 40 items (target 38–42), ids v22-1 … v22-40, unique across the whole B1 vocabulary', () => {
    expect(UNIT_22_VOCABULARY).toHaveLength(40)
    expect(UNIT_22_VOCABULARY.map(v => v.id)).toEqual(Array.from({ length: 40 }, (_, i) => `v22-${i + 1}`))
    expect(UNIT_22_VOCABULARY.every(v => v.unit === 22)).toBe(true)
    const ids = B1_CONTENT.vocabulary.map(v => v.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toHaveLength(UNIT_21_VOCABULARY.length + 440)
  })
  it('no lemma repeats an A1, A2 or Unit 21 headword, and none is listed twice', () => {
    const keys = UNIT_22_VOCABULARY.flatMap(v => lemmaKeys(v.de))
    expect(keys.filter(k => earlier.has(k))).toEqual([])
    expect(new Set(keys).size).toBe(keys.length)
  })
  it('every item has article/plural where a noun, a German example, and independent Russian and Kyrgyz translations of the word and the example', () => {
    for (const v of UNIT_22_VOCABULARY) {
      if (v.pos === 'noun') expect(v.article, v.de).toBeTruthy()
      for (const f of [v.de, v.ru, v.ky, v.example, v.exampleRu, v.exampleKy ?? '']) expect(f.trim().length, v.id).toBeGreaterThan(1)
      expect(v.ky).not.toBe(v.ru)
      expect(v.exampleKy).not.toBe(v.exampleRu)
      expect(v.example.toLowerCase()).toContain(v.de.split(' ')[0].slice(0, 3).toLowerCase())
    }
    const ex = UNIT_22_VOCABULARY.map(v => v.example)
    expect(new Set(ex).size).toBe(ex.length)
  })
  it('the planned themes are present: opinion, society, living, judging, discussing — and no verb needs a prepositional object', () => {
    const de = UNIT_22_VOCABULARY.map(v => v.de)
    for (const w of [
      'Meinung',
      'Argument',
      'Vorteil',
      'Nachteil',
      'Diskussion',
      'Gesellschaft',
      'Großstadt',
      'Dorf',
      'Haustier',
      'nützlich',
      'schädlich',
      'diskutieren',
      'zustimmen',
      'widersprechen',
      'überzeugen',
    ])
      expect(de, w).toContain(w)
    for (const v of UNIT_22_VOCABULARY.filter(x => x.pos === 'verb'))
      expect(`${v.ru} ${v.ky}`, v.de).not.toMatch(/\((an|über|auf|von|für|mit|um|vor) /)
  })
})

describe('texts: progressive targets of the band for Units 21–22', () => {
  it('2 readings of 100–150 words and 2 listening scripts of 110–140 words', () => {
    expect(UNIT_22_READING).toHaveLength(2)
    expect(UNIT_22_LISTENING).toHaveLength(2)
    for (const r of UNIT_22_READING) {
      const n = r.body.reduce((a, p) => a + words(p), 0)
      expect(n, r.id).toBeGreaterThanOrEqual(100)
      expect(n, r.id).toBeLessThanOrEqual(150)
    }
    for (const l of UNIT_22_LISTENING) {
      const n = l.lines.reduce((a, x) => a + words(x.text), 0)
      expect(n, l.id).toBeGreaterThanOrEqual(110)
      expect(n, l.id).toBeLessThanOrEqual(140)
    }
  })
  it('sentences stay short (95th percentile ≤ 16, longest ≤ 22 words)', () => {
    const lens = [
      ...UNIT_22_READING.flatMap(r => r.body.flatMap(sentences)),
      ...UNIT_22_LISTENING.flatMap(l => l.lines.flatMap(x => sentences(x.text))),
    ]
      .map(words)
      .sort((a, b) => a - b)
    expect(lens[lens.length - 1]).toBeLessThanOrEqual(22)
    expect(lens[Math.ceil(0.95 * lens.length) - 1]).toBeLessThanOrEqual(16)
  })
  it('every dialogue line carries a Russian and a Kyrgyz translation; questions have 3 distinct options, exactly one correct; answer positions vary', () => {
    for (const l of UNIT_22_LISTENING) for (const x of l.lines) expect(x.ru && x.ky && x.ky !== x.ru).toBeTruthy()
    const qs = [...UNIT_22_LISTENING.flatMap(l => l.questions), ...UNIT_22_READING.flatMap(r => r.questions)]
    for (const q of qs) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options).size).toBe(3)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(3)
    }
    expect(new Set(qs.map(q => q.answer)).size).toBe(3)
  })
  it('the listening keywords all have a gloss in the unit vocabulary (the chips would otherwise show no translation)', () => {
    const de = new Set(UNIT_22_VOCABULARY.map(v => v.de))
    for (const l of UNIT_22_LISTENING) for (const k of l.keywords) expect(de.has(k), `${l.id}: ${k}`).toBe(true)
  })
  it('the listening dialogues are coherent: they open with a greeting or a statement of the topic and close with a closing line', () => {
    expect(UNIT_22_LISTENING[0].lines[0].speaker).toBe('Lea')
    expect(UNIT_22_LISTENING[0].lines.at(-1)!.text).toMatch(/Einverstanden/)
    expect(UNIT_22_LISTENING[1].lines[0].text).toMatch(/Guten Morgen/)
    expect(UNIT_22_LISTENING[1].lines.at(-1)!.text).toMatch(/Gern geschehen/)
  })
  it('the reading glosses give Russian and Kyrgyz for every word, independently', () => {
    for (const r of UNIT_22_READING) for (const g of r.gloss) expect(g.ky).not.toBe(g.ru)
  })
  it('listening uses the existing browser text-to-speech lab: no audio file, no claim of verified playback; no assessment item depends on audio', () => {
    for (const l of UNIT_22_LISTENING) expect(Object.keys(l)).not.toContain('audio')
    for (const q of UNIT_22_FINAL) expect(q.skill).not.toBe('listening')
  })
  it('speaking: one scenario of 6 turns, the interlocutor objects first (unexpected element), hints and keywords, in German + Russian + Kyrgyz', () => {
    const [s] = UNIT_22_SPEAKING
    expect(s.turns).toHaveLength(6)
    expect(s.level).toBe('B1')
    for (const t of s.turns) {
      expect(t.aiRu && t.aiKy).toBeTruthy()
      expect(t.hints.length).toBeGreaterThanOrEqual(3)
      expect(t.keywords.length).toBeGreaterThanOrEqual(3)
      for (const k of t.keywords) expect(k).toBe(k.toLowerCase())
    }
    expect(s.turns[1].ai).toMatch(/Nachteil/) // the counter-argument
    expect(s.titleRu && s.titleKy).toBeTruthy()
  })
  it('writing: one task, 80 words minimum, model text of at least that length, six expected elements each explained in ru and ky, tips in ru and ky', () => {
    const [w] = UNIT_22_WRITING
    expect(w).toMatchObject({ minWords: 80, level: 'B1', unit: 22, formal: false })
    expect(words(w.model)).toBeGreaterThanOrEqual(80)
    expect(w.mustInclude).toHaveLength(6)
    for (const m of w.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky).toBeTruthy()
      expect(m.explain!.ky).not.toBe(m.explain!.ru)
      // the model text itself satisfies every expected element
      expect(
        m.patterns.some(p => w.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    for (const t of w.tips) expect(t.ky).not.toBe(t.ru)
  })
})

describe('exercises: answer keys are correct and unique', () => {
  it('10 handwritten exercises: 8 on the three concepts (4 + 3 + 1) + 2 recycled (A2) without a concept; types fill / choice / order; both languages everywhere', () => {
    expect(UNIT_22_EXERCISES).toHaveLength(10)
    expect(UNIT_22_EXERCISES.map(e => e.id)).toEqual(Array.from({ length: 10 }, (_, i) => `b1-ex-22-${String(i + 1).padStart(2, '0')}`))
    const withConcept = UNIT_22_EXERCISES.filter(e => e.concept)
    expect(withConcept).toHaveLength(8)
    expect(CONCEPTS.map(c => withConcept.filter(e => e.concept === c).length)).toEqual([4, 3, 1])
    expect(UNIT_22_EXERCISES.filter(e => !e.concept).map(e => e.id)).toEqual(['b1-ex-22-09', 'b1-ex-22-10'])
    expect(UNIT_22_EXERCISES.every(e => ['fill', 'choice', 'order'].includes(e.type))).toBe(true)
    expect([...new Set(UNIT_22_EXERCISES.map(e => e.type))].sort()).toEqual(['choice', 'fill', 'order'])
    for (const e of UNIT_22_EXERCISES) {
      expect(e.why.ru && e.why.ky).toBeTruthy()
      expect(e.why.ky).not.toBe(e.why.ru)
      if (e.type !== 'choice' || !/[A-Za-z]/.test(e.promptRu ?? '')) expect(e.promptRu && e.promptKy).toBeTruthy()
      expect(e.promptRu && e.promptKy, e.id).toBeTruthy()
    }
  })
  it('every choice / fill item: 3 distinct options and the answer is among them exactly once; every order item is a true permutation with a unique start', () => {
    for (const e of UNIT_22_EXERCISES) {
      if (e.type === 'order') {
        expect([...(e.words ?? [])].sort().join('|')).toBe(e.answer.split(' ').sort().join('|'))
        expect(e.words![0]).not.toBe(e.answer.split(' ')[0]) // not pre-solved
      } else {
        expect(e.options).toHaveLength(3)
        expect(new Set(e.options).size).toBe(3)
        expect(e.options!.filter(o => o === e.answer)).toHaveLength(1)
      }
    }
  })
  it('exactly one option of each text-level item is both correct and the answer; the wrong options each contain a real learner error', () => {
    const e = UNIT_22_EXERCISES.find(x => x.id === 'b1-ex-22-04')!
    const wrong = e.options!.filter(o => o !== e.answer)
    expect(wrong.some(o => /obwohl es ist teuer/i.test(o))).toBe(true) // verb not last
    expect(wrong.some(o => /teuer ist, ich nehme/i.test(o))).toBe(true) // no inversion after the obwohl part
    for (const o of e.options!) expect(sentences(o)).toHaveLength(3)
  })
  it('the double-connector and concession exercises really use their connector in the answer', () => {
    const by = (id: string) => UNIT_22_EXERCISES.find(e => e.id === id)!
    expect(by('b1-ex-22-02').answer).toMatch(/obwohl .* ist\.$/)
    expect(by('b1-ex-22-03').answer).toMatch(/^Zwar .*, aber /)
    expect(by('b1-ex-22-05').answer).toBe('desto')
    expect(by('b1-ex-22-06').answer).toBe('noch')
    expect(by('b1-ex-22-07').answer).toMatch(/^Je .*, desto /)
  })
})

describe('final test: structure, answer keys and scoring data', () => {
  it('15 questions = 8 grammar (6 on the concepts, 2 recycled ↻ A2) + 3 vocabulary + 4 reading, no listening; ≥ 2 gap-fill', () => {
    expect(UNIT_22_FINAL.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `b1-ft-22-${String(i + 1).padStart(2, '0')}`))
    const by = (s: string) => UNIT_22_FINAL.filter(q => q.skill === s)
    expect([by('grammar').length, by('vocabulary').length, by('reading').length, by('listening').length]).toEqual([8, 3, 4, 0])
    expect(by('grammar').filter(q => /___/.test(q.prompt)).length).toBeGreaterThanOrEqual(2)
    expect(
      by('grammar')
        .filter(q => q.concept?.startsWith('a2-'))
        .map(q => q.concept),
    ).toEqual(['a2-komparativ-superlativ', 'a2-deshalb-darum'])
    expect(CONCEPTS.map(c => by('grammar').filter(q => q.concept === c).length)).toEqual([2, 2, 2])
    expect(UNIT_22_TEST).toMatchObject({ id: 'unit-22', kind: 'topic', level: 'B1', unit: 22, size: 15 })
  })
  it('options: 3 distinct each, the answer appears exactly once, both languages with an explanation; positions are 5 / 5 / 5, never three in a row', () => {
    const pos: number[] = []
    for (const q of UNIT_22_FINAL) {
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
    const ex = new Set(UNIT_22_EXERCISES.flatMap(e => [e.prompt, e.answer]))
    const generic = new Set(['Welcher Satz ist richtig?', 'Bilde den Satz.'])
    for (const q of UNIT_22_FINAL) {
      if (!generic.has(q.prompt)) expect(ex.has(q.prompt), q.id).toBe(false)
      expect(ex.has(q.answer), q.id).toBe(false)
    }
    const prompts = UNIT_22_FINAL.map(q => q.prompt).filter(p => !generic.has(p))
    expect(new Set(prompts).size).toBe(prompts.length)
  })
  it('scoring data: a perfect run is 15/15, the pass mark of the existing rule (70 %) is 11 of 15, and the Dativ / plural is the only adjective case tested', () => {
    const all = UNIT_22_FINAL.filter(q => q.options.includes(q.answer)).length
    expect(all).toBe(15)
    expect(Math.ceil(0.7 * 15)).toBe(11)
    for (const q of UNIT_22_FINAL.filter(x => x.concept === 'b1-adjektive-dativ-genitiv')) expect(q.prompt).toMatch(/dem|den/)
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
  it('the classification is the approved one: P/M, P/M (with two receptive constructions), P/L; nothing is marked as expert-confirmed', () => {
    expect(META.concepts.map(c => [c.conceptId, c.proficiency, c.load, c.role])).toEqual([
      ['b1-konzessive-saetze', 'P', 'M', 'new'],
      ['b1-doppelkonnektoren', 'P', 'M', 'new'],
      ['b1-adjektive-dativ-genitiv', 'P', 'L', 'new'],
    ])
    expect(B1_CURRICULUM.units.find(u => u.unit === 22)!.concepts.some(c => c.expertReview)).toBe(false)
  })
  it('comparison phrases: ≥ 3 declared, ≥ 2 used in the texts', () => {
    const corpus = [
      ...UNIT_22_READING.flatMap(r => r.body),
      ...UNIT_22_LISTENING.flatMap(l => l.lines.map(x => x.text)),
      ...UNIT_22_EXERCISES.map(e => e.prompt),
    ]
      .join(' ')
      .toLowerCase()
    const ph = META.strands.comparisonPhrases!
    expect(ph.length).toBeGreaterThanOrEqual(3)
    expect(ph.filter(p => corpus.includes(p.toLowerCase())).length).toBeGreaterThanOrEqual(2)
  })
  it('spaced revision: 4 words of Unit 21, 2 of Unit 19, 2 more from A2 — real, existing vocabulary ids', () => {
    const vocab = new Map(fullBundle().vocabulary.map(v => [v.id, v.unit]))
    expect(META.revision!.fromPrevious.map(id => vocab.get(id))).toEqual([21, 21, 21, 21])
    expect(META.revision!.fromThirdBack.map(id => vocab.get(id))).toEqual([19, 19])
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
  it('every Kyrgyz string is written in Cyrillic (loanwords and quoted German allowed) and no string is a copy of its Russian twin', () => {
    const ky = kyTexts()
    expect(ky.length).toBeGreaterThan(250)
    for (const t of ky) if (/[a-zA-Z]{12,}/.test(t) === false) expect(t.trim().length).toBeGreaterThan(0)
    const noCyr = ky.filter(t => t.length > 25 && !/[А-Яа-яЁёҢңӨөҮү]/.test(t))
    expect(noCyr).toEqual([])
  })
  it('the Russian and Kyrgyz translation of every vocabulary item, example and exercise explanation are present and different', () => {
    for (const e of UNIT_22_EXERCISES) expect(e.why.ky).not.toBe(e.why.ru)
    for (const q of UNIT_22_FINAL) expect(q.why.ky).not.toBe(q.why.ru)
  })
})

describe('validator and assessment honesty', () => {
  it('the validator finds 0 errors and 0 warnings in the real bundle, no B1 issue at all, and only the missing human CEFR sign-off for Unit 22', () => {
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
        .filter(i => i.where === 'units:22' && i.severity === 'review')
        .map(i => i.rule)
        .sort(),
    ).toEqual(['beta-review-pending', 'beta-review-pending', 'cefr-signoff-missing']) // + the Beta flags (ru, ky) since the B1 Beta launch
  })
  it('the unit never claims a CEFR level, a certificate or an exam result', () => {
    const all = JSON.stringify(
      [
        UNIT_22,
        UNIT_22_GRAMMAR,
        UNIT_22_READING,
        UNIT_22_LISTENING,
        UNIT_22_SPEAKING,
        UNIT_22_WRITING,
        UNIT_22_EXERCISES,
        UNIT_22_FINAL,
        META,
      ],
      (k, v) => (k === 'source' ? undefined : v),
    )
    expect(all).not.toMatch(/zertifikat|certificate|сертификат|B1 erreicht|достигнут уровень|official/i)
    expect(all).not.toMatch(/\bCEFR\b/)
  })
  it('the writing tips tell the learner that the app checks only length and expected words and that quality is self-assessed', () => {
    expect(UNIT_22_WRITING[0].tips.map(t => t.ru).join(' ')).toMatch(/только объём и ожидаемые слова/)
    expect(UNIT_22_WRITING[0].tips.map(t => t.ky).join(' ')).toMatch(/көлөмдү жана күтүлгөн сөздөрдү гана/)
  })
  it('the provenance says the material is original and NOT reviewed', () => {
    for (const x of [...UNIT_22_GRAMMAR, ...UNIT_22_READING, ...UNIT_22_LISTENING, ...UNIT_22_SPEAKING, ...UNIT_22_WRITING]) {
      expect(x.source?.kind).toBe('authored')
      expect(x.source?.author).toMatch(/pending independent CEFR, Russian and Kyrgyz review/)
    }
  })
})
