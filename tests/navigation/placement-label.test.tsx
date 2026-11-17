/**
 * Stage 5 — the placement result used to name "A2" ("A1 · A2", "A2 →") although A2 is not available (audit finding V-11).
 * While the next level is not available to the learner the upper bands read as A1; once it is available the original wording returns.
 * The band thresholds themselves are unchanged (see level-scoping-empty.test.ts). Only buildTest is replaced, to know the answers.
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppProvider } from '../../src/app/store'
import { testIndex } from '../../src/data/catalog'
import { COURSE } from '../../src/data/course'
import type { Lang } from '../../src/data/types'
import { dictionaries } from '../../src/i18n'
import type { Question } from '../../src/features/tests/questions'
import { TestRunnerPage } from '../../src/screens/PracticeScreens'
import { defaultProgress } from '../../src/storage/defaults'
import { KEY } from '../helpers'

const mocked = vi.hoisted(() => ({ questions: [] as Question[] }))
vi.mock('../../src/features/tests/questions', async importOriginal => ({
  ...(await importOriginal<typeof import('../../src/features/tests/questions')>()),
  buildTest: () => mocked.questions,
}))

const q = (i: number): Question => ({
  id: `pl-${i}`,
  type: 'choice',
  prompt: `Frage ${i}`,
  options: ['richtig', 'falsch'],
  answer: 'richtig',
  skill: 'grammar',
  kind: 'grammar',
})
const a2 = () => COURSE.levels.find(l => l.id === 'A2') as unknown as { status: string; releasedLocales: string[] }

beforeEach(() => {
  window.scrollTo = () => undefined
  localStorage.clear()
  localStorage.setItem(KEY, JSON.stringify(defaultProgress()))
  mocked.questions = [0, 1, 2, 3].map(q)
})
afterEach(() => {
  cleanup()
  ;(testIndex as Map<string, unknown>).delete('placement-a2')
  Object.assign(a2(), { status: 'planned', releasedLocales: [] })
})

/** answers the first `right` questions correctly, the rest wrongly, and returns the placement result card text */
async function placement(right: number, lang: Lang = 'ru') {
  const { continue: next, finish } = dictionaries[lang]
  render(
    <AppProvider>
      <TestRunnerPage id="placement" />
    </AppProvider>,
  )
  for (let i = 0; i < 4; i++) {
    fireEvent.click(screen.getByRole('button', { name: i < right ? 'richtig' : 'falsch' }))
    await act(async () => {})
    fireEvent.click(screen.getByRole('button', { name: i === 3 ? finish : next }))
    await act(async () => {})
  }
  return document.body.textContent ?? ''
}

describe('placement result wording', () => {
  it('A2 not available: never names A2 — 0 % → "A1 · start", 50 % → "A1", 100 % → "A1 ✓"', async () => {
    expect(await placement(0)).toContain('A1 · start')
    cleanup()
    const mid = await placement(2)
    expect(mid).toContain('A1')
    expect(mid).not.toMatch(/A1 · A2|A2/)
    cleanup()
    const top = await placement(4)
    expect(top).toContain('A1 ✓')
    expect(top).not.toMatch(/A2/)
  })

  it('Stage 9B: A2 visible to the learner but NO A2 placement test yet: the A1 placement still never claims A2', async () => {
    Object.assign(a2(), { status: 'beta', releasedLocales: ['ru'] })
    const mid = await placement(2)
    expect(mid).not.toMatch(/A2/)
    cleanup()
    const top = await placement(4)
    expect(top).toContain('A1 ✓')
    expect(top).not.toMatch(/A2/)
  })

  it('A2 available to the learner AND an A2 placement test exists: the original wording ("A1 · A2" in the middle band, "A2 →" at the top)', async () => {
    Object.assign(a2(), { status: 'beta', releasedLocales: ['ru'] })
    ;(testIndex as Map<string, unknown>).set('placement-a2', { id: 'placement-a2', kind: 'placement', level: 'A2', size: 24 })
    expect(await placement(2)).toContain('A1 · A2')
    cleanup()
    expect(await placement(4)).toContain('A2 →')
  })

  it("A2 visible but not released for the learner's language (Kyrgyz): still never named", async () => {
    Object.assign(a2(), { status: 'beta', releasedLocales: ['ru'] })
    localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang: 'ky' }))
    expect(await placement(4, 'ky')).not.toMatch(/A2/)
  })
})
