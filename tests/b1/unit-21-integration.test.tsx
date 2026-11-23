// @vitest-environment jsdom
/**
 * B1 Unit 21 through the REAL application: real routes, the real lazy chunk loader, real screens. B1 is switched to `beta` INSIDE a test only (and restored to
 * `planned` afterwards) so that the unit can be rendered; in the shipped state B1 is planned and invisible. Checks: while planned every B1 route is "not
 * found" and the chunk is never requested; with the test-only Beta every route of the unit resolves in Russian and Kyrgyz without a logged error; the German
 * interface never sees B1; and B1 speaking / writing show a transparent checklist and a self-assessment, NEVER an automated numeric score.
 * Nothing here implies a CEFR approval or verified audio playback (jsdom has no speech synthesis).
 */
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '../../src/app/App'
import { AppProvider } from '../../src/app/store'
import { isLevelContentLoaded } from '../../src/data/catalog'
import { COURSE } from '../../src/data/course'
import type { Lang } from '../../src/data/types'
import { dictionaries } from '../../src/i18n'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
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
  setB1('planned', []) // the shipped state
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
  // a deep link to content that no loaded level knows also loads the OTHER visible lazy level (A2): wait for the loading state to end
  for (let i = 0; i < 80 && (document.body.textContent ?? '').includes(dictionaries[lang].levelLoading); i++)
    await act(async () => {
      await new Promise(r => setTimeout(r, 50))
    })
  await act(async () => {
    await new Promise(r => setTimeout(r, 80))
  })
  return document.body.textContent ?? ''
}

const unit = B1_CONTENT.legacyUnits[0]
const grammar = B1_CONTENT.grammar
const ROUTES = (lang: Lang): [string, string][] => [
  [`/learn/unit/21`, unit.title],
  [`/learn/unit/21/vocabulary`, B1_CONTENT.vocabulary[0].de],
  ...grammar.flatMap((g): [string, string][] => [
    [`/learn/topic/${g.id}`, tr(g.title, lang)],
    [`/grammar/${g.id}`, tr(g.title, lang)],
  ]),
  ...B1_CONTENT.listening.map((l): [string, string] => [`/practice/listening/${l.id}`, l.title]),
  ...B1_CONTENT.reading.map((r): [string, string] => [`/practice/reading/${r.id}`, r.title]),
  [`/practice/writing/${B1_CONTENT.writing[0].id}`, B1_CONTENT.writing[0].title],
  [`/speak/${B1_CONTENT.speaking[0].id}`, B1_CONTENT.speaking[0].title],
  [`/practice/tests/unit-21`, ''],
  [`/practice/review?unit=21`, ''],
]

describe('hypothetical state "planned" (B1 ships as a Beta): the level is invisible and its chunk is never requested', () => {
  it('every Unit 21 route is "not found" for ru, ky and de, and the B1 chunk is never requested', async () => {
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
    '%s: every route of Unit 21 resolves through the lazy chunk, with its title, and logs no error',
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
})

describe('assessment honesty: checklist and self-assessment, no automated numeric score', () => {
  it('writing: after the check the learner sees the length and expected-element checklist, the disclosure, the self-assessment and the model — and no score bars', async () => {
    setB1('beta', ['ru', 'ky'])
    const task = B1_CONTENT.writing[0]
    const ru = dictionaries.ru
    await show(`/practice/writing/${task.id}`, 'ru', 'B1')
    const area = document.querySelector('textarea') as HTMLTextAreaElement
    fireEvent.change(area, { target: { value: task.model } })
    const button = [...document.querySelectorAll('button')].find(b => b.textContent === ru.analyse) as HTMLButtonElement
    await act(async () => {
      fireEvent.click(button)
    })
    const text = document.body.textContent ?? ''
    expect(text).toContain(ru.fb_autoChecks)
    expect(text).toContain(ru.fb_lengthOk)
    expect(text).toContain(ru.fb_autoNote)
    expect(text).toContain(ru.fb_selfTitle)
    for (const k of ['fb_critTask', 'fb_critFlow', 'fb_critWords', 'fb_critAccuracy'] as const) expect(text).toContain(ru[k])
    expect(text).toContain(task.mustInclude[0].label)
    expect(document.querySelectorAll('.scorebar, .scorecard').length).toBe(0)
    expect(text).not.toMatch(/\d+\s?%/) // no percentage anywhere on the result
    expect(errors).toEqual([])
  })

  it('writing in Kyrgyz: the same checklist in the learner’s own language (no Russian disclosure text)', async () => {
    setB1('beta', ['ru', 'ky'])
    const task = B1_CONTENT.writing[0]
    const ky = dictionaries.ky
    await show(`/practice/writing/${task.id}`, 'ky', 'B1')
    fireEvent.change(document.querySelector('textarea') as HTMLTextAreaElement, { target: { value: task.model } })
    await act(async () => {
      fireEvent.click([...document.querySelectorAll('button')].find(b => b.textContent === ky.analyse) as HTMLButtonElement)
    })
    const text = document.body.textContent ?? ''
    expect(text).toContain(ky.fb_autoNote)
    expect(text).not.toContain(dictionaries.ru.fb_autoNote)
    expect(text).toContain(ky.fb_selfTitle)
  })

  it('writing: a text that is too short is reported as such, never scored', async () => {
    setB1('beta', ['ru', 'ky'])
    const task = B1_CONTENT.writing[0]
    await show(`/practice/writing/${task.id}`, 'ru', 'B1')
    fireEvent.change(document.querySelector('textarea') as HTMLTextAreaElement, {
      target: { value: 'Hallo Mila, gestern war ich im Kino.' },
    })
    await act(async () => {
      fireEvent.click([...document.querySelectorAll('button')].find(b => b.textContent === dictionaries.ru.analyse) as HTMLButtonElement)
    })
    const text = document.body.textContent ?? ''
    expect(text).toContain(dictionaries.ru.fb_lengthShort)
    expect(document.querySelectorAll('.scorebar, .scorecard').length).toBe(0)
  })

  it('speaking: each answer shows the expected-word coverage (not a score); the end shows the disclosure and the self-assessment, no score grid', async () => {
    setB1('beta', ['ru', 'ky'])
    const ru = dictionaries.ru
    const sc = B1_CONTENT.speaking[0]
    await show(`/speak/${sc.id}`, 'ru', 'B1')
    for (let i = 0; i < sc.turns.length; i++) {
      await act(async () => {
        fireEvent.click([...document.querySelectorAll('button')].find(b => b.textContent?.includes(ru.hints)) as HTMLButtonElement)
      })
      await act(async () => {
        fireEvent.click(document.querySelector('.hintbtn') as HTMLButtonElement)
      })
      expect(document.body.textContent).toContain(ru.fb_expectedWords)
      expect(document.querySelectorAll('.scorecard, .scorebar').length).toBe(0)
      await act(async () => {
        fireEvent.click(
          [...document.querySelectorAll('button')].find(b =>
            b.textContent?.includes(i + 1 >= sc.turns.length ? ru.finish : ru.continue),
          ) as HTMLButtonElement,
        )
      })
    }
    const text = document.body.textContent ?? ''
    expect(text).toContain(ru.scenarioDone)
    expect(text).toContain(ru.fb_autoNote)
    expect(text).toContain(ru.fb_selfTitle)
    for (const k of ['fb_spkAnswered', 'fb_spkRepair', 'fb_spkStructure', 'fb_spkUnexpected'] as const) expect(text).toContain(ru[k])
    expect(document.querySelectorAll('.scorecard, .scorebar').length).toBe(0)
    expect(text).not.toMatch(/\d+%/)
    expect(errors).toEqual([])
  }, 60_000)

  it('the existing A2 feedback is unchanged (it still shows its analysis scores) — only B1 and above use the checklist', async () => {
    const { usesChecklistFeedback } = await import('../../src/services/feedback-mode')
    expect(usesChecklistFeedback('A1')).toBe(false)
    expect(usesChecklistFeedback('A2')).toBe(false)
    expect(usesChecklistFeedback(undefined)).toBe(false)
    expect(usesChecklistFeedback('B1')).toBe(true)
  })
})
