# Checklist — Kyrgyz localization review (`ky-localization`)

For a **native Kyrgyz speaker** with editorial, translation or language-teaching competence. Package: `docs/review/a2/packages/unit-NN-ky-localization.md`; record: the `ky-localization` entry of `docs/review/a2/records/unit-NN.json`. Read `A2_REVIEWER_GUIDE.md` first. The software does not verify your identity or qualification; the name and qualification you enter are your own statement.

You see the German source next to each Kyrgyz text. **The Russian text is deliberately not shown**: judge the Kyrgyz on its own. All Kyrgyz in the course is an AI-assisted draft and has **never been reviewed by a native speaker** — please be critical. Open terminology questions are collected in `A2_KY_TERMINOLOGY_GLOSSARY.md` (§1–§13); read the section of your unit before you start. (This checklist is in English.)

## A. Correctness and faithfulness

- [ ] Every Kyrgyz text is correct (spelling, suffixes, vowel harmony, agreement, punctuation).
- [ ] The meaning matches the German source: no omissions, no added content, no wrong sense.
- [ ] Numbers, times, names, negations and speech acts (suggestion, refusal, request) are preserved.
- [ ] Letters and spelling follow the current Kyrgyz orthography (ү, ө, ң, etc.).

## B. Independence — this is not a Russian copy

- [ ] The text is **independently natural Kyrgyz**, not a transliterated or calqued Russian sentence.
- [ ] Where Russian would simply use a loan word, check whether the Kyrgyz word used is the natural choice (a loan word is acceptable only if it is genuinely what speakers say). Mark loan words you consider unnatural, and native descriptions you consider clumsy (see glossary §13.3, §11.3 and the equivalents of other units).
- [ ] No Kyrgyz field is merely the Russian text copied (the validator already blocks identical long texts, but a close paraphrase of Russian structure is yours to judge).
- [ ] Explanations make sense for a Kyrgyz speaker's own language experience (e.g. Kyrgyz has postpositions and case suffixes; there is no article and no grammatical gender; the question particle -бы works differently from German word order). They must not claim that a German rule follows from Kyrgyz suffixes.

## C. Naturalness and register

- [ ] Reads as natural Kyrgyz, not as a calque of German word order.
- [ ] Politeness and address are right: «сен» for *du*, «сиз» for *Sie* — consistently inside each text. Check formulas for invitations, refusals, requests and thanks: they must be idiomatic and polite in Kyrgyz, **not word for word** (see glossary §13.1).
- [ ] Tone toward the learner is friendly and neutral; gender-neutral wording where the German is neutral.

## D. Terminology and grammar explanations

- [ ] No grammar term is used as a label unless you confirm it is established (the course intentionally avoids unsettled terms; check the "disputed" list in the glossary).
- [ ] If you propose an established term, record it in a finding (`ref` of the row) so the glossary can be updated.
- [ ] The grammar explanation is correct and understandable in Kyrgyz.
- [ ] German examples quoted inside Kyrgyz explanations are identical to the German source.

## E. Vocabulary

- [ ] The gloss is the best Kyrgyz equivalent *for that meaning*; descriptive glosses (several words) are acceptable only when no single natural word exists — mark any that are too long.
- [ ] Administrative and cultural words (units 13–20) are described as **German** institutions, not as exact equivalents (*Bürgeramt*, *Anmeldung*, *Ausweis*, *Aufenthaltserlaubnis*, *Führerschein*, *Zoll* …).
- [ ] Example translations are natural, not word-for-word.
- [ ] Dates follow your decision: the course uses a **provisional** form (glossary §10.3, e.g. «12-майда»). State the correct form in a finding if it is wrong.

## F. Exercises, tests, instructions, writing, speaking

- [ ] Prompts state exactly what is asked and **do not give away** the answer.
- [ ] Translations of reading questions translate only the question, never the German passage.
- [ ] Learner instructions are clear and polite for all ten units.
- [ ] Writing tips, speaking goals and AI-turn translations are natural and do not contradict the German task.

## G. Consistency across the unit

- [ ] The same German term has the same Kyrgyz rendering everywhere in the unit.
- [ ] No leftover Russian words or phrases, except where you accept a loan word.

## Recording the result

1. One finding per problem, with the exact Ref and a severity; give the correct Kyrgyz wording when you can.
2. Set the status, name, qualification, date and the **package fingerprint you reviewed**; run `npm run review:validate`.
3. If you disagree with a glossary entry, say so in a finding on the first affected row; the authors will update the glossary.

Example finding: `{ "id": "F1", "ref": "a2-vorschlaege-verabredungen.example#3", "severity": "major", "comment": "The Kyrgyz sounds like a literal translation; natural wording: …", "status": "open" }`.
