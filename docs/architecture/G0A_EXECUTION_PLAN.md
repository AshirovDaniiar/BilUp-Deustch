# BilUp Til 2.0 — G0-a Execution Plan

**Date:** 5 November 2026 · **Status of every decision referenced here: OPEN** · **Inputs:** `G0_DECISION_RESOLUTION_PLAN.md`, `FINAL_INDEPENDENT_AUDIT.md`, `IMPLEMENTATION_READINESS_MATRIX.md`, `CONSOLIDATED_OPEN_DECISIONS.md`, documents 01–11 (all read in full earlier in this working session; not re-read line by line for this task).

**Honesty notes.**
- **G0-a / G0-b is a proposal** (G0 plan §7.3 cycle 4). It becomes the gate definition only after decision **G-01** is approved by the business owner. Until then this plan is a *preparation* plan; nothing here changes the existing G0 definition in 08.
- **No person, name, vendor or price appears in this file.** Every role below is *unfilled*: no document names an individual for any role. Filling roles is itself a G0-a output.
- **No decision is approved by this document.** "Recommendation" text only repeats proposals already labelled as such in the earlier plan.
- Nothing here claims commercial readiness. G0-a only prepares the ground and starts evidence collection.

---

## 1. Roles used (all currently UNFILLED)

| Role | Used for | Person recorded in any document? |
|---|---|---|
| Business owner | Final approval of scope, promises, prices, language and staffing decisions | No |
| Product owner | Product behaviour, UX policy, plan copy | No |
| Technical lead | Architecture, backend direction, module ownership | No |
| Program manager | Gate governance, schedule, dependency tracking | No |
| Finance / business analyst | Economics model, pricing, tax mechanics | No |
| Legal counsel | Entity, tax, consumer law, data protection, terms | No (external role) |
| Data-protection role | Processing inventory, notices, breach process | No |
| Security lead | Keys, MFA, threat model, abuse controls | No |
| Operations lead | Live operations, support, backups, incident process | No |
| Localization lead | ky/ru quality, glossary, gates | No |
| Curriculum lead | Syllabus, level depth, pedagogical sign-off | No |
| QA lead | Device lab, test matrix | No |
| Accessibility reviewer | Live accessibility criteria | No |

Definitions: **Owner** = accountable for preparing the decision and its evidence; **Approver** = the role whose explicit written approval closes it; **Evidence provider** = who/what supplies facts the decision needs (may be external: vendors, counsel, native reviewers, pilot participants). For every business decision the approver is the **Business owner** (possibly together with Legal counsel where wording or law is involved); the Business owner is also the only role that may mark a decision APPROVED.

---

## 2. Accountability map — all 76 decisions

Status of every row: **OPEN**. "Evidence provider" entries marked *(ext.)* are outside the team; their identity is **missing** and must be supplied (see §10). Group = A (before implementation), B (before commercial launch), C (postponable) from the G0 plan.

### 2.1 Global questions (17)
| ID | Gr | Owner | Approver | Evidence provider |
|---|---|---|---|---|
| Q1 `de` UI locale | A | Product owner | Business owner | Product owner (preference; no data needed) |
| Q2 Kyrgyz authors/reviewers | A | Localization lead | Business owner | Candidate translators/reviewers *(ext.)*; Kyrgyz pilot (§6.3) |
| Q3 English scope/authorship | A | Curriculum lead | Business owner | Candidate authors *(ext.)*; throughput pilot (§6.2) |
| Q4 Course variants | C | Product owner | Business owner | Demand evidence (none yet) |
| Q5 Sync timing | C | Technical lead | Business owner | Technical lead |
| Q6 Backend runtime/hosting | A | Technical lead | Business owner | Hosting vendors *(ext.)*; Legal counsel (data-location constraints) |
| Q7 Markets/currencies | B | Business owner | Business owner + Legal counsel | Legal counsel; payment vendors *(ext.)* |
| Q8 Marketplace commission etc. | C | Business owner | Business owner + Legal counsel | Legal counsel; Finance |
| Q9 Teacher verification/liability | C | Operations lead | Business owner + Legal counsel | Legal counsel |
| Q10 Marketplace video provider | C | Technical lead | Business owner | Video vendors *(ext.)* |
| Q11 Minors/age gating | B | Legal counsel | Business owner | Legal counsel |
| Q12 UI brand name | A | Product owner | Business owner | — |
| Q13 PWA offline scope | C | Product owner | Business owner | Technical lead |
| Q14 Device matrix/lab | B | QA lead | Program manager | Device vendors/cloud lab *(ext.)* |
| Q15 Minimum launch scope | A | Curriculum lead | Business owner | Throughput pilot (§6.2) |
| Q16 Quality-gate thresholds | A | Localization lead | Business owner | Kyrgyz pilot (§6.3); reviewers *(ext.)* |
| Q17 Marketplace payment model | C | Legal counsel | Business owner | Payment vendors *(ext.)* |

### 2.2 Subscription decisions (20)
| ID | Gr | Owner | Approver | Evidence provider |
|---|---|---|---|---|
| U-01 Access without subscription | A | Product owner | Business owner | Finance (cost scenarios) |
| U-02 Existing free MVP users | A | Product owner | Business owner + Legal counsel | Technical lead (user base size, from local-only app: likely unmeasurable — **missing**) |
| U-03 Provider/entity/tax/consumer law | B | Finance | Business owner + Legal counsel | Payment vendors *(ext.)*; Legal counsel |
| U-04 Renewal mode | B | Product owner | Business owner | Payment vendors *(ext.)* |
| U-05 Retry/grace/Live in grace | B | Product owner | Business owner | Payment vendors *(ext.)* |
| U-06 AI fair-use values | B | Product owner | Business owner | AI pilot (§6.1) |
| U-07 Upgrade billing | B | Finance | Business owner | Payment vendors *(ext.)* |
| U-08 Downgrade timing | B | Product owner | Business owner | Legal counsel |
| U-09 Cancellation/refund | B | Product owner | Business owner + Legal counsel | Legal counsel |
| U-10 Cancelled-Live compensation | B | Operations lead | Business owner | Live pilot (§6.4) |
| U-11 Live materials after downgrade | B | Product owner | Business owner | — |
| U-12 Attendance history after downgrade | B | Data-protection role | Business owner + Legal counsel | Legal counsel |
| U-13 Marketplace vs subscription | C | Product owner | Business owner | — |
| U-14 Retention for expired accounts | B | Data-protection role | Business owner + Legal counsel | Legal counsel |
| U-15 Price-change policy | B | Finance | Business owner + Legal counsel | Legal counsel |
| U-16 Economics model/thresholds | A | Finance | Business owner | All quotes and pilots (§6.5, §6.1–6.4); independent reviewer *(ext. or uninvolved internal — missing)* |
| U-17 Offline lease length | C | Security lead | Business owner | Technical lead |
| U-18 Account sharing/device limits | B | Product owner | Business owner | Security lead |
| U-19 Billing timezone | B | Finance | Business owner | Legal counsel (entity location) |
| U-20 Meaning of "AI Tutor" | A | Product owner | Business owner + Legal counsel | AI pilot (§6.1) |

### 2.3 Live decisions (11 distinct; L-11 = U-11, L-12 = Q11, L-14 = U-10)
| ID | Gr | Owner | Approver | Evidence provider |
|---|---|---|---|---|
| L-01 Spoken language | A | Product owner | Business owner | Live feasibility pilot (§6.4); learner split data (**missing**) |
| L-02 Days/times/timezone/windows | B | Product owner | Business owner | Learner availability data (**missing**) |
| L-03 Live provider | B | Technical lead | Business owner | Streaming vendors *(ext.)*; quotes (§6.5) |
| L-04 Weekly materials workflow | A | Localization lead | Business owner | Live pilot (§6.4); Kyrgyz pilot (§6.3) |
| L-05 Realtime transport | B | Technical lead | Technical lead (technical choice) with Business owner informed | Load test (after provider shortlist) |
| L-06 Retention/attendance threshold | B | Data-protection role | Business owner + Legal counsel | Legal counsel |
| L-07 Level-band assignment | B | Product owner | Business owner | — |
| L-08 Watermarking | C | Product owner | Business owner + Legal counsel | Legal counsel |
| L-09 Schedule visibility | B | Product owner | Business owner | — |
| L-10 Host/moderator staffing | A | Operations lead | Business owner | Candidate hosts/moderators *(ext.)*; Live pilot (§6.4) |
| L-13 Live XP/badges | C | Product owner | Business owner | — |

### 2.4 Marketplace record P9-D (9) — all Group C, evidence mostly external
| ID | Owner | Approver | Evidence provider |
|---|---|---|---|
| D1 Markets/currencies | Business owner | Business owner + Legal counsel | Legal counsel |
| D2 Payment provider matrix | Technical lead | Business owner + Legal counsel | Payment vendors *(ext.)* |
| D3 Legal structure/funds | Legal counsel | Business owner | Legal counsel |
| D4 Commission/fees/tax | Finance | Business owner + Legal counsel | Legal counsel |
| D5 Refund/dispute/payout policy | Operations lead | Business owner + Legal counsel | Legal counsel |
| D6 Teacher verification policy | Operations lead | Business owner + Legal counsel | Legal counsel |
| D7 Marketplace video provider | Technical lead | Business owner | Video vendors *(ext.)* |
| D8 Data-protection basis | Data-protection role | Business owner + Legal counsel | Legal counsel |
| D9 Operational readiness | Operations lead | Business owner | Staffing evidence (**missing**) |

### 2.5 Audit-raised (A-01…A-14) and governance (G-01…G-05) — 19
| ID | Gr | Owner | Approver | Evidence provider |
|---|---|---|---|---|
| A-01 Sold vs released content | A | Product owner | Business owner + Legal counsel | Release matrix; throughput pilot |
| A-02 Paid sale in Kyrgyz | B | Localization lead | Business owner | Kyrgyz pilot (§6.3) |
| A-03 Entitlement failure policy/owners | A | Technical lead | Technical lead + Security lead | Design review (internal) |
| A-04 Subscription invariants/timeouts | A | Technical lead | Technical lead + Product owner | Payment vendors *(ext.)* for async-payment behaviour |
| A-05 Operations baseline | B | Operations lead | Business owner | Hosting vendors *(ext.)*; restore test |
| A-06 Data-protection regime/notices/breach | B | Data-protection role | Business owner + Legal counsel | Legal counsel |
| A-07 Security requirements | A | Security lead | Technical lead | Threat model (internal) |
| A-08 Sync conflict rules | C | Technical lead | Technical lead | Design review |
| A-09 Definition of "recording" | A | Product owner | Business owner + Legal counsel + Security lead | Legal counsel; Live provider capability |
| A-10 Engineering capacity | A | Program manager | Business owner | Staffing facts (**missing**); Technical lead estimates |
| A-11 P8b supporting scope | A | Product owner | Business owner | Operations lead |
| A-12 Reconnect/surge | A | Technical lead | Technical lead | Load test |
| A-13 Provider UI-locale criterion | B | Localization lead | Technical lead | Vendors' language-support statements *(ext.)* |
| A-14 Payments/outbox placement | A | Technical lead | Program manager + Business owner | Internal design review |
| G-01 Adopt G0 checklist and G0-a/G0-b split | A | Program manager | Business owner | — |
| G-02 Generated contract inventory | A | Technical lead | Technical lead | — |
| G-03 Corrected Marketplace baseline | A | Technical lead | Business owner | Independent doc review |
| G-04 Supersede FINAL review verdict | A | Program manager | Business owner | — |
| G-05 Low-severity doc fixes | C | Technical lead | Program manager | — |

**Count check:** 17 + 20 + 11 + 9 + 14 + 5 = **76**.

**Approval note.** Where "Technical lead" is shown as approver (A-03, A-04, A-07, A-08, A-12, G-02, L-05), the decision is a purely technical one; the business owner should still *be informed*, but I do not assume the business owner has delegated technical approval. Whether the business owner delegates these is itself a point to confirm in G0-a (§7, item 3).

---

## 3. Minimum decisions required before P0, P0b and P1

| Phase | Decisions that must be closed first | Basis |
|---|---|---|
| **P0** Safety net | **None.** Tooling choices (test runner, linter, CI) are ADR lines under the dependency policy (07 §11); they are technical-lead decisions, not part of the 76. | Readiness matrix: P0 READY, no blocking decisions |
| **P0b** PWA-lite | **None to build.** **Q12 (brand name)** must be closed before icons/manifest are *released*. | Readiness matrix: Q12 only |
| **P1** Progress integrity | **None to build.** Retention parameters (05 §4.4 [A]: results retention, tombstones) are proposals that must be confirmed before archival ships, but they are configuration values, not blockers. | Readiness matrix: none; condition on retention parameters |

Caveat: these conclusions rest on the earlier audit's readiness assessment. The first engineering task of each phase should include a short check that no new dependency on an OPEN decision was introduced.

---

## 4. Technical work: safe now vs dependent on open decisions

### 4.1 May begin immediately (no open decision changes what is built)
| Work | Phase | Notes |
|---|---|---|
| Test runner, linter, type-check CI, coverage reporting | P0 | Tooling ADR first |
| Dependency-boundary check in **report-only** mode; matrix from 07 §6.1 | P0 | Becomes errors in P2 |
| Content-validation skeleton on the existing content | P0 | Skeleton only; real gates need Q16 |
| Golden-fixture capture of the legacy `bilup-deutsch:v1` store | P0/P1 | Prerequisite for the migrator |
| Web manifest, shell-only service worker with kill-switch, installability gate | P0b | Use a provisional name; do not release icons before Q12 |
| `ActivityResult`, idempotent reward policy, permanent credit ledger, thin store, legacy migration | P1 | Per 03/05 |
| Static inventory of hard-coded text (input to P2/P3) | prep | Read-only analysis |
| Documentation correction pass for FA-06, 07, 16, 17, 22 | docs | Requires G-01/G-03/G-04 approval to adopt, but drafting can start; existing documents are *not* edited by this plan |

### 4.2 Must wait for decisions
| Work | Waits for |
|---|---|
| Four-settings model switched on / course registries (P2) | Q1, Q4, G-02 (contract inventory) |
| Content pipeline, release gates, Kyrgyz release (P3) | Q2, Q15, Q16, glossary, Track K people |
| Any tutor beyond the current mock | U-20, U-06, A-06 (if a model) |
| English course content (P7) | Q3, Q15, A-01 |
| Accounts, backend, sync (P8) | Q6, Q11, A-05, A-06, A-07, A-08 |
| Subscriptions/entitlements (P8b) | U-01…U-20 (group B parts), A-01…A-04, A-11, A-14, U-16, S-D |
| BilUp Live (P8c) | L-01…L-10, A-09, A-12, FA-19 requirements, L-D |
| Marketplace beyond fakes (P9) | A-14, G-03; P9-D for any real transaction |

### 4.3 Possibly begin early *with a business-owner decision*
Track K (translation) can start once Q2 names people and a glossary exists; it is not "safe now" because it spends money and depends on who the reviewers are.

---

## 5. Two-week G0-a preparation plan

Working days D1–D10. **No calendar dates are assumed.** Capacity of the available team is unknown (A-10), so the plan is sequenced by dependency, not by effort estimate; if roles remain unfilled, items slip and G0-a does not pass.

| Day | Activity | Output (measurable) | Roles |
|---|---|---|---|
| D1 | Business-owner session 1: review §2 map; assign **named accountable persons** to roles (recorded outside this file); confirm which approvals the business owner delegates (technical ones) | Role assignment record covering all 13 roles or an explicit "unfilled" list with a fill-by date | Business owner, Program manager |
| D1 | Decide **G-01** (adopt G0-a/G0-b and the G0 checklist) | Signed decision or amendment | Business owner |
| D1–D2 | Start P0 and P0b engineering (§4.1) | P0 task board created; tooling ADR drafted | Technical lead |
| D2 | Issue **evidence requests** (§6.5 and legal list in §9): quotes, legal-advice engagement, reviewer/host candidate searches | List of requests sent, each with owner and "needed by" in relative days | Finance, Legal counsel, Localization lead, Operations lead |
| D2–D4 | Prepare pilot protocols (§6) with success measures and stop criteria | Five written protocols approved by their owners | Pilot owners |
| D3 | Business-owner session 2 (decision session on the four critical items: **U-20, A-01, U-16 thresholds, L-01**) — *inputs only*: G0 plan §4 | Each marked APPROVED (with signed record) / DEFERRED (owner + relative deadline) / OPEN | Business owner |
| D3–D5 | Draft Q15 candidate scope and Q16 candidate thresholds as *proposals* for owner review | Two proposal papers | Curriculum lead, Localization lead |
| D4–D8 | Run the **short** pilots that can run in the window (§6.1 setup, §6.2 pilot start, §6.3 pilot start) | Pilot kick-off records; first measurements captured | Pilot owners |
| D5–D8 | Documentation correction drafts for FA-06, 07, 16, 17, 22 (drafts, not edits to the baseline until approved) | Draft change lists, each mapped to a finding | Technical lead, Program manager |
| D8 | Technical ownership table (A-03, A-04, A-07, A-11, A-12, A-14, G-02): proposed owner per item | Ownership table | Technical lead |
| D9 | Business-owner session 3: owners/approvers review; Q12 decided; Q1 and Q6 *direction* decided or deferred | Updated decision statuses | Business owner |
| D10 | G0-a review against §8 criteria; report what passed and what did not | G0-a review note (pass/fail per criterion) | Program manager |

**Realism warnings.** Quotes, legal advice and reviewer recruitment usually exceed two weeks; G0-a therefore only requires that they are *requested and tracked*, not received (§8). Pilots in §6 are **started** during G0-a and **completed** before G0-b; their duration is unknown until protocols are written.

---

## 6. Pilot activities (evidence for G0-b)

General rules: each pilot has a written protocol, a named owner role, a stop/redo condition, and its raw results stored with the economics model. No pilot result is treated as final until reviewed by someone not running it. **Targets/thresholds below are *proposals the business owner must set before the pilot runs* (so results cannot move the goalposts); this plan states the measures, not the numbers.**

### 6.1 AI Tutor cost and quality pilot
- **Purpose:** inform U-20, U-06, U-16. Only needed if a model-backed tutor (options 1 or 2 in the G0 plan) remains under consideration; if the owner chooses the rule-based assistant, this pilot is cancelled and replaced by a usefulness user test.
- **Owner:** Product owner; **evidence:** candidate model vendors *(ext., unnamed)*, native ky/ru reviewers.
- **Activities:** prepare a fixed set of representative learner questions per language/locale; run them through candidate approaches off-line in a sandbox (no real learner data, no production integration); have reviewers score answers.
- **Measurable outputs:** (a) tokens/units per request (mean, p90); (b) cost per request using *quoted* unit prices; (c) projected cost per active user per month at stated request counts, with the cap `L × c`; (d) correctness rate of grammar explanations as rated by reviewers per locale; (e) rate of unsafe/off-topic/incorrect-language answers; (f) Kyrgyz vs Russian quality difference; (g) latency distribution.
- **Pass/fail:** thresholds for (d)–(f) set by Business owner beforehand; failing in Kyrgyz means no Kyrgyz model tutor at launch.
- **Missing:** vendors, prices, reviewers, question set author.

### 6.2 Content production throughput pilot
- **Purpose:** replace the [A] productivity assumptions in 04 §13 → Q15, Q3, A-10, U-16.
- **Owner:** Curriculum lead; **evidence:** the content authors/reviewers *(ext. or internal, unnamed)*.
- **Activities:** have the actual proposed staff produce one defined unit slice end-to-end (pack format, translations, review, validator) under the real workflow, in German and (if staffed) English.
- **Measurable outputs:** person-hours per item type (word, grammar concept, exercise, reading/listening/writing/speaking item); review-pass rate on first submission; defects per 100 items found by reviewers; validator failure causes; extrapolated person-days for the Q15 candidate scope vs the 04 §13 assumptions (variance %); estimated Live weekly-materials effort (feeds L-04, currently *not* in 04 §13).
- **Pass/fail:** the extrapolated effort for the owner-approved minimum scope fits the staffed capacity; if not, scope or staffing changes (a decision, not a failure of the pilot).
- **Missing:** the staff themselves.

### 6.3 Kyrgyz localization quality pilot
- **Purpose:** Q2, Q16, A-02, G-ky thresholds, glossary.
- **Owner:** Localization lead; **evidence:** native Kyrgyz translator and two independent native reviewers *(ext., unnamed)*; Russian reviewer for comparison.
- **Activities:** translate a fixed sample (UI strings, instruction catalog items, grammar explanations, exercise feedback) to Kyrgyz; independent review per the 04 §7.3 gate process; build a draft glossary; run the provenance tests (02 §7) on the sample.
- **Measurable outputs:** critical-error count and minor-error rate in the reviewed sample (compared with the 04 §7.3 *proposal* of 0 critical, ≤ 2 % minor on a ≥ 20 % stratified sample — still a proposal); inter-reviewer agreement; terms needing glossary decisions; throughput (words/day reviewed and translated); items where Kyrgyz cannot express the concept without borrowing (listed, not judged here); provenance-test results.
- **Pass/fail:** thresholds set by Business owner with Localization lead before the pilot. I cannot assess Kyrgyz linguistic quality; only the named reviewers can.
- **Missing:** all reviewers; glossary authority.

### 6.4 BilUp Live teacher and language feasibility pilot
- **Purpose:** L-01, L-04, L-10, U-10, L-03 capability needs. **No recording** applies: the pilot is rehearsal-only, with test participants, on a provider free tier or sandbox if its terms permit; recording must be off and verified before starting. Whether a test provider meets the capability gate (`canDisableAutoRecording`) is part of what is being found out.
- **Owner:** Operations lead (with Product owner); **evidence:** candidate hosts/moderators *(ext., unnamed)*, a small volunteer audience of ky and ru speakers across level bands.
- **Activities:** (1) availability and rate check with candidate hosts for each language option (Kyrgyz-only, Russian-only, alternating, bilingual, target-language-with-localized-materials); (2) one rehearsal per promising option with a small mixed audience; (3) moderation drill (chat, Q&A, poll, removal of a disruptive participant); (4) weekly materials preparation timing in two locales.
- **Measurable outputs:** host availability/rates per option; comprehension score by level band and language group (short quiz); satisfaction (simple scale) by group; share of participants who could not follow; moderator actions per session and response time; materials preparation hours per week; provider capability findings (breakouts, auto-recording disable, join controls, language of provider UI).
- **Pass/fail:** thresholds set beforehand by Business owner; an option fails if a language group falls below the threshold or staffing cannot be found.
- **Not decided:** this pilot informs L-01; it does not decide it.
- **Missing:** hosts, moderators, volunteers, audience-size data.

### 6.5 Hosting, streaming and payment provider quotation collection
- **Purpose:** U-16, U-03, L-03, Q6, A-05, A-13. Not a pilot with users; a structured evidence collection.
- **Owner:** Finance (payments, economics), Technical lead (hosting, streaming); **evidence:** vendors *(ext., unnamed)*, Legal counsel.
- **Activities:** define a **common request template** (volumes from the five subscriber scenarios, KGS support, renewal modes, refunds, session size and audience, no-recording requirement, `ky`/`ru` UI support, data-location constraints); send to vendors found by the owners; record answers in a comparison sheet with date and currency; ask each vendor to confirm capabilities in writing.
- **Measurable outputs:** per vendor — fixed and percentage fees per transaction; pricing at each scenario volume; supported currencies/renewal modes; per-participant-hour or flat streaming price and concurrency limits; hosting price at base and surge load; recording disable evidence; UI language support; written confirmation present (yes/no). Count of vendors per category received (target is the owner's to set).
- **Pass/fail:** every cost category in G0 plan §4.3 has at least one sourced quote or an approved exclusion.
- **Missing:** vendor lists, which vendors serve Kyrgyz customers, KGS support facts (none are in any document).

### 6.6 Pilot dependencies and sequencing
Throughput (6.2) and Kyrgyz (6.3) pilots need Q2/Q3 staff; Live (6.4) needs a provider that can be tested (6.5 partial); AI (6.1) is conditional on U-20. If staff for 6.2/6.3 cannot be found in G0-a, **G0-b cannot be scheduled**. The economics model (U-16) consumes all five outputs and is therefore the last item of G0-b.

---

## 7. Business-owner approvals required (cannot be decided by this plan or by engineering)

1. **G-01:** adopt G0-a/G0-b split and the G0 checklist.
2. **Role fill:** identify accountable persons for the 13 roles (or accept that gaps will block specific decisions).
3. **Delegation:** which technical decisions (A-03, A-04, A-07, A-08, A-12, G-02, L-05) the Technical lead may approve alone.
4. **The four critical decisions:** U-20, A-01, U-16 thresholds, L-01 (inputs from G0 plan §4).
5. **Q12** brand name (needed before P0b release).
6. **Q15** minimum launch scope and **Q16** gate thresholds (after pilots) — proposals only in G0-a.
7. **Pilot thresholds** (set before running) and **budget** for pilots and for evidence collection (no budget is stated anywhere).
8. **Q2/Q3/L-10** staffing commitments.
9. Whether Premium Live is in the first commercial launch (changes the group of many Live decisions; G0 plan §3).
10. Authorisation to engage Legal counsel and external vendors for quotes.

---

## 8. G0-a acceptance criteria

G0-a passes only if **every** row is PASS; documentation alone never passes a row.

| # | Criterion | Pass condition | Evidence |
|---|---|---|---|
| 1 | G-01 decided | Signed approval or documented alternative from Business owner | decision record |
| 2 | Accountability complete | Every one of the 76 decisions has an owner role, approver role and evidence provider role **with a named accountable person recorded** for each role (names kept outside this repository file if preferred); unfilled roles listed with consequence and fill-by | assignment record |
| 3 | Delegations explicit | Business owner has stated which technical approvals are delegated | record |
| 4 | Foundation work started safely | P0 and P0b engineering started; no work from §4.2 started; P0 deliverables list agreed | task board; status note |
| 5 | Pilot protocols approved | §6.1–§6.5 protocols exist, each with owner, measures, thresholds set *before* running, stop criteria | approved protocols |
| 6 | Evidence requests issued | Requests sent for quotes, legal engagement, reviewer/host searches; each tracked with owner and relative due date | request log |
| 7 | Critical decision session held | The four critical items each have status APPROVED (signed), DEFERRED (owner + relative deadline) or OPEN (reason); **none is recorded as approved without a signed record** | session minutes |
| 8 | Pilots started or blocked-with-reason | Each pilot started, or explicitly blocked by a named missing resource | pilot status |
| 9 | Correction pass scoped | Draft change lists for FA-06, 07, 16, 17, 22 prepared | drafts |
| 10 | Budget and capacity statement | Business owner states available budget and team capacity for G0-b, or states that they are unknown (then G0-b cannot be scheduled) | statement |
| 11 | Register integrity | All 76 decisions still present, statuses accurate, no decision marked APPROVED without a signed record | register review by Program manager |

**G0-a does not prove commercial readiness.** It does not close any Group A or B decision by itself; those are closed in G0-b with the pilot evidence. A "fail" on rows 2, 5 or 10 delays G0-b but does not stop P0/P0b/P1.

---

## 9. External evidence providers still missing (no names invented)

| Needed evidence | Provider type | Currently identified in any document? |
|---|---|---|
| Legal advice: entity, tax/VAT, consumer/auto-renewal law, data-protection regime, minors | Legal counsel (external) | No |
| Payment processing quotes and capabilities for KGS | Payment vendors | No (07 §9: provider unknown by design) |
| Streaming/classroom vendor quotes and capability proof (no-recording, language, join controls) | Video vendors | No |
| Hosting quotes and data-location options | Hosting vendors | No |
| AI model quotes and quality samples (only if U-20 leads there) | Model vendors | No |
| Native Kyrgyz translator and two independent reviewers | Individuals/agency | No |
| Russian translator/reviewer | Individuals/agency | No |
| German/English authors, teachers, reviewers; pedagogical sign-off | Individuals | No |
| Live hosts and moderators | Individuals | No |
| Learner split (ky/ru), level distribution, availability times | Market data / owner knowledge | No; the current app is local-only and collects none |
| Number of existing MVP users (U-02) | Possibly unmeasurable | No |
| Independent economics reviewer | Role uninvolved in building the model | No |
| Device lab / cloud devices | Vendor or internal | No |
| Budget for pilots | Business owner | No |

**Missing owners:** every role in §1 is unfilled. The roles with the highest blocking effect on G0-a are Business owner, Program manager, Technical lead, Finance, Legal counsel, Localization lead and Curriculum lead.

---

## 10. Concise report

**Can begin immediately:** P0 safety net (tests, lint, CI, report-only boundary check, content-validate skeleton, legacy-store fixtures); P0b PWA-lite with a provisional name and no icon release; P1 progress integrity and storage; the read-only hard-coded-text inventory; drafting (not adopting) documentation corrections; preparing pilot protocols and evidence requests.

**Blocked:** P2 (Q1, Q4, G-02); P3 and Kyrgyz release (Q2, Q15, Q16, glossary, people); any tutor beyond the current mock (U-20); P7 English content (Q3, Q15, A-01); P8 backend/accounts (Q6, Q11, A-05–A-08); P8b subscriptions, P8c Live, P9 Marketplace and any commercial launch (the Group A/B decisions above and the S-D, L-D, P9-D records).

**Requires business-owner approval:** G-01; role assignment and delegations; U-20, A-01, U-16 thresholds, L-01; Q12; Q15/Q16 after pilots; pilot thresholds and budget; staffing commitments (Q2, Q3, L-10); whether Premium Live is in the first launch; authority to engage counsel and vendors.

**Status:** all 76 decisions remain **OPEN**. No decision was approved, no person or vendor was named, and no commercial readiness is claimed. No source code, dependency, existing document or historical audit was modified; this file is the only one created.
