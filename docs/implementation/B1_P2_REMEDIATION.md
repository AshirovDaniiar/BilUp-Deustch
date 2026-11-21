# B1 P2 Remediation

B1 is still `planned`, `releasedLocales: []`, invisible. No commit/push. **P3 was NOT started; no release preparation was done.** No CEFR, native-speaker or exam-expert validation exists or is claimed; every changed German line is an unreviewed AI-assisted draft, **no decision D-1…D-14 or X-1…X-7 was approved**, and no Kyrgyz word was changed or invented.

## 1. P2 scope (audit §9) and what was done
| Audit P2 item | Result |
|---|---|
| **5.** Vocabulary gaps (Medien, Grund, Folge, Wunsch, Zukunft, Gefühl …) "via glossary or swaps decided by the owner; mark P/R status; verify KY glosses that equal A1/A2 glosses" | **Classified, not changed.** A register of 23 words with category, proposed P/R and where each already occurs (§4); the six Kyrgyz collisions analysed one by one and routed to native review (§5). No word was added or removed |
| **6.** PWA notice layout fix at ≤ 600 px and a Chromium run of the B1 quiz pages at 390 px | **Fixed** (§3) and verified in Chromium (§7) |
| **7.** "Equalise option lengths in unit tests; vary reading question types before Unit 32" | **Done, and corrected:** the real bias was in the *reading and listening comprehension questions*, not in the 15-item unit tests (§2). Reading question types varied from Unit 26 (§2) |
| **8.** Real-device TTS and screen-reader checks; Safari/Firefox/Edge pass | **Not implemented** — impossible in this environment (§8) |

## 2. Findings addressed

### 2.1 Answer-length bias in the text comprehension questions (item 7, first half)
The P0 phase found the 15-item unit tests unbiased (34 % strict). Measuring the *other* questions of the units — the 3–4 questions attached to each reading and listening — shows the audit's concern was real **there**:

| Set | Correct option strictly the longest — before | after | Chance baseline |
|---|---|---|---|
| Reading choice questions (56 after item B) | 45 of 73 = **62 %** (all questions) | **15 of 56 = 27 %** | ~33 % |
| Listening questions (96) | 55 of 96 = **57 %** | **31 of 96 = 32 %** | ~33 % |
Edit: the **distractors** of 40 questions (24 listening, 16 reading) were lengthened/enriched until they are as developed as the correct answer (e.g. "Er hat Autos repariert." → "Er hat lange in einer Werkstatt Autos repariert."); every changed distractor stays clearly wrong (checked against the scripts and texts; the validator's scope guards caught one slip — an adverb "damit" in a Unit 22 distractor — which was rewritten). The correct option is now strictly *shortest* in 9 reading and 11 listening questions, so length is a cue in neither direction. Answer keys and positions of listenings are unchanged; the answer-position rule of the validator still passes.

### 2.2 Variety of reading question types (item 7, second half)
All 22 readings of Units 21–31 used only three-option questions (the statement format "richtig / falsch / steht nicht im Text" appeared first in Unit 32). **Twelve questions of Units 26–31 (two per unit, one per reading) were converted to the statement format**, so the format is met gradually (Units 21–25 unchanged, 26–31 two statements each, Unit 32 its own five). Chosen answers: richtig 4 · falsch 4 · steht nicht im Text 4. Each statement is decided by one sentence of the text (or, for "steht nicht", by the absence of the topic) — a test pins the supporting sentence of each. The converted questions were the ones with the strongest length bias, so 2.1 and 2.2 reinforce each other.

## 3. PWA / mobile fix and regression tests (item 6)
**Defect:** `.pwa-note` is `position: fixed` (z-index 60, above the bottom navigation) and the page reserved no space for it, so at 390 px it floated over the lower part of quiz and assessment screens; in the earlier browser QA the first click had to be preceded by dismissing the notice.
**Smallest robust fix** (3 files): `src/pwa/PwaPrompt.tsx` — while a notice is visible it measures itself (`getBoundingClientRect`, `ResizeObserver`, window `resize`) and sets `--pwa-note-h` and the class `has-pwa-note` on `<html>`; both are removed when the notice is dismissed, installed, deferred or unmounted. `src/pwa/pwa.css` — `html.has-pwa-note .main` adds exactly that height to the bottom padding (below 1024 px: navigation reserve + notice; from 1024 px, where the notice sits in the bottom-right corner: notice height). **Nothing is hidden, the notice is not dismissed on the learner's behalf, the dismissal key and the install/update/iOS behaviour are untouched.**
**Regression tests** (`tests/pwa/reserve-space.test.tsx`, 12): nothing reserved when no notice; reserved height published (rounded up) for the install notice; follows ResizeObserver and window resize; **dismissed ("Later") removes class and variable while the dismissal is still remembered**; "Install" still calls the browser prompt and releases the space; the update notice reserves and "Later" releases; update has priority and only one notice exists; standalone/installed app never reserves; unmount cleans `<html>`; CSS contract (both rules, the notice still fixed above the navigation, never `display:none`). jsdom has no layout, hence the real-browser checks in §7.

## 4. Vocabulary decisions (item 5) — no entry changed
Source: `src/data/b1/vocab-review.ts` (`B1_VOCAB_GAPS`, data only, not in the lazy chunk) + `tests/b1/p2-remediation.test.ts`.
* **Essential thematic words missing from the 1083-word A1–B1 lists** (proposed productive; **owner decision, needs a swap of a unit entry because each unit has exactly 40**): **Medien** (Unit 26's own topic word), **Grund** (22/30), **Folge** (30), **Wunsch** (27), **Zukunft** (28), **Gefühl** (21/25). A scan shows that only *Grund* (1 reading) and *Zukunft* (2 texts) occur in a reading/listening/example at all; the other four never appear, so they cannot be learned incidentally.
* **Useful, receptive is enough (R):** Ursache, Chance, Vergleich (only as the glossed phrase "im Vergleich zu"), Freiwillige (two texts, not listed).
* **Optional — adding them would only expand the course:** Konflikt, Interview, Bewertung, Absicht, Zweck, Symptom, Bewegung (each is covered by an already taught near-synonym or an international word).
* **Revision vocabulary already taught in A1/A2:** none of the 23 words is in A1/A2 (checked by lemma), so no entry could be satisfied by revision.
* **Out of scope by design (not gaps):** Gesetz, Politik, Regierung, Wirtschaft, Religion, Wahl (political sense) — the course makes no legal or political claims.
* **P/R status:** the vocabulary type has **no productive/receptive field**; adding one needs a shared-type change and a classification of all 480 words — not done. The register records the *proposed* P/R of the unlisted words.
* **Why nothing was added:** the instruction is not to add words to raise a count, and a swap changes approved unit contents, tests (480/40) and the validator's per-unit counts. Tests prove 480 words, 40 per unit, and that no registered word is a headword.

## 5. RU/KY terminology findings (items 5 and the user brief C) — all kept, all flagged
Each of the six entries (B1 word ↔ A1/A2 word with the identical Kyrgyz gloss) was traced to its source (`KY_COLLISION_ANALYSIS`):
| B1 entry | A1/A2 entry | Source of the collision | Can the distinction be made naturally? |
|---|---|---|---|
| Begegnung (v21-11) | sich treffen (v12-28) | same-root derivation ("жолугушуу") | **Unknown** — the Russian gloss adds "знакомство"; does Kyrgyz need a second word? → native |
| zunächst (v21-27) | zuerst (v11-29) | near-synonyms ("адегенде") | Not needed (German near-synonyms too) |
| Werbung (v26-10) | Anzeige (v13-1) | **A2 gloss doubtful** ("жарнама" = advertising; Anzeige means announcement) | Unknown → native; A2 untouched |
| überprüfen (v26-37) | Untersuchung (v14-30) | one Kyrgyz verbal noun for verb and noun | Not needed; natural? → native |
| Rabatt (v27-23) | Angebot (v9-13) | **A2 gloss doubtful** (Angebot = предложение, акция) | Unknown → native; A2 untouched |
| ersetzen (v27-33) | umtauschen (v9-6) | replace/exchange are one Kyrgyz verb | Unknown → native |
**The B1 glosses were not assumed wrong and none was changed.** New observation outside B1: the A2 entries *Angebot* and *umtauschen* have **no Kyrgyz example sentence** (recorded, A2 untouched). The five noun/verb pairs sharing one gloss are legitimate derivations and remain registered (P1). A test pins all eleven glosses so any change reopens the review. Terminology standardisation of the grammar explanations was done in P1 (glossary); nothing further was changed here.

## 6. Items awaiting owner or native-speaker review
**Owner:** which of the six essential words (if any) to teach and which Unit 32 entries to swap out (§4); whether to add a productive/receptive field to the vocabulary type; whether to correct the A1/A2 side (Anzeige, Angebot, the two missing example sentences).
**Native Kyrgyz reviewer:** the six questions of §5 (each has the exact wording in `vocab-review.ts`); the 40 lengthened distractors are German only — no translation involved.
**German teacher / CEFR expert:** the 12 new statement questions (are the "falsch" and "steht nicht im Text" items unambiguous for a native reader?) and the 40 lengthened distractors (does any now read as plausible?). Still open from earlier phases: D-1…D-14, X-1…X-7 (not touched).

## 7. Tests and QA
* **Full Vitest:** 110 files, **3323 tests, all passed** (3293 before; +12 PWA, +18 P2).
* **TypeScript** clean · **lint** 0 errors / 8 baseline warnings · **format check** clean · **production build** succeeds.
* **`content:validate`:** 0 errors, 0 warnings, 67 review flags (unchanged). **`content:validate:release`:** 43 errors (unchanged; gate untouched).
* `git diff --cached --shortstat`: **15 files, 513 insertions, 103 deletions — unchanged.**
**Browser QA — real Chromium via Playwright, Vite dev server, B1 switched to Beta in the page only; the install notice appeared in every session and was NOT dismissed unless stated.**
| Check | Combinations | Result |
|---|---|---|
| Level assessment `level-b1`, notice visible then dismissed ("Позже"/"Кийинчерээк"): class and `--pwa-note-h` present, main bottom padding grows (390 px: 96 → 263 px; 1280 px: 60 → 235 px / 213 px), first answer clickable **with the notice visible**, "Continue" hit-testable and above the notice at the scrolled bottom; after dismissal class/variable gone and padding back | **ru 390, ky 390, ru 1280, ky 1280 — all four fully tested** | pass, no overflow, no console error |
| Scrolled-to-bottom probe with the notice visible: reading text, reading question, reading answered, listening, writing (filled and result), speaking, unit-32 test | ru 390, ky 390 | lowest control hit-testable and above the notice everywhere; in "writing result" the lowest control lies above the viewport (the page ends with text), nothing blocked |
| **All 48 B1 reading and listening quizzes answered start to finish with the notice visible** (readings and listenings of Units 21–32, including the 12 converted statement questions and the lengthened distractors) | **ky 390** | 48/48 completed, 0 blocked, lowest control above the notice on every question, no overflow, no error. First screen of all 12 unit tests: controls reachable |
| Changed content played through: readings 26-01, 27-01, 29-02, 30-02, 31-02 (statements) and listenings 22-02, 29-02, 31-02 (lengthened distractors), 3/3 and 4/4 correct | ru 1280, ky 390, ru 390, ky 1280 — all four fully tested | pass, no overflow, no error |
| A1 pages with the notice visible (home, Learn, Practice, Tests, Grammar, Words) | ru 390 (language default) | lowest control hit-testable and above the notice; no error — the A1/A2 layout is unchanged except for the reserved space |
**Not fully tested (stated exactly):** the ru-390 run of all 48 quizzes (only the eight changed ones and the level test); the unit tests were run start to finish only in earlier phases (P2 verified their first screens); speaking and writing were checked for blocked controls at 390 px in ru and ky but not replayed at 1280 px in this phase (they are unchanged). **Not verified at all:** real devices, iOS Safari (its separate `pwa-ios` notice uses the same code path and the same CSS but was not seen), Firefox, Edge, screen readers, real speech output.

## 8. P2 items not implemented, and why
* **Item 8 — real-device TTS, screen readers, Safari/Firefox/Edge:** requires physical devices and other browsers; none available. **Not claimed.** (The iOS notice branch is covered by the same measurement code and a jsdom test of the shared hook, not by a browser.)
* **Vocabulary swaps and a productive/receptive field (item 5, "swaps decided by the owner"):** await the owner (§4, §6).
* **Correcting Kyrgyz glosses (item 5, "verify"):** verification needs a qualified reviewer; nothing was guessed (§5).
* **Equalising the 15-item unit tests (item 7, literal wording):** found unnecessary — strictly measured they sit at the chance baseline (P0 doc §3); a test keeps them ≤ 40 %.

## 9. P3 confirmation
P3 was **not started**: no learner pilot or threshold calibration, no listening items in `level-b1`, no decision on mediation depth (D-13) or the prerequisite policy (D-14), no release preparation.

## 10. Files changed
**Created:** `src/data/b1/vocab-review.ts`, `tests/pwa/reserve-space.test.tsx`, `tests/b1/p2-remediation.test.ts`, this report.
**Edited (code):** `src/pwa/PwaPrompt.tsx`, `src/pwa/pwa.css`.
**Edited (learner content, German question/option wording only):** `unit21`–`unit32/texts.ts` (distractors; Units 26–31 also the 12 converted questions); tests `unit-26`…`unit-31` (the reading answer keys of the converted questions).
**Not touched:** A1/A2 learning content, Storage/Persistence, the release gate, `level-b1` and its scoring, grammar allocations, decisions D-1…D-14 / X-1…X-7, vocabulary lists and glosses, permanent ids.

## 11. Confirmations
B1 `planned`, `releasedLocales: []`, B1 Beta not enabled (switched on only inside test pages); A1/A2 learning content and Storage/Persistence unmodified; the 15 staged files untouched; nothing reset, restored or unstaged; no commit or push.
