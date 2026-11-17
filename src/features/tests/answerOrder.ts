import { seeded, shuffle } from '../../utils/random'

/**
 * Answer-position randomisation for listening and reading questions (decision D-4 of the A2 plan).
 *
 * WHY: the authored questions put the correct option first or second almost every time (listening 17/17/1 for positions 1/2/3,
 * reading 14/4/0), so the answer could be guessed by position.
 *
 * HOW: the options of a question are permuted by a Fisher–Yates shuffle driven by a PRNG seeded with `(attemptSeed, questionId)`.
 *  - a PURE function of its inputs: no render-time randomness, nothing stored — re-rendering, remounting a question or building the
 *    list twice with the same attempt seed always gives the same order (stable within an attempt);
 *  - a NEW attempt uses a new attempt seed (the activity creates one when the attempt starts), so the order can differ;
 *  - each question has its own stream, so the order of one question never depends on how many questions there are or on any
 *    other random draw of the surrounding builder (A1 seeded tests/daily keep their exact picks);
 *  - the permutation is of the option TEXTS. Correctness is decided by text (`answer` is the correct option's text, the quiz
 *    runner compares text), results record the question id and the text — never a position — so scoring, completion, feedback,
 *    review and saved results are unaffected.
 */
export const attemptOptions = (options: readonly string[], attemptSeed: string, questionId: string): string[] =>
  shuffle(options, seeded(`options|${attemptSeed}|${questionId}`))
