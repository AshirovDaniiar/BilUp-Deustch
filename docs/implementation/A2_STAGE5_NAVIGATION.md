# A2 plan — Stage 5: level-driven navigation, dashboard and learning labs

The UI is now driven by the course registry and the level catalog instead of hard-coded A1 assumptions. **A2 remains planned, empty and invisible**: no A2 chip, tab, card, label, lock, placeholder or reachable URL. Earlier stages: [0](A2_STAGE0_BASELINE.md), [1](A2_STAGE1_CATALOG.md), [2](A2_STAGE2_MIGRATION.md), [3](A2_STAGE3_LEVEL_SCOPING.md), [4](A2_STAGE4_ANSWER_ORDER.md).

## 1. One rule for visibility
`course.ts: availableLevels(lang)` = levels that are **visible** (not planned) **and released for the learner's language**. For the German *UI* locale (UI-only; explanations fall back to the explanation languages) a level is available iff it is released for at least one explanation language. Navigation, dashboards, labs, tests, the placement wording and direct URLs all derive from this list.
`activeLevel(state)` resolves the stored preference through it (preference untouched; an unavailable level resolves to A1). Results are now recorded with this active level, so an A1 activity is never labelled with a planned level.

## 2. Navigation and dashboard
| Where | Before | Now |
| --- | --- | --- |
| Learn | `LEVELS.map` (A1 active, A2–C1 "🔒"), "levels A2–C1 will come" card, `UNITS` | `LevelTabs` (renders **nothing** unless ≥ 2 levels are available), units of the active level, no placeholder card |
| Home | journey track A1…C1, "A1 · 10 юнит" literal, current unit from the A1 helper | journey track only when ≥ 2 levels are available; `"{level} · {n} юнит"` with `n = unitsOfLevel(level).length`; current unit/progress/recommendations of the active level; `NotFound` guard for an (impossible) unit-less visible level |
| Progress | "A1" ring/label literals | active level |
| Vocabulary, Grammar | `VOCABULARY` / `UNITS` / `GRAMMAR` | `vocabularyOf` / `unitsOfLevel` / `grammarOf` of the active level |
| Tests list | `LEVELS.map` with "🔒", fixed ids | tests of the active level from the catalog; level-test chips/cards for available levels only |
| Placement result | named "A1 · A2" / "A2 →" even though A2 does not exist (audit V-11) | while the next level is not available the upper bands read "A1" / "A1 ✓"; the original wording returns when it becomes available. **Intentional A1-visible change**, required by the A2-invisibility rule. Thresholds unchanged |
| Tutor screen | showed `state.level` | shows/passes the active level (tutor logic untouched) |
| Topic "next" | computed inline | `catalog.neighbourConcepts` — previous/next within the concept's own level only |

A1 layout and visuals are preserved; the only visible A1 differences are the removed locked chips, the removed journey nodes/placeholder card, the placement wording and the lab lists below.

## 3. Learning Labs — decision D-1: level = the level of the PARENT UNIT
Listening, Reading, Writing and Speaking lists come from `listeningOf / readingOf / writingOf / speakingOf(activeLevel)` (module = parent-unit level), never from the legacy item `level` tag. The item badge and detail-page eyebrow show the unit's level (`levelOfUnit(item.unit)`; for the unit-less doctor scenario the level of the module that contains it).

* **Legacy A2/B1-tagged fragments inside A1 units stay A1** and now appear in the A1 labs: listening 18 → **21** (li16, li18, li20), reading 7 → **10** (re08, re09, and the B1-tagged re10), writing 5 → **10** (wr05, 06, 08, 09, 10), speaking all **11**. This is the approved, intentional A1-visible effect of D-1 (additive; nothing removed). The data and its tags are untouched (hash-guarded); the old "by item tag" behaviour remains recorded as `labsByItemLevel` in the Stage 0 baseline, which is data-derived and therefore still valid.
* Lab level tabs appear only with ≥ 2 available levels.
* Grammar/topic pages and the Home listening step also show the unit's level (e.g. `genitiv`, tagged A2 but in A1 unit 10, now reads "A1").

## 4. Direct URLs
`app/routeAccess.ts: levelOfRoute / isRouteAccessible` map every content route to the level of its parent unit — unit & vocabulary study, topic, grammar detail, listening/reading/writing items, tests, unit review, speaking scenarios — and `App` renders "not found" unless that level is available for the learner's language, **even when the catalog contains the content**. Unknown ids and non-content routes keep their own behaviour. Verified with fake A2 content while planned, released for Russian only (Kyrgyz stays blocked), and for the German UI.

## 5. Tests (all 4 Stage-5 files use the real `App`; A2 content is injected only through `vi.mock` of the A2 modules)
* `tests/navigation/a1-world.test.tsx` (23): the real world — no `\bA2\b` and no 🔒 on 33 A1 routes in ru/ky/de; a stored A2 preference is ignored (and left in storage); A2 URLs "not found"; Learn lists exactly the 10 A1 units in order with labels/word counts and no tabs; Home label/count from metadata; the four labs list all A1-unit items (legacy fragments included) each labelled A1; detail pages show the unit's level.
* `tests/navigation/a2-world.test.tsx` (27): fake A2 loaded — while planned: 11 A2 URL shapes "not found", no list/lab/dashboard shows it, route-level mapping; released for ru only: availability per language, ru opens, ky blocked/no tabs, a Kyrgyz learner with an A2 preference sees A1; tabs switch Learn and the labs; Home shows `A2 · 1 юнит` and a two-level journey; A2 labs hold only A2 items and A1 labs keep the legacy fragments; neighbours never cross levels.
* `tests/navigation/placement-label.test.tsx` (3): wording per availability and per language.
* Updated, openly: two Stage 3 tests that made A2 `beta` now also set `releasedLocales` (visibility now includes the language rule) and gained the negative Kyrgyz case; the `currentUnit` call-site guard now expects no 1-argument caller (Home passes the level); the boundary allowlist is tracked **by collection name** and shrank to 4 files (legacy-key migrator, shared REAL_LIFE ×2, tutor) — no screen or lab reads a whole A1 collection any more.
* Mutation-checked, all caught and restored (14): tabs with one level; availability ignoring language; no route guard; lab filtered by legacy tag; legacy tag shown on a reading card / writing page / grammar page; journey always drawn; dashboard label hard-coded; neighbours crossing levels; placement always naming A2; Learn ignoring the active level; tests and speaking routes ungated.
* **Process note:** the linter exposed that one scripted edit had corrupted a regex in `level-call-sites.test.ts` (a stray backspace character, silently making that guard vacuous). It was restored, shown to fail on a 1-argument `currentUnit` call again, and the whole repository was scanned for control characters (none). Separately, a broad `prettier --write` had reformatted the untouched `tests/progress/engine.test.ts`; that file was reverted.

## 6. Verification
| Check | Result |
| --- | --- |
| typecheck / lint | pass / 0 errors, 8 pre-existing warnings |
| tests | **43 files, 947 tests pass** (was 40 / 894: +53); all 773 originals and Stage 0–4 protections green |
| A1 characterization vs Stage 0 | content hashes, selectors, progress, seeded daily/tests/reviews/concepts, tutor transcripts: **identical, no baseline touched** (the lab-list change is a UI selection over unchanged data) |
| content:validate / boundaries | 0 errors / same 5 pre-existing violations, 0 cycles |
| format:check | 15 pre-existing files; none from Stages 0–5 |
| build | pass; main JS 556.4 → **561.1 kB raw (+4.7 kB, +0.8 % cumulative; +1.0 kB for Stage 5)**, gzip 177.2 → 178.1 kB |
| browser | 39 routes × 390/1280 px (33 A1 routes + 6 A2/unknown): no A2 text, no lock, no overflow, no console error; A2 and unknown URLs are "not found" |

## 7. Remaining work and dependencies
* **Stage 6:** the validator (CEFR/level checks, RU/KY completeness, answer-position distribution, references), the unit page's hard-coded "8 questions" label and `unit-${id}` / `wr${NN}` id conventions (to move to metadata), level-aware A2 test definitions.
* **Tutor stage (D-3):** knowledge scoping and Kyrgyz answers; the tutor still reads A1 legacy exports (its level label/argument is the active level since this stage).
* **Storage decision (from Stage 3):** skill `scores` and `daily` are not level-tagged.
* **A2 content authoring** and the release gates (`releasedLocales`) — until then everything above is inert.

Stage 6A (content validation foundation) is documented in [A2_STAGE6A_VALIDATION.md](A2_STAGE6A_VALIDATION.md).
