// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { LAZY_CACHE, createShell, deleteShellCaches, isCacheableChunk } from '../../src/pwa/sw-core'
import { FakeCaches, makeNet, netFetch, req } from './fakes'

/** Stage 7A.2 — lazy content chunks (e.g. the A2 chunk): never precached, cached only after a SUCCESSFUL first use, pruned per deployment. */
const SCOPE = 'https://app.example/'
const SHELL = ['index.html', 'assets/index-aaa.js', 'assets/index-aaa.css']
const CHUNK = 'assets/a2-content-111.js'
const NEXT = 'assets/a2-content-222.js'
const js = (body: string) => () => new Response(body, { status: 200, headers: { 'content-type': 'text/javascript' } })

function setup(lazy = [CHUNK], routes: Record<string, string | (() => Response)> = {}) {
  const net = makeNet({
    ...Object.fromEntries(SHELL.map(f => [SCOPE + f, `shell:${f}`])),
    [SCOPE + CHUNK]: js('chunk-v1'),
    [SCOPE + NEXT]: js('chunk-v2'),
    ...routes,
  })
  const caches = new FakeCaches(net)
  const shell = createShell({
    caches: caches.asCaches(),
    fetch: netFetch(net),
    config: { version: 'v1', precache: SHELL, lazy, scope: SCOPE },
  })
  return { net, caches, shell }
}
type Shell = ReturnType<typeof setup>['shell']
const get = (shell: Shell, path = CHUNK) => shell.handleFetch(req(SCOPE + path, { mode: 'cors' }))
const make = (caches: FakeCaches, net: ReturnType<typeof setup>['net'], version: string, lazy: string[]) =>
  createShell({ caches: caches.asCaches(), fetch: netFetch(net), config: { version, precache: SHELL, lazy, scope: SCOPE } })

describe('A1 users: the lazy chunk is never precached', () => {
  it('install fetches only the shell files', async () => {
    const { shell, net, caches } = setup()
    await shell.install()
    expect(net.calls.some(u => u.includes('a2-content'))).toBe(false)
    expect(caches.names).toEqual(['bilup-shell-v1'])
    expect(shell.precacheUrls.some(u => u.includes('a2-content'))).toBe(false)
  })
  it('a lazy-listed URL is classified separately from precached assets', () => {
    const { shell } = setup()
    expect(shell.classify(req(SCOPE + CHUNK))).toBe('lazy')
    expect(shell.classify(req(SCOPE + 'assets/index-aaa.js'))).toBe('asset')
    expect(shell.classify(req(SCOPE + 'assets/a2-content-OTHER.js'))).toBe('ignore')
  })
  it('without a lazy list the worker behaves exactly as before', () => {
    const { shell } = setup([])
    expect(shell.classify(req(SCOPE + CHUNK))).toBe('ignore')
    expect(get(shell)).toBeNull()
  })
})

describe('caching on first successful use', () => {
  it('the first request goes to the network and is stored; the second is served from the cache without the network', async () => {
    const { shell, net, caches } = setup()
    expect(await (await get(shell))!.text()).toBe('chunk-v1')
    expect(caches.cache(LAZY_CACHE).puts).toEqual([SCOPE + CHUNK])
    net.calls.length = 0
    net.offline = true
    expect(await (await get(shell))!.text()).toBe('chunk-v1')
    expect(net.calls).toEqual([])
  })
  it('never stores failed responses: 404, 500, wrong type, missing content type, partial', async () => {
    const bad = [
      () => new Response('nf', { status: 404, headers: { 'content-type': 'text/javascript' } }),
      () => new Response('err', { status: 500, headers: { 'content-type': 'text/javascript' } }),
      () => new Response('<html>', { status: 200, headers: { 'content-type': 'text/html' } }),
      () => new Response('x', { status: 200 }),
      () => new Response('part', { status: 206, headers: { 'content-type': 'text/javascript' } }),
    ]
    for (const b of bad) {
      const { shell, caches } = setup([CHUNK], { [SCOPE + CHUNK]: b })
      await get(shell)
      expect(caches.names.includes(LAZY_CACHE) ? caches.cache(LAZY_CACHE).puts : []).toEqual([])
    }
    expect(
      isCacheableChunk(new Response('ok', { status: 200, headers: { 'content-type': 'application/javascript; charset=utf-8' } })),
    ).toBe(true)
  })
  it('a failed attempt is retried on the next request and then stored (no negative caching)', async () => {
    const { shell, net, caches } = setup()
    net.offline = true
    await expect(get(shell)!).rejects.toThrow()
    net.offline = false
    expect(await (await get(shell))!.text()).toBe('chunk-v1')
    expect(caches.cache(LAZY_CACHE).puts).toHaveLength(1)
  })
  it('an unavailable cache storage does not break loading', async () => {
    const { shell, caches } = setup()
    caches.broken = true
    expect(await (await get(shell))!.text()).toBe('chunk-v1')
  })
  it('range and credentialed requests are not intercepted', () => {
    const { shell } = setup()
    expect(shell.handleFetch(req(SCOPE + CHUNK, { headers: { range: 'bytes=0-9' } }))).toBeNull()
    expect(shell.handleFetch(req(SCOPE + CHUNK, { headers: { authorization: 'x' } }))).toBeNull()
  })
})

describe('new deployments cannot keep serving an old chunk', () => {
  it('chunk URLs are content-hashed: the new build lists a NEW url, and the old url is not intercepted by the new worker', async () => {
    const a = setup([CHUNK])
    await get(a.shell)
    const next = make(a.caches, a.net, 'v2', [NEXT])
    expect(next.classify(req(SCOPE + CHUNK))).toBe('ignore')
    expect(next.classify(req(SCOPE + NEXT))).toBe('lazy')
  })
  it('activation prunes entries that are not in the new build list, and does not delete the lazy cache as an old shell cache', async () => {
    const { caches, net } = setup()
    const old = make(caches, net, 'v1', [CHUNK])
    await old.install()
    await get(old)
    const next = make(caches, net, 'v2', [NEXT])
    await next.install()
    await get(next, NEXT)
    expect([...caches.cache(LAZY_CACHE).store.keys()].sort()).toEqual([SCOPE + CHUNK, SCOPE + NEXT].sort())
    const deleted = await next.activate()
    expect(deleted).toEqual(['bilup-shell-v1'])
    expect([...caches.cache(LAZY_CACHE).store.keys()]).toEqual([SCOPE + NEXT])
    expect(caches.names.sort()).toEqual([LAZY_CACHE, 'bilup-shell-v2'].sort())
  })
  it('activation does not create a lazy cache for users who never loaded the chunk (A1 users)', async () => {
    const { caches, shell } = setup()
    await shell.install()
    await shell.activate()
    expect(caches.names).toEqual(['bilup-shell-v1'])
  })
  it('the kill-switch / disable path removes the lazy cache too', async () => {
    const { caches, shell } = setup()
    await get(shell)
    expect(await deleteShellCaches(caches.asCaches())).toEqual([LAZY_CACHE])
    expect(caches.names).toEqual([])
  })
})

describe('two lazy levels (A2 and B1): each is cached on its own first use, none is precached, both are pruned per deployment', () => {
  const B1 = 'assets/b1-content-333.js'
  const B1_NEXT = 'assets/b1-content-444.js'
  const two = () => setup([CHUNK, B1], { [SCOPE + B1]: js('b1-v1'), [SCOPE + B1_NEXT]: js('b1-v2') })
  it('install fetches neither chunk; both are classified lazy', async () => {
    const { shell, net } = two()
    await shell.install()
    expect(net.calls.some(u => u.includes('-content-'))).toBe(false)
    expect(shell.precacheUrls.some(u => u.includes('-content-'))).toBe(false)
    expect(shell.classify(req(SCOPE + CHUNK))).toBe('lazy')
    expect(shell.classify(req(SCOPE + B1))).toBe('lazy')
  })
  it('using A2 never fetches or stores B1 (an A2 learner who cannot see B1 does not download it)', async () => {
    const { shell, net, caches } = two()
    await get(shell)
    expect(net.calls.some(u => u.includes('b1-content'))).toBe(false)
    expect(caches.cache(LAZY_CACHE).puts).toEqual([SCOPE + CHUNK])
  })
  it('B1 is stored after its own first successful use and then served from the cache', async () => {
    const { shell, net, caches } = two()
    expect(await (await get(shell, B1))!.text()).toBe('b1-v1')
    expect(caches.cache(LAZY_CACHE).puts).toEqual([SCOPE + B1])
    net.calls.length = 0
    net.offline = true
    expect(await (await get(shell, B1))!.text()).toBe('b1-v1')
    expect(net.calls).toEqual([])
  })
  it('activation of a new build prunes the old hashed chunk of BOTH levels', async () => {
    const { caches, net } = two()
    const old = make(caches, net, 'v1', [CHUNK, B1])
    await old.install()
    await get(old)
    await get(old, B1)
    const next = make(caches, net, 'v2', [NEXT, B1_NEXT])
    await next.install()
    await get(next, NEXT)
    await get(next, B1_NEXT)
    await next.activate()
    expect([...caches.cache(LAZY_CACHE).store.keys()].sort()).toEqual([SCOPE + NEXT, SCOPE + B1_NEXT].sort())
  })
})
