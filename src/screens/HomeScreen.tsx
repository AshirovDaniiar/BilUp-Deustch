import { useEffect, useState } from 'react'
import { navigate } from '../app/router'
import { useApp } from '../app/store'
import { Button, Card } from '../components/ui'
import { Mascot } from '../components/Mascot'
import { JourneyMap } from '../features/progress/JourneyMap'
import { isLevelContentLoaded, loadLevelContent, grammarIndex, levelOfUnit, listeningForUnit, listeningOf, speakingForUnit, speakingIndex, speakingOf, topicTestOfUnit, vocabularyForUnit } from '../data/catalog'
import { DEFAULT_LEVEL, availableLevels } from '../data/course'
import { NotFound } from './NotFound'
import { activeLevel, currentUnit, levelProgress, streak, unitProgress, weekDone } from '../features/progress/stats'
import { buildJourney, JOURNEY_TEXT } from '../features/progress/journey'
import { greetingKey } from '../utils/date'
import { locStrict, tr } from '../utils/text'
import type { TKey } from '../i18n'

export function HomeScreen() {
  const { state, actions, t, lang } = useApp()
  const level = activeLevel(state)
  // The journey needs EVERY available level's content to read saved progress truthfully (an unloaded level would count as 0 %). The
  // active level is already loaded by the router; the others load in the background and the mascot appears once they have.
  const [, setLoaded] = useState(0)
  useEffect(() => {
    const pending = availableLevels(state.lang).filter(l => !isLevelContentLoaded(l))
    if (pending.length === 0) return
    let live = true
    Promise.all(pending.map(l => loadLevelContent(l)))
      .then(() => live && setLoaded(n => n + 1))
      .catch(() => undefined) // the map still works; the mascot simply waits
    return () => { live = false }
  }, [state.lang])
  // a level whose units are all still empty containers has nothing to continue: Continue Learning then uses the default level's unit
  const unit = currentUnit(state, level) ?? currentUnit(state, DEFAULT_LEVEL)
  if (!unit) return <NotFound /> // a visible level always has units; never render a half-empty dashboard
  const conceptId = unit.grammarIds[0]
  const concept = grammarIndex.get(conceptId)
  const unitLevel = levelOfUnit(unit.id) ?? DEFAULT_LEVEL
  const unitTest = topicTestOfUnit(unit.id)
  const listening = listeningForUnit(unit.id)[0] ?? listeningOf(unitLevel)[0]
  const scenario = speakingIndex.get(speakingForUnit(unit.id) ?? '') ?? speakingOf(unitLevel)[0]
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

  const journey = buildJourney(state)
  const started = progress > 0
  const uProg = unitProgress(state, unit.id)

  return (
    <div className="stack home">
      <section className="hero">
        <div className="hero__top">
          <div className="hero__text">
            <div className="eyebrow">{t('tagline')}</div>
            <h1 className="h1">{t(greetingKey())}{state.name ? `, ${state.name}` : ''} 👋</h1>
          </div>
          <Mascot variant="cutout" size={96} eager className="hero__mascot" />
        </div>
        <div className="hero__stats">
          <div className="hstat"><span className="hstat__n">🔥 {streak(state)}</span><span className="hstat__l">{t('streak')} · {t('daysShort')}</span></div>
          <div className="hstat"><span className="hstat__n">{weekDone(state)} / 7</span><span className="hstat__l">{t('weekly')}</span></div>
          <div className="hstat"><span className="hstat__n">{state.xp}</span><span className="hstat__l">XP</span></div>
        </div>
      </section>

      <Card as="section" className="resume">
        <div className="eyebrow">{tr(JOURNEY_TEXT.resumeTitle, lang)}</div>
        <div className="resume__where">{unit.level} · {t('unit')} {unit.id} · {uProg.done}/{uProg.total}</div>
        <h2 className="h2 resume__title">{unit.title}</h2>
        <p className="resume__step muted">{t(next.label)} · {next.title}</p>
        {next.sub && <p className="resume__step muted small break">{next.sub}</p>}
        <p className="resume__step muted small">{tr(started ? JOURNEY_TEXT.resumeHint : JOURNEY_TEXT.startHint, lang)}</p>
        <div>
          <Button to={next.to}>{tr(started ? JOURNEY_TEXT.resumeBtn : JOURNEY_TEXT.startBtn, lang)}</Button>
        </div>
      </Card>

      <JourneyMap
        journey={journey}
        lang={lang}
        onSelect={l => {
          if (l !== 'C2') actions.setProfile({ level: l })
          navigate('/learn')
        }}
      />
    </div>
  )
}
