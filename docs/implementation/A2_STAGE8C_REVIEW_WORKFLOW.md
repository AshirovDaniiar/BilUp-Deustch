# A2 Stage 8C — human reviewer workflow

Documentation stage: makes the Stage 8A packages and the Stage 8B validated records usable by real German, Russian and Kyrgyz reviewers. No new executable infrastructure; one small defect of the Stage 8A packages was found while preparing the examples and fixed (§3).

## 1. Inspection

Stage 8A: `scripts/review/system.ts` (model, fingerprints, Markdown, records, `evaluateRecord`), `npm run review:system` → 30 packages (`docs/review/a2/packages/`) + 10 records files (`docs/review/a2/records/`). Stage 8B: `npm run review:validate` (`scripts/review/validate-records.ts`) → per-record field validation, stale detection, independence. Row `Ref` names, field names, rules and message formats used in the new documents were taken from the real packages and the real validator; the example records in the guide were validated against the real packages (temporary test, then removed).

## 2. Documents created

| File | Content |
| --- | --- |
| `docs/authoring/A2_REVIEWER_GUIDE.md` | who may review and what the software does **not** verify; independence; where the package and record are; how to read a package; Ref examples; how to write a finding (unique ids, exact Ref, severity, description, resolution status); record statuses and required fields; step-by-step workflow; running `npm run review:validate` with a sample output and common errors; fingerprints and stale approvals (what changes them, how to restore an approval honestly); valid findings, an approved record, a changes-requested record and invalid cases |
| `docs/authoring/A2_REVIEW_CHECKLIST_DE.md` | German / CEFR A2 checklist: context of the A2 sequence, vocabulary, grammar, listening, reading, speaking, writing, exercises and final test, whole unit; how to record |
| `docs/authoring/A2_REVIEW_CHECKLIST_RU.md` | Russian localization checklist: correctness and faithfulness, naturalness and register (ты/вы), terminology and explanations, vocabulary, exercises/tests/instructions, consistency |
| `docs/authoring/A2_REVIEW_CHECKLIST_KY.md` | Kyrgyz localization checklist: correctness, **independence from Russian**, naturalness and register (сен/сиз), terminology (glossary), vocabulary (loans vs. descriptions, administrative words, provisional dates), exercises, consistency |
| this report | |

All guidance is in English; no new Russian or Kyrgyz text intended for learners was written.

## 3. Defect found and fixed (Stage 8A output)

The Grammar example rows showed the example's `focus` note in the *Facts* column. That note is Russian-language metadata, so Russian text appeared in the **de-cefr** and **ky-localization** packages (e.g. "глагол в конце"), contradicting the rule that the Kyrgyz package shows no Russian. Fix: the focus note is no longer put into any package (`scripts/review/system.ts`, one line); the 30 packages were regenerated (fingerprints of packages with grammar examples changed — all records are still `pending` and empty, so nothing was invalidated); one test was added (`tests/review/review-system.test.ts`: no Russian `focus` text in any package). The existing Stage 8A test did not catch it because it checked vocabulary glosses and instructions only.

## 4. Statements deliberately made in the documents

* Reviewers must be real, qualified human beings (qualifications described per dimension).
* The software **does not verify identity or qualifications**; the name and qualification in a record are the reviewer's own statement; the AI-name check is only a safeguard.
* AI-generated content is never an approval; nobody may fill in a record on a reviewer's behalf.
* Approved records are **not** connected to `A2_REVIEWS` or release validation.

## 5. Results

| Check | Result |
| --- | --- |
| Review tests (`tests/review`) | 73 pass (Stage 8A, 8B, the added test and the earlier Unit 11 tests) |
| `npm run review:validate` | 10 files, 30 records, 0 errors, 0 warnings, valid approvals: 0 |
| `tsc` | clean |
| Guide examples | validated against the real packages and validator |
| Full suite | 70 files, 1997 tests pass |
| ESLint | 0 errors, 8 pre-existing warnings |
| Content validation | 0 errors, 0 warnings, 10 sign-off flags |

## 6. Boundaries respected

No educational content, A1, A2 visibility or release status, Level Test, Placement Test, AI Tutor, SAME_AS_RU, brackets or release gate was touched; records stay `pending`; nothing committed.

## 7. Remaining

Real reviewers must be found and given the package fingerprints of the agreed version; the authors need a routine to apply findings and regenerate packages (`npm run review:system`) and to freeze a content version while a review is in progress. Connecting valid approvals to the release gate remains a separate decision.
