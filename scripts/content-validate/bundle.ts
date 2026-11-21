// The content shipped in src/data, as validator input.
//   currentBundle() — the A1 content only, with no course info: the legacy view the original skeleton validated (and still does).
//   fullBundle()    — every level (A1 + A2 modules) with the course registry, speaking levels, review sign-offs and the allow-list:
//                     what the CLI validates. A2 is empty today, so this validates the registry and A1.
import { COURSE } from '../../src/data/course'
import { EXERCISES } from '../../src/data/exercises'
import { GRAMMAR } from '../../src/data/grammar'
import { LISTENING } from '../../src/data/listening'
import { READING } from '../../src/data/reading'
import { REAL_LIFE, TESTS } from '../../src/data/reallife'
import { SPEAKING } from '../../src/data/speaking'
import { UNITS } from '../../src/data/units'
import { VOCABULARY } from '../../src/data/vocabulary'
import { WRITING } from '../../src/data/writing'
import {
  registerLevelContent,
  CONTENT_LEVELS,
  exercisesOf,
  finalTestsOf,
  grammarOf,
  instructionsOf,
  listeningOf,
  placementOf,
  plannedUnitsOf,
  readingOf,
  speakingOf,
  testsOf,
  tutorTemplatesOf,
  unitSpeakingOf,
  unitsOfLevel,
  vocabularyOf,
  whyNotesOf,
  writingOf,
} from '../../src/data/catalog'
import { A2_CONTENT } from '../../src/data/a2/a2-content'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_META } from '../../src/data/b1/meta'
import { B1_CURRICULUM } from './b1/curriculum'
import { B1_DECISIONS } from './b1/decisions'
import { A2_REVIEWS, SAME_AS_RU } from './reviews'
import type { ContentBundle } from './types'
import type { LanguageLevel } from '../../src/data/types'

// The validator checks ALL content, so it loads the lazy A2 content statically (build tooling; nothing here ships).
registerLevelContent('A2', A2_CONTENT)
registerLevelContent('B1', B1_CONTENT)

export const currentBundle = () => ({
  units: UNITS,
  vocabulary: VOCABULARY,
  grammar: GRAMMAR,
  exercises: EXERCISES,
  listening: LISTENING,
  reading: READING,
  writing: WRITING,
  speaking: SPEAKING,
  realLife: REAL_LIFE,
  tests: TESTS,
})

export function fullBundle(): ContentBundle {
  const levels: LanguageLevel[] = [...CONTENT_LEVELS]
  const speakingLevels: Record<string, LanguageLevel> = {}
  for (const l of levels) for (const s of speakingOf(l)) speakingLevels[s.id] = l
  return {
    units: levels.flatMap(l => [...unitsOfLevel(l)]),
    vocabulary: levels.flatMap(l => [...vocabularyOf(l)]),
    grammar: levels.flatMap(l => [...grammarOf(l)]),
    exercises: levels.flatMap(l => [...exercisesOf(l)]),
    listening: levels.flatMap(l => [...listeningOf(l)]),
    reading: levels.flatMap(l => [...readingOf(l)]),
    writing: levels.flatMap(l => [...writingOf(l)]),
    speaking: levels.flatMap(l => [...speakingOf(l)]),
    realLife: REAL_LIFE,
    tests: levels.flatMap(l => [...testsOf(l)]),
    finalTests: levels.flatMap(l => [...finalTestsOf(l)]),
    whyNotes: levels.flatMap(l => [...whyNotesOf(l)]),
    plan: levels.flatMap(l => [...plannedUnitsOf(l)]),
    placementItems: levels.flatMap(l => [...placementOf(l)]),
    tutorTemplates: levels.flatMap(l => [...tutorTemplatesOf(l)]),
    instructions: levels.flatMap(l => [...instructionsOf(l)]),
    course: COURSE.levels.map(l => ({ id: l.id, status: l.status, unitIdRange: l.unitIdRange, releasedLocales: l.releasedLocales })),
    unitSpeaking: Object.fromEntries(levels.map(l => [l, [...unitSpeakingOf(l)]])),
    speakingLevels,
    reviews: A2_REVIEWS,
    sameAsRu: SAME_AS_RU,
    b1Meta: B1_META,
    b1Curriculum: B1_CURRICULUM,
    b1Decisions: B1_DECISIONS,
    b1LevelTest: B1_CONTENT.levelTest,
  }
}
