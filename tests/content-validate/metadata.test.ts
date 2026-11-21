// @vitest-environment node
/**
 * Stage 6A — metadata rules: identity and shape come from explicit metadata, never from an id pattern or an array position;
 * the A2 minimums; the release gates; and the empty, planned A2 stays safe.
 */
import { describe, expect, it } from 'vitest'
import { UNIT_MINIMUMS } from '../../scripts/content-validate/rules/metadata'
import type { ContentBundle, Issue } from '../../scripts/content-validate/types'
import { validateContent } from '../../scripts/content-validate/validate'
import { A2_TESTS } from '../../src/data/a2/tests'
import { availableLevels, isLevelVisible } from '../../src/data/course'
import { testsOf, topicTestOfUnit, unitsOfLevel } from '../../src/data/catalog'
import { emptyA2Bundle, validA2Bundle } from './fixtures'

const run = (b: ContentBundle, mode: 'authoring' | 'release' = 'authoring'): Issue[] => validateContent(b, { mode })
const errs = (b: ContentBundle, mode: 'authoring' | 'release' = 'authoring') => run(b, mode).filter(i => i.severity === 'error')
const has = (issues: Issue[], rule: string, where?: string) =>
  issues.some(i => i.rule === rule && (where === undefined || i.where === where))

describe('identity is metadata, not a naming pattern', () => {
  it('the compliant fixture uses ids that follow NO pattern (`unit-11`, `a2-wr-11-01`, `level-a2`) and validates', () => {
    const b = validA2Bundle()
    expect(b.tests.map(t => t.id)).toEqual(expect.arrayContaining(['unit-11', 'level-a2']))
    expect(b.writing.some(w => /^wr\d\d$/.test(w.id) && w.unit === 11)).toBe(false)
    expect(errs(b)).toEqual([])
  })

  it('a topic test must say which unit it belongs to; an unknown unit, a second test for a unit and a bad size are rejected', () => {
    const noUnit = validA2Bundle()
    delete noUnit.tests.find(t => t.id === 'unit-11')!.unit
    expect(has(errs(noUnit), 'test-unit-missing', 'tests:unit-11')).toBe(true)

    const ghost = validA2Bundle()
    ghost.tests.find(t => t.id === 'unit-11')!.unit = 19
    expect(has(errs(ghost), 'ref-unit', 'tests:unit-11')).toBe(true)

    const twice = validA2Bundle()
    twice.tests.push({ id: 'another-final', title: { ru: 'x', ky: 'y' }, kind: 'topic', level: 'A2', unit: 11, size: 2 })
    expect(has(errs(twice), 'test-duplicate-unit', 'units:11')).toBe(true)

    for (const size of [0, -3, 2.5, Number.NaN]) {
      const b = validA2Bundle()
      b.tests.find(t => t.id === 'unit-11')!.size = size
      expect(has(errs(b), 'test-size'), String(size)).toBe(true)
    }
  })

  it('an unknown test kind, and a level/placement test bound to a unit, are rejected', () => {
    const kind = validA2Bundle()
    ;(kind.tests.find(t => t.id === 'level-a2') as { kind: string }).kind = 'mystery'
    expect(has(errs(kind), 'test-kind')).toBe(true)
    const bound = validA2Bundle()
    bound.tests.find(t => t.id === 'level-a2')!.unit = 11
    expect(has(errs(bound), 'test-unit-unexpected')).toBe(true)
  })

  it("the unit id must lie in its level's range", () => {
    const b = validA2Bundle()
    b.units.push({ ...b.units.find(u => u.id === 11)!, id: 99 })
    expect(has(errs(b), 'unit-id-range', 'units:99')).toBe(true)
  })
})

describe('final tests: the size shown on the unit page IS the number of authored questions', () => {
  it('a definition whose size differs from the authored questions is rejected', () => {
    const b = validA2Bundle()
    b.tests.find(t => t.id === 'unit-11')!.size = 8 // the old hard-coded label
    expect(has(errs(b), 'final-test-size', 'tests:unit-11')).toBe(true)
  })

  it('authored questions without a topic test definition for the unit are rejected', () => {
    const b = validA2Bundle()
    b.tests = b.tests.filter(t => t.id !== 'unit-11')
    expect(has(errs(b), 'final-test-definition', 'finalTests:unit11')).toBe(true)
  })

  it('duplicate entries, duplicate question ids, answers outside the options and bad options are rejected', () => {
    const dupEntry = validA2Bundle()
    dupEntry.finalTests = [...(dupEntry.finalTests ?? []), structuredClone((dupEntry.finalTests ?? [])[0])]
    expect(has(errs(dupEntry), 'final-test-duplicate')).toBe(true)

    const dupId = validA2Bundle()
    dupId.finalTests![0].questions[1].id = 'a2-ft-11-01'
    expect(has(errs(dupId), 'unique-id', 'finalTests:unit11#1')).toBe(true)

    const missing = validA2Bundle()
    missing.finalTests![0].questions[0].answer = 'nicht dabei'
    expect(has(errs(missing), 'answer-mapping', 'finalTests:unit11#0')).toBe(true)

    const dupOpt = validA2Bundle()
    dupOpt.finalTests![0].questions[0].options = ['bin', 'BIN']
    expect(has(errs(dupOpt), 'option-duplicate')).toBe(true)

    const empty = validA2Bundle()
    empty.finalTests![0].questions[0].options = ['bin', ' ']
    expect(has(errs(empty), 'option-empty')).toBe(true)
  })
})

describe('the unit → scenario list (positional by design of the A1 data) is validated', () => {
  it('a scenario that does not exist, a scenario used twice and more scenarios than units are rejected', () => {
    const ghost = validA2Bundle()
    ghost.unitSpeaking = { ...ghost.unitSpeaking, A2: ['no-such-scenario'] }
    expect(has(errs(ghost), 'ref-speaking', 'unitSpeaking:A2[0]')).toBe(true)

    const twice = validA2Bundle()
    twice.unitSpeaking = { ...twice.unitSpeaking, A2: ['a2-sp-11-01', 'a2-sp-11-01'] }
    expect(has(errs(twice), 'unit-speaking-duplicate')).toBe(true)
    expect(has(errs(twice), 'unit-speaking-length', 'unitSpeaking:A2')).toBe(true)
  })

  it('the real A1 list is valid', () => {
    expect(errs(emptyA2Bundle())).toEqual([])
  })
})

describe('A2 minimums (the approved quality standard)', () => {
  it('while authoring (A2 planned) a thin unit is INFORMATION, not an error', () => {
    const issues = run(validA2Bundle())
    expect(issues.filter(i => i.rule === 'unit-minimum').every(i => i.severity === 'info')).toBe(true)
    expect(errs(validA2Bundle())).toEqual([])
  })

  it('a release run turns every shortfall into an error, naming the number and the minimum', () => {
    const messages = errs(validA2Bundle(), 'release')
      .filter(i => i.rule === 'unit-minimum')
      .map(i => i.message)
    expect(messages).toEqual(
      expect.arrayContaining([
        `vocabulary items: 3 (minimum ${UNIT_MINIMUMS.vocabulary})`,
        `listening dialogues: 1 (minimum ${UNIT_MINIMUMS.listening})`,
        `handwritten revision exercises: 2 (minimum ${UNIT_MINIMUMS.exercises})`,
        `final-test questions: 2 (minimum ${UNIT_MINIMUMS.finalTest})`,
      ]),
    )
    // what the fixture does satisfy is not reported
    expect(messages.join('|')).not.toMatch(/grammar concepts|reading texts|writing tasks/)
  })

  it('a release run also demands every unit of the level and the level test', () => {
    const issues = errs(validA2Bundle(), 'release')
    for (let u = 12; u <= 20; u++) expect(has(issues, 'unit-missing', `units:${u}`), `unit ${u}`).toBe(true)
    const noLevelTest = validA2Bundle()
    noLevelTest.tests = noLevelTest.tests.filter(t => t.kind !== 'level' || t.level !== 'A2')
    expect(errs(noLevelTest, 'release').some(i => i.rule === 'unit-minimum' && i.where === 'A2')).toBe(true)
  })

  it('too many grammar concepts or reading texts is a warning against the 2–3 / 1–2 standard', () => {
    const b = validA2Bundle()
    for (let i = 3; i <= 4; i++)
      b.grammar.push({ ...structuredClone(b.grammar.find(g => g.id === 'a2-concept-one')!), id: `a2-extra-${i}` })
    expect(run(b).some(i => i.rule === 'unit-maximum' && i.severity === 'warning' && /grammar concepts: 4/.test(i.message))).toBe(true)
  })

  it('a unit without a speaking scenario or a topic test definition is flagged in a release run', () => {
    const b = validA2Bundle()
    b.unitSpeaking = { ...b.unitSpeaking, A2: [] }
    b.tests = b.tests.filter(t => t.id !== 'unit-11')
    b.finalTests = []
    const messages = errs(b, 'release')
      .filter(i => i.where === 'units:11')
      .map(i => i.message)
    expect(messages).toEqual(
      expect.arrayContaining([
        'no speaking scenario is assigned to the unit',
        'no topic test definition (kind "topic", unit) for the unit',
      ]),
    )
  })
})

describe('release gates: a visible level must be completely reviewed for every language it is released for', () => {
  it('RELEASED without a Kyrgyz review of a unit is an error — in ANY mode; in BETA it is an explicit, non-blocking review flag', () => {
    const b = validA2Bundle('released')
    b.reviews = { 11: { cefr: true, ru: true } }
    expect(has(errs(b), 'release-gate-review', 'units:11')).toBe(true)
    expect(errs(b).find(i => i.rule === 'release-gate-review')?.message).toMatch(/Kyrgyz review/)
    const beta = validA2Bundle('beta')
    beta.reviews = { 11: { cefr: true, ru: true } }
    expect(has(errs(beta), 'release-gate-review', 'units:11')).toBe(false)
    const flag = validateContent(beta).find(i => i.rule === 'beta-review-pending' && i.where === 'units:11')
    expect(flag?.severity).toBe('review')
    expect(flag?.message).toMatch(/BETA.*Kyrgyz review/)
    expect(has(errs(beta, 'release'), 'release-gate-review', 'units:11')).toBe(true) // a full release still blocks
  })

  it('a missing Russian review is just as blocking', () => {
    const b = validA2Bundle('released')
    b.reviews = { 11: { cefr: true, ky: true } }
    expect(errs(b).find(i => i.rule === 'release-gate-review')?.message).toMatch(/Russian review/)
  })

  it('a visible level with no units is an error; the same level while planned is not', () => {
    const b = emptyA2Bundle()
    b.course = b.course!.map(l => (l.id === 'A2' ? { ...l, status: 'beta' as const, releasedLocales: ['ru'] } : l))
    expect(has(errs(b), 'release-gate-empty', 'A2')).toBe(true)
    expect(errs(emptyA2Bundle())).toEqual([])
  })

  it('a language the level is NOT released for needs no review for it', () => {
    const b = validA2Bundle('beta')
    b.course = b.course!.map(l => (l.id === 'A2' ? { ...l, releasedLocales: ['ru'] } : l))
    b.reviews = { 11: { cefr: true, ru: true } } // no Kyrgyz review, and Kyrgyz is not released
    expect(has(errs(b), 'release-gate-review')).toBe(false)
  })
})

describe('the empty, planned A2 is safe and invisible', () => {
  it('validates without errors, warnings or review flags in authoring mode, and says it is empty', () => {
    const issues = run(emptyA2Bundle())
    expect(issues.filter(i => i.severity !== 'info')).toEqual([])
    expect(issues.find(i => i.rule === 'level-empty')?.message).toMatch(/A2 has no units yet \(status planned\)/)
  })

  it('a release run REFUSES the empty A2 (it cannot be released) but never crashes', () => {
    const issues = errs(emptyA2Bundle(), 'release')
    expect(issues.length).toBeGreaterThan(0)
    expect(issues.every(i => i.rule === 'unit-missing' || i.rule === 'unit-minimum')).toBe(true)
  })

  it('only units 11–20 have a test definition and a unit, nothing is visible, no unit beyond 20 has a test', () => {
    expect(A2_TESTS.map(t => t.id)).toEqual([
      'unit-11',
      'unit-12',
      'unit-13',
      'unit-14',
      'unit-15',
      'unit-16',
      'unit-17',
      'unit-18',
      'unit-19',
      'unit-20',
    ])
    expect(testsOf('A2')).toEqual(A2_TESTS)
    expect(unitsOfLevel('A2').map(u => u.id)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    expect(topicTestOfUnit(11)?.id).toBe('unit-11')
    expect(topicTestOfUnit(12)?.id).toBe('unit-12')
    expect(topicTestOfUnit(13)?.id).toBe('unit-13')
    expect(topicTestOfUnit(14)?.id).toBe('unit-14')
    expect(topicTestOfUnit(15)?.id).toBe('unit-15')
    expect(topicTestOfUnit(16)?.id).toBe('unit-16')
    expect(topicTestOfUnit(17)?.id).toBe('unit-17')
    expect(topicTestOfUnit(18)?.id).toBe('unit-18')
    expect(topicTestOfUnit(19)?.id).toBe('unit-19')
    expect(topicTestOfUnit(20)?.id).toBe('unit-20')
    for (const u of [33, 99]) expect(topicTestOfUnit(u)).toBeUndefined()
    expect(topicTestOfUnit(21)?.level ?? 'B1').toBe('B1') // unit 21 belongs to B1, never to A2
    expect(isLevelVisible('A2')).toBe(true) // controlled Beta
    expect(availableLevels('ru')).toEqual(['A1', 'A2', 'B1'])
    expect(availableLevels('ky')).toEqual(['A1', 'A2', 'B1'])
    expect(availableLevels('de')).toEqual(['A1']) // not offered to the German interface
  })

  it('a bundle without a course registry is legacy as a whole: no strict rule can fire (the original skeleton behaviour)', () => {
    const b = validA2Bundle()
    delete b.course
    b.vocabulary.find(v => v.id === 'v11-1')!.ky = ''
    expect(errs(b)).toEqual([])
  })
})
