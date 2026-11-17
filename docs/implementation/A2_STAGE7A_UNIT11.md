# A2 Stage 7A — Pilot Unit 11 authoring

**Scope:** author Unit 11 *Über mich und meine Erfahrungen* (`a2-ueber-mich`) only. A2 stays `planned` and invisible; units 12–20, the level test, placement and tutor templates are untouched. A1 content, storage and progress logic are untouched. Nothing is committed.

## 1. Files

**Created**
* `src/data/a2/provenance.ts` — `UNIT_11_SOURCE` (original authored material, AI-assisted, pending review). Kept in its own module so test mocks of the A2 content modules cannot hide it.
* `tests/content-validate/unit-11.test.ts` — 40 production-content tests.
* `docs/authoring/A2_UNIT11_CEFR_REVIEW.md` — unit-level CEFR / RU / KY review report.
* `docs/implementation/A2_STAGE7A_UNIT11.md` — this report.

**Modified (production content, the A2 modules that were empty skeletons)**
`src/data/a2/{units,vocabulary,grammar,exercises,listening,reading,speaking,writing,tests,instructions}.ts`

**Modified (tests and docs)**
* `tests/content-validate/fixtures.ts` — new `emptyA2Bundle()`; `validA2Bundle()` now builds on it. Synthetic fixtures no longer collide with, or depend on, production A2 content.
* `tests/content-validate/{answers,cefr,localization,metadata,references,schema,infrastructure}.test.ts` — use `emptyA2Bundle()` for "empty planned A2" / clean-base cases; `fullBundle()` is kept where the real bundle is the subject (wiring guard, release rejection). Two assertions about "no A2 unit exists" now say "only unit 11 exists".
* `tests/data/catalog.test.ts` — "ships NO A2 content" → "only unit 11"; the temporary-item isolation test now uses unit 12 and restores the arrays exactly (it previously cleared them, which would have wiped unit 11).
* `tests/progress/level-scoping-empty.test.ts` — mocks the A2 content modules as empty (it proves the runtime behaviour of an empty level, which can no longer be read from production data).
* `tests/answer-order.test.ts` — the "empty catalog" check uses a level without content (B1) instead of A2.
* `docs/authoring/A2_AUTHORING_GUIDE.md` — "State today" line only.

**Not touched:** `src/data/*.ts` A1 modules, `src/progress/*`, `src/storage/*`, `src/features/*`, `src/screens/*`, `src/data/course.ts` (A2 remains `planned`, `releasedLocales: []`), `src/data/a2/registry.ts`, `scripts/content-validate/reviews.ts` (`A2_REVIEWS` still `{}`).

## 2. Unit 11 inventory

| Item | Count | Ids |
| --- | --- | --- |
| Unit | 1 | `11` / `a2-ueber-mich` (title equals the approved plan entry) |
| Vocabulary | 37 (13 nouns with article + plural, 11 verbs, 2 adjectives, 6 other, 5 phrases) | `v11-1` … `v11-37` |
| Grammar concepts | 3 | `a2-perfekt-erfahrungen`, `a2-praeteritum-sein-haben-modal`, `a2-ereignisse-verbinden` |
| "Why?" notes | 5 | one per typical learner question |
| Listening dialogues | 2 (10 lines each; 96 and 124 words; 4 questions each) | `a2-li-11-01`, `-02` |
| Reading texts | 2 (92 and 71 words; 5 and 4 glossed words; 3 questions each) | `a2-re-11-01`, `-02` |
| Speaking scenario | 1 (4 turns, hints + keywords) | `a2-sp-11-01` (assigned via `A2_UNIT_SPEAKING[0]`) |
| Writing task | 1 (personal e-mail, ≥ 60 words, 7 required elements, model of 81 words) | `a2-wr-11-01` |
| Revision (Wiederholung) exercises | exactly 8 (3 fill, 3 choice, 2 order) | `a2-ex-11-01` … `-08` |
| Final-test questions | exactly 15 | `a2-ft-11-01` … `-15`, test definition `unit-11` (`kind: 'topic'`, `unit: 11`, `size: 15`) |
| Learner instructions | 9 (unit, vocabulary, grammar, listening, reading, speaking, writing, review, test) | `a2-in-11-*` |

## 3. Curriculum coverage

The unit goes beyond A1 self-introduction (name, origin, age): it teaches how to tell *one's own story* — where one grew up, education and work, moves, achievements, changes, goals — and how to ask about someone else's experience (*Hast du schon einmal …? — Noch nie.*).

* **Vocabulary themes:** life path (Erfahrung, Ausbildung, Abschluss, Praktikum, Stelle, Umzug, Heimat), achievement (Prüfung, Erfolg, Ziel, Traum, bestehen, erreichen, schaffen), change (Veränderung, sich verändern, sich entscheiden), time and sequence (früher, damals, zuerst, danach, schließlich, seit, vor zwei Jahren, schon einmal, noch nie).
* **Grammar:** (1) Perfekt with haben/sein, Partizip II incl. separable and *ge-less* verbs, time expressions incl. *seit* + Präsens; (2) Präteritum of sein, haben and modals; (3) sequence adverbs, `weil`, `dass`. Each concept has rule, 3–5 German examples, 3–4 typical mistakes, real-life sentences, a 4-line dialogue, a speaking prompt, Russian and Kyrgyz text for every part, and provenance.
* **Skills:** listening 1 = asking/answering about someone's background; listening 2 = interview about change and achievement; reading 1 = narrative of a life path (Perfekt); reading 2 = *früher und heute* (Präteritum + weil/dass); speaking = story conversation; writing = personal e-mail.

## 4. Quality assurance results

| Check | Result |
| --- | --- |
| Full test suite | **52 files, 1450 tests pass** (baseline before the stage: 51 files, 1410 tests; +40 new tests) |
| `tsc --noEmit` | exit 0 |
| ESLint | 0 errors, 8 warnings, all in files this stage did not touch (`components/ui.tsx`, `WritingLab.tsx`, `ProfileScreen.tsx`) |
| `content:validate` (authoring) | **0 errors, 0 warnings, 1 review flag** (`cefr-signoff-missing` for unit 11 — correct, no human review exists). 0 B1+ heuristic hits, 0 sentence-length flags |
| `content:validate:release` | **fails (exit 1), as required**: 11 errors = unit 11 sign-off missing + units 12–20 not defined + no `level-a2` test |
| A1 regression oracle (`tests/regression`) + A2 world / navigation / level scoping | 92 tests pass; A1 behaviour, selectors and content hashes identical to the Stage 0 baselines |
| Boundaries (`boundaries:report`) | 5 violations (the baseline's 5, report-only), **0 cycles**; `src/data/a2` adds none |
| Production build (`build:ci`) | passes |
| Prettier on touched test files | clean |

### Bundle size (main JS, bytes as shipped, `scripts/regression/bundle-size.mjs`)

| | raw | gzip |
| --- | --- | --- |
| Before Stage 7A (Stage 6B state) | 575 833 | ≈ 182 400 |
| After Stage 7A | 658 223 | 203 970 |
| **Δ** | **+82.4 kB (+14.3 %)** | **+21.6 kB (+11.8 %)** |
| Δ vs. the Stage 0 A1 baseline (script output) | +86.4 KiB (+15.5 %) | +21.9 KiB |

CSS unchanged. **Finding:** a single unit of Cyrillic-heavy text costs ~+82 kB raw / +22 kB gzip, and A2 is *invisible* but still shipped. Extrapolated to ten units this is roughly +820 kB raw / +210 kB gzip. A lazy-loaded A2 content chunk (dynamic import behind the level-visibility check) should be decided **before** units 12–20 are added. This stage did not change the build configuration. (Note: Vite's console figure counts characters, not bytes, which understates Cyrillic text; the numbers above are file bytes.)

## 5. Assessment design

**Revision exercises (8):** `fill` ×3 (01, 04, 08), `choice` ×3 (02, 05, 07), `order` ×2 (03, 06) — i.e. 3/3/2. Concepts 3/2/3. Every `fill` has exactly one blank and two wrong options; every `order` has scrambled tokens matching the answer sentence; every item has RU and KY prompt translation and RU and KY feedback (`why`).

**Final test (15):** grammar 10 (Perfekt with sein, *ge-less* Partizip, Partizip position, irregular Partizip, *seit*; Präteritum of sein / modal / haben; `weil`, `dass`), vocabulary 3 (adjective in context, collocation *Erfahrungen sammeln*, odd-one-out), reading 2 (short embedded texts). Three options each; exactly one correct; distractors are real learner errors (wrong auxiliary, *ge-* overgeneralisation, wrong person ending, wrong word order, Konjunktiv II look-alikes). **Answer-position distribution: 5 / 5 / 5, no run of three.** Listening keys 2/3/3 and reading keys 2/2/2, no run of three.

**Separation:** the final test shares no id, prompt, answer or filled sentence with the revision exercises; token-overlap (Jaccard) between any final question and any exercise is < 0.6, and between any two final questions is < 0.6 (tested). A first pass of the final test was reviewed for ambiguity: distractors that were *also grammatical* (`war … aufgewachsen`, `waren … gezogen`, `… wichtig waren`) were replaced so that each item has exactly one correct answer.

## 6. RU / KY localization

* Every localizable field of unit 11 (≈ 260 RU/KY pairs: unit subtitle, vocabulary and example translations, all grammar parts, exercise prompts and feedback, dialogue lines, reading glosses and their grammar notes, speaking and writing text, final-test prompts and feedback, why-notes, instructions, test title) has independent Russian and Kyrgyz text. No `ky` is a copy of `ru` (validator `l10n-ky-equals-ru`: 0), `SAME_AS_RU` stays empty, no placeholder text, no runtime fallback. German examples quoted in explanations are identical in both languages (tested).
* **Limit:** correctness of the Kyrgyz (and Russian) language is not machine-checkable. The Kyrgyz is an AI-assisted first draft and **requires a native-speaker review**; terminology and doubtful phrases are listed in `A2_UNIT11_CEFR_REVIEW.md` §4. During authoring a few Kyrgyz slips were found and corrected (*дагы* used for "ещё" → *али*, *бул жерден* → *бул жерде*).

## 7. CEFR flags (summary — details in the review report)

Open for a human decision: **F1** `dass` as taught A2 grammar; **F2** verb-final Perfekt in `weil`/`dass` clauses (densest: reading 2, last sentence); F3 reflexive Perfekt; F4 possibly-above-A2 vocabulary (Abschluss, Veränderung, erreichen, Erlebnis, Heimat…); F5 Konjunktiv II forms used as wrong options and named in explanations; F6 du/Sie register mix; F7–F9 minor. **No CEFR, Russian or Kyrgyz sign-off was recorded.**

## 8. Boundaries confirmed

* Units 12–20: no unit, word, concept, exercise, text, dialogue, scenario, task or question (tested: only unit 11 exists; every A2 item has `unit === 11`).
* A2 `status: 'planned'`, `releasedLocales: []`; `isLevelVisible('A2') === false`; the Stage 5 navigation tests (A2 absent from every route and interface language) pass unchanged.
* No placement items, no `level-a2` definition, no tutor templates; no Tutor runtime code; no storage or progress change; no A1 data change; nothing committed or pushed.

## 9. Known limits

* The `fullBundle()` release run is expected to fail until every unit, the level test and all sign-offs exist.
* The unit page, learner flows and runtime still read A2 through the catalog but A2 is unreachable (invisible), so Unit 11 has **not** been exercised in the real UI — only validated as data. `promptKy` and the new strict-localization fields are not yet rendered by the runtime (a later stage migrates the UI).
* Audio: listening dialogues are text; playback uses the app's existing speech path as for A1.
