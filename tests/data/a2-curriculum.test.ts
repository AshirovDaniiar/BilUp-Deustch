import { describe, expect, it } from 'vitest'
import '../load-a2'
import { A2_CURRICULUM_TITLES, A2_LEGACY_UNITS, A2_VISIBLE_UNITS } from '../../src/data/a2/curriculum'
import { A2_UNITS } from '../../src/data/a2/units'
import { allUnits, unitById, unitsOfLevel } from '../../src/data/catalog'
import { isPlaceholderUnit, unitNumber } from '../../src/data/curriculum'
import { levelOfUnitId } from '../../src/data/course'
import { SECTIONS } from '../../src/data/units'
import { currentUnit, requiredSections, unitHasContent } from '../../src/features/progress/stats'
import { defaultProgress } from '../../src/storage/defaults'

describe('A2 curriculum v2: 43 units × 9 sections', () => {
  it('lists exactly the 43 approved titles, in order, numbered 1–43, ids 200 + number', () => {
    expect(A2_VISIBLE_UNITS).toHaveLength(43)
    expect(A2_VISIBLE_UNITS.map(u => u.title)).toEqual([...A2_CURRICULUM_TITLES])
    expect(A2_VISIBLE_UNITS.map(unitNumber)).toEqual(Array.from({ length: 43 }, (_, i) => i + 1))
    expect(A2_VISIBLE_UNITS.map(u => u.id)).toEqual(Array.from({ length: 43 }, (_, i) => 201 + i))
    expect(new Set(A2_VISIBLE_UNITS.map(u => u.title)).size).toBe(43)
    expect(unitsOfLevel('A2')).toBe(A2_VISIBLE_UNITS)
  })
  it('no existing A2 title matches, so all 43 are empty containers and all ten authored units are hidden legacy, untouched', () => {
    expect(A2_VISIBLE_UNITS.every(isPlaceholderUnit)).toBe(true)
    expect(A2_LEGACY_UNITS).toEqual(A2_UNITS)
    expect(A2_LEGACY_UNITS.map(u => u.id)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    for (const u of A2_UNITS) {
      expect(allUnits).toContain(u)
      expect(unitById(u.id)).toBe(u)
      expect(unitsOfLevel('A2')).not.toContain(u)
      expect(unitHasContent(u.id)).toBe(true)
    }
  })
  it('ids never collide with A1 / A2 / B1 and all resolve to A2', () => {
    const ids = allUnits.map(u => u.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const u of [...A2_VISIBLE_UNITS, ...A2_LEGACY_UNITS]) expect(levelOfUnitId(u.id)).toBe('A2')
    expect(levelOfUnitId(244)).toBeUndefined()
  })
  it('containers carry no invented content: they either reference one EXISTING grammar lesson (only the Grammar section is required) or are empty; never the current unit', () => {
    expect(SECTIONS).toEqual(['vocabulary', 'grammar', 'merksaetze', 'listening', 'reading', 'speaking', 'writing', 'review', 'test'])
    expect(SECTIONS.indexOf('merksaetze')).toBe(2)
    expect(A2_VISIBLE_UNITS).toHaveLength(43)
    expect(A2_VISIBLE_UNITS.length * SECTIONS.length).toBe(387)
    for (const u of A2_VISIBLE_UNITS) {
      expect(requiredSections(u.id)).toEqual(u.grammarIds.length ? ['grammar', 'merksaetze', 'reading'] : ['merksaetze', 'reading'])
      expect(u.grammarIds.length).toBeLessThanOrEqual(1)
      expect(unitHasContent(u.id)).toBe(true)
    }
    expect(currentUnit(defaultProgress(), 'A2')).toBeUndefined()
  })
})
