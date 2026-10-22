import { useMemo, useState } from 'react'
import { A } from '../../app/router'
import { useApp } from '../../app/store'
import { Button, Card, Chip, PageHeader, Sheet } from '../../components/ui'
import { SpeakButton } from '../../components/SpeakButton'
import { READING, readingById } from '../../data/reading'
import { LEVELS, type LanguageLevel, type ReadingGloss, type ReadingText } from '../../data/types'
import { VOCABULARY, displayWord } from '../../data/vocabulary'
import { pct } from '../../utils/text'
import { QuizRunner, type QuizResult } from '../tests/QuizRunner'
import { NotFound } from '../../screens/NotFound'

export function ReadingList() {
  const { state, t } = useApp()
  const [level, setLevel] = useState<LanguageLevel>('A1')
  const list = READING.filter(r => r.level === level)
  return (
    <div className="stack">
      <PageHeader back="/practice" eyebrow="📖" title="Reading Lab" sub={t('lab_reading_d')} />
      <div className="row">
        {LEVELS.map(l => <Chip key={l} active={l === level} tone="blue" onClick={() => setLevel(l)}>{l}{READING.some(x => x.level === l) ? '' : ' 🔒'}</Chip>)}
      </div>
      <div className="grid grid--2">
        {list.map(r => (
          <A key={r.id} to={`/practice/reading/${r.id}`} className="card card--interactive conceptcard">
            <div className="row row--between"><Chip tone="blue">{r.level}</Chip>{state.completed.includes(`ex:${r.id}`) && <Chip tone="green">✓</Chip>}</div>
            <h3 className="h3">{r.title}</h3>
            <p className="muted small">{t('unit')} {r.unit} · {r.gloss.length} 💡</p>
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
  const v = VOCABULARY.find(x => x.de.toLowerCase() === w || x.plural?.toLowerCase() === w)
  return v ? { vocabId: v.id } : {}
}

export function ReadingView({ id }: { id: string }) {
  const { actions, t } = useApp()
  const text = readingById.get(id)
  const [sel, setSel] = useState<string | null>(null)
  const [reading, setReading] = useState(true)
  const [result, setResult] = useState<QuizResult | null>(null)
  const qs = useMemo(() => (text ? text.questions.map((q, i) => ({ id: `rq-${text.id}-${i}`, type: 'choice' as const, skill: 'reading' as const, kind: 'grammar' as const, prompt: q.q, options: q.options, answer: q.options[q.answer], why: { ru: text.body.join(' ') } })) : []), [text])
  if (!text) return <NotFound />

  const found = sel ? lookup(text, sel) : null
  const vocab = found?.vocabId ? VOCABULARY.find(v => v.id === found.vocabId) : undefined
  const onDone = (r: QuizResult) => {
    setResult(r)
    actions.addScore('reading', pct(r.correct, r.total))
    actions.complete(`ex:${text.id}`)
    actions.complete(`${text.unit}:reading`)
  }

  return (
    <div className="stack">
      <PageHeader back="/practice/reading" eyebrow={`📖 ${text.level} · ${t('unit')} ${text.unit}`} title={text.title} sub={t('tapWord')} />
      <Card className="reader">
        {text.body.map((p, i) => (
          <p key={i} className="reader__p">
            {p.split(' ').map((w, k) => {
              const known = !!lookup(text, w).gloss || !!lookup(text, w).vocabId
              return (
                <button key={k} type="button" className={`tapword ${known ? 'tapword--known' : ''}`} onClick={() => setSel(clean(w))}>{w}</button>
              )
            })}
            <SpeakButton text={p} small />
          </p>
        ))}
      </Card>

      {reading && <Button variant="violet" size="lg" block onClick={() => setReading(false)}>{t('understandQ')} →</Button>}
      {!reading && !result && <QuizRunner questions={qs} onDone={onDone} />}
      {result && (
        <Card tone="green">
          <b>{result.correct} / {result.total}</b>
          <div className="row" style={{ marginTop: 10 }}><Button variant="soft" onClick={() => { setResult(null); setReading(true) }}>{t('retry')}</Button><Button to="/practice/reading">{t('continue')}</Button></div>
        </Card>
      )}

      <Sheet open={!!sel} onClose={() => setSel(null)} title={sel ?? ''}>
        {found?.gloss && (
          <div className="stack">
            <div className="row"><b className="de">{found.gloss.word}</b><SpeakButton text={found.gloss.word} small /></div>
            <div><span className="eyebrow">{t('meaning')}</span><div className="break">{found.gloss.ru} <span className="muted">/ {found.gloss.ky}</span></div></div>
            <div><span className="eyebrow">{t('example')}</span><div className="de break">{found.gloss.example} <SpeakButton text={found.gloss.example} small /></div></div>
            <div><span className="eyebrow">{t('grammarForms')}</span><div className="break">{found.gloss.grammar}</div></div>
            {found.gloss.related.length > 0 && <div><span className="eyebrow">{t('related')}</span><div className="row" style={{ marginTop: 6 }}>{found.gloss.related.map(r => <Chip key={r} tone="blue">{r}</Chip>)}</div></div>}
          </div>
        )}
        {vocab && (
          <div className="stack">
            <div className="row"><b className="de">{displayWord(vocab)}</b><SpeakButton text={displayWord(vocab)} small /></div>
            <div><span className="eyebrow">{t('meaning')}</span><div className="break">{vocab.ru} <span className="muted">/ {vocab.ky}</span></div></div>
            <div><span className="eyebrow">{t('example')}</span><div className="de break">{vocab.example}</div><div className="muted small">{vocab.exampleRu}</div></div>
            <Button variant={'soft'} onClick={() => actions.toggleSaved(vocab.id)}>☆ {t('save')}</Button>
          </div>
        )}
        {sel && !found?.gloss && !vocab && (
          <div className="stack">
            <p className="muted">{t('wordNotFound')}</p>
            <A to="/tutor" className="btn btn--violet">✨ {t('askTutor')}</A>
          </div>
        )}
      </Sheet>
    </div>
  )
}
