# B1 Final Course-Wide Audit (Units 21–32 + `level-b1`) — AUDIT ONLY

**Nothing in the product was changed by this audit** (no content, grammar allocation, translation, vocabulary, validator or UI change; this file is the only addition). B1 remains `planned`, `releasedLocales: []`, invisible. No commit/push.

## 0. Method, and what this audit is NOT
* **What was done:** (a) structural statistics of all 12 units from the real data modules (vocabulary 480, readings, listenings, speaking, writing, exercises, concepts, metadata); (b) targeted automated scans (translation collisions, lemma overlap with A1/A2, probe list of essential words, early-use of later constructions, terminology counts in RU/KY grammar text, text-complexity proxies, guess-probability maths for `level-b1`, "longest-answer" bias); (c) the validator, the full test suite state and the release gate; (d) reading of the PWA code and CSS; (e) the earlier real-Chromium QA results of Stage 3N.
* **What was NOT done:** a line-by-line linguistic reading of every one of the 480 entries and ~100 texts; any German-teacher, CEFR-expert, native-Russian or native-Kyrgyz review (**none exists**); real-device speech synthesis; Safari/Firefox/Edge/screen-reader testing; a learner pilot. Every judgement below is an **internal heuristic assessment** — not CEFR validation and not an official compliance claim. All Kyrgyz is an AI-assisted draft.

## 1. Executive summary
The course is structurally complete, consistent and well guarded (validator 0 errors / 0 warnings; scope guards held; every unit has the same skeleton). The main risks are **pedagogical calibration**, not defects:
1. **Text complexity does not rise across B1** (mean sentence length 6.4 → 9.3 words; subordinator density 0.8–4.6 per 100 words with no trend; texts of Units 21–31 are 107–192 words). The texts look closer to upper A2 than to the B1 band the profile claims. (P1)
2. **`level-b1` is a weak instrument for its stated purpose:** only 13 of 29 concepts are tagged; the reading part uses five passages of 36–46 words (below the course's own 80-word minimum); 59 % of the 3-option items have the correct option as the longest one; the practical part has 4 items; a pure guesser passes part E 41 % of the time and all four parts 1.1 % of the time. (P1)
3. **Open-decision tracking is incomplete and partly mislabelled** (D-1 is attached to `lassen`, D-2/D-4/D-10…D-14 have no review flag). (P1)
4. **Essential topic vocabulary is absent from the whole course** (Gefühl, Grund, Wunsch, Zukunft, Folge, Chance, Medien, Politik, Wahl, Gesetz …). Some is deliberate (law); some is a gap. (P2)
5. **RU/KY terminology has no glossary** and drifts between units (KY *Nebensatz* described by phrase in two units only; *Mittelfeld* rendered differently in Unit 32 than the word-order wording of Unit 22). (P2)
6. **Mobile:** the PWA notice overlaps the lower quiz buttons at 390 px (root cause identified, §7). (P2)
7. **Release gate:** 43 errors, all legitimate (§8); the "44 → 43" change is fully explained.

## 2. Curriculum / CEFR-consistency (internal view)
Per-unit data (words = vocabulary/ readings / listenings; speaking turns; writing minimum words, F = formal; exercises fill/choice/order):

| U | Topic | Vocab n/v/adj | Readings | Listenings | Sp | Writing | Ex f/c/o | Concepts (role) |
|---|---|---|---|---|---|---|---|---|
| 21 | Erlebnisse | 16/11/8 | 116, 107 | 128, 116 | 5 | 70 | 2/5/3 | Präteritum (P-lim), temporale Konnektoren |
| 22 | Meinungen | 22/10/8 | 135, 106 | 139, 119 | 6 | 80 | 3/5/2 | konzessiv, Doppelkonnektoren, Adj.+Dat/Gen |
| 23 | Arbeit | 22/9/9 | 128, 127 | 155, 142 | 6 | 80F | 3/5/2 | Relativsatz Nom/Akk, Inf. mit zu |
| 24 | Wohnen | 22/10/8 | 124, 121 | 131, 125 | 6 | 70F+30 | 3/5/2 | Passiv Präsens, Adj. ohne Artikel |
| 25 | Gesundheit | 22/10/8 | 143, 147 | 141, 132 | 6 | 75+30 | 3/5/2 | Konj. II Ratschläge, Reflexiv-Dativ |
| 26 | Medien | 22/10/8 | 147, 144 | 122, 132 | 6 | 80+30+30 | 4/4/2 | Passiv Prät./Modal, lassen, wiedergeben |
| 27 | Konsum | 23/11/6 | 145, 137 | 133, 140 | 6 | 80F+30 | 4/4/2 | Konj. II irreal, Genitiv-Präp. |
| 28 | Bildung | 22/12/6 | 155, 152 | 142, 140 | 6 | 80F+30+30+30F | 4/4/2 | Futur I, falls/sobald, Verb+Präp. |
| 29 | Reisen | 26/8/6 | 172, 172 | 153, 158 | 7 | 85+30+40 | 4/4/2 | Rel. + Präp., Genitivattribut (R), Plusquamperfekt |
| 30 | Gesellschaft | 23/7/10 | 187, 192 | 170, 168 | 7 | 90+30+40 | 4/4/2 | Nomen-Verb, Konsekutiv/Final, Textkohäsion |
| 31 | Behörden | 25/10/5 | 155, 150 | 144, 141 | 7 | 70F+30+30+30F | 4/4/2 | formelle Sprache, Aktiv/Passiv/Zustandspassiv |
| 32 | Rückblick | 25/10/5 | 215, 94 | 125, 133 | 8 | 80+70F+30 | 3/4/3 | Nebensätze, Mittelfeld (both revision) |

Observations:
* **Progression of structure is sound.** Speaking grows 5 → 8 turns, writing minimum 70 → 90 words, readings 107 → 192 words (Units 21–30), 29 concepts in a logical order (narration → opinion → work → passive → advice → media → consumption → education/future → travel/past perfect → society → administration → consolidation). The A2 baseline (A2 readings 50–92 words, listenings 90–121) → Unit 21 (107–128) is a sensible step.
* **Difficulty is not monotonic.** Heuristic proxies over readings+listenings per unit: mean sentence length 6.4, 7.4, 6.8, 6.4, 7.4, 8.4, 7.2, 7.4, 8.0, 8.2, 7.5, 9.3; subordinators per 100 words 3.2, 2.4, 2.7, **0.8**, 1.4, 2.2, 2.5, 2.9, 2.1, 2.6, **1.7**, 4.6. Units 24 and 31 are *easier* in running text than Unit 21. Listening length plateaus at 120–170 words from Unit 23. Texts are short-sentence dominated; the p95 band of 20–22 words is a ceiling, not a typical value. *Consequence:* a learner finishing Unit 31 has read little text that resembles B1 exam-style reading (≈ 200–300 words, longer sentences, more connectors). *Recommendation:* raise reading length and clause density in Units 25–31 by editing texts only (no new grammar); expert to confirm target bands (decision D-11). **Needs CEFR/exam expert.**
* **Unit 32 consolidation is meaningful but thin on production:** it recapitulates all 27 earlier concepts in metadata and probes show ≥ 15 used in texts; however the long reading (215) and the short one (94) are the course's most inconsistent pair, and the unit introduces a 40-word vocabulary set that is mostly metacognitive (Lerntagebuch, Vorsatz, Fazit) rather than consolidating the topic vocabulary of Units 21–31.
* **Topic balance:** administrative/formal strands are heavy (formal main writing in Units 23, 24, 27, 28, 31, 32; Units 24, 27, 28, 31 all use office/provider/school correspondence), while **work-life interaction, nature/weather/environment beyond housing, food/health in practice, politics/economy, leisure/culture events** are thin or absent (see §4). Inter-personal scenarios exist (Units 21, 22, 25) but only one speaking scenario per unit.
* **Four skills:** each unit has 2 readings, 2 listenings, 1 speaking scenario, ≥ 1 writing task; no unit lacks a skill. Listening is TTS-only and unverified on devices; there is **no real audio** and no dialect/speed variety. Speaking is exercise-only (hint/keyword coverage, no recognition of meaning); Writing feedback is checklist-based.
* **Prerequisites:** B1 does not gate on A2 (decision D-14, label "recommended after A2"). Unit 21 assumes A2 Perfekt, Nebensätze with weil/dass/wenn and Dativ/Akkusativ; the `differenceFromA2` metadata documents this, but no placement check exists.
* **Do not claim:** none of the above is a statement that the course "is B1" in the CEFR sense.

## 3. Grammar progression and open decisions
**Scans:** constructions of each concept were searched in the texts of *earlier* units. No unplanned early use was found, except two by-design cases: `nachdem` + Perfekt in Unit 21 (the concept in Unit 29 is `nachdem` + Plusquamperfekt — same conjunction, different tense rule, a legitimate but confusing double meeting) and receptive `sodass` in Unit 28 (declared with `receptiveThrough: 29`). Only two `receptiveThrough` declarations exist (Unit 23 `statt … zu` through 26; Unit 28 `sodass` through 29); receptive Passiv Perfekt (`worden`, Unit 24), Partizip I (Unit 26) and Konjunktiv II der Vergangenheit (Unit 31) are declared without a range. The validator ignores receptive items after their window (`rules/b1.ts:719`).
**Tracked review flags (curriculum.ts):** D-5 (Unit 24), D-1 (Unit 26 `lassen`), D-3 (28), D-7 ×2 (27, 29), D-6 (29), D-8 ×2 (30, 31), D-9 (32) = 53-flag total with the CEFR sign-offs.

| ID | Affected units | Current implementation | Educational consequence | Recommended resolution | Expert needed |
|---|---|---|---|---|---|
| D-1 A2→B1 boundary | 21–23, 26 | Plusquamperfekt/Passiv/Konj. II/Relativsatz placed at B1. **The flag is attached to `lassen` (Unit 26), which concerns B1/B2 placement of *sich lassen* — an ID mismatch with the approval document.** | If the boundary is wrong, up to 2–3 units move later. | Re-label the `lassen` flag (R-3 or a new ID); keep D-1 as a course-level decision. | Yes |
| D-2 obwohl/trotzdem, Relativsatz productive from 22/23 | 22, 23 | Implemented as approved; **no review flag exists**. | Possible early load. | Add a tracking flag. | Yes |
| D-3 Futur I (P-lim) / Partizip I/II as adjective (R) | 28, 26 | Futur I only "wird wohl" conjectures; Partizip I receptive (Unit 26 only). | Risk of under-teaching Futur I; Partizip adjectives have no second exposure. | Keep; add one receptive re-exposure in Units 29–31 if the expert agrees. | Yes |
| D-4 Konj. II Vergangenheit receptive (Unit 31) | 31 | Glossed in one reading, never required. **No review flag exists (only `receptiveOnly` metadata).** | Learners meet it once; B1 exam-style reading often contains it. | Add flag; expert decides remove/keep/promote. | Yes |
| D-5 Passiv Perfekt receptive | 24, 26 | One gloss each; never tested. | As above; the form (`ist … worden`) is rare in A2 input. | Keep receptive; expert to confirm. | Yes |
| D-6 Plusquamperfekt + nachdem productive | 29 (also 21, 32) | Productive in 29; recycled in 32 and the level test (`lt-33` contains it untagged). | Heavy for a single unit; D-6 fallback "receptive first" would also change Unit 32 items. | Pilot with learners; expert. | Yes |
| D-7 Genitiv (Attribute R; Präpositionen P-lim) | 22 (Adj+Gen), 27, 29 | Genitiv-Präpositionen taught productively with closed list; Genitivattribut receptive; vocabulary examples were *forbidden* from using Genitiv attributes in 29–32. | The course teaches Genitiv-Präpositionen but never lets learners see Genitivattribute productively; unnatural examples were rewritten to avoid them (e.g. "die Wortstellung" instead of "die Reihenfolge der Wörter"). | Expert decision on a closed productive Genitivattribut set. | Yes |
| D-8 Nomen-Verb-Verbindungen (≤ 20) and Zustandspassiv (10 participles) | 30, 31 | Both implemented as closed lists. | Closed lists may leave common expressions unexplained. | Expert supplies the final lists (D-12). | Yes |
| D-9 Mittelfeld as Unit-32 systematisation | 32 | Concept with role `revision`, P/M, flagged. | The rules are used from Unit 21 (Perfekt) but never *named* before 32; word-order errors appear unaddressed for 11 units. | Keep as is, or add a 5-minute "Satzklammer" box earlier (no new concept) — expert. | Yes |
| D-10 12-unit span, Unit 32 consolidation | all | Implemented. | — | Close. | No |
| D-11 Text-length ramp, 38–42 words/unit | all | 40 words per unit; texts as table. | See §2 (short texts). | Revisit with reviewer. | Yes |
| D-12 Closed lists (Verb+Präp ≈ 20, Präteritum ≈ 35) | 21, 28 | Authored by the project; unreviewed. | Unreviewed lists drive productive items. | Reviewer supplies. | Yes |
| D-13 Mediation as micro-tasks only | 26, 28, 31 | Three mediation micro-tasks (kind `mediation`). | Mediation is a real B1 skill; coverage is thin (3 × 30 words). | Accept for Beta with disclosure or defer. | Yes |
| D-14 No prerequisite gating | course | No gating; label only. | A1 learner can open B1. | Decide with product owner. | No |
Additional undecided items from reports: extra `zweitens` in Unit 30's closed connector list; `note` micro-task kind overloaded for several kinds of tasks; unauthored "Widerspruch" writing alternative (Unit 31); legal/administrative review of fictional Unit 31 scenarios; uncalibrated thresholds of `level-b1`; whether the additive `levelTest` mechanism is the permanent design.

## 4. Vocabulary audit (480 B1 words; 1083 across A1–B1)
* **Distribution:** exactly 40 per unit (270 nouns, 118 verbs, 87 adjectives, 5 other, 0 adverbs). Noun share ranges 16/40 (Unit 21) to 26/40 (Unit 29); verbs 7–12; adjectives only 5–6 in Units 27–29, 31, 32. No adverb category: *zunächst*, *meistens*-type words are typed "other".
* **Duplicates:** no lemma repeats an A1/A2 or earlier B1 headword (validator rule + my independent `lemmaKeys` scan: none). No Russian translation is shared by two B1 words or equals an A1/A2 translation.
* **Kyrgyz collisions:** 5 pairs share one KY gloss (all noun/verb pairs: *колдоо* unterstützen/Unterstützung, *дарылоо* Behandlung/behandeln, *кайтарып берүү* Rückgabe/zurückgeben, *көңүл топтоо* Konzentration/sich konzentrieren, *ырастоо* Bestätigung/bestätigen) — acceptable as derivation, but unmarked; and **6 B1 KY glosses equal an A1/A2 KY gloss** for a different German word (Begegnung = *sich treffen*, zunächst = *zuerst*, Werbung = *Anzeige*, überprüfen = *Untersuchung*, Rabatt = *Angebot*, ersetzen = *umtauschen*) — the KY gloss does not distinguish them. Needs native review.
* **Compounds built on earlier nouns:** 16 B1 nouns are compounds of A1/A2 nouns (Großstadt, Stellenanzeige, Berufserfahrung, Kaltmiete, Nachmieter, Krankenkasse, Kreditkarte, Mobilfunkvertrag, Hochschule, Elternabend, Ganztagsschule, Pauschalreise, Rundreise, Ansprechpartner …) — legitimate word-formation recycling (Wortbildung strand), not duplication.
* **Missing plurals:** 52 nouns have no plural entry (mostly abstract/uncountable: Kindheit, Mut, Umwelt, Schlaf …); acceptable, but a few (e.g. Auswahl, Spannung) may deserve a plural — I did not review each, so this is a spot-check item.
* **No productive/receptive field:** vocabulary entries do not record P/R status; all 480 are implicitly productive, though the validator limits what appears in tasks. Recommendation: add an optional field only after the expert decides.
* **Essential words absent from the entire A1–B1 vocabulary** (by lemma): *Gefühl, Ahnung, Vergleich, Bewertung, Interview, Wunsch, Zukunft, Chance, Ursache, Folge, Grund, Zweck, Absicht, Wirtschaft, Politik, Wahl, Gesetz, Regierung, Medien, Religion, Freiwillige, Konflikt, Anspruch, Symptom, Bewegung, Meinungsfreiheit*. Some are used inside texts anyway (so learners meet them unglossed). Deliberately excluded: *Gesetz* (no legal claims), political terms. Not deliberate: **Medien** (Unit 26 topic!), *Grund*, *Folge*, *Ursache*, *Wunsch*, *Gefühl*, *Zukunft* (Unit 28 topic). Recommend adding the unglossed ones to the glossary or swapping low-value items of Unit 32 (metacognitive vocabulary) — needs a decision, not done here.
* **Legitimate vs unnecessary revision:** the Wiederholungsblock (≥ 20 words of Units 29–31) and spaced revision (A2 ×2) are intentional and use real ids. No unnecessary duplication was found.

## 5. RU/KY localization
* **Parity:** every German item has RU and KY (validator `ky = ru` check; test suites; zero `ky === ru` in B1 vocabulary). This is **structural parity only**.
* **Terminology (counts in grammar explanations):** RU uses *придаточное* for Nebensatz (47×, never *побочное* — consistent) but mixes Latin and Russian for *Passiv/пассив* (31 vs 3) and *Partizip/причастие* (33 vs 4); *Konjunktiv II* is Latin only (16; no *сослагательное*). KY keeps Latin *Passiv, Konjunktiv, Genitiv, Relativsatz, Partizip, Plusquamperfekt, Futur*, but describes *Nebensatz* by "кошумча сүйлөм" only in Units 28 and 32, and Mittelfeld/word order by yet other phrases in Units 22 and 32. No glossary file exists. *Recommendation:* create a bilingual terminology table before native review so reviewers correct once.
* **Examples vs unit vocabulary:** the validator requires examples to be in the vocabulary of the earlier units; 14 of 480 examples do not contain the headword's first four letters (inflected/separable verbs — spot-check recommended).
* **Checklists/instructions:** self-assessment wording is shared (dictionary keys); writing/speaking tips repeat the same disclosure text (consistent, slightly repetitive).
* **Kyrgyz:** all of it is an AI draft; the repeated errors found earlier (bad words, a fabricated grammar label) show that automated checks do not substitute for native review. **Native Russian and Kyrgyz review remains mandatory.**

## 6. Four skills and assessment
* **Reading:** 24 texts of 94–215 words, richtig/falsch/steht-nicht-im-Text format only from Unit 32 (earlier units use 3-option questions); question types therefore do not progress.
* **Listening:** 24 scripts of 116–170 words, monologue/dialogue/announcement; TTS only; **real playback unverified**; no assessment item depends on audio.
* **Speaking:** 12 scenarios, 5–8 turns; situations cover story, discussion, interview, complaint, conflict, recommendation, negotiation, parent talk, travel problem, short talk, phone call, final talk — good variety; all are *AI-asks/learner-answers* exercises without scoring; speech recognition quality unverified.
* **Writing:** 12 main tasks (70–90 words; informal 7, formal 6 incl. Unit 32) + 19 micro-tasks (30–40 words); minima rise with unit; **discoverability verified** (unit page extra rows + Writing Lab + browser QA for Unit 32; earlier units have tests). Models always pass their own checklist.
* **Exercises:** 10 per unit (2–4 fill, 4–5 choice, 2–3 order). Unit 21 has only 2 fill items.
* **Assessment reliability (across the course):** unit tests (15 items, 3 options) have the correct option as the longest in 81/180 (45 %) cases — above the 33 % baseline, so a test-wise learner can gain points. Positions are balanced by rule (5/5/5), so position bias is controlled, length bias is not. *Recommendation:* equalise option length in a text-only pass.

### 6.1 `level-b1` in detail
* **Structure:** 40 items — A vocabulary 9 · B grammar/word order 14 (3 `order`) · C reading 13 · D listening 0 · E practical 4. Items touch every unit (2–7 each; Unit 32 has 4, Unit 23 only 1; Unit 22 two).
* **Coverage:** only **13 of 29 concepts** tagged (missing: temporale Konnektoren, Doppelkonnektoren, Adjektive Dativ/Genitiv, Infinitiv mit zu, Adjektive ohne Artikel, Reflexiv-Dativ, lassen, wiedergeben, Konj. II irreal, Futur I, falls/sobald/solange, Genitivattribut, Plusquamperfekt/nachdem, Nomen-Verb, Textkohäsion, formelle Sprache). Part B tests 11 earlier concepts + 3 order items — a thin sample of 29 concepts.
* **Reading:** 5 passages of **36–46 words** (below the course's 80-word reading minimum and far below Unit 30's 190). 13 items: 3 statement-type, 10 multiple choice. It measures sentence-level comprehension, not B1 text reading.
* **Practical language use (E, 4 items):** all four are choose-the-polite-sentence items; they test register recognition, not production. Four items cannot be reliable: a guesser reaches the 40 % part threshold with probability **41 %**.
* **Guessing maths (3 options, p = 1/3):** ≥ 28/40 by guessing 2.4·10⁻⁶; "almost" (≥ 22) 0.39 %; each part's 40 % threshold is reached by chance with probability A 35 %, B 31 %, C 24 %, E 41 %; all four parts at once 1.1 %. The overall rule is therefore robust against guessing, the part rule is only a weak guard.
* **Listening part = 0 items:** pedagogically acceptable *only* as a temporary, disclosed state; the result card does not say that listening is missing. A learner can receive "Цель курса B1 достигнута" without any listening evidence. **Recommendation:** show an explicit "Hören ist hier nicht geprüft" line on the card (text-only change) and a hard rule that the band wording changes when D is empty.
* **Thresholds:** 70/40/55 are authoring proposals, uncalibrated, no piloting. The band label "Цель курса B1 достигнута" can be read as a level statement; wording needs expert review although the card states that it is not a certificate.
* **Honesty:** fixed statement (indicative, not a certificate, no exam prediction, no speaking/writing) is present in RU and KY and tested; no Goethe/telc/CEFR strings appear in the assessment, bands or card (tested). Not claimed: validity, reliability coefficients.
* **Validator coverage:** the validator has no rule on the level-test structure (size 40, part distribution, ≥ 3 order, thresholds, coverage); these are enforced only by `tests/b1/level-b1*.test.ts`.

## 7. Technical and UX
* **Registry/IDs/loader/metadata:** unit ids 21–32, `b1-…` conventions, `v<unit>-<n>` vocabulary ids, `b1-wr/ex/ft/re/li/sp/lt` ids are validated by `identity.ts`/`conventions.ts`; one lazy chunk `B1_CONTENT` + `B1_META`; routing reuses A1/A2 routes; B1 routes return "not found" while `planned` (tested for Unit 32 and earlier units). No ID drift found.
* **Writing navigation:** verified for all units by integration tests; for Unit 32 also in Chromium. **Assessment integration:** the additive `levelTest` path is covered by 19 unit/integration tests and Chromium runs (4 combinations).
* **PWA install banner (known mobile issue) — investigated, not fixed.** Root cause: `.pwa-note` is `position: fixed; z-index: 60; bottom: var(--nav-h) + 12px; left/right: 12px` (src/pwa/pwa.css), so at 390 px it floats over the lower part of the content; quiz screens put their primary buttons ("Продолжить", "Проверить", "Завершить") at the bottom of the viewport, and pages reserve no bottom padding for the notice. In Playwright the notice also appeared in the dev server (`beforeinstallprompt`). The user can dismiss it ("Позже"), after which it persists as dismissed (`DISMISS_KEY`). *Recommended fix (later):* reserve `padding-bottom` equal to the notice height while it is visible, or render it in flow at the top; also dismiss it automatically when a quiz starts. Not changed here.
* **Responsive:** Unit 32 routes in ru/ky at 1280/390 had no horizontal overflow (Stage 3N). Other units were verified by jsdom only (which does not test layout) — **earlier units were not re-checked in Chromium in this audit.**
* **Not verified:** real speech synthesis on physical devices; Safari/Firefox/Edge; screen readers; low-end device performance; PWA offline behaviour of the B1 chunk beyond the existing automated tests.
* **Tests:** 107 files, 3249 tests passed at the end of Stage 3N; 29 files under `tests/b1` (per-unit content tests + per-unit integration tests + infrastructure/approval/profile); lint 0 errors/8 baseline warnings; typecheck clean. Coverage gaps: the vocabulary of Units 21–31 has no test of difficulty; no test compares RU/KY terminology across units.

## 8. Release-gate investigation (`content:validate:release`)
**43 errors, all legitimate; B1 is not the cause of 31 of them:**
* `cefr-signoff-missing` — **22**: Units 11–20 (A2) **and** Units 21–32 (B1) have content but no recorded CEFR review. For B1 these 12 errors are *expected and correct* (no human CEFR review exists).
* `release-gate-review` — **20**: A2 is `released` for ru and ky but Units 11–20 have no recorded Russian/Kyrgyz review (10 units × 2). Unrelated to B1; a pre-existing A2 Beta condition.
* `unit-minimum` — **1**: "no A2 level test definition (kind 'level')". A2 only.

**Why 43 instead of 44.** Before Stage 3N the rule in `rules/metadata.ts:190-199` also produced `unit-minimum B1: no B1 level test definition` for B1 (B1 is `planned`, so severity = error in release mode). Stage 3N added the `level-b1` test definition (`kind: 'level'`, `level: 'B1'`), which removed exactly that one error: 44 − 1 = 43. This is **confirmed by reading the rule and the 10 A2 + 12 B1 + 20 + 1 arithmetic** (22 + 20 + 1 = 43), not an assumption. It does **not** mean that B1 is closer to release: it only means the minimum-presence check is satisfied.
**Rules that are missing or too weak (do not change now):**
1. The rule checks only *that a level test exists*, not that it is sound (no size/part/threshold/coverage rule; see §6.1).
2. `release-gate-review` is evaluated per *released* locale; because B1 has `releasedLocales: []`, **B1 has no RU/KY review errors in the gate**. When B1 is later released the gate will start to flag them — correct, but the owner should know that today's 43 *under-states* B1's blockers (24 additional RU/KY review errors would appear for 12 units × 2 locales).
3. `cefr-signoff-missing` can be cleared by recording a review; nothing checks the *quality* of that record, and nothing asserts that open decisions D-1…D-9 are closed before release (they appear as review-severity flags, not gate errors). A release gate for open expert decisions is advisable.
4. Open decisions D-2, D-4, D-10…D-14 have no flag at all.

## 9. Prioritised correction plan (nothing implemented)
**P0 — none blocks anything today** (B1 is unreleased and hidden).
**P1 — before any Beta exposure of B1 to learners**
1. Expert decisions D-1…D-9, D-11/12 (CEFR/German reviewer) and recording of reviews; fix the D-1 mislabel; add flags for D-2/D-4/D-10…D-14. *(owner + expert)*
2. Text calibration: raise reading/listening length and clause density for Units 22–31 (edit texts only), keep scope guards. *(author + expert)*
3. `level-b1` redesign: longer reading passages (≥ 80 words), 8–10 practical items incl. a production/ordering variant, concept tags for all 29 concepts, equalised option length, and an explicit note that listening is not assessed (or defer the band wording). Add validator rules for its structure. *(author + expert)*
4. Native Russian and Kyrgyz review of all 12 units (glossary first). *(native reviewers)*
**P2 — Beta polish**
5. Vocabulary gaps (Medien, Grund, Folge, Wunsch, Zukunft, Gefühl …) via glossary or swaps decided by the owner; mark P/R status; verify KY glosses that equal A1/A2 glosses.
6. PWA notice layout fix at ≤ 600 px (§7) and Chromium regression run of all B1 quiz pages at 390 px.
7. Equalise option lengths in unit tests; vary reading question types before Unit 32.
8. Real-device TTS and screen-reader checks; Safari/Firefox/Edge pass.
**P3 — later**
9. Learner pilot to calibrate `level-b1` thresholds; consider adding listening items once TTS is verified.
10. Decide on mediation depth (D-13) and prerequisite policy (D-14).

## 10. Confirmations
B1 `planned`, `releasedLocales: []`; no B1 content, Storage, A1/A2 content, validator rule, release gate, UI or translation was modified; the 15 staged files unchanged (`git diff --cached --shortstat` 15 files, 513 insertions, 103 deletions); no commit or push. This report is an internal assessment; **no CEFR, native-speaker or exam-expert validation exists or is claimed.** The pasted brief ended mid-sentence in section 9 ("All Units"); the earlier project-protection list was applied in full.
