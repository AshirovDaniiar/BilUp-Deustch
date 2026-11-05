import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AppProvider, useApp } from '../../src/app/store'
import { HomeScreen } from '../../src/screens/HomeScreen'
import { ProfileScreen } from '../../src/screens/ProfileScreen'
import { defaultProgress } from '../../src/storage/defaults'
import { KEYS } from '../../src/storage/persistence'
import { sanitizeProgress } from '../../src/storage/validate'
import { fixture, mkResult, storedRecord } from '../helpers'

let ctx!: ReturnType<typeof useApp>
const Probe = () => {
  ctx = useApp()
  return null
}
const mount = (ui?: React.ReactElement) =>
  render(
    <AppProvider>
      <Probe />
      {ui}
    </AppProvider>,
  )
const heading = () => screen.getByRole('heading', { level: 1 }).textContent ?? ''
const legacy = (o: object) => localStorage.setItem(KEYS.legacy, JSON.stringify(o))

afterEach(() => vi.restoreAllMocks())

describe('default name: no hard-coded personal name (V-15, 05 §10)', () => {
  it('a new profile starts with an EMPTY name — the neutral onboarding state', () => {
    expect(defaultProgress().name).toBe('')
    mount()
    expect(ctx.state.name).toBe('')
  })

  it('the home greeting has no comma and no name when none is set, and "Daniiar" appears nowhere', () => {
    mount(<HomeScreen />)
    const h = heading()
    expect(h).not.toContain(',')
    expect(h.trim().endsWith('👋')).toBe(true)
    expect(document.body.textContent).not.toContain('Daniiar')
  })

  it('once the learner sets a name the greeting uses it', () => {
    mount(<HomeScreen />)
    act(() => ctx.actions.setProfile({ name: 'Mira' }))
    expect(heading()).toContain(', Mira')
  })

  it('the profile field is empty for a new learner and editing it stores the name (and stamps the settings time)', () => {
    mount(<ProfileScreen />)
    const input = screen.getAllByRole('textbox')[0] as HTMLInputElement
    expect(input.value).toBe('')
    fireEvent.change(input, { target: { value: 'Aigerim' } })
    expect(ctx.state.name).toBe('Aigerim')
    expect(storedRecord().progress.name).toBe('Aigerim')
    expect(storedRecord().settingsAt).toBeGreaterThan(0)
  })

  it('validation: an empty or blank name is valid (no issue), a non-string is repaired', () => {
    expect(sanitizeProgress({ name: '' })!.issues).toEqual([])
    expect(sanitizeProgress({ name: '   ' })!.issues).toEqual([])
    expect(sanitizeProgress({ name: '   ' })!.value.name).toBe('')
    expect(sanitizeProgress({ name: 7 })!.issues).toHaveLength(1)
  })
})

describe('legacy placeholder name (05 §11)', () => {
  it('the old default "Daniiar" on a profile that was never used is cleared', () => {
    legacy({ name: 'Daniiar', lang: 'ru' })
    mount(<HomeScreen />)
    expect(ctx.state.name).toBe('')
    expect(heading()).not.toContain(',')
  })

  it('an empty legacy object also yields the empty name', () => {
    localStorage.setItem(KEYS.legacy, '{}')
    mount()
    expect(ctx.state.name).toBe('')
  })

  it.each([
    ['xp', { xp: 5 }],
    ['completed work', { completed: ['topic:a'] }],
    ['active days', { activeDates: ['2025-01-01'] }],
    ['practised words', { mastery: { w1: { box: 1, due: 0, seen: 1, wrong: 0 } } }],
    ['test history', { tests: [{ id: 't', at: 1, pct: 50, weak: [], strong: [] }] }],
  ])('the placeholder is KEPT when the profile has activity (%s) — it may have been the learner’s own choice', (_n, extra) => {
    legacy({ name: 'Daniiar', ...extra })
    mount()
    expect(ctx.state.name).toBe('Daniiar')
  })

  it('a personalised legacy name is always preserved, with or without activity', () => {
    legacy({ name: 'Aigerim' })
    mount()
    expect(ctx.state.name).toBe('Aigerim')
    localStorage.clear()
    legacy({ name: 'Aigerim', xp: 300, completed: ['topic:a'] })
    mount()
    expect(ctx.state.name).toBe('Aigerim')
  })

  it('the legacy bytes keep the original placeholder (the legacy key is never rewritten)', () => {
    const original = JSON.stringify({ name: 'Daniiar' })
    localStorage.setItem(KEYS.legacy, original)
    mount()
    expect(localStorage.getItem(KEYS.legacy)).toBe(original)
    expect(Object.values(localStorage)).toContain(original) // and the backup holds the exact original
  })

  it('a current record that already says "Daniiar" is NOT rewritten (the cleanup applies to legacy migration only)', () => {
    localStorage.setItem(
      KEYS.current,
      JSON.stringify({
        schemaVersion: 2,
        courseId: 'de-general',
        progress: { name: 'Daniiar' },
        credit: { entries: [] },
        extras: {},
        origin: null,
      }),
    )
    mount()
    expect(ctx.state.name).toBe('Daniiar')
  })
})

describe('stale PWA shell: an OLD app version keeps writing the legacy key after the new version migrated', () => {
  const ORIGINAL = fixture('legacy/v1-realistic.json')
  const base = JSON.parse(ORIGINAL)
  const staleWrite = (over: object) => localStorage.setItem(KEYS.legacy, JSON.stringify({ ...base, ...over }))
  const legacyEvent = () =>
    act(() => void window.dispatchEvent(new StorageEvent('storage', { key: KEYS.legacy, storageArea: localStorage })))
  const backups = () =>
    Object.entries(localStorage)
      .filter(([k]) => k.startsWith(KEYS.backup))
      .map(([, v]) => v)

  it('detected LIVE (storage event) and merged into the current record exactly once; the stale bytes are backed up', () => {
    localStorage.setItem(KEYS.legacy, ORIGINAL)
    mount()
    expect(ctx.state.xp).toBe(412)
    const stale = { xp: 450, completed: [...base.completed, 'topic:dativ'], studySeconds: 9000 }
    staleWrite(stale)
    legacyEvent()
    expect(ctx.state.xp).toBe(412 + 38)
    expect(ctx.state.completed).toContain('topic:dativ')
    expect(ctx.state.studySeconds).toBe(9000)
    expect(storedRecord().progress.xp).toBe(450)
    expect(backups()).toContain(JSON.stringify({ ...base, ...stale })) // the drifted bytes were preserved first
    expect(backups()).toContain(ORIGINAL) // the pristine pre-migration bytes too
    // exactly once: the same bytes again, and a restart, add nothing
    const record = localStorage.getItem(KEYS.current)
    legacyEvent()
    legacyEvent()
    expect(ctx.state.xp).toBe(450)
    expect(localStorage.getItem(KEYS.current)).toBe(record)
  })

  it('detected at the next start when the old shell wrote while no new tab was open', () => {
    localStorage.setItem(KEYS.legacy, ORIGINAL)
    mount().unmount()
    staleWrite({ xp: 470, completed: [...base.completed, 'topic:genitiv'] })
    mount()
    expect(ctx.storage.report.drift).toBe('merged')
    expect(ctx.state.xp).toBe(470)
    expect(ctx.state.completed).toContain('topic:genitiv')
    expect(storedRecord().origin.legacyXp).toBe(470)
  })

  it('A→B→A→B round trip: new, old, new, old, new — nothing earned anywhere is lost or counted twice', () => {
    localStorage.setItem(KEYS.legacy, ORIGINAL) // old build's data
    const first = mount() // NEW build migrates (412)
    act(() => void ctx.actions.record(mkResult({ activityId: 'topic:new1', kind: 'lesson' }))) // +20 in the new build
    first.unmount()
    // the OLD build is used again (e.g. a stale cached shell): it reads v1 (original 412) and adds 30 XP and a completion
    const oldBuildView = JSON.parse(localStorage.getItem(KEYS.legacy)!)
    expect(oldBuildView.xp).toBe(412) // it cannot see the new build's +20 (documented rollback behaviour)
    staleWrite({ xp: oldBuildView.xp + 30, completed: [...base.completed, 'topic:old1'] })
    mount() // the NEW build again
    expect(ctx.state.xp).toBe(412 + 20 + 30)
    expect(ctx.state.completed).toEqual(expect.arrayContaining(['topic:new1', 'topic:old1']))
    act(() => void ctx.actions.record(mkResult({ activityId: 'topic:new2', kind: 'lesson' })))
    // the OLD build once more (it still believes in xp 442 = its own last write)
    staleWrite({ xp: 442 + 10, completed: [...base.completed, 'topic:old1', 'topic:old2'] })
    legacyEvent()
    expect(ctx.state.xp).toBe(412 + 20 + 30 + 20 + 10)
    expect(ctx.state.completed).toEqual(expect.arrayContaining(['topic:new1', 'topic:new2', 'topic:old1', 'topic:old2']))
    expect(storedRecord().progress.xp).toBe(ctx.state.xp)
    expect(backups()).toContain(ORIGINAL)
  })

  it('the new version NEVER writes the legacy key — not on load, not on drift, not on reset', () => {
    localStorage.setItem(KEYS.legacy, ORIGINAL)
    const set = vi.spyOn(Storage.prototype, 'setItem')
    mount()
    staleWrite({ xp: 500 })
    legacyEvent()
    act(() => ctx.actions.reset())
    const writtenKeys = set.mock.calls.map(c => c[0])
    // the only writes to the legacy key are the test's own simulated old-shell write
    expect(writtenKeys.filter(k => k === KEYS.legacy)).toHaveLength(1)
  })

  it('rollback of the CODE: the old build sees the pre-migration data, the newer progress is safe in the current record, and re-deploying shows both', () => {
    localStorage.setItem(KEYS.legacy, ORIGINAL)
    const newBuild = mount()
    act(() => void ctx.actions.record(mkResult({ activityId: 'topic:after', kind: 'lesson' })))
    newBuild.unmount()
    expect(localStorage.getItem(KEYS.legacy)).toBe(ORIGINAL) // what an older build would read: unchanged
    expect(storedRecord().progress.xp).toBe(432) // what only the new build can see
    mount() // re-deploy
    expect(ctx.state.xp).toBe(432)
    expect(ctx.state.completed).toContain('topic:after')
  })

  it('an unreadable write by the old shell is preserved, reported, and does not disturb the current progress', () => {
    localStorage.setItem(KEYS.legacy, ORIGINAL)
    mount()
    localStorage.setItem(KEYS.legacy, '{half-written')
    legacyEvent()
    expect(ctx.state.xp).toBe(412)
    expect(backups()).toContain('{half-written')
  })

  it('old-shell drift is ignored by a read-only tab', () => {
    localStorage.setItem(KEYS.legacy, ORIGINAL)
    mount().unmount()
    localStorage.setItem(KEYS.current, JSON.stringify({ schemaVersion: 9, progress: {} }))
    mount()
    expect(ctx.storage.readOnly).toBe(true)
    staleWrite({ xp: 999 })
    legacyEvent()
    expect(ctx.state.xp).toBe(0)
  })
})
