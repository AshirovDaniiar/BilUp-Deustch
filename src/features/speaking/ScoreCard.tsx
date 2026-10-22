import { useApp } from '../../app/store'
import { ScoreBar } from '../../components/ui'
import type { SpeakingScore } from '../../services/analysis'

export function SpeakScoreCard({ score }: { score: SpeakingScore }) {
  const { t } = useApp()
  return (
    <div className="scorecard">
      <div className="scorecard__grid">
        <ScoreBar label={t('sk_pronunciation')} value={score.pronunciation} />
        <ScoreBar label={t('sk_grammar')} value={score.grammar} />
        <ScoreBar label={t('sk_vocabulary')} value={score.vocabulary} />
        <ScoreBar label={t('sk_naturalness')} value={score.naturalness} />
      </div>
      {score.pronunciation == null && <p className="muted small">{t('sk_pronunciation')}: {t('pronunciationNA')}</p>}
      {score.corrections.map(c => (
        <div key={c.wrong + c.right} className="correction">
          <div className="bad break">✗ {c.wrong}</div>
          <div className="good break">✓ {c.right}</div>
          <div className="muted small break">{c.why}</div>
        </div>
      ))}
      <p className="small break">💡 {score.tip}</p>
    </div>
  )
}
