# BilUp Til 2.0 — Consolidated Open Decisions

Single register of every unresolved decision found across documents 01–11, the changelog and the final review, plus decisions raised by [`FINAL_INDEPENDENT_AUDIT.md`](FINAL_INDEPENDENT_AUDIT.md). Date: 5 November 2026. **No decision in this file was made by the audit.**

## 0. How to read this file

| Class | Meaning |
|---|---|
| **Confirmed requirement** | Approved by the business (stated in the task context and recorded in the documents). Not open. Listed in §1 so it is not confused with a decision. |
| **Open decision** | Not approved. The documents may describe an *option* or a *proposed default*, but a proposal is **not** a decision. |
| **Proposed parameter [A]** | A number or default written in a document as a starting point (§7). Unapproved until ratified in the phase that uses it. |
| **Audit-raised (A-nn)** | A decision the audit found to be missing from every list. Not yet recorded in documents 01–11. |

**Owners:** none of the documents assigns an owner or date to any decision; G0 requires owners and dates (08 §3 G0). The "Owner" column is therefore *unassigned* throughout and is the first G0 action.

---

## 1. Confirmed requirements (not open)

| # | Requirement | Where recorded |
|---|---|---|
| C-1 | One multilingual platform on the existing React + TypeScript + Vite app; **modular monolith; no microservices; no rewrite** | 01 §0.1, ADR-01, ADR-08 |
| C-2 | Target languages German and English; CEFR A1–B2 initial scope; C1/C2 architecture-supported only | 01 §0.3 |
| C-3 | UI and explanation locales Kyrgyz and Russian; `uiLocale`, `explanationLocale`, `targetLanguage`, `courseId` independent; **no silent Russian fallback** | 02 |
| C-4 | **BilUp Basic 99 KGS/month**: entire self-study platform (DE and EN courses A1–B2, lessons, vocabulary, grammar, exercises, assessments, reading/listening/writing/speaking, AI Tutor subject to fair use, spaced repetition, dashboard, daily activities); **no Live** | 11 §1 |
| C-5 | **BilUp Premium Live 149 KGS/month**: Basic + weekly German Live + weekly English Live (60 min each, one teacher, potentially hundreds, A1–B2 in one stream with differentiated tasks, polls/quizzes/chat/Q&A/speaking challenges, attendance, materials); **both sessions included, not sold separately** | 11 §1, 10 |
| C-6 | Currency KGS; prices are **configuration** (plan versions), never hard-coded; history immutable | 11 §2, §10 |
| C-7 | Plan, subscription instance, payment transaction, entitlements and statuses are **independent concepts**; entitlement checks are **server-side** | 11 §4, §13 |
| C-8 | **No recording, replay, recording storage or recording entitlement** (Live and Marketplace); provider auto-recording disabled where supported; external recording cannot be prevented and the docs say so | 10 §9 |
| C-9 | Live sessions weekend, preferably Saturday; **start times configurable** (the values themselves are open: L-02) | 10 §5 |
| C-10 | Marketplace is a **separate paid service**, not in either plan | 09 §1.2, 11 §9 |
| C-11 | No payment provider is chosen; payments sit behind an abstraction; **no real payments or video until the relevant decision record is approved** | 07 §9, 09 §1.1, 11 §7 |
| C-12 | Do not duplicate decisions: Marketplace booking, commission, refunds and payouts stay separate from Live entitlements | 09, 10 §14, 11 §9 |

---

## 2. Decision records and gates

| Gate / record | Blocks | Contains (decisions) |
|---|---|---|
| **G0** Decisions & staffing gate | Planning commitments (dates), P3 translation start, P7, P8b economics | Q1, Q2, Q3, Q6, Q12, Q15, Q16; glossary; throughput pilot; owners/dates for U-, L-, Q-lists; unit-economics record (08 G0 items 1–10); **audit finding: acceptance wording omits item 10 (FA-03/FA-07)** |
| **S-D** Subscription & payment decision record | Any real subscription charge | U-03, U-04, U-05, U-07, U-08, U-09, U-10, U-15, U-16; consumer-law disclosures [A]; (audit) A-01, A-02, A-06 |
| **L-D** Live decision record | Any real Live provider contract or participant pilot | L-01–L-10, L-12; provider contract; data-protection basis; moderation staffing; incident process; (audit) A-05, A-09, A-12, A-13 |
| **P9-D** Marketplace decision record | Any real Marketplace transaction (P9d) | D1–D9 (= Q7–Q11, Q17); (audit) A-14 |

---

## 3. Global questions (01 §9)

| ID | Decision | Type | Blocks | Source |
|---|---|---|---|---|
| Q1 | Retire or keep dormant the `de` **UI** locale | product | P2 | 01 §9, 02 §2.2 |
| Q2 | Who authors/reviews Kyrgyz content; named Kyrgyz translator + two independent reviewers | resource | P3, G-ky | 01 §9, 04 §13.5 |
| Q3 | English course scope per level and authorship; English language-pack authorship; CEFR syllabus source | resource | P7 | 01 §9, 04 §13 |
| Q4 | Course variants per language (general/exam/business) | product | P2 | 01 §9 |
| Q5 | Cloud sync before or after accounts (proposal: local-first, sync at P8) | product/technical | P8 | 01 §9 |
| Q6 | Backend language/runtime and hosting (proposal: TypeScript/Node + PostgreSQL) | technical | P8 | 01 §9, 07 §8 |
| Q7 | Target markets, currencies, payment-provider availability (KG/RU/EU) | legal/business | P8b, P9 | 01 §9 |
| Q8 | Marketplace commission, payout schedule, refund policy, tax/VAT | business | P9 | 01 §9 |
| Q9 | Teacher verification depth, background checks, liability | legal | P9 | 01 §9 |
| Q10 | Video provider (Marketplace; Live separately = L-03). *Recording question closed: prohibited* | technical | P8c, P9 | 01 §9 |
| Q11 | Are minors users; age gating; guardian consent | legal | P8, P8c, P9 | 01 §9 |
| Q12 | Brand name in UI ("BilUp Til" vs "BilUp Deutsch") | product | P0b (icons/manifest), P5 | 01 §9 |
| Q13 | PWA offline scope (shell vs packs) | product | P0b/P6 | 01 §9 |
| Q14 | `dist/` vs source match; real-device lab | verification | P5 | 01 §9 |
| Q15 | Approve minimum launch scope (MLS) and level depth | business | P2/P3/P7 | 01 §9, 04 §13.1 |
| Q16 | Quality-gate thresholds for Kyrgyz and Russian release | quality | R1a/R1b | 01 §9, 04 §7.3 |
| Q17 | Marketplace payment model (charge-at-booking vs deferred; who holds funds; windows) | legal/provider | P9c/P9d | 01 §9 |
| Q18 | Subscription decisions U-01…U-20 | — | P8b | 01 §9 → §4 |
| Q19 | Live decisions L-01…L-14 | — | P8c | 01 §9 → §5 |

---

## 4. Subscription and pricing decisions (11 §16)

| ID | Decision | Type | Gate | Audit link |
|---|---|---|---|---|
| U-01 | Entitlements without a subscription (free tier/trial/preview); what an expired account keeps | business | P8b | FA-23 |
| U-02 | Existing free local-only MVP users and anonymous use after paid plans | business | P8/P8b | FA-23 |
| U-03 | Payment provider(s) for KGS, legal entity, tax/VAT, consumer-law (auto-renewal) | legal/business | S-D | FA-15, FA-21 |
| U-04 | Renewal mode: automatic (stored credentials) vs manual | business/provider | S-D | FA-08 |
| U-05 | Retry schedule, grace length, Live access during grace | business | S-D | FA-08 |
| U-06 | AI Tutor fair-use values; Premium Live vs Basic limits | business | S-D | FA-01 |
| U-07 | Upgrade billing (options A–D) and rounding | business | S-D | FA-08 |
| U-08 | Downgrade timing | business | S-D | FA-08 |
| U-09 | Cancellation and refund policy | business/legal | S-D | FA-08 |
| U-10 | Compensation for platform-cancelled Live sessions | business | S-D/L-D | — |
| U-11 | Live materials after downgrade/expiry | business | L-D | — |
| U-12 | Attendance history after losing Premium Live | business/privacy | L-D | FA-11 |
| U-13 | Marketplace booking vs subscription requirement; any Premium Live credits | business | P9 | FA-23 |
| U-14 | Retention of learner data for expired accounts | legal | P8b | FA-11 |
| U-15 | Price-change policy for existing subscribers; notice | business/legal | S-D | — |
| U-16 | Validated cost model and go/no-go thresholds | business | **G0**/S-D | **FA-03** |
| U-17 | Offline entitlement lease length | product/security | P6/P8b | FA-09, FA-12 |
| U-18 | Account-sharing and device-limit policy (self-study) | business | P8b | FA-12 |
| U-19 | Business timezone for billing-day wording/reporting | business | P8b | — |
| U-20 | What "AI Tutor" means at launch (mock vs real); delivery phase if real | product/legal | **G0** | **FA-01** |

---

## 5. BilUp Live decisions (10 §18)

| ID | Decision | Type | Gate | Audit link |
|---|---|---|---|---|
| L-01 | Spoken instruction language for a mixed ky/ru audience | product/ops | **L-D** | **FA-04** |
| L-02 | Weekend days, start times, canonical timezone, lobby/late-join windows, DST resolution | product | L-D | — |
| L-03 | Live provider (must pass the capability gate) and pricing | technical/business | L-D | FA-21 |
| L-04 | Authoring/translation workflow and staffing for weekly Live materials (ky/ru) | resource | G0/L-D | FINAL H-7 |
| L-05 | Realtime transport for polls/chat/Q&A | technical | P8c-3 | FA-20 |
| L-06 | Retention periods per data class; attendance threshold | legal/product | L-D | FA-11 |
| L-07 | Level-band assignment (self-select vs derived with consent) | product/privacy | P8c | — |
| L-08 | Participant watermarking as a deterrent | product/legal | L-D | — |
| L-09 | Visibility of the Live schedule/teaser to Basic and unsubscribed users | product | P8c/P5 | FA-29 |
| L-10 | Host/moderator staffing model and ratios | ops/business | L-D | FA-10 |
| L-11 | = U-11 | | | |
| L-12 | = Q11 (minors in Live) | legal | L-D | FA-11 |
| L-13 | Whether Live participation grants XP/streak/badges | product | P8c | — |
| L-14 | = U-10 | | | |

---

## 6. Marketplace decision record P9-D (09 §1.1)

| ID | Decision | Linked |
|---|---|---|
| D1 | Target markets and currencies | Q7 |
| D2 | Payment-provider selection with capability matrix | Q7, Q17 |
| D3 | Legal structure (merchant of record vs agent; who may hold funds; licences; terms) | Q7, Q9 |
| D4 | Commission model; fee presentation; tax/VAT, invoicing | Q8 |
| D5 | Refund, cancellation, no-show, dispute policy; chargeback liability; payout schedule; negative balances | Q8 |
| D6 | Teacher verification policy approval (§5.1 criteria are proposals), background checks, minors | Q9, Q11 |
| D7 | Marketplace video provider (recording prohibited) | Q10 |
| D8 | Data-protection basis (controller/processor, DPAs, retention, cross-border) | Q7, Q9 |
| D9 | Operational readiness (verification/moderation/support staffing, disputes, incident process) | — |

Also open inside 09: accepted-credentials list for criterion V4; hold/abuse values (§8.1a); messaging at MVP; teacher onboarding capacity.

---

## 7. Audit-raised decisions (not yet in documents 01–11)

| ID | Decision | Why | Finding | Needed by |
|---|---|---|---|---|
| **A-01** | **Launch commitments vs content:** what may be sold/advertised when only released (course, level, locale) combinations exist; plan copy generated from released levels; minimum content gate for public P8b | Plan promises A1–B2 in two languages; MLS is A1 | FA-02 | G0 / S-D |
| **A-02** | Paid launch in Kyrgyz: require G-ky for the sold levels, or restrict sale to released combinations | Legacy Russian-fallback mode must not apply to paying users | FA-05 | S-D |
| A-03 | Entitlement failure policy: fail-closed vs fail-open, read-model TTLs, webhook-lag handling, revocation of Live tokens/offline leases after refund/chargeback; owning modules for gated content and tutor proxy | Access correctness under failure | FA-09 | P8b design |
| A-04 | Subscription invariants and timeouts: ≤ 1 non-terminal subscription per account; upgrade on same vs new instance; `pending_payment` timeout; async payment methods; split of `expired`; manual-renewal anchoring; partial-refund effect on entitlements | State model completeness | FA-08 | P8b design |
| A-05 | Operations baseline: availability objectives, backup/restore, RPO/RTO, alerting, on-call, incident communication/status page, release/rollback, secrets rotation | Paid, scheduled live service | FA-10 | P8 / L-D |
| A-06 | Data-protection regime(s), controller/processor roles for accounts/billing/Live/AI, DPIA/inventory, breach-notification process, required legal documents (Terms, Privacy, auto-renewal disclosures), age gating | Legal basis for collecting identity/payment/chat data | FA-11 | P8 / S-D / L-D |
| A-07 | Security requirements: entitlement-snapshot signing keys (algorithm, rotation, revocation), MFA for `live_host`/`live_moderator`, learner account-takeover protections, rate limits for subscription/join/tutor/webhook endpoints | Account hijack = paid access/hosting hijack | FA-12 | P8b / P8c |
| A-08 | Sync conflict rules per record type and ordering of sync vs id stability (P3) | Prevent progress corruption | FA-13 | P8 design |
| A-09 | Definition of "recording" and the allowed non-session media (course audio, applicant/teacher intro video, materials); policy for transient (non-stored) live captions | Absolute rule needs a boundary; accessibility | FA-18, FA-19 | L-D |
| A-10 | Engineering capacity and team assumptions; re-sizing of P8b/P8c after A-03/A-04/A-11 | Roadmap implementability | FA-14 | G0 |
| A-11 | P8b supporting scope: notification delivery, back-office/support tooling and roles (finance/support), invoices/receipts/tax handling | Required by 11 §5.3/§6.4/§13 | FA-15 | P8b design |
| A-12 | Live reconnect semantics (token reuse after drop), eviction hysteresis, session-start surge capacity | Reliability vs token control | FA-20 | P8c design |
| A-13 | Provider selection criterion: UI locale support (`ky`, `ru`) for hosted checkout and video SDK; documented exceptions to the provenance test | Locale guarantee for third-party surfaces | FA-21 | S-D / L-D |
| A-14 | Placement of the shared `payments` module, outbox and job runner in the roadmap (P8-level platform step vs P8b) and Marketplace's dependency on it | Roadmap contradiction | FA-06 | G0 |

---

## 8. Proposed parameters in the documents (unapproved starting values [A])

| Parameter | Proposed value | Where |
|---|---|---|
| Idle window for study time | 60 s | 05 §5 |
| Results retention; tombstones | 500 results / 90 days (whichever larger); ≥ 400 days | 05 §4.4 |
| Default pass threshold (tests) | 0.7; lessons participation-based | 03 §12 |
| PWA bundle budget | ≤ 170 KB gzip (to be re-derived from the measured shell) | 07 §4 |
| Initial test coverage | 70 % (P0); ≥ 90 % pure modules | 08 P0, 07 §7 |
| Gate review sample | ≥ 20 % stratified; 0 critical, ≤ 2 % minor errors | 04 §7.3 |
| Productivity rates, level weights, depth factor D | see 04 §13.3 (replaced by pilot results) | 04 §13 |
| Hold TTL / extension / limits / cooldown | 10 min (+ to 20 for payment step); 2 concurrent; 3 per day; 3 expired in 24 h → 30 min | 09 §8.1a |
| Marketplace `maxAdvanceDays` | 30 | 09 §9.2 |
| Live token TTL | "a few minutes" | 10 §6.3 |
| Teacher re-verification | yearly | 09 §5 |
| Periodic verification, interview length, rubric thresholds | 15–20 min sample; threshold unspecified | 09 §5.1 |
| Subscription grace/retry values | unspecified (examples only) | 11 §5.3, U-05 |
| AI fair-use values | unspecified; structure only | 11 §11, U-06 |

---

## 9. Duplicates and overlaps to reconcile
| Overlap | Note |
|---|---|
| L-11 = U-11; L-14 = U-10; L-12 = Q11 | Keep a single owner per decision |
| Q7/Q9/Q11 vs D1–D8 vs U-03 | Provider/legal decisions overlap between S-D and P9-D; decide the provider(s) once (A-14, U-03, D2) |
| Q17 = D2/D3/D5 (payment model) | Marketplace-specific |
| U-16 (cost model) vs 08 G0 item (10) vs FA-03 | One record, one acceptance gate |
| U-20 vs 08 P4 ("real AI out of scope") | Decide once; update 03 §9 / 08 |

## 10. Suggested order of decisions
1. **Owners and dates** for every open item (G0).
2. **Business viability:** U-16 (cost model), A-01 (launch commitments), U-20 (AI Tutor), U-01/U-02 (free access / existing users).
3. **Language and product model:** L-01, L-02, Q1, Q15, Q16, Q2/Q3 (staff).
4. **Legal/provider:** U-03, Q7, D1–D3, A-06, A-13, Q11 (minors).
5. **Operating model:** A-05, L-10, A-10, A-11.
6. **Design-level (technical) decisions** that unblock P8/P8b specification: A-03, A-04, A-07, A-08, A-12, A-14, A-09.
7. Only then the parameter values in §8.

*This file lists decisions; it does not recommend outcomes except where a document already contained a labelled proposal.*
