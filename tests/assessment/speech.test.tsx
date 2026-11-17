// @vitest-environment jsdom
/**
 * Stage 9B — technical verification of the German text-to-speech layer with a FAKE `speechSynthesis` (voice selection, availability, chunking, playback
 * controls, repeat, no overlap, graceful fallback). IMPORTANT LIMIT: a fake engine proves OUR logic; it cannot prove how real mobile engines (iOS Safari,
 * Android Chrome) behave. Real-device verification is a manual checklist (docs/implementation/A2_STAGE9B_ASSESSMENT_PREREQUISITES.md).
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppProvider } from '../../src/app/store'
import { SpeakButton } from '../../src/components/SpeakButton'
import { QuizRunner } from '../../src/features/tests/QuizRunner'
import type { Question } from '../../src/features/tests/questions'
import { dictionaries } from '../../src/i18n'
import { defaultProgress } from '../../src/storage/defaults'
import { KEY } from '../helpers'

class FakeUtterance {
  text: string
  lang = ''
  rate = 1
  voice: unknown = null
  onstart: (() => void) | null = null
  onend: (() => void) | null = null
  onerror: (() => void) | null = null
  constructor(text: string) {
    this.text = text
  }
}
interface FakeVoice {
  name: string
  lang: string
  localService: boolean
}
const v = (lang: string, localService = true, name = lang): FakeVoice => ({ name, lang, localService })

let voices: FakeVoice[] = []
let spoken: FakeUtterance[] = []
let cancels = 0
const install = () => {
  ;(window as unknown as Record<string, unknown>).speechSynthesis = {
    getVoices: () => voices,
    speak: (u: FakeUtterance) => spoken.push(u),
    cancel: () => {
      cancels++
    },
    onvoiceschanged: null,
  }
  ;(globalThis as unknown as Record<string, unknown>).SpeechSynthesisUtterance = FakeUtterance
}
const uninstall = () => {
  delete (window as unknown as Record<string, unknown>).speechSynthesis
}
const load = async () => {
  vi.resetModules()
  return import('../../src/services/speech')
}
const last = () => spoken[spoken.length - 1]

beforeEach(() => {
  voices = []
  spoken = []
  cancels = 0
  install()
  window.scrollTo = () => undefined
  localStorage.clear()
})
afterEach(() => {
  cleanup()
  vi.useRealTimers()
  uninstall()
})

describe('German voice selection and availability', () => {
  it('prefers de-DE over other German variants, an on-device voice over a network voice, understands the Android form de_DE, ignores non-German voices', async () => {
    const { chooseGermanVoice } = await load()
    const pick = (list: FakeVoice[]) => chooseGermanVoice(list as never) as unknown as FakeVoice | undefined
    expect(pick([v('en-US'), v('de-AT'), v('de-DE', false, 'net'), v('de-DE', true, 'local')])?.name).toBe('local')
    expect(pick([v('de-CH'), v('de-AT')])?.lang).toBe('de-CH')
    expect(pick([v('en-GB'), v('de_DE', true, 'android')])?.name).toBe('android')
    expect(pick([v('de', true, 'bare')])?.name).toBe('bare')
    expect(pick([v('en-US'), v('fr-FR'), v('ru-RU')])).toBeUndefined()
    expect(pick([v('dev-X'), v('den-Y')])).toBeUndefined() // "de" prefix of another language code is not German
    expect(pick([])).toBeUndefined()
  })
  it('status: unsupported / unknown (voices not listed yet) / missing (no German voice) / available', async () => {
    const sp = await load()
    expect(sp.germanVoiceStatus()).toBe('unknown')
    expect(sp.audioAvailable()).toBe(true) // optimistic while unknown: speaking is still attempted
    voices = [v('en-US'), v('fr-FR')]
    expect(sp.germanVoiceStatus()).toBe('missing')
    expect(sp.audioAvailable()).toBe(false)
    voices = [v('en-US'), v('de-DE')]
    expect(sp.germanVoiceStatus()).toBe('available')
    expect(sp.audioAvailable()).toBe(true)
    uninstall()
    expect(sp.germanVoiceStatus()).toBe('unsupported')
    expect(sp.audioAvailable()).toBe(false)
    expect(sp.ttsSupported()).toBe(false)
  })
})

describe('speak: German voice, language, rate, chunking', () => {
  it('speaks with lang de-DE, the default rate 0.95 (or the given one) and the chosen German voice', async () => {
    const { speak } = await load()
    voices = [v('en-US'), v('de-DE', true, 'Anna')]
    speak('Guten Tag.')
    expect(spoken).toHaveLength(1)
    expect(last()).toMatchObject({ text: 'Guten Tag.', lang: 'de-DE', rate: 0.95 })
    expect((last().voice as FakeVoice).name).toBe('Anna')
    speak('Guten Tag.', { rate: 0.7 })
    expect(last().rate).toBe(0.7)
  })
  it('still speaks (lang de-DE, no voice object) when the voice list is empty or has no German voice', async () => {
    const { speak } = await load()
    speak('Hallo.')
    expect(last()).toMatchObject({ lang: 'de-DE', voice: null })
  })
  it('splitForSpeech: a short text is one chunk; a long dialogue becomes chunks of at most 160 characters, at sentence ends, with no text lost', async () => {
    const { splitForSpeech } = await load()
    expect(splitForSpeech('Guten Tag.')).toEqual(['Guten Tag.'])
    const dialogue = Array.from(
      { length: 12 },
      (_, i) => `Das ist der ${i + 1}. Satz des langen Dialogs, den die Sprachausgabe nicht abbrechen soll.`,
    ).join(' ')
    const chunks = splitForSpeech(dialogue)
    expect(chunks.length).toBeGreaterThan(3)
    for (const c of chunks) expect(c.length).toBeLessThanOrEqual(160)
    expect(chunks.join(' ')).toBe(dialogue)
    const noPunctuation = Array.from({ length: 80 }, (_, i) => `wort${i}`).join(' ')
    for (const c of splitForSpeech(noPunctuation)) expect(c.length).toBeLessThanOrEqual(160)
    expect(splitForSpeech(noPunctuation).join(' ')).toBe(noPunctuation)
  })
  it('a long text is spoken as a queue: the next chunk starts when the previous one ends; onStart once, onEnd once after the LAST chunk', async () => {
    const { speak, isSpeaking } = await load()
    const text = Array.from(
      { length: 10 },
      (_, i) => `Satz Nummer ${i} ist ziemlich lang und endet hier mit einem Punkt, damit er geteilt wird.`,
    ).join(' ')
    const onStart = vi.fn()
    const onEnd = vi.fn()
    speak(text, { onStart, onEnd })
    expect(spoken).toHaveLength(1)
    last().onstart?.()
    expect(onStart).toHaveBeenCalledTimes(1)
    let guard = 0
    while (!onEnd.mock.calls.length && guard++ < 50) {
      const before = spoken.length
      last().onend?.()
      if (!onEnd.mock.calls.length) expect(spoken.length).toBe(before + 1)
    }
    expect(spoken.length).toBeGreaterThan(2)
    expect(onEnd).toHaveBeenCalledTimes(1)
    expect(isSpeaking()).toBe(false)
  })
})

describe('no accidental playback overlap', () => {
  it('starting a new playback interrupts the previous one: its end callback fires once, and its late browser events are ignored', async () => {
    const { speak } = await load()
    const aEnd = vi.fn()
    speak(
      'Erster Text. Mit zwei Sätzen und mehr Text, damit er in der Warteschlange mehrere Teile hat und lange genug ist, um geteilt zu werden.',
      { onEnd: aEnd },
    )
    const first = last()
    const bEnd = vi.fn()
    speak('Zweiter Text.', { onEnd: bEnd })
    expect(aEnd).toHaveBeenCalledTimes(1)
    expect(cancels).toBe(2) // cancel before each playback
    const count = spoken.length
    first.onend?.() // the cancelled utterance reports its end late
    first.onerror?.()
    expect(spoken.length).toBe(count) // the old queue does not continue
    expect(aEnd).toHaveBeenCalledTimes(1)
    expect(bEnd).not.toHaveBeenCalled() // the late events of A did not end B
    last().onend?.()
    expect(bEnd).toHaveBeenCalledTimes(1)
  })
  it('stopSpeaking interrupts the playback, cancels the engine and is safe when nothing plays or speech is unsupported', async () => {
    const sp = await load()
    const end = vi.fn()
    sp.speak('Hallo.', { onEnd: end })
    expect(sp.stopSpeaking()).toBe(true)
    expect(end).toHaveBeenCalledTimes(1)
    expect(sp.isSpeaking()).toBe(false)
    expect(() => sp.stopSpeaking()).not.toThrow()
    uninstall()
    expect(sp.stopSpeaking()).toBe(false)
  })
  it('a sequence (listening lab) ends when another playback takes over: onDone once, no further line', async () => {
    vi.useFakeTimers()
    const { speak, speakSequence } = await load()
    const onLine = vi.fn()
    const onDone = vi.fn()
    speakSequence(['Eins.', 'Zwei.', 'Drei.'], 0.9, onLine, onDone)
    expect(onLine).toHaveBeenLastCalledWith(0)
    speak('Wort') // e.g. the learner taps a word
    expect(onDone).toHaveBeenCalledTimes(1)
    last().onend?.()
    vi.advanceTimersByTime(2000)
    expect(onLine).toHaveBeenCalledTimes(1)
    expect(onDone).toHaveBeenCalledTimes(1)
  })
  it('a sequence plays its lines one after another and calls onDone at the end; cancel() stops it without onDone', async () => {
    vi.useFakeTimers()
    const { speakSequence } = await load()
    const onLine = vi.fn()
    const onDone = vi.fn()
    speakSequence(['Eins.', 'Zwei.'], 0.9, onLine, onDone)
    last().onend?.()
    vi.advanceTimersByTime(300)
    expect(onLine).toHaveBeenLastCalledWith(1)
    last().onend?.()
    vi.advanceTimersByTime(300)
    expect(onDone).toHaveBeenCalledTimes(1)
    const done2 = vi.fn()
    const cancel = speakSequence(['A.', 'B.'], 0.9, () => undefined, done2)
    cancel()
    last().onend?.()
    vi.advanceTimersByTime(2000)
    expect(done2).not.toHaveBeenCalled()
  })
})

describe('graceful fallback when speech synthesis is unavailable', () => {
  it('speak() reports the end immediately and never throws', async () => {
    const { speak } = await load()
    uninstall()
    const onEnd = vi.fn()
    expect(() => speak('Hallo.', { onEnd })).not.toThrow()
    expect(onEnd).toHaveBeenCalledTimes(1)
  })
  it('the speak button renders nothing', () => {
    uninstall()
    const { container } = render(<SpeakButton text="Hallo" />)
    expect(container.querySelector('button')).toBeNull()
  })
})

describe('SpeakButton controls: play, stop, repeat, cleanup', () => {
  it('play → aria-pressed + "Stop" label; click again = stop; click again = repeat (a new playback); unmount while playing stops the audio', async () => {
    // the button imports the same module instance as `speak`: use the real module for this test
    vi.resetModules()
    const { SpeakButton: Button } = await import('../../src/components/SpeakButton')
    const { unmount } = render(<Button text="Guten Morgen." />)
    const btn = () => screen.getByRole('button')
    expect(btn().getAttribute('aria-pressed')).toBe('false')
    expect(btn().getAttribute('aria-label')).toBe('Listen: Guten Morgen.')
    fireEvent.click(btn())
    expect(spoken).toHaveLength(1)
    act(() => last().onstart?.())
    expect(btn().getAttribute('aria-pressed')).toBe('true')
    expect(btn().getAttribute('aria-label')).toBe('Stop: Guten Morgen.')
    const cancelsBefore = cancels
    fireEvent.click(btn()) // stop
    expect(cancels).toBeGreaterThan(cancelsBefore)
    expect(btn().getAttribute('aria-pressed')).toBe('false')
    fireEvent.click(btn()) // repeat
    expect(spoken).toHaveLength(2)
    act(() => last().onstart?.())
    expect(btn().getAttribute('aria-pressed')).toBe('true')
    const c = cancels
    unmount() // the next question replaces the button
    expect(cancels).toBeGreaterThan(c)
  })
  it('pressing another speak button while one plays stops the first (one playback at a time)', async () => {
    vi.resetModules()
    const { SpeakButton: Button } = await import('../../src/components/SpeakButton')
    render(
      <>
        <Button text="Eins" label="eins" />
        <Button text="Zwei" label="zwei" />
      </>,
    )
    const [a, b] = screen.getAllByRole('button')
    fireEvent.click(a)
    act(() => spoken[0].onstart?.())
    expect(a.getAttribute('aria-pressed')).toBe('true')
    fireEvent.click(b)
    expect(a.getAttribute('aria-pressed')).toBe('false')
    act(() => last().onstart?.())
    expect(b.getAttribute('aria-pressed')).toBe('true')
  })
})

describe('listening questions in a test: audio fallback', () => {
  const listening: Question = {
    id: 'lq1',
    type: 'choice',
    prompt: 'Wohin fährt Anna?',
    options: ['Nach Berlin', 'Nach Köln'],
    answer: 'Nach Berlin',
    audio: 'Anna: Ich fahre morgen nach Berlin.',
    skill: 'listening',
    kind: 'listening',
  }
  async function show(q: Question) {
    localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang: 'ru' }))
    render(
      <AppProvider>
        <QuizRunner questions={[q]} onDone={() => undefined} activity={{ id: 'x', kind: 'assessment' }} />
      </AppProvider>,
    )
    await act(async () => {})
    return document.body.textContent ?? ''
  }
  it('no speech synthesis: a notice and the transcript are shown (the question stays answerable), and there is no play button', async () => {
    uninstall()
    const text = await show(listening)
    expect(text).toContain(dictionaries.ru.audioUnavailable)
    expect(text).toContain('Ich fahre morgen nach Berlin.')
    expect(screen.queryByRole('button', { name: /Listen/ })).toBeNull()
  })
  it('speech synthesis present but no German voice: the same fallback', async () => {
    voices = [v('en-US')]
    const text = await show(listening)
    expect(text).toContain(dictionaries.ru.audioUnavailable)
    expect(text).toContain('Ich fahre morgen nach Berlin.')
  })
  it('a German voice (or voices not listed yet): no notice, no transcript, a play button', async () => {
    voices = [v('de-DE')]
    let text = await show(listening)
    expect(text).not.toContain(dictionaries.ru.audioUnavailable)
    expect(text).not.toContain('Ich fahre morgen nach Berlin.')
    expect(screen.getByRole('button', { name: /Listen/ })).toBeTruthy()
    cleanup()
    voices = []
    text = await show(listening)
    expect(text).not.toContain(dictionaries.ru.audioUnavailable)
  })
  it('only listening questions get the fallback: a vocabulary question with an audio word is unchanged', async () => {
    uninstall()
    const text = await show({ ...listening, skill: 'vocabulary', kind: 'vocabulary', audio: 'Haus' })
    expect(text).not.toContain(dictionaries.ru.audioUnavailable)
  })
})
