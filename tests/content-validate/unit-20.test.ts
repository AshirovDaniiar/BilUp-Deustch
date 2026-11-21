// @vitest-environment node
/**
 * Stage 7K — the PRODUCTION content of unit 20 ("Pläne, Einladungen und gemeinsame Entscheidungen", the A2 capstone): completeness, identity, the approved vocabulary
 * map and the productive / receptive split, Russian/Kyrgyz independence (no identical gloss, no artificial bracket), genre variety (informal and formal, not every text a
 * formal e-mail), the grammar limits of the plan (suggestions with *Wie wäre es mit …?* only as a chunk; *vorhaben*; the cumulative connectors with their three word-order
 * patterns; no werden, no Konjunktiv II otherwise, no zu + Infinitiv, no new connector), exercise and test structure, separation of revision and final test, the
 * reading-question rule, answer-position balance, the objective→assessment matrix, and the stage boundaries (Units 11–19 unchanged; all ten units authored; A2 planned and invisible).
 */
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
import { BETA_FLAG_RULES, EXPECTED_BETA_FLAGS } from './beta-flags'
import { cefrPackage, kyPackage } from '../../scripts/review/unit-package'
import { A2_INSTRUCTIONS } from '../../src/data/a2/instructions'
import { A2_PLACEMENT_ITEMS } from '../../src/data/a2/placement'
import { A2_UNIT_PLAN } from '../../src/data/a2/registry'
import { A2_TUTOR_TEMPLATES } from '../../src/data/a2/tutor'
import { UNIT_20_RECEPTIVE_WORDS } from '../../src/data/a2/unit20/vocabulary'
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
  unitsOfLevel,
  vocabularyForUnit,
  whyNotesOf,
  writingForUnit,
} from '../../src/data/catalog'
import { COURSE, isLevelVisible } from '../../src/data/course'
import { analyseWriting } from '../../src/services/analysis'

const U = 20
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

describe('unit 20 — completeness', () => {
  it('is the planned unit: same id, key, title and level', () => {
    expect(unit.id).toBe(plan.id)
    expect(unit.key).toBe(plan.key)
    expect(unit.title).toBe(plan.titleDe)
    expect(unit.level).toBe('A2')
  })
  it('meets every minimum and the unit-20 plan (3 concepts, 8 exercises, 15 questions)', () => {
    expect(vocab.length).toBeGreaterThanOrEqual(UNIT_MINIMUMS.vocabulary)
    expect(grammar).toHaveLength(3)
    expect(unit.grammarIds).toEqual(grammar.map(g => g.id))
    expect(grammar.map(g => g.id)).toEqual(['a2-vorschlaege-verabredungen', 'a2-absichten-plaene', 'a2-satzverbindungen-integration'])
    expect(listening).toHaveLength(2)
    expect(reading).toHaveLength(2)
    expect(writing).toHaveLength(1)
    expect(scenario).toBeDefined()
    expect(exercises).toHaveLength(8)
    expect(final.questions).toHaveLength(15)
    const def = topicTestOfUnit(U)!
    expect([def.id, def.kind, def.level, def.unit, def.size]).toEqual(['unit-20', 'topic', 'A2', 20, 15])
  })
  it('workload: three concepts, each practised and assessed (exercises 3 / 3 / 2; final test 4 / 3 / 2), each with a full explanation', () => {
    expect(grammar.map(g => exercises.filter(e => e.concept === g.id).length)).toEqual([3, 3, 2])
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
    expect(grammar.map(g => final.questions.filter(q => q.concept === g.id).length)).toEqual([4, 3, 2])
  })
  it('lists, texts and tasks are well-formed', () => {
    for (const l of listening) {
      expect(l.lines).toHaveLength(10)
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
    expect(w.formal).toBe(false) // unit 20: an informal invitation message
    expect(w.minWords).toBe(60) // Stage 7B plan: about 60+ words
    expect(words(w.model)).toBeGreaterThanOrEqual(w.minWords)
    const feedback = analyseWriting(w.model, w)
    expect(feedback.missing).toEqual([])
    expect(feedback.lengthOk).toBe(true)
    expect(feedback.errors).toEqual([])
    expect(analyseWriting('Hallo.', w).missing.length).toBeGreaterThan(3)
  })
  it('the writing task is an informal invitation MESSAGE (du): greeting, occasion, a date with a digit + point, place and time, what to bring, one reason with weil, a request to answer, a closing greeting', () => {
    const w = writing[0]
    expect(w.formal).toBe(false)
    expect(w.title).toMatch(/Einladung/)
    expect(w.model).toMatch(/^Hallo /)
    expect(w.model).toMatch(/\b\d{1,2}\. Juni\b/)
    expect(w.model).toMatch(/weil /)
    expect(w.model).toMatch(/Antworte bitte/)
    expect(w.model).toMatch(/Liebe Grüße/)
    expect(w.model).not.toMatch(/Sehr geehrte|Mit freundlichen Grüßen|\bSie\b|\bIhnen\b/)
    expect(w.mustInclude).toHaveLength(8)
  })
  it('GENRE: L1 two friends (du), L2 a colleague (Sie), R1 an invitation card (du), R2 e-mails between friends, S1 a negotiation (du), W1 an informal message — NOT every text is a formal e-mail', () => {
    const l1 = listening[0].lines.map(x => x.text).join(' ')
    expect(l1).toMatch(/\bdu\b/)
    expect(l1).not.toMatch(/\bSie\b|\bIhnen\b|\bIhr\b/)
    const l2 = listening[1].lines.map(x => x.text).join(' ')
    expect(l2).toMatch(/\bSie\b/)
    expect(l2).not.toMatch(/\bdu\b|\bdir\b|\bdein/)
    const s1 = scenario.turns.map(x => x.ai).join(' ')
    expect(s1).toMatch(/\bdu\b/)
    expect(s1).not.toMatch(/\bSie\b/)
    const r1 = reading[0].body.join(' ')
    expect(r1).toMatch(/^Einladung zu meiner Party/)
    expect(r1).toMatch(/\bdu\b|\bdich\b/)
    expect(reading[1].body.join(' ')).toMatch(/Von Nora an Tom/)
    // only one of the six texts of the unit uses Sie, and no text is a formal letter
    expect(JSON.stringify([listening[0], reading, scenario, writing[0].model])).not.toMatch(
      /Sehr geehrte|Mit freundlichen Grüßen|Reisebüro/,
    )
    const unitText = instructions.find(i => i.scope === 'unit')!.text
    expect(unitText.ru).toMatch(/Привычки приглашать и отвечать в разных странах различаются/)
    expect(unitText.ky).toMatch(/адаттары өлкөлөргө жараша айырмаланат/)
  })
  it('the social functions are complete: L1 suggests, objects, proposes an alternative, votes and agrees on a compromise with a time; L2 invites, gives the date and place, declines politely, proposes a later time and accepts', () => {
    const l1 = listening[0].lines.map(x => x.text).join(' ')
    for (const part of [
      'Wollen wir',
      'Wie wäre es mit',
      'Lass uns',
      'Ich schlage vor, dass',
      'denn',
      'abstimmen',
      'einverstanden',
      'Kompromiss',
      'Spätestens um halb vier',
    ])
      expect(l1, part).toContain(part)
    const l2 = listening[1].lines.map(x => x.text).join(' ')
    for (const part of ['12. Mai', 'einladen', 'Leider', 'später kommen', 'Geschenk', 'sagen Sie zu', 'ich sage zu'])
      expect(l2, part).toContain(part)
    expect(scenario.id).toBe('a2-sp-20-01')
    expect(scenario.turns).toHaveLength(4)
    expect(scenario.turns.map(x => x.hints.join(' ')).join(' ')).toMatch(/Wie wäre es mit/)
    expect(scenario.turns.map(x => x.hints.join(' ')).join(' ')).toMatch(/weil/)
    expect(scenario.turns.map(x => x.hints.join(' ')).join(' ')).toMatch(/einverstanden/)
  })
  it('the readings are complete: the invitation card (occasion, date, place, what to bring, reply by) and the e-mails (decline, reason, alternative)', () => {
    const r1 = reading[0].body.join(' ')
    for (const part of ['14. Juni', 'ab 19 Uhr', 'Im Garten', 'etwas zu essen oder zu trinken', 'Bitte antworte bis zum 7. Juni'])
      expect(r1, part).toContain(part)
    const r2 = reading[1].body.join(' ')
    for (const part of [
      'Leider kann ich am Samstag nicht kommen, denn ich muss arbeiten',
      'Wie wäre es mit Sonntag?',
      'weil meine Eltern kommen',
      'Alternative',
      'Freitag nach der Arbeit',
    ])
      expect(r2, part).toContain(part)
    expect(final.questions.filter(q => /Einladung|Nachricht|Situation|Aushang|Gespräch/.test(q.prompt)).length).toBeGreaterThanOrEqual(5)
  })
  it('accepting, declining politely with a reason and proposing an alternative are each assessed; the decision is negotiated in S1, W1 asks for a reply', () => {
    expect(final.questions.find(q => q.id === 'a2-ft-20-02')!.answer).toMatch(/^Leider kann ich nicht, denn/)
    expect(final.questions.find(q => q.id === 'a2-ft-20-13')!.answer).toMatch(/Wie wäre es mit Sonntag\?/)
    expect(final.questions.find(q => q.id === 'a2-ft-20-12')!.answer).toBe('Sonntag')
    expect(writing[0].mustInclude.map(m => m.label).join(' ')).toMatch(/Antwort/)
    expect(writing[0].mustInclude.map(m => m.label).join(' ')).toMatch(/weil/)
  })
  it('instructions exist for every activity', () => {
    const scopes = instructions.map(i => i.scope)
    for (const s of ['unit', 'vocabulary', 'grammar', 'listening', 'reading', 'speaking', 'writing', 'review', 'test'])
      expect(scopes).toContain(s)
  })
})

describe('unit 20 — the approved vocabulary map and the productive / receptive split', () => {
  const map = doc('docs/authoring/A2_STAGE7B_VOCABULARY_MAP.md')
  const section = map.slice(map.indexOf('### Unit 20 —'), map.indexOf('## 3. Totals'))
  const planned = section
    .split('\n')
    .filter(l => l.startsWith('- **'))
    .flatMap(l => l.slice(l.indexOf('): ') + 3).split(';'))
    .map(x => x.trim())
  it('implements exactly the 37 planned items, with the planned receptive classification (33 productive / 4 receptive)', () => {
    expect(planned).toHaveLength(37)
    expect(vocab.map(v => lemma(v.de)).sort()).toEqual(planned.map(lemma).sort())
    const plannedReceptive = planned
      .filter(x => /\(R\)/.test(x))
      .map(lemma)
      .sort()
    expect([...UNIT_20_RECEPTIVE_WORDS].map(lemma).sort()).toEqual(plannedReceptive)
    expect(UNIT_20_RECEPTIVE_WORDS).toHaveLength(4)
    expect(vocab).toHaveLength(37)
  })
  it('follows the plan order, every noun has an article, nothing else has one; ids are v20-1 … v20-37; words are unique', () => {
    expect(vocab.map(v => v.id)).toEqual(vocab.map((_, i) => `v20-${i + 1}`))
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
  it('the nouns carry the articles of the plan; the verbs, adjective, adverbs and phrases and the four groups of the map', () => {
    const word = (de: string) => vocab.find(v => v.de === de)!
    expect(word('Einladung').article).toBe('die')
    expect(word('Geschenk').article).toBe('das')
    expect(word('Kompromiss').article).toBe('der')
    expect(word('Party').plural).toBe('Partys')
    expect(word('Plan').plural).toBe('Pläne')
    expect(vocab.filter(v => v.pos === 'verb').map(v => v.de)).toEqual([
      'einladen',
      'gratulieren',
      'mitbringen',
      'sich verabreden',
      'vorschlagen',
      'zusagen',
      'ablehnen',
      'abstimmen',
      'planen',
      'vorhaben',
      'organisieren',
      'sich entschuldigen',
    ])
    expect(vocab.filter(v => v.pos === 'adj').map(v => v.de)).toEqual(['einverstanden'])
    expect(vocab.filter(v => v.pos === 'phrase').map(v => v.de)).toEqual(['viel Spaß', 'Prost'])
    expect(vocab.filter(v => v.pos === 'other').map(v => v.de)).toEqual([
      'vielleicht',
      'wahrscheinlich',
      'sicher',
      'bald',
      'übermorgen',
      'spätestens',
      'leider',
      'schade',
      'herzlich',
    ])
    expect(vocab.slice(0, 11).map(v => v.de)).toEqual([
      'Einladung',
      'einladen',
      'Feier',
      'Party',
      'Geschenk',
      'Geburtstag',
      'Hochzeit',
      'gratulieren',
      'mitbringen',
      'sich verabreden',
      'Verabredung',
    ])
    expect(vocab.slice(11, 21).map(v => v.de)).toEqual([
      'vorschlagen',
      'Vorschlag',
      'zusagen',
      'Entscheidung',
      'Möglichkeit',
      'einverstanden',
      'ablehnen',
      'Alternative',
      'abstimmen',
      'Kompromiss',
    ])
  })
  it('receptive words are never REQUIRED: not a gap answer, speaking keyword / hint, writing requirement or correct final-test answer', () => {
    const stems = UNIT_20_RECEPTIVE_WORDS.map(w => norm(w).slice(0, 6))
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
    for (const w of UNIT_20_RECEPTIVE_WORDS) expect(text, w).toContain(norm(w).slice(0, 6))
    for (const v of vocab) expect(v.example.length, v.id).toBeGreaterThan(10)
  })
  it('every vocabulary example contains its word (or a form of it)', () => {
    for (const v of vocab) {
      const base = norm(v.de).replace(/^sich /, '')
      const stem = (v.pos === 'verb' ? base.replace(/^(an|aus|ab|mit|ein|vor|zu)/, '') : base).slice(
        0,
        Math.max(3, base.length - 3 - (v.pos === 'verb' && /^(an|aus|ab|mit|ein|vor|zu)/.test(base) ? 2 : 0)),
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

describe('unit 20 — identity, ownership and conventions', () => {
  const c = conventions('a2')
  it('every id follows its convention and is sequential', () => {
    expect(unit.key).toMatch(c.unitKey.re)
    for (const g of grammar) expect(g.id).toMatch(c.grammar.re)
    expect(exercises.map(e => e.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8].map(n => `a2-ex-20-0${n}`))
    expect(final.questions.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `a2-ft-20-${String(i + 1).padStart(2, '0')}`))
    expect(listening.map(l => l.id)).toEqual(['a2-li-20-01', 'a2-li-20-02'])
    expect(reading.map(r => r.id)).toEqual(['a2-re-20-01', 'a2-re-20-02'])
    expect(writing.map(w => w.id)).toEqual(['a2-wr-20-01'])
    expect(scenario.id).toMatch(c.speaking.re)
    for (const i of instructions) expect(i.id).toMatch(c.instruction.re)
    expect(topicTestOfUnit(U)!.id).toMatch(c.unitTest(U).re)
  })
  it('everything names unit 20; ids do not collide with other levels or units; references stay inside the unit', () => {
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

describe('unit 20 — Russian and Kyrgyz are independent, complete and never a fallback', () => {
  it('the validator reports no error and no warning for the real bundle (RU/KY parity, schema, conventions, provenance, CEFR heuristics, answer distribution)', () => {
    expect(issues().filter(i => i.severity === 'error' || i.severity === 'warning')).toEqual([])
    expect(issues().filter(i => i.severity === 'review' && !BETA_FLAG_RULES.includes(i.rule))).toEqual([])
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
  it('disputed Kyrgyz terms are NOT used as labels (see the glossary); the glossary records the Unit 20 terms and stays unapproved', () => {
    const all = JSON.stringify([unit, vocab, grammar, exercises, listening, reading, writing, scenario, final, notes, instructions])
    for (const disputed of ['жөндөлгөн этиш', 'жакталган этиш', 'ээрчимелүү', 'багыныңкы', 'ажыраган', 'бөлүнүүчү', 'аттык сөз'])
      expect(all, disputed).not.toContain(disputed)
    const glossary = doc('docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md')
    expect(glossary).toContain('NOT reviewed by a native Kyrgyz speaker')
    expect(glossary).toMatch(/Unit 20/)
    expect(glossary).toMatch(/## 13\. Unit 20 terms/)
    expect(glossary).not.toMatch(/\| (APPROVED|approved) \|/)
  })
})

describe('unit 20 — language limits of the plan (Wie wäre es mit … only as a chunk; Wollen wir / Lass uns / vorhaben; the cumulative connectors with three word-order patterns; no werden, no zu + Infinitiv, no new connector)', () => {
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
  it('Wie wäre es mit is a FIXED CHUNK: every wäre stands in "Wie wäre es mit"; no other Konjunktiv II form (würde, könnte, hätte, wären …) and no grammar text names the Konjunktiv', () => {
    const uses = [...everything.matchAll(/(\w+ )?\bwäre\b( \w+ \w+)?/g)]
    expect(uses.length).toBeGreaterThan(8)
    for (const m of uses) expect(m[0], 'wäre outside the chunk').toMatch(/^Wie wäre es mit$/)
    expect(everything).not.toMatch(/\b(würde|würden|könnte|könnten|hätte|hätten|müsste|müssten|sollte|sollten|dürfte|wären)\b/)
    expect(JSON.stringify([unit, grammar, exercises, final, notes, instructions])).not.toMatch(/Konjunktiv/i)
    expect(shown).toMatch(/Wie wäre es mit einem Kaffee\?/)
    expect(shown).toMatch(/Wie wäre es mit Sonntag\?/)
  })
  it('Wie wäre es mit is followed by a noun phrase in the Dativ or a day name — never by a verb or an infinitive', () => {
    for (const m of everything.matchAll(/Wie wäre es mit ([^?"]*)\?/g))
      expect(m[1], m[0]).toMatch(/^(einem|einer|dem|der|Sonntag|Montag|Freitag|übermorgen|Kino|Schwimmen|Salat|Kaffee)/)
  })
  it('Wollen wir … ends with an infinitive; Lass uns is the only form of lassen; Ich schlage vor, dass … has the verb last', () => {
    const wollen = [...everything.matchAll(/Wollen wir ([^?"]*)\?/g)].map(m => m[1])
    expect(wollen.length).toBeGreaterThan(6)
    for (const w of wollen.filter(x => !x.includes('___'))) expect(w.trim().split(' ').at(-1)!, w).toMatch(/en$/)
    for (const m of everything.matchAll(/\b[Ll]ass\w*/g)) expect(m[0]).toBe('Lass')
    expect([...everything.matchAll(/\bLass(?! uns)/g)]).toEqual([])
    expect(everything).not.toMatch(/\b(lassen|lässt|ließ|gelassen)\b/)
    const vor = [...everything.matchAll(/Ich schlage vor, dass ([^.?!"]*)[.?!"]/g)].map(m => m[1])
    expect(vor.length).toBeGreaterThan(2)
    for (const v of vor) expect(['gehen', 'anfangen'], v).toContain(v.trim().split(' ').at(-1))
  })
  it('vorhaben: the particle vor stands at the very end of the sentence (and is never joined or placed earlier) in every taught sentence', () => {
    const hits = [...shown.matchAll(/\b(habe|hast|hat|haben)\b[^.?!"]*?\bvor\b(.)/g)]
    expect(hits.length).toBeGreaterThan(8)
    for (const h of hits) expect(h[2], h[0]).toMatch(/[.?!"]/)
    expect(shown).not.toMatch(/\bvorhabe\b|\bvorhast\b|\bvorhat\b/)
  })
  it('the connectors follow their three patterns: denn → verb second; weil / dass → verb last; deshalb → verb right after it; initial wenn → verb first in the main clause', () => {
    for (const m of shown.matchAll(/\bdenn (\w+) (\w+)/g)) {
      expect(['ich', 'wir', 'du', 'er', 'sie'], m[0]).toContain(m[1])
      expect(m[2], m[0]).not.toMatch(/en$/)
    }
    expect([...shown.matchAll(/\bdenn\b/g)].length).toBeGreaterThan(4)
    for (const m of shown.matchAll(/\bweil ([^.?!",]*)/g))
      if (m[1].trim()) expect(['muss', 'bin', 'kommen', 'einlade', 'ist'], m[0]).toContain(m[1].trim().split(' ').at(-1))
    for (const m of shown.matchAll(/\bdass ([^.?!",]*)/g))
      expect(['gehen', 'anfangen', 'ist', 'entscheiden'], m[0]).toContain(m[1].trim().split(' ').at(-1))
    for (const m of shown.matchAll(/\bdeshalb (\w+) (\w+)/g)) expect(['ich', 'wir', 'du'], m[0]).toContain(m[2])
    for (const m of shown.matchAll(/\bWenn [^,]+, (\w+) (\w+)/g)) expect(['wir', 'ich', 'du'], m[0]).toContain(m[2])
    expect([...shown.matchAll(/\bweil\b/g)].length).toBeGreaterThan(4)
    expect([...shown.matchAll(/\bdeshalb\b/g)].length).toBeGreaterThan(3)
  })
  it('NO new connector and no later construction: no obwohl, damit, nachdem, während, bevor, trotzdem, falls, sobald, indem, entweder, ob; no Relativsatz, no Passiv, no Genitiv; no zu + Infinitiv except the A1 chunk "etwas zu essen / zu trinken"', () => {
    expect(everything).not.toMatch(/\b(obwohl|damit|nachdem|während|bevor|trotzdem|falls|sobald|indem|entweder|sondern|ob)\b/i)
    expect(everything).not.toMatch(/, (der|die|das|den|dem|dessen|welcher|welche) [a-zäöüß]+ [^.?!]*(ist|hat|kann|muss|liegt|fährt)\b/)
    expect(everything).not.toMatch(/\b(wird|werden|wurde|worden|werde|wirst|geworden)\b/)
    expect(everything).not.toMatch(/\b(des|eines)\s+\w+s\b/)
    for (const m of everything.matchAll(
      /(\w+) zu (essen|trinken|gehen|machen|kommen|sein|haben|arbeiten|fahren|kochen|schreiben|sehen|bleiben|wandern)\b/g,
    ))
      expect(['etwas', 'oder'], m[0]).toContain(m[1])
    expect(everything).not.toMatch(/\b(Bleibt|Nehmt|Trinkt|Kommt|Ruft|Esst|Schlaft|Seid|Seht|Schickt|Macht|Fahrt)\b/)
  })
  it('dates: digits + point + month (never above 31); a spelled-out ordinal occurs only in the recognition item FT 07', () => {
    for (const m of everything.matchAll(
      /\b(\d{1,2})\. (Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)\b/g,
    ))
      expect(Number(m[1])).toBeLessThanOrEqual(31)
    expect([...everything.matchAll(/\b\d{1,2}\. (Mai|Juni|Juli|August)\b/g)].length).toBeGreaterThan(8)
    const noFt07 = JSON.stringify([shown, exercises, reading, listening, scenario, writing, grammar].map(x => x)).replace(
      /einundzwanzigsten/g,
      '',
    )
    expect(noFt07).not.toMatch(
      /\b(erste|zweite|dritte|vierte|fünfte|sechste|siebte|achte|neunte|zehnte|zwanzigste|einundzwanzigste)[nmrs]?\b/i,
    )
    expect(final.questions.find(q => q.id === 'a2-ft-20-07')!.prompt).toContain('einundzwanzigsten')
  })
  it('register: du in L1, S1, R1 and W1; Sie only in L2 (the colleague); no mix inside a text', () => {
    expect(listening[1].lines.map(x => x.text).join(' ')).toMatch(/\bSie\b|\bIhr\b/)
    for (const text of [
      listening[0].lines.map(x => x.text).join(' '),
      reading[0].body.join(' '),
      writing[0].model,
      scenario.turns.map(x => x.ai + ' ' + x.hints.join(' ')).join(' '),
    ])
      expect(text).not.toMatch(/\bSie\b|\bIhnen\b|\bIhr\b|\bIhre\b/)
  })
  const ADJ =
    '(?:neu|klein|groß|rot|blau|grau|schwarz|grün|weiß|günstig|lang|kurz|schön|warm|kalt|halb|gut|hell|dunkl|ganz|ander|nächst|schwer|nett|wichtig|jung|heiß|kühl|lieb)'
  const NOUN = '[A-ZÄÖÜ][a-zäöüß]+'
  const DET = [
    'ein',
    'eine',
    'einen',
    'kein',
    'keine',
    'keinen',
    'mein',
    'meine',
    'meinen',
    'dein',
    'deine',
    'deinen',
    'der',
    'die',
    'das',
    'den',
    'dieser',
    'diese',
    'dieses',
    'diesen',
  ]
  // fixed expressions and greetings without an article: "Gute Idee", "Liebe Anna / Liebe Grüße / Liebe Familie Roth", "Lieber …"
  const scan = (s: string) => s.replace(/Gute Idee/g, 'X').replace(/Liebe[rs]? (?=[A-ZÄÖÜ])/g, 'X ')
  it('attributive adjectives occur only after an article-word (the unit teaches none): the fixed "Gute Idee" and the greetings "Liebe …" are exempt', () => {
    const attributive = new RegExp(`\\b(\\w+) (${ADJ}(?:e|en|er|es|em))(?= ${NOUN})`, 'g')
    const offenders: string[] = []
    for (const m of scan(everything).matchAll(attributive)) if (!DET.includes(m[1].toLowerCase())) offenders.push(m[0])
    expect(offenders).toEqual([])
  })
  it('sentence length stays A2: no sentence of the unit has more than 16 words (numbers do not count)', () => {
    const long = sentences(shown).filter(s => s.split(/\s+/).filter(w => !/^\d+\.?$/.test(w)).length > 16)
    expect(long).toEqual([])
  })
})

describe('unit 20 — revision exercises', () => {
  it('3 fill / 3 choice / 2 order; each well-formed with exactly one correct answer', () => {
    const count = (t: string) => exercises.filter(e => e.type === t).length
    expect([count('fill'), count('choice'), count('order')]).toEqual([3, 3, 2])
    expect(exercises.map(e => e.type)).toEqual(['fill', 'choice', 'order', 'fill', 'choice', 'order', 'fill', 'choice'])
    expect(exercises.map(e => e.concept)).toEqual([
      'a2-vorschlaege-verabredungen',
      'a2-vorschlaege-verabredungen',
      'a2-vorschlaege-verabredungen',
      'a2-absichten-plaene',
      'a2-absichten-plaene',
      'a2-absichten-plaene',
      'a2-satzverbindungen-integration',
      'a2-satzverbindungen-integration',
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
  it('practises the plan: Wollen wir + infinitive, accepting a suggestion, Wie wäre es mit + Dativ, vorhaben, its word order, a time word first, weil vs. denn / deshalb, the deshalb word order', () => {
    expect(exercises.map(e => e.answer)).toEqual([
      'gehen',
      'Ja, gern. Gute Idee!',
      'Wie wäre es mit einem Kaffee?',
      'hast',
      'Ich habe am Sonntag nichts vor.',
      'Übermorgen plane ich eine Party.',
      'weil',
      'Ich bin müde, deshalb gehe ich nach Hause.',
    ])
  })
})

describe('unit 20 — the final test is separate, balanced and communicative', () => {
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
    const notes20 = doc('docs/authoring/A2_UNIT20_DESIGN_NOTES.md')
    const rows = [...notes20.matchAll(/^\| (O\d) \|[^|]+\|([^|]+)\|([^|]+)\|/gm)]
    expect(rows.map(r => r[1])).toEqual(['O1', 'O2', 'O3', 'O4', 'O5'])
    const ids = (cell: string) => [...cell.matchAll(/\d{2}/g)].map(m => m[0])
    for (const r of rows) {
      const fts = ids(r[3])
      expect(fts.length, `${r[1]} has no final-test item`).toBeGreaterThan(0)
      for (const n of fts)
        expect(
          q.some(x => x.id === `a2-ft-20-${n}`),
          `${r[1]}: a2-ft-20-${n}`,
        ).toBe(true)
      for (const n of ids(r[2]))
        expect(
          exercises.some(e => e.id === `a2-ex-20-${n}`),
          `${r[1]}: a2-ex-20-${n}`,
        ).toBe(true)
    }
    const communicative = /Communicative final-test items[^:]*: ([^—\n]+)/.exec(notes20)![1]
    const list = ids(communicative)
    expect(list.length).toBeGreaterThanOrEqual(8)
    for (const n of list) expect(q.some(x => x.id === `a2-ft-20-${n}`)).toBe(true)
  })
})

describe('unit 20 — stage boundaries', () => {
  it('Units 11–19 are unchanged and Unit 20 is locked: the review-package fingerprints equal the recorded ones', () => {
    const fp = (p: string) => /fingerprint: `([0-9a-f]{12})`/.exec(p)![1]
    expect([fp(cefrPackage(11)), fp(kyPackage(11))]).toEqual(['502db4af8249', 'dd636659c06f'])
    expect([fp(cefrPackage(12)), fp(kyPackage(12))]).toEqual(['4b6f9b8dcf73', '3a8c03023e72'])
    expect([fp(cefrPackage(13)), fp(kyPackage(13))]).toEqual(['c99778902721', 'fc311c5a7e08'])
    expect([fp(cefrPackage(14)), fp(kyPackage(14))]).toEqual(['d932881835ec', '39b892b0a8a1'])
    expect([fp(cefrPackage(15)), fp(kyPackage(15))]).toEqual(['12d4f84dfbf1', '9bbdddbf1eba'])
    expect([fp(cefrPackage(16)), fp(kyPackage(16))]).toEqual(['f75f46556cf7', '3ee2c25167a6'])
    expect([fp(cefrPackage(17)), fp(kyPackage(17))]).toEqual(['5725c4bc6a78', '16cc2220e1f2'])
    expect([fp(cefrPackage(18)), fp(kyPackage(18))]).toEqual(['c469c9dbe60d', '38594483c4ff'])
    expect([fp(cefrPackage(19)), fp(kyPackage(19))]).toEqual(['71fd78d8fd82', '46eef58246ed'])
    // unit 20 itself: any later edit of its content must be a deliberate, reported change
    expect([fp(cefrPackage(20)), fp(kyPackage(20))]).toEqual(['3d596de6c98d', '4672a7bd87b7'])
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
    expect(errors.some(e => e.rule === 'cefr-signoff-missing' && e.where === 'units:20')).toBe(true)
    expect(errors.some(e => e.rule === 'unit-missing' && e.where === 'units:20')).toBe(false)
  })
  it('all ten planned units are authored; A2 is in controlled Beta (ru + ky); no placement, level test or tutor content', () => {
    expect(unitsOfLevel('A2').map(u => u.id)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
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
