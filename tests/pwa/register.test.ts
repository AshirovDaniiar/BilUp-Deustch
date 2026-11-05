// @vitest-environment node
import { describe, expect, it, vi } from 'vitest'
import {
  DISABLED_KEY,
  disableShell,
  registerPwa,
  type PwaDeps,
  type RegistrationLike,
  type ServiceWorkerContainerLike,
} from '../../src/pwa/register'
import { FakeCaches, makeNet } from './fakes'

const PROGRESS_KEY = 'bilup-deutsch:v1'

type Listener = () => void
function fakeWorker(state = 'installing') {
  const l: Record<string, Listener[]> = {}
  return {
    state,
    posted: [] as unknown[],
    postMessage(m: unknown) {
      this.posted.push(m)
    },
    addEventListener(t: string, f: Listener) {
      ;(l[t] ??= []).push(f)
    },
    emit(t: string) {
      l[t]?.forEach(f => f())
    },
  }
}
type Worker = ReturnType<typeof fakeWorker>

function fakeReg(scope = 'https://app.example/') {
  const l: Record<string, Listener[]> = {}
  const reg = {
    scope,
    waiting: null as Worker | null,
    installing: null as Worker | null,
    unregistered: false,
    updates: 0,
    addEventListener(t: string, f: Listener) {
      ;(l[t] ??= []).push(f)
    },
    emit(t: string) {
      l[t]?.forEach(f => f())
    },
    async update() {
      reg.updates++
    },
    async unregister() {
      reg.unregistered = true
      return true
    },
  }
  return reg
}

function fakeSW(reg = fakeReg(), opts: { controller?: unknown; registerFails?: boolean } = {}) {
  const l: Record<string, Listener[]> = {}
  const sw = {
    controller: opts.controller ?? null,
    registered: [] as { url: string; scope?: string }[],
    regs: [reg] as ReturnType<typeof fakeReg>[],
    async register(url: string, o?: { scope?: string }) {
      if (opts.registerFails) throw new DOMException('SecurityError')
      sw.registered.push({ url, scope: o?.scope })
      return reg as unknown as RegistrationLike
    },
    async getRegistrations() {
      return sw.regs as unknown as RegistrationLike[]
    },
    addEventListener(t: string, f: Listener) {
      ;(l[t] ??= []).push(f)
    },
    emit(t: string) {
      l[t]?.forEach(f => f())
    },
  }
  return sw
}

function memStorage(initial: Record<string, string> = {}) {
  const m = new Map(Object.entries(initial))
  const touched: string[] = []
  return {
    m,
    touched,
    getItem: (k: string) => (touched.push(k), m.get(k) ?? null),
    setItem: (k: string, v: string) => (touched.push(k), void m.set(k, v)),
    removeItem: (k: string) => (touched.push(k), void m.delete(k)),
  }
}

function deps(over: Partial<PwaDeps> & { sw?: ReturnType<typeof fakeSW>; remote?: unknown | 'offline' | 'bad-json' | 404 } = {}) {
  const { sw = fakeSW(), remote = { enabled: true }, ...rest } = over
  const fetchCalls: string[] = []
  const d: PwaDeps = {
    serviceWorker: sw as unknown as ServiceWorkerContainerLike,
    caches: new FakeCaches(makeNet()).asCaches(),
    fetch: async url => {
      fetchCalls.push(url)
      if (remote === 'offline') throw new TypeError('offline')
      if (remote === 404) return new Response('', { status: 404 })
      if (remote === 'bad-json') return new Response('{nope', { status: 200 })
      return new Response(JSON.stringify(remote), { status: 200 })
    },
    storage: memStorage(),
    search: '',
    base: '/',
    buildDisabled: false,
    isDev: false,
    reload: vi.fn(),
    ...rest,
  }
  return { d, sw, fetchCalls }
}

describe('registration', () => {
  it('registers /sw.js with the root scope when enabled', async () => {
    const { d, sw } = deps()
    const h = await registerPwa(d)
    expect(h.status).toBe('registered')
    expect(sw.registered).toEqual([{ url: '/sw.js', scope: '/' }])
  })

  it('REGISTRATION FAILURE: never throws, reports "failed", app continues', async () => {
    const { d } = deps({ sw: fakeSW(fakeReg(), { registerFails: true }) })
    await expect(registerPwa(d)).resolves.toMatchObject({ status: 'failed' })
    const h = await registerPwa(d)
    expect(h.updateReady()).toBe(false)
    expect(() => h.applyUpdate()).not.toThrow()
    await expect(h.checkForUpdate()).resolves.toBeUndefined()
  })

  it('no service worker support (insecure context / old browser) → "unsupported", nothing else happens', async () => {
    const { d, fetchCalls } = deps({ serviceWorker: undefined })
    expect((await registerPwa(d)).status).toBe('unsupported')
    expect(fetchCalls).toEqual([])
  })

  it('cache storage unavailable does not prevent registration', async () => {
    const { d } = deps({ caches: undefined })
    expect((await registerPwa(d)).status).toBe('registered')
  })

  it('a throwing storage or throwing fetch never breaks startup', async () => {
    const bad = {
      getItem: () => {
        throw new Error('x')
      },
      setItem: () => {
        throw new Error('x')
      },
      removeItem: () => {
        throw new Error('x')
      },
    }
    const { d } = deps({ storage: bad, remote: 'offline' })
    expect((await registerPwa(d)).status).toBe('registered')
  })
})

describe('kill-switch', () => {
  it('build flag (VITE_PWA_DISABLED): no registration, existing registrations and shell caches removed', async () => {
    const reg = fakeReg()
    const sw = fakeSW(reg)
    const caches = new FakeCaches(makeNet())
    await caches.open('bilup-shell-old')
    await caches.open('foreign-cache')
    const { d } = deps({ sw, caches: caches.asCaches(), buildDisabled: true })
    expect((await registerPwa(d)).status).toBe('disabled-build')
    expect(sw.registered).toEqual([])
    expect(reg.unregistered).toBe(true)
    expect(caches.names).toEqual(['foreign-cache'])
  })

  it('development server: never leaves a production worker active', async () => {
    const reg = fakeReg('http://localhost:5173/')
    const { d, sw } = deps({ sw: fakeSW(reg), isDev: true })
    expect((await registerPwa(d)).status).toBe('disabled-build')
    expect(sw.registered).toEqual([])
    expect(reg.unregistered).toBe(true)
  })

  it('local switch ?pwa=off disables, is remembered, and cleans up', async () => {
    const reg = fakeReg()
    const storage = memStorage()
    const caches = new FakeCaches(makeNet())
    await caches.open('bilup-shell-x')
    const first = deps({ sw: fakeSW(reg), storage, search: '?pwa=off', caches: caches.asCaches() })
    expect((await registerPwa(first.d)).status).toBe('disabled-local')
    expect(storage.m.get(DISABLED_KEY)).toBe('1')
    expect(reg.unregistered).toBe(true)
    expect(caches.names).toEqual([])
    // next visit without the query parameter: still off
    const second = deps({ storage, search: '' })
    expect((await registerPwa(second.d)).status).toBe('disabled-local')
    expect(second.sw.registered).toEqual([])
  })

  it('?pwa=on re-enables', async () => {
    const storage = memStorage({ [DISABLED_KEY]: '1' })
    const { d, sw } = deps({ storage, search: '?pwa=on' })
    expect((await registerPwa(d)).status).toBe('registered')
    expect(storage.m.has(DISABLED_KEY)).toBe(false)
    expect(sw.registered).toHaveLength(1)
  })

  it('remote switch pwa-config.json {"enabled": false} disables without a redeploy of the app code', async () => {
    const reg = fakeReg()
    const { d, fetchCalls } = deps({ sw: fakeSW(reg), remote: { enabled: false } })
    expect((await registerPwa(d)).status).toBe('disabled-remote')
    expect(fetchCalls).toEqual(['/pwa-config.json'])
    expect(reg.unregistered).toBe(true)
  })

  it('remote config unreachable / 404 / malformed / enabled:true → keeps working (no opinion ≠ off)', async () => {
    for (const remote of ['offline', 404, 'bad-json', { enabled: true }, {}, { enabled: 'no' }] as const) {
      const { d } = deps({ remote })
      expect((await registerPwa(d)).status, String(JSON.stringify(remote))).toBe('registered')
    }
  })

  it('remote config is fetched uncached', async () => {
    const seen: (RequestInit | undefined)[] = []
    const { d } = deps()
    await registerPwa({ ...d, fetch: async (_u, init) => (seen.push(init), new Response('{"enabled":true}')) })
    expect(seen[0]?.cache).toBe('no-store')
  })

  it('disabling never touches learner progress or any non-PWA storage key', async () => {
    const storage = memStorage({ [PROGRESS_KEY]: '{"xp":42}' })
    const { d } = deps({ storage, search: '?pwa=off', remote: { enabled: false } })
    await registerPwa(d)
    const { d: d2 } = deps({ storage, buildDisabled: true })
    await registerPwa(d2)
    expect(storage.m.get(PROGRESS_KEY)).toBe('{"xp":42}')
    expect(storage.touched.filter(k => !k.startsWith('bilup-pwa:'))).toEqual([])
  })

  it('normal operation never reads or writes the progress key either', async () => {
    const storage = memStorage({ [PROGRESS_KEY]: '{"xp":1}' })
    const { d } = deps({ storage })
    await registerPwa(d)
    expect(storage.touched.every(k => k.startsWith('bilup-pwa:'))).toBe(true)
  })

  it('disableShell only removes registrations inside our scope and caches with our prefix', async () => {
    const mine = fakeReg('https://app.example/')
    const other = fakeReg('https://app.example/other-app/')
    const sw = fakeSW(mine)
    sw.regs = [mine, other]
    const caches = new FakeCaches(makeNet())
    await caches.open('bilup-shell-1')
    await caches.open('keep-me')
    await disableShell({ serviceWorker: sw as unknown as ServiceWorkerContainerLike, caches: caches.asCaches(), base: '/' })
    expect(mine.unregistered).toBe(true)
    // with base "/" every path is "inside"; narrow the base to prove the filter works
    const a = fakeReg('https://app.example/til/')
    const b = fakeReg('https://app.example/other/')
    const sw2 = fakeSW(a)
    sw2.regs = [a, b]
    await disableShell({ serviceWorker: sw2 as unknown as ServiceWorkerContainerLike, caches: caches.asCaches(), base: '/til/' })
    expect(a.unregistered).toBe(true)
    expect(b.unregistered).toBe(false)
    expect(caches.names).toEqual(['keep-me'])
  })
})

describe('update behaviour', () => {
  it('first ever install (no controller) is NOT announced as an update', async () => {
    const reg = fakeReg()
    const sw = fakeSW(reg, { controller: null })
    const h = await registerPwa(deps({ sw }).d)
    const cb = vi.fn()
    h.onUpdateReady(cb)
    const w = fakeWorker()
    reg.installing = w
    reg.emit('updatefound')
    w.state = 'installed'
    w.emit('statechange')
    expect(cb).not.toHaveBeenCalled()
    expect(h.updateReady()).toBe(false)
  })

  it('a new version installed while a controller exists → "update ready"', async () => {
    const reg = fakeReg()
    const sw = fakeSW(reg, { controller: {} })
    const h = await registerPwa(deps({ sw }).d)
    const cb = vi.fn()
    h.onUpdateReady(cb)
    const w = fakeWorker()
    reg.installing = w
    reg.waiting = w
    reg.emit('updatefound')
    w.state = 'installed'
    w.emit('statechange')
    expect(cb).toHaveBeenCalledTimes(1)
    expect(h.updateReady()).toBe(true)
  })

  it('an update already waiting when the page loads is announced immediately to late subscribers', async () => {
    const reg = fakeReg()
    reg.waiting = fakeWorker('installed')
    const h = await registerPwa(deps({ sw: fakeSW(reg, { controller: {} }) }).d)
    const cb = vi.fn()
    h.onUpdateReady(cb)
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('unsubscribe stops notifications', async () => {
    const reg = fakeReg()
    const h = await registerPwa(deps({ sw: fakeSW(reg, { controller: {} }) }).d)
    const cb = vi.fn()
    const off = h.onUpdateReady(cb)
    off()
    const w = fakeWorker()
    reg.installing = w
    reg.emit('updatefound')
    w.state = 'installed'
    w.emit('statechange')
    expect(cb).not.toHaveBeenCalled()
  })

  it('applyUpdate asks the waiting worker to skip waiting — and does NOT reload by itself', async () => {
    const reg = fakeReg()
    const w = fakeWorker('installed')
    reg.waiting = w
    const { d } = deps({ sw: fakeSW(reg, { controller: {} }) })
    const h = await registerPwa(d)
    h.applyUpdate()
    expect(w.posted).toEqual([{ type: 'SKIP_WAITING' }])
    expect(d.reload).not.toHaveBeenCalled()
  })

  it('when the new worker takes control the page reloads exactly once', async () => {
    const reg = fakeReg()
    const sw = fakeSW(reg, { controller: {} })
    const { d } = deps({ sw })
    await registerPwa(d)
    sw.emit('controllerchange')
    sw.emit('controllerchange')
    expect(d.reload).toHaveBeenCalledTimes(1)
  })

  it('checkForUpdate asks the browser to re-fetch sw.js, and swallows offline errors', async () => {
    const reg = fakeReg()
    const h = await registerPwa(deps({ sw: fakeSW(reg) }).d)
    await h.checkForUpdate()
    expect(reg.updates).toBe(1)
    reg.update = async () => {
      throw new TypeError('offline')
    }
    await expect(h.checkForUpdate()).resolves.toBeUndefined()
  })
})
