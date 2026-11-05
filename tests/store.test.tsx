import { describe, expect, it } from 'vitest'
import { KEYS } from '../src/storage/persistence'
import { mkResult, mountApp, quizResult, record, stored, storedRecord } from './helpers'

/** Behaviour of the real store actions (src/app/store.tsx) as the screens use them. XP and completion change ONLY through `record`. */

const lesson = (id: string, over = {}) => mkResult({ activityId: `topic:${id}`, kind: 'lesson', ...over })

describe('store: completion (repeat protection)', () => {
  it('a completion key is recorded once, however often the activity is reported', () => {
    const app = mountApp()
    record(app, mkResult({ activityId: 'vocab-study:1', kind: 'vocabulary-study', completes: ['1:vocabulary'] }))
    record(app, mkResult({ activityId: 'vocab-study:1', kind: 'vocabulary-study', completes: ['1:vocabulary'] }))
    record(app, lesson('artikel'))
    expect(app.ctx.state.completed).toEqual(['1:vocabulary', 'topic:artikel'])
    expect(stored().completed).toEqual(['1:vocabulary', 'topic:artikel'])
  })

  it('completing marks today as an active day, once', () => {
    const app = mountApp()
    record(app, mkResult({ kind: 'vocabulary-study', activityId: 'vocab-study:1', completes: ['1:grammar'] }))
    record(app, mkResult({ kind: 'vocabulary-study', activityId: 'vocab-study:2', completes: ['1:listening'] }))
    expect(app.ctx.state.activeDates).toHaveLength(1)
  })

  it('a replayed result (same resultId) does not touch the state at all (same object identity, nothing written)', () => {
    const app = mountApp()
    const r = lesson('x')
    record(app, r)
    const before = app.ctx.state
    const written = localStorage.getItem(KEYS.current)
    record(app, r)
    expect(app.ctx.state).toBe(before)
    expect(localStorage.getItem(KEYS.current)).toBe(written)
  })
})

describe('store: XP is idempotent (engine + ledger)', () => {
  it('XP accumulates over DIFFERENT activities and marks the day active', () => {
    const app = mountApp()
    record(app, lesson('a')) // lesson: 20
    record(app, quizResult('x', 1)) // 5 for the item, no bonus unless passed → participation quiz passes → +10
    expect(app.ctx.state.xp).toBe(20 + 5 + 10)
    expect(app.ctx.state.activeDates).toHaveLength(1)
  })

  it('repeating the same activity (new attempt, new resultId) does not pay again', () => {
    const app = mountApp()
    for (let i = 0; i < 3; i++) record(app, lesson('artikel'))
    expect(app.ctx.state.completed).toEqual(['topic:artikel'])
    expect(app.ctx.state.xp).toBe(20)
    expect(storedRecord().credit.entries).toHaveLength(1)
  })

  it('a double-fired finish handler (same resultId, one batch) pays once', () => {
    const app = mountApp()
    const r = lesson('speak-test')
    app.act(() => {
      app.ctx.actions.record(r)
      app.ctx.actions.record(r)
    })
    expect(app.ctx.state.xp).toBe(20)
  })

  it('invalid results change nothing (unknown course, bad score, missing id, negative time)', () => {
    const app = mountApp()
    for (const bad of [
      mkResult({ courseId: 'en-general' }),
      mkResult({ score: { earned: 5, possible: 2 } }),
      mkResult({ resultId: '' }),
      mkResult({ activeMs: -1 }),
      mkResult({ items: [{ itemRef: '', outcome: 'correct' }] }),
      { ...mkResult(), kind: 'bogus' } as never,
      null as never,
    ]) {
      const out = record(app, bad)
      expect(out.applied).toBe(false)
      expect(out.reason).toBe('invalid')
    }
    expect(app.ctx.state.xp).toBe(0)
    expect(storedRecord()).toBeNull()
  })

  it('per-item credit: a repeated question pays nothing, a new one pays', () => {
    const app = mountApp()
    record(app, quizResult('a', 2, 2, { activityId: 'quiz:set1' }))
    expect(app.ctx.state.xp).toBe(2 * 5 + 10)
    record(app, quizResult('a', 2, 2, { activityId: 'quiz:set1' })) // same items & activity
    expect(app.ctx.state.xp).toBe(20)
    record(
      app,
      mkResult({
        activityId: 'quiz:set2',
        kind: 'quiz',
        items: [
          { itemRef: 'q:a1', outcome: 'correct' },
          { itemRef: 'q:b1', outcome: 'correct' },
        ],
        score: { earned: 2, possible: 2 },
      }),
    )
    expect(app.ctx.state.xp).toBe(20 + 5 + 10) // only q:b1 and the new activity's bonus
  })

  it('a word first heard wrongly (1 XP) and later correctly (3 XP) pays the difference once', () => {
    const app = mountApp()
    const word = (outcome: 'correct' | 'incorrect') =>
      mkResult({ activityId: 'word-practice:w1', kind: 'word-practice', items: [{ itemRef: 'word:w1', outcome }] })
    record(app, word('incorrect'))
    expect(app.ctx.state.xp).toBe(1)
    record(app, word('correct'))
    expect(app.ctx.state.xp).toBe(3)
    record(app, word('correct'))
    expect(app.ctx.state.xp).toBe(3)
  })

  it('the first-completion bonus is paid on the first PASS only (a failed assessment pays no bonus, a later pass does, then never again)', () => {
    const app = mountApp()
    const test = (correct: number) => quizResult('t', correct, 10, { activityId: 'test:t', kind: 'assessment', completes: ['3:test'] })
    record(app, test(3)) // 30 % → item credit only
    const afterFail = app.ctx.state.xp
    expect(afterFail).toBe(3 * 5)
    record(app, test(9)) // 90 % → 6 more items + bonus 10
    expect(app.ctx.state.xp).toBe(afterFail + 6 * 5 + 10)
    const afterPass = app.ctx.state.xp
    record(app, test(10))
    expect(app.ctx.state.xp).toBe(afterPass + 1 * 5) // only the one item never credited before; no second bonus
  })

  it('XP survives a restart exactly once: reload does not re-credit and replays after reload are still no-ops', () => {
    const first = mountApp()
    const r = lesson('a')
    record(first, r)
    first.unmount()
    const second = mountApp()
    expect(second.ctx.state.xp).toBe(20)
    record(second, r) // the same resultId, after a restart
    record(second, lesson('a')) // a fresh attempt at the same activity
    expect(second.ctx.state.xp).toBe(20)
    record(second, lesson('b'))
    expect(second.ctx.state.xp).toBe(40)
  })

  it('progress.xp always equals the sum of the ledger', () => {
    const app = mountApp()
    for (const r of [lesson('a'), quizResult('x', 3), lesson('a'), quizResult('x', 3), lesson('b')]) record(app, r)
    const sum = storedRecord().credit.entries.reduce((a: number, e: { xp: number }) => a + e.xp, 0)
    expect(app.ctx.state.xp).toBe(sum)
    expect(stored().xp).toBe(sum)
  })

  it('the engine, not the screens, owns XP and completion: addXp / complete no longer exist on the public actions', () => {
    const app = mountApp()
    expect('addXp' in app.ctx.actions).toBe(false)
    expect('complete' in app.ctx.actions).toBe(false)
    expect(typeof app.ctx.actions.record).toBe('function')
  })
})

describe('store: vocabulary mastery and scores (unchanged behaviour)', () => {
  it('answerVocab applies the SRS transition per answer', () => {
    const app = mountApp()
    app.act(() => app.ctx.actions.answerVocab('w1', true))
    app.act(() => app.ctx.actions.answerVocab('w1', true))
    expect(app.ctx.state.mastery.w1.box).toBe(2)
    expect(app.ctx.state.mastery.w1.seen).toBe(2)
    app.act(() => app.ctx.actions.answerVocab('w1', false))
    expect(app.ctx.state.mastery.w1.wrong).toBe(1)
  })

  it('addScore rounds and keeps the latest 30 per skill', () => {
    const app = mountApp()
    for (let i = 0; i < 35; i++) app.act(() => app.ctx.actions.addScore('grammar', i + 0.4))
    const g = app.ctx.state.scores.grammar
    expect(g).toHaveLength(30)
    expect(g[29]).toBe(34)
    expect(g[0]).toBe(5)
  })

  it('addMistake stamps a time and keeps the latest 300; addTest keeps the latest 50', () => {
    const app = mountApp()
    for (let i = 0; i < 305; i++) app.act(() => app.ctx.actions.addMistake({ kind: 'grammar', ref: `r${i}` }))
    expect(app.ctx.state.mistakes).toHaveLength(300)
    expect(app.ctx.state.mistakes[0].ref).toBe('r5')
    expect(typeof app.ctx.state.mistakes[0].at).toBe('number')
    for (let i = 0; i < 52; i++) app.act(() => app.ctx.actions.addTest({ id: `t${i}`, at: i, pct: 50, weak: [], strong: [] }))
    expect(app.ctx.state.tests).toHaveLength(50)
  })

  it('mastery is reproducible from the persisted record (restart keeps every SRS field)', () => {
    const first = mountApp()
    first.act(() => first.ctx.actions.answerVocab('w1', true))
    first.act(() => first.ctx.actions.answerVocab('w1', false))
    const mastery = first.ctx.state.mastery
    first.unmount()
    expect(mountApp().ctx.state.mastery).toEqual(mastery)
  })
})

describe('store: profile, saved words, daily, reset', () => {
  it('toggleSaved adds then removes', () => {
    const app = mountApp()
    app.act(() => app.ctx.actions.toggleSaved('w1'))
    expect(app.ctx.state.saved).toEqual(['w1'])
    app.act(() => app.ctx.actions.toggleSaved('w1'))
    expect(app.ctx.state.saved).toEqual([])
  })

  it('setProfile changes language, theme and the document attributes (and stamps the settings time for cross-tab last-writer-wins)', () => {
    const app = mountApp()
    app.act(() => app.ctx.actions.setProfile({ lang: 'ky', theme: 'dark' }))
    expect(app.ctx.lang).toBe('ky')
    expect(document.documentElement.lang).toBe('ky')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    expect(storedRecord().settingsAt).toBeGreaterThan(0)
    app.act(() => app.ctx.actions.setProfile({ theme: 'auto' }))
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false)
  })

  it('setDaily merges into the day record', () => {
    const app = mountApp()
    app.act(() => app.ctx.actions.setDaily('2025-01-10', { speaking: true }))
    app.act(() => app.ctx.actions.setDaily('2025-01-10', { vocab: [2, 3] }))
    expect(app.ctx.state.daily['2025-01-10']).toEqual({
      date: '2025-01-10',
      vocab: [2, 3],
      grammar: [0, 0],
      listening: [0, 0],
      speaking: true,
    })
  })

  it('tutor history is capped at 60 messages and clearable', () => {
    const app = mountApp()
    app.act(() => app.ctx.actions.pushTutor(Array.from({ length: 70 }, (_, i) => ({ id: `m${i}`, role: 'user' as const, text: 'x' }))))
    expect(app.ctx.state.tutor.messages).toHaveLength(60)
    app.act(() => app.ctx.actions.clearTutor())
    expect(app.ctx.state.tutor.messages).toEqual([])
  })

  it('reset (explicit learner action) starts over — but first keeps an exact backup copy of the record, and the legacy key is untouched', () => {
    localStorage.setItem(KEYS.legacy, '{"xp":7}')
    const app = mountApp()
    record(app, lesson('k'))
    const xpBeforeReset = app.ctx.state.xp
    app.act(() => app.ctx.actions.reset())
    expect(app.ctx.state.xp).toBe(0)
    expect(stored().xp).toBe(0)
    expect(storedRecord().credit.entries).toEqual([]) // credit starts over too: items can be earned again
    expect(storedRecord().epoch).toBeGreaterThan(0) // other tabs adopt the reset instead of merging old data back
    const copies = Object.entries(localStorage).filter(([k]) => k.startsWith(KEYS.backup))
    // S1: the copy is ONE record in the monolith format holding the whole state (course + preferences + tutor)
    expect(copies.some(([, v]) => JSON.parse(v).progress?.xp === xpBeforeReset && JSON.parse(v).progress?.tutor !== undefined)).toBe(true)
    expect(localStorage.getItem(KEYS.legacy)).toBe('{"xp":7}')
  })
})
