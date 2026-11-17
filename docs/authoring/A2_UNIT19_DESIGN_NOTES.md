# A2 Unit 19 — implementation notes (Stage 7J)

Unit 19 *Stadtleben und öffentliche Dienste* (`a2-stadtleben`) is authored as production data in `src/data/a2/unit19/` and wired additively into the A2 modules. A2 stays `planned`/invisible; unit 20, the level test, placement and tutor content stay empty. All German, Russian and Kyrgyz is an AI-assisted first draft (`A2_REVIEWS = {}`).

## 1. Decisions applied (from the Stage 7J brief)

| Decision | How it is applied |
| --- | --- |
| Add a small practical **directions micro-task** (ask where a place is, understand simple directions, explain a short route) | three parts: **L2** (`a2-li-19-02`, on the street: ask for the post office, understand the route *bis zur Kreuzung – rechts – an der Bank vorbei – gegenüber von der Apotheke*, time on foot, parcel counter, cash machine); **S1** (`a2-sp-19-01`: the learner stands at a station with a mini-map in the task text, explains the route to a stranger, answers two questions and asks one indirect question); **G3** (`a2-wegbeschreibung-praepositionen`) with exercises E6–E8 and final-test items FT 06, 07, 13, 14 |
| Keep *Es wird …* in Unit 18 as a limited productive weather expression; do not modify Unit 18 | Unit 18 files and tests of earlier units are untouched in content (fingerprints locked); Unit 19 uses no *werden* at all |
| Kyrgyz date formatting stays provisional | Unit 19 contains no calendar date; only clock times (*10 Uhr*, *8 bis 12 Uhr*) and weekdays; the provisional rule of glossary §10.3 is unchanged |
| Do not modify the `SAME_AS_RU` validator | validator, rules and `reviews.ts` untouched; Unit 19 needs no allow-list (no Kyrgyz gloss repeats the Russian one, no artificial bracket; tested) |
| Do not remove the brackets of Units 12–16 | untouched |

## 2. Deviations from the Stage 7B design

| Stage 7B design | Implemented | Why |
| --- | --- | --- |
| L2 post or bank counter (formal) | **street dialogue** (ask the way to the post office; at the end the parcel counter, stamps, price, cash machine, a diversion) | brief: a practical directions micro-task; the post services of the objective are still covered |
| S1 ask for information at an information desk or on the street (Sie) | S1 = **directions micro-task**: explain a route from a mini-map, answer, ask one question with *Können Sie mir sagen …?* | brief |
| `a2-indirekte-fragen` three final-test items (T4–T6) | **two** items (FT 04, 05), and exactly two frames | audit D-4 (≤ two productive frames, ≤ two final-test items) |
| final test T1–T15 with T9 (imperative) and T10 (Dativ pronoun) as grammar items | **7 grammar (G1 × 3, G2 × 2, G3 × 2) / 3 vocabulary / 5 reading and communication**; the imperative and *mir* are recycled inside the dialogues and FT 14 instead of own items | the 15-question budget with the reading share ≥ 30 % used in Units 17–18 |
| W1 formal e-mail or letter, 60+ words | formal **e-mail**, **minimum 60 words** (model 62), six required elements | as designed (units with formal Sie register keep the 60-word minimum) |
| R1 form (~60 words), R2 notice board (~70 words) | R1 = registration form with instructions; R2 = Rathaus notice board (opening hours, rules, a diversion) | as designed |
| vocabulary 38 | **exactly the 38 approved items** (35 productive, 3 receptive) | tested item by item and in order |

The curriculum-design documents were **not** edited.

## 3. Content inventory

| Item | Count | Ids |
| --- | --- | --- |
| Vocabulary | 38 (35 productive, 3 receptive: *Aufenthaltserlaubnis, überweisen, Umleitung*) | `v19-1` … `v19-38` (plan order) |
| Grammar | 3 concepts + 3 why-notes | `a2-man-regeln-verbote`, `a2-indirekte-fragen`, `a2-wegbeschreibung-praepositionen` |
| Listening | 2 (L1 Bürgeramt: registration, *Sie*; L2 street directions to the post office, *Sie*) | `a2-li-19-01`, `a2-li-19-02` |
| Reading | 2 (R1 registration form; R2 Rathaus notice board) | `a2-re-19-01`, `a2-re-19-02` |
| Speaking | 1 (directions micro-task, *Sie*, 4 turns) | `a2-sp-19-01` |
| Writing | 1 (formal e-mail to the Bürgeramt, ≥ 60 words, 6 required elements) | `a2-wr-19-01` |
| Revision exercises | 8 (3 fill / 3 choice / 2 order; concepts 2 / 3 / 3) | `a2-ex-19-01` … `-08` |
| Final test | 15 (7 grammar, 3 vocabulary, 5 reading and communication); test `unit-19` | `a2-ft-19-01` … `-15` |
| Instructions | 9 | `a2-in-19-*` |

Answer positions: final test 5 / 5 / 5, never three in a row; listening keys 3 / 3 / 2; reading keys 2 / 2 / 2; revision choice answers in three different positions.

## 4. Grammar scope

* **`a2-man-regeln-verbote`.** *man* + modal in the er/sie form (*darf, muss, kann*), *erlaubt / verboten*, *Bitte nicht + Infinitiv*, and the contrast *nicht dürfen* (forbidden) vs. *nicht müssen* (not necessary). **Not used:** Passiv notices (*Hier wird geparkt*), *man* with other verbs than the three modals in rules, *man* in earlier units (earlier tests forbid it there).
* **`a2-indirekte-fragen`.** Exactly two frames: *Können Sie mir sagen, wo / wann / wie …?* and *Ich möchte wissen, ob …*. Verb final; no separable verb, no modal and no Perfekt inside the subordinate clause (only *ist, komme, brauche, dauert, bekomme, darf*). **Not used:** other frames (*Wissen Sie, …*, *Ich frage mich, …*), indirect questions with *warum* or *was*.
* **`a2-wegbeschreibung-praepositionen`.** *Imperativ (Sie)* with *geradeaus / links / rechts*; *bis zu(r)*, *an … vorbei*, *gegenüber von*, *zwischen* (Wo?, Dativ), *neben* (A1), *über* + Akkusativ. **Not used:** adjectives in directions, ordinals (*die zweite Straße*), du/ihr imperative for routes, *entlang*, *hinter / vor* as new items.
* Recycled without teaching: Sie-imperative (unit 14), *mir* (unit 12), *dass*-/*wenn*-clauses (verb final), the comparative *länger* (unit 13), Perfekt (*habe … ausgefüllt*).
* Not used: Konjunktiv II (*Könnten Sie …*), Genitiv, Relativsatz, Passiv, *werden*, *als* as a conjunction.

## 5. Reading questions — no leak of the answer

* Lab questions are German-only; the form and the notice board are non-continuous texts (short lines).
* Final-test reading items carry the German text **untranslated** inside `prompt`; `promptRu` / `promptKy` translate only the instruction and the question (tested: no quotation marks, no run of Latin words, shorter than half the prompt and than 110 characters, no digit that does not occur in the German question).
* Glosses translate words and chunks, never a whole passage sentence. Units 11–18 are not changed.

## 6. Objective → assessment matrix (Unit 19)

| # | Objective | Revision exercises | Final test | Labs |
| --- | --- | --- | --- | --- |
| O1 | Ask for information at an office and understand the answer | E 03, 04, 05 | FT 04, 05, 12 | L1, S1 turn 4, W1 |
| O2 | Complete a simple form and sign | — (labs, word cards) | FT 09, 12 | R1, L1 |
| O3 | Use post and bank services (parcel, stamps, cash machine) | — (labs) | FT 08, 11 | L2, R2 |
| O4 | Understand signs, prohibitions and opening hours | E 01, 02 | FT 01, 02, 03, 11, 15 | R2, L1 |
| O5 | Ask for and give directions (the micro-task) | E 06, 07, 08 | FT 06, 07, 13, 14 | L2, S1, G3 |

Communicative final-test items (a real-life notice, information text, route description or situation): FT 02, 04, 08, 11, 12, 13, 14, 15 — 8 of 15.

## 7. Receptive vocabulary

`UNIT_19_RECEPTIVE_WORDS` (in `unit19/vocabulary.ts`) records the three receptive words. They occur in the unit's texts (*Aufenthaltserlaubnis* in L1 and R1; *überweisen* and *Umleitung* in L2 and R2), in glosses and word cards; they are never a gap answer, never a speaking keyword or hint, never a writing requirement and never the correct final-test answer (tested).

## 8. Realism, safety and neutral scenes

* Genres: Bürgeramt counter (L1), street (L2), form (R1), notice board (R2), street / station (S1), e-mail to an office (W1). Formal register (*Sie*) by design of the unit; the text says so in the unit instruction.
* **No legal advice.** The administrative content describes the **German** procedure as language practice; the unit instruction, the vocabulary instruction and the writing task say that real rules must be checked with the office. No claim about visas, residence status or deadlines beyond the invented practice text (the two-week deadline of L1 is a story detail, not a statement of law).
* Neutral place names (a fictional street *Bahnhofstraße*, Köln in the e-mail); prices in euros.
* Excessive bureaucratic vocabulary is avoided: only the 38 approved words; *Mietvertrag* (unit 13) and *Termin* (unit 15) are recycled; *Aufenthaltserlaubnis* is receptive.

## 9. Kyrgyz and Russian

Both languages are written independently for every field. No artificial bracket is used in a Kyrgyz gloss; where both languages would use the same loan word (*почта*, *банк*, *формуляр*), the Kyrgyz gloss gives its own natural wording (*кол тамга*, *кызмат көрсөтүүчү терезе*, *жол кесилиши*). Terms still open for a native reviewer are recorded in the glossary, §12.

## 10. Not done / left open

Native Kyrgyz, Russian and CEFR review of unit 19; the review package (tooling not generalised); level-test and placement items; UI exposure (A2 is invisible); the `SAME_AS_RU` change; unit 20.
