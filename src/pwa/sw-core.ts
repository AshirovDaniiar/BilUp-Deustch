/**
 * Service-worker logic for the P0b "offline application shell".
 *
 * Deliberately tiny and dependency-free. It is written as pure functions over injected `caches` / `fetch` so it can be
 * unit-tested without a browser. `sw.ts` wires it to the real worker globals.
 *
 * What it does:   precache the hashed static shell (index.html, JS/CSS, manifest, icon) in ONE versioned cache and serve it
 *                 (a) cache-first for those exact URLs, (b) as an offline fallback for page navigations.
 * What it NEVER does: runtime caching, caching of any other URL, API / auth / payment / tutor / live / stream traffic,
 *                 non-GET requests, cross-origin requests, requests carrying credentials headers, Range requests,
 *                 background sync, push. Learner data lives in localStorage, which a service worker cannot reach.
 */

export const CACHE_PREFIX = 'bilup-shell-'

/** Paths (relative to the scope) that are never intercepted — rule recorded in 07 §5 for future API/payment/video traffic. */
export const NEVER_INTERCEPT =
  /^\/(api|auth|login|logout|account|pay|payment|payments|checkout|billing|subscription|subscriptions|entitlement|entitlements|tutor|ai|live|stream|streams|video|rtc|ws|socket|webhook|webhooks)(\/|$)/i

export interface ReqLike {
  url: string
  method: string
  /** 'navigate' for page loads */
  mode: string
  headers: { get(name: string): string | null }
  /** the real Request, used for the network fetch when present */
  raw?: Request
}

export interface ShellConfig {
  /** cache version (content hash of the shell) */
  version: string
  /** shell files, relative to the scope (e.g. `index.html`, `assets/index-abc.js`) */
  precache: string[]
  /** absolute scope URL, e.g. `https://app.example/` */
  scope: string
  /** how long to wait for the network on a page load before using the cached shell */
  navigationTimeoutMs?: number
}

export interface ShellEnv {
  caches: CacheStorage
  fetch: (input: Request | string) => Promise<Response>
  config: ShellConfig
}

export const cacheNameFor = (version: string) => `${CACHE_PREFIX}${version}`

/** Deletes shell caches, optionally keeping one. Only caches with our prefix are ever touched. */
export async function deleteShellCaches(caches: CacheStorage, keep?: string): Promise<string[]> {
  const names = (await caches.keys()).filter(n => n.startsWith(CACHE_PREFIX) && n !== keep)
  await Promise.all(names.map(n => caches.delete(n)))
  return names
}

const withTimeout = <T>(p: Promise<T>, ms: number): Promise<T> =>
  new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), ms)
    p.then(
      v => {
        clearTimeout(t)
        resolve(v)
      },
      e => {
        clearTimeout(t)
        reject(e)
      },
    )
  })

export function createShell(env: ShellEnv) {
  const { config } = env
  const scope = new URL(config.scope)
  const name = cacheNameFor(config.version)
  const precacheUrls = config.precache.map(p => new URL(p, scope).href)
  const precacheSet = new Set(precacheUrls)
  const indexUrl = new URL('index.html', scope).href
  const timeoutMs = config.navigationTimeoutMs ?? 3000

  const relativePath = (u: URL) =>
    '/' + (u.pathname.startsWith(scope.pathname) ? u.pathname.slice(scope.pathname.length) : u.pathname.replace(/^\//, ''))

  /** Is this a page navigation to the app root (hash routing means the document is always `/` or `/index.html`)? */
  const isShellNavigation = (req: ReqLike, u: URL) =>
    req.mode === 'navigate' && (u.pathname === scope.pathname || u.href === indexUrl || u.pathname === new URL(indexUrl).pathname)

  /** The single gate deciding whether the worker may touch a request at all. */
  function classify(req: ReqLike): 'asset' | 'navigation' | 'ignore' {
    let u: URL
    try {
      u = new URL(req.url)
    } catch {
      return 'ignore'
    }
    if (req.method !== 'GET') return 'ignore'
    if (u.origin !== scope.origin) return 'ignore'
    if (!u.pathname.startsWith(scope.pathname)) return 'ignore'
    if (NEVER_INTERCEPT.test(relativePath(u))) return 'ignore'
    if (req.headers.get('authorization') || req.headers.get('range')) return 'ignore'
    if (isShellNavigation(req, u)) return 'navigation'
    // exact precached URL, query string ignored for matching (hashed assets are immutable)
    const bare = new URL(u.href)
    bare.search = ''
    bare.hash = ''
    if (precacheSet.has(bare.href)) return 'asset'
    return 'ignore'
  }

  return {
    cacheName: name,
    precacheUrls,
    classify,

    /** Fills the versioned cache atomically: if any file fails, nothing is kept and installation fails (old worker stays). */
    async install(): Promise<void> {
      const cache = await env.caches.open(name)
      try {
        await cache.addAll(precacheUrls.map(u => new Request(u, { cache: 'reload' })))
      } catch (e) {
        await env.caches.delete(name)
        throw e
      }
    },

    /** Removes older shell caches (ours only). Returns the deleted names. */
    activate: () => deleteShellCaches(env.caches, name),

    /** Returns a response promise, or `null` meaning "do not intercept — let the browser handle it". */
    handleFetch(req: ReqLike): Promise<Response> | null {
      const kind = classify(req)
      if (kind === 'ignore') return null
      const network = () => env.fetch(req.raw ?? req.url)

      if (kind === 'asset') {
        return (async () => {
          try {
            const cache = await env.caches.open(name)
            const hit = await cache.match(new URL(req.url).origin + new URL(req.url).pathname)
            if (hit) return hit
          } catch {
            /* cache storage unavailable → fall through to the network */
          }
          return network()
        })()
      }

      // navigation: network first (so a deploy is seen immediately), cached shell when offline or very slow
      return (async () => {
        const fallback = async () => {
          try {
            const cache = await env.caches.open(name)
            return await cache.match(indexUrl)
          } catch {
            return undefined
          }
        }
        try {
          const res = await withTimeout(network(), timeoutMs)
          if (res.status < 500) return res
          return (await fallback()) ?? res
        } catch (err) {
          const cached = await fallback()
          if (cached) return cached
          throw err
        }
      })()
    },

    /** Messages accepted from pages. Only `SKIP_WAITING` exists. */
    parseMessage(data: unknown): 'skip-waiting' | null {
      return typeof data === 'object' && data !== null && (data as { type?: unknown }).type === 'SKIP_WAITING' ? 'skip-waiting' : null
    },
  }
}
