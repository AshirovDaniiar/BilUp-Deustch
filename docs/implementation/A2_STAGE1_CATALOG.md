# A2 plan — Stage 1: course registry, level catalog, A2 skeletons

Stage 1 adds the structure A2 will live in. It adds files only: **no existing file was modified, no application code uses the new modules yet, and A2 stays `planned` (invisible) with no learning content.** Protection baseline: [A2_STAGE0_BASELINE.md](A2_STAGE0_BASELINE.md).

## 1. New files

| File | Purpose |
| --- | --- |
| `src/data/course.ts` | Tiny in-code course registry: `COURSE` with `levels[]` (`id`, `status: planned/beta/released`, inclusive `unitIdRange`, `releasedLocales`). A1 = released, units 1–10, locales ru+ky. A2 = **planned**, units 11–20, no released locale. Helpers: `courseLevel`, `isLevelVisible`, `isLevelReleasedFor`, `levelOfUnitId`. |
| `src/data/catalog.ts` | Level-scoped selectors over the A1 exports and the A2 modules (see §2). |
| `src/data/a2/units.ts` | `A2_UNITS`, `A2_UNIT_SPEAKING` (empty, typed) |
| `src/data/a2/vocabulary.ts` | `A2_VOCABULARY` |
| `src/data/a2/grammar.ts` | `A2_GRAMMAR`, `A2_WHY_NOTES` |
| `src/data/a2/exercises.ts` | `A2_EXERCISES` (the 8 revision exercises per unit) |
| `src/data/a2/listening.ts`, `reading.ts`, `speaking.ts`, `writing.ts` | `A2_LISTENING`, `A2_READING`, `A2_SPEAKING`, `A2_WRITING` |
| `src/data/a2/tests.ts` | `A2_TESTS` (unit tests, level test), `A2_FINAL_TESTS` + `A2FinalTest` (D-2: 15 authored final-test questions per unit, separate from revision exercises) |
| `tests/data/catalog.test.ts` | Parity, isolation, typing, registry and layering tests (32 tests) |

Existing files modified: **none** (the only tracked change in the working tree is the Stage 0 `.prettierignore` line).

## 2. Selector design

* **Per level, by construction — never a filter over a shared pool.** A level's content is that level's own module. `vocabularyOf('A1')` *is* `VOCABULARY` (same array reference), `vocabularyOf('A2')` *is* `A2_VOCABULARY`. An A2 item therefore cannot reach an A1 selector. Levels without a module (B1, B2, C1) return a shared frozen empty content.
* **Collections:** `unitsOfLevel`, `vocabularyOf`, `grammarOf`, `whyNotesOf`, `exercisesOf`, `listeningOf`, `readingOf`, `speakingOf`, `writingOf`, `testsOf`, `unitSpeakingOf`, `finalTestsOf`, and `contentOf(level)`.
* **Unit → level:** `levelOfUnit(id)` uses the course's unit id ranges (so it works before any A2 unit exists); non-integers and ids outside every range resolve to `undefined`. *The level of an item is the level of its parent unit* (D-1): the legacy `level` tag on A1 items (e.g. the 3 A2-tagged listening dialogues) is a difficulty label only, and those items stay in A1.
* **Per unit:** `vocabularyForUnit`, `grammarForUnit`, `exercisesForUnit`, `listeningForUnit`, `readingForUnit`, `writingForUnit`, `finalTestOfUnit` — for A1 equal to the legacy helpers.
* **`speakingForUnit(unit)`** replaces `UNIT_SPEAKING[unit - 1]`, which cannot address A2 ids (index = unit − range start).
* **Cross-level lookups** (ids are globally unique): `allUnits`, `unitById`, and `vocabularyIndex`, `grammarIndex`, `exerciseIndex`, `listeningIndex`, `readingIndex`, `writingIndex`, `speakingIndex`, `testIndex` (deliberately *not* named like the legacy `…ById` exports, so the two cannot be confused).
* **Layering:** `data` is rank 0; the new modules import only other `data` modules. No cycles.

## 3. A1 parity and safety results

* `unitsOfLevel('A1')` is `UNITS` (same reference, same order, deep-equal).
* All 10 A1 collection selectors are the original exports (`toBe`).
* Per-unit selectors equal the legacy helpers for all 10 A1 units; `speakingForUnit(u)` equals `UNIT_SPEAKING[u-1]`.
* Every A1 id resolves through the catalog indexes to the very same object as the legacy `…ById` map (vocabulary, grammar, exercises, listening, reading, writing, speaking, tests).
* Catalog output equals the Stage 0 selector baseline (`a1-selectors.json`).
* A2 selectors return the A2 modules and are empty; unit ids 11–20 resolve to A2, everything else to nothing.
* **Isolation test:** temporary A2 items (unit, vocabulary, exercise, listening, speaking map) appear only in A2 selectors; every A1 selector and the legacy exports stay identical.
* Skeletons are exactly typed (`expectTypeOf`); ids are unique across A1 + A2; registry ranges are contiguous and A1's equals `UNITS`; `COURSE.id` equals the storage `COURSE_ID`.
* Layering: `analyze('src')` reports 0 cycles and no violation touching `data/`; new data modules import only `src/data`.
* **Stage 1 scope guard** (nobody outside `src/data` imports the catalog): replaced in Stage 2 by the architectural boundary test `tests/data/data-boundary.test.ts` (see A2_STAGE2_MIGRATION.md).
* Mutation-checked (all caught, all reverted): A1 selector returning a copy missing one item; A2 data wired into A1; a screen importing the catalog; a catalog ↔ course import cycle.
* A bug found and fixed by these tests: `levelOfUnitId(1.5)` resolved to A1 (range check accepted non-integers); it now requires an integer.

## 4. Verification

| Check | Result |
| --- | --- |
| typecheck | pass |
| lint | 0 errors, 8 pre-existing warnings |
| tests | **33 files, 812 tests pass** (was 32 / 780; +32 catalog tests); all 773 original tests and the 7 Stage 0 regression tests unchanged and green |
| content:validate | 0 errors |
| boundaries:report | 5 violations, 0 cycles — identical to baseline |
| format:check | 15 pre-existing flagged files; none are Stage 0/1 files |
| production build | pass; bundle **identical to the A1 baseline** (nothing imports the new modules, so they are not bundled) |

`bundle-size.mjs` reports `src/data/*.ts` source +10.6 kB (the new files); that is source only, not shipped.

## 5. Next
Stage 2: migrate consumers to the catalog with A1-only data and prove no behaviour change (Stage 0 oracle + parity tests); remove the Stage 1 scope guard.
