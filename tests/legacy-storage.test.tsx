import { render } from '@testing-library/react'
import { StrictMode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { AppProvider, defaultState, useApp } from '../src/app/store'
import { KEYS } from '../src/storage/persistence'
import { CURRENT_KEY, KEY, fixture, mkResult, mountApp, record, stored, storedRecord } from './helpers'

const word = (id = 'k') =>
  mkResult({ activityId: `word-practice:${id}`, kind: 'word-practice', items: [{ itemRef: `word:${id}`, outcome: 'correct' }] }) // 3 XP

/**
 * How the REAL application (AppProvider, unchanged public API) reads the legacy `bilup-deutsch:v1` store after P1.
 * Algorithmic coverage of the loader lives in tests/storage/*; this file proves the wiring in the running provider.
 * Expectations that were KNOWN-GAP characterisations in P0 (overwrite on first mount, crash on wrong types, array leakage,
 * string-concatenated XP …) are deliberately flipped here — see docs/implementation/P1_PROGRESS_STORAGE_REPORT.md §9.
 */
const seed = (name: string) => localStorage.setItem(KEY, fixture(`legacy/${name}`))
const keysWith = (prefix: string) => Object.keys(localStorage).filter(k => k.startsWith(prefix))

describe('legacy store: valid shapes', () => {
  it('loads a complete v1 record unchanged; the legacy key is never modified; the migrated record preserves everything', () => {
    seed('v1-full.json')
    const before = localStorage.getItem(KEY)
    const app = mountApp()
    const original = JSON.parse(fixture('legacy/v1-full.json'))
    // S1: tutor messages without a time are stamped by position when read (the only difference from the legacy bytes)
    const stamp = (p: { tutor: { messages: object[] } }) => ({ ...p, tutor: { messages: p.tutor.messages.map((m, i) => ({ ...m, at: i + 1 })) } })
    expect(app.ctx.state).toEqual({ ...defaultState(), ...stamp(original) })
    expect(app.ctx.storage.report.status).toBe('migrated')
    expect(localStorage.getItem(KEY)).toBe(before)
    expect(stored()).toEqual(stamp(original))
  })

  it('fills missing top-level fields with defaults (minimal record)', () => {
    seed('v1-minimal.json')
    const app = mountApp()
    expect(app.ctx.state.name).toBe('Anna')
    expect(app.ctx.state.xp).toBe(50)
    expect(app.ctx.state.completed).toEqual([])
    expect(app.ctx.state.lang).toBe('ru')
    expect(app.ctx.state.tutor).toEqual({ messages: [] })
    expect(Object.keys(app.ctx.state.scores).sort()).toEqual(['grammar', 'listening', 'reading', 'speaking', 'vocabulary', 'writing'])
  })

  it('merges partially present score histories with empty defaults', () => {
    seed('v1-partial-scores.json')
    const s = mountApp().ctx.state
    expect(s.scores.vocabulary).toEqual([100])
    expect(s.scores.grammar).toEqual([])
  })

  it('preserves unknown fields written by a newer build (kept in the record’s extras)', () => {
    seed('v1-unknown-fields.json')
    mountApp()
    expect(storedRecord().extras.futureField).toEqual({ a: 1 })
    expect(storedRecord().progress.xp).toBe(7)
  })

  it('a fresh installation starts from defaults and writes nothing until something changes', () => {
    const app = mountApp()
    expect(app.ctx.state).toEqual(defaultState())
    expect(app.ctx.storage.report.status).toBe('fresh')
    expect(localStorage.length).toBe(0)
    app.act(() => app.ctx.actions.setProfile({ name: 'Mira' }))
    expect(stored().name).toBe('Mira')
  })
})

describe('legacy store: malformed input never crashes and never destroys data', () => {
  it('truncated JSON → defaults, the corrupt bytes stay in the legacy key AND in a quarantine copy, status unreadable', () => {
    seed('malformed-truncated-json.txt')
    const app = mountApp()
    expect(app.ctx.state).toEqual(defaultState())
    expect(app.ctx.storage.report.status).toBe('unreadable')
    expect(localStorage.getItem(KEY)).toBe(fixture('legacy/malformed-truncated-json.txt'))
    const q = keysWith(KEYS.quarantine)
    expect(q).toHaveLength(1)
    expect(localStorage.getItem(q[0])).toBe(fixture('legacy/malformed-truncated-json.txt'))
    expect(localStorage.getItem(CURRENT_KEY)).toBeNull() // nothing was overwritten or invented
  })

  it('JSON null → defaults (unreadable)', () => {
    seed('malformed-null.json')
    expect(mountApp().ctx.state).toEqual(defaultState())
  })

  it('a JSON array no longer leaks index keys into the state', () => {
    seed('malformed-array.json')
    const s = mountApp().ctx.state as unknown as Record<string, unknown>
    expect(s['0']).toBeUndefined()
    expect(s.xp).toBe(0)
  })

  it('wrongly typed fields are repaired (numeric string salvaged), reported, and the original is preserved', () => {
    seed('malformed-wrong-types.json')
    const app = mountApp()
    const s = app.ctx.state
    expect(s.xp).toBe(100)
    expect(Array.isArray(s.completed)).toBe(true)
    expect(Array.isArray(s.activeDates)).toBe(true)
    expect(app.ctx.storage.report.issues.length).toBeGreaterThanOrEqual(3)
    expect(localStorage.getItem(KEY)).toBe(fixture('legacy/malformed-wrong-types.json'))
    expect(Object.values(localStorage).filter(v => v === fixture('legacy/malformed-wrong-types.json')).length).toBeGreaterThanOrEqual(2) // legacy + backup
  })

  it('the former crash path is gone: a non-array `activeDates` no longer throws on the first progress action', () => {
    seed('malformed-wrong-types.json')
    const app = mountApp()
    expect(() => record(app, word())).not.toThrow()
    expect(app.ctx.state.xp).toBe(103) // numeric addition, not "1003"
  })

  it('a string `xp` is added numerically', () => {
    seed('malformed-xp-string.json')
    const app = mountApp()
    record(app, word())
    expect(app.ctx.state.xp).toBe(103)
    expect(typeof stored().xp).toBe('number')
  })

  it('`scores: null` / `tutor: null` fall back to defaults', () => {
    seed('malformed-scores-null.json')
    const s = mountApp().ctx.state
    expect(s.scores.vocabulary).toEqual([])
    expect(s.tutor).toEqual({ messages: [] })
  })

  it('unreadable storage: the app still renders with defaults and nothing is written', () => {
    const orig = Storage.prototype.getItem
    const setItem = vi.spyOn(Storage.prototype, 'setItem')
    Storage.prototype.getItem = () => {
      throw new Error('denied')
    }
    try {
      const app = mountApp()
      expect(app.ctx.state).toEqual(defaultState())
      expect(app.ctx.storage.readOnly).toBe(true)
      record(app, word())
      expect(app.ctx.state.xp).toBe(3) // works in memory
      expect(setItem).not.toHaveBeenCalled()
    } finally {
      Storage.prototype.getItem = orig
    }
  })

  it('storage full while playing: the session keeps working and the failure is surfaced (saveFailed)', () => {
    const app = mountApp()
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError')
    })
    record(app, word())
    expect(app.ctx.state.xp).toBe(3)
    expect(app.ctx.storage.saveFailed).toBe(true)
  })
})

describe('persistence contract', () => {
  it('after any change the whole record is written under the NEW key; the legacy key is never written', () => {
    seed('v1-full.json')
    const legacyBefore = localStorage.getItem(KEY)
    const app = mountApp()
    app.act(() => app.ctx.actions.setProfile({ name: 'Test' }))
    expect(stored().name).toBe('Test')
    expect(localStorage.getItem(KEY)).toBe(legacyBefore)
    expect(CURRENT_KEY).toBe('bilup-deutsch:v2:de-general')
  })

  it('the stored record is versioned and course-scoped', () => {
    const app = mountApp()
    record(app, word())
    expect(storedRecord().schemaVersion).toBe(2)
    expect(storedRecord().courseId).toBe('de-general')
    expect(storedRecord().credit.entries).toHaveLength(1)
  })

  it('mounting in React StrictMode (double-invoked initialiser) migrates exactly once: one backup, same state, legacy intact', () => {
    seed('v1-full.json')
    const seen: { xp: number }[] = []
    const Probe = () => {
      seen.push({ xp: useApp().state.xp })
      return null
    }
    render(
      <StrictMode>
        <AppProvider>
          <Probe />
        </AppProvider>
      </StrictMode>,
    )
    expect(seen.every(s => s.xp === 340)).toBe(true)
    expect(keysWith(KEYS.backup)).toHaveLength(1)
    expect(localStorage.getItem(KEY)).toBe(fixture('legacy/v1-full.json'))
  })

  it('a second app start after migration reads the new record (status ok) and shows identical data', () => {
    seed('v1-realistic.json')
    const first = mountApp()
    const snapshot = first.ctx.state
    first.unmount()
    const second = mountApp()
    expect(second.ctx.storage.report.status).toBe('ok')
    expect(second.ctx.state).toEqual(snapshot)
  })
})
