# BilUp Til 2.0 — Storage S2: Final Architecture Approval Review (12 decisions)

**Date:** 5 November 2026 · **Review only — documentation.** It approves nothing, ticks nothing and authorises no implementation. The approval decision is the owner's.
**Categories:** [REQUIREMENT] STO-13, 71, 76, 84, 90 · [ARCH-APPROVED] STO-92 only · [CONFIRMED/ACCEPTED scope decisions, not approvals] STO-93…STO-100 and the conditions on STO-74/77/82 · [PROPOSED] the 12 decisions below · [IMPL-AUTH] none.

## 1. What the owner is being asked to approve (as amended by the owner's decisions)

| ID | Decision | Approval covers (final scope) | Owner conditions attached | Depends on |
|---|---|---|---|---|
| STO-70 | Dedicated results record | `bilup-deutsch:results:de-general`, self-describing, `epoch` informational, behind one narrow interface; in-memory shape unchanged | STO-90 exemptions | STO-71 ✓, 72, 75, 78 |
| STO-72 | What stays in the core | ledger/XP, tombstones, summaries, completions, mastery, reserved watermark | STO-98 (tombstones sole duplicate authority) | STO-70 |
| STO-73 | Layout 2; old builds read-only; rollback = explicit restore | `LAYOUT = 2`, `schemaVersion` stays 2 | STO-90 (rollback preserves Results), STO-92 | STO-04 (done) |
| STO-74 | Watermark/ordering — **reserved/inactive in S2** | additions-before-core ordering; optional `prunedThrough` validated/preserved/never written with a value; no pruning/folding/removal | scope restriction (§13.9) | STO-70 |
| STO-75 | Absent/damaged/newer-version results | empty buffer, exact bytes quarantined, notice; newer version ⇒ `history-readonly`; never "stale" by core epoch | STO-96, STO-100 | STO-70 |
| STO-77 | Cross-tab merge — **reserved/inactive watermark part** | union by `resultId`; `deletions` markers by max (never written); existing summary behaviour unchanged, no new folding | scope restriction (§13.9) | STO-74 |
| STO-78 | S1→S2 migration and compat mode | R0–R4, exact-bytes pinned R1, merge-write R2, verify then `layout 2` last | STO-82 conditions, STO-90 | STO-70, 73 |
| STO-80 | Failed history write never blocks credit | results/core outcome table (design §12), pending queue, notices | STO-93…STO-99, STO-100 | STO-96, 97, 98 |
| STO-81 | Write-isolation acceptance | relative isolation, no frozen numbers; replacement ops write zero results | — | STO-79 (open) |
| STO-82 | Entry model; capture staged to S2b | attempt-level fields of design §13.8; **S2 captures no new free-text data** | unknown optional fields survive; nothing invented; compat tests; free-text guard | STO-70 |
| STO-87 | Never delete history automatically | no fold/prune/quota/stale-epoch/rotation/migration removal | STO-71, STO-90 | STO-14 |
| STO-88 | Reserved `deletions` field only | optional, validated, preserved, merged by max, never written; no deletion operation | §13.9 | STO-84 ✓ |

Dependency order for approval: **70 → 72, 75, 73 → 78 → 74 → 77 → 82 → 80, 81, 87, 88.** STO-92 (approved) and STO-93…100 (accepted/confirmed) are inputs, not part of the 12.

## 2. Contradictions and gaps found in the current documents (to resolve before approval)

| # | Finding | Where | Severity | Proposed correction (documentation only — **not applied**) |
|---|---|---|---|---|
| C1 | STO-74 "Recommended default" still reads "Yes — rules 1–3 and the ordering table; merge takes the higher watermark…", contradicting "reserved/inactive in S2" | register STO-74; sheet STO-74 | **HIGH (wording)** | Replace by: "Yes — additions-before-core ordering is implemented; the watermark and removal-after-core ordering are **reserved/inactive in S2** (optional `prunedThrough`: validated, preserved, never written with a value; no code path reads it)." |
| C2 | STO-77 default says "`prunedThrough` = max; summaries from the higher-watermark side; **raw entries at or below the watermark dropped**" — a removal rule, forbidden in S2 | register STO-77; design §3.5 | **HIGH (wording)** | Replace by: "Union of results by `resultId`; `deletions`/`prunedThrough` merged by max but **inactive** in S2; existing summaries keep their per-field-max merge; nothing is dropped." |
| C3 | STO-82 default lists per-entry `courseId, completes, lang` and items with `given, expected, promptSnap…`/free text, while the accepted S2 header (§13.8) stores none of them and the owner's guard forbids new free text in S2 | register STO-82 | **MEDIUM (wording)** | Replace by the §13.8 table; move `lang`, `contentRef`, item detail and free text explicitly to **S2b** |
| C4 | **Tombstone expiry vs "disable pruneActivity":** `pruneActivity` does two things — folds results and expires tombstones (400 days). Disabling it wholesale would let tombstones grow unbounded; keeping it would be "pruning" in the owner's words. `creditStatus` (STO-99) assumes the 400-day window exists. | design §11 N5, §13.9; engine `pruneActivity` | **MEDIUM (design ambiguity)** | Decide: **disable only the folding of results; keep tombstone expiry (≥ 400 days) unchanged** (tombstones are reward-idempotency data, not history). State it in STO-74/77/87 and design N5. |
| C5 | **Compat mode × STO-90:** when migration cannot complete (backup/quota failure) the session runs in layout-1 compat mode, where history is **inside the core record**. A Reset, Start Fresh, Core Restore or Rollback in that mode would empty or replace the embedded history — exactly what STO-90 forbids. | migration §4 vs design §10–§11 | **HIGH (design gap)** | Rule: **while in compat mode, replacement operations (reset, start fresh, core restore, rollback) are refused with a visible message ("storage must be repaired first") until the upgrade completes**; alternatively the operation first completes R1–R3. Add to STO-78 and STO-90 tests. |
| C6 | STO-72 still says "the new prune watermark in the core" as if active | register STO-72 | LOW (wording) | "reserved (inactive) prune watermark" |
| C7 | Test strategy §2 rows 4–5 and mutations M-S2-6…9, M-S2-14, and exit criteria §5 ("all matrix rows green") include prune/watermark tests that cannot pass because S2 never prunes | test strategy §2, §3, §5 | **MEDIUM** | Mark them **deferred (future deletion stage)** and replace by the S2 tests "nothing is folded/removed; watermark never written" (§12) |
| C8 | Sheet lists STO-83/85 as open product/technical decisions "required before S2"; the owner has now deferred them to S2b under the free-text guard | sheet §C/§D, gate | LOW (resolved by this update; the sheet/gate were updated) | none further |

None of C1–C8 changes an owner decision; C1–C3, C6, C7 are wording; **C4 and C5 need an owner decision** (recommended resolutions above).

## 3. Risks carried into implementation

| Risk | Class |
|---|---|
| R3: unsaved work lost when storage stays unavailable and the session ends (STO-93: persistent notice, warning, retry, best-effort flush, **no durability claim**) | **ACCEPTED** |
| Residual cross-tab race (S1) and pre-S1 development builds (STO-13) | **ACCEPTED** |
| **S2 changes S1-verified behaviour in eight places** — regression risk, each needs tests: (1) core-only restore keeps prefs/tutor (STO-92); (2) duplicate check on tombstones only (STO-98); (3) flush condition (STO-97); (4) notice dismissal model (STO-94/100); (5) `pruneActivity` folding disabled (STO-74/87); (6) `rollbackToLegacy` leaves the results key; (7) results writes ignore replace mode / core-epoch guard (STO-90); (8) reset confirmation wording ru/ky/de (STO-90) | **MEDIUM** |
| Kyrgyz notice/dialog texts (STO-95, reset wording, S1 notices) need native review before release | **MEDIUM (release condition)** |
| Browser behaviour unmeasured (capacity, latency, two-context races); STO-79/86 open — S2 proceeds only with the localStorage record behind one interface, no retention policy, no frozen budget | **MEDIUM (accepted by sheet §F)** |
| Unknown optional entry fields must survive sanitisation (today's sanitizers drop unknown keys) | **MEDIUM** (STO-82 condition) |
| Pending queue is session-memory only and uncapped (STO-96) | **ACCEPTED** (documented) |

## 4. S2 scope the approval would cover
**In:** results record + extensible entry schema + reserved `deletions`/`prunedThrough` (inactive) + `layout 2` + migration R0–R4 + compat mode (with C5 rule) + composite snapshots without history + results writes independent of replace mode/core epoch + core-only restore keeping prefs/tutor + results folding disabled + stale-epoch conflict notice + pending queue/notices + flush extension + tombstone-only duplicate check + `creditStatus` + updated reset wording (ru/ky/de, reviewed) + the tests of the strategy.
**Out:** S2b capture (answers, prompts, expected answers, feedback, explanation language, writing/speaking text, STO-83/85), history UI, export/import, retention policy, IndexedDB, history deletion (STO-84/88 mechanism, STO-89, STO-91), achievements persistence, S3–S6.

## 5. Readiness for the owner's approval request
* **Ready to approve as written:** STO-70, 73, 75, 80, 81, 87, 88.
* **Ready once the wording corrections are accepted:** STO-72 (C6), STO-74 (C1, C4), STO-77 (C2, C4), STO-82 (C3).
* **Ready once the owner decides a design point:** STO-78 (C5 — compat-mode rule); STO-74/77/87 (C4 — tombstone expiry kept).
* **Recommended approval request to the owner:** approve the 12 decisions **with corrections C1–C7 applied as proposed and the two decisions C4, C5 resolved as recommended**.
* **Not given by this review:** architecture approval and implementation authorisation.

## 6. Resolution record (owner decisions of 5 Nov 2026 — corrections applied, nothing approved)
| # | Status |
|---|---|
| C1 STO-74 default | **Applied** (register STO-74, sheet STO-74) |
| C2 STO-77 default | **Applied** (register STO-77, design §3.5, sheet STO-77) |
| C3 STO-82 default | **Applied** (register STO-82: §13.8 fields; S2b items moved out) |
| C4 tombstone expiry vs folding | **Owner ACCEPTED WITH CONDITIONS** — folding disabled, expiry unchanged (design §13.12; register STO-74/77/87; migration §15; test §14) |
| C5 compat mode × STO-90 | **Owner ACCEPTED WITH CONDITIONS** — operations refused completely until the upgrade succeeds (design §13.13; register STO-78/90; migration §15; test §14) |
| C6 STO-72 wording | **Applied** (register, sheet) |
| C7 test strategy exit criteria | **Applied** (§2 rows 4–5 and M-S2-6/7/8/14 deferred; §5 updated; replaced by §12–§14 tests) |
| C8 sheet/gate for STO-83/85 | **Applied earlier** (deferred to S2b under the free-text guard) |
The 12 architecture decisions remain **PROPOSED** (boxes unticked); no implementation authorisation exists.

## 7. Owner architecture approval (5 Nov 2026)
STO-70, 72, 73, 74, 75, 77, 78, 80, 81, 82, 87 and 88 are **owner architecture-approved**; STO-92 earlier. Implementation is **not** authorised; the gate remains **CLOSED**. (§6 above recorded the state before this approval.)
