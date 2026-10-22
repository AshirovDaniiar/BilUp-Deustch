import { useState } from 'react'
import { speak, ttsSupported } from '../services/speech'

/** Plays German text. The animated bars show that audio is playing. */
export function SpeakButton({ text, rate, label, small, className = '' }: { text: string; rate?: number; label?: string; small?: boolean; className?: string }) {
  const [playing, setPlaying] = useState(false)
  if (!ttsSupported()) return null
  return (
    <button
      type="button"
      className={`speakbtn ${small ? 'speakbtn--sm' : ''} ${playing ? 'is-playing' : ''} ${className}`}
      onClick={e => {
        e.stopPropagation()
        speak(text, { rate, onStart: () => setPlaying(true), onEnd: () => setPlaying(false) })
      }}
      aria-label={label ?? `Listen: ${text}`}
    >
      <span className="speakbtn__bars" aria-hidden>
        <i /><i /><i />
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
