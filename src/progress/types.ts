/**
 * ActivityResult — the single contract through which every learning feature reports what happened (03 §4.1).
 * UI components build a result and hand it to `actions.record()`; they never touch XP or completion directly.
 */
import type { LanguageLevel } from '../data/types'

export type ActivityKind =
  | 'lesson'
  | 'quiz'
  | 'review'
  | 'assessment'
  | 'vocabulary-study'
  | 'word-practice'
  | 'reading'
  | 'listening'
  | 'speaking-scenario'
  | 'speaking-prompt'
  | 'writing'
  | 'real-life'
  | 'daily'

export const ACTIVITY_KINDS: readonly ActivityKind[] = [
  'lesson',
  'quiz',
  'review',
  'assessment',
  'vocabulary-study',
  'word-practice',
  'reading',
  'listening',
  'speaking-scenario',
  'speaking-prompt',
  'writing',
  'real-life',
  'daily',
]

export type Outcome = 'correct' | 'incorrect' | 'partial' | 'skipped'

export interface ItemOutcome {
  /** namespaced credit identity of the practised item, e.g. `q:<exerciseId>`, `word:<vocabId>` */
  itemRef: string
  outcome: Outcome
}

export interface ActivityResult {
  /** idempotency key; generated when the attempt starts */
  resultId: string
  courseId: string
  /** stable activity identity. Until course manifests exist (P2) it equals the legacy completion key, e.g. `topic:akkusativ`, `3:test` */
  activityId: string
  kind: ActivityKind
  levelId: LanguageLevel
  startedAt: number
  finishedAt: number
  /** measured ACTIVE time of the attempt (visible tab + recent interaction), in ms (05 §5) */
  activeMs: number
  /** hints or solutions were used; credit is scaled by `assistedFactor` */
  assisted: boolean
  items: ItemOutcome[]
  /** null for kinds that are not scored */
  score: { earned: number; possible: number } | null
  evidence: 'measured' | 'heuristic' | 'self-reported'
  /**
   * Completion keys satisfied when the attempt PASSES (in addition to `activityId`), e.g. the unit section `3:listening`.
   * Temporary stand-in for manifest-derived completion (P2).
   */
  completes: string[]
  diagnostics?: { analyzerVersion: string }
}

/** Reward policy (03 §4.2). `xpBasis: 'perResult'` and `repeat.creditAfterFirst: 'reduced'` are not supported in P1 (see P1 completion report). */
export interface RewardPolicy {
  policyVersion: string
  xpBasis: 'perCorrectFirstTime' | 'none'
  /** XP for each correct item the learner has never been credited for */
  xpPerUnit: number
  /** extension: XP for an incorrect/partial item, first time only (word practice) */
  xpPerIncorrect: number
  /** XP once, the first time the activity is PASSED */
  firstCompletionBonus: number
  repeat: { creditAfterFirst: 'none' | 'daily-cap'; reducedFactor?: number; dailyCapXp?: number }
  /** 0 ≤ f ≤ 1, applied to every XP amount of an assisted attempt */
  assistedFactor: number
  /** fraction 0..1 of the score needed to pass; null = participation-based */
  passThreshold: number | null
  /**
   * extension: whether `activityId` itself becomes a completion key. Quizzes, assessments and word practice only complete the keys named in
   * `completes`, so practice activities never pollute the completion list that selectors read.
   */
  completesSelf: boolean
}

export interface RecordOutcome {
  applied: boolean
  /** why nothing was applied */
  reason?: 'duplicate' | 'invalid'
  detail?: string
  xpAwarded: number
  passed: boolean
  completionsGained: string[]
}
