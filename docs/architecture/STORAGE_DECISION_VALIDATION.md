# BilUp Til 2.0 — Storage Decision Validation

**Date:** 5 November 2026 · **Type:** design validation only · **Status of every decision below: PROPOSED — none is approved by this document.**
**Inputs read in full:** `STORAGE_ARCHITECTURE_DECISIONS.md` (the "original proposal", unchanged), `P1_COMPLETION_REPORT.md`, `05_PROGRESS_AND_STORAGE.md`, `08_MIGRATION_ROADMAP.md`; code re-inspected for the claims below: `src/storage/{persistence,core,merge,activity,credit,validate}.ts`, `src/app/store.tsx`, `src/features/speaking/{SpeakingLab,SpeakInput}.tsx`, `src/features/progress/stats.ts`.
**Rules followed:** no source change, no dependency, original proposal and historical audits untouched, nothing marked approved. "R-n" = a finding/requirement raised here; "A-n" = a required amendment to the original proposal (the proposal itself is not edited).

---

## 0. Read this first — the numbering has drifted

The nine items under review use **different SD numbers than the original proposal**. To avoid approving the wrong thing, this document uses **the review list's numbering** and maps it:

| Review list | Subject | Original proposal's ID for the same subject |
|---|---|---|
| **SD-01** | Option B, minimal split records | SD-01 (same) |
| **SD-02** | Export scope (adds *vocabulary, SRS, achievements*) | SD-02 (same number, wider scope) |
| **SD-03** | Import = replace-only + verified backup | SD-03 (same) |
| **SD-04** | Course-scoped reset keeps global achievements and other courses | was §4.3 (original SD-04 meant *import strictness*) |
| **SD-05** | 30-day undo window | was original SD-08 (original SD-05 meant *prune wording/retention*) |
| **SD-06** | One-time export-before-prune offer; decline does not block | was original SD-05 |
| **SD-07** | Hints fill the field, never auto-submit; assisted marked | was §5 / original SD-06 (assisted factor) |
| **SD-08** | Opaque ActivityRef + `legacyId` aliases in P2 | was §6 (B5) |
| **SD-09** | Playwright + manual iOS/Android | was §7 (B6) |

**Decisions from the original proposal that have NO slot in the review list and are therefore still open** (they must not be lost):
**O-1** import strictness (whole-file rejection vs field repair); **O-2** "erase everything" scope — does it include legacy `v1`, backups, quarantine (conflicts with "never delete legacy data"); **O-3** streak / active-days scope under reset; **O-4** the assisted-attempt XP factor value; **O-5** retention parameter values (500 results / 90 days / 400 days) and result-buffer compaction; **O-6** whether the display name is included in an export.

---

## 1. Verdict table

| ID | Compatible with the others? | Owner approval still required? | Blocking implementation of |
|---|---|---|---|
| SD-01 | **Yes, with conditions** (§2): layout marker, slice-aware round trip, epoch-stamped slices, and a *learner-global* record (R-3) | Yes | S1–S3 |
| SD-02 | **Conflict:** "achievements" are not stored data (R-1) | Yes | S4 |
| SD-03 | **Yes** | Yes (and O-1) | S4 |
| SD-04 | **Conflict with current layout:** active days / study time live inside the *course* record; "global achievements" do not exist as data (R-1, R-3) | Yes | S4 |
| SD-05 | **Only if reduced:** feasible as *progress-only* snapshots with caps and pressure rules; **conflicts** with "snapshot excludes tutor/results" if reset also erases them (R-5) | Yes | S4 |
| SD-06 | **Yes** | Yes (O-5) | S4 |
| SD-07 | **Yes, needs one small component change** (`SpeakInput` is not controllable) and a pedagogy value (O-4) | Yes | S5 |
| SD-08 | **Yes** | Approval to carry over | P2 |
| SD-09 | **Yes**, but adds a dev dependency and a CI job; WebKit ≠ iOS | Yes (dependency, Q14) | S6 |

**Overall:** the nine proposals are *mutually compatible after seven amendments (A-1…A-7, §11)*. They are **not** ready as a whole. The storage split itself (SD-01) can start; export/import/reset/undo/achievements (SD-02–SD-06) cannot until R-1…R-6 are answered.

---

## 2. SD-01 — Can Option B keep `schemaVersion 2` without an unsafe migration?

**Answer: yes, under six conditions.** Facts verified in the code:
* `detectSchema` accepts a record when `schemaVersion === 2` **and** `progress` is a plain object. `sanitizeProgress` fills any absent field with its default and does **not** report absence as an issue → a core without preference/tutor/results fields loads cleanly.
* `serialize` writes a *fixed* set of top-level fields; **unknown top-level fields are dropped on rewrite** (only `extras` survives). Therefore an additive marker would be lost by any build that does not know it.
* `roundTripOk` (used by the legacy migrator) re-reads the *core alone* and compares `progress` — with preferences moved out it would compare defaults against real values and fail. It must become slice-aware.
* No P1 layout has been released; the only released format (`v1`) is frozen.

**Conditions (all required):**

| # | Condition | Why |
|---|---|---|
| C1 | **Layout marker** in the core: optional `layout: 2` listing the slices it expects (`prefs`, `global`, `tutor`, `results`). A build that sees a `layout` larger than it knows goes **read-only** (same rule as a future `schemaVersion`) | `schemaVersion` alone cannot tell "monolith v2" from "split v2". Without the marker a later change repeats the silent-incompatibility trap |
| C2 | **Tolerant loader with explicit precedence:** for each slice, the separate record wins if present **and** not older than the monolith copy (compare `updatedAt` / `settingsAt`); otherwise the monolith copy is used and written out | Prevents either side silently overwriting the newer data when development profiles are opened by two builds |
| C3 | **Order of the one-time split upgrade:** (1) back up the monolith bytes (content-addressed, verified); (2) write slices (each verified); (3) rewrite the core without them (single `setItem`, verified). Crash after (2): both copies exist → rule C2 resolves → step (3) repeats. Idempotent | Same technique as the already-tested legacy migration |
| C4 | **Slice-aware round trip** in the migrator and in `readRecord` consumers (compose `Core` from core+slices before comparing) | Otherwise the migrator would refuse to write its own destination |
| C5 | **Epoch stamp on every slice that a deliberate replacement can invalidate** (`results`, and `tutor` if it is in reset scope) — a slice whose epoch is lower than the core's is stale and ignored/dropped (§4) | Makes partial operations self-healing without a journal |
| C6 | **Backup before first split** and a rule that the loader **never deletes unknown `bilup-deutsch:*` keys** | Forward compatibility with a future build and with the PWA stale-shell case |

**Residual risk:** if the same browser profile runs a *pre-split P1 build* and the split build alternately (development only), the older build re-adds monolith fields; C2 resolves it by timestamp. Production is unaffected (nothing but `v1` exists).
**Why this is safer than C-option (schema 3):** no change to the meaning of an existing field, only removal of optional ones, plus a marker. If the owner prefers an explicit version, bumping to 3 is equivalent in risk and adds only machinery; neither is needed by users.

---

## 3. Backup / restore model for all independent records

### 3.1 Record inventory (after SD-01, with the amendments)

| Record | Key | Contains | Scope | Critical | In recovery snapshots |
|---|---|---|---|---|---|
| core | `bilup-deutsch:v2:<course>` | ledger, completions, mastery, saved, mistakes, scores, daily, tests, tombstones, summaries, extras, origin, epoch, layout | course | **yes** | **yes** |
| prefs | `bilup-deutsch:prefs` | name, language, theme, weekly goal, level | learner | no | yes (tiny) |
| global | `bilup-deutsch:global` *(R-3)* | active days, study time *(and persisted achievements if SD-02/SD-04 are approved)* | learner | no, but irreplaceable history | yes |
| tutor | `bilup-deutsch:tutor:<course>` | transcript ≤ 60 | course | no | **optional, off** |
| results | `bilup-deutsch:results:<course>` | raw audit buffer | course | no | **off** (size) |
| legacy | `bilup-deutsch:v1` | pre-P1 blob | — | — | frozen; pristine copy pinned |

### 3.2 Snapshot (recovery point) = a **bundle with a manifest**

```
bilup-deutsch:backup:<class>:<ts>:<bundleFp>  =
{ "bundleVersion":1, "class":"undo|drift|pre-migration|split-upgrade", "reason":"reset|import|restore|drift|…",
  "takenAt":…, "courseId":…, "layout":2,
  "records": { "core":{"fp":…,"raw":"…"}, "prefs":{…}, "global":{…}, "tutor"?:{…}, "results"?:{…} },
  "bundleFp":"…" }
```
* **Content-addressed** (`bundleFp` = fingerprint of the manifest) → identical bytes never duplicate.
* **Verified** = written, read back byte-for-byte, every record's own fingerprint recomputed, and every record parsed by the same sanitizers used at load. Only verified bundles are offered for restore.
* Four **classes** with different retention (they must not compete for the same "newest 2"):

| Class | Created by | Contains | Retention | Eviction |
|---|---|---|---|---|
| `pre-migration` | legacy migration | exact bytes of `v1` (one raw copy) | **permanent, pinned** | never automatic |
| `split-upgrade` | monolith → split (dev profiles) | exact monolith bytes | 1 | only after the split is verified healthy for one full session, or user-confirmed |
| `drift` | stale `v1` write detected | exact bytes of that `v1` write | 2 newest | rotation |
| `undo` | reset, import, restore, start-fresh, erase-all | core + prefs + global (+ tutor only if the operation erases it and the owner approves the size) | **≤ N snapshots and ≤ 30 days (SD-05)** | expiry + pressure rule (§9.3) |
| `quarantine` (existing) | damaged bytes | exact bytes of the damaged record | never automatic; capped, user-confirmed download-then-delete beyond the cap | user only |

### 3.3 Restore algorithm (learner-initiated only)
1. Select a bundle; **re-verify** (all fingerprints, all parses). Any failure → refuse, change nothing.
2. **Stage** every record in memory, sanitize, run cross-checks (ledger sum = XP; completion projection = completion records).
3. **Snapshot the current state** as an `undo` bundle (so a restore is itself undoable). If this fails → refuse.
4. Choose `epoch' = max(current epoch, stored epochs) + 1` (time-based floor, as today).
5. Write **core first** (single `setItem`, epoch', verified), then `global`, `prefs`, then optional slices; slices not present in the bundle are **cleared** (their epoch would be stale anyway) or left according to the table:

| Record | Restore behaviour |
|---|---|
| core, global, prefs | replaced from the bundle |
| results | **kept as-is**; entries whose `finishedAt` is after the restored core's snapshot time are unreachable by totals and harmless; dropped by the epoch rule on the next prune |
| tutor | kept unless the bundle contains one |
6. Re-baseline the **legacy drift state** (§6): `origin` as stored in the bundle, but its recorded v1 fingerprint is compared again at the next load — see R-7.
7. Report: what was restored, what was kept, where the replaced state was saved.

### 3.4 Pre-conditions that keep restore non-destructive
Quarantine/undo copy of the replaced state is written and verified **before** the first overwrite; no step deletes a key; the pristine legacy copy is never a restore source that overwrites silently.

---

## 4. Failure recovery for partially completed operations

**Design rule (replaces a write-ahead journal):** *every multi-record operation writes the snapshot first, the core second, and non-critical records last; every non-critical record carries the core `epoch` it belongs to; the loader drops/ignores a slice whose epoch is lower than the core's.* A crash can then only leave (a) the old state, (b) the new core with stale slices that the loader heals, or (c) the new state complete.

| Operation | Order | Crash after … | State found at next load | Automatic action | Learner-visible |
|---|---|---|---|---|---|
| **Snapshot (undo/drift)** | write bundle → verify | any point | no bundle, or an unverified one | unverified bundle is ignored and later replaced (content address) | none; the operation that needed it has not started |
| **Course reset** | snapshot → core (fresh, epoch+1) → clear results → (clear tutor if in scope) | snapshot | old core, extra bundle | none | none |
|  |  | core | new core; results/tutor with **lower epoch** | stale slices dropped (their bytes are in the undo bundle if the class includes them) | a one-time "reset completed" note |
|  |  | all | consistent | none | — |
| **Import (replace)** | validate → snapshot → core (epoch+1) → global → prefs → results/tutor if present | validate/snapshot | untouched | none | none |
|  |  | core | imported core; global/prefs old; slices stale | prefs/global: **kept old** (they were not replaced yet) and the import is reported as "partially applied — Undo / Finish"; results/tutor: dropped by epoch | notice with two buttons |
|  |  | all | consistent | none | — |
| **Restore** | as §3.3 | same as import | same | same | same |
| **Split upgrade** (dev) | backup → slices → core | between | both copies exist | rule C2 + repeat step 3 | none |
| **Legacy migration** (exists) | backup → validate → core | tested exhaustively | — | — | — |
| **Export** | read-only | — | — | — | — |
| **Pruning** | build summaries in memory → results (pruned) + core (summaries) | between the two | summaries in core but entries still in results (or vice-versa) | prune is idempotent: re-running folds nothing twice because each result is identified by id and counted once (**requires a `summarisedIds` guard or summaries written in the same record as the prune watermark — R-6**) | none |

**Operation guard against concurrent destructive operations:** see §5.
**No journal is proposed** because the epoch rule makes recovery deterministic from observable state. If the owner later wants a journal (e.g. to show "finish import"), it is additive.

---

## 5. Multi-tab behaviour

| Record | Event | Rule |
|---|---|---|
| core | `storage` for the core key | existing: re-read → `mergeCores`; **higher epoch adopted wholesale** |
| prefs | per key | last-writer-wins by its own `updatedAt` (whole record) |
| global | per key | active days: union; study time: max; achievements (if persisted): union, never removed |
| tutor | per key | union by message id, timestamp-ordered, capped |
| results | per key | union by `resultId`, then prune |
| backups | no merge | content-addressed, idempotent writes |

**Destructive operations (reset, import, restore, erase-all, start-fresh):**
1. Acquire an **exclusive lock** (`navigator.locks.request('bilup-storage', …)`) where available.
2. Without Web Locks (older Safari): **compare-and-set on epoch** — re-read the core's epoch immediately before the core write; if it differs from the epoch at operation start, **abort** ("your data was changed in another window") with nothing written but the snapshot.
3. After success, other tabs adopt via the higher epoch; their unsaved in-memory changes since their last save are discarded (a few milliseconds of work at most; saves are immediate) and a notice says so.
4. A result whose attempt **started before** a reset but finishes after it is a legitimate new credit in the fresh ledger (documented, not blocked).

**Normal concurrent play** is unchanged (verified by the existing multi-tab tests): deterministic ledger ids, tombstones, and the per-field merge rules; documented limits remain (removals do not propagate; mastery takes the more practised side).

---

## 6. Stale PWA shell compatibility

| Writer ↓ / reader → | Pre-P1 shell (cached) | P1-split build | Future build with larger `layout` |
|---|---|---|---|
| Pre-P1 shell | reads/writes `v1` only | **drift merge**: detects changed `v1`, backs up, merges forward exactly once | same as split build |
| P1-split build | — (does not touch `v1`) | normal | reads only if `layout` ≤ its own; otherwise **read-only** |
| Future build | never writes `v1` | refuses to write what it cannot read (layout/`schemaVersion` guard) | normal |

Rules to add:
* **R-7 — drift re-baseline.** Every *deliberate replacement* (reset, import, restore, start-fresh, erase-all) must either drop `origin` (current reset/start-fresh behaviour — safe) or re-baseline `origin.legacyFingerprint` to the **current** `v1` bytes. Otherwise a later write by a stale shell would merge the *whole* old `v1` (union semantics) back into data the learner just erased or replaced. Restore from a bundle keeps the bundle's `origin`; its fingerprint comparison then re-merges only genuinely newer `v1` bytes.
* Slice keys are **opaque to old shells** (they ignore unknown keys); the loader never deletes unknown `bilup-deutsch:*` keys.
* A stale shell's `v1` writes keep being merged each time (tested), but **never after a course reset** (`origin` dropped) — to be covered by a test (§10, SD-04).
* Service-worker kill-switch/update flow is independent of storage; the update prompt remains the mechanism that retires stale shells.

---

## 7. Export / import data schema and validation

### 7.1 Envelope

```jsonc
{
  "format": "bilup-learner-export",
  "exportVersion": 1,
  "createdAt": 1793871682533,
  "source": { "app": "bilup-til", "storageLayout": 2, "coreSchema": 2 },
  "courseId": "de-general",
  "sections": ["core","prefs","global"],          // which of the optional sections are present
  "counts": { "ledgerEntries": 512, "completions": 41, "masteryItems": 190, "results": 0 },
  "integrity": { "algorithm": "fnv1a32+length", "value": "…" },   // corruption detection, NOT tamper protection
  "data": {
    "core":   { "progress": {…}, "credit": { "entries": […] }, "activity": { "completions": {…}, "summaries": {…}, "tombstones": […] } },
    "prefs":  { "name"?: "…", "lang": "ru", "theme": "auto", "level": "A1", "weeklyGoal": 5 },
    "global": { "activeDates": […], "studySeconds": 0, "achievements"?: { "<id>": { "earnedAt": 0, "courseId": null } } },
    "results"?: […],   "tutor"?: { "messages": […] }
  }
}
```
Never present: epoch, origin, device ids, tokens, backups, quarantine, subscription/payment/entitlement/Live/Marketplace data.

### 7.2 Validation pipeline (all stages before any write; a failure rejects the whole file)

| Stage | Check | Outcome |
|---|---|---|
| 1 | size ≤ limit [A: 5 MB]; valid UTF-8 JSON | reject |
| 2 | `format`, `exportVersion` known; **higher** → reject "made by a newer version"; lower → upgrade via pure functions | reject / upgrade |
| 3 | `courseId` equals an installed course | reject (single course today) |
| 4 | `integrity` matches the canonical serialisation of `data` | reject "file is damaged" |
| 5 | per-section sanitizers = the same code as for stored records (`sanitizeProgress`, `sanitizeEntries`, `sanitizeActivity`, same `LIMITS`) | field-level repairs collected as issues (decision O-1: repair vs reject) |
| 6 | cross-checks: ledger sum = XP (higher ledger wins, **never inflate**), completion projection = completion records, unique ids, ledger keys valid | issues / reject if inconsistent beyond repair |
| 7 | **plausibility warnings, not blocks:** import older than current (show both dates and XP), XP far above ledger | shown in the preview |
| 8 | preview: XP, completed items, mastered words, last activity date, which sections will replace what | learner confirms |
| 9 | **verified undo snapshot** of the current state (§3.3 step 3) — refuse if impossible | abort |
| 10 | write: core (epoch+1) → global → prefs → optional slices | §4 |
| 11 | re-baseline drift state (R-7); report | — |

Client-side data is **untrusted** (05 §4.5): an exported file can be edited; nothing here is a security boundary. Server-side consequences (P8+) must re-validate.

---

## 8. Course-reset boundaries and XP reconciliation

### 8.1 Ownership table (determines what a *course* reset may touch)

| Data | Owner | Reset of course C |
|---|---|---|
| ledger, completions, mastery/SRS, saved words, mistakes, scores, daily results, test history, tombstones, summaries | course C | **erased** (undo snapshot first) |
| raw results buffer of C | course C | erased (epoch rule); **not** in the undo snapshot (size) |
| tutor transcript of C | course C | **decision R-5**: erase or keep (keep recommended — it has its own "clear" control and snapshotting it costs up to 234 KB) |
| preferences (name, language, theme, goal, level) | learner | kept |
| **active days, study time** | learner-global (05 §3 "streak is learner-global") — **but currently stored inside the course core** | kept — **requires R-3 (move to `global`)**; with today's layout a reset would erase them |
| achievements / badges | **not stored**: derived from course data (`words25`, `grammar5`, `unit`, `speaker`, `writer`…) and from active days (`streak3/7`, `first` = XP > 0) | cannot be "preserved" unless persisted — **R-1** |
| other courses | their own cores | untouched (separate keys and epochs) |
| subscription / entitlement / account / Live / Marketplace | server only | never local; reset cannot affect them |
| `v1`, pristine backup, quarantine | — | kept; drift disabled by dropping `origin` (R-7) |

### 8.2 XP reconciliation
* XP is **per course** (ledger sum); there is no stored global XP. A global figure, if displayed, is a derived sum over course cores and **falls when a course is reset** — the owner must accept that wording (R-2).
* After reset: `ledger = []`, `progress.xp = 0`, new epoch; items and bonuses can be earned again (intended).
* After import/restore: `xp := max(ledger sum, …)` per the existing `reconcileXp` rule — never lowered by validation, never inflated by a claimed `xp` larger than the ledger in an imported file (import uses the ledger).
* The undo snapshot stores the pre-reset ledger, so Undo restores XP exactly.

### 8.3 Achievement semantics (needed by SD-02 and SD-04; **not specified anywhere**)
Persisting achievements means a **new record or field** (`{id, earnedAt, courseId|null}`), union-merged, never removed, seeded at migration from the badges the learner currently satisfies, and included in export. Open questions in §11 (R-1). Without it, "keeps global achievements" is untrue after a reset.

---

## 9. Storage quotas and retention measurements required in real browsers

### 9.1 What was measured here vs what is still unknown
Measured (synthetic, real engine): record sizes — core after split ≈ **31 KB (light), 85 KB (regular), 98 KB (heavy)**; raw results 24 / 208 / 395–588 KB; tutor 13 KB typical, 234 KB worst; tombstones 3–35 KB. **Not measured:** any real browser capacity, eviction, or write latency.

### 9.2 Measurements to take (each with a method and a pass criterion)

| # | Measurement | Method | Needed to decide |
|---|---|---|---|
| M1 | Actual `localStorage` capacity (characters until `QuotaExceededError`) per engine/device, normal and private mode, installed-PWA vs tab | script that appends 100 KB blocks; Playwright (Chromium/Firefox/WebKit) + manual iOS Safari, Android Chrome | whether 5 M UTF-16 units is true everywhere; the high-water mark |
| M2 | Behaviour of `navigator.storage.estimate()` / `persist()` for `localStorage` (many browsers do not count it) | manual + script | whether quota-pressure detection can rely on it or must rely on catching errors |
| M3 | Eviction: data survival after inactivity (Safari non-installed storage purge window [A]), after "low storage" | long-running manual device test | the promise the export/backup offer must make |
| M4 | `setItem` latency vs size (30 / 100 / 500 / 1000 KB) on a mid/low Android and an older iPhone; with 4× CPU throttle in desktop | Playwright tracing + manual | the **write budget**; whether results segmentation is needed |
| M5 | Per-result size distribution and growth/day for heavy use; share of results older than 90 days after 6 months of simulated use | simulation from the engine + a beta cohort's own exports (no telemetry exists) | the real retention numbers (O-5) and compaction |
| M6 | Undo-snapshot feasibility: size of `core+prefs+global` bundles × cap × worst-case other data | arithmetic from M5 + measurement | SD-05 cap |
| M7 | Quota-exhaustion behaviour of **each write path** (core, slices, backup, quarantine, restore, import) | Playwright fills storage then drives the app | that no path loses data silently |
| M8 | Cold-load time with 10 k results and 1 k ledger entries | benchmark with CPU throttling | the 05 §12 performance budget |
| M9 | Multi-tab event delivery latency and ordering | Playwright two pages, one context | confirms the merge assumptions |

### 9.3 Quota-pressure policy (to be proposed for approval)
High-water mark **H** (measured, e.g. 70 % of M1). Above H, in this order and each step user-visible in the storage notice: (1) prune the results buffer early (summaries are written first; never permanent state); (2) drop expired `undo` snapshots, then the oldest `undo` beyond the newest; (3) ask the learner to **download then delete** quarantine copies beyond a cap; (4) warn "progress may not be saved". **Never** touched automatically: core, global, prefs, the pristine legacy copy, the newest undo snapshot.

### 9.4 Feasibility of a 30-day undo window (SD-05) — worked estimate
Progress-only bundle (core+prefs+global): ≈ 35 / 90 / 105 KB (light/regular/heavy). With a cap of **3** undo snapshots: ≤ ~0.32 MB characters (≈ 0.64 MB as UTF-16) — **feasible**. If bundles also carried results and tutor: heavy ≈ 0.7–0.9 MB each → ≈ 2–2.7 MB for 3 — consumes half or more of a 5 M-unit budget before anything else is stored — **not recommended**. Therefore the feasible reading of SD-05 is: **30 days *or* the cap, whichever comes first; progress-only; the dialog says what cannot be restored** (detailed results, and the tutor transcript if it was erased).

---

## 10. Per-decision validation

### SD-01 — Option B, minimal split records
* **Compatibility:** compatible with SD-02…SD-09 **if** (a) the slice list is extended with a learner-global record (R-3), (b) the six conditions of §2 are met, (c) the snapshot bundle composition follows §3.2.
* **Remaining questions:** Q1 where do `activeDates`/`studySeconds` live (core vs global)? Q2 is `level` in prefs until P2? Q3 are `layout` marker and epoch-stamped slices accepted as the version mechanism instead of a schema bump?
* **Required acceptance tests:** (1) per-key write assertions (theme → prefs only; tutor → tutor only; result → core + results only); (2) core contains none of the split fields; (3) each slice corrupted separately → quarantined alone, no recovery screen, totals unchanged; (4) crash injected at every write of the split upgrade (monolith in, split out, idempotent); (5) precedence test C2 with a newer monolith/older slice and vice versa; (6) `layout` greater than known → read-only; (7) legacy v1 → split layout directly; (8) slice-aware round-trip in the migrator; (9) epoch-stamped slice ignored after a reset; (10) all 545 existing tests green or consciously updated; (11) mutation checks on the new mechanisms.
* **Risks:** cross-key windows (mitigated by order + epoch rule); regressions in verified code paths; marker dropped by an older build (dev only).
* **Owner approval:** **yes** — plus the amended acceptance criterion (write budgets).

### SD-02 — Export content (progress, XP ledger, vocabulary, SRS, achievements, preferences; tutor optional)
* **Compatibility:** progress/ledger/vocabulary(SRS = `mastery`, saved words)/preferences are compatible with the schema in §7. **"Achievements" conflict:** there is no achievements data (R-1). Options: (a) export the *derived* list informationally (read-only, ignored on import); (b) persist achievements as data (new record, §8.3) and export/import it.
* **Remaining questions:** Q1 (a) or (b)? Q2 name included by default (O-6)? Q3 raw results offered only for export-before-prune or also in the normal export? Q4 does "vocabulary" mean only `mastery`+`saved`, or also the learner's custom notes (none exist)?
* **Acceptance tests:** export→reset→import round trip yields identical XP, completions, mastery, saved, daily, tests, preferences; tutor absent unless ticked and, when present, identical; file contains no account data/ids (schema test); integrity detects a flipped byte; achievements either absent-from-import or restored exactly, per the chosen option.
* **Risks:** plaintext personal data; users editing the file (untrusted input); achievements decision expands scope.
* **Owner approval:** **yes** (scope, achievements, privacy wording).

### SD-03 — Import: replace-only with mandatory verified backup
* **Compatibility:** compatible with SD-01 (slices replaced per §7.2/§4) and SD-05 (the backup is an `undo` bundle). "Verified" is defined in §3.2; backup failure → refuse.
* **Remaining questions:** O-1 strictness; what exactly is "replace" when the file lacks a section (kept untouched — proposed); import of an older export over newer progress (warn, allow); import of a different course (reject now).
* **Acceptance tests:** each invalid class (bad JSON, wrong format, higher version, integrity mismatch, other course, oversize, impossible values) → nothing written, reasons shown; backup unavailable → refused; success → epoch bump, other tab adopts, drift re-baselined (R-7), Undo restores the exact previous bytes; crash after core write → §4 behaviour.
* **Risks:** data loss by mis-click (mitigated by preview + undo); malicious/edited files; partial application.
* **Owner approval:** **yes** (and O-1).

### SD-04 — Course-scoped reset preserves global achievements and unrelated course progress
* **Compatibility:** *unrelated courses* — compatible (separate cores/epochs; nothing else exists today). *Global achievements* — **incompatible with the current data** (R-1). *Global streak/active days* — **incompatible with the current layout** (they are in the course core; R-3).
* **Remaining questions:** Q1 persist achievements? which are course-scoped (`words25`, `grammar5`, `unit`) vs global (`streak`, `first`)? Q2 does reset erase the tutor transcript (R-5)? Q3 does reset keep the learner's **XP-based** "first" badge? Q4 wording of the kept/erased list.
* **Acceptance tests:** reset erases exactly the course-owned list of §8.1 and nothing else (diff of all `bilup-deutsch:*` keys before/after); other-course fixture untouched; preferences, global stats, (persisted) achievements preserved; `origin` dropped → a later stale-shell `v1` write is **not** merged (R-7); epoch adopted by another tab; undo restores XP/completions exactly; reset during a quiz in another tab.
* **Risks:** hidden loss of streak/badges; stale-shell resurrection of old progress; cross-course leakage if a global record ever holds course data.
* **Owner approval:** **yes**.

### SD-05 — 30-day undo window "subject to storage feasibility"
* **Compatibility:** feasible **only** as progress-only snapshots with a count cap (§9.4). Conflicts with the original proposal's two-rotating-snapshots rule (different class) and with "snapshots exclude tutor/results" if reset erases them (R-5).
* **Remaining questions:** Q1 cap N (proposal 3)? Q2 does expiry after 30 days count as "deleting user data" given the learner asked to erase it — dialog wording, and an "Delete undo copy now" control; Q3 clock source (local time; a clock moved backwards must not extend or shorten silently — expire only on forward time); Q4 what is **not** restorable (detailed results; erased tutor); Q5 does an undo snapshot also count as personal data for "Erase everything" (yes → purged there).
* **Acceptance tests:** snapshot taken and verified before every destructive operation; expiry evaluated at load (no background timers) with a fake clock; cap enforced; pressure rule order (§9.3); Undo restores byte-identical core/prefs/global; expiry never removes the newest snapshot while the learner has not been shown the loss; restore of an expired snapshot refused with explanation.
* **Risks:** quota; retention of data the learner thought erased (privacy); clock manipulation; confusing partial undo.
* **Owner approval:** **yes** (window length, cap, privacy stance).

### SD-06 — One-time export-before-prune offer; declining does not block pruning
* **Compatibility:** consistent with 05 §4.4. Interaction with SD-03/SD-02: the offer exports the results about to be archived using the same envelope (`sections: ["results"]`).
* **Remaining questions:** Q1 where is the "offered at / choice" flag stored (global record recommended) and is it per course? Q2 if the notice cannot be shown (read-only session, headless), may pruning proceed? (proposal: next session, unless quota pressure) Q3 O-5 retention values and compaction; Q4 only the first batch is offered — later batches are not (acceptable? 05 says "before pruning the first time").
* **Acceptance tests:** offer appears once before the first archival; decline is persisted and respected; accepting produces a valid export of exactly the to-be-archived results; pruning is idempotent and leaves XP/completion/credit identical (existing property test) and **no result is summarised twice** (R-6); quota pressure prunes without waiting.
* **Risks:** summaries double-counting after a crash between the two writes (R-6); learners misunderstanding "summarised".
* **Owner approval:** **yes** (wording, O-5).

### SD-07 — Hints fill the answer field, never auto-submit; assisted attempts marked
* **Compatibility:** compatible with the engine (`assisted` flag, `assistedFactor` exist, tested) and with 03 §4.2 rule 5. Today's scenario hint chips **submit** the hint (`onAnswer(h, null)`), so this is a behaviour change. `SpeakInput` keeps its typed text in private state, so "fill the answer field" needs a **small interface change** (controlled value or an imperative `setText`). Voice input is unaffected.
* **Remaining questions:** O-4 factor value (proposal 0.5); does a repeated hint still complete a participation-based scenario (proposal yes); how is a *spoken* repeat of a hint detected (normalised comparison of the recognised text — recognition errors can mislabel); do topic/daily `<details>` hints count as `hint-viewed` only.
* **Acceptance tests:** tapping a hint never calls the answer path; field contains the hint and can be edited; submitting unchanged hint text → `assist:'hint-repeated'`; edited/own text → none; opening hints only → `hint-viewed`, not assisted; assisted turns excluded from `earned`; result-level `assisted` scales XP by the factor; no hint/utterance text in the stored result; results without `assist` remain valid.
* **Risks:** speech-recognition mismatches; pedagogy/UX change; learners bypassing by retyping with a typo (accepted — heuristic evidence).
* **Owner approval:** **yes** (factor, UX).

### SD-08 — Opaque ActivityRef IDs with `legacyId` alias resolution in P2
* **Compatibility:** compatible with everything above — the engine, ledger, export and import already treat ids as opaque strings. One caution: **export files and undo snapshots written before P2 contain legacy keys**; after P2 they must still import/restore, so the alias table must be retained for the life of the format (and `exportVersion` must not change merely because ids change).
* **Remaining questions:** canonical id grammar; ownership of the alias table (pack vs app); handling of generated question ids (`vq-…`); tombstoned content in imported files.
* **Acceptance tests (P2 gate):** every legacy key produced by P1 screens resolves or is tombstoned; heavy P1 fixture loads under a manifest with identical XP/completion/credit; an old export imports after P2; no ledger rewrite; id-stability test.
* **Risks:** alias collisions; unresolved keys; assuming unchanged ids in saved exports.
* **Owner approval:** engineering decision; approval to carry legacy keys indefinitely.

### SD-09 — Playwright browser testing plus manual iOS and Android checks
* **Compatibility:** compatible. Real multi-tab behaviour (shared context, real `storage` events), quota fill, stale-deployment and export/import journeys are all expressible. **Caveats:** WebKit in Playwright is not iOS Safari (storage limits, private mode, ITP eviction differ) — hence the manual layer; adds a **dev dependency, browser downloads and CI minutes** (needs approval; not done here); Web Locks availability differs per engine, so tests must cover both the lock and the epoch-CAS path.
* **Remaining questions:** device list and lab (Q14); CI platform quota; which builds are the "stale" fixtures (git `386c6a1` for pre-P1); who runs the manual checklist and when.
* **Acceptance tests:** the CI jobs of §7 of the original proposal exist and are green; each manual item has a recorded result in the release checklist; the measurements M1–M9 are produced and attached.
* **Risks:** flakiness (retries off, deterministic seeds); false confidence from WebKit; cost.
* **Owner approval:** **yes** (dependency and infrastructure; Q14).

---

## 11. Findings and required amendments (the original proposal is NOT edited)

| ID | Finding | Amendment needed |
|---|---|---|
| **R-1** | "Achievements" are projections, not stored data; "preserve global achievements" and "export achievements" are impossible without a new persisted record | **A-1:** decide (a) derived/informational or (b) persisted unlocks; if (b), specify schema, seeding, scope (global vs course), merge (union), export |
| **R-2** | No stored global XP exists; an aggregate falls on course reset | **A-2:** state that explicitly in UI copy and product decisions |
| **R-3** | Active days / study time (learner-global) live in the course core | **A-3:** add the `global` record to SD-01 (original proposal listed only prefs/tutor/results) |
| **R-4** | Review-list numbering differs from the proposal's | **A-4:** adopt §0's mapping; record O-1…O-6 |
| **R-5** | Undo snapshots exclude tutor/results, but a reset may erase them | **A-5:** either reset keeps the tutor (recommended) and results are non-restorable and disclosed, or snapshots include tutor (size) |
| **R-6** | Pruning writes two records (results, summaries); a crash can double-count a result in summaries | **A-6:** summaries must be written in the same record as a prune watermark (e.g. highest folded `finishedAt` + count), or each summarised id kept in a compact set |
| **R-7** | Reset/import/restore + stale-shell drift can resurrect erased progress | **A-7:** every deliberate replacement drops or re-baselines `origin` (§6) |
| R-8 | `roundTripOk` and `readRecord` are not slice-aware | covered by condition C4 |
| R-9 | `SpeakInput` is not controllable | small interface change inside S5 |
| R-10 | "Erase everything" vs "never delete legacy data" unresolved (O-2) | owner decision before S4 |

---

## 12. Recommendation — readiness for implementation

**The design is NOT ready as a whole; it is ready in two parts.**

1. **Ready to implement after four small confirmations: S1–S3 (the storage split).** Confirm: (i) SD-01 and the amended acceptance criterion; (ii) add the `global` record (A-3); (iii) the layout marker + epoch-stamped slices as the version mechanism (§2); (iv) snapshot bundle composition (§3.2). Then implement in the order prefs/global/tutor → results → bundle/recovery, with the test lists above and a re-run of the mutation matrix.
2. **Not ready: S4 (export, import, reset, undo, export-before-prune).** Blocked on: achievements decision (R-1/A-1), tutor-in-reset (R-5), undo size/cap/privacy stance (SD-05), orphaned decisions O-1…O-6, and the pruning double-count fix (R-6).
3. **Ready after sign-off: S5 (assisted hints)** — needs the factor (O-4) and the `SpeakInput` change.
4. **Ready after dependency approval: S6 (Playwright)** — plus the real-browser measurements M1–M9, which should run **before** S1 freezes the size budgets.
5. P2 ActivityRef work is unblocked in principle (SD-08), with the "old exports must still import" requirement recorded.

**Nothing in this document is approved.** Each "Owner approval: yes" above remains open.
