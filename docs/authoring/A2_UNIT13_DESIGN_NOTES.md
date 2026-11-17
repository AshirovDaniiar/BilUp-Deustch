# A2 Unit 13 — implementation notes (Stage 7D)

Unit 13 *Wohnen und Nachbarschaft* (`a2-wohnen-nachbarschaft`) is authored as production data in `src/data/a2/unit13/` and wired into the A2 modules. A2 stays `planned`/invisible; units 14–20, the level test, placement and tutor content stay empty. **No human review has taken place**: `A2_REVIEWS` is `{}`; all German, Russian and Kyrgyz text is an AI-assisted first draft. Units 11 and 12 are unchanged (their review-package fingerprints are locked in `tests/content-validate/unit-13.test.ts`).

## 1. Deviations from the Stage 7B design

| Stage 7B design | Implemented | Why |
| --- | --- | --- |
| G2 *Komparativ*: regular forms, irregular forms, `so … wie` (E5: *als / wie / so … wie*) | regular `-er / am -sten`, umlaut, `teurer`, the three irregular series (*gut–besser–am besten, viel–mehr, gern–lieber*), `als` only; **no `so … wie`**, predicative use only | Stage 7B audit §7 proposal 2 (cap the *Komparativ*, no *so … wie*). E5 therefore contrasts *als* with *wie* and with the bare adjective |
| G1, G2, G3 | all three kept, each with a deliberately **capped scope** (§3) | the plan's three concepts; the audit asks to keep three |
| vocabulary ≈ 37 (audit: trim to ≈ 33) | **exactly the 37 approved items** (33 productive, 4 receptive) | the brief: follow the approved vocabulary map; a test compares the unit with the map, item by item and in order |
| W1: formal e-mail, "about 60+ words" | formal e-mail answering an ad, **minimum 50 words** (model 63) | audit B6: keep formal tasks short; the other formal tasks of the plan are for units 15 and 19 |
| housing defect not planned | reported in listening dialogue **L2** (broken heating) and assessed in **FT 14**; no new vocabulary item | audit gap "reporting a housing defect"; `funktioniert nicht`, `kaputt`-type words are text words (not vocabulary items); no task requires them |
| exercise distribution | 8 exercises: concept 1 × 3, concept 2 × 3, concept 3 × 2; types fill / choice / order / fill / choice / order / fill / choice | exactly the E1–E8 table of the design |
| final test T1–T15 (grammar-heavy: T1–T10 grammar) | **7 grammar / 3 vocabulary / 5 reading and communication** | brief and audit §E: assess communicative objectives, not only grammar. The design's T9 (Dativ pronoun) and T10 (Perfekt with *sein*) are recycled **inside** FT 14 (*in eine neue Wohnung eingezogen*, *dem Vermieter*) instead of as stand-alone gaps |

The curriculum-design documents were **not** edited; this file records the deviations.

## 2. Content inventory

| Item | Count | Ids |
| --- | --- | --- |
| Vocabulary | 37 (33 productive, 4 receptive: *Dachboden, geräumig, Mülltrennung, renovieren*) | `v13-1` … `v13-37` (plan order) |
| Grammar | 3 concepts + 5 why-notes | `a2-adjektivendungen-indefinit`, `a2-komparativ-superlativ`, `a2-positionsverben` |
| Listening | 2 dialogues (L1 formal phone call, Sie; L2 friends moving in, du) | `a2-li-13-01`, `a2-li-13-02` |
| Reading | 2 (R1 classified ad with decoded abbreviations; R2 *Hausordnung* + a neighbour's note) | `a2-re-13-01`, `a2-re-13-02` |
| Speaking | 1 (viewing a flat with the landlord, Sie, 4 turns) | `a2-sp-13-01` |
| Writing | 1 (formal e-mail answering an ad, ≥ 50 words, 8 required elements) | `a2-wr-13-01` |
| Revision exercises | 8 (3 fill / 3 choice / 2 order) | `a2-ex-13-01` … `-08` |
| Final test | 15 (7 grammar, 3 vocabulary, 5 reading and communication); test `unit-13` | `a2-ft-13-01` … `-15` |
| Instructions | 9 | `a2-in-13-*` |

Answer positions: final test 5 / 5 / 5, never three in a row; listening keys 2 / 3 / 3; reading keys 2 / 2 / 2; revision choice answers in three different positions.

## 3. Grammar scope (what is taught, and what deliberately is not)

* **`a2-adjektivendungen-indefinit` (main concept).** Endings after *ein-, kein-, mein-/dein-*, **singular, Nominativ and Akkusativ only**: masc. Nom *-er*, masc. Akk *-en*, neuter *-es*, fem. *-e*; predicative adjectives unchanged; *-el / -er* adjectives lose the *e* (*dunkle, teure*). **Not taught:** Dativ endings, endings after the definite article (unit 15), plural endings, endings without article. A test therefore rejects any attributive adjective after *der/die/das/dem/den*, after a Dativ article, or without an article, and checks the ending of every adjective that follows *ein-/kein-/mein-* against the gender of the noun.
* **`a2-komparativ-superlativ`.** See §1. *Not taught:* the attributive comparative (*die größere Wohnung*), *so … wie*. A test rejects both.
* **`a2-positionsverben`.** *stehen / stellen, liegen / legen, hängen* with *Wo?* + Dativ and *Wohin?* + Akkusativ (A1 `wechsel` revisited); present tense only; no *sich setzen / sich legen*. Dativ noun phrases after a preposition carry **no adjective**.

## 4. The imperative, `dürfen` and `man` (decisions D-1 and D-5)

Unit 13 contains **no imperative** at all (no fixed-expression list was needed: requests are *Können Sie …? / Ist … möglich?*; placements are *Wohin kommt …? / Ich stelle …*). The only imperative-looking text is the fixed **quiz-task wording** *Lies die Anzeige / die Anzeigen / die Notiz / die Nachricht / die Situation*, which is instruction text, not language the learner produces (as in Units 11 and 12). The *Hausordnung* is a **nominal notice** (*Ruhe: täglich von 22 bis 6 Uhr*, *Fahrräder bitte nicht im Flur*, *Mülltrennung: Papier, Glas, Restmüll*); a test rejects *dürfen / darf / man darf / soll*. Production of rules (*man darf …*) arrives in unit 19; the imperative as a paradigm in unit 14.

## 5. Reading questions — no leak of the answer

* Lab questions (`ReadingText.questions`) are German-only.
* Final-test reading items carry the German text **untranslated** inside `prompt`; `promptRu` / `promptKy` translate only the instruction and the question (a test checks: no quotation marks, no run of Latin words, shorter than half the prompt, no digits copied from the passage, no passage sentence reproduced).
* The lab-text glosses translate **words and chunks**, never a whole sentence of the passage.
* Unit 11's reading items are **not changed** here (the Unit 11 defect remains recorded in the Stage 7B audit, B1).

## 6. Objective → assessment matrix (Unit 13)

Revision exercises (E) are form-focused practice; final-test items (FT) include situational items. Labs (listening, reading, speaking, writing) are practice with feedback, not graded.

| # | Objective | Revision exercises | Final test | Labs |
| --- | --- | --- | --- | --- |
| O1 | Understand a housing ad and ask about rent, extra costs and deposit | — (labs) | FT 08, 11, 15 | R1, L1, S1 turn 2, W1 |
| O2 | Describe a flat or room with correct adjective endings | E 01, 02, 03 | FT 01, 02, 03, 10 | R1, S1 turn 1, W1 |
| O3 | Compare flats, rooms and neighbourhoods | E 04, 05, 06 | FT 04, 05, 13, 15 | S1 turn 3, W1 |
| O4 | Say where things are and where to put them | E 07, 08 | FT 06, 07, 09 | L2, S1 turn 4 |
| O5 | Talk about neighbours, understand house notices, report a household problem | — (labs) | FT 10, 12, 13, 14 | R2, L2 |

Communicative final-test items (a real-life text, message or situation): FT 07, 08, 09, 11, 12, 13, 14, 15 — 8 of 15.

## 7. Receptive vocabulary

`UNIT_13_RECEPTIVE_WORDS` (in `unit13/vocabulary.ts`) records the four receptive words. They occur in the unit's texts (*Dachboden*, *geräumig*, *renoviert*, *Mülltrennung* in R1 / R2), glosses and word cards; they are never a required gap answer, speaking keyword or hint, writing requirement or **correct** final-test answer (tested).

## 8. Realism and variety

* Genre variety (audit): the writing task is the **first formal e-mail after unit 11** and the only formal writing task of Units 12–13; unit 12 was an informal message. L1 is a telephone call, L2 a face-to-face conversation (audit: limit telephone scenarios).
* Registers: L1 and S1 are formal (*Sie*), L2 and the grammar dialogues informal (*du*).
* Dates: only weekday + clock time (no ordinals, no month dates; ordinals are unit 16). Rent figures are plausible and internally consistent (R1: 640 + 110 = 750; FT 11: 780 + 150 = 930).
* Household problem: a broken heating is reported (L2, FT 14); small talk with neighbours (*grüßen*, the notice of Frau Demir) and noise (FT 13: *Ich mache die Musik gleich leiser*) cover the "neighbour" tasks.

## 9. Kyrgyz and Russian

Both languages are written independently for every field (vocabulary glosses and examples, concepts, dialogues, glosses, exercises, test, instructions). Where Russian addresses a Russian-speaking learner ("в русском прилагательное тоже согласуется"), Kyrgyz addresses a Kyrgyz-speaking learner (the Kyrgyz adjective does not decline). Disputed Kyrgyz terms are not used; unresolved Unit 13 terms are recorded in `A2_KY_TERMINOLOGY_GLOSSARY.md` §6. All Kyrgyz remains an AI draft and needs native review.

## 10. Not done / left open

Native Kyrgyz, Russian and CEFR review of unit 13; level-test and placement items; UI exposure (A2 is invisible). Open pedagogical questions are listed in `docs/implementation/A2_STAGE7D_UNIT13.md`.
