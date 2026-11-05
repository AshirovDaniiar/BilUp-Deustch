# P1 — Completion Report (progress integrity and recoverable persistence)

**Date:** 5 November 2026 · **Baseline:** git `386c6a1` + uncommitted P0, P0b and P1 work (nothing committed) · **Supersedes in part:** [`P1_PROGRESS_STORAGE_REPORT.md`](P1_PROGRESS_STORAGE_REPORT.md) (kept as the record of the first increment; a banner there lists what is no longer true).
**Evidence rule:** every "Tested" below names a test file; every number comes from a command run in this session. **No real browser, device or HTTPS deployment was used** (see §9).

---

## 0. Closure verdict

> ## **P1 NOT CLOSABLE**
> The integrity core is implemented and heavily tested, but 08 §3 P1 contains **mandatory requirements and one acceptance criterion that are not met**. They are listed as blockers in §10. None of them is a data-safety defect; they are missing scope.

What is solid: idempotent XP, result contract and reward policy, pass thresholds, bounded results buffer, safe migration, quarantine/backup/recovery with learner confirmation, stale-version drift merge, cross-tab merge, active-time measurement, neutral default name, truthful unit denominators.
What blocks closure: **store separation** (the acceptance criterion "tutor/theme changes no longer rewrite progress blobs" is unmet), **export/import and scoped reset** (not implemented; behaviour only partly specified), **export-before-prune offer**, **assisted-attempt flagging in the speaking UI**, and **missing test layers** (browser E2E, performance budgets, quota estimate).

---

## 1. Verification (final run)

| Command | Result |
|---|---|
| `npm run check` (typecheck → lint → tests → content-validate → boundaries → build) | **exit 0** |
| `npm run typecheck` | exit 0 |
| `npm run lint` | **0 errors, 8 warnings** (the same pre-existing jsx-a11y warnings; none in P1 code) |
| `npm run format:check` | "All matched files use Prettier code style" (after Prettier was applied to the four flagged files only) |
| `npm test` | **26 files, 545 tests passed, 0 failed** (466 / 21 at the recovery audit → **+79 tests, +5 files** in this task) |
| `npm run content:validate` | 0 errors |
| `npm run boundaries:report` | 5 violations (unchanged, pre-existing `features → screens/NotFound`), 0 cycles |
| `npm run build:ci` | OK — JS 482.70 kB / **170.01 kB gzip** (P0 146.22 → P0b 148.96 → P1-first 158.5 → now 170.01), CSS 9.26 kB gzip |
| `npm audit --omit=dev` | found 0 vulnerabilities (dev-tooling advisories unchanged from P0) |
| `npm ci --dry-run` | exit 0 |
| Coverage (storage, progress, notice/recovery, pass note, stats, store, PWA scope) | **94.83 % statements, 90.73 % branches**; whole `src/**`: ~60 % statements (UI and data files are exercised by integration tests, not instrumented line by line) |
| Mutation matrix (§8) | **12 of 12** deliberate defects detected; every file restored byte-identically |

Tests added in this task: recovery UI 19, cross-tab and concurrent migration 17, assessment thresholds through the real `QuizRunner` / `TestRunnerPage` 11, default name + stale PWA shell 22, unit denominators 6, audio-playback active time 4 = **79**. Earlier in the same effort: engine 58, merge algebra 13, active-time 15.

---

## 2. What was done in this task

| Item | Result |
|---|---|
| Formatting | Prettier applied to exactly the 4 flagged files (`scripts/check-boundaries.mjs`, `tests/progress/engine.test.ts`, `tests/storage/merge.test.ts`, `src/storage/merge.ts`) |
| **Defect found and fixed:** concurrent migration overwrote another tab's record | If two tabs booted on the same legacy data, the slower one could overwrite a record that already held newer progress. `migrateLegacy` now re-reads the record just before writing and **adopts** an existing one instead (`persistence.ts`). Tested at provider level with a stale first read, and mutation M9 proves the test notices |
| **Defect found and fixed:** the recovery screen vanished after a successful action | The notice returned `null` once the problem was gone, closing the dialog before the learner saw "saved". An open screen now stays open (`StorageNotice.tsx`) |
| Unit-10 denominators (V-06) | `requiredSections(unit)` in `features/progress/stats.ts`: a section is required only if the unit has content for it (unit 10 has no reading text and can reach 100 %). `unitProgress`, `levelProgress`, `currentUnit` and the "unit" badge use it; unit 1 still has 8 of 8 |
| Audio playback as active time (05 §5) | `useKeepActive(playing)`; wired into the listening player. Playback counts while the tab is visible; stopping restarts the idle window |
| Stale reports | README "Progress storage (P1)" section rewritten; `P1_PROGRESS_STORAGE_REPORT.md` got a supersession banner (original text untouched) |

---

## 3. Requirement matrix

Legend — **I** implemented · **T** tested (file) · **PT** partially tested · **N** not implemented · **X** requires external approval / native-language review.

| # | Requirement (source) | I | Evidence | Notes |
|---|---|---|---|---|
| 1 | `ActivityResult` contract (03 §4.1) | I | T `progress/engine.test.ts` (58) | `activityId` is the legacy completion key and `completes[]` lists section keys until manifests exist (P2); typed `ActivityRef` not introduced |
| 2 | `RewardPolicy` (03 §4.2) | I | T `engine.test.ts`, `app-wiring.test.tsx` | Temporary in-code table keyed by kind (08 P1 (1)). Supported: `perCorrectFirstTime`, `none`, `daily-cap` (mechanism only), assisted factor. **Not supported:** `xpBasis:'perResult'`, repeat `'reduced'` |
| 3 | Idempotency by `resultId` + tombstones (05 §4.2, §4.4) | I | T engine + store tests | Tombstones kept ≥ 400 days **[A]** |
| 4 | Bounded raw-results buffer + archival to per-day summaries (05 §4.4) | I | T engine property tests | N = 500 or 90 days **[A]**; pruning leaves XP, completions and credit identical (30 random histories) |
| 5 | Pass thresholds (03 §12, V-05) | I | T `thresholds.test.tsx` — real `QuizRunner` at 0 / 60 / 69 / 70 / 100 %, real `TestRunnerPage`, `PassNote` | 70 % for tests and reviews, **X** (value is "proposed [A]") |
| 6 | Idempotent XP, ledger reproducible (05 §4.3) | I | T credit, store, engine, app-wiring | |
| 7 | Active-time tracking (05 §5, V-08) | I | T `active-time.test.tsx` (19) | 60 s idle window **[A]**. Flushed on hide, pagehide and result; no ticker. Counts audio playback in the **listening player only**; speech-recognition and the other speak buttons are not hooked (**PT**) |
| 8 | Legacy migrator + backup + quarantine + recovery (05 §7, §8, §11) | I | T persistence (70+), legacy-storage, recovery-ui | |
| 9 | User-facing recovery screen | I | T `recovery-ui.test.tsx` (19) | Download, restore verified copy, start fresh, retry, Escape; every replacement needs confirmation. Restore/retry buttons are the **only** way to replace an unreadable record |
| 10 | Remove default name (05 §10, V-15) | I | T `name-and-stale-shell.test.tsx` | Empty name is the neutral onboarding state; there is no extra onboarding card |
| 11 | Stale PWA shell vs v1/v2 consistency | I | T stale-shell tests (7), persistence drift tests (5) | merged forward exactly once; see §6 |
| 12 | Cross-tab concurrency (05 §9) | I | T `cross-tab.test.tsx` (17), `merge.test.ts` (13) | two tabs in one jsdom window with manual storage events; limits in §7 |
| 13 | Truthful unit denominators (V-06) | I | T `unit-denominators.test.ts` | derived from content availability (temporary manifest stand-in) |
| 14 | Store separation (05 §2.7, §3, §6; 08 P1 (3)) | **N** | — | **Blocker B1** |
| 15 | Export / import (05 §8) | **N** | — | **Blocker B2** — see missing decisions |
| 16 | Scoped reset (05 §8) | **N** | — | **Blocker B2** — see missing decisions |
| 17 | Export-before-prune offer (05 §4.4) | **N** | — | **Blocker B3** |
| 18 | Assisted attempts flagged in speaking (V-16) | **PT** | policy mechanism T; speaking-hint UI not changed | **Blocker B4** |
| 19 | Quota estimate / storage-pressure mode (05 §6) | **N** | save failures are surfaced (T) | part of **B6** |
| 20 | Browser E2E, performance budgets (05 §12) | **N** | jsdom + fault injection only | **B6** |
| 21 | Kyrgyz texts (PWA, storage notice, recovery, pass note) | I | T completeness only | **X** native review (Q2/Q16) |

---

## 4. XP policy versions `p1-1` and `p1-2`

* `p1-1` is the version stamped by the **first P1 increment**: `storage/credit.ts` (`POLICY_VERSION`) and the legacy migrator (`legacy-opening`, `legacy-seed`, `reconcile` entries). Its credit keys were `q:<id>`, `word:<id>`, `topic:<id>`, `speak:<id>`, … (screens called `addXp(n, key)`).
* `p1-2` is stamped by the **engine** (`progress/policy.ts`) on every new `earn` entry. Keys are `q:<itemId>`, `word:<id>` (unchanged) and `bonus:<activityId>` (replaces the per-feature keys).
* **Policy changes never rewrite history** (05 §4.3): old entries keep their version; `award()` now takes the version from the policy that produced it.
* **Consequence:** the first increment was never released. Only a development profile could hold `p1-1` entries with the old bonus keys; such a profile can earn each activity bonus **once more** under the new keys. Legacy (pre-P1) learners are seeded with the **new** `bonus:` keys, so they cannot.
* Reproducibility: total XP = Σ ledger (verified on load; mismatches are reconciled upward, never lowered).

## 5. v1 / v2 compatibility and schema

* Legacy key `bilup-deutsch:v1` is **read-only** for this version (T: "never writes the legacy key", `expectNothingLost`, M10). Current record `bilup-deutsch:v2:de-general`, `schemaVersion: 2`.
* Fields added in this task (`epoch`, `settingsAt`, `activity{completions,results,tombstones,summaries}`, `origin.legacyXp`) are **optional with defaults**, so a record written by the first increment loads cleanly and upgrades on the next real change (T). The schema number was **not** bumped; a future record with `schemaVersion > 2` is never touched (read-only, T).
* Downgrade caveat: the *first increment's* build would drop the new fields when re-saving. It was never released.

## 6. Rollback and stale-shell behaviour

* **Code rollback** (an older build is deployed again): it reads `bilup-deutsch:v1`, exactly as it was before migration — it does **not** see progress made in the new version (T `rollback of the CODE`). That progress is safe in the current record.
* **Re-deploy after rollback:** anything the old build wrote to v1 meanwhile is merged forward, once.
* **Stale cached shell while the new version is live:** its writes to v1 are detected at load and on the `storage` event, backed up first, then merged (XP as a one-off delta, completions/saved/active days as a union; current settings win). The same bytes are never merged twice; an unreadable stale write is preserved and reported, not retried forever. A→B→A→B round trip is tested.
* **Data rollback** (`rollbackToLegacy`, tested): the current record is quarantined (not deleted); the next load migrates v1 again.
* The pristine pre-migration backup is **pinned**: backup rotation keeps it in addition to the 2 newest others (T).

## 7. Recovery behaviour and cross-tab limitations

**Recovery.** Nothing unreadable is replaced automatically (M2). When the current record is unreadable: exact bytes are quarantined; the best verified candidate (legacy record, then newest intact backup) is shown **in memory**; writes are disabled; the learner chooses in the recovery screen. Copies whose bytes no longer match their own fingerprint are never offered or restorable (M3). If the quarantine copy cannot be written, nothing is overwritten. A record from a newer version is never written.

**Cross-tab limits (documented, not hidden):**
1. Removals do not propagate between tabs that diverged (un-saving a word can be undone by a merge) — tested as a named known limit; a removal in the only writing tab persists.
2. Mastery is not additive: the state with more practice wins per word (an attempt in the other tab can be absorbed).
3. Score histories, tutor transcripts and per-day summaries take the longer / larger side.
4. Settings are last-writer-wins **as one group**.
5. Real browsers fire `storage` events in *other* documents only; jsdom needs manual events. The merge logic is exercised (including a merge algebra: idempotent, commutative, associative, monotonic — 150 random triples), but real multi-window behaviour is **unverified**.
6. Writes are not debounced; the whole record (including the tutor) is rewritten per change.

---

## 8. Mutation checks (controlled temporary defects)

Each defect applied alone, the full suite run, the file restored and compared byte-for-byte (`cmp`). Baseline: 535 tests green at that time.

| # | Defect | Tests failing | Restored |
|---|---|---|---|
| M1 | XP duplicate credit (award pays the full amount again) | 26 | identical |
| M2 | Recovery without confirmation (candidate adopted, writes enabled) | 4 | identical |
| M3 | Invalid backup accepted (integrity check removed on restore) | 2 | identical |
| M4a | Failed cross-tab merge on save (always overwrite) | 5 | identical |
| M4b | Failed cross-tab merge of the ledger (remote credits dropped) | 14 | identical |
| M5 | Incorrect pass threshold (0.5 instead of 0.7) | 5 | identical |
| M6 | Lost legacy data during migration (completed list dropped) | 6 | identical |
| M7 | Stale-shell drift merged more than once (fingerprint check removed) | 9 | identical |
| M8 | Idle time counted as study time | 5 | identical |
| M9 | Concurrent migration overwrites the other tab (race guard removed) | **1** | identical |
| M10 | Legacy key overwritten by the new version | 19 | identical |
| M11 | Reset/restore epoch ignored | 2 | identical |

Weakest signals (one or two tests): **M9, M3, M11** — they are real detections but thinly covered; more cases would be cheap. (A first attempt at M2 hit a formatting-changed anchor and was repeated with the correct one; the mutated file was restored each time.) The five mutated source files were verified unchanged afterwards by `cmp` against copies taken before the run.

---

## 9. Not verified

* Real browsers: cross-window `storage` events, quota behaviour per browser, Safari private mode, service-worker + storage interplay in a real installed PWA.
* Playwright/E2E journeys (fresh user, upgrade from a fixture, export → reset → import) and 05 §12 performance tests (write-amplification budget, 10 k-results load).
* Speech recognition and TTS outside the listening player as active-time signals.

---

## 10. Remaining blockers (why the verdict is NOT CLOSABLE)

| ID | Blocker | Specified? | What is missing |
|---|---|---|---|
| **B1** | **Store separation** — acceptance criterion "tutor/theme changes no longer rewrite progress blobs" unmet; settings / progress / tutor are still one record; no selectors | **Yes** (05 §2.7, §3, §6; 08 P1 (3)) | Implementation only. Deliberately not started: it is a second on-disk format change that would touch backup/quarantine granularity (05 §8 backs up *all* `bilup:*` keys), restore, drift merge and cross-tab merge — all of which were just verified. Needs its own increment with the same test matrix. Open design points: key names (05 uses `bilup:progress:<courseId>`, current code `bilup-deutsch:v2:<courseId>`), write ordering across keys, merge rule for the separated stores |
| **B2** | **Export / import and scoped reset** | **Partly** | 05 §8 says only: "JSON file, user-initiated, version-tagged, validated on import" and "reset one course or everything, with a confirmation listing what will be erased". **Missing decisions:** (a) export scope — progress only, or settings, tutor transcripts, backups too? (privacy of tutor text, 05 §10); (b) file format and version tag; (c) import semantics — replace, merge, or ask; behaviour on conflict, on a higher schema version, on an older one; (d) does import count as a deliberate replacement (epoch) and is the current record quarantined first; (e) what "reset one course" keeps (profile name, settings, learner-global streak/active days, saved words, tutor) and whether XP can be re-earned; (f) wording of the "will be erased" list in three languages; (g) whether quarantine/backups are part of "everything". Not implemented because these would be invented |
| **B3** | **Export-before-prune offer** (05 §4.4) | Yes | Depends on B2's export format |
| **B4** | **Assisted attempts** (V-16): the policy factor works (T) but the speaking UI does not mark hint use | Yes (03 §4.2 rule 5) | UI change in the speaking flow and a product decision on the factor (`assistedFactor` is 1 in the shipped table) |
| **B5** | Typed `ActivityRef` / `legacyId` mapping | Yes, but depends on manifests (P2/P3) | Legitimately waits for P2; needs approval to carry over |
| **B6** | Test layers: browser E2E, performance budgets, quota estimate / storage-pressure mode | Yes (05 §6, §12; 08 P0 deferrals) | Playwright and a device matrix (G0A decision Q14) |

Not blockers but pending **external** input: approval of the proposed values (70 % threshold, 60 s idle window, retention 500 / 90 / 400, repeats pay nothing, assisted factor, XP amounts) and **native Kyrgyz review** of all Kyrgyz strings added in P0b/P1 (PWA, storage notice, recovery screen, pass note) — they are unreviewed best effort.

## 11. 08 P1 acceptance checklist

| Acceptance criterion | Status |
|---|---|
| Pruning/archiving raw results leaves XP, completion and per-item credit unchanged | **Met** (property tests) |
| Legacy items already practised cannot re-earn first-time credit | **Met** (seeded credits; approximate for legacy quiz-question credit, see §12) |
| Repeating a quiz/writing/speaking/daily does not re-earn first-time XP | **Met** |
| Failing a unit test leaves the unit incomplete | **Met** |
| Every unit's progress denominator derives from configuration (unit 10 reaches 100 %) | **Met** (derived from content availability) |
| Corrupt / old / foreign `localStorage` never crashes the app and offers recovery | **Met** |
| Idle tab does not accumulate study time | **Met** |
| Migrating a legacy fixture yields the expected state and rollback works | **Met** |
| Tutor / theme changes no longer rewrite progress blobs | **NOT MET** (B1) |

## 12. Risks and known limitations

* Legacy quiz-question credit cannot be reconstructed: a migrated learner can earn up to 5 XP once per previously answered quiz question, and the +10 bonus once per quiz/test activity not recognisable in v1 (bounded by content).
* Mastery is updated per answer by the unchanged SRS (`answerVocab`), not inside the engine — it is durable on its own but not derived from results.
* A failed attempt is now recorded in history (attempt counts, results buffer); the record grows with attempts until pruned (bounded by policy).
* Study time that was accumulated but not yet flushed is lost if a browser kills the tab without `pagehide` (mobile).
* Learners will notice: repeats pay no XP; tests/reviews below 70 % no longer complete a section (a result note explains this); the greeting has no name until one is entered.

## 13. Data safety confirmation

* No code path deletes learner progress. The only removals of stored keys: rotation of backups beyond the newest 2 (the pristine pre-migration copy is pinned), removal of the application's own unverified record after a failed write verification, and the data-rollback function after quarantining. Explicit learner *Reset* snapshots first.
* The legacy key is never written (M10 would break 19 tests).
* German A1 functionality: no screen's content, layout or learning logic changed; diff of existing source files is limited to the provider (`store.tsx`, rewritten), adapters that report results (`QuizRunner`/`QuizPage` take a required `activity`), the greeting line, section denominators, the audio-activity hook, and the new notices. 545 tests (including the 110 P0 characterisation tests, 106 PWA tests, and real-component runs of the quiz, test, review and listening flows) pass.

## 14. Files (this task)

**Source created:** none new beyond earlier P1 work except behaviour changes below. **Source modified:** `src/storage/persistence.ts` (migration race guard), `src/app/StorageNotice.tsx` (screen stays open), `src/app/store.tsx` (`useKeepActive`, `timer.touch`), `src/features/listening/ListeningLab.tsx` (playback keeps the tab active), `src/features/progress/stats.ts` (`requiredSections`, denominators; formatting of unrelated lines was restored), `vitest.config.ts` (coverage scope).
**Tests created:** `tests/storage/{recovery-ui,cross-tab,name-and-stale-shell}.test.tsx`, `tests/progress/{thresholds.test.tsx,unit-denominators.test.ts}`; extended `tests/progress/active-time.test.tsx`.
**Docs:** this report (new); `P1_PROGRESS_STORAGE_REPORT.md` (supersession banner); `README.md` (P1 section rewritten).
**Formatted:** 4 files (see §2). **Not touched:** `dist/`, dependencies, `package.json` scripts.
