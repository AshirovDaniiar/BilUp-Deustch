# B1 Stage 3F — Unit 24 (Wohnen, Umzug und Umwelt): FINAL STATUS

B1 is still `planned`, `releasedLocales: []`, invisible (the German interface never offers B1). No commit or push. No CEFR approval, no native review of the Kyrgyz and no verified audio is claimed.

## 1. Summary
Unit 24 (`b1-wohnen-umwelt`) is complete and wired into the existing B1 content module and metadata (`b1-content.ts`, `meta.ts`). No separate blueprint existed; the content was derived from `B1_CURRICULUM.md` (Unit 24), `B1_CURRICULUM_V2_APPROVAL.md`, `curriculum.ts` and the Unit 21–23 pattern. Curriculum finding: the basic housing words (Mietvertrag, Kaution, Nebenkosten, Hausordnung, Mülltrennung, Heizung, Nachbar, Vermieter, Umzug, umziehen, besichtigen, …) were already taught in A1/A2 Units 13/18, so they are **reused as revision in texts and exercises but not listed as new** (the lemma validator rejected `umziehen` and `besichtigen`; they were replaced).

## 2. Files
**Created:** `src/data/b1/unit24/{unit,vocabulary,grammar,texts,assessment,meta}.ts`; `tests/b1/unit-24.test.ts` (56 tests); `tests/b1/unit-24-integration.test.tsx` (20 tests); this report.
**Modified:** `src/data/b1/b1-content.ts`, `src/data/b1/meta.ts`. Existing tests updated for "Units 21–24" (`b1-infrastructure`, `b1-approval`, `b1-profile` [review flags 34 → 37], `unit-21`, `unit-21-audit`, `unit-22`, `unit-23`); they now exclude only the one expected D-5 review flag (see §11). No shared UI, CSS, A1/A2 content or Storage code was changed.

## 3. Vocabulary
**40 new** items `v24-1…40` (23 nouns, 8 adjectives, 9 verbs) in five themes: Wohnung und Vertrag, Haus und Mängel, Umzug, Energie und Umwelt. None repeats an A1/A2/Unit 21–23 lemma (validator + test). **Revision (not new):** 4 words of Unit 23, 2 of Unit 21, 3 of A2 Unit 13 (Mietvertrag, Hausordnung, Mülltrennung) as the spaced-revision set, plus a Wiederholungsblock of 22 words of Units 21–23 — all real ids, tested.

## 4. Grammar (approved allocation, nothing else)
* `b1-passiv-praesens` (P/H): Vorgangspassiv Präsens, werden + Partizip II, separable verbs (abgeholt, angeschlossen), `von` + Dativ. **Passiv Perfekt (`… worden`) is receptive only**: glossed in one reading (`b1-re-24-02`), never in a task, test, hint, keyword or checklist item (declared in the metadata; tested).
* `b1-adjektive-ohne-artikel` (P/M): endings without article in Nominativ, Akkusativ, Dativ (housing advertisements).
* Not taught (scope-guard test): Passiv with modal/Präteritum (26), Konjunktiv II (25), Zustandspassiv (31), relative clauses with preposition (29), damit (30), Genitiv, verb + preposition (28), `ohne/statt … zu`.

## 5. Texts
Readings 124 and 121 words (advertisement + Hausordnung; Umweltaktion brochure with residents' opinions). Listenings 131 and 125 words (apartment viewing with landlord; call to the Hausmeister). Sentences ≤ 24 words, p95 ≤ 18. Speaking: 6 turns, "Mangel melden", unexpected Nebenkostenabrechnung in turn 4. Writing: main task = formal mail to the Hausverwaltung (`minWords` 70, model 89 words, six checklist items explained in ru and ky, ≥ 2 Passiv sentences); plus a short **opinion micro-task** `b1-wr-24-02` (30 words, three items), required by the curriculum (Meinung/Begründung from Unit 24) and, per the validator, a micro-task cannot be the main task. Both feedback modes are checklist + self-assessment, no numeric score. Listening uses browser text-to-speech (not verified on devices); no test item depends on audio.

## 6. Exercises
10 = 3 fill / 5 choice / 2 order: 4 on Passiv, 4 on adjectives, 2 recycled A2 (Positionsverben, wenn); one text-level item (ex 04).

## 7. Assessment
`unit-24`, 15 questions = 8 grammar (3 Passiv, 2 adjectives, 3 recycled: Positionsverben, wenn, Relativsatz of Unit 23) / 3 vocabulary / 4 reading / 0 listening. Correct-answer positions 5/5/5, never three in a row; each answer appears exactly once; no prompt/answer shared with the exercises. Pass mark 70 % (11 of 15), existing rule.

## 8. RU/KY
Every learner-facing string has independently written ru and ky; parity is tested structurally across all unit data. Kyrgyz describes grammar and uses no invented labels. **The Kyrgyz is an unreviewed AI draft.**

## 9. Browser QA (Chromium/Playwright, Vite dev server; B1 switched to Beta in the page only, never in files)
* ru and ky × 1280 px and 390 px: all 15 routes (unit, vocabulary, 2 topic + 2 grammar pages, 2 listenings, 2 readings, 2 writing tasks, speaking, unit test, review) render real content, no "not found", no `undefined`/`NaN`, **no console errors, no horizontal overflow**.
* Flows: both writing tasks (model text ticks all checklist items, no percentages/score bars) in ru/ky at 390 and 1280; speaking opens without overflow; unit test played in the real runner (ru 1280: 12/15 passed; ky/ru 390 and ky 1280: 11/15 = 73 % passed). Reading/listening question phases, answer feedback, and the 6-turn speaking run with its ending are covered by the jsdom integration test on the real app.
* Not verified: real speech synthesis/microphone, other browsers/devices, screen readers. No defect was found in the browser, so no new regression test was needed.

## 10. Automated results
| Check | Result |
| --- | --- |
| Full test suite | **89 files, 2485 tests passed** |
| `content:validate` | 0 errors, 0 warnings, 37 review flags |
| release gate | 44 errors (expected: B1 not released) |
| typecheck | 0 errors |
| lint | 0 errors, 8 warnings (existing baseline) |
| format:check | clean (after `prettier --write` of the test files I edited) |
| production build | succeeds |

Defects found by the guards while authoring (all fixed, none weakened): `umziehen`/`besichtigen` already A2; Unit 24 vocabulary was 39 words (added Mülltonne); reading 1 under length (108 → 124); the validator treats `wohne` and the checklist name "Adjektiv ohne Artikel" as the receptive `ohne`, so the label/pattern were reworded; the main writing task cannot double as the opinion micro-task; a final-test answer ("wird") duplicated an exercise answer; Kyrgyz gloss for *Schimmel* was too long.

## 11. Review flags (honest list)
The 3 new flags beyond the 34: CEFR sign-off of Unit 24; `b1-expert-review-pending` for the open decision **D-5** (Passiv Perfekt receptive; a reviewer may promote it); heuristic `cefr-structure-passiv-perfekt` on the receptive reading. Existing Unit 21–23 tests were adjusted to expect exactly these.

## 12. Remaining human review
1. Independent CEFR review of the unit and decision D-5 (Passiv Perfekt) and the placement of the whole Passiv system at B1.
2. Native Russian and Kyrgyz review (blocker B-5 for Kyrgyz terminology of Passiv and adjectives without article; housing/environment vocabulary).
3. Teacher review of the German (naturalness of dialogues, register of the Hausverwaltung mail).
4. Real-device check of text-to-speech.
5. Owner decision: the Writing lab lists the micro-task, but `UnitScreen` links only the first writing task of a unit, so `b1-wr-24-02` is reachable from the writing list, not from the unit page (shared UI left untouched).

## 13–15. Confirmations
B1 remains hidden (`planned`, `releasedLocales: []`; German never offered B1). A1/A2 content, Storage/Persistence, approved unit ids/conventions and Units 21–23 content are untouched (only their tests' expected lists changed). `git diff --cached --shortstat` is still 15 files, 513 insertions, 103 deletions — the previously staged files are unchanged. No commit or push was made.
