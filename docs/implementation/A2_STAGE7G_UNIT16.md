# A2 Stage 7G — Unit 16 implementation report

Unit 16 *Freizeit, Medien und Kultur* is authored as production data (`src/data/a2/unit16/`) and wired additively into the A2 modules. A2 stays `planned`/invisible; units 17–20 are empty; nothing is committed. No human review has taken place (`A2_REVIEWS = {}`): all German, Russian and Kyrgyz is an AI-assisted first draft.

Decisions applied, deviations from the Stage 7B design, grammar limits, genre variety, the objective→assessment matrix and the receptive list: `docs/authoring/A2_UNIT16_DESIGN_NOTES.md`. Kyrgyz terminology doubts: `docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md` §9.

## Decisions of the Stage 7G brief — how they were applied

| Decision | Result |
| --- | --- |
| Adjective endings without an article stay receptive | none taught or used in tasks (tested); one quoted exhibition title on the poster (*Fotos aus aller Welt*) is the only exception, as a fixed title |
| No *eins / keins* in Unit 15 | Unit 15 untouched; the forms do not occur in Unit 16 either (tested) |
| *Ich hätte gern* / *Wie wäre es mit …?* as fixed expressions | `hätte` only in *hätte gern*, `wäre` only in *Wie wäre es mit*; no explanation, no *Konjunktiv* term (tested) |
| Informal communication in Units 16 and 18 | Unit 16: L1 (friends, *du*), S1 (colleague, *du*), the grammar dialogues and W1 are informal; Unit 18 is not yet authored |
| No repetition of the formal e-mail / telephone-call pattern | **no telephone call and no e-mail in the unit**: L2 is a ticket-counter conversation, W1 a forum comment (tested) |
| Review tooling not generalised | untouched; no Unit 16 review package |

## Content

| Item | Result |
| --- | --- |
| Vocabulary | 36 = the approved map exactly (33 productive, 3 receptive: *Mannschaft, herunterladen, online*) |
| Grammar | 3 concepts, each capped: *gern – lieber – am liebsten* (with *lieber … als*, *besser als* recycled), **six named verb–preposition pairs** with Akkusativ (*interessieren für, freuen auf / über, warten auf, sprechen über, denken an*), ordinals 1.–31. in dates only |
| Listening | 2 (friends plan the weekend, informal; ticket counter, formal) |
| Reading | 2 (events poster, non-continuous; blog text about media habits) |
| Speaking | 1 (a colleague, *du*, 4 turns: preferences, plans, a date, an opinion) |
| Writing | 1 (informal forum comment, ≥ 50 words, 6 required elements: date with ordinal, subject, opinion, preference, verb + preposition, recommendation) |
| Wiederholung | 8 independent exercises (3 fill / 3 choice / 2 order; concepts 3 / 3 / 2) |
| Abschlusstest | 15 independent questions (7 grammar / 3 vocabulary / 5 reading and communication), positions 5 / 5 / 5, never three in a row |
| Localisation | independent Russian and Kyrgyz for every field; no fallback; none identical |

## Files

**Created:** `src/data/a2/unit16/{vocabulary,grammar,texts,assessment,unit}.ts` · `tests/content-validate/unit-16.test.ts` (45 tests) · `docs/authoring/A2_UNIT16_DESIGN_NOTES.md` · this report.
**Modified (additive wiring, Units 11–15 content untouched):** `src/data/a2/{units,vocabulary,grammar,listening,reading,speaking,writing,exercises,tests,instructions,provenance}.ts` (Unit 16 import + spread; `provenance.ts` adds `UNIT_16_SOURCE`) · `docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md` (new §9, append only).
**Modified (tests only):** assertions that fix the set of authored units were updated from "11–15" to "11–16" (`unit-11` … `unit-15`, `infrastructure`, `metadata`, `catalog`, `lazy-level`); the `catalog` isolation fixture now uses the temporary unit 17. No content assertion of an earlier unit was changed.
**Not touched:** A1 data and code, Units 11–15, the Stage 7B documents, the validator and the review tooling. (Prettier was run only on the specific test files this stage touched; the working tree again shows only the two test files that were already modified before this work, `tests/i18n.test.ts` and `tests/pwa/fakes.ts`.)

## Results

| Check | Result |
| --- | --- |
| Full tests | 64 files, **1746 pass** (before: 63 / 1701; +45 unit-16 tests, +1 file) |
| Unit 16 tests | 45 pass: completeness, vocabulary-map equality and order, productive/receptive split, RU/KY parity and independence, genre variety, grammar limits (fixed expressions, the closed set of six pairs, ordinals only in dates and never above 31, ending of every attributive adjective), reading translation-leak rules, receptive-vocabulary rules, counts, answer positions, matrix, boundaries |
| `content:validate` | 0 errors, 0 warnings, 6 review flags (missing sign-offs of units 11–16) |
| `content:validate:release` | fails as required (exit 1) |
| A1 regression oracle, level scoping, navigation, PWA, lazy loading, data | 25 files / **412 tests pass** (same as Stages 7D–7F) |
| Units 11–15 unchanged | review-package fingerprints identical: U11 `502db4af8249` / `dd636659c06f`, U12 `4b6f9b8dcf73` / `3a8c03023e72`, U13 `c99778902721` / `fc311c5a7e08`, U14 `d932881835ec` / `39b892b0a8a1`, U15 `12d4f84dfbf1` / `9bbdddbf1eba` (locked in the unit-16 test) |
| `tsc` | clean |
| ESLint | 0 errors, 8 pre-existing warnings |
| Prettier | `tests/content-validate` and `scripts` pass |
| Boundaries | 5 baseline violations, 0 cycles (unchanged) |
| Build (`build:ci`) | passes (the build step itself takes ≈ 2 s; the first full QA command exceeded the tool's 2-minute limit because of the test suite) |

## Bundle (file bytes, `wc -c`; gzip -9)

| | raw | gzip |
| --- | --- | --- |
| A1 entry bundle | 579 763 (**identical to Stages 7C–7F**) | 181 871 |
| A2 chunk (units 11–16) | 502 318 | 129 799 |
| A2 chunk (units 11–15, Stage 7F) | 416 638 | 109 159 |
| Unit 16's share (difference) | ≈ +85.7 kB | ≈ +20.6 kB |

The chunk is `lazy` in `pwa-build.json`, not precached. Unique Unit 16 strings (*Kulturwoche im Stadtpark*, `a2-ft-16-01`, *Mein Handy und ich*, *An der Kinokasse*) occur only in the A2 chunk. At ≈ 21 kB gzip per unit the finished A2 chunk will be ≈ 210 kB gzip; the size-budget question of Stage 7F is still open.

## Warnings and honest caveats

* All content is an AI draft. The CEFR level of the German (the poster abbreviations, the date ordinals, the blog text, the forum comment) and every Kyrgyz string need human review; the loan-word brackets in Kyrgyz are a validator workaround that a native reviewer may prefer to replace by plain loan words (§9.3 of the glossary).
* The **dates** (*am dritten Mai*) are the first place where the Dativ ending *-n* is used on an adjective-like word after a preposition; it is taught only as part of the date pattern and is not generalised (the adjective-ending tests still forbid any other adjective after a Dativ preposition).
* The sixth verb–preposition pair (*sich freuen über*) is derived from the design's "freuen auf / über"; the grammar progression lists five. *denken an* uses a verb that is not in the approved vocabulary map (it is a verb–preposition pair of the grammar concept, glossed there).
* *Hast du Lust?* occurs once as a chunk (FT 13); *Lust haben auf* is not taught.
* A CEFR heuristic of the validator flagged one comma-joined clause in L2 (*Am vierten Mai, das ist ein Samstag*) as a possible *Relativsatz*; it was rewritten as two sentences (a good sign that the heuristic works, not a defect).
* The **review package was not generated** (decision of this stage).

## Outstanding terminology and pedagogical questions

1. **Ordinals above 31 and the form *der Wievielte*** are excluded; confirm that dates only up to 31 are enough for A2 (years and larger numbers are cardinals).
2. **Unit 17 and later:** the Kyrgyz way to write ordinals in dates (*3-май*) is used in translations; confirm with the native reviewer before it is applied to Units 18 and 20.
3. **Informal speaking in Unit 18** (decision of this stage) still has to be planned: the design's S1 of unit 18 is a formal travel-agency scenario.
4. **Loan words in Kyrgyz:** whether to keep the short brackets or allow-list single loan words in `SAME_AS_RU` (glossary §9.3).
5. **Verb–preposition set:** confirm the six pairs; decide whether the Stage 7B grammar progression (five listed) should be updated separately.
6. **Review tooling:** still not generalised (Units 12–16 have no package).
7. **Chunk size budget** for the lazy A2 chunk.

## Status

A2 remains `planned`, `releasedLocales: []`, invisible (`isLevelVisible('A2') === false`, tested). Release validation fails on purpose (units 17–20, level test, placement, sign-offs). Stopped after Unit 16; Unit 17 awaits approval.
