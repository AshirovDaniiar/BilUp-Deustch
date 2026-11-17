# A2 Stage 7A.3 — Unit 11 independent-review preparation

Scope: documents, a generator and tests only. **Unit 11 content, A2 visibility, storage, progress and A1 are unchanged** (the production bundle is byte-identical to Stage 7A.2: entry 579 763 B, A2 chunk 83 127 B, same chunk hash). Nothing committed; Unit 12 not started.

## Deliverables
| File | Purpose |
| --- | --- |
| `docs/review/A2_UNIT11_CEFR_REVIEW_PACKAGE.md` | for a qualified German teacher: objectives, context (what A1 already taught), vocabulary inventory with active/recognition split, 3 grammar concepts (examples, mistakes, dialogues), both listening dialogues and both readings in full, speaking and writing tasks, 8 exercises, all 15 final-test questions with keys, F1–F11 decisions (confirm/overrule), 12 remaining CEFR questions, empty verdict tables |
| `docs/review/A2_UNIT11_KY_REVIEW_PACKAGE.md` | for a native Kyrgyz reviewer: terminology table, the nine unresolved items (K4 K7 K8 K9 K12 K13 K14 K16 K18) with proposals, the nine applied corrections to confirm, then all **272** Kyrgyz fields in ten sections (instructions, grammar, why-notes, vocabulary, listening, reading glosses, exercises, final test, speaking/writing) with German/Russian source and an empty "✔ / correction" column; appendix with the three loading-state UI strings |
| `docs/review/A2_UNIT11_REVIEW_TRACKER.md` | review records (CEFR, Kyrgyz, Russian), 15 CEFR + 14 Kyrgyz checklist rows, change-resolution log, final sign-off table and how a sign-off becomes technical (`A2_REVIEWS`). Everything is `NOT STARTED` / blank |
| `scripts/review/unit-package.ts`, `generate.ts`, `npm run review:package` | the packages are **generated from the shipped data**, each ends with a content **fingerprint** (hash) that reviewers copy into the tracker, so a review always refers to an exact version |
| `tests/review/review-package.test.ts` (13 tests) | committed packages equal the current content (drift guard); every vocabulary item, example, dialogue line, reading paragraph, exercise, question and Kyrgyz field is present; decision columns are empty; the tracker contains no name, date, fingerprint, ticked box or status other than NOT STARTED; `A2_REVIEWS` is `{}` |

## Verification (content unchanged)
| Check | Result |
| --- | --- |
| Full tests | 58 files, **1530 pass** (7A.2: 57 / 1517; +13) |
| `tsc` | clean |
| ESLint | 0 errors, the same 8 pre-existing warnings |
| Localization / content validation | 0 errors, 0 warnings, 1 review flag (`cefr-signoff-missing`, unit 11) |
| Release validation | fails as required (11 errors: unit 11 sign-off, units 12–20 missing, no level test) |
| A1 regression oracle, level scoping, navigation, PWA built-artifact tests | pass; baselines unchanged |
| Boundaries | 5 baseline violations, 0 cycles |
| Build / bundle | passes; entry 579 763 B (gzip 182 583), A2 chunk 83 127 B (gzip 22 466) — identical to 7A.2 |
| A2 status | `planned`, `releasedLocales: []`, invisible; units 12–20 empty; no placement, level test or tutor content |
| Human review | none recorded: `A2_REVIEWS = {}`, tracker all `NOT STARTED` |

## Next
Send the two packages to the external reviewers; they fill the package tables and the tracker; the author applies requested changes (re-run `npm run review:package` — the fingerprint changes), the reviewers re-review, and only then a person records `A2_REVIEWS[11]`. **Unit 11 is not the approved template until that happens.**
