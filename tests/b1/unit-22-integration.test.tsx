// @vitest-environment jsdom
/**
 * B1 Unit 22 through the REAL application: real routes, the real lazy chunk loader, real screens. B1 ships as a Beta for ru and ky; tests that need the hidden state switch it to `planned` INSIDE a test and it is restored to the shipped Beta afterwards. Checks: while planned every Unit 22 route is "not found"; with the test-only
 * Beta every route resolves in Russian and Kyrgyz without a logged error; the German interface never sees B1; the writing and speaking feedback is a
 * checklist + self-assessment (never a numeric score); the unit test is scored by the real runner with the 70 % rule.
 * Nothing here implies a CEFR approval or verified audio playback (jsdom has no speech synthesis).
 */
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '../../src/app/App'
import { AppProvider } from '../../src/app/store'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { UNIT_22_FINAL } from '../../src/data/b1/unit22/assessment'
import { isLevelContentLoaded } from '../../src/data/catalog'
import { COURSE } from '../../src/data/course'
import type { Lang } from '../../src/data/types'
import { dictionaries } from '../../src/i18n'
import { defaultProgress } from '../../src/storage/defaults'
import { tr } from '../../src/utils/text'
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

const unit = B1_CONTENT.legacyUnits.find(u => u.id === 22)!
const grammar = B1_CONTENT.grammar.filter(g => g.unit === 22)
const writing = B1_CONTENT.writing.find(w => w.unit === 22)!
const speaking = B1_CONTENT.speaking.find(s => s.id === 'b1-sp-22-01')!
const ROUTES = (lang: Lang): [string, string][] => [
  [`/learn/unit/22`, unit.title],
  [`/learn/unit/22/vocabulary`, B1_CONTENT.vocabulary.find(v => v.unit === 22)!.de],
  ...grammar.flatMap((g): [string, string][] => [
    [`/learn/topic/${g.id}`, tr(g.title, lang)],
    [`/grammar/${g.id}`, tr(g.title, lang)],
  ]),
  ...B1_CONTENT.listening.filter(l => l.unit === 22).map((l): [string, string] => [`/practice/listening/${l.id}`, l.title]),
  ...B1_CONTENT.reading.filter(r => r.unit === 22).map((r): [string, string] => [`/practice/reading/${r.id}`, r.title]),
  [`/practice/writing/${writing.id}`, writing.title],
  [`/speak/${speaking.id}`, speaking.title],
  [`/practice/tests/unit-22`, ''],
  [`/practice/review?unit=22`, ''],
]

describe('hypothetical state "planned" (B1 ships as a Beta): the level is invisible and its chunk is never requested', () => {
  it('every Unit 22 route is "not found" for ru, ky and de, and the B1 chunk is never requested', async () => {
    setB1('planned', [])
    for (const lang of ['ru', 'ky', 'de'] as const)
      for (const [path] of ROUTES(lang)) {
        const text = await show(path, lang)
        expect(text, `${lang} ${path}`).toContain(dictionaries[lang].notFound)
        expect(isLevelContentLoaded('B1'), `${lang} ${path}`).toBe(false)
        cleanup()
      }
  }, 120_000)
})

describe('with the test-only Beta: the unit works in Russian and Kyrgyz, never in German', () => {
  it.each(['ru', 'ky'] as const)(
    '%s: every route of Unit 22 resolves through the lazy chunk, with its title, and logs no error',
    async lang => {
      setB1('beta', ['ru', 'ky'])
      for (const [path, marker] of ROUTES(lang)) {
        const text = await show(path, lang, 'B1')
        expect(isLevelContentLoaded('B1'), `${lang} ${path}`).toBe(true)
        expect(text, `${lang} ${path} must not be "not found"`).not.toContain(dictionaries[lang].notFound)
        if (marker) expect(text, `${lang} ${path}`).toContain(marker)
        expect(text.trim().length, `${lang} ${path} is not empty`).toBeGreaterThan(40)
        cleanup()
      }
      expect(errors).toEqual([])
    },
    240_000,
  )

  it('the German interface is not offered B1 even in the test-only Beta: not found, and none of the unit is shown', async () => {
    setB1('beta', ['ru', 'ky'])
    for (const [path] of ROUTES('de')) {
      const text = await show(path, 'de')
      expect(text, path).toContain(dictionaries.de.notFound)
      expect(text, path).not.toContain(unit.title)
      cleanup()
    }
  }, 120_000)

  it.each(['ru', 'ky'] as const)(
    '%s: the Beta notice names B1 and the unit page shows its learning content (vocabulary list, grammar topics)',
    async lang => {
      setB1('beta', ['ru', 'ky'])
      const text = await show('/learn/unit/22', lang, 'B1')
      expect(document.querySelector('.betanotice')!.textContent).toContain('B1 · Beta.')
      expect(document.querySelector('.betanotice')!.textContent).not.toMatch(/\bA2\b/)
      for (const g of grammar) expect(text).toContain(tr(g.title, lang))
    },
  )
})

describe('reading and listening flows', () => {
  it.each(['ru', 'ky'] as const)(
    '%s: the reading shows its text and questions; answering one gives feedback and no error is logged',
    async lang => {
      setB1('beta', ['ru', 'ky'])
      const r = B1_CONTENT.reading.find(x => x.unit === 22)!
      const text = await show(`/practice/reading/${r.id}`, lang, 'B1')
      // the reading screen renders every word as its own tappable element, so compare without whitespace
      expect(text.replace(/\s+/g, '')).toContain(r.body[0].slice(0, 30).replace(/\s+/g, ''))
      // the questions are a separate step (the "understandQ" button), as on every reading screen
      await act(async () => {
        fireEvent.click(
          [...document.querySelectorAll('button')].find(b => b.textContent?.includes(dictionaries[lang].understandQ)) as HTMLButtonElement,
        )
      })
      const q = r.questions[0]
      expect(document.body.textContent).toContain(q.q)
      const wrong = [...document.querySelectorAll('button')].find(b => b.textContent === q.options[(q.answer + 1) % 3]) as HTMLButtonElement
      expect(wrong, 'the options are offered').toBeTruthy()
      await act(async () => {
        fireEvent.click(wrong)
      })
      // an answer is not accepted silently: the runner moves on only through its continue button
      expect([...document.querySelectorAll('button')].some(b => b.textContent?.includes(dictionaries[lang].continue))).toBe(true)
      expect(errors).toEqual([])
    },
  )
  it.each(['ru', 'ky'] as const)(
    '%s: the listening shows the transcript only through the existing flow and offers the questions',
    async lang => {
      setB1('beta', ['ru', 'ky'])
      const l = B1_CONTENT.listening.find(x => x.unit === 22)!
      const text = await show(`/practice/listening/${l.id}`, lang, 'B1')
      expect(text).toContain(l.title)
      await act(async () => {
        fireEvent.click(
          [...document.querySelectorAll('button')].find(b => b.textContent?.includes(dictionaries[lang].understandQ)) as HTMLButtonElement,
        )
      })
      expect(document.body.textContent).toContain(l.questions[0].q)
      expect(errors).toEqual([])
    },
  )
})

describe('assessment honesty: checklist and self-assessment, no automated numeric score', () => {
  it.each(['ru', 'ky'] as const)(
    'writing (%s): the result shows the checklist with explanations in the learner’s language, the disclosure and the self-assessment — no score bars',
    async lang => {
      setB1('beta', ['ru', 'ky'])
      const d = dictionaries[lang]
      await show(`/practice/writing/${writing.id}`, lang, 'B1')
      fireEvent.change(document.querySelector('textarea') as HTMLTextAreaElement, { target: { value: writing.model } })
      await act(async () => {
        fireEvent.click([...document.querySelectorAll('button')].find(b => b.textContent === d.analyse) as HTMLButtonElement)
      })
      const text = document.body.textContent ?? ''
      expect(text).toContain(d.fb_autoNote)
      expect(text).toContain(d.fb_selfTitle)
      for (const m of writing.mustInclude) {
        expect(text).toContain(m.label)
        expect(text).toContain(m.explain![lang])
      }
      // the model text meets every expected element, so every item is ticked
      expect(document.querySelectorAll('.checks li').length).toBeGreaterThanOrEqual(writing.mustInclude.length)
      expect(text).not.toContain('✗ ' + writing.mustInclude[0].label)
      expect(document.querySelectorAll('.scorebar, .scorecard').length).toBe(0)
      expect(text).not.toMatch(/\d+\s?%/)
      expect(errors).toEqual([])
    },
  )

  it('writing: a text that is too short is reported as such, never scored', async () => {
    setB1('beta', ['ru', 'ky'])
    await show(`/practice/writing/${writing.id}`, 'ru', 'B1')
    fireEvent.change(document.querySelector('textarea') as HTMLTextAreaElement, { target: { value: 'Hallo zusammen, ich finde das gut.' } })
    await act(async () => {
      fireEvent.click([...document.querySelectorAll('button')].find(b => b.textContent === dictionaries.ru.analyse) as HTMLButtonElement)
    })
    expect(document.body.textContent).toContain(dictionaries.ru.fb_lengthShort)
    expect(document.querySelectorAll('.scorebar, .scorecard').length).toBe(0)
  })

  it.each(['ru', 'ky'] as const)(
    'speaking (%s): six turns; each answer shows expected-word coverage (not a score); the end shows the disclosure and the self-assessment',
    async lang => {
      setB1('beta', ['ru', 'ky'])
      const d = dictionaries[lang]
      await show(`/speak/${speaking.id}`, lang, 'B1')
      for (let i = 0; i < speaking.turns.length; i++) {
        await act(async () => {
          fireEvent.click([...document.querySelectorAll('button')].find(b => b.textContent?.includes(d.hints)) as HTMLButtonElement)
        })
        await act(async () => {
          fireEvent.click(document.querySelector('.hintbtn') as HTMLButtonElement)
        })
        expect(document.body.textContent).toContain(d.fb_expectedWords)
        expect(document.querySelectorAll('.scorecard, .scorebar').length).toBe(0)
        await act(async () => {
          fireEvent.click(
            [...document.querySelectorAll('button')].find(b =>
              b.textContent?.includes(i + 1 >= speaking.turns.length ? d.finish : d.continue),
            ) as HTMLButtonElement,
          )
        })
      }
      const text = document.body.textContent ?? ''
      expect(text).toContain(d.scenarioDone)
      expect(text).toContain(d.fb_autoNote)
      expect(text).toContain(d.fb_selfTitle)
      expect(document.querySelectorAll('.scorecard, .scorebar').length).toBe(0)
      expect(text).not.toMatch(/\d+%/)
      expect(errors).toEqual([])
    },
    90_000,
  )
})

describe('the unit test through the real runner (70 % rule)', () => {
  /** Plays the unit test: answers the first `correct` questions right and the rest wrong. */
  async function play(lang: Lang, correct: number) {
    const d = dictionaries[lang]
    await show('/practice/tests/unit-22', lang, 'B1')
    for (let i = 0; i < UNIT_22_FINAL.length; i++) {
      const buttons = [...document.querySelectorAll('button')]
      const shown = buttons.map(x => x.textContent ?? '')
      // the real runner shows the question and its options; the question is identified by its options (the generic instruction line is shared)
      const q = UNIT_22_FINAL.find(x => x.options.every(o => shown.includes(o)))
      expect(q, `question ${i + 1} is one of the unit test`).toBeTruthy()
      const options = buttons.filter(x => q!.options.includes(x.textContent ?? ''))
      expect(options).toHaveLength(3)
      const want = i < correct ? q!.answer : q!.options.find(o => o !== q!.answer)!
      await act(async () => {
        fireEvent.click(options.find(b => b.textContent === want) as HTMLButtonElement)
      })
      await act(async () => {
        fireEvent.click(
          [...document.querySelectorAll('button')].find(b =>
            b.textContent?.includes(i + 1 >= UNIT_22_FINAL.length ? d.finish : d.continue),
          ) as HTMLButtonElement,
        )
      })
    }
  }
  it('15 / 15 → passed, the pass note says so', async () => {
    setB1('beta', ['ru', 'ky'])
    await play('ru', 15)
    expect(document.querySelector('[data-testid="pass-note"]')?.getAttribute('data-passed')).toBe('true')
    expect(errors).toEqual([])
  }, 90_000)
  it('10 / 15 = 67 % → not passed (just below the threshold); 11 / 15 = 73 % → passed', async () => {
    setB1('beta', ['ru', 'ky'])
    await play('ru', 10)
    expect(document.querySelector('[data-testid="pass-note"]')?.getAttribute('data-passed')).toBe('false')
    cleanup()
    await play('ky', 11)
    expect(document.querySelector('[data-testid="pass-note"]')?.getAttribute('data-passed')).toBe('true')
  }, 120_000)
})

describe('regression found in the Unit 22 browser QA (390 px)', () => {
  it('the weak-concept chips of the test result wrap, so a long B1 concept title cannot force a horizontal page scroll', async () => {
    const { readFileSync } = await import('node:fs')
    const { join } = await import('node:path')
    const css = readFileSync(join(__dirname, '../../src/styles/features.css'), 'utf8')
    expect(css).toMatch(/\.chip--wrap\s*\{[^}]*white-space:\s*normal[^}]*max-width:\s*100%/)
    const page = readFileSync(join(__dirname, '../../src/features/tests/QuizPage.tsx'), 'utf8')
    expect(page).toMatch(/chip chip--yellow chip--wrap/)
    // the longest B1 concept title is the one that overflowed: it is far longer than a typical A1/A2 title
    const longest = Math.max(...B1_CONTENT.grammar.map(g => g.title.ky!.length))
    expect(longest).toBeGreaterThan(50)
  })
})
