# S1 Implementation Report — preferences and tutor storage separation

**Date:** 5 November 2026 · **Scope:** S1 only (STO-01, 02, 04, 05, 06, 07, 11, 17, 18). S2–S6 not started. Nothing committed. No dependency added. `bilup-deutsch:v1` and unknown keys are never written or removed.

## What was built
* Records: course `bilup-deutsch:v2:de-general` (`schemaVersion` 2, `layout: 1`, no preference/tutor fields), `bilup-deutsch:prefs`, `bilup-deutsch:tutor:de-general` (self-describing, epoch-stamped). New: `src/storage/slices.ts`; changed: `persistence.ts`, `merge.ts`, `validate.ts`, `core.ts`, `data/types.ts` (`AIMessage.at?`), `app/store.tsx`, `StorageNotice`, `storage-messages`, `ProfileScreen`, `TutorChat` (list key).
* Write isolation: `saveProgress` merges group by group and writes only changed records, core → prefs → tutor, with epoch guards before and after each slice write (conflict reported to the store, which adopts the stored state).
* Monolith → split upgrade on load (U1 exact-bytes pinned backup, U2 prefs, U3 tutor, U4 core); idempotent, resumable; failure leaves the monolith intact and the session in "monolith mode".
* v1 migration: slices first, core last. Replacements (restore, start-fresh): core first.
* Damage handling per slice with exact-byte quarantine first; newer-version slice untouched; stale-epoch slice ignored; anomalous (higher-epoch) slice quarantined. Low-priority dismissible notice (ru/ky/de; **Kyrgyz unreviewed**).
* Interim snapshot rule: composite monolith-format snapshot (`snapshotComposite`/`preserveCurrent`); reset/restore/start-fresh/rollback refuse when the copy cannot be made (`reset()` now returns boolean; Profile screen shows a message).
* Timestamps: preferences `settingsAt` (monotonic); tutor `at`, `tutorAt`, `tutorClearedAt`; `clearTutor` propagates across tabs.

## Deviations from the approved design (need owner sign-off)
1. Unstamped tutor messages get `at = position + 1` everywhere (upgrade, drift, fixtures) instead of a time derived from the record's `updatedAt` — deterministic across tabs.
2. Two different tutor messages sharing an id are both kept **unrenamed** (the `#2` renaming was not associative); final tiebreak is canonical JSON. React list key now includes `at` and role.
3. Drift: stale v1 tutor messages already held keep our timestamps; new ones are placed after everything held.
4. Slice cleanup of a stale-epoch slice overwrites it with defaults silently (as designed); `rollbackToLegacy` removes slices before the core (as designed).

## Verification
* `npm run check`: typecheck pass; lint 0 errors; **tests 28 files / 666 passed** (545 pre-existing — 17 updated with stated reasons, all because they asserted the single-record layout — plus 121 new in `tests/storage/s1-split.test.ts` and `s1-app.test.tsx`); content validation 0 errors; boundaries 5 report-only violations (unchanged); build pass.
* Failure injection (in the suite): crash-before/after, quota, unavailable and lying writes at each of the 4 writes of the monolith upgrade and the v1 migration; backup failure; slice-only quota; snapshot-only failure for start-fresh/restore/rollback/reset; quarantine failure for a damaged slice.
* Mutation testing (13 defects, scratch script): **12 killed**; survivor M9 (slice epoch guard removed) is masked by the second, earlier core-epoch guard in `writeChanged` (defence in depth; equivalent behaviour). Killed: stale slice accepted, wrong precedence, split field left in core, snapshot omits tutor, unknown key deleted, core-before-slices in creation, no quarantine before replace, clear not propagating, snapshot failure not blocking, `v1` removed, upgrade backup skipped, pinned backup rotated away.

## Known limits / open items
* Residual cross-tab race (accepted): a stale slice that slips in is ignored on load and detected by the writer; Web Locks remain S4.
* Not done: Playwright/real-browser checks (S6); M1/M4 measurements; native Kyrgyz review; absolute size budgets (none frozen).
* Drift re-adds stale chat lines a learner cleared (union semantics; same as before S1).
