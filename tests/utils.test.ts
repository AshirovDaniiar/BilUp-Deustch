import { afterEach, describe, expect, it, vi } from 'vitest'
import { addDays, currentWeek, dayKey, greetingKey, streakOf } from '../src/utils/date'
import { pick, seeded, shuffle } from '../src/utils/random'
import { clamp, normalize, pct, tr, words } from '../src/utils/text'

afterEach(() => vi.useRealTimers())
const at = (y: number, m: number, d: number, h = 12) => vi.setSystemTime(new Date(y, m - 1, d, h))

describe('utils/date', () => {
  it('dayKey is local-date YYYY-MM-DD, zero padded', () => {
    expect(dayKey(new Date(2025, 0, 5))).toBe('2025-01-05')
    expect(dayKey(new Date(2025, 11, 31))).toBe('2025-12-31')
  })

  it('addDays crosses month/year boundaries and does not mutate', () => {
    const d = new Date(2024, 11, 31)
    expect(dayKey(addDays(d, 1))).toBe('2025-01-01')
    expect(dayKey(d)).toBe('2024-12-31')
  })

  it('streakOf counts consecutive days ending today', () => {
    vi.useFakeTimers()
    at(2025, 1, 10)
    expect(streakOf(['2025-01-10', '2025-01-09', '2025-01-08'])).toBe(3)
  })

  it('streakOf keeps the streak alive until the end of "yesterday" (today not yet active)', () => {
    vi.useFakeTimers()
    at(2025, 1, 10)
    expect(streakOf(['2025-01-09', '2025-01-08'])).toBe(2)
  })

  it('streakOf is 0 after a gap of a full day, and ignores older isolated days', () => {
    vi.useFakeTimers()
    at(2025, 1, 10)
    expect(streakOf(['2025-01-08'])).toBe(0)
    expect(streakOf(['2025-01-10', '2025-01-08'])).toBe(1)
    expect(streakOf([])).toBe(0)
  })

  it('currentWeek is Monday-based and has 7 entries', () => {
    vi.useFakeTimers()
    at(2025, 1, 10) // Friday
    const w = currentWeek()
    expect(w).toHaveLength(7)
    expect(w[0]).toBe('2025-01-06')
    expect(w[6]).toBe('2025-01-12')
    at(2025, 1, 12) // Sunday belongs to the same week
    expect(currentWeek()[0]).toBe('2025-01-06')
  })

  it('greetingKey by hour', () => {
    vi.useFakeTimers()
    at(2025, 1, 10, 8)
    expect(greetingKey()).toBe('goodMorning')
    at(2025, 1, 10, 14)
    expect(greetingKey()).toBe('goodDay')
    at(2025, 1, 10, 20)
    expect(greetingKey()).toBe('goodEvening')
  })
})

describe('utils/text', () => {
  it('normalize lowercases, strips listed punctuation and collapses whitespace', () => {
    expect(normalize('  Ich  HEISSE, Anna!  ')).toBe('ich heisse anna')
    expect(normalize('„Guten Tag“')).toBe('guten tag')
  })

  it('words splits on normalised whitespace', () => {
    expect(words("Wie geht's dir?")).toEqual(['wie', 'gehts', 'dir'])
    expect(words('')).toEqual([])
  })

  it('tr returns the requested language, else Russian (the current silent fallback), else empty', () => {
    expect(tr({ ru: 'привет', ky: 'салам', de: 'Hallo' }, 'ky')).toBe('салам')
    expect(tr({ ru: 'привет' }, 'ky')).toBe('привет') // KNOWN-GAP vs 02 §5: silent Russian fallback
    expect(tr(undefined, 'ky')).toBe('')
  })

  it('pct and clamp', () => {
    expect(pct(1, 3)).toBe(33)
    expect(pct(2, 3)).toBe(67)
    expect(pct(5, 0)).toBe(0)
    expect(clamp(150)).toBe(100)
    expect(clamp(-5)).toBe(0)
    expect(clamp(50)).toBe(50)
  })
})

describe('utils/random', () => {
  it('seeded PRNG is deterministic per seed and differs across seeds', () => {
    const a = seeded('daily-2025-01-10')
    const b = seeded('daily-2025-01-10')
    const seq = (r: () => number) => Array.from({ length: 5 }, r)
    expect(seq(a)).toEqual(seq(b))
    expect(seq(seeded('daily-2025-01-11'))).not.toEqual(seq(seeded('daily-2025-01-10')))
    for (const x of seq(seeded('x'))) {
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThan(1)
    }
  })

  it('shuffle returns a permutation and does not mutate; pick returns n unique items', () => {
    const src = [1, 2, 3, 4, 5, 6, 7, 8]
    const out = shuffle(src, seeded('s'))
    expect([...out].sort()).toEqual(src)
    expect(src).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
    const p = pick(src, 3, seeded('p'))
    expect(new Set(p).size).toBe(3)
    expect(pick(src, 20, seeded('p'))).toHaveLength(8)
  })
})
