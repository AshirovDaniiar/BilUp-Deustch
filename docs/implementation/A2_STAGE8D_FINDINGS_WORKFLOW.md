# A2 Stage 8D — review findings and revision workflow

Defines and (minimally) supports the controlled processing of real reviewer findings: evaluate → decide → implement → regenerate → stale approvals → re-review. Document: `docs/authoring/A2_REVIEW_FINDINGS_WORKFLOW.md`.

## 1. Inspection

* Stage 8A: packages and fingerprints per unit × dimension; records JSON (`pending` …). Stage 8B: `review:validate` — field validation, stale approvals, independence. Stage 8C: reviewer guide and checklists.
* **Gap found:** a reviewer record can say a finding is `open` or `resolved`, but there was **no place to record the author's decision** (accepted / rejected / clarification / deferred), no history, and nothing that detected a finding being silently edited or deleted after a decision. Changing the reviewers' record schema (strict in Stage 8B) was avoided.

## 2. Executable functionality added (justified by the gap)

Small, read-only, additive: `scripts/review/responses.ts`, `scripts/review/responses-cli.ts`, `npm run review:responses`, and the storage convention `docs/review/a2/responses/unit-NN.json` (an **append-only** array of decisions; the directory does not exist yet because there are no findings or decisions).

| Rule | Purpose |
| --- | --- |
| response must reference an existing finding of **the same unit and dimension** | findings cannot be deleted after a decision (error: "restore it"); no cross-dimension matching |
| `findingDigest` (SHA-256 of `ref|severity|comment`, 12 hex) | a finding edited after its decision is flagged (warning → add a new response) |
| decisions: `accepted`, `rejected`, `needs_clarification`, `deferred` | rationale (≥ 10 characters) required except for `accepted` |
| `decidedBy` named person + role; AI / bot names rejected; real non-future date; entries in date order | traceability; honest authorship |
| `implementation`: `not_started` / `implemented`; `implemented` only for `accepted`, needs a description and the regenerated package fingerprint; outdated fingerprint = warning | links a decision to the content change and the new fingerprint |
| several entries per finding = history; the last entry is the effective decision | nothing is overwritten |
| warnings: finding `resolved` without any author decision; list of open findings without a decision (with their digests) | process hygiene |

It never creates, edits or deletes a finding, a record, content or an approval, and it is **not** connected to `A2_REVIEWS` or release validation.

## 3. Documentation content

Lifecycle of a finding (8 steps); who writes which file; the four decisions with required rationale and next steps; response format; effect of changes on fingerprints and approvals (a table covering German source, German-only rows, Russian, Kyrgyz, internal changes) and the explicit rule that a German source change requires re-checking the Russian and Kyrgyz of that row; independence of the dimensions (one response per finding even for the same German problem); five illustrative examples (accepted, rejected with rationale, needs clarification, stale approval, completed re-review) clearly marked as **not real**; rules of conduct (no editing of packages or reviewers' findings, no fingerprint copied without re-review, history append-only).

## 4. Tests (`tests/review/review-responses.test.ts`, 16)

All four decisions; unknown decision; rationale rules; decider and AI names; dates; deleted finding; edited finding (digest); history order (needs_clarification → accepted → implemented, and going back in time); resolved without decision; implementation rules (description, fingerprint, only accepted, not_started empty, outdated); shape (unknown / missing fields, unit, non-array, bad dimension); binding to the dimension; independence of undecided findings; the real repository (no responses, nothing undecided, `A2_REVIEWS` empty).

## 5. Results

| Check | Result |
| --- | --- |
| `npm run review:responses` | 0 responses, 0 errors, 0 warnings, 0 undecided findings |
| `npm run review:validate` | 10 files, 30 records, 0 errors, valid approvals: 0 |
| Full suite | 71 files, 2013 tests pass |
| `tsc` | clean |
| ESLint | 0 errors, 8 pre-existing warnings |
| Content validation | 0 errors, 0 warnings, 10 sign-off flags |

## 6. Boundaries respected

No human finding, decision or approval was invented (no response file, every record `pending`); no educational content, A1, A2 visibility or release status, release gate, Level / Placement Test, AI Tutor, SAME_AS_RU or bracket change; Unit 11 tooling untouched; the only existing file edited is `package.json` (one script). Nothing committed. (Build and bundle were not re-run: no source under `src/` changed in this stage.)

## 7. Limits

* The tool cannot know that a content change *actually implemented* a decision; the description and fingerprint are the author's statement.
* Deleting a finding that never received a response is not detectable by the tool (there is no ledger of findings); the rule "findings are never deleted" relies on version control and process. A ledger would be a further, separate step.
* Reviewer / author identity and qualifications are not verified.
