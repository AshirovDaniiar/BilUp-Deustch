import { useState } from 'react'
import { A } from '../../app/router'
import { useApp } from '../../app/store'
import { Sheet } from '../../components/ui'
import { SpeakButton } from '../../components/SpeakButton'
import { grammarById } from '../../data/grammar'
import type { GrammarExample, WhyNote } from '../../data/types'
import { tr } from '../../utils/text'

/** Wraps `focus` inside `text` with a <mark>. */
export function Highlight({ text, focus }: { text: string; focus?: string }) {
  if (!focus) return <>{text}</>
  const i = text.indexOf(focus)
  if (i < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, i)}
      <mark className="hl">{focus}</mark>
      {text.slice(i + focus.length)}
    </>
  )
}

export function ExampleList({ items, withAudio = true }: { items: GrammarExample[]; withAudio?: boolean }) {
  return (
    <ul className="examples">
      {items.map(e => (
        <li key={e.de}>
          <div className="grow">
            <div className="de break">
              <Highlight text={e.de} focus={e.focus} />
            </div>
            <div className="muted small break">{e.ru}</div>
          </div>
          {withAudio && <SpeakButton text={e.de} small />}
        </li>
      ))}
    </ul>
  )
}

/** Signature feature: a WHY? button that opens a short, concrete explanation. */
export function WhyButton({ note, label }: { note: WhyNote; label?: string }) {
  const { t, lang } = useApp()
  const [open, setOpen] = useState(false)
  const concept = grammarById.get(note.conceptId)
  return (
    <>
      <button type="button" className="whybtn" onClick={() => setOpen(true)}>
        <span aria-hidden>?</span> {label ?? t('why')}
      </button>
      <Sheet open={open} onClose={() => setOpen(false)} title={`${t('why')} «${note.word}»`}>
        <div className="stack">
          <div className="whybox">
            <div className="de break whybox__sentence">
              <Highlight text={note.sentence} focus={note.word} />
              <SpeakButton text={note.sentence} small />
            </div>
            <div className="muted small break">{note.ru}</div>
          </div>
          <p className="break">{tr(note.reason, lang)}</p>
          <div>
            <div className="eyebrow">{t('examples')}</div>
            <ExampleList items={note.more} />
          </div>
          {concept && (
            <A to={`/grammar/${concept.id}`} className="btn btn--soft btn--block" onClick={() => setOpen(false)}>
              {tr(concept.title, lang)} →
            </A>
          )}
        </div>
      </Sheet>
    </>
  )
}
