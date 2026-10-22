import { A } from '../app/router'
import { useApp } from '../app/store'
import { Button, Card, ProgressBar, Ring, SectionTitle } from '../components/ui'
import { LEVELS } from '../data/types'
import { vocabForUnit } from '../data/vocabulary'
import { grammarById } from '../data/grammar'
import { LISTENING } from '../data/listening'
import { SPEAKING } from '../data/speaking'
import { UNITS, UNIT_SPEAKING } from '../data/units'
import { currentUnit, dueWordIds, levelProgress, recommendations, streak, weekDone } from '../features/progress/stats'
import { currentWeek, dayKey, greetingKey } from '../utils/date'
import { tr } from '../utils/text'
import type { TKey } from '../i18n'

const DAY_LABELS = ['M', 'D', 'M', 'D', 'F', 'S', 'S']

export function HomeScreen() {
  const { state, t, lang } = useApp()
  const unit = currentUnit(state)
  const conceptId = unit.grammarIds[0]
  const concept = grammarById.get(conceptId)
  const listening = LISTENING.find(l => l.unit === unit.id) ?? LISTENING[0]
  const scenario = SPEAKING.find(s => s.id === UNIT_SPEAKING[unit.id - 1]) ?? SPEAKING[0]
  const st = streak(state)
  const week = weekDone(state)
  const week7 = currentWeek()
  const today = dayKey()
  const recs = recommendations(state)
  const due = dueWordIds(state).length
  const dailyDone = !!state.daily[today]?.speaking
  const progress = levelProgress(state)

  const steps: { n: string; label: TKey; title: string; sub: string; to: string; done: boolean }[] = [
    { n: '01', label: 'stepVocabulary', title: `${Math.min(10, vocabForUnit(unit.id).length)} ${t('newWords')}`, sub: unit.title, to: `/learn/unit/${unit.id}/vocabulary`, done: state.completed.includes(`${unit.id}:vocabulary`) },
    { n: '02', label: 'stepGrammar', title: concept ? tr(concept.title, lang) : '—', sub: concept ? tr(concept.summary, lang).slice(0, 56) + '…' : '', to: `/learn/topic/${conceptId}`, done: state.completed.includes(`topic:${conceptId}`) },
    { n: '03', label: 'stepListening', title: listening.title, sub: `${listening.level} · 🎧 ${listening.lines.length}`, to: `/practice/listening/${listening.id}`, done: state.completed.includes(`ex:${listening.id}`) },
    { n: '04', label: 'stepSpeaking', title: scenario.title, sub: scenario.titleRu, to: `/speak/${scenario.id}`, done: state.completed.includes(`speak:${scenario.id}`) },
    { n: '05', label: 'stepTest', title: `8 ${t('questionsN')}`, sub: `${t('unit')} ${unit.id}`, to: `/practice/tests/unit-${unit.id}`, done: state.completed.includes(`${unit.id}:test`) },
  ]
  const next = steps.find(s => !s.done) ?? steps[0]

  return (
    <div className="stack home">
      <section className="hero">
        <div className="hero__text">
          <div className="eyebrow">{t('tagline')}</div>
          <h1 className="h1">{t(greetingKey())}, {state.name} 👋</h1>
        </div>
        <div className="hero__stats">
          <div className="hstat"><span className="hstat__n">🔥 {st}</span><span className="hstat__l">{t('streak')} · {t('daysShort')}</span></div>
          <div className="hstat"><span className="hstat__n">{week} / 7</span><span className="hstat__l">{t('weekly')}</span></div>
          <div className="hstat"><span className="hstat__n">{state.xp}</span><span className="hstat__l">XP</span></div>
        </div>
      </section>

      <Card className="journey">
        <div className="row row--between">
          <div className="eyebrow">{t('journey')}</div>
          <span className="chip chip--blue">{t('currentLevel')}: {state.level}</span>
        </div>
        <ol className="journey__track" aria-label={t('journey')}>
          {LEVELS.map(l => (
            <li key={l} className={`journey__node ${l === state.level ? 'is-current' : ''} ${l !== state.level && LEVELS.indexOf(l) < LEVELS.indexOf(state.level) ? 'is-done' : ''}`}>
              <span className="journey__dot">{l === state.level ? '●' : ''}</span>
              <span className="journey__label">{l}</span>
            </li>
          ))}
        </ol>
        <div className="row row--between small muted"><span>A1 · {UNITS.length} {t('unit').toLowerCase()}</span><b>{progress}%</b></div>
        <ProgressBar value={progress} label="A1" />
      </Card>

      <section>
        <SectionTitle right={<span className="chip">⏱ 15 {t('min')} · {t('session')}</span>}>{t('todayLearning')}</SectionTitle>
        <div className="path">
          {steps.map((s, i) => (
            <A key={s.n} to={s.to} className={`pathstep ${s.done ? 'is-done' : ''} ${s === next ? 'is-next' : ''}`}>
              <span className="pathstep__num">{s.done ? '✓' : s.n}</span>
              <span className="pathstep__body">
                <small>{t(s.label)}</small>
                <b className="break">{s.title}</b>
                <span className="muted small break">{s.sub}</span>
              </span>
              <span className="pathstep__go" aria-hidden>→</span>
              {i < steps.length - 1 && <span className="pathstep__line" aria-hidden />}
            </A>
          ))}
        </div>
        <div style={{ marginTop: 16 }}>
          <Button to={next.to} size="lg" block>{t('continueLearning')} →</Button>
        </div>
      </section>

      <div className="grid grid--2">
        <Card>
          <div className="eyebrow">{t('weekly')}</div>
          <div className="weekdots" role="img" aria-label={`${week} / 7`}>
            {week7.map((d, i) => (
              <div key={d} className={`weekdot ${state.activeDates.includes(d) ? 'is-on' : ''} ${d === today ? 'is-today' : ''}`}>
                <span>{DAY_LABELS[i]}</span>
              </div>
            ))}
          </div>
          <div className="small muted">{week} / {state.weeklyGoal} · {t('weeklyGoal').toLowerCase()}</div>
        </Card>
        <Card tone="violet" className="dailycard">
          <div className="row">
            <Ring value={dailyDone ? 100 : 0} size={64} stroke={7} tone="violet">{dailyDone ? '✓' : '5'}</Ring>
            <div className="grow">
              <div className="h3">{t('dailyChallenge')}</div>
              <p className="muted small">{t('dailyChallengeDesc')}</p>
            </div>
          </div>
          <Button to="/practice/daily" variant="violet" block>{dailyDone ? t('todayResult') : t('start')}</Button>
        </Card>
      </div>

      <section>
        <SectionTitle>{t('whatNow')}</SectionTitle>
        <div className="stack stack--sm">
          {recs.map(r => (
            <A key={r.id} to={r.to} className="linkrow">{r.icon} {t(r.key).replace('{x}', r.arg ?? '')} <span aria-hidden>→</span></A>
          ))}
          {due === 0 && recs.length === 0 && <p className="muted small">{t('noDueWords')}</p>}
          <A to={`/learn/unit/${unit.id}`} className="linkrow">{unit.icon} {t('unit')} {unit.id} · {unit.title} <span aria-hidden>→</span></A>
        </div>
      </section>
    </div>
  )
}
