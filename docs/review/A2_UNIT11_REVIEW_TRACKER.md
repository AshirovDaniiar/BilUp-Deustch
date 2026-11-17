# Unit 11 — review tracker

**Current state of every review in this file: NOT STARTED.** No reviewer has been identified, no review has taken place, and nothing here is approved. The authoring assistant never fills in this file: names, dates, statuses and sign-offs are entered **only by the people who performed the review**.

Packages to review (generated from the shipped content; copy the *package fingerprint* printed at the bottom of each package into the record below, so it is clear which version was reviewed):

| Package | File | For |
| --- | --- | --- |
| CEFR review package | `docs/review/A2_UNIT11_CEFR_REVIEW_PACKAGE.md` | a qualified German teacher |
| Kyrgyz review package | `docs/review/A2_UNIT11_KY_REVIEW_PACKAGE.md` | a native Kyrgyz speaker (language reviewer) |
| Russian text | the "Russian (source)" column of the Kyrgyz package, and the Russian explanations in the data | a native Russian speaker (needed for the release gate as well) |

Regenerate the packages after any content change: `npm run review:package` (the fingerprint changes with the content; a review of an older fingerprint does not cover the new content).

## Status values

`NOT STARTED` · `IN PROGRESS` · `APPROVED` · `CHANGES REQUESTED` · `REJECTED`

A section is **APPROVED** only when the reviewer has read it fully and has no required changes. **CHANGES REQUESTED** lists what must change (comments column). After changes the section is reviewed again; it is never approved "pending changes".

---

## 1. Review records

One block per review. Fill in by hand when the review actually happens; leave blank until then.

### 1a. CEFR review (qualified German teacher)

| Field | Entry |
| --- | --- |
| Reviewer name | |
| Qualification / role | |
| Review scope | ☐ whole unit  ☐ parts (list in §2) |
| Package fingerprint reviewed | |
| Review start date | |
| Review completion date | |
| Overall status | NOT STARTED |
| Is Unit 11 a suitable TEMPLATE for Units 12–20? | ☐ yes  ☐ yes, after the changes listed  ☐ no |
| Comments | |

### 1b. Kyrgyz language review (native speaker)

| Field | Entry |
| --- | --- |
| Reviewer name | |
| Qualification / role | |
| Review scope | ☐ all fields  ☐ parts (list in §3) |
| Package fingerprint reviewed | |
| Review start date | |
| Review completion date | |
| Overall status | NOT STARTED |
| Comments | |

### 1c. Russian text review (native speaker)

| Field | Entry |
| --- | --- |
| Reviewer name | |
| Qualification / role | |
| Review scope | |
| Package fingerprint reviewed | |
| Review start date | |
| Review completion date | |
| Overall status | NOT STARTED |
| Comments | |

---

## 2. CEFR checklist (CEFR review package)

| # | Section of the package | Status | Reviewer initials | Date | Comments / required changes |
| --- | --- | --- | --- | --- | --- |
| C1 | §3 Vocabulary inventory (37 items; active vs recognition split) | NOT STARTED | | | |
| C2 | §4 Grammar concept a2-perfekt-erfahrungen | NOT STARTED | | | |
| C3 | §4 Grammar concept a2-praeteritum-sein-haben-modal | NOT STARTED | | | |
| C4 | §4 Grammar concept a2-ereignisse-verbinden | NOT STARTED | | | |
| C5 | §5 Listening a2-li-11-01 | NOT STARTED | | | |
| C6 | §5 Listening a2-li-11-02 | NOT STARTED | | | |
| C7 | §6 Reading a2-re-11-01 | NOT STARTED | | | |
| C8 | §6 Reading a2-re-11-02 | NOT STARTED | | | |
| C9 | §7 Speaking task a2-sp-11-01 | NOT STARTED | | | |
| C10 | §8 Writing task a2-wr-11-01 | NOT STARTED | | | |
| C11 | §9 Revision exercises (8) | NOT STARTED | | | |
| C12 | §10 Final test (15 questions: level, key, distractors) | NOT STARTED | | | |
| C13 | §11 Decisions F1–F11 (confirm or overrule each) | NOT STARTED | | | |
| C14 | §12 Remaining CEFR questions (12 questions answered) | NOT STARTED | | | |
| C15 | §13 Overall recommendation | NOT STARTED | | | |

---

## 3. Kyrgyz checklist (Kyrgyz review package)

| # | Section of the package | Status | Reviewer initials | Date | Comments / required changes |
| --- | --- | --- | --- | --- | --- |
| K-A | §A Terminology used in the unit | NOT STARTED | | | |
| K-B | §B Nine unresolved items K4, K7, K8, K9, K12, K13, K14, K16, K18 (decide each) | NOT STARTED | | | |
| K-C | §C Corrections already applied (K1, K2, K3, K5, K6, K10, K11, K15, K17) — confirm | NOT STARTED | | | |
| K-1 | §1 Learning instructions (9) | NOT STARTED | | | |
| K-2 | §2 Unit title and subtitle | NOT STARTED | | | |
| K-3 | §3 Grammar explanations | NOT STARTED | | | |
| K-4 | §4 "Why?" notes | NOT STARTED | | | |
| K-5 | §5 Vocabulary translations (37 words + examples) | NOT STARTED | | | |
| K-6 | §6 Listening translations | NOT STARTED | | | |
| K-7 | §7 Reading glosses and grammar notes | NOT STARTED | | | |
| K-8 | §8 Exercise tasks and feedback | NOT STARTED | | | |
| K-9 | §9 Final-test prompts and feedback | NOT STARTED | | | |
| K-10 | §10 Speaking and writing guidance | NOT STARTED | | | |
| K-App | Appendix: three loading-state UI strings | NOT STARTED | | | |

Per-field decisions (✔ / correction) are written directly into the last column of the package tables; summarise the outcome per section above.

---

## 4. Resolution of requested changes

When a reviewer requests changes, the author records here what was done. Leave empty until then.

| Ref (C#/K-#) | Change requested | Change made (file / field) | Re-reviewed by | Date | Status |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

---

## 5. Final sign-off

Sign-off is **recorded only by a person**, and only after every row of the relevant checklist is APPROVED and all requested changes are resolved and re-reviewed.

| Sign-off | Reviewer (name) | Date | Package fingerprint | Final status |
| --- | --- | --- | --- | --- |
| CEFR (vocabulary, grammar, text difficulty) | | | | NOT STARTED |
| Russian | | | | NOT STARTED |
| Kyrgyz | | | | NOT STARTED |

### How a sign-off becomes technical

Only after the three rows above are completed by the reviewers, a person (not the authoring assistant) adds the record to `scripts/content-validate/reviews.ts`:

```ts
export const A2_REVIEWS = { 11: { cefr: true, ru: true, ky: true, reviewer: '<name(s)>', date: '<yyyy-mm-dd>' } }
```

Until then `A2_REVIEWS` stays `{}`, `npm run content:validate:release` keeps reporting `cefr-signoff-missing` for unit 11, and Unit 11 is **not** the approved template for Units 12–20.
