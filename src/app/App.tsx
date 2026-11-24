import { useEffect, useState } from 'react'
import { loadLevelContent } from '../data/catalog'
import { ListeningList, ListeningPlayer } from '../features/listening/ListeningLab'
import { ReadingList, ReadingView } from '../features/reading/ReadingLab'
import { RealLifeList, RealLifeTopic } from '../features/reallife/RealLife'
import { SpeakingList, SpeakingSession } from '../features/speaking/SpeakingLab'
import { WritingEditor, WritingList } from '../features/writing/WritingLab'
import { TutorChat } from '../features/ai/TutorChat'
import { GrammarDetail, GrammarScreen } from '../screens/GrammarScreen'
import { HomeScreen } from '../screens/HomeScreen'
import { LearnScreen } from '../screens/LearnScreen'
import { NotFound } from '../screens/NotFound'
import { ArticlesScreen, DailyScreen, PracticeHub, ReviewScreen, TestRunnerPage, TestsList } from '../screens/PracticeScreens'
import { ProfileScreen } from '../screens/ProfileScreen'
import { ProgressScreen } from '../screens/ProgressScreen'
import { TopicScreen } from '../screens/TopicScreen'
import { MerksaetzeScreen, UnitScreen, VocabStudy } from '../screens/UnitScreen'
import { VocabularyScreen } from '../screens/VocabularyScreen'
import { Layout } from './Layout'
import { LevelLoadFailed, LevelLoading } from './LevelLoadStatus'
import { isRouteAccessible, levelsToLoad } from './routeAccess'
import { useApp } from './store'
import { useRoute, type Route } from './router'

function renderRoute(r: Route) {
  const [a, b, c, d] = r.parts
  switch (a) {
    case undefined:
      return <HomeScreen />
    case 'learn':
      if (b === 'unit' && c) {
        if (d === 'vocabulary') return <VocabStudy id={Number(c)} />
        if (d === 'merksaetze') return <MerksaetzeScreen id={Number(c)} />
        return d ? <NotFound /> : <UnitScreen id={Number(c)} />
      }
      if (b === 'topic' && c) return <TopicScreen id={c} />
      return b ? <NotFound /> : <LearnScreen />
    case 'practice':
      switch (b) {
        case undefined: return <PracticeHub />
        case 'daily': return <DailyScreen />
        case 'review': return <ReviewScreen unit={r.query.get('unit') ? Number(r.query.get('unit')) : undefined} />
        case 'articles': return <ArticlesScreen />
        case 'tests': return c ? <TestRunnerPage id={c} /> : <TestsList />
        case 'listening': return c ? <ListeningPlayer id={c} /> : <ListeningList />
        case 'reading': return c ? <ReadingView id={c} /> : <ReadingList />
        case 'writing': return c ? <WritingEditor id={c} /> : <WritingList />
        case 'real': return c ? <RealLifeTopic id={c} /> : <RealLifeList />
        default: return <NotFound />
      }
    case 'speak':
      return b ? <SpeakingSession id={b} /> : <SpeakingList />
    case 'progress':
      return <ProgressScreen />
    case 'tutor':
      return <TutorChat />
    case 'vocabulary':
      return <VocabularyScreen />
    case 'grammar':
      return b ? <GrammarDetail id={b} /> : <GrammarScreen />
    case 'profile':
      return <ProfileScreen />
    default:
      return <NotFound />
  }
}

export function App() {
  const route = useRoute()
  const { state } = useApp()
  useEffect(() => { window.scrollTo(0, 0) }, [route.path])
  // Lazy level content (A2+): empty for every A1 route and every planned level, so A1 never waits and never loads a chunk.
  const needed = levelsToLoad(route, state.lang, state.level)
  const neededKey = needed.join()
  const [attempt, setAttempt] = useState(0)
  const [loadState, setLoadState] = useState<{ key: string; failed: boolean }>({ key: '', failed: false })
  const runKey = `${neededKey}#${attempt}`
  useEffect(() => {
    if (!neededKey) return
    let live = true
    Promise.all(neededKey.split(',').map(l => loadLevelContent(l as (typeof needed)[number])))
      .then(() => live && setLoadState({ key: runKey, failed: false }))
      .catch(() => live && setLoadState({ key: runKey, failed: true }))
    return () => { live = false }
  }, [neededKey, attempt]) // eslint-disable-line react-hooks/exhaustive-deps -- runKey is derived from both
  const failed = loadState.failed && loadState.key === runKey
  // Retry = a new attempt of the same load, no application reload (the catalog forgets a failed load, so it is requested again).
  const retry = () => setAttempt(n => n + 1)
  return (
    <Layout route={route}>
      <div key={route.path} className="page" aria-busy={(needed.length > 0 && !failed) || undefined}>
        {needed.length > 0 ? (
          failed ? <LevelLoadFailed retried={attempt > 0} onRetry={retry} /> : <LevelLoading />
        ) : isRouteAccessible(route, state.lang) ? renderRoute(route) : <NotFound />}
      </div>
    </Layout>
  )
}
