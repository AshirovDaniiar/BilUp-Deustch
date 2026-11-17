# A2 Stage 7K — Unit 20 implementation report (the A2 capstone)

Unit 20 *Pläne, Einladungen und gemeinsame Entscheidungen* is authored as production data (`src/data/a2/unit20/`) and wired additively. **All ten planned A2 units (11–20) now exist.** A2 stays `planned`, `releasedLocales: []`, invisible; level test, placement and tutor content are empty; release validation still fails on purpose. Nothing is committed. All German, Russian and Kyrgyz is an AI-assisted draft; no human review is recorded (`A2_REVIEWS = {}`).

Details: `docs/authoring/A2_UNIT20_DESIGN_NOTES.md`; Kyrgyz doubts: glossary §13.

## 1. Unit 18 test repair (done first)

`tests/content-validate/unit-18.test.ts`: `/bwirdb/g` → `/\bwird\b/g` (the loop checking that every *wird* stands in the weather chunk) and `/d{3,}/g` → `/\d{3,}/g` (a number in a translated reading question must occur in the German question). Context read first; both checks now execute; 47 Unit 18 tests pass. No Unit 18 data touched.

## 2. Content

| Item | Result |
| --- | --- |
| Vocabulary | 37 = the approved map exactly (33 productive, 4 receptive: *ablehnen, Alternative, abstimmen, Kompromiss*) |
| Grammar | `a2-vorschlaege-verabredungen` (*Wollen wir…?, Lass uns…, Wie wäre es mit…?* as a fixed chunk only, *Ich schlage vor, dass…*, accepting / declining), `a2-absichten-plaene` (*vorhaben, wollen, möchten, planen*, time words), `a2-satzverbindungen-integration` (cumulative und/aber/oder/denn, weil/wenn/dass, deshalb; no new connector) |
| Listening | 2 (friends plan the weekend, *du*; colleague invited to a birthday, *Sie*) |
| Reading | 2 (invitation card; e-mails: decline, reason, alternative) |
| Speaking | 1 (negotiate a weekend plan with a friend, *du*) |
| Writing | 1 (informal invitation message, ≥ 60 words, 8 required elements) |
| Wiederholung | 8 independent exercises (3 fill / 3 choice / 2 order; concepts 3 / 3 / 2) |
| Abschlusstest | 15 independent questions (7 grammar / 3 vocabulary / 5 reading and communication), positions 5 / 5 / 5, never three in a row; concept items 4 / 3 / 2 |
| Localisation | independent RU and KY everywhere; none identical; no brackets |

Deviations from the 7B table (documented in the notes): no telephone framing in L1; final test uses the 7/3/5 composition of Units 17–19; *entweder … oder* not shown; dates written with digits.

## 3. Files

**Created:** `src/data/a2/unit20/{vocabulary,grammar,texts,assessment,unit}.ts`, `tests/content-validate/unit-20.test.ts` (49 tests), the two docs.
**Modified (additive):** `src/data/a2/{units,vocabulary,grammar,listening,reading,speaking,writing,exercises,tests,instructions,provenance}.ts`; glossary §13 (append).
**Modified (tests):** the "units 11–19 / unit 20 empty / release rejects unit 20" boundary assertions in `unit-11…19`, `metadata`, `infrastructure`, `catalog`, `lazy-level` now read 11–20 (release no longer reports a missing unit; the level test and sign-offs still fail it). The catalog isolation fixture now adds temporary *extra* items to unit 20 (no unused unit id remains in the A2 range). `tests/navigation/lazy-ux.test.tsx`: one fixed 600 ms wait before an assertion on the real chunk import became a polling wait (the chunk import now takes longer than 600 ms; 2 German tests failed reproducibly before, 11/11 pass after). No content assertion of an earlier unit was changed.
**Not touched:** A1, Units 11–19 content, the approved curriculum, validator, `reviews.ts`, review tooling, release status.

## 4. Results

| Check | Result |
| --- | --- |
| Full tests | 68 files, 1937 tests; the only failures (2, `lazy-ux`, German) were fixed as above and the file passes 11/11 — a final full-suite re-run was not repeated after that fix |
| `tsc` | clean |
| ESLint | 0 errors, 8 pre-existing warnings |
| `content:validate` | 0 errors, 0 warnings, 10 review flags (missing sign-offs of units 11–20) |
| `content:validate:release` | fails as required (exit 1) |
| A1 regression / level scoping / navigation / PWA / data | 25 files, 412 tests pass |
| Build | passes |
| Units 11–19 unchanged | fingerprints locked in the Unit 20 test; U19 `71fd78d8fd82` / `46eef58246ed` recorded now; U20 `cb4c73129f45` / `cefaa1a14030` (not locked yet) |

## 5. Bundle

| | raw | gzip |
| --- | --- | --- |
| A1 entry bundle | 579 763 (unchanged) | 181 871 |
| A2 chunk, units 11–20 | 844 176 | 211 218 |
| Unit 20's share | ≈ +87.8 kB | ≈ +20.8 kB |

The chunk was verified lazy / not precached at Unit 19; not re-checked separately for this build.

## 6. Caveats and human-review requirements

* Native Kyrgyz, Russian and CEFR review of all of Units 11–20 is outstanding; the invitation / refusal formulas and *Wie wäre es mit …?* need natural Kyrgyz counterparts (glossary §13.3).
* Hospitality customs are presented as German conventions (stated in the unit instruction).
* The `lazy-ux` test change shows the A2 chunk size now affects test timing; the chunk-size budget (≈ 211 kB gzip) is an open question.
* Not done, as instructed: SAME_AS_RU validator, review-tooling generalisation, bracket removal in Units 12–16, level test / placement / tutor content, release preparation.

Stopped after Unit 20.
