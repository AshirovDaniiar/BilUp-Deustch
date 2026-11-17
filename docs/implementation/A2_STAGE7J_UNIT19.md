# A2 Stage 7J — Unit 19 implementation report

Unit 19 *Stadtleben und öffentliche Dienste* is authored as production data (`src/data/a2/unit19/`) and wired additively into the A2 modules. A2 stays `planned`/invisible; unit 20 is empty; nothing is committed. No human review has taken place (`A2_REVIEWS = {}`): all German, Russian and Kyrgyz is an AI-assisted first draft.

Decisions, deviations from the Stage 7B design, grammar limits, the objective→assessment matrix and the receptive list: `docs/authoring/A2_UNIT19_DESIGN_NOTES.md`. Kyrgyz terminology doubts: `docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md` §12.

## Decisions of the Stage 7J brief — how they were applied

| Decision | Result |
| --- | --- |
| Small practical directions micro-task (ask where a place is, understand directions, explain a short route) | **L2** (street dialogue: ask for the post office, route *bis zur Kreuzung – rechts – an der Bank vorbei – gegenüber von der Apotheke*, time on foot, parcel counter, cash machine); **S1** (explain a route from a mini-map in the task text, answer two questions, ask one indirect question); **G3** `a2-wegbeschreibung-praepositionen` with E6–E8 and FT 06, 07, 13, 14. Tested as a unit. |
| Keep *Es wird …* in Unit 18, do not modify Unit 18 | Unit 18 content untouched (fingerprints verified); Unit 19 uses no *werden* (tested) |
| Kyrgyz date formatting provisional | no calendar date in Unit 19 (clock times and weekdays only); glossary §10.3 unchanged |
| No change to the `SAME_AS_RU` validator | validator, rules and `reviews.ts` untouched; no allow-list needed (no identical glosses, no brackets; tested) |
| Do not remove brackets of Units 12–16 | untouched |

## Content

| Item | Result |
| --- | --- |
| Vocabulary | 38 = the approved map exactly (35 productive, 3 receptive: *Aufenthaltserlaubnis, überweisen, Umleitung*) |
| Grammar | 3 concepts: *man* + modal / *erlaubt, verboten* / *Bitte nicht* / *nicht dürfen* vs. *nicht müssen*; indirect questions in **two frames only** (*Können Sie mir sagen, wo/wann/wie …?*, *Ich möchte wissen, ob …*); route prepositions (*bis zu, an … vorbei, gegenüber von, zwischen, über*) with the Sie-imperative |
| Listening | 2 (Bürgeramt registration, *Sie*, 12 lines; street directions to the post office, *Sie*, 10 lines) |
| Reading | 2 (registration form with instructions; Rathaus notice board with opening hours, rules and a diversion) |
| Speaking | 1 (the directions micro-task, 4 turns) |
| Writing | 1 (formal e-mail to the Bürgeramt, ≥ 60 words, six required elements, model 62 words) |
| Wiederholung | 8 independent exercises (3 fill / 3 choice / 2 order; concepts 2 / 3 / 3) |
| Abschlusstest | 15 independent questions (7 grammar / 3 vocabulary / 5 reading and communication), positions 5 / 5 / 5, never three in a row; concept items 4 (man) / 2 (indirect questions) / 4 (routes) |
| Localisation | independent Russian and Kyrgyz for every field; no fallback; none identical |

## Files

**Created:** `src/data/a2/unit19/{vocabulary,grammar,texts,assessment,unit}.ts` · `tests/content-validate/unit-19.test.ts` (49 tests) · `docs/authoring/A2_UNIT19_DESIGN_NOTES.md` · this report.
**Modified (additive wiring):** `src/data/a2/{units,vocabulary,grammar,listening,reading,speaking,writing,exercises,tests,instructions,provenance}.ts` (Unit 19 import + spread; `provenance.ts` adds `UNIT_19_SOURCE`) · `docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md` (new §12, append only).
**Modified (tests only):** assertions that fix the set of authored units were updated from "11–18" to "11–19" (`unit-11` … `unit-18`, `metadata`, `infrastructure`, `catalog`, `lazy-level`); the `catalog` isolation fixture now uses the temporary unit 20. No content assertion of an earlier unit was changed.
**Not touched:** A1 data and code, Units 11–18 content, the Stage 7B documents, the validator, its rules and `reviews.ts`, the review tooling. Prettier was run only on specific test files. `git status` shows among tests only the two files that were already modified before this work (`tests/i18n.test.ts`, `tests/pwa/fakes.ts`); the modified `scripts/*` files were already modified at the start of the session.

## Results

| Check | Result |
| --- | --- |
| Full tests | 67 files, **1888 pass** (before: 66 / 1839; +49 unit-19 tests, +1 file) |
| Unit 19 tests | 49 pass: completeness, vocabulary-map equality and order, productive/receptive split, RU/KY parity and independence, genre and register, the directions micro-task, grammar limits (*man* only with a modal; exactly two indirect-question frames with the verb final and no separable verb / modal / Perfekt inside; route prepositions with the right case; no Passiv, no *werden*, no Konjunktiv II, no ordinals, no adjectives; sentences ≤ 16 words), no-legal-advice check, reading translation-leak rules, receptive-vocabulary rules, counts, answer positions, matrix, boundaries |
| `content:validate` | 0 errors, 0 warnings, 9 review flags (missing sign-offs of units 11–19) |
| `content:validate:release` | fails as required (exit 1) |
| A1 regression oracle, level scoping, navigation, PWA, lazy loading, data | 25 files / **412 tests pass** (unchanged) |
| Units 11–18 unchanged | review-package fingerprints identical: U11 `502db4af8249` / `dd636659c06f`, U12 `4b6f9b8dcf73` / `3a8c03023e72`, U13 `c99778902721` / `fc311c5a7e08`, U14 `d932881835ec` / `39b892b0a8a1`, U15 `12d4f84dfbf1` / `9bbdddbf1eba`, U16 `f75f46556cf7` / `3ee2c25167a6`, U17 `5725c4bc6a78` / `16cc2220e1f2`; **U18 `c469c9dbe60d` / `38594483c4ff` recorded for the first time here** |
| `tsc` | clean |
| ESLint | 0 errors, 8 pre-existing warnings |
| Prettier | `tests/content-validate` passes |
| Boundaries | 5 baseline violations, 0 cycles (unchanged) |
| Build (`build:ci`) | passes |

## Bundle (file bytes, `wc -c`; gzip -9)

| | raw | gzip |
| --- | --- | --- |
| A1 entry bundle | 579 763 (**identical to Stages 7C–7I**) | 181 873 |
| A2 chunk (units 11–19) | 756 388 | 190 374 |
| A2 chunk (units 11–18, Stage 7I) | 666 754 | 168 543 |
| Unit 19's share (difference) | ≈ +89.6 kB | ≈ +21.8 kB |

The chunk is `lazy` in `pwa-build.json`, not precached. Unique Unit 19 strings (*Formular: Anmeldung beim Bürgeramt*, `a2-ft-19-01`, *Rathaus: Öffnungszeiten und Regeln*, *Auf der Straße: Wo ist die Post?*) occur only in the A2 chunk. With unit 20 the chunk will be ≈ 210 kB gzip; the size-budget question is still open.

## Warnings and honest caveats

* All content is an AI draft. The CEFR level of the German (the e-mail, the indirect questions, the Bürgeramt dialogue) and every Kyrgyz string need human review.
* **Indirect questions are borderline A2/B1** (audit D-4). They are capped at two frames, at two final-test items, with no separable verb, modal or Perfekt inside the clause; the Stage 7B plan's third item (T6) was dropped for that reason.
* **Final-test composition differs from the Stage 7B table:** the planned imperative item (T9) and the Dativ-pronoun item (T10) are not separate items; the imperative and *mir* are recycled in the dialogues and FT 14.
* **Administrative content is language practice, not legal advice** (stated in the unit, vocabulary and writing instructions; tested). The two-week registration deadline in L1 is a story detail, not a statement of law. The Kyrgyz glosses of *Bürgeramt, Anmeldung, Ausweis, Aufenthaltserlaubnis* are descriptive, not equivalents.
* L1 (formal, *Sie*) and L2 are both formal; the unit has no informal dialogue by design (the brief's informal-communication requirement applied to Unit 18). The directions micro-task is in formal register (*Sie*) with a stranger.
* The fixed phrase *Es wird …* of Unit 18 is not reused; Unit 19 contains no *werden*.
* **Latent defects found in the Stage 7I test (not modified, as instructed):** `tests/content-validate/unit-18.test.ts` contains two regexes damaged by a shell escape in the previous stage — `/bwirdb/g` (the *wird* check, line ≈ 444, matches nothing) and `/d{3,}/g` (the number check, line ≈ 631). They pass vacuously. The Unit 19 test contains the correct forms. A one-line fix of each is proposed for approval.
* The review package was **not generated** and the `SAME_AS_RU` change was **not implemented**.

## Open questions

1. **Unit 18 test hardening:** approve fixing the two damaged regexes in `unit-18.test.ts` (and check that the checks then still pass).
2. **Informal register:** accept an entirely formal Unit 19, or add an informal directions exchange (two friends, *du*) in a later revision?
3. **Kyrgyz:** the five items of glossary §12.3 (generic *man* and *nicht dürfen / nicht müssen*, the indirect-question explanation, administrative glosses, loans vs. descriptions, *Sie / сиз* register).
4. **Validator:** when to implement the approved `SAME_AS_RU` proposal (typed allow-list with reasons) and whether to revisit the brackets of Units 12–16.
5. **Review tooling:** still not generalised (Units 12–19 have no package).
6. **Chunk size budget** for the lazy A2 chunk (≈ 190 kB gzip now).

## Status

A2 remains `planned`, `releasedLocales: []`, invisible (`isLevelVisible('A2') === false`, tested). Release validation fails on purpose (unit 20, level test, placement, sign-offs). Stopped after Unit 19; Unit 20 awaits approval.
