# A2 Unit 11 — CEFR review report (for the human reviewer)

**Unit:** 11 · `a2-ueber-mich` · *Über mich und meine Erfahrungen* (pilot unit).
**Status of review:** **NOT reviewed by a person.** The content was drafted with AI assistance. `scripts/content-validate/reviews.ts` (`A2_REVIEWS`) is intentionally still empty: the assistant does not record sign-offs, and automated checks passing is not a CEFR review. Release validation therefore still fails for unit 11 (`cefr-signoff-missing`).

## 1. What the automated checks did and did not establish

| Check | Result |
| --- | --- |
| Declared level of every item agrees with the unit (A2) | pass (errors would fail the run) |
| Heuristic B1+ construction scan (Passiv, obwohl/damit/falls/nachdem/…, trotzdem, Relativsatz, Plusquamperfekt, Konjunktiv II der Vergangenheit, Genitiv, Futur II) | **0 hits** on all unit text |
| Sentence length (> 22 words) / text length | 0 flags; longest sentence 15 words; readings 92 and 71 words; dialogues 96 and 124 words |
| Lexical level | **not checked by any program** — the repository has no authoritative word list; every vocabulary decision below needs a person |

0 hits only means the heuristics found nothing; they cannot see register, vocabulary, idiom or pragmatics.

## 2. Grammar load of the unit (what a learner must control)

| Concept | A2 status | Note for the reviewer |
| --- | --- | --- |
| Perfekt with haben / sein, regular and irregular Partizip II, separable verbs (abgeschlossen, umgezogen), no *ge-* after be-/ent-/er-/ver-/-ieren | core A2 | A1 unit 8 introduced Perfekt in a basic form; unit 11 deepens it, it does not repeat it. |
| `seit` + Dativ + Präsens, `vor` + Dativ (time) | A2 | `seit` vs. Perfekt is a classic A2 contrast. |
| Präteritum of sein, haben and modal verbs (war, hatte, konnte, wollte, musste) | core A2 | Other verbs stay in Perfekt. |
| Sequence adverbs (zuerst, dann, danach, später, schließlich) with verb in position 2 | core A2 | — |
| `weil` clauses | core A2 | — |
| `dass` clauses (after glauben, wissen, finden, stolz sein) | **A2/B1 borderline** | Many curricula introduce `dass` late in A2; some place it in B1. See flag F1. |

## 3. CEFR flags for human decision

Severity: **H** = would change content if the reviewer disagrees, **M** = likely fine but should be confirmed, **L** = noted.

| # | Sev | Where | Question for the reviewer |
| --- | --- | --- | --- |
| F1 | H | Concept `a2-ereignisse-verbinden`; ex-11-08; ft-11-09; reading 2; listening 2; speaking turn 4 | Is `dass` acceptable as *taught* A2 grammar for this curriculum? If not: remove `dass` from the concept, ex-11-08 and ft-11-09 (replace with `weil`/`denn` items) and rewrite the three text sentences that use it. |
| F2 | H | `weil`/`dass` clauses with **Perfekt at the end** ("…, weil ich Arbeit gefunden habe", "…, dass ich die Prüfung bestanden habe"), ex-11-06, ft-11-08/09, readings 1–2, listening 1–2 | Verb-final Perfekt in a subordinate clause is the heaviest construction in the unit. Reading 2, last sentence ("…, dass dieses Praktikum mein Leben verändert hat, weil ich dort mutiger geworden bin.") stacks `dass` + `weil` + two Perfekt forms and is the most likely candidate to simplify. |
| F3 | M | Reflexive verbs in Perfekt: *sich entscheiden* ("habe mich entschieden"), *sich verändern* ("hat sich verändert") | Confirm reflexive Perfekt is expected at A2. |
| F4 | M | Vocabulary that may be above core A2: *der Abschluss*, *die Veränderung*, *sich verändern*, *sich entscheiden*, *erreichen*, *das Erlebnis*, *die Heimat*, *schaffen* (in the sense "manage"), *schließlich*, *damals*; context nouns *Elektriker, Techniker, Reiseleiterin, Wirtschaft* | Keep, gloss only, or replace? Placement of each word on the A2 list needs a person. |
| F5 | M | `ft-11-05`, `ft-11-06`, `ex-11-04` and the explanations name **Konjunktiv II** forms (*wäre*, *könnte*, *müssten*) as distractors / contrast | Konjunktiv II is not taught in A2. The forms appear only as wrong options, and the explanations mention the term once to say "that is a different form". Confirm this does not confuse A2 learners or remove the distractors. |
| F6 | M | Tutor-style register: *du* forms in the speaking scenario ("Erzähl mal…"), *Sie* forms in the interview (listening 2) | Mixed register is deliberate (peer chat vs. interview). Confirm it is appropriate and consistently signalled. |
| F7 | L | *seit*, *vor zwei Jahren*, *schon einmal*, *noch nie* | Standard A2 time expressions; confirm they are in the intended inventory. |
| F8 | L | `a2-ft-11-04`: *Pizza mit Ananas* | Culturally neutral but trivial; replace if the reviewer wants a topic closer to the unit. |
| F9 | L | Reading texts use years (2018, 2022, 2023) | They will age; consider relative time expressions at review. |

Decisions already taken during authoring to **reduce** CEFR risk (so the reviewer does not need to re-find them): the pronominal adverb *worauf* and the connectors *seitdem* / *deshalb* were removed; *Passiv* (*wurde … geboren*) was avoided by using *ich bin … geboren*; *als* (temporal) and *obwohl/damit/nachdem* were not taught; Plusquamperfekt forms (*war … gezogen*) were removed as final-test distractors because they are grammatical and made an item ambiguous.

## 4. Russian and Kyrgyz — what needs a native review

Both explanation languages are fully authored (no fallback, no copying; the validator and 40 tests check presence, difference and German-quote preservation). **Correctness of the language itself is not checkable by a program.**

* **Kyrgyz is an AI-assisted first draft.** Every Kyrgyz string (vocabulary glosses, example translations, all explanations, dialogues, instructions, answers' explanations) needs a native-speaker review before release.
* Terminology used consistently in this unit — confirm or replace: *Perfekt* / *Präteritum* / *Partizip II* (kept as Latin terms) · өткөн чак (past tense) · жардамчы этиш (auxiliary verb) · кыймыл-аракет этиши (motion verb) · модалдык этиш (modal verb) · байламта (conjunction) · баш сүйлөм / ээрчимелүү сүйлөм (main / subordinate clause) · бөлүм (unit; matches the existing Kyrgyz UI word) · сынак (exam) · практика (Praktikum; Russian side: стажировка).
* Phrases of particular doubt: *туулган болуу* (geboren sein; a more natural everyday form may be preferred), *уяң* (schüchtern), *сыймыктанган* (stolz), *башынан өткөргөн окуя* (Erlebnis), *али* used for "ещё/noch" after an earlier slip (*дагы*) was corrected, *ээрчимелүү сүйлөм* vs. other textbook terms.
* Russian: no concern is known, but the same review applies (e.g. «Perfekt: что я пережил и сделал» as a concept title, «ещё» vs. «уже» in the examples).

## 5. Provenance

All grammar concepts, dialogues, readings, the speaking scenario and the writing task are **original authored material** (`source.kind: 'authored'`). No external text, textbook, word list, audio or citation was used, and none is claimed. The `author` string states that the text was drafted with AI assistance and awaits human review. Names (Aigerim, Jonas, Nurlan, Tomás, Frau Keller) are invented; place names are real; no real person is described.

## 6. How to record the review

When a person has reviewed the unit, they add (and only they):

```ts
// scripts/content-validate/reviews.ts
export const A2_REVIEWS = { 11: { cefr: true, ru: true, ky: true, reviewer: '<name>', date: '<yyyy-mm-dd>' } }
```

Then `npm run content:validate:release` no longer reports `cefr-signoff-missing` for unit 11 (it will still fail for units 12–20 until they exist).
