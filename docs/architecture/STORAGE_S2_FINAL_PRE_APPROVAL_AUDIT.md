# BilUp Til 2.0 — Storage S2: Final Pre-Approval Audit

**Date:** 5 November 2026 · **Type:** independent architecture audit — **documentation only**. Nothing is approved by this document; no checkbox or decision status was changed; no source, test, dependency, configuration, storage format or migration logic was touched; nothing is committed. **The final decision belongs to the owner.**
**Baseline:** git status recorded before the audit (46 lines: 25 tracked modified files, 21 untracked entries — all pre-existing work: P0/P0b/P1/S1 implementation, tests and documents). The only changes made by this audit are the new file you are reading and two one-line documentation corrections listed in §7.
**Read in full for this audit:** the approval sheet, the register, the gate, the S2 design (incl. §11, §12), migration plan and test strategy, the S1 design/implementation/deviation reports, `ARCHITECTURE_CHANGELOG.md`, `FINAL_ARCHITECTURE_REVIEW.md`, and the current source where a claim had to be verified (`src/app/store.tsx`, `src/app/StorageNotice.tsx`, `src/storage/{persistence,activity,merge}.ts`, `src/progress/engine.ts`).

---

## 1. Executive summary

* The sheet contains **exactly 18 unticked architecture decisions** (recovered from the actual file; the earlier chat list was truncated): **STO-70, 72, 73, 74, 75, 77, 78, 80, 81, 82, 87, 88, 89, 85, 91, 83, 79, 86.** Only **12** of them (70, 72, 73, 74, 75, 77, 78, 80, 81, 82, 87, 88) are the ones the owner intends to approve for S2; **6 are not S2 approvals**: STO-89 and STO-91 (future deletion stage), STO-85 and STO-83 (open decisions), STO-79 and STO-86 (blocked by browser measurements). Six owner decisions are already ticked: STO-13, 71, 76, 84, 90 (extended to Rollback), 92 (approved).
* **Result: 8 of the 12 S2 decisions are ready to approve as written (STO-70, 72, 73, 75, 78, 81, 87, 88); 4 need a clarification first (STO-74, 77, 80, 82).** None of the 6 non-S2 decisions should be approved now.
* **The verification of the Results/Core write combinations holds for the central guarantees:** no combination awards XP without a Core ledger write, no combination duplicates XP on retry, no stale tab can overwrite newer history. **But the audit found gaps that the current documents do not close** (details in §3–§5): the existing storage notice can be **dismissed and then hides every later failure** (HIGH, affects scope additions 1 and 2); the pagehide flush as implemented **returns early unless study seconds accrued**, so it would not drain a pending queue (HIGH); the history label "XP not part of current progress" derived from tombstones is **wrong for entries older than the 400-day tombstone window** (MEDIUM); the pending queue has **no bound and no behaviour for a newer-version results record** (MEDIUM). Each has a small documentation-level remedy listed in §8.
* **Residual risk the owner must accept (cannot be designed away):** if the session ends while storage keeps failing, pending history entries and unsaved XP are lost permanently (announced by a notice, never silent while the app runs).
* **Final statement: S2 is NOT yet ready for implementation authorisation.** It becomes ready when the owner (1) approves the 12 S2 decisions after the four clarifications, (2) explicitly accepts the five scope additions with the corrections of §4, (3) accepts the residual risks of §5, and (4) gives a separate written implementation authorisation. STO-79/STO-86 may stay OPEN only under the conditions of sheet §F.

---

## 2. The 18 pending architecture decisions (complete list, from the register)

### 1. STO-70 — Raw results live in a dedicated, independently versioned record (Option A)
* **Register state:** PROPOSED
* **Proposed architecture (recommended default):** Yes: `bilup-deutsch:results:de-general`, `{record:"results", v:1, epoch, updatedAt, results[]}`, same pattern as the S1 slices; a fourth group in merge/compose.
* **Why this decision is necessary:** Raw attempt history is now product data (STO-71) and must not share a failure domain, snapshot size or write path with progress.
* **Alternatives considered:** B append-only segmented log (lower bytes per result, much more machinery, unmeasured benefit); C no raw persistence (STO-71); keep in the core.
* **Consequences and trade-offs:** Course record shrinks by ≈ 78–84 % at the heavy profile (historical synthetic figure); corrupt/oversized results no longer endanger the core; bytes written per result are about unchanged. *Risks:* More cross-key windows (handled by STO-74); regressions in verified paths.
* **Dependencies:** STO-72, 74, 75, 78; S1 complete.
* **Amendments recorded:** **Amended 5 Nov 2026 (documentation consistency review):** The `epoch` field of the results record is **informational**; STO-90 exemptions apply (design §11 N1–N3). Earlier "same epoch rules as S1" wording is superseded.
    - **Amended 5 Nov 2026 (STO-71 confirmed):** Option A remains the container, now as the learner's **history store** (not a bounded audit buffer); the storage tier (localStorage record vs IndexedDB) becomes a measured decision (STO-86); no segmented log without measured need.
* **Document references:** Design §3.1, §7.3, §11; register STO-70; sheet §B
* **Ready for owner approval:** Yes
* **Unresolved questions / risks:** Entry/record sizes unmeasured (STO-79/86); epoch field informational only (STO-90).
* **Exact question (register):** Should the bounded raw-results buffer move out of the course record into its own epoch-stamped record, with the in-memory shape unchanged?
* **Acceptance criteria:** Core record contains no raw results; all 12 invariants of the design hold; existing XP/mastery suites unchanged.
* **Final recommendation:** **RECOMMEND APPROVE**

### 2. STO-72 — What stays in the course record
* **Register state:** PROPOSED
* **Proposed architecture (recommended default):** Tombstones (idempotency), per-day summaries, completions, credit ledger/XP, and the new prune watermark `prunedThrough`.
* **Why this decision is necessary:** Guarantees that losing or deleting the results record can never change rewards, mastery or completion (STO-84/STO-90).
* **Alternatives considered:** Move tombstones with the raw results (smaller core, but replay protection would depend on a droppable record — rejected).
* **Consequences and trade-offs:** Core keeps ≈ the non-buffer 16–22 % plus tombstones/summaries (historical figures: tombstones ≈ 35 KB, summaries small). *Risks:* Core still grows with tombstones (400-day retention, STO-15).
* **Dependencies:** STO-70.
* **Amendments recorded:** none
* **Document references:** Design §3.1, §8.1; register STO-72
* **Ready for owner approval:** Yes
* **Unresolved questions / risks:** Tombstones expire after 400 days (see risk R2: history labels must not rely on tombstones beyond that).
* **Exact question (register):** Which parts of the activity state must remain in the core so that losing the results record can never change rewards?
* **Acceptance criteria:** Results record deleted/damaged ⇒ ledger, XP, completions byte-identical; replay still a no-op.
* **Final recommendation:** **RECOMMEND APPROVE**

### 3. STO-73 — Layout marker 2, old builds read-only, rollback is an explicit restore
* **Register state:** PROPOSED
* **Proposed architecture (recommended default):** Yes. `schemaVersion` stays 2; `LAYOUT = 2`; builds with a smaller `LAYOUT` are read-only and write nothing.
* **Why this decision is necessary:** Defines how old builds behave on the new layout and why rollback is an explicit restore, not a downgrade.
* **Alternatives considered:** `schemaVersion` 3; dual-write window; keep `layout` 1 with an extra field (older builds would silently drop it — rejected).
* **Consequences and trade-offs:** An S1 build/tab cannot save after the upgrade; rollback loses data recorded after the upgrade unless the learner/operator accepts that. *Risks:* Learners on an old cached shell see the "newer version" notice (development profiles only, STO-13).
* **Dependencies:** STO-04 (approved, implemented).
* **Amendments recorded:** none
* **Document references:** Design §3.8, §11 N4; migration §5, §13; register STO-73
* **Ready for owner approval:** Yes
* **Unresolved questions / risks:** Pre-S1 monolith builds (development only) can still rewrite a monolith — accepted by STO-13.
* **Exact question (register):** Is bumping `layout` to 2 (S1 builds go read-only) the version mechanism, and is rollback an explicit restore of the pinned pre-S2 backup rather than an automatic downgrade?
* **Acceptance criteria:** Old-build read-only test with zero writes; documented rollback dialog text.
* **Final recommendation:** **RECOMMEND APPROVE**

### 4. STO-74 — Crash-safe pruning: watermark + direction-based write ordering
* **Register state:** PROPOSED
* **Proposed architecture (recommended default):** Yes — rules 1–3 and the ordering table of the design §3.3; merge takes the higher watermark and may undercount statistics but never overcount.
* **Why this decision is necessary:** The only crash-safe mechanism the design has for ANY future deletion of history (owner requires no automatic deletion).
* **Alternatives considered:** Keep an id set of summarised results (unbounded); keep results and summaries in one record (defeats S2); accept the latent double count.
* **Consequences and trade-offs:** Fixes the existing latent double count in summaries; no XP effect. *Risks:* A bug here silently corrupts statistics (not rewards); tie to order key requires stable `(finishedAt, resultId)` ordering.
* **Dependencies:** STO-15, STO-16, STO-70.
* **Amendments recorded:** **Amended 5 Nov 2026 (STO-71 confirmed):** The watermark/ordering mechanism is kept **only for approved deletion** (user-initiated or policy). **No automatic pruning**; the 500/90-day rule is not applied automatically.
* **Document references:** Design §3.3 (banner), §7.3, §8.2, §11 N5; register STO-74 (amended)
* **Ready for owner approval:** Not fully
* **Unresolved questions / risks:** AMBIGUITY: with no automatic pruning and no deletion in S2, does S2 reserve `prunedThrough` (optional, preserved, never written) or defer it entirely? The write-ordering table (additions before core) applies to S2; removals-after-core applies only to a future stage.
* **Exact question (register):** May pruning use a single watermark `prunedThrough` (order key of the newest folded result) and write additions before the core, removals after it? (Supersedes the detail of STO-16.)
* **Acceptance criteria:** Crash between prune writes never folds twice nor loses both copies; two-tab prune never exceeds single-tab totals.
* **Final recommendation:** **NEEDS CLARIFICATION**

### 5. STO-75 — Results record absent, damaged or from a newer version (never "stale" by core epoch — STO-90)
* **Register state:** PROPOSED
* **Proposed architecture (recommended default):** Empty buffer in memory, exact bytes quarantined first, low-priority notice, core untouched; a newer-version record is never rewritten. Engine effects only under-credit (repeat daily-cap), never over-credit.
* **Why this decision is necessary:** Corrupt/missing/newer history must never break progress and must never be silently replaced.
* **Alternatives considered:** Treat as core damage (recovery screen); block recording.
* **Consequences and trade-offs:** Learning continues; the repeat-credit rule may grant less for one session. *Risks:* Learner sees a notice for data nobody reads in the UI.
* **Dependencies:** STO-70, S1 slice rules.
* **Amendments recorded:** **Amended 5 Nov 2026 (documentation consistency review):** A results record is **never** stale or anomalous because of the core epoch; only absent, damaged or newer-version records are special (design §11 N1).
* **Document references:** Design §3.2, §11 N1; register STO-75 (amended); test strategy §2 row 6
* **Ready for owner approval:** Yes
* **Unresolved questions / risks:** A newer-version results record means entries cannot be persisted this session (pending queue, risk R4).
* **Exact question (register):** What does the app do when the results record cannot be used?
* **Acceptance criteria:** Corruption matrix passes; core bytes identical.
* **Final recommendation:** **RECOMMEND APPROVE**

### 6. STO-77 — Cross-tab merge rule for results and summaries
* **Register state:** PROPOSED
* **Proposed architecture (recommended default):** Union of raw results by `resultId`; `prunedThrough` = max; summaries from the side with the higher watermark (ties: per-field max); raw entries at or below the watermark dropped. Direction of error: undercount, never overcount.
* **Why this decision is necessary:** Two tabs must converge without duplicating or removing history.
* **Alternatives considered:** Per-field max with no watermark (current, overcounts); last-writer-wins.
* **Consequences and trade-offs:** Statistics may be slightly low after concurrent pruning. *Risks:* Visible only in per-day statistics.
* **Dependencies:** STO-74, STO-11.
* **Amendments recorded:** none
* **Document references:** Design §3.5, §11 N2; register STO-77
* **Ready for owner approval:** Not fully
* **Unresolved questions / risks:** The summaries/watermark clause is inactive in S2 (no pruning); only "union by resultId; markers by max" is operative. The text should say so.
* **Exact question (register):** How are the results and summaries of two tabs reconciled?
* **Acceptance criteria:** Property tests (idempotent/commutative/associative on the raw union; summaries never above single-writer totals).
* **Final recommendation:** **NEEDS CLARIFICATION**

### 7. STO-78 — S1 → S2 migration procedure and compat mode
* **Register state:** PROPOSED
* **Proposed architecture (recommended default):** Yes — see the migration plan; completion is claimed only by the final marker.
* **Why this decision is necessary:** Existing S1 profiles must reach layout 2 without losing history, progress, preferences or tutor.
* **Alternatives considered:** Migrate lazily on first result; drop old results instead of migrating (destructive).
* **Consequences and trade-offs:** One extra backup (≈ the S1 core size) is pinned until S3 defines its lifecycle. *Risks:* Quota during the upgrade (≈ 2× transient); an unmeasured browser capacity.
* **Dependencies:** STO-70, 73, 14.
* **Amendments recorded:** **Amended 5 Nov 2026 (documentation consistency review):** R2 stamps the epoch informationally; rollback/restore rules are design §11 N4 / migration §13 (R1 = core-only copy: restore Core only, preserve current preferences and tutor, merge R1 history, never lose Results).
* **Document references:** Migration plan §1–§4, §9–§13; design §11 N4; register STO-78 (amended)
* **Ready for owner approval:** Yes
* **Unresolved questions / risks:** Transient quota ≈ 2× unmeasured; entries migrated as capture:"basic"; which dropped header fields (startedAt, levelId…) S2 begins storing is not stated (see STO-82).
* **Exact question (register):** Is the procedure R0–R4 (exact-bytes pinned backup, merge-write the results record, verify, then rewrite the core with `layout: 2` last; compat mode on failure) acceptable?
* **Acceptance criteria:** Crash/quota/lying-write matrix converges; ledger/progress byte-equal; rerun changes nothing.
* **Final recommendation:** **RECOMMEND APPROVE**

### 8. STO-80 — Failure to append a raw result never blocks the credit
* **Register state:** PROPOSED
* **Proposed architecture (recommended default):** Yes — credit/tombstone/completion are saved; the raw entry for that result is lost, a low-priority notice is shown, and the next save retries. If the core cannot be written nothing is credited (unchanged).
* **Why this decision is necessary:** Defines what happens when history and credit are written as two records and one of them fails.
* **Alternatives considered:** Refuse to credit when raw cannot be stored.
* **Consequences and trade-offs:** Learning is never blocked by an audit buffer. *Risks:* One missing audit entry (surfaced, not silent).
* **Dependencies:** STO-70, STO-74.
* **Amendments recorded:** **Amended 5 Nov 2026 (documentation consistency review):** Results/Core outcome table (design §11 N3): XP is governed only by Core; a stale-core tab still appends its attempt to Results; a failed results write keeps the entry pending and retried.
    - **Amended 5 Nov 2026 (STO-71 confirmed):** A history entry that cannot be written is **kept in memory and retried**, with a visible notice; older history is never deleted to make room. XP/credit are still saved.
* **Document references:** Design §3.4, §11 N3, §12; register STO-80 (amended); test strategy §11
* **Ready for owner approval:** Not yet
* **Unresolved questions / risks:** Depends on the owner accepting the five scope additions and the residual risk (pending entries lost if the session ends while storage keeps failing); notice-dismissal gap (R1); queue bound (R4); flush gating (R13).
* **Exact question (register):** If the results record cannot be written but the core can, is the result still credited?
* **Acceptance criteria:** Quota-injection test: results write fails ⇒ XP saved, notice shown, no duplicate on retry.
* **Final recommendation:** **NEEDS CLARIFICATION**

### 9. STO-81 — Write-isolation acceptance for S2
* **Register state:** PROPOSED
* **Proposed architecture (recommended default):** Yes: a recorded result writes only the results record and the course record (order per STO-74); preference/tutor changes write only their own key; the course record contains no raw results; nothing writes `v1`.
* **Why this decision is necessary:** Gives S2 a testable acceptance criterion without frozen byte budgets.
* **Alternatives considered:** Absolute byte budgets (unsupported until measured).
* **Consequences and trade-offs:** Testable without browser data. *Risks:* None beyond deferring numbers.
* **Dependencies:** STO-79.
* **Amendments recorded:** none
* **Document references:** Design §3 / register STO-81; test strategy §2
* **Ready for owner approval:** Yes
* **Unresolved questions / risks:** None.
* **Exact question (register):** Is the S2 acceptance requirement relative write isolation again (no frozen numbers)?
* **Acceptance criteria:** Recording-store assertions per action.
* **Final recommendation:** **RECOMMEND APPROVE**

### 10. STO-82 — Attempt-history entry model and capture staging
* **Register state:** PROPOSED
* **Proposed architecture (recommended default):** Versioned entries (`entrySchema`, `capture: basic|full`); header fields incl. the currently dropped `startedAt, levelId, courseId, evidence, completes` plus `lang`; items with compact `given, expected, promptSnap, concept, errorClass`; bounded free-text for writing/speaking; legacy entries stay `basic`. S2 = record + schema; **S2b = capture in features (separate approval)**; history UI later.
* **Why this decision is necessary:** History is useless without a versioned entry schema that can grow (S2b capture).
* **Alternatives considered:** Store only what exists today (no answers); capture and storage in one stage; store full exercise copies.
* **Consequences and trade-offs:** Without S2b the history cannot show answers/feedback; S2b touches every learning screen. *Risks:* Capture changes can regress learning flows; scope creep.
* **Dependencies:** STO-70, STO-83, STO-85.
* **Amendments recorded:** **Amended 5 Nov 2026 (documentation consistency review):** No "credited" flag is added to entries: whether an attempt's XP is part of the current progress is **derived from the Core tombstones** (design §11 N3).
* **Document references:** Design §7.2, §7.4, §7.7; migration §9; register STO-82 (amended)
* **Ready for owner approval:** Not fully
* **Unresolved questions / risks:** S2 must state exactly which header fields it stores (currently dropped: startedAt, levelId, courseId, evidence, completes) and the length caps; capture is S2b.
* **Exact question (register):** Which fields does a stored attempt contain, and is capture implemented as a separate stage (S2b) after the storage stage (S2)?
* **Acceptance criteria:** Field table approved; legacy entries never fabricated; fixtures per kind (test strategy §6).
* **Final recommendation:** **NEEDS CLARIFICATION**

### 11. STO-87 — Quota behaviour: never delete history automatically
* **Register state:** PROPOSED
* **Proposed architecture (recommended default):** History is never deleted to make room; the entry stays in memory for the session and is retried; a visible notice explains and (later, S4) offers export/delete; XP/credit still saved (STO-80); the earlier "prune earlier under quota" clause is withdrawn.
* **Why this decision is necessary:** Owner requirement: no automatic deletion of history, including under quota pressure.
* **Alternatives considered:** Automatic early pruning into summaries (silent data loss — rejected by the owner requirement).
* **Consequences and trade-offs:** A full device stops recording history until the learner acts. *Risks:* History gaps while storage is full (surfaced).
* **Dependencies:** STO-14, STO-80, STO-84.
* **Amendments recorded:** none
* **Document references:** Design §3.6 (superseded), §7.3, §11 N5; register STO-87
* **Ready for owner approval:** Yes
* **Unresolved questions / risks:** Consequence: a full device stops recording history until the learner acts (surfaced).
* **Exact question (register):** What happens when history cannot be saved because storage is full?
* **Acceptance criteria:** Quota-injection tests prove no entry is removed and nothing is credited twice.
* **Final recommendation:** **RECOMMEND APPROVE**

### 12. STO-88 — History-deletion mechanism (scopes, marker, snapshot, no effect on progress)
* **Register state:** PROPOSED
* **Proposed architecture (recommended default):** Yes — design §8.2: one `setItem` (results key), marker `deletions{scope→throughKey}` merged by max, summaries and watermark untouched, snapshot required (ok:false ⇒ refuse), never triggered by quota.
* **Why this decision is necessary:** Reserves the format for the future deletion stage and fixes its invariants (STO-84) without implementing deletion.
* **Alternatives considered:** Delete by editing the whole core (no isolation); delete and also adjust summaries; per-attempt deletion only.
* **Consequences and trade-offs:** Progress is protected by construction, not convention; the daily-cap repeat rule may withhold (never add) credit after deletion; a safety snapshot retains deleted history for its retention period. *Risks:* Marker/clock edge cases; snapshot retention conflicts with the learner's intent to delete; pinned backups keep a copy.
* **Dependencies:** STO-70, 74, 76, 84, 85, 87, 17 (snapshot).
* **Amendments recorded:** **Amended 5 Nov 2026 (documentation consistency review):** Approving STO-88 **for S2** means approving only the reserved, preserved, never-written `deletions` field; the deletion operation and its tests are deferred (design §11 N6).
    - **Amended 5 Nov 2026 (STO-76 confirmed):** The "verified safety snapshot" clause is **replaced** by a history-specific temporary backup (STO-89): a composite snapshot does not contain history and must not be presented as protecting it. The deletion **operation** is recommended to be **outside S2** (S2 only reserves an optional, preserved, never-written `deletions` field); the mechanism itself (one write on the results record, scopes, marker, progress untouched) is unchanged.
* **Document references:** Design §8, §9.2, §11 N6; register STO-88 (amended); sheet §B
* **Ready for owner approval:** Yes (reserved `deletions` field only)
* **Unresolved questions / risks:** Approving it for S2 approves ONLY the optional, preserved, never-written `deletions` field.
* **Exact question (register):** Is history deletion implemented as an operation that receives and returns only the results record, with per-course/all scopes, a deletion marker inside the results record, a verified safety snapshot and an explicit confirmation — so XP, ledger, tombstones, mastery, completion and (computed) achievements cannot change?
* **Acceptance criteria:** Test strategy §7 green; core bytes identical; mutations killed.
* **Final recommendation:** **RECOMMEND APPROVE**

### 13. STO-89 — History-specific temporary backup (HB) for history deletion
* **Register state:** PROPOSED (applies to the later deletion stage, not S2)
* **Proposed architecture (recommended default):** Yes (Option A): `bilup-deutsch:history-backup:<course>:<ts>:<fp>`; not rotated with ordinary backups; confirmation discloses scope, counts, "progress not affected" and the retention period; explicit early purge needs a second confirmation.
* **Why this decision is necessary:** Safety copy for a future history deletion, because composite snapshots exclude history (STO-76).
* **Alternatives considered:** B no deletion until a recovery mechanism exists; C soft-delete "trash" inside the results record (same failure domain).
* **Consequences and trade-offs:** Deleted history stays recoverable for the approved period; a full device cannot free space by deleting (transient ≈ 2×). *Risks:* Quota; privacy (deleted data persists until expiry); a second key class to manage.
* **Dependencies:** STO-76, 84, 88, 91, 14, 87.
* **Amendments recorded:** none
* **Document references:** Design §9.2; register STO-89
* **Ready for owner approval:** Not required for S2
* **Unresolved questions / risks:** Depends on STO-91 (duration) and quota (≈ 2× transient).
* **Exact question (register):** Before deleting history, must the app write a separate, verified, exact-bytes backup of the scope being deleted, excluded from composite snapshots, and refuse the deletion if it cannot be written?
* **Acceptance criteria:** HB verified before deletion; deletion refused on HB failure; HB excluded from snapshots/rotation; crash matrix passes.
* **Final recommendation:** **NEEDS CLARIFICATION**

### 14. STO-85 — Privacy and data minimisation of attempt history
* **Register state:** OPEN
* **Proposed architecture (recommended default):** Opt-in or clearly disclosed default for free text; caps; excluded from composite snapshots only if STO-76 says so with a visible omission; export follows the optional-flag pattern.
* **Why this decision is necessary:** Free text (writing, speaking, typed answers) is personal data on the device.
* **Alternatives considered:** Store everything always; never store free text.
* **Consequences and trade-offs:** Personal data on the device in plaintext (as the tutor transcript today). *Risks:* Over-collection; learner surprise.
* **Dependencies:** STO-76, STO-82, 05 §10.
* **Amendments recorded:** **Amended 5 Nov 2026 (STO-76 confirmed):** Snapshots exclude history (STO-76), which removes one privacy copy; the pinned migration backup R1 and S1-era snapshots still contain pre-S2 history and must be disclosed.
* **Document references:** Design §7.5; register STO-85
* **Ready for owner approval:** No — product decision
* **Unresolved questions / risks:** Opt-in vs disclosed default; caps; snapshot/export inclusion.
* **Exact question (register):** Is free text (writing, speaking transcripts, typed answers) stored by default or only on opt-in, with which length caps, and is it included in snapshots/exports?
* **Acceptance criteria:** Behaviour and wording approved; tests per default.
* **Final recommendation:** **NEEDS CLARIFICATION**

### 15. STO-91 — Retention duration of the temporary history backup
* **Register state:** OPEN — product decision
* **Proposed architecture (recommended default):** No default proposed (keep OPEN); explicit early purge with a separate confirmation.
* **Why this decision is necessary:** A temporary backup must have an approved lifetime; silent expiry would delete history.
* **Alternatives considered:** Fixed number of days; until the next successful session; until the learner purges.
* **Consequences and trade-offs:** Longer retention = longer privacy exposure and quota use; shorter = less recoverability. *Risks:* Silent expiry would delete history — expiry must be visible and per the approved policy.
* **Dependencies:** STO-79, 85, 89.
* **Amendments recorded:** none
* **Document references:** Design §9.2; register STO-91
* **Ready for owner approval:** No — product decision, only before the deletion stage
* **Unresolved questions / risks:** Duration kept OPEN by the owner.
* **Exact question (register):** How long is the temporary history backup kept, and may the learner purge it earlier?
* **Acceptance criteria:** Approved duration + fake-clock expiry tests (never evaluated by timers).
* **Final recommendation:** **NEEDS CLARIFICATION**

### 16. STO-83 — Content versioning and stable references for history
* **Register state:** OPEN
* **Proposed architecture (recommended default):** Compact snapshots (given, expected, prompt, concept) + references with `lang` for long feedback; `contentRef.version` once P2 manifests exist; no whole-exercise copies. **Finding:** authored exercise ids `ex###` come from a module-level counter and re-number when content is inserted/reordered, so references alone are unsafe until stable ids exist (also a risk for ledger keys, see SD-08/STO-60).
* **Why this decision is necessary:** Authored exercise ids (`ex###`) renumber when content changes, so references alone can point to a different exercise.
* **Alternatives considered:** Snapshot everything (large); references only (breaks on change); freeze content.
* **Consequences and trade-offs:** Decides entry size and whether stable-id work (P2) must precede history capture. *Risks:* History showing a different answer than the learner saw.
* **Dependencies:** STO-60, STO-82, P2 manifests.
* **Amendments recorded:** none
* **Document references:** Design §7.2–§7.4; register STO-83
* **Ready for owner approval:** No — technical decision
* **Unresolved questions / risks:** Snapshot vs reference vs both; relation to P2 stable ids (STO-60).
* **Exact question (register):** How do historical attempts stay interpretable when content changes: snapshot, versioned reference, or both?
* **Acceptance criteria:** Change/removal/renumbering/translation fixtures (test strategy §6).
* **Final recommendation:** **NEEDS CLARIFICATION**

### 17. STO-79 — Retention values, compaction and numeric budgets stay unfrozen
* **Register state:** OPEN
* **Proposed architecture (recommended default):** Yes. Budgets are written only after S2-M1…M8 (and M1/M4 of the original set).
* **Why this decision is necessary:** Retention duration and size budgets cannot be set from estimates.
* **Alternatives considered:** Freeze now from synthetic data; shrink the buffer; compact items.
* **Consequences and trade-offs:** Cannot state a size guarantee yet; early-prune under quota remains a policy (STO-14). *Risks:* Heavy profiles remain large until measured.
* **Dependencies:** STO-14, STO-15, S6.
* **Amendments recorded:** **Amended 5 Nov 2026 (STO-71 confirmed):** Retention duration is part of this open decision and must be approved by the owner; numeric budgets wait for measurements.
* **Document references:** Design §7.3, §7.5; test strategy §4 (S2-M1…M9); register STO-79
* **Ready for owner approval:** No — blocked by browser measurements (numbers) and owner (duration)
* **Unresolved questions / risks:** S2 may proceed only under the conditions of sheet §F (localStorage record behind one interface, no retention policy, no frozen budget).
* **Exact question (register):** May S2 ship with the current provisional retention (500 results / 90 days / 400-day tombstones) and no absolute size budget until browser measurements exist?
* **Acceptance criteria:** Measurement report attached before any number is adopted.
* **Final recommendation:** **NEEDS CLARIFICATION**

### 18. STO-86 — Storage tier for attempt history
* **Register state:** OPEN
* **Proposed architecture (recommended default):** Decide **after** measurements S2-M1…M9 (capacity, latency, size per attempt). Until then design the history behind one narrow interface; S2 implements the localStorage record only if the owner accepts the measured limits.
* **Why this decision is necessary:** localStorage may not hold thousands of detailed attempts; IndexedDB changes the storage contract.
* **Alternatives considered:** IndexedDB now (async adapter, different backup/quarantine/cross-tab semantics); segmented localStorage log.
* **Consequences and trade-offs:** IndexedDB changes the synchronous storage contract and the recovery guarantees; localStorage may hit the quota with thousands of detailed attempts. *Risks:* Wrong tier chosen on estimates.
* **Dependencies:** STO-79, S6 measurements.
* **Amendments recorded:** none
* **Document references:** Design §7.3; register STO-86; test strategy §4
* **Ready for owner approval:** No — blocked by browser measurements
* **Unresolved questions / risks:** Measurements S2-M1…M9 do not exist yet.
* **Exact question (register):** Is a bounded-size localStorage record sufficient, or must detailed history move to IndexedDB (browser API, no dependency, async)?
* **Acceptance criteria:** Measurement report; the chosen tier passes the invariant matrix.
* **Final recommendation:** **NEEDS CLARIFICATION**


---

## 3. The Results/Core write combinations — independent re-audit

Notation: **R** = history (Results) write, **C** = Core write. Both are separate `setItem` calls; order is **R first, then C** (additions before core). **A storage failure (C-fail) and a stale-epoch rejection (C-rejected) are different events and are never handled the same way:** a failure is *transient — the intent stands and is retried*; a rejection is *deliberate — another tab replaced the state and its replacement wins; nothing of the stale tab's core state is retried.* Evidence for existing behaviour: `store.tsx` save effect (`lastSaved` is set even when a save fails, so no automatic retry timer exists), `saveProgress`/`writeChanged` (core guard returns `conflict`), `syncFromStorage` (adopts silently), `StorageNotice` (`save-failed`, dismissible).

| Dimension | **S1** R ok / C ok | **S2** R ok / **C fails** (quota, unavailable) | **S3** R ok / **C rejected** (stale epoch) | **S4** **R fails** / C ok | **S5** R fails / C fails |
|---|---|---|---|---|---|
| History durability | durable | durable (entry stored, no tombstone yet) | durable and independent of the replacement (STO-90) | **not stored**: in-memory pending queue only | not stored (queue) |
| XP correctness | credited | held in memory only; nothing persisted; no authorisation recorded | **none**: replacement wins; in-memory credit discarded when the tab adopts the stored state | credited (STO-80: history failure never blocks credit) | not persisted; in-memory only |
| Ledger / tombstone consistency | ledger + tombstone + entry consistent | entry without tombstone (history label "XP not part of progress" derived) until C succeeds | entry without tombstone **permanently** (derived label) | tombstone without entry ("details not saved") | none |
| Retry | none | C retried on the next state change, the explicit retry action, or the pagehide/visibility flush (**no timer**) | **none** (deliberate); a replay of the same resultId would be credited once through the Core | pending queue retried on every later results save, the retry action and the flush | both, as in S2/S4 |
| Duplicate prevention | tombstone + union by id | retry rewrites the same ledger ids/tombstone; entry already exists ⇒ no second entry | entry unique by id; no tombstone ⇒ reward earnable once | queue merges with the persisted record by id | same |
| Multi-tab | normal merge | other tabs see the entry (results key event) and not the credit until C lands | stale tab adopts the replacement; its entry is merged into Results in all tabs | other tabs see credit/tombstone but no entry; queue retried by the originating tab only | none visible to other tabs |
| User-visible feedback | none | existing `save-failed` notice (extended to mention history); **dismissible — see R1** | **required, not existing today:** conflict notice ("last attempt kept in history; its XP is not part of current progress") | **required:** "history not saved" notice | `save-failed` notice extended to history |
| After reload | consistent | entry present, **no XP** (learner earned XP in-session that was never saved — pre-existing S1 behaviour) | entry present, no XP | XP present, **entry lost** if the queue was not flushed (R3) | nothing present |
| After storage recovery | n/a | retry persists C; history label disappears once the tombstone exists | n/a (nothing to recover) | queued entry persists on the next successful results save | both persist if the session is still alive |

**Verification outcome.**
1. **XP without Core authorisation: impossible in every row** — XP exists only after a Core ledger write; Results never carry or grant XP; `entry.xp` is informational (I4). *(Engine check:* the only engine read of history is the daily-cap eligibility test, which can lead only to a capped credit through `award()` in the Core and only when `xp === 0`.)
2. **Duplicate XP after retries: impossible** — deterministic ledger ids `<key>@<creditedTo>`, tombstones and union-by-id (covered today by the P1/S1 idempotency and merge suites).
3. **Silent loss of an attempt while the tab is open: not found**, **provided** the notice cannot be dismissed away (R1). **With R1 unresolved this claim is FALSE** (a dismissed notice hides later failures).
4. **Equivalence trap avoided:** S2 vs S3 differ in retry, label and feedback; the document must keep them separate (it does in §12).
5. **Additional edge (not in the owner's list):** crash between R and C — same as S2 (entry without tombstone); safe.

---

## 4. The five S2 scope additions — audit

| # | Addition | Exact failure it prevents | Belongs in S2? | New failure modes introduced | Required tests (regression + mutation) | Localisation RU/KY/DE | Remaining ambiguity |
|---|---|---|---|---|---|---|---|
| 1 | **Conflict notice** for stale-epoch rejection | XP shown in-session vanishes silently when another tab resets/restores; the learner cannot tell whether the last attempt survived | **Yes** (S3 would otherwise be a silent loss of *feedback*, though not of history) | notice noise when a learner resets deliberately in tab A (tab B shows it) — acceptable | stale-core tab records an attempt: core rejected, entry merged, notice shown once, label derived; M-S2-26 (notice removed) and a new mutation "notice not shown after a prior dismissal" | new strings: title + body (3 languages); Kyrgyz marked for native review (as S1) | when exactly it appears (on adoption only if unsaved progress existed?) — define: shown when the adopted state discarded an unsaved credit |
| 2 | **Pending history queue + "history not saved" notice** | S4/S5: an entry that failed to persist is forgotten without warning | **Yes** | memory growth; behaviour when the record is newer-version/unwritable (R4); duplicate entries if the queue and a merged record both contain an id (handled by union) | quota-injection: entry stays queued, retried, never duplicated; queue drained after recovery; M-S2-24 (dropped after one failed retry); new: queue bound reached ⇒ notice, never silent drop | notice text per language; Kyrgyz review | **queue bound undefined** (cap and the "cap reached" behaviour); what "retry" cadence is (no timer) |
| 3 | **Pagehide flush includes the queue** | entries pending at tab close would be lost even when storage has recovered | **Yes**, but **only as a best effort** | a failed final write on pagehide is silent by nature; the current flush **returns early when `seconds <= 0`** (R13) | flush with queue and zero study seconds writes the queue; flush with unavailable storage fails without throwing; M-S2-27 (flush gated only on study seconds) | none (no UI at pagehide) | which events: `pagehide` + `visibilitychange`→hidden. **Limits:** not guaranteed (mobile Safari/Android may kill the page without events; bfcache; crashes; power loss), synchronous `localStorage` only — no IndexedDB/Web Locks/async at pagehide; fails the same way as the normal write when storage is full/unavailable |
| 4 | **Tombstone-only duplicate check** | a history entry without a tombstone (S2/S3, restores, R1 merge) wrongly blocks a legitimate credit; or results act as a reward authority | **Yes** (it is what keeps Core authoritative) | none; removes a redundant check that today is also protected by tombstones | engine tests: entry without tombstone ⇒ credit allowed once; tombstone present ⇒ no credit; replay no-op; M-S2-25 | none | the daily-cap *eligibility* read of history remains (cannot over-credit); keep or drop it? (design says keep) |
| 5 | **`entry.xp` informational** | history display or any code path granting/recomputing XP from a stored number | **Yes** | none | static test: no crediting code reads `entry.xp`; display uses the tombstone-derived status; M-S2-23 (XP from results) | label strings for "XP not part of current progress" / "details not saved" | derived label depends on tombstones, which **expire after 400 days** (R2): define "no label" for older entries |

---

## 5. Data-loss and consistency risk register

| Id | Question | Finding | Class |
|---|---|---|---|
| **R1 (I)** | Attempt completed with neither durable history nor clear warning? | **Yes, possible today**: `StorageNotice` hides every notice once dismissed (`noticeDismissed` is reset only by `adopt` — load/restore), so a later `save-failed` or future "history not saved" is invisible after one dismissal. | **HIGH** (blocks scope additions 1–2 as written; fix: dismissal must reset when a new failure starts or the kind changes) |
| **R2 (E,H)** | History label vs tombstone expiry | Tombstones are dropped after 400 days (`RETENTION.tombstoneDays`), so "no tombstone ⇒ XP not part of progress" mislabels old entries that **were** credited. | **MEDIUM** (fix: derive the label only for entries within the tombstone window; older entries get no label) |
| **R3 (A)** | Pending entry lost if the app reloads while storage stays unavailable? | **Yes** — the queue is in memory; a reload/close loses it; the pagehide flush cannot persist into unavailable storage. A session-scoped fallback store (`sessionStorage`) would add a second storage path and new failure modes and is **not** proposed. | **ACCEPTED RESIDUAL RISK — requires explicit owner acceptance** |
| **R4 (G)** | Results newer than the supported schema / unwritable | Entries cannot be persisted this session; queue grows; behaviour and bound undefined. | **MEDIUM** (define bound + notice; never drop silently) |
| **R5 (I)** | Attempt recorded, tab closes before the save effect runs | A few-millisecond window between the state update and the effect (pre-existing in S1); neither history nor XP persisted, no warning possible. | **ACCEPTED RESIDUAL RISK** (existing) |
| **R6 (B)** | XP credited twice after retries? | No: deterministic ledger ids, tombstones, union by id; engine/credit/merge suites (S1) | **LOW** (verified; keep the property test) |
| **R7 (C)** | Two tabs credit the same result? | Each attempt has its own `resultId`; the same first-time item credited in two tabs merges to one ledger entry (same deterministic id); no double XP | **LOW** |
| **R8 (D)** | Stale tab overwrites newer progress? | Core guard + group merge; the documented residual cross-tab race of S1 remains (stale write ignored/detected) | **ACCEPTED RESIDUAL RISK** (accepted for S1; Web Locks S4) |
| **R9 (E)** | Reset/Start Fresh/Restore/Rollback preserve Results without epoch inconsistency? | Yes by design (§11 N1–N2): the results record is exempt; cross-record inconsistency exists only as *history that refers to XP not in the ledger*, labelled from tombstones (see R2) | **LOW** (after R2) |
| **R10 (F)** | Older version reads/modifies the new layout? | S1 builds: `layout 2 > LAYOUT 1` ⇒ read-only, zero writes (existing, tested guard). Pre-S1 monolith builds (development only, STO-13) can rewrite a monolith. | **LOW** (S1) / **ACCEPTED RESIDUAL RISK** (pre-S1 dev builds) |
| **R11 (G)** | Results missing/corrupt | Empty buffer, exact bytes quarantined, notice, core untouched (STO-75) | **LOW** |
| **R12 (H)** | Migration/rollback producing inconsistent ledger/tombstones | The core is one record (ledger/tombstones consistent with each other); R1 rollback reverts the core as a whole; only history↔core labelling is affected | **LOW** |
| **R13** | Does the pagehide flush drain a queue? | Not as implemented: `flush` returns when `consumeSeconds() <= 0`; also skipped in read-only mode. Must also run when the queue is non-empty. | **HIGH** (spec gap for addition 3) |
| **R14** | XP vanishing silently on adopting a replacement (S3) | `syncFromStorage` adopts without any notice today. | **HIGH** (addition 1) |
| **R15** | Engine duplicate check `results.some(resultId)` | With history lacking tombstones it can block a legitimate credit; must be tombstone-only. | **HIGH** as a spec gap (addition 4); no data loss in current S1 |
| **R16** | STO-92 changes S1 behaviour (core-only restore keeps prefs/tutor) | Regression risk for restore flows; tests required (sheet/test §11) | **MEDIUM** |
| **R17** | Automatic S1 pruning until S2 ships; history already folded | Dev profiles lose older detail now; STO-13: no real users | **ACCEPTED RESIDUAL RISK** |
| **R18** | Unknown/newer entry-level fields | Must be preserved on rewrite (sanitizers currently drop unknown keys) | **MEDIUM** (STO-82 detail) |

**Blockers: none** against the architecture itself. **HIGH items (R1, R13, R14, R15) must be closed in the design text before implementation authorisation.**

---

## 6. Complete test-coverage matrix (design level — no test is written or run)

Existing coverage to reuse: S1 suites (688 tests: persistence, cross-tab, recovery, stale-shell, merge algebra, engine idempotency, mutation scripts); S2 strategy §2 rows 1–12, §6–§11.

| # | Area | Test | Expected result | Invariant protected | Exists in strategy? |
|---|---|---|---|---|---|
| T1 | Normal write | record an attempt | R then C; entry + tombstone + ledger | XP once; history durable | yes (§2) |
| T2 | Quota | C fails (quota) after R ok | entry stored, XP in memory, `save-failed` notice, retry persists, no second entry | no duplicate; visible pending | yes (§11) |
| T3 | Quota | R fails, C ok | XP persisted, entry queued, "history not saved" notice, retry drains | STO-80 | yes (§11) |
| T4 | Unavailable | both fail | nothing persisted, notices, retries after recovery persist both | no silent loss while open | yes |
| T5 | Recovery | storage returns after T2–T4 | persisted exactly once | idempotent retry | yes |
| T6 | Duplicates | same resultId twice (double-fired handler) | second is a no-op for XP and history | I3 | existing engine tests + §2 row 2 |
| T7 | Multi-tab | stale-core tab records an attempt after reset elsewhere | core rejected (zero core writes), entry merged, conflict notice, label derived | STO-90, I1 | yes (§10/§11) |
| T8 | Multi-tab | two tabs record concurrently | both entries kept, ledger merged, no duplicate XP | merge algebra | partly (S1) |
| T9 | Reset | reset | results key byte-identical, zero writes | STO-90 | yes (§9) |
| T10 | Start Fresh | after unreadable core | same | STO-90 | yes (§9) |
| T11 | Core restore (composite) | restore snapshot without history | core/prefs/tutor exact; history untouched; labelled | STO-76/90 | yes |
| T12 | Core-only restore | R1/layout-1/2 copy | core replaced; **prefs/tutor byte-equal**; history merged | **STO-92** | yes (§11) |
| T13 | Rollback | via R1 and `rollbackToLegacy` | results key never removed/overwritten; history merged | STO-90 | yes |
| T14 | Migration | S1 → S2 with history/prefs/tutor | merged, core ledger/progress byte-equal, R1 pinned | STO-78 | yes (§11) |
| T15 | Migration failures | crash/quota/lying write at R1–R3 | converges, no history lost, compat mode | STO-78 | yes (§2 row 8) |
| T16 | Corrupt data | bytes/repairs/future v | quarantine first, empty buffer, core identical | STO-75 | yes (§2 row 6) |
| T17 | Unsupported schema | results record newer than supported | untouched, never rewritten, entries pending, notice | STO-75/R4 | **partly** (queue behaviour missing) |
| T18 | Unsupported layout | S1 build on layout 2 | read-only, zero writes | STO-73 | yes |
| T19 | Reload | reload with entries in the queue and storage unavailable | entries lost (accepted) **and a notice shown before** | R3 | **missing** |
| T20 | Pagehide | queue non-empty, zero study seconds | flush writes queue | addition 3 | **missing** (M-S2-27 proposed) |
| T21 | Pagehide | storage unavailable | flush fails silently without throwing; queue unchanged | R3 | **missing** |
| T22 | Notice | dismiss then a new failure | notice shown again | **R1** | **missing** |
| T23 | Label | entry older than 400 days, no tombstone | no "not credited" label | **R2** | **missing** |
| T24 | Queue bound | queue reaches the bound | notice, nothing dropped silently | **R4** | **missing** |
| T25 | Duplicate check | entry without tombstone, legitimate credit | credited once | **R15** | yes (addition 4) |
| T26 | `entry.xp` | static scan | no crediting code reads it | addition 5 | yes (M-S2-23) |
| T27 | No automatic deletion | quota, rotation, migration, merge-path prune | no entry removed | STO-71/87 | yes |
| T28 | Reset wording | ru/ky/de confirmation | states history retained; Kyrgyz flagged | STO-90 | yes (§10) |
| T29 | Unknown keys / v1 | every journey | untouched | safety | yes (§2 rows 10–11) |
| T30 | Entry unknown fields | rewrite preserves unknown optional fields | no loss | R18 | **missing** |

**Mutations M-S2-22…26 — adequacy.** They cover the most dangerous *logic* defects (skipped results write on rejection, XP from results, dropped queue, authoritative results duplicate check, removed conflict notice). **Weaknesses:** none covers (a) a notice that is hidden after a prior dismissal (R1), (b) a flush gated only on study seconds (R13), (c) the label ignoring tombstone expiry (R2), (d) queue growth without bound/notice (R4), (e) a pending entry duplicated when the persisted record already contains it. Proposed additions: M-S2-27…31 for these five.

---

## 7. Cross-document consistency review

| # | Finding | Status |
|---|---|---|
| 1 | Gate line "S2 gate finalisation" listed **STO-92 among decisions still PROPOSED** while STO-92 is owner-approved | **Corrected in this audit** (one-line documentation fix) |
| 2 | Migration plan §13 rule 2 said "(STO-92, proposed)" | **Corrected in this audit** |
| 3 | `ARCHITECTURE_CHANGELOG.md` has **no entry** for S1, the S1 deviation verification, or any S2 design/decision step; it ends at the earlier architecture revisions | **Reported, not changed** (LOW — decide whether the changelog should record storage stages) |
| 4 | `FINAL_ARCHITECTURE_REVIEW.md` predates all storage work; the "latest independent architecture review" of S2 exists only as chat output and as design §11/§12 | **Reported** (LOW) |
| 5 | STO-74 and STO-77 still describe watermark/summary mechanics that S2 never executes (no pruning, no deletion) | **Open ambiguity → NEEDS CLARIFICATION** |
| 6 | Sheet §B lists 13 items "proposed", of which the owner intends to approve 12 (STO-89 excluded) | consistent with the report; stated in §1 |
| 7 | STO-82/migration §9: which header fields S2 begins to store is "if the owner approves" — not stated as a decision | **Open → STO-82 clarification** |
| 8 | S1 decisions (STO-01…18) remain "PROPOSED" in their register entries although the owner authorised and S1 is implemented; the S2 section banner explains it | **Reported** (LOW; historical states) |
| 9 | STO-90 and STO-92 are represented consistently in the register, sheet, gate, design §10–§11, migration §13 and test §9/§11 after the two corrections above | **Consistent** |
| 10 | The register summary line says "S2: only STO-92 owner-approved" while the sheet shows 6 ticked owner decisions (confirmed requirements + STO-92) | consistent (requirements ≠ architecture approvals) |

---

## 8. Outstanding questions and remediation requiring owner decisions

**Owner decisions needed**
1. Accept or reject the **residual risk** R3 (pending entries/unsaved XP lost when a session ends while storage keeps failing) — with the notice and best-effort flush as the only mitigation.
2. Confirm the **five scope additions** with the corrections: dismissal must re-arm on a new failure (R1); flush must also run for a non-empty queue (R13) and is best-effort only; label derived only within the tombstone window (R2); define the queue bound and newer-version behaviour (R4); conflict notice wording and trigger (R14).
3. Decide which **header fields S2 stores** (STO-82) and clarify STO-74/STO-77 as "reserved/inactive in S2".
4. Whether the architecture changelog should record the storage stages (LOW).

**Smallest documentation corrections (not performed except the two above):** (a) add R1, R13, R2, R4 requirements to design §12/§11 N3; (b) state "reserved/inactive in S2" in STO-74 and STO-77; (c) state the stored header fields in STO-82; (d) add the missing tests T17–T24, T30 and mutations M-S2-27…31 to the strategy.

---

## 9. Final recommendation per decision

| Decision | Title | Recommendation |
|---|---|---|
| STO-70 | Raw results live in a dedicated, independently versioned record (Option A) | **RECOMMEND APPROVE** |
| STO-72 | What stays in the course record | **RECOMMEND APPROVE** |
| STO-73 | Layout marker 2, old builds read-only, rollback is an explicit restore | **RECOMMEND APPROVE** |
| STO-74 | Crash-safe pruning: watermark + direction-based write ordering | **NEEDS CLARIFICATION** |
| STO-75 | Results record absent, damaged or from a newer version (never "stale" by core epoch — STO-90) | **RECOMMEND APPROVE** |
| STO-77 | Cross-tab merge rule for results and summaries | **NEEDS CLARIFICATION** |
| STO-78 | S1 → S2 migration procedure and compat mode | **RECOMMEND APPROVE** |
| STO-80 | Failure to append a raw result never blocks the credit | **NEEDS CLARIFICATION** |
| STO-81 | Write-isolation acceptance for S2 | **RECOMMEND APPROVE** |
| STO-82 | Attempt-history entry model and capture staging | **NEEDS CLARIFICATION** |
| STO-87 | Quota behaviour: never delete history automatically | **RECOMMEND APPROVE** |
| STO-88 | History-deletion mechanism (scopes, marker, snapshot, no effect on progress) | **RECOMMEND APPROVE** |
| STO-89 | History-specific temporary backup (HB) for history deletion | **NEEDS CLARIFICATION** |
| STO-85 | Privacy and data minimisation of attempt history | **NEEDS CLARIFICATION** |
| STO-91 | Retention duration of the temporary history backup | **NEEDS CLARIFICATION** |
| STO-83 | Content versioning and stable references for history | **NEEDS CLARIFICATION** |
| STO-79 | Retention values, compaction and numeric budgets stay unfrozen | **NEEDS CLARIFICATION** |
| STO-86 | Storage tier for attempt history | **NEEDS CLARIFICATION** |

**Summary:** RECOMMEND APPROVE — STO-70, 72, 73, 75, 78, 81, 87, 88 · NEEDS CLARIFICATION — STO-74, 77, 80, 82 (S2, small), STO-89, 91 (later deletion stage), STO-85, 83 (open), STO-79, 86 (measurements) · RECOMMEND REJECT — none.

## 10. Is S2 ready for implementation authorisation?

**No — not yet.** Conditions: the four S2 clarifications (STO-74, 77, 80, 82); the four HIGH items R1, R13, R14, R15 closed in the design text; the owner's explicit acceptance of the residual risks R3, R5, R8, R10 (pre-S1 dev builds), R17; STO-79/STO-86 either answered by measurements or left open under sheet §F; the 12 S2 decisions approved by the owner; and a separate written authorisation. **Nothing in this audit approves or authorises anything.**
