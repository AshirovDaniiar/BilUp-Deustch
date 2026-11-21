import type { A2TestDef, A2TestQuestion, L10nStrict } from '../a2/types'

/**
 * Definition of a B1 test. Identity and shape are EXPLICIT metadata, never derived from an id pattern or an array position: `kind: 'topic'` + `unit`
 * says which unit's final test it is, `size` how many questions it asks, `level` which level owns it. Same shape as the A2 definition (type-only
 * import: no runtime dependency on another level).
 */
export interface B1TestDef extends Omit<A2TestDef, 'level'> {
  level: 'B1'
}

/**
 * THE FINAL B1 LEVEL ASSESSMENT (`level-b1`, curriculum v2 §7.6) — an INDICATIVE progress check of the B1 course content, never a certificate and never a prediction of
 * an external exam. Authored data: 40 scored multiple-choice / word-order items in parts, thresholds, the three result bands and the fixed statement, all with independent
 * Russian and Kyrgyz texts. Part D (listening) has no items until the text-to-speech playback is verified on real devices (the curriculum then moves 3 items to part A and 3 to part C).
 */
export type B1LevelPart = 'A' | 'B' | 'C' | 'D' | 'E'
export interface B1LevelQuestion extends Omit<A2TestQuestion, 'options'> {
  part: B1LevelPart
  /** three options; an EMPTY list for a word-order item, which carries `words` (the scrambled tokens) and the full correct sentence as `answer` */
  options: string[]
  words?: string[]
  /** the B1 unit (21–32) whose content the item assesses */
  unit: number
}
export interface B1LevelAssessment {
  /** the parts that carry items, in order */
  parts: { key: B1LevelPart; title: L10nStrict; scope: L10nStrict }[]
  questions: B1LevelQuestion[]
  /** provisional, UNCALIBRATED rule: `overallPct` overall and `partPct` in every part = reached; `almostPct` overall = almost reached */
  thresholds: { overallPct: number; partPct: number; almostPct: number }
  bands: Record<'reached' | 'almost' | 'repeat', L10nStrict>
  /** the fixed statement shown with every result */
  statement: L10nStrict
  /** shown whenever the assessment has no listening items: the reason is TECHNICAL (speech output unverified on real devices), not an educational judgement */
  listeningNote: L10nStrict
  /** the notice about the unscored companion tasks (one writing task, one speaking task, self-assessed) */
  companion: L10nStrict
}
