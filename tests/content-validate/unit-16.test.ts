// @vitest-environment node
/**
 * Stage 7G — the PRODUCTION content of unit 16 ("Freizeit, Medien und Kultur"): completeness, identity, the approved vocabulary map and the
 * productive / receptive split, Russian/Kyrgyz independence, the grammar limits of the plan (gern / lieber / am liebsten, a closed set of six verb–preposition
 * pairs with Akkusativ, ordinals 1.–31. only in dates, `hätte` only in `hätte gern`, `wäre` only in `Wie wäre es mit`), genre variety (informal
 * listening and speaking, no telephone call, no e-mail), exercise and test structure, separation of revision and final test, the reading-question rule,
 * answer-position balance, the objective→assessment matrix, and the stage boundaries (Units 11–15 unchanged, A2 planned and invisible).
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
import { UNIT_16_RECEPTIVE_WORDS } from '../../src/data/a2/unit16/vocabulary'
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

const U = 16
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

describe('unit 16 — completeness', () => {
  it('is the planned unit: same id, key, title and level', () => {
    expect(unit.id).toBe(plan.id)
    expect(unit.key).toBe(plan.key)
    expect(unit.title).toBe(plan.titleDe)
    expect(unit.level).toBe('A2')
  })
  it('meets every minimum and the unit-16 plan (3 concepts, 8 exercises, 15 questions)', () => {
    expect(vocab.length).toBeGreaterThanOrEqual(UNIT_MINIMUMS.vocabulary)
    expect(grammar).toHaveLength(3)
    expect(unit.grammarIds).toEqual(grammar.map(g => g.id))
    expect(grammar.map(g => g.id)).toEqual(['a2-gern-lieber-am-liebsten', 'a2-verben-mit-praepositionen', 'a2-ordinalzahlen-datum'])
    expect(listening).toHaveLength(2)
    expect(reading).toHaveLength(2)
    expect(writing).toHaveLength(1)
    expect(scenario).toBeDefined()
    expect(exercises).toHaveLength(8)
    expect(final.questions).toHaveLength(15)
    const def = topicTestOfUnit(U)!
    expect([def.id, def.kind, def.level, def.unit, def.size]).toEqual(['unit-16', 'topic', 'A2', 16, 15])
  })
  it('workload: three concepts, each practised and assessed (exercises 3 / 3 / 2), each with a full explanation', () => {
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
    expect(grammar.map(g => final.questions.filter(q => q.concept === g.id).length)).toEqual([3, 3, 2])
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
    expect(w.formal).toBe(false) // unit 16: an informal forum comment, not a formal e-mail
    expect(w.minWords).toBeLessThanOrEqual(50) // Stage 7B audit: keep formal tasks short (≤ 50 words)
    expect(words(w.model)).toBeGreaterThanOrEqual(w.minWords)
    const feedback = analyseWriting(w.model, w)
    expect(feedback.missing).toEqual([])
    expect(feedback.lengthOk).toBe(true)
    expect(feedback.errors).toEqual([])
    expect(analyseWriting('Hallo.', w).missing.length).toBeGreaterThan(3)
  })
  it('the writing task is an informal forum comment (not an e-mail): the date is written with an ordinal, an opinion, a preference and a recommendation', () => {
    expect(writing[0].formal).toBe(false)
    expect(writing[0].title).not.toMatch(/E-Mail/)
    expect(writing[0].model).toMatch(/am dritten Mai/)
    expect(writing[0].model).toMatch(/am liebsten/)
    expect(writing[0].model).toMatch(/Du musst/)
    expect(writingForUnit(15)[0].formal).toBe(true)
  })
  it('GENRE VARIETY: L1 and S1 are informal (du), L2 is a ticket-counter conversation (Sie); no telephone call and no e-mail anywhere in the unit', () => {
    const l1 = listening[0].lines.map(x => x.text).join(' ')
    expect(l1).toMatch(/\bdu\b|\bHey\b/)
    expect(l1).not.toMatch(/\bSie\b|\bIhnen\b|\bIhr\b/)
    expect(scenario.turns.map(x => x.ai).join(' ')).toMatch(/\bdu\b|\bdeiner\b/)
    expect(listening[1].title).toMatch(/Kinokasse/)
    expect(listening[1].lines.map(x => x.text).join(' ')).toMatch(/\bSie\b/)
    const all = JSON.stringify([listening, reading, writing, scenario, grammar.map(g => g.dialogue)])
    expect(all).not.toMatch(/Sehr geehrte|Auf Wiederhören|hier spricht|am Telefon|Mit freundlichen Grüßen|E-Mail/i)
  })
  it('events carry the full information of a real poster: weekday, date and time or price in the reading items and the ticket dialogue', () => {
    expect(reading[0].body.join(' ')).toMatch(/Freitag, 3\. Mai, 20 Uhr/)
    expect(listening[1].lines.map(x => x.text).join(' ')).toMatch(/9 Euro/)
    expect(final.questions.filter(q => /Plakat|Info|Nachricht/.test(q.prompt)).length).toBeGreaterThanOrEqual(3)
  })
  it('instructions exist for every activity', () => {
    const scopes = instructions.map(i => i.scope)
    for (const s of ['unit', 'vocabulary', 'grammar', 'listening', 'reading', 'speaking', 'writing', 'review', 'test'])
      expect(scopes).toContain(s)
  })
})

describe('unit 16 — the approved vocabulary map and the productive / receptive split', () => {
  const map = doc('docs/authoring/A2_STAGE7B_VOCABULARY_MAP.md')
  const section = map.slice(map.indexOf('### Unit 16 —'), map.indexOf('### Unit 17 —'))
  const planned = section
    .split('\n')
    .filter(l => l.startsWith('- **'))
    .flatMap(l => l.slice(l.indexOf('): ') + 3).split(';'))
    .map(x => x.trim())
  it('implements exactly the 36 planned items, with the planned receptive classification (33 productive / 3 receptive)', () => {
    expect(planned).toHaveLength(36)
    expect(vocab.map(v => lemma(v.de)).sort()).toEqual(planned.map(lemma).sort())
    const plannedReceptive = planned
      .filter(x => /\(R\)/.test(x))
      .map(lemma)
      .sort()
    expect([...UNIT_16_RECEPTIVE_WORDS].map(lemma).sort()).toEqual(plannedReceptive)
    expect(UNIT_16_RECEPTIVE_WORDS).toHaveLength(3)
    expect(vocab).toHaveLength(36)
  })
  it('follows the plan order, every noun has an article, nothing else has one; ids are v16-1 … v16-36; words are unique', () => {
    expect(vocab.map(v => v.id)).toEqual(vocab.map((_, i) => `v16-${i + 1}`))
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
  it('the nouns carry the articles of the plan; Internet has no plural; online is the only non-verb non-noun word', () => {
    const word = (de: string) => vocab.find(v => v.de === de)!
    expect(word('Hobby').article).toBe('das')
    expect(word('Verein').article).toBe('der')
    expect(word('Eintrittskarte').article).toBe('die')
    expect(word('Museum').plural).toBe('Museen')
    expect(word('Internet').plural).toBeUndefined()
    expect(word('online').pos).toBe('other')
    expect(vocab.filter(v => v.pos === 'adj').map(v => v.de)).toEqual(['langweilig', 'spannend', 'interessant'])
    expect(vocab.filter(v => v.pos === 'verb').map(v => v.de)).toEqual([
      'schwimmen',
      'wandern',
      'tanzen',
      'malen',
      'fotografieren',
      'joggen',
      'herunterladen',
      'sich interessieren',
      'sich freuen',
      'warten',
    ])
  })
  it('receptive words are never REQUIRED: not a gap answer, speaking keyword / hint, writing requirement or correct final-test answer', () => {
    const stems = UNIT_16_RECEPTIVE_WORDS.map(w => norm(w).slice(0, 6))
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
    for (const w of UNIT_16_RECEPTIVE_WORDS) expect(text, w).toContain(norm(w).slice(0, 6))
    for (const v of vocab) expect(v.example.length, v.id).toBeGreaterThan(10)
  })
  it('every vocabulary example contains its word (or a form of it)', () => {
    for (const v of vocab) {
      if (v.de === 'herunterladen') {
        expect(norm(v.example), v.id).toMatch(/lade .* herunter/)
        continue
      }
      const base = norm(v.de).replace(/^sich /, '')
      const stem = base.slice(0, Math.max(3, base.length - 3))
      expect(norm(v.example).includes(stem), `${v.id} ${v.de}: "${v.example}"`).toBe(true)
    }
  })
})

describe('unit 16 — identity, ownership and conventions', () => {
  const c = conventions('a2')
  it('every id follows its convention and is sequential', () => {
    expect(unit.key).toMatch(c.unitKey.re)
    for (const g of grammar) expect(g.id).toMatch(c.grammar.re)
    expect(exercises.map(e => e.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8].map(n => `a2-ex-16-0${n}`))
    expect(final.questions.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `a2-ft-16-${String(i + 1).padStart(2, '0')}`))
    expect(listening.map(l => l.id)).toEqual(['a2-li-16-01', 'a2-li-16-02'])
    expect(reading.map(r => r.id)).toEqual(['a2-re-16-01', 'a2-re-16-02'])
    expect(writing.map(w => w.id)).toEqual(['a2-wr-16-01'])
    expect(scenario.id).toMatch(c.speaking.re)
    for (const i of instructions) expect(i.id).toMatch(c.instruction.re)
    expect(topicTestOfUnit(U)!.id).toMatch(c.unitTest(U).re)
  })
  it('everything names unit 16; ids do not collide with other levels or units; references stay inside the unit', () => {
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

describe('unit 16 — Russian and Kyrgyz are independent, complete and never a fallback', () => {
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
    expect(pairs.length).toBeGreaterThan(250)
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
    expect(vocab.filter(v => kyOnly.test(v.ky + v.exampleKy)).length / vocab.length).toBeGreaterThan(0.5)
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
  it('disputed Kyrgyz terms are NOT used as labels (see the glossary); the glossary records the Unit 16 terms and stays unapproved', () => {
    const all = JSON.stringify([unit, vocab, grammar, exercises, listening, reading, writing, scenario, final, notes, instructions])
    for (const disputed of ['жөндөлгөн этиш', 'жакталган этиш', 'ээрчимелүү', 'багыныңкы', 'ажыраган', 'бөлүнүүчү', 'аттык сөз'])
      expect(all, disputed).not.toContain(disputed)
    const glossary = doc('docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md')
    expect(glossary).toContain('NOT reviewed by a native Kyrgyz speaker')
    expect(glossary).toMatch(/Unit 16/)
    expect(glossary).not.toMatch(/\| (APPROVED|approved) \|/)
  })
})

describe('unit 16 — language limits of the plan (D-3 chunks, D-7 six pairs, ordinals only in dates, adjective endings only with an article word)', () => {
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
  it('fixed expressions: "hätte" only in "hätte gern", "wäre" only in "Wie wäre es mit"; no other Konjunktiv II form; the term Konjunktiv never occurs (audit D-3)', () => {
    expect(everything).not.toMatch(/hätte(?! gern)/i)
    expect(everything).not.toMatch(/wäre(?! es mit)/i)
    expect(everything).not.toMatch(/\b(wären|hätten|könnte|könnten|würde|würden|müsste|sollte|dürfte)\b/)
    const explanations = JSON.stringify([unit, grammar, exercises, final, notes, instructions])
    expect(explanations).not.toMatch(/Konjunktiv/i)
    expect(explanations).not.toMatch(/hätte(?! gern)|wäre(?! es mit)/i)
    expect(shown).toMatch(/Wie wäre es mit/)
  })
  it('the six verb–preposition pairs are the closed set of the unit (all Akkusativ); no other pair is taught and the question words / pronominal adverbs stay out', () => {
    for (const pair of [/interessiere mich für/, /freue mich auf/, /freue mich über/, /warte auf/, /sprechen über/, /denke( oft)? an/])
      expect(shown, String(pair)).toMatch(pair)
    expect(everything).not.toMatch(
      /\b(wofür|worauf|womit|woran|worüber|wovon|darauf|dafür|daran|darüber|davon|dabei|damit|dazu|dagegen)\b/i,
    )
    expect(everything).not.toMatch(
      /\b(ärgere|ärgert|träume|träumt|Angst (haben )?vor|hänge ab|hängt ab|Lust (haben )?auf|abhängen von|sich beschweren)\b/,
    )
    // the case after the pair: never a Dativ article directly after "auf / für / über / an" with these verbs
    expect(shown).not.toMatch(
      /\b(warte|warten|freue|freuen|interessiere|interessiert|sprechen|spreche|denke|denken)\b[^.?!"]{0,25}\b(auf|für|über|an) (dem|der|einem|einer)\b/,
    )
  })
  it('ordinals: only in dates (weekday / "am" / "der" before the ordinal, a month after it); never above 31; never "Wievielte"', () => {
    const ORD =
      '(?:erst|zweit|dritt|viert|fünft|sechst|siebt|acht|neunt|zehnt|elft|zwölft|dreizehnt|vierzehnt|fünfzehnt|sechzehnt|siebzehnt|achtzehnt|neunzehnt|zwanzigst|(?:ein|zwei|drei|vier|fünf|sechs|sieben|acht|neun)und(?:zwanzigst|dreißigst)|dreißigst|einunddreißigst)'
    const MONTH = '(?:Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember)'
    const any = new RegExp(`\\b${ORD}(?:e|en|er|es|em)\\b`, 'g')
    let seen = 0
    for (const m of everything.matchAll(any)) {
      const around = everything.slice(Math.max(0, m.index! - 12), m.index! + m[0].length + 12)
      // a lone ordinal is allowed only as a one-word gap option / answer of a revision exercise (e.g. "dritten")
      if (around.includes(m[0] + String.raw`\"`) || around.includes(`"${m[0]}"`)) continue
      expect(around, `ordinal "${m[0]}" outside a date`).toMatch(new RegExp(`(?:am|der) ${m[0]} ${MONTH}`, 'i'))
      seen++
    }
    expect(seen).toBeGreaterThan(8)
    expect(everything).not.toMatch(/\b(zweiunddreißigste|dreiunddreißigste|vierzigste|fünfzigste|hundertste)\w*/)
    expect(everything).not.toMatch(/Wievielte/)
    expect(everything).toMatch(/\b\d{1,2}\. (Mai|Juni|April|Juli|August|Oktober)\b/)
  })
  it('written dates follow the pattern "digit + dot + month" and never carry an ending in digits (no "3.en Mai", no "3te")', () => {
    expect(everything).not.toMatch(/\b\d{1,2}(te|ten|ste|sten|\.en|\.te)\b/)
  })
  it('no ihr-imperative; du- and Sie-imperatives only in fixed phrases (Schick mir …, Geh hin, Komm doch mit) and quiz wording', () => {
    expect(everything).not.toMatch(/\b(Bleibt|Nehmt|Trinkt|Kommt|Ruft|Esst|Schlaft|Ruht|Seid|Seht|Schickt|Macht)\b/)
    expect(everything).not.toMatch(/\bGeht (?!es\b|das\b|dir\b|euch\b|alles\b|so\b)/)
  })
  it('no content of later units: no man, no als / dass / deshalb / denn / obwohl / damit / nachdem, no Genitiv, no Passiv, no lassen, no zu + Infinitiv after a modal, no "Wollen wir / Lass uns" proposals', () => {
    expect(everything).not.toMatch(/\bman\b/)
    expect(everything).not.toMatch(/\b(dass|deshalb|darum|obwohl|denn|nachdem|trotzdem|falls|sobald|indem|während)\b/i)
    expect(everything).not.toMatch(/\bals (ich|du|er|sie|es|wir|ihr)\b/i)
    expect(everything).not.toMatch(/\b(des|eines)\s+\w+s\b/)
    expect(everything).not.toMatch(/\b(wird|werden|wurde|wurden)\b[^."]{0,40}\bge\w{3,}(t|en)\b/)
    expect(everything).not.toMatch(/\b(lassen|lasse|lässt|ließ)\b/)
    expect(everything).not.toMatch(
      /\b(soll|darf|dürfen|muss|müssen|kann|können|möchte|möchten) [^.?!"]{0,30}\bzu (gehen|bleiben|trinken|nehmen|arbeiten|kaufen|sehen)\b/,
    )
    expect(everything).not.toMatch(/\bWollen wir\b|\bLass uns\b|\bIch schlage vor\b/)
  })
  it('the scale is taught as such: gern, lieber, am liebsten and lieber … als all occur; no gerner / "mehr gern" outside the taught mistakes', () => {
    for (const w of ['gern', 'lieber', 'am liebsten', 'lieber Bücher als']) expect(shown, w).toContain(w)
    const outside = JSON.stringify([
      vocab.map(v => v.example),
      listening,
      reading.map(r => r.body),
      writing[0].model,
      final.questions.map(q => q.answer),
    ])
    expect(outside).not.toMatch(/gerner|mehr gern/)
  })
  // adjectives: the unit-13 / unit-15 scope plus the adjectives of this unit (neu, ganz, ander, halb)
  const ADJ = '(?:neu|klein|groß|rot|blau|grau|schwarz|grün|weiß|günstig|lang|kurz|schön|warm|kalt|halb|gut|hell|dunkl|ganz|ander|nächst)'
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
    'welcher',
    'welche',
    'welches',
    'welchen',
    'jede',
    'jeden',
  ]
  it('attributive adjectives occur only after an article-word in Nominativ / Akkusativ (adjective endings without an article stay receptive)', () => {
    const attributive = new RegExp(`\\b(\\w+) (${ADJ}(?:e|en|er|es|em))(?= ${NOUN})`, 'g')
    const offenders: string[] = []
    for (const m of everything.matchAll(attributive)) if (!DET.includes(m[1].toLowerCase())) offenders.push(m[0])
    expect(offenders).toEqual([])
    expect(everything).not.toMatch(new RegExp(`\\b(?:dem|einem|meinem|diesem|welchem|einer|meiner) ${ADJ}\\w*`))
  })
  it('every attributive adjective has the ending the unit teaches (after ein-/jed-: -er / -en / -es / -e; after the definite article: -en for den and in the plural, otherwise -e)', () => {
    const GENDER: Record<string, 'm' | 'n' | 'f'> = { Film: 'm', Tag: 'm', App: 'f', Woche: 'f', Preis: 'm', Portion: 'f' }
    const re = new RegExp(`\\b(${DET.join('|')}) (${ADJ})(e|en|er|es) (${NOUN})`, 'g')
    let checked = 0
    for (const m of shown.matchAll(re)) {
      const [, det, , end, noun] = m
      const d = det.toLowerCase()
      const g = GENDER[noun]
      if (!g) continue
      let expected: string
      if (['ein', 'eine', 'einen', 'kein', 'keine', 'keinen', 'mein', 'meine', 'meinen', 'jede', 'jeden', 'dein'].includes(d))
        expected = g === 'm' ? (d.endsWith('en') ? 'en' : 'er') : g === 'n' ? 'es' : 'e'
      else expected = ['den', 'diesen', 'welchen'].includes(d) ? 'en' : 'e'
      expect(end, `"${m[0]}": expected -${expected}`).toBe(expected)
      checked++
    }
    expect(checked).toBeGreaterThan(3)
  })
})

describe('unit 16 — revision exercises', () => {
  it('3 fill / 3 choice / 2 order; each well-formed with exactly one correct answer', () => {
    const count = (t: string) => exercises.filter(e => e.type === t).length
    expect([count('fill'), count('choice'), count('order')]).toEqual([3, 3, 2])
    expect(exercises.map(e => e.type)).toEqual(['fill', 'choice', 'order', 'fill', 'choice', 'order', 'fill', 'choice'])
    expect(exercises.map(e => e.concept)).toEqual([
      'a2-gern-lieber-am-liebsten',
      'a2-gern-lieber-am-liebsten',
      'a2-gern-lieber-am-liebsten',
      'a2-verben-mit-praepositionen',
      'a2-verben-mit-praepositionen',
      'a2-verben-mit-praepositionen',
      'a2-ordinalzahlen-datum',
      'a2-ordinalzahlen-datum',
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
  it('practises the plan: am liebsten, lieber … als, inversion after am liebsten, für, the case after warten auf, reflexive + preposition word order, the ordinal in a date, the spoken date', () => {
    expect(exercises[0].answer).toBe('am liebsten')
    expect(exercises[1].answer).toBe('Ich gehe lieber ins Kino als ins Theater.')
    expect(exercises[2].answer).toBe('Am liebsten wandere ich.')
    expect(exercises[3].answer).toBe('für')
    expect(exercises[4].answer).toBe('Ich warte auf den Bus.')
    expect(exercises[5].answer).toBe('Ich freue mich auf das Fest.')
    expect(exercises[6].answer).toBe('dritten')
    expect(exercises[7].answer).toBe('am zwölften Mai')
  })
})

describe('unit 16 — the final test is separate, balanced and communicative', () => {
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
        for (const n of t.match(/d{3,}/g) ?? []) expect(questionText, `${x.id}: number ${n} copied from the passage`).toContain(n)
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
    const notes16 = doc('docs/authoring/A2_UNIT16_DESIGN_NOTES.md')
    const rows = [...notes16.matchAll(/^\| (O\d) \|[^|]+\|([^|]+)\|([^|]+)\|/gm)]
    expect(rows.map(r => r[1])).toEqual(['O1', 'O2', 'O3', 'O4', 'O5'])
    const ids = (cell: string) => [...cell.matchAll(/\d{2}/g)].map(m => m[0])
    for (const r of rows) {
      const fts = ids(r[3])
      expect(fts.length, `${r[1]} has no final-test item`).toBeGreaterThan(0)
      for (const n of fts)
        expect(
          q.some(x => x.id === `a2-ft-16-${n}`),
          `${r[1]}: a2-ft-16-${n}`,
        ).toBe(true)
      for (const n of ids(r[2]))
        expect(
          exercises.some(e => e.id === `a2-ex-16-${n}`),
          `${r[1]}: a2-ex-16-${n}`,
        ).toBe(true)
    }
    const communicative = /Communicative final-test items[^:]*: ([^—\n]+)/.exec(notes16)![1]
    const list = ids(communicative)
    expect(list.length).toBeGreaterThanOrEqual(8)
    for (const n of list) expect(q.some(x => x.id === `a2-ft-16-${n}`)).toBe(true)
  })
})

describe('unit 16 — stage boundaries', () => {
  it('Units 11–15 are unchanged: their review-package fingerprints equal the recorded ones', () => {
    const fp = (p: string) => /fingerprint: `([0-9a-f]{12})`/.exec(p)![1]
    expect([fp(cefrPackage(11)), fp(kyPackage(11))]).toEqual(['502db4af8249', 'dd636659c06f'])
    expect([fp(cefrPackage(12)), fp(kyPackage(12))]).toEqual(['4b6f9b8dcf73', '3a8c03023e72'])
    expect([fp(cefrPackage(13)), fp(kyPackage(13))]).toEqual(['c99778902721', 'fc311c5a7e08'])
    expect([fp(cefrPackage(14)), fp(kyPackage(14))]).toEqual(['d932881835ec', '39b892b0a8a1'])
    expect([fp(cefrPackage(15)), fp(kyPackage(15))]).toEqual(['12d4f84dfbf1', '9bbdddbf1eba'])
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
    expect(errors.some(e => e.rule === 'cefr-signoff-missing' && e.where === 'units:16')).toBe(true)
    expect(errors.some(e => e.rule === 'unit-missing' && e.where === 'units:16')).toBe(false)
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
