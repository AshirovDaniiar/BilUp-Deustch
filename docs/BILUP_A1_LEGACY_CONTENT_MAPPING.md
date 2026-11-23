# BilUp Til — A1 Legacy Content Audit and Mapping Plan

> **Status: analysis only.** Nothing was moved, copied, merged, renamed, deleted or created in the application. No source, data, progress or storage file was touched. This document is the plan for a *future* migration that has not been approved.
> Audited: 2026-11-23, against the working tree after the A1 (38 units) and A2 (43 units) restructuring.

---

## 1. Executive summary

| Item | Value |
|---|---|
| Legacy A1 units in the data | 10 (ids 1–10) |
| Of which already reused by the new A1 structure | 1 (Unit 1 "Hallo & Ich" = new Unit 01) |
| Hidden legacy units under audit | 9 (ids 2–10) |
| Legacy A1 content volume | 226 words, 19 grammar concepts (+1 tagged A2), 21 listening, 10 reading, 10 writing, 11 speaking scenarios, 10 unit tests, 202 exercises (67 handwritten, 135 generated article drills) |
| New A1 units | 38 (304 section containers) |
| New units with a *strong* legacy candidate (excluding Unit 01) | 9 (03, 04, 17, 22, 29, 30, 32, 35, 38) |
| New units with only *partial* or *possible* candidates | 24 (6 of them only because Unit 01 already uses the same source) |
| New units with no identified legacy content | 4 (14, 15, 25, 26) |
| New units already populated | 1 (01) |
| Legacy content with no suitable destination | Arbeit & Beruf (whole unit), Genitiv, Konjunktionen, Akkusativ-Präpositionen, most of Unterwegs/travel, the `doctor` scenario, most of the 15 real-life situations |

**Headline findings**

1. **Only one legacy title matched, and the new curriculum is organised by language function (verbs, cases, communication), whereas the legacy A1 is organised by life topic (Familie, Essen, Wohnung …).** Almost every legacy unit therefore maps to *several* new units, and several new units compete for the *same* legacy source. A one-to-one migration is not possible and would produce near-duplicates.
2. **Unit 01 already absorbs the material most relevant to new Units 02, 05, 07, 08 and 12** (introductions, `sein`, `questions`, `nominativ`, `articles`). Populating those from legacy would duplicate Unit 01.
3. **Three triples of new titles share one legacy source**: 03 / 23 / 29 (daily routine, all from legacy Unit 3), 25 / 26 (gifts, no source at all), 19 / 20 (negation, one concept).
4. **Legacy A1 contains material tagged A2 or B1** (16 items) that sits inside A1 units. A2/B1-tagged items should not be migrated into A1 without a level decision.
5. **Speaking scenarios are paired to units by position, not by topic** (e.g. legacy Unit 2 "Meine Familie" → scenario "Bei der Arbeit"). They cannot be migrated with their unit; they must be re-assigned by topic.
6. **The Review and Test sections are not authored content in A1**: Review is derived from a unit's vocabulary; the unit test is a 8-question quiz generated at run time from the unit's vocabulary and exercises. Migrating vocabulary + exercises automatically provides both sections.

---

## 2. Method

* Read the real data (not titles): `vocabulary` (226 entries, German + RU/KY), `grammar` (concepts with explanation, examples, mistakes), `exercises`, `listening` (scripts and questions), `reading` (texts), `writing` (situations), `speaking` (scenarios), `reallife`, `tests`.
* Counted per unit through the catalog selectors; cross-checked duplicates programmatically (normalised German headword).
* Compared meaning, not wording. "Confidence" below reflects *content* fit (vocabulary theme + grammar concept + practical situation + skill materials), not title similarity.
* No file in the repository was modified; analysis scripts lived outside the repo.

Confidence scale: **Strong match** (content serves ≥ 3 sections and the theme is the unit's core), **Partial match** (serves 1–2 sections or part of the theme), **Possible match** (a concept or a few words fit; real work needed), **No suitable match**.

---

## 3. Complete legacy A1 inventory

Section key: **V** vocabulary, **G** grammar concepts, **L** listening, **R** reading, **S** speaking scenario (positional), **W** writing, **Rev** review (derived from V), **T** test (generated from V + exercises). `ex` = exercises (hand-written + generated article drills).

| Id | Legacy title | V | G (concepts) | L | R | S (scenario) | W | ex | Rev | T |
|---:|---|---:|---|---:|---:|---|---:|---:|:-:|:-:|
| 1 | Hallo & Ich *(reused as new 01)* | 23 | articles, sein-haben, questions, nominativ | 2 | 1 | `meeting` | 1 | 11 | ✓ | ✓ (8) |
| 2 | Meine Familie | 23 | plural, possessive | 2 | 1 | `work` | 1 | 24 | ✓ | ✓ (8) |
| 3 | Mein Alltag | 22 | regular-verbs, verb-position, separable | 2 | 1 | `appointment` | 1 | 12 | ✓ | ✓ (8) |
| 4 | Essen & Trinken | 23 | akkusativ, negation, modal | 2 | 1 | `restaurant` | 1 | 23 | ✓ | ✓ (8) |
| 5 | Meine Wohnung | 23 | wechsel | 2 | 1 | `viewing` | 1 | 25 | ✓ | ✓ (8) |
| 6 | Arbeit & Beruf | 22 | conjunctions | 2 | 2 | `interview` | 1 | 24 | ✓ | ✓ (8) |
| 7 | In der Stadt | 22 | dativ, dativ-prep | 2 | 1 | `station` | 1 | 22 | ✓ | ✓ (8) |
| 8 | Zeit & Termine | 22 | time-order, perfekt | 2 | 1 | `phone` | 1 | 20 | ✓ | ✓ (8) |
| 9 | Einkaufen | 23 | akk-prep | 2 | 1 | `supermarket` | 1 | 20 | ✓ | ✓ (8) |
| 10 | Unterwegs | 23 | genitiv *(tagged A2)* | 3 | **0** | `office` | 1 | 21 | ✓ | ✓ (8) |

Level-wide A1 material not tied to a unit: scenarios `doctor` (unattached), placement test (12), level test (15), grammar / vocabulary / listening practice tests, 12 "why" notes, 15 real-life situations (`wohnung, arbeit, bewerbung, arzt, apotheke, bank, post, supermarkt, bahn, behoerde, anmeldung, telefon, behoerden, universitaet, restaurant`).

Legacy Unit 10 has **no reading text** (the only legacy unit with a missing section). Every other unit has all eight sections.

---

## 4. Actual existing content by section

### Unit 1 — Hallo & Ich (already live as new Unit 01; reference for overlap)
* **V (23):** greetings and politeness (Hallo, Guten Morgen/Tag/Abend, Tschüss, Auf Wiedersehen, Danke, Bitte, Entschuldigung, Wie geht es Ihnen?, Wie bitte?, Ich verstehe nicht., Freut mich.), ja/nein, Sprache, Land, Name, heißen, kommen, wohnen, sprechen, sein.
* **G:** articles (der/die/das), sein & haben, question word order, Nominativ.
* **L:** *Sich kennenlernen* (name, origin), *Im Deutschkurs* (name, spelling). **R:** *Mein Name ist Anna*. **S:** *Neue Leute kennenlernen*. **W:** *Über mich*.
* **ex:** 11 (5 fill, 2 choice, 1 order, 3 article drills).

### Unit 2 — Meine Familie
* **V (23):** family (Familie, Mutter, Vater, Eltern, Bruder, Schwester, Kind, Sohn, Tochter, Opa, Oma, Onkel, Tante, Ehemann, Ehefrau, Freund, Freundin), haben, verheiratet, alt, jung, groß, klein.
* **G:** plural forms; possessive articles (mein, dein, sein, ihr …).
* **L:** *Geschwister* (siblings, ages), *Das Familienfoto*. **R:** *Meine Familie*. **S (positional):** `work` – *Bei der Arbeit* (**not family-related**). **W:** *Meine Familie*.
* **ex:** 24 (17 article drills; concepts plural, possessive, sein-haben, verb-position, articles).

### Unit 3 — Mein Alltag
* **V (22):** Tag, Morgen, Abend, Nacht, Freizeit; aufstehen, frühstücken, arbeiten, lernen, schlafen, kochen, putzen, lesen, fernsehen, duschen; heute, morgen, immer, oft, manchmal, nie; müde.
* **G:** regular verbs (present), verb in position 2, separable verbs.
* **L:** *Mein Morgen*, *Nach der Arbeit*. **R:** *Mein Tag*. **S (positional):** `appointment` – *Einen Termin machen* (belongs to Zeit & Termine). **W:** *Mein Wochenende*.
* **ex:** 12.

### Unit 4 — Essen & Trinken
* **V (23):** food and drink (Brot, Wasser, Kaffee, Tee, Milch, Apfel, Fleisch, Käse, Ei, Reis, Suppe, Salat, Kartoffel, Gemüse), Speisekarte, Rechnung, essen, trinken, bestellen, möchten, zahlen, lecker, Hunger haben.
* **G:** Akkusativ; negation (nicht vs kein); modal verbs.
* **L:** *Im Café*, *Die Rechnung*. **R:** *Im Restaurant*. **S:** `restaurant` – *Im Restaurant* (fits). **W:** *Tisch reservieren*.
* **ex:** 23 (16 article drills).

### Unit 5 — Meine Wohnung
* **V (23):** Wohnung, Haus, Zimmer, Küche, Bad, Schlafzimmer, Wohnzimmer, Tisch, Stuhl, Bett, Sofa, Schrank, Fenster, Tür, Schlüssel, Balkon, Kühlschrank, Miete, Vermieter, mieten, teuer, günstig, ruhig.
* **G:** two-way prepositions (Wo? → Dativ, Wohin? → Akkusativ).
* **L:** *Wohnungsbesichtigung*, *Der Umzug* (Wohin kommt das Sofa?). **R:** *Meine neue Wohnung*. **S:** `viewing` – *Wohnungsbesichtigung* (fits; tagged A2). **W:** *E-Mail an den Vermieter* (tagged A2).
* **ex:** 25 (19 article drills).

### Unit 6 — Arbeit & Beruf
* **V (22):** Arbeit, Beruf, Arzt/Ärztin, Lehrer, Fahrer, Koch, Chef, Kollege, Büro, Firma, Kunde, Gehalt, Vertrag, Bewerbung, Lebenslauf, Pause, Erfahrung, verdienen, suchen, helfen, arbeitslos.
* **G:** conjunctions (und, aber, oder, denn, weil).
* **L:** *Im Vorstellungsgespräch*, *Pause im Büro*. **R:** *Mein Beruf*, *Arbeiten in Deutschland* (tagged **B1**). **S:** `interview` (tagged A2). **W:** *Kurze Bewerbung* (tagged A2).
* **ex:** 24 (concepts conjunctions, dativ-prep, articles).

### Unit 7 — In der Stadt
* **V (22):** Stadt, Straße, Bahnhof, Haltestelle, Bus, U-Bahn, Krankenhaus, Apotheke, Bank, Post, Supermarkt, Park, Schule, Ampel, Ecke, links, rechts, geradeaus, weit, nah, finden, Wo ist …?
* **G:** Dativ; the seven Dativ prepositions (aus, bei, mit, nach, seit, von, zu).
* **L:** *Der Weg zum Bahnhof*, *Wo ist die Apotheke?*. **R:** *Meine Stadt*. **S:** `station` – *Am Bahnhof*. **W:** *Der Weg zu mir*.
* **ex:** 22.

### Unit 8 — Zeit & Termine
* **V (22):** Uhr, Stunde, Minute, Woche, Monat, Jahr, weekdays, Wochenende, Termin, Kalender, vereinbaren, verschieben, absagen, dauern, pünktlich, früh, spät, wann, Wie spät ist es?
* **G:** time expressions (am/um/im); Perfekt.
* **L:** *Ein Arzttermin*, *Termin verschieben* (tagged A2). **R:** *Ein Termin beim Arzt* (tagged A2). **S:** `phone` – *Anruf bei einer Firma* (tagged A2). **W:** *Termin verschieben* (tagged A2).
* **ex:** 20 (concepts time-order, perfekt, articles).

### Unit 9 — Einkaufen
* **V (23):** kaufen, kosten, brauchen, nehmen, anprobieren, umtauschen, Preis, Geld, Euro, Kasse, Tüte, Karte, Angebot, Geschäft, Markt, Größe, Hose, Jacke, Schuh, Kassenzettel, bar, billig, Wie viel kostet das?
* **G:** Akkusativ prepositions (für, durch, gegen, ohne, um).
* **L:** *Im Supermarkt*, *Eine Jacke anprobieren* (tagged A2). **R:** *Einkaufen am Samstag* (tagged A2). **S:** `supermarket`. **W:** *Eine Beschwerde* (tagged A2).
* **ex:** 20.

### Unit 10 — Unterwegs
* **V (23):** reisen, umsteigen, ankommen, abfahren, reservieren, fliegen, Zug, Fahrkarte, Gleis, Abfahrt, Ankunft, Verspätung, Flughafen, Flugzeug, Koffer, Pass, Hotel, Reise, Urlaub, Auto, Fahrrad, direkt, verspätet.
* **G:** Genitiv overview (tagged **A2**).
* **L:** *Am Bahnhof*, *Durchsage: Verspätung* (A2), *Am Flughafen*. **R:** none. **S:** `office` – *Ausländerbehörde* (tagged A2; not travel-related). **W:** *Zug oder Auto?* (A2).
* **ex:** 21 (concepts genitiv, separable, perfekt, articles).

---

## 5. A1 mapping report: nine hidden legacy units → new A1 units

A legacy unit may feed several new units and a new unit may draw on several legacy units. Rows are *candidates*, not decisions.

| Legacy unit | New A1 unit candidate | Matching content | Matching sections | Confidence | Recommendation |
|---|---|---|---|---|---|
| 2 Meine Familie | **04 Familie und Freunde** | Family + Freund/Freundin vocabulary; possessives; two family dialogues, text, writing task | V, G (possessive), L, R, W, ex | High | **Strong match** |
| 2 Meine Familie | 16 Meine Familie und meine Sachen | Possessive articles, plural; family vocabulary | V, G | Medium | Partial match (needs "Sachen" vocabulary from other units) |
| 2 Meine Familie | 24 Wem gehört das? | Possessives (mein/dein/…) | G | Low | Possible match (the Dativ "Wem?" part is in legacy Unit 7) |
| 2 Meine Familie | 18 Menschen und Dinge beschreiben | alt, jung, groß, klein; `verheiratet` | V (5 adjectives) | Low | Possible match |
| 2 Meine Familie | 10 Dinge und Gegenstände | Plural formation | G (plural) | Low | Possible match |
| 3 Mein Alltag | **03 Mein Tagesablauf** | Time-of-day and routine verbs; regular + separable verbs; *Mein Morgen*/*Nach der Arbeit*; *Mein Tag* | V, G, L, R, W, ex | High | **Strong match** |
| 3 Mein Alltag | **29 Mein Morgen und mein Alltag** | Same source (listening is literally titled *Mein Morgen*) | V, G, L, R | High | **Strong match** — *competes with 03 and 23* |
| 3 Mein Alltag | **23 Meine täglichen Aktivitäten** | Verbs (kochen, putzen, lesen, fernsehen, lernen), frequency adverbs | V, G | Medium | **Partial match** — *competes with 03 and 29* |
| 3 Mein Alltag | 31 Meine Freizeit und Hobbys | Freizeit, lesen, fernsehen, *Mein Wochenende* | V (few), W | Medium | Partial match |
| 3 Mein Alltag | 09 Was machst du gern? | Activity verbs, regular-verb conjugation (no `gern` concept at A1) | V, G | Low | Possible match |
| 4 Essen & Trinken | **13 Frühstück und Mahlzeiten** | Food and drink vocabulary (14 nouns), `essen/trinken` | V, ex (article drills) | Medium | **Partial match** (no meal vocabulary such as Frühstück, Mittagessen) |
| 4 Essen & Trinken | **22 Was kaufe und esse ich?** | Akkusativ concept + food nouns + `bestellen/zahlen`; shopping vocabulary from Unit 9 | V, G, ex | High | **Strong match** (best combined with Unit 9) |
| 4 Essen & Trinken | **30 Im Restaurant und zu Hause** | Café and restaurant dialogues, text, reservation writing task, `restaurant` scenario, real-life *restaurant* | V, L, R, S, W | High (restaurant half) | **Strong match** for "Im Restaurant"; the "zu Hause" half has no source |
| 4 Essen & Trinken | 19 Was mache ich nicht? | Negation (`nicht`) | G | Medium | Partial match — *shares one concept with 20* |
| 4 Essen & Trinken | 20 Was habe ich nicht? | Negation (`kein`) + `haben` from Unit 1 | G | Medium | Partial match — *shares one concept with 19* |
| 4 Essen & Trinken | **27 Was kann und muss ich?** | Modal verb concept (position 2 + infinitive) and its exercises | G, ex | Medium | **Partial match** (only `möchten` appears in vocabulary; `können/müssen` practised in exercises) |
| 4 Essen & Trinken | 28 Meine Wünsche und Möglichkeiten | `möchten`, `Hunger haben` | V (few), G | Low | Possible match |
| 5 Meine Wohnung | **35 Meine Wohnung und Möbel** | Full housing vocabulary, two listenings, text, e-mail task, viewing scenario, real-life *wohnung* | V, G (partial), L, R, S, W, ex | High | **Strong match** (all eight sections have material) |
| 5 Meine Wohnung | **11 In meinem Zimmer** | Room and furniture vocabulary; *Wohin kommt das Sofa?* | V, L (1) | Medium | **Partial match** |
| 5 Meine Wohnung | **33 Wohin gehe ich?** | Wechselpräpositionen, Wohin? → Akkusativ | G, L (*Der Umzug*) | Medium | **Partial match** (concept is shared with 34) |
| 5 Meine Wohnung | **34 Wo bin ich?** | Wechselpräpositionen, Wo? → Dativ; with legacy Unit 7 Dativ | G | Medium | **Partial match** |
| 5 Meine Wohnung | 10 Dinge und Gegenstände | Furniture nouns with articles (article drills) | V, ex | Medium | Partial match |
| 5 Meine Wohnung | 18 Menschen und Dinge beschreiben | teuer, günstig, ruhig | V | Low | Possible match |
| 6 Arbeit & Beruf | *(none of the 38 titles is about work or professions)* | Occupations, workplace, application | V, L, R, S, W | — | **No suitable match** for the unit as a whole |
| 6 Arbeit & Beruf | 06 Mein Leben in Deutschland | *Arbeiten in Deutschland* text (**tagged B1**), real-life *arbeit* | R | Low | Possible match (level decision needed first) |
| 6 Arbeit & Beruf | 05 Ich stelle mich vor | Interview dialogue and `interview` scenario (introducing oneself to an employer) | L, S | Low | Possible match (Unit 01 already covers introductions) |
| 6 Arbeit & Beruf | *(none)* | Conjunctions und/aber/oder/denn/weil | G | — | **No suitable match** (no new A1 unit covers clause connectors) |
| 7 In der Stadt | **38 Unterwegs in der Stadt** | City places and directions vocabulary; directions dialogues; *Meine Stadt*; *Der Weg zu mir*; `station` scenario; real-life bank/post/apotheke | V, L, R, S, W | High | **Strong match** |
| 7 In der Stadt | **34 Wo bin ich?** | Dativ concept (Wo/Wem?), places, `links/rechts/geradeaus`, prepositions *bei, nach, von, zu* | V, G | Medium | **Partial match** |
| 7 In der Stadt | **33 Wohin gehe ich?** | Directions, `zu/nach`, *Wo ist …?* dialogues | V, L, G | Medium | **Partial match** |
| 7 In der Stadt | 24 Wem gehört das? | Dativ concept (Wem?) | G | Low | Possible match |
| 8 Zeit & Termine | **32 Uhrzeit, Tage und Termine** | Clock, days, appointments vocabulary; `am/um/im`; phone dialogues; appointment text; reschedule task; real-life *telefon* | V, G, L, R, S, W | High | **Strong match** (5 of 8 items are tagged A2 — see §9) |
| 8 Zeit & Termine | **37 Was habe ich gemacht?** | Perfekt concept and exercises | G, ex | Medium | **Partial match** (only the concept; no past-tense vocabulary set) |
| 8 Zeit & Termine | 36 Früher und heute | Perfekt (past reference); no `früher/damals` at A1 (those words are in legacy A2 Unit 11) | G | Low | Possible match |
| 9 Einkaufen | **17 Fragen beim Einkaufen** | Shopping vocabulary, prices, `Wie viel kostet das?`, two dialogues, text, complaint task, `supermarket` scenario, real-life *supermarkt* | V, L, R, S, W | High | **Strong match** |
| 9 Einkaufen | 22 Was kaufe und esse ich? | Verbs kaufen/brauchen/nehmen; clothing nouns; Akkusativ prepositions | V, G | Medium | Partial match (pairs with legacy Unit 4) |
| 9 Einkaufen | 10 Dinge und Gegenstände | Hose, Jacke, Schuh, Tüte, Karte, Kasse … | V | Low | Possible match |
| 9 Einkaufen | *(none)* | Akkusativ prepositions (für, durch, gegen, ohne, um) | G | — | **No suitable match** as a lesson (could support 22) |
| 10 Unterwegs | 38 Unterwegs in der Stadt | Transport vocabulary (Zug, Gleis, Fahrkarte, Fahrrad), three dialogues, station scenario overlap | V (part), L | Medium | Partial match (travel vs city: the airport/hotel/passport part does not fit) |
| 10 Unterwegs | *(none)* | Travel: Flughafen, Flugzeug, Koffer, Pass, Hotel, Urlaub, Reise | V, L (*Am Flughafen*) | — | **No suitable match** |
| 10 Unterwegs | *(none)* | Genitiv overview (tagged A2) | G | — | **No suitable match** |
| 10 Unterwegs | *(none)* | `office` scenario (*Ausländerbehörde*) | S | — | Possible match: 06 Mein Leben in Deutschland (level/topic decision) |
| *Level-wide* | 12 Was ist das? / 02 / 05 / 07 / 08 | Unit 1 concepts `articles`, `questions`, `sein-haben`, `nominativ`, greeting dialogues | G, L, R, S, W | — | **Already in new Unit 01** — do not duplicate |

---

## 6. Overview of the 38 new A1 units: legacy availability (planning only)

Legend: **Strong** = existing content potentially reusable · **Partial** = partial existing content · **None** = no identified legacy content.

| № | New A1 unit | Possible legacy source | Content availability |
|---:|---|---|---|
| 01 | Hallo & Ich | Legacy 1 (already integrated) | **Populated** (8 of 8 sections) |
| 02 | Wer bin ich? | Legacy 1 (overlaps Unit 01) | Partial (duplication risk) |
| 03 | Mein Tagesablauf | Legacy 3 | Strong |
| 04 | Familie und Freunde | Legacy 2 | Strong |
| 05 | Ich stelle mich vor | Legacy 1, 6 | Partial (duplication risk) |
| 06 | Mein Leben in Deutschland | Legacy 6 (re10), 10 (`office`) | Partial (level-tagged B1/A2 items) |
| 07 | Neue Bekanntschaften | Legacy 1 (`meeting`) | Partial (duplication risk) |
| 08 | Fragen über mich | Legacy 1 (questions concept) | Partial (duplication risk) |
| 09 | Was machst du gern? | Legacy 3 | Partial |
| 10 | Dinge und Gegenstände | Legacy 5, 9 | Partial |
| 11 | In meinem Zimmer | Legacy 5 | Partial |
| 12 | Was ist das? | Legacy 1 (articles) | Partial (duplication risk) |
| 13 | Frühstück und Mahlzeiten | Legacy 4 | Partial |
| 14 | Meine Haustiere und Tiere | — | **None** |
| 15 | Zusammengesetzte Wörter im Alltag | — (compound nouns exist inside vocabulary, no lesson) | **None** |
| 16 | Meine Familie und meine Sachen | Legacy 2, 5 | Partial |
| 17 | Fragen beim Einkaufen | Legacy 9 | Strong |
| 18 | Menschen und Dinge beschreiben | Legacy 2, 5 (a few adjectives) | Partial |
| 19 | Was mache ich nicht? | Legacy 4 (negation) | Partial |
| 20 | Was habe ich nicht? | Legacy 4 (negation), 1 (haben) | Partial |
| 21 | Wer oder was? | Legacy 1 (nominativ), 4 (akkusativ) | Partial |
| 22 | Was kaufe und esse ich? | Legacy 4, 9 | Strong |
| 23 | Meine täglichen Aktivitäten | Legacy 3 | Partial (shares source with 03, 29) |
| 24 | Wem gehört das? | Legacy 2 (possessives), 7 (Dativ) | Partial |
| 25 | Geschenke für Freunde | — | **None** |
| 26 | Freunde und Geschenke | — | **None** |
| 27 | Was kann und muss ich? | Legacy 4 (modal) | Partial |
| 28 | Meine Wünsche und Möglichkeiten | Legacy 4 (`möchten`) | Partial |
| 29 | Mein Morgen und mein Alltag | Legacy 3 | Strong |
| 30 | Im Restaurant und zu Hause | Legacy 4 | Strong (restaurant half) |
| 31 | Meine Freizeit und Hobbys | Legacy 3 | Partial |
| 32 | Uhrzeit, Tage und Termine | Legacy 8 | Strong |
| 33 | Wohin gehe ich? | Legacy 5, 7 | Partial |
| 34 | Wo bin ich? | Legacy 5, 7 | Partial |
| 35 | Meine Wohnung und Möbel | Legacy 5 | Strong |
| 36 | Früher und heute | Legacy 8 (perfekt) | Partial (weak) |
| 37 | Was habe ich gemacht? | Legacy 8 (perfekt) | Partial |
| 38 | Unterwegs in der Stadt | Legacy 7, 10 | Strong |

**Counts:** 1 already populated (01) + 9 strong (03, 04, 17, 22, 29, 30, 32, 35, 38) + 24 partial + 4 none (14, 15, 25, 26) = 38.

A fairer reading of "partial" rows: 6 of them (02, 05, 07, 08, 12, 21) are partial **only because Unit 01 already uses the same source**, so a future migration would mainly duplicate Unit 01.

---

## 7. Unmapped legacy content (no suitable destination in the 38 titles)

| Legacy content | Why it does not fit | Suggested handling |
|---|---|---|
| **Unit 6 Arbeit & Beruf** (22 words, 2 listenings, 2 readings, interview scenario, application task) | No new A1 title concerns jobs, workplace or applications | Keep hidden; consider an additional unit or a later level (A2 has "Menschen und Berufe", "Schule, Ausbildung und Beruf" in legacy) |
| `conjunctions` (und, aber, oder, denn, weil) | No unit teaches clause connectors | Keep hidden; the A2 curriculum teaches connectors (new A2 Units 11, 17, 39) |
| `akk-prep` (für, durch, gegen, ohne, um) | No matching unit | Keep hidden |
| `genitiv` overview (tagged A2) | Genitive is not in the new A1 plan | Keep hidden (B1 contains Genitive concepts) |
| Travel vocabulary and dialogues (Flughafen, Flugzeug, Koffer, Pass, Hotel, Urlaub; *Am Flughafen*, *Durchsage*) | New A1 has only "Unterwegs in der Stadt" | Keep hidden; legacy A2 "Reisen, Urlaub und Mobilität" and new A2 "Im Hotel und im Restaurant" are more suitable |
| `doctor` scenario (unattached) and real-life *arzt* | No health unit in the new A1 | Keep hidden; A2 "Körperpflege und Gesundheit" is a better home |
| Real-life situations *bank, post, behoerde, anmeldung, behoerden, universitaet, bewerbung, apotheke, bahn* | Not tied to a unit and no matching new unit | Keep hidden |
| Placement test, level test, grammar/vocabulary/listening practice tests | Level-wide, not unit content | Out of scope; they remain as they are |

---

## 8. Quality, duplication and level-tag audit

**Duplicate vocabulary**
* Only **one** duplicate headword inside legacy A1: *morgen* (Unit 3 uses it both as "tomorrow" and as the part of day *der Morgen*; the second is an adverb, so this is a homograph, not a copy).
* Only **one** word shared with legacy A2: *Erfahrung* (A1 Unit 6, A2 Unit 11). The two levels are otherwise lexically separate.
* Recurring words that appear *inside other forms* (e.g. `Hunger haben` vs `hungrig`) are not duplicates.

**Repeated grammar explanations**
* `verb-position` (Unit 3) is the main explanation of verb position, but `modal` (Unit 4, verb at position 2 + infinitive at the end) and `conjunctions` (Unit 6, verb at the end after *weil*) re-explain parts of it, and it is also an exercise concept in Units 2, 5 and 9. New Units 19 / 20 / 27 / 28 would re-teach it again.
* `dativ` / `dativ-prep` (Unit 7) and `wechsel` (Unit 5) both teach the Dativ; new Units 33 / 34 need a single decision on where Dativ starts.

**Exercises that test the same objective**
* 135 of 202 exercises are auto-generated article drills (one per noun). They duplicate each unit's vocabulary and are *not* topic exercises. Any migrated vocabulary keeps its drill automatically.
* Hand-written exercises per unit: 6–8 each (fill / choice / order). Exercise concepts repeated across units: `verb-position` in Units 2, 5 and 9; `perfekt` in Units 8 and 10; `separable` in Units 3 and 10; `dativ-prep` appears in Unit 6.

**Listening/reading that could fit several new units**
* *Der Umzug* (Unit 5) → 11, 33, 35. · *Der Weg zum Bahnhof* / *Wo ist die Apotheke?* (Unit 7) → 33, 34, 38. · *Im Supermarkt* → 17, 22. · *Termin verschieben* (Unit 8) → 32 only (but tagged A2). · *Mein Tag*, *Mein Morgen* → 03, 23, 29 (identical theme).

**Content that does not clearly belong to its legacy unit (positional speaking)**
| Legacy unit | Paired scenario | Topic fit |
|---|---|---|
| 1 Hallo & Ich | `meeting` | ✓ |
| 2 Meine Familie | `work` | ✗ (workplace) |
| 3 Mein Alltag | `appointment` | ✗ (appointments belong to Unit 8) |
| 4 Essen & Trinken | `restaurant` | ✓ |
| 5 Meine Wohnung | `viewing` | ✓ |
| 6 Arbeit & Beruf | `interview` | ✓ |
| 7 In der Stadt | `station` | ≈ (station, not directions) |
| 8 Zeit & Termine | `phone` | ≈ |
| 9 Einkaufen | `supermarket` | ✓ |
| 10 Unterwegs | `office` | ✗ (Ausländerbehörde) |

**Level tags inside A1 units (not migrated blindly)** — items tagged A2 or B1 although they live in A1 units: listening `li16`, `li18`, `li20` (3); reading `re08`, `re09`, `re10`/B1 (3); writing `wr05`, `wr06`, `wr08`, `wr09`, `wr10` (5); scenarios `interview`, `viewing`, `phone`, `office` (4); grammar `genitiv` (1) = 16 items. The application treats them as A1 (level = parent unit), but a future migration should decide whether they are truly A1.

**Content that should remain separate:** Arbeit & Beruf (Unit 6), travel (Unit 10), the Genitiv concept, level-wide tests and the real-life library.

---

## 9. Recommendations for future migration (not approved, not started)

1. **Decide the curriculum first, then map.** The new list repeats themes (03/23/29; 04/16; 19/20; 25/26; 33/34; 36/37). Define the *distinct learning objective* of each before assigning any legacy item.
2. **Do not duplicate Unit 01.** Treat 02, 05, 07, 08, 12 as new content built *on top of* Unit 01 rather than copies of it.
3. **Highest-value, lowest-risk first:** 35 (Wohnung), 32 (Zeit & Termine), 38 (Stadt), 17 (Einkaufen), 04 (Familie), 03 (Tagesablauf), 30 (Restaurant). Each already has material in 5–8 sections.
4. **Migrate by item, not by unit.** Move a vocabulary item by `unit` field only together with its listening/reading/writing items; re-assign **speaking scenarios by topic**, not by position.
5. **Preserve identifiers.** Moving content changes the `unit` field of items; existing progress keys are `"<unit>:<section>"`, `topic:<concept>` and `ex:<id>`. A migration must keep old keys readable (alias or dual lookup) so learner records do not silently reset. Hidden legacy units must stay intact until the mapping is signed off.
6. **Resolve level tags** for the 16 A2/B1-tagged items before reuse.
7. **Fill the gaps deliberately:** 14, 15, 25, 26 have no source and need original content; 06 and 36 need a level/topic decision.
8. **Keep Review/Test free:** once vocabulary and exercises are present, Review and the unit test work automatically.

---

## 10. Counts for the combined summary (A1 part)

| Metric | A1 |
|---|---:|
| Legacy units reviewed | 10 (9 hidden + Unit 1) |
| Strong matches (new units with a strong legacy candidate, excluding Unit 01) | 9 |
| Partial matches (new units) | 24 |
| New units without identified legacy material | 4 (14, 15, 25, 26) |
| New units already populated | 1 (01) |
| Legacy items with no suitable destination | 6 groups (§7) |
| Hidden legacy units wholly without a destination | 1 (Arbeit & Beruf) + 1 mostly (Unterwegs) |

---

## 11. Combined A1 + A2 summary

See §11 of `BILUP_A2_LEGACY_CONTENT_MAPPING.md` for the full combined table. In short: 20 legacy units reviewed (10 A1 + 10 A2), 19 strong-match new units (9 A1 + 10 A2), 53 partial-match new units (24 + 29), 8 new units without identified legacy material (4 + 4) and 1 exact-title match overall.

---

## 12. Verification (read-only)

* No source code was modified.
* No curriculum data was modified; `A1_UNITS` (38) and the nine hidden units are exactly as before.
* No educational content was copied, moved or created.
* No legacy unit was deleted or renamed; unit ids and progress identifiers are unchanged.
* Only this report and its A2 counterpart were created (in `docs/`).
