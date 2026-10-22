import { useState, type ReactNode } from 'react'
import { A } from '../../app/router'
import { useApp } from '../../app/store'
import { Button, Card, Ring } from '../../components/ui'
import { grammarById } from '../../data/grammar'
import type { SkillName } from '../../data/types'
import { pct, tr } from '../../utils/text'
import { QuizRunner, type QuizResult } from './QuizRunner'
import type { Question } from './questions'

const SKILL_TO_SCORE: Record<string, SkillName> = { grammar: 'grammar', vocabulary: 'vocabulary', listening: 'listening', reading: 'reading' }

export function summarise(r: QuizResult) {
  const strong = Object.entries(r.bySkill).filter(([, [c, n]]) => n >= 2 && c / n >= 0.8).map(([k]) => k)
  const weakConcepts = Object.entries(r.byConcept).filter(([, [c, n]]) => c < n).sort((a, b) => a[1][0] / a[1][1] - b[1][0] / b[1][1]).map(([k]) => k)
  const weakSkills = Object.entries(r.bySkill).filter(([, [c, n]]) => n >= 2 && c / n < 0.6).map(([k]) => k)
  return { strong, weakConcepts, weakSkills, pct: pct(r.correct, r.total) }
}

export function ResultCard({ result, onRetry, children, backTo }: { result: QuizResult; onRetry?: () => void; children?: ReactNode; backTo: string }) {
  const { t, lang } = useApp()
  const s = summarise(result)
  const tone = s.pct >= 80 ? 'green' : s.pct >= 60 ? 'blue' : 'yellow'
  return (
    <Card className="result">
      <div className="result__top">
        <Ring value={s.pct} size={108} stroke={10} tone={tone}>
          <span className="result__pct">{s.pct}%</span>
        </Ring>
        <div className="grow">
          <div className="eyebrow">{t('result')}</div>
          <div className="h2">{result.correct} / {result.total}</div>
          <p className="muted small">{s.pct >= 80 ? '🎉' : s.pct >= 60 ? '👍' : '🌱'}</p>
        </div>
      </div>

      {s.strong.length > 0 && (
        <div>
          <div className="eyebrow">{t('strengths')}</div>
          <div className="row" style={{ marginTop: 6 }}>{s.strong.map(k => <span key={k} className="chip chip--green">{t(`sk_${k}` as 'sk_grammar')}</span>)}</div>
        </div>
      )}
      <div>
        <div className="eyebrow">{t('weaknesses')}</div>
        {s.weakConcepts.length === 0 && s.weakSkills.length === 0 ? (
          <p className="muted small">{t('noWeak')}</p>
        ) : (
          <div className="row" style={{ marginTop: 6 }}>
            {s.weakSkills.map(k => <span key={k} className="chip chip--yellow">{t(`sk_${k}` as 'sk_grammar')}</span>)}
            {s.weakConcepts.map(id => { const c = grammarById.get(id); return c ? <span key={id} className="chip chip--yellow">{tr(c.title, lang)}</span> : null })}
          </div>
        )}
      </div>
      {s.weakConcepts.length > 0 && (
        <div>
          <div className="eyebrow">{t('nextTopics')}</div>
          <div className="stack stack--sm" style={{ marginTop: 6 }}>
            {s.weakConcepts.slice(0, 3).map(id => {
              const c = grammarById.get(id)
              return c ? <A key={id} to={`/learn/topic/${id}`} className="linkrow">🧪 {tr(c.title, lang)} <span aria-hidden>→</span></A> : null
            })}
          </div>
        </div>
      )}
      {children}
      <div className="row">
        {onRetry && <Button variant="soft" onClick={onRetry}>{t('retry')}</Button>}
        <Button to={backTo}>{t('continue')}</Button>
      </div>
    </Card>
  )
}

/** Runs a quiz, records the skill scores, then shows a result card. */
export function QuizPage({ build, backTo, onFinished, extra }: { build: () => Question[]; backTo: string; onFinished?: (r: QuizResult) => void; extra?: (r: QuizResult) => ReactNode }) {
  const { actions } = useApp()
  const [questions, setQuestions] = useState<Question[]>(build)
  const [result, setResult] = useState<QuizResult | null>(null)

  const done = (r: QuizResult) => {
    for (const [skill, [c, n]] of Object.entries(r.bySkill)) {
      const key = SKILL_TO_SCORE[skill]
      if (key && n > 0) actions.addScore(key, (c / n) * 100)
    }
    onFinished?.(r)
    setResult(r)
  }

  if (questions.length === 0) return null
  if (result) {
    return (
      <ResultCard
        result={result}
        backTo={backTo}
        onRetry={() => {
          setQuestions(build())
          setResult(null)
        }}
      >
        {extra?.(result)}
      </ResultCard>
    )
  }
  return <QuizRunner key={questions.map(q => q.id).join('|')} questions={questions} onDone={done} />
}
