# B1 curriculum v2 — Units 21–32

**Status: CURRICULUM v2 — the owner APPROVED the educational product design on 2026-11-20 (Stage 2D). This is NOT an official CEFR approval: every ⚑ decision is still pending independent expert verification. Nothing is implemented: no B1 lesson, text or test exists; B1 remains `planned`, with no released locale, invisible to learners.** Identities and conventions: [`B1_ID_CONVENTIONS.md`](B1_ID_CONVENTIONS.md). The Stage 0 proposal is kept as an audit record in [`archive/B1_CURRICULUM_v1_STAGE0.md`](archive/B1_CURRICULUM_v1_STAGE0.md), as is the Stage 2A review ([`B1_CURRICULUM_REVIEW.md`](B1_CURRICULUM_REVIEW.md)).

**No official CEFR approval is claimed or implied.** Every statement about "B1 suitability" is the author's (Claude Code's) judgement from common B1 curriculum practice. CEFR descriptors were paraphrased from memory and not checked against the official CEFR / Companion Volume text, the Goethe-Zertifikat B1 inventory or Profile deutsch, none of which is available in the repository; items marked ⚑ require a qualified German/CEFR reviewer. The repository has no authoritative CEFR word list, so no lexical-level claim is made.

Companion documents: [`B1_CURRICULUM_V2_APPROVAL.md`](B1_CURRICULUM_V2_APPROVAL.md) (the approval dossier: tables, decisions, blockers), [`B1_ARCHITECTURE.md`](B1_ARCHITECTURE.md), [`B1_IMPLEMENTATION_PLAN.md`](B1_IMPLEMENTATION_PLAN.md), [`B1_QA_CHECKLIST.md`](B1_QA_CHECKLIST.md).

## 1. What changed from v1 (summary)

| Area | v1 (Stage 0) | v2 (this document) |
| --- | --- | --- |
| Grammar concepts | 34 | **29** (no unit with two paradigm-heavy new systems) |
| Moved | — | Plusquamperfekt 21→29; Wiedergeben 29→26; Verben+Präposition 22/25→28; Adjektivdeklination split in 3 (22: Dativ/Genitiv, 24: ohne Artikel); Passiv-Modal 24→26; Zustandspassiv 26→31 |
| Receptive-only | Partizip I/II als Adjektiv, Konjunktiv II der Vergangenheit were concepts | **no longer concepts**: receptive notes only; Passiv Perfekt receptive |
| Added | — | Mittelfeld/Satzbau (Unit 32); communication-repair, reading/listening-strategy, Wortbildung and Meinung/Begründung **strands**; mediation micro-tasks; comparison language; relationships/feelings; money/banking; school/Kita communication; book/film discussion |
| Vocabulary | "≥ 28, target 30–34" | **38–42 new productive items per unit** + spaced revision (§4) |
| Text/task sizes | flat (reading 120–260, 6–8 turns, 80–110 words) | **progressive ramp calibrated to A2's real data** (§5) |
| Unit 32 | consolidation + 2 revision concepts | consolidation and exam preparation, **no new grammar system** (the Mittelfeld concept is a *revision/systematisation* of order rules already used from Unit 21 — see §3.32) |
| Assessment | scores described loosely | transparent checklists + self-assessment; **no automated speaking/writing score is a CEFR assessment** (§7) |

## 2. Evidence base

| Fact | Source |
| --- | --- |
| A1 = units 1–10 (released, 226 productive words, 20 concepts, unit-10 Genitiv is an *Überblick* that says speech uses *von + Dativ*); A2 = units 11–20 (Beta, 377 productive words, 27 concepts) | `src/data/course.ts`, `src/data/vocabulary.ts`, `src/data/a2/*`, `src/data/grammar.ts` |
| A2 measured: reading 50–92 words (avg 65), listening 82–125 (avg 104), 4-turn speaking scenarios, writing `minWords` 50–60, 36–40 words/unit, 8 exercises/unit, 15 final-test items/unit | measured in Stage 2A from the data modules |
| A2 exclusions (= B1 candidates): Passiv, Relativsatz, Konjunktiv II as taught form, Plusquamperfekt, `um … zu`, `obwohl`, `damit`, `nachdem`, Genitiv production, `trotzdem`, reflexive Dativ, Dativ/Genitiv adjective endings, adjectives without article, `da(r)-`/`wo(r)-`, verbs+Präposition beyond six Akk pairs | `docs/authoring/A2_STAGE7B_GRAMMAR_PROGRESSION.md` |
| A2 boundary is clean: no real B1 construction occurs in A2 texts | Stage 2A probe |
| Unit contract of a strict level: ≥ 28 vocabulary (v2 raises the *target*), 2–3 grammar concepts, ≥ 2 listening, 1–2 reading, 1 speaking, 1 writing, ≥ 8 exercises, 15 final-test items, ru **and** ky independent | `scripts/content-validate/rules/metadata.ts:11-22` |
| Unit sections: vocabulary, grammar, listening, reading, speaking, writing, review, test | `src/data/units.ts:16` |
| Speaking/writing feedback is rule-based with score floors, A1-era patterns, Russian-only strings | `src/services/analysis.ts`, `src/data/errorPatterns.ts` (Stage 2A §6.3) |

## 3. Design principles (v2)

1. One new idea per concept, taught when a task needs it; recycled (↻), never re-taught.
2. B1 starts where A2's exclusion list ends; each concept is new or a deliberate extension of an A2 chunk.
3. **Productive vs receptive is explicit** for every concept and construction (§6): **P** = required in tasks and tests; **P-lim** = productive on a closed list or pattern; **R** = receptive only, never required in production or in scored production items.
4. **No unit combines two paradigm-heavy systems.** Load key: H (paradigm-heavy), M, L.
5. B1 ceiling (⚑): no Futur II, Konjunktiv I, long Partizipialattribute, Nominalstil beyond fixed phrases, `es sei denn`, `ohne dass`/`statt dass`, productive Konjunktiv II der Vergangenheit, productive Passiv Perfekt.
6. Communicative first: 2–3 can-do goals per unit; every scenario contains at least one unexpected element (problem, refusal, changed fact).
7. **Honest assessment**: only what the platform can measure is claimed (§7).
8. Spiral: ≥ 2 ↻ items per unit test (one from A2 in Units 21–24); domains recur, but each B1 unit differs from its A2 counterpart in **register, task and text type** (personal/practical → evaluative/institutional).

## 4. Vocabulary policy (v2)

* **Target: 38–42 new productive items per unit** (A2 actual 36–40) with article/plural, ru, ky, example and `exampleKy`; 12 units ≈ **480**; cumulative productive ≈ 603 + 480 ≈ **1 080** — a **partial B1 lexical syllabus** (a conventional B1 inventory is of the order of 2 400 cumulative ⚑); disclosed (blocker B-10). Receptive glosses in readings/listenings are listed separately and counted for exposure, not for productive mastery.
* **No A1/A2 lemma is listed as new**; A1/A2 words appear as ↻ or glosses (needs a validator check: *lemma-repeats-earlier-level*, B-11).
* **Spaced revision (three layers):**
  1. *Leitner SRS* (existing, `services/srs.ts`): every B1 word enters the SRS; due words are practised in the unit's `review` section and the daily practice.
  2. *Authored expanding-interval recycling*: the review set of Unit N (≈ 12 items) contains ≥ 4 items from N−1, ≥ 2 from N−3 (from Unit 21 onward: A2 Units 20/18) and ≥ 2 from the unit before the last consolidation; Units 24, 28 and 32 contain a dedicated *Wiederholungsblock* (≈ 20 items from Units 21–23 / 25–27 / 29–31).
  3. *Test recycling*: ≥ 2 ↻ items in every unit test; `level-b1` samples every unit.
* **Limitation:** today the SRS and review are **level-scoped** (`dueWordIds(level)`), so A2 words are not revised automatically inside B1. Layer 2 therefore uses *authored* ↻ items; automatic cross-level spaced revision is a code decision (B-12), not assumed.
* Strand: **Wortbildung** (-ung, -keit, -heit, -er/-erin, un-, ver-) as a vocabulary strategy from Unit 25 (notes and exercises, no grammar concept).

## 5. Text, listening, speaking and writing targets (progressive)

| Units | Reading (words, per text; 2 texts/unit) | Listening (words; 2 texts/unit) | Sentence length p95 / max (words) | Speaking turns (1 scripted scenario) | Writing `minWords` (+ micro-task) |
| --- | --- | --- | --- | --- | --- |
| 21–22 | 100–150 | 110–140 | 16 / 22 | 5–6 | 70–80 |
| 23–26 | 120–180 | 120–160 | 18 / 24 | 6 | 70–80 |
| 27–29 | 130–210 | 130–180 | 20 / 25 | 6–7 | 80–85 |
| 30–31 | 150–220 | 140–190 | 20 / 26 | 7 | 70–90 |
| 32 | 200–250 (1 long) + 1 short | up to 220 | 22 / 28 | 8 | 70–90 × 2 texts |

Rationale: A2 averages 65 / 104 words and 4 turns; a single 2–4× jump would break the learner experience and the text-to-speech playback. Formal letters are held at 60–80 words because accuracy matters more than length. Per-level validator bounds follow this table (Architecture §9; not yet implemented — B-11). ⚑ Longer lengths of conventional B1 exams (often 150–300 words) are approached only in Units 30–32.

## 6. Strands present in every unit (new in v2)

| Strand | Content per unit | Notes |
| --- | --- | --- |
| **Gesprächsstrategien (communication repair)** | 3–4 chunks, e.g. *Entschuldigung, können Sie das bitte wiederholen? · Was bedeutet …? · Wie sagt man … auf Deutsch? · Ich meine … / Das heißt … · Moment, ich überlege kurz · Habe ich das richtig verstanden, dass …?* — one chunk set per unit, practised in the unit's scenario | listed as instructions/chunks, tested by `choose the appropriate repair` items (Unit 21+) |
| **Lese-/Hörstrategie** | one short strategy note (skimming, key words, listen for numbers/negation, predict from title, two-pass listening) | with a reading/listening exercise |
| **Wortbildung** | from Unit 25 | vocabulary strategy |
| **Meinung/Begründung** | one short opinion-with-reason micro-task from Unit 24 | prepares Unit 22/30 argumentation, recycled ↻ |
| **Mediation (relaying)** | micro-tasks in Units 26 (relay a news item), 28 (relay a school/course notice), 31 (relay the content of a Bescheid in 2–3 sentences) | **partial** coverage of CEFR mediation; no mediation competence is claimed |
| **Vergleichen** | comparison language (*im Vergleich zu, im Gegensatz zu, dagegen, während, genauso … wie, je … desto*) in Units 22 and 29 | recycled in 30 |

## 7. Assessment policy (summary; details in the approval dossier §6)

* **Unit test (15 authored items)**: grammar 6 (≥ 2 production items `fill`/`order`), vocabulary 3, reading 4, listening 2 *only after real-device TTS verification* (until then +2 grammar-in-context, replacing listening); ≥ 2 ↻; pass 70 % (existing policy); strict ru/ky.
* **Reading and listening** items use the native 3-option format, including *richtig / falsch / steht nicht im Text*.
* **Writing and speaking are never scored as CEFR performance.** The platform provides: (a) a *transparent learner checklist* (task achieved, required elements present, length reached, connectors/strategies used, register); (b) a **learner self-assessment** against a 4-criterion rubric (task achievement, coherence, vocabulary range, accuracy); (c) a model answer / model dialogue for comparison; (d) optional human feedback outside the app.
* **Existing automated feedback must not be presented as an assessment** (Stage 2A §6.3): speaking/writing analysers return numeric scores with high floors (e.g. grammar starts at 96 and is lowered only by 19 A1-era regex patterns; no B1 structure is detected), and their tips are Russian-only. For B1 the numeric scores must not be shown as results (code requirement B-9); a keyword-coverage figure may be shown only as "expected words used".
* **Final B1 assessment (`level-b1`, 40 scored items)** is an **indicative placement/progress instrument**, not a certification and not a prediction of any external exam; limited reliability (40 multiple-choice items) → bands, not exact scores; thresholds provisional until piloted. Writing/speaking companion tasks are unscored and self-assessed.

## 8. Units 21–32

Format: **Key · Titel · Load** · can-do **Lernziele** · **Wortschatz** · **Grammatik** (concepts with P / P-lim / R) · **Lesen · Hören · Sprechen · Schreiben** · **Szenarien** · **Strands** · **Abschlusstest**. All items are authored in German plus independent Russian and Kyrgyz (strict, no fallback). Concept ids are *proposed* and become permanent only on registration after approval. Differences from the A2 counterpart are stated where a domain recurs.

### Unit 21 — Erlebnisse und Erinnerungen erzählen
`b1-erlebnisse-erinnerungen` · Load H+M
**Lernziele:** Ich kann von vergangenen Erlebnissen zusammenhängend erzählen und die Reihenfolge klar machen; über Kindheit und frühere Gewohnheiten sprechen; Gefühle zu einem Erlebnis beschreiben; mich entschuldigen und den Grund nennen. *Bridge from A2:* wiederholt Perfekt, Nebensatz-Verbstellung, `als`/`wenn`, Adjektivendungen Nom/Akk (A2 ist noch in Beta, `wenn/als` war dort grenzwertig).
**Wortschatz (38–42):** Erinnerungen/Kindheit, Ereignisse (Unfall, Zufall, Panne, Überraschung), Gefühle (erleichtert, enttäuscht, begeistert, peinlich), Zeitadverbien (damals, plötzlich, inzwischen, schließlich, kurz darauf).
**Grammatik:** `b1-praeteritum-erzaehlen` (H; **P-lim**: closed list ≈ 35 regelmäßige/unregelmäßige Verben; **R** beyond the list; Perfekt bleibt Gesprächstempus ↻), `b1-temporale-konnektoren` (M; **P**: *bevor, während, seitdem/seit, bis, nachdem* + Perfekt). *Nicht:* Plusquamperfekt (→ 29), Passiv, Relativsatz.
**Lesen (100–130 Wörter):** Blog-/Tagebuchtext: Reihenfolge, wer/was/wann, Gefühle. **Hören (110–130):** Voicemail/Anekdote: Reihenfolge der Ereignisse. **Sprechen (5 Turns):** ein Erlebnis erzählen, auf Nachfragen reagieren. **Schreiben (minWords 70):** Mail/Blog über ein besonderes Erlebnis, ≥ 2 Konnektoren, Präteritum der Liste.
**Szenarien:** Kolleginnen am Montag vom Wochenende erzählen; der Gastfamilie von der Kindheit berichten; Verspätung erklären und sich entschuldigen (unerwartet: der Grund wird angezweifelt).
**Strands:** Gesprächsstrategie *um Wiederholung bitten*; Lesestrategie *Reihenfolge-Signale*.
**Abschlusstest:** Präteritum-Liste (Erkennen + Lückentext), Konnektor + Verbstellung, Ereignisse ordnen (Lesen), Reihenfolge im Dialog; ↻ Perfekt, `wenn/als` (A2-11/17).

### Unit 22 — Meinungen äußern und diskutieren
`b1-meinungen-diskussion` · Load M+M+L
**Lernziele:** Ich kann meine Meinung begründen, zustimmen und höflich widersprechen; Vor- und Nachteile nennen; zwei Dinge vergleichen; einer Diskussion über ein vertrautes Thema folgen und mich beteiligen. *Differenz zu A2:* A2 äußert Vorlieben/Vorschläge, B1 begründet und wägt ab.
**Wortschatz:** Meinung/Argument/Vorteil/Nachteil, Zusammenleben (Stadt/Land), Medien und Jugend, Mobilität; Vergleichssprache (*im Vergleich zu, im Gegensatz zu, dagegen*); Indefinites (*etwas Neues, nichts Besonderes, jemand, niemand*).
**Grammatik:** `b1-konzessive-saetze` (M; **P**: *obwohl, trotzdem, zwar … aber*), `b1-doppelkonnektoren` (M; **P**: *je … desto, weder … noch, entweder … oder, sowohl … als auch*; **R**: *einerseits … andererseits, nicht nur … sondern auch*), `b1-adjektive-dativ-genitiv` (L; **P**: Endungen nach Artikel im Dativ/Genitiv und Plural, alle -en).
**Lesen (120–150):** Forum/Leserbrief mit zwei Positionen. **Hören (120–140):** Gespräch zweier Personen: Position + Grund. **Sprechen (6):** Meinung nennen, begründen, widersprechen. **Schreiben (80):** Forumsbeitrag Pro/Kontra, ≥ 2 Konnektoren + 1 Begründung.
**Szenarien:** Hausregeln in der WG; Meinung im Deutschkurs zu Social Media; Leserbrief (unerwartet: Gesprächspartner nennt ein Gegenargument).
**Strands:** Gesprächsstrategie *nachfragen/umschreiben*; Redemittel für Zustimmung/Widerspruch/Meinung; Vergleichen.
**Abschlusstest:** `obwohl` vs `weil`, Verbstellung `trotzdem`, Doppelkonnektor ergänzen, Argumente zuordnen (Lesen); ↻ `weil/dass/deshalb` (A2-11/17), Komparativ (A2-13).

### Unit 23 — Arbeit, Bewerbung und Karriere
`b1-arbeit-bewerbung` · Load H+M
**Lernziele:** Ich kann Stellenanzeigen verstehen, Lebenslauf und Bewerbungsschreiben verfassen, in einem Gespräch Erfahrungen und Ziele nennen und Personen/Dinge mit Relativsätzen genauer beschreiben. *Differenz zu A2-17:* dort Berufe/Ausbildung allgemein, hier Bewerbung und Arbeitsalltag.
**Wortschatz:** Stellenanzeige, Lebenslauf, Bewerbung, Qualifikation, Probezeit, Arbeitsvertrag, Teil-/Vollzeit, Praktikum, Weiterbildung, Arbeitsklima, Krankmeldung, Kündigung.
**Grammatik:** `b1-relativsaetze-nom-akk` (H; **P**), `b1-infinitiv-mit-zu` (M; **P**: *zu* + Infinitiv inkl. trennbare Verben, `um … zu`; **R**: *ohne … zu, statt … zu*). *Nicht:* Relativsätze mit Präposition (→ 29), damit (→ 30).
**Lesen (110–150):** Stellenanzeige + Bewerbung. **Hören (130–150):** Vorstellungsgespräch (zweimal hören). **Sprechen (6):** Gespräch zu Erfahrungen, Stärken, Gründen. **Schreiben (80):** Bewerbungsschreiben (formell) mit Anrede/Gruß, 1 Relativsatz, 1 `um … zu`.
**Szenarien:** Bewerbung per Mail; Vorstellungsgespräch; Anruf in der Personalabteilung; Krankmeldung und verpasste Frist (unerwartet: Termin wird verschoben).
**Strands:** Gesprächsstrategie *Zeit gewinnen*; Meinung/Begründung ab Unit 24.
**Abschlusstest:** Relativpronomen Nom/Akk, Verb am Ende, *zu* bei trennbaren Verben, `um … zu` vs Hauptsatz; ↻ Adjektivendungen Nom/Akk (A2-13/15), `weil`.

### Unit 24 — Wohnen, Umzug und Umwelt
`b1-wohnen-umwelt` · Load H+M
**Lernziele:** Ich kann Abläufe und Regeln beschreiben, bei denen der Handelnde nicht wichtig ist; Wohnungsanzeigen und Hausordnungen verstehen; ein Problem melden; Umweltthemen einfach besprechen. *Differenz zu A2-13:* dort Wohnung beschreiben, hier Verträge, Abläufe, Regeln.
**Wortschatz:** Mietvertrag, Nebenkosten, Kaution, Hausordnung, Umzug, Renovierung, Mülltrennung, Energie sparen, Klima, Verkehr; Wohnungsanzeige (ruhige Lage, helle Zimmer).
**Grammatik:** `b1-passiv-praesens` (H; **P**: Vorgangspassiv Präsens; **R**: Passiv Perfekt), `b1-adjektive-ohne-artikel` (M; **P**: Nom/Akk/Dat, Wohnungsanzeigen).
**Lesen (120–160):** Wohnungsanzeige + Hausordnung/Broschüre. **Hören (120–140):** Gespräch mit Vermieter/Hausmeister. **Sprechen (6):** Mangel melden, Reparatur vereinbaren. **Schreiben (70):** Mail an die Hausverwaltung, ≥ 2 Passivsätze.
**Szenarien:** Wohnungsbesichtigung und Mietvertrag; Hausordnung erklären; Umzug organisieren; Umweltaktion im Viertel (unerwartet: Nebenkostenabrechnung weicht ab).
**Strands:** Meinung/Begründung (erste Mini-Aufgabe); **Wiederholungsblock** Units 21–23.
**Abschlusstest:** Passiv bilden/erkennen (aktiv ↔ passiv Bedeutung), Endungen ohne Artikel; ↻ Positionsverben (A2-13), `wenn` (A2-14), Relativsatz (23).

### Unit 25 — Gesundheit, Beziehungen und Lebensstil
`b1-gesundheit-lebensstil` · Load H+M
**Lernziele:** Ich kann Ratschläge geben und erfragen, über Beschwerden, Gefühle und Beziehungen sprechen, Streit ansprechen und Informationen zu Gesundheit und Versicherung verstehen. *Differenz zu A2-14:* dort Arztbesuch/Körperteile/Imperativ, hier Lebensstil, System, Beziehungen.
**Wortschatz:** Krankenkasse, Überweisung, Rezept, Beschwerden/Behandlung, Ernährung, Stress, Schlaf, Sport, Vorsorge; **Beziehungen und Gefühle** (sich streiten/versöhnen, Rat geben, Vertrauen, Missverständnis, sich entschuldigen).
**Grammatik:** `b1-konjunktiv2-ratschlaege` (H; **P**: *würde + Infinitiv, sollte, könnte, hätte, wäre*, *An deiner Stelle würde ich …*; Kontrast A2 `sollen` vs B1 `sollte`), `b1-reflexive-dativ` (M; **P-lim**: ≈ 10 Verben, *mir die Hände waschen, mir wehtun, mir etwas merken*).
**Lesen (140–180):** Zeitschriftenartikel „Wie viel Schlaf brauchen wir?“. **Hören (130–160):** Beratungsgespräch beim Hausarzt + Podcast zu Stress. **Sprechen (6):** Ratschläge geben/erfragen. **Schreiben (75):** Mail an einen Freund mit Rat, ≥ 3 Konjunktiv-II-Formen.
**Szenarien:** Arzttermin; Apothekenberatung; Stress im Studium/Beruf besprechen; einen Streit mit einem Freund klären (unerwartet: der Freund weist den Rat zurück).
**Strands:** Wortbildung (Start); Gesprächsstrategie *Gefühle ausdrücken/nachfragen*.
**Abschlusstest:** *würde* vs *sollte/könnte*, *hätte/wäre* bilden, Reflexivpronomen im Dativ; ↻ Imperativ, `sollen` (A2-14), Passiv (24).

### Unit 26 — Medien, Technik und Nachrichten
`b1-medien-technik` · Load M+L+M
**Lernziele:** Ich kann Nachrichten und Medien beschreiben und beurteilen, wiedergeben, was jemand gesagt oder geschrieben hat, den Inhalt eines Films oder Buchs erzählen und empfehlen, Probleme mit Geräten schildern und Prozesse beschreiben. *Differenz zu A2-16:* dort Freizeit/Vorlieben, hier Beurteilung, Risiken, Berichten.
**Wortschatz:** Nachrichten, Zeitung, soziale Netzwerke, Datenschutz, Passwort, Update, Streaming, Werbung, Reparatur; **Buch/Film** (Handlung, Hauptfigur, Ende, Spannung, empfehlen, bewerten).
**Grammatik:** `b1-passiv-praeteritum-modal` (M; **P**: Passiv Präsens mit Modalverben *muss repariert werden*; **P-lim**: Passiv Präteritum *wurde veröffentlicht*), `b1-lassen` (L; **P-lim**: *etwas reparieren lassen*; **R**: *sich lassen*), `b1-wiedergeben-indikativ` (M; **P**: *Er sagt, dass …; Sie fragte, ob …; Es heißt, dass …; laut + Dativ*; Pronomen- und Zeitverschiebung nur im Indikativ). **R** (no concept): Partizip I/II als Adjektiv (*die steigenden Preise*).
**Lesen (140–180):** Nachricht + Leserkommentar. **Hören (120–150):** Radionachricht (kurz) + Handyshop. **Sprechen (6):** Inhalt eines Films erzählen, Eindruck nennen, Empfehlung. **Schreiben (80):** Kommentar zu einem Medienthema oder Support-Beschwerde.
**Szenarien:** Handy reparieren lassen; Datenschutz erklären; einen Film empfehlen; eine falsche Nachricht richtigstellen.
**Strands:** **Mediation:** eine Nachricht mit eigenen Worten wiedergeben; Hörstrategie *Zahlen/Namen*.
**Abschlusstest:** Passiv Präteritum/Modal, `lassen`, Wiedergeben (Satzbau, Pronomen); ↻ Passiv Präsens (24), Relativsatz (23).

### Unit 27 — Konsum, Geld und Reklamation
`b1-konsum-reklamation` · Load H+M
**Lernziele:** Ich kann Wünsche und hypothetische Situationen ausdrücken, höflich bitten, reklamieren und Lösungen aushandeln, einfache Bank- und Vertragsangelegenheiten klären und Gründe mit Genitiv-Präpositionen nennen. *Differenz zu A2-15:* dort Einkaufen/Mengen, hier Rechte, Geld, Beschwerden.
**Wortschatz:** Reklamation, Garantie, Umtausch, Rechnung, Angebot, Vertrag kündigen, Online-Einkauf; **Bank/Geld** (Konto, Überweisung, Gebühr, Dauerauftrag; Kredit receptive), Mobilfunkvertrag.
**Grammatik:** `b1-konjunktiv2-wuensche-irreal` (H; **P**: Wünsche, irreale Bedingung der Gegenwart, höfliche Bitten *Könnten Sie …? Würden Sie …?* — ersetzt den A2-Chunk *hätte gern*), `b1-genitiv-praepositionen` (M; **P-lim**: *wegen, trotz, während, statt* + Genitiv; Genitiv-Formen werden hier neu eingeführt, A1 bietet nur einen Überblick).
**Lesen (130–170):** Kundenbewertung + Beschwerdebrief. **Hören (130–160):** Kundenservice-Anruf. **Sprechen (6):** reklamieren und eine Lösung aushandeln. **Schreiben (80):** Reklamation (formell), Konjunktiv II + 1 Genitiv-Präposition.
**Szenarien:** defektes Gerät umtauschen; Rechnung reklamieren; Vertrag kündigen; Bankproblem klären (Gebühr; unerwartet: Gegenseite lehnt zunächst ab).
**Strands:** Gesprächsstrategie *höflich nachhaken*; Meinung/Begründung.
**Abschlusstest:** irreale Bedingung, Höflichkeitsregister, Genitivformen; ↻ Konjunktiv II Rat (25), Passiv (24/26).

### Unit 28 — Bildung, Lernen und Zukunftspläne
`b1-bildung-zukunft` · Load L+L+M
**Lernziele:** Ich kann über Ausbildung, Studium und Lernstrategien sprechen, Pläne, Vermutungen und Bedingungen ausdrücken, mit Kita/Schule kommunizieren und Informationen aus einem Schulbrief weitergeben.
**Wortschatz:** Schulsystem, Studium, Prüfung, Abschluss, Stipendium, Auslandsjahr, Lernstrategien; **Schule/Kita-Kommunikation** (Elternabend, Elterngespräch, Entschuldigung, Zeugnis, Betreuung, Ganztag); Wortbildung.
**Grammatik:** `b1-futur1-vermutungen` (L; **P-lim**: Prognose + Vermutung mit *wohl*), `b1-falls-sobald-solange` (L; **P**; *sodass* **R**), `b1-verben-praepositionen` (M; **P-lim**: ≈ 20 Verben insgesamt, Akk/Dativ gruppiert, + `da(r)-/wo(r)-` für diese Verben; A2-Sechserliste ↻).
**Lesen (150–190):** Infotext/Erfahrungsbericht Auslandsjahr + Schulbrief. **Hören (140–170):** Studienberatung / Gespräch mit Lehrkraft. **Sprechen (6–7):** Studien-/Berufsplan darstellen; Elterngespräch (Kind krank, Frage zum Unterricht). **Schreiben (80):** Motivations-/Anfragemail (halbformell) + Entschuldigung an die Schule (Micro-Task).
**Szenarien:** Studienberatung; Sprachkurs anmelden; Prüfungstermin klären; Elternabend/Kita-Gespräch (unerwartet: Betreuungsplatz nicht verfügbar).
**Strands:** **Mediation:** Schulbrief/Kursinfo in 2–3 Sätzen weitergeben; **Wiederholungsblock** Units 25–27; Wortbildung.
**Abschlusstest:** Futur I vs Präsens, `falls/sobald/wenn`, Verb + Präposition + `da(r)-/wo(r)-`; ↻ `wenn` (A2-14), Infinitiv mit *zu* (23).

### Unit 29 — Reisen, Kultur und Alltag im Vergleich
`b1-reisen-kultur` · Load M+M+M
**Lernziele:** Ich kann Reiseerfahrungen mit Hintergrundereignissen erzählen, Kulturunterschiede vergleichen, Orte und Personen genauer charakterisieren und Konflikte (Verspätung, Hotelproblem) sachlich klären. *Differenz zu A2-18:* dort Reiseziele/Verkehr, hier Vergleich, Erfahrung, Konflikt.
**Wortschatz:** Reisepanne, Entschädigung, Hotelbeschwerde, Tourismus, Feste/Bräuche, Pünktlichkeit/Höflichkeit, Heimat/Fremde, Redewendungen; Vergleichssprache ↻.
**Grammatik:** `b1-relativsaetze-dativ-praeposition` (M; **P**), `b1-genitivattribute` (M; **R**-first, **P-lim** closed set), `b1-plusquamperfekt-nachdem` (M; **P**: *hatte/war + Partizip II*, *Nachdem wir angekommen waren, …*).
**Lesen (170–210):** Reisebericht/Interview „Mein erstes Jahr in Deutschland“. **Hören (150–180):** Reisende, Hotelrezeption, Interview zum Kulturvergleich. **Sprechen (7):** Bräuche vergleichen, Panne schildern. **Schreiben (85):** Reisebericht oder Hotelbewertung, Relativsatz + Genitivattribut.
**Szenarien:** Zug fällt aus, Entschädigung; Hotelbeschwerde; Gästen einen Brauch erklären; Kulturschock-Gespräch.
**Strands:** Vergleichen; Gesprächsstrategie *Missverständnisse klären*.
**Abschlusstest:** Relativpronomen nach Präposition, Plusquamperfekt-Bildung und Reihenfolge, Genitivattribut erkennen; ↻ Präteritum (21), Relativsatz (23).

### Unit 30 — Gesellschaft, Zusammenleben und Engagement
`b1-gesellschaft-engagement` · Load M+M+L
**Lernziele:** Ich kann über Ehrenamt, Integration und Generationen sprechen, Personen beschreiben, Ziel und Folge ausdrücken und einen kurzen strukturierten Vortrag halten.
**Wortschatz:** Ehrenamt, Verein, Gleichberechtigung, Integration, Generationen, Familienmodelle, Nachbarschaftshilfe, Spende; Personenbeschreibung (Aussehen, Charakter).
**Grammatik:** `b1-nomen-verb-verbindungen` (M; **P-lim**: ≤ 20 ⚑), `b1-konsekutiv-final` (M; **P**: *sodass, so … dass, damit* vs *um … zu*), `b1-textkohaesion` (L; **P-lim**: *erstens, außerdem, darüber hinaus, dennoch, daher, zum Beispiel*).
**Lesen (180–220):** Reportage zum Ehrenamt. **Hören (160–190):** Interview mit Vereinsvorsitzender. **Sprechen (7):** 1-Minuten-Vortrag (Einleitung – 2 Punkte – Schluss). **Schreiben (90):** Leserbrief/Vereinstext mit ≥ 4 Gliederungswörtern.
**Szenarien:** Verein beitreten; Nachbarschaftshilfe organisieren; Veranstaltung vorstellen; Generationenthema diskutieren.
**Strands:** Vergleichen ↻; Meinung/Begründung.
**Abschlusstest:** `damit` vs `um … zu`, `sodass` vs `weil`, Gliederungswörter ordnen, Nomen-Verb-Paare; ↻ Konnektoren (22), Passiv.

### Unit 31 — Behörden, Verträge und Alltagsprobleme
`b1-behoerden-recht` · Load L+M
**Lernziele:** Ich kann mich formell schriftlich und mündlich ausdrücken, Formulare und Bescheide in den Grundzügen verstehen, Informationen aus einem Schreiben mit eigenen Worten weitergeben und ein Problem sachlich melden. *Differenz zu A2-19:* dort Stadtleben/Auskunft, hier Verfahren und formelle Schriftlichkeit.
**Wortschatz:** Antrag, Bescheid, Frist, Unterlagen, Aufenthaltstitel, Versicherung, Schadensmeldung, Widerspruch, Zuständigkeit; Polizei/Unfallmeldung.
**Grammatik:** `b1-formelle-sprache` (L; **P**: Anrede/Gruß, *Ich bitte um …*, Konjunktiv-II-Höflichkeit ↻), `b1-aktiv-passiv-zustandspassiv` (M; **P**: Aktiv↔Passiv; **P-lim**: Zustandspassiv *Das Formular ist ausgefüllt*). **R** (no concept): Konjunktiv II der Vergangenheit (*Ich hätte … sollen*) nur beim Lesen verstanden ⚑.
**Lesen (130–170):** Behördenschreiben + Formular. **Hören (140–170):** Telefonat mit Behörde/Versicherung. **Sprechen (7):** Verfahren klären, Missverständnis beheben. **Schreiben (70):** formelle Anfrage oder Widerspruch.
**Szenarien:** Auskunft bei der Behörde; Schaden melden; Fristverlängerung beantragen; Unfall/Polizei (unerwartet: ein Dokument fehlt).
**Strands:** **Mediation:** Inhalt eines Bescheids in 2–3 Sätzen weitergeben; Gesprächsstrategie *Verständnis absichern*.
**Abschlusstest:** Register wählen, Aktiv↔Passiv, Zustands- vs Vorgangspassiv, Frist/Unterlagen im Text finden; ↻ Passiv (24/26), Konjunktiv II (25/27).

### Unit 32 — Rückblick, Bilanz und Prüfungsvorbereitung
`b1-rueckblick-pruefung` · Load L (Wiederholung) — **kein neues Grammatiksystem**
**Lernziele:** Ich kann meinen Lernweg bewerten, mich auf Lesen, Hören, Schreiben und Sprechen vorbereiten, einen kurzen Vortrag halten und gemeinsam etwas planen.
**Wortschatz:** Bilanz, Lernstrategien, Aufgabenwortschatz (Aufgabe, Teil, Lösung), Wünsche und Ziele, Redemittel für Präsentation/Diskussion; **Wiederholungsblock** Units 29–31 + gemischte Liste.
**Grammatik (Systematisierung, nicht neu):** `b1-nebensaetze-integration` (Überblick Nebensatztypen: *weil, dass, wenn, ob, obwohl, damit, nachdem, falls*, Relativ-, Infinitivsatz), `b1-satzbau-mittelfeld` (Ordnungsregeln, die seit Unit 21 benutzt werden — Pronomen/Dativ-vor-Akkusativ, TeKaMoLo, Satzklammer — als System; **P** in `order`-Aufgaben; ⚑ teilweise neu für die Lernenden). Beide sind Wiederholungskonzepte nach dem Muster von `a2-satzverbindungen-integration`.
**Lesen (200–250 + kurz):** zwei Texte im Prüfungsformat. **Hören (bis 220):** Durchsage, Gespräch, kurzer Vortrag. **Sprechen (8):** 2–3-Minuten-Vortrag + gemeinsame Planung (nur Übung). **Schreiben (70–90 × 2):** informelle Mail + formeller Brief.
**Szenarien:** Probeprüfung in vier Teilen (als Übung, ohne Prüfungsanspruch); Lerntagebuch/Selbsteinschätzung; Abschiedsrede.
**Strands:** alle Strategien als Checkliste; Selbsteinschätzung mit Rubrik.
**Abschlusstest:** Unit-Test (15) + `level-b1` (indikativ, siehe Approval-Dossier §6).

## 9. Totals (v2)

12 units · **29** grammar concepts (A2: 27) · **38–42** productive words/unit (≈ 480; cumulative productive ≈ 1 080) · 24 reading texts, 24 listening texts (ramp §5) · 12 speaking scenarios (5→8 turns) · 12 writing tasks + 5–6 micro-tasks (notes, messages, mediation) · 96–120 exercises · 180 unit-test items · `level-b1` (40 scored items) with unscored self-assessed writing/speaking tasks · 6 cross-unit strands.

## 10. Open decisions
See [`B1_CURRICULUM_V2_APPROVAL.md`](B1_CURRICULUM_V2_APPROVAL.md) §8 (CEFR review decisions) and §9 (unresolved blockers). In short: owner approval of this document; CEFR-qualified reviewer's confirmation of the ⚑ placements (Passiv Perfekt R, Plusquamperfekt, Konjunktiv II Vergangenheit R, Genitivattribut, Nomen-Verb-Verbindungen, Zustandspassiv, Futur I, Mittelfeld); B-9 (feedback), B-10 (vocabulary disclosure), B-11 (validator profile/lemma check), B-12 (cross-level spaced revision), and the carried-over blockers B-1…B-8.
