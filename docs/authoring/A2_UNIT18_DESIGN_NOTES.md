# A2 Unit 18 — implementation notes (Stage 7I)

Unit 18 *Reisen, Urlaub und Mobilität* (`a2-reisen-urlaub`) is authored as production data in `src/data/a2/unit18/` and wired additively into the A2 modules. A2 stays `planned`/invisible; units 19–20, the level test, placement and tutor content stay empty. **No human review has taken place**: `A2_REVIEWS` is `{}`; all German, Russian and Kyrgyz text is an AI-assisted first draft. Units 11–17 are unchanged (their review-package fingerprints are locked in `tests/content-validate/unit-18.test.ts`).

## 1. Decisions applied (from the Stage 7I brief)

| Decision | How it is applied |
| --- | --- |
| *als* in Unit 17 stays limited to one completed past event; its scope is not expanded | Unit 17 untouched; Unit 18 uses no *als* as a conjunction at all (only the comparison *kühler als*, unit 13; tested) |
| `SAME_AS_RU` proposal approved in principle, **no validator change** | validator and `reviews.ts` untouched; Unit 18 again needs no allow-list: no Kyrgyz gloss repeats the Russian one and no artificial bracket is used (tested) |
| Meaningful informal communication | **L2** (two friends plan the summer, *du*, `a2-li-18-02`), **S1** (a conversation with an acquaintance about a holiday, *du*, `a2-sp-18-01`), **R2** (a postcard to a friend) and **W1** (a postcard) are informal |
| Not all communication a formal travel-agency interaction | there is **no travel-agency dialogue, no telephone call and no e-mail** in the unit: L1 is a conversation at a **station ticket counter** (*Sie*), R1 a brochure; the travel-agency theme appears only as a vocabulary item and in the brochure (tested) |
| Previous units unchanged | fingerprints locked |

## 2. Deviations from the Stage 7B design

| Stage 7B design | Implemented | Why |
| --- | --- | --- |
| L1 travel agency (formal, *Sie*): destination, dates, accommodation, price | **ticket counter at a station** (*Sie*): destination, train time, return price, platform, directions to the platform, luggage, travel insurance | brief: do not make all communication formal travel-agency interactions; the target task *buy a ticket* is kept |
| S1 book a holiday at a travel agency (*Sie*) | **informal conversation with an acquaintance** (*du*, 4 turns): where were you, what did you do (Perfekt), the weather, the next trip (present + time word) | the decision of this stage: the speaking scenario must be informal |
| W1 informal card or e-mail (60+ words) | informal **postcard**, **minimum 50 words** (model 59) | audit B6 (short production tasks); no e-mail in the unit |
| R2 holiday e-mail or postcard in Perfekt with a future plan | postcard from Turkey: Perfekt events, a problem on the way (a traffic jam, a closed petrol station, a stranger helps), the border and customs, a plan | covers the objective *problems during travel and asking for help* |
| G2 `a2-zukunft-praesens-werden`: *werden* mainly receptive | **present + time word** is the core; *werden* is **productive only in the weather chunk** `Es wird …` (kalt, sonnig, regnen); every other *werden* sentence stays recognition-only (E8 and FT 05 ask for *wird* in a forecast) | the design asks E8 / T8 to fill *wird*; the scope is capped to the chunk |
| G1 country genders limited to *die Schweiz, die Türkei, die USA* | as designed; no other country with an article appears (tested) | grammar progression |
| final test T1–T15 (T10 date expression for a trip ↻ ordinals) | **7 grammar (G1 × 3, G2 × 4) / 3 vocabulary / 5 reading and communication**; T9 (comparative) is FT 07; the date expression is recycled in R1 (*3. bis 10. August*) as recognition | the brief: assess practical communication |
| vocabulary 39 | **exactly the 39 approved items** (33 productive, 6 receptive) | the brief; a test compares unit and map item by item and in order |
| target task "directions" | a short directions exchange in L1 (*Gehen Sie geradeaus, dann links*, A1 material recycled, Sie-imperative from unit 14); not a separate concept | the progression has no directions concept |

The curriculum-design documents were **not** edited.

## 3. Content inventory

| Item | Count | Ids |
| --- | --- | --- |
| Vocabulary | 39 (33 productive, 6 receptive: *Prospekt, Reiseversicherung, Zoll, Fähre, Wettervorhersage, Grenze*) | `v18-1` … `v18-39` (plan order) |
| Grammar | 2 concepts + 4 why-notes | `a2-praepositionen-reiseziele`, `a2-zukunft-praesens-werden` |
| Listening | 2 (L1 station ticket counter, *Sie*; L2 two friends plan the summer, *du*) | `a2-li-18-01`, `a2-li-18-02` |
| Reading | 2 (R1 holiday brochure; R2 postcard from Turkey) | `a2-re-18-01`, `a2-re-18-02` |
| Speaking | 1 (informal talk about a holiday, *du*, 4 turns) | `a2-sp-18-01` |
| Writing | 1 (informal postcard, ≥ 50 words, 6 required elements) | `a2-wr-18-01` |
| Revision exercises | 8 (3 fill / 3 choice / 2 order; concepts 4 / 4) | `a2-ex-18-01` … `-08` |
| Final test | 15 (7 grammar, 3 vocabulary, 5 reading and communication); test `unit-18` | `a2-ft-18-01` … `-15` |
| Instructions | 9 | `a2-in-18-*` |

Answer positions: final test 5 / 5 / 5, never three in a row; listening keys 3 / 3 / 2; reading keys 2 / 2 / 2; revision choice answers in three different positions.

## 4. Grammar scope

* **`a2-praepositionen-reiseziele`.** *Wohin?* — *nach* (cities, countries without article), *in* + Akkusativ (*die Schweiz, die Türkei, in die Berge*), *an* + Akkusativ (*ans Meer, an den See*), *zu* + Dativ (*zu meiner Tante, zum Bahnhof*); *Wo?* — *in, am, im, bei*; *Woher?* — *aus, von*. The pairs are taught as memorised units, not as a translation rule (RU *в / на*, KY case suffixes). *auf die Insel* appears as recognition (R1 gloss). Not taught: other countries with an article, *bis / entlang / über* as route prepositions, Dativ endings after a preposition with an adjective (tested as in Units 13–17).
* **`a2-zukunft-praesens-werden`.** The present with a time word (*Morgen, Im Sommer, In zwei Wochen, Nächstes Jahr, Nächste Woche*); time word first → verb second; *es wird* + adjective / infinitive for the weather. The fixed time expressions *nächstes Jahr / nächste Woche* contain an adjective without an article; they are allowed as fixed expressions (the unit-13/15 rule for adjective endings is otherwise kept, and the tests exempt exactly these two expressions).
* Recycled without teaching: Perfekt with *haben* / *sein* (unit 11; *angekommen, gefahren, geschwommen*), Präteritum of *sein / haben / müssen* (*hatten, mussten, war*), *Komparativ* (unit 13), the Sie-imperative (unit 14), ordinals in dates (unit 16, recognition only), *lieber* (unit 16).
* Not used: *man*, *als* / *dass* / *deshalb* in new roles, Genitiv, *werden* for intentions, Futur II.

## 5. Reading questions — no leak of the answer

* Lab questions are German-only (no *man* in their stems).
* Final-test reading items carry the German text **untranslated** inside `prompt`; `promptRu` / `promptKy` translate only the instruction and the question (tested: no quotation marks, no run of Latin words, shorter than half the prompt and than 110 characters, numbers only if the German question contains them, no passage sentence reproduced).
* Glosses translate words and chunks, never a whole passage sentence. Units 11–17 are not changed.

## 6. Objective → assessment matrix (Unit 18)

| # | Objective | Revision exercises | Final test | Labs |
| --- | --- | --- | --- | --- |
| O1 | Plan and book a trip or accommodation | — (labs, word cards) | FT 08, 11, 13 | R1, L2 |
| O2 | Say where you go, where you are and where you come from | E 01, 02, 03, 04 | FT 01, 02, 03, 13 | L2, R2, S1 turn 1, W1 |
| O3 | Handle travel situations: tickets, platform, directions, delays, help | — (labs) | FT 09, 12, 14 | L1, R2 |
| O4 | Talk about weather and seasons | E 08 | FT 05, 07, 10 | L2, S1 turn 3, W1 |
| O5 | Talk about a past holiday and about plans | E 05, 06, 07 | FT 04, 06, 15 | R2, S1 turns 2 and 4, W1 |

Communicative final-test items (a real-life ticket, announcement, message, postcard or situation): FT 04, 08, 09, 11, 12, 13, 14, 15 — 8 of 15.

## 7. Receptive vocabulary

`UNIT_18_RECEPTIVE_WORDS` (in `unit18/vocabulary.ts`) records the six receptive words. They occur in the unit's texts (*Prospekt, Fähre* in R1; *Reiseversicherung* in L1 and R1; *Zoll, Grenze* in R2; *Wettervorhersage* in L2), in glosses and word cards; they are never a required gap answer, speaking keyword or hint, writing requirement or **correct** final-test answer (tested).

## 8. Realism, safety and neutral scenes

* Genres: ticket counter (L1), friends' planning (L2), brochure (R1), postcard (R2), informal talk (S1), postcard (W1).
* Neutral European scenes (a station, the Baltic coast, Spain, Turkey, Switzerland); prices in euros; temperatures are not quoted; the Kyrgyz glosses of *Zoll, Grenze, Führerschein* describe German-context concepts (see glossary §11).
* A problem on the road (*Stau*, a closed *Tankstelle*, a stranger who helps) and a request for help at the station (FT 14) cover *problems during travel*.

## 9. Kyrgyz and Russian

Both languages are written independently for every field. No artificial bracket is used in a Kyrgyz gloss; where Russian and Kyrgyz share a loan word (*пляж*, *паром*, *платформа*), each gloss gives its own wording (*деңиз жээги*, *суудан өтүүчү кеме*, *перрон*). Unresolved Unit 18 terms: `A2_KY_TERMINOLOGY_GLOSSARY.md` §11. All Kyrgyz remains an AI draft and needs native review.

## 10. Not done / left open

Native Kyrgyz, Russian and CEFR review of unit 18; the review package (tooling not generalised); level-test and placement items; UI exposure (A2 is invisible); the `SAME_AS_RU` change (approved in principle, not implemented in this stage). Open questions: `docs/implementation/A2_STAGE7I_UNIT18.md`.
