import { useEffect, useMemo, useRef, useState } from 'react'
import { A } from '../../app/router'
import { useApp, useKeepActive } from '../../app/store'
import { Button, Card, Chip, PageHeader, Segmented } from '../../components/ui'
import { SpeakButton } from '../../components/SpeakButton'
import { LevelTabs } from '../../components/LevelTabs'
import { allVocabulary, levelOfUnit, listeningIndex, listeningOf } from '../../data/catalog'
import { DEFAULT_LEVEL } from '../../data/course'
import type { ListeningExercise } from '../../data/types'
import { activeLevel } from '../progress/stats'
import { displayWord } from '../../data/vocabulary'
import { speak, speakSequence, ttsSupported } from '../../services/speech'
import { pct } from '../../utils/text'
import { QuizRunner, type QuizResult } from '../tests/QuizRunner'
import { listeningQuestions } from '../tests/questions'
import { newSeed } from '../../utils/random'
import { NotFound } from '../../screens/NotFound'

export function ListeningList() {
  const { state, t } = useApp()
  const level = activeLevel(state)
  const list = listeningOf(level)
  return (
    <div className="stack">
      <PageHeader back="/practice" eyebrow="🎧" title="Listening Lab" sub={t('lab_listening_d')} />
      <LevelTabs />
      {!ttsSupported() && (
        <Card tone="yellow">
          <p className="small">{t('speechUnsupported')}</p>
        </Card>
      )}
      <div className="grid grid--2">
        {list.map(l => (
          <A key={l.id} to={`/practice/listening/${l.id}`} className="card card--interactive conceptcard">
            <div className="row row--between">
              <Chip tone="blue">{level}</Chip>
              {state.completed.includes(`ex:${l.id}`) && <Chip tone="green">✓</Chip>}
            </div>
            <h3 className="h3">{l.title}</h3>
            <p className="muted small">
              {t('unit')} {l.unit} · {l.lines.length} {t('playLine').toLowerCase()}
            </p>
          </A>
        ))}
        {list.length === 0 && <p className="muted">{t('comingSoon')}</p>}
      </div>
    </div>
  )
}

type Phase = 'listen' | 'questions' | 'transcript'

export function ListeningPlayer({ id }: { id: string }) {
  const { actions, t, lang } = useApp()
  const ex = listeningIndex.get(id)
  const [phase, setPhase] = useState<Phase>('listen')
  const [slow, setSlow] = useState(false)
  const [current, setCurrent] = useState<number | null>(null)
  const [result, setResult] = useState<QuizResult | null>(null)
  const cancel = useRef<() => void>(() => undefined)
  useKeepActive(current !== null) // the audio is playing: that is study time even without taps
  // one seed per attempt: the answer order is stable while the attempt lasts and renewed by "retry"
  const [attemptSeed, setAttemptSeed] = useState(() => newSeed())
  const qs = useMemo(() => (ex ? listeningQuestions(ex, attemptSeed).map(q => ({ ...q, audio: undefined })) : []), [ex, attemptSeed])

  useEffect(() => () => cancel.current(), [])
  if (!ex) return <NotFound />

  const rate = slow ? 0.65 : 0.95
  // authored A2 dialogue: translations and keyword glosses in the learner's OWN language only (A1 keeps its Russian display)
  const a2 = levelOfUnit(ex.unit) !== 'A1'
  const loc = (ru?: string, ky?: string) => (lang === 'ky' ? ky : lang === 'ru' ? ru : undefined)
  const playAll = () => {
    cancel.current()
    cancel.current = speakSequence(
      ex.lines.map(l => l.text),
      rate,
      setCurrent,
      () => setCurrent(null),
    )
  }
  const stop = () => {
    cancel.current()
    setCurrent(null)
  }

  const onDone = (r: QuizResult) => {
    setResult(r)
    actions.addScore('listening', pct(r.correct, r.total))
    setPhase('transcript')
  }

  const steps: { id: Phase; label: string }[] = [
    { id: 'listen', label: t('listenFirst') },
    { id: 'questions', label: t('understandQ') },
    { id: 'transcript', label: t('seeTranscript') },
  ]
  return (
    <div className="stack">
      <PageHeader
        back="/practice/listening"
        eyebrow={`🎧 ${levelOfUnit(ex.unit) ?? DEFAULT_LEVEL} · ${t('unit')} ${ex.unit}`}
        title={ex.title}
      />
      <ol className="steps steps--3">
        {steps.map((s, i) => (
          <li
            key={s.id}
            className={`step ${s.id === phase ? 'is-current' : ''} ${steps.findIndex(x => x.id === phase) > i ? 'is-done' : ''}`}
          >
            <span className="step__n">{i + 1}</span>
            <span className="step__l">{s.label}</span>
          </li>
        ))}
      </ol>

      {phase === 'listen' && (
        <Card className="player">
          <div className="player__wave" aria-hidden>
            {current !== null ? '🔊' : '🎧'}
          </div>
          <Segmented
            value={slow ? 'slow' : 'normal'}
            onChange={v => setSlow(v === 'slow')}
            options={[
              { id: 'normal', label: t('normal') },
              { id: 'slow', label: `🐢 ${t('slow')}` },
            ]}
            label="speed"
          />
          <div className="row">
            <Button onClick={playAll} disabled={!ttsSupported()}>
              ▶ {t('playAll')}
            </Button>
            <Button variant="ghost" onClick={stop}>
              ■ {t('stop')}
            </Button>
          </div>
          <p className="muted small">
            {ex.lines.map((_, i) => (
              <span key={i} className={`pdot ${current === i ? 'is-on' : ''}`} />
            ))}
          </p>
          <Button
            variant="violet"
            size="lg"
            block
            onClick={() => {
              stop()
              setPhase('questions')
            }}
          >
            {t('understandQ')} →
          </Button>
        </Card>
      )}

      {phase === 'questions' && (
        <QuizRunner
          questions={qs}
          onDone={onDone}
          activity={{ id: `ex:${ex.id}`, kind: 'listening', completes: [`${ex.unit}:listening`] }}
        />
      )}

      {phase === 'transcript' && (
        <div className="stack">
          {result && (
            <Card tone={result.correct === result.total ? 'green' : 'blue'}>
              <b>
                {result.correct} / {result.total}
              </b>{' '}
              · {pct(result.correct, result.total)}%
            </Card>
          )}
          <Card>
            <div className="row row--between">
              <div className="eyebrow">{t('transcript')}</div>
              <Segmented
                value={slow ? 'slow' : 'normal'}
                onChange={v => setSlow(v === 'slow')}
                options={[
                  { id: 'normal', label: t('normal') },
                  { id: 'slow', label: '🐢' },
                ]}
                label="speed"
              />
            </div>
            <ul className="dialog">
              {ex.lines.map((l, i) => (
                <li key={i} className={`${i % 2 ? 'dialog--r' : ''} ${current === i ? 'is-live' : ''}`}>
                  <small>{l.speaker}</small>
                  <div className="de break">
                    {l.text.split(' ').map((w, k) => (
                      <button key={k} type="button" className="tapword" onClick={() => speak(w.replace(/[.,!?]/g, ''), { rate: 0.7 })}>
                        {w}
                      </button>
                    ))}{' '}
                    <SpeakButton text={l.text} rate={rate} small label={undefined} />
                  </div>
                  {lang !== 'de' && <div className="muted small break">{a2 ? loc(l.ru, l.ky) : l.ru}</div>}
                </li>
              ))}
            </ul>
            <p className="muted small">
              {t('replayLine')} · 👆 {t('tapWord')}
            </p>
          </Card>
          <KeyWords ex={ex} />
          <div className="row">
            <Button
              variant="soft"
              onClick={() => {
                setPhase('listen')
                setResult(null)
                setAttemptSeed(newSeed())
              }}
            >
              {t('retry')}
            </Button>
            <Button to="/practice/listening">{t('continue')}</Button>
          </div>
        </div>
      )}
    </div>
  )
}

function KeyWords({ ex }: { ex: ListeningExercise }) {
  const { t, lang } = useApp()
  const a2 = levelOfUnit(ex.unit) !== 'A1'
  const loc = (ru?: string, ky?: string) => (lang === 'ky' ? ky : lang === 'ru' ? ru : undefined)
  const words = ex.keywords.map(k => allVocabulary.find(v => v.de.toLowerCase() === k.toLowerCase()) ?? null)
  return (
    <Card>
      <div className="eyebrow">{t('reviewVocab')}</div>
      <div className="row" style={{ marginTop: 8 }}>
        {ex.keywords.map((k, i) => {
          const v = words[i]
          return (
            <span key={k} className="kwchip">
              <b className="de">{v ? displayWord(v) : k}</b>
              {v && <span className="muted small"> · {a2 ? loc(v.ru, v.ky) : v.ru}</span>}
              <SpeakButton text={v ? displayWord(v) : k} small />
            </span>
          )
        })}
      </div>
    </Card>
  )
}
