import { useEffect, useRef, useState } from 'react'
import { useApp } from '../../app/store'
import { Button, Card, PageHeader } from '../../components/ui'
import type { AIMessage } from '../../data/types'
import { tutor } from '../../services/tutor'

/** Render **bold** and newlines from tutor replies without dangerouslySetInnerHTML. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split('\n').map((line, i) => (
        <p key={i} className="break rich__line">
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, k) => (part.startsWith('**') ? <b key={k}>{part.slice(2, -2)}</b> : part))}
        </p>
      ))}
    </>
  )
}

export function TutorChat() {
  const { state, actions, t, lang } = useApp()
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [lastConcept, setLastConcept] = useState<string | undefined>()
  const endRef = useRef<HTMLDivElement>(null)
  const msgs = state.tutor.messages

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }) }, [msgs.length, busy])

  const ask = async (q: string) => {
    const text = q.trim()
    if (!text || busy) return
    const um: AIMessage = { id: `u${Date.now()}`, role: 'user', text }
    actions.pushTutor([um])
    setInput('')
    setBusy(true)
    const r = await tutor.reply(text, { lang, level: state.level, lastConceptId: lastConcept })
    if (r.conceptId) setLastConcept(r.conceptId)
    setSuggestions(r.suggestions ?? [])
    actions.pushTutor([{ id: `a${Date.now()}`, role: 'ai', text: r.text }])
    setBusy(false)
  }

  const starters = ['Почему здесь Dativ?', 'Объясни Akkusativ', 'В чём разница между wissen и kennen?', 'Исправь: Ich habe 25 Jahre', 'Проверь меня']

  return (
    <div className="stack tutor">
      <PageHeader eyebrow="✨ AI" title={t('tutorTitle')} sub={t('tutorSub')} right={msgs.length > 0 ? <Button variant="ghost" size="sm" onClick={actions.clearTutor}>✕</Button> : undefined} />
      <Card tone="violet"><p className="small">{t('tutorMock')}</p></Card>
      <div className="chat chat--tutor" aria-live="polite">
        {msgs.length === 0 && (
          <div className="stack stack--sm">
            <p className="muted">{t('nav_tutor')} · {state.level}</p>
            {starters.map(s => <button key={s} type="button" className="hintbtn" onClick={() => ask(s)}>{s}</button>)}
          </div>
        )}
        {msgs.map(m => (
          <div key={m.id} className={`bubble bubble--${m.role === 'ai' ? 'ai' : 'user'}`}>
            {m.role === 'ai' && <small className="bubble__who">BilUp AI</small>}
            <Rich text={m.text} />
          </div>
        ))}
        {busy && <div className="bubble bubble--ai"><span className="typing" aria-label={t('tutorThinking')}><i /><i /><i /></span></div>}
        <div ref={endRef} />
      </div>
      {!busy && suggestions.length > 0 && (
        <div className="row">{suggestions.map(s => <button key={s} type="button" className="chip chip--violet" onClick={() => ask(s)}>{s}</button>)}</div>
      )}
      <form className="speakinput__type tutor__form" onSubmit={e => { e.preventDefault(); void ask(input) }}>
        <input value={input} onChange={e => setInput(e.target.value)} placeholder={t('tutorPlaceholder')} aria-label={t('tutorPlaceholder')} />
        <Button type="submit" variant="violet" disabled={busy || !input.trim()}>{t('send')}</Button>
      </form>
    </div>
  )
}
