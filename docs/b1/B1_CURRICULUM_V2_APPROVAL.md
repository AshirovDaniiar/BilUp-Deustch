# B1 Curriculum v2 — approval dossier

**Status (Stage 2D): Owner approval of the product design is recorded (2026-11-20, `scripts/content-validate/b1/approval.ts`). This is NOT an official CEFR approval: every decision marked ⚑ (D-1…D-15) stays pending independent expert verification, and no uncertain B1/B2 classification was upgraded.** This dossier consolidates the final proposed B1 curriculum (v2) produced after the Stage 2A review so that an owner and a qualified German/CEFR reviewer can approve, amend or reject it. It changes no code, creates no B1 lesson, leaves B1 `planned`/invisible, and registers no unit identity.

* Full unit detail: [`B1_CURRICULUM.md`](B1_CURRICULUM.md) (v2). Audit records, preserved unchanged: [`B1_CURRICULUM_REVIEW.md`](B1_CURRICULUM_REVIEW.md) (Stage 2A), [`archive/B1_CURRICULUM_v1_STAGE0.md`](archive/B1_CURRICULUM_v1_STAGE0.md) (Stage 0).
* Related: [`B1_ARCHITECTURE.md`](B1_ARCHITECTURE.md), [`B1_IMPLEMENTATION_PLAN.md`](B1_IMPLEMENTATION_PLAN.md), [`B1_QA_CHECKLIST.md`](B1_QA_CHECKLIST.md), `docs/implementation/B1_STAGE1_INFRASTRUCTURE.md`.
* **Limits of this document:** CEFR descriptors are paraphrased from memory and were **not** checked against the official CEFR / Companion Volume text, the Goethe-Zertifikat B1 inventory or Profile deutsch (not available in the repository). All "B1 suitability" statements are the author's (Claude Code's) judgement. ⚑ = needs a qualified human reviewer.

## 1. Design directions applied (as directed by the owner)

| # | Direction | Where applied |
| --- | --- | --- |
| 1 | 12 units (21–32) | §2 |
| 2 | domain sequence preserved (Erlebnisse → Meinungen → Arbeit → Wohnen → Gesundheit → Medien → Konsum → Bildung → Reisen → Gesellschaft → Behörden → Rückblick) | §2 |
| 3 | 29 grammar concepts | §3 (count verified: 2+3+2+2+2+3+2+3+3+3+2+2 = 29) |
| 4 | revised allocation | §3, change log in `B1_CURRICULUM.md` §1 |
| 5 | 38–42 productive words/unit with spaced revision | §5.1 |
| 6 | progressive reading/listening lengths | §5.2 |
| 7 | A2→B1 progression preserved | §3 (prerequisite column), `B1_CURRICULUM.md` §2 |
| 8 | Unit 32 = consolidation and exam preparation, no new grammar system | §2, §3 (both Unit 32 concepts are *systematisations* of structures used from Unit 21) |
| 9 | communication repair, mediation, comparison, relationships, money/banking, school/Kita, book/film | §4 (strands) and §2 (placement per unit) |
| 10 | productive vs receptive grammar distinguished | §3, §4 |

## 2. Final proposed Units 21–32

| Unit | Key (approved, permanent) | Titel (Deutsch, approved) | Core function | Domain overlap with A2 → difference | Concepts |
| --- | --- | --- | --- | --- | --- |
| 21 | `b1-erlebnisse-erinnerungen` | Erlebnisse und Erinnerungen erzählen | narrate the past coherently | A2-11 (Perfekt, Erfahrungen) → connected narration, Präteritum | 2 |
| 22 | `b1-meinungen-diskussion` | Meinungen äußern und diskutieren | argue, concede, compare | A2-20 (Vorschläge) → justify, weigh up | 3 |
| 23 | `b1-arbeit-bewerbung` | Arbeit, Bewerbung und Karriere | apply, interview, specify with relative clauses | A2-17 (Beruf) → application and workplace | 2 |
| 24 | `b1-wohnen-umwelt` | Wohnen, Umzug und Umwelt | describe processes/rules; housing ads | A2-13 (Wohnen) → contracts, rules, environment | 2 |
| 25 | `b1-gesundheit-lebensstil` | Gesundheit, Beziehungen und Lebensstil | advise, empathise, discuss lifestyle and relationships | A2-14 (Gesundheit) → lifestyle, system, relationships | 2 |
| 26 | `b1-medien-technik` | Medien, Technik und Nachrichten | report, relate a film/book, describe processes | A2-16 (Medien) → evaluate, report | 3 |
| 27 | `b1-konsum-reklamation` | Konsum, Geld und Reklamation | wish, hypothesise, complain politely; banking | A2-15 (Einkaufen) → rights, money, complaints | 2 |
| 28 | `b1-bildung-zukunft` | Bildung, Lernen und Zukunftspläne | plan, predict, state conditions; school/Kita contact | A2-17 (Schule) → education system, school communication | 3 |
| 29 | `b1-reisen-kultur` | Reisen, Kultur und Alltag im Vergleich | narrate with background, compare cultures | A2-18 (Reisen) → comparison, conflict | 3 |
| 30 | `b1-gesellschaft-engagement` | Gesellschaft, Zusammenleben und Engagement | structure a talk/text; purpose and consequence | new domain | 3 |
| 31 | `b1-behoerden-recht` | Behörden, Verträge und Alltagsprobleme | formal register; relay official information | A2-19 (öffentliche Dienste) → procedures, formal writing | 2 |
| 32 | `b1-rueckblick-pruefung` | Rückblick, Bilanz und Prüfungsvorbereitung | integrate, self-assess, prepare | A2-20 (Integration) pattern | 2 (revision) |

The unit ids, keys and German titles of this table are registered in `src/data/b1/registry.ts` (`B1_UNIT_PLAN`) and are permanent: an id or key is never reused or changed; a title changes only with a recorded curriculum change. The titles of Units 25, 26, 27 (added *Beziehungen*, *Nachrichten*, *Geld*) were approved together with this dossier (D-15). Registering the plan makes nothing visible: B1 stays `planned` with no released locale.

## 3. The 29 grammar concepts and their allocation

Key: **P** productive (required in tasks/tests) · **P-lim** productive on a closed list/pattern · **R** receptive only. Load: H paradigm-heavy · M medium · L light. "A1/A2 relation": *No* = not taught before; *Extends* = builds on a named A1/A2 item; *Recycles* = revision only. ⚑ = B1/B2 placement to be confirmed by a CEFR reviewer.

| # | Unit | Concept id (proposed) | German grammar topic | Proficiency | Prerequisites | A1/A2 relation | Load |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 21 | `b1-praeteritum-erzaehlen` | Präteritum regelmäßiger/unregelmäßiger Verben als Erzähltempus | P-lim (≈ 35-Verb-Liste); R beyond | A1 `perfekt`; A2 `a2-praeteritum-sein-haben-modal` | **Extends** (A2: sein/haben/Modal only) | H |
| 2 | 21 | `b1-temporale-konnektoren` | *bevor, während, seitdem/seit, bis, nachdem* (+ Perfekt) | P | A2 `a2-ereignisse-verbinden`, `a2-wenn-als` | No (`als/wenn` ↻) | M |
| 3 | 22 | `b1-konzessive-saetze` | *obwohl, trotzdem, zwar … aber* | P | A2 `weil`, `a2-deshalb-darum` | No (excluded in A2) | M |
| 4 | 22 | `b1-doppelkonnektoren` | *je … desto, weder … noch, entweder … oder, sowohl … als auch* (P); *einerseits … andererseits, nicht nur … sondern auch* (R) | P / R | A2 `a2-komparativ-superlativ`; A2-20 (*entweder … oder* R) | **Extends** | M |
| 5 | 22 | `b1-adjektive-dativ-genitiv` | Adjektivendungen nach Artikel im Dativ/Genitiv/Plural (-en) | P | A2 `a2-adjektivendungen-indefinit/-definit` | **Extends** (A2: Nom/Akk) | L |
| 6 | 23 | `b1-relativsaetze-nom-akk` | Relativsätze (Nominativ, Akkusativ) | P | A2 Nebensatz-Verbstellung | No | H |
| 7 | 23 | `b1-infinitiv-mit-zu` | Infinitiv mit *zu*, `um … zu` (P); *ohne … zu, statt … zu* (R) | P / R | A1 `separable`, `modal` | No | M |
| 8 | 24 | `b1-passiv-praesens` | Vorgangspassiv Präsens (Passiv Perfekt: R) | P / R ⚑ | A1/A2 Partizip II | No | H |
| 9 | 24 | `b1-adjektive-ohne-artikel` | Adjektivendungen ohne Artikel (Nom/Akk/Dat) | P | #5, A2 adjective concepts | **Extends** | M |
| 10 | 25 | `b1-konjunktiv2-ratschlaege` | Konjunktiv II: *würde/sollte/könnte/hätte/wäre* (Ratschläge) | P | A2 `a2-sollen-duerfen`, `a2-praeteritum-sein-haben-modal` | **Extends** *hätte gern* chunk | H |
| 11 | 25 | `b1-reflexive-dativ` | Reflexive Verben mit Dativ | P-lim (≈ 10 Verben) | A2 `a2-reflexive-verben` (Akk) | No (excluded in A2) | M |
| 12 | 26 | `b1-passiv-praeteritum-modal` | Passiv mit Modalverben (P); Passiv Präteritum (P-lim) | P / P-lim | #8, #1 | No | M |
| 13 | 26 | `b1-lassen` | *lassen* (veranlassen/erlauben); *sich lassen* (R) | P-lim / R ⚑ | A1 `modal` | No | L |
| 14 | 26 | `b1-wiedergeben-indikativ` | Wiedergeben mit *dass/ob* im Indikativ, *laut*, *Es heißt, dass …* | P | A2 `a2-ereignisse-verbinden`, `a2-indirekte-fragen` | **Extends** | M |
| 15 | 27 | `b1-konjunktiv2-wuensche-irreal` | Konjunktiv II: Wünsche, irreale Bedingung (Gegenwart), höfliche Bitten | P | #10; A2 `a2-hoefliche-bitten`, `a2-wenn-saetze` | **Extends** *hätte gern*/*Wie wäre es* | H |
| 16 | 27 | `b1-genitiv-praepositionen` | *wegen, trotz, während, statt* + Genitiv | P-lim | A1 `genitiv` (Überblick only) | **Partial** (A1: recognition) ⚑ | M |
| 17 | 28 | `b1-futur1-vermutungen` | Futur I (Prognose, Vermutung mit *wohl*) | P-lim ⚑ | A2 `a2-zukunft-praesens-werden` | **Extends** | L |
| 18 | 28 | `b1-falls-sobald-solange` | *falls, sobald, solange* (*sodass* R here) | P | A2 `a2-wenn-saetze`, #2 | No | L |
| 19 | 28 | `b1-verben-praepositionen` | Verben mit Präposition (≈ 20, Akk/Dativ) + `da(r)-/wo(r)-` | P-lim | A2 `a2-verben-mit-praepositionen` (6 Akk pairs) | **Extends** | M |
| 20 | 29 | `b1-relativsaetze-dativ-praeposition` | Relativsätze mit Dativ/Präposition | P | #6; A1 `dativ-prep` | No | M |
| 21 | 29 | `b1-genitivattribute` | Genitivattribute (*das Haus meiner Eltern*) | R-first; P-lim ⚑ | #16 | No | M |
| 22 | 29 | `b1-plusquamperfekt-nachdem` | Plusquamperfekt; *nachdem* + Plusquamperfekt | P ⚑ | #1, #2 | No | M |
| 23 | 30 | `b1-nomen-verb-verbindungen` | Nomen-Verb-Verbindungen (≤ 20) | P-lim ⚑ | – | No | M |
| 24 | 30 | `b1-konsekutiv-final` | *sodass, so … dass, damit* vs `um … zu` | P | #7, #3 | No | M |
| 25 | 30 | `b1-textkohaesion` | Textgliederung/Satzadverbien (*erstens, außerdem, darüber hinaus, dennoch, daher, zum Beispiel*) | P-lim | #3, #24 | `deshalb` ↻ | L |
| 26 | 31 | `b1-formelle-sprache` | formelles Register, Anrede/Gruß, Nominalphrasen (*Ich bitte um …*) | P | #15 | No | L |
| 27 | 31 | `b1-aktiv-passiv-zustandspassiv` | Aktiv ↔ Passiv; Zustandspassiv | P / P-lim ⚑ | #8, #12 | No | M |
| 28 | 32 | `b1-nebensaetze-integration` | Überblick Nebensatztypen | P (revision) | #2–4, 6, 7, 18, 20, 24 | Recycles (pattern `a2-satzverbindungen-integration`) | L |
| 29 | 32 | `b1-satzbau-mittelfeld` | Mittelfeld: Pronomen, Dativ vor Akkusativ, TeKaMoLo, Satzklammer — **systematisation of order rules used since Unit 21** | P (`order` items) ⚑ | A2 pronoun concepts | **Partly new** to the learner (flagged) | M |

**Allocation check:** no unit contains two H concepts; Units 21, 23, 24, 25, 27 contain one H each; Units 22, 28, 30, 32 contain none. Unit 32 contains **no new grammar system**: concept 28 recycles, concept 29 systematises (the only learner-new element is the explicit rule table; ⚑ reviewer may demote it to a pure revision list).

## 4. Productive vs receptive, and strands

**Receptive only (no concept, never required in production or scored production items):** Passiv Perfekt (24), Partizip I/II als Adjektiv (26), *sich lassen* (26), Konjunktiv II der Vergangenheit (31), *einerseits … andererseits* and *nicht nur … sondern auch* (22), *ohne … zu / statt … zu* (23), *sodass* (28 → P in 30), Modalverben im Perfekt / Ersatzinfinitiv (21/29, texts only), Genitivattribute (29, R-first).
**Productive on a closed list:** Präteritum (≈ 35 verbs), reflexive Dativ verbs (≈ 10), verbs with preposition (≈ 20), Nomen-Verb-Verbindungen (≤ 20), Genitiv-Präpositionen, Futur I, Zustandspassiv, Textkohäsion.
**Strands (every unit):** Gesprächsstrategien / **communication repair** (3–4 chunks per unit), Lese-/Hörstrategie, Wortbildung (from 25), Meinung/Begründung (from 24), **mediation** micro-tasks (26, 28, 31; *partial* coverage, no competence claim), **comparison** (22, 29, 30), plus the required topics: relationships/feelings (21, 25), **money/banking** (27), **school/Kita communication** (28), **book/film discussion** (26).

## 5. Targets

### 5.1 Vocabulary
* **38–42 new productive items per unit** (A2 actual 36–40, measured), ≈ 480 for B1; cumulative productive ≈ 603 (A1 226 + A2 377) + 480 ≈ **1 080**: a **partial B1 lexical syllabus** (⚑ conventional B1 inventories are of the order of 2 400 cumulative); to be disclosed (B-10); receptive glosses reported separately.
* Lemmas may be reused across Units and CEFR levels; only duplicate lemmas within one Unit are rejected by the validator.
* **Spaced revision:** (1) existing Leitner SRS for all B1 words; (2) authored expanding-interval recycling in each unit's review set (≥ 4 items from N−1, ≥ 2 from N−3, ≥ 2 from A2 in Units 21–24) and *Wiederholungsblöcke* in Units 24, 28, 32; (3) ≥ 2 ↻ items per unit test and a full sample in `level-b1`. **Limitation:** SRS/review are level-scoped (`dueWordIds(level)`), so A2 words are *not* revised automatically in B1 — layer 2 is authored; automatic cross-level revision needs a code decision (B-12).

### 5.2 Text, speaking and writing lengths (progressive)
| Units | Reading (words/text) | Listening (words) | Sentence p95 / max | Speaking turns | Writing `minWords` |
| --- | --- | --- | --- | --- | --- |
| 21–22 | 100–150 | 110–140 | 16 / 22 | 5–6 | 70–80 |
| 23–26 | 120–180 | 120–160 | 18 / 24 | 6 | 70–80 |
| 27–29 | 130–210 | 130–180 | 20 / 25 | 6–7 | 80–85 |
| 30–31 | 150–220 | 140–190 | 20 / 26 | 7 | 70–90 |
| 32 | 200–250 + short | up to 220 | 22 / 28 | 8 | 70–90 × 2 |
Baseline (A2, measured): reading 50–92 (avg 65), listening 82–125 (avg 104), 4 turns, minWords 50–60. 2 readings and 2 listenings per unit; formal letters stay at 60–80 words.

## 6. Learning objectives for the four skills

Each cell is an "Ich kann …" objective to be authored and tested; wording is a proposal. Speaking and writing objectives are *practised*, and *self-assessed* by checklist (§7) — **never scored as CEFR performance**.

| Unit | Lesen | Hören | Sprechen | Schreiben |
| --- | --- | --- | --- | --- |
| 21 | Reihenfolge und Gefühle in einem persönlichen Text erkennen | die Abfolge von Ereignissen in einer Erzählung verstehen | ein Erlebnis erzählen, Nachfragen beantworten | Mail/Blog über ein Erlebnis (Präteritum, Konnektoren) |
| 22 | zwei Positionen und ihre Gründe in einem Forumstext zuordnen | Position und Begründung in einem Gespräch erkennen | Meinung begründen, widersprechen, vergleichen | Pro/Kontra-Forumsbeitrag |
| 23 | Anforderungen einer Stellenanzeige und Aufgaben verstehen | Fragen und Antworten in einem Vorstellungsgespräch verstehen | über Erfahrungen und Ziele sprechen | Bewerbungsschreiben (formell) |
| 24 | Wohnungsanzeige und Hausordnung verstehen | Auskunft von Vermieter/Hausmeister verstehen | Mangel melden, Reparatur vereinbaren | Mail an die Hausverwaltung |
| 25 | Ratschläge in einem Artikel finden | Beratungsgespräch beim Arzt verstehen | Ratschläge geben, Gefühle benennen | Rat-Mail an einen Freund |
| 26 | Haltung/Kernaussage einer Nachricht erkennen | Radionachricht und Servicegespräch verstehen | Inhalt eines Films/Buchs erzählen, Nachricht wiedergeben (Mediation) | Kommentar zu einem Medienthema |
| 27 | Bewertung und Beschwerde unterscheiden | Reklamation im Kundenservice verstehen | reklamieren, Lösung aushandeln, Bankanliegen klären | Reklamation (formell) |
| 28 | Infotext und Schulbrief verstehen | Studien-/Lehrergespräch verstehen | Pläne darstellen, Elterngespräch führen, Schulinfo weitergeben (Mediation) | Anfrage-Mail + Entschuldigung an die Schule |
| 29 | Reisebericht und Vergleich verstehen | Reisende/Hotelgespräch/Interview verstehen | Bräuche vergleichen, Panne schildern | Reisebericht/Hotelbewertung |
| 30 | Struktur und Autorenmeinung eines Artikels erkennen | Interview zu gesellschaftlichen Themen verstehen | 1-Minuten-Vortrag halten | Leserbrief mit Gliederung |
| 31 | Behördenschreiben und Formular in den Grundzügen verstehen | Behörden-/Versicherungstelefonat verstehen | Verfahren klären, Missverständnisse beheben | formelle Anfrage/Widerspruch; Bescheid in 2–3 Sätzen wiedergeben (Mediation) |
| 32 | Prüfungstexte (lang/kurz) bearbeiten | Durchsage, Gespräch, Vortrag verstehen | 2–3-Minuten-Vortrag, gemeinsame Planung | zwei Texte (informell + formell) |

## 7. Assessment approach

### 7.1 Principles
1. **Automated speaking/writing scores are not CEFR assessments and are never presented as such.** No CEFR level, grade or "B1 achieved" label is attached to any speaking, writing or automated output.
2. **Transparent learner checklists** replace opaque numbers: each task lists its observable criteria (below); the app can verify only length and presence of required expected words/patterns; everything else is learner-checked.
3. **Self-assessment** is part of every writing/speaking task and of Unit 32.
4. **The existing automated feedback is limited and must be disclosed** (§7.5).
5. The 40-item final assessment is an **indicative placement/progress instrument**, not a certification, not a prediction of any external exam.

### 7.2 Unit knowledge checks (existing `unit-N` topic test)
15 authored questions, 70 % pass (existing policy), option order shuffled per attempt, ru/ky strict: grammar 6 (≥ 2 `fill`/`order` production items; ≥ 2 items per concept), vocabulary 3, reading 4, listening 2 (**only after real-device TTS verification**; until then +2 grammar-in-context), ≥ 2 ↻ items, strand items from Unit 21 (repair-chunk choice). Reading/listening use the 3-option format incl. *richtig / falsch / steht nicht im Text*.

### 7.3 Per-skill assessment
| Skill | Instrument | Measures | Does **not** claim |
| --- | --- | --- | --- |
| Grammar | unit-test items, concept checks, weak-concept recommendation | accuracy on controlled items | command of free production |
| Vocabulary | unit-test items, SRS | recognition/recall of taught items | lexical range / B1 word-list coverage |
| Reading | authored texts, 3-option items | comprehension of those texts | general reading ability |
| Listening | same, via browser text-to-speech | comprehension of synthetic speech | comprehension of natural speech/accents |
| Writing | task + **checklist** + model answer + **self-assessment rubric**; optional teacher feedback outside the app | task elements, length, learner's own judgement | quality, accuracy or CEFR level |
| Speaking | scripted scenario + **checklist** + model dialogue + self-assessment | participation in a scripted exchange | pronunciation, fluency, interaction quality, CEFR level |

### 7.4 Learner checklist and self-assessment (templates)
* **Writing checklist (per task, shown after writing):** ☐ minimum length reached (*checked by the app*) · ☐ required elements present, e.g. Anrede/Gruß, requested content, ≥ N connectors (*the app checks expected words/patterns; learner confirms meaning*) · ☐ correct register (du/Sie) · ☐ every sentence has the verb in the right position (*learner*) · ☐ I reread for endings/articles (*learner*).
* **Speaking checklist (per scenario):** ☐ I answered every turn · ☐ I used at least one communication-repair chunk · ☐ I used the unit's connector/structure · ☐ I could continue after an unexpected question · ☐ expected words used (*the app reports "expected words used", not a score*).
* **Self-assessment rubric (4 criteria × 3 learner-worded levels, no CEFR labels):** *Aufgabe erfüllt* (nicht / teilweise / vollständig) · *Zusammenhang* (einzelne Sätze / mit Konnektoren verbunden / klare Gliederung) · *Wortschatz* (oft gesucht / meist passend / abwechslungsreich) · *Genauigkeit* (viele Fehler / einige Fehler / wenige Fehler). Unit 32 adds a learning diary comparing the first and last task.
* All checklist/rubric texts authored in ru and ky independently.

### 7.5 Disclosure: limits of the existing automated feedback (evidence: `src/services/analysis.ts`, `src/data/errorPatterns.ts`)
* Speaking analysis returns five numeric scores with **high floors** (vocabulary 55 + keyword share, fluency 60 + length ratio, naturalness 50 + similarity to hint sentences, grammar 96 − 14 × matched patterns); unrelated text can still score highly.
* Grammar/word-order scores in writing come from **19 hand-written regex patterns**, A1-era; **no B1 structure is detected**, so a text with many B1 errors can show ≈ 96 for grammar.
* Corrections and tips are produced **in Russian** (Kyrgyz and German learners receive Russian text), contradicting the strict no-fallback rule for non-A1 levels. The same applies today to A2.
* **Requirement for B1 (code work, blocker B-9):** do not display these numeric scores as results; show the checklist and "expected words used"; localise every message in ru and ky; state in the Beta notice that feedback is automatic and limited. A2 Beta should carry the same disclosure (A2 is out of scope for this task).

### 7.6 Final B1 level assessment (`level-b1`) — indicative instrument
* 40 scored multiple-choice items: **A Wortschatz 6 · B Grammatik & Satzbau 14 (≥ 3 `order`) · C Lesen 10 · D Hören 6 (conditional on device verification; otherwise +3 to C and +3 to A) · E Praktische Sprachverwendung 4** (register, polite refusal, complaint, repair strategy). Reused unit-test items must be declared; part E is new.
* Unscored companion tasks: one writing task and one speaking task, self-assessed (§7.4).
* Result wording (proposal): *Ziel des B1-Kurses erreicht / fast erreicht / Wiederholung empfohlen* — **with the fixed statement:** "This is an indicative progress check of the BilUp Til B1 course content. It is not a certificate, does not predict any official exam result, and does not assess speaking or writing."
* Provisional rule (uncalibrated, from the A2 design): ≥ 70 % overall and ≥ 40 % in every part; **bands rather than exact scores** (limited reliability of 40 items); to be piloted with real learners before any use beyond Beta; no XP; stored with the existing optional result fields and protected retention.
* Optional 10-item **A2→B1 readiness check** before Unit 21 (no placement test exists); no outcome claim.



| # | Decision | Author's proposed default | Fallback if the reviewer disagrees |
| --- | --- | --- | --- |
| D-1 | Is the A2→B1 boundary correct (Plusquamperfekt, Passiv, Konjunktiv II forms, Relativsatz as B1)? | as in §3 | reopen the allocation if > 2 of the ⚑ items are rejected |
| D-2 | `obwohl`/`trotzdem`, Relativsatz productive from Units 22/23 | yes | move one unit later |
| D-3 | Partizip I/II als Adjektiv: receptive only; Futur I: P-lim | as stated | drop Futur I to R |
| D-4 | Konjunktiv II der Vergangenheit: receptive only (Unit 31) | R | remove from B1 entirely (B2) or promote to P-lim |
| D-5 | Passiv Perfekt: receptive only | R | P-lim in 26 |
| D-6 | Plusquamperfekt + *nachdem* in Unit 29, productive | P | R-first |
| D-7 | Genitivattribute R-first; Genitiv-Präpositionen P-lim (A1 only has an Überblick ⚑) | as stated | R only |
| D-8 | Nomen-Verb-Verbindungen cap ≤ 20; Zustandspassiv P-lim | as stated | R only (B2 boundary) |
| D-9 | Mittelfeld as a Unit-32 systematisation (not a new system) | keep | demote to a revision list, no concept |
| D-10 | 12-unit span; Unit 32 as consolidation | keep | — |
| D-11 | Text-length ramp (§5.2) and 38–42 words/unit | as stated | adjust per reviewer's exam-format knowledge |
| D-12 | Verb+Präposition list size (≈ 20) and the Präteritum verb list (≈ 35): the reviewer supplies the closed lists | proposed sizes | — |
| D-13 | Mediation coverage level (micro-tasks only) acceptable for Beta | yes, with disclosure | defer mediation |
| D-14 | Prerequisite policy (A1 learner may open B1; recommend after A2) | no gating; label "empfohlen nach A2" | gate by readiness check |
| D-15 | Final titles of Units 25–27 | §2 — **registered with the owner approval of this dossier**; reversible until Unit 25–27 are authored | keep Stage 0 titles |

Also required of the reviewer: verify the paraphrased CEFR descriptors in `B1_CURRICULUM_REVIEW.md` §2 against the official text, and check the proposed B1 items against the Goethe-Zertifikat B1 / Profile deutsch inventories. **No official CEFR approval exists or is claimed.**

## 9. Unresolved blockers

| # | Blocker | Blocks | Status |
| --- | --- | --- | --- |
| B-1 | Working tree not clean: 15 staged storage/app/test modifications that are not part of B1 (`git status`); Stage 1 changes are uncommitted too | a verifiable "Storage untouched" baseline; clean B1 branch | **open** (owner: commit or stash) |
| B-2 | Owner approval of curriculum v2 and of unit ids/keys/titles | registration, Unit 21 | **CLOSED (Stage 2D): product design approved by the owner; `B1_UNIT_PLAN` registered; NOT a CEFR approval** |
| B-3 | A1 `genitiv` scope | Units 27/29 | **evidence gathered:** A1 unit 10 is an *Überblick* (recognition; speech uses *von + Dativ*); B1 teaches Genitiv forms as new; owner/reviewer to confirm (D-7) |
| B-4 | Human reviewer capacity (A2 has 0/30 reviews; B1 adds 36) | release beyond Beta; quality | **open** |
| B-5 | Native Kyrgyz review of B1 grammar terminology (Passiv, Konjunktiv II, Relativsatz, Plusquamperfekt, Genitiv, Nomen-Verb-Verbindungen) and a B1 glossary | authoring Units 24/25 | **open** |
| B-6 | Level/placement test decision (A2's does not exist; B1 may ship without `level-b1` as A2 did) | `level-b1` | **open** |
| B-7 | Real-device German TTS verification (iOS Safari, Android Chrome) | listening items in tests; listening claims | **open** (since A2) |
| B-8 | Beta notice wording (level-aware, ru/ky/de) and its disclosures | B1 Beta | **open** (code: parametrise `betaNotice`) |
| B-9 | Misleading automated speaking/writing feedback (score floors, A1 patterns, Russian-only) | B1 Beta (and an A2 disclosure) | **open — requires a code decision** (hide scores; checklist; localise) |
| B-10 | Productive vocabulary ≈ 1 080 after B1: partial lexical coverage | exam-readiness wording | **open — disclosure + owner decision** |
| B-11 | Per-level validator profile (text ramp, B2+ patterns) and `lemma-repeats-earlier-level` check | authoring/validation of B1 content | **open** (code, before Unit 21) |
| B-12 | Cross-level spaced revision (A2 words in B1) not supported by level-scoped SRS/review | layer-2 revision beyond authored items | **open — code decision or accept authored recycling** |
| B-13 | CEFR reviewer decisions D-1…D-15 | final approval of the ⚑ items | **open** |

Stage 2D: B-2 is closed (owner approval of the product design; this is not a CEFR approval). B-1, B-4…B-13 remain as listed; B-13 (expert verification of the ⚑ decisions) is explicitly still open. B-5 (Kyrgyz terminology review) blocks authoring Units 24/25; B-1 (dirty working tree) is a process blocker, not a content blocker.

## 10. Approval record (to be completed by people)

| Role | Decision (APPROVE / APPROVE WITH CHANGES / REVISE) | Name | Date |
| --- | --- | --- | --- |
| Owner | APPROVE (educational product design: 12 units, 29 concepts, targets, classifications, objectives, Unit 32, ru/ky, no German B1, indicative final assessment) | owner (name not stored) | 2026-11-20 |
| CEFR-qualified German reviewer | | | |
| Native Russian reviewer (terminology) | | | |
| Native Kyrgyz reviewer (terminology) | | | |

Only the **owner** row is filled, and only for the product design (recorded from the owner's explicit instruction in the Stage 2D session; the owner's name is deliberately not stored in the repository). The three reviewer rows are blank because no independent review has happened: **no CEFR approval of any kind exists.**
