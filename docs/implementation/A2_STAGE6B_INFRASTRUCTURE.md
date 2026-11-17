# A2 Stage 6B — Content Infrastructure

**Scope:** infrastructure only. No A2 vocabulary, lesson, dialogue, text or question exists; `A2_UNITS` is empty; A2 is `planned` and invisible. A1 content, storage and progress are untouched. Nothing is committed.

## 1. Unit registry design

* `src/data/a2/registry.ts` — `A2_UNIT_PLAN: PlannedUnit[]`: the ten approved units, ids 11–20, a permanent `key` each and the approved German title (verbatim). **Identity only** — no Russian/Kyrgyz text; nothing in the app reads it (only the validator, via the catalog `plan` selector `plannedUnitsOf`).
* `LearningUnit.key?` — optional stable key on authored units (A1 has none; not hash-guarded). An authored unit must equal its plan entry (id, key, title, level).
* Level stays derived from the parent unit (D-1); ids are explicit, never computed.

## 2. Schemas and ID conventions

* New A2 types: `PlannedUnit`, `A2PlacementItem` (+`band`), `TutorTemplate`, `LearnerInstruction` (in `src/data/a2/types.ts`), alongside the 6A `A2TestDef`, `A2TestQuestion`, `A2FinalTest`, `L10nStrict`.
* New empty modules: `placement.ts`, `tutor.ts`, `instructions.ts`. `LevelContent` gained `placement`, `tutorTemplates`, `instructions`, `plan`.
* Runtime schemas (`scripts/content-validate/rules/schema.ts`, table `A2_SCHEMA`) check every content type's data against its shape: required fields, types, enumerations, non-empty lists, per-kind exercise structure, noun/article, nested lines/questions/turns. Malformed data produces errors and never crashes the validator.
* ID conventions (`conventions.ts`, mirrored in `docs/authoring/A2_AUTHORING_GUIDE.md` §2; a test keeps both in agreement): warning while authoring, error in a release. Identity remains metadata, never parsed from ids.

## 3. RU/KY guarantees

Every localised field (including the new placement items, tutor templates, instructions and why-notes) is table-driven in `A2_LOCALIZATION`: both languages required, independently authored, never equal, no placeholders. `trStrict` returns nothing rather than the other language. Kyrgyz review sign-off is a separate release gate from Russian.

## 4. Validator integration

* `fullBundle()` reads every collection of every level from the catalog; a guard test fails if an exported A2 array is not wired into `LevelContent`, or a `LevelContent` key is missing from the bundle.
* New rules: plan integrity (`plan-*`), defined-unit-matches-plan (`unit-*-mismatch`, `unit-not-planned`), ID conventions (`id-convention`, `article-drill-source`), schema (`schema-*`, including "no item without a unit"), assessment (final tests not reusing revision exercises, one level test, placement definition/items/size/bands), tutor templates (identical placeholders in RU and KY, declared, unique ids), cross-unit references (`ref-cross-unit`).
* Release validation names every missing unit by its approved title and fails without an A2 level test; the CLI exits 1. `npm run content:validate:release` added.

## 5. Tutor preparation

Schemas and storage only (`TutorTemplate`, `LearnerInstruction`, validation of RU/KY parity and placeholders). No tutor logic changed; A1 tutor behaviour is covered by the Stage 0 oracle.

## 6. Test coverage

`tests/content-validate/{schema,infrastructure}.test.ts` plus the updated 6A suites: valid synthetic A2 world accepted; every required field removed and every wrong type/enum rejected; plan/identity/convention/assessment/template/cross-unit rules each exercised. Mutation check: every new rule's error downgraded in turn — all mutants killed. Synthetic fixtures live in `tests/` only and never ship.

## 7. Known limits

Automated checks cannot establish CEFR level or translation quality; human sign-off remains required. `placement-*` minimums are a calibration floor, not a validity proof. Convention rules guard names, not meaning.
