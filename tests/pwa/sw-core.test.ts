// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CACHE_PREFIX, cacheNameFor, createShell, deleteShellCaches } from '../../src/pwa/sw-core'
import { FakeCaches, makeNet, netFetch, req } from './fakes'

const SCOPE = 'https://app.example/'
const FILES = ['index.html', 'assets/app-abc.js', 'assets/app-abc.css', 'favicon.svg', 'manifest.webmanifest']
const routes = (v: string) => Object.fromEntries(FILES.map(f => [SCOPE + f, `${v}:${f}`]))

function setup(version = 'v1', extra: Record<string, string> = {}) {
  const net = makeNet({ ...routes(version), ...extra })
  const caches = new FakeCaches(net)
  const shell = createShell({ caches: caches.asCaches(), fetch: netFetch(net), config: { version, precache: FILES, scope: SCOPE } })
  return { net, caches, shell }
}
const text = async (p: Promise<Response> | null) => (await p!).text()

afterEach(() => vi.useRealTimers())

describe('cache versioning', () => {
  it('names the cache from the version with a fixed prefix', () => {
    expect(cacheNameFor('abc123')).toBe(`${CACHE_PREFIX}abc123`)
    expect(setup('abc123').shell.cacheName).toBe('bilup-shell-abc123')
  })

  it('resolves precache entries against the scope', () => {
    expect(setup().shell.precacheUrls).toContain(SCOPE + 'assets/app-abc.js')
    expect(setup().shell.precacheUrls).toHaveLength(FILES.length)
  })
})

describe('install', () => {
  it('fills the versioned cache with every shell file', async () => {
    const { caches, shell } = setup('v1')
    await shell.install()
    expect(caches.names).toEqual(['bilup-shell-v1'])
    expect(caches.cache('bilup-shell-v1').store.size).toBe(FILES.length)
  })

  it('is all-or-nothing: one failing file → install rejects and NO partial cache is left', async () => {
    const { caches, shell, net } = setup('v1')
    net.routes.delete(SCOPE + 'assets/app-abc.js')
    await expect(shell.install()).rejects.toThrow()
    expect(caches.names).toEqual([])
  })

  it('offline install rejects (the previous worker stays in charge)', async () => {
    const { net, shell, caches } = setup()
    net.offline = true
    await expect(shell.install()).rejects.toThrow()
    expect(caches.names).toEqual([])
  })
})

describe('activation and cache cleanup', () => {
  it('deletes older shell caches and keeps the current one', async () => {
    const { caches, shell } = setup('v2')
    await caches.open('bilup-shell-v0')
    await caches.open('bilup-shell-v1')
    await shell.install()
    const deleted = await shell.activate()
    expect(deleted.sort()).toEqual(['bilup-shell-v0', 'bilup-shell-v1'])
    expect(caches.names).toEqual(['bilup-shell-v2'])
  })

  it('never touches caches that are not ours', async () => {
    const { caches, shell } = setup('v2')
    await caches.open('workbox-precache-v2')
    await caches.open('someone-elses')
    await shell.install()
    await shell.activate()
    expect(caches.names.sort()).toEqual(['bilup-shell-v2', 'someone-elses', 'workbox-precache-v2'])
  })

  it('deleteShellCaches without a keep-name removes all of ours (used by the kill-switch)', async () => {
    const { caches } = setup()
    await caches.open('bilup-shell-a')
    await caches.open('bilup-shell-b')
    await caches.open('other')
    expect((await deleteShellCaches(caches.asCaches())).sort()).toEqual(['bilup-shell-a', 'bilup-shell-b'])
    expect(caches.names).toEqual(['other'])
  })

  it('a worker that is not waiting-for-user never calls skipWaiting by itself (message contract)', () => {
    const { shell } = setup()
    expect(shell.parseMessage({ type: 'SKIP_WAITING' })).toBe('skip-waiting')
    for (const bad of [null, undefined, 'SKIP_WAITING', {}, { type: 'OTHER' }, { type: 'skip_waiting' }, 42])
      expect(shell.parseMessage(bad)).toBeNull()
  })
})

describe('what the worker may intercept (safety rules)', () => {
  const { shell } = setup()
  const verdict = (url: string, init?: Parameters<typeof req>[1]) => shell.classify(req(url, init))

  it('precached assets and the app-root navigation only', () => {
    expect(verdict(SCOPE + 'assets/app-abc.js')).toBe('asset')
    expect(verdict(SCOPE + 'assets/app-abc.js?v=1')).toBe('asset')
    expect(verdict(SCOPE, { mode: 'navigate' })).toBe('navigation')
    expect(verdict(SCOPE + 'index.html', { mode: 'navigate' })).toBe('navigation')
  })

  it('ignores everything else: unknown files, other navigations, other origins', () => {
    expect(verdict(SCOPE + 'assets/unknown.js')).toBe('ignore')
    expect(verdict(SCOPE + 'some/other/page', { mode: 'navigate' })).toBe('ignore')
    expect(verdict('https://cdn.example/assets/app-abc.js')).toBe('ignore')
    expect(verdict('not a url')).toBe('ignore')
  })

  it.each(['POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'])('ignores %s', method => {
    expect(verdict(SCOPE + 'assets/app-abc.js', { method })).toBe('ignore')
  })

  it.each([
    'api/progress',
    'auth/login',
    'login',
    'account/me',
    'pay/confirm',
    'payments/webhook',
    'checkout',
    'billing/invoices',
    'subscription/status',
    'entitlements/check',
    'tutor/ask',
    'ai/chat',
    'live/session/1',
    'stream/abc',
    'video/room',
    'ws',
    'webhooks/provider',
  ])('never intercepts %s (API / auth / payment / tutor / live / stream)', path => {
    expect(verdict(SCOPE + path)).toBe('ignore')
    expect(verdict(SCOPE + path, { mode: 'navigate' })).toBe('ignore')
  })

  it('never intercepts requests carrying credentials-style headers or Range', () => {
    expect(verdict(SCOPE + 'assets/app-abc.js', { headers: { authorization: 'Bearer x' } })).toBe('ignore')
    expect(verdict(SCOPE + 'assets/app-abc.js', { headers: { range: 'bytes=0-9' } })).toBe('ignore')
  })

  it('handleFetch returns null (browser handles it) for ignored requests, without touching network or cache', async () => {
    const s = setup()
    await s.shell.install()
    const before = s.net.calls.length
    expect(s.shell.handleFetch(req(SCOPE + 'api/x'))).toBeNull()
    expect(s.shell.handleFetch(req(SCOPE + 'tutor/ask', { method: 'POST' }))).toBeNull()
    expect(s.net.calls.length).toBe(before)
  })
})

describe('serving the shell', () => {
  it('precached asset: cache first (no network)', async () => {
    const s = setup('v1')
    await s.shell.install()
    s.net.calls.length = 0
    expect(await text(s.shell.handleFetch(req(SCOPE + 'assets/app-abc.js')))).toBe('v1:assets/app-abc.js')
    expect(s.net.calls).toEqual([])
  })

  it('precached asset works offline', async () => {
    const s = setup('v1')
    await s.shell.install()
    s.net.offline = true
    expect(await text(s.shell.handleFetch(req(SCOPE + 'favicon.svg')))).toBe('v1:favicon.svg')
  })

  it('cache storage unavailable → falls through to the network instead of failing', async () => {
    const s = setup('v1')
    s.caches.broken = true
    expect(await text(s.shell.handleFetch(req(SCOPE + 'assets/app-abc.css')))).toBe('v1:assets/app-abc.css')
  })

  it('navigation online: network wins (a new deploy is seen immediately)', async () => {
    const s = setup('v1')
    await s.shell.install()
    s.net.routes.set(SCOPE, () => new Response('NEW HTML'))
    expect(await text(s.shell.handleFetch(req(SCOPE, { mode: 'navigate' })))).toBe('NEW HTML')
  })

  it('OFFLINE SHELL FALLBACK: navigation offline → cached index.html', async () => {
    const s = setup('v1')
    await s.shell.install()
    s.net.offline = true
    expect(await text(s.shell.handleFetch(req(SCOPE, { mode: 'navigate' })))).toBe('v1:index.html')
    expect(await text(s.shell.handleFetch(req(SCOPE + 'index.html', { mode: 'navigate' })))).toBe('v1:index.html')
  })

  it('navigation with a slow network (> timeout) → cached shell', async () => {
    vi.useFakeTimers()
    const s = setup('v1')
    await s.shell.install()
    s.net.routes.set(SCOPE, () => new Response('late'))
    const slow = createShell({
      caches: s.caches.asCaches(),
      fetch: () => new Promise(() => {}), // never answers
      config: { version: 'v1', precache: FILES, scope: SCOPE, navigationTimeoutMs: 1000 },
    })
    const p = slow.handleFetch(req(SCOPE, { mode: 'navigate' }))!
    await vi.advanceTimersByTimeAsync(1000)
    expect(await (await p).text()).toBe('v1:index.html')
  })

  it('navigation answered with a server error (5xx) → cached shell instead of an error page', async () => {
    const s = setup('v1')
    await s.shell.install()
    s.net.routes.set(SCOPE, () => new Response('oops', { status: 503 }))
    expect(await text(s.shell.handleFetch(req(SCOPE, { mode: 'navigate' })))).toBe('v1:index.html')
  })

  it('navigation offline with NO cache yet (first visit, install failed) → the network error propagates, nothing invented', async () => {
    const s = setup('v1')
    s.net.offline = true
    await expect(s.shell.handleFetch(req(SCOPE, { mode: 'navigate' }))!).rejects.toThrow('Failed to fetch')
  })

  it('does NOT cache at runtime: serving requests never writes to the cache', async () => {
    const s = setup('v1')
    await s.shell.install()
    s.net.routes.set(SCOPE, () => new Response('NEW HTML'))
    await text(s.shell.handleFetch(req(SCOPE, { mode: 'navigate' })))
    await text(s.shell.handleFetch(req(SCOPE + 'assets/app-abc.js')))
    expect(s.caches.cache('bilup-shell-v1').puts).toEqual([])
  })

  it('an old cached shell keeps working while a newer version is not yet active', async () => {
    const old = setup('v1')
    await old.shell.install()
    old.net.offline = true
    // the page of version 1 asks for its own hashed assets and gets them even though routes now serve "v2"
    expect(await text(old.shell.handleFetch(req(SCOPE + 'assets/app-abc.js')))).toBe('v1:assets/app-abc.js')
  })
})
