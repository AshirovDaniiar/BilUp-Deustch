# B1 QA checklist and risk assessment

**Status: PLAN, updated for curriculum v2 (Stage 2B).** Stage 1 infrastructure is implemented (see `tests/b1/b1-infrastructure.test.ts`); no B1 content exists; B1 is `planned`. The v2 curriculum is proposed, not approved; no official CEFR approval exists or is claimed. Sections A–N are the Stage 3 checklist; **sections O–Q are new for v2.** Used per stage of [`B1_IMPLEMENTATION_PLAN.md`](B1_IMPLEMENTATION_PLAN.md). Evidence of the current state: `npm run content:validate` → 0 errors, 0 warnings, 31 review flags (run during this audit, A2 Beta policy); A2 baseline per `docs/implementation/A2_BETA_RELEASE.md` §5 (76 files / 2121 tests at that time). **The full test suite was not run for this audit** (planning task); the working tree also holds unrelated staged storage changes (Plan blocker B-1), so a fresh baseline run is required before Stage B1.

Legend: ☐ to do · **[auto]** automated test required · **[man]** manual / human.

## A. Regression guard — A1 and A2 must not change
- ☐ Fresh baseline: `npm run check` on a clean tree before any B1 change; record counts.
- ☐ **[auto]** A1 regression set unchanged (`tests/regression/*`: content hashes, selectors, behaviour, bundle baseline `bundle-a1.json`).
- ☐ **[auto]** NEW A2 isolation baseline (hashes of A2 content modules, selector snapshot, `availableLevels` for ru/ky/de, rendered Beta notice string) recorded *before* B1 infrastructure and asserted after.
- ☐ **[auto]** A2 validator output identical: same 31 review flags, 0 errors, 0 warnings (profile refactor must be behaviour-neutral for A2).
- ☐ **[auto]** `levelOfRoute`/`levelsToLoad` for every A1 and A2 route unchanged.
- ☐ A1 pages never show "B1" (existing guard `tests/navigation/a1-world.test.tsx:252`); with B1 `beta`, level chips legitimately show "B1" for ru/ky — confirm what that test sets up and update only its legitimate expectation.

## B. Potential regressions (specific, from the code)
| # | Risk | Where | Test / action |
| --- | --- | --- | --- |
| R1 | B1 chunk **precached** (regex `a\d-content` doesn't match `b1-content`) | `scripts/pwa/vite-plugin.ts:17`, `scripts/regression/bundle-size.mjs:25` | **[auto]** build test: B1 chunk absent from precache, present in `lazy` |
| R2 | `lazy` expected length 1 in tests | `tests/data/lazy-chunk.test.ts:33-54`, `tests/pwa/lazy-cache.test.ts` | update with reason; assert both chunks lazy |
| R3 | Beta notice says "A2" on B1 | `ru.ts:74`, `ky.ts:39`, `de.ts:59` | **[auto]** B1 notice text names B1 only, A2 text identical to today |
| R4 | `/practice/tests/level-b1`/`placement-b1` direct link not loading the chunk | `routeAccess.ts:23` | **[auto]** `levelOfTestId`, `levelsToLoad` for those ids (visible vs planned vs German) |
| R5 | `isLevelContentLoaded` for `B1` returns `true` before it is registered (current `CONTENT[level] === undefined && level !== 'A2'` clause) → empty B1 treated as loaded | `catalog.ts:211` | **[auto]** B1 not loaded until `loadLevelContent`; chunk requested when visible |
| R6 | Deep link to unknown id loads **both** lazy chunks | `routeAccess.ts:88-90` | **[auto]** documents behaviour; decide on prefix rule |
| R7 | B1 items flagged "B1+ construction" by A2 heuristics → review-flag flood, masking real issues | `rules/cefr.ts:23-56,88` | **[auto]** profile tests: B1 Passiv/obwohl/Relativsatz not flagged, B2+ patterns flagged |
| R8 | A2 text-length limits flag every B1 text/listening | `rules/cefr.ts:57-60` | **[auto]** B1 profile bounds |
| R9 | Validator treats A2 as "the level that owns level-wide items" (placement items, templates) | `context.ts:23,60`, `rules/assessment.ts` | **[auto]** per-level ownership |
| R10 | `bundle.ts` registers only `A2_CONTENT`, so the CLI validates empty B1 | `scripts/content-validate/bundle.ts:35,41` | **[auto]** CLI sees B1 units |
| R11 | `PlannedUnit.level: 'A2'` literal blocks B1 plan | `src/data/a2/types.ts:39` | type-check |
| R12 | Boundary test forbids anything but the catalog importing a lazy entry; asserts a2 specifics | `tests/data/data-boundary.test.ts:163-169` | **[auto]** extend to `b1/*`: no runtime import from a2/A1; only catalog imports `b1-content` |
| R13 | Tests that encode "B1 is empty / not in COURSE / invisible" | `tests/data/catalog.test.ts:278-283,419`, `tests/progress/level-scoping-empty.test.ts:74,175`, `tests/answer-order.test.ts:264-265` | update only where the expectation legitimately changes; record reason |
| R14 | i18n key ratchet (key count / Kyrgyz = Russian count) | `tests/i18n.test.ts` | update baseline with reason; Kyrgyz = Russian count must not grow |
| R15 | Tutor: A1-only data (`GRAMMAR`, `WHY_NOTES`), `ctx.level === 'A1'||'A2'` branch | `services/tutor.ts:91` | **[auto]** B1 learner gets no A1/A2 content as "B1 answer"; or tutor hidden for B1 (disclose) |
| R16 | Unit-number / label assumptions (e.g. "10 units") in UI copy or tests | grep before Stage B1 | **[man]** UI review, **[auto]** `tests/navigation/unit-metadata.test.tsx` extended |
| R17 | `GrammarVisual` lacks passive/relative; visual components may assume known values | `src/data/types.ts` (`GrammarVisual`), `features/grammar/*` | inspect in Stage B3; **[auto]** every B1 concept renders |
| R18 | README is stale (says "levels A2–C1 locked", mentions v1 storage key) | `README.md` | docs-only follow-up; **do not** rely on it |

## C. Progress, persistence, isolation
- ☐ **[auto]** Unit ids 21–32 resolve to B1 (`levelOfUnitId`), 1–10 to A1, 11–20 to A2, 0/33+ to nothing.
- ☐ **[auto]** `levelProgress('A1'|'A2')` unchanged when B1 content is loaded; `levelProgress('B1')` counts only units 21–32 (pattern: `tests/progress/level-scoping-a2.test.ts`).
- ☐ **[auto]** Completion keys `21:vocabulary` … `32:test` do not collide with A1/A2; XP is global and unchanged by level.
- ☐ **[auto]** Saved words and mastery for `v21-…` ids survive a persistence round trip (pattern in `a2-beta-readiness`); no storage code changed (`git diff -- src/storage` empty for B1 commits).
- ☐ **[auto]** Stored `level: 'B1'` with B1 `planned` resolves to A1 and is **not** rewritten (rollback safety).
- ☐ **[auto]** `level-b1`/`placement-b1` result retention (protected ids) — existing test extended, no storage change.
- ☐ **[auto]** `activity.levelId: 'B1'` accepted by `validateResult` (`engine.ts:34`).
- ☐ **[auto]** Mistakes of B1 concepts are attributed to B1 only (`levelOfMistake`).

## D. Visibility, locale, navigation
- ☐ **[auto]** Matrix: planned → hidden for ru/ky/de; beta → visible for ru/ky only; de hidden even when `releasedLocales` lists both (pattern `a2-beta-readiness`).
- ☐ **[auto]** Every route type of Units 21–32 (learn unit, vocabulary study, topic, grammar, listening, reading, writing, speak, tests, review) × {ru, ky}: no "not found", no empty page, no `console.error` (> 150 routes per language for A2; same for B1).
- ☐ **[auto]** German interface: B1 URLs → "not found", **chunk not requested**.
- ☐ **[auto]** `LevelTabs`: three chips for ru/ky; Beta notice for A2 and B1, none for A1; switching level stores the preference and the dashboards/labs follow.
- ☐ **[man]** Mobile (≈ 360 px) and desktop layout of three level chips; Home "journey" with three nodes.
- ☐ **[auto]** Unknown ids (`unit-33`, `level-b2`) resolve to nothing.

## E. Lazy loading and PWA
- ☐ **[auto]** Production build: exactly two lazy chunks (`a2-content`, `b1-content`), entry bundle contains **no** B1 learning text (extend `LEARNING_TEXT`), `index.html` does not reference them.
- ☐ **[auto]** `pwa-build.json`: neither chunk in `precache`, both in `lazy`; `sw.js` lists both.
- ☐ **[auto]** `sw-core`: both cached on first successful use; stale hashed entry of either pruned on activate; opaque/non-200 responses not cached.
- ☐ **[auto]** `loadLevelContent('B1')`: rejects while `planned` (no preview), allowed with `preview` only when `import.meta.env.DEV`; idempotent; retry after failure.
- ☐ **[auto]** `levelsToLoad`: A1 routes → `[]`; B1 route in ru/ky → `['B1']`; A2 route does not request B1.
- ☐ **[man]** Offline after first B1 use: content available; offline before first use: retry UI shown (existing `LevelLoadFailed`).
- ☐ Bundle report (`bundle-size.mjs --compare`): entry bundle growth ≈ plan/registry only (< 5 kB); record B1 chunk raw/gzip (estimate in Architecture §3.6: 1.0–1.3 MB / 250–330 kB gzip — verify).

## F. Content validator (per unit and per level)
- ☐ **[auto]** `npm run content:validate`: 0 errors, 0 warnings; flags only the documented Beta review flags (12 CEFR + 24 locale + `beta-level-test-missing` if B-6 unchanged).
- ☐ **[auto]** `npm run content:validate:release` **stays red** until humans sign off (full-release safeguards not weakened; tested as for A2).
- ☐ **[auto]** Unit minimums per unit (28 vocab, 2–3 grammar, ≥ 2 listening, 1–2 reading, 1 speaking, 1 writing, ≥ 8 exercises, 15 final test); `size` = authored questions; one topic test per unit. **v2 raises the authoring *target* to 38–42 vocabulary per unit and the text ramp of `B1_CURRICULUM.md` §5 (see §O); the validator minimum stays 28 until the per-level profile exists (B-11).**
- ☐ **[auto]** Id conventions by prefix (`b1-…`, `v21-n`, `b1-ex-21-nn`, `b1-li-/re-/wr-`, `b1-sp-21-nn`, `b1-ft-21-nn`, `unit-21`, `level-b1`); ids unique across all levels.
- ☐ **[auto]** References: B1 references only B1 (`ref-cross-level`, `ref-cross-unit`); an A2 or A1 id in B1 data is an error.
- ☐ **[auto]** Strict localisation: every localised field has non-empty ru **and** ky, ky never merely a copy of ru (shared-token allow-list reviewed).
- ☐ **[auto]** Provenance (`source`) for reading, listening, grammar, speaking, writing; nothing invented.
- ☐ **[auto]** Answer-position distribution (3-option items: no concentration; shuffle verified per attempt).
- ☐ **[auto]** Per-unit grammar ceiling test (no later-unit/B2 structure) — pattern `tests/content-validate/unit-12.test.ts:386`.
- ☐ **[auto]** Concept coverage: every grammar concept has ≥ 2 final-test items and ≥ 1 exercise; ↻ items present.

## G. Localisation (RU / KY)
- ☐ **[auto]** No Russian text ever shown to a Kyrgyz learner on B1 screens (`trStrict`, `locStrict`), and none to German; a missing ky text is *not* replaced (pattern `tests/assessment/*`).
- ☐ **[auto]** New interface keys defined in ru, ky, de; placeholders identical; key-count ratchet updated.
- ☐ **[man]** Native Russian review of B1 explanations; **native Kyrgyz review** of grammar terminology (new glossary: Passiv, Konjunktiv II, Relativsatz, Plusquamperfekt, Genitiv, Nomen-Verb-Verbindungen…) — AI drafts are **never** presented as reviewed.
- ☐ **[man]** Kyrgyz text expansion/wrapping in grammar tables and buttons (long terms) on 360 px.
- Risks: heavier metalanguage (Konjunktiv II, Passiv) has no established Kyrgyz school terminology; ≈ 119 course-UI strings still Kyrgyz = Russian (A1 UI; not B1 but visible in B1 screens); Beta notice and new UI strings are unreviewed drafts.

## H. CEFR curriculum gaps (human work — not automatable)
- ☐ **[man]** CEFR-qualified teacher signs off each unit (`B1_CURRICULUM.md` D-1…D-10): boundary A2/B1, Konjunktiv-II forms, Plusquamperfekt, Passiv scope, Partizip-Adjektive, Futur I, Konjunktiv II der Vergangenheit.
- ☐ **[man]** Authenticity of text types (Leserbrief, Bescheid, Stellenanzeige…) and exam-format realism (Unit 32).
- Known gaps in the proposal itself: (1) **no lexical level check** exists or is invented — vocabulary level rests on human review only; (2) **speaking and writing cannot be assessed** for B1 by the rule-based engines (keywords, length, patterns); (3) B1 **spoken** skills (spontaneous interaction, longer turns) are only *practised* in scripted scenarios; (4) **listening authenticity** is limited to browser TTS (single voice, no natural speed/accent variety); (5) no pronunciation/phonology objectives beyond what A1/A2 offer; (6) Level and Placement tests do not exist for A2 either, so B1 has no entry/exit evidence.

## I. Assessment
- ☐ **[auto]** Each unit test = the unit's 15 authored questions in authored order, option order randomised per attempt, ru/ky strict (pattern `tests/assessment/prerequisites.test.tsx`).
- ☐ **[auto]** Pass = 70 % completes `${unit}:test`; 0 % completes nothing; repeats pay no XP.
- ☐ **[auto]** `level-b1` (when built): one definition, blueprint composition deterministic by seed, pass rule (70 % overall, ≥ 40 % per part) boundary tests, no XP, result stored with `kind: 'level'`, `parts`, `outcome`; "not a certificate; speaking and writing not measured" message in ru/ky.
- ☐ **[auto]** A1 placement result still does not claim B1 (`PracticeScreens.tsx:180` logic untouched).
- ☐ **[man]** No listening items in finals until real-device TTS verified.

## J. Manual and device verification (before Beta)
- ☐ iOS Safari, Android Chrome: German TTS voice availability, 120–220-word dialogues play fully (chunking ≤ 160 chars), stop/repeat controls, transcript fallback when no German voice.
- ☐ Speech recognition (Chrome/Edge) on B1 speaking scenarios; typed fallback elsewhere.
- ☐ Keyboard and screen-reader pass on a B1 unit (jsx-a11y warnings are tracked, not yet errors).
- ☐ Slow network / interrupted chunk load → retry UI; reload after failure.
- ☐ Long-session test: finish a whole B1 unit, reload, progress intact; switch A1 ↔ A2 ↔ B1 repeatedly.

## K. Disclosure and Beta-notice content
- ☐ Notice states: B1 is Beta, content under expert review, translations may change, feedback welcome (as A2); claims **no** CEFR or native-language approval (tested).
- ☐ Additional B1 disclosure to decide: speaking/writing feedback is automatic and limited; no AI tutor for B1; no placement/level test yet.

## L. Release gates
| Gate | Beta | Release |
| --- | --- | --- |
| Validator structural rules | 0 errors | 0 errors |
| Human CEFR (12), ru (12), ky (12) sign-offs | flags, not blocking | **required** |
| Level test `level-b1` | flag | **required** |
| Real-device TTS verification | recommended | required if listening is shipped |
| Owner approval | **required, explicit** | required |

## M. Required automated tests (new) — consolidated list
1. `tests/regression/a2-isolation.test.ts` (+ baselines) — A2 hashes/selectors/availability/notice text.
2. `tests/b1/b1-world.test.tsx` — B1 planned: invisible in ru/ky/de, direct URLs "not found", no chunk requested, A1/A2 unaffected (pattern `a2-world`).
3. `tests/b1/b1-beta-readiness.test.tsx` — Stage B6: routes × {ru,ky}, German hidden, notice, validator policy, round trips, production state.
4. `tests/data/lazy-chunk.test.ts` (extended) — two chunks, B1 text outside entry/precache.
5. `tests/pwa/lazy-cache.test.ts` (extended) — two lazy files.
6. `tests/data/lazy-level.test.tsx` (extended) — `loadLevelContent('B1')` rules, retry, idempotence.
7. `tests/data/data-boundary.test.ts` (extended) — `b1/*` import rules; only catalog imports `b1-content`.
8. `tests/data/catalog.test.ts` (updated) — B1 is registered; per-level isolation of selectors/indexes; no cross-level leakage.
9. `tests/navigation/route-access-b1.test.ts` — `levelOfTestId`, `levelsToLoad` matrix.
10. `tests/content-validate/profile.test.ts` — per-level profile; A2 unchanged; B1 heuristics.
11. `tests/content-validate/unit-21.test.ts … unit-32.test.ts` — per unit: minimums, ceilings, ids, localisation, test size, spiral items.
12. `tests/progress/level-scoping-b1.test.ts` — progress/mistakes/denominators scoped to B1; A1/A2 unchanged.
13. `tests/navigation/beta-notice-level.test.tsx` — text per level, A2 identical.
14. `tests/assessment/b1-*.test.tsx` — unit tests, level test (when built), localisation.
15. `tests/review/…` extended to units 21–32 (packages, records `pending`).
16. `tests/i18n.test.ts` (baseline update).
17. `tests/b1/v2-conformance.test.ts` (per-unit v2 counts/targets/strands, §O) · 18. `tests/b1/feedback-honesty.test.tsx` (§P) · 19. `tests/content-validate/profile.test.ts` is item 10 above (extended with the v2 ramp).

## N. Sign-off record (to be completed per stage)
| Stage | `npm run check` | A1 set | A2 baseline | New tests | Reviewer |
| --- | --- | --- | --- | --- | --- |
| B1 | ☐ | ☐ | ☐ | ☐ | — |
| B2 | ☐ | ☐ | ☐ | ☐ | — |
| B3a–k | ☐ | ☐ | ☐ | ☐ | — |
| B6 | ☐ | ☐ | ☐ | ☐ | owner |

---

# Additions for curriculum v2 (Stage 2B)

## O. v2 curriculum conformance (per unit, authored content)
Source of truth: `B1_CURRICULUM.md` §3–§8 and `B1_CURRICULUM_V2_APPROVAL.md` §3–§6. Any deviation is a recorded, approved change, never silent.
- ☐ **[auto]** Exactly **29** grammar concepts across Units 21–32 with the allocation 2/3/2/2/2/3/2/3/3/3/2/2; no unit has more than three; **no unit has two H (paradigm-heavy) concepts**; Unit 32 contains only the two revision/systematisation concepts and **no concept outside the approved list**.
- ☐ **[auto]** Each concept declares its proficiency (`P`, `P-lim`, `R`) and, for `P-lim`, its **closed list** (Präteritum ≈ 35 verbs, reflexive-Dativ ≈ 10, verb+Präposition ≈ 20, Nomen-Verb ≤ 20). Receptive-only constructions (Passiv Perfekt, Partizip I/II als Adjektiv, *sich lassen*, Konjunktiv II der Vergangenheit, *einerseits … andererseits*, *nicht nur … sondern auch*, *ohne … zu / statt … zu*, Genitivattribute R-first) **never appear in a production item** (fill/order/writing `mustInclude`/speaking keywords) — heuristic test + reviewer check.
- ☐ **[auto]** **Vocabulary 38–42 new productive items per unit**, with article/plural/ru/ky/example/`exampleKy`; **no A1/A2 lemma listed as new** (`lemma-repeats-earlier-level`, B-11); the unit's review set follows the spaced-revision rule (≥ 4 items from N−1, ≥ 2 from N−3, ≥ 2 from A2 in Units 21–24; *Wiederholungsblock* in Units 24, 28, 32).
- ☐ **[auto]** **Ramp** (reading, listening, sentence p95/max, speaking turns, writing `minWords`) within the `B1_CURRICULUM.md` §5 bounds for the unit's band; 2 readings and 2 listenings per unit; formal letters 60–80 words.
- ☐ **[auto]** **Strands present:** ≥ 3 communication-repair chunks per unit; a reading/listening-strategy note; Wortbildung from Unit 25; Meinung/Begründung micro-task from Unit 24; **mediation micro-tasks in Units 26, 28, 31**; comparison language in 22 and 29; each scenario has ≥ 1 unexpected element.
- ☐ **[auto]** **Required topics exist:** relationships/feelings (21, 25), book/film discussion (26), money/banking (27), school/Kita communication (28), emergency/police (31).
- ☐ **[auto]** Unit test: 15 items, grammar 6 (≥ 2 `fill`/`order`), vocabulary 3, reading 4 (3-option incl. *richtig/falsch/steht nicht im Text*), listening 2 **only if device verification is done**, else +2 grammar-in-context; ≥ 2 ↻ (one from A2 in 21–24); every concept ≥ 2 items.
- ☐ **[man]** Difference-from-A2 statement present in each unit's design notes (domain recurrence in 7 units).
- ☐ **[man]** CEFR reviewer confirms the ⚑ placements (approval dossier §8, D-1…D-15); no unit is described as "CEFR-approved".

## P. Assessment honesty and feedback (v2 requirements)
- ☐ **[auto]** **No B1 result screen, test result, notice or document claims a CEFR level, certificate or exam prediction.** Search test over ru/ky/de strings and B1 data for "CEFR", "B1 erreicht/achieved/достигнут", "сертификат", "certificate" etc. in a result context; the fixed statement of the approval dossier §7.6 appears on the `level-b1` result.
- ☐ **[auto]** **B1 speaking and writing show the learner checklist and "expected words used", not the numeric analyser scores** (B-9); A1/A2 behaviour unchanged unless the owner decides otherwise (regression test on A1/A2 `analyseSpeaking`/`analyseWriting` output).
- ☐ **[auto]** Every checklist, rubric and feedback string exists in **ru and ky independently**; no Russian text appears for a Kyrgyz learner on B1 feedback; German interface gets none.
- ☐ **[auto]** The self-assessment rubric (4 criteria × 3 learner-worded levels) renders after each writing and speaking task and stores nothing that changes XP/completion beyond the existing activity rules.
- ☐ **[auto]** `level-b1` (when built): 40 scored items (A 6 / B 14 / C 10 / D 6 conditional / E 4), result in **bands**, provisional thresholds, no XP, writing/speaking tasks unscored; protected retention (already supported).
- ☐ **[man]** Beta notice and Unit 32 text disclose: automatic feedback is limited; speaking/writing are self-assessed; vocabulary coverage is partial (B-10); mediation is partial; no official CEFR approval.
- Known risk: the existing analysers' score floors (speaking vocabulary 55 / fluency 60 / naturalness 50; grammar starts at 96; 19 A1-era patterns; Russian-only tips) make a numeric display misleading for B1 — see approval dossier §7.5.

## Q. Stage 1 results carried into later stages (recorded for traceability)
Stage 1 changed: `src/data/course.ts`, `src/data/catalog.ts`, `src/data/a2/types.ts` (type-only), `src/app/routeAccess.ts`, `scripts/pwa/vite-plugin.ts`, `scripts/regression/bundle-size.mjs`, `scripts/content-validate/bundle.ts` and `rules/identity.ts`, new `src/data/b1/*`, tests (`tests/b1/b1-infrastructure.test.ts`, extended lazy/boundary tests). Rows R1, R2, R4, R5, R10, R11, R12, R13 of §B are therefore **addressed by Stage 1**; R3 (Beta notice text), R6 (deep link loads both chunks — accepted for Beta), R7–R9 (validator profile/ownership), R14–R18 remain open. `npm run content:validate:release` reports 44 errors (31 for A2 as before + 13 for the unfinished planned B1).

## R. Approval and identity (Stage 2D)
- ☑ **[auto]** Owner approval of the **product design** is recorded (`approval.ts`: `recorded`, `scope: 'product-design'`, `cefrExpertVerification: 'pending'`); the dossier states it is **not** a CEFR approval (`tests/content-validate/b1-approval.test.ts`).
- ☑ **[auto]** `B1_UNIT_PLAN` holds the 12 approved identities (frozen-snapshot test); the dossier §2, the plan and the validator configuration agree (ids, keys, titles, concept counts); keys and ids follow the conventions (`B1_ID_CONVENTIONS.md`).
- ☑ **[auto]** The 29 concept ids, units, proficiency and load in `curriculum.ts` equal dossier §3; the nine ⚑ concepts carry `expertReview: pending` and, once authored, raise `b1-expert-review-pending`; **Genitivattribute is enforced as R** (no silent upgrade).
- ☑ **[auto]** B1 `planned`, `releasedLocales: []`, offered to no interface language; no B1 content; `B1_META` empty (it is authored with each unit: objectives need ru/ky texts that do not exist yet).
- ☐ **[man]** Independent CEFR expert verifies D-1…D-15 (B-13) — until then no document or UI may say B1 is "CEFR-approved".

## S. Unit 21 (Stage 3A) - verified
- [x] **[auto]** tests/b1/unit-21.test.ts (31): identity = plan; only the two approved concepts; 40 vocabulary items, none an A1/A2 lemma; band targets; scope guard (no later-unit constructions, no strong-verb Praeteritum outside the 35-verb list); exercises 8 + 2 recycled; final test 8/3/4/0 with positions 5/5/5; objectives de/ru/ky; revision ids real; validator clean; no CEFR/certificate claim; provenance "not reviewed".
- [x] **[auto]** tests/b1/unit-21-integration.test.tsx (9): while planned every route is not found and the chunk is not requested; with a test-only Beta every route resolves in ru and ky with no logged error; German never; writing and speaking show a checklist and self-assessment, no score bar or percentage.
- [x] **[auto]** tests/data/lazy-chunk.test.ts: Unit 21 lessons only in the b1 chunk (not in the entry bundle, not in the A2 chunk, not precached).
- [ ] **[man]** Real-device text-to-speech check of the two scripts (B-7); native Kyrgyz and Russian review; CEFR review of the texts; UI review of the checklist at 360 px.
