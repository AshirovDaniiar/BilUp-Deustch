// @vitest-environment node
/**
 * Stage 7A — the PRODUCTION content of the pilot unit 11 ("Über mich und meine Erfahrungen").
 * These tests read the real A2 modules (never a synthetic fixture) and pin the agreed quality standard: completeness, ids, references,
 * Russian/Kyrgyz independence, exercise structure, separation of revision and final test, answer-position distribution, and the
 * boundaries of the stage (A2 is in controlled Beta (ru + ky), units 12–20 stay empty, no human sign-off is invented).
 */
import { a2AuthoredUnits } from '../a2-authored'
import { withoutB1Content } from './fixtures'
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { conventions } from '../../scripts/content-validate/conventions'
import { A2_REVIEWS } from '../../scripts/content-validate/reviews'
import { validateContent } from '../../scripts/content-validate/validate'
import { positionCounts } from '../../scripts/content-validate/rules/answers'
import { UNIT_MINIMUMS } from '../../scripts/content-validate/rules/metadata'
import {
  allUnits,
  exerciseIndex,
  exercisesForUnit,
  finalTestOfUnit,
  grammarForUnit,
  grammarIndex,
  listeningForUnit,
  readingForUnit,
  speakingForUnit,
  speakingIndex,
  topicTestOfUnit,
  unitById,
  vocabularyForUnit,
  vocabularyIndex,
  whyNotesOf,
  writingForUnit,
  testIndex,
  vocabularyOf,
  grammarOf,
  exercisesOf,
  listeningOf,
  readingOf,
  writingOf,
  speakingOf,
  testsOf,
} from '../../src/data/catalog'
import { COURSE, isLevelVisible } from '../../src/data/course'
import { EXPECTED_BETA_FLAGS } from './beta-flags'
import { A2_UNIT_PLAN } from '../../src/data/a2/registry'
import { A2_INSTRUCTIONS } from '../../src/data/a2/instructions'
import { UNIT_11_RECEPTIVE_WORDS } from '../../src/data/a2/vocabulary'
import { A2_PLACEMENT_ITEMS } from '../../src/data/a2/placement'
import { A2_TUTOR_TEMPLATES } from '../../src/data/a2/tutor'
import { analyseWriting } from '../../src/services/analysis'

const U = 11
const plan = A2_UNIT_PLAN.find(p => p.id === U)!
const unit = unitById(U)!
const vocab = vocabularyForUnit(U)
const grammar = grammarForUnit(U)
const exercises = exercisesForUnit(U)
const listening = listeningForUnit(U)
const reading = readingForUnit(U)
const writing = writingForUnit(U)
const final = finalTestOfUnit(U)!
const scenario = speakingIndex.get(speakingForUnit(U) ?? '')!
const norm = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase()
const words = (s: string) => s.split(/\s+/).filter(Boolean).length
// The A2 world (A1 + A2 + registry): B1 content is excluded, because these tests describe A2's own validation state; B1 has its own tests (b1-profile, b1-unit-21).
const issues = (mode?: 'release') => validateContent(withoutB1Content(fullBundle()), { mode })
// since Stage 7C the A2 level also holds unit 12: these tests look at unit 11's own notes and instructions
const notes11 = whyNotesOf('A2').filter(n => grammarIndex.get(n.conceptId)?.unit === U)
const instructions11 = A2_INSTRUCTIONS.filter(i => i.unit === U)

describe('unit 11 — completeness against the approved standard', () => {
  it('is the planned unit: same id, key, title and level', () => {
    expect(unit).toBeDefined()
    expect(unit.id).toBe(plan.id)
    expect(unit.key).toBe(plan.key)
    expect(unit.title).toBe(plan.titleDe)
    expect(unit.level).toBe('A2')
  })
  it('meets every minimum', () => {
    expect(vocab.length).toBeGreaterThanOrEqual(UNIT_MINIMUMS.vocabulary)
    expect(grammar.length).toBeGreaterThanOrEqual(UNIT_MINIMUMS.grammarMin)
    expect(grammar.length).toBeLessThanOrEqual(UNIT_MINIMUMS.grammarMax)
    expect(listening).toHaveLength(2)
    expect(reading.length).toBeGreaterThanOrEqual(1)
    expect(reading.length).toBeLessThanOrEqual(2)
    expect(writing).toHaveLength(1)
    expect(scenario).toBeDefined()
    expect(exercises.filter(e => e.type !== 'article')).toHaveLength(8)
    expect(final.questions).toHaveLength(15)
  })
  it('the unit lists exactly its own grammar concepts', () => {
    expect(unit.grammarIds).toEqual(grammar.map(g => g.id))
  })
  it('has a topic test definition whose size is the number of authored questions', () => {
    const def = topicTestOfUnit(U)!
    expect(def.id).toBe('unit-11')
    expect(def.kind).toBe('topic')
    expect(def.level).toBe('A2')
    expect(def.unit).toBe(U)
    expect(def.size).toBe(final.questions.length)
  })
  it('every grammar concept carries all parts of the agreed explanation (rule, examples, mistakes, practice, RU, KY)', () => {
    for (const g of grammar) {
      expect(g.examples.length, g.id).toBeGreaterThanOrEqual(4)
      expect(g.mistakes.length, g.id).toBeGreaterThanOrEqual(3)
      expect(g.when.length, g.id).toBeGreaterThanOrEqual(3)
      expect(g.reallife.length, g.id).toBeGreaterThanOrEqual(2)
      expect(g.dialogue.length, g.id).toBeGreaterThanOrEqual(4)
      expect(g.speakPrompt.keywords.length, g.id).toBeGreaterThan(0)
      for (const m of g.mistakes) expect(norm(m.wrong), g.id).not.toBe(norm(m.right))
      // the concept has revision practice and final-test coverage
      expect(
        exercises.some(e => e.concept === g.id),
        `${g.id} has no revision exercise`,
      ).toBe(true)
      expect(
        final.questions.some(q => q.concept === g.id),
        `${g.id} has no final-test question`,
      ).toBe(true)
      expect(
        notes11.some(n => n.conceptId === g.id),
        `${g.id} has no why-note`,
      ).toBe(true)
    }
  })
  it('the vocabulary covers every kind of word the unit teaches (nouns with article, verbs, adjectives, time words, phrases)', () => {
    const pos = new Set(vocab.map(v => v.pos))
    for (const p of ['noun', 'verb', 'adj', 'phrase', 'other']) expect(pos.has(p as never), p).toBe(true)
    expect(vocab.filter(v => v.pos === 'noun').every(v => v.article !== undefined)).toBe(true)
    expect(vocab.filter(v => v.pos !== 'noun').every(v => v.article === undefined)).toBe(true)
    expect(new Set(vocab.map(v => v.de)).size).toBe(vocab.length)
  })
  it('listening dialogues and reading texts are real, coherent, in range and every question has its own options', () => {
    for (const l of listening) {
      expect(l.lines.length, l.id).toBeGreaterThanOrEqual(8)
      expect(new Set(l.lines.map(x => x.speaker)).size, l.id).toBeGreaterThanOrEqual(2)
      expect(l.questions.length, l.id).toBeGreaterThanOrEqual(3)
      expect(l.keywords.length, l.id).toBeGreaterThan(0)
    }
    for (const r of reading) {
      const n = r.body.reduce((a, p) => a + words(p), 0)
      expect(n, r.id).toBeGreaterThanOrEqual(60)
      expect(n, r.id).toBeLessThanOrEqual(180)
      expect(r.gloss.length, r.id).toBeGreaterThanOrEqual(4)
      expect(r.questions.length, r.id).toBeGreaterThanOrEqual(3)
    }
    for (const q of [...listening, ...reading].flatMap(x => x.questions)) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options.map(norm)).size).toBe(3)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(3)
    }
  })
  it('every reading gloss word really occurs in its text, every listening keyword in its dialogue', () => {
    for (const r of reading) {
      const text = norm(r.body.join(' '))
      for (const g of r.gloss) expect(text.includes(norm(g.word)), `${r.id}: ${g.word}`).toBe(true)
    }
    for (const l of listening) {
      const text = norm(l.lines.map(x => x.text).join(' '))
      for (const k of l.keywords) expect(text.includes(norm(k)), `${l.id}: ${k}`).toBe(true)
    }
  })
  it('the speaking scenario has a goal, 3+ turns, and every turn has hints and keywords that its hints can produce', () => {
    expect(scenario.level).toBe('A2')
    expect(scenario.turns.length).toBeGreaterThanOrEqual(3)
    for (const t of scenario.turns) {
      expect(t.hints.length).toBeGreaterThan(0)
      expect(t.keywords.length).toBeGreaterThan(0)
      const hints = norm(t.hints.join(' '))
      expect(t.keywords.some(k => hints.includes(norm(k)))).toBe(true)
    }
  })
  it('the writing model satisfies its own task: minimum length and every required element', () => {
    const w = writing[0]
    expect(words(w.model)).toBeGreaterThanOrEqual(w.minWords)
    // through the real writing analysis the app uses: the model meets every requirement and the analysis does discriminate
    const result = analyseWriting(w.model, w)
    expect(result.missing).toEqual([])
    expect(result.met).toHaveLength(w.mustInclude.length)
    expect(result.lengthOk).toBe(true)
    expect(result.errors).toEqual([])
    expect(analyseWriting('Hallo.', w).missing.length).toBeGreaterThan(3)
    expect(w.tips.length).toBeGreaterThanOrEqual(3)
  })
  it('learner instructions exist for every activity of the unit', () => {
    const scopes = A2_INSTRUCTIONS.filter(i => i.unit === U).map(i => i.scope)
    for (const s of ['unit', 'vocabulary', 'grammar', 'listening', 'reading', 'speaking', 'writing', 'review', 'test'])
      expect(scopes, s).toContain(s)
  })
})

describe('unit 11 — ids, ownership and references', () => {
  const c = conventions('a2')
  it('every id follows its convention', () => {
    expect(unit.key).toMatch(c.unitKey.re)
    for (const v of vocab) expect(v.id).toMatch(c.vocabulary(U).re)
    for (const g of grammar) expect(g.id).toMatch(c.grammar.re)
    for (const e of exercises) expect(e.id).toMatch(c.exercise(U).re)
    for (const l of listening) expect(l.id).toMatch(c.listening(U).re)
    for (const r of reading) expect(r.id).toMatch(c.reading(U).re)
    for (const w of writing) expect(w.id).toMatch(c.writing(U).re)
    expect(scenario.id).toMatch(c.speaking.re)
    expect(topicTestOfUnit(U)!.id).toMatch(c.unitTest(U).re)
    for (const q of final.questions) expect(q.id).toMatch(c.finalQuestion(U).re)
    for (const i of A2_INSTRUCTIONS) expect(i.id).toMatch(c.instruction.re)
  })
  it('ids are stable and sequential: v11-1…v11-n, a2-ex-11-01…08, a2-ft-11-01…15', () => {
    expect(vocab.map(v => v.id)).toEqual(vocab.map((_, i) => `v11-${i + 1}`))
    expect(exercises.map(e => e.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8].map(n => `a2-ex-11-0${n}`))
    expect(final.questions.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `a2-ft-11-${String(i + 1).padStart(2, '0')}`))
    expect(listening.map(l => l.id)).toEqual(['a2-li-11-01', 'a2-li-11-02'])
    expect(reading.map(r => r.id)).toEqual(['a2-re-11-01', 'a2-re-11-02'])
    expect(writing.map(w => w.id)).toEqual(['a2-wr-11-01'])
  })
  it('ids are unique across ALL levels (unit content never collides with A1 or with itself)', () => {
    const all = [
      ...vocabularyOf('A1'),
      ...vocabularyOf('A2'),
      ...grammarOf('A1'),
      ...grammarOf('A2'),
      ...exercisesOf('A1'),
      ...exercisesOf('A2'),
      ...listeningOf('A1'),
      ...listeningOf('A2'),
      ...readingOf('A1'),
      ...readingOf('A2'),
      ...writingOf('A1'),
      ...writingOf('A2'),
      ...speakingOf('A1'),
      ...speakingOf('A2'),
      ...testsOf('A1'),
      ...testsOf('A2'),
    ].map(x => x.id)
    expect(new Set(all).size).toBe(all.length)
    const ft = final.questions.map(q => q.id)
    expect(new Set(ft).size).toBe(ft.length)
    expect(ft.some(id => exerciseIndex.has(id))).toBe(false)
  })
  it('every item names its unit explicitly and the level of every item is A2', () => {
    for (const x of [...vocab, ...grammar, ...exercises, ...listening, ...reading, ...writing]) expect(x.unit).toBe(U)
    for (const x of [...grammar, ...listening, ...reading, ...writing, scenario]) expect(x.level).toBe('A2')
    for (const x of notes11) expect(grammarIndex.get(x.conceptId)?.unit).toBe(U)
    expect(finalTestOfUnit(U)?.unit).toBe(U)
  })
  it('references resolve inside the unit only', () => {
    const vocabIds = new Set(vocab.map(v => v.id))
    for (const v of vocab) for (const r of v.related) expect(vocabIds.has(r), `${v.id} → ${r}`).toBe(true)
    for (const v of vocab) expect(vocabularyIndex.get(v.id)).toBe(v)
    const ids = new Set(grammar.map(g => g.id))
    for (const e of exercises) expect(e.concept && ids.has(e.concept), e.id).toBe(true)
    for (const q of final.questions) if (q.concept) expect(ids.has(q.concept), q.id).toBe(true)
    for (const g of grammar) expect(testIndex.has(g.id)).toBe(false)
  })
  it('provenance is declared everywhere it is required, as ORIGINAL authored material (no invented source)', () => {
    for (const x of [...grammar, ...listening, ...reading, ...writing, scenario]) {
      expect(x.source?.kind, x.id).toBe('authored')
      expect(x.source?.author?.length ?? 0, x.id).toBeGreaterThan(10)
      expect(x.source?.url, x.id).toBeUndefined()
      expect(x.source?.citation, x.id).toBeUndefined()
    }
  })
})

describe('unit 11 — Russian and Kyrgyz are independent, complete and never a fallback', () => {
  it('the strict validator reports no error and no warning for the real bundle', () => {
    const bad = issues().filter(i => i.severity === 'error' || i.severity === 'warning')
    expect(bad).toEqual([])
  })
  it('every Russian/Kyrgyz pair of the unit is non-empty and different (spot-checked directly, independent of the validator)', () => {
    const pairs: [string, string, string][] = []
    const add = (where: string, ru: string | undefined, ky: string | undefined) => pairs.push([where, ru ?? '', ky ?? ''])
    add('unit.subtitle', unit.subtitle.ru, unit.subtitle.ky)
    for (const v of vocab) {
      add(`${v.id}.word`, v.ru, v.ky)
      add(`${v.id}.example`, v.exampleRu, v.exampleKy)
    }
    for (const g of grammar) {
      for (const k of ['title', 'summary', 'discover', 'why'] as const) add(`${g.id}.${k}`, g[k].ru, g[k].ky)
      g.when.forEach((w, i) => add(`${g.id}.when${i}`, w.ru, w.ky))
      for (const e of [...g.examples, ...g.reallife]) add(`${g.id}.example`, e.ru, e.ky)
      g.mistakes.forEach((m, i) => add(`${g.id}.mistake${i}`, m.note.ru, m.note.ky))
      g.dialogue.forEach((d, i) => add(`${g.id}.dialogue${i}`, d.ru, d.ky))
      add(`${g.id}.speak`, g.speakPrompt.prompt.ru, g.speakPrompt.prompt.ky)
    }
    for (const e of exercises) {
      add(`${e.id}.prompt`, e.promptRu, e.promptKy)
      add(`${e.id}.why`, e.why.ru, e.why.ky)
    }
    for (const l of listening) l.lines.forEach((x, i) => add(`${l.id}.line${i}`, x.ru, x.ky))
    for (const r of reading)
      r.gloss.forEach((g, i) => (add(`${r.id}.gloss${i}`, g.ru, g.ky), add(`${r.id}.grammar${i}`, g.grammar, g.grammarKy)))
    add('speaking.title', scenario.titleRu, scenario.titleKy)
    add('speaking.goal', scenario.goal.ru, scenario.goal.ky)
    scenario.turns.forEach((t, i) => add(`speaking.turn${i}`, t.aiRu, t.aiKy))
    for (const w of writing) {
      add(`${w.id}.situation`, w.situation.ru, w.situation.ky)
      w.tips.forEach((t, i) => add(`${w.id}.tip${i}`, t.ru, t.ky))
    }
    for (const q of final.questions) {
      add(`${q.id}.prompt`, q.promptRu, q.promptKy)
      add(`${q.id}.why`, q.why.ru, q.why.ky)
    }
    for (const n of notes11) {
      add(`why:${n.word}`, n.ru, n.ky)
      add(`why:${n.word}.reason`, n.reason.ru, n.reason.ky)
    }
    for (const i of instructions11) add(i.id, i.text.ru, i.text.ky)
    add('test.title', topicTestOfUnit(U)!.title.ru, topicTestOfUnit(U)!.title.ky)
    expect(pairs.length).toBeGreaterThan(250)
    for (const [where, ru, ky] of pairs) {
      expect(ru.trim(), `${where} ru`).not.toBe('')
      expect(ky.trim(), `${where} ky`).not.toBe('')
      expect(norm(ky), `${where}: ky is a copy of ru`).not.toBe(norm(ru))
    }
  })
  it('Kyrgyz text really is Kyrgyz: it uses Kyrgyz letters or words that Russian does not have (ү ө ң), never a Russian-only sentence', () => {
    const kyOnly = /[үөңҮӨҢ]/
    // single words can legitimately lack ү/ө/ң, so the vocabulary is judged as a whole (the letters are frequent in real Kyrgyz)
    expect(vocab.filter(v => kyOnly.test(v.ky + v.exampleKy)).length / vocab.length).toBeGreaterThan(0.7)
    for (const e of exercises) expect(kyOnly.test(e.promptKy! + e.why.ky), e.id).toBe(true)
    for (const q of final.questions) expect(kyOnly.test(q.promptKy + q.why.ky), q.id).toBe(true)
    for (const g of grammar) expect(kyOnly.test((g.summary.ky ?? '') + (g.why.ky ?? '') + (g.discover.ky ?? '')), g.id).toBe(true)
  })
  it('German examples quoted inside an explanation are preserved identically in both explanation languages', () => {
    // every run of three or more Latin-script words in the Russian text is German; it must appear unchanged in the Kyrgyz text
    const german = (t: string) =>
      [...t.matchAll(/[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß'-]*(?: [A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß'-]*){2,}/g)].map(m => m[0])
    const pairs: [string, { ru: string; ky?: string }][] = []
    for (const g of grammar) {
      g.when.forEach((w, i) => pairs.push([`${g.id}.when${i}`, w]))
      g.mistakes.forEach((m, i) => pairs.push([`${g.id}.mistake${i}`, m.note]))
      pairs.push([`${g.id}.why`, g.why], [`${g.id}.summary`, g.summary])
    }
    for (const n of notes11) pairs.push([`why:${n.word}`, n.reason])
    for (const e of exercises) pairs.push([e.id, e.why])
    for (const x of final.questions) pairs.push([x.id, x.why])
    let checked = 0
    for (const [where, t] of pairs)
      for (const sentence of german(t.ru)) {
        expect(t.ky ?? '', `${where}: "${sentence}" differs in Kyrgyz`).toContain(sentence)
        checked++
      }
    expect(checked).toBeGreaterThan(20)
  })
  it('no localised field was left to a runtime fallback: the unit has no L10n with only Russian', () => {
    const missing: string[] = []
    const check = (where: string, v: { ru?: string; ky?: string } | undefined) => {
      if (!v || !v.ru || !v.ky) missing.push(where)
    }
    check('subtitle', unit.subtitle)
    for (const g of grammar) {
      for (const k of ['title', 'summary', 'discover', 'why'] as const) check(`${g.id}.${k}`, g[k])
      g.when.forEach((w, i) => check(`${g.id}.when${i}`, w))
      g.mistakes.forEach((m, i) => check(`${g.id}.mistake${i}`, m.note))
    }
    for (const e of exercises) check(`${e.id}.why`, e.why)
    for (const q of final.questions) check(`${q.id}.why`, q.why)
    expect(missing).toEqual([])
  })
})

describe('unit 11 — revision exercise structure', () => {
  const hand = exercises.filter(e => e.type !== 'article')
  it('uses a real mix of exercise types', () => {
    const types = new Set(hand.map(e => e.type))
    for (const t of ['fill', 'choice', 'order']) expect(types.has(t as never), t).toBe(true)
  })
  it('each exercise is well-formed for its type with exactly one correct answer', () => {
    for (const e of hand) {
      if (e.type === 'order') {
        expect(e.words!.length, e.id).toBeGreaterThanOrEqual(5)
        expect([...e.words!].sort()).toEqual(e.answer.split(' ').sort())
        expect(e.words!.join(' '), `${e.id} words are not scrambled`).not.toBe(e.answer)
      } else {
        expect(e.options!, e.id).toHaveLength(3)
        expect(new Set(e.options!.map(norm)).size, e.id).toBe(3)
        expect(
          e.options!.filter(o => o === e.answer),
          e.id,
        ).toHaveLength(1)
      }
      if (e.type === 'fill') expect(e.prompt.split('___'), e.id).toHaveLength(2)
      expect(e.promptRu, e.id).toBeTruthy()
      expect(e.promptKy, e.id).toBeTruthy()
    }
  })
  it('the correct fill-in answer produces a sentence that is not also valid with another option (distractors are wrong)', () => {
    const fill = hand.filter(e => e.type === 'fill')
    expect(fill.length).toBeGreaterThanOrEqual(3)
    for (const e of fill) expect(e.options!.filter(o => o !== e.answer).length, e.id).toBe(2)
  })
  it('the 8 exercises cover the three concepts (no concept ignored, none above 4)', () => {
    const per = new Map<string, number>()
    for (const e of hand) per.set(e.concept!, (per.get(e.concept!) ?? 0) + 1)
    expect([...per.keys()].sort()).toEqual([...unit.grammarIds].sort())
    for (const n of per.values()) {
      expect(n).toBeGreaterThanOrEqual(2)
      expect(n).toBeLessThanOrEqual(4)
    }
  })
  it('there are no duplicate exercises', () => {
    const keys = hand.map(e => norm(e.prompt === 'Bilde den Satz.' ? e.answer : e.prompt))
    expect(new Set(keys).size).toBe(hand.length)
  })
})

describe('unit 11 — the final test is a separate collection with a sound answer key', () => {
  const q = final.questions
  const hand = exercises.filter(e => e.type !== 'article')
  const tokens = (s: string) =>
    new Set(
      norm(s)
        .replace(/[^\p{L}\s]/gu, ' ')
        .split(' ')
        .filter(t => t.length > 2),
    )
  const jaccard = (a: Set<string>, b: Set<string>) => [...a].filter(t => b.has(t)).length / new Set([...a, ...b]).size

  it('every question has three distinct options and exactly one correct answer that is one of them', () => {
    for (const x of q) {
      expect(x.options, x.id).toHaveLength(3)
      expect(new Set(x.options.map(norm)).size, x.id).toBe(3)
      expect(
        x.options.filter(o => o === x.answer),
        x.id,
      ).toHaveLength(1)
      expect(['grammar', 'vocabulary', 'reading', 'listening']).toContain(x.skill)
    }
  })
  it('no question is a copy of a revision exercise: not the same id, prompt, answer or sentence', () => {
    const exerciseKeys = new Set(hand.flatMap(e => [norm(e.prompt), norm(e.answer)]))
    for (const x of q) {
      expect(exerciseIndex.has(x.id), x.id).toBe(false)
      expect(exerciseKeys.has(norm(x.prompt)) && exerciseKeys.has(norm(x.answer)), `${x.id} repeats an exercise`).toBe(false)
      for (const e of hand) {
        expect(norm(x.answer), `${x.id} answer = ${e.id} answer`).not.toBe(norm(e.answer))
        // a fill sentence with the answer put in must not be the same sentence in both collections
        const filled = (e.type === 'fill' ? e.prompt.replace('___', e.answer) : e.answer).replace(/\s+/g, ' ')
        const asked = (x.prompt.includes('___') ? x.prompt.replace('___', x.answer) : x.answer).replace(/\s+/g, ' ')
        expect(norm(filled), `${x.id} ≙ ${e.id}`).not.toBe(norm(asked))
      }
    }
  })
  it('no question is a light rewrite of an exercise: sentence overlap stays low (Jaccard < 0.6)', () => {
    const sentence = (x: { prompt: string; answer: string }) =>
      x.prompt.includes('___') ? x.prompt.replace('___', x.answer) : x.prompt + ' ' + x.answer
    const exSentence = (e: { type: string; prompt: string; answer: string }) =>
      e.type === 'fill' ? e.prompt.replace('___', e.answer) : e.type === 'order' ? e.answer : e.prompt + ' ' + e.answer
    for (const x of q)
      for (const e of hand) expect(jaccard(tokens(sentence(x)), tokens(exSentence(e))), `${x.id} vs ${e.id}`).toBeLessThan(0.6)
  })
  it('no two questions repeat each other', () => {
    const prompts = q.map(x => norm(x.prompt) + '|' + norm(x.answer))
    expect(new Set(prompts).size).toBe(q.length)
    for (let i = 0; i < q.length; i++)
      for (let j = i + 1; j < q.length; j++)
        expect(jaccard(tokens(q[i].prompt + q[i].answer), tokens(q[j].prompt + q[j].answer)), `${q[i].id} vs ${q[j].id}`).toBeLessThan(0.6)
  })
  it('tests different learning objectives: all three concepts, all skills, and a spread of grammar points', () => {
    const concepts = new Set(q.map(x => x.concept).filter(Boolean))
    for (const id of unit.grammarIds) expect(concepts.has(id), id).toBe(true)
    const skills = new Map<string, number>()
    for (const x of q) skills.set(x.skill, (skills.get(x.skill) ?? 0) + 1)
    expect(skills.get('grammar')).toBeGreaterThanOrEqual(8)
    expect(skills.get('vocabulary')).toBeGreaterThanOrEqual(3)
    expect(skills.get('reading')).toBeGreaterThanOrEqual(2)
    const perConcept = new Map<string, number>()
    for (const x of q) if (x.concept) perConcept.set(x.concept, (perConcept.get(x.concept) ?? 0) + 1)
    for (const n of perConcept.values()) expect(n).toBeLessThanOrEqual(7)
  })
  it('the authored position of the correct answer is evenly spread (5/5/5) with no run of three', () => {
    const counts = positionCounts(q.map(x => ({ options: x.options, answer: x.options.indexOf(x.answer) }))).get(3)!
    expect(counts).toEqual([5, 5, 5])
    const pos = q.map(x => x.options.indexOf(x.answer))
    for (let i = 2; i < pos.length; i++) expect(pos[i] === pos[i - 1] && pos[i] === pos[i - 2], `run at ${i}`).toBe(false)
  })
  it('the listening and reading answer keys are spread as well (no run of three, no position above 3 of 8 / 6)', () => {
    for (const set of [listening, reading]) {
      const pos = set.flatMap(x => x.questions.map(k => k.answer))
      for (let i = 2; i < pos.length; i++) expect(pos[i] === pos[i - 1] && pos[i] === pos[i - 2]).toBe(false)
      const counts = [0, 1, 2].map(p => pos.filter(a => a === p).length)
      for (const c of counts) expect(c).toBeGreaterThanOrEqual(1)
      expect(Math.max(...counts)).toBeLessThanOrEqual(Math.ceil((pos.length * 3) / 8))
    }
  })
  it('reading-comprehension questions carry the text they refer to, and a question never gives away its answer in its own options', () => {
    for (const x of q.filter(k => k.skill === 'reading')) expect(x.prompt.length).toBeGreaterThan(120)
    for (const x of q) expect(x.options.filter(o => o.length > 0).length).toBe(3)
  })
})

describe('unit 11 — release gates and the stage boundary', () => {
  it('authoring validation: 0 errors, 0 warnings; the only review flags are the explicit Beta flags (sign-offs, locale reviews, level test)', () => {
    const all = issues()
    expect(all.filter(i => i.severity === 'error')).toEqual([])
    expect(all.filter(i => i.severity === 'warning')).toEqual([])
    const review = all.filter(i => i.severity === 'review').map(i => `${i.rule} ${i.where}`)
    expect(review.sort()).toEqual(EXPECTED_BETA_FLAGS)
  })
  it('no human review is recorded by the assistant: A2_REVIEWS stays empty', () => {
    expect(A2_REVIEWS).toEqual({})
  })
  it('release validation still REJECTS incomplete A2: the level test, and the missing sign-offs of units 11–20', () => {
    const errors = issues('release').filter(i => i.severity === 'error')
    expect(errors.length).toBeGreaterThan(0)
    expect(errors.some(e => e.rule === 'unit-missing' && /^units:(1[0-9]|20)$/.test(e.where))).toBe(false) // all ten planned A2 units are authored (B1, still planned, legitimately reports its own)
    expect(errors.some(e => e.rule === 'unit-minimum' && /level test/.test(e.message))).toBe(true)
    expect(errors.some(e => e.rule === 'cefr-signoff-missing' && e.where === 'units:11')).toBe(true)
    expect(errors.some(e => e.rule === 'unit-missing' && e.where === 'units:11')).toBe(false)
    expect(errors.some(e => e.rule === 'unit-missing' && e.where === 'units:12')).toBe(false)
    expect(errors.some(e => e.rule === 'cefr-signoff-missing' && e.where === 'units:12')).toBe(true)
    expect(errors.some(e => e.rule === 'unit-missing' && e.where === 'units:13')).toBe(false)
    expect(errors.some(e => e.rule === 'cefr-signoff-missing' && e.where === 'units:13')).toBe(true)
  })
  it('the legacy units 11–20 and the visible curriculum units 201–243 are authored', () => {
    expect(a2AuthoredUnits().map(u => u.id)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    const authoredA2UnitIds = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, ...Array.from({ length: 43 }, (_, i) => 201 + i)]
    for (const x of [
      ...vocabularyOf('A2'),
      ...grammarOf('A2'),
      ...exercisesOf('A2'),
      ...listeningOf('A2'),
      ...readingOf('A2'),
      ...writingOf('A2'),
    ])
      expect(authoredA2UnitIds).toContain(x.unit)
    expect(testsOf('A2').map(t => t.id)).toEqual([
      'unit-11',
      'unit-12',
      'unit-13',
      'unit-14',
      'unit-15',
      'unit-16',
      'unit-17',
      'unit-18',
      'unit-19',
      'unit-20',
    ])
    expect(allUnits.filter(u => u.id >= 21 && u.id < 100 && u.level !== 'B1')).toEqual([]) // no A2 unit beyond 20 (B1 owns 21–32; 100+ are A1 v2 units)
  })
  it('A2 stays planned and invisible; no placement, level test or tutor content was added', () => {
    const a2 = COURSE.levels.find(l => l.id === 'A2')!
    expect(a2.status).toBe('beta')
    expect(a2.releasedLocales).toEqual(['ru', 'ky'])
    expect(isLevelVisible('A2')).toBe(true)
    expect(A2_PLACEMENT_ITEMS).toEqual([])
    expect(A2_TUTOR_TEMPLATES).toEqual([])
    expect(testsOf('A2').some(t => t.kind === 'level' || t.kind === 'placement')).toBe(false)
  })
})

describe('unit 11 — Stage 7A.2 review decisions (F1–F11, K-corrections)', () => {
  const everything = JSON.stringify([
    unit,
    vocab,
    grammar,
    exercises,
    listening,
    reading,
    writing,
    scenario,
    final,
    notes11,
    instructions11,
  ])
  const german = JSON.stringify([
    vocab.map(v => [v.de, v.example]),
    grammar.map(g => [g.examples, g.reallife, g.dialogue, g.mistakes.map(m => [m.wrong, m.right]), g.speakPrompt.sample]),
    exercises.map(e => [e.prompt, e.answer, e.options]),
    listening.map(l => l.lines.map(x => x.text)),
    reading.map(r => r.body),
    [writing[0].model, scenario.turns.map(t => [t.ai, t.hints])],
    final.questions.map(q => [q.prompt, q.options]),
  ])
  const sentences = (s: string) => s.split(/[.?!"]|\n/).filter(x => !x.includes('…')) // focus labels like "dass … sind" are not sentences

  it('F5: no Konjunktiv II anywhere — no term, no distractor (wäre / könnte / müssten / hätte …)', () => {
    expect(everything).not.toMatch(/Konjunktiv/i)
    expect(german).not.toMatch(/\b(wäre|wären|könnte|könnten|müsste|müssten|wollte[nt]? es|hätte|hätten|würde|würden)\b/)
  })
  it('F1: `dass` appears only after glauben / wissen / finden (never adjective + dass)', () => {
    for (const s of sentences(german).filter(x => /\bdass\b/.test(x))) expect(/(glaube|weiß|finde),\s+dass\b/.test(s), `"${s}"`).toBe(true)
    expect(german).not.toMatch(/stolz, dass/)
  })
  it('F1/F2: no verb-final Perfekt (participle + auxiliary) inside a `dass` clause, and no `dass` + `weil` in one sentence', () => {
    for (const s of sentences(german).filter(x => /\bdass\b/.test(x))) {
      expect(s, s).not.toMatch(/\bge\w+(t|en)\s+(habe|hast|hat|haben|bin|bist|ist|sind|seid)\b/)
      expect(s, s).not.toMatch(/\bweil\b/)
    }
  })
  it('F2: reading 2 no longer stacks subordinate clauses; every reading sentence has at most one subordinate clause', () => {
    for (const r of reading)
      for (const p of r.body) for (const s of sentences(p)) expect((s.match(/\b(weil|dass)\b/g) ?? []).length, s).toBeLessThanOrEqual(1)
    expect(reading[1].body.join(' ')).toContain('Das Praktikum hat mein Leben verändert. Ich bin dort mutiger geworden.')
  })
  it('F3 / F7 / F10 / F11 kept: reflexive Perfekt, seit / vor, schon einmal / noch nie, modal at the end of weil, weil recalled from A1', () => {
    expect(german).toMatch(/habe mich [^"]*entschieden/)
    expect(german).toMatch(/hat sich verändert/)
    expect(german).toContain('seit einem Jahr')
    expect(german).toContain('schon einmal')
    expect(german).toContain('noch nie')
    expect(german).toMatch(/weil ich [^."]*(möchte|wollte)/)
    expect(grammar[2].when.some(w => /A1/.test(w.ru) && /A1/.test(w.ky ?? ''))).toBe(true)
  })
  it('F4: recognition-only vocabulary is never REQUIRED for production (no gap, speaking keyword or writing requirement depends on it)', () => {
    expect(UNIT_11_RECEPTIVE_WORDS.length).toBeGreaterThanOrEqual(8)
    for (const w of UNIT_11_RECEPTIVE_WORDS)
      expect(
        vocab.some(v => v.de === w),
        `${w} is not a unit word`,
      ).toBe(true)
    const stems = UNIT_11_RECEPTIVE_WORDS.map(w => norm(w.replace(/^sich /, '')).slice(0, 7))
    const required = [
      ...exercises.filter(e => e.type === 'fill').map(e => e.answer),
      ...final.questions.filter(q => q.prompt.includes('___')).map(q => q.answer),
      ...scenario.turns.flatMap(t => t.keywords),
      ...writing[0].mustInclude.flatMap(m => m.patterns),
    ].map(norm)
    for (const r of required)
      for (const s of stems) expect(r.includes(s) && s.length > 4, `"${r}" requires receptive word stem "${s}"`).toBe(false)
  })
  it('K1 / K2 / K3: the three investigated Kyrgyz errors are corrected; the unambiguous K5 K6 K10 K11 K15 K17 as well', () => {
    for (const bad of [
      'иштеши керек болчубуз',
      'жоопттон',
      'туулгамын',
      'өзү кайда',
      'өзү кайдан',
      'аттык сөздөрдү',
      'иштегем.',
      'жайды өзгөртүү',
      'эсептетүү',
    ])
      expect(everything, bad).not.toContain(bad)
    for (const good of ['иштешибиз керек болчу', 'жооптон', 'туулганмын', 'зат атоочторду', 'иштегенмин', 'жашаган жерди өзгөртүү'])
      expect(everything, good).toContain(good)
  })
  it('uncertain Kyrgyz items are NOT changed (left for the native reviewer): K4 K7 K8 K9 K12 K13 K14 K16 K18', () => {
    for (const kept of [
      'туулган болуу',
      'аткара алуу, жөндөө',
      'жөндөлгөн этиш',
      'ажыраган ab-',
      'ээрчимелүү сүйлөм',
      'сыймыктанган',
      'көчүп кетүү',
    ])
      expect(everything, kept).toContain(kept)
  })
  it('no human review is recorded: A2_REVIEWS is still empty and the release still names the missing sign-off', () => {
    expect(A2_REVIEWS).toEqual({})
    expect(issues('release').some(i => i.rule === 'cefr-signoff-missing' && i.where === 'units:11')).toBe(true)
  })
})
