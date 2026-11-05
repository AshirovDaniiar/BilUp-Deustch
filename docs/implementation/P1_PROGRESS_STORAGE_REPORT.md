# P1 — Progress & Storage Hardening — Report

> **STATUS: PARTLY SUPERSEDED by [`P1_COMPLETION_REPORT.md`](P1_COMPLETION_REPORT.md).**
> This document describes the *first* P1 increment (storage protection + key-based XP). It is kept unchanged below as the historical record.
> The statements in this table are **no longer true** of the current code:
>
> | In this report | Current behaviour |
> |---|---|
> | XP is credited by `addXp(n, key)` with keys such as `topic:x` / `word:w1` (§5) | `addXp` and `complete` no longer exist. Screens report an `ActivityResult`; the engine (src/progress) derives XP and completion. Credit keys are now `q:<item>`, `word:<id>`, `bonus:<activityId>`; the ledger version of new entries is `p1-2` (entries written by the first increment keep `p1-1`) |
> | Completion is unchanged; a 0 % test still completes the unit (§5, §11) | Unit tests and unit reviews need **70 %**; grandfathered legacy completions are unaffected |
> | An unreadable current record is **automatically** recovered from the legacy record or a backup (§3, §4) | Never automatic: the candidate is shown in memory, writes stay disabled, and replacing the record needs the learner's confirmation (recovery screen) |
> | The legacy key is "never written" and a stale version's writes are only *detected* (§10 R1, R2) | Still never written by this version; writes by a stale version are now **merged forward exactly once** |
> | Several tabs: last write wins, no `storage` handling (§10 R3) | Tabs re-read and merge before saving and react to `storage` events; a reset/restore carries a higher epoch |
> | The placeholder name `Daniiar` is unchanged (§7, §11) | Removed: the default name is empty; the legacy placeholder is cleared only for profiles with no activity |
> | The 15-second ticker still counts study time (§11) | Removed: active time is measured (visible tab + recent interaction) and flushed on hide / pagehide / result |
> | Only a notice with a download button (§4) | A recovery screen with verified-copy restore, start-fresh and retries |
> | Test totals: 370 tests in 18 files (§8) | See the completion report for the current totals |
>
> Everything else in this report (validation rules §6, backup/quarantine mechanics §3–§4, the interrupted-migration method §8) still applies.

**Date:** 5 November 2026 · **Baseline:** git `386c6a1` plus the uncommitted P0 and P0b work · **Nothing is committed** (P0, P0b and P1 changes coexist in the working tree; §12 separates what P1 touched).
**Scope implemented:** storage protection, validation, migration, backup/quarantine/recovery, idempotent XP. **Not** implemented: the rest of the 08 §3 "P1" scope (see §11 — this is a deliberate *subset*, stated up front).
**Method:** every claim about data safety below is backed by a named test (§8). Mutation checks prove those tests can fail (§8.4). **No real browser was used**; storage behaviour was exercised through jsdom `localStorage`, in-memory stores with fault injection, and the real `AppProvider`.

---

## 1. What changed, in one paragraph

Learner progress now lives in **one versioned, validated record** (`bilup-deutsch:v2:de-general`). The legacy key `bilup-deutsch:v1` is **never written, modified, renamed or removed** by the new code. On first start the loader validates the legacy blob, writes a **verified exact-bytes backup**, validates the migrated record by round trip, writes it atomically (single key) and reads it back. Anything unreadable or repaired is **quarantined first** (exact bytes, content-addressed), never overwritten, and the learner is told and can download a copy. XP is credited through a **permanent credit ledger addressed by stable activity keys**, so replays, double-fired handlers and reloads cannot credit twice. The `UserProgress` shape consumed by every screen is **unchanged**.

---

## 2. Data model changes

### 2.1 Storage keys
| Key | Content | Written by P1? |
|---|---|---|
| `bilup-deutsch:v1` | legacy blob (unversioned `UserProgress`) | **Never** (read-only; `expectNothingLost`, "legacy key untouched" tests) |
| `bilup-deutsch:v2:de-general` | current record, one atomic key per course (`COURSE_ID = 'de-general'` is already in the key so P2 needs no data migration, 08 P1 item 8) | yes |
| `bilup-deutsch:backup:<ts13>:<fingerprint>` | exact bytes of a legacy blob (or a v2 snapshot before a learner reset); newest **2** kept | yes |
| `bilup-deutsch:quarantine:<ts13>:<fingerprint>` | exact bytes of anything unreadable or repaired; **never auto-deleted** | yes |

### 2.2 Current record (`schemaVersion: 2`)
```jsonc
{ "schemaVersion": 2, "courseId": "de-general", "updatedAt": <ms>,
  "progress": { …exactly the pre-P1 UserProgress… },
  "credit":   { "entries": [ CreditEntry … ] },     // permanent compact ledger
  "extras":   { …unknown legacy fields, preserved verbatim… },
  "origin":   null | { "from":"legacy-v1", "migratedAt", "backupKey", "legacyFingerprint" } }
```
`CreditEntry = { id, kind: 'earn' | 'legacy-opening' | 'legacy-seed' | 'reconcile', key, xp, creditedTo?, credits?, policyVersion: 'p1-1', at }`.

### 2.3 In memory
`AppProvider` holds `Core = { progress: UserProgress, credit, extras, origin }`. `state` exposed to screens is still `UserProgress`. New context field `storage` (load report, `saveFailed`, `readOnly`, notice state, `recoveryItems()`), consumed only by `StorageNotice`. `AppProvider` accepts an optional `kv` prop (tests inject fault-injecting stores; default = localStorage adapter).

### 2.4 Storage contract
`src/storage/kv.ts`: the thin `KeyValueStore` (`get/set/remove/keys`) of 05 §6 with a `localStorage` adapter that **throws typed `StorageError`s (`unavailable`, `quota`, `verify`) and never swallows them**; `setVerified` writes then reads back.

---

## 3. Migration strategy

Decision procedure (`loadProgress`, never throws, synchronous):

```
read current + legacy (storage unreadable → run from memory, read-only, nothing written)
current present?
 ├─ parses, schemaVersion 2 ─► validate/sanitize
 │     clean ─► status ok
 │     needed repairs ─► quarantine original bytes (verified) ─► only then rewrite sanitised record ─► status repaired
 ├─ parses, schemaVersion > 2 ─► NEVER touched: read-only, defaults in memory (future-version)
 └─ unparseable / wrong shape ─► quarantine (verified; if that fails → read-only, no overwrite)
        ─► try legacy key ─► else newest usable backup ─► status recovered
        ─► nothing usable ─► defaults in memory, status unreadable (corrupt bytes safe in quarantine)
current absent, legacy present ─► migrateLegacy
current absent, legacy absent ─► fresh (nothing written until the first change)
```
`migrateLegacy` — all four gates must pass, in this order:
1. **Source interpretable** (valid JSON, plain object, ≥ 1 recognisable field). Otherwise → quarantine copy, status `unreadable`; legacy key stays; **no record is written**.
2. **Verified backup** of the exact legacy bytes (content-addressed ⇒ the same bytes never create a second backup). If it cannot be written → migration is **not attempted**, read-only session.
3. **Destination validation round trip** (`serialize → parse → sanitize` must yield zero issues, equal progress and equal XP). Otherwise not written.
4. **Atomic single-key write + read-back verification.** If it fails, only our own unverified artefact is removed; legacy and backup are untouched; the next start retries.

**Idempotency / interruption.** The destination is one key written atomically; the backup is content-addressed; seeds and the opening balance have fixed ids. A crash between any two steps leaves either "no record" (next start migrates again, same result) or a complete valid record. This is tested **exhaustively**: a crash is injected before and after *every* write of the migration (§8.2).

**Version detection.** `detectSchema` → `v2 | future | legacy | invalid` (legacy blobs carry no version). The framework is one step (legacy → 2); adding a step later means adding a function and a case, with fixtures — no generic migration engine was built (not needed yet).

**Rollback (non-destructive).**
* *Code rollback* (an older build is deployed again): it reads `bilup-deutsch:v1`, which is exactly as it was before migration. **Progress made after migration lives only in the v2 record** and is not visible to the old build (see §10 risk R1).
* *Data rollback* (`rollbackToLegacy`, tested): quarantines the current record, removes only the current key, so the next start re-migrates from the untouched legacy key. Post-migration progress stays recoverable from the quarantine copy.
* *Targeted restore* (`restoreFromBackup`, tested): quarantines the current record first, then adopts a chosen backup (legacy or v2 snapshot).

---

## 4. Backup, quarantine and recovery

| Situation | What is preserved | Outcome |
|---|---|---|
| Legacy → v2 migration | exact bytes in a verified backup + the untouched legacy key | `migrated` |
| Legacy readable but with invalid fields | backup holds the original; usable parts migrated (numeric strings salvaged, clamping), invalid entries dropped *and reported* | `migrated` with `issues`; notice shown |
| Legacy unreadable (truncated JSON, `null`, array, string, foreign object) | quarantine copy + untouched legacy key | `unreadable`; session starts empty; **v1 is not overwritten, v2 is not created until the learner does something** |
| Current record repaired | original bytes quarantined **before** the rewrite | `repaired` |
| Current record unreadable | quarantined; recovered from legacy, else newest backup | `recovered` / `unreadable` |
| Quarantine or backup cannot be written | nothing is overwritten | read-only session (`unwritable`, `writesDisabled`) |
| Newer schema version in the key | untouched | read-only (`future-version`) |
| Learner presses *Reset* (explicit action) | exact copy of the current record in a rotated backup; legacy key untouched | fresh start |

**Learner-facing recovery:** `StorageNotice` (top banner, ru/ky/de, `role="alert"`, 44 px buttons) appears only for repaired / recovered / unreadable / read-only / future-version / save-failed. *Download copy* produces one JSON file containing the **exact raw strings** of every backup, quarantine copy and the legacy blob (`listRecoveryItems`); it changes nothing in storage. Kyrgyz notice text is **unreviewed** (same status as the rest of `ky`; Q2/Q16).
**Code-level recovery** (`restoreFromBackup`, `rollbackToLegacy`) is tested but **has no UI button** in P1 (deferred, §11).

---

## 5. XP idempotency

**Model (`src/storage/credit.ts`).** `award(state, key, requested)` credits `max(0, requested − alreadyCredited(key))`. Consequences, all tested:
* replay of the same activity → **0 XP**, and the *same state object* is returned (no re-render, no write);
* a larger later award for the same key credits only the **difference once** (word heard wrongly = 1 XP, later correctly = 3 → +2, never again);
* entry id is deterministic (`<key>@<creditedTo>`); duplicate ids in persisted data are **collapsed on load**, so replaying persisted entries cannot inflate XP;
* `progress.xp` always equals Σ ledger; if stored XP ever exceeds the ledger, an explicit `reconcile` entry **preserves** it (XP is never lowered by validation); if the ledger is larger it wins;
* invalid keys (empty, padded, > 120 chars) and amounts (≤ 0, NaN, ∞, < 1) credit nothing; a single award is capped at 1000;
* the ledger is bounded by distinct keys (content items + days), not attempts: 5000 attempts over 12 keys ⇒ 12 entries.

**Call sites (7 files, one line each; the type system now *requires* a key):**
`q:<questionId>` (5 XP per correct quiz answer) · `quizdone:<day>:<fingerprint of the question ids>` (the +10 bonus, once per day per question set) · `word:<id>` (3/1 XP) · `topic:<id>` (20) · `topicspeak:<id>` (8) · `speak:<scenarioId>` (20) · `real:<topicId>` (10) · `write:<taskId>` (15) · `daily:<date>` (25). A static test scans `src/` and fails if any `addXp` call lacks a namespaced key, and checks the legacy "already credited" amounts are not below what screens award.

**Legacy learners cannot re-earn.** The migrator writes an opening balance (`legacy-opening` = their XP) and one `legacy-seed` entry marking as already credited: every word with `mastery.seen > 0`, every `topic:`/`speak:`/`ex:real-`/writing-task completion, every `daily` day with `speaking`. Tested with a realistic fixture (replays of all those keys earn 0; never-practised items still earn).

**Completion and mastery.** Unchanged algorithms. `complete(key)` is idempotent (same state object on repeat); mastery follows the unchanged SRS; both are persisted in the record and shown to be identical after restart (tests). **Not changed:** completion still requires no pass threshold (V-05 open — a 0 % unit test still completes the unit).

**User-visible consequence (intended by 03 §4.2):** repeating a quiz, a topic finish, a speaking scenario, a writing task or word practice no longer pays XP again. Learners who farmed repeats will see slower XP growth.

---

## 6. Validation rules (`src/storage/validate.ts`)

Never throws; salvage before discard; every repair is an `Issue`; idempotent. Unknown top-level fields → `extras`.

| Field | Rule |
|---|---|
| `name` | string, trimmed, ≤ 80; else default |
| `lang` / `theme` / `level` | must be in the allowed set; else default |
| `xp`, `studySeconds` | finite number or **numeric string**, ≥ 0, floored, ≤ 10⁹; negative → 0 |
| `activeDates` | array of **real calendar `YYYY-MM-DD`** days, deduplicated, newest 400 |
| `completed`, `saved` | array of non-empty strings ≤ 120 chars, deduplicated, caps 5000; a non-array is rejected, not guessed |
| `mastery` | object; interpretable entries are **normalised** (box 0–5, `seen`/`wrong` ints ≥ 0, `due` ≥ 0); non-objects dropped |
| `mistakes` | entries need numeric `at`, valid `kind`, string `ref`; last 300 |
| `scores` | per skill, numbers clamped 0–100, last 30; unknown skill ignored |
| `daily` | keyed by real days, `[n,n]` pairs normalised, `speaking` boolean |
| `tests` | `id`, `at`, `pct` (clamped), string lists; last 50 |
| `tutor` | `{messages}` with valid `role`; last 60; text ≤ 4000 |
| `weeklyGoal` | 1–7 |
| ledger entries | valid kind/xp/at; duplicate ids collapsed; negatives dropped |
Hand-written validators (no schema library) — keeps the dependency list unchanged (07 §11); 07 §3 proposed a schema library, left for later if it pays off.

---

## 7. Legacy compatibility

* Every legacy fixture (full, minimal, partial scores, unknown fields, realistic) migrates **without loss** (`expectNothingLost`) and the migrated `UserProgress` equals the legacy data field for field (for valid blobs).
* The pre-P1 crash inputs (`activeDates: 5`, `xp: "100"` + `addXp`) no longer crash or concatenate.
* Same `UserProgress` type and same action names/semantics for everything except `addXp` (new required second argument — compile-time enforced).
* Learner-visible UI: unchanged except the conditional `StorageNotice`. The placeholder default name `Daniiar` (V-15) is **unchanged** (deferred).
* An older build (including an old PWA-cached shell) keeps reading/writing `bilup-deutsch:v1`, which stays valid (see R1/R2).

---

## 8. Tests and actual results

### 8.1 Summary
| Command | Result |
|---|---|
| `npm run typecheck` | exit 0 |
| `npm run lint` | **0 errors, 8 warnings** (the same pre-existing jsx-a11y warnings) |
| `npm run format:check` | "All matched files use Prettier code style" (P0/P0b/P1 files; legacy `src/` not reformatted) |
| `npm test` | **18 files, 370 tests passed, 0 failed** (P0+P0b baseline was 216 → +154) |
| `npm run content:validate` | 0 errors |
| `npm run boundaries:report` | 5 violations (unchanged, pre-existing `features→screens/NotFound`), 0 cycles; new `storage` folder adds none |
| `npm run build:ci` | OK — JS 445.93 kB / **158.50 kB gzip** (P0b: 148.96 kB → **+9.5 kB gzip** for storage layer, notice, messages), CSS 9.03 kB gzip |
| `npm audit --omit=dev` | found 0 vulnerabilities |
| `npm ci --dry-run` | exit 0 |
| `npm run test:coverage` (pure/PWA/storage scope) | 94.76 % statements, 91.55 % branches, 98.15 % functions |

### 8.2 What the new tests prove
| Requirement | Test(s) |
|---|---|
| **Fresh installation** | `persistence`: starts empty, writes nothing; first save creates only the current key |
| **Existing legacy user** | 5 fixtures migrate with no issues; legacy key byte-identical and never written; verified backup exists **before** the record is written (log order); XP opening balance = ledger sum; seeded credits block re-earning |
| **Partially corrupted** | wrong-types, string-XP, null-sections, mixed good/bad entries: usable data kept, issues reported, original bytes preserved |
| **Fully corrupted** | truncated JSON, `null`, array, plus inline `"string"`, `12345`, `true`, foreign object, empty string: `unreadable`, **legacy untouched, no record written, exact bytes quarantined** |
| **Interrupted migration** | a crash injected **before and after every write** of the migration (loop over all write positions): legacy intact, destination absent or complete-valid, next start finishes with **identical** state, ≤ 1 backup, third load changes nothing; a "lying" write is caught by read-back |
| **Repeated migration** | second load writes nothing; `migrateLegacy` ×4 (even after removing the record) → same state, one backup, XP 412 each time; play-then-reload never re-applies the opening balance; React StrictMode double initialiser → one backup |
| **Recovery from backup** | corrupt current + legacy ⇒ `recovered`, bytes quarantined *before* the rewrite; no legacy but backup ⇒ recovered; `restoreFromBackup` (v2 snapshot and legacy backup), unusable/missing backup fails safely; `rollbackToLegacy` then re-migration |
| **Validation** | 28 tests incl. 2 × 500 seeded random records: never throws, output always structurally valid, **sanitising is idempotent**; hostile shapes (2000-deep nesting, `__proto__`) |
| **Idempotent XP** | 27 ledger tests incl. randomised sequences (total = Σ, replay = 0, order-independent, bounded); store tests: repeated finish = 20 once, double-fired handler in one batch, top-up, rejected amounts/keys, restart keeps exactly-once; **real `QuizRunner` played through** — first play 25 XP, replay 0 and the record is not even rewritten; overlapping quiz sets; wrong-then-right |
| **Failure modes** | storage unreadable ⇒ read-only, zero writes; backup write fails ⇒ no migration; record write fails ⇒ state shown, legacy intact, retry next start; quarantine write fails ⇒ corrupt record not overwritten; newer schema ⇒ never written; quota during play ⇒ `saveFailed` surfaced; legacy drift detected |
| **Notice UI** | silent on fresh/clean migration; repaired / unreadable / future / save-failed variants; download file contains exact bytes and leaves storage unchanged; dismiss; ru/ky/de completeness |
| **"Nothing lost" invariant** | `expectNothingLost` after every migration/recovery scenario: every pre-existing stored string is still present (own key or exact copy) |

### 8.3 P0 expectations deliberately flipped (the 08 P0 plan said P1 would flip them)
| P0 test (KNOWN-GAP) | Now |
|---|---|
| corrupt/truncated blob overwritten on first mount | preserved in the legacy key **and** quarantined; nothing overwritten |
| JSON array leaks index keys into state | no leakage |
| wrongly typed fields accepted verbatim | repaired and reported |
| non-array `activeDates` throws on first action | no throw |
| string `xp` concatenates (`"1005"`) | numeric addition (`105`) |
| XP not idempotent | idempotent per key |
| negative / fractional XP accepted | rejected |
| progress written under the legacy key; no version field | written under the new key; `schemaVersion: 2` |
| `reset` replaces everything | still resets (explicit action) but first keeps a backup |
Unchanged and passing: SRS, stats/badges, dates/text/random, question builders, i18n provenance ratchet, content-validate, boundaries, all 106 PWA tests.

### 8.4 Mutation checks (the tests can fail)
Six deliberate defects, one at a time, each restored byte-identically (`cmp`) afterwards:
| Mutation | Tests failing |
|---|---|
| award credits the full amount (not idempotent) | 16 |
| no verified backup before migration | 12 |
| record overwritten **before** quarantine | 1 (the order test) |
| reconcile lowers XP | 2 |
| legacy key removed after migration | 10 |
| validator stops salvaging numeric strings | 8 |
After restore: 370/370.

---

## 9. Safety verification (final checks)

| Check | Result |
|---|---|
| `git status` | Modified tracked: `.gitignore, README.md, index.html, package-lock.json, package.json, src/app/store.tsx, 7 screen/feature files (one line each), src/main.tsx, tsconfig.json, vite.config.ts`; the rest is new/untracked (§12). `src/app/App.tsx`, `Layout.tsx`, `router.tsx` **unchanged** (an accidental Prettier run reformatted them and `QuizRunner.tsx`; they were restored from git and the one-line `QuizRunner` edit re-applied — verified in the diff) |
| Full diff of existing files | Screen/feature edits are exactly the `addXp(…, key)` lines (+2 imports in `QuizRunner`); `store.tsx` rewritten (see below) |
| **No user progress deleted** | Demonstrated by `expectNothingLost` over all scenarios; the legacy key is never written (log assertions); the only code paths that remove a stored key are: `migrateLegacy` removing *its own unverified* record after a failed verification, `rotateBackups` removing backups beyond the newest 2, and `rollbackToLegacy` (after quarantining the record). *Reset* is a learner action and takes a backup first. |
| Migration idempotent | exhaustive crash test + repeated-migration tests (§8.2) |
| Duplicate XP prevented | ledger, store and real-QuizRunner tests (§8.2) |
| P0 / P0b unchanged | 216 earlier tests pass (nine flipped as listed in §8.3); PWA build-artifact tests still build the real app and run the generated `sw.js` |
| `store.tsx` diff size | The file was rewritten in Prettier style; action bodies are behaviourally unchanged (verified by the unchanged action tests), the diff is therefore larger than the change |

---

## 10. Risks and limitations

| # | Risk / limitation | Notes |
|---|---|---|
| **R1** | **Post-migration progress is invisible to an older build.** The legacy key is frozen by design. If this release is rolled back, learners see their pre-migration state; their newer progress remains in the v2 record (not lost). | A mirror write to v1 was deliberately *not* added (it would make v1 stop being a pristine backup) |
| **R2** | **PWA interplay:** a stale cached shell (P0b) running old code writes `bilup-deutsch:v1` while the new build reads v2. The new record stays authoritative; drift is *detected* (`legacyChangedAfterMigration`) and reported but **not merged or shown**. | Merge policy undecided |
| R3 | **Two tabs:** each tab holds its own state; last write wins on the whole record (as before P1). XP credits could be lost, not duplicated, in that race. No `storage` event handling. | Multi-tab = 05 §9, deferred |
| R4 | Salvaging is conservative: unreadable (e.g. truncated) JSON is **not** partially parsed; it is preserved for manual recovery. | A salvage parser is deferred |
| R5 | **Seeding is approximate:** legacy quiz-question credit (`q:<id>`) cannot be reconstructed, so a migrated learner may re-earn up to 5 XP once per previously answered quiz question (bounded by content). The `quizdone` bonus is per (day × question set); freshly randomised sets still pay +10 each. | Documented policy gap; closing it needs the full RewardPolicy |
| R6 | Storage footprint grows: backup of the legacy blob + (if ever) quarantine copies + the record. Quarantine copies are never auto-deleted; the quota (~5 MB) is not estimated or monitored (05 §6 asks for `navigator.storage.estimate()`). | Quota failure during play is surfaced (`save-failed`) |
| R7 | Fingerprint is FNV-1a (non-cryptographic); it only names/dedupes copies, and reuse requires byte equality, so a collision cannot cause data confusion. | |
| R8 | `reset` keeps only the last 2 backups; a second reset can rotate the first snapshot away (the legacy key remains). | |
| R9 | Behavioural change for learners: repeated activities no longer pay XP; first-time-only word XP (3) replaces per-repeat 3/1. Existing XP is preserved. No "progress updated" note was added. | Product decision per 03 §4.2 |
| R10 | `StorageNotice` Kyrgyz text is unreviewed. | Q2/Q16 |
| R11 | Real-browser behaviour (quota semantics per browser, Safari private mode, cross-tab) was **not tested**; only jsdom + fault injection. | |
| R12 | Writes are not debounced and the whole record (incl. tutor messages) is rewritten on every change, as before. | V-17 deferred |

---

## 11. Deferred (explicitly not done)

From 08 P1 scope, **not implemented** here: `ActivityResult` / `RewardPolicy` table / `resultId` tombstones / raw-results buffer and retention (05 §4.4); pass thresholds and the fix of V-05; assisted-attempt flags (V-16); splitting `AppProvider` into settings / progress / tutor stores (V-17) and selectors; removal of the 15-second ticker and the active-time accumulator (V-08); per-unit required-sections table / unit-10 denominators (V-06); removal of the placeholder name (V-15); export/import and scoped reset UI; a recovery *screen* with a restore button (restore/rollback exist as tested functions only); `legacyId` mapping to manifest ids; multi-tab sync; quota estimate; schema library; salvage parser; "progress updated" note; E2E browser tests. Also out of scope as instructed: backend, sync, auth, payments, subscriptions, AI Tutor, Live, Marketplace, new content, new languages.

---

## 12. Files changed by P1

### Modified (tracked)
| File | Change |
|---|---|
| `src/app/store.tsx` | Loads/saves through `src/storage`; `Core` state (progress + credit); `addXp(n, key)`; `reset` snapshots first; `kv` prop; `storage` context field. Same `UserProgress` shape and action names. |
| `src/features/tests/QuizRunner.tsx` | `addXp(…, q:<id>)`, `addXp(10, quizdone:…)` + 2 imports |
| `src/features/vocabulary/WordCard.tsx`, `src/screens/TopicScreen.tsx` (2 lines), `src/features/speaking/SpeakingLab.tsx`, `src/features/reallife/RealLife.tsx`, `src/features/writing/WritingLab.tsx`, `src/screens/PracticeScreens.tsx` | one `addXp` call each now passes its key |
| `src/main.tsx` | mounts `<StorageNotice />` |
| `package.json` | `format`/`format:check` file lists extended |
| `README.md` | "Progress storage (P1)" section |

### Created
`src/storage/{hash,kv,defaults,validate,credit,persistence}.ts` · `src/app/{StorageNotice.tsx, storage-messages.ts, storage-notice.css}` · `tests/storage/{fakes.ts, validate.test.ts, credit.test.ts, persistence.test.ts, app-wiring.test.tsx}` · `tests/fixtures/legacy/v1-realistic.json` · this report.

### Modified (P0/P0b tooling files, untracked)
`tests/helpers.tsx`, `tests/legacy-storage.test.tsx`, `tests/store.test.tsx` (flipped expectations, §8.3), `scripts/check-boundaries.mjs` (`storage` folder ranked), `vitest.config.ts` (coverage scope).

### Unchanged
`src/app/{App,Layout,router}.tsx`, every other screen/component/data/service/i18n/style file, `public/*`, `dist/`, all dependencies (`package.json` dependencies untouched).
