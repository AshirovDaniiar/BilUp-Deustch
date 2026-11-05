// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { creditStatus } from '../../src/progress/creditStatus'
import { recordResult } from '../../src/progress/engine'
import { type StoredResult, pruneActivity, RETENTION } from '../../src/storage/activity'
import { freshCore, type Core } from '../../src/storage/core'
import { mergeCores } from '../../src/storage/merge'
import {
  ensureCopy as ensureCopyRef,
  KEYS,
  loadProgress,
  replacementBlocked,
  restoreFrom,
  rollbackToLegacy,
  saveProgress,
  serialize,
  serializeCore,
  serializeCoreLayout1,
  snapshotComposite,
  startFresh,
} from '../../src/storage/persistence'
import { readResults, serializeResults } from '../../src/storage/results'
import { serializePrefs, serializeTutor } from '../../src/storage/slices'
import { mkResult } from '../helpers'
import { faultyKV, memoryKV, SimulatedCrash, type MemKV } from './fakes'

/**
 * Storage S2 — the detailed attempt history as its own record (STORAGE_S2_RESULTS_DESIGN.md §3, §11, §12, §13).
 * Real persistence layer on an in-memory store that records the order of writes and can inject failures.
 */
const NOW = 1_760_000_000_000
/** a valid ActivityResult in the test's simulated time (startedAt just before finishedAt) */
const mk = (over: Parameters<typeof mkResult>[0] = {}) => mkResult({ startedAt: ((over?.finishedAt as number | undefined) ?? NOW) - 100, finishedAt: NOW, ...over })
const DAY = 86_400_000
const opts = (now = NOW) => ({ now, ids: { writing: new Set<string>(), quizLike: new Set<string>(), testByUnit: {} } })
const writes = (kv: MemKV) => kv.log.filter(l => l.startsWith('set:')).map(l => l.slice(4))
const parse = (kv: MemKV, key: string) => (kv.get(key) === null ? null : JSON.parse(kv.get(key)!))
const entry = (id: string, at = NOW, over: Partial<StoredResult> = {}): StoredResult => ({
  resultId: id,
  activityId: `topic:${id}`,
  kind: 'lesson',
  finishedAt: at,
  activeMs: 500,
  assisted: false,
  score: null,
  passed: true,
  xp: 20,
  items: [{ itemRef: `q:${id}`, outcome: 'correct' }],
  ...over,
})

/** a learner with credit (through the real engine) and `n` attempts */
function learner(n = 3, startAt = NOW - n * 1000): Core {
  let c = freshCore()
  c = { ...c, progress: { ...c.progress, name: 'Mira', lang: 'ky', theme: 'dark' }, settingsAt: 5000 }
  for (let i = 0; i < n; i++) c = recordResult(c, mk({ resultId: `r${i}`, activityId: `topic:t${i}`, kind: 'lesson', finishedAt: startAt + i * 1000, startedAt: startAt + i * 1000 - 400 }), startAt + i * 1000).core
  return c
}
/** an S1 (layout 1) profile: the history is INSIDE the course record */
const layout1KV = (core: Core, extra: Record<string, string> = {}) =>
  memoryKV({ [KEYS.current]: serializeCoreLayout1(core, NOW), [KEYS.prefs]: serializePrefs(core), [KEYS.tutor]: serializeTutor(core), ...extra })
/** an S2 (layout 2) profile */
const layout2KV = (core: Core) => {
  const kv = memoryKV()
  expect(saveProgress(kv, core, NOW).ok).toBe(true)
  kv.log.length = 0
  return kv
}
const ids = (c: Core) => c.activity.results.map(r => r.resultId)

describe('A. the history record (STO-70, STO-82)', () => {
  it('a recorded attempt writes the HISTORY record first, then the course record; nothing else', () => {
    const kv = memoryKV()
    saveProgress(kv, learner(1), NOW)
    expect(writes(kv)).toEqual([KEYS.results, KEYS.current, KEYS.prefs, KEYS.tutor])
  })

  it('the course record (layout 2) contains no history; the history record is self-describing and independent of the epoch', () => {
    const kv = memoryKV()
    saveProgress(kv, { ...learner(2), epoch: 9 }, NOW)
    const core = parse(kv, KEYS.current)
    expect(core.layout).toBe(2)
    expect(core.schemaVersion).toBe(2)
    expect(core.activity).not.toHaveProperty('results')
    const rec = parse(kv, KEYS.results)
    expect(rec).toMatchObject({ record: 'results', v: 1, epoch: 9 })
    expect(rec.results.map((r: StoredResult) => r.resultId)).toEqual(['r0', 'r1'])
  })

  it('what was saved loads back; loading writes nothing', () => {
    const c = learner(3)
    const kv = layout2KV(c)
    const r = loadProgress(kv, opts())
    expect(r.report.status).toBe('ok')
    expect(ids(r.core)).toEqual(['r0', 'r1', 'r2'])
    expect(r.core.credit.entries).toEqual(c.credit.entries)
    expect(kv.log).toEqual([])
  })

  it('new entries carry the accepted attempt-level fields (startedAt, levelId, evidence) and NO free text', () => {
    const kv = layout2KV(learner(1))
    const e = parse(kv, KEYS.results).results[0]
    expect(Object.keys(e).sort()).toEqual(['activeMs', 'activityId', 'assisted', 'evidence', 'finishedAt', 'items', 'kind', 'levelId', 'passed', 'resultId', 'score', 'startedAt', 'xp'])
    expect(e.items).toEqual([]) // lessons have no items; items would only hold itemRef/outcome
  })

  it('UNKNOWN optional fields survive sanitisation and rewrites (entries, items and the record itself)', () => {
    const kv = memoryKV()
    const future = {
      record: 'results',
      v: 1,
      epoch: 0,
      updatedAt: 1,
      futureRecordField: { keep: 'me' },
      results: [{ ...entry('x1'), entrySchema: 2, given: 'tippe', futureField: [1, 2], items: [{ itemRef: 'q:a', outcome: 'correct', expected: 'der' }] }],
    }
    kv.m.set(KEYS.results, JSON.stringify(future))
    kv.m.set(KEYS.current, serializeCore(freshCore(), NOW))
    const r = loadProgress(kv, opts())
    expect(r.core.activity.results[0]).toMatchObject({ entrySchema: 2, given: 'tippe', futureField: [1, 2] })
    // a rewrite (a new attempt is added) keeps every unknown field
    const c2 = recordResult(r.core, mk({ resultId: 'new1', activityId: 'topic:n', kind: 'lesson' }), NOW).core
    saveProgress(kv, c2, NOW + 1)
    const back = parse(kv, KEYS.results)
    expect(back.futureRecordField).toEqual({ keep: 'me' })
    const x1 = back.results.find((e: StoredResult) => e.resultId === 'x1')
    expect(x1).toMatchObject({ entrySchema: 2, given: 'tippe', futureField: [1, 2] })
    expect(x1.items[0]).toMatchObject({ expected: 'der' })
  })

  it('missing optional fields are valid and are NEVER invented (migrated entries)', () => {
    const kv = layout1KV({ ...learner(0), activity: { ...learner(0).activity, results: [entry('old1')] } })
    const r = loadProgress(kv, opts())
    expect(r.report.upgraded).toBe(true)
    const stored = parse(kv, KEYS.results).results[0]
    expect(stored).not.toHaveProperty('startedAt')
    expect(stored).not.toHaveProperty('levelId')
    expect(stored).not.toHaveProperty('evidence')
    expect(stored).not.toHaveProperty('entrySchema')
  })

  it('a higher entrySchema and invalid optional values are tolerated without invention', () => {
    const rd = readResults(JSON.stringify({ record: 'results', v: 1, results: [{ ...entry('a'), entrySchema: 7, startedAt: 'bad', evidence: 'nonsense' }] }))
    expect(rd.state).toBe('ok')
    if (rd.state === 'ok') {
      expect(rd.results[0]).toMatchObject({ entrySchema: 7 })
      expect(rd.results[0]).not.toHaveProperty('startedAt')
      expect(rd.results[0]).not.toHaveProperty('evidence')
    }
  })
})

describe('B. write isolation and independence from the core (STO-81, STO-90)', () => {
  it('a preference change writes ONLY the preferences record; an unchanged state writes nothing', () => {
    const c = learner(2)
    const kv = layout2KV(c)
    saveProgress(kv, c, NOW + 1)
    expect(writes(kv)).toEqual([])
    saveProgress(kv, { ...c, progress: { ...c.progress, theme: 'light' }, settingsAt: 6000 }, NOW + 2)
    expect(writes(kv)).toEqual([KEYS.prefs])
  })

  it('replace mode (a core replacement) NEVER writes or empties the history record, and the in-memory history survives', () => {
    const c = learner(3)
    const kv = layout2KV(c)
    const before = kv.get(KEYS.results)
    // a replacement core whose in-memory history is EMPTY (what a reset produces) is saved with replace: true
    const res = saveProgress(kv, { ...freshCore(), epoch: 50 }, NOW + 5, { replace: true })
    expect(res.ok).toBe(true)
    expect(kv.get(KEYS.results)).toBe(before)
    expect(writes(kv)).not.toContain(KEYS.results)
    if (res.ok) expect(ids(res.core)).toEqual(['r0', 'r1', 'r2']) // the stored history is unioned back into memory
  })

  it('history is read → union → write: a second tab adds entries, nobody removes any', () => {
    const kv = layout2KV(learner(2))
    const other = recordResult(learner(0), mk({ resultId: 'tabB', activityId: 'topic:b', kind: 'lesson', finishedAt: NOW }), NOW).core
    const res = saveProgress(kv, other, NOW + 1)
    expect(res.ok).toBe(true)
    expect(parse(kv, KEYS.results).results.map((r: StoredResult) => r.resultId).sort()).toEqual(['r0', 'r1', 'tabB'])
  })

  it('a stale tab (older core epoch) cannot write the core, but its new attempt is NOT dropped from the history', () => {
    const kv = layout2KV(learner(1))
    startFresh(kv, opts(NOW + 1)) // another tab replaced the core: epoch > 0
    kv.log.length = 0
    const stale = recordResult(learner(1), mk({ resultId: 'late', activityId: 'topic:l', kind: 'lesson', finishedAt: NOW + 9 }), NOW + 9).core
    const res = saveProgress(kv, stale, NOW + 9, { replace: true })
    expect(res.ok && res.conflict).toBe(true)
    expect(writes(kv)).not.toContain(KEYS.current) // zero core writes
    expect(parse(kv, KEYS.results).results.map((r: StoredResult) => r.resultId)).toContain('late') // the attempt is kept in history
    // and no XP came from it: the core is the replacement's
    expect(loadProgress(kv, opts(NOW + 10)).core.progress.xp).toBe(0)
  })

  it('mergeCores: a higher epoch wins for the core but the history is UNIONED (never invalidated)', () => {
    const a = { ...learner(2), epoch: 5 }
    const b = { ...learner(0), epoch: 1, activity: { ...learner(0).activity, results: [entry('only-b')] } }
    const m = mergeCores(a, b, NOW)
    expect(m.epoch).toBe(5)
    expect(ids(m).sort()).toEqual(['only-b', 'r0', 'r1'])
    expect(mergeCores(b, a, NOW)).toEqual(m) // commutative
  })
})

describe('C. missing, damaged and newer-version history (STO-75)', () => {
  it('missing: empty history, core untouched, nothing written', () => {
    const kv = memoryKV()
    saveProgress(kv, { ...learner(0) }, NOW)
    kv.log.length = 0
    const r = loadProgress(kv, opts())
    expect(r.report.sliceNotices).toEqual([])
    expect(r.core.activity.results).toEqual([])
    expect(kv.log).toEqual([])
  })

  for (const [label, bytes] of [
    ['not JSON', '{"record":"results","v":1,"res'],
    ['not an object', '[1,2]'],
    ['wrong record type', JSON.stringify({ record: 'prefs', v: 1 })],
    ['missing version', JSON.stringify({ record: 'results', results: [] })],
    ['results not a list', JSON.stringify({ record: 'results', v: 1, results: 'x' })],
  ] as const) {
    it(`damaged (${label}): exact bytes quarantined FIRST, empty history, core byte-identical, no recovery screen`, () => {
      const kv = layout2KV(learner(2))
      const coreBefore = kv.get(KEYS.current)
      kv.m.set(KEYS.results, bytes)
      const r = loadProgress(kv, opts())
      expect(r.report.status).toBe('ok')
      expect(r.report.writesDisabled).toBe(false)
      expect(r.report.sliceNotices).toEqual([{ slice: 'results', kind: 'damaged', quarantineKey: expect.stringContaining(KEYS.quarantine) }])
      expect(kv.keys(KEYS.quarantine).map(k => kv.get(k))).toContain(bytes)
      expect(kv.get(KEYS.current)).toBe(coreBefore)
      expect(r.core.progress.xp).toBe(40)
    })
  }

  it('damaged: if the quarantine copy cannot be written the record is NOT replaced (notice unsafe)', () => {
    const kv = layout2KV(learner(1))
    kv.m.set(KEYS.results, '{broken')
    const r = loadProgress(faultyKV(kv, { set: k => (k.startsWith(KEYS.quarantine) ? 'quota' : false) }), opts())
    expect(r.report.sliceNotices).toEqual([{ slice: 'results', kind: 'unsafe', quarantineKey: null }])
    expect(kv.get(KEYS.results)).toBe('{broken')
  })

  it('needs repairs (an invalid entry): exact bytes kept, sanitised record written, valid entries kept', () => {
    const kv = layout2KV(learner(2))
    const rec = parse(kv, KEYS.results)
    const bad = JSON.stringify({ ...rec, results: [...rec.results, { resultId: '', activityId: 'x' }] })
    kv.m.set(KEYS.results, bad)
    const r = loadProgress(kv, opts())
    expect(r.report.sliceNotices).toHaveLength(1)
    expect(kv.keys(KEYS.quarantine).map(k => kv.get(k))).toContain(bad)
    expect(ids(r.core)).toEqual(['r0', 'r1'])
  })

  it('a record from a NEWER version: untouched, history-readonly, never rewritten; the core is still saved and the entries stay pending', () => {
    const kv = layout2KV(learner(1))
    const future = JSON.stringify({ ...parse(kv, KEYS.results), v: 2, shiny: true })
    kv.m.set(KEYS.results, future)
    const r = loadProgress(kv, opts())
    expect(r.report.historyReadonly).toBe(true)
    expect(r.report.sliceNotices).toEqual([{ slice: 'results', kind: 'newer', quarantineKey: null }])
    const c2 = recordResult(r.core, mk({ resultId: 'n1', activityId: 'topic:n', kind: 'lesson', finishedAt: NOW + 5 }), NOW + 5).core
    const s = saveProgress(kv, c2, NOW + 5)
    expect(kv.get(KEYS.results)).toBe(future) // never rewritten
    expect(s.ok && s.historyReadonly).toBe(true)
    expect(s.ok && s.pending).toBe(1)
    expect(s.ok && s.core.progress.xp).toBe(40) // XP is saved by the core
    expect(parse(kv, KEYS.current).credit.entries.length).toBeGreaterThan(0)
  })

  it('a results record is never "stale": whatever its epoch, it is used (STO-90)', () => {
    for (const epoch of [0, 3, 999]) {
      const kv = layout2KV({ ...learner(0), epoch: 3 })
      kv.m.set(KEYS.results, serializeResults([entry('h1')], { ext: {} }, epoch, NOW))
      const r = loadProgress(kv, opts())
      expect(ids(r.core)).toEqual(['h1'])
      expect(r.report.sliceNotices).toEqual([])
    }
  })
})

describe('D. S1 → S2 upgrade (STO-78): R1 exact-bytes pinned backup, R2 merge, R3 verify, core last', () => {
  it('upgrades on load: pinned exact backup, history record, then the course record LAST; history intact; XP/ledger byte-equal', () => {
    const c = learner(3)
    const kv = layout1KV(c)
    const before = kv.get(KEYS.current)!
    const r = loadProgress(kv, opts())
    expect(r.report.upgraded).toBe(true)
    expect(r.report.layout).toBe('split')
    expect(writes(kv).map(k => (k.startsWith(KEYS.backup) ? 'backup' : k))).toEqual(['backup', KEYS.results, KEYS.current])
    expect(parse(kv, KEYS.current).layout).toBe(2)
    expect(ids(r.core)).toEqual(['r0', 'r1', 'r2'])
    expect(r.core.credit.entries).toEqual(c.credit.entries)
    expect(r.core.progress.xp).toBe(c.progress.xp)
    const pin = parse(kv, KEYS.current).upgrade.backupKey as string
    expect(kv.get(pin)).toBe(before) // the complete original bytes
  })

  it('the pinned backup survives rotation', () => {
    const kv = layout1KV(learner(2))
    loadProgress(kv, opts())
    const pin = parse(kv, KEYS.current).upgrade.backupKey as string
    for (let i = 0; i < 6; i++) snapshotComposite(kv, NOW + 100 + i)
    expect(kv.get(pin)).not.toBeNull()
  })

  it('is idempotent: a second load writes nothing', () => {
    const kv = layout1KV(learner(2))
    loadProgress(kv, opts())
    const snap = kv.snapshot()
    kv.log.length = 0
    expect(loadProgress(kv, opts(NOW + 5)).report.upgraded).toBe(false)
    expect(kv.log).toEqual([])
    expect(kv.snapshot()).toEqual(snap)
  })

  it('an EXISTING history record is MERGED with the history inside the course record — never replaced', () => {
    const kv = layout1KV(learner(2), { [KEYS.results]: serializeResults([entry('already-there')], { ext: {} }, 0, NOW) })
    const r = loadProgress(kv, opts())
    expect(ids(r.core).sort()).toEqual(['already-there', 'r0', 'r1'])
    expect(parse(kv, KEYS.results).results.map((e: StoredResult) => e.resultId).sort()).toEqual(['already-there', 'r0', 'r1'])
  })

  it('a monolith (layout 0) is upgraded straight to layout 2', () => {
    const c = learner(2)
    const kv = memoryKV({ [KEYS.current]: serialize(c, NOW) })
    const r = loadProgress(kv, opts())
    expect(r.report.upgraded).toBe(true)
    expect(parse(kv, KEYS.current).layout).toBe(2)
    expect(ids(r.core)).toEqual(['r0', 'r1'])
    expect(r.core.progress.name).toBe('Mira')
  })

  it('the legacy key and unknown keys are never touched or deleted', () => {
    const unknown = { 'bilup-deutsch:future-thing': 'keep', 'other:k': '1' }
    const kv = layout1KV(learner(2), { [KEYS.legacy]: '{"xp":1}', ...unknown })
    loadProgress(kv, opts())
    snapshotComposite(kv, NOW + 1)
    expect(kv.get(KEYS.legacy)).toBe('{"xp":1}')
    for (const [k, v] of Object.entries(unknown)) expect(kv.get(k)).toBe(v)
    expect(kv.log.filter(l => l.includes(KEYS.legacy) || l.startsWith('remove:'))).toEqual([])
  })

  describe('a crash or failure at EVERY write converges, with all history and data intact', () => {
    const reference = () => {
      const kv = layout1KV(learner(3))
      const r = loadProgress(kv, opts())
      return { xp: r.core.progress.xp, ids: ids(r.core), ledger: r.core.credit.entries }
    }
    for (const fault of ['crash-before', 'crash-after', 'quota', 'unavailable', 'lie'] as const) {
      for (let n = 1; n <= 3; n++) {
        it(`${fault} at write #${n}`, () => {
          const base = layout1KV(learner(3))
          const original = base.get(KEYS.current)!
          try {
            loadProgress(faultyKV(base, { set: (_k, nth) => (nth === n ? fault : false) }), opts())
          } catch (e) {
            expect(e).toBeInstanceOf(SimulatedCrash)
          }
          // whatever happened the original bytes still exist and no data is lost
          expect(base.get(KEYS.current) === original || [...base.m.values()].includes(original)).toBe(true)
          const again = loadProgress(base, opts(NOW + 1))
          const ref = reference()
          expect(ids(again.core)).toEqual(ref.ids)
          expect(again.core.progress.xp).toBe(ref.xp)
          expect(again.core.credit.entries).toEqual(ref.ledger)
          expect(again.report.layout).toBe('split')
          expect(parse(base, KEYS.current).layout).toBe(2)
          expect(base.get(parse(base, KEYS.current).upgrade.backupKey)).toBe(original)
        })
      }
    }
  })

  describe('failed upgrade → compatibility mode (C5): data intact, replacement operations REFUSED before any write', () => {
    const compat = () => {
      const base = layout1KV(learner(3), { [KEYS.legacy]: '{"xp":1}' })
      const r = loadProgress(faultyKV(base, { set: k => (k.startsWith(KEYS.backup) ? 'quota' : false) }), opts())
      return { base, r }
    }

    it('the session stays in compatibility mode and every datum is intact (history in memory is the full union)', () => {
      const { base, r } = compat()
      expect(r.report.layout).toBe('layout1')
      expect(r.report.upgraded).toBe(false)
      expect(ids(r.core)).toEqual(['r0', 'r1', 'r2'])
      expect(parse(base, KEYS.current).layout).toBe(1)
      expect(base.get(KEYS.results)).toBeNull()
      expect(replacementBlocked(base)).toBe('upgrade-pending')
    })

    it('Start Fresh, Core Restore and Rollback are refused with ZERO writes and nothing changes', () => {
      const { base } = compat()
      // a restorable copy exists
      const copy = `${KEYS.backup}0000000000001:abc`
      base.m.set(copy, 'x')
      const snapshot = base.snapshot()
      base.log.length = 0
      const a = startFresh(base, opts(NOW + 1))
      const b = restoreFrom(base, KEYS.legacy, opts(NOW + 1))
      const c = rollbackToLegacy(base, NOW + 1)
      expect(a.report.blocked).toBe('upgrade-pending')
      expect(b.report.blocked).toBe('upgrade-pending')
      expect(c.ok).toBe(false)
      expect(c.ok === false && c.blocked).toBe('upgrade-pending')
      expect(base.log).toEqual([]) // not a single set or remove
      expect(base.snapshot()).toEqual(snapshot)
    })

    it('saves keep the old record form and the history stays inside it (never written as a half-upgrade)', () => {
      const { base, r } = compat()
      const c2 = recordResult(r.core, mk({ resultId: 'z1', activityId: 'topic:z', kind: 'lesson', finishedAt: NOW + 3 }), NOW + 3).core
      expect(saveProgress(base, c2, NOW + 3, { mode: 'layout1' }).ok).toBe(true)
      const rec = parse(base, KEYS.current)
      expect(rec.layout).toBe(1)
      expect(rec.activity.results.map((e: StoredResult) => e.resultId)).toContain('z1')
      expect(base.get(KEYS.results)).toBeNull()
    })

    it('after the upgrade succeeds the operations are available again and the embedded history is merged, not replaced', () => {
      const { base } = compat()
      const r2 = loadProgress(base, opts(NOW + 10)) // storage works again
      expect(r2.report.upgraded).toBe(true)
      expect(replacementBlocked(base)).toBeNull()
      expect(ids(r2.core)).toEqual(['r0', 'r1', 'r2'])
      const f = startFresh(base, opts(NOW + 11))
      expect(f.report.status).toBe('fresh')
    })
  })

  it('a history record from a newer version keeps the session in compatibility mode and is never touched', () => {
    const future = JSON.stringify({ record: 'results', v: 4, results: [] })
    const kv = layout1KV(learner(1), { [KEYS.results]: future })
    const r = loadProgress(kv, opts())
    expect(r.report.layout).toBe('layout1')
    expect(r.report.historyReadonly).toBe(true)
    expect(kv.get(KEYS.results)).toBe(future)
    expect(parse(kv, KEYS.current).layout).toBe(1)
  })

  it('an S1 build (LAYOUT 1) reading layout 2 is read-only: the layout guard treats it as newer (documented by the S1 layout tests)', () => {
    const kv = layout2KV(learner(1))
    const rec = { ...parse(kv, KEYS.current), layout: 3 }
    kv.m.set(KEYS.current, JSON.stringify(rec))
    const r = loadProgress(kv, opts())
    expect(r.report.status).toBe('future-version')
    expect(r.report.writesDisabled).toBe(true)
  })
})

describe('E. Reset, Start Fresh, Core Restore and Rollback never touch the history (STO-90) and STO-92', () => {
  const profile = () => {
    const c = learner(3)
    const kv = memoryKV({ [KEYS.legacy]: '{"xp":3,"name":"V1","lang":"ru","tutor":{"messages":[]}}' })
    saveProgress(kv, { ...c, progress: { ...c.progress, tutor: { messages: [{ id: 'u1', role: 'user', text: 'Hallo', at: 10 }] } }, tutorAt: 10 }, NOW)
    return kv
  }

  it('Start Fresh: the history record has zero writes, is byte-identical, and the fresh core carries the stored history', () => {
    const kv = profile()
    kv.m.set(KEYS.current, '{"schemaVersion":2,"progress":{"xp":9') // damaged core → the recovery flow
    const before = kv.get(KEYS.results)
    kv.log.length = 0
    const r = startFresh(kv, opts(NOW + 1))
    expect(r.report.status).toBe('fresh')
    expect(kv.get(KEYS.results)).toBe(before)
    expect(writes(kv)).not.toContain(KEYS.results)
    expect(ids(r.core)).toEqual(['r0', 'r1', 'r2'])
    expect(r.core.progress.xp).toBe(0) // the core is fresh; the history is not the reward authority
  })

  it('Core Restore of a COMPOSITE snapshot (no history): history untouched; the snapshot contents are restored exactly', () => {
    const kv = profile()
    const snap = snapshotComposite(kv, NOW + 1).key!
    const c = loadProgress(kv, opts(NOW + 2)).core
    saveProgress(kv, { ...c, progress: { ...c.progress, name: 'Changed' }, settingsAt: NOW + 3 }, NOW + 3)
    const before = kv.get(KEYS.results)
    kv.log.length = 0
    const r = restoreFrom(kv, snap, opts(NOW + 4))
    expect(r.report.status).toBe('recovered')
    expect(r.core.progress.name).toBe('Mira')
    expect(kv.get(KEYS.results)).toBe(before)
    expect(writes(kv)).not.toContain(KEYS.results)
    expect(ids(r.core)).toEqual(['r0', 'r1', 'r2'])
  })

  it('a composite snapshot NEVER contains the history and says so (STO-76); it still contains tombstones, ledger, summaries', () => {
    const kv = profile()
    const res = snapshotComposite(kv, NOW + 1)
    expect(res.omitted).toContain('history')
    const snap = JSON.parse(kv.get(res.key!)!)
    expect(snap.omitted).toEqual(['history'])
    expect(snap.activity.results).toEqual([])
    expect(snap.activity.tombstones.length).toBe(3)
    expect(snap.credit.entries.length).toBeGreaterThan(0)
    // the snapshot's size does not grow with the history
    const small = kv.get(res.key!)!.length
    kv.m.set(KEYS.results, serializeResults([...readResultsOf(kv), ...Array.from({ length: 300 }, (_, i) => entry(`pad${i}`, NOW + i))], { ext: {} }, 0, NOW))
    const big = snapshotComposite(kv, NOW + 2)
    expect(kv.get(big.key!)!.length).toBe(small)
  })

  it('STO-92: restoring a CORE-ONLY copy (the pinned S1 backup) restores the Core and KEEPS the current preferences and tutor; its history is merged', () => {
    // S1 profile → upgrade (pins the layout-1 bytes) → the learner edits preferences, chats and records more
    const kv = layout1KV({ ...learner(2), progress: { ...learner(2).progress, tutor: { messages: [{ id: 'old', role: 'user' as const, text: 'old chat', at: 1 }] } } })
    loadProgress(kv, opts())
    const pin = parse(kv, KEYS.current).upgrade.backupKey as string
    const cur = loadProgress(kv, opts(NOW + 1)).core
    const after = recordResult(
      { ...cur, progress: { ...cur.progress, name: 'CURRENT NAME', theme: 'light', tutor: { messages: [{ id: 'new', role: 'user' as const, text: 'current chat', at: 99 }] } }, settingsAt: NOW + 5, tutorAt: 99 },
      mk({ resultId: 'post', activityId: 'topic:post', kind: 'lesson', finishedAt: NOW + 6 }),
      NOW + 6,
    ).core
    saveProgress(kv, after, NOW + 6)
    const tutorBefore = parse(kv, KEYS.tutor).messages.map((m: { id: string }) => m.id) // the CURRENT chat, whatever it is
    const histBefore = parse(kv, KEYS.results).results.map((e: StoredResult) => e.resultId)
    expect(histBefore).toContain('post')

    const r = restoreFrom(kv, pin, opts(NOW + 7))
    expect(r.report.status).toBe('recovered')
    // preferences and tutor are the CURRENT ones — not defaults, not the (nonexistent) backup values
    expect(r.core.progress.name).toBe('CURRENT NAME')
    expect(r.core.progress.theme).toBe('light')
    expect(r.core.progress.tutor.messages.map(m => m.id)).toEqual(tutorBefore)
    expect(parse(kv, KEYS.prefs).name).toBe('CURRENT NAME')
    expect(parse(kv, KEYS.tutor).messages.map((m: { id: string }) => m.id)).toEqual(tutorBefore)
    expect(tutorBefore).toContain('new')
    // the core reverted to the backup (the post-upgrade attempt's tombstone/XP are not part of it) …
    expect(r.core.activity.tombstones.some(t => t.resultId === 'post')).toBe(false)
    // … but the history is NEVER lost: the later attempt is still there, labelled as not credited
    const hist = parse(kv, KEYS.results).results.map((e: StoredResult) => e.resultId)
    expect(hist).toEqual(expect.arrayContaining(['r0', 'r1', 'post']))
    expect(creditStatus({ resultId: 'post', finishedAt: NOW + 6 }, r.core, NOW + 8)).toBe('not-credited')
  })

  describe('F1 (real-browser finding): the DAMAGED-core Restore path keeps the current preferences and tutor', () => {
    const setup = () => {
      const base = learner(2)
      const kv = layout1KV({ ...base, progress: { ...base.progress, tutor: { messages: [{ id: 'old', role: 'user' as const, text: 'old chat', at: 1 }] } } })
      loadProgress(kv, opts())
      const pin = parse(kv, KEYS.current).upgrade.backupKey as string
      const cur = loadProgress(kv, opts(NOW + 1)).core
      const after = recordResult(
        { ...cur, progress: { ...cur.progress, name: 'CURRENT NAME', theme: 'light', tutor: { messages: [{ id: 'new', role: 'user' as const, text: 'current chat', at: 99 }] } }, settingsAt: NOW + 5, tutorAt: 99 },
        mk({ resultId: 'post', activityId: 'topic:post', kind: 'lesson', finishedAt: NOW + 6 }),
        NOW + 6,
      ).core
      saveProgress(kv, after, NOW + 6)
      kv.m.set(KEYS.current, '{"schemaVersion":2,"progress":{"xp":9') // the core is damaged — the only time the recovery UI offers Restore
      return { kv, pin }
    }

    it('damaged Core + valid Preferences + Tutor, pinned S1 backup: current values survive exactly, on disk and in memory; history merged', () => {
      const { kv, pin } = setup()
      expect(loadProgress(kv, opts(NOW + 7)).report.status).not.toBe('ok') // really the damaged-core state
      const prefsBefore = kv.get(KEYS.prefs)
      const r = restoreFrom(kv, pin, opts(NOW + 8))
      expect(r.report.status).toBe('recovered')
      expect(r.core.progress.name).toBe('CURRENT NAME')
      expect(r.core.progress.theme).toBe('light')
      expect(r.core.progress.tutor.messages.map(m => m.id)).toEqual(['old', 'new'])
      expect(parse(kv, KEYS.prefs).name).toBe('CURRENT NAME')
      expect(parse(kv, KEYS.prefs).theme).toBe('light')
      expect(JSON.parse(prefsBefore!).name).toBe('CURRENT NAME')
      expect(parse(kv, KEYS.tutor).messages.map((m: { id: string }) => m.id)).toEqual(['old', 'new'])
      expect(parse(kv, KEYS.results).results.map((e: StoredResult) => e.resultId)).toEqual(expect.arrayContaining(['r0', 'r1', 'post']))
      // it reloads healthy with the same preferences and tutor
      const again = loadProgress(kv, opts(NOW + 9)).core
      expect(again.progress.name).toBe('CURRENT NAME')
      expect(again.progress.tutor.messages.map(m => m.id)).toEqual(['old', 'new'])
    })

    it('independently DAMAGED preferences: not silently replaced by the backup, defaults in memory, the damaged bytes are quarantined; tutor still kept', () => {
      const { kv, pin } = setup()
      kv.m.set(KEYS.prefs, '{not json')
      const r = restoreFrom(kv, pin, opts(NOW + 8))
      expect(r.report.status).toBe('recovered')
      expect(r.core.progress.name).not.toBe('CURRENT NAME')
      expect(r.core.progress.tutor.messages.map(m => m.id)).toEqual(['old', 'new'])
      const kept = [...kv.m.entries()].filter(([k]) => k.startsWith(KEYS.quarantine))
      expect(kept.some(([, v]) => String(v).includes('{not json'))).toBe(true)
    })

    it('independently DAMAGED tutor: preferences kept exactly, tutor follows its existing behaviour (empty), damaged bytes quarantined', () => {
      const { kv, pin } = setup()
      kv.m.set(KEYS.tutor, 'garbage')
      const r = restoreFrom(kv, pin, opts(NOW + 8))
      expect(r.report.status).toBe('recovered')
      expect(r.core.progress.name).toBe('CURRENT NAME')
      expect(r.core.progress.tutor.messages).toEqual([])
      expect([...kv.m.entries()].some(([k, v]) => k.startsWith(KEYS.quarantine) && String(v).includes('garbage'))).toBe(true)
    })

    it('retry after a FAILED restore: nothing was replaced; the retry then keeps preferences and tutor', () => {
      const { kv, pin } = setup()
      let fail = true
      const flaky = faultyKV(kv, { set: () => (fail ? 'quota' : false) })
      const first = restoreFrom(flaky, pin, opts(NOW + 8))
      expect(first.report.status).toBe('unwritable')
      expect(parse(kv, KEYS.prefs).name).toBe('CURRENT NAME') // nothing replaced
      expect(parse(kv, KEYS.tutor).messages.map((m: { id: string }) => m.id)).toEqual(['old', 'new'])
      fail = false
      const second = restoreFrom(flaky, pin, opts(NOW + 9))
      expect(second.report.status).toBe('recovered')
      expect(second.core.progress.name).toBe('CURRENT NAME')
      expect(second.core.progress.tutor.messages.map(m => m.id)).toEqual(['old', 'new'])
      expect(parse(kv, KEYS.results).results.map((e: StoredResult) => e.resultId)).toEqual(expect.arrayContaining(['post']))
    })
  })

  it('restoring an S1-era snapshot that CONTAINS history merges it into the history record (never replaces)', () => {
    const kv = profile()
    const s1era = serialize(learner(3), NOW) // composite WITH inline history (what S1 snapshots were)
    const key = `${KEYS.backup}0000000000009:${'0'.repeat(8)}`
    kv.m.set(key, s1era)
    // the live history holds a different attempt that the snapshot does not know
    const live = parse(kv, KEYS.results)
    kv.m.set(KEYS.results, JSON.stringify({ ...live, results: [...live.results, entry('live-only', NOW + 50)] }))
    const fp = (s: string) => s // fingerprint check is done by restoreFrom; use a real content-addressed copy
    void fp
    const real = snapshotComposite(memoryKV({ [KEYS.current]: s1era }), NOW)
    void real
    // use the proper path: an exact content-addressed copy created by ensureCopy through a throwaway store
    const tmp = memoryKV({ [KEYS.current]: serialize(learner(3), NOW) })
    const made = snapshotCurrentWithHistory(tmp)
    kv.m.set(made.key, made.raw)
    const r = restoreFrom(kv, made.key, opts(NOW + 60))
    expect(r.report.status).toBe('recovered')
    expect(parse(kv, KEYS.results).results.map((e: StoredResult) => e.resultId).sort()).toEqual(['live-only', 'r0', 'r1', 'r2'])
  })

  it('Rollback to legacy removes ONLY the core, preferences and tutor keys — never the history', () => {
    const kv = profile()
    const before = kv.get(KEYS.results)
    kv.log.length = 0
    const rb = rollbackToLegacy(kv, NOW + 1)
    expect(rb.ok).toBe(true)
    expect(kv.get(KEYS.results)).toBe(before)
    expect(kv.log.filter(l => l.includes(KEYS.results))).toEqual([])
    expect(kv.get(KEYS.current)).toBeNull()
    expect(kv.get(KEYS.legacy)).not.toBeNull()
    // the next load migrates v1 into a NEW core and attaches the stored history
    const after = loadProgress(kv, opts(NOW + 2))
    expect(after.report.status).toBe('migrated')
    expect(ids(after.core)).toEqual(['r0', 'r1', 'r2'])
    expect(creditStatus({ resultId: 'r1', finishedAt: NOW - 2000 }, after.core, NOW + 3)).toBe('not-credited')
  })
})

describe('F. rewards stay with the Core: tombstones are the sole duplicate authority (STO-98, STO-99)', () => {
  it('a history entry WITHOUT a tombstone does not block a legitimate credit', () => {
    const c = { ...freshCore(), activity: { ...freshCore().activity, results: [entry('same-id', NOW)] } }
    const out = recordResult(c, mk({ resultId: 'same-id', activityId: 'topic:a', kind: 'lesson', finishedAt: NOW }), NOW)
    expect(out.outcome.applied).toBe(true)
    expect(out.core.progress.xp).toBe(20)
    expect(out.core.activity.results.filter(r => r.resultId === 'same-id')).toHaveLength(1) // never a second entry
  })

  it('a tombstone blocks the replay (no XP, no new entry)', () => {
    const r = mk({ resultId: 'once', activityId: 'topic:a', kind: 'lesson', finishedAt: NOW })
    const first = recordResult(freshCore(), r, NOW).core
    const again = recordResult(first, r, NOW + 1)
    expect(again.outcome.reason).toBe('duplicate')
    expect(again.core.progress.xp).toBe(20)
  })

  it('crediting code never reads the stored XP of history entries (static check)', async () => {
    const { readFileSync } = await import('node:fs')
    const { join } = await import('node:path')
    for (const f of ['src/progress/engine.ts', 'src/storage/credit.ts']) {
      const src = readFileSync(join(__dirname, '../..', f), 'utf8')
      expect(/results\b[^\n]*\.xp\b/.test(src), f).toBe(false)
    }
  })

  it('creditStatus: credited / not-credited / NO label beyond the tombstone window', () => {
    const core = recordResult(freshCore(), mk({ resultId: 'c1', activityId: 'topic:a', kind: 'lesson', finishedAt: NOW }), NOW).core
    expect(creditStatus({ resultId: 'c1', finishedAt: NOW }, core, NOW + DAY)).toBe('credited')
    expect(creditStatus({ resultId: 'nope', finishedAt: NOW }, core, NOW + DAY)).toBe('not-credited')
    expect(creditStatus({ resultId: 'nope', finishedAt: NOW }, core, NOW + (RETENTION.tombstoneDays - 1) * DAY)).toBe('not-credited')
    expect(creditStatus({ resultId: 'old', finishedAt: NOW }, core, NOW + (RETENTION.tombstoneDays + 1) * DAY)).toBe('unknown')
  })
})

describe('G. no automatic deletion; folding disabled; tombstone expiry unchanged (C4, STO-87)', () => {
  it('2 000 attempts over 700 simulated days: nothing is ever folded or removed; summaries stay empty', () => {
    let c = freshCore()
    for (let i = 0; i < 2000; i++) {
      const at = NOW - 700 * DAY + Math.floor((i / 2000) * 700 * DAY)
      c = recordResult(c, mk({ resultId: `bulk${i}`, activityId: `topic:b${i % 50}`, kind: 'lesson', finishedAt: at }), at).core
    }
    expect(c.activity.results).toHaveLength(2000)
    expect(c.activity.summaries).toEqual({})
    const kv = memoryKV()
    saveProgress(kv, c, NOW)
    expect(parse(kv, KEYS.results).results).toHaveLength(2000)
    expect(loadProgress(kv, opts()).core.activity.results).toHaveLength(2000)
  })

  it('pruneActivity only expires tombstones (unchanged 400-day rule) and never touches results or summaries', () => {
    const r = recordResult(freshCore(), mk({ resultId: 'tomb', activityId: 'topic:a', kind: 'lesson', finishedAt: NOW }), NOW).core
    expect(pruneActivity(r.activity, NOW + 399 * DAY).tombstones).toHaveLength(1)
    const later = pruneActivity(r.activity, NOW + 401 * DAY)
    expect(later.tombstones).toHaveLength(0)
    expect(later.results).toBe(r.activity.results)
    expect(later.summaries).toBe(r.activity.summaries)
  })

  it('existing S1 summaries are preserved and merged exactly as before (per-field max)', () => {
    const s = { '2026-01-01': { results: 5, correct: 3, total: 9, activeMs: 1000, xp: 40 } }
    const a = { ...freshCore(), activity: { ...freshCore().activity, summaries: s } }
    const b = { ...freshCore(), activity: { ...freshCore().activity, summaries: { '2026-01-01': { results: 7, correct: 1, total: 9, activeMs: 10, xp: 10 } } } }
    expect(mergeCores(a, b, NOW).activity.summaries['2026-01-01']).toEqual({ results: 7, correct: 3, total: 9, activeMs: 1000, xp: 40 })
  })

  it('RESERVED fields (prunedThrough, deletions) are preserved and merged but never written with a value by S2', () => {
    const kv = layout2KV(learner(2))
    expect(parse(kv, KEYS.current).activity.prunedThrough).toBeUndefined()
    expect(parse(kv, KEYS.results).deletions).toBeUndefined()
    // a record written by a future stage keeps them through every rewrite
    const rec = parse(kv, KEYS.results)
    kv.m.set(KEYS.results, JSON.stringify({ ...rec, deletions: { 'de-general': { throughKey: { finishedAt: 1, resultId: 'a' }, at: 5 } } }))
    const r = loadProgress(kv, opts())
    expect(r.core.activity.results).toHaveLength(2) // inactive: the marker removes nothing
    saveProgress(kv, recordResult(r.core, mk({ resultId: 'x', activityId: 'topic:x', kind: 'lesson', finishedAt: NOW + 1 }), NOW + 1).core, NOW + 1)
    expect(parse(kv, KEYS.results).deletions['de-general'].throughKey).toEqual({ finishedAt: 1, resultId: 'a' })
  })
})

describe('H. Results/Core write combinations (design §12): no XP without the Core, nothing lost silently', () => {
  const attempt = () => recordResult(learner(1), mk({ resultId: 'new', activityId: 'topic:n', kind: 'lesson', finishedAt: NOW + 5 }), NOW + 5).core

  it('1 — Results ok / Core ok: both durable', () => {
    const kv = layout2KV(learner(1))
    const res = saveProgress(kv, attempt(), NOW + 5)
    expect(res.ok && res.pending).toBe(0)
    expect(parse(kv, KEYS.results).results.map((e: StoredResult) => e.resultId)).toContain('new')
    expect(parse(kv, KEYS.current).activity.tombstones.map((t: { resultId: string }) => t.resultId)).toContain('new')
  })

  it('2a — Results ok / Core FAILS (quota): history durable, no tombstone in storage; retry persists the core once, no second entry', () => {
    const kv = layout2KV(learner(1))
    const c = attempt()
    const flaky = faultyKV(kv, { set: k => (k === KEYS.current ? 'quota' : false) })
    const res = saveProgress(flaky, c, NOW + 5)
    expect(res.ok).toBe(false) // the existing save-failed path
    expect(parse(kv, KEYS.results).results.map((e: StoredResult) => e.resultId)).toContain('new')
    expect(parse(kv, KEYS.current).activity.tombstones.map((t: { resultId: string }) => t.resultId)).not.toContain('new')
    // storage recovers: the retry writes the same ledger ids/tombstone; the entry is not duplicated
    const retry = saveProgress(kv, c, NOW + 6)
    expect(retry.ok).toBe(true)
    expect(parse(kv, KEYS.results).results.filter((e: StoredResult) => e.resultId === 'new')).toHaveLength(1)
    expect(parse(kv, KEYS.current).activity.tombstones.filter((t: { resultId: string }) => t.resultId === 'new')).toHaveLength(1)
    expect(loadProgress(kv, opts(NOW + 7)).core.progress.xp).toBe(c.progress.xp)
  })

  it('2b — Results ok / Core REJECTED (stale epoch): the attempt is kept, NO XP, no retry of the stale core', () => {
    const kv = layout2KV(learner(1))
    startFresh(kv, opts(NOW + 1))
    const res = saveProgress(kv, attempt(), NOW + 5, { replace: true })
    expect(res.ok && res.conflict).toBe(true)
    expect(parse(kv, KEYS.results).results.map((e: StoredResult) => e.resultId)).toContain('new')
    const after = loadProgress(kv, opts(NOW + 6)).core
    expect(after.progress.xp).toBe(0)
    expect(creditStatus({ resultId: 'new', finishedAt: NOW + 5 }, after, NOW + 6)).toBe('not-credited')
  })

  it('3 — Results FAILS / Core ok: XP and tombstone persisted, the entry stays pending and is retried without duplicates', () => {
    const kv = layout2KV(learner(1))
    const c = attempt()
    const flaky = faultyKV(kv, { set: k => (k === KEYS.results ? 'quota' : false) })
    const res = saveProgress(flaky, c, NOW + 5)
    expect(res.ok).toBe(true)
    expect(res.ok && res.resultsFailed?.pending).toBe(1)
    expect(res.ok && res.pending).toBe(1)
    expect(parse(kv, KEYS.current).activity.tombstones.map((t: { resultId: string }) => t.resultId)).toContain('new') // credit saved
    expect(parse(kv, KEYS.results).results.map((e: StoredResult) => e.resultId)).not.toContain('new')
    // the in-memory core still holds the entry (it IS the pending queue); the next save persists it exactly once
    const retry = saveProgress(kv, res.ok ? res.core : c, NOW + 6)
    expect(retry.ok && retry.pending).toBe(0)
    expect(parse(kv, KEYS.results).results.filter((e: StoredResult) => e.resultId === 'new')).toHaveLength(1)
  })

  it('4 — both FAIL: nothing persisted, nothing lost from memory, one retry later persists everything once', () => {
    const kv = layout2KV(learner(1))
    const c = attempt()
    const res = saveProgress(faultyKV(kv, { set: () => 'unavailable' }), c, NOW + 5)
    expect(res.ok).toBe(false)
    expect(parse(kv, KEYS.results).results.map((e: StoredResult) => e.resultId)).not.toContain('new')
    const retry = saveProgress(kv, c, NOW + 6)
    expect(retry.ok && retry.pending).toBe(0)
    expect(parse(kv, KEYS.results).results.filter((e: StoredResult) => e.resultId === 'new')).toHaveLength(1)
    expect(parse(kv, KEYS.current).progress.xp).toBe(c.progress.xp)
  })

  it('a failed history write never removes older history', () => {
    const kv = layout2KV(learner(3))
    const before = parse(kv, KEYS.results).results.length
    saveProgress(faultyKV(kv, { set: k => (k === KEYS.results ? 'quota' : false) }), attempt(), NOW + 5)
    expect(parse(kv, KEYS.results).results).toHaveLength(before)
  })

  it('no combination awards XP without the Core: XP only exists after a Core write', () => {
    const kv = layout2KV(learner(1))
    const c = attempt()
    const xpBefore = parse(kv, KEYS.current).progress.xp
    saveProgress(faultyKV(kv, { set: k => (k === KEYS.current ? 'quota' : false) }), c, NOW + 5)
    expect(parse(kv, KEYS.current).progress.xp).toBe(xpBefore) // the history is saved, the XP is not
    expect(parse(kv, KEYS.results).results.find((e: StoredResult) => e.resultId === 'new')!.xp).toBeGreaterThan(0) // informational only
  })
})

const readResultsOf = (kv: MemKV): StoredResult[] => {
  const r = readResults(kv.get(KEYS.results))
  return r.state === 'ok' ? r.results : []
}
/** an exact content-addressed copy of a composite record WITH history (what S1 snapshots looked like) */
function snapshotCurrentWithHistory(tmp: MemKV): { key: string; raw: string } {
  const raw = tmp.get(KEYS.current)!
  // reuse the real helper through a scratch store so the key carries the right fingerprint
  const scratch = memoryKV()
  const key = ensureCopyRef(scratch, KEYS.backup, raw, NOW)
  return { key, raw }
}
