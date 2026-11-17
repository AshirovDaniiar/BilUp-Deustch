# A2 Unit 15 — implementation notes (Stage 7F)

Unit 15 *Essen, Einkaufen und Dienstleistungen* (`a2-essen-einkaufen`) is authored as production data in `src/data/a2/unit15/` and wired additively into the A2 modules. A2 stays `planned`/invisible; units 16–20, the level test, placement and tutor content stay empty. **No human review has taken place**: `A2_REVIEWS` is `{}`; all German, Russian and Kyrgyz text is an AI-assisted first draft. Units 11–14 are unchanged (their review-package fingerprints are locked in `tests/content-validate/unit-15.test.ts`).

## 1. Deviations from the Stage 7B design

| Stage 7B design | Implemented | Why |
| --- | --- | --- |
| G1 adjective endings after der/die/das/dieser/welcher **and in the plural** | Nominativ and Akkusativ, singular and plural **after the definite article / dieser / welcher** (`-e`, and `-en` for *den / diesen / welchen* and the plural). No Dativ, no Genitiv, **no plural without article** (*frische Äpfel*) | grammar progression ("Dativ and Genitiv endings receptive only") and audit B1-5 ("acceptable if Nom/Akk only"); the unit-13 rule still holds: no adjective after a Dativ preposition |
| G2 quantity expressions, *einen / keinen / welche*, *wie viel / wie viele* | as designed; feminine *eine / keine* shown with the masculine forms; the neuter *eins / keins* **not taught** (a test rejects it) | keeps the pronoun set to one table; neuter is rare in shop dialogues |
| G3 polite chunks incl. *Ich hätte gern* | a **closed list**: *Können Sie …? Darf ich …? Ich möchte … Ich hätte gern …* (+ *bitte*, *Entschuldigung*). `hätte` occurs **only** in `hätte gern`: never in an explanation, a distractor or another phrase (tested). The term *Konjunktiv* does not occur | audit D-3 conditions (1) and (2); condition (3), the CEFR reviewer's confirmation, is open |
| vocabulary 38 | **exactly the 38 approved items** (36 productive, 2 receptive: *Lieferung, liefern*) | the brief and the approved map; a test compares unit and map item by item and in order |
| final test T1–T10 grammar, T11–T13 vocabulary, T14–T15 reading | **7 grammar / 3 vocabulary / 5 reading and communication**; every grammar item sits in a shop or restaurant sentence. The design's T9 (comparative) and T10 (*passen* + Dativ pronoun) are recycled **inside** other items (FT 03 *passt mir nicht*, L2 *Größe größer*, *günstiger Preis*) instead of as stand-alone gaps | the brief: assess communicative objectives, not only grammar |
| W1 formal e-mail, "about 60+ words" | formal e-mail to a shop about an exchange, **minimum 50 words** (model 54) | audit B6: keep formal tasks short; this is the second formal task of the plan (units 13, 15, 19) |
| S1 phone a hairdresser **or** repair shop | the hairdresser call; the repair shop appears in R2 and FT 15 | one scenario per unit |
| prices and measures | plain numbers in the question or text (*4,50 Euro*, *200 Gramm*); no real-world price knowledge is required | the app is not a price guide |

The curriculum-design documents were **not** edited; this file records the deviations.

## 2. Content inventory

| Item | Count | Ids |
| --- | --- | --- |
| Vocabulary | 38 (36 productive, 2 receptive: *Lieferung, liefern*) | `v15-1` … `v15-38` (plan order) |
| Grammar | 3 concepts + 5 why-notes | `a2-adjektivendungen-definit`, `a2-mengen-indefinitpronomen`, `a2-hoefliche-bitten` |
| Listening | 2 (L1 restaurant, L2 clothes shop; both formal, *Sie*) | `a2-li-15-01`, `a2-li-15-02` |
| Reading | 2 (R1 menu, non-continuous; R2 flyer of offers + repair-service notice) | `a2-re-15-01`, `a2-re-15-02` |
| Speaking | 1 (telephone call to a hairdresser, *Sie*, 4 turns) | `a2-sp-15-01` |
| Writing | 1 (formal e-mail to a shop: exchange, ≥ 50 words, 8 required elements) | `a2-wr-15-01` |
| Revision exercises | 8 (3 fill / 3 choice / 2 order) | `a2-ex-15-01` … `-08` |
| Final test | 15 (7 grammar, 3 vocabulary, 5 reading and communication); test `unit-15` | `a2-ft-15-01` … `-15` |
| Instructions | 9 | `a2-in-15-*` |

Answer positions: final test 5 / 5 / 5, never three in a row; listening keys 3 / 3 / 2; reading keys 2 / 2 / 2; revision choice answers in three different positions.

## 3. Grammar scope

* **`a2-adjektivendungen-definit`.** Weak endings: `-e` everywhere except `-en` after *den / diesen / welchen* and in the plural (*die roten Hosen*). The test re-checks the ending of **every** attributive adjective in the unit against the determiner and the noun (including the unit-13 *ein-* endings, e.g. *ein günstiger Preis*, *eine kleine Portion*) and rejects any adjective after a Dativ preposition + article, or without an article.
* **`a2-mengen-indefinitpronomen`.** Measure + noun without article and without *von* (*ein Kilo Äpfel*); masculine / neuter measures stay unchanged after a number (*zwei Kilo, drei Liter, vier Stück*), feminine measures take *-n / -en* (*zwei Flaschen*); *welche / einen / keinen / keine*; *wie viel* (price, uncountable) vs. *wie viele* (countable plural).
* **`a2-hoefliche-bitten`.** See §1. The rude forms (*Ich will …*, *Gib mir …!*) occur only as taught mistakes and distractors.
* Recycled without teaching: *du / Sie* imperative (unit 14, in *Bitte behalten Sie die Quittung*), *dürfen* (*Darf ich …?*), *mir* (unit 12), single comparatives (*größer, kürzer, günstiger*), Perfekt of *kaufen* (*gekauft*), *weniger*.
* Not used: *man*, `als` as a conjunction, `dass`, `deshalb`, ordinals, `lassen`, Konjunktiv II forms other than the one chunk (all tested).

## 4. Reading questions — no leak of the answer

* Lab questions are German-only.
* Final-test reading items carry the German text **untranslated** inside `prompt`; `promptRu` / `promptKy` translate only the instruction and the question (tested: no quotation marks, no run of Latin words, shorter than half the prompt and than 110 characters, no copied numbers, no passage sentence reproduced). Customer details that decide the answer (a diet, a budget, a size) sit **inside** the German quotation.
* Glosses translate words and chunks, never a whole passage sentence. Units 11–14 are not changed.

## 5. Objective → assessment matrix (Unit 15)

| # | Objective | Revision exercises | Final test | Labs |
| --- | --- | --- | --- | --- |
| O1 | Buy food in the right quantities and ask what is available | E 04, 05, 06 | FT 04, 05, 06, 12 | L1, R2, S1 |
| O2 | Order in a restaurant, ask about ingredients, express taste | — (labs, word cards) | FT 07, 10, 11 | L1, R1 |
| O3 | Buy clothes: size, fit, price, exchange | E 01, 02, 03 | FT 01, 02, 03, 13, 14 | L2, W1 |
| O4 | Use a service and make polite requests | E 07, 08 | FT 07, 09, 14, 15 | S1, W1, R2 |
| O5 | Read menus, price lists, offers and receipts | — (labs) | FT 08, 11, 12, 15 | R1, R2 |

Communicative final-test items (a real-life menu, flyer, message, dialogue or shop sentence): FT 07, 08, 09, 11, 12, 13, 14, 15 — 8 of 15.

## 6. Receptive vocabulary

`UNIT_15_RECEPTIVE_WORDS` (in `unit15/vocabulary.ts`) records *Lieferung* and *liefern*. They occur in the flyer text (R2: *Lieferung ab 30 Euro kostenlos*, *Wir liefern Ihr Fahrrad*), its glosses and the word cards; they are never a required gap answer, speaking keyword or hint, writing requirement or **correct** final-test answer (tested).

## 7. Realism and register

* Both dialogues and the speaking task are formal (*Sie*); the grammar dialogues mix *Sie* (shop, café) and neutral turns. The audit asks for informal speaking between units 15 and 19 — the plan places it in units 16 and 18.
* Food, measures and clothes are glossed as **German items** (*Wurst, Scheibe, Dose, Kleid*), not by local equivalents; *vegetarisch* is glossed as "no meat and no fish". Prices are euro amounts with the German decimal comma.
* Dietary wording is limited to *vegetarisch* and a guest who eats no meat and no fish.

## 8. Kyrgyz and Russian

Both languages are written independently for every field. Disputed Kyrgyz terms (K4, K7–K9, K12–K14, K16, K18 of Unit 11) are not used as labels; adjective endings keep the Unit 13 wording (*аякталыш*). Food and clothing words with an identical Russian and Kyrgyz form carry a short bracket so the validator does not flag identity (*колбаса (…)*, *пальто (…)*, *томат (помидор)*). Unresolved Unit 15 terms: `A2_KY_TERMINOLOGY_GLOSSARY.md` §8. All Kyrgyz remains an AI draft and needs native review.

## 9. Not done / left open

Native Kyrgyz, Russian and CEFR review of unit 15 (including the D-3 confirmation of *Ich hätte gern*); the review package (the tooling is still Unit-11-specific); level-test and placement items; UI exposure (A2 is invisible). Open questions: `docs/implementation/A2_STAGE7F_UNIT15.md`.
