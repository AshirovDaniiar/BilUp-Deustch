/**
 * Stage 5 — the FUTURE world: A2 has content. Fake A2 data is loaded when the A2 modules are imported (vi.mock), exactly as real
 * content will be. Proves, rendering the real App:
 *   - while A2 is PLANNED: no A2 content in any list, lab, dashboard or URL, even though the catalog holds it;
 *   - once A2 is visible AND released for a language: level tabs, dashboards, labs and URLs appear for that language only;
 *   - labs list by the parent unit's level (A2 labs: only A2; A1 labs keep the legacy-tagged fragments);
 *   - next/previous topic navigation never crosses levels.
 * The fake content is test-only and never ships.
 */
import '../load-a2'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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

const F = vi.hoisted(() => {
  const l = (ru: string) => ({ ru, ky: `${ru}-ky` })
  const word = (n: number) => ({
    id: `v11-${n}`,
    unit: 11,
    pos: 'noun',
    article: 'der',
    de: `ZZA2wort${n}`,
    plural: `ZZA2worte${n}`,
    ru: `ZZA2 слово ${n}`,
    ky: `ZZA2 сөз ${n}`,
    example: 'Beispiel',
    exampleRu: 'пример',
    related: [] as string[],
  })
  const concept = (id: string, n: number) => ({
    id,
    category: 'tenses',
    level: 'A2',
    unit: 11,
    title: l(`ZZA2 Thema ${n}`),
    summary: l('s'),
    discover: l('d'),
    why: l('w'),
    when: [],
    examples: [],
    mistakes: [],
    reallife: [],
    visual: 'none',
    dialogue: [],
    speakPrompt: { prompt: l('p'), sample: 'Ich lerne.', keywords: ['lerne'] },
  })
  const vocab = [1, 2, 3, 4].map(word)
  const hand = [1, 2, 3].map(n => ({
    id: `a2-ex-${n}`,
    type: 'fill',
    unit: 11,
    concept: 'a2-concept-1',
    prompt: `ZZA2 ___ ${n}`,
    answer: 'a',
    options: ['a', 'b', 'c'],
    why: l('w'),
  }))
  const articles = vocab.map(v => ({
    id: `art-${v.id}`,
    type: 'article',
    unit: 11,
    concept: 'articles',
    prompt: v.de,
    options: ['der', 'die', 'das'],
    answer: 'der',
    why: l('w'),
  }))
  return {
    vocab,
    exercises: [...hand, ...articles],
    units: [
      {
        id: 11,
        level: 'A2',
        title: 'ZZA2 Einheit',
        subtitle: l('ZZA2 подзаголовок'),
        icon: '🧭',
        grammarIds: ['a2-concept-1', 'a2-concept-2'],
      },
    ],
    grammar: [concept('a2-concept-1', 1), concept('a2-concept-2', 2)],
    listening: [
      {
        id: 'a2-li-1',
        level: 'A2',
        unit: 11,
        title: 'ZZA2 Dialog',
        lines: [{ speaker: 'A', text: 'Hallo', ru: 'x' }],
        questions: [{ q: 'Wer?', options: ['a', 'b', 'c'], answer: 1 }],
        keywords: [],
      },
    ],
    reading: [
      {
        id: 'a2-re-1',
        level: 'A2',
        unit: 11,
        title: 'ZZA2 Text',
        body: ['Ein Text.'],
        gloss: [],
        questions: [{ q: 'Was?', options: ['a', 'b', 'c'], answer: 0 }],
      },
    ],
    writing: [
      {
        id: 'wr11',
        level: 'A2',
        unit: 11,
        title: 'ZZA2 Brief',
        situation: l('s'),
        formal: true,
        minWords: 10,
        mustInclude: [],
        model: 'm',
        tips: [],
      },
    ],
    speaking: [
      {
        id: 'a2-scn',
        title: 'ZZA2 Szene',
        titleRu: 'ZZA2',
        icon: '🎙️',
        level: 'A2',
        goal: l('g'),
        turns: [{ ai: 'Hallo', aiRu: 'x', hints: ['a'], keywords: ['a'] }],
      },
    ],
    tests: [
      { id: 'unit-11', title: l('ZZA2 Einheitstest'), kind: 'topic', level: 'A2', unit: 11, size: 8 },
      { id: 'level-a2', title: l('ZZA2 Niveautest'), kind: 'level', level: 'A2', size: 15 },
    ],
  }
})
vi.mock('../../src/data/a2/vocabulary', () => ({ A2_VOCABULARY: F.vocab }))
vi.mock('../../src/data/a2/exercises', () => ({ A2_EXERCISES: F.exercises }))
vi.mock('../../src/data/a2/units', () => ({ A2_UNITS: F.units, A2_UNIT_SPEAKING: ['a2-scn'] }))
vi.mock('../../src/data/a2/grammar', () => ({ A2_GRAMMAR: F.grammar, A2_WHY_NOTES: [] }))
vi.mock('../../src/data/a2/listening', () => ({ A2_LISTENING: F.listening }))
vi.mock('../../src/data/a2/reading', () => ({ A2_READING: F.reading }))
vi.mock('../../src/data/a2/writing', () => ({ A2_WRITING: F.writing }))
vi.mock('../../src/data/a2/speaking', () => ({ A2_SPEAKING: F.speaking }))
vi.mock('../../src/data/a2/tests', () => ({ A2_TESTS: F.tests, A2_FINAL_TESTS: [] }))

import { App } from '../../src/app/App'
import { isRouteAccessible, levelOfRoute } from '../../src/app/routeAccess'
import { AppProvider } from '../../src/app/store'
import type { Route } from '../../src/app/router'
import {
  grammarOf,
  levelOfConceptId,
  levelOfScenarioId,
  listeningOf,
  neighbourConcepts,
  readingOf,
  speakingOf,
  writingOf,
} from '../../src/data/catalog'
import { COURSE, availableLevels } from '../../src/data/course'
import { LISTENING } from '../../src/data/listening'
import type { Lang, UserProgress } from '../../src/data/types'
import { dictionaries } from '../../src/i18n'
import { defaultProgress } from '../../src/storage/defaults'
import { KEY } from '../helpers'

type Mutable = { status: string; releasedLocales: string[] }
const a2 = () => COURSE.levels.find(l => l.id === 'A2') as unknown as Mutable
const release = (status: string, locales: string[]) => Object.assign(a2(), { status, releasedLocales: locales })

beforeEach(() => {
  window.scrollTo = () => undefined
  Element.prototype.scrollIntoView = () => undefined
  localStorage.clear()
})
afterEach(() => {
  cleanup()
  release('planned', [])
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
const hrefs = (c: HTMLElement, prefix: string) =>
  [...c.querySelectorAll('a')].map(a => a.getAttribute('href') ?? '').filter(h => h.startsWith(prefix))
const route = (path: string): Route => {
  const [p, qs = ''] = path.split('?')
  return { path: p, parts: p.split('/').filter(Boolean), query: new URLSearchParams(qs) } as Route
}
const A2_URLS = [
  '/learn/unit/11',
  '/learn/unit/11/vocabulary',
  '/learn/topic/a2-concept-1',
  '/grammar/a2-concept-1',
  '/practice/listening/a2-li-1',
  '/practice/reading/a2-re-1',
  '/practice/writing/wr11',
  '/practice/tests/unit-11',
  '/practice/tests/level-a2',
  '/speak/a2-scn',
  '/practice/review?unit=11',
]

describe('the fixture is real: the catalog holds A2 content while A2 is planned', () => {
  it('A2 data is loaded; the course says planned; nobody may enter', () => {
    expect(grammarOf('A2')).toHaveLength(2)
    expect(a2().status).toBe('planned')
    expect(availableLevels('ru')).toEqual(['A1'])
  })
})

describe('A2 PLANNED: invisible and unreachable although its content exists', () => {
  it.each(A2_URLS)('%s is "not found"', async url => {
    expect(isRouteAccessible(route(url), 'ru')).toBe(false)
    await show(url)
    expect(text()).toContain('Страница не найдена')
    expect(text()).not.toContain('ZZA2')
  })

  it('the route access rule names the level of the content each URL addresses', () => {
    for (const url of A2_URLS) expect(levelOfRoute(route(url)), url).toBe('A2')
    for (const url of [
      '/learn/unit/1',
      '/learn/topic/genitiv',
      '/practice/listening/li16',
      '/practice/tests/level-a1',
      '/speak/doctor',
      '/practice/review?unit=3',
    ])
      expect(levelOfRoute(route(url)), url).toBe('A1')
    for (const url of ['/', '/learn', '/vocabulary', '/practice/real', '/speak', '/learn/unit/nope', '/practice/listening/nope'])
      expect(levelOfRoute(route(url)), url).toBeUndefined()
  })

  it('no list, lab, dashboard or tab shows any A2 content or level', async () => {
    for (const url of [
      '/',
      '/learn',
      '/vocabulary',
      '/grammar',
      '/practice',
      '/practice/listening',
      '/practice/reading',
      '/practice/writing',
      '/practice/tests',
      '/speak',
      '/progress',
    ]) {
      const { container } = await show(url)
      expect(text(), url).not.toContain('ZZA2')
      expect(text(), url).not.toMatch(/\bA2\b/)
      expect(container.querySelector('.levels'), url).toBeNull()
      cleanup()
    }
  })
})

describe('A2 visible and released for Russian only', () => {
  beforeEach(() => release('beta', ['ru']))

  it('availability is per language', () => {
    expect(availableLevels('ru')).toEqual(['A1', 'A2'])
    expect(availableLevels('ky')).toEqual(['A1'])
    expect(availableLevels('de')).toEqual(['A1']) // UI-only locale: a BETA level is not offered; only a fully released one (see below)
    release('released', ['ru'])
    expect(availableLevels('de')).toEqual(['A1', 'A2']) // fully released for at least one explanation language
  })

  it('Russian: the A2 URLs open; Kyrgyz: they stay "not found" and no tabs appear', async () => {
    await show('/learn/unit/11', 'ru')
    expect(text()).toContain('ZZA2 Einheit')
    expect(text()).toContain('· A2')
    cleanup()
    for (const url of A2_URLS) {
      await show(url, 'ky')
      expect(text(), url).toContain(dictionaries.ky.notFound) // the localized message
      expect(text(), url).not.toContain('ZZA2')
      cleanup()
    }
    const { container } = await show('/learn', 'ky')
    expect(container.querySelector('.levels')).toBeNull()
    expect(text()).not.toMatch(/\bA2\b/)
  })

  it('a Kyrgyz learner whose stored preference is A2 is shown A1 (and the preference is untouched)', async () => {
    await show('/', 'ky', { level: 'A2' })
    expect(text()).toContain('A1 · 10')
    expect(text()).not.toContain('ZZA2')
    expect(JSON.parse(localStorage.getItem(KEY) as string).level).toBe('A2')
  })

  it('Learn: level tabs list A1 and A2; choosing A2 shows only the A2 unit, choosing A1 brings back the 10 A1 units', async () => {
    const { container } = await show('/learn', 'ru')
    const tabs = [...container.querySelectorAll('.levels .chip')].map(c => c.textContent)
    expect(tabs).toEqual(['A1', 'A2'])
    expect(hrefs(container, '#/learn/unit/')).toHaveLength(10)

    fireEvent.click(screen.getByRole('button', { name: 'A2' }))
    await act(async () => {})
    expect(hrefs(container, '#/learn/unit/')).toEqual(['#/learn/unit/11'])
    expect(container.querySelector('a.unitcard .eyebrow')?.textContent).toBe('ЮНИТ 11 · A2')
    expect(text()).toContain('ZZA2 Einheit')

    fireEvent.click(screen.getByRole('button', { name: 'A1' }))
    await act(async () => {})
    expect(hrefs(container, '#/learn/unit/')).toHaveLength(10)
    expect(text()).not.toContain('ZZA2')
  })

  it('Home follows the level: A2 → "A2 · 1 юнит" from the metadata, a two-level journey, A2 current unit; A1 untouched', async () => {
    const { container } = await show('/', 'ru', { level: 'A2' })
    expect(text()).toContain('A2 · 1 юнит')
    expect(text()).toContain('Текущий уровень: A2')
    expect([...container.querySelectorAll('.journey__label')].map(e => e.textContent)).toEqual(['A1', 'A2'])
    expect(container.querySelector('.journey__node.is-current .journey__label')?.textContent).toBe('A2')
    const unitLinks = hrefs(container, '#/learn/unit/')
    expect(unitLinks.length).toBeGreaterThan(0)
    for (const h of unitLinks) expect(h).toMatch(/^#\/learn\/unit\/11\b/) // the dashboard links only into the A2 unit
    cleanup()
    await show('/', 'ru', { level: 'A1' })
    expect(text()).toContain('A1 · 10 юнит')
    expect(text()).not.toContain('ZZA2')
  })
})

describe("labs list by the PARENT UNIT's level", () => {
  it('A1 labs keep every A1-unit item (legacy A2-tagged included) and never show A2 content, even when A2 is visible', async () => {
    release('beta', ['ru'])
    const labs: [string, string, string[]][] = [
      ['/practice/listening', '#/practice/listening/', listeningOf('A1').map(x => x.id)],
      ['/practice/reading', '#/practice/reading/', readingOf('A1').map(x => x.id)],
      ['/practice/writing', '#/practice/writing/', writingOf('A1').map(x => x.id)],
      ['/speak', '#/speak/', speakingOf('A1').map(x => x.id)],
    ]
    for (const [url, prefix, ids] of labs) {
      const { container } = await show(url, 'ru', { level: 'A1' })
      expect(hrefs(container, prefix).sort(), url).toEqual(ids.map(id => prefix + id).sort())
      expect(text(), url).not.toContain('ZZA2')
      cleanup()
    }
    expect(listeningOf('A1').map(x => x.id)).toEqual(expect.arrayContaining(LISTENING.filter(l => l.level !== 'A1').map(l => l.id)))
  })

  it('A2 labs list only A2-unit items: no A1 item, no legacy A2-tagged A1 fragment', async () => {
    release('beta', ['ru'])
    const labs: [string, string, string][] = [
      ['/practice/listening', '#/practice/listening/', 'a2-li-1'],
      ['/practice/reading', '#/practice/reading/', 'a2-re-1'],
      ['/practice/writing', '#/practice/writing/', 'wr11'],
      ['/speak', '#/speak/', 'a2-scn'],
    ]
    for (const [url, prefix, id] of labs) {
      const { container } = await show(url, 'ru', { level: 'A2' })
      expect(hrefs(container, prefix), url).toEqual([prefix + id])
      expect(new Set([...container.querySelectorAll('a .chip--blue')].map(c => c.textContent)), url).toEqual(new Set(['A2']))
      cleanup()
    }
    // the legacy A2-tagged A1 fragments stay A1, in the catalog and on screen
    expect(listeningOf('A2').map(x => x.id)).toEqual(['a2-li-1'])
    for (const id of ['li16', 'li18', 'li20']) expect(listeningOf('A2').some(x => x.id === id)).toBe(false)
    expect(levelOfScenarioId('interview')).toBe('A1')
    expect(levelOfScenarioId('a2-scn')).toBe('A2')
  })

  it('lab tabs let a released-level learner switch between the levels', async () => {
    release('beta', ['ru'])
    const { container } = await show('/practice/listening', 'ru')
    expect([...container.querySelectorAll('.levels .chip')].map(c => c.textContent)).toEqual(['A1', 'A2'])
    fireEvent.click(screen.getByRole('button', { name: 'A2' }))
    await act(async () => {})
    expect(hrefs(container, '#/practice/listening/')).toEqual(['#/practice/listening/a2-li-1'])
  })
})

describe('next/previous navigation stays inside the level', () => {
  it('A1: the neighbours follow the A1 order exactly; the last A1 concept has no next although A2 concepts exist', () => {
    const a1 = grammarOf('A1')
    a1.forEach((g, i) => {
      expect(neighbourConcepts(g.id).previous?.id, g.id).toBe(a1[i - 1]?.id)
      expect(neighbourConcepts(g.id).next?.id, g.id).toBe(a1[i + 1]?.id)
    })
    expect(neighbourConcepts(a1[a1.length - 1].id).next).toBeUndefined()
    expect(neighbourConcepts('genitiv').next).toBeUndefined()
    expect(neighbourConcepts(a1[0].id).previous).toBeUndefined()
  })

  it('A2: the neighbours follow the A2 order; the first A2 concept does not lead back to A1, the last does not lead on', () => {
    expect(neighbourConcepts('a2-concept-1')).toMatchObject({ previous: undefined, next: { id: 'a2-concept-2' } })
    expect(neighbourConcepts('a2-concept-2')).toMatchObject({ previous: { id: 'a2-concept-1' }, next: undefined })
  })

  it('an unknown concept has no neighbours; the neighbours of a concept never belong to another level', () => {
    expect(neighbourConcepts('nope')).toEqual({ previous: undefined, next: undefined })
    for (const g of [...grammarOf('A1'), ...grammarOf('A2')]) {
      const own = levelOfConceptId(g.id)
      for (const n of [neighbourConcepts(g.id).previous, neighbourConcepts(g.id).next]) if (n) expect(levelOfConceptId(n.id)).toBe(own)
    }
  })

  it('the topic page uses the same-level neighbour: no topic link on a page leaves its level', async () => {
    release('beta', ['ru'])
    for (const [url, level] of [
      ['/learn/topic/genitiv', 'A1'],
      ['/learn/topic/a2-concept-1', 'A2'],
    ] as const) {
      const { container } = await show(url, 'ru', { level })
      for (const h of hrefs(container, '#/learn/topic/')) expect(levelOfConceptId(h.replace('#/learn/topic/', '')), h).toBe(level)
      cleanup()
    }
  })

  it('a unit page links only to content of its own level', async () => {
    release('beta', ['ru'])
    const { container } = await show('/learn/unit/11', 'ru', { level: 'A2' })
    for (const h of hrefs(container, '#/')) expect(h, h).not.toMatch(/#\/learn\/unit\/(?:[1-9]|10)(?:\/|$)/)
    expect(hrefs(container, '#/practice/listening/')).toEqual(['#/practice/listening/a2-li-1'])
    cleanup()
    const { container: c1 } = await show('/learn/unit/8', 'ru', { level: 'A1' })
    expect(hrefs(c1, '#/practice/listening/')).toEqual(['#/practice/listening/li15'])
    expect(text()).not.toContain('ZZA2')
  })
})
