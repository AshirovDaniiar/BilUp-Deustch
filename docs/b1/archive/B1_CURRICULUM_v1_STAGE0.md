> **ARCHIVE — superseded by `../B1_CURRICULUM.md` (v2) after the Stage 2A review (`../B1_CURRICULUM_REVIEW.md`). Kept unchanged as the Stage 0 audit record; do not use for planning.**

# B1 curriculum proposal — Units 21–32

**Status: PROPOSAL (Stage 1). Not approved, not content, not reviewed by any person.** Nothing in this file is implemented; no B1 unit, concept, text or test exists in the repository. Every "B1 suitability" statement is the author's judgement from common CEFR B1 curriculum practice (Goethe-Zertifikat B1 / telc B1 style scope) and is **not** a CEFR authority and **not** a human review. The repository holds no authoritative CEFR word list (see `scripts/content-validate/rules/cefr.ts` header), so no lexical level claim is made.

Companion documents: [`B1_ARCHITECTURE.md`](B1_ARCHITECTURE.md), [`B1_IMPLEMENTATION_PLAN.md`](B1_IMPLEMENTATION_PLAN.md), [`B1_QA_CHECKLIST.md`](B1_QA_CHECKLIST.md).

## 1. Evidence base (what B1 must follow)

| Fact | Source |
| --- | --- |
| A1 = units 1–10 (released); A2 = units 11–20 (controlled Beta, ru/ky); B1 id range proposed **21–32** (12 units) | `src/data/course.ts:37-40`; task brief |
| A1 grammar (20 concepts): articles, sein/haben, questions, Nominativ, plural, possessive, regular verbs, verb position, separable, Akkusativ, negation, modal, Wechselpräpositionen, conjunctions (weil/und/aber…), Dativ, Dativ prepositions, time order, Perfekt, Akkusativ prepositions, **Genitiv** (unit 10, tagged `level: 'A2'` — legacy) | `src/data/grammar.ts` |
| A2 grammar (~27 concepts): Perfekt/Präteritum of sein-haben-modal, `weil`/`dass`/`zuerst…`, Pronomen Akk/Dat, Dativverben, Reflexive (Akk only), Adjektivendungen after ein-/der- in Nom/Akk, Komparativ/Superlativ, Positionsverben, Imperativ, sollen/dürfen, `wenn`, `deshalb/darum`, `wenn` vs `als`, Mengen/Indefinitpronomen, höfliche Bitten (*hätte gern* as chunk), gern/lieber, **six** verb+preposition pairs (all Akk), Ordinalzahlen/Datum, Reiseziel-Präpositionen, Zukunft (Präsens + *werden* mostly receptive), *man*+Modal, indirekte Fragen (*ob*/W-Wort), Wegbeschreibung, Vorschläge, Absichten, Satzverbindungen | `docs/authoring/A2_STAGE7B_GRAMMAR_PROGRESSION.md` §3 |
| A2 ceiling explicitly **excluded** from A2 (= B1 candidates): Passiv, Relativsatz, Konjunktiv II as taught form, Plusquamperfekt, `um … zu`, `obwohl`, `damit`, `nachdem`, Genitiv production, `trotzdem`, reflexive **Dativ**, Dativ/Genitiv adjective endings, adjectives without article, `da(r)-`/`wo(r)-` adverbs, Verbs+Präposition beyond six pairs | same, §1 principle 3 and "Limit" columns |
| Unit contract of a strict level (applies automatically to B1): ≥28 vocabulary, 2–3 grammar concepts, ≥2 listening, 1–2 reading, 1 speaking scenario, 1 writing task, ≥8 revision exercises, 15 authored final-test questions, one `topic` test per unit, Russian **and** Kyrgyz independent for every field | `scripts/content-validate/rules/metadata.ts:11-22`, `docs/authoring/A2_AUTHORING_GUIDE.md` |
| Unit sections (fixed set, a section counts only if content exists): vocabulary, grammar, listening, reading, speaking, writing, review, test | `src/data/units.ts:16`, `src/features/progress/stats.ts:86-100` |
| Existing A2 unit design pattern (title, German-only title in plan, key `a2-…`, subtitle ru/ky/de, icon, 2–3 `grammarIds`) | `src/data/a2/registry.ts`, `src/data/a2/units.ts` |

## 2. Design principles

1. **One new idea per concept, taught when a task needs it; recycled, never re-taught.** (Same rule as A2 Stage 7B.)
2. **B1 starts where the A2 exclusion list ends.** Every B1 concept below is either on that exclusion list or extends an A2 concept to a wider domain (stated in "Neu gegenüber A2"). No A1/A2 concept is re-taught; where B1 needs it, it is recycled in revision items and marked ↻.
3. **Productive vs. receptive.** A structure may appear receptively before it is taught; it is *required* in tasks only from the unit that teaches it. Structures marked *(rezeptiv)* are never required in writing/speaking tasks or final-test production items.
4. **B1 ceiling (proposed, to be confirmed by a CEFR reviewer):** no Futur II, no Konjunktiv I / indirect speech with Konjunktiv, no long Partizipialattribute, no Nominalstil beyond fixed phrases, no `es sei denn`, no `anstatt dass`/`ohne dass`, no Passiv with Modalverb in the past (*hätte gemacht werden müssen*).
5. **Communicative first.** Each unit is organised around 2–3 can-do statements and real scenarios (work, housing, health, authorities, media); the grammar serves them.
6. **Spiral assessment.** Each unit's 15 final-test questions recycle at least two items from earlier units (↻); the Unit 32 level test samples all 12 units.
7. **Text sizes grow.** A2 limits (reading 30–180 words, sentence ≤ 22 words, listening ≤ 140 words) are too tight for B1; proposed B1 targets: reading 120–260 words, sentences ≤ 28 words, listening 120–220 words (≈ 1–1.5 min through TTS). The validator needs a per-level profile (see Architecture §9, Plan Stage B3).
8. **What the application can actually measure.** Speaking and writing analysis are rule-based (`src/services/analysis.ts`; README "Known limitations"): speaking scenarios are scripted turns with keyword hints, writing tasks check length and `mustInclude` patterns. Objectives below are therefore written as *can-do statements the learner practises*; the app measures only keyword coverage, length and structure, never fluency or accuracy. This must be disclosed in the Beta notice and QA (see QA §K).

## 3. Overview

| Unit | Key (stable id, proposed) | Titel (Deutsch) | Domain | New grammar (concept ids proposed) |
| --- | --- | --- | --- | --- |
| 21 | `b1-erlebnisse-erinnerungen` | Erlebnisse und Erinnerungen erzählen | past narration | `b1-praeteritum-erzaehlen`, `b1-plusquamperfekt-nachdem`, `b1-temporale-konnektoren` |
| 22 | `b1-meinungen-diskussion` | Meinungen äußern und diskutieren | opinion, argument | `b1-konzessive-saetze`, `b1-doppelkonnektoren`, `b1-verben-praepositionen-1` |
| 23 | `b1-arbeit-bewerbung` | Arbeit, Bewerbung und Karriere | work | `b1-relativsaetze-nom-akk`, `b1-infinitiv-mit-zu`, `b1-adjektivdeklination-vollstaendig` |
| 24 | `b1-wohnen-umwelt` | Wohnen, Umzug und Umwelt | housing, environment | `b1-passiv-praesens-perfekt`, `b1-passiv-modalverben` |
| 25 | `b1-gesundheit-lebensstil` | Gesundheit, Körper und Lebensstil | health, lifestyle | `b1-konjunktiv2-ratschlaege`, `b1-reflexive-dativ`, `b1-verben-praepositionen-2` |
| 26 | `b1-medien-technik` | Medien, Technik und Internet | media, technology | `b1-passiv-praeteritum-zustand`, `b1-partizip-als-adjektiv`, `b1-lassen` |
| 27 | `b1-konsum-reklamation` | Konsum, Reklamation und Dienstleistungen | consumption, complaints | `b1-konjunktiv2-wuensche-irreal`, `b1-genitiv-praepositionen`, `b1-konjunktiv2-hoeflichkeit` |
| 28 | `b1-bildung-zukunft` | Bildung, Lernen und Zukunftspläne | education, future | `b1-futur1-vermutungen`, `b1-falls-sobald-solange`, `b1-wortbildung-nomen` |
| 29 | `b1-reisen-kultur` | Reisen, Kultur und Alltag im Vergleich | travel, intercultural | `b1-relativsaetze-dativ-praeposition`, `b1-genitivattribute`, `b1-wiedergeben-indikativ` |
| 30 | `b1-gesellschaft-engagement` | Gesellschaft, Zusammenleben und Engagement | society, volunteering | `b1-nomen-verb-verbindungen`, `b1-konsekutiv-final`, `b1-textkohaesion` |
| 31 | `b1-behoerden-recht` | Behörden, Verträge und Alltagsprobleme | authorities, formal register | `b1-formelle-sprache`, `b1-konjunktiv2-vergangenheit`, `b1-aktiv-passiv-umformung` |
| 32 | `b1-rueckblick-pruefung` | Rückblick, Bilanz und Prüfungsvorbereitung | consolidation, level test | `b1-nebensaetze-integration`, `b1-konjunktiv2-bilanz` |

**Totals (proposal):** 12 units, 34 grammar concepts (A2: 27), ≥ 336 productive vocabulary items at the unit minimum (28 × 12; target 30–34 per unit ≈ 380–400), ≥ 24 listening dialogues, 12–24 reading texts, 12 speaking scenarios, 12 writing tasks, ≥ 96 revision exercises, 180 final-test questions (15 × 12), plus the Level Test.

### 3.1 No-duplication matrix (grammar)

| B1 concept | Already in A1/A2? | Relation |
| --- | --- | --- |
| Präteritum of regular/irregular verbs | A2 `a2-praeteritum-sein-haben-modal` (sein, haben, modals only) | **extends**; Perfekt stays the spoken tense |
| Plusquamperfekt / `nachdem` | none (excluded in A2) | new |
| `bevor / während / seitdem / bis` | A2 has `wenn`, `als`, `seit`/`vor` as prepositions | extends; `als`/`wenn` only recycled ↻ |
| `obwohl`, `trotzdem`, `je … desto`, `weder … noch`, `zwar … aber` | `trotzdem` excluded in A2; A2 ends with `entweder … oder` **receptive** | new / productive |
| Verbs + Präposition | A2 caps at six Akk pairs | extends with Dativ pairs and `da(r)-`/`wo(r)-` |
| Relativsatz | none (excluded) | new (Nom/Akk first, Dativ/Präposition in Unit 29) |
| Infinitiv mit *zu*, *um … zu*, *damit* | none | new |
| Adjektivdeklination | A2: after ein-/der-, Nom/Akk only | **extends** to Dativ, Plural, without article |
| Passiv | none | new |
| Konjunktiv II | A2: *hätte gern*, *Wie wäre es* as chunks only | **extends** from chunk to productive forms |
| Reflexive Dativ | explicitly excluded in A2 | new |
| Genitiv | A1 `genitiv` (unit 10, legacy tag A2); A2 "no Genitiv production" | **dependency:** scope of the A1 concept must be read before Unit 27/29 are authored (Plan Blocker B-3) |
| Futur I | A2 `werden` mainly receptive | extends |
| `indirekte Fragen` (ob / W-Wort) | A2 Unit 19 | **recycled only**; Unit 29 adds reporting with `dass`/`ob` in Indikativ |

## 4. Units

Format of every unit: German title · can-do **Lernziele** · **Wortschatz** themes · **Grammatik** (Neu gegenüber A2 / Nicht in dieser Unit) · **Lesen / Hören / Sprechen / Schreiben** objectives · **Szenarien** · **Abschlusstest**. Every item is authored in German **plus independent Russian and Kyrgyz** (strict, no fallback — the platform rule for non-A1 levels).

Common to all units (not repeated): reading 1–2 texts, listening 2 dialogues/monologues, 1 speaking scenario (6–8 scripted turns), 1 writing task, 8 revision exercises, 15 final-test questions (distribution in §5), vocabulary ≥ 28 productive + a receptive list.

---

### Unit 21 — Erlebnisse und Erinnerungen erzählen

**Lernziele:** Ich kann zusammenhängend von vergangenen Erlebnissen erzählen und die Reihenfolge der Ereignisse klar machen. Ich kann über Kindheit und frühere Gewohnheiten sprechen. Ich kann Gefühle zu einem Erlebnis beschreiben.
**Wortschatz:** Erinnerungen und Kindheit; Ereignisse (Unfall, Überraschung, Panne, Zufall); Gefühle (erleichtert, enttäuscht, begeistert, peinlich); Zeitadverbien (damals, inzwischen, plötzlich, kurz darauf, schließlich, seitdem).
**Grammatik** — Neu: Präteritum regelmäßiger/unregelmäßiger Verben im schriftlichen Erzählen (Perfekt im Gespräch ↻); Plusquamperfekt + `nachdem`; `bevor`, `während`, `seitdem`, `bis`. Nicht in dieser Unit: Passiv, Relativsätze; `als`/`wenn` werden nur wiederholt (↻ A2-Unit 17).
**Lesen:** Persönlicher Blogtext (≈ 160–220 Wörter) „Ein Tag, den ich nicht vergesse“: Reihenfolge der Ereignisse, Detailfragen, Haltung der Schreiberin erkennen.
**Hören:** Erzählung am Telefon/Voicemail und Gespräch unter Kollegen: Hauptaussage, Reihenfolge, Gefühl der Sprecherin.
**Sprechen:** Ein persönliches Erlebnis in 6–8 Redebeiträgen erzählen; auf Nachfragen reagieren (Warum? Und dann?).
**Schreiben:** E-Mail/Blogeintrag an eine Freundin über ein besonderes Erlebnis, ≥ 80 Wörter, mit mindestens zwei temporalen Konnektoren und Präteritum.
**Szenarien:** Kolleginnen am Montag vom Wochenende erzählen · der Gastfamilie von der Kindheit berichten · eine Panne auf der Reise schildern.
**Abschlusstest:** 15 Fragen; ↻ Perfekt (A2-11), `wenn`/`als` (A2-17); Lesen 5, Grammatik 7, Wortschatz 3.

### Unit 22 — Meinungen äußern und diskutieren

**Lernziele:** Ich kann meine Meinung begründen, zustimmen und widersprechen, Vor- und Nachteile nennen. Ich kann einem einfachen Gespräch über ein bekanntes Thema folgen und mich daran beteiligen.
**Wortschatz:** Meinung und Argument (der Vorteil/Nachteil, Ich bin der Meinung, dass …, Es kommt darauf an); Zusammenleben in Stadt und Land, Medien und Jugend, Haustiere, Mobilität (Themen mit zwei Seiten).
**Grammatik** — Neu: `obwohl`, `trotzdem`, `zwar … aber`, `einerseits … andererseits`; `je … desto`, `weder … noch`, `entweder … oder` (A2: nur rezeptiv), `sowohl … als auch`; Verben mit Präposition, Teil 1 (Akk/Dativ: sich ärgern über, abhängen von, teilnehmen an, sich einigen auf, diskutieren über) mit `da(r)-`/`wo(r)-` (*Worüber? Darüber*). Nicht in dieser Unit: Relativsätze, Passiv.
**Lesen:** Leserbriefe/Forumsbeiträge (zwei Positionen, ≈ 180–240 Wörter): Meinungen zuordnen, Argumente erkennen.
**Hören:** Radiodiskussion/WG-Gespräch zwischen zwei Personen: Positionen und Gründe erkennen.
**Sprechen:** Meinung zu einem Alltagsthema äußern, begründen, widersprechen (6–8 Redebeiträge).
**Schreiben:** Forumsbeitrag „Pro und Kontra“, ≥ 90 Wörter, mindestens zwei Konnektoren der Unit und eine Begründung.
**Szenarien:** Diskussion in der WG über Hausregeln · Meinung im Deutschkurs zu Social Media · Leserbrief.
**Abschlusstest:** ↻ `weil`/`dass` (A2-11), `deshalb` (A2-17); Konnektoren-Satzbau ist Schwerpunkt (Verbstellung Haupt-/Nebensatz).

### Unit 23 — Arbeit, Bewerbung und Karriere

**Lernziele:** Ich kann Stellenanzeigen verstehen, einen Lebenslauf und ein Bewerbungsschreiben verfassen und in einem Vorstellungsgespräch Fragen zu Erfahrungen und Zielen beantworten.
**Wortschatz:** Stellenanzeige, Lebenslauf, Bewerbung, Qualifikation, Probezeit, Arbeitsvertrag, Teilzeit/Vollzeit, Praktikum, Weiterbildung, Arbeitsklima, Kündigung (Abgrenzung zu A2-Unit 17 „Schule, Ausbildung und Beruf“: dort Berufe/Ausbildung allgemein, hier Bewerbung und Arbeitsalltag).
**Grammatik** — Neu: Relativsätze im Nominativ und Akkusativ (*der Kollege, der …; die Stelle, die ich …*); Infinitiv mit *zu*, `um … zu`, `damit` (Abgrenzung); Adjektivdeklination vollständig (Dativ, Plural, **ohne Artikel**: *langjährige Berufserfahrung*, *mit guten Deutschkenntnissen*). Nicht in dieser Unit: Relativsätze mit Präposition/Dativ (Unit 29), Passiv.
**Lesen:** Stellenanzeige + Bewerbungsschreiben (je ≈ 120–180 Wörter): Anforderungen, Aufgaben, Bedingungen zuordnen.
**Hören:** Vorstellungsgespräch und Telefonat mit der Personalabteilung: Fragen und Antworten, Termin und Unterlagen.
**Sprechen:** Vorstellungsgespräch (Erfahrungen, Stärken, Gründe für die Bewerbung).
**Schreiben:** Bewerbungsschreiben (formell) auf eine Anzeige, ≥ 100 Wörter, mit Anrede/Gruß, Relativsatz und `um … zu`.
**Szenarien:** Bewerbung per E-Mail · Vorstellungsgespräch · Telefonat mit der Personalabteilung · Arbeitsvertrag verstehen.
**Abschlusstest:** ↻ Adjektivendungen Nom/Akk (A2-13/15), `weil` (A2-11).

### Unit 24 — Wohnen, Umzug und Umwelt

**Lernziele:** Ich kann Abläufe und Regeln beschreiben, bei denen der Handelnde nicht wichtig ist (Wohnungssuche, Umzug, Mülltrennung), und Umweltprobleme einfach besprechen.
**Wortschatz:** Mietvertrag, Nebenkosten, Kaution, Hausordnung, Umzug, Renovierung; Umwelt (Mülltrennung, Energie sparen, Klimawandel, Verkehr, Recycling). Abgrenzung zu A2-Unit 13 (Wohnung beschreiben, Nachbarschaft): hier Verträge, Abläufe, Regeln.
**Grammatik** — Neu: Vorgangspassiv Präsens und Perfekt (*Die Wohnung wird renoviert. Der Vertrag ist unterschrieben worden.*); Passiv mit Modalverben (*Der Müll muss getrennt werden.*). Nicht in dieser Unit: Passiv Präteritum und Zustandspassiv (Unit 26), Passiv mit Agens-Varianten (*durch*, *von* nur bei *von*+Dativ als Chunk).
**Lesen:** Hausordnung und Informationsbroschüre „Müll richtig trennen“ (≈ 140–200 Wörter): Regeln und Pflichten.
**Hören:** Gespräch mit dem Vermieter/Hausmeister und Radiobeitrag zum Energiesparen.
**Sprechen:** Mit Vermieter/Nachbarn Probleme klären und einen Ablauf erklären (Umzug planen).
**Schreiben:** E-Mail an die Hausverwaltung (Mangel melden, Bitte um Reparatur), ≥ 80 Wörter, mit mindestens zwei Passivsätzen.
**Szenarien:** Wohnungsbesichtigung und Mietvertrag · Hausordnung erklären · Umzugsplanung · Umweltprojekt im Viertel.
**Abschlusstest:** ↻ Positionsverben (A2-13), `wenn` (A2-14). Passiv-Formen sind produktiv (Satzbau, Partizip II) — hohe Fehleranfälligkeit prüfen.

### Unit 25 — Gesundheit, Körper und Lebensstil

**Lernziele:** Ich kann Ratschläge geben und erfragen, über Beschwerden und Lebensgewohnheiten sprechen und Informationen zu Gesundheit und Versicherung verstehen.
**Wortschatz:** Krankenkasse, Überweisung, Rezept, Beschwerden und Behandlung, Ernährung, Stress, Schlaf, Sport, Sucht, Vorsorge (Abgrenzung zu A2-Unit 14: Arztbesuch/Körperteile/Imperativ; hier Lebensstil und System).
**Grammatik** — Neu: Konjunktiv II für Ratschläge (*Ich würde …; Du solltest …; An deiner Stelle würde ich …; Du könntest …; hätte/wäre*) — **Formen**, nicht nur Chunks; reflexive Verben mit Dativ (*Ich wasche mir die Hände. Ich tue mir weh.* — in A2 ausdrücklich ausgeschlossen); Verben mit Präposition, Teil 2 (*sich gewöhnen an, sich kümmern um, achten auf, leiden unter, sich vorbereiten auf*). Nicht in dieser Unit: irreale Bedingungssätze (Unit 27), Konjunktiv II der Vergangenheit (Unit 31).
**Lesen:** Zeitschriftenartikel „Wie viel Schlaf brauchen wir?“ (≈ 200–260 Wörter): Aussagen richtig/falsch, Ratschläge herausfiltern.
**Hören:** Beratungsgespräch beim Hausarzt und Podcast-Ausschnitt zu Stress.
**Sprechen:** Einem Freund Ratschläge geben; beim Arzt Beschwerden und Lebensweise schildern.
**Schreiben:** E-Mail an einen Freund mit Rat zu einem Gesundheitsproblem, ≥ 80 Wörter, mit mindestens drei Konjunktiv-II-Formen.
**Szenarien:** Arzttermin vereinbaren und beschreiben · Beratung in der Apotheke · Gespräch über Stress im Studium/Beruf.
**Abschlusstest:** ↻ Imperativ (A2-14), `sollen` (A2-14).

### Unit 26 — Medien, Technik und Internet

**Lernziele:** Ich kann Medien und Technik beschreiben und beurteilen, Nachrichten verstehen und Probleme mit Geräten schildern.
**Wortschatz:** Nachrichten, Zeitung, soziale Netzwerke, Datenschutz, Passwort, Update, App, Streaming, Werbung, Reparatur. Abgrenzung zu A2-Unit 16 (Freizeit, Medien, Kultur: Vorlieben): hier Beurteilung, Risiken, Technik.
**Grammatik** — Neu: Passiv Präteritum und Zustandspassiv (*Der Bericht wurde veröffentlicht. Der Laden ist geöffnet.*); Partizip I/II als Adjektiv (*die steigenden Preise, der gelöschte Beitrag*) — **begrenzt produktiv**, überwiegend rezeptiv; `lassen` (*Ich lasse mein Handy reparieren.*). Nicht in dieser Unit: erweiterte Partizipialattribute (B2).
**Lesen:** Kurznachricht/Zeitungsmeldung und Leserkommentar (≈ 160–240 Wörter): Kernaussage, Textsorte, Haltung.
**Hören:** Radionachrichten (kurz) und Gespräch im Handyshop.
**Sprechen:** Über Mediengewohnheiten sprechen, ein technisches Problem melden.
**Schreiben:** Kommentar zu einem Medienthema oder Beschwerde an den Support, ≥ 90 Wörter.
**Szenarien:** Handy reparieren lassen · Nachricht einordnen · Datenschutz erklären.
**Abschlusstest:** ↻ Passiv Präsens (Unit 24), Relativsatz (Unit 23).

### Unit 27 — Konsum, Reklamation und Dienstleistungen

**Lernziele:** Ich kann Wünsche und hypothetische Situationen ausdrücken, höflich bitten, eine Reklamation vorbringen und Gründe mit Genitiv-Präpositionen nennen.
**Wortschatz:** Reklamation, Garantie, Umtausch, Rückerstattung, Rechnung, Angebot, Vertrag kündigen, Online-Einkauf, Kundenservice; Wünsche und Träume (Abgrenzung zu A2-Unit 15: Einkaufen/Mengen; hier Beschwerden und Rechte).
**Grammatik** — Neu: Konjunktiv II für Wünsche und irreale Bedingungen der Gegenwart (*Wenn ich mehr Zeit hätte, würde ich …; Ich wäre gern …*); höfliche Bitten mit Konjunktiv II (*Könnten Sie …? Würden Sie bitte …?*) als produktive Formen (A2: nur Chunks); `wegen`, `trotz`, `während`, `statt` + Genitiv. Nicht in dieser Unit: Konjunktiv II der Vergangenheit.
**Lesen:** Kundenbewertung und Beschwerdebrief (≈ 150–220 Wörter).
**Hören:** Reklamation im Kundenservice; Telefonat mit dem Mobilfunkanbieter.
**Sprechen:** Reklamation vorbringen und eine Lösung aushandeln; Wünsche äußern.
**Schreiben:** Beschwerdebrief/Reklamation (formell), ≥ 100 Wörter, mit Konjunktiv II und mindestens einer Genitiv-Präposition.
**Szenarien:** Defektes Gerät umtauschen · Rechnung reklamieren · Vertrag kündigen.
**Abschlusstest:** ↻ Konjunktiv II Ratschläge (Unit 25), Passiv (Unit 24).

### Unit 28 — Bildung, Lernen und Zukunftspläne

**Lernziele:** Ich kann über Ausbildung, Studium und Lernstrategien sprechen, Vermutungen und Zukunftspläne äußern und Bedingungen/Zeitpunkte genauer angeben.
**Wortschatz:** Schulsystem in Deutschland, Studium, Prüfung (z. B. Sprachprüfung B1), Abschluss, Stipendium, Auslandsjahr, Lernstrategien, lebenslanges Lernen; Wortfamilien (Wortbildung -ung, -keit, -heit, -er/-erin).
**Grammatik** — Neu: Futur I für Prognosen und Vermutungen (*Das wird wohl …*); `falls`, `sobald`, `solange` (und `sodass` receptiv); Wortbildung: Nomen aus Verben/Adjektiven (-ung, -keit, -heit) als Lernstrategie. Nicht in dieser Unit: Futur II.
**Lesen:** Info-Text zum Bildungssystem / Erfahrungsbericht Auslandsjahr (≈ 200–260 Wörter).
**Hören:** Studienberatung; Interview mit einer Kursteilnehmerin.
**Sprechen:** Eigene Lern- und Zukunftspläne darstellen, Vermutungen äußern.
**Schreiben:** Motivationsschreiben/Mail an die Studienberatung, ≥ 100 Wörter.
**Szenarien:** Studienberatung · Sprachkurs anmelden · Prüfungstermin klären.
**Abschlusstest:** ↻ `wenn` (A2-14), Infinitiv mit *zu* (Unit 23).

### Unit 29 — Reisen, Kultur und Alltag im Vergleich

**Lernziele:** Ich kann Kulturunterschiede und Reiseerfahrungen beschreiben, Orte und Personen genauer charakterisieren und fremde Aussagen wiedergeben.
**Wortschatz:** Reisepanne, Beschwerde im Hotel, Tourismus, Feste und Bräuche, Pünktlichkeit/Höflichkeit, Heimat und Fremde, Redewendungen. Abgrenzung zu A2-Unit 18 (Reiseziele, Verkehr): hier Vergleich, Erfahrungen, Konflikte.
**Grammatik** — Neu: Relativsätze mit Dativ und Präposition (*die Stadt, in der …; die Leute, mit denen …*); Genitivattribute (*das Haus meiner Eltern, die Hauptstadt des Landes*); Wiedergeben fremder Aussagen mit `dass`/`ob` in Indikativ (*Er sagt, dass …; Sie fragte, ob …*) — kein Konjunktiv I. Nicht in dieser Unit: Konjunktiv I.
**Lesen:** Reisebericht/Interview „Mein erstes Jahr in Deutschland“ (≈ 220–260 Wörter).
**Hören:** Gespräch zwischen Reisenden, Hotelrezeption, Interview zum Kulturvergleich.
**Sprechen:** Kulturelle Unterschiede vergleichen; eine Panne schildern.
**Schreiben:** Reisebericht oder Bewertung eines Hotels, ≥ 100 Wörter, mit Relativsatz und Genitivattribut.
**Szenarien:** Zugausfall und Entschädigung · Hotelbeschwerde · Feier mit Gästen aus verschiedenen Ländern.
**Abschlusstest:** ↻ Relativsatz Nom/Akk (Unit 23), Präteritum (Unit 21).

### Unit 30 — Gesellschaft, Zusammenleben und Engagement

**Lernziele:** Ich kann über gesellschaftliche Themen (Ehrenamt, Integration, Generationen) sprechen, Texte gliedern und Ziele/Folgen ausdrücken.
**Wortschatz:** Ehrenamt, Verein, Gleichberechtigung, Integration, Generationen, Familienmodelle, Nachbarschaftshilfe, Spende, Gemeinschaft.
**Grammatik** — Neu: Nomen-Verb-Verbindungen (*eine Entscheidung treffen, in Anspruch nehmen, zur Verfügung stellen*); Folge und Ziel: `sodass`/`so … dass`, `damit` vs. `um … zu` (↻ Unit 23); Textgliederung (*erstens, außerdem, darüber hinaus, dennoch, daher, zum Beispiel*). Nicht in dieser Unit: Nominalstil.
**Lesen:** Zeitungsartikel/Reportage zu einem Ehrenamt (≈ 220–260 Wörter): Struktur, Meinung des Autors.
**Hören:** Interview mit einer Vereinsvorsitzenden; Diskussion zu Integration.
**Sprechen:** Kurzvortrag (≈ 1–2 Minuten) zu einem gesellschaftlichen Thema.
**Schreiben:** Zeitungs-Leserbrief oder Text zu einem Vereinsprojekt, ≥ 110 Wörter, strukturiert mit Gliederungswörtern.
**Szenarien:** Verein beitreten · Nachbarschaftshilfe organisieren · Veranstaltung vorstellen.
**Abschlusstest:** ↻ Konnektoren (Unit 22), Passiv (Unit 24/26).

### Unit 31 — Behörden, Verträge und Alltagsprobleme

**Lernziele:** Ich kann mich schriftlich und mündlich im formellen Register ausdrücken (Anträge, Anfragen, Widerspruch), Formulare und Bescheide grob verstehen und Fehler/Versäumnisse benennen.
**Wortschatz:** Antrag, Bescheid, Frist, Unterlagen, Aufenthaltstitel, Versicherung, Schadensmeldung, Widerspruch, Termin, Zuständigkeit. Abgrenzung zu A2-Unit 19 (Stadtleben, öffentliche Dienste): hier Verfahren und formelle Schriftlichkeit.
**Grammatik** — Neu: formelle Sprache (Anrede, Gruß, Konjunktiv-II-Höflichkeit in Briefen: *Ich wäre Ihnen dankbar, wenn …*); Konjunktiv II der Vergangenheit (*Ich hätte … sollen; Wenn ich das gewusst hätte, …*) — **borderline B1/B2, begrenzt produktiv (Entscheidung D-4)**; Umformung Aktiv ↔ Passiv. Nicht in dieser Unit: Nominalstil, Passiv Vergangenheit mit Modalverb.
**Lesen:** Behördenschreiben/Bescheid und Formular (≈ 150–220 Wörter).
**Hören:** Telefonat mit der Behörde/Versicherung; Beratungsgespräch.
**Sprechen:** Termin vereinbaren, Unklarheiten klären, Missverständnisse beheben.
**Schreiben:** Formelle Anfrage oder Widerspruch, ≥ 110 Wörter, korrekt formell.
**Szenarien:** Auskunft bei der Behörde · Schaden melden · Fristverlängerung beantragen.
**Abschlusstest:** ↻ Passiv (Unit 24), Konjunktiv II (Unit 25/27).

### Unit 32 — Rückblick, Bilanz und Prüfungsvorbereitung

**Lernziele:** Ich kann meinen Lernweg bewerten, mich auf die vier Prüfungsteile (Lesen, Hören, Schreiben, Sprechen) vorbereiten, einen kurzen Vortrag halten und Zukunftsentscheidungen begründen.
**Wortschatz:** Rückblick und Bilanz, Lernstrategien, Prüfungsvokabular (Aufgabe, Teil, Zeit, Lösung), Wünsche und Ziele; Redemittel für Präsentation und Diskussion.
**Grammatik** — **Keine neue Struktur.** `b1-nebensaetze-integration` (Übersicht und Satzbau aller Nebensatztypen: weil, dass, wenn, ob, obwohl, damit, nachdem, falls, Relativsatz, Infinitivsatz) und `b1-konjunktiv2-bilanz` (Wünsche/Ratschläge/Irrealis ↻) als **Wiederholungskonzepte** (Muster A2 `a2-satzverbindungen-integration`).
**Lesen:** Zwei Texte im Prüfungsformat (lang + kurz), Zuordnungs- und Richtig/Falsch-Aufgaben.
**Hören:** Prüfungsähnliche Hörtexte (Durchsage, Gespräch, Vortrag).
**Sprechen:** Kurzvortrag (2–3 Minuten) + Diskussion + gemeinsame Planung (Format wie Goethe-Zertifikat B1, **nur als Übung**).
**Schreiben:** Zwei Texte: informell (Mail) und formell (Brief/Beschwerde), ≥ 100 Wörter je Text.
**Szenarien:** Probeprüfung in vier Teilen; Lerntagebuch/Selbsteinschätzung.
**Abschlusstest:** Unit-Test (15 Fragen) **plus** `level-b1` (Level Test, siehe §5.2) — der Level Test wird erst im Release-Gate verlangt (siehe Architektur §7).

## 5. Final assessment requirements

### 5.1 Unit final tests (Units 21–32)

* **Exactly one** `topic` test definition per unit (`kind: 'topic'`, `unit`, `size`), `size` = number of authored questions = **15** (validator minimum; `finalTestOfUnit` selector; the unit test is built from the authored questions in authored order since A2 Stage 9B).
* Question mix per unit (proposal): grammar 6–7, vocabulary 3, reading 5. **Listening items only after TTS device verification** (A2 Stage 9B §7 left this open; A2 finals contain 0 listening items).
* Both `promptRu` and `promptKy` plus `why` in both languages; no fallback (`strict`).
* Answer positions balanced (three options: ~5/5/5, never > 2 in a row; the validator reports distribution).
* ≥ 2 recycled items per unit (↻), a concept coverage table per unit (every concept ≥ 2 items), no overlap with the unit's 8 revision exercises or placement items.
* Pass = 70 % (`assessment` policy); a passed unit test completes `${unit}:test`.

### 5.2 Level Test (`level-b1`)

* Exactly one definition (`kind: 'level'`, `level: 'B1'`), blueprint-based composition sampling all 12 units (pattern of `docs/authoring/A2_ASSESSMENT_DESIGN.md`; A2's own Level Test is **not yet built**, so B1's cannot copy a working A2 implementation — see Architecture §8).
* Proposed pass: 70 % overall and ≥ 40 % in every part (the A2 decision, `A2_STAGE9B`), no XP, outcome stored with optional result fields (already supported by storage).
* Never claims a CEFR certificate; Speaking and Writing are not measured (message required in RU/KY).

## 6. Vocabulary, grammar and skills coverage targets

| Skill | Target per unit | Notes |
| --- | --- | --- |
| Vocabulary | 30–34 productive + receptive list | minimum 28 (validator); with article, plural, ru, ky, example + `exampleKy` |
| Grammar | 2–3 concepts (Unit 32: 2 revision concepts) | one ID per concept, permanent |
| Reading | 1–2 texts, 120–260 words | 3 comprehension questions per text, glosses ru+ky |
| Listening | 2 texts, 120–220 words | TTS-based; transcript with ru+ky |
| Speaking | 1 scripted scenario, 6–8 turns | keyword-hint analysis only |
| Writing | 1 task, 80–110 words minimum | `mustInclude` patterns, model answer, tips |
| Exercises | 8 handwritten revision items | ≥ 3 of them on the unit's productive grammar |
| Final test | 15 authored questions | §5.1 |

## 7. CEFR gaps and decisions needed from the owner/reviewer

| # | Item | Why it matters |
| --- | --- | --- |
| D-1 | Is the A2→B1 boundary as drawn in §3.1 correct (e.g. Plusquamperfekt/`nachdem`, Passiv, Konjunktiv II forms in B1)? | Curricula differ; the A2 plan took the same cautious stance and left several items "borderline" |
| D-2 | `obwohl`/`trotzdem` and Relativsatz are on every B1 scope — confirm productive from Units 22/23 | determines the heuristic profile |
| D-3 | Partizip I/II als Adjektiv (Unit 26) and `Futur I` (Unit 28) productive or receptive only? | proposed: limited/receptive |
| D-4 | Konjunktiv II der Vergangenheit (Unit 31): B1 or B2? | proposed: limited production, owner/reviewer to decide; fallback: receptive only |
| D-5 | Reflexive Dativ placement (Unit 25) and Verben+Präposition split (Units 22/25) | lexical load |
| D-6 | Is the 12-unit span right? A1/A2 = 10 units each; B1 is conventionally a larger level (the task fixes 21–32) | workload, reviewer capacity |
| D-7 | Unit 32 as consolidation/exam preparation with no new grammar | the validator requires 2–3 concepts per unit — revision concepts (as A2 Unit 20) satisfy it |
| D-8 | A1 `genitiv` scope and its legacy `level: 'A2'` tag | Genitiv is taught as new in Units 27/29 only after the A1 scope is verified |
| D-9 | Text-size limits per level (§2.7) | validator profile |
| D-10 | Prerequisite policy: may an A1 learner switch straight to B1? | there is no level prerequisite or gating in the app today (Architecture §5) |
