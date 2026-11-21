// @vitest-environment node
/**
 * B1 Stage 1 — infrastructure only. B1 is REGISTERED (units 21–32, lazy chunk, static ids) but PLANNED: invisible to every learner and
 * interface language, with no lesson. These tests pin that state, the route protection, the generalised lazy loader (A2 unchanged, B1 its
 * own slot), the PWA/bundle tooling and the compatibility with unit ids and assessment ids. The test-only visibility switch mutates COURSE
 * and is restored after every test (as in tests/data/lazy-level.test.tsx); nothing here changes production data.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { isRouteAccessible, levelOfRoute, levelOfTestId, levelsToLoad } from '../../src/app/routeAccess'
import {
  allUnits,
  isLevelContentLoaded,
  loadLevelContent,
  plannedUnitsOf,
  testIndex,
  unitsOfLevel,
  vocabularyOf,
} from '../../src/data/catalog'
import {
  COURSE,
  availableLevels,
  courseLevel,
  isLevelReleasedFor,
  isLevelVisible,
  levelOfUnitId,
  resolveActiveLevel,
} from '../../src/data/course'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { isProtectedTest } from '../../src/storage/validate'
import { buildShellManifest } from '../../scripts/pwa/vite-plugin'

type Mutable = { status: string; releasedLocales: string[] }
const level = (id: string) => COURSE.levels.find(l => l.id === id) as unknown as Mutable
const setB1 = (status: string, locales: string[]) => Object.assign(level('B1'), { status, releasedLocales: locales })
const route = (path: string) => {
  const [p, qs = ''] = path.split('?')
  return { path: p, parts: p.split('/').filter(Boolean), query: new URLSearchParams(qs) } as never
}
const LANGS = ['ru', 'ky', 'de'] as const
const result = (id: string) => ({ id, at: 1, pct: 50, weak: [], strong: [] })
afterEach(() => setB1('beta', ['ru', 'ky'])) // the shipped state since the B1 Beta launch

describe('B1 registry', () => {
  it('is registered as a BETA: units 21–32, released for ru and ky only (NOT `released`), visible', () => {
    const b1 = courseLevel('B1')!
    expect(b1.id).toBe('B1')
    expect(b1.status).toBe('beta')
    expect(b1.unitIdRange).toEqual([21, 32])
    expect(b1.releasedLocales).toEqual(['ru', 'ky'])
    expect(isLevelVisible('B1')).toBe(true)
    for (const l of ['ru', 'ky'] as const) expect(isLevelReleasedFor('B1', l)).toBe(true) // "released for the locale" = available as a Beta, like A2
    expect(isLevelReleasedFor('B1', 'ru') && courseLevel('B1')!.status === 'released').toBe(false) // but NOT a stable release
  })
  it('the existing levels are untouched (A1 released, A2 controlled Beta for ru and ky)', () => {
    expect(courseLevel('A1')).toMatchObject({ status: 'released', unitIdRange: [1, 10], releasedLocales: ['ru', 'ky'] })
    expect(courseLevel('A2')).toMatchObject({ status: 'beta', unitIdRange: [11, 20], releasedLocales: ['ru', 'ky'] })
  })
  it('unit ids cannot collide: the ranges are disjoint and contiguous, and every id 1–32 has exactly one owner', () => {
    const owners = Array.from({ length: 32 }, (_, i) => levelOfUnitId(i + 1))
    expect(owners.slice(0, 10).every(l => l === 'A1')).toBe(true)
    expect(owners.slice(10, 20).every(l => l === 'A2')).toBe(true)
    expect(owners.slice(20).every(l => l === 'B1')).toBe(true)
    for (const u of [0, 33, -1, 1.5]) expect(levelOfUnitId(u)).toBeUndefined()
    for (let i = 1; i < COURSE.levels.length; i++) expect(COURSE.levels[i].unitIdRange[0]).toBe(COURSE.levels[i - 1].unitIdRange[1] + 1)
  })
  it('the unit plan holds the 12 approved identities (ids 21–32); the content module holds Units 21–28, and the slot is empty until the chunk is loaded', () => {
    expect(plannedUnitsOf('B1').map(p => p.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(unitsOfLevel('B1')).toEqual([]) // not loaded: the lazy slot is empty
    expect(vocabularyOf('B1')).toEqual([])
    expect(B1_CONTENT.units.map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.vocabulary).toHaveLength(480)
    for (const k of ['placement', 'tutorTemplates', 'instructions'] as const) expect(B1_CONTENT[k]).toHaveLength(0)
  })
})

describe('B1 in the hypothetical state "planned" (it ships as a Beta): invisible and protected', () => {
  beforeEach(() => setB1('planned', []))
  it('no interface language is offered B1 (German never: it only gets released levels)', () => {
    expect(availableLevels('ru')).toEqual(['A1', 'A2'])
    expect(availableLevels('ky')).toEqual(['A1', 'A2'])
    expect(availableLevels('de')).toEqual(['A1'])
  })
  it('a stored B1 preference resolves to A1 and is not offered as active level', () => {
    for (const l of LANGS) expect(resolveActiveLevel('B1', l)).toBe('A1')
    expect(resolveActiveLevel('B1')).toBe('A1')
  })
  it('every route that addresses B1 content is "not accessible" in every language', () => {
    for (const lang of LANGS)
      for (const p of [
        '/learn/unit/21',
        '/learn/unit/32',
        '/practice/tests/unit-21',
        '/practice/tests/level-b1',
        '/practice/tests/placement-b1',
        '/practice/review?unit=25',
      ]) {
        expect(levelOfRoute(route(p)), `${lang} ${p}`).toBe('B1')
        expect(isRouteAccessible(route(p), lang), `${lang} ${p}`).toBe(false)
      }
  })
  it('routes of A1 and A2 are not affected', () => {
    expect(isRouteAccessible(route('/learn/unit/1'), 'de')).toBe(true)
    expect(isRouteAccessible(route('/learn/unit/11'), 'ru')).toBe(true)
    expect(isRouteAccessible(route('/practice/tests/unit-12'), 'ky')).toBe(true)
    expect(isRouteAccessible(route('/learn/unit/11'), 'de')).toBe(false)
  })
  it('the route gate never requests the B1 chunk while B1 is planned — whatever the route, language or stored level', () => {
    for (const lang of LANGS)
      for (const active of ['A1', 'A2', 'B1'] as const)
        for (const p of ['/', '/learn', '/learn/unit/21', '/practice/tests/level-b1', '/practice/tests/unit-32', '/grammar/anything'])
          expect(levelsToLoad(route(p), lang, active), `${lang} ${active} ${p}`).not.toContain('B1')
  })
  it('a planned level cannot be loaded without the development preview flag, and stays empty', async () => {
    await expect(loadLevelContent('B1')).rejects.toThrow(/not available/)
    expect(isLevelContentLoaded('B1')).toBe(false)
  })
})

describe('assessment ids and progress compatibility', () => {
  it('test ids resolve statically: unit-21…32, level-b1 and placement-b1 belong to B1; A1/A2 ids are unchanged; unknown ids belong to nothing', () => {
    expect(levelOfTestId('unit-10')).toBe('A1')
    expect(levelOfTestId('unit-11')).toBe('A2')
    expect(levelOfTestId('unit-21')).toBe('B1')
    expect(levelOfTestId('unit-32')).toBe('B1')
    expect(levelOfTestId('unit-33')).toBeUndefined()
    expect(levelOfTestId('level-a2')).toBe('A2')
    expect(levelOfTestId('placement-a2')).toBe('A2')
    expect(levelOfTestId('level-b1')).toBe('B1')
    expect(levelOfTestId('placement-b1')).toBe('B1')
    expect(levelOfTestId('level-a1')).toBe('A1')
    expect(levelOfTestId('placement')).toBe('A1')
    for (const id of ['level-b2', 'level-c1', 'placement-a1', 'level-', 'level-b11', 'nope']) expect(levelOfTestId(id), id).toBeUndefined()
    expect(testIndex.has('level-b1')).toBe(false)
  })
  it('level-b1 and placement-b1 results are protected from eviction by ordinary tests (existing storage rule, unchanged)', () => {
    for (const id of ['level-b1', 'placement-b1', 'level-a2', 'level-a1']) expect(isProtectedTest(result(id)), id).toBe(true)
    expect(isProtectedTest(result('unit-21'))).toBe(false)
  })
})

describe('lazy loading: generalised loader (A2 exactly as before, B1 its own slot)', () => {
  it('A2 still loads on demand while B1 stays unloaded and empty; allUnits holds only A2 units after the load', async () => {
    expect(isLevelContentLoaded('A2')).toBe(false)
    await loadLevelContent('A2')
    expect(isLevelContentLoaded('A2')).toBe(true)
    expect(unitsOfLevel('A2').map(u => u.id)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    expect(isLevelContentLoaded('B1')).toBe(false)
    expect(unitsOfLevel('B1')).toEqual([])
    expect(allUnits.every(u => u.id <= 20)).toBe(true)
    await loadLevelContent('A2') // idempotent
  })
  it('a visible B1 is requested (only) for its own routes, its own active level, and only for the languages it is released for', () => {
    setB1('beta', ['ru', 'ky'])
    expect(availableLevels('ru')).toContain('B1')
    expect(availableLevels('de')).not.toContain('B1')
    expect(levelsToLoad(route('/learn/unit/21'), 'ru', 'A1')).toEqual(['B1'])
    expect(levelsToLoad(route('/practice/tests/level-b1'), 'ky', 'A1')).toEqual(['B1'])
    expect(levelsToLoad(route('/learn/unit/21'), 'de', 'A1')).toEqual([])
    expect(levelsToLoad(route('/learn/unit/1'), 'ru', 'A1')).toEqual([])
    expect(levelsToLoad(route('/learn'), 'ru', 'B1')).toEqual(['B1']) // a route of no level: the active level is loaded (as for A2)
    expect(levelsToLoad(route('/learn/unit/1'), 'ru', 'B1')).toEqual([]) // an A1 route (loaded level) requests nothing
    expect(levelsToLoad(route('/learn/unit/12'), 'ru', 'A1')).not.toContain('B1')
  })
  it('B1 loads through its own loader once visible: the slot receives Units 21–28 only, A2 and A1 are untouched, and the load is idempotent', async () => {
    setB1('beta', ['ru', 'ky'])
    await loadLevelContent('B1')
    expect(isLevelContentLoaded('B1')).toBe(true)
    expect(unitsOfLevel('B1').map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(unitsOfLevel('A2')).toHaveLength(10)
    expect(allUnits.filter(u => u.id > 20).map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(allUnits.filter(u => u.id <= 20).every(u => u.level !== 'B1')).toBe(true)
    await loadLevelContent('B1')
  })
})

describe('PWA precache exclusion and bundle-size recognition', () => {
  const files = ['index.html', 'assets/index-aaa.js', 'assets/index-aaa.css', 'assets/a2-content-bbb.js', 'assets/b1-content-ccc.js'].map(
    path => ({ path, content: path }),
  )
  it('the shell manifest never precaches any <level>-content chunk, and lists each as lazy', () => {
    const m = buildShellManifest(files)
    expect(m.precache).toEqual(['assets/index-aaa.css', 'assets/index-aaa.js', 'index.html'])
    expect(m.lazy).toEqual(['assets/a2-content-bbb.js', 'assets/b1-content-ccc.js'])
  })
  it('adding a lazy chunk does not change the shell version (the shell is what is precached)', () => {
    const withB1 = buildShellManifest(files)
    const without = buildShellManifest(files.filter(f => !f.path.includes('b1-content')))
    expect(withB1.version).toBe(without.version)
  })
  it('the bundle-size report recognises the same chunks as lazy (not entry JS)', () => {
    const src = readFileSync(join(__dirname, '../../scripts/regression/bundle-size.mjs'), 'utf8')
    const m = /const LAZY = \/(.+)\/\r?\n/.exec(src)
    expect(m).not.toBeNull()
    const re = new RegExp(m![1])
    for (const f of ['assets/a2-content-abc.js', 'assets/b1-content-abc.js']) expect(re.test(f), f).toBe(true)
    for (const f of ['assets/index-abc.js', 'assets/b1-content-abc.css', 'assets/nested/b1-content-abc.js'])
      expect(re.test(f), f).toBe(false)
  })
})
