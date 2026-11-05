# 11 — Subscription and Pricing Architecture

Part of the BilUp Til 2.0 set ([01](01_PRODUCT_ARCHITECTURE.md)). **Status:** new in revision 3. Integrates the newly approved two-plan subscription model. Labels as in 01 §0.1: **[V]** verified in the repository, **[R]** recommendation, **[A]** assumption, **[F]** future. Anything that the business has *not* approved is listed in §16 as an **unresolved decision (U-nn)** and is **not** silently decided here.

> **Scope guard.** This is architecture documentation only. No subscription, billing, payment or Live code exists or is created by this document. **[V]** The repository contains no backend, no accounts, no payment code and no subscription concept (both earlier reviews; `grep` for `fetch`/env use finds nothing).

---

## 1. Business model

BilUp Til sells **access**, not individual lessons, through **two monthly subscription plans**, in **KGS**:

| Plan | Code | Price (initial) | Summary |
|---|---|---|---|
| **BilUp Basic** | `basic` | **99 KGS / month** | The entire self-study platform |
| **BilUp Premium Live** | `premium_live` | **149 KGS / month** | Everything in BilUp Basic **plus** two weekly BilUp Live sessions (German and English) |

Rules fixed by the business (approved):
1. **BilUp Basic includes:** German and English courses A1–B2, lessons, vocabulary and grammar, exercises and assessments, reading/listening/writing/speaking activities, AI Tutor (subject to fair-use limits), spaced repetition and vocabulary revision, student dashboard and progress tracking, daily learning activities. **It does not include BilUp Live.**
2. **BilUp Premium Live includes everything in Basic**, plus: a weekly **German** Live lesson and a weekly **English** Live lesson, each **60 minutes**, one teacher per session for potentially hundreds of students, all levels A1–B2 in the same stream with differentiated tasks for A1–A2 and B1–B2, interactive polls/quizzes/chat/Q&A/speaking challenges, attendance tracking, access to educational materials.
3. **Both weekly sessions are included in the 149 KGS price. They are not sold separately.** There is no per-language Live add-on.
4. **BilUp Live is never recorded and has no replay** (10 §9). No recording library, no recording entitlement.
5. **The Online Teachers Marketplace is a separate paid service** and is **not** included in either plan (§9).
6. Prices live in **configurable plan definitions** (§10), never in application code.

The terminology in this document is binding across all documents: **BilUp Basic / Basic**, **BilUp Premium Live / Premium Live**, **BilUp Live / Live** (the weekly classes), **subscription**, **entitlement**, **plan version**, **invoice**, **payment transaction**.

---

## 2. Subscription plans

### 2.1 What a plan is (and is not)
A **Plan** is a configurable product definition. It is *not* a code branch. Application logic never tests `plan === 'premium_live'`; it asks an entitlement question ("may this account use `live.de`?"), §3 and §10.4.

| Aspect | Basic | Premium Live |
|---|---|---|
| Billing interval | month | month |
| Price (initial `PlanVersion` 1) | 99 KGS = 9,900 minor units | 149 KGS = 14,900 minor units |
| Entitlement set | `basic` grants (§3) | `basic` grants **plus** Live grants (§3) |
| Inclusion rule | — | *Includes Basic* is modelled as an explicit grant list that contains the Basic grants, so a plan version can be read on its own (§10.2) |

Currency: **KGS** (ISO 4217), amounts stored as integers in minor units (the minor unit's decimal places must be confirmed against the ISO 4217 table and the payment provider in implementation **[A]**).

### 2.2 Plan versions
Plans change over time (prices, limits, included features). Therefore **every commercial attribute lives on an immutable `PlanVersion`**. A price change creates a new version; existing subscription instances and invoices keep pointing at the version they were created under (§10.3). This is what allows price changes "without modifying historical subscription records".

---

## 3. Entitlement matrix

### 3.1 Entitlement keys (catalog)
Entitlements are **named capabilities**, defined in a configurable catalog, granted by plan versions (and optionally by overrides/promotions). Keys follow `<area>.<capability>`; some take a **scope** (e.g. a course id, a language). Code checks keys, never plan codes.

| Key | Meaning | Scope |
|---|---|---|
| `selfstudy.access` | use the self-study platform (dashboard, daily activities, progress) | — |
| `course.access` | open a course and its content | `courseId` or `*` (e.g. `de-general`, `en-general`; levels come from the course manifest, not from the entitlement) |
| `srs.revision` | spaced repetition and vocabulary revision | — |
| `assessment.use` | placement tests, level tests, unit tests | — |
| `activity.reading` / `.listening` / `.writing` / `.speaking` | skill labs | — |
| `tutor.ai` | AI Tutor | **limits** from a `UsagePolicy` (§11) |
| `live.de` | join the weekly German BilUp Live session | — |
| `live.en` | join the weekly English BilUp Live session | — |
| `live.chat` | send chat messages in a Live session | — |
| `live.interact` | answer polls/quizzes, submit Q&A questions, take part in speaking challenges | — |
| `live.materials` | access Live educational materials | — |
| `live.attendance.view` | view own Live attendance history | see U-12 |
| `marketplace.book` | book Marketplace lessons | **not granted by any plan**; see §9 and U-13 |

### 3.2 Matrix
`✓` granted · `✗` not granted · `Limited` granted subject to a configurable limit · **U** depends on an unresolved decision (§16).

| Capability | No active subscription | **BilUp Basic** | **BilUp Premium Live** |
|---|---|---|---|
| Self-study platform (dashboard, daily activities, progress) | **U-01** | ✓ | ✓ |
| German course access (A1–B2) | **U-01** | ✓ | ✓ |
| English course access (A1–B2) | **U-01** | ✓ | ✓ |
| Lessons, vocabulary, grammar, exercises | **U-01** | ✓ | ✓ |
| Vocabulary and spaced-repetition revision | **U-01** | ✓ | ✓ |
| Assessments (placement, level, unit tests) | **U-01** | ✓ | ✓ |
| Reading, listening, writing, speaking activities | **U-01** | ✓ | ✓ |
| AI Tutor usage | **U-01** | **Limited** (fair use, §11) | **Limited** (same or higher limit — **U-06**) |
| **German Live access** | ✗ | **✗** | **✓** |
| **English Live access** | ✗ | **✗** | **✓** |
| Live chat | ✗ | ✗ | ✓ (moderated; slow-mode may apply) |
| Live polls and quizzes | ✗ | ✗ | ✓ |
| Live Q&A and speaking challenges | ✗ | ✗ | ✓ |
| Live materials | ✗ | ✗ | ✓ (after downgrade/expiry: **U-11**) |
| Live attendance history (own) | **U-12** | **U-12** (for history created while on Premium Live) | ✓ |
| Joining a Live session **with only a join URL** | ✗ | **✗** | ✗ (a URL alone is never sufficient; §8) |
| Live recording / replay / recording library | **✗ — not offered in any plan, by design** | ✗ | ✗ |
| **Marketplace booking** | independent of subscriptions — **U-13** | independent — **U-13** | independent — **U-13**; **no Marketplace lessons or credits are included** |

"No active subscription" covers never-subscribed, expired and cancelled accounts. The architecture supports a **configurable entitlement set for that state** (for example a trial, a preview or a free tier) **without code changes**; **whether one exists is unresolved (U-01)** and is not assumed here. The existing local MVP (free, anonymous, local-only) is a related question (U-02).

### 3.3 Rules that follow from the matrix
1. **Basic cannot join Live even if it holds a valid-looking URL.** Live rooms are not reachable by URL; every join is a server-side decision that issues a short-lived, user-bound token (§8, 10 §6).
2. Premium Live includes **both** languages; there is no `live.de`-only plan.
3. Entitlements are evaluated **server-side** (§13). The frontend uses them only to render UI (upsell, disabled buttons); `localStorage` content is never evidence of entitlement.
4. Plan membership is **additive**: Premium Live = Basic grants + Live grants, modelled as data.

---

## 4. Five independent concepts (domain model)

The following must be represented **independently**, with their own identifiers, lifecycles and storage:

```
Plan ─1:n─► PlanVersion          (definition: price, interval, entitlement grants, policies)      immutable once published
Subscription                     (instance: account × plan version × period × status)             mutable by events
   └─ Invoice ─1:n─► InvoiceLine (a charge for a period; snapshots plan version price at creation)
        └─ PaymentTransaction    (a payment attempt/result with the provider; refunds are transactions)
EntitlementSet (derived)         (what an account may do *now*; computed from subscriptions + overrides)
```

| Concept | Owns | Does **not** own |
|---|---|---|
| **Plan / PlanVersion** | code, display names (localized), interval, price (minor units, currency), entitlement grants, `UsagePolicy` references, grace and retry policy, effective dates | any customer data |
| **Subscription** | account id, plan version id, status, period start/end, `cancelAtPeriodEnd`, scheduled change, renewal mode, promo reference | price (read from plan version/invoice), payment status |
| **Invoice** | period, lines (plan version id, unit price snapshot, quantity, discounts), totals, invoice status | payment mechanics |
| **PaymentTransaction** | provider reference, amount, currency, **payment status**, idempotency key, failure code, refund links | subscription status |
| **EntitlementSet** | effective grants and limits with `validUntil` and reason list | billing state (it is *derived*) |

Statuses are **separate state machines**: *subscription status* (§5), *invoice status*, *payment status* and *entitlement validity* are different things linked by events (§5.4). This is the same discipline as the marketplace's booking/payment/lesson/payout machines (09 §9).

---

## 5. Subscription lifecycle

### 5.1 Subscription status
```
 (checkout started)                                   renewal paid
 pending_payment ──first payment succeeded──► active ◄───────────────────┐
      │ timeout / abandoned / failed                │   │ renewal payment fails
      ▼                                             │   ▼
   expired (never activated)                        │  past_due ──paid within grace──► active
                                                    │   │ grace elapsed / retries exhausted
          user cancels (cancelAtPeriodEnd=true)     │   ▼
          ─ status stays `active` until period end ─┤  expired
                                                    ▼
                                      period ends without renewal ─► canceled (if user-cancelled) | expired (if lapsed)
```
- **`cancelAtPeriodEnd` and `scheduledChange` are fields, not statuses**, so "active but ending" and "active with pending downgrade" need no extra state.
- `trialing` and `paused` are **[F]** (not defined by the approved model; adding them is a configuration/state extension).
- Terminal states: `canceled`, `expired`. A returning customer creates a **new subscription instance** (history preserved).

### 5.2 Billing periods
- **Monthly** interval. Period boundaries are stored as **UTC instants**. Month arithmetic uses calendar months anchored on the activation instant with **end-of-month clamping** (a subscription activated on the 31st renews on the last day of shorter months). The business time zone for *display* and for any "billing day" wording is configurable **[A]**; the **billing instant** is the source of truth.
- **Activation** occurs when the first invoice is `paid` (payment confirmed), not when checkout starts. Entitlements start at activation.
- **Renewal modes** (provider-capability dependent, **U-04**): `automatic` (stored payment credential, charge at period end) or `manual` (reminders, the learner pays each period; access runs for the paid period). The architecture supports both; which is available depends on what the chosen provider can do in KGS, which is **unknown** (no provider is chosen; §7).

### 5.3 Failed payments, grace and expiry
Configurable on the plan version (`GracePolicy`, §10.2):
- **Retry schedule** (for `automatic`): a list of retry offsets from the due date (e.g. several attempts over a few days). Values are product policy (**U-05**).
- **Grace period:** a number of days after the period end during which the subscription is `past_due` and entitlements follow the configured **grace scope** — `all`, `basic_only` (Live suspended), or `none`. **Whether Live continues in grace is unresolved (U-05).**
- **Expiry:** when grace ends or retries are exhausted the subscription becomes `expired`; entitlements end; learner data (progress, saved items, history) is **retained** (retention for expired accounts: **U-14**).
- **Notifications** (chrome in `uiLocale`): payment failed, grace ending, expired, renewal reminder for `manual` mode.
- **Idempotent dunning:** the retry job is keyed by `(invoiceId, attemptNo)`.

### 5.4 Cross-machine mapping (events)
| Event | Subscription | Invoice | Payment | Entitlement |
|---|---|---|---|---|
| Checkout created | `pending_payment` | `open` | `initiated` | none |
| Payment succeeded (first) | → `active`, period set | → `paid` | `succeeded` | grants from plan version |
| Renewal invoice created | unchanged | `open` | — | unchanged |
| Renewal paid | period advanced | `paid` | `succeeded` | unchanged |
| Renewal failed | → `past_due` (at due date) | `open` | `failed` | per grace scope |
| Grace elapsed | → `expired` | `uncollectible` / `void` | — | removed |
| User cancels | `cancelAtPeriodEnd = true` | none | — | until period end |
| Period ends after cancel | → `canceled` | — | — | removed |
| Refund issued | per refund policy (**U-09**) | `refunded`/credit note | `refunded`/`partially_refunded` | per refund policy |
| Chargeback/dispute | flagged | flagged | `disputed` | per policy **[A]** |

---

## 6. Upgrade, downgrade, cancellation, refunds, reconciliation

### 6.1 Upgrade: Basic → Premium Live
**Mechanism (decided):** a `SubscriptionChange` request creates a *scheduled or immediate* change from plan version A to plan version B. The **billing treatment is a configurable `ChangePolicy`**.
**Business policy (not approved — U-07):** options, none chosen here:

| Option | Charge at upgrade | New period | Live access starts | Notes |
|---|---|---|---|---|
| **A. Immediate, prorated difference** | difference × remaining fraction of the period | unchanged | on payment confirmation | simplest billing; requires a rounding rule |
| **B. Immediate, credit unused + new period** | full new price − credit for unused Basic time | restarts now | on payment confirmation | resets the billing day |
| **C. At next renewal** | none now | unchanged until renewal | next period | no proration; delays Live |
| **D. Immediate, no charge until renewal** | none now | unchanged | immediately | revenue leakage; rarely advisable |

*Illustration only (the arithmetic of approved prices, not a policy):* upgrading on day 10 of a 30-day period leaves 20/30 of the period. Option A: 50 KGS × 20/30 = 33.33 KGS (rounding rule needed). Option B: credit 99 × 20/30 = 66 KGS; net 149 − 66 = 83 KGS for a new 30-day period.
**Constraints that hold under any option:** (1) entitlement change is applied **only after payment confirmation**; (2) the upgrade takes effect for the **next Live session that has not yet started** — a participant is never added to a session already in progress by an upgrade made after its start (**[R]**, simplifies access control); (3) the operation is **idempotent** (idempotency key).

### 6.2 Downgrade: Premium Live → Basic
Default **[R]**: takes effect **at the end of the paid period**; Live access continues until then because it has been paid for; `scheduledChange` is stored. Immediate downgrade with refund is a policy variant (**U-08**). After the change takes effect: Live entitlements end; Basic entitlements continue; Live materials and attendance history follow **U-11/U-12**.

### 6.3 Cancellation
Default **[R]**: `cancelAtPeriodEnd`. Immediate cancellation with a refund is policy (**U-09**). Cancellation never deletes learning progress.

### 6.4 Refunds
Refunds are **payment transactions** linked to invoices. The *policy* (cooling-off window, partial refunds, refunds when a scheduled Live session is cancelled, treatment of Live attendance already used) is **unresolved (U-09, U-10)**. The architecture requires: a refund is always initiated by an authorized actor (admin or automated policy), is idempotent, audit-logged, reconciled, and states its effect on subscription and entitlements explicitly.

### 6.4a Platform-cancelled Live sessions
Because Live is never recorded and has no replay, a cancelled session cannot be "watched later". Compensation (substitute session, credit, extension, none) is **unresolved (U-10)**; entitlement logic must not assume any of them.

### 6.5 Payment reconciliation
- **Daily reconciliation job** compares provider settlement/transaction reports with `PaymentTransaction` records and invoices. Mismatch classes: *unknown payment* (money at provider, no transaction), *missing confirmation* (webhook lost → poll provider), *amount/currency mismatch*, *duplicate*, *refund not mirrored*. Each class has an alert and a documented manual procedure.
- **Webhook handling** is signature-verified, idempotent by provider event id, order-tolerant, and processed through the same handler as polling.
- **Entitlement safety:** a payment seen at the provider but not yet reconciled **does not** grant access until confirmed; a confirmed payment later reversed triggers the refund/dispute path.
- Reconciliation is specified in 07 §9 (provider port) and is part of the acceptance of P8b.

---

## 7. Payment abstraction

**No payment provider is chosen or implied** (decision U-03). All integration sits behind a **port** (`PaymentProvider`, 07 §9). Provider capabilities are declared, not assumed.

### 7.1 Capabilities needed by subscriptions
`capabilities()` (extends the marketplace list, 07 §9): `supportsKgs`, `supportsRecurringCharge` (stored credentials), `supportsHostedCheckout`, `supportsRefundFull`, `supportsRefundPartial`, `supportsWebhooks`, `supportsTransactionReports` (for reconciliation), `supportsIdempotencyKeys`, `settlementCurrencies[]`, `fixedFeeMinor`/`percentFee` (as reported by the provider contract, for finance modelling only). If `supportsRecurringCharge` is false the platform operates in **`manual` renewal mode** (§5.2).

### 7.2 Operations
`createCheckout(invoice, returnUrls)`, `chargeStoredCredential(invoice)` (only if supported), `getTransaction(ref)`, `refund(transaction, amount)`, `verifyWebhook(request)`, `listTransactions(range)`. The port is **purpose-tagged** (`PaymentPurpose = 'subscription' | 'marketplace_booking'`) so the shared infrastructure can serve both without mixing their money (§9).

### 7.3 Rules
- Amounts are computed **server-side** from the invoice snapshot; the client never supplies an amount.
- No card data on our servers/logs (provider-hosted fields or redirect; PCI scope reduction **[A]** to confirm with the provider).
- Every money-moving call carries an idempotency key.
- A `FakePaymentProvider` (configurable capabilities, including "no recurring") is used in P8b development and CI; real credentials cannot be deployed before decision record **S-D** (§15.3).

---

## 8. BilUp Live access control (summary; full design in 10 §6)

1. **Server-side only.** The frontend never decides access. `POST /live/sessions/{id}/join` (authenticated) → `EntitlementPort.check(account, 'live.de' | 'live.en', session)`; deny → `403` with a localized reason code (upsell message is chrome in `uiLocale`).
2. **No public join URLs.** Rooms exist only at the provider and are reachable **only with a token** issued by our backend: **short-lived, bound to the account and the session, single-use or refresh-limited**, role-scoped (participant / moderator / host). The provider must support token-based participant identity; a provider that only offers a shareable room URL **cannot be used** for Live (capability gate, 07 §9).
3. **Link-sharing resistance:** token TTL of minutes **[A]**, one active connection per account (a second join evicts the first), participant identity claim visible to moderators, anomaly flags (many tokens per account/IP). Residual risk — a bearer token shared inside its TTL window — is documented in 10 §6.4; it is reduced, not eliminated.
4. **Re-check on token refresh;** loss of entitlement does not require ejecting an already-running participant mid-session unless moderation or policy demands (**U-05** for grace; default **[R]**: let the current session finish, deny the next join).
5. **Per-language gate:** German session requires `live.de`; English session requires `live.en`. Premium Live grants both.
6. **Basic and unsubscribed accounts are denied** by the same check; no code path joins a room without it.
7. Marketplace lessons use a **different** room/token flow and different entitlement logic (§9).

---

## 9. Marketplace separation

The Online Teachers Marketplace (09) remains a **separate paid service**.

| Aspect | Subscriptions (this document) | Marketplace (09) |
|---|---|---|
| What is sold | access (monthly) to self-study and BilUp Live | an individual teacher's lesson, per booking |
| Price set by | the platform (plan version, 99/149 KGS) | each independent teacher (offer price) |
| Money flow | platform revenue | student → platform → teacher (commission, payouts) |
| Records | `Subscription`, `Invoice`, `PaymentTransaction` (billing) | `Booking`, `Payment`, payout records (09 §9, §12) |
| Entitlement | plan grants (§3) | **none**: booking is paid per lesson; no plan includes marketplace lessons or credits |
| Rooms | BilUp Live rooms (mass, 10) | marketplace lesson rooms (small, 09 §13) |
| Refunds | subscription refund policy (U-09) | marketplace cancellation/dispute policy (09 §8.3, §12) |
| Providers | `PaymentProvider` (purpose `subscription`) | `PaymentProvider` (purpose `marketplace_booking`) + payout capabilities |

Rules: (1) **Premium Live does not include Marketplace lessons, credits or discounts**; any future bundle requires explicit approval and a new plan version. (2) Marketplace money never touches subscription invoices and vice-versa; financial records and reconciliation are **per purpose**. (3) A learner's subscription state is never an input to Marketplace booking authorization **unless U-13 decides otherwise**. (4) BilUp Live is **not** a Marketplace lesson and its host is not a Marketplace teacher (10 §2). (5) The shared low-level payment infrastructure (provider adapters, transaction store, webhooks) is a **shared `payments` module** used by both; domain records stay in `billing` and in the marketplace modules respectively (§14).

---

## 10. Pricing configuration

### 10.1 Principle
No price, currency, interval, entitlement grant, usage limit, grace period or retry schedule appears as a literal in application code. They are **configuration data** stored in plan definitions (database in P8b; seed file in development). Lint/test rule (§15.2): no numeric price literals and no plan-code comparisons outside the `billing` and `entitlements` modules.

### 10.2 Plan definition (illustrative schema)
```ts
// illustrative contract — not implemented
interface PlanDefinition {                 // mutable only in metadata; commercial terms are in versions
  planId: string; code: 'basic' | 'premium_live' | string;
  status: 'active' | 'retired';            // retired plans cannot be sold but existing subscriptions continue
  display: Localized<{ name: string; tagline: string; bullets: string[] }>;  // chrome, per uiLocale; user-facing copy goes through the locale gates
}
interface PlanVersion {                    // IMMUTABLE once published
  planVersionId: string; planId: string; version: number;
  effectiveFrom: Instant; effectiveTo?: Instant;
  interval: { unit: 'month' | 'year'; count: number };           // 'year' is [F]
  price: { amountMinor: number; currency: 'KGS' | string };
  grants: EntitlementGrant[];              // explicit, includes the Basic grants for premium_live
  usagePolicies: Record<EntitlementKey, UsagePolicyRef>;          // e.g. tutor.ai → fair-use policy (§11)
  gracePolicy: { graceDays: number; scope: 'all' | 'basic_only' | 'none'; retryOffsetsHours: number[] };
  changePolicyId: ChangePolicyRef;         // proration/refund behaviour (U-07/U-08/U-09)
  renewal: { modes: ('automatic' | 'manual')[] };
  eligibility?: EligibilityRule;           // e.g. promo-only, region, [F]
}
interface EntitlementGrant { key: EntitlementKey; scope?: string | '*'; limits?: Record<string, number | string> }
```

### 10.3 Price changes and history
- Changing a price = publishing **PlanVersion n+1** with an `effectiveFrom`. Nothing in version n, in existing subscriptions, in issued invoices, or in payment transactions is edited.
- Invoice lines **snapshot** `{planVersionId, unitPriceMinor, currency}` at creation, so reports are reproducible after any later change.
- **What happens to existing subscribers when the price changes is unresolved (U-15):** (a) grandfather until cancellation, (b) move to the new version at the next renewal with advance notice, (c) hybrid. Legal notice requirements for consumer price changes are **[A]** (to confirm).
- Price changes are admin actions: two-person approval **[R]**, audit-logged, effective-dated; a published version cannot be deleted.

### 10.4 Using entitlements in code
Features call `EntitlementPort.check(account, key, scope?)` (backend) or read the signed `EntitlementSnapshot` (frontend, advisory). A check returns `{allowed, limits?, reason}`; `reason` is a **reason code** (never a plan name) that the UI maps to localized chrome. Where a new feature needs gating, a new **key** is added to the catalog and granted by plan versions — **no code change in the plan layer**.

### 10.5 Promotions and annual plans (extensibility, not built) **[F]**
- **Promotional codes/discounts:** `Promotion` (type percent/amount, duration, eligibility, redemption limits, validity) applied as **discount lines on invoices**; they change what is charged, **not** entitlements or plan versions. Redemptions are idempotent and abuse-limited.
- **Annual subscriptions:** a plan version with `interval.unit = 'year'` (separate plan version, its own price); upgrade/downgrade policies for annual↔monthly are additional `ChangePolicy` entries.
- **Other currencies:** a plan version may carry per-currency price lists later; KGS remains the initial and only currency.
- **Bundles with Marketplace credits:** would be a new plan version plus a new entitlement key; it requires explicit approval (§9).

---

## 11. AI Tutor fair-use policy (configurable product policy)

**[V]** Today the tutor is a rule-based mock with no marginal cost (03 §9). A remote LLM tutor is **[F]** (03 §9, 07 §10). The approved plans promise "AI Tutor, subject to fair-use limits"; therefore usage control is part of the entitlement design. **What "AI Tutor" means at launch (mock vs real model) is unresolved — U-20; no phase currently delivers a real model.**

### 11.1 Policy as data
```ts
// illustrative contract — not implemented
interface UsagePolicy {
  policyId: string; version: number;
  metric: 'messages' | 'requests' | 'tokens' | 'cost_units';   // what is counted
  windows: { unit: 'day' | 'week' | 'month'; softLimit?: number; hardLimit: number }[];
  perRequest: { maxInputChars?: number; maxOutputUnits?: number };
  burst?: { maxPerMinute: number };
  onSoftLimit: 'warn' | 'none';
  onHardLimit: 'block' | 'degrade_to_rule_based' | 'queue';
  resetAt: 'rolling' | 'calendar_in_zone';
  zone?: string;                                                // IANA zone for calendar windows, configurable
  appliesTo: EntitlementKey;                                    // tutor.ai
}
```
- Referenced from the plan version (`usagePolicies['tutor.ai']`), so **limits can differ by plan and change by version** without code changes. **No numeric limit is hardcoded.**
- **Recommended structure [R]** (values are for the business to set from measured cost, **U-06**): a daily soft limit with a visible meter, a daily or monthly hard limit, a per-request size cap, and a burst cap; on hard limit prefer **`degrade_to_rule_based`** over a hard stop for Basic learners so study is never blocked entirely.
- **Technical protection ≠ product limit:** infrastructure rate limiting (abuse, DoS) is separate from the product fair-use policy and not user-configurable.

### 11.2 Metering
Server-side `UsageCounter` per `(account, key, window)`, incremented on **successful** tutor responses, idempotent per request id; counters are read by the same `EntitlementPort` decision (`limits` + `remaining`). The tutor proxy (07 §10: provider keys server-side) is the only place that calls an AI provider. The UI shows remaining allowance (chrome, `uiLocale`) and what happens at the limit.

### 11.3 Cost ceiling
With a hard limit `L` per account per window and unit cost `c` (unknown), the **maximum AI cost per account** is `L × c`; maximum total ≈ `active tutor users × L × c`. Choosing `L` is therefore a **margin decision**, which is why it is a product policy (§12).

---

## 12. Financial assumptions and illustrative scenarios

> **Nothing below says the model is profitable.** Revenue figures are arithmetic on the two approved prices. **No provider price, salary, fee, tax rate, exchange rate, conversion rate or churn rate is known or invented.** All costs are **unknown (U-16)** until quantified.

### 12.1 Terms
- **Gross billings** (what is charged): `B × 99 + P × 149` KGS per month, with `B` Basic and `P` Premium Live subscribers. Not net revenue: no tax, payment fees, refunds, chargebacks or failed renewals have been deducted.
- **ARPU** (average gross billing per subscriber) = `99 + 50 × p` KGS where `p` = Premium Live share. Premium Live's **incremental** gross billing over Basic is **50 KGS per Premium Live subscriber per month** — the amount that has to fund the Live programme's incremental costs (plus whatever share of other costs the business allocates to it).

### 12.2 Revenue scenarios — gross monthly billings (KGS)
Each cell = `N × (99 + 50·p)`. Subscriber split shown as Basic/Premium Live.

| Total subscribers (N) | 0 % Premium Live (all Basic) | 10 % Premium Live | 30 % Premium Live | 50 % Premium Live | 100 % Premium Live |
|---|---|---|---|---|---|
| **500** | 500 B / 0 P = **49,500** | 450 B / 50 P = **52,000** | 350 B / 150 P = **57,000** | 250 B / 250 P = **62,000** | 0 B / 500 P = **74,500** |
| **1,000** | 1,000 B / 0 P = **99,000** | 900 B / 100 P = **104,000** | 700 B / 300 P = **114,000** | 500 B / 500 P = **124,000** | 0 B / 1,000 P = **149,000** |
| **3,000** | 3,000 B / 0 P = **297,000** | 2,700 B / 300 P = **312,000** | 2,100 B / 900 P = **342,000** | 1,500 B / 1,500 P = **372,000** | 0 B / 3,000 P = **447,000** |
| **5,000** | 5,000 B / 0 P = **495,000** | 4,500 B / 500 P = **520,000** | 3,500 B / 1,500 P = **570,000** | 2,500 B / 2,500 P = **620,000** | 0 B / 5,000 P = **745,000** |
| **10,000** | 10,000 B / 0 P = **990,000** | 9,000 B / 1,000 P = **1,040,000** | 7,000 B / 3,000 P = **1,140,000** | 5,000 B / 5,000 P = **1,240,000** | 0 B / 10,000 P = **1,490,000** |

*(Check of the first row: 500 × 99 = 49,500; 450 × 99 + 50 × 149 = 44,550 + 7,450 = 52,000; 350 × 99 + 150 × 149 = 34,650 + 22,350 = 57,000; 250 × 99 + 250 × 149 = 24,750 + 37,250 = 62,000; 500 × 149 = 74,500.)*

These are **gross monthly billings**; the mix percentages are **examples**, not forecasts. Conversion to Premium Live, churn, trial/free users and the share of subscribers who are actually active are all **unknown**.

### 12.3 Cost categories (classification)
| Category | Behaviour | Main driver | Quantified here? |
|---|---|---|---|
| **Live teachers** (hosts, substitutes, assistant moderators; **not** Marketplace teachers) | mostly **fixed** per session, grows in steps with audience (moderators) | hours of Live per month (two 60-minute sessions per week ≈ 8–9 hours/month of broadcast, plus preparation, moderation, materials, substitutes) | **hours only**; rates unknown (U-16) |
| **Live streaming provider** | **variable** with participant-minutes and concurrency; maybe minimum fees | attendees × minutes; peak concurrency | **usage only** (§12.5); price unknown |
| **AI API usage** | **variable** per tutor request/tokens | active tutor users × usage; capped by the fair-use hard limit (§11.3) | **formula only**; price unknown |
| **Payment processing** | **variable** per transaction (percentage and/or fixed fee — unknown); renewals, refunds, failed retries add transactions | number of transactions | **unknown**; flagged: at 99/149 KGS a fixed per-transaction fee is a larger share of revenue than at higher prices |
| **Hosting and infrastructure** | mostly fixed base + stepwise variable (storage, bandwidth for packs, realtime service) | users, concurrency | **unknown** |
| **Content creation and translation** | one-time investment + maintenance | person-days in 04 §13 (≈ 80–130 person-days for the minimum launch scope; ≈ 330–1,600 for full A1–B2 by depth) **[A]** | **person-days only**; cost per day unknown |
| **Live materials and localization** | recurring per session | weekly materials in `ky` and `ru` (10 §12) | **not estimated** |
| **Marketing / customer acquisition** | variable | acquisition cost per subscriber (unknown) | **unknown** |
| **Customer support, moderation, operations** | semi-variable | tickets per subscriber; Live moderation | **unknown** |
| **Taxes, licences, legal/compliance** | depends on jurisdiction | revenue, structure | **unknown** (U-03) |
| **Refunds, chargebacks, involuntary churn** | variable | policy and provider | **unknown** |
| **Foreign-exchange exposure** | if some costs are billed in another currency **[A]** | exchange rate vs KGS | **unknown** |

### 12.4 Gross-margin framework (no assumed values)
`gross margin = (gross billings − variable costs) ÷ gross billings`. Variable costs here = payment processing, AI API, Live provider participant-minutes, per-subscriber infrastructure and support. **Fixed costs** = Live teachers' hours, content investment, base infrastructure, team. Contribution available to cover fixed costs = `N × (ARPU − v)`, where `v` is the unknown variable cost per subscriber.
**Purely illustrative sensitivity** — contribution if variable costs consumed 20 %, 40 % or 60 % of ARPU, shown for the **30 % Premium Live** mix (ARPU 114 KGS). These ratios are **not estimates**; they only show how sensitive the model is:

| N | Gross billings | Contribution at v = 20 % | at 40 % | at 60 % |
|---|---|---|---|---|
| 500 | 57,000 | 45,600 | 34,200 | 22,800 |
| 1,000 | 114,000 | 91,200 | 68,400 | 45,600 |
| 3,000 | 342,000 | 273,600 | 205,200 | 136,800 |
| 5,000 | 570,000 | 456,000 | 342,000 | 228,000 |
| 10,000 | 1,140,000 | 912,000 | 684,000 | 456,000 |

Whether any of these contributions covers the fixed costs is **unknown**; no break-even is claimed.

### 12.5 Live capacity and unit-economics constraints (usage arithmetic, not prices)
- **Premium Live subscribers** `P = N × p`. **Peak concurrency per session** ≈ `P × a`, where `a` is the share of Premium Live subscribers attending that session (unknown). Illustration for the 30 % mix:

| Premium Live subscribers (P) | peak at a = 20 % | a = 40 % | a = 60 % |
|---|---|---|---|
| 150 (N=500) | 30 | 60 | 90 |
| 300 (N=1,000) | 60 | 120 | 180 |
| 900 (N=3,000) | 180 | 360 | 540 |
| 1,500 (N=5,000) | 300 | 600 | 900 |
| 3,000 (N=10,000) | 600 | 1,200 | 1,800 |

These numbers show why the provider capability matrix must include **audience size** (07 §9) and why moderation staffing scales with attendance.
- **Provider price ceiling (decision aid):** if a Premium Live subscriber attends `h` Live hours per month and the Live programme must be funded by the 50 KGS uplift, the **streaming cost per participant-hour must stay below `50 ÷ h` KGS** (before fees, taxes and teacher costs): h = 8.67 (both sessions every week) → < 5.77 KGS; h = 4 → < 12.50; h = 2 → < 25.00. This is a **requirement on the future provider contract**, not an estimate of any real price.
- **Basic constraint:** per-subscriber variable cost (AI usage up to the cap, payment fees, infrastructure, support) must stay below `99 KGS` minus tax and fees — which is why AI limits are a margin lever (§11).

### 12.6 Sustainability assessment (what can and cannot be said)
- **Cannot be said:** that 99/149 KGS is or is not sustainable. All major costs are unknown.
- **Structural observations:** (1) a **micro-price** with possibly fixed per-transaction costs; (2) Live adds **fixed teacher hours** and **variable streaming cost** funded by a **50 KGS uplift**, so Live is the most cost-sensitive component; (3) **AI cost** can erode Basic margin unless capped; (4) content/translation is a large **upfront** investment (04 §13); (5) **involuntary churn** matters more if recurring charges are unavailable (§5.2); (6) taxes/legal structure are unknown.
- **Recommended before committing prices [R]:** build a one-page unit-economics model from **quoted** (not assumed) provider prices, a measured AI cost per tutor interaction, and real attendance/conversion from a pilot; define **go/no-go thresholds** (e.g. minimum gross margin, maximum cost per participant-hour) **[A]**; keep prices in plan versions so a price review requires no code change.

---

## 13. Security considerations

| Topic | Requirement |
|---|---|
| **Server-side entitlement** | Every protected operation (course content delivery for paid content, tutor call, Live join, attendance history, materials) checks `EntitlementPort` on the server. Frontend visibility, route guards and `localStorage` are **UX only** |
| **Join-URL abuse** | No shareable Live URL exists; tokens are server-issued, short-lived, account- and session-bound (§8, 10 §6) |
| **Paid content delivery** | When content packs are paid, delivery goes through an entitlement-checked endpoint/signed URLs (not public static files). **Residual risk:** content delivered to an entitled client (or cached offline) can be copied; this is accepted for self-study content, mitigated by terms and rate limits **[A]** |
| **Offline entitlement (PWA)** | The client holds a **signed `EntitlementSnapshot`** with `validUntil` (an offline lease; length is policy, **U-17**); tampering only affects locally cached content; **Live and AI Tutor are never available offline** |
| **Amount integrity** | Prices/discounts computed server-side from plan version + invoice snapshot; client amounts ignored |
| **Authorization** | RBAC + ownership: an account can read only its own subscription/invoices/usage; admin changes are MFA-protected and audit-logged with before/after and reason; price/plan publication requires two-person approval **[R]** |
| **Payment webhooks** | signature verification, replay protection, idempotency by event id, allow-listing where supported |
| **Idempotency** | on checkout, upgrade/downgrade, cancel, refund, promo redemption |
| **Fraud and sharing** | one active Live connection per account; account-sharing policy for self-study is a business decision (**U-18**); promo-code abuse limits |
| **Privacy** | minimal billing data; no card data; invoices/receipts retention per legal requirement **[A]**; data export/deletion; separation of billing data from learning data in the database |
| **Logging** | no payment secrets or tokens in logs; audit log for plan, price, refund and override actions |
| **Provider secrets** | server-side only; separate credentials per purpose and environment |

---

## 14. Module boundaries (conforms to 01 §4.2)

### 14.1 Backend modules (introduced per phase; modular monolith)
| Module | Phase | Owns | Depends on (via contracts) |
|---|---|---|---|
| `identity`, `profile` | P8 | accounts, profile | — |
| **`payments`** (shared infrastructure) | P8b | `PaymentProvider` adapters, `PaymentTransaction` store (purpose-tagged), webhooks, reconciliation | — |
| **`billing`** | P8b | `Plan`, `PlanVersion`, `Subscription`, `Invoice`, change policies, dunning jobs | `PaymentsPort`, `IdentityPort` |
| **`entitlements`** | P8b | entitlement catalog, derivation (`EntitlementSet`), usage counters, `EntitlementPort`, signed snapshots | `BillingReadPort` (subscription state/events) |
| **`live`** | P8c | series, sessions, tokens, interactions, attendance, moderation (10) | `EntitlementPort`, `ClassroomProviderPort`, `IdentityPort` |
| marketplace modules | P9 | 09 | `EntitlementPort` not required; `PaymentsPort` (purpose `marketplace_booking`) |

Rules: modules communicate only through **contracts in `shared/contracts`** and domain events; `live` and the marketplace **never import `billing`**; only `entitlements` reads plan/subscription state; no module outside `billing`/`entitlements` knows plan codes or prices. The event outbox/job runner is introduced with the first asynchronous need (P8b dunning; earlier than the marketplace's P9b, 07 §8).

### 14.2 Frontend modules (layer L4, 01 §4.2)
A new L4 module **`subscription/*`** (plan display, checkout flow, status, upgrade/downgrade/cancel, usage meters) and **`live/*`** (schedule, lobby, participation UI), alongside `marketplace/*`. Each imports only `shared/contracts`, `platform`, `ui`, `languages`; none imports `core`, `engine`, `features`, `content` or another L4 module. The frontend consumes `EntitlementsPort` (implemented in `core/entitlements`, wired in `app`) **for display only**. The dependency matrix in 07 §6.1 is updated accordingly.

---

## 15. Delivery phases and tests

### 15.1 Phases (see 08)
| Phase | Contents | Prerequisites |
|---|---|---|
| **P8** | identity/profile/opt-in sync | P1, P2 |
| **P8b — Subscriptions and entitlements** | `payments` + `billing` + `entitlements` modules; plan/plan-version configuration; fake payment provider; subscription lifecycle, dunning, reconciliation; entitlement derivation, signed snapshots, usage metering and the AI-tutor limit mechanism; entitlement-gated content delivery; subscription UI; upgrade/downgrade/cancel per **placeholder** change policies | P8; P3 (course packs to gate; 04 §10); P5 recommended; **decision record S-D for real money** |
| **P8c — BilUp Live MVP** | `live` module (10 §17) | P8b; **decision record L-D** for a real provider and live pilot |
| P9 | Marketplace | P8; P9-D |

### 15.2 Tests required
| Area | Tests |
|---|---|
| **Entitlement derivation** | table-driven tests over `(subscription status, period, grace policy, now) → EntitlementSet` for every status incl. grace scopes; additive Premium Live = Basic ∪ Live; "no active subscription" configuration returns the configured set |
| **Plan/price immutability** | publishing PlanVersion n+1 leaves existing subscriptions, invoices and reports unchanged; invoices reproducible after a price change |
| **Lifecycle state machines** | every valid/invalid transition of subscription, invoice and payment machines; cross-machine event mapping (§5.4) |
| **Upgrade/downgrade/cancel** | scenarios for each `ChangePolicy` variant with fake clock, idempotency, upgrade-after-session-start, scheduled downgrade at period end |
| **Failed payments** | retry schedule, grace expiry, recovery within grace, manual-renewal mode (provider without recurring) |
| **Reconciliation** | unknown payment, missing webhook, duplicate webhook, amount mismatch, refund mirroring |
| **Access control** | **Basic and unsubscribed accounts get `403` on Live join** for a valid session id; a captured Live token cannot be used by another account; expired token rejected; second connection evicts the first; direct provider room URL without token is rejected (provider contract test); IDOR attempts on subscription/invoice endpoints |
| **No hardcoding** | static test: no price literals, no plan-code comparisons, no entitlement rules outside `billing`/`entitlements`; a plan version with changed price/limits works with no code change |
| **AI fair use** | usage counter idempotency, soft/hard limit behaviour, policy change without redeploy, degrade mode |
| **Security** | webhook signature/replay, amount tampering, admin audit, secrets scan |
| **Locale** | plan names, billing messages and Live-denial reasons go through message catalogs; provenance tests (02 §7) apply |

### 15.3 Decision records
**S-D (subscription & payment decision record)** must be approved before any live charge: U-03 (provider/legal/tax), U-04 (renewal mode), U-05 (grace/retry), U-07–U-10 (change/refund/cancellation policy), U-15 (price-change policy), U-16 (cost model validated), consumer-law disclosures **[A]**. **L-D** (Live) is in 10 §18.

---

## 16. Unresolved decisions (authoritative list; mirrored by Q18 in 01 §9)

**These are business/legal decisions that were not approved. The architecture is parameterised so each can be set by configuration, but none is decided here.**

| ID | Decision | Affects |
|---|---|---|
| **U-01** | Is there any entitlement without a subscription (free tier, trial, preview)? What does an expired account keep? | matrix, onboarding, P8b |
| **U-02** | What happens to the existing free, local-only MVP users and anonymous local use once paid plans exist (grandfathering, free tier, sunset)? | P8/P8b migration |
| **U-03** | Payment provider(s) for KGS, legal entity/structure, tax/VAT, consumer-law requirements for subscriptions and auto-renewal. **No provider is chosen.** | §7, S-D |
| **U-04** | Renewal mode: automatic (needs provider support for stored credentials) vs manual per period | §5.2 |
| **U-05** | Failed-payment retry schedule, grace length, and whether Live continues during grace | §5.3 |
| **U-06** | AI Tutor fair-use values; whether Premium Live gets higher limits than Basic | §11 |
| **U-07** | Upgrade billing: proration vs credit vs next-renewal (options A–D) and rounding rule | §6.1 |
| **U-08** | Downgrade timing (period end vs immediate with refund) | §6.2 |
| **U-09** | Cancellation and refund policy (cooling-off, partial refunds, immediate cancellation) | §6.3–6.4 |
| **U-10** | Compensation when a Live session is cancelled/shortened by the platform (no replay exists) | §6.4a |
| **U-11** | Access to Live materials after downgrade/expiry | §3.2 |
| **U-12** | Access to one's own Live attendance history after losing Premium Live | §3.2 |
| **U-13** | Marketplace booking: independent of subscription (assumed by architecture) or does it require an account/subscription? Any future Premium Live discount/credits? | §9 |
| **U-14** | Retention of learner data for expired/cancelled accounts | §5.3, 05 §10 |
| **U-15** | Price-change policy for existing subscribers and legal notice | §10.3 |
| **U-16** | Validated cost model (provider quotes, AI cost per interaction, fees, taxes, teacher cost, support) and go/no-go thresholds | §12 |
| **U-17** | Offline entitlement lease length for the PWA | §13 |
| **U-18** | Account-sharing and device-limit policy for self-study | §13 |
| **U-19** | Whether the business timezone for billing-day wording/reporting is `Asia/Bishkek` or other (instants remain UTC) | §5.2 |
| **U-20** | What "AI Tutor" means at launch for a paid plan: the existing **rule-based mock** (disclosed as a demo, 03 §9) or a real model-backed tutor. **No roadmap phase currently delivers a real LLM tutor** (it is [F] in 03 §9); the approved Basic plan advertises "AI Tutor, subject to fair-use limits" — wording and consumer-honesty implications must be decided, and a delivery phase added if a real model is intended | §3.2, §11, 03 §9 |

Live-specific decisions (instruction language, times, provider, retention periods, minors, moderation staffing) are in **10 §18 (L-nn)**.

---

## 17. Future extensibility (designed for, not built) **[F]**
Annual plans · promotional codes and discounts · trial/paused states · other currencies · per-region pricing · family/team plans (`Subscription` owner vs beneficiaries) · usage-based add-ons (e.g. extra AI allowance) · bundles with Marketplace credits (explicit approval required) · invoices/receipts in multiple locales · tax-engine integration. Each is an extension of plan versions, grants, policies or invoice lines — none requires redesigning the five independent concepts of §4.
