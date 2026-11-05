# BilUp Til 2.0 — Final Independent Architecture Audit

**Date:** 5 November 2026 · **Baseline:** repository HEAD `386c6a1`; architecture documents 01–11 at Revision 3 · **Companion files:** [`IMPLEMENTATION_READINESS_MATRIX.md`](IMPLEMENTATION_READINESS_MATRIX.md), [`CONSOLIDATED_OPEN_DECISIONS.md`](CONSOLIDATED_OPEN_DECISIONS.md)

**Method disclosure.** This audit was performed by the same AI model family that authored the documents and the earlier reviews. It is an *adversarial re-audit*, not an organisationally independent one. Nothing was modified: no source code, no dependency, no existing document. Where a conclusion rests on domain knowledge rather than the repository, it is marked **[A]** and needs confirmation by the relevant expert.

---

## 0. Verdict

> ## **READY WITH CONDITIONS** — for a narrow scope only
> **Start now:** P0 (safety net), P0b (PWA-lite), P1 (progress integrity and storage) — they depend on no unresolved business decision, and their specifications are internally consistent.
> **Do not start / do not commit dates:** P2–P7 until the G0 decisions are signed; **P8b (subscriptions), P8c (BilUp Live) and P9 (Marketplace) are NOT READY FOR IMPLEMENTATION** — each has Critical or High findings that change what would be built.
> The set is **not** an internally consistent baseline yet: this audit found **9 confirmed contradictions** between documents (§3) and **several missing requirement areas** (§4), despite all cross-reference and dependency-matrix scripts passing.

Why not simply "ready": passing scripts proves that section numbers resolve and that import edges are acyclic. It does not prove that two documents say the same thing, that the state models are complete, that the roadmap's stated dependencies are true, or that what is promised to customers is what is planned. On those tests the set fails in the places listed below.

---

## 1. Scope, files read, checks performed

### 1.1 Read completely (this audit, not from memory)
`docs/architecture/01…11` (all eleven, in full), `ARCHITECTURE_CHANGELOG.md`, `FINAL_ARCHITECTURE_REVIEW.md`, `docs/BILUP_TIL_TECHNICAL_AUDIT.md`, `docs/BILUP_TIL_INDEPENDENT_REVIEW.md`, `docs/BILUP_TIL_ARCHITECTURE_INDEPENDENT_REVIEW.md`.

### 1.2 Checks actually performed
| # | Check | Method | Outcome |
|---|---|---|---|
| K1 | Cross-references `NN §x` resolve to existing headings (all 11 docs + changelog + final review) | Node script over headings | **0 unresolved** |
| K2 | **Semantic** correctness of every distinct cross-reference (heading title printed beside each ref and read) | Node script + reading ~150 unique refs | all targets semantically match their use except one weak citation (FA-26); the three 01 §0.2 refs were checked individually |
| K3 | Dependency matrix (07 §6.1): 12×12, strictly downward, no same-layer edges, column counts | Node script | **0 violations** |
| K4 | Revenue formula/tables in 11 §12 | Node script | **0 mismatches** |
| K5 | Plan names/prices: 99/149 KGS, "Premium" always "Premium Live", no variant names, Basic ≠ Live, Marketplace not in plans | grep + reading | consistent |
| K6 | Recording terms across all docs | grep + reading | prohibitions consistent **except the scope ambiguity in FA-14** |
| K7 | Operational/privacy vocabulary (backup, DR, RPO/RTO, SLO, on-call, runbook, breach, DPIA) in 07, 08, 10, 11 | grep (word-boundary) | **absent** for the server side (FA-10, FA-11) |
| K8 | Phase dependency claims vs. text actually using the artefact (P9 vs P8b outbox/`payments`) | reading + grep | **contradiction** (FA-06) |
| K9 | State models for subscription, invoice, payment, entitlement (11 §4–§6) | reading | incomplete (FA-08) |
| K10 | Decision-list mirrors (Q18↔U-list, Q19↔L-list) and stale counts | grep | consistent; stale G0 text found (FA-07) |

### 1.3 Limitations
No business, legal, provider, cost or Kyrgyz-linguistic fact could be verified. No code was run beyond read-only scripts kept outside the repository. Severity reflects impact on *implementation correctness and launch*, not likelihood.

---

## 2. Findings

Severity: **Critical** (invalidates a customer promise or a phase's purpose) · **High** (will cause rework, a wrong build or an unsafe launch) · **Medium** · **Low**. "Blocks" states what it blocks; **none of the findings blocks P0, P0b or P1**.

### 2.1 Critical

**FA-01 — "AI Tutor" is sold in Basic, but no phase delivers one.**
- **Where:** 11 §1 rule 1, §3.2 ("AI Tutor usage — Limited"), §11, U-20; 03 §9; 08 P4 Risks ("scope creep into 'real AI' → explicitly out of scope"), 08 P8b Scope ("real LLM remains [F]"); 07 §10 ("[F]"); 01 §1 pillar 1.
- **Description:** The approved plan promises "AI Tutor, subject to fair-use limits". Every planned phase keeps the **rule-based regex mock** (`tutor.ts`, **[V]** demo-mode disclosure). The documents design server-side metering, a `tutor.ai` entitlement and a tutor proxy for a model that no phase builds, selects, costs or privacy-assesses.
- **Why it matters:** Marketing a regex mock as "AI Tutor" is a consumer-honesty/legal risk; building metering for a free local mock is wasted scope; a future real model needs provider selection, cost control, data-protection treatment (learner text sent to a third party, possibly minors) and a new phase.
- **Resolution:** Decide U-20 at G0: (a) rename/describe the feature honestly ("practice assistant (rule-based)") and drop metering from P8b; or (b) add an explicit phase (tutor service: provider ADR, privacy assessment, cost model, prompt/data policy, evaluation) **before** P8b launch.
- **Blocks:** P8b public launch and P8b metering scope. Not P0–P1.

**FA-02 — The customer promise (German + English, A1–B2) does not match the content plan, and nothing links launch to content availability.**
- **Where:** 11 §1 rule 1 and §3.2 rows "German/English course access (A1–B2)"; 04 §13.1 (minimum launch scope = A1 only), §13.3 (A1–B2 ≈ 330–1,600 person-days, "staged"); 08 P7, P8b prerequisites (P3 only).
- **Description:** Basic is defined as access to "German courses A1–B2 and English courses A1–B2". The architecture treats A1–B2 as a *capability* and releases per (course, level, locale) as gates pass; P8b requires only P3 (packs exist). No document says what may be **sold** when only A1 (German) exists, whether the plan description is per-released-level, or what happens to price expectations as levels arrive.
- **Why it matters:** Charging 99 KGS/month on the strength of an A1–B2 promise while one level exists, in one language, in one locale, is a commercial and consumer-protection exposure; the entitlement matrix shows "✓ A1–B2" as if available.
- **Resolution:** Record a launch-commitments decision (new **A-01**, see CONSOLIDATED_OPEN_DECISIONS): plan copy must be generated from *released* levels per locale (data-driven), and a minimum content gate (levels × languages × locales) must be a prerequisite of public P8b launch.
- **Blocks:** P8b public launch / pricing publication. Not P0–P1.

**FA-03 — Unit economics unknown, and the mitigation is not enforceable.**
- **Where:** 11 §12.6, U-16; FINAL review C-1; 08 G0 item (10) vs G0 **Acceptance** ("items 1–9"), 08 P8b prerequisites.
- **Description:** All significant costs are unquantified; Premium Live adds 50 KGS over Basic to fund fixed teacher hours + variable streaming cost. The documents correctly refuse to claim profitability, and G0 lists "validated unit-economics model" as item (10). But **G0's acceptance criterion requires a signed record only for items 1–9**, and P8b's prerequisites reference the model only in prose.
- **Why it matters:** The control that is supposed to prevent building billing/Live on unviable prices can be skipped without violating any stated gate.
- **Resolution:** Make G0 acceptance cover item (10), and make P8b's prerequisite list "signed unit-economics record with go/no-go thresholds" explicitly.
- **Blocks:** P8b and P8c start. Not P0–P1.

**FA-04 — A single Live teacher cannot satisfy "complete Kyrgyz *or* Russian".**
- **Where:** 10 §12 (L-01); 01 §1.1 (acceptance scenarios), requirement stated in the task context.
- **Description:** Written Live material can be localised; spoken instruction cannot be both. The documents record this honestly and leave it unresolved.
- **Why it matters:** The platform's headline promise is per-learner language consistency; the largest premium feature cannot meet it without a policy (immersion, bilingual host, breakout channels, co-hosts) that changes staffing, provider capability (breakouts) and cost.
- **Resolution:** Decide L-01 at G0 with the Live operating model; add the chosen model to the provider capability gate (e.g. language channels/breakouts) and the cost model.
- **Blocks:** P8c launch (and design of interaction/breakout capabilities). Not P0–P1.

### 2.2 High

**FA-05 — Paying Kyrgyz subscribers could be served the disclosed Russian-fallback legacy mode.**
- **Where:** 02 §5.3 (S2 "disclosed legacy mode", ends at gate G-ky); 08 P8b prerequisites (P3, **not** G-ky); 11 (no locale condition on sale).
- **Description:** The staged rollout permits Kyrgyz users to remain on a legacy path with Russian fallback until G-ky. Nothing prevents P8b from charging them during that period.
- **Why it matters:** It contradicts the stated product rule (complete Kyrgyz or Russian) at the moment money changes hands.
- **Resolution:** Either require G-ky (for the sold levels) before selling in Kyrgyz, or restrict paid launch to released (course, level, locale) combinations and say so in the plan copy.
- **Blocks:** P8b launch in `ky`.

**FA-06 — Roadmap contradicts itself: P9 "does not depend on P8b" yet uses P8b artefacts.**
- **Where:** 01 §7 (R5 "independent of R4b/R4c"); 08 §2 note ("P9 does not depend on P8b/P8c"); versus 09 §2 ("shared `payments` module … introduced in P8b … outbox and job runner already exist from P8b"), 09 §9 ("outbox … now P8b"), 08 P9 Scope, 07 §8, 11 §14.
- **Why it matters:** If the Marketplace is scheduled before or without P8b, its payments module, outbox and job runner do not exist; planners following 01/08 §2 would mis-sequence the work.
- **Resolution:** State the real dependency: P9 depends on the *payments module + outbox/job runner* delivered in P8b (extract them as a shared P8-level platform step, or make P9 depend on P8b).
- **Blocks:** Roadmap planning for P8b/P9.

**FA-07 — Stale and inconsistent roadmap gates.**
- **Where:** 08 G0 Prerequisites ("Documents 01–09"), G0 Acceptance ("items 1–9"), §6 Definition of Done ("docs 01–09"); 01 §7 G0 row (no subscription/Live decisions); 08 G0 item (10).
- **Why it matters:** Gate text is what teams execute; it omits the Revision-3 decisions (see FA-03).
- **Resolution:** Align G0 prerequisites/acceptance/DoD with items (1)–(10) and docs 01–11.
- **Blocks:** G0 sign-off quality.

**FA-08 — The subscription/invoice/payment state models are incomplete.**
- **Where:** 11 §4–§6, §15.2 ("every valid/invalid transition of subscription, invoice and payment machines").
- **Description:** Only the *subscription* machine is drawn. The invoice and payment-transaction state sets appear only as cells in the §5.4 event table (`open/paid/uncollectible/void/refunded`; `initiated/succeeded/failed/refunded/partially_refunded/disputed`), with no transition tables; states needed for real providers (`requires_action`, `pending`, `canceled`) are missing. Not specified: the invariant "≤ 1 non-terminal subscription per account"; whether upgrade mutates the same subscription or creates a new one; `pending_payment` timeout; asynchronous payment methods (long-pending payments); the single `expired` status used for two meanings ("never activated" and "lapsed"); `manual` renewal anchoring (is a late renewal extended from the old period end or from the payment date, and is there an access gap?); effect of partial refunds on entitlements.
- **Why it matters:** The test requirement in §15.2 cannot be written against an undefined state space; these are the bugs that cause double charges, lost access and revenue leakage.
- **Resolution:** Add transition tables (state × event → state, with guards and side-effects) for subscription, invoice and payment; add the invariants above; define timeouts as plan-version configuration.
- **Blocks:** P8b implementation planning.

**FA-09 — Entitlement service: failure modes, consistency and ownership are unspecified.**
- **Where:** 11 §8, §13, §14; 10 §6; 07 §8.
- **Description:** Not specified: that join-time checks use a stored derived read model and **never call the payment provider**; fail-closed vs fail-open when `entitlements` is unavailable at the Saturday session start; propagation delay between a payment webhook and access (user pays Friday night; webhook arrives Saturday); revocation of already-issued Live tokens or offline leases after refund/chargeback; cache TTLs. Also, no backend module owns **paid-content delivery** (signed URLs/endpoint) or the **tutor proxy**, although 11 §13 requires both.
- **Why it matters:** These determine whether paying users are locked out at the worst time and whether access can be abused after reversal.
- **Resolution:** Specify the read model, TTLs, failure policy, reconciliation-triggered revocation and the owning modules (e.g. `content-access`, `tutor` in P8b).
- **Blocks:** P8b/P8c design.

**FA-10 — Operational readiness is absent on the server side.**
- **Where:** 07 §8 ("Observability" is one table row), 10 §16, 11 §6.5, 08 (no operational acceptance criteria).
- **Description:** No database backup/restore policy, disaster recovery, RPO/RTO, availability targets (SLO), alerting rules, on-call, runbooks, incident communications/status page, capacity plan for the join surge at session start, deployment/rollback strategy or secrets-rotation process. (Word-boundary searches found none in 07, 08, 10, 11; only local-storage backups in 05.)
- **Why it matters:** A paid subscription with scheduled live events is an operated service; "we have a staging environment" is not an operating model.
- **Resolution:** Add an operations baseline document/section (targets, backups, alerting, incident process, release/rollback, on-call model) and make it an acceptance criterion of P8 (identity/sync), P8b and P8c.
- **Blocks:** Production use of P8/P8b/P8c; not P0–P1.

**FA-11 — Data-protection, legal and consent deliverables are not specified for subscriptions and Live.**
- **Where:** 09 §11 (marketplace only; "applicable laws … depend on markets [A]"), 11 §13 "Privacy", 10 §11, §13; 05 §10; no occurrence of DPIA, breach notification, ToS/privacy policy as deliverables.
- **Description:** No applicable data-protection regime is identified (home market and users abroad), no data-processing inventory across providers (payments, video, AI, email), no breach-notification process, no controller/processor roles for subscriptions/Live (09's D8 covers only the Marketplace), no Terms/Privacy/Consent/auto-renewal-disclosure artefacts, no age-gating design (minors undecided in 09, 10, 11 and Q11).
- **Why it matters:** P8 starts collecting identities; P8b payment data; P8c chat/attendance. These cannot be launched without legal bases and notices.
- **Resolution:** Add a privacy/legal workstream to G0 and a "data-protection basis" prerequisite to P8 (not only P9-D D8); list required legal documents per phase.
- **Blocks:** P8, P8b, P8c launch.

**FA-12 — Key security controls are unspecified or missing.**
- **Where:** 11 §13 ("signed `EntitlementSnapshot`"), 07 §8 "Auth", 10 §6, §11.
- **Description:** (a) Signing-key management for entitlement snapshots (algorithm, rotation, revocation, compromise handling) is not defined. (b) Multi-factor authentication is specified for admins and teacher payouts, **not for `live_host`/`live_moderator`** — hijacking a host account hijacks a mass session. (c) No account-takeover protections for learners whose accounts carry paid entitlements (credential-stuffing limits, session management, step-up for sensitive changes). (d) Rate limits are listed for auth/search/booking/review but not for subscription, join-token, tutor and webhook endpoints.
- **Resolution:** Add a security-requirements table for these four items and tests (key rotation test, staff MFA enforcement test, takeover rate-limit tests).
- **Blocks:** P8b/P8c security review.

**FA-13 — Sync design is inconsistent and ordered before id stability.**
- **Where:** 05 §9 ("mastery recomputed from merged results"; "pushes unsent results") vs 05 §2/§3 (mastery is durable state, **not** rebuilt from raw results) vs 07 §8 / 08 P8 (sync of compact ledger, completions, mastery, settings); 08 P8 prerequisites (P1, P2) vs 04 §9/05 §11 (id mapping and tombstones settled in P3).
- **Why it matters:** Two devices with different mastery boxes cannot be merged by "set union"; syncing before the content ids are stable would push legacy ids into server data that P3 then renames.
- **Resolution:** Define per-record conflict rules (ledger/completions: union by deterministic ids; mastery: last-review-wins per item with timestamps; settings: LWW) and make P8 sync depend on P3's id mapping (or version the id scheme on the server).
- **Blocks:** P8 sync design.

**FA-14 — Implementability of the roadmap cannot be demonstrated.**
- **Where:** 08 §3 (sizes S/M/L "relative"), §7 ("staffing unknown"), P8b/P8c scope.
- **Description:** There is a *content* capacity model (04 §13) but no *engineering* capacity model, no sizing basis, no estimate of the P8b/P8c scope — billing, dunning, reconciliation, entitlement service, gated delivery, subscription UI, outbox, job runner, notifications, back-office, legal documents — all labelled "L", the same size as P8. 15 phases plus two parallel tracks have no stated team assumptions.
- **Resolution:** Add an engineering estimate per phase with explicit team-size assumptions (even coarse ranges), re-size P8b/P8c after FA-08/FA-09/FA-10/FA-15 are specified, and state the critical path with content gates.
- **Blocks:** Committing dates (not starting P0–P1).

### 2.3 Medium

**FA-15 — P8b scope omits required supporting systems.**
- **Where:** 08 P8b Scope; 11 §5.3, §6.4, §13; 07 §8 ("notifications and admin … only when they own data").
- **Description:** Not scoped: notification delivery for payment failure/renewal/expiry (required by 11 §5.3); customer-support/back-office tooling (refunds, manual grants, plan administration, customer lookup, audit viewing); legal invoices/receipts and tax handling (**U-03**); roles for finance/support (01 §4.5 lists only `admin`).
- **Resolution:** Add them to P8b scope or explicitly defer with an operational workaround; extend roles/separation of duties.

**FA-16 — Interface inventory is incomplete.**
- **Where:** 01 §4.3 vs 03 §2 (`LanguagePackPort`), 10 §8 (`RealtimeChannel`), 11 §14 (`EntitlementPort`, `BillingReadPort`, `PaymentsPort`, `ClassroomProviderPort`, `IdentityPort`), 01 §4.2 (subscription/live consume `AuthPort`, `SettingsPort`) but the table lists `AuthPort` consumers as "app, marketplace".
- **Why it matters:** 01 §4.2 declares that all cross-module ports live in `shared/contracts`; the table that enumerates them omits several and mixes frontend and backend contracts. The CI policy test cannot validate what is not listed.
- **Resolution:** Complete the table (separate frontend and backend contract inventories) and generate it from the contracts directory.

**FA-17 — Marketplace document retains stale or contradictory statements.**
- **Where:** 09 §6 ("level from the active course (via the recommendation port …)") — the port was removed (01 §4.2, 09 §2); 09 §3, §12.3, §18 ("Ledger entries are the financial source of truth", "ledger invariants", P9c "ledger") vs 09 §12.2 (a ledger is built only if the platform holds balances); 09 §9.1 diagram label `payment_authorized/confirmed` vs capture-at-booking; 09 §18 "decisions Q7–Q11 closed" as P9 prerequisite vs 08 P9 (only before P9d); duplicate list number "9." in §1.
- **Resolution:** Edit 09 to the revised model; keep one statement of the P9 entry conditions.

**FA-18 — The no-recording rule has an undefined boundary.**
- **Where:** 10 §9 (prohibits recording "everywhere"); 09 §4.1 `introVideoRef`, §5.1 V6 (pre-recorded applicant video); 03 §3.1 and 04 §13.5 (recorded audio for listening, [F]); 10 §9.1 ("no live transcription stored").
- **Description:** Course audio, teacher intro videos and application videos are stored media but are not *session* recordings; accessibility captions are neither allowed nor forbidden. The FINAL review's check #8 ("hits are prohibitions only") did not examine these.
- **Why it matters:** An absolute rule stated without scope invites accidental violation or over-blocking.
- **Resolution:** Define "recording" as capture of a live session (video, audio, screen, transcript) and list the permitted non-session media classes explicitly; decide on transient (non-stored) captions.

**FA-19 — Live accessibility and mass-UI responsiveness are unspecified.**
- **Where:** 10 (no accessibility section), 06 (no Live UI requirements), 10 §9.1.
- **Description:** No captions/transcripts requirement for deaf and hard-of-hearing learners (and its tension with the transcription ban), no keyboard/screen-reader requirements for polls/chat/Q&A, no mobile layout rules for a video + chat + poll interface.
- **Resolution:** Add Live UI requirements to 06/10 and resolve the caption question under FA-18.

**FA-20 — Live join reliability vs token controls.**
- **Where:** 10 §6.3 (single-use tokens, one active connection with eviction), 11 §8.
- **Description:** Mobile networks drop; single-use tokens plus eviction can lock out legitimate reconnects; the join endpoint receives a synchronised surge at session start.
- **Resolution:** Specify reconnect semantics (re-issue within the session window after an entitlement re-check), eviction hysteresis, and surge capacity/queueing; add tests.

**FA-21 — Third-party surfaces fall outside the locale/provenance guarantees.**
- **Where:** 02 §7 (every visible node has provenance), 07 §9 provider capability lists (no UI-language criterion), 11 §7 (hosted checkout).
- **Description:** Provider-hosted checkout pages and video SDK UIs are not rendered by our resolver; their language support (Kyrgyz/Russian) is unknown.
- **Resolution:** Add "UI locale support for `ky` and `ru`" as a provider-selection criterion and document unavoidable exceptions to the provenance test.

**FA-22 — FINAL_ARCHITECTURE_REVIEW overstates consistency.**
- **Where:** FINAL review §0/§7 ("coherent, internally consistent architecture baseline"), §3 checks #8, #11.
- **Description:** It declares internal consistency, yet FA-06, FA-07, FA-13, FA-17 existed; check #8 missed FA-18; the claim that active documents "now say P8b" for the outbox was true only after one fix and remains false for the independence statement (FA-06).
- **Resolution:** Treat that verdict as superseded by this audit; correct after the fixes.

**FA-23 — Marketplace/subscription interplay on U-13 is a hidden dependency.**
- **Where:** 09 §1.2, 11 U-13, 06 §4.1.
- **Description:** "Booking is independent of subscriptions" is an architecture default, but identity/age/consent requirements (accounts needed to book) and navigation prominence assume an account model decided elsewhere (U-01/U-02).
- **Resolution:** Record as a joint decision with U-01 and U-02.

### 2.4 Low

| ID | Where | Description | Resolution |
|---|---|---|---|
| FA-24 | 06 §10 (open item "Exact bottom-nav composition once Teachers is enabled"; revision-2 note "marketplace on or off") | stale versus 06 §4.1 composition rule | update |
| FA-25 | 03 §11 ("in-memory repository"), 01 §4.3 ("ui-host in `app`"), 04 (§7 has only 7.3), 02 (§2.4 precedes §2.2), 01 §9 (rows out of order) | structural/naming leftovers | tidy |
| FA-26 | 10 §12 cites "01 §0.2" for the "complete Kyrgyz/Russian" requirement (it is only implied by the `explanationLocale` definition and 01 §1.1 acceptance rows) | cite 01 §1.1 | fix reference |
| FA-27 | 05 "credit ledger" vs 09 "ledger" (financial) | same word, two concepts | rename one (e.g. "financial records") |
| FA-28 | 11 §5.1 | `expired` reused for two meanings (see FA-08) | split or document |
| FA-29 | 06 §4.1 | bottom-nav includes **Live** "when enabled" regardless of L-09 (visibility undecided) | state it as a flag-dependent default |
| FA-30 | Changelog Revision 2 "Files changed" and "outbox from P9b" text | historical, superseded | add a "superseded by" note |

---

## 3. Contradictions confirmed (summary)
1. P9 independent of P8b vs P9 uses P8b's `payments`/outbox (FA-06).
2. G0 items (1)–(10) vs G0 acceptance "1–9" and prerequisites "01–09" (FA-07).
3. 05 §9 sync (merge results, recompute mastery) vs 05 §2/§3 (mastery durable) vs 07 §8 (sync mastery) (FA-13).
4. 09 §6 recommendation port vs 01 §4.2/09 §2 (removed) (FA-17).
5. 09 ledger-as-truth vs 09 §12.2 (ledger conditional) (FA-17).
6. 09 §18 prerequisites (decisions closed) vs 08 P9 (before P9d) (FA-17).
7. Paid launch (11/08 P8b) vs staged Kyrgyz legacy mode (02 §5.3) (FA-05).
8. "AI Tutor" in plan (11) vs mock-only roadmap (03/08/07) (FA-01).
9. "A1–B2 DE+EN" plan promise (11 §1) vs MLS/A1 (04 §13, 08 P7) (FA-02).

## 4. Missing requirement areas (summary)
Operations/DR/SLO/incident (FA-10); data protection/legal artefacts (FA-11); staff/key security (FA-12); sync conflict rules (FA-13); engineering capacity (FA-14); back-office/notifications/invoices (FA-15); contract inventory (FA-16); recording scope (FA-18); Live accessibility (FA-19); reconnect/surge (FA-20); third-party locale (FA-21).

## 5. Specific assessments requested

| Topic | Assessment |
|---|---|
| **Dependency direction and boundaries** | Sound and mechanically consistent (K3). Gaps are *documentation* of contracts (FA-16), not edges. |
| **Subscription, entitlement, payment, invoice state models** | Concept separation is good; **state models incomplete** (FA-08, FA-09). |
| **Basic 99 / Premium Live 149 KGS** | Prices consistently represented as configuration; **economics unvalidated (FA-03)**; promise vs content (FA-02) and tutor (FA-01) unresolved. |
| **Live access and security** | Server-side token-gated join is correctly specified; **hardening incomplete** (FA-12, FA-20); operational and privacy basis missing (FA-10, FA-11). |
| **Marketplace isolation** | Code, entitlement, record and room isolation are consistent; one hidden shared dependency (P8b `payments`/outbox, FA-06); stale text (FA-17). |
| **Global no-recording policy** | Consistent where stated; **boundary undefined** (FA-18). |
| **AI Tutor claims vs implementation** | **Mismatch** (FA-01). |
| **Roadmap implementability** | Dependency graph mostly right; **not demonstrably implementable** (FA-14), with specific contradictions (FA-06, FA-07, FA-13). |
| **Security / privacy / testing / monitoring / ops** | Testing strategy is strong for logic and access control; **privacy, monitoring and operations are the weakest areas** (FA-10, FA-11, FA-12). |

## 6. Required actions before the verdict can improve

1. Fix the nine contradictions (documentation only, small).
2. Add state-transition tables and invariants for subscription/invoice/payment (FA-08) and the entitlement read-model specification (FA-09).
3. Add an operations baseline and a data-protection/legal workstream (FA-10, FA-11), plus the missing security controls (FA-12).
4. Decide, at G0 and in writing: U-20 (AI Tutor), A-01 (launch commitments vs content), L-01 (Live language), the unit-economics record, and the Kyrgyz paid-launch condition (FA-05).
5. Provide an engineering estimate with team assumptions (FA-14).

After items 1–3, **P8 and the P2–P6 plans** could move to "ready with conditions"; **P8b/P8c/P9 remain not ready** until item 4 and the corresponding decision records (S-D, L-D, P9-D) exist.

## 7. Confirmation
No application source, `package.json`, dependency, existing document or migration was created or modified by this audit. The only files created are the three audit deliverables.
