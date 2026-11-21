import { useState } from 'react'
import { useApp } from '../../app/store'
import { Card, Chip } from '../../components/ui'
import type { TKey } from '../../i18n'

/**
 * Learner self-assessment for B1 writing and speaking (curriculum v2 §7.4): four criteria, three learner-worded levels each, NO CEFR label and no
 * number. The answers live only in this component's state: nothing is stored, scored or sent, and nothing changes XP or progress.
 */
const CRITERIA = ['Task', 'Flow', 'Words', 'Accuracy'] as const

export function WritingSelfAssessment() {
  const { t } = useApp()
  const [picked, setPicked] = useState<Record<string, number>>({})
  return (
    <Card className="selfcheck">
      <div className="eyebrow">{t('fb_selfTitle')}</div>
      <p className="muted small break">{t('fb_selfHint')}</p>
      <div className="stack stack--sm">
        {CRITERIA.map(c => (
          <div key={c} role="group" aria-label={t(`fb_crit${c}` as TKey)}>
            <div className="small">
              <b>{t(`fb_crit${c}` as TKey)}</b>
            </div>
            <div className="row">
              {[1, 2, 3].map(n => (
                <Chip key={n} tone="blue" active={picked[c] === n} onClick={() => setPicked(p => ({ ...p, [c]: n }))}>
                  {t(`fb_crit${c}${n}` as TKey)}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

const SPEAKING_ITEMS = ['fb_spkAnswered', 'fb_spkRepair', 'fb_spkStructure', 'fb_spkUnexpected'] as const

export function SpeakingSelfAssessment() {
  const { t } = useApp()
  const [ticked, setTicked] = useState<Record<string, boolean>>({})
  return (
    <div className="stack stack--sm selfcheck">
      <div className="eyebrow">{t('fb_selfTitle')}</div>
      <p className="muted small break">{t('fb_selfHint')}</p>
      <div className="stack stack--sm">
        {SPEAKING_ITEMS.map(k => (
          <div key={k}>
            <Chip tone="green" active={!!ticked[k]} onClick={() => setTicked(p => ({ ...p, [k]: !p[k] }))}>
              {ticked[k] ? '✓ ' : ''}
              {t(k)}
            </Chip>
          </div>
        ))}
      </div>
    </div>
  )
}
