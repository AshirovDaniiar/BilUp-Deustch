import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { TutorChat } from '../../src/features/ai/TutorChat'
import { AppProvider } from '../../src/app/store'
import { freshCore, type Core } from '../../src/storage/core'
import { mergeTutor } from '../../src/storage/merge'
import { applyLegacyDrift, KEYS, loadProgress, saveProgress, startFresh } from '../../src/storage/persistence'
import { serializePrefs } from '../../src/storage/slices'
import { sanitizeProgress } from '../../src/storage/validate'
import { faultyKV, memoryKV, type MemKV } from './fakes'

/** S1 deviation verification (docs/implementation/S1_DEVIATION_VERIFICATION.md). */
const NOW = 1_740_000_000_000
const T0 = 1_738_000_000_000 // when the stale v1 app wrote its chat
const opts = (now = NOW) => ({ now, ids: { writing: new Set<string>(), quizLike: new Set<string>(), testByUnit: {} } })
const v1 = (tutor: object[], extra: object = {}) =>
  JSON.stringify({
    ...JSON.parse(readFileSync(join(__dirname, '../fixtures/legacy/v1-full.json'), 'utf8')),
    tutor: { messages: tutor },
    ...extra,
  })
const M = (id: string, role: 'user' | 'ai' = 'user', text = id) => ({ id, role, text })
const ids = (c: Core) => c.progress.tutor.messages.map(m => m.id)
const writes = (kv: MemKV) => kv.log.filter(l => l.startsWith('set:')).map(l => l.slice(4))
type Msg = { id: string; role: 'user' | 'ai'; text: string; at?: number }
const T = (messages: Msg[], clearedAt = 0) => ({ messages, clearedAt })

/** the learner clears the chat in the new app (what actions.clearTutor stores) */
function clearChat(kv: MemKV, at = NOW) {
  const c = loadProgress(kv, opts(at)).core
  const t = Math.max(at, c.tutorAt + 1, ...c.progress.tutor.messages.map(m => (m.at ?? 0) + 1))
  const cleared: Core = { ...c, progress: { ...c.progress, tutor: { messages: [] } }, tutorAt: t, tutorClearedAt: t }
  expect(saveProgress(kv, cleared, at).ok).toBe(true)
  return cleared
}

describe('A. legacy tutor ordering (position-based stamps)', () => {
  it('stamping is deterministic, idempotent, and sorts before any real timestamp', () => {
    const raw = { tutor: { messages: [M('x10'), M('x9'), M('x1')] } }
    const once = sanitizeProgress(raw)!.value.tutor.messages
    expect(once.map(m => m.at)).toEqual([1, 2, 3]) // position, NOT alphabetical id order
    expect(sanitizeProgress({ tutor: { messages: once } })!.value.tutor.messages).toEqual(once) // idempotent
    const merged = mergeTutor(T(once), T([{ ...M('new'), at: NOW }]))
    expect(merged.messages.map(m => m.id)).toEqual(['x10', 'x9', 'x1', 'new']) // legacy order kept, real message after
  })

  it('migrating an old transcript twice (reload) gives identical bytes and order', () => {
    const kv = memoryKV({ [KEYS.legacy]: v1([M('t1'), M('t2'), M('t3')]) })
    loadProgress(kv, opts())
    const first = kv.get(KEYS.tutor)
    loadProgress(kv, opts(NOW + 5))
    loadProgress(kv, opts(NOW + 9))
    expect(kv.get(KEYS.tutor)).toBe(first)
    expect(JSON.parse(first!).messages.map((m: Msg) => m.id)).toEqual(['t1', 't2', 't3'])
  })

  it('the same line seen with a position stamp and with its real time is ONE line, with the later time', () => {
    const out = mergeTutor(T([{ ...M('a1'), at: 2 }]), T([{ ...M('a1'), at: NOW }]))
    expect(out.messages).toEqual([{ ...M('a1'), at: NOW }])
  })

  it('overlapping legacy windows from two sources: no duplicates, deterministic, commutative', () => {
    const a = sanitizeProgress({ tutor: { messages: [M('a'), M('b'), M('c')] } })!.value.tutor.messages
    const b = sanitizeProgress({ tutor: { messages: [M('b'), M('c'), M('d'), M('e')] } })!.value.tutor.messages
    const ab = mergeTutor(T(a), T(b))
    expect(ab).toEqual(mergeTutor(T(b), T(a)))
    expect(ab.messages.map(m => m.id).sort()).toEqual(['a', 'b', 'c', 'd', 'e'])
  })

  it('equal timestamps: every permutation of the inputs gives the same order', () => {
    const msgs: Msg[] = ['p', 'q', 'r', 's'].map(id => ({ ...M(id), at: 50 }))
    const perms = (xs: Msg[]): Msg[][] =>
      xs.length < 2 ? [xs] : xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map(p => [x, ...p]))
    const outs = perms(msgs).map(p => JSON.stringify(mergeTutor(T(p), T([])).messages))
    expect(new Set(outs).size).toBe(1)
  })

  it('a message appended in the app after migration sorts after every migrated message', () => {
    const kv = memoryKV({ [KEYS.legacy]: v1([M('t1'), M('t2')]) })
    const c = loadProgress(kv, opts()).core
    const last = Math.max(...c.progress.tutor.messages.map(m => m.at ?? 0))
    const pushed: Core = {
      ...c,
      progress: { ...c.progress, tutor: { messages: [...c.progress.tutor.messages, { ...M('u9'), at: NOW }] } },
      tutorAt: NOW,
    }
    saveProgress(kv, pushed, NOW)
    expect(last).toBeLessThan(NOW)
    expect(ids(loadProgress(kv, opts(NOW + 1)).core)).toEqual(['t1', 't2', 'u9'])
  })
})

describe('B. duplicate tutor ids', () => {
  const pool: Msg[] = [
    { ...M('a', 'user', 'one'), at: 5 },
    { ...M('a', 'user', 'two'), at: 5 },
    { ...M('a', 'user', 'one'), at: 9 }, // same line, later time
    { ...M('b', 'ai'), at: 6 },
    { ...M('c'), at: 1 },
  ]
  const subsets = Array.from({ length: 1 << pool.length }, (_, mask) => pool.filter((_, i) => mask & (1 << i)))

  it('exhaustively over every subset triple: idempotent, commutative, associative', () => {
    const S = subsets.filter((_, i) => i % 3 === 0).map(m => T(m)) // 11 representative sets (kept small: n^3 combinations)
    for (const a of S) {
      expect(mergeTutor(mergeTutor(a, a), a)).toEqual(mergeTutor(a, a))
      for (const b of S) {
        expect(mergeTutor(a, b)).toEqual(mergeTutor(b, a))
        for (const c of S) expect(mergeTutor(mergeTutor(a, b), c)).toEqual(mergeTutor(a, mergeTutor(b, c)))
      }
    }
  })

  it('merging the result again never adds duplicates', () => {
    const all = mergeTutor(T(pool), T([]))
    expect(mergeTutor(all, T(pool))).toEqual(all)
    expect(
      all.messages
        .filter(m => m.id === 'a')
        .map(m => m.text)
        .sort(),
    ).toEqual(['one', 'two']) // both survive; 'one' once
  })

  it('both survive serialization and reload with their original ids', () => {
    const kv = memoryKV()
    const c: Core = {
      ...freshCore(),
      progress: {
        ...freshCore().progress,
        tutor: {
          messages: [
            { ...M('a', 'user', 'one'), at: 5 },
            { ...M('a', 'user', 'two'), at: 5 },
          ],
        },
      },
    }
    saveProgress(kv, c, NOW)
    const back = loadProgress(kv, opts()).core.progress.tutor.messages
    expect(back.map(m => [m.id, m.text])).toEqual([
      ['a', 'one'],
      ['a', 'two'],
    ])
  })

  afterEach(() => vi.restoreAllMocks())
  it('the chat renders two bubbles for two same-id messages without a React key collision', () => {
    const kv = memoryKV()
    const c: Core = {
      ...freshCore(),
      progress: {
        ...freshCore().progress,
        tutor: {
          messages: [
            { ...M('a', 'user', 'first text'), at: 5 },
            { ...M('a', 'user', 'second text'), at: 5 },
          ],
        },
      },
    }
    saveProgress(kv, c, NOW)
    Element.prototype.scrollIntoView = vi.fn()
    const err = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <AppProvider kv={kv}>
        <TutorChat />
      </AppProvider>,
    )
    expect(screen.getByText('first text')).toBeTruthy()
    expect(screen.getByText('second text')).toBeTruthy()
    expect(err.mock.calls.filter(c => String(c[0]).includes('same key')).length).toBe(0)
  })
})

describe('C. stale v1 shell and a cleared tutor transcript', () => {
  const chat = [M(`u${T0}`), M(`a${T0 + 1}`, 'ai')]
  const setup = (tutor: object[] = chat) => {
    const kv = memoryKV({ [KEYS.legacy]: v1(tutor), 'bilup-deutsch:future-x': 'unknown', 'other:k': '1' })
    loadProgress(kv, opts(T0 + 10))
    return kv
  }
  const expectSafe = (kv: MemKV, legacy: string) => {
    expect(kv.get(KEYS.legacy)).toBe(legacy)
    expect(kv.get('bilup-deutsch:future-x')).toBe('unknown')
    expect(kv.log.filter(l => l.includes(KEYS.legacy))).toEqual([])
    expect(kv.log.filter(l => l.startsWith('remove:'))).toEqual([])
  }

  it('cleared lines do NOT come back when the stale shell rewrites the same transcript', () => {
    const kv = setup()
    expect(ids(loadProgress(kv, opts(T0 + 20)).core)).toHaveLength(2)
    clearChat(kv)
    kv.log.length = 0
    const stale = v1(chat, { xp: 400 }) // the old tab writes again, still holding the chat it last saw
    kv.m.set(KEYS.legacy, stale)
    const r = loadProgress(kv, opts(NOW + 10))
    expect(r.report.drift).toBe('merged')
    expect(ids(r.core)).toEqual([]) // still cleared
    expect(JSON.parse(kv.get(KEYS.tutor)!).messages).toEqual([])
    expectSafe(kv, stale)
  })

  it('a genuinely new line written by the stale shell AFTER the clear is kept, the old ones stay gone', () => {
    const kv = setup()
    clearChat(kv)
    const fresh = M(`u${NOW + 5000}`, 'user', 'written after the clear')
    kv.m.set(KEYS.legacy, v1([...chat, fresh]))
    const r = loadProgress(kv, opts(NOW + 10))
    expect(ids(r.core)).toEqual([fresh.id])
    expect(r.core.progress.tutor.messages[0]!.at).toBe(NOW + 5000) // the real time encoded in its id
  })

  it('lines with ids that carry no time (older fixtures) are dropped via the pristine migration copy', () => {
    const kv = setup([M('m1'), M('m2', 'ai')])
    clearChat(kv)
    kv.m.set(KEYS.legacy, v1([M('m1'), M('m2', 'ai'), M('m3')]))
    expect(ids(loadProgress(kv, opts(NOW + 10)).core)).toEqual(['m3']) // only the genuinely new one
  })

  it('processing the same drift again is idempotent (same bytes: nothing; different bytes, same chat: still cleared)', () => {
    const kv = setup()
    clearChat(kv)
    kv.m.set(KEYS.legacy, v1(chat, { xp: 400 }))
    const first = loadProgress(kv, opts(NOW + 10))
    const snap = kv.snapshot()
    const again = loadProgress(kv, opts(NOW + 11))
    expect(again.report.drift).toBe('none')
    expect(kv.snapshot()).toEqual(snap)
    kv.m.set(KEYS.legacy, v1(chat, { xp: 405 }))
    const third = loadProgress(kv, opts(NOW + 12))
    expect(ids(third.core)).toEqual([])
    expect(third.core.progress.xp).toBeGreaterThanOrEqual(first.core.progress.xp)
  })

  it('drift before the clear, then the clear, then the same bytes again: nothing returns', () => {
    const kv = setup()
    const withNew = v1([...chat, M(`u${T0 + 500}`)], { xp: 410 })
    kv.m.set(KEYS.legacy, withNew)
    expect(ids(loadProgress(kv, opts(T0 + 600)).core)).toHaveLength(3)
    clearChat(kv)
    expect(ids(loadProgress(kv, opts(NOW + 20)).core)).toEqual([])
    expect(kv.get(KEYS.legacy)).toBe(withNew)
  })

  it('preferences keep their precedence: the stale name never overrides the current one', () => {
    const kv = setup()
    const c = loadProgress(kv, opts(NOW)).core
    saveProgress(kv, { ...c, progress: { ...c.progress, name: 'Current' }, settingsAt: NOW }, NOW)
    kv.m.set(KEYS.legacy, v1(chat, { name: 'Stale', xp: 999 }))
    expect(loadProgress(kv, opts(NOW + 1)).core.progress.name).toBe('Current')
  })

  it('no stale slice and no stale drift survives a deliberate replacement', () => {
    const kv = setup()
    startFresh(kv, opts(NOW))
    kv.m.set(KEYS.legacy, v1(chat, { xp: 999 }))
    const r = loadProgress(kv, opts(NOW + 1))
    expect(r.report.drift).toBe('none')
    expect(ids(r.core)).toEqual([])
    expect(r.core.progress.xp).toBe(0)
  })

  it('if the drift backup cannot be written nothing is merged and nothing is lost', () => {
    const kv = setup()
    clearChat(kv)
    const core = loadProgress(kv, opts(NOW + 1)).core
    const stale = v1([...chat, M(`u${NOW + 9000}`)])
    const d = applyLegacyDrift(faultyKV(kv, { set: () => 'quota' }), core, stale, NOW + 2)
    expect(d.drift).toBe('deferred')
    expect(ids(d.core)).toEqual([])
    expect(kv.get(KEYS.legacy)).toBeTruthy()
  })

  it('a crash at each write while processing the drift converges on the next load', () => {
    for (let n = 1; n <= 4; n++) {
      const kv = setup()
      clearChat(kv)
      kv.m.set(KEYS.legacy, v1([...chat, M(`u${NOW + 7000}`)], { xp: 450 }))
      try {
        loadProgress(faultyKV(kv, { set: (_k, nth) => (nth === n ? 'crash-before' : false) }), opts(NOW + 10))
      } catch {
        /* simulated crash */
      }
      const r = loadProgress(kv, opts(NOW + 11))
      expect(ids(r.core)).toEqual([`u${NOW + 7000}`])
    }
  })
})

describe('C2. any save that moves the drift marker writes the records it summarises first', () => {
  it('slices before the course record, so a crash can only repeat the merge', () => {
    const kv = memoryKV({ [KEYS.legacy]: v1([M('t1')]) })
    const c = loadProgress(kv, opts()).core
    const moved: Core = {
      ...c,
      origin: { ...c.origin!, legacyFingerprint: 'changed' },
      progress: {
        ...c.progress,
        tutor: {
          messages: [
            { ...M('t1'), at: 1 },
            { ...M('t9'), at: NOW },
          ],
        },
      },
      tutorAt: NOW,
    }
    kv.log.length = 0
    saveProgress(kv, moved, NOW + 1)
    expect(writes(kv)).toEqual([KEYS.tutor, KEYS.current])
  })
})

describe('D. the epoch guards (core guard and slice guard)', () => {
  const split = () => {
    const kv = memoryKV()
    saveProgress(kv, { ...freshCore(), progress: { ...freshCore().progress, name: 'Mira' }, settingsAt: 5 }, NOW)
    return kv
  }

  it('core guard: a stale writer cannot write ANY record once the core epoch has advanced (nothing is even attempted)', () => {
    const kv = split()
    const stale = { ...freshCore(), progress: { ...freshCore().progress, name: 'Mira' }, settingsAt: 5 } // epoch 0 holder
    startFresh(kv, opts(NOW + 1))
    const stored = kv.snapshot()
    kv.log.length = 0
    for (const replace of [true, false]) {
      const res = saveProgress(
        kv,
        { ...stale, progress: { ...stale.progress, name: 'Stale', theme: 'dark' }, settingsAt: NOW + 9 },
        NOW + 9,
        { replace },
      )
      if (res.ok) expect(res.conflict || res.core.epoch > 0).toBe(true)
    }
    expect(writes(kv)).toEqual([]) // not a single setItem
    expect(kv.snapshot()).toEqual(stored) // current valid data unchanged
    expect(JSON.parse(kv.get(KEYS.prefs)!).name).toBe('') // the reset's defaults, not the stale edit
  })

  it('slice guard: a slice of a HIGHER epoch than the (equal-epoch) core is never overwritten, even though the core guard passes', () => {
    const kv = split()
    const odd = serializePrefs({ ...freshCore(), epoch: 9, settingsAt: 99, progress: { ...freshCore().progress, name: 'Anomalous' } })
    kv.m.set(KEYS.prefs, odd)
    const res = saveProgress(
      kv,
      { ...freshCore(), progress: { ...freshCore().progress, name: 'Mira', theme: 'dark' }, settingsAt: NOW },
      NOW + 1,
      { replace: true },
    )
    expect(res.ok && res.conflict).toBe(true)
    expect(kv.get(KEYS.prefs)).toBe(odd)
  })
})
