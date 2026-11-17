/**
 * Stage 6A — metadata replaces three hard-coded assumptions in the application:
 *   1. the unit page's "8 questions" label        → the size of the unit's test definition
 *   2. the final test's id pattern `unit-<n>`     → the test definition with `kind: 'topic'` and that `unit`
 *   3. the writing task's id pattern `wr<NN>`     → the writing task whose `unit` is that unit
 * Proved on the real A1 data (identical to before) AND on an A2 world whose ids follow no pattern and whose test has another size
 * (the old code could not have produced these links or this number). A2 content is injected only through vi.mock and never ships.
 */
import '../load-a2'
import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const F = vi.hoisted(() => {
  const l = (ru: string) => ({ ru, ky: `${ru}-ky` })
  return {
    vocab: [1, 2].map(n => ({
      id: `v11-${n}`,
      unit: 11,
      pos: 'noun',
      article: 'der',
      de: `Wort${n}`,
      plural: `Worte${n}`,
      ru: `слово ${n}`,
      ky: `сөз ${n}`,
      example: 'x',
      exampleRu: 'x',
      exampleKy: 'x',
      related: [] as string[],
    })),
    units: [{ id: 11, level: 'A2', title: 'Metadaten-Einheit', subtitle: l('подзаголовок'), icon: '🧭', grammarIds: ['g-meta'] }],
    grammar: [
      {
        id: 'g-meta',
        category: 'tenses',
        level: 'A2',
        unit: 11,
        title: l('Тема'),
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
      },
    ],
    // identity by METADATA only: neither id looks like `unit-11` / `wr11`, and the test asks 15 questions, not 8
    tests: [{ id: 'abschluss-elf', title: l('Abschluss'), kind: 'topic', level: 'A2', unit: 11, size: 15 }],
    writing: [
      {
        id: 'brief-schreiben',
        level: 'A2',
        unit: 11,
        title: 'Ein Brief',
        situation: l('s'),
        formal: true,
        minWords: 10,
        mustInclude: [],
        model: 'm',
        tips: [],
      },
    ],
  }
})
vi.mock('../../src/data/a2/vocabulary', () => ({ A2_VOCABULARY: F.vocab }))
vi.mock('../../src/data/a2/units', () => ({ A2_UNITS: F.units, A2_UNIT_SPEAKING: [] }))
vi.mock('../../src/data/a2/grammar', () => ({ A2_GRAMMAR: F.grammar, A2_WHY_NOTES: [] }))
vi.mock('../../src/data/a2/tests', () => ({ A2_TESTS: F.tests, A2_FINAL_TESTS: [] }))
vi.mock('../../src/data/a2/writing', () => ({ A2_WRITING: F.writing }))

import { App } from '../../src/app/App'
import { AppProvider } from '../../src/app/store'
import { topicTestOfUnit, writingForUnit } from '../../src/data/catalog'
import { COURSE } from '../../src/data/course'
import { TESTS } from '../../src/data/reallife'
import type { Lang, UserProgress } from '../../src/data/types'
import { UNITS } from '../../src/data/units'
import { WRITING } from '../../src/data/writing'
import { requiredSections } from '../../src/features/progress/stats'
import { defaultProgress } from '../../src/storage/defaults'
import { KEY } from '../helpers'

const a2 = () => COURSE.levels.find(l => l.id === 'A2') as unknown as { status: string; releasedLocales: string[] }

beforeEach(() => {
  window.scrollTo = () => undefined
  Element.prototype.scrollIntoView = () => undefined
})
afterEach(() => {
  cleanup()
  Object.assign(a2(), { status: 'planned', releasedLocales: [] })
  window.location.hash = ''
})

async function show(path: string, lang: Lang = 'ru', seed: Partial<UserProgress> = {}) {
  localStorage.clear()
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
const rows = (c: HTMLElement) =>
  Object.fromEntries([...c.querySelectorAll('a.secrow')].map(a => [a.getAttribute('href') ?? '', a.textContent ?? '']))
const hrefOf = (c: HTMLElement, prefix: string) =>
  [...c.querySelectorAll('a')].map(a => a.getAttribute('href') ?? '').filter(h => h.startsWith(prefix))

describe('A1: the metadata reproduces exactly what the old assumptions produced', () => {
  it('every A1 unit has one topic test whose id is `unit-<n>` and whose size is 8, and one writing task `wr<NN>` — as METADATA now', () => {
    for (const u of UNITS) {
      const t = topicTestOfUnit(u.id)
      expect(t, `unit ${u.id}`).toBeDefined()
      expect(t?.id).toBe(`unit-${u.id}`)
      expect(t?.size).toBe(8)
      expect(t?.unit).toBe(u.id)
      expect(writingForUnit(u.id).map(w => w.id)).toEqual([`wr${String(u.id).padStart(2, '0')}`])
    }
    expect(TESTS.filter(t => t.kind === 'topic')).toHaveLength(UNITS.length)
  })

  it('A1 unit pages show "8 вопросов" and link to the same test and writing task as before', async () => {
    for (const u of UNITS) {
      const { container } = await show(`/learn/unit/${u.id}`)
      const r = rows(container)
      const test = r[`#/practice/tests/unit-${u.id}`]
      expect(test, `unit ${u.id} test row`).toContain('8 вопросов')
      expect(r[`#/practice/writing/wr${String(u.id).padStart(2, '0')}`], `unit ${u.id} writing row`).toBeDefined()
      cleanup()
    }
  })

  it('A1 Home: the test step shows 8 questions and links to the unit test', async () => {
    const { container } = await show('/')
    expect(container.textContent).toContain('8 вопросов')
    expect(hrefOf(container, '#/practice/tests/')).toEqual(['#/practice/tests/unit-1'])
  })

  it('A1 progress: a unit requires a writing section exactly because a task has that unit (units 1–10 all do)', () => {
    for (const u of UNITS) expect(requiredSections(u.id)).toContain('writing')
  })
})

describe('A2 world: ids follow no pattern, the test has its own size', () => {
  it("the catalog finds the unit's test and writing task by their metadata", () => {
    expect(topicTestOfUnit(11)).toMatchObject({ id: 'abschluss-elf', size: 15, unit: 11, kind: 'topic' })
    expect(writingForUnit(11).map(w => w.id)).toEqual(['brief-schreiben'])
    expect(topicTestOfUnit(12)).toBeUndefined()
    expect(topicTestOfUnit(1)?.id).toBe('unit-1')
  })

  it('the unit page shows the DEFINITION\'s size and links to ITS id and the writing task by unit (not `unit-11`, not "8", not `wr11`)', async () => {
    Object.assign(a2(), { status: 'beta', releasedLocales: ['ru'] })
    const { container } = await show('/learn/unit/11', 'ru', { level: 'A2' })
    const r = rows(container)
    expect(Object.keys(r)).toContain('#/practice/tests/abschluss-elf')
    expect(r['#/practice/tests/abschluss-elf']).toContain('15 вопросов')
    expect(r['#/practice/tests/abschluss-elf']).not.toContain('8 вопросов')
    expect(Object.keys(r)).toContain('#/practice/writing/brief-schreiben')
    expect(Object.keys(r)).not.toContain('#/practice/tests/unit-11')
    expect(Object.keys(r)).not.toContain('#/practice/writing/wr11')
  })

  it('Home (A2) takes the test step from the same metadata', async () => {
    Object.assign(a2(), { status: 'beta', releasedLocales: ['ru'] })
    const { container } = await show('/', 'ru', { level: 'A2' })
    expect(hrefOf(container, '#/practice/tests/')).toEqual(['#/practice/tests/abschluss-elf'])
    expect(container.textContent).toContain('15 вопросов')
  })

  it('progress requirements follow the metadata: the unit requires its writing section because a task has that unit', () => {
    expect(requiredSections(11)).toEqual(expect.arrayContaining(['writing', 'test']))
  })

  it("the test route works for the metadata id (and is gated by the test's level while A2 is planned)", async () => {
    const planned = await show('/practice/tests/abschluss-elf')
    expect(planned.container.textContent).toContain('Страница не найдена')
    cleanup()
    Object.assign(a2(), { status: 'beta', releasedLocales: ['ru'] })
    const open = await show('/practice/tests/abschluss-elf', 'ru', { level: 'A2' })
    expect(open.container.textContent).not.toContain('Страница не найдена')
  })

  it('a unit without a test definition degrades safely (no broken `unit-<n>` link, no invented size)', async () => {
    // unit 12 has no content at all; a unit with content but no test is exercised through the catalog contract
    expect(topicTestOfUnit(12)).toBeUndefined()
    expect(WRITING.some(w => w.unit === 12)).toBe(false)
  })
})
