/**
 * A1 REGRESSION ORACLE (A2 plan, Stage 0).
 *
 * Pure functions that compute three kinds of fingerprints of the CURRENT A1 product. They are shared by
 *   - scripts/regression/capture-a1.ts  (writes tests/regression/baselines/*.json — run once, on the pre-A2 code)
 *   - tests/regression/a1-baseline.test.ts (recomputes and compares — runs in CI forever)
 * so the baseline and the check can never drift apart.
 *
 *   1. content hashes   — the A1 data must stay byte-for-byte / value-for-value identical
 *   2. selector baseline — id lists for every A1 collection; the future catalog's `…Of('A1')` must equal them
 *   3. behaviour         — derived behaviour (progress maths, seeded daily/tests, tutor) that must not change for A1
 *
 * INTENTIONAL A1 CHANGES approved in the plan (do NOT "fix" the baseline silently — update it deliberately, with a reason):
 *   D-1  labs scoped by unit level   → `labsByItemLevel` is recorded as the CURRENT behaviour
 *   D-4  listening/reading option order is randomised → option ORDER of `lq-*` questions is normalised (sorted) below
 *   D-3  tutor localisation          → tutor replies are recorded for ru/ky/de as they are TODAY (ky/de answers are Russian)
 *   A1 Units 02–10 Vocabulary         → the approved source adds 225 entries; Unit 01 and all non-vocabulary content stay unchanged
 */
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { CASES, CASE_BY_CONCEPT, DEMO } from '../../src/data/cases'
import { ERROR_PATTERNS } from '../../src/data/errorPatterns'
import { EXERCISES, HANDWRITTEN_COUNT } from '../../src/data/exercises'
import { GRAMMAR, WHY_NOTES } from '../../src/data/grammar'
import { LISTENING } from '../../src/data/listening'
import { READING } from '../../src/data/reading'
import { REAL_LIFE, TESTS } from '../../src/data/reallife'
import { SPEAKING } from '../../src/data/speaking'
import { SECTIONS, UNITS, UNIT_SPEAKING } from '../../src/data/units'
import { CONJ_LABS, NEGATION_ITEMS, PLURAL_TYPES, PREP_POSITIONS, SENTENCE_LABS, TIMELINE } from '../../src/data/visuals'
import { VOCABULARY } from '../../src/data/vocabulary'
import { WRITING } from '../../src/data/writing'
import type { Lang, LanguageLevel, UserProgress } from '../../src/data/types'
import {
  articleConfusion,
  badges,
  currentUnit,
  dueWordIds,
  levelProgress,
  masteredCount,
  recommendations,
  requiredSections,
  skillPct,
  stageCounts,
  unitProgress,
  weakConcepts,
  xpLevel,
} from '../../src/features/progress/stats'
import {
  articleDrill,
  buildDaily,
  buildTest,
  conceptQuestions,
  listeningQuestions,
  unitReviewQuestions,
  type Question,
} from '../../src/features/tests/questions'
import { MockTutor } from '../../src/services/tutor'
import { defaultProgress } from '../../src/storage/defaults'
import { seeded } from '../../src/utils/random'

const root = join(__dirname, '../..')
const sha = (x: string) => createHash('sha256').update(x).digest('hex')
const json = (x: unknown) => JSON.stringify(x)

// ───────────────────────── 1. content hashes ─────────────────────────

/** Files that hold A1 content. They must stay byte-identical (CRLF normalised so Windows/Linux checkouts agree). */
export const A1_CONTENT_FILES = [
  'src/data/units.ts',
  'src/data/vocabulary.ts',
  'src/data/grammar.ts',
  'src/data/exercises.ts',
  'src/data/listening.ts',
  'src/data/reading.ts',
  'src/data/speaking.ts',
  'src/data/writing.ts',
  'src/data/reallife.ts',
  'src/data/cases.ts',
  'src/data/visuals.ts',
  'src/data/errorPatterns.ts',
] as const

export function computeContentHashes() {
  const values: Record<string, unknown> = {
    UNITS,
    SECTIONS,
    UNIT_SPEAKING,
    VOCABULARY,
    GRAMMAR,
    WHY_NOTES,
    EXERCISES,
    LISTENING,
    READING,
    SPEAKING,
    WRITING,
    REAL_LIFE,
    TESTS,
    CASES,
    CASE_BY_CONCEPT,
    DEMO,
    ERROR_PATTERNS,
    SENTENCE_LABS,
    CONJ_LABS,
    PLURAL_TYPES,
    PREP_POSITIONS,
    TIMELINE,
    NEGATION_ITEMS,
  }
  const semantic: Record<string, { count: number | null; sha256: string }> = {}
  for (const [k, v] of Object.entries(values)) semantic[k] = { count: Array.isArray(v) ? v.length : null, sha256: sha(json(v)) }
  const files: Record<string, string> = {}
  for (const f of A1_CONTENT_FILES) files[f] = sha(readFileSync(join(root, f), 'utf8').replace(/\r\n/g, '\n'))
  return { semantic, files }
}

// ───────────────────────── 2. selector baseline ─────────────────────────

const ids = (xs: { id: string | number }[]) => xs.map(x => x.id)

export function computeSelectors() {
  const byUnit = <T extends { unit: number }>(xs: T[]) => Object.fromEntries(UNITS.map(u => [u.id, xs.filter(x => x.unit === u.id).length]))
  // The labs filter by the ITEM's own level tag today (D-1 will change this to the parent unit's level — recorded as the old behaviour).
  const labs = (xs: { id: string; level: LanguageLevel }[]) =>
    Object.fromEntries((['A1', 'A2', 'B1'] as const).map(l => [l, xs.filter(x => x.level === l).map(x => x.id)]))
  return {
    units: UNITS.map(u => ({ id: u.id, level: u.level, grammarIds: u.grammarIds })),
    unitSpeaking: [...UNIT_SPEAKING],
    sections: [...SECTIONS],
    vocabularyIds: ids(VOCABULARY),
    vocabularyPerUnit: byUnit(VOCABULARY),
    grammarIds: GRAMMAR.map(g => ({ id: g.id, unit: g.unit, level: g.level })),
    exerciseIds: ids(EXERCISES),
    handwrittenCount: HANDWRITTEN_COUNT,
    exercisesPerUnit: byUnit(EXERCISES),
    listeningIds: LISTENING.map(l => ({ id: l.id, unit: l.unit, level: l.level })),
    readingIds: READING.map(r => ({ id: r.id, unit: r.unit, level: r.level })),
    writingIds: WRITING.map(w => ({ id: w.id, unit: w.unit, level: w.level })),
    speakingIds: SPEAKING.map(s => ({ id: s.id, level: s.level })),
    realLifeIds: REAL_LIFE.map(r => r.id),
    tests: TESTS.map(t => ({ id: t.id, kind: t.kind, level: t.level, unit: t.unit ?? null, size: t.size })),
    labsByItemLevel: { listening: labs(LISTENING), reading: labs(READING), writing: labs(WRITING) },
  }
}

// ───────────────────────── 3. behaviour ─────────────────────────

/** Runs fn with a deterministic Math.random (the A1 test builders take `Math.random` as their RNG). */
export function withSeed<T>(seed: string, fn: () => T): T {
  const orig = Math.random
  Math.random = seeded(seed)
  try {
    return fn()
  } finally {
    Math.random = orig
  }
}

/** D-4 (approved): the ORDER of listening/reading answer options is randomised per attempt. Everything else about the question is pinned. */
const orderRandomised = (q: { id: string }) => q.id.startsWith('lq-') || q.id.startsWith('rq-')
const normaliseOptions = <T extends { id: string; options?: string[] }>(q: T): T => ({
  ...q,
  options: q.options && orderRandomised(q) ? [...q.options].sort() : q.options,
})

/** Compact, diff-friendly fingerprint of a question list. Option order of listening/reading questions is normalised (D-4). */
function fingerprint(qs: Question[]) {
  const norm = qs.map(normaliseOptions)
  return { n: qs.length, ids: qs.map(q => q.id), answers: qs.map(q => q.answer), sha: sha(json(norm)) }
}

const FAR_FUTURE = 8.64e15 - 1

function scenarios(): Record<string, UserProgress> {
  const done = (units: number[]) => units.flatMap(u => requiredSections(u).map(s => `${u}:${s}`))
  const base = (over: Partial<UserProgress>): UserProgress => ({ ...defaultProgress(), ...over })
  const mastery = {
    [VOCABULARY[0].id]: { box: 1, due: 0, seen: 2, wrong: 0 },
    [VOCABULARY[1].id]: { box: 3, due: FAR_FUTURE, seen: 6, wrong: 1 },
    [VOCABULARY[2].id]: { box: 5, due: FAR_FUTURE, seen: 12, wrong: 0 },
    [VOCABULARY[30].id]: { box: 0, due: 0, seen: 1, wrong: 1 },
    [VOCABULARY[60].id]: { box: 2, due: 0, seen: 4, wrong: 2 },
    [VOCABULARY[120].id]: { box: 5, due: FAR_FUTURE, seen: 20, wrong: 0 },
  }
  const mistakes = [
    { at: 1, kind: 'article' as const, ref: 'art-v1-1' },
    { at: 2, kind: 'article' as const, ref: 'art-v1-2' },
    { at: 3, kind: 'article' as const, ref: 'art-v1-3' },
    { at: 4, kind: 'grammar' as const, ref: 'x', concept: 'dativ' },
    { at: 5, kind: 'grammar' as const, ref: 'y', concept: 'dativ' },
    { at: 6, kind: 'grammar' as const, ref: 'z', concept: 'perfekt' },
  ]
  return {
    empty: base({}),
    unit1: base({ xp: 120, activeDates: ['2020-01-01', '2020-01-02', '2020-01-03'], completed: done([1]) }),
    units1to9: base({ xp: 900, completed: done([1, 2, 3, 4, 5, 6, 7, 8, 9]) }),
    allA1: base({
      xp: 2400,
      completed: done(UNITS.map(u => u.id)),
      scores: { ...defaultProgress().scores, speaking: [80], writing: [70], listening: [90, 88], vocabulary: [60, 70] },
    }),
    mixed: base({
      xp: 410,
      completed: [
        '1:vocabulary',
        '1:grammar',
        '2:listening',
        '5:test',
        'topic:articles',
        'topic:modal',
        'topic:perfekt',
        'topic:dativ',
        'topic:akkusativ',
        'ex:abc',
      ],
      mastery,
      mistakes,
      activeDates: ['2020-02-01'],
      scores: { ...defaultProgress().scores, listening: [90, 95, 88], grammar: [50, 60], vocabulary: [40] },
    }),
  }
}

export function computeProgressBehaviour() {
  const sections = Object.fromEntries(UNITS.map(u => [u.id, requiredSections(u.id)]))
  const out: Record<string, unknown> = {}
  for (const [name, s] of Object.entries(scenarios())) {
    out[name] = {
      unitProgress: Object.fromEntries(UNITS.map(u => [u.id, unitProgress(s, u.id)])),
      levelProgress: levelProgress(s),
      currentUnit: currentUnit(s).id,
      badges: badges(s)
        .filter(b => b.earned)
        .map(b => b.id),
      recommendations: recommendations(s).map(r => `${r.id}|${r.to}|${r.arg ?? ''}`),
      stageCounts: stageCounts(s),
      dueWordIds: dueWordIds(s),
      masteredCount: masteredCount(s),
      weakConcepts: weakConcepts(s),
      articleConfusion: articleConfusion(s),
      skills: Object.fromEntries(
        (['vocabulary', 'grammar', 'listening', 'reading', 'writing', 'speaking'] as const).map(k => [k, skillPct(s, k)]),
      ),
      xpLevel: xpLevel(s.xp),
    }
  }
  return { requiredSections: sections, scenarios: out }
}

export function computeQuestionBehaviour() {
  const daily = Object.fromEntries(
    ['2026-01-01', '2026-02-14', '2026-03-31', '2026-07-04', '2026-11-16', '2027-01-01'].map(d => {
      const x = buildDaily(d)
      return [d, sha(json({ ...x, listening: x.listening.map(normaliseOptions) }))]
    }),
  )
  const dailyIds = Object.fromEntries(
    Object.keys(daily).map(d => {
      const x = buildDaily(d)
      return [d, [...x.vocab.map(q => q.id), ...x.grammar.map(q => q.id), ...x.listening.map(q => q.id), x.speaking.conceptId, x.phrase.de]]
    }),
  )
  const tests: Record<string, unknown> = {}
  for (const def of TESTS)
    for (const seed of ['s1', 's2', 's3']) tests[`${def.id}#${seed}`] = withSeed(`t-${def.id}-${seed}`, () => fingerprint(buildTest(def)))
  const review: Record<string, unknown> = {}
  for (const u of UNITS) review[`unit${u.id}`] = withSeed(`r-${u.id}`, () => fingerprint(unitReviewQuestions(u.id)))
  const concept: Record<string, unknown> = {}
  for (const g of GRAMMAR) concept[g.id] = withSeed(`c-${g.id}`, () => fingerprint(conceptQuestions(g.id)))
  // every A1 listening exercise as the app builds its questions, and every reading text as ReadingView built them at Stage 3
  // (that code was inline in the component; this is a verbatim copy of its mapping, so the new function is compared with the OLD one)
  const listeningAll = Object.fromEntries(LISTENING.map(ex => [ex.id, listeningQuestions(ex).map(normaliseOptions)]))
  const readingAll = Object.fromEntries(
    READING.map(text => [
      text.id,
      text.questions.map((q, i) => ({
        id: `rq-${text.id}-${i}`,
        type: 'choice',
        skill: 'reading',
        kind: 'grammar',
        prompt: q.q,
        options: [...q.options].sort(),
        answer: q.options[q.answer],
        why: { ru: text.body.join(' ') },
      })),
    ]),
  )
  return {
    listeningAll,
    readingAll,
    dailySha: daily,
    dailyIds,
    tests,
    unitReview: review,
    conceptQuestions: concept,
    articleDrill: withSeed('a1', () => fingerprint(articleDrill(10))),
  }
}

/** The tutor answers to a fixed script, per interface language and level, exactly as it behaves today. */
export async function computeTutorBehaviour() {
  const script = [
    'Привет',
    'Объясни Akkusativ',
    'Почему здесь Dativ?',
    'Дай пять примеров',
    'Расскажи про Perfekt',
    'Что такое Konjunktiv II?',
    'Объясни Passiv',
    'Relativsatz',
    'В чём разница между wissen и kennen?',
    'Исправь: Ich habe 25 Jahre',
    'Исправь: Ich gehe in die Schule und ich bin nicht müde',
    'Проверь меня',
    'неверный ответ',
    'Артикли der die das',
    'Plural',
    'weil',
    'Модальные глаголы',
    'Эмне үчүн Dativ?',
    'Genitiv',
    'Warum Dativ?',
    'Wie funktioniert Perfekt?',
  ]
  const realSetTimeout = globalThis.setTimeout
  ;(globalThis as { setTimeout: unknown }).setTimeout = (fn: () => void) => {
    fn()
    return 0
  }
  const out: Record<string, unknown> = {}
  try {
    for (const lang of ['ru', 'ky', 'de'] as Lang[]) {
      for (const level of ['A1', 'A2'] as LanguageLevel[]) {
        const tutor = new MockTutor()
        let lastConceptId: string | undefined
        const rows: unknown[] = []
        for (const q of script) {
          const r = await withSeedAsync(`tut-${lang}-${level}-${q}`, () => tutor.reply(q, { lang, level, lastConceptId }))
          if (r.conceptId) lastConceptId = r.conceptId
          rows.push({
            q,
            concept: r.conceptId ?? null,
            suggestions: r.suggestions?.length ?? 0,
            len: r.text.length,
            sha: sha(r.text),
            preview: r.text.slice(0, 48),
          })
        }
        out[`${lang}/${level}`] = rows
      }
    }
  } finally {
    ;(globalThis as { setTimeout: unknown }).setTimeout = realSetTimeout
  }
  return out
}

async function withSeedAsync<T>(seed: string, fn: () => Promise<T>): Promise<T> {
  const orig = Math.random
  Math.random = seeded(seed)
  try {
    return await fn()
  } finally {
    Math.random = orig
  }
}

export async function computeBehaviour() {
  return { progress: computeProgressBehaviour(), questions: computeQuestionBehaviour(), tutor: await computeTutorBehaviour() }
}
