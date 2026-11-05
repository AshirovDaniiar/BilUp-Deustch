import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { dictionaries } from '../../src/i18n'
import { FAILURE_KINDS, STORAGE_MESSAGES } from '../../src/app/storage-messages'
import { AppProvider, useApp } from '../../src/app/store'
import { StorageNotice } from '../../src/app/StorageNotice'
import { freshCore } from '../../src/storage/core'
import { KEYS, loadProgress, saveProgress, serializeCoreLayout1, startFresh } from '../../src/storage/persistence'
import { serializePrefs, serializeTutor } from '../../src/storage/slices'
import { faultyKV, memoryKV } from './fakes'
import { mkResult } from '../helpers'

/** S2 through the REAL provider and notice: persistent failure notices, episode-scoped dismissal, pending history, flush, reset, wording. */
let ctx!: ReturnType<typeof useApp>
const Probe = () => {
  ctx = useApp()
  return null
}
const mount = (kv?: Parameters<typeof AppProvider>[0]['kv']) =>
  render(
    <AppProvider kv={kv}>
      <Probe />
      <StorageNotice />
    </AppProvider>,
  )
const R = STORAGE_MESSAGES.ru
const lesson = (id: string) => mkResult({ resultId: id, activityId: `topic:${id}`, kind: 'lesson', startedAt: Date.now() - 100, finishedAt: Date.now() })
const record = (id: string) => act(() => void ctx.actions.record(lesson(id)))
const closeBtn = () => screen.queryByRole('button', { name: R.close })
const retryBtn = () => screen.queryByTestId('notice-retry')
const kindNow = () => screen.queryByTestId('storage-notice')?.getAttribute('data-kind') ?? null
const results = (kv: { get(k: string): string | null }) => (kv.get(KEYS.results) === null ? [] : (JSON.parse(kv.get(KEYS.results)!).results as { resultId: string }[]).map(r => r.resultId))

beforeEach(() => {
  // the fixtures' default language is Russian
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 0, 10, 12, 0, 0))
})
afterEach(() => vi.useRealTimers())

describe('failure notices are persistent; informational notices are dismissible per episode (STO-100, STO-94)', () => {
  it('history-not-saved: shown with the count, a loss warning and a retry; NO dismiss control while it lasts; clears after a successful retry', () => {
    const base = memoryKV()
    let failResults = false
    const kv = faultyKV(base, { set: k => (failResults && k === KEYS.results ? 'quota' : false) })
    mount(kv)
    record('ok1') // healthy
    expect(kindNow()).toBeNull()
    failResults = true
    tick()
    record('pend1')
    tick()
    record('pend2')
    expect(kindNow()).toBe('history-not-saved')
    const note = screen.getByTestId('storage-notice')
    expect(note.getAttribute('data-persistent')).toBe('true')
    expect(note.textContent).toContain('2') // the pending count
    expect(note.textContent).toContain('закрытии или перезагрузке') // "may be lost on closing or reloading"
    expect(closeBtn()).toBeNull() // cannot be dismissed
    expect(retryBtn()).not.toBeNull() // retry offered
    expect(ctx.storage.historyPending).toBe(2)
    expect(results(base)).toEqual(['ok1']) // nothing was lost from the stored history, nothing pretended
    // credit is saved by the core regardless (STO-80)
    expect(JSON.parse(base.get(KEYS.current)!).activity.tombstones.map((t: { resultId: string }) => t.resultId)).toEqual(expect.arrayContaining(['pend1', 'pend2']))
    failResults = false
    act(() => void fireEvent.click(retryBtn()!))
    expect(kindNow()).toBeNull()
    expect(results(base).sort()).toEqual(['ok1', 'pend1', 'pend2'])
  })

  it('save-failed: persistent, warns about closing/reloading, retry offered; cannot be dismissed', () => {
    const base = memoryKV()
    let fail = false
    mount(faultyKV(base, { set: () => (fail ? 'unavailable' : false) }))
    record('a')
    fail = true
    tick()
    record('b')
    expect(kindNow()).toBe('save-failed')
    expect(screen.getByTestId('storage-notice').textContent).toContain('закрытии или перезагрузке')
    expect(closeBtn()).toBeNull()
    expect(retryBtn()).not.toBeNull()
    expect(FAILURE_KINDS).toEqual(['save-failed', 'history-not-saved', 'history-readonly'])
  })

  it('history-readonly (newer-version record): persistent, entries stay in memory, record never rewritten', () => {
    const base = memoryKV()
    const c = freshCore()
    saveProgress(base, c, 1)
    const future = JSON.stringify({ record: 'results', v: 9, results: [] })
    base.m.set(KEYS.results, future)
    mount(base)
    record('q1')
    expect(kindNow()).toBe('history-readonly')
    expect(closeBtn()).toBeNull()
    expect(base.get(KEYS.results)).toBe(future)
    expect(ctx.storage.historyPending).toBe(1)
  })

  it('an informational notice is dismissible; a NEW failure shows even though it was dismissed; the dismissed notice is re-armed by the new episode', () => {
    // a core that needs a repair → the informational "repaired" notice
    const base = memoryKV()
    saveProgress(base, freshCore(), 1)
    const rec = JSON.parse(base.get(KEYS.current)!)
    rec.progress.xp = '12abc' // coerced and reported → quarantine + "repaired"
    base.m.set(KEYS.current, JSON.stringify(rec))
    let fail = false
    mount(faultyKV(base, { set: () => (fail ? 'unavailable' : false) }))
    expect(kindNow()).toBe('repaired')
    act(() => void fireEvent.click(closeBtn()!))
    expect(kindNow()).toBeNull() // dismissed for this episode
    fail = true
    tick()
    record('x')
    expect(kindNow()).toBe('save-failed') // a new failure is visible although a notice was dismissed before
    fail = false
    act(() => void fireEvent.click(retryBtn()!))
    // the new episode re-armed the informational notice as well
    expect(kindNow()).toBe('repaired')
    act(() => void fireEvent.click(closeBtn()!))
    expect(kindNow()).toBeNull()
  })
})

describe('best-effort flush (STO-97)', () => {
  it('pagehide writes pending history even when NO study seconds accrued; it never throws when storage is unavailable', () => {
    const base = memoryKV()
    let fail = true
    mount(faultyKV(base, { set: k => (fail && k === KEYS.results ? 'quota' : false) }))
    record('f1')
    expect(ctx.storage.historyPending).toBe(1)
    expect(results(base)).toEqual([])
    // storage unavailable at pagehide: no throw, nothing persisted
    expect(() => act(() => void window.dispatchEvent(new Event('pagehide')))).not.toThrow()
    expect(results(base)).toEqual([])
    // storage recovers; the next pagehide (still zero study seconds, nothing else changed) persists the pending entry
    fail = false
    act(() => void window.dispatchEvent(new Event('pagehide')))
    expect(results(base)).toEqual(['f1'])
    expect(ctx.storage.historyPending).toBe(0)
  })
})

describe('stale-epoch conflict notice (STO-95)', () => {
  it('a tab whose unsaved attempt was discarded by another tab\'s replacement says: kept in history, XP not part of current progress', () => {
    const kv = memoryKV()
    mount(kv)
    record('s0') // persisted
    // another tab starts fresh: the core is replaced (higher epoch); the history is untouched
    act(() => void startFresh(kv, { now: Date.now() + 10 }))
    tick()
    record('late') // this tab still holds the old epoch
    expect(ctx.storage.replacedNotice).toBe(true)
    expect(kindNow()).toBe('replaced')
    const text = screen.getByTestId('storage-notice').textContent!
    expect(text).toContain('сохранена в истории')
    expect(text).toContain('не входит в текущий прогресс')
    expect(ctx.state.xp).toBe(0) // no XP: the replacement wins
    expect(results(kv)).toEqual(expect.arrayContaining(['s0', 'late'])) // the attempt is kept
    // it is NOT a storage failure and it IS dismissible (informational)
    expect(screen.getByTestId('storage-notice').getAttribute('data-persistent')).toBe('false')
    act(() => void fireEvent.click(closeBtn()!))
    expect(kindNow()).toBeNull()
  })
})

describe('F2 (real-browser finding): the replaced notice is also raised by Retry', () => {
  /** s0 persisted; the write of `late` fails (save-failed); another tab then starts fresh and THIS tab never receives the storage event */
  const stale = () => {
    const base = memoryKV()
    let fail = false
    mount(faultyKV(base, { set: () => (fail ? 'unavailable' : false) }))
    record('s0')
    fail = true
    tick()
    record('late')
    expect(kindNow()).toBe('save-failed')
    act(() => void startFresh(base, { now: Date.now() + 10 })) // the other tab's replacement; no event reaches this tab
    fail = false
    return { base, setFail: (v: boolean) => (fail = v) }
  }

  it('missed storage event, then Retry: replaced notice shown; attempt kept in Results; no XP without Core authorisation', () => {
    const { base } = stale()
    expect(ctx.storage.replacedNotice).toBe(false)
    act(() => void fireEvent.click(retryBtn()!))
    expect(ctx.storage.replacedNotice).toBe(true)
    expect(kindNow()).toBe('replaced')
    expect(screen.getByTestId('storage-notice').textContent).toContain('не входит в текущий прогресс')
    expect(ctx.state.xp).toBe(0)
    expect(JSON.parse(base.get(KEYS.current)!).progress.xp).toBe(0)
    expect(JSON.parse(base.get(KEYS.current)!).activity.tombstones.map((t: { resultId: string }) => t.resultId)).not.toContain('late')
    expect(results(base)).toEqual(expect.arrayContaining(['s0', 'late']))
  })

  it('a second Retry does not raise or re-arm the notice again; dismissal holds, and a LATER failure episode still shows', () => {
    const { base, setFail } = stale()
    act(() => void fireEvent.click(retryBtn()!))
    expect(kindNow()).toBe('replaced')
    act(() => void fireEvent.click(closeBtn()!))
    expect(kindNow()).toBeNull()
    expect(ctx.storage.replacedNotice).toBe(true)
    expect(retryBtn()).toBeNull() // no failure left to retry; nothing re-raises the notice
    expect(results(base)).toEqual(expect.arrayContaining(['s0', 'late']))
    // a later failure episode is shown although the earlier notice was dismissed
    setFail(true)
    tick()
    record('x2')
    expect(kindNow()).toBe('save-failed')
    setFail(false)
    act(() => void fireEvent.click(retryBtn()!))
    // STO-94: the new episode re-arms the informational notice (as for "repaired"); it is the SAME replacement, shown once, and dismissible
    expect(kindNow()).toBe('replaced')
    act(() => void fireEvent.click(closeBtn()!))
    expect(kindNow()).toBeNull()
  })
})

describe('Reset keeps the history; compatibility mode refuses it (STO-90, C5)', () => {
  it('reset: core starts over, the stored history is byte-identical and was not written', () => {
    const kv = memoryKV()
    mount(kv)
    record('h1')
    tick()
    record('h2')
    const before = kv.get(KEYS.results)
    const spy = vi.spyOn(Storage.prototype, 'setItem')
    let out = ''
    act(() => void (out = ctx.actions.reset()))
    expect(out).toBe('done')
    expect(ctx.state.xp).toBe(0)
    expect(kv.get(KEYS.results)).toBe(before)
    expect(spy.mock.calls.map(c => String(c[0]))).not.toContain(KEYS.results)
    expect(results(kv)).toEqual(['h1', 'h2'])
    spy.mockRestore()
  })

  it('compatibility mode: reset is refused BEFORE any write (zero setItem/removeItem on the store) and everything is intact', () => {
    const c = { ...freshCore() }
    const base = memoryKV({ [KEYS.current]: serializeCoreLayout1(c, 1), [KEYS.prefs]: serializePrefs(c), [KEYS.tutor]: serializeTutor(c) })
    // the layout-2 upgrade cannot complete: the backup write fails
    const kv = faultyKV(base, { set: k => (k.startsWith(KEYS.backup) ? 'quota' : false) })
    mount(kv)
    expect(ctx.storage.upgradePending).toBe(true)
    const snapshot = base.snapshot()
    base.log.length = 0
    let out = ''
    act(() => void (out = ctx.actions.reset()))
    expect(out).toBe('upgrade-pending')
    expect(base.log).toEqual([])
    expect(base.snapshot()).toEqual(snapshot)
    expect(loadProgress(base, { now: 5 }).report.layout).toBe('split') // when storage works the upgrade succeeds
  })

  it('the reset confirmation says the detailed history is kept and can only be deleted separately — in ru, ky and de', () => {
    expect(dictionaries.ru.resetConfirm).toMatch(/истори/i)
    expect(dictionaries.ru.resetConfirm).toMatch(/отдельн/i)
    expect(dictionaries.de.resetConfirm).toMatch(/Verlauf/)
    expect(dictionaries.de.resetConfirm).toMatch(/separate/i)
    expect(dictionaries.ky.resetConfirm).toMatch(/тарых/i)
    expect(dictionaries.ky.resetConfirm).toMatch(/өзүнчө/)
    // every storage message exists in all three languages
    for (const lang of ['ru', 'ky', 'de'] as const) {
      const m = STORAGE_MESSAGES[lang]
      for (const k of Object.keys(m.titles) as (keyof typeof m.titles)[]) {
        expect(m.titles[k].length).toBeGreaterThan(3)
        expect(m.bodies[k].length).toBeGreaterThan(10)
      }
      expect(m.upgradePendingRefusal.length).toBeGreaterThan(10)
      expect(m.retry.length).toBeGreaterThan(2)
    }
  })
})

function tick(ms = 10) {
  vi.setSystemTime(Date.now() + ms)
}
