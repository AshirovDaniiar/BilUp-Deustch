# A2 plan — Stage 4: answer-position randomisation (decision D-4)

The order of the answer options of **listening and reading** questions is now randomised per attempt, for A1 and for every future level. This is an **approved, intentional A1-visible change**. Everything else about A1 is unchanged. Earlier stages: [0](A2_STAGE0_BASELINE.md), [1](A2_STAGE1_CATALOG.md), [2](A2_STAGE2_MIGRATION.md), [3](A2_STAGE3_LEVEL_SCOPING.md).

## 1. Why
The authored answers are strongly position-biased, so a learner could guess by position:

| Skill | Authored position of the correct option (1st / 2nd / 3rd) | After randomisation (2 000 attempts per question) |
| --- | --- | --- |
| Listening (35 questions) | 17 / 17 / 1 = 48.6 % / 48.6 % / **2.9 %** | 33.4 % / 33.2 % / 33.3 % |
| Reading (18 questions) | 14 / 4 / 0 = **77.8 %** / 22.2 % / 0 % | 33.7 % / 33.5 % / 32.8 % |

## 2. Algorithm and seed strategy
`src/features/tests/answerOrder.ts`: `attemptOptions(options, attemptSeed, questionId)` = Fisher–Yates shuffle (`utils/random.shuffle`) driven by a PRNG seeded with `options|<attemptSeed>|<questionId>`.

* **Pure function of its inputs.** No render-time randomness, nothing stored.
* **One stream per question.** A question's order depends only on `(attemptSeed, questionId)` — never on the number of questions or on any other random draw of the surrounding builder. This is why the A1 seeded tests and daily keep their exact picks (the seed for a built test is drawn *after* the picks).
* **Attempt seed** (`utils/random.newSeed`, 64 bits from the generator):
  * Listening Lab and Reading view: a `useState` seed created when the screen mounts and renewed by **Retry** (a new attempt);
  * a built test (`buildTest`): one seed per build; `QuizPage` rebuilds on retry, so a retry is a new attempt;
  * the daily challenge: `daily-<date>` — the same for every learner on a date, stable, no random draw.

## 3. Stability within an attempt
The question list is created once per attempt (`useMemo` on `[exercise, attemptSeed]` / `useState` in `QuizPage`) and handed to `QuizRunner`, which only reads `q.options`. Even if the list were rebuilt (StrictMode, re-render, remount) the same seed gives the same order. Only an explicit new attempt (Retry, a new visit, a new built test) changes the seed.

## 4. Correctness and compatibility
* The permutation is of option **texts**. `answer` is the correct option's text and the runner compares text (`normalize(opt) === normalize(q.answer)`); results record the question id (`q:<id>`) and text outcomes — **no option index is stored anywhere** — so scoring, completion, XP, mistakes, review, feedback and saved results are unaffected, and no migration is needed.
* Authored data is never modified (a test freezes the sources); the question text, prompt, answer, explanation, audio, skill, kind and ids are unchanged; the option *set* is identical.
* Reading questions were built inline in `ReadingView`; that mapping moved verbatim into `readingQuestions()` (same ids, `why`, `skill`, `kind`) so it can be tested.

## 5. Level isolation
The functions operate on the exercise or text they are given (already taken from its own level's catalog) — there is no pool. The builders still draw from `listeningOf(level)`; an A2 test or daily for an empty/planned A2 is empty/`null`. A2 remains planned, empty and invisible.

## 6. Tests (all deterministic: fixed seeds, no dependence on chance)
`tests/answer-order.test.ts` (27) and `tests/answer-order-ui.test.tsx` (3), for listening **and** reading through the same parametrised checks:
* permutation (each original option exactly once), answer text preserved, all other fields equal to the **pinned pre-change contract** of every A1 listening exercise and reading text; sources can be frozen;
* stable per seed; independent of other questions; different across attempts (every question shows >1 order over 60 fixed seeds);
* no bias: pooled positions within 3 points of uniform and each single question within 8 points over 600 fixed seeds, every question reaches every position; the authored bias is asserted too (documents why);
* builders: a built test is reproducible under a seeded generator and differs between builds *for the same questions*; the daily order is a function of the date;
* level isolation with fake A2 exercises; degenerate inputs (no questions, no options, one option);
* real screens (`ReadingView`, `ListeningPlayer`) and the real `QuizRunner`: order kept through re-renders and other interaction, renewed by Retry, a correct answer is accepted by text (also when it is **last**, a position the authored data almost never used), a wrong one is recorded with the right question id.

Mutation-checked (all caught, all restored): no shuffle; render-time randomness; ignoring the attempt seed; reading answer from the wrong position; reading Retry not starting a new attempt; listening memo ignoring the seed; daily not date-deterministic; in-place mutation of authored options; one fixed seed per built test.

## 7. A1 regression results and the intentional differences
Stage 0 baselines were **not** silently edited. Because the daily hash included the listening option order — my Stage 0 note ("already neutral") was incomplete for the daily — the snapshot now normalises the option order of `lq-`/`rq-` questions everywhere, and I captured the updated baseline on the **unchanged Stage 3 code first**, then proved the diff against the Stage 0 baselines:

* `a1-content-hashes.json`, `a1-selectors.json`: byte-identical;
* `a1-behaviour.json`: changed only in the four daily hashes whose listening options were not already in sorted order (2026-02-14, 2026-03-31, 2026-11-16, 2027-01-01) — now order-insensitive — and two **new** key sets that pin every one of the 21 A1 listening exercises and 10 reading texts (ids, prompts, answers, audio, explanations, option sets). Progress, tests, unit reviews, concept questions and tutor transcripts: identical.

So the intentional A1 differences are exactly: **(a)** the order of options of listening and reading questions varies per attempt; **(b)** consequently the daily challenge's listening question shows a date-determined shuffled order. Nothing else changed. Existing tests (all 773 originals + Stage 0–3) pass unmodified.

## 8. Verification

| Check | Result |
| --- | --- |
| typecheck / lint | pass / 0 errors, 8 pre-existing warnings |
| tests | **40 files, 894 tests pass** (was 38 / 864: +30) |
| content:validate | 0 errors (same INFO) |
| boundaries | same 5 pre-existing violations, 0 cycles |
| format:check | 15 pre-existing flagged files; none from Stages 0–4 |
| build | pass; main JS 556.4 → **560.1 kB raw (+3.7 kB, +0.7 % cumulative; +0.3 kB for Stage 4)**, gzip 177.2 → 177.5 kB |
| browser | reading `re01`: 5 distinct orders over 6 visits; listening `li01`: 3 over 6; order stable across word taps; the correct choice is marked right by text; listening test, daily, labs: no console errors |

## 9. Not changed (explicit exclusions)
No progress, storage or Daily Challenge storage-key change; no tutor migration; no A2 content; no UI redesign. The validator's answer-position distribution rule (authoring-time check for A2) belongs to the validator stage.

## 10. Next
Stage 5: level-driven navigation and dashboard (level chips, labs scoped by unit level — D-1, Home), still with A2 hidden until released.

Stage 5 (level-driven navigation, dashboard and labs) is documented in [A2_STAGE5_NAVIGATION.md](A2_STAGE5_NAVIGATION.md).
