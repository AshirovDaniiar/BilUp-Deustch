# BilUp Til 2.0 — Storage S1: Final Design (for owner approval)

**Date:** 5 November 2026 · **Type:** design only — no source, dependency or data change · **Every decision referenced is PROPOSED or OPEN; nothing is approved by this document.**
**Scope S1:** move the **preferences** and the **tutor transcript** out of the course record into their own records. Nothing else moves: results, `activeDates`, `studySeconds`, ledger, completions stay in the core. No export, import, undo UI or new feature.
**Basis:** register `STORAGE_CANONICAL_DECISION_REGISTER.md`, gate `STORAGE_IMPLEMENTATION_GATE.md`, `STORAGE_ARCHITECTURE_DECISIONS.md` and `STORAGE_DECISION_VALIDATION.md` (both unchanged), `P1_COMPLETION_REPORT.md`, and the current code (`src/storage/persistence.ts`, `merge.ts`, `validate.ts`, `core.ts`, `src/app/store.tsx`).
**Facts taken from the code (verified, not assumed):**
* Preferences = `name, lang, theme, level, weeklyGoal` (`pickSettings`); last-writer-wins by core field `settingsAt`; ties by canonical JSON.
* Tutor = `{messages: AIMessage[]}`, `AIMessage = {id, role, text}` (**no timestamp**), cap 60 messages × 4000 chars; cross-tab merge today = "longer side wins" (`merge.ts`). Ids are `a${Date.now()}`-style.
* `reset` builds `freshCore()` with a higher epoch → it **also resets preferences and tutor today**.
* Snapshots (`snapshotCurrent`, `ensureCopy`) are content-addressed copies of **one key's bytes**.
* The only `kv.remove` calls target rotated backups, the app's own unverified record, and the current record in `rollbackToLegacy`; nothing touches `bilup-deutsch:v1`.

---

## 1. Records and layout marker

| Record | Key | Shape (all fields required unless noted) |
|---|---|---|
| core | `bilup-deutsch:v2:de-general` | existing `schemaVersion: 2` record **minus** `progress.{name,lang,theme,level,weeklyGoal,tutor}` and `settingsAt`; plus optional `layout: 1` |
| preferences | `bilup-deutsch:prefs` | `{ record:"prefs", v:1, epoch, updatedAt, name, lang, theme, level, weeklyGoal }` |
| tutor | `bilup-deutsch:tutor:de-general` | `{ record:"tutor", v:1, epoch, updatedAt, clearedAt, messages:[{id, role, text, at?}] }` |

* `record` makes every slice **self-describing**, so quarantined bytes can be identified later without a side table.
* **Layout rule.** Core without `layout` = monolith (layout 0, today's format, incl. every development profile). `layout: 1` = "preferences and tutor are separate". A build that reads `layout` greater than it knows → **read-only, nothing written** (same behaviour as an unknown `schemaVersion`). A slice with `v` greater than known → that slice only is read-only (kept untouched, defaults in memory).
* `UserProgress` in memory is **unchanged**; screens do not know about the split (`composeCore`/`splitCore` live in the storage layer).
* Preferences are learner-global in nature but keyed once for the single course. A second course (P2+) is a later decision; S1 must not make it harder (the preferences key carries no course id; the tutor key does).

---

## 2. Interim snapshot rule (amendment — new decision STO-17)

**Problem.** Today every snapshot is a copy of the one record that held everything. After the split a naive `snapshotCurrent` would copy only the core and **silently omit preferences and tutor**. The bundle format (STO-08) belongs to S3, so S1 needs an interim rule that is safe without it.

**Rule R-S1-1 — monolith-upgrade backup.** Before the first write of the split upgrade, the **exact bytes of the stored monolith core** (as read, unparsed) are stored with `ensureCopy` under `bilup-deutsch:backup:<ts13>:<fp>` and read back and fingerprint-verified. If this fails the upgrade does not start (§7, U1). This copy is **pinned** exactly like the pristine pre-migration copy: not rotated away, not auto-deleted. It contains preferences and tutor because in the monolith they are inside those bytes.

**Rule R-S1-2 — composite snapshot.** Every later snapshot (`snapshotCurrent`, used before reset; restore/start-fresh quarantines of the *current state*) is a **single content-addressed record in the existing monolith v2 format**, produced by `serialize(composeCore(core, prefs, tutor))` — i.e. the same bytes the pre-split build would have written. Consequences:
* it contains core + preferences + tutor in one record; nothing is omitted by construction;
* it is fingerprint-verifiable and restorable by the **existing** restore path (a layout-0 monolith is exactly the upgrade input, so restoring it is the upgrade path with a higher epoch);
* the rotation rule (newest 2 unpinned + pinned) and the "never auto-restored" rule are unchanged.

**Rule R-S1-3 — damaged slice at snapshot time.** If a slice is unreadable when a snapshot is taken, its **exact bytes are quarantined first** (§4) and the snapshot is composed with defaults for that slice. The snapshot function returns `{ key, omitted: ['tutor'] }`; the omission is therefore recorded, never silent. It is the damaged slice's quarantine copy that preserves the data.

**Rule R-S1-4 — snapshot failure blocks destruction.** If a snapshot required by a destructive learner action (`reset`, `startFresh`, `restoreFrom`) cannot be written and verified, the action is **refused** with a message and nothing is changed. *This is a behaviour change:* today `reset` proceeds even if `snapshotCurrent` returns `null`. It is listed as a separate owner approval (§10, item 8).

**What is NOT snapshotted in S1:** `bilup-deutsch:v1` (frozen, never copied or altered by new code except the existing drift backup of changed bytes), unknown keys.

---

## 3. Timestamps and deterministic conflict resolution (STO-18)

### 3.1 Preferences
* `updatedAt` = ms timestamp of the **last learner-initiated change** (`setProfile`). It replaces core `settingsAt` for layout-1 records. New value = `max(Date.now(), previous updatedAt + 1)` so a clock that moved backwards cannot make a newer edit look older.
* **Merge of two preferences records** (cross-tab, precedence): higher `epoch` wins wholesale → else higher `updatedAt` wins → else the one with the larger canonical JSON string wins (the same tie-break as today's `j(sx) >= j(sy)`). Deterministic, commutative, idempotent, associative (a total order on `(epoch, updatedAt, canonicalJson)`).
* **Upgrade from monolith:** monolith preferences have the time `core.settingsAt` (0 if never changed). The slice is created with `updatedAt = settingsAt`. If a slice already exists, the same total order applies with the monolith's `(epoch, settingsAt, canonicalJson)`. A slice thus wins only if it is not older.

### 3.2 Tutor
* Message gets optional `at` (ms). New messages carry `at = max(Date.now(), lastAt + 1)` (strictly increasing inside one record). Existing messages without `at` are given, **once, at upgrade**, `at = base − (n − index)` ms, where `base` = the monolith record's own `updatedAt` (it is in the serialized record) — deterministic, preserves order, and never in the future.
* Record metadata: `epoch`, `updatedAt` (last change by push or clear), `clearedAt` (time of the last "clear conversation", 0 if never).
* **Merge of two tutor records A, B:** (1) higher `epoch` wins wholesale; (2) same epoch: `clearedAt = max`; union of messages **by id**; drop messages with `at <= clearedAt`; sort by `(at, id)`; keep the newest 60; `updatedAt = max`. Two messages with the same id and different content (e.g. same-millisecond id collision across tabs) are both kept with the later-sorting one's id suffixed `#2` — never silently dropped. Common case (one side is a prefix of the other) yields the longer side, identical to today.
* `clearTutor` writes `clearedAt = now` and an empty list, so a clear **propagates** and a stale tab cannot resurrect cleared messages through the union. (Today the "longer side wins" rule has the opposite flaw; this is an improvement the split makes possible.)
* Upgrade from monolith when a tutor slice already exists: the same merge applies (monolith messages after timestamp synthesis vs slice). No message is lost; no choice between "monolith or slice" is made for the tutor.

### 3.3 Ordering rules that apply to both
Slice vs core (epoch): see §6. Equal everything → identical record, no write (no write amplification). Timestamps come only from the local clock; there is no trust in cross-device clocks in S1 (single device).

---

## 4. STO-06 narrowed to S1

**In scope:** independent corruption handling for **preferences and tutor only**. **Out of scope:** global and results handling (S2/S3), and any change to how the **core** is treated (a damaged core keeps the existing recovery flow).

| Situation | Behaviour |
|---|---|
| slice bytes not JSON / not an object / wrong `record` | exact bytes → quarantine (`ensureCopy`, verified) **before anything is replaced**; slice replaced by defaults (verified write); notice N1 |
| slice parses but needs field repairs (bad enum, over-long text, bad message) | same: exact original bytes first, then the sanitised slice is written; notice N1 (lists what was repaired in the support details only) |
| slice `v` > known | slice left **untouched**, defaults in memory, slice writes disabled for that slice only; notice N2 |
| slice `epoch` > core `epoch` (anomalous: core was replaced by an older one) | exact bytes quarantined, defaults used; notice N1 |
| slice `epoch` < core `epoch` (stale after a deliberate replacement) | **ignored silently**; overwritten by a current-epoch default on the next write; **not** an error and not quarantined (the data is in the composite snapshot taken before the replacement) |
| quarantine write fails | the slice is **not** replaced; kept as is, in-memory defaults, slice writes disabled, notice N3 ("could not keep a safe copy") |
| core damaged | unchanged: existing recovery screen; slices are not touched while the core is unresolved |

Guarantees: totals, XP, completion are **unchanged** by any slice damage (tests: corrupt each slice, assert core bytes identical, no recovery screen, no read-only state). Loading never opens the recovery screen or disables writes because of a slice.

**Low-priority notice (N1/N2/N3).** Shown in the existing `StorageNotice` area as a **dismissible, non-blocking** line, lower priority than every core notice (never shown while a core notice is visible); it appears once per quarantined key (remembered in memory for the session; the quarantine entry itself is the durable record and is listed by `listRecoveryItems`). Content:
* N1 — "Your settings/your tutor chat could not be read and were reset to defaults. The original is kept safely."
* N2 — "Your settings/tutor chat were saved by a newer version of the app. They are kept unchanged and not edited."
* N3 — "A safe copy could not be made, so your settings/tutor chat were left as they are."

**Localization:** every string exists in **ru, ky and en** in `storage-messages.ts` (the existing pattern); the L10n coverage report must not regress for these keys; the Kyrgyz text is marked **needs native review** (as all added ky strings already are) and is a release condition, not a build condition. No hard-coded text in components; accessibility: `role="status"`, dismiss button labelled, not time-limited.

---

## 5. Complete list of writers/readers that become slice-aware

Every place that today reads or writes the whole record must either compose/split or be proven independent. Nothing may be left on the old assumption.

| # | Function (file) | Change in S1 |
|---|---|---|
| 1 | `serialize`, `readRecord`, `detectSchema` (persistence) | core codec without slice fields; accepts layout 0 (monolith) and 1; unknown/larger layout ⇒ read-only; slice codecs added |
| 2 | `roundTripOk` (persistence) | compares the **composed** state; otherwise the migrator would reject its own output |
| 3 | `loadProgress` / `loadInner` / `loadCurrent` | read core, then slices with the precedence and damage rules (§3, §4), epoch check (§6) |
| 4 | `recoverUnusableCurrent` | core-recovery flow unchanged; must not touch slices while unresolved; after recovery the slices are re-evaluated by epoch |
| 5 | `applyLegacyDrift` | merges the v1 delta forward as today into the **composed** state, then writes via the split writers; v1 preferences/tutor are merged with the §3 total orders. Behaviour to be pinned by a characterization test **before** any change |
| 6 | `migrateLegacy` (v1 → current) | writes **slices first, core last** (the core is the commit marker of a creation, see §7 M); backups: pristine v1 copy as today |
| 7 | `saveProgress` | writes **only the keys whose content changed**: core, prefs and tutor are diffed against `lastSaved`; order core → prefs → tutor; replace-mode writes all three |
| 8 | `readStored` | returns the composed state (+ raw of each record) |
| 9 | `snapshotCurrent` | composite snapshot (R-S1-2/3/4) |
| 10 | `storedEpoch` | **max over core, prefs, tutor** so a replacement epoch is above every slice |
| 11 | `restoreFrom` / `restoreFromBackup` | restores a layout-0 monolith or a v1 copy through the split writers; new epoch above all; slices rewritten with that epoch; current state snapshotted first (composite) |
| 12 | `startFresh` | quarantines the damaged **core** bytes as today, **and** composes a composite snapshot of the readable slices; writes fresh core (epoch+1), then fresh slices (epoch+1) |
| 13 | `rollbackToLegacy` | quarantines the current core as today **and** the current slice bytes (exact); removes **core only** (as today) and the two slice keys of its own after their quarantine copies are verified; the next load migrates `v1` again |
| 14 | `listRecoveryItems`, `inspectCopies` | list/inspect slice quarantine copies by their `record` field; composite snapshots appear as ordinary backups |
| 15 | `mergeCores` / `mergeProgress` / `pickSettings` (merge.ts) | prefs and tutor leave `mergeProgress`; `mergeCores` merges core only; two slice mergers added (§3). The 150-triple property suite is extended to them |
| 16 | `sanitizeProgress` / `sanitizeTutor` (validate.ts) | `sanitizeProgress` stops producing prefs/tutor from a layout-1 core; the same sanitizers are reused for slices and for the monolith (layout 0) path |
| 17 | store boot load, `adopt`, `lastRaw`/`lastSaved` tracking (store.tsx) | three raws tracked (`lastRaw` per key); changed-key diff on save |
| 18 | `storage` event handler (store.tsx) | per-key: `KEYS.current` (existing rule + epoch adoption), `KEYS.prefs` (re-read, merge by §3.1), `KEYS.tutor` (re-read, merge by §3.2), `KEYS.legacy`/`null` (existing drift) |
| 19 | `actions.setProfile` | stamps prefs `updatedAt` (§3.1); no core write |
| 20 | `actions.pushTutor`, `actions.clearTutor` | stamp `at` / `clearedAt` (§3.2); no core write |
| 21 | `actions.reset` | **keeps today's semantics** (progress, preferences and tutor all reset) — the change of reset scope belongs to S4 (STO-27/29). Mechanics: composite snapshot (R-S1-2/4) → core with `epoch+1` → slices rewritten as defaults with `epoch+1` (best effort; if it fails, stale-epoch rule makes them ignored) |
| 22 | recovery actions in the store (restore/startFresh/rollback/inspect) | call the functions above; no direct key access |
| 23 | `StorageNotice`, `RecoveryPanel`, `storage-messages`, `recovery-messages` | notices N1–N3; recovery panel lists slice quarantine entries read-only |
| 24 | `KEYS` (persistence) | adds `prefs`, `tutor`; **no** removal of anything unknown; the cleanup helpers only ever remove keys they created |

Not changed in S1: `kv.ts`, `hash.ts`, `credit.ts`, `activity.ts`, the progress engine, `activeTime`, the PWA code. Static check: no source file outside the storage layer and `store.tsx` references the three keys.

---

## 6. Stale-shell and replacement compatibility (verified against the design)

| Requirement | How S1 guarantees it | Evidence required (test) |
|---|---|---|
| **No stale slice overwrites a newer epoch** | (a) every replacement writes the **core first** with `epoch+1`; (b) a slice writer re-reads the stored slice and the stored core epoch immediately before writing and **refuses** (and adopts) if either is higher than its own; (c) the loader ignores any slice with epoch < core epoch; (d) `storedEpoch` is the max over all three records | two-tab test: tab A holds epoch e, tab B resets; A's next pref change is refused and A adopts; stored slice bytes unchanged |
| **Residual race** | reassessed in §11: a lower-epoch slice written by a stale tab is **ignored** on load and is detected by the post-write epoch check; the only data it can displace is an edit the reset erases by design. Not eliminated in principle (localStorage has no atomic multi-key operation), but it needs a human action inside one synchronous check-to-write interval. Web Locks are not used in S1 (§11) | test asserts "ignored, never adopted, detected, adopted-by-writer" |
| **`v1` untouched** | no S1 code path writes or removes `bilup-deutsch:v1`; the migrator reads it; drift reads it | existing "legacy bytes unchanged" mutation + a new assertion in every S1 journey |
| **Unknown keys never deleted** | the loader/cleanup only removes keys it owns (rotated backups, its unverified artefact, its own slice keys after quarantine in `rollbackToLegacy`); unknown `bilup-deutsch:*` keys are never enumerated for removal | test: plant `bilup-deutsch:future-x`; run every operation; key and value unchanged |
| **Reset / restore cannot resurrect replaced progress** | reset sets `origin: null` (drift disabled, as today); slices of the old epoch are ignored; the monolith-upgrade backup and snapshots are **never auto-applied**; `restoreFrom` is learner-initiated and uses an epoch above all records | test: reset → stale-shell writes `v1` → no merge; reset → old tab saves → refused; old slice bytes planted with epoch < core → ignored |
| **Restore does not resurrect** | restoring a snapshot re-applies *that snapshot's* state on purpose; for a v1 restore, `origin` is re-baselined by the existing migration | existing restore tests + slice cases |
| **Stale pre-split P1 build (development only)** | it rewrites the core without `layout`; the split build then sees layout 0 and the slices: precedence by §3 (slice wins if not older, tutor merged) — nothing is lost, nothing is deleted | test: simulate the old build's write over a split profile |
| **Pre-P1 shell** | writes `v1` only → drift as today | existing drift tests, re-run after the change |
| **Newer build with larger layout** | read-only, nothing written | layout guard test |

---

## 7. Failure behaviour for every S1 write sequence

Conventions: "verified" = `setVerified` (write, read back, compare). "Notice" = existing save-failure notice unless stated. No sequence deletes learner data; no sequence runs a free-space cleanup (S1 has **no** quota-pressure policy — that is STO-14, later).

### 7.1 Normal operation

| Sequence | Writes (in order) | Crash / failure point → state | Recovery |
|---|---|---|---|
| **W1** preference change | prefs | before: old prefs; during/after quota error: old prefs on disk, new in memory | save-failed notice; retried on the next change/timer exactly like core saves today |
| **W2** tutor push / clear | tutor | same as W1 | same |
| **W3** progress result etc. | core only | as today | as today |
| **W4** combined edit in one tick | core → prefs → tutor, only changed keys | crash after core: new core, old slices; both valid (independent) | next save re-diffs against disk and writes the rest |

### 7.2 Replacing operations

| Sequence | Order | Crash points | Result at next load | Backup failure | Quota exhaustion | Cross-tab conflict |
|---|---|---|---|---|---|---|
| **W5** reset | composite snapshot (verified) → core(epoch+1, origin null) → prefs(epoch+1, defaults) → tutor(epoch+1, empty) | after snapshot: nothing changed (extra backup). After core: new core, old slices (epoch lower) **ignored → defaults**. After prefs: tutor ignored → empty. All three: consistent | always a valid state; no recovery screen | **refused**, nothing changed (R-S1-4) | snapshot fails ⇒ refused; core write fails ⇒ state unchanged, notice; slice write fails ⇒ stale-epoch ignore rule makes it harmless | another tab holding a lower epoch adopts the higher epoch; its pending slice write is refused (§6) |
| **W6** restoreFrom(copy) | evaluate copy → composite snapshot of current → core(epoch') → prefs → tutor | as W5 | as W5 | refused | as W5 | as W5 |
| **W7** startFresh | quarantine damaged core (verified) → composite snapshot of readable slices → core(epoch') → fresh slices | as W5; quarantine fail ⇒ nothing changes, `unwritable` as today | as W5 | refused as today | as W5 | as W5 |
| **W8** rollbackToLegacy | quarantine core (verified) + quarantine slices (verified) → remove slices → remove core | after quarantines: nothing removed. After slices removed, before core removed: core present, slices default → valid | next load: core present ⇒ normal (rollback incomplete, can be repeated); core absent ⇒ migrate `v1` | any quarantine fails ⇒ nothing removed, refused | remove never needs space | n/a (explicit) |

### 7.3 Creation / upgrade

| Sequence | Order | Crash points | Result at next load | Failure handling |
|---|---|---|---|---|
| **U** monolith → split (development profiles) | **U1** exact-bytes backup (pinned, verified) → **U2** prefs slice (merge-if-newer, verified) → **U3** tutor slice (merge, verified) → **U4** re-read core; if already layout 1 adopt, else rewrite core without slice fields + `layout:1` (verified) | after U1: nothing changed. After U2/U3: monolith core still holds the old values, slices hold the same-or-newer values → precedence (§3) resolves ⇒ **upgrade resumes at U4**. After U4: done | idempotent: re-running converges to the same bytes | **U1 fails (backup/quota):** the upgrade does not start; the app runs from the monolith **in memory-compatible mode**, writes continue to the monolith core, notice N3-style "could not prepare an upgrade; will retry". **U2/U3/U4 fails:** stop; monolith intact; retried on the next load. No step is destructive until U4, and U4 only drops fields whose values are already in verified slices |
| **M** v1 → current (new profiles) | pristine v1 copy (existing) → prefs slice → tutor slice → core(layout 1) last | crash before core: no core ⇒ next load migrates again, overwriting identical slice content; after core: complete | `v1` untouched throughout; orphan slices without a core and without `v1` are **adopted** (they are the learner's) | migration failure behaviour as today (`recovery-pending`/memory only); slices never leave a half-adopted state because the core is the commit marker |

**Concurrency inside the upgrade.** Two tabs may run U simultaneously: U1 is content-addressed (identical bytes ⇒ same key), U2/U3 are merge-if-newer (never regress a newer slice), U4 re-reads the core and adopts if the other tab finished (same race guard as the existing migration). A tab that finds `layout` larger than known does nothing.

**Notices used:** save-failed (existing), N1–N3 (§4), read-only (existing, for larger layout). None of these blocks learning except read-only for an unknown layout.

---

## 8. STO-02 clarified (amendment)

* **S1 acceptance requirement = relative write isolation.** It is a property, not a size: *a preference change writes only the preferences key; a tutor change writes only the tutor key; progress changes write only the core key; the core never contains preference or tutor fields; no S1 operation writes `bilup-deutsch:v1`.* Asserted by recording every `setItem` in tests.
* **Absolute numeric budgets are provisional** until real-browser measurements M1 (actual `localStorage` capacity) and M4 (write latency vs size on low-end devices) exist. The numbers previously drafted ("< 1 KB", "≤ 16 KB", "core ≤ 150 KB") are **withdrawn as acceptance criteria**: the tutor figure contradicts the measured worst case (60 messages × 4000 chars ≈ 234 KB), and no browser measurement supports any of them. They remain **indicative synthetic figures only**: tutor ≈ 13 KB typical, core after removing the buffer/tutor/preferences ≈ 100 KB at the heavy profile.
* S1 therefore **freezes no size limit**. The existing sanitizer limits (60 messages, 4000 chars per message) are unchanged.

---

## 9. Test and acceptance summary (S1 closes only if all pass)

1. Write isolation per action (§8) and static check "no other module touches the keys".
2. Core contains none of the split fields; layout 0 and 1 load identically in memory.
3. Each slice corrupted separately (bytes, repairs, future `v`, epoch above/below core) ⇒ §4 table; core bytes identical; no recovery screen; quarantine holds exact bytes.
4. Crash injection after **every** write of W4–W8, U, M ⇒ valid state, no data loss, converges.
5. Precedence/merge: total-order properties (idempotent, commutative, associative) for prefs and tutor; tutor clear propagates; same-id collision keeps both.
6. Snapshots: composite snapshot contains prefs and tutor; restore of it reproduces the state; `omitted` recorded when a slice is damaged; snapshot failure refuses reset/restore/start-fresh.
7. Stale-shell matrix of §6 including the planted unknown key and the pre-split build write.
8. Cross-tab: two pages, each key, plus reset vs concurrent preference edit.
9. All 545 existing tests green or updated **with a written reason**; the mutation matrix is re-run and extended (stale slice accepted, wrong precedence, split field left in core, `v1` touched, snapshot omitting a slice, unknown key removed).
10. `npm run check` green; L10n coverage does not regress for the new keys; Kyrgyz strings flagged for native review.

---

## 10. Owner approvals still required before S1 implementation

Nothing below is approved. Each is a distinct yes/no for the owner:

1. **STO-13 — CONFIRMED** by explicit owner statement (5 Nov 2026), classification *pre-release / development-profile migration*. **No longer an open approval** (see §11.1). It is a recorded fact; it approves no design decision.
2. **STO-01** — split preferences and tutor into their own records before first release.
3. **STO-02 (amended)** — relative write isolation as the S1 acceptance; absolute budgets withdrawn and left provisional until M1/M4.
4. **STO-04** — keep `schemaVersion 2`; `layout` marker (greater ⇒ read-only); epoch-stamped slices.
5. **STO-05 (amended)** — upgrade order U1–U4, precedence by the §3 total orders, pinned exact-bytes monolith backup.
6. **STO-06 (narrowed)** — independent damage handling for preferences and tutor only; notices N1–N3 with ru/ky/en text.
7. **STO-07 (amended)** — core-first for replacing operations; **slices-first/core-last for creations and the upgrade** (the core is the commit marker); epoch-stamped slices instead of a journal.
8. **STO-11** — per-record merge rules of §3.1/§3.2.
9. **STO-17 (new)** — interim snapshot rule R-S1-1…4, **including the behaviour change that reset/restore/start-fresh are refused when the safety snapshot cannot be made**.
10. **STO-18 (new)** — timestamp model: preferences `updatedAt`; tutor optional `at`, `updatedAt`, `clearedAt`; one-time synthesis of missing `at`; `clearTutor` now propagates across tabs.
11. **Reset semantics unchanged in S1** — reset keeps erasing preferences and tutor until STO-27/29 are decided in S4 (confirm this is acceptable for the interim).
12. **Residual race** (§6, reassessed in §11.3) accepted in its corrected form: it is not eliminated in S1; it is reduced to a detectable, ignored-on-load stale write that can displace only an edit a concurrent reset erases anyway (plus, in theory, a user action inside one synchronous interval). Web Locks stay in S4 (STO-35).
13. **Kyrgyz review** — a native reviewer for the three new notices before any Kyrgyz release (not a build blocker).

**Advisory, not blocking:** measurements M1 and M4.
**Verify at implementation start (facts this design assumed but the code review could not fully confirm):** tutor message id uniqueness across tabs (ids are timestamp-based); how `applyLegacyDrift` currently treats v1 preferences (pin with a characterization test); that the store's save effect uses replace-mode for reset exactly as assumed in W5. *(Update 5 Nov 2026 — see §11.4: two of these three are now verified in the code.)*

---

## 11. Update 5 November 2026 — STO-13 recorded; S1 gate reassessed

### 11.1 STO-13 — recorded
* **Status: CONFIRMED.** Source: explicit owner statement, 5 Nov 2026: *"No BilUp build writing to bilup-deutsch:v2 has ever been published or distributed to real users."*
* **Migration classification: pre-release / development-profile migration.** The monolith → split upgrade (U) concerns only development profiles; the v1 → current migration (M) still concerns real users and keeps its full production-grade requirements.
* A recorded fact, **not** an approval of any design decision. Repository evidence (one commit, one remote branch, no tags, no deploy configuration, no `v2` key in any pushed commit or the local `dist/`) is consistent with it but is not its source.
* **Unchanged safety requirements:** never write or delete `bilup-deutsch:v1`; the pinned migration backup preserves the **exact original monolith bytes**; unknown storage keys are never deleted; the upgrade is idempotent and crash-safe; **development data is not assumed disposable.**
* **Reopen condition:** a `v2`-writing build found to have reached users ⇒ STO-13 reverts to OPEN and S1 stops.

### 11.2 Remaining owner approvals (STO-13 is no longer among them)
STO-01 · STO-02 (amended) · STO-04 · STO-05 (amended) · STO-06 (narrowed) · STO-07 (amended) · STO-11 · STO-17 (incl. snapshot-failure refusal) · STO-18 · reset semantics unchanged in S1 · acceptance of the residual race in its corrected form (§11.3) · native Kyrgyz review of the three notices before any Kyrgyz release (not a build blocker). **All remain PROPOSED; none is approved.**

### 11.3 Residual cross-tab race — reassessed

**Correction to §6 and the first version of approval 12.** I described the loss as "a post-reset preference edit within a millisecond window". That overstated it. The sequence is: tab A (old epoch *e*) performs a *synchronous* check-then-write of a slice; tab B completes a reset (core epoch *e+1*, then default slices stamped *e+1*) between A's check and A's write. Then:
* A's write leaves a slice stamped *e* on disk → **ignored on load** (lower than the core's epoch). Nothing stale is ever adopted.
* What it displaces is B's *default* slice, and A's own edit — which the reset erases by design. B's tab still shows the reset state; B's next preference/tutor write restores a current-epoch slice.
* A real loss would need B's learner to make a *new* preference/tutor change after the reset **and** before A's write — i.e. inside the few microseconds between two consecutive synchronous calls in A. Not achievable by a person.

**Option 1 — epoch compare-and-verify (synchronous). Adopted into S1; adds no scope.**
1. Before a slice write: read the stored slice and the stored core epoch; **refuse** if either exceeds the writer's epoch (already in §6).
2. Write with `setVerified`.
3. **New:** after the write, re-read the core epoch; if it now exceeds the writer's epoch, report a conflict → the writer reloads/adopts (shows the post-reset state) instead of believing its edit was saved.
This is ordinary synchronous code in the same save path, with no new API, no fallback branch and no change to flush-on-pagehide.
*It does not make the operation atomic.* `localStorage` has no multi-key transaction, and the spec's storage mutex is not a guarantee across consecutive calls. So it **cannot eliminate** the race in principle; it reduces it to "detected, ignored on load, displaces only reset-erased state".

**Option 2 — Web Locks. Not within S1.** Reasons, each sufficient:
* Locks help only if **both sides** take them: destructive operations (exclusive) *and* every writer of core/prefs/tutor (shared). Acquiring a lock is asynchronous, so **all saves become asynchronous** — including the flush on `pagehide`/visibility change, where an async acquisition may never complete and the last edit is lost. That would create a larger loss risk than the race it closes.
* The API is missing or restricted in some engines/webviews, so a second code path (the CAS above) is needed anyway, doubling the tests.
* It is the subject of STO-35 and belongs with S4, where destructive operations (import, erase) make exclusion necessary.

**Conclusion.** Within S1, *without expanding scope*, the race can be **reduced to a detected, harmless, ignored-on-load stale write** but **not eliminated**. Full elimination requires Web Locks across all writers, which is S4 work. The owner is asked to accept the corrected residual (approval 12).

### 11.4 Assumptions verified in the code on 5 Nov 2026 (read-only)
| Item | Result |
|---|---|
| Reset uses replace-mode (W5) | **Verified.** `store.tsx` save effect: `saveProgress(..., { replace: core.epoch !== lastSaved.current.epoch, ... })` — an epoch change writes without merging, as W5 assumes. |
| Tutor message ids | **Verified, collision possible but tiny.** Ids are `u${Date.now()}` / `a${Date.now()}`; a collision needs the same role in two tabs in the same millisecond. §3.2 keeps both (`#2`), so nothing is dropped. |
| Drift and v1 preferences/tutor | **Verified, and it exposes a gap.** `applyLegacyDrift` merges the stale v1 state with `settingsAt: -1` ("the current state's settings always win"): **stale v1 preferences never override current ones** — S1 preserves this (drift contributes no preferences). The stale v1 **tutor** is merged by "longer side wins" today. Under STO-18 a v1-sourced message has no `at`, so S1 needs a *deterministic* rule for drift-sourced messages: proposed `at = index + 1` (sorts before any real timestamp; identical in every tab, so the merge stays commutative). This rule is new, **not** covered by approval 10 as written; it is part of STO-18's definition once approved. |

### 11.5 Unresolved technical risks (none is a design blocker; each has a test or a stated mitigation)
| # | Risk | Mitigation / test |
|---|---|---|
| T1 | Residual cross-tab race (§11.3) | corrected description; stale slice ignored; post-write epoch check; Web Locks deferred to S4 |
| T2 | Drift tutor timestamps (§11.4) | deterministic `at = index + 1`; commutativity property test |
| T3 | Tutor id collision | keep both with `#2`; collision test |
| T4 | Transient storage growth during U (exact backup + two slices + core ≈ up to 2× the monolith until U4) and the **permanent** pinned backup (≈ 1× monolith). Browser capacity is **unmeasured** (M1) | upgrade aborts safely on a quota error (no cleanup is attempted); backup lifecycle for the pinned copy is an S3 item (`split-upgrade` class) — until then it stays pinned, as required |
| T5 | Composite snapshot format becomes legacy when S3 introduces the bundle | restore path for composite records must stay (they are ordinary monolith v2 records) |
| T6 | Refusing reset/restore/start-fresh when the snapshot fails means a full-storage learner cannot reset, and S1 offers no cleanup | clear message; the cleanup policy is STO-14 (later) |
| T7 | Non-atomic multi-key writes | core-first/slices-last for replacements, slices-first/core-last for creations, epoch rule, crash matrix |
| T8 | An older pre-split P1 build in the same profile rewrites the core without `layout` (development only) | precedence rules; "simulate old build write" test |
| T9 | Test churn: many of the 545 tests assume one key | each change carries a written reason; mutation matrix re-run and extended |
| T10 | Unmeasured browser behaviour (capacity, private mode, write latency) | M1/M4 advisory; S1 freezes no absolute limit |
| T11 | Kyrgyz strings unreviewed | native review before any Kyrgyz release |
| T12 | Monotonic timestamps only guard one record on one device | single-device scope; no cross-device clock trust |

### 11.6 Gate status after this update
STO-13 CONFIRMED · S1 awaits owner approval of nine decisions (STO-01, 02, 04, 05, 06, 07, 11, 17, 18) and the four sub-approvals. No design question is left open for S1; the remaining items are owner decisions and implementation-start characterization tests (drift tutor rule, tutor-id collision handling).
