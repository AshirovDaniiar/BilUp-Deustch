import { act, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { AppProvider, useApp } from '../../src/app/store'
import { TESTS } from '../../src/data/reallife'
import { unitProgress } from '../../src/features/progress/stats'
import { PASS_MESSAGES } from '../../src/features/tests/pass-messages'
import { PassNote } from '../../src/features/tests/PassNote'
import type { Question } from '../../src/features/tests/questions'
import { QuizRunner, type QuizResult } from '../../src/features/tests/QuizRunner'
import { TestRunnerPage } from '../../src/screens/PracticeScreens'
import { KEYS } from '../../src/storage/persistence'
import { storedRecord } from '../helpers'

const mocked = vi.hoisted(() => ({ questions: [] as Question[] }))
// Only buildTest is replaced (so the answers are known); TestRunnerPage, QuizPage, QuizRunner, PassNote and the engine are the real ones.
vi.mock('../../src/features/tests/questions', async importOriginal => ({
  ...(await importOriginal<typeof import('../../src/features/tests/questions')>()),
  buildTest: () => mocked.questions,
}))

const q = (i: number): Question => ({
  id: `thr-${i}`,
  type: 'choice',
  prompt: `Frage ${i}`,
  options: ['richtig', 'falsch'],
  answer: 'richtig',
  skill: 'grammar',
  kind: 'grammar',
})
const questions = (n: number) => Array.from({ length: n }, (_, i) => q(i))

let ctx!: ReturnType<typeof useApp>
const Probe = () => {
  ctx = useApp()
  return null
}

/** Answers every question in the real runner: the first `correct` right, the rest wrong; presses continue / finish each time. */
async function play(total: number, correct: number) {
  for (let i = 0; i < total; i++) {
    fireEvent.click(screen.getByRole('button', { name: i < correct ? 'richtig' : 'falsch' }))
    await act(async () => {})
    fireEvent.click(screen.getByRole('button', { name: i + 1 >= total ? 'Завершить' : 'Продолжить' }))
    await act(async () => {})
  }
}

/** The real QuizRunner for an assessment / review, followed by the real PassNote. */
function Harness({ n, kind, completes }: { n: number; kind: 'assessment' | 'review'; completes: string }) {
  const [result, setResult] = useState<QuizResult | null>(null)
  const [qs] = useState(() => questions(n))
  return result ? (
    <PassNote result={result} kind={kind} completionKey={completes} />
  ) : (
    <QuizRunner
      questions={qs}
      onDone={setResult}
      activity={{ id: kind === 'review' ? completes : `test:thr-${n}`, kind, completes: [completes] }}
    />
  )
}
const mount = (ui: React.ReactElement) =>
  render(
    <AppProvider>
      <Probe />
      {ui}
    </AppProvider>,
  )
const M = PASS_MESSAGES.ru
const notYet = (got: number) => M.notYet.replace('{need}', '70').replace('{got}', String(got))

describe('assessment threshold through the REAL QuizRunner (03 §12: 70 %)', () => {
  it('0 % → the section is NOT completed, no bonus, the note states the exact requirement', async () => {
    mount(<Harness n={10} kind="assessment" completes="3:test" />)
    await play(10, 0)
    expect(ctx.state.completed).toEqual([])
    expect(ctx.state.xp).toBe(0) // wrong answers earn nothing, and there is no completion bonus
    expect(screen.getByTestId('pass-note').getAttribute('data-passed')).toBe('false')
    expect(screen.getByTestId('pass-note').textContent).toBe(notYet(0))
    // the failed attempt is still part of the history
    expect(storedRecord().activity.completions['3:test']).toMatchObject({ firstPassedAt: null, attempts: 1, bestScore: 0 })
  })

  it('6 / 10 = 60 % → not completed, the note shows 60', async () => {
    mount(<Harness n={10} kind="assessment" completes="3:test" />)
    await play(10, 6)
    expect(ctx.state.completed).toEqual([])
    expect(screen.getByTestId('pass-note').textContent).toBe(notYet(60))
    expect(ctx.state.xp).toBe(6 * 5) // item credit for the 6 correct answers, but no 10-XP completion bonus
  })

  it('69 / 100 = 69 % → NOT completed (boundary just below)', async () => {
    mount(<Harness n={100} kind="assessment" completes="3:test" />)
    await play(100, 69)
    expect(ctx.state.completed).toEqual([])
    expect(screen.getByTestId('pass-note').textContent).toBe(notYet(69))
  }, 60_000)

  it('70 / 100 = 70 % → completed (boundary exactly at the threshold); the note confirms', async () => {
    mount(<Harness n={100} kind="assessment" completes="3:test" />)
    await play(100, 70)
    expect(ctx.state.completed).toEqual(['3:test'])
    expect(screen.getByTestId('pass-note').getAttribute('data-passed')).toBe('true')
    expect(screen.getByTestId('pass-note').textContent).toBe(M.done)
    expect(ctx.state.xp).toBe(70 * 5 + 10) // items + completion bonus
  }, 60_000)

  it('10 / 10 → completed, bonus paid exactly once', async () => {
    mount(<Harness n={10} kind="assessment" completes="3:test" />)
    await play(10, 10)
    expect(ctx.state.completed).toEqual(['3:test'])
    expect(ctx.state.xp).toBe(10 * 5 + 10)
  })

  it('a unit review follows the same rule', async () => {
    mount(<Harness n={10} kind="review" completes="3:review" />)
    await play(10, 5)
    expect(ctx.state.completed).toEqual([])
    expect(screen.getByTestId('pass-note').textContent).toBe(notYet(50))
  })
})

describe('PassNote accuracy', () => {
  const grandfathered = JSON.stringify({ xp: 100, completed: ['3:test'], name: 'Mira' })

  it('a failed repeat of a section that was already completed (legacy / earlier pass) claims nothing and never un-completes', async () => {
    localStorage.setItem(KEYS.legacy, grandfathered)
    mount(<Harness n={10} kind="assessment" completes="3:test" />)
    expect(ctx.state.completed).toEqual(['3:test'])
    await play(10, 2)
    expect(screen.queryByTestId('pass-note')).toBeNull()
    expect(ctx.state.completed).toEqual(['3:test'])
    expect(storedRecord().activity.completions['3:test'].source).toBe('migration') // grandfathered, not re-judged
  })

  it('a passing repeat of an already completed section still shows the confirmation', async () => {
    localStorage.setItem(KEYS.legacy, grandfathered)
    mount(<Harness n={10} kind="assessment" completes="3:test" />)
    await play(10, 9)
    expect(screen.getByTestId('pass-note').textContent).toBe(M.done)
  })

  it('every language has both texts', () => {
    for (const lang of ['ru', 'ky', 'de'] as const) {
      expect(PASS_MESSAGES[lang].notYet).toContain('{need}')
      expect(PASS_MESSAGES[lang].notYet).toContain('{got}')
      expect(PASS_MESSAGES[lang].done.length).toBeGreaterThan(3)
    }
  })
})

describe('the real TestRunnerPage (unit test of the A1 course) with known questions', () => {
  const def = TESTS.find(t => t.unit !== undefined)!
  const unit = def.unit as number

  it('fails at 0 %: the unit’s test section stays open, the attempt is stored in the test history, a PassNote explains', async () => {
    mocked.questions = questions(10)
    mount(<TestRunnerPage id={def.id} />)
    await play(10, 0)
    expect(ctx.state.completed).not.toContain(`${unit}:test`)
    expect(unitProgress(ctx.state, unit).done).toBe(0)
    expect(ctx.state.tests).toHaveLength(1)
    expect(ctx.state.tests[0]).toMatchObject({ id: def.id, pct: 0 })
    expect(screen.getByTestId('pass-note').textContent).toBe(notYet(0))
  })

  it('retrying and passing completes it (retry builds a new attempt); a later failure never un-completes', async () => {
    mocked.questions = questions(10)
    mount(<TestRunnerPage id={def.id} />)
    await play(10, 3)
    expect(ctx.state.completed).not.toContain(`${unit}:test`)
    fireEvent.click(screen.getByRole('button', { name: 'Ещё раз' }))
    await play(10, 9)
    expect(ctx.state.completed).toContain(`${unit}:test`)
    expect(unitProgress(ctx.state, unit).done).toBe(1)
    fireEvent.click(screen.getByRole('button', { name: 'Ещё раз' }))
    await play(10, 0)
    expect(ctx.state.completed).toContain(`${unit}:test`)
    expect(ctx.state.tests).toHaveLength(3)
    expect(storedRecord().activity.completions[`${unit}:test`].attempts).toBe(3)
  })
})
