# A2 plan — Stage 3: level-scoped progress, challenges and assessment

Progress, word stages, mistakes/recommendations, the daily challenge, test pools and placement are now computed per level from the catalog. A1 behaviour is unchanged (Stage 0 baselines untouched and green), **no storage change**, A2 is still `planned`, empty and invisible. Earlier stages: [0](A2_STAGE0_BASELINE.md), [1](A2_STAGE1_CATALOG.md), [2](A2_STAGE2_MIGRATION.md).

## 1. Design

**Explicit level, explicit default.** Level-scoped functions take the level as their last parameter. The default is `DEFAULT_LEVEL` (the first *released* level = A1), so the pre-A2 call style — and the 773 original tests — keep meaning "A1", never "whatever content exists". Application code must always pass the level; `tests/progress/level-call-sites.test.ts` scans `src/` and fails on any call that omits it.

**Active level** (`course.ts: resolveActiveLevel`, `stats.ts: activeLevel(state)`): the stored preference `UserProgress.level` is never rewritten. A planned (invisible) or unknown level cannot be active, so it resolves to `DEFAULT_LEVEL`; a level that becomes visible resolves to itself. This is the *only* place a planned level is handled; content selectors and builders never fall back to another level — for an empty pool they return an explicit empty result (`[]`, `0`, `undefined`, `null`).

**Pools by level, by construction.** Pools come from `vocabularyOf/exercisesOf/listeningOf/grammarOf(level)`; vocabulary distractors, concept questions and article drills use the level that owns the word/concept; a test on a unit of another level is empty.

## 2. Storage compatibility (no migration)

Inspected `UserProgress`. Everything needed is already globally id-keyed, so nothing is stored, renamed, reset or reinterpreted:

| Stored | Scoping | Note |
| --- | --- | --- |
| `completed` (`unit:section`, `topic:id`) | unit ids are global; A2 = 11–20 | unchanged keys |
| `mastery`, `saved` (by vocab id) | word → unit → level | A2 words cannot enter A1 counts |
| `mistakes` | level **derived** from the ids they carry (article → word, else concept); unresolvable legacy refs belong to A1, as they always have | per-level recent windows |
| `level` (preference) | read through `resolveActiveLevel`; value preserved | |
| `tests` (by test id) | ids are unique per level (`level-a2`, `unit-11`…) | |
| **`scores`** (skill percentages, last 30) | **not scoped** — arrays carry no level | see §7 |
| **`daily`** (keyed by date) | **not scoped** — one entry per date | see §7 |
| `xp`, streak, week, study time, name, language, theme | learner-level, intentionally global | |

## 3. Progress (`features/progress/stats.ts`)
* `levelProgress(s, level)` counts only that level's units; `currentUnit(s, level)` (overloaded: the 1-argument A1 form always returns a unit; for another level it is `undefined` when the level has no units).
* `stageCounts`, `dueWordIds`, `masteredCount` take a level (A1 default). The "25 words" badge and the "unit completed" badge are **global achievements** across levels.
* `weakConcepts(s, min, level)` and `articleConfusion(s, level)` first filter the mistakes of the level, *then* apply the recent window (80/40), so A2 mistakes can never push A1 evidence out of A1's window; for A1-only history this is identical to before. `recommendations(s, level)` uses these.
* Home, Progress, Vocabulary, Review, Articles and the practice hub pass `activeLevel(state)`. Home still shows the A1 course unit (`currentUnit(state)`, legacy form) until the level-driven dashboard (Stage 5).

## 4. Daily challenge (`features/tests/questions.ts`)
* `buildLevelDaily(date, level): Daily | null` — pools from that level only; returns **null** if the level cannot supply vocabulary (≥3), a handwritten exercise, a listening dialogue and a speaking source (`isDailyAvailable`). Nothing is substituted.
* A1: same seeded draws in the same order and the verbatim A1 speaking table (`LEGACY_DAILY_SPEAKING`) → output identical to the baseline (6 dates verified). Other levels take the speaking prompt from their own grammar concepts' `speakPrompt`.
* `buildDaily(date)` is kept as the A1 legacy contract (throws if A1 were ever empty); the app uses `buildLevelDaily`. `DailyScreen` renders `NotFound` when there is no challenge (unreachable today) and otherwise the unchanged `DailyRunner`.

## 5. Tests and question pools
* `isTestAvailable(def)` / `buildTest(def)`: pools by `def.level`; an unavailable test builds `[]` and `TestRunnerPage` shows `NotFound`. Topic tests require the unit to belong to `def.level`.
* `articleDrill(size, ids, level)`, `conceptQuestions(concept)` (level of the concept; `[]` for an unknown concept), `vocabQuestion` (distractors from the word's level; an orphan word gets none).
* **Placement:** composition bands are now relative to the level's first unit (A1: units 1–4 / 5–7 / 8–10 — identical output). The recommendation thresholds are extracted unchanged as `placementBand(pct)` (`A1 · start` / `A1 · A2` / `A2 →`). No A2 placement or level test exists and none is claimed; an A2 placement would be built from A2 content only, and is empty today. **Known at Stage 3:** the A1 placement could still *display* "A2 →" for ≥ 75 % although A2 is not available (audit finding V-11). **Resolved in Stage 5** (see [A2_STAGE5_NAVIGATION.md](A2_STAGE5_NAVIGATION.md)): the wording now follows availability.

## 6. Verification

| Check | Result |
| --- | --- |
| typecheck / lint | pass / 0 errors, 8 pre-existing warnings |
| tests | **38 files, 864 tests pass** (was 35 / 823: +41 new); all 773 original tests and all Stage 0–2 tests unchanged and green |
| A1 vs Stage 0 baselines | content hashes, selectors, progress maths, seeded daily ×6, every A1 test ×3 seeds, unit reviews, concept questions, article drills, tutor transcripts: **identical, nothing re-captured** |
| content:validate | 0 errors (same INFO) |
| boundaries | same 5 pre-existing violations, 0 cycles; allowlist shrunk (`stats.ts` → `SECTIONS` only; `questions.ts` → `REAL_LIFE`, `displayWord`) |
| format:check | 15 pre-existing flagged files; none touched by Stages 0–3 |
| browser | 16 routes (daily, review, articles, 7 tests, vocabulary, progress, home, topic) render without console errors; daily plays through |

**Tests that prove isolation** (`tests/progress/`):
* `level-scoping-empty` — the real world today (A2 planned, empty): explicit empty/`null` results; an A1 pool is never used for A2; stored A1 mistakes never appear for A2; `state.level = 'A2'` resolves to A1 without rewriting the stored value; a visible A2 would resolve to A2.
* `level-scoping-a2` — a populated A2 (fake content loaded at module load via `vi.mock`, so the catalog's static indexes see it like real content): the **A1 baselines are byte-identical with A2 present**; each level's progress, stages, mistakes, daily, tests, placement, drills, concept questions and distractors use that level only; an A2 level missing a listening dialogue gets *no* daily rather than a patched one.
* `level-call-sites` — application code never relies on the implicit A1 default.

Mutation-checked, all restored: a screen dropping its level argument; stage counts over all levels; the empty-level daily falling back to A1; unscoped mistakes; cross-level distractors; a topic test on a foreign unit; a changed A1 daily draw order.

Bundle (`scripts/regression/bundle-size.mjs`): main JS 556.4 → **559.8 kB raw (+3.4 kB, +0.6 %)**, gzip 177.2 → 177.4 kB; CSS unchanged. Cumulative since the A1 baseline, all from Stage 1–3 logic, not content.

## 7. Remaining legacy lookups and deferred work
* **Not level-scoped because the stored shape has no level** (a storage decision is needed — impact is clear, nothing was changed): skill `scores`/`skillPct` (so the "good at listening" recommendation, skill bars and "strong skills" are learner-wide), and `daily` results keyed by date only (one daily per date across levels). Proposal for later: an additive, optional level tag on score entries and a level in the daily key, with A1 entries read as A1.
* Whole-collection lists and navigation (Stage 5): `UNITS`/`VOCABULARY`/`GRAMMAR`/`TESTS` lists in Learn/Vocabulary/Grammar/Practice, level chips, the four labs (D-1), Home's course unit and "A1 · 10 units" text.
* Tutor (`services/tutor.ts`): still on A1 legacy exports; **dependency noted, not implemented** — tutor knowledge must be level-scoped and answer in the selected language (D-3) in its own stage.
* `app/store.tsx` legacy-key migrator (A1 keys only) and `RealLife` (shared) intentionally stay.
* The placement "A2 →" display (V-11), the `daily` + `scores` shapes, and the TestsList level chips are the open items for Stage 5/storage.

## 8. Next
Stage 4: answer-position randomisation for listening and reading (D-4), with its approved A1-visible effect documented.

Stage 4 (answer-position randomisation, D-4) is documented in [A2_STAGE4_ANSWER_ORDER.md](A2_STAGE4_ANSWER_ORDER.md).
