import { useApp } from '../app/store'
import { Button, Card } from '../components/ui'

export function NotFound() {
  const { t } = useApp()
  return (
    <Card className="notfound">
      <h1 className="h1">{t('notFound')}</h1>
      <Button to="/">{t('goHome')}</Button>
    </Card>
  )
}
