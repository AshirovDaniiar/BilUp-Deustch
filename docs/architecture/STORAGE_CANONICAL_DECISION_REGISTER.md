# BilUp Til 2.0 — Storage: Canonical Decision Register

**Date:** 5 November 2026 · **Type:** design-only register · **APPROVED decisions in this register: 0 · REJECTED: 0.** Nothing here is approved on the owner's behalf.
**Consolidates:** `STORAGE_ARCHITECTURE_DECISIONS.md` (the "original", unchanged), `STORAGE_DECISION_VALIDATION.md` (the "validation", unchanged), blockers B1–B6 of `P1_COMPLETION_REPORT.md`.
**Companion:** [`STORAGE_IMPLEMENTATION_GATE.md`](STORAGE_IMPLEMENTATION_GATE.md) — which decisions each stage needs.

---

## 0. How to read this register

**States.** `OPEN` — no safe default can be recommended without owner input or missing facts. `PROPOSED` — a concrete default is written down in the original or validation and is awaiting the owner. `APPROVED` / `REJECTED` — set only by the owner, never by this document.
**IDs.** One canonical namespace, `STO-nn` (stable, never reused). The old numbering clashed (the review list's SD-04…SD-09 pointed at different subjects than the original's), so **old IDs are kept only in the mapping columns** and no two decisions are merged.
**Stages.** `S1` preferences + tutor split · `S2` raw-results split · `S3` backup bundle & per-record recovery · `S4` export, import, reset, undo, pruning offer · `S5` assisted attempts · `S6` browser validation · `P2` manifests.

### 0.1 Owner action sheet — the minimal set to approve to start

Only these are needed to begin the **smallest safe scope (S1: preferences + tutor)**; tick in the owner's own record, not here:

- **STO-13** ~~Confirm no build that writes `bilup-deutsch:v2…` has reached real users~~ — **CONFIRMED by explicit owner statement, 5 Nov 2026** (recorded; classification: pre-release / development-profile migration). This is a recorded fact, not an approval of any design decision.
- [ ] **STO-01** Split storage into independent records (Option B) before first release
- [ ] **STO-02** Replace the acceptance sentence with measurable write budgets
- [ ] **STO-04** Keep core `schemaVersion 2`; add a layout marker and epoch-stamped slices
- [ ] **STO-05** Order and precedence rules for upgrading development profiles
- [ ] **STO-06** Damage to preferences/tutor never opens the recovery screen
- [ ] **STO-07** Core-first write order; recover by epoch, no journal
- [ ] **STO-11** Per-record cross-tab merge rules (for preferences and tutor)
- [ ] **STO-17** Interim snapshot rule: nothing omitted; refuse destructive actions if the snapshot fails *(added by the S1 amendment)*
- [ ] **STO-18** Timestamp model for preferences and tutor *(added by the S1 amendment)*

> **S1 amendment (5 Nov 2026):** the detailed S1 design is in [`STORAGE_S1_FINAL_DESIGN.md`](STORAGE_S1_FINAL_DESIGN.md). STO-02, 05, 06, 07 and 11 below are **amended** there; STO-17 and STO-18 are new. The S1 list is now **ten** decisions plus the sub-approvals in S1 design §10. All remain PROPOSED/OPEN.

### 0.2 Mapping tables

| Canonical | Original proposal | Review-list | Validation ref | Blocker |
|---|---|---|---|---|
| STO-01 | SD-01 | SD-01 | §2 | B1 |
| STO-02 | SD-01 (fallback text), §8.1 | — | §2 | B1 |
| STO-03 | — (omitted) | — | R-3 / A-3 | B1 |
| STO-04 | §3.1 note "schema stays 2" | — | §2 C1, C5 | B1 |
| STO-05 | §3.5 | — | §2 C2, C3, C6 | B1 |
| STO-06 | §3.5 "Recovery" | — | §3 | B1 |
| STO-07 | §3.3 | — | §4 | B1 |
| STO-08 | §3.6 | — | §3.2 | B1 |
| STO-09 | §3.6 | — | R-5 / A-5 | B1/B2 |
| STO-10 | — | — | R-7 / A-7 | B1/B2 |
| STO-11 | §3.4 | — | §5 | B1 |
| STO-12 | §1.1 (invariant) | — | R-10 context | B2 |
| STO-13 | §1.2 F6 (premise) | — | §2 | B1 |
| STO-14 | §8.7, §3 | — | §9 | B1/B6 |
| STO-15 | SD-05 (retention part), §3.7 | — | O-5 | B3 |
| STO-16 | — | — | R-6 / A-6 | B3 |
| STO-17 | — (new, S1 amendment) | — | follow-up to hidden dependency on STO-08/09 | B1 |
| STO-18 | — (new, S1 amendment) | — | follow-up to hidden dependency in STO-05/11 | B1 |
| STO-20 | SD-02 | SD-02 | §10 | B2 |
| STO-21 | — | (SD-02 "achievements") | R-1 / A-1 | B2 |
| STO-22 | SD-02 (name opt-out) | — | O-6 | B2 |
| STO-23 | SD-02 (tutor optional) | SD-02 | §7.1 | B2 |
| STO-24 | §4.1 format | — | §7 | B2 |
| STO-25 | SD-03 | SD-03 | §10 | B2 |
| STO-26 | SD-04 (import strictness) | — | O-1 | B2 |
| STO-27 | §4.3 | SD-04 | §8 | B2 |
| STO-28 | SD-09 (streak) | — | O-3, R-3 | B2 |
| STO-29 | §4.3 (tutor erased) | — | R-5 | B2 |
| STO-30 | — | — | R-2 / A-2 | B2 |
| STO-31 | SD-07 (erase everything) | — | O-2 / R-10 | B2 |
| STO-32 | SD-08 (undo window) | SD-05 | §9.4 | B2 |
| STO-33 | §4.3 "undo" | — | §3.2, §9 | B2 |
| STO-34 | SD-05 (offer wording), §4.4 | SD-06 | §10 | B3 |
| STO-35 | — | — | §5 | B2 |
| STO-40 | §5.2 rule 1 | SD-07 | §10 | B4 |
| STO-41 | §5.2 | — | §10 | B4 |
| STO-42 | SD-06 (assisted factor) | — | O-4 | B4 |
| STO-43 | §5.2 rules 3–4 | — | §10 | B4 |
| STO-44 | §5.2 rule 2 | — | §10 | B4 |
| STO-50 | §7 | SD-09 | §10 | B6 |
| STO-51 | §7 manual | — | Q14 | B6 |
| STO-52 | §7 performance | — | §9.2 M1–M9 | B6 |
| STO-53 | §7 stale deployments | — | §10 | B6 |
| STO-60 | §6 | SD-08 | §10 | B5 |
| STO-61 | — | — | §10 SD-08 caution | B5 |

**Amendments → decisions:** A-1→STO-21 · A-2→STO-30 · A-3→STO-03 · A-4 (numbering)→this register · A-5→STO-09, STO-29 · A-6→STO-16 · A-7→STO-10.
**Orphans → decisions:** O-1→STO-26 · O-2→STO-31 · O-3→STO-28 · O-4→STO-42 · O-5→STO-15 · O-6→STO-22.

### 0.3 Contradiction check (verified against the code, not only against the documents)

| Statement to verify | Verified? | Evidence in the current code | Where decided |
|---|---|---|---|
| Achievements are computed, not persisted | **True** | `UserProgress` has no achievement/badge field; `features/progress/stats.ts › badges()` derives every badge from `xp`, `activeDates`, `mastery`, `completed`, `scores` | STO-21 |
| Streak and study time belong to course data | **True (today)** | `activeDates`, `studySeconds` are fields of `UserProgress`, stored inside the single course record `bilup-deutsch:v2:de-general` | STO-03, STO-28 |
| Legacy storage is not silently deleted | **True (today)** | the only `kv.remove` calls in `persistence.ts` target backups (rotation), the app's own unverified record, and the current record in `rollbackToLegacy`; none targets `bilup-deutsch:v1`; mutation M10 proves a deletion is detected | STO-12; the open question is *erase-everything* (STO-31) |
| Stale-shell writes cannot resurrect replaced progress | **Holds for reset and start-fresh, not yet specified for import/restore** | `reset` → `freshCore()` (`origin: null`, drift disabled); `startFresh` likewise; `restoreFrom(legacy)` re-migrates with the current v1 fingerprint; restoring a v2 snapshot keeps the snapshot's `origin`; import does not exist | STO-10 |
| Pruning is crash-safe and never double-counts | **True today, at risk after the split** | `pruneActivity` runs inside `recordResult`; results, summaries, tombstones are one `Core` written by one `setItem`. Moving the buffer to its own record creates a two-record window | STO-16 |
| Undo snapshots are bounded with clear retention | **Bounded today (2 + pinned); no time-based retention exists** | `snapshotCurrent` + `rotateBackups(keep 2, pinned)`; no 30-day logic anywhere | STO-32, STO-33 |
| Tutor export and reset behaviour is explicit | **Not yet** | `reset` erases the tutor (it builds `freshCore()`); `clearTutor` is separate; export does not exist | STO-23, STO-29 |
| Speaking hints are not submitted as answers | **False today** | `SpeakingLab.tsx`: hint chips call `onAnswer(h, null)`; topic/daily hints are view-only `<details>`; `SpeakInput` keeps its text in private state | STO-40 |
| XP policy is consistent for assisted attempts | **Mechanism consistent, policy undefined** | `recordResult` scales item credit **and** the completion bonus by `assistedFactor`; shipped factor is `1` for every kind; no screen ever sets `assisted:true` (`?? false`); a later unassisted attempt tops credit up to the full amount (ledger semantics) | STO-42, STO-43 |

No behaviour is invented below: each "recommended default" is taken from the original or the validation, and says so.

---

## 1. Stage S1–S3 — storage split and migration safety

### STO-01 — Split storage into independent records (Option B) before first release
* **State:** PROPOSED · **Source:** original SD-01 / review SD-01
* **Recommended default:** keep the core record; move preferences, tutor transcript and raw-results buffer into their own small, individually versioned records. In-memory `UserProgress` unchanged.
* **Alternatives:** A — in-memory separation only (does not meet the criterion); C — schema 3 + full migration (more machinery, no user benefit while nothing shipped).
* **Technical consequences:** core written first, slices after; per-key events; independent failure domains; snapshots shrink 3–5×; one-time loader branch for development profiles.
* **Risks:** new cross-key crash windows (mitigated by STO-07); regression in verified paths; dev-profile mixing (STO-05).
* **Dependencies:** STO-13, STO-02, STO-04, STO-07.
* **Owner approval:** required.
* **Acceptance:** every write goes to the intended key only; core never contains split fields; all 545 tests green or consciously updated.
* **Tests:** per-key `setItem` assertions; static "core has no split fields"; migration/recovery matrices re-run; mutation matrix re-run.

### STO-02 — Replace the acceptance sentence with measurable write budgets
* **State:** PROPOSED · **Source:** original §0/§8.1, validation §2
* **Amended (S1 design §8):** the S1 acceptance requirement is **relative write isolation** — a preference change writes only the preferences key, a tutor change only the tutor key, progress only the core key, the core never contains preference/tutor fields, nothing writes `bilup-deutsch:v1`. **Absolute numeric budgets are provisional** until measurements M1 and M4 and are **not frozen**. The earlier figures (< 1 KB, ≤ 16 KB, core ≤ 150 KB) are **withdrawn as acceptance criteria**: the tutor figure contradicts the measured worst case (≈ 234 KB) and none has a browser measurement behind it.
* **Default:** write-isolation assertions recorded per action; indicative synthetic sizes kept as information only.
* **Alternatives:** keep the numeric budgets (unsupported); keep the literal sentence (satisfied only by Option B anyway).
* **Consequences:** testable acceptance without unmeasured limits.
* **Risks:** none beyond deferring numeric limits.
* **Dependencies:** STO-01. (STO-14/STO-52 only for the later numeric budgets — no longer a dependency of S1.)
* **Owner approval:** required (the amended wording).
* **Acceptance:** write isolation asserted for every S1 action; no size limit frozen.
* **Tests:** recording-store assertions in the vitest suite; absolute benchmarks in S6.

### STO-03 — Learner-global record for active days and study time
* **State:** PROPOSED (validation A-3) · **Source:** validation R-3
* **Default:** a `bilup-deutsch:global` record holding `activeDates`, `studySeconds` (and persisted achievements only if STO-21 says so), separate from the per-course core.
* **Alternatives:** leave them in the course core (a course reset then erases the streak — conflicts with 05 §3 "streak is learner-global"); duplicate per course.
* **Consequences:** fourth record; merge rules (active days union, study time max); export section; reset keeps it.
* **Risks:** another cross-key window; migration of the field out of the core.
* **Dependencies:** STO-01, STO-04, STO-11, STO-28.
* **Owner approval:** required (it is the owner's call whether the streak survives a course reset — STO-28).
* **Acceptance:** core contains neither field; reset keeps them; legacy migration fills the record.
* **Tests:** field ownership test; migration fixtures; cross-tab union test.

### STO-04 — Version mechanism: core stays `schemaVersion 2`, plus layout marker and epoch-stamped slices
* **State:** PROPOSED · **Source:** validation §2 (C1, C5)
* **Default:** optional `layout` field in the core listing expected slices; a build that sees a larger `layout` goes read-only; every slice that a deliberate replacement can invalidate carries the core `epoch` it belongs to and is ignored when stale.
* **Alternatives:** bump to `schemaVersion 3` (equivalent safety, extra machinery).
* **Consequences:** unknown top-level fields are dropped by `serialize` today, so the marker is only preserved by builds that know it.
* **Risks:** an older build rewriting the core drops the marker (development only).
* **Dependencies:** STO-01, STO-13.
* **Owner approval:** required (or the owner may prefer schema 3).
* **Acceptance:** larger `layout` ⇒ read-only; stale-epoch slice ignored; marker survives save/load.
* **Tests:** layout-guard test; stale-slice test after simulated reset; round-trip test.

### STO-05 — Upgrading development profiles: order, precedence, backup first
* **State:** PROPOSED · **Source:** validation §2 (C2, C3, C6)
* **Amended (S1 design §2, §3, §7):** the backup is the **exact stored monolith bytes, pinned**; precedence uses the total orders of STO-18 (preferences by `(epoch, updatedAt, canonical JSON)`; tutor by **merge**, not by choosing one side); order U1 backup → U2 prefs → U3 tutor → U4 core; the upgrade is idempotent and resumable at U4; backup failure ⇒ the upgrade does not start.
* **Default:** (1) content-addressed backup of the monolith bytes, (2) write slices (verified), (3) rewrite core without them; if both copies exist the slice wins only if not older (`updatedAt`/`settingsAt`); the loader never deletes unknown `bilup-deutsch:*` keys.
* **Alternatives:** do nothing for dev profiles (STO-13 is now CONFIRMED, but development data is **not assumed disposable**, so this alternative is not recommended).
* **Consequences:** idempotent, crash-safe; `roundTripOk` must become slice-aware.
* **Risks:** wrong precedence silently losing newer data.
* **Dependencies:** STO-01, STO-04.
* **Owner approval:** required.
* **Acceptance:** crash at every write converges to the same state; newer monolith vs older slice (and reverse) resolved correctly.
* **Tests:** crash matrix over the four writes; precedence tests; no unknown key deleted.

### STO-06 — Independent failure domains
* **State:** PROPOSED · **Source:** original §3.5, validation §3
* **Narrowed to S1 (S1 design §4):** applies to **preferences and tutor only**; global and results handling is deferred to S2/S3 and not specified here. Exact damaged bytes are quarantined (verified) before replacement; a slice from a newer version is left untouched; notices N1–N3 are dismissible, lowest priority, with ru/ky/en text (Kyrgyz flagged for native review).
* **Default:** damage to preferences, tutor, results or global is quarantined for that key alone, replaced by an empty/default slice, shown at most as a low-priority notice; only the core opens the recovery screen or forces read-only.
* **Alternatives:** treat any damage as core damage (today's behaviour).
* **Consequences:** a corrupt tutor can no longer block learning.
* **Risks:** silently losing preferences (mitigated by quarantine + notice).
* **Dependencies:** STO-01.
* **Owner approval:** required.
* **Acceptance:** totals and completion unchanged when any non-core record is corrupted; quarantine holds the exact bytes.
* **Tests:** corrupt each record separately; assert no recovery screen, no read-only, XP unchanged.

### STO-07 — Write ordering and operation recovery (core first, no journal)
* **State:** PROPOSED · **Source:** original §3.3, validation §4
* **Amended (S1 design §7):** the table distinguishes **replacing** operations (reset, restore, start-fresh: snapshot → core(epoch+1) → slices) from **creations** (legacy migration, monolith upgrade: slices first, **core last**, because the core is the commit marker). A slice writer refuses when the stored slice or core epoch is higher than its own. Failure behaviour for every S1 sequence (crash points, partial writes, backup failure, quota, cross-tab) is tabulated there.
* **Default:** snapshot → core → non-critical records; stale slices healed by the epoch rule.
* **Alternatives:** a write-ahead operation journal (additive later).
* **Consequences:** crash outcomes are exactly the table in validation §4.
* **Risks:** a half-applied import/reset leaves mixed preferences/global (reported with Undo/Finish).
* **Dependencies:** STO-04.
* **Owner approval:** required.
* **Acceptance:** crash injected after every write of every multi-record operation leaves a valid state.
* **Tests:** crash matrix per operation.

### STO-08 — Recovery-point bundle: format, classes, verification
* **State:** PROPOSED · **Source:** original §3.6, validation §3.2
* **Default:** content-addressed bundle with manifest and per-record fingerprints; classes `pre-migration` (pinned), `split-upgrade`, `drift` (2 newest), `undo` (STO-32/33), plus the existing `quarantine`; "verified" = byte read-back + fingerprints + sanitizer parse.
* **Alternatives:** one copy per key.
* **Consequences:** classes no longer compete for one "newest 2".
* **Risks:** bundle format becomes a long-lived contract.
* **Dependencies:** STO-01, STO-09.
* **Owner approval:** required.
* **Acceptance:** unverified bundles never offered; identical bytes never duplicate; pristine copy pinned.
* **Tests:** tamper tests; rotation per class; round trip.

### STO-09 — Snapshot composition (what each class contains)
* **State:** OPEN · **Source:** validation R-5 / A-5
* **Default:** core + preferences + global; tutor and results **excluded**. Conflicts with "reset erases the tutor" unless STO-29 keeps it.
* **Alternatives:** include tutor (≤ 234 KB), include results (≤ 588 KB) — not recommended (STO-33).
* **Consequences:** Undo cannot restore excluded data; dialog must say so.
* **Risks:** learner expects full undo.
* **Dependencies:** STO-29, STO-33.
* **Owner approval:** required.
* **Acceptance:** restored state byte-identical for included records; excluded data behaviour as documented.
* **Tests:** undo after reset with and without tutor/results.

### STO-10 — Stale-shell drift: re-baseline on every deliberate replacement
* **State:** PROPOSED · **Source:** validation R-7 / A-7
* **Default:** reset, start-fresh, import, restore, erase-everything either drop `origin` (disables drift) or re-baseline its fingerprint to the current `v1`.
* **Alternatives:** leave drift active (resurrects erased progress).
* **Consequences:** after a reset a stale shell's later writes are ignored.
* **Risks:** a learner who reset in the new app and keeps using an old shell sees the two diverge (intended).
* **Dependencies:** STO-12, STO-25, STO-27.
* **Owner approval:** required (it defines what "reset" means with an old shell).
* **Acceptance:** after each replacement operation a changed `v1` is not merged.
* **Tests:** reset/import/restore/start-fresh each followed by a stale `v1` write.

### STO-11 — Per-record cross-tab merge rules
* **State:** PROPOSED · **Source:** original §3.4, validation §5
* **Amended (S1 design §3):** preferences: higher epoch, then higher `updatedAt` (never earlier than the previous value + 1), then larger canonical JSON; tutor: higher epoch, else union by id, `clearedAt` watermark, sort by `(at, id)`, newest 60, id collisions keep both. The global and results rules below are out of S1.
* **Default:** core existing; preferences last-writer-wins by `updatedAt`; global: active days union, study time max; tutor union by message id; results union by `resultId`.
* **Alternatives:** last-writer-wins everywhere (loses concurrent progress).
* **Consequences:** documented limits remain (removals don't propagate; mastery takes the more practised side).
* **Risks:** union semantics cannot express deletion.
* **Dependencies:** STO-01, STO-03.
* **Owner approval:** required.
* **Acceptance:** merge algebra (idempotent, commutative, associative, monotonic) holds for each slice.
* **Tests:** extend the 150-triple property suite; two-tab scenarios per key.

### STO-12 — Legacy `v1` invariant
* **State:** PROPOSED (already how the code behaves) · **Source:** 05 §11, P1 report
* **Default:** the application never writes or deletes `bilup-deutsch:v1`; the pristine pre-migration copy is pinned. The only exception would be an explicit learner action decided in STO-31.
* **Alternatives:** none recommended.
* **Consequences:** old shells keep working; rollback exposes pre-migration data.
* **Risks:** storage cost of the legacy copy (small).
* **Dependencies:** STO-31.
* **Owner approval:** required (codifies the rule).
* **Acceptance:** no code path outside the explicit erase action touches `v1`.
* **Tests:** existing M10-style mutation; "legacy bytes unchanged" in every journey.

### STO-13 — Premise: no build writing `bilup-deutsch:v2…` has reached real users
* **Status:** **CONFIRMED** (a statement of fact, not an approval of any design decision) · **Source:** original §1.2 F6
* **Confirmation source:** explicit owner statement, 5 November 2026: *"No BilUp build writing to bilup-deutsch:v2 has ever been published or distributed to real users."*
* **Migration classification:** **pre-release / development-profile migration.** The only released format is `v1`; every `v2` monolith exists only in development profiles (browsers of the owner and developers). The v1 → current migration remains a full production-grade migration because real users have `v1`.
* **Repository corroboration (not the source of the confirmation):** one commit (`386c6a1`), one remote branch, no tags, no deployment configuration, no `v2` key in any pushed commit or in the local `dist/` build. This cannot prove the statement; the owner's statement does.
* **What the confirmation changes:** STO-04/STO-05 are *development-profile conveniences* and not mandatory user-facing migration of shipped data; the "post-release migration" alternative is no longer in force.
* **What it does NOT change (safety requirements preserved):** never write or delete `bilup-deutsch:v1`; the pinned migration backup preserves the exact original monolith bytes; unknown storage keys are never deleted; the upgrade stays idempotent and crash-safe; **development data is not assumed disposable** — it is the owner's and developers' real working data, so "do nothing for development profiles" is not an acceptable simplification.
* **Reopen condition:** if a `v2`-writing build is later found to have reached users, STO-13 reverts to OPEN and S1 stops until real shipped fixtures are tested.
* **Dependencies:** none.
* **Owner approval:** the confirmation is recorded; no further action on STO-13 itself.
* **Acceptance:** confirmation recorded with date and source (done in this entry, the gate and the S1 design).
* **Tests:** none required by the confirmation; S1 still tests the upgrade of monolith fixtures.

### STO-14 — Size budgets, quota thresholds and quota-pressure policy
* **State:** OPEN (needs measurement) · **Source:** original §8.7, validation §9
* **Default:** high-water mark H measured per engine; above H: prune results early → drop expired/oldest undo → ask the learner to download-then-delete quarantine beyond a cap → warn; never touch core, global, preferences, pristine legacy copy, newest undo.
* **Alternatives:** no automatic action, only a warning.
* **Consequences:** defines eviction order.
* **Risks:** browser capacity assumed (~5 M UTF-16 units) is **unmeasured**.
* **Dependencies:** STO-52.
* **Owner approval:** required (it decides what may be removed automatically).
* **Acceptance:** each write path survives quota exhaustion without silent loss.
* **Tests:** Playwright quota-fill journeys; per-path unit tests with a failing store.

### STO-15 — Raw-results retention parameters and compaction
* **State:** OPEN (orphan O-5) · **Source:** 05 §4.4 [A], original §3.7
* **Default:** keep 500 results / 90 days / tombstones 400 days as now **and** compact item detail (e.g. detail only for the newest ~50 results, summaries for the rest, or compact tuples).
* **Alternatives:** shrink N; segment by month; leave as is (heavy buffer ≈ 0.4–0.6 MB).
* **Consequences:** decides the size of the results record and snapshot cost.
* **Risks:** losing per-item audit detail.
* **Dependencies:** STO-52, STO-16.
* **Owner approval:** required.
* **Acceptance:** results record ≤ budget at the heavy profile; totals unchanged by pruning.
* **Tests:** existing pruning property tests + size assertions.

### STO-16 — Crash-safe pruning without double counting
* **State:** PROPOSED (validation A-6) · **Source:** validation R-6
* **Default:** write summaries together with a prune watermark (highest folded `finishedAt` + count) in the **same record**, or keep a compact set of summarised ids, so re-running after a crash cannot fold a result twice.
* **Alternatives:** keep results and summaries in the core (then pruning stays atomic but the buffer cannot leave the core).
* **Consequences:** needed as soon as the results leave the core (S2).
* **Risks:** a bug here silently corrupts statistics, not totals.
* **Dependencies:** STO-01, STO-15.
* **Owner approval:** required (engineering decision with data-retention impact).
* **Acceptance:** crash between the two writes, then re-run, leaves summaries equal to a clean run.
* **Tests:** crash-injection between the writes; idempotence; property test "prune all raw results leaves totals identical".

### STO-17 — Interim snapshot rule (S1)
* **State:** PROPOSED (new, S1 amendment) · **Source:** hidden dependency of S1 on STO-08/09 · detail in S1 design §2
* **Default:** (R-S1-1) the monolith-to-split upgrade backup is the **exact stored monolith bytes**, verified, pinned; (R-S1-2) every later snapshot is a single content-addressed **composite record in the existing monolith v2 format** containing core + preferences + tutor, so nothing is omitted by construction and the existing restore path works; (R-S1-3) a damaged slice is quarantined first and recorded as `omitted`; (R-S1-4) if the snapshot required by `reset`/`restoreFrom`/`startFresh` cannot be written and verified, the action is **refused** — a behaviour change (today `reset` proceeds without a snapshot).
* **Alternatives:** wait for the S3 bundle format; snapshots of the core only; keep proceeding without a snapshot.
* **Consequences:** results stay in the core in S1, so composite snapshots are as large as today's; S3 replaces the composite with the bundle.
* **Risks:** a learner cannot reset when storage is full (intended, with a message); composite format becomes legacy after S3.
* **Dependencies:** STO-01, STO-05, STO-18.
* **Owner approval:** required, **including the refusal behaviour**.
* **Acceptance:** no snapshot lacks preferences or tutor (or records the omission); restore reproduces the state; failed snapshot ⇒ nothing destroyed.
* **Tests:** snapshot contents; restore round trip; failing-store reset/restore/start-fresh.

### STO-18 — Timestamp model for preferences and tutor (S1)
* **State:** PROPOSED (new, S1 amendment) · **Source:** hidden dependency in STO-05/STO-11 · detail in S1 design §3
* **Default:** preferences record `{epoch, updatedAt}` (replaces core `settingsAt`, monotonic `max(now, previous+1)`); tutor record `{epoch, updatedAt, clearedAt}` and optional message `at` (strictly increasing; missing values synthesised once at upgrade from the monolith's own `updatedAt`); deterministic total orders; `clearTutor` propagates through `clearedAt`.
* **Alternatives:** keep "longer side wins" for the tutor (cannot represent clear); no timestamps (precedence undefined).
* **Consequences:** additive optional fields; the tutor's cross-tab behaviour changes (a clear is no longer undone by a stale tab).
* **Risks:** same-millisecond id collisions (both messages kept); local clock only, no cross-device trust.
* **Dependencies:** STO-01, STO-11.
* **Owner approval:** required.
* **Acceptance:** merge is idempotent, commutative, associative; clear propagates; upgrade synthesis is deterministic and never future-dated.
* **Tests:** property suite extension; two-tab clear/push scenarios; upgrade fixture with untimestamped messages.

---

## 2. Stage S4 — export, import, reset, undo, pruning offer

### STO-20 — Export scope
* **State:** PROPOSED · **Source:** original SD-02, review SD-02
* **Default:** progress (completions, mastery/SRS, saved words, mistakes, scores, daily, tests), the XP ledger, preferences, global stats; results optional; tutor optional (STO-23); never backups/quarantine (separate "download preserved data"), never account/subscription/Live/Marketplace data.
* **Alternatives:** progress only; everything including raw results by default.
* **Consequences:** defines the schema contents (STO-24).
* **Risks:** plaintext personal data.
* **Dependencies:** STO-21, STO-22, STO-23, STO-03.
* **Owner approval:** required.
* **Acceptance:** export → reset → import reproduces identical XP, completions, mastery, saved, daily, tests, preferences.
* **Tests:** round trip; schema test "no account/device fields".

### STO-21 — Achievements: computed or persisted?
* **State:** OPEN · **Source:** validation R-1 / A-1
* **Default:** **none can be recommended without a product decision.** Facts: badges are computed. (a) keep computed and export them as a read-only informational list; (b) persist unlocks as `{id, earnedAt, courseId|null}`, union-merged, never removed, seeded at migration from the badges currently satisfied, kept by reset.
* **Alternatives:** (a) or (b).
* **Consequences:** (b) adds data, a seeding rule, merge, export/import and reset semantics; (a) means a course reset removes course-derived badges.
* **Risks:** (b) grandfathers today's quirky "streak3" rule (any three active days).
* **Dependencies:** STO-03, STO-27.
* **Owner approval:** required — and it is blocking for STO-20 and STO-27 wording.
* **Acceptance:** whichever is chosen is stated in the UI copy and tested.
* **Tests:** (a) export lists derived badges, import ignores them; (b) unlock persists across reset/import, never removed, merged by union.

### STO-22 — Display name in an export
* **State:** OPEN (orphan O-6) · **Source:** original §4.1
* **Default:** included by default with an opt-out checkbox (it is personal data, 05 §10).
* **Alternatives:** excluded by default; always excluded.
* **Consequences:** import restores or leaves the name.
* **Risks:** accidental sharing of the file.
* **Dependencies:** STO-20.
* **Owner approval:** required (privacy stance).
* **Acceptance:** option honoured both ways.
* **Tests:** export with/without; import leaves the current name when absent.

### STO-23 — Tutor transcript in an export
* **State:** PROPOSED · **Source:** review SD-02 ("tutor optional"), 05 §10
* **Default:** optional checkbox, **default off**, clearly labelled; included transcript is imported only when present.
* **Alternatives:** never export it; always export it.
* **Consequences:** free text may contain personal data.
* **Risks:** privacy.
* **Dependencies:** STO-20, STO-29.
* **Owner approval:** required.
* **Acceptance:** absent unless ticked; identical when present.
* **Tests:** both paths; import without a tutor section leaves the current transcript.

### STO-24 — Export format, versioning and integrity
* **State:** PROPOSED · **Source:** original §4.1, validation §7
* **Default:** envelope `bilup-learner-export` with `exportVersion`, `courseId`, `sections`, `counts`, `integrity` (corruption detection, **not** tamper protection) and `data`; higher version rejected, lower upgraded by pure functions; `exportVersion` does not change when ids change in P2 (STO-61).
* **Alternatives:** raw dump of stored records.
* **Consequences:** long-lived contract.
* **Risks:** users edit files (client data is untrusted).
* **Dependencies:** STO-20…STO-23.
* **Owner approval:** required.
* **Acceptance:** each validation stage rejects its class of defect; round trip.
* **Tests:** per-stage negative fixtures; flipped-byte test.

### STO-25 — Import is replace-only, with a mandatory verified backup
* **State:** PROPOSED · **Source:** original SD-03, review SD-03
* **Default:** validate all → preview → verified `undo` bundle (refuse if impossible) → write core (epoch+1) → global → preferences → optional slices; sections absent from the file leave the current record untouched; importing an older export over newer progress warns but is allowed; other `courseId` rejected.
* **Alternatives:** merge (technically supported by the tested merge algebra, but its product meaning belongs to P8 sync); ask each time.
* **Consequences:** a deliberate replacement: epoch bump, drift re-baseline (STO-10).
* **Risks:** data loss by mis-click (preview + undo mitigate); partial application after a crash (STO-07 table).
* **Dependencies:** STO-24, STO-26, STO-32, STO-33, STO-35, STO-10.
* **Owner approval:** required.
* **Acceptance:** invalid files write nothing; success is undoable to identical bytes.
* **Tests:** negative fixtures; backup-unavailable refusal; crash after core write; other-tab adoption.

### STO-26 — Import strictness
* **State:** OPEN (orphan O-1) · **Source:** original SD-04 (renumbered)
* **Default:** reject structural/version/integrity/course problems; repair field-level problems with the same sanitizers as stored records and show them in the preview.
* **Alternatives:** reject any defect; accept and repair everything.
* **Consequences:** decides UX for slightly damaged files.
* **Risks:** repairs hide corruption (shown in the preview).
* **Dependencies:** STO-24.
* **Owner approval:** required.
* **Acceptance:** classes of defect map to reject/repair exactly as decided.
* **Tests:** fixture per class.

### STO-27 — Course-scoped reset boundaries
* **State:** PROPOSED · **Source:** original §4.3, review SD-04
* **Default:** erase the course's ledger, completions, mastery/SRS, saved words, mistakes, scores, daily results, test history, tombstones, summaries and results buffer; keep preferences, global stats (STO-28), other courses, `v1`, backups, quarantine; take an undo snapshot first; list "will be erased / will be kept" in three languages.
* **Alternatives:** reset = erase everything of that course including the tutor (STO-29).
* **Consequences:** XP restarts at 0 for that course; items can be earned again; derived badges follow STO-21.
* **Risks:** hidden loss of course-derived badges; stale-shell resurrection (STO-10).
* **Dependencies:** STO-03, STO-10, STO-21, STO-28, STO-29, STO-30, STO-32.
* **Owner approval:** required.
* **Acceptance:** the diff of all `bilup-deutsch:*` keys before/after equals exactly the declared erase list; another course untouched.
* **Tests:** key-diff test; two-course fixture; stale-shell write after reset ignored; other tab adopts the epoch.

### STO-28 — Learner-global data under a course reset
* **State:** OPEN (orphan O-3) · **Source:** original SD-09 (renumbered), 05 §3
* **Default:** active days and study time are kept (05 §3: streak is learner-global).
* **Alternatives:** reset them with the course; keep active days, reset study time.
* **Consequences:** requires STO-03 (they currently live in the course record).
* **Risks:** inconsistent "streak" semantics if kept while badges reset.
* **Dependencies:** STO-03.
* **Owner approval:** required (also the open product question "streak scope", 05 §13).
* **Acceptance:** chosen behaviour holds after reset and after import.
* **Tests:** reset keeps/erases per decision.

### STO-29 — Tutor transcript under a course reset
* **State:** OPEN · **Source:** validation R-5
* **Default:** reset **keeps** the tutor (it has its own "clear" control; snapshotting it would cost up to 234 KB).
* **Alternatives:** erase it with the course (then it is not restorable unless snapshots include it — STO-09).
* **Consequences:** decides Undo's completeness and privacy.
* **Risks:** learner expects reset to remove conversations.
* **Dependencies:** STO-09, STO-23.
* **Owner approval:** required.
* **Acceptance:** dialog lists the tutor under "kept" or "erased"; Undo behaves accordingly.
* **Tests:** reset + undo with transcript present.

### STO-30 — Global XP presentation after a course reset
* **State:** OPEN · **Source:** validation R-2 / A-2
* **Default:** no stored global XP exists; any aggregate is derived and falls when a course is reset — say so in the dialog.
* **Alternatives:** persist a lifetime XP counter (new data, new merge rules).
* **Consequences:** wording only vs new data.
* **Risks:** confusing totals.
* **Dependencies:** STO-27.
* **Owner approval:** required.
* **Acceptance:** UI copy states the effect.
* **Tests:** copy present in all three languages; aggregate after reset.

### STO-31 — "Erase everything" scope (including legacy `v1`, backups, quarantine)
* **State:** OPEN (orphan O-2) · **Source:** original SD-07, validation R-10
* **Default:** none can be recommended without a legal view: erasure expectations conflict with "never delete legacy data". If offered: final export prompt + typed confirmation; legacy `v1` only with a separate explicit choice.
* **Alternatives:** erase current data only (keep `v1`, backups, quarantine); do not offer this action in P1.
* **Consequences:** decides whether the app ever deletes `v1`.
* **Risks:** irreversible loss; legal exposure either way.
* **Dependencies:** STO-12, STO-33.
* **Owner approval:** required (with legal/data-protection input).
* **Acceptance:** exactly the declared set is removed.
* **Tests:** key-diff; typed-confirmation flow; export offered first.

### STO-32 — Undo window length and cap
* **State:** PROPOSED · **Source:** review SD-05 ("30 days, subject to feasibility"), original SD-08, validation §9.4
* **Default:** 30 days **or** at most 3 `undo` snapshots, whichever comes first; progress-only (core + preferences + global).
* **Alternatives:** two rotating snapshots without a time limit (today); unlimited within quota.
* **Consequences:** 3 × ≈ 100 KB ≈ 0.3 MB (feasible); with results + tutor ≈ 2–2.7 MB (not recommended).
* **Risks:** learner assumes full restore; retention of data the learner asked to erase.
* **Dependencies:** STO-09, STO-33, STO-14.
* **Owner approval:** required.
* **Acceptance:** expiry and cap enforced; newest snapshot never expired unseen.
* **Tests:** fake-clock expiry; cap; undo byte-identical.

### STO-33 — Undo snapshot size, retention, expiry, clock and privacy rules
* **State:** OPEN · **Source:** validation §3.2, §9
* **Default:** evaluated at load (no timers); a clock moved backwards never extends or shortens retention silently (expire only on forward time); "Delete undo copy now" control; purged by "erase everything"; eviction order in STO-14.
* **Alternatives:** no expiry; manual deletion only.
* **Consequences:** defines when learner-erased data disappears.
* **Risks:** clock manipulation; keeping erased data longer than the learner expects.
* **Dependencies:** STO-14, STO-31, STO-32.
* **Owner approval:** required.
* **Acceptance:** wording and behaviour match; deletion control works.
* **Tests:** fake-clock matrix incl. backwards clock; privacy test after erase-everything.

### STO-34 — Export-before-prune offer
* **State:** PROPOSED · **Source:** review SD-06, original SD-05/§4.4, 05 §4.4
* **Default:** offer **once**, before the first archival; non-blocking; content = the results about to be archived; decline allowed and recorded; declining **never blocks pruning**; the offer must have been *shown* once, else pruning waits until the next session; quota pressure prunes immediately.
* **Alternatives:** offer every time; block until answered; no offer.
* **Consequences:** later batches are not offered.
* **Risks:** learners misunderstand "summarised".
* **Dependencies:** STO-15, STO-16, STO-24.
* **Owner approval:** required (wording, the "shown once" rule).
* **Acceptance:** exactly one offer; decline respected; accepted export valid.
* **Tests:** one-time offer; decline persisted; pressure override; totals unchanged.

### STO-35 — Concurrency guard for destructive operations
* **State:** PROPOSED · **Source:** validation §5
* **Default:** exclusive lock (`navigator.locks`) where available; otherwise abort if the core epoch changed since the operation began; other tabs adopt the higher epoch.
* **Alternatives:** none (last writer wins).
* **Consequences:** a tab's unsaved work since its last save is dropped on adoption, with a notice.
* **Risks:** Web Locks availability differs per engine.
* **Dependencies:** STO-04.
* **Owner approval:** required.
* **Acceptance:** two simultaneous destructive operations cannot both complete.
* **Tests:** Playwright two-page race (lock path and CAS path).

---

## 3. Stage S5 — assisted attempts and XP policy

### STO-40 — Speaking hints fill the answer field and never submit
* **State:** PROPOSED · **Source:** review SD-07, original §5.2
* **Default:** a hint tap pre-fills (or plays) and does not call the answer path; `SpeakInput` gets a controlled value.
* **Alternatives:** keep submit-on-tap and mark it assisted.
* **Consequences:** behaviour change in `SpeakingLab`; topic/daily flows already view-only.
* **Risks:** pedagogy/UX change.
* **Dependencies:** STO-41.
* **Owner approval:** required.
* **Acceptance:** no answer is recorded before the learner submits.
* **Tests:** hint tap does not submit; editable field.

### STO-41 — Assisted-attempt representation
* **State:** PROPOSED · **Source:** original §5.2
* **Default:** optional `assist: 'none'|'hint-viewed'|'hint-repeated'|'solution-shown'` per item; result `assisted` derived (`hint-repeated` or `solution-shown`); no hint/utterance text stored.
* **Alternatives:** result-level flag only.
* **Consequences:** additive field; old results valid.
* **Risks:** none for stored data (optional).
* **Dependencies:** STO-40, STO-43.
* **Owner approval:** required.
* **Acceptance:** stored results carry only `itemRef`, `outcome`, `assist`.
* **Tests:** field validation; old results still load.

### STO-42 — Assisted XP factor
* **State:** OPEN (orphan O-4) · **Source:** original SD-06
* **Default:** 0.5 proposed; shipped value is currently 1 for every kind.
* **Alternatives:** other values; no reduction (0 = no credit).
* **Consequences:** applies to item credit and bonuses.
* **Risks:** pedagogy.
* **Dependencies:** STO-43.
* **Owner approval:** required (pedagogy owner).
* **Acceptance:** factor read from policy; no literal in code paths.
* **Tests:** table-driven per kind.

### STO-43 — XP policy consistency for assisted attempts
* **State:** OPEN · **Source:** engine behaviour (`recordResult`), original §5.2 rules 3–4
* **Default (documented behaviour, owner to confirm):** the factor scales item credit **and** the completion bonus; assisted turns count in `possible` but add 0 to `earned`; participation-based activities still complete; a later unassisted attempt **tops the credit up** to the full amount (ledger semantics).
* **Alternatives:** cap credit at the assisted amount for that item; deny top-up; deny completion when assisted.
* **Consequences:** decides whether assisting is a permanent XP discount or temporary.
* **Risks:** the top-up lets a learner reach full XP after a first assisted pass (intended by the ledger design).
* **Dependencies:** STO-42.
* **Owner approval:** required.
* **Acceptance:** one written rule, one test per sentence.
* **Tests:** assisted then unassisted sequence; bonus scaling; score exclusion.

### STO-44 — Detection of hint repetition
* **State:** OPEN · **Source:** original §5.2 rule 2
* **Default:** normalised equality with a hint/sample; for speech, compare the recognised text.
* **Alternatives:** fuzzy similarity; learner self-declaration.
* **Consequences:** recognition errors can mislabel; a typo bypasses the flag (heuristic evidence).
* **Risks:** fairness of scoring.
* **Dependencies:** STO-41.
* **Owner approval:** required.
* **Acceptance:** documented threshold and fixtures.
* **Tests:** typed, spoken-mock, edited-text cases.

---

## 4. Stage S6 — Playwright and browser validation

### STO-50 — Adopt Playwright (dev dependency, CI job)
* **State:** PROPOSED · **Source:** review SD-09
* **Default:** Playwright on Chromium/WebKit/Firefox; two pages in one context for real `storage` events.
* **Alternatives:** manual only; another runner.
* **Consequences:** new dev dependency, browser downloads, CI minutes.
* **Risks:** flakiness; WebKit ≠ iOS Safari.
* **Dependencies:** STO-51.
* **Owner approval:** required (dependency/infrastructure).
* **Acceptance:** jobs listed in the gate exist and are green.
* **Tests:** the suites themselves.

### STO-51 — Device lab and manual checklist ownership
* **State:** OPEN · **Source:** G0 decision Q14
* **Default:** iOS Safari (normal/private/home-screen), Android Chrome low storage, desktop two windows, real offline; results recorded in the release checklist.
* **Alternatives:** cloud device farm.
* **Consequences:** needed for quota/eviction facts.
* **Risks:** no devices ⇒ unverified storage claims.
* **Dependencies:** none.
* **Owner approval:** required (budget/people).
* **Acceptance:** named owner and device list.
* **Tests:** manual log attached.

### STO-52 — Real-browser measurements before budgets are frozen
* **State:** PROPOSED · **Source:** validation §9.2 (M1–M9)
* **Default:** run M1–M9 before S1 freezes the numbers in STO-02/STO-14.
* **Alternatives:** freeze on estimates.
* **Consequences:** budgets become facts.
* **Risks:** none beyond schedule.
* **Dependencies:** STO-50, STO-51.
* **Owner approval:** required (schedule).
* **Acceptance:** measurement report attached to the gate.
* **Tests:** scripts committed with the report.

### STO-53 — Stale-deployment fixtures
* **State:** PROPOSED · **Source:** original §7
* **Default:** build the pre-P1 app from git `386c6a1` as the "stale shell"; serve both builds; keep an old tab open across a deploy.
* **Alternatives:** hand-written v1 writes (already covered at unit level).
* **Consequences:** exercises the real service-worker update path.
* **Risks:** build reproducibility.
* **Dependencies:** STO-50.
* **Owner approval:** engineering.
* **Acceptance:** stale-shell write merged exactly once in a real browser.
* **Tests:** the journey.

---

## 5. P2 / later

### STO-60 — Opaque ActivityRef ids with `legacyId` alias resolution
* **State:** PROPOSED · **Source:** review SD-08, original §6
* **Default:** canonical manifest ids; alias table resolves old keys at lookup; stored history is not rewritten.
* **Alternatives:** rewrite ledger keys at P2 (violates "history is not rewritten").
* **Consequences:** no storage migration at P2.
* **Risks:** alias collisions; unresolved keys.
* **Dependencies:** P2 manifests.
* **Owner approval:** approval to carry legacy keys indefinitely.
* **Acceptance:** heavy P1 fixture loads under a manifest with identical XP/completion/credit.
* **Tests:** id-stability; alias round trip.

### STO-61 — Exports and snapshots written before P2 stay importable
* **State:** PROPOSED · **Source:** validation SD-08 caution
* **Default:** alias table retained for the life of the format; `exportVersion` unchanged by id changes.
* **Alternatives:** versioned breaking change with a converter.
* **Consequences:** the alias table is permanent.
* **Risks:** growth.
* **Dependencies:** STO-24, STO-60.
* **Owner approval:** required.
* **Acceptance:** a pre-P2 export imports after P2.
* **Tests:** fixture import after alias activation.

---

## 5b. Stage S2 — raw results record (proposed 5 Nov 2026; design only)

> S1 (STO-01, 02, 04, 05, 06, 07, 11, 17, 18) was authorised by the owner on 5 Nov 2026 and is **implemented and verified** (see the S1 reports). Their states in the entries above are historical (PROPOSED at the time); the authoritative record is the owner's authorisation and the S1 implementation/verification reports. STO-13 remains CONFIRMED. **Every S2 decision below is PROPOSED or OPEN; none is approved.**

### STO-70 — Raw results live in a dedicated, independently versioned record (Option A)
* **State:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026)** — architecture approval only; **not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md)
* **Amended 5 Nov 2026 (documentation consistency review):** The `epoch` field of the results record is **informational**; STO-90 exemptions apply (design §11 N1–N3). Earlier "same epoch rules as S1" wording is superseded.
* **Amended 5 Nov 2026 (STO-71 confirmed):** Option A remains the container, now as the learner's **history store** (not a bounded audit buffer); the storage tier (localStorage record vs IndexedDB) becomes a measured decision (STO-86); no segmented log without measured need.
* **Exact question:** Should the bounded raw-results buffer move out of the course record into its own epoch-stamped record, with the in-memory shape unchanged?
* **Recommended default:** Yes: `bilup-deutsch:results:de-general`, `{record:"results", v:1, epoch, updatedAt, results[]}`, same pattern as the S1 slices; a fourth group in merge/compose.
* **Alternatives:** B append-only segmented log (lower bytes per result, much more machinery, unmeasured benefit); C no raw persistence (STO-71); keep in the core.
* **Consequences:** Course record shrinks by ≈ 78–84 % at the heavy profile (historical synthetic figure); corrupt/oversized results no longer endanger the core; bytes written per result are about unchanged.
* **Risks:** More cross-key windows (handled by STO-74); regressions in verified paths.
* **Dependencies:** STO-72, 74, 75, 78; S1 complete.
* **Acceptance criteria:** Core record contains no raw results; all 12 invariants of the design hold; existing XP/mastery suites unchanged.
* **Required owner approval:** **given 5 Nov 2026 (architecture only). Implementation authorisation is separate and NOT given.**

### STO-71 — Is raw per-result history required product data?
* **State:** **OWNER-CONFIRMED PRODUCT REQUIREMENT (5 Nov 2026)** — confirmed statement only; it approves no architecture and authorises no code · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md)
* **Exact question:** Must the app keep per-result history (items, outcomes, timings) beyond the per-day summaries, for audit, support, backend sync or future features?
* **Recommended default:** No default can be recommended without a product statement. Engineering evidence: **no screen reads raw results** and XP/mastery/completion never depend on them; they only feed summaries and the daily-cap repeat rule.
* **Alternatives:** (A) keep raw results (needed for sync/audit); (C) persist only summaries + tombstones and stop writing raw results (smallest, safest; destructive for existing buffers; contradicts 05 §4.4 intent).
* **Consequences:** Decides whether STO-70 is needed at all. C would remove the largest record and most of S2.
* **Risks:** Choosing C later is irreversible for already pruned data; choosing A costs complexity for data nobody reads today.
* **Dependencies:** Backend-sync and analytics plans (P8+).
* **Acceptance criteria:** Recorded decision with rationale.
* **Owner confirmation (5 Nov 2026):** *"BilUp Til must provide learners with a full user-visible history of their learning attempts, including answers, mistakes and exercise results."* Recorded as the product requirement for STO-71. Consequences: raw attempt data is product data and is **never discarded automatically**; Option C is **rejected as a product direction**; the design is updated in `STORAGE_S2_RESULTS_DESIGN.md` §7. Field audit: most answer/feedback fields are **not captured today** (see §7.2) — capture is a separate stage (STO-82).
* **Required owner approval:** the requirement is confirmed; **no further approval of STO-71 itself**, but STO-70/74/76/79/80 and STO-82…87 below remain open.

### STO-72 — What stays in the course record
* **State:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026)** — architecture approval only; **not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md)
* **Exact question:** Which parts of the activity state must remain in the core so that losing the results record can never change rewards?
* **Recommended default:** Tombstones (idempotency), per-day summaries, completions, credit ledger/XP, and the **reserved (inactive)** prune watermark `prunedThrough`.
* **Alternatives:** Move tombstones with the raw results (smaller core, but replay protection would depend on a droppable record — rejected).
* **Consequences:** Core keeps ≈ the non-buffer 16–22 % plus tombstones/summaries (historical figures: tombstones ≈ 35 KB, summaries small).
* **Risks:** Core still grows with tombstones (400-day retention, STO-15).
* **Dependencies:** STO-70.
* **Acceptance criteria:** Results record deleted/damaged ⇒ ledger, XP, completions byte-identical; replay still a no-op.
* **Required owner approval:** **given 5 Nov 2026 (architecture only). Implementation authorisation is separate and NOT given.**

### STO-73 — Layout marker 2, old builds read-only, rollback is an explicit restore
* **State:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026)** — architecture approval only; **not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md)
* **Exact question:** Is bumping `layout` to 2 (S1 builds go read-only) the version mechanism, and is rollback an explicit restore of the pinned pre-S2 backup rather than an automatic downgrade?
* **Recommended default:** Yes. `schemaVersion` stays 2; `LAYOUT = 2`; builds with a smaller `LAYOUT` are read-only and write nothing.
* **Alternatives:** `schemaVersion` 3; dual-write window; keep `layout` 1 with an extra field (older builds would silently drop it — rejected).
* **Consequences:** An S1 build/tab cannot save after the upgrade; rollback loses data recorded after the upgrade unless the learner/operator accepts that.
* **Risks:** Learners on an old cached shell see the "newer version" notice (development profiles only, STO-13).
* **Dependencies:** STO-04 (approved, implemented).
* **Acceptance criteria:** Old-build read-only test with zero writes; documented rollback dialog text.
* **Required owner approval:** **given 5 Nov 2026 (architecture only). Implementation authorisation is separate and NOT given.**

### STO-74 — Crash-safe pruning: watermark + direction-based write ordering
* **State:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026)** — architecture approval only; **not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md)
* **Owner decision C4 (5 Nov 2026, ACCEPTED WITH CONDITIONS; design §13.12; not an approval, not an authorisation): Results folding is disabled; the existing tombstone expiry (≥ 400 days) is kept UNCHANGED; XP credit rules and the Core ledger/reward authority are unchanged; historical Results are never deleted or pruned; entries older than the tombstone window are never labelled uncredited.**
* **Owner acceptance 5 Nov 2026 (scope restriction: reserved watermark design only; in S2 no pruning, folding, automatic removal or deletion; watermark and related fields inactive for deletion purposes — design §13.9) — [ACCEPTED] scope/condition decision; architecture approval given 5 Nov 2026; no implementation authorisation.**
* **Amended 5 Nov 2026 (STO-71 confirmed):** The watermark/ordering mechanism is kept **only for approved deletion** (user-initiated or policy). **No automatic pruning**; the 500/90-day rule is not applied automatically.
* **Exact question:** May pruning use a single watermark `prunedThrough` (order key of the newest folded result) and write additions before the core, removals after it? (Supersedes the detail of STO-16.)
* **Recommended default:** Yes — additions-before-core write ordering is implemented; the watermark and removal-after-core ordering are **reserved/inactive in S2** (optional `prunedThrough`: validated, preserved, merged by max, never written with a value; no code path reads it; no pruning, folding or removal).
* **Alternatives:** Keep an id set of summarised results (unbounded); keep results and summaries in one record (defeats S2); accept the latent double count.
* **Consequences:** Fixes the existing latent double count in summaries; no XP effect.
* **Risks:** A bug here silently corrupts statistics (not rewards); tie to order key requires stable `(finishedAt, resultId)` ordering.
* **Dependencies:** STO-15, STO-16, STO-70.
* **Acceptance criteria:** Crash between prune writes never folds twice nor loses both copies; two-tab prune never exceeds single-tab totals.
* **Required owner approval:** **given 5 Nov 2026 (architecture only). Implementation authorisation is separate and NOT given.**

### STO-75 — Results record absent, damaged or from a newer version (never "stale" by core epoch — STO-90)
* **State:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026)** — architecture approval only; **not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md)
* **Amended 5 Nov 2026 (documentation consistency review):** A results record is **never** stale or anomalous because of the core epoch; only absent, damaged or newer-version records are special (design §11 N1).
* **Exact question:** What does the app do when the results record cannot be used?
* **Recommended default:** Empty buffer in memory, exact bytes quarantined first, low-priority notice, core untouched; a newer-version record is never rewritten. Engine effects only under-credit (repeat daily-cap), never over-credit.
* **Alternatives:** Treat as core damage (recovery screen); block recording.
* **Consequences:** Learning continues; the repeat-credit rule may grant less for one session.
* **Risks:** Learner sees a notice for data nobody reads in the UI.
* **Dependencies:** STO-70, S1 slice rules.
* **Acceptance criteria:** Corruption matrix passes; core bytes identical.
* **Required owner approval:** **given 5 Nov 2026 (architecture only). Implementation authorisation is separate and NOT given.**

### STO-76 — Composite snapshots and the results buffer in S2
* **State:** **OWNER-CONFIRMED SNAPSHOT REQUIREMENT (5 Nov 2026)** — confirmed statement only; no architecture approved · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md)
* **Amended 5 Nov 2026 (STO-71 confirmed):** History can be large; including it in every composite snapshot may be impractical, but excluding it makes a restore lose history. Must be decided together with STO-84/85/86.
* **Exact question:** Do the interim composite snapshots (STO-17) include the raw results until the S3 bundle exists?
* **Recommended default:** Include them (nothing omitted, consistent with their summaries/watermark); S3 decides exclusion with a visible omission.
* **Alternatives:** Exclude now (smaller snapshots, but restoring loses audit data and must be disclosed).
* **Consequences:** Snapshot size stays as large as today.
* **Risks:** Quota pressure from large snapshots until S3.
* **Dependencies:** STO-17, STO-08/09 (S3), STO-14.
* **Acceptance criteria:** Snapshot/restore round trip yields identical summaries, watermark and buffer.
* **Required owner approval:** Required.

* **Owner confirmation (5 Nov 2026):** *"Composite safety snapshots must NOT include the full learning-attempt history."* Recorded as the snapshot requirement for STO-76. Supersedes the earlier default ("include"). Exact snapshot contents, `omitted:['history']` marker and recovery semantics: design §9. It does **not** protect history; deletion safety is STO-89.

### STO-77 — Cross-tab merge rule for results and summaries
* **State:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026)** — architecture approval only; **not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md)
* **Owner decision C4 (5 Nov 2026, ACCEPTED WITH CONDITIONS; design §13.12; not an approval, not an authorisation): Results folding is disabled; the existing tombstone expiry (≥ 400 days) is kept UNCHANGED; XP credit rules and the Core ledger/reward authority are unchanged; historical Results are never deleted or pruned; entries older than the tombstone window are never labelled uncredited.**
* **Owner acceptance 5 Nov 2026 (scope restriction: results union by resultId and documented merge only; no pruning/folding/removal in S2; current summary behaviour preserved, no new folding — design §13.9) — [ACCEPTED] scope/condition decision; architecture approval given 5 Nov 2026; no implementation authorisation.**
* **Exact question:** How are the results and summaries of two tabs reconciled?
* **Recommended default:** Union of results by `resultId`; `deletions`/`prunedThrough` are merged by max but are **inactive** in S2; existing summaries keep their current per-field-max merge; **nothing is dropped, folded or removed**.
* **Alternatives:** Per-field max with no watermark (current, overcounts); last-writer-wins.
* **Consequences:** Statistics may be slightly low after concurrent pruning.
* **Risks:** Visible only in per-day statistics.
* **Dependencies:** STO-74, STO-11.
* **Acceptance criteria:** Property tests (idempotent/commutative/associative on the raw union; summaries never above single-writer totals).
* **Required owner approval:** **given 5 Nov 2026 (architecture only). Implementation authorisation is separate and NOT given.**

### STO-78 — S1 → S2 migration procedure and compat mode
* **State:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026)** — architecture approval only; **not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md)
* **Owner decision C5 (5 Nov 2026, ACCEPTED WITH CONDITIONS; design §13.13; not an approval, not an authorisation): while in compatibility mode and the upgrade has not completed successfully, Reset, Start Fresh, Core Restore and Rollback are REFUSED completely (no partial execution) with a clear explanation that the upgrade must finish first; failed upgrades leave existing data intact; the operations become available after a successful upgrade; Results history is never overwritten or invalidated by compatibility-mode handling.**
* **Amended 5 Nov 2026 (documentation consistency review):** R2 stamps the epoch informationally; rollback/restore rules are design §11 N4 / migration §13 (R1 = core-only copy: restore Core only, preserve current preferences and tutor, merge R1 history, never lose Results).
* **Exact question:** Is the procedure R0–R4 (exact-bytes pinned backup, merge-write the results record, verify, then rewrite the core with `layout: 2` last; compat mode on failure) acceptable?
* **Recommended default:** Yes — see the migration plan; completion is claimed only by the final marker.
* **Alternatives:** Migrate lazily on first result; drop old results instead of migrating (destructive).
* **Consequences:** One extra backup (≈ the S1 core size) is pinned until S3 defines its lifecycle.
* **Risks:** Quota during the upgrade (≈ 2× transient); an unmeasured browser capacity.
* **Dependencies:** STO-70, 73, 14.
* **Acceptance criteria:** Crash/quota/lying-write matrix converges; ledger/progress byte-equal; rerun changes nothing.
* **Required owner approval:** **given 5 Nov 2026 (architecture only). Implementation authorisation is separate and NOT given.**

### STO-79 — Retention values, compaction and numeric budgets stay unfrozen
* **State:** OPEN · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md)
* **Amended 5 Nov 2026 (STO-71 confirmed):** Retention duration is part of this open decision and must be approved by the owner; numeric budgets wait for measurements.
* **Exact question:** May S2 ship with the current provisional retention (500 results / 90 days / 400-day tombstones) and no absolute size budget until browser measurements exist?
* **Recommended default:** Yes. Budgets are written only after S2-M1…M8 (and M1/M4 of the original set).
* **Alternatives:** Freeze now from synthetic data; shrink the buffer; compact items.
* **Consequences:** Cannot state a size guarantee yet; early-prune under quota remains a policy (STO-14).
* **Risks:** Heavy profiles remain large until measured.
* **Dependencies:** STO-14, STO-15, S6.
* **Acceptance criteria:** Measurement report attached before any number is adopted.
* **Required owner approval:** Required.

### STO-80 — Failure to append a raw result never blocks the credit
* **State:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026)** — architecture approval only; **not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md)
* **Owner acceptance 5 Nov 2026 (its dependencies STO-93…STO-99 are owner-accepted; STO-80 itself received the architecture approval on 5 Nov 2026) — [ACCEPTED] scope/condition decision; architecture approval given 5 Nov 2026; no implementation authorisation.**
* **Amended 5 Nov 2026 (documentation consistency review):** Results/Core outcome table (design §11 N3): XP is governed only by Core; a stale-core tab still appends its attempt to Results; a failed results write keeps the entry pending and retried.
* **Amended 5 Nov 2026 (STO-71 confirmed):** A history entry that cannot be written is **kept in memory and retried**, with a visible notice; older history is never deleted to make room. XP/credit are still saved.
* **Exact question:** If the results record cannot be written but the core can, is the result still credited?
* **Recommended default:** Yes — credit/tombstone/completion are saved; the raw entry for that result is lost, a low-priority notice is shown, and the next save retries. If the core cannot be written nothing is credited (unchanged).
* **Alternatives:** Refuse to credit when raw cannot be stored.
* **Consequences:** Learning is never blocked by an audit buffer.
* **Risks:** One missing audit entry (surfaced, not silent).
* **Dependencies:** STO-70, STO-74.
* **Acceptance criteria:** Quota-injection test: results write fails ⇒ XP saved, notice shown, no duplicate on retry.
* **Required owner approval:** **given 5 Nov 2026 (architecture only). Implementation authorisation is separate and NOT given.**

### STO-81 — Write-isolation acceptance for S2
* **State:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026)** — architecture approval only; **not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md)
* **Exact question:** Is the S2 acceptance requirement relative write isolation again (no frozen numbers)?
* **Recommended default:** Yes: a recorded result writes only the results record and the course record (order per STO-74); preference/tutor changes write only their own key; the course record contains no raw results; nothing writes `v1`.
* **Alternatives:** Absolute byte budgets (unsupported until measured).
* **Consequences:** Testable without browser data.
* **Risks:** None beyond deferring numbers.
* **Dependencies:** STO-79.
* **Acceptance criteria:** Recording-store assertions per action.
* **Required owner approval:** **given 5 Nov 2026 (architecture only). Implementation authorisation is separate and NOT given.**

### STO-82 — Attempt-history entry model and capture staging
* **State:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026)** — architecture approval only; **not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §7
* **Owner acceptance 5 Nov 2026 (accepted header fields with conditions: unknown optional fields survive sanitisation and rewrites; no missing historical field ever invented for migrated entries; compatibility tests — design §13.8) — [ACCEPTED] scope/condition decision; architecture approval given 5 Nov 2026; no implementation authorisation.**
* **Amended 5 Nov 2026 (documentation consistency review):** No "credited" flag is added to entries: whether an attempt's XP is part of the current progress is **derived from the Core tombstones** (design §11 N3).
* **Exact question:** Which fields does a stored attempt contain, and is capture implemented as a separate stage (S2b) after the storage stage (S2)?
* **Recommended default (as accepted, design §13.8):** S2 entries carry the existing fields (`resultId, activityId, kind, finishedAt, activeMs, assisted, score, passed, xp` informational, `items[]` with `itemRef`/`outcome`) plus optional `startedAt`, `levelId`, `evidence`, `entrySchema` (absent ⇒ 1); per-entry `courseId`, `completes`, `lang`, `contentRef`, item detail (`given, expected, promptSnap, concept, errorClass`) and **all free text** are **S2b**, not S2; legacy entries are never improved or invented. S2 captures and exposes no additional free-text data. **S2b = capture in features (separate approval)**; history UI later.
* **Alternatives:** Store only what exists today (no answers); capture and storage in one stage; store full exercise copies.
* **Consequences:** Without S2b the history cannot show answers/feedback; S2b touches every learning screen.
* **Risks:** Capture changes can regress learning flows; scope creep.
* **Dependencies:** STO-70, STO-83, STO-85.
* **Acceptance criteria:** Field table approved; legacy entries never fabricated; fixtures per kind (test strategy §6).
* **Required owner approval:** **given 5 Nov 2026 (architecture only). Implementation authorisation is separate and NOT given.**

### STO-83 — Content versioning and stable references for history
* **State:** OPEN · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §7
* **Exact question:** How do historical attempts stay interpretable when content changes: snapshot, versioned reference, or both?
* **Recommended default:** Compact snapshots (given, expected, prompt, concept) + references with `lang` for long feedback; `contentRef.version` once P2 manifests exist; no whole-exercise copies. **Finding:** authored exercise ids `ex###` come from a module-level counter and re-number when content is inserted/reordered, so references alone are unsafe until stable ids exist (also a risk for ledger keys, see SD-08/STO-60).
* **Alternatives:** Snapshot everything (large); references only (breaks on change); freeze content.
* **Consequences:** Decides entry size and whether stable-id work (P2) must precede history capture.
* **Risks:** History showing a different answer than the learner saw.
* **Dependencies:** STO-60, STO-82, P2 manifests.
* **Acceptance criteria:** Change/removal/renumbering/translation fixtures (test strategy §6).
* **Required owner approval:** Required.

### STO-84 — User-initiated history deletion and its effect on rewards and summaries
* **State:** **OWNER-CONFIRMED PRODUCT REQUIREMENT (5 Nov 2026)** — confirmed statement only; the technical mechanism is STO-88 (PROPOSED) · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §7
* **Exact question:** Can a learner delete one attempt, a course's history, or all history; and what does deletion do to summaries?
* **Recommended default:** Yes, with confirmation; deletion never changes XP, ledger, completions or tombstones; summaries policy (adjust or keep) decided here; goes through the watermark/ordering rules.
* **Alternatives:** No deletion in P1; automatic deletion by retention (STO-79).
* **Consequences:** Defines privacy controls; interacts with export-before-delete (S4).
* **Risks:** Accidental loss; inconsistent statistics.
* **Dependencies:** STO-74, STO-79, S4 export.
* **Acceptance criteria:** Deletion tests keep rewards identical and are crash-safe.
* **Required owner approval:** Required.

* **Owner confirmation (5 Nov 2026):** deleting detailed learning-attempt history must **not** change XP, the XP ledger, mastery, completed topics or achievements; only detailed attempt history is deleted; enforced architecturally. Recorded as the product requirement for STO-84; it approves no architecture and authorises no code. Technical consequences: STO-88 and design §8. Achievements stay computed, not persisted.

### STO-85 — Privacy and data minimisation of attempt history
* **State:** OPEN · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §7
* **Amended 5 Nov 2026 (STO-76 confirmed):** Snapshots exclude history (STO-76), which removes one privacy copy; the pinned migration backup R1 and S1-era snapshots still contain pre-S2 history and must be disclosed.
* **Exact question:** Is free text (writing, speaking transcripts, typed answers) stored by default or only on opt-in, with which length caps, and is it included in snapshots/exports?
* **Recommended default:** Opt-in or clearly disclosed default for free text; caps; excluded from composite snapshots only if STO-76 says so with a visible omission; export follows the optional-flag pattern.
* **Alternatives:** Store everything always; never store free text.
* **Consequences:** Personal data on the device in plaintext (as the tutor transcript today).
* **Risks:** Over-collection; learner surprise.
* **Dependencies:** STO-76, STO-82, 05 §10.
* **Acceptance criteria:** Behaviour and wording approved; tests per default.
* **Required owner approval:** Required (privacy stance).

### STO-86 — Storage tier for attempt history
* **State:** OPEN · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §7
* **Exact question:** Is a bounded-size localStorage record sufficient, or must detailed history move to IndexedDB (browser API, no dependency, async)?
* **Recommended default:** Decide **after** measurements S2-M1…M9 (capacity, latency, size per attempt). Until then design the history behind one narrow interface; S2 implements the localStorage record only if the owner accepts the measured limits.
* **Alternatives:** IndexedDB now (async adapter, different backup/quarantine/cross-tab semantics); segmented localStorage log.
* **Consequences:** IndexedDB changes the synchronous storage contract and the recovery guarantees; localStorage may hit the quota with thousands of detailed attempts.
* **Risks:** Wrong tier chosen on estimates.
* **Dependencies:** STO-79, S6 measurements.
* **Acceptance criteria:** Measurement report; the chosen tier passes the invariant matrix.
* **Required owner approval:** Required.

### STO-87 — Quota behaviour: never delete history automatically
* **State:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026)** — architecture approval only; **not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §7
* **Owner decision C4 (5 Nov 2026, ACCEPTED WITH CONDITIONS; design §13.12; not an approval, not an authorisation): Results folding is disabled; the existing tombstone expiry (≥ 400 days) is kept UNCHANGED; XP credit rules and the Core ledger/reward authority are unchanged; historical Results are never deleted or pruned; entries older than the tombstone window are never labelled uncredited.**
* **Exact question:** What happens when history cannot be saved because storage is full?
* **Recommended default:** History is never deleted to make room; the entry stays in memory for the session and is retried; a visible notice explains and (later, S4) offers export/delete; XP/credit still saved (STO-80); the earlier "prune earlier under quota" clause is withdrawn.
* **Alternatives:** Automatic early pruning into summaries (silent data loss — rejected by the owner requirement).
* **Consequences:** A full device stops recording history until the learner acts.
* **Risks:** History gaps while storage is full (surfaced).
* **Dependencies:** STO-14, STO-80, STO-84.
* **Acceptance criteria:** Quota-injection tests prove no entry is removed and nothing is credited twice.
* **Required owner approval:** **given 5 Nov 2026 (architecture only). Implementation authorisation is separate and NOT given.**

### STO-88 — History-deletion mechanism (scopes, marker, snapshot, no effect on progress)
* **State:** **ARCHITECTURE APPROVED by the owner (5 Nov 2026)** — architecture approval only; **not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §8
* **Amended 5 Nov 2026 (documentation consistency review):** Approving STO-88 **for S2** means approving only the reserved, preserved, never-written `deletions` field; the deletion operation and its tests are deferred (design §11 N6).
* **Amended 5 Nov 2026 (STO-76 confirmed):** The "verified safety snapshot" clause is **replaced** by a history-specific temporary backup (STO-89): a composite snapshot does not contain history and must not be presented as protecting it. The deletion **operation** is recommended to be **outside S2** (S2 only reserves an optional, preserved, never-written `deletions` field); the mechanism itself (one write on the results record, scopes, marker, progress untouched) is unchanged.
* **Exact question:** Is history deletion implemented as an operation that receives and returns only the results record, with per-course/all scopes, a deletion marker inside the results record, a verified safety snapshot and an explicit confirmation — so XP, ledger, tombstones, mastery, completion and (computed) achievements cannot change?
* **Recommended default:** Yes — design §8.2: one `setItem` (results key), marker `deletions{scope→throughKey}` merged by max, summaries and watermark untouched, snapshot required (ok:false ⇒ refuse), never triggered by quota.
* **Alternatives:** Delete by editing the whole core (no isolation); delete and also adjust summaries; per-attempt deletion only.
* **Consequences:** Progress is protected by construction, not convention; the daily-cap repeat rule may withhold (never add) credit after deletion; a safety snapshot retains deleted history for its retention period.
* **Risks:** Marker/clock edge cases; snapshot retention conflicts with the learner's intent to delete; pinned backups keep a copy.
* **Dependencies:** STO-70, 74, 76, 84, 85, 87, 17 (snapshot).
* **Acceptance criteria:** Test strategy §7 green; core bytes identical; mutations killed.
* **Required owner approval:** **given 5 Nov 2026 (architecture only). Implementation authorisation is separate and NOT given.**
### STO-89 — History-specific temporary backup (HB) for history deletion
* **State:** PROPOSED (applies to the later deletion stage, not S2) · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §9
* **Exact question:** Before deleting history, must the app write a separate, verified, exact-bytes backup of the scope being deleted, excluded from composite snapshots, and refuse the deletion if it cannot be written?
* **Recommended default:** Yes (Option A): `bilup-deutsch:history-backup:<course>:<ts>:<fp>`; not rotated with ordinary backups; confirmation discloses scope, counts, "progress not affected" and the retention period; explicit early purge needs a second confirmation.
* **Alternatives:** B no deletion until a recovery mechanism exists; C soft-delete "trash" inside the results record (same failure domain).
* **Consequences:** Deleted history stays recoverable for the approved period; a full device cannot free space by deleting (transient ≈ 2×).
* **Risks:** Quota; privacy (deleted data persists until expiry); a second key class to manage.
* **Dependencies:** STO-76, 84, 88, 91, 14, 87.
* **Acceptance criteria:** HB verified before deletion; deletion refused on HB failure; HB excluded from snapshots/rotation; crash matrix passes.
* **Required owner approval:** Required before the deletion stage (not required to start S2).
### STO-90 — Replacement operations (reset, start-fresh, core restore) and the results record
* **State:** **OWNER-CONFIRMED REQUIREMENT (5 Nov 2026)** — confirmed statement only; no architecture approved · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §9
* **Owner decision C5 (5 Nov 2026, ACCEPTED WITH CONDITIONS; design §13.13; not an approval, not an authorisation): while in compatibility mode and the upgrade has not completed successfully, Reset, Start Fresh, Core Restore and Rollback are REFUSED completely (no partial execution) with a clear explanation that the upgrade must finish first; failed upgrades leave existing data intact; the operations become available after a successful upgrade; Results history is never overwritten or invalidated by compatibility-mode handling.**
* **Exact question:** Must reset, start-fresh and core restore leave the detailed history untouched (exempt from the S1 epoch-invalidation rule), or may reset also delete history (after an HB)?
* **Recommended default:** Leave history untouched: replacement operations never delete history; history refers to XP not in the ledger is labelled; wiping history is the explicit, confirmed deletion.
* **Alternatives:** Reset deletes history after creating an HB (changes the meaning of the existing "reset progress" button); keep the S1 rule (silently deletes history — rejected).
* **Consequences:** Consistent with "never silently delete history"; a reset learner keeps old attempts.
* **Risks:** Orphan history may confuse (attempts whose XP was reset); the existing reset wording must say history is kept.
* **Dependencies:** STO-71, 76, 88, 89, STO-27/29/31 (S4).
* **Acceptance criteria:** Reset/start-fresh/restore tests: results record byte-identical; labelling shown.
* **Required owner approval:** Required (affects S2 behaviour).
* **Scope EXTENDED TO ROLLBACK by the owner (5 Nov 2026):** *"STO-90 explicitly includes Rollback. Reset, Start Fresh, Core Restore and Rollback must preserve the existing Results record. None of these operations may silently invalidate, overwrite, quarantine, empty or delete detailed attempt history."* (design §11 N8). Recorded as a confirmed requirement; it approves no architecture.
* **Owner confirmation (5 Nov 2026):** *"Reset, Start Fresh and Core Restore must not silently delete or invalidate the learner's detailed attempt history. The Results record remains independent of Core reset and restoration operations. History can only be deleted through an explicit, separately confirmed history-deletion operation. XP, mastery, completed topics, achievements and the XP ledger must remain unaffected by history deletion. No automatic history deletion is permitted."* Recorded as the requirement for STO-90. The recommended default ("leave history untouched") is now a requirement; the technical consequences (results record exempt from epoch invalidation, replacement operations never write it, rollback must not remove it, wording of the reset confirmation) are in design §10.

### STO-92 — Core-only restore sources keep the current preferences and tutor
* **State:** **OWNER APPROVED (5 Nov 2026)** — an intentional behaviour change from the current S1 implementation; dedicated migration, restore, rollback and regression tests are required in S2 (test strategy §11) · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §11 N4
* **Exact question:** When the restore source is a core-only copy (the pinned S1 migration backup R1, a layout-1/2 course record, quarantined core bytes), does the restore replace only the Core and keep the CURRENT preferences and tutor, instead of writing defaults?
* **Recommended default:** Yes — restore Core only, preserve current preferences and tutor (re-stamped), say so in the dialog, merge R1's history into Results, never claim to restore the complete S1 state.
* **Alternatives:** Restore the exact backed-up preferences/tutor (R1 does not contain them — impossible); write defaults (current S1 behaviour — silent loss of settings and chat, rejected).
* **Consequences:** Changes the behaviour of `restoreFrom` for core-only copies relative to current S1 code; needs implementation tests (S2 scope).
* **Risks:** The preserved preferences/tutor may not match the restored core's era (acceptable and disclosed).
* **Dependencies:** STO-17, STO-76, STO-78, STO-90.
* **Acceptance criteria:** core-only restore leaves preferences/tutor byte-equal; dialog text in ru/ky/de; mutation M-S2-18 killed.
* **Owner decision (5 Nov 2026):** *"When restoring a core-only backup, restore Core, preserve current Preferences and Tutor, and merge historical Results. Do not reset Preferences or Tutor to defaults merely because the backup does not contain them. This is an intentional behavior change from the current S1 implementation. Include dedicated migration, restore, rollback and regression tests in S2."*
* **Required owner approval:** **given (5 Nov 2026).**

### STO-91 — Retention duration of the temporary history backup
* **State:** OPEN — product decision · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §9
* **Exact question:** How long is the temporary history backup kept, and may the learner purge it earlier?
* **Recommended default:** No default proposed (keep OPEN); explicit early purge with a separate confirmation.
* **Alternatives:** Fixed number of days; until the next successful session; until the learner purges.
* **Consequences:** Longer retention = longer privacy exposure and quota use; shorter = less recoverability.
* **Risks:** Silent expiry would delete history — expiry must be visible and per the approved policy.
* **Dependencies:** STO-79, 85, 89.
* **Acceptance criteria:** Approved duration + fake-clock expiry tests (never evaluated by timers).
* **Required owner approval:** Required.
### STO-93 — Residual risk R3 accepted with conditions
* **State:** OWNER-ACCEPTED (5 Nov 2026) — a scope/condition decision: **not an architecture approval, not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §13
* **Exact question:** Does the owner accept losing unsaved in-memory work (pending history entries, unsaved XP) when storage stays unavailable and the session ends?
* **Recommended default (accepted):** Accept with conditions: persistent failure notice until the failure clears, explicit loss warning on closing/reloading, retry offered, best-effort flush, no durability claim; revisit after S4 export and P8 sync.
* **Alternatives:** Reject (needs a fallback store — second storage path / IndexedDB); sessionStorage queue.
* **Consequences:** Unavoidable, announced loss when storage is genuinely unusable.
* **Risks:** A learner who ignores the notice loses one session's unsaved work.
* **Dependencies:** STO-80, 94, 96, 97, 100.
* **Acceptance criteria:** Notice persistence/warning/retry tests; no durability claim in text.
* **Required owner approval:** Given as a scope/condition decision (5 Nov 2026); the separate architecture approval and the implementation authorisation are **still required** and **not given**.

### STO-94 — Notice dismissal scoped to a failure episode
* **State:** OWNER-ACCEPTED (5 Nov 2026) — a scope/condition decision: **not an architecture approval, not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §13
* **Exact question:** Is dismissal tied to a failure episode so that a new failure or kind transition re-arms the notice?
* **Recommended default (accepted):** Yes (design §13.2).
* **Alternatives:** Single boolean (S1 behaviour — hides later failures).
* **Consequences:** Small notice-state change; informational notices only (failure notices are persistent, STO-93/100).
* **Risks:** Notice fatigue.
* **Dependencies:** STO-93, 95, 96, 100.
* **Acceptance criteria:** Dismiss-then-fail tests; M-S2-27.
* **Required owner approval:** Given as a scope/condition decision (5 Nov 2026); the separate architecture approval and the implementation authorisation are **still required** and **not given**.

### STO-95 — Stale-epoch conflict notice
* **State:** OWNER-ACCEPTED (5 Nov 2026) — a scope/condition decision: **not an architecture approval, not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §13
* **Exact question:** Does a tab that adopts a replacement which discarded its unsaved credit show a notice that separates "kept in history" from "XP not part of current progress"?
* **Recommended default (accepted):** Yes; kind `replaced`; ru/ky/de; Kyrgyz native review before release.
* **Alternatives:** Silent adoption (S1 behaviour).
* **Consequences:** New notice kind and strings.
* **Risks:** Noise when the learner reset on purpose in another tab.
* **Dependencies:** STO-90, 94, 80.
* **Acceptance criteria:** Stale-core tab test; strings in three languages; M-S2-26/34.
* **Required owner approval:** Given as a scope/condition decision (5 Nov 2026); the separate architecture approval and the implementation authorisation are **still required** and **not given**.

### STO-96 — Uncapped in-memory pending history queue; history-readonly
* **State:** OWNER-ACCEPTED (5 Nov 2026) — a scope/condition decision: **not an architecture approval, not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §13
* **Exact question:** Are failed history writes kept in an uncapped in-memory queue with visible count and retry, with history-readonly behaviour for newer-version records?
* **Recommended default (accepted):** Yes; no entry silently discarded; session-memory limitation and memory growth documented.
* **Alternatives:** Capped queue (silent loss); sessionStorage/IndexedDB queue (rejected for S2).
* **Consequences:** Memory grows with pending entries (a few KB each).
* **Risks:** Lost on session end (STO-93).
* **Dependencies:** STO-80, 93, 75.
* **Acceptance criteria:** Queue/retry/newer-version tests; M-S2-24/30/35.
* **Required owner approval:** Given as a scope/condition decision (5 Nov 2026); the separate architecture approval and the implementation authorisation are **still required** and **not given**.

### STO-97 — Synchronous flush covers pending history and unsaved state
* **State:** OWNER-ACCEPTED (5 Nov 2026) — a scope/condition decision: **not an architecture approval, not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §13
* **Exact question:** Does the pagehide/visibility-hidden flush also run when there are no study seconds but pending history or unsaved state exists?
* **Recommended default (accepted):** Yes; best effort; limits documented; never throws.
* **Alternatives:** Keep the S1 `seconds > 0` condition.
* **Consequences:** Widens the S1 flush condition.
* **Risks:** No guarantee on crash/forced termination/unavailable storage.
* **Dependencies:** STO-93, 96.
* **Acceptance criteria:** Flush tests (a)(b)(c); M-S2-28.
* **Required owner approval:** Given as a scope/condition decision (5 Nov 2026); the separate architecture approval and the implementation authorisation are **still required** and **not given**.

### STO-98 — Core tombstones are the sole duplicate-credit authority
* **State:** OWNER-ACCEPTED (5 Nov 2026) — a scope/condition decision: **not an architecture approval, not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §13
* **Exact question:** Do Core tombstones alone decide duplicate credit, with history allowed only to support daily-cap eligibility and never to grant or deny first-time XP?
* **Recommended default (accepted):** Yes; the `results.some(resultId)` check is removed from `recordResult`; every credit passes through `award()` in the Core.
* **Alternatives:** Keep the results-buffer check (can block a legitimate credit when history has no tombstone).
* **Consequences:** One condition removed from the S1 engine.
* **Risks:** Regression in idempotency if tombstones were wrong — covered by tests.
* **Dependencies:** STO-72, 80, 90.
* **Acceptance criteria:** Duplicate/replay tests; M-S2-25/36.
* **Required owner approval:** Given as a scope/condition decision (5 Nov 2026); the separate architecture approval and the implementation authorisation are **still required** and **not given**.

### STO-99 — `entry.xp` informational; `creditStatus`
* **State:** OWNER-ACCEPTED (5 Nov 2026) — a scope/condition decision: **not an architecture approval, not an implementation authorisation** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §13
* **Exact question:** Is the stored XP informational only, with a creditStatus derived from Core tombstones that never labels entries older than the tombstone window as uncredited?
* **Recommended default (accepted):** Yes (design §13.7).
* **Alternatives:** Stored credited flag (second authority); label always from tombstones (wrong after 400 days).
* **Consequences:** No label for older entries.
* **Risks:** Learner sees no status for old entries.
* **Dependencies:** STO-72, 82, 98.
* **Acceptance criteria:** creditStatus tests; static test; M-S2-23/29.
* **Required owner approval:** Given as a scope/condition decision (5 Nov 2026); the separate architecture approval and the implementation authorisation are **still required** and **not given**.

### STO-100 — Persistence of failure-state notices vs episode-scoped dismissal
* **State:** **OWNER-CONFIRMED (5 Nov 2026) — a scope/condition decision: **not an architecture approval, not an implementation authorisation**** · **Detail:** [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §13
* **Exact question:** The owner required that the R3 notice "remain visible until the failure clears" (STO-93) and that dismissal be scoped to a failure episode (STO-94). Are failure-state notices (`save-failed`, `history-not-saved`, `history-readonly`) therefore NON-dismissible while the failure lasts, with episode-scoped dismissal applying only to informational notices?
* **Recommended default (accepted):** Yes — failure notices are persistent (no dismiss) and re-appear on every new episode; informational notices are dismissible per episode. If the owner prefers a minimisable-but-always-visible indicator, that is an alternative.
* **Alternatives:** Dismissible failure notices with episode re-arm (conflicts with the R3 wording); compact persistent indicator.
* **Consequences:** Consistent with both owner decisions.
* **Risks:** A persistent notice may annoy during a long outage (intended).
* **Dependencies:** STO-93, 94.
* **Acceptance criteria:** Notice tests per kind.
* **Required owner approval:** Required (interpretation to confirm).

* **Owner confirmation (5 Nov 2026):** the owner approved the reconciliation — failure notices (`save-failed`, `history-not-saved`, `history-readonly`) cannot be dismissed while the failure or unsaved condition persists; informational notices may be dismissed; informational dismissal is scoped to a failure/information episode (STO-94); a new episode or relevant transition makes the notice visible again. Recorded as owner-confirmed, **not** as an architecture approval.
* **Required owner approval:** given as a scope decision; the architecture approval and the implementation authorisation remain **not given**.

* **STO-83 / STO-85 deferral (5 Nov 2026):** both remain OPEN and may be deferred to S2b **provided S2 does not capture or expose additional free-text data** (design §13.11). S2 does **not capture or expose** any additional free-text data (submitted answers, expected answers, prompts, feedback text, writing/speaking text). S2 history entries contain only the fields of design §13.8; items carry only `itemRef` and `outcome`. STO-83 (content versioning) and STO-85 (privacy of free text) are therefore **deferrable to S2b**, where the capture they govern is designed.

---

## 6. Counts

76 decisions (STO-93…STO-100 recorded after the owner's acceptance of 5 Nov 2026 — OWNER-ACCEPTED scope decisions, not architecture approvals; STO-92 added by the documentation consistency review; STO-90 owner-confirmed 5 Nov 2026; STO-89…STO-91 after the STO-76 confirmation; STO-70…STO-81 added for S2 on 5 Nov 2026, STO-82…STO-87 after the STO-71 confirmation, STO-88 after the STO-84 confirmation; STO-17/18 by the S1 amendment) · S1 decisions (STO-01, 02, 04, 05, 06, 07, 11, 17, 18) authorised by the owner on 5 Nov 2026 and implemented · REJECTED 0 · CONFIRMED 1 (STO-13) · **S2 architecture approvals (owner, 5 Nov 2026): STO-92 and STO-70, 72, 73, 74, 75, 77, 78, 80, 81, 82, 87, 88 — architecture only, NOT an implementation authorisation**; STO-89 remains PROPOSED (deferred to a future history-deletion stage) — STO-71, STO-76, STO-84 and STO-90 (extended to Rollback) OWNER-CONFIRMED (requirements only); ARCHITECTURE-APPROVED STO-70, 72, 73, 74, 75, 77, 78, 80, 81, 82, 87, 88 (+ STO-92); PROPOSED STO-89; OWNER-ACCEPTED (scope/condition decisions) STO-93, 94, 95, 96, 97, 98, 99 (+ restrictions/conditions recorded on STO-74, 77, 82); OWNER-CONFIRMED (5 Nov 2026, not an approval) STO-100; OWNER-ACCEPTED WITH CONDITIONS C4 (results folding disabled, tombstone expiry unchanged — attached to STO-74/77/87) and C5 (replacement operations refused in compatibility mode — attached to STO-78/90); OPEN STO-79, 86 (browser measurements), STO-83, 85 (deferrable to S2b under the S2 free-text guard), STO-89, 91 (deferred to the future deletion stage) · **IMPL-AUTH: none** · other stages unchanged (OPEN: STO-09, 14, 15, 21, 22, 26, 28, 29, 30, 31, 33, 42, 43, 44, 51). The state written in each entry is authoritative.
