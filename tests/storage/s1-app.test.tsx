import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { STORAGE_MESSAGES } from '../../src/app/storage-messages'
import { AppProvider, useApp } from '../../src/app/store'
import { StorageNotice } from '../../src/app/StorageNotice'
import { KEYS } from '../../src/storage/persistence'
import { faultyKV, memoryKV } from './fakes'
import { mkResult, rawRecord } from '../helpers'

/** S1 through the REAL provider: write isolation, cross-tab per record, reset refusal, the low-priority notice. */
type Tab = { ctx: () => ReturnType<typeof useApp>; unmount: () => void }
function openTab(kv?: Parameters<typeof AppProvider>[0]['kv'], withNotice = false): Tab {
  let ctx!: ReturnType<typeof useApp>
  const Probe = () => {
    ctx = useApp()
    return null
  }
  const view = render(
    <AppProvider kv={kv}>
      <Probe />
      {withNotice && <StorageNotice />}
    </AppProvider>,
  )
  return { ctx: () => ctx, unmount: view.unmount }
}
const event = (key: string | null) => act(() => void window.dispatchEvent(new StorageEvent('storage', { key, storageArea: localStorage })))
let spy: ReturnType<typeof vi.spyOn>
const keysWritten = () => spy.mock.calls.map(c => String(c[0]))

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date(2026, 0, 10, 12, 0, 0))
  spy = vi.spyOn(Storage.prototype, 'setItem')
})
afterEach(() => {
  spy.mockRestore()
  vi.useRealTimers()
})
const tick = (ms = 10) => vi.setSystemTime(Date.now() + ms)

describe('S1 write isolation through the app', () => {
  it('profile -> preferences only; tutor -> tutor only; result -> course record only', () => {
    const t = openTab()
    act(() => t.ctx().actions.setProfile({ name: 'Mira' }))
    expect(new Set(keysWritten())).toEqual(new Set([KEYS.current, KEYS.prefs, KEYS.tutor])) // first save creates all three
    spy.mockClear()
    tick()
    act(() => t.ctx().actions.setProfile({ theme: 'dark' }))
    expect(keysWritten()).toEqual([KEYS.prefs])
    spy.mockClear()
    tick()
    act(() => t.ctx().actions.pushTutor([{ id: 'u1', role: 'user', text: 'Hallo' }]))
    expect(keysWritten()).toEqual([KEYS.tutor])
    spy.mockClear()
    tick()
    act(() => void t.ctx().actions.record(mkResult({ activityId: 'topic:x', kind: 'lesson' })))
    // S2: a recorded attempt writes the HISTORY record first and then the course record (design §3.3); nothing else
    expect(keysWritten()).toEqual([KEYS.results, KEYS.current])
    expect(keysWritten()).not.toContain(KEYS.legacy)
  })
})

describe('S1 cross-tab, per record', () => {
  it('a preference change in tab A reaches tab B through the preferences key; B writes nothing back', () => {
    const a = openTab()
    const b = openTab()
    act(() => a.ctx().actions.setProfile({ theme: 'dark' }))
    spy.mockClear()
    event(KEYS.prefs)
    expect(b.ctx().state.theme).toBe('dark')
    expect(keysWritten()).toEqual([])
  })

  it('clearing the tutor in tab A is not undone by tab B’s older copy', () => {
    const a = openTab()
    const b = openTab()
    act(() => a.ctx().actions.pushTutor([{ id: 'u1', role: 'user', text: 'x' }]))
    event(KEYS.tutor)
    expect(b.ctx().state.tutor.messages).toHaveLength(1)
    tick()
    act(() => a.ctx().actions.clearTutor())
    event(KEYS.tutor)
    expect(b.ctx().state.tutor.messages).toEqual([])
    expect(rawRecord(KEYS.tutor).messages).toEqual([])
  })

  it('a reset in tab A wins over a pending preference edit in tab B: B’s stale slice is never stored', () => {
    const a = openTab()
    const b = openTab()
    act(() => a.ctx().actions.setProfile({ name: 'Mira' }))
    event(KEYS.prefs)
    event(KEYS.current)
    tick()
    act(() => void expect(a.ctx().actions.reset()).toBe('done'))
    const epoch = rawRecord(KEYS.current).epoch
    expect(epoch).toBeGreaterThan(0)
    tick()
    act(() => b.ctx().actions.setProfile({ name: 'Stale edit' })) // B has not seen the reset yet
    expect(rawRecord(KEYS.current).epoch).toBe(epoch)
    expect(rawRecord(KEYS.prefs).name).not.toBe('Stale edit')
    expect(b.ctx().state.name).not.toBe('Stale edit') // B adopted the reset
  })
})

describe('S1 reset needs a safety copy (STO-17)', () => {
  it('reset returns false and changes nothing when the copy cannot be written', () => {
    const base = memoryKV()
    const t = openTab(faultyKV(base, { set: k => (k.startsWith(KEYS.backup) ? 'quota' : false) }))
    act(() => t.ctx().actions.setProfile({ name: 'Mira' }))
    let out = ''
    act(() => void (out = t.ctx().actions.reset()))
    expect(out).toBe('no-snapshot') // S2: reset reports WHY it was refused (STO-17); nothing was changed
    expect(t.ctx().state.name).toBe('Mira')
    expect(JSON.parse(base.get(KEYS.prefs)!).name).toBe('Mira')
  })
})

describe('S1 low-priority notice for a damaged preferences / tutor record', () => {
  it.each(['ru', 'ky', 'de'] as const)('shows the %s text, is dismissible, and never opens the recovery screen', lang => {
    const kv = memoryKV()
    const t0 = openTab(kv)
    act(() => t0.ctx().actions.setProfile({ name: 'Mira', lang }))
    t0.unmount()
    kv.m.set(KEYS.tutor, '{broken')
    openTab(kv, true)
    const m = STORAGE_MESSAGES[lang]
    const note = screen.getByTestId('slice-notice')
    expect(note.textContent).toContain(m.slice.damaged.replace('{name}', m.slice.names.tutor))
    expect(screen.queryByRole('dialog')).toBeNull()
    act(() => screen.getByRole('button', { name: m.close }).click())
    expect(screen.queryByTestId('slice-notice')).toBeNull()
  })
})
