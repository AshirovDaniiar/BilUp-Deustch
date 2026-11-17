# A2 Stage 7B — independent pedagogical audit (read-only)

**What this is.** A read-only audit of the Stage 7B curriculum design (units 12–20), carried out by the authoring assistant in a separate pass, after the design was complete. It changes no document, no content, no test and no code.

**What this is not.** It is **not** a qualified teacher's review, **not** a native-speaker review and **not** a CEFR authority's opinion. No human reviewer has seen it, and no approval is recorded or implied anywhere. The same assistant wrote the design, so this pass is a second reading, not independent in the human sense; its purpose is to find problems before people spend review time.

**Evidence legend** — every conclusion is tagged:

| Tag | Meaning |
| --- | --- |
| **[DATA]** | verified in this repository during the audit (files, code, validators, counts) |
| **[CEFR]** | a statement about CEFR descriptors or the usual A2 inventories, **from the assistant's memory, not re-checked against the CEFR / Companion Volume text, Profile deutsch or Goethe-Zertifikat A2 lists** (none are available offline here). Treat as a claim to verify |
| **[P]** | pedagogical judgement of the assistant |

Documents read: the four Stage 7B documents, `A2_AUTHORING_GUIDE.md`, the Unit 11 data (as shipped), `docs/review/A2_UNIT11_*` (packages, tracker), `A2_UNIT11_CEFR_PROPOSALS.md`, `A2_UNIT11_KY_QA.md`, and the quiz runner / validator code where a decision depends on it.

---

## 1. Summary

| Result | |
| --- | --- |
| Stage 7B as written | **Not ready for unconditional approval. Ready for conditional approval** once the blockers in §2 are decided (they are decisions and small document revisions, not redesign). |
| Strengths | one clear purpose per unit; no duplicated lemma and no A1 overlap (mechanically tested); progression is coherent (tenses → noun phrase → verb system → information structure → integration); recycling is explicit; B1 risks are listed rather than hidden; receptive/productive split is respected |
| Main risks | (1) **workload of units 12–14**; (2) **formal-writing load** (five formal e-mails of 50–70 words); (3) **assessment weights form over communication** and several objectives have no direct assessment; (4) **a template defect inherited from Unit 11**: reading items show the Russian/Kyrgyz translation of the passage; (5) **Kyrgyz terminology is not settled** (K8/K9/K12 still open) and would be copied into nine units; (6) `als` and indirect questions are borderline; (7) writing text types are monotonous (7 of 9 tasks are e-mails/messages) |
| Status of Unit 11 | still **not** the approved template: external CEFR / Kyrgyz / Russian reviews have not happened ([DATA]: tracker all `NOT STARTED`, `A2_REVIEWS = {}`) |

---

## 2. Critical blockers before Stage 7C

**Blockers for starting any authoring (Unit 12):**

| # | Blocker | Why it blocks | Needed |
| --- | --- | --- | --- |
| B1 | **Reading items leak the answer through translation.** `QuizRunner` always shows `promptRu` under the prompt ([DATA] `src/features/tests/QuizRunner.tsx` line ≈130), and Unit 11's reading items `a2-ft-11-14/15` put a **translation of the whole German passage** into `promptRu`/`promptKy`. The learner reads the passage in Russian/Kyrgyz, so the item tests translation, not reading. The Stage 7B design copies this template for T14–T15 of every unit | invalidates 18 reading items per 9 units and the Unit 11 template | decision (see §8-E): translate only the *question*, never the passage; Unit 11 items to be corrected under a separate approval |
| B2 | **Kyrgyz terminology unsettled.** K8 (*жөндөлгөн/жакталган этиш*), K9 (separable prefix), K12 (subordinate clause) are open ([DATA] `A2_UNIT11_KY_QA.md`); the design adds new term families (case, reflexive, adjective ending, comparison, imperative, kinship, administrative, medical) | the same unreviewed terms would be written into ≈ 2 450 more Kyrgyz fields | a **glossary and style guide reviewed by a native speaker before authoring** (D-10) |
| B3 | **Workload of units 12–14** (new paradigms plus 37–40 words) is higher than Unit 11's by the author's own count (§8-D) | learners and authors both pay; quality risk in the first authored unit | decision to rebalance (proposal in §8-D) |
| B4 | **Unit 11 not externally reviewed.** The template the plan reuses is unapproved | scaling an unreviewed template multiplies its defects (B1 is one found without any reviewer) | do not author beyond **one pilot unit (12)** until the CEFR reviewer has answered at least the template questions |

**Blockers for specific later units (not for Unit 12):** B5 `als` in unit 17 (D-2) · B6 formal writing load (units 13, 14, 15, 17, 19) · B7 listening items in final tests (D-9) require technical verification first.

---

## 3. Audit of the twelve decisions

For each: **proposal** → **recommendation** → rationale → impact on A2 learners → prerequisite → alternative.

### D-1 Imperativ taught in unit 14 although units 12–13 use it
* **Proposal.** Units 12–13 contain imperatives only as fixed chunks; `a2-imperativ` is taught in unit 14.
* **Recommendation: ACCEPT, with a controlled-chunk list.**
* **Rationale.** [P] Moving it earlier overloads unit 13 (already adjective endings, comparison, position verbs). Imperative chunks (*Komm vorbei*, *Entschuldigung*, *Bitte warten*) are recognisable without a paradigm. [CEFR] the imperative is generally treated as early (A1/A2) material; here its late taught position is a consequence of A1 not covering it ([DATA] no imperative concept in A1 grammar).
* **Impact.** Learners meet the form receptively in 12–13, productively from 14; requests in unit 12 (O4, W1) must use *Kannst du …?* / *Kannst du bitte …?*, which they can already form.
* **Prerequisite.** A written list of permitted imperative chunks for units 12–13; the reflexive imperative (*Ruh dich aus*) needs unit 12 (satisfied).
* **Alternative (rejected).** Teach in 12 — rejected because 12 is already the heaviest.

### D-2 `als` (temporal) in unit 17
* **Proposal.** Keep `a2-wenn-als` with strict limits.
* **Recommendation: REVISE** — make `als` *receptive* and replace the productive second concept of unit 17 by **temporal prepositions for a CV** (*von … bis, seit, vor, nach dem + Dativ, im Jahr, mit 18*).
* **Rationale.** [CEFR] temporal `als` is commonly placed at the A2/B1 boundary or in B1; I cannot confirm the course's inventory offline. [P] The *wenn/als* contrast is a documented interference trap for Russian («когда» for both) and Kyrgyz, so it costs more than it earns at A2. Temporal prepositions serve the unit's real task (tell and write a career path, application) and are standard A2 material; they extend `dativ-prep` ([DATA] A1 has *seit, von, nach* in `dativ-prep`).
* **Impact.** Unit 17 keeps two productive concepts, becomes lighter on subordination and better matched to the application task; learners still *recognise* `als` in the reading.
* **Prerequisite.** Unit 14 `wenn`; A1 `dativ-prep`; adjustment of E5–E8 / T5–T8 of unit 17 and of the grammar progression (concept id e.g. `a2-zeitangaben-lebenslauf`).
* **Alternative.** Keep `als` productive if the CEFR reviewer places it in A2.

### D-3 Fixed polite chunks *Ich hätte gern*, *Wie wäre es mit …?*
* **Proposal.** Teach as phrases only, no Konjunktiv II explanation.
* **Recommendation: ACCEPT, with three conditions.**
* **Rationale.** [P] These are among the highest-frequency polite formulas in A2 service and social situations; avoiding them would make the learner sound abrupt (*Ich will …*). [DATA] Unit 11's decision F5 removed *Konjunktiv II look-alikes as distractors and the term* — consistent, because here they are chunks, not forms to choose between.
* **Impact.** Better politeness and register without a new paradigm.
* **Conditions.** (1) the terms *Konjunktiv* / *wäre* / *hätte* as free forms never appear in explanations or distractors of units 15 and 20 (reuse the Stage 7A.2 test); (2) the chunk list is closed (*Ich hätte gern …*, *Wie wäre es mit …?*); (3) the CEFR reviewer confirms.
* **Alternative.** *Ich möchte …* and *Wollen wir …?* only (weaker register range).

### D-4 Indirect questions in unit 19
* **Proposal.** Teach `a2-indirekte-fragen` (*Können Sie mir sagen, wo/wann/wie …*, *… ob …*).
* **Recommendation: REVISE** — keep, but limit to **two productive frames** (*Können Sie mir sagen, wo/wann … ?* and *Ich möchte wissen, ob …*), W-questions and `ob` only, and no more than two final-test items.
* **Rationale.** [CEFR] practice differs: some inventories place indirect questions in late A2, others in B1. [P] In service contexts they are very frequent and by unit 19 the learner has met verb-final clauses with `weil`, `dass`, `wenn` in four units, so the structural cost is low; the new element is `ob`. Limiting the scope keeps it a *useful frame*, not a grammar chapter.
* **Impact.** Learners can ask politely for information without a new paradigm.
* **Prerequisite.** `a2-wenn-saetze`, `a2-personalpronomen-akk-dat` (*mir*).
* **Alternative.** Chunks only, no rule, if the reviewer places it in B1.

### D-5 `dürfen` / *man* needed by the unit-13 house rules
* **Proposal.** Unit 13 uses nominal notices only (*Ruhe ab 22 Uhr*).
* **Recommendation: ACCEPT.**
* **Rationale.** [P] Nominal notices are authentic and need no modal; teaching `dürfen` in 13 would add a fourth concept to a heavy unit. Real house rules also appear as nominal or imperative notices.
* **Impact.** Learners understand rules in 13 without producing them; production of rules (*man darf …*) arrives in 19.
* **Prerequisite.** A reading-text constraint for unit 13 R2 and a check that no `man darf` occurs in 13 (a mechanical test in 7C).
* **Alternative.** Teach `a2-sollen-duerfen` in 13 and shift positioning verbs to 14 — rejected (14 is full).

### D-6 Reflexive Dativ (*sich die Zähne putzen*)
* **Proposal.** Excluded.
* **Recommendation: ACCEPT** the exclusion; add the rule that body-care phrases with a possessive Dativ are **not used** in unit 14 tasks.
* **Rationale.** [CEFR] reflexive Dativ is generally above A2; [P] the unit's tasks (symptoms, advice) do not need it. [DATA] the vocabulary map contains *der Zahn* — it must be used in *Mein Zahn tut weh* patterns, not in *Ich putze mir die Zähne*.
* **Impact.** Avoids a known confusion (Akkusativ vs. Dativ reflexive) at A2.
* **Alternative.** Allow it as a closed phrase, receptive.

### D-7 Six verb + preposition pairs in unit 16
* **Proposal.** A set of six, Akkusativ only.
* **Recommendation: REVISE the list, ACCEPT the cap.**
* **Rationale.** [CEFR] verb–preposition government is typically B1-heavy; a small closed set is defensible at A2. [P] The design says "six" but does **not name them** ([DATA] grammar progression lists five and says "set capped at six") — authors would pick different ones. Fix a concrete list in 7C: e.g. *sich interessieren für, sich freuen auf, warten auf, sprechen über, denken an* and one pair from the unit's own tasks (*Lust haben auf* is **not** a verb–preposition pair; avoid it).
* **Impact.** A short list is learnable; a longer one would be rote memory at the cost of communication.
* **Prerequisite.** Reflexives (unit 12); *Wofür / Worauf* stay receptive.

### D-8 Emergency / police line in unit 19
* **Proposal.** Not placed.
* **Recommendation: REVISE** — do **not** add to unit 19; place a short **emergency-call micro-task in unit 14** (it already owns *Notruf, Krankenwagen, Notaufnahme*), and keep *Polizei / Feuerwehr* receptive in the notice-board text of 19.
* **Rationale.** [P] Unit 19 has 38 words and three concepts; the emergency call is health-related and belongs with the vocabulary already planned in 14. It is a high-value safety scenario for adult learners.
* **Impact.** Closes a real-life gap without raising the load of 19.
* **Prerequisite.** Decide whether it becomes an L2 or S1 variant in 14.
* **Note.** The content must teach *language*, not instructions for emergencies (same disclaimer as the medical texts).

### D-9 Listening items in final tests
* **Proposal.** None, as in Unit 11; alternative: ≤ 2 items using `audio`.
* **Recommendation: TECHNICAL VERIFICATION REQUIRED**, then ACCEPT one listening item per unit.
* **Rationale.** [DATA] the data model and validator allow `skill: 'listening'` and `audio` ([DATA] `QUESTION_SKILLS`, `TestQuestion.audio`), and `QuizRunner` plays `q.audio` through the text-to-speech button ([DATA] `QuizRunner.tsx` line ≈128; `SpeakButton`). **Not verified:** (a) whether a German TTS voice exists on the learners' devices and offline in the PWA, (b) that the transcript stays hidden (the prompt text is displayed in the runner), (c) whether replay is acceptable for assessment, (d) how authored `finalTests` will be wired into the runner (not yet consumed by the runtime, per the Stage 7A reports). [P] Without a listening item, one of four skills is assessed only in the lab (4 questions per dialogue), and the unit test over-weights grammar.
* **Impact.** A short audio item (one or two sentences, ≤ 25 words) would make the unit test cover all receptive skills.
* **Prerequisite.** A runtime check; this decision belongs to the stage that migrates the quiz to A2 content, not to authoring.
* **Alternative.** Keep 10/3/2 and state explicitly that listening is assessed by the lab.

### D-10 Kyrgyz kinship, administrative and medical terms
* **Proposal.** Glosses left to native reviewers.
* **Recommendation: REVISE** — a **terminology glossary and style guide, reviewed by a native speaker *before* authoring**, covering kinship, administrative, medical, grammar terms, the address forms (*сен / сиз*) and the policy for loan words.
* **Rationale.** [DATA] the Kyrgyz of Unit 11 is an AI first draft with nine unresolved terminology items; in Stage 7A.1 even basic grammar terms were uncertain. [P] Reviewing a glossary once is cheaper and more reliable than correcting ≈ 2 450 fields later (Unit 11 has 272 Kyrgyz fields; nine units ≈ 2 450).
* **Impact.** Consistent terminology across all A2 units; fewer reviewer corrections; the learner sees one term per concept.
* **Prerequisite.** Resolution of K4–K18 (the nine open items).
* **Alternative.** Author with placeholders flagged for review — rejected: the validator forbids placeholder text and drafts would still propagate terms.

### D-11 Productive / receptive flag in the data model
* **Proposal.** Keep it in documents and tests (as `UNIT_11_RECEPTIVE_WORDS`) or add a field.
* **Recommendation: ACCEPT adding an optional field** (e.g. `receptive?: boolean` on A2 vocabulary) **as a small, separate stage before authoring**, with a validator rule "a receptive word is never a required answer, speaking keyword or writing requirement".
* **Rationale.** [DATA] today the rule is enforced by a hand-written list for one unit; for nine units the lists would live in documents (≈ 47 + 38 items) and drift. An optional field leaves A1 untouched (A1 hashes unaffected) and lets the validator check the rule on all units.
* **Impact.** Learners may later see receptive words marked differently (a UI decision, not needed now); authors get a mechanical guarantee.
* **Prerequisite.** Approval of a type change in `src/data/types.ts` and `A2_SCHEMA`; migration of Unit 11's nine words.
* **Alternative.** A per-unit module constant (the current pattern) — acceptable but weaker.

### D-12 Authoring order
* **Proposal.** 12 → 20.
* **Recommendation: REVISE** — author **one pilot unit (12) first, review it with the (still pending) external reviewers, then 13 and 14 as a reviewed batch, then the rest in pairs**, with a review gate after units 14 and 17.
* **Rationale.** [DATA] Unit 11's template has already shown a defect (B1) that was not caught by the validator; units 12–14 carry the heaviest new grammar (§8-D); [P] errors found after nine units cost nine times as much.
* **Impact.** Slower start, but stable quality and a template validated by real reviewers.
* **Prerequisite.** B1–B4 above.

**Summary of recommendations**

| Decision | Recommendation |
| --- | --- |
| D-1 Imperativ timing | ACCEPT (with chunk list) |
| D-2 `als` | **REVISE** (receptive `als`; add temporal-preposition concept) |
| D-3 polite Konjunktiv-II chunks | ACCEPT (three conditions) |
| D-4 indirect questions | **REVISE** (two frames, ≤ 2 test items) |
| D-5 `dürfen` / *man* | ACCEPT (nominal notices in 13) |
| D-6 reflexive Dativ | ACCEPT (exclusion, plus a rule for *Zahn*) |
| D-7 verb + preposition | **REVISE** (name the six; ACCEPT cap) |
| D-8 emergency line | **REVISE** (place in unit 14, not 19) |
| D-9 listening in final tests | **TECHNICAL VERIFICATION REQUIRED** |
| D-10 Kyrgyz terms | **REVISE** (glossary reviewed before authoring) |
| D-11 receptive field | ACCEPT (small separate stage; optional field) |
| D-12 authoring order | **REVISE** (pilot one unit, gates) |

---

## 4. Audit A — CEFR A2 alignment, units 11–20

* **[CEFR] Communicative functions.** The functions of the ten units (describe self and others, simple transactions, instructions and advice, short social exchanges, short personal texts) are in the usual range of A2 descriptors. Nothing in the plan is a *function* clearly above A2.
* **[CEFR] Writing.** A2 writing descriptors are about short simple notes, messages and very simple personal letters. The plan has **five formal e-mails** (13, 14, 15, 17, 19) with 50–70+ words each, and unit 17 an application. This is the part of the plan **most likely to exceed A2 production** if the learner writes freely. [P] Mitigation: scaffold with sentence frames, set the minimum at 40–50 words, keep formal tasks to at most three (13, 15, 19) and convert others to notes, forms or messages.
* **[CEFR] Speaking.** Role-plays with service partners are suitable; the job-interview role-play (17) asks for sustained answers — acceptable if the interviewer's questions are the fixed, predictable set listed in the design.
* **[CEFR] Listening/reading.** Dialogue lengths (≈ 100–125 words, two speakers) and reading lengths (≈ 60–80 words) are within typical A2 ranges; [DATA] the validator's heuristic range for readings is 30–180 words.
* **[P] Overall.** Plausible A2 ceiling for communication; the grammar side needs the checks in §5; the risk is accumulation (§8-D) rather than any single item.

## 5. Audit B — grammar progression and possible B1 content

| Item | Assessment | Tag |
| --- | --- | --- |
| Adjective endings (indefinite, then definite + plural, Nom/Akk) | usual A2 material; the two-step introduction (13 → 15) is sound | [CEFR] [P] |
| Komparativ / Superlativ | A2; the plan's limits (no attributive comparative) are sensible | [CEFR] |
| Position verbs | A2; builds on A1 `wechsel` | [P] |
| Imperativ, `sollen/dürfen`, `wenn` | A2 | [CEFR] |
| `deshalb/darum` | probably A2; verify | [CEFR] |
| temporal `als` | A2/B1 border → D-2 | [CEFR] |
| Verbs with prepositions | mostly B1; six pairs defensible → D-7 | [CEFR] |
| Indirect questions | border → D-4 | [CEFR] |
| `werden` + infinitive | receptive only: appropriate | [P] |
| `hätte gern`, `wie wäre es` | chunks → D-3 | [P] |

**Gaps (structures an A2 learner usually needs that the plan does not place) — [CEFR]/[P]:** (a) **`zu` + adjective and `genug`** (*zu teuer, zu klein, nicht groß genug*) — very frequent in housing (13) and shopping (15); (b) **indefinite pronouns** *etwas, nichts, alles, jemand, niemand*; (c) **temporal prepositions** (see D-2); (d) **possessive articles in Dativ** (*mit meinem Freund*) beyond what unit 12's Dativ verbs cover — [DATA] A1 `possessive` shows Nominativ/Akkusativ examples; (e) **`man`** is planned only in unit 19 although it occurs in simple rules earlier. Suggested placement: (a) 13 and 15 as chunks, (b) 15, (c) 17, (d) 12 (inside G1/G2), (e) keep 19.

**Possible B1 content in the plan:** `als` (D-2), indirect questions (D-4), verb + preposition sets (D-7), adjective endings after the definite article in the plural (acceptable if Nom/Akk only), reflexive Dativ (excluded, D-6), formal-letter conventions (see §4). No Passiv, Relativsatz, Konjunktiv II as a form, Plusquamperfekt or Genitiv is planned ([DATA] grammar progression §8).

## 6. Audit C — vocabulary difficulty and productive/receptive balance

* **[DATA] size.** 340 new items in units 12–20 (36–40 per unit); A1 has 226 in ten units (≈ 23 per unit). The per-unit load is **about 60 % higher than A1** and equal to Unit 11 (37). [P] This is on the high side for self-study; the plan sensibly lists more than the 28 minimum, so final counts can be trimmed.
* **[DATA] balance.** Receptive share: 12 → 5/40 (12.5 %), 13 → 4/37, 14 → 4/38, 15 → 2/38 (5 %), 16 → 3/36, 17 → 7/37 (19 %), 18 → 6/39, 19 → 3/38, 20 → 4/37; all ≤ 20 % ([DATA] mechanical test). Unit 15 has the lowest receptive share although it contains low-frequency items; unit 17 the highest.
* **[P] Items to reconsider (suggested receptive, or drop):** *die Kaution* (13, a housing-contract term; keep productive only if the unit's viewing task requires it), *der Antrag* and *die Anmeldung/sich anmelden* (19; bureaucratic — *der Antrag* receptive), *ledig* (12), *die Hausordnung* (13), *die Übernachtung* (18), *der Kompromiss* is already (R), *die Überstunden* (17). Conversely *die Polizei* and *die Feuerwehr* are missing (D-8).
* **[P] Categories well covered:** body, food, quantities, media, housing, travel. **Thin:** feelings (6 items), small-talk/weather (unit 18 only), housing problems (*kaputt, tropft, die Reparatur melden*: *Reparatur* is in 15 only).
* **[DATA] consistency with Unit 11.** Unit 11 receptive words are recorded in a module constant; units 12–20 have none yet (D-11).
* **No lexical level check exists** ([DATA] validator has no word list); level judgements above are the assistant's.

## 7. Audit D — unit workload (units 12–14 in particular)

Estimated load per unit (author's judgement: H = high, M = medium, L = low). "New paradigms" = new forms to memorise, not concepts.

| Unit | New words | Concepts | New paradigms | Load | Comment |
| --- | --- | --- | --- | --- | --- |
| 11 (authored) | 37 | 3 | extends A1 tenses | M | all concepts extend what A1 taught |
| 12 | **40** | 3 | pronoun table (2 cases × 8 persons), Dativ verb list, reflexive pronouns | **H** | highest word count and three new paradigms; Dativ + Akkusativ objects in one concept |
| 13 | 37 | 3 | adjective endings (new), comparison forms, position verbs | **H** | adjective endings are the largest new paradigm of A2 and are introduced here |
| 14 | 38 | 3 | imperative forms, `sollen/dürfen`, `wenn` | **H** | body vocabulary (11 parts) plus health vocabulary, three concepts |
| 15 | 38 | 3 | definite adjective endings (extension), quantity constructions, polite chunks | M–H | extension, but 38 words |
| 16 | 36 | 3 | gern/lieber, verb+prep, ordinals | M | |
| 17 | 37 | 2 | connectors | M (L if D-2 applied) | |
| 18 | 39 | 2 | prepositions | M | high word count, light grammar |
| 19 | 38 | 3 | `man`, indirect questions, route prepositions | M | |
| 20 | 37 | 3 | cumulative | M | by design recycling |

**Proposed rebalancing (for decision, not applied):**
1. **Unit 12:** merge G1 and G2 into one concept ("Personalpronomen und Dativverben"), reduce the productive scope of *zwei Objekte* to noun + pronoun, and trim vocabulary to ≈ 34 (move *das Paar, der Partner / die Partnerin* to receptive or drop two character adjectives).
2. **Unit 13:** keep three concepts but cap *Komparativ* at regular forms plus *gut–besser–am besten, viel–mehr, gern–lieber* and no *so … wie*; trim vocabulary to ≈ 33.
3. **Unit 14:** keep, but cap the imperative to *du* and *Sie* (no *ihr*) and trim body vocabulary to 8–9 parts.
4. **Authoring order:** reflects workload (D-12).

## 8. Audit E–I

### E. Alignment of objectives, exercises and final tests

* **[DATA] distribution.** Every unit: 8 exercises (3 fill / 3 choice / 2 order) and 15 final-test items (10 / 3 / 2 grammar / vocabulary / reading; ≥ 2 recycle) — mechanically consistent.
* **Objective coverage.** In the design every grammar objective (concept) has ≥ 2 exercises and ≥ 2 final-test items. **Communicative objectives are largely not assessed by exercises or the final test**: e.g. 12-O4 (share tasks, make requests), 14-O2 (doctor questions), 15-O3 (buy clothes), 16-O3 (give an opinion), 17-O3/O4 (application, interview), 18-O3 (travel situations), 19-O5 (directions beyond the preposition item). They are practised in the labs (listening, reading, speaking, writing), which have **no pass/fail assessment** ([DATA] speaking and writing are analysed, not graded).
* **[P] Consequence.** The unit test is a *grammar and vocabulary test with two reading items* (67 % grammar). That is acceptable if declared; it should not be presented as "the A2 unit assessment".
* **Recommendations:** (1) in 7C produce for each unit an **objective → assessment matrix** (exercise / final-test item / lab); (2) lower the grammar share where objectives are communicative (e.g. 8 grammar, 3 vocabulary, 2 reading, 2 listening or reading), subject to D-9; (3) every concept used in a *final-test* item must have a revision exercise (already planned); (4) the exercise types available (`fill`, `choice`, `order`, `article`) are form-focused; a matching or short-answer type would improve communicative practice but is a schema change outside this stage.
* **[DATA] template defect (B1)** — see §2.
* **Distractor quality.** The plan states the rule learned in Stage 7A (distractors must be real errors, never another correct answer). Add a test in 7C that flags a distractor that also passes as correct in the filled sentence only by human review — there is no mechanical check.

### F. Listening and reading assessment design

* **Lab questions.** [DATA] 4 questions per listening dialogue and 3 per reading text, three options, correct index validated; positions shuffled per attempt at runtime; the distribution test is skipped for fewer than 9 questions **per level** (so it works across A2 once enough units exist, not per unit).
* **Listening.** Assessed only in the lab; each unit's two dialogues use a mix of formal/informal registers (design §Cross-unit 4). Issues: (1) five of nine units contain a telephone call as a listening scenario (12 L1, 13 L1, 14 L1, 16 L2, 20 L1; plus the phone role-play in 15) — monotonous and, for A2, phone calls are among the hardest listening tasks (no visual support); [P] limit phone calls to three units and use face-to-face settings elsewhere; (2) every dialogue has two speakers — appropriate; (3) no *listening for specific information in announcements* (station, shop, loudspeaker) although this is a classic A2 task — add to unit 18 or 19.
* **Reading.** Good mix of non-continuous and continuous texts. Final-test reading items are limited to ≤ 45 words and 3-option multiple choice, which tests only local detail/inference; B1 correction required (translation leak). [P] Add one *true/false-style* or *matching* task in the labs when the schema allows it.
* **Fairness.** Ensure that a reading item's answer cannot be found by comparing options with the Russian/Kyrgyz text (B1), and that listening items do not display the transcript (D-9).

### G. RU / KY localization requirements and terminology risks

* **[DATA] volume.** Unit 11 has 272 Kyrgyz and a similar number of Russian fields; nine more units ≈ 2 450 Kyrgyz fields to be authored independently and **reviewed by native speakers**. Automated checks cover only presence, difference from Russian, placeholders and German-quote preservation; **language correctness is not checkable** ([DATA] validator rules).
* **Terminology risks (Kyrgyz and Russian).** grammar terms (open K8/K9/K12; plus case names, reflexive, adjective ending, comparative, imperative, modal, connector, indirect question); kinship (finer system); administrative concepts (*Anmeldung, Bürgeramt*); medical terms; address forms (*du/Sie* ↔ *сен/сиз*, *ты/вы*); loan words (media, technology) interacting with the *Kyrgyz = Russian* validator rule (allow-list for single words only).
* **Interference traps to be written into explanations from German first:** *wenn/als* (одно слово «когда»); verb–preposition government; adjective endings (Kyrgyz has none; Russian has endings but different); reflexivity expressed by suffixes in Kyrgyz; the *mir tut … weh* construction.
* **Process requirements:** (1) glossary + style guide approved first (D-10); (2) Kyrgyz and Russian authored separately — never translated from each other; (3) review in batches of 1–2 units; (4) every Kyrgyz string from this assistant remains "AI-assisted draft" until a human signs; (5) the loading UI strings added in Stage 7A.2 are also unreviewed.

### H. Missing everyday communication scenarios

[P] unless stated. Already identified in the design: emergency (D-8), banking beyond the cash machine, public-transport delays. **Additional gaps found in this audit:**
1. **Reporting a housing defect** to the landlord or caretaker (*Die Heizung ist kaputt*) — essential for unit 13; neither vocabulary nor task exists. Add *kaputt, die Reparatur melden* (or use unit 15's *Reparatur*).
2. **Small talk and weather as a social function** (greeting a neighbour, *Schönes Wetter heute!*): weather appears only in 18, but small talk is an A2 social task; place a short exchange in 12 or 13.
3. **Asking for repetition / clarification** (*Können Sie das bitte wiederholen? Was bedeutet …?*): A1 has *Wie bitte?* ([DATA] A1 vocabulary); add a short A2 set to unit 12 (spoken interaction) as a recurring strategy line.
4. **Apologising and thanking** in more situations (late arrival, mistakes): partly in 20; also relevant to 13 (noise) and 17 (late for work).
5. **Workplace communication** (calling in sick is in 14; arranging a meeting, leaving a message for a colleague): unit 17 covers interview/application, not daily workplace talk.
6. **School from the parent's perspective** (appointment with a teacher, a note to school) — adult learners often handle school matters for children; unit 17 only treats school as the learner's own.
7. **Public transport in daily life** (ticket machine, monthly pass, announcements) — only unit 18/19 partial.
8. **Online shopping / delivery** (*Lieferung* is receptive in 15).
Recommended action: place 1–3 inside existing units (13, 12, 12/13) at near-zero cost; decide on 5–8 at the first design review.

### I. Dependencies and unnecessary repetition

* **Dependencies verified as sound:** 12 (pronouns) → 15 (*mir*), 19, 20; 12 (reflexive) → 14 (imperative), 16, 19, 20; 13 (adjectives) → 15; 13 (Komparativ) → 16, 18; 14 (`wenn`) → 17, 19, 20; 14 (`dürfen`, imperative) → 19, 20; 16 (ordinals) → 18, 20.
* **Dependencies that remain implicit:** (1) dates in unit 13's viewing task before ordinals (unit 16) — use weekday + time from A1 only; (2) *Wohin/Wo* (A1 `wechsel`) in unit 13 requires A1 `wechsel` to be secure — placement items should check it; (3) unit 17 *deshalb* vs. *weil* assumes unit 11's *weil* + Perfekt, now reduced by F2 — fine; (4) the **unit 15 polite chunks need *mir* from unit 12** — keep that order.
* **Repetition to remove or manage:** (1) *Perfekt* is the ↻ item in units 12, 13 and (via Präteritum) 14 — enough; do not recycle it in every unit; (2) **writing task types**: 7 of 9 are e-mails or messages; vary with a form (19), a note, a postcard (18), a short biography (17), a review (16 already); (3) **telephone** scenarios (F); (4) **"formal service" register** dominates units 13–19 (six formal speaking tasks) — keep two informal speaking tasks between 15 and 19 (e.g. in 16 and 18).
* **Unnecessary repetition of grammar:** none found; the plan's repetitions are extensions (adjectives 13 → 15, Komparativ 13 → 16, `wenn` 14 → 17).

---

## 9. Consistency observations on the Stage 7B documents themselves

* [DATA] Counts agree across documents and the mechanical test passes (11 tests); no lemma is duplicated.
* [DATA] The grammar progression says verb + preposition "capped at six" but lists five; the design says "six fixed pairs" without naming them (D-7).
* [DATA] The report says final tests contain no listening item "as unit 11"; the design cross-review labels this a weak spot (D-9) — consistent.
* The vocabulary map contains no word for *kaputt*, *Polizei*, *Feuerwehr*, *etwas/nichts* (gaps in §5, H).
* The design specifies `min words` only for some tasks ("about 50+/60+/70+"): fix numbers in 7C.

## 10. Recommended next steps (not performed)

1. Decide D-1 … D-12 using the table in §3 (REVISE items need a short revision of the design documents under a separate approval).
2. Resolve **B1** (template defect) first — it affects Unit 11 and all designed units.
3. Obtain the Kyrgyz glossary/style guide review (B2) and the external Unit 11 reviews (B4), or accept pilot-only risk consciously.
4. Rebalance units 12–14 (§7) and reduce formal-writing load (§4).
5. Then start Stage 7C with **Unit 12 only**.

## 11. Sign-off

This audit has **no reviewer sign-off**. Reviewer name: ______ · qualification: ______ · date: ______ · outcome: ☐ approved ☐ changes requested ☐ rejected. (Left blank on purpose: no human has reviewed the audit or the curriculum.)
