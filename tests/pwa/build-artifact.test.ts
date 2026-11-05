// @vitest-environment node
import { mkdtempSync, existsSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, relative } from 'node:path'
import { runInNewContext } from 'node:vm'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { build } from 'vite'
import { buildShellManifest } from '../../scripts/pwa/vite-plugin'
import { FakeCaches, makeNet, netFetch, type Net } from './fakes'

/**
 * Builds the real application (twice normally, once with the kill-switch flag) into temporary directories — never into dist/ —
 * and then EXECUTES the generated sw.js in a sandbox against fake caches/network. This tests the artifact that ships,
 * not just the source it was generated from.
 */
const root = join(__dirname, '../..')
const tmp = mkdtempSync(join(tmpdir(), 'bilup-pwa-'))
const out = { a: join(tmp, 'a'), b: join(tmp, 'b'), kill: join(tmp, 'kill') }
const SCOPE = 'https://app.example/'

async function runBuild(outDir: string, kill = false) {
  const prev = process.env.VITE_PWA_KILL
  if (kill) process.env.VITE_PWA_KILL = 'true'
  else delete process.env.VITE_PWA_KILL
  try {
    await build({ root, configFile: join(root, 'vite.config.ts'), logLevel: 'silent', build: { outDir, emptyOutDir: true } })
  } finally {
    if (prev === undefined) delete process.env.VITE_PWA_KILL
    else process.env.VITE_PWA_KILL = prev
  }
}

beforeAll(async () => {
  await runBuild(out.a)
  await runBuild(out.b)
  await runBuild(out.kill, true)
}, 120_000)
afterAll(() => rmSync(tmp, { recursive: true, force: true }))

const readJson = (dir: string, f: string) => JSON.parse(readFileSync(join(dir, f), 'utf8'))
const files = (dir: string, base = dir): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? files(join(dir, e.name), base) : [relative(base, join(dir, e.name)).replaceAll('\\', '/')],
  )

/** Serve a built directory as the network. */
const netFor = (dir: string): Net => makeNet(Object.fromEntries(files(dir).map(f => [SCOPE + f, readFileSync(join(dir, f), 'utf8')])))

function runWorker(dir: string, caches: FakeCaches, net: Net) {
  const listeners: Record<string, (e: unknown) => void> = {}
  const self = {
    registration: { scope: SCOPE, unregister: vi.fn(async () => true) },
    skipWaiting: vi.fn(async () => {}),
    clients: { claim: vi.fn(async () => {}) },
    addEventListener: (t: string, f: (e: unknown) => void) => {
      listeners[t] = f
    },
  }
  runInNewContext(readFileSync(join(dir, 'sw.js'), 'utf8'), {
    self,
    caches: caches.asCaches(),
    fetch: netFetch(net),
    Request,
    Response,
    URL,
    setTimeout,
    clearTimeout,
  })
  const lifecycle = async (type: 'install' | 'activate') => {
    let p: Promise<unknown> = Promise.resolve()
    listeners[type]({ waitUntil: (x: Promise<unknown>) => (p = x) })
    await p
  }
  const fetchEvent = (url: string, mode = 'no-cors') => {
    let response: Promise<Response> | undefined
    listeners.fetch({
      request: { url, method: 'GET', mode, headers: { get: () => null } },
      respondWith: (p: Promise<Response>) => (response = p),
    })
    return response
  }
  return { self, listeners, lifecycle, fetchEvent }
}

describe('generated sw.js (normal build)', () => {
  it('writes sw.js, pwa-config.json and the build record next to the app; manifest and icon are copied', () => {
    for (const f of ['sw.js', 'pwa-config.json', 'pwa-build.json', 'manifest.webmanifest', 'favicon.svg', 'index.html'])
      expect(existsSync(join(out.a, f)), f).toBe(true)
    expect(readJson(out.a, 'pwa-config.json')).toEqual({ enabled: true })
    expect(readFileSync(join(out.a, 'index.html'), 'utf8')).toContain('rel="manifest"')
  })

  it('precache list = the shell files that exist on disk; sw.js, config and the build record are excluded', () => {
    const rec = readJson(out.a, 'pwa-build.json')
    expect(rec.kill).toBe(false)
    expect(rec.precache).toEqual(expect.arrayContaining(['index.html', 'manifest.webmanifest', 'favicon.svg']))
    expect(rec.precache.some((p: string) => /^assets\/.+\.js$/.test(p))).toBe(true)
    expect(rec.precache.some((p: string) => /^assets\/.+\.css$/.test(p))).toBe(true)
    for (const p of rec.precache) expect(existsSync(join(out.a, p)), p).toBe(true)
    expect(rec.precache).not.toContain('sw.js')
    expect(rec.precache).not.toContain('pwa-config.json')
    expect(rec.precache).not.toContain('pwa-build.json') // written after the list was computed → never cached
  })

  it('the version is deterministic: identical sources → identical version and list', () => {
    const a = readJson(out.a, 'pwa-build.json')
    const b = readJson(out.b, 'pwa-build.json')
    expect(a.version).toMatch(/^[0-9a-f]{12}$/)
    expect(b.version).toBe(a.version)
    expect(b.precache).toEqual(a.precache)
  })

  it('install → one versioned cache holding exactly the shell; no skipWaiting on its own', async () => {
    const net = netFor(out.a)
    const caches = new FakeCaches(net)
    const w = runWorker(out.a, caches, net)
    await w.lifecycle('install')
    const { version, precache } = readJson(out.a, 'pwa-build.json')
    expect(caches.names).toEqual([`bilup-shell-${version}`])
    expect(caches.cache(`bilup-shell-${version}`).store.size).toBe(precache.length)
    expect(w.self.skipWaiting).not.toHaveBeenCalled()
  })

  it('activate → claims clients and removes older shell caches only', async () => {
    const net = netFor(out.a)
    const caches = new FakeCaches(net)
    await caches.open('bilup-shell-OLDVERSION')
    await caches.open('unrelated')
    const w = runWorker(out.a, caches, net)
    await w.lifecycle('install')
    await w.lifecycle('activate')
    const { version } = readJson(out.a, 'pwa-build.json')
    expect(caches.names.sort()).toEqual([`bilup-shell-${version}`, 'unrelated'].sort())
    expect(w.self.clients.claim).toHaveBeenCalledTimes(1)
  })

  it('offline: the app root and its assets come from the cache (offline application shell)', async () => {
    const net = netFor(out.a)
    const caches = new FakeCaches(net)
    const w = runWorker(out.a, caches, net)
    await w.lifecycle('install')
    await w.lifecycle('activate')
    net.offline = true
    const html = await (await w.fetchEvent(SCOPE, 'navigate'))!.text()
    expect(html).toBe(readFileSync(join(out.a, 'index.html'), 'utf8'))
    const js = readJson(out.a, 'pwa-build.json').precache.find((p: string) => p.endsWith('.js') && p.startsWith('assets/'))
    expect((await w.fetchEvent(SCOPE + js))!.status).toBe(200)
  })

  it('the shipped worker ignores API-like and foreign requests (no respondWith)', async () => {
    const net = netFor(out.a)
    const w = runWorker(out.a, new FakeCaches(net), net)
    await w.lifecycle('install')
    expect(w.fetchEvent(SCOPE + 'api/progress')).toBeUndefined()
    expect(w.fetchEvent(SCOPE + 'tutor/ask')).toBeUndefined()
    expect(w.fetchEvent('https://elsewhere.example/assets/x.js')).toBeUndefined()
  })

  it('SKIP_WAITING message activates the waiting worker; other messages are ignored', () => {
    const net = netFor(out.a)
    const w = runWorker(out.a, new FakeCaches(net), net)
    w.listeners.message({ data: { type: 'nope' } })
    expect(w.self.skipWaiting).not.toHaveBeenCalled()
    w.listeners.message({ data: { type: 'SKIP_WAITING' } })
    expect(w.self.skipWaiting).toHaveBeenCalledTimes(1)
  })

  it('failed install (a file unreachable) leaves no cache and rejects', async () => {
    const net = netFor(out.a)
    const caches = new FakeCaches(net)
    const w = runWorker(out.a, caches, net)
    net.routes.delete(SCOPE + 'manifest.webmanifest')
    await expect(w.lifecycle('install')).rejects.toThrow()
    expect(caches.names).toEqual([])
  })
})

describe('generated sw.js (kill-switch build, VITE_PWA_KILL=true)', () => {
  it('replaces sw.js at the SAME URL and publishes enabled:false', () => {
    expect(existsSync(join(out.kill, 'sw.js'))).toBe(true)
    expect(readJson(out.kill, 'pwa-config.json')).toEqual({ enabled: false })
    expect(readJson(out.kill, 'pwa-build.json').kill).toBe(true)
  })

  it('has no fetch handler (can never serve or break a response) and no message/precache logic', () => {
    const w = runWorker(out.kill, new FakeCaches(makeNet()), makeNet())
    expect(Object.keys(w.listeners).sort()).toEqual(['activate', 'install'])
  })

  it('install: takes over immediately; activate: clears our caches, unregisters itself, leaves foreign caches, does not claim/reload clients', async () => {
    const net = makeNet()
    const caches = new FakeCaches(net)
    await caches.open('bilup-shell-abc')
    await caches.open('bilup-shell-def')
    await caches.open('someone-elses')
    const w = runWorker(out.kill, caches, net)
    await w.lifecycle('install')
    expect(w.self.skipWaiting).toHaveBeenCalledTimes(1)
    await w.lifecycle('activate')
    expect(caches.names).toEqual(['someone-elses'])
    expect(w.self.registration.unregister).toHaveBeenCalledTimes(1)
    expect(w.self.clients.claim).not.toHaveBeenCalled()
  })

  it('still unregisters when cache storage is broken', async () => {
    const caches = new FakeCaches(makeNet())
    caches.broken = true
    const w = runWorker(out.kill, caches, makeNet())
    await w.lifecycle('activate')
    expect(w.self.registration.unregister).toHaveBeenCalled()
  })
})

describe('buildShellManifest (version = content hash of the shell)', () => {
  const base = [
    { path: 'index.html', content: '<html>' },
    { path: 'assets/a-1.js', content: 'a' },
    { path: 'sw.js', content: 'ignored' },
    { path: 'pwa-config.json', content: '{}' },
    { path: 'assets/a-1.js.map', content: 'map' },
  ]

  it('excludes the worker, the config and source maps; sorts the list', () => {
    expect(buildShellManifest(base).precache).toEqual(['assets/a-1.js', 'index.html'])
  })

  it('the version changes when any shell file changes, even a non-hashed one', () => {
    const v = buildShellManifest(base).version
    expect(buildShellManifest(base.map(f => (f.path === 'index.html' ? { ...f, content: '<html>2' } : f))).version).not.toBe(v)
    expect(buildShellManifest([...base, { path: 'favicon.svg', content: 'x' }]).version).not.toBe(v)
  })

  it('the version does not depend on input order and ignores excluded files', () => {
    const v = buildShellManifest(base).version
    expect(buildShellManifest([...base].reverse()).version).toBe(v)
    expect(buildShellManifest(base.map(f => (f.path === 'sw.js' ? { ...f, content: 'changed' } : f))).version).toBe(v)
  })
})
