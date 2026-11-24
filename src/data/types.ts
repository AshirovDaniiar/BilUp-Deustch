/** Structured content + user models. Content lives in src/data and never inside components. */

export type Lang = 'ru' | 'ky' | 'de'
export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
export const LEVELS: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']

/**
 * Where an authored piece of educational material comes from. Optional in the types (A1 predates it); the content validator
 * requires it for A2 reading texts, listening dialogues, grammar explanations, speaking scenarios and writing tasks.
 * `authored` = written for BilUp Til; `adapted` / `external` must name their origin. References are never invented to satisfy a check.
 */
export interface ContentSource {
  kind: 'authored' | 'adapted' | 'external'
  /** who wrote it (kind `authored`) */
  author?: string
  /** bibliographic citation of the origin (required for `adapted` / `external`) */
  citation?: string
  /** http(s) link to the origin, if any */
  url?: string
  /** licence or permission under which the material is used (required for `adapted` / `external`) */
  license?: string
}

/** Text in the interface languages. Kyrgyz / German fall back to Russian when missing. */
export interface L10n {
  ru: string
  ky?: string
  de?: string
}

export type Article = 'der' | 'die' | 'das'
export type PartOfSpeech = 'noun' | 'verb' | 'adj' | 'phrase' | 'other'

export interface LearningUnit {
  id: number
  /**
   * Stable identifier that never changes even if the unit is renumbered or retitled (A2 units must have one; A1 predates it).
   * The numeric `id` stays the key of progress, routes and storage.
   */
  key?: string
  /** Display position within the level when it differs from `id` (A1 curriculum v2); absent means `id`. */
  number?: number
  level: LanguageLevel
  title: string
  subtitle: L10n
  icon: string
  grammarIds: string[]
  /** curriculum v2: a referenced lesson that covers its topic only in part — concept id → the forms it actually covers (shown to the learner) */
  grammarPartial?: Record<string, string>
  /** curriculum v2 (B1): the approved GRAMMAR TOPIC of the unit — planning metadata only, never a lesson; no lesson exists until content is mapped or authored */
  grammarTopic?: string
}

export interface VocabularyItem {
  id: string
  unit: number
  pos: PartOfSpeech
  article?: Article
  de: string
  plural?: string
  ru: string
  ky: string
  example: string
  exampleRu: string
  /** Kyrgyz translation of the example (required for A2; A1 has none) */
  exampleKy?: string
  related: string[]
}

export type GrammarCategory =
  | 'articles' | 'cases' | 'verbs' | 'tenses' | 'wordorder' | 'prepositions'
  | 'adjectives' | 'pronouns' | 'conjunctions' | 'passive' | 'konjunktiv' | 'relative'

export type GrammarVisual = 'cases' | 'verbpos' | 'conjugation' | 'separable' | 'timeline' | 'prepositions' | 'articles' | 'negation' | 'plural' | 'modal' | 'none'

export interface GrammarExample { de: string; ru: string; ky?: string; focus?: string }
export interface GrammarMistake { wrong: string; right: string; note: L10n }

export interface GrammarConcept {
  id: string
  category: GrammarCategory
  level: LanguageLevel
  unit: number
  title: L10n
  summary: L10n
  discover: L10n // the hook question
  why: L10n
  when: L10n[]
  examples: GrammarExample[]
  mistakes: GrammarMistake[]
  reallife: GrammarExample[]
  visual: GrammarVisual
  dialogue: { speaker: string; text: string; ru: string; ky?: string }[]
  speakPrompt: { prompt: L10n; sample: string; keywords: string[] }
  source?: ContentSource
}

/** Explains one word in one sentence – powers the "WHY?" button. */
export interface WhyNote { sentence: string; ru: string; ky?: string; word: string; reason: L10n; conceptId: string; more: GrammarExample[] }

export type ExerciseType = 'choice' | 'fill' | 'order' | 'article'
export interface Exercise {
  id: string
  type: ExerciseType
  unit: number
  concept?: string // GrammarConcept.id
  prompt: string // shown text; for fill: contains ___
  promptRu?: string
  promptKy?: string
  options?: string[]
  answer: string // for order: the full correct sentence
  words?: string[] // order: scrambled tokens
  why: L10n
}

export interface ListeningExercise {
  id: string
  level: LanguageLevel
  unit: number
  title: string
  lines: { speaker: string; text: string; ru: string; ky?: string }[]
  questions: { q: string; options: string[]; answer: number }[]
  keywords: string[]
  source?: ContentSource
}

export interface SpeakingTurn { ai: string; aiRu: string; aiKy?: string; hints: string[]; keywords: string[] }
export interface SpeakingScenario {
  id: string
  title: string
  titleRu: string
  titleKy?: string
  icon: string
  level: LanguageLevel
  goal: L10n
  turns: SpeakingTurn[]
  source?: ContentSource
}

export interface ReadingGloss { word: string; ru: string; ky: string; example: string; grammar: string; grammarKy?: string; related: string[] }
export interface ReadingText {
  id: string
  level: LanguageLevel
  unit: number
  title: string
  body: string[]
  wordCount?: number
  gloss: ReadingGloss[]
  questions: { q: string; options: string[]; answer: number }[]
  source?: ContentSource
}

export interface MerksatzSentence {
  de: string
  ru: string
}

export interface MerksatzUnit {
  level: LanguageLevel
  unit: number
  title: string
  topic: string | null
  sentences: MerksatzSentence[]
  source?: ContentSource
}

export interface WritingTask {
  id: string
  level: LanguageLevel
  unit: number
  title: string
  situation: L10n
  formal: boolean
  minWords: number
  mustInclude: { label: string; patterns: string[]; /** what the item asks for, in the learner's language (B1 and above: required; shown next to the German label) */ explain?: L10n }[]
  model: string
  tips: L10n[]
  source?: ContentSource
}

export interface RealLifeTopic {
  id: string
  icon: string
  title: string
  titleRu: string
  vocab: { de: string; ru: string }[]
  phrases: { de: string; ru: string }[]
  dialogue: { speaker: string; text: string; ru: string }[]
  challenge: { q: string; options: string[]; answer: number; why: L10n }
  speakingScenarioId?: string
}

/**
 * One stored test result. The first five fields are the original record; the rest are OPTIONAL (absent on every pre-existing record): `kind` says what
 * the test was, so that placement and level results can be protected from eviction by ordinary tests; `parts` = [correct, total] per part of a level
 * test; `outcome` = the placement / level outcome code; `blueprint` = the version of the test form. No field here awards XP or completes a unit.
 */
export interface TestResult {
  id: string
  at: number
  pct: number
  weak: string[]
  strong: string[]
  kind?: TestDef['kind']
  parts?: Record<string, [number, number]>
  outcome?: string
  blueprint?: string
}

export interface TestDef {
  id: string
  title: L10n
  kind: 'placement' | 'level' | 'topic' | 'grammar' | 'vocabulary' | 'listening' | 'speaking'
  level: LanguageLevel
  unit?: number
  size: number
}

export interface TestQuestion {
  id: string
  prompt: string
  promptRu?: string
  promptKy?: string
  options: string[]
  answer: string
  skill: 'grammar' | 'vocabulary' | 'listening' | 'reading'
  concept?: string
  why?: L10n
  audio?: string
}

// ---------- user state ----------
export type MasteryStage = 'new' | 'learning' | 'familiar' | 'strong' | 'mastered'

export interface MasteryScore { box: number; due: number; seen: number; wrong: number }

export interface Mistake { at: number; kind: 'article' | 'vocabulary' | 'grammar' | 'listening' | 'writing'; ref: string; concept?: string }

export type SkillName = 'vocabulary' | 'grammar' | 'listening' | 'reading' | 'writing' | 'speaking'

export interface DailyResult { date: string; vocab: [number, number]; grammar: [number, number]; listening: [number, number]; speaking: boolean }

export interface AIMessage {
  id: string
  role: 'user' | 'ai'
  text: string
  /** time the message was created (ms). Optional: older messages have none and get a deterministic position-based value when read. */
  at?: number
}
export interface AIConversation { messages: AIMessage[] }

export interface UserProgress {
  name: string
  lang: Lang
  theme: 'auto' | 'light' | 'dark'
  level: LanguageLevel
  xp: number
  activeDates: string[]
  studySeconds: number
  completed: string[] // "unit:section" or "topic:id" or "ex:id"
  mastery: Record<string, MasteryScore>
  saved: string[]
  mistakes: Mistake[]
  scores: Record<SkillName, number[]> // percent history, newest last
  daily: Record<string, DailyResult>
  tests: TestResult[]
  weeklyGoal: number
  tutor: AIConversation
}
