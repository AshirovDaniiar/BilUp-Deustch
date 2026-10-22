import { useState } from 'react'
import { A } from '../../app/router'
import { useApp } from '../../app/store'
import { Button, Card, PageHeader } from '../../components/ui'
import { SpeakButton } from '../../components/SpeakButton'
import { REAL_LIFE, realLifeById } from '../../data/reallife'
import { tr } from '../../utils/text'
import { NotFound } from '../../screens/NotFound'

export function RealLifeList() {
  const { state, t } = useApp()
  return (
    <div className="stack">
      <PageHeader back="/practice" title={t('realTitle')} sub={t('realSub')} />
      <div className="grid grid--3">
        {REAL_LIFE.map(r => (
          <A key={r.id} to={`/practice/real/${r.id}`} className="card card--interactive tilecard">
            <span className="tilecard__icon" aria-hidden>{r.icon}</span>
            <b>{r.title}</b>
            <span className="muted small">{r.titleRu}{state.completed.includes(`ex:real-${r.id}`) ? ' ✓' : ''}</span>
          </A>
        ))}
      </div>
    </div>
  )
}

export function RealLifeTopic({ id }: { id: string }) {
  const { actions, state, t, lang } = useApp()
  const topic = realLifeById.get(id)
  const [pick, setPick] = useState<number | null>(null)
  if (!topic) return <NotFound />
  const ch = topic.challenge
  const done = pick !== null
  const answer = (i: number) => {
    if (done) return
    setPick(i)
    if (i === ch.answer) { actions.addXp(10); actions.complete(`ex:real-${topic.id}`) } else actions.addMistake({ kind: 'vocabulary', ref: `real-${topic.id}` })
  }
  return (
    <div className="stack">
      <PageHeader back="/practice/real" eyebrow={`${topic.icon} ${t('lab_real')}`} title={topic.title} sub={topic.titleRu} />
      <Card><div className="eyebrow">{t('vocabulary')}</div>
        <ul className="examples">{topic.vocab.map(v => <li key={v.de}><div className="grow"><b className="de">{v.de}</b><div className="muted small">{v.ru}</div></div><SpeakButton text={v.de} small /></li>)}</ul>
      </Card>
      <Card tone="blue"><div className="eyebrow">{t('usefulPhrases')}</div>
        <ul className="examples">{topic.phrases.map(p => <li key={p.de}><div className="grow"><div className="de break">{p.de}</div><div className="muted small break">{p.ru}</div></div><SpeakButton text={p.de} small /></li>)}</ul>
      </Card>
      <Card><div className="eyebrow">{t('dialogue')}</div>
        <ul className="dialog">{topic.dialogue.map((d, i) => <li key={i} className={i % 2 ? 'dialog--r' : ''}><small>{d.speaker}</small><div className="de break">{d.text} <SpeakButton text={d.text} small /></div><div className="muted small break">{d.ru}</div></li>)}</ul>
      </Card>
      <Card tone="violet"><div className="eyebrow">{t('miniChallenge')}</div>
        <p className="h3 break">{ch.q}</p>
        <div className="quiz__options">
          {ch.options.map((o, i) => <button key={o} type="button" className={`option ${done ? (i === ch.answer ? 'is-right' : i === pick ? 'is-wrong' : 'is-dim') : ''}`} onClick={() => answer(i)} disabled={done}>{o}</button>)}
        </div>
        {done && <div className={`feedback ${pick === ch.answer ? 'feedback--ok' : 'feedback--bad'}`}><strong>{pick === ch.answer ? `✓ ${t('correct')}` : `✗ ${t('incorrect')}`}</strong><p>{tr(ch.why, lang)}</p></div>}
      </Card>
      {topic.speakingScenarioId && <Button to={`/speak/${topic.speakingScenarioId}`} variant="violet" size="lg" block>🎙️ {t('trySpeaking')} →</Button>}
      {state.completed.includes(`ex:real-${topic.id}`) && <p className="muted small">✓ {t('completed')}</p>}
    </div>
  )
}
