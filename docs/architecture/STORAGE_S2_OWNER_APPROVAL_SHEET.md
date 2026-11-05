# BilUp Til 2.0 — Storage S2: Owner Approval Sheet

**Date:** 5 November 2026 · **DESIGN ONLY.** Nothing in this sheet authorises implementation. **The 12 S2 architecture decisions (section B) and STO-92 are ticked: owner ARCHITECTURE APPROVAL, 5 Nov 2026.** Section A2 ticks record owner-accepted scope decisions (not approvals). Sections C–E are unticked (deferred/open). **This approves the architecture only; NO implementation authorisation exists** (section H, unticked).
**Categories used everywhere (5 Nov 2026):** **[REQUIREMENT]** owner-confirmed product requirement (STO-13, 71, 76, 84, 90) · **[ACCEPTED]** owner-accepted scope/condition decision (STO-93…STO-99 and the conditions/scope restrictions recorded on STO-74, 77, 82) · **[ARCH-APPROVED]** architecture approval by the owner (**STO-92 and the 12 S2 decisions of section B**) · **[PROPOSED]** awaiting the owner's separate architecture approval · **[IMPL-AUTH]** implementation authorisation (**none given**).
**Sources:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) · [`STORAGE_S2_MIGRATION_PLAN.md`](STORAGE_S2_MIGRATION_PLAN.md) · [`STORAGE_S2_TEST_STRATEGY.md`](STORAGE_S2_TEST_STRATEGY.md) · [`STORAGE_CANONICAL_DECISION_REGISTER.md`](STORAGE_CANONICAL_DECISION_REGISTER.md) · [`STORAGE_IMPLEMENTATION_GATE.md`](STORAGE_IMPLEMENTATION_GATE.md). S1 is complete and unchanged.

## Stage boundaries (not decisions)
* **S2 (this sheet):** dedicated Results record, versioned attempt-entry schema, migration, compatibility, **no automatic deletion**, the deletion *mechanism* guarantees (STO-88).
* **S2b (separate design review + approval):** capturing the missing fields — submitted answers, prompts, expected answers, feedback, explanation language, writing/speaking text, mistake linkage.
* **Outside S2 implementation:** history UI, export/import, retention policy, IndexedDB migration, achievement persistence (achievements stay computed), S3–S6.

## A. Owner-confirmed product requirements (recorded; not architecture approvals)
- [x] **STO-13** — no `bilup-deutsch:v2` build has reached real users (pre-release / development-profile migration). *Confirmed 5 Nov 2026.*
- [x] **STO-71** — BilUp Til must provide learners with a full user-visible history of their learning attempts, including submitted answers, mistakes and exercise results. Raw attempt data is product data and is never discarded automatically. *Confirmed 5 Nov 2026.*
- [x] **STO-76** — composite safety snapshots must **not** include the full learning-attempt history. *Confirmed 5 Nov 2026 (snapshot requirement only). Consequences and the interaction with STO-88: design §9; deletion safety = STO-89.*
- [x] **STO-90** — *"Reset, Start Fresh and Core Restore must not silently delete or invalidate the learner's detailed attempt history. The Results record remains independent of Core reset and restoration operations. History can only be deleted through an explicit, separately confirmed history-deletion operation. XP, mastery, completed topics, achievements and the XP ledger must remain unaffected by history deletion. No automatic history deletion is permitted."* *Confirmed 5 Nov 2026 (requirement only). Consequences: design §10–§11; the reset confirmation wording (ru/ky/de, reviewed) is part of S2 implementation scope.*
  - **Scope EXTENDED TO ROLLBACK by the owner (5 Nov 2026):** *"STO-90 explicitly includes Rollback. Reset, Start Fresh, Core Restore and Rollback must preserve the existing Results record. None of these operations may silently invalidate, overwrite, quarantine, empty or delete detailed attempt history."*
- [x] **STO-84** — deleting detailed learning-attempt history must **not** change XP, the XP ledger, mastery, completed topics or achievements; only detailed attempt history is deleted; enforced architecturally. *Confirmed 5 Nov 2026. Mechanism: STO-88 (proposed).*

## A2. Owner-accepted scope and condition decisions (5 Nov 2026) — [ACCEPTED], not architecture approvals, not implementation authorisation
- [x] **STO-93** — R3 accepted **with conditions**: failure notice visible until the failure clears; explicit warning that unsaved work may be lost on closing/reloading; retry offered; pagehide flush best effort; **no durability guarantee claimed**; revisit after S4 export and P8 server sync.
- [x] **STO-94** — notice dismissal scoped to a failure episode; a new failure or failure-kind transition re-arms the notice.
- [x] **STO-95** — stale-epoch conflict notice; clearly distinguishes retained history from XP not part of current progress; ru/ky/de; Kyrgyz native review before release.
- [x] **STO-96** — uncapped in-memory pending history queue; no entry silently discarded; pending count and retry shown; history-readonly for newer-version records; session-memory limitation and potential memory growth documented.
- [x] **STO-97** — synchronous pagehide/visibility-hidden flush covers pending history and unsaved state even with zero study seconds; best effort; limits documented.
- [x] **STO-98** — Core tombstones are the sole duplicate-credit authority; results may support daily-cap eligibility but never grant/deny first-time XP; duplicate and replay tests; Core ledger authorisation preserved.
- [x] **STO-99** — `entry.xp` informational only; `creditStatus` rules; entries older than the tombstone window never labelled uncredited.
- [x] **Conditions on STO-82** — attempt-level header fields accepted; unknown optional fields survive sanitisation and rewrites; never invent missing historical fields for migrated entries; compatibility tests.
- [x] **Scope restriction on STO-74 and STO-77** — "Reserved / inactive in S2": no pruning, folding, automatic removal or deletion; watermark and related fields inactive; Results union by `resultId`; current summary behaviour preserved, no new folding. *(Architecture approval of STO-74 and STO-77 was given on 5 Nov 2026 — section B.)*
- [x] **C4 — OWNER-ACCEPTED WITH CONDITIONS (5 Nov 2026)** — Results folding is disabled; the existing tombstone expiry is kept unchanged. Conditions: no change to XP credit rules or tombstone expiry; no deletion/pruning of historical Results; entries older than the tombstone window never labelled uncredited; no change to the Core ledger or reward authority. *(Attached to STO-74, 77, 87; not an architecture approval.)*
- [x] **C5 — OWNER-ACCEPTED WITH CONDITIONS (5 Nov 2026)** — Reset, Start Fresh, Core Restore and Rollback are refused while in compatibility mode and the upgrade has not completed successfully. Conditions: blocked completely (never partially executed); clear explanation that the upgrade must finish first; failed upgrades leave existing data intact; available again after a successful upgrade; Results history never overwritten or invalidated by compatibility-mode handling. *(Attached to STO-78 and STO-90; not an architecture approval.)*
- [x] **STO-100 — OWNER-CONFIRMED (5 Nov 2026)** — failure notices (`save-failed`, `history-not-saved`, `history-readonly`) cannot be dismissed while the failure/unsaved condition persists; informational notices may be dismissed, scoped to a failure/information episode (STO-94); a new episode or relevant transition makes the notice visible again. *Not an architecture approval.*

## B. Architecture decisions — OWNER-APPROVED 5 Nov 2026 (architecture only; was: unticked — each needs the owner's explicit approval)
- [x] **STO-70 — ARCHITECTURE APPROVED (5 Nov 2026)** — Dedicated, independently versioned results record as the history store (Option A)
  - **Exact question:** Should attempt history live in its own epoch-stamped record `bilup-deutsch:results:de-general`, with the in-memory shape unchanged?
  - **Status:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026) — not an implementation authorisation**
  - **Recommended default:** Yes (S1 slice pattern).
  - **Alternatives:** Segmented log; keep in core; stop persisting raw results (rejected by STO-71).
  - **Dependencies:** STO-71, 72, 78, 86.
  - **Data-integrity risk:** More cross-key windows; regressions.
  - **Acceptance criteria:** Core record has no raw results; invariant matrix green.
  - **Owner approval:** **given (architecture only)**

- [x] **STO-72 — ARCHITECTURE APPROVED (5 Nov 2026)** — What stays in the course record
  - **Exact question:** Which data must remain in the core so losing the results record can never change rewards?
  - **Status:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026) — not an implementation authorisation**
  - **Recommended default:** Ledger/XP, tombstones, summaries, completions, mastery, and the reserved (inactive) watermark.
  - **Alternatives:** Move tombstones with results (rejected).
  - **Dependencies:** STO-70.
  - **Data-integrity risk:** Core grows with tombstones.
  - **Acceptance criteria:** Results record deleted/damaged ⇒ core byte-identical, replay still a no-op.
  - **Owner approval:** **given (architecture only)**

- [x] **STO-73 — ARCHITECTURE APPROVED (5 Nov 2026)** — Layout 2 marker; old builds read-only; rollback = explicit restore
  - **Exact question:** Is `layout: 2` (S1 builds read-only) the version mechanism and rollback an explicit restore of the pinned backup?
  - **Status:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026) — not an implementation authorisation**
  - **Recommended default:** Yes; `schemaVersion` stays 2.
  - **Alternatives:** `schemaVersion` 3; dual-write.
  - **Dependencies:** STO-04 (done).
  - **Data-integrity risk:** Old cached shells read-only; rollback loses post-upgrade data.
  - **Acceptance criteria:** Old-build read-only test, zero writes.
  - **Owner approval:** **given (architecture only)**

- [x] **STO-74 — ARCHITECTURE APPROVED (5 Nov 2026)** — Watermark + direction-based write ordering (approved deletion only; no automatic pruning)
  - **Exact question:** May any deletion/fold of history use the `prunedThrough` watermark and "additions before core, removals after" ordering, with no automatic pruning? **Owner accepted the scope restriction (5 Nov 2026): reserved watermark design only — in S2 no pruning, folding, automatic removal or deletion; watermark and related fields inactive (design §13.9). Architecture approval given 5 Nov 2026.**
  - **Status:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026) — not an implementation authorisation**
  - **Recommended default:** Yes — additions-before-core ordering implemented; watermark and removal-after-core ordering **reserved/inactive in S2** (optional `prunedThrough` validated/preserved/never written with a value; no pruning, folding or removal; tombstone expiry unchanged — C4).
  - **Alternatives:** id sets; single record.
  - **Dependencies:** STO-70, 79, 88.
  - **Data-integrity risk:** Statistics errors if wrong (not rewards).
  - **Acceptance criteria:** Crash between writes never loses both copies nor double counts.
  - **Owner approval:** **given (architecture only)**

- [x] **STO-75 — ARCHITECTURE APPROVED (5 Nov 2026)** — Results record absent/damaged/newer-version (never "stale" by core epoch — STO-90)
  - **Exact question:** What happens when the history record cannot be used?
  - **Status:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026) — not an implementation authorisation**
  - **Recommended default:** Empty in memory, quarantine exact bytes first, notice, core untouched; newer-version record never rewritten.
  - **Alternatives:** Treat as core damage; block recording.
  - **Dependencies:** STO-70.
  - **Data-integrity risk:** Repeat rule may under-credit.
  - **Acceptance criteria:** Corruption matrix; core bytes identical.
  - **Owner approval:** **given (architecture only)**

- [x] **STO-77 — ARCHITECTURE APPROVED (5 Nov 2026)** — Cross-tab merge for history and summaries
  - **Exact question:** How are two tabs' history and summaries reconciled? **Owner accepted the scope restriction (5 Nov 2026): union by `resultId` and the documented merge only; no pruning/folding/removal in S2; current summary behaviour preserved (design §13.9). Architecture approval given 5 Nov 2026.**
  - **Status:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026) — not an implementation authorisation**
  - **Recommended default:** Union by `resultId`; `deletions`/`prunedThrough` merged by max but **inactive** in S2; existing summaries keep their current per-field-max merge; nothing dropped, folded or removed.
  - **Alternatives:** Per-field max (overcounts); last-writer-wins.
  - **Dependencies:** STO-74, 88.
  - **Data-integrity risk:** Slightly low statistics.
  - **Acceptance criteria:** Merge algebra tests; no resurrection of deleted entries.
  - **Owner approval:** **given (architecture only)**

- [x] **STO-78 — ARCHITECTURE APPROVED (5 Nov 2026)** — S1 → S2 migration procedure and compat mode
  - **Exact question:** Is R0–R4 (exact pinned backup, merge-write results record, verify, then core with `layout: 2` last; compat mode on failure) acceptable? **Owner decision C5 (5 Nov 2026): in compat mode Reset, Start Fresh, Core Restore and Rollback are refused completely until the upgrade succeeds (design §13.13).**
  - **Status:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026) — not an implementation authorisation**
  - **Recommended default:** Yes; no retention applied, entries tagged `capture:"basic"`.
  - **Alternatives:** Lazy migration; dropping old results.
  - **Dependencies:** STO-70, 73, 82.
  - **Data-integrity risk:** Transient quota ≈ 2×.
  - **Acceptance criteria:** Crash/quota/lying matrix; rerun changes nothing; core ledger/progress byte-equal.
  - **Owner approval:** **given (architecture only)**

- [x] **STO-80 — ARCHITECTURE APPROVED (5 Nov 2026)** — A failed history write never blocks the credit; entry kept in a pending queue and retried; conflict and history-not-saved notices; duplicate check on Core tombstones only (verification: design §12)
  - **Exact question:** If the history record cannot be written but the core can, is the result still credited? **Its dependencies (STO-93…STO-99) are owner-accepted; architecture approval given 5 Nov 2026.**
  - **Status:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026) — not an implementation authorisation**
  - **Recommended default:** Yes; notice; retry; never delete older history to make room.
  - **Alternatives:** Refuse to credit.
  - **Dependencies:** STO-70, 87.
  - **Data-integrity risk:** A gap in history while storage is full (surfaced).
  - **Acceptance criteria:** Quota-injection test.
  - **Owner approval:** **given (architecture only)**

- [x] **STO-81 — ARCHITECTURE APPROVED (5 Nov 2026)** — Write-isolation acceptance for S2
  - **Exact question:** Is relative write isolation the acceptance requirement (no frozen byte numbers)?
  - **Status:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026) — not an implementation authorisation**
  - **Recommended default:** Yes.
  - **Alternatives:** Absolute budgets (unsupported).
  - **Dependencies:** STO-79.
  - **Data-integrity risk:** None.
  - **Acceptance criteria:** Recording-store assertions.
  - **Owner approval:** **given (architecture only)**

- [x] **STO-82 — ARCHITECTURE APPROVED (5 Nov 2026)** — Attempt-entry schema and capture staging (S2 vs S2b)
  - **Exact question:** Do entries carry a versioned schema (`entrySchema`, `capture`) with optional detail fields in S2, while capturing the missing fields is a separate stage S2b? **Owner accepted the attempt-level header fields with conditions (5 Nov 2026; design §13.8): unknown optional fields survive sanitisation/rewrites; nothing invented for migrated entries; compatibility tests. Architecture approval given 5 Nov 2026.**
  - **Status:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026) — not an implementation authorisation**
  - **Recommended default:** Yes. S2b = capture of answers, prompts, expected answers, feedback, explanation language, writing/speaking text, mistake linkage.
  - **Alternatives:** One stage; store full exercise copies.
  - **Dependencies:** STO-83, 85.
  - **Data-integrity risk:** Capture touches learning screens (separate review).
  - **Acceptance criteria:** Field table approved; legacy entries never fabricated.
  - **Owner approval:** **given (architecture only)**

- [x] **STO-87 — ARCHITECTURE APPROVED (5 Nov 2026)** — Quota: never delete history automatically
  - **Exact question:** When storage is full, may the app delete or fold history? **Owner decision C4 (5 Nov 2026): results folding disabled; tombstone expiry unchanged (design §13.12).**
  - **Status:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026) — not an implementation authorisation**
  - **Recommended default:** No: keep in memory, retry, notice; offer export/delete later (S4).
  - **Alternatives:** Early auto-pruning (rejected by STO-71).
  - **Dependencies:** STO-14, 80, 84.
  - **Data-integrity risk:** History gap while full (surfaced).
  - **Acceptance criteria:** Quota-injection tests prove no entry removed.
  - **Owner approval:** **given (architecture only)**

- [x] **STO-88 — ARCHITECTURE APPROVED (5 Nov 2026)** — History-deletion mechanism (amended by STO-76)
  - **Exact question:** Is deletion an operation over the results record only (one `setItem`), with all/course scopes and an in-record marker, progress untouched — implemented in a later stage, with S2 only reserving an optional, preserved, never-written `deletions` field?
  - **Status:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026) — not an implementation authorisation**
  - **Recommended default:** Yes. Safety copy = history-specific backup (STO-89), not a composite snapshot.
  - **Alternatives:** Implement deletion in S2 (needs STO-89/91 first); edit the whole core; adjust summaries.
  - **Dependencies:** STO-70, 74, 84, 85, 87, 89.
  - **Data-integrity risk:** Marker/clock edge; deleted history persists in the HB until expiry.
  - **Acceptance criteria:** Design §8–§9 and test strategy §7–§8; core bytes identical.
  - **Owner approval:** **given (architecture only)**

- [ ] **Approve STO-89** — History-specific temporary backup for history deletion (Option A)
  - **Exact question:** Before deleting history, must the app write a separate verified exact-bytes backup of the deleted scope, excluded from composite snapshots, and refuse the deletion if it cannot be written?
  - **Status:** PROPOSED architecture (later deletion stage)
  - **Recommended default:** Yes.
  - **Alternatives:** B: no deletion until a recovery mechanism exists; C: soft-delete trash inside the record.
  - **Dependencies:** STO-76, 84, 88, 91, 14, 87.
  - **Data-integrity risk:** Quota (≈ 2× transient); deleted data persists until expiry.
  - **Acceptance criteria:** HB verified before deletion; refusal on failure; excluded from snapshots/rotation; crash matrix.
  - **Owner approval required:** yes — before the deletion stage, not to start S2

- [x] **STO-92 — OWNER APPROVED (5 Nov 2026)** — Core-only restore sources keep the current preferences and tutor
  - **Exact question:** When restoring from a core-only copy (pinned S1 backup R1, a layout-1/2 course record, quarantined core bytes), is only the Core replaced while the CURRENT preferences and tutor are kept (instead of being reset to defaults), with R1's history merged into Results?
  - **Status:** **OWNER APPROVED 5 Nov 2026** — intentional behaviour change from S1; dedicated migration, restore, rollback and regression tests required in S2
  - **Recommended default:** Yes; the dialog says "progress only — your settings and tutor chat are kept".
  - **Alternatives:** write defaults (current S1 behaviour — rejected); restore backed-up values (not in the copy).
  - **Dependencies:** STO-17, 76, 78, 90.
  - **Data-integrity risk:** preserved settings may not match the restored era (disclosed).
  - **Acceptance criteria:** preferences/tutor byte-equal after core-only restore; ru/ky/de dialog text; mutation M-S2-18 killed.
  - **Owner approval required:** yes

## C. Open product decisions
- [ ] **Approve STO-85** — Privacy and data minimisation of history
  - **Exact question:** Is free text (writing, speaking, typed answers) stored by default or on opt-in; length caps; included in snapshots/exports? **Owner (5 Nov 2026): remains OPEN; deferrable to S2b provided S2 captures or exposes no additional free-text data (design §13.11).**
  - **Status:** OPEN product decision
  - **Recommended default:** Disclosed default or opt-in; capped; export optional flag.
  - **Alternatives:** Always store; never store.
  - **Dependencies:** STO-76, 82, 88.
  - **Data-integrity risk:** Plaintext personal data on device.
  - **Acceptance criteria:** Approved wording and behaviour with tests.
  - **Owner approval required:** yes

- [ ] **Approve STO-91** — Retention duration of the temporary history backup
  - **Exact question:** How long is the history backup kept, and may the learner purge it earlier?
  - **Status:** OPEN product decision
  - **Recommended default:** No default (keep OPEN); explicit early purge with a second confirmation.
  - **Alternatives:** Fixed days; until next session; until purged.
  - **Dependencies:** STO-79, 85, 89.
  - **Data-integrity risk:** Silent expiry would delete history.
  - **Acceptance criteria:** Approved duration + fake-clock tests.
  - **Owner approval required:** yes — before the deletion stage

## D. Open technical decisions
- [ ] **Approve STO-83** — Content versioning and stable references for history
  - **Exact question:** Snapshot, versioned reference, or both — given that authored `ex###` ids renumber when content changes? **Owner (5 Nov 2026): remains OPEN; deferrable to S2b under the same S2 free-text guard.**
  - **Status:** OPEN technical decision
  - **Recommended default:** Compact snapshots + references with `lang`; `contentRef.version` once manifests exist.
  - **Alternatives:** Snapshot everything; references only.
  - **Dependencies:** STO-60, 82, P2.
  - **Data-integrity risk:** History showing a different answer than the learner saw.
  - **Acceptance criteria:** Change/removal/renumber fixtures.
  - **Owner approval required:** yes

## E. Blocked by real-browser measurements
(Measurements S2-M1…M9 and the original M1/M4; **no number is frozen**; browser work needs the Playwright/dependency approval of S6 or manual device runs.)
- [ ] **Approve STO-79** — Retention duration, compaction and numeric budgets
  - **Exact question:** How long is history kept, and what size limits apply?
  - **Status:** OPEN — BLOCKED by browser measurements (numbers) / owner (duration)
  - **Recommended default:** No automatic deletion; no number frozen until S2-M1…M9 exist.
  - **Alternatives:** Freeze now from estimates.
  - **Dependencies:** STO-14, 15, 86, S6.
  - **Data-integrity risk:** Unbounded growth until a policy exists.
  - **Acceptance criteria:** Measurement report + owner-approved policy.
  - **Owner approval required:** yes

- [ ] **Approve STO-86** — Storage tier for history
  - **Exact question:** Is a localStorage record enough, or must detailed history move to IndexedDB?
  - **Status:** OPEN — BLOCKED by browser measurements
  - **Recommended default:** Decide after measurements; keep access behind one interface.
  - **Alternatives:** IndexedDB now; segmented log.
  - **Dependencies:** STO-79, S6.
  - **Data-integrity risk:** Wrong tier on estimates; IndexedDB changes the sync/recovery contract.
  - **Acceptance criteria:** Measurement report; tier passes the invariant matrix.
  - **Owner approval required:** yes

## F. Required before any S2 implementation
0. **Architecture approval of the 12 section-B decisions was given by the owner on 5 Nov 2026.** Section A2 items are owner-accepted conditions and remain binding.
1. ~~Owner approval of every item in **B**~~ — **DONE 5 Nov 2026** (STO-70, 72, 73, 74, 75, 77, 78, 80, 81, 82, 87, 88; STO-92 earlier). STO-89 is required only before the later deletion stage.
2. STO-83 and STO-85 are **deferrable to S2b** provided S2 captures or exposes no additional free-text data (design §13.11); STO-89 and STO-91 are deferred to a future deletion stage; STO-100 is owner-confirmed. STO-76 is confirmed.
3. STO-79 and STO-86 may remain open **only if** S2 ships the localStorage record behind one interface, no retention policy and no frozen numeric budget; otherwise the measurements must come first.
4. Characterization tests pinning current prune/merge behaviour (including the existing summaries double count) recorded as the baseline.
5. Explicit written authorisation to implement S2 — separate from the approvals above.

**Smallest safe S2 scope:** results record + extensible entry schema (+ reserved, preserved, never-written `deletions` field) + `layout: 2` + migration R0–R4 + compat mode + no automatic deletion + composite snapshots **without** history (`omitted:['history']`) + results writes independent of replace mode/core epoch + core-only restore keeping current preferences/tutor (STO-92) + disabled automatic pruning + **the updated reset confirmation wording (ru/ky/de, reviewed)**. The history-deletion operation (STO-88/89/91) is **outside S2**, as are S2b capture, history UI, export/import, retention policy and IndexedDB.

## G. Items outside this sheet (not decisions of S2)
S2b capture design · history UI · export/import (S4) · retention policy · IndexedDB migration · achievements persistence · Kyrgyz native review (S1 notices) · real-browser verification of S1.

## H. Implementation authorisation (separate from every approval above)
- [ ] **IMPLEMENTATION OF S2 AUTHORISED** — **NOT GIVEN.** The architecture approvals of section B are complete; what remains is the owner's **separate written implementation authorisation** (with the S2 free-text guard kept, STO-83/85 deferred to S2b, and STO-79/STO-86 left open under §F). The gate is **CLOSED**.
