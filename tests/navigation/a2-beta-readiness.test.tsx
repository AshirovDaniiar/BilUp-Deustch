// @vitest-environment jsdom
/**
 * A2 Beta readiness: the REAL application (real routes, real lazy chunk, real screens) on every A2 unit 11–20 in Russian and Kyrgyz, with A2 switched to
 * `beta` INSIDE the test only (restored afterwards). Checks: every direct route resolves (no "not found"), no runtime error is logged, the German interface
 * still does not see A2, A2 progress and saved words persist, A1 is unaffected. No human CEFR / native-language approval is implied by this test.
 */
import { withoutB1Content } from '../content-validate/fixtures'
import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '../../src/app/App'
import { AppProvider } from '../../src/app/store'
import { A2_CONTENT } from '../../src/data/a2/a2-content'
import { isLevelContentLoaded } from '../../src/data/catalog'
import { COURSE, availableLevels } from '../../src/data/course'
import type { Lang } from '../../src/data/types'
import { dictionaries } from '../../src/i18n'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { validateContent } from '../../scripts/content-validate/validate'
import { levelProgress, unitProgress } from '../../src/features/progress/stats'
import { defaultProgress } from '../../src/storage/defaults'
import { sanitizeProgress } from '../../src/storage/validate'
import { tr } from '../../src/utils/text'
import { KEY } from '../helpers'

type Mutable = { status: string; releasedLocales: string[] }
const a2 = () => COURSE.levels.find(l => l.id === 'A2') as unknown as Mutable
const release = (status: string, locales: string[]) => Object.assign(a2(), { status, releasedLocales: locales })
const errors: string[] = []

beforeEach(() => {
  window.scrollTo = () => undefined
  Element.prototype.scrollIntoView = () => undefined
  // jsdom has no Web Animations API (used by the list reordering animation)
  Element.prototype.animate = (() => ({ finished: Promise.resolve(), cancel: () => undefined, onfinish: null })) as never
  errors.length = 0
  vi.spyOn(console, 'error').mockImplementation((...a) => void errors.push(a.map(String).join(' ').slice(0, 200)))
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  release('beta', ['ru', 'ky']) // the production state (controlled Beta)
  window.location.hash = ''
})

async function show(path: string, lang: Lang) {
  localStorage.clear()
  localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang }))
  window.location.hash = `#${path}`
  render(
    <AppProvider>
      <App />
    </AppProvider>,
  )
  for (let i = 0; i < 80 && !isLevelContentLoaded('A2'); i++)
    await act(async () => {
      await new Promise(r => setTimeout(r, 50))
    })
  await act(async () => {
    await new Promise(r => setTimeout(r, 60))
  })
  return document.body.textContent ?? ''
}

/** every direct route of one unit, with a marker that must appear on the page */
function routesOf(unit: number, lang: Lang): [string, string][] {
  const u = A2_CONTENT.legacyUnits.find(x => x.id === unit)! // curriculum v2: units 11–20 are hidden legacy, still reachable by direct route
  const out: [string, string][] = [
    [`/learn/unit/${unit}`, u.title],
    [`/learn/unit/${unit}/vocabulary`, A2_CONTENT.vocabulary.find(v => v.unit === unit)!.de],
    [`/practice/tests/unit-${unit}`, ''],
    [`/practice/review?unit=${unit}`, ''],
  ]
  for (const id of u.grammarIds) {
    const c = A2_CONTENT.grammar.find(g => g.id === id)!
    out.push([`/learn/topic/${id}`, tr(c.title, lang)], [`/grammar/${id}`, tr(c.title, lang)])
  }
  for (const l of A2_CONTENT.listening.filter(x => x.unit === unit)) out.push([`/practice/listening/${l.id}`, l.title])
  for (const r of A2_CONTENT.reading.filter(x => x.unit === unit)) out.push([`/practice/reading/${r.id}`, r.title])
  for (const w of A2_CONTENT.writing.filter(x => x.unit === unit)) out.push([`/practice/writing/${w.id}`, w.title])
  const s = A2_CONTENT.speaking.find(x => x.id === A2_CONTENT.unitSpeaking[unit - 11])
  if (s) out.push([`/speak/${s.id}`, s.title])
  return out
}

describe('direct routes of Units 11–20 in the real app (A2 beta for ru + ky)', () => {
  for (const lang of ['ru', 'ky'] as const)
    it(`${lang}: every route of every unit resolves, shows its content and logs no error`, async () => {
      release('beta', ['ru', 'ky'])
      const bad: string[] = []
      let n = 0
      for (let unit = 11; unit <= 20; unit++)
        for (const [path, marker] of routesOf(unit, lang)) {
          cleanup()
          const text = await show(path, lang)
          n++
          if (text.includes(dictionaries[lang].notFound)) bad.push(`${path}: not found`)
          else if (marker && !text.includes(marker)) bad.push(`${path}: marker "${marker}" missing`)
          else if (text.trim().length < 40) bad.push(`${path}: empty page`)
        }
      expect(n).toBeGreaterThan(150)
      expect(bad).toEqual([])
      expect(errors).toEqual([])
    }, 280_000)
})

describe('navigation, levels and the German interface', () => {
  it('ru and ky: the A2 level is offered and the A2 home / learn / practice / vocabulary / speak screens render without error', async () => {
    release('beta', ['ru', 'ky'])
    for (const lang of ['ru', 'ky'] as const) {
      expect(availableLevels(lang)).toContain('A2')
      for (const path of ['/', '/learn', '/practice', '/practice/tests', '/vocabulary', '/speak', '/grammar', '/progress']) {
        cleanup()
        const text = await show(path, lang)
        expect(text.includes(dictionaries[lang].notFound), `${lang} ${path}`).toBe(false)
        expect(text.trim().length, `${lang} ${path}`).toBeGreaterThan(40)
      }
    }
    expect(errors).toEqual([])
  })
  it('de interface: A2 Beta is NOT offered (only ru + ky); the A2 URLs are "not found"; a fully released level would be offered', async () => {
    release('beta', ['ru', 'ky'])
    expect(availableLevels('de')).toEqual(['A1'])
    for (const path of ['/learn/unit/11', '/learn/unit/20', '/practice/tests/unit-11', '/grammar/a2-man-regeln-verbote']) {
      cleanup()
      expect((await show(path, 'de')).includes(dictionaries.de.notFound), path).toBe(true)
    }
    release('released', ['ru', 'ky'])
    expect(availableLevels('de')).toContain('A2')
  })
  it('production state: A2 is in controlled Beta for ru + ky and not offered to German', () => {
    expect(a2()).toMatchObject({ status: 'beta', releasedLocales: ['ru', 'ky'] })
    // B1 is a Beta for ru + ky as well since the B1 launch
    expect(availableLevels('ru')).toEqual(['A1', 'A2', 'B1'])
    expect(availableLevels('ky')).toEqual(['A1', 'A2', 'B1'])
    expect(availableLevels('de')).toEqual(['A1'])
  })
})

describe('the Beta notice', () => {
  for (const lang of ['ru', 'ky'] as const)
    it(`${lang}: shown on the A2 screens (learn, a unit page), says Beta / expert review pending / translations may change / feedback welcome, claims no approval`, async () => {
      for (const [path, level] of [
        ['/learn?level=A2', 'A2'],
        ['/learn/unit/11', 'A2'],
      ] as const) {
        cleanup()
        localStorage.clear()
        localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang, level }))
        window.location.hash = `#${path}`
        render(
          <AppProvider>
            <App />
          </AppProvider>,
        )
        for (let i = 0; i < 80 && !isLevelContentLoaded('A2'); i++) await act(async () => void (await new Promise(r => setTimeout(r, 50))))
        await act(async () => void (await new Promise(r => setTimeout(r, 60))))
        expect(document.body.textContent, `${lang} ${path}`).toContain(dictionaries[lang].betaNotice)
      }
      const n = dictionaries[lang].betaNotice
      expect(n).toMatch(lang === 'ru' ? /бета/i : /бета/i)
      expect(n).not.toMatch(/(одобр|утвержд|сертифиц|подтвержд|макулдашылган|бекитилген)/i)
    })
  it('the three notices differ (independent texts) and A1 screens carry no notice', async () => {
    const [ru, ky, de] = (['ru', 'ky', 'de'] as const).map(l => dictionaries[l].betaNotice)
    expect(new Set([ru, ky, de]).size).toBe(3)
    cleanup()
    localStorage.clear()
    localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang: 'ru', level: 'A1' }))
    window.location.hash = '#/learn'
    render(
      <AppProvider>
        <App />
      </AppProvider>,
    )
    await act(async () => void (await new Promise(r => setTimeout(r, 120))))
    expect(document.body.textContent).not.toContain(ru)
  })
})

describe('release gate policy: Beta flags, full release blocks', () => {
  const authoring = () => validateContent(withoutB1Content(fullBundle()), { mode: 'authoring' })
  const release_ = () => validateContent(withoutB1Content(fullBundle()), { mode: 'release' })
  it('Beta: no error and no warning; the missing human reviews and the level test are explicit flags', () => {
    const i = authoring()
    expect(i.filter(x => x.severity === 'error' || x.severity === 'warning')).toEqual([])
    const flags = i.filter(x => x.severity === 'review').map(x => x.rule)
    expect(flags.filter(r => r === 'cefr-signoff-missing')).toHaveLength(10)
    expect(flags.filter(r => r === 'beta-review-pending')).toHaveLength(20)
    expect(flags.filter(r => r === 'beta-level-test-missing')).toHaveLength(1)
  })
  it('full release still blocks: every sign-off, every locale review and the missing level test are errors', () => {
    const e = release_().filter(x => x.severity === 'error')
    expect(e.filter(x => x.rule === 'cefr-signoff-missing')).toHaveLength(10)
    expect(e.filter(x => x.rule === 'release-gate-review')).toHaveLength(20)
    expect(e.some(x => x.rule === 'unit-minimum' && /level test/.test(x.message))).toBe(true)
    expect(release_().some(x => x.rule.startsWith('beta-'))).toBe(false)
  })
  it('no approval is recorded anywhere', async () => {
    const { A2_REVIEWS } = await import('../../scripts/content-validate/reviews')
    expect(A2_REVIEWS).toEqual({})
  })
})

describe('A2 progress and saved words', () => {
  const words = ['v11-1', 'v15-3', 'v20-37']
  it('completed sections of A2 units raise unit and level progress; A1 progress is unaffected', () => {
    release('beta', ['ru', 'ky'])
    const base = defaultProgress()
    const done = { ...base, completed: ['11:vocabulary', '11:grammar', '12:vocabulary', 'topic:a2-perfekt-erfahrungen'] }
    expect(unitProgress(done, 11).done).toBeGreaterThan(unitProgress(base, 11).done)
    // curriculum v2: units 11–20 are hidden legacy, so their records are kept (unitProgress above) but do not move the level's progress
    expect(levelProgress(done, 'A2')).toEqual(levelProgress(base, 'A2'))
    expect(levelProgress(done, 'A1')).toEqual(levelProgress(base, 'A1'))
  })
  it('saved A2 words and A2 completion keys survive validation (the storage round trip)', () => {
    const p = {
      ...defaultProgress(),
      saved: words,
      completed: ['20:test', '11:vocabulary', 'ex:a2-li-11-01'],
      mastery: { 'v11-1': { box: 1, due: '2026-01-01', seen: 1, correct: 1, wrong: 0 } },
    }
    const out = sanitizeProgress(JSON.parse(JSON.stringify(p)))!.value
    expect(out.saved).toEqual(words)
    expect(out.completed).toEqual(['20:test', '11:vocabulary', 'ex:a2-li-11-01'])
  })
})

describe('A2 curriculum v2: a unit with a REUSED grammar lesson (real A2 content)', () => {
  const backFrom = () => {
    vi.spyOn(window.history, 'length', 'get').mockReturnValue(1) // no history: the back button navigates to its fallback
    act(() => {
      ;(document.querySelector('.pagehead__back') as HTMLButtonElement).click()
    })
    return window.location.hash
  }
  it('Unit 01 (Mein letztes Jahr) shows the existing Perfekt lesson in its Grammar card; the other seven sections are empty', async () => {
    release('beta', ['ru', 'ky'])
    await show('/learn/unit/201', 'ru')
    const rows = [...document.querySelectorAll('.sections .secrow')]
    expect(rows).toHaveLength(8)
    expect(document.querySelectorAll('[data-empty-section]')).toHaveLength(7)
    expect(rows[1].hasAttribute('data-empty-section')).toBe(false)
    expect(rows[1].getAttribute('href')).toBe('#/learn/topic/a2-perfekt-erfahrungen?unit=201')
    expect(errors).toEqual([])
  })
  it('the lesson opens with the new unit as its context (label, back button) and its original content', async () => {
    release('beta', ['ru', 'ky'])
    const text = await show('/learn/topic/a2-perfekt-erfahrungen?unit=201', 'ru')
    expect(text).toContain('Юнит 1 · A2')
    expect(text).toContain('Perfekt')
    expect(backFrom()).toBe('#/learn/unit/201')
    cleanup()
    await show('/learn/topic/a2-perfekt-erfahrungen', 'ru') // the legacy route is unchanged: back goes to the hidden legacy unit
    expect(backFrom()).toBe('#/learn/unit/11')
  })
  it('a partial-match topic (02) and a cross-level topic (16) stay completely empty', async () => {
    release('beta', ['ru', 'ky'])
    for (const id of [202, 216]) {
      await show(`/learn/unit/${id}`, 'ru')
      expect(document.querySelectorAll('[data-empty-section]')).toHaveLength(8)
      cleanup()
    }
  })
})
