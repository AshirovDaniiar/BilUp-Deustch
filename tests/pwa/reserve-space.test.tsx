/**
 * P2 regression (audit §7 / §9 item 6): the fixed PWA notice covered the lower quiz and assessment buttons at 390 px because the page reserved no space for it.
 * Fix: while a notice is visible, PwaPrompt puts `has-pwa-note` on <html> and publishes the notice's measured height as `--pwa-note-h`; `pwa.css` adds exactly that height to the bottom padding of `.main`.
 * jsdom has no layout, so these tests check the contract (class, variable, cleanup, CSS rules); the real 390 px behaviour was checked in Chromium (docs/implementation/B1_P2_REMEDIATION.md).
 */
import { act, fireEvent, render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppProvider } from '../../src/app/store'
import { PwaPrompt } from '../../src/pwa/PwaPrompt'
import { PWA_MESSAGES } from '../../src/pwa/messages'
import type { PwaHandle } from '../../src/pwa/register'

const root = () => document.documentElement
const reserved = () => root().classList.contains('has-pwa-note')
const height = () => root().style.getPropertyValue('--pwa-note-h')

function handle() {
  let cb: () => void = () => {}
  const h: PwaHandle & { fire: () => void } = {
    status: 'registered',
    updateReady: () => false,
    onUpdateReady: c => {
      cb = c
      return () => {}
    },
    applyUpdate: vi.fn(),
    checkForUpdate: vi.fn(async () => {}),
    fire: () => cb(),
  }
  return h
}
const mount = async (h: PwaHandle | null = null) => {
  const view = render(
    <AppProvider>
      <PwaPrompt handle={h ? Promise.resolve(h) : null} />
    </AppProvider>,
  )
  await act(async () => {})
  return view
}
const beforeInstall = () => {
  const e = new Event('beforeinstallprompt', { cancelable: true }) as Event & { prompt: () => Promise<void> }
  e.prompt = vi.fn(async () => {})
  return e
}
let noteHeight = 132
beforeEach(() => {
  localStorage.clear()
  noteHeight = 132
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const h = this.classList.contains('pwa-note') ? noteHeight : 0
    return { x: 0, y: 0, top: 0, left: 0, right: 0, bottom: h, width: 300, height: h, toJSON: () => ({}) } as DOMRect
  })
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  root().classList.remove('has-pwa-note')
  root().style.removeProperty('--pwa-note-h')
})

describe('the page reserves the height of the visible notice', () => {
  it('reserves nothing when no notice is shown', async () => {
    await mount()
    expect(reserved()).toBe(false)
    expect(height()).toBe('')
  })
  it('INSTALL notice visible: <html> has the class and the notice height (rounded up) is published', async () => {
    noteHeight = 131.2
    await mount()
    await act(async () => void window.dispatchEvent(beforeInstall()))
    expect(screen.getByTestId('pwa-install')).toBeTruthy()
    expect(reserved()).toBe(true)
    expect(height()).toBe('132px')
  })
  it('the reserved height follows the notice when it changes size (rotation, language, wrapping): ResizeObserver and window resize', async () => {
    let fire: () => void = () => {}
    class RO {
      constructor(cb: () => void) {
        fire = cb
      }
      observe() {}
      disconnect() {}
    }
    vi.stubGlobal('ResizeObserver', RO)
    await mount()
    await act(async () => void window.dispatchEvent(beforeInstall()))
    expect(height()).toBe('132px')
    noteHeight = 168
    await act(async () => fire())
    expect(height()).toBe('168px')
    noteHeight = 90
    await act(async () => void window.dispatchEvent(new Event('resize')))
    expect(height()).toBe('90px')
  })
  it('DISMISSED ("Later"): the reservation is removed at once; the dismissal is still remembered and the notice is NOT hidden permanently by the layout fix', async () => {
    await mount()
    await act(async () => void window.dispatchEvent(beforeInstall()))
    expect(reserved()).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: PWA_MESSAGES.ru.later }))
    expect(screen.queryByTestId('pwa-install')).toBeNull()
    expect(reserved()).toBe(false)
    expect(height()).toBe('')
    expect(localStorage.getItem('bilup-pwa:install-dismissed')).toBe('1')
  })
  it('the notice keeps working while it reserves space: "Install" still calls the browser prompt and releases the space', async () => {
    await mount()
    const e = beforeInstall()
    await act(async () => void window.dispatchEvent(e))
    expect(screen.getByRole('button', { name: PWA_MESSAGES.ru.installAction })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: PWA_MESSAGES.ru.installAction }))
    expect(e.prompt).toHaveBeenCalledTimes(1)
    expect(reserved()).toBe(false)
  })
  it('UPDATE notice: reserves space too, and "Later" releases it', async () => {
    const h = handle()
    await mount(h)
    await act(async () => h.fire())
    expect(screen.getByTestId('pwa-update')).toBeTruthy()
    expect(reserved()).toBe(true)
    expect(height()).toBe('132px')
    fireEvent.click(screen.getByRole('button', { name: PWA_MESSAGES.ru.later }))
    expect(reserved()).toBe(false)
  })
  it('the update notice has priority over the install notice and only one reservation exists', async () => {
    const h = handle()
    await mount(h)
    await act(async () => void window.dispatchEvent(beforeInstall()))
    await act(async () => h.fire())
    expect(screen.queryByTestId('pwa-install')).toBeNull()
    expect(document.querySelectorAll('.pwa-note')).toHaveLength(1)
    expect(reserved()).toBe(true)
  })
  it('an installed / standalone app never reserves space', async () => {
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: q.includes('standalone'),
      media: q,
      addEventListener() {},
      removeEventListener() {},
    }))
    await mount()
    await act(async () => void window.dispatchEvent(beforeInstall()))
    expect(reserved()).toBe(false)
  })
  it('unmounting removes the class and the variable (nothing leaks onto <html>)', async () => {
    const view = await mount()
    await act(async () => void window.dispatchEvent(beforeInstall()))
    expect(reserved()).toBe(true)
    view.unmount()
    expect(reserved()).toBe(false)
    expect(height()).toBe('')
  })
})

describe('the CSS contract (pwa.css)', () => {
  const css = readFileSync('src/pwa/pwa.css', 'utf8')
  const base = readFileSync('src/styles/base.css', 'utf8')
  it('below 1024 px the main column gets the navigation reserve PLUS the notice height', () => {
    expect(css).toMatch(/html\.has-pwa-note \.main\s*\{[^}]*padding-bottom:[^;]*var\(--nav-h[^;]*var\(--pwa-note-h/)
  })
  it('from 1024 px (notice in the bottom-right corner) the main column gets the notice height too', () => {
    expect(css).toMatch(/@media \(min-width: 1024px\)\s*\{[^}]*html\.has-pwa-note \.main\s*\{[^}]*padding-bottom:[^;]*var\(--pwa-note-h/)
  })
  it('the rule is scoped to the visible-notice state only (specificity beats `.main` without touching the base rule) and the notice itself is still fixed, above the bottom navigation, not hidden', () => {
    expect(base).toMatch(/\.main \{ padding: 18px 16px calc\(var\(--nav-h\)/)
    expect(css).toMatch(/\.pwa-note \{[^}]*position: fixed/)
    expect(css).toMatch(/bottom: calc\(var\(--nav-h, 68px\)/)
    expect(css).not.toMatch(/\.pwa-note[^{]*\{[^}]*display:\s*none/)
  })
})
