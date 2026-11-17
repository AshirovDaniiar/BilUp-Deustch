# A2 Stage 7B — Curriculum design for Units 12–20: report

Scope: **documentation and one documents-only consistency test.** No application code, no production content, no A1 or Unit 11 change, no A2 runtime registry population, no visibility change, nothing committed. (The stage was interrupted twice by network errors; work was resumed from the working tree without overwriting completed files.)

## 1. Deliverables
| File | Content |
| --- | --- |
| `docs/authoring/A2_STAGE7B_CURRICULUM_DESIGN.md` | for each of units 12–20: purpose, 5 objectives, target tasks, vocabulary size, 2–3 grammar concepts (ids, prerequisites), 2 listening scenarios, 1–2 reading concepts, 1 speaking scenario, 1 writing task, **8 revision-exercise specifications** (3 fill / 3 choice / 2 order), **15 final-test specifications** (10 grammar / 3 vocabulary / 2 reading, ≥ 2 recycling items), RU/KY considerations, dependencies; then a cross-unit review (progression, duplication, missing scenarios, skill balance, distinct purpose, assessment coverage, early dependencies) |
| `docs/authoring/A2_STAGE7B_VOCABULARY_MAP.md` | **377 planned items** over units 11–20 (units 12–20: 340 new, 36–40 each, 28+ minimum), grouped by semantic category and marked productive / receptive; recycling plan; excluded topics |
| `docs/authoring/A2_STAGE7B_GRAMMAR_PROGRESSION.md` | all 25 new concepts + the 3 of unit 11: structure, prerequisites, new/extends/recycles, A2 suitability (core / upper / borderline), limits; progression map; recycling matrix; B1-risk register (8 items); dependency problems (5); excluded structures |
| `tests/authoring/curriculum-map.test.ts` (11 tests) | mechanical consistency of the three documents (see §3) |
| this report | |

Totals planned for units 12–20: **9 units × (8 exercises + 15 questions) = 72 exercise and 135 final-test specifications**, 18 listening and 18 reading scenarios (2 + 2 in every unit), 9 speaking and 9 writing tasks, 25 grammar concepts.

## 2. Corrections made at the start of this resumption
The vocabulary map's receptive counts were wrong in five units (declared vs. actual): unit 12 4→**5**, 13 5→**4**, 14 5→**4**, 17 6→**7**, 18 4→**6**. Headers, the totals table and the A2 totals (productive 332→**330**, receptive 45→**47**, total 377) were corrected from the actual item markings; no item was re-classified to make a number fit.

## 3. What the consistency test enforces (no assertion was weakened)
* units 12–20 each appear once with the approved title (from `A2_UNIT_PLAN`); the key appears in the design;
* every group size, productive/receptive split and unit total in the vocabulary map equals the actual items; ≥ 28 items per unit; ≤ 20 % receptive; the totals table matches;
* **no lemma is planned twice in A2, none equals an A1 word (read from the A1 data) or a Unit 11 word (read from the authored data)**;
* every unit has 4+ objectives, exactly 2 listening, 1–2 reading, 1 speaking, 1 writing, 2–3 grammar concepts;
* every unit has exactly 8 exercise specs numbered E1–E8, types 3/3/2, ≥ 2 per concept, and T1–T15 with skills 10/3/2 and ≥ 2 recycling items (↻);
* the unit's declared vocabulary size equals the map; every concept id appears in both the design and the progression document (unit keys are excluded because they are identity, not concepts) — one assertion in this check was *corrected* because it wrongly treated `a2-gesundheit` as a concept id; the strictness is unchanged.

## 4. Conflicts with the approved plan and Unit 11
* **None blocking.** The approved titles and keys are used verbatim; Unit 11 is not modified. Items noted, not hidden:
  * Unit 11 treats reflexive verbs only as chunks (decision F3); unit 12 teaches the reflexive pronoun and position — consistent, documented as I-3.
  * A1 already contains an A2-tagged Genitiv overview (unit 10); the plan does not extend Genitiv (B1-8).
  * A1 teaches **no** adjective endings, comparison, Imperativ, reflexive verbs, sollen/dürfen, or Präteritum; units 12–14 therefore carry the heaviest new-form load of the plan.
  * The vocabulary check compares *lemmas of vocabulary items*; words that appear only inside Unit 11 reading/listening texts are not part of the check.

## 5. Unresolved pedagogical decisions (need approval before Stage 7C)
| # | Decision | Plan as written | Alternative |
| --- | --- | --- | --- |
| D-1 | Imperativ in unit 14, although notices and instructions in 12–13 use it | chunks only in 12–13 | teach `a2-imperativ` in unit 13 |
| D-2 | `als` (temporal) in unit 17 — the plan's only B1-leaning item | keep with strict limits | teach `wenn` only; `als` receptive |
| D-3 | fixed polite chunks *Ich hätte gern*, *Wie wäre es mit …?* (Konjunktiv II forms taught as phrases, consistent with F5) | phrases only, no grammar claim | restrict to *Ich möchte …*, *Wollen wir …?* |
| D-4 | indirect questions (*Können Sie mir sagen, wo …?*) in unit 19 | keep (high frequency in service talk) | chunks only |
| D-5 | dürfen / *man* needed by the unit-13 *Hausordnung* before unit 14 | nominal notices only in 13 | teach `a2-sollen-duerfen` earlier |
| D-6 | reflexive Dativ (*sich die Zähne putzen*) | excluded | include as a fixed phrase in 14 |
| D-7 | verb + preposition set (six pairs) in unit 16 | six | fewer / more |
| D-8 | emergency / police line in unit 19 | not placed | add a short *Notfall* item |
| D-9 | no listening items in final tests (as unit 11) | reading and grammar only | allow ≤ 2 items using the `audio` field (needs a technical check of the quiz runner) |
| D-10 | Kyrgyz kinship terms and administrative/medical terms | glosses left to native reviewers | provide a terminology list first |
| D-11 | the productive/receptive split is not stored in the data model | recorded in documents and tests (as `UNIT_11_RECEPTIVE_WORDS`) | add a field to the vocabulary type (a data-model change, outside this stage) |
| D-12 | authoring order | 12 → 20 | author the heavy-grammar units (12–14) with a CEFR reviewer in the loop first |

## 6. Validation (nothing in the application changed)
| Check | Result |
| --- | --- |
| `tests/authoring/curriculum-map.test.ts` | 11 / 11 pass |
| Full suite | **59 files, 1541 tests pass** (7A.3: 58 / 1530; +1 file, +11 tests) |
| A1 regression oracle, level scoping, navigation, PWA, lazy-loading | included above; A1 baselines unchanged |
| `tsc --noEmit` | clean |
| ESLint | 0 errors, the same 8 pre-existing warnings |
| `content:validate` | 0 errors, 0 warnings, 1 review flag (unit 11 human sign-off still missing) |
| `content:validate:release` | fails as required (11 errors) |
| Boundaries | 5 baseline violations, 0 cycles |
| Production build | passes; entry 579 763 B, A2 chunk 83 127 B — **byte-identical to Stage 7A.2/7A.3** |
| Files changed since Stage 7A.3 | exactly: the three Stage 7B documents, this report and the test; **no file under `src/` or `scripts/`** |
| A2 | `planned`, `releasedLocales: []`, invisible; units 12–20 empty; no placement, level test or tutor content; `A2_REVIEWS = {}` |
| Human review | none: all CEFR statements above are the author's; Unit 11 is still not the approved template until the external reviews of Stage 7A.3 are done |

## 7. Next
Wait for approval of this design and the decisions D-1 … D-12. Stage 7C (not started) would be the authoring of the first designed unit(s) following the approved template.
