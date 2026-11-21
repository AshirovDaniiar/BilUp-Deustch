/**
 * Stage 7A.1 — A2 content is LAZY. This file deliberately does NOT import `tests/load-a2.ts`: it runs in a fresh module graph in
 * which the catalog is in its shipped initial state (A2 slot empty, plan only), and proves the loader and the route gate.
 * The test-only visibility switch (COURSE mutation) is restored after every test; nothing here changes production data.
 */
import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { levelsToLoad } from '../../src/app/routeAccess'
import { AppProvider } from '../../src/app/store'
import {
  allUnits,
  allVocabulary,
  grammarIndex,
  isLevelContentLoaded,
  loadLevelContent,
  plannedUnitsOf,
  unitsOfLevel,
  vocabularyOf,
  vocabularyForUnit,
} from '../../src/data/catalog'
import { COURSE, availableLevels, isLevelVisible } from '../../src/data/course'
import { VOCABULARY } from '../../src/data/vocabulary'
import { defaultProgress } from '../../src/storage/defaults'
import { KEY } from '../helpers'

type Mutable = { status: string; releasedLocales: string[] }
const a2 = () => COURSE.levels.find(l => l.id === 'A2') as unknown as Mutable
const release = (status: string, locales: string[]) => Object.assign(a2(), { status, releasedLocales: locales })
const route = (path: string) => ({ path, parts: path.split('/').filter(Boolean), query: new URLSearchParams() }) as never

beforeEach(() => {
  window.scrollTo = () => undefined
  Element.prototype.scrollIntoView = () => undefined
})
afterEach(() => {
  cleanup()
  release('planned', [])
  window.location.hash = ''
})

describe('initial (shipped) state: A2 is not loaded', () => {
  it('the A2 slot is empty, the plan is present, A1 is untouched', () => {
    expect(isLevelContentLoaded('A1')).toBe(true)
    expect(isLevelContentLoaded('A2')).toBe(false)
    expect(unitsOfLevel('A2')).toEqual([])
    expect(vocabularyOf('A2')).toEqual([])
    expect(vocabularyForUnit(11)).toEqual([])
    expect(grammarIndex.has('a2-perfekt-erfahrungen')).toBe(false)
    expect(plannedUnitsOf('A2')).toHaveLength(10)
    expect(vocabularyOf('A1')).toBe(VOCABULARY)
    expect(allVocabulary).toHaveLength(VOCABULARY.length)
    expect(allUnits.every(u => u.id <= 10)).toBe(true)
  })
  it('a planned level cannot be loaded without the development preview flag, and stays empty', async () => {
    expect(isLevelVisible('A2')).toBe(false)
    await expect(loadLevelContent('A2')).rejects.toThrow(/not available/)
    expect(isLevelContentLoaded('A2')).toBe(false)
    expect(unitsOfLevel('A2')).toEqual([])
  })
  it('loading A1 is a no-op and never requests a chunk', async () => {
    await expect(loadLevelContent('A1')).resolves.toBeUndefined()
  })
})

describe('the route gate requests nothing for A1 or for a planned level', () => {
  it('every route, every language: no level to load', () => {
    for (const lang of ['ru', 'ky', 'de'] as const)
      for (const p of [
        '/',
        '/learn',
        '/learn/unit/1',
        '/learn/unit/11',
        '/grammar/articles',
        '/practice/tests/unit-1',
        '/vocabulary',
        '/progress',
      ])
        expect(levelsToLoad(route(p), lang, 'A1'), `${lang} ${p}`).toEqual([])
  })
  it('even a visible A2 is not requested by an A1 route or the A1 dashboard', () => {
    release('beta', ['ru'])
    expect(availableLevels('ru')).toEqual(['A1', 'A2', 'B1'])
    expect(levelsToLoad(route('/learn/unit/3'), 'ru', 'A1')).toEqual([])
    expect(levelsToLoad(route('/grammar/articles'), 'ru', 'A1')).toEqual([])
    expect(levelsToLoad(route('/practice/tests/unit-2'), 'ru', 'A1')).toEqual([])
    expect(levelsToLoad(route('/'), 'ru', 'A1')).toEqual([])
    expect(levelsToLoad(route('/vocabulary'), 'ru', 'A1')).toEqual([])
    // …but an A2 unit route, an unknown-id route and an A2 learner are
    expect(levelsToLoad(route('/learn/unit/11'), 'ru', 'A1')).toEqual(['A2'])
    expect(levelsToLoad(route('/grammar/a2-perfekt-erfahrungen'), 'ru', 'A1')).toEqual(['A2', 'B1']) // a grammar id is not resolved statically: every visible non-A1 level may own it (B1 is a Beta since the launch)
    expect(levelsToLoad(route('/vocabulary'), 'ru', 'A2')).toEqual(['A2'])
    // a language the level is not released for never requests it
    expect(levelsToLoad(route('/learn/unit/11'), 'ky', 'A1')).toEqual([])
  })
})

describe('rendering the real App', () => {
  const show = async (path: string, lang: 'ru' | 'ky' = 'ru') => {
    localStorage.clear()
    localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang }))
    window.location.hash = `#${path}`
    const view = render(
      <AppProvider>
        <App />
      </AppProvider>,
    )
    await act(async () => {})
    return view
  }
  const text = () => document.body.textContent ?? ''

  it('A2 planned: the unit URL is "not found" and the A2 chunk is never requested', async () => {
    await show('/learn/unit/11')
    expect(isLevelContentLoaded('A2')).toBe(false)
    expect(text()).not.toContain('Über mich und meine Erfahrungen')
  })

  it('A1 pages render without loading A2, even when A2 is visible', async () => {
    release('beta', ['ru'])
    await show('/learn/unit/1')
    expect(isLevelContentLoaded('A2')).toBe(false)
    expect(text()).toContain('Hallo')
  })

  it('A2 visible for the language: an A2 route loads the chunk on demand, then shows the unit', async () => {
    release('beta', ['ru'])
    window.location.hash = '#/learn/unit/11'
    localStorage.clear()
    localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang: 'ru' }))
    render(
      <AppProvider>
        <App />
      </AppProvider>,
    )
    expect(isLevelContentLoaded('A2')).toBe(false) // nothing was loaded by merely mounting
    // wait for the chunk (poll up to 5 s: under a loaded machine the first dynamic import can take longer than a fixed delay)
    await act(async () => {
      for (let i = 0; i < 50 && !isLevelContentLoaded('A2'); i++) await new Promise(r => setTimeout(r, 100))
      await new Promise(r => setTimeout(r, 50))
    })
    expect(isLevelContentLoaded('A2')).toBe(true)
    expect(text()).toContain('Über mich und meine Erfahrungen')
    // the loaded content is in the level's own slot; A1 is untouched
    expect(unitsOfLevel('A2').map(u => u.id)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    expect(vocabularyOf('A1')).toBe(VOCABULARY)
    expect(allUnits.map(u => u.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
  })

  it('loading is idempotent and a second request resolves immediately', async () => {
    release('beta', ['ru'])
    await loadLevelContent('A2')
    const n = allVocabulary.length
    await loadLevelContent('A2')
    expect(allVocabulary).toHaveLength(n)
  })
})
