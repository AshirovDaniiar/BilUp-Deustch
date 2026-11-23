import { useMemo, useState } from 'react'
import { A, useRoute } from '../app/router'
import { useApp, useAttempt } from '../app/store'
import { Button, Card, PageHeader } from '../components/ui'
import { SpeakButton } from '../components/SpeakButton'
import { grammarIndex, levelOfUnit, neighbourConcepts, unitById, whyNotesForConcept } from '../data/catalog'
import { DEFAULT_LEVEL } from '../data/course'
import { unitNumber } from '../data/curriculum'
import { ExampleList, WhyButton, Highlight } from '../features/grammar/Highlight'
import { ConceptVisual } from '../features/grammar/Labs'
import { SpeakInput } from '../features/speaking/SpeakInput'
import { SpeakScoreCard } from '../features/speaking/ScoreCard'
import { conceptQuestions, questionWhy, type Question } from '../features/tests/questions'
import { QuizRunner, type QuizResult } from '../features/tests/QuizRunner'
import { analyseSpeaking, type SpeakingScore } from '../services/analysis'
import { locStrict, pct, tr } from '../utils/text'
import type { TKey } from '../i18n'
import { NotFound } from './NotFound'

const STEPS: { id: string; key: TKey }[] = [
  { id: 'discover', key: 'step_discover' },
  { id: 'understand', key: 'step_understand' },
  { id: 'practice', key: 'step_practice' },
  { id: 'apply', key: 'step_apply' },
  { id: 'speak', key: 'step_speak' },
  { id: 'test', key: 'step_test' },
  { id: 'review', key: 'step_review' },
]

/** The core learning model: DISCOVER → UNDERSTAND → PRACTICE → APPLY → SPEAK → TEST → REVIEW. */
export function TopicScreen({ id }: { id: string }) {
  const { state, actions, t, lang } = useApp()
  const attempt = useAttempt()
  const speakAttempt = useAttempt()
  const concept = grammarIndex.get(id)
  const route = useRoute()
  const strictC = !!concept && levelOfUnit(concept.unit) !== 'A1' // authored A2 concept: translations in the learner's own language only
  const [step, setStep] = useState(0)
  const [practice, setPractice] = useState<QuizResult | null>(null)
  const [test, setTest] = useState<QuizResult | null>(null)
  const [score, setScore] = useState<SpeakingScore | null>(null)
  const practiceQs = useMemo<Question[]>(() => (concept ? conceptQuestions(concept.id, 5) : []), [concept])
  const testQs = useMemo<Question[]>(() => (concept ? conceptQuestions(concept.id, 4).reverse() : []), [concept])
  if (!concept) return <NotFound />

  const why = whyNotesForConcept(concept.id)[0]
  // A lesson REUSED by a curriculum-v2 unit is opened with `?unit=<that unit>`: back link, label and completion then belong to that unit.
  const via = unitById(Number(route.query.get('unit')))
  const unit = via && via.grammarIds.includes(concept.id) ? via : unitById(concept.unit)
  const go = (n: number) => {
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const { next: nextConcept } = neighbourConcepts(concept.id) // next topic of the SAME level

  const finishTopic = () => {
    const unitConcepts = unit?.grammarIds ?? []
    const doneAfter = unitConcepts.every(g => g === concept.id || state.completed.includes(`topic:${g}`))
    attempt.finish({ activityId: `topic:${concept.id}`, kind: 'lesson', completes: unit && doneAfter ? [`${unit.id}:grammar`] : [] })
  }

  const onSpeak = (text: string, conf: number | null) => {
    const sc = analyseSpeaking(
      text,
      { ai: '', aiRu: '', hints: [concept.speakPrompt.sample], keywords: concept.speakPrompt.keywords },
      conf,
    )
    setScore(sc)
    actions.addScore('speaking', (sc.grammar + sc.vocabulary + sc.naturalness) / 3)
    speakAttempt.finish({ activityId: `topicspeak:${concept.id}`, kind: 'speaking-prompt', evidence: 'heuristic' })
    speakAttempt.renew()
  }

  return (
    <div className="stack">
      <PageHeader
        back={unit ? `/learn/unit/${unit.id}` : '/grammar'}
        eyebrow={`${t('unit')} ${unit ? unitNumber(unit) : concept.unit} · ${levelOfUnit(concept.unit) ?? DEFAULT_LEVEL}`}
        title={tr(concept.title, lang)}
      />
      {unit?.grammarPartial?.[concept.id] && (
        <Card>
          <p className="small" data-testid="partial-note"><b>{t('grammarPartial')}:</b> {unit.grammarPartial[concept.id]}</p>
        </Card>
      )}
      <ol className="steps" aria-label="steps">
        {STEPS.map((s, i) => (
          <li key={s.id} className={`step ${i === step ? 'is-current' : ''} ${i < step ? 'is-done' : ''}`}>
            <button type="button" onClick={() => i <= step && go(i)} disabled={i > step} aria-current={i === step ? 'step' : undefined}>
              <span className="step__n">{i < step ? '✓' : i + 1}</span>
              <span className="step__l">{t(s.key)}</span>
            </button>
          </li>
        ))}
      </ol>

      <div key={step} className="slide-in stack">
        {step === 0 && (
          <>
            <Card tone="blue" className="discover">
              <div className="eyebrow">1 · {t('step_discover')}</div>
              <p className="discover__q break">{tr(concept.discover, lang)}</p>
              {why && (
                <div className="whybox">
                  <div className="de break whybox__sentence">
                    <Highlight text={why.sentence} focus={why.word} />
                    <SpeakButton text={why.sentence} small />
                  </div>
                  <div className="muted small">{strictC ? locStrict(why.ru, why.ky, lang) : why.ru}</div>
                  <div style={{ marginTop: 10 }}>
                    <WhyButton note={why} label={`${t('why')} «${why.word}»`} />
                  </div>
                </div>
              )}
            </Card>
            <Card>
              <div className="eyebrow">{t('learnerGoal')}</div>
              <p className="break">{tr(concept.summary, lang)}</p>
            </Card>
            <Button size="lg" onClick={() => go(1)} block>
              {t('next')} →
            </Button>
          </>
        )}

        {step === 1 && (
          <>
            <Card tone="violet">
              <p className="break">
                <b>{t('whyLabel')}</b> {tr(concept.why, lang)}
              </p>
            </Card>
            <Card>
              <ConceptVisual concept={concept} />
            </Card>
            <Card>
              <div className="eyebrow">{t('when')}</div>
              <ul className="bullets">
                {concept.when.map(w => (
                  <li key={w.ru} className="break">
                    {tr(w, lang)}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <div className="eyebrow">{t('examples')}</div>
              <ExampleList items={concept.examples} strict={strictC} />
            </Card>
            <Card>
              <div className="eyebrow">{t('mistakes')}</div>
              <ul className="mistakes">
                {concept.mistakes.map(m => (
                  <li key={m.wrong}>
                    <div className="bad break">✗ {m.wrong}</div>
                    <div className="good break">✓ {m.right}</div>
                    <div className="muted small break">{tr(m.note, lang)}</div>
                  </li>
                ))}
              </ul>
            </Card>
            <Button size="lg" onClick={() => go(2)} block>
              {t('step_practice')} →
            </Button>
          </>
        )}

        {step === 2 &&
          (practice ? (
            <Card>
              <p className="h3">
                {pct(practice.correct, practice.total)}% · {practice.correct} / {practice.total}
              </p>
              <Button onClick={() => go(3)} block size="lg">
                {t('step_apply')} →
              </Button>
            </Card>
          ) : (
            <QuizRunner
              questions={practiceQs}
              activity={{ id: `topic:${concept.id}:practice`, kind: 'quiz' }}
              onDone={r => {
                setPractice(r)
                actions.addScore('grammar', pct(r.correct, r.total))
              }}
            />
          ))}

        {step === 3 && (
          <>
            <Card>
              <div className="eyebrow">{t('dialogue')}</div>
              <ul className="dialog">
                {concept.dialogue.map((d, i) => (
                  <li key={i} className={i % 2 ? 'dialog--r' : ''}>
                    <small>{d.speaker}</small>
                    <div className="de break">
                      {d.text} <SpeakButton text={d.text} small />
                    </div>
                    <div className="muted small break">{strictC ? locStrict(d.ru, d.ky, lang) : d.ru}</div>
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <div className="eyebrow">{t('reallife')}</div>
              <ExampleList items={concept.reallife} strict={strictC} />
            </Card>
            <Button size="lg" onClick={() => go(4)} block>
              {t('step_speak')} →
            </Button>
          </>
        )}

        {step === 4 && (
          <>
            <Card tone="violet">
              <div className="eyebrow">{t('speakingLab')}</div>
              <p className="break">{tr(concept.speakPrompt.prompt, lang)}</p>
              <details className="hint">
                <summary>{t('hints')}</summary>
                <div className="de break">
                  {concept.speakPrompt.sample} <SpeakButton text={concept.speakPrompt.sample} small />
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
            <Button size="lg" onClick={() => go(5)} block variant={score ? 'primary' : 'ghost'}>
              {t('step_test')} →
            </Button>
          </>
        )}

        {step === 5 &&
          (test ? (
            <Card>
              <p className="h3">
                {pct(test.correct, test.total)}% · {test.correct} / {test.total}
              </p>
              <Button onClick={() => go(6)} block size="lg">
                {t('step_review')} →
              </Button>
            </Card>
          ) : (
            <QuizRunner
              questions={testQs}
              activity={{ id: `topic:${concept.id}:test`, kind: 'quiz' }}
              onDone={r => {
                setTest(r)
                actions.addScore('grammar', pct(r.correct, r.total))
              }}
            />
          ))}

        {step === 6 && (
          <>
            <Card tone="green">
              <div className="eyebrow">{t('step_review')}</div>
              <p className="break">{tr(concept.summary, lang)}</p>
              {(practice || test) && (
                <p className="small muted">
                  {t('step_practice')}: {practice ? `${practice.correct}/${practice.total}` : '—'} · {t('step_test')}:{' '}
                  {test ? `${test.correct}/${test.total}` : '—'}
                </p>
              )}
            </Card>
            {[...(practice?.wrong ?? []), ...(test?.wrong ?? [])].length > 0 && (
              <Card>
                <div className="eyebrow">{t('weaknesses')}</div>
                <ul className="mistakes">
                  {[...(practice?.wrong ?? []), ...(test?.wrong ?? [])].map(q => (
                    <li key={q.id}>
                      <div className="de break">{q.prompt}</div>
                      <div className="good break">✓ {q.answer}</div>
                      {questionWhy(q, lang) && <div className="muted small break">{questionWhy(q, lang)}</div>}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            <div className="row">
              <Button
                size="lg"
                onClick={() => {
                  finishTopic()
                }}
                disabled={state.completed.includes(`topic:${concept.id}`)}
              >
                {state.completed.includes(`topic:${concept.id}`) ? `✓ ${t('completed')}` : t('finish')}
              </Button>
              {nextConcept && state.completed.includes(`topic:${concept.id}`) && (
                <Button variant="soft" to={`/learn/topic/${nextConcept.id}`}>
                  {tr(nextConcept.title, lang)} →
                </Button>
              )}
              <A to="/grammar" className="btn btn--ghost">
                {t('grammarLab')}
              </A>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
