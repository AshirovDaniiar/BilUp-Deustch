# BilUp Til 2.0 — Independent Architecture Review

**Review date:** 5 November 2026
**Subject:** `docs/architecture/01…09` (the "Set")
**Compared against:** `docs/BILUP_TIL_TECHNICAL_AUDIT.md` (Audit), `docs/BILUP_TIL_INDEPENDENT_REVIEW.md` (Review), and the repository at HEAD `386c6a1`.
**Files modified:** none, other than creating this report. No dependencies installed, no code run except read-only searches.

## 0. Independence disclosure and method

The same AI model family wrote the Audit and the Set that this report reviews. Treat "independent" here as *adversarial re-verification*, not organisational independence. To compensate I did not review from memory: I re-read the exact text of the Set, ran searches against both the Set and `src/`, and recorded where a claim could not be verified. Where I rely on domain knowledge rather than the repository (the Kyrgyz alphabet, payment-authorization behaviour), I say so, and it needs confirmation by a native speaker or the chosen provider.

Checks performed: cross-reference and contradiction search across the nine documents; layer-rule compliance of the interface tables; counting how many source files each proposed change touches; searching `src/` for hard-coded non-ASCII literals; reading the marketplace state machines for gaps.

Severity scale: **Critical** (invalidates a headline requirement or blocks implementation planning), **High** (will cause rework or a wrong implementation if left), **Medium**, **Low**, **Informational**.

---

## 1. Executive verdict

**The Set is a strong, evidence-labelled architecture that is ready for implementation planning of phases P0–P1, conditionally ready for P2–P6, and *not* ready for P9 (marketplace) or for planning P7 (content) at the level of commitment.**

- The core strategy (keep React/TypeScript/Vite, replace the language/content/progress core behind adapters, no microservices) is sound and consistent with the Audit and Review.
- One headline requirement, **verifiable "no silent Russian fallback"**, is *prevented* well by design (no fallback code, coverage gates, availability states) but its **verification as specified is partly wrong** (Critical, C-1).
- The module-boundary rules are contradicted by the Set's own interface tables (High, H-1), which would fail the CI check the Set proposes.
- The marketplace is architecturally clean but its **payment and verification assumptions are not specified enough**, and its default money flow is probably not implementable as written (High, H-2).
- The roadmap's dependency order is mostly right, but it delivers the first multilingual user value late (after P2–P5) and creates a regression window for existing Kyrgyz users (High, H-3).

Required before planning begins: fix C-1, H-1, H-3, H-4 (documentation corrections, small). Required before P9: close payment/legal decisions and specifications (H-2, M-4, M-7).

---

## 2. Confirmed strengths

| # | Strength | Evidence |
|---|---|---|
| S-1 | Evidence discipline: every claim is labelled verified / recommendation / assumption / future; verified findings cite file and line. The Review's corrections to the Audit are carried into the register (01 §3.1). | 01 §0, §3 |
| S-2 | Correct diagnosis of the central defect: four independent settings with a branded-type separation of `LocaleCode` and `LanguageCode`, removing today's `de`-means-two-things collision (`data/types.ts:3,8-12`). | 02 §2 |
| S-3 | Strict locale policy turns missing translation into a *product state* ("not yet available in Kyrgyz") rather than a leak. | 02 §5, 04 §7 |
| S-4 | `ActivityResult` + idempotent `record()` + derived completion directly address the confirmed progress defects (V-04, V-05) and fits the Review's recommended first milestone. | 03 §4, 05 §4, 08 P1 |
| S-5 | Config-driven course structure and level scale answer the "no hard-coded counts/levels" requirement and make C1/C2 a data change (04 §3, 03 §6). | |
| S-6 | Migration thinking is concrete: legacy key retained, backup, rollback, grandfathering of legacy completions, field-by-field mapping table. | 05 §8, §11 |
| S-7 | Strangler approach, characterisation tests before refactor, one concern per phase, acceptance criteria and tests per phase. | 08 §1, §3 |
| S-8 | Marketplace: profile vs offer separation, four separate lifecycles linked by events, database-level anti-double-booking, offer snapshot in bookings, ownership-based authorization, provider ports. | 09 §4, §8–§10 |
| S-9 | Scope discipline: no microservices, no real payments/video, group lessons and subscriptions designed-for but not built. | 01 §0.3, 09 §16 |

---

## 3. Critical architectural problems

### C-1 (Critical) — The localization test strategy is partly invalid, and the lint rule cannot catch the actual defects
**Where:** 02 §7 (leak test), 07 §6 (literal lint rule), 01 §3 V-03.
**Evidence:**
1. 02 §7 specifies "a denylist of known Russian-only letters **ы э ё щ ъ** in `ky` mode". These letters are **part of the Kyrgyz Cyrillic alphabet** (domain knowledge; confirm with a native speaker). Applied as written, the test would flag correct Kyrgyz text and still miss Russian text that avoids them. The reverse check (absence of ү ө ң in a `ru` node) is sound only for strings long enough to contain them.
2. Russian and Kyrgyz share most of their letters. Script heuristics cannot reliably distinguish *short* Russian strings from Kyrgyz ones (button labels, "Верно!" vs "Туура!").
3. The proposed lint rule (07 §6) forbids "Cyrillic/non-ASCII" literals outside catalogs. But hard-coded learner-facing text in the repository is **also Latin-script**: `"Reading Lab"`, `aria-label="Back"`, `"Close"` (`ReadingLab.tsx:19`, `ui.tsx:75,127`, Audit U-03) and German/Russian branches in `Labs.tsx:157`. An English or German hard-coded explanation passes the rule. For `en` and `de` targets, explanatory strings in Latin script are the *likely* leak.

**Impact:** The most important product requirement (no silent Russian fallback in Kyrgyz mode; complete Kyrgyz) would be declared "tested" while remaining unverified. The code-level prevention (no fallback code) is good; the *verification* is not.
**Correction (provenance-based testing instead of script heuristics):**
- Instrument the message resolver so every rendered instructional/chrome string carries `{locale, catalogId, key}` provenance (data attribute in test builds). The leak test asserts provenance, not letters: all instructional nodes must have `locale === explanationLocale`; all chrome nodes `locale === uiLocale`; any node with no provenance and visible text is a failure (catches hard-coded literals of any script).
- Static rule: forbid any JSX text/`aria-*`/`title`/`placeholder`/template literal that contains letters, outside catalogs and the target-text component (`<TargetText>`), regardless of script (allow-list for brand names).
- Catalog tests: for every key, assert `ky` and `ru` strings differ unless flagged `sameAsOtherLocale` (04 §6 already proposes this for content; extend to UI/instruction catalogs).
- Keep a small language-ID spot check (a library or dictionary-based check) only as a secondary, advisory signal.
- Replace the wrong denylist in 02 §7 and note that linguistic correctness still requires human review (04 §8).

---

## 4. High-severity findings

### H-1 (High) — The layer model contradicts the interface tables and the dependency summary
**Evidence:**
- 01 §4.2 rule 3: `marketplace` must not import `engine` or `features`. 07 §6 summary: `app → features, marketplace → engine, …` — states the opposite and also lists `marketplace → engine`.
- 01 §4.2 puts `ui` at L1 and `languages` at L2, but the interface table lists `MessageResolverPort` (owner `languages`) as **consumed by `ui`** — an upward dependency. `ui` must render localized labels (`aria-label`, dialog close text) so this dependency is real.
- 01 §4.2 puts `engine` and `core` both in L3, rule 2 forbids same-layer imports, yet `ProgressPort` is owned by `core` and **consumed by `engine`**, and `core/progress` needs `engine` result types.
- 01 §4.2 rule 3 allows `TeacherRecommendationPort` (owned by `marketplace`, consumed by `features`) — both are L4; rule 2 forbids exactly that. (Also see M-5.)

**Impact:** The proposed `eslint-plugin-boundaries` / `dependency-cruiser` rules promoted to *errors* in P2 (08 P2) would fail immediately or be configured around the contradictions.
**Correction:** Re-draw layers so ports are owned by the **lower** layer of each pair: put result types (`ActivityResult`, `ProgressPort`) in a `domain` (L0/L1 shared kernel) consumed by both `engine` and `core`; make `ui` receive localized strings via props/context supplied by `app` (no import of `languages`), or move the resolver interface to `shared`; fix the 07 §6 sentence; invert the recommendation port (see M-5). Run `dependency-cruiser` on a prototype folder skeleton *before* approving the rules.

### H-2 (High) — Marketplace payment, funds flow and legal structure are insufficiently specified; the default flow is probably unimplementable
**Evidence:** 09 §9.2 default: "authorize at booking, capture at confirmation, hold funds in the platform balance until lesson completion + dispute window"; 09 §12.2 describes a platform ledger and payouts; 01 §9 Q7/Q8 leave markets, merchant-of-record, commission, refund policy, tax unresolved.
**Problems:**
1. Card authorizations expire after a limited time (typically days; provider-specific — to verify). Lessons are often booked weeks ahead, so "authorize now, capture later" does not span booking-to-lesson. The text mixes "authorize at booking" and "capture at confirmation"; which is it, and what is the fallback when authorization expires?
2. "Platform holds funds until the lesson completes" implies the platform holds third-party money — regulatory treatment (payment-institution / escrow / marketplace-facilitator rules) depends on jurisdiction and provider capabilities (e.g. connected-account models). The Set flags this as `[A]` but still specifies a double-entry ledger and payout timing as if the model were chosen.
3. Whether a self-built ledger is needed at all depends on the provider model: with a provider-managed split-payment/connected-account product, the provider ledger is authoritative and a local double-entry ledger is largely reconciliation data.
4. Chargebacks after payout, negative teacher balances, currency conversion/fees, refund of platform commission, tax/VAT invoices and receipts per market, minimum payout thresholds are not specified. Dispute windows vs. payout schedule are listed as policy but have no defaults.
5. No requirement for a **payment-provider capability matrix** against the actual target markets (the Set itself notes provider availability for e.g. Kyrgyzstan/Russia/EU is unverified).

**Impact:** P9 design would be built on an unverified funds-flow model; likely rework of `payments`, `payouts`, ledger and refund logic.
**Correction:** Make a decision record (ADR) the entry gate to P9: (a) target markets/currencies, (b) merchant-of-record vs. agent model, (c) provider capability matrix, (d) the funds-flow diagram with *the chosen provider's actual authorization/capture/transfer limits*, (e) refund/chargeback/negative-balance policy, (f) tax/invoicing. Until then keep 09 §12 as *illustrative*, and define `PaymentProvider` by capabilities (`supportsAuthHold`, `supportsSplitPayout`, `maxAuthWindow`) rather than assuming them.

### H-3 (High) — P2 introduces an interim regression for existing Kyrgyz users and the roadmap delays first multilingual value
**Evidence:** Today Kyrgyz users see Russian where Kyrgyz is missing (`ky.ts` spread; `utils/text.ts:3`). 08 P2 acceptance: "the `ru`-UI + `ky`-explanation configuration renders no Russian instructional text on screens whose content is already translatable (the rest shows explicit unavailable markers)"; the content to translate is delivered only in P3. 01 §7 places R1 at the end of P5.
**Impact:** Between P2 and P3, Kyrgyz learners lose working (Russian-leaking) screens and gain "unavailable" markers on most instructional content — a user-visible downgrade — while Russian users see no benefit. Four large phases (P2–P5) pass before the first release with the new settings.
**Correction:** (a) Ship P2 behind a feature flag with the *legacy fallback preserved only in the legacy code path* until the P3 coverage gate passes for the screens in question; (b) start Kyrgyz translation and review **during P0–P1** using a neutral export of existing content (spreadsheet/JSON from a one-off script) — it has no code dependency on the target schema; (c) define an interim release gate: a `ky` learner gets a screen only when it is 100 % Kyrgyz, otherwise the Russian-explanation course remains selectable *explicitly labelled as Russian* (chosen by the learner, not a fallback); (d) split R1 into R1a (settings + Russian complete) and R1b (Kyrgyz complete).

### H-4 (High) — The progress design contradicts itself on replay vs. pruning and omits per-item credit state
**Evidence:** 05 §2 principle 3: state "can be rebuilt by replaying the log"; 05 §3: results retention "prune item-level detail older than N days"; 03 §4.2 rule 2: first-time XP credit "tied to `(courseId, itemRef)`"; 05 §3's store list has no per-item credit record; 05 §11 notes legacy XP "cannot be rebuilt from results".
**Impact:** After pruning, mastery and per-item first-time credit cannot be reconstructed, and either farmed XP returns (credit forgotten) or replay produces different totals. Property tests specified in 05 §12 ("replay reproduces derived state") would fail once pruning exists.
**Correction:** Choose one model explicitly: **snapshot + compacted log**. Keep authoritative *derived records* (mastery per item, `creditedItems` set per course, XP totals, completion set) as durable state, and treat raw results as a bounded audit/sync buffer. State that replay is valid only within the retained window plus snapshot. Add `creditedItems` (or equivalent) to the store list and migration mapping.

### H-5 (High) — English as a target language is under-specified beyond the content schema
**Evidence:** 04 §4.2 defers the `en` extension to "when authored"; 08 P7 accepts English A1 "without engine/schema changes beyond `en` extension schema"; 03 §8 and 02 §6 assert per-language analyzers. But the Set contains no plan for English **error patterns, writing/speaking heuristics, tutor knowledge base, grammar-visual set, speech variants (British/American), spelling rules**, or for the pedagogy differences (e.g. no grammatical gender or case). The current analyzers (`analysis.ts`, `errorPatterns.ts`, `tutor.ts` keyword rules) are German-specific, as the Audit noted.
**Impact:** The "English A1 proves the architecture" acceptance test would either pass with English feedback features silently missing, or expand the work unexpectedly. The estimate for P7 is understated.
**Correction:** Add a "language pack" deliverable (analyzers, error patterns, tutor KB, visuals, speech config) next to the course pack in 04/08, and require English A1 acceptance to include *feedback features*, or explicitly mark them as out of scope for English v1 with a visible UI statement. Decide the accent policy.

### H-6 (High) — Scope and schedule realism for A1–B2 × two languages × two explanation locales
**Evidence:** Only German A1 exists (10 units, 226 words, 20 grammar topics — mostly A1; a few A2/B1 items). Approved scope: A1–B2 for German and English, each fully in Kyrgyz and Russian. 08 P7 is sized "XL" with no estimate; Kyrgyz review capacity is `[A]` (Q2).
**Impact:** The content effort is likely the dominant cost and risk (several times the engineering), and "released only at 100 % coverage per locale" means a Kyrgyz learner may see far fewer levels than a Russian learner for a long time. This is a product consequence, not just a schedule detail.
**Correction:** Add an explicit scope-staging table and a content-capacity model (items per level per language, reviewers needed, throughput). Define a minimum lovable product (e.g. German A1 `ky`+`ru`, then English A1 `ky`+`ru`) and make later levels contingent. Add a "decisions and staffing" gate (Phase −1) before P3/P7. State clearly in the Set that "A1–B2 initial scope" is an *architecture capability* until content capacity is confirmed.

---

## 5. Contradictions between the documents

| # | Sev | Contradiction | Where | Resolution |
|---|---|---|---|---|
| X-1 | High | Marketplace may/may not import engine | 01 §4.2 rule 3 vs 07 §6 summary | H-1 |
| X-2 | High | Replayable log vs pruning; credit state missing | 05 §2/§3 vs 03 §4.2 | H-4 |
| X-3 | Medium | "Released" is per **course** in the settings invariant but per **level** in the manifest | 02 §2.1 invariant 2 (`course.releasedLocales`) vs 04 §3 (`releasedLocales: Record<LevelId,…>`) | Define semantics: a course is *selectable* in a locale if ≥ 1 level is released; levels gate individually. Specify what happens when a learner changes `explanationLocale` mid-course and their current level is not released in the new locale (see M-3) |
| X-4 | Medium | Policy lives in the course manifest (03 §4.2, §6), but P1 implements reward policy and completion *before* manifests exist (P2/P3) | 03 vs 08 P1 | P1 uses a temporary in-code policy table keyed by activity kind; state this and migrate in P2 (08 P1 mentions only a per-unit section table) |
| X-5 | Medium | `ProgressPort.record()` is synchronous (`RecordOutcome`) while `StorageRepository` is asynchronous with transactions | 05 §4.1 vs §6 | Make `record` async or define in-memory-first with write-behind and explicit durability semantics |
| X-6 | Medium | Lesson lifecycle owner is "classroom/booking boundary" | 09 §9.3 vs §2 module map | Assign the Lesson aggregate to one module (recommend `classroom`) |
| X-7 | Medium | Router swap placed at P6 but P5 needs two-pane/nested routes and focus-on-route-change | 07 §3 vs 06 §4 and 08 P5/P6 | Either pull the typed router into P5 or specify master-detail on the hash router |
| X-8 | Low | Bottom nav limited to 5 items; destinations listed: Home, Learn, Practice, Teachers, Progress, Me (six) | 06 §4.1 | Merge or demote one; open item exists but the table is inconsistent |
| X-9 | Low | Bundle budget "≤170 KB gzip" is *larger* than today's 146 KB even though content moves out of the bundle | 07 §4 | Budget should be derived after measuring the shell without content |

---

## 6. Missing requirements

| # | Sev | Missing requirement |
|---|---|---|
| R-1 | Medium | **Incomplete evidence inventory:** the Set's V-03 list of hard-coded Russian omits `src/features/grammar/Labs.tsx` (lines 157, 193, 229–230, 289) — it contains Russian prose and a **binary `lang === 'de' ? German : Russian` branch** that would give Kyrgyz users Russian. A repository search finds Cyrillic literals outside `i18n/` and `data/` in six files (TutorChat, Labs, questions, WordCard, analysis, tutor). Neither the Audit, the Review nor the Set lists Labs. Add a static inventory step to P2 |
| R-2 | Medium | **Locale-dependent question generation:** vocabulary quizzes build options from translations (`v.ru`); with per-locale translations, distractor uniqueness, ambiguity (two words with the same Kyrgyz meaning) and stable question ids become locale-dependent. The validator should check option uniqueness per locale; question ids must not collide across locales |
| R-3 | Medium | **Mid-course locale change** semantics (see X-3): what progress is shown, what is unavailable, how the learner returns |
| R-4 | Medium | **Teacher verification specification:** decision criteria, evidence types, reviewer staffing and SLAs, appeal process, document retention/deletion, re-verification triggers, fraud signals — 09 §5 lists states and `[A]` inputs only |
| R-5 | Medium | **Booking-hold abuse controls:** unpaid holds block a teacher's slot for the TTL; no cap on concurrent holds per student/IP/account, no penalty/cooldown. (Searching 09 finds no such limit.) |
| R-6 | Medium | **Teacher no-show/late/quality evidence and dispute SLAs**: what evidence decides a no-show (attendance events only?), time to resolve, who arbitrates |
| R-7 | Low | Notification channels, preferences and delivery guarantees (email/push) and their localization (chrome → `uiLocale`) are not specified |
| R-8 | Low | Product analytics/outcome measurement is intentionally absent ("analytics-free diagnostics"); there is no way to learn whether the new features improve learning. State a privacy-compatible measurement approach or the explicit decision not to measure |
| R-9 | Low | Content licensing/ownership for course content, audio and teacher-uploaded material |
| R-10 | Informational | Accessibility requirements for the marketplace's classroom (provider SDK accessibility is outside our control) |

---

## 7. Overengineering risks

| # | Sev | Item | Why it is a risk | Recommendation |
|---|---|---|---|---|
| O-1 | Medium | **Event-log progress model with sync metadata** (`deviceId`, `seq`, replayable results) for a local-only app with no sync until P8 | Larger implementation surface in P1, the phase that must be small and safe | Keep results and idempotency; defer `seq`/device metadata to P8; use derived-state snapshots (H-4) |
| O-2 | Medium | `StorageRepository` with `transact`, `watch`, async iterators, quota API, three adapters (local, IndexedDB, remote) | `localStorage` is synchronous and tiny; the abstraction is heavy for P1 | P1: a thin validated `KeyValueStore` with versioning and quarantine; extract the richer port when IndexedDB is actually needed |
| O-3 | Medium | **Manifest as a mini configuration language** (lesson templates, unlock rules, policies, assessment bands) | Risk of building an under-tested DSL before the second course exists | Start with fixed structure + a small set of declarative fields; add template/rule features when English A1 needs them |
| O-4 | Low–Med | Four registries plus branded types plus layered lint plus `tsc` project references plus dependency-cruiser | Tooling cost before the team feels the pain | Adopt branded types and one boundary tool; defer project references |
| O-5 | Medium | **Backend described as 13 modules**, double-entry ledger, outbox, job queue, OIDC and MFA before any backend code exists | Premature detail that may be wrong once Q6/Q7 are decided | Treat 07 §8 and 09 as target boundaries; require an ADR at P8 start; start with `identity/profile/sync` only |
| O-6 | Medium | Visual regression on three browsers × all routes × five viewports × locales | High flake and maintenance cost | Chromium for visual diffs on a curated route set; WebKit/Firefox for smoke + overflow/target audits only |
| O-7 | Low | Decision sprawl in 07 (Zod/Valibot, router, Zustand/custom, TanStack Query, PWA plugin) | Delays starting | Pick defaults now; ADR only on deviation |
| O-8 | Low | Marketplace future extensions in detail (§16) | Fine as notes; ensure nothing in P9 implements them | None |

No abstraction proposed is *wrong*; the risk is doing all of them before they are needed. The ports that have a concrete second implementation or test fake today (settings, progress, storage, speech, assessment) are justified.

---

## 8. Remaining findings by severity

### Medium
- **M-1 Router/PWA coupling.** History-mode URLs are bundled with PWA work (07 §5, 08 P6). A service worker and manifest work with hash routes; coupling raises P6 risk (hosting rewrite rules, redirect of legacy links). Decouple: ship installability first; move to history routing only if a requirement (SEO for teacher profiles) demands it.
- **M-2 Dual systems in P2.** The compat layer keeps old `t()`/`tr()`/store alongside the new resolver/stores. No sunset criteria. Add a removal checklist and a CI count of legacy API usages that must reach zero.
- **M-3** See X-3/R-3.
- **M-4 Marketplace operational risks:** chargeback after payout, negative balance, refund of commission, payout failure handling — see H-2.
- **M-5 `TeacherRecommendationPort`:** violates same-layer rules (H-1) and raises a privacy question (sending CEFR level/explanation locale to a search). Recommend that learning surfaces only render a *link* to `/teachers?lang=de&level=B1`; the marketplace reads its own context. No port, no coupling.
- **M-6/M-8** See X-8, X-6.
- **M-7** See R-4.
- **M-9 Interface sufficiency for backend integration:** `ApiClientPort` and `RemoteRepository` are named but not specified: error model (retryable vs fatal), auth refresh, idempotency header contract, pagination convention, versioning, optimistic-concurrency semantics, offline queue behaviour. Sufficient as boundaries; **not** sufficient as contracts. Add a contract appendix before P8.
- **M-10** `partial` item: the Set defines an exclusion constraint including `buffer` (09 §8.2); changing a teacher's buffer after bookings exist would retroactively conflict. Store the buffer in each booking row. Also note the Postgres `btree_gist` extension requirement.

### Low
- L-1 Document names the product "BilUp Til" while package/localStorage keys remain `bilup-deutsch`; renaming keys is a migration concern (5 §11 handles the old key; new key names should be neutral).
- L-2 Thresholds marked `[A]` (idle 60 s, hold 10–15 min, pass 0.7) are acceptable as proposals but must be ratified at the phase that uses them (the Set says so).
- L-3 Several documents refer to "Q-level" or generic open items without ids (03 §12).

### Informational
- I-1 The Set's rejection of microservices and of a rewrite is consistent with the repository's size (60 source files, ≈6,260 lines).
- I-2 Typecheck passes at HEAD; the Set's baseline numbers (226 vocabulary, 202 exercises, 121/280 Kyrgyz keys) match the Review's counts.
- I-3 The Audit's "all 16 routes show no overflow" remains single-author evidence; the Set correctly labels it and plans an automated per-route detector.

---

## 9. Answers to the specific questions

| Question | Answer |
|---|---|
| **Can the existing app evolve into this without a rewrite?** | **Yes, with a caveat on wording.** The UI shell, CSS tokens and ~11 primitives, lesson/quiz flows, SRS and recommendation logic carry over. But 27 files use `t()/tr()`/settings, 28 import `src/data`, and 11 write rewards directly. The data, i18n and store layers are effectively **replaced behind adapters** (P1–P3). Call it "incremental replacement of the core, reuse of the shell", not "evolution", so expectations about effort are honest. |
| **Unnecessarily complicated abstractions?** | See §7: event-log metadata, repository richness, manifest DSL, backend detail. None is wrong; all are early. |
| **Circular dependencies / unclear ownership?** | No literal cycles are proposed, but the rules as written are contradictory (H-1) and Lesson ownership is ambiguous (X-6). |
| **Interfaces sufficient for backend integration?** | Boundaries yes, contracts no (M-9, X-5). |
| **Are language/localization requirements testable?** | Mostly, once C-1 is fixed with provenance-based tests. Translation *quality* remains a human-review requirement and is correctly separated (04 §8). |
| **Can the marketplace be introduced without destabilising the learning platform?** | Structurally yes (separate module, flag, backend, no shared stores). The real destabiliser is **P8** (accounts/sync touching the learner's local-first data), not the marketplace itself. Keep sync opt-in and anonymous/offline use intact; ship marketplace as a lazily loaded bundle. |
| **Payment and verification assumptions sufficiently specified?** | **No** (H-2, R-4). They are correctly flagged as unresolved, but the Set still presents specific flows as the default. |
| **Does the roadmap prioritise dependencies correctly?** | Mostly. Corrections: start Kyrgyz translation early (H-3), decouple router/PWA (M-1), add a decisions/staffing gate (H-6), add language-pack work for English (H-5), schedule the static hard-coded-text inventory in P2 (R-1). |

---

## 10. Recommended corrections, prioritised

| Priority | Correction | Findings |
|---|---|---|
| 1 | Replace the leak-test denylist with **provenance-based** tests and a script-agnostic static rule; correct the Kyrgyz-letter claim | C-1 |
| 2 | Redraw the layer diagram so ports live in lower layers; fix 07 §6; prototype the boundary config | H-1, X-1, M-5 |
| 3 | Resolve snapshot-vs-replay and add per-item credit state | H-4, X-2 |
| 4 | Gate P2 behind a flag and plan Kyrgyz translation from P0; split R1 | H-3 |
| 5 | Payment/legal ADR as an entry gate for P9; capability-based `PaymentProvider` | H-2, M-4 |
| 6 | Language-pack deliverable (English analyzers/tutor/visuals) and English acceptance criteria | H-5 |
| 7 | Content-capacity model, minimum scope, decisions/staffing gate | H-6 |
| 8 | Define per-level release semantics and mid-course locale change; async `record` | X-3, X-5, R-3 |
| 9 | Specify teacher verification, hold abuse limits, no-show evidence and dispute SLAs | R-4–R-6 |
| 10 | Simplify early abstractions (events metadata, repository, manifest DSL, test matrix) | O-1…O-6 |
| 11 | Decouple router from PWA; settle Lesson ownership; reconcile navigation items; add backend contract appendix | M-1, X-6, X-8, M-9 |

---

## 11. Revised implementation sequence

```
Phase −1  Decisions & staffing gate (no code)
          – Kyrgyz translators/reviewers (Q2); English authors (Q3); backend runtime/hosting (Q6)
          – Minimum scope for first multilingual release (e.g. German A1 ky+ru, English A1 ky+ru)
          – Marketplace ADR inputs started in parallel (Q7–Q11): markets, provider capability matrix, legal structure
Phase 0   Safety net: tests, lint, CI, characterisation, boundary prototype, static inventory of hard-coded text
   ║ parallel  Content track K: export existing German A1 content to a neutral format; begin Kyrgyz authoring/review
Phase 1   Progress integrity & recoverable storage  (thin store, ActivityResult, snapshot model)   → R0
Phase 2   Language & course model  (feature-flagged; legacy path preserved until gate)
Phase 3   Content pipeline: convert to course pack, validator, coverage gate; release German A1 in ru, then ky at 100 %   → R1a / R1b
   ║ parallel  PWA installability (manifest + shell cache) can start after Phase 0; offline packs after Phase 3
Phase 4   Learning Engine consolidation (+ tutor/session fixes, reading kind, assessment labelling)
Phase 5   Responsive/accessibility + onboarding (decide router first: typed router now or two-pane on hash)
Phase 6   PWA offline packs, update flow (history routing only if required)                          → R2
Phase 7   Content expansion, per level, per language, per locale; includes English language pack (analyzers, tutor, visuals)
Phase 8   Backend foundation (identity, profile, opt-in sync) – only after ADRs; minimal modules first
Phase 9   Marketplace – blocked until payment/legal/verification ADRs and specifications are complete
          9a catalog+verification → 9b booking with fakes → 9c sandbox providers/ledger/disputes → 9d pilot
Phase 10  Group lessons, packages, subscriptions (future)
```
Changes from the Set's roadmap: Phase −1 and the parallel Kyrgyz track are new; R1 split; PWA installability pulled earlier; router decision moved to Phase 5; English language pack added to Phase 7; marketplace entry gates strengthened.

---

## 12. Final readiness assessment

| Question | Assessment |
|---|---|
| Ready for implementation planning? | **Conditionally yes.** Plan P0–P1 now. |
| Blocking items before detailed P2–P6 planning | C-1, H-1, H-3, H-4 (documentation corrections, small effort) |
| Blocking items before P7 commitments | H-5, H-6 (staffing, scope, English language pack) |
| Blocking items before P8 | Backend runtime/hosting, privacy/minors, contract appendix (M-9) |
| Blocking items before P9 | H-2, R-4–R-6, Q7–Q11 closed with ADRs |
| Verdict | The architecture direction is **sound**; the Set is **a good draft, not yet a baseline**. After the corrections in §10 items 1–4 it can serve as the baseline for P0–P6 planning. The marketplace section should be treated as a **target concept** until legal, payment and verification decisions are made. |

*Unverified in this review:* real-device and screen-reader behaviour, colour contrast, provider-specific payment constraints, the Kyrgyz alphabet claim and any translation quality (needs a native speaker), actual implementation effort.
