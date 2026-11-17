# A2 Unit 20 — implementation notes (Stage 7K)

Unit 20 *Pläne, Einladungen und gemeinsame Entscheidungen* (`a2-plaene-einladungen`) — the **capstone of A2** — is authored as production data in `src/data/a2/unit20/` and wired additively into the A2 modules. With it all ten planned A2 units (11–20) exist. A2 stays `planned`/`releasedLocales: []`/invisible; the level test, placement and tutor content stay empty and **release validation still fails on purpose**. All German, Russian and Kyrgyz is an AI-assisted first draft (`A2_REVIEWS = {}`).

## 1. Decisions applied (from the Stage 7K brief)

| Decision | How it is applied |
| --- | --- |
| Repair the two damaged regexes of the Unit 18 test first | `/bwirdb/g` → `/\bwird\b/g` and `/d{3,}/g` → `/\d{3,}/g` in `tests/content-validate/unit-18.test.ts` only; the surrounding assertions were read first (the *wird* loop checks that every *wird* stands in the weather chunk; the digit loop checks that a number in a translated question also occurs in the German question). Both loops now execute and pass; no Unit 18 data was touched |
| *Wie wäre es mit …?* only as the approved fixed expression | taught as a **chunk** (same status as *hätte gern*, audit D-3): *Wie wäre es mit + Dativ*, never explained as a Konjunktiv form; no other *wäre / würde / könnte* anywhere in the unit (tested) |
| Respect all earlier grammar boundaries | see §4; no *werden*, no *zu* + Infinitiv, no *obwohl* / *damit*, no Relativsatz, no Passiv, no ihr-imperative, no *entweder … oder* |
| Natural, varied contexts; not every text a formal e-mail | L1 two friends (informal, *du*); L2 a colleague invited to a birthday (formal-friendly, *Sie*); R1 a personal invitation card (*du*); R2 a short e-mail exchange between friends; S1 negotiating with a friend (*du*); W1 an informal invitation message. Only L2 is *Sie* |
| Kyrgyz dates provisional | dates are written with digits (*14. Juni*, *12. Mai*); the Kyrgyz renderings follow the provisional form of glossary §10.3 (*12-майда*); not a decision |
| No SAME_AS_RU validator, no generalised review tooling, no bracket removal in Units 12–16 | validator, rules, `reviews.ts`, review tooling and Units 11–19 content untouched |

## 2. Deviations from the Stage 7B design

| Stage 7B design | Implemented | Why |
| --- | --- | --- |
| L1 two friends plan the weekend **by phone** | two friends talk (no telephone vocabulary) | the telephone register is not part of the unit's vocabulary |
| W1 invitation message about 60+ words, "date with ordinal" | informal invitation message, **minimum 60 words**, the date written as a digit + point (*21. Juni*) | ordinal words stay limited to recognition (FT 07); digits are the productive form |
| final test T1–T15 (10 grammar, 3 vocabulary, 2 reading) | **7 grammar (G1 2, G2 2, G3 2, one recycled date item) / 3 vocabulary / 5 reading and communication** | the composition used in Units 17–19 (reading share ≥ 30 %); the plan's recycled items are covered in the readings |
| G3 integration: *entweder … oder* receptive | not shown at all | the progression marks it receptive; it is not needed in any text |
| vocabulary 37 | **exactly the 37 approved items** (33 productive, 4 receptive: *ablehnen, Alternative, abstimmen, Kompromiss*) | tested item by item and in order |

The curriculum-design documents were **not** edited. No necessary deviation from the approved grammar progression arose.

## 3. Content inventory

| Item | Count | Ids |
| --- | --- | --- |
| Vocabulary | 37 (33 productive, 4 receptive) | `v20-1` … `v20-37` (plan order) |
| Grammar | 3 concepts + 3 why-notes | `a2-vorschlaege-verabredungen`, `a2-absichten-plaene`, `a2-satzverbindungen-integration` |
| Listening | 2 (L1 friends plan the weekend, *du*; L2 invitation to a birthday, *Sie*) | `a2-li-20-01`, `a2-li-20-02` |
| Reading | 2 (R1 invitation card; R2 e-mails: decline, reason, alternative) | `a2-re-20-01`, `a2-re-20-02` |
| Speaking | 1 (negotiate the weekend with a friend, *du*, 4 turns) | `a2-sp-20-01` |
| Writing | 1 (informal invitation message, ≥ 60 words, 8 required elements) | `a2-wr-20-01` |
| Revision exercises | 8 (3 fill / 3 choice / 2 order; concepts 3 / 3 / 2) | `a2-ex-20-01` … `-08` |
| Final test | 15 (7 grammar, 3 vocabulary, 5 reading and communication); test `unit-20` | `a2-ft-20-01` … `-15` |
| Instructions | 9 | `a2-in-20-*` |

Answer positions: final test 5 / 5 / 5, never three in a row; listening keys 3 / 3 / 2; reading keys 2 / 2 / 2; revision choice answers in three different positions.

## 4. Grammar scope

* **`a2-vorschlaege-verabredungen`.** *Wollen wir …?* (infinitive last), *Lass uns …* (du-imperative; *lassen* is not taught as a verb), *Wie wäre es mit + Dativ* (chunk), *Ich schlage vor, dass …* (verb final), accepting (*Ja, gern / Gute Idee / Einverstanden*), declining politely (*Leider kann ich nicht, denn … / Tut mir leid, aber …*) and proposing an alternative.
* **`a2-absichten-plaene`.** *vorhaben* (particle last), *wollen, möchten, planen*; future time words (*übermorgen, bald, spätestens, am Wochenende*); future = Präsens + time word (unit 18). **Not used:** *werden*, *zu* + Infinitiv.
* **`a2-satzverbindungen-integration`.** Cumulative practice of *und / aber / oder / denn* (verb second), *weil / wenn / dass* (verb final), *deshalb* (inversion). **No new connector.**
* Recycled without teaching: Perfekt (*war … im Kino*), dates with digits (unit 16), the spelled-out date in FT 07 (recognition), polite requests (unit 15), *sollen* (*Sollen wir abstimmen?*).
* Not used: Konjunktiv II as a form (except the chunk), Genitiv, Passiv, Relativsatz, ihr-imperative, *entweder … oder*, directions, the weather chunk of Unit 18.

## 5. Reading questions — no leak of the answer

* Lab questions are German-only.
* Final-test reading items carry the German text **untranslated** inside `prompt`; `promptRu` / `promptKy` translate only the instruction and the question (tested: no quotation marks, no run of Latin words, shorter than half the prompt and than 110 characters, no number of three or more digits that does not occur in the German question). FT 07 (a spelled-out date) is a grammar item, not a reading item.
* Glosses translate words and chunks, never a whole passage sentence. Units 11–19 are not changed.

## 6. Objective → assessment matrix (Unit 20)

| # | Objective | Revision exercises | Final test | Labs |
| --- | --- | --- | --- | --- |
| O1 | Invite someone and answer an invitation (accept or decline politely with a reason) | E 01, 02 | FT 01, 02, 04, 13 | L2, R1, S1 turn 3 |
| O2 | Make and respond to suggestions; propose an alternative | E 03 | FT 12, 13, 15 | L1, R2, S1 turn 1 |
| O3 | Agree on a plan or compromise | E 01 | FT 15 | L1, S1 turns 3–4 |
| O4 | Talk about intentions and future plans | E 04, 05, 06 | FT 03, 04, 14 | L1, S1, W1 |
| O5 | Write an invitation and a reply, using reasons, conditions and dates | E 07, 08 | FT 05, 06, 07, 11 | R1, R2, W1 |

Communicative final-test items (a real-life invitation, message, situation, notice or exchange): FT 01, 02, 04, 11, 12, 13, 14, 15 — 8 of 15.

## 7. Receptive vocabulary

`UNIT_20_RECEPTIVE_WORDS` (in `unit20/vocabulary.ts`) records the four receptive words. They occur in the unit's texts (*ablehnen* in L2; *Alternative* in R2; *abstimmen* and *Kompromiss* in L1; *Kompromiss* also in the S1 prompt of the interlocutor), in glosses and word cards; they are never a gap answer, never a speaking keyword or hint, never a writing requirement and never the correct final-test answer (tested).

## 8. Realism and cultural neutrality

* Genres: friends' planning (L1), a colleague's invitation (L2), an invitation card (R1), e-mails between friends (R2), negotiation (S1), an invitation message (W1).
* Hospitality customs (what to bring, how to decline) are shown as **German** conventions: the unit instruction says so explicitly (RU and KY). The Kyrgyz formulas are not word-for-word translations; they are drafts for a native reviewer (glossary §13).

## 9. Kyrgyz and Russian

Both languages are written independently for every field. No artificial bracket is used; where both languages would use the same loan word (*план*, *вечеринка / кече*), the Kyrgyz gloss gives its own wording (*иш планы*, *достор чогулган кече*). Open terms: glossary §13.

## 10. Not done / left open

Native Kyrgyz, Russian and CEFR review of unit 20; the review package (tooling not generalised); the level test (`level-a2`), placement and tutor content; UI exposure and release preparation (A2 is invisible); the `SAME_AS_RU` change.
