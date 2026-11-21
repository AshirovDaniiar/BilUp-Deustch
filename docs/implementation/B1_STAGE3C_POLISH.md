# B1 Stage 3C — Unit 21 final polish and Unit 22 preparation

B1 is still `planned`, `releasedLocales: []`, invisible. No commit/push. The 15 staged Storage/app/test files and the Storage/Persistence code, A1/A2 content and approved unit ids are untouched. No CEFR approval and no native-speaker review of the Kyrgyz is claimed. Audio is not claimed to work.

## Part A — shared B1 UI
| # | Change | How verified |
| --- | --- | --- |
| A1 | **Level-aware Beta notice.** New key `betaNoticeLevel` (ru/ky/de) with one `{level}` placeholder; `BetaNotice` renders it with the active level. The old `betaNotice` key is unchanged. | Test: for every language `betaNoticeLevel.replace('{level}','A2') === betaNotice` (A2 byte-identical); a B1 page shows "B1 · Beta." and no "A2"; an A2 page shows the original text; no approval wording. |
| A2 | **Kyrgyz audit.** A jsdom probe walked 16 B1 routes (incl. listening question phase and writing result) in `ky` and listed every Russian-identical string. | 38 keys were visible. |
| A3 | **Russian removed from the Kyrgyz B1 interface:** 48 keys given Kyrgyz in `ky.ts` (UNREVIEWED AI draft). Loanwords that are legitimately identical (Практика, Грамматика, Профиль, Диалог, Текст …) stay. Russian and German dictionaries untouched. | Test walks the same routes and asserts no remaining Russian-identical chrome. `kyIdenticalToRu` ratchet 119 → 71, `totalKeys` 317 → 318 (reasons recorded in `tests/i18n.test.ts`). |
| A4 | **Writing checklist localized.** `WritingTask.mustInclude[].explain?: L10n` (additive type). WritingLab shows the German label plus the explanation in the learner's own language only (strict ru/ky) on the task card and the result checklist. All 6 Unit 21 elements have ru+ky explanations. New validator rule `b1-checklist-localized` (B1 only) and parity pairs for the explanations. | Tests for ru and ky page + result; validator unit tests. |
| A5 | **A1/A2 preserved.** A2 writing tasks show no explanation (test), A2 notice identical, A2 content untouched. | tests above |

## Part B — Unit 21
* **Text-level exercise requirement solved inside the approved architecture** (no new exercise type, 10 exercises, 4+4+2 kept): `b1-ex-21-01` is now a `choice` that orders a three-sentence story (answer `2 – 3 – 1`); `b1-ex-21-05` asks which of three three-sentence stories is correct (distractors are real learner errors: verb not last after *bevor*, no inversion after the *bevor*-part). ru+ky prompts and explanations.
* **Slip caught by the scope guard:** my first instruction contained *damit* (a Unit 30 construction). Removed; the guard test stayed unchanged.
* Corrected content from 3B re-checked by the existing audit tests (keyword glosses, dialogue order, no forbidden Kyrgyz labels, answer positions) — all pass. Self-assessment untouched; its wrapping rule is asserted.
* **Proposal (not implemented):** a real sequencing/production exercise type or a text-level cap change would be an architecture decision for the owner.
* Test data updated only for moved content: `lazy-chunk.test.ts` used a Kyrgyz sentence from the replaced exercise (replaced by one still in the unit).

## Part C — Unit 22 blueprint
`docs/b1/B1_UNIT22_BLUEPRINT.md` — approved identity and band targets, scope guard, 40-word vocabulary plan (47 candidates verified free of A1/A2/Unit 21 lemmas by the overlap checker; 14 found already taught), grammar plan for the 3 concepts, 2 readings, 2 listenings, a 6-turn speaking scenario, writing task with localized checklist, 10-exercise table, 15-question final test, revision ids (verified to exist), RU/KY plan with candidate connector glosses, tests and authoring order. **Unit 22 is not authored.**
Open decisions for the owner/reviewer: **U22-1** the concept is named adjective *Dativ/Genitiv* but Genitiv phrases belong to Units 27/29 → proposed: Dativ/plural productive, Genitiv one receptive line; U22-2…5 listed in the blueprint.

## Part D — QA (actual results)
| Check | Result |
| --- | --- |
| Full test suite | **83 files / 2286 tests passed**. A first run showed 2 timeouts in `a1-world.test.tsx` under load (7 s vs 5 s default); passes alone (23/23) and in the full rerun. |
| `content:validate` | 0 errors, 0 warnings, 32 review flags |
| release gate | 44 errors (expected: B1 not released; unchanged) |
| typecheck | 0 errors |
| lint | 8 warnings (baseline), 0 errors |
| format:check | clean |
| build | succeeds |
New tests: `tests/b1/stage3c-polish.test.tsx` (15), 3 validator tests in `b1-profile.test.ts`.

## Remaining blockers / conditions
* **B-5** Kyrgyz review: now also covers the 48 new UI strings, the new checklist explanations and the Unit 22 connector glosses (all unreviewed AI drafts).
* **B-7** Audio unverified on real devices; lab limits from 3B remain (single voice, silent errors, no "no German voice" notice).
* **B-9** A2 feedback analyser limits; **B-12/B-13** unchanged.
* Kyrgyz translations of shared UI keys also change the Kyrgyz wording on A1/A2 screens for those keys (previously Russian placeholders); Russian and German unchanged.
* Unit 22 decisions U22-1…5 pending.
