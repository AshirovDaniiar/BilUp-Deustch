# A2 Unit 17 — implementation notes (Stage 7H)

Unit 17 *Schule, Ausbildung und Beruf* (`a2-schule-beruf`) is authored as production data in `src/data/a2/unit17/` and wired additively into the A2 modules. A2 stays `planned`/invisible; units 18–20, the level test, placement and tutor content stay empty. **No human review has taken place**: `A2_REVIEWS` is `{}`; all German, Russian and Kyrgyz text is an AI-assisted first draft. Units 11–16 are unchanged (their review-package fingerprints are locked in `tests/content-validate/unit-17.test.ts`).

## 1. Decisions applied (from the Stage 7H brief)

| Decision | How it is applied |
| --- | --- |
| Ordinals limited to dates, as in Unit 16 | Unit 17 needs no ordinal at all (months are written *im Juni*, *ab Juni*); a test rejects every ordinal word and ordinal digit outside a date |
| No *der Wievielte?* without a learning need | not used (tested) |
| Kyrgyz date formatting **provisional** | recorded in the glossary (§10.3 and the note appended to §9): the form *3-май* is provisional until a native reviewer decides; Unit 17 contains no written date, so nothing of Unit 17 depends on it |
| Grammar progression documentation reflects the six pairs of Unit 16 | `docs/authoring/A2_STAGE7B_GRAMMAR_PROGRESSION.md`, Unit 16 row and risk row B1-4: the six named pairs incl. *sich freuen über* (documentation only; Unit 16 content untouched) |
| No artificial brackets around Kyrgyz loan words | none used in Unit 17: where Russian and Kyrgyz would both use the same loan word, each gloss gives the natural wording of its language (a second sense or a native phrase: *Team* ru *команда, рабочая группа* / ky *жамаат, иш тобу*; *Universität* ru *университет* / ky *университет, жогорку окуу жайы*). No pair is identical, so the localisation rule is satisfied without any allow-list. The validator rule and a narrow proposal are in §8 |
| Unit 18 must include a meaningful informal scenario | noted for Unit 18 (the design's S1 is a formal travel-agency task; an informal planning scenario between friends must replace or accompany it) |

## 2. Deviations from the Stage 7B design

| Stage 7B design | Implemented | Why |
| --- | --- | --- |
| G1 `a2-deshalb-darum`, G2 `a2-wenn-als` | both implemented as in the plan; **decision D-2 (`als`) is implemented "as written, with strict limits"**: *als* only for **one** event in the past, only with *war / hatte* or the Perfekt (auxiliary at the end); no other Präteritum form | the plan and its stated fallback; the audit's alternative (make *als* receptive and teach temporal prepositions for a CV, `a2-zeitangaben-lebenslauf`) was **not** applied because it needs a revision of the design documents under a separate approval. It remains the main open question |
| W1 application e-mail (formal, 70+ words) | **short profile for a job portal** (an *ich*-text, informal-neutral, ≥ 50 words, 6 required elements) | audit B6 ("convert others to … a short biography (17)"); the brief: avoid excessive formal language; no e-mail in the unit |
| L1 short job interview (Sie), L2 two colleagues (du), R1 job ad, R2 "my first working day" | as designed; the interview wording is plain (*Was haben Sie gelernt? Welche Erfahrung haben Sie?*) | — |
| S1 job interview, applicant role | as designed (*Sie*, 4 turns, one reason with *weil* or *deshalb*) | — |
| target task "phone about a vacancy" | not implemented; no telephone call in the unit | Unit 14 already carries the phone scenario; the brief avoids excessive formal patterns |
| 8 exercises E1–E8 (E1–E4 G1, E5–E8 G2) | exactly as designed (fill / choice / order / choice / fill / choice / order / fill) | — |
| final test T1–T15 (T9 Perfekt / Präteritum career summary, T10 `wenn` for conditions) | **7 grammar (G1 × 3, G2 × 4) / 3 vocabulary / 5 reading and communication**; T9 / T10 are recycled inside FT 07 (*bin … umgezogen*), FT 05 and the reading items | the brief: assess practical communication |
| vocabulary 37 | **exactly the 37 approved items** (30 productive, 7 receptive) | the brief; a test compares unit and map item by item and in order |

The curriculum-design documents were **not** edited (only the grammar-progression row of Unit 16, as requested).

## 3. Content inventory

| Item | Count | Ids |
| --- | --- | --- |
| Vocabulary | 37 (30 productive, 7 receptive: *Semester, Vorlesung, Fähigkeit, Weiterbildung, Arbeitnehmer, kündigen, Kündigung*) | `v17-1` … `v17-37` (plan order) |
| Grammar | 2 concepts + 4 why-notes | `a2-deshalb-darum`, `a2-wenn-als` |
| Listening | 2 (L1 job interview, *Sie*; L2 two colleagues, *du*) | `a2-li-17-01`, `a2-li-17-02` |
| Reading | 2 (R1 job ad; R2 blog "Gestern habe ich angefangen") | `a2-re-17-01`, `a2-re-17-02` |
| Speaking | 1 (interview, applicant role, *Sie*, 4 turns) | `a2-sp-17-01` |
| Writing | 1 (short profile for a job portal, ≥ 50 words, 6 required elements) | `a2-wr-17-01` |
| Revision exercises | 8 (3 fill / 3 choice / 2 order; concepts 4 / 4) | `a2-ex-17-01` … `-08` |
| Final test | 15 (7 grammar, 3 vocabulary, 5 reading and communication); test `unit-17` | `a2-ft-17-01` … `-15` |
| Instructions | 9 | `a2-in-17-*` |

Answer positions: final test 5 / 5 / 5, never three in a row; listening keys 3 / 3 / 2; reading keys 2 / 2 / 2; revision choice answers in three different positions.

## 4. Grammar scope

* **`a2-deshalb-darum`.** *deshalb / darum* + verb in position 2; *weil* + verb at the end; the cause-first / effect-first contrast. Not taught: *trotzdem*, *also*, *denn* as a rule (tested: none occurs).
* **`a2-wenn-als`.** *wenn*: present / future, repeated events, repeated events in the past (*Wenn ich Schule hatte, …*); *als*: one past event with *war / hatte* or the Perfekt. **Validator-driven wording rule:** the CEFR heuristic `plusquam` flags *war / hatte* followed within 40 characters by a *ge-* participle (Plusquamperfekt look-alike); the unit's *als* sentences therefore use participles without *ge-* (*bekommen, beendet, angefangen, umgezogen*), which is also a deliberate simplification. Not taught: *bevor / nachdem / während*, *seit*-clauses.
* Recycled without teaching: Perfekt with *haben* / *sein* (unit 11), *wenn* (unit 14), *weil* (unit 11), the separable verbs *anfangen*, *aufstehen*, the Sie-imperative in set phrases (*Setzen Sie sich bitte*).
* Not used: *man*, ordinals, the temporal-preposition concept, adjective endings outside the unit-13 / 15 scope (tested as in Unit 16).

## 5. Reading questions — no leak of the answer

* Lab questions are German-only (*man* does not occur in their stems).
* Final-test reading items carry the German text **untranslated** inside `prompt`; `promptRu` / `promptKy` translate only the instruction and the question (tested: no quotation marks, no run of Latin words, shorter than half the prompt and than 110 characters, numbers only if the German question contains them, no passage sentence reproduced).
* Glosses translate words and chunks, never a whole passage sentence. Units 11–16 are not changed.

## 6. Objective → assessment matrix (Unit 17)

| # | Objective | Revision exercises | Final test | Labs |
| --- | --- | --- | --- | --- |
| O1 | Talk about schools, subjects, grades and qualifications | — (word cards, labs) | FT 08, 10, 12 | L1, S1 turn 1 |
| O2 | Describe a job, working hours and conditions | — (labs) | FT 09, 11, 13 | R1, L1, L2 |
| O3 | Understand a job advertisement and write a short application text | — (labs) | FT 11, 12 | R1, W1 |
| O4 | Answer basic questions in an interview | — (labs) | FT 04, 15 | L1, S1 |
| O5 | Give a reason or consequence and tell when something happened | E 01, 02, 03, 04, 05, 06, 07, 08 | FT 01, 02, 03, 05, 06, 07, 14 | L2, R2, S1 turn 3, W1 |

Communicative final-test items (a real-life ad, message, CV, interview question or work situation): FT 04, 08, 09, 11, 12, 13, 14, 15 — 8 of 15.

## 7. Receptive vocabulary

`UNIT_17_RECEPTIVE_WORDS` (in `unit17/vocabulary.ts`) records the seven receptive words. They occur in the unit's texts (*Weiterbildung, Semester, Vorlesung* in L2; *Fähigkeit, Arbeitnehmer, kündigen, Kündigung* in R1), glosses and word cards; they are never a required gap answer, speaking keyword or hint, writing requirement or **correct** final-test answer (tested). *Vorlesung* appears once as a distractor (FT 08).

## 8. Localisation validator: rule inspected, narrow proposal (nothing changed)

**The rule** (`scripts/content-validate/rules/localization.ts`, `checkPair`): when the Russian and the Kyrgyz text of a field are equal after normalisation, (a) a **vocabulary word pair** whose id is in `SAME_AS_RU` (`scripts/content-validate/reviews.ts`, currently empty) is accepted with an `info`; (b) otherwise a text of **two or more words or eight or more characters** is an **error** (*Kyrgyz must be authored, not copied*); (c) a shorter single word is a **review flag**. Consequence: a genuine shared loan word of eight or more characters (*интернет, университет, программист, телевизор*) cannot pass without an allow-list entry, and shorter ones (*концерт, лекция*) leave a review flag, which the unit tests do not tolerate. Earlier units therefore added a bracket to the Kyrgyz gloss; this is a workaround, not a linguistic choice.

**Proposal (narrow, no weakening).**
1. Keep the rule and its thresholds unchanged for sentences, examples, explanations and every other collection.
2. Make the allow-list **typed and justified**: `SAME_AS_RU: Record<vocabularyId, { reason: 'loanword' | 'name' | 'number'; note: string }>`; an entry without a reason is an error.
3. Accept an entry only if (a) the id exists and is a **vocabulary** item of an A2 unit, (b) the field is the **word gloss** (`ru` / `ky`), never an example or any sentence, (c) the value is a **single token** (no space), (d) the German lemma is not itself identical to the gloss. Everything else keeps failing.
4. Report each accepted entry as an `info` line with its reason, and count them per unit in the validation summary, so a reviewer sees the full list.
5. Entries are added **by a person** (like review sign-offs), not by the assistant; in release mode each entry needs the native reviewer's confirmation (`kyReviewed` flag in the record).
6. Tests for the proposal: allow-list rejects a sentence, an example field, a nonexistent id, an entry without reason, a multi-word value.

Not implemented in this stage (the brief asks for a proposal only).

## 9. Kyrgyz and Russian

Both languages are written independently for every field. Disputed Kyrgyz terms are not used as labels; institutions are described as German institutions (*Berufsschule*, *Ausbildung*), without claiming equivalence with another system; occupation names are given in the masculine, with the feminine in context (*Ingenieurin → инженер аял*). Unresolved Unit 17 terms: `A2_KY_TERMINOLOGY_GLOSSARY.md` §10. All Kyrgyz remains an AI draft and needs native review.

## 10. Not done / left open

Native Kyrgyz, Russian and CEFR review of unit 17 (including the placement of *als* at A2); the review package (the tooling was not generalised); level-test and placement items; UI exposure (A2 is invisible). Open questions: `docs/implementation/A2_STAGE7H_UNIT17.md`.
