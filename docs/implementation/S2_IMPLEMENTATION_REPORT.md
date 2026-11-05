# S2 Implementation Report — detailed attempt history as its own record

**Date:** 5 November 2026 · **Authorised scope:** S2 only (owner implementation authorisation of 5 Nov 2026). Nothing committed; no dependency added; `schemaVersion` stays 2; S2b, history UI, export/import, history deletion, retention policy, IndexedDB: **not implemented**.
**Baseline (before S2):** 25 tracked modified files, 21 untracked entries, HEAD `386c6a1`, 688 tests / 29 files. **After:** 28 tracked modified (new: `src/i18n/{ru,de,ky}.ts`), 21 untracked entries (new files inside already-untracked directories), 767 tests / 31 files.

## 1. Files changed
* **New:** `src/storage/results.ts` (history record codec, merge, reserved `deletions`), `src/progress/creditStatus.ts`, `tests/storage/s2-results.test.ts`, `tests/storage/s2-app.test.tsx`.
* **Changed:** `src/storage/{activity,core,merge,persistence,slices}.ts`, `src/progress/engine.ts`, `src/app/{store.tsx,StorageNotice.tsx,RecoveryPanel.tsx,storage-messages.ts}`, `src/screens/ProfileScreen.tsx`, `src/i18n/{ru,de,ky}.ts`; tests updated with reasons: `tests/helpers.tsx`, `tests/progress/engine.test.ts`, `tests/storage/{s1-split,s1-app}.test.*`.

## 2. Storage behaviour implemented
* `bilup-deutsch:results:de-general` `{record:"results", v:1, epoch (informational), updatedAt, results[], deletions? , …unknown}`; `LAYOUT = 2`, `schemaVersion` 2. The course record (layout 2) contains **no** history. Entries: existing fields + optional `startedAt, levelId, evidence, entrySchema`; **unknown optional fields survive** sanitisation/rewrites (entries, items, record); nothing invented for migrated entries; no free text captured.
* Writes: **history first** (read → union → write, ignores replace mode and the core-epoch guard), then course, preferences, tutor; only changed records are written. A history write failure never blocks the credit (STO-80); the in-memory buffer is the pending queue (count shown, retried, never discarded).
* **No automatic deletion:** `pruneActivity` only expires tombstones (unchanged 400 days); results are never folded; `mergeActivity` unions; the engine decides duplicates from **Core tombstones only**; `creditStatus` derives credited / not-credited / *no label beyond the tombstone window*. `prunedThrough` and `deletions` are reserved: validated, preserved, merged by max, never written with a value.
* Snapshots **exclude history** (`omitted:['history']` inside the record and in the result). **History handling per operation (reconciled wording, 5 Nov 2026 — three distinct things):**
  * **Preserving existing Results** — every replacement operation keeps every existing entry: Reset, Start Fresh and Rollback never write or remove the history record (byte-identical, verified in real Chrome); `rollbackToLegacy` removes only the core, preferences and tutor keys.
  * **Merging historical Results** — Core Restore is the only operation that may **write** the history record, and only by *union*: entries that the restore source carries (an S1-era snapshot or the pinned layout-1 backup holds history inline) and that Results lacks are **added** (by `resultId`, no duplicates); this happens before the Core is replaced, and a failed merge write refuses the restore. When the source has nothing new, the record is not written.
  * **Replacing or deleting Results** — no operation does this. There is no code path that removes, folds, truncates or overwrites an existing entry.
  The earlier shorthand "Core Restore never touches the history record" was therefore imprecise: it never *replaces or removes* it, but it can *add* to it.
* **STO-92:** restoring a core-only copy restores the Core, **keeps current preferences/tutor**, and merges the copy's history (merge happens before anything is replaced; failure ⇒ refusal).
* **C5:** in compatibility mode (layout 0/1 upgrade incomplete) Start Fresh, Core Restore, Rollback and `reset` are refused at the operation layer **before any write** (`blocked: 'upgrade-pending'`); available again after a verified upgrade.
* UI: persistent failure notices (`save-failed`, `history-not-saved` with count, `history-readonly`) — no dismiss, loss warning, retry; informational notices dismissible **per episode** and re-armed by new failures; stale-epoch notice `replaced`; extended synchronous pagehide/visibility flush (pending history / unsaved state even with zero study seconds); reset confirmation wording ru/ky/de (history retained); all texts ru/ky/de — **Kyrgyz unreviewed, native review required before release**.

## 3. Migration and rollback
Layout 0 or 1 → 2 on load: R1 exact-bytes pinned backup (S1 pin kept in `upgrade.earlier`), R2 merge-write of the history record (union with the history inside the course record and any existing record), R3 verification of every attempt id, then the course record last (completion marker). Idempotent; crash/quota/unavailable/lying write at every write converges (tested). Failure ⇒ compatibility mode (history stays inside the old record, saves keep the old form). Rollback = explicit restore of the pinned copy: Core only, current preferences/tutor kept, history merged — never lost.

## 4. Tests added and results
* `s2-results.test.ts` (≈50 tests: record/schema/unknown fields, isolation, replace mode, damaged/missing/newer, upgrade + crash matrix, compat mode + refusal with zero writes, STO-90/92, snapshots, tombstone authority, creditStatus, no deletion, all result/core write combinations) and `s2-app.test.tsx` (9: persistent notices, episodes, flush, conflict notice, reset keeps history, compat refusal, wording).
* **`npm run check`: typecheck pass; ESLint 0 errors, 8 warnings (the pre-existing 8); 767 tests / 31 files passed; content validation 0 errors; boundaries 5 report-only violations, 0 cycles; production build passes.**
* **Mutation testing: 18 defects (history folded, blind overwrite, rollback removing history, start-fresh emptying history, snapshot including history, STO-92 removed, compat refusal removed, results as duplicate authority, R2 skipped, unpinned backup, history failure blocking core, unknown fields dropped, core guard removed, flush gated on seconds, dismissible failure notice, creditStatus ignoring the window, conflict notice removed, merge dropping entries) — 18 killed;** mutated files restored byte-identical.
* Failure injection (in the suites): crash-before/after, quota, unavailable and lying writes at every write of the upgrade; quota on core only / results only / both; quarantine failure; backup failure ⇒ compat mode.

## 5. S1 tests changed (each for a stated reason)
Layout 1→2 markers; monolith upgrade now ends in layout 2; layout 2 is a known layout (guard tests use 3, 7…); composite snapshots exclude history; `reset()` returns an outcome; result write order is history → course; engine tests for the former 500/90 retention now assert **no folding**; stored entries carry `startedAt/levelId/evidence`.

## 6. Data-loss and recovery analysis
No path removes, folds or empties history (tests + mutations). Residual (owner-accepted R3): if the session ends while storage keeps failing, pending entries/unsaved XP are lost; announced by a persistent notice with retry; flush is best effort. Compat mode keeps all data intact and blocks replacements.

## 7. Deviations and unresolved risks
* **Real-browser verification was executed after this report was first written** — see `S2_REAL_BROWSER_VERIFICATION_REPORT.md`. It found **two deviations** (STO-92 preference/tutor preservation on the damaged-core recovery path; missing STO-95 notice on the retry path) that the jsdom tests did not catch; **the "S2 implementation complete" statement above is superseded by that report's verdict.** The M-series measurements remain outstanding.
* Prior S1 automatic pruning has already folded older entries in development profiles; not recoverable (documented).
* Kyrgyz strings (notices, refusal, reset wording) unreviewed.
* Cross-tab residual race from S1 unchanged.
* `store.reset` refusal in compat mode uses the stored layout (not only in-memory state).

## 8. Git
Tracked modified: 28; untracked entries: 21; HEAD `386c6a1`; **nothing committed or pushed.**
