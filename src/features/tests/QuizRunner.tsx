import { useMemo, useRef, useState } from 'react'
import { useApp, useAttempt } from '../../app/store'
import { Button, ProgressBar } from '../../components/ui'
import { SpeakButton } from '../../components/SpeakButton'
import { A } from '../../app/router'
import { audioAvailable } from '../../services/speech'
import { normalize } from '../../utils/text'
import type { ActivityKind } from '../../progress/types'
import { questionHint, questionWhy, type Question } from './questions'

/** What a quiz IS, for the progress engine (03 §3). Every quiz must say; the engine decides XP and completion. */
export interface QuizActivity {
  id: string
  kind: Extract<ActivityKind, 'quiz' | 'review' | 'assessment' | 'reading' | 'listening'>
  /** completion keys satisfied when the quiz PASSES (e.g. the unit section `3:test`) */
  completes?: string[]
}

export interface QuizResult {
  correct: number
  total: number
  wrong: Question[]
  bySkill: Record<string, [number, number]>
  byConcept: Record<string, [number, number]>
  bySection: Record<string, [number, number]>
}

interface Props {
  questions: Question[]
  onDone: (r: QuizResult) => void
  /** optional section tag per question (used by the daily challenge) */
  sections?: string[]
  activity: QuizActivity
}

export function QuizRunner({ questions, onDone, sections, activity }: Props) {
  const { actions, t, lang } = useApp()
  const attempt = useAttempt()
  const [idx, setIdx] = useState(0)
  const [picked, setPicked] = useState<string | null>(null)
  const [order, setOrder] = useState<number[]>([])
  const [checked, setChecked] = useState<null | boolean>(null)
  const log = useRef<{ q: Question; ok: boolean; section?: string }[]>([])

  const q = questions[idx]
  const pool = useMemo(() => (q?.type === 'order' ? (q.words ?? []).map((w, i) => ({ w, i })) : []), [q])

  if (!q) return null

  const finishQuestion = (ok: boolean, given: string) => {
    setChecked(ok)
    setPicked(given)
    log.current.push({ q, ok, section: sections?.[idx] })
    if (q.vocabId) actions.answerVocab(q.vocabId, ok)
    if (!ok) actions.addMistake({ kind: q.kind, ref: q.id, concept: q.concept })
  }

  const choose = (opt: string) => {
    if (checked !== null) return
    finishQuestion(normalize(opt) === normalize(q.answer), opt)
  }

  const checkOrder = () => {
    if (checked !== null) return
    const given = order.map(i => pool.find(p => p.i === i)!.w).join(' ')
    finishQuestion(normalize(given) === normalize(q.answer), given)
  }

  const next = () => {
    if (idx + 1 >= questions.length) {
      const bySkill: QuizResult['bySkill'] = {}
      const byConcept: QuizResult['byConcept'] = {}
      const bySection: QuizResult['bySection'] = {}
      const bump = (m: Record<string, [number, number]>, k: string | undefined, ok: boolean) => {
        if (!k) return
        const c = m[k] ?? [0, 0]
        m[k] = [c[0] + (ok ? 1 : 0), c[1] + 1]
      }
      log.current.forEach(({ q: qq, ok, section }) => {
        bump(bySkill, qq.skill, ok)
        bump(byConcept, qq.concept, ok)
        bump(bySection, section, ok)
      })
      const correct = log.current.filter(l => l.ok).length
      attempt.finish({
        activityId: activity.id,
        kind: activity.kind,
        completes: activity.completes,
        items: log.current.map(l => ({ itemRef: `q:${l.q.id}`, outcome: l.ok ? ('correct' as const) : ('incorrect' as const) })),
        score: { earned: correct, possible: Math.max(1, log.current.length) },
      })
      onDone({ correct, total: log.current.length, wrong: log.current.filter(l => !l.ok).map(l => l.q), bySkill, byConcept, bySection })
      return
    }
    setIdx(idx + 1)
    setPicked(null)
    setOrder([])
    setChecked(null)
  }

  // authored A2 questions are shown strictly in the learner's own language (no Russian for a Kyrgyz learner); A1 questions keep their Russian hint
  const hint = questionHint(q, lang)
  const why = questionWhy(q, lang)
  const parts = q.type === 'fill' ? q.prompt.split('___') : null
  const optionStyle = q.type === 'article' ? 'quiz__options quiz__options--article' : 'quiz__options'

  return (
    <div className="quiz">
      <div className="quiz__top">
        <span className="small muted">
          {t('questionOf')} {idx + 1} / {questions.length}
        </span>
        <div className="grow">
          <ProgressBar value={((idx + (checked !== null ? 1 : 0)) / questions.length) * 100} />
        </div>
      </div>

      <div className="quiz__body" key={q.id}>
        {q.type === 'article' && <div className="quiz__kicker">{t('lab_articles')}</div>}
        <div className="quiz__prompt">
          {parts ? (
            <span className="break">
              {parts[0]}
              <span className={`blank ${checked === null ? '' : checked ? 'blank--ok' : 'blank--bad'}`}>{picked ?? '    '}</span>
              {parts[1]}
            </span>
          ) : q.type === 'article' ? (
            <span className="quiz__word">___ {q.prompt}</span>
          ) : (
            <span className="break">{q.prompt}</span>
          )}
          {q.audio && <SpeakButton text={q.audio} small />}
        </div>
        {hint && <p className="muted small break">{hint}</p>}
        {q.skill === 'listening' && q.audio && !audioAvailable() && (
          <div className="feedback" role="note">
            <p className="small">{t('audioUnavailable')}</p>
            <p className="break">{q.audio}</p>
          </div>
        )}

        {q.type === 'order' ? (
          <>
            <div className={`orderline ${checked === null ? '' : checked ? 'orderline--ok' : 'orderline--bad'}`} aria-live="polite">
              {order.length === 0 && <span className="muted small">{t('tapBlock')}</span>}
              {order.map(i => (
                <button
                  key={i}
                  type="button"
                  className="wordchip wordchip--placed"
                  disabled={checked !== null}
                  onClick={() => setOrder(order.filter(x => x !== i))}
                >
                  {pool.find(p => p.i === i)!.w}
                </button>
              ))}
            </div>
            <div className="wordbank">
              {pool.map(p => (
                <button
                  key={p.i}
                  type="button"
                  className="wordchip"
                  disabled={order.includes(p.i) || checked !== null}
                  onClick={() => setOrder([...order, p.i])}
                >
                  {p.w}
                </button>
              ))}
            </div>
            {checked === null && (
              <Button onClick={checkOrder} disabled={order.length === 0} block>
                {t('check')}
              </Button>
            )}
          </>
        ) : (
          <div className={optionStyle}>
            {(q.options ?? []).map(o => {
              const state = checked === null ? '' : normalize(o) === normalize(q.answer) ? 'is-right' : o === picked ? 'is-wrong' : 'is-dim'
              return (
                <button key={o} type="button" className={`option ${state}`} onClick={() => choose(o)} disabled={checked !== null}>
                  {o}
                </button>
              )
            })}
          </div>
        )}

        {checked !== null && (
          <div className={`feedback ${checked ? 'feedback--ok' : 'feedback--bad'}`} role="status">
            <strong>{checked ? `✓ ${t('correct')}` : `✗ ${t('incorrect')}`}</strong>
            {!checked && (
              <div className="break">
                <span className="muted small">→ </span>
                <b>{q.answer}</b>
              </div>
            )}
            {why && <p className="break">{why}</p>}
            {!checked && q.concept && (
              <A to={`/grammar/${q.concept}`} className="feedback__link">
                {t('why')} →
              </A>
            )}
            <Button onClick={next} block size="lg">
              {idx + 1 >= questions.length ? t('finish') : t('continue')}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
