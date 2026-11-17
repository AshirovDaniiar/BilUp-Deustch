# A2 Stage 7E — Unit 14 implementation report

Unit 14 *Gesundheit und Wohlbefinden* is authored as production data (`src/data/a2/unit14/`) and wired additively into the A2 modules. A2 stays `planned`/invisible; units 15–20 are empty; nothing is committed. No human review has taken place (`A2_REVIEWS = {}`): all German, Russian and Kyrgyz is an AI-assisted first draft.

Decisions, deviations from the Stage 7B design, grammar limits, the emergency micro-task, the objective→assessment matrix and the receptive list: `docs/authoring/A2_UNIT14_DESIGN_NOTES.md`. Kyrgyz terminology doubts: `docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md` §7.

## Content

| Item | Result |
| --- | --- |
| Vocabulary | 38 = the approved map exactly (34 productive, 4 receptive: *Grippe, Untersuchung, untersuchen, Krankschreibung*) |
| Grammar | 3 concepts, each capped: imperative (du and Sie only; no *ihr*, no *sei*), *sollen / dürfen* (present; *müssen / können* recycled), *wenn* clauses (condition / habit) |
| Listening | 2 (formal phone call to a practice; a friend's advice about a cold) |
| Reading | 2 (leaflet exercise text; stress tips + emergency box with the Notruf 112) |
| Speaking | 1 (at the doctor's, *Sie*, 4 turns) |
| Writing | 1 (formal e-mail to a supervisor reporting illness, ≥ 50 words, 8 required elements, one *wenn* sentence) |
| Wiederholung | 8 independent exercises (3 fill / 3 choice / 2 order; concepts 3 / 2 / 3) |
| Abschlusstest | 15 independent questions (6 grammar / 3 vocabulary / 6 reading and communication), positions 5 / 5 / 5, never three in a row |
| Emergency | vocabulary (*Notruf, Krankenwagen, Notaufnahme*) + the call script in R2 + FT 12 |
| Localisation | independent Russian and Kyrgyz for every field; no fallback; none identical |

## Files

**Created:** `src/data/a2/unit14/{vocabulary,grammar,texts,assessment,unit}.ts` · `tests/content-validate/unit-14.test.ts` (43 tests) · `docs/authoring/A2_UNIT14_DESIGN_NOTES.md` · this report.
**Modified (additive wiring, Units 11–13 content untouched):** `src/data/a2/{units,vocabulary,grammar,listening,reading,speaking,writing,exercises,tests,instructions,provenance}.ts` (Unit 14 import + spread; `provenance.ts` adds `UNIT_14_SOURCE`) · `docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md` (new §7, append only).
**Modified (tests only):** assertions that fix the set of authored units were updated from "11–13" to "11–14" (`unit-11`, `unit-12`, `unit-13`, `infrastructure`, `metadata`, `catalog`, `lazy-level`); the `catalog` isolation fixture now uses the temporary unit 15; `unit-11-smoke` now polls for the lazy A2 chunk instead of waiting a fixed 250 ms (it began to time out as the chunk grew — same fix as Stage 7C's `lazy-level`). No content assertion of any earlier unit was changed.
**Not touched:** A1 data and code, Units 11–13, the Stage 7B documents, the validator and the review tooling.

## Results

| Check | Result |
| --- | --- |
| Full tests | 62 files, **1657 pass** (before: 61 / 1614; +43 unit-14 tests, +1 file) |
| Unit 14 tests | 43 pass: completeness, vocabulary-map equality and order, productive/receptive split, RU/KY parity and independence, grammar limits, emergency micro-task, health-content safety, reading translation-leak rules, receptive-vocabulary rules, counts, answer positions, matrix, boundaries |
| `content:validate` | 0 errors, 0 warnings, 4 review flags (missing sign-offs of units 11–14) |
| `content:validate:release` | fails as required (exit 1) |
| A1 regression oracle, level scoping, navigation, PWA, lazy loading, data | 25 files / **412 tests pass** (same as Stage 7D) |
| Units 11, 12, 13 unchanged | review-package fingerprints identical: U11 `502db4af8249` / `dd636659c06f`, U12 `4b6f9b8dcf73` / `3a8c03023e72`, U13 `c99778902721` / `fc311c5a7e08` (locked in the unit-14 test) |
| `tsc` | clean |
| ESLint | 0 errors, 8 pre-existing warnings |
| Prettier | `tests/` and `scripts/` pass |
| Boundaries | 5 baseline violations, 0 cycles (unchanged) |
| Build (`build:ci`) | passes; the usual >500 kB entry-chunk warning is unchanged |

## Bundle (file bytes, `wc -c`; gzip -9)

| | raw | gzip |
| --- | --- | --- |
| A1 entry bundle | 579 763 (**identical to Stage 7C and 7D**) | 181 871 (Vite: 182.58 kB, unchanged) |
| A2 chunk (units 11–14) | 330 894 | 87 683 |
| A2 chunk (units 11–13, Stage 7D) | 243 457 | 65 741 |
| Unit 14's share (difference) | ≈ +87.4 kB | ≈ +21.9 kB |

The chunk is `lazy` in `pwa-build.json`, not precached. Unique Unit 14 strings (*Gesund bleiben und der Notruf*, `a2-ft-14-01`, *Schmerztabletten*) occur only in the A2 chunk. (The Stage 7D figure was measured before a one-sentence edit of a Unit 13 vocabulary example, so the difference is approximate.)

## Warnings and honest caveats

* All content is an AI draft. The CEFR level of the German (the leaflet, the emergency box, the sick-note e-mail) and every Kyrgyz string, especially the medical terms, need human review.
* Unit 14 combines three structures (imperative, two modals, *wenn*). Scope is capped and the load is spread over 8 + 15 items, but a CEFR reviewer should judge whether it is too much for one unit.
* The leaflet is an invented exercise text; it is marked as such in the text and in the instructions. No real dosing advice is intended or given. The emergency script (*Wo sind Sie? Was ist passiert?*) reflects the usual structure of an emergency call and should be checked by a reviewer for the German emergency-number conventions.
* The comparatives in Unit 14 dialogues (*besser, schlechter, früher*) are single words, not teaching; the Unit 13 *Komparativ* scope is unchanged.
* The **review package was not generated** (the tooling is still Unit-11-specific; Units 12–14 have none).

## Outstanding terminology and pedagogical questions

1. **Imperative scope:** the audit cap (du and Sie, no *ihr*, no *sein*) is applied; the Stage 7B grammar progression still lists *sein* and says "du / ihr / Sie". Confirm the cap, and decide when *ihr* is taught (a later unit, or never at A2).
2. **Emergency micro-task** was placed in unit 14 following the audit (D-8 REVISE) and this stage's brief; the Stage 7B design documents still show it in unit 19 — a separate approval is needed to align them.
3. **Präteritum modals (T10 of the design)** are not assessed here; decide whether a later unit should recycle *konnte / musste* in a health context.
4. **Kyrgyz:** the five open items of glossary §7.3 (description of the imperative, body-part glosses where one Kyrgyz word covers two German ones, the emergency wording, *Krankschreibung* / *Praxis*, consistency of *сен / сиз*).
5. **Review tooling:** approve a generalisation of `scripts/review/unit-package.ts` (Units 12–14 still have no package).

## Status

A2 remains `planned`, `releasedLocales: []`, invisible (`isLevelVisible('A2') === false`, tested). Release validation fails on purpose (units 15–20, level test, placement, sign-offs). Stopped after Unit 14; Unit 15 awaits approval.
