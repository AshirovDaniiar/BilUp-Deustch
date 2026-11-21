# B1 P1 Remediation

B1 is still `planned`, `releasedLocales: []`, invisible. No commit/push. **P2 and P3 work has NOT been started. No release preparation was done.** No CEFR, native-speaker or exam-expert validation exists or is claimed; every changed German and Kyrgyz line is an unreviewed AI-assisted draft, and **no disputed grammar decision was approved by this work**.

## 0. How P1 was defined
As instructed, the original audit is the source of truth. `B1_FINAL_AUDIT.md` §9 lists **four P1 items** (the `level-b1` redesign of item 3 was done in the P0 phase):

| P1 item (audit §9) | Done in this phase |
|---|---|
| 1. Expert decisions D-1…D-9, D-11/12 and recording of reviews; **fix the D-1 mislabel; add flags for D-2/D-4/D-10…D-14** | the repair of the tracking (registry, flags, mislabel). The decisions themselves stay open — a person/expert must decide them |
| 2. Text calibration: clause density of the readings/listenings of Units 22–31 (texts only, scope guards kept) | targeted edits in 13 texts (8 readings, 5 listenings) + a regression floor |
| 3. `level-b1` redesign … **"add validator rules for its structure"** | the redesign was P0; the missing **validator rules** are added now |
| 4. Native review of all units, **glossary first** | the glossary and the consistency fixes. The native review itself cannot be done here |

The user brief's section C (vocabulary) and parts of section D (translation collisions) overlap with audit **P2 item 5** ("Vocabulary gaps … mark P/R status; verify KY glosses"). Following the instruction not to reclassify P2/P3 as P1, **no vocabulary entry was added, removed or reworded** (see §5); the findings were measured, recorded and routed to the owner. The Kyrgyz collisions were investigated and registered for native review (§6) because the glossary (P1.4) needs them.

## 1. P1 findings addressed
1. **Decision tracking incomplete and mislabelled** — D-2, D-4, D-10…D-14 raised no flag; the flag on `b1-lassen` said D-1 (the A2→B1 boundary).
2. **Mid-course dip in text complexity** — the audit's heuristic (sentence length, subordinators) was refined into a transparent *clause-linking index* (subordinators + relative clauses + connectors + zu-infinitive clauses per 100 words). It confirmed a real dip: readings of Units 24 (0.8), 25 (1.4, 2.8), 26 (2.7), 28 (3.2) and 31 (2.0, 2.6), and listenings of Units 24, 26, 27, 29, 31 (0.7–2.0) were below the level of Unit 21 (4.3–4.7 / 3.9–5.2).
3. **No validator rule for the level-assessment structure** (size, concept coverage, passage length, listening note).
4. **No RU/KY glossary; terminology drift** — main/subordinate clause in Kyrgyz written with two nouns; Russian/Kyrgyz *Passiv/Aktiv* and *Relativsatz* written in two ways; one invented Kyrgyz grammar label.

## 2. Files changed
**Created:** `scripts/content-validate/b1/decisions.ts` (register, 21 entries), `src/data/b1/glossary.ts` (glossary + Kyrgyz collision registers; data only, not in the lazy B1 chunk), `tests/b1/p1-remediation.test.ts` (27 tests), this report.
**Edited (validator/config):** `scripts/content-validate/rules/b1.ts` (`checkDecisions`, `checkLevelTest`), `scripts/content-validate/types.ts` and `bundle.ts` (carry `b1Decisions`, `b1LevelTest`), `scripts/content-validate/b1/curriculum.ts` (`lassen` flag D-1 → X-1).
**Edited (learner content, wording only):** `unit22/texts.ts`, `unit24/texts.ts`, `unit25/texts.ts`, `unit26/texts.ts`, `unit27/texts.ts`, `unit28/texts.ts`, `unit29/texts.ts`, `unit31/texts.ts` (clause linking); `unit23/grammar.ts`, `unit23/assessment.ts`, `unit24/grammar.ts`, `unit25/texts.ts`, `unit26/grammar.ts`, `unit28/assessment.ts`, `unit28/grammar.ts`, `unit32/grammar.ts`, `unit32/meta.ts`, `level-test.ts` (terminology).
**Edited (tests whose expectations encoded the old facts):** `unit-24`, `unit-26`, `unit-31` tests (changed sentences / the X-1 label), `b1-profile` and `b1-approval` tests (67 review flags; `X-` ids). Nothing was weakened: every changed expectation is stricter or equal, and new assertions were added (the list of the 14 register flags).
**Not touched:** A1/A2 learning content, Storage/Persistence, the release gate, the scoring configuration of `level-b1` (70/50/55, 60 items), the unit structure and all permanent ids, vocabulary lists, grammar allocation.

## 3. Learning-progression improvements
**Method (transparent, a heuristic — not a CEFR measure):** clause-linking index per 100 words = subordinating conjunctions (weil, dass, wenn, obwohl, bevor, nachdem, bis, …) + relative clauses + connectors (trotzdem, außerdem, erstens, je … desto, …) + zu-infinitive clauses. The edits **raise clause linking and keep the sentences short**; they do not just lengthen texts. Only constructions already taught by the unit were used (checked: no `damit` before Unit 30, no Plusquamperfekt before Unit 29; the validator's scope and receptive rules still report 0 errors / 0 warnings).

| Text | Index before → after | Edit (examples) |
|---|---|---|
| Reading 24-01 (Wohnungsanzeige/Hausordnung) | 0.8 → 3.6 | "Bevor Sie einziehen, wird die Wohnung frisch gestrichen"; "Wenn Sie die Wohnung sehen möchten, melden Sie sich …"; relative clause "…dem Hausmeister gemeldet, der kleine Schäden schnell repariert"; "…, weil sie für alle Mieter gelten" |
| Reading 25-01 / 25-02 | 2.8 → 3.9 / 1.4 → 3.7 | "…, weil sich der Körper nicht erholen kann"; "…, wenn es schon spät am Abend ist"; "…, weil sie dachte, dass ich komme"; "…, bis sie sich beruhigt hat" |
| Reading 26-01 | 2.7 → 3.8 | "…, obwohl die Bibliothek ein Jahr geschlossen war"; "…, bevor ich es glaube" |
| Reading 28-01 | 3.2 → 4.2 | "…, weil ich jeden Tag gesprochen habe"; relative clause "…ein Studium in Europa, das ich nach dem Kurs beginnen möchte" |
| Reading 31-01 / 31-02 | 2.6 → 4.1 / 2.0 → 3.6 | "…unvollständig, weil noch der Nachweis … fehlt"; "Sobald der Nachweis vorliegt, …"; "…, damit wir Ihren Antrag schnell finden"; "…, obwohl ich den Vertrag schon lange habe"; "…, weil ich sie nicht kannte" |
| Reading 22-01 | 3.0 → 3.0+ | one clause added ("…, wenn jemand Hilfe braucht") to meet the floor |
| Listening 24-01 | 1.5 → 2.9 | "Das ist mir wichtig, weil ich ein kleines Kind habe"; "…, bevor Sie einziehen" |
| Listening 26-01 | 1.6 → 3.3 | "…regnet es bei zwölf Grad, bis es am Abend wieder trocken wird"; "Wenn wir mehr wissen, …" |
| Listening 27-01 | 1.5 → 2.9 | "…, weil auf dem Gerät zwei Jahre Garantie sind"; "…, wenn mein Chef einverstanden ist" |
| Listening 29-01 | 2.0 → 2.6 | "Ich bin sehr müde, weil ich den ganzen Tag gefahren bin" |
| Listening 31-02 | 1.4 → 2.7 | "…, damit ich Ihre Daten prüfen kann"; "Leider nicht, weil er zu Hause liegt" |
**Every edited listening line got a new Russian and Kyrgyz translation** (line-level, written for the new sentence; Kyrgyz is an AI draft). The questions, answer keys, glosses and band lengths still hold (the Unit 24 listening was first 142 words, over its 140-word band, and was shortened by one removed clause).

**Regression floor (new tests):** every reading ≥ 3.0 and every reading of Units 24–31 ≥ 3.5 per 100 words; every listening ≥ 2.0; the mean of Units 28–31 is higher than that of Units 24–27; p95 sentence length ≤ 22 words per unit; no later-unit construction in the edited texts.
**Honest limits:** the course-wide trend is still *modest*: mean readings are 4.7 (Units 21–23), 3.9 (24–27), 4.8 (28–31); the mid-course dip is removed as a *floor*, not turned into a steep rise. Sentences remain short (means 6–11 words). Whether this matches an exam-format target is the open decision **D-11** (needs an independent expert). I did not touch Units 21, 23, 30 or 32 texts, the speaking scenarios or the writing tasks: the audit's other progression observations (listening plateau at 120–170 words, one speaking scenario per unit) were not classified P1.

## 4. Grammar-consistency corrections (decision tracking)
* **Register** `scripts/content-validate/b1/decisions.ts` lists D-1…D-14 and seven project-found items **X-1…X-7** (lassen placement; `zweitens` in the Unit-30 list; the overloaded `note` micro-task kind; the unauthored Widerspruch task; legal/administrative review of Unit 31; the `b1-level-v2` size/threshold deviation; the additive `levelTest` mechanism). Each has: affected units, what is implemented, the consequence, the fallback, **status** (`pending-expert`, `pending-owner` or `pending-owner-and-expert`), whether an independent German/CEFR expert is required, and whether a concept carries it.
* **Mislabel fixed:** the `b1-lassen` flag is now **X-1** (the dossier marks it ⚑ item 13 with no D-number); **D-1** is the course-level A2→B1 boundary and has its own register flag.
* **Validator** (`b1-decision-register`, errors): every D-1…D-14 registered; **no status may be `approved`** (only a person may approve, in the dossier); every concept review id is registered; `carriedByConcept` must match `curriculum.ts` exactly. (`curriculum-decision-open`, review flags): one flag per decision no concept carries → **14 new flags (D-1, D-2, D-4, D-10…D-14, X-2…X-7)**; total review flags **53 → 67**, errors 0, warnings 0. The rule skips partial bundles (< 12 specified units) so the existing synthetic-bundle tests are unaffected.
* **Owner-review status of every decision** (all unresolved; none approved or reclassified by me):
  *needs an independent German/CEFR expert:* D-1, D-2, D-3, D-4, D-5, D-6, D-7, D-8, D-9, D-11, D-12, X-1, X-2, X-4, X-5, X-6; *owner product decision:* D-10, D-13, D-14, X-3, X-7.
* **Cross-unit dependencies and `receptiveThrough`:** rechecked by scan — no unplanned early use of a later construction in Units 21–32 (the two by-design cases remain: `nachdem` + Perfekt in Unit 21 versus Plusquamperfekt in Unit 29 — recorded under D-6; receptive `sodass` in Unit 28 with `receptiveThrough: 29`). The metadata declares only two ranges (`statt … zu` through 26, `sodass` through 29); Passiv Perfekt, Partizip I and Konjunktiv II der Vergangenheit are declared receptive without a range. **No metadata or allocation was changed** — whether to add ranges is part of D-4/D-5.
* **Validator rules for `level-b1` structure** (`b1-level-test`, errors; the form's scoring is unchanged): definition size = number of items; unique ids; parts known; every choice item has 3 distinct options and exactly one correct; word-order tokens permute the answer; ≥ 3 word-order items; **every concept of the level is tagged**; **each reading passage ≥ 80 words**; a ru+ky listening note when there are no listening items; no exam-board/certificate/CEFR wording. Regression tests mutate the bundle to prove each rule fires.

## 5. Vocabulary (reviewed; nothing changed — audit P2.5)
* The audit listed words absent from the 1083-word A1–B1 **vocabulary lists**. Measured now in the B1 texts, vocabulary examples and grammar files: *Medien* (1 + "Medienthema"), *Grund* (18), *Gründe* (13), *Folge* (4), *Wunsch* (3), *Zukunft* (3), *Gefühl/Gefühle* (6) **do occur**, unglossed as headwords; so the learner meets them, but no unit teaches them as vocabulary. *Chance*, *Politik*, *Wahl*, *Gesetz*, *Regierung*, *Wirtschaft* were not found in these files (the law/politics group was excluded deliberately in the scope).
* **Recommendation to the owner (classification, not applied):** *essential for their unit topic* — **Medien** (Unit 26), **Zukunft** (Unit 28), **Grund / Folge / Ursache** (argumentation, Units 22/30), **Wunsch** (Unit 27), **Gefühl** (Units 21/25); *optional* — Chance, Interview, Bewertung, Absicht, Zweck; *deliberately out of scope* — Gesetz, Politik, Wahl, Regierung, Wirtschaft, Religion. Applying it means swapping low-value items of Unit 32 (largely metacognitive words) and updating the 480-word and per-unit counts in tests — a content decision for the owner. **No vocabulary entry was added, removed or reworded; no productive/receptive field was added** (no such field exists; that needs a shared-type decision).
* Revision vocabulary (the Wiederholungsblock and spaced revision) was preserved. No unnecessary duplication was found (no lemma repeats an earlier headword).

## 6. RU/KY glossary and terminology changes
**Glossary:** `src/data/b1/glossary.ts` — 12 term groups (Nebensatz, Hauptsatz, Relativsatz, Passiv, Aktiv, Zustands-/Vorgangspassiv, Partizip II, Konjunktiv II, the case names, the tense names, Satzklammer/Mittelfeld/TeKaMoLo, verb position). Each records the wording the course **already uses** (nothing invented), a note, `review: 'native-pending'`, and `uncertain: true` where the author is unsure (5 entries: the Kyrgyz *Nebensatz/Hauptsatz* nouns, *Partizip*, *Konjunktiv II*, the *Mittelfeld* paraphrase). Competing variants are encoded as `avoid…` patterns and enforced by a test.
**Standardisations (wording only, 39 mechanical replacements plus one manual fix):**
* Kyrgyz main/subordinate clause: the course had **"башкы бөлүк" 34 × next to "башкы сүйлөм" 20 ×** and "кошумча бөлүк" 54 × next to "кошумча сүйлөм" 11 × → both now use **бөлүк** (Units 25, 28, 32, level test and others, with correct case endings).
* Russian: "из актива в пассив" / "пассивным" → **Aktiv / Passiv** (Units 24, 26); "относительное предложение" → **Relativsatz** (Units 23, 32).
* Kyrgyz: **removed the invented label "кайтарым ат атооч"** from a Unit 23 explanation (kept the example "ich менен mich туура келет"); the other forbidden labels were already absent (test).
* Russian *придаточное предложение / придаточная часть* and *главная часть / главное предложение* both occur and were **not unified** (case-ending ambiguity makes a mechanical change unsafe); they are recorded as accepted synonyms for the native reviewer.
**Translation collisions (audit):** investigated one by one — **6 B1 Kyrgyz glosses equal the gloss of a different A1/A2 word**: Begegnung/sich treffen, zunächst/zuerst, Werbung/Anzeige, überprüfen/Untersuchung, Rabatt/Angebot, ersetzen/umtauschen; and 5 noun/verb pairs share a gloss. **None is a confirmed error on the B1 side** (the B1 glosses are defensible; for Werbung and Rabatt the doubtful gloss is the *A2* one — "Anzeige" = жарнама and "Angebot" = арзандатуу look wrong — and A2 content may not be touched). They are recorded in `KY_GLOSS_COLLISIONS_WITH_A2` / `KY_GLOSS_DERIVED_PAIRS` and **a test fails if the data changes**, forcing a new review. **No Kyrgyz vocabulary gloss was changed** (I will not guess a Kyrgyz word).

## 7. Items awaiting human review
1. **Independent German/CEFR expert:** all D-1…D-9, D-11, D-12, X-1, X-2, X-4, X-5, X-6 (§4); the clause-linking floors and the exam-format target (D-11); the 11 edited texts (are they natural and B1?).
2. **Owner:** D-10, D-13, D-14, X-3, X-7; the vocabulary classification of §5 (swap decisions); whether the new validator rules should become release-gate errors (they are authoring errors now; the release gate was **not** touched).
3. **Native Russian and Kyrgyz reviewers:** the glossary (5 uncertain entries), the standardised terms (is "бөлүк" right for a clause?), the 9 re-translated listening lines and every line changed in §6, the six/eleven collision cases (and the A2-side glosses of *Anzeige* and *Angebot*).
4. **Not done (P2/P3, by instruction):** vocabulary swaps, PWA-banner fix, unit-test option equalisation, device TTS and browser/screen-reader checks, learner pilot and calibration, mediation depth.

## 8. Tests and QA results
* **Full Vitest:** 108 files, **3293 tests, all passed** (was 3266); `tests/b1/p1-remediation.test.ts` adds 27 (decisions 6, progression 6, level-test structure 8, glossary/terminology 7).
* **TypeScript** clean · **lint** 0 errors, 8 baseline warnings · **format check** clean · **production build** succeeds.
* **`content:validate`:** 0 errors, 0 warnings, **67 review flags** (53 + 14 register flags). **`content:validate:release`:** **43 errors — unchanged** (22 `cefr-signoff-missing`, 20 `release-gate-review`, 1 A2 `unit-minimum`; the gate was not changed) and 24 review flags.
* `git diff --cached --shortstat`: **15 files, 513 insertions, 103 deletions — unchanged.**
* **Browser QA (real Chromium via Playwright, Vite dev server; B1 switched to Beta in the page only; the server was stopped afterwards).** All 8 edited readings and 5 edited listenings: ru 1280, ky 390, ru 390 and ky 1280 — the new sentence is present, no horizontal overflow, no console error. For the 5 listenings in **ru 1280 and ky 390** the full quiz was answered and the transcript showed the new German line **and its new Russian / Kyrgyz translation**. In the remaining combinations (ru 390, ky 1280) I verified the reading text and page load, **not** the listening transcript. Two first-load probes failed because the lazy chunk had not finished loading after 450 ms; they passed when rerun with a longer wait. At 390 px the PWA install banner again blocked the first click of the quiz until dismissed (the known P2 issue; not changed). **Not verified:** real speech output, other browsers, screen readers, the Kyrgyz quality.

## 9. P2/P3 confirmation
P2 and P3 were **not started**: no vocabulary change, no PWA-banner fix, no unit-test option equalisation, no device/browser verification beyond the Chromium checks above, no pilot, no listening items, no decision on D-13/D-14. No release preparation.

## 10. Confirmations
B1 `planned`, `releasedLocales: []`, B1 Beta not enabled; A1/A2 learning content, Storage/Persistence, the release gate and the 60-item `level-b1` scoring configuration unchanged; approved ids, unit structure and grammar allocations unchanged; the 15 staged files untouched; nothing reset, restored or unstaged; no commit or push; no official-exam, CEFR or native-speaker claim.
