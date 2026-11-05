# BilUp Til 2.0 — Storage S2: Migration Plan (S1 layout → layout 2)

**DESIGN ONLY.** Nothing is migrated by this document. Companion of [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md). Premise (STO-13, confirmed): no `v2`-writing build has reached real users, so this is a **development-profile** migration — development data is nevertheless **not disposable**.

## 1. Starting states handled
| State on disk | Meaning | Action |
|---|---|---|
| `layout: 1` core with `activity.results`, prefs, tutor | S1 profile | the upgrade below |
| `layout: 1` core **and** a results record (crash between R2 and R3) | resumable | resume at R3 after verification |
| `layout: 2` core, results record present | done | nothing |
| `layout: 2` core, results record absent | damaged/removed | empty buffer + notice; **not** a migration state |
| monolith (layout 0) | pre-S1 dev profile | S1 upgrade first (its own plan), then this one, in the same load |
| no core, v1 only | new profile | straight to layout 2; no raw results exist in v1 |

## 2. Upgrade steps (on load, development profiles)
Each step is verified (write → read back → compare). Nothing is destructive before R3, and R3 only drops fields whose values are already in a verified record.

* **R0 — classify.** Parse the stored core; layout 1 ⇒ continue. Read an existing results record (if any): damaged ⇒ quarantine exact bytes first; future version ⇒ stop, read-only (as S1).
* **R1 — exact-bytes backup.** `ensureCopy(backup, <stored core bytes>)`: the complete S1 course record, byte for byte. It is **pinned** by the new core (`upgrade` marker generalised to a list of pinned keys — the S1 pin of the monolith backup is kept as well). If R1 fails ⇒ the upgrade does not start (see §4).
* **R2 — write the results record.** Content = union by `resultId` of the core's `activity.results` and any existing results record (sorted by the order key, validated by the same sanitizer), stamped (informationally, STO-90) with the core epoch. Verified. If a record already exists it is **merged, never replaced**.
* **R3 — verify, then rewrite the core.** Re-read the results record and check that **every** `resultId` that was in the core buffer is present (count and ids). Only then write the core: `layout: 2`, `activity` without `results`, `prunedThrough` initialised to `null` (nothing has been folded by the new rule yet — the buffer is exactly as it was), `upgrade`/pins updated. Before the write, re-read the stored core: if it changed meanwhile (other tab), abandon and restart from R0 (bounded to 2 attempts, then compat mode).
* **R4 — settle.** Rotation ignores pinned keys; `v1` and unknown keys untouched; report `upgraded: true`.

**"Complete" is never claimed early:** `layout: 2` is the only completion marker and is written last, after the verification in R3.

## 3. Crash analysis (every write)
| Crash / failure after | State found | Next load |
|---|---|---|
| R1 | extra backup | repeats (content-addressed: no duplicate) |
| R2 (results record written, core still layout 1) | both hold the results | R0 sees both ⇒ merge (no loss) ⇒ continue at R3 |
| R3 write started but not verified | stored core still layout 1 (single `setItem` is atomic) | same as above |
| R3 done | complete | nothing to do |
| "lying" store (write succeeds, bytes differ) | read-back mismatch ⇒ step fails ⇒ treated as failure | retried next load |

XP reconciliation: the credit ledger and `progress.xp` are not read or written by the migration. Opening balances (`legacy-opening`, `legacy-seed`) are untouched; a fixture test asserts byte-equality of `credit` and of `progress` before/after.

## 4. Failure handling
* **Backup cannot be written (quota/unavailable):** upgrade does not start; the session runs in **layout-1 compat mode** — saves keep writing the S1 form (results inside the core record) so nothing is lost and an S1 build can still read it; the next load retries. A low-priority notice states that the upgrade is pending.
* **Results record cannot be written (R2):** same compat mode; the core is untouched.
* **Core rewrite fails (R3):** compat mode; the results record stays (harmless; merged next time).
* No step runs a free-space cleanup. No step removes unknown keys or `v1`.

## 5. Old builds
* An **S1 build** opening layout 2 ⇒ `layout > LAYOUT` ⇒ `future-version`: read-only, writes nothing, shows the existing "newer version" notice. An S1 tab already open during the upgrade becomes read-only on its next save.
* **Rollback** to S1 means restoring the pinned R1 backup (explicit learner/operator action; **normative rules: design §11 N4**). R1 is a **core-only** copy: it restores the **Core** only, **preserves the current preferences and tutor**, and never claims to restore the complete S1 state. Core data recorded after the upgrade (ledger, completions, mastery…) is not in that backup and reverts; **history is never lost** — the results record is kept and R1's history is **merged** into it. The dialog says exactly this. There is no automatic downgrade. ~~"…loses… new results"~~ **[SUPERSEDED by STO-90 / design §11 — non-operative history]**.
* A **pre-S1 monolith build** (development only): documented limit as in S1 — it can rewrite a monolith over the split layout; precedence rules and pinned backups prevent loss of the slices, and it will not know the results record (the buffer in that rewrite is whatever it had in memory).

## 6. Stale PWA shell
Pre-P1 shells only touch `v1` (drift unchanged; drift never produces raw results). S1-layout shells are read-only after the upgrade. No stale shell can write a results record: only layout-2 code writes that key, and it applies the results rules of design §11 (read-merge-write; exempt from core-epoch invalidation).

## 7. What the migration must not do
Delete unknown keys, touch `bilup-deutsch:v1`, change the credit ledger, change `schemaVersion` (stays 2), freeze retention values, compact or re-summarise existing results, or start before the owner's approval.

## 8. Verification required before closing S2
Crash/quota/lying-write matrix over R1–R3; resume tests for each partial state in §1; byte-equality of backup; ledger/progress equality; mutation tests (R3 without verification, marker written first, backup skipped, results replaced instead of merged); old-build read-only test; real-browser upgrade of a heavy profile (outstanding browser work).

## 9. Update 5 Nov 2026 — consequences of the confirmed history requirement (STO-71)
* **No retention is applied during the migration.** R2 copies **every** entry of the S1 buffer; nothing is folded, trimmed or dropped, regardless of the old 500/90-day rule. (The old rule is no longer applied automatically anywhere in S2 unless the owner approves a deletion policy.)
* **Existing entries are tagged, not improved.** Entries migrated from S1 carry `entrySchema: 1` and `capture: "basic"` (they have only `resultId, activityId, kind, finishedAt, activeMs, assisted, score, passed, xp, items{itemRef,outcome}`). **No missing field is reconstructed or invented**; the 50-item truncation that already happened is not repairable and is not hidden (`items` length is kept as stored).
* **Fields dropped at storage today** (`startedAt`, `levelId`, `courseId`, `evidence`, `completes`) are **not recoverable** for old entries and stay absent; new entries (after the capture stage S2b, or after S2 if the owner approves keeping them) store them.
* **Entry validation on migration** uses the same sanitizer as on load; entries that fail validation are not silently dropped: the exact original core bytes are in the pinned R1 backup and the failing entries are reported in a quarantine copy (`record: "results-rejected"` list) before the core is rewritten.
* **Size:** the history record can be much larger than the S1 buffer once detail is captured; the upgrade checks the transient quota need (backup + results record + core) and falls back to compat mode on failure (§4) — it never deletes history to make room.
* **Later schema growth** (new optional entry fields) needs **no migration**: `entrySchema` is per entry; readers must accept unknown optional fields and older entries.
* **Rollback/old builds:** unchanged (§5), with the added warning that history recorded after the upgrade is not part of the pinned S1 backup.

## 10. Update 5 Nov 2026 — STO-84 consequences for the migration
* The migrated results record is created **without** deletion markers (`deletions: {}`); no history is marked deleted by migration.
* The migration never touches `credit`, `progress`, `activity.completions`, `tombstones` or `summaries` (asserted byte-for-byte in the migration tests): this is also the guarantee that a later history deletion cannot be undermined by the migration.
* The pinned R1 backup contains the full S1 history; if the learner later deletes history, that pinned copy is **not** purged automatically (it is the rollback copy). Its retention/lifecycle (S3 `split-upgrade` class) and the "delete safety copies too" option are open (STO-76/85) and must be stated in the deletion dialog.

## 11. Update 5 Nov 2026 — STO-76 (snapshots exclude history)
* **R1 is not a safety snapshot.** The pinned exact-bytes backup of the S1 course record contains the pre-S2 history by necessity (it is the only byte-exact copy that makes the migration reversible). STO-76 does not forbid it; it must be **named** in the migration notice/documentation, kept pinned, and its lifecycle left OPEN for S3. It is the Results-recovery source for pre-S2 history.
* **From the first S2 save on**, `preserveCurrent` produces composite snapshots **without** history (marker `omitted:['history']`). Snapshots written by S1 builds remain as they are (exact bytes, never rewritten) and may contain history; restoring one **merges** its history into the results record (union, no loss).
* **Migration never reduces history:** R2 merges, R3 verifies every `resultId` is present in the results record before the core is rewritten; a failed verification keeps compat mode and the S1 layout.
* **Replacement operations after the upgrade** (reset, start-fresh, core restore) leave the results record untouched pending STO-90; the migration code does not apply the S1 epoch-invalidation rule to it.
* **Reserved format:** the new results record accepts an optional `deletions` field (validated, preserved on rewrite, merged by max) that S2 code never writes — so the later deletion stage needs no migration.

## 12. Update 5 Nov 2026 — STO-90 (history independent of replacement operations)
Owner-confirmed: reset, start-fresh and core restore never delete or invalidate detailed history. For the migration this means: the upgrade creates the results record **without** an epoch-invalidation dependency; after it, `restoreFrom`/`startFresh`/`rollbackToLegacy` (including a **rollback to the S1 layout** via the pinned R1 backup) must not remove the results key — a rollback restores an S1 *core* (which contains the old buffer) and the results record is then **merged** with it, never replaced; migration, rollback and restore therefore never reduce history.

## 13. NORMATIVE rollback, restore and results rules (consolidation, 5 Nov 2026)
This section and design §11 are the **only operative** statements on these topics; §5 (corrected above), §10, §11 and §12 are consistent with them.
1. **Rollback never loses current Results.** Rollback through R1 merges R1's history into the persisted results record; it never replaces current Results with an older copy.
2. **R1 restores Core only and preserves current Preferences and Tutor** (STO-92, **owner-approved 5 Nov 2026**). It never restores "the complete S1 state".
3. **`rollbackToLegacy` removes only the Core, Preferences and Tutor keys it owns — never the Results key.**
4. Reset, Start Fresh, Core Restore and Rollback perform zero writes to the results key except an additive history merge from a restore source (design §11 N2.4); results saves ignore replace mode.
5. The migration never trims history and applies no stale-epoch rule to results.

## 14. Owner-accepted conditions (5 Nov 2026) — migration implications
* **STO-82 header fields:** migrated entries keep exactly what S1 stored; `startedAt`, `levelId`, `evidence`, `entrySchema` are **absent** (not invented, not defaulted); `entrySchema` absent ⇒ 1. **Unknown optional fields in the S1 buffer or in an existing results record survive R2** (the sanitizer for results entries must preserve them).
* **STO-74/77 restriction:** the migration never prunes, folds or removes; `prunedThrough`/`deletions` are created absent (or null) and inactive; existing summaries are copied untouched (no new folding, no change to their merge behaviour).
* **STO-98:** the migration does not touch tombstones or the ledger; migrated entries have tombstones exactly as the S1 core had them; `creditStatus` is derived only afterwards.
* **STO-96/97:** the pending queue and flush are runtime behaviour; the migration itself uses the existing verified-write steps (R1–R3), failure ⇒ compat mode with the persistent failure notice of STO-93.
* **Compatibility tests required** (test strategy §12): migrated entries; unknown optional fields; missing optional fields; higher `entrySchema`.

## 15. Owner decisions C4 and C5 (5 Nov 2026, accepted with conditions) — migration implications
* **C5 — compatibility mode.** While the upgrade has not completed successfully, Reset, Start Fresh, Core Restore and Rollback are **refused completely** (zero writes), with a clear "the upgrade must finish first" explanation (ru/ky/de) and a retry-upgrade action; a failed upgrade leaves all existing data intact; the operations are available again after a verified `layout: 2`. In compat mode the embedded history stays in the layout-1 record and is **merged, never replaced**, by the later R2. This **refines §4**: compat mode never offers a path that could empty or replace history.
* **C4 — folding disabled, tombstone expiry unchanged.** The migration does not fold or remove any result and does not alter tombstones, their expiry or the ledger; `creditStatus` for migrated entries older than the tombstone window yields no label.
