# A2 Unit 12 — implementation notes (Stage 7C)

Unit 12 *Familie, Freunde und Zusammenleben* (`a2-familie-freunde`) is authored as production data in `src/data/a2/unit12/` and wired into the A2 modules. A2 stays `planned`/invisible; units 13–20, the level test, placement and tutor content stay empty. **No human review has taken place**: `A2_REVIEWS` is `{}`; all German, Russian and Kyrgyz text is an AI-assisted first draft.

## 1. Deviations from the Stage 7B design (decisions of the Stage 7C brief)

| Stage 7B design | Implemented | Why |
| --- | --- | --- |
| 3 concepts: `a2-personalpronomen-akk-dat`, `a2-dativverben-zwei-objekte`, `a2-reflexive-verben` | **2 concepts**: `a2-personalpronomen-dativverben` (main; merges the first two) and `a2-reflexive-verben` (smaller) | brief: avoid three large paradigms at equal depth; audit §7 proposal. Pronoun–pronoun order and reflexive Dativ are not taught |
| exercises 3 concepts ≥ 2 each | 8 exercises: concept 1 × 5, concept 2 × 3 | follows the depth of the concepts |
| final test 10 grammar / 3 vocabulary / 2 reading | **8 grammar / 3 vocabulary / 4 reading**, 8 of 15 items situational | brief: assess communicative objectives, not only grammar recognition (audit §E) |
| `promptRu` / `promptKy` of reading items | translate the **question only** | brief: do not copy the Unit 11 translation defect (audit B1) |
| imperative taught in unit 14 | fixed expressions only (see §3) | audit D-1 |

The curriculum-design documents were **not** edited; this file records the deviations. Vocabulary is exactly the approved Stage 7B map for unit 12 (40 items, 35 productive / 5 receptive; checked by test against the map).

## 2. Content inventory

| Item | Count | Ids |
| --- | --- | --- |
| Vocabulary | 40 (35 productive, 5 receptive: *geschieden, Verwandte, Bekannte, eifersüchtig, vertrauen*) | `v12-1` … `v12-40` |
| Grammar | 2 concepts + 4 why-notes | `a2-personalpronomen-dativverben`, `a2-reflexive-verben` |
| Listening | 2 dialogues (informal, du) | `a2-li-12-01` (phone: a family wedding), `a2-li-12-02` (flat: who does what) |
| Reading | 2 | `a2-re-12-01` (forum-style text "Mein Freund Kai"), `a2-re-12-02` (non-continuous: cleaning plan + two notes) |
| Speaking | 1 (4 turns) | `a2-sp-12-01` |
| Writing | 1 (informal message, ≥ 50 words, 8 required elements) | `a2-wr-12-01` |
| Revision exercises | 8 (3 fill / 3 choice / 2 order) | `a2-ex-12-01` … `-08` |
| Final test | 15 (8 grammar, 3 vocabulary, 4 reading); test `unit-12` | `a2-ft-12-01` … `-15` |
| Instructions | 9 | `a2-in-12-*` |

Answer positions: final test 5 / 5 / 5, never three in a row; listening keys 3 / 3 / 2, reading keys 2 / 2 / 2.

## 3. The imperative: closed list of fixed expressions

Unit 12 uses the imperative **only** in these expressions (not explained as a paradigm): *Komm (doch mal) vorbei!* · *Ruf mich (bitte) an!* · *Sag mal, …* · *Erzähl mal, …* (the last also occurs in Unit 11). The fixed **task wording** of the quiz (*Lies die Nachricht / den Text / die Notiz*, *Bilde den Satz*) is also an imperative form; it is instruction text, not language the learner must produce, and is the only addition to the list (Unit 11 uses the same wording). A test rejects any other sentence that starts with an imperative-looking verb. Requests are made with *Kannst du mir …?* (known from A1). The imperative as a rule is taught in unit 14.

## 4. Reading questions — no leak of the answer

* Lab questions (`ReadingText.questions`) are German-only, as in A1.
* Final-test reading items carry the German text **untranslated** inside `prompt`; `promptRu`/`promptKy` translate only the instruction and the question (a test checks: no quotation marks, no Latin text run, shorter than half the prompt). The items test comprehension of the German text (who comes, which reply fits, what the text says, what someone does tomorrow).
* **Unit 11 is not changed** here. Its reading items `a2-ft-11-14/15` still contain the passage translation; correcting them needs a separate approval (the defect is recorded in the Stage 7B audit, B1).

## 5. Objective → assessment matrix (Unit 12)

Communicative objectives of the unit and where each is assessed. Revision exercises (E) are form-focused practice; final-test items (FT) include situational items. Labs (listening, reading, speaking, writing) are practice with feedback, not graded.

| # | Objective | Revision exercises | Final test | Labs |
| --- | --- | --- | --- | --- |
| O1 | Describe a person's character and relationship | — (vocabulary and labs) | FT 09, 11, 14 | R1, L1, S1 turn 3, W1 |
| O2 | Say how people get along; meet, argue, get to know each other | E 06, 07, 08 | FT 06, 07, 08, 12, 14 | L2, R1, S1 turns 2–3 |
| O3 | Ask for, offer and thank for help; give and receive things | E 01, 02, 03, 04, 05 | FT 01, 02, 03, 04, 05, 13 | L2, R2, S1 turn 4, W1 |
| O4 | Share household tasks and make simple requests | E 02 | FT 02, 10, 13, 15 | L2, R2, W1 |
| O5 | Report a social event in the past (reflexive Perfekt) | E 07 | FT 08 | L1, S1 turn 2 |

Communicative final-test items (a situation, a dialogue turn or a message to answer): FT 02, 03, 09, 10, 12, 13, 14, 15 — 8 of 15.

## 6. Receptive vocabulary

`UNIT_12_RECEPTIVE_WORDS` (in `unit12/vocabulary.ts`) records the five receptive words. They occur in texts, glosses and answer options; they are never a required gap answer, speaking keyword or writing requirement (tested). Receptive words may appear as *distractors* (*eifersüchtig*, FT 09).

## 7. Kyrgyz and Russian

Both languages are written independently for every field (vocabulary glosses and examples, concepts, dialogues, glosses, exercises, test, instructions). Disputed Kyrgyz terms are not used; see `A2_KY_TERMINOLOGY_GLOSSARY.md`. Kinship terms are descriptive. All Kyrgyz remains an AI draft and needs native review.

## 8. Not done / left open

Native Kyrgyz, Russian and CEFR review of unit 12 (no review package was generated for unit 12 — only unit 11 has one); the Unit 11 reading-item correction; level-test and placement items; unit-12 UI exposure (A2 is invisible).
