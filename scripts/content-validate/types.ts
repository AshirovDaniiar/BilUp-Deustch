// Shared types of the content validator (Stage 6A). Pure data: no I/O, no randomness, no network.
import type { B1UnitMeta } from '../../src/data/b1/meta'
import type { B1LevelAssessment } from '../../src/data/b1/types'
import type { B1Decision } from './b1/decisions'
import type { B1Curriculum } from './b1/types'
import type { A2FinalTest } from '../../src/data/a2/tests'
import type { A2PlacementItem, LearnerInstruction, PlannedUnit, TutorTemplate } from '../../src/data/a2/types'
import type {
  WhyNote,
  Exercise,
  GrammarConcept,
  LanguageLevel,
  LearningUnit,
  ListeningExercise,
  ReadingText,
  RealLifeTopic,
  SpeakingScenario,
  TestDef,
  VocabularyItem,
  WritingTask,
} from '../../src/data/types'

/**
 * error   — the content is invalid; the validator exits non-zero.
 * warning — suspicious, should be looked at; does not fail the run.
 * review  — an automated check CANNOT decide (e.g. CEFR level); a human must sign it off. Never reported as "passed".
 * info    — facts and measurements (legacy A1 coverage, skipped checks).
 */
export type Severity = 'error' | 'warning' | 'review' | 'info'

export interface Issue {
  severity: Severity
  rule: string
  where: string
  message: string
}

/**
 * authoring — a level that is still being written: gaps are reported as information / review flags.
 * release   — validate as if the level were being released: every gap and every missing sign-off is an error.
 * (A level whose course status is beta or released is always validated as a release, whatever the mode.)
 */
export type Mode = 'authoring' | 'release'

/** Human sign-off of one unit. Only a person can record it; the validator never invents one. */
export interface ReviewRecord {
  /** the CEFR level (vocabulary, grammar, text difficulty) was reviewed by a qualified reviewer */
  cefr?: boolean
  /** the Russian text was reviewed */
  ru?: boolean
  /** the Kyrgyz text was reviewed by a Kyrgyz reviewer */
  ky?: boolean
  reviewer?: string
  date?: string
}

export interface CourseLevelInfo {
  id: LanguageLevel
  status: 'planned' | 'beta' | 'released'
  unitIdRange: readonly [number, number]
  extraUnitIdRanges?: readonly (readonly [number, number])[]
  releasedLocales: readonly string[]
}

export interface ContentBundle {
  units: LearningUnit[]
  vocabulary: VocabularyItem[]
  grammar: GrammarConcept[]
  exercises: Exercise[]
  listening: ListeningExercise[]
  reading: ReadingText[]
  writing: WritingTask[]
  speaking: SpeakingScenario[]
  realLife: RealLifeTopic[]
  tests: TestDef[]
  /** authored final tests (A2); one entry per unit */
  finalTests?: A2FinalTest[]
  /**
   * The course levels. Without it the bundle is treated as legacy (A1): none of the strict rules apply — which is how the
   * original skeleton behaved and why A1 content is unaffected.
   */
  course?: readonly CourseLevelInfo[]
  /** scenario id per unit, per level; index 0 = first unit of the level (positional by design of the A1 data — validated here) */
  unitSpeaking?: Partial<Record<LanguageLevel, readonly string[]>>
  /** the level whose module contains each speaking scenario */
  speakingLevels?: Record<string, LanguageLevel>
  /** human sign-offs per unit */
  reviews?: Record<number, ReviewRecord>
  /** the approved unit plan (stable identity of the units a level must contain) */
  plan?: readonly PlannedUnit[]
  /** the "why?" notes of grammar concepts */
  whyNotes?: WhyNote[]
  /** authored placement-test items (A2) */
  placementItems?: A2PlacementItem[]
  /** localised AI-Tutor response templates (A2) */
  tutorTemplates?: TutorTemplate[]
  /** language-specific learner instructions (A2) */
  instructions?: LearnerInstruction[]
  /** ids (vocabulary) whose Kyrgyz is intentionally identical to the Russian (loanwords, proper nouns, numbers) */
  sameAsRu?: readonly string[]
  /** B1 unit metadata (objectives, productive/receptive classification, strands, revision sets): the data rules/b1.ts checks */
  b1Meta?: readonly B1UnitMeta[]
  /** the B1 curriculum configuration (provisional until the owner's approval is recorded) */
  b1Curriculum?: B1Curriculum
  /** the register of every open B1 curriculum decision (D-1…D-14 and the X-n items found while authoring) */
  b1Decisions?: readonly B1Decision[]
  /** the authored indicative B1 level assessment (items, parts, thresholds, notes), checked structurally */
  b1LevelTest?: B1LevelAssessment
  /** ids of curriculum-v2 container units (A1 102–138, A2 201–243, B1 301–336): they exist for reference checks but are not audited as authored units */
  containerUnitIds?: readonly number[]
}

export interface Options {
  mode?: Mode
}
