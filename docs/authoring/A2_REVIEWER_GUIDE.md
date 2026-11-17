# A2 reviewer guide

For the people who review the BilUp Til A2 course (Units 11–20). Read this first, then the checklist of your dimension:

* German / CEFR A2 → `A2_REVIEW_CHECKLIST_DE.md`
* Russian localization → `A2_REVIEW_CHECKLIST_RU.md`
* Kyrgyz localization → `A2_REVIEW_CHECKLIST_KY.md`

Background and the technical design: `A2_HUMAN_REVIEW_SYSTEM.md`.

## 0. Who may review — and what the software does not check

* **A reviewer must be a real, qualified human being.** German/CEFR review: a qualified German teacher or examiner experienced with CEFR A2. Russian review: a native Russian speaker with editorial or teaching competence. Kyrgyz review: a native Kyrgyz speaker with editorial, translation or teaching competence.
* **The software does not verify who you are or what qualifications you have.** It only checks that the record is complete, consistent and current (§8). The name and qualification you write are *your statement*; you are responsible for their truth.
* **AI-generated content is never an approval.** All A2 content is an AI-assisted draft. Nobody — and no tool — may fill in a record on a reviewer's behalf. A record signed by an AI or an automated process is rejected by the validator, and must be rejected by people too.
* One person may review more than one dimension only if they are genuinely qualified for each; each dimension still gets its own record and its own decision.

## 1. The three dimensions are independent

Each unit has three packages and three records. An approved Russian review says nothing about Kyrgyz or German; a change in the Kyrgyz text does not void a Russian approval. The Kyrgyz package deliberately does **not** show the Russian text: review the Kyrgyz on its own, as a Kyrgyz reader would read it.

## 2. Where things are

| What | Where |
| --- | --- |
| The package you review | `docs/review/a2/packages/unit-NN-<dimension>.md` (`NN` = 11 … 20; dimension = `de-cefr`, `ru-localization` or `ky-localization`) |
| The record you fill in | `docs/review/a2/records/unit-NN.json` — an array of three records; edit **only** the one whose `"dimension"` is yours |
| The checker | `npm run review:validate` |

Example: the Kyrgyz review of Unit 17 uses `docs/review/a2/packages/unit-17-ky-localization.md` and the record with `"dimension": "ky-localization"` in `docs/review/a2/records/unit-17.json`.

Packages are generated from the shipped content. **Do not edit a package** (or the course data) to fix a problem: write a *finding*; the authoring team changes the data and regenerates.

## 3. Reading a package

The header names the unit, the dimension, the **package fingerprint** and your question. Then come sections (Unit, Vocabulary, Grammar, "Why?" notes, Listening, Reading, Speaking, Writing, Revision exercises, Final test, and for the localization packages Learner instructions). Every table row has a **Ref** — the exact, stable name of that row.

* `de-cefr`: columns `Ref · Kind · German · Facts · A2? ✔/✘ · Comment`. *Facts* shows e.g. part of speech, **recognition** (receptive) or **active** vocabulary, the correct option marked ✔ and the grammar concept.
* `ru-localization` / `ky-localization`: `Ref · Kind · German (source) · <Russian|Kyrgyz> (under review) · Facts · OK? · Correction / comment`. The German is the source; you judge the localized text.
* The decision columns are empty on purpose and are only a working aid; **the JSON record is the official result.**

### Examples of Refs

| Ref | Row |
| --- | --- |
| `v20-5.word` | vocabulary item 5 of Unit 20: the word card (word / gloss) |
| `v20-5.example` | its example sentence |
| `a2-vorschlaege-verabredungen.example#1` | grammar concept, example 1 |
| `a2-vorschlaege-verabredungen.mistake#1` | grammar concept, mistake 1 |
| `a2-li-20-01#4` | listening dialogue `a2-li-20-01`, line 4 |
| `a2-re-20-01.q#2` | reading text `a2-re-20-01`, question 2 |
| `a2-sp-20-01.turn#1` | speaking scenario, turn 1 |
| `a2-wr-20-01.model` | writing task, model answer |
| `a2-ex-20-03.prompt` | revision exercise 3 |
| `a2-ft-20-12.prompt` / `a2-ft-20-12.why` | final-test question 12 / its explanation |
| `a2-in-20-unit` | the unit's learner instruction |

Copy the Ref **exactly** from the package; `npm run review:validate` rejects a finding whose `ref` is not a row of *your* package.

## 4. Writing a finding

A finding is one object in the record's `"findings"` array.

```json
{
  "id": "F1",
  "ref": "v20-5.example",
  "severity": "minor",
  "comment": "The example is correct, but 'Ich bringe ein Geschenk mit.' would be more natural with a time word.",
  "status": "open"
}
```

| Field | Rule |
| --- | --- |
| `id` | unique **within your record**; use `F1`, `F2`, … in order. Never reuse an id |
| `ref` | exact Ref of the row (see §3) |
| `severity` | `blocker` — wrong, misleading or unusable; `major` — must be corrected before approval; `minor` — should be corrected, does not stop approval; `suggestion` — optional improvement |
| `comment` | what is wrong and, if you can, the correction. At least 3 characters; be specific enough for the author to act without asking you |
| `status` | `open` when you write it; change to `resolved` **only after** you have re-read the corrected content (a new package) and are satisfied |

One finding per problem and per row. If the same error occurs in many rows, write one finding per row (or one for the first row and name the others in the comment) so that each can be resolved individually.

## 5. Statuses of a record

| Status | Meaning | Required fields |
| --- | --- | --- |
| `pending` | not started (initial) | nothing |
| `in_review` | you have started | `reviewer.name` |
| `changes_requested` | you finished and found problems | name, qualification, `reviewDate`, `reviewedFingerprint`, at least one **open** finding |
| `approved` | you finished and require no more changes | name, qualification, `reviewDate`, `reviewedFingerprint`, **no open blocker or major finding** |

Never set `approved` "pending corrections": if something must change, use `changes_requested`.

## 6. Workflow step by step

1. Get the repository state you were given (the authors will tell you which version). Open your package and **copy its fingerprint** (header, `Package fingerprint`).
2. Open the matching record file. Set `"status": "in_review"` and your `reviewer.name` (and, if you like, `reviewer.qualification`).
3. Review section by section with your checklist. Add findings as you go (ids `F1`, `F2`, …).
4. When finished:
   * problems found → `"status": "changes_requested"`, fill `reviewer.name`, `reviewer.qualification`, `reviewDate` (today, `YYYY-MM-DD`) and `reviewedFingerprint` (the fingerprint you reviewed);
   * nothing blocking → `"status": "approved"` with the same fields.
5. Run `npm run review:validate` and fix every `ERROR` (§7). Warnings are advisory.
6. Send the record file back to the authoring team. The authors correct the content, regenerate the packages (the fingerprint changes) and ask you to **re-review the changed rows** (§8).

## 7. Running the validator

```
npm run review:validate
```

It checks all 30 records. Output example:

```
ERROR   unit 17 · ky-localization · reviewDate: required when status is "approved" (YYYY-MM-DD)
ERROR   unit 17 · ky-localization · findings[2].ref: "v17-99.word" is not a row of the ky-localization package of unit 17
[review:validate] 10 files, 30 records · 2 error(s) · 0 warning(s) · valid approvals: 0
```

Each message gives the **unit**, the **dimension**, the **field** (`findings[2].ref` = the third finding) and the **reason**. Exit code 1 means at least one error. A dimension counts as validly approved only if *its own* record has no error. The tool is informational: it is **not** connected to the release gate.

Common errors: missing `reviewer.qualification`; date not `YYYY-MM-DD` or in the future; `reviewedFingerprint` not 12 hex characters; unknown extra field; duplicate finding id; `approved` with an open `major`/`blocker`; `changes_requested` without an open finding; a name such as "Claude" or "assistant" (rejected as an AI identity).

## 8. Fingerprints and stale approvals

The **package fingerprint** is a short hash of exactly the rows of your package. When you approve, you copy it into `reviewedFingerprint`: you state *which version* you reviewed.

* If the content changes in a way that affects your package, the regenerated package has a **new** fingerprint. Your record then says `approved` for the *old* fingerprint, and the validator reports `stale approval: reviewed <old>, current <new> — the content changed after the review; the approval no longer applies`. A stale approval is **not** an approval.
* A change in the German source changes all three fingerprints (every package shows it). A change in the Russian text changes only the Russian fingerprint; a change in the Kyrgyz text only the Kyrgyz one. So the Kyrgyz reviewer is not asked again when only Russian changed, and vice versa.
* To restore an approval: re-read the changed rows (compare with your findings), update `reviewedFingerprint` to the **new** fingerprint, update `reviewDate`, and keep `approved` — only if you really did the re-review.
* Never copy a new fingerprint into the record without having reviewed the new content. That would be a false approval.

## 9. Examples

### 9.1 A finished review that requests changes (Kyrgyz, Unit 20)

```json
{
  "schema": 1,
  "unit": 20,
  "title": "Pläne, Einladungen und gemeinsame Entscheidungen",
  "dimension": "ky-localization",
  "status": "changes_requested",
  "reviewer": { "name": "Example Reviewer", "qualification": "native Kyrgyz speaker, translator (illustrative text)" },
  "reviewDate": "2026-07-03",
  "reviewedFingerprint": "0123456789ab",
  "findings": [
    { "id": "F1", "ref": "v20-5.example", "severity": "minor", "comment": "Use the more common verb form.", "status": "open" },
    { "id": "F2", "ref": "a2-li-20-01#4", "severity": "major", "comment": "The sentence sounds like a literal translation; suggested wording: …", "status": "open" }
  ]
}
```

(`0123456789ab` is an illustration: always copy the real fingerprint from your package.)

### 9.2 An approved record (all findings handled)

```json
{
  "schema": 1,
  "unit": 20,
  "title": "Pläne, Einladungen und gemeinsame Entscheidungen",
  "dimension": "ky-localization",
  "status": "approved",
  "reviewer": { "name": "Example Reviewer", "qualification": "native Kyrgyz speaker, translator (illustrative text)" },
  "reviewDate": "2026-07-17",
  "reviewedFingerprint": "0123456789ab",
  "findings": [
    { "id": "F1", "ref": "v20-5.example", "severity": "minor", "comment": "Use the more common verb form.", "status": "resolved" },
    { "id": "F2", "ref": "a2-li-20-01#4", "severity": "major", "comment": "Literal translation; reworded.", "status": "resolved" },
    { "id": "F3", "ref": "a2-in-20-unit", "severity": "suggestion", "comment": "Optional: shorten the second sentence.", "status": "open" }
  ]
}
```

Valid because the status is `approved`, the details are complete, the fingerprint equals the current one and no blocker/major finding is open (open `minor` / `suggestion` do not block).

### 9.3 Invalid on purpose

* `"status": "approved"` with an open `major` finding → error on `findings`.
* `"reviewDate": "17.07.2026"` → error on `reviewDate` (expected `YYYY-MM-DD`).
* `"reviewer": { "name": "Claude", … }` → error on `reviewer.name` (AI identity).
* `reviewedFingerprint` of an older version → `stale approval`.

## 10. What happens next

Authors read the findings, correct the content (data files only — never the packages), regenerate the packages (`npm run review:system`), and send the new package; you re-review the changed rows, set findings to `resolved` and update the record. Approved records are **not yet** connected to the release gate; whether and how they will be is a later decision that does not change your task.
