/**
 * Stage 4 — answer order through the REAL screens and quiz runner: stable while an attempt lasts (re-renders, other interaction),
 * renewed by "retry" (a new attempt), and scoring/feedback unaffected. The only mocked piece is the attempt-seed source, so the
 * seeds — and therefore the orders — are known and no test depends on chance.
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppProvider } from '../src/app/store'
import { LISTENING } from '../src/data/listening'
import { READING } from '../src/data/reading'
import { ListeningPlayer } from '../src/features/listening/ListeningLab'
import { ReadingView } from '../src/features/reading/ReadingLab'
import { listeningQuestions, readingQuestions, type Question } from '../src/features/tests/questions'
import { QuizRunner, type QuizResult } from '../src/features/tests/QuizRunner'

const seeds = vi.hoisted(() => ({ queue: [] as string[], fallback: 'fallback-seed' }))
vi.mock('../src/utils/random', async importOriginal => ({
  ...(await importOriginal<typeof import('../src/utils/random')>()),
  newSeed: () => seeds.queue.shift() ?? seeds.fallback,
}))

afterEach(() => {
  cleanup()
  seeds.queue = []
})

const optionsOnScreen = (container: HTMLElement) =>
  [...container.querySelectorAll('.quiz__options .option, .option')].map(e => e.textContent ?? '')
const click = async (el: Element) => {
  fireEvent.click(el)
  await act(async () => {})
}
const clickOption = async (container: HTMLElement, text: string) => {
  const el = [...container.querySelectorAll('.option')].find(e => e.textContent === text)
  if (!el) throw new Error(`option "${text}" not on screen: ${optionsOnScreen(container).join(' | ')}`)
  await click(el)
}
const buttonByText = (re: RegExp) => screen.getByRole('button', { name: re })
const next = async (last: boolean) => click(buttonByText(last ? /Завершить/ : /Продолжить/))

/** two attempt seeds whose orders differ for at least one question of the exercise */
function differingSeeds(build: (s: string) => Question[]): [string, string] {
  const key = (s: string) =>
    build(s)
      .map(q => q.options?.join('|'))
      .join('#')
  for (let i = 0; i < 50; i++) for (let j = i + 1; j < 50; j++) if (key(`ui-${i}`) !== key(`ui-${j}`)) return [`ui-${i}`, `ui-${j}`]
  throw new Error('no differing seeds')
}

describe('ReadingView', () => {
  const text = READING.find(r => r.id === 're01')!
  const build = (s: string) => readingQuestions(text, s)
  const [A, B] = differingSeeds(build)
  const mount = () =>
    render(
      <AppProvider>
        <ReadingView id={text.id} />
      </AppProvider>,
    )

  it("shows the attempt's order, keeps it through re-renders and other interaction, and renews it on retry; scoring is by text", async () => {
    seeds.queue = [A, B]
    const { container } = mount()
    await click(buttonByText(/Ответьте на вопросы/))

    // attempt A, question 1
    const q1 = build(A)[0]
    expect(optionsOnScreen(container)).toEqual(q1.options)

    // re-render: tap a word of the text (opens the word sheet and re-renders the whole view)
    await click(container.querySelector('.tapword') as Element)
    expect(optionsOnScreen(container)).toEqual(q1.options)

    // answer question 1 correctly by TEXT whatever its position is; question 2 wrongly
    await clickOption(container, q1.answer)
    expect(container.querySelector('.option.is-right')?.textContent).toBe(q1.answer)
    await next(false)
    const q2 = build(A)[1]
    expect(optionsOnScreen(container)).toEqual(q2.options)
    const wrong = q2.options!.find(o => o !== q2.answer)!
    await clickOption(container, wrong)
    expect(container.querySelector('.option.is-wrong')?.textContent).toBe(wrong)
    await next(true)
    expect(screen.getByText(/1 \/ 2/)).toBeTruthy() // 1 correct of 2: position never mattered

    // retry = new attempt = new seed = (for these seeds) a different order
    await click(buttonByText(/Ещё раз/))
    await click(buttonByText(/Ответьте на вопросы/))
    expect(optionsOnScreen(container)).toEqual(build(B)[0].options)
    expect(build(B).map(q => q.options?.join('|'))).not.toEqual(build(A).map(q => q.options?.join('|')))
    // the option SET is unchanged across attempts
    expect([...optionsOnScreen(container)].sort()).toEqual([...(q1.options ?? [])].sort())
  })
})

describe('ListeningPlayer', () => {
  const ex = LISTENING.find(l => l.id === 'li01')!
  const build = (s: string) => listeningQuestions(ex, s)
  const [A, B] = differingSeeds(build)
  const mount = () =>
    render(
      <AppProvider>
        <ListeningPlayer id={ex.id} />
      </AppProvider>,
    )

  it('same guarantees: stable during the attempt, renewed by retry, correct by text', async () => {
    seeds.queue = [A, B]
    const view = mount()
    const { container } = view
    await click(buttonByText(/Ответьте на вопросы/))

    const q1 = build(A)[0]
    expect(optionsOnScreen(container)).toEqual(q1.options)
    // forced re-render of the whole tree (same component instances, state preserved): the order must not change
    view.rerender(
      <AppProvider>
        <ListeningPlayer id={ex.id} />
      </AppProvider>,
    )
    expect(optionsOnScreen(container)).toEqual(q1.options)

    // answer everything correctly, by text
    for (let i = 0; i < ex.questions.length; i++) {
      const q = build(A)[i]
      expect(optionsOnScreen(container)).toEqual(q.options)
      await clickOption(container, q.answer)
      await next(i + 1 >= ex.questions.length)
    }
    expect(screen.getByText(new RegExp(`${ex.questions.length} / ${ex.questions.length}`))).toBeTruthy()

    // retry → listen phase → questions again with the next attempt's order
    await click(buttonByText(/Ещё раз/))
    await click(buttonByText(/Ответьте на вопросы/))
    expect(optionsOnScreen(container)).toEqual(build(B)[0].options)
  })
})

describe('the real QuizRunner scores a shuffled question by the answer text, in every position', () => {
  it('right option → counted correct; any other option → counted wrong with the same question id; result carries no positions', async () => {
    const ex = LISTENING.find(l => l.questions.length >= 2 && l.questions[0].options.length === 3)!
    // pick a seed that puts the correct answer LAST for question 1 (a position the authored data almost never uses)
    const seed = Array.from({ length: 200 }, (_, i) => `pos-${i}`).find(s => {
      const q = listeningQuestions(ex, s)[0]
      return q.options?.[q.options.length - 1] === q.answer
    })!
    const qs = listeningQuestions(ex, seed)
    let result: QuizResult | null = null
    const { container } = render(
      <AppProvider>
        <QuizRunner
          questions={qs}
          onDone={r => (result = r)}
          activity={{ id: `ex:${ex.id}`, kind: 'listening', completes: [`${ex.unit}:listening`] }}
        />
      </AppProvider>,
    )
    for (let i = 0; i < qs.length; i++) {
      const wrongChoice = i === 1 ? qs[i].options!.find(o => o !== qs[i].answer)! : qs[i].answer
      await clickOption(container, wrongChoice)
      await next(i + 1 >= qs.length)
    }
    const r = result as unknown as QuizResult
    expect(r.total).toBe(qs.length)
    expect(r.correct).toBe(qs.length - 1)
    expect(r.wrong.map(q => q.id)).toEqual([qs[1].id])
    expect(r.wrong[0].answer).toBe(ex.questions[1].options[ex.questions[1].answer])
  })
})
