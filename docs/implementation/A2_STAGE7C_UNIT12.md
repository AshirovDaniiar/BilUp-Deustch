# A2 Stage 7C — Unit 12 implementation report

Unit 12 *Familie, Freunde und Zusammenleben* is authored as production data (`src/data/a2/unit12/`) and wired into the A2 modules. A2 stays `planned`/invisible; units 13–20 are empty; nothing is committed. No human review has taken place (`A2_REVIEWS = {}`): all German, Russian and Kyrgyz is an AI-assisted first draft.

Details of decisions, deviations from the Stage 7B design, the imperative chunk list, the reading-question rule, the objective→assessment matrix and the receptive list: `docs/authoring/A2_UNIT12_DESIGN_NOTES.md`. Kyrgyz terminology doubts: `docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md`.

## Files
**Created:** `src/data/a2/unit12/{vocabulary,grammar,texts,assessment,unit}.ts` · `tests/content-validate/unit-12.test.ts` (32 tests) · `docs/authoring/A2_UNIT12_DESIGN_NOTES.md` · `docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md` · this report.
**Modified (additive wiring, Unit 11 content untouched):** `src/data/a2/{units,vocabulary,grammar,listening,reading,speaking,writing,exercises,tests,instructions,provenance}.ts` (each keeps its Unit 11 array under a `UNIT_11_*` name and exports the merged A2 array).
**Modified (tooling and tests only):** `scripts/review/unit-package.ts` (a unit's package contains only its own why-notes; Unit 11 fingerprints unchanged) · tests that asserted "only unit 11 exists" were updated to "units 11 and 12" (`unit-11`, `infrastructure`, `metadata`, `catalog`, `data-boundary`, `lazy-level`, `curriculum-map`); `lazy-level` now polls for the chunk instead of a fixed 300 ms wait.

## Results
| Check | Result |
| --- | --- |
| Full tests | 60 files, **1573 pass** (before: 59 / 1541; +32 unit-12 tests, +1 file) |
| `content:validate` | 0 errors, 0 warnings, 2 review flags (sign-offs of units 11 and 12 missing) |
| `content:validate:release` | fails as required (exit 1) |
| RU/KY parity | validator + tests: every field has Russian and Kyrgyz, none equal, German quotes identical |
| A1 regression oracle, level scoping, navigation, PWA, lazy loading | 25 files / 412 tests pass |
| Unit 11 regression | review-package fingerprints identical (`502db4af8249`, `dd636659c06f`); Unit 11 tests pass |
| `tsc` | clean |
| ESLint | 0 errors, 8 pre-existing warnings |
| Boundaries | 5 baseline violations, 0 cycles |
| Build | passes |

## Bundle (file bytes)
| | raw | gzip |
| --- | --- | --- |
| A1 entry bundle | 579 763 (**unchanged**) | 182 582 |
| A2 chunk (units 11 + 12) | 152 088 (unit 11 alone: 83 127) | 41 807 (unit 11 alone: 22 466) |
| Unit 12's share | ≈ +68.9 kB | ≈ +19.3 kB |

The chunk is outside the precache; the entry bundle contains no unit-12 text.
