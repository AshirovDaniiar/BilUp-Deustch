// @vitest-environment jsdom
/** The final B1 level assessment through the REAL runner (jsdom); B1 is switched to beta inside a test only. */
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '../../src/app/App'
import { AppProvider } from '../../src/app/store'
import { LEVEL_B1_ASSESSMENT } from '../../src/data/b1/level-test'
import { isLevelContentLoaded } from '../../src/data/catalog'
import { COURSE } from '../../src/data/course'
import type { Lang } from '../../src/data/types'
import { dictionaries } from '../../src/i18n'
import { defaultProgress } from '../../src/storage/defaults'
import { KEY } from '../helpers'

type Mutable = { status: string; releasedLocales: string[] }
const b1 = () => COURSE.levels.find(l => l.id === 'B1') as unknown as Mutable
const setB1 = (status: string, locales: string[]) => Object.assign(b1(), { status, releasedLocales: locales })
const errors: string[] = []

beforeEach(() => {
  window.scrollTo = () => undefined
  Element.prototype.scrollIntoView = () => undefined
  Element.prototype.animate = (() => ({ finished: Promise.resolve(), cancel: () => undefined, onfinish: null })) as never
  errors.length = 0
  vi.spyOn(console, 'error').mockImplementation((...a) => void errors.push(a.map(String).join(' ').slice(0, 200)))
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  setB1('beta', ['ru', 'ky']) // the shipped state since the B1 Beta launch
  window.location.hash = ''
})

async function show(path: string, lang: Lang, level: 'A1' | 'B1' = 'A1') {
  localStorage.clear()
  localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang, level }))
  window.location.hash = `#${path}`
  render(
    <AppProvider>
      <App />
    </AppProvider>,
  )
  for (let i = 0; i < 60 && b1().status !== 'planned' && !isLevelContentLoaded('B1'); i++)
    await act(async () => {
      await new Promise(r => setTimeout(r, 50))
    })
  for (let i = 0; i < 80 && (document.body.textContent ?? '').includes(dictionaries[lang].levelLoading); i++)
    await act(async () => {
      await new Promise(r => setTimeout(r, 50))
    })
  await act(async () => {
    await new Promise(r => setTimeout(r, 80))
  })
  return document.body.textContent ?? ''
}

const Q = LEVEL_B1_ASSESSMENT.questions
const norm = (t: string) => t.replace(/\s+/g, '')

/** plays the real 60-item runner: the first `correct` questions right, the rest wrong */
async function play(lang: Lang, correct: number) {
  const d = dictionaries[lang]
  await show('/practice/tests/level-b1', lang, 'B1')
  for (let i = 0; i < Q.length; i++) {
    const buttons = [...document.querySelectorAll('button')]
    const shown = buttons.map(x => x.textContent ?? '')
    const body = norm(document.body.textContent ?? '')
    const loc = (x: (typeof Q)[number]) => norm(lang === 'ru' ? x.promptRu : x.promptKy)
    const cands = Q.filter(x => (x.words ? x.words.every(w => shown.includes(w)) : x.options.every(o => shown.includes(o))))
    const q = cands.find(x => body.includes(loc(x))) ?? cands[0]
    expect(q, `question ${i + 1} is one of the assessment`).toBeTruthy()
    const right = i < correct
    if (q!.words) {
      const tokens = right ? q!.answer.split(' ') : [...q!.words].reverse()
      for (const t of tokens) {
        const btn = [...document.querySelectorAll('button')].find(b => b.textContent === t && !b.disabled)
        await act(async () => {
          fireEvent.click(btn as HTMLButtonElement)
        })
      }
      await act(async () => {
        fireEvent.click([...document.querySelectorAll('button')].find(b => b.textContent?.includes(d.check)) as HTMLButtonElement)
      })
    } else {
      const want = right ? q!.answer : q!.options.find(o => o !== q!.answer)!
      await act(async () => {
        fireEvent.click(buttons.find(b => b.textContent === want) as HTMLButtonElement)
      })
    }
    await act(async () => {
      fireEvent.click(
        [...document.querySelectorAll('button')].find(b =>
          b.textContent?.includes(i + 1 >= Q.length ? d.finish : d.continue),
        ) as HTMLButtonElement,
      )
    })
  }
}

describe('hypothetical state "planned" (B1 ships as a Beta): the level assessment is invisible', () => {
  it('the route is "not found" for ru and ky', async () => {
    setB1('planned', [])
    for (const lang of ['ru', 'ky'] as const) {
      cleanup()
      expect(await show('/practice/tests/level-b1', lang)).toContain(dictionaries[lang].notFound)
    }
  })
})

describe('the real runner with the test-only Beta', () => {
  it.each([
    ['ru', 60, 'reached'],
    ['ru', 52, 'almost'], // 52/60 = 87 % overall, but the practical part E is 0/8: the per-part rule blocks "reached"
    ['ky', 0, 'repeat'],
  ] as const)(
    '%s: %i of 60 right → band %s; part rows, the fixed statement and the companion note are shown; no CEFR/certificate wording; a level result is stored',
    async (lang, correct, band) => {
      setB1('beta', ['ru', 'ky'])
      await play(lang, correct)
      const card = document.querySelector('[data-testid="level-band"]')!
      expect(card.getAttribute('data-band')).toBe(band)
      expect(card.textContent).toContain(LEVEL_B1_ASSESSMENT.bands[band][lang])
      for (const p of ['A', 'B', 'C', 'E']) expect(document.querySelector(`[data-testid="level-part-${p}"]`)).toBeTruthy()
      expect(document.querySelector('[data-testid="level-part-D"]')).toBeNull()
      expect(document.querySelector('[data-testid="level-statement"]')!.textContent).toContain(LEVEL_B1_ASSESSMENT.statement[lang])
      expect(document.querySelector('[data-testid="level-listening-note"]')!.textContent).toContain(LEVEL_B1_ASSESSMENT.listeningNote[lang])
      expect(document.querySelector('[data-testid="level-companion"]')!.textContent).toContain(LEVEL_B1_ASSESSMENT.companion[lang])
      expect(document.body.textContent).not.toMatch(/CEFR|Goethe|telc|сертификат получен/)
      const stored = Array.from({ length: localStorage.length }, (_, i) => localStorage.getItem(localStorage.key(i)!) ?? '').join(' ')
      expect(stored).toContain(`b1-${band}`)
      expect(stored).toContain('b1-level-v2')
      expect(errors).toEqual([])
    },
    300_000,
  )
})
