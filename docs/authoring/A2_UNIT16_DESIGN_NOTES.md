# A2 Unit 16 — implementation notes (Stage 7G)

Unit 16 *Freizeit, Medien und Kultur* (`a2-freizeit-medien`) is authored as production data in `src/data/a2/unit16/` and wired additively into the A2 modules. A2 stays `planned`/invisible; units 17–20, the level test, placement and tutor content stay empty. **No human review has taken place**: `A2_REVIEWS` is `{}`; all German, Russian and Kyrgyz text is an AI-assisted first draft. Units 11–15 are unchanged (their review-package fingerprints are locked in `tests/content-validate/unit-16.test.ts`).

## 1. Decisions applied (from the Stage 7G brief)

| Decision | How it is applied |
| --- | --- |
| Adjective endings **without an article** stay receptive | no adjective without article appears in any task or model text (tested: every attributive adjective needs an article-word); the only exception is the quoted exhibition title *Fotos aus aller Welt* on the poster (a fixed title, not analysed) |
| Do **not** add *eins / keins* to Unit 15 | Unit 15 is untouched; Unit 16 does not use the forms either (tested) |
| *Ich hätte gern* and *Wie wäre es mit …?* are **fixed expressions** | `hätte` only in *hätte gern*, `wäre` only in *Wie wäre es mit …* (tested); both appear without any grammar explanation; the term *Konjunktiv* does not occur |
| **Informal** communication in Unit 16 | L1 (two friends, *du*, `a2-li-16-01`) and S1 (a colleague, *du*, `a2-sp-16-01`) are informal; the grammar dialogues, the writing task (a blog / forum comment) and the speaking hints are informal as well |
| Avoid the formal e-mail and formal telephone-call pattern | **no telephone call and no e-mail in this unit**: L2 is a face-to-face ticket-counter conversation (*Sie*), W1 is a comment for a forum, not an e-mail (tested: no *Sehr geehrte*, *Auf Wiederhören*, *am Telefon* in the unit's dialogues and tasks) |
| Do **not** generalise the review tooling | untouched; no Unit 16 review package is generated |

## 2. Deviations from the Stage 7B design

| Stage 7B design | Implemented | Why |
| --- | --- | --- |
| L2 phone call to a cinema box office (formal, *Sie*) | **face-to-face at the ticket counter** (*Sie*): dates, times, prices, group tickets, payment | brief: avoid repeating the formal telephone-call pattern; the target task *call a cinema* is replaced by *buy tickets at the counter* |
| G2 "six fixed pairs" (not named in the design) | **six named pairs, all Akkusativ** (audit D-7): *sich interessieren für, sich freuen auf, sich freuen über, warten auf, sprechen über, denken an*; the grammar progression lists five, the sixth (*freuen über*) comes from the design's "freuen auf / über". *Wofür? / Worauf?* and the *da(r)-* adverbs are **not used** (tested) | audit D-7 REVISE ("fix a concrete list") |
| G3 ordinals and dates | ordinals 1.–31.: *-te* up to 19., *-ste* from 20., the irregular 1., 3., 7., 8.; used **only in dates** (*der dritte Mai*, *am dritten Mai*, *am 3. Mai*); a test checks every ordinal word in the unit stands in a date | grammar progression ("no ordinals above 31") |
| W1 short review (about 60+ words) | informal forum comment, **minimum 50 words** (model 75) | audit B6: keep production tasks short |
| W1 "what, when (date), opinion with two adjectives, preference, recommendation" | exactly that; plus one verb–preposition pair (patterns accept *interessiere mich für / freue mich auf / gefreut …*) | links the three concepts in one task |
| final test T1–T10 grammar | **7 grammar / 3 vocabulary / 5 reading and communication** (G1 × 3, G2 × 3, G3 × 2 including one reading item). The design's T9 (reflexive from unit 12) and T10 (comparative) are recycled inside other items (*interessiert sich*, *lieber … als*, *besser als*) instead of stand-alone gaps | the brief: assess communicative objectives, not only grammar |
| vocabulary 36 | **exactly the 36 approved items** (33 productive, 3 receptive: *Mannschaft, herunterladen, online*) | the brief; a test compares unit and map item by item and in order |

The curriculum-design documents were **not** edited; this file records the deviations.

## 3. Content inventory

| Item | Count | Ids |
| --- | --- | --- |
| Vocabulary | 36 (33 productive, 3 receptive) | `v16-1` … `v16-36` (plan order) |
| Grammar | 3 concepts + 5 why-notes | `a2-gern-lieber-am-liebsten`, `a2-verben-mit-praepositionen`, `a2-ordinalzahlen-datum` |
| Listening | 2 (L1 friends plan the weekend, informal; L2 ticket counter, formal) | `a2-li-16-01`, `a2-li-16-02` |
| Reading | 2 (R1 events poster, non-continuous; R2 blog text about media habits) | `a2-re-16-01`, `a2-re-16-02` |
| Speaking | 1 (a colleague, *du*, 4 turns) | `a2-sp-16-01` |
| Writing | 1 (informal forum / blog comment, ≥ 50 words, 6 required elements) | `a2-wr-16-01` |
| Revision exercises | 8 (3 fill / 3 choice / 2 order) | `a2-ex-16-01` … `-08` |
| Final test | 15 (7 grammar, 3 vocabulary, 5 reading and communication); test `unit-16` | `a2-ft-16-01` … `-15` |
| Instructions | 9 | `a2-in-16-*` |

Answer positions: final test 5 / 5 / 5, never three in a row; listening keys 3 / 3 / 2; reading keys 2 / 2 / 2; revision choice answers in three different positions.

## 4. Grammar scope

* **`a2-gern-lieber-am-liebsten`.** *gern* after the verb, *lieber* as the special comparative (with *als*), *am liebsten* (verb stays second), *nicht gern*; *besser als* recycled from unit 13. The adverb forms *gerner / mehr gern* appear only as taught mistakes.
* **`a2-verben-mit-praepositionen`.** The six pairs above, Akkusativ only; reflexive pronouns follow the unit-12 pattern; *auf* = future, *über* = present or past in *sich freuen*.
* **`a2-ordinalzahlen-datum`.** See §2. The Dativ ending *-n* after *am* is taught as part of the date pattern, not as a Dativ rule; written dates use the digit and the dot (*3. Mai*).
* Recycled without teaching: imperative (*Schick mir …*, *Geh hin!*, *Komm doch mit!*), *wenn* not used, Perfekt of *sehen* and *sich freuen* in W1, *Kann ich …?* / *Darf ich …?*.
* Not used: *man*, `als` as a conjunction, `dass`, `deshalb`, `denn`, `lassen`, `zu` + Infinitiv, *Lust haben auf* as a rule (the chunk *Hast du Lust?* occurs once), the ihr-imperative (tested).

## 5. Reading questions — no leak of the answer

* Lab questions are German-only.
* Final-test reading items carry the German text **untranslated** inside `prompt`; `promptRu` / `promptKy` translate only the instruction and the question (tested: no quotation marks, no run of Latin words, shorter than half the prompt and than 110 characters, numbers only if the German question itself contains them, no passage sentence reproduced). Details that decide the answer (a child's age, a date) sit inside the German quotation.
* Glosses translate words and chunks, never a whole passage sentence. Units 11–15 are not changed.

## 6. Objective → assessment matrix (Unit 16)

| # | Objective | Revision exercises | Final test | Labs |
| --- | --- | --- | --- | --- |
| O1 | Say what you like to do and prefer, and compare | E 01, 02, 03 | FT 01, 02, 14 | L1, S1 turn 1, W1 |
| O2 | Talk about media use (phone, internet, TV, news) | — (word cards, labs) | FT 08, 10, 12 | R2 |
| O3 | Give a simple opinion on a film or event and recommend it | — (labs) | FT 13, 14 | S1 turn 4, W1 |
| O4 | Understand and give event information: date, time, price | E 07, 08 | FT 06, 07, 11, 15 | L2, R1, S1 turn 3, W1 |
| O5 | Say what you are interested in, look forward to or wait for | E 04, 05, 06 | FT 03, 04, 05 | L1, S1 turn 2, W1 |

Communicative final-test items (a real-life poster, text, message or situation): FT 08, 09, 11, 12, 13, 14, 15 and FT 07 (a date a speaker gives) — 8 of 15.

## 7. Receptive vocabulary

`UNIT_16_RECEPTIVE_WORDS` (in `unit16/vocabulary.ts`) records *Mannschaft*, *herunterladen* and *online*. They occur in the unit's texts (*online*: L1, L2, R1, R2; *herunterladen*: R2 as *lade … herunter*; *Mannschaft*: R2), in glosses and word cards; they are never a required gap answer, speaking keyword or hint, writing requirement or **correct** final-test answer (tested). *Mannschaft* appears once as a distractor (FT 09).

## 8. Realism and variety

* **Genres:** informal chat (L1, S1), service counter (L2), poster (R1), blog text (R2), forum comment (W1); **no e-mail, no telephone call**.
* **Dates:** written with the digit and the dot, spoken with the ordinal word; weekday + date + time appear together (*Freitag, 3. Mai, 20 Uhr*); the months are the A1 month names; no year.
* **Prices:** euro amounts as plain numbers; family and child tickets are used for the calculation tasks (L2: 9 + 9 + 6 = 24).
* **Neutral scenes:** a city park festival, a cinema, a museum; no local festival or sport is assumed. Loan words (*Internet, Museum, Theater, Konzert, Foto*) carry a short bracket in Kyrgyz so that the validator's identity check passes without the `SAME_AS_RU` allow-list.

## 9. Kyrgyz and Russian

Both languages are written independently for every field. Disputed Kyrgyz terms are not used as labels; the ordinal numbers are written with the Kyrgyz ordinal suffixes in dates (*3-май*) and described, not named, in the explanation. Unresolved Unit 16 terms: `A2_KY_TERMINOLOGY_GLOSSARY.md` §9. All Kyrgyz remains an AI draft and needs native review.

## 10. Not done / left open

Native Kyrgyz, Russian and CEFR review of unit 16; the review package (the tooling was deliberately not generalised in this stage); level-test and placement items; UI exposure (A2 is invisible). Open questions: `docs/implementation/A2_STAGE7G_UNIT16.md`.
