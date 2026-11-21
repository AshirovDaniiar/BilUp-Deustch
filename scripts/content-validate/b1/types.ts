// Types of the B1 curriculum CONFIGURATION the validator checks authored content against (Stage 2C).
// The configuration is data about the CURRICULUM (how many concepts a unit has, what is productive, what each unit must contain), not
// learning content. It exists in two states: PROVISIONAL (curriculum v2 proposed, owner approval not recorded) and APPROVED.
import type { ConceptRole, GrammarLoad, Proficiency } from '../../../src/data/b1/meta'

export interface B1ConceptSpec {
  /**
   * The permanent concept id (owner-approved identity, docs/b1/B1_CURRICULUM_V2_APPROVAL.md §3). It never changes and is never reused; a
   * retired concept keeps its id. While `B1Curriculum.approved` is false the validator ignores ids (structural checks only).
   */
  id: string
  proficiency: Proficiency
  load: GrammarLoad
  role: ConceptRole
  /** upper bound for the declared closed list of a `P-lim` concept (the approximate size named in the curriculum) */
  listCap?: number
  /**
   * A decision the dossier marks ⚑: the classification is the product design's default and still awaits INDEPENDENT expert (CEFR) verification.
   * The owner's approval does not remove it. The validator reports a review flag for every authored concept that carries it.
   */
  expertReview?: { status: 'pending'; decision: string; note: string }
}

/** What a unit must contain beyond the common contract (curriculum v2 strands, §6). */
export interface B1UnitRequirements {
  /** a statement of how the unit differs from its A2 counterpart (domains that recur) */
  differenceFromA2: boolean
  /** vocabulary-strategy note (Wortbildung) */
  wortbildung: boolean
  /** an opinion-with-reason micro-task */
  meinungMicroTask: boolean
  /** a mediation (relaying information) micro-task */
  mediationMicroTask: boolean
  /** comparison phrases (≥ 3) used in the unit's texts */
  comparison: boolean
  /** number of earlier-unit grammar concepts recapitulated (the A2 → B1 bridge); 0 = none required */
  recapConcepts: number
  /** vocabulary revision from A2 required in the unit's review set */
  a2Revision: boolean
  /** a dedicated review block (Wiederholungsblock) */
  revisionBlock: boolean
  /** curriculum topic keys that must be evidenced by items of the unit */
  topics: readonly string[]
}

export interface B1UnitSpec {
  unit: number
  concepts: readonly B1ConceptSpec[]
  requires: B1UnitRequirements
}

export interface B1Curriculum {
  /**
   * false = PROVISIONAL (the owner has not recorded approval): permanent identities are not enforced, deviations from the proposed
   * allocation are reported for decision. true = APPROVED: the allocation, ids, proficiency and load are enforced.
   */
  approved: boolean
  units: readonly B1UnitSpec[]
}
