import type { LanguageLevel, TestDef, TestQuestion } from '../types'

/**
 * Strict localised text for A2: Russian AND Kyrgyz are both required by the type, so an A2 field cannot even be written without
 * both. (Shared `L10n` keeps `ky` optional for A1, which predates the policy.) The content validator enforces the same rule on the
 * data itself — non-empty, and Kyrgyz never merely a copy of Russian — for every A2 field, including those typed with the shared types.
 */
export interface L10nStrict {
  ru: string
  ky: string
  de?: string
}

/**
 * Definition of an A2 test. Identity and shape are EXPLICIT metadata, never derived from an id pattern or an array position:
 * `kind: 'topic'` + `unit` says which unit's final test it is, `size` how many questions it asks (the unit page shows this number),
 * `level` which level owns it.
 */
export interface A2TestDef extends Omit<TestDef, 'title' | 'level'> {
  title: L10nStrict
  level: 'A2'
}

/** One authored A2 final-test question: both explanation languages are required. */
export interface A2TestQuestion extends Omit<TestQuestion, 'promptRu' | 'promptKy' | 'why'> {
  promptRu: string
  promptKy: string
  why: L10nStrict
}

/**
 * One unit of the approved A2 plan. This is CURRICULUM METADATA, not learning content: the stable identity (numeric id 11–20 and a
 * permanent `key`) and the approved German title. It deliberately carries NO Russian or Kyrgyz text — those are authored, reviewed
 * content that belongs to the unit once it is written (`A2_UNITS`), never invented here. Nothing in the application reads the plan.
 */
export interface PlannedUnit {
  id: number
  key: string
  /** the level that owns the unit (the plan type is shared by every strict level: A2, B1, …) */
  level: LanguageLevel
  /** the approved German title; a defined unit's `title` must equal it */
  titleDe: string
}

/**
 * An authored placement-test item for A2 (the A2 part of the placement-test extension). Separate from the unit final tests and the
 * revision exercises. `band` is the difficulty band within A2 (placement needs calibrated items: low / mid / high).
 */
export interface A2PlacementItem extends A2TestQuestion {
  band: 'low' | 'mid' | 'high'
}

export type TutorTemplateKind = 'explain' | 'example' | 'quiz-prompt' | 'quiz-correct' | 'quiz-wrong' | 'encourage' | 'clarify'

/**
 * A localised AI-Tutor response template. Russian and Kyrgyz are both REQUIRED and independent: the tutor never answers in one
 * language by falling back to the other. Placeholders are written `{name}`; both languages must use exactly the declared set.
 * (Schema only — the tutor itself is migrated in its own stage.)
 */
export interface TutorTemplate {
  id: string
  kind: TutorTemplateKind
  /** unit the template belongs to; omit for a template shared by the whole level */
  unit?: number
  text: L10nStrict
  /** the placeholders the text may use, e.g. ['concept', 'example'] */
  placeholders?: string[]
}

export type InstructionScope = 'unit' | 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'speaking' | 'writing' | 'review' | 'test'

/** A language-specific instruction shown to the learner (what to do in an activity). Russian and Kyrgyz are required and independent. */
export interface LearnerInstruction {
  id: string
  scope: InstructionScope
  unit?: number
  text: L10nStrict
}
