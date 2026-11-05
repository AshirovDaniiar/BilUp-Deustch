# 09 — Online Teachers Marketplace

Part of the BilUp Til 2.0 set ([01](01_PRODUCT_ARCHITECTURE.md)). This is a **new product module**; nothing in it exists in the repository today **[V: no backend, auth, payments or video — grep and both reports]**. Everything below is **[R]** or **[A]/[F]** per the labels in 01 §0. **No real payments or video are implemented in this scope**; the module is designed behind provider ports (07 §9) and delivered in phase **P9** after the backend foundation **P8** ([08](08_MIGRATION_ROADMAP.md)).

---

## 1. Scope and principles

**Business model (approved):** open marketplace with **independent teachers** — teachers register, are verified, publish offers, set prices and availability; students discover and book; the platform takes a commission and handles payments, scheduling and the online classroom.

**Initial scope:** German and English teachers (`targetLanguage ∈ {de, en}`), explanation languages `ky`, `ru` (extensible via the registries of doc 02), CEFR levels from the configured level scale (A1–B2 initially; C1/C2 allowed as data), **individual (1-to-1) lessons**.

**Design principles**
1. **Separate aggregates:** TeacherProfile ≠ TeachingOffer ≠ Availability ≠ Booking ≠ Payment ≠ Lesson ≠ Payout (ADR-11, ADR-12).
2. **Separate lifecycles:** booking, payment, lesson and payout state machines are independent and linked by **domain events**, not by one status enum.
3. **Provider independence:** payments and video behind ports (07 §9).
4. **Same language model as learning:** filters use the language/locale/level registries (02) — no literals for levels or languages.
5. **Server-authoritative:** all marketplace state lives on the backend; the SPA is a client. No money/availability decisions on the client.
6. **Anti-double-booking by construction** (database constraints + holds, §8).
7. **Privacy and safety first** (§11); minors policy undecided (Q11).
8. **Future-ready, not built:** Marketplace group lessons and teacher packages/recurring-lesson bundles (§16) — these are **independent teachers' paid offers**, unrelated to BilUp Live and to BilUp subscriptions (11).
9. **Separate from subscriptions and BilUp Live** (§1.2): no Marketplace lesson, credit or discount is included in BilUp Basic or BilUp Premium Live; no shared entitlements, bookings, records or rooms with BilUp Live (10 §14, 11 §9).
9. **Modular monolith, no microservices** (07 §8).

### 1.1 Prerequisites for real transactions — decision record **P9-D** *(new — review H-2; user instruction)*
Until **every** item below is decided, written down and approved, the marketplace runs **only on fake and sandbox providers with no real money and no real video participants outside test accounts**. Real payments (any live charge, payout or refund) are forbidden by policy and by configuration (production payment credentials cannot be deployed without a signed P9-D record).

| # | Decision (must be approved) | Linked question | Why it blocks |
|---|---|---|---|
| D1 | **Target markets and currencies**; where students pay from, where teachers are paid to | Q7 | provider availability, licensing, tax, sanctions/compliance |
| D2 | **Payment-provider selection** with a **capability matrix** (07 §9 `capabilities()`): immediate capture, authorization-hold window, delayed transfer, split payouts, connected payees, refunds, dispute handling, payout countries | Q7, Q17 | the funds-flow in §12 is chosen *from the provider's actual capabilities* |
| D3 | **Legal structure**: merchant-of-record vs. agent/facilitator model; who may hold funds between payment and payout; required licences/registrations; terms of service for teachers and students | Q7, Q9 | determines whether the platform may hold funds at all and how refunds/disputes are borne |
| D4 | **Commission model** (percentage/tiers/minimums), whether fees are shown to the student or deducted from the teacher, **tax/VAT and invoicing/receipt** requirements per market | Q8 | price display, ledger content, receipts |
| D5 | **Refund, cancellation, no-show and dispute policy** with concrete windows; chargeback liability; payout schedule and holding period; negative-balance handling | Q8 | state machines and payout rules |
| D6 | **Teacher verification** policy approval (§5 criteria), including background checks and the **minors policy** | Q9, Q11 | trust, safety, liability |
| D7 | **Video provider** for Marketplace rooms (**recording is prohibited, not a policy choice** — 10 §9) | Q10 | classroom integration, privacy |
| D8 | **Data-protection basis**: roles of controller/processor, DPAs with providers, retention, cross-border transfers | Q7, Q9 | privacy compliance |
| D9 | **Operational readiness**: verification/moderation/support staffing, dispute handling, incident process | — | the marketplace cannot be operated without people |

Roadmap consequence (08 P9): P9a–P9c may proceed on fakes/sandboxes; **P9d (live pilot) is gated by P9-D approval, a security review and a legal review.**

### 1.2 Boundary with subscriptions and BilUp Live *(new in revision 3)*
The Marketplace is a **separate paid service**; it is neither part of **BilUp Basic (99 KGS/month)** nor of **BilUp Premium Live (149 KGS/month)** (11 §9) and it is **not BilUp Live** (10 §2).

| Rule | Consequence |
|---|---|
| No plan includes Marketplace lessons, credits or discounts | A Premium Live subscriber pays Marketplace prices; any future bundle needs explicit approval and a new plan version (11 §10.5) |
| Marketplace booking authorization does **not** read subscription state | Whether an account needs *any* subscription to book is **unresolved (11 U-13)**; until decided, the architecture treats booking as independent of subscriptions |
| Separate money | Marketplace bookings, commission, refunds and payouts use records and reconciliation separate from subscription invoices; both use the shared low-level `payments` module but with a different `PaymentPurpose` |
| Separate rooms and roles | Marketplace lesson rooms and `ClassroomProvider` configuration are separate from Live rooms; a Live host/moderator is not a Marketplace teacher |
| No recording | The no-recording rule (10 §9) applies to Marketplace lessons as well |
| Code isolation | `marketplace/*` does not import `live/*` or `subscription/*` (01 §4.2) |

---

## 2. Roles and module map

| Role | Capabilities (summary) |
|---|---|
| **Student** | browse/search teachers, view profiles/offers/reviews, book, pay, join classroom, cancel/reschedule per policy, review completed lessons, booking history |
| **Teacher** | apply and verify, manage profile, create/edit offers, manage availability, accept/decline (if manual confirmation enabled), conduct lessons, view earnings/payouts, respond to reviews |
| **Admin** | verify/reject teachers, moderate profiles/reviews, handle disputes/refunds, configure commission/policies, view audit logs, suspend accounts |

A user can hold `student` + `teacher`. Roles are server-side attributes; client UI hints are never authoritative.

**Backend modules — target boundary map (07 §8):** `identity`, `profile`, `catalog` (teacher profiles, offers, search projection), `availability`, `booking`, marketplace money records built on the **shared `payments` module** (provider adapters, purpose-tagged transactions, webhooks, reconciliation — introduced in P8b for subscriptions, 11 §14) (and `payouts` only if the chosen provider model requires our own payout orchestration), `classroom` (owns the **Lesson** aggregate — see §9.3), `reviews`, `moderation`, with `notifications` and `admin` as shared services until they own data. These are **introduced stage by stage in P9a–P9c** (07 §8 "Module layout"; the shared `payments` module, outbox and job runner already exist from P8b); the list is a map of intended boundaries, not a day-one deliverable.

**Frontend module:** `marketplace/*` (layer L4). Under the single dependency policy (01 §4.2, matrix in 07 §6.1) it imports only `shared/contracts`, `platform`, `ui` and `languages`; it consumes `AuthPort`, `SettingsPort` and `ApiClientPort` as **contracts wired in `app`** and has **no import edge to `core`, `engine`, `features` or `content`**. There is **no recommendation port**: learning surfaces link to the marketplace with a plain route link (e.g. `/teachers?lang=de&level=B1`) whose parameters the learner can see and edit; the marketplace never reads learner progress, and no progress data leaves the device without explicit consent (§11). *(Revised — review M-5, X-1.)*

---

## 3. Domain model (overview)

```
User ─┬─ StudentAccount
      └─ TeacherAccount ── TeacherProfile ── VerificationCase ── Document
                               │
                               └── TeachingOffer(s) ── PricingTerms, CancellationPolicy
TeacherAccount ── AvailabilityRule(s), AvailabilityException(s), CalendarConnection[F]
Booking (student, teacher, offer snapshot, slot) ── Payment(s) ── Refund(s)
Booking ── Lesson ── Attendance, ClassroomSession
Teacher ── Payout ── LedgerEntry
Booking ── Review ── ModerationCase
Dispute (booking-scoped)
```
Ledger entries are the financial source of truth (§12). Every aggregate has an owner module; cross-module references are by id only.

---

## 4. Teacher profiles and offers (separate aggregates)

### 4.1 TeacherProfile (who the teacher is)
```ts
// illustrative contract — not implemented
interface TeacherProfile {
  teacherId: string; userId: string;
  displayName: string; avatarRef?: string;
  headline: Localized<string>;            // user-generated; see 4.3
  bio: Localized<string>;
  languagesTaught: LanguageCode[];        // registry-validated ('de','en' initially)
  languagesSpoken: { locale: LocaleCode; proficiency: string }[];   // explanation-capable locales
  countryOfResidence?: string; timezone: string;                    // IANA zone id
  experienceYears?: number; qualifications: Qualification[];        // each with verification status
  introVideoRef?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'suspended';
  visibility: 'hidden' | 'public';        // approved + visible
  ratingSummary: { count: number; average: number };   // projection from reviews
}
```
- The profile has **no price, no schedule, no CEFR range** — those belong to offers/availability.
- A teacher edits a draft; changes to sensitive fields (qualifications, name) may re-trigger review; publishing requires `approved`.

### 4.2 TeachingOffer (what the teacher sells)
```ts
interface TeachingOffer {
  offerId: string; teacherId: string;
  kind: 'individual' | 'group' | 'package' | 'teacher_subscription';   // only 'individual' implemented; others [F] (§16). NOT a BilUp subscription (11)
  targetLanguage: LanguageCode;
  levelRange: { from: LevelId; to: LevelId };       // from the language's level scale; no literals
  explanationLocales: LocaleCode[];                 // languages the teacher can explain in for this offer
  focus: string[];                                  // conversation, exam prep, business, kids…  (tag registry)
  title: Localized<string>; description: Localized<string>;
  durationMinutes: number;
  price: { amountMinor: number; currency: string };  // minor units; currency ISO-4217
  capacity: { min: 1; max: 1 };                      // generalises to groups [F]
  cancellationPolicyId: string;                      // versioned policy (§9.1)
  trialLesson?: { enabled: boolean; price?: Money; durationMinutes?: number };
  bookingMode: 'instant' | 'request';
  leadTimeMinutes: number; maxAdvanceDays: number;
  status: 'draft' | 'active' | 'paused' | 'archived';
  version: number;                                   // immutable snapshot is copied to bookings
}
```
- A teacher has **many offers** (e.g. German A1–A2 in Russian; English B1–B2 in Kyrgyz).
- Price changes affect new bookings only: a booking stores an **offer snapshot** (price, duration, policy version).

### 4.3 User-generated text and the language policy
Bios/offers are written by teachers in their own language(s). They are tagged `Localized<T> = { [locale]: T }` or a single `contentLocale`; the UI shows the text **in the language written, with a language badge**. The marketplace never machine-translates or substitutes another locale silently (consistent with 02 §5.1 rule 5). Filters on **explanation locale** use the structured `explanationLocales` field, not free text.

---

## 5. Verification

Teacher states: `draft → submitted → under_review → approved | rejected` ; `approved → suspended → approved` (reinstated).
- **Inputs [A]:** identity document, qualification evidence, optional intro video, payout details (collected only by the payment provider's onboarding, not stored by us).
- **Verification case** records checks, reviewer, decision, reason (localised message key), timestamps; audit-logged.
- **Visible trust signals** on profiles: "Identity verified", "Qualification reviewed", "Interview passed" — shown only when true; labels are chrome (`uiLocale`).
- **Re-verification** triggers: document expiry, complaints, payout provider requirements, a scheduled periodic review (e.g. yearly **[A]**).
- **Depth of checks (background checks, minors)** and liability are legal questions (Q9, Q11) **[A]** — the criteria below are **proposals for approval in P9-D (§1.1, D6)**, not legal advice.
- Payout eligibility requires provider onboarding completion (KYC by provider) in addition to platform approval.

### 5.1 Approval criteria (proposed checklist) **[R/A]** *(new — review R-4)*
A teacher may be `approved` and publish offers only when **all required** criteria are met. Each check is recorded as pass/fail with reviewer, evidence reference, timestamp and reason.

| # | Criterion | Required | Evidence / method | Fail → |
|---|---|---|---|---|
| V1 | **Identity**: legal name matches a valid government ID; liveness/selfie match where the identity provider supports it | required | ID document + provider or manual check | reject; resubmit allowed |
| V2 | **Adult and eligible**: age ≥ 18; eligible to work/offer services as declared; not on the platform's suspended/banned list | required | declaration + checks | reject |
| V3 | **Target-language competence** for each `targetLanguage` offered: evidence of C1/C2-level (or native) proficiency — certificate of a recognised exam *or* teaching degree *or* documented native status confirmed at interview | required per language | certificate/degree copy; interview | reject for that language only |
| V4 | **Teaching qualification or experience** — at least **one** of: (a) a language-teaching certificate/degree, (b) a university degree in languages/linguistics/education, (c) documented teaching experience (≥ a stated number of hours with references) | required | documents/references; ops maintain the **accepted-credentials list** (examples: recognised teaching certificates and exam-body credentials for German and English) **[A: list to be approved by operations]** | reject or request more evidence |
| V5 | **Explanation-language competence** for each `explanationLocale` the teacher claims (e.g. Kyrgyz, Russian): demonstrated at interview or by a language check by a reviewer who speaks that locale | required per locale | interview with a Kyrgyz-/Russian-speaking reviewer (staffing: 04 §13.5 style resource) | remove that locale from the offer |
| V6 | **Teaching-ability check**: a short live sample lesson / structured interview (a pre-recorded applicant video, if accepted, is an application document — never a recording of a platform lesson) (e.g. 15–20 min) scored against a rubric (clarity, CEFR-level adaptation, error correction, interaction) | required for new teachers | rubric score ≥ threshold **[A]** | reject / reapply after a period |
| V7 | **Profile quality and safety**: real photo, accurate bio, no contact details or off-platform solicitation, no prohibited content; offers match claimed qualifications | required | reviewer checklist + automated checks | request edit |
| V8 | **Policy acceptance**: terms, code of conduct, cancellation/no-show rules, privacy notice | required | recorded consent with version | block publishing |
| V9 | **Payout onboarding** completed with the payment provider (KYC by the provider) | required before the first payout (not before approval) | provider status | payouts blocked |
| V10 | **Background/safeguarding check** | **depends on the minors policy and local law** (P9-D, D6) | local certificate/check | per policy |

**Outcomes and process:** `approved` (with badges for V1, V4/V6 outcomes), `rejected` (with reason code and a localized explanation), `needs_info` (case stays open with a due date). **Appeal:** one appeal per rejection, reviewed by a second reviewer. **SLA** (target response time) and **reviewer capacity** are operational decisions (P9-D, D9). **Suspension triggers:** verified complaints, fraud signals, repeated no-shows, expired evidence. All decisions are audit-logged and reviewable by an admin with a different identity from the original reviewer.

---

## 6. Search and discovery

**Filters (first release):** `targetLanguage`, **CEFR/level** (matches offers whose `levelRange` covers the learner's level — level ids and ordering from the scale registry), **explanation locale**, price range & currency, rating, availability window (day/time in learner's timezone), lesson duration, offer focus tags, trial available, verified only.
**Sort:** relevance (language/locale/level match first), rating, price, soonest availability.
**Defaults from learner settings:** `targetLanguage`, `explanationLocale` (from `core/settings`), and level from the active course (via the recommendation port, user-confirmed).

Implementation **[R]**:
- Start with PostgreSQL (indexed columns + `GIN` on arrays/tags + full-text for bios); a dedicated search engine is not needed at MVP volumes **[A]** (revisit if catalog or latency demands).
- Search reads a **denormalised `catalog_search` projection** updated from domain events (profile approved, offer changed, availability horizon, rating changed).
- Availability-aware search uses precomputed "next available slot" per teacher/offer, refreshed on availability and booking events (eventually consistent; **final availability is always revalidated at booking time**, §8).
- Pagination (keyset), result caching with short TTL, abuse/rate limits, SEO-friendly public profile pages are a later concern **[F]**.
- Ranking must not hide non-matching-language results without telling the user: "no teachers in Kyrgyz for this level" is a visible empty state with alternatives, not a silent switch to Russian.

---

## 7. Availability and scheduling

- **Time model:** all instants stored as **UTC**; each teacher has an IANA `timezone`; learner's timezone from the device/profile; UI always shows zone abbreviation/offset. DST transitions handled by generating slots from *rules in the teacher's zone*, then converting.
- **Availability = rules + exceptions:**
  - `AvailabilityRule`: weekly recurrence (`weekday`, `startLocalTime`, `endLocalTime`, `timezone`, `validFrom/To`).
  - `AvailabilityException`: blocked dates/ranges or extra windows.
  - **External calendar sync [F]** (`CalendarConnection` port) — busy times imported; not in MVP.
- **Slot generation:** slots are **computed** (rule expansion ∩ offer duration/lead time/max advance − existing bookings/holds − exceptions) over a rolling horizon; not stored as free-standing rows except as optional cache. This avoids "ghost slots" and simplifies rescheduling.
- **Buffers:** configurable minutes between lessons.
- **Lead/cutoff rules** per offer; booking window limits.
- **Teacher dashboards** show a calendar with bookings, holds and exceptions.

---

## 8. Booking engine and anti-double-booking

### 8.1 Flow (instant booking)
1. Student selects offer + slot (start instant in UTC).
2. `POST /bookings` with **idempotency key**: server validates (offer active, teacher approved/visible, within lead/advance, learner is not the teacher, learner has no overlapping active booking).
3. In **one DB transaction**: (a) **lazily expire** any stale `pending_payment` hold that overlaps the requested range (`UPDATE … SET status='expired' WHERE held_until < now() AND range && requested`), (b) check the per-student hold limits (§8.1a), (c) insert the booking `pending_payment` with a **hold** `held_until = now + holdTtl`; the database rejects overlaps (§8.2).
4. **Payment is initiated and captured at booking** (§12.2; *no* long-lived authorization is relied on for lessons weeks away). On provider confirmation (webhook), booking → `confirmed`; the hold becomes the confirmed booking. On failure/timeout, booking → `expired`/`cancelled` and the slot becomes free.
5. Notifications to both parties; lesson record + calendar entries created.

`bookingMode: 'request'`: booking is `requested` (no money, **no slot hold**) → teacher accepts within an SLA (→ `pending_payment` with a fresh hold, subject to availability re-check) or declines/expires.

### 8.1a Unpaid booking hold policy **[R/A]** *(new — review R-5)*
A hold reserves a slot **only while the student completes checkout**. It must not be usable to block a teacher's calendar.

| Rule | Default (proposed, configurable) |
|---|---|
| Hold TTL (`holdTtl`) | **10 minutes** from creation; **one automatic extension up to 20 minutes total** only while the provider reports an in-flight payment step (e.g. strong-customer-authentication challenge) — no extension otherwise |
| Max concurrent holds per student | **2** (across all teachers); **1** per teacher per student |
| Max holds per student per teacher per day | 3 |
| Abuse cooldown | **3 expired/abandoned holds within 24 h → 30-minute booking cooldown** for that student (escalating) |
| Per-IP/device limits | rate limits on `POST /bookings` and on hold creation (07 §10); suspicious patterns flagged to admin |
| New accounts | stricter limits until the first completed lesson or verified payment method |
| Teacher visibility | a hold is shown to the teacher as "pending checkout", never as a booking; it carries no obligation for the teacher |
| Expiry mechanics | expiry job sets `expired` at `held_until`; **in addition** every booking attempt performs the lazy expiry in §8.1 step 3, so correctness never depends on the job having run (an exclusion constraint cannot reference `now()`, so expiry must be a state change, not a query filter) |
| Payment after expiry | handled in §8.2 (auto-refund or re-confirm within a short grace window) |

All values are **[A]** product/ops decisions to confirm in P9-D (D5/D9) and are stored as configuration, not code.

### 8.2 Concurrency guarantees **[R]**
| Risk | Mechanism |
|---|---|
| Two students book the same teacher slot | PostgreSQL **exclusion constraint** on `(teacher_id WITH =, tstzrange(start_at, end_at + buffer) WITH &&) WHERE status IN ('pending_payment','confirmed', …active…)`; the second insert fails atomically — correctness does not depend on application checks |
| Same student double-booked (overlapping lessons with different teachers) | second exclusion constraint on `(student_id, tstzrange)` for active bookings |
| Duplicate submission / retry / double click | idempotency key unique per `(student_id, key)`; replays return the first outcome |
| Payment succeeds after hold expiry | payment webhook handler checks booking state; if expired and slot taken → **automatic refund** + notify; if slot still free → re-confirm within a short grace policy **[A]** |
| Webhook duplicates/out-of-order | event-id dedupe table; state machines accept only valid transitions; handlers are idempotent |
| Concurrent availability edit vs. booking | availability changes cannot cancel confirmed bookings; removing a window with existing bookings requires explicit handling (cancel with policy or block) |
| Hold leakage | expiry job **plus lazy expiry inside every booking transaction** (§8.1 step 3) — an exclusion constraint cannot use `now()`, so expired holds must be *transitioned* to `expired`, never merely filtered; periodic reconciliation; hold limits (§8.1a) |
| Buffer changes | the buffer used by the constraint is **stored on each booking row** (`end_at + buffer_at_booking`), so a teacher changing their buffer later never retroactively conflicts with existing bookings; the `btree_gist` extension is required for the mixed equality/range constraint |
| Race in reschedule | reschedule is "create new booking + cancel old" in one transaction with the same constraints, linked by `rescheduledFrom` |
| Clock skew | server time only; no client timestamps trusted |

### 8.3 Cancellation and rescheduling
Governed by **versioned CancellationPolicy** captured in the booking snapshot (e.g. full refund if > X h before start; partial/none after; teacher-initiated cancellation → full refund + possible penalty). Concrete defaults are a business decision (Q8).

---

## 9. Lifecycles — four separate state machines

State changes in one machine are communicated to others through **domain events** (outbox, introduced with the first asynchronous need — now P8b, 07 §8) and handled by that module's own policies; no module writes another's state directly.

### 9.1 Booking lifecycle (module `booking`)
```
requested ──accept──► pending_payment ──payment_authorized/confirmed──► confirmed ──lesson_completed──► completed
   │ decline/expire        │ hold_expired / payment_failed                │ cancel_by_student / cancel_by_teacher
   ▼                       ▼                                              ▼
 declined / expired     expired                       cancelled_by_student | cancelled_by_teacher
                                                     confirmed ──no_show_student / no_show_teacher──► no_show_*  (terminal; outcome decided by policy + evidence)
                                                     confirmed ──reschedule──► rescheduled (terminal; new booking linked)
                                                     any non-terminal ──dispute_opened──► (dispute flag; booking state unchanged)
```
`instant` bookings start at `pending_payment`; `request` bookings start at `requested`. Terminal states: `completed, declined, expired, cancelled_*, no_show_*, rescheduled`.

### 9.2 Payment lifecycle (marketplace money records on the shared `payments` module, purpose `marketplace_booking`; per payment attempt)
```
requires_payment_method → requires_action → authorized → captured → partially_refunded | refunded
          │                       │              │ (void)
          └──► failed             └──► failed    └──► canceled
captured/refunded ──► disputed (chargeback) ──► dispute_won | dispute_lost
```
Payment state reflects **provider reality**, reconciled via webhooks and polling.

**Authorization vs. capture — corrected default** *(revised — review H-2)*. Card authorizations are valid only for a limited, provider- and scheme-specific period (days, not weeks — verify with the chosen provider **[A]**), while lessons can be booked weeks ahead. Therefore the marketplace **does not rely on authorize-now/capture-later across the gap between booking and lesson**. The default is:

1. **Charge at booking confirmation** (single-step payment: customer authentication if required, then capture). The authorization step exists only *inside checkout*, within the hold TTL (§8.1a). `authorized` is a transient state of that checkout, not a place where money waits for weeks.
2. After capture, the money is in the **"captured, not yet available to the teacher"** funds state. Refunds for cancellations follow the cancellation policy (§8.3) as ordinary refunds. The funds state machine is `captured → held_for_lesson → available → paid_out` (see §9.4 and §12.2); **who holds the money** during `held_for_lesson` (the platform's balance, a provider-managed split/delayed-transfer feature, or an escrow-like provider product) is decided by the legal/provider record **P9-D (D2, D3)** — the domain model is the same in each case.
3. To limit exposure for far-future lessons the offer has `maxAdvanceDays` (default **30 [A]**); longer-horizon bookings and **deferred charge** (save the payment method and charge N days before the lesson) are **[F]**, require provider support for off-session payments and strong customer authentication handling, and are not part of P9a–P9c.
4. Teacher cancellation/no-show → full refund; student cancellation → refund per policy; refunds, partial refunds and chargebacks are in the lifecycle above; refund of the platform commission is a policy value (P9-D, D5).
5. The `PaymentProvider.capabilities()` contract (07 §9) lets the domain pick the strategy: `supportsImmediateCapture` is required; `supportsAuthHold`/`maxAuthWindowDays` are only used for the short checkout; `supportsDelayedTransfer` decides whether funds can stay with the provider until payout.

### 9.3 Lesson lifecycle (owned by module `classroom`; booking consumes its events)
```
scheduled → room_ready (T–15 min) → in_progress (first join) → ended → (completed | incomplete)
scheduled → missed (nobody joined by grace period) ; in_progress → interrupted → resumed
```
Attendance records `teacherJoinedAt`, `studentJoinedAt`, durations. `completed` requires minimal attendance thresholds (policy) — this is what the booking module consumes as `lesson_completed`/`no_show_*` events.

### 9.4 Payout lifecycle (module `payouts`; per teacher batch/item)
```
accruing (earned) → available (after hold/dispute window) → scheduled → processing → paid
                                                           └──► failed (→ retry/manual) ; held (compliance/dispute) ; reversed (clawback)
```

### 9.5 Mapping across machines (event-driven)
| Event | Reactions |
|---|---|
| `PaymentConfirmed` | booking `pending_payment → confirmed`; create lesson (`scheduled`); notify |
| `HoldExpired` | booking → `expired`; cancel any open payment intent |
| `LessonCompleted` | booking → `completed`; payment funds → `available` (after hold); enable review |
| `StudentNoShow` | booking → `no_show_student`; teacher payout per policy |
| `TeacherNoShow` | booking → `no_show_teacher`; refund student; teacher penalty/flag |
| `CancelledByStudent/Teacher` | booking terminal; refund calculation via policy → `payments`; free slot |
| `RefundIssued` | ledger entries; payout adjustment/clawback if already paid |
| `DisputeOpened` | freeze related payout amount; moderation case |

---

## 10. Authorization and security

**Model:** RBAC + **resource ownership** (ABAC rules) enforced in the backend for every endpoint; deny by default.

| Resource | Student | Teacher | Admin |
|---|---|---|---|
| Public profile/offer (approved) | read | read | read |
| Own profile/offers/availability | – | create/update own only | read/modify with audit |
| Booking | read/cancel **own** | read/accept/decline/cancel **own** (as the booked teacher) | read all; refund/override with reason |
| Payment details | own receipts only | own earnings only | read; actions audited |
| Classroom join token | only for own booking within join window | only for own booking | support access logged |
| Reviews | create for own completed booking; edit/delete own within window | respond to reviews about self | moderate |
| Verification documents | – | upload own | read/decide (restricted, logged) |

Controls **[R]**:
- Object-level checks on every id in the URL/body (**prevent IDOR**): ownership is verified server-side, not via client role.
- Admin actions require MFA and are written to an **immutable audit log** (who, what, before/after, reason).
- Rate limits and abuse detection on search, booking, messaging, review endpoints; CAPTCHA/risk checks on registration and payout-detail changes **[A]**.
- Idempotency keys on state-changing endpoints; optimistic concurrency (`version`) on profile/offer edits.
- Webhooks: signature verification, replay protection, IP allowlists where supported.
- Separation of duties: finance/payout actions separate from moderation roles.
- Secrets/keys server-side only (07 §10); the SPA holds a session, never provider secret keys.
- **Payment security:** no PAN/CVV storage or logging; hosted fields/redirect (PCI scope reduction **[A: confirm with provider]**); amounts computed server-side from the offer snapshot (never trusted from client); reconciliation job comparing provider balances to the ledger; refund/payout limits and anomaly alerts.
- **Fraud/abuse:** self-booking prevention, review manipulation checks (reviews only after completed bookings), off-platform contact leakage detection in messages **[F]**, collusion monitoring.
- **Messaging [F/Q]:** student–teacher chat is out of scope for MVP; booking-scoped notes only. Any messaging requires moderation and reporting tools.

---

## 11. Privacy, safety and compliance

**Data classes:** account identifiers, teacher identity documents (high sensitivity), payout identifiers (held by the provider), booking history, lesson attendance, reviews, learner CEFR level shared with teachers (only if the learner opts in).

| Topic | Design **[R]** |
|---|---|
| Data minimisation | teachers see only what is needed to teach (display name, chosen level/goals note, timezone); no email/phone exposure by default; learning progress is **not shared** unless the learner explicitly shares a summary |
| Consent | explicit consent for sharing level info, for marketing; consent records stored with version/timestamp |
| Rights | export and deletion workflows (`profile` module) with legal-retention exceptions (financial records); account deletion anonymises reviews/bookings as required |
| Retention | documents deleted after verification period/retention policy; **no lesson recordings exist** (10 §9) |
| Minors | whether under-18 learners are allowed, guardian consent and teacher safeguards are **undecided (Q11) [A]** — until decided, registration requires an adult-age attestation |
| Jurisdiction | applicable laws (data protection, consumer, tax/VAT, payment licensing, marketplace liability) depend on markets (Q7/Q9) **[A]**; the architecture isolates policy values (commission, tax, currency, refund windows) in configuration |
| Security of media | classroom tokens short-lived, single-use/room-bound; **no recording of any kind (global rule, 10 §9)**; provider data-processing agreements **[A]** |
| Transparency | prices shown incl./excl. fees as required; clear cancellation policy before payment; verified-badge meaning explained |
| Safety | report/block mechanisms, moderation queue, teacher suspension, incident log |
| Logs | no PII/payment data in application logs; access to logs restricted |

---

## 12. Payments, commission and payouts

> Legal/financial structure (merchant of record vs. agent, licences, tax) is **unresolved (Q7, Q8) [A]**. The design keeps these as pluggable policy and provider capabilities.

### 12.1 Pricing and fees
- Teacher sets the offer price (minor units + currency). **Commission** is computed server-side from a **versioned `CommissionPolicy`** (e.g. percentage with optional minimum/tiers per teacher/offer/promotional rules) captured in the booking snapshot. Whether fees are shown added to the student's price or deducted from the teacher's earnings is a product decision (Q8).
- Taxes/VAT and multi-currency handling are configuration-driven; FX is avoided by charging in the offer currency where the provider allows **[A]**.

### 12.2 Money flow (conceptual, provider-neutral) **[R/A]** *(revised — review H-2, O-5)*
> **Illustrative until P9-D (§1.1) is approved.** The flow below is chosen *from the provider's actual capabilities and the legal model*; it is not a commitment to hold funds on the platform.

1. Student pays at booking confirmation: `PaymentProvider` **captures `gross` in one step** (§9.2); no reliance on long-lived authorization.
2. Funds state after capture: `captured → held_for_lesson`. *Who holds the funds* is **decided by D2/D3**: (a) provider-managed delayed transfer / split payment (provider ledger is authoritative); (b) platform-held balance (requires a legal structure that permits holding third-party funds); (c) escrow-like provider product. The domain records the funds state either way.
3. **Financial records** — sized to the model: if the provider is authoritative (a), we keep **per-booking financial records** (gross, commission, net, refunds, provider references) and reconcile against provider reports; a full **double-entry ledger** (`student_payment`, `platform_commission`, `teacher_payable`, refunds, payouts) is built **only if** the chosen model (b/c) makes the platform responsible for balances. This decision is part of P9c, after provider selection, not before.
4. After `LessonCompleted` and the dispute window, the teacher's net becomes `available`.
5. **Payout:** provider transfer/payout to the teacher's onboarded account (or our payout orchestration if D2/D3 require it); failures are retried, then handled manually; negative balances (payout already made, later chargeback/refund) follow the clawback/netting rule decided in D5.
6. Refunds follow §8.3/§9.2; refund of the platform commission is a policy value (D5).
7. **Reconciliation** daily: provider reports ↔ our records; mismatches raise alerts and block payouts for the affected bookings.

### 12.2a Real-transaction prerequisites
No live charge, payout or refund before **P9-D** is approved (§1.1). Sandbox providers (with configurable capabilities in the `FakePaymentProvider`) are used for P9b–P9c; P9d (pilot) needs the signed decision record, a security review and a legal review.

### 12.3 Integrity rules
- Ledger is the source of truth for balances; payment/payout state mirrors provider state.
- All provider calls carry idempotency keys; webhooks verified and deduplicated.
- Amounts are integers in minor units; rounding rules are explicit and tested.
- No money moves in the SPA; sandbox/fake provider in P9 (no real funds).
- Payouts require teacher onboarding completion and no open compliance hold.

---

## 13. Online classroom integration

- **Port `ClassroomProvider`** (07 §9): `createRoom(bookingId, config)`, `issueJoinToken(role, userId, ttl)`, `endRoom`, `getRoomState`, webhook handlers (`participant_joined/left`, `room_ended`). **No recording operation exists on the port (revision 3, 10 §7, §9).**
- **Flow:** at `T–N min` the system creates the room and unlocks the **Join** button for both parties (state `room_ready`); tokens issued on demand only to booking participants within the join window; attendance events update the lesson lifecycle (§9.3).
- **Fallback:** if the provider fails, support path: re-create room, extend lesson, or mark `interrupted` and compensate per policy; telemetry on join failures.
- **Feature flags:** whiteboard/screen share/chat are provider capabilities exposed through `ClassroomCapabilities`; the core marketplace works with video only.
- **Bridge to learning [F]:** a teacher could assign homework referencing course content ids (read-only link into the Learning Engine) — via a port; not in MVP.
- **Locale:** classroom UI chrome in `uiLocale` where the provider SDK supports it **[A]**.

---

## 14. Reviews and moderation

- Reviews only by students with a **completed** booking with that teacher (one per booking), rating 1–5 + text; teacher may publicly reply; edit window; reviews are aggregated into `ratingSummary` (projection).
- **Moderation:** automated checks (profanity/PII/contact details), user reports, admin queue; actions: approve, hide, remove with reason; appeal path; all actions audit-logged. Review text is user-generated: language-tagged, sanitized, rendered as text.
- Anti-manipulation: rate limits, minimum-lesson thresholds for ratings to influence ranking, detection of reciprocal/self-reviews.
- Dispute flow: student reports a problem within a window → case → admin decision (refund/partial/none) → events (§9.5).

---

## 15. Dashboards and histories

| Surface | Content |
|---|---|
| **Student: booking history** | upcoming/past/cancelled bookings, receipts, join links, cancel/reschedule actions, "book again", leave review |
| **Teacher dashboard** | upcoming lessons, calendar, requests, earnings (available/pending/paid), payout history, ratings/reviews, profile & offer management, verification status |
| **Admin console** | verification queue, moderation queue, disputes/refunds, user/teacher search and suspension, commission/policy configuration (versioned), financial reports/reconciliation, audit log viewer |

Responsive behaviour per doc 06 §4 (rail/two-pane on tablet, week grid on expanded). All lists use server pagination; all times shown with zone.

---

## 16. Future extensions (designed for, not implemented) **[F]**

| Extension | How the design accommodates it |
|---|---|
| **Group lessons** | `TeachingOffer.kind='group'`, `capacity.max > 1`; a `LessonSession` (one instance on the teacher's calendar) with many `Booking`s/`Enrollment`s; the booking exclusion constraint applies to the *session* range, seat counting uses a separate capacity counter with a transactional guard; per-seat payments reuse payment lifecycle; minimum-attendance and cancellation-by-teacher rules in policy |
| **Teacher packages / `teacher_subscription` offers** | `kind='package'` or `'teacher_subscription'`: a *teacher's* bundle of lessons or recurring lessons with its own credit records inside the Marketplace (credits, validity); booking consumes a credit instead of a payment, with ledger entries for deferred revenue. **Unrelated to BilUp Basic / BilUp Premium Live (11), which never include Marketplace lessons or credits** |
| Recurring lessons | series of bookings generated from a recurrence rule, each an independent booking with shared `seriesId` |
| Calendar sync | `CalendarConnection` port |
| Messaging | moderated booking-scoped chat |
| Recording | **prohibited (not a future feature)** — no recording, replay or storage of any lesson (10 §9) |
| Multi-currency payouts, regional providers | provider routing in `payments` |
| C1/C2 offers | no change — level scale data |

Because lifecycles are separate (§9) and offers have `kind`/`capacity`, none of these requires redesigning existing aggregates.

---

## 17. API, events and frontend integration

- **REST (OpenAPI)** under `/api/v1/marketplace/...`: `GET /teachers`, `GET /teachers/{id}`, `GET /offers/{id}/availability`, `POST /bookings`, `POST /bookings/{id}/cancel`, `GET /me/bookings`, `POST /bookings/{id}/review`, teacher: `PUT /me/teacher-profile`, `POST /me/offers`, `PUT /me/availability`, `GET /me/earnings`; admin: `/admin/...` (separate auth scope).
- **Events (outbox):** `TeacherApproved`, `OfferPublished`, `BookingRequested/Confirmed/Cancelled/Completed`, `PaymentConfirmed/Failed/Refunded`, `LessonStarted/Ended`, `ReviewPosted`, `PayoutPaid`, `DisputeOpened`.
- **Frontend module:** routes `/teachers`, `/teachers/:id`, `/book/:offerId`, `/me/bookings`, `/classroom/:bookingId`, `/teacher/*` (dashboard), `/admin/*` (separate bundle recommended); data via `ApiClientPort` + query cache; payment UI via provider-hosted components behind an adapter; all strings via catalogs (`uiLocale`); user-generated text language-badged.
- **Feature flag:** `marketplace.enabled`; nav item appears only when enabled (06 §4.1).

---

## 18. Delivery phases and tests

Marketplace delivery is **P9** (MVP) and **P10** (expansion) in [08](08_MIGRATION_ROADMAP.md); prerequisites: P8 (identity, profile, API, sync boundary), P5 (responsive shell), decisions Q7–Q11 closed.

| Stage | Contents |
|---|---|
| **P9a – Catalog** | teacher onboarding, profiles, offers, verification workflow, admin queue, search (no booking) |
| **P9b – Booking (fake payments)** | availability, booking engine with holds/constraints, fake payment & classroom providers, notifications, student history, teacher dashboard |
| **P9c – Provider integration (sandbox)** | real provider adapters in sandbox only, ledger, payout dry-runs, reviews/moderation, disputes |
| **P9d – Pilot** | limited real launch **only after the P9-D decision record (§1.1) is approved**, plus legal/compliance sign-off and a security review |
| **P10** | Marketplace group lessons, teacher packages/`teacher_subscription` offers, recurring lessons, calendar sync (none of these is a BilUp subscription or BilUp Live) |

**Tests required:** state-machine unit tests (every valid/invalid transition for booking, payment, lesson, payout); **concurrency tests** (parallel booking of one slot from N clients → exactly one success; idempotent retry; hold expiry races) against a real PostgreSQL in CI; webhook replay/out-of-order tests; ledger invariants (sum of entries = 0 per booking; no negative balances); authorization matrix tests (every endpoint × role × ownership, IDOR attempts); timezone/DST tests; search filter tests using language/locale/level registries; provider contract tests run against fake and sandbox adapters; Playwright flows (search → book → pay (fake) → join → review) in `ky` and `ru`; load test of search and booking; security tests (OWASP ASVS checklist, dependency scan, secrets scan); accessibility tests on booking/payment forms; privacy tests (export/delete).

## 19. Open items (see 01 §9)
All of D1–D9 in §1.1 (decision record P9-D) are **prerequisites for real transactions**: Q7 markets/currencies/provider availability · Q8 commission, payout schedule, refund policy, tax · Q9 verification depth/liability (criteria proposed in §5.1) · Q10 video provider and recording · Q11 minors · Q17 payment model · hold values in §8.1a and grace periods **[A]** · accepted-credentials list for V4 **[A]** · whether messaging is needed for MVP · teacher onboarding capacity (admin staffing for verification/moderation).
