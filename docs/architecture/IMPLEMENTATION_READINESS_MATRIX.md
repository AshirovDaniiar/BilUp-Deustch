# BilUp Til 2.0 — Implementation Readiness Matrix

Companion to [`FINAL_INDEPENDENT_AUDIT.md`](FINAL_INDEPENDENT_AUDIT.md) (finding ids **FA-nn**) and [`CONSOLIDATED_OPEN_DECISIONS.md`](CONSOLIDATED_OPEN_DECISIONS.md). Date: 5 November 2026. Baseline: repository HEAD `386c6a1`, architecture documents 01–11 (Revision 3).

**Rating scale (strict):**
- **READY** — specification complete and internally consistent; no unresolved decision changes what would be built.
- **READY WITH CONDITIONS** — can start, but only if the listed conditions are met; residual risk is bounded.
- **NOT READY** — an unresolved decision, contradiction or missing specification would change what is built, or the work would be unsafe to launch.

"Planning" = may be scheduled and staffed. "Build" = engineers may start. "Launch" = may be exposed to real users/money.

---

## 1. Phase readiness

| Phase / track | What it delivers | Planning | Build | Launch | Blocking decisions | Blocking findings | Conditions / what is missing |
|---|---|---|---|---|---|---|---|
| **G0** Decisions & staffing gate | Approvals for scope, staffing, glossary, pilot, decision owners | **READY WITH CONDITIONS** | n/a (no code) | n/a | Q1, Q2, Q3, Q6, Q12, Q15, Q16; owners for U/L/D lists | FA-03, FA-07 | Gate text must be aligned (prerequisites "01–11", acceptance incl. item 10 — economics record); add A-01…A-14 (audit-raised) to the agenda |
| **Track K** (Kyrgyz/Russian translation) | Translated content ahead of code | **READY WITH CONDITIONS** | READY WITH CONDITIONS | n/a (not user-visible) | Q2 (people), glossary | — | Needs named Kyrgyz translator + 2 independent reviewers (04 §13.5); throughput pilot first |
| **P0** Safety net (tests, lint, CI, boundaries report-only, content-validate skeleton) | Regression safety | **READY** | **READY** | **READY** | none | none | Tooling ADR only; K3 matrix already consistent |
| **P0b** PWA-lite | Installability, shell-only service worker, kill-switch | **READY** | **READY** | **READY WITH CONDITIONS** | Q12 (name for manifest) | none | Kill-switch and Lighthouse installability gate as specified; confirm app name before icons |
| **P1** Progress integrity & storage | `ActivityResult`, credit ledger, thin store, migration | **READY** | **READY** | **READY WITH CONDITIONS** | none | none (FA-13 concerns later sync, not P1) | Legacy migrator golden fixtures; confirm retention parameters (05 §4.4 [A]) before archival ships |
| **P2** Language & course model (flagged) | Four settings, registries, manifest, legacy i18n isolated | **READY WITH CONDITIONS** | READY WITH CONDITIONS | **NOT READY** (until P3 gates) | Q1, Q4 | FA-16 (contract inventory) | Complete the contracts inventory first (needed for the boundary rules to become errors); static hard-coded text inventory |
| **P3** Content pipeline & localization | Course pack, validator, G-ru/G-ky gates | **READY WITH CONDITIONS** | READY WITH CONDITIONS | **NOT READY** for `ky` until G-ky | Q2, Q15, Q16 | FA-05 (paid sale in `ky`) | Needs Track K output; quality-gate thresholds signed; Kyrgyz glossary |
| **P4** Learning Engine consolidation | Engine contracts, tutor session scoping, language-pack contract | **READY WITH CONDITIONS** | READY WITH CONDITIONS | READY WITH CONDITIONS | none new | FA-01 (tutor scope) | Decide what "tutor" will be (U-20) — P4 explicitly excludes a real model |
| **P5** Responsive UX & accessibility | Medium shell, onboarding, a11y | **READY WITH CONDITIONS** | READY WITH CONDITIONS | READY WITH CONDITIONS | Q12, Q14 | FA-19 (Live UI not specified), FA-29 | Router decision at start; device lab; Live UI requirements missing for later |
| **P6** PWA offline | Offline packs, update flow, IndexedDB if needed | **READY WITH CONDITIONS** | READY WITH CONDITIONS | READY WITH CONDITIONS | Q13 | FA-09 (offline lease/revocation) | Offline entitlement lease (U-17) must be decided if packs become paid |
| **P7** Content expansion (en language pack → English A1 → A2–B2) | Courses and language packs | **NOT READY** to commit | READY WITH CONDITIONS for P7a | READY WITH CONDITIONS per gate | Q3, Q15, Q16, A-01 | FA-02; FINAL-review H-7 (Live material workload not estimated) | Estimates are [A] until the throughput pilot; plan promise (A-01) must be settled; Live weekly materials not in estimates |
| **P8** Backend foundation (identity, profile, opt-in sync) | Accounts, API, sync | **READY WITH CONDITIONS** | **NOT READY** to build sync | **NOT READY** | Q5, Q6, Q11, privacy basis | FA-10, FA-11, FA-12, FA-13, FA-14 | Operations baseline; data-protection basis; sync conflict rules; id-stability dependency on P3; staff/key security |
| **P8b** Subscriptions & entitlements | Plans/plan versions, billing, entitlements, gated delivery, UI | **NOT READY** | **NOT READY** (state model unfinished) | **NOT READY** | U-01, U-02, U-03, U-04, U-05, U-06, U-07–U-10, U-15, U-16, U-20, A-01, A-02, S-D | **FA-01, FA-02, FA-03, FA-05**, FA-06, FA-08, FA-09, FA-10, FA-11, FA-12, FA-15 | Complete state tables; entitlement read-model and owning modules; back-office/notifications/invoices scope; unit-economics record; honest AI Tutor definition; launch-commitments rule; S-D |
| **P8c** BilUp Live MVP | Series/schedule, token-gated join, interactions, moderation, attendance | **NOT READY** | **NOT READY** (provider and language model unknown) | **NOT READY** | L-01…L-14, L-D, S-D | **FA-04**, FA-09, FA-10, FA-11, FA-12, FA-18, FA-19, FA-20, FA-21 | Spoken-language policy; provider capability verification (L-03); moderation staffing/minors; recording boundary; accessibility; reconnect semantics |
| **P9** Marketplace | Catalog, booking, payments, classroom, reviews | **NOT READY** | **READY WITH CONDITIONS** for P9a on fakes only | **NOT READY** | D1–D9 (P9-D), Q7–Q11, Q17 | FA-06, FA-17 | Fix stale statements; declare dependency on P8b `payments`/outbox; P9-D is a hard launch gate |
| **P10** Expansion | Marketplace group lessons, packages, etc. | **NOT READY** (out of scope) | — | — | — | — | Future |

### Reading the table
- **Safe to staff now:** G0, Track K, P0, P0b, P1.
- **Safe to plan (not commit dates):** P2–P6, P8 (with conditions).
- **Not ready:** P7 commitments, P8b, P8c, P9, and any real-money or real-participant launch.

---

## 2. Cross-cutting readiness by domain

| Domain | Status | Evidence | Gap / required work |
|---|---|---|---|
| Module boundaries & dependency policy | **READY** | 01 §4.2; matrix verified (0 violations) | Complete the contract inventory (FA-16) |
| Language model (four settings) & strict locale policy | **READY WITH CONDITIONS** | 02, 04 §7.3 | Third-party UI exceptions (FA-21); Kyrgyz glossary/people (Q2) |
| Learning engine, progress & storage | **READY** | 03, 05 | Sync rules for later (FA-13) |
| Content production plan | **READY WITH CONDITIONS** | 04 §13 | Estimates unvalidated [A]; Live materials not included |
| Subscription domain model | **NOT READY** | 11 §4–§6 | State tables, invariants, timeouts (FA-08) |
| Entitlement service | **NOT READY** | 11 §13–§14 | Read model, failure policy, revocation, module owners (FA-09) |
| Payment abstraction | **READY WITH CONDITIONS** | 07 §9, 11 §7 | Provider unknown; add locale support criterion (FA-21); S-D |
| Billing back-office, notifications, invoices | **NOT READY** | not scoped | FA-15 |
| BilUp Live access & security | **READY WITH CONDITIONS** | 10 §6, 11 §8 | Staff MFA, reconnect, surge (FA-12, FA-20) |
| BilUp Live product operations | **NOT READY** | 10 §11, §16 | Staffing, language policy, moderation capacity, minors (L-01, L-10, L-12) |
| Global no-recording policy | **READY WITH CONDITIONS** | 10 §9 | Define the boundary (FA-18) |
| Marketplace isolation | **READY WITH CONDITIONS** | 09 §1.2, 11 §9 | Fix stale text; declare P8b dependency (FA-06, FA-17) |
| AI Tutor (as sold) | **NOT READY** | 03 §9, 11 §11 | Decide mock vs real; add a phase if real (FA-01) |
| Security baseline | **READY WITH CONDITIONS** | 07 §10, 09 §10, 10, 11 §13 | Key management, staff MFA, takeover protections, rate-limit coverage (FA-12) |
| Privacy & data protection | **NOT READY** | 05 §10, 09 §11 | Regime, DPIA/inventory, breach process, legal documents (FA-11) |
| Testing strategy | **READY WITH CONDITIONS** | 02 §7, 03 §11, 05 §12, 07 §7, 10 §17, 11 §15.2 | Tests for state tables, entitlement revocation timing, locale of third-party UI |
| Monitoring & operations | **NOT READY** | 07 §8, 10 §16 | FA-10 |
| Roadmap realism | **NOT READY** to commit dates | 08 | Engineering estimates and team assumptions (FA-14) |
| Responsive & accessibility (learning app) | **READY WITH CONDITIONS** | 06 | Live UI and captions (FA-19); real-device matrix |
| Documentation consistency | **NOT READY** | audit §3 | Nine contradictions to fix before the set is a baseline |

---

## 3. Entry criteria per phase (what must be true before "Build")

| Phase | Entry criteria |
|---|---|
| P0, P0b, P1 | none beyond tooling ADRs and (P0b) app name |
| P2 | contract inventory complete; Q1, Q4 decided; boundary rules agreed |
| P3 | Track K deliverables; G-ru/G-ky thresholds signed (Q16); glossary approved |
| P8 | operations baseline; data-protection basis and consent flows defined; sync conflict rules and id-stability decision; staff/key security requirements |
| **P8b** | **all of:** state tables + invariants (FA-08); entitlement read model/failure policy/owners (FA-09); economics record with thresholds (FA-03); U-20 answered; A-01 (launch commitments) answered; back-office/notifications/invoice scope (FA-15); S-D for real money |
| **P8c** | P8b complete; L-01, L-03, L-10, L-12 decided; recording boundary (FA-18); Live accessibility (FA-19); staff MFA (FA-12); L-D for any pilot |
| **P9** | P8b `payments`/outbox delivered or re-planned (FA-06); P9-D for any real transaction |

## 4. Verdict
**READY WITH CONDITIONS** for P0, P0b, P1 (and planning of P2–P6, P8). **NOT READY FOR IMPLEMENTATION** for P8b, P8c, P9 and for any commitment to P7. The architecture documents are **not yet a consistent baseline** (nine contradictions), which is itself a condition for P2+ planning.
