/**
 * Level-scoped content catalog (A2 plan, Option B).
 *
 * The existing A1 exports (`UNITS`, `VOCABULARY`, `GRAMMAR`, … in the sibling modules) stay A1-only and untouched. A2 lives in
 * `./a2/*`. This module is the one place that knows both, and exposes per-level selectors:
 *
 *   vocabularyOf('A1')   === VOCABULARY            (the very same array — A1 behaviour cannot drift)
 *   vocabularyOf('A2')   === A2_VOCABULARY
 *   vocabularyOf('B1')   →  []                      (levels without content)
 *
 * Isolation is by construction: a level's content is the level's own module, never a filter over a shared pool, so an A2 item can
 * never leak into an A1 selector. The *level of an item is the level of its parent unit* (decision D-1); the legacy `level` tag on
 * some A1 items is only a difficulty label and is ignored here.
 *
 * LAZY A2 (Stage 7A.1): A2 content is NOT part of the entry bundle. The A2 slot starts EMPTY (exactly the state of a planned level
 * before any unit was authored) and is filled by `loadLevelContent('A2')`, a dynamic `import()` of `./a2/a2-content` that is allowed only
 * for a level that is visible (not `planned`), or — in development and tests only — with `{ preview: true }`. Selectors stay
 * synchronous; before the load they answer "empty", never A1 data. Loading mutates the SAME collections in place, so a reference
 * obtained earlier stays valid.
 *
 * Layering: `data` (rank 0) — imports only other `data` modules.
 */
import { A2_UNIT_PLAN } from './a2/registry'
import { B1_UNIT_PLAN } from './b1/registry'
import type { B1LevelAssessment } from './b1/types'
import type { A2FinalTest } from './a2/tests'
import type { A2PlacementItem, LearnerInstruction, PlannedUnit, TutorTemplate } from './a2/types'
import { COURSE, courseLevel, isLevelVisible, levelOfUnitId } from './course'
import { EXERCISES } from './exercises'
import { GRAMMAR, WHY_NOTES } from './grammar'
import { LISTENING } from './listening'
import { READING } from './reading'
import { TESTS } from './reallife'
import { SPEAKING } from './speaking'
import type {
  Exercise,
  GrammarConcept,
  LanguageLevel,
  LearningUnit,
  ListeningExercise,
  ReadingText,
  SpeakingScenario,
  TestDef,
  VocabularyItem,
  WhyNote,
  WritingTask,
} from './types'
import { UNITS, UNIT_SPEAKING } from './units'
import { VOCABULARY } from './vocabulary'
import { WRITING } from './writing'

export interface LevelContent {
  units: readonly LearningUnit[]
  vocabulary: readonly VocabularyItem[]
  grammar: readonly GrammarConcept[]
  whyNotes: readonly WhyNote[]
  /** the level's own exercise pool (handwritten + generated drills) */
  exercises: readonly Exercise[]
  listening: readonly ListeningExercise[]
  reading: readonly ReadingText[]
  speaking: readonly SpeakingScenario[]
  writing: readonly WritingTask[]
  tests: readonly TestDef[]
  /** speaking scenario id per unit; index 0 = first unit of the level */
  unitSpeaking: readonly string[]
  /** authored final tests (A2 only; A1 has none) */
  finalTests: readonly A2FinalTest[]
  /** authored placement-test items of the level (A1's placement is built from its exercises, so none) */
  placement: readonly A2PlacementItem[]
  /** localised AI-Tutor response templates of the level (A1's tutor predates templates) */
  tutorTemplates: readonly TutorTemplate[]
  /** language-specific learner instructions of the level */
  instructions: readonly LearnerInstruction[]
  /** the approved unit plan of the level: stable identity only, never content */
  plan: readonly PlannedUnit[]
  /** the authored indicative level assessment (`level-b1`, B1 only); absent for every other level */
  levelTest?: B1LevelAssessment
}

const EMPTY: LevelContent = Object.freeze({
  units: [],
  vocabulary: [],
  grammar: [],
  whyNotes: [],
  exercises: [],
  listening: [],
  reading: [],
  speaking: [],
  writing: [],
  tests: [],
  unitSpeaking: [],
  finalTests: [],
  placement: [],
  tutorTemplates: [],
  instructions: [],
  plan: [],
})

type Live<T> = { -readonly [K in keyof T]: T[K] }
/** An empty, MUTABLE level slot (the loader assigns the level's collections into it). */
const emptyLive = (plan: readonly PlannedUnit[]): Live<LevelContent> => ({
  units: [], vocabulary: [], grammar: [], whyNotes: [], exercises: [], listening: [], reading: [], speaking: [], writing: [], tests: [],
  unitSpeaking: [], finalTests: [], placement: [], tutorTemplates: [], instructions: [], plan,
})

/**
 * LAZY LEVELS (A2, B1, …): each has an EMPTY mutable slot (its plan only) and a loader that fetches the level's content module as a separate
 * chunk. Adding a lazy level = one slot, one loader (a literal `import()` so the bundler gives it its own `<level>-content-*.js` chunk) and one
 * course-registry entry; nothing else in this module names a level.
 */
type LazyLevel = 'A2' | 'B1'
/** What a lazy level's content module exports: the level's collections (the plan is separate and stays in the entry bundle). */
export type LevelPayload = Omit<Live<LevelContent>, 'plan'>
const LIVE: Record<LazyLevel, Live<LevelContent>> = { A2: emptyLive(A2_UNIT_PLAN), B1: emptyLive(B1_UNIT_PLAN) }
const LOADERS: Record<LazyLevel, () => Promise<LevelPayload>> = {
  A2: () => import('./a2/a2-content').then(m => m.A2_CONTENT),
  B1: () => import('./b1/b1-content').then(m => m.B1_CONTENT),
}
const isLazyLevel = (level: LanguageLevel): level is LazyLevel => Object.prototype.hasOwnProperty.call(LOADERS, level)

const CONTENT: Partial<Record<LanguageLevel, LevelContent>> = {
  A1: {
    units: UNITS,
    vocabulary: VOCABULARY,
    grammar: GRAMMAR,
    whyNotes: WHY_NOTES,
    exercises: EXERCISES,
    listening: LISTENING,
    reading: READING,
    speaking: SPEAKING,
    writing: WRITING,
    tests: TESTS,
    unitSpeaking: UNIT_SPEAKING,
    finalTests: [],
    placement: [],
    tutorTemplates: [],
    instructions: [],
    plan: [],
  },
  A2: LIVE.A2,
  B1: LIVE.B1,
}


/** Levels declared by the course registry (planned levels included: they simply return empty collections today). */
export const CONTENT_LEVELS: readonly LanguageLevel[] = COURSE.levels.map(l => l.id)

/** Content of a level; levels without a content module (B1, B2, C1) are empty. */
export const contentOf = (level: LanguageLevel): LevelContent => CONTENT[level] ?? EMPTY

// ───────────── per-level collections ─────────────
export const unitsOfLevel = (level: LanguageLevel) => contentOf(level).units
export const vocabularyOf = (level: LanguageLevel) => contentOf(level).vocabulary
export const grammarOf = (level: LanguageLevel) => contentOf(level).grammar
export const whyNotesOf = (level: LanguageLevel) => contentOf(level).whyNotes
export const exercisesOf = (level: LanguageLevel) => contentOf(level).exercises
export const listeningOf = (level: LanguageLevel) => contentOf(level).listening
export const readingOf = (level: LanguageLevel) => contentOf(level).reading
export const speakingOf = (level: LanguageLevel) => contentOf(level).speaking
export const writingOf = (level: LanguageLevel) => contentOf(level).writing
export const testsOf = (level: LanguageLevel) => contentOf(level).tests
export const unitSpeakingOf = (level: LanguageLevel) => contentOf(level).unitSpeaking
export const finalTestsOf = (level: LanguageLevel) => contentOf(level).finalTests
export const placementOf = (level: LanguageLevel) => contentOf(level).placement
export const tutorTemplatesOf = (level: LanguageLevel) => contentOf(level).tutorTemplates
export const instructionsOf = (level: LanguageLevel) => contentOf(level).instructions
/** The authored indicative level assessment of a level (B1 only); undefined when the level has none. */
export const levelAssessmentOf = (level: LanguageLevel): B1LevelAssessment | undefined => contentOf(level).levelTest
/** The approved unit plan of a level (identity only). Nothing in the application reads it; the validator does. */
export const plannedUnitsOf = (level: LanguageLevel) => contentOf(level).plan

// ───────────── unit → level ─────────────
/** Level that owns a unit id (by the course's unit id ranges); undefined for ids outside every range. */
export const levelOfUnit = (unit: number): LanguageLevel | undefined => levelOfUnitId(unit)

const unitContent = (unit: number): LevelContent => {
  const level = levelOfUnit(unit)
  return level ? contentOf(level) : EMPTY
}

// ───────────── per-unit collections (for A1 these equal the legacy `…ForUnit` helpers) ─────────────
export const vocabularyForUnit = (unit: number) => unitContent(unit).vocabulary.filter(v => v.unit === unit)
export const grammarForUnit = (unit: number) => unitContent(unit).grammar.filter(g => g.unit === unit)
export const exercisesForUnit = (unit: number) => unitContent(unit).exercises.filter(e => e.unit === unit)
export const listeningForUnit = (unit: number) => unitContent(unit).listening.filter(e => e.unit === unit)
export const readingForUnit = (unit: number) => unitContent(unit).reading.filter(t => t.unit === unit)
export const writingForUnit = (unit: number) => unitContent(unit).writing.filter(w => w.unit === unit)
export const finalTestOfUnit = (unit: number) => unitContent(unit).finalTests.find(t => t.unit === unit)

/** Speaking scenario id for a unit. Replaces `UNIT_SPEAKING[unit - 1]`, which cannot address A2 unit ids. */
export const speakingForUnit = (unit: number): string | undefined => {
  const level = levelOfUnit(unit)
  const range = level ? courseLevel(level)?.unitIdRange : undefined
  return level && range ? contentOf(level).unitSpeaking[unit - range[0]] : undefined
}

// ───────────── cross-level lookups (ids are globally unique across levels) ─────────────
type Pick<T> = (c: LevelContent) => readonly T[]
const buildIndex = <T extends { id: string }>(pick: Pick<T>): Map<string, T> =>
  new Map(CONTENT_LEVELS.flatMap(l => pick(contentOf(l))).map(x => [x.id, x]))

// The indexes and flat lists below are exported read-only, but a level that is loaded later adds its items IN PLACE (same objects).
export const allUnits: readonly LearningUnit[] = CONTENT_LEVELS.flatMap(l => contentOf(l).units)
export const unitById = (id: number): LearningUnit | undefined => allUnits.find(u => u.id === id)
const vocabularyMap = buildIndex(c => c.vocabulary)
const grammarMap = buildIndex(c => c.grammar)
const exerciseMap = buildIndex(c => c.exercises)
const listeningMap = buildIndex(c => c.listening)
const readingMap = buildIndex(c => c.reading)
const writingMap = buildIndex(c => c.writing)
const speakingMap = buildIndex(c => c.speaking)
const testMap = buildIndex(c => c.tests)
export const vocabularyIndex: ReadonlyMap<string, VocabularyItem> = vocabularyMap
export const grammarIndex: ReadonlyMap<string, GrammarConcept> = grammarMap
export const exerciseIndex: ReadonlyMap<string, Exercise> = exerciseMap
export const listeningIndex: ReadonlyMap<string, ListeningExercise> = listeningMap
export const readingIndex: ReadonlyMap<string, ReadingText> = readingMap
export const writingIndex: ReadonlyMap<string, WritingTask> = writingMap
export const speakingIndex: ReadonlyMap<string, SpeakingScenario> = speakingMap
export const testIndex: ReadonlyMap<string, TestDef> = testMap

/** Vocabulary of every level (A1 first, then A2): for word lookups that must work in any level, e.g. glossing a keyword or matching a noun. */
export const allVocabulary: readonly VocabularyItem[] = CONTENT_LEVELS.flatMap(l => contentOf(l).vocabulary)

// ───────────── lazy level content ─────────────
const loaded = new Set<LanguageLevel>(['A1'])
const loading = new Map<LanguageLevel, Promise<void>>()

/** True when the level's content is available to the selectors (A1 always; a lazy level after `loadLevelContent`/`registerLevelContent`). */
export const isLevelContentLoaded = (level: LanguageLevel): boolean => loaded.has(level) || !isLazyLevel(level)

/**
 * Make a lazy level's content available: assign its collections (by reference) into the level's slot and add its items to the
 * cross-level indexes and lists. Idempotent. Used by `loadLevelContent` and by build tooling / tests that import the content statically;
 * the application itself only calls `loadLevelContent`. Never exposes a level: visibility is the course registry's business.
 */
export function registerLevelContent(level: LanguageLevel, content: LevelPayload): void {
  if (!isLazyLevel(level) || loaded.has(level)) return
  Object.assign(LIVE[level], content)
  ;(allUnits as LearningUnit[]).push(...content.units)
  ;(allVocabulary as VocabularyItem[]).push(...content.vocabulary)
  for (const [map, items] of [
    [vocabularyMap, content.vocabulary],
    [grammarMap, content.grammar],
    [exerciseMap, content.exercises],
    [listeningMap, content.listening],
    [readingMap, content.reading],
    [writingMap, content.writing],
    [speakingMap, content.speaking],
    [testMap, content.tests],
  ] as [Map<string, { id: string }>, readonly { id: string }[]][])
    for (const x of items) map.set(x.id, x)
  loaded.add(level)
}

/**
 * Load a lazy level's content (a separate chunk). Allowed only when the level is visible per the course registry (status not `planned`);
 * `preview: true` is honoured ONLY in development and tests (`import.meta.env.DEV`; in a production build it is compiled to `false`),
 * so a planned level can never be loaded — hence never exposed — in a shipped app. Resolves immediately for levels that are always
 * loaded (A1) or already loaded; rejects for a level that must not be loaded.
 */
export function loadLevelContent(level: LanguageLevel, options: { preview?: boolean } = {}): Promise<void> {
  if (isLevelContentLoaded(level)) return Promise.resolve()
  const pending = loading.get(level)
  if (pending) return pending
  const allowed = isLevelVisible(level) || (options.preview === true && import.meta.env.DEV)
  if (!allowed) return Promise.reject(new Error(`level ${level} is not available: it is planned and has not been released`))
  const p = LOADERS[level as LazyLevel]().then(content => {
    registerLevelContent(level, content)
  })
  loading.set(level, p)
  p.catch(() => loading.delete(level)) // a failed chunk load may be retried
  return p
}

/** Unit a speaking scenario belongs to; 0 when it belongs to none (same contract as the legacy `unitOfScenario`). */
export const unitOfScenario = (id: string): number => {
  for (const level of COURSE.levels) {
    const i = contentOf(level.id).unitSpeaking.indexOf(id)
    if (i >= 0) return level.unitIdRange[0] + i
  }
  return 0
}

/** "Why?" notes of a grammar concept, taken from the level that owns the concept. */
export const whyNotesForConcept = (conceptId: string): readonly WhyNote[] => {
  const concept = grammarIndex.get(conceptId)
  const level = concept ? levelOfUnit(concept.unit) : undefined
  return level ? contentOf(level).whyNotes.filter(w => w.conceptId === conceptId) : []
}

// ───────────── level of an item (D-1): the level of its PARENT UNIT, never its legacy `level` tag ─────────────
// A2-tagged fragments that live in A1 units are therefore A1; a planned level's content is reachable only through that level.
const levelOfUnitOf = (unit: number | undefined): LanguageLevel | undefined => (unit === undefined ? undefined : levelOfUnit(unit))
export const levelOfListeningId = (id: string) => levelOfUnitOf(listeningIndex.get(id)?.unit)
export const levelOfReadingId = (id: string) => levelOfUnitOf(readingIndex.get(id)?.unit)
export const levelOfWritingId = (id: string) => levelOfUnitOf(writingIndex.get(id)?.unit)
export const levelOfConceptId = (id: string) => levelOfUnitOf(grammarIndex.get(id)?.unit)
/** Scenarios are not all tied to a unit (e.g. the A1 doctor scenario), so a scenario belongs to the level whose module contains it. */
export const levelOfScenarioId = (id: string): LanguageLevel | undefined => CONTENT_LEVELS.find(l => contentOf(l).speaking.some(s => s.id === id))

/**
 * The concepts before and after a concept in ITS OWN level's order (undefined at the ends of the level; an unknown concept has none).
 * Next/previous navigation uses this, so it can never lead from one level into another.
 */
export const neighbourConcepts = (conceptId: string): { previous: GrammarConcept | undefined; next: GrammarConcept | undefined } => {
  const level = levelOfConceptId(conceptId)
  const list = level ? grammarOf(level) : []
  const i = list.findIndex(g => g.id === conceptId)
  return i < 0 ? { previous: undefined, next: undefined } : { previous: list[i - 1], next: list[i + 1] }
}

/**
 * The final (topic) test of a unit, found by its METADATA (`kind: 'topic'` and `unit`), never by an id pattern such as `unit-<n>`.
 * Its `id` and `size` are whatever the definition says; screens link to that id and show that size.
 */
export const topicTestOfUnit = (unit: number): TestDef | undefined => {
  const level = levelOfUnit(unit)
  return level ? contentOf(level).tests.find(t => t.kind === 'topic' && t.unit === unit) : undefined
}
