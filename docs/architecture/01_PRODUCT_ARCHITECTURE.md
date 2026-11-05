# 01 — Product Architecture (BilUp Til 2.0)

**Status:** Proposed architecture, approved strategy inputs applied. **Baseline:** repository HEAD `386c6a1` (BilUp Deutsch MVP).
**Evidence sources:** [`BILUP_TIL_TECHNICAL_AUDIT.md`](../BILUP_TIL_TECHNICAL_AUDIT.md) (Claude Code audit, "Audit") and [`BILUP_TIL_INDEPENDENT_REVIEW.md`](../BILUP_TIL_INDEPENDENT_REVIEW.md) (Codex review, "Review").
**Set:** 01 Product · [02 Language](02_LANGUAGE_ARCHITECTURE.md) · [03 Learning Engine](03_LEARNING_ENGINE.md) · [04 Content](04_CONTENT_ARCHITECTURE.md) · [05 Progress & Storage](05_PROGRESS_AND_STORAGE.md) · [06 Responsive](06_RESPONSIVE_DESIGN.md) · [07 Technology](07_TECHNOLOGY_STACK.md) · [08 Migration](08_MIGRATION_ROADMAP.md) · [09 Marketplace](09_ONLINE_TEACHERS_MARKETPLACE.md) · [10 BilUp Live](10_BILUP_LIVE_ARCHITECTURE.md) · [11 Subscription & Pricing](11_SUBSCRIPTION_AND_PRICING_ARCHITECTURE.md) · [Final review](FINAL_ARCHITECTURE_REVIEW.md) · [Changelog](ARCHITECTURE_CHANGELOG.md)

**Revision 3 (subscription model and final review):** integrates the approved two-plan subscription model (**BilUp Basic 99 KGS/month; BilUp Premium Live 149 KGS/month**), adds BilUp Live (10) and subscriptions/entitlements (11), makes the **no-recording rule global**, and records the cross-document consistency review ([FINAL_ARCHITECTURE_REVIEW.md](FINAL_ARCHITECTURE_REVIEW.md)). Details: [ARCHITECTURE_CHANGELOG.md](ARCHITECTURE_CHANGELOG.md) (Revision 3).

**Revision 2 (correction pass):** incorporates [`BILUP_TIL_ARCHITECTURE_INDEPENDENT_REVIEW.md`](../BILUP_TIL_ARCHITECTURE_INDEPENDENT_REVIEW.md). What changed and why: [`ARCHITECTURE_CHANGELOG.md`](ARCHITECTURE_CHANGELOG.md). **§4.2 of this document is the single authoritative dependency policy**; documents 03, 07 and 09 only refer to it.

---

## 0. Conventions used in all documents of the set

### 0.1 Evidence labels
Every non-trivial statement is one of:

| Label | Meaning |
|---|---|
| **[V]** Verified | Observed in the repository or measured, and confirmed by at least one report (both where noted). Cites file/line or measurement. |
| **[R]** Recommendation | A design decision proposed by this documentation set. Not yet implemented. |
| **[A]** Assumption | A business, legal, market or technical assumption that has **not** been verified and must be confirmed (collected in §9). |
| **[F]** Future | Deliberately designed-for but out of current scope. |

Nothing in these documents is implemented unless marked **[V]**. All code snippets are **illustrative contracts**, not source files.

### 0.2 Canonical vocabulary (binding across all documents)

| Term | Definition |
|---|---|
| `uiLocale` | Language of interface chrome: navigation, buttons, labels, system messages. |
| `explanationLocale` | Language of *all instructional material*: explanations, hints, feedback, translations of target-language items, grammar notes, quiz instructions, tutor replies, assessment feedback. |
| `targetLanguage` | The language being learned (`de`, `en` initially). |
| `courseId` | A concrete course pack (e.g. `de-general`, `en-general`). A course belongs to exactly one `targetLanguage`. |
| `LearnerSettings` | `{ uiLocale, explanationLocale, targetLanguage, courseId, … }` — the four settings are independent fields; the only invariant is `course(courseId).targetLanguage === targetLanguage` and that the course is *released* for `explanationLocale` (see 04 §7). |
| Level scale | An ordered list of level ids defined in configuration (CEFR: `A1 A2 B1 B2 C1 C2`). Application logic never references a level literal; it reads the scale from the registry. |
| Course pack | Versioned, validated content bundle: manifest + target-language items + per-locale translations (04). |
| Activity | One unit of learner interaction (quiz, reading passage, dialogue, speaking turn, …) executed by the Learning Engine (03). |
| `ActivityResult` | The single record every activity emits; the only input to progress, XP and mastery (03, 05). |
| `MessageRef` | `{ key, params }` — a locale-independent reference to learner-facing text. Services return these instead of prose (02, 03). |
| Instructional vs. chrome | Chrome → `uiLocale`. Instructional → `explanationLocale`. The classification table is normative (02 §3). |
| **BilUp Basic** (`basic`) | Subscription plan, **99 KGS/month** (initial plan version): the entire self-study platform; **no BilUp Live** (11 §1). |
| **BilUp Premium Live** (`premium_live`) | Subscription plan, **149 KGS/month** (initial plan version): everything in BilUp Basic **plus** the weekly German and weekly English BilUp Live sessions (11 §1). |
| **BilUp Live** | The two weekly 60-minute mass interactive classes (one German, one English); included in Premium Live only; **never recorded** (10). Not a Marketplace lesson. |
| Plan / plan version / subscription / invoice / payment transaction / entitlement | Five independent concepts of 11 §4: *plan definition*, *immutable priced version*, *subscription instance*, *charge document and payment attempt*, *derived capability set*. Code checks **entitlements**, never plan codes (11 §10.4). |

### 0.3 Scope
- **In scope (initial):** target languages `de`, `en`; UI and explanation locales `ky`, `ru`; CEFR `A1 A2 B1 B2`.
- **Architecture-supported, content out of scope:** `C1`, `C2` (they are entries in the level scale with `status: "planned"`; no code change is required to add content).
- **New modules:** subscriptions and entitlements (11), **BilUp Live** (10) and the Online Teachers Marketplace (09), delivered after the backend foundation in the order P8b (subscriptions) → P8c (Live) → P9 (Marketplace).
- **Not now:** real payments (subscription *and* Marketplace — both need an approved decision record, S-D / P9-D, before any live charge), real video, native apps, microservices, Marketplace group lessons/packages, annual plans, promotional codes (designed for, not built). **Never:** recording or replay of any live session (10 §9).

---

## 1. Product overview

BilUp Til is **one multilingual language-learning platform** with three pillars sharing one identity, one settings model and one language registry:

1. **Self-study platform** — structured courses (vocabulary, grammar, reading, listening, speaking, writing, assessment), AI Tutor, spaced repetition and course-scoped progress. Evolves the existing React/TypeScript/Vite MVP. Sold as **BilUp Basic** (99 KGS/month).
2. **BilUp Live** — two weekly mass interactive classes (German, English), 60 minutes each, one teacher and potentially hundreds of students, A1–B2 in one stream, never recorded. Included in **BilUp Premium Live** (149 KGS/month = Basic + Live), **not** sold separately (10, 11).
3. **Online Teachers Marketplace** — an open marketplace of independent teachers for German and English, with booking, payments and online classrooms; **a separate paid service not included in either plan** (09, 11 §9).

Subscriptions, entitlements and payments (11) cut across all three: *what an account may do* is decided server-side by entitlements derived from the subscription, never by the frontend.

The pillars are deliberately decoupled: the marketplace and Live never depend on learning-engine internals, the learning side links to the marketplace with a plain route link (§4.2 point 4; no code dependency), and Live and the Marketplace share no entitlement, booking, payment flow or records (10 §14, 11 §9).

### 1.1 Learner experience examples (acceptance scenarios for the language model)
| Learner | `uiLocale` | `explanationLocale` | `targetLanguage` | `courseId` | Expected |
|---|---|---|---|---|---|
| Kyrgyz speaker learning German | `ky` | `ky` | `de` | `de-general` | Chrome and **all** instruction in Kyrgyz; target text German |
| Russian speaker learning German | `ru` | `ru` | `de` | `de-general` | All Russian |
| Kyrgyz speaker learning English | `ky` | `ky` | `en` | `en-general` | All Kyrgyz; target text English |
| Russian UI, Kyrgyz explanations | `ru` | `ky` | `de` | `de-general` | Chrome Russian; every explanation/hint/feedback Kyrgyz; no Russian instructional text |

The last row is an automated test case (02 §7).

---

## 2. Verified baseline (what exists today)

All **[V]**, from both reports and repository inspection at HEAD `386c6a1`.

| Area | Baseline |
|---|---|
| Stack | React 18.3, TypeScript 5 (strict, typecheck passes), Vite 5; 2 runtime deps; custom hash router; one Context store; hand-written CSS; no backend, auth, tests, lint, CI, manifest or service worker |
| Content | German only. 10 A1 units, 226 vocabulary items, 20 grammar concepts (19 A1, 1 A2), 202 exercises, 21 listening dialogues (18 A1, 3 A2), 10 reading texts (7 A1, 2 A2, 1 B1), 11 speaking scenarios, 10 writing tasks, 15 tests |
| Features | Dashboard, curriculum, vocabulary + Leitner SRS, 7-step grammar lessons with "WHY?" and visuals, quizzes, daily challenge, listening (browser TTS), reading with tap-glosses, writing and speaking with heuristic scoring, rule-based tutor, progress, profile |
| Bundle | 1 JS chunk 460 KB (146 KB gzip); CSS 8.7 KB gzip |
| Responsive (rendered, headless Chrome) | Phone shell (bottom nav) at 390 and 768; sidebar at 1440; no document-level horizontal overflow on the routes both reports tested. See §3 for limits |

### 2.1 Strengths to preserve
7-step topic lesson (`TopicScreen.tsx`); unified `Question` abstraction (`features/tests/questions.ts`); Leitner SRS (`services/srs.ts`); mistake-driven recommendations (`features/progress/stats.ts`); design tokens and UI primitives (`styles/base.css`, `components/ui.tsx`); data separated from components; `TutorService` seam; strict TypeScript; minimal dependencies; honest "demo/simulation" disclosures. The Review concludes (and this set agrees) that **incremental refactoring, not a rewrite**, is warranted.

---

## 3. Findings register (verified issues → where addressed)

Severity per Review/Audit consensus (higher of the two where they differ). "Doc/Phase" points to the design response and the roadmap phase (08) that closes it.

| ID | Finding | Evidence [V] | Sev | Source | Addressed in | Phase |
|---|---|---|---|---|---|---|
| V-01 | UI, explanation and target language conflated; one `lang` (`ru\|ky\|de`); German as property names; speech fixed `de-DE`; `de` offered as UI language | `data/types.ts:3,8-12,26-46,176-179`; `i18n/index.ts:7-9`; `ProfileScreen.tsx:20-22`; `services/speech.ts:26,80` | Critical (vision) | Both | 02, 04 | P2 |
| V-02 | Kyrgyz incomplete; **silent Russian fallback** (`...ru` spread, `?? ru`). UI: 121/280 keys overridden (159 = 56.8 % inherit Russian). Content: 0/202 exercise explanations, 0/40 grammar-mistake notes, 0/70 "when" notes, 0/86 listening lines have Kyrgyz. (Override ratio ≠ translation quality) | `i18n/ky.ts:1-6`; `i18n/index.ts:9`; data counts | High | Both (Review corrects "20 lists" → 70 notes) | 02, 04 | P3 (+ staged rollout, gates G-ru/G-ky) |
| V-03 | Hard-coded Russian learner-facing prose outside i18n (quiz prompts/why, tutor, analysis, WordCard, placement text) | `features/tests/questions.ts:47-74,134-137`; `services/tutor.ts`; `services/analysis.ts:41-93`; `WordCard.tsx:92`; `PracticeScreens.tsx:128` | High | Both | 02, 03 | P2–P4 |
| V-04 | XP farming: per-answer and per-finish XP without idempotency; writing +15 per analysis; speaking +20 per attempt; daily +25 per finish handler | `QuizRunner.tsx:45,75`; `WritingLab.tsx:46-49`; `SpeakingLab.tsx:85-93`; `PracticeScreens.tsx:156` | High | Both | 03, 05 | P1 |
| V-05 | Completion semantics wrong: unit test marked complete at any score; review likewise; topic can be finished without passing practice | `PracticeScreens.tsx:66,115-119`; `TopicScreen.tsx:47-53` | High | Review (Audit also) | 03, 05 | P1 |
| V-06 | Unit 10 has no reading text; fixed 8-section assumption means it can never reach 100 % | `data/reading.ts` (no unit 10); `stats.ts:37-45`; `UnitScreen.tsx:25,29-33` | Medium | Both | 04 (config-driven structure + validator), 05 | P1 (denominator), P3 (validator) |
| V-07 | `localStorage` JSON cast, shallow-merged, no schema version, no migrations; errors swallowed; full-blob write per change | `store.tsx:7,30-40,64-70` | High | Both | 05 | P1 |
| V-08 | Idle time counted as study time (15 s ticks while tab visible; re-renders provider) | `store.tsx:80-88` | Medium | Both | 05 | P1 |
| V-09 | Reading wrong answers recorded as `kind:'grammar'`; entire passage used as "why" | `ReadingLab.tsx:53` | Medium | Review (Audit F-10) | 03, 05 | P4 |
| V-10 | Tutor pending quiz state is module-global and survives chat reset | `services/tutor.ts:43,65-78`; `TutorChat.tsx` | Medium | Both | 03 | P4 |
| V-11 | Placement result can recommend A2 from raw % while only A1 content is exposed | `PracticeScreens.tsx:127-128`; `LearnScreen.tsx:21-46` | Medium | Review | 03 §7, 04 | P4 |
| V-12 | Tablet portrait uses phone shell (breakpoint only at 1024); touch targets < 44 px (`.iconbtn` 40×40; Reading words ≈53×41; 3 targets <44 on Home) | `base.css:91-108`; CDP measurements | Medium | Both | 06 | P5 |
| V-13 | No PWA manifest, service worker or install/offline behaviour | `public/`=favicon only; `index.html`; `vite.config.ts` | High (PWA goal) | Both | 07, 08 | P0b (installability), P6 (offline) |
| V-14 | No automated tests, lint, formatter or CI (only `typecheck`, `build`) | `package.json:6-10`; no `.github` | High | Both | 07, 08 | P0 |
| V-15 | Default profile name "Daniiar"; brand naming inconsistent ("BilUp Til" vs "BilUp Deutsch") | `store.tsx:11-13`; `index.html`, `Layout.tsx:29` | Low | Both | 05, 06 | P1/P5 |
| V-16 | Speaking hints submitted as learner answers and scored | `SpeakingLab.tsx:137-141` | Medium | Both | 03 | P4 |
| V-17 | `AppProvider` combines profile, progress, tutor, theme, timer, persistence; whole state in one context value | `store.tsx:30-40,64-110` | High | Review (Audit A-01) | 05, 07 | P1 |
| V-18 | Reading gloss shows RU and KY together instead of the chosen explanation locale | `ReadingLab.tsx:95-104` | Medium | Review | 02, 04 | P3 |
| V-19 | `Sheet` has Escape + `aria-modal` but no focus placement/trap/restore, no scroll lock | `components/ui.tsx:110-135` | Medium | Both (Audit's "no Escape" claim refuted by Review) | 06 | P5 |
| V-20 | All screens eagerly imported; no code splitting; manual hash route params | `App.tsx:1-18,27` | Medium | Both | 07 | P5–P6 (typed router; history URLs optional) |

### 3.1 Claims corrected by the Review (do not rely on the earlier wording)
| Earlier claim | Correct status |
|---|---|
| "Daily challenge stays incomplete after speaking" | **Refuted.** `PracticeScreens.tsx:156` sets `speaking:true`. The real defect is repeatable XP (V-04). |
| "Sheet has no Escape handling" | **Refuted.** Escape exists (`ui.tsx:112-117`); focus management is what is missing (V-19). |
| "16 routes × 3 viewports show no overflow" | Single-author evidence from the Audit; the Review reproduced Home (3 viewports) and Reading (390, 768) only, and notes `body{overflow-x:hidden}` can mask child overflow. Treat as **partially verified**; the test plan (06 §9) re-establishes it per route. |
| "Kyrgyz 43 % covered" | Valid *override ratio* (121/280), not a quality score. |

### 3.2 Not yet verified [A]
Real-device behaviour; screen-reader behaviour; contrast ratios (Audit computes `--ink-3` ≈3.3:1 by hand, unmeasured by tool); speech-recognition behaviour; linguistic correctness of any Kyrgyz string; online dependency vulnerability scan; that `dist/` exactly equals current source.

---

## 4. Target product architecture

### 4.1 Capability map
```
BilUp Til
├─ Platform shell                (app composition, routing, layout shells, error boundary)
├─ Core                          (settings, profile, progress, auth port)
├─ Languages & Localization      (language registry, locale registry, level-scale registry, message catalogs)
├─ Content                       (course registry, course-pack loader, validators, coverage reports)
├─ Learning Engine               (activity runtime, SRS/mastery, reward policy, assessment ports)
├─ Learning Surfaces             (vocabulary, grammar, reading, listening, speaking, writing, tutor, daily, tests)
├─ Subscriptions & Entitlements  [F: P8b]  (plans/plan versions, subscriptions, invoices, payment transactions, derived entitlements, usage limits — 11)
├─ BilUp Live  [F: P8c]          (weekly German/English mass interactive classes: schedule, token-gated join, interactions, moderation, attendance; no recording — 10)
├─ Marketplace  [F: after backend]  (catalog, availability, booking, payments, classroom, reviews, dashboards — 09; separate paid service)
└─ Platform services             (storage, speech, PWA/offline, analytics-free diagnostics, API client)
```

### 4.2 Authoritative layering and dependency policy **[R]** *(revised — single source of truth)*

```
L5  app            composition root (dependency wiring), routes, shells
L4  features/*     learning surfaces      marketplace/*   subscription/*   live/*   (frontend modules)
L3  engine         activity runtime, rewards, mastery        core/*   (settings, profile, progress, auth, entitlements)
L2  content        course registry/loader/validators         languages   (registries, message catalogs, resolver)
L1  platform/*     storage, speech, pwa, api-client          ui   (design system)
L0  shared         ids/branded types, MessageRef, time, pure utilities   +   shared/contracts (TYPE-ONLY port interfaces and cross-module data types)
```

**Dependency policy (normative; mechanically enforced by 07 §6):**
1. **Direction.** A module may import only from (a) `shared` and `shared/contracts`, (b) the **public API** (`index.ts`) of modules in **strictly lower** layers, (c) its own internals. Upward imports are forbidden.
2. **No same-layer imports.** Modules in the same layer (e.g. `engine` and `core`; `features`, `marketplace`, `subscription` and `live`; `content` and `languages`; `platform` and `ui`) never import each other — not even through public APIs.
3. **Ports live in `shared/contracts`.** Every cross-module interface (and the data types that cross it, e.g. `ActivityResult`, `MessageRef`, `LearnerSettings`) is declared there as types only (no runtime code, no side effects). The *implementing* module imports the contract; the *consuming* module imports the contract; `app` (L5) wires implementations to consumers. Consumers therefore never import an implementer.
4. **Specific consequences** (all derivable from 1–3, listed for clarity):
   - `engine` ↛ `core`: it receives `ProgressPort`, `SettingsPort`, `CourseCatalogPort` as contracts.
   - `core/progress` ↛ `engine`/`content`: it implements `ProgressPort` and consumes the `CourseCatalogPort` and `KeyValueStore` contracts.
   - `ui` imports only `shared`: localized strings arrive through a `UiText` contract provided by `app` (props or context); `ui` never imports `languages`.
   - `marketplace` ↛ `engine`, `features`, `core`: it consumes `AuthPort`, `SettingsPort`, `ApiClientPort` contracts only. `features` ↛ `marketplace`. The **learning side links to the marketplace with a plain route link** (e.g. `/teachers?lang=de&level=B1`, parameters chosen by the learner); **there is no recommendation port and no code dependency** in either direction. A richer integration is [F] and would be a new `shared/contracts` port wired in `app`.
   - `subscription/*` and `live/*` (new in revision 3) follow the same pattern as `marketplace`: each imports only `shared/contracts`, `platform`, `ui`, `languages`, and consumes `AuthPort`, `SettingsPort`, `ApiClientPort` and `EntitlementsPort` as contracts; none imports `core`, `engine`, `features`, `content` or another L4 module. **Live and the Marketplace do not import each other; neither imports `subscription`.** `EntitlementsPort` is implemented by `core/entitlements` (L3) and is **advisory for UI only** — enforcement is server-side (11 §13).
   - Platform adapters (`localStorage`, IndexedDB, Web Speech, `fetch`, service worker) are referenced only inside `platform/*` (native-readiness [F]).
5. **Cycles are forbidden** at module level and at package-entry level.
6. **Backend** applies the same policy to its modules: modules interact only through contract interfaces and domain events; no module reads another's tables (07 §8, 09).

**Testable policy:** the allowed-edge matrix, the checks and their fixtures are specified in 07 §6 (derived mechanically from this section). A change to this section requires the same change to that matrix in the same pull request.

### 4.3 Module interfaces (illustrative) **[R]** *(revised — all contracts in `shared/contracts`)*
| Contract (declared in `shared/contracts`) | Implemented by (layer) | Consumed by | Wired in |
|---|---|---|---|
| `SettingsPort` | `core/settings` (L3) | engine, features, marketplace, ui-host in `app` | app |
| `LanguageRegistryPort` | `languages` (L2) | content (validator), engine, features | app |
| `CourseCatalogPort` | `content` (L2) | core/progress, engine, features | app |
| `UiText` / `MessageResolver` | `languages` (L2) | `ui` (via props/context), features | app |
| `ProgressPort` (`record(result)`, selectors) | `core/progress` (L3) | engine, features | app |
| `KeyValueStore` (P1; the richer `StorageRepository` is extracted later — 05 §6) | `platform/storage` (L1) | core | app |
| `SpeechPort` | `platform/speech` (L1) | engine, features | app |
| `AssessmentPort` | `engine` (L3) heuristic (now) / remote (later) | features | app |
| `AuthPort` | `core/auth` (L3): anonymous (now) / backend (P8) | app, marketplace | app |
| `ApiClientPort` | `platform/api-client` (L1) (P8) | core/sync, core/entitlements, marketplace, subscription, live | app |
| `EntitlementsPort` (signed `EntitlementSnapshot`; **UI/advisory only**) | `core/entitlements` (L3) (P8b) | features (e.g. tutor usage meter), subscription, live | app |

The former `TeacherRecommendationPort` was removed (review M-5, X-1; see 4.2 point 4).

### 4.4 Frontend/back-end split and the modular monolith
- **Frontend:** one React/TypeScript/Vite SPA (later PWA). Modules are folders with `index.ts` public surfaces; not separate packages initially **[R]** (a monorepo split is possible later without redesign).
- **Backend [F]:** **one deployable modular monolith** (not microservices). Module boundaries are *introduced when a phase needs them*: P8 starts with `identity`, `profile` and an opt-in `sync` endpoint only; **P8b adds `payments` (shared provider/transaction infrastructure), `billing` (plans, subscriptions, invoices) and `entitlements`; P8c adds `live`** (11 §14, 10); marketplace modules (`catalog`, `availability`, `booking`, `classroom`, `reviews`, `moderation`, payouts only if needed, …) are added in P9 stages, each with a short ADR; shared services (notifications, admin) become modules only when they have their own data. Cross-module calls use in-process contract interfaces; an event outbox and job queue are introduced with the first asynchronous need (**P8b: subscription dunning/renewal jobs**), not earlier. See 07 §8 and 09. *(Simplified in revision 2 — review O-5.)*
- **Contracts:** shared TypeScript types / OpenAPI schemas live in a `contracts` area consumed by both sides **[R]**.

### 4.5 Roles **[R]**
`student`, `teacher`, `admin` (Marketplace roles, 09 §2), plus **`live_host`** and **`live_moderator`** for BilUp Live (10 §6.2) — Live staff are *not* Marketplace teachers unless they separately register as such. A user may hold several roles (a teacher can also learn). **Roles are not entitlements:** what a *student* may use (course, tutor, Live join) is decided by entitlements derived from the subscription (11). Authorization is role + resource-ownership based (09 §10, 11 §13). Anonymous/local-only use remains possible for self-study **until the backend exists**; what happens to anonymous/free use once paid plans exist is **unresolved (11 U-01, U-02)**.

---

## 5. Cross-cutting requirements (apply to every module)

| Requirement | Statement | Detailed in |
|---|---|---|
| **No silent locale fallback** | Missing translation never renders another locale's text; build gate + visible runtime marker; verified by **provenance/source tests, never by character detection**; the only exception is a disclosed, time-boxed legacy mode during staged rollout | 02 §5, §7 |
| **Server-side entitlements; configurable plans** | Plan prices, intervals, grants and limits are plan-version configuration, never literals; every protected operation (paid content delivery, tutor, **Live join**) is authorized server-side from entitlements; frontend visibility and `localStorage` are never proof of access | 11 §3, §10, §13 |
| **No recording, anywhere** | No recording, replay, recording storage or recording entitlement exists for BilUp Live **or** Marketplace lessons; the platform cannot technically prevent *external* recording and says so | 10 §9, 09 §13 |
| **Config-driven structure** | Lesson counts, sections per unit, level lists and thresholds come from manifests/registries, never literals (`8`, `'A1'`, `10 units`) | 04 §3, 03 §6 |
| **Course-scoped progress** | Every progress record carries `courseId`; switching course never mixes data | 05 §3 |
| **Idempotent rewards** | XP/mastery change only through `ActivityResult` with idempotency key and policy | 03 §4, 05 §4 |
| **Validated, versioned persistence** | schemaVersion, validation, migrations, backup, recovery | 05 §6–8 |
| **Accessibility** | WCAG 2.2 AA target; 44 px touch targets; focus management | 06 |
| **Privacy by design** | Data minimisation, no card data on our servers, consent for mic/analytics (no recording exists — 10 §9), learner data export/delete | 05 §10, 09 §11 |
| **Testability** | Pure domain logic with unit tests; content integrity tests; visual/a11y tests in CI | 07 §7, 08 |
| **Honest assessment labelling** | Heuristic scores are "practice feedback", never certification | 03 §7 |

---

## 6. Preserve / refactor / redesign

| Decision | Items |
|---|---|
| **Preserve** (keep working behaviour; re-home under new modules) | Topic lesson flow; `Question` abstraction; SRS algorithm; weak-concept/article-drill recommendations; unit curriculum structure and all existing German A1 content; design tokens and primitives; speech wrapper (behind `SpeechPort`); TutorChat rendering approach (no HTML injection); strict TS settings |
| **Refactor** | `AppProvider` → `core/settings` + `core/progress` + `platform/storage`; `questions.ts` / `analysis.ts` / `tutor.ts` → return `MessageRef`s; progress keys → typed `ActivityRef`; duplicated level-chip and speaking blocks; router → typed route table + lazy routes |
| **Redesign** | Language model & settings; onboarding; navigation IA; tablet layout; dialog/a11y; icon system; Reading interaction; placement/assessment semantics; content schema (language-neutral items + locale bundles) |
| **New** | Course registry & packs; content validation/coverage tooling; PWA; backend boundary; marketplace |

---

## 7. Release and scope slices **[R]**

| Slice | Contents | Gate |
|---|---|---|
| **G0 – Decisions & staffing gate** | No code. Approve minimum launch scope, content staffing (04 §13), Kyrgyz reviewers, backend/legal decision plan | Signed decision record (08 §3 G0) |
| **R0 – Stabilised MVP** | P0–P1: CI, tests, integrity fixes, safe persistence | Review's recommended first milestone met |
| **R0b – Installable (lite)** | P0b: manifest, icons, minimal app-shell service worker (no data caching, hash routing unchanged) | Installability pass + kill-switch tested |
| **R1a – Multilingual German, Russian first** | P2–P3 (ru track): language model, `de-general` pack, strict locale policy for Russian, `uiLocale`/`explanationLocale` settings | Russian release gate G-ru (04 §7.3) |
| **R1b – Kyrgyz** | P3 (ky track): Kyrgyz explanation and UI **not public** until Kyrgyz release gate G-ky (completeness **and** native-review quality) passes; until then Kyrgyz users keep the disclosed legacy experience (02 §5.3) | Gate G-ky |
| **R1c – Professional experience** | P4–P5: engine consolidation, onboarding, responsive tablet, accessibility | a11y/visual gates (06 §9) |
| **R2 – Offline** | P6: offline course packs, update flow | Offline lesson pass |
| **R3 – Courses** | P7: English A1 (with English language pack), then A2–B2 per language, per-level and per-locale release | Per-level/per-locale gates |
| **R4 – Accounts & sync** | P8 backend foundation (minimal) | Security review |
| **R4b – Subscriptions** | P8b: plans/plan versions (BilUp Basic 99 KGS, BilUp Premium Live 149 KGS as configuration), subscription lifecycle, entitlements, fake payment provider, AI-tutor usage limits, entitlement-gated content delivery | fake provider only until **S-D** (11 §15.3); no live charge before it |
| **R4c – BilUp Live** | P8c: weekly German/English Live sessions, token-gated join, interactions, moderation, attendance — no recording | fake classroom provider until **L-D** (10 §18); needs R4b |
| **R5 – Marketplace** | P9 (needs P8; independent of R4b/R4c; fakes/sandbox first); **real transactions only after legal and payment decisions are approved** | Decision record P9-D (09 §1.1) |

Details, risks and acceptance criteria: [08](08_MIGRATION_ROADMAP.md).

---

## 8. Architecture decision summary (ADR index) **[R]**

| ADR | Decision |
|---|---|
| ADR-01 | Keep React + TypeScript + Vite; incremental refactor, no rewrite |
| ADR-02 | Four independent settings: `uiLocale`, `explanationLocale`, `targetLanguage`, `courseId` |
| ADR-03 | Strict locale policy: no cross-locale fallback; build gate + runtime marker; verified by provenance tests. **Amended:** during staged rollout a *disclosed, time-boxed legacy mode* is permitted for the pre-existing Kyrgyz path until gate G-ky (02 §5.3); new-architecture code never falls back |
| ADR-04 | Language-neutral content items + per-locale translation bundles (replaces `de/ru/ky` property names) |
| ADR-05 | Config-driven course structure; level scale and section lists from manifests |
| ADR-06 | One `ActivityResult` contract; idempotent reward policy; course-scoped progress |
| ADR-07 | Persistence behind a thin validated store; **durable derived state + permanent compact credit ledger; raw results are a bounded buffer** (05 §2–§4); versioned and migrated; sync metadata deferred to P8 |
| ADR-08 | Layered modular monolith (frontend and backend); ports in `shared/contracts`; single authoritative dependency policy (§4.2) enforced by tooling; backend modules introduced per phase; no microservices |
| ADR-09 | Provider abstractions for payments and video (capability-based); marketplace behind feature flag; **no real transactions before legal/payment approval** |
| ADR-10 | PWA in two steps: installability lite (P0b, hash routing kept) then offline packs (P6); history routing only if a requirement demands it |
| ADR-11 | Separate booking, payment, lesson and payout state machines linked by domain events |
| ADR-12 | Teacher profile and teaching offer are separate aggregates |
| ADR-13 | Staged localization rollout with per-(course, level, locale) release gates; Russian first, Kyrgyz public only after completeness **and** quality gates (02 §5.3, 04 §7) |
| ADR-14 | A *language pack* (analyzers, error explanations, writing/speaking feedback, tutor knowledge, speech config) accompanies every target language and is part of course completeness (04 §2) |
| ADR-15 | Marketplace charges at booking confirmation (capture), not long-lived authorization holds; funds-holding model decided by legal/provider ADR (09 §9.2, §12) |
| ADR-16 | `explanationLocale` is a presentation setting: changing it never changes `courseId`, progress or history (02 §2.4) |
| ADR-17 | **Subscription model:** two plans (BilUp Basic, BilUp Premium Live) defined as configurable, immutable *plan versions*; plan definition, subscription, invoice, payment transaction and entitlement are five independent concepts with separate lifecycles (11 §4–5) |
| ADR-18 | **Entitlements are the only access mechanism:** code asks for capabilities, never plan codes; all enforcement is server-side; frontend entitlements are advisory UX (11 §10.4, §13) |
| ADR-19 | **BilUp Live is its own module and product,** separate from the Marketplace; token-gated server-side join; **no recording or replay anywhere in the architecture** (10) |
| ADR-20 | Subscription payments and Marketplace payments share only low-level provider infrastructure (`payments` module, purpose-tagged); records, entitlements and reconciliation stay separate (11 §9, §14) |

---

## 9. Unresolved questions and assumptions (global register)

| # | Item | Type | Blocks |
|---|---|---|---|
| Q1 | Retire the `de` **UI** locale (current `de.ts`) or keep it dormant for a future German UI? Initial scope says UI = `ky`,`ru` only. Proposal: keep file, exclude from registry until requested. | Decision | P2 |
| Q2 | Who authors and reviews Kyrgyz content (UI, explanations, ~202 exercise rationales, listening/reading translations)? Native-speaker reviewer availability is unverified. Resource model and estimate: 04 §13. | [A] resource — **G0 gate** | P3 (start in P0) |
| Q3 | English course scope per level (A1–B2) and who writes it; source of truth for CEFR-aligned syllabus; English language-pack authorship. Estimate: 04 §13. | [A] resource — **G0 gate** | P7 |
| Q15 | Approve the **minimum launch scope** (04 §13.1): German A1 (ru, then ky), then English A1 (ru, ky); A2–B2 staged | Decision — **G0 gate** | P2/P3/P7 |
| Q16 | Quality-gate thresholds for Kyrgyz and Russian release (sample size, accepted critical-error rate) | Decision — G0 gate | R1a/R1b |
| Q17 | Marketplace payment model: charge-at-booking vs. deferred charge; who may hold funds; refund/dispute windows (09 §12) | [A] legal/provider — **P9 prerequisite** | P9c/P9d |
| Q18 | **Subscription/pricing decisions U-01…U-20** (free tier or trial, existing-MVP users, payment provider/legal/tax, renewal mode, grace/retry, AI fair-use values, upgrade/downgrade/cancel/refund policy, price-change policy, offline lease, account sharing, cost model). **Authoritative list: 11 §16.** Real charges are blocked until decision record **S-D** (11 §15.3) | Decision / [A] legal+business — **P8b prerequisite for live charges** | P8b |
| Q19 | **BilUp Live decisions L-01…L-14** (spoken instruction language, times/timezone, provider, material localization, realtime transport, retention, level bands, watermarking, schedule visibility, staffing, minors, XP). **Authoritative list: 10 §18.** Real-participant pilot blocked until decision record **L-D** | Decision / [A] — **P8c prerequisite for a pilot** | P8c |
| Q4 | Course variants per language (general, exam-prep, business) — one `de-general` and `en-general` initially; registry already allows more. | Decision | P2 |
| Q5 | Cloud sync required for R1a–R1c, or only after accounts (R4)? Proposal: local-first, sync at R4. | Decision | P8 |
| Q6 | Backend language/runtime and hosting (proposal: TypeScript/Node modular monolith + PostgreSQL). | Decision | P8 |
| Q7 | Target markets, currencies and **payment provider availability** (e.g. Kyrgyzstan, Russia, EU). Provider capabilities and legal ability to pay out to teachers are unverified. | [A] legal/business | P9 |
| Q8 | Marketplace commission model, payout schedule, refund/cancellation policy defaults, tax/VAT handling. | Decision | P9 |
| Q9 | Teacher verification depth (ID, qualifications, background checks for minors?) and legal liability. | [A] legal | P9 |
| Q10 | Video provider for the Marketplace (and, separately, for Live — L-03). **Recording is prohibited for all lessons and sessions (decided in revision 3; 10 §9) — no longer a question.** Minors: Q11. | Decision | P8c/P9 |
| Q11 | Are minors users (age gating, guardian consent)? | [A] legal | P8 |
| Q12 | Brand name in UI: "BilUp Til" vs "BilUp Deutsch" (the product now covers two languages → "BilUp Til"). | Decision | P5 |
| Q13 | Offline scope for PWA: app shell only (P0b), or downloadable course packs per level (P6)? Proposal: shell first, packs later. | Decision | P0b/P6 |
| Q14 | Whether `dist/` matches current source; real-device matrix (iOS Safari, Android Chrome) availability. | [A] | P5 |

Per-document open items are listed at the end of each document and are consistent with this register.
