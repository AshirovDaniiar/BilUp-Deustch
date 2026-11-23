// @vitest-environment node
/**
 * Stage 7D — the PRODUCTION content of unit 13 ("Wohnen und Nachbarschaft"): completeness, identity, the approved vocabulary map and the
 * productive / receptive split, Russian/Kyrgyz independence, the grammar limits of the plan (adjective endings only after ein-/kein-/mein-,
 * Nominativ/Akkusativ, singular; capped comparison; no imperative paradigm, no dürfen/man), exercise and test structure, separation of revision
 * and final test, the reading-question rule, answer-position balance, the objective→assessment matrix, and the stage boundaries
 * (Units 11 and 12 unchanged, A2 planned and invisible).
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
import { BETA_FLAG_RULES, EXPECTED_BETA_FLAGS } from './beta-flags'
import { cefrPackage, kyPackage } from '../../scripts/review/unit-package'
import { A2_INSTRUCTIONS } from '../../src/data/a2/instructions'
import { A2_PLACEMENT_ITEMS } from '../../src/data/a2/placement'
import { A2_UNIT_PLAN } from '../../src/data/a2/registry'
import { A2_TUTOR_TEMPLATES } from '../../src/data/a2/tutor'
import { UNIT_13_RECEPTIVE_WORDS } from '../../src/data/a2/unit13/vocabulary'
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

const U = 13
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

describe('unit 13 — completeness', () => {
  it('is the planned unit: same id, key, title and level', () => {
    expect(unit.id).toBe(plan.id)
    expect(unit.key).toBe(plan.key)
    expect(unit.title).toBe(plan.titleDe)
    expect(unit.level).toBe('A2')
  })
  it('meets every minimum and the unit-13 plan (3 concepts, 8 exercises, 15 questions)', () => {
    expect(vocab.length).toBeGreaterThanOrEqual(UNIT_MINIMUMS.vocabulary)
    expect(grammar).toHaveLength(3)
    expect(unit.grammarIds).toEqual(grammar.map(g => g.id))
    expect(grammar.map(g => g.id)).toEqual(['a2-adjektivendungen-indefinit', 'a2-komparativ-superlativ', 'a2-positionsverben'])
    expect(listening).toHaveLength(2)
    expect(reading).toHaveLength(2)
    expect(writing).toHaveLength(1)
    expect(scenario).toBeDefined()
    expect(exercises).toHaveLength(8)
    expect(final.questions).toHaveLength(15)
    const def = topicTestOfUnit(U)!
    expect([def.id, def.kind, def.level, def.unit, def.size]).toEqual(['unit-13', 'topic', 'A2', 13, 15])
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
    expect(grammar.map(g => final.questions.filter(q => q.concept === g.id).length)).toEqual([3, 2, 2])
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
    expect(w.formal).toBe(true)
    expect(w.minWords).toBeLessThanOrEqual(50) // Stage 7B audit: keep formal tasks short (≤ 50 words)
    expect(words(w.model)).toBeGreaterThanOrEqual(w.minWords)
    const feedback = analyseWriting(w.model, w)
    expect(feedback.missing).toEqual([])
    expect(feedback.lengthOk).toBe(true)
    expect(feedback.errors).toEqual([])
    expect(analyseWriting('Hallo.', w).missing.length).toBeGreaterThan(3)
  })
  it('the writing task is a formal e-mail answering an ad (plan W1); it is a different genre from unit 12 (informal message)', () => {
    expect(writing[0].title).toMatch(/E-Mail/)
    expect(writingForUnit(12)[0].formal).toBe(false)
  })
  it('the household-problem scenario exists (a broken heating is reported) and is assessed in the final test', () => {
    expect(listening[1].lines.map(l => l.text).join(' ')).toMatch(/Heizung[^.]*funktioniert nicht/)
    expect(final.questions.some(q => /Heizung funktioniert nicht/.test(q.prompt) && /Vermieter/.test(q.prompt))).toBe(true)
  })
  it('instructions exist for every activity', () => {
    const scopes = instructions.map(i => i.scope)
    for (const s of ['unit', 'vocabulary', 'grammar', 'listening', 'reading', 'speaking', 'writing', 'review', 'test'])
      expect(scopes).toContain(s)
  })
})

describe('unit 13 — the approved vocabulary map and the productive / receptive split', () => {
  const map = doc('docs/authoring/A2_STAGE7B_VOCABULARY_MAP.md')
  const section = map.slice(map.indexOf('### Unit 13 —'), map.indexOf('### Unit 14 —'))
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
    expect([...UNIT_13_RECEPTIVE_WORDS].map(lemma).sort()).toEqual(plannedReceptive)
    expect(UNIT_13_RECEPTIVE_WORDS).toHaveLength(4)
    expect(vocab).toHaveLength(37)
  })
  it('follows the plan order, every noun has an article, nothing else has one; ids are v13-1 … v13-37; words are unique', () => {
    expect(vocab.map(v => v.id)).toEqual(vocab.map((_, i) => `v13-${i + 1}`))
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
  it('the nouns carry the articles of the plan (die Nebenkosten is plural-only)', () => {
    const article = (de: string) => vocab.find(v => v.de === de)!.article
    expect(article('Anzeige')).toBe('die')
    expect(article('Mietvertrag')).toBe('der')
    expect(article('Regal')).toBe('das')
    expect(article('Nebenkosten')).toBe('die')
    expect(vocab.find(v => v.de === 'Nebenkosten')!.plural).toBe('Nebenkosten')
  })
  it('receptive words are never REQUIRED: not a gap answer, speaking keyword / hint, writing requirement or correct final-test answer', () => {
    const stems = UNIT_13_RECEPTIVE_WORDS.map(w => norm(w).slice(0, 6))
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
    const text = norm(JSON.stringify([reading.map(r => r.body), listening.map(l => l.lines.map(x => x.text))]))
    for (const w of UNIT_13_RECEPTIVE_WORDS) expect(text, w).toContain(norm(w).slice(0, norm(w).length - 2))
    for (const v of vocab) expect(v.example.length, v.id).toBeGreaterThan(10)
  })
  it('every vocabulary example contains its word (or a form of it)', () => {
    for (const v of vocab) {
      const base = norm(v.de).replace(/^(ein|aus)(?=[a-zäöü]{5,})/, '') // separable verbs: einziehen → ziehen … ein
      const stem = base.slice(0, Math.max(4, base.length - 3))
      expect(norm(v.example).includes(stem), `${v.id} ${v.de}: "${v.example}"`).toBe(true)
    }
  })
})

describe('unit 13 — identity, ownership and conventions', () => {
  const c = conventions('a2')
  it('every id follows its convention and is sequential', () => {
    expect(unit.key).toMatch(c.unitKey.re)
    for (const g of grammar) expect(g.id).toMatch(c.grammar.re)
    expect(exercises.map(e => e.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8].map(n => `a2-ex-13-0${n}`))
    expect(final.questions.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `a2-ft-13-${String(i + 1).padStart(2, '0')}`))
    expect(listening.map(l => l.id)).toEqual(['a2-li-13-01', 'a2-li-13-02'])
    expect(reading.map(r => r.id)).toEqual(['a2-re-13-01', 'a2-re-13-02'])
    expect(writing.map(w => w.id)).toEqual(['a2-wr-13-01'])
    expect(scenario.id).toMatch(c.speaking.re)
    for (const i of instructions) expect(i.id).toMatch(c.instruction.re)
    expect(topicTestOfUnit(U)!.id).toMatch(c.unitTest(U).re)
  })
  it('everything names unit 13; ids do not collide with other levels or units; references stay inside the unit', () => {
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

describe('unit 13 — Russian and Kyrgyz are independent, complete and never a fallback', () => {
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
    expect(vocab.filter(v => kyOnly.test(v.ky + v.exampleKy)).length / vocab.length).toBeGreaterThan(0.6)
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
  it('disputed Kyrgyz terms are NOT used as labels (see the glossary); the glossary records the Unit 13 terms and stays unapproved', () => {
    const all = JSON.stringify([unit, vocab, grammar, exercises, listening, reading, writing, scenario, final, notes, instructions])
    for (const disputed of ['жөндөлгөн этиш', 'жакталган этиш', 'ээрчимелүү', 'багыныңкы', 'ажыраган', 'бөлүнүүчү', 'аттык сөз'])
      expect(all, disputed).not.toContain(disputed)
    const glossary = doc('docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md')
    expect(glossary).toContain('NOT reviewed by a native Kyrgyz speaker')
    expect(glossary).toMatch(/Unit 13/)
    expect(glossary).not.toMatch(/\| (APPROVED|approved) \|/)
  })
})

describe('unit 13 — language limits of the plan (Stage 7B audit, decisions D-1, D-5 and the Komparativ cap)', () => {
  const german = JSON.stringify([
    vocab.map(v => v.example),
    grammar.map(g => [g.examples.map(e => e.de), g.reallife.map(e => e.de), g.dialogue.map(d => d.text), g.speakPrompt.sample]),
    grammar.map(g => g.mistakes.map(m => m.right)),
    exercises.map(e => [e.prompt, e.answer]),
    listening.map(l => l.lines.map(x => x.text)),
    reading.map(r => r.body),
    [writing[0].model, scenario.turns.map(t => [t.ai, t.hints])],
    final.questions.map(q => [q.prompt, q.options]),
  ])
  const sentences = (s: string) =>
    s
      .split(/[.?!"“„]|\\n/)
      .map(x => x.trim())
      .filter(Boolean)
  const IMPERATIVE_STARTERS = new Set([
    'räum',
    'wasch',
    'hilf',
    'gib',
    'nimm',
    'sei',
    'mach',
    'kauf',
    'geh',
    'warte',
    'lauf',
    'komm',
    'ruf',
    'sag',
    'erzähl',
    'schreib',
    'lies',
    'sieh',
    'bring',
    'koch',
    'putz',
    'teil',
    'schenk',
    'besuch',
    'triff',
    'zeig',
    'ruh',
    'stell',
    'leg',
    'häng',
    'zieh',
    'schau',
    'trenn',
    'bleib',
    'warten',
    'kommen',
    'rufen',
    'schreiben',
  ])
  // only the fixed wording of the quiz tasks ("Lies die Anzeige", "Bilde den Satz"): task wording is not language the learner must produce
  const ALLOWED_IMPERATIVES = [/^lies (die nachricht|den text|die notiz|die anzeige|die anzeigen|die situation)\b/]
  it('the imperative does not appear at all (decision D-1: imperative is taught in unit 14), except the fixed quiz-task wording', () => {
    const offenders = sentences(german).filter(s => {
      const first = norm(s).split(' ')[0]
      return IMPERATIVE_STARTERS.has(first) && !ALLOWED_IMPERATIVES.some(re => re.test(norm(s)))
    })
    expect(offenders).toEqual([])
  })
  it('house rules are nominal notices: no dürfen / man / sollen / müssen in a rule, no "darf"', () => {
    expect(german).not.toMatch(/\b(darf|dürfen|dürft|darfst|man darf|man muss|soll|sollen|sollst)\b/i)
    expect(german).not.toMatch(/\bman (darf|kann|muss|soll)\b/i)
    expect(reading[1].body.join(' ')).toMatch(/Ruhe: täglich von 22 bis 6 Uhr/)
  })
  it('no content of later units: no wenn / dass / deshalb clause, no Konjunktiv II, no Genitiv, no B1 connectors, no Passiv, no ordinals, no zu + Infinitiv', () => {
    expect(german).not.toMatch(/\b(wenn|dass|deshalb|darum|obwohl|damit|nachdem|trotzdem|falls|sobald|indem|während)\b/i)
    expect(german).not.toMatch(/\b(wäre|wären|hätte|hätten|könnte|würde|müsste)\b/)
    expect(german).not.toMatch(/\b(des|eines)\s+\w+s\b/)
    expect(german).not.toMatch(/\b(wird|werden|wurde|wurden)\b[^."]{0,40}\bge\w{3,}(t|en)\b/)
    expect(german).not.toMatch(/\b\d{1,2}\.\s*(Stock|OG|Etage|März|April|Mai|Juni|Juli|August|Januar|Februar)\b/)
    expect(german).not.toMatch(/\b(erste|zweite|dritte|vierte)[nmrs]?\b/i)
    expect(JSON.stringify([unit, grammar, exercises, final, notes, instructions])).not.toMatch(/Konjunktiv/i)
  })
  it('comparison is capped: no "so … wie", no attributive comparative (die größere Wohnung), no "als" as a conjunction', () => {
    expect(german).not.toMatch(/\bso \w+ wie\b/i)
    expect(german).not.toMatch(/\b\w+(ere|eren|erer|eres|erem)\s+(Wohnung|Zimmer|Küche|Balkon|Keller|Flur|Bad|Haus)\b/)
    expect(german).not.toMatch(/\bals (ich|du|er|sie|es|wir|ihr)\s+\w+/i)
  })
  // adjective endings: only after ein-/kein-/mein-/dein-, singular, Nominativ / Akkusativ (the scope of `a2-adjektivendungen-indefinit`)
  const ADJ = '(?:neu|klein|groß|hell|dunkl|modern|gemütlich|möbliert|ruhig|schön|teur|kalt|eigen|alt|günstig|billig|warm)'
  const NOUN = '[A-ZÄÖÜ][a-zäöüß]+'
  it('attributive adjectives never follow the definite article, a Dativ article / preposition, a number or stand without an article', () => {
    const attributive = new RegExp(`\\b(\\w+) (${ADJ}(?:e|en|er|es|em))(?= ${NOUN})`, 'g')
    const allowedBefore = new Set([
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
      'ihre',
      'ihren',
    ])
    const offenders: string[] = []
    for (const m of german.matchAll(attributive)) if (!allowedBefore.has(m[1].toLowerCase())) offenders.push(m[0])
    expect(offenders).toEqual([])
    expect(german).not.toMatch(new RegExp(`\\b(?:einem|einer|keinem|keiner|meinem|meiner|deinem|deiner) ${ADJ}\\w*`))
  })
  it('every attributive adjective after ein-/kein-/mein- has the ending the unit teaches (Masc Nom -er, Masc Akk -en, Neut -es, Fem -e)', () => {
    const GENDER: Record<string, 'm' | 'n' | 'f'> = {
      Balkon: 'm',
      Tisch: 'm',
      Flur: 'm',
      Aufzug: 'm',
      Keller: 'm',
      Herd: 'm',
      Nachbar: 'm',
      Zimmer: 'n',
      Wohnzimmer: 'n',
      Bad: 'n',
      Regal: 'n',
      Haus: 'n',
      Wohnung: 'f',
      Küche: 'f',
      Heizung: 'f',
    }
    const re = new RegExp(
      `\\b(ein|eine|einen|kein|keine|keinen|mein|meine|meinen|dein|deine|deinen) (${ADJ}(?:e|en|er|es))(?: (?:${ADJ}(?:e|en|er|es)))? (${NOUN})`,
      'g',
    )
    let checked = 0
    for (const m of german.matchAll(re)) {
      const [, det, adj, noun] = m
      const g = GENDER[noun]
      if (!g) continue
      const d = det.toLowerCase()
      const akk = d.endsWith('en')
      const expected = g === 'm' ? (akk ? 'en' : 'er') : g === 'n' ? 'es' : 'e'
      expect(adj.endsWith(expected), `"${m[0]}": expected -${expected}`).toBe(true)
      checked++
    }
    expect(checked).toBeGreaterThan(15)
  })
})

describe('unit 13 — revision exercises', () => {
  it('3 fill / 3 choice / 2 order; each well-formed with exactly one correct answer', () => {
    const count = (t: string) => exercises.filter(e => e.type === t).length
    expect([count('fill'), count('choice'), count('order')]).toEqual([3, 3, 2])
    expect(exercises.map(e => e.type)).toEqual(['fill', 'choice', 'order', 'fill', 'choice', 'order', 'fill', 'choice'])
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
  it('practises the plan: endings (feminine, masculine Akkusativ, word order), comparison (comparative, als, superlative), position verbs (stellen, Wo?)', () => {
    expect(exercises[0].answer).toBe('e')
    expect(exercises[1].answer).toMatch(/einen kleinen Balkon/)
    expect(exercises[3].answer).toBe('billiger')
    expect(exercises[4].answer).toMatch(/größer als/)
    expect(exercises[5].answer).toMatch(/am gemütlichsten/)
    expect(exercises[6].answer).toBe('stelle')
    expect(exercises[7].answer).toMatch(/liegt auf dem Sofa/)
  })
})

describe('unit 13 — the final test is separate, balanced and communicative', () => {
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
        expect(t, `${x.id}: digits copied from the passage`).not.toMatch(/\d{3,}/)
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
    const notes13 = doc('docs/authoring/A2_UNIT13_DESIGN_NOTES.md')
    const rows = [...notes13.matchAll(/^\| (O\d) \|[^|]+\|([^|]+)\|([^|]+)\|/gm)]
    expect(rows.map(r => r[1])).toEqual(['O1', 'O2', 'O3', 'O4', 'O5'])
    const ids = (cell: string) => [...cell.matchAll(/\d{2}/g)].map(m => m[0])
    for (const r of rows) {
      const fts = ids(r[3])
      expect(fts.length, `${r[1]} has no final-test item`).toBeGreaterThan(0)
      for (const n of fts)
        expect(
          q.some(x => x.id === `a2-ft-13-${n}`),
          `${r[1]}: a2-ft-13-${n}`,
        ).toBe(true)
      for (const n of ids(r[2]))
        expect(
          exercises.some(e => e.id === `a2-ex-13-${n}`),
          `${r[1]}: a2-ex-13-${n}`,
        ).toBe(true)
    }
    const communicative = /Communicative final-test items[^:]*: ([^—\n]+)/.exec(notes13)![1]
    const list = ids(communicative)
    expect(list.length).toBeGreaterThanOrEqual(8)
    for (const n of list) expect(q.some(x => x.id === `a2-ft-13-${n}`)).toBe(true)
  })
})

describe('unit 13 — stage boundaries', () => {
  it('Units 11 and 12 are unchanged: their review-package fingerprints equal the recorded ones', () => {
    expect(/fingerprint: `([0-9a-f]{12})`/.exec(cefrPackage(11))![1]).toBe('502db4af8249')
    expect(/fingerprint: `([0-9a-f]{12})`/.exec(kyPackage(11))![1]).toBe('dd636659c06f')
    expect(/fingerprint: `([0-9a-f]{12})`/.exec(cefrPackage(12))![1]).toBe('4b6f9b8dcf73')
    expect(/fingerprint: `([0-9a-f]{12})`/.exec(kyPackage(12))![1]).toBe('3a8c03023e72')
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
    expect(errors.some(e => e.rule === 'cefr-signoff-missing' && e.where === 'units:13')).toBe(true)
    expect(errors.some(e => e.rule === 'unit-missing' && e.where === 'units:13')).toBe(false)
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
