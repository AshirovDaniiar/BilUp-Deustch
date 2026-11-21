/**
 * Stage 5 — the REAL world today: A2 is planned and empty. Everything is rendered through the real App (routing, layout, screens).
 * Proves: A2 appears nowhere in the UI (no chip, card, tab, lock, label, route), A1 navigation and lists are unchanged,
 * the four labs are scoped by the PARENT UNIT's level (so legacy A2-tagged fragments stay A1), labels/counts come from metadata.
 */
import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
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

import { App } from '../../src/app/App'
import { AppProvider } from '../../src/app/store'
import {
  levelOfListeningId,
  levelOfReadingId,
  levelOfScenarioId,
  levelOfWritingId,
  listeningOf,
  readingOf,
  speakingOf,
  unitsOfLevel,
  vocabularyForUnit,
  vocabularyOf,
  writingOf,
} from '../../src/data/catalog'
import { availableLevels } from '../../src/data/course'
import { LISTENING } from '../../src/data/listening'
import { READING } from '../../src/data/reading'
import { SPEAKING } from '../../src/data/speaking'
import type { Lang, UserProgress } from '../../src/data/types'
import { UNITS } from '../../src/data/units'
import { WRITING } from '../../src/data/writing'
import { defaultProgress } from '../../src/storage/defaults'
import { KEY } from '../helpers'

beforeEach(() => {
  window.scrollTo = () => undefined
  Element.prototype.scrollIntoView = () => undefined
  localStorage.clear()
})
afterEach(() => {
  cleanup()
  window.location.hash = ''
})

async function show(path: string, lang: Lang = 'ru', seed: Partial<UserProgress> = {}) {
  localStorage.clear() // every call starts from the seeded legacy record (the app writes its own current record after the first render)
  localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang, ...seed }))
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
const hrefs = (container: HTMLElement, prefix: string) =>
  [...container.querySelectorAll('a')].map(a => a.getAttribute('href') ?? '').filter(h => h.startsWith(prefix))

const A1_ROUTES = [
  '/',
  '/learn',
  '/learn/unit/1',
  '/learn/unit/8',
  '/learn/unit/10',
  '/learn/unit/10/vocabulary',
  '/learn/topic/genitiv',
  '/learn/topic/perfekt',
  '/grammar',
  '/grammar/genitiv',
  '/vocabulary',
  '/practice',
  '/practice/listening',
  '/practice/listening/li16',
  '/practice/listening/li20',
  '/practice/reading',
  '/practice/reading/re08',
  '/practice/reading/re09',
  '/practice/reading/re10',
  '/practice/writing',
  '/practice/writing/wr05',
  '/practice/writing/wr10',
  '/practice/tests',
  '/practice/tests/level-a1',
  '/practice/tests/placement',
  '/speak',
  '/speak/interview',
  '/speak/office',
  '/practice/review',
  '/practice/articles',
  '/progress',
  '/tutor',
  '/profile',
]

describe('A2 does not exist in the UI (all interface languages)', () => {
  it.each(['ru', 'ky', 'de'] as Lang[])('%s: no A2 label, no locked level, no placeholder on any A1 route', async lang => {
    for (const route of A1_ROUTES) {
      await show(route, lang)
      expect(text(), `${lang} ${route}`).not.toMatch(/\bA2\b/)
      expect(text(), `${lang} ${route}`).not.toContain('🔒')
      cleanup()
    }
  })

  it('a stored preference for the planned A2 level is ignored by the UI (and left untouched in storage)', async () => {
    const { container } = await show('/', 'ru', { level: 'A2' })
    expect(text()).not.toMatch(/\bA2\b/)
    expect(text()).toContain('A1 · 10') // dashboard is A1
    expect(container.querySelector('.journey__track')).toBeNull()
    expect(JSON.parse(localStorage.getItem(KEY) as string).level).toBe('A2')
  })

  it('only released levels are available, per language', () => {
    for (const lang of ['ru', 'ky', 'de'] as Lang[]) expect(availableLevels(lang)).toEqual(['A1'])
  })
})

describe('A2 cannot be reached by URL', () => {
  it.each([
    '/learn/unit/11',
    '/learn/unit/20',
    '/learn/unit/11/vocabulary',
    '/learn/unit/21',
    '/practice/tests/unit-11',
    '/practice/tests/level-a2',
    '/practice/review?unit=11',
    '/learn/topic/a2-anything',
  ])('%s is "not found"', async route => {
    await show(route)
    expect(text()).toContain('Страница не найдена')
    expect(text()).not.toMatch(/\bA2\b/)
  })
})

describe('A1 navigation and lists are unchanged', () => {
  it('Learn lists exactly the A1 units, in order, with their own level label and word counts; no level tabs', async () => {
    const { container } = await show('/learn')
    expect(hrefs(container, '#/learn/unit/')).toEqual(UNITS.map(u => `#/learn/unit/${u.id}`))
    expect(container.querySelectorAll('a.unitcard')).toHaveLength(10)
    expect(container.querySelector('.levels')).toBeNull() // a single available level needs no switch
    const cards = [...container.querySelectorAll('a.unitcard')]
    UNITS.forEach((u, i) => {
      expect(cards[i].querySelector('.eyebrow')?.textContent).toBe(`ЮНИТ ${String(u.id).padStart(2, '0')} · A1`)
      expect(cards[i].textContent).toContain(`${vocabularyForUnit(u.id).length} слов`)
    })
  })

  it('Vocabulary offers the A1 units only', async () => {
    const { container } = await show('/vocabulary')
    const chips = [...container.querySelectorAll('.catchips .chip')].map(c => c.textContent ?? '')
    expect(chips.filter(c => /^\S+ \d+$/.test(c.trim()))).toHaveLength(UNITS.length)
    expect(text()).toContain(`${vocabularyOf('A1').length}`) // "all words" counts the A1 vocabulary only
  })

  it('Home: level, unit count and progress label come from the course metadata', async () => {
    const { container } = await show('/')
    expect(text()).toContain(`A1 · ${unitsOfLevel('A1').length} юнит`)
    expect(text()).toContain('Текущий уровень: A1')
    expect(container.querySelector('.journey__track')).toBeNull()
  })

  it('Tests: the A1 level test and the unit tests are offered; no other level', async () => {
    const { container } = await show('/practice/tests')
    // the level chip and the level card both point at the A1 level test, and nothing else
    expect(hrefs(container, '#/practice/tests/level-')).toEqual(['#/practice/tests/level-a1', '#/practice/tests/level-a1'])
    expect(hrefs(container, '#/practice/tests/unit-')).toHaveLength(10)
    expect(text()).not.toContain('🔒')
  })
})

describe("the four labs are scoped by the PARENT UNIT's level (decision D-1)", () => {
  it('the catalog assigns every lab item the level of its unit; every A1-unit item is A1, whatever its legacy tag', () => {
    for (const l of LISTENING) expect(levelOfListeningId(l.id), l.id).toBe('A1')
    for (const r of READING) expect(levelOfReadingId(r.id), r.id).toBe('A1')
    for (const w of WRITING) expect(levelOfWritingId(w.id), w.id).toBe('A1')
    for (const s of SPEAKING) expect(levelOfScenarioId(s.id), s.id).toBe('A1')
    // the legacy tags are untouched data: they are NOT what the labs use
    expect(LISTENING.filter(l => l.level !== 'A1').map(l => l.id)).toEqual(['li16', 'li18', 'li20'])
    expect(READING.filter(r => r.level !== 'A1').map(r => r.id)).toEqual(['re08', 're09', 're10'])
  })

  it('Listening Lab lists all 21 A1-unit dialogues — including the three legacy A2-tagged ones — each labelled A1', async () => {
    const { container } = await show('/practice/listening')
    expect(hrefs(container, '#/practice/listening/').sort()).toEqual(
      listeningOf('A1')
        .map(l => `#/practice/listening/${l.id}`)
        .sort(),
    )
    for (const id of ['li16', 'li18', 'li20']) expect(hrefs(container, '#/practice/listening/')).toContain(`#/practice/listening/${id}`)
    const chips = [...container.querySelectorAll('a.conceptcard .chip--blue')].map(c => c.textContent)
    expect(chips).toHaveLength(21)
    expect(new Set(chips)).toEqual(new Set(['A1']))
  })

  it('Reading Lab lists all 10 A1-unit texts — including the A2-tagged re08/re09 and the B1-tagged re10 — each labelled A1', async () => {
    const { container } = await show('/practice/reading')
    expect(hrefs(container, '#/practice/reading/').sort()).toEqual(
      readingOf('A1')
        .map(r => `#/practice/reading/${r.id}`)
        .sort(),
    )
    expect(hrefs(container, '#/practice/reading/')).toEqual(
      expect.arrayContaining(['#/practice/reading/re08', '#/practice/reading/re09', '#/practice/reading/re10']),
    )
    expect(new Set([...container.querySelectorAll('a.conceptcard .chip--blue')].map(c => c.textContent))).toEqual(new Set(['A1']))
    expect(text()).not.toMatch(/\bB1\b/)
  })

  it('Writing Lab lists all 10 tasks — including the five legacy A2-tagged ones — each labelled A1', async () => {
    const { container } = await show('/practice/writing')
    expect(hrefs(container, '#/practice/writing/').sort()).toEqual(
      writingOf('A1')
        .map(w => `#/practice/writing/${w.id}`)
        .sort(),
    )
    expect(hrefs(container, '#/practice/writing/')).toHaveLength(10)
    expect(new Set([...container.querySelectorAll('a.conceptcard .chip--blue')].map(c => c.textContent))).toEqual(new Set(['A1']))
  })

  it('Speaking Lab lists all 11 scenarios (including the unit-less doctor one and the four legacy A2-tagged ones), each labelled A1', async () => {
    const { container } = await show('/speak')
    expect(hrefs(container, '#/speak/').sort()).toEqual(
      speakingOf('A1')
        .map(s => `#/speak/${s.id}`)
        .sort(),
    )
    expect(hrefs(container, '#/speak/')).toHaveLength(11)
    expect(new Set([...container.querySelectorAll('a.tilecard .chip--blue')].map(c => c.textContent))).toEqual(new Set(['A1']))
  })

  it("detail pages of legacy-tagged items show their unit's level (A1), never the legacy tag", async () => {
    for (const [route, expected] of [
      ['/practice/listening/li16', '🎧 A1 · Юнит 8'],
      ['/practice/reading/re10', '📖 A1 · Юнит 6'],
      ['/practice/writing/wr05', '✍️ A1 · Sie'],
      ['/speak/interview', '🤝 A1'],
      ['/learn/topic/genitiv', '· A1'],
      ['/grammar/genitiv', '· A1'],
    ] as const) {
      await show(route)
      expect(text(), route).toContain(expected)
      expect(text(), route).not.toMatch(/\bA2\b|\bB1\b/)
      cleanup()
    }
  })
})
