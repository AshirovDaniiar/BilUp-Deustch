# BilUp Til 2.0 — Final Architecture Review (Revision 3)

**Date:** 5 November 2026 · **Scope:** documents 01–11, `ARCHITECTURE_CHANGELOG.md`, the Audit, the first independent review and the architecture review · **Context:** integration of the approved subscription model (**BilUp Basic 99 KGS/month**, **BilUp Premium Live 149 KGS/month**) and BilUp Live.

**Reviewer disclosure.** The same AI model family authored the earlier documents and this revision; this is a *self-review with scripted checks*, not an organisationally independent audit. §3 states exactly which checks were run and which were **not**. Severity scale: **Critical** (blocks real operations or invalidates a promise), **High**, **Medium**, **Low**, **Informational**. Evidence labels as in 01 §0.1.

---

## 1. Overall architecture assessment

**The architecture is coherent as a planning baseline and ready to plan P0–P1 and P0b; it is not ready to commit to subscriptions, BilUp Live or the Marketplace as deliverables, because their feasibility depends on business, legal and provider facts that are unknown.**

What holds up:
- **One platform, three revenue-bearing pillars** (self-study sold as BilUp Basic; BilUp Live included in BilUp Premium Live; the Marketplace as a separate paid service) with **server-side entitlements** as the single access mechanism (11 §3, §10.4, §13).
- **Five independent subscription concepts** (plan/plan version, subscription, invoice, payment transaction, derived entitlements) with separate state machines; prices, grants, limits, grace and change policies are **configuration** in immutable plan versions, so price changes never touch history (11 §4, §10).
- **BilUp Live** is its own module with token-gated, server-side join (no shareable room URL), a provider capability gate, DST-safe scheduling and a **global no-recording rule** (10 §6–§9).
- The existing strategy (modular monolith, ports in `shared/contracts`, one authoritative dependency policy, strict locale policy, staged localization, course-scoped idempotent progress) is **preserved**; the dependency matrix now includes the two new frontend modules and still passes the mechanical direction check (§3).
- Unapproved business decisions are **kept out of the architecture** and collected in authoritative lists (U-01…U-20 in 11 §16; L-01…L-14 in 10 §18; Q1–Q19 in 01 §9).

What does **not** hold up yet is listed in §2 and §5.

---

## 2. Findings

### Critical (block real operations — not planning)
| ID | Finding | Evidence | Treatment |
|---|---|---|---|
| **C-1** | **The sustainability of 99/149 KGS is unknown.** All major costs (Live teachers, streaming provider, AI API, payment fees, hosting, content, support, tax) are unquantified. Premium Live adds only **50 KGS** of gross billing over Basic to fund fixed teacher hours plus variable streaming cost; payment fees may be a large share of a 99 KGS charge | 11 §12 (revenue arithmetic verified by script; costs classified known/unknown, none invented) | No profitability claim is made. **G0 requires a validated unit-economics model** from quoted prices, measured AI cost and a pilot **before P8b investment** (08 G0 item 10); prices stay in plan versions (U-16) |
| **C-2** | **No payment provider, legal structure or recurring-charge capability is known for KGS.** If recurring charges are unavailable, renewal is manual and involuntary churn changes the economics | 11 §7, §5.2; U-03, U-04 | Capability-based `PaymentProvider`, **manual-renewal mode** designed in, `FakePaymentProvider` only; **decision record S-D** blocks any live charge |
| **C-3** | **One Live teacher cannot satisfy both Kyrgyz and Russian explanation locales in speech.** The "complete Kyrgyz/Russian" rule can only be met for *written* material | 10 §12 (L-01) | **Unresolved by design.** Written Live material needs `ky`+`ru` versions; spoken policy is a G0/L-D decision |

### High
| ID | Finding | Evidence | Treatment |
|---|---|---|---|
| H-1 | **"AI Tutor" is a plan feature but only a rule-based mock exists, and no roadmap phase delivers a real model.** Selling a demo mock as an AI feature is a consumer-honesty and product risk; fair-use metering is moot until a metered model exists | 03 §9 ([V] mock, regex rules); 11 §11; 08 (no LLM phase) | Added **U-20**; metering is designed but flagged; **a delivery phase is not added** because the intent (mock vs real) is not decided |
| H-2 | **Paid access conflicts with static public content and offline PWA.** Packs are static CDN files; the PWA caches them | 04 §10 (rev 1), 07 §5 | Reconciled in docs: static delivery holds **until P8b**; then entitlement-checked delivery and a signed, expiring offline lease; copy risk accepted and stated (04 §10, 07 §5/§10, 11 §13). **Not yet validated in practice** |
| H-3 | **P8b depends on P3 (packs to gate); P3 depends on Kyrgyz translation capacity** — subscription launch could be paced by the content pipeline | 08 P8b prerequisites | Sequenced explicitly; fallback is to gate at app level for Russian-only launch (not designed in detail) |
| H-4 | **Live provider feasibility is unverified:** hundreds of participants, per-participant tokens, no public room URL, publisher promotion, **verified recording-off** — no provider is known to satisfy all | 10 §7 capability gate; L-03 | No provider chosen; ineligible providers are excluded by the gate; pilot blocked until **L-D** |
| H-5 | **Existing free/anonymous MVP users and the "no subscription" state are undefined** | U-01, U-02; 01 §4.5, 08 P8 | Matrix keeps a configurable entitlement set for "no active subscription"; not decided |
| H-6 | **Live moderation, safety and minors** are undecided; one host plus moderators for hundreds of participants has staffing and legal implications | 10 §11; L-10, L-12 | Tooling designed; staffing/minors left open; **L-D** |
| H-7 | **Weekly Live materials in two locales are recurring translation work not covered by the 04 §13 estimates** (which are themselves unvalidated assumptions) | 10 §12, 04 §13 | Flagged in 04 §12 and 10 §12; not estimated |

### Medium
| ID | Finding | Treatment |
|---|---|---|
| M-1 | Grace-period semantics for Live (does a `past_due` account still join?) | Configurable `GracePolicy.scope`; decision U-05 |
| M-2 | Upgrade proration/refund/downgrade/cancel policies | `ChangePolicy` abstraction; options A–D documented, none chosen (U-07–U-09) |
| M-3 | Live attendance/quiz results vs local progress/XP | Boundary fixed: server-side only, not in the local ledger; XP is L-13 |
| M-4 | Realtime transport for Live interactions undecided (provider channel vs own endpoint) | `RealtimeChannel` contract; L-05; validate at P8c start |
| M-5 | Shared `payments` module couples subscription and Marketplace infrastructure | Purpose-tagged transactions, separate records and reconciliation, same dependency policy; revisit if either grows |
| M-6 | Seven navigation destinations in five compact slots | Composition rule in 06 §4.1 (UX proposal, tested ≤ 5) |
| M-7 | Account sharing for self-study content | Business decision U-18; only Live has technical single-connection control |
| M-8 | Billing timezone / month arithmetic | UTC instants, calendar-month with end-of-month clamp; U-19 |

### Low / Informational
| ID | Finding |
|---|---|
| L-1 | `10_BILUP_LIVE_ARCHITECTURE.md` did not exist; it was **created** from the approved rules only (provenance stated in the file). Stakeholders should confirm it matches their intent. |
| L-2 | Revision-2 changelog text still says "outbox/job runner from P9b" — it is historical and corrected by the Revision 3 entry; the active documents (01, 07, 08, 09) now say P8b. |
| L-3 | ISO 4217 decimal handling for KGS and display formatting are assumptions to confirm in implementation (11 §2.1). |
| I-1 | The approved model never defines a free tier, trial or annual plan; they are extension points, not commitments. |
| I-2 | Marketplace booking is assumed independent of subscriptions (U-13). |

---

## 3. Cross-document consistency results

**Checks actually performed** (tools: `grep`, small Node scripts kept outside the repository, and reading):

| # | Check | Method | Result |
|---|---|---|---|
| 1 | Every cross-reference of the form `NN §x.y` in docs 01–11 and the changelog points to an existing heading | script over all `##/###/####` headings | **0 broken** (11 docs). Limit: list continuations such as "(04 §13.1, §13.3)" were spot-checked, not auto-resolved |
| 2 | Intra-document `§` references in 09, 10 and 11 | script | **none missing** |
| 3 | Allowed-edge matrix (07 §6.1): 12 rows × 12 columns; every `✓` goes strictly from a higher layer to a lower one (L5>L4>L3>L2>L1>L0), no same-layer edges, correct column counts | script | **0 violations**; Live/Marketplace/Subscription have no edge to each other or to core/engine/features/content |
| 4 | Revenue and capacity tables in 11 §12 recomputed | script | **all values match**; upgrade illustration (33.33 / 66 / 83) matches |
| 5 | **99 KGS / 149 KGS** appear consistently as Basic/Premium Live in 01, 08, 09, 10, 11; no other plan price exists | grep | **consistent**; other KGS numbers are derived illustrations in 11 §6.1/§12 |
| 6 | "Premium" never appears without "Live"; no variant plan names ("Pro", "Plus", "Live add-on") | grep | **none found** |
| 7 | **Both Live sessions are in Premium Live**, **Basic does not include Live** | grep + reading of 01, 10, 11 | consistent (11 §1, §3.2; 10 §1, §3; 01 §0.2, §1) |
| 8 | **No recording functionality anywhere** | grep for `recording`, `replay`, `getRecording`, `egress`, `MediaRecorder` across all docs | Hits are **prohibitions only** (01, 07, 08, 09, 10, 11); the earlier optional Marketplace recording in 07/09/01 Q10 was **removed**. (`egress` also matches "regression" — false positives ignored) |
| 9 | **Marketplace lessons are not in any plan** | grep + reading | consistent (11 §1, §3.2, §9; 09 §1.2; 10 §14); Marketplace "subscription" offer kind renamed `teacher_subscription` |
| 10 | Payment status ≠ subscription status | reading of 11 §4–§5, 09 §9 | separate machines with an event mapping table (11 §5.4) |
| 11 | Phase references: P8b/P8c, S-D/L-D/P9-D consistent across 01, 07, 08, 10, 11 | grep | consistent after fixing **one stale statement** (09 §9 said the outbox arrives in P9b — now P8b) |
| 12 | Unresolved-decision mirrors: Q18 ↔ U-list, Q19 ↔ L-list | grep | consistent after fixing one wrong mirror reference (10 §18 said Q18) and adding U-20 everywhere |
| 13 | Terminology: UI locale vs explanation locale vs target language vs course for Live and subscription text | reading of 02 §3 additions, 10 §12, 11 | consistent; Live spoken language flagged unresolved |

**Defects found by these checks and fixed in this pass:** stale outbox phase in 09 §9; wrong Q-mirror in 10 §18; missing prerequisites in 10 §17 and 11 §15.1 (P5; P3); an over-confident "visible to all signed-in accounts" statement in 10 §6.1 (now L-09); the Live-first navigation proposal needed a fresh composition rule (06 §4.1).

**Checks NOT performed (do not infer they passed):**
- A **complete line-by-line re-read of every modified document.** I fully re-read **10** and **11** and read the modified regions of 01, 06, 07, 08, 09 at edit time; **02, 03, 04 and 05 were verified only at the edited lines** (grep) and not re-read in full.
- Automated verification of prose consistency (no linter or spell-check was run); no external review.
- Validation of any business fact, legal requirement, provider capability or cost — none was available.
- The revision-2 content (estimates in 04 §13, review thresholds) was not re-validated.

---

## 4. Remaining risks (summary)
1. **Economics unknown** (C-1) and **payment facts unknown** (C-2): the largest risks are commercial, not architectural.
2. **Live is the most cost- and operations-sensitive component:** fixed teacher hours, provider audience limits, moderation capacity, spoken-language problem (C-3), compensation for cancelled sessions with no replay.
3. **AI Tutor promise vs reality** (H-1).
4. **Content pipeline pace** (Kyrgyz review capacity) gates P3, which gates P8b (H-3).
5. **Single-model authorship:** the documents have not been reviewed by the business, legal counsel, a native Kyrgyz speaker or a provider.
6. **Over-specification risk:** 11 and 10 describe much that is deliberately not built; phase ADRs should trim at the start of P8b/P8c (as for backend modules in revision 2).

## 5. Unresolved business decisions (authoritative lists — not duplicated here)
- **Subscriptions U-01…U-20** — 11 §16 (free tier/trial, existing MVP users, provider/legal/tax, renewal mode, grace/retry, AI fair-use values, upgrade/downgrade/cancel/refund, cancelled-session compensation, materials/attendance after downgrade, Marketplace booking vs subscription, retention, price-change policy, cost model, offline lease, account sharing, billing timezone, meaning of "AI Tutor").
- **BilUp Live L-01…L-14** — 10 §18 (spoken language, times/timezone/DST, provider, material localization, realtime transport, retention, level bands, watermarking, schedule visibility, staffing, minors, XP, compensation).
- **Global Q1–Q19** — 01 §9 (incl. G0 items, quality-gate thresholds, minimum launch scope).
- **Decision records:** G0 (before planning commits dates), **S-D** (before any subscription charge), **L-D** (before a Live provider contract or participant pilot), **P9-D** (before Marketplace transactions).

## 6. Recommended implementation sequence
```
G0  decisions & staffing  (+ validated unit-economics model; owners/dates for U-, L-, Q- decisions)
 ├─ Track K (Kyrgyz/Russian translation)   P0 → P0b (PWA-lite) → P1 → P2 → P3 → P4 → P5 → P6 → P7 (content, per level/locale)
 └─ P8  backend foundation (identity, profile, opt-in sync)
        └─ P8b subscriptions & entitlements   needs P3 (packs to gate), P8; real money only after S-D
              └─ P8c BilUp Live MVP           needs P8b, P5; provider/pilot only after L-D
P9  Marketplace  needs P8, P5; independent of P8b/P8c; real transactions only after P9-D
P10 Marketplace expansion
```
Rationale: stabilise and localise the product first (R0–R1c); introduce accounts; then the **revenue core** (subscriptions) and its first gated premium feature (Live); the Marketplace is independent and can follow or run later. If the AI Tutor is meant to be a real model (U-20), a tutor-service phase must be added **before** P8b's metering has anything to meter.

## 7. Explicit readiness assessment

| Area | Ready for implementation planning? | Condition |
|---|---|---|
| P0, P0b (tests/CI, PWA-lite) | **Yes** | none beyond G0 tooling choices |
| P1 (progress integrity, storage) | **Yes** | none |
| P2–P6 (language model, content, engine, responsive, offline) | **Conditionally** | revision-2 conditions (G0 staffing, Kyrgyz gate); unchanged by this revision except entitlement gating at P8b |
| P7 (content expansion) | **Conditionally** | G0 scope/staffing; Live material localization not yet estimated |
| P8 (identity, sync) | **Yes, after** Q5, Q6, Q11 | privacy basics |
| **P8b (subscriptions)** | **No (not yet)** | G0 economics model; U-01, U-02, U-20 decided; S-D before any charge; P3 available |
| **P8c (BilUp Live)** | **No (not yet)** | P8b; L-01, L-03, L-10, L-12 decided; L-D before a pilot |
| P9 (Marketplace) | **No (not yet)** | P9-D |

**Overall verdict:** *a coherent, internally consistent architecture baseline for planning* — **not** a licence to build subscription billing, Live or the Marketplace. The most valuable next steps are business decisions and measurements (cost quotes, provider capabilities, spoken-language policy, AI Tutor intent), not more architecture text.

## 8. Confirmation
This pass changed **documentation only**. No application source, `package.json`, dependency, migration or infrastructure was created or modified. See `ARCHITECTURE_CHANGELOG.md` (Revision 3) for the complete list of document changes.
