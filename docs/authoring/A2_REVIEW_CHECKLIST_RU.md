# Checklist — Russian localization review (`ru-localization`)

For a **native Russian speaker** with editorial, translation or language-teaching competence. Package: `docs/review/a2/packages/unit-NN-ru-localization.md`; record: the `ru-localization` entry of `docs/review/a2/records/unit-NN.json`. Read `A2_REVIEWER_GUIDE.md` first. The software does not verify your identity or qualification; the name and qualification you enter are your own statement.

You see the German source next to each Russian text. You do **not** see Kyrgyz; the Kyrgyz review is separate and independent. (This checklist is in English; example Russian forms are quoted only where useful.)

The Russian text is read by Russian-speaking adults learning German. It is **not** a word-for-word translation exercise: it must be correct and natural Russian that explains the German.

## A. Correctness and faithfulness

- [ ] Every Russian text is grammatically correct (spelling, cases, agreement, punctuation).
- [ ] Meaning matches the German source (no omissions, no added content, no wrong sense). For glosses: the sense fits the *example sentence* in the same unit.
- [ ] Numbers, times, dates, names, prices, and negations are identical in meaning to the German.
- [ ] Translations of dialogue lines are correct **speech acts** (a suggestion stays a suggestion, a refusal stays polite).

## B. Naturalness and register

- [ ] Reads as natural Russian, not as a calque of German word order or idiom.
- [ ] Register matches the German: «ты» for *du*, «вы» for *Sie* — consistently inside each text and explanation.
- [ ] Politeness formulas are idiomatic (e.g. refusals, invitations, requests), not literal.
- [ ] Tone toward the learner is clear, friendly and neutral; gender-neutral where the German is neutral.

## C. Terminology and explanations (Grammar, "Why?" notes, exercise and test explanations)

- [ ] Grammar terms are the ones Russian teaching practice uses (падеж, спряжение, придаточное предложение, …) and are used consistently across the unit and the course.
- [ ] The explanations are correct as grammar: the rule stated is true, and the examples quoted illustrate it.
- [ ] Explanations never rely on a Kyrgyz idea or a Kyrgyz parallel (they are for Russian speakers).
- [ ] German examples quoted inside Russian explanations are identical to the German source (no changed spelling).

## D. Vocabulary

- [ ] The gloss is the best Russian equivalent *for that meaning*; multiple senses are separated sensibly.
- [ ] Nouns: gender/number of the Russian side is not misleading; verbs: aspect is sensible (imperfective / perfective where it matters).
- [ ] Administrative words (units 13–20: *Anmeldung*, *Bürgeramt*, *Aufenthaltserlaubnis*, …) are described as **German** institutions, not claimed to be exact equivalents.
- [ ] Example translations are natural, not word-for-word.

## E. Exercises, tests, instructions, writing, speaking

- [ ] Exercise and test prompts in Russian state exactly what is asked and **do not give away** the answer.
- [ ] Reading questions' translations translate only the question, never the German passage.
- [ ] Learner instructions ("Learner instructions" section) are clear, polite and consistent for all ten units.
- [ ] Writing tips and the speaking goal are clear and do not contradict the German task.

## F. Consistency across the unit

- [ ] The same German term has the same Russian rendering everywhere in the unit.
- [ ] No leftover German or English in the Russian text except the German quoted on purpose.

## Recording the result

1. One finding per problem, with the exact Ref (`v20-5.word`, `a2-ex-20-03.why`, …), a severity and, if possible, your correction.
2. Set the status, name, qualification, date and the **package fingerprint you reviewed**; run `npm run review:validate`.
3. A change in the German source also changes your fingerprint: you will be asked to re-review the affected rows.

Example finding: `{ "id": "F1", "ref": "a2-li-20-02#4", "severity": "major", "comment": "«Я не хочу отклонять приглашение» is stiff; natural: «Не хочу отказываться от приглашения».", "status": "open" }`.
