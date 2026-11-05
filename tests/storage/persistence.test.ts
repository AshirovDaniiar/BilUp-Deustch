// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { award, deriveCredited, totalXp } from '../../src/storage/credit'
import { defaultProgress } from '../../src/storage/defaults'
import { fingerprint } from '../../src/storage/hash'
import {
  BACKUPS_KEPT,
  detectSchema,
  KEYS,
  listRecoveryItems,
  loadProgress,
  migrateLegacy,
  restoreFrom,
  restoreFromBackup,
  startFresh,
  inspectCopies,
  rollbackToLegacy,
  saveProgress,
  serialize,
  snapshotCurrent,
  type LoadResult,
} from '../../src/storage/persistence'
import { faultyKV, memoryKV, SimulatedCrash, type MemKV } from './fakes'

const raw = (name: string) => readFileSync(join(__dirname, '../fixtures/legacy', name), 'utf8')
const NOW = 1_740_000_000_000
const IDS = { writing: new Set(['wr01', 'wr02']), quizLike: new Set(['re01']), testByUnit: { 3: 'unit-3' } }
const opts = (now = NOW) => ({ now, ids: IDS })

const withLegacy = (name: string) => memoryKV({ [KEYS.legacy]: raw(name) })
const backups = (kv: MemKV) => kv.keys(KEYS.backup)
const quarantines = (kv: MemKV) => kv.keys(KEYS.quarantine)
const current = (kv: MemKV) => (kv.get(KEYS.current) ? JSON.parse(kv.get(KEYS.current)!) : null)

/**
 * The central safety invariant: every byte string that was in storage before a load is still in storage afterwards
 * (in its own key, or as an exact copy in backup/quarantine). Rotation of OLD backups is excluded by construction (≤ 2 backups in these scenarios).
 */
function expectNothingLost(before: Record<string, string>, kv: MemKV) {
  const after = new Set(kv.m.values())
  for (const [key, value] of Object.entries(before)) expect(after.has(value), `bytes of "${key}" were lost`).toBe(true)
}

/** Everything that identifies a migrated state except time stamps — used to compare two runs. */
const stable = (r: LoadResult) => ({
  progress: r.core.progress,
  credit: r.core.credit.entries.map(({ at: _at, ...e }) => e),
  extras: r.core.extras,
  fingerprint: r.core.origin?.legacyFingerprint,
})

describe('fresh installation', () => {
  it('starts empty, writes nothing', () => {
    const kv = memoryKV()
    const r = loadProgress(kv, opts())
    expect(r.report.status).toBe('fresh')
    expect(r.core.progress).toEqual(defaultProgress())
    expect(r.core.credit.entries).toEqual([])
    expect(kv.log).toEqual([])
    expect(r.report.writesDisabled).toBe(false)
  })

  it('the first save creates the current record and nothing else', () => {
    const kv = memoryKV()
    const { core } = loadProgress(kv, opts())
    expect(saveProgress(kv, core, NOW).ok).toBe(true)
    // S1: the course record, the preferences record and the tutor record - and nothing else
    expect(kv.keys('')).toEqual([KEYS.prefs, KEYS.tutor, KEYS.current])
    expect(detectSchema(current(kv))).toBe('v2')
    expect(loadProgress(kv, opts()).report.status).toBe('ok')
  })
})

describe('existing legacy user: migration', () => {
  it('migrates a realistic record: status migrated, no issues, progress preserved exactly', () => {
    const kv = withLegacy('v1-realistic.json')
    const r = loadProgress(kv, opts())
    const original = JSON.parse(raw('v1-realistic.json'))
    expect(r.report.status).toBe('migrated')
    expect(r.report.issues).toEqual([])
    expect(r.report.fromLegacy).toBe(true)
    const { someFutureField, ...known } = original
    // the legacy tutor messages carry no time: they are stamped by position (S1 design 3.2)
    const tutor = { messages: known.tutor.messages.map((m: object, i: number) => ({ ...m, at: i + 1 })) }
    expect(r.core.progress).toEqual({ ...defaultProgress(), ...known, tutor })
    expect(r.core.extras).toEqual({ someFutureField })
  })

  it('the legacy key is left byte-for-byte untouched and never written, removed or renamed', () => {
    const kv = withLegacy('v1-realistic.json')
    const before = kv.get(KEYS.legacy)
    loadProgress(kv, opts())
    expect(kv.get(KEYS.legacy)).toBe(before)
    expect(kv.log.filter(l => l.endsWith(KEYS.legacy))).toEqual([])
  })

  it('a verified backup holding the EXACT legacy bytes is created BEFORE the new record is written', () => {
    const kv = withLegacy('v1-realistic.json')
    const r = loadProgress(kv, opts())
    expect(backups(kv)).toHaveLength(1)
    expect(kv.get(backups(kv)[0])).toBe(raw('v1-realistic.json'))
    expect(r.report.backupKey).toBe(backups(kv)[0])
    expect(kv.log.indexOf(`set:${backups(kv)[0]}`)).toBeLessThan(kv.log.indexOf(`set:${KEYS.current}`))
  })

  it('XP is preserved as an explicit, labelled opening balance; total XP = ledger sum', () => {
    const kv = withLegacy('v1-realistic.json')
    const r = loadProgress(kv, opts())
    expect(r.core.progress.xp).toBe(412)
    expect(totalXp(r.core.credit.entries)).toBe(412)
    expect(r.core.credit.entries.find(e => e.kind === 'legacy-opening')).toMatchObject({ xp: 412 })
  })

  it('legacy learners cannot re-earn first-time credit for what they already did (seeded credits)', () => {
    const kv = withLegacy('v1-realistic.json')
    const { core } = loadProgress(kv, opts())
    const credited = deriveCredited(core.credit.entries)
    for (const key of [
      'word:v1-1',
      'word:v1-2',
      'bonus:topic:articles',
      'bonus:topic:sein-haben',
      'bonus:speak:restaurant',
      'bonus:ex:wr01',
      'bonus:ex:real-wohnung',
      'bonus:daily:2025-02-03',
    ]) {
      expect(credited.has(key), key).toBe(true)
    }
    // …so replaying those activities earns nothing
    let s = core.credit
    for (const [key, amount] of [
      ['word:v1-1', 3],
      ['bonus:topic:articles', 20],
      ['bonus:speak:restaurant', 20],
      ['bonus:ex:wr01', 15],
      ['bonus:ex:real-wohnung', 10],
      ['bonus:daily:2025-02-03', 25],
    ] as const) {
      const r = award(s, key, amount, NOW)
      expect(r.awarded, key).toBe(0)
      s = r.state
    }
    // items never practised (v1-3 has seen: 0; daily 2025-02-05 had no speaking) are still creditable
    expect(award(s, 'word:v1-3', 3, NOW).awarded).toBe(3)
    expect(award(s, 'bonus:daily:2025-02-05', 25, NOW).awarded).toBe(25)
    // a completion key that is not a writing task / real-life topic does not create a bogus credit
    expect(credited.has('bonus:ex:somelistening-1')).toBe(false)
  })

  it('the migrated record round-trips: reloading gives status ok and the identical state', () => {
    const kv = withLegacy('v1-realistic.json')
    const first = loadProgress(kv, opts())
    const second = loadProgress(kv, opts(NOW + 1000))
    expect(second.report.status).toBe('ok')
    expect(second.core).toEqual(first.core)
  })

  it.each(['v1-full.json', 'v1-minimal.json', 'v1-partial-scores.json', 'v1-unknown-fields.json'])(
    '%s migrates without losing information',
    name => {
      const kv = withLegacy(name)
      const before = kv.snapshot()
      const r = loadProgress(kv, opts())
      expect(r.report.status).toBe('migrated')
      expect(r.report.issues).toEqual([])
      expectNothingLost(before, kv)
      expect(r.core.progress.xp).toBe(JSON.parse(raw(name)).xp ?? 0)
    },
  )

  it('empty object "{}" is a valid empty record', () => {
    const kv = memoryKV({ [KEYS.legacy]: '{}' })
    expect(loadProgress(kv, opts()).report.status).toBe('migrated')
  })
})

describe('partially corrupted legacy data → repaired, nothing lost', () => {
  it('wrong types: usable fields kept (numeric xp salvaged), invalid ones reported, exact original preserved in a backup', () => {
    const kv = withLegacy('malformed-wrong-types.json')
    const before = kv.snapshot()
    const r = loadProgress(kv, opts())
    expect(r.report.status).toBe('migrated')
    expect(r.report.issues.length).toBeGreaterThanOrEqual(3)
    expect(r.core.progress.xp).toBe(100)
    expect(Array.isArray(r.core.progress.activeDates)).toBe(true)
    expect(kv.get(r.report.backupKey!)).toBe(raw('malformed-wrong-types.json'))
    expectNothingLost(before, kv)
  })

  it('a string xp is migrated as a number and the opening balance matches', () => {
    const kv = withLegacy('malformed-xp-string.json')
    const r = loadProgress(kv, opts())
    expect(r.core.progress.xp).toBe(100)
    expect(totalXp(r.core.credit.entries)).toBe(100)
  })

  it('scores/tutor null: defaults, no crash', () => {
    const kv = withLegacy('malformed-scores-null.json')
    const r = loadProgress(kv, opts())
    expect(r.core.progress.scores.vocabulary).toEqual([])
    expect(r.core.progress.tutor).toEqual({ messages: [] })
  })

  it('a record with mixed good and bad entries keeps every good entry', () => {
    const blob = JSON.stringify({
      xp: 50,
      completed: ['1:vocabulary', 7, 'topic:x'],
      mastery: { a: { box: 2, due: 1, seen: 2, wrong: 0 }, b: 'bad' },
      mistakes: [{ at: 1, kind: 'grammar', ref: 'r' }, { bogus: true }],
    })
    const kv = memoryKV({ [KEYS.legacy]: blob })
    const r = loadProgress(kv, opts())
    expect(r.core.progress.completed).toEqual(['1:vocabulary', 'topic:x'])
    expect(Object.keys(r.core.progress.mastery)).toEqual(['a'])
    expect(r.core.progress.mistakes).toHaveLength(1)
    expect(r.core.progress.xp).toBe(50)
    expect(kv.get(r.report.backupKey!)).toBe(blob)
  })
})

describe('fully corrupted legacy data → quarantined, never overwritten, never deleted', () => {
  it.each([
    ['malformed-truncated-json.txt', 'not valid JSON'],
    ['malformed-null.json', 'not an object'],
    ['malformed-array.json', 'not an object'],
  ])('%s (%s)', (name, why) => {
    const kv = withLegacy(name)
    const before = kv.snapshot()
    const r = loadProgress(kv, opts())
    expect(r.report.status).toBe('unreadable')
    expect(r.report.reason).toMatch(new RegExp(why.split(' ').slice(-1)[0]))
    expect(r.core.progress).toEqual(defaultProgress())
    expect(kv.get(KEYS.legacy)).toBe(raw(name)) // untouched
    expect(kv.get(KEYS.current)).toBeNull() // nothing was written over anything
    expect(quarantines(kv)).toHaveLength(1)
    expect(kv.get(quarantines(kv)[0])).toBe(raw(name)) // exact bytes
    expectNothingLost(before, kv)
  })

  it.each(['"just a string"', '12345', 'true', '{"completely":"foreign","data":[1,2,3]}', ''])(
    'inline %j is unreadable but preserved',
    blob => {
      const kv = memoryKV({ [KEYS.legacy]: blob })
      const r = loadProgress(kv, opts())
      expect(r.report.status).toBe('unreadable')
      expect(kv.get(KEYS.legacy)).toBe(blob)
      expectNothingLost({ [KEYS.legacy]: blob }, kv)
    },
  )

  it('later saves do not touch the unreadable legacy bytes either', () => {
    const kv = withLegacy('malformed-truncated-json.txt')
    const { core } = loadProgress(kv, opts())
    saveProgress(kv, core, NOW + 1)
    expect(kv.get(KEYS.legacy)).toBe(raw('malformed-truncated-json.txt'))
    expect(loadProgress(kv, opts()).report.status).toBe('ok')
  })
})

describe('interrupted migration (crash at every possible write)', () => {
  const full = () => {
    const kv = withLegacy('v1-realistic.json')
    loadProgress(kv, opts())
    return kv
  }

  it('crashing at ANY write leaves the legacy data intact, never a half-written record, and the next load completes the migration identically', () => {
    const reference = stable(loadProgress(full(), opts()))
    const totalWrites = full().log.length
    expect(totalWrites).toBeGreaterThanOrEqual(2) // backup + record (+ verification reads)
    for (const fault of ['crash-before', 'crash-after'] as const) {
      for (let n = 1; n <= totalWrites; n++) {
        const base = withLegacy('v1-realistic.json')
        const before = base.snapshot()
        const flaky = faultyKV(base, { set: (_k, nth) => (nth === n ? fault : false) })
        // the crash escapes `loadProgress` only if the guard fails; it must be contained and reported
        const first = loadProgress(flaky, opts())
        expect(first.core.progress).toBeDefined()
        expect(base.get(KEYS.legacy), `${fault}@${n}`).toBe(before[KEYS.legacy])
        // the destination is either absent or a complete, valid record — never partial
        const cur = base.get(KEYS.current)
        if (cur !== null) expect(detectSchema(JSON.parse(cur)), `${fault}@${n}`).toBe('v2')
        // recovery: the next healthy start finishes the job with the same result
        const second = loadProgress(base, opts())
        expect(['migrated', 'ok'], `${fault}@${n}`).toContain(second.report.status)
        expect(stable(second), `${fault}@${n}`).toEqual(reference)
        expectNothingLost(before, base)
        expect(backups(base).length, `${fault}@${n} duplicate backups`).toBeLessThanOrEqual(1)
        // …and a further load changes nothing
        const third = loadProgress(base, opts(NOW + 5))
        expect(third.report.status).toBe('ok')
        expect(third.core.progress).toEqual(second.core.progress)
        expect(totalXp(third.core.credit.entries)).toBe(412)
      }
    }
  })

  it('a crash escaping from storage is contained by loadProgress (the app starts, in memory, without writing)', () => {
    const base = withLegacy('v1-realistic.json')
    const flaky = faultyKV(base, { set: () => 'crash-before' })
    const r = loadProgress(flaky, opts())
    expect(r.core.progress.xp).toBe(412) // the learner’s data is still shown
    expect(base.get(KEYS.current)).toBeNull()
    expect(base.get(KEYS.legacy)).toBe(raw('v1-realistic.json'))
    expect(SimulatedCrash).toBeDefined()
  })

  it('a "lying" write (stored value differs from what was written) is detected by read-back and the unverified record is removed', () => {
    const base = withLegacy('v1-realistic.json')
    const flaky = faultyKV(base, { set: k => (k === KEYS.current ? 'lie' : false) })
    const r = loadProgress(flaky, opts())
    expect(r.report.status).toBe('unwritable')
    expect(base.get(KEYS.current)).toBeNull()
    expect(base.get(KEYS.legacy)).toBe(raw('v1-realistic.json'))
    expect(r.core.progress.xp).toBe(412)
  })
})

describe('repeated migration is idempotent', () => {
  it('loading twice migrates once: one backup, one record, identical state, no second write of the record', () => {
    const kv = withLegacy('v1-realistic.json')
    const a = loadProgress(kv, opts())
    const writesAfterFirst = kv.log.length
    const b = loadProgress(kv, opts(NOW + 10_000))
    expect(b.report.status).toBe('ok')
    expect(b.core).toEqual(a.core)
    expect(kv.log.length).toBe(writesAfterFirst) // the second load wrote nothing
    expect(backups(kv)).toHaveLength(1)
  })

  it('calling migrateLegacy repeatedly (even after the record was removed) yields the same state, one backup, and never doubles XP', () => {
    const kv = withLegacy('v1-realistic.json')
    const results: LoadResult[] = []
    for (let i = 0; i < 4; i++) {
      kv.remove(KEYS.current)
      results.push(migrateLegacy(kv, raw('v1-realistic.json'), opts(NOW + i * 1000)))
    }
    for (const r of results) {
      expect(r.report.status).toBe('migrated')
      expect(stable(r)).toEqual(stable(results[0]))
      expect(r.core.progress.xp).toBe(412)
      expect(totalXp(r.core.credit.entries)).toBe(412)
    }
    expect(backups(kv)).toHaveLength(1)
  })

  it('migration then play then reload: XP earned after migration is added once and the opening balance is not re-applied', () => {
    const kv = withLegacy('v1-realistic.json')
    const first = loadProgress(kv, opts())
    const earned = award(first.core.credit, 'word:v1-3', 3, NOW + 1)
    const core = { ...first.core, credit: earned.state, progress: { ...first.core.progress, xp: first.core.progress.xp + earned.awarded } }
    saveProgress(kv, core, NOW + 2)
    const again = loadProgress(kv, opts(NOW + 3))
    expect(again.report.status).toBe('ok')
    expect(again.core.progress.xp).toBe(415)
    expect(totalXp(again.core.credit.entries)).toBe(415)
  })
})

describe('corrupted CURRENT record → quarantined, candidate proposed IN MEMORY, nothing replaced without the learner', () => {
  const corruptedCurrent = '{"schemaVersion":2,"courseId":"de-general","progress":{"xp":9'

  it('unparseable record + legacy present → exact bytes quarantined, legacy proposed as a candidate, the stored record is NOT overwritten', () => {
    const kv = memoryKV({ [KEYS.legacy]: raw('v1-realistic.json'), [KEYS.current]: corruptedCurrent })
    const before = kv.snapshot()
    const r = loadProgress(kv, opts())
    expect(r.report.status).toBe('recovery-pending')
    expect(r.report.writesDisabled).toBe(true)
    expect(r.report.candidate).toMatchObject({ key: KEYS.legacy, kind: 'legacy', xp: 412 })
    expect(r.core.progress.xp).toBe(412) // shown in memory
    expect(kv.get(r.report.quarantineKey!)).toBe(corruptedCurrent)
    expect(kv.get(KEYS.current)).toBe(corruptedCurrent) // untouched: no automatic replacement
    expect(kv.get(KEYS.legacy)).toBe(raw('v1-realistic.json'))
    expect(kv.log.filter(l => l === `set:${KEYS.current}`)).toEqual([])
    expectNothingLost(before, kv)
  })

  it('confirming the candidate (restoreFrom) quarantines again if needed, replaces the record, bumps the epoch, and the next start is healthy', () => {
    const kv = memoryKV({ [KEYS.legacy]: raw('v1-realistic.json'), [KEYS.current]: corruptedCurrent })
    const pending = loadProgress(kv, opts())
    const res = restoreFrom(kv, pending.report.candidate!.key, opts(NOW + 1))
    expect(res.report.status).toBe('recovered')
    expect(res.core.progress.xp).toBe(412)
    expect(res.core.epoch).toBeGreaterThan(0)
    expect(kv.get(res.report.quarantineKey!)).toBe(corruptedCurrent)
    expect(kv.log.indexOf(`set:${res.report.quarantineKey}`)).toBeLessThan(kv.log.lastIndexOf(`set:${KEYS.current}`))
    expect(detectSchema(current(kv))).toBe('v2')
    expect(loadProgress(kv, opts(NOW + 2)).report.status).toBe('ok')
  })

  it('no legacy but an intact backup → proposed as a candidate (newest first); a backup whose bytes no longer match its fingerprint is never offered', () => {
    const kv = memoryKV()
    const good = `${KEYS.backup}0000000000001:${fingerprint(raw('v1-full.json'))}`
    kv.m.set(good, raw('v1-full.json'))
    kv.m.set(`${KEYS.backup}0000000000002:${fingerprint('something else')}`, raw('v1-realistic.json')) // newer but tampered / bit-rotted
    kv.m.set(KEYS.current, corruptedCurrent)
    const r = loadProgress(kv, opts())
    expect(r.report.status).toBe('recovery-pending')
    expect(r.report.candidate).toMatchObject({ key: good, kind: 'backup', xp: 340 })
    expect(kv.get(KEYS.current)).toBe(corruptedCurrent)
  })

  it('no legacy and no backup → unreadable: session runs from memory, writes disabled until the learner chooses "start fresh"; nothing is deleted', () => {
    const kv = memoryKV({ [KEYS.current]: corruptedCurrent })
    const before = kv.snapshot()
    const r = loadProgress(kv, opts())
    expect(r.report.status).toBe('unreadable')
    expect(r.report.writesDisabled).toBe(true)
    expect(r.core.progress).toEqual(defaultProgress())
    expect(kv.get(r.report.quarantineKey!)).toBe(corruptedCurrent)
    expect(kv.get(KEYS.current)).toBe(corruptedCurrent)
    expectNothingLost(before, kv)
  })

  it('startFresh (explicit): damaged bytes are quarantined first, then the record is replaced with an empty one at a higher epoch', () => {
    const kv = memoryKV({ [KEYS.current]: corruptedCurrent })
    const res = startFresh(kv, opts(NOW + 5))
    expect(res.report.status).toBe('fresh')
    expect(kv.get(res.report.quarantineKey!)).toBe(corruptedCurrent)
    expect(kv.log.indexOf(`set:${res.report.quarantineKey}`)).toBeLessThan(kv.log.lastIndexOf(`set:${KEYS.current}`))
    expect(current(kv).epoch).toBeGreaterThan(0)
    expect(loadProgress(kv, opts(NOW + 6)).report.status).toBe('ok')
  })

  it('a record of the right shape but invalid contents is repaired in place, original bytes quarantined BEFORE the rewrite', () => {
    const bad = JSON.stringify({
      schemaVersion: 2,
      courseId: 'de-general',
      updatedAt: 1,
      progress: { xp: 'abc', completed: 'x', lang: 'fr' },
      credit: { entries: [] },
      extras: {},
      origin: null,
    })
    const kv = memoryKV({ [KEYS.current]: bad })
    const r = loadProgress(kv, opts())
    expect(r.report.status).toBe('repaired')
    expect(r.report.issues.length).toBeGreaterThanOrEqual(3)
    expect(kv.get(r.report.quarantineKey!)).toBe(bad)
    expect(kv.log.indexOf(`set:${r.report.quarantineKey}`)).toBeLessThan(kv.log.indexOf(`set:${KEYS.current}`))
    expect(loadProgress(kv, opts(NOW + 1)).report.status).toBe('ok') // repaired output is stable
  })

  it('a record written by the previous P1 build (no activity / epoch / settings fields) loads cleanly and upgrades in place on the next save', () => {
    const old = JSON.stringify({
      schemaVersion: 2,
      courseId: 'de-general',
      updatedAt: 1,
      progress: { name: 'Mira', xp: 15, completed: ['topic:a'] },
      credit: {
        entries: [{ id: 'bonus:topic:a@15', kind: 'earn', key: 'bonus:topic:a', xp: 15, creditedTo: 15, policyVersion: 'p1-1', at: 1 }],
      },
      extras: {},
      origin: null,
    })
    const kv = memoryKV({ [KEYS.current]: old })
    const r = loadProgress(kv, opts())
    expect(r.report.status).toBe('ok')
    expect(r.report.issues).toEqual([])
    expect(r.core.activity.completions['topic:a']).toMatchObject({ source: 'migration', firstPassedAt: null }) // grandfathered, silently
    expect(r.core.epoch).toBe(0)
    // S1: loading a monolith (development-profile) record performs the one-time split - exact-bytes backup first, the slices next, the core last
    expect(r.report.upgraded).toBe(true)
    expect(kv.log.map(l => l.replace(/:\d{13}:.*/, ':<backup>'))).toEqual([
      `set:${KEYS.backup}<backup>`,
      `set:${KEYS.prefs}`,
      `set:${KEYS.tutor}`,
      `set:${KEYS.current}`,
    ])
    expect(kv.get(backups(kv)[0]!)).toBe(old) // the complete original bytes
    const changed = { ...r.core, progress: { ...r.core.progress, name: 'Mira B' }, settingsAt: NOW }
    expect(saveProgress(kv, changed, NOW, { lastRaw: old }).ok).toBe(true)
    expect(current(kv).activity.completions['topic:a']).toBeDefined()
    expect(current(kv).epoch).toBe(0)
    expect(loadProgress(kv, opts(NOW + 1)).report.status).toBe('ok')
  })

  it('if the quarantine copy cannot be written, the corrupt record is NOT overwritten and the session is read-only', () => {
    const base = memoryKV({ [KEYS.current]: corruptedCurrent, [KEYS.legacy]: raw('v1-full.json') })
    const flaky = faultyKV(base, { set: () => 'quota' })
    const r = loadProgress(flaky, opts())
    expect(r.report.status).toBe('unwritable')
    expect(r.report.writesDisabled).toBe(true)
    expect(base.get(KEYS.current)).toBe(corruptedCurrent)
    expect(base.get(KEYS.legacy)).toBe(raw('v1-full.json'))
  })

  it('the same quarantined bytes are stored once, however often the load repeats', () => {
    const kv = memoryKV({ [KEYS.current]: corruptedCurrent })
    for (let i = 0; i < 3; i++) loadProgress(kv, opts(NOW + i))
    expect(quarantines(kv)).toHaveLength(1)
  })

  it('restoreFrom refuses a copy that fails its integrity check, a non-copy key, and an unusable copy — changing nothing', () => {
    const kv = memoryKV({ [KEYS.current]: corruptedCurrent })
    const rotted = `${KEYS.backup}0000000000001:${fingerprint('original bytes')}`
    kv.m.set(rotted, 'different bytes now')
    const garbage = `${KEYS.backup}0000000000002:${fingerprint('not json')}`
    kv.m.set(garbage, 'not json')
    const before = kv.snapshot()
    expect(restoreFrom(kv, rotted, opts()).report.reason).toMatch(/integrity/)
    expect(restoreFrom(kv, garbage, opts()).report.reason).toMatch(/not usable/)
    expect(restoreFrom(kv, KEYS.current, opts()).report.reason).toMatch(/not a recoverable copy/)
    expect(restoreFrom(kv, `${KEYS.backup}missing`, opts()).report.reason).toMatch(/not found/)
    expect(kv.snapshot()).toEqual(before)
  })

  it('inspectCopies verifies without writing and only marks intact + usable copies restorable', () => {
    const kv = withLegacy('v1-full.json')
    loadProgress(kv, opts()) // creates a backup of the legacy bytes
    kv.m.set(`${KEYS.backup}0000000000009:${fingerprint('x')}`, 'tampered')
    kv.m.set(`${KEYS.quarantine}0000000000003:${fingerprint('{bad')}`, '{bad')
    const before = kv.log.length
    const info = inspectCopies(kv, opts())
    expect(kv.log.length).toBe(before)
    const byKind = (k: string) => info.filter(i => i.kind === k)
    expect(byKind('legacy')[0]).toMatchObject({ intact: true, usable: true, restorable: true, xp: 340 })
    expect(byKind('backup').filter(i => i.restorable)).toHaveLength(1)
    expect(byKind('backup').filter(i => !i.intact)).toHaveLength(1)
    expect(byKind('quarantine')[0]).toMatchObject({ intact: true, usable: false, restorable: false })
  })
})

describe('XP / ledger consistency on load', () => {
  const rec = (progressXp: number, entries: unknown[]) =>
    JSON.stringify({
      schemaVersion: 2,
      courseId: 'de-general',
      updatedAt: 1,
      progress: { xp: progressXp },
      credit: { entries },
      extras: {},
      origin: null,
    })

  it('stored XP above the ledger is preserved with an explicit reconcile entry (never lowered)', () => {
    const kv = memoryKV({ [KEYS.current]: rec(300, []) })
    const r = loadProgress(kv, opts())
    expect(r.report.status).toBe('repaired')
    expect(r.report.reconciledXp).toBe(300)
    expect(r.core.progress.xp).toBe(300)
    expect(totalXp(r.core.credit.entries)).toBe(300)
    expect(loadProgress(kv, opts(NOW + 1)).report.status).toBe('ok')
  })

  it('a ledger above the stored XP wins (permanent record)', () => {
    const entry = { id: 'a@50', kind: 'earn', key: 'a', xp: 50, creditedTo: 50, policyVersion: 'p', at: 1 }
    const r = loadProgress(memoryKV({ [KEYS.current]: rec(10, [entry]) }), opts())
    expect(r.core.progress.xp).toBe(50)
  })

  it('duplicate ledger entries are collapsed: replaying persisted data cannot inflate XP', () => {
    const entry = { id: 'a@50', kind: 'earn', key: 'a', xp: 50, creditedTo: 50, policyVersion: 'p', at: 1 }
    const r = loadProgress(memoryKV({ [KEYS.current]: rec(50, [entry, entry, entry]) }), opts())
    expect(r.core.progress.xp).toBe(50)
    expect(r.core.credit.entries).toHaveLength(1)
  })

  it('credit state survives save → load unchanged', () => {
    const kv = memoryKV()
    let { core } = loadProgress(kv, opts())
    for (const [k, n] of [
      ['topic:a', 20],
      ['word:b', 3],
      ['daily:2025-03-01', 25],
    ] as const) {
      const r = award(core.credit, k, n, NOW)
      core = { ...core, credit: r.state, progress: { ...core.progress, xp: core.progress.xp + r.awarded } }
    }
    saveProgress(kv, core, NOW)
    const back = loadProgress(kv, opts(NOW + 1))
    expect(back.report.status).toBe('ok')
    expect(back.core).toEqual(core)
    expect(back.core.progress.xp).toBe(48)
  })
})

describe('storage failures and special states', () => {
  it('storage unreadable at start → app runs from memory, no write attempted', () => {
    const base = withLegacy('v1-realistic.json')
    const r = loadProgress(faultyKV(base, { get: () => true }), opts())
    expect(r.report.status).toBe('unwritable')
    expect(r.report.writesDisabled).toBe(true)
    expect(base.log).toEqual([])
  })

  it('backup cannot be written → migration is NOT attempted, nothing is written, learner data still shown from memory, read-only', () => {
    const base = withLegacy('v1-realistic.json')
    const flaky = faultyKV(base, { set: () => 'quota' })
    const r = loadProgress(flaky, opts())
    expect(r.report.status).toBe('unwritable')
    expect(r.report.writesDisabled).toBe(true)
    expect(r.report.reason).toMatch(/backup failed/)
    expect(base.get(KEYS.current)).toBeNull()
    expect(r.core.progress.xp).toBe(412)
  })

  it('record cannot be written (quota) after a good backup → state shown, not read-only (later saves retry), legacy intact, no partial record', () => {
    const base = withLegacy('v1-realistic.json')
    const flaky = faultyKV(base, { set: k => (k === KEYS.current ? 'quota' : false) })
    const r = loadProgress(flaky, opts())
    expect(r.report.status).toBe('unwritable')
    expect(r.report.writesDisabled).toBe(false)
    expect(base.get(KEYS.current)).toBeNull()
    expect(backups(base)).toHaveLength(1)
    // a later healthy start completes the migration
    expect(loadProgress(base, opts(NOW + 1)).report.status).toBe('migrated')
  })

  it('a record from a NEWER schema version is never overwritten: read-only, defaults in memory', () => {
    const future = JSON.stringify({ schemaVersion: 3, progress: { xp: 1 }, whatever: true })
    const kv = memoryKV({ [KEYS.current]: future, [KEYS.legacy]: raw('v1-full.json') })
    const r = loadProgress(kv, opts())
    expect(r.report.status).toBe('future-version')
    expect(r.report.writesDisabled).toBe(true)
    expect(kv.log).toEqual([])
    expect(kv.get(KEYS.current)).toBe(future)
  })

  it('saveProgress reports failure instead of throwing', () => {
    const kv = memoryKV()
    const { core } = loadProgress(kv, opts())
    const res = saveProgress(faultyKV(kv, { set: () => 'quota' }), core, NOW)
    expect(res.ok).toBe(false)
    expect(res.ok === false && res.error.message).toMatch(/quota/)
  })

  it('drift: progress written to the legacy key by a STALE app version is merged FORWARD exactly once (XP as a delta, completions as a union)', () => {
    const kv = withLegacy('v1-realistic.json')
    loadProgress(kv, opts())
    const stale = {
      ...JSON.parse(raw('v1-realistic.json')),
      xp: 450,
      completed: [...JSON.parse(raw('v1-realistic.json')).completed, 'topic:dativ'],
    }
    kv.m.set(KEYS.legacy, JSON.stringify(stale))
    const r = loadProgress(kv, opts(NOW + 1))
    expect(r.report.status).toBe('ok')
    expect(r.report.drift).toBe('merged')
    expect(r.report.legacyChangedAfterMigration).toBe(true)
    expect(r.core.progress.xp).toBe(412 + 38)
    expect(r.core.progress.completed).toContain('topic:dativ')
    expect(r.core.activity.completions['topic:dativ']).toBeDefined()
    expect(totalXp(r.core.credit.entries)).toBe(450)
    // idempotent: the same legacy bytes are never merged twice, and nothing else is written
    const writes = kv.log.length
    const again = loadProgress(kv, opts(NOW + 2))
    expect(again.report.drift).toBe('none')
    expect(again.core.progress.xp).toBe(450)
    expect(kv.log.length).toBe(writes)
    // the stale bytes are preserved in a backup, and the pristine pre-migration backup still exists
    expect(Object.values(kv.snapshot())).toContain(JSON.stringify(stale))
    expect(Object.values(kv.snapshot())).toContain(raw('v1-realistic.json'))
  })

  it('drift: a stale version that keeps writing is merged each time with its XP increase counted only once per write', () => {
    const kv = withLegacy('v1-realistic.json')
    loadProgress(kv, opts())
    const base = JSON.parse(raw('v1-realistic.json'))
    for (const [n, xp] of [
      [1, 430],
      [2, 460],
      [3, 460],
    ] as const) {
      kv.m.set(KEYS.legacy, JSON.stringify({ ...base, xp, name: `Stale ${n}` }))
      loadProgress(kv, opts(NOW + n))
    }
    const final = loadProgress(kv, opts(NOW + 9))
    expect(final.core.progress.xp).toBe(460)
    expect(totalXp(final.core.credit.entries)).toBe(460)
    expect(final.core.progress.name).toBe('Aizada') // the current settings win over stale ones
  })

  it('drift: an unreadable stale write is preserved in a backup, reported, not retried forever, and does not touch the current progress', () => {
    const kv = withLegacy('v1-realistic.json')
    loadProgress(kv, opts())
    kv.m.set(KEYS.legacy, '{truncated')
    const r = loadProgress(kv, opts(NOW + 1))
    expect(r.report.drift).toBe('unreadable')
    expect(r.core.progress.xp).toBe(412)
    expect(Object.values(kv.snapshot())).toContain('{truncated')
    expect(loadProgress(kv, opts(NOW + 2)).report.drift).toBe('none')
  })

  it('drift: if the drifted bytes cannot be backed up, nothing is merged yet (retried at the next start)', () => {
    const base = withLegacy('v1-realistic.json')
    loadProgress(base, opts())
    base.m.set(KEYS.legacy, JSON.stringify({ ...JSON.parse(raw('v1-realistic.json')), xp: 999 }))
    const flaky = faultyKV(base, { set: () => 'quota' })
    const r = loadProgress(flaky, opts(NOW + 1))
    expect(r.report.drift).toBe('deferred')
    expect(r.core.progress.xp).toBe(412)
    expect(loadProgress(base, opts(NOW + 2)).core.progress.xp).toBe(999)
  })

  it('the pristine pre-migration backup survives any amount of later backup rotation', () => {
    const kv = withLegacy('v1-full.json')
    const first = loadProgress(kv, opts())
    const pristine = first.report.backupKey!
    for (let i = 1; i <= 6; i++) {
      kv.m.set(KEYS.legacy, JSON.stringify({ ...JSON.parse(raw('v1-full.json')), xp: 340 + i }))
      loadProgress(kv, opts(NOW + i))
      snapshotCurrent(kv, NOW + 100 + i)
    }
    expect(kv.get(pristine)).toBe(raw('v1-full.json'))
    expect(backups(kv).length).toBeLessThanOrEqual(BACKUPS_KEPT + 1)
  })

  it('no drift reported when the legacy key is unchanged', () => {
    const kv = withLegacy('v1-realistic.json')
    loadProgress(kv, opts())
    expect(loadProgress(kv, opts(NOW + 1)).report.legacyChangedAfterMigration).toBe(false)
  })
})

describe('backups: rotation, restore, rollback', () => {
  it('keeps only the newest backups and never removes the one just created', () => {
    const kv = memoryKV()
    for (let i = 1; i <= 5; i++) {
      kv.m.set(KEYS.legacy, JSON.stringify({ xp: i }))
      kv.m.delete(KEYS.current)
      migrateLegacy(kv, kv.get(KEYS.legacy)!, opts(NOW + i * 1000))
    }
    expect(backups(kv)).toHaveLength(BACKUPS_KEPT + 1) // the newest (pinned as the record's origin) + the 2 newest unpinned
    const newest = backups(kv).map(k => kv.get(k))
    expect(newest).toContain(JSON.stringify({ xp: 5 }))
  })

  it('rotation never touches quarantined data or the legacy key', () => {
    const kv = memoryKV({ [KEYS.legacy]: raw('v1-full.json') })
    const q = `${KEYS.quarantine}0000000000001:abc`
    kv.m.set(q, 'precious')
    for (let i = 0; i < 4; i++) {
      kv.m.delete(KEYS.current)
      migrateLegacy(kv, JSON.stringify({ xp: i + 1 }), opts(NOW + i * 1000))
    }
    expect(kv.get(q)).toBe('precious')
    expect(kv.get(KEYS.legacy)).toBe(raw('v1-full.json'))
  })

  it('snapshotCurrent stores an exact copy of the current record and rotates', () => {
    const kv = memoryKV()
    const { core } = loadProgress(kv, opts())
    saveProgress(kv, core, NOW)
    const key = snapshotCurrent(kv, NOW + 1)
    // S1 interim snapshot rule: ONE record in the monolith format that holds core + preferences + tutor (nothing is omitted)
    const snap = JSON.parse(kv.get(key!)!)
    expect(detectSchema(snap)).toBe('v2')
    expect(snap.layout).toBeUndefined()
    expect(snap.progress.lang).toBe(core.progress.lang)
    expect(snap.progress.tutor).toEqual({ messages: [] })
    expect(snapshotCurrent(memoryKV(), NOW)).toBeNull() // nothing to snapshot
  })

  it('restoreFromBackup: explicit recovery of a v2 snapshot — the replaced record is quarantined first', () => {
    const kv = memoryKV()
    let { core } = loadProgress(kv, opts())
    const r = award(core.credit, 'topic:x', 20, NOW)
    core = { ...core, credit: r.state, progress: { ...core.progress, xp: 20 } }
    saveProgress(kv, core, NOW)
    const snapshot = snapshotCurrent(kv, NOW + 1)!
    // the learner then loses data (e.g. reset)
    saveProgress(kv, { ...core, credit: { entries: [] }, progress: defaultProgress() }, NOW + 2, { replace: true })
    const damaged = kv.get(KEYS.current)!
    const res = restoreFromBackup(kv, snapshot, opts(NOW + 3))
    expect(res.report.status).toBe('recovered')
    expect(res.core.progress.xp).toBe(20)
    expect(res.core.credit.entries.map(e => e.id)).toEqual(['topic:x@20'])
    // the replaced state is kept in full (S1: as one composite record), so nothing is lost
    expect(damaged).toBeTruthy()
    const kept = JSON.parse(kv.get(res.report.quarantineKey!)!)
    expect(kept.credit.entries).toEqual([])
    expect(kept.progress.xp).toBe(0)
    expect(loadProgress(kv, opts(NOW + 4)).core.progress.xp).toBe(20)
  })

  it('restoreFromBackup of a legacy backup re-migrates it; missing or unusable backups fail safely without changing anything', () => {
    const kv = withLegacy('v1-full.json')
    const first = loadProgress(kv, opts())
    const res = restoreFromBackup(kv, first.report.backupKey!, opts(NOW + 1))
    expect(res.report.status).toBe('recovered')
    expect(res.core.progress.xp).toBe(340)
    const before = kv.snapshot()
    const missing = restoreFromBackup(kv, `${KEYS.backup}nope`, opts(NOW + 2))
    expect(missing.report.status).toBe('unwritable')
    kv.m.set(`${KEYS.backup}9999999999999:zz`, 'garbage')
    const bad = restoreFromBackup(kv, `${KEYS.backup}9999999999999:zz`, opts(NOW + 3))
    expect(bad.report.status).toBe('unwritable')
    expect(kv.get(KEYS.current)).toBe(before[KEYS.current])
  })

  it('rollbackToLegacy: the current record is quarantined (not deleted); the next load re-migrates from the untouched legacy key', () => {
    const kv = withLegacy('v1-full.json')
    const { core } = loadProgress(kv, opts())
    const r = award(core.credit, 'topic:z', 20, NOW)
    saveProgress(kv, { ...core, credit: r.state, progress: { ...core.progress, xp: core.progress.xp + 20 } }, NOW + 1)
    const withNewProgress = kv.get(KEYS.current)!
    const rb = rollbackToLegacy(kv, NOW + 2)
    expect(rb.ok).toBe(true)
    expect(kv.get(KEYS.current)).toBeNull()
    // post-migration progress is preserved, not lost (S1: one composite record holding core + preferences + tutor)
    expect(withNewProgress).toBeTruthy()
    const kept = rb.ok ? JSON.parse(kv.get(rb.quarantineKey!)!) : null
    expect(kept.progress.xp).toBe(360)
    expect(kv.get(KEYS.prefs)).toBeNull() // the app's own slices are removed only after the copy exists
    expect(kv.get(KEYS.tutor)).toBeNull()
    const after = loadProgress(kv, opts(NOW + 3))
    expect(after.report.status).toBe('migrated')
    expect(after.core.progress.xp).toBe(340)
    expect(kv.get(KEYS.legacy)).toBe(raw('v1-full.json'))
  })

  it('rollbackToLegacy refuses when there is no legacy record', () => {
    const kv = memoryKV()
    const { core } = loadProgress(kv, opts())
    saveProgress(kv, core, NOW)
    expect(rollbackToLegacy(kv, NOW).ok).toBe(false)
    expect(kv.get(KEYS.current)).not.toBeNull()
  })

  it('listRecoveryItems returns the exact bytes of backups, quarantine and the legacy record', () => {
    const kv = withLegacy('malformed-truncated-json.txt')
    loadProgress(kv, opts())
    const items = listRecoveryItems(kv)
    expect(items.map(i => i.kind).sort()).toEqual(['legacy', 'quarantine'])
    for (const i of items) expect(i.raw).toBe(raw('malformed-truncated-json.txt'))
  })
})

describe('schema detection and serialisation', () => {
  it.each([
    [{ schemaVersion: 2, progress: {} }, 'v2'],
    [{ schemaVersion: 2 }, 'invalid'],
    [{ schemaVersion: 3, progress: {} }, 'future'],
    [{ schemaVersion: 1 }, 'invalid'],
    [{ schemaVersion: '2', progress: {} }, 'invalid'],
    [{ schemaVersion: 0 }, 'invalid'],
    [{ xp: 1 }, 'legacy'],
    [{}, 'legacy'],
    [null, 'invalid'],
    [[], 'invalid'],
    ['x', 'invalid'],
  ])('detectSchema(%j) = %s', (value, kind) => {
    expect(detectSchema(value)).toBe(kind)
  })

  it('serialize writes the documented envelope', () => {
    const r = loadProgress(memoryKV(), opts())
    const rec = JSON.parse(serialize(r.core, NOW))
    expect(Object.keys(rec).sort()).toEqual([
      'activity',
      'courseId',
      'credit',
      'epoch',
      'extras',
      'origin',
      'progress',
      'schemaVersion',
      'settingsAt',
      'tutorAt',
      'tutorClearedAt',
      'updatedAt',
    ])
    expect(rec.schemaVersion).toBe(2)
    expect(rec.courseId).toBe('de-general')
  })

  it('the new key is separate from the legacy key (so an old app version keeps reading its own data)', () => {
    expect(KEYS.current).not.toBe(KEYS.legacy)
    expect(KEYS.legacy).toBe('bilup-deutsch:v1')
  })
})
