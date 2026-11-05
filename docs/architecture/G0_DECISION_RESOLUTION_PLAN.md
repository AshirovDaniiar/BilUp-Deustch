# BilUp Til 2.0 — G0 Decision Resolution Plan

**Date:** 5 November 2026 · **Status of every decision in this file: OPEN** (nothing is approved by this document) · **Inputs:** `FINAL_INDEPENDENT_AUDIT.md` (FA-01…FA-30), `IMPLEMENTATION_READINESS_MATRIX.md`, `CONSOLIDATED_OPEN_DECISIONS.md`, `FINAL_ARCHITECTURE_REVIEW.md`, `ARCHITECTURE_CHANGELOG.md`, documents 01–11, the original technical audit and both earlier reviews.

**Method and limits.** All of these files were read in full earlier in this working session and are used here from their actual text; they were not re-opened line by line for this task, and no summary from a prior turn was substituted for the files. Nothing was modified. No financial, legal, provider or Kyrgyz-language fact was available, so none is asserted; every number that is not arithmetic on the approved prices is marked **UNKNOWN** or **[A]**. Owners are **roles**, not people. No calendar dates are given: deadlines are relative to **G0 sign-off**.

**Definitions.**
- **Group A — decide before implementation** of the affected phase (P0, P0b and P1 are blocked by none of them).
- **Group B — decide before commercial launch** (they do not change what engineers build first, but money or real users cannot be exposed without them).
- **Group C — can be postponed** past the first commercial launch (with the stated condition).
- *Blocks:* **Planning** = cannot commit scope/dates; **Development** = cannot start building the affected phase correctly; **Launch** = cannot expose real users/money; **None**.
- *Evidence type:* **E** = needs external evidence (quotes, legal advice, native reviewers, provider capability, pilot data); **I** = internal approval only.

---

## 1. Summary

| Item | Count |
|---|---|
| Audit findings accounted for (none merged, none omitted) | **30** (FA-01…FA-30) |
| Open decisions in the register (§6) | **76** (+ 3 alias IDs: L-11 = U-11, L-12 = Q11, L-14 = U-10) |
| Group A (block implementation of the affected phase) | **27** |
| Group B (block commercial launch) | **27** |
| Group C (postponable) | **22** |
| Decisions that block commercial launch in total (A + B) | **54** |
| Findings by group | A: 17 · B: 5 · C: 8 |
| Findings by severity | Critical 4 · High 10 · Medium 9 · Low 7 |

No decision blocks **P0, P0b or P1**.

---

## 2. Findings → required decisions (all 30)

Common fields per entry: **Severity · Source · Problem · Why it matters · Required decision · Category · Approver (role) · Blocks · Acceptance criteria to close · Documents to update · Group**.

### FA-01 — AI Tutor sold but not planned *(Critical, Group A)*
- **Source:** 11 §1 rule 1, §3.2, §11 (U-20); 03 §9; 08 P4 Risks, P8b Scope; 07 §10; 01 §1.
- **Problem:** The approved Basic plan promises "AI Tutor, subject to fair-use limits"; every phase keeps the rule-based regex mock and the documents design metering for a model no phase builds, selects, costs or privacy-assesses.
- **Why it matters:** Consumer-honesty/legal exposure; wasted P8b scope; a real model needs provider, cost and data-protection work that is unplanned.
- **Required decision:** What "AI Tutor" means at first commercial launch, and whether/when a model-backed tutor is delivered (§4.1).
- **Category:** Product (+ Technical, Legal). **Approver:** Business owner (promise), Technical lead (feasibility), Legal counsel (claims wording).
- **Blocks:** Planning (P8b scope), Development (P8b metering), Launch.
- **Acceptance:** Written selection of an option in §4.1; plan wording approved by Legal counsel; roadmap updated (new phase *or* metering removed); if a model is chosen — provider selection record, measured cost per interaction, data-protection assessment.
- **Docs:** 11 §1/§3.2/§11/§16, 03 §9, 08 P4/P8b, 07 §10, 01 §1/ADR list.

### FA-02 — A1–B2 promise vs A1 content *(Critical, Group A)*
- **Source:** 11 §1 rule 1, §3.2; 04 §13.1, §13.3; 08 P7, P8b prerequisites.
- **Problem:** Basic is defined as German and English A1–B2; the launch scope is A1 and levels release per (course, level, locale). Nothing says what may be sold or advertised when fewer levels exist.
- **Why it matters:** Charging on an unmet promise; entitlement matrix shows "✓ A1–B2" as if available.
- **Required decision:** Launch-commitments rule (A-01): what is sold when, plan copy generated from released levels, minimum content gate for paid launch (§4.2).
- **Category:** Business (+ Product, Legal). **Approver:** Business owner; Legal counsel for wording.
- **Blocks:** Planning, Launch (and P8b plan-copy design).
- **Acceptance:** Approved availability policy; a minimum paid-launch content gate expressed as (courses × levels × locales) that must be *released*; plan copy reads from the release matrix.
- **Docs:** 11 §1/§3.2/§16, 04 §13.1, 08 P8b/P7, 01 §7.

### FA-03 — Unit economics unknown; mitigation not enforceable *(Critical, Group A)*
- **Source:** 11 §12.6, U-16; FINAL review C-1; 08 G0 item (10) vs G0 Acceptance ("items 1–9"), P8b prerequisites.
- **Problem:** All costs unquantified; the economics gate exists as prose but is outside G0 acceptance.
- **Why it matters:** Building billing/Live on prices that cannot be sustained.
- **Required decision:** Adopt the validation model and pass criteria in §4.3 as a hard G0 criterion and P8b/P8c prerequisite.
- **Category:** Financial. **Approver:** Business owner with Finance/business analyst.
- **Blocks:** Planning, Development (P8b/P8c), Launch.
- **Acceptance:** Signed economics record that meets §4.3 (all inputs sourced, thresholds approved, scenarios computed); G0 acceptance text includes it.
- **Docs:** 08 G0/P8b/P8c, 11 §12.6, FINAL review §7.

### FA-04 — Live language policy *(Critical, Group A)*
- **Source:** 10 §12 (L-01); 01 §1.1.
- **Problem:** One teacher cannot give complete spoken explanations in both Kyrgyz and Russian; policy undecided.
- **Why it matters:** The largest premium feature may not meet the platform's language promise; the choice changes staffing, provider capability and cost.
- **Required decision:** Choose the Live language operating model (§4.4) — **business owner's decision; not made here**.
- **Category:** Product (+ Operations). **Approver:** Business owner; Localization lead and Live operations lead consulted.
- **Blocks:** Planning (staffing/cost), Development (P8c interaction/provider design), Launch.
- **Acceptance:** Recorded decision with evidence in §4.4; capability requirement added to the Live provider gate; cost model updated.
- **Docs:** 10 §7/§12/§18, 11 §12, 04 §13.

### FA-05 — Paying Kyrgyz subscribers on legacy Russian fallback *(High, Group B)*
- **Source:** 02 §5.3; 08 P8b prerequisites; 11.
- **Problem:** Paid sale is not conditioned on G-ky.
- **Why it matters:** Contradicts the language promise at the moment money changes hands.
- **Required decision (A-02):** Require G-ky for sold levels in `ky`, or restrict sale to released combinations.
- **Category:** Product/Legal. **Approver:** Business owner; Localization lead.
- **Blocks:** Launch in `ky`.
- **Acceptance:** Rule recorded; sale gating implemented as data (release matrix) and tested.
- **Docs:** 02 §5.3, 08 P8b, 11 §3.2, 04 §7.3.

### FA-06 — P9 "independent" of P8b but uses P8b artefacts *(High, Group A)*
- **Source:** 01 §7; 08 §2 note; 09 §2, §9; 08 P9; 07 §8; 11 §14.
- **Problem:** Shared `payments` module, outbox and job runner are introduced in P8b yet P9 is declared independent.
- **Why it matters:** Mis-sequenced work; Marketplace scheduled without its payment/async base.
- **Required decision (A-14):** Where the shared payments/outbox/job runner step lives and what P9 depends on.
- **Category:** Technical. **Approver:** Technical lead; Program manager.
- **Blocks:** Planning.
- **Acceptance:** Dependency stated identically in 01 §7, 08 §2, 09 §2, 11 §14; graph in §7 of this plan accepted.
- **Docs:** 01 §7, 08 §2/P8b/P9, 09 §2/§18, 07 §8, 11 §14.

### FA-07 — Stale and inconsistent roadmap gates *(High, Group A)*
- **Source:** 08 G0 Prerequisites/Acceptance/§6; 01 §7 G0 row.
- **Problem:** G0 text covers items 1–9 and docs 01–09; Revision-3 decisions are outside it.
- **Why it matters:** The gate is what teams execute.
- **Required decision (G-01):** Adopt the G0 acceptance checklist in §8 of this plan as the gate definition.
- **Category:** Business/Technical (program governance). **Approver:** Program manager with Business owner.
- **Blocks:** Planning.
- **Acceptance:** G0 text in 08 and 01 matches §8; DoD references docs 01–11.
- **Docs:** 08 G0/§6, 01 §7.

### FA-08 — Incomplete subscription/invoice/payment state models *(High, Group A)*
- **Source:** 11 §4–§6, §15.2.
- **Problem:** Only the subscription machine is drawn; invoice/payment transitions, invariants, timeouts, async payments, `expired` ambiguity, manual-renewal anchoring, partial-refund effects are missing.
- **Why it matters:** The test requirement cannot be written; double-charge/lost-access/leakage bugs.
- **Required decision (A-04):** Approve transition tables and invariants (≤ 1 non-terminal subscription per account; upgrade on same vs new instance; timeouts as plan-version config).
- **Category:** Technical (+ Product). **Approver:** Technical lead; Product owner for policies.
- **Blocks:** Development (P8b).
- **Acceptance:** State × event tables for subscription, invoice, payment reviewed and approved; invariants listed; test plan derived from them.
- **Docs:** 11 §4–§6/§15.2/§16.

### FA-09 — Entitlement service failure modes and ownership *(High, Group A)*
- **Source:** 11 §8, §13, §14; 10 §6; 07 §8.
- **Problem:** No stated read model, fail-closed/open policy, webhook-lag handling, revocation of tokens/offline leases, TTLs; no module owns paid-content delivery or the tutor proxy.
- **Why it matters:** Lock-outs at session start; abuse after reversals.
- **Required decision (A-03):** Specify the entitlement read model and failure policy and assign owning modules.
- **Category:** Technical/Security. **Approver:** Technical lead; Security lead.
- **Blocks:** Development (P8b/P8c).
- **Acceptance:** Approved spec incl. "never call payment provider at join", failure policy, TTLs, revocation path; modules named in 07 §8/11 §14.
- **Docs:** 11 §8/§13/§14, 10 §6, 07 §8.

### FA-10 — No server-side operational readiness *(High, Group B)*
- **Source:** 07 §8; 10 §16; 11 §6.5; 08.
- **Problem:** No backup/restore, DR, RPO/RTO, availability objectives, alerting, on-call, runbooks, incident communication, release/rollback, secrets rotation, join-surge capacity.
- **Why it matters:** A paid, scheduled live service is an operated service.
- **Required decision (A-05):** Operations baseline and targets (values are business decisions informed by evidence).
- **Category:** Operations. **Approver:** Operations lead; Technical lead; Business owner for targets.
- **Blocks:** Launch (and production use of P8).
- **Acceptance:** Approved operations baseline; restore tested in staging; alerting and on-call model documented; added to P8/P8b/P8c acceptance.
- **Docs:** 07 §8, 08 P8/P8b/P8c, 10 §16.

### FA-11 — Data-protection and legal deliverables *(High, Group B)*
- **Source:** 09 §11; 11 §13; 10 §11/§13; 05 §10.
- **Problem:** No applicable regime identified, no processing inventory, breach process, controller/processor roles for accounts/billing/Live/AI, no Terms/Privacy/auto-renewal disclosures, minors undecided.
- **Why it matters:** No legal basis to collect identity, payment, chat or attendance data.
- **Required decision (A-06, Q11):** Identify regimes with counsel and approve the data-protection basis and required legal documents per phase.
- **Category:** Legal. **Approver:** Legal counsel; Data-protection responsible role; Business owner.
- **Blocks:** Launch (and the launch of any account feature).
- **Acceptance:** Counsel-signed list of regimes and documents; processing inventory; breach process; age policy; notices published before collection.
- **Docs:** 05 §10, 09 §11/§1.1 D8, 10 §11/§13, 11 §13, 01 §9.

### FA-12 — Missing security controls *(High, Group A)*
- **Source:** 11 §13; 07 §8; 10 §6/§11.
- **Problem:** Entitlement-snapshot signing keys, MFA for `live_host`/`live_moderator`, learner account-takeover protections, rate limits for subscription/join/tutor/webhook endpoints are unspecified.
- **Why it matters:** Host hijack hijacks a mass session; account takeover steals paid access.
- **Required decision (A-07):** Approve a security requirements table for these items.
- **Category:** Security. **Approver:** Security lead; Technical lead.
- **Blocks:** Development (design of P8b/P8c), Launch.
- **Acceptance:** Table approved; tests defined (key rotation, MFA enforcement, rate-limit tests).
- **Docs:** 07 §8/§10, 10 §6/§11, 11 §13.

### FA-13 — Sync design inconsistent; sync before id stability *(High, Group C)*
- **Source:** 05 §9 vs §2/§3; 07 §8; 08 P8 prerequisites; 04 §9.
- **Problem:** Merge of results/recomputed mastery contradicts durable-state mastery; sync could start before P3 stabilises ids.
- **Why it matters:** Corrupt cross-device progress.
- **Required decision (A-08):** Per-record conflict rules and ordering vs P3. **Postponable** because first commercial launch needs accounts, not progress sync — but **no sync build may start until closed**.
- **Category:** Technical. **Approver:** Technical lead.
- **Blocks:** Development of sync only; otherwise None.
- **Acceptance:** Conflict rules per record type; P8 sync depends on P3 id mapping or server-side id versioning.
- **Docs:** 05 §9, 07 §8, 08 P8.

### FA-14 — Roadmap implementability unproven *(High, Group A)*
- **Source:** 08 §3, §7; P8b/P8c scope.
- **Problem:** No engineering capacity model; P8b/P8c under-sized; 15 phases without team assumptions.
- **Why it matters:** Dates and cost cannot be committed.
- **Required decision (A-10):** Team-size assumptions and re-sizing method; approved critical path.
- **Category:** Business/Operations. **Approver:** Program manager; Technical lead; Business owner.
- **Blocks:** Planning.
- **Acceptance:** Per-phase estimate ranges with stated team assumptions and a critical path including content gates; P8b/P8c re-sized after FA-08/09/10/15.
- **Docs:** 08 §3/§7.

### FA-15 — P8b omits supporting systems *(Medium, Group A)*
- **Source:** 08 P8b; 11 §5.3/§6.4/§13; 07 §8; 01 §4.5.
- **Problem:** Notification delivery, back-office/support tooling, invoices/receipts/tax, finance/support roles are unscoped.
- **Why it matters:** The documented lifecycle cannot operate.
- **Required decision (A-11):** In/out of P8b scope and operational workaround if deferred.
- **Category:** Product/Operations. **Approver:** Product owner; Operations lead.
- **Blocks:** Development (P8b scope), Launch.
- **Acceptance:** Scope list with owners; roles added; workaround documented for anything deferred.
- **Docs:** 08 P8b, 07 §8/§9, 01 §4.5, 11 §5.3/§6.4.

### FA-16 — Interface inventory incomplete *(Medium, Group A)*
- **Source:** 01 §4.3 vs 03 §2, 10 §8, 11 §14.
- **Problem:** Missing `LanguagePackPort`, `RealtimeChannel`, `EntitlementPort`, `BillingReadPort`, `PaymentsPort`, `ClassroomProviderPort`, `IdentityPort`; wrong consumer lists; frontend/backend mixed.
- **Why it matters:** The CI boundary policy cannot validate what is not listed; P2 promotes the rules to errors.
- **Required decision (G-02):** Adopt a generated contract inventory (frontend and backend separate).
- **Category:** Technical. **Approver:** Technical lead.
- **Blocks:** Development (P2).
- **Acceptance:** Inventory generated from `shared/contracts`; 01 §4.3 references it; policy test passes.
- **Docs:** 01 §4.3, 07 §6.

### FA-17 — Marketplace document stale/contradictory *(Medium, Group A)*
- **Source:** 09 §6, §3, §12.3, §18, §9.1, §1.
- **Problem:** Removed recommendation port referenced; ledger-as-truth vs conditional ledger; `payment_authorized` label; prerequisites vs 08; duplicate numbering.
- **Why it matters:** Wrong implementation if followed literally.
- **Required decision (G-03):** Approve the corrected model as the single statement of Marketplace entry conditions and money records.
- **Category:** Technical/Business. **Approver:** Technical lead; Business owner.
- **Blocks:** Planning (baseline integrity).
- **Acceptance:** 09 consistent with 01 §4.2, 08 P9, 09 §12.2.
- **Docs:** 09, 08 P9.

### FA-18 — Undefined boundary of the no-recording rule *(Medium, Group A)*
- **Source:** 10 §9; 09 §4.1 `introVideoRef`, §5.1 V6; 03 §3.1; 04 §13.5.
- **Problem:** Course audio, applicant/teacher intro video, materials and transient captions not classified.
- **Why it matters:** Absolute rule without scope risks accidental violation or over-blocking.
- **Required decision (A-09):** Define "recording" (capture of a live session: video, audio, screen, transcript) and list permitted non-session media; decide transient captions.
- **Category:** Product/Legal. **Approver:** Business owner; Legal counsel; Security lead.
- **Blocks:** Development (P8c design, Marketplace profile media).
- **Acceptance:** Definition and media allow-list approved; static CI rule and upload allow-list updated accordingly.
- **Docs:** 10 §9, 09 §4/§5.1, 03 §3.1, 04 §13.5, 01 §5.

### FA-19 — Live accessibility and mass-UI *(Medium, Group B)*
- **Source:** 10 (none), 06, 10 §9.1.
- **Problem:** No captions/transcript, keyboard/screen-reader or mobile layout requirements for Live.
- **Why it matters:** Exclusion of deaf/hard-of-hearing and assistive-technology users.
- **Required decision:** Accessibility conformance target for Live (depends on A-09).
- **Category:** Product. **Approver:** Product owner; Accessibility reviewer role.
- **Blocks:** Launch (of Live).
- **Acceptance:** Requirements added; manual and automated checks defined; captions policy resolved.
- **Docs:** 10, 06.

### FA-20 — Live join reliability vs token controls *(Medium, Group A)*
- **Source:** 10 §6.3; 11 §8.
- **Problem:** Single-use tokens/eviction vs mobile reconnects; start-of-session surge.
- **Why it matters:** Legitimate users locked out.
- **Required decision (A-12):** Reconnect semantics, eviction hysteresis, surge capacity.
- **Category:** Technical. **Approver:** Technical lead; Security lead.
- **Blocks:** Development (P8c-2).
- **Acceptance:** Semantics specified and tested.
- **Docs:** 10 §6, 11 §8.

### FA-21 — Third-party UI outside locale guarantees *(Medium, Group B)*
- **Source:** 02 §7; 07 §9; 11 §7.
- **Problem:** Hosted checkout/video SDK language support unknown; no provider criterion.
- **Why it matters:** The locale promise cannot be guaranteed on those screens.
- **Required decision (A-13):** Add UI-locale (`ky`, `ru`) support as a provider-selection criterion; document exceptions.
- **Category:** Localization. **Approver:** Localization lead; Technical lead.
- **Blocks:** Launch (provider selection).
- **Acceptance:** Criterion in capability lists; provider evidence of language support.
- **Docs:** 07 §9, 02 §7, 11 §7, 10 §7.

### FA-22 — FINAL review overstates consistency *(Medium, Group A)*
- **Source:** FINAL_ARCHITECTURE_REVIEW §0/§3/§7.
- **Problem:** Declares "internally consistent" despite FA-06/07/13/17/18.
- **Why it matters:** False assurance.
- **Required decision (G-04):** Treat that verdict as superseded; correct after fixes.
- **Category:** Business/Technical (governance). **Approver:** Program manager.
- **Blocks:** Planning.
- **Acceptance:** Superseded note present; verdict re-issued after corrections.
- **Docs:** FINAL review, changelog.

### FA-23 — Hidden U-13 dependency *(Medium, Group C)*
- **Source:** 09 §1.2; 11 U-13; 06 §4.1.
- **Problem:** "Booking independent of subscriptions" assumes an account model decided by U-01/U-02.
- **Why it matters:** Hidden coupling.
- **Required decision:** Record U-13 jointly with U-01/U-02. **Postponable** until the Marketplace is scheduled.
- **Category:** Business. **Approver:** Business owner.
- **Blocks:** None (before P9).
- **Acceptance:** Joint decision recorded.
- **Docs:** 09 §1.2, 11 §16.

### FA-24 — Stale nav open item *(Low, Group C)*
- **Source:** 06 §10. **Problem:** Open item contradicts 06 §4.1. **Why:** confusion. **Decision (G-05):** batch tidy. **Category:** Product. **Approver:** Product owner. **Blocks:** None. **Acceptance:** text aligned. **Docs:** 06.

### FA-25 — Structural/naming leftovers *(Low, Group C)*
- **Source:** 03 §11, 01 §4.3, 04, 02, 01 §9. **Problem:** "in-memory repository", "ui-host", section numbering, ordering. **Why:** readability. **Decision (G-05).** **Category:** Technical. **Approver:** Technical lead. **Blocks:** None. **Acceptance:** tidied. **Docs:** 03, 01, 04, 02.

### FA-26 — Weak citation *(Low, Group C)*
- **Source:** 10 §12 → 01 §0.2. **Problem:** requirement is in 01 §1.1. **Why:** traceability. **Decision (G-05).** **Category:** Technical. **Approver:** Technical lead. **Blocks:** None. **Acceptance:** citation corrected. **Docs:** 10.

### FA-27 — "ledger" used for two concepts *(Low, Group C)*
- **Source:** 05 vs 09. **Problem:** credit ledger vs financial ledger. **Why:** misreading. **Decision (G-05):** rename one. **Category:** Technical. **Approver:** Technical lead. **Blocks:** None. **Acceptance:** distinct terms. **Docs:** 05, 09.

### FA-28 — `expired` reused for two meanings *(Low, Group A)*
- **Source:** 11 §5.1. **Problem:** never-activated vs lapsed. **Why:** reporting/test ambiguity. **Required decision:** resolved inside A-04 (split or document). **Category:** Technical. **Approver:** Technical lead. **Blocks:** Development (P8b) via FA-08. **Acceptance:** closed with FA-08 tables. **Docs:** 11 §5.1.

### FA-29 — Nav shows Live regardless of L-09 *(Low, Group C)*
- **Source:** 06 §4.1. **Problem:** default assumes visibility. **Why:** pre-empts L-09. **Required decision:** state as a flag-dependent default; real decision is L-09 (Group B). **Category:** Product. **Approver:** Product owner. **Blocks:** None. **Acceptance:** text flag-dependent. **Docs:** 06.

### FA-30 — Changelog historical text *(Low, Group C)*
- **Source:** ARCHITECTURE_CHANGELOG Revision 2. **Problem:** "outbox from P9b", file lists superseded. **Why:** misleading history. **Decision (G-05):** add "superseded by" notes (do not rewrite history). **Category:** Technical. **Approver:** Program manager. **Blocks:** None. **Acceptance:** notes added. **Docs:** changelog.

---

## 3. Group validation across all 30 findings

| Group | Findings | Validation note |
|---|---|---|
| **A — before implementation** | FA-01, 02, 03, 04, 06, 07, 08, 09, 12, 14, 15, 16, 17, 18, 20, 22, 28 (17) | Each changes what is built or whether the baseline can be trusted. FA-07/16/17/22 are *governance/documentation* decisions that are cheap but gate planning. |
| **B — before commercial launch** | FA-05, 10, 11, 19, 21 (5) | Do not change first builds; money/real users cannot be exposed without them. |
| **C — postponable** | FA-13, 23, 24, 25, 26, 27, 29, 30 (8) | FA-13 is postponable **only because sync is not in the first commercial release**; if sync is added earlier it moves to A. |

Examples from the brief, checked against the findings: *Advanced synchronization* → C (FA-13); *additional course levels/languages* → C (they are content releases through gates, not decisions blocking launch, **but A-01 must define what is sold**); *advanced Marketplace* → C (D1–D9, Q8/Q9/Q17); *annual subscriptions, advanced analytics* → C (11 §17; analytics not in any finding). Examples **not** exhaustive: findings added to A beyond the brief — FA-06, FA-07, FA-16, FA-17, FA-22 (baseline integrity) and FA-18, FA-20 (Live design).

**Conditional reclassification.** If Premium Live is *excluded* from the first commercial launch, the Live decisions L-02, L-03, L-05–L-07, L-09 and FA-05/FA-19/FA-21 move from B to C, while L-01/L-04/L-10 stay A only if Live is planned for the first year. This is itself a decision for the business owner (A-01).

---

## 4. The four critical findings in depth

### 4.1 Critical 1 — AI Tutor (FA-01, U-20)

**Cost structure (no prices invented).** For a model-backed tutor: `monthly AI cost ≈ Σ over active tutor users of (requests per user × cost per request)`, where cost per request = (input units × input unit price) + (output units × output unit price) + any retrieval/moderation costs. **Unit prices: UNKNOWN. Requests per user: UNKNOWN. Tokens per request: UNKNOWN (measurable in a pilot).** A hard limit `L` per account per window caps per-account cost at `L × c` (11 §11.3). Fixed/semi-fixed costs: prompt/knowledge-base authoring and review in two explanation locales, evaluation, safety/moderation, monitoring, data-protection work. Cost for the rule-based assistant: engineering and content only; no per-request cost.

| Option | What it is | Advantages | Disadvantages / risks | Cost structure | Evidence needed |
|---|---|---|---|---|---|
| **1. Full LLM tutor** | Model-backed tutor for all Basic users | Matches the promise most closely; scalable personalisation | Largest cost and unpredictability; hallucination/quality risk in grammar teaching; privacy (learner text to a third party, possibly minors); must work in Kyrgyz, whose model quality is unverified **[A]**; needs a new phase | Variable per request × users; fixed safety/evaluation | Provider quote; measured tokens/request; Kyrgyz and Russian quality evaluation; data-protection assessment |
| **2. Limited AI Tutor MVP with strict quotas** | Model-backed, hard daily/monthly caps, degrade to rule-based at cap (11 §11) | Bounded cost per account; honest "AI" claim; learns real usage | Still needs provider, privacy and quality work; quotas may feel stingy; metering/proxy build; same language-quality risk | Variable bounded by `L × c`; fixed as above | Same as option 1 plus pilot usage distribution |
| **3. Rule-based assistant, clearly disclosed** | Existing mock evolved (sessions, per-locale knowledge base) and **named honestly** | No marginal cost; ships with the roadmap; no new privacy exposure; keeps "demo/limitation" honesty | Not "AI" in the usual sense; weaker perceived value; plan copy must change | Engineering + content (language-pack work already planned, 03 §8.1) | Legal review of wording; user test of usefulness |

**Recommendation:** **Option 3 for first commercial launch, with Option 2 as the planned next increment gated by evidence** (a pilot with strict quotas, measured cost and language-quality results). Option 1 is **not recommended** before measured data exists. Rationale: it is the only option compatible with the current roadmap and honest marketing without new unknowns; it removes metering from P8b scope (smaller, safer); it preserves the ability to add a model later behind the existing `TutorService` seam. If the business owner insists on "AI" at launch, choose Option 2 and add a dedicated phase **before** P8b launch.
**Evidence required to close:** owner decision + Legal-approved wording; for Option 2/1 additionally provider ADR, cost per interaction from a pilot, Kyrgyz/Russian quality evaluation, data-protection assessment, updated roadmap.

### 4.2 Critical 2 — Course access promises (FA-02, A-01)

| Option | Advantages | Disadvantages / risks |
|---|---|---|
| **1. Launch paid with A1 only, disclose available levels** | Earliest revenue and learning; simplest honest message | Value perceived low at 99 KGS for one level; risk of churn; German-only if English not ready; Kyrgyz may lag Russian (G-ky) |
| **2. Delay paid launch until A1–B2 are ready** | Promise matches reality | Estimated content effort is large (≈ 330–1,600 person-days depending on depth **[A]**, plus Live materials); long period without revenue or user evidence; high schedule risk |
| **3. Release levels progressively with transparent availability** | Matches the architecture (per-level/per-locale release gates); data-driven plan copy; revenue and feedback early; no false promise | Needs a clear availability UI; pricing expectations to be managed as content arrives; operational discipline on the release matrix |

**Recommendation (safest product and commercial approach): Option 3, with a minimum paid-launch gate.** Plan copy must be generated from the release matrix (what is available *per language and locale*), never from the marketing description "A1–B2". Paid sale in a locale only for levels that passed their gate (FA-05). The **minimum gate itself is the business owner's decision** (e.g. which courses/levels/locales must exist); the architecture already supports it. Option 2 is not recommended unless the business decides that nothing below A1–B2 can be sold; Option 1 is a special case of Option 3.
**Evidence required to close:** approved availability policy; minimum-gate definition; Legal-approved plan wording; confirmation that G-ky/G-ru status feeds sale gating; content-capacity evidence from the throughput pilot (04 §13.6).

### 4.3 Critical 3 — Unit economics validation (FA-03, U-16)

**Revenue (arithmetic on approved prices only).** Gross monthly billings = `B × 99 + P × 149` KGS (not net: before tax, fees, refunds, churn). Premium Live adds **50 KGS** gross per Premium Live subscriber over Basic.

| Subscribers (N) | 0 % Premium Live | 10 % | 30 % | 50 % | 100 % |
|---|---|---|---|---|---|
| **500** | 49,500 | 52,000 | 57,000 | 62,000 | 74,500 |
| **1,000** | 99,000 | 104,000 | 114,000 | 124,000 | 149,000 |
| **3,000** | 297,000 | 312,000 | 342,000 | 372,000 | 447,000 |
| **5,000** | 495,000 | 520,000 | 570,000 | 620,000 | 745,000 |
| **10,000** | 990,000 | 1,040,000 | 1,140,000 | 1,240,000 | 1,490,000 |

*(KGS per month; mixes are examples, not forecasts; subscriber counts are *paying* subscribers.)*

**Cost model — structure and inputs (all prices UNKNOWN).**

| Cost category | Formula (monthly) | Inputs | Status of inputs |
|---|---|---|---|
| AI usage | `A_users × req/user × cost/req` (capped by `L × c × A_users`) | active tutor users, requests, tokens/units, unit prices | **UNKNOWN** (pilot + quote); depends on U-20 |
| Live teachers | `Live hours × host staffing cost + moderators × hours × cost + prep/materials hours × cost` | ≈ 8–9 broadcast hours/month (two 60-min sessions weekly: arithmetic), moderator ratio, rates | hours known; **rates and ratios UNKNOWN** |
| Live streaming | `Premium subs × attendance a × hours/month × cost/participant-hour` | attendance, hours attended, provider price | **UNKNOWN**; ceiling `< 50 ÷ h` KGS per participant-hour if funded only by the uplift (11 §12.5) |
| Hosting/infrastructure | fixed base + variable (storage, bandwidth, realtime) | provider quotes, region (Q6) | **UNKNOWN** |
| Payment processing | `transactions × (fixed fee + % × price)`; extra for retries/refunds | fee schedule, KGS support, renewal mode | **UNKNOWN**; fixed fee share = `fixed ÷ 99` and `÷ 149` |
| Content production (one-off, amortised) | `person-days × day rate ÷ amortisation months` | 04 §13 person-days **[A]** | days estimated [A]; **rates UNKNOWN** |
| Live materials localisation | weekly translation/review effort × rates | words/week, rates | **UNKNOWN** (not in 04 §13) |
| Support | `tickets/sub × cost/ticket × subs` | ticket rate, cost | **UNKNOWN** |
| Marketing/acquisition | `new subs × CAC` | CAC, churn | **UNKNOWN** |
| Tax/legal/compliance | per jurisdiction | structure (U-03) | **UNKNOWN** |
| Refunds/chargebacks/involuntary churn | policy × volume | U-07–U-09, provider | **UNKNOWN** |
| FX exposure | costs in other currencies × rate | invoice currencies | **UNKNOWN [A]** |

**Break-even condition.** `contribution = N × (ARPU − v)`, `ARPU = 99 + 50·p`, where `v` = variable cost per subscriber (payments + AI + streaming share + infra + support). Fixed costs `F` = Live hosts' fixed hours, content investment, base infrastructure, team. **Viable only if `N × (ARPU − v) ≥ F` for the achievable N** — no value of `v` or `F` is known, so **no profitability claim is made**.

**Scenario grid to be filled by evidence.** For each N ∈ {500, 1,000, 3,000, 5,000, 10,000} and each Premium mix ∈ {0, 10, 30, 50, 100 %}: compute `v_B` (Basic), `v_P` (Premium), `F`, contribution, margin; plus a **downside case** (e.g. attendance, AI usage and payment failure higher than base) and an **upside case**. Add a **churn/retention assumption** and CAC to convert from monthly contribution to payback. Mark each input's source (quote / pilot / assumption).

**Evidence required to pass G0 economics validation (all must be true):**
1. **Quotes:** written vendor quotes (or published rate cards) for payment processing in KGS, Live streaming at the planned audience size, hosting, and AI usage if a model is chosen — sourced, dated, with currency.
2. **Measured inputs:** pilot-measured AI cost per interaction (if applicable), expected attendance and hours per Premium subscriber, teacher/moderator hours and rates, support effort per subscriber.
3. **Content cost:** throughput-pilot results replacing the 04 §13 productivity assumptions; Live weekly materials effort estimated.
4. **Model completeness:** every cost category above has a number or an explicit, approved exclusion; FX and tax treatment stated.
5. **Thresholds approved** by the business owner *before* seeing results (minimum margin, maximum cost per participant-hour, maximum payback period) — these are decisions, not facts.
6. **Scenarios:** the 25-cell grid plus downside/upside; break-even N and sensitivity to the top three unknowns.
7. **Independent review** of the model by a role not involved in building it (Finance/business analyst).
8. **Decision outcome recorded:** go / adjust prices or scope / no-go.
**G0 fails** if any input is an unsourced assumption presented as fact.

### 4.4 Critical 4 — BilUp Live language policy (FA-04, L-01) — *comparison only; the decision belongs to the business owner*

| Criterion | 1. Kyrgyz-only lessons | 2. Russian-only lessons | 3. Alternating language schedules | 4. Bilingual teaching | 5. Common target-language lesson (DE/EN) + separately localized written materials |
|---|---|---|---|---|---|
| **Accessibility for ky learners** | Full | Poor for ky-only comprehension | Full on ky weeks only | Partial–good (depends on teacher fluency/time split) | Depends on learner level: A1–A2 learners may not follow immersion; written materials in ky help |
| **Accessibility for ru learners** | Poor | Full | Full on ru weeks only | Partial–good | Same caveat; materials in ru |
| **Consistency with "complete Kyrgyz *or* Russian"** | Meets for ky only | Meets for ru only | Neither is complete each week | Approximates both, but spoken time is shared | Spoken language is not an explanation language; written explanation is complete in either |
| **Teacher availability** | Requires a teacher fluent in Kyrgyz *and* qualified in DE/EN teaching **[A]** | Requires Russian-fluent teacher | Requires both (or two teachers) | Requires a rarely-found combination, or a pair | Requires a DE/EN teacher only; localisation by translators |
| **Student experience** | Strong for ky half; excludes ru half | Strong for ru half; excludes ky half | Predictable but half the weeks mismatch | Smoother if well-run; slower pacing | Immersive; wide level range (A1–B2) in one stream is hard to pitch |
| **Operational cost drivers** | One host rate; split audience risks demand | One host rate; split audience risks demand | Two language capabilities, scheduling complexity | Higher host rate or two hosts per session | One host + weekly translation/review in two locales (extra recurring cost, not in 04 §13) |
| **Fit with the platform's language model** | Violates ru users' promise | Violates ky users' promise | Violates both on alternate weeks | Closest to both | Fits `explanationLocale` for written material; spoken language is target language |
| **Fit with provider/UX** | Single channel | Single channel | Single channel; schedule UI | Single channel | Single channel; optionally language chat channels/breakouts (provider capability) |
| **Main risk** | Alienates half the market | Alienates half the market | Confusing; weak commitment | Quality depends on a rare skill | A1 comprehension; translation workload |

Hybrid variants the owner may consider: co-host per locale; locale-specific Q&A channels/breakouts (needs provider capability); separate ky and ru sessions (violates "one session per language", 10 §3 — would change the approved Live rules).
**No recommendation on the final choice.** **Evidence needed to decide:** distribution of ky vs ru paying/target learners; level distribution (A1–A2 vs B1–B2); availability and rates of candidate hosts per option; provider capability for language channels (L-03); a rehearsal session with a small audience measuring comprehension and satisfaction; effect on the cost model (§4.3); the weekly materials translation workload (L-04).
**Evidence required to close:** recorded owner decision citing the above; updates to the provider capability gate and cost model; staffing plan.

---

## 5. Cost of unknowns that gate G0 (what must be collected)
*(Evidence the plan needs from outside the documents.)* Provider quotes (payments in KGS, streaming, hosting, AI if applicable); legal advice on entity/tax/consumer-law/data-protection; native Kyrgyz reviewers and translators (named, available); Live host/moderator candidates and rates; throughput pilot results; market data on ky/ru learner split; a decision on first-launch scope.

---

## 6. Decision register (all OPEN)

Columns: **ID · Question · Options · Recommendation (if appropriate) · Owner role · Depends on · Evidence · Deadline (relative to G0) · Status.** Group in brackets. "—" = no recommendation appropriate (business choice) or none stated. Every status is **OPEN**.

### 6.1 Global questions (Q)
| ID | Question | Options | Rec. | Owner role | Depends on | Evidence | Deadline | Status |
|---|---|---|---|---|---|---|---|---|
| Q1 [A] | Keep or retire the dormant `de` UI locale | keep dormant / retire / activate later | keep dormant (docs' proposal) | Product owner | — | analytics-free: product preference | at G0 sign-off | OPEN |
| Q2 [A] | Who authors/reviews Kyrgyz content | hire/contract named translator + 2 reviewers / partner agency / reduce scope | — | Localization lead + Business owner | Q15, glossary | named, available native people; rates | at G0 sign-off | OPEN |
| Q3 [A] | English scope and authorship incl. language pack | internal authors / contractors / defer English | — | Curriculum lead + Business owner | Q15 | named authors; syllabus source | at G0 sign-off | OPEN |
| Q4 [C] | Course variants per language | single `*-general` / add exam/business | single initially (docs' default) | Product owner | Q15 | demand evidence | after first launch | OPEN |
| Q5 [C] | Sync before/after accounts | local-first, sync later / sync with accounts | sync later | Technical lead | A-08 | none | before any sync build | OPEN |
| Q6 [A] | Backend runtime and hosting direction | TypeScript/Node + Postgres (docs' proposal) / other stack / managed BaaS | — | Technical lead + Business owner | Q11, A-06, U-16 | hosting quotes; team skills; data-location constraints | at G0 sign-off (direction); contract before P8 | OPEN |
| Q7 [B] | Target markets, currencies, provider availability | KG-only / KG+RU / +EU | — | Business owner + Legal counsel | U-03 | provider capability and legal advice | before S-D | OPEN |
| Q8 [C] | Marketplace commission/payout/refund/tax | see D4/D5 | — | Business owner + Legal | Q7 | legal/provider | before P9d | OPEN |
| Q9 [C] | Teacher verification depth/liability | per 09 §5.1 proposals | — | Legal counsel + Operations lead | Q11 | legal advice | before P9d | OPEN |
| Q10 [C] | Marketplace video provider (recording prohibited; Live = L-03) | candidates TBD | — | Technical lead | Q7 | capability matrix | before P9c | OPEN |
| Q11 [B] | Are minors users; age gating; guardian consent | adults only / allow with guardian consent | — | Legal counsel + Business owner | A-06 | legal advice | before any account launch | OPEN |
| Q12 [A] | Brand name in UI/manifest | "BilUp Til" / "BilUp Deutsch" | "BilUp Til" (docs' proposal) | Business owner | — | none | before P0b release | OPEN |
| Q13 [C] | PWA offline scope | shell only / downloadable packs | shell first | Product owner | U-17 | none | before P6 | OPEN |
| Q14 [B] | Real-device test matrix and lab | own lab / cloud devices / manual | — | QA/Operations lead | — | device list | before P5 acceptance | OPEN |
| Q15 [A] | Minimum launch scope and level depth | MLS-1 only / MLS-1+2 / deeper A1 | — | Business owner + Curriculum lead | A-01, pilot | throughput pilot; capacity | at G0 sign-off | OPEN |
| Q16 [A] | Quality-gate thresholds (G-ru/G-ky) | docs' proposal (≥20 % sample, 0 critical, ≤2 % minor) / stricter | — | Localization lead + Curriculum lead | Q2 | reviewer input | at G0 sign-off | OPEN |
| Q17 [C] | Marketplace payment model | see D2/D3/D5 | — | Legal counsel + Business owner | Q7 | provider/legal | before P9d | OPEN |

### 6.2 Subscription decisions (U)
| ID | Question | Options | Rec. | Owner role | Depends on | Evidence | Deadline | Status |
|---|---|---|---|---|---|---|---|---|
| U-01 [A] | Entitlements without a subscription | none / free tier / trial / preview | — | Business owner | U-16, A-01 | conversion and cost evidence | at G0 sign-off | OPEN |
| U-02 [A] | Existing free MVP users | grandfather / free tier / sunset / migrate with notice | — | Business owner + Legal | U-01 | user base size | at G0 sign-off | OPEN |
| U-03 [B] | Provider(s) for KGS, legal entity, tax, consumer law | TBD | — | Business owner + Legal + Finance | Q7 | quotes, legal advice | before S-D | OPEN |
| U-04 [B] | Renewal mode | automatic / manual / both | both supported; availability depends on provider | Product owner | U-03 | provider capability | before S-D | OPEN |
| U-05 [B] | Retry schedule, grace, Live during grace | values TBD; Live in/out | — | Business owner | U-04 | churn data | before S-D | OPEN |
| U-06 [B] | AI fair-use values; Premium higher than Basic? | per U-20 | — | Product owner + Finance | U-20, §4.1 | pilot usage/cost | before S-D | OPEN |
| U-07 [B] | Upgrade billing | options A–D (11 §6.1) | — | Business owner + Finance | U-03 | — | before S-D | OPEN |
| U-08 [B] | Downgrade timing | period end / immediate with refund | period end (docs' default) | Business owner | U-09 | legal | before S-D | OPEN |
| U-09 [B] | Cancellation and refund policy | cooling-off, partial, immediate | — | Business owner + Legal | U-03 | consumer-law advice | before S-D | OPEN |
| U-10 [B] | Compensation for cancelled Live sessions | substitute / credit / extension / none | — | Business owner | L-02 | — | before L-D | OPEN |
| U-11 [B] | Live materials after downgrade | keep / remove | — | Business owner | — | — | before L-D | OPEN |
| U-12 [B] | Attendance history after downgrade | keep viewable / hide | keep own data viewable (privacy lean) | Legal + Product owner | A-06 | legal | before L-D | OPEN |
| U-13 [C] | Marketplace booking vs subscription | independent / require account / require plan | independent (docs' default) | Business owner | U-01 | — | before P9 | OPEN |
| U-14 [B] | Retention for expired accounts | periods TBD | — | Legal + Data-protection role | A-06 | legal | before P8b launch | OPEN |
| U-15 [B] | Price-change policy for existing subscribers | grandfather / next renewal with notice / hybrid | — | Business owner + Legal | — | legal notice rules | before S-D | OPEN |
| U-16 [A] | Validated cost model and thresholds | §4.3 | model per §4.3 | Business owner + Finance | quotes, pilots | §4.3 evidence list | at G0 sign-off | OPEN |
| U-17 [C] | Offline entitlement lease length | days TBD | — | Security lead + Product owner | Q13 | — | before paid packs go offline | OPEN |
| U-18 [B] | Account-sharing/device limits | none / soft / hard | — | Business owner | — | abuse data | before P8b launch | OPEN |
| U-19 [B] | Billing timezone for wording/reporting | Asia/Bishkek / other | — | Finance | — | — | before P8b launch | OPEN |
| U-20 [A] | Meaning of "AI Tutor" at launch | §4.1 options 1–3 | Option 3 now, Option 2 next | Business owner + Technical lead + Legal | §4.1 | §4.1 | at G0 sign-off | OPEN |

### 6.3 Live decisions (L; L-11 = U-11, L-12 = Q11, L-14 = U-10)
| ID | Question | Options | Rec. | Owner role | Depends on | Evidence | Deadline | Status |
|---|---|---|---|---|---|---|---|---|
| L-01 [A] | Spoken instruction language | §4.4 options 1–5 | none (business decision) | Business owner | audience data, host availability | §4.4 evidence | at G0 sign-off | OPEN |
| L-02 [B] | Days, times, timezone, windows, DST policy | TBD | — | Product owner | L-01 | audience time-zone data | before L-D | OPEN |
| L-03 [B] | Live provider | candidates passing capability gate | — | Technical lead | L-01, A-13, U-16 | capability proof, quotes | before L-D | OPEN |
| L-04 [A] | Weekly material localization workflow/staffing | in-house / agency | — | Localization lead | L-01, Q2 | effort estimate | at G0 sign-off | OPEN |
| L-05 [B] | Realtime transport | provider channel / own endpoint | decide by load test | Technical lead | L-03 | load test | before P8c-3 | OPEN |
| L-06 [B] | Retention periods; attendance threshold | TBD | — | Legal + Product owner | A-06 | legal | before L-D | OPEN |
| L-07 [B] | Level-band assignment | self-select / derived with consent / mix | self-select first (docs' default) | Product owner | A-06 | — | before P8c-3 | OPEN |
| L-08 [C] | Watermarking | use / not | — | Product owner + Legal | — | — | after pilot | OPEN |
| L-09 [B] | Schedule visibility to Basic/unsubscribed | hidden / teaser | — | Product owner | U-01 | — | before P8c | OPEN |
| L-10 [A] | Host/moderator staffing model and ratios | staff / contractors / mixed; ratios | — | Operations lead + Business owner | L-01 | candidate availability, rates | at G0 sign-off | OPEN |
| L-13 [C] | Live participation XP/badges | none / server-signed XP | none initially | Product owner | — | — | after launch | OPEN |

### 6.4 Marketplace record P9-D (D)
| ID | Question | Owner role | Depends on | Evidence | Deadline | Group | Status |
|---|---|---|---|---|---|---|---|
| D1 | Markets and currencies | Business owner + Legal | Q7 | legal | before P9d | C | OPEN |
| D2 | Payment provider with capability matrix | Technical lead + Legal | U-03 | provider evidence | before P9d | C | OPEN |
| D3 | Legal structure/funds-holding | Legal counsel | D1 | legal advice | before P9d | C | OPEN |
| D4 | Commission, fees display, tax/invoicing | Business owner + Finance | D1 | legal/market | before P9d | C | OPEN |
| D5 | Refund/cancellation/no-show/dispute/payout policy | Business owner + Legal | D3 | legal | before P9d | C | OPEN |
| D6 | Teacher verification policy, background checks, minors | Legal + Operations lead | Q11 | legal | before P9d | C | OPEN |
| D7 | Marketplace video provider | Technical lead | D1 | capability proof | before P9d | C | OPEN |
| D8 | Data-protection basis | Legal + Data-protection role | A-06 | legal | before P9d | C | OPEN |
| D9 | Operational readiness (verification/moderation/support) | Operations lead | D6 | staffing evidence | before P9d | C | OPEN |
*Options for each D item are those listed in 09 §1.1; no recommendation is appropriate before legal/provider facts exist.*

### 6.5 Audit-raised decisions (A) and governance decisions (G)
| ID | Question | Options | Rec. | Owner role | Depends on | Evidence | Deadline | Status |
|---|---|---|---|---|---|---|---|---|
| A-01 [A] | What may be sold/advertised vs released content; minimum paid-launch gate | §4.2 options | Option 3 (progressive, transparent) | Business owner + Legal | Q15, U-01 | release matrix; pilot | at G0 sign-off | OPEN |
| A-02 [B] | Paid sale in Kyrgyz conditional on G-ky | require G-ky / restrict to released combos | restrict to released combos | Business owner + Localization lead | A-01, Q16 | G-ky status | before S-D | OPEN |
| A-03 [A] | Entitlement failure policy, TTLs, revocation, module owners | fail-closed / fail-open; cached read model | specify cached read model, never call provider at join | Technical lead + Security lead | — | design review | before P8b build | OPEN |
| A-04 [A] | Subscription invariants/timeouts/states | per FA-08 | transition tables | Technical lead + Product owner | U-04 | review | before P8b build | OPEN |
| A-05 [B] | Operations baseline | targets and tooling | — | Operations lead + Technical lead | Q6 | restore test; load figures | before first paid release | OPEN |
| A-06 [B] | Data-protection regime, roles, notices, breach process, age gating | per counsel | — | Legal counsel + Data-protection role | Q6, Q11 | legal advice | before any account launch | OPEN |
| A-07 [A] | Security requirements (keys, MFA, takeover, rate limits) | per FA-12 | adopt table | Security lead | A-03 | threat model | before P8b/P8c build | OPEN |
| A-08 [C] | Sync conflict rules and ordering vs P3 | per FA-13 | rules per record type | Technical lead | P3 ids | design review | before any sync build | OPEN |
| A-09 [A] | Definition of "recording"; allowed non-session media; transient captions | per FA-18 | definition = capture of a live session | Business owner + Legal + Security lead | L-03 | legal | before P8c design | OPEN |
| A-10 [A] | Engineering capacity and team assumptions | ranges per phase | — | Program manager + Technical lead | A-03, A-04, A-11 | staffing facts | at G0 sign-off | OPEN |
| A-11 [A] | P8b supporting scope (notifications, back-office, invoices, roles) | in/out | — | Product owner + Operations lead | U-03 | ops workflow | before P8b build | OPEN |
| A-12 [A] | Live reconnect semantics, surge capacity | per FA-20 | specify + test | Technical lead | L-03 | load test | before P8c-2 | OPEN |
| A-13 [B] | Provider UI-locale criterion and exceptions | add criterion | add | Localization lead + Technical lead | Q7 | provider evidence | before provider selection | OPEN |
| A-14 [A] | Placement of shared payments/outbox/job runner; P9 dependency | P8-level step / P8b | make P9 depend on that step | Technical lead + Program manager | — | — | at G0 sign-off | OPEN |
| G-01 [A] | Adopt G0 checklist (§8) as gate definition | adopt / amend | adopt | Program manager + Business owner | — | — | at G0 sign-off | OPEN |
| G-02 [A] | Generated contract inventory | adopt / manual | adopt | Technical lead | — | — | before P2 | OPEN |
| G-03 [A] | Approve corrected Marketplace model as baseline | approve / amend | approve | Technical lead + Business owner | — | — | before baseline sign-off | OPEN |
| G-04 [A] | Supersede FINAL review verdict | supersede / amend | supersede | Program manager | — | — | before baseline sign-off | OPEN |
| G-05 [C] | Batch of low-severity documentation fixes (FA-24–27, 29, 30) | do now / schedule | schedule | Technical lead | — | — | before baseline release | OPEN |

**Counts:** Group A 27 (Q 7, U 4, L 3, A-series 9, G 4); Group B 27 (Q 3, U 14, L 6, A 4); Group C 22 (Q 7, U 2, L 2, D 9, A-08, G-05). Total **76**.
*(A-series Group A: A-01, 03, 04, 07, 09, 10, 11, 12, 14 = 9; Group B: A-02, 05, 06, 13 = 4; Group C: A-08.)*

---

## 7. Implementation dependency map

### 7.1 Which decisions must be closed before each milestone
| Milestone | Decisions that must be closed first | Notes |
|---|---|---|
| **Foundation engineering (P0, P0b, P1)** | **none** (P0b release needs Q12) | Start immediately |
| **Course engine development (P2, P4)** | Q1, G-02, (Q4 default), A-14 for plan consistency | P2 also needs boundary-rule baseline (FA-16) |
| **Localization release (P3 → R1a/R1b)** | Q2, Q15, Q16, glossary, Track K output; for paid sale: A-01, A-02 | G-ky depends on named Kyrgyz people |
| **AI Tutor development** | U-20 (→ §4.1), U-06, A-06 (if model), provider ADR | P4 already excludes a model |
| **PWA release** | Q12 (P0b); Q13, U-17 (P6 offline packs, if paid) | Independent of business model for P0b |
| **BilUp Live launch** | L-01, L-04, L-10, A-09, A-12, A-07, FA-19 requirements, L-02, L-03, L-05–L-07, L-09, A-05, A-06, A-13, U-10–U-12, L-D | Requires P8b first |
| **Marketplace implementation** | A-14, G-03; P9a–c: none of D1–D9 (fakes); **P9d: D1–D9, Q7–Q11, Q17, A-06** | Independent of Live except shared payments module |
| **Commercial subscription launch** | Everything in Group A relevant to P8/P8b **plus** Group B (A-02, A-05, A-06, A-13, U-03–U-12, U-14, U-15, U-18, U-19, Q7, Q11), S-D | S-D = record containing the provider/legal/refund/price-change decisions |

### 7.2 Dependency graph (arrows = "must be decided before")
```
Owners/dates (G-01) ──► everything
Q15 (MLS) ─► Q2/Q3 (staff) ─► Q16 (gates) ─► G-ru/G-ky ─► A-02 ─► paid sale in ky
Q15 ─► A-01 (what is sold) ─► U-01/U-02 (free access) ─► plan copy ─► S-D
U-20 (AI) ─► U-06 (limits) ─► U-16 (economics) ─► price confirmation ─► S-D
L-01 (Live language) ─► L-10 (staff) ─► L-04 (materials) ─► U-16 ─► L-D
L-01 ─► L-03 (provider capability, e.g. language channels) ─► A-13 ─► L-D
Q6 (hosting) ─► A-05 (ops), A-06 (legal basis) ─► P8 launch
A-14 ─► P8b scope ─► P9 dependency
A-03/A-04/A-07/A-11 ─► P8b build ─► P8c build ─► L-D pilot
```

### 7.3 Circular dependencies and sequencing contradictions found
| # | Cycle / contradiction | Why | How to break it |
|---|---|---|---|
| 1 | **U-16 (economics) ↔ U-03/Q7 (provider) ↔ U-01 (free tier) ↔ U-20 (AI)** | Economics needs provider quotes and AI choice; provider selection needs volume forecasts; free-tier choice changes volume | Use **scenario-based quotes** (rate cards at several volumes) and decide U-20 and U-01 as *scenario parameters* first; finalise provider later |
| 2 | **L-01 ↔ L-10 ↔ L-03 ↔ U-16** | Language model decides staffing and provider capability (breakouts); both drive cost; cost may force a different language model | Evaluate 2–3 language options as **cost scenarios** in the model; the owner picks after seeing cost and rehearsal evidence |
| 3 | **Q6 (hosting) ↔ A-06 (data-protection regime)** | Hosting location depends on legal constraints; legal basis depends on where data is processed | Counsel provides constraints first; shortlist hosting that satisfies them |
| 4 | **G0 acceptance needs economics record (FA-03) but economics needs pilot data** produced by Track K/pilot, which itself requires staffing approved at G0 (Q2) | Sequencing contradiction inside G0 | Split G0 into **G0-a** (staffing, scope, pilot start, owners) and **G0-b** (economics, language, AI, launch commitments with pilot evidence) — **proposal; requires G-01 approval** |
| 5 | **08: P8b prerequisites = P3 (packs)** but A-01 may require more released content (P7) before sale | P8b launch could be possible technically yet not commercially | Make A-01's minimum gate a **launch prerequisite of R4b**, independent of P8b build |
| 6 | **R1b (Kyrgyz public) vs R4b (subscriptions)** ordering | P8b could ship before G-ky | A-02 rule |
| 7 | **01/08 "P9 independent of P8b" vs shared payments/outbox from P8b** | FA-06 | A-14 |
| 8 | **P8 sync before P3 ids stable** | FA-13 | A-08 |
| 9 | **Live pilot needs L-D which needs a provider, whose capability needs the language model** | cycle 2 | Provider shortlist by capability; choose after L-01 |

---

## 8. Final G0 acceptance checklist

G0 passes **only** when every row is PASS. "Documentation exists" is **never** sufficient: each row requires the stated evidence. **E** = needs external evidence; **I** = internal approval only.

| # | Condition | Pass criterion | Evidence | Type |
|---|---|---|---|---|
| 1 | Approved **minimum product scope** (Q15) | Signed record of courses × levels × locales and depth D, with capacity confirmed | scope record; throughput-pilot result | I + E (pilot) |
| 2 | Approved **subscription promises** (A-01, U-01, U-02) | Signed availability policy, plan copy approved by Legal, free-access/existing-user decisions | policy; Legal approval | I + E (Legal) |
| 3 | **Entitlement matrix approved** (11 §3.2 as amended by decisions) | Business owner signs matrix incl. U-01, U-11, U-12, L-09 defaults | signed matrix | I |
| 4 | **Validated unit-economics model** (U-16) | All eight criteria in §4.3 met; thresholds approved before results; independent review done | model, quotes, pilot data, review note | **E** |
| 5 | **AI Tutor delivery decision** (U-20) | Option selected; wording approved by Legal; roadmap updated; if model: provider ADR + cost evidence + data-protection assessment | decision record; Legal approval | I + E |
| 6 | **Live language decision** (L-01) | Recorded owner decision; provider capability and cost updated; staffing plan matches | decision record; rehearsal/audience evidence | I + E |
| 7 | **Named staffing roles and capacity assumptions** (Q2, Q3, L-04, L-10, A-10) | Named *roles* filled or contracted (not "TBD"): Kyrgyz translator + two independent reviewers, Russian translator + reviewer, DE/EN author-teachers and reviewers, pedagogical sign-off, curriculum lead, Live hosts/moderators, content engineer; capacity assumptions stated | staffing confirmations/contracts | **E** |
| 8 | **Localization quality gates approved** (Q16) | Thresholds signed; gate script requirements listed; Kyrgyz glossary commissioned and approved by reviewers | gate definition; glossary | I + E (reviewers) |
| 9 | **Critical architecture contradictions resolved** (FA-06, 07, 13 rules, 17, G-01…G-04) | Each corrected in documents and re-checked by an independent reviewer; verdict of FINAL review superseded | corrected docs; reviewer note | I |
| 10 | **Clear technical ownership** (Q6, A-14, G-02, A-03, A-04, A-07, A-11, A-12) | A named technical owner role per module/decision; backend direction decided; shared payments/outbox placement agreed | ownership table | I |
| 11 | **Documented launch dependencies** | Dependency map of §7 accepted; for each commercial-launch item (Group B) an owner role, evidence plan and deadline relative to G0 | accepted map; register entries with owners | I |
| 12 | **External-evidence plan started** | Requests issued for provider quotes, legal advice (entity, tax, consumer law, data protection), reviewer commitments, host candidates | requests/quotes received or dated | **E** |
| 13 | **Owners assigned** to all 76 decisions | Every register row has an owner *role* filled with an accountable person recorded outside this file | assignment record | I |
| 14 | **Engineering capacity model** (FA-14) | Per-phase estimate ranges with team assumptions; critical path | estimate document | I (+ E for team size) |

**Separation:** decisions needing **external evidence** — rows 4, 7, 12 and the legal/provider/reviewer parts of 2, 5, 6, 8; decisions needing **internal approval only** — rows 3, 9, 10, 11, 13 and the approval parts of the rest.
**Fail rules:** any unsourced number presented as fact (row 4), any role marked "TBD" (row 7), any critical contradiction left open (row 9), or any decision marked approved without a signed record, **fails G0**.

---

## 9. Final report

| Metric | Value |
|---|---|
| Findings accounted for | **30 of 30** (4 Critical, 10 High, 9 Medium, 7 Low) |
| Open decisions | **76** (all OPEN; 3 alias IDs excluded) |
| Decisions blocking **implementation** (Group A) | **27** — none blocks P0, P0b or P1 |
| Decisions blocking **commercial launch** | **54** (Group A 27 + Group B 27) |
| Postponable (Group C) | **22** (incl. 9 Marketplace P9-D items) |

**Missing evidence (not in any document, needed from outside):** provider quotes and capabilities (payments in KGS, streaming at audience scale, hosting, AI if applicable); legal advice (entity, tax, consumer/auto-renewal law, data-protection regime, minors); named native Kyrgyz translators/reviewers and DE/EN authors; Live host/moderator candidates and rates; measured throughput-pilot results; measured AI cost per interaction (if a model is chosen); ky/ru learner split and level distribution; the business owner's thresholds and launch-scope decisions.

**Recommended next three actions**
1. **Assign owner roles to all 76 decisions and open the external-evidence requests** (provider quotes, legal advice, reviewer and host availability) — nothing in G0 can close without this; adopt the G0 checklist (G-01) and the G0-a/G0-b split if the business owner agrees.
2. **Hold the decision session for the four critical findings** (U-20, A-01, U-16 thresholds, L-01) using §4 as input, and record each decision with its evidence or an explicit dated deferral.
3. **Start P0, P0b and P1 engineering now** (they depend on none of the open decisions; only the P0b app name, Q12) **while** a documentation correction pass resolves FA-06/07/16/17 and the G-01…G-04 items — so that implementation begins on a consistent baseline rather than waiting for the commercial decisions.

**Confirmation:** no source code, dependency, existing architecture document or historical audit was modified; the only file created is this plan.
