// @vitest-environment node
import { describe, expect, it } from 'vitest'
import {
  award,
  deriveCredited,
  emptyCredit,
  MAX_AWARD,
  reconcileXp,
  sanitizeEntries,
  totalXp,
  type CreditState,
} from '../../src/storage/credit'
import { seeded } from '../../src/utils/random'

const T = 1_700_000_000_000

describe('award: idempotent XP crediting by stable key', () => {
  it('first award credits the amount and records a deterministic entry id', () => {
    const r = award(emptyCredit(), 'topic:akkusativ', 20, T)
    expect(r.awarded).toBe(20)
    expect(r.state.entries).toHaveLength(1)
    expect(r.state.entries[0]).toMatchObject({ id: 'topic:akkusativ@20', kind: 'earn', key: 'topic:akkusativ', xp: 20, creditedTo: 20 })
  })

  it('replaying the same award credits nothing and returns the SAME state object (no write needed)', () => {
    const a = award(emptyCredit(), 'k', 10, T)
    const b = award(a.state, 'k', 10, T + 5)
    expect(b.awarded).toBe(0)
    expect(b.state).toBe(a.state)
    expect(totalXp(b.state.entries)).toBe(10)
  })

  it('a smaller repeat credits nothing; a larger one credits only the difference (word heard wrongly, later correctly: 1 then 3)', () => {
    let s: CreditState = emptyCredit()
    s = award(s, 'word:w1', 1, T).state
    const smaller = award(s, 'word:w1', 1, T)
    expect(smaller.awarded).toBe(0)
    const top = award(s, 'word:w1', 3, T)
    expect(top.awarded).toBe(2)
    s = top.state
    expect(totalXp(s.entries)).toBe(3)
    expect(award(s, 'word:w1', 3, T).awarded).toBe(0)
    expect(s.entries.map(e => e.id)).toEqual(['word:w1@1', 'word:w1@3'])
  })

  it('different keys are independent', () => {
    let s = emptyCredit()
    s = award(s, 'a', 5, T).state
    s = award(s, 'b', 5, T).state
    expect(totalXp(s.entries)).toBe(10)
  })

  it.each([
    ['empty key', '', 10],
    ['whitespace-padded key', ' k ', 10],
    ['over-long key', 'k'.repeat(121), 10],
    ['zero', 'k', 0],
    ['negative', 'k', -5],
    ['NaN', 'k', NaN],
    ['Infinity', 'k', Infinity],
  ])('rejects %s (credits nothing, state untouched)', (_n, key, amount) => {
    const s = emptyCredit()
    const r = award(s, key, amount, T)
    expect(r.awarded).toBe(0)
    expect(r.state).toBe(s)
  })

  it('fractional amounts are floored; a single award is capped', () => {
    expect(award(emptyCredit(), 'k', 7.9, T).awarded).toBe(7)
    expect(award(emptyCredit(), 'k', 1e9, T).awarded).toBe(MAX_AWARD)
    expect(award(emptyCredit(), 'k', 0.5, T).awarded).toBe(0)
  })

  it('does not mutate its input state', () => {
    const s = award(emptyCredit(), 'k', 5, T).state
    const frozen = JSON.stringify(s)
    award(s, 'k2', 5, T)
    expect(JSON.stringify(s)).toBe(frozen)
  })

  it('legacy seeds count as already credited, so past activity cannot re-earn', () => {
    const seed = {
      entries: [
        {
          id: 'legacy-seed',
          kind: 'legacy-seed' as const,
          key: 'legacy',
          xp: 0,
          credits: { 'topic:x': 20, 'word:a': 3 },
          policyVersion: 't',
          at: T,
        },
      ],
    }
    expect(award(seed, 'topic:x', 20, T).awarded).toBe(0)
    expect(award(seed, 'word:a', 3, T).awarded).toBe(0)
    expect(award(seed, 'word:b', 3, T).awarded).toBe(3)
    expect(award(seed, 'topic:x', 25, T).awarded).toBe(5) // a genuinely higher award still tops up once
  })
})

describe('ledger invariants (seeded randomised sequences)', () => {
  const rnd = seeded('ledger-p1')
  const keys = Array.from({ length: 12 }, (_, i) => `k${i}`)

  const run = (ops: { key: string; amount: number }[]) => {
    let s = emptyCredit()
    let total = 0
    for (const o of ops) {
      const r = award(s, o.key, o.amount, T)
      total += r.awarded
      s = r.state
    }
    return { s, total }
  }
  const randomOps = (n: number) =>
    Array.from({ length: n }, () => ({ key: keys[Math.floor(rnd() * keys.length)], amount: Math.floor(rnd() * 12) }))

  it('total XP = Σ entries = Σ awarded, and equals Σ over keys of the highest amount requested for that key (200 sequences)', () => {
    for (let i = 0; i < 200; i++) {
      const ops = randomOps(60)
      const { s, total } = run(ops)
      const expected = keys.reduce((a, k) => a + Math.max(0, ...ops.filter(o => o.key === k).map(o => o.amount)), 0)
      expect(totalXp(s.entries)).toBe(total)
      expect(total).toBe(expected)
    }
  })

  it('replaying the whole history again credits exactly 0 (idempotent) (200 sequences)', () => {
    for (let i = 0; i < 200; i++) {
      const ops = randomOps(40)
      const { s } = run(ops)
      let again = s
      let extra = 0
      for (const o of ops) {
        const r = award(again, o.key, o.amount, T + 1)
        extra += r.awarded
        again = r.state
      }
      expect(extra).toBe(0)
      expect(again).toBe(s)
    }
  })

  it('the final total does not depend on the order of the operations (200 sequences)', () => {
    for (let i = 0; i < 200; i++) {
      const ops = randomOps(30)
      const shuffled = [...ops].sort(() => rnd() - 0.5)
      expect(run(shuffled).total).toBe(run(ops).total)
    }
  })

  it('entry ids are unique, and the per-key state re-derived from entries matches', () => {
    for (let i = 0; i < 100; i++) {
      const { s } = run(randomOps(50))
      const ids = s.entries.map(e => e.id)
      expect(new Set(ids).size).toBe(ids.length)
      const derived = deriveCredited(s.entries)
      for (const e of s.entries) expect(derived.get(e.key)).toBeGreaterThanOrEqual(e.creditedTo ?? 0)
    }
  })

  it('the ledger is bounded by the number of distinct keys, not by the number of attempts', () => {
    let s = emptyCredit()
    for (let i = 0; i < 5000; i++) s = award(s, keys[i % keys.length], 5, T).state
    expect(s.entries).toHaveLength(keys.length)
  })
})

describe('sanitizeEntries (persisted ledger)', () => {
  const good = { id: 'a@5', kind: 'earn', key: 'a', xp: 5, creditedTo: 5, policyVersion: 'p1-1', at: T }

  it('keeps valid entries', () => {
    expect(sanitizeEntries([good]).entries).toEqual([good])
  })

  it('collapses duplicate ids — a replayed persisted entry can never count twice', () => {
    const r = sanitizeEntries([good, { ...good }, { ...good, xp: 999 }])
    expect(r.entries).toHaveLength(1)
    expect(totalXp(r.entries)).toBe(5)
    expect(r.issues.some(i => /duplicate/.test(i.problem))).toBe(true)
  })

  it('drops uninterpretable entries (negative xp, wrong kind, non-objects) with an issue', () => {
    const r = sanitizeEntries([good, { ...good, id: 'b', xp: -5 }, { ...good, id: 'c', kind: 'bonus' }, null, 'x', { id: 'd' }])
    expect(r.entries.map(e => e.id)).toEqual(['a@5'])
    expect(r.issues).toHaveLength(1)
  })

  it('not an array → empty with an issue; undefined → empty, no issue', () => {
    expect(sanitizeEntries('nope').entries).toEqual([])
    expect(sanitizeEntries('nope').issues).toHaveLength(1)
    expect(sanitizeEntries(undefined)).toEqual({ entries: [], issues: [] })
  })
})

describe('reconcileXp: never lowers a learner’s XP', () => {
  it('ledger short of the stored XP → explicit reconcile entry for the difference', () => {
    const r = reconcileXp([], 120, T)
    expect(r.xp).toBe(120)
    expect(r.reconciled).toBe(120)
    expect(r.entries).toHaveLength(1)
    expect(totalXp(r.entries)).toBe(120)
  })

  it('ledger larger than the stored XP → ledger total wins (the permanent record)', () => {
    const entries = award(emptyCredit(), 'a', 50, T).state.entries
    const r = reconcileXp(entries, 10, T)
    expect(r.xp).toBe(50)
    expect(r.reconciled).toBe(0)
  })

  it('in agreement → no change', () => {
    const entries = award(emptyCredit(), 'a', 50, T).state.entries
    const r = reconcileXp(entries, 50, T)
    expect(r.entries).toBe(entries)
    expect(r.xp).toBe(50)
  })

  it('reconciling twice is a no-op (the second pass finds agreement)', () => {
    const once = reconcileXp([], 77, T)
    const twice = reconcileXp(once.entries, once.xp, T + 1)
    expect(twice.reconciled).toBe(0)
    expect(twice.entries).toBe(once.entries)
  })
})
