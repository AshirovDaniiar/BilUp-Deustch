# A2 plan — Stage 2: consumer migration and A1 isolation

Application consumers now reach content through the level catalog (Stage 1) for every **id lookup** and every **unit-based lookup**. A1 behaviour is unchanged (Stage 0 baselines unmodified and green), A2 is still `planned`, empty and invisible. Earlier stages: [Stage 0](A2_STAGE0_BASELINE.md), [Stage 1](A2_STAGE1_CATALOG.md).

## 1. Migration policy

* **Migrated now:** id lookups (must work for any level) and unit-based lookups (must resolve through the unit's level), including `UNIT_SPEAKING[u-1]` → `speakingForUnit(u)`.
* **Deliberately left for the stage that gives them a level parameter** (Stage 3 progress/tests/daily, Stage 5 navigation/labs, tutor stage): whole-collection, level-scoped lists and pools. Migrating them now would only put a hard-coded `'A1'` in each place that Stage 3/5 immediately rewrites. They are A1-only legacy exports, so they cannot leak A2; the list is pinned by a test (§4).

## 2. Catalog additions (additive; A1 parity tested)
`allVocabulary` (all levels, A1 first — word lookups that must work in any level; `find` returns the A1 entry first, so A1 results are unchanged), `unitOfScenario(id)` (same contract as the legacy function: 0 when none), `whyNotesForConcept(conceptId)` (notes of the level that owns the concept).

## 3. Migrated consumers (19 files, 80 lines changed, 0 behaviour changes)

| Consumer | Migrated |
| --- | --- |
| `features/progress/stats.ts` | required-section checks (`vocabularyForUnit`, `unitById`, `listeningForUnit`, `readingForUnit`, `speakingForUnit`, `writingIndex`), `grammarIndex` in recommendations |
| `features/tests/questions.ts` | `unitReviewQuestions` → `vocabularyForUnit` + `exercisesForUnit` (article / non-article split; same order, so seeded output is identical) |
| `screens/UnitScreen.tsx` | `unitById`, `vocabularyForUnit`, `listeningForUnit`, `readingForUnit`, `writingIndex`, `grammarIndex`, `speakingForUnit` (replaces both `UNIT_SPEAKING[id-1]`) |
| `screens/HomeScreen.tsx` | `grammarIndex`, `vocabularyForUnit`, listening/speaking of the current unit via `listeningForUnit`/`speakingForUnit`/`speakingIndex`, fallbacks scoped to the unit's level |
| `screens/TopicScreen.tsx` | `grammarIndex`, `unitById`, `whyNotesForConcept`, next-concept taken from the concept's own level (`grammarOf(levelOfUnit(...))`) |
| `screens/GrammarScreen.tsx` (detail) | `grammarIndex`, `whyNotesForConcept` |
| `screens/{Learn,Vocabulary,Practice,Progress}Screen(s).tsx` | `vocabularyForUnit`, `vocabularyIndex`, `testIndex`, `grammarIndex` |
| `features/{listening,reading,writing,speaking}/*Lab.tsx` | route lookups (`listeningIndex`, `readingIndex`, `writingIndex`, `speakingIndex`), keyword/word glossing via `allVocabulary`, `unitOfScenario` |
| `features/grammar/Highlight.tsx`, `features/tests/QuizPage.tsx`, `features/vocabulary/WordCard.tsx` | `grammarIndex`, `vocabularyIndex` |
| `services/analysis.ts` | noun list for article checks from `allVocabulary` |

One type nuance: the legacy array index was typed `string`; `speakingForUnit` honestly returns `string | undefined`. `UnitScreen` renders `?? ''`, identical output for A1 (always defined).

## 4. Remaining legacy lookups (pinned; may only shrink)
Recorded as an exact allowlist in `tests/data/data-boundary.test.ts`; the test fails if a consumer gains or loses a whole-collection legacy import without updating it.

| Consumer | Legacy import | Migrates in |
| --- | --- | --- |
| `features/progress/stats.ts` | `UNITS`, `VOCABULARY` (level/current-unit/badge maths, stage counts) | Stage 3 |
| `features/tests/questions.ts` | `EXERCISES`, `articleExercises`, `LISTENING`, `VOCABULARY`, `REAL_LIFE` (test, daily, placement and distractor pools) | Stage 3 |
| `features/{listening,reading,writing,speaking}/*Lab.tsx` | collection lists and level chips | Stage 5 (D-1) |
| `screens/{Learn,Home,Vocabulary,Grammar,Practice,Unit}*` | `UNITS`, `VOCABULARY`, `GRAMMAR`, `TESTS` lists; `SECTIONS` constant | Stage 5 |
| `services/tutor.ts` | `EXERCISES`, `GRAMMAR` (tutor knowledge) | tutor stage |
| `app/store.tsx` | `LISTENING`, `READING`, `TESTS`, `WRITING` for the legacy-key migrator | stays (maps old A1 keys only) |
| `features/reallife/RealLife.tsx` | `REAL_LIFE` | stays (shared by all levels) |
| pure helpers `displayWord`, `caseForms` | from `vocabulary` | stays |

## 5. Architectural boundary tests (replace the Stage 1 scope guard)
`tests/data/data-boundary.test.ts`:
* consumers **never** import `data/a2/*`; they may import the catalog/course (and 10+ files do);
* the remaining legacy imports equal the allowlist above;
* A1 legacy modules never import the catalog, course or A2, and depend only on types and each other; `types.ts` depends on nothing;
* A2 modules import only types and A2 siblings (never A1 content, catalog, registry);
* the catalog is the only module outside `data/a2` that imports A2; the registry depends only on types.
* (`tests/data/catalog.test.ts`, unchanged) no cycles and no layering violation touching `data/`.

`tests/regression/a1-isolation.test.ts`: fills the A2 modules with fake content (unit, vocabulary, exercise, listening, speaking map) and requires the A1 progress maths, seeded daily challenge, all A1 tests, unit reviews, concept questions and selector baseline to equal the Stage 0 baselines byte for byte.

Mutation-checked, all restored: consumer imports an A2 module; a new legacy import in a screen; an A1 legacy module importing the catalog; an A2 module importing A1 content; an unfiltered per-unit selector (caught by the regression baseline, the parity tests and the isolation test). One mutant (`writing` requirement always true) is equivalent for A1 because every A1 unit has a writing task.

## 6. Verification

| Check | Result |
| --- | --- |
| typecheck / lint | pass / 0 errors, 8 pre-existing warnings |
| tests | **35 files, 823 tests pass** (was 33 / 812: +11 boundary and isolation tests); all 773 original and all Stage 0 and Stage 1 tests green, **no baseline touched** |
| A1 comparison vs Stage 0 baselines | content hashes, selectors, progress maths, seeded daily/tests/reviews/concepts, tutor transcripts: all identical |
| content:validate | 0 errors (same INFO about missing Kyrgyz) |
| boundaries:report | same 5 pre-existing violations, 0 cycles |
| format:check | 15 pre-existing flagged files, none touched by Stages 0–2 |
| browser smoke | 35 routes (incl. `/learn/unit/11`, a bad topic id) render, no console errors; A2 unit route is "not found" |

Bundle (`scripts/regression/bundle-size.mjs`): main JS 556.4 → **558.0 kB raw (+1.7 kB, +0.3 %)**, gzip 177.2 → 176.8 kB; precache total +1.7 kB raw. The increase is the catalog, course registry and the (empty) A2 modules now being reachable; not an A2 content cost.

## 7. Next
Stage 3: level-scoped progress, current unit, daily challenge, word-stage counts and test/placement pools (stats and questions), with A1 results required to stay identical.

Stage 3 (level-scoped progress, daily challenge, word stages, test pools, placement) is documented in [A2_STAGE3_LEVEL_SCOPING.md](A2_STAGE3_LEVEL_SCOPING.md).
