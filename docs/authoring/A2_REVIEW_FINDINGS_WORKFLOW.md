# A2 review findings and revision workflow

How reviewer findings (Stage 8A–8C records) are processed: evaluated by an author, decided, implemented, re-packaged and re-checked — traceably. For reviewers: `A2_REVIEWER_GUIDE.md`. For the design: `A2_HUMAN_REVIEW_SYSTEM.md`.

**All examples below are illustrative.** They are not real findings, decisions or approvals; no real review has taken place, and nobody — including tooling and AI — may invent one. The software does not verify the identity or qualifications of reviewers or authors.

## 1. Who writes what

| File | Written by | Contains | Rule |
| --- | --- | --- | --- |
| `docs/review/a2/records/unit-NN.json` | the **reviewer** (their own dimension's record only) | status, reviewer, date, fingerprint, **findings** | authors never edit a reviewer's finding text, severity or approval |
| `docs/review/a2/responses/unit-NN.json` | the **author / editor** | an **append-only history of decisions** about findings | created on the first decision; entries are never edited or deleted — a changed mind is a *new* entry |
| `src/data/a2/...` | the author | the corrected content | changed only for an accepted finding |
| `docs/review/a2/packages/*.md` | generated (`npm run review:system`) | the packages | never edited by hand |

Commands: `npm run review:validate` (records, Stage 8B), `npm run review:responses` (decisions, Stage 8D). Both are read-only and informational — **not** connected to `A2_REVIEWS` or release validation.

## 2. Lifecycle of a finding

1. **Created** by the reviewer: `{ id, ref, severity, comment, status: "open" }` in their record.
2. **Evaluated** by an author who reads the finding next to the row (`ref`) in the package.
3. **Decided**: the author appends a response (§3) with one of four decisions.
4. **Implemented** (accepted findings only): the author corrects the data files, runs `npm run review:system`, notes the change and the new package fingerprint in a new response entry (`implementation.status: "implemented"`).
5. **Fingerprints change** wherever the content of a package changed (§6); any earlier approval of that dimension is now **stale**.
6. **Re-check** by the reviewer, who reads the regenerated package, sets the finding `resolved` (or keeps it `open` with an added comment in a *new* finding), and updates `reviewedFingerprint` / `reviewDate` only after the real re-review.
7. Both validators pass; the record is `approved` for the *current* fingerprint.

A finding is never deleted. If a reviewer withdraws it, they set it `resolved` and say "withdrawn: <reason>" in a new finding or tell the author, who records it in a response. A response whose finding vanished from the record is an **error** (the tool says: restore it).

## 3. Author decisions

| Decision | Meaning | `rationale` | What happens next |
| --- | --- | --- | --- |
| `accepted` | the finding is right and the content will change | optional | implement; add a response with `implementation.status: "implemented"` |
| `rejected` | the author keeps the content | **required** (≥ 10 characters): why | the reviewer reads the rationale and either resolves the finding (agrees) or answers in a new finding |
| `needs_clarification` | the finding is unclear or two readings are possible | **required**: the question | the reviewer answers (new finding or an updated comment — then a new response is added, because the digest changes); then a new decision follows |
| `deferred` | right but not now (dependency, other unit, glossary decision) | **required**: reason and when / what it waits for | stays open; revisit by adding a new response |

A `blocker` or `major` finding must be decided before the reviewer can approve; an open blocker/major finding always prevents approval (Stage 8B). A rejected blocker/major finding stays open until the reviewer agrees.

### Response entry (`docs/review/a2/responses/unit-NN.json`, an array)

```json
{
  "schema": 1,
  "unit": 20,
  "dimension": "ky-localization",
  "findingId": "F2",
  "findingDigest": "<12 hex>",
  "decision": "accepted",
  "rationale": "",
  "decidedBy": { "name": "Example Author", "role": "content author" },
  "decisionDate": "2026-08-10",
  "implementation": { "status": "not_started", "description": "", "packageFingerprintAfter": "" }
}
```

* `findingDigest` = first 12 hex characters of SHA-256 of `ref|severity|comment` of the finding **at the time of the decision**. Do not compute it by hand: `npm run review:responses` lists every open finding that has no decision yet **together with its digest** (`undecided: unit 20 · ky-localization · F2 · findingDigest …`); copy it from there. If the reviewer later edits the finding, the digest no longer matches and the tool warns: add a new response.
* `decidedBy` must be a named person with a role; AI / bot names are rejected.
* `decisionDate` is a real, non-future date; entries for the same finding stay in date order.
* `implemented` needs a description of the change (data file, rows) and the **new** package fingerprint; only for `accepted`.
* The effective decision of a finding is its **last** entry; earlier entries remain as history.

## 4. What the validator `review:responses` checks

Responses array shape; unknown / missing fields; unit and dimension; the finding exists in **that dimension's** record (never matched across dimensions); digest; decision value; rationale rules; decider; date and date order; implementation rules; outdated implementation fingerprint (warning); findings resolved without any decision (warning). It also lists open findings that have no author decision yet. It never creates, edits or deletes findings or records.

## 5. Independence of the dimensions

* Findings, decisions, fingerprints and approvals are per **unit × dimension**. A decision about a Russian finding never closes a Kyrgyz finding, even if both concern the same German sentence — each reviewer's finding gets its own response.
* If two reviewers found the *same* German problem, the author fixes the German once and records a response for **each** finding.
* An approval in one dimension is never read as approval in another.

## 6. How a change affects the fingerprints and approvals

| Changed content | Fingerprints that change | Approvals that become stale |
| --- | --- | --- |
| **German source** text of a row that the localization packages show next to a translation (vocabulary word / example, grammar example, dialogue line, listening line, speaking turn, exercise / test prompt …) | `de-cefr` **and** `ru-localization` **and** `ky-localization` | all three |
| German-only row (reading paragraph, listening question, writing model, German options and answers) | `de-cefr` only | German only (but the translators may still be asked about the translated question if its German changed) |
| **Russian** text | `ru-localization` only | Russian only |
| **Kyrgyz** text | `ky-localization` only | Kyrgyz only |
| Nothing that a package shows (e.g. an internal id, a comment in code) | none | none |

A changed German source **requires re-review of the translations of that row**: the translation may now be wrong. Practical routine: the author fixes the German, then **also checks and, where needed, adjusts the Russian and Kyrgyz** (or asks the translators), and the reviewers of all three dimensions re-check the changed rows. Only then are the new fingerprints entered.

Stale detection: `npm run review:validate` reports `stale approval: reviewed <old>, current <new>` for an `approved` record whose `reviewedFingerprint` is not the current one.

## 7. Examples (illustrative only)

### 7.1 Accepted finding, implemented

Reviewer's finding (Kyrgyz record of Unit 20):

```json
{ "id": "F2", "ref": "a2-li-20-01#4", "severity": "major", "comment": "Sounds like a literal translation; natural wording: …", "status": "open" }
```

Author response 1 (decision):

```json
{ "schema": 1, "unit": 20, "dimension": "ky-localization", "findingId": "F2", "findingDigest": "<digest>", "decision": "accepted", "rationale": "",
  "decidedBy": { "name": "Example Author", "role": "content author" }, "decisionDate": "2026-08-10",
  "implementation": { "status": "not_started", "description": "", "packageFingerprintAfter": "" } }
```

The author edits `src/data/a2/unit20/texts.ts`, runs `npm run review:system`, reads the new `ky-localization` fingerprint from the package header, and **appends** response 2 (same finding, later date, `decision: "accepted"`, `implementation: { "status": "implemented", "description": "Reworded line 4 in unit20/texts.ts (ky)", "packageFingerprintAfter": "<new fingerprint>" }`). Response 1 stays.

### 7.2 Rejected finding with rationale

```json
{ "schema": 1, "unit": 20, "dimension": "de-cefr", "findingId": "F5", "findingDigest": "<digest>", "decision": "rejected",
  "rationale": "The chunk 'Wie wäre es mit …?' is the approved fixed expression (Stage 7B D-3); it is not taught as Konjunktiv II.",
  "decidedBy": { "name": "Example Author", "role": "content author" }, "decisionDate": "2026-08-11",
  "implementation": { "status": "not_started", "description": "", "packageFingerprintAfter": "" } }
```

The reviewer reads this and either sets F5 `resolved` (agrees) or adds a new finding with the objection.

### 7.3 Finding requiring clarification

```json
{ "schema": 1, "unit": 20, "dimension": "ru-localization", "findingId": "F3", "findingDigest": "<digest>", "decision": "needs_clarification",
  "rationale": "Which of the two readings of 'Termin' do you mean — appointment or deadline? Please add the wording you prefer.",
  "decidedBy": { "name": "Example Author", "role": "editor" }, "decisionDate": "2026-08-11",
  "implementation": { "status": "not_started", "description": "", "packageFingerprintAfter": "" } }
```

The reviewer clarifies in the finding's `comment` (the digest then changes and the tool asks for a new response) or in a new finding; the author then adds an `accepted` / `rejected` entry.

### 7.4 Stale approval after a content change

Kyrgyz record of Unit 20: `approved`, `reviewedFingerprint: "aaaaaaaaaaaa"`. The author corrects a German example sentence → all three packages of Unit 20 are regenerated; the Kyrgyz fingerprint is now `bbbbbbbbbbbb`. `npm run review:validate` prints:

```
ERROR   unit 20 · ky-localization · reviewedFingerprint: stale approval: reviewed aaaaaaaaaaaa, current bbbbbbbbbbbb — the content changed after the review; the approval no longer applies
```

The Russian and German approvals of the same unit are stale too (the German source changed), but a Kyrgyz-only edit would leave them valid.

### 7.5 Completed re-review

The Kyrgyz reviewer opens the regenerated package, compares the changed rows with their findings, sets the corrected findings to `"status": "resolved"`, and — only after really re-reading — sets `reviewedFingerprint: "bbbbbbbbbbbb"`, a new `reviewDate` and keeps `"status": "approved"`. Now `npm run review:validate` reports no error for that record, and `npm run review:responses` shows no undecided finding for it.

## 8. Rules of conduct

* Do not edit a package, a reviewer's finding or a reviewer's approval to "make it pass".
* Do not copy a new fingerprint into a record without the re-review.
* Do not decide on a finding on behalf of someone else, and do not record a decision under an AI or tool name.
* Keep the history: add entries, never rewrite them.
* Content corrections follow the usual authoring rules (tests, validation, no scope changes); this document does not authorise content changes by itself.
