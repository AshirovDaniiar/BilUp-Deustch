import { useApp } from '../../app/store'
import { Card } from '../../components/ui'
import type { B1LevelAssessment } from '../../data/b1/types'
import { trStrict } from '../../utils/text'
import { evaluateLevel } from './levelAssessment'
import type { QuizResult } from './QuizRunner'

/**
 * The result of an authored indicative level assessment (B1): the BAND (reached / almost / repetition recommended) from the provisional rule, the result of every part, and the
 * fixed statement that this is a progress check of the course content — not a certificate, no prediction of an official exam, no assessment of speaking or writing.
 * All texts are authored data (independent Russian and Kyrgyz); the card shows the learner's own language only. It never shows a CEFR level.
 */
export function LevelResultCard({ assessment, result }: { assessment: B1LevelAssessment; result: QuizResult }) {
  const { lang } = useApp()
  const o = evaluateLevel(assessment, result.bySection)
  const tone = o.band === 'reached' ? 'green' : o.band === 'almost' ? 'blue' : 'yellow'
  return (
    <Card tone={tone} className="stack stack--sm">
      <div className="h3" data-testid="level-band" data-band={o.band}>
        {trStrict(assessment.bands[o.band], lang)}
      </div>
      <ul className="stack stack--sm" aria-label="parts">
        {assessment.parts.map(p => {
          const r = o.parts.find(x => x.key === p.key)!
          return (
            <li key={p.key} data-testid={`level-part-${p.key}`} data-ok={r.ok} className="small">
              <b>
                {p.key} · {trStrict(p.title, lang)}
              </b>{' '}
              — {r.correct} / {r.total}
              {r.ok ? ' ✓' : ' ⚠'}
              <span className="muted"> ({trStrict(p.scope, lang)})</span>
            </li>
          )
        })}
      </ul>
      {!assessment.questions.some(q => q.part === 'D') && (
        <p className="small" data-testid="level-listening-note">
          {trStrict(assessment.listeningNote, lang)}
        </p>
      )}
      <p className="small" data-testid="level-statement">
        {trStrict(assessment.statement, lang)}
      </p>
      <p className="small muted" data-testid="level-companion">
        {trStrict(assessment.companion, lang)}
      </p>
    </Card>
  )
}
