// @vitest-environment node
/**
 * B1 Unit 25 — Gesundheit, Beziehungen und Lebensstil (Stage 3G). Checks the authored content against the approved curriculum: identity, the two approved
 * concepts (Konjunktiv II for advice, reflexive verbs with Dativ on a closed list), vocabulary (38–42, nothing already taught), text sizes, scope guard for later
 * units (unreal conditions → 27, Passiv with modal/Präteritum → 26, …), health-content safety, RU/KY parity, exercise/answer-key correctness, assessment structure,
 * metadata, the opinion micro-task, topic evidence and spaced revision. B1 stays `planned` and invisible; no CEFR approval of any kind is implied.
 */
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { lemmaKeys } from '../../scripts/content-validate/b1/lemma'
import { B1_CURRICULUM } from '../../scripts/content-validate/b1/curriculum'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_META } from '../../src/data/b1/meta'
import { B1_UNIT_PLAN } from '../../src/data/b1/registry'
import { UNIT_25_EXERCISES, UNIT_25_FINAL, UNIT_25_TEST } from '../../src/data/b1/unit25/assessment'
import { UNIT_25_GRAMMAR, UNIT_25_WHY_NOTES } from '../../src/data/b1/unit25/grammar'
import { UNIT_25_LISTENING, UNIT_25_READING, UNIT_25_SPEAKING, UNIT_25_WRITING } from '../../src/data/b1/unit25/texts'
import { UNIT_25 } from '../../src/data/b1/unit25/unit'
import { UNIT_25_VOCABULARY } from '../../src/data/b1/unit25/vocabulary'
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
const CONCEPTS = ['b1-konjunktiv2-ratschlaege', 'b1-reflexive-dativ']
const META = B1_META.find(m => m.unit === 25)!
const MAIN = UNIT_25_WRITING[0]
const MICRO = UNIT_25_WRITING[1]

/** every German string of the unit (what a learner reads or hears) */
function germanTexts(): string[] {
  const out: string[] = []
  for (const r of UNIT_25_READING) out.push(...r.body, ...r.questions.flatMap(q => [q.q, ...q.options]))
  for (const l of UNIT_25_LISTENING) out.push(...l.lines.map(x => x.text), ...l.questions.flatMap(q => [q.q, ...q.options]))
  for (const v of UNIT_25_VOCABULARY) out.push(v.example)
  for (const g of UNIT_25_GRAMMAR)
    out.push(...g.examples.map(x => x.de), ...g.reallife.map(x => x.de), ...g.dialogue.map(x => x.text), g.speakPrompt.sample)
  for (const n of UNIT_25_WHY_NOTES) out.push(n.sentence, ...n.more.map(x => x.de))
  // prompts and answers only: the distractor options of a choice item are deliberately wrong forms and are never taught
  for (const e of UNIT_25_EXERCISES) out.push(e.prompt, e.answer)
  for (const q of UNIT_25_FINAL) out.push(q.prompt, q.answer)
  for (const w of UNIT_25_WRITING) out.push(w.model, w.mustInclude.map(m => m.label).join(' '))
  for (const s of UNIT_25_SPEAKING) out.push(...s.turns.flatMap(t => [t.ai, ...t.hints]))
  return out
}
const MISTAKES = new Set(UNIT_25_GRAMMAR.flatMap(g => g.mistakes.flatMap(m => [m.wrong, m.right])))
const taught = () => germanTexts().filter(t => !MISTAKES.has(t))

const ALL_DATA = () => [
  UNIT_25,
  UNIT_25_GRAMMAR,
  UNIT_25_WHY_NOTES,
  UNIT_25_READING,
  UNIT_25_LISTENING,
  UNIT_25_SPEAKING,
  UNIT_25_WRITING,
  UNIT_25_EXERCISES,
  UNIT_25_FINAL,
  UNIT_25_VOCABULARY,
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
    const plan = B1_UNIT_PLAN.find(p => p.id === 25)!
    expect(UNIT_25).toMatchObject({ id: 25, key: plan.key, title: plan.titleDe, level: 'B1' })
    expect(plan.key).toBe('b1-gesundheit-lebensstil')
    expect(plan.titleDe).toBe('Gesundheit, Beziehungen und Lebensstil')
    expect(UNIT_25.grammarIds).toEqual(CONCEPTS)
  })
  it('the content module holds Unit 25 after Units 21–24, wired into the metadata, the tests, the final tests and the speaking list', () => {
    expect(B1_CONTENT.legacyUnits.map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_META.map(m => m.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.tests).toContainEqual(UNIT_25_TEST)
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
    expect(vocabularyForUnit(25)).toHaveLength(40)
    expect(grammarForUnit(25).map(g => g.id)).toEqual(CONCEPTS)
    expect(finalTestOfUnit(25)?.questions).toHaveLength(15)
    expect(topicTestOfUnit(25)).toMatchObject({ id: 'unit-25', level: 'B1', size: 15 })
    expect(speakingForUnit(25)).toBe('b1-sp-25-01')
    expect(writingForUnit(25).map(w => w.id)).toEqual(['b1-wr-25-01', 'b1-wr-25-02'])
  })
})

describe('grammar: only the two approved concepts', () => {
  it('exactly the approved ids, in order, owned by Unit 25, level B1', () => {
    expect(UNIT_25_GRAMMAR.map(g => g.id)).toEqual(CONCEPTS)
    for (const g of UNIT_25_GRAMMAR) expect(g).toMatchObject({ unit: 25, level: 'B1' })
    expect(B1_CURRICULUM.units.find(u => u.unit === 25)!.concepts.map(c => c.id)).toEqual(CONCEPTS)
  })
  it('every concept is complete: explanation, 5 examples, mistakes, real-life, dialogue, speaking prompt — in Russian and in Kyrgyz', () => {
    for (const g of UNIT_25_GRAMMAR) {
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
  it('the why-notes: two on Konjunktiv II and two on the reflexive Dativ', () => {
    expect(UNIT_25_WHY_NOTES.map(n => n.conceptId)).toEqual([CONCEPTS[0], CONCEPTS[0], CONCEPTS[1], CONCEPTS[1]])
  })
  it('the examples really show their concept: Konjunktiv II forms (würde, sollte, könnte, hätte, wäre) and a reflexive pronoun in the Dativ', () => {
    for (const x of [...UNIT_25_GRAMMAR[0].examples, ...UNIT_25_GRAMMAR[0].reallife])
      expect(x.de, x.de).toMatch(/\b(würde|würden|solltest|sollten|sollte|könntest|könnten|könnte|hätten|hätte|wäre)\b/i)
    for (const x of [...UNIT_25_GRAMMAR[1].examples, ...UNIT_25_GRAMMAR[1].reallife])
      expect(x.de, x.de).toMatch(/\b(mir|dir|sich|uns|euch)\b/)
    const all = UNIT_25_GRAMMAR[0].examples.map(x => x.de).join(' ')
    for (const f of ['würde', 'solltest', 'könntest', 'wäre', 'Hätten']) expect(all, f).toContain(f)
  })
  it('the A2 `sollen` vs B1 `sollte` contrast is taught explicitly (summary, step, mistake, why-note)', () => {
    const g = UNIT_25_GRAMMAR[0]
    expect(g.summary.ru).toMatch(/sollst/)
    expect(g.summary.ru).toMatch(/solltest/)
    expect(g.when.map(x => x.ru).join(' ')).toMatch(/A2/)
    expect(g.mistakes.some(m => /Du sollst/.test(m.wrong) && /Du solltest/.test(m.right))).toBe(true)
    expect(UNIT_25_WHY_NOTES[1].reason.ru).toMatch(/sollst/)
  })
  it('every "mistake" really differs from its correction, and the wrong form never appears in the taught texts', () => {
    for (const g of UNIT_25_GRAMMAR) for (const m of g.mistakes) expect(m.wrong).not.toBe(m.right)
    const wrong = UNIT_25_GRAMMAR.flatMap(g => g.mistakes.map(m => m.wrong))
    for (const t of taught()) expect(wrong.includes(t), t).toBe(false)
  })
  it('scope guard: nothing that belongs to a later unit (unreal conditions/wishes → 27, Konjunktiv II of the past, Passiv with modal or Präteritum → 26, damit, Genitiv, relative clause with preposition, verb + preposition)', () => {
    const forbidden: [string, RegExp][] = [
      ['damit (Unit 30)', /\bdamit\b/i],
      ['Passiv Präteritum (Unit 26)', /\b(wurde|wurden)\b/i],
      ['Passiv Perfekt (receptive in Unit 24 only)', /\bworden\b/i],
      ['Passiv with a modal verb (Unit 26)', /\b(muss|müssen|kann|können|soll|sollen|darf|dürfen)\b[^.!?]*\b\w+(t|en)\s+werden\b/i],
      [
        'unreal condition (Unit 27): wenn … hätte/wäre/würde/könnte',
        /\bwenn\b[^.!?]*\b(hätte|hätten|wäre|wären|würde|würden|könnte|könnten)\b/i,
      ],
      ['unreal wish (Unit 27)', /\b(wünschte|wünschten)\b|\bals ob\b/i],
      ['Konjunktiv II of the past (receptive, Unit 31)', /\b(hätte|hätten|hättest|wäre|wären)\b[^.!?,]*\b(ge\w+(t|en)|\w+iert)\s*[.!?,]/i],
      ['other Konjunktiv II modals (müsste, dürfte, wollte) outside the five forms', /\b(müsste|müssten|dürfte|dürften)\b/i],
      ['Genitiv (des/eines + Noun-s, wegen, trotz)', /\b(des|eines)\s+[A-ZÄÖÜ]\w+s\b|\bwegen\b|\btrotz\b/],
      [
        'relative clause with a preposition (Unit 29)',
        /,\s*(an|auf|in|mit|von|für|bei|aus|über|nach|vor)\s+(dem|der|den|denen|dessen|deren)\s(?![^.!?]*\bzu \w+)/,
      ],
      ['Dativ / Genitiv relative pronoun (Unit 29)', /,\s*(dem|denen|dessen|deren)\s/],
      [
        'verb + obligatory preposition (Unit 28)',
        /\b(sich ärgern über|denken an|denke an|sich kümmern um|Angst vor|hält von|halten von|sprechen über|spreche über|diskutieren über|warten auf|sich freuen|abhängen von|hängt von|teilnehmen an|glauben an|träumen von|sich interessieren für|bestehen aus|sich bewerben um|nachdenken über)\b/i,
      ],
      [
        'receptive constructions of Units 22–24 (ohne … zu, statt … zu, einerseits)',
        /\bohne\b|\bstatt\b|einerseits|andererseits|nicht nur|sondern auch/i,
      ],
      ['Partizip I as adjective (Unit 26)', /\b(steigend|fallend|laufend|wachsend)(e|en|er|es|em)\b/i],
    ]
    // the name of the checklist item "Ein Adjektiv ..." and a greeting are not constructions
    for (const t0 of taught())
      for (const [name, re] of forbidden) {
        const t = t0.replace(/Liebe[rn]? \w+, /g, '')
        expect(re.test(t), `${name}: "${t.slice(0, 90)}"`).toBe(false)
      }
  })
  it('the productive constructions are really used in the texts: würde + Infinitiv, sollte, könnte, wäre + zu-Infinitiv, hätte (polite), and reflexive pronouns mir / dir / sich / uns', () => {
    const all = taught().join(' ')
    expect(all).toMatch(/\bwürde ich\b/)
    expect(all).toMatch(/\bsolltest\b/)
    expect(all).toMatch(/\bkönntest\b/)
    expect(all).toMatch(/\bwäre gut, [^.!?]*\bzu \w+/)
    expect(all).toMatch(/\bHätten Sie\b/)
    expect(all).toMatch(/\bKönnten Sie\b/)
    for (const r of ['mir', 'dir', 'uns', 'sich']) expect(all, r).toMatch(new RegExp(`\\b${r}\\b`))
    expect(all).toMatch(/\bAn deiner Stelle würde ich\b/)
  })
})

describe('reflexive verbs with Dativ: a closed list of at most 10, and the tasks stay inside it', () => {
  const concept = META.concepts[1]
  it('P-lim, load M, a closed list of exactly 10 entries (the approved cap)', () => {
    expect(concept).toMatchObject({ conceptId: 'b1-reflexive-dativ', proficiency: 'P-lim', load: 'M', role: 'new' })
    expect(concept.closedList).toHaveLength(10)
    expect(new Set(concept.closedList).size).toBe(10)
    expect(B1_CURRICULUM.units.find(u => u.unit === 25)!.concepts[1].listCap).toBe(10)
    for (const e of concept.closedList!) expect(e.startsWith('sich ')).toBe(true)
  })
  it('the explanation names the same ten expressions', () => {
    const s = UNIT_25_GRAMMAR[1].summary.ru
    for (const e of concept.closedList!) expect(s, e).toContain(e)
  })
  it('every reflexive-Dativ exercise and final-test question uses a verb of the closed list', () => {
    const stems = /Zähne|Hände|wehget|wehtun|merken|überlege|vorstell|Zeit|wünsch|Arm|Fuß|kauf/
    for (const e of UNIT_25_EXERCISES.filter(x => x.concept === 'b1-reflexive-dativ'))
      expect(`${e.prompt} ${e.answer}`, e.id).toMatch(stems)
    for (const q of UNIT_25_FINAL.filter(x => x.concept === 'b1-reflexive-dativ')) expect(`${q.prompt} ${q.answer}`, q.id).toMatch(stems)
  })
})

describe('vocabulary: 40 new items, none already taught', () => {
  const b = fullBundle()
  const earlier = new Set(b.vocabulary.filter(v => v.unit <= 24).flatMap(v => lemmaKeys(v.de)))
  it('exactly 40 items (target 38–42), ids v25-1 … v25-40, unique across the whole B1 vocabulary', () => {
    expect(UNIT_25_VOCABULARY).toHaveLength(40)
    expect(UNIT_25_VOCABULARY.map(v => v.id)).toEqual(Array.from({ length: 40 }, (_, i) => `v25-${i + 1}`))
    expect(UNIT_25_VOCABULARY.every(v => v.unit === 25)).toBe(true)
    const ids = B1_CONTENT.vocabulary.map(v => v.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toHaveLength(480)
  })
  it('no lemma repeats an A1, A2 or earlier B1 headword (the A2 body/illness words are NOT repeated), and none is listed twice', () => {
    const keys = UNIT_25_VOCABULARY.flatMap(v => lemmaKeys(v.de))
    expect(keys.filter(k => earlier.has(k))).toEqual([])
    expect(new Set(keys).size).toBe(keys.length)
    const de = UNIT_25_VOCABULARY.map(v => v.de)
    for (const known of [
      'Praxis',
      'Tablette',
      'Stress',
      'Fieber',
      'Kopfschmerzen',
      'Gesundheit',
      'Vertrauen',
      'vertrauen',
      'sich streiten',
      'sich erholen',
      'ehrlich',
      'sich entspannen',
      'Untersuchung',
    ])
      expect(de).not.toContain(known)
  })
  it('every item has article/plural where a noun, a German example, and independent Russian and Kyrgyz translations of the word and the example', () => {
    for (const v of UNIT_25_VOCABULARY) {
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
    const ex = UNIT_25_VOCABULARY.map(v => v.example)
    expect(new Set(ex).size).toBe(ex.length)
  })
  it('the planned themes are present: health system, lifestyle, relationships and feelings — and no verb needs a prepositional object', () => {
    const de = UNIT_25_VOCABULARY.map(v => v.de)
    for (const w of [
      'Krankenkasse',
      'Überweisung',
      'Rezept',
      'Beschwerden',
      'Behandlung',
      'Ernährung',
      'Schlaf',
      'Vorsorge',
      'Lebensstil',
      'Missverständnis',
      'Streit',
      'sich versöhnen',
      'Beziehung',
      'Ratschlag',
      'gestresst',
      'ausgeglichen',
    ])
      expect(de, w).toContain(w)
    for (const v of UNIT_25_VOCABULARY.filter(x => x.pos === 'verb'))
      expect(`${v.ru} ${v.ky}`, v.de).not.toMatch(/\((an|über|auf|von|für|mit|um|vor) /)
  })
  it('Wortbildung strand: -ung nouns, a compound and un- are present as items and explained in the metadata in three languages', () => {
    const de = UNIT_25_VOCABULARY.map(v => v.de)
    for (const w of ['Behandlung', 'Überweisung', 'Ernährung', 'Krankenkasse', 'ungesund']) expect(de, w).toContain(w)
    const n = META.strands.wortbildungNote!
    expect(n.de && n.ru && n.ky).toBeTruthy()
    expect(n.ky).not.toBe(n.ru)
    for (const w of ['-ung', 'Krankenkasse', 'un-']) expect(n.de).toContain(w)
  })
  it('the unit REUSES established health and relationship words as revision in its texts without listing them as new', () => {
    const all = germanTexts().join(' ')
    for (const w of ['Kopfschmerzen', 'Stress', 'Hausarzt', 'Termin', 'entschuldigen', 'Gesundheit', 'Pause', 'Freundin'])
      expect(all, w).toMatch(new RegExp(w))
  })
})

describe('texts: progressive targets (band for Units 23–26 and the curriculum text for Unit 25)', () => {
  it('2 readings of 140–180 words and 2 listening scripts of 130–160 words', () => {
    expect(UNIT_25_READING).toHaveLength(2)
    expect(UNIT_25_LISTENING).toHaveLength(2)
    for (const r of UNIT_25_READING) {
      const n = r.body.reduce((a, p) => a + words(p), 0)
      expect(n, r.id).toBeGreaterThanOrEqual(140)
      expect(n, r.id).toBeLessThanOrEqual(180)
    }
    for (const l of UNIT_25_LISTENING) {
      const n = l.lines.reduce((a, x) => a + words(x.text), 0)
      expect(n, l.id).toBeGreaterThanOrEqual(130)
      expect(n, l.id).toBeLessThanOrEqual(160)
    }
  })
  it('sentences stay short (95th percentile ≤ 18, longest ≤ 24 words)', () => {
    const lens = [
      ...UNIT_25_READING.flatMap(r => r.body.flatMap(sentences)),
      ...UNIT_25_LISTENING.flatMap(l => l.lines.flatMap(x => sentences(x.text))),
    ]
      .map(words)
      .sort((a, b) => a - b)
    expect(lens[lens.length - 1]).toBeLessThanOrEqual(24)
    expect(lens[Math.ceil(0.95 * lens.length) - 1]).toBeLessThanOrEqual(18)
  })
  it('every dialogue line carries a Russian and a Kyrgyz translation; questions have 3 distinct options, exactly one correct; answer positions vary', () => {
    for (const l of UNIT_25_LISTENING) for (const x of l.lines) expect(x.ru && x.ky && x.ky !== x.ru).toBeTruthy()
    const qs = [...UNIT_25_LISTENING.flatMap(l => l.questions), ...UNIT_25_READING.flatMap(r => r.questions)]
    for (const q of qs) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options).size).toBe(3)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(3)
    }
    expect(new Set(qs.map(q => q.answer)).size).toBe(3)
    expect(new Set(UNIT_25_READING.flatMap(r => r.questions.map(q => q.answer))).size).toBe(3)
    expect(new Set(UNIT_25_LISTENING.flatMap(l => l.questions.map(q => q.answer))).size).toBe(3)
  })
  it('the listening keywords all have a gloss in the unit vocabulary', () => {
    const de = new Set(UNIT_25_VOCABULARY.map(v => v.de))
    for (const l of UNIT_25_LISTENING) for (const k of l.keywords) expect(de.has(k), `${l.id}: ${k}`).toBe(true)
  })
  it('the listening dialogues are coherent: a greeting opens and a closing line ends each; the doctor conversation points to professional help', () => {
    expect(UNIT_25_LISTENING[0].lines[0].text).toMatch(/Guten Tag/)
    expect(UNIT_25_LISTENING[0].lines.at(-1)!.text).toMatch(/Auf Wiedersehen/)
    expect(UNIT_25_LISTENING[1].lines[0].text).toMatch(/Willkommen/)
    expect(UNIT_25_LISTENING[1].lines.at(-1)!.text).toMatch(/Gern geschehen/)
    expect(UNIT_25_LISTENING[0].lines.map(x => x.text).join(' ')).toMatch(/Überweisung zu einem Spezialisten/)
    expect(UNIT_25_LISTENING[1].lines.map(x => x.text).join(' ')).toMatch(/Hausarzt oder einer Beratungsstelle/)
  })
  it('the listening answer keys agree with the script (every correct option is supported by the text, no distractor is)', () => {
    const l1 = UNIT_25_LISTENING[0].lines.map(x => x.text).join(' ')
    const q1 = UNIT_25_LISTENING[0].questions
    expect(q1.map(q => q.options[q.answer])).toEqual([
      'Seit zwei Wochen.',
      'Früher ins Bett gehen.',
      'In vier Wochen.',
      'Wenn die Kopfschmerzen bleiben.',
    ])
    expect(l1).toMatch(/Seit zwei Wochen/)
    expect(l1).toMatch(/Sie sollten abends früher ins Bett gehen/)
    expect(l1).toMatch(/in vier Wochen wiederkommen/)
    expect(l1).not.toMatch(/zwei Tagen|zwei Monaten|Kaffee|zwei Wochen wiederkommen/)
    const l2 = UNIT_25_LISTENING[1].lines.map(x => x.text).join(' ')
    const q2 = UNIT_25_LISTENING[1].questions
    expect(q2.map(q => q.options[q.answer])).toEqual([
      'Über Stress im Alltag.',
      'Spazieren gehen oder tief atmen.',
      'Jeden Tag zehn Minuten nur für sich nehmen.',
      'Der Hausarzt oder eine Beratungsstelle.',
    ])
    expect(l2).toMatch(/spazieren gehen oder einfach tief atmen/)
    expect(l2).toMatch(/jeden Tag zehn Minuten nur für mich nehmen/)
    expect(l2).not.toMatch(/Chef/)
  })
  it('the reading answer keys agree with the text', () => {
    const [r1, r2] = UNIT_25_READING
    const t1 = r1.body.join(' ')
    expect(r1.questions.map(q => q.options[q.answer])).toEqual([
      'Sieben bis neun.',
      'Das Handy früher weglegen.',
      'Man sollte mit dem Hausarzt sprechen.',
    ])
    expect(t1).toMatch(/sieben bis neun Stunden Schlaf/)
    expect(t1).toMatch(/das Handy früher weglegen/)
    expect(t1).toMatch(/sollte er mit dem Hausarzt sprechen/)
    const t2 = r2.body.join(' ')
    expect(r2.questions.map(q => q.options[q.answer])).toEqual([
      'Mara ist nicht zum Treffen gekommen.',
      'Mara soll die Freundin anrufen und alles erklären.',
      'Ein Missverständnis.',
    ])
    expect(t2).toMatch(/ihre Nachricht nicht gesehen/)
    expect(t2).toMatch(/sie anrufen und ehrlich erklären/)
    expect(t2).toMatch(/nur ein Missverständnis/)
  })
  it('the reading glosses give Russian and Kyrgyz for every word, independently', () => {
    for (const r of UNIT_25_READING) for (const g of r.gloss) expect(g.ky).not.toBe(g.ru)
    for (const r of UNIT_25_READING) for (const g of r.gloss) expect(g.grammarKy).not.toBe(g.grammar)
  })
  it('listening uses the existing browser text-to-speech lab: no audio file, no claim of verified playback; no assessment item depends on audio', () => {
    for (const l of UNIT_25_LISTENING) expect(Object.keys(l)).not.toContain('audio')
    for (const q of UNIT_25_FINAL) expect(q.skill).not.toBe('listening')
  })
  it('speaking: one scenario of 6 turns about a quarrel with a friend; the friend rejects the advice in turn 4 (unexpected element); hints and keywords in German + Russian + Kyrgyz', () => {
    const [s] = UNIT_25_SPEAKING
    expect(s.turns).toHaveLength(6)
    expect(s.level).toBe('B1')
    for (const t of s.turns) {
      expect(t.aiRu && t.aiKy).toBeTruthy()
      expect(t.hints.length).toBeGreaterThanOrEqual(3)
      expect(t.keywords.length).toBeGreaterThanOrEqual(3)
      for (const k of t.keywords) expect(k).toBe(k.toLowerCase())
    }
    expect(s.turns[3].ai).toMatch(/Rat finde ich nicht gut/)
    expect(s.turns[2].hints.join(' ')).toMatch(/würde ich/)
    expect(s.turns[2].hints.join(' ')).toMatch(/könnten/)
    expect(s.turns[2].hints.join(' ')).toMatch(/solltest/)
    expect(s.titleRu && s.titleKy).toBeTruthy()
  })
})

describe('writing: the mail to a friend and the opinion micro-task', () => {
  it('main task: informal, 75 words minimum, six expected elements, a model that meets every one, at least three Konjunktiv II forms and one reflexive Dativ phrase', () => {
    expect(MAIN).toMatchObject({ id: 'b1-wr-25-01', minWords: 75, level: 'B1', unit: 25, formal: false })
    expect(words(MAIN.model)).toBeGreaterThanOrEqual(75)
    expect(MAIN.mustInclude).toHaveLength(6)
    for (const m of MAIN.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky).toBeTruthy()
      expect(m.explain!.ky).not.toBe(m.explain!.ru)
      expect(
        m.patterns.some(p => MAIN.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect((MAIN.model.match(/\b(würde|solltest|könntest|wäre)\b/g) ?? []).length).toBeGreaterThanOrEqual(3)
    expect(MAIN.model).toMatch(/\bNimm dir\b/)
    expect(MAIN.model).toMatch(/^Lieber /)
    expect(MAIN.model).toMatch(/Liebe Grüße/)
    expect(MAIN.model).not.toMatch(/\bSie\b|\bIhnen\b/)
    for (const t of MAIN.tips) expect(t.ky).not.toBe(t.ru)
  })
  it('health-content safety: the task and the model give no diagnosis or medication, and point to a doctor (Hausarzt)', () => {
    const all = [MAIN.model, MAIN.situation.ru, MAIN.tips.map(t => t.ru).join(' ')].join(' ')
    expect(MAIN.model).not.toMatch(/diagnos|Medikament|Tablette|Antibiotik|Dosis|\bmg\b/i)
    expect(MAIN.model).toMatch(/Hausarzt/)
    expect(all).toMatch(/диагноз/)
  })
  it('the micro-task (kind "meinung") is a second, short writing task with opinion + reason + a word of the topic; its model meets every element', () => {
    expect(MICRO).toMatchObject({ id: 'b1-wr-25-02', minWords: 30, level: 'B1', unit: 25, formal: false })
    expect(META.microTasks).toEqual([{ kind: 'meinung', taskId: 'b1-wr-25-02' }])
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
    expect(MICRO.model).not.toMatch(/\bohne\b/i)
  })
  it('the writing tips tell the learner that the app checks only length and expected words and that quality is self-assessed (both tasks)', () => {
    for (const w of UNIT_25_WRITING) {
      expect(w.tips.map(t => t.ru).join(' ')).toMatch(/только объём и ожидаемые слова/)
      expect(w.tips.map(t => t.ky).join(' ')).toMatch(/көлөмдү жана күтүлгөн сөздөрдү гана/)
    }
  })
})

describe('exercises: answer keys are correct and unique', () => {
  it('10 handwritten exercises: 8 on the two concepts (4 + 4) + 2 recycled without a concept; types fill / choice / order; both languages everywhere', () => {
    expect(UNIT_25_EXERCISES).toHaveLength(10)
    expect(UNIT_25_EXERCISES.map(e => e.id)).toEqual(Array.from({ length: 10 }, (_, i) => `b1-ex-25-${String(i + 1).padStart(2, '0')}`))
    const withConcept = UNIT_25_EXERCISES.filter(e => e.concept)
    expect(withConcept).toHaveLength(8)
    expect(CONCEPTS.map(c => withConcept.filter(e => e.concept === c).length)).toEqual([4, 4])
    expect(UNIT_25_EXERCISES.filter(e => !e.concept).map(e => e.id)).toEqual(['b1-ex-25-09', 'b1-ex-25-10'])
    expect(['fill', 'choice', 'order'].map(t => UNIT_25_EXERCISES.filter(e => e.type === t).length)).toEqual([3, 5, 2])
    for (const e of UNIT_25_EXERCISES) {
      expect(e.why.ru && e.why.ky).toBeTruthy()
      expect(e.why.ky).not.toBe(e.why.ru)
      expect(e.promptRu && e.promptKy, e.id).toBeTruthy()
    }
  })
  it('every choice / fill item: 3 distinct options and the answer is among them exactly once; every order item is a true permutation that is not pre-solved', () => {
    for (const e of UNIT_25_EXERCISES) {
      if (e.type === 'order') {
        expect([...(e.words ?? [])].sort().join('|')).toBe(e.answer.split(' ').sort().join('|'))
        expect(e.words!.join(' ')).not.toBe(e.answer)
      } else {
        expect(e.options).toHaveLength(3)
        expect(new Set(e.options).size).toBe(3)
        expect(e.options!.filter(o => o === e.answer)).toHaveLength(1)
      }
    }
    for (const e of UNIT_25_EXERCISES.filter(x => x.type === 'fill')) expect(e.prompt.match(/___/g)).toHaveLength(1)
  })
  it('the text-level item (ex 04): three sentences per option, exactly one correct, and the wrong ones each contain a real learner error', () => {
    const e = UNIT_25_EXERCISES.find(x => x.id === 'b1-ex-25-04')!
    for (const o of e.options!) expect(sentences(o)).toHaveLength(3)
    const wrong = e.options!.filter(o => o !== e.answer)
    expect(wrong.some(o => /An deiner Stelle ich würde/.test(o))).toBe(true)
    expect(wrong.some(o => /ehrlich zu sein/.test(o))).toBe(true)
    expect(e.answer).not.toMatch(/ich würde|ehrlich zu sein/)
  })
  it('the Konjunktiv II and reflexive exercises really use their construction in the answer', () => {
    const by = (id: string) => UNIT_25_EXERCISES.find(e => e.id === id)!
    expect(by('b1-ex-25-01').answer).toBe('würde')
    expect(by('b1-ex-25-02').answer).toMatch(/solltest mehr Gemüse essen\.$/)
    expect(by('b1-ex-25-03').answer).toMatch(/könntest .* machen\.$/)
    expect(by('b1-ex-25-05').answer).toBe('mir')
    expect(by('b1-ex-25-06').answer).toMatch(/dir beim Sport wehgetan/)
    expect(by('b1-ex-25-07').answer).toMatch(/nimmt sich .* Zeit\.$/)
    expect(by('b1-ex-25-08').answer).toMatch(/merken uns den Weg/)
  })
})

describe('final test: structure, answer keys and scoring data', () => {
  it('15 questions = 8 grammar (3 Konjunktiv II, 2 reflexive, 3 recycled ↻) + 3 vocabulary + 4 reading, no listening; ≥ 2 gap-fill', () => {
    expect(UNIT_25_FINAL.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `b1-ft-25-${String(i + 1).padStart(2, '0')}`))
    const by = (s: string) => UNIT_25_FINAL.filter(q => q.skill === s)
    expect([by('grammar').length, by('vocabulary').length, by('reading').length, by('listening').length]).toEqual([8, 3, 4, 0])
    expect(by('grammar').filter(q => /___/.test(q.prompt)).length).toBeGreaterThanOrEqual(2)
    expect(CONCEPTS.map(c => by('grammar').filter(q => q.concept === c).length)).toEqual([3, 2])
    expect(
      by('grammar')
        .filter(q => q.concept && !CONCEPTS.includes(q.concept))
        .map(q => q.concept),
    ).toEqual(['a2-sollen-duerfen', 'a2-imperativ', 'b1-passiv-praesens'])
    expect(UNIT_25_TEST).toMatchObject({ id: 'unit-25', kind: 'topic', level: 'B1', unit: 25, size: 15 })
  })
  it('the recycled concepts really exist in earlier units (A2 Unit 14, B1 Unit 24)', () => {
    const owner = new Map(fullBundle().grammar.map(g => [g.id, g.unit]))
    for (const q of UNIT_25_FINAL.filter(x => x.concept && !CONCEPTS.includes(x.concept)))
      expect(owner.get(q.concept!)! < 25, q.concept).toBe(true)
  })
  it('options: 3 distinct each, the answer appears exactly once, both languages with an explanation; positions are 5 / 5 / 5, never three in a row', () => {
    const pos: number[] = []
    for (const q of UNIT_25_FINAL) {
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
  it('the advice question tests the A2/B1 contrast: exactly one option is a soft advice (solltest) and the others are instructions', () => {
    const q = UNIT_25_FINAL.find(x => x.id === 'b1-ft-25-02')!
    expect(q.options.filter(o => /solltest/.test(o))).toEqual([q.answer])
    expect(q.options.filter(o => /Du sollst/.test(o))).toHaveLength(1)
  })
  it('the final test shares no prompt (except the generic instruction line) and no answer with the revision exercises, and no prompt with another question', () => {
    const ex = new Set(UNIT_25_EXERCISES.flatMap(e => [e.prompt, e.answer]))
    const generic = new Set(['Welcher Satz ist richtig?', 'Bilde den Satz.'])
    for (const q of UNIT_25_FINAL) {
      if (!generic.has(q.prompt)) expect(ex.has(q.prompt), q.id).toBe(false)
      expect(ex.has(q.answer), q.id).toBe(false)
    }
    const prompts = UNIT_25_FINAL.map(q => q.prompt).filter(p => !generic.has(p))
    expect(new Set(prompts).size).toBe(prompts.length)
  })
  it('scoring data: every question has its answer among its options (a perfect run is 15/15) and the pass mark of the existing rule (70 %) is 11 of 15', () => {
    expect(UNIT_25_FINAL.filter(q => q.options.includes(q.answer)).length).toBe(15)
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
    expect(META.scenario.id).toBe('b1-sp-25-01')
  })
  it('the classification is the approved one: P/H and P-lim/M with a closed list; no pending expert decision for this unit (Unit 25 carries no ⚑)', () => {
    expect(META.concepts.map(c => [c.conceptId, c.proficiency, c.load, c.role])).toEqual([
      ['b1-konjunktiv2-ratschlaege', 'P', 'H', 'new'],
      ['b1-reflexive-dativ', 'P-lim', 'M', 'new'],
    ])
    expect(B1_CURRICULUM.units.find(u => u.unit === 25)!.concepts.some(c => c.expertReview)).toBe(false)
  })
  it('the topics "feelings" and "relationships" are evidenced by real items of the unit', () => {
    const items = new Set([
      ...UNIT_25_VOCABULARY.map(v => v.id),
      ...UNIT_25_READING.map(r => r.id),
      ...UNIT_25_LISTENING.map(l => l.id),
      ...UNIT_25_EXERCISES.map(e => e.id),
      ...UNIT_25_WRITING.map(w => w.id),
      'b1-sp-25-01',
    ])
    expect(META.topics!.map(t => t.topic)).toEqual(['feelings', 'relationships'])
    for (const t of META.topics!) {
      expect(t.itemIds.length).toBeGreaterThanOrEqual(5)
      for (const id of t.itemIds) expect(items.has(id), id).toBe(true)
    }
  })
  it('spaced revision: 4 words of Unit 24, 2 of Unit 22, 3 from A2 (Unit 14) — real, existing vocabulary ids', () => {
    const vocab = new Map(fullBundle().vocabulary.map(v => [v.id, v.unit]))
    expect(META.revision!.fromPrevious.map(id => vocab.get(id))).toEqual([24, 24, 24, 24])
    expect(META.revision!.fromThirdBack.map(id => vocab.get(id))).toEqual([22, 22])
    expect(META.revision!.fromA2.map(id => vocab.get(id))).toEqual([14, 14, 14])
  })
  it('the two kinds of vocabulary are kept apart: the 40 new items of Unit 25 vs. revision ids that are all earlier words', () => {
    const newIds = new Set(UNIT_25_VOCABULARY.map(v => v.id))
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
    walk(ALL_DATA(), 'unit25')
    expect(missing).toEqual([])
  })
  it('the Russian and the Kyrgyz are of comparable size (no half-translated string)', () => {
    const bad: string[] = []
    for (const v of UNIT_25_VOCABULARY) {
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
    ])
      expect(all, bad).not.toContain(bad)
  })
  it('every Kyrgyz string is written in Cyrillic (quoted German allowed) and the unit has a large Kyrgyz body', () => {
    const ky = kyTexts()
    expect(ky.length).toBeGreaterThan(250)
    expect(ky.filter(t => t.length > 25 && !/[А-Яа-яЁёҢңӨөҮү]/.test(t))).toEqual([])
  })
  it('the explanations of exercises and final-test questions differ between Russian and Kyrgyz', () => {
    for (const e of UNIT_25_EXERCISES) expect(e.why.ky).not.toBe(e.why.ru)
    for (const q of UNIT_25_FINAL) expect(q.why.ky).not.toBe(q.why.ru)
  })
})

describe('validator and assessment honesty', () => {
  it('the validator finds 0 errors and 0 warnings in the real bundle; the only review flag of Unit 25 is the missing human CEFR sign-off (no expert decision, no heuristic)', () => {
    const is = validateContent(fullBundle())
    expect(is.filter(i => i.severity === 'error')).toEqual([])
    expect(is.filter(i => i.severity === 'warning')).toEqual([])
    expect(is.filter(i => i.rule.startsWith('b1-') && i.severity !== 'review')).toEqual([])
    expect(
      is
        .filter(i => i.where === 'units:25' && i.severity === 'review')
        .map(i => i.rule)
        .sort(),
    ).toEqual(['beta-review-pending', 'beta-review-pending', 'cefr-signoff-missing']) // + the Beta flags (ru, ky) since the B1 Beta launch
    expect(
      is.filter(
        i =>
          /^(grammar:b1-(konjunktiv2|reflexive)|reading:b1-re-25|listening:b1-li-25|writing:b1-wr-25)/.test(i.where) &&
          i.severity === 'review',
      ),
    ).toEqual([])
  })
  it('the unit never claims a CEFR level, a certificate or an exam result', () => {
    const all = JSON.stringify(ALL_DATA(), (k, v) => (k === 'source' ? undefined : v))
    expect(all).not.toMatch(/zertifikat|certificate|сертификат|B1 erreicht|достигнут уровень|official/i)
    expect(all).not.toMatch(/\bCEFR\b/)
  })
  it('health-content safety: no German text of the unit names a diagnosis, a dose or a prescription drug as advice; the learner is pointed to a doctor or a counselling service', () => {
    for (const t of taught()) expect(t, t).not.toMatch(/Diagnose|Antibiotik|Dosis|\bmg\b|Krebs|Diabetes|Depression/i)
    const all = taught().join(' ')
    expect(all).toMatch(/mit dem Hausarzt sprechen/)
    expect(all).toMatch(/Beratungsstelle/)
    expect(UNIT_25_READING[0].body.join(' ')).toMatch(/ersetzen keinen Arztbesuch/)
    expect(UNIT_25_GRAMMAR[0].why.ru).toMatch(/врач/)
  })
  it('speaking and writing feedback is a checklist and a self-assessment: no numeric CEFR or score field in the unit data', () => {
    const all = JSON.stringify([UNIT_25_SPEAKING, UNIT_25_WRITING])
    expect(all).not.toMatch(/"(score|points|cefrScore|level_score)"/)
  })
  it('the provenance says the material is original and NOT reviewed', () => {
    for (const x of [...UNIT_25_GRAMMAR, ...UNIT_25_READING, ...UNIT_25_LISTENING, ...UNIT_25_SPEAKING, ...UNIT_25_WRITING]) {
      expect(x.source?.kind).toBe('authored')
      expect(x.source?.author).toMatch(/pending independent CEFR, Russian and Kyrgyz review/)
    }
  })
})
