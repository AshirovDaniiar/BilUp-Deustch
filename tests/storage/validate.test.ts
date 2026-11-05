// @vitest-environment node
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { defaultProgress } from '../../src/storage/defaults'
import { isDayKey, KNOWN_KEYS, LIMITS, sanitizeProgress } from '../../src/storage/validate'
import { seeded } from '../../src/utils/random'

const fx = (n: string) => JSON.parse(readFileSync(join(__dirname, '../fixtures/legacy', n), 'utf8'))
const ok = (input: unknown) => {
  const r = sanitizeProgress(input)
  if (!r) throw new Error('expected an object')
  return r
}

describe('sanitizeProgress: valid data passes through untouched', () => {
  it.each(['v1-full.json', 'v1-realistic.json', 'v1-minimal.json', 'v1-partial-scores.json'])('%s → no issues', name => {
    const r = ok(fx(name))
    expect(r.issues).toEqual([])
  })

  it('a complete record is preserved field for field', () => {
    const input = fx('v1-full.json')
    const r = ok(input)
    // S1: a tutor message without a time gets `at = position + 1` (deterministic); everything else is untouched
    const stamped = { messages: input.tutor.messages.map((m: object, i: number) => ({ ...m, at: i + 1 })) }
    expect(r.value).toEqual({ ...defaultProgress(), ...input, tutor: stamped })
    expect(r.recognized).toBe(KNOWN_KEYS.length)
  })

  it('unknown top-level fields are kept verbatim in extras (forward compatibility)', () => {
    const r = ok(fx('v1-realistic.json'))
    expect(r.extras).toEqual({ someFutureField: { keep: 'me' } })
  })

  it('an empty object is a valid, empty record', () => {
    const r = ok({})
    expect(r.issues).toEqual([])
    expect(r.value).toEqual(defaultProgress())
    expect(r.recognized).toBe(0)
  })
})

describe('sanitizeProgress: not an object → nothing to salvage', () => {
  it.each([null, undefined, 5, 'text', true, [], [1, 2, 3]])('%j → null', v => {
    expect(sanitizeProgress(v)).toBeNull()
  })
})

describe('sanitizeProgress: field rules (salvage before discard, every repair reported)', () => {
  it('numeric strings are salvaged, nonsense falls back; negative → 0; huge → clamped', () => {
    expect(ok({ xp: '100' }).value.xp).toBe(100)
    expect(ok({ xp: '100' }).issues).toEqual([])
    expect(ok({ xp: 'abc' }).value.xp).toBe(0)
    expect(ok({ xp: 'abc' }).issues[0].path).toBe('xp')
    expect(ok({ xp: -5 }).value.xp).toBe(0)
    expect(ok({ xp: 1e15 }).value.xp).toBe(LIMITS.maxXp)
    expect(ok({ xp: 12.9 }).value.xp).toBe(12)
    expect(ok({ xp: NaN }).value.xp).toBe(0)
    expect(ok({ xp: Infinity }).value.xp).toBe(0)
  })

  it('enums fall back to defaults with an issue', () => {
    const r = ok({ lang: 'fr', theme: 'purple', level: 'Z9' })
    expect(r.value.lang).toBe('ru')
    expect(r.value.theme).toBe('auto')
    expect(r.value.level).toBe('A1')
    expect(r.issues.map(i => i.path).sort()).toEqual(['lang', 'level', 'theme'])
  })

  it('name: trimmed, truncated, empty/non-string rejected', () => {
    expect(ok({ name: '  Anna  ' }).value.name).toBe('Anna')
    expect(ok({ name: 'x'.repeat(200) }).value.name).toHaveLength(LIMITS.name)
    expect(ok({ name: '' }).value.name).toBe(defaultProgress().name)
    expect(ok({ name: 7 }).value.name).toBe(defaultProgress().name)
  })

  it('activeDates: only real calendar days, deduplicated, capped to the newest 400', () => {
    const r = ok({ activeDates: ['2025-01-01', '2025-01-01', '2025-02-30', 'yesterday', 5, '2025-1-1', '2024-02-29'] })
    expect(r.value.activeDates).toEqual(['2025-01-01', '2024-02-29'])
    expect(r.issues.some(i => i.path === 'activeDates')).toBe(true)
    const many = Array.from({ length: 450 }, (_, i) => new Date(Date.UTC(2023, 0, 1 + i)).toISOString().slice(0, 10))
    expect(ok({ activeDates: many }).value.activeDates).toHaveLength(LIMITS.activeDates)
    expect(ok({ activeDates: 5 }).value.activeDates).toEqual([])
    expect(isDayKey('2025-02-29')).toBe(false)
    expect(isDayKey('2024-02-29')).toBe(true)
  })

  it('completed / saved: strings only, deduplicated; a non-array is rejected (not guessed)', () => {
    const r = ok({ completed: ['1:vocabulary', '1:vocabulary', '', 5, null, 'topic:x'], saved: 'oops' })
    expect(r.value.completed).toEqual(['1:vocabulary', 'topic:x'])
    expect(r.value.saved).toEqual([])
    expect(ok({ completed: '1:vocabulary' }).value.completed).toEqual([])
  })

  it('mastery: entries are normalised, never silently dropped when interpretable', () => {
    const r = ok({ mastery: { a: { box: 99, due: -1, seen: '3', wrong: -2 }, b: { box: 2 }, c: 'bad', d: null, '': { box: 1 } } })
    expect(r.value.mastery.a).toEqual({ box: 5, due: 0, seen: 3, wrong: 0 })
    expect(r.value.mastery.b).toEqual({ box: 2, due: 0, seen: 0, wrong: 0 })
    expect(Object.keys(r.value.mastery).sort()).toEqual(['a', 'b'])
    expect(r.issues.filter(i => i.path === 'mastery')).toHaveLength(2)
    expect(ok({ mastery: null }).value.mastery).toEqual({})
  })

  it('mistakes / tests / tutor: invalid entries dropped individually, valid ones kept', () => {
    const r = ok({
      mistakes: [{ at: 1, kind: 'grammar', ref: 'a' }, { at: 'x', kind: 'grammar', ref: 'b' }, { at: 2, kind: 'weird', ref: 'c' }, null],
      tests: [{ id: 't', at: 1, pct: 150, weak: ['a', 5], strong: 'no' }, { id: 5 }],
      tutor: { messages: [{ id: 'm', role: 'user', text: 'hi' }, { id: 'n', role: 'robot', text: 'x' }, 'bad'] },
    })
    expect(r.value.mistakes).toEqual([{ at: 1, kind: 'grammar', ref: 'a' }])
    expect(r.value.tests).toEqual([{ id: 't', at: 1, pct: 100, weak: ['a'], strong: [] }])
    expect(r.value.tutor.messages).toEqual([{ id: 'm', role: 'user', text: 'hi', at: 1 }])
    expect(ok({ tutor: null }).value.tutor).toEqual({ messages: [] })
  })

  it('scores: clamped to 0–100, per-skill history capped, non-numbers dropped, missing skills empty', () => {
    const r = ok({ scores: { vocabulary: [150, -3, 'x', 50.4], grammar: 'no', speaking: Array.from({ length: 40 }, (_, i) => i) } })
    expect(r.value.scores.vocabulary).toEqual([100, 0, 50])
    expect(r.value.scores.grammar).toEqual([])
    expect(r.value.scores.speaking).toHaveLength(LIMITS.scoresPerSkill)
    expect(r.value.scores.listening).toEqual([])
    expect(ok({ scores: null }).value.scores).toEqual(defaultProgress().scores)
  })

  it('daily: keyed by real days, pairs normalised', () => {
    const r = ok({
      daily: { '2025-03-01': { vocab: [2, 3], grammar: 'x', listening: [1], speaking: 'yes' }, nope: { vocab: [1, 1] }, '2025-03-02': 7 },
    })
    expect(r.value.daily).toEqual({
      '2025-03-01': { date: '2025-03-01', vocab: [2, 3], grammar: [0, 0], listening: [0, 0], speaking: false },
    })
  })

  it('weeklyGoal: 1..7 only', () => {
    expect(ok({ weeklyGoal: 3 }).value.weeklyGoal).toBe(3)
    expect(ok({ weeklyGoal: 12 }).value.weeklyGoal).toBe(5)
    expect(ok({ weeklyGoal: 'x' }).value.weeklyGoal).toBe(5)
  })

  it('the pre-P1 crash inputs are now plain repairs: wrong-types fixture yields a usable state', () => {
    const r = ok(fx('malformed-wrong-types.json'))
    expect(r.value.xp).toBe(100) // "100" salvaged
    expect(Array.isArray(r.value.activeDates)).toBe(true)
    expect(Array.isArray(r.value.completed)).toBe(true)
    expect(r.issues.length).toBeGreaterThanOrEqual(3)
  })
})

describe('sanitizeProgress: robustness properties (seeded fuzzing — no new dependency)', () => {
  const rnd = seeded('p1-fuzz')
  const pickOne = <T>(xs: T[]) => xs[Math.floor(rnd() * xs.length)]
  const junk = (depth = 0): unknown => {
    const kinds = ['null', 'num', 'str', 'bool', 'nan', 'neg', 'arr', 'obj', 'numstr', 'big']
    switch (pickOne(kinds)) {
      case 'null':
        return null
      case 'num':
        return Math.floor(rnd() * 200) - 20
      case 'str':
        return pickOne(['', 'ru', 'ky', 'A1', '2025-01-01', 'topic:x', 'x'.repeat(300), '1:vocabulary'])
      case 'bool':
        return rnd() > 0.5
      case 'nan':
        return NaN
      case 'neg':
        return -1 * Math.floor(rnd() * 1e6)
      case 'numstr':
        return String(Math.floor(rnd() * 500))
      case 'big':
        return 1e300
      case 'arr':
        return depth > 2 ? [] : Array.from({ length: Math.floor(rnd() * 5) }, () => junk(depth + 1))
      default: {
        if (depth > 2) return {}
        const o: Record<string, unknown> = {}
        for (let i = 0; i < Math.floor(rnd() * 5); i++)
          o[pickOne(['a', 'box', 'seen', 'at', 'kind', 'ref', 'id', 'role', 'text', 'messages', 'vocab', 'speaking', '2025-01-01'])] = junk(
            depth + 1,
          )
        return o
      }
    }
  }
  const randomRecord = () => {
    const o: Record<string, unknown> = {}
    for (const k of KNOWN_KEYS) if (rnd() > 0.3) o[k] = junk()
    if (rnd() > 0.5) o.mystery = junk()
    return o
  }

  it('never throws, and always returns structurally valid progress (500 random records)', () => {
    for (let i = 0; i < 500; i++) {
      const r = sanitizeProgress(randomRecord())
      expect(r).not.toBeNull()
      const v = r!.value
      expect(Number.isInteger(v.xp) && v.xp >= 0).toBe(true)
      expect(Number.isInteger(v.studySeconds) && v.studySeconds >= 0).toBe(true)
      expect(v.activeDates.every(isDayKey)).toBe(true)
      expect(v.completed.every(s => typeof s === 'string' && s !== '')).toBe(true)
      for (const m of Object.values(v.mastery))
        expect(m.box >= 0 && m.box <= 5 && m.seen >= 0 && m.wrong >= 0 && Number.isFinite(m.due)).toBe(true)
      for (const arr of Object.values(v.scores)) expect(arr.every(n => n >= 0 && n <= 100)).toBe(true)
      expect(v.weeklyGoal >= 1 && v.weeklyGoal <= 7).toBe(true)
      // must be JSON-serialisable and survive a round trip unchanged
      expect(JSON.parse(JSON.stringify(v))).toEqual(v)
    }
  })

  it('is idempotent: sanitising the output changes nothing and reports nothing (500 random records)', () => {
    for (let i = 0; i < 500; i++) {
      const first = sanitizeProgress(randomRecord())!
      const second = sanitizeProgress({ ...first.value, ...first.extras })!
      expect(second.value).toEqual(first.value)
      expect(second.issues).toEqual([])
    }
  })

  it('does not throw on hostile shapes (deep nesting, huge arrays, prototype keys)', () => {
    const deep: Record<string, unknown> = {}
    let cur = deep
    for (let i = 0; i < 2000; i++) cur = (cur.x = {}) as Record<string, unknown>
    expect(() => sanitizeProgress({ mastery: deep, tutor: deep, daily: deep })).not.toThrow()
    expect(() => sanitizeProgress({ completed: Array.from({ length: 20000 }, (_, i) => `k${i}`) })).not.toThrow()
    expect(ok(JSON.parse('{"__proto__": {"polluted": true}, "xp": 3}')).value.xp).toBe(3)
    expect(({} as Record<string, unknown>).polluted).toBeUndefined()
  })
})
