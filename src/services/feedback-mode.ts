import type { LanguageLevel } from '../data/types'

/**
 * Levels whose speaking and writing practice shows a TRANSPARENT CHECKLIST and a learner SELF-ASSESSMENT instead of the automated numeric scores.
 * Why: the rule-based analysers (`analysis.ts`) return scores with high floors and detect only A1-era error patterns, so a number would suggest a
 * measurement that does not exist; B1 and above never present such a number as a result, and no level (CEFR or otherwise) is ever attached to it.
 * A1 and A2 keep their existing feedback unchanged.
 */
export const usesChecklistFeedback = (level: LanguageLevel | undefined): boolean => level === 'B1' || level === 'B2' || level === 'C1'
