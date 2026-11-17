# A2 Stage 7F — Unit 15 implementation report

Unit 15 *Essen, Einkaufen und Dienstleistungen* is authored as production data (`src/data/a2/unit15/`) and wired additively into the A2 modules. A2 stays `planned`/invisible; units 16–20 are empty; nothing is committed. No human review has taken place (`A2_REVIEWS = {}`): all German, Russian and Kyrgyz is an AI-assisted first draft.

Decisions, deviations from the Stage 7B design, grammar limits, the objective→assessment matrix and the receptive list: `docs/authoring/A2_UNIT15_DESIGN_NOTES.md`. Kyrgyz terminology doubts: `docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md` §8.

## Content

| Item | Result |
| --- | --- |
| Vocabulary | 38 = the approved map exactly (36 productive, 2 receptive: *Lieferung, liefern*) |
| Grammar | 3 concepts, each capped: adjective endings after the definite article / *dieser* / *welcher* (Nominativ and Akkusativ, singular and plural), measure words + *welche / einen / keinen* + *wie viel / wie viele*, a closed list of polite chunks (*Ich hätte gern* only as a phrase) |
| Listening | 2 (restaurant: order, vegetarian question, bill; clothes shop: size, trying on, discount, payment) |
| Reading | 2 (menu, non-continuous; flyer of offers + repair-service notice) |
| Speaking | 1 (telephone call to a hairdresser, *Sie*, 4 turns) |
| Writing | 1 (formal e-mail to a shop about an exchange, ≥ 50 words, 8 required elements) |
| Wiederholung | 8 independent exercises (3 fill / 3 choice / 2 order; concepts 3 / 3 / 2) |
| Abschlusstest | 15 independent questions (7 grammar / 3 vocabulary / 5 reading and communication), positions 5 / 5 / 5, never three in a row |
| Localisation | independent Russian and Kyrgyz for every field; no fallback; none identical |

## Files

**Created:** `src/data/a2/unit15/{vocabulary,grammar,texts,assessment,unit}.ts` · `tests/content-validate/unit-15.test.ts` (44 tests) · `docs/authoring/A2_UNIT15_DESIGN_NOTES.md` · this report.
**Modified (additive wiring, Units 11–14 content untouched):** `src/data/a2/{units,vocabulary,grammar,listening,reading,speaking,writing,exercises,tests,instructions,provenance}.ts` (Unit 15 import + spread; `provenance.ts` adds `UNIT_15_SOURCE`) · `docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md` (new §8, append only).
**Modified (tests only):** assertions that fix the set of authored units were updated from "11–14" to "11–15" (`unit-11` … `unit-14`, `infrastructure`, `metadata`, `catalog`, `lazy-level`); the `catalog` isolation fixture now uses the temporary unit 16. No content assertion of an earlier unit was changed.
**Not touched:** A1 data and code, Units 11–14, the Stage 7B documents, the validator and the review tooling.

## Results

| Check | Result |
| --- | --- |
| Full tests | 63 files, **1701 pass** (before: 62 / 1657; +44 unit-15 tests, +1 file) |
| Unit 15 tests | 44 pass: completeness, vocabulary-map equality and order, productive/receptive split, RU/KY parity and independence, grammar limits (every attributive adjective checked against determiner and noun; `hätte` only in `hätte gern`; measure words; no *man / als / dass / lassen / eins*), reading translation-leak rules, receptive-vocabulary rules, counts, answer positions, matrix, boundaries |
| `content:validate` | 0 errors, 0 warnings, 5 review flags (missing sign-offs of units 11–15) |
| `content:validate:release` | fails as required (exit 1) |
| A1 regression oracle, level scoping, navigation, PWA, lazy loading, data | 25 files / **412 tests pass** (same as Stages 7D and 7E) |
| Units 11–14 unchanged | review-package fingerprints identical: U11 `502db4af8249` / `dd636659c06f`, U12 `4b6f9b8dcf73` / `3a8c03023e72`, U13 `c99778902721` / `fc311c5a7e08`, U14 `d932881835ec` / `39b892b0a8a1` (locked in the unit-15 test) |
| `tsc` | clean |
| ESLint | 0 errors, 8 pre-existing warnings |
| Prettier | `tests/content-validate` and `scripts` pass |
| Boundaries | 5 baseline violations, 0 cycles (unchanged) |
| Build (`build:ci`) | passes; the usual >500 kB entry-chunk warning is unchanged |

## Bundle (file bytes, `wc -c`; gzip -9)

| | raw | gzip |
| --- | --- | --- |
| A1 entry bundle | 579 763 (**identical to Stages 7C–7E**) | 181 873 (Vite: 182.58 kB, unchanged) |
| A2 chunk (units 11–15) | 416 638 | 109 159 |
| A2 chunk (units 11–14, Stage 7E) | 330 894 | 87 683 |
| Unit 15's share (difference) | ≈ +85.7 kB | ≈ +21.5 kB |

The chunk is `lazy` in `pwa-build.json`, not precached. Unique Unit 15 strings (*Café Sonne*, `a2-ft-15-01`, *Angebote und Service*) occur only in the A2 chunk. The A2 chunk grows by ≈ 22 kB gzip per unit; with five more units it will reach ≈ 220 kB gzip — still lazy, but worth a size budget before release.

## Warnings and honest caveats

* All content is an AI draft. The CEFR level of the German (the menu abbreviations, the flyer, the repair notice, the exchange e-mail) and every Kyrgyz string need human review. **Audit D-3, condition (3)** — the CEFR reviewer's confirmation of *Ich hätte gern* — is still open.
* Unit 15 again carries three structures; the adjective-ending concept is the second step of a paradigm (after unit 13) and the first one that must be told apart from the *ein-* endings. A reviewer should judge the load.
* Names of foods, measures and clothes are glossed as German items; whether a Kyrgyz learner needs local-equivalent notes (bread, tea, meat) is left to the native reviewers.
* **Process note.** While reformatting, one Prettier run touched six unrelated test files (A1 / storage tests); they were restored from git immediately and the working tree shows only the two test files that were already modified before this session (`tests/i18n.test.ts`, `tests/pwa/fakes.ts`).
* The **review package was not generated** (the tooling is still Unit-11-specific; Units 12–15 have none).

## Outstanding terminology and pedagogical questions

1. **Adjective endings in the plural without article** (*frische Äpfel*, *rote Schuhe*) are excluded here; menus and shops use them constantly. Decide whether a later unit (16 or 20) should teach the strong plural ending, or keep it receptive.
2. **Neuter replacement pronouns** (*eins / keins*) are not taught; the *einen / keinen / welche* set is incomplete by design. Confirm.
3. **D-3 confirmation** of *Ich hätte gern* by the CEFR reviewer, and whether *Wie wäre es mit …?* (unit 20) follows the same closed-chunk rule.
4. **Informal speaking.** Units 13–15 each have a formal (*Sie*) speaking task; the audit asks for informal tasks between 15 and 19 — confirm units 16 and 18.
5. **Kyrgyz:** the five open items of glossary §8.3 (loan-word brackets, the three-course terms, *vegetarisch*, politeness register, *Ich hätte gern*).
6. **Review tooling:** approve a generalisation of `scripts/review/unit-package.ts` (Units 12–15 still have no package).
7. **Chunk size budget** for the lazy A2 chunk (see Bundle).

## Status

A2 remains `planned`, `releasedLocales: []`, invisible (`isLevelVisible('A2') === false`, tested). Release validation fails on purpose (units 16–20, level test, placement, sign-offs). Stopped after Unit 15; Unit 16 awaits approval.
