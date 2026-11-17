import { useMemo, useState } from 'react'
import { A } from '../app/router'
import { useApp, useAttempt } from '../app/store'
import { Button, Card, Chip, PageHeader, Ring } from '../components/ui'
import { SpeakButton } from '../components/SpeakButton'
import { availableLevels } from '../data/course'
import { testIndex, testsOf, vocabularyIndex } from '../data/catalog'
import { SpeakInput } from '../features/speaking/SpeakInput'
import { analyseSpeaking, type SpeakingScore } from '../services/analysis'
import { SpeakScoreCard } from '../features/speaking/ScoreCard'
import { activeLevel, articleConfusion, dueWordIds } from '../features/progress/stats'
import { PassNote } from '../features/tests/PassNote'
import { QuizPage, summarise } from '../features/tests/QuizPage'
import { QuizRunner, type QuizResult } from '../features/tests/QuizRunner'
import {
  articleDrill,
  buildLevelDaily,
  buildTest,
  isTestAvailable,
  placementBand,
  unitReviewQuestions,
  vocabQuestion,
  type Daily,
  type Question,
} from '../features/tests/questions'
import type { TKey } from '../i18n'
import { dayKey } from '../utils/date'
import { pct, tr, trStrict } from '../utils/text'
import { NotFound } from './NotFound'

export function PracticeHub() {
  const { state, t } = useApp()
  const due = dueWordIds(state, activeLevel(state)).length
  const today = state.daily[dayKey()]
  const tiles: { to: string; icon: string; title: TKey; desc: TKey; badge?: string; tone?: 'violet' | 'blue' }[] = [
    {
      to: '/practice/daily',
      icon: '📅',
      title: 'lab_daily',
      desc: 'lab_daily_d',
      badge: today?.speaking ? '✓' : undefined,
      tone: 'violet',
    },
    { to: '/practice/review', icon: '🔁', title: 'lab_review', desc: 'lab_review_d', badge: due ? String(due) : undefined },
    { to: '/practice/listening', icon: '🎧', title: 'lab_listening', desc: 'lab_listening_d' },
    { to: '/practice/reading', icon: '📖', title: 'lab_reading', desc: 'lab_reading_d' },
    { to: '/practice/writing', icon: '✍️', title: 'lab_writing', desc: 'lab_writing_d' },
    { to: '/practice/real', icon: '🇩🇪', title: 'lab_real', desc: 'lab_real_d' },
    { to: '/practice/articles', icon: '🔠', title: 'lab_articles', desc: 'articleNoticeBody' },
    { to: '/practice/tests', icon: '🏁', title: 'lab_tests', desc: 'lab_tests_d' },
  ]
  return (
    <div className="stack">
      <PageHeader title={t('practiceTitle')} sub={t('practiceSub')} />
      <div className="grid grid--2">
        {tiles.map(x => (
          <A key={x.to} to={x.to} className={`card card--interactive tilecard ${x.tone ? `card--${x.tone}` : ''}`}>
            <div className="row row--between">
              <span className="tilecard__icon" aria-hidden>
                {x.icon}
              </span>
              {x.badge && <Chip tone="violet">{x.badge}</Chip>}
            </div>
            <b>{t(x.title)}</b>
            <span className="muted small">{t(x.desc)}</span>
          </A>
        ))}
      </div>
    </div>
  )
}

export function ReviewScreen({ unit }: { unit?: number }) {
  const { state, t, lang } = useApp()
  const back = unit ? `/learn/unit/${unit}` : '/practice'
  const build = (): Question[] => {
    if (unit) return unitReviewQuestions(unit, 10, lang)
    const ids = dueWordIds(state, activeLevel(state)).slice(0, 10)
    return ids.map((id, i) => vocabQuestion(vocabularyIndex.get(id)!, i, undefined, lang))
  }
  const [questions] = useState(build)
  return (
    <div className="stack">
      <PageHeader
        back={back}
        eyebrow="🔁"
        title={t('lab_review')}
        sub={unit ? `${t('unit')} ${unit}` : `${questions.length} ${t('words')}`}
      />
      {questions.length === 0 ? (
        <Card>
          <p>{t('noDueWords')}</p>
          <Button to="/vocabulary" variant="soft">
            {t('nav_vocabulary')}
          </Button>
        </Card>
      ) : (
        <QuizPage
          build={build}
          backTo={back}
          activity={unit ? { id: `${unit}:review`, kind: 'review', completes: [`${unit}:review`] } : { id: 'review:due', kind: 'quiz' }}
          extra={r => (unit ? <PassNote result={r} kind="review" completionKey={`${unit}:review`} /> : null)}
        />
      )}
    </div>
  )
}

export function ArticlesScreen() {
  const { state, t } = useApp()
  const level = activeLevel(state)
  const conf = articleConfusion(state, level)
  return (
    <div className="stack">
      <PageHeader
        back="/practice"
        eyebrow="🔠"
        title={t('trainArticles')}
        sub={conf.active ? t('articleNoticeTitle') : t('articleNoticeBody')}
      />
      <QuizPage
        build={() => articleDrill(10, conf.active ? conf.ids : undefined, level)}
        backTo="/practice"
        activity={{ id: 'drill:articles', kind: 'quiz' }}
      />
    </div>
  )
}

export function TestsList() {
  const { state, t, lang } = useApp()
  const level = activeLevel(state)
  const tests = testsOf(level)
  const levelTests = tests.filter(d => d.kind === 'level')
  const last = (id: string) => [...state.tests].reverse().find(x => x.id === id)
  const card = (id: string) => {
    const d = testIndex.get(id)!
    const r = last(id)
    return (
      <A key={id} to={`/practice/tests/${id}`} className="card card--interactive conceptcard">
        <h3 className="h3">{tr(d.title, lang)}</h3>
        <p className="muted small">
          {d.size} {t('questionsN')}
          {r ? ` · ${t('lastResult')}: ${r.pct}%` : ''}
        </p>
      </A>
    )
  }
  return (
    <div className="stack">
      <PageHeader back="/practice" eyebrow="🏁" title={t('testsTitle')} sub={t('testsSub')} />
      <div className="grid grid--2">
        {(['placement', 'grammar', 'vocabulary', 'listening'] as const)
          .map(k => tests.find(d => d.kind === k))
          .filter(d => d !== undefined)
          .map(d => card(d.id))}
      </div>
      <h2 className="h2">{t('testLevel')}</h2>
      <div className="row">
        {levelTests.map(d => (
          <A key={d.id} to={`/practice/tests/${d.id}`} className="chip chip--blue">
            {d.level}
          </A>
        ))}
      </div>
      <div className="grid grid--2">{levelTests.map(d => card(d.id))}</div>
      <h2 className="h2">{t('testTopic')}</h2>
      <div className="grid grid--3">{tests.filter(x => x.kind === 'topic').map(x => card(x.id))}</div>
    </div>
  )
}

// Placement wording. The existing placement test is an A1 test: it has no A2 content, so its result may name A2 only when BOTH (a) A2 is available to this
// learner and (b) an A2 placement test exists to follow up (`placement-a2`, not yet authored). Otherwise the upper bands read as A1.
const PLACEMENT_LABEL = { 'A1-start': 'A1 · start', 'A1-A2': 'A1 · A2', A2: 'A2 →' } as const
const PLACEMENT_LABEL_A1_ONLY = { 'A1-start': 'A1 · start', 'A1-A2': 'A1', A2: 'A1 ✓' } as const

export function TestRunnerPage({ id }: { id: string }) {
  const { actions, t, lang } = useApp()
  const nextLevelAvailable = availableLevels(lang).includes('A2') && testIndex.has('placement-a2')
  const def = testIndex.get(id)
  if (!def || !isTestAvailable(def)) return <NotFound />
  const finished = (r: QuizResult) => {
    const s = summarise(r)
    actions.addTest({ id, at: Date.now(), pct: s.pct, weak: s.weakConcepts, strong: s.strong })
  }
  return (
    <div className="stack">
      <PageHeader back="/practice/tests" eyebrow="🏁" title={tr(def.title, lang)} />
      <QuizPage
        build={() => buildTest(def, lang)}
        backTo={def.unit ? `/learn/unit/${def.unit}` : '/practice/tests'}
        onFinished={finished}
        activity={{ id: `test:${def.id}`, kind: 'assessment', completes: def.unit ? [`${def.unit}:test`] : [] }}
        extra={r =>
          def.kind === 'placement' ? (
            <Card tone="blue">
              <div className="eyebrow">{t('yourLevelIs')}</div>
              <div className="h2">
                {(nextLevelAvailable ? PLACEMENT_LABEL : PLACEMENT_LABEL_A1_ONLY)[placementBand(pct(r.correct, r.total))]}
              </div>
            </Card>
          ) : def.unit ? (
            <PassNote result={r} kind="assessment" completionKey={`${def.unit}:test`} />
          ) : null
        }
      />
    </div>
  )
}

type DailyPhase = 'quiz' | 'speak' | 'phrase' | 'result'

export function DailyScreen() {
  const { state, lang } = useApp()
  const level = activeLevel(state)
  const date = dayKey()
  // no challenge for a level that cannot supply one (planned/empty) — never another level's content
  const daily = useMemo(() => buildLevelDaily(date, level, lang), [date, level, lang])
  if (!daily) return <NotFound />
  return <DailyRunner daily={daily} date={date} />
}

function DailyRunner({ daily, date }: { daily: Daily; date: string }) {
  const { state, actions, t, lang } = useApp()
  const attempt = useAttempt()
  const questions = useMemo(() => [...daily.vocab, ...daily.grammar, ...daily.listening], [daily])
  const sections = ['vocab', 'vocab', 'vocab', 'grammar', 'listening']
  const [phase, setPhase] = useState<DailyPhase>(state.daily[date]?.speaking ? 'result' : 'quiz')
  const [score, setScore] = useState<SpeakingScore | null>(null)

  const done = (r: QuizResult) => {
    const g = (k: string): [number, number] => r.bySection[k] ?? [0, 0]
    actions.setDaily(date, { vocab: g('vocab'), grammar: g('grammar'), listening: g('listening') })
    setPhase('speak')
  }
  const onSpeak = (text: string, conf: number | null) => {
    const sc = analyseSpeaking(text, { ai: '', aiRu: '', hints: [daily.speaking.sample], keywords: daily.speaking.keywords }, conf)
    setScore(sc)
    actions.addScore('speaking', (sc.grammar + sc.vocabulary + sc.naturalness) / 3)
  }
  const finish = () => {
    actions.setDaily(date, { speaking: true })
    attempt.finish({ activityId: `daily:${date}`, kind: 'daily' })
    setPhase('result')
  }
  const res = state.daily[date]

  return (
    <div className="stack">
      <PageHeader back="/practice" eyebrow="📅" title={t('dailyTitle')} sub={date} />
      {phase === 'quiz' && (
        <QuizRunner questions={questions} sections={sections} onDone={done} activity={{ id: `daily:${date}:quiz`, kind: 'quiz' }} />
      )}
      {phase === 'speak' && (
        <div className="stack">
          <Card tone="violet">
            <div className="eyebrow">{t('dailySpeaking')}</div>
            <p className="break">{tr(daily.speaking.prompt, lang)}</p>
            <details className="hint">
              <summary>{t('hints')}</summary>
              <div className="de break">
                {daily.speaking.sample} <SpeakButton text={daily.speaking.sample} small />
              </div>
            </details>
          </Card>
          <Card>
            <SpeakInput onResult={onSpeak} />
          </Card>
          {score && (
            <Card>
              <SpeakScoreCard score={score} />
            </Card>
          )}
          <Button size="lg" block onClick={() => setPhase('phrase')} variant={score ? 'primary' : 'ghost'}>
            {t('next')} →
          </Button>
        </div>
      )}
      {phase === 'phrase' && (
        <div className="stack">
          <Card tone="yellow">
            <div className="eyebrow">{t('dailyPhrase')}</div>
            <p className="h2 de break">{daily.phrase.de}</p>
            <p className="muted break">
              {daily.phrase.strict ? trStrict({ ru: daily.phrase.ru, ky: daily.phrase.ky }, lang) : daily.phrase.ru}
            </p>
            <SpeakButton text={daily.phrase.de} label={t('listen')} />
          </Card>
          <Button size="lg" block onClick={finish}>
            {t('finish')}
          </Button>
        </div>
      )}
      {phase === 'result' && res && (
        <Card className="result">
          <div className="eyebrow">{t('todayResult')}</div>
          <div className="dailyres">
            {(
              [
                ['dailyVocab', res.vocab],
                ['dailyGrammar', res.grammar],
                ['dailyListening', res.listening],
              ] as [TKey, [number, number]][]
            ).map(([k, v]) => (
              <div key={k} className="dailyres__item">
                <Ring value={pct(v[0], v[1])} size={72} stroke={7} tone={v[0] === v[1] ? 'green' : 'blue'}>
                  {v[0]}/{v[1]}
                </Ring>
                <span>{t(k)}</span>
              </div>
            ))}
            <div className="dailyres__item">
              <Ring value={res.speaking ? 100 : 0} size={72} stroke={7} tone="violet">
                {res.speaking ? '✓' : '–'}
              </Ring>
              <span>{t('dailySpeaking')}</span>
            </div>
          </div>
          <p className="muted small">{t('dailyAlready')}</p>
          <Button to="/">{t('goHome')}</Button>
        </Card>
      )}
    </div>
  )
}
