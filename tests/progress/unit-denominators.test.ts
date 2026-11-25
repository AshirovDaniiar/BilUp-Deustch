// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { A1_UNITS } from '../../src/data/a1-curriculum'
import { badges, currentUnit, levelProgress, requiredSections, unitProgress } from '../../src/features/progress/stats'
import { listeningForUnit } from '../../src/data/listening'
import { readingForUnit } from '../../src/data/reading'
import { SECTIONS, UNITS } from '../../src/data/units'
import { vocabularyForUnit } from '../../src/data/catalog'
import { defaultProgress } from '../../src/storage/defaults'

const withCompleted = (completed: string[]) => ({ ...defaultProgress(), completed })
const allKeys = (unit: number) => SECTIONS.map(s => `${unit}:${s}`)

describe('unit progress denominators are derived from content (V-06)', () => {
  it('every unit requires exactly the sections it has content for; no hard-coded 8', () => {
    for (const u of UNITS) {
      const req = requiredSections(u.id)
      expect(req.length).toBeGreaterThan(0)
      expect(req.length).toBeLessThanOrEqual(SECTIONS.length)
      expect(unitProgress(withCompleted([]), u.id).total).toBe(req.length)
      expect(req.includes('reading')).toBe(readingForUnit(u.id).length > 0)
      expect(req.includes('listening')).toBe(listeningForUnit(u.id).length > 0)
    }
  })

  it('a unit with all existing content kinds still needs all nine required sections', () => {
    expect(requiredSections(1)).toEqual([...SECTIONS])
    expect(unitProgress(withCompleted(allKeys(1)), 1)).toEqual({ done: 9, total: 9, pct: 100 })
  })

  it('UNIT 10 CAN REACH 100 %: the section without content (reading) is not required', () => {
    expect(readingForUnit(10)).toHaveLength(0)
    expect(requiredSections(10)).not.toContain('reading')
    const required = requiredSections(10).map(s => `10:${s}`)
    expect(unitProgress(withCompleted(required), 10)).toMatchObject({ pct: 100, done: required.length, total: required.length })
  })

  it('completion keys of sections that are not required do not inflate the numerator', () => {
    const p = unitProgress(withCompleted(allKeys(10)), 10)
    expect(p.done).toBe(p.total)
    expect(p.pct).toBe(100)
  })

  it('level progress is completed required sections over all required sections, and reaches 100 % when everything required is done', () => {
    expect(levelProgress(withCompleted([]))).toBe(0)
    const everything = A1_UNITS.flatMap(u => requiredSections(u.id).map(s => `${u.id}:${s}`))
    expect(levelProgress(withCompleted(everything))).toBe(100)
    const total = A1_UNITS.reduce((a, u) => a + requiredSections(u.id).length, 0)
    expect(levelProgress(withCompleted(everything.slice(0, 1)))).toBe(Math.round((1 / total) * 100))
  })

  it('A1 v2 units without vocabulary still count authored content but never become current units', () => {
    const empty = A1_UNITS.filter(u => u.id >= 100 && u.grammarIds.length === 0 && vocabularyForUnit(u.id).length === 0)
    expect(empty).toHaveLength(16)
    for (const u of empty) expect(requiredSections(u.id)).toEqual(['merksaetze', 'reading'])
    // a grammar-only unit requires its reused lesson and any authored reading or Merksätze, but no vocabulary review
    for (const u of A1_UNITS.filter(u => u.id >= 100 && u.grammarIds.length > 0 && vocabularyForUnit(u.id).length === 0))
      expect(requiredSections(u.id)).toEqual(['grammar', 'merksaetze', 'reading'])
    const authored = A1_UNITS.filter(u => vocabularyForUnit(u.id).length > 0)
    const last = authored[authored.length - 1].id
    expect(currentUnit(withCompleted([])).id).toBe(authored[0].id)
    const through = authored.slice(0, -1).flatMap(u => requiredSections(u.id).map(s => `${u.id}:${s}`))
    expect(currentUnit(withCompleted(through)).id).toBe(last)
    const all = [...through, ...requiredSections(last).map(s => `${last}:${s}`)]
    expect(currentUnit(withCompleted(all)).id).toBe(last)
    expect(badges(withCompleted(all)).find(b => b.id === 'unit')?.earned).toBe(true)
    expect(badges(withCompleted([])).find(b => b.id === 'unit')?.earned).toBe(false)
  })
})
