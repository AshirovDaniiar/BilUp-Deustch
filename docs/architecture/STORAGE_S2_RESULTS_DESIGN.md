# BilUp Til 2.0 — Storage S2: Raw Results Record (design)

**Date:** 5 November 2026 · **DESIGN ONLY** — no source, dependency, storage-format or data change. Nothing here is approved. S1 stays complete.
> **UPDATE 5 Nov 2026 — STO-71 is owner-confirmed:** *"BilUp Til must provide learners with a full user-visible history of their learning attempts, including answers, mistakes and exercise results."* This **supersedes** the premise of §1.2 finding 1 ("an audit buffer nobody reads") and **changes** §3.3 (pruning) and §3.6 (quota): raw attempt data is now **product data** and is never discarded automatically. See **§7** (history requirement, field audit, reassessed design). Where §1–§6 conflict with §7, §7 wins. It confirms the product requirement only; **no other S2 decision is approved.**
**Companions:** [`STORAGE_S2_MIGRATION_PLAN.md`](STORAGE_S2_MIGRATION_PLAN.md) · [`STORAGE_S2_TEST_STRATEGY.md`](STORAGE_S2_TEST_STRATEGY.md) · register decisions **STO-70…STO-81**.
**Read:** the S1 implementation and verification reports, S1 design, register, gate, original storage decisions, P1 completion report, and the **current source** (`src/storage/{activity,merge,persistence,slices,core}.ts`, `src/progress/engine.ts`, `src/app/store.tsx`, tests). Where an earlier document differs from the code, the code is used (see §1.3).

---

## 1. Audit of the current implementation

### 1.1 Read/write dependency map for raw results

| # | Location | Reads | Writes | Notes |
|---|---|---|---|---|
| 1 | `progress/engine.ts › recordResult` (pure) | `core.activity.results` (a) duplicate check `some(resultId)`, (b) "attempted before" count for the daily-cap repeat rule `results.filter(activityId)` | appends `stored`; calls `pruneActivity`; appends tombstone; updates `completions`, `credit`, `progress.xp/completed/activeDates` | The **only producer** of raw results. (a) is redundant with tombstones (every recorded result gets one). (b) is a **real consumer**: for policies with `completesSelf=false` and no `completes`, `completions[activityId]` never exists, so only the buffer remembers the activity was attempted. |
| 2 | `storage/activity.ts › pruneActivity / summarise` (pure) | the whole buffer | folds results older than 90 days **and** beyond the newest 500 into per-day `summaries`; drops tombstones older than 400 days | Called from `recordResult` and `mergeActivity`. Sorts by `(finishedAt, resultId)`. |
| 3 | `storage/activity.ts › sanitizeActivity / sanitizeResults` | stored `activity` | — | Validation on every read; drops invalid/duplicate entries (reported as issues). |
| 4 | `storage/merge.ts › mergeActivity / mergeSummaries` | both buffers, both summaries | union of results by `resultId`, tombstones union, **summaries merged by per-field `max`**, then `pruneActivity` | See §1.2 (latent double count). |
| 5 | `storage/persistence.ts › readRecord / serialize / serializeCore` | `value.activity` | `activity` inside the **course record** (layout 1 and monolith) | Results are part of the course record today (78–84 % of its bytes at the heavy profile, measured synthetic). |
| 6 | `persistence.ts › compose / pickGroups` (S1) | group "core" includes results | — | Cross-tab merges treat results as part of the core group. |
| 7 | `persistence.ts › writeChanged` | — | rewrites the whole course record when anything in it changes — **every recorded result rewrites the buffer** | Write amplification: each result costs one write of core+buffer (≈100 KB + up to ≈0.5 MB). |
| 8 | `persistence.ts › legacyCredit / coreFromLegacy / migrateLegacy / applyLegacyDrift` | — | create `emptyActivity()` (+ `migration` completions); drift builds `stale` core with empty activity | v1 has no raw results; nothing to migrate into the buffer. |
| 9 | `persistence.ts › preserveCurrent / snapshotComposite / restoreFrom / startFresh / rollbackToLegacy` | composite = `serialize(core)` ⇒ includes `activity.results` | restore commits a core containing them | Snapshots currently carry the buffer. |
| 10 | `persistence.ts › inspectCopies / evaluateRaw / recoverUnusableCurrent` | counts XP/completed only | — | Do not use results. |
| 11 | `app/store.tsx` | `coreRef`, `recordResult(...)` inside `setCore`; `saveProgress`/`syncFromStorage` | via `saveProgress` | No UI reads results. |
| 12 | Screens/features | **none** (`features/progress/stats.ts` derives from `completed/mastery/scores/daily/activeDates/xp`, not from results) | — | Confirmed by grep: no consumer outside storage/engine. |
| 13 | XP reconciliation (`credit.ts › reconcileXp`, `readRecord`) | credit ledger, **not** results | — | XP and reconciliation do **not** depend on raw results. |
| 14 | Quota/corruption | `ensureCopy` quarantine, `resolveSlices` (S1 slices only) | — | A damaged buffer today damages the whole course record (recovery flow). |
| 15 | Tests | `tests/progress/engine.test.ts`, `tests/storage/{app-wiring,cross-tab,merge,persistence}.test.*` | — | List in the test strategy. |

### 1.2 Findings that shape the design
1. **Raw results are almost write-only.** The only decisions that read them: the (redundant) duplicate check and the repeat-rule "attempted before" test. XP, mastery, completion and statistics never read them. They are an *audit buffer* feeding the permanent per-day summaries.
2. **Latent double count in summaries (existing, not S2-specific).** Tab A prunes result *r* into its summaries; tab B still holds *r* raw. `mergeActivity` unions the raw results (r returns) and takes `max` of summaries (which already include r), then `pruneActivity` folds r **again** → the day's `results/xp/…` counters are inflated. XP and the credit ledger are unaffected (statistics only). The fix is the prune **watermark** of §3.3.
3. **Pruning is atomic today and becomes a two-record window after the split** (register STO-16): results record and summaries (core) would be written separately.
4. **The in-memory shape need not change.** S1 showed the cheapest correct approach: keep `Core`/`ActivityState` as the engine's input and split only the persistence. The engine stays pure and unchanged apart from watermark handling.
5. **Not measured:** real-browser write latency, quota, large histories. All numbers in this document are historical synthetic context (record sizes measured earlier: buffer ≈ 78–84 % of the course record at the heavy profile, ≈ 400–590 KB), not budgets.

### 1.3 Differences between earlier documents and the final S1 code
* Registers/design called the tutor/prefs `updatedAt` fields "settingsAt/tutorAt" in memory — correct; the **layout marker is `layout: 1`** and `LAYOUT = 1` in code (STO-04 said "marker"; value 1).
* Original proposal assumed a `bilup-deutsch:results:<course>` slice **and** `global`. S1 shipped prefs + tutor only; `activeDates`/`studySeconds` still live in the core (out of scope here).
* Snapshots shipped as **composite monolith records** (STO-17), so they currently include `activity.results`.

---

## 2. Options considered

| | **A. Dedicated results record** (rewritten as one record) | **B. Append-only segmented log + summaries** | **C. No raw persistence** (summaries + tombstones only) |
|---|---|---|---|
| Data safety | high: independent failure domain, own merge rules, exempt from core-epoch invalidation (STO-90) | high, more states to reason about | highest simplicity; **loses per-item audit data** |
| Write amplification per result | core + one rewrite of ≤ 500 entries (≈ same bytes as today, split in two writes) | core + append one small segment (lowest) | core only (lowest) |
| Recovery complexity | low (same pattern as S1 slices) | high (segment ordering, gaps, compaction) | none |
| Cross-tab | union by `resultId` (existing logic) | per-segment merge rules, new | n/a |
| Quota | one record to shrink/evict | many small keys, key enumeration | smallest footprint |
| Migration | one step (move array) | many | delete a field (**destructive**) |
| Compatibility with S1 | direct (third slice) | new infrastructure | removes data |
| Future backend sync | record is the natural upload unit | good | needs raw results re-created |
| Test effort | moderate (reuse S1 matrices) | high | low, but a product decision |

**Recommendation: A**, with no event-sourcing machinery (no measured justification: B's only benefit, lower bytes per result, is unproven until browser measurement M4); the watermark is reserved and inactive in S2; no cap. **C is an owner decision, not an engineering one (STO-71):** if raw per-result history is not required product data (evidence: no reader in the app), C is the simplest and safest end state; if backend sync, audit or support tooling needs it, A is required. C also contradicts documented intent (05 §4.4) and is destructive, so it is **not** recommended without that decision.

**Honest limit of A:** S2 does not reduce bytes written per recorded result; it isolates failures, shrinks the course record and snapshots' blast radius, and makes pruning crash-safe. Reducing write cost (segmenting, smaller entries) is a later, measured decision (STO-79).

---

## 3. Design (Option A)

### 3.1 Records
| Record | Key | Contents |
|---|---|---|
| course | `bilup-deutsch:v2:de-general` | `layout: 2`; `activity` = `{ completions, tombstones, summaries, prunedThrough }` (**no `results`**); everything else as S1 |
| results | `bilup-deutsch:results:de-general` | `{ record:"results", v:1, epoch, updatedAt, results:[StoredResult…] }` — the learner's attempt history (originally described as a "bounded raw buffer"), self-describing like the S1 slices; **`epoch` is informational only and never invalidates the record (STO-90, §11 N1)** |

* `layout` becomes **2** (`LAYOUT = 2`); a build whose `LAYOUT` is smaller treats the record as a newer schema: **read-only, nothing written** (existing, tested S1 behaviour). Layout 1 records (S1) are upgraded on load (migration plan).
* In memory nothing changes: `Core.activity.results` stays, the engine's input/outputs are unchanged. `splitCore`/`compose` move the array in and out of the results record exactly as S1 does for prefs/tutor (a fourth **group** `results` in `pickGroups`).
* **What stays in the core and why (STO-72):** tombstones (idempotency must survive a lost/damaged results record — invariants 1, 2, 6), summaries (permanent statistics), completions (grandfathering and thresholds), the credit ledger and XP, and the reserved (inactive) prune watermark. Losing or deleting results never affects rewards.

### 3.2 What a missing or damaged results record means (STO-75)
* Absent, damaged or future-version ⇒ **empty buffer in memory** (a record is **never** "stale" because of the core epoch — §11 N1; the earlier wording "stale (older epoch)" is SUPERSEDED by STO-90 / design §11 — non-operative history); the damaged bytes are quarantined first (S1 rules); a low-priority notice is shown; the core is untouched.
* Engine consequences are in the **safe direction**: duplicate protection still comes from tombstones; the repeat daily-cap rule (reads "attempted before") can only **under**-credit (treats the activity as first attempt ⇒ the daily-cap repeat credit is not granted) — never over-credit, because first-time item credit and completion bonuses are keyed in the ledger, not in the buffer.
* A *future-version* results record is never rewritten; saves of results are skipped for the session.

### 3.3 Crash-safe pruning without double counting (STO-74)
> **Scope after STO-71/STO-90 (normative, §11 N5):** the mechanism below is operative **only** for an explicitly authorised deletion/fold in a future stage. **Automatic pruning is SUPERSEDED by STO-90 / design §11 — non-operative history** — no code path folds or removes results automatically, the retention numbers (500 / 90 days) are not applied, and `pruneActivity` must not run in `recordResult` or in `mergeActivity` in S2.
**Watermark.** `activity.prunedThrough = { finishedAt, resultId } | null` (core): the order key `(finishedAt, resultId)` of the newest result that has been folded into `summaries`. Because pruning always folds the **oldest prefix** (sort by that key), "folded" is exactly "key ≤ watermark" — one small value instead of a set of ids.

Rules (all pure, in `activity.ts`/`merge.ts`):
1. `pruneActivity` first discards raw entries with key ≤ watermark (they are already inside `summaries` — leftovers of a crash), then folds the next oldest entries as today and **advances** the watermark to the last folded key.
2. A *new* result whose key is ≤ the watermark (clock skew, late arrival) is folded **directly** into `summaries` (it is unknown to the tombstones, so this happens once) and not kept raw.
3. `mergeActivity`: `prunedThrough = max` of the two; `summaries` = the side with the **higher** watermark (ties: per-field max); raw entries ≤ merged watermark are dropped; then rule 1. Under concurrent pruning this may **under**count a day's statistics; it can no longer overcount. XP/credit are not involved.

**Write ordering by direction of change** (generic rule in the writer, replaces the fixed core-first order for this group):
| Change to the buffer | Order | Crash between the two writes |
|---|---|---|
| entries only **added** (normal result) | results record **first**, then core (tombstone, credit, completion) | raw present, no tombstone/credit ⇒ the attempt is simply not credited yet; replaying the same `resultId` is accepted once (idempotent append) — never double credit |
| entries **removed** (pruning) | core **first** (summaries + watermark), then results | entries both folded and still raw ⇒ rule 1 drops them on the next load/save; never folded twice, never lost |
| both (a result that triggers pruning) | three steps: results append → core (credit, tombstone, summaries, watermark) → results trim | any crash leaves a state in which rule 1 + idempotency restore the intended result |

A crash therefore cannot lose **both** the raw result and its summary (invariant 5): a result is deleted from the raw record only after the core that summarises it is durable.

### 3.4 Failure to append (STO-80)
If the results record cannot be written (quota/unavailable) but the core can, the result is **still credited** (XP, tombstone, completion are what the learner earned) and the raw entry is lost for that result; the session shows the existing "cannot save" style low-priority notice for results and retries on the next save. Rationale: blocking learning because an audit buffer is full would be worse than losing one audit entry; the loss is surfaced, not silent. If the **core** write fails, nothing is credited (as today).

### 3.5 Cross-tab
`storage` event on the results key ⇒ re-read, `pickGroups(…, {'results'})`: union by `resultId` (the watermark rules of §3.3 are **inactive in S2** — §13.9, §13.12). ~~Epoch rules are exactly S1's: … a results record of a lower epoch is stale (ignored, overwritten by an empty current-epoch record); a higher one is anomalous (quarantined); the slice writer guards apply unchanged.~~ **[SUPERSEDED by STO-90 / design §11 — non-operative history — it would silently empty history on reset.]** **Operative rule: §11 N1–N3** — results are exempt from epoch invalidation and from the core write guard; they are always read-merge-written. A higher core epoch is adopted for the **core** groups only. Residual race as in S1 (Web Locks remain S4).

### 3.6 Quota
~~Results are the only record that may be shrunk automatically: under quota pressure the writer may prune earlier than the retention parameters.~~ **[SUPERSEDED by STO-90 / design §11 — non-operative history — withdrawn by STO-71/STO-87; see §7.3.]** Operative rule: **no automatic deletion**; under quota pressure the entry stays in memory and is retried, with a notice. Never touched automatically: the core, preferences, tutor, pinned backups, `v1`, quarantine. Thresholds are measured, not assumed (STO-14, STO-79).

### 3.7 Snapshots and restore (STO-76)
~~Composite snapshots … therefore include the results in S2.~~ **[SUPERSEDED by STO-90 / design §11 — non-operative history — replaced by the owner-confirmed STO-76.]** Operative rule (§9): composite snapshots **exclude** the detailed attempt history, visibly (`omitted:['history']`); restoring one never restores or removes history (§9.3, §11 N4).

### 3.8 Old builds and stale shells
* S1 build ⇒ sees `layout: 2` ⇒ read-only, no write; an already-open S1 tab becomes read-only on its next save (`future` check on the stored core). Pre-S1 monolith builds are development-only (STO-13): they would read a core without activity results/fields and rewrite a monolith; S1/S2 precedence rules preserve slices and the pinned backups hold the exact bytes (documented limit, same as S1's).
* Pre-P1 shells write v1 only ⇒ unchanged drift behaviour; drift never carries raw results.
* Rollback to an S1 build is **not automatic**: it is an explicit restore of the pinned pre-S2 backup (loses everything recorded after the S2 upgrade) — stated to the learner/operator, never silent.

---

## 4. Invariants → mechanisms

| # | Invariant | Mechanism | Primary tests |
|---|---|---|---|
| 1 | XP never credited twice | ledger ids `<key>@<creditedTo>` + tombstones in the **core**; results record not consulted for idempotency | engine tests unchanged + "results record deleted ⇒ replay still a no-op" |
| 2 | Replay cannot duplicate rewards | tombstones ≥ 400 days (core); append idempotent by `resultId` | replay after crash at each write |
| 3 | Opening balances intact | ledger untouched by S2; migration does not touch `credit` | migration fixture keeps `legacy-opening`/`legacy-seed` entries and XP |
| 4 | Pruning cannot double-count | watermark rules 1–3 | crash between prune writes; two-tab prune; property test on `summaries` |
| 5 | Crash cannot lose raw and summary | removal-after-core ordering; additions-before-core | crash matrix on every write of record/prune |
| 6 | Corrupt results cannot corrupt core | independent record, quarantine-first, empty buffer, core never parses it | corrupt bytes/repairs/future `v` cases; core bytes identical (a differing `epoch` is **not** corruption for results — informational, STO-90) |
| 7 | Stale tab cannot overwrite or remove newer results | **not** the S1 epoch guard (SUPERSEDED by STO-90 / design §11 — non-operative history): results are exempt from core-epoch invalidation and from the core write guard; every results write is read-merge-write (§11 N2–N3) | stale-core tab: its new entry is merged into results, the core write is rejected (zero core writes), no entry is removed or overwritten |
| 8 | Migration idempotent, crash-safe | plan R1–R4; marker written last after verification | crash/quota/lying write at each step; rerun converges |
| 9 | Exact-byte backups and quarantine kept | R1 pinned exact bytes of the S1 core; quarantine before replace | backup bytes equal original; survives rotation |
| 10 | `v1` never written/deleted | no new code path touches it | existing log assertion in every journey |
| 11 | Unknown keys never deleted | no enumeration/removal of unknown keys | planted-key test in every operation |
| 12 | Progress/mastery consistent | engine and `progress` untouched; projection check after merge | S1 regression suite + XP/mastery fixtures before/after |

---

## 5. Compatibility with S1 and the roadmap
* Same pattern as the S1 slices (self-describing record, damage handling, per-key events) **except** that the epoch stamp is informational and the S1 stale-epoch/write-guard rules do not apply to it (STO-90, §11); the recovery panel lists the new quarantine copies; `evaluateRaw` must reject `record: "results"` copies (as it does for prefs/tutor).
* Interacts with: STO-14 (quota policy), STO-15 (retention values/compaction — still **unfrozen**), STO-16 (superseded in detail by STO-74), S3 (bundle decides snapshot composition), S4 (export "before prune" uses the same record).
* Backend sync (P8+): the results record is the natural unit of upload; the watermark gives a defined "already summarised" boundary.

## 6. Out of scope (documented, not designed here)
Global learner record, achievements, export/import, reset redesign, undo, Web Locks, retention values, segmenting/compaction (measured later), Playwright infrastructure (S6).

---

## 7. Update — full learner-visible attempt history (STO-71 confirmed)

### 7.1 Requirement
A learner must eventually be able to open a past attempt and see (where the exercise type supports it): course and target language, CEFR level, subject/topic, exercise identity and content (or a reproducible reference), attempt date/time, the submitted answer, the expected/accepted answer, correctness, mistakes and their classification, the feedback/explanation shown at the time, score and maximum, completion status, and hint/assistance usage. **Product requirement only — no screen is designed or built in S2.**

### 7.2 Field audit against the actual source
Classification: **C** already captured and stored · **D** captured by the feature but **dropped before storage** (cheap to keep) · **R** derivable reliably today (from `activityId`/content tables, valid only while content is unchanged) · **N** requires new capture in the feature · **X** cannot be reconstructed for existing data.

| Field | Where it exists today | Class | Notes |
|---|---|---|---|
| attempt id, date/time (`finishedAt`), active time | `ActivityResult` → `StoredResult` | **C** | `startedAt` is **D** (in `ActivityResult`, not in `StoredResult`) |
| course, target language | `courseId` (const `de-general`) | **D / R** | `courseId` dropped at storage; target language derivable from the course |
| CEFR level | `levelId` | **D** | dropped by `StoredResult` |
| activity identity | `activityId`, `kind` | **C** | |
| subject / topic | encoded in `activityId` (`topic:<id>`, `3:test`, `ex:<id>`, `speak:<id>`) and in content tables (`unit`, `concept`) | **R** | reliable only while ids and content are stable |
| item outcomes | `items[].outcome` | **C** | **truncated to 50 items** (`RETENTION.itemsPerResult`) — long attempts lose items: **X** for the cut items |
| score / max, passed, XP | `score`, `passed`, `xp` | **C** | |
| completion status | `completions` (core), `passed` | **C** | per attempt: `passed` |
| evidence level, completion keys `completes` | `ActivityResult` | **D** | dropped at storage |
| assistance / hints | `assisted` (boolean, never set by any screen today) | **C** (flag) / **N** (per item, STO-41) | per-item assist is S5 |
| **submitted answer** | `QuizRunner` holds `given` (the option/typed/ordered text) in `finishQuestion` but only `ok` goes to the log; writing text is in component state; speaking utterances in component state; real-life choice index `i` | **N** | **X for all existing data** |
| **expected/accepted answer** | `Question.answer` (content) | **R** (stable content) / **N** (snapshot) | for generated vocabulary questions (`vq-<vocabId>-de/ru`) derivable from vocabulary content; for authored `ex###` see §7.3 |
| exercise content | content tables; `itemRef` `q:<id>` | **R** for stable ids; **N** snapshot otherwise | **`ex###` ids are assigned by a module-level counter** (`let n = 0; id = () => ex${++n}`): inserting or reordering one exercise **re-numbers every later one**, so `q:ex012` can silently point to a different exercise. The same fragility already affects ledger keys (P2 ActivityRef, SD-08). |
| mistakes + classification | `Mistake{at,kind,ref,concept}` list **capped at 300** (`store.addMistake`), separate from results; writing `errors[].concept`, speaking `corrections` are not stored | **D/N** | the classification exists at capture time and is not linked to the attempt |
| feedback / explanation shown | `Question.why` (localised content), writing/speaking analysis output, tutor text | **N** (snapshot) | `why` is content (R while unchanged); analysis output is computed and **X** for past attempts |
| explanation language at the time | `lang` in preferences | **N** | not stored with the attempt; preferences are LWW and change over time |
| content version | none (no content versioning exists) | **N** | no manifest until P2 |

**Legacy data cannot be improved retroactively:** every attempt stored before capture exists lacks submitted answers, expected answers, feedback and classification; items beyond 50 are gone. Those entries must be marked as basic (`capture: "basic"`) and shown as such — **never reconstructed or invented**.

**Prior automatic pruning (S1 code) — limitation:** the S1 engine already folds results older than 90 days **and** beyond the newest 500 into per-day summaries (`pruneActivity`, called from `recordResult` **and** from `mergeActivity`). Development profiles may therefore already lack older detailed attempts; those cannot be restored, and "full history" can only mean history that still exists plus everything recorded after S2. Until S2 ships, the S1 code keeps pruning (development profiles only, STO-13). S2 implementation **must disable both call sites** (§11 N5).

### 7.3 Reassessment of Option A (STO-70) and of the earlier pruning design
* **A still holds as the container** (own record, epoch field informational only, own failure domain, S1 pattern with the STO-90 exemptions), but its role changes from "bounded audit buffer" to **the learner's history store**.
* **Pruning (§3.3) is no longer automatic.** The 500-result / 90-day rule would delete history. The default for S2 is **no automatic deletion at all**. The `prunedThrough` watermark and write-ordering rules stay, because they are the crash-safe mechanism for **any** deletion the owner later approves (user-initiated "delete older than…", per-course deletion, an approved retention window); until then no code path folds results into summaries. Summaries remain the aggregate of whatever was folded (so initially of nothing).
* **Quota (§3.6) is revised:** the automatic "prune earlier under pressure" clause is **withdrawn**. Under pressure the writer **never deletes history**; it reports "history cannot be saved" (STO-80/STO-87), keeps unsaved entries in memory for the session, retries on the next save, and offers the learner an action (a later export/delete flow, S4). XP/credit are still saved (STO-80).
* **Size reality (estimates, NOT measurements, not budgets):** a compact item with a short given answer, the expected answer, a concept id and a classification is on the order of 150–250 bytes; with a 60-character prompt snapshot ≈ 300–400 bytes. A 10-item quiz ≈ 2–4 KB; writing/speaking attempts with text ≈ 1–4 KB each. Hundreds of attempts fit in a few hundred KB; **thousands of attempts with snapshots can exceed the ≈ 5 M-character `localStorage` capacity** (unmeasured per browser). Therefore the **storage tier** (localStorage record vs IndexedDB) becomes a measured decision (STO-86); the design keeps the results access behind one narrow interface so the tier can change without touching the engine or the screens.
* **Option B (segmented log) is still not introduced:** its trigger would be a measured write-latency or capacity problem (S2-M2/M4/M6), not the requirement itself. If measurements show the single record is too large, the first remedy is the tier (IndexedDB) or segmentation by month — both can be decided after measurement.
* **Engine:** the daily-cap repeat rule still reads "attempted before"; with no pruning it no longer forgets (more accurate, and never over-credits). Idempotency stays on tombstones in the core.

### 7.4 Entry schema and interpretability over time (STO-82, STO-83)
Entries need their own **schema version** (`entrySchema`) separate from the record version, so detail can be added later without migrating the container. Proposed shape (design only):
```
Attempt   { resultId, courseId, levelId, activityId, kind, startedAt, finishedAt, activeMs, assisted, evidence,
            score, passed, xp, completes[], lang, capture:'basic'|'full', contentRef?{pack,version},
            items: Item[] }
Item      { itemRef, outcome, given?, expected?, promptSnap?, options?, concept?, errorClass?, assist?, feedbackRef?|feedbackSnap?, i?(order) }
Free-form { kind: writing|speaking: text (submitted), analysis{errors[], scores}, feedbackSnap }   // bounded, privacy-sensitive (STO-85)
```
How history stays interpretable when content changes:
| Change | Needed to stay interpretable |
|---|---|
| correct answer changes | the **expected answer as shown/accepted at the time** (`expected`) — a reference alone would show the new answer |
| translation/explanation changes | `feedbackSnap` (compact) or `feedbackRef` + `lang`; a reference is enough only if content is immutable per version |
| exercise reordered/renumbered (`ex###` counter) | a **stable id** (P2 manifest ids) **or** a prompt/expected snapshot; until stable ids exist the snapshot is required for authored exercises |
| exercise removed | snapshot (prompt, expected, options as shown) — a reference would dangle |
| learner changes explanation language | `lang` stored with the attempt; history shows the stored text/ref in that language and marks it "as shown then" |
| course content updated | `contentRef.version` (once manifests exist); snapshot until then |
**Recommended default:** store compact snapshots for `given`, `expected`, `promptSnap` (length-capped), `concept`, `errorClass`, and **references** (plus `lang`) for long explanations/feedback; add `contentRef` when P2 introduces manifests; do not copy whole exercises or course content. The history UI must label historical text as "as shown on <date>" and visually distinguish it from current content.

### 7.5 Retention, deletion, privacy (all OPEN)
* **Retention duration and numeric budgets stay OPEN** (STO-15, STO-79) until browser measurements and owner approval. **History is never silently deleted** to free storage.
* Options to decide: (a) keep everything until the learner deletes; (b) approved time window (e.g. N months) with a visible, user-confirmed archive-then-delete step; (c) approved per-course cap with export-before-delete. Any deletion goes through the watermark/order rules of §3.3.
* **User-initiated deletion:** whole history; per course; per attempt (STO-84). Deleting history must **not** reduce XP, completions, ledger or tombstones (rewards and idempotency are independent of history); whether summaries are adjusted is an open decision.
* **Privacy/minimisation (STO-85):** typed/spoken free text and answers are personal data. Defaults to decide: store free text by default or only on opt-in; truncation caps; exclusion from composite snapshots (STO-76); inclusion in the export (S4, with the existing "tutor transcript optional" pattern).

### 7.6 Future attempt-history interface (product requirement, not built)
List of attempts sortable by date (default newest first), filterable by course, subject and topic, level, kind and result (passed/failed); opening an attempt shows per-item given/expected answers, mistakes with their classification, score/max and passed state, assistance used, and the feedback shown at the time. Historical text is labelled "as shown then" and kept visually distinct from the current course content; for legacy `capture: "basic"` attempts the screen shows only what exists (outcome, score, date) and says that details were not recorded. Deleting one attempt, a course, or everything is available with confirmation. Export is S4.

### 7.7 Staging consequence
Storing history is meaningless without capturing it. Proposed split (STO-82): **S2** = results record + entry schema v1 (extensible, accepts the new optional fields) + no automatic deletion + migration; **S2b (separate approval)** = capture in the features (QuizRunner `given/expected`, writing/speaking text and analysis, real-life choice, mistake linkage, `lang`) — it touches learning screens and needs its own design review; **later** = history UI (product stage) and export (S4).

---

## 8. Update 5 Nov 2026 — STO-84 owner-confirmed: deleting history must not change progress

**Owner-confirmed product requirement (not an architecture approval):** deleting detailed learning-attempt history must **not** change XP, the XP ledger, mastery, completed topics or achievements. Only detailed attempt history is deleted. It must be enforced **architecturally**, not by UI convention.

### 8.1 Where each thing lives (verified against the source)
| Item | Stored in | Touched by history deletion? |
|---|---|---|
| XP, credit ledger, reward idempotency (ledger ids, **tombstones**) | course record (`progress.xp`, `credit`, `activity.tombstones`) | **never** |
| Mastery / SRS | `progress.mastery` (course record) | **never** |
| Completed topics/sections | `progress.completed` + `activity.completions` (course record) | **never** |
| Achievements | **not stored** — computed by `features/progress/stats.ts › badges()` from the data above | unchanged **by construction** (no persistence system is invented) |
| Per-day summaries, prune watermark | course record | **not touched by deletion** (decision below) |
| Preferences, tutor | own records | never |
| **Detailed attempt history** | the **results record** only | **the only target** |

### 8.2 Mechanism (STO-88)
1. **Scope of the operation is the results record.** The deletion API is defined in the storage layer as `deleteHistory(scope) : ResultsRecord → ResultsRecord`: it receives and returns **only** the results record. It is not given the core, the ledger or the progress, so it cannot modify them (type-level separation). The persistence writer, for a deletion, performs **exactly one `setItem`: the results key** — enforced by a recording-store test asserting zero writes to the course, preferences and tutor keys, and byte-equality of the course record before/after.
2. **Scopes (explicit):** `{ kind: 'all' }` — every detailed attempt of every course; `{ kind: 'course', courseId }` — only that course's attempts (today one course, `de-general`, so the two coincide in effect; the scope is nevertheless modelled so P2 multi-course cannot delete another course's history); optional `{ kind: 'attempt', resultId }` is **not** part of the confirmed requirement and stays a proposal. A course scope never reads or writes another course's results record or entries.
3. **Deletion marker, separate from reward and mastery data.** Merges are unions, so a stale tab or an older copy of the results record could bring deleted attempts back. The results record therefore carries `deletions: { <courseId|'*'>: { throughKey, at } }` — the order key `(finishedAt, resultId)` of the newest attempt deleted and the deletion time. Entries at or below the key are dropped in every merge (markers merge by max → commutative/idempotent). The marker lives **inside the results record**, so removal and marker are one atomic write, and it never appears in the ledger, tombstones, completions or mastery.
4. **Duplicate-XP protection survives deletion.** Reward idempotency uses `credit` ledger ids and the **tombstones in the core** (kept ≥ 400 days, never touched): replaying a deleted attempt's `resultId` is still a no-op; first-time item and completion credits are ledger keys (`q:<item>`, `word:<id>`, `bonus:<activity>`), so a deleted attempt cannot make an old activity eligible for duplicate XP.
5. **Completed topics stay complete:** `progress.completed` and `activity.completions` (including `firstPassedAt`, `passingResultId`) are independent of the raw history; `passingResultId` may refer to a deleted attempt — it is only an identifier and is never dereferenced to decide completion.
6. **One accepted, documented effect:** the daily-cap *repeat* rule asks "was this activity attempted before?" and today reads the results buffer for activities with no completion entry. After a deletion that answer can become "no", which can only **withhold** repeat credit, never grant extra (all first-time credits are ledger-keyed). A test pins this direction. This is an under-credit, not a duplicate reward.
7. **Destructive deletion requires a verified safety snapshot and clear confirmation:** snapshot first (STO-17 rules: ok:false ⇒ the deletion is refused, nothing changes), then a confirmation that states the scope (all / this course), how many attempts, that **XP, mastery, completed topics and achievements are not affected**, and that a safety copy is kept for a stated period (STO-32/33 undo rules; **privacy conflict:** the snapshot contains the history that was just "deleted" — the dialog must say so and offer "delete the safety copy too"; whether snapshots include history is STO-76/85). Deletion is **never triggered by quota** (STO-87).
8. **Crash safety:** a single-record write is atomic; there is no cross-record window. A crash before it leaves the history intact (plus an extra snapshot); after it the deletion is complete.
9. **Cross-tab / restore:** the results key event merges markers; a tab holding older entries drops them on merge. A deliberate *restore* of an older snapshot re-introduces whatever that snapshot held (explicit learner action, the dialog says so).
10. **Clock edge:** the marker key uses the deleted entries' order key, and the deletion time is recorded as `max(now, newest deleted finishedAt)`; an attempt finished under a clock earlier than the marker would be treated as deleted — a documented anomaly, covered by a test, not silently ignored.

### 8.3 Boundaries
No achievement persistence is introduced; no change to `credit`, `progress`, `activity.completions/tombstones/summaries`; no UI in S2; history deletion UX itself belongs to the later history/privacy stage — **S2 only guarantees the storage mechanism and the invariants**.

---

## 9. Update 5 Nov 2026 — STO-76 owner-confirmed: composite safety snapshots do NOT include the full attempt history

**Owner-confirmed requirement (a snapshot requirement only — it approves no architecture and authorises no code):** *"Composite safety snapshots must NOT include the full learning-attempt history."* This **supersedes** §3.7 ("snapshots include the results") and the STO-76 default of the earlier sheet.

### 9.1 Exact snapshot contents after S2
A composite safety snapshot (STO-17 rule R-S1-2, produced by `preserveCurrent`) is one content-addressed record in the monolith format that contains:
| Included | Source |
|---|---|
| progress incl. XP, **mastery**, **completed**, saved, mistakes (≤ 300), scores, daily, tests, activeDates, studySeconds | course record |
| preferences (name, lang, theme, level, weeklyGoal) | preferences record |
| tutor transcript | tutor record |
| XP credit ledger (incl. opening balances) | course record |
| `activity.completions`, **tombstones**, per-day **summaries**, prune watermark | course record |
| epoch, origin, upgrade pins, extras | course record |
**Excluded: the results record (the detailed attempt history) — always, and visibly.** The snapshot carries an explicit marker `omitted: ['history']` (and `preserveCurrent` returns it), so every restore/undo dialog can say "your attempt history is not part of this copy". Summaries are aggregates, not history, and remain; tombstones remain (they are reward-idempotency data, tiny, and required so a restore never re-opens duplicate XP).
Consequence: snapshot size no longer grows with history (the largest component of today's snapshots disappears).

### 9.2 Reconciling STO-76 with STO-88 (the deletion safety copy)
STO-88 required "a verified safety snapshot" before deleting history, and the dialog had to disclose that the snapshot retains the deleted history. With STO-76 a composite snapshot **cannot** protect history, so it must not be presented as doing so. Evaluation:

| | **A. Separate history-specific temporary backup (HB)** | **B. No history deletion until a recovery mechanism is approved** | **C. Soft-delete inside the results record ("trash")** |
|---|---|---|---|
| Satisfies STO-76 | yes (HB is not a composite snapshot) | yes | yes |
| Satisfies "verified safety copy before destructive deletion" | **yes**: exact bytes of the to-be-deleted scope, content-addressed, read-back verified | n/a (no deletion) | partly: the copy is the same record (no independent failure domain) |
| Failure domain | independent of the results record and of the snapshots | — | same record: corruption loses history *and* trash |
| Quota | transient peak ≈ 2× the deleted scope (a full device cannot free space by deleting; refused with a message) | none | none until purge, then one rewrite |
| Privacy | deleted history persists until the HB expires/is purged (disclosed; duration OPEN) | no deletion at all | persists until purge |
| Complexity / S2 size | new key class, lifecycle, dialogs | smallest | moderate (state in the record) |
| Silently weakens an owner requirement? | no | no | risks "verified safety snapshot" |

**Recommendation:**
1. **S2 does not implement history deletion** (Option B *for S2*, which also matches the owner's S2 scope: record, versioned entries, migration, compatibility, no-automatic-deletion guarantees). S2 only **reserves** the format: the results record has an optional, validated, preserved and merge-by-max `deletions` field that S2 code **never writes**, so the later stage needs no migration and no unknown field is dropped on rewrite.
2. **When history deletion is built (a later history/privacy stage), use Option A** (STO-89): before deleting a scope the app writes a **history backup** `bilup-deutsch:history-backup:<course>:<ts>:<fp>` — the exact bytes of the affected entries, verified by read-back; the deletion is **refused** if it cannot be written; the backup is excluded from composite snapshots and from rotation of ordinary backups; its **retention duration is OPEN** (STO-91) and it can be purged earlier only by an explicit, separately confirmed learner action ("delete permanently now"); the confirmation names the scope and count, states that XP, mastery, completed topics and achievements are not affected, and states that a recoverable copy is kept for the (approved) period.
3. Option C is not recommended; it is documented as the fallback if quota makes A impractical.
The STO-88 mechanism (one `setItem` on the results record, scopes, marker, progress untouched) stays valid; its snapshot clause is replaced by the HB clause above.

### 9.3 Recovery semantics (five distinct things — never conflated)
| Kind | Source | Covers | Never claims |
|---|---|---|---|
| **Core recovery** | composite snapshot / pinned backups | course data, preferences, tutor, ledger, tombstones, summaries | that history comes back |
| **Results recovery** | the results record's own quarantine copies; the pinned R1 backup; (later) HB | the attempt history, independently | that progress comes back |
| **History deletion** | STO-88 on the results record | detailed attempts only | any change to progress |
| **Temporary history backup (HB)** | STO-89 | the history deleted by one deletion | permanence (it expires; duration OPEN) |
| **Full application recovery** | explicit combination: core snapshot **plus** results from the live record / HB / R1 | everything that exists in those sources | full history if none of them still holds it |

| Situation | Behaviour |
|---|---|
| **Core restored, history not in the snapshot** | The live results record is **kept** (it is not part of the restore). Restore bumps the core epoch, but the **results record is exempt from epoch invalidation** (STO-90): it is neither dropped as "stale" nor overwritten. Attempts newer than the snapshot stay in history although their XP is not in the restored ledger; the history marks them "recorded after the restored point — XP not part of the restored progress". Replaying a resultId is never double credit (it is either in the restored tombstones or was never credited). |
| **Restore of an older snapshot that does contain history** (S1-era composite snapshots exist) | Its history is **merged (union) into** the results record — never replaced; nothing in the live history is removed. |
| **Results history missing** | Empty buffer in memory, notice (STO-75); core untouched. The dialog says history is absent and names the possible sources (quarantine copy, pinned R1 backup, HB) — it does not promise recovery. |
| **Results history corrupted** | Exact bytes quarantined first, empty buffer, notice; the quarantine copy can be offered as a results-recovery source (never as core recovery). |
| **Snapshot contains no history** | Normal; `omitted:['history']` is shown; restoring it cannot remove or restore history. |
| **History deletion interrupted** | With A: backup written first (verified), then one atomic write of the results record: a crash before leaves history intact plus an extra HB; after, the deletion is complete and the HB exists. With the marker inside the same record there is no partial state. |
| **User expects history from a snapshot that excludes it** | The restore dialog states, before confirming, that history is not in this copy and where history currently is (live record / HB expiry / R1). The app never says "history restored" unless a results source was actually restored. |

### 9.4 Replacement operations and the results record (STO-90)
Reset, start-fresh and a core restore currently invalidate S1 slices of an older epoch. For the results record this would **silently delete history**, which the owner requirement forbids. Proposed rule: **the results record is not invalidated by epoch changes and is never replaced by a core replacement; reset/start-fresh/restore leave the history untouched.** A reset therefore leaves history that refers to XP no longer in the ledger (labelled as such); wiping history is the explicit, confirmed deletion (STO-88/89), and "erase everything" (STO-31) is decided separately. Alternative: reset also deletes history after creating an HB (requires STO-89). **OPEN** — it changes what the existing "reset progress" button means.
Writers still apply the S1 guards for *content*: a results write is always read-merge-write (union by `resultId`, markers by max), so a stale tab can add entries but never overwrite newer ones.

### 9.5 Data-integrity checks (design-level)
XP ledger, mastery, completed topics, completions, tombstones, summaries and the computed achievements are in the **core** and are not read or written by history operations or by the exclusion of history from snapshots. History recovery (merge of a results source) writes only the results record, so it cannot duplicate XP; history deletion cannot re-enable first-time XP (ledger/tombstones untouched). Unknown storage keys are never enumerated or removed by any of these paths. **Caveat to disclose:** the pinned S1→S2 backup (R1) is an exact copy of the S1 course record and therefore **does contain the full pre-S2 history**; it is a migration backup, not a composite safety snapshot, and its lifecycle is OPEN (S3 class). Old S1-era composite snapshots on disk also contain history; they are never rewritten.

---

## 10. Update 5 Nov 2026 — STO-90 owner-confirmed: the Results record is independent of reset, start-fresh and core restore

**Owner-confirmed requirement (approves no architecture, authorises no code):** *"Reset, Start Fresh and Core Restore must not silently delete or invalidate the learner's detailed attempt history. The Results record remains independent of Core reset and restoration operations. History can only be deleted through an explicit, separately confirmed history-deletion operation. XP, mastery, completed topics, achievements and the XP ledger must remain unaffected by history deletion. No automatic history deletion is permitted."* This **closes** the open question of §9.4: the default "leave history untouched" is now a requirement, not a proposal.

### 10.1 Consequences for the design
1. **No epoch invalidation of the results record.** The S1 rule "a slice of an older epoch is stale and is overwritten with defaults" must **not** apply to it. The results record's `epoch` field is informational only; a core epoch change (reset, start-fresh, restore, restoreFrom, rollbackToLegacy) never causes the record to be ignored, quarantined, overwritten or emptied. The only paths that may remove entries are the explicit, separately confirmed history deletion (STO-88/89) — **none exists in S2** — and nothing automatic.
2. **Replacement operations do not write the results record.** `reset`, `startFresh`, `restoreFrom`, `rollbackToLegacy` and the legacy migration write/replace the core, preferences and tutor as in S1 and **leave the results key untouched** (assertable: zero writes to it). `rollbackToLegacy` removes only its own *core/prefs/tutor* keys; it must **not** remove the results key (a change from S1's "remove the app's own slices" list — to be specified in the S2 implementation design).
3. **No automatic deletion anywhere** — no pruning, no stale-epoch cleanup, no quota-driven removal, no rotation, no migration trimming (consistent with STO-71/87).
4. **After a replacement the history may refer to progress that no longer exists in the ledger** (reset) or that is newer than the restored core (restore). It is labelled, never hidden or deleted: "recorded before/after the restored point — the XP of these attempts is not part of the current progress". Replays remain safe: tombstones/ledger decide rewards, never the history.
5. **Writers:** results writes are read-merge-write (union by `resultId`; `deletions` markers by max); the epoch guard that protects the *core* applies unchanged; for the results record it is replaced by the merge rule, so a stale tab can add entries but can never overwrite or remove newer ones.
6. **Snapshots:** composite snapshots exclude history (STO-76), so a reset/start-fresh/restore snapshot does not need to protect it — it is not touched.
7. **UI wording (required with the S2 implementation, not designed here):** the existing reset confirmation ("delete all progress on this device") must state that the detailed attempt history is kept and can only be deleted separately. The text for ru/ky/de needs the usual review.
8. **Boundary with later stages:** "Erase everything" (STO-31) and course reset redesign (STO-27/29, S4) are separate; they may offer history deletion only through the explicit, separately confirmed operation (with the STO-89 backup).

---

## 11. NORMATIVE RULES AFTER STO-90 (consolidation, 5 Nov 2026 — these supersede any conflicting text in §1–§10)

Statements marked "SUPERSEDED by STO-90 / design §11 — non-operative history" elsewhere in this document are kept only as history of the design; **only §11 (and the owner-confirmed requirements) is operative**. This section is a documentation correction; it is not an approval and authorises no code.

**N1 — Core epochs never invalidate Results.** The core epoch governs core, preferences and tutor groups only. The results record's `epoch` field is informational (diagnostics, never a validity test). A results record is never ignored, quarantined, overwritten or emptied because its epoch differs from the core's, in either direction. The S1 rules "older epoch ⇒ stale ⇒ overwritten by defaults" and "newer epoch ⇒ anomalous ⇒ quarantined" **do not apply to results**.

**N2 — Core replacement is not Results replacement.**
1. Reset, Start Fresh, Core Restore (`restoreFrom`) and Rollback (`rollbackToLegacy`, rollback through an S1 backup) replace or remove **core, preferences and tutor only**.
2. **The persisted results record is the only source of truth for history.** After any replacement, the in-memory history is **re-read from the persisted record**; the `activity.results` carried by a replacement core (empty after reset/start-fresh, old after restore/rollback) is **ignored for persistence** and must never be written as if it were the history.
3. **Results saves ignore the core's replace mode.** `replace: true` (used for deliberate replacements) applies to core/prefs/tutor writes only. Every results write is **read → union-merge → write** (union by `resultId`; `deletions` markers by max), never a blind overwrite.
4. A replacement operation performs **zero writes to the results key**, with exactly one documented exception class: a *Results merge* that re-introduces history from a restore source that contains it (N4), which is a merge (adds entries) and never removes any.
5. `rollbackToLegacy` removes only the core, preferences and tutor keys it owns — **never the results key** (and never `v1`, backups, quarantine or unknown keys).

**N3 — A tab with a stale core epoch and the Results record.**
1. The S1 core write guard ("stored core epoch higher ⇒ conflict, write nothing") applies to the **core groups only**. It **must not** discard a valid new results entry: the writer evaluates the results group independently, **appends** the entry (read-merge-write) and then reports the core conflict.
2. **XP credit stays exclusively governed by the Core ledger and tombstones.** The results record never carries or grants XP; no path awards XP without a successful Core write.
3. Outcomes:
   | Results write | Core write | Result |
   |---|---|---|
   | succeeds | succeeds | normal |
   | succeeds | **rejected** (stale epoch — another tab reset/restored) | the attempt stays in history; **no XP** (the replacement's progress wins). The history entry has no tombstone in the core ⇒ the history view derives "XP of this attempt is not part of the current progress" **from the tombstones** (no new stored flag, Core remains authoritative). |
   | succeeds | **fails** (quota/unavailable) | in-memory core keeps the credit and retries on the next save (existing "cannot save" behaviour); the history entry exists, consistent once the core write succeeds; if the session ends first, history shows the same derived label |
   | **fails** | succeeds | XP/tombstone/completion saved (STO-80); the entry stays in an in-memory pending queue and is retried; a visible notice; if the session ends first, the attempt exists only as a tombstone — derived label "details not saved" (surfaced, not silent) |
   | fails | fails | nothing saved, nothing credited (as today) |
4. Order stays "results append first, then core" (§3.3), so a crash can leave a history entry without credit (safe, derived label) — and XP can only ever come from the Core, never from the results record.
5. A replayed `resultId` is a no-op for rewards via the core tombstones; it never duplicates a history entry (union by id).

**N4 — Restore and rollback sources, exactly.**
1. **Composite snapshot (monolith format, S1-era or S2)** — contains core, preferences and tutor: restore replaces those three with the snapshot's **exact** values. History is untouched; if an S1-era snapshot contains `activity.results`, that history is **merged** (union) into the persisted results record, never replacing it.
2. **Core-only copies — the pinned S1 migration backup R1 and any layout-1/2 course record copy, including quarantined core bytes.** Normative choice: **restore Core only and PRESERVE the CURRENT preferences and tutor** (they are re-stamped with the new epoch; they are not defaulted). Rationale: such a copy does not contain them; writing defaults would silently destroy the learner's current settings and chat, which the owner requirements for history and the S1 recovery guarantees both reject. The dialog states plainly: "This copy contains progress only. Your current settings and tutor chat are kept." **R1 never claims to restore the complete S1 state.** (This is a **behaviour change from current S1 code**, where `restoreFrom` of a core-only copy writes default preferences/tutor — the code writes them from the restored core; the old values survive only in the quarantine copy. **STO-92 is OWNER APPROVED (5 Nov 2026), as an intentional behaviour change from S1; dedicated migration, restore, rollback and regression tests are required in S2.**)
3. **Pinned R1 and history:** R1 contains the pre-S2 attempt history. Restoring R1 **merges** that history into the persisted results record (union, no removal); core data (ledger, completions, tombstones, mastery…) revert to R1's values, so history recorded after R1 is labelled (derived from tombstones) and remains visible.
4. **Rollback never loses current Results.** Rolling back to the S1 layout through R1 loses only **core** data recorded after the upgrade (ledger, completions, mastery…), **not** history: the results record is kept as it is, and R1's history is merged into it. The learner/operator is told which core data is lost. There is **no automatic downgrade**; S1 builds remain read-only on layout 2 until an explicit restore.
5. `rollbackToLegacy` (back to v1): removes only core, preferences and tutor; the next load migrates v1 into a **new core**; the results record stays and its entries are labelled where their tombstones are absent.

**N5 — No automatic deletion.** No pruning/fold of **results** (neither in `recordResult` nor in `mergeActivity`; the existing **tombstone expiry is unchanged** — §13.12), no stale-epoch cleanup, no quota-driven removal, no rotation of the results record, no migration trimming, no deletion on reset/restore/rollback. The only path that may remove entries is the future, explicit, separately confirmed deletion operation (STO-88/89), **which S2 does not contain**.

**N6 — Deletion is out of S2.** §8 (mechanism), §9.2 (history backup) and test-strategy §7/§8 deletion rows are **future-stage design constraints**, not S2 deliverables. S2 only reserves an optional, validated, preserved, merge-by-max `deletions` field that S2 code never writes. **Approving STO-88 for S2 means approving only that reserved field.**

**N7 — Reset confirmation wording is in S2 implementation scope.** The existing confirmation ("delete all progress on this device", ru/de; ky equivalent) must state that **detailed learning history is retained and can only be deleted separately**. ru, ky and de text each need review (Kyrgyz native review as for the S1 notices). A wording test is required (test strategy §10).

**N8 — Scope of the rollback requirement: CONFIRMED.** The owner extended STO-90 to Rollback on 5 Nov 2026 (*"STO-90 explicitly includes Rollback. Reset, Start Fresh, Core Restore and Rollback must preserve the existing Results record. None of these operations may silently invalidate, overwrite, quarantine, empty or delete detailed attempt history."*). The rules of N1–N5 therefore apply to Rollback by the owner's explicit decision, not by extension of this design.

---

## 12. PRE-APPROVAL VERIFICATION — Results/Core write combinations (5 Nov 2026)

Requested by the owner before any S2 architecture decision is marked APPROVED. This section **verifies and, where it finds gaps, adds requirements**; it approves nothing. It refines §11 N3 (the table there is the summary; this is the operative, exact version). Facts checked against the current S1 code: the save effect sets `lastSaved` even when a save fails (so a failed save is retried on the **next state change**, on the explicit "retry" action of the storage notice, or by the pagehide/visibility flush — there is **no timer**); a failed save shows the existing `save-failed` notice; adopting another tab's replacement (`syncFromStorage`) shows **no notice** today; `recordResult` computes credit, tombstone and the history entry in one pure step, and the S2 persistence layer will write them as two records.

**Invariants used in every row.** (I1) XP, ledger, tombstones and completions change only through a **Core** write; a Results write never carries or grants XP. (I2) Order is **Results first, then Core** (additions before core, §3.3). (I3) Duplicate protection for rewards = Core tombstones/ledger; for history = union by `resultId`. (I4) The history entry's `xp` field is **informational (what the engine computed then)** and is never read to credit anything; the history view derives "XP part of current progress?" from the Core tombstones.

| # | Results write | Core write | History durability | XP credit | Retry behaviour | User-visible pending state | Duplicate prevention |
|---|---|---|---|---|---|---|---|
| **1** | ok | ok | durable | credited (ledger + tombstone) | none needed | none | tombstone + union by id |
| **2a** | ok | **fails** (quota/unavailable; epoch **not** stale) | durable (entry stored, **no tombstone yet**) | in memory only until the core write succeeds; not authorised/persisted | core retried on the next state change, the explicit retry action, or the pagehide/visibility flush; **no timer** | existing `save-failed` notice (progress not saved; lost if the tab closes). History view derives "XP not part of progress" until the tombstone exists | the retry writes the same ledger ids and tombstone (idempotent); the entry already exists ⇒ no second entry |
| **2b** | ok | **rejected** (stale core epoch: another tab reset/restored) | durable, **independent** of the replacement (STO-90) | **none**: the other tab's replacement wins; the in-memory credit is discarded when the tab adopts it | no retry: the replacement is deliberate; the same `resultId` replayed later (not done by any screen) would be credited once, through the Core | **required (new):** a low-priority notice on adopting a replacement that discarded unsaved progress — "your last attempt is kept in history, but its XP is not part of the current progress" (ru/ky/de). Today adoption is silent, so XP shown moments before would simply vanish | no tombstone ⇒ reward can still be earned once via the Core; entry unique by `resultId` |
| **3** | **fails** | ok | **not stored**: entry held in an in-memory **pending queue** | credited and tombstoned (STO-80: never blocked by an audit/history record) | queue retried on every later save of the results record, on the retry action and on the pagehide/visibility flush | **required:** a results-specific "history not saved" notice (same low-priority notice mechanism); derived history label "details not saved" if the tombstone exists without an entry | queue and persisted record merge by `resultId`: a retry never duplicates |
| **4** | **fails** | **fails** | not stored (pending queue) | not persisted; in memory only | both retried as above | the existing `save-failed` notice, extended to mention history | same idempotent retries |

**Verification result.**
* **No combination awards XP without Core ledger authorisation.** XP appears only through a successful Core write (rows 1, 3); rows 2a/2b/4 persist none. The results record is never an input to `award()`; the only engine read of results is the daily-cap *eligibility* check, which can only lead to a credit **through** `award()` in the Core, capped per day, and only when `xp === 0` (all first-time credits are ledger keys), so it cannot create a first-time credit. (**Gap found, fix required:** the duplicate check `results.some(resultId)` in `recordResult` must **not** be authoritative — with history that has no tombstone (rows 2a/2b, restores) it could wrongly block a legitimate credit. The S2 implementation must base the duplicate decision on **Core tombstones only**.)
* **No combination silently loses an attempt while the app is running:** every failing row is announced by a notice and keeps the entry in memory for retry (rows 3, 4) or in storage (rows 2a, 2b).
* **Residual, to be accepted explicitly by the owner (cannot be removed by design):** if the session ends (tab closed, device off) **before** a pending entry/credit is successfully written while storage keeps failing, the entry (rows 3, 4) and unsaved XP (rows 2a, 4) are permanently lost. The loss is announced by the notice before it happens, and the pagehide/visibility flush makes a last attempt, but with a persistently failing storage nothing can be persisted. (Existing S1 behaviour for XP; new for history entries.) Later mitigations (export-before-loss) belong to S4.
* **Additional requirements this verification adds to S2 scope** (documentation only here): (a) conflict notice on adopting a replacement that discarded unsaved progress (row 2b); (b) results pending queue + results-save-failed notice (rows 3, 4), ru/ky/de, Kyrgyz marked for native review; (c) pagehide/visibility flush includes the pending results queue; (d) duplicate check on tombstones only; (e) `entry.xp` documented as informational.

---

## 13. OWNER-ACCEPTED SCOPE DECISIONS (5 Nov 2026) — normative additions to §11–§12

**Categories used everywhere (5 Nov 2026):** **[REQUIREMENT]** owner-confirmed product requirement (STO-13, 71, 76, 84, 90) · **[ACCEPTED]** owner-accepted scope/condition decision (STO-93…STO-99 and the conditions/scope restrictions recorded on STO-74, 77, 82) · **[ARCH-APPROVED]** architecture approval by the owner (**only STO-92 so far**) · **[PROPOSED]** awaiting the owner's separate architecture approval · **[IMPL-AUTH]** implementation authorisation (**none given**).
These decisions record the owner's acceptance of the recommendations of the final pre-approval audit **with the conditions stated**. They are normative for the S2 design; they are **not** an architecture approval of STO-70…88 and **do not authorise implementation**.

### 13.1 STO-93 — R3 accepted with conditions
The residual loss (unsaved in-memory work — pending history entries and unsaved XP/tombstone/completion — when storage stays unavailable and the session ends) is **accepted**. Conditions: (1) **the notice remains visible until the failure clears** — failure-state notices (`save-failed`, `history-not-saved`, `history-readonly`) are **not dismissible** (see STO-100 for the reconciliation with STO-94); (2) it **explicitly warns** that unsaved work may be lost on closing or reloading; (3) it offers **retry**; (4) the pagehide/visibility flush is **best effort** and **no durability guarantee is claimed anywhere in the product or documentation**; (5) revisit after the S4 export and P8 server sync. No `sessionStorage`/IndexedDB fallback queue in S2.

### 13.2 STO-94 — notice dismissal scoped to a failure episode
Dismissal is stored per **failure episode** (an id that changes on every transition ok→failed and on every change of failure kind), not as one boolean. A new failure, or a transition between failure kinds (e.g. `save-failed` → `history-readonly`), **re-arms** the notice even if an earlier one was dismissed. Applies to every dismissible notice (informational kinds: `repaired`, slice notices, `replaced`). Replaces the S1 behaviour in which `noticeDismissed` is reset only by load/restore.

### 13.3 STO-95 — stale-epoch conflict notice
Kind `replaced`: shown when a tab adopts a higher-epoch state while it held credit (ledger entries/tombstones) that the stored state lacks. It must **clearly distinguish** (a) *the attempt is kept in history* from (b) *its XP is not part of the current progress*. ru/ky/de wording; **Kyrgyz native review before release** (as for the S1 notices). A storage failure (`save-failed`) and a stale-epoch rejection are **never presented as the same event**.

### 13.4 STO-96 — uncapped in-memory pending history queue
Failed history writes go to an **in-memory pending queue with no numeric cap** (a cap would force a silent discard, which is forbidden). **No entry is silently discarded.** The notice shows the **pending count** and offers **retry**; entries merge with the persisted record by `resultId` (a retry never duplicates). A **newer-version results record** ⇒ **history-readonly** behaviour: results writes are disabled for the session, the record is never rewritten, the queue keeps the entries, and the `history-readonly` notice (persistent) says so. **Documented limitation:** the queue lives in session memory only (lost when the session ends — STO-93) and memory grows with the number of pending entries (a few KB each, bounded only by session length).

### 13.5 STO-97 — synchronous flush covers pending history and unsaved state
On `pagehide` and `visibilitychange → hidden` the flush writes **synchronously** whenever there is **any** of: accrued study seconds, a non-empty pending history queue, or unsaved core/preferences/tutor state — **also when study seconds are zero and also not skipped for lack of seconds**. It never throws and fails silently if storage is unavailable. **Documented limits:** best effort only; cannot guarantee persistence during crashes, forced termination (mobile browsers may kill a page without events), bfcache, power loss, or unavailable/full storage; only synchronous `localStorage` is possible (no IndexedDB, no Web Locks, no async). (This widens the S1 flush condition, `seconds > 0`, inside S2 scope.)

### 13.6 STO-98 — Core tombstones are the sole duplicate-credit authority
`recordResult` decides "duplicate" from **Core tombstones only**; the results-buffer check `results.some(resultId)` is removed. Results history **may** support daily-cap repeat **eligibility** (the "attempted before" test) but **must never independently grant or deny first-time XP**. Core ledger authorisation is preserved: every credit passes through `award()` in the Core. Required tests: entry without tombstone does not block a legitimate credit; tombstone present ⇒ no credit; replay no-op; history merged from R1/snapshot cannot cause or prevent first-time XP; retries never change the ledger sum.

### 13.7 STO-99 — `entry.xp` informational; `creditStatus`
`entry.xp` is "XP computed at the time" and is never read by crediting code and never summed as progress. The history view derives, **from the Core only**:
```
creditStatus(entry, core, now):
  'credited'      if core.activity.tombstones contains entry.resultId
  'not-credited'  if no tombstone AND entry.finishedAt >= now − RETENTION.tombstoneDays (400 days)   → "XP not part of current progress"
  'unknown'       otherwise (older than the tombstone window)                                       → NO label
```
**Entries older than the tombstone retention window must not be labelled uncredited.** A `pending` presentation (core unsaved) is shown from the live notice state, not stored. The 400-day constant is the existing retention value (provisional, STO-79).

### 13.8 STO-82 — accepted attempt-level header fields (with conditions)
Accepted fields (**S2 stores no new captured data; S2b adds the rest**):
| Field | Type | Required | Mutable | Notes |
|---|---|---|---|---|
| `resultId`, `activityId`, `kind`, `finishedAt`, `activeMs`, `assisted`, `score`, `passed`, `xp` (informational), `items[]` (cap 50 as today) | as today | required | no (append-only) | exist already |
| `startedAt`, `levelId`, `evidence` | number / enum / enum | **optional** | no | present in `ActivityResult`, currently dropped when stored: stored from S2 on; **absent for migrated entries and never invented** |
| `entrySchema` | number | optional | no | absent ⇒ 1; S2b writes 2 |
Not stored in S2: per-entry `courseId` (record-level), `completes`, `lang`, `contentRef`, `capture` (absence = basic). **Conditions:** (a) **unknown optional fields survive sanitisation and every rewrite** (today's sanitizers drop unknown keys — this must change for results entries); (b) **no missing historical field is ever invented** for migrated entries; (c) dedicated **compatibility tests** (entries with unknown fields, missing optional fields, higher `entrySchema`, migrated entries).

### 13.9 STO-74 / STO-77 — accepted with S2 scope restriction ("Reserved / inactive in S2")
* **Implemented in S2:** additions-before-core write ordering; **union of results by `resultId`**; the optional `deletions` and `prunedThrough` fields as **validated, preserved, merged-by-max, never-written-with-a-value** reserved fields; current summary behaviour **preserved** (existing summaries keep their per-field-max merge; **no new folding**).
* **Excluded from S2:** any pruning, folding, automatic removal or deletion; removal-after-core ordering; summaries taken from the higher-watermark side; the S1 `pruneActivity` is disabled in `recordResult` and `mergeActivity`.
* **Wording to prevent ambiguity:** "reserved" ≠ "S2 will prune later": no S2 code path may read the watermark to decide anything. A future stage that activates it **must** implement the watermark rules before enabling any fold (otherwise the latent summaries double count returns).

### 13.10 STO-100 — OWNER-CONFIRMED: failure notices are persistent; informational notices are dismissible per episode
The owner approved the reconciliation (5 Nov 2026): **failure notices (`save-failed`, `history-not-saved`, `history-readonly`) cannot be dismissed while the corresponding failure or unsaved condition persists**; **informational notices may be dismissed**; informational dismissal is scoped to a failure/information **episode** exactly as in §13.2 (STO-94); **when a new failure episode or a relevant state transition occurs, the corresponding notice becomes visible again.** Recorded as owner-confirmed — **not** an architecture approval.

### 13.11 STO-83 / STO-85 deferral to S2b and the S2 free-text guard
STO-83 and STO-85 remain OPEN and may be deferred to S2b **provided S2 does not capture or expose the additional free-text data that depends on them.** **S2 free-text scope guard (owner condition, 5 Nov 2026):** S2 does **not capture or expose** any additional free-text data (submitted answers, expected answers, prompts, feedback text, writing/speaking text). S2 history entries contain only the fields of design §13.8; items carry only `itemRef` and `outcome`. STO-83 (content versioning) and STO-85 (privacy of free text) are therefore **deferrable to S2b**, where the capture they govern is designed. Any S2 test of "no new data captured" belongs to the test strategy §13.

### 13.12 C4 — OWNER-ACCEPTED WITH CONDITIONS: Results folding disabled, tombstone expiry unchanged
`pruneActivity` performs two independent actions today: (a) folding old raw results into per-day summaries and (b) expiring tombstones after `RETENTION.tombstoneDays` (400 days). **S2 disables (a) only — in both `recordResult` and `mergeActivity` — and keeps (b) exactly as it is.** Conditions (owner): XP credit rules and tombstone expiry are **not** changed; **no historical Results are deleted or pruned**; **entries older than the tombstone window are not labelled uncredited** (STO-99: `creditStatus` returns no label beyond the window); **the Core ledger and reward authority are unchanged**. Tombstones are reward-idempotency data, not history. Existing summaries stay as they are and keep their current merge behaviour; no new folding is introduced.

### 13.13 C5 — OWNER-ACCEPTED WITH CONDITIONS: replacement operations are refused in compatibility mode
**Compatibility mode** (design/migration §4) = the S1→S2 upgrade has not completed successfully, so history may still live inside the layout-1 course record. In that mode **Reset, Start Fresh, Core Restore (`restoreFrom`) and Rollback (`rollbackToLegacy`, rollback through R1) are refused.** Conditions (owner):
1. **Blocked completely, never partially executed:** the refusal happens at the persistence/operation layer before any write (not merely hidden in the UI); zero writes of any record (core, preferences, tutor, results, backups of the operation).
2. **Clear explanation to the learner** that the upgrade must finish first (ru/ky/de; Kyrgyz native review before release), with the retry-upgrade action.
3. **A failed upgrade leaves existing data intact** (R1–R3 rules; nothing is deleted).
4. **The operations become available again after a successful upgrade** (`layout: 2` written and verified).
5. **Results history is never overwritten or invalidated by compatibility-mode handling:** compat-mode saves keep the embedded history in the layout-1 record; the later R2 **merges** it with any existing results record (union by `resultId`), never replaces it.

---

## 14. ARCHITECTURE APPROVED by the owner — 5 November 2026
The owner approved the S2 architecture decisions **STO-70, 72, 73, 74, 75, 77, 78, 80, 81, 82, 87 and 88** (STO-92 was approved earlier). All owner-confirmed requirements and accepted conditions remain binding: STO-13, 71, 76, 84, 90 (incl. Rollback), 100, C4, C5, R3 (STO-93) and STO-94…STO-99. Preserved scope restrictions: STO-83/85 deferred to S2b (with the S2 free-text guard); STO-79/86 open pending browser measurements; STO-89/91 deferred to a future history-deletion stage; **no automatic pruning, folding or history deletion in S2**; no S2b, history UI, export/import or history deletion. **This approves the architecture only. It does NOT authorise implementation; the implementation gate remains CLOSED pending the owner's separate written authorisation.**
