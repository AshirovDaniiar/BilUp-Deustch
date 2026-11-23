/**
 * Mobile UX fix: below 1024px the install / update notice is rendered in the page flow (Layout's #pwa-slot) instead of floating over the page, so it can never cover a quiz button.
 * From 1024px it stays the fixed corner card with the reserved-space contract (tests/pwa/reserve-space.test.tsx). jsdom has no layout: these tests pin the contract and the CSS rules.
 */
import { act, render, screen } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppProvider } from '../../src/app/store'
import { PwaPrompt } from '../../src/pwa/PwaPrompt'

const root = document.documentElement
const beforeInstall = () => {
  const e = new Event('beforeinstallprompt', { cancelable: true }) as Event & { prompt: () => Promise<void> }
  e.prompt = vi.fn(async () => {})
  return e
}
const mount = async () => {
  render(
    <AppProvider>
      <PwaPrompt handle={null} />
    </AppProvider>,
  )
  await act(async () => {})
  await act(async () => void window.dispatchEvent(beforeInstall()))
}
const media = (narrow: boolean) =>
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: q.includes('max-width') ? narrow : false,
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
    onchange: null,
  }))

beforeEach(() => {
  localStorage.clear()
  document.body.innerHTML = '<div id="pwa-slot"></div>'
})
afterEach(() => {
  vi.unstubAllGlobals()
  root.classList.remove('has-pwa-note')
  root.style.removeProperty('--pwa-note-h')
})

describe('narrow screens: the notice is part of the page flow', () => {
  it('renders inside #pwa-slot, as an inline notice, and reserves nothing', async () => {
    media(true)
    await mount()
    const note = screen.getByTestId('pwa-install')
    expect(note.closest('#pwa-slot')).not.toBeNull()
    expect(note.classList.contains('pwa-note--inline')).toBe(true)
    expect(root.classList.contains('has-pwa-note')).toBe(false)
    expect(root.style.getPropertyValue('--pwa-note-h')).toBe('')
  })
  it('the dismiss action stays reachable and still dismisses (and remembers it)', async () => {
    media(true)
    await mount()
    const later = screen.getAllByRole('button').at(-1)!
    await act(async () => later.click())
    expect(screen.queryByTestId('pwa-install')).toBeNull()
    expect(localStorage.getItem('bilup-pwa:install-dismissed')).toBe('1')
  })
})

describe('wide screens and pages without the slot keep the fixed notice and the reserved space', () => {
  it('≥ 1024px: not in the slot, has-pwa-note reserved', async () => {
    media(false)
    await mount()
    const note = screen.getByTestId('pwa-install')
    expect(note.closest('#pwa-slot')).toBeNull()
    expect(note.classList.contains('pwa-note--inline')).toBe(false)
    expect(root.classList.contains('has-pwa-note')).toBe(true)
  })
  it('narrow but no slot in the page: falls back to the fixed notice', async () => {
    media(true)
    document.body.innerHTML = ''
    await mount()
    expect(screen.getByTestId('pwa-install').classList.contains('pwa-note--inline')).toBe(false)
    expect(root.classList.contains('has-pwa-note')).toBe(true)
  })
})

describe('CSS contract', () => {
  const css = (f: string) => readFileSync(join(__dirname, '../../src', f), 'utf8')
  it('the inline notice is a static block', () => {
    expect(css('pwa/pwa.css')).toMatch(/\.pwa-note--inline\s*\{[^}]*position:\s*static/)
  })
  it('the page column clips the slide-in transform instead of becoming sideways-scrollable', () => {
    expect(css('styles/base.css')).toMatch(/\.main\s*\{[^}]*overflow-x:\s*clip/)
  })
  it('the layout provides the slot at the top of <main>', () => {
    expect(css('app/Layout.tsx')).toMatch(/<main className="main" id="main">[\s\S]*?id="pwa-slot"/)
  })
})
