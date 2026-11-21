# B1 Stage 2C — validator profile and content-quality infrastructure

The content validator now has a dedicated **B1 profile**. It is silent for today's content (no B1 lesson exists), A1/A2 output is unchanged, nothing in the application changed, and **no B1 identity was invented**: the curriculum is still awaiting owner approval. Nothing is committed.

## What was added
| File | Purpose |
| --- | --- |
| `scripts/content-validate/profile.ts` (new) | level profiles. A2's constants and "B1+" pattern table moved here **unchanged** (re-exported from `rules/cefr.ts`); new B1 profile: B2+ ceiling table (Passiv Perfekt, Konjunktiv II Vergangenheit, Futur II, Konjunktiv I, *es sei denn*, *ohne/statt dass*, *als ob*) and the five text **bands** of curriculum v2 (reading, listening, sentence p95/max, speaking turns, writing length) |
| `scripts/content-validate/rules/cefr.ts` | uses the profile: A2 behaviour and wording identical; for B1 the A2-calibrated length flags are skipped (the B1 rules answer instead) and the B2+ table is applied |
| `scripts/content-validate/rules/b1.ts` (new) | the B1 rule module (below), wired in `validate.ts`; produces **no issue** for a bundle without B1 content |
| `scripts/content-validate/b1/{types,approval,curriculum.provisional,lemma}.ts` (new) | curriculum configuration kept **apart from content and from approval**: provisional allocation (29 concepts / 12 units / per-unit requirements), the approval record (`recorded: false`; only a person may change it), lemma normaliser |
| `src/data/b1/meta.ts` (new) | the typed home of B1 unit metadata (objectives, productive/receptive classification, strands, micro-tasks, revision sets). `B1_META = []` — **empty**; never imported by the app |
| `scripts/content-validate/{types,bundle,validate}.ts` | bundle gets `b1Meta` / `b1Curriculum`; `b1Rules` runs last |
| `tests/content-validate/b1-fixtures.ts`, `b1-profile.test.ts` (new) | a compliant synthetic Unit-21 slot on top of the real A1/A2 content, and 49 tests |

## Validation capabilities (rule ids; each message ends with "Fix: …")
* **Vocabulary:** `b1-vocab-count` (38–42; warning while planned, error from beta); `b1-vocab-repeats-earlier-level` (a "new" B1 word that repeats an A1/A2 lemma — error, names both items; article/case/reflexive/gender-pair insensitive); `b1-vocab-duplicate-in-level`; documented new-sense allowances (`b1-vocab-allowance-note`, `-unused`).
* **Grammar allocation:** `b1-allocation-count` (per unit), `-overload` (two H), `-total` (> 29), `b1-unit32-new-grammar` (error); with the approval **recorded**: `-id`, `-missing`, `-classification`, `b1-closed-list-size`; **not recorded**: ids ignored, a different classification is only the review flag `b1-allocation-provisional-diff`, and one `b1-curriculum-unapproved` flag says so.
* **Productive vs receptive:** per concept `P` / `P-lim` / `R` (+ load, role, closed list, constructions with surface forms); `b1-proficiency-missing|invalid`, `b1-closed-list-missing`, `b1-receptive-required` (a receptive-only form required by a writing pattern, speaking keyword, gap-fill exercise or gap-fill test item; `receptiveThrough` lets a form become productive later), `b1-receptive-in-production` (a receptive concept practised by fill/order items).
* **Text and task targets by unit band:** `b1-reading-length` (incl. Unit 32 long + short), `b1-listening-length`, `b1-sentence-length` (max and 95th percentile), `b1-speaking-turns`, `b1-writing-length` (formal letters may be shorter), `b1-reading-count`, `b1-listening-count`, `b1-exercise-count`.
* **Lesson components and objectives:** `b1-meta-missing|-orphan|-duplicate`, `b1-objective-count|-invalid|-form` (2–3 can-do goals, one objective per skill, "Ich kann …" + ru + ky, Kyrgyz not a copy), final test `b1-final-composition` (6/3/4/2 or 8/3/4/0), `-production` (≥ 2 gap-fill), `-recycling` (≥ 2 ↻, one from A2 in Units 21–24); strands `b1-strand-repair|meinung|mediation|comparison`, `b1-topic-missing|-evidence`, `b1-bridge-recap`; spaced revision `b1-revision-missing|-size|-window|-unknown` (N−1, N−3, A2, Wiederholungsblock).
* **RU/KY parity (on top of the existing presence/copy checks):** `b1-parity-script` (no Cyrillic), `-numbers`, `-placeholder`, `-quoted` (German example quoted in one language only), `-length` (review).
* Structural wrongs are always errors; curriculum **targets** use `ctx.gate`: warning while B1 is planned, error from beta/release.

## Identity discipline
No permanent unit id, lesson id, vocabulary key or concept id was defined. `B1_UNIT_PLAN` and `B1_META` stay empty. The proposed concept ids in `curriculum.provisional.ts` are copied from the dossier and are **ignored by the validator while `B1_APPROVAL.recorded` is false** (a test pins that, and that the file agrees with the dossier's §3). To approve: a person edits `curriculum.provisional.ts` to the approved allocation, renames it, and sets `recorded: true`.

## Results (actual)
| Check | Result |
| --- | --- |
| New tests `tests/content-validate/b1-profile.test.ts` | 49 passed |
| Full suite | **78 files, 2197 tests passed** (was 77 / 2148) |
| `npm run content:validate` | 0 errors, 0 warnings, 31 review flags (unchanged) |
| `npm run content:validate:release` | 44 errors (unchanged since Stage 1: 31 A2 + 13 for planned B1) |
| `npm run typecheck`, `npm run build` | clean / built |
| `npm run lint` | 0 errors, the same 8 pre-existing warnings |
| `npm run format:check` | clean |
| `npm run boundaries:report` | the same 5 pre-existing violations (not enforced) |

## Limits
The validator checks structure and declared metadata, not language: it cannot establish that a text is B1, that a declared classification is *true*, or that a topic evidence item really covers the topic (it checks the item exists and belongs to the unit). Receptive-form detection relies on the surface forms the author declares. Cross-level spaced revision is validated only as authored id lists (B-12 is about the app, not the validator). The B1 text bands are the proposed curriculum's targets and change only with an approved curriculum change.
