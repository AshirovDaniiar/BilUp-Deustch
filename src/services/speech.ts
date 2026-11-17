/** Thin wrappers around the Web Speech API. Everything degrades gracefully when unsupported. */

export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window

const langOf = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase()
const isGerman = (v: SpeechSynthesisVoice) => langOf(v) === 'de' || langOf(v).startsWith('de-')

/** Best German voice: de-DE before other German variants (de-AT, de-CH), and an on-device voice before a network voice. */
export function chooseGermanVoice(voices: readonly SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const score = (v: SpeechSynthesisVoice) => (langOf(v) === 'de-de' ? 2 : 0) + (v.localService ? 1 : 0)
  return voices.filter(isGerman).sort((a, b) => score(b) - score(a))[0]
}

let germanVoice: SpeechSynthesisVoice | undefined
function pickVoice() {
  if (!ttsSupported()) return undefined
  germanVoice = chooseGermanVoice(window.speechSynthesis.getVoices())
  return germanVoice
}
if (ttsSupported()) {
  window.speechSynthesis.onvoiceschanged = () => pickVoice()
}

/**
 * Can German audio be expected? 'unsupported' = no speech synthesis; 'unknown' = the browser has not listed its voices yet (common at start-up
 * on Chrome and Safari; speaking is still attempted); 'missing' = voices are listed but none is German (the browser would read German text
 * with a non-German voice); 'available' = a German voice exists.
 */
export type VoiceStatus = 'unsupported' | 'unknown' | 'available' | 'missing'
export function germanVoiceStatus(): VoiceStatus {
  if (!ttsSupported()) return 'unsupported'
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return 'unknown'
  return chooseGermanVoice(voices) ? 'available' : 'missing'
}
/** Is it reasonable to put a question that REQUIRES listening in front of the learner on this device? */
export const audioAvailable = (): boolean => {
  const s = germanVoiceStatus()
  return s === 'available' || s === 'unknown'
}

/**
 * Split text for speech into chunks of at most `max` characters at sentence ends (then at commas / spaces). Browsers (notably Chrome with network
 * voices, and some mobile engines) cut off or stall on long utterances, so a dialogue is spoken as a queue of short ones.
 */
export function splitForSpeech(text: string, max = 160): string[] {
  const out: string[] = []
  let cur = ''
  const push = (s: string) => {
    if (cur && (cur + ' ' + s).length > max) {
      out.push(cur)
      cur = s
    } else cur = cur ? cur + ' ' + s : s
  }
  for (const sentence of text
    .trim()
    .split(/(?<=[.!?…])\s+/)
    .filter(Boolean)) {
    if (sentence.length <= max) push(sentence)
    else
      for (const part of sentence.split(/(?<=[,;:])\s+/).flatMap(p => {
        const words = p.split(/\s+/)
        const pieces: string[] = []
        let w = ''
        for (const x of words) {
          if (w && (w + ' ' + x).length > max) {
            pieces.push(w)
            w = x
          } else w = w ? w + ' ' + x : x
        }
        if (w) pieces.push(w)
        return pieces
      }))
        push(part)
  }
  if (cur) out.push(cur)
  return out.length ? out : [text]
}

export interface SpeakOptions {
  rate?: number
  onEnd?: () => void
  onStart?: () => void
  /** called when this playback is stopped or replaced by another one (default: `onEnd`, the pre-existing behaviour) */
  onInterrupt?: () => void
}

/** The playback session that is currently running (at most one: starting a new one, or stopping, interrupts it first). */
let active: { opts: SpeakOptions } | null = null
function interrupt() {
  if (!active) return
  const a = active
  active = null
  ;(a.opts.onInterrupt ?? a.opts.onEnd)?.()
}

export function speak(text: string, opts: SpeakOptions = {}) {
  if (!ttsSupported()) {
    opts.onEnd?.()
    return
  }
  const synth = window.speechSynthesis
  interrupt() // never two playbacks at once; the previous session's callbacks are settled here, its late browser events are ignored below
  synth.cancel()
  const me = { opts }
  active = me
  const chunks = splitForSpeech(text)
  const run = (i: number) => {
    if (active !== me) return
    const u = new SpeechSynthesisUtterance(chunks[i])
    u.lang = 'de-DE'
    u.rate = opts.rate ?? 0.95
    const v = germanVoice ?? pickVoice()
    if (v) u.voice = v
    if (i === 0) u.onstart = () => active === me && opts.onStart?.()
    const next = () => {
      if (active !== me) return // superseded or stopped: ignore late events of a cancelled utterance
      if (i + 1 < chunks.length) return run(i + 1)
      active = null
      opts.onEnd?.()
    }
    u.onend = next
    u.onerror = next
    synth.speak(u)
  }
  run(0)
}

export const isSpeaking = () => active !== null

export const stopSpeaking = () => {
  if (!ttsSupported()) return false
  interrupt()
  window.speechSynthesis.cancel()
  return true
}

/** Speak several lines one after another; returns a cancel function. If another playback takes over, the sequence ends (onDone is called). */
export function speakSequence(lines: string[], rate: number, onLine: (i: number) => void, onDone: () => void) {
  let cancelled = false
  const run = (i: number) => {
    if (cancelled) return
    if (i >= lines.length) return onDone()
    onLine(i)
    speak(lines[i], {
      rate,
      onEnd: () => setTimeout(() => run(i + 1), 250),
      onInterrupt: () => {
        if (cancelled) return
        cancelled = true
        onDone()
      },
    })
  }
  run(0)
  return () => {
    cancelled = true
    stopSpeaking()
  }
}

// ---------- recognition ----------
interface RecResult {
  text: string
  confidence: number
}
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
