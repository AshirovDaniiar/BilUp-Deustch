import type { B1LevelAssessment, B1LevelPart } from '../../data/b1/types'

export type LevelBand = 'reached' | 'almost' | 'repeat'
export interface LevelPartResult {
  key: B1LevelPart
  correct: number
  total: number
  pct: number
  /** the part reaches the per-part threshold */
  ok: boolean
}
export interface LevelOutcome {
  correct: number
  total: number
  pct: number
  parts: LevelPartResult[]
  band: LevelBand
}

const pctOf = (c: number, n: number) => (n === 0 ? 0 : Math.round((c / n) * 100))

/**
 * The indicative result of the B1 level assessment from the per-part tallies (`QuizResult.bySection`, keyed by part).
 * Provisional, UNCALIBRATED rule (curriculum v2 §7.6): reached = ≥ `overallPct` overall AND ≥ `partPct` in EVERY part that carries items;
 * almost reached = ≥ `almostPct` overall (the per-part threshold is 50 % since form v2 — see level-test.ts); otherwise repetition is recommended. Bands, never an exact score claim, never a CEFR level.
 */
export function evaluateLevel(a: B1LevelAssessment, bySection: Record<string, [number, number]>): LevelOutcome {
  const parts = a.parts.map(p => {
    const [correct, total] = bySection[p.key] ?? [0, 0]
    const pct = pctOf(correct, total)
    return { key: p.key, correct, total, pct, ok: total === 0 || pct >= a.thresholds.partPct }
  })
  const correct = parts.reduce((s, p) => s + p.correct, 0)
  const total = parts.reduce((s, p) => s + p.total, 0)
  const pct = pctOf(correct, total)
  const band: LevelBand =
    pct >= a.thresholds.overallPct && parts.every(p => p.ok) ? 'reached' : pct >= a.thresholds.almostPct ? 'almost' : 'repeat'
  return { correct, total, pct, parts, band }
}

/** The stored outcome code of a result (≤ 40 characters, as the storage validator requires). */
export const levelOutcomeCode = (band: LevelBand): string => `b1-${band}`
/** The version of the assessment form stored with a result (≤ 40 characters). */
export const LEVEL_BLUEPRINT = 'b1-level-v2'
