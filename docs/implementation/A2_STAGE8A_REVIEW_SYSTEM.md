# A2 Stage 8A — generalised human review system

## 1. Inspection (existing state)

* `scripts/review/unit-package.ts` (518 lines) takes a `unitId`, but its text is **Unit-11-specific** (F1–F11 questions, "pilot unit", applied corrections K1–K9, tracker references). Its fingerprints for units 11–20 are locked in tests and its Unit 11 packages are committed; nothing in it can serve as a neutral format for 12–20 without changing those locked outputs.
* Tracker and records for Unit 11 are hand-edited Markdown (`A2_UNIT11_REVIEW_TRACKER.md`); there was **no machine-readable record**, no status model and no rule for approvals. The only code concept was `A2_REVIEWS` (validator release gate: `cefr/ru/ky` booleans per unit), empty.
* Content structures (`catalog` selectors, `A2_CONTENT`, per-unit receptive lists, localization fields `ru`/`ky`) are uniform for units 11–20 and support generic generation.

Conclusion: the architecture supports a generic system **additively**; the Unit 11 tooling was left untouched (outputs, fingerprints and tests unchanged).

## 2. Architecture

| Piece | File | Role |
| --- | --- | --- |
| Snapshot | `collectUnit(u)` | deep copy of one unit's shipped data (tests mutate the copy) |
| Model | `buildModel(data, dimension)` | rows `{ref, label, source, value, note}` grouped in sections; `de-cefr` = German only; `ru-localization` / `ky-localization` = only rows that have a localized field, with the German source beside them; the other language is never shown |
| Fingerprint | `fingerprintOf(model)` | SHA-256 of `[unit, dimension, sections]`, 12 hex characters |
| Markdown | `packageMarkdown(model)` | reviewer-facing package (header, question, fingerprint, empty decision columns) |
| Records | `ReviewRecord` JSON per unit and dimension | status `pending / in_review / changes_requested / approved`, reviewer `{name, qualification}`, `reviewDate`, `reviewedFingerprint`, `findings[{id, ref, severity, comment, status}]` |
| Rules | `evaluateRecord`, `approvedDimensions` | approval needs a named human, qualification, ISO date, the current fingerprint, no open blocker/major finding; AI-like names rejected; stale approvals void; dimensions evaluated independently |
| Generator | `npm run review:system` (`scripts/review/generate-system.ts`) | writes 30 packages; writes a records file only if absent |

Output: `docs/review/a2/packages/unit-NN-<dimension>.md` (30 files), `docs/review/a2/records/unit-NN.json` (10 files, all `pending`). Reviewer guide: `docs/authoring/A2_HUMAN_REVIEW_SYSTEM.md`.

Duplication kept minimal: German-only content appears only in `de-cefr`; each localization package carries only its own language plus the German source of the rows it contains; Russian is deliberately absent from the Kyrgyz package.

## 3. Tests (`tests/review/review-system.test.ts`, 36)

All ten units build three packages with every required section and every item (vocabulary, grammar, listening lines, reading, speaking, writing, 8 exercises, 15 final questions, instructions); fingerprints are deterministic, differ per dimension, change with German changes (all three), with German-only changes (de-cefr only), with Russian-only (ru only) and Kyrgyz-only (ky only) changes; collected data is a copy; approval rules (missing name / qualification / date / fingerprint, AI names, stale fingerprint, findings, unknown status); independence of the three dimensions (an approval with another dimension's fingerprint does not count); no A1 id in any package; no Russian text in Kyrgyz packages and vice versa; Kyrgyz never equal to Russian beyond short glosses; committed packages equal the generated ones; every committed record is `pending` and empty; `A2_REVIEWS` empty; A2 planned and invisible; Unit 11 and Unit 20 review-package fingerprints unchanged.

## 4. Results


| Check | Result |
| --- | --- |
| New tests | 36 pass |
| `tsc` | clean |
| ESLint | 0 errors, 8 pre-existing warnings |
| Content validation | 0 errors, 0 warnings, 10 sign-off flags |
| Full suite | 69 files, 1973 tests pass |
| Prettier (scripts/review, tests/review) | clean |

## 5. Boundaries respected

No educational content, A1, A2 visibility or release status was changed; no level/placement test, tutor, `SAME_AS_RU` validator change or bracket removal; the Unit 11 review tooling and `A2_REVIEWS` are untouched; nothing committed. The only existing file edited is `package.json` (one new script).

## 6. Remaining

* Connecting verified records to the validator's release gate (`A2_REVIEWS`) is not implemented: a deliberate later decision.
* Records are plain JSON edited by hand; a validation CLI that lints a hand-edited record file (schema + `evaluateRecord`) is not provided (`evaluateRecord` is available to tests and scripts).
* Real reviewers must still be found; no review has taken place.
