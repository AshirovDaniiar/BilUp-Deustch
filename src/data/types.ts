/** Structured content + user models. Content lives in src/data and never inside components. */

export type Lang = 'ru' | 'ky' | 'de'
export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
export const LEVELS: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']

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
  level: LanguageLevel
  title: string
  subtitle: L10n
  icon: string
  grammarIds: string[]
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
  related: string[]
}

export type GrammarCategory =
  | 'articles' | 'cases' | 'verbs' | 'tenses' | 'wordorder' | 'prepositions'
  | 'adjectives' | 'pronouns' | 'conjunctions' | 'passive' | 'konjunktiv' | 'relative'

export type GrammarVisual = 'cases' | 'verbpos' | 'conjugation' | 'separable' | 'timeline' | 'prepositions' | 'articles' | 'negation' | 'plural' | 'modal' | 'none'

export interface GrammarExample { de: string; ru: string; focus?: string }
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
  dialogue: { speaker: string; text: string; ru: string }[]
  speakPrompt: { prompt: L10n; sample: string; keywords: string[] }
}

/** Explains one word in one sentence – powers the "WHY?" button. */
export interface WhyNote { sentence: string; ru: string; word: string; reason: L10n; conceptId: string; more: GrammarExample[] }

export type ExerciseType = 'choice' | 'fill' | 'order' | 'article'
export interface Exercise {
  id: string
  type: ExerciseType
  unit: number
  concept?: string // GrammarConcept.id
  prompt: string // shown text; for fill: contains ___
  promptRu?: string
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
  lines: { speaker: string; text: string; ru: string }[]
  questions: { q: string; options: string[]; answer: number }[]
  keywords: string[]
}

export interface SpeakingTurn { ai: string; aiRu: string; hints: string[]; keywords: string[] }
export interface SpeakingScenario {
  id: string
  title: string
  titleRu: string
  icon: string
  level: LanguageLevel
  goal: L10n
  turns: SpeakingTurn[]
}

export interface ReadingGloss { word: string; ru: string; ky: string; example: string; grammar: string; related: string[] }
export interface ReadingText {
  id: string
  level: LanguageLevel
  unit: number
  title: string
  body: string[]
  gloss: ReadingGloss[]
  questions: { q: string; options: string[]; answer: number }[]
}

export interface WritingTask {
  id: string
  level: LanguageLevel
  unit: number
  title: string
  situation: L10n
  formal: boolean
  minWords: number
  mustInclude: { label: string; patterns: string[] }[]
  model: string
  tips: L10n[]
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

export interface AIMessage { id: string; role: 'user' | 'ai'; text: string }
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
  tests: { id: string; at: number; pct: number; weak: string[]; strong: string[] }[]
  weeklyGoal: number
  tutor: AIConversation
}
