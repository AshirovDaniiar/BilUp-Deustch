import { useState } from 'react'
import { A } from '../app/router'
import { useApp, useAttempt } from '../app/store'
import { BetaNotice } from '../components/BetaNotice'
import { Button, Card, PageHeader, ProgressBar } from '../components/ui'
import { grammarIndex, listeningForUnit, readingForUnit, speakingForUnit, topicTestOfUnit, unitById, vocabularyForUnit, writingForUnit } from '../data/catalog'
import { SECTIONS, type SectionId } from '../data/units'
import { WordCard } from '../features/vocabulary/WordCard'
import { unitProgress } from '../features/progress/stats'
import { tr } from '../utils/text'
import { NotFound } from './NotFound'

const ICONS: Record<SectionId, string> = { vocabulary: '🔤', grammar: '🧪', listening: '🎧', reading: '📖', speaking: '🎙️', writing: '✍️', review: '🔁', test: '🏁' }

export function UnitScreen({ id }: { id: number }) {
  const { state, t, lang } = useApp()
  const unit = unitById(id)
  if (!unit) return <NotFound />
  const p = unitProgress(state, id)
  const writing = writingForUnit(id)[0] // the unit's writing task by its `unit` metadata, not by an id pattern
  const unitTest = topicTestOfUnit(id) // the unit's final test and its size come from the test definition
  const listening = listeningForUnit(id)[0]
  const reading = readingForUnit(id)[0]

  const target: Record<SectionId, { to: string; sub: string }> = {
    vocabulary: { to: `/learn/unit/${id}/vocabulary`, sub: `${vocabularyForUnit(id).length} ${t('words')}` },
    grammar: { to: `/learn/topic/${unit.grammarIds[0]}`, sub: unit.grammarIds.map(g => { const c = grammarIndex.get(g); return c ? tr(c.title, lang) : g }).join(' · ') },
    listening: { to: listening ? `/practice/listening/${listening.id}` : '/practice/listening', sub: listening?.title ?? '' },
    reading: { to: reading ? `/practice/reading/${reading.id}` : '/practice/reading', sub: reading?.title ?? '' },
    speaking: { to: `/speak/${speakingForUnit(id)}`, sub: speakingForUnit(id) ?? '' },
    writing: { to: writing ? `/practice/writing/${writing.id}` : '/practice/writing', sub: writing?.title ?? '' },
    review: { to: `/practice/review?unit=${id}`, sub: t('lab_review_d') },
    test: { to: unitTest ? `/practice/tests/${unitTest.id}` : '/practice/tests', sub: unitTest ? `${unitTest.size} ${t('questionsN')}` : '' },
  }

  return (
    <div className="stack">
      <PageHeader back="/learn" eyebrow={`${t('unit')} ${String(id).padStart(2, '0')} · ${unit.level}`} title={`${unit.icon} ${unit.title}`} sub={tr(unit.subtitle, lang)} />
      <BetaNotice level={unit.level} />
      <Card>
        <div className="row row--between small"><span>{p.done} / {p.total} {t('unitProgress')}</span><b>{p.pct}%</b></div>
        <ProgressBar value={p.pct} tone={p.pct === 100 ? 'green' : 'blue'} />
      </Card>
      <div className="sections">
        {SECTIONS.map((s, i) => {
          const done = state.completed.includes(`${id}:${s}`)
          const tg = target[s]
          return (
            <A key={s} to={tg.to} className={`secrow card card--interactive ${done ? 'is-done' : ''}`}>
              <span className="secrow__num">{done ? '✓' : i + 1}</span>
              <span className="secrow__icon" aria-hidden>{ICONS[s]}</span>
              <span className="grow">
                <b>{t(`sec_${s}` as 'sec_vocabulary')}</b>
                <span className="muted small break" style={{ display: 'block' }}>{tg.sub}</span>
              </span>
              <span aria-hidden>→</span>
            </A>
          )
        })}
      </div>
    </div>
  )
}

/** Sequential study of a unit's words with rich cards. */
export function VocabStudy({ id }: { id: number }) {
  const { t } = useApp()
  const attempt = useAttempt()
  const unit = unitById(id)
  const words = vocabularyForUnit(id)
  const [i, setI] = useState(0)
  const [seen, setSeen] = useState<Set<number>>(new Set([0]))
  if (!unit) return <NotFound />
  const w = words[i]
  const go = (n: number) => {
    const nextSeen = new Set(seen).add(n)
    setI(n)
    setSeen(nextSeen)
    if (nextSeen.size >= words.length) attempt.finish({ activityId: `vocab-study:${id}`, kind: 'vocabulary-study', completes: [`${id}:vocabulary`] })
  }
  return (
    <div className="stack">
      <PageHeader back={`/learn/unit/${id}`} eyebrow={`${t('unit')} ${id}`} title={`${unit.icon} ${t('sec_vocabulary')}`} sub={`${i + 1} / ${words.length}`} />
      <ProgressBar value={((i + 1) / words.length) * 100} />
      <div key={w.id} className="slide-in">
        <WordCard item={w} onOpen={rid => { const n = words.findIndex(x => x.id === rid); if (n >= 0) go(n) }} />
      </div>
      <div className="row row--between">
        <Button variant="ghost" onClick={() => go(Math.max(0, i - 1))} disabled={i === 0}>← {t('back')}</Button>
        {i < words.length - 1 ? (
          <Button onClick={() => go(i + 1)}>{t('next')} →</Button>
        ) : (
          <Button to={`/practice/review?unit=${id}`} variant="violet">{t('sec_review')} →</Button>
        )}
      </div>
    </div>
  )
}
