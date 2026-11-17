import { useState } from 'react'
import { A } from '../../app/router'
import { useApp, useAttempt } from '../../app/store'
import { Button, Card, Chip, PageHeader, ScoreBar } from '../../components/ui'
import { LevelTabs } from '../../components/LevelTabs'
import { levelOfUnit, writingIndex, writingOf } from '../../data/catalog'
import { DEFAULT_LEVEL } from '../../data/course'
import { activeLevel } from '../progress/stats'
import { analyseWriting, type WritingFeedback } from '../../services/analysis'
import { tr } from '../../utils/text'
import { NotFound } from '../../screens/NotFound'

export function WritingList() {
  const { state, t } = useApp()
  const level = activeLevel(state)
  const list = writingOf(level)
  return (
    <div className="stack">
      <PageHeader back="/practice" eyebrow="✍️" title="Writing Lab" sub={t('lab_writing_d')} />
      <LevelTabs />
      <div className="grid grid--2">
        {list.map(w => (
          <A key={w.id} to={`/practice/writing/${w.id}`} className="card card--interactive conceptcard">
            <div className="row row--between">
              <Chip tone="blue">{level}</Chip>
              <Chip tone={w.formal ? 'violet' : 'yellow'}>{w.formal ? 'Sie' : 'du'}</Chip>
              {state.completed.includes(`ex:${w.id}`) && <Chip tone="green">✓</Chip>}
            </div>
            <h3 className="h3">{w.title}</h3>
            <p className="muted small">
              {t('unit')} {w.unit} · ≥ {w.minWords} {t('wordCount')}
            </p>
          </A>
        ))}
      </div>
    </div>
  )
}

export function WritingEditor({ id }: { id: string }) {
  const { actions, t, lang } = useApp()
  const attempt = useAttempt()
  const task = writingIndex.get(id)
  const [text, setText] = useState('')
  const [fb, setFb] = useState<WritingFeedback | null>(null)
  if (!task) return <NotFound />
  const words = text.split(/\s+/).filter(Boolean).length

  const analyse = () => {
    if (words < 3) return
    const r = analyseWriting(text, task)
    setFb(r)
    const s = r.scores
    const avg = (s.grammar + s.vocabulary + s.wordorder + s.spelling + s.style + s.formality) / 6
    actions.addScore('writing', avg)
    attempt.finish({ activityId: `ex:${task.id}`, kind: 'writing', completes: [`${task.unit}:writing`], evidence: 'heuristic' })
    attempt.renew() // the next analysis is a new attempt (its bonus is already taken)
    r.errors.forEach(e => actions.addMistake({ kind: 'writing', ref: task.id, concept: e.concept }))
  }

  return (
    <div className="stack">
      <PageHeader
        back="/practice/writing"
        eyebrow={`✍️ ${levelOfUnit(task.unit) ?? DEFAULT_LEVEL} · ${task.formal ? 'Sie' : 'du'}`}
        title={task.title}
      />
      <Card tone="blue">
        <div className="eyebrow">{t('writingPrompt')}</div>
        <p className="break">{tr(task.situation, lang)}</p>
        <ul className="bullets small">
          {task.mustInclude.map(m => (
            <li key={m.label}>{m.label}</li>
          ))}
        </ul>
      </Card>
      <Card>
        <label className="eyebrow" htmlFor="wr">
          {t('yourText')}
        </label>
        <textarea
          id="wr"
          className="textarea"
          rows={8}
          value={text}
          onChange={e => {
            setText(e.target.value)
            if (fb) setFb(null)
          }}
          placeholder={t('writingHint')}
          lang="de"
          spellCheck={false}
        />
        <div className="row row--between">
          <span className={`small ${words >= task.minWords ? 'good' : 'muted'}`}>
            {words} / {task.minWords} {t('wordCount')}
          </span>
          <Button onClick={analyse} disabled={words < 3}>
            {t('analyse')}
          </Button>
        </div>
        {words > 0 && words < 3 && <p className="muted small">{t('needMore')}</p>}
      </Card>

      {fb && (
        <div className="stack">
          <Card>
            <div className="eyebrow">{t('analyse')}</div>
            <div className="scorecard__grid">
              <ScoreBar label={t('sk_grammar')} value={fb.scores.grammar} />
              <ScoreBar label={t('sk_vocabulary')} value={fb.scores.vocabulary} />
              <ScoreBar label={t('sk_wordorder')} value={fb.scores.wordorder} />
              <ScoreBar label={t('sk_spelling')} value={fb.scores.spelling} />
              <ScoreBar label={t('sk_style')} value={fb.scores.style} />
              <ScoreBar label={t('sk_formality')} value={fb.scores.formality} />
            </div>
            <ul className="checks">
              {fb.checks.map(c => (
                <li key={c.text} className={c.ok ? 'ok' : 'no'}>
                  {c.ok ? '✓' : '✗'} {c.text}
                </li>
              ))}
            </ul>
            <p className="small break">{fb.formalityNote}</p>
          </Card>

          <Card>
            <div className="eyebrow">{t('whyChanges')}</div>
            {fb.errors.length === 0 && fb.spelling.length === 0 && fb.missing.length === 0 && <p className="good">✓ {t('correct')}</p>}
            <ul className="mistakes">
              {fb.errors.map(e => (
                <li key={e.id}>
                  <div className="bad break">✗ {e.wrong}</div>
                  <div className="good break">✓ {e.right}</div>
                  <div className="muted small break">{tr(e.why, lang)}</div>
                  <A to={`/grammar/${e.concept}`} className="feedback__link">
                    {t('why')} →
                  </A>
                </li>
              ))}
              {fb.spelling.map(s => (
                <li key={s.word}>
                  <div className="bad break">✗ {s.word}</div>
                  <div className="good break">✓ {s.fix}</div>
                </li>
              ))}
              {fb.missing.map(m => (
                <li key={m}>
                  <div className="muted break">➕ {m}</div>
                </li>
              ))}
            </ul>
          </Card>

          <div className="grid grid--2">
            <Card>
              <div className="eyebrow">{t('yourVersion')}</div>
              <p className="break pre">{text}</p>
            </Card>
            <Card tone="green">
              <div className="eyebrow">{t('betterVersion')}</div>
              <p className="break pre de">{task.model}</p>
            </Card>
          </div>
          <Card>
            <div className="eyebrow">💡</div>
            <ul className="bullets">
              {task.tips.map(x => (
                <li key={x.ru} className="break">
                  {tr(x, lang)}
                </li>
              ))}
            </ul>
          </Card>
          <p className="muted small">{t('analysisDisclaimer')}</p>
          <Button to="/practice/writing" variant="soft">
            {t('continue')}
          </Button>
        </div>
      )}
    </div>
  )
}
