import { useApp } from '../app/store'
import { courseLevel } from '../data/course'
import type { LanguageLevel } from '../data/types'
import { Card } from './ui'

/**
 * Disclosure shown on the screens of a level whose status is `beta` (A2 today; B1 when it is released as a Beta). The text names the ACTIVE level (placeholder {level}); for A2 it is word for word the original notice: the content is still under expert review and translations may change.
 * It claims no CEFR or native-language approval. Renders nothing for released levels.
 */
export function BetaNotice({ level }: { level: LanguageLevel }) {
  const { t } = useApp()
  if (courseLevel(level)?.status !== 'beta') return null
  return (
    <Card tone="yellow" className="betanotice">
      <p className="small break">
        <b>{level} · Beta.</b> {t('betaNoticeLevel').replace('{level}', level)}
      </p>
    </Card>
  )
}
