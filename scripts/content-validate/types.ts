// Shared types of the content validator (Stage 6A). Pure data: no I/O, no randomness, no network.
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
}

export interface Options {
  mode?: Mode
}
