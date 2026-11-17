import { A } from '../app/router'
import { useApp } from '../app/store'
import { Button, Card, ProgressBar, Ring, SectionTitle } from '../components/ui'
import { Mascot } from '../components/Mascot'
import { LEVELS } from '../data/types'
import { grammarIndex, levelOfUnit, listeningForUnit, listeningOf, speakingForUnit, speakingIndex, speakingOf, topicTestOfUnit, unitsOfLevel, vocabularyForUnit } from '../data/catalog'
import { DEFAULT_LEVEL, availableLevels } from '../data/course'
import { NotFound } from './NotFound'
import { activeLevel, currentUnit, dueWordIds, levelProgress, recommendations, streak, weekDone } from '../features/progress/stats'
import { currentWeek, dayKey, greetingKey } from '../utils/date'
import { locStrict, tr } from '../utils/text'
import type { TKey } from '../i18n'

const DAY_LABELS = ['M', 'D', 'M', 'D', 'F', 'S', 'S']

export function HomeScreen() {
  const { state, t, lang } = useApp()
  const level = activeLevel(state)
  const levels = availableLevels(lang)
  const unit = currentUnit(state, level)
  if (!unit) return <NotFound /> // a visible level always has units; never render a half-empty dashboard
  const conceptId = unit.grammarIds[0]
  const concept = grammarIndex.get(conceptId)
  const unitLevel = levelOfUnit(unit.id) ?? DEFAULT_LEVEL
  const unitTest = topicTestOfUnit(unit.id)
  const listening = listeningForUnit(unit.id)[0] ?? listeningOf(unitLevel)[0]
  const scenario = speakingIndex.get(speakingForUnit(unit.id) ?? '') ?? speakingOf(unitLevel)[0]
  const st = streak(state)
  const week = weekDone(state)
  const week7 = currentWeek()
  const today = dayKey()
  const recs = recommendations(state, level)
  const due = dueWordIds(state, level).length
  const dailyDone = !!state.daily[today]?.speaking
  const progress = levelProgress(state, level)

  type Step = { n: string; label: TKey; title: string; sub: string; to: string; done: boolean }
  // A step whose content does not exist is left out (never a crash): every A1 unit has all five, so A1 is unchanged.
  const draft: (Step | null)[] = [
    { n: '01', label: 'stepVocabulary', title: `${Math.min(10, vocabularyForUnit(unit.id).length)} ${t('newWords')}`, sub: unit.title, to: `/learn/unit/${unit.id}/vocabulary`, done: state.completed.includes(`${unit.id}:vocabulary`) },
    { n: '02', label: 'stepGrammar', title: concept ? tr(concept.title, lang) : '—', sub: concept ? tr(concept.summary, lang).slice(0, 56) + '…' : '', to: `/learn/topic/${conceptId}`, done: state.completed.includes(`topic:${conceptId}`) },
    listening ? { n: '03', label: 'stepListening', title: listening.title, sub: `${unitLevel} · 🎧 ${listening.lines.length}`, to: `/practice/listening/${listening.id}`, done: state.completed.includes(`ex:${listening.id}`) } : null,
    scenario ? { n: '04', label: 'stepSpeaking', title: scenario.title, sub: scenario.level !== 'A1' ? locStrict(scenario.titleRu, scenario.titleKy, lang) ?? '' : scenario.titleRu, to: `/speak/${scenario.id}`, done: state.completed.includes(`speak:${scenario.id}`) } : null,
    { n: '05', label: 'stepTest', title: unitTest ? `${unitTest.size} ${t('questionsN')}` : t('testsTitle'), sub: `${t('unit')} ${unit.id}`, to: unitTest ? `/practice/tests/${unitTest.id}` : '/practice/tests', done: state.completed.includes(`${unit.id}:test`) },
  ]
  const steps: Step[] = draft.filter((x): x is Step => x !== null).map((x, i) => ({ ...x, n: String(i + 1).padStart(2, '0') }))
  const next = steps.find(s => !s.done) ?? steps[0]

  return (
    <div className="stack home">
      <section className="hero">
        <div className="hero__top">
          <div className="hero__text">
            <div className="eyebrow">{t('tagline')}</div>
            <h1 className="h1">{t(greetingKey())}{state.name ? `, ${state.name}` : ''} 👋</h1>
          </div>
          <Mascot size={112} eager className="hero__mascot" />
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
          <span className="chip chip--blue">{t('currentLevel')}: {level}</span>
        </div>
        {levels.length > 1 && (
          <ol className="journey__track" aria-label={t('journey')}>
            {levels.map(l => (
              <li key={l} className={`journey__node ${l === level ? 'is-current' : ''} ${l !== level && LEVELS.indexOf(l) < LEVELS.indexOf(level) ? 'is-done' : ''}`}>
                <span className="journey__dot">{l === level ? '●' : ''}</span>
                <span className="journey__label">{l}</span>
              </li>
            ))}
          </ol>
        )}
        <div className="row row--between small muted"><span>{level} · {unitsOfLevel(level).length} {t('unit').toLowerCase()}</span><b>{progress}%</b></div>
        <ProgressBar value={progress} label={level} />
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
