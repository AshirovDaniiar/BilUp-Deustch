# A2 Stage 7B — Vocabulary map, Units 12–20

**Status:** curriculum DESIGN (a specification, not production content). Nothing here is in the data modules. Unit 11 (pilot, 37 items) and all A1 content are unchanged.

## 1. Rules of this map

* **One owner per word.** Every word below is *new* in its unit and belongs to that unit only (`v<unit>-<n>` ids will follow the order of this map). A word used again in a later unit is **recycled**, not re-listed. A mechanical check (`tests/authoring/curriculum-map.test.ts`) fails if a lemma appears twice in A2 (articles, `sich`, `(Pl.)`, `(R)` are ignored for the comparison) or equals an A1 / Unit 11 vocabulary lemma.
* **Productive vs. receptive.** Unmarked = *productive* (learner must be able to use it in speaking/writing and may be required in a task). `(R)` = *receptive* (recognise in texts, glosses and answer options; **never required** in a fill gap, a speaking keyword or a writing requirement — the rule fixed for Unit 11 by decision F4). Target: at most ~20 % receptive per unit.
* **Size.** 28+ per unit is the minimum; the map plans 36–40 so that a unit can lose a few items in review and still pass. Final counts are fixed when the unit is authored.
* **Nouns** get article + plural (the authoring format of `src/data/a2/vocabulary.ts`); `(Pl.)` = only plural; reflexive verbs are listed with `sich`.
* **Level discipline.** Anything that a reviewer is likely to place at B1 is `(R)` or absent. Open lexical questions are in the Stage 7B report (§ unresolved questions).
* **Not listed:** A1 words and Unit 11 words that the units reuse; names; numbers; loan-word glosses used only inside texts (a text gloss is not a vocabulary item).

## 2. Unit maps

### Unit 12 — Familie, Freunde und Zusammenleben (40 items: 35 productive, 5 receptive)
- **Verwandte und Beziehungen** (11): der Cousin; die Cousine; die Geschwister (Pl.); die Großeltern (Pl.); der Partner; die Partnerin; das Paar; ledig; geschieden (R); der Verwandte (R); der Bekannte (R)
- **Charakter** (9): freundlich; nett; sympathisch; lustig; ehrlich; höflich; hilfsbereit; zuverlässig; eifersüchtig (R)
- **Gefühle** (6): glücklich; traurig; wütend; lieben; mögen; vertrauen (R)
- **Zusammenleben und Haushalt** (14): sich kennenlernen; sich treffen; sich verstehen; sich streiten; heiraten; zusammenleben; der Haushalt; die Hausarbeit; abwaschen; aufräumen; teilen; schenken; gehören; gefallen

### Unit 13 — Wohnen und Nachbarschaft (37 items: 33 productive, 4 receptive)
- **Wohnungssuche und Vertrag** (8): die Anzeige; die Besichtigung; der Mietvertrag; die Kaution; die Nebenkosten (Pl.); der Mieter; einziehen; ausziehen
- **Räume und Ausstattung** (8): der Flur; der Keller; der Aufzug; die Heizung; die Waschmaschine; der Herd; das Regal; der Dachboden (R)
- **Eigenschaften** (6): hell; dunkel; gemütlich; modern; möbliert; geräumig (R)
- **Nachbarschaft und Hausordnung** (10): der Nachbar; die Nachbarin; die Nachbarschaft; der Lärm; der Müll; die Hausordnung; die Mülltrennung (R); grüßen; stören; renovieren (R)
- **Einrichten (Position / Richtung)** (5): stehen; liegen; hängen; stellen; legen

### Unit 14 — Gesundheit und Wohlbefinden (38 items: 34 productive, 4 receptive)
- **Körper** (11): der Kopf; der Hals; der Rücken; der Bauch; der Arm; das Bein; der Fuß; die Hand; das Auge; das Ohr; der Zahn
- **Beschwerden** (12): die Erkältung; der Husten; der Schnupfen; das Fieber; die Grippe (R); die Kopfschmerzen (Pl.); die Bauchschmerzen (Pl.); wehtun; sich fühlen; krank; gesund; erkältet
- **Arzt und Medikamente** (9): die Praxis; die Tablette; die Salbe; der Notruf; der Krankenwagen; die Notaufnahme; die Untersuchung (R); untersuchen (R); die Krankschreibung (R)
- **Gesund leben** (6): die Gesundheit; sich bewegen; sich ausruhen; sich entspannen; der Stress; trainieren

### Unit 15 — Essen, Einkaufen und Dienstleistungen (38 items: 36 productive, 2 receptive)
- **Lebensmittel** (9): das Obst; die Wurst; der Fisch; die Butter; der Joghurt; die Nudeln (Pl.); das Mehl; der Zucker; die Tomate
- **Mengen und Verpackungen** (8): das Kilo; das Gramm; der Liter; die Flasche; die Dose; die Packung; das Stück; die Scheibe
- **Restaurant und Geschmack** (8): die Vorspeise; die Hauptspeise; der Nachtisch; die Portion; scharf; süß; vegetarisch; schmecken
- **Kleidung** (4): das Kleid; der Pullover; der Mantel; passen
- **Einkaufen und Dienstleistungen** (9): reduziert; die Quittung; der Friseur; die Reinigung; die Reparatur; reparieren; die Werkstatt; die Lieferung (R); liefern (R)

### Unit 16 — Freizeit, Medien und Kultur (36 items: 33 productive, 3 receptive)
- **Hobbys und Sport** (10): das Hobby; der Verein; schwimmen; wandern; tanzen; malen; fotografieren; joggen; das Training; die Mannschaft (R)
- **Medien** (11): das Internet; das Handy; die Nachricht; die Zeitung; die Zeitschrift; die Sendung; der Fernseher; die App; das Foto; herunterladen (R); online (R)
- **Kultur und Veranstaltungen** (9): das Kino; das Theater; das Museum; die Ausstellung; das Konzert; das Fest; der Feiertag; die Eintrittskarte; die Veranstaltung
- **Meinung und Vorlieben** (6): langweilig; spannend; interessant; sich interessieren; sich freuen; warten

### Unit 17 — Schule, Ausbildung und Beruf (37 items: 30 productive, 7 receptive)
- **Schule und Studium** (11): die Klasse; das Fach; die Note; das Zeugnis; der Stundenplan; die Hausaufgabe; der Unterricht; die Berufsschule; die Universität; das Semester (R); die Vorlesung (R)
- **Ausbildung und Qualifikation** (6): das Zertifikat; der Kurs; die Kenntnisse (Pl.); sich bewerben; die Fähigkeit (R); die Weiterbildung (R)
- **Arbeitswelt** (12): der Arbeitgeber; das Vorstellungsgespräch; die Teilzeit; die Vollzeit; der Arbeitsvertrag; die Arbeitszeit; die Überstunden (Pl.); die Besprechung; das Team; der Arbeitnehmer (R); kündigen (R); die Kündigung (R)
- **Berufe** (8): der Mechaniker; der Krankenpfleger; der Bäcker; der Polizist; der Ingenieur; der Handwerker; der Bauarbeiter; der Programmierer

### Unit 18 — Reisen, Urlaub und Mobilität (39 items: 33 productive, 6 receptive)
- **Reise planen** (9): buchen; die Buchung; das Reisebüro; die Unterkunft; die Übernachtung; die Jugendherberge; die Ferienwohnung; der Prospekt (R); die Reiseversicherung (R)
- **Unterwegs** (11): das Ticket; der Fahrplan; der Bahnsteig; das Gepäck; die Autobahn; tanken; die Tankstelle; der Stau; der Führerschein; der Zoll (R); die Fähre (R)
- **Urlaub und Natur** (11): der Strand; das Meer; der Berg; der See; die Sonne; der Regen; der Schnee; der Wind; das Wetter; der Wald; die Wettervorhersage (R)
- **Orte, Jahreszeiten, Aktivitäten** (8): das Ausland; der Sommer; der Winter; der Ausflug; besichtigen; die Sehenswürdigkeit; sich erholen; die Grenze (R)

### Unit 19 — Stadtleben und öffentliche Dienste (38 items: 35 productive, 3 receptive)
- **Behörden und Formulare** (12): das Amt; das Rathaus; das Bürgeramt; die Anmeldung; sich anmelden; das Formular; der Antrag; ausfüllen; die Unterschrift; unterschreiben; der Ausweis; die Aufenthaltserlaubnis (R)
- **Post und Bank** (8): das Paket; die Briefmarke; der Brief; abschicken; der Schalter; der Geldautomat; abheben; überweisen (R)
- **Verkehr und Stadt** (11): der Fußgänger; der Radweg; die Kreuzung; die Straßenbahn; der Parkplatz; parken; die Verbindung; der Verkehr; die Baustelle; der Spielplatz; die Umleitung (R)
- **Regeln und Auskunft** (7): erlaubt; verboten; das Schild; die Öffnungszeiten (Pl.); geöffnet; geschlossen; die Auskunft

### Unit 20 — Pläne, Einladungen und gemeinsame Entscheidungen (37 items: 33 productive, 4 receptive)
- **Einladung und Feier** (11): die Einladung; einladen; die Feier; die Party; das Geschenk; der Geburtstag; die Hochzeit; gratulieren; mitbringen; sich verabreden; die Verabredung
- **Vorschlagen und entscheiden** (10): vorschlagen; der Vorschlag; zusagen; die Entscheidung; die Möglichkeit; einverstanden; ablehnen (R); die Alternative (R); abstimmen (R); der Kompromiss (R)
- **Planen und Zeit** (10): planen; vorhaben; der Plan; organisieren; vielleicht; wahrscheinlich; sicher; bald; übermorgen; spätestens
- **Höflichkeit und Gefühle** (6): leider; schade; herzlich; sich entschuldigen; viel Spaß; Prost

## 3. Totals

| Unit | Items | Productive | Receptive | Categories |
| --- | --- | --- | --- | --- |
| 11 (pilot, authored) | 37 | 28 | 9 | 5 |
| 12 | 40 | 35 | 5 | 4 |
| 13 | 37 | 33 | 4 | 5 |
| 14 | 38 | 34 | 4 | 4 |
| 15 | 38 | 36 | 2 | 5 |
| 16 | 36 | 33 | 3 | 4 |
| 17 | 37 | 30 | 7 | 4 |
| 18 | 39 | 33 | 6 | 4 |
| 19 | 38 | 35 | 3 | 4 |
| 20 | 37 | 33 | 4 | 4 |
| **A2 total** | **377** | **330** | **47** | |

(Unit 11 receptive = the nine words recorded in `UNIT_11_RECEPTIVE_WORDS`.) Together with A1 (226 items) the course would reach ≈ 600 words, the order of magnitude usually associated with a complete A2 core; the figure is a plan, not a CEFR claim.

## 4. Recycling plan (A1 / Unit 11 words that the units must reuse, so they are practised again)

| Unit | Recycles from A1 | Recycles from A2 |
| --- | --- | --- |
| 12 | Familie words (u2), Freizeit (u3), haben/sein, Possessive | 11: Perfekt (kennenlernen), Erfahrung, früher/damals |
| 13 | Wohnung, Zimmer, Möbel, Miete, Vermieter (u5); Wechselpräpositionen | 12: Nachbarn as people; Haushalt, aufräumen |
| 14 | Arzt, Termin, Apotheke (u6–u8), müssen/können | 12: sich verstehen/treffen (reflexive); 13: Imperativ-like Hausordnung |
| 15 | Essen und Trinken (u4), Einkaufen (u9: kaufen, kosten, Größe, Hose, Jacke) | 13: Komparativ (billiger); 12: Dativ pronouns (mir) |
| 16 | Freizeit (u3), Zeit/Termine (u8) | 12: reflexive; 13: Komparativ; 14: wenn |
| 17 | Arbeit/Beruf (u6), Bewerbung, Lebenslauf | 11: Ausbildung, Abschluss, Praktikum, Stelle, Perfekt/Präteritum; 14: wenn |
| 18 | Unterwegs (u10), Stadt (u7), Hotel | 13: Komparativ; 16: Datum; 11: Perfekt |
| 19 | Stadt (u7), Post/Bank words from the real-life topics | 14: Imperativ, dürfen; 15: höfliche Bitten; 18: Präpositionen |
| 20 | Zeit/Termine (u8), Einladungen | everything: weil/dass/wenn/deshalb (11, 14, 17), Imperativ (14), Dativ pronouns (12), Ordnungszahlen (16) |

## 5. Topics that are deliberately NOT given a vocabulary block (and why)

Numbers, colours, days, months and basic time words (A1); countries and nationalities (taught inside unit 18 texts as names, not as items); fashion/colour adjectives beyond the basics (unit 15 uses A1 colours); technical vocabulary of professions beyond the eight jobs in unit 17; emotions beyond the six in unit 12; sports equipment; legal/insurance vocabulary (B1+).
