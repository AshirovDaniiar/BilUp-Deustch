# A2 Stage 9A — assessment architecture audit (Level Test and Placement Test)

Audit and plan only. **Nothing was implemented or changed** (no source, data, content, visibility, release status, A1, tutor or review file). Design proposal: `docs/authoring/A2_ASSESSMENT_DESIGN.md`. Evidence for the findings: code reading plus two throw-away probe tests (deleted) — the catalog state before the A2 chunk is loaded, and the counts of the authored A2 banks.

## 1. What is actually implemented

| Area | Finding |
| --- | --- |
| Test definitions (`src/data/types.ts` `TestDef`, `src/data/reallife.ts` `TESTS`) | kinds `placement`, `level`, `topic`, `grammar`, `vocabulary`, `listening`, `speaking`(unused). A1 has: `placement` (12), `level-a1` (15), `grammar` (12), `vocabulary` (15), `listening` (8) and `unit-1…10` (8 each). A1 titles: `ky` exists for placement/grammar/vocabulary/listening, **not** for `level-a1` or the unit tests |
| Question engine (`src/features/tests/questions.ts`) | **Builds questions from the level's exercise / vocabulary / listening pools at random** (`buildTest`). Level test (`default` branch) = ½ exercises + ⅜ vocabulary questions + article drill; topic test = `unitReviewQuestions` (random vocabulary + exercises of the unit) |
| Placement | **An A1 placement exists**: 12 A1 exercises in three bands relative to the level's first unit (units 1–4 / 5–7 / 8–10), `placementBand(pct)`: < 35 % `A1-start`, < 75 % `A1-A2`, else `A2`. The result card reads "A1 · start / A1 · A2 / A2 →" if A2 is available to the learner, otherwise "A1 · start / A1 / A1 ✓". It cannot assess A2 and has no "insufficient evidence" outcome |
| A2 placement | **Not implemented**: `A2_PLACEMENT_ITEMS = []` (type `A2PlacementItem` with `band` low/mid/high exists; the validator reports "placement-empty" and requires ≥ 6 items in three bands once any exist) |
| A2 level test | **Not implemented**: no `level-a2` definition (the validator reports a missing level test as `unit-minimum`; it is an error in release mode) |
| Scoring and pass logic | `QuizRunner` scores per question (exact normalised match), builds `bySkill / byConcept / bySection`; `summarise()` gives `pct`, `weak`, `strong`. Pass = **70 %** for `assessment` activities (`src/progress/policy.ts`, `passThreshold 0.7`); a passed unit test completes `${unit}:test` |
| Persistence | `UserProgress.tests: { id, at, pct, weak, strong }[]`, appended by `actions.addTest`, **capped at the last 50 entries**, merged by `${id}|${at}` across devices (`merge.ts`). No per-skill scores, no outcome, no blueprint version |
| Catalog and navigation | A2 content is lazy; `testsOf('A2')`, `testIndex`, `finalTestOfUnit` are **empty until the A2 chunk is loaded** (probe: `testsOf('A2') = 0`, `finalTestOfUnit(11) = undefined`, `testIndex.get('unit-11') = undefined` before load) |
| Visibility | `levelOfRoute` maps `/practice/tests/:id` to `testIndex.get(id)?.level`; a route is accessible only if the level is available for the language; A2 is `planned`, `releasedLocales: []` → invisible |
| RU/KY | Interface: two dictionaries (`ru`, `ky`, `de`). A1 test questions are **Russian-only** (`vocabQuestion` prompts are hard-coded Russian; `Question` has `promptRu` but **no `promptKy`**; explanations use `tr()` which falls back to Russian). A2 content is strict (`ru` and `ky` mandatory, `trStrict` has no fallback) but the **test UI does not consume it** |
| Authored A2 tests | each unit has `A2_TESTS` definitions and `A2_FINAL_TESTS` (15 authored questions per unit, `promptRu`+`promptKy`, strict `why`); counts: **150 questions = 73 grammar + 30 vocabulary + 47 reading, all 27 A2 concepts covered, no listening items**; plus 20 listening dialogues (80 questions), 20 reading texts (60 questions), 80 exercises, **0 article exercises** |

## 2. Findings that the plan must resolve (gaps and risks)

1. **The authored A2 final tests are not used by the learner UI.** `finalTestOfUnit` is only a catalog selector; `buildTest` for a `topic` test calls `unitReviewQuestions`, i.e. a **random draw from vocabulary and revision exercises**. If A2 were released as is, a learner taking "Итоговый тест: юнит 11" would get a random review quiz (8–15 questions from the 8 exercises + vocabulary), not the 15 authored questions that the unit design, tests and review packages describe. (A1 behaviour is unchanged by design.)
2. **A2 tests are not routable by direct link before the chunk is loaded.** `levelOfRoute` resolves a test id through `testIndex`, which does not contain A2 tests until the chunk is loaded, so `/practice/tests/unit-11` resolves to "no owner level" and does not trigger the lazy load; `TestRunnerPage` then shows "not found" (`def` is missing). This matters for any `level-a2` / placement link. Resolution of test ids to levels must not depend on loaded content (the unit range and the fixed ids `level-a2` / `placement-a2` are static).
3. **`Question` cannot carry Kyrgyz.** No `promptKy`, `why` for vocabulary/listening/reading questions is hard-coded Russian, the runner shows `promptRu` only. A2 authored items would show Russian to Kyrgyz learners unless the question type, the builders and the runner become language-aware (strict, no fallback).
4. **Level-test composition rule is a validator decision.** Stage 6B agreed: "the level test is exactly one test definition per level, composed from the level's own pools, like A1's". A blueprint-based composition (the proposal) is compatible with a single definition but needs an explicit composition function; random pool draws (as A1) give no coverage guarantee and would mix exercise items the learner practised.
5. **Result retention conflicts with a level/placement result.** `tests[]` keeps 50 entries; a learner repeating unit tests can evict an earlier level or placement result. A result also needs per-part scores and an outcome, which the record cannot hold.
6. **A1 placement semantic gap.** Its top band says "A2 →", but the test has no A2 content; once A2 is visible this is an unsupported claim. It must lead to the A2 placement, not assert A2 readiness.
7. **Listening in tests is unverified.** Listening items use browser text-to-speech (`audio` field); the Stage 7B audit D-9 required technical verification before listening items enter final tests; the authored A2 finals contain none.
8. **XP and completion.** `assessment` pays XP per first-time correct answer and completes `${unit}:test`; the level test must not complete a unit section or change unit denominators (policy decision on XP).
9. **Review coverage.** The Stage 8A review system covers units 11–20 only; new level/placement items would need packages and records (an extension).
10. **Validator.** Placement items must be authored separately from finals/exercises (warning `placement-reuses-content`); level-test items taken from unit finals would be allowed (the rule compares finals with exercises and placement items), but must be declared.

## 3. Architecture assessment

The present architecture **can** support A2 assessment with modest, additive changes: definitions are data (`TestDef`), scoring is generic (`QuizRunner`), levels are scoped, visibility is enforced centrally, A2 content is lazy and strict, and the validator already has rules for a level test and a placement extension. It **cannot** support it unchanged: findings 1–3 and 5 are prerequisites, independent of the Level/Placement design, and should be fixed (and tested) before any new assessment content is authored.

## 4. Implementation plan (nothing started; each step behind the existing A2 invisibility)

| Step | Work | Gate / tests |
| --- | --- | --- |
| 0 | Prerequisites: (a) static test-id → level resolution (`unit-11…20`, `level-a2`, `placement-a2`) so a test link loads the chunk; (b) `Question` gets `promptKy` and a language-aware explanation; the runner shows the interface language, strict for A2 (no Russian fallback); (c) A2 topic tests are built from `finalTestOfUnit` (authored, option order randomised per attempt) instead of `unitReviewQuestions`. A1 output byte-identical | A1 regression oracle; new tests for 0a–0c; A2 still invisible |
| 1 | Decisions of the design document §5 (owner) | — |
| 2 | Data: `level-a2` definition + blueprint; the 4 new E-part items; the 24 new placement items (RU/KY strict); instructions and result texts (RU/KY dictionaries) | validator (counts, bands, separation, positions); coverage-matrix test |
| 3 | Engine: pure functions `buildLevelTest(blueprint)`, `buildPlacementA2()`, `levelOutcome(scores)`, `placementOutcome(bands, dk)`; unit tests for every rule and boundary | deterministic with a seed |
| 4 | Storage: optional fields on the test record (`kind`, `blueprint`, `parts`, `outcome`, `dontKnow`, `seconds`) + retention that never evicts level/placement results; migration/merge tests | storage tests (merge by `id|at`) |
| 5 | UI: tests list shows `level-a2` / placement only when A2 is available for the language; result screens (three placement outcomes, level result by part, the "not a certificate / speaking and writing not measured" statement); A1 placement top band offers the A2 placement when A2 is visible | navigation/placement-label tests extended; a2-world |
| 6 | Human review: extend the review system with a "level/placement" package set (three dimensions); records `pending` | review tests |
| 7 | Pilot with real learners (calibration of thresholds), then a release decision — separate approval; **no link to `A2_REVIEWS` / the release gate is part of this plan** | — |

## 5. Verification performed in this stage

* Existing relevant tests, run unchanged: `tests/questions.test.ts`, `tests/data`, `tests/progress`, `tests/navigation`, `tests/regression`, `tests/storage`, `tests/store.test.tsx`, `tests/answer-order*.test.ts(x)`, `tests/content-validate.test.ts` → **37 files, 819 tests pass**.
* Probes (deleted afterwards) confirmed: the A2 test catalog is empty before the chunk loads; the A2 bank counts quoted above.
* No code, data or documentation other than the two new files was changed; A2 remains `planned` and invisible; nothing committed.

## 6. Open points (not decided here)

Reuse of unit-final items vs a fresh bank for the level test; listening in the first release; pass rule and XP; thresholds of the placement (provisional, uncalibrated); storage option; whether the German interface (no A2 text) gets A2 assessments at all (today A2 is not offered to the German interface).
