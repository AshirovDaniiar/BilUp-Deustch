import type { ReactNode } from 'react'
import { Logo } from '../components/Logo'
import type { TKey } from '../i18n'
import { A, type Route } from './router'
import { useApp } from './store'

interface NavDef { to: string; icon: ReactNode; key: TKey; match: string }

function MountainIcon({ size = 20 }: { size?: number | string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    >
      <path d="m8 3 4 8 5-5 5 15H2z" />
    </svg>
  )
}

const MAIN: NavDef[] = [
  { to: '/', icon: <MountainIcon />, key: 'nav_home', match: '' },
  { to: '/learn', icon: '📚', key: 'nav_learn', match: 'learn' },
  { to: '/practice', icon: '🎯', key: 'nav_practice', match: 'practice' },
  { to: '/speak', icon: '🎙️', key: 'nav_speak', match: 'speak' },
  { to: '/progress', icon: '📈', key: 'nav_progress', match: 'progress' },
]
const MORE: NavDef[] = [
  { to: '/tutor', icon: '✨', key: 'nav_tutor', match: 'tutor' },
  { to: '/vocabulary', icon: '🔤', key: 'nav_vocabulary', match: 'vocabulary' },
  { to: '/grammar', icon: '🧪', key: 'nav_grammar', match: 'grammar' },
  { to: '/profile', icon: '👤', key: 'nav_profile', match: 'profile' },
]

export function Layout({ route, children }: { route: Route; children: ReactNode }) {
  const { t } = useApp()
  const active = route.parts[0] ?? ''
  return (
    <div className="app">
      <aside className="side" aria-label="Navigation">
        <A to="/" aria-label="BilUp Til">
          <Logo />
        </A>
        {MAIN.map(n => (
          <A key={n.to} to={n.to} className={`sidelink ${active === n.match ? 'is-active' : ''}`} aria-current={active === n.match ? 'page' : undefined}>
            <span className="sidelink__icon" aria-hidden>{n.icon}</span>
            {t(n.key)}
          </A>
        ))}
        <div className="side__sep" />
        {MORE.map(n => (
          <A key={n.to} to={n.to} className={`sidelink ${active === n.match ? 'is-active' : ''}`} aria-current={active === n.match ? 'page' : undefined}>
            <span className="sidelink__icon" aria-hidden>{n.icon}</span>
            {t(n.key)}
          </A>
        ))}
        <div className="side__foot">{t('tagline')}</div>
      </aside>

      <div className="content">
        <header className="topbar">
          <A to="/" aria-label="BilUp Til">
            <Logo compact showMascot={false} />
          </A>
          <div className="topbar__actions">
            <A to="/tutor" className="iconbtn" aria-label={t('nav_tutor')}>✨</A>
            <A to="/profile" className="iconbtn" aria-label={t('nav_profile')}>👤</A>
          </div>
        </header>
        <main className="main" id="main">
          {/* below 1024px the install / update notice is rendered HERE (in the page flow) so it can never cover the page's own buttons */}
          <div id="pwa-slot" />
          {children}
        </main>
      </div>

      <nav className="bottomnav" aria-label="Navigation">
        {MAIN.map(n => (
          <A key={n.to} to={n.to} className={`navitem ${active === n.match ? 'is-active' : ''}`} aria-current={active === n.match ? 'page' : undefined}>
            <span className="navitem__icon" aria-hidden>{n.icon}</span>
            <span>{t(n.key)}</span>
          </A>
        ))}
      </nav>
    </div>
  )
}
