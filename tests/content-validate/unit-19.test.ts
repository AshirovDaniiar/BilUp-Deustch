// @vitest-environment node
/**
 * Stage 7J — the PRODUCTION content of unit 19 ("Stadtleben und öffentliche Dienste"): completeness, identity, the approved vocabulary map and the
 * productive / receptive split, Russian/Kyrgyz independence (no identical gloss, no artificial bracket), the DIRECTIONS micro-task (listening, speaking, grammar,
 * exercises, final-test items), the grammar limits of the plan (man + modal; two frames of indirect questions only; the route prepositions; no Passiv notices, no
 * Konjunktiv II, no ordinals, no adjectives), formal register and the no-legal-advice rule, exercise and test structure, separation of revision and final test, the
 * reading-question rule, answer-position balance, the objective→assessment matrix, and the stage boundaries (Units 11–18 unchanged, A2 planned and invisible).
 */
import { a2AuthoredUnits } from '../a2-authored'
import { withoutB1Content } from './fixtures'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { conventions } from '../../scripts/content-validate/conventions'
import { A2_REVIEWS } from '../../scripts/content-validate/reviews'
import { positionCounts } from '../../scripts/content-validate/rules/answers'
import { UNIT_MINIMUMS } from '../../scripts/content-validate/rules/metadata'
import { validateContent } from '../../scripts/content-validate/validate'
import { EXPECTED_BETA_FLAGS, EXPECTED_REVIEW_FLAGS } from './beta-flags'
import { cefrPackage, kyPackage } from '../../scripts/review/unit-package'
import { A2_INSTRUCTIONS } from '../../src/data/a2/instructions'
import { A2_PLACEMENT_ITEMS } from '../../src/data/a2/placement'
import { A2_UNIT_PLAN } from '../../src/data/a2/registry'
import { A2_TUTOR_TEMPLATES } from '../../src/data/a2/tutor'
import { UNIT_19_RECEPTIVE_WORDS } from '../../src/data/a2/unit19/vocabulary'
import {
  exerciseIndex,
  exercisesForUnit,
  finalTestOfUnit,
  grammarForUnit,
  grammarIndex,
  listeningForUnit,
  readingForUnit,
  speakingForUnit,
  speakingIndex,
  testsOf,
  topicTestOfUnit,
  unitById,
  vocabularyForUnit,
  whyNotesOf,
  writingForUnit,
} from '../../src/data/catalog'
import { COURSE, isLevelVisible } from '../../src/data/course'
import { analyseWriting } from '../../src/services/analysis'

const U = 19
const root = join(__dirname, '../..')
const doc = (f: string) => readFileSync(join(root, f), 'utf8')
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
const notes = whyNotesOf('A2').filter(n => grammarIndex.get(n.conceptId)?.unit === U)
const instructions = A2_INSTRUCTIONS.filter(i => i.unit === U)
const norm = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase()
const words = (s: string) => s.split(/\s+/).filter(Boolean).length
// The A2 world (A1 + A2 + registry): B1 content is excluded, because these tests describe A2's own validation state; B1 has its own tests (b1-profile, b1-unit-21).
const issues = (mode?: 'release') => validateContent(withoutB1Content(fullBundle()), { mode })
const lemma = (s: string) =>
  s
    .replace(/\((R|Pl\.)\)/g, '')
    .replace(/^(der|die|das)\s+/i, '')
    .replace(/^sich\s+/i, '')
    .trim()
    .toLowerCase()

describe('unit 19 — completeness', () => {
  it('is the planned unit: same id, key, title and level', () => {
    expect(unit.id).toBe(plan.id)
    expect(unit.key).toBe(plan.key)
    expect(unit.title).toBe(plan.titleDe)
    expect(unit.level).toBe('A2')
  })
  it('meets every minimum and the unit-18 plan (3 concepts, 8 exercises, 15 questions)', () => {
    expect(vocab.length).toBeGreaterThanOrEqual(UNIT_MINIMUMS.vocabulary)
    expect(grammar).toHaveLength(3)
    expect(unit.grammarIds).toEqual(grammar.map(g => g.id))
    expect(grammar.map(g => g.id)).toEqual(['a2-man-regeln-verbote', 'a2-indirekte-fragen', 'a2-wegbeschreibung-praepositionen'])
    expect(listening).toHaveLength(2)
    expect(reading).toHaveLength(2)
    expect(writing).toHaveLength(1)
    expect(scenario).toBeDefined()
    expect(exercises).toHaveLength(8)
    expect(final.questions).toHaveLength(15)
    const def = topicTestOfUnit(U)!
    expect([def.id, def.kind, def.level, def.unit, def.size]).toEqual(['unit-19', 'topic', 'A2', 19, 15])
  })
  it('workload: three concepts, each practised and assessed (exercises 2 / 3 / 3; final test 4 / 2 / 4 — the indirect questions are capped at two items by audit D-4), each with a full explanation', () => {
    expect(grammar.map(g => exercises.filter(e => e.concept === g.id).length)).toEqual([2, 3, 3])
    for (const g of grammar) {
      expect(g.examples.length, g.id).toBeGreaterThanOrEqual(4)
      expect(g.mistakes.length, g.id).toBeGreaterThanOrEqual(3)
      expect(g.when.length, g.id).toBeGreaterThanOrEqual(3)
      expect(g.dialogue.length, g.id).toBe(4)
      expect(
        notes.some(n => n.conceptId === g.id),
        g.id,
      ).toBe(true)
      expect(
        final.questions.some(q => q.concept === g.id),
        g.id,
      ).toBe(true)
    }
    expect(grammar.map(g => final.questions.filter(q => q.concept === g.id).length)).toEqual([4, 2, 4])
  })
  it('lists, texts and tasks are well-formed', () => {
    for (const l of listening) {
      expect(l.lines).toHaveLength(l.id === 'a2-li-19-01' ? 12 : 10)
      expect(new Set(l.lines.map(x => x.speaker)).size).toBe(2)
      expect(l.questions).toHaveLength(4)
      const text = norm(l.lines.map(x => x.text).join(' '))
      for (const k of l.keywords) expect(text.includes(norm(k)), `${l.id}: ${k}`).toBe(true)
    }
    for (const r of reading) {
      const n = r.body.reduce((a, p) => a + words(p), 0)
      expect(n, r.id).toBeGreaterThanOrEqual(50)
      expect(n, r.id).toBeLessThanOrEqual(120)
      const text = norm(r.body.join(' '))
      for (const g of r.gloss) expect(text.includes(norm(g.word)), `${r.id}: ${g.word}`).toBe(true)
    }
    for (const q of [...listening, ...reading].flatMap(x => x.questions)) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options.map(norm)).size).toBe(3)
    }
    expect(scenario.turns).toHaveLength(4)
    for (const t of scenario.turns) expect(t.keywords.some(k => norm(t.hints.join(' ')).includes(norm(k)))).toBe(true)
    const w = writing[0]
    expect(w.formal).toBe(true) // unit 19: a formal e-mail to an office
    expect(w.minWords).toBe(60) // Stage 7B plan: about 60+ words
    expect(words(w.model)).toBeGreaterThanOrEqual(w.minWords)
    const feedback = analyseWriting(w.model, w)
    expect(feedback.missing).toEqual([])
    expect(feedback.lengthOk).toBe(true)
    expect(feedback.errors).toEqual([])
    expect(analyseWriting('Hallo.', w).missing.length).toBeGreaterThan(3)
  })
  it('the writing task is a formal E-MAIL to the Bürgeramt: Sie, the opening-hours question, one ob-question, one man sentence, thanks, a formal closing; the model is not legal advice', () => {
    const w = writing[0]
    expect(w.formal).toBe(true)
    expect(w.title).toMatch(/E-Mail/)
    expect(w.model).toMatch(/^Sehr geehrte Damen und Herren/)
    expect(w.model).toMatch(/Können Sie mir sagen, wann/)
    expect(w.model).toMatch(/Ich möchte auch wissen, ob/)
    expect(w.model).toMatch(/Man muss/)
    expect(w.model).toMatch(/Mit freundlichen Grüßen/)
    expect(w.model).not.toMatch(/\bdu\b|\bdein\b|\bdir\b|Liebe /)
    expect(w.situation.ru).toMatch(/языковое упражнение/)
    expect(w.situation.ky).toMatch(/тилдик көнүгүү/)
  })
  it('GENRE: L1 is the Bürgeramt (Sie, two speakers), L2 a street dialogue (Sie), S1 a route explanation (Sie); R1 is a form, R2 a notice board; the unit is formal and states that it is language practice', () => {
    expect(listening[0].title).toMatch(/Bürgeramt/)
    expect(listening[1].title).toMatch(/Straße/)
    for (const l of listening) expect(l.lines.map(x => x.text).join(' ')).toMatch(/\bSie\b|\bIhnen\b|\bIhr/)
    const s1 = scenario.turns.map(x => x.ai).join(' ')
    expect(s1).toMatch(/\bSie\b/)
    expect(s1).not.toMatch(/\bdu\b|\bdein\b/)
    expect(reading[0].title).toMatch(/Formular/)
    expect(reading[1].title).toMatch(/Öffnungszeiten und Regeln/)
    expect(JSON.stringify([listening, reading, scenario, writing[0].model])).not.toMatch(/\bdu\b|\bdein\b|\bdir\b|Hallo|Tschüss/)
    const unitText = instructions.find(i => i.scope === 'unit')!.text
    expect(unitText.ru).toMatch(/не как юридическая консультация/)
    expect(unitText.ky).toMatch(/юридикалык кеңеш эмес/)
    expect(instructions.find(i => i.scope === 'vocabulary')!.text.ru).toMatch(/немецкую практику/)
  })
  it('the directions micro-task is complete: L2 asks the way, gives a route (bis zur, rechts, an … vorbei, gegenüber von), the time on foot, the parcel counter and the cash machine; S1 explains from a mini-map; G3 has exercises and final-test items', () => {
    const l2 = listening[1].lines.map(x => x.text).join(' ')
    for (const part of [
      'wo die Post ist',
      'bis zur Kreuzung',
      'rechts',
      'an der Bank vorbei',
      'gegenüber von der Apotheke',
      'fünf Minuten zu Fuß',
      'Schalter zwei',
      'Geldautomaten',
    ])
      expect(l2, part).toContain(part)
    expect(scenario.id).toBe('a2-sp-19-01')
    expect(scenario.title).toMatch(/Weg/)
    expect(scenario.goal.ru).toMatch(/Мини-карта/)
    expect(scenario.goal.ky).toMatch(/Мини-карта/)
    expect(scenario.turns[0].ai).toMatch(/[Kk]önnen Sie mir sagen, wo/)
    expect(scenario.turns.at(-1)!.hints.join(' ')).toMatch(/Können Sie mir sagen|Ich möchte wissen, ob/)
    const g3 = 'a2-wegbeschreibung-praepositionen'
    expect(exercises.filter(e => e.concept === g3)).toHaveLength(3)
    expect(final.questions.filter(q => q.concept === g3).map(q => q.id)).toEqual([
      'a2-ft-19-06',
      'a2-ft-19-07',
      'a2-ft-19-13',
      'a2-ft-19-14',
    ])
  })
  it('office and service information is complete: the form, the notice board, the Bürgeramt dialogue', () => {
    const r1 = reading[0].body.join(' ')
    for (const part of ['Name, Vorname', 'Ausweis und Mietvertrag', 'Unterschrift', 'Schalter 3', 'von 8 bis 12 Uhr'])
      expect(r1, part).toContain(part)
    const r2 = reading[1].body.join(' ')
    for (const part of [
      'Montag bis Freitag 8 bis 12 Uhr',
      'Donnerstag auch 14 bis 18 Uhr',
      'geschlossen',
      'Bitte nicht rauchen',
      'Man darf',
      'Umleitung',
    ])
      expect(r2, part).toContain(part)
    const l1 = listening[0].lines.map(x => x.text).join(' ')
    for (const part of ['10 Uhr', 'Mietvertrag', 'Unterschrift', 'fünf Minuten', 'Zwei Wochen']) expect(l1, part).toContain(part)
    expect(final.questions.filter(q => /Aushang|Information|Wegbeschreibung|Situation/.test(q.prompt)).length).toBeGreaterThanOrEqual(5)
  })
  it('a request for information and a polite repetition pattern are covered: the learner asks (S1 turn 4, W1, FT 04, 05) and repeats a route (S1 turns 1–2)', () => {
    expect(scenario.turns).toHaveLength(4)
    expect(writing[0].mustInclude.map(m => m.label).join(' ')).toMatch(/Können Sie mir sagen/)
    expect(writing[0].mustInclude.map(m => m.label).join(' ')).toMatch(/ob/)
    expect(final.questions.filter(q => q.concept === 'a2-indirekte-fragen').map(q => q.id)).toEqual(['a2-ft-19-04', 'a2-ft-19-05'])
  })
  it('instructions exist for every activity', () => {
    const scopes = instructions.map(i => i.scope)
    for (const s of ['unit', 'vocabulary', 'grammar', 'listening', 'reading', 'speaking', 'writing', 'review', 'test'])
      expect(scopes).toContain(s)
  })
})

describe('unit 19 — the approved vocabulary map and the productive / receptive split', () => {
  const map = doc('docs/authoring/A2_STAGE7B_VOCABULARY_MAP.md')
  const section = map.slice(map.indexOf('### Unit 19 —'), map.indexOf('### Unit 20 —'))
  const planned = section
    .split('\n')
    .filter(l => l.startsWith('- **'))
    .flatMap(l => l.slice(l.indexOf('): ') + 3).split(';'))
    .map(x => x.trim())
  it('implements exactly the 38 planned items, with the planned receptive classification (35 productive / 3 receptive)', () => {
    expect(planned).toHaveLength(38)
    expect(vocab.map(v => lemma(v.de)).sort()).toEqual(planned.map(lemma).sort())
    const plannedReceptive = planned
      .filter(x => /\(R\)/.test(x))
      .map(lemma)
      .sort()
    expect([...UNIT_19_RECEPTIVE_WORDS].map(lemma).sort()).toEqual(plannedReceptive)
    expect(UNIT_19_RECEPTIVE_WORDS).toHaveLength(3)
    expect(vocab).toHaveLength(38)
  })
  it('follows the plan order, every noun has an article, nothing else has one; ids are v19-1 … v19-38; words are unique', () => {
    expect(vocab.map(v => v.id)).toEqual(vocab.map((_, i) => `v19-${i + 1}`))
    expect(vocab.map(v => lemma(v.de))).toEqual(planned.map(lemma))
    for (const v of vocab) expect(v.article === undefined, v.id).toBe(v.pos !== 'noun')
    expect(new Set(vocab.map(v => v.de)).size).toBe(vocab.length)
    for (const v of vocab)
      for (const r of v.related)
        expect(
          vocab.some(x => x.id === r),
          `${v.id} → ${r}`,
        ).toBe(true)
  })
  it('the nouns carry the articles of the plan; Verkehr has no plural; the verbs, the adjectives and the four groups of the map', () => {
    const word = (de: string) => vocab.find(v => v.de === de)!
    expect(word('Amt').article).toBe('das')
    expect(word('Antrag').article).toBe('der')
    expect(word('Auskunft').article).toBe('die')
    expect(word('Amt').plural).toBe('Ämter')
    expect(word('Verkehr').plural).toBeUndefined()
    expect(vocab.filter(v => v.pos === 'verb').map(v => v.de)).toEqual([
      'sich anmelden',
      'ausfüllen',
      'unterschreiben',
      'abschicken',
      'abheben',
      'überweisen',
      'parken',
    ])
    expect(vocab.filter(v => v.pos === 'adj').map(v => v.de)).toEqual(['erlaubt', 'verboten', 'geöffnet', 'geschlossen'])
    expect(vocab.slice(0, 12).map(v => v.de)).toEqual([
      'Amt',
      'Rathaus',
      'Bürgeramt',
      'Anmeldung',
      'sich anmelden',
      'Formular',
      'Antrag',
      'ausfüllen',
      'Unterschrift',
      'unterschreiben',
      'Ausweis',
      'Aufenthaltserlaubnis',
    ])
    expect(vocab.slice(12, 20).map(v => v.de)).toEqual([
      'Paket',
      'Briefmarke',
      'Brief',
      'abschicken',
      'Schalter',
      'Geldautomat',
      'abheben',
      'überweisen',
    ])
  })
  it('receptive words are never REQUIRED: not a gap answer, speaking keyword / hint, writing requirement or correct final-test answer', () => {
    const stems = UNIT_19_RECEPTIVE_WORDS.map(w => norm(w).slice(0, 6))
    const required = [
      ...exercises.filter(e => e.type === 'fill').map(e => e.answer),
      ...final.questions.filter(q => q.prompt.includes('___') && q.skill !== 'reading').map(q => q.answer),
      ...final.questions.map(q => q.answer),
      ...scenario.turns.flatMap(t => [...t.keywords, ...t.hints]),
      ...writing[0].mustInclude.flatMap(m => m.patterns),
    ].map(norm)
    for (const r of required) for (const s of stems) expect(r.includes(s), `"${r}" requires the receptive stem "${s}"`).toBe(false)
  })
  it('receptive words occur in the texts of the unit (so they are met before they are tested) and every item has an example sentence', () => {
    const text = norm(
      JSON.stringify([reading.map(r => r.body), listening.map(l => l.lines.map(x => x.text)), scenario.turns.map(x => x.ai)]),
    )
    for (const w of UNIT_19_RECEPTIVE_WORDS) expect(text, w).toContain(norm(w).slice(0, 6))
    for (const v of vocab) expect(v.example.length, v.id).toBeGreaterThan(10)
  })
  it('every vocabulary example contains its word (or a form of it)', () => {
    for (const v of vocab) {
      const base = norm(v.de).replace(/^sich /, '')
      const stem = (v.pos === 'verb' ? base.replace(/^(an|aus|ab)/, '') : base).slice(
        0,
        Math.max(3, base.length - 3 - (v.pos === 'verb' && /^(an|aus|ab)/.test(base) ? 2 : 0)),
      )
      expect(norm(v.example).includes(stem), `${v.id} ${v.de}: "${v.example}"`).toBe(true)
    }
  })
  it('NO artificial brackets and no identical glosses: no Kyrgyz word gloss repeats the Russian one; no bracket in any Kyrgyz gloss', () => {
    for (const v of vocab) {
      expect(norm(v.ky), v.id).not.toBe(norm(v.ru))
      expect(/[()]/.test(v.ky + v.exampleKy), `${v.id}: bracket in Kyrgyz gloss`).toBe(false)
    }
  })
})

describe('unit 19 — identity, ownership and conventions', () => {
  const c = conventions('a2')
  it('every id follows its convention and is sequential', () => {
    expect(unit.key).toMatch(c.unitKey.re)
    for (const g of grammar) expect(g.id).toMatch(c.grammar.re)
    expect(exercises.map(e => e.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8].map(n => `a2-ex-19-0${n}`))
    expect(final.questions.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `a2-ft-19-${String(i + 1).padStart(2, '0')}`))
    expect(listening.map(l => l.id)).toEqual(['a2-li-19-01', 'a2-li-19-02'])
    expect(reading.map(r => r.id)).toEqual(['a2-re-19-01', 'a2-re-19-02'])
    expect(writing.map(w => w.id)).toEqual(['a2-wr-19-01'])
    expect(scenario.id).toMatch(c.speaking.re)
    for (const i of instructions) expect(i.id).toMatch(c.instruction.re)
    expect(topicTestOfUnit(U)!.id).toMatch(c.unitTest(U).re)
  })
  it('everything names unit 19; ids do not collide with other levels or units; references stay inside the unit', () => {
    for (const x of [...vocab, ...grammar, ...exercises, ...listening, ...reading, ...writing]) expect(x.unit).toBe(U)
    for (const x of [...grammar, ...listening, ...reading, ...writing, scenario]) expect(x.level).toBe('A2')
    expect(final.unit).toBe(U)
    for (const q of final.questions) expect(exerciseIndex.has(q.id)).toBe(false)
    for (const e of exercises) expect(unit.grammarIds).toContain(e.concept)
    for (const n of notes) expect(unit.grammarIds).toContain(n.conceptId)
    for (const x of [...grammar, ...listening, ...reading, ...writing, scenario]) {
      expect(x.source?.kind, x.id).toBe('authored')
      expect(x.source?.url, x.id).toBeUndefined()
    }
  })
})

describe('unit 19 — Russian and Kyrgyz are independent, complete and never a fallback', () => {
  it('the validator reports no error and no warning for the real bundle (RU/KY parity, schema, conventions, provenance, CEFR heuristics, answer distribution)', () => {
    expect(issues().filter(i => i.severity === 'error' || i.severity === 'warning')).toEqual([])
    expect(issues().filter(i => i.severity === 'review' && !EXPECTED_REVIEW_FLAGS.has(`${i.rule} ${i.where}`))).toEqual([])
  })
  it('every Russian/Kyrgyz pair is non-empty and different (checked directly, independent of the validator)', () => {
    const pairs: [string, string | undefined, string | undefined][] = []
    const add = (where: string, ru?: string, ky?: string) => pairs.push([where, ru, ky])
    add('unit.subtitle', unit.subtitle.ru, unit.subtitle.ky)
    for (const v of vocab) {
      add(`${v.id}.word`, v.ru, v.ky)
      add(`${v.id}.example`, v.exampleRu, v.exampleKy)
    }
    for (const g of grammar) {
      for (const k of ['title', 'summary', 'discover', 'why'] as const) add(`${g.id}.${k}`, g[k].ru, g[k].ky)
      g.when.forEach((x, i) => add(`${g.id}.when${i}`, x.ru, x.ky))
      for (const e of [...g.examples, ...g.reallife]) add(`${g.id}.ex`, e.ru, e.ky)
      g.mistakes.forEach((m, i) => add(`${g.id}.mis${i}`, m.note.ru, m.note.ky))
      g.dialogue.forEach((d, i) => add(`${g.id}.dlg${i}`, d.ru, d.ky))
      add(`${g.id}.speak`, g.speakPrompt.prompt.ru, g.speakPrompt.prompt.ky)
    }
    for (const n of notes) {
      add(`why:${n.word}`, n.ru, n.ky)
      add(`why:${n.word}.reason`, n.reason.ru, n.reason.ky)
      n.more.forEach(m => add('why.more', m.ru, m.ky))
    }
    for (const e of exercises) {
      add(`${e.id}.prompt`, e.promptRu, e.promptKy)
      add(`${e.id}.why`, e.why.ru, e.why.ky)
    }
    for (const l of listening) l.lines.forEach((x, i) => add(`${l.id}.${i}`, x.ru, x.ky))
    for (const r of reading)
      r.gloss.forEach((g, i) => {
        add(`${r.id}.g${i}`, g.ru, g.ky)
        add(`${r.id}.gr${i}`, g.grammar, g.grammarKy)
      })
    add('sp.title', scenario.titleRu, scenario.titleKy)
    add('sp.goal', scenario.goal.ru, scenario.goal.ky)
    scenario.turns.forEach((t, i) => add(`sp.t${i}`, t.aiRu, t.aiKy))
    add('wr.situation', writing[0].situation.ru, writing[0].situation.ky)
    writing[0].tips.forEach((t, i) => add(`wr.tip${i}`, t.ru, t.ky))
    for (const q of final.questions) {
      add(`${q.id}.prompt`, q.promptRu, q.promptKy)
      add(`${q.id}.why`, q.why.ru, q.why.ky)
    }
    for (const i of instructions) add(i.id, i.text.ru, i.text.ky)
    add('test.title', topicTestOfUnit(U)!.title.ru, topicTestOfUnit(U)!.title.ky)
    expect(pairs.length).toBeGreaterThan(200)
    for (const [where, ru, ky] of pairs) {
      expect((ru ?? '').trim(), `${where} ru`).not.toBe('')
      expect((ky ?? '').trim(), `${where} ky`).not.toBe('')
      expect(norm(ky ?? ''), `${where}: ky copies ru`).not.toBe(norm(ru ?? ''))
    }
  })
  it('Kyrgyz text is Kyrgyz: the letters ү ө ң occur in most explanations and word cards', () => {
    const kyOnly = /[үөңҮӨҢ]/
    const explanations = [
      ...grammar.flatMap(g => [g.summary.ky, g.why.ky, g.discover.ky]),
      ...exercises.map(e => e.why.ky),
      ...final.questions.map(q => q.why.ky),
      ...instructions.map(i => i.text.ky),
    ]
    expect(explanations.filter(t => kyOnly.test(t ?? '')).length / explanations.length).toBeGreaterThan(0.7)
    expect(vocab.filter(v => kyOnly.test(v.ky + v.exampleKy)).length / vocab.length).toBeGreaterThan(0.4)
  })
  it('German quoted inside an explanation is identical in both languages', () => {
    const german = (t: string) =>
      [...t.matchAll(/[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß'-]*(?: [A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß'-]*){2,}/g)].map(m => m[0])
    const pairs: { ru: string; ky?: string }[] = [
      ...grammar.flatMap(g => [g.summary, g.why, ...g.when, ...g.mistakes.map(m => m.note)]),
      ...notes.map(n => n.reason),
      ...exercises.map(e => e.why),
      ...final.questions.map(q => q.why),
    ]
    let checked = 0
    for (const p of pairs)
      for (const s of german(p.ru)) {
        expect(p.ky ?? '', s).toContain(s)
        checked++
      }
    expect(checked).toBeGreaterThan(20)
  })
  it('disputed Kyrgyz terms are NOT used as labels (see the glossary); the glossary records the Unit 19 terms and stays unapproved', () => {
    const all = JSON.stringify([unit, vocab, grammar, exercises, listening, reading, writing, scenario, final, notes, instructions])
    for (const disputed of ['жөндөлгөн этиш', 'жакталган этиш', 'ээрчимелүү', 'багыныңкы', 'ажыраган', 'бөлүнүүчү', 'аттык сөз'])
      expect(all, disputed).not.toContain(disputed)
    const glossary = doc('docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md')
    expect(glossary).toContain('NOT reviewed by a native Kyrgyz speaker')
    expect(glossary).toMatch(/Unit 19/)
    expect(glossary).toMatch(/## 12\. Unit 19 terms/)
    expect(glossary).not.toMatch(/\| (APPROVED|approved) \|/)
  })
})

describe('unit 19 — language limits of the plan (man + modal, two frames of indirect questions, the route prepositions; no Passiv notices, no Konjunktiv II, no ordinals, no adjectives)', () => {
  const shown = JSON.stringify([
    vocab.map(v => v.example),
    grammar.map(g => [g.examples.map(e => e.de), g.reallife.map(e => e.de), g.dialogue.map(d => d.text), g.speakPrompt.sample]),
    grammar.map(g => g.mistakes.map(m => m.right)),
    exercises.map(e => [e.prompt, e.answer]),
    listening.map(l => l.lines.map(x => x.text)),
    reading.map(r => r.body),
    [writing[0].model, scenario.turns.map(t => [t.ai, t.hints])],
    final.questions.map(q => [q.prompt, q.answer]),
  ])
  const everything = JSON.stringify([
    shown,
    final.questions.map(q => q.options),
    exercises.map(e => e.options),
    reading.map(r => r.questions),
  ])
  const sentences = (s: string) =>
    ((JSON.parse(s) as unknown[]).flat(Infinity) as string[])
      .flatMap(x => x.split(/(?<=[.!?])\s+/))
      .map(x => x.trim())
      .filter(Boolean)
  it('man occurs only with a modal in the er/sie form (darf / muss / kann) — never with dürfen / müssen / können, never with another verb; "Bitte nicht + Infinitiv" has no zu', () => {
    const modals = ['darf', 'muss', 'kann']
    const uses = [...everything.matchAll(/(\w+ )?\b[Mm]an (\w+)/g)].map(m => [(m[1] ?? '').trim().toLowerCase(), m[2]])
    expect(uses.length).toBeGreaterThan(20)
    // "man" stands directly before a modal (Man darf …) or directly after one (Darf man …? / Hier darf man nicht …)
    for (const [before, after] of uses)
      expect(modals.includes(after) || modals.includes(before) || before === '___', `man between "${before}" and "${after}"`).toBe(true)
    // the plural forms occur only inside the "wrong" examples and the distractors
    expect(shown).not.toMatch(/\b[Mm]an (dürfen|müssen|können)\b/)
    expect(shown).not.toMatch(/Bitte nicht zu /)
    expect(shown).toMatch(/Bitte nicht rauchen/)
  })
  it('nicht dürfen (forbidden) and nicht müssen (not necessary) are both taught and both assessed; erlaubt and verboten occur in texts and items', () => {
    expect(shown).toMatch(/Man muss nicht bezahlen/)
    expect(shown).toMatch(/Man darf (hier )?nicht (parken|rauchen)/)
    expect(everything).toMatch(/Man darf nicht bezahlen/)
    for (const w of ['erlaubt', 'verboten']) expect(everything, w).toContain(w)
    expect(final.questions.find(q => q.id === 'a2-ft-19-03')!.answer).toBe('Man muss nicht bezahlen.')
  })
  it('no Passiv notice (Hier wird geparkt / Es wird gebeten), no werden at all, no Konjunktiv II (Könnten Sie …), no Genitiv, no Relativsatz, no later connectors', () => {
    expect(everything).not.toMatch(/\b(wird|werden|wurde|worden|werde|wirst|geworden)\b/)
    expect(everything).not.toMatch(/\b(könnten|könnte|würden|würde|hätte|hätten|wäre|wären|müsste|dürfte|sollte)\b/)
    expect(JSON.stringify([unit, grammar, exercises, final, notes, instructions])).not.toMatch(/Konjunktiv|Passiv/i)
    expect(everything).not.toMatch(/\b(des|eines)\s+\w+s\b/)
    expect(everything).not.toMatch(/\b(obwohl|damit|nachdem|während|bevor|trotzdem|falls|sobald|indem|denn|deshalb)\b/i)
    expect(everything).not.toMatch(/, (der|die|das|den|dem|dessen|welcher|welche) [a-zäöüß]+ [^.?!]*(ist|hat|kann|muss|liegt|fährt)\b/)
  })
  it('indirect questions use EXACTLY the two frames of audit D-4: "Können Sie mir sagen, wo/wann/wie …?" and "Ich möchte (auch) wissen, ob …"; the verb is final (and is one of ist / komme / brauche / dauert / bekomme / darf / kommt); no other frame', () => {
    const frames = [...everything.matchAll(/(Können Sie mir sagen|Ich möchte (?:auch )?wissen), ([^.?!"]*)[.?!]/g)]
    expect(frames.length).toBeGreaterThan(14)
    for (const [full, frame, rest] of frames) {
      const wh = /^(wo|wann|wie(?: lange)?|ob)\b/.exec(rest)
      // the wrong examples and the distractors (verb second) are the only lines that break the rule — they are marked by the verb right after the W-word
      const wrongOrder =
        /^(wo|wann|wie(?: lange)?|ob) (ist|geöffnet|haben|hat|kommt)\b/.test(rest) || /^wo Post ist/.test(rest) || /^dass /.test(rest)
      if (wrongOrder || rest.startsWith('___')) continue
      expect(wh, full).not.toBeNull()
      if (frame.startsWith('Ich möchte')) expect(wh![1], full).toBe('ob')
      else expect(wh![1], full).not.toBe('ob')
      const last = rest.trim().split(' ').at(-1)!
      expect(['ist', 'komme', 'brauche', 'dauert', 'bekomme', 'darf', 'kommt', 'wo', 'sind'].includes(last), `verb last: ${full}`).toBe(
        true,
      )
    }
    expect(everything).not.toMatch(/\b(Wissen Sie|Ich frage mich|Haben Sie eine Ahnung)\b/)
    expect(everything).not.toMatch(/(?:sagen|wissen), (warum|was|wer|wohin|woher|womit)\b/)
  })
  it('no separable verb, modal or Perfekt stands inside an indirect question (the subordinate clause stays simple)', () => {
    for (const [, , rest] of everything.matchAll(/(Können Sie mir sagen|Ich möchte (?:auch )?wissen), ([^.?!"]*)[.?!]/g)) {
      const w = rest.trim().split(' ')
      expect(
        w.some(x => /^(muss|musst|kann|können|darf|soll|will|möchte|habe|hat|haben|bin|ist gegangen)$/.test(x) && x !== w.at(-1)),
        rest,
      ).toBe(false)
      expect(rest).not.toMatch(/\bge(?!öffnet)[a-zäöüß]+t\b/)
    }
  })
  it('the route prepositions all occur as taught: bis zur / bis zum, an … vorbei, gegenüber von, zwischen, über die Straße, neben; Dativ after the first four, Akkusativ after über; the wrong forms only as mistakes', () => {
    for (const p of [
      'bis zur Kreuzung',
      'bis zum Bahnhof',
      'an der Bank vorbei',
      'gegenüber von der Apotheke',
      'zwischen der Bank und der Post',
      'über die Straße',
      'neben der Bank',
    ])
      expect(shown, p).toContain(p)
    expect(shown).not.toMatch(/\b(bis (die|der) |an (die|den) \w+ vorbei|gegenüber (die|der|den) |zwischen (die|den) |über (der|dem) )/)
  })
  it('the directions are the Sie-imperative with geradeaus / links / rechts; no du- or ihr-imperative; no ordinals; no adjective in a route', () => {
    expect(shown).toMatch(/Gehen Sie geradeaus/)
    expect(shown).toMatch(/Gehen Sie (rechts|links)|dann (links|rechts)|Dann gehen Sie rechts/)
    expect(everything).not.toMatch(/\b(Geh|Bleib|Nimm|Fahr|Komm|Biege|Geht|Nehmt|Fahrt|Kommt)\b(?! Sie)/)
    expect(everything).not.toMatch(/\b(erste|zweite|dritte|vierte|fünfte|sechste|siebte|neunte|zehnte|zwanzigste)[nmrs]?\b/i)
    expect(everything).not.toMatch(/\b(nächste|nächsten|erste|ersten|zweite|zweiten)\b/)
  })
  it('attributive adjectives do not occur (the unit teaches none): no adjective before a noun in any text', () => {
    const ADJ =
      '(?:neu|klein|groß|rot|blau|grau|schwarz|grün|weiß|günstig|lang|kurz|schön|warm|kalt|halb|gut|hell|dunkl|ganz|ander|schwer|nett|wichtig|jung|heiß|kühl)'
    const attributive = new RegExp(`\\b${ADJ}(?:e|en|er|es|em) [A-ZÄÖÜ][a-zäöüß]+`, 'g')
    const hits = [...everything.matchAll(attributive)].map(m => m[0])
    // the single, recycled exception is "ein anderes Formular" (R1): an adjective after ein- in Nominativ / Akkusativ (unit-15 scope, receptive)
    expect(hits.filter(h => h !== 'anderes Formular')).toEqual([])
  })
  it('administrative content is language practice, not legal advice: no claim about visas, fees or legal deadlines beyond the story detail; the e-mail asks and does not assert', () => {
    expect(everything).not.toMatch(/Visum|Gesetz|rechtlich|garantiert|verpflichtet|Strafe|Bußgeld/)
    expect(everything).not.toMatch(/\b(Euro|Gebühr)\b[^"]*\b(Anmeldung|Aufenthaltserlaubnis)\b/)
  })
  it('sentence length stays A2: no sentence of the unit has more than 16 words', () => {
    const long = sentences(shown).filter(s => s.split(/\s+/).filter(w => !/^\d+\.?$/.test(w)).length > 16)
    expect(long).toEqual([])
  })
})

describe('unit 19 — revision exercises', () => {
  it('3 fill / 3 choice / 2 order; each well-formed with exactly one correct answer', () => {
    const count = (t: string) => exercises.filter(e => e.type === t).length
    expect([count('fill'), count('choice'), count('order')]).toEqual([3, 3, 2])
    expect(exercises.map(e => e.type)).toEqual(['fill', 'choice', 'order', 'fill', 'choice', 'order', 'fill', 'choice'])
    expect(exercises.map(e => e.concept)).toEqual([
      'a2-man-regeln-verbote',
      'a2-man-regeln-verbote',
      'a2-indirekte-fragen',
      'a2-indirekte-fragen',
      'a2-indirekte-fragen',
      'a2-wegbeschreibung-praepositionen',
      'a2-wegbeschreibung-praepositionen',
      'a2-wegbeschreibung-praepositionen',
    ])
    for (const e of exercises) {
      if (e.type === 'order') {
        expect([...e.words!].sort()).toEqual(e.answer.split(' ').sort())
        expect(e.words!.join(' ')).not.toBe(e.answer)
      } else {
        expect(e.options).toHaveLength(3)
        expect(new Set(e.options!.map(norm)).size).toBe(3)
        expect(e.options!.filter(o => o === e.answer)).toHaveLength(1)
      }
      if (e.type === 'fill') expect(e.prompt.split('___')).toHaveLength(2)
      expect(e.promptRu).toBeTruthy()
      expect(e.promptKy).toBeTruthy()
    }
  })
  it('the correct option is not always in the same position', () => {
    const pos = exercises.filter(e => e.type !== 'order').map(e => e.options!.indexOf(e.answer))
    expect(new Set(pos).size).toBe(3)
  })
  it('practises the plan: man darf for a prohibition, verboten → man darf nicht, an indirect question in order (verb final), ob, the word order of an indirect question, an … vorbei, gegenüber von + Dativ, bis zur', () => {
    expect(exercises.map(e => e.answer)).toEqual([
      'darf',
      'Man darf hier nicht rauchen.',
      'Können Sie mir sagen, wo das Bürgeramt ist?',
      'ob',
      'Können Sie mir sagen, wann das Amt geöffnet ist?',
      'Gehen Sie an der Bank vorbei.',
      'der',
      'Gehen Sie bis zur Kreuzung, dann links.',
    ])
  })
})

describe('unit 19 — the final test is separate, balanced and communicative', () => {
  const q = final.questions
  const tokens = (s: string) =>
    new Set(
      norm(s)
        .replace(/[^\p{L}\s]/gu, ' ')
        .split(' ')
        .filter(t => t.length > 2),
    )
  const jaccard = (a: Set<string>, b: Set<string>) => [...a].filter(t => b.has(t)).length / new Set([...a, ...b]).size
  const sentence = (x: { prompt: string; answer: string }) =>
    x.prompt.includes('___') ? x.prompt.replace('___', x.answer) : x.prompt + ' ' + x.answer
  const exSentence = (e: { type: string; prompt: string; answer: string }) =>
    e.type === 'fill' ? e.prompt.replace('___', e.answer) : e.type === 'order' ? e.answer : e.prompt + ' ' + e.answer

  it('three distinct options, exactly one correct', () => {
    for (const x of q) {
      expect(x.options).toHaveLength(3)
      expect(new Set(x.options.map(norm)).size, x.id).toBe(3)
      expect(
        x.options.filter(o => o === x.answer),
        x.id,
      ).toHaveLength(1)
    }
  })
  it('composition: 7 grammar / 3 vocabulary / 5 reading and communication (grammar share well below the Unit 11 template)', () => {
    const n = (k: string) => q.filter(x => x.skill === k).length
    expect([n('grammar'), n('vocabulary'), n('reading')]).toEqual([7, 3, 5])
    expect(n('grammar') / q.length).toBeLessThan(0.5)
    expect(q.filter(x => x.skill === 'reading').length / q.length).toBeGreaterThanOrEqual(0.3)
  })
  it('shares no id, prompt, answer or sentence with a revision exercise, and no question repeats another', () => {
    for (const x of q) {
      expect(exerciseIndex.has(x.id)).toBe(false)
      for (const e of exercises) {
        if (words(x.answer) > 2) expect(norm(x.answer), `${x.id} / ${e.id}`).not.toBe(norm(e.answer))
        expect(jaccard(tokens(sentence(x)), tokens(exSentence(e))), `${x.id} vs ${e.id}`).toBeLessThan(0.6)
      }
    }
    for (let i = 0; i < q.length; i++)
      for (let j = i + 1; j < q.length; j++)
        expect(jaccard(tokens(sentence(q[i])), tokens(sentence(q[j]))), `${q[i].id} vs ${q[j].id}`).toBeLessThan(0.6)
  })
  it('READING RULE: the German text stays untranslated; Russian and Kyrgyz translate only the question and instruction', () => {
    const readingItems = q.filter(x => x.skill === 'reading')
    expect(readingItems).toHaveLength(5)
    for (const x of readingItems) {
      expect(x.prompt, x.id).toMatch(/„[^“]{30,}“/)
      for (const t of [x.promptRu, x.promptKy]) {
        expect(t.length, `${x.id}: translation as long as the prompt`).toBeLessThan(x.prompt.length * 0.5)
        expect(t.length, x.id).toBeLessThan(110)
        expect(t, `${x.id}: quotation marks hint at a translated passage`).not.toMatch(/[„“«»]/)
        expect(t, `${x.id}: German words inside the translation`).not.toMatch(/[A-Za-zÄÖÜäöüß]{3,} [A-Za-zÄÖÜäöüß]{3,} [A-Za-zÄÖÜäöüß]{3,}/)
        // numbers are allowed only when the German QUESTION itself contains them (e.g. "300 Gramm Käse")
        const questionText = x.prompt.slice(x.prompt.lastIndexOf('“') + 1)
        for (const n of t.match(/\d{3,}/g) ?? []) expect(questionText, `${x.id}: number ${n} copied from the passage`).toContain(n)
      }
      const passage = x.prompt.slice(x.prompt.indexOf('„'), x.prompt.lastIndexOf('“'))
      expect(passage.length).toBeGreaterThan(60)
      // no sentence of the passage may be reproduced in either translation
      for (const part of passage.split(/[.!?]\s+/).filter(p => p.length > 25)) {
        expect(x.promptRu).not.toContain(part)
        expect(x.promptKy).not.toContain(part)
      }
    }
    for (const r of reading) for (const k of r.questions) expect(Object.keys(k).sort()).toEqual(['answer', 'options', 'q'])
  })
  it('lab reading texts are German only in the passage, and the translations of the questions never contain the German body', () => {
    for (const r of reading) {
      const body = r.body.join(' ')
      for (const g of r.gloss) {
        for (const t of [g.ru, g.ky]) expect(t, `${r.id}: gloss "${g.word}" reproduces a passage sentence`).not.toContain(body.slice(0, 25))
      }
    }
  })
  it('reading items assess comprehension: each ends with a question, and the correct answer is not a verbatim sentence of the passage', () => {
    for (const x of q.filter(k => k.skill === 'reading')) {
      const question = x.prompt.slice(x.prompt.lastIndexOf('“') + 1).trim()
      expect(question.endsWith('?'), x.id).toBe(true)
      const passage = x.prompt.slice(x.prompt.indexOf('„'), x.prompt.lastIndexOf('“'))
      if (words(x.answer) >= 4) expect(passage.includes(x.answer), `${x.id}: answer is copied from the passage`).toBe(false)
    }
  })
  it('authored positions of the correct answer: 5 / 5 / 5, never three in a row (final test); listening and reading keys spread too', () => {
    const counts = positionCounts(q.map(x => ({ options: x.options, answer: x.options.indexOf(x.answer) }))).get(3)!
    expect(counts).toEqual([5, 5, 5])
    const pos = q.map(x => x.options.indexOf(x.answer))
    for (let i = 2; i < pos.length; i++) expect(pos[i] === pos[i - 1] && pos[i] === pos[i - 2], `run at ${i}`).toBe(false)
    for (const set of [listening, reading]) {
      const keys = set.flatMap(x => x.questions.map(k => k.answer))
      for (let i = 2; i < keys.length; i++) expect(keys[i] === keys[i - 1] && keys[i] === keys[i - 2]).toBe(false)
      for (const p of [0, 1, 2]) expect(keys.filter(a => a === p).length).toBeGreaterThanOrEqual(2)
    }
  })
  it('objective → assessment matrix: every objective is assessed by real items, and ≥ 8 final-test items are situational', () => {
    const notes19 = doc('docs/authoring/A2_UNIT19_DESIGN_NOTES.md')
    const rows = [...notes19.matchAll(/^\| (O\d) \|[^|]+\|([^|]+)\|([^|]+)\|/gm)]
    expect(rows.map(r => r[1])).toEqual(['O1', 'O2', 'O3', 'O4', 'O5'])
    const ids = (cell: string) => [...cell.matchAll(/\d{2}/g)].map(m => m[0])
    for (const r of rows) {
      const fts = ids(r[3])
      expect(fts.length, `${r[1]} has no final-test item`).toBeGreaterThan(0)
      for (const n of fts)
        expect(
          q.some(x => x.id === `a2-ft-19-${n}`),
          `${r[1]}: a2-ft-19-${n}`,
        ).toBe(true)
      for (const n of ids(r[2]))
        expect(
          exercises.some(e => e.id === `a2-ex-19-${n}`),
          `${r[1]}: a2-ex-19-${n}`,
        ).toBe(true)
    }
    const communicative = /Communicative final-test items[^:]*: ([^—\n]+)/.exec(notes19)![1]
    const list = ids(communicative)
    expect(list.length).toBeGreaterThanOrEqual(8)
    for (const n of list) expect(q.some(x => x.id === `a2-ft-19-${n}`)).toBe(true)
  })
})

describe('unit 19 — stage boundaries', () => {
  it('Units 11–18 are unchanged: their review-package fingerprints equal the recorded ones', () => {
    const fp = (p: string) => /fingerprint: `([0-9a-f]{12})`/.exec(p)![1]
    expect([fp(cefrPackage(11)), fp(kyPackage(11))]).toEqual(['502db4af8249', 'dd636659c06f'])
    expect([fp(cefrPackage(12)), fp(kyPackage(12))]).toEqual(['4b6f9b8dcf73', '3a8c03023e72'])
    expect([fp(cefrPackage(13)), fp(kyPackage(13))]).toEqual(['c99778902721', 'fc311c5a7e08'])
    expect([fp(cefrPackage(14)), fp(kyPackage(14))]).toEqual(['d932881835ec', '39b892b0a8a1'])
    expect([fp(cefrPackage(15)), fp(kyPackage(15))]).toEqual(['12d4f84dfbf1', '9bbdddbf1eba'])
    expect([fp(cefrPackage(16)), fp(kyPackage(16))]).toEqual(['f75f46556cf7', '3ee2c25167a6'])
    expect([fp(cefrPackage(17)), fp(kyPackage(17))]).toEqual(['5725c4bc6a78', '16cc2220e1f2'])
    expect([fp(cefrPackage(18)), fp(kyPackage(18))]).toEqual(['c469c9dbe60d', '38594483c4ff'])
  })
  it('authoring: the only review flags are the explicit Beta flags (sign-offs, locale reviews, level test); no human review is recorded', () => {
    expect(A2_REVIEWS).toEqual({})
    const flags = issues()
      .filter(i => i.severity === 'review')
      .map(i => `${i.rule} ${i.where}`)
      .sort()
    expect(flags).toEqual(EXPECTED_BETA_FLAGS)
  })
  it('release validation still REJECTS A2 (the level test, the sign-offs)', () => {
    const errors = issues('release').filter(i => i.severity === 'error')
    expect(errors.some(e => e.rule === 'unit-missing' && /^units:(1[0-9]|20)$/.test(e.where))).toBe(false) // all ten planned A2 units are authored (B1, still planned, legitimately reports its own)
    expect(errors.some(e => e.rule === 'cefr-signoff-missing' && e.where === 'units:19')).toBe(true)
    expect(errors.some(e => e.rule === 'unit-missing' && e.where === 'units:19')).toBe(false)
  })
  it('all ten planned units are authored; A2 is in controlled Beta (ru + ky); no placement, level test or tutor content', () => {
    expect(a2AuthoredUnits().map(u => u.id)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
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
    const a2 = COURSE.levels.find(l => l.id === 'A2')!
    expect([a2.status, a2.releasedLocales]).toEqual(['beta', ['ru', 'ky']])
    expect(isLevelVisible('A2')).toBe(true)
    expect(A2_PLACEMENT_ITEMS).toEqual([])
    expect(A2_TUTOR_TEMPLATES).toEqual([])
  })
})
