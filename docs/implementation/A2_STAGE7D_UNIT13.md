# A2 Stage 7D — Unit 13 implementation report

Unit 13 *Wohnen und Nachbarschaft* is authored as production data (`src/data/a2/unit13/`) and wired additively into the A2 modules. A2 stays `planned`/invisible; units 14–20 are empty; nothing is committed. No human review has taken place (`A2_REVIEWS = {}`): all German, Russian and Kyrgyz is an AI-assisted first draft.

Decisions, deviations from the Stage 7B design, grammar limits, the objective→assessment matrix and the receptive list: `docs/authoring/A2_UNIT13_DESIGN_NOTES.md`. Kyrgyz terminology doubts: `docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md` §6.

## Content

| Item | Result |
| --- | --- |
| Vocabulary | 37 = the approved map exactly (33 productive, 4 receptive: *Dachboden, geräumig, Mülltrennung, renovieren*) |
| Grammar | 3 concepts, each with a capped scope: adjective endings after *ein-/kein-/mein-* (Nom/Akk, singular), *Komparativ/Superlativ* (`als` only, no *so … wie*), position verbs (*Wo?* Dativ / *Wohin?* Akkusativ) |
| Listening | 2 (formal phone call about a viewing; friends moving furniture, incl. a broken heating reported to the landlord) |
| Reading | 2 (classified ad with decoded abbreviations; *Hausordnung* + a neighbour's note) |
| Speaking | 1 (viewing a flat with the landlord, *Sie*, 4 turns) |
| Writing | 1 (formal e-mail answering an ad, ≥ 50 words, 8 required elements; model 63 words) |
| Wiederholung | 8 independent exercises (3 fill / 3 choice / 2 order; concepts 3 / 3 / 2) |
| Abschlusstest | 15 independent questions (7 grammar / 3 vocabulary / 5 reading and communication), positions 5 / 5 / 5, never three in a row |
| Localisation | every field has independent Russian and Kyrgyz; no fallback; no field where Kyrgyz equals Russian |

## Files

**Created:** `src/data/a2/unit13/{vocabulary,grammar,texts,assessment,unit}.ts` · `tests/content-validate/unit-13.test.ts` (41 tests) · `docs/authoring/A2_UNIT13_DESIGN_NOTES.md` · this report.
**Modified (additive wiring, Units 11 and 12 content untouched):** `src/data/a2/{units,vocabulary,grammar,listening,reading,speaking,writing,exercises,tests,instructions,provenance}.ts` (each only adds the Unit 13 import and spreads it into the merged A2 array; `provenance.ts` adds `UNIT_13_SOURCE`) · `docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md` (new §6, append only).
**Modified (tests only):** the assertions that fixed the set of authored units were updated from "units 11 and 12" to "units 11, 12 and 13" (`unit-11`, `unit-12`, `infrastructure`, `metadata`, `catalog`, `lazy-level`); the `catalog` isolation fixture that used the temporary id of unit 13 now uses unit 14. No Unit 11 / Unit 12 data or content assertion was changed.
**Not touched:** A1 data and code, Units 11 and 12, the Stage 7B documents, the validator and the review tooling.

## Results

| Check | Result |
| --- | --- |
| Full tests | 61 files, **1614 pass** (before: 60 / 1573; +41 unit-13 tests, +1 file) |
| Unit 13 tests | 41 pass: completeness, vocabulary-map equality and order, productive/receptive split, RU/KY parity and independence, grammar limits (endings checked against noun gender), no imperative / `dürfen` / `man`, reading translation-leak rules, receptive-vocabulary rules, exercise and test counts, answer positions, objective matrix, stage boundaries |
| `content:validate` | 0 errors, 0 warnings, 3 review flags (the missing sign-offs of units 11, 12, 13) |
| `content:validate:release` | fails as required (exit 1) |
| A1 regression oracle, level scoping, navigation, PWA, lazy loading, data | 25 files / **412 tests pass** (same as Stage 7C) |
| Units 11 and 12 unchanged | review-package fingerprints identical: Unit 11 `502db4af8249` / `dd636659c06f`, Unit 12 `4b6f9b8dcf73` / `3a8c03023e72` (now locked in the unit-13 test) |
| `tsc` | clean |
| ESLint | 0 errors, 8 pre-existing warnings (none in files of this stage) |
| Prettier | new and changed files in `tests/` and `scripts/` pass; `npm run format:check` still reports 16 pre-existing files (none from this stage) |
| Boundaries | 5 baseline violations, 0 cycles (unchanged) |
| Build (`build:ci`) | passes; the usual >500 kB entry-chunk warning is unchanged |

## Bundle (file bytes, `wc -c`; gzip -9)

| | raw | gzip |
| --- | --- | --- |
| A1 entry bundle | 579 763 (**identical to Stage 7C**) | 181 871 (Vite reports 182.58 kB, unchanged) |
| A2 chunk (units 11–13) | 243 457 | 65 741 |
| Stage 7C report for units 11 + 12 | 152 088 | 41 807 |
| Unit 13's share (difference) | ≈ +91.4 kB | ≈ +23.9 kB |

The A2 chunk is listed as `lazy` in `pwa-build.json` (not precached). Unique Unit 13 strings (*Der Umzug: Wohin kommt was?*, `a2-ft-13-01`, …) occur only in the A2 chunk, never in the entry bundle. (The 7C figures are taken from that report, not re-measured.)

## Review package

**Not generated, on purpose.** `scripts/review/unit-package.ts` is Unit-11-specific beyond the unit number: its text embeds the Unit 11 decision table (F1–F11), the Unit 11 review questions and the Kyrgyz correction table K1–K18, uses `UNIT_11_RECEPTIVE_WORDS`, and `generate.ts` writes fixed Unit 11 file names. `cefrPackage(13)` would therefore print a package labelled for Unit 11 with wrong context. (Unit 12 has no package for the same reason.) A generalisation of the tooling (unit title, receptive set, per-unit decision tables, file names) would have to keep the Unit 11 fingerprints stable and is proposed as a separate step.

## Warnings and honest caveats

* All content is an AI draft. The CEFR level of the German texts (notably the classified ad with abbreviations, the *Hausordnung*, the telephone call) and every Kyrgyz string need human review.
* Unit 13 carries the heaviest new grammar of A2 (three concepts). Scope is capped (see design notes §3) and the load is spread over 8 + 15 items, but a CEFR reviewer should judge whether three concepts are right.
* Kyrgyz glosses for *Kaution, Nebenkosten, Aufzug, Herd*, and the Kyrgyz rendering of the stehen/stellen/liegen/legen split are doubtful (glossary §6); `лифт (көтөргүч)` and `ашкана плитасы` were chosen so that the Kyrgyz differs from the Russian gloss, which a native reviewer may prefer to replace by the plain loanword plus a `SAME_AS_RU` entry.
* `kaputt`-type vocabulary for reporting a defect is not in the approved map; the defect is reported with *funktioniert nicht* (text only, never required).
* Unit 11's reading items (translated passages) remain unchanged; the defect is still recorded in the Stage 7B audit (B1).

## Outstanding terminology and pedagogical questions

1. **Komparativ cap:** the Stage 7B design lists *so … wie*; this stage follows the audit and omits it. Confirm, or add it back in a later pass.
2. **Formal e-mail (W1) at ≥ 50 words** — acceptable for A2 production, or reduce further / provide sentence frames?
3. **Defect-reporting vocabulary:** add *kaputt* (and a *Hausmeister*-type word) to the vocabulary map for a later unit, or keep text-only chunks?
4. **Review tooling:** approve a generalisation of `unit-package.ts` so Unit 12 and Unit 13 packages can be produced.
5. **Kyrgyz:** the four open items of glossary §6.3 (*deposit* wording; *лифт*/*плита* loanwords; the *Nebenkosten* explanation; a consistent description of the position-verb pairs).
6. **Position verbs:** *hängen* is taught in the present tense only, with one form for both meanings (*hängt* / *hängt*); the strong/weak Präteritum split is deliberately out of scope. Confirm.

## Status

A2 remains `planned`, `releasedLocales: []`, invisible (`isLevelVisible('A2') === false`, tested). Release validation fails on purpose (units 14–20, level test, placement, sign-offs). Stopped after Unit 13; Unit 14 awaits approval.
