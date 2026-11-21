# B1 implementation plan (updated for curriculum v2)

**Status: PLAN. Stages 1, 2A–2D are done: infrastructure, curriculum review, validator profile and the owner approval of the product design (2026-11-20; not a CEFR approval). No B1 content exists; B1 is `planned` with no released locale and invisible.** Updated after Stage 2B to the curriculum v2 ([`B1_CURRICULUM.md`](B1_CURRICULUM.md)), which is **proposed, not approved** ([`B1_CURRICULUM_V2_APPROVAL.md`](B1_CURRICULUM_V2_APPROVAL.md)). Audit records: [`B1_CURRICULUM_REVIEW.md`](B1_CURRICULUM_REVIEW.md), [`archive/B1_CURRICULUM_v1_STAGE0.md`](archive/B1_CURRICULUM_v1_STAGE0.md). Architecture: [`B1_ARCHITECTURE.md`](B1_ARCHITECTURE.md). QA gates: [`B1_QA_CHECKLIST.md`](B1_QA_CHECKLIST.md). Stage 1 report: `docs/implementation/B1_STAGE1_INFRASTRUCTURE.md`.

The sequence mirrors the A2 stages (`docs/implementation/A2_STAGE0…9C`): **infrastructure first, behind invisibility; then one unit per stage; Beta only at the end, by explicit owner approval.** No official CEFR approval exists or is claimed.

Rules for every stage: Claude Code only; A1/A2 content, Storage/Persistence and existing Beta visibility unchanged; no new dependencies; every stage ends with `npm run check`-equivalent results plus stage-specific tests and a report in `docs/implementation/B1_STAGE*.md`; **no commit unless the owner asks.**

## 0. Stage status

| Stage | Content | Status |
| --- | --- | --- |
| 0 | Audit and planning documents | **done** |
| 1 | Infrastructure (B1 registered `planned`, lazy loader, route ids, PWA/bundle regex, tests) | **done**, uncommitted (`docs/implementation/B1_STAGE1_INFRASTRUCTURE.md`; 77 test files / 2148 tests passed at that time) |
| 2A | Curriculum review (CEFR alignment, grammar audit, balance, assessment strategy) | **done** — verdict APPROVE WITH CHANGES |
| 2B | Curriculum v2 finalisation and approval dossier | **done** |
| 2C | Validator B1 profile and content-quality infrastructure | **done** (`docs/implementation/B1_STAGE2C_VALIDATOR.md`) |
| 2D | **Owner approval of the product design recorded**; permanent unit ids registered (`B1_UNIT_PLAN`, 12 entries); concept allocation enforced by the validator; id conventions fixed (`B1_ID_CONVENTIONS.md`); B1 still `planned`, `releasedLocales: []`, invisible | **done** (`docs/implementation/B1_STAGE2D_APPROVAL.md`) — **not an official CEFR approval** |
| 3A | Unit 21 authored and integrated (B1 still planned and invisible; Kyrgyz and CEFR review pending) | done (`docs/implementation/B1_STAGE3A_UNIT21.md`) |
| 3B | Unit 21 quality audit: 10 defects fixed; verdict PASS WITH CONDITIONS | done (`docs/implementation/B1_STAGE3B_UNIT21_AUDIT.md`) |
| B0′ | Authoring foundations (guides, glossary, closed lists, assessment design) | open — approval part done in 2D; closed lists and glossary need the expert (B-13, B-5) |
| B1b | Validator/feedback/tooling prerequisites | **partly done (Stage 2C):** validator B1 profile, vocabulary-overlap check, allocation/receptive/parity/component rules and tests (`docs/implementation/B1_STAGE2C_VALIDATOR.md`); still open: B-9 feedback, B-8 notice, B-12, A2 isolation baseline |
| B2 … B6 | Pilot unit, units 22–32, assessment, review system, Beta | not started |

## 1. Blockers and open questions (see approval dossier §9 for the authoritative table)

| # | Blocker | Blocks | Status |
| --- | --- | --- | --- |
| B-1 | Working tree not clean: 15 staged storage/app/test changes unrelated to B1; Stage 1 changes uncommitted | verifiable "Storage untouched"; clean branch | open — owner |
| B-2 | Owner approval of curriculum v2 and unit ids/keys/titles | registration, Unit 21 | **CLOSED (Stage 2D)** — product design approved by the owner, `B1_UNIT_PLAN` registered; **NOT a CEFR approval** |
| B-3 | A1 `genitiv` scope | Units 27/29 | evidence gathered (A1 = Überblick/recognition); owner/reviewer confirm (D-7) |
| B-4 | Human reviewer capacity (A2 0/30; B1 +36) | release beyond Beta | open |
| B-5 | Native Kyrgyz review of B1 grammar terminology + B1 glossary | authoring Units 24/25 | open |
| B-6 | Level/placement test decision | `level-b1` | open |
| B-7 | Real-device German TTS verification | listening items in tests | open |
| B-8 | Beta notice wording (level-aware) | B1 Beta | open (code) |
| **B-9** | **Misleading automated speaking/writing feedback** (score floors, A1-era patterns, Russian-only strings) | B1 Beta | open — code decision (hide scores, checklist, localise) |
| **B-10** | **Productive vocabulary ≈ 1 080 after B1** (partial lexical syllabus) | exam-readiness wording | open — disclosure + owner decision |
| **B-11** | Per-level validator profile and lemma-overlap check | authoring/validation | **DONE in Stage 2C** (profile, `b1-vocab-repeats-earlier-level`, B1 rules) |
| **B-12** | **Cross-level spaced revision** unsupported by level-scoped SRS/review | layer-2 revision | open — code decision or accept authored recycling |
| **B-13** | CEFR reviewer decisions D-1…D-15 | the ⚑ items | open |

**Blocks authoring (Unit 21):** B-1 (process: clean working tree). B-2 (Stage 2D) and B-11 (Stage 2C) are resolved. B-5 blocks Units 24/25; B-13 (independent CEFR expert verification of the ⚑ decisions D-1…D-15) stays open — authoring may proceed on the enforced defaults, and an expert decision later is a recorded curriculum change. Planning and Stage B0′ are not blocked.

## 2. Stage sequence

### Stage B0′ — Approval and authoring foundations (documents, no code)
1. Owner reviews `B1_CURRICULUM_V2_APPROVAL.md`; records APPROVE / APPROVE WITH CHANGES / REVISE (§10 there). A qualified German/CEFR reviewer decides D-1…D-15 and verifies the paraphrased descriptors.
2. On approval: write `docs/authoring/B1_AUTHORING_GUIDE.md` (A2 guide adapted: ids `b1-…`, `v21-n`, `b1-ex-21-nn`, `b1-li-/re-/wr-`, `b1-sp-21-nn`, `b1-ft-21-nn`, `unit-21`, `level-b1`; v2 targets), `B1_GRAMMAR_PROGRESSION.md` (the 29 concepts with prerequisites/limits; the reviewer's closed lists: Präteritum verbs ≈ 35, verb+preposition ≈ 20, Nomen-Verb ≤ 20, reflexive-Dativ ≈ 10), `B1_KY_TERMINOLOGY_GLOSSARY.md`, `B1_ASSESSMENT_DESIGN.md` (checklists, self-assessment rubric, `level-b1` blueprint), `B1_STRANDS_GUIDE.md` (repair chunks, mediation micro-tasks, strategies).
3. Register the approved `B1_UNIT_PLAN` (12 ids/keys/German titles) — **done in Stage 2D**; permanent.
* **Exit:** signed approval record; approved unit plan; closed lists.

### Stage B1b — Validator, feedback and tooling prerequisites (code; before Unit 21)
1. **Per-level validator profile** (`LEVEL_PROFILE`): A2 values = today's constants (A2 output byte-identical, tested); B1: reading/listening/sentence limits per the ramp (`B1_CURRICULUM.md` §5), B2+ heuristic patterns instead of the A2 "B1+" table; per-level ownership of level-wide items (`firstStrictLevel`, placement rule); level-parameterised messages. (B-11)
2. **`lemma-repeats-earlier-level`** warning (no A1/A2 lemma as new B1 vocabulary). (B-11)
3. **A2 isolation baseline test** (content hashes, selector snapshot, availability, notice text) — before any change that could touch A2. (Planned in Stage 1; **not yet done**.)
4. **Feedback decision implementation (B-9):** for B1 tasks, do not display numeric analysis scores as results; show the learner checklist and "expected words used"; localise every message in ru/ky; no CEFR label on any automated output. Needs an owner decision on whether the same disclosure is applied to A2. Keep the A1/A2 analyser behaviour unchanged unless the owner decides otherwise.
5. **Level-aware Beta notice** (key change in ru/ky/de, A2 rendering identical) + i18n baseline update. (B-8)
6. Decide B-12 (cross-level SRS) — either accept authored recycling (default) or extend `dueWordIds`/review to include earlier levels (A1/A2 behaviour must stay identical for A1/A2 learners).
* **Exit:** validator reports 0 new errors for A2 and for the empty planned B1; new profile tests green.

### Stage B2 — Pilot unit (Unit 21), invisible
Author Unit 21 end to end per v2: 38–42 words, 2 concepts (`b1-praeteritum-erzaehlen`, `b1-temporale-konnektoren`) with productive/receptive marking, 2 readings (100–130 words) and 2 listenings (110–130), 1 scenario (5 turns, one unexpected element), 1 writing task (minWords 70) + checklist/self-assessment, 8–10 exercises, 15 final-test items (≥ 2 ↻, one A2), strand items (repair chunk, reading strategy), spaced-revision set, ru+ky strict, sources. Load only through `loadLevelContent('B1', { preview: true })` (DEV/tests); level stays `planned`. Generate review packages (de-cefr / ru / ky) via the Stage 8A generator extended to B1. **Exit:** pilot validates with 0 errors; learning text only in the lazy chunk (extend `tests/data/lazy-chunk.test.ts`); human review requested; pilot checked against the v2 targets (ramp, vocabulary, productive/receptive).

### Stages B3a–B3k — Units 22–32 (one stage per unit, invisible)
Order = curriculum order. Per unit: content per v2, final test, `docs/authoring/B1_UNITNN_DESIGN_NOTES.md` (incl. "difference from A2-Unit N"), `tests/content-validate/unit-NN.test.ts` (ceiling test: no later-unit/B2 structure; receptive-only items never required in production items), review packages, stage report. Gates: previous unit 0 validator errors; ≥ 2 ↻ items; spaced-revision block present (Units 24, 28, 32: *Wiederholungsblock*); strands present (repair chunks every unit; mediation micro-tasks in 26, 28, 31; money/banking 27; school/Kita 28; book/film 26; relationships 25).
Checkpoints: after Unit 24 and Unit 26 (bundle size, Passiv/Konjunktiv II terminology review, Kyrgyz glossary update). Unit 32: **no new grammar system**; the two concepts are systematisations; exam-preparation material is practice only.

### Stage B4 — Assessment (can run in parallel after Unit 21)
Implement (for A2 and B1, one design) the pure functions `buildLevelTest(blueprint)` and `levelOutcome`; storage already supports the optional result fields (no storage change). Author `level-b1` (40 scored items: A 6, B 14, C 10, D 6 conditional, E 4) as an **indicative placement/progress instrument** with the fixed non-certificate statement (approval dossier §7.6); bands not exact scores; thresholds provisional until a learner pilot; no XP; writing/speaking companion tasks unscored and self-assessed. Optional 10-item A2→B1 readiness check. B1 Beta may ship without it (B-6).

### Stage B5 — Review system and release dossier
Extend `scripts/review/*` to units 21–32 (packages, records `pending`, validation); **no approval is ever written by code.** Write `docs/implementation/B1_BETA_RELEASE.md`: policy, limitations (§4), rollback.

### Stage B6 — Controlled Beta (owner approval required)
1. Explicit written owner approval (as for A2).
2. Change only `course.ts`: `{ id:'B1', status:'beta', releasedLocales:['ru','ky'] }` (German never).
3. Update exact-list expectations (`availableLevels`: ru/ky `['A1','A2','B1']`, de `['A1']`).
4. `tests/navigation/b1-beta-readiness.test.tsx` (all routes of Units 21–32 in ru and ky via the real app and lazy chunk; German hidden; notice; validator Beta policy; progress round trip; production state).
5. Full suite, build, bundle report, real-device checks (QA §J).
**Rollback:** `status: 'planned', releasedLocales: []`; no content/storage changes; a stored `level: 'B1'` resolves to A1.

## 3. Test plan summary
Reuse: `tests/navigation/a2-world.test.tsx`, `a2-beta-readiness.test.tsx`, `tests/data/lazy-chunk.test.ts`, `lazy-level.test.tsx`, `tests/pwa/lazy-cache.test.ts`, `tests/content-validate/unit-NN.test.ts`, `tests/progress/level-scoping-*.test.ts`, `tests/assessment/*`, and the Stage 1 file `tests/b1/b1-infrastructure.test.ts`. New (see QA §M, §O): A2 isolation baseline, validator-profile tests, v2 conformance tests per unit (counts, ramp, productive/receptive, strands, spaced revision), feedback-honesty tests (no CEFR label, no numeric score as result for B1, ru/ky strings), level-aware notice, two-chunk PWA tests (done in Stage 1).

## 4. Known limitations to disclose at Beta
AI-assisted drafts without human CEFR/ru/ky review; **no official CEFR approval**; partial lexical syllabus (≈ 1 080 productive words after B1; B-10); speaking/writing practised and self-assessed, not scored (B-9); existing automated feedback is limited (score floors, A1-era patterns, Russian-only strings) and is not shown as results for B1; mediation covered by micro-tasks only; no level/placement test unless B-6 changes; no AI tutor for B1 (the tutor is A1-only); listening via browser TTS with device verification pending; A2 words not revised automatically inside B1 (B-12); ~119 Kyrgyz course-UI strings still identical to Russian (A1 UI); the final assessment is indicative, not a certificate.

## 5. Out of scope
B2/C1; German-interface B1; placement test beyond the optional readiness check; backend; subscription/pricing; any change to Storage, Persistence, recovery or merge; any change to A1/A2 content.
