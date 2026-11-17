/**
 * The validator's report for the real A2 bundle while A2 is in controlled BETA for ru + ky (owner-approved): no error, no warning; every human sign-off and the
 * level test are explicit non-blocking review flags. A full release (status released / --release) turns all of them into errors.
 */
export const BETA_FLAG_RULES = ['cefr-signoff-missing', 'beta-review-pending', 'beta-level-test-missing']

const units = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
export const EXPECTED_BETA_FLAGS: string[] = [
  ...units.map(u => `cefr-signoff-missing units:${u}`),
  ...units.flatMap(u => [`beta-review-pending units:${u}`, `beta-review-pending units:${u}`]), // one per released locale (ru, ky)
  'beta-level-test-missing A2',
].sort()
