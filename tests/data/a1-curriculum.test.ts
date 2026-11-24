import { describe, expect, it } from 'vitest'
import { A1_CURRICULUM_TITLES, A1_LEGACY_UNITS, A1_UNITS, unitNumber } from '../../src/data/a1-curriculum'
import { allUnits, unitsOfLevel } from '../../src/data/catalog'
import { levelOfUnitId } from '../../src/data/course'
import { SECTIONS, UNITS } from '../../src/data/units'
import { requiredSections } from '../../src/features/progress/stats'

describe('A1 curriculum v2: 38 units × 9 sections', () => {
  it('lists exactly the 38 approved titles, in order, numbered 1–38', () => {
    expect(A1_UNITS).toHaveLength(38)
    expect(A1_UNITS.map(u => u.title)).toEqual([...A1_CURRICULUM_TITLES])
    expect(A1_UNITS.map(unitNumber)).toEqual(Array.from({ length: 38 }, (_, i) => i + 1))
    expect(unitsOfLevel('A1')).toBe(A1_UNITS)
    expect(new Set(A1_UNITS.map(u => u.title)).size).toBe(38)
    expect(new Set(A1_UNITS.map(u => u.id)).size).toBe(38)
  })
  it('keeps similar-but-different titles as separate units', () => {
    const t = (s: string) => A1_UNITS.filter(u => u.title === s)
    expect(t('Geschenke für Freunde')).toHaveLength(1)
    expect(t('Freunde und Geschenke')).toHaveLength(1)
  })
  it('reuses the exactly matching legacy unit (same object, same id) and creates the rest empty', () => {
    expect(A1_UNITS[0]).toBe(UNITS[0])
    expect(A1_UNITS[0].id).toBe(1)
    for (const u of A1_UNITS.slice(1)) expect(u.id).toBe(100 + unitNumber(u))
  })
  it('hides, but never drops, the legacy units without an exact match', () => {
    expect(A1_LEGACY_UNITS.map(u => u.id)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10])
    for (const u of UNITS) expect(allUnits).toContain(u)
  })
  it('every unit id resolves to A1 and no id collides with A2 / B1', () => {
    for (const u of [...A1_UNITS, ...A1_LEGACY_UNITS]) expect(levelOfUnitId(u.id)).toBe('A1')
    expect(levelOfUnitId(11)).toBe('A2')
    expect(levelOfUnitId(21)).toBe('B1')
    expect(levelOfUnitId(101)).toBeUndefined()
  })
  it('there are exactly 9 standard sections with Merksätze after Grammar; empty containers require no invented content', () => {
    expect(SECTIONS).toEqual(['vocabulary', 'grammar', 'merksaetze', 'listening', 'reading', 'speaking', 'writing', 'review', 'test'])
    expect(SECTIONS.indexOf('merksaetze')).toBe(2)
    expect(A1_UNITS).toHaveLength(38)
    expect(A1_UNITS.length * SECTIONS.length).toBe(342)
    for (const u of A1_UNITS.slice(1)) {
      // no invented content: a unit either references one EXISTING grammar lesson or is completely empty
      expect(requiredSections(u.id)).toEqual(u.grammarIds.length ? ['grammar', 'merksaetze', 'reading'] : ['merksaetze', 'reading'])
      expect(u.grammarIds.length).toBeLessThanOrEqual(1)
    }
    expect(requiredSections(1)).toHaveLength(9)
  })
})
