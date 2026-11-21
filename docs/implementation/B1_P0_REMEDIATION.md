# B1 P0 Remediation — final `level-b1` assessment (form `b1-level-v2`)

B1 is still `planned`, `releasedLocales: []`, invisible. No commit/push. **P1, P2 and P3 work has NOT been started.** No CEFR, native-speaker or exam-expert validation exists or is claimed; every new German and Kyrgyz item is an unreviewed AI-assisted draft.

## 0. Scope decision (read first)
`B1_FINAL_AUDIT.md` §9 states "**P0 — none blocks anything today**"; the assessment findings were filed there as **P1** (item 3). This task's brief, however, lists exactly those assessment defects as the P0 scope. I followed the brief: the **six assessment defects it names are the P0 set**. Nothing else from the audit was touched (text calibration, decisions D-1…D-14, vocabulary gaps, KY glossary, the PWA-banner layout fix, device TTS, listening items, validator rules — all remain P1–P3 and are listed in §9 as not started).

## 1. P0 findings addressed
| # | Defect (audit §6.1 / brief) | Before | After | Regression tests |
|---|---|---|---|---|
| 1 | Only 13 of 29 concepts tagged | 13 / 29 | **29 / 29**: one part-B item per concept of Units 21–31 (27) + 3 word-order items carrying the two Unit-32 concepts | `DEFECT 1` (4 tests) |
| 2 | Reading passages 36–46 words | 5 passages, 13 items | **3 new passages of 90, 87, 82 words**, 4 items each (80–130 enforced) | `DEFECT 2` (3 tests) |
| 3 | Practical section only 4 items | 4 | **8** (register, refusal, complaint, repair, mediation, advice, concession, polite request) | `DEFECT 3` |
| 4 | Answer-length bias | correct option strictly longest in 17/37 choice items (46 %); part E 4/4, part C 7/13 | **13/57 (23 %)**; A 2/10, B 4/27, C 3/12, E 4/8; strictly shortest 14/57 (25 %) | `DEFECT 4` (6 tests) |
| 5 | Guess-based pass too likely | 40 % per part; per-part guess-pass 35 / 31 / 24 / **41 %**, all four 1.1 % | **50 % per part**; A 0.21, B 0.04, C 0.18, E 0.26 (each ≤ 0.30); all four together 0.04 %; "almost" by guessing 0.05 %, "reached" 7·10⁻⁹ | `DEFECT 5` (6 tests) |
| 6 | Success reported without listening evidence | band "Цель курса B1 достигнута" | bands qualified **"по проверенным частям"**; the card always shows a **listening note** | `DEFECT 6` (3 tests) + 3 integration tests |
| – | Unit assessments "similar bias" (brief) | audit said 45 % | **Not a defect once measured correctly** — see §3 | guard test added |

## 2. Assessment changes
* **Form:** 60 items (was 40): **A Wortschatz 10 · B Grammatik & Satzbau 30 · C Lesen 12 · D Hören 0 · E Praktische Sprachverwendung 8**. ID `level-b1` unchanged; item ids `b1-lt-01…60` re-issued; stored-result blueprint bumped `b1-level-v1` → **`b1-level-v2`** (documented migration: no stored data refers to item ids, only to the blueprint, the part tallies and the outcome code; B1 is unreleased so no learner data exists).
* **Why 60:** covering all 29 concepts requires ≥ 29 grammar items; a 40-item form could not also hold a defensible practical section. **This changes the "40-item" size of the approved plan; it is recorded as awaiting owner/expert confirmation (§8).**
* **Grammar & Satzbau:** every concept has one item at the proficiency the curriculum gives it (the receptive Genitivattribut is tested by *comprehension* only; Futur I as conjecture; Nomen-Verb on the closed list; Zustandspassiv on a participle of the closed list). No B2, receptive-only or forbidden construction appears (tested).
* **Reading:** fictional texts "Der erste Tag im neuen Büro" (Präteritum/Plusquamperfekt/Konnektoren), "Nachricht vom Kundendienst" (formal, Falls/Sobald/Wenn, Passiv), "Aushang im Hof" (Erstens/Zweitens/Außerdem, damit). Per passage: 2 multiple-choice + 2 statements (richtig / falsch / steht nicht im Text; 2 of each over the part). Every correct answer is supported by the text, no distractor is (tested).
* **Distractors:** options of one item have comparable length (sentence options within a factor of 1.45), come from realistic learner errors (wrong case/tense/connector/register) and are never grammatical alternatives to the answer.
* **Positions:** correct option 17/17/17 over the 51 choice items (statements 2/2/2 by their fixed order); never three equal in a row (tested).
* **Scoring (transparent, unchanged mechanics):** reached = ≥ 70 % overall **and ≥ 50 % in every part** (was 40 %); almost = ≥ 55 % overall; otherwise repetition. The card still shows the band and every part's result. The 50 % threshold is a provisional, **uncalibrated** change from the approved 40 %.
* **Listening:** **no listening item was added.** The absence is a **technical limitation** (browser speech output is not verified on real devices), explicitly **not an educational judgement**; the card says so in ru and ky ("Причина техническая … Это не значит, что аудирование менее важно") and each of the top two bands says "по проверенным частям / текшерилген бөлүктөр боюнча". Part D stays empty until device verification (that decision is P3).
* **Honesty:** the fixed statement (indicative progress check, not a certificate, no exam prediction, no speaking/writing) and the companion note are unchanged; no Goethe/telc/TestDaF/ÖSD/CEFR/Zertifikat string occurs in the assessment, bands, notes or card (tested).

## 3. Correction of an audit finding (evidence)
The audit reported unit-test answer-length bias of 81/180 = 45 %. That count used a "longest" test that **counted ties** (and one-word options), so it overstated the bias. Measured **strictly** (correct option strictly longer than both distractors): **unit tests 62/180 = 34 %** (≈ the 33 % chance baseline; of the 92 questions with options ≥ 12 characters: 35 = 38 %) and **choice exercises 7/50 = 14 %**. The brief's "unit assessments exhibit a similar bias" is therefore **not confirmed**, and **no unit test or exercise was rewritten** (the brief forbids rewriting units unless a finding requires it). A regression test now locks the strict rates (≤ 40 % for unit tests and exercises) so any future drift is caught. The level-assessment bias **was** real (46 % strict; E 4/4) and is fixed. (`B1_FINAL_AUDIT.md` itself is not edited; this section is its erratum.)

## 4. Files changed
**Rewritten:** `src/data/b1/level-test.ts` (60 items, bands, notes, thresholds, `size: 60`), `tests/b1/level-b1.test.ts` (32 tests).
**Edited:** `src/data/b1/types.ts` (new required `listeningNote` on `B1LevelAssessment`), `src/features/tests/LevelResultCard.tsx` (renders the listening note, `data-testid="level-listening-note"`), `src/features/tests/levelAssessment.ts` (blueprint `b1-level-v2`; comment), `tests/b1/level-b1-integration.test.tsx` (60 items, v2, listening note, new "52/60 → almost" case), `tests/b1/unit-32.test.ts` (one comment).
**Not touched:** A1/A2 content and test behaviour (the authored-level path in `buildTest` applies only to levels that supply `levelTest`), Storage/Persistence, i18n dictionaries, CSS, unit data of Units 21–32, the validator and the release gate, the 15 staged files.

## 5. Regression tests (all new, in `tests/b1/level-b1.test.ts` unless stated)
Structure (60 items, parts 10/30/12/0/8, size = authored count, ≥ 3 order items, statements 2/2/2) · DEFECT 1 concept coverage (29/29, 27+3 structure, receptive item has no gap, all units covered, 10 vocabulary units) · DEFECT 2 passage length and item count, fictional markers and unique ru/ky instructions, answer support in the text · DEFECT 3 practical section contents · DEFECT 4 strict longest ≤ 40 % overall and ≤ 50 % per part, shortest ≥ 15 %, option-length ratio ≤ 1.45, unit tests/exercises ≤ 40 %, position balance and run-length · DEFECT 5 thresholds, per-part and joint guess probabilities (computed binomially in the test), band logic at the boundaries (42/60, E 3/8 vs 4/8, A 4/10) · DEFECT 6 no D items, the technical-reason wording in ru/ky, qualified band wording · independence from unit tests/exercises, no CEFR/Goethe/telc strings, no forbidden constructions, B1 planned + validator 0/0. Integration (`level-b1-integration.test.tsx`, real runner in jsdom): 60/60 → reached, 52/60 → almost (E = 0/8), 0/60 → repeat, listening note and stored `b1-<band>` + `b1-level-v2`.

## 6. QA results
* **Full Vitest:** 107 files, **3266 tests, all passed** (was 3249).
* **TypeScript:** clean. **Lint:** 0 errors, 8 baseline warnings. **Format check:** clean. **Production build:** succeeds.
* **`content:validate`:** 0 errors, 0 warnings, 53 review flags (unchanged). **`content:validate:release`:** 43 errors (unchanged; all legitimate, see the audit §8). The release gate was not changed.
* `git diff --cached --shortstat`: **15 files, 513 insertions, 103 deletions — unchanged.**
* **A1/A2:** the full suite incl. all A1/A2 assessment, `answer-order` and level-scoping tests passes unchanged.

### Browser QA (real Chromium via Playwright, Vite dev server, B1 switched to Beta in the page only; the server was stopped afterwards)
The full 60-item `level-b1` flow including the three word-order items and the result card:
| Language / width | Answers | Result |
|---|---|---|
| ru, 1280 px | 60/60 right | band **reached** "Цель курса B1 по проверенным частям достигнута"; parts A 10/10, B 30/30, C 12/12, E 8/8; listening note, statement shown; no overflow; no console error |
| ky, 390 px | first 52 right (E 0/8) | band **almost** (overall 87 %, part E below 50 % blocks "reached"); Kyrgyz band text "…дээрлик аткарылды"; listening note shown; no overflow; no error |
| ru, 390 px | first 30 right (C 0/12) | band **repeat**; no overflow; no error |
| ky, 1280 px | 60/60 right | band **reached** "…текшерилген бөлүктөр боюнча аткарылды"; no overflow; no error |
**Not verified:** the real-device or screen-reader behaviour of the card, other browsers (Safari/Firefox/Edge), real speech output (not relevant to this form because no listening item exists), and the PWA banner on this flow — in the 390 px runs the install notice appeared and was dismissed by the script before each click (the known issue is unchanged; fixing it is P2). Unit pages and other flows were not re-run in Chromium because they were not changed.

## 7. Before/after evidence
Measured with `scratchpad` scripts over the real data (strict longest = the correct option is longer than both distractors): old 17/37 (46 %), E 4/4, C 7/13, reading passages 36/36/44/46/38 words, concepts tagged 13/29, practical items 4, per-part guess-pass 35/31/24/41 %; new 13/57 (23 %), E 4/8, C 3/12, passages 90/87/82, 29/29, 8, per-part ≤ 0.26 and joint 0.04 %.

## 8. P0 items awaiting human review (not guessed)
1. **Owner/expert:** the change of the approved size 40 → 60 and of the per-part threshold 40 % → 50 % (provisional; to be calibrated with a learner pilot — P3).
2. **German teacher / CEFR expert:** naturalness, level and unambiguity of the 30 new grammar items, the 8 practical items and the three reading passages (do the wrong options really fail for a native reader? is any item B2-leaning?); the **Genitivattribut comprehension item** (receptive concept D-7) and the Plusquamperfekt/nachdem item (D-6) depend on pending decisions — if those decisions change, the items must change.
3. **Native Russian and Kyrgyz reviewers:** all new ru/ky prompts and explanations, the band names and the new listening note (the Kyrgyz wording "Угуу бул текшерүүгө кирген жок …" is an AI draft).
4. **Learner pilot:** guess-resistance and difficulty are calculated, not measured.

## 9. P1–P3 not started
Not touched: text calibration (P1.2), expert decisions and flag tracking D-1…D-14 (P1.1), validator rules for the level test (P1.3 remainder), native review and the RU/KY glossary (P1.4), vocabulary gaps (P2.5), the PWA-banner layout fix (P2.6), unit-test option equalisation (P2.7 — found unnecessary, §3), device TTS and browser checks (P2.8), pilot/calibration and listening items (P3). **I am stopping here and not proceeding to P1.**

## 10. Confirmations
B1 `planned`, `releasedLocales: []`, B1 Beta not enabled; no A1/A2 learning content, Storage/Persistence, unit content of Units 21–32 or release gate modified; the 15 staged files untouched; nothing reset, restored or unstaged; no commit or push; no official-exam or CEFR claim.
