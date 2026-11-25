// @vitest-environment node
/**
 * Stage 3 — the world where A2 is planned and EMPTY (the state before any A2 unit was authored).
 * Every level-scoped function must give an explicit, safe answer for A2 and must never substitute A1 content or A1 progress.
 *
 * Since Stage 7A the real A2 modules hold the pilot unit 11, so this file mocks every A2 content module as empty: it keeps proving the
 * empty-level behaviour of the runtime logic (the state units 12–20 are in, and every level without content) with no production A2 data.
 */
import { describe, expect, it, vi } from 'vitest'
// These tests describe the world in which A2 is PLANNED (hidden). The production registry now says Beta, so they set that world up explicitly.
import { beforeEach as __planned } from 'vitest'
import { COURSE as __COURSE } from '../../src/data/course'
__planned(() => {
  Object.assign(
    __COURSE.levels.find(l => l.id === 'A2')!,
    { status: 'planned', releasedLocales: [] },
  )
  // B1 is a Beta since the B1 launch; these A1/A2 worlds describe the course WITHOUT it (B1 has its own tests)
  Object.assign(
    __COURSE.levels.find(l => l.id === 'B1')!,
    { status: 'planned', releasedLocales: [] },
  )
})

vi.mock('../../src/data/a2/units', () => ({ A2_UNITS: [], A2_UNIT_SPEAKING: [] }))
vi.mock('../../src/data/a2/vocabulary', () => ({ A2_VOCABULARY: [] }))
vi.mock('../../src/data/a2/grammar', () => ({ A2_GRAMMAR: [], A2_WHY_NOTES: [] }))
vi.mock('../../src/data/a2/exercises', () => ({ A2_EXERCISES: [] }))
vi.mock('../../src/data/a2/listening', () => ({ A2_LISTENING: [] }))
vi.mock('../../src/data/a2/reading', () => ({ A2_READING: [] }))
vi.mock('../../src/data/a2/speaking', () => ({ A2_SPEAKING: [] }))
vi.mock('../../src/data/a2/writing', () => ({ A2_WRITING: [] }))
vi.mock('../../src/data/a2/tests', () => ({ A2_TESTS: [], A2_FINAL_TESTS: [] }))
vi.mock('../../src/data/a2/instructions', () => ({ A2_INSTRUCTIONS: [] }))
import { COURSE, DEFAULT_LEVEL, isLevelVisible, resolveActiveLevel } from '../../src/data/course'
import { allUnits, exercisesOf, listeningOf, unitsOfLevel, vocabularyOf } from '../../src/data/catalog'
import type { LanguageLevel, TestDef, UserProgress } from '../../src/data/types'
import { LEVELS } from '../../src/data/types'
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
  placementBand,
  unitReviewQuestions,
  vocabQuestion,
} from '../../src/features/tests/questions'
import { VOCABULARY } from '../../src/data/vocabulary'
import { TESTS } from '../../src/data/reallife'
import { defaultProgress } from '../../src/storage/defaults'

const state = (over: Partial<UserProgress> = {}): UserProgress => ({ ...defaultProgress(), ...over })
const everyA1Section = () => unitsOfLevel('A1').flatMap(u => requiredSections(u.id).map(s => `${u.id}:${s}`))

describe('active level resolution (the single place a planned level is handled)', () => {
  it('DEFAULT_LEVEL is the first released level, A1', () => {
    expect(DEFAULT_LEVEL).toBe('A1')
  })

  it('A1 stays A1; planned A2 and levels without a course entry cannot be active — the STORED preference is left untouched', () => {
    expect(resolveActiveLevel('A1')).toBe('A1')
    expect(isLevelVisible('A2')).toBe(false)
    for (const l of ['A2', 'B1', 'B2', 'C1'] as LanguageLevel[]) expect(resolveActiveLevel(l)).toBe('A1')
    const s = state({ level: 'A2' })
    expect(activeLevel(s)).toBe('A1')
    expect(s.level).toBe('A2') // reading the active level never rewrites the stored preference
  })

  it('a visible A2 would resolve to A2 (policy follows the course registry, not a literal)', () => {
    const a2 = COURSE.levels.find(l => l.id === 'A2') as unknown as { status: string; releasedLocales: string[] }
    const before = { status: a2.status, locales: a2.releasedLocales }
    try {
      a2.status = 'beta'
      a2.releasedLocales = ['ru']
      expect(resolveActiveLevel('A2')).toBe('A2') // visibility only
      expect(activeLevel(state({ level: 'A2' }))).toBe('A2') // visible AND released for the learner's language (ru)
      expect(activeLevel(state({ level: 'A2', lang: 'ky' }))).toBe('A1') // visible, but not released for Kyrgyz
      expect(resolveActiveLevel('A2', 'ky')).toBe('A1')
    } finally {
      a2.status = before.status
      a2.releasedLocales = before.locales
    }
    expect(resolveActiveLevel('A2')).toBe('A1')
  })
})

describe('progress for an empty A2 is explicit and isolated from A1', () => {
  const doneEverythingInA1 = state({
    completed: everyA1Section(),
    mastery: Object.fromEntries(VOCABULARY.map(v => [v.id, { box: 5, due: 0, seen: 9, wrong: 0 }])),
  })

  it('A2 has no units: level progress 0, no current unit (undefined, not an A1 unit)', () => {
    expect(unitsOfLevel('A2')).toHaveLength(0)
    expect(levelProgress(doneEverythingInA1, 'A2')).toBe(0)
    expect(currentUnit(doneEverythingInA1, 'A2')).toBeUndefined()
  })

  it('A1 progress is unaffected by anything done in A1 being "also" visible to A2', () => {
    expect(levelProgress(doneEverythingInA1, 'A1')).toBe(100)
    expect(levelProgress(doneEverythingInA1)).toBe(100) // legacy call style = A1
    expect(currentUnit(doneEverythingInA1).id).toBe(110) // Unit 10 is now the last authored A1 unit; empty containers are never current
  })

  it('A2 word stages are all zero and nothing is due — even when every A1 word is mastered/due', () => {
    const c = stageCounts(doneEverythingInA1, 'A2')
    expect(Object.values(c).reduce((a, b) => a + b, 0)).toBe(0)
    expect(dueWordIds(doneEverythingInA1, 'A2')).toEqual([])
    expect(masteredCount(doneEverythingInA1, 'A2')).toBe(0)
    // and the A1 view still sees all A1 words
    expect(Object.values(stageCounts(doneEverythingInA1, 'A1')).reduce((a, b) => a + b, 0)).toBe(VOCABULARY.length)
  })

  it('a legacy (one-argument) call means A1, equal to the explicit A1 call', () => {
    const s = state({ mastery: { [VOCABULARY[0].id]: { box: 1, due: 0, seen: 2, wrong: 0 } } })
    expect(stageCounts(s)).toEqual(stageCounts(s, 'A1'))
    expect(dueWordIds(s)).toEqual(dueWordIds(s, 'A1'))
    expect(masteredCount(s)).toBe(masteredCount(s, 'A1'))
    expect(recommendations(s)).toEqual(recommendations(s, 'A1'))
    expect(weakConcepts(s)).toEqual(weakConcepts(s, 2, 'A1'))
    expect(articleConfusion(s)).toEqual(articleConfusion(s, 'A1'))
  })

  it('stored A1 mistakes never show up for A2; unresolvable legacy evidence keeps belonging to A1 (as it always has)', () => {
    const mistakes = [
      { at: 1, kind: 'article' as const, ref: 'art-v1-1' },
      { at: 2, kind: 'article' as const, ref: 'art-v1-2' },
      { at: 3, kind: 'article' as const, ref: 'art-legacy-3' }, // unresolvable ref → A1
      { at: 4, kind: 'grammar' as const, ref: 'x', concept: 'dativ' },
      { at: 5, kind: 'grammar' as const, ref: 'y', concept: 'dativ' },
      { at: 6, kind: 'grammar' as const, ref: 'z', concept: 'not-a-known-concept' }, // → A1, but has no A1 concept to recommend
    ]
    const s = state({ mistakes })
    expect(articleConfusion(s, 'A1')).toEqual({ count: 3, ids: ['v1-1', 'v1-2', 'legacy-3'], active: true })
    expect(articleConfusion(s, 'A2')).toEqual({ count: 0, ids: [], active: false })
    expect(weakConcepts(s, 2, 'A1')).toEqual([{ id: 'dativ', n: 2 }])
    expect(weakConcepts(s, 1, 'A2')).toEqual([])
    expect(recommendations(s, 'A2')).toEqual([])
    expect(recommendations(s, 'A1').map(r => r.id)).toEqual(['articles', 'weak-dativ'])
  })

  it('global achievements still count across levels (badges are not level progress)', () => {
    const b = badges(doneEverythingInA1)
    expect(b.find(x => x.id === 'unit')?.earned).toBe(true)
    expect(b.find(x => x.id === 'words25')?.earned).toBe(true)
  })
})

describe('an empty A2 pool is handled explicitly: no challenge, no test, no questions — never A1 content', () => {
  const a2def = (kind: TestDef['kind'], unit?: number): TestDef => ({
    id: `x-${kind}`,
    title: { ru: 't', ky: 't' },
    kind,
    level: 'A2',
    size: 8,
    ...(unit ? { unit } : {}),
  })

  it('daily challenge: unavailable for A2, still available and unchanged for A1', () => {
    expect(isDailyAvailable('A2')).toBe(false)
    expect(buildLevelDaily('2026-03-03', 'A2')).toBeNull()
    expect(isDailyAvailable('A1')).toBe(true)
    expect(buildLevelDaily('2026-03-03', 'A1')).toEqual(buildDaily('2026-03-03'))
    for (const l of ['B1', 'B2', 'C1'] as LanguageLevel[]) expect(buildLevelDaily('2026-03-03', l)).toBeNull()
  })

  it('every kind of A2 test is unavailable and builds to an empty list', () => {
    for (const kind of ['placement', 'level', 'grammar', 'vocabulary', 'listening'] as const) {
      expect(isTestAvailable(a2def(kind)), kind).toBe(false)
      expect(buildTest(a2def(kind)), kind).toEqual([])
    }
    expect(isTestAvailable(a2def('topic', 11))).toBe(false)
    expect(buildTest(a2def('topic', 11))).toEqual([])
  })

  it('a test never borrows content across levels: A2 test on an A1 unit and A1 test on an A2 unit are both empty', () => {
    expect(buildTest(a2def('topic', 1))).toEqual([])
    expect(buildTest({ ...a2def('topic', 11), level: 'A1' })).toEqual([])
  })

  it('all existing A1 tests are available', () => {
    for (const def of TESTS) expect(isTestAvailable(def), def.id).toBe(true)
  })

  const noun = VOCABULARY.find(v => v.article)!.id

  it('article drills, unit reviews and concept questions for A2 / unknown targets are empty', () => {
    expect(articleDrill(5, undefined, 'A2')).toEqual([])
    expect(articleDrill(5, [noun], 'A2')).toEqual([])
    expect(articleDrill(5, [noun])).toHaveLength(1) // default = A1
    expect(unitReviewQuestions(11, 10)).toEqual([])
    expect(unitReviewQuestions(99, 10)).toEqual([])
    expect(conceptQuestions('no-such-concept')).toEqual([])
    expect(conceptQuestions('akkusativ', 5).length).toBeGreaterThan(0)
  })

  it('there is no A2 content to borrow from: the A2 pools themselves are empty', () => {
    expect(vocabularyOf('A2')).toHaveLength(0)
    expect(exercisesOf('A2')).toHaveLength(0)
    expect(listeningOf('A2')).toHaveLength(0)
    expect(allUnits.every(u => u.level === 'A1')).toBe(true)
  })

  it("vocabulary distractors come from the word's own level (an A1 word never gets a foreign option)", () => {
    const a1Meanings = new Set(VOCABULARY.map(v => v.ru))
    for (let i = 0; i < 40; i++) for (const o of vocabQuestion(VOCABULARY[i], 0).options ?? []) expect(a1Meanings.has(o)).toBe(true)
    // a word that belongs to no known unit gets NO distractors (explicit empty pool, not A1's)
    const orphan = { ...VOCABULARY[0], id: 'v99-1', unit: 99 }
    expect(vocabQuestion(orphan, 0).options).toEqual([orphan.ru])
  })
})

describe('placement', () => {
  it('the recommendation bands are exactly the previous thresholds (A1 behaviour unchanged)', () => {
    const legacy = (p: number) => (p < 35 ? 'A1-start' : p < 75 ? 'A1-A2' : 'A2')
    for (let p = 0; p <= 100; p++) expect(placementBand(p)).toBe(legacy(p))
  })

  it('the A1 placement is 12 questions and does not depend on any other level', () => {
    const def = TESTS.find(t => t.id === 'placement') as TestDef
    expect(def.level).toBe('A1')
    expect(buildTest(def)).toHaveLength(12)
  })

  it('no A2 placement or level test definition exists — A2 assessment is not claimed', () => {
    expect(TESTS.filter(t => t.level !== 'A1')).toEqual([])
    expect(LEVELS.includes('A2')).toBe(true)
  })
})
