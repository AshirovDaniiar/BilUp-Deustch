# 07 — Technology Stack and Engineering Platform

Part of the BilUp Til 2.0 set ([01](01_PRODUCT_ARCHITECTURE.md)). Addresses **V-13, V-14, V-17, V-20** and fixes the technology decisions behind docs 02–06 and 09. **No dependency is installed by this document**; every library named below is a *proposal* (**[R]**) requiring an ADR/approval at the phase that introduces it.

---

## 1. Principles
1. **Preserve React + TypeScript + Vite** (approved strategy; Review concluded no rewrite is warranted).
2. **Add the minimum number of dependencies**, each justified, version-pinned and reviewed. Today: 2 runtime + 5 dev dependencies **[V]**.
3. **Prefer platform features** (`Intl`, `<dialog>`, `IntersectionObserver`, `BroadcastChannel`) over libraries.
4. **Modular monolith** on both sides; module boundaries enforced by tooling, not convention.
5. **Ports and adapters** for everything with a vendor or browser dependency.
6. **Provider independence** for payments and video (09).

---

## 2. Verified current stack

| Area | Current [V] | Source |
|---|---|---|
| UI | React 18.3.1 | `package.json` |
| Language | TypeScript 5.9.3, `strict`, `noUnusedLocals/Parameters`; typecheck passes | `tsconfig.json`; both reports |
| Build | Vite 5.4.21 + `@vitejs/plugin-react`; config is one line | `vite.config.ts` |
| Scripts | `dev`, `typecheck`, `build` (= `tsc --noEmit && vite build`), `preview` | `package.json:6-10` |
| Routing | custom hash router, manual `Number()` params, all screens eagerly imported | `router.tsx`; `App.tsx` |
| State | one Context + `useState`; `localStorage` | `store.tsx` |
| Styling | hand-written CSS (two global files), tokens, dark theme | `styles/*` |
| i18n | typed dictionaries; Russian as source of truth | `i18n/*` |
| Backend/DB/auth/API | none | grep: no `fetch`/env use |
| Tests/lint/format/CI | none | no config, no `.github` |
| Bundle | 460 KB JS (146 KB gzip), 38.5 KB CSS (8.7 KB gzip) single chunk | `dist/` (existing build; match with current source unverified) |
| Dependencies audit | offline `npm audit` reported 0, **not reliable**; no online scan done | Audit §0 |

---

## 3. Frontend stack decisions **[R]**

| Concern | Decision | Rationale / alternatives |
|---|---|---|
| Framework | React 18 → 19 upgrade evaluated separately; not required | avoid churn during migration |
| Language/build | TypeScript strict + Vite | keep; add `tsc -b` project references per layer **[R]** to make layer boundaries compile-time visible (optional) |
| Module layout | folders per module under `src/` with `index.ts` public API (01 §4.2); **single package** initially | npm workspaces/monorepo only if a second client (native, admin) or backend-shared package demands it |
| Runtime validation | **Zod** (or Valibot — decide in P1 ADR; smaller bundle vs ecosystem) | needed for storage (05), content (04), API contracts. Schema → TS types keeps one source |
| i18n | Start with a **small in-house resolver** over typed catalogs + `Intl` (plural/list/date), enforcing no fallback (02 §5); evaluate `intl-messageformat` if message complexity grows | avoids heavy libs; the *strict policy* is the hard part and libs default to fallback chains |
| Routing | Keep the hash router for **P0b (installable PWA) and the whole of P0–P4**; decide at the **start of P5** between (a) a typed, lazy-capable router (React Router data router is the default proposal) — needed if P5's two-pane/master-detail layouts and focus-on-route-change are cleaner with nested routes — and (b) master-detail on the hash router with a small typed route table. **History-mode URLs are optional** and adopted only if a concrete requirement appears (e.g. shareable/SEO teacher profile pages in P9); a service worker and manifest work with hash routes | *(revised — review M-1, X-7)* decouples PWA from the router swap; typed route table still solves manual param parsing (V-20) |
| State | `core/settings`, `core/progress`, `core/profile` as separate stores. Use React Context for stable, low-churn values (settings); **external store with selectors** (e.g. `useSyncExternalStore` wrapper, or Zustand if justified by ADR) for progress. | fixes V-17 whole-context re-render; no Redux needed |
| Data fetching (P8+) | `fetch`-based `ApiClientPort` with a light cache (TanStack Query proposal) for marketplace/server state | server state ≠ client state |
| Styling | Keep hand-authored CSS with tokens; **split by module** (CSS modules or layered CSS files with `@layer`), logical properties, container queries | no Tailwind migration (Audit/Review: not needed); keep design tokens as the contract |
| Icons | SVG sprite/components (Lucide-style, tree-shaken) replacing emoji | 06 §5 |
| Fonts | self-hosted, subset (Latin Ext + Cyrillic incl. ү ө ң) | 06 §5 |
| Speech | `SpeechPort` adapter over Web Speech (TTS + recognition) | native-ready; per-language config (02 §6) |
| Forms (marketplace) | native form controls + Zod validation; no form library initially | |
| Date/time (marketplace) | `Intl` + **Temporal-style** handling via a small library (e.g. `date-fns-tz`/`@js-temporal/polyfill`) — decide in P9; store UTC instants + IANA zone ids | 09 §7 |
| Error handling | app-level `ErrorBoundary` (absent today, **[V]** grep) + route-level boundaries + diagnostics port (no third-party tracking by default) | |

---

## 4. Routing, code splitting, bundle
- Lazy routes per learning surface and per marketplace area; content loaded lazily by unit (04 §10). Bundle budget **[R]**: initial JS ≤ **170 KB gzip** at first release of P6 (today 146 KB with all content inside; moving content out and adding validation/i18n code should keep the shell lean) — *numbers are targets, to be calibrated at P6 with measurements* **[A]**.
- Vendor chunking via Vite `manualChunks` only after measurement.
- Preload critical route chunks on intent (hover/focus/viewport) **[R]**.

---

## 5. PWA design (V-13) **[R]**

**Two steps** *(revised — review M-1; user instruction to move basic installation earlier)*:

| Step | Phase | Scope | Why it is safe to do early |
|---|---|---|---|
| **PWA-lite (installability)** | **P0b**, after P0, independent of P1–P5 | Web manifest + icons (192/512 + maskable), `display: standalone`, theme colour, minimal service worker that **precaches only the hashed static app shell**; update prompt; no runtime caching of data or content (content is still in the JS bundle); **hash routing unchanged**; no change to application logic, storage or content | It touches `public/`, `index.html`, `vite.config.ts` and one registration call only. It cannot alter learner data (localStorage is untouched); a **kill-switch** (a service worker that unregisters itself, served at the same URL) and `registerType: 'prompt'` make rollback possible; staged rollout behind a flag; ships independently of the R0 data migration |
| **PWA offline** | P6 | course-pack download, runtime caching, IndexedDB move, offline banners | needs P3 packs and P5 shell |

Risks of P0b and mitigations: stale-cache incidents → versioned precache, prompt-based update, kill-switch; install criteria vary by browser → Lighthouse installability check in CI plus manual iOS/Android check; the service worker must never intercept API/payment/video URLs (not applicable yet, rule recorded now). **Not in P0b:** offline lessons, background sync, push, history routing.

The table below describes the **full** design; rows marked *(P6)* are not part of P0b.

| Item | Design |
|---|---|
| Tooling | `vite-plugin-pwa` (Workbox) — proposal; custom service worker acceptable if bundle/size needs differ |
| Manifest | `name: "BilUp Til"`, `short_name`, `start_url`, `scope`, `display: standalone`, `theme_color`/`background_color` tokens, **192/512 PNG + maskable icons**, localized via `lang`/per-locale manifests **[A: decide static single manifest vs per-locale]** |
| Caching strategy | **Precache** app shell (hashed assets); **runtime cache** (stale-while-revalidate) for course manifests; **cache-first** for versioned unit/translation chunks of the *learner's* course + explanation locale; **network-only** for API/subscription/entitlement/Live/marketplace/payment/video endpoints (paid course packs are cached only after an entitlement-checked download and are usable offline only within the signed entitlement lease, 11 §13); **never cache** authenticated or payment responses |
| Offline scope | Self-study fully offline for downloaded levels (Q13); marketplace read-only/last-known with explicit offline banners; booking/payment, subscription changes, BilUp Live and the AI Tutor require network |
| Update flow | `registerType: 'prompt'`; "update available" notice (chrome, `uiLocale`); skip waiting only after user confirmation to avoid mid-lesson reloads; version skew handled by content version checks (04 §10) |
| Storage | Move large data to IndexedDB (05 §6); request persistent storage after engagement; show quota state |
| Install UX | `beforeinstallprompt` handling on supporting browsers; iOS "Add to Home Screen" instructions (localized) |
| Security | HTTPS only; CSP compatible with service worker; service-worker scope limited |
| Acceptance | Lighthouse PWA/installability pass; offline lesson works in a fresh install; update flow test; cache-bust test across versions |
| Platform caveat **[A]** | Web Speech recognition and push behaviour vary by browser/OS (notably iOS); features degrade gracefully (typed fallback exists today) |

History-mode URLs (optional, §3) require the host to rewrite to `index.html`; if adopted, the hosting choice is part of that decision (Q6/Q13), and legacy `#/…` links are redirected.

---

## 6. Module boundary enforcement **[R]** *(rewritten — review H-1, X-1)*
**01 §4.2 is the only authoritative dependency policy.** This section derives from it a machine-checkable matrix and the tests that keep it true. If 01 §4.2 changes, this section changes in the same pull request.

### 6.1 Allowed-edge matrix (derived from 01 §4.2)
Rows = importer, columns = imported. `✓` allowed (public API `index.ts` only); `C` allowed only for `shared/contracts` (types); blank = **forbidden**.

| importer ↓ / imports → | shared + contracts | platform | ui | languages | content | core | engine | features | marketplace | subscription | live | app |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **shared** (incl. `contracts`) | ✓ | | | | | | | | | | | |
| **platform** | ✓ | | | | | | | | | | | |
| **ui** | ✓ | | | | | | | | | | | |
| **languages** | ✓ | | | | | | | | | | | |
| **content** | ✓ | ✓ | | | | | | | | | | |
| **core** | ✓ | ✓ | | | | | | | | | | |
| **engine** | ✓ | ✓ | | ✓ | ✓ | | | | | | | |
| **features** | ✓ | ✓ | ✓ | ✓ | ✓ | | ✓ | | | | | |
| **marketplace** | ✓ | ✓ | ✓ | ✓ | | | | | | | | |
| **subscription** | ✓ | ✓ | ✓ | ✓ | | | | | | | | |
| **live** | ✓ | ✓ | ✓ | ✓ | | | | | | | | |
| **app** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | |

Notes: (1) `✓` between different layers only goes **downward**; e.g. `core → platform` (L3→L1), `engine → languages/content` (L3→L2), `features → engine` (L4→L3). (2) **No same-layer edges** appear in the matrix (`engine`↔`core`, `features`/`marketplace`/`subscription`/`live` among themselves, `content`↔`languages`, `platform`↔`ui` are all blank). (3) `core` and `engine` obtain everything else (e.g. `CourseCatalogPort`, `ProgressPort`) as **contracts** wired in `app`; (4) `ui` imports nothing but `shared` — it receives localized strings through the `UiText` contract; (5) `marketplace`, `subscription` and `live` have **no edge to `core`, `engine`, `features`, `content` or to each other**; they use `AuthPort`, `SettingsPort`, `ApiClientPort` and (subscription/live, advisory UI only) `EntitlementsPort` contracts; Live and the Marketplace share nothing at the module level; (6) `content` may use `platform` (resource loading/fetch for packs); `languages` may be used by `engine`/`features`/`marketplace` for concrete utilities (formatters, registries) but never imports upward; (7) `app` is the only module allowed to import implementations from several modules (composition root).

### 6.2 Enforcement and tests
| Mechanism | Use |
|---|---|
| `dependency-cruiser` config **generated from the matrix** (single source: `architecture/dependency-policy.json`) | forbidden-edge rules, **cycle detection**, orphan detection, module-graph artifact (SVG/JSON) uploaded by CI |
| ESLint `eslint-plugin-boundaries` (or `import/no-restricted-paths`) | the same rules at edit time |
| Public API rule: imports only via a module's `index.ts`; deep imports forbidden | encapsulation |
| Contracts purity rule: files in `shared/contracts` contain only `type`/`interface` declarations (and `import type`) — no values, no side effects, no imports from other modules | keeps ports cheap and cycle-free |
| Branded types (`LocaleCode`, `LanguageCode`, `CourseId`, `LevelId`) | prevent code-space mix-ups (02 §2.3) |
| Platform isolation rule: `localStorage`, `indexedDB`, `navigator`, `speechSynthesis`, `fetch`, `serviceWorker` referenced only under `platform/*` | native-readiness |
| Engine/core literal rule: no `'A1'`-style level literals and no numeric lesson/section counts in `engine`/`core` | 03 §6 |
| Visible-text rule (script-agnostic): no literal letters in user-visible JSX/aria/title/placeholder text outside catalogs, `<TargetText>`, `<UserText>` | 02 §7.2 (replaces the former Cyrillic-only rule) |
| CODEOWNERS per module (when team size warrants) | ownership |

**Testable policy (what CI proves):**
1. **Matrix fixtures:** a fixture project contains one deliberately violating import per forbidden cell category (upward, same-layer, `ui → languages`, `engine → core`, `marketplace → engine`, `features → marketplace`, deep import, impure contract). The policy test runs the checker on the fixtures and **fails if any violation is not reported**, and on the real tree and **fails if any violation is reported**.
2. **Cycle test:** a fixture with an A→B→A cycle must be detected; the real graph must have none.
3. **Matrix ⇄ doc consistency test:** the generated config equals the matrix in `architecture/dependency-policy.json`; a script checks that the matrix rows match 01 §4.2 (layers list) so the two cannot drift.
4. **Graph snapshot:** the module graph artifact is diffed in pull requests; new edges require a reviewer acknowledgement.
5. **Rollout:** introduced in **report-only** mode in P0 (modules not yet reorganised), promoted to **error** in P2 once the folder skeleton exists (08 P2), with the baseline violations listed and burned down.

*(The former summary sentence "`marketplace → engine`" and the `TeacherRecommendationPort` exception were wrong/removed — see ARCHITECTURE_CHANGELOG.)*

---

## 7. Quality platform (V-14) **[R]**

| Layer | Tooling (proposed) | Introduced |
|---|---|---|
| Static | `tsc --noEmit` (keep), ESLint (typescript-eslint, react-hooks, jsx-a11y, boundaries), Prettier | P0 |
| Unit/integration | **Vitest** + Testing Library (+ `fake-indexeddb` later) | P0 |
| Content | `content-validate` CLI + coverage report (04 §6–7) | P3 (skeleton in P0) |
| E2E / visual / a11y | **Playwright** + `@axe-core/playwright`. *(Simplified — review O-6)* **Chromium** runs the curated visual-diff set and full journeys; **WebKit and Firefox** run smoke, overflow and touch-target audits only (no pixel baselines) | P0 smoke, P5 full |
| Performance/PWA | Lighthouse CI: installability from P0b; performance budgets and offline checks P6 | P0b / P6 |
| Dependency hygiene | `npm audit` (online) in CI, Dependabot/Renovate, lockfile review, license check | P0 |
| CI | GitHub Actions (or equivalent): install (`npm ci`), typecheck, lint, test, content-validate, build into a disposable dir (not overwriting working `dist/`), upload reports/artifacts | P0 |
| Branch policy | required checks on `main`; conventional commits optional | P0 |

Coverage targets **[A]**: engine/progress/storage/content-validator ≥ 90 % line coverage on pure modules; UI covered by flows rather than percentages. Build in CI uses `vite build --outDir` to a temp path (the earlier audits avoided running `build` because it overwrites `dist/`).

Golden/characterisation tests are written **before** refactors (SRS transitions, question builders, analyzer outputs, resolved text of current screens) so "preserve behaviour" is testable.

---

## 8. Backend architecture (future, boundaries only) **[R/F]**

**Not implemented in this scope.** Decision: a **single deployable modular monolith**, not microservices.

| Aspect | Decision |
|---|---|
| Runtime/language | **TypeScript on Node.js** (proposal) to share contracts and skills with the frontend; alternatives (e.g. Kotlin/Java, Go, .NET) acceptable if the team prefers — Q6 |
| Style | REST + OpenAPI as the contract (`contracts` package/folder generating TS types and clients); WebSocket/SSE only where needed (booking notifications, classroom status, **BilUp Live interactions — transport undecided, 10 §8 / L-05**) |
| Database | **PostgreSQL** (strong constraints, `tstzrange` + exclusion constraints for anti-double-booking — 09 §8; JSONB for flexible fields; row-level security optional) |
| Module layout *(simplified — review O-5)* | **Introduced per phase, each with a one-page ADR when it starts.** **P8:** `identity`, `profile` (learner account data) and an **opt-in `sync`** endpoint only. **P9a:** `catalog` (teacher profiles, offers, verification, search projection). **P9b:** `availability`, `booking`, a minimal `classroom` (room/attendance via provider port). **P9c:** marketplace money records on top of the shared `payments` module (+ `payouts` only if the chosen provider model requires our own payout orchestration), `reviews`, `moderation`. **Revision 3 additions:** **P8b:** `payments` (shared provider adapters, purpose-tagged `PaymentTransaction`s, webhooks, reconciliation), `billing` (plans, plan versions, subscriptions, invoices) and `entitlements` (derivation, usage counters, signed snapshots) — 11 §14. **P8c:** `live` (10). Only `entitlements` reads subscription/plan state; no other module knows plan codes or prices. `notifications` and `admin` start as shared services/endpoints and become modules only when they own data. The module list in 09 §2 is the **target boundary map**, not an implementation commitment. Every module owns its tables and exposes in-process contract interfaces; **no cross-module table access** (01 §4.2 point 6) |
| Communication | in-process calls via contract interfaces. **Domain events + transactional outbox are introduced with the first asynchronous need — now P8b (subscription renewal/dunning, webhook processing, entitlement-change events)** *(was P9b before revision 3)*, not in P8; before that, plain synchronous calls |
| Async work | none in P8. **From P8b:** a small DB-backed job runner for invoice creation, payment retries/dunning, expiry, reminders, webhook retries, reconciliation. From P8c/P9b: occurrence generation, hold expiry, notifications; Marketplace payout jobs only after the payment ADR (09 §12) |
| Sync (P8) | learner-state sync is **opt-in** and minimal: push/pull of the compact credit ledger, completions, mastery, settings (05 §3–§4), idempotent by `creditId`/`resultId`. Sync metadata (`deviceId`, sequence numbers) is added by a P8 migration only if the chosen conflict strategy needs it (05 §2 principle 6) |
| Auth | OIDC/OAuth2-based identity (provider or self-hosted — decide in P8); short-lived access tokens, rotating refresh tokens in httpOnly secure cookies; MFA for admins/teachers payouts; RBAC + ownership checks (09 §10) |
| Config/secrets | env + secret manager; no secrets in frontend (including AI/LLM keys) |
| Observability | structured logs, request ids, audit log for admin/payment actions, metrics, health checks; privacy-aware (no PII in logs) |
| Deployment | containerised single service + managed Postgres; CDN for static frontend and content; staging environment with provider **sandbox** accounts |
| Extraction path | module boundaries + outbox make `payments`/`classroom` the first candidates if scale ever requires splitting; not planned now |

## 9. Provider abstractions (payments, video, others) **[R]**

Each integration sits behind a **port owned by the backend module** with ≥ 1 adapter and a fake adapter for tests.

| Port | Operations (illustrative) | Adapters |
|---|---|---|
| `PaymentProvider` *(capability-based — review H-2)* | `capabilities()` → `{ supportsImmediateCapture, supportsAuthHold, maxAuthWindowDays, supportsDelayedTransfer, supportsSplitPayout, supportsRefundPartial, supportsConnectedPayees, settlementCurrencies[], payoutCountries[] }`; operations: `createPaymentIntent`, `confirm`, `capture` (only if `supportsAuthHold`), `cancel`, `refund`, `onboardPayee`, `createTransfer/payout` (only if supported), `verifyWebhook`, `getBalance`. The domain asks `capabilities()` and selects a funds-flow strategy (09 §12); it never assumes a capability. **Revision 3 — one port, two purposes:** calls carry `PaymentPurpose = 'subscription' | 'marketplace_booking'`; subscription use adds `supportsKgs`, `supportsRecurringCharge`, `supportsHostedCheckout`, `supportsTransactionReports`, `supportsIdempotencyKeys` and operations `createCheckout`, `chargeStoredCredential` (only if supported), `getTransaction`, `listTransactions` (11 §7). Records, ledgers and reconciliation are kept **per purpose** | `FakePaymentProvider` (P8b/P9 sandbox: configurable capabilities, including "no recurring"); **no provider is chosen** — real providers are selected only after the decision records **S-D** (subscriptions, 11 §15.3) and **P9-D** (Marketplace, 09 §1.1); candidates must be verified for market/legal fit **[A]** |
| `ClassroomProvider` *(revised in revision 3)* | `createRoom`, `issueJoinToken(role, accountId, sessionId, ttl)`, `promote/demote`, `eject`, `endRoom`, `getRoomState`, `verifyWebhook`; `capabilities()` → `{ supportsTokenAuth, maxParticipantsPerRoom, supportsPublisherPromotion, supportsParticipantEjection, supportsRoomLockdown, canDisableAutoRecording, supportsLargeAudienceMode, … }`. **The port has no recording operation of any kind** (no `getRecording`, `startRecording`, egress/archive) and its configuration schema cannot express "recording enabled" (10 §7, §9). A provider is **eligible only if `canDisableAutoRecording` is true and verifiable** and, for BilUp Live, only if it can serve the configured audience (hundreds) and offers token-based access with no shareable public room URL | `FakeClassroomProvider`; real provider **not chosen** (Marketplace: Q10/D7; Live: L-03) — separate adapter configurations for Marketplace rooms and Live rooms |
| `NotificationChannel` | email, push, SMS (later) | |
| `IdentityVerificationProvider` [F] | teacher KYC | |
| `StoragePort` (documents/avatars) | signed URLs | |

Rules: provider-specific types never leak into domain models; **webhooks** are verified (signature), **idempotent** (event id table) and processed via the outbox; provider ids are stored as opaque references; multi-provider routing per region is possible because the domain only sees the port.

## 10. Security baseline **[R]**
- **Frontend:** CSP (no inline scripts), no `dangerouslySetInnerHTML` (kept; lint rule), dependency pinning, SRI for any third-party scripts (prefer none), strict `Permissions-Policy` (mic/camera only where needed), sanitized/escaped user-generated text (teacher bios, reviews).
- **Secrets:** never in client bundles; provider keys server-side only; public keys only for hosted payment fields.
- **Transport/storage:** HTTPS/HSTS; cookies `Secure; HttpOnly; SameSite`; CSRF protection for cookie-authenticated endpoints.
- **Input validation:** schema validation at every API boundary (shared Zod/OpenAPI), output encoding, rate limiting/abuse controls on auth, search, booking, review endpoints.
- **Payments:** no card data touches our servers or logs (provider-hosted fields/redirect → PCI-DSS SAQ A scope **[A: confirm with chosen provider]**); webhook signature verification; idempotency keys on every money-moving call; reconciliation jobs (09 §12).
- **Privacy:** data inventory, consent management, retention, export/delete (05 §10, 09 §11).
- **Supply chain:** CI audit, Dependabot, minimal deps, lockfile integrity, reviewed postinstall scripts.
- **Mic/AI:** disclose browser speech-recognition cloud processing (Audit S-06); remote LLM tutor requires server-side proxy, rate limits, prompt/data policy and the **fair-use `UsagePolicy` enforced server-side** (11 §11) [F].
- **Entitlements and Live access (revision 3):** every protected operation is authorized **server-side** from entitlements (11 §13); frontend visibility, route guards and `localStorage` are UX only. BilUp Live has **no shareable room URL**: joins go through an authenticated endpoint that checks the `live.<language>` entitlement and issues a short-lived, account- and session-bound provider token (10 §6). Offline PWA entitlement is a signed, expiring snapshot used for cached self-study content only; **Live and the AI Tutor never work offline**.
- **No recording (revision 3):** no recording code, flag, provider feature or entitlement exists for any lesson/session; enforced by provider contract tests, a room-settings audit job and a static CI check (10 §9.2). The platform cannot prevent *external* recording by participants and does not claim to.

## 11. Dependency policy
New dependency requires: purpose, size impact (bundlephobia-like check in CI), maintenance health, license, security posture, alternative considered; recorded as an ADR line in the PR. Runtime dependency count is tracked as a metric.

## 12. Open items
- Zod vs Valibot; router choice confirmation; Zustand vs custom store (all decided by ADR at the phase that needs them).
- Backend runtime and hosting (Q6); content hosting; auth provider.
- Payment and video providers and legal structure (Q7–Q10).
- Bundle and performance budget numbers need measurement **[A]**.
- Whether to adopt a monorepo when `contracts` is shared with the backend.
- (Revision 2) Whether to use `dependency-cruiser` alone or with `eslint-plugin-boundaries` (both specified in 6.2; start with dependency-cruiser if one tool is preferred); where `architecture/dependency-policy.json` lives.
- (Revision 2) Router decision at the start of P5 (typed router vs. master-detail on the hash router); history-mode URLs only on a concrete requirement.
- (Revision 2) Real payment provider selection is blocked until the P9-D decision record (09 §1.1).
- (Revision 3) **No payment provider is chosen for subscriptions either** (KGS support, recurring charges and fees are unknown): selection is blocked until decision record **S-D** (11 §15.3). If the provider lacks stored-credential recurring charges the platform runs in manual-renewal mode (11 §5.2).
- (Revision 3) Live realtime transport (provider channel vs. own endpoint) and Live provider selection: 10 §18 (L-03, L-05). Paid content delivery (entitlement-gated, signed access) must be reconciled with the static-CDN content hosting of 04 §10 at the start of P8b.
