/**
 * Stage 7A.2 — the loading and load-failure states of a lazy level, in German, Russian and Kyrgyz, and a safe retry that does not
 * reload the application. The visibility of A2 is switched on INSIDE the test only (restored after each test); production stays planned.
 * `loadLevelContent` is wrapped so a test can make the chunk request pending or failing; it delegates to the real loader otherwise.
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const ctl = vi.hoisted(() => ({
  mode: 'real' as 'real' | 'pending' | 'fail',
  calls: 0,
  seen: false,
  real: null as null | ((l: string, o?: object) => Promise<void>),
}))
vi.mock('../../src/data/catalog', async importOriginal => {
  const m = await importOriginal<typeof import('../../src/data/catalog')>()
  ctl.real = m.loadLevelContent as never
  return {
    ...m,
    // per-test view of "is A2 loaded": the real catalog keeps its content once loaded, but each test starts from the shipped (unloaded) state
    isLevelContentLoaded: (l: string) => (l === 'A2' ? ctl.seen : (m.isLevelContentLoaded as (x: string) => boolean)(l)),
    loadLevelContent: (level: string, o?: object) => {
      ctl.calls++
      if (ctl.mode === 'pending') return new Promise<void>(() => undefined)
      if (ctl.mode === 'fail') return Promise.reject(new TypeError('Failed to fetch dynamically imported module'))
      return ctl.real!(level, o).then(() => {
        ctl.seen = true
      })
    },
  }
})

import { App } from '../../src/app/App'
import { AppProvider } from '../../src/app/store'
import { isLevelContentLoaded } from '../../src/data/catalog'
import { COURSE } from '../../src/data/course'
import type { Lang } from '../../src/data/types'
import { dictionaries } from '../../src/i18n'
import { defaultProgress } from '../../src/storage/defaults'
import { KEY } from '../helpers'

type Mutable = { status: string; releasedLocales: string[] }
const a2 = () => COURSE.levels.find(l => l.id === 'A2') as unknown as Mutable
const release = (status: string, locales: string[]) => Object.assign(a2(), { status, releasedLocales: locales })

beforeEach(() => {
  window.scrollTo = () => undefined
  Element.prototype.scrollIntoView = () => undefined
  ctl.mode = 'real'
  ctl.calls = 0
  ctl.seen = false
})
afterEach(() => {
  cleanup()
  release('planned', [])
  window.location.hash = ''
})

async function show(lang: Lang) {
  release('released', ['ru', 'ky']) // the German interface is offered a level only when it is fully released (a Beta level is ru + ky only)
  localStorage.clear()
  localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang }))
  window.location.hash = '#/learn/unit/11'
  render(
    <AppProvider>
      <App />
    </AppProvider>,
  )
  await act(async () => {})
}
const flush = () => act(async () => new Promise(r => setTimeout(r, 600)))

describe('the three interface languages have their own texts (no fallback to Russian)', () => {
  it('de, ru and ky each define loading, failure and failure-again, all different from each other', () => {
    for (const k of ['levelLoading', 'levelLoadFailed', 'levelLoadFailedAgain'] as const) {
      const v = (['ru', 'ky', 'de'] as const).map(l => dictionaries[l][k])
      expect(new Set(v).size, k).toBe(3)
      for (const t of v) expect(t.trim().length, k).toBeGreaterThan(10)
    }
  })
})

for (const lang of ['de', 'ru', 'ky'] as const) {
  describe(`interface language ${lang}`, () => {
    const d = dictionaries[lang]
    it('shows the localised loading state while the chunk is pending (not the not-found page)', async () => {
      ctl.mode = 'pending'
      await show(lang)
      expect(screen.getByRole('status').textContent).toBe(d.levelLoading)
      expect(document.body.textContent).not.toContain(d.notFound)
      expect(document.querySelector('[aria-busy="true"]')).not.toBeNull()
    })

    it('shows a localised failure with a retry; retry re-requests the chunk without reloading and then shows the content', async () => {
      ctl.mode = 'fail'
      await show(lang)
      await flush()
      expect(screen.getByRole('alert').textContent).toBe(d.levelLoadFailed)
      expect(document.body.textContent).not.toContain(d.levelLoadFailedAgain) // the reload hint appears only after a failed retry
      expect(isLevelContentLoaded('A2')).toBe(false)
      const calls = ctl.calls
      ctl.mode = 'real' // the network is back
      fireEvent.click(screen.getByRole('button', { name: d.retry }))
      await act(async () => {
        for (let i = 0; i < 40 && !ctl.seen; i++) await new Promise(r => setTimeout(r, 100))
      }) // poll: the real chunk import grows with the A2 content
      await flush()
      expect(ctl.calls).toBeGreaterThan(calls)
      expect(isLevelContentLoaded('A2')).toBe(true)
      expect(document.body.textContent).toContain('Über mich und meine Erfahrungen')
      expect(screen.queryByRole('alert')).toBeNull()
    })

    it('a failed retry stays on the failure state and adds the localised reload hint', async () => {
      ctl.mode = 'fail'
      await show(lang)
      await flush()
      fireEvent.click(screen.getByRole('button', { name: d.retry }))
      await flush()
      expect(screen.getByRole('alert').textContent).toBe(d.levelLoadFailed)
      expect(document.body.textContent).toContain(d.levelLoadFailedAgain)
      expect(isLevelContentLoaded('A2')).toBe(false)
    })
  })
}

describe('production visibility is untouched', () => {
  it('A2 is planned again after the tests and an A1 page never shows a loading state', async () => {
    expect(a2().status).toBe('planned')
    localStorage.clear()
    localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang: 'ru' }))
    window.location.hash = '#/learn/unit/1'
    render(
      <AppProvider>
        <App />
      </AppProvider>,
    )
    await act(async () => {})
    expect(screen.queryByRole('status')).toBeNull()
    expect(ctl.calls).toBe(0)
  })
})
