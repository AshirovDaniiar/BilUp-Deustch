import { afterEach, describe, expect, it, vi } from 'vitest'
import { defaultState } from '../src/app/store'
import {
  articleConfusion,
  badges,
  completedTopics,
  currentUnit,
  dueWordIds,
  levelProgress,
  masteredCount,
  recommendations,
  skillPct,
  stageCounts,
  unitProgress,
  weakConcepts,
  xpLevel,
} from '../src/features/progress/stats'
import { UNITS } from '../src/data/units'
import { VOCABULARY } from '../src/data/vocabulary'
import type { Mistake, UserProgress } from '../src/data/types'

afterEach(() => vi.useRealTimers())
const state = (patch: Partial<UserProgress> = {}): UserProgress => ({ ...defaultState(), ...patch })
const mistake = (kind: Mistake['kind'], ref: string, concept?: string): Mistake => ({ at: 1, kind, ref, concept })

describe('progress/stats: scoring and levels', () => {
  it('skillPct averages the 8 most recent scores; null when never practised', () => {
    const s = state({ scores: { ...defaultState().scores, grammar: [0, 0, 100, 100, 100, 100, 100, 100, 100, 100] } })
    expect(skillPct(s, 'grammar')).toBe(100) // only the last 8 count
    expect(skillPct(s, 'speaking')).toBeNull()
  })

  it('xpLevel follows level = floor(sqrt(xp/60)) + 1', () => {
    expect(xpLevel(0)).toEqual({ level: 1, pct: 0, toNext: 60 })
    expect(xpLevel(59).level).toBe(1)
    expect(xpLevel(60)).toEqual({ level: 2, pct: 0, toNext: 180 })
    expect(xpLevel(240).level).toBe(3)
  })
})

describe('progress/stats: units and completion keys', () => {
  it('unitProgress counts the 8 section keys "unit:section"', () => {
    const s = state({ completed: ['1:vocabulary', '1:grammar', '2:vocabulary', 'topic:artikel', 'ex:x'] })
    expect(unitProgress(s, 1)).toEqual({ done: 2, total: 8, pct: 25 })
    expect(unitProgress(s, 3).done).toBe(0)
  })

  it('levelProgress is completed sections over (units × 8)', () => {
    expect(levelProgress(state())).toBe(0)
    const all = UNITS.flatMap(u =>
      ['vocabulary', 'grammar', 'listening', 'reading', 'speaking', 'writing', 'review', 'test'].map(x => `${u.id}:${x}`),
    )
    expect(levelProgress(state({ completed: all }))).toBe(100)
  })

  it('currentUnit is the first unfinished unit, else the last unit', () => {
    expect(currentUnit(state()).id).toBe(UNITS[0].id)
    const first = ['vocabulary', 'grammar', 'listening', 'reading', 'speaking', 'writing', 'review', 'test'].map(x => `${UNITS[0].id}:${x}`)
    expect(currentUnit(state({ completed: first })).id).toBe(UNITS[1].id)
  })

  it('completedTopics counts only "topic:" keys', () => {
    expect(completedTopics(state({ completed: ['topic:a', 'topic:b', '1:grammar'] }))).toBe(2)
  })
})

describe('progress/stats: vocabulary mastery', () => {
  const w = VOCABULARY[0].id
  const w2 = VOCABULARY[1].id

  it('stageCounts covers every word; unseen words are "new"', () => {
    const c = stageCounts(state())
    expect(c.new).toBe(VOCABULARY.length)
    expect(Object.values(c).reduce((a, b) => a + b, 0)).toBe(VOCABULARY.length)
  })

  it('dueWordIds / masteredCount use stage + due time', () => {
    const s = state({
      mastery: { [w]: { box: 5, due: 1, seen: 5, wrong: 0 }, [w2]: { box: 3, due: Date.now() + 1e9, seen: 3, wrong: 0 } },
    })
    expect(dueWordIds(s)).toEqual([w])
    expect(masteredCount(s)).toBe(2) // strong + mastered both count
  })
})

describe('progress/stats: weaknesses and recommendations', () => {
  it('weakConcepts needs ≥ 2 mistakes per concept, worst first, over the last 80 only', () => {
    const s = state({
      mistakes: [
        mistake('grammar', 'a', 'dativ'),
        mistake('grammar', 'b', 'dativ'),
        mistake('grammar', 'c', 'dativ'),
        mistake('grammar', 'd', 'akkusativ'),
        mistake('grammar', 'e', 'akkusativ'),
        mistake('grammar', 'f', 'once'),
      ],
    })
    expect(weakConcepts(s)).toEqual([
      { id: 'dativ', n: 3 },
      { id: 'akkusativ', n: 2 },
    ])
    const old = state({
      mistakes: [
        mistake('grammar', 'x', 'old'),
        mistake('grammar', 'x', 'old'),
        ...Array.from({ length: 80 }, () => mistake('vocabulary', 'v')),
      ],
    })
    expect(weakConcepts(old)).toEqual([])
  })

  it('articleConfusion becomes active at 3 recent article mistakes', () => {
    const two = state({ mistakes: [mistake('article', 'art-1'), mistake('article', 'art-2')] })
    expect(articleConfusion(two).active).toBe(false)
    const three = state({ mistakes: [mistake('article', 'art-1'), mistake('article', 'art-2'), mistake('article', 'art-3')] })
    expect(articleConfusion(three)).toEqual({ count: 3, ids: ['1', '2', '3'], active: true })
  })

  it('recommendations: articles first, then weak concepts, due words, strong listening', () => {
    expect(recommendations(state())).toEqual([])
    const s = state({
      mistakes: [mistake('article', 'art-1'), mistake('article', 'art-2'), mistake('article', 'art-3')],
      mastery: { [VOCABULARY[0].id]: { box: 1, due: 1, seen: 1, wrong: 0 } },
      scores: { ...defaultState().scores, listening: [90, 90] },
    })
    expect(recommendations(s).map(r => r.id)).toEqual(['articles', 'due', 'lis'])
  })
})

describe('progress/stats: badges', () => {
  const earned = (s: UserProgress) =>
    badges(s)
      .filter(b => b.earned)
      .map(b => b.id)

  it('new learner has no badges', () => {
    expect(earned(state())).toEqual([])
  })

  it('"first" requires xp > 0; speaker/writer require a score', () => {
    expect(earned(state({ xp: 1 }))).toEqual(['first'])
    expect(earned(state({ scores: { ...defaultState().scores, speaking: [50], writing: [50] } }))).toEqual(['speaker', 'writer'])
  })

  it('KNOWN-QUIRK (pinned): "streak3" is awarded for ANY 3 active dates, not only consecutive ones', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 0, 20, 12))
    expect(earned(state({ activeDates: ['2025-01-01', '2025-01-05', '2025-01-10'] }))).toContain('streak3')
    expect(earned(state({ activeDates: ['2025-01-01', '2025-01-05', '2025-01-10'] }))).not.toContain('streak7')
  })

  it('"unit" badge needs all 8 sections of any unit', () => {
    const done = ['vocabulary', 'grammar', 'listening', 'reading', 'speaking', 'writing', 'review', 'test'].map(x => `${UNITS[2].id}:${x}`)
    expect(earned(state({ completed: done }))).toContain('unit')
  })
})
