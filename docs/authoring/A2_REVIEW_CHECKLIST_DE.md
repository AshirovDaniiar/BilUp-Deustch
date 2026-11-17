# Checklist — German / CEFR A2 review (`de-cefr`)

For a **qualified German teacher or examiner** experienced with CEFR A2. Package: `docs/review/a2/packages/unit-NN-de-cefr.md`; record: the `de-cefr` entry of `docs/review/a2/records/unit-NN.json`. Read `A2_REVIEWER_GUIDE.md` first. The software does not verify your identity or qualification; the name and qualification you enter are your own statement.

You see German only. Russian and Kyrgyz are reviewed separately; do not judge them here.

## Context to keep in mind (for every unit)

* Learners are adults who finished A1 of this course (A1 content: Perfekt basics, `und/aber/oder/denn/weil`, modals, Akkusativ/Dativ, W-questions, separable verbs, time and dates).
* A2 sequence: unit 11 Perfekt+/Präteritum of *sein/haben*/modals; 12 pronouns, Dativ verbs, reflexives; 13 adjective endings after article-words, comparison; 14 Imperativ, *sollen/dürfen*, *wenn*; 15 polite requests, quantities; 16 preferences, verb + preposition, ordinal dates; 17 *deshalb*, *wenn/als*; 18 destination prepositions, future with Präsens; 19 *man*, indirect questions (two frames), route prepositions; 20 suggestions (*Wie wäre es mit …?* only as a fixed chunk), *vorhaben*, connectors review. The design documents are `A2_STAGE7B_*` and `A2_UNIT<NN>_DESIGN_NOTES.md`.
* *Recognition* (receptive) words may appear in texts and answer options but must never be required in a gap, a speaking hint or a writing requirement.

## A. Vocabulary (section "Vocabulary")

- [ ] Each word is A2-appropriate (not A1-trivial in a misleading way, not B1+). Mark rows that are too high / too low.
- [ ] Articles and plurals are correct and in the right form (`Facts` shows pos / active / recognition).
- [ ] Each example sentence is correct, natural, and A2 in structure and length; it contains the word (or a form of it).
- [ ] No example uses structures the unit has not taught (see context above).
- [ ] The recognition / active split is sensible.

## B. Grammar (section "Grammar")

- [ ] The rule sentences and examples are correct German.
- [ ] The scope is A2: no B1 grammar presented as required (e.g. Konjunktiv II as a form, Relativsatz, Passiv).
- [ ] Each "mistake" (✘ → ✔) is a realistic learner error, and the ✔ form is correct; the ✘ form is clearly wrong.
- [ ] Dialogue lines and "real-life" sentences are natural, A2 and consistent in register (du / Sie).
- [ ] The speaking prompt's sample sentence is correct.

## C. Listening scripts

- [ ] Natural spoken German; plausible situation; consistent register (du or Sie, not mixed).
- [ ] Sentence length and density are A2 (short turns, familiar topics).
- [ ] The questions test understanding of the script; exactly one answer ✔ is clearly correct; distractors are plausible but wrong.

## D. Reading texts

- [ ] Text type is authentic for A2 (message, notice, form, e-mail, short story) and about the stated length.
- [ ] Vocabulary and grammar are A2 or glossed; no hidden B1 constructions (long nested sentences, Relativsätze, Passiv).
- [ ] Questions can be answered **from the text** and do not reveal the answer in their wording; exactly one correct option.
- [ ] Final-test reading items: the German passage appears in the question; questions are fair.

## E. Speaking scenarios

- [ ] Each AI turn is natural and A2; the learner can answer with the hints and the unit's language.
- [ ] Hints are correct German; keywords are realistic and not recognition-only words.

## F. Writing tasks

- [ ] The task is achievable at A2 in the stated word count; the required elements are sensible.
- [ ] The **model answer** is correct, natural, A2, and satisfies every required element.
- [ ] Register (formal / informal) matches the task.

## G. Revision exercises (8) and final test (15)

- [ ] Each item has exactly one correct answer (the ✔ option); the other options are wrong for a clear reason.
- [ ] Gap sentences are natural German; no item is ambiguous or has two defensible answers.
- [ ] Order exercises have exactly one acceptable word order.
- [ ] Items test what the unit teaches and nothing later; the final test does not simply repeat the exercises.
- [ ] Difficulty is A2 (not trivial, not B1).

## H. Whole unit

- [ ] The unit as a whole is a coherent, realistic A2 step; the load of new grammar is manageable.
- [ ] Nothing is culturally inappropriate or misleading (administrative content is language practice, not legal advice).

## Recording the result

1. Write a finding (`F1`, `F2`, …) per problem, with the exact Ref and a severity (`blocker` / `major` / `minor` / `suggestion`).
2. Set the record status (`in_review` → `changes_requested` or `approved`), fill name, qualification, date and the **package fingerprint you reviewed**.
3. Run `npm run review:validate`.

Examples of findings: `{ "id": "F1", "ref": "a2-ft-20-05.prompt", "severity": "major", "comment": "Two options are defensible: 'denn' and 'weil' … change the distractor.", "status": "open" }`; `{ "id": "F2", "ref": "v19-14.example", "severity": "minor", "comment": "Too long for A2; suggest a shorter sentence.", "status": "open" }`.
