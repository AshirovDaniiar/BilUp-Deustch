# 10 — BilUp Live Architecture

Part of the BilUp Til 2.0 set ([01](01_PRODUCT_ARCHITECTURE.md)). Labels as in 01 §0.1 (**[V] [R] [A] [F]**).

> **Provenance of this document.** The review task for revision 3 asked to update `10_BILUP_LIVE_ARCHITECTURE.md` "if it exists". **It did not exist** (checked in the working tree, `git` history — a single commit — and the whole project directory; no Live, subscription or pricing documentation existed either). Because the approved Live rules must be captured somewhere and the consistency review needs a document to check, this file was **created in revision 3** as a baseline derived **only** from the approved rules; everything not approved is listed as an unresolved decision in §18 and is **not** decided here. Commercial terms (plans, prices, entitlements) are in [11](11_SUBSCRIPTION_AND_PRICING_ARCHITECTURE.md).
> **[V]** Nothing in this document exists in the repository: no backend, no realtime, no video, no accounts.

---

## 1. Purpose and scope
BilUp Live is the **mass interactive classroom** of BilUp Til: two weekly 60-minute sessions (one German, one English), each conducted by one teacher for potentially hundreds of students, included in **BilUp Premium Live (149 KGS/month)** and **not** in BilUp Basic. This document defines its architecture. It does not define pricing (11), the Marketplace (09) or course content (04).

## 2. What BilUp Live is — and is not

| | **BilUp Live** | **Marketplace lesson** (09) | **Passive webinar** |
|---|---|---|---|
| Audience | hundreds, mixed levels A1–B2 | 1 student (group lessons [F]) | any |
| Host | Live teacher engaged by the platform (`live_host`; staff/contractor model undecided — L-10); **not** a Marketplace teacher | independent teacher | any |
| Interaction | polls, quizzes, chat, Q&A, speaking challenges (§8) | free-form 1:1 | none/minimal |
| Sold as | part of Premium Live subscription | per lesson, teacher's price | — |
| Access check | subscription **entitlement** `live.de`/`live.en` (11) | paid booking (09) | — |
| Recording/replay | **none, ever** (§9) | **none** (09, revised in revision 3) | — |
| Records | `LiveSeries`, `LiveSession`, attendance (§4) | `Booking`, `Lesson` | — |

Rules: BilUp Live **must not** be modelled as a Marketplace lesson or as a "group lesson" of the Marketplace (09 §16 refers to small-group lessons by independent teachers, a different, future thing); a Live host does not appear in Marketplace search unless that person independently registers as a Marketplace teacher.

## 3. Approved rules and traceability

| # | Rule (approved) | Where enforced |
|---|---|---|
| L1 | One weekly **German** session and one weekly **English** session; separate sessions | §4 (`LiveSeries` per language), §5 |
| L2 | **Both** included in Premium Live; **not sold separately**; Basic cannot join | 11 §1–3; §6 |
| L3 | 60 minutes each; one teacher per session; potentially hundreds of students | §4, §16 |
| L4 | All levels A1–B2 in the same stream; differentiated tasks A1–A2 and B1–B2 | §10 |
| L5 | Polls, quizzes, chat, Q&A, speaking challenges; attendance tracking; materials | §8, §13 |
| L6 | Weekend, preferably Saturday; **exact times configurable and undecided**; timezone configurable | §5 |
| L7 | **No recordings, no replay, no recording storage, no recording library/entitlements**; provider auto-recording disabled; platform cannot prevent external recording (documented) | §9 |
| L8 | Retain only permitted educational metadata, attendance, chat, quiz results under documented retention | §13 |
| L9 | Not a marketplace lesson, not a passive webinar | §2, §14 |

---

## 4. Domain model (conceptual)
```
LiveSeries (one per target language)  ─── LiveSchedule (weekly rule: weekday, local start, duration 60 min, canonical IANA zone)
   └─ LiveSession (one occurrence; UTC start/end; status; host; capacity; provider room reference)
        ├─ SessionPlan (agenda blocks; tasks per level band; materials; poll/quiz definitions)
        ├─ Participation (account × session: tokenIssuedAt, joinedAt, leftAt, durationSeconds, band)
        ├─ Interaction (poll response | quiz answer | question | chat message | challenge turn) — retained per §13
        ├─ LiveMaterial (teacher-authored files; §9 allow-list)
        └─ ModerationAction (mute | slow-mode | delete | remove | ban) + LiveBan
LevelBand (configuration): { bandId, label (localized), levelIds[] }  e.g. a band covering the A1–A2 levels and one covering B1–B2 — defined in configuration from the level scale (02 §2.2), not hard-coded
```
- `LiveSeries.targetLanguage` is a `LanguageCode` from the registry (02); adding a third language later is a new series, not a code change.
- **Session status:** `scheduled → open_lobby → live → ended`; `cancelled` and `rescheduled` are terminal for an occurrence. Status is independent of subscription status and of any payment state (11 §4).
- **Entitlement keys** used: `live.de`/`live.en` (join), `live.chat`, `live.interact`, `live.materials`, `live.attendance.view` (11 §3.1).

## 5. Scheduling, time zone and daylight saving
- A `LiveSchedule` stores a **local-time rule** (`weekday`, `startLocalTime`, `durationMinutes = 60`, `canonicalZone`) with an **IANA zone id that is configuration**, not a constant. Initial intent: weekend, preferably Saturday; **start times are undecided (L-02)**. The two languages may be on the same or different weekend days/times.
- **Occurrence generation:** a job materialises `LiveSession` rows N weeks ahead, converting the local rule to **UTC instants** with a tz database. **DST rules:** (a) a local time that does not exist (spring-forward) or exists twice (fall-back) is resolved by an explicit policy (shift forward / first occurrence) recorded in the schedule; (b) the schedule is anchored in the canonical zone, so **for learners whose own zone differs and observes DST, the session's local start time shifts on their clock when either zone changes offset**; the UI must show the start in the viewer's zone with the zone label and flag upcoming shifts; (c) the architecture **assumes nothing** about whether the canonical zone observes DST.
- **Exceptions:** per-occurrence cancel/reschedule/substitute-host; changes trigger notifications (chrome, `uiLocale`) and an audit entry. Public holidays/skip weeks are configuration.
- **Entry window:** lobby opens at `T − lobbyMinutes` (configurable); join closes at `T + lateJoinMinutes` (configurable, **L-02**).
- All times are server-authoritative; the client clock is never trusted for join windows.

## 6. Access control and join flow (server-side)

### 6.1 Flow
1. An authenticated learner opens the Live schedule. **Visibility is not entitlement** — whether Basic and unsubscribed accounts see the schedule/upgrade teaser at all is **unresolved (L-09)**; if they do, seeing it grants nothing.
2. Learner requests **join** → `POST /live/sessions/{id}/join`.
3. Server checks, in order: session status and join window; account not banned from the series/session; **`EntitlementPort.check(account, 'live.<language>')`** (11 §8); capacity; one-active-connection rule.
4. On success the server asks the `ClassroomProvider` port for a **participant token** (§7) — short-lived, bound to `{accountId, sessionId, role=participant}` — and returns it. On denial it returns a **reason code** (`not_entitled`, `session_not_open`, `banned`, `full`, …) which the UI renders as a **localized chrome message** (uiLocale).
5. The client connects to the provider with the token. **There is no static, shareable room URL.**

### 6.2 Roles and tokens
| Role | Issued to | Capabilities |
|---|---|---|
| `participant` | entitled students | receive stream, chat (if `live.chat`), interact (if `live.interact`), no publishing unless promoted for a speaking challenge (§8) |
| `moderator` | assigned staff | participant powers + mute, slow-mode, delete messages, remove/ban, approve Q&A |
| `host` | the session teacher | moderator powers + publish, start/end, manage polls and challenges |
Tokens carry the role claim; **role is never taken from the client**.

### 6.3 Controls
- **Basic and unsubscribed accounts always receive `not_entitled`**; a valid-looking join URL, session id or previously seen token confers nothing (§6.4 describes the one residual case).
- Token TTL is a few minutes **[A]**; refresh re-runs the entitlement check; tokens are single-use where the provider supports it.
- **One active connection per account:** a second join evicts the first.
- Account/IP anomaly detection (many token requests, many accounts from one device) feeds moderation and rate limits.
- **Rooms are provider-private:** the provider room must be unlisted and **inaccessible without a token**; a provider that cannot guarantee this is **not eligible** (§7 capability gate).
- **Entitlement lapse mid-session:** default **[R]** do not eject an already-connected participant; the next join is denied. Moderation removal is independent. (Grace behaviour: 11 U-05.)
- Frontend visibility, `localStorage` and the signed offline entitlement snapshot are **never** accepted as proof for Live; Live does not work offline.

### 6.4 Residual risk (documented)
A participant token is a **bearer credential**; within its TTL it works for whoever holds it. Mitigations (short TTL, single use, one connection per account, identity visible to moderators, eviction on duplicates, anomaly flags) **reduce** sharing but cannot prevent a determined entitled user from letting another person watch over their shoulder or screen-share. Likewise **the platform cannot technically prevent participants from recording externally** (screen/audio capture on their own devices) — see §9.3.

## 7. Provider abstraction
Live uses the same `ClassroomProvider` **port** family as the Marketplace (07 §9) with a **different capability requirement and separate adapter configuration**.

**Required capabilities for a Live-eligible provider (capability gate):** `supportsTokenAuth` (per-participant tokens with role claims), `maxParticipantsPerRoom` ≥ configured Live capacity (hundreds), `supportsPublisherPromotion` (promote/demote a participant to speaker), `supportsParticipantEjection`, `supportsRoomLockdown` (no anonymous join), **`canDisableAutoRecording = true` and verified**, `supportsWebhooks` (join/leave), `supportsLargeAudienceMode` (few publishers, many viewers). A provider failing any item is ineligible. **No provider is chosen (L-03).**

Port operations (illustrative): `createRoom(session, config)`, `issueJoinToken(role, accountId, sessionId, ttl)`, `promote/demote`, `eject`, `endRoom`, `getRoomState`, `verifyWebhook`. **The port has no recording operation** (no `getRecording`, no `startRecording`, no egress/archive API). Provider configuration is a versioned config object whose schema **cannot express** "recording enabled"; a contract test asserts that the room is created with recording, transcription-storage and cloud-archive features disabled, and a periodic audit job re-reads provider room settings (§9.2).

## 8. Mass interactive features
Design constraints: hundreds of concurrent participants, one host, a few moderators; low server fan-out cost; abuse resistance; **no audio/video capture by BilUp**.

| Feature | Design |
|---|---|
| **Polls and quizzes** | defined in `SessionPlan` (per level band, per `explanationLocale` text — §12); host opens/closes; answers submitted over the realtime channel; **scored server-side**; aggregated results broadcast (counts, not individual answers); individual results stored per §13 |
| **Chat** | gated by `live.chat`; **slow mode** (per-user rate), message length cap, link/PII filtering, profanity filter [A], message deletion, per-user mute; chat may be switched to **moderated mode** (messages visible after approval) for peak moments; **no private messages** between participants or with the host |
| **Q&A** | participants submit questions (`live.interact`); questions enter a **moderator queue**, can be up-voted; the host answers from a ranked list; duplicates grouped by moderators |
| **Speaking challenges** | the host promotes **one participant at a time** (or a small number) to speak through the provider; selection by raise-hand queue or random draw **within the level band**; participants are demoted automatically at timeout. **BilUp does not capture, store, transcribe or send this audio for analysis** (§9). Alternative non-audio challenge formats (typed answers, choose-the-best-sentence polls) are preferred for the mass audience |
| **Level-differentiated tasks** | §10 |
| **Reactions/hand-raise** | lightweight events, rate-limited |
| **Materials** | §9.4 |

**Realtime transport (L-05, undecided):** polls, chat and Q&A need a realtime channel. Options: the provider's data channel/chat (capability-dependent) or a WebSocket/SSE endpoint in the existing modular monolith. **No new infrastructure category is introduced by this document**; capacity (a few hundred connections per session, two sessions per week) must be validated in P8c before choosing. The `live` module talks to a `RealtimeChannel` contract so the choice is replaceable.

## 9. Recording prohibition

### 9.1 What is prohibited (everywhere in the architecture)
No recording of video, audio or screen; no replay; no storage of any media derived from a session; no recording library; no recording-related entitlement or plan feature; no live transcription stored as a recording substitute; no "highlights" or clips. This applies to **BilUp Live and, as a global rule from revision 3, to Marketplace lessons** (the earlier optional `getRecording`/consent-gated recording in 07/09 was removed).

### 9.2 Technical controls
1. **Provider auto-recording disabled wherever the provider supports a setting**; eligibility requires the setting to exist and be verifiable (§7). Cloud recording, composite/egress recording, auto-transcription and auto-captions-with-storage are disabled.
2. The provider port and provider config schema **contain no recording operations or flags** (§7).
3. **Contract test** (provider sandbox) asserts recording-related settings are off at room creation; **audit job** compares live room settings to policy at start and periodically (alerts and room termination on drift).
4. **Static CI check:** the codebase must not contain recording APIs or flags (`getRecording`, `startRecording`, `egress`, `recording: true`, `MediaRecorder` use in Live code) — allow-listed exceptions only for the existing browser **speech-recognition** feature of the self-study app (04/03; unrelated to Live and not stored).
5. **No recording-related entitlement key** exists in the catalog (11 §3.1); a test asserts the catalog contains none.
6. **Upload allow-list:** Live materials accept document/image/text types only; **video and audio uploads are rejected**, to prevent re-introduction of recordings as "materials".
7. No server-side media pipeline exists: BilUp servers never receive Live media.

### 9.3 What the platform cannot prevent (documented limitation)
**BilUp cannot technically prevent participants from recording a session externally** (screen recorders, phone cameras, audio capture, third-party software). Controls are limited to: terms of use and code of conduct forbidding recording and redistribution; participant-identity-bound access (so leaks are attributable within limits); optional **visible/semi-visible participant watermarking** as a deterrent (**L-08**, undecided); moderator vigilance; takedown/ban procedures. The product must not promise that sessions cannot be recorded.

### 9.4 Educational materials are not recordings
`LiveMaterial` = teacher-authored artefacts (slides/PDF, worksheets, vocabulary lists, quiz keys). They are produced **before or after** the session by the teacher, not captured from it. Policy: materials must not contain captured session media; access requires `live.materials`; post-downgrade access is **L-11 / 11 U-11**.

### 9.5 Retention of the permitted data
See §13. Retained categories are limited to **educational metadata, attendance, chat and quiz results**, under documented retention periods **(values are decisions, L-06)**.

## 10. Level-differentiated tasks
- One stream for A1–B2; the `SessionPlan` contains **task variants per `LevelBand`** (configuration-defined bands; initial intent: one band for A1–A2 and one for B1–B2, **not hard-coded**).
- **Band assignment (L-07, undecided):** options — learner self-selects per session; default from the learner's course progress (requires sharing level data with the Live service — a consent/privacy matter); or a mix. Until decided, the architecture supports self-selection with a stored `Participation.band`.
- Polls/quizzes/challenges can target **all participants** or **a band**; the host UI shows participation per band; results aggregate per band.
- Task text, answer feedback and instructions are **instructional text** in the participant's `explanationLocale` (§12); the target-language content is shared.
- The language level data used here belongs to the **learner's course settings** (02, 05); the Live module **does not import** the learning modules (01 §4.2) — band is supplied by the learner at join or via an explicit, consented API field.

## 11. Moderation and participant safety
| Area | Requirement |
|---|---|
| **Roles** | `host`, `moderator` (assistant moderators scale with audience; staffing is **L-10**), `admin` (platform) — separate from Marketplace roles |
| **Tools** | mute, slow-mode, chat lock, message deletion, remove from session, ban (session/series/platform), Q&A approval queue, panic button (lock chat + mute all), participant list with account identity visible to moderators only |
| **Participant privacy** | participants appear by **display name/nickname**; no email/phone shown to other participants or the host; **cameras off by default** for participants; no private messaging; participants cannot see each other's profile data |
| **Conduct** | code of conduct accepted before first join (versioned consent record); prohibited: harassment, personal data sharing, recording/redistribution (§9.3), spam; reporting flow ("report message/user") |
| **Evidence** | moderation actions and reported messages are retained per §13 for dispute handling |
| **Minors** | whether under-18 learners may participate and what safeguards apply is **unresolved (Q11 / L-12)**; no assumption is made |
| **Teacher conduct** | hosts and moderators sign a conduct policy; they have no access to participants' contact data; access to attendance/chat data is role-limited and audited |
| **Incidents** | incident log, escalation path, ability to end a session immediately (`endRoom`) |
| **Abuse resistance** | per-account/IP rate limits on chat and interactions; mass-join protection; verified accounts only (no anonymous participation) |

## 12. Language and localization
- **Chrome** (schedule, lobby, buttons, denial reasons, moderation notices) → `uiLocale` (02 §3). 
- **Instructional Live content** (poll/quiz text, task instructions, feedback, materials) → **`explanationLocale`**; target-language content → `targetLanguage`; chat messages are **user-generated** and language-tagged, never machine-translated or substituted (02 §5.1).
- Consequence: **every published Live poll/quiz/task/material needs `ky` and `ru` versions** (or an explicit "not available in your language" state). No cross-locale fallback applies to Live content either; provenance tests (02 §7) apply. This adds recurring weekly translation work that is **not included** in the estimates of 04 §13 (**L-04**).
- **Spoken instruction language (L-01, the largest open Live decision):** one teacher speaks to a mixed audience of Kyrgyz- and Russian-speaking learners. Options: target-language immersion (German/English) with locale-specific written materials; a bilingual teacher; locale-specific breakout/Q&A channels; a co-host per locale. The "complete Kyrgyz/Russian" requirement (01 §0.2) covers **written learner-facing material**; it **cannot** be met for live speech by one teacher in one language. **Not decided here.**

## 13. Attendance, progress, data and retention
- **Attendance** is a **server-side Live record**: `joinedAt`/`leftAt` from our join endpoint and provider webhooks; `durationSeconds`; `attended` computed by a configurable threshold (e.g. minimum minutes; **L-06**). It is shown to the learner on the dashboard via API (entitlement `live.attendance.view`, 11 U-12).
- **Progress boundary:** Live attendance and quiz results are **not** written into the local credit ledger/XP (05 §4.3) in v1, because the local store is untrusted and Live is server-authoritative. Whether Live participation grants XP/streak/badges is **unresolved (L-13)**; if yes, the server issues signed results through the P8 sync path.
- **Retained data (permitted):** attendance records; poll/quiz answers and scores; chat messages and moderation actions; session plans/materials metadata. **Not retained:** any media.
- **Retention periods** per data class are **decisions (L-06)**; the architecture requires a documented table (class, purpose, period, deletion method) before launch; user export/deletion rights apply (05 §10; legal basis **[A]**).
- Live data lives in `live`-module tables, separate from billing and learning data.

## 14. Marketplace separation
Live and Marketplace share **no entitlement, no booking, no payment flow and no records**. They may share only low-level, purpose-isolated infrastructure: the `ClassroomProvider` port definition and, in the backend, the shared `payments` module for **subscription** money (11 §9). A Live host is not a Marketplace teacher; Marketplace lessons are not sessions of a `LiveSeries`; no plan includes Marketplace lessons.

## 15. Security and privacy
Server-side entitlement and token issuance (§6); provider secrets server-side; webhook signature verification and idempotency; RBAC with moderator/host scopes; audit log for moderation and admin actions; rate limits; data minimisation (nicknames, no contact data exposure); no media on our servers; CSP/permissions policy (camera/mic only if a participant is promoted); privacy notice stating that **BilUp does not record Live sessions but that others may**.

## 16. Capacity and operations
- **Concurrency planning:** peak concurrency per session ≈ Premium Live subscribers × attendance share (11 §12.5 gives illustrative tables, e.g. 600 concurrent for 1,500 subscribers at 40 %). The chosen provider must support at least the planned maximum with headroom; `LiveSession.capacity` is configurable and enforced at join (`full` reason).
- **Load/failure plan:** provider outage → status banner, reschedule or cancel with the compensation policy (11 U-10); host no-show → substitute host procedure; moderator staffing per attendance band **[A]**.
- **Observability:** join success/failure rate, token requests, concurrent connections, chat rate, moderation actions, provider health; no media metrics beyond what the provider exposes.
- **Dry runs:** a rehearsal session with a synthetic audience before each launch phase.

## 17. Delivery phase and tests (P8c; see 08)
**Prerequisites:** P8 (identity), **P8b** (subscriptions/entitlements), P5 (responsive shell), decision record **L-D** (§18). Development uses a `FakeClassroomProvider` and fake payments; **no live pilot with real participants or money until S-D (11 §15.3) and L-D are approved.**

| Stage | Contents |
|---|---|
| **P8c-1** | series/schedule/occurrence generation incl. DST, session lifecycle, admin console for schedule/exceptions |
| **P8c-2** | join flow, token issuance via fake provider, access-control tests, attendance |
| **P8c-3** | realtime interactions (polls/quizzes/chat/Q&A), moderation tools, level bands, materials |
| **P8c-4** | real provider adapter (sandbox), capability gate, recording-disabled audit, rehearsal; pilot only after L-D |

**Tests required:** DST table tests (spring-forward/fall-back, canonical zone with and without DST, viewer zones); occurrence-generation idempotency; **Basic/unsubscribed `403`** on join for valid session ids; token binding (other account rejected), expiry, single use, eviction of duplicate connections, role escalation attempts; direct provider URL without token rejected (provider contract test); capacity enforcement; chat slow-mode/rate-limit/moderation actions; poll scoring correctness and band targeting; attendance threshold computation; **recording-prohibition tests** — provider contract (recording settings off), audit-job drift detection, static CI ban on recording APIs/flags, no recording entitlement key in the catalog, upload allow-list rejects audio/video; localization provenance for Live content; load test at planned peak with synthetic clients; privacy tests (retention job, export/delete).

## 18. Unresolved decisions (Live) — authoritative list; mirrored by Q19 in 01 §9
| ID | Decision |
|---|---|
| **L-01** | Spoken instruction language of Live sessions for a mixed Kyrgyz/Russian audience (§12) |
| **L-02** | Exact weekend days, start times, canonical timezone, lobby and late-join windows; DST resolution policy |
| **L-03** | Live video/streaming provider (must pass the capability gate, §7) and its pricing |
| **L-04** | Authoring/translation workflow and staffing for weekly Live materials in `ky` and `ru` |
| **L-05** | Realtime transport for polls/chat/Q&A (provider channel vs own endpoint) |
| **L-06** | Retention periods per data class; attendance threshold definition |
| **L-07** | Level-band assignment (self-select vs derived from progress with consent) |
| **L-08** | Whether to use participant watermarking as a deterrent |
| **L-09** | Whether Basic and unsubscribed users see the Live schedule/teasers |
| **L-10** | Live teacher/moderator staffing model and ratios (platform-engaged host; who moderates hundreds) |
| **L-11** | Post-downgrade access to Live materials (= 11 U-11) |
| **L-12** | Participation of minors and safeguards (= Q11) |
| **L-13** | Whether Live participation grants XP/streak/badges |
| **L-14** | Compensation when a session is cancelled/shortened (= 11 U-10) |
| **L-D** | **Decision record for Live:** L-01–L-10, L-12, provider contract, data-protection basis, moderation staffing, incident process — approved before any real-participant pilot |
