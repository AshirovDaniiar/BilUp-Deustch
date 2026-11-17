import { Button, Card } from '../components/ui'
import { useApp } from './store'

/** Shown while a lazy level's content (separate chunk) is loading. Localised through the normal dictionaries (ru / ky / de). */
export function LevelLoading() {
  const { t } = useApp()
  return (
    <Card className="notfound">
      <p role="status" className="muted">{t('levelLoading')}</p>
    </Card>
  )
}

/** Load failure with a retry that re-requests the chunk WITHOUT reloading the application. After a retry also failed, the text adds the page-reload hint. */
export function LevelLoadFailed({ retried, onRetry }: { retried: boolean; onRetry: () => void }) {
  const { t } = useApp()
  return (
    <Card className="notfound">
      <p role="alert">{t('levelLoadFailed')}</p>
      {retried && <p className="muted small">{t('levelLoadFailedAgain')}</p>}
      <Button onClick={onRetry}>{t('retry')}</Button>
    </Card>
  )
}
