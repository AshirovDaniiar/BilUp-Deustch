# BilUp Til 2.0 — Storage Implementation Gate

**Date:** 5 November 2026 · **Type:** design-only gate · **Source of IDs:** [`STORAGE_CANONICAL_DECISION_REGISTER.md`](STORAGE_CANONICAL_DECISION_REGISTER.md)
**Status:** every gate below is **CLOSED** (S2: architecture approved 5 Nov 2026, implementation authorisation NOT given). No decision is APPROVED. This file does not approve anything; the owner records approval in their own decision log, then the gate is re-evaluated.

## 0. How the gate works

A stage may start only when **every decision in its "Required" list is APPROVED by the owner** and every "Evidence" item exists. "Advisory" items do not block but must be answered before the stage closes. A stage never starts because a later stage is ready.

Stage order is strict: **S1 → S2 → S3 → S4**. S5 and S6 are independent of S1–S4 except where noted (S6 measurements should precede the freeze of size budgets).

| Stage | Scope | Gate state | Required decisions (all currently PROPOSED/OPEN) |
|---|---|---|---|
| **S1** | Split preferences + tutor transcript | CLOSED — 9 decisions awaiting approval (+ sub-approvals); STO-13 CONFIRMED | ~~STO-13~~ (confirmed), 01, 02, 04, 05, 06, 07, 11, **17, 18** — detail: [`STORAGE_S1_FINAL_DESIGN.md`](STORAGE_S1_FINAL_DESIGN.md) |
| **S2** | Split raw-results buffer (design complete 5 Nov 2026, **not approved**) | CLOSED — S1 complete + 12 | STO-70…STO-81 (STO-16 superseded in detail by STO-74); STO-14, 15 remain provisional/unfrozen (STO-79) |
| **S3** | Global record, recovery-point bundle, stale-shell rule | CLOSED — S2 + 5 | STO-03, 08, 09, 10, 12 |
| **S4** | Export, import, reset, undo, pruning offer | CLOSED — S3 + 20 | STO-20…35 (see §4) |
| **S5** | Assisted attempts and XP policy | CLOSED — 5 | STO-40…44 |
| **S6** | Playwright and browser validation | CLOSED — 4 | STO-50…53 |

## 1. Stage S1 — preferences + tutor split (smallest safe scope)

**Required before start**

| ID | Why it blocks |
|---|---|
| STO-13 | **CONFIRMED** by explicit owner statement, 5 Nov 2026: no `v2`-writing build reached real users. Classification: **pre-release / development-profile migration**. Recorded fact, not an approval of a design decision. Safety requirements are unchanged (see below). |
| STO-01 | The layout change itself |
| STO-02 | Defines "done": per-key write budgets |
| STO-04 | How an old/new build tells layouts apart (marker, epoch-stamped slices) |
| STO-05 | Upgrade order and precedence for development profiles; slice-aware round trip |
| STO-06 | Which damage opens the recovery screen (preferences/tutor must not) |
| STO-07 | Write order and crash recovery |
| STO-11 | Cross-tab rules for the two new records |
| STO-17 | *(added)* Interim snapshot rule: after the split no snapshot may omit preferences or tutor; includes the refusal behaviour when a snapshot fails |
| STO-18 | *(added)* Timestamps and deterministic ordering for preferences and tutor (the tutor message has no timestamp today) |

**Amendments applied (S1 final design):** STO-02 is now *relative write isolation* — absolute numeric budgets are provisional until M1/M4 and are **not** an S1 criterion (so STO-14/STO-52 no longer gate S1); STO-05 uses the exact-bytes pinned monolith backup and merge-based precedence; STO-06 is narrowed to preferences and tutor; STO-07 separates replacing operations (core first) from creations (slices first, core last).

**Sub-approvals required with the S1 decisions** (S1 design §10): refusal of reset/restore/start-fresh when the safety snapshot fails (behaviour change); reset keeps erasing preferences and tutor in S1; acceptance of the documented residual race; native Kyrgyz review of three notices before any Kyrgyz release (not a build blocker).

**Safety requirements preserved after the STO-13 confirmation:** never write or delete `bilup-deutsch:v1`; the pinned migration backup preserves the exact original monolith bytes; unknown storage keys are never deleted; the upgrade is idempotent and crash-safe; development data is **not** assumed disposable. If a `v2`-writing build is later found to have reached users, STO-13 reverts to OPEN and S1 stops.
**Remaining owner approvals for S1 (STO-13 no longer among them):** STO-01, 02 (amended), 04, 05 (amended), 06 (narrowed), 07 (amended), 11, 17, 18, plus the sub-approvals (snapshot-failure refusal, reset semantics unchanged in S1, residual-race acceptance, Kyrgyz review of three notices). Full list: S1 design §10 and §11.
**Evidence required:** the S1 test list passes (per-key writes, core without split fields, separate corruption, crash after each upgrade write, precedence both ways, larger layout ⇒ read-only, all existing tests green).
**Advisory:** STO-52 measurements M1 and M4 (needed only before **absolute** numeric budgets are adopted; S1's relative write-isolation criterion needs no measurement and S1 freezes no size limit).
**Also required as evidence:** the "verify at implementation start" items of S1 design §10 (tutor id uniqueness, how drift treats v1 preferences, reset replace-mode) are answered by characterization tests before any storage code changes.
**Out of S1:** `activeDates`/`studySeconds` stay in the core; results stay in the core; no export, import, reset or undo.
**Stage-closing criterion:** no behaviour change visible to the learner except resilience; mutation matrix re-run and extended (stale slice accepted, wrong precedence, split field left in core).

> **S1 status (5 Nov 2026): COMPLETE** — implemented, verified and deviation-verified (688 tests). Real-browser verification and native Kyrgyz review of its notices remain outstanding.

## 2. Stage S2 — raw-results buffer split

**Design:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) · [`STORAGE_S2_MIGRATION_PLAN.md`](STORAGE_S2_MIGRATION_PLAN.md) · [`STORAGE_S2_TEST_STRATEGY.md`](STORAGE_S2_TEST_STRATEGY.md). **All S2 decisions are PROPOSED/OPEN; the gate is CLOSED.**

**Owner decisions of 5 Nov 2026 (categories):** **Categories used everywhere (5 Nov 2026):** **[REQUIREMENT]** owner-confirmed product requirement (STO-13, 71, 76, 84, 90) · **[ACCEPTED]** owner-accepted scope/condition decision (STO-93…STO-99 and the conditions/scope restrictions recorded on STO-74, 77, 82) · **[ARCH-APPROVED]** architecture approval by the owner (**STO-92 and the 12 S2 decisions STO-70, 72, 73, 74, 75, 77, 78, 80, 81, 82, 87, 88**) · **[PROPOSED]** awaiting the owner's separate architecture approval · **[IMPL-AUTH]** implementation authorisation (**none given**).
**OWNER-ACCEPTED scope/condition decisions (not architecture approvals, not implementation authorisation):** STO-93 (R3 accepted with conditions), STO-94 (notice dismissal per failure episode), STO-95 (stale-epoch conflict notice), STO-96 (uncapped in-memory pending queue, history-readonly), STO-97 (flush covers pending history/unsaved state), STO-98 (Core tombstones sole duplicate authority), STO-99 (`entry.xp` informational, `creditStatus`), plus the conditions on STO-82 and the "reserved / inactive in S2" scope restriction on STO-74 and STO-77 (design §13). **Owner decisions C4 and C5 (5 Nov 2026, ACCEPTED WITH CONDITIONS; not approvals; no implementation authorisation):** C4 — results folding disabled, tombstone expiry unchanged (STO-74/77/87; design §13.12); C5 — Reset, Start Fresh, Core Restore and Rollback refused completely in compatibility mode until the upgrade succeeds (STO-78/90; design §13.13). **The eight documentation corrections of `STORAGE_S2_FINAL_ARCHITECTURE_APPROVAL_REVIEW.md` (C1–C8) are applied.**
**OWNER-CONFIRMED 5 Nov 2026 (not an approval):** STO-100 (failure notices persistent; informational notices dismissible per episode). **Still OPEN:** STO-79 and STO-86 (browser measurements); STO-83 and STO-85 (deferrable to S2b **provided S2 captures or exposes no additional free-text data** — design §13.11); STO-89 and STO-91 (deferred to a future history-deletion stage). **Final approval review: `STORAGE_S2_FINAL_ARCHITECTURE_APPROVAL_REVIEW.md`.**
**STO-92: OWNER APPROVED (5 Nov 2026)** — core-only restore keeps current preferences/tutor and merges history (intentional behaviour change from S1; dedicated tests in S2).
**STO-90: OWNER-CONFIRMED (5 Nov 2026), scope EXTENDED TO ROLLBACK by the owner** — reset, start-fresh, core restore and rollback must not silently delete or invalidate detailed attempt history; the Results record stays independent of core replacement; history is deleted only by an explicit, separately confirmed operation; no automatic deletion (consequences: design §10; the reset confirmation wording must be updated with the S2 implementation).
**STO-76: OWNER-CONFIRMED (5 Nov 2026)** — composite safety snapshots must NOT include the full learning-attempt history (snapshot requirement only; deletion safety is STO-89, recommended for the later deletion stage).
**STO-84: OWNER-CONFIRMED (5 Nov 2026)** — deleting detailed attempt history must not change XP, ledger, mastery, completed topics or achievements (enforced architecturally; mechanism = STO-88).
**STO-71: OWNER-CONFIRMED (5 Nov 2026)** — full user-visible attempt history is a product requirement. It approves no architecture. Option C (no raw persistence) is rejected as a product direction; raw attempt data is never discarded automatically.
**Required decisions — ALL NOW OWNER ARCHITECTURE-APPROVED (5 Nov 2026); implementation still NOT authorised:** STO-70, 72, 73, 74 (as amended: deletion mechanism only, no automatic pruning), 75, 77, 78, 80, 81, 82, 87, 88 (as amended: deletion operation outside S2, optional `deletions` field reserved), 92 (**already owner-approved 5 Nov 2026**). **Pre-approval verification of the Results/Core write combinations: design §12** (adds notice/queue/flush/tombstone-only-duplicate-check requirements to S2 scope).
**Must be answered (OPEN) before S2 code:** STO-79 (retention duration, numeric budgets — unfrozen), STO-83 and STO-85 (**deferred to S2b under the S2 free-text guard — no longer required before S2 code if the guard is kept**), **STO-86 (storage tier — measurement-gated; localStorage may not hold thousands of detailed attempts)**.
**Stage split proposed (STO-82):** **S2** storage + entry schema + migration + no automatic deletion; **S2b** capture in the learning features (separate design review and approval — most history fields are *not captured today*); later: history UI (product stage) and export (S4).
**Evidence required before implementation starts:** S1 closed (done); characterization tests pinning current prune/merge behaviour including the latent summaries double count; `npm run check` baseline recorded.
**Evidence required to close S2:** the invariant matrix of the test strategy green; migration crash/quota/lying matrix; mutation survivors justified; XP/mastery regression fixtures identical; browser items listed as outstanding unless executed.
**Required before the later *history-deletion* stage (not before S2):** STO-89 (history-specific temporary backup), STO-91 (its retention duration — OPEN), STO-84/88 mechanism, STO-85.
**ARCHITECTURE APPROVED (owner, 5 Nov 2026): STO-70, 72, 73, 74, 75, 77, 78, 80, 81, 82, 87, 88 (and STO-92 earlier) — architecture only. The S2 gate remains CLOSED: no implementation authorisation exists; the owner's separate written implementation authorisation is still required.**
**S2 gate finalisation:** the *list* of required decisions is now final (STO-70, 72, 73, 74, 75, 77, 78, 80, 81, 82, 87, 88 and STO-92 are **owner architecture-approved (5 Nov 2026)**; STO-79, 83, 85, 86 must be answered or consciously left open under the conditions of the approval sheet §F). The gate **remains CLOSED** until the owner approves them and separately authorises implementation.
**Smallest safe S2 scope:** results record + extensible entry schema (+ reserved, preserved, never-written `deletions` field) + layout 2 + migration R0–R4 + compat mode + **no automatic deletion** + composite snapshots **without** history (`omitted:['history']`) + results writes that ignore replace mode and the core-epoch guard (design §11 N2–N3) + core-only restore keeping current preferences/tutor (STO-92) + disabling automatic pruning in `recordResult` and `mergeActivity` + **the updated reset confirmation wording (ru/ky/de, reviewed)**; history deletion and its tests, capture (S2b), history UI, export and the retention policy are **out**. Deletion tests are **not** S2 exit criteria.


**Required (in addition to S1 closed):** STO-14 (quota thresholds, since the buffer is the largest record), STO-15 (retention values/compaction — OPEN, owner-dependent), STO-16 (crash-safe pruning, no double count).
**Evidence:** crash injected between the results write and the summaries/watermark write converges to the clean-run result; totals identical after pruning; results record ≤ the approved budget at the heavy profile.
**Do not start S2 if** STO-16 is not approved: moving the buffer without it creates a double-counting window that the current single-record write does not have.

## 3. Stage S3 — global record, bundle, stale-shell rule

**Required (in addition to S2 closed):** STO-03 (global record), STO-08 (bundle format/classes/verification), STO-09 (snapshot composition — OPEN), STO-10 (drift re-baseline on replacement), STO-12 (legacy invariant).
**Evidence:** bundle tamper tests; classes retain independently; pristine copy pinned; reset/start-fresh/restore each followed by a stale `v1` write is not merged; `bilup-deutsch:v1` bytes unchanged in every journey; core contains neither `activeDates` nor `studySeconds`.
**Advisory:** STO-28 (whether the streak survives a course reset) should be answered here because it fixes what the global record is for.

## 4. Stage S4 — export, import, reset, undo, pruning offer

**Required (in addition to S3 closed):**

| Block | Decisions | State to resolve first |
|---|---|---|
| Export | STO-20, 21, 22, 23, 24 | **STO-21 (achievements) and STO-22 (name) are OPEN** |
| Import | STO-25, 26, 35 | **STO-26 (strictness) OPEN** |
| Reset | STO-27, 28, 29, 30 | **STO-28, 29, 30 OPEN** |
| Undo | STO-32, 33 (and STO-14) | **STO-33 OPEN** |
| Erase everything | STO-31 | **OPEN; may be removed from S4 by deciding not to offer it** |
| Prune offer | STO-34 | wording and "shown once" rule |

**Hard blockers (cannot be defaulted):** STO-21, STO-28, STO-29, STO-31 (or an explicit "not in P1"), STO-33.
**Evidence:** export → reset → import round trip; key-diff test equals the declared erase list; other course untouched; undo restores identical bytes for included records; invalid files write nothing; crash matrix per operation; fake-clock expiry including a backwards clock; destructive-operation race (lock path and epoch-CAS path).
**Do not ship** any destructive control (reset, import, erase) before its undo snapshot is verified and its dialog lists what is kept and erased in all three languages.

## 5. Stage S5 — assisted attempts and XP policy

**Required:** STO-40, STO-41, STO-42 (factor — OPEN), STO-43 (consistency rule — OPEN), STO-44 (repeat detection — OPEN).
**Evidence:** hint tap never reaches the answer path; assisted items add 0 to `earned`; factor read from policy (no literal); written sequence rule (assisted then unassisted) with one test per sentence; old results without `assist` still load.
**Independent of S1–S4**: touches `SpeakingLab`, `SpeakInput`, `policy.ts` and the result items only. If the owner wants the policy mechanism but not a behaviour change, S5 may ship with the factor at its current value 1 — decided under STO-42.

## 6. Stage S6 — Playwright and browser validation

**Required:** STO-50 (dependency/CI approval), STO-51 (devices and owner — OPEN), STO-52 (measurement schedule), STO-53 (stale-deployment fixtures).
**Evidence:** measurement report M1–M9; manual iOS/Android checklist recorded; CI job green.
**Sequencing:** M1/M4 should be available before STO-02 numbers and STO-14 thresholds are frozen; STO-14 therefore also depends (softly) on S6 starting early.

## 7. Cross-stage blockers summary

| Decision | State | Blocks |
|---|---|---|
| STO-13 | **CONFIRMED** (owner statement, 5 Nov 2026) | nothing — no longer a blocker |
| STO-17, STO-18 | PROPOSED | S1 |
| STO-15 | OPEN | S2 |
| STO-09 | OPEN | S3 |
| STO-21, 28, 29, 30, 31, 33, 22, 26 | OPEN | S4 |
| STO-42, 43, 44 | OPEN | S5 |
| STO-51 | OPEN | S6 |
| STO-14 | OPEN | S2, S4 |

## 8. Contradiction resolutions the gate relies on

Verified against the code and recorded in register §0.3: achievements are computed (no persisted field); streak and study time live in the course record; legacy `v1` is never written or deleted by current code; reset/start-fresh disable drift, import/restore are unspecified (STO-10); pruning is atomic today and becomes a two-record window after S2 (STO-16); undo retention exists only as "2 newest + pinned" today (STO-32/33); tutor export and reset are undefined (STO-23/29); hint chips **currently submit** the hint as the answer (STO-40); assisted mechanism exists but no screen sets it and the shipped factor is 1 (STO-42/43).

## 9. Smallest safe implementation scope

**S1 alone**, after owner approval of its nine remaining decisions and the sub-approvals listed above: move preferences and the tutor transcript into their own records, keep schema 2 with a layout marker and epoch-stamped slices, core first, no behaviour change, no new user-facing feature. It is the only stage that needs no answer to an open product question (STO-13 is now confirmed) and no new dependency. Everything else waits on its own gate.
