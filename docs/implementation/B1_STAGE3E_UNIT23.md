# B1 Stage 3E — Unit 23 (Arbeit, Bewerbung und Karriere): FINAL STATUS

B1 is still `planned`, `releasedLocales: []`, invisible (German interface never offered B1). No commit/push. No A1/A2 learning content, no Storage/Persistence code, no approved unit id or id convention was changed; Units 21 and 22 content was not rewritten. The 15 staged files are untouched (`git diff --cached --shortstat`: 15 files, 513 insertions, 103 deletions — identical to before). No CEFR approval, no native review of the Kyrgyz and no verified audio is claimed.

## 1. Summary
Unit 23 (`b1-arbeit-bewerbung`) is complete and wired into the existing B1 content module and metadata (no parallel implementation). No separate blueprint existed, so the structure was derived from the approved curriculum (`B1_CURRICULUM.md` Unit 23, `B1_CURRICULUM_V2_APPROVAL.md`, `curriculum.ts`) and the Unit 21/22 pattern. Curriculum finding: the curriculum's work vocabulary (Lebenslauf, Bewerbung, Arbeitsvertrag, Teilzeit, Vollzeit, Praktikum, Weiterbildung, Kündigung, Vorstellungsgespräch, Arbeitgeber, …) was **already taught in A2 Units 6/11/17**, so it is not repeated; the 40 new words are the free ones (checked by the project's lemma-overlap tool).

## 2. Files
**Created:** `src/data/b1/unit23/{unit,vocabulary,grammar,texts,assessment,meta}.ts`; `tests/b1/unit-23.test.ts`; `tests/b1/unit-23-integration.test.tsx`; this report.
**Modified:** `src/data/b1/b1-content.ts`, `src/data/b1/meta.ts` (Unit 23 added). Tests that said "Units 21 and 22" now include 23 (`b1-infrastructure`, `b1-approval`, `b1-profile` [flags 33 → 34], `unit-21`, `unit-21-audit`, `unit-22`). No shared UI or CSS was changed in this stage.

## 3–8. Content
* **Vocabulary:** 40 items `v23-1…40` (22 nouns, 9 adjectives, 9 verbs); none repeats an A1/A2/Unit 21/Unit 22 lemma; no verb needs a prepositional object; no example uses an adjective without article.
* **Grammar (approved allocation, nothing else):** `b1-relativsaetze-nom-akk` (P/H: pronoun gender from the antecedent, case from the role — Nominativ and Akkusativ only) and `b1-infinitiv-mit-zu` (P/M: zu + Infinitiv, separable verbs `aufzustehen/einzureichen`, `um … zu`; `ohne … zu` and `statt … zu` **receptive only**, glossed in one reading, never in a task/test/hint/checklist). Not taught: relative clauses with a preposition/Dativ (Unit 29), `damit` (30), Passiv, Konjunktiv II, Genitiv, adjectives without article (24), verb + preposition (28).
* **Texts:** readings 128 and 127 words (band 120–180); listening 155 (14 lines) and 142 (13 lines) words (band 120–160; browser text-to-speech, playback unverified); sentences ≤ 24, p95 ≤ 18 (tested). Reading 1 = job ad + application; reading 2 = a career story; listening 1 = job interview; listening 2 = phone call to the personnel department (sick note, interview postponed). Speaking = 6-turn interview with an unexpected interruption in turn 4 and "gain time" repair chunks. Writing = formal application letter, `minWords` 80, model 86 words, six checklist items each explained in ru and ky.
* **Exercises:** 10 = 3 fill / 5 choice / 2 order; 8 on concepts (4 + 4), 2 recycled A2 (adjective endings, Perfekt of a separable verb); one text-level item (ex 04).
* **Assessment:** `unit-23`, 15 questions = 8 grammar (3 + 3 on the concepts, 2 recycled A2: `a2-adjektivendungen-definit`, `a2-reflexive-verben`) / 3 vocabulary / 4 reading / 0 listening; answer positions 5/5/5, never three in a row; each answer appears exactly once; pass mark 70 % (11 of 15) by the existing rule. Speaking/writing feedback is a checklist + self-assessment, no numeric score.
* **Revision:** 4 words of Unit 22, 2 of Unit 20, 2 of A2 (Unit 17) — real ids, tested.
* **RU/KY:** every learner-facing string has both, independently written; Kyrgyz avoids invented grammar labels (it describes the idea; one slip «жакталган» was caught while authoring and removed). **Kyrgyz is an unreviewed AI draft.**

## 9. Browser QA (real app in Chromium via Playwright; B1 switched to Beta in the page only, never in files)
* **Russian and Kyrgyz, 390 px and 1280 px:** all 14 Unit 23 routes (unit, vocabulary, 2 topic pages, 2 grammar pages, 2 listenings, 2 readings, writing, speaking, unit test, review) render; none "not found"; no `undefined`/`NaN`; **no console error; no page-level horizontal scroll**.
* **Flows verified in all four combinations:** reading and listening question phases (answer → feedback + continue; a wrong answer shows the continue step); writing: model text 86/80 words, all seven result lines ticked, each element's explanation shown in the learner's language, self-assessment shown, no score bars, no percentages; speaking: 6 turns, expected-word coverage each turn, ending with disclosure + self-assessment, no score; unit test: wrong answers show their explanation, the result is correct (12/15 = passed at 390 px; 11/15 = 73 % passed at 1280 px) and the weak-topic chips (long B1 titles) no longer overflow (the Stage 3D fix holds).
* **No new defect found in the browser**, so no new regression test was needed; the integration test (17 tests) covers the same routes and flows in jsdom.
* Not verified: real speech synthesis/microphone, other browsers/devices, screen readers.

## 10–11. Automated checks (actual results of the final run)
| Check | Result |
| --- | --- |
| Full test suite | **87 files, 2409 tests passed** |
| `content:validate` | 0 errors, 0 warnings, 34 review flags (31 A2 beta-review + CEFR sign-off of Units 21, 22, 23) |
| release gate | 44 errors (expected: B1 not released) |
| typecheck | 0 errors |
| lint | 8 warnings (existing baseline), 0 errors |
| format:check | clean |
| production build | succeeds |
Defects found by the guards while authoring (all fixed, none weakened): exercise 03/07 word lists were already in the solved order; reading 2 and the writing model were under the length targets; a review flag for a Kyrgyz word identical to Russian («карьера»); two too-short Kyrgyz glosses; my own scope guard wrongly flagged `, um den` (a purpose clause) as a relative clause with a preposition (rule narrowed) and the fixed closing «Mit freundlichen Grüßen» (exempted as a formula). A first full run reported one TypeScript error in my new test (`x.ky` possibly undefined), fixed.

## 12. Remaining human review
1. Independent CEFR review of the unit (validator flag `cefr-signoff-missing units:23`); no CEFR approval is claimed.
2. Native Russian and Kyrgyz review — all Kyrgyz, in particular the descriptive explanation of the relative clause and of zu/um … zu, and the work vocabulary translations.
3. German-language review by a teacher (naturalness of the interview and phone dialogues; the register of the application letter).
4. Real-device check of text-to-speech playback (no assessment item depends on audio).
5. Owner confirmation that A2 Unit 17 already covering the curriculum's listed work words is acceptable (they were replaced by free vocabulary rather than repeated).

## 13–15. Confirmations
B1 remains hidden (`planned`, `releasedLocales: []`; German never offered B1). A1/A2 content, Storage/Persistence and the 15 staged files are untouched. No commit or push was made.
