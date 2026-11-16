import { STORAGE_MESSAGES } from '../app/storage-messages'
import { useApp } from '../app/store'
import { Button, Card, PageHeader, Segmented } from '../components/ui'
import { Mascot } from '../components/Mascot'
import type { Lang } from '../data/types'
import { LANG_LABELS } from '../i18n'

export function ProfileScreen() {
  const { state, actions, t } = useApp()
  return (
    <div className="stack">
      <PageHeader eyebrow="👤" title={t('profileTitle')} />
      <Card>
        <div className="row"><Mascot size={72} /><div><div className="h3">BilUp Til</div><div className="muted small">{t('tagline')}</div></div></div>
      </Card>
      <Card className="stack">
        <label className="field">
          <span className="eyebrow">{t('yourName')}</span>
          <input className="input" value={state.name} maxLength={24} onChange={e => actions.setProfile({ name: e.target.value })} />
        </label>
        <div className="field">
          <span className="eyebrow">{t('interfaceLang')}</span>
          <Segmented<Lang> value={state.lang} onChange={lang => actions.setProfile({ lang })} options={(Object.keys(LANG_LABELS) as Lang[]).map(l => ({ id: l, label: LANG_LABELS[l] }))} label={t('interfaceLang')} />
        </div>
        <div className="field">
          <span className="eyebrow">{t('theme')}</span>
          <Segmented value={state.theme} onChange={theme => actions.setProfile({ theme })} options={[{ id: 'auto', label: t('theme_auto') }, { id: 'light', label: `☀️ ${t('theme_light')}` }, { id: 'dark', label: `🌙 ${t('theme_dark')}` }]} label={t('theme')} />
        </div>
        <div className="field">
          <span className="eyebrow">{t('weeklyGoal')}: {state.weeklyGoal}</span>
          <input type="range" min={1} max={7} value={state.weeklyGoal} onChange={e => actions.setProfile({ weeklyGoal: Number(e.target.value) })} aria-label={t('weeklyGoal')} />
        </div>
      </Card>
      <Card tone="yellow">
        <p className="small">{t('dataLocal')}</p>
        <Button variant="ghost" size="sm" onClick={() => { if (!window.confirm(t('resetConfirm'))) return; const out = actions.reset(); if (out === 'no-snapshot') window.alert(STORAGE_MESSAGES[state.lang].resetRefused); else if (out === 'upgrade-pending') window.alert(STORAGE_MESSAGES[state.lang].upgradePendingRefusal) }}>{t('resetData')}</Button>
      </Card>
    </div>
  )
}
