// @vitest-environment node
/**
 * Stage 1 of the A2 plan: level-scoped catalog + course registry.
 *  - A1 PARITY: every A1 selector returns exactly the original A1 export (same array reference, hence also deep-equal)
 *  - A2 ISOLATION: A2 selectors return only A2 data, and nothing ever flows between levels
 *  - skeleton typing, id uniqueness, registry consistency, dependency-layering, and "no consumer uses this yet"
 */
import '../load-a2'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { describe, expect, expectTypeOf, it } from 'vitest'
import { analyze } from '../../scripts/check-boundaries.mjs'
import { A2_EXERCISES } from '../../src/data/a2/exercises'
import { A2_GRAMMAR, A2_WHY_NOTES } from '../../src/data/a2/grammar'
import { A2_LISTENING } from '../../src/data/a2/listening'
import { A2_READING } from '../../src/data/a2/reading'
import { A2_SPEAKING } from '../../src/data/a2/speaking'
import { A2_FINAL_TESTS, A2_TESTS, type A2FinalTest } from '../../src/data/a2/tests'
import type { A2TestDef } from '../../src/data/a2/types'
import { A2_UNITS, A2_UNIT_SPEAKING } from '../../src/data/a2/units'
import { A2_VOCABULARY } from '../../src/data/a2/vocabulary'
import { A2_WRITING } from '../../src/data/a2/writing'
import * as catalog from '../../src/data/catalog'
import {
  allUnits,
  contentOf,
  exerciseIndex,
  exercisesForUnit,
  exercisesOf,
  finalTestOfUnit,
  finalTestsOf,
  grammarForUnit,
  grammarIndex,
  grammarOf,
  levelOfUnit,
  listeningForUnit,
  listeningIndex,
  listeningOf,
  readingForUnit,
  readingIndex,
  readingOf,
  speakingForUnit,
  speakingIndex,
  speakingOf,
  testIndex,
  testsOf,
  unitById,
  unitSpeakingOf,
  unitsOfLevel,
  vocabularyForUnit,
  vocabularyIndex,
  vocabularyOf,
  whyNotesOf,
  writingForUnit,
  writingIndex,
  writingOf,
} from '../../src/data/catalog'
import { COURSE, courseLevel, isLevelReleasedFor, isLevelVisible, levelOfUnitId } from '../../src/data/course'
import { EXERCISES, exerciseById, exercisesForUnit as legacyExercisesForUnit } from '../../src/data/exercises'
import { GRAMMAR, WHY_NOTES, grammarById, grammarForUnit as legacyGrammarForUnit } from '../../src/data/grammar'
import { LISTENING, listeningById, listeningForUnit as legacyListeningForUnit } from '../../src/data/listening'
import { READING, readingById, readingForUnit as legacyReadingForUnit } from '../../src/data/reading'
import { TESTS, testById } from '../../src/data/reallife'
import { SPEAKING, speakingById } from '../../src/data/speaking'
import type {
  Exercise,
  GrammarConcept,
  LearningUnit,
  ListeningExercise,
  ReadingText,
  SpeakingScenario,
  TestDef,
  VocabularyItem,
  WhyNote,
  WritingTask,
} from '../../src/data/types'
import { UNITS, UNIT_SPEAKING, unitById as legacyUnitById } from '../../src/data/units'
import { VOCABULARY, vocabById, vocabForUnit } from '../../src/data/vocabulary'
import { WRITING, writingById } from '../../src/data/writing'
import { COURSE_ID } from '../../src/storage/defaults'

const root = join(__dirname, '../..')
const baseline = JSON.parse(readFileSync(join(__dirname, '../regression/baselines/a1-selectors.json'), 'utf8')) as ReturnType<
  typeof import('../regression/a1-snapshot').computeSelectors
>

describe('A1 parity: catalog selectors return exactly the original A1 data', () => {
  it('unitsOfLevel(A1) is UNITS (same array, same order)', () => {
    expect(unitsOfLevel('A1')).toBe(UNITS)
    expect(unitsOfLevel('A1')).toEqual(UNITS)
  })

  it.each([
    ['vocabularyOf', vocabularyOf('A1'), VOCABULARY],
    ['grammarOf', grammarOf('A1'), GRAMMAR],
    ['whyNotesOf', whyNotesOf('A1'), WHY_NOTES],
    ['exercisesOf', exercisesOf('A1'), EXERCISES],
    ['listeningOf', listeningOf('A1'), LISTENING],
    ['readingOf', readingOf('A1'), READING],
    ['speakingOf', speakingOf('A1'), SPEAKING],
    ['writingOf', writingOf('A1'), WRITING],
    ['testsOf', testsOf('A1'), TESTS],
    ['unitSpeakingOf', unitSpeakingOf('A1'), UNIT_SPEAKING],
  ])('%s(A1) is the original export (same reference)', (_name, fromCatalog, original) => {
    expect(fromCatalog).toBe(original)
  })

  it('A1 has no authored final-test list (A1 final tests are the existing `unit-N` TestDefs)', () => {
    expect(finalTestsOf('A1')).toEqual([])
    expect(UNITS.every(u => finalTestOfUnit(u.id) === undefined)).toBe(true)
  })

  it('per-unit selectors equal the legacy helpers for every A1 unit', () => {
    for (const u of UNITS) {
      expect(vocabularyForUnit(u.id), `vocabulary u${u.id}`).toEqual(vocabForUnit(u.id))
      expect(grammarForUnit(u.id), `grammar u${u.id}`).toEqual(legacyGrammarForUnit(u.id))
      expect(exercisesForUnit(u.id), `exercises u${u.id}`).toEqual(legacyExercisesForUnit(u.id))
      expect(listeningForUnit(u.id), `listening u${u.id}`).toEqual(legacyListeningForUnit(u.id))
      expect(readingForUnit(u.id), `reading u${u.id}`).toEqual(legacyReadingForUnit(u.id))
      expect(writingForUnit(u.id), `writing u${u.id}`).toEqual(WRITING.filter(w => w.unit === u.id))
      expect(speakingForUnit(u.id), `speaking u${u.id}`).toBe(UNIT_SPEAKING[u.id - 1])
      expect(levelOfUnit(u.id)).toBe('A1')
      expect(unitById(u.id)).toBe(legacyUnitById(u.id))
    }
  })

  it('every A1 id resolves, through the catalog index, to the same object as the legacy lookup', () => {
    for (const v of VOCABULARY) expect(vocabularyIndex.get(v.id)).toBe(vocabById.get(v.id))
    for (const g of GRAMMAR) expect(grammarIndex.get(g.id)).toBe(grammarById.get(g.id))
    for (const e of EXERCISES) expect(exerciseIndex.get(e.id)).toBe(exerciseById.get(e.id))
    for (const l of LISTENING) expect(listeningIndex.get(l.id)).toBe(listeningById.get(l.id))
    for (const r of READING) expect(readingIndex.get(r.id)).toBe(readingById.get(r.id))
    for (const w of WRITING) expect(writingIndex.get(w.id)).toBe(writingById.get(w.id))
    for (const s of SPEAKING) expect(speakingIndex.get(s.id)).toBe(speakingById.get(s.id))
    for (const t of TESTS) expect(testIndex.get(t.id)).toBe(testById.get(t.id))
  })

  it('matches the Stage-0 selector baseline (ids, per-unit counts, units, speaking map, tests)', () => {
    const map = <T extends { id: string }>(xs: readonly T[], f: (x: T) => unknown) => xs.map(f)
    expect(unitsOfLevel('A1').map(u => ({ id: u.id, level: u.level, grammarIds: u.grammarIds }))).toEqual(baseline.units)
    expect([...unitSpeakingOf('A1')]).toEqual(baseline.unitSpeaking)
    expect(map(vocabularyOf('A1'), v => v.id)).toEqual(baseline.vocabularyIds)
    expect(map(grammarOf('A1'), g => ({ id: g.id, unit: g.unit, level: g.level }))).toEqual(baseline.grammarIds)
    expect(map(exercisesOf('A1'), e => e.id)).toEqual(baseline.exerciseIds)
    expect(map(listeningOf('A1'), l => ({ id: l.id, unit: l.unit, level: l.level }))).toEqual(baseline.listeningIds)
    expect(map(readingOf('A1'), r => ({ id: r.id, unit: r.unit, level: r.level }))).toEqual(baseline.readingIds)
    expect(map(writingOf('A1'), w => ({ id: w.id, unit: w.unit, level: w.level }))).toEqual(baseline.writingIds)
    expect(map(speakingOf('A1'), s => ({ id: s.id, level: s.level }))).toEqual(baseline.speakingIds)
    expect(map(testsOf('A1'), t => ({ id: t.id, kind: t.kind, level: t.level, unit: t.unit ?? null, size: t.size }))).toEqual(
      baseline.tests,
    )
    expect(Object.fromEntries(UNITS.map(u => [u.id, vocabularyForUnit(u.id).length]))).toEqual(baseline.vocabularyPerUnit)
    expect(Object.fromEntries(UNITS.map(u => [u.id, exercisesForUnit(u.id).length]))).toEqual(baseline.exercisesPerUnit)
  })

  it('legacy A2-tagged fragments inside A1 units stay in A1 (level of an item = level of its unit, decision D-1)', () => {
    const legacyA2 = LISTENING.filter(l => l.level === 'A2')
    expect(legacyA2.length).toBeGreaterThan(0)
    for (const l of legacyA2) {
      expect(listeningOf('A1')).toContain(l)
      expect(listeningOf('A2')).not.toContain(l)
      expect(levelOfUnit(l.unit)).toBe('A1')
    }
  })
})

describe('A2 selectors return only A2 data (and are empty until content is authored)', () => {
  it('each A2 selector returns its own A2 module (same reference)', () => {
    expect(unitsOfLevel('A2')).toBe(A2_UNITS)
    expect(vocabularyOf('A2')).toBe(A2_VOCABULARY)
    expect(grammarOf('A2')).toBe(A2_GRAMMAR)
    expect(whyNotesOf('A2')).toBe(A2_WHY_NOTES)
    expect(exercisesOf('A2')).toBe(A2_EXERCISES)
    expect(listeningOf('A2')).toBe(A2_LISTENING)
    expect(readingOf('A2')).toBe(A2_READING)
    expect(speakingOf('A2')).toBe(A2_SPEAKING)
    expect(writingOf('A2')).toBe(A2_WRITING)
    expect(testsOf('A2')).toBe(A2_TESTS)
    expect(unitSpeakingOf('A2')).toBe(A2_UNIT_SPEAKING)
    expect(finalTestsOf('A2')).toBe(A2_FINAL_TESTS)
  })

  it('A2 ships units 11–20 only: every authored item belongs to one of them, all ten planned units are authored', () => {
    expect(A2_UNITS.map(u => u.id)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    expect(A2_UNIT_SPEAKING).toEqual([
      'a2-sp-11-01',
      'a2-sp-12-01',
      'a2-sp-13-01',
      'a2-sp-14-01',
      'a2-sp-15-01',
      'a2-sp-16-01',
      'a2-sp-17-01',
      'a2-sp-18-01',
      'a2-sp-19-01',
      'a2-sp-20-01',
    ])
    expect(A2_TESTS.map(t => t.unit)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    expect(A2_FINAL_TESTS.map(t => t.unit)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    for (const c of [A2_VOCABULARY, A2_GRAMMAR, A2_EXERCISES, A2_LISTENING, A2_READING, A2_WRITING] as { unit: number }[][])
      for (const x of c) expect([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]).toContain(x.unit)
    const concepts = new Set(A2_GRAMMAR.map(g => g.id))
    for (const n of A2_WHY_NOTES) expect(concepts.has(n.conceptId)).toBe(true)
    expect(A2_SPEAKING.map(s => s.id)).toEqual([
      'a2-sp-11-01',
      'a2-sp-12-01',
      'a2-sp-13-01',
      'a2-sp-14-01',
      'a2-sp-15-01',
      'a2-sp-16-01',
      'a2-sp-17-01',
      'a2-sp-18-01',
      'a2-sp-19-01',
      'a2-sp-20-01',
    ])
  })

  it('A2 content, whenever it exists, must satisfy the level rules (vacuously true today)', () => {
    const [lo, hi] = courseLevel('A2')!.unitIdRange
    const inRange = (u: number) => u >= lo && u <= hi
    for (const u of unitsOfLevel('A2')) {
      expect(u.level).toBe('A2')
      expect(inRange(u.id)).toBe(true)
    }
    for (const x of [
      ...vocabularyOf('A2'),
      ...grammarOf('A2'),
      ...exercisesOf('A2'),
      ...listeningOf('A2'),
      ...readingOf('A2'),
      ...writingOf('A2'),
    ])
      expect(inRange((x as { unit: number }).unit)).toBe(true)
    for (const g of grammarOf('A2')) expect(g.level).toBe('A2')
    for (const x of [...listeningOf('A2'), ...readingOf('A2'), ...writingOf('A2'), ...speakingOf('A2'), ...testsOf('A2')])
      expect((x as { level: string }).level).toBe('A2')
  })

  it('per-unit selectors: units 11–20 are populated, unit 20 included, and unit ids outside every range resolve to nothing', () => {
    expect(levelOfUnit(11)).toBe('A2')
    expect(vocabularyForUnit(11).length).toBeGreaterThanOrEqual(28)
    expect(unitById(11)?.title).toBe('Über mich und meine Erfahrungen')
    expect(speakingForUnit(11)).toBe('a2-sp-11-01')
    expect(finalTestOfUnit(11)?.questions).toHaveLength(15)
    expect(unitById(12)?.title).toBe('Familie, Freunde und Zusammenleben')
    expect(speakingForUnit(12)).toBe('a2-sp-12-01')
    expect(finalTestOfUnit(12)?.questions).toHaveLength(15)
    expect(unitById(13)?.title).toBe('Wohnen und Nachbarschaft')
    expect(speakingForUnit(13)).toBe('a2-sp-13-01')
    expect(finalTestOfUnit(13)?.questions).toHaveLength(15)
    expect(unitById(14)?.title).toBe('Gesundheit und Wohlbefinden')
    expect(speakingForUnit(14)).toBe('a2-sp-14-01')
    expect(finalTestOfUnit(14)?.questions).toHaveLength(15)
    expect(unitById(15)?.title).toBe('Essen, Einkaufen und Dienstleistungen')
    expect(speakingForUnit(15)).toBe('a2-sp-15-01')
    expect(finalTestOfUnit(15)?.questions).toHaveLength(15)
    expect(unitById(16)?.title).toBe('Freizeit, Medien und Kultur')
    expect(speakingForUnit(16)).toBe('a2-sp-16-01')
    expect(finalTestOfUnit(16)?.questions).toHaveLength(15)
    expect(unitById(17)?.title).toBe('Schule, Ausbildung und Beruf')
    expect(speakingForUnit(17)).toBe('a2-sp-17-01')
    expect(finalTestOfUnit(17)?.questions).toHaveLength(15)
    expect(unitById(18)?.title).toBe('Reisen, Urlaub und Mobilität')
    expect(speakingForUnit(18)).toBe('a2-sp-18-01')
    expect(finalTestOfUnit(18)?.questions).toHaveLength(15)
    expect(unitById(19)?.title).toBe('Stadtleben und öffentliche Dienste')
    expect(speakingForUnit(19)).toBe('a2-sp-19-01')
    expect(finalTestOfUnit(19)?.questions).toHaveLength(15)
    expect(unitById(20)?.title).toBe('Pläne, Einladungen und gemeinsame Entscheidungen')
    expect(speakingForUnit(20)).toBe('a2-sp-20-01')
    expect(finalTestOfUnit(20)?.questions).toHaveLength(15)
    for (const u of [0, -1, 21, 99, 1.5]) {
      expect(levelOfUnit(u)).toBeUndefined()
      expect(vocabularyForUnit(u)).toEqual([])
      expect(speakingForUnit(u)).toBeUndefined()
    }
  })

  it('levels without a content module (B1, B2, C1) are empty and shared by reference-free empties', () => {
    for (const l of ['B1', 'B2', 'C1'] as const) {
      const c = contentOf(l)
      for (const v of Object.values(c)) expect(v).toHaveLength(0)
    }
    expect(Object.isFrozen(contentOf('B1'))).toBe(true)
  })

  it('allUnits is the A1 units followed by the A2 units; no unit is shared between levels', () => {
    expect(allUnits).toEqual([...UNITS, ...A2_UNITS])
  })
})

describe('isolation: nothing flows between levels, even once A2 has content', () => {
  it('a temporary A2 item shows up only in A2 selectors; A1 selectors (and the legacy exports) are unaffected', () => {
    const a1Before = { v: [...VOCABULARY], e: [...EXERCISES], l: [...LISTENING], u: [...UNITS] }
    const vocab = {
      id: 'v20-999',
      unit: 20,
      pos: 'noun',
      article: 'das',
      de: 'Beispiel',
      ru: 'пример',
      ky: 'мисал',
      example: 'x',
      exampleRu: 'x',
      related: [],
    } as VocabularyItem
    const ex = {
      id: 'a2-ex-20-99',
      type: 'choice',
      unit: 20,
      prompt: 'x',
      answer: 'a',
      options: ['a', 'b'],
      why: { ru: 'r', ky: 'k' },
    } as Exercise
    const lis = { id: 'a2-li-20-99', level: 'A2', unit: 20, title: 't', lines: [], questions: [], keywords: [] } as ListeningExercise
    const unit = { id: 20, level: 'A2', title: 'T', subtitle: { ru: 'r', ky: 'k' }, icon: '·', grammarIds: [] } as LearningUnit
    // the real units 11–20 stay in place: only the temporary extra unit-20 items are added and exactly those are removed again
    const before = {
      v: A2_VOCABULARY.length,
      e: A2_EXERCISES.length,
      l: A2_LISTENING.length,
      u: A2_UNITS.length,
      s: A2_UNIT_SPEAKING.length,
    }
    const pilotUnits = [...A2_UNITS]
    const real = { v: vocabularyForUnit(20), e: exercisesForUnit(20), l: listeningForUnit(20), s: speakingForUnit(20) }
    A2_VOCABULARY.push(vocab)
    A2_EXERCISES.push(ex)
    A2_LISTENING.push(lis)
    A2_UNITS.push(unit)
    A2_UNIT_SPEAKING.push('some-scenario')
    try {
      expect(vocabularyOf('A2')).toContain(vocab)
      expect(vocabularyForUnit(20)).toEqual([...real.v, vocab])
      expect(exercisesForUnit(20)).toEqual([...real.e, ex])
      expect(listeningForUnit(20)).toEqual([...real.l, lis])
      expect(speakingForUnit(20)).toBe(real.s) // the real unit-20 scenario stays the unit's scenario
      expect(unitsOfLevel('A2')).toEqual([...pilotUnits, unit])
      // the legacy per-unit helpers and every A1 selector never see A2 data
      expect(vocabularyOf('A1')).not.toContain(vocab)
      expect(exercisesOf('A1')).not.toContain(ex)
      expect(listeningOf('A1')).not.toContain(lis)
      expect(unitsOfLevel('A1')).not.toContain(unit)
      expect(vocabularyOf('A1')).toEqual(a1Before.v)
      expect(exercisesOf('A1')).toEqual(a1Before.e)
      expect(listeningOf('A1')).toEqual(a1Before.l)
      expect(unitsOfLevel('A1')).toEqual(a1Before.u)
      expect(VOCABULARY).toEqual(a1Before.v)
      expect(vocabForUnit(20)).toEqual([])
    } finally {
      A2_VOCABULARY.length = before.v
      A2_EXERCISES.length = before.e
      A2_LISTENING.length = before.l
      A2_UNITS.length = before.u
      A2_UNIT_SPEAKING.length = before.s
    }
    expect(A2_VOCABULARY).toHaveLength(before.v)
    expect(A2_UNITS.map(u => u.id)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
  })
})

describe('ids are globally unique across levels (progress keys and routes depend on it)', () => {
  it('no duplicate ids inside, or between, A1 and A2 collections', () => {
    const dupFree = (name: string, ids: (string | number)[]) => expect(new Set(ids).size, name).toBe(ids.length)
    dupFree(
      'units',
      allUnits.map(u => u.id),
    )
    for (const [name, pick] of Object.entries({
      vocabulary: (l: 'A1' | 'A2') => vocabularyOf(l),
      grammar: (l: 'A1' | 'A2') => grammarOf(l),
      exercises: (l: 'A1' | 'A2') => exercisesOf(l),
      listening: (l: 'A1' | 'A2') => listeningOf(l),
      reading: (l: 'A1' | 'A2') => readingOf(l),
      writing: (l: 'A1' | 'A2') => writingOf(l),
      speaking: (l: 'A1' | 'A2') => speakingOf(l),
      tests: (l: 'A1' | 'A2') => testsOf(l),
    }))
      dupFree(
        name,
        [...pick('A1'), ...pick('A2')].map(x => x.id),
      )
  })
})

describe('A2 skeletons are correctly typed', () => {
  it('each empty module has the exact interface type of the A1 data it will mirror', () => {
    expectTypeOf(A2_UNITS).toEqualTypeOf<LearningUnit[]>()
    expectTypeOf(A2_UNIT_SPEAKING).toEqualTypeOf<string[]>()
    expectTypeOf(A2_VOCABULARY).toEqualTypeOf<VocabularyItem[]>()
    expectTypeOf(A2_GRAMMAR).toEqualTypeOf<GrammarConcept[]>()
    expectTypeOf(A2_WHY_NOTES).toEqualTypeOf<WhyNote[]>()
    expectTypeOf(A2_EXERCISES).toEqualTypeOf<Exercise[]>()
    expectTypeOf(A2_LISTENING).toEqualTypeOf<ListeningExercise[]>()
    expectTypeOf(A2_READING).toEqualTypeOf<ReadingText[]>()
    expectTypeOf(A2_SPEAKING).toEqualTypeOf<SpeakingScenario[]>()
    expectTypeOf(A2_WRITING).toEqualTypeOf<WritingTask[]>()
    // Stage 6A: A2 tests carry the STRICT type (Russian + Kyrgyz titles required, level fixed to A2) and stay assignable to the shared TestDef
    expectTypeOf(A2_TESTS).toEqualTypeOf<A2TestDef[]>()
    expectTypeOf<A2TestDef>().toMatchTypeOf<TestDef>()
    expectTypeOf(A2_FINAL_TESTS).toEqualTypeOf<A2FinalTest[]>()
    // and the catalog selectors accept/return the same item types for both levels
    expectTypeOf(vocabularyOf('A2')).toEqualTypeOf(vocabularyOf('A1'))
    expectTypeOf(exercisesOf('A2')).toEqualTypeOf(exercisesOf('A1'))
    expect(true).toBe(true)
  })
})

describe('course registry', () => {
  it('A1 is released; A2 is in controlled Beta for ru and ky only', () => {
    expect(courseLevel('A1')?.status).toBe('released')
    expect(courseLevel('A2')?.status).toBe('beta')
    expect(isLevelVisible('A1')).toBe(true)
    expect(isLevelVisible('A2')).toBe(true)
    expect(courseLevel('A2')?.releasedLocales).toEqual(['ru', 'ky'])
    expect(isLevelReleasedFor('A2', 'ru')).toBe(true)
    expect(isLevelReleasedFor('A2', 'ky')).toBe(true)
    expect(isLevelReleasedFor('A1', 'ru')).toBe(true)
    expect(isLevelVisible('B1')).toBe(false)
  })

  it('unit id ranges: A1 = 1–10 (matches UNITS exactly), A2 = 11–20, contiguous and non-overlapping', () => {
    expect(courseLevel('A1')?.unitIdRange).toEqual([1, 10])
    expect(courseLevel('A2')?.unitIdRange).toEqual([11, 20])
    const [a1lo, a1hi] = courseLevel('A1')!.unitIdRange
    expect(UNITS.map(u => u.id)).toEqual(Array.from({ length: a1hi - a1lo + 1 }, (_, i) => a1lo + i))
    expect(UNITS.every(u => u.level === 'A1')).toBe(true)
    for (let i = 1; i < COURSE.levels.length; i++) expect(COURSE.levels[i].unitIdRange[0]).toBe(COURSE.levels[i - 1].unitIdRange[1] + 1)
    expect(levelOfUnitId(10)).toBe('A1')
    expect(levelOfUnitId(11)).toBe('A2')
    expect(levelOfUnitId(20)).toBe('A2')
    expect(levelOfUnitId(21)).toBeUndefined()
  })

  it('the course id equals the storage course id', () => {
    expect(COURSE.id).toBe(COURSE_ID)
  })

  it('every level in the registry is a content level of the catalog', () => {
    expect(catalog.CONTENT_LEVELS).toEqual(COURSE.levels.map(l => l.id))
  })
})

describe('layering and scope', () => {
  const read = (rel: string) => readFileSync(join(root, rel), 'utf8')

  it('no circular dependencies and no new layering violations (data stays rank 0)', () => {
    const r = analyze(join(root, 'src'))
    expect(r.cycles).toEqual([])
    const norm = (p: string) => p.split(sep).join('/')
    const dataViolations = r.violations.filter(
      (v: { from: string; to: string }) => norm(v.from).startsWith('data/') || norm(v.to).startsWith('data/'),
    )
    expect(dataViolations).toEqual([])
  })

  it('the new data modules import only from src/data', () => {
    const files = [
      'src/data/course.ts',
      'src/data/catalog.ts',
      ...readdirSync(join(root, 'src/data/a2'), { recursive: true, withFileTypes: false })
        .map(f => `src/data/a2/${String(f).replace(/\\/g, '/')}`)
        .filter(f => f.endsWith('.ts')),
    ]
    for (const f of files) {
      for (const m of read(f).matchAll(/from '(\.[^']*)'/g)) {
        // relative imports only, and never out of src/data
        const target = join(root, f, '..', m[1])
        expect(relative(join(root, 'src/data'), target).startsWith('..'), `${f} imports ${m[1]}`).toBe(false)
      }
      expect(read(f), f).not.toMatch(/from '(?!\.)/) // no package or absolute imports
    }
  })
})
