import { useEffect } from 'react'
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
import { UnitScreen, VocabStudy } from '../screens/UnitScreen'
import { VocabularyScreen } from '../screens/VocabularyScreen'
import { Layout } from './Layout'
import { useRoute, type Route } from './router'

function renderRoute(r: Route) {
  const [a, b, c, d] = r.parts
  switch (a) {
    case undefined:
      return <HomeScreen />
    case 'learn':
      if (b === 'unit' && c) return d === 'vocabulary' ? <VocabStudy id={Number(c)} /> : <UnitScreen id={Number(c)} />
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
  useEffect(() => { window.scrollTo(0, 0) }, [route.path])
  return (
    <Layout route={route}>
      <div key={route.path} className="page">{renderRoute(route)}</div>
    </Layout>
  )
}
