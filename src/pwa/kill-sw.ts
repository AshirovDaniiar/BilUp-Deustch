/// KILL-SWITCH service worker. Built INSTEAD of `sw.js` (same URL) when the build runs with VITE_PWA_KILL=true, so browsers that
/// already have the shell worker pick it up through the normal worker update check. It has no fetch handler (it never serves
/// anything), removes every shell cache, and unregisters itself. It does not reload or navigate open pages and never touches
/// localStorage, so a learner in the middle of a lesson is not interrupted; the next page load simply runs without a worker.
import { deleteShellCaches } from './sw-core'

interface KillScope {
  registration: { unregister(): Promise<boolean> }
  skipWaiting(): Promise<void>
  addEventListener(type: string, listener: (e: never) => void): void
}
interface ExtEvent {
  waitUntil(p: Promise<unknown>): void
}

const sw = self as unknown as KillScope

sw.addEventListener('install', ((e: ExtEvent) => e.waitUntil(sw.skipWaiting())) as (e: never) => void)
sw.addEventListener('activate', ((e: ExtEvent) =>
  e.waitUntil(
    deleteShellCaches(caches)
      .catch(() => [])
      .then(() => sw.registration.unregister()),
  )) as (e: never) => void)
