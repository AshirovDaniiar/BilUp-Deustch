/**
 * Service-worker logic for the P0b "offline application shell".
 *
 * Deliberately tiny and dependency-free. It is written as pure functions over injected `caches` / `fetch` so it can be
 * unit-tested without a browser. `sw.ts` wires it to the real worker globals.
 *
 * What it does:   precache the hashed static shell (index.html, JS/CSS, manifest, icon) in ONE versioned cache and serve it
 *                 (a) cache-first for those exact URLs, (b) as an offline fallback for page navigations.
 * Lazy content (Stage 7A.2): files listed in `config.lazy` (e.g. the A2 content chunk) are NOT precached. They are cached ON FIRST
 *                 SUCCESSFUL USE only, in one separate cache (`LAZY_CACHE`), cache-first afterwards. See docs/implementation/A2_STAGE7A2_CORRECTIONS.md.
 * What it NEVER does: runtime caching of anything else, caching of any other URL, API / auth / payment / tutor / live / stream traffic,
 *                 non-GET requests, cross-origin requests, requests carrying credentials headers, Range requests,
 *                 background sync, push. Learner data lives in localStorage, which a service worker cannot reach.
 */

export const CACHE_PREFIX = 'bilup-shell-'
/** The single cache of lazy content chunks. It carries the shell prefix, so the kill-switch and the disable path remove it too. */
export const LAZY_CACHE = `${CACHE_PREFIX}lazy`

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
  /** lazy content files (relative to the scope), e.g. `assets/a2-content-abc.js`: never precached, cached after the first successful fetch */
  lazy?: string[]
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
export async function deleteShellCaches(caches: CacheStorage, keep?: string | string[]): Promise<string[]> {
  const kept = new Set(keep === undefined ? [] : Array.isArray(keep) ? keep : [keep])
  const names = (await caches.keys()).filter(n => n.startsWith(CACHE_PREFIX) && !kept.has(n))
  await Promise.all(names.map(n => caches.delete(n)))
  return names
}

/** A response that may be stored as a lazy chunk: 200 OK, not opaque/redirected, JavaScript. */
export const isCacheableChunk = (res: Response): boolean =>
  res.status === 200 &&
  res.ok &&
  !res.redirected &&
  res.type !== 'opaque' &&
  res.type !== 'error' &&
  /javascript/i.test(res.headers.get('content-type') ?? '')

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
  const lazyUrls = (config.lazy ?? []).map(p => new URL(p, scope).href)
  const lazySet = new Set(lazyUrls)
  const indexUrl = new URL('index.html', scope).href
  const timeoutMs = config.navigationTimeoutMs ?? 3000

  const relativePath = (u: URL) =>
    '/' + (u.pathname.startsWith(scope.pathname) ? u.pathname.slice(scope.pathname.length) : u.pathname.replace(/^\//, ''))

  /** Is this a page navigation to the app root (hash routing means the document is always `/` or `/index.html`)? */
  const isShellNavigation = (req: ReqLike, u: URL) =>
    req.mode === 'navigate' && (u.pathname === scope.pathname || u.href === indexUrl || u.pathname === new URL(indexUrl).pathname)

  /** The single gate deciding whether the worker may touch a request at all. */
  function classify(req: ReqLike): 'asset' | 'lazy' | 'navigation' | 'ignore' {
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
    if (lazySet.has(bare.href)) return 'lazy'
    return 'ignore'
  }

  return {
    cacheName: name,
    precacheUrls,
    lazyUrls,
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
    async activate(): Promise<string[]> {
      const deleted = await deleteShellCaches(env.caches, [name, LAZY_CACHE])
      // lazy chunks are content-hashed: an entry whose URL is not in THIS build's list belongs to an older deployment → remove it
      try {
        if (await env.caches.has(LAZY_CACHE)) {
          const cache = await env.caches.open(LAZY_CACHE)
          for (const r of await cache.keys()) if (!lazySet.has(r.url)) await cache.delete(r)
        }
      } catch {
        /* cache storage unavailable: nothing to prune */
      }
      return deleted
    },

    /** Returns a response promise, or `null` meaning "do not intercept — let the browser handle it". */
    handleFetch(req: ReqLike): Promise<Response> | null {
      const kind = classify(req)
      if (kind === 'ignore') return null
      const network = () => env.fetch(req.raw ?? req.url)

      if (kind === 'lazy') {
        const key = new URL(req.url).origin + new URL(req.url).pathname
        return (async () => {
          try {
            const hit = await (await env.caches.open(LAZY_CACHE)).match(key)
            if (hit) return hit
          } catch {
            /* cache storage unavailable → network */
          }
          const res = await network()
          // only a complete, successful, same-origin JavaScript response is ever stored: never an error page, redirect, partial or opaque response
          if (isCacheableChunk(res)) {
            try {
              await (await env.caches.open(LAZY_CACHE)).put(key, res.clone())
            } catch {
              /* quota / unavailable: the response is still served */
            }
          }
          return res
        })()
      }

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
