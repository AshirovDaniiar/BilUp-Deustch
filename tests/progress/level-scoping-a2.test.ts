// @vitest-environment node
/**
 * Stage 3 — the FUTURE world: A2 has content. Fake A2 data is loaded when the A2 modules are imported (vi.mock), so the catalog's
 * static indexes and every consumer see it exactly as they will see real A2 content. Proves, with A2 present:
 *   - A1 results (progress, stages, daily, every A1 test, selectors) equal the Stage 0 baselines byte for byte,
 *   - each level's progress, stages, mistakes, daily challenge, tests and questions come from that level only.
 * The fake content is test-only and never ships (it exists only inside this file's module graph).
 */
import '../load-a2'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
// These tests describe the world in which A2 is PLANNED (hidden). The production registry now says Beta, so they set that world up explicitly.
import { beforeEach as __planned } from 'vitest'
import { COURSE as __COURSE } from '../../src/data/course'
__planned(() => {
  Object.assign(
    __COURSE.levels.find(l => l.id === 'A2')!,
    { status: 'planned', releasedLocales: [] },
  )
})

const F = vi.hoisted(() => {
  const word = (n: number, unit: number) => ({
    id: `v${unit}-${n}`,
    unit,
    pos: 'noun',
    article: 'der',
    de: `Wort${unit}x${n}`,
    plural: `Worte${n}`,
    ru: `слово ${unit}.${n}`,
    ky: `сөз ${unit}.${n}`,
    example: 'Beispiel',
    exampleRu: 'пример',
    related: [] as string[],
  })
  const vocab = [1, 2, 3, 4].map(n => word(n, 11)).concat([1, 2, 3].map(n => word(n, 12)))
  const ex = (n: number, unit: number) => ({
    id: `a2-ex-${n}`,
    type: 'fill',
    unit,
    concept: 'a2-concept',
    prompt: `A2 ___ ${n}`,
    answer: 'a',
    options: ['a', 'b', 'c'],
    why: { ru: 'r', ky: 'k' },
  })
  const handwritten = [ex(1, 11), ex(2, 11), ex(3, 12)]
  const articles = vocab.map(v => ({
    id: `art-${v.id}`,
    type: 'article',
    unit: v.unit,
    concept: 'a2-concept',
    prompt: v.de,
    promptRu: v.ru,
    options: ['der', 'die', 'das'],
    answer: 'der',
    why: { ru: 'r', ky: 'k' },
  }))
  const units = [11, 12].map(id => ({
    id,
    level: 'A2',
    title: `Unit ${id}`,
    subtitle: { ru: 'r', ky: 'k' },
    icon: '·',
    grammarIds: ['a2-concept'],
  }))
  const concept = {
    id: 'a2-concept',
    category: 'tenses',
    level: 'A2',
    unit: 11,
    title: { ru: 't', ky: 't' },
    summary: { ru: 's', ky: 's' },
    discover: { ru: 'd', ky: 'd' },
    why: { ru: 'w', ky: 'w' },
    when: [],
    examples: [],
    mistakes: [],
    reallife: [],
    visual: 'none',
    dialogue: [],
    speakPrompt: { prompt: { ru: 'Скажите A2', ky: 'A2 айт' }, sample: 'Ich lerne A2.', keywords: ['lerne'] },
  }
  const listening = [
    {
      id: 'a2-li-1',
      level: 'A2',
      unit: 11,
      title: 'A2 Dialog',
      lines: [{ speaker: 'A', text: 'Hallo A2', ru: 'Привет' }],
      questions: [{ q: 'q?', options: ['x', 'y'], answer: 0 }],
      keywords: [],
    },
  ]
  return { vocab, handwritten, articles, units, concept, listening }
})

vi.mock('../../src/data/a2/vocabulary', () => ({ A2_VOCABULARY: F.vocab }))
vi.mock('../../src/data/a2/exercises', () => ({ A2_EXERCISES: [...F.handwritten, ...F.articles] }))
vi.mock('../../src/data/a2/units', () => ({ A2_UNITS: F.units, A2_UNIT_SPEAKING: [] }))
vi.mock('../../src/data/a2/grammar', () => ({ A2_GRAMMAR: [F.concept], A2_WHY_NOTES: [] }))
vi.mock('../../src/data/a2/listening', () => ({ A2_LISTENING: F.listening }))

import { COURSE } from '../../src/data/course'
import { exercisesOf, unitsOfLevel, vocabularyOf } from '../../src/data/catalog'
import { TESTS } from '../../src/data/reallife'
import type { Question } from '../../src/features/tests/questions'
import type { TestDef, UserProgress } from '../../src/data/types'
import { VOCABULARY } from '../../src/data/vocabulary'
import {
  activeLevel,
  articleConfusion,
  badges,
  currentUnit,
  dueWordIds,
  levelProgress,
  masteredCount,
  recommendations,
  requiredSections,
  stageCounts,
  weakConcepts,
} from '../../src/features/progress/stats'
import {
  articleDrill,
  buildDaily,
  buildLevelDaily,
  buildTest,
  conceptQuestions,
  isDailyAvailable,
  isTestAvailable,
  unitReviewQuestions,
  vocabQuestion,
} from '../../src/features/tests/questions'
import { defaultProgress } from '../../src/storage/defaults'
import { computeProgressBehaviour, computeQuestionBehaviour, computeSelectors } from '../regression/a1-snapshot'

const state = (over: Partial<UserProgress> = {}): UserProgress => ({ ...defaultProgress(), ...over })
const a2Ids = new Set([...F.vocab.map(v => v.id), ...F.handwritten.map(e => e.id), ...F.articles.map(e => e.id), 'a2-li-1'])
const mastery = (ids: string[], box: number, due = 0) => Object.fromEntries(ids.map(id => [id, { box, due, seen: 5, wrong: 0 }]))
const baseline = (name: string) => JSON.parse(readFileSync(join(__dirname, '../regression/baselines', name), 'utf8'))
const a2Def = (kind: TestDef['kind'], unit?: number, size = 8): TestDef => ({
  id: `t-${kind}`,
  title: { ru: 't', ky: 't' },
  kind,
  level: 'A2',
  size,
  ...(unit ? { unit } : {}),
})
const touchesA2 = (q: Question) =>
  [q.id, q.vocabId, ...(q.options ?? [])].some(
    x =>
      x &&
      (a2Ids.has(String(x)) ||
        /^vq-v1[12]-/.test(String(x)) ||
        /^lq-a2-/.test(String(x)) ||
        /слово 1[12]\./.test(String(x)) ||
        /Wort1[12]x/.test(String(x))),
  )

describe('the fake A2 content really is loaded (guards the guards)', () => {
  it('A2 selectors see it; A1 selectors do not', () => {
    expect(vocabularyOf('A2').map(v => v.id)).toEqual(F.vocab.map(v => v.id))
    expect(unitsOfLevel('A2').map(u => u.id)).toEqual([11, 12])
    expect(exercisesOf('A2').length).toBe(F.handwritten.length + F.articles.length)
    expect(vocabularyOf('A1')).toBe(VOCABULARY)
  })
})

describe('A1 is untouched while A2 has content (Stage 0 baselines, byte for byte)', () => {
  it('progress maths, required sections, badges, recommendations, word stages', () => {
    expect(computeProgressBehaviour()).toEqual(baseline('a1-behaviour.json').progress)
  })
  it('seeded daily challenge, every A1 test, unit reviews, concept questions, article drills', () => {
    expect(computeQuestionBehaviour()).toEqual(baseline('a1-behaviour.json').questions)
  })
  it('selector baseline', () => {
    expect(computeSelectors()).toEqual(baseline('a1-selectors.json'))
  })
})

describe('progress is scoped by level', () => {
  it('level progress and current unit: completing A2 does not move A1, completing A1 does not move A2', () => {
    const a2Done = state({ completed: [11, 12].flatMap(u => requiredSections(u).map(s => `${u}:${s}`)) })
    expect(levelProgress(a2Done, 'A2')).toBe(100)
    expect(levelProgress(a2Done, 'A1')).toBe(0)
    expect(levelProgress(a2Done)).toBe(0) // legacy call = A1
    expect(currentUnit(a2Done).id).toBe(unitsOfLevel('A1')[0].id) // legacy one-argument form stays A1
    const a1Done = state({ completed: unitsOfLevel('A1').flatMap(u => requiredSections(u.id).map(s => `${u.id}:${s}`)) })
    expect(levelProgress(a1Done, 'A1')).toBe(100)
    expect(levelProgress(a1Done, 'A2')).toBe(0)
    expect(currentUnit(a1Done, 'A2')?.id).toBe(11)
  })

  it('current unit advances inside the level only', () => {
    const first = state({ completed: requiredSections(11).map(s => `11:${s}`) })
    expect(currentUnit(first, 'A2')?.id).toBe(12)
    const both = state({ completed: [11, 12].flatMap(u => requiredSections(u).map(s => `${u}:${s}`)) })
    expect(currentUnit(both, 'A2')?.id).toBe(12) // all done → last unit of THAT level
  })

  it('word stages: each level counts only its own words; A2 mastery cannot change A1 counts', () => {
    const a1Only = state({ mastery: mastery([VOCABULARY[0].id, VOCABULARY[1].id], 3) })
    const withA2 = state({
      mastery: {
        ...a1Only.mastery,
        ...mastery(
          F.vocab.map(v => v.id),
          5,
          1,
        ),
      },
    })
    expect(stageCounts(withA2, 'A1')).toEqual(stageCounts(a1Only, 'A1'))
    expect(dueWordIds(withA2, 'A1')).toEqual(dueWordIds(a1Only, 'A1'))
    expect(masteredCount(withA2, 'A1')).toBe(masteredCount(a1Only, 'A1'))
    const c2 = stageCounts(withA2, 'A2')
    expect(Object.values(c2).reduce((a, b) => a + b, 0)).toBe(F.vocab.length)
    expect(c2.mastered).toBe(F.vocab.length)
    expect(dueWordIds(withA2, 'A2').sort()).toEqual(F.vocab.map(v => v.id).sort())
    expect(masteredCount(withA2, 'A2')).toBe(F.vocab.length)
  })

  it('the "25 words" badge is a global achievement across levels; level views stay per level', () => {
    const a1 = VOCABULARY.slice(0, 20).map(v => v.id)
    const s = state({ mastery: mastery([...a1, ...F.vocab.map(v => v.id)], 5, 9e15) })
    expect(masteredCount(s, 'A1')).toBe(20)
    expect(masteredCount(s, 'A2')).toBe(F.vocab.length)
    expect(badges(s).find(b => b.id === 'words25')?.earned).toBe(true) // 20 + 7 = 27
    expect(badges(state({ mastery: mastery(a1, 5, 9e15) })).find(b => b.id === 'words25')?.earned).toBe(false)
  })

  it("mistakes and recommendations are attributed by level and each level's recent-mistake window is its own", () => {
    const a1Mistakes = [1, 2, 3].map(at => ({ at, kind: 'article' as const, ref: `art-v1-${at}` }))
    const a2Flood = Array.from({ length: 120 }, (_, i) => ({
      at: 100 + i,
      kind: i % 2 ? ('article' as const) : ('grammar' as const),
      ref: i % 2 ? 'art-v11-1' : 'x',
      concept: i % 2 ? undefined : 'a2-concept',
    }))
    const s = state({ mistakes: [...a1Mistakes, ...a2Flood] })
    // 120 later A2 mistakes must not push the A1 evidence out of A1's window
    expect(articleConfusion(s, 'A1')).toEqual({ count: 3, ids: ['v1-1', 'v1-2', 'v1-3'], active: true })
    expect(articleConfusion(s, 'A2').active).toBe(true)
    expect(articleConfusion(s, 'A2').ids.every(id => id === 'v11-1')).toBe(true)
    expect(weakConcepts(s, 2, 'A1')).toEqual([])
    // the level's own window is the last 80 A2 mistakes (40 of them are grammar mistakes)
    expect(weakConcepts(s, 2, 'A2')).toEqual([{ id: 'a2-concept', n: 40 }])
    expect(recommendations(s, 'A1').map(r => r.id)).toEqual(['articles'])
    expect(recommendations(s, 'A2').map(r => r.id)).toEqual(['articles', 'weak-a2-concept'])
    // and A1 recommendations equal those computed without any A2 mistakes
    expect(recommendations(s, 'A1')).toEqual(recommendations(state({ mistakes: a1Mistakes }), 'A1'))
  })

  it('the active level follows the registry: A2 only when it is visible', () => {
    const a2 = COURSE.levels.find(l => l.id === 'A2') as unknown as { status: string; releasedLocales: string[] }
    expect(activeLevel(state({ level: 'A2' }))).toBe('A1')
    try {
      a2.status = 'beta'
      a2.releasedLocales = ['ru'] // visible AND released for Russian (Stage 5: availability is per language)
      expect(activeLevel(state({ level: 'A2' }))).toBe('A2')
      expect(activeLevel(state({ level: 'A2', lang: 'ky' }))).toBe('A1')
      expect(activeLevel(state({ level: 'A1' }))).toBe('A1')
    } finally {
      a2.status = 'planned'
      a2.releasedLocales = []
    }
  })
})

describe('daily challenge is scoped by level', () => {
  const date = '2026-05-05'

  it('A2 daily is built from A2 content only and is deterministic', () => {
    expect(isDailyAvailable('A2')).toBe(true)
    const d = buildLevelDaily(date, 'A2')!
    expect(d).toEqual(buildLevelDaily(date, 'A2'))
    expect(d.vocab).toHaveLength(3)
    for (const q of [...d.vocab, ...d.grammar, ...d.listening]) expect(touchesA2(q), q.id).toBe(true)
    for (const q of d.vocab) for (const o of q.options ?? []) expect(/слово 1[12]\.|Wort1[12]x/.test(o), `${q.id}: ${o}`).toBe(true)
    expect(d.speaking.conceptId).toBe('a2-concept')
    expect(d.speaking.sample).toBe('Ich lerne A2.')
    expect(d.listening[0]?.id).toBe('lq-a2-li-1-0')
  })

  it('A1 daily is identical to the baseline and contains no A2 content', () => {
    expect(buildLevelDaily(date, 'A1')).toEqual(buildDaily(date))
    const d = buildDaily(date)
    for (const q of [...d.vocab, ...d.grammar, ...d.listening]) expect(touchesA2(q), q.id).toBe(false)
  })

  it('a level that supplies too little (e.g. no listening) gets no challenge instead of a patched-up one', () => {
    // A2 without any listening dialogue
    const l = F.listening.splice(0)
    try {
      expect(isDailyAvailable('A2')).toBe(false)
      expect(buildLevelDaily(date, 'A2')).toBeNull()
    } finally {
      F.listening.push(...l)
    }
    expect(isDailyAvailable('A2')).toBe(true)
  })
})

describe('tests and question pools are scoped by level', () => {
  it('A2 tests use A2 content only', () => {
    for (const kind of ['grammar', 'vocabulary', 'listening', 'level'] as const) {
      const def = a2Def(kind, undefined, 6)
      expect(isTestAvailable(def), kind).toBe(true)
      const qs = buildTest(def)
      expect(qs.length, kind).toBeGreaterThan(0)
      for (const q of qs) expect(touchesA2(q), `${kind}: ${q.id}`).toBe(true)
    }
    // Stage 9B: a unit that has an authored final test is tested with THOSE questions (ids a2-ft-11-NN), not with a random review draw
    const topic = buildTest(a2Def('topic', 11, 6))
    expect(topic.length).toBeGreaterThan(0)
    for (const q of topic) expect(touchesA2(q) || /^a2-ft-11-\d\d$/.test(q.id), q.id).toBe(true)
  })

  it('A2 placement uses level-relative bands over A2 content only', () => {
    const qs = buildTest(a2Def('placement'))
    expect(qs.length).toBeGreaterThan(0)
    for (const q of qs) expect(touchesA2(q), q.id).toBe(true)
  })

  it('every A1 test contains no A2 content and keeps its size', () => {
    for (const def of TESTS) {
      const qs = buildTest(def)
      expect(qs.length, def.id).toBeGreaterThan(0)
      for (const q of qs) expect(touchesA2(q), `${def.id}: ${q.id}`).toBe(false)
    }
    expect(buildTest(TESTS.find(t => t.id === 'placement') as TestDef)).toHaveLength(12)
  })

  it('a test on a unit of another level is empty (no cross-level borrowing in either direction)', () => {
    expect(buildTest(a2Def('topic', 1))).toEqual([])
    expect(buildTest({ ...a2Def('topic', 11), level: 'A1' })).toEqual([])
  })

  it('unit reviews, concept questions, article drills and vocabulary distractors stay inside their level', () => {
    for (const q of unitReviewQuestions(11, 10)) expect(touchesA2(q), q.id).toBe(true)
    for (const q of unitReviewQuestions(1, 10)) expect(touchesA2(q), q.id).toBe(false)
    const c2 = conceptQuestions('a2-concept', 5)
    expect(c2.length).toBeGreaterThan(0)
    for (const q of c2) expect(touchesA2(q), q.id).toBe(true)
    for (const q of conceptQuestions('akkusativ', 5)) expect(touchesA2(q), q.id).toBe(false)
    for (const q of articleDrill(10, undefined, 'A2')) expect(touchesA2(q), q.id).toBe(true)
    for (const q of articleDrill(10)) expect(touchesA2(q), q.id).toBe(false)
    for (let i = 0; i < 25; i++) {
      for (const o of vocabQuestion(VOCABULARY[i], i).options ?? []) expect(/слово 1[12]\.|Wort1[12]x/.test(o), o).toBe(false)
      for (const o of vocabQuestion(F.vocab[i % F.vocab.length] as never, i).options ?? [])
        expect(/слово 1[12]\.|Wort1[12]x/.test(o), o).toBe(true)
    }
  })
})
