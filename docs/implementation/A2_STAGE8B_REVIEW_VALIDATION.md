# A2 Stage 8B — review record validation

Adds `npm run review:validate`: a read-only check of the 30 hand-edited review records (`docs/review/a2/records/unit-NN.json`, units 11–20 × `de-cefr`, `ru-localization`, `ky-localization`). It **never approves, repairs or rewrites** a record, and it is **not connected** to `A2_REVIEWS` or release validation (informational; its output says so).

## Files

* `scripts/review/validate-records.ts` — `validateRecords` (pure, one file), `validateAll` (all ten files; injectable reader, facts, date), `formatIssue`.
* `scripts/review/validate-cli.ts` — the command; prints every issue, a summary line and the list of valid approvals; **exit 1 on any error**, 0 otherwise (warnings do not fail).
* `package.json` — one new script. Nothing else existing was modified (Unit 11 review tooling, Stage 8A system, `A2_REVIEWS`, validator, content, A1 untouched).

## What is validated

| Area | Rule |
| --- | --- |
| File | exists; valid JSON; an array of exactly three records, one per dimension (missing / duplicate / unknown dimension reported) |
| Fields | exactly `schema, unit, title, dimension, status, reviewer{name,qualification}, reviewDate, reviewedFingerprint, findings`; unknown or missing fields, wrong types, wrong `schema`, `unit` ≠ file number, `title` ≠ the unit title |
| Status | one of `pending`, `in_review`, `changes_requested`, `approved` |
| Reviewer | name required from `in_review` on; name **and** qualification required for `changes_requested` / `approved`; AI / bot / automated identities rejected (Claude, ChatGPT, GPT, Gemini, assistant, bot, …) |
| Date | ISO `YYYY-MM-DD`, a real calendar date, **not in the future**; required for `changes_requested` / `approved` |
| Fingerprint | required for `changes_requested` / `approved`, 12 lowercase hex characters |
| Findings | `id` non-empty and unique; `ref` must be a real row of **that unit's package of that dimension**; `severity` ∈ blocker / major / minor / suggestion; `comment` ≥ 3 characters; `status` ∈ open / resolved |
| Approval | no open blocker/major finding; `changes_requested` needs ≥ 1 open finding |
| Stale | `approved` with `reviewedFingerprint` ≠ the **current** fingerprint of that package = **error** ("stale approval: reviewed X, current Y — the content changed after the review"); on other statuses an outdated fingerprint is a warning |
| Warning | reviewer data or findings present while the status is still `pending` |

Messages have the form `ERROR   unit 20 · ky-localization · reviewDate: required when status is "approved" (YYYY-MM-DD)` — unit, dimension, field, reason / expectation.

## Independence

Each dimension is validated against **its own** package fingerprint and row references; a Russian fingerprint on a Kyrgyz record is stale. `validateAll` lists a dimension among the valid approvals only if *its* record has no error, so an approved Russian record neither approves Kyrgyz / German nor is invalidated by an error in another record. Nothing is derived from another dimension.

## Tests (`tests/review/review-validation.test.ts`, 23)

Valid records (initial, approval, in_review, changes_requested, approval with minor/resolved findings); invalid records (bad status, each missing reviewer detail, bad / impossible / future dates, malformed fingerprint, AI identities, invalid findings, unknown / missing fields, wrong unit/title/schema, wrong file shape, pending-with-data warning, message format); approval constraints; stale fingerprints (own dimension, another dimension's fingerprint, warning on non-approved); independence through `validateAll`; missing file / invalid JSON; the real repository records (all 30 valid, none approved) and the disconnection from the release gate. Tests use injected fingerprints, date and reader, so they are deterministic.

## Results

| Check | Result |
| --- | --- |
| `npm run review:validate` | 10 files, 30 records, 0 errors, 0 warnings, valid approvals: 0 |
| New tests | 23 pass |
| Full suite | 70 files, 1996 tests pass |
| `tsc` | clean |
| ESLint | 0 errors, 8 pre-existing warnings |
| `content:validate` | 0 errors, 0 warnings, 10 sign-off flags; release validation still exits 1 |
| Build | passes; entry bundle 579 763 bytes (unchanged), A2 chunk 844 176 (unchanged) |
| Prettier (scripts/review, tests/review) | clean |

## Limits and next steps

* Validation is only as good as the hand-written record: it cannot verify that a named person exists or holds the stated qualification, and the AI-name check is a heuristic.
* The check of `ref` uses the current package, so a finding on a row that a later content change removes becomes an error (intended: it must be re-evaluated).
* Connecting valid approvals to `A2_REVIEWS` / the release gate is **not** done and needs an explicit decision (which dimensions gate which locale; whether a stale approval blocks release — it already fails validation here).
* No review has taken place; every record is `pending`. Nothing was committed.
