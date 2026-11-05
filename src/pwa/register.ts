/**
 * Page-side PWA lifecycle (P0b): registration, kill-switch evaluation, update detection.
 * Every external dependency is injected, so the behaviour is unit-tested without a browser. The function NEVER throws and the
 * application must work identically whether it returns 'registered' or any other status.
 *
 * Storage: the only key used is `bilup-pwa:disabled` (+ `bilup-pwa:install-dismissed` by the prompt UI). The learner-progress key
 * `bilup-deutsch:v1` is never read or written here.
 */
import { CACHE_PREFIX } from './sw-core'

export const DISABLED_KEY = 'bilup-pwa:disabled'

export type PwaStatus = 'unsupported' | 'disabled-build' | 'disabled-local' | 'disabled-remote' | 'registered' | 'failed'

interface WorkerLike {
  state: string
  postMessage(m: unknown): void
  addEventListener(t: string, l: () => void): void
}
export interface RegistrationLike {
  scope: string
  waiting: WorkerLike | null
  installing: WorkerLike | null
  addEventListener(t: string, l: () => void): void
  update(): Promise<unknown>
  unregister(): Promise<boolean>
}
export interface ServiceWorkerContainerLike {
  controller: unknown
  register(url: string, opts?: { scope?: string }): Promise<RegistrationLike>
  getRegistrations(): Promise<RegistrationLike[]>
  addEventListener(t: string, l: () => void): void
}

export interface PwaDeps {
  serviceWorker?: ServiceWorkerContainerLike
  caches?: CacheStorage
  fetch: (url: string, init?: RequestInit) => Promise<Response>
  storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>
  /** `location.search`, e.g. `?pwa=off` */
  search: string
  /** deployment base, `/` by default */
  base: string
  /** build-time switches */
  buildDisabled: boolean
  isDev: boolean
  reload: () => void
  /** milliseconds to wait for the remote configuration before continuing */
  configTimeoutMs?: number
}

export interface PwaHandle {
  status: PwaStatus
  /** true once a newer worker is installed and waiting */
  updateReady: () => boolean
  /** subscribe to "update available"; returns an unsubscribe function */
  onUpdateReady: (cb: () => void) => () => void
  /** ask the waiting worker to activate; the page reloads once the new worker controls it */
  applyUpdate: () => void
  /** check for a newer worker now */
  checkForUpdate: () => Promise<void>
}

const noop = () => {}
const inert = (status: PwaStatus): PwaHandle => ({
  status,
  updateReady: () => false,
  onUpdateReady: () => noop,
  applyUpdate: noop,
  checkForUpdate: async () => {},
})

const safe = {
  get(s: PwaDeps['storage'], k: string) {
    try {
      return s?.getItem(k) ?? null
    } catch {
      return null
    }
  },
  set(s: PwaDeps['storage'], k: string, v: string) {
    try {
      s?.setItem(k, v)
    } catch {
      /* storage unavailable */
    }
  },
  remove(s: PwaDeps['storage'], k: string) {
    try {
      s?.removeItem(k)
    } catch {
      /* storage unavailable */
    }
  },
}

/** Removes every service worker registration under our scope and every shell cache. Touches nothing else. */
export async function disableShell(deps: Pick<PwaDeps, 'serviceWorker' | 'caches' | 'base'>): Promise<void> {
  try {
    const regs = (await deps.serviceWorker?.getRegistrations()) ?? []
    await Promise.all(
      regs
        .filter(r => {
          try {
            return new URL(r.scope).pathname.startsWith(deps.base)
          } catch {
            return true
          }
        })
        .map(r => r.unregister().catch(() => false)),
    )
  } catch {
    /* ignore */
  }
  try {
    const names = (await deps.caches?.keys()) ?? []
    await Promise.all(names.filter(n => n.startsWith(CACHE_PREFIX)).map(n => deps.caches!.delete(n)))
  } catch {
    /* ignore */
  }
}

/** `?pwa=off` disables the shell on this device (remembered), `?pwa=on` re-enables it. */
function readLocalSwitch(deps: PwaDeps): boolean {
  const q = new URLSearchParams(deps.search).get('pwa')
  if (q === 'off') safe.set(deps.storage, DISABLED_KEY, '1')
  else if (q === 'on') safe.remove(deps.storage, DISABLED_KEY)
  return safe.get(deps.storage, DISABLED_KEY) === '1'
}

/** Remote kill-switch: a static `pwa-config.json` on the host, fetched uncached. Failure (offline, 404, bad JSON) = "no opinion". */
async function remoteSaysDisabled(deps: PwaDeps): Promise<boolean> {
  try {
    const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null
    const timer = ctl ? setTimeout(() => ctl.abort(), deps.configTimeoutMs ?? 3000) : null
    try {
      const res = await deps.fetch(`${deps.base}pwa-config.json`, { cache: 'no-store', signal: ctl?.signal })
      if (!res.ok) return false
      const json = (await res.json()) as { enabled?: unknown }
      return json?.enabled === false
    } finally {
      if (timer) clearTimeout(timer)
    }
  } catch {
    return false
  }
}

export async function registerPwa(deps: PwaDeps): Promise<PwaHandle> {
  try {
    if (deps.isDev) {
      // never leave a production worker active on the dev server
      await disableShell(deps)
      return inert('disabled-build')
    }
    if (deps.buildDisabled) {
      await disableShell(deps)
      return inert('disabled-build')
    }
    if (!deps.serviceWorker) return inert('unsupported')
    if (readLocalSwitch(deps)) {
      await disableShell(deps)
      return inert('disabled-local')
    }
    if (await remoteSaysDisabled(deps)) {
      await disableShell(deps)
      return inert('disabled-remote')
    }

    const sw = deps.serviceWorker
    const reg = await sw.register(`${deps.base}sw.js`, { scope: deps.base })

    const listeners = new Set<() => void>()
    let ready = !!reg.waiting && !!sw.controller
    let reloading = false
    const fire = () => {
      ready = true
      listeners.forEach(cb => cb())
    }
    const watch = (w: WorkerLike | null) => {
      if (!w) return
      w.addEventListener('statechange', () => {
        // "installed" while a controller exists = an update, not the very first install
        if (w.state === 'installed' && sw.controller) fire()
      })
    }
    watch(reg.installing)
    reg.addEventListener('updatefound', () => watch(reg.installing))
    sw.addEventListener('controllerchange', () => {
      if (reloading) return
      reloading = true
      deps.reload()
    })

    return {
      status: 'registered',
      updateReady: () => ready,
      onUpdateReady: cb => {
        listeners.add(cb)
        if (ready) cb()
        return () => listeners.delete(cb)
      },
      applyUpdate: () => {
        const w = reg.waiting
        if (w) w.postMessage({ type: 'SKIP_WAITING' })
        else deps.reload() // nothing waiting (already activated elsewhere): a plain reload picks up the new shell
      },
      checkForUpdate: async () => {
        try {
          await reg.update()
        } catch {
          /* offline */
        }
      },
    }
  } catch {
    return inert('failed')
  }
}
