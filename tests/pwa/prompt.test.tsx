import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppProvider } from '../../src/app/store'
import { PwaPrompt } from '../../src/pwa/PwaPrompt'
import { PWA_MESSAGES } from '../../src/pwa/messages'
import type { PwaHandle } from '../../src/pwa/register'

const PROGRESS_KEY = 'bilup-deutsch:v1'

function handle(over: Partial<PwaHandle> = {}) {
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
    ...over,
  }
  return h
}

const mount = async (h: PwaHandle | null) => {
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

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('update notice', () => {
  it('renders nothing by default (no registration, no events)', async () => {
    const { container } = await mount(null)
    expect(container.querySelector('.pwa-note')).toBeNull()
  })

  it('appears when an update is ready, in the interface language, and "Update" applies it', async () => {
    const h = handle()
    await mount(h)
    expect(screen.queryByTestId('pwa-update')).toBeNull()
    await act(async () => h.fire())
    expect(screen.getByTestId('pwa-update')).toBeTruthy()
    expect(screen.getByText(PWA_MESSAGES.ru.updateTitle)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: PWA_MESSAGES.ru.updateAction }))
    expect(h.applyUpdate).toHaveBeenCalledTimes(1)
  })

  it('"Later" hides it for this session without applying (no mid-lesson reload)', async () => {
    const h = handle()
    await mount(h)
    await act(async () => h.fire())
    fireEvent.click(screen.getByRole('button', { name: PWA_MESSAGES.ru.later }))
    expect(screen.queryByTestId('pwa-update')).toBeNull()
    expect(h.applyUpdate).not.toHaveBeenCalled()
  })

  it('uses the learner’s interface language (German)', async () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ lang: 'de' }))
    const h = handle()
    await mount(h)
    await act(async () => h.fire())
    expect(screen.getByText(PWA_MESSAGES.de.updateTitle)).toBeTruthy()
  })

  it('every language has every message (no silent fallback inside the module)', () => {
    const keys = Object.keys(PWA_MESSAGES.ru).sort()
    for (const lang of ['ky', 'de'] as const) {
      expect(Object.keys(PWA_MESSAGES[lang]).sort()).toEqual(keys)
      for (const v of Object.values(PWA_MESSAGES[lang])) expect(v.trim()).not.toBe('')
    }
  })

  it('buttons are real <button type="button"> elements (keyboard and touch accessible)', async () => {
    const h = handle()
    await mount(h)
    await act(async () => h.fire())
    for (const b of screen.getAllByRole('button')) expect(b.getAttribute('type')).toBe('button')
    expect(screen.getByTestId('pwa-update').getAttribute('role')).toBe('status')
  })

  it('checks for updates when the tab becomes visible again', async () => {
    const h = handle()
    await mount(h)
    document.dispatchEvent(new Event('visibilitychange'))
    expect(h.checkForUpdate).toHaveBeenCalled()
  })
})

describe('install notice', () => {
  it('captures beforeinstallprompt, prevents the browser mini-infobar and offers an Install button', async () => {
    await mount(null)
    const e = beforeInstall()
    await act(async () => void window.dispatchEvent(e))
    expect(e.defaultPrevented).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: PWA_MESSAGES.ru.installAction }))
    expect(e.prompt).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('pwa-install')).toBeNull()
  })

  it('"Later" is remembered under a PWA-only key and never touches learner progress', async () => {
    localStorage.setItem(PROGRESS_KEY, '{"xp":7}')
    await mount(null)
    await act(async () => void window.dispatchEvent(beforeInstall()))
    fireEvent.click(screen.getByRole('button', { name: PWA_MESSAGES.ru.later }))
    expect(screen.queryByTestId('pwa-install')).toBeNull()
    expect(localStorage.getItem('bilup-pwa:install-dismissed')).toBe('1')
    expect(JSON.parse(localStorage.getItem(PROGRESS_KEY)!).xp).toBe(7)
  })

  it('stays hidden once dismissed in an earlier visit', async () => {
    localStorage.setItem('bilup-pwa:install-dismissed', '1')
    await mount(null)
    await act(async () => void window.dispatchEvent(beforeInstall()))
    expect(screen.queryByTestId('pwa-install')).toBeNull()
  })

  it('is not offered when the app already runs standalone', async () => {
    vi.stubGlobal('matchMedia', (q: string) => ({
      matches: q.includes('standalone'),
      media: q,
      addEventListener() {},
      removeEventListener() {},
    }))
    await mount(null)
    await act(async () => void window.dispatchEvent(beforeInstall()))
    expect(screen.queryByTestId('pwa-install')).toBeNull()
  })

  it('disappears after the app is installed', async () => {
    await mount(null)
    await act(async () => void window.dispatchEvent(beforeInstall()))
    expect(screen.getByTestId('pwa-install')).toBeTruthy()
    await act(async () => void window.dispatchEvent(new Event('appinstalled')))
    expect(screen.queryByTestId('pwa-install')).toBeNull()
  })

  it('does not promise offline lessons in the install text', () => {
    for (const lang of ['ru', 'ky', 'de'] as const) expect(PWA_MESSAGES[lang].installBody.length).toBeGreaterThan(10)
    expect(PWA_MESSAGES.ru.installBody).toMatch(/интернет/)
    expect(PWA_MESSAGES.de.installBody).toMatch(/Internet/)
  })
})

describe('iOS Safari hint', () => {
  const ua =
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'

  it('shows the Add-to-Home-Screen instructions on iPhone Safari (no install event exists there)', async () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(ua)
    await mount(null)
    expect(screen.getByTestId('pwa-ios')).toBeTruthy()
  })

  it('not on Chrome for iOS (CriOS)', async () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue(ua + ' CriOS/120')
    const first = await mount(null)
    expect(screen.queryByTestId('pwa-ios')).toBeNull()
    first.unmount()
  })
})
