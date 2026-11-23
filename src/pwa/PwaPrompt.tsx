import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactElement } from 'react'
import { createPortal } from 'react-dom'
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
/** Below 1024px (bottom-navigation layout) the notice lives in the page flow; from 1024px it is the fixed corner card. */
const NARROW = '(max-width: 1023.98px)'
const isNarrow = () => {
  try {
    return typeof window.matchMedia === 'function' && window.matchMedia(NARROW).matches
  } catch {
    return false
  }
}

export function PwaPrompt({ handle }: { handle: Promise<PwaHandle> | null }) {
  const { lang } = useApp()
  const m = PWA_MESSAGES[lang]
  const [pwa, setPwa] = useState<PwaHandle | null>(null)
  const [update, setUpdate] = useState(false)
  const [updateDeferred, setUpdateDeferred] = useState(false)
  const [installEvent, setInstallEvent] = useState<InstallEvent | null>(null)
  const [dismissed, setDismissed] = useState(() => read(DISMISS_KEY) === '1')
  const ios = useMemo(() => isIosSafari() && !isStandalone(), [])
  const [narrow, setNarrow] = useState(isNarrow)
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia(NARROW)
    const on = () => setNarrow(mq.matches)
    mq.addEventListener?.('change', on)
    return () => mq.removeEventListener?.('change', on)
  }, [])

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

  // The notice is position:fixed, so it floats over the bottom of the page. While it is visible the page reserves exactly its height at the bottom (CSS: `html.has-pwa-note .main`),
  // so every control — quiz buttons, assessment buttons — can be scrolled above it. Nothing is hidden and no notice is dismissed on the learner's behalf; the class and the variable are removed with the notice.
  const shown: 'update' | 'install' | 'ios' | null =
    update && !updateDeferred ? 'update' : dismissed ? null : installEvent ? 'install' : ios ? 'ios' : null
  const noteRef = useRef<HTMLDivElement>(null)
  // in the layout's slot (narrow screens) the notice takes its own room in the page flow, so nothing has to be reserved; otherwise it floats and the page reserves its height
  const slot = narrow && typeof document !== 'undefined' ? document.getElementById('pwa-slot') : null
  const place = (el: ReactElement) => (slot ? createPortal(el, slot) : el)
  const noteClass = slot ? 'pwa-note pwa-note--inline' : 'pwa-note'
  useLayoutEffect(() => {
    const node = noteRef.current
    if (!shown || !node || slot) return
    const root = document.documentElement
    const apply = () => root.style.setProperty('--pwa-note-h', `${Math.ceil(node.getBoundingClientRect().height)}px`)
    root.classList.add('has-pwa-note')
    apply()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(apply)
    observer?.observe(node)
    window.addEventListener('resize', apply)
    return () => {
      observer?.disconnect()
      window.removeEventListener('resize', apply)
      root.classList.remove('has-pwa-note')
      root.style.removeProperty('--pwa-note-h')
    }
  }, [shown, lang, slot])

  if (update && !updateDeferred) {
    return place(
      <div className={noteClass} ref={noteRef} role="status" aria-live="polite" data-testid="pwa-update">
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
    return place(
      <div className={noteClass} ref={noteRef} role="status" aria-live="polite" data-testid="pwa-install">
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
    return place(
      <div className={noteClass} ref={noteRef} role="status" aria-live="polite" data-testid="pwa-ios">
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
