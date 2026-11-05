# BilUp Til 2.0 — Storage Architecture Decisions (P1 blockers B1–B6)

**Date:** 5 November 2026 · **Status:** DESIGN PROPOSAL — nothing here is implemented or approved · **Baseline:** git `386c6a1` + the uncommitted P0/P0b/P1 working tree (545 tests green) · **Scope:** settles the storage design for blockers B1–B6 of [`P1_COMPLETION_REPORT.md`](../implementation/P1_COMPLETION_REPORT.md) so that implementation can proceed without a second, avoidable migration.

**How to read it.** *Recommendation* = what I would do and why. *Decision required* = needs the business owner / product / legal / pedagogy; I propose a default but do not make the call. *Measured* = produced by a read-only script over the real code (no repository file or stored data was changed). *[A]* = assumption not verified.

**Sources read in full this session:** 05, 08, `P1_COMPLETION_REPORT.md`, `P1_PROGRESS_STORAGE_REPORT.md`, `G0_DECISION_RESOLUTION_PLAN.md`; actual code: `src/app/store.tsx`, `src/storage/*`, `src/progress/*`, `RecoveryPanel.tsx`, `SpeakingLab.tsx`, `TutorChat.tsx`, `ProfileScreen.tsx`, and the migration / backup / restore / merge tests. Also 03 §3–§4, 04 §10 and §216–217 for B4/B5.

---

## 0. Summary of recommendations

| Blocker | Recommendation | Needs owner approval? |
|---|---|---|
| **B1 Store separation** | **Option B, in its smallest form:** keep the core record `bilup-deutsch:v2:de-general` (schema **stays 2**, additive/tolerant) and move **three** non-critical slices into their own small, individually versioned records: **preferences**, **tutor transcript**, **raw-results buffer**. No schema bump, no generic migration engine. Do it **now, before the first release** — no P1 format has shipped, so the only production format that must stay intact (the legacy `v1` key) is untouched | Yes — the acceptance criterion changes from a vague sentence to measurable write budgets (§8); the on-disk change itself is an engineering decision |
| **B2 Export / import / reset** | Proposals in §4 (export scope, replace-only import with mandatory snapshot, course-scoped reset with a "kept / erased" list, undo through the snapshot). **Nine decisions are open** (§9) | **Yes** |
| **B3 Export-before-prune** | Offer once, non-blocking, before the first archival; decline allowed; pruning never blocked by a decline; quota pressure overrides | Yes (wording, whether pruning may wait) |
| **B4 Assisted attempts** | Item-level `assist` flag; hints stop being *submitted as answers*; assisted turns excluded from the score numerator; no hint/answer text stored | Yes — the assisted factor value |
| **B5 Typed `ActivityRef`** | Opaque keys today → **alias table** (`legacyId`) in P2 consulted at lookup; **no rewrite of ledger or history** | No (engineering), approval to carry over |
| **B6 Tests** | Playwright (real Chromium + WebKit + Firefox) for multi-tab, quota, stale-deployment and migration journeys; vitest benchmark budgets; short manual device checklist | Q14 (device lab) |

**The honest headline finding.** The acceptance sentence "tutor / theme changes no longer rewrite progress blobs" describes the *symptom*. Measured, the tutor is ~3–5 % of the record; **the raw-results buffer is 78–84 %** of it, and backups multiply the whole record (§1.2). A design that moved only the tutor and theme would satisfy the sentence and leave the real write amplification untouched.

---

## 1. Current architecture assessment

### 1.1 What is persisted today (inspected in code)

```
bilup-deutsch:v1                    legacy (pre-P1 app). Read-only for this version. Never written, never deleted.
bilup-deutsch:v2:de-general         ONE record, rewritten whole on every change:
                                      progress{ name,lang,theme,level,weeklyGoal  ← preferences
                                                tutor{messages≤60}               ← tutor transcript
                                                xp,activeDates,studySeconds,completed,mastery,saved,mistakes,scores,daily,tests }
                                      credit{entries}   activity{completions, results[≤500 or 90 d], tombstones, summaries}
                                      extras, origin{…}, epoch, settingsAt
bilup-deutsch:backup:<ts>:<fp>      exact bytes of a legacy blob OR a whole v2 record (snapshots); newest 2 + pinned pristine copy
bilup-deutsch:quarantine:<ts>:<fp>  exact bytes of anything unreadable/repaired; never auto-deleted
```
Write path (`store.tsx` persist effect → `saveProgress`): any state change → `serialize(whole core)` → one `setItem`. Reads: raw string equality against the last-seen bytes; a `storage` event → parse + sanitize + merge of the *whole* record.

### 1.2 Measured sizes (synthetic but realistic; read-only script over the real engine and `serialize`)

| Profile | Whole record | Results buffer | Ledger | Tutor | Tombstones | Preferences |
|---|---|---|---|---|---|---|
| light (40 results × 8 items) | 68 KB | 24 KB (35 %) | 28 KB | 13 KB | 3 KB | ~0.1 KB |
| regular (300 × 10) | 306 KB | 208 KB (**68 %**) | 64 KB | 13 KB | 21 KB | ~0.1 KB |
| heavy, buffer full (500 × 12) | 506 KB | 395 KB (**78 %**) | 64 KB | 13 KB | 35 KB | ~0.1 KB |
| heavy, long sessions (500 × 20) | 699 KB | 588 KB (**84 %**) | 64 KB | 13 KB | 35 KB | ~0.1 KB |
| worst-case tutor (60 × 4000 chars) | — | — | — | **234 KB** | — | — |

Consequences:
* **F1 — the buffer is the write-amplification problem, not the tutor.** Every `answerVocab`, theme change or tutor message rewrites up to ~700 KB.
* **F2 — backups multiply it.** A reset/drift snapshot is a byte copy of the whole record; "2 newest + pinned + quarantine copies" can reach 3–5× the record. At 700 KB that is 2–3.5 MB of characters before the app has written anything else. Browser limits (~5 M UTF-16 units commonly cited) are **[A]** and not measured here.
* **F3 — coupling of failure domains.** A damaged tutor or audit-buffer entry is, today, indistinguishable from damage to the credit ledger; both go through the same repair/recovery path (the recovery screen is designed for *progress*).
* **F4 — what is good and must be kept:** a single `setItem` of the core is atomic; the ledger, tombstones and completions share one write, so "credit without its ledger entry" cannot occur (05 §4.2 step 7, §6). This property must survive any split.
* **F5 — preferences ride on cross-tab merge via `settingsAt`** inside the big record; a language change in one tab triggers a merge of the entire record in the others.
* **F6 — the version window.** No P1 layout has been released; the only released layout is v1, which is frozen. Any layout change before release costs only a one-time loader branch for *development profiles*.

### 1.3 Implementation facts used by the proposals
* `UserProgress` (in-memory shape, consumed by every screen) can stay **unchanged** — slices are composed at load and decomposed at save; no screen changes for B1.
* Merge machinery (`mergeCores`, ledger union by deterministic id, epochs, LWW settings, tombstones) is well covered (merge algebra property tests, cross-tab tests). It is reusable per slice.
* The hint buttons in `SpeakingLab.tsx` (`onClick={() => onAnswer(h, null)}`) **submit the hint text as the learner's answer**, scored like an utterance — this is V-16 exactly (§5). Topic/daily speaking use `<details>` hints (view only) and a separate input.
* Tutor transcript is written per message (`pushTutor`), capped at 60 messages / 4000 chars each, local-only by design (05 §10).

---

## 2. B1 — Store separation: option comparison

**Options.** **A** — separate state in memory, keep the persisted format. **B** — persist progress, preferences and tutor in independent records. **C** — new versioned storage format (`schemaVersion 3`) with a full migration and a uniform envelope for every record (05 §7's `{schemaVersion, updatedAt, data}`).

| Criterion | A: in-memory only | B: independent records (recommended form: 3 small new records, core schema stays 2) | C: v3 format + full migration |
|---|---|---|---|
| **Meets the acceptance sentence** | **No.** One blob is still one key: any change rewrites it. Debouncing reduces *how often*, not *how much* | **Yes**, and also fixes F1/F2/F3 if the results buffer moves too | Yes (same as B) |
| **Data integrity** | Unchanged (best known state) | Core keeps its atomic single-key guarantee (F4). New cross-key window: core written first, slices after → a crash can lose *audit detail, tutor lines or a preference*, never credit (05 §6 states this ordering) | Same as B, plus a version bump that every other component must understand |
| **Migration complexity** | None | Small: v1→split is produced directly by the existing migrator; development profiles need one loader branch ("monolith → split"), idempotent and crash-safe (§3.5) | Highest: generic migration engine + v2→v3 for any v2 profile + new fixtures; benefit is mostly cosmetic while no v2 is released |
| **Backup / restore** | Unchanged; backups stay whole-record (F2) | Snapshots = core + preferences bundle; results/tutor excluded by rule (size, privacy) → snapshots shrink 3–5× | As B, more code |
| **Recovery** | One failure domain (F3) | **Independent failure domains:** a corrupt tutor/results/prefs record is quarantined alone, replaced by an empty slice, **never** opens the recovery screen and never makes the session read-only | As B |
| **Cross-tab sync** | Whole-record merge on every event | Per-key events, per-slice merge rules (§3.4); less merge work, fewer spurious writes | As B |
| **Concurrent writes** | Unchanged | Core unchanged; slices are LWW / union — conflicts cheap | As B |
| **PWA stale-shell compatibility** | Unchanged | Stale **pre-P1** shells only touch v1 (unchanged drift merge). Unreleased P1 builds would ignore new keys (not a production case) | Same; a v3 record read by a v2-only build becomes read-only (safe, existing rule) |
| **Rollback** | Trivial | Code rollback to pre-P1: v1 untouched (unchanged). Data rollback: `rollbackToLegacy` quarantines core; slices simply stay | As B |
| **Test complexity** | Lowest | Moderate: per-key write assertions, per-slice merge/recovery, crash at each write of the split upgrade (pattern already used for migration) | Highest |
| **Future backend sync** | Poor fit: one opaque blob | **Good fit:** results = set-union sync set, ledger union, prefs LWW, tutor local-only — each maps to one resource (05 §9, §10) | Good fit, bought with extra machinery |
| **Net** | Cheap, **does not meet the criterion** | **Best balance** | Over-engineered for a format that has not shipped |

**Recommendation: Option B in its smallest form** (three small new records; core untouched in schema), implemented **before the first release**. Option A's useful part — selector-style access so that components re-render for their slice only — is orthogonal and can be done independently; it does not replace B.

**If the owner rejects any on-disk change** the fallback is A + debounced writes + compact result items (§3.7). It reduces frequency and size but **cannot** meet the sentence "no longer rewrite progress blobs"; in that case the acceptance criterion must be amended to the write budgets in §8 and recorded as a deviation (decision SD-01).

---

## 3. Recommended storage design

### 3.1 Record catalog

| Key | Content | Scope | Version | Written when | Critical? |
|---|---|---|---|---|---|
| `bilup-deutsch:v1` | legacy blob | learner | — (frozen) | **never** by this version | — |
| `bilup-deutsch:v2:de-general` **core** | `progress` *minus* preferences/tutor, `credit`, `activity` *minus* `results`, tombstones, summaries, completions, `extras`, `origin`, `epoch` | course | `schemaVersion 2` (additive; absent slices tolerated) | any progress change | **Yes** — the only record that can trigger the recovery screen |
| `bilup-deutsch:prefs` | `name, lang, theme, level*, weeklyGoal`, `updatedAt` | learner-global | own `schemaVersion: 1` | profile / settings change | No |
| `bilup-deutsch:tutor:de-general` | `messages[≤60]`, `updatedAt` | course | own `schemaVersion: 1` | each tutor message / clear | No (local-only; excluded from export/sync by default) |
| `bilup-deutsch:results:de-general` | raw `StoredResult[]` (bounded by retention) | course | own `schemaVersion: 1` | each recorded result | No (audit/sync buffer) |
| `bilup-deutsch:backup:…` / `quarantine:…` | content-addressed exact bytes | — | — | unchanged | — |

\* `level` moves to the per-course enrollment (`selfDeclaredLevel`) in P2; it stays in prefs until then.
The in-memory `UserProgress` keeps its current shape; `Core` composes the slices. **No screen changes.**

New records are versioned **from birth** (no migration needed); only the core is "old", and it is tolerant.

### 3.2 Why not more splitting
Mastery, saved, mistakes, scores, daily, tests and activeDates stay in the core: each is tiny relative to the ledger, each is progress (irreplaceable), and splitting them would multiply cross-key crash windows for no measurable gain. Reconsider sharding the results buffer (monthly segments) only if the budget in §8 is missed **after** compaction (§3.7).

### 3.3 Write ordering and failure windows

```
record(result)           core.setItem  ──►  results.setItem          (core first)
tutor message            tutor.setItem                                (core untouched)
theme / language / name  prefs.setItem                                (core untouched)
answerVocab / completion core.setItem                                 (results untouched)
reset / restore          core (higher epoch) ──► prefs? ──► clear slices   (core first)
```

| Crash between … | Result | Harm |
|---|---|---|
| core written, results not | result is in tombstones (core) but absent from the audit buffer | none to totals/completion; audit gap |
| tutor / prefs write lost | last message / preference lost | cosmetic |
| core lost, results written | results exist without credit | impossible by ordering; if it happens the engine ignores results it has not tombstoned only for audit — totals come from the ledger |

Rule: **a slice write may fail without affecting the core**; failure surfaces only as the existing `saveFailed` notice.

### 3.4 Cross-tab behaviour per record

| Record | `storage` event handling | Merge rule | Notes |
|---|---|---|---|
| core | existing: re-read, `mergeCores`, adopt higher epoch | existing (tested algebra) | unchanged |
| prefs | re-read | last-writer-wins by `updatedAt` (whole record) | replaces `settingsAt` inside the core; tie → deterministic JSON order |
| tutor | re-read | union by message id, ordered by the timestamp embedded in the id, capped at 60 | ids are `u<ms>` / `a<ms>` today; fall back to "longer wins" for unrecognised ids |
| results | re-read | union by `resultId`, then the usual pruning | tombstones in the core guarantee idempotency |

A reset/restore bumps the core `epoch`; slices written before the epoch change are cleared by the replacing tab (results, tutor) or kept (prefs) according to the reset scope (§4.3).

### 3.5 Migration, upgrade of development profiles, rollback

```
                           ┌──────────── v1 (released) ────────────┐
Legacy learner ───────────►│ migrateLegacy: verified backup of v1  │──► writes SPLIT layout directly
                           └───────────────────────────────────────┘    (core, prefs, results, tutor)

Development profile (monolith v2, not released)
   load ─► core has progress.tutor / activity.results / preference fields?
        1. backup the monolith bytes (content-addressed)                       ← recoverable
        2. write prefs, tutor, results (verified)                              ← new keys
        3. rewrite core WITHOUT those fields (single setItem, verified)        ← last
   crash after 2, before 3: both exist → rule "a slice key that exists wins; monolith fields are ignored" → step 3 repeated. Idempotent.
```
* **Idempotent and crash-safe by construction;** the existing "crash before/after every write" harness applies unchanged (extend it to the four writes).
* **Rollback.** *Code* rollback to a pre-P1 build: v1 is untouched, as today (progress made since lives in the core). *Data* rollback (`rollbackToLegacy`) quarantines the core (and leaves slices in place) → the next load re-migrates v1. Rolling back to an **unreleased** P1 increment is not a supported scenario.
* **Stale PWA shell.** A stale pre-P1 shell writes only `v1`; the drift merge (exactly-once, backed up first) is unaffected by the split.
* **Recovery.** Only the core goes through quarantine → candidate → learner confirmation. Tutor / results / prefs failures: quarantine that key alone (verified copy first), continue with an empty slice, show at most a low-priority notice (no read-only mode).

### 3.6 Backup bundle
A snapshot (reset, drift housekeeping) becomes one content-addressed backup containing the **core and preferences** (a few hundred bytes more) so that restoring does not silently change language/theme. **Results and tutor are excluded** (size; tutor privacy). Restore therefore keeps the *current* results/tutor slices (audit only; tombstones in the restored core remain authoritative). The pristine pre-migration legacy copy stays a raw byte copy of v1 and remains pinned.

### 3.7 Result-buffer compaction (decision-adjacent, recommended with B)
The 500-result / 90-day retention keeps ~0.4–0.6 MB of per-item detail that nothing reads today (statistics use mistakes/scores). Options, in order of preference: (1) keep item detail only for the newest ~50 results, summaries for the rest (**needs approval — changes the [A] retention in 05 §4.4**); (2) store items as compact tuples (~3× smaller; format change *inside the new results record*, free because it is new); (3) segment by month. Without (1) or (2) the heavy-user buffer stays ~0.4–0.6 MB.

### 3.8 Data lifecycle

```
                         ┌───────────────────────── LOAD ─────────────────────────┐
 v1 present, no core ───►│ migrateLegacy → core+prefs+results+tutor (verified) ───┼──► running state
 core ok ────────────────►│ read core; read slices independently (each: ok /       │
                         │ quarantine+empty on damage)                            │
 core unreadable ────────►│ quarantine bytes → candidate IN MEMORY, writes off ────┼──► recovery screen ──► learner confirms ──► restoreFrom()
                         └─────────────────────────────────────────────────────────┘
 SAVE:  slice dirty? ─► core (if progress changed) ─► results (if a result was recorded) ─► tutor / prefs (if changed)
 EVENT: storage(key) ─► read that key only ─► slice-specific merge ─► write back only if merged ≠ stored
```

---

## 4. B2 / B3 — Export, import, scoped reset, export-before-prune

Architecture today (05 §8, §10): "JSON file of learner state — user-initiated, version-tagged, validated on import; doubles as data portability"; "reset one course, or everything, with a confirmation listing what will be erased"; data minimization, no sync of tutor by default, no subscription/payment/entitlement data in the local store (05 §10, 11 §13). Everything else below is **proposal**.

### 4.1 Export — two different tools (keep them apart)

| | **Export my progress** (new) | **Download preserved data** (exists) |
|---|---|---|
| Purpose | portability, second device, learner's own copy | emergency recovery of damaged data |
| Content | validated, versioned, human-checkable JSON | exact bytes of backups / quarantine / legacy |
| Used with | Import | manual support / future restore |

**Proposed content (recommendation; owner to confirm — SD-02):**

| Data | Included | Why |
|---|---|---|
| XP ledger (`credit.entries`) | **Yes** | totals must be reproducible (05 §4.3) |
| Completions, mastery/SRS state, saved words, mistakes, scores, daily results, test history, active days, study time | **Yes** | this is the learner's progress |
| Preferences (language, theme, weekly goal, level) | **Yes** | harmless, avoids re-setup |
| Display name | **Opt-out checkbox, default on** | personal data (05 §10) |
| Raw results buffer | **Optional checkbox, default off** | large; needed only for audit/sync; always offered at export-before-prune (§4.4) |
| Tutor conversations | **Optional checkbox, default off** | local-only by design, free text, may contain personal data |
| Backups / quarantine | **No** (use "Download preserved data") | different purpose, raw bytes |
| Subscription, payment, entitlement, Live, Marketplace data | **Never** | not stored locally (05 §10, 11 §13) |
| Device ids, tokens, anything account-bound | **Never** | none exist yet; rule for P8 |

**Format (proposal):** `{ "format": "bilup-learner-export", "exportVersion": 1, "appSchema": 2, "courseId": "de-general", "exportedAt": …, "counts": {…}, "integrity": "<fingerprint of data>", "data": { core, prefs, results?, tutor? } }`. Version rules: unknown **higher** `exportVersion` → rejected with a clear message; **lower** → upgraded by pure, fixture-tested functions. The file is **not encrypted** — the export screen must say so (privacy).

### 4.2 Import

| Question | Recommendation | Decision? |
|---|---|---|
| Replace or merge? | **v1 of import = REPLACE only**, with a preview (XP, completed items, last activity date, counts) and an explicit confirmation. Merge is well supported technically (the merge algebra is tested) but its product meaning (second device, partial overlap, who wins settings) belongs with account sync (P8) | **Yes — SD-03** |
| Current data | **Mandatory snapshot first** (reuse `snapshotCurrent`) **and** quarantine of the replaced record; import counts as a *deliberate replacement* → `epoch` bump so other tabs adopt it | engineering |
| Duplicate activities | n/a for replace. If merge is ever allowed: ledger ids and `resultId`s deduplicate (already guaranteed) | — |
| Conflicting records | replace: the file wins entirely. Merge (future): existing per-field rules (§3.4, `merge.ts`) | with SD-03 |
| Invalid / unsupported data | **Validate everything before any write.** Whole-file rejection with reasons (bad JSON, integrity mismatch, higher version, other `courseId`, impossible values); never a partial import. Salvage-with-repair is allowed for *field-level* issues exactly as for stored records (`sanitize*`), reported in the preview | decision on strictness — SD-04 |
| Size | reject above a fixed limit (proposal 5 MB) | engineering |
| After import | prefs applied only if the export contained them; tutor/results slices replaced only if included, otherwise left alone | with SD-02 |
| Failure midway | impossible by order: validate → snapshot → write core → slices; a failure after the core write leaves a valid imported core (slices cosmetic) | engineering |

### 4.3 Scoped reset (one course exists today; the design must not assume it stays so)

Facts: XP and mastery are **course-scoped** (05 §3); streak/active days are **learner-global** (05 §3 "Decision [R]"); preferences are learner-level; **badges and "global XP" are not stored — they are projections** (so they disappear when their inputs do); no subscription/account data is local.

| Action | Erases | Keeps | Undo |
|---|---|---|---|
| **Reset this course's progress** (recommended default meaning) | ledger (XP restarts at 0, items can be earned again), completions, mastery/SRS, saved words of the course, mistakes, scores, daily, tests, results buffer, summaries, tombstones, course tutor transcript | preferences/profile (name, language, theme, weekly goal), **active days / study time (learner-global)**, legacy `v1`, backups, quarantine | **Yes:** automatic snapshot (§3.6) + an "Undo" in the recovery screen; durability = the 2 rotating snapshots |
| **Clear tutor conversation** (exists) | tutor slice only | everything else | no |
| **Erase all local data** (rare; GDPR-style) | all of the above **and** preferences, active days | — | only if the learner first exports; **legacy v1, backups and quarantine are the open question** (SD-07) |

Required UX regardless: a confirmation that **lists what will be erased and what will be kept**, in all three languages; a one-line statement that no account/subscription data is affected (nothing local); the snapshot is taken **before** the action and its existence is shown. The reset increments `epoch` (other tabs adopt).
Today's single *Reset* button erases progress+preferences+active days and keeps backups/legacy; the proposal narrows its default meaning and adds the "kept" list.

### 4.4 Export-before-prune (B3)

Architecture (05 §4.4): "before pruning the first time, the app offers (and logs the choice for) an export of the raw results; pruning is idempotent and atomic with summary creation; under quota pressure it runs earlier but never touches permanent state."

| Aspect | Proposal |
|---|---|
| Trigger | the first time the retention rule would archive at least one raw result (buffer > retained window) |
| Appearance | a non-blocking notice (same family as the storage notice): *"Older detailed results will be summarised to save space. Your XP, completed lessons and word progress are not affected. [Export them first] [Not now]"* — three languages |
| Content | export (format §4.1) containing **only the results about to be archived** |
| Decline | allowed; the choice and time are recorded in the **core** (`prefs`-class flag `archiveOfferShownAt`, `archiveOfferChoice`) and the offer is **not repeated** |
| Does declining block pruning? | **No.** Pruning waits until the offer has been *shown once* (not accepted); if the notice cannot be shown (headless, read-only) pruning waits at most until the next session; under **quota pressure** pruning proceeds immediately and the offer is skipped |
| Permanent data | never pruned; summaries keep per-day counts, so statistics survive |
| Needs | the export from §4.1; hence B3 depends on B2's format (**SD-05** for wording/waiting rule) |

---

## 5. B4 — Assisted attempts (V-16)

### 5.1 What the code does today
* **Scenario speaking** (`SpeakingLab.tsx`): the hint chips call `onAnswer(h, null)` — the hint text itself becomes the learner's turn, analysed and scored (grammar/naturalness near full marks) and averaged into the speaking score and the scenario result. `attempt.finish` receives no `assisted` flag (always `false`).
* **Topic speaking step / daily speaking:** hints are a `<details>` block (viewing only) and the learner speaks into a separate input; nothing records whether the hint was opened or repeated.
* **RewardPolicy:** `assistedFactor` exists and is tested; shipped value **1** (no effect).

### 5.2 Proposed representation (no UI built here)

Additive, optional field on the item outcome; result-level `assisted` stays the attempt summary the policy already uses.

```ts
type Assist = 'none' | 'hint-viewed' | 'hint-repeated' | 'solution-shown'
interface ItemOutcome { itemRef: string; outcome: 'correct'|'incorrect'|'partial'|'skipped'; assist?: Assist }   // assist optional → old results valid
// speaking scenario turn: itemRef = `turn:<scenarioId>:<n>`
// result.assisted = items.some(i => i.assist === 'hint-repeated' || i.assist === 'solution-shown')
```
Rules (aligned with 03 §4.2 rule 5: *"showing a hint does not submit it; if the learner repeats the hint text it is recorded as assisted production"*):
1. **Tapping a hint never submits.** It plays the audio / pre-fills the input for the learner to say or edit. (UI change, later.)
2. A turn whose normalised utterance equals a hint (or the stored sample) is **`hint-repeated`** → assisted production. A turn where the hints were only opened is **`hint-viewed`** → *not* assisted, recorded for analytics.
3. **Scoring:** assisted turns count in `possible` but contribute 0 to `earned`, so assisted help cannot raise a threshold-based score.
4. **Reward:** result-level `assisted === true` ⇒ every XP amount × `assistedFactor` (existing engine behaviour).
5. **Privacy / "not exposed as completed answers":** no hint text, utterance text or sample is stored — only `itemRef`, `outcome`, `assist` (the compact result already omits free text). The stored record can therefore not be read as "the learner answered X".
6. **Decision required (SD-06):** the factor (proposal 0.5) and whether `hint-repeated` turns count toward the participation-based completion of a scenario (proposal: yes, participation stays).
7. Tests (later): hint tap does not call the answer path; repeated-hint detection by normalisation; viewed ≠ assisted; score excludes assisted turns; factor applied; no text in the stored result; old results without `assist` still valid.

---

## 6. B5 — Typed `ActivityRef` and `legacyId` (P2)

Facts: the engine and the ledger treat ids as **opaque strings** (`topic:x`, `3:test`, `ex:re03`, `q:vq-v1-7-de`, `word:v1-3`, `bonus:<activityId>`). 03 §3.2 wants stable namespaced ids (`'de-general/u03/reading/re03'`); 04 §3 gives manifests `required: ActivityRef[]`; 04 §10 requires ids never to be reused and a **tombstone** for removed items; 04 §9 keeps a `legacyId` table "used by the progress migrator".

**Proposal.**
1. **Canonical ids** in the pack: `ActivityId = "<courseId>/u<NN>/<kind>/<localId>"`, `ItemRef = "<courseId>/<itemKind>/<localId>"` (generated vocabulary questions: `de-general/vocab/v1-7#recognition-de-ru`, replacing the string convention `vq-<id>-de|ru`).
2. **`legacyId` as an alias table inside the pack** (`legacy: Record<legacyKey, canonicalId | tombstone>`), generated by the content conversion (04 §9) and covered by the id-stability test (04 §11).
3. **Do not rewrite stored history.** The engine and selectors resolve through a small `resolveRef(key)` (canonical id, alias, or archived bucket) at **lookup** time. Ledger entry ids (`<key>@<n>`) and `credited` keys keep their old strings; `credited(canonical)` also checks every alias that points to it. This keeps 05 §4.3 ("policy changes never rewrite history"), needs **no storage migration** at P2, and makes P2 reversible.
4. **New writes** use canonical ids once the manifest is active; the alias table stays forever (tombstoned entries move to an "archived progress" bucket instead of crashing a screen — 05 §7).
5. **Completion keys** (`N:section`) are replaced by manifest `required` lists; `completes[]` disappears from results at that point; legacy completions are already grandfathered (`source:'migration'`).
6. Risks: alias collisions (guard with the id-stability test); question ids that are derived at runtime must become manifest items before they can be aliased.
7. Acceptance for B5 (P2 gate): every legacy key produced by the P1 screens resolves or is tombstoned; a fixture of a heavy P1 profile loads under the manifest with identical XP, completion and credit; no ledger rewrite.

---

## 7. B6 — Testing strategy

**Automated (CI):**

| Area | Tool | What | Gate |
|---|---|---|---|
| Real-browser E2E | **Playwright** (Chromium + WebKit + Firefox; Chromium for the full set) | journeys: fresh user; upgrade from a legacy fixture; complete a lesson/quiz/test (0 %, 70 %); export → reset → import; recovery from a corrupted record; offline shell | green on 3 engines for smoke, Chromium for the rest |
| Multi-tab | Playwright: two `Page`s in **one browser context** share `localStorage` and receive **real** `storage` events | concurrent XP, same activity in both tabs, reset in one tab, settings LWW, newer-version record | green |
| Quota exhaustion | Playwright script fills `localStorage` until `QuotaExceededError`, then drives the app | save-failed notice, no data loss, read-only guards, retry succeeds after freeing space, migration with no room for the backup | green (Chromium; WebKit/Firefox best effort) |
| Performance budgets | vitest benchmark + Playwright timing (CPU-throttled) | write size per event; cold load with a 10 k-result profile; save latency; budgets in §8 | within budget (numbers are proposals) |
| Migration & recovery | existing vitest matrices + the real-browser upgrade journey | crash at every write of the split upgrade; corrupt each record in turn | green |
| PWA stale deployments | Playwright with a static server: build A (pre-P1, from git `386c6a1`) and B (current); install A's service worker; deploy B; keep A's tab open | old shell writes `v1` → B merges once; update prompt appears; kill-switch; offline shell | green on Chromium |
| Regression | existing 545 tests + mutation script | must stay green; mutation matrix re-run for the new mechanisms | green |

**Manual (device checklist, owner Q14):** iOS Safari normal + private mode and "Add to Home Screen"; Android Chrome with low free storage; storage eviction after inactivity (Safari ITP) on an installed PWA; two real windows on desktop; real offline/airplane mode; screen-reader pass of the recovery dialog; Kyrgyz and Russian text overflow in the recovery and reset dialogs. Record results in the release checklist.

---

## 8. Acceptance criteria

**B1 — Store separation (measurable replacement for the sentence)**
1. After a theme/language/name change a `setItem` spy sees **only** `…:prefs` written (< 1 KB); after a tutor message **only** `…:tutor:…`; after a recorded result **only** core + results; **the core never contains** tutor, results or preference fields (static + runtime test).
2. Corrupting prefs / tutor / results (each, separately) → quarantine of that key only, empty slice, **no** recovery screen, **no** read-only mode, XP/completion unchanged.
3. Corrupting the core → unchanged behaviour (candidate in memory, confirmation required).
4. Legacy v1 → split layout directly; development monolith → split upgrade is idempotent with a crash injected at each write; the monolith bytes are backed up first.
5. Per-key cross-tab merges (prefs LWW, tutor union, results union, core unchanged) pass the existing multi-tab scenarios plus new ones; merge algebra property tests extended.
6. Backup bundle (core+prefs) restore round trip; restore leaves slices consistent; the pristine pre-migration copy stays pinned.
7. Size budgets (proposal): core ≤ 150 KB at the heavy profile; a prefs/tutor change writes ≤ 16 KB (tutor) / ≤ 1 KB (prefs); a result writes ≤ the buffer size/64 KB segment if segmented; **budgets measured, not assumed**.
8. All 545 current tests pass or are consciously updated (list of updated tests in the report); mutation checks: slice written to the wrong key, core rewritten on theme change, tombstone lost on slice failure, monolith field preferred over slice.
9. No change to any screen's behaviour; the in-memory `UserProgress` shape is unchanged.

**B2/B3** — export validates round trip (export → reset → import yields identical XP/completion/credit; fixtures for each decision in §9); import rejects every invalid class without writing; snapshot + quarantine exist before replacement; reset lists kept/erased items in three languages and is undoable via the snapshot; export-before-prune offered exactly once, decline respected, quota pressure overrides.
**B4** — behaviours listed in §5.2(7) pass; speaking score cannot be raised by hints; old stored results remain valid.
**B5** — §6 point 7.
**B6** — the table in §7 exists as CI jobs; the manual checklist is attached to the release; budgets recorded in the P1 closure report.

---

## 9. Missing decisions (owner / product / legal)

| ID | Decision | Recommendation | Owner role |
|---|---|---|---|
| **SD-01** | Accept an on-disk layout change **before first release** (B1)? If no: amend the acceptance sentence to write budgets | Yes, now | Business owner + Technical lead |
| **SD-02** | Export scope: include name? tutor? raw results? (defaults in §4.1) | as §4.1 | Product owner + Legal/data-protection |
| **SD-03** | Import: replace only (v1) or also merge? | replace only until sync | Product owner |
| **SD-04** | Import strictness: whole-file rejection vs repair of field-level issues | repair field-level, reject structural/version/integrity | Product owner |
| **SD-05** | Export-before-prune wording, "offer must be shown once" rule, retention values (500 / 90 d / 400 d), and result compaction (§3.7) | as §3.7 and §4.4 | Product owner + Technical lead |
| **SD-06** | Assisted factor (0.5?) and completion rule for assisted turns | 0.5; participation still completes | Pedagogy owner |
| **SD-07** | "Erase everything": does it include legacy `v1`, backups, quarantine? Typed confirmation? | include only after a final export offer and typed confirmation; owner to rule on legacy `v1` (conflicts with "never delete legacy data") | Business owner + Legal |
| **SD-08** | Reset undo window (2 rotating snapshots today) and whether achievements/badges may disappear with a course reset | accept; state it in the dialog | Product owner |
| **SD-09** | Streak/active days under course reset (learner-global per 05 §3) and the open product question "streak scope" | keep global | Product owner |
| (G0) | Kyrgyz review of every new string | native reviewers (Q2/Q16) | Localization lead |

Nothing above is decided by this document.

---

## 10. Implementation sequence (each step releasable on its own; no step bumps the core schema)

| Step | Content | Gate |
|---|---|---|
| **S0** | Owner decisions SD-01, SD-05 (and measurement of budgets in a real browser) | decision record |
| **S1** | **Preferences + tutor** records (smallest, lowest risk): loader branch, per-key events, tests §8.1–§8.5 for these two | all §8 items for prefs/tutor + 545 tests |
| **S2** | **Results buffer** record (+ compaction decision); tombstone/ordering tests; budget check | §8.1, §8.4, §8.7 |
| **S3** | Backup **bundle**, per-record recovery behaviour, "monolith → split" crash matrix | §8.2, §8.4, §8.6 |
| **S4** | Export, import, scoped reset, export-before-prune (after SD-02…SD-09) | B2/B3 criteria |
| **S5** | Assisted attempts (UI + `assist` field) | B4 criteria |
| **S6** | Playwright suite + manual checklist | B6 |
| **P2** | Manifest, alias table, `ActivityRef` | B5 criteria |

S1–S3 can start as soon as SD-01 is approved; S4–S5 are blocked on the owner decisions, S6 on Q14. P1 can be closed when S1–S6 (or an approved, documented subset) are done.

---

## 11. Risks

| Risk | Mitigation |
|---|---|
| Cross-key crash windows | core-first ordering; slices non-critical by definition; crash matrix test |
| A second layout change after release | do B **now**; versioned envelopes on new records; core stays tolerant |
| Regression in the verified integrity guarantees | keep the core code path untouched; extend, not rewrite; re-run the full mutation matrix |
| Quota (backups ×, buffer size) | snapshots exclude buffer/tutor; compaction; budgets; E2E quota test; browser limits are **[A]** until measured |
| Tutor privacy | separate key, excluded from export/sync by default, clear button unchanged |
| Export file is plaintext personal data | warn in UI; opt-outs; never include account data |
| Import as an attack surface / data loss | validate-then-snapshot-then-write; size limit; epoch bump; no partial import |
| Reset surprises | kept/erased list, snapshot first, undo |
| Assisted-attempt change alters learner experience | hint buttons fill the input instead of submitting; pedagogy sign-off (SD-06) |
| Alias resolution complexity at P2 | single `resolveRef`, id-stability test, no history rewrite |
| Real-browser behaviour still unverified | S6 before closing P1 |

---

## 12. Out of scope of this document
No code, no dependency, no commit, no change to other architecture documents. The measurements were taken with a read-only script outside the repository (`src/` and `tests/` untouched). Final numbers (budgets) must be re-measured in real browsers during S1–S2.
