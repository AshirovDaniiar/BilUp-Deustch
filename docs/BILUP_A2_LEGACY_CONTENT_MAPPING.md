# BilUp Til — A2 Legacy Content Audit and Mapping Plan

> **Status: analysis only.** Nothing was moved, copied, merged, renamed, deleted or created in the application. No source, data, progress or storage file was touched. This is the plan for a *future* migration that has not been approved.
> Audited: 2026-11-23, against the working tree after the A2 restructuring (43 empty containers + ten hidden legacy units).

---

## 1. Executive summary

| Item | Value |
|---|---|
| Legacy A2 units (all hidden, ids 11–20) | 10 |
| Legacy titles that match one of the 43 new titles | **0** |
| Legacy A2 content volume | 377 words, 27 grammar concepts, 20 listening (10–12 lines, 4 questions each), 20 reading (3 questions each), 10 writing, 10 speaking scenarios, 80 hand-written exercises, 10 topic tests (15 questions each, each with an *authored* 15-question final test) |
| New A2 units | 43 (344 section containers, all empty) |
| New units with a **strong** legacy candidate | 10 (02, 09, 10, 13, 15, 17, 22, 32, 38, 43) |
| New units with only **partial** candidates | 29 (several only weakly) |
| New units with **no** identified A2 legacy content | 4 (04, 12, 40, 42) |
| Legacy A2 content with no destination in the 43 titles | very little — see §7 (the legacy topics are broad, so almost everything has at least a partial home) |

**Headline findings**

1. **The legacy A2 is organised by broad life topic (ten units, ~38 words and 2–3 grammar concepts each). The new A2 is organised by communicative function and micro-situation (43 narrow units).** A legacy unit is therefore a *source for 3–6 new units*, never a one-to-one match. Migrating a legacy unit whole into one new unit would overfill it and leave its neighbours empty.
2. **Legacy A2 is the stronger, more consistent material:** every unit has all eight sections; every unit has *authored* content (vocabulary with L10n, two listening scripts, two texts, a writing task, a scenario, eight hand-written exercises and a 15-question final test). Nothing in A2 is auto-generated filler.
3. **Strongest 1:1-like fits** (a legacy unit that can populate most sections of a new unit): Unit 13 → new 32; Unit 20 → new 38 and 09; Unit 11 → new 02 and 10; Unit 17 → new 17 (grammar) and 22; Unit 19 → new 15; Unit 14 → new 43 and 05.
4. **Four new units have no A2 legacy source** (04 *Meine tägliche Routine*, 12 *Was ich denke und glaube*, 40 *Was ist mir wichtig?*, 42 *Wenn ich mehr Zeit hätte …*). Two of them (04 routine, 12 opinion) have *hidden legacy A1* material that could be a *starting point* but at the wrong level (see §8); 42 needs Konjunktiv II, which the legacy curriculum only teaches at B1.
5. **Cross-level overlap with the new A1 titles** is a curriculum issue to settle before any migration (e.g. new A2 04 ≈ new A1 03; A2 18 ≈ A1 18; A2 19 ≈ A1 07; A2 32 ≈ A1 35; A2 41 ≈ A1 30).
6. **Beta state travels with the content.** All legacy A2 content is under controlled Beta review (human CEFR / native-speaker reviews pending, Kyrgyz translations flagged as unreviewed). Moving it does not make it reviewed.
7. **Unlike A1, A2 has authored tests.** A topic test is the unit's 15-question authored final test; those questions are bound to the *legacy unit's* vocabulary and concepts, so a migrated unit would need its test re-composed from the items actually migrated.

---

## 2. Method

* Read the real data for every legacy A2 unit: vocabulary (headword, article, part of speech), grammar concept titles and explanations, exercise concepts, listening scripts, reading titles and texts, writing tasks, speaking scenarios, tests and final tests; counts via the catalog selectors.
* Compared meaning against all 43 new titles: **vocabulary theme**, **grammar concept**, **practical situation**, **skill/exercise type**. A title match alone never counts.
* Duplicates were checked programmatically (normalised headword, across the whole A2 and against A1).
* No repository file was modified; scripts lived outside the repo.

Confidence: **Strong match** (≥ 3 sections and the unit's core theme), **Partial match** (1–2 sections or part of the theme), **Possible match** (a concept or a few words), **No suitable match**.

---

## 3. Complete legacy A2 inventory

`V` vocabulary · `G` grammar concepts · `L` listening · `R` reading · `S` speaking · `W` writing · `ex` hand-written exercises · `Rev` review (derived from V) · `T` topic test (authored final test).

| Id | Legacy title | V | G | L | R | S | W | ex | Rev | T |
|---:|---|---:|---:|---:|---:|---|---:|---:|:-:|:-:|
| 11 | Über mich und meine Erfahrungen | 37 | 3 | 2 | 2 | Erfahrungen im Gespräch | 1 | 8 | ✓ | ✓ 15 |
| 12 | Familie, Freunde und Zusammenleben | 40 | 2 | 2 | 2 | Über einen Freund erzählen | 1 | 8 | ✓ | ✓ 15 |
| 13 | Wohnen und Nachbarschaft | 37 | 3 | 2 | 2 | Die Wohnung besichtigen | 1 | 8 | ✓ | ✓ 15 |
| 14 | Gesundheit und Wohlbefinden | 38 | 3 | 2 | 2 | Beim Arzt | 1 | 8 | ✓ | ✓ 15 |
| 15 | Essen, Einkaufen und Dienstleistungen | 38 | 3 | 2 | 2 | Beim Friseur anrufen | 1 | 8 | ✓ | ✓ 15 |
| 16 | Freizeit, Medien und Kultur | 36 | 3 | 2 | 2 | Hobbys und Wochenende | 1 | 8 | ✓ | ✓ 15 |
| 17 | Schule, Ausbildung und Beruf | 37 | 2 | 2 | 2 | Im Vorstellungsgespräch | 1 | 8 | ✓ | ✓ 15 |
| 18 | Reisen, Urlaub und Mobilität | 39 | 2 | 2 | 2 | Wie war dein Urlaub? | 1 | 8 | ✓ | ✓ 15 |
| 19 | Stadtleben und öffentliche Dienste | 38 | 3 | 2 | 2 | Nach dem Weg fragen und erklären | 1 | 8 | ✓ | ✓ 15 |
| 20 | Pläne, Einladungen und gemeinsame Entscheidungen | 37 | 3 | 2 | 2 | Wir planen das Wochenende | 1 | 8 | ✓ | ✓ 15 |
| | **Total** | **377** | **27** | **20** | **20** | **10** | **10** | **80** | | **10** |

Level-wide A2: no placement items, no level test, 43 "why" notes (attached to the concepts), learner instructions and tutor templates. No section is missing in any legacy A2 unit.

---

## 4. Actual existing content by section

Every entry below was read from the data.

### Unit 11 — Über mich und meine Erfahrungen
* **V (37):** Erfahrung, Erlebnis, Ausbildung, Abschluss, Prüfung, Praktikum, Stelle, Umzug, Heimat, Traum, Ziel, Erfolg, Veränderung; erleben, abschließen, umziehen, aufwachsen, sich verändern, sich entscheiden, gewinnen, bestehen, erreichen, beginnen, schaffen; erfolgreich, stolz; sequence words (früher, damals, zuerst, danach, schließlich); fixed phrases (Erfahrungen sammeln, geboren sein, noch nie, schon einmal, vor zwei Jahren, seit).
* **G:** Perfekt for experiences; Präteritum of *sein / haben / Modalverben*; linking events (*danach, weil, dass*).
* **L:** *Im Deutschkurs: Woher kommst du, und was hast du gemacht?*; *Ein Interview: Was hat sich verändert?*. **R:** *Mein Weg nach Deutschland*; *Früher und heute*. **S:** *Erfahrungen im Gespräch*. **W:** *Eine E-Mail über mein Leben*.

### Unit 12 — Familie, Freunde und Zusammenleben
* **V (40):** Cousin(e), Geschwister, Großeltern, Partner(in), Paar, ledig, geschieden, Verwandte, Bekannte; character adjectives (freundlich, nett, sympathisch, lustig, ehrlich, höflich, hilfsbereit, zuverlässig, eifersüchtig); emotions (glücklich, traurig, wütend); lieben, mögen, vertrauen, sich kennenlernen, sich treffen, sich verstehen, sich streiten, heiraten, zusammenleben; Haushalt, Hausarbeit, abwaschen, aufräumen, teilen, schenken, gehören, gefallen.
* **G:** personal pronouns in Akkusativ/Dativ and Dativ verbs; reflexive verbs.
* **L:** *Am Telefon: Eine Hochzeit in der Familie*; *In der Wohnung: Wer macht was?*. **R:** *Mein Freund Kai*; *Putzplan und Notizen*. **S:** *Über einen Freund erzählen*. **W:** *Eine Nachricht an die Mitbewohnerin*.

### Unit 13 — Wohnen und Nachbarschaft
* **V (37):** Anzeige, Besichtigung, Mietvertrag, Kaution, Nebenkosten, Mieter, einziehen, ausziehen, Flur, Keller, Aufzug, Heizung, Waschmaschine, Herd, Regal, Dachboden; hell, dunkel, gemütlich, modern, möbliert, geräumig; Nachbar(in), Nachbarschaft, Lärm, Müll, Hausordnung, Mülltrennung, grüßen, stören, renovieren; stehen, liegen, hängen, stellen, legen.
* **G:** adjective endings after *ein-/kein-/mein-*; comparative and superlative; position verbs (*stehen/stellen, liegen/legen, hängen*).
* **L:** *Eine Wohnung besichtigen*; *Der Umzug: Wohin kommt was?*. **R:** *Wohnung zu vermieten*; *Hausordnung und eine Notiz*. **S:** *Die Wohnung besichtigen*. **W:** *Eine E-Mail zur Wohnungsanzeige*.

### Unit 14 — Gesundheit und Wohlbefinden
* **V (38):** body parts (Kopf, Hals, Rücken, Bauch, Arm, Bein, Fuß, Hand, Auge, Ohr, Zahn); illnesses and symptoms (Erkältung, Husten, Schnupfen, Fieber, Grippe, Kopf-/Bauchschmerzen, wehtun, sich fühlen, krank/gesund/erkältet); Praxis, Tablette, Salbe, Notruf, Krankenwagen, Notaufnahme, Untersuchung, Krankschreibung; Gesundheit, sich bewegen, sich ausruhen, sich entspannen, Stress, trainieren.
* **G:** imperative (du/Sie); *sollen* and *dürfen*; *wenn* clauses.
* **L:** *Ein Termin in der Praxis*; *Eine Freundin gibt Tipps*. **R:** *Schmerztabletten: Gebrauchsinformation*; *Gesund bleiben und der Notruf*. **S:** *Beim Arzt*. **W:** *Eine E-Mail an den Chef: Ich bin krank*.

### Unit 15 — Essen, Einkaufen und Dienstleistungen
* **V (38):** food (Obst, Wurst, Fisch, Butter, Joghurt, Nudeln, Mehl, Zucker, Tomate), measures (Kilo, Gramm, Liter, Flasche, Dose, Packung, Stück, Scheibe), menu (Vorspeise, Hauptspeise, Nachtisch, Portion, scharf, süß, vegetarisch, schmecken), clothing (Kleid, Pullover, Mantel, passen, reduziert, Quittung), services (Friseur, Reinigung, Reparatur, reparieren, Werkstatt, Lieferung, liefern).
* **G:** adjective endings after the definite article; quantities and *einen/keinen/welche*, *wie viel/wie viele*; polite requests (*Können Sie …? Ich hätte gern …*).
* **L:** *Im Restaurant: Bestellen und bezahlen*; *Im Kleidungsgeschäft: Ein Mantel*. **R:** *Café Sonne: Speisekarte*; *Angebote und Service*. **S:** *Beim Friseur anrufen*. **W:** *Eine E-Mail an das Geschäft: Umtausch*.

### Unit 16 — Freizeit, Medien und Kultur
* **V (36):** Hobby, Verein, schwimmen, wandern, tanzen, malen, fotografieren, joggen, Training, Mannschaft; Internet, Handy, Nachricht, Zeitung, Zeitschrift, Sendung, Fernseher, App, Foto, herunterladen, online; Kino, Theater, Museum, Ausstellung, Konzert, Fest, Feiertag, Eintrittskarte, Veranstaltung; langweilig, spannend, interessant, sich interessieren, sich freuen, warten.
* **G:** *gern – lieber – am liebsten*; six verbs with prepositions (*interessieren für, freuen auf/über, warten auf, sprechen über, denken an*); ordinal numbers and dates.
* **L:** *Was machen wir am Wochenende?*; *An der Kinokasse*. **R:** *Kulturwoche im Stadtpark*; *Mein Handy und ich*. **S:** *Hobbys und Wochenende*. **W:** *Ein Kommentar zum Film*.

### Unit 17 — Schule, Ausbildung und Beruf
* **V (37):** school and study (Klasse, Fach, Note, Zeugnis, Stundenplan, Hausaufgabe, Unterricht, Berufsschule, Universität, Semester, Vorlesung, Zertifikat, Kurs, Kenntnisse), work (sich bewerben, Fähigkeit, Weiterbildung, Arbeitgeber, Vorstellungsgespräch, Teilzeit, Vollzeit, Arbeitsvertrag, Arbeitszeit, Überstunden, Besprechung, Team, Arbeitnehmer, kündigen, Kündigung), occupations (Mechaniker, Krankenpfleger, Bäcker, Polizist, Ingenieur, Handwerker, Bauarbeiter, Programmierer).
* **G:** *weil* vs *deshalb / darum* (cause and consequence); *wenn* vs *als*.
* **L:** *Das Vorstellungsgespräch*; *Paul arbeitet in Teilzeit*. **R:** *Mechaniker gesucht*; *Gestern habe ich angefangen*. **S:** *Im Vorstellungsgespräch*. **W:** *Mein Kurzprofil für ein Jobportal*.

### Unit 18 — Reisen, Urlaub und Mobilität
* **V (39):** booking and travel (buchen, Buchung, Reisebüro, Unterkunft, Übernachtung, Jugendherberge, Ferienwohnung, Prospekt, Reiseversicherung, Ticket, Fahrplan, Bahnsteig, Gepäck), road (Autobahn, tanken, Tankstelle, Stau, Führerschein, Zoll, Fähre), nature and weather (Strand, Meer, Berg, See, Sonne, Regen, Schnee, Wind, Wetter, Wald, Wettervorhersage), seasons, Ausland, Ausflug, besichtigen, Sehenswürdigkeit, sich erholen, Grenze.
* **G:** prepositions for places and destinations (*nach, in, an, auf, zu, bei, aus, von*); future with present tense and *werden* (weather forecasts).
* **L:** *Am Bahnhof: Ein Ticket kaufen*; *Wohin fahren wir im Sommer?*. **R:** *Prospekt: Ferien an der Ostsee*; *Eine Postkarte aus der Türkei*. **S:** *Wie war dein Urlaub?*. **W:** *Eine Postkarte aus dem Urlaub*.

### Unit 19 — Stadtleben und öffentliche Dienste
* **V (38):** offices (Amt, Rathaus, Bürgeramt, Anmeldung, sich anmelden, Formular, Antrag, ausfüllen, Unterschrift, unterschreiben, Ausweis, Aufenthaltserlaubnis), post and bank (Paket, Briefmarke, Brief, abschicken, Schalter, Geldautomat, abheben, überweisen), traffic and city (Fußgänger, Radweg, Kreuzung, Straßenbahn, Parkplatz, parken, Verbindung, Verkehr, Baustelle, Spielplatz, Umleitung), rules (erlaubt, verboten, Schild, Öffnungszeiten, geöffnet, geschlossen, Auskunft).
* **G:** *man* for rules and prohibitions; indirect questions (*Können Sie mir sagen, wo …? Ich möchte wissen, ob …*); route description with prepositions.
* **L:** *Im Bürgeramt: Anmeldung* (12 lines); *Auf der Straße: Wo ist die Post?*. **R:** *Formular: Anmeldung beim Bürgeramt*; *Rathaus: Öffnungszeiten und Regeln*. **S:** *Nach dem Weg fragen und erklären*. **W:** *Eine E-Mail an das Bürgeramt*.

### Unit 20 — Pläne, Einladungen und gemeinsame Entscheidungen
* **V (37):** Einladung, einladen, Feier, Party, Geschenk, Geburtstag, Hochzeit, gratulieren, mitbringen, sich verabreden, Verabredung, vorschlagen, Vorschlag, zusagen, Entscheidung, Möglichkeit, einverstanden, ablehnen, Alternative, abstimmen, Kompromiss, planen, vorhaben, Plan, organisieren, vielleicht, wahrscheinlich, sicher, bald, übermorgen, spätestens, leider, schade, herzlich, sich entschuldigen, viel Spaß, Prost.
* **G:** suggestions and invitations (*Wollen wir …? Lass uns … Ich schlage vor, dass …*); intentions and plans (*vorhaben, wollen, möchten, planen*); a consolidating review of connectors (*und, aber, oder, denn, weil, wenn, dass, deshalb*).
* **L:** *Was machen wir am Samstag?*; *Eine Einladung zum Geburtstag*. **R:** *Einladung zu meiner Party*; *E-Mails: Absage und Alternative*. **S:** *Wir planen das Wochenende*. **W:** *Eine Einladung zur Party*.

---

## 5. A2 mapping report: ten hidden legacy units → new A2 units

Each legacy unit is a *source* for several narrow new units. Rows are candidates, not decisions. The "why" column states which dimension matches (title / vocabulary theme / grammar / situation / skills).

| Legacy unit | New A2 unit candidate | Matching content and why it makes educational sense | Matching sections | Confidence | Recommendation |
|---|---|---|---|---|---|
| 11 Erfahrungen | **02 Besondere Erlebnisse und Erinnerungen** | *Vocabulary:* Erlebnis, erleben, Erfahrung, Veränderung. *Grammar:* Perfekt for experiences. *Situation:* telling about experiences/interview "Was hat sich verändert?". *Skills:* speaking *Erfahrungen im Gespräch*, writing e-mail about one's life | V, G, L, R, S, W | High | **Strong match** |
| 11 | **10 Geschichten und Erlebnisse erzählen** | *Grammar:* linking events (zuerst, danach, schließlich, weil, dass). *Vocabulary:* sequence words. *Skills:* narrative speaking/writing | V (sequence words), G, S, W | High | **Strong match** (shares source with 02: needs a split of the grammar and tasks) |
| 11 | 03 Als ich ein Kind war | *Grammar:* Präteritum *war, hatte, konnte, wollte, musste*. *Vocabulary:* aufwachsen, Heimat, früher, damals. *Text:* *Früher und heute* | G, V (few), R | Medium | Partial match |
| 11 | 01 Mein letztes Jahr | Perfekt for what happened; Umzug, Prüfung, Praktikum, vor zwei Jahren; listening *Im Deutschkurs: … was hast du gemacht?* | G, V (few), L | Medium | Partial match |
| 11 | 29 Früher und heute im Vergleich | Text *Früher und heute*; früher/damals; *sich verändern* (comparison structures are in Unit 13) | R, V | Low | Possible match |
| 11 | 16 Wünsche und persönliche Ziele | Traum, Ziel, Erfolg, erreichen, schaffen | V | Low | Possible match (pair with Unit 20 plans) |
| 11 | 14 Besondere Momente im Leben | Abschluss, Prüfung, Umzug, Praktikum, Stelle — life milestones | V | Low | Possible match |
| 12 Familie, Freunde | **20 Eigenschaften und Charakter** | *Vocabulary:* 9 character adjectives + 3 emotions. *Situation:* describing a friend. *Skills:* speaking *Über einen Freund erzählen*, reading *Mein Freund Kai* | V, R, S | Medium | **Partial match** (competes with 18 and 30) |
| 12 | **18 Menschen beschreiben** | Same adjective set; *Über einen Freund erzählen* | V, R, S | Medium | Partial match |
| 12 | 30 Gute und schlechte Eigenschaften | Adjective pairs (ehrlich, eifersüchtig, hilfsbereit, zuverlässig …) | V | Medium | Partial match (third unit from the same word set — needs distinct objectives) |
| 12 | **19 Neue Menschen kennenlernen** | Reflexive verbs *sich kennenlernen, sich treffen, sich verstehen*; reflexive-verb grammar | G, V | Medium | Partial match |
| 12 | 07 Geschenke und Überraschungen | schenken, gehören, gefallen + Dativ verbs/pronouns (*Ich schenke ihm …*) | G, V | Medium | Partial match (pair with Unit 20 Geschenk/Geburtstag) |
| 12 | 06 Menschen helfen und begegnen | hilfsbereit, Dativ verbs (*helfen* concept not in vocabulary), *sich treffen* | G, V | Low | Possible match |
| 12 | 23 Beziehungen und Kommunikation | Partner, Paar, sich streiten, vertrauen; *Eine Nachricht an die Mitbewohnerin* | V, W | Medium | Partial match |
| 12 | 21 Familie und Besitz | Cousin, Großeltern, Verwandte, Bekannte; `gehören` | V | Medium | Partial match |
| 12 | 25 Menschen, die ich kenne | Verwandte/Bekannte; personal pronouns | V, G | Low | Possible match |
| 12 | 14 Besondere Momente im Leben | *Am Telefon: Eine Hochzeit in der Familie*, heiraten | L, V | Low | Possible match |
| 13 Wohnen | **32 Meine Wohnung und mein Wohnort** | Housing + neighbourhood vocabulary; adjective endings; position verbs; two listenings, two texts, e-mail, viewing scenario | V, G, L, R, S, W | High | **Strong match** (all eight sections) |
| 13 | 31 Mein Alltag und meine Umgebung | Nachbarschaft, Lärm, Müll, Hausordnung, Mülltrennung | V, R | Medium | Partial match |
| 13 | 29 Früher und heute im Vergleich | Comparative/superlative grammar (*-er … als*, *am -sten*) | G | Medium | Partial match |
| 13 | 28 Das Beste in meinem Leben | Superlative (*am schönsten, am besten*) | G | Low | Possible match |
| 13 | 27 Stadt oder Land? | Comparatives; hell/dunkel/gemütlich/modern/geräumig; Wohn-/Nachbarschaft | G, V | Low | Possible match |
| 14 Gesundheit | **43 Ratschläge und Anweisungen** | *Grammar:* imperative (du/Sie), *sollen/dürfen*. *Situation:* friend gives tips; doctor's instructions; leaflet. *Skills:* listening *Eine Freundin gibt Tipps*, reading *Gebrauchsinformation* | G, L, R | High | **Strong match** (pair with Unit 19 route instructions and Unit 15 polite requests) |
| 14 | **05 Körperpflege und Gesundheit** | Body, illness, doctor, Notruf, sich entspannen/ausruhen (*Körperpflege* — hygiene — has **no** vocabulary) | V, L, R, S, W | Medium | **Partial match** (the health half is strong; the hygiene half is missing) |
| 14 | **13 Was mache ich, wenn …?** | *wenn* clauses (conditions and consequences) with health examples | G, ex | High | **Strong match** (concept); the situations are health-only |
| 14 | 35 Schwierigkeiten im Alltag | Krankschreibung, Notaufnahme, *Ich bin krank* e-mail | V, W | Low | Possible match |
| 15 Essen, Einkaufen | **41 Im Hotel und im Restaurant** | Restaurant half: menu vocabulary, *Bestellen und bezahlen*, *Café Sonne*, polite requests. Hotel half: only in Unit 18 (Unterkunft, Übernachtung) | V, G, L, R | Medium | **Partial match** (restaurant strong, hotel from Unit 18) |
| 15 | **15 Höflich nachfragen** | Polite requests (*Können Sie …? Ich hätte gern …*), customer-service dialogues, hairdresser call | G, L, S | Medium | **Partial match** (shares with Unit 19 indirect questions) |
| 15 | 26 Dinge, die ich brauche | Shopping, clothing, quantities, services | V, G | Medium | Partial match |
| 15 | 24 Jeder, niemand und etwas | Indefinite pronouns *einen/keinen/welche* (no *jeder/niemand/etwas* at all) | G | Low | Possible match |
| 15 | 35 Schwierigkeiten im Alltag | Umtausch, Reparatur, Werkstatt, *E-Mail: Umtausch* | V, W | Medium | Partial match |
| 16 Freizeit | **08 Worüber sprechen wir?** | Verbs with prepositions (*sprechen über, interessieren für …*) and topics of conversation: media, hobbies | G, V | Medium | **Partial match** (strong for the grammar) |
| 16 | 28 Das Beste in meinem Leben | *gern – lieber – am liebsten* (preferences, "best") | G | Medium | Partial match |
| 16 | 37 Was macht meine Stadt besonders? | Kino, Theater, Museum, Konzert, Ausstellung, Veranstaltung, Fest; *Kulturwoche im Stadtpark* | V, R | Medium | Partial match |
| 16 | 14 Besondere Momente im Leben | Fest, Feiertag, Veranstaltung; ordinals and dates | V, G | Low | Possible match |
| 16 | 12 Was ich denke und glaube | Kommentar zum Film (opinion writing), *langweilig/spannend/interessant* | W, V | Low | Possible match (opinion vocabulary only) |
| 16 | 23 Beziehungen und Kommunikation | Internet, Handy, Nachricht, App | V, R | Low | Possible match |
| 17 Schule, Beruf | **17 Gründe und Folgen** | *weil* vs *deshalb/darum* with work/school examples | G, ex | High | **Strong match** (concept) |
| 17 | 11 Warum ist das so? | Same grammar (reasons) | G | Medium | Partial match (shares with 17; define distinct objectives) |
| 17 | **22 Menschen und Berufe** | Occupations, workplace, job application; *Mechaniker gesucht*; interview scenario; job-portal profile | V, L, R, S, W | High | **Strong match** (concept strong; 8 occupations + workplace words) |
| 17 | 01 Mein letztes Jahr | *wenn* vs *als* (past events); *Gestern habe ich angefangen* | G, R | Low | Possible match |
| 17 | 36 Entscheidungen und Konsequenzen | Kündigen, Weiterbildung, Teilzeit/Vollzeit decisions; *deshalb* | V, G | Low | Possible match |
| 18 Reisen | **34 Die Umgebung und ihre Besonderheiten** | Landscape, weather, Sehenswürdigkeit, Ausflug; *Prospekt: Ferien an der Ostsee* | V, R | Medium | Partial match |
| 18 | **41 Im Hotel und im Restaurant** | Unterkunft, Übernachtung, Jugendherberge, Ferienwohnung, buchen | V | Medium | Partial match (hotel half) |
| 18 | **09 Meine Zukunftspläne** | Future with present tense/*werden*; *Wohin fahren wir im Sommer?* | G, L | Medium | Partial match |
| 18 | 27 Stadt oder Land? | Strand/Meer/Berg/See/Wald vs city | V | Low | Possible match |
| 18 | 01 Mein letztes Jahr | *Postkarte aus dem Urlaub*, *Wie war dein Urlaub?* (past experience) | R, S, W | Low | Possible match |
| 19 Stadtleben | **15 Höflich nachfragen** | Indirect questions (*Können Sie mir sagen, wo …?*), Auskunft, *Wo ist die Post?* | G, L, V | High | **Strong match** (concept + situation; pair with Unit 15 polite requests) |
| 19 | **37 Was macht meine Stadt besonders?** | Stadt, Verkehr, Radweg, Straßenbahn, Parkplatz, Spielplatz, Regeln (*man*); *Rathaus: Öffnungszeiten und Regeln* | V, G, R | Medium | **Partial match** |
| 19 | 31 Mein Alltag und meine Umgebung | Verkehr, Baustelle, Öffnungszeiten, post and bank | V | Medium | Partial match |
| 19 | 34 Die Umgebung und ihre Besonderheiten | Route description (prepositions), Kreuzung, Schild | G, V, L | Medium | Partial match |
| 19 | 35 Schwierigkeiten im Alltag | Amt, Formular, Antrag, Aufenthaltserlaubnis, Anmeldung, *E-Mail an das Bürgeramt* | V, L, R, W | Medium | Partial match |
| 19 | 43 Ratschläge und Anweisungen | Route instructions (imperative Sie) | G | Low | Possible match |
| 19 | 27 Stadt oder Land? | City-life vocabulary | V | Low | Possible match |
| 20 Pläne, Einladungen | **38 Entscheidungen treffen** | *Grammar:* suggestions (*Wollen wir … ? Lass uns …*). *Vocabulary:* Entscheidung, Möglichkeit, einverstanden, ablehnen, Alternative, abstimmen, Kompromiss. *Skills:* speaking *Wir planen das Wochenende* — title and content both fit | V, G, L, S | High | **Strong match** |
| 20 | **09 Meine Zukunftspläne** | *vorhaben/wollen/möchten/planen*; Plan, bald, übermorgen, spätestens | V, G, S | High | **Strong match** (shares with 38 and Unit 18 future) |
| 20 | 39 Zwei Möglichkeiten verbinden | Alternative, Kompromiss; connectors *und, aber, oder, denn, weil, wenn, dass, deshalb* (review) | G, V | Medium | **Partial match** |
| 20 | 07 Geschenke und Überraschungen | Geschenk, Geburtstag, Feier, gratulieren, mitbringen; *Einladung zum Geburtstag* | V, L, R, W | Medium | Partial match |
| 20 | 33 Gespräche und Reaktionen | zusagen, ablehnen, leider, schade, herzlich, sich entschuldigen, viel Spaß, Prost; *E-Mails: Absage und Alternative* | V, R | Medium | Partial match |
| 20 | 36 Entscheidungen und Konsequenzen | Entscheidung, Kompromiss, abstimmen | V | Low | Possible match |
| 20 | 14 Besondere Momente im Leben | Hochzeit, Geburtstag, Feier, Party | V | Medium | Partial match |
| 20 | 16 Wünsche und persönliche Ziele | Absichten/Pläne (concept) | G | Low | Possible match |

Where one new unit appears with several legacy sources, the combined mapping is shown in §6.

---

## 6. Overview of the 43 new A2 units: legacy availability (planning only)

Legend: **Strong** = existing content potentially reusable · **Partial** = partial existing content · **None** = no identified A2 legacy content. "Hidden A1" notes *cross-level* candidates from the A1 hidden legacy (at A1 level — see §8).

| № | New A2 unit | Possible legacy source (A2) | Content availability |
|---:|---|---|---|
| 01 | Mein letztes Jahr | 11, 17 (als), 18 | Partial |
| 02 | Besondere Erlebnisse und Erinnerungen | 11 | **Strong** |
| 03 | Als ich ein Kind war | 11 | Partial |
| 04 | Meine tägliche Routine | — (hidden A1 Unit 3 is routine at A1 level) | **None** |
| 05 | Körperpflege und Gesundheit | 14 | Partial (hygiene missing) |
| 06 | Menschen helfen und begegnen | 12 | Partial (weak) |
| 07 | Geschenke und Überraschungen | 12, 20 | Partial |
| 08 | Worüber sprechen wir? | 16 | Partial |
| 09 | Meine Zukunftspläne | 20, 18 | **Strong** |
| 10 | Geschichten und Erlebnisse erzählen | 11 | **Strong** |
| 11 | Warum ist das so? | 17 | Partial |
| 12 | Was ich denke und glaube | — (hidden A1 `wr10` *Zug oder Auto?* is an opinion task) | **None** |
| 13 | Was mache ich, wenn …? | 14, 17 | **Strong** (concept) |
| 14 | Besondere Momente im Leben | 20, 12, 11 | Partial |
| 15 | Höflich nachfragen | 19, 15 | **Strong** |
| 16 | Wünsche und persönliche Ziele | 11, 20 | Partial |
| 17 | Gründe und Folgen | 17 | **Strong** |
| 18 | Menschen beschreiben | 12 | Partial |
| 19 | Neue Menschen kennenlernen | 12 | Partial |
| 20 | Eigenschaften und Charakter | 12 | Partial |
| 21 | Familie und Besitz | 12 | Partial |
| 22 | Menschen und Berufe | 17 | **Strong** |
| 23 | Beziehungen und Kommunikation | 12, 16 | Partial |
| 24 | Jeder, niemand und etwas | 15 | Partial (weak: only *einen/keinen/welche*) |
| 25 | Menschen, die ich kenne | 12 | Partial (weak) |
| 26 | Dinge, die ich brauche | 15 | Partial |
| 27 | Stadt oder Land? | 19, 18, 13 | Partial |
| 28 | Das Beste in meinem Leben | 13, 16 | Partial |
| 29 | Früher und heute im Vergleich | 11, 13 | Partial |
| 30 | Gute und schlechte Eigenschaften | 12 | Partial |
| 31 | Mein Alltag und meine Umgebung | 13, 19 | Partial |
| 32 | Meine Wohnung und mein Wohnort | 13 | **Strong** |
| 33 | Gespräche und Reaktionen | 20, 15 | Partial |
| 34 | Die Umgebung und ihre Besonderheiten | 18, 19 | Partial |
| 35 | Schwierigkeiten im Alltag | 19, 15, 14 | Partial |
| 36 | Entscheidungen und Konsequenzen | 20, 17 | Partial |
| 37 | Was macht meine Stadt besonders? | 19, 16 | Partial |
| 38 | Entscheidungen treffen | 20 | **Strong** |
| 39 | Zwei Möglichkeiten verbinden | 20 | Partial |
| 40 | Was ist mir wichtig? | — | **None** |
| 41 | Im Hotel und im Restaurant | 15, 18 (+ hidden A1 Unit 10 *Hotel*) | Partial |
| 42 | Wenn ich mehr Zeit hätte … | — (Konjunktiv II is taught only at B1) | **None** |
| 43 | Ratschläge und Anweisungen | 14, 19 | **Strong** |

**Counts:** **Strong 10** (02, 09, 10, 13, 15, 17, 22, 32, 38, 43) · **Partial 29** · **None 4** (04, 12, 40, 42) = 43.

---

## 7. Unmapped legacy A2 content

Nearly every legacy A2 item has at least a partial home because the new titles are narrow. Items without a convincing destination:

| Legacy content | Why |
|---|---|
| Unit 16 *Medien* vocabulary (Fernseher, Zeitung, Zeitschrift, Sendung, App, herunterladen, online) | No new unit about media; only weak fit with 23 (communication) and 08 (conversation topics) |
| Unit 16 sports and hobbies (schwimmen, wandern, tanzen, malen, joggen, Mannschaft, Verein) | No new A2 unit about leisure activities (A1 has 31 *Meine Freizeit und Hobbys*) |
| Unit 16 ordinal numbers and dates (`a2-ordinalzahlen-datum`) | No date/calendar unit |
| Unit 18 transport and road vocabulary (Autobahn, tanken, Tankstelle, Stau, Führerschein, Zoll, Fähre, Bahnsteig, Fahrplan, Ticket) | No travel/mobility unit; only 41 (hotel) and 34 (surroundings) partially fit |
| Unit 18 prepositions for places and destinations (`a2-praepositionen-reiseziele`) | No unit teaches *nach/in/an/auf/zu* by destination |
| Unit 19 post and bank (Paket, Briefmarke, Brief, Geldautomat, abheben, überweisen) | Only weak fit with 35 (daily difficulties) |
| Unit 15 clothing and services (Kleid, Pullover, Mantel, Friseur, Reinigung, Werkstatt, Lieferung) | Weak fit with 26 and 35 |
| Unit 17 school and study (Klasse, Fach, Note, Zeugnis, Stundenplan, Hausaufgabe, Vorlesung, Semester) | No new unit about education |
| Unit 13 *Positionsverben* (`stehen/stellen, liegen/legen, hängen`) | Fits 32 only if the housing unit keeps its grammar |
| Authored **final tests (15 questions each)** of all ten units | They are bound to the legacy unit's items; they cannot move with partial content |
| The 43 "why" notes, instructions and tutor templates | Attached to the legacy concepts; they follow the concept, not a unit |

---

## 8. Quality, duplication and level audit

**Duplicate vocabulary**
* **None** inside legacy A2 (377 distinct headwords). One word is shared with A1: *Erfahrung* (A1 Unit 6, A2 Unit 11).
* Thematic overlaps (different words, same theme): *Termin / Arzt* (A1 Unit 8 and A2 Unit 14), *Wohnung* (A1 Unit 5 vs A2 Unit 13), *Restaurant/Essen* (A1 Unit 4 vs A2 Unit 15), *Beruf* (A1 Unit 6 vs A2 Unit 17), *Reisen* (A1 Unit 10 vs A2 Unit 18). The A2 sets are deliberately more advanced.

**Repeated grammar**
* **`wenn`** is taught three times: Unit 14 (`a2-wenn-saetze`), Unit 17 (`a2-wenn-als`) and again in the Unit 20 consolidation (`a2-satzverbindungen-integration`). New 13 *Was mache ich, wenn …?* and 39 *Zwei Möglichkeiten verbinden* would re-teach it.
* **Reasons/connectors**: *weil* is in Unit 11 (`a2-ereignisse-verbinden`), Unit 17 (`a2-deshalb-darum`) and Unit 20 (consolidation). New 11 *Warum ist das so?* and 17 *Gründe und Folgen* are drawn from the same concept.
* **Politeness** is split across Unit 15 (`a2-hoefliche-bitten`) and Unit 19 (`a2-indirekte-fragen`); both map to new 15 *Höflich nachfragen*.
* **Imperative** is taught in Unit 14 and re-used in Unit 19's route descriptions.
* **Adjective endings** are intentionally split: indefinite article (Unit 13) → definite article (Unit 15, which says "In unit 13 you learned …"). A migration must keep this order.
* **Perfekt** is taught in A2 Unit 11 although A1 Unit 8 already introduces it (A1 hidden legacy).

**Exercises**
* Every unit has exactly 8 hand-written exercises (3 fill, 3 choice, 2 order) tied to its concepts: no generated drills at A2. Exercises that test the same objective do not exist inside A2; the repetition is in *concepts* (above).

**Materials that could fit several new units**
* Unit 12 listening *Am Telefon: Eine Hochzeit in der Familie* → 14, 18/19/20. · Unit 19 *Im Bürgeramt: Anmeldung* → 15, 35. · Unit 20 *Eine Einladung zum Geburtstag* → 07, 14, 33. · Unit 11 *Früher und heute* → 03, 29. · Unit 14 *Eine Freundin gibt Tipps* → 43, 13.

**Cross-level overlaps with new A1 titles (curriculum decision needed)**
| New A2 | New A1 with similar title/theme |
|---|---|
| 04 Meine tägliche Routine | 03 Mein Tagesablauf, 23, 29 |
| 18 Menschen beschreiben | 18 Menschen und Dinge beschreiben |
| 19 Neue Menschen kennenlernen | 07 Neue Bekanntschaften |
| 21 Familie und Besitz | 16 Meine Familie und meine Sachen |
| 32 Meine Wohnung und mein Wohnort | 35 Meine Wohnung und Möbel |
| 41 Im Hotel und im Restaurant | 30 Im Restaurant und zu Hause |
| 31 Mein Alltag und meine Umgebung | 29 Mein Morgen und mein Alltag |
| 29 Früher und heute im Vergleich | A1 36 Früher und heute |

**Hidden legacy A1 content that could be a starting point for A2 units** (level to be decided): A1 Unit 3 → A2 04; A1 Unit 6 (Berufe) → A2 22; A1 Unit 6 `conjunctions` → A2 11/17/39; A1 Unit 10 (Hotel, Koffer, Pass) → A2 41; A1 `doctor` scenario and real-life *arzt* → A2 05; A1 Unit 2 → A2 21; A1 `wr10` (opinion writing) → A2 12.

**Content that should remain separate:** the ten authored 15-question final tests; Unit 16 media/leisure and Unit 18 mobility (no destination); the level-wide instructions/tutor templates.

**Review/beta status:** every legacy A2 item is in controlled Beta; migrating it must not drop the review flags or the Kyrgyz "unreviewed" markers.

---

## 9. Recommendations for future migration (not approved, not started)

1. **Define each new unit's distinct learning objective first.** The 43 titles overlap (18/20/30 all want character adjectives; 11/17 both want *Gründe*; 03/29 and 04 duplicate A1; 25/26 are thin). Without this, migration produces near-identical units.
2. **Migrate by item and concept, not by legacy unit.** Move a vocabulary item together with the listening/reading/writing items that use it. Never move a legacy unit as a block.
3. **Start with the strongest, cleanest candidates:** 32 (Unit 13), 38 + 09 (Unit 20), 02 + 10 (Unit 11), 43 (Unit 14), 15 (Units 19 + 15), 17 + 22 (Unit 17).
4. **Resolve the speaking pairing by topic** and plan new authored final tests for migrated subsets (a 15-question test written for 37 words and 3 concepts cannot serve a unit that received 8 words and 1 concept).
5. **Preserve identifiers.** Progress keys are `"<unit>:<section>"`, `topic:<concept>` and `ex:<id>`; legacy A2 records (ids 11–20) must remain readable. Hidden legacy units must stay until the mapping is signed off.
6. **Keep the grammar sequence** (indefinite → definite adjective endings; Perfekt → Präteritum; *wenn* → *wenn/als*).
7. **Original content is needed** for 04, 12, 40 and 42 (and parts of 05, 24, 25, 06). 42 requires Konjunktiv II, which belongs to B1 in the legacy plan — decide whether it is an A2 objective.
8. **Review Beta flags** and the Kyrgyz glossary when content moves; migrated items inherit "unreviewed" status.

---

## 10. Counts for the combined summary (A2 part)

| Metric | A2 |
|---|---:|
| Legacy units reviewed | 10 |
| Strong matches (new units with a strong legacy candidate) | 10 (02, 09, 10, 13, 15, 17, 22, 32, 38, 43) |
| Partial matches (new units) | 29 |
| New units without identified legacy material | 4 (04, 12, 40, 42) |
| New units already populated | 0 |

---

## 11. Combined A1 + A2 summary

| | A1 | A2 | Total |
|---|---:|---:|---:|
| Legacy units reviewed | 10 (9 hidden + Unit 1) | 10 (all hidden) | **20** |
| New units | 38 | 43 | **81** |
| Strong-match new units (legacy candidate, excl. already-populated) | 9 | 10 | **19** |
| Partial-match new units | 24 | 29 | **53** |
| New units without identified legacy material | 4 (14, 15, 25, 26) | 4 (04, 12, 40, 42) | **8** |
| New units already populated | 1 (01) | 0 | **1** |
| Section containers (8 per unit) | 304 | 344 | **648** |
| Legacy exact-title matches | 1 | 0 | **1** |

(Sums: A1 1 + 9 + 24 + 4 = 38; A2 10 + 29 + 4 = 43.)

---

## 12. Verification (read-only)

* No source code was modified.
* No curriculum data was modified; the 43 A2 containers and the ten hidden units are exactly as before.
* No educational content was copied, moved or created.
* No legacy unit was deleted or renamed; unit ids and progress identifiers (`<unit>:<section>`, `topic:<id>`, `ex:<id>`) are unchanged.
* A1 and A2 remain in their current state; only this report and the A1 report were created (in `docs/`).
