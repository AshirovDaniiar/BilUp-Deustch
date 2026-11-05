import type { ActivityKind, RewardPolicy } from './types'

export const POLICY_VERSION = 'p1-2'

const none: RewardPolicy = {
  policyVersion: POLICY_VERSION,
  xpBasis: 'none',
  xpPerUnit: 0,
  xpPerIncorrect: 0,
  firstCompletionBonus: 0,
  repeat: { creditAfterFirst: 'none' },
  assistedFactor: 1,
  passThreshold: null,
  completesSelf: false,
}

const quiz: RewardPolicy = { ...none, xpBasis: 'perCorrectFirstTime', xpPerUnit: 5, firstCompletionBonus: 10 }

/**
 * TEMPORARY in-code policy table keyed by activity kind (08 P1 scope (1), review X-4) until course manifests exist in P2/P3.
 * It reproduces the amounts the app awarded before P1 and adds the pass thresholds of 03 §12 ("0.7 for tests, 0 for lessons").
 *   - assessments (unit/topic/level tests) and unit reviews must reach 70 % to count as completed (V-05);
 *   - everything else stays participation-based, exactly as before;
 *   - repeats pay nothing (the architecture default `daily-cap` is a product decision [A] and is NOT enabled).
 */
export const POLICIES: Record<ActivityKind, RewardPolicy> = {
  quiz,
  review: { ...quiz, passThreshold: 0.7 },
  assessment: { ...quiz, passThreshold: 0.7 },
  reading: { ...quiz, completesSelf: true },
  listening: { ...quiz, completesSelf: true },
  lesson: { ...none, firstCompletionBonus: 20, completesSelf: true },
  'speaking-scenario': { ...none, firstCompletionBonus: 20, completesSelf: true },
  'speaking-prompt': { ...none, firstCompletionBonus: 8 },
  writing: { ...none, firstCompletionBonus: 15, completesSelf: true },
  'real-life': { ...none, firstCompletionBonus: 10, passThreshold: 1, completesSelf: true },
  daily: { ...none, firstCompletionBonus: 25 },
  'word-practice': { ...none, xpBasis: 'perCorrectFirstTime', xpPerUnit: 3, xpPerIncorrect: 1 },
  'vocabulary-study': none,
}

export const policyFor = (kind: ActivityKind, table: Record<ActivityKind, RewardPolicy> = POLICIES): RewardPolicy => table[kind]
