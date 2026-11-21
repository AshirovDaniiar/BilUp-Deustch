import type { L10nStrict } from '../a2/types'

/**
 * B1 UNIT METADATA: the curriculum facts about a unit that are not learning content — learning objectives, the productive / receptive
 * classification of its grammar, strands, micro-tasks and revision sets. It is the authoring home of the data the B1 content validator
 * checks (scripts/content-validate/rules/b1.ts). Nothing in the application reads it, so it never ships (it is not imported by any
 * module the bundler reaches).
 *
 * Authored so far: Unit 21 (`unit21/meta.ts`). An entry is AUTHORED unit metadata: German "Ich kann …" objectives with independent Russian and Kyrgyz
 * texts (AI-assisted first drafts, not reviewed), the scenario id and the strand items. What is approved by the owner (unit identities, the 29 concept
 * ids and their proficiency / load / role / list caps, per-unit requirements) lives in src/data/b1/registry.ts and in
 * scripts/content-validate/b1/curriculum.ts. An entry is added together with each authored unit.
 */

/** German "Ich kann …" sentence plus the independent Russian and Kyrgyz texts (all three required for objectives and strand items). */
export interface B1Text extends L10nStrict {
  de: string
}

/**
 * How a grammar item is required of the learner.
 *   P     productive — required in tasks and tests
 *   P-lim productive on a CLOSED list (the list is declared in `closedList`)
 *   R     receptive only — understood in texts, never required in production items
 */
export type Proficiency = 'P' | 'P-lim' | 'R'
/** H = paradigm-heavy new system, M = medium, L = light. A unit may not combine two H concepts. */
export type GrammarLoad = 'H' | 'M' | 'L'
/** `new` teaches the concept; `revision` systematises structures taught before (Unit 32). */
export type ConceptRole = 'new' | 'revision'

/** A construction inside a concept (or a receptive-only construction without a concept), identified by the surface forms that would reveal it. */
export interface B1Construction {
  /** human-readable name shown in messages, e.g. "Passiv Perfekt" */
  label: string
  proficiency: Proficiency
  /** surface forms (lower-case words/phrases) that identify the construction in a task, e.g. ['worden'] */
  forms: string[]
  /** a receptive construction may become productive later: it is receptive for items of units up to and including this unit (default: the whole level) */
  receptiveThrough?: number
}

export interface B1ConceptMeta {
  /** the id of a grammar concept of this unit */
  conceptId: string
  proficiency: Proficiency
  load: GrammarLoad
  role: ConceptRole
  /** required when `proficiency` is `P-lim`: the closed list (verbs, patterns, expressions) the learner is held to */
  closedList?: string[]
  /** further constructions taught or deliberately only recognised inside this concept */
  constructions?: B1Construction[]
}

export type MicroTaskKind = 'meinung' | 'mediation' | 'note'
export interface B1MicroTask {
  kind: MicroTaskKind
  /** id of a writing task of this unit that carries the micro-task */
  taskId: string
}

export interface B1TopicEvidence {
  /** a curriculum topic key, e.g. 'money-banking' */
  topic: string
  /** ids of items of THIS unit (vocabulary, reading, listening, exercise, writing, speaking, final-test question) that carry the topic */
  itemIds: string[]
}

export interface B1RevisionSet {
  /** vocabulary ids (any level) from the previous unit, N−1 */
  fromPrevious: string[]
  /** vocabulary ids from three units back, N−3 */
  fromThirdBack: string[]
  /** vocabulary ids from A2 (required for Units 21–24) */
  fromA2: string[]
  /** a dedicated review block of vocabulary ids from the preceding three units (Units 24, 28, 32) */
  block?: string[]
}

export interface B1UnitMeta {
  /** the numeric unit id (21–32) */
  unit: number
  /** 2–3 can-do goals */
  canDo: B1Text[]
  /** learning objective per skill */
  objectives: { lesen: B1Text; hoeren: B1Text; sprechen: B1Text; schreiben: B1Text }
  /** how this unit differs from its A2 counterpart (required where a domain recurs) */
  differenceFromA2?: B1Text
  concepts: B1ConceptMeta[]
  /** receptive-only constructions that have no concept (e.g. Konjunktiv II der Vergangenheit) */
  receptiveOnly?: B1Construction[]
  /** the scripted scenario of the unit and its unexpected element */
  scenario: { id: string; unexpectedElement: B1Text }
  strands: {
    /** communication-repair chunks (≥ 3) */
    repairChunks: B1Text[]
    /** a reading or listening strategy note */
    strategyNote?: B1Text
    /** vocabulary-strategy note (required from Unit 25) */
    wortbildungNote?: B1Text
    /** comparison phrases (required in Units 22 and 29) */
    comparisonPhrases?: string[]
  }
  microTasks?: B1MicroTask[]
  /** required curriculum topics, each evidenced by item ids */
  topics?: B1TopicEvidence[]
  /** grammar concepts of earlier units that Unit 21 recapitulates (the A2 → B1 bridge) */
  recapConcepts?: string[]
  revision?: B1RevisionSet
  /** documented exceptions: a B1 word that deliberately repeats an earlier-level lemma in a NEW sense (the note must say which) */
  vocabularyAllowances?: { id: string; earlierId: string; note: string }[]
}
