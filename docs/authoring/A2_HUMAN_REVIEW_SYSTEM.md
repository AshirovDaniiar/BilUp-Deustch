# A2 human review system (units 11–20)

For the people who review the A2 course. **Nothing in this system approves anything by itself**: all content is an AI-assisted draft, every record starts as `pending` with empty reviewer fields, and an approval exists only when a person writes it into a record.

## 1. What is reviewed: three independent dimensions per unit

| Dimension | Reviewer | Package shows | Package does NOT show |
| --- | --- | --- | --- |
| `de-cefr` | qualified German teacher | all German content: vocabulary (with the receptive / active classification), grammar rules' German examples and mistakes, listening scripts, reading texts, speaking turns, writing model, exercises, final-test questions with the correct answer marked ✔ | Russian, Kyrgyz |
| `ru-localization` | native Russian speaker | every Russian field next to its German source (word cards, explanations, translations of dialogues, exercise/test prompts and explanations, instructions, tips) | Kyrgyz |
| `ky-localization` | native Kyrgyz speaker | every Kyrgyz field next to its German source | **Russian** — so a Kyrgyz text that is only a copy of the Russian cannot be hidden; the Kyrgyz must stand on its own |

The three reviews are independent: an approved Russian package never implies Kyrgyz or German approval, and a change of Kyrgyz text does not void a Russian review (see §5).

Files (generated, do not edit by hand):

* `docs/review/a2/packages/unit-NN-<dimension>.md` — 30 packages (units 11–20 × 3).
* `docs/review/a2/records/unit-NN.json` — 10 record files, three records each (the only files a reviewer edits).
* The older Unit 11 packages (`docs/review/A2_UNIT11_*`) and their fingerprints are unchanged; the new system is additive.

## 2. How to review one package

1. Open `docs/review/a2/packages/unit-NN-<dimension>.md`. The header names the unit, the dimension and the **package fingerprint** (12 hex characters).
2. Read every table row by row. Columns: `Ref` (stable id of the field), `Kind`, the German source, the text under review (localization packages), `Facts` (part of speech, receptive/active, correct answer, concept) and your decision column. Decision columns are empty on purpose; you may mark them in a copy, but the official record is the JSON file.
3. For each problem write a finding in the unit's record (`docs/review/a2/records/unit-NN.json`, the record whose `dimension` is yours):

```json
{ "id": "F1", "ref": "v20-3.example", "severity": "major", "comment": "Natural German would be …", "status": "open" }
```

Severities: `blocker` (wrong / unusable), `major` (must be corrected before approval), `minor` (should be corrected), `suggestion` (optional). `ref` is the row's `Ref` cell. Set `"status": "resolved"` when the content has been corrected and you have checked it.
4. Set the record's `status`:
   * `pending` — not started (initial state);
   * `in_review` — you have started (needs your name);
   * `changes_requested` — you finished and found problems (needs name, qualification, date, fingerprint and at least one open finding);
   * `approved` — you finished and have no open blocker/major finding.
5. To approve, fill **all** of: `reviewer.name`, `reviewer.qualification`, `reviewDate` (`YYYY-MM-DD`), `reviewedFingerprint` (copy it from the package you read), `status: "approved"`.

## 3. Rules that are enforced (`scripts/review/system.ts`, `evaluateRecord`)

* No name, qualification, valid date or fingerprint → **not approved**.
* A reviewer whose name looks like an AI or automated process (Claude, ChatGPT, GPT, Gemini, assistant, bot, …) → **not approved**.
* Open `blocker` / `major` findings → not approved. `changes_requested` needs an open finding.
* `reviewedFingerprint` must equal the **current** fingerprint of that package: if the content changed after your review the approval is **void (stale)**. Regenerate, review again, enter the new fingerprint.
* The generator never overwrites an existing records file; it never writes anything but `pending`.

## 4. Fingerprints

A fingerprint is a SHA-256 hash (first 12 hex characters) of exactly the rows of one package. It therefore changes when the German source of a row changes (all three packages that show it) and when the localized text of that dimension changes (only that dimension). It does **not** change when only the other language changes.

## 5. When content changes

After any content change run `npm run review:system`: packages are regenerated, new fingerprints are printed in the package headers, and a test (`tests/review/review-system.test.ts`) fails until the committed packages match the data. An approval with an old fingerprint is reported as stale. Review only the rows you are asked to re-review, then enter the new fingerprint.

## 6. What this system does not do

* It does not set `A2_REVIEWS` (the validator's release gate) — connecting verified records to that gate is a later, explicit decision.
* It does not change A2 visibility, release status, the level test, placement or the tutor.
* It is not a legal or institutional certification of anyone's qualification: the record only stores what the reviewer states.
