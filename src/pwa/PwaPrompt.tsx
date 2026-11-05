import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../app/store'
import { PWA_MESSAGES } from './messages'
import type { PwaHandle } from './register'
import './pwa.css'

const DISMISS_KEY = 'bilup-pwa:install-dismissed'

interface InstallEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const read = (k: string) => {
  try {
    return localStorage.getItem(k)
  } catch {
    return null
  }
}
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* storage unavailable */
  }
}

const isStandalone = () => {
  try {
    return window.matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone === true
  } catch {
    return false
  }
}

/** iPhone/iPad Safari has no install event; iPadOS reports a Mac user agent with touch support. */
const isIosSafari = () => {
  const ua = navigator.userAgent
  const ios = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  return ios && /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua)
}

/**
 * Install + update notices. Purely additive UI rendered next to <App/>; it reads only the interface language from the store and
 * never writes learner progress. Two notices at most; the update notice has priority.
 */
export function PwaPrompt({ handle }: { handle: Promise<PwaHandle> | null }) {
  const { lang } = useApp()
  const m = PWA_MESSAGES[lang]
  const [pwa, setPwa] = useState<PwaHandle | null>(null)
  const [update, setUpdate] = useState(false)
  const [updateDeferred, setUpdateDeferred] = useState(false)
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null)
  const [dismissed, setDismissed] = useState(() => read(DISMISS_KEY) === '1')
  const ios = useMemo(() => isIosSafari() && !isStandalone(), [])

  useEffect(() => {
    let off = () => {}
    let alive = true
    handle?.then(h => {
      if (!alive) return
      setPwa(h)
      off = h.onUpdateReady(() => setUpdate(true))
      const onVisible = () => document.visibilityState === 'visible' && void h.checkForUpdate()
      document.addEventListener('visibilitychange', onVisible)
      off = ((prev: () => void) => () => {
        prev()
        document.removeEventListener('visibilitychange', onVisible)
      })(off)
    })
    return () => {
      alive = false
      off()
    }
  }, [handle])

  useEffect(() => {
    const onBefore = (e: Event) => {
      e.preventDefault()
      if (!isStandalone()) setInstallEvent(e as InstallEvent)
    }
    const onInstalled = () => setInstallEvent(null)
    window.addEventListener('beforeinstallprompt', onBefore)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBefore)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const dismissInstall = () => {
    setDismissed(true)
    write(DISMISS_KEY, '1')
  }

  if (update && !updateDeferred) {
    return (
      <div className="pwa-note" role="status" aria-live="polite" data-testid="pwa-update">
        <div className="pwa-note__text">
          <strong>{m.updateTitle}</strong>
          <span>{m.updateBody}</span>
        </div>
        <div className="pwa-note__actions">
          <button type="button" className="pwa-btn pwa-btn--primary" onClick={() => pwa?.applyUpdate()}>
            {m.updateAction}
          </button>
          <button type="button" className="pwa-btn" onClick={() => setUpdateDeferred(true)}>
            {m.later}
          </button>
        </div>
      </div>
    )
  }

  if (dismissed) return null

  if (installEvent) {
    return (
      <div className="pwa-note" role="status" aria-live="polite" data-testid="pwa-install">
        <div className="pwa-note__text">
          <strong>{m.installTitle}</strong>
          <span>{m.installBody}</span>
        </div>
        <div className="pwa-note__actions">
          <button
            type="button"
            className="pwa-btn pwa-btn--primary"
            onClick={() => {
              void installEvent.prompt()
              setInstallEvent(null)
            }}
          >
            {m.installAction}
          </button>
          <button type="button" className="pwa-btn" onClick={dismissInstall}>
            {m.later}
          </button>
        </div>
      </div>
    )
  }

  if (ios) {
    return (
      <div className="pwa-note" role="status" aria-live="polite" data-testid="pwa-ios">
        <div className="pwa-note__text">
          <strong>{m.iosTitle}</strong>
          <span>{m.iosBody}</span>
        </div>
        <div className="pwa-note__actions">
          <button type="button" className="pwa-btn" onClick={dismissInstall}>
            {m.close}
          </button>
        </div>
      </div>
    )
  }

  return null
}
