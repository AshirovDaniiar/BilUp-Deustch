# 08 — Migration Roadmap

Part of the BilUp Til 2.0 set ([01](01_PRODUCT_ARCHITECTURE.md)). Phased, incremental migration from the existing BilUp Deutsch MVP (HEAD `386c6a1`) to the architecture in docs 01–07, 09, 10 and 11. **Revision 3** adds P8b (subscriptions and entitlements), P8c (BilUp Live), decision records S-D and L-D, and the rule that no recording exists anywhere. **Revision 2** adds the decisions-and-staffing gate G0, the parallel Kyrgyz/Russian translation track K, PWA-lite (P0b), staged localization rollout, and the P9-D prerequisite for real transactions (see ARCHITECTURE_CHANGELOG.md). **No application code is changed by this documentation task**; this roadmap describes *future* work. Finding ids **V-xx** refer to the register in 01 §3; question ids **Qn** to 01 §9. Sizes (S/M/L) are relative complexity **[A]**, not time estimates — staffing is unknown.

---

## 1. Migration approach (strangler, no big-bang)

1. **The app stays shippable after every phase.** Each phase merges behind tests; no long-lived rewrite branch.
2. **Characterise before changing.** Golden/characterisation tests capture today's behaviour (SRS transitions, question builders, analyzer outputs, resolved screen text) so "preserve" is verifiable (07 §7).
3. **Adapters over rewrites.** Old modules are wrapped behind the new ports first (e.g. `ProgressPort` over the old context), then internals are replaced and the old code deleted.
4. **One concern per phase**, with an explicit exit gate. Content authoring (P7) runs as a parallel track once its prerequisites exist.
5. **Feature flags** for anything user-visible and risky (new onboarding, medium shell, PWA, marketplace).
6. **Data safety first:** storage changes (P1, P2) always keep the legacy key intact and tested rollback (05 §11).

### 1.1 Release slices (from 01 §7)
| Slice | Phases | Meaning |
|---|---|---|
| **G0** Decisions & staffing gate | before any implementation | no code; approvals listed in §3 G0 |
| **R0** Stabilised MVP | P0–P1 | CI, tests, integrity fixes, safe persistence |
| **R0b** Installable (lite) | P0b | manifest, icons, minimal app-shell service worker; hash routing unchanged |
| **R1a** Multilingual German — **Russian first** | P2 + P3 (ru track) | four independent settings, `de-general` pack, strict locale policy for Russian after gate G-ru; Kyrgyz users stay on the *disclosed legacy mode* |
| **R1b** **Kyrgyz** | P3 (ky track) | Kyrgyz becomes **publicly selectable only after gate G-ky** (completeness + native-review quality, 04 §7.3); internal/closed preview before that |
| **R1c** Professional experience | P4–P5 | engine consolidation, onboarding, responsive tablet, accessibility |
| **R2** Offline | P6 | offline course packs, update flow |
| **R3** Courses | P7 (P7a language pack, P7b English A1, P7c+ A2–B2) | per-level, per-locale releases |
| **R4** Accounts & sync | P8 | backend foundation (minimal) |
| **R4b** Subscriptions | P8b | plans/plan versions (BilUp Basic 99 KGS, BilUp Premium Live 149 KGS — configuration), subscription lifecycle, entitlements, fake payments, AI-tutor limits, entitlement-gated paid content; **no live charge before decision record S-D** |
| **R4c** BilUp Live | P8c | weekly German/English Live sessions, token-gated join, interactions, moderation, attendance; **no recording**; fake provider until **L-D** |
| **R5** Marketplace | P9 (P10 later; independent of R4b/R4c) | fakes/sandbox first; **real transactions only after decision record P9-D** |

---

## 2. Dependency graph

```
G0 Decisions & staffing gate (approve MLS, staffing, glossary, pilot, decision plan for Q7–Q11)
 ├─► Track K  Kyrgyz/Russian translation foundation  (starts here; runs through P0–P3; needs no code dependency on P2)
 └─► P0 Safety net
      ├─► P0b PWA-lite (installability)           ── independent of P1–P5; kill-switch; may ship before/after R0
      └─► P1 Progress integrity & storage  ───────────────┐
           └─► P2 Language & course model (feature-flagged; legacy i18n path isolated)
                ├─► P3 Content pipeline & localization  ◄── Track K deliverables (G-ru, then G-ky)
                │     ├─► P4 Learning Engine consolidation (also needs P1)
                │     ├─► P6 PWA offline packs (also needs P5)
                │     └─► P7 Content expansion: P7a English language pack → P7b English A1 → P7c… (per level/locale gates)
                └─► P5 Responsive UX & accessibility (also benefits from P4; router decision at start)
P1 + P2 ──► P8 Backend foundation (identity, profile, opt-in sync — minimal)
P8 + P3 (packs to gate) (+ decision record S-D for real charges) ──► P8b Subscriptions & entitlements (BilUp Basic / BilUp Premium Live as configuration)
P8b + P5 (+ decision record L-D for a real provider/pilot) ──► P8c BilUp Live (never recorded)
P8 + P5 (+ decision record P9-D for real transactions) ──► P9 Marketplace (P9a–P9c on fakes/sandbox; P9d gated; shares only the low-level `payments` module with P8b) ──► P10
(P9 does not depend on P8b/P8c; recommended order is P8 → P8b → P8c → P9 because subscriptions are the revenue core and P8b introduces the shared `payments` module, outbox and job runner.)
```
Critical path to R1a: G0 → P0 → P1 → P2 → P3(ru). Critical path to R1b: Track K quality gate G-ky (staffing-bound). The language-model design spike for P2 (types, registries, settings contract) may begin during P1 but must not change storage formats until P1's migrator exists. **No phase removes the legacy Russian-fallback path before its replacement passes the relevant release gate** (02 §5.3).

---

## 3. Phases

### G0 — Decisions and staffing gate (no code) *(new — review H-6)*
| | |
|---|---|
| **Goal** | Approve the scope, people and decisions that the schedule actually depends on, **before implementation planning commits dates** |
| **Prerequisites** | Documents 01–09 (revision 2) reviewed |
| **Decisions to approve** | (1) **Minimum launch scope** MLS-1/MLS-2 and the level *depth* D (04 §13.1, §13.3) — Q15; (2) **content staffing** and named Kyrgyz translator + two independent native reviewers, Russian translator + reviewer, German/English author-teachers and reviewers, pedagogical sign-off, curriculum lead (04 §13.5) — Q2, Q3; (3) **Kyrgyz and Russian quality-gate thresholds** (04 §7.3) — Q16; (4) **Kyrgyz grammar terminology glossary and style guide** commissioned (04 §13.5); (5) the **throughput pilot** scheduled (04 §13.6); (6) disposition of the dormant `de` UI locale — Q1; (7) backend runtime/hosting decision *plan* — Q6; (8) a **decision plan and owners for the marketplace record P9-D** (09 §1.1) — Q7–Q11, Q17 (decisions themselves are needed only before P9d, but their owners and dates are set now); (9) brand — Q12; (10) **business model and subscriptions (revision 3):** confirm the two-plan structure and the prices as *configuration* (99/149 KGS), name owners and dates for the subscription decisions U-01…U-20 (11 §16) and the Live decisions L-01…L-14 (10 §18), commission a **validated unit-economics model** from quoted provider prices, a measured AI cost per interaction and a pilot (11 §12.6, U-16) — Q18, Q19 |
| **Acceptance** | A signed decision record exists for items 1–9 (or an explicit, dated deferral with an owner); staffing for MLS is confirmed; the pilot has a start date |
| **Risks → mitigation** | Staffing cannot be secured → scope reduces to MLS-1 ru-only and Kyrgyz stays in disclosed legacy mode (no public Kyrgyz claims); decisions drift → owners and dates recorded |
| **Tests / evidence** | Not code: signed records, glossary draft, pilot plan |

### Track K — Kyrgyz and Russian translation foundation (parallel; starts at G0, runs through P0–P3) *(new — user instruction)*
Kyrgyz translation work begins **during the technical foundation phase**, because it is the long-lead item and has no code dependency on the target schema.

| Step | When | Work | Output |
|---|---|---|---|
| **K0** | G0–P0 | Terminology glossary + style guide approved; **throughput pilot** (one unit of German A1 translated to ky and ru, reviewed independently; one English A1 unit authored) | measured productivity; re-issued estimate (04 §13.6) |
| **K1** | P0–P1 | **Neutral export** of existing German A1 content and the UI/instruction texts from `src/data` and `src/i18n` to a translation workbook (generated by a one-off script outside application source; each row keyed by a stable id). Begin Kyrgyz translation of the 159 untranslated UI keys, vocabulary example translations (226), exercise rationales (202), mistake notes (40), "when" notes (70), listening lines (86); Russian review of existing text | translation workbook with status per row (04 §8) |
| **K2** | P1–P2 | Continue translation; first native review pass; second-reviewer sampling; message templates for services (MessageRef keys agreed with P2) | reviewed workbook ready for import |
| **K3** | P3 | Import into the course pack (conversion script), coverage gate, gates **G-ru** then **G-ky** (04 §7.3) | release decision per (course, level, locale) |

Kyrgyz work in K0–K2 is **not user-visible**. It becomes visible only at R1b after G-ky passes.

### P0 — Safety net (size S–M) → part of R0
| | |
|---|---|
| **Goal** | Make change safe: tests, lint, CI, boundaries, characterisation baseline |
| **Closes** | V-14 |
| **Prerequisites** | None. ADR for tooling choices (07 §7) |
| **Scope** | Vitest + Testing Library; ESLint (ts, react-hooks, jsx-a11y) + Prettier; `dependency-cruiser`/boundaries config in *report-only* mode (module folders not yet reorganised); GitHub Actions: `npm ci`, typecheck, lint, test, build into a temp dir, online `npm audit`; Playwright smoke (home loads at 390/768/1440 — the first automated version of both reports' rendered checks); characterisation tests for `srs.ts`, `questions.ts` builders (seeded), `stats.ts`, `analysis.ts`, `utils/*`; skeleton `content-validate` (id uniqueness, reference integrity of **current** `src/data`) ; remove no behaviour |
| **Preserve** | Everything (no functional change) |
| **Risks → mitigation** | Lint noise blocks flow → start with warnings, ratchet; flaky E2E → smoke only, retries off, deterministic seeds; characterisation tests lock in bugs → mark known-bug expectations explicitly (e.g. the any-score unit-test completion) so P1 flips them knowingly |
| **Acceptance** | CI green on `main`; required checks enabled; baseline test suite ≥ agreed coverage on pure modules **[A: 70 % initial]**; dependency graph report generated; online audit result recorded; README documents commands |
| **Tests required** | The suites above; CI self-test (intentionally failing PR is rejected) |

### P0b — PWA-lite: installability (size S) → R0b *(new — user instruction; review M-1)*
| | |
|---|---|
| **Goal** | Basic installation support as early as it can be done without touching application behaviour |
| **Closes** | V-13 (installability part) |
| **Prerequisites** | P0 (CI, Lighthouse step). **No dependency on P1–P5.** |
| **Scope** | Web manifest (`BilUp Til`), 192/512 and maskable icons, theme/background colours, `display: standalone`; minimal service worker precaching **only the hashed static shell** (no runtime caching, no data/content caching, no API); `registerType: 'prompt'` update notice (chrome); install prompt handling and iOS "Add to Home Screen" hint; **kill-switch** service worker; feature flag; **hash routing unchanged**; no change to storage, state, content or routes |
| **Preserve** | Everything; the app behaves identically in the browser tab |
| **Why it does not destabilise** | Touches `public/`, `index.html`, build config and one registration call; cannot read or write learner data; reversible by unregistering the worker; ships independently of the R0 migration (07 §5) |
| **Risks → mitigation** | Stale-cache incidents → versioned precache, prompt update, kill-switch, staged rollout; browser differences → Lighthouse installability + manual iOS/Android check; accidental caching of future API calls → rule recorded in 07 §5 |
| **Acceptance** | Lighthouse installability passes; installed app launches offline **to the shell only** (no promise of offline lessons); update prompt works across two builds; unregistering via kill-switch verified; no diff in application source behaviour (E2E smoke from P0 passes unchanged) |
| **Tests required** | Lighthouse CI installability; Playwright: install criteria, update flow, kill-switch; regression: P0 smoke + characterisation suites unchanged |

### P1 — Progress integrity and recoverable persistence (size M–L) → completes R0
First implementation milestone recommended by the Review.
| | |
|---|---|
| **Goal** | Trustworthy progress and safe storage without changing the learner-visible language model yet |
| **Closes** | V-04, V-05, V-06 (denominators), V-07, V-08, V-15 (default name), V-17 (state split) |
| **Prerequisites** | P0 |
| **Scope** | (1) `ActivityResult` contract + `RewardPolicy` (policy table is a **temporary in-code table keyed by activity kind** until manifests exist in P2/P3 — review X-4) + idempotent `record()` backed by the **durable derived state and permanent credit ledger** with archival policy (03 §4, 05 §4.2–§4.4); adapters so existing features (quiz, writing, speaking, topic, daily, listening, reading) emit results instead of calling `addXp`/`complete` directly; (2) pass thresholds for unit tests/review/topics; first-time/repeat XP rules, daily-challenge once per day; speaking hints flagged `assisted` (V-16 partial); (3) split `AppProvider` into settings / progress / tutor stores; selectors; remove 15-s global ticker, active-time accumulator (05 §5); (4) the **thin `KeyValueStore` contract + `localStorage` adapter** with one atomic key per course (05 §6) — *not* the full repository interface; schema validation, `schemaVersion`, migrations framework, quarantine/recovery screen, export/import, scoped reset; **no sync metadata** (05 §2 principle 6); (5) **legacy migrator** for `bilup-deutsch:v1` (05 §11), legacy key retained; (6) unit-10 reading: author text **or** explicit manifest-like config marking the section not required for unit 10 so denominators are truthful (manifest arrives in P2 — here a temporary per-unit required-sections table replaces `8`); (7) remove default name `Daniiar`; (8) initial `courseId` constant `'de-general'` used in storage keys so P2 needs no data migration |
| **Preserve** | All learning features, UI, SRS algorithm and intervals, recommendations, badges semantics (re-derived), tutor chat UI, streak/week visuals, existing learner data (via migration) |
| **Risks → mitigation** | Data loss in migration → backup + legacy key retained + rollback test + fixtures from realistic blobs; learners lose "completed" markers that would fail new thresholds → legacy completions are grandfathered as `source:'migration'`; XP inflation expectations/changes confuse users → opening-balance entry + short "progress updated" note (chrome); performance regression from log growth → retention/pruning and perf test; refactor breaks features → characterisation tests from P0 + E2E smoke per feature |
| **Acceptance** | **Pruning/archiving raw results leaves XP, completion and per-item credit unchanged** (credit ledger + `creditedItems`); legacy items already practised cannot re-earn first-time credit; repeating a quiz/writing/speaking/daily does not re-earn first-time XP; failing a unit test leaves unit incomplete; every unit's progress denominator derives from configuration (unit 10 can reach 100 %); corrupt/old/foreign `localStorage` never crashes the app and offers recovery; idle tab does not accumulate study time; migrating a legacy fixture yields expected state and rollback works; tutor/theme changes no longer rewrite progress blobs |
| **Tests required** | Reward policy table tests; idempotency/property tests; completion derivation; migration n→n+1 and legacy-migrator golden tests (empty, default-name, `lang:'de'`, oversized arrays, wrong types); active-time accumulator tests (fake timers, visibility); store contract suite; credit-ledger/pruning property tests, archival and atomicity tests (05 §12); quota-exceeded and unavailable-storage tests; E2E: repeat-quiz XP, fail-test, reload mid-daily, export/reset/import |

### P2 — Language and course model (size L) → R1a begins
| | |
|---|---|
| **Goal** | Four independent settings; registries; config-driven course structure; no new content yet. **Feature-flagged; the legacy i18n path stays alive and isolated (02 §5.3 stage S1)** |
| **Closes** | V-01 (model), V-03 (structure for message refs), V-11 (clamping rule), V-06 (manifest-driven structure) |
| **Prerequisites** | P1 (course-scoped storage, results). Decisions Q1 (dormant `de` UI), Q4, i18n approach (07 §3) |
| **Scope** | Branded `LocaleCode`/`LanguageCode`/`CourseId`/`LevelId`; `LocaleRegistry`, `LanguageRegistry`, `LevelScaleRegistry`, `CourseRegistry`; `LearnerSettings` (02 §2.1) with invariants; `core/settings` store and migration of `lang` → `uiLocale`+`explanationLocale`; **course manifest** for `de-general` (units/required activities/levels/policies), engine/stats read it — remove `'A1'`, `8`, unit-count literals (03 §6); `MessageRef` + resolver with **strict no-fallback policy** (02 §5) introduced **alongside** the old `t()`/`tr()`, which move unchanged into `legacy-i18n/` (the only place where Russian fallback may still run, disclosed to users, with a CI counter of remaining call sites — 02 §5.3); **static inventory of hard-coded learner-facing text** across `src/**` (script-agnostic; known to include `Labs.tsx`, `TutorChat.tsx`, `questions.ts`, `WordCard.tsx`, `analysis.ts`, `tutor.ts`, and Latin-script literals such as `"Reading Lab"`, `aria-label="Back"`); services (`questions`, `analysis`, `tutor`, placement) refactored to return `MessageRef`s (V-03) with Russian/`ky` strings moved into catalogs; speech language from registry; placement clamped to released levels (V-11); **script-agnostic visible-text lint rule** (02 §7.2) and level-literal rules; module folders reorganised to layers with the 07 §6 dependency policy promoted from report-only to **errors** (ports moved to `shared/contracts`); compat layer keeps screens working during the transition; `i18n.strict` flag defaults **off** in production |
| **Preserve** | Every working feature; `de-general` content stays in current TS data (converted in P3); Russian UI remains pixel-equivalent |
| **Risks → mitigation** | Huge cross-cutting diff → vertical slices (one service/screen at a time) behind the compat layer; accidental behaviour change → golden resolved-text snapshots for `ru`; hidden hard-coded text remains → script-agnostic lint + provenance leak test (02 §7); **Kyrgyz users must not lose a working experience** → the legacy Kyrgyz path is untouched in production until gate G-ky (R1b); the new strict path is exercised by Russian users after G-ru and by Kyrgyz testers in a closed preview only |
| **Acceptance** | Settings screen exposes UI language, explanation language, target language (only `de` selectable for now), course; no code path **outside `legacy-i18n/`** reads a single `lang`; no `'A1'`/`8`/`UNITS.length*8` literals in engine/stats; `ru`/`ru` experience matches golden snapshots; the visible-text lint rule passes (no unmanaged literal text outside catalogs, `<TargetText>`, `<UserText>`; the legacy folder is the allow-listed exception); the dependency-policy checks pass with zero violations on the real tree **and** fail on the violation fixtures (07 §6.2); in the **new path**, any missing key renders a marker and never other-locale text; **production behaviour for Kyrgyz and Russian users is unchanged** (legacy path, strict flag off) |
| **Tests required** | Settings invariants incl. release-per-level semantics; registry/branded-type tests (compile-time); manifest-driven progress tests with 7/8/12 required activities; `MessageRef` resolver (missing key → marker, never other locale); placement clamp; **provenance leak test, fault-injection test and bundle-load assertion** (02 §7.1) on a first set of screens in the flagged path; "valid Kyrgyz text" fixture test; locale-switch tests (progress preserved, in-flight attempt discarded); service purity tests (no raw prose); dependency-policy fixture tests; E2E: change settings and verify persistence & migration from P1 data |

### P3 — Content pipeline and localization (size L, content-heavy)
| | |
|---|---|
| **Goal** | `de-general` becomes a validated course pack. **Staged release: Russian first (R1a, gate G-ru), then Kyrgyz (R1b, gate G-ky)** for A1 (and any other level currently exposed); Kyrgyz is not public until G-ky passes |
| **Closes** | V-02, V-06 (validator), V-18, residual V-03 |
| **Prerequisites** | P2; **Track K deliverables (K1–K2)**; G0 decisions on staffing/gates. Native-speaker Kyrgyz capacity (Q2) **[A]** — the Kyrgyz gate depends on it |
| **Scope** | Pack format (04 §2–5), JSON schemas, `content-validate` full checks (04 §6), coverage report and release matrix (04 §7), conversion script and round-trip snapshot tests (04 §9), lazy loaders (`CourseCatalogPort`), translations authoring: Kyrgyz exercise rationales (202), mistake notes (40), "when" notes (70), listening line translations (86), vocabulary example translations (226), UI catalog gaps (159 keys), and review of the 29 `ky === ru` items; review workflow (04 §8) and **release-gate tooling (04 §7.3)**; Reading/Listening show only the `explanationLocale` translation (V-18); unit-10 reading decision finalised in manifest. **Rollout stages (02 §5.3):** S2 — after G-ru, Russian runs on the strict new path and the legacy `ru` code is deleted; Kyrgyz users remain in the **disclosed legacy mode**; S3 — Kyrgyz closed preview; S4 — after G-ky, Kyrgyz goes public per level and the `ky.ts` spread, `utils/text.ts` fallbacks and `legacy-i18n/` are deleted |
| **Preserve** | All existing German A1 (+ existing A2/B1 fragments) content and meaning; learner progress via legacy id mapping |
| **Risks → mitigation** | Translation volume/quality → prioritise by learner path (A1 core first), reviewers sign off per level, coverage dashboard; conversion errors → snapshot equivalence for `ru`; bundle/perf regressions → loader tests, budgets; partial release pressure → Russian ships first (R1a); Kyrgyz stays on the disclosed legacy mode until G-ky — **there is no state in which Kyrgyz users silently receive Russian from new-architecture code, and no state in which the working legacy experience is removed before its replacement passes the gate** |
| **Acceptance** | `content-validate` passes in CI; **R1a:** gate G-ru passes for the released levels (04 §7.3 all rows) and Russian runs strict; `de-general` renders identically (in `ru`) to the pre-conversion snapshot. **R1b:** gate G-ky passes (coverage 100 %, native review complete + independent second reviewer + pedagogical sign-off, provenance/fault-injection/bundle-load tests, in-product walkthrough) per level, and only then are `ky` entries added to `releasedLocales`; no `...ru`/`?? ru`/`t.ru` fallbacks remain in the product after S4; old `src/data/*.ts` content modules removed |
| **Tests required** | Schema fixtures; validator negative fixtures (incl. unit with required reading but no reading item); coverage golden test; round-trip snapshots; id-stability test; loader failure/retry; **provenance leak test, fault-injection and bundle-load assertions on real content for all four settings combinations (02 §7.1)**; gate-script tests (a gate with a missing signed review artefact fails); E2E: a `ky`-explanation learner completes a lesson with zero missing-markers and zero provenance failures |

### P4 — Learning Engine consolidation (size M–L)
| | |
|---|---|
| **Goal** | Every activity runs through the shared engine contracts; remaining semantic defects fixed |
| **Closes** | V-09, V-10, V-16, residual V-04/V-05, V-11 (assessment labelling) |
| **Prerequisites** | P1 (results), P2 (registries/manifest), P3 preferred (policies from pack) |
| **Scope** | Activity registry and runners for all kinds (03 §3); lesson step templates from manifest; `AssessmentPort` (heuristic implementation, `evidence` labelling, practice-feedback disclosure) (03 §7); analyzers move to the **German language pack** `languages/de/` behind `LanguagePackPort` with `Finding`s and per-locale error explanations (03 §8, §8.1; 04 §2.1); reading mistake kind and per-question rationales (V-09); **tutor sessions** with conversation-scoped state reset on clear (V-10); speaking hints supportive (not scored as production) (V-16); duplicated level-chip and speaking blocks consolidated; badges rules from config; scheduler strategy extraction; course-scoped mastery verified |
| **Preserve** | 7-step lesson UX, quiz UX, SRS behaviour, weak-concept recommendations, article drills, listening/reading/writing/speaking flows, tutor UI and "demo mode" disclosure |
| **Risks → mitigation** | Regression in a busy refactor → characterisation + E2E per activity; heuristic scoring changes surprise users → document and keep scoring formulas unchanged unless a defect is the target; scope creep into "real AI" → explicitly out of scope |
| **Acceptance** | No component calls `addXp`/`complete`/`addMistake` directly (lint-enforced); reading errors are categorised as reading; clearing a tutor chat clears pending quiz state; placement never exceeds released-level evidence; assisted attempts flagged and credit-reduced |
| **Tests required** | Per-activity result-schema contract tests; tutor session isolation test (pending answer, reset); reading mistake categorisation; assisted flow; E2E for each activity kind through result → progress |

### P5 — Responsive UX and accessibility (size L)
| | |
|---|---|
| **Goal** | Professional phone/tablet/desktop experience; onboarding; accessible primitives |
| **Closes** | V-12, V-19, V-15 (brand), U-series items (06) |
| **Prerequisites** | P2 (settings/onboarding data), P4 recommended; Q12 (brand), Q14 (device lab). **Router decision at the start of P5** (typed router vs. master-detail on the hash router — 07 §3) |
| **Scope** | Window-size classes, **medium shell (rail + two-pane)**, large layout (06 §3–4); information architecture (06 §4.1) and onboarding (UI locale → target language → explanation language → course/level/placement → goal); touch targets ≥ 44 px, token/contrast fixes; reading lookup redesign; accessible `Dialog`/`Segmented`/landmarks/focus on route change; localised ARIA; `Intl` weekday labels; SVG icons replacing emoji; self-hosted fonts incl. Kyrgyz glyphs; pseudo-locale run; full Playwright visual/overflow/target/axe suites (06 §9) |
| **Preserve** | Design tokens, dark theme, reduced motion, existing visual identity and components (extended, not replaced), existing lesson flows |
| **Risks → mitigation** | Visual churn → feature flag for new shells; snapshot baselines reviewed; Kyrgyz text longer → pseudo-locale and real-locale checks; a11y regressions → axe gate; scope creep → marketplace-specific layouts deferred to P9 |
| **Acceptance** | 06 §9 acceptance: medium shell live; zero overflow findings and zero ≥44 px violations on all manifest routes at 390×844, 768×1024, 1024×768, 1440×900 and 844×390; dialogs pass focus tests; contrast AA via token check; all four language-setting combinations without clipping; manual smoke on real iOS/Android/iPad recorded |
| **Tests required** | Playwright: Chromium visual diffs on a curated route set; overflow detector, touch-target audit and axe on Chromium, WebKit and Firefox; keyboard walkthroughs, axe in `ky`/`ru`, contrast script, pseudo-locale; navigation-composition tests (≤ 5 items on compact in every module-flag combination (Live, Teachers)); manual device checklist |

### P6 — PWA offline, code splitting (size M) → R2
| | |
|---|---|
| **Goal** | Offline-capable app with safe updates, building on the installability delivered in **P0b** |
| **Closes** | V-13 (offline part), V-20 |
| **Prerequisites** | P0b; P3 (packs to cache); P5 (shell); Q13 (offline scope: downloadable packs). History-mode URLs are **not** a prerequisite |
| **Scope** | Runtime caching strategy (07 §5, rows marked P6), versioned course-pack download per level, update flow across content versions, route/content code splitting (lazy routes and lazy units), **rich `StorageRepository` + IndexedDB adapter** (05 §6) if measurements show growth, offline banners; history-mode URLs only if a concrete requirement exists (07 §3) |
| **Preserve** | Existing deep links (hash routes keep working; redirect added only if history mode is adopted); all features offline-safe where content is cached |
| **Risks → mitigation** | Stale caches/version skew → versioned packs, prompt-based update, cache-bust tests; iOS limitations → graceful degradation; storage migration risk → store contract suite and backup (05 §8); SW breaking deploys → kill-switch from P0b and staged rollout |
| **Acceptance** | Fresh install works offline for a downloaded level; update flow tested across two content/app versions; initial JS within the agreed budget **[A: derive from measured shell, 07 §4]**; no data loss in the IndexedDB migration (if performed) |
| **Tests required** | Playwright offline/online switching, SW update test, cache invalidation test, Lighthouse CI budgets, IndexedDB migration tests (if performed) |

### P7 — Content expansion (continuous parallel track; size XL, content-heavy)
| | |
|---|---|
| **Goal** | Deliver the approved CEFR scope progressively: A1–B2 for German and English, each in `ky` and `ru`; **launch minimum is MLS (04 §13.1)**; C1/C2 remain architecture-only |
| **Prerequisites** | P3 (pack format, validator, workflow, gates) for authoring; P4/P5 for release gates; G0 approvals (MLS, staffing, glossary, pilot results — Q2, Q3, Q15, Q16) |
| **Sub-stages [R]** | **P7a — English language pack** (analyzers and error patterns, writing and speaking feedback rules, error explanations in `ky` and `ru`, tutor knowledge base, speech config `en-GB`/`en-US`, visuals or declared absence — 03 §8.1, 04 §2.1, §13.4). **P7b — English A1 course pack** (MLS-2) authored, translated, gated. **P7c — German A2**, **P7d — English A2**, **P7e — B1 both**, **P7f — B2 both** — each *(course, level, locale)* released independently through its own gate (04 §7.3). Order may change with product priorities but a level never ships before its language-pack capabilities exist in the same locales |
| **Estimates** | See 04 §13.3–§13.4: MLS ≈ 80–130 person-days (content/linguistic, excl. engineering); full A1–B2 ≈ 330–530 person-days at MVP depth, ≈ 660–1,070 at standard depth, ≈ 990–1,600 at full depth — **[A], replaced by pilot measurements (04 §13.6) before commitments** |
| **Preserve** | Pack format stability; progress compatibility; no engine code changes per new level (a needed change = a defect in the architecture, to be fixed) |
| **Risks → mitigation** | Largest cost/time risk [A] → per-level release, minimum launch scope, tooling-first, pilot-based re-estimate; Kyrgyz reviewer capacity → three distinct reviewers minimum (04 §13.5), glossary first; inconsistent pedagogy → level syllabi + difficulty tags + editorial review; English-specific needs → `en` extension schema and language pack authored early (P7a before P7b); assessment calibration absent → keep placement "estimate", gather item stats after launch |
| **Acceptance** | For each released (course, level, locale): validator + coverage 100 % incl. language-pack capabilities, **all gate items of 04 §7.3 pass**, E2E completion test, provenance leak test; **English A1 ships with writing feedback, speaking feedback, error explanations and tutor replies in each released locale** (or a declared, visible absence) and **without engine/schema changes beyond the `en` extension schema** |
| **Tests required** | Content validator/coverage per pack; language-pack coverage (every `Finding.code` explained in each released locale); E2E per new course; performance budget for large packs; translation review sign-off artefacts |

### P8 — Backend foundation: identity, profile, sync (size L)
| | |
|---|---|
| **Goal** | Accounts and cloud sync of learner state; platform for the marketplace; **no marketplace features yet** |
| **Prerequisites** | P1 (sync-ready ids/results), P2; decisions Q5, Q6, Q11 and privacy/legal basics; security baseline (07 §10) |
| **Scope** *(simplified — review O-5)* | **Minimal** modular-monolith skeleton (07 §8): **`identity`, `profile` and an opt-in `sync` endpoint only**; notifications/admin as simple shared endpoints; OpenAPI contracts (`shared/contracts`), including an error model, auth-refresh and idempotency-header conventions (review M-9); Postgres schema + migrations; OIDC auth, sessions, MFA for admin; `AuthPort`/`ApiClientPort` implementations and a remote sync adapter over the compact credit ledger/completions/mastery/settings (05 §9); consent and data export/delete; sign-in UX (anonymous → account merge); staging; observability; backend CI with real Postgres. **Deferred to later phases:** outbox and job runner (introduced in P8b), subscription and Live modules (P8b, P8c), marketplace modules (P9a–P9c), sync metadata beyond what the chosen conflict strategy needs, an ADR for each module when it starts |
| **Preserve** | Local-first behaviour and offline use; anonymous learners remain supported **until P8b**, where their fate is an explicit decision (11 U-01, U-02) |
| **Risks → mitigation** | Sync conflicts → append-only results/LWW settings (05 §9); data privacy mistakes → privacy review, minimal data; scope creep into marketplace → hard module boundary; operational burden → managed services, staged rollout |
| **Acceptance** | Sign up/in/out; results sync idempotently across two devices; account merge from anonymous state without loss; data export/delete works; authZ tests pass; security review/threat model completed; backend CI green with real Postgres |
| **Tests required** | API contract tests, authN/authZ matrix, sync convergence property tests, migration tests, load smoke, pen-test checklist/ASVS pass, secrets scan |

### P8b — Subscriptions and entitlements (size L) → R4b *(new in revision 3)*
| | |
|---|---|
| **Goal** | Implement the approved two-plan model **as configuration**: BilUp Basic (99 KGS/month) and BilUp Premium Live (149 KGS/month) — without any price, grant or limit in code (11 §10) — with a server-side entitlement service |
| **Closes / delivers** | Subscription lifecycle, entitlement derivation, usage limits for the AI Tutor, entitlement-gated paid content delivery, subscription UI; introduces the shared `payments` module, the event outbox and the job runner |
| **Prerequisites** | **P8** (identity); **P3** (course packs exist, so paid content can be gated at delivery — 04 §10); P5 recommended (responsive subscription UI); **P6 only for the offline entitlement lease**. G0 approvals for the pricing/subscription model and a **validated unit-economics model** (11 §12.6, U-16). **Real money requires decision record S-D** (11 §15.3: provider for KGS, legal/tax, renewal mode, grace/retry, change/refund policy, price-change policy); until then only the `FakePaymentProvider` is used |
| **Scope** | Backend: `payments` (provider port, purpose-tagged `PaymentTransaction`s, webhooks, reconciliation), `billing` (plans, immutable plan versions, subscriptions, invoices, dunning), `entitlements` (catalog, derivation, usage counters, signed `EntitlementSnapshot`, `EntitlementPort`). Frontend: `core/entitlements` (`EntitlementsPort`, advisory) and `subscription/*` (plans, checkout, status, upgrade/downgrade/cancel, usage meter). Entitlement-checked delivery of paid course packs; tutor proxy limit hooks (real LLM remains [F]). Upgrade/downgrade/cancel implemented through configurable `ChangePolicy` entries whose values are **placeholders until U-07–U-09 are decided** |
| **Preserve** | The self-study learning experience; local-first behaviour for whatever U-01/U-02 decides remains free; anonymous/local use is **not silently removed** — its fate is an explicit decision (U-01, U-02) |
| **Risks → mitigation** | Unvalidated unit economics → model first (G0), prices in plan versions, review triggers; provider may not support KGS or recurring charges → capability matrix, manual-renewal mode; entitlements hard-coded by accident → static test banning plan-code/price literals; static CDN content contradicts paid access → entitlement-checked delivery (decided at phase start, 07 §12); accidental coupling to the Marketplace → separate records and purposes (11 §9); legal/consumer-law exposure for auto-renewal → S-D before any charge |
| **Acceptance** | Plan versions for Basic and Premium Live load from configuration; changing a price or a limit = publishing a new version with **no code change** and no change to existing subscriptions/invoices; entitlement derivation table tests pass for every status/grace scope; upgrade, downgrade, cancel, failed-payment and expiry scenarios pass with a fake clock and fake provider (including a provider without recurring support); reconciliation test cases pass; **Basic and unsubscribed accounts are denied paid content and Live entitlements server-side**; AI-tutor usage limits are policy-driven and server-side; security review; production payment credentials cannot be deployed without S-D |
| **Tests required** | As 11 §15.2 |

### P8c — BilUp Live MVP (size L) → R4c *(new in revision 3)*
| | |
|---|---|
| **Goal** | The weekly German and English BilUp Live sessions, token-gated and moderated, **never recorded** (10) |
| **Prerequisites** | **P8b** (entitlements `live.de`/`live.en`); P5 (responsive shell); G0 plan for decisions L-01…L-14; **decision record L-D** (10 §18) before any real provider contract or participant pilot |
| **Scope** | `live` module (series/schedule with IANA zone and DST handling, occurrence generation, session lifecycle), join flow and provider token issuance, `FakeClassroomProvider` then a sandbox adapter that passes the capability gate (10 §7), attendance, interactions (polls/quizzes/chat/Q&A/speaking challenges without any audio capture), moderation tools, level bands, materials (document/image types only), admin console, `live/*` frontend module. Four stages P8c-1…P8c-4 (10 §17) |
| **Preserve** | Self-study, subscriptions and the Marketplace are unaffected; Live is behind a feature flag |
| **Risks → mitigation** | Spoken-language policy unresolved (L-01) → decide at G0/L-D, do not build around an assumption; provider cannot do tokens/capacity/recording-off → capability gate, no provider = no pilot; link sharing → short tokens, one connection per account, residual risk documented; recording reintroduced by a feature or provider default → contract tests, audit job, static CI ban (10 §9.2); moderation overload at hundreds of participants → staffing plan L-10, slow-mode/moderated chat; DST errors → table tests |
| **Acceptance** | **Basic/unsubscribed accounts get `403` on join for a valid session id; a token cannot be used by another account; there is no shareable room URL**; DST tables pass; Premium Live accounts can join **both** language sessions; level-banded tasks work for A1–A2 and B1–B2 in one stream; moderation actions work at synthetic load of the planned peak; **no recording operation, flag, entitlement or upload type exists** (tests in 10 §17); Live content localization follows the provenance rules (02 §7); pilot only after L-D |
| **Tests required** | As 10 §17 |

### P9 — Online Teachers Marketplace MVP (size XL)
| | |
|---|---|
| **Goal** | Teacher marketplace per doc 09, staged P9a–P9d |
| **Prerequisites** | P8; P5 (responsive shell). **P9a–P9c (fakes/sandbox):** decision plan and owners for P9-D set at G0. **P9d (anything with real money or real participants): the decision record P9-D (09 §1.1, D1–D9 — markets, provider capability matrix, legal structure, commission/tax, refund/dispute policy, verification and minors policy, video provider, data-protection basis, operational staffing) must be approved**, plus a security review and a legal review |
| **Scope** | P9a catalog/verification (criteria 09 §5.1)/search; P9b availability, booking engine with hold limits (09 §8.1a), fake payments/classroom, student history (the outbox and job runner already exist from P8b), teacher dashboard; P9c sandbox providers (capability-based), financial records sized to the chosen model (09 §12.2), payout dry-runs, reviews/moderation, disputes; **P9d live pilot — blocked until P9-D** (09 §18) |
| **Preserve** | Learning platform unaffected (module isolation); `marketplace.enabled` flag |
| **Risks → mitigation** | Legal/financial complexity → decisions before code, sandbox-first, counsel review; double booking/payment inconsistencies → DB constraints, idempotency, reconciliation, concurrency tests; cold-start supply → admin-assisted onboarding **[A]**; fraud/abuse → rate limits, verification, moderation tooling; provider lock-in → ports and fakes |
| **Acceptance** | Concurrency test: N parallel bookings for one slot → exactly one succeeds; full flow search→book→(fake)pay→join→review in `ky` and `ru`; state-machine tests complete; authorization matrix green; financial-record invariants hold for the chosen model; hold-limit and lazy-expiry tests pass; verification workflow implements 09 §5.1; **P9d only:** P9-D approved and pilot readiness checklist signed (security, privacy, legal). Real payments remain disabled by configuration until then |
| **Tests required** | As 09 §18 |

### P10 — Marketplace expansion (future)
Marketplace group lessons and teacher packages (not BilUp subscriptions and not BilUp Live), recurring lessons, calendar sync, messaging (09 §16). Prerequisite: P9 stable in production. Out of current implementation scope.

---

## 4. Preserved-features matrix (cross-phase)

| Existing feature | Status through the migration |
|---|---|
| 7-step topic lesson | preserved; becomes manifest-driven `lesson` (P2/P4) |
| Quiz types and feedback | preserved; emits results (P1/P4) |
| SRS (Leitner) | preserved algorithm; course-scoped (P1/P2) |
| Recommendations / weak concepts / article drills | preserved; manifest-driven (P2/P4) |
| Dashboard, streak, week view, level track | preserved; labels from registries; weekday via `Intl` (P2/P5) |
| Vocabulary browser, WordCard | preserved; fields from pack; translation by `explanationLocale` (P3) |
| Grammar labs/visuals | preserved as German language-extension visuals (P3/P4) |
| Listening (TTS), reading (glosses), writing, speaking | preserved; heuristics labelled; Russian literals removed (P2–P4) |
| Daily challenge | preserved; once-per-day reward (P1) |
| Tests/placement | preserved; thresholds + clamped estimate (P1/P2/P4) |
| Progress screen & badges | preserved; derived from results (P1) |
| Tutor chat UI | preserved; sessions scoped; disclosure kept (P4) |
| Dark theme, tokens, UI primitives | preserved and extended (P5) |
| Learner data | preserved through legacy migration (P1) |
| Content | preserved through conversion with round-trip tests (P3) |

---

## 5. Cross-phase risk register

| Risk | Phase(s) | Mitigation |
|---|---|---|
| Kyrgyz translation/review capacity is the schedule bottleneck [A] | G0, K, P3, P7 | G0 staffing approval, glossary, pilot, translation starts in P0 (Track K), per-level releases, Russian first; Kyrgyz stays non-public (disclosed legacy mode) until gate G-ky |
| Removing the Russian fallback before Kyrgyz replacements exist degrades current Kyrgyz users | P2–P3 | staged rollout S0–S4 (02 §5.3); legacy path isolated and removed only at G-ky |
| Localization verified by text heuristics instead of provenance | P2–P3 | provenance/fault-injection/bundle-load tests; no character-based detection (02 §7) |
| Boundary rules contradict each other and fail CI | P0–P2 | single policy in 01 §4.2; matrix + fixtures in 07 §6; report-only in P0, errors in P2 |
| Real payments started before legal/payment decisions | P9 | P9-D prerequisite; production payment credentials cannot be deployed without it (09 §1.1) |
| Real subscription charges started before provider/legal/refund/price-change decisions | P8b | decision record **S-D** is a prerequisite; fake provider only; production credentials cannot be deployed without it (11 §15.3) |
| Pricing (99/149 KGS) assumed sustainable without cost data | G0, P8b, P8c | unit-economics model from quotes and pilot (11 §12.6); prices live in plan versions so a review needs no code change |
| Entitlements or prices hard-coded; Live reachable by join URL | P8b, P8c | static no-hardcoding test; server-side checks; token-gated join; no shareable room URL; provider capability gate (11 §10, §13; 10 §6–7) |
| Recording introduced via a provider default, a feature or a "material" upload | P8c, P9 | recording-off provider contract tests, audit job, static CI ban, upload allow-list (10 §9.2) |
| Live instruction-language and localization workload underestimated | G0, P8c | decisions L-01/L-04 at G0; Live content in `ky` and `ru` is extra recurring translation work not in 04 §13 |
| PWA-lite destabilises the app | P0b | shell-only worker, kill-switch, flag, no data caching, independent of P1 |
| Refactor regressions | P1–P4 | characterisation tests, small slices, E2E, feature flags |
| Scope creep ("while we're here") | all | each phase has one concern and acceptance gate; backlog for extras |
| Local data loss | P1, P6 | backups, legacy retention, recovery UX, repository contract tests |
| Over-engineering the ports | P2–P4 | only create ports where a second implementation or test fake exists (today or in the plan) |
| Legal/payment unknowns delay marketplace | P9 | decisions Q7–Q11 are entry criteria; sandbox and fakes keep engineering moving |
| Content volume for English and B1/B2 | P7 | independent release per level; tooling-first |
| Performance/bundle growth | P3, P6 | lazy packs, budgets in CI |
| Team capacity unknown | all | roadmap expressed as dependencies, not dates |

## 6. Definition of done (every phase)
Typecheck, lint, unit/integration tests green; relevant E2E added; docs 01–09 updated if a decision changed; migration and rollback tested where data is touched; accessibility checks for UI changes; changelog entry; no new dependency without ADR line (07 §11).

## 7. Open items
All phase-gating decisions are in 01 §9 (Q1–Q19; the detailed subscription and Live decisions are U-01…U-20 in 11 §16 and L-01…L-14 in 10 §18); the ones that must be settled before implementation planning commits dates are the **G0** items. Calendar estimates require a staffing decision and are intentionally not given. Thresholds marked **[A]** (coverage %, bundle budget, idle window, hold TTL) are initial proposals to be ratified in the phase that uses them.
