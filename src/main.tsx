import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { AppProvider } from './app/store'
import { StorageNotice } from './app/StorageNotice'
import { PwaPrompt } from './pwa/PwaPrompt'
import { registerPwa } from './pwa/register'
import './styles/base.css'
import './styles/features.css'

// P0b: offline application shell only. Never blocks or alters startup: registration is fire-and-forget and failure-tolerant.
/** Builds the dependencies lazily inside try/catch: even touching `caches`/`localStorage` can throw in sandboxed frames. */
const startPwa = () => {
  try {
    return registerPwa({
      serviceWorker: navigator.serviceWorker as never,
      caches: typeof caches === 'undefined' ? undefined : caches,
      fetch: (url, init) => fetch(url, init),
      storage: (() => {
        try {
          return localStorage
        } catch {
          return undefined
        }
      })(),
      search: window.location.search,
      base: import.meta.env.BASE_URL,
      buildDisabled: import.meta.env.VITE_PWA_DISABLED === 'true',
      isDev: import.meta.env.DEV,
      reload: () => window.location.reload(),
    })
  } catch {
    return null
  }
}
const pwa = startPwa()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
      <StorageNotice />
      <PwaPrompt handle={pwa} />
    </AppProvider>
  </StrictMode>,
)
