# A2 Stage 9B — assessment prerequisites

Implements the six technical prerequisites found in Stage 9A. **No A2 assessment content was authored** (no 40-question Level Test, no 24-question Placement Test), no XP was connected, A2 stays `planned` and invisible, release validation and review approvals are untouched, nothing is committed.

## 1. Approved decisions (recorded)

Reuse authored A2 final-test questions for the first Level Test · listening included, **subject to technical verification** (see §7: not satisfied yet) · Level Test pass = 70 % overall and ≥ 40 % in every part · Level Test and Placement Test award **no XP** · Placement Test outcomes: A1 secure / A2 ready / insufficient evidence; thresholds provisional until a learner pilot · assessment results stored with **optional fields and protected retention**. This stage implements none of the scoring/outcome rules (they belong to the test stages); the XP decision means the future tests must not use the `assessment` XP path — noted for Stage 9C.

## 2. Task 1 — A2 unit tests use the authored 15 questions

* `buildTest` (`src/features/tests/questions.ts`): a `topic` test whose unit has an authored final test (`finalTestOfUnit`) is built by the new `finalTestQuestions` — the authored questions **in authored order** (so the balanced answer positions and the reading/vocabulary/grammar mix are kept), texts and answers exactly as authored, **option order randomised per attempt** (the existing `attemptOptions` rule), `___` prompts rendered as `fill`, reading items keep their German passage in the prompt, skills mapped (reading counts as a grammar-kind mistake like the lab reading questions). A unit without an authored final test (all of A1) keeps `unitReviewQuestions` — **A1 output unchanged**.
* Tests: units 11–20 each build exactly their 15 authored questions (ids, prompts, answers, option sets), the old random draw is gone for A2, per-attempt option order varies without modifying the authored data, A1 `unit-1` is unchanged.

## 3. Task 2 — direct A2 test links

Cause (Stage 9A): `levelOfRoute` resolved `/practice/tests/:id` through `testIndex`, which holds no A2 tests before the chunk is loaded. Fix: `levelOfTestId` (`src/app/routeAccess.ts`) resolves `unit-N` through the unit range, `level-a2` and `placement-a2` as A2, every other id through the catalog as before. `levelsToLoad` therefore requests the A2 chunk for `/practice/tests/unit-12` **when A2 is available to the learner's language**, and for no one while A2 is `planned` (tested: returns `[]`). Unknown ids (`unit-21`, `nope`) resolve to nothing. The `TestRunnerPage` is only rendered after the chunk is loaded (existing `App` gating), so `testIndex.get(id)` succeeds.

## 4. Task 3 — Kyrgyz prompts and explanations

* `Question` gets `promptKy` and `strict`. A **strict** question (every authored A2 item: final tests and A2 revision exercises) shows its hint and explanation **only in the learner's own language** (`trStrict`: a Kyrgyz learner never sees the Russian text, and the German interface sees neither); legacy questions keep the Russian hint and `tr()` explanation exactly as before.
* `QuizRunner` renders the language-appropriate hint and explanation; `fromExercise` marks A2 exercises strict and carries `promptKy`; `finalTestQuestions` carries both languages.
* New UI string `audioUnavailable` in ru / ky / de (key baseline 283 → 284 recorded in `tests/i18n.test.ts`). **The Kyrgyz string is an unreviewed AI draft** (to be added to the Kyrgyz review list; see §8).
* Tests: Kyrgyz learner sees Kyrgyz and no Russian, Russian learner no Kyrgyz, a missing Kyrgyz text is **not** replaced by Russian, the German interface shows neither, A1 legacy questions unchanged, all 150 authored finals carry both languages.

## 5. Task 4 — protected retention (optional fields)

The existing architecture supports it safely, with one wrinkle handled: the validator rebuilt every stored test record field by field and would have discarded new fields.

* `UserProgress.tests` is now `TestResult[]` with the original five fields and **optional** `kind`, `parts` (`[correct,total]` per part), `outcome`, `blueprint` (`src/data/types.ts`). No existing record changes; no storage version or migration was needed.
* `sanitizeTests` keeps valid optional fields and drops invalid ones **without dropping the result**.
* `capTests` (`src/storage/validate.ts`) is used in three places — validation, cross-device merge (`merge.ts`) and `addTest` (`store.tsx`, previously `slice(-50)`): ordinary results keep the last 50 (**unchanged**); results of placement and level tests (by `kind`, or by the fixed ids `placement`, `level-*`, `placement-*`) are not counted against that cap and the last **10 per id** are kept. With ≤ 50 results nothing is removed, exactly as before. Chronological order is preserved.
* Tests: no change under the cap; 200 later ordinary results never evict placement / level results; bounded to 10 per protected id; recognition by kind or id; optional fields survive/are dropped; a merge with 60 ordinary results from another device keeps the protected result.
* **Note on A1:** the A1 ids `placement` and `level-a1` are protected too (the task asks for all placement / level results); their *scoring and display* are unchanged.
* `kind` is not written by the current UI (`TestRunnerPage` still stores the original five fields) — the fixed-id rule already protects; the fields are for the Level/Placement stages.

## 6. Task 5 — A1 placement no longer claims A2

The A1 placement result names A2 only if **A2 is available to the learner and a placement test `placement-a2` exists** (`PracticeScreens.tsx`). Today none exists, so the labels are the A1-only wording ("A1 · start", "A1", "A1 ✓") even when A2 is visible. Scoring (`placementBand`) and the A1 question selection are untouched. The previous test that asserted the claim was updated; a new test shows the original wording returns once a `placement-a2` definition exists.

## 7. Task 6 — German TTS verification

### What was changed (`src/services/speech.ts`, `src/components/SpeakButton.tsx`, `QuizRunner`)

| Aspect | Before | Now |
| --- | --- | --- |
| Voice selection | first `de-DE`, else any `de*` (`startsWith('de')` also matched e.g. other codes) | scored: `de-DE` > other German; on-device > network; Android `de_DE` understood; non-German `de…` codes rejected |
| Availability | none (a button silently missing; a device without a German voice would read German with another voice) | `germanVoiceStatus()` = unsupported / unknown (voices not listed yet) / missing / available; `audioAvailable()` |
| Long dialogues | one utterance for a whole dialogue (`lq` audio = all lines): Chrome cuts long utterances (≈ 15 s) | text is split at sentence ends into ≤ 160-character chunks played as a queue |
| Overlap | `cancel()` made the old utterance fire `onerror → onEnd`, which let a running **sequence continue under a new playback** | one active session; a new playback or `stopSpeaking` interrupts it synchronously; late events of cancelled utterances are ignored; a sequence ends (calls `onDone`) when another playback takes over |
| Controls | one button (restart on click) | click = play, click while playing = **stop** (`aria-pressed`, label "Stop"), click after the end = **repeat**; playback stops when the button leaves the screen (next question) |
| Fallback | no speech: no button, listening question unanswerable | no speech or no German voice: a notice and the **transcript** are shown for listening questions; voices "unknown" is treated as available |

### Verified automatically (18 tests, fake engine)

Voice selection and status; chunking (limits, lossless); queue playback; no overlap and ignored late events; stop; sequence behaviour; unsupported speech (no throw); button play / stop / repeat / unmount cleanup / one playback at a time; listening fallback (no speech, no German voice, German voice, voices not listed, non-listening question unaffected).

### NOT verified — honest limit
A fake engine proves our logic, **not** the behaviour of real engines. **No real mobile device or browser was available**, so mobile compatibility is **not verified**. Known engine behaviours that could still break playback and must be checked on devices: iOS Safari (voice list appears late; speech must start from a tap; `cancel()` immediately before `speak()` can drop the new utterance), Android Chrome (`de_DE` locale, network-voice latency, cut-off of long text, no voice installed), desktop Chrome/Firefox/Edge (voice availability differs by OS), Samsung Internet. Manual checklist before the listening part ships:

1. iOS Safari (current and one older version), Android Chrome, Samsung Internet, desktop Chrome / Edge / Firefox.
2. German voice present? Is it selected (de-DE)? Is the speed 0.95 understandable?
3. Play a 100–150-word dialogue to the end (chunk transitions, no cut-off).
4. Play → Stop → Repeat; tap another button during playback; move to the next question during playback.
5. Device with no German voice: notice and transcript appear.
6. Airplane-mode behaviour (network voices).

**Consequence for the approved decision:** the condition "include listening subject to technical verification" is **not yet satisfied**; the code supports gating the listening part on `audioAvailable()`, and a result of the manual checklist is required before the first Level Test version declares a listening part. If devices fail the checklist, the Stage 9A fallback (a reading-based first version) applies.

## 8. Results

| Check | Result |
| --- | --- |
| New tests | `tests/assessment/prerequisites.test.tsx` (31), `tests/assessment/speech.test.tsx` (18), placement-label test updated (+1) |
| Full suite | **73 files, 2063 tests pass** |
| A1 regression set (regression, progress, navigation, PWA, data) | 25 files, 413 tests pass |
| `tsc` | clean |
| ESLint | 0 errors, the same 8 pre-existing warnings |
| Content validation | 0 errors, 0 warnings, 10 sign-off flags; release validation still fails as required |
| `npm run review:validate` | 0 errors, 0 approvals |
| Build | passes; A2 chunk still `lazy`, not precached |

### Bundle comparison

| | before (Stage 9A) | now | difference |
| --- | --- | --- | --- |
| A1 entry bundle (raw) | 579 763 | **583 412** | **+3 649** |
| A1 entry bundle (gzip -9) | 181 871 | 183 286 | +1 415 |
| A2 chunk (raw / gzip) | 844 176 / 211 218 | 844 176 / 211 218 | 0 |

The entry bundle grew (it was byte-for-byte constant since Stage 7C) because the speech layer, the final-test builder, the retention logic and one UI string are shared code. This is an expected, small increase; it is reported here rather than hidden.

## 9. Limitations and decisions reported (no breaking change was made)

1. **TTS real-device verification outstanding** (§7).
2. **A2 vocabulary questions are still Russian-only.** `vocabQuestion` (used by the A2 daily challenge, vocabulary tests, `/practice/review` and any pool-built A2 test) hard-codes Russian prompts, options (`v.ru`) and explanations. A2 unit tests no longer use it (they use the authored finals), but the A2 daily / vocabulary / review quizzes would show Russian to Kyrgyz learners. Fixing it needs a language parameter through the builders (a signature change used by many callers and tests) — **not done; proposal for Stage 9C** before release.
3. **Listening items in the authored finals**: none exist; the first Level Test listening part would use the 80 authored listening-dialogue questions (`lq-` ids, strict only after the same language work as item 2 for their `why` texts, which are currently Russian-only in `listeningQuestions`).
4. **Level / placement result `kind` is not yet written** by the UI.
5. **Behaviour changes visible in A1 (shared code):** the stop-toggle and repeat on every speak button; interrupt semantics of the listening lab sequence (a tapped word now ends the running sequence instead of letting it continue underneath); the transcript fallback for A1 listening questions on devices with no German voice; A1 `placement`/`level-a1` results are protected from eviction. No A1 scoring, question selection or content changed.
6. The Kyrgyz string `audioUnavailable` (and its Russian / German counterparts) is an unreviewed AI draft.

## 10. Boundaries respected

No 40- or 24-question content; no change to A1 educational content; A1 test scoring and selection preserved; A2 not exposed; no XP; no change to release validation or review approvals; nothing committed or pushed.
