import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ActiveTimeTracker, DEFAULT_IDLE_MS } from '../../src/progress/activeTime'
import { AppProvider, useApp, useKeepActive } from '../../src/app/store'
import { KEYS } from '../../src/storage/persistence'
import { mkResult, mountApp, record, storedRecord } from '../helpers'

const S = 1000

describe('ActiveTimeTracker (pure)', () => {
  it('counts time only within the idle window after an interaction', () => {
    const t = new ActiveTimeTracker(0)
    expect(t.mark(30 * S)).toBe(30 * S) // 30 s after opening
    expect(t.mark(60 * S)).toBe(60 * S) // exactly the idle window
    expect(t.mark(600 * S)).toBe(60 * S) // 9 further idle minutes add nothing
  })

  it('an interaction restarts the window', () => {
    const t = new ActiveTimeTracker(0)
    t.touch(50 * S)
    expect(t.mark(100 * S)).toBe(100 * S) // 0–50 active, 50–100 active again
    expect(t.mark(400 * S)).toBe(110 * S) // only 10 more seconds until the window ended at 110 s
  })

  it('idle time between two interactions counts at most one window', () => {
    const t = new ActiveTimeTracker(0)
    t.touch(500 * S) // 0–60 active, 60–500 idle
    expect(t.mark(500 * S)).toBe(60 * S)
    t.touch(530 * S)
    expect(t.mark(530 * S)).toBe(90 * S) // 500–530 active (30 s)
  })

  it('a hidden tab never counts; returning to the tab starts a fresh window', () => {
    const t = new ActiveTimeTracker(0)
    t.touch(10 * S)
    t.setVisible(false, 20 * S)
    expect(t.mark(20 * S)).toBe(20 * S)
    expect(t.mark(1000 * S)).toBe(20 * S) // hidden for ~16 minutes
    t.setVisible(true, 1000 * S)
    expect(t.mark(1030 * S)).toBe(50 * S)
  })

  it('consumeSeconds returns whole seconds once and carries the remainder (nothing lost, nothing double counted)', () => {
    const t = new ActiveTimeTracker(0)
    expect(t.consumeSeconds(1500)).toBe(1)
    expect(t.consumeSeconds(1700)).toBe(0)
    expect(t.consumeSeconds(2600)).toBe(1) // 2.6 s total → 2 consumed so far
    expect(t.consumeSeconds(2600)).toBe(0)
    expect(t.mark(2600)).toBe(2600)
  })

  it('out-of-order timestamps are ignored; mark is monotonic', () => {
    const t = new ActiveTimeTracker(1000)
    t.touch(5000)
    const m = t.mark(5000)
    t.touch(2000)
    expect(t.mark(3000)).toBe(m)
    expect(t.mark(6000)).toBeGreaterThanOrEqual(m)
  })

  it('uses a 60 s idle window by default (05 §5 [A])', () => {
    expect(DEFAULT_IDLE_MS).toBe(60_000)
  })
})

describe('study time in the running app (no global ticker; idle and hidden time are not study time)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 10, 12, 0, 0))
  })
  afterEach(() => {
    vi.useRealTimers()
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' })
  })

  const setVisible = (v: 'visible' | 'hidden') => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: v })
    document.dispatchEvent(new Event('visibilitychange'))
  }

  it('there is no periodic write: an idle open tab does not change the stored record', () => {
    const app = mountApp()
    record(app, mkResult({ activityId: 'topic:a' }))
    const written = localStorage.getItem(KEYS.current)
    act(() => void vi.advanceTimersByTime(10 * 60_000)) // ten minutes of nothing
    expect(localStorage.getItem(KEYS.current)).toBe(written)
    expect(app.ctx.state.studySeconds).toBe(0)
  })

  it('active time is flushed when the tab is hidden (and persisted), idle time is not counted', () => {
    const app = mountApp()
    act(() => void vi.advanceTimersByTime(30_000)) // 30 s after opening: active
    window.dispatchEvent(new Event('pointerdown'))
    act(() => void vi.advanceTimersByTime(20_000))
    act(() => setVisible('hidden')) // 50 s of activity
    expect(app.ctx.state.studySeconds).toBe(50)
    expect(storedRecord().progress.studySeconds).toBe(50)
    act(() => void vi.advanceTimersByTime(30 * 60_000)) // 30 minutes hidden
    act(() => setVisible('visible'))
    act(() => setVisible('hidden'))
    expect(app.ctx.state.studySeconds).toBe(50)
  })

  it('a long idle stretch inside a visible tab counts at most one idle window', () => {
    const app = mountApp()
    act(() => void vi.advanceTimersByTime(20 * 60_000)) // 20 minutes without interaction
    act(() => setVisible('hidden'))
    expect(app.ctx.state.studySeconds).toBe(60)
  })

  it('pagehide flushes synchronously', () => {
    const app = mountApp()
    act(() => void vi.advanceTimersByTime(25_000))
    act(() => void window.dispatchEvent(new Event('pagehide')))
    expect(storedRecord().progress.studySeconds).toBe(25)
    expect(app.ctx.state.studySeconds).toBe(25)
  })

  it('recording a result flushes the accumulated time in the same update', () => {
    const app = mountApp()
    act(() => void vi.advanceTimersByTime(12_000))
    record(app, mkResult({ activityId: 'topic:a' }))
    expect(app.ctx.state.studySeconds).toBe(12)
    expect(storedRecord().progress.studySeconds).toBe(12)
  })

  it('a flush adds each second exactly once (hide, show, hide again)', () => {
    const app = mountApp()
    act(() => void vi.advanceTimersByTime(10_000))
    act(() => setVisible('hidden'))
    act(() => setVisible('visible'))
    act(() => void vi.advanceTimersByTime(5_000))
    act(() => setVisible('hidden'))
    expect(app.ctx.state.studySeconds).toBe(15)
  })

  it('every interaction type extends the window (pointer, key, touch, wheel, scroll)', () => {
    const app = mountApp()
    for (const e of ['pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll']) {
      act(() => void vi.advanceTimersByTime(50_000))
      window.dispatchEvent(new Event(e))
    }
    act(() => setVisible('hidden'))
    expect(app.ctx.state.studySeconds).toBe(250)
  })

  it('the activeMs of a result is measured from the attempt start, not from wall-clock time', () => {
    const app = mountApp()
    act(() => void vi.advanceTimersByTime(5 * 60_000)) // five idle minutes before the attempt starts
    const results: number[] = []
    app.ctx.timer.mark()
    const start = app.ctx.timer.mark()
    act(() => void vi.advanceTimersByTime(30_000)) // 30 s of idle-limited time: still within no window → 0 active (window long over)
    results.push(app.ctx.timer.mark() - start)
    expect(results[0]).toBe(0)
    window.dispatchEvent(new Event('pointerdown'))
    act(() => void vi.advanceTimersByTime(20_000))
    expect(app.ctx.timer.mark() - start).toBe(20_000)
  })
})

describe('audio playback counts as active time for its duration (05 §5)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 10, 12, 0, 0))
  })
  afterEach(() => {
    vi.useRealTimers()
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' })
  })

  function Player({ playing }: { playing: boolean }) {
    useKeepActive(playing)
    return null
  }
  let ctx!: ReturnType<typeof useApp>
  const Probe = () => {
    ctx = useApp()
    return null
  }
  const mount = (playing: boolean) =>
    render(
      <AppProvider>
        <Probe />
        <Player playing={playing} />
      </AppProvider>,
    )
  const hide = () => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' })
    act(() => void document.dispatchEvent(new Event('visibilitychange')))
  }

  it('five minutes of playback WITHOUT any tap count as study time', () => {
    mount(true)
    act(() => void vi.advanceTimersByTime(5 * 60_000))
    hide()
    expect(ctx.state.studySeconds).toBe(300)
  })

  it('the same five minutes without playback count only one idle window', () => {
    mount(false)
    act(() => void vi.advanceTimersByTime(5 * 60_000))
    hide()
    expect(ctx.state.studySeconds).toBe(60)
  })

  it('when playback stops the idle window starts: playing 2 minutes then idling 10 counts 2 + 1 minutes', () => {
    const view = mount(true)
    act(() => void vi.advanceTimersByTime(2 * 60_000))
    view.rerender(
      <AppProvider>
        <Probe />
        <Player playing={false} />
      </AppProvider>,
    )
    act(() => void vi.advanceTimersByTime(10 * 60_000))
    hide()
    // the provider is kept across the re-render; playback touched the tab up to the 2-minute mark, then one idle window (60 s) follows
    expect(ctx.state.studySeconds).toBe(180)
  })

  it('playback in a HIDDEN tab never counts', () => {
    mount(true)
    act(() => void vi.advanceTimersByTime(10_000))
    hide()
    const before = ctx.state.studySeconds
    act(() => void vi.advanceTimersByTime(10 * 60_000))
    expect(ctx.state.studySeconds).toBe(before)
  })
})
