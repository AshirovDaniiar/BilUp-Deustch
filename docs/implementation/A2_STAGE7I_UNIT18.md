# A2 Stage 7I — Unit 18 implementation report

Unit 18 *Reisen, Urlaub und Mobilität* is authored as production data (`src/data/a2/unit18/`) and wired additively into the A2 modules. A2 stays `planned`/invisible; units 19–20 are empty; nothing is committed. No human review has taken place (`A2_REVIEWS = {}`): all German, Russian and Kyrgyz is an AI-assisted first draft.

Decisions applied, deviations from the Stage 7B design, grammar limits, the objective→assessment matrix and the receptive list: `docs/authoring/A2_UNIT18_DESIGN_NOTES.md`. Kyrgyz terminology doubts: `docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md` §11.

## Decisions of the Stage 7I brief — how they were applied

| Decision | Result |
| --- | --- |
| *als* in Unit 17 stays limited to one completed past event | Unit 17 untouched (fingerprints verified); Unit 18 uses no *als* conjunction at all (only the comparison *kühler als*) |
| `SAME_AS_RU` approved in principle; no validator change | **no validator, rule or allow-list file was changed**; Unit 18 needs no allow-list (no identical glosses, no artificial brackets; tested) |
| Meaningful informal communication | L2 (two friends plan the summer, *du*), S1 (informal talk with an acquaintance about a holiday, *du*), R2 (a postcard) and W1 (a postcard) are informal |
| Not all travel-agency interactions | **no travel-agency dialogue, no telephone call, no e-mail** in the unit: L1 is a station ticket counter (*Sie*), R1 a brochure (tested); the design's L1 (travel agency) and S1 (booking at an agency) were replaced |
| Previous units unchanged | fingerprints of units 11–17 locked in the unit-18 test |

## Content

| Item | Result |
| --- | --- |
| Vocabulary | 39 = the approved map exactly (33 productive, 6 receptive: *Prospekt, Reiseversicherung, Zoll, Fähre, Wettervorhersage, Grenze*) |
| Grammar | 2 concepts (the plan): destination prepositions *nach / in / an / zu / bei / aus / von* with the three countries with an article, and the future as present + time word with *werden* only in the weather chunk *Es wird …* |
| Listening | 2 (station ticket counter, *Sie*, incl. a short directions exchange; two friends plan the summer and the weather, *du*) |
| Reading | 2 (holiday brochure with price and programme; postcard from Turkey with a traffic jam, the border, a helper and a plan) |
| Speaking | 1 (informal: *Wie war dein Urlaub?* — Perfekt, the weather, the next trip with a time word) |
| Writing | 1 (informal postcard, ≥ 50 words, 6 required elements) |
| Wiederholung | 8 independent exercises (3 fill / 3 choice / 2 order; concepts 4 / 4) |
| Abschlusstest | 15 independent questions (7 grammar / 3 vocabulary / 5 reading and communication), positions 5 / 5 / 5, never three in a row |
| Localisation | independent Russian and Kyrgyz for every field; no fallback; none identical |

## Files

**Created:** `src/data/a2/unit18/{vocabulary,grammar,texts,assessment,unit}.ts` · `tests/content-validate/unit-18.test.ts` (47 tests) · `docs/authoring/A2_UNIT18_DESIGN_NOTES.md` · this report.
**Modified (additive wiring, Units 11–17 content untouched):** `src/data/a2/{units,vocabulary,grammar,listening,reading,speaking,writing,exercises,tests,instructions,provenance}.ts` (Unit 18 import + spread; `provenance.ts` adds `UNIT_18_SOURCE`) · `docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md` (new §11, append only).
**Modified (tests only):** assertions that fix the set of authored units were updated from "11–17" to "11–18" (`unit-11` … `unit-17`, `infrastructure`, `metadata`, `catalog`, `lazy-level`); the `catalog` isolation fixture now uses the temporary unit 19. No content assertion of an earlier unit was changed.
**Not touched:** A1 data and code, Units 11–17 content, the Stage 7B documents, **the validator, its rules and `reviews.ts`**, the review tooling. (Prettier was run only on specific test files; the working tree shows, among tests, only the two files that were already modified before this work, `tests/i18n.test.ts` and `tests/pwa/fakes.ts`; the three modified `scripts/content-validate/*` files were already modified at the start of the session.)

## Results

| Check | Result |
| --- | --- |
| Full tests | 66 files, **1839 pass** (before: 65 / 1792; +47 unit-18 tests, +1 file) |
| Unit 18 tests | 47 pass: completeness, vocabulary-map equality and order, productive/receptive split, RU/KY parity and independence (no identical glosses, no artificial brackets), genre variety, grammar limits (the pairs as taught; only three countries with an article; present + time word with the verb second; *wird* only in the weather chunk; no *als* conjunction, no *man*, no Konjunktiv II, no later connectors; adjective endings), reading translation-leak rules, receptive-vocabulary rules, counts, answer positions, matrix, boundaries |
| `content:validate` | 0 errors, 0 warnings, 8 review flags (missing sign-offs of units 11–18) |
| `content:validate:release` | fails as required (exit 1) |
| A1 regression oracle, level scoping, navigation, PWA, lazy loading, data | 25 files / **412 tests pass** (same as Stages 7D–7H) |
| Units 11–17 unchanged | review-package fingerprints identical: U11 `502db4af8249` / `dd636659c06f`, U12 `4b6f9b8dcf73` / `3a8c03023e72`, U13 `c99778902721` / `fc311c5a7e08`, U14 `d932881835ec` / `39b892b0a8a1`, U15 `12d4f84dfbf1` / `9bbdddbf1eba`, U16 `f75f46556cf7` / `3ee2c25167a6`, U17 `5725c4bc6a78` / `16cc2220e1f2` (the Unit 17 pair is recorded for the first time here) |
| `tsc` | clean |
| ESLint | 0 errors, 8 pre-existing warnings |
| Prettier | `tests/content-validate` and `scripts` pass |
| Boundaries | 5 baseline violations, 0 cycles (unchanged) |
| Build (`build:ci`) | passes |

## Bundle (file bytes, `wc -c`; gzip -9)

| | raw | gzip |
| --- | --- | --- |
| A1 entry bundle | 579 763 (**identical to Stages 7C–7H**) | 181 871 |
| A2 chunk (units 11–18) | 666 754 | 168 543 |
| A2 chunk (units 11–17, Stage 7H) | 589 574 | 149 711 |
| Unit 18's share (difference) | ≈ +77.2 kB | ≈ +18.8 kB |

The chunk is `lazy` in `pwa-build.json`, not precached. Unique Unit 18 strings (*Prospekt: Ferien an der Ostsee*, `a2-ft-18-01`, *Eine Postkarte aus der Türkei*, *Am Bahnhof: Ein Ticket kaufen*) occur only in the A2 chunk. With two more units the A2 chunk will be ≈ 205 kB gzip; the size-budget question is still open.

## Warnings and honest caveats

* All content is an AI draft. The CEFR level of the German (the postcard, the ticket-counter dialogue, the weather chunk) and every Kyrgyz string need human review.
* **Directions** (a stated focus of the brief) are covered only by a short exchange in L1 (*Gehen Sie geradeaus, dann links*, A1 material) and the example *Wie komme ich zum Bahnhof?*; there is no dedicated directions task, because the approved progression has no directions concept. If a stronger directions component is wanted, it needs a design decision.
* *werden* is productive only in the weather chunk (*Es wird …*); E8 and FT 05 test exactly that chunk. The design said "mainly receptive"; the chunk is the compromise.
* The fixed time expressions *Nächstes Jahr / Nächste Woche* contain an adjective without an article; they are exempted from the adjective-ending tests as fixed expressions (adjective endings without an article otherwise stay receptive).
* The comparison in FT 07 (*kühler als*) is the only use of *als*; it recycles unit 13.
* The **review package was not generated**; the `SAME_AS_RU` change was **not implemented** (approved in principle only).

## Outstanding terminology and pedagogical questions

1. **Directions:** accept the light coverage, or add a dedicated micro-task (for Unit 19, which has *Verkehr, Kreuzung, Schild*)?
2. **Weather chunk:** keep *Es wird …* productive (as implemented), or make it receptive and change E8 / FT 05?
3. **Kyrgyz:** the five items of glossary §11.3 (the contrast of the destination prepositions without suggesting a case-suffix rule, loan words vs. native descriptions, border / customs / driving-licence glosses, the provisional date form, *du / сен* register).
4. **Validator:** when to implement the approved `SAME_AS_RU` proposal (typed allow-list with reasons) — now that Units 12–18 are authored, and whether to revisit the brackets of Units 12–16.
5. **Review tooling:** still not generalised (Units 12–18 have no package).
6. **Chunk size budget** for the lazy A2 chunk.

## Status

A2 remains `planned`, `releasedLocales: []`, invisible (`isLevelVisible('A2') === false`, tested). Release validation fails on purpose (units 19–20, level test, placement, sign-offs). Stopped after Unit 18; Unit 19 awaits approval.
