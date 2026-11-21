// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { award } from '../../src/storage/credit'
import { freshCore, type Core } from '../../src/storage/core'
import { canonicalJson, mergeTutor } from '../../src/storage/merge'
import {
  applyLegacyDrift,
  BACKUPS_KEPT,
  detectSchema,
  KEYS,
  loadProgress,
  preserveCurrent,
  readStored,
  restoreFrom,
  rollbackToLegacy,
  rotateBackups,
  saveProgress,
  serialize,
  serializeCore,
  snapshotComposite,
  startFresh,
  type LoadResult,
} from '../../src/storage/persistence'
import { comparePrefs, readPrefs, readTutor, serializePrefs, serializeTutor } from '../../src/storage/slices'
import { faultyKV, memoryKV, SimulatedCrash, type MemKV } from './fakes'

/**
 * Storage split S1 (preferences + tutor in their own records) — STORAGE_S1_FINAL_DESIGN.md §3–§9.
 * Every test uses the real persistence layer on an in-memory store that records the ORDER of writes and can inject failures.
 */
const NOW = 1_740_000_000_000
const opts = (now = NOW) => ({ now, ids: { writing: new Set<string>(), quizLike: new Set<string>(), testByUnit: {} } })
const raw = (name: string) => readFileSync(join(__dirname, '../fixtures/legacy', name), 'utf8')
const writes = (kv: MemKV) => kv.log.filter(l => l.startsWith('set:')).map(l => l.slice(4))
const isSlice = (k: string) => k === KEYS.prefs || k === KEYS.tutor
const parse = (kv: MemKV, key: string) => (kv.get(key) === null ? null : JSON.parse(kv.get(key)!))

const MSGS = [
  { id: 'u1', role: 'user' as const, text: 'Hallo', at: 1000 },
  { id: 'a1', role: 'ai' as const, text: 'Hi!', at: 1001 },
]

/** A learner with real data in all three groups. */
function learner(over: Partial<Core> = {}): Core {
  let c = freshCore()
  const r = award(c.credit, 'topic:x', 20, NOW)
  c = {
    ...c,
    credit: r.state,
    progress: { ...c.progress, name: 'Mira', lang: 'ky', theme: 'dark', level: 'A1', weeklyGoal: 3, xp: 20, tutor: { messages: MSGS } },
    settingsAt: 5000,
    tutorAt: 1001,
  }
  return { ...c, ...over }
}

/** A development profile: everything in ONE record (what every build before S1 wrote). */
const monolithKV = (core = learner(), extra: Record<string, string> = {}) => memoryKV({ [KEYS.current]: serialize(core, NOW), ...extra })

/** The state a profile represents, independent of how it is stored. */
const state = (r: LoadResult) => ({ progress: r.core.progress, xp: r.core.credit.entries.reduce((s, e) => s + e.xp, 0) })

describe('layout: the course record no longer holds preferences or tutor (STO-01)', () => {
  it('a first save writes exactly three records, in the order core, preferences, tutor', () => {
    const kv = memoryKV()
    expect(saveProgress(kv, learner(), NOW).ok).toBe(true)
    expect(writes(kv)).toEqual([KEYS.current, KEYS.prefs, KEYS.tutor])
    expect(kv.keys('')).toEqual([KEYS.prefs, KEYS.tutor, KEYS.current])
  })

  it('the course record carries `layout: 2` (S2) and none of the split fields (preferences, tutor) nor the history', () => {
    const kv = memoryKV()
    saveProgress(kv, learner(), NOW)
    const rec = parse(kv, KEYS.current)
    expect(rec.layout).toBe(2)
    expect(rec.activity).not.toHaveProperty('results') // S2: the detailed history is its own record
    for (const f of ['name', 'lang', 'theme', 'level', 'weeklyGoal', 'tutor']) expect(rec.progress).not.toHaveProperty(f)
    for (const f of ['settingsAt', 'tutorAt', 'tutorClearedAt']) expect(rec).not.toHaveProperty(f)
    expect(rec.progress.xp).toBe(20) // everything else is still there
    expect(rec.schemaVersion).toBe(2) // STO-04: the schema version does not change
  })

  it('the slices are self-describing and carry the epoch of their core', () => {
    const kv = memoryKV()
    saveProgress(kv, { ...learner(), epoch: 7 }, NOW)
    expect(parse(kv, KEYS.prefs)).toMatchObject({
      record: 'prefs',
      v: 1,
      epoch: 7,
      updatedAt: 5000,
      name: 'Mira',
      lang: 'ky',
      theme: 'dark',
      weeklyGoal: 3,
    })
    expect(parse(kv, KEYS.tutor)).toMatchObject({ record: 'tutor', v: 1, epoch: 7, updatedAt: 1001, clearedAt: 0 })
    expect(parse(kv, KEYS.tutor).messages).toEqual(MSGS)
  })

  it('what was saved loads back unchanged (round trip through three records)', () => {
    const kv = memoryKV()
    const c = learner()
    saveProgress(kv, c, NOW)
    const r = loadProgress(kv, opts())
    expect(r.report.status).toBe('ok')
    expect(r.core.progress).toEqual(c.progress)
    expect(r.core.settingsAt).toBe(5000)
    expect(r.core.tutorAt).toBe(1001)
    expect(kv.log.filter(l => l.startsWith('set:'))).toHaveLength(3) // loading wrote nothing new
  })
})

describe('write isolation (STO-02, the S1 acceptance requirement)', () => {
  const saved = () => {
    const kv = memoryKV()
    saveProgress(kv, learner(), NOW)
    kv.log.length = 0
    return kv
  }
  const save = (kv: MemKV, c: Core) => saveProgress(kv, c, NOW + 5)

  it('a preference change writes ONLY the preferences record', () => {
    const kv = saved()
    const c = learner()
    save(kv, { ...c, progress: { ...c.progress, theme: 'light' }, settingsAt: 6000 })
    expect(writes(kv)).toEqual([KEYS.prefs])
  })

  it('a tutor change writes ONLY the tutor record', () => {
    const kv = saved()
    const c = learner()
    save(kv, {
      ...c,
      progress: { ...c.progress, tutor: { messages: [...MSGS, { id: 'u2', role: 'user', text: 'Danke', at: 1002 }] } },
      tutorAt: 1002,
    })
    expect(writes(kv)).toEqual([KEYS.tutor])
  })

  it('a progress change writes ONLY the course record', () => {
    const kv = saved()
    const c = learner()
    save(kv, { ...c, progress: { ...c.progress, saved: ['v1-1'] } })
    expect(writes(kv)).toEqual([KEYS.current])
  })

  it('saving an unchanged state writes nothing', () => {
    const kv = saved()
    expect(save(kv, learner()).ok).toBe(true)
    expect(writes(kv)).toEqual([])
  })

  it('nothing ever writes or removes the legacy key', () => {
    const kv = memoryKV({ [KEYS.legacy]: raw('v1-full.json') })
    const { core } = loadProgress(kv, opts())
    saveProgress(kv, { ...core, progress: { ...core.progress, name: 'X' }, settingsAt: NOW }, NOW)
    expect(kv.log.filter(l => l.includes(KEYS.legacy))).toEqual([])
    expect(kv.get(KEYS.legacy)).toBe(raw('v1-full.json'))
  })
})

describe('each preferences / tutor record is its own failure domain (STO-06, S1 design §4)', () => {
  const slices = [
    { name: 'prefs' as const, key: KEYS.prefs },
    { name: 'tutor' as const, key: KEYS.tutor },
  ]
  const healthy = () => {
    const kv = memoryKV()
    saveProgress(kv, learner(), NOW)
    return kv
  }
  const quarantined = (kv: MemKV) => kv.keys(KEYS.quarantine).map(k => kv.get(k))

  for (const s of slices) {
    describe(`damaged ${s.name} record`, () => {
      const cases: [string, (kv: MemKV) => string][] = [
        ['not JSON', () => '{"record":"' + s.name + '","v":1,"epo'],
        ['not an object', () => '[1,2,3]'],
        ['a different record type', () => JSON.stringify({ record: s.name === 'prefs' ? 'tutor' : 'prefs', v: 1, epoch: 0 })],
        ['missing version', () => JSON.stringify({ record: s.name, epoch: 0, updatedAt: 1, messages: [] })],
        ['epoch ABOVE the course record (anomalous)', kv => kv.get(s.key)!.replace('"epoch":0', '"epoch":99')],
      ]
      for (const [label, damage] of cases) {
        it(`${label}: exact bytes quarantined first, defaults used, learning untouched`, () => {
          const kv = healthy()
          const coreBefore = kv.get(KEYS.current)
          const bad = damage(kv)
          kv.m.set(s.key, bad)
          kv.log.length = 0
          const r = loadProgress(kv, opts())
          expect(r.report.status).toBe('ok') // never the recovery screen
          expect(r.report.writesDisabled).toBe(false)
          expect(r.report.sliceNotices).toEqual([
            { slice: s.name, kind: 'damaged', quarantineKey: expect.stringContaining(KEYS.quarantine) },
          ])
          expect(quarantined(kv)).toContain(bad) // the exact bytes
          expect(kv.get(KEYS.current)).toBe(coreBefore) // the course record is byte-identical
          expect(r.core.progress.xp).toBe(20)
          if (s.name === 'prefs') expect(r.core.progress.name).toBe('')
          else expect(r.core.progress.tutor.messages).toEqual([])
          // the quarantine write happened BEFORE the damaged record was replaced
          expect(writes(kv).findIndex(k => k.startsWith(KEYS.quarantine))).toBeLessThan(writes(kv).indexOf(s.key))
          // the replacement is a valid record: the next load is clean
          expect(loadProgress(kv, opts()).report.sliceNotices).toEqual([])
        })
      }

      it('needs repairs (invalid values): the original bytes are kept and the sanitised record is written', () => {
        const kv = healthy()
        const rec = parse(kv, s.key)
        const bad = JSON.stringify(
          s.name === 'prefs'
            ? { ...rec, theme: 'neon', weeklyGoal: 99 }
            : { ...rec, messages: [...rec.messages, { id: 'x', role: 'robot', text: 'bad' }] },
        )
        kv.m.set(s.key, bad)
        const r = loadProgress(kv, opts())
        expect(r.report.sliceNotices).toHaveLength(1)
        expect(quarantined(kv)).toContain(bad)
        if (s.name === 'prefs')
          expect(r.core.progress.name).toBe('Mira') // the valid part is kept
        else expect(r.core.progress.tutor.messages).toEqual(MSGS)
        expect(loadProgress(kv, opts()).report.sliceNotices).toEqual([])
      })

      it('written by a NEWER version: left untouched, defaults in memory, never rewritten', () => {
        const kv = healthy()
        const future = JSON.stringify({ ...parse(kv, s.key), v: 2, extra: 'from the future' })
        kv.m.set(s.key, future)
        const r = loadProgress(kv, opts())
        expect(r.report.sliceNotices).toEqual([{ slice: s.name, kind: 'newer', quarantineKey: null }])
        expect(kv.get(s.key)).toBe(future)
        // saving must not touch it either
        const c = r.core
        saveProgress(kv, { ...c, progress: { ...c.progress, theme: 'light', tutor: { messages: [] } }, settingsAt: NOW, tutorAt: NOW }, NOW)
        expect(kv.get(s.key)).toBe(future)
      })

      it('from an OLDER epoch (left over by a deliberate replacement): ignored silently, not an error', () => {
        const kv = healthy()
        const stale = kv.get(s.key)!
        const c = learner({ epoch: 5 })
        kv.m.set(KEYS.current, serializeCore({ ...c, progress: { ...c.progress, tutor: { messages: [] } } }, NOW))
        const r = loadProgress(kv, opts())
        expect(r.report.sliceNotices).toEqual([])
        expect(r.report.status).toBe('ok')
        if (s.name === 'prefs') expect(r.core.progress.name).toBe('')
        else expect(r.core.progress.tutor.messages).toEqual([])
        expect(quarantined(kv)).not.toContain(stale) // not damage: nothing to quarantine
        expect(parse(kv, s.key).epoch).toBe(5) // overwritten by a current-epoch default
      })

      it('if the quarantine copy cannot be written the record is NOT replaced (notice: unsafe)', () => {
        const kv = healthy()
        const bad = '{"broken'
        kv.m.set(s.key, bad)
        const flaky = faultyKV(kv, { set: k => (k.startsWith(KEYS.quarantine) ? 'quota' : false) })
        const r = loadProgress(flaky, opts())
        expect(r.report.sliceNotices).toEqual([{ slice: s.name, kind: 'unsafe', quarantineKey: null }])
        expect(kv.get(s.key)).toBe(bad)
        expect(r.report.writesDisabled).toBe(false) // learning continues
      })
    })
  }

  it('damage to a slice does not change XP, completion or any other group (both slices damaged at once)', () => {
    const kv = healthy()
    kv.m.set(KEYS.prefs, 'garbage')
    kv.m.set(KEYS.tutor, 'garbage')
    const coreBefore = kv.get(KEYS.current)
    const r = loadProgress(kv, opts())
    expect(r.core.progress.xp).toBe(20)
    expect(r.report.sliceNotices.map(n => n.slice).sort()).toEqual(['prefs', 'tutor'])
    expect(kv.get(KEYS.current)).toBe(coreBefore)
  })

  it('a damaged COURSE record still opens the recovery flow (unchanged behaviour) and does not touch the slices', () => {
    const kv = healthy()
    const prefs = kv.get(KEYS.prefs)
    const tutor = kv.get(KEYS.tutor)
    kv.m.set(KEYS.current, '{"schemaVersion":2,"courseId":"de-general","progress":{"xp":9')
    const r = loadProgress(kv, opts())
    expect(r.report.status).toBe('unreadable')
    expect(r.report.writesDisabled).toBe(true)
    expect(kv.get(KEYS.prefs)).toBe(prefs)
    expect(kv.get(KEYS.tutor)).toBe(tutor)
  })
})

describe('version guard: a layout this build does not know is read-only (STO-04)', () => {
  // S2: layout 2 is now KNOWN (it is what S2 writes); larger or malformed markers are still read-only
  it.each([3, 7, 'x', -1, 1.5])('layout %s: nothing is read as progress and nothing is written', layout => {
    const kv = memoryKV()
    saveProgress(kv, learner(), NOW)
    const rec = { ...parse(kv, KEYS.current), layout }
    kv.m.set(KEYS.current, JSON.stringify(rec))
    const before = kv.snapshot()
    kv.log.length = 0
    const r = loadProgress(kv, opts())
    expect(r.report.status).toBe('future-version')
    expect(r.report.writesDisabled).toBe(true)
    expect(kv.log).toEqual([])
    expect(kv.snapshot()).toEqual(before)
    expect(detectSchema(rec)).toBe('future')
    const s = saveProgress(kv, learner(), NOW)
    expect(s.ok).toBe(false)
    expect(kv.snapshot()).toEqual(before)
  })
})

describe('monolith -> split upgrade of a development profile (STO-05, S1 design §7 U)', () => {
  const monolith = () => monolithKV()
  const orig = () => serialize(learner(), NOW)

  it('splits on load: exact-bytes backup first, then preferences, then tutor, then the course record last', () => {
    const kv = monolith()
    const r = loadProgress(kv, opts())
    expect(r.report.upgraded).toBe(true)
    expect(r.report.layout).toBe('split')
    expect(r.report.status).toBe('ok')
    expect(writes(kv).map(k => (k.startsWith(KEYS.backup) ? 'backup' : k))).toEqual(['backup', KEYS.prefs, KEYS.tutor, KEYS.current])
    expect(parse(kv, KEYS.current).layout).toBe(2) // S2: the monolith is upgraded straight to layout 2
    expect(state(r).progress).toEqual(learner().progress)
  })

  it('the pinned backup holds the COMPLETE original monolith bytes and is named by the new course record', () => {
    const kv = monolith()
    loadProgress(kv, opts())
    const key = parse(kv, KEYS.current).upgrade.backupKey as string
    expect(key.startsWith(KEYS.backup)).toBe(true)
    expect(kv.get(key)).toBe(orig())
  })

  it('the pinned backup survives rotation however many other snapshots are taken', () => {
    const kv = monolith()
    loadProgress(kv, opts())
    const key = parse(kv, KEYS.current).upgrade.backupKey as string
    for (let i = 0; i < BACKUPS_KEPT + 4; i++) {
      const c = learner()
      saveProgress(kv, { ...c, progress: { ...c.progress, saved: [`w${i}`] } }, NOW + i)
      expect(snapshotComposite(kv, NOW + 100 + i).ok).toBe(true)
    }
    rotateBackups(kv, BACKUPS_KEPT, [key])
    expect(kv.get(key)).toBe(orig())
  })

  it('is idempotent: a second load changes nothing and writes nothing', () => {
    const kv = monolith()
    loadProgress(kv, opts())
    const after = kv.snapshot()
    kv.log.length = 0
    const again = loadProgress(kv, opts(NOW + 10))
    expect(again.report.upgraded).toBe(false)
    expect(kv.log).toEqual([])
    expect(kv.snapshot()).toEqual(after)
  })

  it('the learner state after the upgrade equals the monolith state (no field lost, none invented)', () => {
    const before = learner().progress
    const r = loadProgress(monolith(), opts())
    expect(r.core.progress).toEqual(before)
    expect(r.core.settingsAt).toBe(5000)
    expect(r.core.tutorAt).toBe(1001) // carried by the composite form
  })

  it('the legacy key is untouched, and unknown storage keys are never deleted', () => {
    const unknown = { 'bilup-deutsch:future-thing': 'keep me', 'bilup-deutsch:v3:de-general': '{"a":1}', 'other-app:key': '1' }
    const kv = monolithKV(learner(), { [KEYS.legacy]: raw('v1-full.json'), ...unknown })
    loadProgress(kv, opts())
    saveProgress(kv, learner({ epoch: 0 }), NOW + 1)
    snapshotComposite(kv, NOW + 2)
    for (const [k, v] of Object.entries(unknown)) expect(kv.get(k)).toBe(v)
    expect(kv.get(KEYS.legacy)).toBe(raw('v1-full.json'))
    expect(kv.log.filter(l => l.startsWith('remove:'))).toEqual([])
  })

  describe('a crash or failure at EVERY write converges to the same final state with nothing lost', () => {
    const reference = () => {
      const kv = monolith()
      return state(loadProgress(kv, opts()))
    }
    for (const fault of ['crash-before', 'crash-after', 'quota', 'unavailable', 'lie'] as const) {
      for (let n = 1; n <= 4; n++) {
        it(`${fault} at write #${n}`, () => {
          const base = monolith()
          const originalBytes = orig()
          const flaky = faultyKV(base, { set: (_k, nth) => (nth === n ? fault : false) })
          try {
            loadProgress(flaky, opts())
          } catch (e) {
            expect(e).toBeInstanceOf(SimulatedCrash)
          }
          // whatever happened, the original bytes still exist somewhere
          expect([...base.m.values()].includes(originalBytes) || base.get(KEYS.current) === originalBytes).toBe(true)
          // a restart with a healthy store completes the job
          const r = loadProgress(base, opts(NOW + 1))
          expect(state(r)).toEqual(reference())
          expect(r.report.layout).toBe('split')
          expect(parse(base, KEYS.current).layout).toBe(2)
          expect(base.get(parse(base, KEYS.current).upgrade.backupKey)).toBe(originalBytes)
          expect(loadProgress(base, opts(NOW + 2)).report.status).toBe('ok')
        })
      }
    }
  })

  it('backup cannot be written: nothing changes, the session keeps the old single record (monolith mode)', () => {
    const base = monolith()
    const flaky = faultyKV(base, { set: k => (k.startsWith(KEYS.backup) ? 'quota' : false) })
    const r = loadProgress(flaky, opts())
    expect(r.report.layout).toBe('monolith')
    expect(r.report.writesDisabled).toBe(false)
    expect(r.report.upgraded).toBe(false)
    expect(base.get(KEYS.current)).toBe(orig())
    expect(base.get(KEYS.prefs)).toBeNull()
    expect(r.core.progress).toEqual(learner().progress)
    // saving in this mode keeps writing the single record - an older build can still read it
    const c = r.core
    expect(saveProgress(flaky, { ...c, progress: { ...c.progress, saved: ['v1-1'] } }, NOW + 1, { monolith: true }).ok).toBe(true)
    expect(base.get(KEYS.prefs)).toBeNull()
    expect(parse(base, KEYS.current).layout).toBeUndefined()
    expect(parse(base, KEYS.current).progress.saved).toEqual(['v1-1'])
    // when storage works again the next load completes the upgrade
    const later = loadProgress(base, opts(NOW + 2))
    expect(later.report.upgraded).toBe(true)
    expect(later.core.progress.saved).toEqual(['v1-1'])
  })

  it('quota error while writing the slices: the monolith is intact, the next load finishes', () => {
    const base = monolith()
    const flaky = faultyKV(base, { set: k => (isSlice(k) ? 'quota' : false) })
    const r = loadProgress(flaky, opts())
    expect(r.report.layout).toBe('monolith')
    expect(base.get(KEYS.current)).toBe(orig())
    expect(loadProgress(base, opts(NOW + 1)).report.upgraded).toBe(true)
  })

  describe('precedence when slices already exist (a crash between U2/U3 and U4)', () => {
    it('a NEWER preferences slice wins over the monolith value', () => {
      const kv = monolith()
      kv.m.set(
        KEYS.prefs,
        serializePrefs({ ...learner(), settingsAt: 9000, progress: { ...learner().progress, theme: 'light', name: 'Newer' } }),
      )
      const r = loadProgress(kv, opts())
      expect(r.core.progress.name).toBe('Newer')
      expect(r.core.progress.theme).toBe('light')
      expect(r.core.settingsAt).toBe(9000)
    })
    it('an OLDER preferences slice loses to the monolith value', () => {
      const kv = monolith()
      kv.m.set(KEYS.prefs, serializePrefs({ ...learner(), settingsAt: 100, progress: { ...learner().progress, name: 'Older' } }))
      const r = loadProgress(kv, opts())
      expect(r.core.progress.name).toBe('Mira')
      expect(parse(kv, KEYS.prefs).name).toBe('Mira')
    })
    it('an existing tutor slice is MERGED with the monolith transcript: no message is lost', () => {
      const kv = monolith()
      const extra = { id: 'u9', role: 'user' as const, text: 'Nur im Slice', at: 2000 }
      kv.m.set(
        KEYS.tutor,
        serializeTutor({ ...learner(), progress: { ...learner().progress, tutor: { messages: [MSGS[0]!, extra] } }, tutorAt: 2000 }),
      )
      const r = loadProgress(kv, opts())
      expect(r.core.progress.tutor.messages.map(m => m.id)).toEqual(['u1', 'a1', 'u9'])
    })
    it('a slice from an older epoch than the monolith is ignored', () => {
      const kv = monolithKV(learner({ epoch: 4 }))
      kv.m.set(
        KEYS.prefs,
        serializePrefs({ ...learner({ epoch: 1 }), progress: { ...learner().progress, name: 'Stale' }, settingsAt: 99999 }),
      )
      const r = loadProgress(kv, opts())
      expect(r.core.progress.name).toBe('Mira')
    })
    it('a slice written by a newer version blocks the upgrade (read-only), nothing is written', () => {
      const kv = monolith()
      kv.m.set(KEYS.tutor, JSON.stringify({ record: 'tutor', v: 3, epoch: 0, messages: [] }))
      const before = kv.snapshot()
      const r = loadProgress(kv, opts())
      expect(r.report.status).toBe('future-version')
      expect(r.report.writesDisabled).toBe(true)
      expect(kv.snapshot()).toEqual(before)
    })
  })

  it('a pre-split build rewriting the course record over a split profile loses nothing (slices win by precedence)', () => {
    const kv = memoryKV()
    saveProgress(kv, learner(), NOW)
    // the older build knows nothing about slices: it reads the record (defaults for the missing fields) and writes it back as a monolith
    const old = loadProgress(kv, opts()).core
    const rewritten = serialize(
      { ...old, progress: { ...old.progress, name: '', lang: 'ru', theme: 'auto', tutor: { messages: [] } }, settingsAt: 0, tutorAt: 0 },
      NOW + 1,
    )
    kv.m.set(KEYS.current, rewritten)
    const r = loadProgress(kv, opts(NOW + 2))
    expect(r.core.progress.name).toBe('Mira')
    expect(r.core.progress.theme).toBe('dark')
    expect(r.core.progress.tutor.messages).toEqual(MSGS)
    expect(kv.get([...kv.keys(KEYS.backup)][0]!)).toBe(rewritten) // the monolith it wrote is preserved byte for byte
  })
})

describe('legacy v1 -> current writes the slices first and the course record last (creation)', () => {
  const ref = () => state(loadProgress(memoryKV({ [KEYS.legacy]: raw('v1-full.json') }), opts()))

  it('order of writes: pristine backup, preferences, tutor, course record', () => {
    const kv = memoryKV({ [KEYS.legacy]: raw('v1-full.json') })
    const r = loadProgress(kv, opts())
    expect(r.report.status).toBe('migrated')
    expect(writes(kv).map(k => (k.startsWith(KEYS.backup) ? 'backup' : k))).toEqual(['backup', KEYS.prefs, KEYS.tutor, KEYS.current])
    expect(kv.get(KEYS.legacy)).toBe(raw('v1-full.json'))
  })

  for (const fault of ['crash-before', 'crash-after', 'quota'] as const) {
    for (let n = 1; n <= 4; n++) {
      it(`${fault} at write #${n}: the legacy bytes are untouched and a restart completes the migration to the same state`, () => {
        const base = memoryKV({ [KEYS.legacy]: raw('v1-full.json') })
        try {
          loadProgress(faultyKV(base, { set: (_k, nth) => (nth === n ? fault : false) }), opts())
        } catch (e) {
          expect(e).toBeInstanceOf(SimulatedCrash)
        }
        expect(base.get(KEYS.legacy)).toBe(raw('v1-full.json'))
        const r = loadProgress(base, opts(NOW + 1))
        expect(state(r).progress).toEqual(ref().progress)
        expect(state(r).xp).toBe(ref().xp)
        // a crash after the slices but before the course record never leaves a half-adopted state
        expect(loadProgress(base, opts(NOW + 2)).report.status).toBe('ok')
      })
    }
  }

  it('preferences/tutor records that survive without a course record or legacy key are adopted, not lost', () => {
    const kv = memoryKV()
    const c = learner({ epoch: 3 })
    kv.m.set(KEYS.prefs, serializePrefs(c))
    kv.m.set(KEYS.tutor, serializeTutor(c))
    const r = loadProgress(kv, opts())
    expect(r.core.progress.name).toBe('Mira')
    expect(r.core.progress.tutor.messages).toEqual(MSGS)
    expect(r.core.epoch).toBe(3)
  })
})

describe('snapshots never omit preferences or tutor (STO-17: R-S1-1…R-S1-4)', () => {
  const split = () => {
    const kv = memoryKV()
    saveProgress(kv, learner(), NOW)
    return kv
  }

  it('R-S1-2: a snapshot is ONE monolith-format record containing core + preferences + tutor', () => {
    const kv = split()
    const res = snapshotComposite(kv, NOW + 1)
    // STO-76: a composite snapshot NEVER contains the history and says so (the marker is also inside the record)
    expect(res).toMatchObject({ ok: true, omitted: ['history'] })
    expect(JSON.parse(kv.get(res.key!)!).omitted).toEqual(['history'])
    const snap = JSON.parse(kv.get(res.key!)!)
    expect(snap.layout).toBeUndefined()
    expect(snap.progress).toMatchObject({ name: 'Mira', lang: 'ky', theme: 'dark', xp: 20 })
    expect(snap.progress.tutor.messages).toEqual(MSGS)
    // and it is restorable by the existing restore path to the same state
    const kv2 = memoryKV()
    kv2.m.set(res.key!, kv.get(res.key!)!)
    const restored = restoreFrom(kv2, res.key!, opts(NOW + 2))
    expect(restored.report.status).toBe('recovered')
    expect(restored.core.progress).toEqual(learner().progress)
    expect(parse(kv2, KEYS.prefs).name).toBe('Mira')
    expect(parse(kv2, KEYS.tutor).messages).toEqual(MSGS)
  })

  it('R-S1-3: a damaged slice is quarantined byte for byte first and the omission is recorded, never silent', () => {
    const kv = split()
    kv.m.set(KEYS.tutor, 'damaged-tutor-bytes')
    const res = snapshotComposite(kv, NOW + 1)
    expect(res.ok).toBe(true)
    expect(res.omitted).toEqual(['tutor', 'history'])
    expect(kv.keys(KEYS.quarantine).map(k => kv.get(k))).toContain('damaged-tutor-bytes')
  })

  it('R-S1-4: when the snapshot cannot be written, snapshotComposite reports ok:false', () => {
    const kv = split()
    const res = snapshotComposite(faultyKV(kv, { set: () => 'quota' }), NOW + 1)
    expect(res.ok).toBe(false)
  })

  it('R-S1-4: startFresh refuses and replaces NOTHING when the safety copy cannot be made', () => {
    const kv = split()
    const before = kv.snapshot()
    const r = startFresh(faultyKV(kv, { set: () => 'quota' }), opts(NOW + 1))
    expect(r.report.writesDisabled).toBe(true)
    expect(r.report.status).toBe('unwritable')
    expect(kv.snapshot()).toEqual(before)
  })

  it('R-S1-4: startFresh refuses when ONLY the safety copy fails (everything else would have worked)', () => {
    const kv = split()
    kv.m.set(KEYS.current, '{"schemaVersion":2,"progress":{"xp":9')
    const before = kv.snapshot()
    const r = startFresh(faultyKV(kv, { set: k => (k.startsWith(KEYS.quarantine) ? 'quota' : false) }), opts(NOW + 1))
    expect(r.report.writesDisabled).toBe(true)
    expect(kv.snapshot()).toEqual(before)
  })

  it('a composite snapshot contains the tutor messages (an omission would lose the chat)', () => {
    const kv = split()
    const key = snapshotComposite(kv, NOW + 1).key!
    expect(JSON.parse(kv.get(key)!).progress.tutor.messages).toHaveLength(2)
  })

  it('a stale tab cannot overwrite a newer course record even for the slices it holds (guard on the stored epoch)', () => {
    const kv = split()
    startFresh(kv, opts(NOW + 1))
    const slice = kv.get(KEYS.prefs)
    saveProgress(kv, { ...learner(), progress: { ...learner().progress, name: 'Late' }, settingsAt: NOW + 5 }, NOW + 5, { replace: true })
    expect(kv.get(KEYS.prefs)).toBe(slice)
  })

  it('R-S1-4: restoreFrom refuses and replaces NOTHING when the safety copy cannot be made', () => {
    const kv = split()
    const snap = JSON.stringify(JSON.parse(serialize(learner(), NOW)))
    const key = `${KEYS.backup}${String(NOW).padStart(13, '0')}:` + (kv.set.length, '')
    void key
    const source = snapshotComposite(kv, NOW + 1).key!
    const c = learner()
    saveProgress(kv, { ...c, progress: { ...c.progress, name: 'Changed' }, settingsAt: 8000 }, NOW + 2)
    const before = kv.snapshot()
    const r = restoreFrom(faultyKV(kv, { set: k => (k.startsWith(KEYS.quarantine) ? 'quota' : false) }), source, opts(NOW + 3))
    expect(r.report.writesDisabled).toBe(true)
    expect(kv.snapshot()).toEqual(before)
    expect(snap).toBeTruthy()
  })

  it('R-S1-4: rollbackToLegacy refuses and removes NOTHING when the safety copy cannot be made', () => {
    const kv = memoryKV({ [KEYS.legacy]: raw('v1-full.json') })
    loadProgress(kv, opts())
    const before = kv.snapshot()
    const r = rollbackToLegacy(faultyKV(kv, { set: () => 'quota' }), NOW + 1)
    expect(r.ok).toBe(false)
    expect(kv.snapshot()).toEqual(before)
  })

  it('rollbackToLegacy keeps the whole current state, removes only its own records, and the next load migrates v1 again', () => {
    const kv = memoryKV({ [KEYS.legacy]: raw('v1-full.json') })
    const { core } = loadProgress(kv, opts())
    saveProgress(kv, { ...core, progress: { ...core.progress, name: 'After' }, settingsAt: NOW }, NOW + 1)
    const rb = rollbackToLegacy(kv, NOW + 2)
    expect(rb.ok).toBe(true)
    expect(JSON.parse(kv.get((rb as { quarantineKey: string }).quarantineKey)!).progress.name).toBe('After')
    expect(kv.get(KEYS.current)).toBeNull()
    expect(kv.get(KEYS.prefs)).toBeNull()
    expect(kv.get(KEYS.legacy)).toBe(raw('v1-full.json'))
    const again = loadProgress(kv, opts(NOW + 3))
    expect(again.report.status).toBe('migrated')
    expect(again.core.progress.name).toBe(JSON.parse(raw('v1-full.json')).name)
  })

  it('startFresh keeps the preferences and the tutor chat as well as the damaged course record', () => {
    const kv = split()
    kv.m.set(KEYS.current, '{"schemaVersion":2,"progress":{"xp":9')
    const damaged = kv.get(KEYS.current)!
    const r = startFresh(kv, opts(NOW + 1))
    expect(r.report.status).toBe('fresh')
    const kept = kv.keys(KEYS.quarantine).map(k => kv.get(k))
    expect(kept).toContain(damaged)
    expect(kept.some(v => v?.includes('"record":"prefs"') && v.includes('Mira'))).toBe(true)
    expect(kept.some(v => v?.includes('"record":"tutor"') && v.includes('Hallo'))).toBe(true)
  })

  it('preserveCurrent on an empty store has nothing to do', () => {
    expect(preserveCurrent(memoryKV(), NOW, KEYS.backup)).toEqual({ ok: true, key: null, omitted: [] })
  })
})

describe('replacements and stale slices (S1 design §6, §7 W5–W7)', () => {
  const split = () => {
    const kv = memoryKV()
    saveProgress(kv, learner(), NOW)
    return kv
  }

  it('startFresh writes the course record first; the old slices become stale and are ignored', () => {
    const kv = split()
    kv.log.length = 0
    startFresh(kv, opts(NOW + 1))
    const w = writes(kv).filter(k => !k.startsWith(KEYS.quarantine) && !k.startsWith(KEYS.backup))
    expect(w[0]).toBe(KEYS.current)
    expect(parse(kv, KEYS.current).epoch).toBeGreaterThan(0)
    expect(parse(kv, KEYS.prefs).epoch).toBe(parse(kv, KEYS.current).epoch)
    expect(loadProgress(kv, opts(NOW + 2)).core.progress.name).toBe('')
  })

  it('crash after the new course record but before the slices: the old slices are ignored, not adopted', () => {
    const kv = split()
    const oldPrefs = kv.get(KEYS.prefs)
    let seen = 0
    const flaky = faultyKV(kv, {
      set: k => {
        if (k === KEYS.current && ++seen === 1) return 'crash-after'
        return false
      },
    })
    try {
      startFresh(flaky, opts(NOW + 1))
    } catch (e) {
      expect(e).toBeInstanceOf(SimulatedCrash)
    }
    expect(kv.get(KEYS.prefs)).toBe(oldPrefs) // still the old bytes
    const r = loadProgress(kv, opts(NOW + 2))
    expect(r.core.progress.name).toBe('') // ignored: the replacement wins
    expect(r.report.sliceNotices).toEqual([])
    expect(r.report.status).toBe('ok')
  })

  it('restoreFrom picks an epoch above EVERY record, so no stale slice can be mistaken for current', () => {
    const kv = split()
    const hi = learner({ epoch: 50 })
    kv.m.set(KEYS.prefs, serializePrefs(hi)) // a slice from a higher epoch than the course record
    const source = snapshotComposite(kv, NOW + 1).key!
    const r = restoreFrom(kv, source, opts(NOW + 2))
    expect(r.core.epoch).toBeGreaterThan(50)
    expect(parse(kv, KEYS.current).epoch).toBe(r.core.epoch)
  })

  it('a stale tab (lower epoch) can neither overwrite a newer slice nor a newer course record', () => {
    const kv = split()
    const stale = learner() // epoch 0, as a tab that missed the reset would hold
    startFresh(kv, opts(NOW + 1)) // another tab resets: epoch > 0
    const after = kv.snapshot()
    const res = saveProgress(kv, { ...stale, progress: { ...stale.progress, name: 'Stale edit' }, settingsAt: NOW + 9 }, NOW + 9, {
      replace: true,
    })
    expect(res.ok && res.conflict).toBe(true)
    // nothing of the stale tab reached storage
    for (const k of [KEYS.current, KEYS.prefs, KEYS.tutor]) expect(kv.get(k)).toBe(after[k])
  })

  it('a stale slice write that slips in is detected and ignored on load, never adopted', () => {
    const kv = split()
    startFresh(kv, opts(NOW + 1))
    const e = parse(kv, KEYS.current).epoch
    // simulate the residual race: a slice of the OLD epoch lands after the replacement
    kv.m.set(KEYS.prefs, serializePrefs(learner()))
    const r = loadProgress(kv, opts(NOW + 2))
    expect(r.core.epoch).toBe(e)
    expect(r.core.progress.name).toBe('')
    expect(r.report.sliceNotices).toEqual([])
  })

  it('a conflict found AFTER a slice write is reported to the caller', () => {
    const kv = split()
    const c = learner()
    let bumped = false
    const racing = faultyKV(kv, {
      set: k => {
        if (k === KEYS.prefs && !bumped) {
          bumped = true
          // the other tab's replacement lands right after our slice write
          kv.m.set(KEYS.current, serializeCore({ ...learner({ epoch: 77 }), progress: { ...c.progress, xp: 0 } }, NOW))
        }
        return false
      },
    })
    const res = saveProgress(racing, { ...c, progress: { ...c.progress, theme: 'light' }, settingsAt: 9000 }, NOW + 1)
    expect(res.ok && res.conflict).toBe(true)
  })
})

describe('stale-shell compatibility (S1 design §6)', () => {
  it('a stale pre-P1 shell writing v1 is merged forward; preferences of the stale write never override ours; new chat lines go to the END', () => {
    const kv = memoryKV({ [KEYS.legacy]: raw('v1-full.json') })
    const first = loadProgress(kv, opts())
    const mine = {
      ...first.core,
      progress: {
        ...first.core.progress,
        name: 'Current name',
        tutor: {
          messages: [
            { id: 'k1', role: 'user' as const, text: 'one', at: 5_000 },
            { id: 'k2', role: 'ai' as const, text: 'two', at: 5_001 },
          ],
        },
      },
      settingsAt: NOW,
      tutorAt: 5_001,
    }
    saveProgress(kv, mine, NOW)
    // the stale shell writes v1 again: different name, the same two chat lines and one new one
    const v1 = JSON.parse(raw('v1-full.json'))
    kv.m.set(
      KEYS.legacy,
      JSON.stringify({
        ...v1,
        name: 'Stale name',
        xp: v1.xp + 10,
        tutor: {
          messages: [
            { id: 'k1', role: 'user', text: 'one' },
            { id: 'k2', role: 'ai', text: 'two' },
            { id: 'k3', role: 'user', text: 'three from stale' },
          ],
        },
      }),
    )
    const r = loadProgress(kv, opts(NOW + 1))
    expect(r.report.drift).toBe('merged')
    expect(r.core.progress.name).toBe('Current name')
    expect(r.core.progress.tutor.messages.map(m => m.id)).toEqual(['m1', 'k1', 'k2', 'k3']) // no duplicates, the new line last
    expect(parse(kv, KEYS.tutor).messages.map((m: { id: string }) => m.id)).toEqual(['m1', 'k1', 'k2', 'k3'])
  })

  it('after a deliberate replacement (origin dropped) a stale shell’s later v1 write is not merged', () => {
    const kv = memoryKV({ [KEYS.legacy]: raw('v1-full.json') })
    loadProgress(kv, opts())
    startFresh(kv, opts(NOW + 1)) // origin: null, higher epoch
    kv.m.set(KEYS.legacy, JSON.stringify({ ...JSON.parse(raw('v1-full.json')), xp: 9999 }))
    const r = loadProgress(kv, opts(NOW + 2))
    expect(r.report.drift).toBe('none')
    expect(r.core.progress.xp).toBe(0)
  })

  it('applyLegacyDrift keeps the tutor timestamps we already hold', () => {
    const kv = memoryKV()
    const origin = { from: 'legacy-v1' as const, migratedAt: 1, backupKey: 'k', legacyFingerprint: 'old' }
    const c = learner({ origin })
    const stale = JSON.stringify({
      xp: 5,
      tutor: {
        messages: [
          { id: 'u1', role: 'user', text: 'Hallo' },
          { id: 'zz', role: 'ai', text: 'new' },
        ],
      },
    })
    const d = applyLegacyDrift(kv, c, stale, NOW)
    expect(d.core.progress.tutor.messages.map(m => [m.id, m.at])).toEqual([
      ['u1', 1000],
      ['a1', 1001],
      ['zz', 1002],
    ])
  })
})

describe('merge rules: preferences and tutor (STO-11, STO-18)', () => {
  const m = (id: string, at: number, text = id) => ({ id, role: 'user' as const, text, at })
  const T = (messages: ReturnType<typeof m>[], clearedAt = 0) => ({ messages, clearedAt })
  const sets = [
    T([m('a', 1), m('b', 2)]),
    T([m('a', 1), m('b', 2), m('c', 3)]),
    T([m('b', 2), m('d', 4)], 1),
    T([m('x', 5)], 4),
    T([]),
    T([m('a', 1, 'DIFFERENT'), m('e', 6)]),
  ]

  it('is idempotent, commutative and associative (all combinations)', () => {
    for (const a of sets) {
      for (const b of sets) {
        expect(mergeTutor(a, b)).toEqual(mergeTutor(b, a))
        for (const c of sets) expect(mergeTutor(mergeTutor(a, b), c)).toEqual(mergeTutor(a, mergeTutor(b, c)))
      }
    }
    for (const a of sets) expect(mergeTutor(mergeTutor(a, a), a)).toEqual(mergeTutor(a, a))
  })

  it('one side extending the other yields exactly the longer side, in order', () => {
    expect(mergeTutor(T([m('a', 1), m('b', 2)]), T([m('a', 1), m('b', 2), m('c', 3)])).messages.map(x => x.id)).toEqual(['a', 'b', 'c'])
  })

  it('a clear propagates: messages at or before the watermark are dropped, later ones survive', () => {
    const out = mergeTutor(T([m('a', 1), m('b', 2), m('c', 9)]), T([], 5))
    expect(out.messages.map(x => x.id)).toEqual(['c'])
    expect(out.clearedAt).toBe(5)
  })

  it('two different messages with the same id are BOTH kept, deterministically', () => {
    const out1 = mergeTutor(T([m('a', 1, 'first')]), T([m('a', 1, 'second')]))
    const out2 = mergeTutor(T([m('a', 1, 'second')]), T([m('a', 1, 'first')]))
    expect(out1).toEqual(out2)
    expect(out1.messages.map(x => x.id)).toEqual(['a', 'a'])
    expect(out1.messages.map(x => x.text).sort()).toEqual(['first', 'second'])
  })

  it('keeps the newest 60', () => {
    const many = T(Array.from({ length: 75 }, (_, i) => m(`m${String(i).padStart(2, '0')}`, i + 1)))
    const out = mergeTutor(many, T([]))
    expect(out.messages).toHaveLength(60)
    expect(out.messages[59]!.id).toBe('m74')
  })

  it('preferences: higher epoch, then later updatedAt, then canonical JSON — a total order', () => {
    const base = learner()
    const p = (over: Partial<Core>, theme: 'dark' | 'light' = 'dark') => ({
      epoch: over.epoch ?? 0,
      updatedAt: over.settingsAt ?? 0,
      fields: { ...base.progress, theme },
    })
    expect(comparePrefs(p({ epoch: 2 }), p({ epoch: 1, settingsAt: 99 }))).toBeGreaterThan(0)
    expect(comparePrefs(p({ settingsAt: 10 }), p({ settingsAt: 9 }))).toBeGreaterThan(0)
    expect(comparePrefs(p({ settingsAt: 10 }, 'dark'), p({ settingsAt: 10 }, 'light'))).toBe(
      -comparePrefs(p({ settingsAt: 10 }, 'light'), p({ settingsAt: 10 }, 'dark')),
    )
    expect(comparePrefs(p({ settingsAt: 10 }), p({ settingsAt: 10 }))).toBe(0)
  })

  it('the whole-state merge uses the same rules (canonical form is stable)', () => {
    const a = learner()
    expect(canonicalJson(a)).toBe(canonicalJson(a))
  })
})

describe('reading the stored state', () => {
  it('readStored composes the three records', () => {
    const kv = memoryKV()
    saveProgress(kv, learner(), NOW)
    const s = readStored(kv, NOW)!
    expect(s.core.progress).toEqual(learner().progress)
    expect(s.rawPrefs).toBe(kv.get(KEYS.prefs))
    expect(s.rawTutor).toBe(kv.get(KEYS.tutor))
  })

  it('slice codecs reject what they should', () => {
    expect(readPrefs(null).state).toBe('absent')
    expect(readPrefs('{').state).toBe('damaged')
    expect(readTutor('{"record":"tutor","v":1,"messages":"x"}').state).toBe('damaged')
    expect(readTutor('{"record":"tutor","v":9,"messages":[]}').state).toBe('future')
    expect(readTutor('{"record":"tutor","v":1,"epoch":0,"messages":[{"id":"a","role":"user","text":"t"}]}')).toMatchObject({
      state: 'ok',
      rec: { messages: [{ at: 1 }] },
    })
  })

  it('a preferences/tutor record is never offered as a restorable progress copy', async () => {
    const { inspectCopies } = await import('../../src/storage/persistence')
    const kv = memoryKV()
    saveProgress(kv, learner(), NOW)
    kv.m.set(KEYS.prefs, '{"record":"prefs","v":1,')
    loadProgress(kv, opts()) // quarantines the damaged bytes
    kv.m.set(`${KEYS.quarantine}0000000000001:abc`, serializePrefs(learner()))
    const info = inspectCopies(kv, opts()).find(i => i.key.endsWith(':abc'))!
    expect(info.usable).toBe(false)
  })
})
