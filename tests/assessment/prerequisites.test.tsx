// @vitest-environment jsdom
/**
 * Stage 9B — assessment prerequisites: (1) A2 unit tests use the authored 15 questions, (2) a direct A2 test link resolves its level without loaded
 * content, (3) Kyrgyz prompts and explanations are shown strictly, (4) placement / level results are protected from eviction, (5) the A1 placement never
 * claims A2 without an A2 placement test (see tests/navigation/placement-label.test.tsx). Speech is covered in tests/assessment/speech.test.tsx.
 * This file loads A2 through `tests/load-a2.ts` (a test-only synchronous load; it never changes visibility).
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../load-a2'
import { AppProvider } from '../../src/app/store'
import { levelOfRoute, levelOfTestId, levelsToLoad } from '../../src/app/routeAccess'
import { finalTestOfUnit, testIndex, testsOf } from '../../src/data/catalog'
import { COURSE } from '../../src/data/course'
import type { TestResult } from '../../src/data/types'
import { QuizRunner } from '../../src/features/tests/QuizRunner'
import { buildTest, finalTestQuestions, fromExercise, type Question } from '../../src/features/tests/questions'
import { dictionaries } from '../../src/i18n'
import { defaultProgress } from '../../src/storage/defaults'
import { LIMITS, capTests, isProtectedTest, sanitizeProgress } from '../../src/storage/validate'
import { freshCore } from '../../src/storage/core'
import { mergeCores } from '../../src/storage/merge'
import { KEY } from '../helpers'
import { exercisesForUnit } from '../../src/data/catalog'

const route = (path: string) => ({ path, parts: path.split('/').filter(Boolean), query: new URLSearchParams() }) as never
const a2 = () => COURSE.levels.find(l => l.id === 'A2') as unknown as { status: string; releasedLocales: string[] }

describe('1 · A2 unit tests are the authored 15 questions', () => {
  for (let u = 11; u <= 20; u++) {
    it(`unit-${u}: the 15 authored questions, in authored order, with the authored texts and answers`, () => {
      const def = testsOf('A2').find(t => t.id === `unit-${u}`)!
      const authored = finalTestOfUnit(u)!.questions
      const built = buildTest(def)
      expect(built).toHaveLength(15)
      expect(built.map(q => q.id)).toEqual(authored.map(q => q.id))
      built.forEach((q, i) => {
        const a = authored[i]
        expect(q.prompt).toBe(a.prompt)
        expect(q.answer).toBe(a.answer)
        expect([...(q.options ?? [])].sort()).toEqual([...a.options].sort())
        expect(q.options).toContain(q.answer)
        expect(q.promptRu).toBe(a.promptRu)
        expect(q.promptKy).toBe(a.promptKy)
        expect(q.strict).toBe(true)
        expect(q.type).toBe(a.prompt.includes('___') ? 'fill' : 'choice')
        expect(q.unit).toBe(u)
      })
    })
  }
  it('is not the random review draw: no vocabulary-question ids, and a unit-review quiz has a different shape', () => {
    const built = buildTest(testsOf('A2').find(t => t.id === 'unit-11')!)
    expect(built.some(q => q.id.startsWith('vq-'))).toBe(false)
  })
  it('the order of the options is randomised per attempt, never the content (the authored sources are not modified)', () => {
    const authored = finalTestOfUnit(11)!.questions
    const before = JSON.stringify(authored)
    const orders = new Set<string>()
    for (let i = 0; i < 12; i++) orders.add(finalTestQuestions(11, authored, `seed-${i}`)[0].options!.join('|'))
    expect(orders.size).toBeGreaterThan(1)
    expect(finalTestQuestions(11, authored, 'same')[3].options).toEqual(finalTestQuestions(11, authored, 'same')[3].options)
    expect(JSON.stringify(authored)).toBe(before)
  })
  it('maps skills and audio: reading counts as a grammar-kind mistake, listening keeps its audio text', () => {
    const q = finalTestQuestions(11, [
      { id: 'x1', prompt: 'p', options: ['a', 'b', 'c'], answer: 'a', skill: 'listening', audio: 'Hallo Welt' },
      { id: 'x2', prompt: 'p ___', options: ['a', 'b', 'c'], answer: 'a', skill: 'reading' },
    ])
    expect(q[0]).toMatchObject({ skill: 'listening', kind: 'listening', audio: 'Hallo Welt', type: 'choice' })
    expect(q[1]).toMatchObject({ skill: 'reading', kind: 'grammar', type: 'fill' })
  })
  it('A1 unit tests are unchanged: still the random unit review (8 questions) — no authored final test exists for A1', () => {
    const def = testIndex.get('unit-1')!
    expect(finalTestOfUnit(1)).toBeUndefined()
    const built = buildTest(def)
    expect(built.length).toBe(def.size)
    expect(built.every(q => q.strict === undefined)).toBe(true)
  })
})

describe('2 · direct A2 test links resolve their level before the content is loaded', () => {
  it('levelOfTestId: unit-N by the unit range, the fixed A2 assessment ids, A1 ids through the catalog, unknown ids undefined', () => {
    expect(levelOfTestId('unit-11')).toBe('A2')
    expect(levelOfTestId('unit-20')).toBe('A2')
    expect(levelOfTestId('unit-3')).toBe('A1')
    expect(levelOfTestId('unit-21')).toBeUndefined()
    expect(levelOfTestId('unit-x')).toBeUndefined()
    expect(levelOfTestId('level-a2')).toBe('A2')
    expect(levelOfTestId('placement-a2')).toBe('A2')
    expect(levelOfTestId('placement')).toBe('A1')
    expect(levelOfTestId('level-a1')).toBe('A1')
    expect(levelOfTestId('nope')).toBeUndefined()
  })
  it("the route /practice/tests/<id> belongs to the id's level; levelsToLoad requests the A2 chunk only when A2 is available for the language", () => {
    expect(levelOfRoute(route('/practice/tests/unit-12'))).toBe('A2')
    expect(levelOfRoute(route('/practice/tests/level-a2'))).toBe('A2')
    expect(levelOfRoute(route('/practice/tests/unit-2'))).toBe('A1')
    expect(levelOfRoute(route('/practice/tests'))).toBeUndefined()
    try {
      Object.assign(a2(), { status: 'planned', releasedLocales: [] })
      expect(levelsToLoad(route('/practice/tests/unit-12'), 'ru', 'A1')).toEqual([]) // planned: invisible, nothing is loaded
    } finally {
      Object.assign(a2(), { status: 'planned', releasedLocales: [] })
    }
  })
})

describe('3 · Kyrgyz and Russian prompts and explanations, strictly', () => {
  const q = (over: Partial<Question> = {}): Question => ({
    id: 'k1',
    type: 'choice',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    strict: true,
    options: ['richtig', 'falsch'],
    answer: 'richtig',
    why: { ru: 'Объяснение по-русски.', ky: 'Кыргызча түшүндүрмө.' },
    skill: 'grammar',
    kind: 'grammar',
    ...over,
  })
  beforeEach(() => {
    window.scrollTo = () => undefined
    localStorage.clear()
  })
  afterEach(() => cleanup())
  async function show(lang: 'ru' | 'ky' | 'de', question: Question) {
    localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang }))
    render(
      <AppProvider>
        <QuizRunner questions={[question]} onDone={() => undefined} activity={{ id: 'x', kind: 'assessment' }} />
      </AppProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'falsch' }))
    await act(async () => {})
    return document.body.textContent ?? ''
  }
  it('a Kyrgyz learner sees the Kyrgyz prompt and explanation and NO Russian', async () => {
    const text = await show('ky', q())
    expect(text).toContain('Кайсы сүйлөм туура?')
    expect(text).toContain('Кыргызча түшүндүрмө.')
    expect(text).not.toContain('Какое предложение правильное?')
    expect(text).not.toContain('Объяснение по-русски.')
  })
  it('a Russian learner sees the Russian prompt and explanation and NO Kyrgyz', async () => {
    const text = await show('ru', q())
    expect(text).toContain('Какое предложение правильное?')
    expect(text).toContain('Объяснение по-русски.')
    expect(text).not.toContain('Кайсы сүйлөм туура?')
    expect(text).not.toContain('Кыргызча түшүндүрмө.')
  })
  it('a missing Kyrgyz text is NOT replaced by the Russian one (strict questions: nothing is shown)', async () => {
    const text = await show('ky', q({ promptKy: undefined, why: { ru: 'Объяснение по-русски.' } }))
    expect(text).not.toContain('Какое предложение правильное?')
    expect(text).not.toContain('Объяснение по-русски.')
  })
  it('the German interface never receives an A2 Russian / Kyrgyz text', async () => {
    const text = await show('de', q())
    expect(text).not.toContain('Какое предложение правильное?')
    expect(text).not.toContain('Кайсы сүйлөм туура?')
  })
  it('legacy (A1) questions keep their Russian hint and explanation for every learner, as before', async () => {
    const text = await show('ky', q({ strict: undefined, promptKy: undefined, why: { ru: 'Объяснение по-русски.' } }))
    expect(text).toContain('Какое предложение правильное?')
    expect(text).toContain('Объяснение по-русски.')
  })
  it('every authored A2 final-test question carries both languages, so strict rendering always has a text', () => {
    for (let u = 11; u <= 20; u++)
      for (const x of finalTestQuestions(u, finalTestOfUnit(u)!.questions)) {
        expect(x.promptRu?.trim(), x.id).toBeTruthy()
        expect(x.promptKy?.trim(), x.id).toBeTruthy()
        expect(x.why?.ru?.trim(), x.id).toBeTruthy()
        expect(x.why?.ky?.trim(), x.id).toBeTruthy()
      }
  })
  it('A2 revision exercises become strict questions with a Kyrgyz prompt; A1 exercises are not changed', () => {
    const a2q = fromExercise(exercisesForUnit(11)[0])
    expect(a2q.strict).toBe(true)
    expect(a2q.promptKy).toBeTruthy()
    const a1q = fromExercise(exercisesForUnit(1)[0])
    expect(a1q.strict).toBeUndefined()
    expect(a1q.promptKy).toBeUndefined()
  })
  it('the new interface string exists in all three languages and the three texts differ', () => {
    const k = 'audioUnavailable' as const
    const v = (['ru', 'ky', 'de'] as const).map(l => dictionaries[l][k])
    expect(v.every(Boolean)).toBe(true)
    expect(new Set(v).size).toBe(3)
  })
})

describe('4 · placement and level results are protected from eviction by ordinary results', () => {
  const r = (id: string, at: number, kind?: TestResult['kind']): TestResult => ({
    id,
    at,
    pct: 50,
    weak: [],
    strong: [],
    ...(kind ? { kind } : {}),
  })
  const ordinary = (n: number, from = 0) => Array.from({ length: n }, (_, i) => r(`unit-${(i % 10) + 1}`, from + i))
  it('with no more than the cap nothing is removed (identical to the old behaviour)', () => {
    const list = [...ordinary(30), r('placement', 100), r('level-a1', 101)]
    expect(capTests(list)).toEqual(list)
  })
  it('ordinary results keep the last 50; placement and level results are not counted and survive 200 later ordinary results', () => {
    const list = [r('placement', 1), r('level-a1', 2), r('level-a2', 3, 'level'), r('placement-a2', 4, 'placement'), ...ordinary(200, 10)]
    const out = capTests(list)
    expect(out.filter(t => !isProtectedTest(t))).toHaveLength(LIMITS.tests)
    expect(out.slice(0, 4).map(t => t.id)).toEqual(['placement', 'level-a1', 'level-a2', 'placement-a2'])
    expect(out.map(t => t.at)).toEqual([...out.map(t => t.at)].sort((a, b) => a - b)) // chronological order kept
  })
  it('only the last 10 results of each protected id are kept (bounded storage)', () => {
    const list = [...Array.from({ length: 25 }, (_, i) => r('level-a2', i, 'level')), ...ordinary(5, 100)]
    const kept = capTests(list).filter(t => t.id === 'level-a2')
    expect(kept).toHaveLength(LIMITS.protectedTestsPerId)
    expect(kept[0].at).toBe(15)
  })
  it('a protected result is recognised by kind or by its fixed id', () => {
    expect(isProtectedTest({ id: 'x', kind: 'level' })).toBe(true)
    expect(isProtectedTest({ id: 'placement-a2' })).toBe(true)
    expect(isProtectedTest({ id: 'level-a1' })).toBe(true)
    expect(isProtectedTest({ id: 'unit-11', kind: 'topic' })).toBe(false)
    expect(isProtectedTest({ id: 'grammar' })).toBe(false)
  })
  it('optional fields (kind, parts, outcome, blueprint) survive validation; invalid ones are dropped without losing the result; old records are unchanged', () => {
    const input = {
      ...defaultProgress(),
      tests: [
        {
          id: 'level-a2',
          at: 5,
          pct: 72,
          weak: [],
          strong: [],
          kind: 'level',
          parts: { A: [6, 8], B: [10, 14] },
          outcome: 'passed',
          blueprint: 'v1',
        },
        { id: 'unit-3', at: 6, pct: 60, weak: ['x'], strong: [] },
        { id: 'placement-a2', at: 7, pct: 50, weak: [], strong: [], kind: 'nonsense', parts: { A: [9, 3] }, outcome: 5, blueprint: '' },
      ],
    }
    const out = sanitizeProgress(input)!.value.tests
    expect(out[0]).toEqual({
      id: 'level-a2',
      at: 5,
      pct: 72,
      weak: [],
      strong: [],
      kind: 'level',
      parts: { A: [6, 8], B: [10, 14] },
      outcome: 'passed',
      blueprint: 'v1',
    })
    expect(out[1]).toEqual({ id: 'unit-3', at: 6, pct: 60, weak: ['x'], strong: [] })
    expect(out[2]).toEqual({ id: 'placement-a2', at: 7, pct: 50, weak: [], strong: [] })
  })
  it('merging two devices keeps the protected results although the other device has 60 ordinary ones', () => {
    const ca = freshCore()
    const cb = freshCore()
    ca.progress = { ...ca.progress, tests: [r('level-a2', 1, 'level')] }
    cb.progress = { ...cb.progress, tests: ordinary(60, 10) }
    const merged = mergeCores(ca, cb, 1_760_000_000_000).progress
    expect(merged.tests.some(t => t.id === 'level-a2')).toBe(true)
    expect(merged.tests.filter(t => !isProtectedTest(t))).toHaveLength(LIMITS.tests)
  })
})

describe('boundaries', () => {
  it('A2 stays planned and invisible; no A2 assessment ids exist yet (no level test, no placement test was authored)', () => {
    expect(a2()).toMatchObject({ status: 'planned', releasedLocales: [] })
    expect(testIndex.has('level-a2')).toBe(false)
    expect(testIndex.has('placement-a2')).toBe(false)
  })
})
