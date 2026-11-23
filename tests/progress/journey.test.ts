import { describe, expect, it } from 'vitest'
import { defaultState } from '../../src/app/store'
import { requiredSections } from '../../src/features/progress/stats'
import { JOURNEY_LEVELS, LEVEL_NAMES, MAP_H, MAP_W, buildJourney, mascotPoint, milestonePoint } from '../../src/features/progress/journey'
import { unitsOfLevel } from '../../src/data/catalog'
import type { UserProgress } from '../../src/data/types'

const state = (patch: Partial<UserProgress> = {}): UserProgress => ({ ...defaultState(), lang: 'ru', ...patch })
const finishA1 = () => unitsOfLevel('A1').flatMap(u => requiredSections(u.id).map(sec => `${u.id}:${sec}`))

describe('learning journey (derived from saved progress, nothing stored)', () => {
  it('uses the six Kyrgyz mountain names', () => {
    const names = ['Мугалим чокусу', 'Жигит чокусу', 'Корумду чокусу', 'Хан-Теңири', 'Ленин чокусу', 'Жеңиш чокусу']
    expect(JOURNEY_LEVELS.map(level => LEVEL_NAMES[level].ky)).toEqual(names)
    expect(JOURNEY_LEVELS.map(level => LEVEL_NAMES[level].ru)).toEqual(names)
    expect(JOURNEY_LEVELS.map(level => LEVEL_NAMES[level].de)).toEqual(names)
  })

  it('lists the six CEFR milestones in order', () => {
    expect(JOURNEY_LEVELS).toEqual(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
    expect(buildJourney(state()).milestones.map(m => m.level)).toEqual([...JOURNEY_LEVELS])
  })

  it('a new learner stands at the start, on A1; B2, C1 and C2 are locked', () => {
    const j = buildJourney(state())
    expect(j.position).toBe(0)
    expect(j.milestones.map(m => m.status)).toEqual(['current', 'open', 'open', 'locked', 'locked', 'locked'])
    expect(j.milestones.filter(m => m.enterable).map(m => m.level)).toEqual(['A1', 'A2', 'B1'])
  })

  it('the German interface only offers released levels: A1 only, everything else locked', () => {
    const j = buildJourney(state({ lang: 'de' }))
    expect(j.milestones.map(m => m.enterable)).toEqual([true, false, false, false, false, false])
  })

  it('finishing A1 completes it and moves the mascot to the A1 summit, with A2 current', () => {
    const j = buildJourney(state({ completed: finishA1() }))
    expect(j.milestones[0].status).toBe('completed')
    expect(j.position).toBeCloseTo(1, 5)
    expect(j.currentIndex).toBe(1)
    expect(j.milestones[1].status).toBe('current')
  })

  it('partial progress moves the mascot part of the way, and only forward', () => {
    const some = finishA1().slice(0, 12)
    const a = buildJourney(state({ completed: some })).position
    const b = buildJourney(state({ completed: finishA1().slice(0, 40) })).position
    expect(a).toBeGreaterThan(0)
    expect(b).toBeGreaterThan(a)
    expect(b).toBeLessThanOrEqual(1)
  })

  it('the mascot is placed on the road: the start, each milestone, and monotonically downwards in between', () => {
    expect(mascotPoint(0)[1]).toBeLessThan(milestonePoint(0)[1])
    for (let i = 0; i < 6; i++) {
      const [x, y] = mascotPoint(i + 1)
      expect(x).toBeCloseTo(milestonePoint(i)[0], 3)
      expect(y).toBeCloseTo(milestonePoint(i)[1], 3)
    }
    let prev = -1
    for (let p = 0; p <= 6; p += 0.25) {
      const [x, y] = mascotPoint(p)
      expect(y).toBeGreaterThanOrEqual(prev)
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(MAP_W)
      expect(y).toBeLessThanOrEqual(MAP_H)
      prev = y
    }
  })
})
