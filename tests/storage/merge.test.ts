// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { recordResult } from '../../src/progress/engine'
import type { ActivityKind, ActivityResult } from '../../src/progress/types'
import { freshCore, type Core } from '../../src/storage/core'
import { totalXp } from '../../src/storage/credit'
import { canonicalJson, mergeCores } from '../../src/storage/merge'
import { seeded } from '../../src/utils/random'

const NOW = 1_760_000_000_000
const canon = (c: Core) => canonicalJson(c, NOW)
const merge = (a: Core, b: Core) => mergeCores(a, b, NOW)
let seq = 0

/** A random but valid learner state, built only through the real engine and the real progress shapes. */
function randomCore(rnd: () => number, tag: string): Core {
  const pick = <T>(xs: T[]) => xs[Math.floor(rnd() * xs.length)]
  let c = freshCore()
  const kinds: ActivityKind[] = ['quiz', 'lesson', 'assessment', 'writing', 'word-practice', 'review']
  for (let i = 0; i < 6 + Math.floor(rnd() * 10); i++) {
    const kind = pick(kinds)
    const total = 1 + Math.floor(rnd() * 4)
    const correct = Math.floor(rnd() * (total + 1))
    const r: ActivityResult = {
      resultId: `${tag}-${++seq}`,
      courseId: 'de-general',
      activityId: kind === 'lesson' ? `topic:${pick(['a', 'b', 'c'])}` : `act:${pick(['x', 'y', 'z'])}`,
      kind,
      levelId: 'A1',
      startedAt: NOW - 5000 - Math.floor(rnd() * 1e7),
      finishedAt: NOW - Math.floor(rnd() * 1e7),
      activeMs: 100,
      assisted: false,
      items: Array.from({ length: total }, (_, k) => ({
        itemRef: `q:${pick(['a', 'b', 'c', 'd'])}${k}`,
        outcome: k < correct ? ('correct' as const) : ('incorrect' as const),
      })),
      score: { earned: correct, possible: total },
      evidence: 'measured',
      completes: rnd() > 0.5 ? [`${Math.floor(rnd() * 3)}:${pick(['test', 'review'])}`] : [],
    }
    c = recordResult(c, r, NOW).core
  }
  const p = c.progress
  const ids = ['w1', 'w2', 'w3', 'w4']
  for (const id of ids)
    if (rnd() > 0.5)
      p.mastery = {
        ...p.mastery,
        [id]: { box: Math.floor(rnd() * 6), due: Math.floor(rnd() * 1e6), seen: 1 + Math.floor(rnd() * 5), wrong: Math.floor(rnd() * 2) },
      }
  p.saved = ids.filter(() => rnd() > 0.6)
  p.scores = { ...p.scores, grammar: Array.from({ length: Math.floor(rnd() * 5) }, () => Math.floor(rnd() * 100)) }
  p.mistakes = Array.from({ length: Math.floor(rnd() * 4) }, (_, i) => ({
    at: Math.floor(rnd() * 1000),
    kind: 'grammar' as const,
    ref: `r${i}`,
  }))
  p.daily =
    rnd() > 0.5
      ? {
          '2026-01-01': {
            date: '2026-01-01',
            vocab: [Math.floor(rnd() * 3), 3],
            grammar: [0, 1],
            listening: [0, 1],
            speaking: rnd() > 0.5,
          },
        }
      : {}
  p.tests = rnd() > 0.5 ? [{ id: 't1', at: Math.floor(rnd() * 1000), pct: 50, weak: [], strong: [] }] : []
  p.studySeconds = Math.floor(rnd() * 1000)
  p.activeDates = ['2026-01-01', '2026-01-02', '2026-01-03'].filter(() => rnd() > 0.4)
  p.tutor = { messages: Array.from({ length: Math.floor(rnd() * 3) }, (_, i) => ({ id: `${tag}${i}`, role: 'user' as const, text: 'x' })) }
  p.lang = pick(['ru', 'ky', 'de'] as const)
  p.theme = pick(['auto', 'light', 'dark'] as const)
  p.weeklyGoal = 1 + Math.floor(rnd() * 7)
  return { ...c, settingsAt: Math.floor(rnd() * 5), progress: p }
}

describe('mergeCores: algebra (seeded random states, 150 triples)', () => {
  const rnd = seeded('merge-algebra')
  const triples = Array.from(
    { length: 150 },
    (_, i) => [randomCore(rnd, `a${i}`), randomCore(rnd, `b${i}`), randomCore(rnd, `c${i}`)] as const,
  )

  it('idempotent: merge(a, a) ≡ a', () => {
    for (const [a] of triples) expect(canon(merge(a, a))).toBe(canon(a))
  })

  it('commutative: merge(a, b) ≡ merge(b, a) — tabs converge regardless of who merges first', () => {
    for (const [a, b] of triples) expect(canon(merge(a, b))).toBe(canon(merge(b, a)))
  })

  it('associative: ((a ∘ b) ∘ c) ≡ (a ∘ (b ∘ c)) — three tabs converge too', () => {
    for (const [a, b, c] of triples) expect(canon(merge(merge(a, b), c))).toBe(canon(merge(a, merge(b, c))))
  })

  it('monotonic: nothing earned in either state disappears', () => {
    for (const [a, b] of triples) {
      const m = merge(a, b)
      const ids = new Set(m.credit.entries.map(e => e.id))
      for (const e of [...a.credit.entries, ...b.credit.entries]) expect(ids.has(e.id)).toBe(true)
      for (const k of [...a.progress.completed, ...b.progress.completed]) expect(m.progress.completed).toContain(k)
      for (const k of [...Object.keys(a.activity.completions), ...Object.keys(b.activity.completions)])
        expect(m.activity.completions[k]).toBeDefined()
      for (const [id, e] of [...Object.entries(a.progress.mastery), ...Object.entries(b.progress.mastery)])
        expect(m.progress.mastery[id].seen).toBeGreaterThanOrEqual(e.seen)
      expect(m.progress.studySeconds).toBeGreaterThanOrEqual(Math.max(a.progress.studySeconds, b.progress.studySeconds))
      expect(m.progress.xp).toBe(totalXp(m.credit.entries))
    }
  })

  it('XP: a credit present in both states (same deterministic id) is counted once, never twice', () => {
    for (const [a] of triples) {
      const m = merge(a, a)
      expect(m.progress.xp).toBe(a.progress.xp)
    }
    const a = randomCore(rnd, 'shared')
    const b: Core = { ...a } // the same credits seen from another tab
    expect(merge(a, b).progress.xp).toBe(a.progress.xp)
  })

  it('completion projection and completion records agree after a merge', () => {
    for (const [a, b] of triples) {
      const m = merge(a, b)
      for (const [k, c] of Object.entries(m.activity.completions))
        if (c.firstPassedAt !== null || c.source === 'migration') expect(m.progress.completed).toContain(k)
    }
  })

  it('does not mutate its inputs', () => {
    const [a, b] = triples[0]
    const fa = JSON.stringify(a)
    const fb = JSON.stringify(b)
    merge(a, b)
    expect(JSON.stringify(a)).toBe(fa)
    expect(JSON.stringify(b)).toBe(fb)
  })
})

describe('mergeCores: specific rules', () => {
  const base = freshCore()
  const withProgress = (p: Partial<Core['progress']>, over: Partial<Core> = {}): Core => ({
    ...base,
    progress: { ...base.progress, ...p },
    ...over,
  })

  it('the HIGHER EPOCH is adopted whole (a reset or restore wins over any stale tab; nothing is merged back in)', () => {
    const stale = withProgress({ completed: ['topic:old'], xp: 0 }, { epoch: 1 })
    const reset = withProgress({}, { epoch: 5 })
    expect(merge(stale, reset)).toBe(reset)
    expect(merge(reset, stale)).toBe(reset)
    expect(merge(stale, reset).progress.completed).toEqual([])
  })

  it('settings are last-writer-wins by settingsAt, as one group; a tie is resolved deterministically', () => {
    const a = withProgress({ lang: 'ky', theme: 'dark', name: 'A' }, { settingsAt: 10 })
    const b = withProgress({ lang: 'de', theme: 'light', name: 'B' }, { settingsAt: 20 })
    expect(merge(a, b).progress).toMatchObject({ lang: 'de', theme: 'light', name: 'B' })
    expect(merge(b, a).progress).toMatchObject({ lang: 'de', theme: 'light', name: 'B' })
    const t1 = withProgress({ lang: 'ky' }, { settingsAt: 7 })
    const t2 = withProgress({ lang: 'de' }, { settingsAt: 7 })
    expect(merge(t1, t2).progress.lang).toBe(merge(t2, t1).progress.lang)
  })

  it('mastery: the state with more practice wins per word; a word known to one side only is kept', () => {
    const a = withProgress({ mastery: { w1: { box: 3, due: 5, seen: 6, wrong: 1 }, w2: { box: 1, due: 1, seen: 1, wrong: 0 } } })
    const b = withProgress({ mastery: { w1: { box: 1, due: 9, seen: 2, wrong: 1 }, w3: { box: 2, due: 2, seen: 2, wrong: 0 } } })
    const m = merge(a, b).progress.mastery
    expect(m.w1.seen).toBe(6)
    expect(Object.keys(m).sort()).toEqual(['w1', 'w2', 'w3'])
  })

  it('KNOWN LIMIT (documented): removals do not propagate — an un-saved word can come back when two tabs diverge', () => {
    const a = withProgress({ saved: [] })
    const b = withProgress({ saved: ['w1'] })
    expect(merge(a, b).progress.saved).toEqual(['w1'])
  })

  it('daily results take the larger counters and any speaking flag', () => {
    const a = withProgress({
      daily: { '2026-01-01': { date: '2026-01-01', vocab: [1, 3], grammar: [0, 1], listening: [0, 1], speaking: false } },
    })
    const b = withProgress({
      daily: { '2026-01-01': { date: '2026-01-01', vocab: [2, 3], grammar: [1, 1], listening: [0, 1], speaking: true } },
    })
    expect(merge(a, b).progress.daily['2026-01-01']).toEqual({
      date: '2026-01-01',
      vocab: [2, 3],
      grammar: [1, 1],
      listening: [0, 1],
      speaking: true,
    })
  })

  it('extras and origin are unioned; unknown fields are never dropped', () => {
    const a: Core = { ...base, extras: { x: 1 } }
    const b: Core = { ...base, extras: { y: 2 }, origin: { from: 'legacy-v1', migratedAt: 1, backupKey: 'k', legacyFingerprint: 'f' } }
    const m = merge(a, b)
    expect(m.extras).toEqual({ x: 1, y: 2 })
    expect(m.origin?.backupKey).toBe('k')
  })
})
