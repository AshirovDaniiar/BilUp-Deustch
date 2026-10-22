import { useEffect, useRef, useState } from 'react'
import { A } from '../../app/router'
import { useApp } from '../../app/store'
import { Button, Card, Chip, PageHeader } from '../../components/ui'
import { SpeakButton } from '../../components/SpeakButton'
import { SPEAKING, speakingById } from '../../data/speaking'
import { unitOfScenario } from '../../data/units'
import { analyseSpeaking, type SpeakingScore } from '../../services/analysis'
import { speak } from '../../services/speech'
import { tr } from '../../utils/text'
import { NotFound } from '../../screens/NotFound'
import { SpeakInput } from './SpeakInput'
import { SpeakScoreCard } from './ScoreCard'

export function SpeakingList() {
  const { state, t, lang } = useApp()
  return (
    <div className="stack">
      <PageHeader eyebrow="🎙️" title={t('speakingLab')} sub={t('speakingLabSub')} />
      <div className="grid grid--2">
        {SPEAKING.map(s => (
          <A key={s.id} to={`/speak/${s.id}`} className="card card--interactive tilecard">
            <div className="row row--between"><span className="tilecard__icon" aria-hidden>{s.icon}</span><div className="row"><Chip tone="blue">{s.level}</Chip>{state.completed.includes(`speak:${s.id}`) && <Chip tone="green">✓</Chip>}</div></div>
            <b>{s.title}</b>
            <span className="muted small">{s.titleRu}</span>
            <span className="muted small break">{tr(s.goal, lang)}</span>
          </A>
        ))}
      </div>
    </div>
  )
}

interface Msg { id: number; role: 'ai' | 'user'; text: string; ru?: string; score?: SpeakingScore }

export function SpeakingSession({ id }: { id: string }) {
  const { actions, t, lang } = useApp()
  const sc = speakingById.get(id)
  const [turn, setTurn] = useState(0)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [awaitingNext, setAwaitingNext] = useState(false)
  const [done, setDone] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [showRu, setShowRu] = useState(false)
  const scores = useRef<SpeakingScore[]>([])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sc) return
    const t0 = sc.turns[0]
    setMsgs([{ id: 0, role: 'ai', text: t0.ai, ru: t0.aiRu }])
    setTurn(0)
    setDone(false)
    scores.current = []
    const tm = window.setTimeout(() => speak(t0.ai), 350)
    return () => window.clearTimeout(tm)
  }, [sc])

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [msgs, done])

  if (!sc) return <NotFound />

  const onAnswer = (text: string, conf: number | null) => {
    if (awaitingNext || done) return
    const current = sc.turns[turn]
    const score = analyseSpeaking(text, current, conf)
    scores.current.push(score)
    setMsgs(m => [...m, { id: m.length, role: 'user', text, score }])
    setAwaitingNext(true)
    setShowHints(false)
  }

  const next = () => {
    const n = turn + 1
    setAwaitingNext(false)
    if (n >= sc.turns.length) {
      finish()
      return
    }
    setTurn(n)
    setMsgs(m => [...m, { id: m.length, role: 'ai', text: sc.turns[n].ai, ru: sc.turns[n].aiRu }])
    setTimeout(() => speak(sc.turns[n].ai), 250)
  }

  const finish = () => {
    setDone(true)
    const all = scores.current
    const avg = (f: (s: SpeakingScore) => number) => all.reduce((a, s) => a + f(s), 0) / Math.max(1, all.length)
    actions.addScore('speaking', (avg(s => s.grammar) + avg(s => s.vocabulary) + avg(s => s.naturalness) + avg(s => s.fluency)) / 4)
    actions.addXp(20)
    actions.complete(`speak:${sc.id}`)
    const u = unitOfScenario(sc.id)
    if (u > 0) actions.complete(`${u}:speaking`)
    all.forEach(s => s.corrections.length && s.grammar < 85 && actions.addMistake({ kind: 'grammar', ref: `speak-${sc.id}` }))
  }

  const total = scores.current.length
  const avgOf = (f: (s: SpeakingScore) => number | null) => {
    const v = scores.current.map(f).filter((x): x is number => x != null)
    return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null
  }
  const currentTurn = sc.turns[turn]

  return (
    <div className="stack session">
      <PageHeader back="/speak" eyebrow={`${sc.icon} ${sc.level}`} title={sc.title} sub={`${t('yourGoal')}: ${tr(sc.goal, lang)}`} />
      <div className="chat" aria-live="polite">
        {msgs.map(m => (
          <div key={m.id} className={`bubble bubble--${m.role}`}>
            {m.role === 'ai' && <small className="bubble__who">BilUp AI</small>}
            <div className="de break">{m.text} {m.role === 'ai' && <SpeakButton text={m.text} small />}</div>
            {m.role === 'ai' && m.ru && showRu && <div className="muted small break">{m.ru}</div>}
            {m.score && <div className="bubble__score"><SpeakScoreCard score={m.score} /></div>}
          </div>
        ))}
        {done && (
          <Card tone="green" className="result">
            <div className="eyebrow">{t('scenarioDone')}</div>
            <div className="scorecard__grid">
              {[['sk_pronunciation', avgOf(s => s.pronunciation)], ['sk_grammar', avgOf(s => s.grammar)], ['sk_vocabulary', avgOf(s => s.vocabulary)], ['sk_fluency', avgOf(s => s.fluency)], ['sk_naturalness', avgOf(s => s.naturalness)]].map(([k, v]) => (
                <div key={String(k)} className="scorebar"><div className="scorebar__top"><span>{t(k as 'sk_grammar')}</span><strong>{v == null ? '—' : `${v}%`}</strong></div></div>
              ))}
            </div>
            <p className="muted small">{total} / {sc.turns.length} · {t('analysisDisclaimer')}</p>
            <div className="row"><Button to="/speak">{t('backToScenarios')}</Button><Button variant="soft" onClick={() => window.location.reload()}>{t('retry')}</Button></div>
          </Card>
        )}
        <div ref={endRef} />
      </div>

      {!done && (
        <div className="composer">
          <div className="row">
            <button type="button" className="chip" onClick={() => setShowRu(s => !s)}>🌐 {t('showTranslation')}</button>
            <button type="button" className="chip chip--yellow" onClick={() => setShowHints(s => !s)}>💡 {t('hints')}</button>
          </div>
          {showHints && (
            <div className="stack stack--sm">
              {currentTurn.hints.map(h => (
                <button key={h} type="button" className="hintbtn de" onClick={() => onAnswer(h, null)}>{h}</button>
              ))}
            </div>
          )}
          {awaitingNext ? (
            <Button size="lg" block onClick={next}>{turn + 1 >= sc.turns.length ? t('finish') : t('continue')} →</Button>
          ) : (
            <SpeakInput onResult={onAnswer} />
          )}
        </div>
      )}
    </div>
  )
}
