# A2 Stage 7H — Unit 17 implementation report

Unit 17 *Schule, Ausbildung und Beruf* is authored as production data (`src/data/a2/unit17/`) and wired additively into the A2 modules. A2 stays `planned`/invisible; units 18–20 are empty; nothing is committed. No human review has taken place (`A2_REVIEWS = {}`): all German, Russian and Kyrgyz is an AI-assisted first draft.

Decisions applied, deviations from the Stage 7B design, grammar limits, the objective→assessment matrix, the receptive list and the **validator proposal**: `docs/authoring/A2_UNIT17_DESIGN_NOTES.md`. Kyrgyz terminology doubts and the provisional date form: `docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md` §10 (and the note appended to §9).

## Decisions of the Stage 7H brief — how they were applied

| Decision | Result |
| --- | --- |
| Ordinals limited to dates; no *der Wievielte?* | Unit 17 contains **no ordinal at all** (a test rejects ordinal words and ordinal dates; the design's title *Mein erster Arbeitstag* was changed to *Gestern habe ich angefangen* for this reason); *der Wievielte* not used (tested) |
| Kyrgyz date formatting provisional | recorded as provisional in the glossary (§10.3); no Unit 17 content depends on it |
| Grammar progression documentation: six pairs incl. *freuen über* | `docs/authoring/A2_STAGE7B_GRAMMAR_PROGRESSION.md`: Unit 16 row and risk row B1-4 now name the six pairs (documentation only; **Unit 16 content untouched**, fingerprints verified) |
| No artificial brackets around Kyrgyz loan words; inspect the validator, propose a narrow solution | no bracket in any Kyrgyz gloss of Unit 17 except the explanation of one German institution (*Berufsschule*); where both languages would use the same loan word, each gloss gives its own natural wording (a second sense or a native phrase), so no pair is identical (tested). The rule was inspected and a narrow proposal is written down (design notes §8); **nothing in the validator was changed** |
| Unit 18 must include a meaningful informal scenario | recorded as a requirement for Unit 18 (see open questions); not yet authored |

## Content

| Item | Result |
| --- | --- |
| Vocabulary | 37 = the approved map exactly (30 productive, 7 receptive: *Semester, Vorlesung, Fähigkeit, Weiterbildung, Arbeitnehmer, kündigen, Kündigung*) |
| Grammar | 2 concepts (the plan): `a2-deshalb-darum` (*deshalb / darum* with the verb in position 2 vs. *weil* verb-final) and `a2-wenn-als` (*wenn* present / future / repeated vs. *als* for **one** past event, capped to *war / hatte* or Perfekt) |
| Listening | 2 (short job interview, *Sie*; two colleagues talk about part-time work, *du*) |
| Reading | 2 (job ad; blog text *Gestern habe ich angefangen*) |
| Speaking | 1 (interview, applicant role, 4 turns, one reason with *weil* or *deshalb*) |
| Writing | 1 (short **profile for a job portal**, an *ich*-text, not an application e-mail; ≥ 50 words, 6 required elements) |
| Wiederholung | 8 independent exercises (3 fill / 3 choice / 2 order; concepts 4 / 4) |
| Abschlusstest | 15 independent questions (7 grammar / 3 vocabulary / 5 reading and communication), positions 5 / 5 / 5, never three in a row |
| Localisation | independent Russian and Kyrgyz for every field; no fallback; none identical |

## Files

**Created:** `src/data/a2/unit17/{vocabulary,grammar,texts,assessment,unit}.ts` · `tests/content-validate/unit-17.test.ts` (46 tests) · `docs/authoring/A2_UNIT17_DESIGN_NOTES.md` · this report.
**Modified (additive wiring, Units 11–16 content untouched):** `src/data/a2/{units,vocabulary,grammar,listening,reading,speaking,writing,exercises,tests,instructions,provenance}.ts` (Unit 17 import + spread; `provenance.ts` adds `UNIT_17_SOURCE`) · `docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md` (note under §9 and new §10, append only) · `docs/authoring/A2_STAGE7B_GRAMMAR_PROGRESSION.md` (Unit 16 verb–preposition row and risk row B1-4, as requested).
**Modified (tests only):** assertions that fix the set of authored units were updated from "11–16" to "11–17" (`unit-11` … `unit-16`, `infrastructure`, `metadata`, `catalog`, `lazy-level`); the `catalog` isolation fixture now uses the temporary unit 18. No content assertion of an earlier unit was changed.
**Not touched:** A1 data and code, Units 11–16 content, the Stage 7B curriculum design and vocabulary map, the validator and the review tooling. (Prettier was run only on specific test files; the working tree shows only the two test files that were already modified before this work, `tests/i18n.test.ts` and `tests/pwa/fakes.ts`.)

## Results

| Check | Result |
| --- | --- |
| Full tests | 65 files, **1792 pass** (before: 64 / 1746; +46 unit-17 tests, +1 file) |
| Unit 17 tests | 46 pass: completeness, vocabulary-map equality and order, productive/receptive split, RU/KY parity and independence (no identical glosses, no artificial brackets), genre, grammar limits (deshalb / darum followed by the verb; weil verb-final; every *Als* clause ends in *war / hatte / habe / bin …*; no ordinals, no *man*, no later connectors, no Konjunktiv II; adjective endings), reading translation-leak rules, receptive-vocabulary rules, counts, answer positions, matrix, boundaries |
| `content:validate` | 0 errors, 0 warnings, 7 review flags (missing sign-offs of units 11–17) |
| `content:validate:release` | fails as required (exit 1) |
| A1 regression oracle, level scoping, navigation, PWA, lazy loading, data | 25 files / **412 tests pass** (same as Stages 7D–7G) |
| Units 11–16 unchanged | review-package fingerprints identical: U11 `502db4af8249` / `dd636659c06f`, U12 `4b6f9b8dcf73` / `3a8c03023e72`, U13 `c99778902721` / `fc311c5a7e08`, U14 `d932881835ec` / `39b892b0a8a1`, U15 `12d4f84dfbf1` / `9bbdddbf1eba`, U16 `f75f46556cf7` / `3ee2c25167a6` (locked in the unit-17 test; the Unit 16 pair is recorded for the first time here) |
| `tsc` | clean |
| ESLint | 0 errors, 8 pre-existing warnings |
| Prettier | `tests/content-validate` and `scripts` pass |
| Boundaries | 5 baseline violations, 0 cycles (unchanged) |
| Build (`build:ci`) | passes |

## Bundle (file bytes, `wc -c`; gzip -9)

| | raw | gzip |
| --- | --- | --- |
| A1 entry bundle | 579 763 (**identical to Stages 7C–7G**) | 181 873 |
| A2 chunk (units 11–17) | 589 574 | 149 711 |
| A2 chunk (units 11–16, Stage 7G) | 502 318 | 129 799 |
| Unit 17's share (difference) | ≈ +87.3 kB | ≈ +19.9 kB |

The chunk is `lazy` in `pwa-build.json`, not precached. Unique Unit 17 strings (*Mechaniker gesucht*, `a2-ft-17-01`, *Paul arbeitet in Teilzeit*, *Kurzprofil*) occur only in the A2 chunk. The finished A2 chunk will be ≈ 210 kB gzip; the size-budget question is still open.

## The localisation validator and loan words (proposal only)

`checkPair` in `scripts/content-validate/rules/localization.ts` raises an **error** when Russian and Kyrgyz are equal and the text has two or more words or eight or more characters, and a **review flag** for a shorter single word; only a vocabulary word pair whose id is in `SAME_AS_RU` (empty today) is accepted. The narrow proposal (typed allow-list with a mandatory reason; vocabulary word glosses only; single token; existing id; reported as `info` with its reason; added by a person; native confirmation in release mode; tests that reject sentences, examples, unknown ids, missing reasons) is in design notes §8. Unit 17 did not need it: every loan word that both languages share received a natural, different gloss. Earlier units (12–16) still carry brackets for the same reason.

## Warnings and honest caveats

* All content is an AI draft. The CEFR level of the German (the job ad, the interview, the *als* sentences) and every Kyrgyz string need human review. **The placement of *als* at A2 is the open decision D-2**: the plan as written was implemented with strict limits; the audit's alternative (receptive *als* plus temporal prepositions for a CV, `a2-zeitangaben-lebenslauf`) was not applied because it needs a revision of the design documents.
* The CEFR heuristic `plusquam` (*war / hatte* + *ge-* participle within 40 characters) flags natural *als* sentences; the unit's *als* sentences use participles without *ge-* (*bekommen, beendet, angefangen, umgezogen*) — a defensible simplification, but a limit on the examples available for *als*.
* The Kyrgyz glosses avoid the loan words where a native phrase exists (*жамаат* for *Team*); whether native reviewers prefer the loans is open (glossary §10.4).
* The design's title *Mein erster Arbeitstag* was replaced because it contains an ordinal outside a date.
* The target task "phone about a vacancy" and the formal application e-mail of the design are not implemented (profile instead; no telephone call).
* The **review package was not generated**.

## Outstanding terminology and pedagogical questions

1. **D-2 (`als`)**: keep *als* productive as implemented, or revise the design to make it receptive and teach temporal prepositions for a CV (the audit's alternative)?
2. **Validator**: approve the narrow `SAME_AS_RU` proposal (design notes §8) so that genuine shared loan words can be glossed without brackets, and then decide whether Units 12–16 should be revisited in a separate stage.
3. **Unit 18**: the design's S1 is a formal travel-agency task; the brief requires a meaningful informal scenario — confirm that an informal planning conversation between friends (holiday plans) replaces or accompanies it.
4. **Kyrgyz**: the five items of glossary §10.4 (the *wenn* / *als* explanation, school-system terms, native phrases vs. loans, gender-neutral occupations, the provisional date form).
5. **Gender-neutral occupations**: the plan lists masculine forms; confirm that the feminine form in the examples (*Ingenieurin*) is enough.
6. **Review tooling**: still not generalised (Units 12–17 have no package).
7. **Chunk size budget** for the lazy A2 chunk.

## Status

A2 remains `planned`, `releasedLocales: []`, invisible (`isLevelVisible('A2') === false`, tested). Release validation fails on purpose (units 18–20, level test, placement, sign-offs). Stopped after Unit 17; Unit 18 awaits approval.
