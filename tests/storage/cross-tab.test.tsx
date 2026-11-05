import { act, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AppProvider, useApp } from '../../src/app/store'
import { fingerprint } from '../../src/storage/hash'
import { KEYS } from '../../src/storage/persistence'
import { fixture, mkResult, storedRecord } from '../helpers'

/**
 * Two (or three) app instances ("tabs") in ONE jsdom window sharing the same localStorage. Real browsers deliver the `storage` event to the
 * OTHER tabs only; jsdom delivers none, so the events are dispatched by hand — exactly what another tab's write would cause.
 * Nothing of our own code is mocked: every tab is the real AppProvider with the real persistence layer.
 */
type Tab = { ctx: () => ReturnType<typeof useApp>; unmount: () => void }
function openTab(): Tab {
  let ctx!: ReturnType<typeof useApp>
  const Probe = () => {
    ctx = useApp()
    return null
  }
  const view = render(
    <AppProvider>
      <Probe />
    </AppProvider>,
  )
  return { ctx: () => ctx, unmount: view.unmount }
}
const event = (key: string | null) => act(() => void window.dispatchEvent(new StorageEvent('storage', { key, storageArea: localStorage })))
const lesson = (id: string, over = {}) => mkResult({ activityId: `topic:${id}`, kind: 'lesson', ...over })
const rec = (t: Tab, r = lesson('x')) => act(() => void t.ctx().actions.record(r))
const stored = () => storedRecord().progress
const ids = () => storedRecord().credit.entries.map((e: { id: string }) => e.id)

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 0, 10, 12, 0, 0))
})
afterEach(() => vi.useRealTimers())
const tick = (ms = 10) => vi.setSystemTime(Date.now() + ms)

describe('cross-tab: tabs converge through the storage event', () => {
  it('a result recorded in tab A appears in tab B after the event, and B does not write it back', () => {
    const a = openTab()
    const b = openTab()
    rec(a, lesson('a'))
    expect(b.ctx().state.xp).toBe(0) // nothing yet: no event
    const writes = vi.spyOn(Storage.prototype, 'setItem')
    event(KEYS.current)
    expect(b.ctx().state.xp).toBe(20)
    expect(b.ctx().state.completed).toEqual(['topic:a'])
    expect(writes).not.toHaveBeenCalled() // B had nothing of its own to add
  })

  it('CONCURRENT updates: A and B each earn something different before seeing each other — nothing is lost, XP is the exact sum', () => {
    const a = openTab()
    const b = openTab()
    rec(a, lesson('a'))
    tick()
    rec(b, lesson('b')) // B's save finds a record it has never seen and MERGES instead of overwriting
    expect(stored().xp).toBe(40)
    expect([...stored().completed].sort()).toEqual(['topic:a', 'topic:b'])
    event(KEYS.current)
    expect(a.ctx().state.xp).toBe(40)
    expect(b.ctx().state.xp).toBe(40)
    expect(new Set(ids()).size).toBe(ids().length) // no duplicate ledger ids
  })

  it('three tabs earning concurrently converge to the same total', () => {
    const tabs = [openTab(), openTab(), openTab()]
    tabs.forEach((t, i) => {
      rec(t, lesson(`k${i}`))
      tick()
    })
    event(KEYS.current)
    event(KEYS.current)
    for (const t of tabs) expect(t.ctx().state.xp).toBe(60)
    expect(stored().xp).toBe(60)
  })

  it('the SAME activity completed in two tabs (different attempts) is credited once', () => {
    const a = openTab()
    const b = openTab()
    rec(a, lesson('same'))
    tick()
    rec(b, lesson('same'))
    event(KEYS.current)
    expect(stored().xp).toBe(20)
    expect(a.ctx().state.xp).toBe(20)
    expect(b.ctx().state.xp).toBe(20)
    expect(ids().filter((i: string) => i.startsWith('bonus:topic:same'))).toHaveLength(1)
  })

  it('the SAME attempt (same resultId) reported in two tabs is counted once', () => {
    const a = openTab()
    const b = openTab()
    const r = lesson('dup')
    rec(a, r)
    tick()
    rec(b, r)
    event(KEYS.current)
    expect(stored().xp).toBe(20)
    expect(storedRecord().activity.results.filter((x: { resultId: string }) => x.resultId === r.resultId)).toHaveLength(1)
  })

  it('mastery of the tab with more practice wins per word', () => {
    const a = openTab()
    const b = openTab()
    act(() => a.ctx().actions.answerVocab('w1', true))
    tick()
    act(() => b.ctx().actions.answerVocab('w1', true))
    tick()
    act(() => b.ctx().actions.answerVocab('w1', true))
    event(KEYS.current)
    // mastery is not additive: the state with more practice wins per word (A's single attempt is absorbed — documented approximation)
    expect(a.ctx().state.mastery.w1.seen).toBe(2)
    expect(b.ctx().state.mastery.w1.seen).toBeGreaterThanOrEqual(2)
  })
})

describe('cross-tab: local removals versus remote changes', () => {
  it('a removal in the only writing tab stays removed, even while another tab is open', () => {
    const a = openTab()
    openTab() // idle tab that never writes
    act(() => a.ctx().actions.toggleSaved('w1'))
    expect(stored().saved).toEqual(['w1'])
    tick()
    act(() => a.ctx().actions.toggleSaved('w1'))
    expect(stored().saved).toEqual([])
    event(KEYS.current)
    expect(stored().saved).toEqual([])
  })

  it('removal in A while B already holds the saved word: the idle tab does not resurrect it until it writes (documented limit)', () => {
    const a = openTab()
    const b = openTab()
    act(() => a.ctx().actions.toggleSaved('w1'))
    event(KEYS.current) // B now holds w1
    tick()
    act(() => a.ctx().actions.toggleSaved('w1')) // A removes it
    expect(stored().saved).toEqual([])
    // B is idle: it receives the event and merges (union) — which re-adds the word in B's memory …
    event(KEYS.current)
    // KNOWN LIMIT (05 §9 gives no removal semantics): a merge cannot tell "removed" from "not yet seen".
    expect(b.ctx().state.saved).toEqual(['w1'])
  })

  it('a RESET in tab A is adopted by tab B (higher epoch); B does not merge its old data back in', () => {
    const a = openTab()
    const b = openTab()
    rec(a, lesson('old'))
    event(KEYS.current)
    expect(b.ctx().state.xp).toBe(20)
    tick(2000)
    act(() => a.ctx().actions.reset())
    expect(stored().xp).toBe(0)
    event(KEYS.current)
    expect(b.ctx().state.xp).toBe(0)
    expect(b.ctx().state.completed).toEqual([])
    tick()
    rec(b, lesson('new'))
    expect(stored().xp).toBe(20)
    expect(stored().completed).toEqual(['topic:new'])
    // the pre-reset record was kept as a backup copy
    expect(Object.keys(localStorage).some(k => k.startsWith(KEYS.backup))).toBe(true)
  })

  it('settings are last-writer-wins as one group', () => {
    const a = openTab()
    const b = openTab()
    act(() => a.ctx().actions.setProfile({ lang: 'ky' }))
    tick(50)
    act(() => b.ctx().actions.setProfile({ theme: 'dark' })) // later: B's whole settings group wins (B never saw A's change)
    event(KEYS.current)
    expect(stored().theme).toBe('dark')
    expect(a.ctx().state.theme).toBe('dark')
    expect(stored().lang).toBe(b.ctx().state.lang)
  })
})

describe('cross-tab: unreadable or newer writers', () => {
  it('garbage written by another party is ignored by running tabs and quarantined (not lost) before the next save replaces it', () => {
    const a = openTab()
    rec(a, lesson('a'))
    localStorage.setItem(KEYS.current, '{"broken":')
    event(KEYS.current)
    expect(a.ctx().state.xp).toBe(20) // the tab keeps its state
    tick()
    rec(a, lesson('b'))
    expect(stored().xp).toBe(40)
    expect(Object.values(localStorage)).toContain('{"broken":') // preserved in quarantine
  })

  it('a record from a NEWER app version written meanwhile is never overwritten; the tab flips to read-only', () => {
    const a = openTab()
    rec(a, lesson('a'))
    const future = JSON.stringify({ schemaVersion: 9, progress: {} })
    localStorage.setItem(KEYS.current, future)
    tick()
    rec(a, lesson('b'))
    expect(localStorage.getItem(KEYS.current)).toBe(future)
    expect(a.ctx().storage.readOnly).toBe(true)
  })

  it('a read-only tab ignores storage events completely', () => {
    const future = JSON.stringify({ schemaVersion: 9, progress: {} })
    localStorage.setItem(KEYS.current, future)
    const a = openTab()
    const before = a.ctx().state
    event(KEYS.current)
    event(KEYS.legacy)
    event(null)
    expect(a.ctx().state).toBe(before)
    expect(localStorage.getItem(KEYS.current)).toBe(future)
  })

  it('unrelated keys never trigger a merge', () => {
    const a = openTab()
    const before = a.ctx().state
    event('some-other-app:key')
    expect(a.ctx().state).toBe(before)
  })
})

describe('concurrent MIGRATION of the same legacy record', () => {
  const LEGACY = fixture('legacy/v1-realistic.json')

  it('two tabs started on the same legacy data: XP is not doubled, one backup, legacy bytes untouched', () => {
    localStorage.setItem(KEYS.legacy, LEGACY)
    const a = openTab()
    const b = openTab() // B finds A's migrated record
    tick()
    rec(b, lesson('after'))
    event(KEYS.current)
    expect(a.ctx().state.xp).toBe(412 + 20)
    expect(stored().xp).toBe(432)
    const backups = Object.entries(localStorage).filter(([k]) => k.startsWith(KEYS.backup))
    expect(backups).toHaveLength(1)
    expect(backups[0][1]).toBe(LEGACY)
    expect(localStorage.getItem(KEYS.legacy)).toBe(LEGACY)
    const entryIds = ids()
    expect(entryIds.filter((i: string) => i === 'legacy-opening')).toHaveLength(1)
  })

  it('both tabs boot BEFORE either has written (the true race): the second migration adopts the first record and never overwrites it', () => {
    localStorage.setItem(KEYS.legacy, LEGACY)
    // B's boot reads an empty current record (stale view) while A migrates and then earns more XP
    const realGet = Storage.prototype.getItem
    let staleReads = 1 // only B's boot read of the current record is stale
    let phase: 'a' | 'b' = 'a'
    const a = openTab()
    tick()
    rec(a, lesson('earned-in-a'))
    const afterA = localStorage.getItem(KEYS.current)
    expect(JSON.parse(afterA!).progress.xp).toBe(432)
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(function (this: Storage, key: string) {
      if (phase === 'b' && key === KEYS.current && staleReads > 0) {
        staleReads--
        return null // the stale first read
      }
      return realGet.call(this, key)
    })
    phase = 'b'
    const b = openTab()
    expect(b.ctx().state.xp).toBe(432) // B adopted A's record instead of migrating over it
    expect(localStorage.getItem(KEYS.current)).toBe(afterA) // byte-identical: nothing was overwritten
    expect(a.ctx().state.xp).toBe(432)
  })

  it('migration races never lose the pristine backup and never touch the legacy key', () => {
    localStorage.setItem(KEYS.legacy, LEGACY)
    const tabs = [openTab(), openTab(), openTab()]
    tabs.forEach((t, i) => {
      rec(t, lesson(`t${i}`))
      tick()
    })
    event(KEYS.current)
    expect(localStorage.getItem(KEYS.legacy)).toBe(LEGACY)
    expect(Object.values(localStorage)).toContain(LEGACY)
    expect(stored().xp).toBe(412 + 60)
    const key = `${KEYS.backup}`
    expect(Object.keys(localStorage).filter(k => k.startsWith(key) && k.endsWith(fingerprint(LEGACY)))).toHaveLength(1)
  })
})
