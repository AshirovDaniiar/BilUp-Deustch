/**
 * The validator's report for the real A2 bundle while A2 is in controlled BETA for ru + ky (owner-approved): no error, no warning; every human sign-off and the
 * level test are explicit non-blocking review flags. A full release (status released / --release) turns all of them into errors.
 */
export const BETA_FLAG_RULES = ['cefr-signoff-missing', 'beta-review-pending', 'beta-level-test-missing']

const units = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]

/**
 * Exact review flags produced by the approved A2 curriculum-v2 vocabulary (Units 201–243).
 * These are heuristic/localisation notices, not errors; listing their exact keys keeps the
 * "no other review flag" guard strict instead of allowing whole rule ids.
 */
export const A2_VOCABULARY_FLAGS: string[] = [
  'l10n-ky-equals-ru-short vocabulary:v222-5#ru/ky',
  'l10n-ky-equals-ru-short vocabulary:v222-8#ru/ky',
  'l10n-ky-equals-ru-short vocabulary:v222-15#ru/ky',
  'l10n-ky-equals-ru-short vocabulary:v226-8#ru/ky',
  'l10n-ky-equals-ru-short vocabulary:v226-12#ru/ky',
  'l10n-ky-equals-ru-short vocabulary:v226-25#ru/ky',
  'l10n-ky-equals-ru-short vocabulary:v228-2#ru/ky',
  'l10n-ky-equals-ru-short vocabulary:v228-6#ru/ky',
  'l10n-ky-equals-ru-short vocabulary:v228-7#ru/ky',
  'l10n-ky-equals-ru-short vocabulary:v228-12#ru/ky',
  'l10n-ky-equals-ru-short vocabulary:v237-8#ru/ky',
  'cefr-structure-genitiv vocabulary:v223-3#example',
  'cefr-structure-genitiv vocabulary:v228-1#example',
  'cefr-structure-genitiv vocabulary:v234-16#example',
  'cefr-structure-genitiv vocabulary:v234-18#example',
  'cefr-structure-genitiv vocabulary:v234-19#example',
  'cefr-structure-genitiv vocabulary:v234-21#example',
  'cefr-structure-genitiv vocabulary:v234-22#example',
  'cefr-structure-genitiv vocabulary:v234-23#example',
  'cefr-structure-genitiv vocabulary:v234-24#example',
  'cefr-structure-trotzdem vocabulary:v231-22#example',
  'cefr-structure-trotzdem vocabulary:v235-24#example',
]

/** Exact CEFR heuristic flags produced by the approved A2 curriculum-v2 reading texts. */
export const A2_READING_FLAGS: string[] = [
  'cefr-structure-konj-b1 reading:a2-re-201-01#body[0]',
  'cefr-structure-plusquam reading:a2-re-201-01#body[0]',
  'cefr-structure-plusquam reading:a2-re-202-01#body[0]',
  'cefr-structure-konj-b1 reading:a2-re-204-01#body[0]',
  'cefr-structure-trotzdem reading:a2-re-205-01#body[0]',
  'cefr-structure-genitiv reading:a2-re-206-01#body[0]',
  'cefr-structure-relativsatz reading:a2-re-211-01#body[0]',
  'cefr-structure-trotzdem reading:a2-re-212-01#body[0]',
  'cefr-structure-konj-b1 reading:a2-re-213-01#body[0]',
  'cefr-structure-relativsatz reading:a2-re-215-01#body[0]',
  'cefr-sentence-length reading:a2-re-215-01#body[0]',
  'cefr-structure-trotzdem reading:a2-re-216-01#body[0]',
  'cefr-structure-konj2-past reading:a2-re-217-01#body[0]',
  'cefr-structure-trotzdem reading:a2-re-218-01#body[0]',
  'cefr-structure-relativsatz reading:a2-re-218-01#body[0]',
  'cefr-structure-relativsatz reading:a2-re-219-01#body[0]',
  'cefr-structure-genitiv reading:a2-re-219-01#body[0]',
  'cefr-structure-konj-b1 reading:a2-re-222-01#body[0]',
  'cefr-structure-plusquam reading:a2-re-223-01#body[0]',
  'cefr-structure-konj-b1 reading:a2-re-224-01#body[0]',
  'cefr-structure-plusquam reading:a2-re-224-01#body[0]',
  'cefr-structure-konj-b1 reading:a2-re-225-01#body[0]',
  'cefr-structure-relativsatz reading:a2-re-225-01#body[0]',
  'cefr-sentence-length reading:a2-re-225-01#body[0]',
  'cefr-structure-konj-b1 reading:a2-re-226-01#body[0]',
  'cefr-structure-relativsatz reading:a2-re-226-01#body[0]',
  'cefr-structure-konj-b1 reading:a2-re-228-01#body[0]',
  'cefr-structure-trotzdem reading:a2-re-228-01#body[0]',
  'cefr-structure-relativsatz reading:a2-re-228-01#body[0]',
  'cefr-structure-relativsatz reading:a2-re-231-01#body[0]',
  'cefr-structure-konj-b1 reading:a2-re-232-01#body[0]',
  'cefr-structure-relativsatz reading:a2-re-233-01#body[0]',
  'cefr-structure-genitiv reading:a2-re-233-01#body[0]',
  'cefr-structure-konj-b1 reading:a2-re-234-01#body[0]',
  'cefr-structure-relativsatz reading:a2-re-234-01#body[0]',
  'cefr-structure-genitiv reading:a2-re-235-01#body[0]',
  'cefr-structure-plusquam reading:a2-re-236-01#body[0]',
  'cefr-structure-konj2-past reading:a2-re-236-01#body[0]',
  'cefr-structure-relativsatz reading:a2-re-238-01#body[0]',
  'cefr-structure-relativsatz reading:a2-re-239-01#body[0]',
  'cefr-structure-plusquam reading:a2-re-240-01#body[0]',
]

export const EXPECTED_BETA_FLAGS: string[] = [
  ...units.map(u => `cefr-signoff-missing units:${u}`),
  ...units.flatMap(u => [`beta-review-pending units:${u}`, `beta-review-pending units:${u}`]), // one per released locale (ru, ky)
  'beta-level-test-missing A2',
  ...A2_READING_FLAGS,
  ...A2_VOCABULARY_FLAGS,
].sort()

/** Exact-key set for the "no unexpected review flag" guard in unit-12…20. */
export const EXPECTED_REVIEW_FLAGS: ReadonlySet<string> = new Set(EXPECTED_BETA_FLAGS)
