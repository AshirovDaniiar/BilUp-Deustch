# A2 Stage 9C — assessment localization (Russian and Kyrgyz, independently)

Completes independent Russian and Kyrgyz output for the A2 assessment and practice **question** flows. No Level Test or Placement Test content was created, no XP awarded, A2 stays `planned` and invisible, A1 educational content and behaviour are preserved, nothing is committed.

## 1. Inspection (builders and callers)

| Builder | Callers | Finding before this stage |
| --- | --- | --- |
| `vocabQuestion(v, i, rnd)` | `ReviewScreen` (due words), `unitReviewQuestions`, `buildTest` (vocabulary / level / default), `buildLevelDaily` | prompt, options (`v.ru`) and explanation **hard-coded Russian** — an A2 word asked to a Kyrgyz learner was entirely Russian |
| `listeningQuestions(ex, seed)` | `ListeningPlayer`, `buildTest('listening')` | explanation hard-coded Russian |
| `readingQuestions(text, seed)` | `ReadingView` | explanation = the German passage (language-neutral), not marked strict |
| `unitReviewQuestions(unit, size)` | `ReviewScreen` (`/practice/review?unit=`), `buildTest('topic')` for A1 | vocabulary part Russian |
| `buildTest(def)` | `TestRunnerPage` | A2 unit tests already authored (Stage 9B); pool-built A2 tests Russian |
| `buildLevelDaily(date, level)` | `DailyScreen` | vocabulary Russian; **phrase of the day always drawn from the A1 real-life topics with a Russian translation, also for A2** (A1 content inside an A2 daily) |
| `conceptQuestions`, `articleDrill`, `fromExercise` | `TopicScreen`, `ArticlesScreen` | exercises already carry `promptKy` (strict since 9B); article drill is A1-only (A2 has 0 article exercises) |
| i18n | `ky = { ...ru, overrides }` | **an untranslated Kyrgyz key silently shows Russian** — 173 keys were identical to Russian, among them most test / result / daily / review / skill strings |

## 2. Design (no breakage of A1 callers)

* **Language is an optional trailing parameter** (`lang?: Lang`) on `vocabQuestion`, `unitReviewQuestions`, `buildTest`, `buildLevelDaily`; every existing call keeps its meaning. **Rule:** only items of a **non-A1** level with `lang` ∈ {ru, ky} are localized (and `strict`); an A1 word, or any call without `lang`, returns exactly the legacy Russian question (tested with `toEqual`).
* `listeningQuestions` / `readingQuestions` need no parameter: for an A2 text the question carries the explanation **in both languages** and is `strict`; the renderer picks the learner's own language and **never falls back** to the other one.
* **Rendering helpers** `questionHint(q, lang)` / `questionWhy(q, lang)` (used by `QuizRunner` and the topic result list): strict → `trStrict` (a missing Kyrgyz text is *not* replaced by Russian; the German interface receives neither); legacy → Russian hint and `tr()` as before.
* **Interface strings:** new keys `qMeaning`, `qGerman`, `qWordIs`, `qListenWhy` in ru / ky / de (placeholders `{w} {g} {e} {t}` identical in all three) — the question formulas live in the dictionaries, not in code.
* **Daily challenge, A2:** the phrase of the day is taken from the level's **own grammar** (`reallife` + `examples`, German + ru + ky, strict) instead of the A1 topics; A1 is unchanged (same draws, same phrases). If a non-A1 level had no such sentences it falls back to the legacy phrase (not the case for the real A2).
* **Callers now pass the language:** `ReviewScreen` (unit review and due words), `TestRunnerPage`, `DailyScreen` (the daily is rebuilt when the language changes). `TopicScreen` exercises and the reading / listening labs needed no builder change.
* **Labs (practice flows):** the A2 reading lab word sheet (meaning, grammar note, example translation) and the A2 listening lab (line translations, keyword glosses) show **only the learner's own language**; A1 keeps its existing display.

## 3. Interface-key audit (assessment-related keys, 73 keys listed in the test)

| Group | Result |
| --- | --- |
| Existence | all keys defined and non-empty in ru, ky and de |
| Kyrgyz = Russian before | 53 assessment-related keys (tests, results, daily, review, articles, lab titles/descriptions, skill names, hints, tap hints) — **now translated into Kyrgyz** |
| Kyrgyz = Russian after (intentional) | `sk_grammar`, `sk_spelling`, `sk_style`, `dailyGrammar` (established loan words); asserted exactly by the test |
| German | every assessment key differs from Russian |
| Whole dictionary | key count 283 → 288 (9B: `audioUnavailable`; 9C: four question keys); **Kyrgyz-identical-to-Russian 173 → 119** (the ratchet in `tests/i18n.test.ts` was tightened and the new key count recorded with its reason) |
| Still Kyrgyz = Russian (out of this stage's scope) | ≈ 119 keys of the A1 course UI (e.g. `unitProgress`, `startUnit`, `levelLocked`, `cat_*`, `badge_unit`, …) — not assessment flows; reported, not changed |

**All new Kyrgyz strings are unreviewed AI drafts**; they are recorded in the Kyrgyz glossary, §14, for a native reviewer.

## 4. Tests (`tests/assessment/localization.test.tsx`, 29)

Vocabulary questions for a Russian and for a Kyrgyz learner (prompt, options, explanation; no Russian template, no Russian-only gloss among Kyrgyz options; both directions; same skeleton in both languages); A1 / no-language output equals the legacy question; listening explanations in both languages for all 20 A2 dialogues (and legacy Russian-only for A1; German interface gets none); reading strictness; **`buildTest(def, 'ky')` for vocabulary / level / grammar / listening / placement and all ten unit tests: every question strict, a Kyrgyz explanation present, no Russian text**; same for `'ru'` (no Kyrgyz); unit tests carry different Russian and Kyrgyz hints; `/practice/review` quiz; daily challenge (Kyrgyz vocabulary, own-grammar phrase, same words in both languages, deterministic); **A1 daily byte-identical** with / without a language and equal to the legacy `buildDaily`; every A1 test unchanged by the parameter; **the screens call the builders with the learner's language** (unit test page, unit review, daily — ru and ky, via spies); the question screen and the reading lab show Kyrgyz and no Russian; the key audit (existence, Kyrgyz ≠ Russian except loan words, German ≠ Russian, Kyrgyz letters, placeholder parity).

## 5. Results

| Check | Result |
| --- | --- |
| Full suite | **74 files, 2092 tests pass** |
| A1 regression set | 25 files, 413 tests pass |
| `tsc` | clean |
| ESLint | 0 errors, the same 8 pre-existing warnings |
| Content validation | 0 errors, 0 warnings, 10 sign-off flags; release validation still fails as required |
| `review:validate` | 0 errors, 0 approvals |
| Build | passes; A2 chunk still lazy and not precached |

| Bundle | Stage 9A | Stage 9B | now |
| --- | --- | --- | --- |
| A1 entry (raw) | 579 763 | 583 412 | **588 841** (+5 429 vs 9B; Kyrgyz strings and question logic) |
| A1 entry (gzip -9) | 181 871 | 183 286 | 184 881 |
| A2 chunk (raw / gzip) | 844 176 / 211 218 | same | same |

## 6. Honest limitations and findings

1. **Prettier side effect (my mistake, reported):** I ran `prettier --write` on `src/features`. It reformatted files I had not intended to touch. Five tracked files with no other changes were restored with `git checkout` (`CaseLab`, `Labs`, `RealLife`, `ScoreCard`, `SpeakInput`). Six files that already carried uncommitted changes from earlier work (`TutorChat`, `stats`, `SpeakingLab`, `QuizPage`, `WordCard`, `WritingLab`) **stay reformatted** (line wrapping only; semantics unchanged; the suite passes) because their previous exact text no longer exists — the diff of those files against `HEAD` is therefore noisier than before.
2. **Learning screens still show Russian to a Kyrgyz learner for A2** (outside assessment / practice questions, therefore not changed): `WordCard` (shows Russian and Kyrgyz together), the grammar and topic lesson text (`GrammarScreen` examples, `TopicScreen` "why" and dialogue translations), `SpeakingLab` (`titleRu`, `aiRu`), `VocabularyScreen` list glosses, `Highlight`, `HomeScreen` scenario subtitle. Proposal: a "learning screens" localization pass (Stage 9D) before any release.
3. A2 questions built **without** a language (a caller that forgets it) fall back to the legacy Russian question; the three screens that build A2 questions pass the language and a test guards them. A guard against future callers is the `strict` flag plus these tests, not a type-level guarantee.
4. The ≈ 119 remaining Kyrgyz = Russian keys belong to the A1 course UI and are unchanged.
5. The German interface (A2 not offered to it) receives neither Russian nor Kyrgyz A2 question text.
6. XP: unchanged (this stage touched no scoring); the future Level / Placement tests must still avoid the XP path (Stage 9B decision).

## 7. Boundaries respected

No 40- / 24-question test content; no XP; A2 visibility and release status unchanged; A1 content untouched and A1 behaviour pinned by tests; review approvals and release validation untouched; nothing committed or pushed.
