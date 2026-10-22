import { A } from '../app/router'
import { useApp } from '../app/store'
import { Card, PageHeader, ProgressBar, Chip } from '../components/ui'
import { LEVELS } from '../data/types'
import { UNITS } from '../data/units'
import { vocabForUnit } from '../data/vocabulary'
import { unitProgress } from '../features/progress/stats'
import { tr } from '../utils/text'

export function LearnScreen() {
  const { state, t, lang } = useApp()
  return (
    <div className="stack">
      <PageHeader title={t('learnTitle')} sub={t('learnSub')} />
      <div className="grid grid--3 quicklinks">
        <A to="/vocabulary" className="card card--interactive tilecard">📖 <b>{t('nav_vocabulary')}</b><span className="muted small">{t('vocabSub')}</span></A>
        <A to="/grammar" className="card card--interactive tilecard">🧪 <b>{t('grammarLab')}</b><span className="muted small">{t('grammarLabSub')}</span></A>
        <A to="/practice/real" className="card card--interactive tilecard">🇩🇪 <b>{t('lab_real')}</b><span className="muted small">{t('lab_real_d')}</span></A>
      </div>

      <div className="levels" role="tablist" aria-label={t('level')}>
        {LEVELS.map(l => (
          <Chip key={l} tone={l === 'A1' ? 'blue' : 'neutral'} active={l === 'A1'}>{l}{l !== 'A1' ? ' 🔒' : ''}</Chip>
        ))}
      </div>

      <div className="curriculum">
        {UNITS.map(u => {
          const p = unitProgress(state, u.id)
          return (
            <A key={u.id} to={`/learn/unit/${u.id}`} className="unitcard card card--interactive">
              <div className="unitcard__icon" aria-hidden>{u.icon}</div>
              <div className="grow">
                <div className="eyebrow">{t('unit').toUpperCase()} {String(u.id).padStart(2, '0')} · {u.level}</div>
                <h3 className="h3">{u.title}</h3>
                <p className="muted small break">{tr(u.subtitle, lang)}</p>
                <div className="row small muted" style={{ marginTop: 8 }}>
                  <span>{vocabForUnit(u.id).length} {t('words')}</span>·<span>{p.done}/{p.total} {t('unitProgress')}</span>
                </div>
                <ProgressBar value={p.pct} tone={p.pct === 100 ? 'green' : 'blue'} label={u.title} height={6} />
              </div>
            </A>
          )
        })}
      </div>
      <Card tone="yellow"><p className="small">{t('levelLocked')}</p></Card>
    </div>
  )
}
