# B1 Stage 3D — Unit 22 (Meinungen äußern und diskutieren): FINAL STATUS

B1 is still `planned`, `releasedLocales: []`, invisible. No commit/push. No A1/A2 learning content, no Storage/Persistence code, no approved unit id or id convention was changed. The 15 staged files are untouched (`git diff --cached --shortstat`: 15 files, 513 insertions, 103 deletions — identical to before). No CEFR approval, no native review of the Kyrgyz, no verified audio is claimed.

## 1. Summary
Unit 22 is complete and wired into the existing B1 content module and metadata (no parallel implementation). It follows the Unit 21 pattern and the Unit 22 blueprint. The scope guard (tests) caught and I fixed: adjectives without article, `statt`, a Genitiv expression, an adjective-less Genitiv in a quiz option.

## 2. Files
**Created:** `src/data/b1/unit22/{unit,vocabulary,grammar,texts,assessment,meta}.ts`; `tests/b1/unit-22.test.ts`; `tests/b1/unit-22-integration.test.tsx`; this report.
**Modified:** `src/data/b1/b1-content.ts`, `src/data/b1/meta.ts` (Unit 22 added); `src/features/tests/QuizPage.tsx` (one class name) and `src/styles/features.css` (one rule) for the mobile fix in §9; tests that said "Unit 21 only" (`b1-infrastructure`, `b1-approval`, `b1-profile`, `unit-21`, `unit-21-audit`) now say Units 21 and 22. `prettier --write src/data/b1` also reformatted Unit 21 data (formatting only).

## 3–8. Content
* **Vocabulary:** 40 items `v22-1…40`; no A1/A2/Unit 21 lemma; no verb needs a prepositional object.
* **Grammar:** `b1-konzessive-saetze` (P/M), `b1-doppelkonnektoren` (P/M; einerseits/andererseits and nicht nur/sondern auch receptive only, glossed in one reading), `b1-adjektive-dativ-genitiv` (P/L; Dativ and plural productive; **Genitiv is not taught or tested** — decision U22-1).
* **Texts:** readings 135 and 106 words; listening 137 and 118 words (browser text-to-speech, playback unverified); sentences max 20 / p95 13; speaking 6 turns (interlocutor objects first); writing minWords 80, model 85 words, six checklist items each explained in ru and ky.
* **Exercises:** 10 = 3 fill / 5 choice / 2 order; 8 on concepts (4+3+1), 2 recycled A2; one text-level item.
* **Assessment:** `unit-22`, 15 questions = 8 grammar (6 + 2 recycled A2) / 3 vocabulary / 4 reading / 0 listening; answer positions 5/5/5, never three in a row; pass 70 % (11 of 15) by the existing rule; feedback for speaking/writing is a checklist + self-assessment, no numeric score.
* **Revision:** 4 words of Unit 21, 2 of Unit 19, 2 of A2 (real ids).
* **RU/KY:** every learner-facing string has both, independently written; Kyrgyz avoids invented grammar labels; **Kyrgyz is an unreviewed AI draft**.

## 9. Browser QA (real app in Chromium via Playwright; B1 switched to Beta in the page only, never in the files)
* **Reading issue resolved:** not a defect — the reading screen shows the questions as a separate step (the "answer the questions →" button); my test assumed they were on the text page. The test now clicks that step, checks the question and options, answers and checks the continue button. It was not weakened or skipped.
* **Kyrgyz 390 px and 1280 px, Russian 390 px and 1280 px:** all 13 Unit 22 routes (unit, vocabulary, 2 topic pages, 2 grammar pages, 2 listenings, 2 readings, writing, speaking, unit test, review) render, none "not found", no `undefined`/`NaN`, **no console error, no page-level horizontal scroll** after the fix below.
* **Flows verified:** reading and listening question phase (correct answer → feedback + continue); writing (Kyrgyz, 390 px): 86/80 words, all six items ticked, each with a Kyrgyz explanation, self-assessment shown, no score bars or percentages; speaking: 6 turns, expected-word coverage each turn, ending with disclosure + self-assessment, no score; unit test: wrong answers show the explanation, 12/15 → passed ("Бөлүм эсептелди ✓"), 9/15 = 60 % → result with weak topics and recommended topics.
* **Defect found and fixed:** on the test **result** screen at 390 px a long B1 concept-title chip ("obwohl, trotzdem, zwar … aber — …") forced a horizontal scroll (scrollWidth 467 vs 390). Fix: scoped class `chip--wrap` (wraps, max-width 100%); re-measured 390 = 390. Regression test added.
* The tab strips on the grammar page scroll horizontally inside their own scroll container (existing design, not page overflow).
* On a repeat failing attempt the pass note is absent because `22:test` was already completed by my earlier passing run in the same browser profile — existing behaviour; the fresh-state failure case is covered by the automated test (10/15 → not passed).
* Not verified: real speech synthesis/microphone, other browsers/devices, screen readers.

## 10–11. Automated checks (actual results of the final run)
| Check | Result |
| --- | --- |
| Full test suite | **85 files, 2348 tests passed** |
| `content:validate` | 0 errors, 0 warnings, 33 review flags (31 A2 beta-review + Unit 21 and Unit 22 CEFR sign-off) |
| release gate | 44 errors (expected: B1 not released) |
| typecheck | 0 errors |
| lint | 8 warnings (existing baseline), 0 errors |
| format:check | clean |
| production build | succeeds |
Earlier in the session one full run showed 2 load-induced timeouts in an A1 test; it passed alone and in the full rerun. The final run above had none.

## 12. Remaining human review
1. Independent CEFR review of the unit (validator flag `cefr-signoff-missing units:22`); no CEFR approval is claimed.
2. Native Russian and Kyrgyz review — all Kyrgyz, in particular the connector glosses (obwohl, trotzdem, zwar … aber, je … desto, weder … noch, entweder … oder, sowohl … als auch, einerseits … andererseits) and the descriptive grammar explanations.
3. Real-device check of text-to-speech playback (no assessment item depends on audio).
4. Owner/reviewer confirmation of U22-1 (Dativ/plural productive, Genitiv not taught in this unit).
5. German-language review by a qualified teacher (naturalness of dialogues).

## 13–15. Confirmations
B1 remains hidden (`planned`, `releasedLocales: []`; German never offered B1). A1/A2 content, Storage/Persistence and the 15 staged files are untouched. No commit or push was made.
