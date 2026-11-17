import { useEffect, useRef, useState } from 'react'
import { speak, stopSpeaking, ttsSupported } from '../services/speech'

/**
 * Plays German text. The animated bars show that audio is playing. Controls: a click starts playback; a click while it plays STOPS it; a click
 * after it ended plays it again (repeat). Only one playback exists at a time (starting another one stops this one), and playback stops when the
 * button leaves the screen (e.g. the next question), so audio never carries over or overlaps.
 */
export function SpeakButton({
  text,
  rate,
  label,
  small,
  className = '',
}: {
  text: string
  rate?: number
  label?: string
  small?: boolean
  className?: string
}) {
  const [playing, setPlaying] = useState(false)
  const live = useRef(false)
  useEffect(
    () => () => {
      if (live.current) stopSpeaking()
    },
    [],
  )
  if (!ttsSupported()) return null
  const set = (v: boolean) => {
    live.current = v
    setPlaying(v)
  }
  return (
    <button
      type="button"
      className={`speakbtn ${small ? 'speakbtn--sm' : ''} ${playing ? 'is-playing' : ''} ${className}`}
      onClick={e => {
        e.stopPropagation()
        if (playing) {
          stopSpeaking()
          return
        }
        speak(text, { rate, onStart: () => set(true), onEnd: () => set(false) })
      }}
      aria-pressed={playing}
      aria-label={label ?? `${playing ? 'Stop' : 'Listen'}: ${text}`}
    >
      <span className="speakbtn__bars" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      {label && <span>{label}</span>}
    </button>
  )
}

export function Waveform({ active, bars = 28 }: { active: boolean; bars?: number }) {
  return (
    <div className={`wave ${active ? 'is-active' : ''}`} aria-hidden>
      {Array.from({ length: bars }, (_, i) => (
        <i key={i} style={{ animationDelay: `${(i % 9) * 70}ms`, height: `${20 + ((i * 37) % 60)}%` }} />
      ))}
    </div>
  )
}
