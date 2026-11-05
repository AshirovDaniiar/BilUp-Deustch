# 05 — Progress and Storage

Part of the BilUp Til 2.0 set ([01](01_PRODUCT_ARCHITECTURE.md)). Addresses **V-04, V-05, V-06 (denominator), V-07, V-08, V-15, V-17**. This area is the **first implementation milestone** recommended by the Review (progress integrity and recoverable persistence) and is phase **P1** in [08](08_MIGRATION_ROADMAP.md).

---

## 1. Verified current state

| Fact [V] | Evidence |
|---|---|
| One context provider owns profile, progress, tutor chat, theme, persistence and a timer; the whole state is a single context value (every `useApp()` consumer re-renders on any change) | `app/store.tsx:30-40,57,64-110,113-114` |
| Persistence: `JSON.parse(raw) as Partial<UserProgress>`, shallow merge into defaults (only `scores`/`tutor` merged deeper); key `bilup-deutsch:v1` is a name, not a schema version; errors silently ignored; full JSON written on **every** state change | `store.tsx:7,30-40,64-70` |
| Study time: `setInterval` every 15 s adds 15 s whenever `document.visibilityState === 'visible'`, idle or not; each tick replaces global state | `store.tsx:80-88` |
| Completion set `completed: string[]` written with free-form keys; `complete()` is idempotent per key but XP is separate and not | `store.tsx:97`; Review §3 |
| Rewards written from many components (see 03 §1) | |
| Data shape: `UserProgress{ name, lang, theme, level, xp, activeDates, studySeconds, completed, mastery, saved, mistakes, scores, daily, tests, weeklyGoal, tutor }` — single global, **no course scope** | `data/types.ts:176-193` |
| Caps in place: `activeDates` ≤ 400, `mistakes` ≤ 300, `scores` ≤ 30/skill, `tests` ≤ 50, tutor ≤ 60 msgs | `store.tsx:92-109` |
| Default profile `name: 'Daniiar'` | `store.tsx:11-13` |
| No export/import, no recovery UI, no multi-tab handling | repo |
| `level` is a profile field set only via `setProfile`; `HomeScreen` and `ProgressScreen` hard-code "A1" labels | `HomeScreen.tsx:69-70`; `ProgressScreen.tsx:34` |

---

## 2. Principles **[R]**

1. **Results are the *input*; durable derived state plus a permanent compact credit ledger are the *record*.** *(revised — review H-4)* Every `ActivityResult` is processed once. Its effects are written to **durable derived state** (completion records, mastery per item, per-item credit, XP totals, daily rewards) and to an **append-only credit ledger** (§4.3). Raw results (item-level detail) are a **bounded audit/sync buffer** that may be archived or pruned (§4.4) **without changing any total, completion or credit**. XP, completion, streaks, mastery, mistakes, badges are projections of the durable state.
2. **Course-scoped.** Every progress record carries `courseId`. `explanationLocale` is never part of a key (02 §2.4).
3. **Idempotent and reproducible.** Applying the same result twice is a no-op (idempotency key `resultId`). **Reproducibility is defined over the credit ledger and snapshot, not over raw results:** totals and completion can always be re-derived from the ledger (§4.3). Replay of raw results is valid only within the retained window and is used for diagnostics and sync, not as the source of historical truth. *(Replaces the earlier "state can be rebuilt by replaying the log", which contradicted pruning.)*
4. **Validated, versioned, migratable storage**, with recovery rather than silent reset.
5. **Persistence is an adapter.** `core` uses a storage contract (`shared/contracts`, 01 §4.3); `localStorage` is only an adapter detail inside `platform/storage`.
6. **Sync-ready by identifiers only; sync metadata deferred.** *(simplified — review O-1)* P1 records carry globally unique ids (uuid `resultId`, `creditId`) and `createdAt`. `deviceId`, per-device sequence numbers and conflict metadata are **not** introduced until P8, when they are added by an ordinary migration; nothing in P1 blocks that.
7. **Small, separate stores.** Settings, progress, tutor history, saved items are separate keys/tables — a tutor transcript must not be rewritten on every XP change (V-17).

---

## 3. Course-scoped data model **[R]**

```ts
// illustrative contract — not implemented
interface LearnerStateRoot {
  schemaVersion: number;
  learnerId: string;                        // local uuid now; server id after sign-in (P8)
  settings: LearnerSettings;                // 02 §2.1 (four independent settings + theme)
  profile: { displayName: string | null; weeklyGoalDays: number; … };   // no default personal name (V-15)
  enrollments: Record<CourseId, CourseEnrollment>;
}
interface CourseEnrollment {
  courseId: CourseId; startedAt: number;
  selfDeclaredLevel?: LevelId;              // optional hint, not truth
  placement?: PlacementEstimate;            // 03 §7
  // everything below is derived or in logs; kept per course:
}
```
Per-course collections (separate keyed records):
| Record | Scope key | Notes |
|---|---|---|
| `creditLedger` (**permanent**, append-only, compact — §4.3) | `(courseId, creditId)` | one entry per credited effect: first-time item credit, completion credit, daily/composite reward, repeat credit aggregated per day, legacy opening balance; each with `policyVersion`; storage is bounded by *content size + days*, not by attempts |
| `completions` (durable derived state) | `(courseId, activityRef)` | `{ firstPassedAt, bestScore, attempts, passingResultId }` — completion is *never* recomputed from raw results |
| `creditedItems` (durable derived state) | `(courseId, itemRef)` | `{ firstCreditedAt, xpAwarded, creditId }` — the per-activity/per-item credit information the XP rules need (03 §4.2 rule 2) |
| `xpTotals` | `(courseId)` | cached sum of the ledger; verified against it on load and by tests |
| `results` (**bounded audit/sync buffer** of `ActivityResult`) | `(courseId, resultId)` | raw item-level detail; archived/pruned per §4.4; **not** needed to reproduce totals, completion or credit |
| `mastery` (scheduler state) | `(courseId, itemId)` | durable derived state (updated on every attempt); not rebuilt from raw results |
| `saved` | `(courseId, itemId)` | |
| `dailyRewards` | `(courseId, dayKey)` | one entry per day per course (03 §4.2) |
| `streak/activeDays` | global across courses? | **Decision [R]:** streak is learner-global (any learning activity counts) and stored in `profile` stats; XP and mastery are course-scoped. Product may change this (Q below). |
| `tutorSessions` | `(courseId, sessionId)` | separate store; cleared by user; pending state lives only in memory per session (03 §9) |

Switching `courseId` shows that course's progress only; XP totals are per course with an optional aggregate display. **Level** is no longer a single profile field: "current level" for a course is derived from completed required activities in the manifest (03 §6), optionally informed by placement.

---

## 4. Events, rewards and idempotency (V-04, V-05) **[R]**

### 4.1 `ProgressPort`
```ts
interface ProgressPort {
  record(result: ActivityResult): Promise<RecordOutcome>;   // idempotent; resolves after the durable write
                                                            // (UI may apply the outcome optimistically from the in-memory
                                                            //  state; a failed write surfaces the storage-problem state — §6)
  selectors: { xp(courseId); completion(courseId, ref); unitProgress(courseId, unitId);
               levelProgress(courseId, levelId); dueItems(courseId); weakConcepts(courseId); … };
}
interface RecordOutcome { applied: boolean; xpAwarded: number; completionsGained: ActivityRef[]; masteryChanges: …[] }
```

### 4.2 Processing algorithm (single place, unit-tested)
1. Validate result against the activity-kind schema; reject unknown course/activity (manifest check via `CourseCatalogPort`).
2. If `resultId` already stored → return `{applied:false}`. (**Idempotency key = `resultId`**; the key is generated when an attempt starts, so a double-fired finish handler or a page refresh/replay cannot double-count.)
3. Append the result to the audit buffer (bounded, §4.4).
4. Update mastery for every attempted learning item (always, regardless of reward credit — 03 §4.3).
5. Compute reward with `RewardPolicy` (03 §4.2) **using durable state, not raw results**: first-time item credit is looked up in `creditedItems`; repeat rules and daily caps use the day's ledger aggregate; daily composite once per `dayKey` via the ledger.
6. Derive completion changes (threshold pass) and update `completions`.
7. In **one atomic write** (all-or-nothing in the store): ledger entries, `creditedItems`, `completions`, `xpTotals`, `mastery` updates, buffer append. A crash between steps cannot leave credit without its ledger entry.
8. Return outcome; selectors recompute from stores.

Completion semantic fix list: unit test/review/topic completion requires a result that **passes** the policy (V-05); `ex:`/`speak:`/`topic:` string keys disappear in favour of typed `ActivityRef`.

### 4.3 Credit ledger — how historical XP and completion stay reproducible **[R]** *(new — review H-4)*
```ts
// illustrative contract — not implemented
interface CreditEntry {
  creditId: string;            // `${resultId}:${n}` — globally unique, deterministic → idempotent
  courseId: CourseId;
  kind: 'item-first' | 'completion' | 'daily-composite' | 'repeat-aggregate' | 'legacy-opening';
  ref: ItemRef | ActivityRef | DayKey | 'legacy';
  xp: number;                  // may be 0 for completion-only entries
  policyVersion: string;       // reward policy that produced this entry
  resultId?: string;           // provenance (may point to an archived result)
  at: number;
}
```
- **Reproducibility rule:** `xpTotal(course) = Σ ledger.xp`; `completed(course) = { ref | ∃ ledger entry kind='completion' for ref } ∪ legacy completions`; `credited(item) = ∃ ledger entry kind='item-first'`. The cached `xpTotals`, `completions`, `creditedItems` are verified against the ledger at load (cheap) and in tests; if they disagree the ledger wins and the cache is rebuilt.
- **Bounded size:** `item-first` entries ≤ number of items in the course; `completion` ≤ number of activities; `daily-composite` ≤ days used; **repeat credit is compacted per day and per kind** into one `repeat-aggregate` entry. The ledger therefore grows with content and calendar time, not with the number of attempts.
- **Policy changes never rewrite history.** Entries keep their `policyVersion`. A new policy applies to new results only. A deliberate recalculation is a *migration* with its own version, a backup, and a written rationale — never an implicit side effect of a code change.
- **Why the ledger and not replay:** raw results can be pruned/archived (§4.4) and may have been produced by a different policy version; the ledger is the durable statement of "what was credited and why".
- **Property tests (05 §12):** pruning all raw results leaves totals, completion and credit identical; re-recording an old `resultId` after pruning is still a no-op because the ledger/`creditedItems` already contain its effects (and the result's idempotency key is also kept as a compact tombstone, §4.4).

### 4.4 Retention and archival policy **[R/A]**
| Data | Retention | Archival / pruning | Notes |
|---|---|---|---|
| `creditLedger`, `completions`, `creditedItems`, `xpTotals`, `mastery`, `saved`, `dailyRewards`, settings, profile | **permanent** (until the learner deletes the course/account data) | never pruned; included in export | bounded by content size and days |
| Result **idempotency tombstones** (`resultId` + `at`) | **≥ 400 days** (longer than the longest replay/sync window) **[A]** | then dropped | prevents double-credit if an old result is re-submitted or re-synced; ~40 bytes each |
| `results` (raw, item-level `ActivityResult`) | keep the most recent **N = 500 results or 90 days, whichever is larger** per course **[A]** | older entries are **archived**: item-level detail is aggregated into per-day, per-skill, per-concept summaries (`resultSummaries`, kept permanently; used by statistics and weak-concept recommendations) and the raw entry is deleted | the audit buffer also serves unsynced results until P8 sync acknowledges them; **unsynced results are never pruned** once sync exists |
| `mistakes` (recent weak-concept evidence) | recent window (e.g. last 300) as today (`store.tsx:92-109` caps) plus summaries per concept | older mistakes roll into concept summaries | |
| `scores` history | last 30 per skill as today, plus daily aggregates | | |
| Tutor transcripts | until the learner clears them; max 60 messages per session **[A]** | local only | never synced by default |
| Legacy opening balances (§11) | permanent, labelled | | |
| Pre-migration backups | last 1–2 | rotated | 05 §8 |
| Server side (P8+) | raw results per server retention policy **[A]**, decided with the privacy review | server-side archival to cold storage | out of P1 scope |

Archival is a **user-visible, loss-free** operation with respect to progress: before pruning the first time, the app offers (and logs the choice for) an **export** of the raw results; the pruning job is idempotent, atomic with the creation of the summaries, and covered by tests. If quota is exceeded the job runs earlier (storage-pressure mode) but never touches permanent state.

### 4.5 Anti-abuse stance
Client-side progress is **untrusted** (local data can be edited — Audit S-03). Rules therefore aim at *honest-user accuracy*, not security. When accounts/leaderboards/marketplace-linked credentials appear (P8+), anything with external consequence is validated server-side; XP/streaks remain informational.

---

## 5. Time tracking (V-08) **[R]**

- Measure **active time**: an interval counts only if the tab is visible **and** a user interaction (pointer/key/scroll/touch/speech event) occurred within the idle window (default 60 s **[A]**). Audio playback in a listening activity counts as active for its duration.
- Time is accumulated *inside the activity session* (`activeMs` on `ActivityResult`) and aggregated; there is no global 15-second ticker mutating the root state.
- Display as **"estimated study time"**.
- Accumulation in memory with flush on result completion/`visibilitychange`/`pagehide`, avoiding per-tick persistence writes.

---

## 6. Storage repository **[R]**

*(Simplified — review O-2.)* **P1 uses a deliberately thin contract**; the richer repository is introduced only when IndexedDB (or sync) is actually needed.

```ts
// P1 contract in shared/contracts — implemented by platform/storage (localStorage adapter)
interface KeyValueStore {
  get(key: string): { raw: string } | null;           // synchronous read in P1 (localStorage)
  set(key: string, raw: string): void;                 // throws StorageError (quota / unavailable) — never swallowed
  remove(key: string): void;
  keys(prefix: string): string[];
}
// Validation, versioning, migration, quarantine live in core (05 §7), on top of this contract.
```
- **Atomicity by key design (P1):** the critical durable state of one course — ledger, `completions`, `creditedItems`, `xpTotals`, `mastery`, tombstones — is stored under **one key per course** (`bilup:progress:<courseId>`) and written with a single `set` (atomic per key), which is what §4.2 step 7 requires. The raw-results buffer (`bilup:results:<courseId>`), tutor sessions, settings and profile are separate keys written after it; losing a buffer write can never lose credit. Sizes stay modest because the ledger is bounded by content size and days (§4.3); the quota estimate is part of P1 acceptance.
- Writes are debounced and coalesced per key; failures surface as an app-level **"storage problem"** state (private mode, quota) instead of being swallowed.
- **Later (P6, or earlier if measurements show growth):** extract the richer, asynchronous `StorageRepository` (`get/put/list/transact/estimate/watch`) with an **IndexedDB** adapter and move the per-course key to a transactional store. The domain layer does not change because it only talks to the contract; a migration copies the keys.
- **Remote (P8):** a sync layer over the same records, gated by consent — it is specified in P8, not now.

Sizing note **[A]**: per-result size and growth have not been measured; prune policy + quota estimate (`navigator.storage.estimate()`) are part of P1 acceptance.

---

## 7. Schema, validation and migrations (V-07) **[R]**

- Each persisted record is wrapped: `{ schemaVersion, updatedAt, data }` (`deviceId`/sequence metadata is added by a P8 migration, not now).
- **Runtime validation** on every read with a schema library (07 §3). Invalid → **quarantine** (copy raw payload to a `bilup:quarantine:<ts>` key), report to the learner, load defaults for that store only (not for everything).
- **Migrations:** ordered pure functions `migrate_n_to_n+1(data) => data`, each with fixtures and tests; run on load; the repository writes the migrated result only after success; the previous raw is kept as a backup until the next successful session (§8).
- **Content-evolution migrations:** removed/renamed content ids are resolved via `legacyId` and tombstone tables (04 §10) — an unresolvable reference is archived under "archived progress", never crashes a screen.
- Caps (e.g. results retention) are explicit policy, tested, and visible in docs, not scattered `slice(-N)` calls.

---

## 8. Recovery, backup, export

- **Automatic pre-migration backup** of all `bilup:*` keys into one `bilup:backup:<fromVersion>` key (bounded to the last 1–2 backups).
- **Recovery screen** ("We couldn't read some of your data") with: retry, restore backup, export raw, reset store.
- **Export/import** (JSON file) of learner state — user-initiated, version-tagged, validated on import; doubles as a data-portability feature (§10).
- **Reset** is scoped: reset one course, or everything (the current single "reset all" button remains available but gets a clear confirmation listing what will be erased).

---

## 9. Multi-tab and sync boundary

- **Multi-tab:** the `storage` event / `BroadcastChannel` notifies other tabs, which **re-read the per-course key before every write** (read-modify-write inside one synchronous task, so two tabs cannot interleave a single `set`); ledger entries have deterministic `creditId`s, so a double-processing across tabs is a no-op; settings use last-writer-wins with `updatedAt`. No per-device sequence numbers are needed in P1.
- **Sync (P8) [F]:** client pushes unsent results (idempotent by `resultId`), pulls others; the server is authoritative only for account-bound data (identity, entitlements, marketplace). Conflicts: results never conflict (set union); mastery recomputed from merged results; settings LWW. No design decision here constrains the P1 local format because ids and metadata are already sync-ready (principle 6).

---

## 10. Privacy of learner data **[R]**

- Data minimisation: no default personal name; `displayName` optional; no email in the local store.
- Tutor transcripts and recorded answer texts are stored locally only, user-deletable, excluded from sync by default **[A]**; speech audio is never stored (the browser recogniser may send audio to its vendor — disclosed before first mic use, Audit S-06).
- Local data is plaintext (`localStorage`/IndexedDB): disclosed; no sensitive data should be stored.
- Export/delete features support data-subject rights when accounts arrive (09 §11 covers marketplace data).
- Marketplace personal data lives only server-side, never in this local store (09 §11).
- **Subscription, payment, entitlement and BilUp Live data (revision 3)** — billing records, payment references, entitlement state, usage counters, Live attendance, interaction and chat records — live only server-side, separate from learning data, and are **not** part of the local credit ledger (11 §13, 10 §13). Local progress never proves entitlement. Retention for expired accounts and Live data classes is decided in 11 U-14 and 10 L-06.

---

## 11. Migration from the legacy store `bilup-deutsch:v1` **[R]**

One-way, idempotent migrator, run once on first load of the new app; the legacy key is **left intact** (renamed to `bilup-deutsch:v1:migrated`) until the new store has been used successfully.

| Legacy field | New location |
|---|---|
| `name` (`'Daniiar'` default) | `profile.displayName`; **if equal to the default placeholder and no activity, set `null`** (V-15) |
| `lang` (`ru\|ky\|de`) | `settings.uiLocale` and `settings.explanationLocale` (both = `ru`/`ky`; if `de` → `ru` plus a one-time notice, Q1) |
| (none) | `settings.targetLanguage = 'de'`, `settings.courseId = 'de-general'` |
| `theme`, `weeklyGoal` | settings/profile |
| `level` | `enrollment.selfDeclaredLevel` only |
| `xp` | one ledger entry `kind:"legacy-opening"` for `de-general` (cannot be re-derived from results; stored as an explicit, labelled opening balance; `xpTotals` = ledger sum) |
| `activeDates`, `streak` | learner-global activity days |
| `studySeconds` | opening balance `legacyEstimatedSeconds` (known inaccurate, V-08; shown as estimate) |
| `completed[]` (`"3:test"`, `"topic:id"`, `"ex:id"`, `"speak:id"`) | mapped via `legacyId` table to `ActivityRef`s and stored as **synthetic results** `source:'migration'` with `evidence:'self-reported'`; entries that would not pass the new threshold (e.g. `N:test` with no stored score) are kept as *completed (legacy)* so learners lose nothing; entries unresolvable in the new manifest go to `archived` |
| `mastery{vocabId:{box,due,seen,wrong}}` | `mastery[(de-general, itemId)]` via id mapping; scheduler state copied unchanged |
| `saved[]` | `saved` per course |
| `mistakes[]` (`kind`, `ref`, `concept`) | results-derived store seeded as legacy mistakes; Reading mistakes previously labelled `grammar` cannot be distinguished retroactively (V-09) — left as is, flagged `legacy` |
| `scores{skill:number[]}` | `legacyScores` opening series (recent history only) |
| `daily{date:{vocab,grammar,listening,speaking}}` | `dailyRewards` entries (prevents re-reward for past days) |
| `tests[]` | assessment results `source:'migration'` |
| (new, derived) per-item credit | every item with `mastery.seen > 0` is seeded into `creditedItems` (no `xpAwarded`, `source:'migration'`) so that **legacy learners cannot re-earn first-time credit** for items they have already practised; seeding is idempotent and logged |
| `tutor.messages` | tutor store (kept, may be cleared by user) |

Rollback: because the legacy key is preserved, a failed or contested migration can be reverted by restoring the key (documented, tested).

---

## 12. Tests required **[R]**

| Layer | Tests |
|---|---|
| Unit | processing algorithm (idempotent `record`, repeat credit, caps, daily composite), completion derivation, migration functions n→n+1 (fixtures incl. corrupt, empty, wrong-type fields), legacy migrator (golden: realistic `bilup-deutsch:v1` blobs incl. the default-name case, `lang:'de'`, oversized arrays), active-time accumulator (idle windows, visibility changes) |
| Property | **pruning all raw results leaves XP totals, completion and credit identical**; recomputing totals from the credit ledger equals the cached totals; order-independence of result application for XP totals; re-submitting an archived `resultId` is a no-op (tombstone) |
| Store contract suite | the thin `KeyValueStore` contract (P1) is tested against an in-memory fake and the `localStorage` adapter: get/set/remove/keys, quota failure surfaces (never swallowed), quarantine of invalid payloads; the same suite is reused for the later IndexedDB adapter |
| Atomicity | a simulated failure between the per-course key write and the buffer write never loses credit; the per-course key is written in a single `set` |
| Archival | the archival job is idempotent and atomic with summary creation; unsynced results are never pruned (once sync exists); export-before-prune is offered |
| Locale switch | switching `explanationLocale` leaves ledger, completions, credited items, mastery and XP unchanged and creates no duplicate records (02 §2.4, §7.1) |
| Integration | quota-exceeded and unavailable-storage banner; recovery screen flows; cross-tab write test (two contexts) |
| E2E | fresh user; upgrade from a fixture with legacy data; export → reset → import round trip; course switch isolation |
| Performance | write amplification budget (no tutor rewrite on XP change); 10 k results load time |

## 13. Open items
- Streak scope (learner-global vs per course) and XP aggregation across courses — product decision **[A]**.
- Idle window length (60 s proposed) **[A]**.
- Retention parameters in §4.4 (N = 500 results / 90 days, tombstones 400 days) are proposals; confirm after measuring per-result size and growth **[A]**.
- Whether the legacy XP opening balance should be hidden from per-level statistics.
- Choice of validation library (07 §3).
