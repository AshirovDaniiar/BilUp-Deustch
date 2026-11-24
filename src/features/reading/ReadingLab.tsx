import { useMemo, useState } from 'react'
import { readingQuestions } from '../tests/questions'
import { newSeed } from '../../utils/random'
import { A } from '../../app/router'
import { useApp, useAttempt } from '../../app/store'
import { Button, Card, Chip, PageHeader, Sheet } from '../../components/ui'
import { SpeakButton } from '../../components/SpeakButton'
import { LevelTabs } from '../../components/LevelTabs'
import { allVocabulary, levelOfUnit, readingIndex, readingOf } from '../../data/catalog'
import { DEFAULT_LEVEL } from '../../data/course'
import type { ReadingGloss, ReadingText } from '../../data/types'
import { activeLevel } from '../progress/stats'
import { displayWord } from '../../data/vocabulary'
import { pct } from '../../utils/text'
import { QuizRunner, type QuizResult } from '../tests/QuizRunner'
import { NotFound } from '../../screens/NotFound'

export function ReadingList() {
  const { state, t } = useApp()
  const level = activeLevel(state)
  const list = readingOf(level)
  return (
    <div className="stack">
      <PageHeader back="/practice" eyebrow="📖" title="Reading Lab" sub={t('lab_reading_d')} />
      <LevelTabs />
      <div className="grid grid--2">
        {list.map(r => (
          <A key={r.id} to={`/practice/reading/${r.id}`} className="card card--interactive conceptcard">
            <div className="row row--between">
              <Chip tone="blue">{level}</Chip>
              {state.completed.includes(`ex:${r.id}`) && <Chip tone="green">✓</Chip>}
            </div>
            <h3 className="h3">{r.title}</h3>
            <p className="muted small">
              {t('unit')} {r.unit} · {r.gloss.length} 💡
            </p>
          </A>
        ))}
        {list.length === 0 && <p className="muted">{t('comingSoon')}</p>}
      </div>
    </div>
  )
}

const clean = (w: string) => w.replace(/[.,!?;:()„“"]/g, '')

function lookup(text: ReadingText, word: string): { gloss?: ReadingGloss; vocabId?: string } {
  const w = clean(word).toLowerCase()
  const gloss = text.gloss.find(g => g.word.toLowerCase() === w)
  if (gloss) return { gloss }
  const v = allVocabulary.find(x => x.de.toLowerCase() === w || x.plural?.toLowerCase() === w)
  return v ? { vocabId: v.id } : {}
}

export function ReadingView({ id }: { id: string }) {
  const { actions, t, lang } = useApp()
  const attempt = useAttempt()
  const text = readingIndex.get(id)
  // authored A2 texts: meanings, notes and examples in the learner's OWN language only (A1 keeps its Russian + Kyrgyz display)
  const a2 = !!text && levelOfUnit(text.unit) !== 'A1'
  const loc = (ru?: string, ky?: string) => (lang === 'ky' ? ky : lang === 'ru' ? ru : undefined)
  const [sel, setSel] = useState<string | null>(null)
  const [reading, setReading] = useState(true)
  const [result, setResult] = useState<QuizResult | null>(null)
  // one seed per attempt: the answer order is stable while the attempt lasts and renewed by "retry"
  const [attemptSeed, setAttemptSeed] = useState(() => newSeed())
  const qs = useMemo(() => (text ? readingQuestions(text, attemptSeed) : []), [text, attemptSeed])
  if (!text) return <NotFound />

  const found = sel ? lookup(text, sel) : null
  const vocab = found?.vocabId ? allVocabulary.find(v => v.id === found.vocabId) : undefined
  const onDone = (r: QuizResult) => {
    setResult(r)
    actions.addScore('reading', pct(r.correct, r.total))
  }

  return (
    <div className="stack">
      <PageHeader
        back="/practice/reading"
        eyebrow={`📖 ${levelOfUnit(text.unit) ?? DEFAULT_LEVEL} · ${t('unit')} ${text.unit}`}
        title={text.title}
        sub={t('tapWord')}
      />
      <Card className="reader">
        <div className="row row--between">
          <Chip tone="blue">{text.wordCount ?? text.body.join(' ').trim().split(/\s+/).length} {t('wordCount')}</Chip>
        </div>
        {text.body.map((p, i) => (
          <p key={i} className="reader__p">
            {p.split(' ').map((w, k) => {
              const known = !!lookup(text, w).gloss || !!lookup(text, w).vocabId
              return (
                <button key={k} type="button" className={`tapword ${known ? 'tapword--known' : ''}`} onClick={() => setSel(clean(w))}>
                  {w}
                </button>
              )
            })}
            <SpeakButton text={p} small />
          </p>
        ))}
      </Card>

      {reading && qs.length > 0 && (
        <Button variant="violet" size="lg" block onClick={() => setReading(false)}>
          {t('understandQ')} →
        </Button>
      )}
      {reading && qs.length === 0 && (
        <Button
          variant="violet"
          size="lg"
          block
          onClick={() => {
            attempt.finish({
              activityId: `ex:${text.id}`,
              kind: 'reading',
              completes: [`${text.unit}:reading`],
              score: { earned: 1, possible: 1 },
            })
            actions.addScore('reading', 100)
            setReading(false)
            setResult({
              correct: 1,
              total: 1,
              wrong: [],
              bySkill: {},
              byConcept: {},
              bySection: {},
            })
          }}
        >
          {t('understandQ')} →
        </Button>
      )}
      {!reading && !result && qs.length > 0 && (
        <QuizRunner
          questions={qs}
          onDone={onDone}
          activity={{ id: `ex:${text.id}`, kind: 'reading', completes: [`${text.unit}:reading`] }}
        />
      )}
      {result && (
        <Card tone="green">
          <b>
            {result.correct} / {result.total}
          </b>
          <div className="row" style={{ marginTop: 10 }}>
            <Button
              variant="soft"
              onClick={() => {
                setResult(null)
                setReading(true)
                setAttemptSeed(newSeed())
              }}
            >
              {t('retry')}
            </Button>
            <Button to="/practice/reading">{t('continue')}</Button>
          </div>
        </Card>
      )}

      <Sheet open={!!sel} onClose={() => setSel(null)} title={sel ?? ''}>
        {found?.gloss && (
          <div className="stack">
            <div className="row">
              <b className="de">{found.gloss.word}</b>
              <SpeakButton text={found.gloss.word} small />
            </div>
            <div>
              <span className="eyebrow">{t('meaning')}</span>
              <div className="break">
                {a2 ? (
                  loc(found.gloss.ru, found.gloss.ky)
                ) : (
                  <>
                    {found.gloss.ru} <span className="muted">/ {found.gloss.ky}</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <span className="eyebrow">{t('example')}</span>
              <div className="de break">
                {found.gloss.example} <SpeakButton text={found.gloss.example} small />
              </div>
            </div>
            <div>
              <span className="eyebrow">{t('grammarForms')}</span>
              <div className="break">{a2 ? loc(found.gloss.grammar, found.gloss.grammarKy) : found.gloss.grammar}</div>
            </div>
            {found.gloss.related.length > 0 && (
              <div>
                <span className="eyebrow">{t('related')}</span>
                <div className="row" style={{ marginTop: 6 }}>
                  {found.gloss.related.map(r => (
                    <Chip key={r} tone="blue">
                      {r}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        {vocab && (
          <div className="stack">
            <div className="row">
              <b className="de">{displayWord(vocab)}</b>
              <SpeakButton text={displayWord(vocab)} small />
            </div>
            <div>
              <span className="eyebrow">{t('meaning')}</span>
              <div className="break">
                {a2 ? (
                  loc(vocab.ru, vocab.ky)
                ) : (
                  <>
                    {vocab.ru} <span className="muted">/ {vocab.ky}</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <span className="eyebrow">{t('example')}</span>
              <div className="de break">{vocab.example}</div>
              <div className="muted small">{a2 ? loc(vocab.exampleRu, vocab.exampleKy) : vocab.exampleRu}</div>
            </div>
            <Button variant={'soft'} onClick={() => actions.toggleSaved(vocab.id)}>
              ☆ {t('save')}
            </Button>
          </div>
        )}
        {sel && !found?.gloss && !vocab && (
          <div className="stack">
            <p className="muted">{t('wordNotFound')}</p>
            <A to="/tutor" className="btn btn--violet">
              ✨ {t('askTutor')}
            </A>
          </div>
        )}
      </Sheet>
    </div>
  )
}
