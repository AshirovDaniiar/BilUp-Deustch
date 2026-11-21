# B1 curriculum review (Stage 2A)

**Status: REVIEW OF A PROPOSAL. Documentation only.** Nothing in the repository was changed by this stage. This review is the author's (Claude Code's) assessment against common CEFR B1 practice; it is **not** a CEFR authority, **not** a human review, and approves nothing on anyone's behalf. CEFR descriptors are **paraphrased from memory of the CEFR (2001) / Companion Volume (2020) B1 scales and could not be checked against the official text in this session**; every point marked ⚑ must be verified by a qualified German/CEFR reviewer (also against the Goethe-Zertifikat B1 / Profile deutsch inventories, which are likewise not available in the repository).

**Reviewed:** `B1_CURRICULUM.md`, `B1_ARCHITECTURE.md`, `B1_IMPLEMENTATION_PLAN.md`, `B1_QA_CHECKLIST.md`.

## 1. Overall curriculum assessment

### 1.1 Verdict
**APPROVE WITH CHANGES** (full recommendation in §9). The proposal's skeleton — 12 units, topic domains, a grammar spine that starts exactly where A2's exclusion list ends, a consolidation unit, strict ru/ky — is sound. But checked against the **real A1/A2 content baseline** it has **four substantive defects** that must be corrected before unit identity is registered:

1. **Text-size and task-size targets were not calibrated to what A2 actually contains** (§1.2). The proposal jumps 2–4× in one step.
2. **Grammar load is unbalanced** (§5): Units 21, 23 and 25 each carry one "paradigm-heavy" concept plus two more; Unit 31 carries a likely-B2 item; Units 26 and 31 contain weakly motivated concepts.
3. **Speaking and writing assessment is not valid for B1 as the engine stands** — and, more seriously, the current feedback engine would show **misleadingly high numeric scores** for B1 output (§6.3). This is a blocker for any "speaking"/"writing" claim, not a polish item.
4. **Several B1 can-do areas are not covered at all** (§2.2, §4.3): communication/repair strategies, summarising/relating plot of a book or film, comparison language, the Mittelfeld word-order system, money/bank scenarios, personal-relationship/conflict scenarios.

### 1.2 Evidence: the actual content baseline (measured in this stage from the data modules)
| Measure | A1 (units 1–10) | A2 (units 11–20) | Stage-0 B1 proposal | Review |
| --- | --- | --- | --- | --- |
| Productive vocabulary per unit | 22–23 (226 total) | **36–40 (377 total)** | "≥ 28, target 30–34" | **below A2's real level** → set **38–42** |
| Reading text length (words) | not measured | **50–92, avg 65** (20 texts) | 120–260 | 2–4× jump → **ramp** (§3.5) |
| Listening text length (words) | not measured | **82–125, avg 104** (20 texts) | 120–220 | ramp |
| Sentence length in reading (words) | — | avg 6, p95 13, max 19 | "≤ 28" | ramp to p95 ≤ 20, max 25 |
| Speaking scenario length | — | **4 turns** (all 10) | "6–8 turns" | ramp 4→6, 8 only at Unit 32 |
| Writing `minWords` | — | **50–60** | "80–110" | **70–90**, formal ≈ 60–80 (§6.2) |
| Handwritten exercises / unit | — | 8 (80 total) | ≥ 8 | keep 8–10 |
| Final test per unit | — | 15 authored | 15 | keep 15 |
| Grammar concepts | 20 (one unit-10 Genitiv "Überblick" tagged A2) | **27** (units 12 and 17/18 have 2, not 3) | 34 | **29** (§5) |
| Real B1+ constructions inside A2 texts | — | none found: `um … zu` 0 real hits (1 regex hit is "um … Uhr"-type noise), `obwohl` 0, Passiv 0, Plusquamperfekt 0, Genitiv "des" 0; `hätte`/`würde` only as the *chunk* "Ich hätte gern …"; the 6 "Relativsatz" regex hits are false positives ("Ja, die Wohnung …", "Herr Brandt, der Vermieter") | — | confirms the A2/B1 boundary is clean: nothing on the B1 list is pre-taught |

Consequences: (a) the Stage-0 curriculum's "text sizes grow" principle is right but its numbers were taken from exam practice, not from the platform's own A2 level; (b) the productive-vocabulary target would have *shrunk* per unit relative to A2; (c) the cumulative productive vocabulary at the end of B1 would be ≈ 603 (A1+A2) + 12 × 40 ≈ **1 080 words**, plus receptive glosses. A B1 inventory is conventionally in the low thousands (⚑ the Goethe B1 word list is of the order of 2 400 entries cumulative; to be verified). The platform will therefore deliver a **partial B1 lexical syllabus** unless the receptive vocabulary (reading/listening glosses, word-formation) is explicitly counted and widened. This must be stated in the Beta disclosure and in the exam-readiness wording; it is the largest *structural* CEFR gap and it also exists, in proportion, at A1/A2.

### 1.3 Strengths to keep
* Clean A2→B1 boundary (table above); every B1 grammar topic is genuinely new or a deliberate extension of an A2 chunk.
* Domain-driven units with can-do goals and a consolidation/exam unit.
* Strict RU/KY and the unit contract (minimums, 15-item final test, concept coverage, spiral ↻) already enforced by the validator.
* Honest limits (no certification claim, receptive/productive marking).

## 2. CEFR B1 alignment

### 2.1 Descriptor-by-descriptor check (⚑ paraphrased descriptors)
| B1 area (paraphrase) | Where the proposal addresses it | Rating | Gap / correction |
| --- | --- | --- | --- |
| **Independent communication** — copes with most situations likely to arise (travel, services, work/school); can start, maintain and close a simple conversation; can ask for clarification | scenarios in every unit | **Partial** | No explicit **communication-strategy strand** (asking to repeat/explain, paraphrasing a missing word, checking understanding, gaining time, correcting oneself). Add *Gesprächsstrategien* as a cross-unit strand with 3–4 chunks per unit (§4.4). Scripted 4–8-turn scenarios cannot practise unpredictability (see §6.3) |
| **Understanding standard speech** — main points of clear standard speech on familiar matters; radio/TV items on topics of personal interest when delivery is slow and clear | listening 120–220 words/unit | **Partial** | Single browser-TTS voice, no speed/accent variety, no background noise, no authentic recordings (A2 Stage 9B: real-device verification still open). Add *Hörstrategien* (predict from title, listen for numbers/names/negation, two-pass listening); keep early lengths short; no audio-dependent claim until devices are verified |
| **Reading comprehension** — straightforward factual texts on familiar topics; understands descriptions of events, feelings and wishes in personal letters; scan/skim | Units 21–32 (Blog, Leserbrief, Anzeige, Bescheid, Artikel) | **Good** | Text-type spread is good; add *instructions/Gebrauchsanweisung*, *Fahrplan/Programm/Tabelle*, *SMS/Chat*; **ramp lengths** (§3.5) and add reading strategies (Skimming, Schlüsselwörter, unknown-word inference — supported by the existing gloss feature) |
| **Written communication** — simple connected text on familiar topics; personal letters about experiences and impressions; simple formal letters | informal mail/blog (21), forum (22), Bewerbung (23), mail to landlord (24), advice mail (25), comment/complaint (26), Reklamation (27), motivation letter (28), Reisebericht (29), Leserbrief (30), Anfrage/Widerspruch (31), two texts (32) | **Good** | Add short *notes/messages* (Notiz, Einladung, Absage, Entschuldigung) as 40–50-word micro-tasks; calibrate lengths (§6.2); formal register appears only in 23/27/31 → add one in 28 |
| **Expressing opinions and arguments** — briefly gives reasons and explanations for opinions, plans and actions; agrees/disagrees politely | Unit 22 (core), 30 (Textgliederung), 32 | **Partial** | One unit carries the whole function. Spread: a *Meinung + Begründung* micro-task in Units 24, 26, 28, 30 (topic-specific) and a *Pro/Kontra* writing task in 22 and 30. Redemittel list (Ich bin der Meinung/Ich sehe das anders/Das stimmt, aber …) must be an explicit instruction item, not only grammar |
| **Describing experiences and events** — narrates a story, relates the plot of a book or film, describes reactions, dreams, hopes, ambitions | Unit 21 (experiences), 29 (travel report), 28 (plans) | **Partial** | **Missing: "relate the plot of a book or film" and describe reactions** → add to Unit 26 (Medien: *Inhalt eines Films/Buchs/einer Serie wiedergeben + Empfehlung*). Missing: *dreams, hopes, ambitions* beyond Unit 27/28 → make explicit in Units 27 (Wünsche/Konjunktiv II) and 28 (Zukunftspläne/Futur I) |
| **Explaining reasons and consequences** — cause (weil/denn/da), consequence (deshalb/daher/sodass), purpose (um … zu/damit), concession | A2 `weil/deshalb`; B1 22 (obwohl), 23 (um … zu), 30 (sodass/damit) | **Partial** | Consequence/cause language is concentrated in the late Unit 30. Re-order: `um … zu` in 23 ✓; `damit`/`sodass` in 30 ✓ but add `da`, `daher`, `also`, `folglich`-level receptive items to Unit 22 vocabulary; test cause–effect items from Unit 22 on |
| **Participating in discussions / comparing** — joins a discussion on familiar topics; compares, contrasts | 22; 29 (Vergleich); 32 | **Partial** | **Comparison language is never scheduled** (*im Vergleich zu*, *im Gegensatz zu*, *während* adversative, *dagegen*, *genauso … wie*, *je … desto* ✓). Add to Unit 22 (je … desto, Doppelkonnektoren) and Unit 29 (cultural comparison). Turn-taking/interrupting/agreeing as Redemittel |
| **Mediation** (CV 2020: relaying information, taking notes, summarising) | not addressed | **Not covered** | Out of scope for Beta is acceptable; record it as a **known omission** and add one *relay a short text/announcement in own words* micro-task in Unit 31 (Behörden/Bescheid) and 26 (Nachrichten). Do not claim mediation competence |
| **Strategies / plurilingual competence** | not addressed | Not covered | The RU/KY contrastive notes (existing `mistakes` with `note`) are a natural vehicle; add contrastive notes for Passiv/Konjunktiv II/Relativsatz as part of each grammar concept (ky terminology risk, §7) |

### 2.2 Overall CEFR judgement
The **receptive** skills (reading, listening) and **written production** are plausibly B1-aligned once lengths and text types are corrected; **interaction and spoken production are aligned in intention but not in what the platform can practise or measure**. No part of the platform can *certify* B1; the proposal already says so, and §6 hardens that statement.

## 3. Detailed Unit 21–32 review

Legend: **Load** = grammar load (H = paradigm-heavy new system, M = medium, L = light). **Verdict:** ✅ keep · ✏️ change · ⚠️ restructure. ⚑ = reviewer must confirm. Corrections are applied in the final curriculum (§8); the "Recommended" lines summarise them.

### 3.0 Cross-unit corrections applied to every unit
* **Vocabulary:** 38–42 productive (A2 actual 36–40), plus receptive list; no lemma already taught productively in A1/A2 (add a validator warning *lemma-repeats-earlier-level*; the repo has no such check today).
* **Reading:** 2 texts/unit (A2 had 2), lengths ramped (§3.5); **Listening:** 2 texts/unit, ramped; **Speaking:** 1 scripted scenario, turns ramped 5→8; **Writing:** 1 task + 1 optional micro-task; **Exercises:** 8–10; **Final test:** 15 (§6.1).
* **Strands in every unit (cheap, high value):** *Gesprächsstrategien* (3–4 chunks), one *Lese- or Hörstrategie* note, one *Wortbildung* note (from Unit 25 on), one *Meinung/Begründung* mini-task from Unit 24.
* **Recycling (↻):** ≥ 2 final-test items from earlier units, always including one A2 item for Units 21–24 so the A2 backlog is not dropped.

### Unit 21 — Erlebnisse und Erinnerungen erzählen · Load H+M(+M) · ⚠️ restructure
* **Assessment of the proposal:** Opening unit carried Präteritum (H) + Plusquamperfekt/`nachdem` (M) + four connectors (M) — too much for the unit that must also bridge from A2. Plusquamperfekt before the learner has Präteritum fluency is premature. A2 evidence: Präteritum exists only for sein/haben/modals (`a2-praeteritum-sein-haben-modal`).
* **Recommended:** Concepts = `b1-praeteritum-erzaehlen` (closed list of ≈ 35 frequent regular/irregular verbs; Perfekt remains the spoken tense ↻) + `b1-temporale-konnektoren` (*bevor, während, seitdem, bis, nachdem* + Perfekt). **Plusquamperfekt moves to Unit 29** (narrative with background events). Add a **Brückenwiederholung** (↻ Perfekt, Nebensatz-Verbstellung, `als`/`wenn`, Adjektivendungen Nom/Akk) because A2 is still in Beta and `wenn`/`als` was flagged borderline in A2.
* **Vocabulary:** Erinnerungen/Kindheit, Ereignisse (Unfall, Zufall, Panne, Überraschung), Gefühle, Zeitadverbien (damals, plötzlich, inzwischen, schließlich, kurz darauf); 38–42.
* **Grammar scope:** as above; *Not*: Passiv, Relativ, Plusquamperfekt.
* **Reading:** blog/diary text 100–130 words: sequence, who/what/when, feelings. **Listening:** voicemail/anecdote 110–130 words: order of events. **Speaking:** tell a memory, 5 turns. **Writing:** mail/blog about a memorable event, minWords 70, ≥ 2 connectors, Präteritum.
* **Scenarios:** telling colleagues about the weekend; telling the host family about childhood; explaining what happened on the way (late/accident) to a teacher or employer (apology + reason).
* **Assessment objectives:** form Präteritum of the closed list (recognition + gap-fill), choose the correct connector with verb position, order events in a short text (reading), identify sequence in a dialogue; ↻ Perfekt, `wenn`/`als`.

### Unit 22 — Meinungen äußern und diskutieren · Load M+M+M · ✏️ change
* **Assessment:** Right unit, right place. Problems: `da(r)-/wo(r)-` and verb+preposition were folded into a third concept (hidden fourth topic); seven double connectors in one concept is too many; comparison language missing.
* **Recommended:** Concepts = `b1-konzessive-saetze` (*obwohl, trotzdem, zwar … aber*), `b1-doppelkonnektoren` (productive: *je … desto, weder … noch, entweder … oder, sowohl … als auch*; receptive: *einerseits … andererseits, nicht nur … sondern auch*), `b1-adjektive-dativ-genitiv` (all endings after article are -en: a light, high-yield step that long B1 texts need; *Light*). **Verb+preposition/`da(r)-` moves to Unit 28** (better motivation).
* **Vocabulary:** Meinung/Argument/Vor- und Nachteil, Zusammenleben (Stadt/Land), Medien und Jugend, Mobilität; comparison phrases (*im Vergleich zu, im Gegensatz zu, dagegen*).
* **Reading:** forum/Leserbrief with two positions 120–150 words. **Listening:** two-speaker discussion 120–140 words: who holds which position and why. **Speaking:** state, justify, disagree politely, 6 turns. **Writing:** Forum Pro/Kontra, minWords 80.
* **Scenarios:** house rules discussion in a shared flat; opinion in the language course on a social topic; reader's letter.
* **Assessment objectives:** concession vs cause (*obwohl* vs *weil*), verb-position drill (Nebensatz vs `trotzdem`), complete double connectors, argument matching (reading), ↻ `weil/dass/deshalb`.

### Unit 23 — Arbeit, Bewerbung und Karriere · Load H+M(+M) · ✏️ change
* **Assessment:** Overloaded (Relativsatz H, Infinitiv mit *zu* M, full adjective declension H). Adjective declension *without article* is naturally taught with Wohnungsanzeigen, not Stellenanzeigen (Dativ endings are trivial once -en is known).
* **Recommended:** Concepts = `b1-relativsaetze-nom-akk` (H), `b1-infinitiv-mit-zu` (*zu* placement incl. separable verbs, `um … zu`; *ohne … zu/statt … zu* receptive). *Adjective without article → Unit 24.*
* **Vocabulary:** Stellenanzeige, Lebenslauf, Bewerbung, Qualifikation, Probezeit, Vertrag, Teil-/Vollzeit, Praktikum, Weiterbildung, Arbeitsklima, Krankmeldung, Kündigung. Dedupe against A2 Unit 17 (*Beruf, Ausbildung*).
* **Reading:** Stellenanzeige + Bewerbung 110–150 words. **Listening:** Vorstellungsgespräch (two-pass) 130–150 words. **Speaking:** interview, 6 turns. **Writing:** Bewerbungsschreiben (formal), minWords 80, Anrede/Gruß, one Relativsatz and one `um … zu`.
* **Scenarios:** apply by mail; interview; phone the HR department; call in sick and announce a missed deadline.
* **Assessment objectives:** relative pronoun case (Nom/Akk) by function, verb final in the relative clause, *zu* before/within separable verbs, choose `um … zu` vs main clause with *damit* excluded; ↻ Adjektivendungen Nom/Akk, `weil`.

### Unit 24 — Wohnen, Umzug und Umwelt · Load H+M · ✏️ change
* **Assessment:** Passiv (H) is well placed here (processes, rules, notices) but **Passiv Perfekt is B1-upper/B2 ⚑** and Passiv mit Modalverben overloads the unit.
* **Recommended:** Concepts = `b1-passiv-praesens` (Vorgangspassiv Präsens; Passiv Perfekt receptive only), `b1-adjektive-ohne-artikel` (Wohnungsanzeigen: *helle Zimmer, ruhige Lage, möbliertes Zimmer*; Nom/Akk/Dat). **Passiv mit Modalverben moves to Unit 26** (with Präteritum).
* **Vocabulary:** Mietvertrag, Nebenkosten, Kaution, Hausordnung, Umzug, Renovierung, Müll trennen, Energie sparen, Klima, Verkehr. Dedupe against A2 Unit 13.
* **Reading:** Wohnungsanzeige + Hausordnung/Broschüre 120–160 words. **Listening:** conversation with Vermieter/Hausmeister 120–140 words. **Speaking:** report a defect and arrange repair, 6 turns. **Writing:** mail to the Hausverwaltung, minWords 70, ≥ 2 Passiv sentences.
* **Scenarios:** flat viewing and rental terms; clarify house rules; organise a move; join a neighbourhood environmental action.
* **Assessment objectives:** form Passiv Präsens (werden + Partizip II, position of agent omitted), recognise active vs passive meaning, adjective endings without article; ↻ Positionsverben, `wenn`.

### Unit 25 — Gesundheit, Körper und Lebensstil · Load H+M · ✏️ change
* **Assessment:** Konjunktiv II for advice is the right introduction (high frequency in B1 conversation). The Stage-0 third concept (Verben+Präposition Teil 2) overloaded the unit.
* **Recommended:** Concepts = `b1-konjunktiv2-ratschlaege` (*würde/sollte/könnte/hätte/wäre*, *An deiner Stelle würde ich …*: forms productive; irreal conditionals → 27), `b1-reflexive-dativ` (*Ich wasche mir die Hände; Ich tue mir weh; Ich merke mir …*, excluded in A2 on purpose). Verb+preposition moves out (Unit 28).
* **Vocabulary:** Krankenkasse, Überweisung, Rezept, Beschwerden/Behandlung, Ernährung, Stress, Schlaf, Sport, Vorsorge, Sucht; **plus personal relationships/feelings** (see §4.3 gap): sich streiten/versöhnen, Rat geben. Dedupe against A2 Unit 14.
* **Reading:** magazine article 140–180 words. **Listening:** doctor's advice + podcast excerpt 130–160 words. **Speaking:** give/ask for advice, 6 turns. **Writing:** advice mail to a friend, minWords 75, ≥ 3 Konjunktiv-II forms.
* **Scenarios:** doctor's appointment; pharmacy advice; discussing stress with a colleague; helping a friend after an argument.
* **Assessment objectives:** choose *würde + Infinitiv* vs *sollte/könnte*, form *hätte/wäre* correctly, Dativ-reflexive pronoun with body parts; ↻ Imperativ, `sollen` (A2 Unit 14) — **A2 `sollen` vs B1 `sollte`** is an explicit contrast item.

### Unit 26 — Medien, Technik und Internet · Load M+L+M · ✏️ change
* **Assessment:** Original concepts were weakly motivated (Partizip I/II als Adjektiv is B2-leaning when productive ⚑; `lassen` unconnected). *Reporting what media say* and *relating a film/book* were missing (§2.1).
* **Recommended:** Concepts = `b1-passiv-praeteritum-modal` (Passiv Präteritum, Passiv mit Modalverben: *wurde veröffentlicht, muss repariert werden*), `b1-lassen` (*etwas reparieren lassen, sich etwas schneiden lassen*; Light), `b1-wiedergeben-indikativ` (*Er sagt, dass …; Sie fragte, ob …; Es heißt, dass …; laut + Dativ* — **moved from Unit 29**; no Konjunktiv I). Partizip I/II as adjectives = **receptive only**, no concept (vocabulary/gloss notes).
* **Vocabulary:** Nachrichten, Zeitung, soziale Netzwerke, Datenschutz, Passwort, Update, Streaming, Werbung, Reparatur; film/book vocabulary (Handlung, Hauptfigur, Ende, empfehlen). Dedupe against A2 Unit 16.
* **Reading:** news item + reader comment 140–180 words. **Listening:** radio news (short) + shop dialogue 120–150 words. **Speaking:** report what you read/heard; **relate the plot of a film**, 6 turns. **Writing:** comment on a media topic or support complaint, minWords 80.
* **Scenarios:** phone repair; privacy settings; recommend a film; correct a false news claim.
* **Assessment objectives:** Passiv Präteritum/Modalverb forms, `lassen`, report a statement with `dass/ob` (verb position, pronoun shift), ↻ Passiv Präsens, Relativsatz.

### Unit 27 — Konsum, Reklamation und Dienstleistungen · Load H+M · ✏️ change
* **Assessment:** Stage 0 had **three** concepts of which two (*Wünsche/irreal* and *Höflichkeit*) are the same Konjunktiv-II system — merge. Money/bank/phone-contract scenarios (high-frequency in a B1 learner's life) were missing.
* **Recommended:** Concepts = `b1-konjunktiv2-wuensche-irreal` (wishes, hypothetical present, polite requests *Könnten Sie …? Würden Sie …?*; **productive polite register replaces A2's chunk *hätte gern***), `b1-genitiv-praepositionen` (*wegen, trotz, während, statt* + Genitiv; Genitiv forms taught here as new — **A1 `genitiv` is only an "Überblick" (unit 10) and says speech uses *von + Dativ***, so B1 builds on recognition only).
* **Vocabulary:** Reklamation, Garantie, Umtausch, Rechnung, Angebot, Vertrag kündigen, Online-Einkauf; **Bank/Geld** (Konto, Überweisung, Gebühr, Kredit receptive), Mobilfunkvertrag. Dedupe against A2 Unit 15.
* **Reading:** customer review + complaint 130–170 words. **Listening:** customer-service call 130–160 words. **Speaking:** make a complaint and negotiate a solution, 6 turns. **Writing:** Reklamation (formal), minWords 80, Konjunktiv II + one Genitiv-Präposition.
* **Scenarios:** return a defective item; dispute an invoice; cancel a contract; open/clarify a bank issue.
* **Assessment objectives:** irreal conditional *wenn … hätte/wäre, würde …*, polite-request register, Genitiv article forms (masc./neut. -s/-es), ↻ Konjunktiv II advice (25), Passiv (24).

### Unit 28 — Bildung, Lernen und Zukunftspläne · Load L+L+M · ✏️ change
* **Assessment:** Futur I and `falls/sobald/solange` are light; **verb+preposition with `da(r)-/wo(r)-` moves here** (*sich bewerben um, sich vorbereiten auf, teilnehmen an, warten auf, sich freuen auf* ↻, *hoffen auf, sich entscheiden für, abhängen von*), where *Worauf freust du dich? — Darauf …* is natural. Wortbildung becomes a strand, not a concept.
* **Recommended:** Concepts = `b1-futur1-vermutungen`, `b1-falls-sobald-solange`, `b1-verben-praepositionen` (closed list of ≈ 20 verbs for B1 overall, with `da(r)-/wo(r)-` for these only; A2's six pairs ↻; Akk and Dativ grouped).
* **Vocabulary:** Schulsystem, Studium, Prüfung, Abschluss, Stipendium, Auslandsjahr, Lernstrategien; Wortbildung (-ung/-keit/-heit/-er). Dedupe against A2 Unit 17 (*Schule*) and A1 Unit 6.
* **Reading:** info text/experience report 150–190 words. **Listening:** study-advice conversation 140–170 words. **Speaking:** present study/career plan and conditions, 6–7 turns. **Writing:** motivation mail (semi-formal), minWords 80.
* **Scenarios:** study advice; enrol in a course; clarify exam date and requirements; talk with a child's school (Elternabend/Kita) — a frequent migrant-life scenario missing in Stage 0.
* **Assessment objectives:** choose Futur I vs Präsens+Zeitwort (and *wohl*), `falls` vs `wenn` vs `sobald`, verb–preposition pairing and the matching `da(r)-/wo(r)-` form; ↻ `wenn` (A2), Infinitiv mit *zu*.

### Unit 29 — Reisen, Kultur und Alltag im Vergleich · Load M+M+M · ✅ keep with change
* **Assessment:** Good intercultural unit. It inherits **Plusquamperfekt/`nachdem`** (from 21) and loses *Wiedergeben* (→ 26).
* **Recommended:** Concepts = `b1-relativsaetze-dativ-praeposition` (*die Stadt, in der …; die Leute, mit denen …*), `b1-genitivattribute` (*das Haus meiner Eltern, die Hauptstadt des Landes*; **receptive-first**, productive in a closed set), `b1-plusquamperfekt-nachdem` (*hatte/war + Partizip II*, *Nachdem wir angekommen waren, …*; narrative of a trip/panne).
* **Vocabulary:** Reisepanne, Hotelbeschwerde, Tourismus, Feste/Bräuche, Pünktlichkeit/Höflichkeit, Heimat/Fremde; comparison phrases ↻ (22). Dedupe against A2 Unit 18.
* **Reading:** travel report/interview 170–210 words. **Listening:** hotel desk / travellers' conversation 150–180 words. **Speaking:** compare customs, describe a mishap, 7 turns. **Writing:** travel report or hotel review, minWords 85, Relativsatz + Genitivattribut.
* **Scenarios:** train cancelled and compensation; hotel complaint; explaining a custom to a guest; culture-shock conversation.
* **Assessment objectives:** relative pronoun after preposition (case from preposition, gender/number from antecedent), Plusquamperfekt form and sequence logic, Genitivattribut recognition; ↻ Präteritum (21), Relativsatz Nom/Akk (23).

### Unit 30 — Gesellschaft, Zusammenleben und Engagement · Load M+M+L · ✅ keep
* **Assessment:** Good. Nomen-Verb-Verbindungen are lexical, must be capped (≈ 20 items ⚑ B1/B2 boundary); `sodass/so … dass`, `damit` vs `um … zu` consolidates purpose/consequence; text cohesion is the right capstone for sustained writing.
* **Recommended:** unchanged concept set (`b1-nomen-verb-verbindungen` capped, `b1-konsekutiv-final`, `b1-textkohaesion`); add **people description / generations** vocabulary (appearance, character; recycles adjective endings) and the short-talk objective (1 minute, structured).
* **Reading:** report/article on Ehrenamt 180–220 words. **Listening:** interview 160–190 words. **Speaking:** 1-minute structured talk (intro – 2 points – conclusion), 7 turns. **Writing:** Leserbrief/Vereinstext, minWords 90, with ≥ 4 Gliederungswörter.
* **Scenarios:** join a club; organise neighbourhood help; introduce an event; discuss generations/gender roles.
* **Assessment objectives:** choose `damit` vs `um … zu` (same subject test), `sodass` vs `weil`, Gliederungswörter in a jumbled text (order), Nomen-Verb pairing; ↻ Konnektoren (22), Passiv.

### Unit 31 — Behörden, Verträge und Alltagsprobleme · Load L+M · ⚠️ restructure
* **Assessment:** The Stage-0 plan taught **Konjunktiv II der Vergangenheit** (*hätte … gemacht*) as limited production. This is **very likely B2 ⚑** and violates the proposal's own ceiling (§2.4 principle 4 of the curriculum). Zustandspassiv (planned for 26) fits Behörden texts better.
* **Recommended:** Concepts = `b1-formelle-sprache` (Anrede/Gruß, Nominalphrasen of requests *Ich bitte um …*, Konjunktiv-II politeness ↻; Light), `b1-aktiv-passiv-zustandspassiv` (rewrite Aktiv↔Passiv; *Das Formular ist ausgefüllt/Der Antrag wird bearbeitet*). **Konjunktiv II Vergangenheit: receptive only** (understanding *Ich hätte … sollen* in a text), explicitly not tested productively unless the reviewer decides otherwise (D-4).
* **Vocabulary:** Antrag, Bescheid, Frist, Unterlagen, Aufenthaltstitel, Versicherung, Schadensmeldung, Widerspruch, Termin, Zuständigkeit; Polizei/Unfall report. Dedupe against A2 Unit 19.
* **Reading:** Behördenschreiben + Formular 130–170 words. **Listening:** call to an office/insurer 140–170 words. **Speaking:** clarify a procedure, 7 turns. **Writing:** formal inquiry or Widerspruch, minWords 70 (formal letters need accuracy more than length). **Mediation micro-task:** relay the content of a Bescheid in own words (2–3 sentences).
* **Scenarios:** authority counter; damage report; request a deadline extension; clarify a misunderstanding.
* **Assessment objectives:** register choice (Sie, formulae), Aktiv↔Passiv equivalence, Zustandspassiv vs Vorgangspassiv, find required documents/deadline in a notice (reading); ↻ Passiv (24/26), Konjunktiv II (25/27).

### Unit 32 — Rückblick, Bilanz und Prüfungsvorbereitung · Load L (revision) · ✏️ change
* **Assessment:** Right shape (mirrors A2 Unit 20). Two revision concepts needed; Stage-0's second one (`b1-konjunktiv2-bilanz`) duplicates recycling that already happens through ↻ items. **Mittelfeld/Satzbau** (TeKaMoLo, Dativ before Akkusativ, pronoun order, Satzklammer) is a B1 staple that no unit teaches.
* **Recommended:** Concepts = `b1-nebensaetze-integration` (overview and word order of all subordinate-clause types) and `b1-satzbau-mittelfeld` (partly new, flagged; order rules practised by `order` items).
* **Reading:** two exam-style texts (one long 200–250, one short). **Listening:** announcement + conversation + short talk. **Speaking:** 2–3 min structured talk, then planning together; practice only. **Writing:** informal mail + formal letter (70–90 words each). **Scenarios:** mock exam in four parts; learning diary/self-assessment; farewell speech.
* **Assessment objectives:** integrated skills; unit test + `level-b1` (§6.4).

## 4. Curriculum balance

### 4.1 Grammar load (heavy items per unit)
| Unit | Stage-0 proposal | Problem | After correction |
| --- | --- | --- | --- |
| 21 | Präteritum H + Plusq. M + 4 connectors M | opening unit too heavy | Präteritum H + connectors M |
| 22 | 3 concepts incl. hidden `da(r)-/wo(r)-` + 7 double connectors | hidden 4th topic | M + M + L |
| 23 | Relativ H + Inf-zu M + **full Adjektivdeklination H** | **two H + M** | Relativ H + Inf-zu M |
| 24 | Passiv Präs/Perf H + Passiv-Modal M | Perfekt upper-B1; unit heavy | Passiv Präs H + Adj ohne Artikel M |
| 25 | Konj II H + Reflexiv-Dativ M + Verb+Präp M | H + 2M | Konj II H + Reflexiv-Dativ M |
| 26 | Passiv Prät/Zustand M + Partizip-Adj M + lassen L | weakly motivated | Passiv Prät/Modal M + lassen L + Wiedergeben M |
| 27 | Konj II Wünsche H + Höflichkeit M + Genitiv-Präp M | Konj II split in two concepts | Konj II H + Genitiv-Präp M |
| 28 | Futur I + falls + Wortbildung | fine, VP missing a home | L + L + M |
| 29 | Relativ-Dativ + Genitivattribut + Wiedergeben | acceptable | M + M + M (Plusquamperfekt in) |
| 30 | NVV + konsekutiv/final + Textkohäsion | NVV B1/B2 risk | cap NVV |
| 31 | formal + **Konj II Vergangenheit** + Umformung | likely B2 item | formal L + Umformung M |
| 32 | 2 revision concepts | one is redundant | integration + Mittelfeld |

Concept count: 34 → **29** (A2: 27). No unit has two paradigm-heavy new systems.

### 4.2 Repeated vocabulary themes
Seven of 12 B1 units revisit an A2 domain (Arbeit 23↔A2-17, Wohnen 24↔13, Gesundheit 25↔14, Medien 26↔16, Konsum 27↔15, Reisen 29↔18, Behörden 31↔19), as A2 itself revisits A1 (Wohnung, Arbeit, Einkaufen). This **spiral is legitimate** (CEFR domains recur) but only if each B1 unit differs in **register, task and text type**: A2 = personal/practical (describe, ask, order); B1 = evaluative/institutional (compare, justify, complain, apply, report). Controls: (a) the validator warning *lemma-repeats-earlier-level* (no A1/A2 lemma re-listed as new vocabulary; A2 words appear as glosses or ↻); (b) each unit's design notes state "difference from A2-Unit N" (as drafted in the unit sections above); (c) the unit title must name the new function, not only the topic (e.g. *Reklamation*, *Bewerbung*, not *Einkaufen*, *Arbeit*).

### 4.3 Missing or under-covered B1 content
| Missing / thin | Why it matters | Where added |
| --- | --- | --- |
| Communication/repair strategies | core of B1 *independent* interaction | strand, every unit (§3.0) |
| Relating plot of film/book; reactions | explicit B1 production descriptor | Unit 26 |
| Comparison language | B1 contrast/comparison tasks | Units 22, 29 |
| Mittelfeld/word-order system | the most common B1 written-accuracy problem | Unit 32 concept (+ `order` items from Unit 22) |
| Bank/money/contracts | high-frequency real-world need | Unit 27 |
| School/Kita/Elternabend | frequent for adult migrants with children | Unit 28 |
| Personal relationships, conflict, feelings | personal-letter descriptor; social interaction | Unit 25 (vocabulary + scenario), 21 (feelings) |
| Notes/messages/invitations/refusals | B1 written interaction | micro-tasks in 21, 24, 28 |
| Mediation (relaying) | CV 2020 B1 | micro-tasks in 26, 31; disclosed as partial |
| Modal verbs in Perfekt/Ersatzinfinitiv | B1-upper | receptive in 21/29; productive decision ⚑ |
| Indefinites/adjectival nouns (*etwas Neues, nichts Besonderes, jemand*) | very frequent in B1 speech | add to Unit 22/24 vocabulary & exercises (no concept) |
| Weather/climate, emergencies, police | travel/everyday | Units 24 (climate), 31 (emergency) |

### 4.4 Real-world scenarios that must exist (checklist for authors)
Workplace (sick-call, apology, schedule conflict), housing (Mangel, Nebenkosten dispute), health (insurance, Überweisung), services (bank, mobile contract), authorities (appointment, deadline, appeal), travel (disruption, compensation), education (course enrolment, school contact), social (invitation/refusal, advice, conflict repair), media (recommendation, correcting a claim). Each scenario must have ≥ 1 *unexpected element* (a problem, a refusal, a changed fact) so that scripted practice is not purely forward-linear — within the limits of the engine (§6.3).

### 4.5 Progression between units
* Dependencies are now acyclic and forward: Präteritum (21) → Plusquamperfekt (29); Relativ Nom/Akk (23) → Relativ Dativ/Präp (29); Passiv Präsens (24) → Passiv Prät/Modal (26) → Aktiv↔Passiv (31); Konjunktiv II advice (25) → irreal/polite (27) → receptive past (31); Adjektive Dativ (22) → ohne Artikel (24); Genitiv-Präp (27) → Genitivattribut (29); connectors (21–22) → purpose/consequence (30) → integration (32).
* Remaining weak links: the A2 borderline items (`wenn/als`, `indirekte Fragen`, *hätte gern* chunk) are assumed secure; Unit 21's bridge and ↻ items are the mitigation, and a short **A2→B1 readiness check** (10 items) before Unit 21 is recommended (no placement test exists).
* Difficulty curve: texts and tasks ramp (§3.5); speaking length ramps 5→8 turns; the first B1 unit must feel like a small step from A2 (pilot unit design target).

### 3.5 Text-size ramp (replaces the Stage-0 flat targets)
| Units | Reading (words) | Listening (words) | Sentence p95 / max | Speaking turns | Writing minWords |
| --- | --- | --- | --- | --- | --- |
| 21–22 | 100–150 | 110–140 | 16 / 22 | 5–6 | 70–80 |
| 23–26 | 120–180 | 120–160 | 18 / 24 | 6 | 70–80 |
| 27–29 | 130–210 | 130–180 | 20 / 25 | 6–7 | 80–85 |
| 30–31 | 150–220 | 140–190 | 20 / 26 | 7 | 70–90 |
| 32 | 200–250 (1 long) | up to 220 | 22 / 28 | 8 | 70–90 ×2 |
Rationale: A2 averaged 65 reading / 104 listening words and 4 turns; B1 exam texts are longer (⚑ commonly 150–300 words) but a single 2–4× jump would break learner experience and TTS reliability. Per-level validator bounds follow this table (Architecture §9).

## 5. Grammar progression matrix

**Proficiency key:** *P* = productive (required in tasks and tests), *R* = receptive only, *P-lim* = productive on a closed list/pattern. **Dup.** = duplicates A1/A2 content? **Load:** H/M/L. ⚑ = confirm B1 placement with the reviewer.

| # | Concept (id) | German grammar topic | Unit | Expected proficiency | Prerequisites | Dup.? | Load | Correction |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `b1-praeteritum-erzaehlen` | Präteritum regelmäßiger/unregelmäßiger Verben (Erzähltempus) | 21 | P-lim (≈ 35-verb closed list); R beyond | A1 `perfekt`, A2 `a2-praeteritum-sein-haben-modal` | **Extends** A2 (sein/haben/modal only) | H | Closed Stammformen list; Perfekt for speech ↻; no Präteritum of separable verbs beyond list |
| 2 | `b1-temporale-konnektoren` | bevor, während, seitdem/seit, bis, nachdem (+ Perfekt) | 21 | P | A2 `a2-ereignisse-verbinden`, `a2-wenn-als` | `als/wenn` ↻ only | M | `nachdem`+Perfekt here, Plusquamperfekt in 29 |
| 3 | `b1-konzessive-saetze` | obwohl, trotzdem, zwar … aber | 22 | P | A2 `weil`, `deshalb` (verb position) | No (`trotzdem` excluded in A2) | M | contrast with `aber`/`obwohl` verb-position items |
| 4 | `b1-doppelkonnektoren` | je … desto, weder … noch, entweder … oder, sowohl … als auch (P); einerseits … andererseits, nicht nur … sondern auch (R) | 22 | P / R | A2 Komparativ, `entweder … oder` (receptive in A2-20) | `entweder … oder` R→P | M | reduce productive set to four |
| 5 | `b1-adjektive-dativ-genitiv` | Adjektivendungen nach Artikel im Dativ/Genitiv (-en), Plural | 22 | P | A2 `adjektivendungen-indefinit/-definit` (Nom/Akk) | **Extends** A2 | L | New split of the old "vollständig" concept |
| 6 | `b1-relativsaetze-nom-akk` | Relativsätze (Nom, Akk) | 23 | P | A2 Nebensatz-Verbstellung; Genus/Kasus | No | H | Commas, verb final; no `was/wo` yet |
| 7 | `b1-infinitiv-mit-zu` | Infinitiv mit *zu*, `um … zu` (*ohne … zu/statt … zu* R) | 23 | P | A1 `separable`, modals | No | M | *zu* inside separable verbs (*aufzustehen*) |
| 8 | `b1-passiv-praesens` | Vorgangspassiv Präsens (Passiv Perfekt R) | 24 | P (R for Perfekt) | A1/A2 Partizip II (Perfekt) | No | H | Perfekt-Passiv receptive ⚑ |
| 9 | `b1-adjektive-ohne-artikel` | Adjektivendungen ohne Artikel (Nom/Akk/Dat) | 24 | P | #5, A2 Adjektive | **Extends** A2 | M | Wohnungsanzeigen as context |
| 10 | `b1-konjunktiv2-ratschlaege` | Konjunktiv II: würde/sollte/könnte/hätte/wäre (Ratschläge) | 25 | P | A2 `sollen/dürfen`, `Präteritum sein/haben/modal` | **Extends** *hätte gern* chunk | H | Explicit A2 `sollen` vs B1 `sollte` contrast; Kyrgyz terminology |
| 11 | `b1-reflexive-dativ` | Reflexive Verben mit Dativ (*mir die Hände waschen*) | 25 | P-lim | A2 `a2-reflexive-verben` (Akk only) | No (excluded in A2) | M | closed list of ≈ 10 verbs |
| 12 | `b1-passiv-praeteritum-modal` | Passiv Präteritum; Passiv mit Modalverben | 26 | P (Prät.: P-lim) | #8, #1 | No | M | moved from 24/26 mix |
| 13 | `b1-lassen` | *lassen* (veranlassen, erlauben, *sich lassen* R) | 26 | P-lim | A1 modal | No | L | `sich lassen` receptive (B2-ish ⚑) |
| 14 | `b1-wiedergeben-indikativ` | Wiedergeben mit dass/ob (Indikativ), *laut*, *Es heißt, dass …* | 26 | P | A2 `a2-ereignisse-verbinden`, `a2-indirekte-fragen` | **Extends** A2 (ob/W-Frage) | M | no Konjunktiv I; pronoun/tense shift only in Indikativ |
| 15 | `b1-konjunktiv2-wuensche-irreal` | Konjunktiv II: Wünsche, irreale Bedingung (Gegenwart), höfliche Bitten | 27 | P | #10, A2 `a2-hoefliche-bitten`, `wenn` | **Extends** *hätte gern/Wie wäre es* chunks | H | merged with Höflichkeit |
| 16 | `b1-genitiv-praepositionen` | wegen, trotz, während, statt + Genitiv | 27 | P-lim | A1 `genitiv` (Überblick only) | **Partial** (A1: recognition) | M | A1 states speech uses *von + Dativ*; keep *wegen + Dativ* register note ⚑ |
| 17 | `b1-futur1-vermutungen` | Futur I (Prognose, Vermutung mit *wohl*) | 28 | P-lim | A2 `a2-zukunft-praesens-werden` (receptive *werden*) | **Extends** A2 | L | Prognose + Vermutung only |
| 18 | `b1-falls-sobald-solange` | falls, sobald, solange (*sodass* R) | 28 | P | A2 `a2-wenn-saetze`, temporale (#2) | No | L | |
| 19 | `b1-verben-praepositionen` | Verben mit Präposition (≈ 20 verbs, Akk/Dativ) + `da(r)-/wo(r)-` | 28 | P-lim | A2 `a2-verben-mit-praepositionen` (6 pairs) | **Extends** A2 | M | closed list; moved from 22/25 |
| 20 | `b1-relativsaetze-dativ-praeposition` | Relativsätze mit Präposition/Dativ | 29 | P | #6, A1 `dativ-prep` | No | M | |
| 21 | `b1-genitivattribute` | Genitivattribute (*das Haus meiner Eltern*) | 29 | R, P-lim | #16 | No | M | receptive-first ⚑ |
| 22 | `b1-plusquamperfekt-nachdem` | Plusquamperfekt; `nachdem` + Plusquamperfekt | 29 | P | #1, #2, A2 Perfekt | No | M | moved from 21 |
| 23 | `b1-nomen-verb-verbindungen` | Nomen-Verb-Verbindungen (≈ 20) | 30 | P-lim | – | No | M | B1/B2 boundary ⚑; cap at 20 |
| 24 | `b1-konsekutiv-final` | sodass, so … dass, damit vs um … zu | 30 | P | #7, #3 | No | M | same-subject test |
| 25 | `b1-textkohaesion` | Textgliederung & Satzadverbien (erstens, außerdem, darüber hinaus, dennoch, daher …) | 30 | P-lim | #3, #24 | `deshalb` ↻ | L | discourse, not syntax |
| 26 | `b1-formelle-sprache` | formelles Register, Anrede/Gruß, Nominalphrasen (*Ich bitte um …*) | 31 | P | #15 | No | L | |
| 27 | `b1-aktiv-passiv-zustandspassiv` | Aktiv ↔ Passiv; Zustandspassiv | 31 | P (Zustandspassiv: P-lim) | #8, #12 | No | M | |
| 28 | `b1-nebensaetze-integration` | Überblick Nebensätze (revision) | 32 | P | #2–4, 6, 7, 18, 20, 24 | recycles | L | like `a2-satzverbindungen-integration` |
| 29 | `b1-satzbau-mittelfeld` | Mittelfeld: TeKaMoLo, Dativ vor Akkusativ, Pronomen | 32 | P | A2 pronouns/Dativverben | **Partly new** | M | B1 staple; `order` items |
| – | Konjunktiv II der Vergangenheit | *hätte … gemacht* | 31 (R) | **R only** | #10, #15 | No | – | ⚑ likely B2; dropped as concept |
| – | Partizip I/II als Adjektiv | *die steigenden Preise* | 26 (R) | **R only** | – | No | – | dropped as concept; glossed in texts |
| – | Wortbildung (-ung/-keit/-heit/-er) | Nomenbildung | from 25 (strand) | P-lim | – | No | – | strand, not a concept |

Concept rows 1–29 are the 29 concepts of the v2 curriculum (Stage 0 had 34); the three rows marked “–” are receptive-only or strand items and are **not** concepts. ⚑ Items to confirm against the Goethe-Zertifikat B1 / Profile deutsch inventories: Passiv Perfekt (R), Plusquamperfekt (B1), Konjunktiv II Vergangenheit (R), Genitivattribut (R-first), Nomen-Verb-Verbindungen (cap), Zustandspassiv (P-lim), Futur I (P-lim).

## 6. Assessment strategy

### 6.1 Unit-level knowledge check (existing `unit-N` topic test, 15 authored questions)
| Strand | Items | Format (all supported by today's `QuizRunner`: choice / fill (`___`) / order) |
| --- | --- | --- |
| Grammar | 6 (≥ 2 `fill`/`order` production items) | one error-pattern item per concept; ≥ 2 items per concept in the unit; ≥ 2 ↻ items |
| Vocabulary | 3 | meaning/usage in context + collocation (ru/ky strict) |
| Reading | 4 | 3-option items; **Richtig / Falsch / steht nicht im Text** is a native 3-option format (maps to the Goethe-style task) + gist/detail/attitude |
| Listening | 2 — **only after real-device TTS verification (blocker B-7)**; until then 6 grammar-in-context + 4 reading | detail/gist; played via TTS |
Rules: 70 % pass (existing policy), option order shuffled per attempt, answer positions balanced, both languages authored independently, no reuse of the unit's 8 exercises.

### 6.2 Skill assessments (what each can honestly claim)
| Skill | Instrument | What it measures | What it must NOT claim |
| --- | --- | --- | --- |
| Grammar | unit-test items + per-concept checks + weak-concept recommendations | accuracy on controlled items | productive command in free text |
| Vocabulary | unit-test vocabulary items; SRS review (existing) | recognition/recall of taught items | lexical range or B1 word-list coverage (§1.2) |
| Reading | 3-option items (gist/detail/attitude), authored texts in the ramped lengths | comprehension of the authored texts | general reading ability |
| Listening | same, via TTS | comprehension of synthetic speech | comprehension of natural speech/accents |
| Writing | task with **length + required-element checklist + model answer + learner self-review against a 4-criterion rubric** (task achievement, coherence/connectors, vocabulary range, accuracy); optional teacher marking outside the app | completion of required elements and length | quality, accuracy, level, or CEFR rating |
| Speaking | scripted scenario; recognition of expected keywords; learner self-review checklist (task achieved, connectors used, ≥ 1 strategy used) | participation in a scripted exchange and keyword coverage | pronunciation, fluency, interaction quality, or CEFR rating |

### 6.3 Why speaking/writing cannot be certified — and a real defect found in this review
Evidence (`src/services/analysis.ts`, read in this stage):
* **Speaking:** `vocabulary = 55 + keyword hits…`, `grammar = 96 − 14 × (matched error patterns)`, `fluency = 60 + length ratio…`, `naturalness = 50 + Jaccard similarity to the hint sentences`. Every dimension has a **high floor** (55/60/50, grammar starts at 96) so almost any input scores > 50 and unrelated text scores ≈ 90 for grammar. The only "pronunciation" figure is the browser recogniser's confidence.
* **Writing:** `grammar = 96 − 14 × errors`, `wordorder = 96 − 18 × errors`, `vocabulary = 45 + …`, `style = 60 + …`; errors come from **19 hand-written regex patterns** (`src/data/errorPatterns.ts`, A1-era topics). **No pattern detects any B1 structure** (Passiv, Konjunktiv II, Relativsatz, Plusquamperfekt …), so a B1 text full of B1 errors would score ≈ 96 for grammar.
* **Localisation:** corrections and tips are produced in Russian (`why: e.why.ru`, hard-coded Russian tips) — Kyrgyz and German learners would receive Russian feedback in a level whose rule is "no fallback".
**Consequences for B1 (requirements, not suggestions):** (1) for B1 tasks **suppress the numeric grammar/fluency/naturalness scores** (or add B1-specific patterns and localise first) and show only the checklist (length, required elements, formality) plus the model answer; (2) never label a result with a CEFR level; (3) the wording "keyword coverage / checklist" replaces "score"; (4) ru/ky feedback strings must be authored in both languages. This needs a **code decision before B1 goes Beta** (new blocker B-9, §7); the existing A2 Beta shows the same behaviour and should be disclosed.

### 6.4 Final B1 level assessment (`level-b1`)
* **Purpose:** an *indicative* check of the taught B1 syllabus; **not** a CEFR certificate, **not** an exam prediction; speaking and writing are not scored.
* **Blueprint (proposal, 40 scored items — mirrors the A2 design):**
| Part | Items | Source | Note |
| --- | --- | --- | --- |
| A Wortschatz | 6 | unit-test vocabulary items, ≥ 1 per two units | declared reuse |
| B Grammatik & Satzbau | 14 | unit-test grammar items; every concept ≥ 1; weighting to Passiv, Konjunktiv II, Relativsatz, Nebensätze, Präteritum/Plusquamperfekt | includes ≥ 3 `order` items |
| C Lesen | 10 | unit-test reading + new texts of 120–220 words; ≥ 4 text types; Richtig/Falsch/steht nicht im Text | new items |
| D Hören | 6 | **conditional on device verification**; otherwise redistribute to C (+3) and A (+3) | TTS |
| E Praktische Sprachverwendung | 4 | new situational items: register (du/Sie), polite refusal, complaint, repair strategy | new |
* **Non-scored companion tasks (self-assessed):** one writing task (informal or formal, 70–90 words) and one speaking task (structured 1-minute talk) with the §6.2 rubric/checklist.
* **Result:** pass for the *indicative* outcome = ≥ 70 % overall **and** ≥ 40 % in every part (the A2 decision, uncalibrated); outcome texts such as "Ziel des B1-Kurses erreicht / fast erreicht / Wiederholung empfohlen". 40 multiple-choice items give limited reliability → report bands, not a precise score; **pilot with real learners before any claim**; thresholds provisional.
* **Storage:** existing optional result fields (`kind`, `parts`, `outcome`, `blueprint`) and protected retention (`level-*` ids) already fit; no XP.
* **A2→B1 readiness check** (10 items, optional, before Unit 21): lightweight substitute for the missing placement test; no outcome claim.

## 7. Risks and blockers raised or sharpened by this review
| # | Item | Status |
| --- | --- | --- |
| B-1…B-8 | as in `B1_IMPLEMENTATION_PLAN.md` §0 | unchanged (B-1 working tree; B-2 approval — **this document supports it**) |
| **B-9 (new)** | **B1 speaking/writing feedback is misleading (score floors, A1-era error patterns, Russian-only strings)** | decide before Beta: suppress scores for B1 or build B1 patterns + ru/ky strings |
| **B-10 (new)** | **Vocabulary coverage (~1 080 productive words after B1) is far below a conventional B1 inventory** | disclose; widen receptive glosses; owner decision on productive size (38–42/unit) |
| **B-11 (new)** | **Per-level validator profile and `lemma-repeats-earlier-level` check do not exist** | Stage B1-validator work before Unit 21 |
| R-1 | Kyrgyz grammar terminology for Passiv, Konjunktiv II, Relativsatz, Plusquamperfekt, Genitiv, Nomen-Verb-Verbindungen has no reviewed glossary | native Kyrgyz reviewer before authoring Unit 24/25 |
| R-2 | A2 borderline items assumed secure; A2 itself is unreviewed | A2 review status is a dependency of B1 quality |
| R-3 | ⚑ B1/B2 placement of Passiv Perfekt, Konjunktiv II Vergangenheit, Genitivattribut, Zustandspassiv, Nomen-Verb-Verbindungen | CEFR reviewer decision (D-1, D-4) |
| R-4 | A1 `genitiv` tagged `level: 'A2'` in an A1 unit and says "speech uses *von + Dativ*" | recorded; B1 teaches Genitiv forms as new |

## 8. Final proposed curriculum (v2)

**Identity (to be registered only after owner approval):** ids 21–32, keys as below (stable; German titles are the plan titles).

| Unit | Key | Titel (Deutsch) | New function | Concepts (3 max) |
| --- | --- | --- | --- | --- |
| 21 | `b1-erlebnisse-erinnerungen` | Erlebnisse und Erinnerungen erzählen | narrate the past coherently | `b1-praeteritum-erzaehlen` (H), `b1-temporale-konnektoren` (M) |
| 22 | `b1-meinungen-diskussion` | Meinungen äußern und diskutieren | argue, concede, compare | `b1-konzessive-saetze` (M), `b1-doppelkonnektoren` (M), `b1-adjektive-dativ-genitiv` (L) |
| 23 | `b1-arbeit-bewerbung` | Arbeit, Bewerbung und Karriere | apply, interview, specify with relatives | `b1-relativsaetze-nom-akk` (H), `b1-infinitiv-mit-zu` (M) |
| 24 | `b1-wohnen-umwelt` | Wohnen, Umzug und Umwelt | describe processes and rules; housing ads | `b1-passiv-praesens` (H), `b1-adjektive-ohne-artikel` (M) |
| 25 | `b1-gesundheit-lebensstil` | Gesundheit, Beziehungen und Lebensstil | advise, empathise, discuss lifestyle | `b1-konjunktiv2-ratschlaege` (H), `b1-reflexive-dativ` (M) |
| 26 | `b1-medien-technik` | Medien, Technik und Nachrichten | report, relate a film/book, state what is done to things | `b1-passiv-praeteritum-modal` (M), `b1-lassen` (L), `b1-wiedergeben-indikativ` (M) |
| 27 | `b1-konsum-reklamation` | Konsum, Geld und Reklamation | wish, hypothesise, complain politely | `b1-konjunktiv2-wuensche-irreal` (H), `b1-genitiv-praepositionen` (M) |
| 28 | `b1-bildung-zukunft` | Bildung, Lernen und Zukunftspläne | plan, predict, state conditions | `b1-futur1-vermutungen` (L), `b1-falls-sobald-solange` (L), `b1-verben-praepositionen` (M) |
| 29 | `b1-reisen-kultur` | Reisen, Kultur und Alltag im Vergleich | narrate with background, compare cultures | `b1-relativsaetze-dativ-praeposition` (M), `b1-genitivattribute` (M), `b1-plusquamperfekt-nachdem` (M) |
| 30 | `b1-gesellschaft-engagement` | Gesellschaft, Zusammenleben und Engagement | structure a talk/text, give purpose and consequence | `b1-nomen-verb-verbindungen` (M, cap 20), `b1-konsekutiv-final` (M), `b1-textkohaesion` (L) |
| 31 | `b1-behoerden-recht` | Behörden, Verträge und Alltagsprobleme | formal register; relay official information | `b1-formelle-sprache` (L), `b1-aktiv-passiv-zustandspassiv` (M) |
| 32 | `b1-rueckblick-pruefung` | Rückblick, Bilanz und Prüfungsvorbereitung | integrate; plan, present, self-assess | `b1-nebensaetze-integration` (rev), `b1-satzbau-mittelfeld` (rev, partly new) |

(Unit 25's German title adds *Beziehungen* because §4.3 places the relationships/feelings scenario there; the title is a proposal for the owner to confirm. Unit 26 adds *Nachrichten*, Unit 27 *Geld*.)

**Totals (v2):** 12 units; **29** grammar concepts (A2: 27); ≥ **38–42** productive vocabulary per unit (≈ 480; cumulative productive ≈ 1 080, §1.2); 24 reading texts and 24 listening texts in the ramp of §3.5; 12 speaking scenarios (5→8 turns); 12 writing tasks + 5–6 micro-tasks (notes/messages/mediation); 96–120 exercises; 180 unit-test items; `level-b1` (40 scored items) with non-scored writing/speaking self-assessment tasks.

**Skills coverage per unit (v2 contract):** 2 readings, 2 listenings, 1 scenario, 1 writing task, 8–10 exercises, 15 test items, strand items (Gesprächs-/Lese-/Hörstrategie, Wortbildung from 25, Meinung/Begründung from 24), ≥ 2 ↻ items (one from A2 in 21–24).

**Cross-level validator and tooling prerequisites before Unit 21 is authored:** per-level validator profile (text ramp, B2+ patterns), `lemma-repeats-earlier-level` warning, B1 error-pattern/feedback decision (B-9), TTS device verification plan (B-7), glossary for Kyrgyz terminology (R-1), approval of this table (B-2).

## 9. Recommendation

# APPROVE WITH CHANGES

**Approve** the 12-unit frame, the domain sequence, the A2→B1 boundary (verified clean against A2 data), the strict ru/ky rule, the unit contract and the consolidation unit.
**Required changes before the unit plan (ids/keys/titles) is registered and Unit 21 is authored:**
1. Adopt the **v2 grammar allocation** (§8): 29 concepts, no unit with two paradigm-heavy new systems; Plusquamperfekt → 29; Wiedergeben → 26; Verben+Präposition → 28; Passiv Perfekt, Partizip-Adjektive and Konjunktiv II Vergangenheit receptive only; Mittelfeld added to 32.
2. Replace the flat text/task targets by the **A2-calibrated ramp** (§3.5) and set productive vocabulary to **38–42/unit**.
3. Add the **strands** (communication strategies, reading/listening strategies, Wortbildung, Meinung/Begründung) and the missing scenarios/topics (§4.3–4.4).
4. Resolve **B-9** (misleading speaking/writing feedback) before Beta, and **disclose** B-10 (vocabulary coverage) and the A2 equivalents.
5. Owner/reviewer decisions on the ⚑ items (D-1…D-10 of `B1_CURRICULUM.md`, plus R-3), with a qualified German/CEFR reviewer checking this document's paraphrased descriptors and B1/B2 placements against the official CEFR/Goethe/Profile deutsch sources, which were not available here.

**Not a REVISE:** no structural rework of the curriculum is needed; the defects are calibration, load balancing, and missing strands. If the reviewer rejects more than two of the ⚑ placements (D-1/D-4/R-3), re-open the grammar allocation before approval.
