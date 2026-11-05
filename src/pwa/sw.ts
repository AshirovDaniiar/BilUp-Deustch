/// Entry point of the production service worker. Bundled (IIFE) by scripts/pwa/vite-plugin.ts into `sw.js`;
/// `__SHELL_VERSION__` and `__PRECACHE__` are injected at build time. Not loaded in development.
import { createShell } from './sw-core'

declare const __SHELL_VERSION__: string
declare const __PRECACHE__: string[]

interface WorkerScope {
  registration: { scope: string }
  skipWaiting(): Promise<void>
  clients: { claim(): Promise<void> }
  addEventListener(type: string, listener: (e: never) => void): void
}
interface ExtEvent {
  waitUntil(p: Promise<unknown>): void
}
interface FetchEv {
  request: Request
  respondWith(p: Promise<Response>): void
}
interface MsgEv {
  data: unknown
}

const sw = self as unknown as WorkerScope

const shell = createShell({
  caches,
  fetch: input => fetch(input),
  config: { version: __SHELL_VERSION__, precache: __PRECACHE__, scope: sw.registration.scope },
})

// No skipWaiting() here: a new version waits until the user accepts the update prompt (avoids mid-lesson reloads).
sw.addEventListener('install', ((e: ExtEvent) => e.waitUntil(shell.install())) as (e: never) => void)

sw.addEventListener('activate', ((e: ExtEvent) => e.waitUntil(shell.activate().then(() => sw.clients.claim()))) as (e: never) => void)

sw.addEventListener('fetch', ((e: FetchEv) => {
  const r = e.request
  const response = shell.handleFetch({ url: r.url, method: r.method, mode: r.mode, headers: r.headers, raw: r })
  if (response) e.respondWith(response)
}) as (e: never) => void)

sw.addEventListener('message', ((e: MsgEv) => {
  if (shell.parseMessage(e.data) === 'skip-waiting') void sw.skipWaiting()
}) as (e: never) => void)
