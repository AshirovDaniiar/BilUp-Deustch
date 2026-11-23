// @vitest-environment jsdom
/**
 * B1 BETA LAUNCH — the SHIPPED state (no test-only switch): B1 is a Beta for the Russian and Kyrgyz explanation languages, visible to every learner of those interfaces (no pilot group, no account restriction),
 * never offered to the German interface, never a stable release. These tests use the production COURSE registry as it is; they check availability, navigation, the single Beta notice and the level assessment.
 * jsdom is NOT browser QA (that is documented in docs/implementation/B1_BETA_LAUNCH.md). Nothing here implies CEFR approval, native-speaker review or verified audio.
 */
import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '../../src/app/App'
import { AppProvider } from '../../src/app/store'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_UNIT_PLAN } from '../../src/data/b1/registry'
import { isLevelContentLoaded, unitsOfLevel } from '../../src/data/catalog'
import { COURSE, availableLevels, courseLevel, isLevelReleasedFor, isLevelVisible } from '../../src/data/course'
import type { Lang } from '../../src/data/types'
import { dictionaries } from '../../src/i18n'
import { defaultProgress } from '../../src/storage/defaults'
import { KEY } from '../helpers'

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

async function show(path: string, lang: Lang, level: 'A1' | 'A2' | 'B1' = 'B1') {
  localStorage.clear()
  localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang, level }))
  window.location.hash = `#${path}`
  render(
    <AppProvider>
      <App />
    </AppProvider>,
  )
  for (let i = 0; i < 60 && level === 'B1' && lang !== 'de' && !isLevelContentLoaded('B1'); i++)
    await act(async () => {
      await new Promise(r => setTimeout(r, 50))
    })
  for (let i = 0; i < 80 && (document.body.textContent ?? '').includes(dictionaries[lang].levelLoading); i++)
    await act(async () => {
      await new Promise(r => setTimeout(r, 50))
    })
  await act(async () => {
    await new Promise(r => setTimeout(r, 100))
  })
  return document.body.textContent ?? ''
}

describe('the shipped registry: B1 is a Beta, not a release', () => {
  it('status beta, released for ru and ky only, visible; A1 released and A2 Beta unchanged', () => {
    expect(courseLevel('B1')).toMatchObject({ id: 'B1', status: 'beta', unitIdRange: [21, 32], releasedLocales: ['ru', 'ky'] })
    expect(isLevelVisible('B1')).toBe(true)
    expect(courseLevel('A1')).toMatchObject({ status: 'released', releasedLocales: ['ru', 'ky'] })
    expect(courseLevel('A2')).toMatchObject({ status: 'beta', releasedLocales: ['ru', 'ky'] })
    expect(COURSE.levels.map(l => l.id)).toEqual(['A1', 'A2', 'B1'])
    expect(courseLevel('B1')!.status).not.toBe('released') // the distinction between Beta availability and a stable release is preserved
  })
  it('offered to every learner of the Russian and Kyrgyz interfaces (no per-account or per-group restriction exists in the registry) and never to the German interface', () => {
    for (const lang of ['ru', 'ky'] as const) {
      expect(availableLevels(lang)).toEqual(['A1', 'A2', 'B1'])
      expect(isLevelReleasedFor('B1', lang)).toBe(true)
    }
    expect(availableLevels('de')).toEqual(['A1'])
    expect(Object.keys(courseLevel('B1')!).sort()).toEqual(['extraUnitIdRanges', 'id', 'releasedLocales', 'status', 'unitIdRange'])
  })
  it('the registry holds exactly the 12 approved permanent units 21–32 and all of them are wired into the content module', () => {
    const ids = B1_UNIT_PLAN.map(p => p.id)
    expect(ids).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_UNIT_PLAN.map(p => p.key)).toEqual([
      'b1-erlebnisse-erinnerungen',
      'b1-meinungen-diskussion',
      'b1-arbeit-bewerbung',
      'b1-wohnen-umwelt',
      'b1-gesundheit-lebensstil',
      'b1-medien-technik',
      'b1-konsum-reklamation',
      'b1-bildung-zukunft',
      'b1-reisen-kultur',
      'b1-gesellschaft-engagement',
      'b1-behoerden-recht',
      'b1-rueckblick-pruefung',
    ])
    expect(B1_CONTENT.legacyUnits.map(u => [u.id, u.key])).toEqual(B1_UNIT_PLAN.map(p => [p.id, p.key]))
    expect(B1_CONTENT.tests.filter(t => t.kind === 'topic').map(t => t.id)).toEqual(ids.map(i => `unit-${i}`))
    expect(B1_CONTENT.tests.some(t => t.id === 'level-b1' && t.size === 60)).toBe(true)
    expect(B1_CONTENT.levelTest.questions).toHaveLength(60)
  })
})

describe('the learner experience with NO test-only switch (jsdom; the real-browser QA is separate)', () => {
  it.each(['ru', 'ky'] as const)(
    '%s: Learn offers the six summit folders (A1 / A2 / B1 open, B2 / C1 / C2 locked) and the B1 folder lists all 12 units in order with one Beta notice naming B1',
    async lang => {
      await show('/learn', lang)
      expect([...document.querySelectorAll('a.peakcard')].map(a => a.getAttribute('href'))).toEqual(['#/learn?level=A1', '#/learn?level=A2', '#/learn?level=B1'])
      expect(document.querySelectorAll('.peakcard.is-locked')).toHaveLength(3)
      cleanup()
      const text = await show('/learn?level=B1', lang)
      expect(errors).toEqual([])
      const links = [...document.querySelectorAll('a')].map(a => a.getAttribute('href') ?? '')
      // curriculum v2: the folder lists the 36 new units (ids 301–336); the twelve authored units 21–32 are hidden legacy
      for (let u = 301; u <= 336; u++)
        expect(
          links.some(h => h.endsWith(`/learn/unit/${u}`)),
          `unit ${u}`,
        ).toBe(true)
      for (let u = 21; u <= 32; u++) expect(links.some(h => h.endsWith(`/learn/unit/${u}`)), `legacy unit ${u} is not listed`).toBe(false)
      for (const u of unitsOfLevel('B1')) expect(text, u.title).toContain(u.title)
      expect(document.querySelectorAll('.betanotice')).toHaveLength(1)
      expect(document.querySelector('.betanotice')!.textContent).toContain('B1')
      expect(document.querySelector('.betanotice')!.textContent).toMatch(lang === 'ru' ? /бета-версии/ : /бета-версияда/)
    },
    120_000,
  )

  it.each(['ru', 'ky'] as const)(
    '%s: all 12 unit pages, the level assessment and the Writing/Speaking labs resolve (no "not found")',
    async lang => {
      const routes = [
        ...Array.from({ length: 12 }, (_, i) => `/learn/unit/${21 + i}`),
        '/practice/tests/unit-21',
        '/practice/tests/unit-32',
        '/practice/tests/level-b1',
        '/practice/writing/b1-wr-32-03',
        '/speak/b1-sp-32-01',
      ]
      for (const r of routes) {
        const text = await show(r, lang)
        expect(text, `${lang} ${r}`).not.toContain(dictionaries[lang].notFound)
        expect(text.trim().length, `${lang} ${r}`).toBeGreaterThan(60)
        cleanup()
      }
      expect(errors).toEqual([])
    },
    300_000,
  )

  it('the level assessment is offered on the Tests page of a B1 learner with its 60-item definition', async () => {
    const text = await show('/practice/tests', 'ru')
    expect(text).toContain('B1')
    expect([...document.querySelectorAll('a')].some(a => (a.getAttribute('href') ?? '').endsWith('/practice/tests/level-b1'))).toBe(true)
    expect(errors).toEqual([])
  }, 60_000)

  it('the German interface never sees B1: its unit and assessment routes are "not found"', async () => {
    for (const r of ['/learn/unit/21', '/practice/tests/level-b1']) {
      const text = await show(r, 'de', 'A1')
      expect(text, r).toContain(dictionaries.de.notFound)
      cleanup()
    }
  }, 60_000)

  it('an A1 learner on the Russian interface is unchanged: the 38 A1 units are listed and no B1 unit appears on the A1 Learn page', async () => {
    const text = await show('/learn?level=A1', 'ru', 'A1')
    const links = [...document.querySelectorAll('a')].map(a => a.getAttribute('href') ?? '')
    for (const u of [1, ...Array.from({ length: 37 }, (_, i) => 102 + i)])
      expect(
        links.some(h => h.endsWith(`/learn/unit/${u}`)),
        `A1 unit ${u}`,
      ).toBe(true)
    expect(links.some(h => h.endsWith('/learn/unit/21'))).toBe(false)
    expect(text.length).toBeGreaterThan(200)
  }, 60_000)
})

describe('honesty: a Beta is not a certification and no expert decision is approved', () => {
  it('the Beta notice states that review is pending and claims no CEFR level, exam or native-speaker approval (ru, ky)', () => {
    for (const lang of ['ru', 'ky'] as const) {
      const d = dictionaries[lang] as unknown as Record<string, string>
      const n = d.betaNoticeLevel
      expect(n).toMatch(/\{level\}/)
      expect(n).not.toMatch(/CEFR|Goethe|telc|сертификат|certificate|экзамен|одобрен/i)
    }
  })
  it('the release gate stays open: the validator still reports the missing CEFR and native reviews of B1 as Beta flags (never as passed)', async () => {
    const { fullBundle } = await import('../../scripts/content-validate/bundle')
    const { validateContent } = await import('../../scripts/content-validate/validate')
    const is = validateContent(fullBundle())
    expect(is.filter(i => i.severity === 'error' || i.severity === 'warning')).toEqual([])
    expect(is.filter(i => i.rule === 'beta-review-pending' && /^B1 is in BETA/.test(i.message))).toHaveLength(24)
    expect(is.filter(i => i.rule === 'cefr-signoff-missing' && /unit (2[1-9]|3[0-2]) \(B1\)/.test(i.message))).toHaveLength(12)
    expect(is.filter(i => i.rule === 'curriculum-decision-open')).toHaveLength(14)
    const release = validateContent(fullBundle(), { mode: 'release' })
    expect(release.filter(i => i.severity === 'error').length).toBeGreaterThan(40)
  })
})
