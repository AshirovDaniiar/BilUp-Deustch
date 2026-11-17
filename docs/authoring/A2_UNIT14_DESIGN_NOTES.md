# A2 Unit 14 — implementation notes (Stage 7E)

Unit 14 *Gesundheit und Wohlbefinden* (`a2-gesundheit`) is authored as production data in `src/data/a2/unit14/` and wired additively into the A2 modules. A2 stays `planned`/invisible; units 15–20, the level test, placement and tutor content stay empty. **No human review has taken place**: `A2_REVIEWS` is `{}`; all German, Russian and Kyrgyz text is an AI-assisted first draft. Units 11, 12 and 13 are unchanged (their review-package fingerprints are locked in `tests/content-validate/unit-14.test.ts`). The unit-13 *Komparativ* scope (regular forms, three irregular series, `als` only) is **not** touched; Unit 14 uses only the single comparatives it needs (*schlechter*, *besser*, *früher* as plain words in dialogue).

## 1. Deviations from the Stage 7B design

| Stage 7B design | Implemented | Why |
| --- | --- | --- |
| G1 `a2-imperativ`: du / ihr / Sie, irregular, separable, reflexive, `sein`-imperative | **du and Sie only**; vowel change e→i(e) (*nimm, sprich, iss*), separable + reflexive (*ruh dich aus*), `nicht`, `bitte`. **No `ihr`, no `sei/seien Sie`** | audit §7 proposal 3 (cap the imperative to du and Sie); an *ihr* form never appears, not even as a distractor |
| body vocabulary 11 items (audit: trim to 8–9) | **exactly the 38 approved items** (34 productive, 4 receptive) | the brief: follow the approved vocabulary map; a test compares the unit with the map, item by item and in order |
| T9 reflexive pronoun and T10 *konnte / musste* as stand-alone items | not stand-alone: reflexives are recycled in E3, E6 and the dialogues (*sich ausruhen, sich fühlen*); the Präteritum modal is **not** assessed | the brief: assess communicative objectives, not only grammar; Präteritum modals would add a fourth structure to a three-concept unit |
| final test T1–T10 grammar, T11–T13 vocabulary, T14–T15 reading | **6 grammar / 3 vocabulary / 6 reading and communication** | the Stage 7D / audit §E principle; communicative items: doctor's instruction (FT 02), friend's advice (FT 03, 13), appointment note (FT 10), leaflet (FT 11), emergency call (FT 12), sick note (FT 14), doctor's dialogue (FT 15) |
| emergency call placed in unit 19 | **emergency micro-task in unit 14** (audit D-8 REVISE): the Notruf **112** and the three questions of an emergency call (*Wo sind Sie? Was ist passiert? Bleiben Sie am Telefon*) are in reading text R2 and assessed in FT 12; the vocabulary (*Notruf, Krankenwagen, Notaufnahme*) is the approved set | the user's brief for this stage asks for emergency vocabulary and simple emergency communication. The Stage 7B design documents were **not** edited |
| R1 *package leaflet* | an **exercise text** (`Übungstext`), marked as such in the text and in the unit instructions | health content is language practice, not medical advice |
| `mir tut … weh` | taught as a chunk through word cards, dialogues and the writing task (Dativ pronoun, unit 12); the possessive reflexive Dativ (*sich die Zähne putzen*) is excluded (audit B1-6) | audit: body-care phrases with a possessive Dativ are not used in tasks |
| exercise table E1–E8 | exactly as designed: fill / choice / order / fill / choice / order / fill / choice; concept 1 × 3, concept 2 × 2, concept 3 × 3 | the plan |

## 2. Content inventory

| Item | Count | Ids |
| --- | --- | --- |
| Vocabulary | 38 (34 productive, 4 receptive: *Grippe, Untersuchung, untersuchen, Krankschreibung*) | `v14-1` … `v14-38` (plan order) |
| Grammar | 3 concepts + 5 why-notes | `a2-imperativ`, `a2-sollen-duerfen`, `a2-wenn-saetze` |
| Listening | 2 (L1 formal phone call to a practice; L2 a friend gives advice, du) | `a2-li-14-01`, `a2-li-14-02` |
| Reading | 2 (R1 leaflet exercise text; R2 stress tips + emergency box) | `a2-re-14-01`, `a2-re-14-02` |
| Speaking | 1 (at the doctor's, Sie, 4 turns) | `a2-sp-14-01` |
| Writing | 1 (formal e-mail to a supervisor reporting illness, ≥ 50 words, 8 required elements) | `a2-wr-14-01` |
| Revision exercises | 8 (3 fill / 3 choice / 2 order) | `a2-ex-14-01` … `-08` |
| Final test | 15 (6 grammar, 3 vocabulary, 6 reading and communication); test `unit-14` | `a2-ft-14-01` … `-15` |
| Instructions | 9 | `a2-in-14-*` |

Answer positions: final test 5 / 5 / 5, never three in a row; listening keys 3 / 3 / 2; reading keys 2 / 2 / 2; revision choice answers in three different positions.

## 3. Grammar scope

* **`a2-imperativ`.** Taught: du-form (stem, no *-st*, no *du*), vowel change e → i(e), Sie-form (infinitive + *Sie*), reflexive and separable verbs, `nicht`, `bitte`. Not taught: *ihr*, *sein*, the polite request with Konjunktiv II. Tests reject *Bleibt / Nehmt / Seid / Sei / Seien Sie* anywhere in the German content.
* **`a2-sollen-duerfen`.** *soll / darf* and their forms in the present; *müssen / können* recycled; the *nicht müssen* ≠ *nicht dürfen* contrast is a taught pitfall. Not taught: *sollte*, Präteritum of the modals, `man` (tested: the word *man* does not occur in the unit's German).
* **`a2-wenn-saetze`.** `wenn` = condition / habit, verb at the end, inversion in the main clause that follows. Not taught: `als`, `wenn` + Konjunktiv II; none of *dass / deshalb / obwohl / damit* occurs (tested).
* Attributive adjectives keep the unit-13 scope (after *ein-/kein-/mein-*, singular, Nominativ / Akkusativ); a test re-checks that wherever one occurs (*eine halbe Stunde, eine gute Freundin*).

## 4. Reading questions — no leak of the answer

* Lab questions are German-only; their stems avoid *man* (*Wann soll ein Erwachsener zum Arzt gehen?*).
* Final-test reading items carry the German text **untranslated** inside `prompt`; `promptRu` / `promptKy` translate only the instruction and the question (tested: no quotation marks, no run of Latin words, shorter than half the prompt and than 110 characters, no copied digits, no passage sentence reproduced).
* Glosses translate words and chunks, never a whole passage sentence. Units 11–13 are not changed.

## 5. Objective → assessment matrix (Unit 14)

| # | Objective | Revision exercises | Final test | Labs |
| --- | --- | --- | --- | --- |
| O1 | Say what hurts and how you feel; understand what a doctor's questions ask | — (word cards, labs) | FT 07, 08, 09, 15 | L1, S1 turns 1–3, W1 |
| O2 | Make an appointment and communicate with a practice | — (labs) | FT 10 | L1, S1, W1 |
| O3 | Understand and give advice and instructions, incl. the emergency call | E 01, 02, 03 | FT 01, 02, 03, 11, 12, 13 | L2, R1, R2 |
| O4 | Say what you should, may or must not do | E 04, 05 | FT 04, 05, 14 | S1 turn 4, W1, L2 |
| O5 | Explain what you do when something happens (`wenn`) | E 06, 07, 08 | FT 06 | L2, R2, W1 |

Communicative final-test items (a real-life message, instruction or situation): FT 02, 03, 10, 11, 12, 13, 14, 15 — 8 of 15.

## 6. Receptive vocabulary

`UNIT_14_RECEPTIVE_WORDS` (in `unit14/vocabulary.ts`) records the four receptive words. They occur in the unit's texts (*Grippe* L2, *Untersuchung* L1, *untersuchen* S1, *Krankschreibung* L2), in glosses and word cards; they are never a required gap answer, speaking keyword or hint, writing requirement or **correct** final-test answer (tested).

## 7. Realism, register and safety

* Registers: L1 and S1 are formal (*Sie*), L2 and the grammar dialogues informal (*du*). The telephone call L1 is the unit's only phone scenario.
* Dates and times: weekday + clock time only (*Mittwoch um neun Uhr*, *heute um 16 Uhr*).
* No diagnosis words, no medicine names beyond *Tablette / Salbe*, no doses outside the marked exercise leaflet (tested); the unit instruction (RU and KY) states that the material is for language learning and does not replace a doctor's advice.
* Emergency: the call script is reproduced as language, in the second person (*Sagen Sie: …*), with the number **112**; Russian and Kyrgyz explain it in the word cards (*Notruf*) only.

## 8. Kyrgyz and Russian

Both languages are written independently for every field. Disputed Kyrgyz terms (K4, K7–K9, K12–K14, K16, K18 of Unit 11) are not used as labels: the *wenn* clause is described, not named, and the finite-verb term is avoided; modal verbs use the A1 term *модалдык этиштер*. Unresolved Unit 14 terms are recorded in `A2_KY_TERMINOLOGY_GLOSSARY.md` §7. All Kyrgyz remains an AI draft and needs native review. Medical terms (*Salbe, Krankschreibung, Notaufnahme, Grippe*) need reviewer-chosen glosses.

## 9. Not done / left open

Native Kyrgyz, Russian and CEFR review of unit 14; the review package (the tooling is still Unit-11-specific); level-test and placement items; UI exposure (A2 is invisible). Open questions are listed in `docs/implementation/A2_STAGE7E_UNIT14.md`.
