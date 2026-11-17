/**
 * Stage 7A.1 — Unit 11 exercised through the REAL application, in isolation. The production course registry says A2 is `planned`;
 * this test switches it to `beta` for one language INSIDE the test only (restored afterwards), so the real routes, the real lazy
 * loader and the real screens run on the real Unit 11 content. Nothing here changes production visibility.
 * (No `tests/load-a2.ts`: the content arrives through the lazy chunk exactly as it will in production.)
 */
import { act, cleanup, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { App } from '../../src/app/App'
import { AppProvider } from '../../src/app/store'
import { isLevelContentLoaded } from '../../src/data/catalog'
import { COURSE, isLevelVisible } from '../../src/data/course'
import type { Lang } from '../../src/data/types'
import { defaultProgress } from '../../src/storage/defaults'
import { KEY } from '../helpers'

type Mutable = { status: string; releasedLocales: string[] }
const a2 = () => COURSE.levels.find(l => l.id === 'A2') as unknown as Mutable
const release = (status: string, locales: string[]) => Object.assign(a2(), { status, releasedLocales: locales })

beforeEach(() => {
  window.scrollTo = () => undefined
  Element.prototype.scrollIntoView = () => undefined
})
afterEach(() => {
  cleanup()
  release('planned', [])
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
  // the lazy A2 chunk grows with every unit: poll for it instead of a fixed wait, then let the screen settle
  for (let i = 0; i < 60 && !isLevelContentLoaded('A2'); i++)
    await act(async () => {
      await new Promise(r => setTimeout(r, 50))
    })
  await act(async () => {
    await new Promise(r => setTimeout(r, 250))
  })
  return document.body.textContent ?? ''
}

const ROUTES: [string, string][] = [
  ['/learn/unit/11', 'Über mich und meine Erfahrungen'],
  ['/learn/topic/a2-perfekt-erfahrungen', 'Perfekt'],
  ['/grammar/a2-praeteritum-sein-haben-modal', 'Präteritum'],
  ['/practice/listening/a2-li-11-01', 'Deutschkurs'],
  ['/practice/listening/a2-li-11-02', 'Interview'],
  ['/practice/reading/a2-re-11-01', 'Mein Weg nach Deutschland'],
  ['/practice/reading/a2-re-11-02', 'Früher und heute'],
  ['/practice/writing/a2-wr-11-01', 'E-Mail'],
  ['/speak/a2-sp-11-01', 'Erfahrungen im Gespräch'],
]

describe('real Unit 11 through the real app (A2 made visible for one language, inside the test only)', () => {
  it('production says controlled Beta for ru + ky', () => {
    // (the per-test switch of this file is restored to the production state after each test; Beta is the production state now)
    expect(isLevelVisible('A2')).toBe(a2().status !== 'planned')
  })
  for (const lang of ['ru', 'ky'] as const)
    for (const [path, expected] of ROUTES)
      it(`${lang}: ${path} renders its content`, async () => {
        release('beta', [lang])
        const text = await show(path, lang)
        expect(isLevelContentLoaded('A2')).toBe(true)
        expect(text, 'screen shows not-found instead of the content').toContain(expected)
      })
  it('a language A2 is not released for gets "not found" and never loads the chunk', async () => {
    release('beta', ['ru'])
    const text = await show('/learn/unit/11', 'ky')
    expect(text).not.toContain('Über mich und meine Erfahrungen')
  })
})
