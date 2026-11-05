# S1 Deviation Verification & Closure

**Date:** 5 November 2026 · **Scope:** S1 only · Nothing committed, no dependency added, schemaVersion unchanged (2), no S2–S6 work.
Tests: `tests/storage/s1-verification.test.tsx` (new, 22 tests) plus the existing S1 suites.

## A. Executive verdict
* **S1 ready to close: YES, with the conditions in §E** (owner sign-off on the deviations as amended below; real-browser checks still outstanding).
* **A real defect was found and fixed in S1** (Verification C): lines the learner had cleared in the new app **were resurrected** when a stale v1 shell rewrote its old transcript. Regression tests added.
* **A second defect was found and fixed** (C, crash window): drift processing wrote the course record (carrying the "processed" fingerprint) *before* the tutor record, so a crash between the two could mark a drift as merged while losing its tutor lines. Records are now written first when the drift marker moves.
* Data-integrity assessment: no `bilup-deutsch:v1` write/removal, no unknown-key removal, no stale-epoch overwrite in any tested path; exact-byte backups unchanged.

## B. Deviation assessments

### B1. Legacy tutor ordering: `at = position + 1`
* **Original behaviour:** unstamped messages get a position-based value per list.
* **Findings:**
  * Deterministic and idempotent (re-reading stamped data never changes it); sorts before any real timestamp (real values are ≥ 1e12); appended messages always come after; equal-`at` ties are fully ordered (at, id, canonical JSON) — all permutations give one result.
  * **Weakness found:** the value is a *position*, not a time, and differs between two lists that overlap with different offsets. The same line then appeared with two different `at` values and the merge kept it **twice**. Fixed: tutor identity is now **id + role + text**, not the time; the same line seen with a position stamp and with a real time is one line with the **later** time. Ordering among position-stamped lines from *different overlapping windows* can still tie and then falls back to id order (deterministic, may differ from the true chronology). This only arises when two unstamped sources overlap (a development profile upgrade, or v1 drift), and the stamp is persisted after first read.
  * Sequence numbers are **not** treated as times: they are confined to the range below any real timestamp and never compared with `tutorClearedAt` except to be dropped by a clear (correct: they are older).
* **Tests:** stamping idempotent/not alphabetical; repeated migration yields identical bytes; position stamp + real time = one line; overlapping windows deterministic and commutative; all permutations with equal `at`; append after migrated lines.
* **Code change:** `mergeTutor` identity (`merge.ts`). No persisted-format change.
* **Verdict: ACCEPT WITH CONDITIONS** — keep `at`; if exact chronology of legacy lines from overlapping sources ever matters, add a separate `legacyOrder` field in a later stage (not done: it would change the persisted format).

### B2. Duplicate tutor ids
* **Original behaviour:** different messages with the same id are both kept, never renamed.
* **Findings:** both survive save/reload with original ids; merge is idempotent/commutative/associative (exhaustive over 11 representative subsets of a pool containing same-id-different-text, same-line-different-time); re-merging adds nothing. **UI identity was not guaranteed**: the previous React key (`id-at-role`) collides for two same-id, same-time, same-role messages. Fixed: key = `index:id` (the list is append-only; there is no per-message edit/delete in the app, only "clear all", so an index key cannot affect another message).
* **Tests:** exhaustive algebra; no duplicates on re-merge; save/reload keeps both with ids; rendering `TutorChat` with two same-id messages shows both and produces **no React duplicate-key warning**.
* **Code change:** `TutorChat.tsx` key.
* **Verdict: ACCEPT.**

### B3. Stale v1 shell and Tutor clearing (critical)
* **Original behaviour:** stale lines not currently held were appended as new → after a clear they returned.
* **Defect confirmed** (mutation V1 shows the tests catch it). **Fix:** during drift, a stale line is dropped when the chat has been cleared here and the line is not newer than the clear:
  * ids shaped `u<ms>`/`a<ms>` (how the app always named them) carry their creation time → dropped if `<= tutorClearedAt`, kept (with that real time as `at`) if newer;
  * other ids → dropped when found in the pristine migration copy or an earlier stored v1 copy (the copy of the write being processed is excluded, otherwise genuinely new lines would look old).
* **Tests (all pass):** cleared lines stay cleared; a genuinely new line after the clear is kept with its real time; old-style ids dropped via the pristine copy; repeated processing idempotent (same bytes → no change; different bytes, same chat → still cleared); drift → clear → same bytes → nothing returns; stale name never overrides current preferences; after a deliberate replacement no drift; drift backup failure merges nothing; crash at each of 4 writes converges; `v1` bytes never written or removed, unknown keys untouched, no `remove` calls.
* **Known limit:** a line with a non-time id that was only ever in an *older drift copy that has since rotated away* is treated as new. (Only reachable by long-lived v1 shells writing multiple times after several clears.)
* **Verdict: ACCEPT WITH CONDITIONS** (after the fix).

## C. Mutation verification
Method: a script applies one exact textual change, runs the three S1 suites, restores the file, records the result. After the run `persistence.ts`, `merge.ts` and `TutorChat.tsx` were byte-compared with copies taken beforehand: **identical**.

| # | Mutation | Result |
|---|---|---|
| V1 | drift clear-filter removed (`if (false) continue`) | KILLED |
| V2 | **slice epoch guard removed** (`if ((meta.epoch…) …) {` → `if (false) {`) | **KILLED** (new test: a stored slice of a higher epoch than an equal-epoch core is not overwritten; the earlier survival was because no test isolated this guard) |
| V3 | **core epoch guard removed** | KILLED (new test: after the core epoch advances a stale writer performs **zero** `setItem` calls, replace and merge modes; stored bytes unchanged; stale name not stored) |
| V4 | tutor identity includes time | KILLED |
| V5 | load-path drift writes core before slices | SURVIVED — **equivalent mutant**: the generic rule in `writeChanged` (marker moved ⇒ slices first) also covers the load path; both are kept as defence in depth |
| V6 | marker-moves rule removed | KILLED |
| V7 | React key = id only | KILLED |
| V8 | drift's own backup counted as "known" | KILLED |

The 13 mutations of the S1 implementation run (12 killed; M9 now killed by V2) stand. Demonstration for D: with the slice guard removed the *core* guard alone still rejects the stale writer (V2 kills only the independent anomalous-slice test); with the core guard removed the zero-write test fails (V3).

## D. Regression results
| | Before | After |
|---|---|---|
| Test files / tests | 28 / 666 | **29 / 688** |
| Typecheck | pass | pass |
| ESLint | 0 errors, 8 warnings | 0 errors, 8 warnings (same) |
| Content validation | 0 errors | 0 errors |
| Boundaries (report-only) | 5 violations, 0 cycles | 5 violations, 0 cycles |
| Production build | pass | pass |

Tracked modified files: 25 (all pre-existing P0–P1/S1 work; this task changed `src/storage/merge.ts`, `src/storage/persistence.ts`, `src/features/ai/TutorChat.tsx`). Untracked: 21 entries (docs, tests, storage modules, etc.). Nothing committed.

## E. Remaining limitations
* **Accepted S1 risks:** residual cross-tab race (stale slice ignored on load; detected by the writer); overlapping unstamped legacy windows may tie-order by id; drift-resurrection limit in B3; position stamps are not times.
* **S1 defects:** none known after the two fixes above.
* **Browser-level checks outstanding:** no real browser was used — real `storage` events, quota exhaustion, iOS/Android behaviour (M1/M4, S6).
* **Deferred:** `legacyOrder` field; Web Locks (S4); results/global records (S2/S3); Kyrgyz native review of the three notices.

## F. Final recommendation
S1 can be closed once the owner accepts the three deviations as amended here (B1 with conditions, B2, B3 with conditions). A separate S2 **design** task may begin; no S2 implementation without explicit approval.
