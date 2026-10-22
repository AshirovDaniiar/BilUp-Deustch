/** Thin wrappers around the Web Speech API. Everything degrades gracefully when unsupported. */

export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window

let germanVoice: SpeechSynthesisVoice | undefined
function pickVoice() {
  if (!ttsSupported()) return undefined
  const voices = window.speechSynthesis.getVoices()
  germanVoice = voices.find(v => v.lang === 'de-DE') ?? voices.find(v => v.lang.startsWith('de'))
  return germanVoice
}
if (ttsSupported()) {
  window.speechSynthesis.onvoiceschanged = () => pickVoice()
}

export interface SpeakOptions { rate?: number; onEnd?: () => void; onStart?: () => void }

export function speak(text: string, opts: SpeakOptions = {}) {
  if (!ttsSupported()) {
    opts.onEnd?.()
    return
  }
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'de-DE'
  u.rate = opts.rate ?? 0.95
  const v = germanVoice ?? pickVoice()
  if (v) u.voice = v
  u.onstart = () => opts.onStart?.()
  u.onend = () => opts.onEnd?.()
  u.onerror = () => opts.onEnd?.()
  synth.speak(u)
}

export const stopSpeaking = () => ttsSupported() && window.speechSynthesis.cancel()

/** Speak several lines one after another; returns a cancel function. */
export function speakSequence(lines: string[], rate: number, onLine: (i: number) => void, onDone: () => void) {
  let cancelled = false
  const run = (i: number) => {
    if (cancelled) return
    if (i >= lines.length) return onDone()
    onLine(i)
    speak(lines[i], { rate, onEnd: () => setTimeout(() => run(i + 1), 250) })
  }
  run(0)
  return () => {
    cancelled = true
    stopSpeaking()
  }
}

// ---------- recognition ----------
interface RecResult { text: string; confidence: number }
type RecCtor = new () => {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string; confidence: number }>> }) => void) | null
  onerror: ((e: { error: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

function recCtor(): RecCtor | undefined {
  if (typeof window === 'undefined') return undefined
  const w = window as unknown as { SpeechRecognition?: RecCtor; webkitSpeechRecognition?: RecCtor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export const recognitionSupported = () => !!recCtor()

/** Starts recognition; resolves with the transcript, or rejects with an error code (e.g. "not-allowed"). */
export function startRecognition(): { promise: Promise<RecResult>; stop: () => void } {
  const Ctor = recCtor()
  if (!Ctor) return { promise: Promise.reject(new Error('unsupported')), stop: () => undefined }
  const rec = new Ctor()
  rec.lang = 'de-DE'
  rec.interimResults = false
  rec.maxAlternatives = 1
  let got: RecResult | null = null
  const promise = new Promise<RecResult>((resolve, reject) => {
    rec.onresult = e => {
      const alt = e.results[0][0]
      got = { text: alt.transcript, confidence: alt.confidence }
    }
    rec.onerror = e => reject(new Error(e.error))
    rec.onend = () => (got ? resolve(got) : reject(new Error('no-speech')))
    try {
      rec.start()
    } catch {
      reject(new Error('unavailable'))
    }
  })
  return { promise, stop: () => rec.stop() }
}
