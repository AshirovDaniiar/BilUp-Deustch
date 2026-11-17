# A2 plan — Stage 0 baseline and A1 regression protection

Recorded on `main` @ `cd307f1` ("Updated Design"), working tree clean before Stage 0 began. No A1 content, no application source and no A2 content were changed in Stage 0; it only adds guards and measurements.

## 1. Test results at baseline (before any A2 change)

| Check | Result |
| --- | --- |
| `npm run typecheck` | pass |
| `npm run lint` | 0 errors, 8 warnings (pre-existing, `jsx-a11y`) |
| `npm test` | **31 files, 773 tests — all pass** |
| `npm run content:validate` | 0 errors; INFO: 272 / 352 grammar+exercise L10n strings have no Kyrgyz text |
| `npm run boundaries:report` | 5 violations, 0 cycles (report-only, pre-existing, not enforced) |
| `npm run format:check` | 15 files flagged (pre-existing; none are Stage 0 files) |
| `npm run build:ci` | pass |

After Stage 0 (adds the regression guard): **32 files, 780 tests — all pass**; every other row above is unchanged.

## 2. Production bundle baseline (D-5) — `tests/regression/baselines/bundle-a1.json`

| | raw | gzip | brotli |
| --- | ---: | ---: | ---: |
| main JS (`assets/index-*.js`, single chunk) | 556.4 kB | 177.2 kB | 145.1 kB |
| CSS | 41.7 kB | 9.0 kB | 8.0 kB |
| precache total (13 files, excl. sw.js / config) | 1013.3 kB | 599.7 kB | 566.5 kB |
| `src/data/*.ts` source (A1 content, 13 files) | 202.6 kB | 71.3 kB | 62.1 kB |

Notes: kB = 1024 bytes of UTF-8. Vite's own reporter prints 517.35 kB for the same chunk because it counts characters, and the Russian/Kyrgyz text is two bytes per character. Re-measure with
`npm run build:ci && node scripts/regression/bundle-size.mjs --compare tests/regression/baselines/bundle-a1.json`.
Vite already warns that the chunk exceeds 500 kB.

## 3. What protects A1 (all in `tests/regression/`, run by `npm test`)

`a1-snapshot.ts` computes the fingerprints; `scripts/regression/capture-a1.ts` writes them to `baselines/`; `a1-baseline.test.ts` recomputes and compares. The same functions are used for capture and check, so they cannot drift apart.

1. **Content hashes** (`a1-content-hashes.json`): SHA-256 of the JSON of 23 A1 collections (units, vocabulary, grammar, exercises incl. generated article drills, listening, reading, speaking, writing, real-life, tests, case/visual/error-pattern data…) **and** of the 12 A1 data source files (CRLF-normalised). Any edit to A1 content fails.
2. **Selector baseline** (`a1-selectors.json`): id lists and per-unit counts for every A1 collection, test definitions, `UNIT_SPEAKING`, and the lab lists as they are today (filtered by each item's own `level` tag). The Stage 1 catalog's `…Of('A1')` selectors must equal these.
3. **Behaviour baseline** (`a1-behaviour.json`):
   - required sections per unit; unit / level progress, `currentUnit`, badges, recommendations, word stages, due/mastered counts, weak concepts, skill percentages for 5 progress scenarios (empty, unit 1, units 1–9, all A1, mixed with mastery and mistakes);
   - seeded daily challenges for 6 dates; every A1 `TestDef` × 3 seeds; unit reviews for all 10 units; concept questions for all 20 concepts; article drills;
   - AI tutor answers to a 21-prompt script for ru/ky/de × A1/A2.
4. **Verified, not assumed:** re-capturing produces byte-identical files (deterministic), and five deliberate mutations were each caught and reverted — a changed A1 vocabulary word, a changed `levelProgress` formula, changed tutor text, an edit to `units.ts`, and a changed daily-challenge pick count.

## 4. Intentional A1 changes (approved) — the only legitimate reasons to re-capture

| Id | Change | Effect on the baseline |
| --- | --- | --- |
| D-1 | Listening/Reading/Writing labs scoped by the parent unit's level | `labsByItemLevel` in `a1-selectors.json` is the *old* behaviour; update deliberately when the labs change |
| D-4 | Listening/reading option order randomised (A1 and A2) | **Correction (Stage 4):** `lq-*` order was normalised in the test fingerprints but NOT in the daily-challenge hash, so four daily hashes had to be re-captured — on the unchanged code, with the diff proven (see [A2_STAGE4_ANSWER_ORDER.md](A2_STAGE4_ANSWER_ORDER.md) §7). Order of `lq-*`/`rq-*` options is now normalised everywhere |
| D-3 | Tutor localisation (A2 in Kyrgyz; Kyrgyz must not fall back to Russian) | tutor baseline records today's replies; A1 replies in `ru` must stay identical, `ky` answers will legitimately change |

Re-capture only with `npx vite-node scripts/regression/capture-a1.ts`, and record the reason in the commit message and here.

## 5. Findings from Stage 0

- **Tutor is a rule-based `MockTutor`** with module-global `pending` quiz state; its framing text is hard-coded Russian. In the baseline, 7 of the 21 scripted replies in `ky` (and in `de`) are byte-identical to Russian. In the other 14 only the grammar content (via `tr()`) is Kyrgyz/German while labels and instructions ("Примеры по теме…", "Давайте проверим") stay Russian. Its "B1+" list treats Konjunktiv II as out of scope for A1/A2, which is wrong for A2. D-3 therefore needs a real response-template catalog and Kyrgyz intent recognition, not a patch — to be planned as its own stage.
- **Content validator already reports** 272 / 352 L10n strings without Kyrgyz text (grammar + exercises) — the starting point for the new `l10n-complete` rule.
- **Bundle:** A1 data source is ~203 kB raw of a ~556 kB chunk; A2 at similar density is expected to add of the order of 35 % to the main chunk. To be measured, not assumed, after A2 lands.

## 6. Next stage
Stage 1 (course registry, catalog, A2 skeletons) is documented in [A2_STAGE1_CATALOG.md](A2_STAGE1_CATALOG.md).
