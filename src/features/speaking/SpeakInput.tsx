import { useEffect, useRef, useState } from 'react'
import { useApp } from '../../app/store'
import { Waveform } from '../../components/SpeakButton'
import { Button } from '../../components/ui'
import { recognitionSupported, startRecognition } from '../../services/speech'

/** Voice input with a typed fallback. Confidence is null for typed answers. */
export function SpeakInput({ onResult, disabled }: { onResult: (text: string, confidence: number | null) => void; disabled?: boolean }) {
  const { t } = useApp()
  const [listening, setListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [text, setText] = useState('')
  const stopRef = useRef<() => void>(() => undefined)
  const supported = recognitionSupported()

  useEffect(() => () => stopRef.current(), [])

  const toggle = async () => {
    if (listening) {
      stopRef.current()
      return
    }
    setError(null)
    const { promise, stop } = startRecognition()
    stopRef.current = stop
    setListening(true)
    try {
      const r = await promise
      onResult(r.text, r.confidence ?? 0.8)
    } catch (e) {
      const code = (e as Error).message
      setError(code === 'not-allowed' || code === 'service-not-allowed' ? t('micDenied') : code === 'no-speech' ? t('noSpeech') : t('noMic'))
    } finally {
      setListening(false)
    }
  }

  const send = () => {
    const v = text.trim()
    if (!v) return
    onResult(v, null)
    setText('')
  }

  return (
    <div className="speakinput">
      {supported && (
        <div className="speakinput__mic">
          <Waveform active={listening} />
          <button type="button" className={`micbtn ${listening ? 'is-live' : ''}`} onClick={toggle} disabled={disabled} aria-pressed={listening}>
            <span aria-hidden>🎙️</span>
            <span>{listening ? t('listening') : t('hold')}</span>
          </button>
        </div>
      )}
      {!supported && <p className="muted small">{t('noMic')}</p>}
      {error && <p className="speakinput__err" role="alert">{error}</p>}
      <form
        className="speakinput__type"
        onSubmit={e => {
          e.preventDefault()
          send()
        }}
      >
        <input value={text} onChange={e => setText(e.target.value)} placeholder={t('orType')} lang="de" autoComplete="off" disabled={disabled} aria-label={t('orType')} />
        <Button type="submit" disabled={disabled || !text.trim()} size="md">
          {t('send')}
        </Button>
      </form>
    </div>
  )
}
