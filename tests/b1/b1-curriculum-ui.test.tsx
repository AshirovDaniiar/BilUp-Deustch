// @vitest-environment jsdom
/**
 * B1 curriculum v2, as the learner sees it with the SHIPPED registry (B1 Beta for ru + ky): the first thirty-six units include Vocabulary, localized empty states remain for
 * unfilled sections, and the twelve legacy units 21–32 stay reachable by direct link with their saved progress.
 */
import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '../../src/app/App'
import { AppProvider } from '../../src/app/store'
import { B1_V2_LESSON_OF_UNIT } from '../../src/data/b1/grammar-v2'
import { isLevelContentLoaded } from '../../src/data/catalog'
import type { Lang } from '../../src/data/types'
import { dictionaries } from '../../src/i18n'
import { requiredSections, unitProgress } from '../../src/features/progress/stats'
import { defaultProgress } from '../../src/storage/defaults'
import { KEY } from '../helpers'

vi.setConfig({ testTimeout: 15_000 })

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
  window.location.hash = ''
})

async function show(path: string, lang: Lang, level: 'A1' | 'B1' = 'B1', completed: string[] = []) {
  localStorage.clear()
  localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang, level, completed }))
  window.location.hash = `#${path}`
  render(
    <AppProvider>
      <App />
    </AppProvider>,
  )
  for (let i = 0; i < 200 && lang !== 'de' && !isLevelContentLoaded('B1'); i++)
    await act(async () => {
      await new Promise(r => setTimeout(r, 50))
    })
  await act(async () => {
    await new Promise(r => setTimeout(r, 120))
  })
  return document.body.textContent ?? ''
}

const EMPTY: Record<'ru' | 'ky', string> = { ru: 'Контент будет добавлен позже.', ky: 'Контент кийинчерээк кошулат.' }

describe('B1 list and unit pages', () => {
  it('the B1 folder lists exactly the 36 new units in order; the twelve legacy units are not listed', async () => {
    await show('/learn?level=B1', 'ru')
    const hrefs = [...document.querySelectorAll('a.unitcard')].map(a => a.getAttribute('href'))
    expect(hrefs).toEqual(Array.from({ length: 36 }, (_, i) => `#/learn/unit/${301 + i}`))
    const cards = [...document.querySelectorAll('a.unitcard')]
    expect(cards[0].querySelector('.eyebrow')?.textContent).toBe('ЮНИТ 01 · B1')
    expect(cards[0].querySelector('h3')?.textContent).toBe('Geschichten und Erlebnisse erzählen')
    expect(cards[35].querySelector('h3')?.textContent).toBe('Worauf kommt es an?')
    expect(errors).toEqual([])
  })
  it('cards show real Vocabulary counts and content progress without fake 0/0 statistics', async () => {
    for (const lang of ['ru', 'ky'] as const) {
      await show('/learn?level=B1', lang)
      const cards = [...document.querySelectorAll('a.unitcard')]
      cards.forEach((c, i) => {
        expect(c.textContent).not.toMatch(/0\s*\/\s*0/)
        expect(c.textContent, `unit ${i + 1}`).not.toContain(EMPTY[lang])
        expect(c.textContent).toMatch(new RegExp(`0/${requiredSections(301 + i).length}`))
        if (i < 36) expect(c.textContent).toMatch(/25\s*(?:слов|сөз)/)
        else expect(c.textContent).not.toMatch(/слов|сөз/)
      })
      cleanup()
    }
  })
  it('a unit page has exactly 9 section cards with Merksätze after Grammar; the sections without content show the empty state (KY / RU)', async () => {
    for (const lang of ['ru', 'ky'] as const) {
      await show('/learn/unit/301', lang)
      const rows = [...document.querySelectorAll('.sections .secrow')]
      expect(rows).toHaveLength(9)
      expect(rows.map(r => r.querySelector('b')?.textContent)).toEqual(
        (['vocabulary', 'grammar', 'merksaetze', 'listening', 'reading', 'speaking', 'writing', 'review', 'test'] as const).map(
          s => dictionaries[lang][`sec_${s}` as 'sec_vocabulary'],
        ),
      )
      // Unit 301 has Vocabulary, Grammar, Merksätze, Reading, and Review content.
      expect(document.querySelectorAll('[data-empty-section]')).toHaveLength(4)
      const populated = new Set([0, 1, 2, 4, 7])
      for (const index of populated) expect(rows[index].hasAttribute('data-empty-section')).toBe(false)
      expect(rows[1].getAttribute('href')).toBe(`#/learn/topic/${B1_V2_LESSON_OF_UNIT[1]}?unit=301`)
      rows.forEach((r, i) => { if (!populated.has(i)) expect(r.textContent).toContain(EMPTY[lang]) })
      expect(document.body.textContent).not.toMatch(/0\s*\/\s*0/)
      cleanup()
    }
  })
  it('the German placeholder text exists in the dictionary', () => {
    expect(dictionaries.de.sec_empty).toBe('Der Inhalt wird später ergänzt.')
    expect(dictionaries.ru.sec_empty).toBe(EMPTY.ru)
    expect(dictionaries.ky.sec_empty).toBe(EMPTY.ky)
  })
})

describe('Continue Learning and legacy preservation', () => {
  it('with B1 active, Continue Learning opens the first curriculum unit with content', async () => {
    const text = await show('/', 'ru', 'B1')
    expect(text).toContain('Geschichten und Erlebnisse erzählen')
    expect([...document.querySelectorAll('a')].some(a => a.getAttribute('href') === '#/learn/unit/301/vocabulary')).toBe(true)
  })
  it('legacy unit 21 is still reachable by direct link with its content, and its saved progress is intact', async () => {
    const done = ['21:vocabulary', '21:grammar', '22:vocabulary']
    const text = await show('/learn/unit/21', 'ru', 'B1', done)
    expect(text).toContain('Erlebnisse und Erinnerungen erzählen')
    expect(document.querySelectorAll('[data-empty-section]')).toHaveLength(0)
    expect(unitProgress({ ...defaultProgress(), completed: done }, 21).done).toBeGreaterThanOrEqual(2)
    expect(JSON.parse(localStorage.getItem(KEY) as string).completed).toEqual(expect.arrayContaining(done))
  })
  it('curriculum Unit 311 uses the shared Vocabulary UI without changing saved legacy progress', async () => {
    const done = ['21:vocabulary', '21:grammar']
    const text = await show('/learn/unit/311/vocabulary', 'ru', 'B1', done)
    expect(text).toContain('Verwirklichung')
    expect(text).toContain('осуществление, реализация')
    expect(JSON.parse(localStorage.getItem(KEY) as string).completed).toEqual(done)
    expect(errors).toEqual([])
  })
})
