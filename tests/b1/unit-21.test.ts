// @vitest-environment node
/**
 * B1 Unit 21 — Erlebnisse und Erinnerungen erzählen (Stage 3A). Checks the authored content against the approved curriculum: identity, the two approved
 * concepts, vocabulary (38–42, nothing already taught in A1/A2), text sizes, productive vs receptive scope, RU/KY completeness, assessment honesty, and the
 * catalog integration. B1 stays `planned` and invisible; no CEFR approval of any kind is implied (the content is an unreviewed AI-assisted draft).
 */
import { b1AuthoredUnits } from '../b1-authored'
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { lemmaKeys } from '../../scripts/content-validate/b1/lemma'
import { B1_CURRICULUM } from '../../scripts/content-validate/b1/curriculum'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_META } from '../../src/data/b1/meta'
import { B1_UNIT_PLAN } from '../../src/data/b1/registry'
import { UNIT_21_EXERCISES, UNIT_21_FINAL, UNIT_21_TEST } from '../../src/data/b1/unit21/assessment'
import { UNIT_21_GRAMMAR, UNIT_21_WHY_NOTES } from '../../src/data/b1/unit21/grammar'
import { UNIT_21_LISTENING, UNIT_21_READING, UNIT_21_SPEAKING, UNIT_21_WRITING } from '../../src/data/b1/unit21/texts'
import { UNIT_21 } from '../../src/data/b1/unit21/unit'
import { UNIT_21_VOCABULARY } from '../../src/data/b1/unit21/vocabulary'
import { courseLevel, availableLevels } from '../../src/data/course'
import {
  finalTestOfUnit,
  grammarForUnit,
  isLevelContentLoaded,
  registerLevelContent,
  speakingForUnit,
  topicTestOfUnit,
  vocabularyForUnit,
} from '../../src/data/catalog'

const words = (s: string) => s.split(/\s+/).filter(Boolean).length
const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).filter(x => x.trim())
const CONCEPTS = ['b1-praeteritum-erzaehlen', 'b1-temporale-konnektoren']

/** every German string of the unit (what a learner reads or hears) */
function germanTexts(): string[] {
  const out: string[] = []
  for (const r of UNIT_21_READING) out.push(...r.body)
  for (const l of UNIT_21_LISTENING) out.push(...l.lines.map(x => x.text))
  for (const v of UNIT_21_VOCABULARY) out.push(v.example)
  for (const g of UNIT_21_GRAMMAR) {
    out.push(...g.examples.map(x => x.de), ...g.reallife.map(x => x.de), ...g.dialogue.map(x => x.text), g.speakPrompt.sample)
  }
  for (const n of UNIT_21_WHY_NOTES) out.push(n.sentence, ...n.more.map(x => x.de))
  // prompts and answers only: the distractor options of a choice item are deliberately wrong forms and are never taught
  for (const e of UNIT_21_EXERCISES) out.push(e.prompt, e.answer)
  for (const q of UNIT_21_FINAL) out.push(q.prompt, q.answer)
  out.push(UNIT_21_WRITING[0].model)
  for (const s of UNIT_21_SPEAKING) out.push(...s.turns.flatMap(t => [t.ai, ...t.hints]))
  return out
}
// wrong forms shown on purpose as mistakes are excluded from the scope scan
const MISTAKES = new Set(UNIT_21_GRAMMAR.flatMap(g => g.mistakes.flatMap(m => [m.wrong, m.right])))

describe('identity and integration (B1 is a Beta for ru and ky)', () => {
  it('the unit equals its approved plan entry', () => {
    const plan = B1_UNIT_PLAN.find(p => p.id === 21)!
    expect(UNIT_21).toMatchObject({ id: 21, key: plan.key, title: plan.titleDe, level: 'B1' })
    expect(plan.key).toBe('b1-erlebnisse-erinnerungen')
    expect(plan.titleDe).toBe('Erlebnisse und Erinnerungen erzählen')
    expect(UNIT_21.grammarIds).toEqual(CONCEPTS)
  })
  it('the content module holds Unit 21 (and Unit 22), wired into the metadata, the tests and the speaking list', () => {
    expect(B1_CONTENT.legacyUnits.map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_META.map(m => m.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.tests[0]).toEqual(UNIT_21_TEST)
    expect(B1_CONTENT.unitSpeaking[0]).toBe('b1-sp-21-01')
    expect(B1_CONTENT.finalTests[0].unit).toBe(21)
  })
  it('B1 is a Beta: released for ru and ky only, offered to those interfaces and never to the German one', () => {
    expect(courseLevel('B1')).toMatchObject({ status: 'beta', releasedLocales: ['ru', 'ky'] })
    for (const lang of ['ru', 'ky'] as const) expect(availableLevels(lang)).toContain('B1')
    expect(availableLevels('de')).not.toContain('B1')
  })
  it('registered in the catalog, the unit is reachable through the standard selectors (and only through B1)', () => {
    registerLevelContent('B1', B1_CONTENT) // idempotent: the validator bundle has already registered it in this process
    expect(isLevelContentLoaded('B1')).toBe(true)
    expect(b1AuthoredUnits().map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(vocabularyForUnit(21)).toHaveLength(40)
    expect(grammarForUnit(21).map(g => g.id)).toEqual(CONCEPTS)
    expect(finalTestOfUnit(21)?.questions).toHaveLength(15)
    expect(topicTestOfUnit(21)).toMatchObject({ id: 'unit-21', level: 'B1', size: 15 })
    expect(speakingForUnit(21)).toBe('b1-sp-21-01')
  })
})

describe('grammar: only the two approved concepts', () => {
  it('exactly the approved ids, in order, owned by Unit 21, level B1', () => {
    expect(UNIT_21_GRAMMAR.map(g => g.id)).toEqual(CONCEPTS)
    for (const g of UNIT_21_GRAMMAR) expect(g).toMatchObject({ unit: 21, level: 'B1' })
    expect(B1_CURRICULUM.units[0].concepts.map(c => c.id)).toEqual(CONCEPTS)
  })
  it('every concept is complete: explanation, 5 examples, mistakes, real-life, dialogue, speaking prompt — in Russian and in Kyrgyz', () => {
    for (const g of UNIT_21_GRAMMAR) {
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
  it('the why-notes belong to the two concepts', () => {
    expect(UNIT_21_WHY_NOTES.length).toBeGreaterThanOrEqual(3)
    for (const n of UNIT_21_WHY_NOTES) expect(CONCEPTS).toContain(n.conceptId)
  })
  it('scope guard: nothing that belongs to a later unit (Plusquamperfekt, Passiv, obwohl/damit/trotzdem, Infinitiv mit zu, um … zu, Genitiv, Konjunktiv)', () => {
    const forbidden: [string, RegExp][] = [
      ['obwohl/damit/trotzdem', /\b(obwohl|damit|trotzdem)\b/i],
      ['Passiv (worden / wurde / wird + Partizip)', /\bworden\b|\b(wurde|wurden)\b|\bwird\b[^.!?]{0,30}\bge\w+(t|en)\b/i],
      [
        'Plusquamperfekt (hatte/war + Partizip II in einem Nebensatz)',
        /\b(als|nachdem|weil|dass)\b[^.!?,]{0,40}\b\w+t\s+hatte\b|\bnachdem\b[^.!?]*\b(hatte|hatten|waren|war)\b/i,
      ],
      ['Infinitiv mit zu', / zu [a-zäöüß]{3,}en[ ,.!?]|\bum\b[^.!?]{0,40}\bzu\b/],
      ['Konjunktiv II', /\b(hätte|hätten|wäre|wären|würde|würden)\b/i],
      ['Genitiv', /\b(des|eines)\s+[A-ZÄÖÜ]\w+s\b|\bwegen\b|\bstatt\b/],
    ]
    for (const t of germanTexts()) {
      if (MISTAKES.has(t)) continue
      for (const [name, re] of forbidden) expect(re.test(t), `${name}: "${t.slice(0, 80)}"`).toBe(false)
    }
  })
  it('Präteritum scope: none of the common strong-verb forms outside the closed list of 35 appears', () => {
    const outside =
      /\b(sprach|zog|stieg|ließ|trug|gewann|flog|hielt|nannte|rannte|verstand|erschrak|fing|lud|schien|sang|bat|bot|ritt|sprang|schwieg|wuchs|zwang|brach|trat|warf)\b/
    for (const t of germanTexts()) if (!MISTAKES.has(t)) expect(outside.test(t), t.slice(0, 80)).toBe(false)
    const list = B1_META[0].concepts[0].closedList!
    expect(list).toHaveLength(35)
    expect(new Set(list).size).toBe(35)
  })
})

describe('vocabulary: 40 new items, none already taught', () => {
  const b = fullBundle()
  const earlier = new Set(b.vocabulary.filter(v => v.unit <= 20).flatMap(v => lemmaKeys(v.de)))
  it('exactly 40 items (target 38–42), ids v21-1 … v21-40, all of unit 21, level B1 via the unit', () => {
    expect(UNIT_21_VOCABULARY).toHaveLength(40)
    expect(UNIT_21_VOCABULARY.map(v => v.id)).toEqual(Array.from({ length: 40 }, (_, i) => `v21-${i + 1}`))
    expect(UNIT_21_VOCABULARY.every(v => v.unit === 21)).toBe(true)
  })
  it('no lemma repeats an A1 or A2 headword, and none is listed twice', () => {
    const keys = UNIT_21_VOCABULARY.flatMap(v => lemmaKeys(v.de))
    expect(keys.filter(k => earlier.has(k))).toEqual([])
    expect(new Set(keys).size).toBe(keys.length)
  })
  it('every item has article/plural where a noun, a German example, and independent Russian and Kyrgyz translations of the word and the example', () => {
    for (const v of UNIT_21_VOCABULARY) {
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
      ) // the example really uses the word (stem check)
    }
  })
  it('the themes the curriculum names are present: feelings, time words, verbs of experience', () => {
    const de = UNIT_21_VOCABULARY.map(v => v.de)
    for (const w of [
      'erleichtert',
      'enttäuscht',
      'begeistert',
      'peinlich',
      'plötzlich',
      'inzwischen',
      'zunächst',
      'anschließend',
      'Erinnerung',
      'Kindheit',
      'Panne',
      'Unfall',
      'Begegnung',
      'verpassen',
      'sich erinnern',
    ])
      expect(de, w).toContain(w)
  })
})

describe('texts: progressive targets of the band for Units 21–22', () => {
  it('2 readings of 100–150 words and 2 listening scripts of 110–140 words', () => {
    expect(UNIT_21_READING).toHaveLength(2)
    expect(UNIT_21_LISTENING).toHaveLength(2)
    for (const r of UNIT_21_READING) {
      const n = r.body.reduce((a, p) => a + words(p), 0)
      expect(n, r.id).toBeGreaterThanOrEqual(100)
      expect(n, r.id).toBeLessThanOrEqual(150)
    }
    for (const l of UNIT_21_LISTENING) {
      const n = l.lines.reduce((a, x) => a + words(x.text), 0)
      expect(n, l.id).toBeGreaterThanOrEqual(110)
      expect(n, l.id).toBeLessThanOrEqual(140)
    }
  })
  it('sentences stay short (95th percentile ≤ 16, longest ≤ 22 words)', () => {
    const lens = [
      ...UNIT_21_READING.flatMap(r => r.body.flatMap(sentences)),
      ...UNIT_21_LISTENING.flatMap(l => l.lines.flatMap(x => sentences(x.text))),
    ]
      .map(words)
      .sort((a, b) => a - b)
    expect(lens[lens.length - 1]).toBeLessThanOrEqual(22)
    expect(lens[Math.ceil(0.95 * lens.length) - 1]).toBeLessThanOrEqual(16)
  })
  it('every dialogue line carries a Russian and a Kyrgyz translation; questions have 3 options and a valid answer; answer positions vary', () => {
    for (const l of UNIT_21_LISTENING) {
      for (const x of l.lines) {
        expect(x.ru).toBeTruthy()
        expect(x.ky).toBeTruthy()
        expect(x.ky).not.toBe(x.ru)
      }
    }
    const qs = [...UNIT_21_LISTENING.flatMap(l => l.questions), ...UNIT_21_READING.flatMap(r => r.questions)]
    for (const q of qs) {
      expect(q.options).toHaveLength(3)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(3)
    }
    expect(new Set(qs.map(q => q.answer)).size).toBe(3)
  })
  it('the reading glosses give Russian and Kyrgyz for every word', () => {
    for (const r of UNIT_21_READING) for (const g of r.gloss) expect(g.ky).not.toBe(g.ru)
  })
  it('listening is implemented through the existing browser text-to-speech lab: no audio file, no claim of verified playback; the script is shown as transcript', () => {
    for (const l of UNIT_21_LISTENING) expect(Object.keys(l)).not.toContain('audio')
    for (const q of UNIT_21_FINAL) expect(q.skill).not.toBe('listening') // no assessment item depends on unverified playback
  })
  it('speaking: one scenario of 5 turns with an unexpected element, hints and keywords, in German + Russian + Kyrgyz', () => {
    const [s] = UNIT_21_SPEAKING
    expect(s.turns).toHaveLength(5)
    expect(s.level).toBe('B1')
    for (const t of s.turns) {
      expect(t.aiRu && t.aiKy).toBeTruthy()
      expect(t.hints.length).toBeGreaterThanOrEqual(3)
      expect(t.keywords.length).toBeGreaterThanOrEqual(3)
    }
    expect(s.turns[1].ai).toMatch(/Wirklich\?/) // the interlocutor doubts
  })
  it('writing: one task, 70 words minimum, model text of at least that length, expected elements, tips in ru and ky', () => {
    const [w] = UNIT_21_WRITING
    expect(w).toMatchObject({ minWords: 70, level: 'B1', unit: 21, formal: false })
    expect(words(w.model)).toBeGreaterThanOrEqual(70)
    expect(w.mustInclude.length).toBeGreaterThanOrEqual(4)
    for (const t of w.tips) expect(t.ky).not.toBe(t.ru)
  })
})

describe('exercises and final test', () => {
  it('10 handwritten exercises: 8 on the two concepts + 2 recycled (A2) without a concept; both languages everywhere', () => {
    expect(UNIT_21_EXERCISES).toHaveLength(10)
    expect(UNIT_21_EXERCISES.map(e => e.id)).toEqual(Array.from({ length: 10 }, (_, i) => `b1-ex-21-${String(i + 1).padStart(2, '0')}`))
    const withConcept = UNIT_21_EXERCISES.filter(e => e.concept)
    expect(withConcept).toHaveLength(8)
    expect(withConcept.filter(e => e.concept === CONCEPTS[0])).toHaveLength(4)
    expect(withConcept.filter(e => e.concept === CONCEPTS[1])).toHaveLength(4)
    expect(UNIT_21_EXERCISES.filter(e => !e.concept).map(e => e.id)).toEqual(['b1-ex-21-09', 'b1-ex-21-10'])
    for (const e of UNIT_21_EXERCISES) {
      expect(e.why.ru && e.why.ky).toBeTruthy()
      expect(e.why.ky).not.toBe(e.why.ru)
      if (e.type !== 'choice') expect(e.promptRu && e.promptKy).toBeTruthy()
      if (e.type === 'order') expect([...(e.words ?? [])].sort().join('|')).toBe(e.answer.split(' ').sort().join('|'))
      else expect(e.options).toContain(e.answer)
    }
  })
  it('the final test: 15 questions = 8 grammar (6 on the concepts, 2 recycled ↻ A2) + 3 vocabulary + 4 reading, no listening; ≥ 2 gap-fill', () => {
    expect(UNIT_21_FINAL.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `b1-ft-21-${String(i + 1).padStart(2, '0')}`))
    const by = (s: string) => UNIT_21_FINAL.filter(q => q.skill === s)
    expect([by('grammar').length, by('vocabulary').length, by('reading').length, by('listening').length]).toEqual([8, 3, 4, 0])
    expect(by('grammar').filter(q => /___/.test(q.prompt)).length).toBeGreaterThanOrEqual(2)
    const recycled = by('grammar').filter(q => q.concept?.startsWith('a2-'))
    expect(recycled.map(q => q.concept)).toEqual(['a2-perfekt-erfahrungen', 'a2-wenn-als'])
    expect(UNIT_21_TEST).toMatchObject({ id: 'unit-21', kind: 'topic', level: 'B1', unit: 21, size: 15 })
  })
  it('options: 3 each, the answer is one of them, texts and answers differ, both languages with an explanation; positions are 5 / 5 / 5, never three in a row', () => {
    const pos: number[] = []
    for (const q of UNIT_21_FINAL) {
      expect(q.options).toHaveLength(3)
      expect(q.options).toContain(q.answer)
      expect(q.promptRu && q.promptKy).toBeTruthy()
      expect(q.why.ru && q.why.ky).toBeTruthy()
      expect(q.why.ky).not.toBe(q.why.ru)
      pos.push(q.options.indexOf(q.answer))
    }
    expect([0, 1, 2].map(p => pos.filter(x => x === p).length)).toEqual([5, 5, 5])
    for (let i = 2; i < pos.length; i++) expect(pos[i] === pos[i - 1] && pos[i] === pos[i - 2]).toBe(false)
  })
  it('the final test shares no prompt or answer sentence with the revision exercises', () => {
    const ex = new Set(UNIT_21_EXERCISES.flatMap(e => [e.prompt, e.answer]))
    const generic = new Set(['Welcher Satz ist richtig?', 'Bilde den Satz.']) // the instruction line of a task type is shared by design
    for (const q of UNIT_21_FINAL) {
      if (!generic.has(q.prompt)) expect(ex.has(q.prompt)).toBe(false)
      expect(ex.has(q.answer)).toBe(false)
    }
  })
})

describe('unit metadata, objectives and the spaced-revision set', () => {
  const m = B1_META[0]
  it('2–3 can-do goals and one objective per skill, each "Ich kann …" with independent Russian and Kyrgyz', () => {
    expect(m.canDo.length).toBeGreaterThanOrEqual(2)
    expect(m.canDo.length).toBeLessThanOrEqual(3)
    for (const t of [
      ...m.canDo,
      ...Object.values(m.objectives),
      m.differenceFromA2!,
      m.scenario.unexpectedElement,
      m.strands.strategyNote!,
      ...m.strands.repairChunks,
    ]) {
      expect(t.de && t.ru && t.ky).toBeTruthy()
      expect(t.ky).not.toBe(t.ru)
    }
    for (const t of [...m.canDo, ...Object.values(m.objectives)]) expect(t.de.startsWith('Ich kann')).toBe(true)
    expect(Object.keys(m.objectives)).toEqual(['lesen', 'hoeren', 'sprechen', 'schreiben'])
  })
  it('the classification is the approved one: P-lim/H for the Präteritum (closed list), P/M for the connectors; nothing is marked as expert-confirmed', () => {
    expect(m.concepts.map(c => [c.conceptId, c.proficiency, c.load, c.role])).toEqual([
      ['b1-praeteritum-erzaehlen', 'P-lim', 'H', 'new'],
      ['b1-temporale-konnektoren', 'P', 'M', 'new'],
    ])
    expect(B1_CURRICULUM.units[0].concepts.some(c => c.expertReview)).toBe(false) // Unit 21 carries no ⚑ decision
  })
  it('spaced revision: 4 words of Unit 20, 2 of Unit 18, 2 more from A2 — real, existing vocabulary ids', () => {
    const vocab = new Map(fullBundle().vocabulary.map(v => [v.id, v.unit]))
    expect(m.revision!.fromPrevious.map(id => vocab.get(id))).toEqual([20, 20, 20, 20])
    expect(m.revision!.fromThirdBack.map(id => vocab.get(id))).toEqual([18, 18])
    for (const id of m.revision!.fromA2) expect(vocab.get(id)! >= 11 && vocab.get(id)! <= 20).toBe(true)
    expect(m.recapConcepts!.length).toBeGreaterThanOrEqual(3)
  })
})

describe('validator and assessment honesty', () => {
  it('the validator finds 0 errors and 0 warnings in the real bundle, no B1 issue at all, and only the missing human CEFR sign-off for Unit 21', () => {
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
        .filter(i => i.where === 'units:21' && i.severity === 'review')
        .map(i => i.rule)
        .sort(),
    ).toEqual(['beta-review-pending', 'beta-review-pending', 'cefr-signoff-missing']) // + the Beta flags (ru, ky) since the B1 Beta launch
  })
  it('the unit never claims a CEFR level, a certificate or an exam result', () => {
    // the provenance field legitimately says "pending independent CEFR … review"; every learner-facing text is scanned
    const all = JSON.stringify(
      [
        UNIT_21,
        UNIT_21_GRAMMAR,
        UNIT_21_READING,
        UNIT_21_LISTENING,
        UNIT_21_SPEAKING,
        UNIT_21_WRITING,
        UNIT_21_EXERCISES,
        UNIT_21_FINAL,
        B1_META[0],
      ],
      (k, v) => (k === 'source' ? undefined : v),
    )
    expect(all).not.toMatch(/zertifikat|certificate|сертификат|B1 erreicht|достигнут уровень|official/i)
    expect(all).not.toMatch(/\bCEFR\b/) // case-sensitive: a field name such as differenceFromA2 contains the letters
  })
  it('the writing tips tell the learner that the app checks only length and expected words and that quality is self-assessed', () => {
    const tips = UNIT_21_WRITING[0].tips.map(t => t.ru).join(' ')
    expect(tips).toMatch(/только объём и ожидаемые слова/)
    expect(UNIT_21_WRITING[0].tips.map(t => t.ky).join(' ')).toMatch(/көлөмдү жана күтүлгөн сөздөрдү гана/)
  })
  it('the provenance says the material is original and NOT reviewed', () => {
    for (const x of [...UNIT_21_GRAMMAR, ...UNIT_21_READING, ...UNIT_21_LISTENING, ...UNIT_21_SPEAKING, ...UNIT_21_WRITING]) {
      expect(x.source?.kind).toBe('authored')
      expect(x.source?.author).toMatch(/pending independent CEFR, Russian and Kyrgyz review/)
    }
  })
})
