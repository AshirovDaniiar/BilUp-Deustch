// Human sign-offs of A2 units. Only a person can add an entry; the validator never invents one.
// A level cannot become visible (beta/released) while a unit lacks the sign-off for a language it is released for.
// Currently empty: there is no A2 content.
import type { ReviewRecord } from './types'

export const A2_REVIEWS: Record<number, ReviewRecord> = {}

/** Vocabulary whose Kyrgyz is intentionally identical to the Russian (loanwords, proper names, numbers). Each id needs a reason in review. */
export const SAME_AS_RU: readonly string[] = []
