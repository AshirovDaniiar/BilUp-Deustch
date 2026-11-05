# BilUp Til 2.0 — Project Pause Checkpoint

**Date:** 5 November 2026 · **Status: DEVELOPMENT PAUSED** (owner is switching focus to Ilim Space) · **Type:** documentation-only checkpoint.
**This document grants no authorisation of any kind.** No decision status is changed by it. Nothing was committed, reset, stashed, cleaned, moved or deleted to produce it. It is the only file created by the checkpoint task.

A developer resuming after several months should be able to work from this file plus the documents it points to, without conversation history.

---

## 1. Project overview

BilUp Til 2.0 (the working tree and `package.json` still use the product identity **"BilUp Deutsch"**; the manifest says so deliberately — branding question Q12 is OPEN) is a React + TypeScript + Vite single-page German-learning app for Russian- and Kyrgyz-speaking learners (explanation languages `ru`, `ky`, `de`; one course, `de-general`). State is stored in browser `localStorage`; there is no backend. Work so far has been a hardening programme: engineering foundation (P0), PWA shell (P0b), progress integrity and recoverable persistence (P1), then a staged storage re-architecture (S1 preferences/tutor split, S2 results record). All of it is **uncommitted** in the working tree (see §3).

Where things live
* `src/` application (`src/storage/*` persistence, `src/progress/*` reward engine, `src/app/store.tsx` state, `src/pwa/*` service worker, `src/features/*`, `src/screens/*`, `src/data/*` authored content, `src/i18n/*`).
* `tests/` Vitest suites (storage, progress, pwa, fixtures). `scripts/` content validation + boundary checker. `.github/workflows/ci.yml` (written, never executed on GitHub).
* `docs/architecture/` canonical decision register, gate, S1/S2 designs and approvals (`STORAGE_*.md`); `docs/implementation/` per-stage reports (this file's neighbours). Top-level review documents in `docs/`.

---

## 2. Current Git baseline (verified at checkpoint time)

| Item | Value |
|---|---|
| Branch | `main` |
| HEAD | `386c6a110af516823f83bad6864c2b7accfb88b8` ("initial commit") — the **only** commit |
| Stashes | 0 |
| In-progress Git operation (merge/rebase/cherry-pick/revert/bisect) | none (no marker files in `.git`) |
| Commits made by this programme | **none** (P0, P0b, P1, S1, S2, S2b documents, F1/F2 fixes are all uncommitted) |
| `git diff --stat HEAD` (tracked files) | 28 files changed, 6 096 insertions, 453 deletions |
| Line-ending warnings | Git warns "LF will be replaced by CRLF" for the modified tracked files (Windows autocrlf); harmless but remember it when diffing |

---

## 3. Current working-tree state (verified at checkpoint time, before this file was created)

`git status --short`: **49 entries = 28 modified tracked + 21 untracked entries** (the untracked entries include whole directories; `git ls-files --others --exclude-standard` lists **145 individual untracked files**, of which this checkpoint adds one). The historical figure "49" from earlier reports is therefore **still correct** today.

**Modified tracked files (28):** `.gitignore`, `README.md`, `index.html`, `package-lock.json`, `package.json`, `tsconfig.json`, `vite.config.ts`; `src/main.tsx`, `src/app/store.tsx`, `src/data/types.ts`, `src/features/ai/TutorChat.tsx`, `src/features/listening/ListeningLab.tsx`, `src/features/progress/stats.ts`, `src/features/reading/ReadingLab.tsx`, `src/features/reallife/RealLife.tsx`, `src/features/speaking/SpeakingLab.tsx`, `src/features/tests/QuizPage.tsx`, `src/features/tests/QuizRunner.tsx`, `src/features/vocabulary/WordCard.tsx`, `src/features/writing/WritingLab.tsx`, `src/i18n/{de,ky,ru}.ts`, `src/screens/{HomeScreen,PracticeScreens,ProfileScreen,TopicScreen,UnitScreen}.tsx`.

**Untracked (21 entries):** `.github/`, `.prettierignore`, `.prettierrc.json`, `docs/`, `eslint.config.js`, `public/manifest.webmanifest`, `public/pwa-config.json`, `scripts/`, `src/app/{RecoveryPanel.tsx, StorageNotice.tsx, recovery-messages.ts, storage-messages.ts, storage-notice.css}`, `src/features/tests/{PassNote.tsx, pass-messages.ts}`, `src/progress/`, `src/pwa/`, `src/storage/`, `src/vite-env.d.ts`, `tests/`, `vitest.config.ts`.

**Consequence — the working tree IS the project.** Because nothing is committed, the uncommitted tree is the only copy of ~6 000 changed lines, all new storage/progress/PWA code, 31 test files and every report. **Do not run `git reset`, `git checkout .`, `git stash`, `git clean` or similar on this tree.** A backup outside the repository (and, when the owner decides, a commit on a branch) is the prudent next step — that decision belongs to the owner and is **not** taken here.

**Processes at checkpoint time (not touched):**
* A Vite dev server (`npm run dev`, node PID 26304) is listening on port **5173**. It was **not** started by this task or by the verification harness (the harness used port 5199 and stopped it). It belongs to the owner's session; it is left running.
* Unrelated Node processes exist for MCP tooling (PDF viewer, Desktop Commander). Not related to this repository.
* Ignored artefacts: `.tmp-build/` (output of `npm run build:ci`, ignored by `.gitignore`) and `node_modules/`. Verification scratch files live **outside** the repository (Claude session scratchpad) and are not part of the tree.

---

## 4. Completed milestones

Test counts are the totals reported at each milestone; the **current** totals are 773 tests in 31 files (§5).

### P0 — Engineering foundation (`P0_ENGINEERING_REPORT.md`)
Vitest + Testing Library (110 tests/9 files at P0), ESLint 9 flat config (a11y rules as warnings; 8 pre-existing warnings remain), Prettier, report-only architecture boundary checker (5 known violations `features → screens/NotFound`, 0 cycles — not enforced), content-validation skeleton (`npm run content:validate`, 0 errors), legacy-storage characterisation fixtures (`tests/fixtures/legacy`), CI workflow written but **never run on GitHub**, `npm run check` (typecheck → lint → tests → content → boundaries → build). Bundle was byte-identical to baseline at P0.

### P0b — PWA (`P0B_PWA_REPORT.md`)
Hand-written service worker (no Workbox; `src/pwa/*`), manifest with the **provisional** identity "BilUp Deutsch" (only the existing SVG favicon as icon; no PNG/maskable icons), offline **application shell only**, prompt-based update (user presses Update), three independent kill-switches (runtime `public/pwa-config.json`, build flags `VITE_PWA_DISABLED` / `VITE_PWA_KILL` which ships a kill `sw.js` at the same URL, dev server never registers). No kill path reads or writes progress data.
**Verification limits (stated by the report):** unit tests + a Node sandbox for `sw.js` + local builds only. **No real browser, Lighthouse, device or HTTPS run.** SVG-only icon installability in Chromium unconfirmed; iOS/Firefox limitations documented, untested; two-deployment update flow verified by simulation only.

### P1 — Progress integrity and storage protection (`P1_COMPLETION_REPORT.md`, `P1_PROGRESS_STORAGE_REPORT.md` — the latter partly superseded)
Result contract and reward engine (`src/progress/*`), key-based idempotent XP ledger + tombstones, pass thresholds (70 % for tests/reviews), validation/sanitisation, versioned persistence, exact-bytes backups, quarantine, learner-confirmed recovery screen (never automatic), stale-shell drift merge, cross-tab merge with epochs, measured active study time, neutral default name, truthful unit denominators. At the P1 report: 545 tests/26 files.
**Closure verdict at that report: "P1 NOT CLOSABLE".** Its blockers: B1 store separation (**since done by S1**), B2 export/import + scoped reset (**not implemented; partly unspecified**), B3 export-before-prune offer (**not implemented**; pruning of results itself was later disabled by S2), B4 assisted-attempt marking in the speaking UI (**not implemented**; STO-40–44 open), B5 typed `ActivityRef`/`legacyId` (waits for P2 manifests), B6 browser E2E / performance budgets / quota estimate (**not done**; the S2 verification used a hand-written CDP harness, not Playwright, and is not a performance or quota study). Pending external input: approval of proposed policy values, native Kyrgyz review. **P1 must not be described as closed.**

### S1 — Core / Preferences / Tutor separation (`S1_IMPLEMENTATION_REPORT.md`, `S1_DEVIATION_VERIFICATION.md`)
Three records: core `bilup-deutsch:v2:de-general` (`layout 1`), `bilup-deutsch:prefs`, `bilup-deutsch:tutor:de-general`; monolith → split upgrade (exact-bytes pinned backup, idempotent, resumable), epoch-stamped slices, per-slice damage handling with exact-byte quarantine, composite safety snapshots, tutor ordering/timestamps, cross-tab `clearTutor`. Deviation verification found and fixed two real defects (tutor lines resurrected by a stale v1 shell; a crash window in drift processing). 688 tests/29 files at closure. Accepted S1 risks and the three deviations needed owner sign-off (recorded in the report). **Native Kyrgyz review of the S1 notices outstanding.**

### S2 — Results storage (`S2_IMPLEMENTATION_REPORT.md`)
* Independent Results record `bilup-deutsch:results:de-general` (`{record:"results", v:1, epoch (informational), updatedAt, results[], deletions?, …unknown}`), `LAYOUT = 2`, `schemaVersion` stays 2; course record carries no history.
* Entries: existing header fields + optional `startedAt, levelId, evidence, entrySchema`; **unknown optional fields survive** sanitisation and rewrites; items `itemRef/outcome` (≤ 50).
* Writes: history first (read → union by `resultId` → write), then Core; a history failure never blocks credit (STO-80); in-memory pending queue, persistent failure notices, per-episode dismissible informational notices (STO-94/100), stale-epoch `replaced` notice (STO-95), pagehide/visibility flush (STO-97).
* Migration S1 → S2 (R1 pinned exact-bytes backup, R2 history merge-write, R3 verify, Core last), idempotent, crash-safe; failure ⇒ **compatibility mode** where Reset, Start Fresh, Core Restore and Rollback are refused before any write (C5); available again after a verified upgrade.
* Requirements implemented: STO-76 (snapshots exclude history, `omitted:['history']`), STO-84 (history deletion must not change progress — architecture only, no deletion operation exists), STO-90 (replacement operations never replace/delete history; Results independent of Core epochs), STO-92 (core-only restore keeps current Preferences/Tutor and merges history), STO-98/99 (Core tombstones sole duplicate authority; `entry.xp` informational; `creditStatus`). **No automatic pruning, folding or deletion.** Reset wording updated in ru/ky/de.
* Wording reconciliation recorded in the report: *preserving* existing Results (all four replacement operations) vs *merging* historical Results (only Core Restore, additions by union) vs *replacing/deleting* Results (nothing).
* Automated: `npm run check` — typecheck pass; ESLint 0 errors / 8 warnings (pre-existing); **773 tests / 31 files**; content validation 0 errors; boundaries 5 report-only / 0 cycles; production build passes. 18 mutations were killed during S2; 6 more for F1/F2.

### F1 and F2 fixes (addendum in `S2_REAL_BROWSER_VERIFICATION_REPORT.md`)
* **F1** (found in the browser, HIGH): restoring the pinned S1 backup from the damaged-Core recovery UI reset current Preferences and Tutor to defaults because `restoreFrom` read them through `readStored` (null when the Core is damaged). Fixed in `src/storage/persistence.ts` by reading the Preferences and Tutor records directly; valid ones are kept exactly. 4 regression tests.
* **F2** (MEDIUM): `retrySave` raised no `replaced` notice for a stale tab. Fixed in `src/app/store.tsx` by applying the same STO-95 check (armed once). 2 regression tests. Data was never at risk in F2.

---

## 5. Verification evidence

| Evidence | Result |
|---|---|
| Automated, current | `npm run check` exit 0: **773 tests / 31 files**, lint 0 errors / 8 warnings, content 0 errors, boundaries 5 report-only / 0 cycles, build OK (JS ≈ 517 kB, 181 kB gzip) |
| Real-browser verification of S2 (Chrome 156.0.8078.80, headless, throw-away profile, synthetic data, hand-written CDP harness over Node's built-in WebSocket, no dependency) | **First run: 78 PASS, 2 FAIL (F1, F2), 12 notes.** After the two fixes: **80 PASS, 0 FAIL, 12 notes** (80/80) |
| Scenarios covered | A migration (layout 0/1 → 2, byte-exact backup, failed writes at each stage); B cross-tab (two tabs, concurrent writes, reset with unsaved attempt, stale tab); C Reset / Start Fresh / Core Restore / Rollback / core-only restore; D quota (real browser quota error), storage-unavailable, retry, real `pagehide` and `visibilitychange`; E compatibility-mode refusals |
| **Verdict** | **VERIFIED WITH LIMITATIONS** — S2 is **not** production-certified |

Report locations: `docs/implementation/S2_IMPLEMENTATION_REPORT.md`, `docs/implementation/S2_REAL_BROWSER_VERIFICATION_REPORT.md` (includes the F1/F2 addendum and the NOT TESTED list).

---

## 6. Known limitations (do not claim these as verified)

S2 real-browser run:
* **Kyrgyz localisation has not been reviewed by a native speaker** (S1 notices, S2 notices, reset wording, recovery texts, PWA strings, pass note). Required before any Kyrgyz release.
* **Only two browser tabs** were tested; no three-or-more tab or heavy-load scenario.
* **Production build and Service Worker were not part of the browser run** (dev server only); offline shell untested in a browser.
* **Other browsers and devices not verified** (Chrome only, headless; no Safari/Firefox/Edge, no iOS/Android, no headed visual or accessibility review).
* **True process termination between two `localStorage` writes was not tested** (crash windows are covered by simulated crashes in automated tests, not a real kill).
* **Compatibility-mode restrictions for Start Fresh, Core Restore and Rollback were exercised through direct code calls in Chrome**, not through the UI (their UI is unreachable in that mode; only Reset went through the real UI). Rollback has no UI button at all.
* Real-device quota behaviour and M-series measurements (STO-52 M1…M9, S2-M9) have **not** been run; STO-79 and STO-86 are therefore unresolved.

Programme-level:
* P1 not closed (blockers in §4); export/import, scoped reset, assisted-attempt marking not implemented.
* CI workflow has never run on GitHub; nothing is committed or pushed.
* PWA: no real-browser/device/HTTPS verification; provisional branding and icon.
* Residual accepted risks documented in the reports: cross-tab residual race (S1), pending history entries lost if the session ends while storage keeps failing (R3/STO-93), history written before S2 and folded by earlier automatic pruning in development profiles is not recoverable.

---

## 7. S2b preparation status

S2b ("complete learning attempt capture") is **documented only. No S2b code exists.** Three documents, all in `docs/implementation/`:

1. **`S2B_READINESS_AUDIT.md` — verdict NOT READY.** Today the history stores only the attempt header; no learning screen captures answers, expected answers, prompts, feedback, explanation language, writing text or speaking text. Storage can carry more fields (unknown optional fields survive), but there is no size bound for them. Blockers: S2b design review/approval (STO-82 capture), STO-83 and STO-85 OPEN, STO-79/86 unmeasured, hints need STO-40/41, no learner deletion path for any free text. Staged plan S2b-0 … S2b-5. Identified that quiz answers are selections from authored options (not personal data) whereas writing/speaking text is user free text.
2. **`S2B_CONTRACT_DESIGN.md` — design prepared, NOT approved, NOT implemented.** Proposes the contract for S2b-0 (contract/limits, no capture) and S2b-1 (structural fields: `entrySchema:2`, `capture`, `courseId`, `lang`, `itemsTotal`, `omitted`; item `type`, `concept`; Tier B `xid`, `cfp`), size limits, a stable-id strategy, privacy exclusions, XP invariants, test matrix and a decision sheet. Its own verdict: overall S2b NOT READY; S2b-0/1 READY WITH CONDITIONS.
3. **`S2B_CONTRACT_RED_TEAM_REVIEW.md` — verdict ACCEPTABLE WITH CONDITIONS.** The design must not be approved unamended. 0 Critical, 5 High, 7 Medium, 2 Low findings.

### Red-team findings F-01 … F-14 (by severity)
**High**
* **F-01** "Preserve verbatim" under-specified; as worded defeats type, size, schema, integrity and privacy guarantees (unknown values are already unbounded in `unknownKeys`; no mechanism for invalid values in known keys). Replace with: preserve bytes / trust only via validating accessors / gate by `entrySchema === 2` / preservation envelope reporting issues without deleting / strict write side.
* **F-02** Absolute entry (8 192) and metadata (256) caps contradict STO-79 ("no number before a measurement report") and STO-81 ("absolute byte budgets unsupported until measured"); cap rule undefined when the header alone exceeds it (synthetic worst case 15 279 chars). Keep structural field bounds; enforce no size budget in S2b-0/1.
* **F-03** `lang` does not mean "language of the feedback": `tr()` falls back to Russian and 0 of 202 exercises have Kyrgyz feedback. Rename `uiLang` (exact meaning) or defer.
* **F-04** Stable-id plan lacks a compatibility mapping and golden id list, a content-neutral freeze release, a lock covering all id namespaces used in Core keys/URLs, handling of index-derived ids (`lq-`, `rq-`), per-type fingerprints, a "reference unverified" reader state; and it amounts to STO-60's "carry legacy keys indefinitely" approval. Replacing counters by literals equal to today's values needs **no data migration** (identity mapping).
* **F-05** Coupling risks: do not extract `toStoredEntry` from `recordResult`; no detail validation in `validateResult` (would reject the attempt and lose XP); named-copy only; `recordResult` runs twice per record so capture must be pure; `lang` via ref; `CreditFacts` type; latent daily-cap read of history (inactive). With the eight rules, capture cannot affect XP, ledger, tombstones, mastery, completed topics or achievements.

**Medium**
* **F-06** Design's size figures wrong for its own schema (1 375/5 341/+65 vs 1 165/4 411/≈+40–46; real maxima ≈ 1.6 KB); label measured / synthetic / provisional / browser.
* **F-07** `itemsTotal` range 51–1000 vs `validateResult` max 500; test T-L6 "reader never drops" is false (reader cuts items > 50 — existing S2 behaviour).
* **F-08** `courseId` redundant (always `de-general`, rejected otherwise).
* **F-09** `xid` duplicates `itemRef`; `capture`/`entrySchema`/`omitted` overlap.
* **F-10** Field vocabulary attributed to STO-82 partly absent from STO-82/§13.8 (`type`, `itemsTotal`, `omitted`, `xid`, `cfp`).
* **F-11** Register consistency: STO-14/15/61/81/93/96 not cited; STO-14 default (prune early) conflicts with approved STO-87; STO-60 default is opaque ids; two handle schemes (U1–U9 vs P-1–P-10).
* **F-12** S2b-1 delivers little value for most of the 13 kinds.

**Low**
* **F-13** Test-plan gaps (proto/nesting/oversize fixtures, accessor tests, golden-id test, old-bundle/new-bundle shared storage, `lang` switch, double `recordResult`, normaliser-throws, history preloaded, canonical-JSON tie-break note).
* **F-14** Statements to soften (≤ 15 items verified only for some screens; prototype safety verified only for this mechanism).

---

## 8. Open owner decisions (none is approved by this checkpoint; none resolved)

**Required before the S2b design can be approved (red-team conditions)**
| Ref | Decision | Depends on |
|---|---|---|
| **C-1** | Safe unknown-field preservation policy (replaces P-1 of the design) | F-01 |
| **C-2** | Size limits and their relationship to STO-79 and STO-81 (no enforcing size budget in S2b-0/1; structural bounds only) | F-02, F-06, F-07 |
| **C-3** | `lang` → `uiLang` rename, or deferral | F-03 |
| **C-4** | Reduced field allowlist (drop `courseId`, `capture`, `xid`, `omitted` unless explicitly wanted; keep `entrySchema:2`, item `type`/`concept`, `itemsTotal`) and acknowledgement of S2b-1's limited value | F-08, F-09, F-10, F-12 |
| **C-5** | Stable exercise-id freeze (golden list, content-neutral release, all-namespace lock, fingerprints, "reference unverified") framed as the STO-60 approval | F-04 |

**Engineering/documentation tasks (no owner approval needed, still not done)**
* **C-6** Capture/reward isolation rules (F-05).
* **C-7** Decision-register consistency corrections (F-10, F-11).
* The additional tests of F-13.

**Register decisions that remain OPEN / PROPOSED and gate later stages**
STO-79 (budgets/retention), STO-86 (storage tier), STO-83 (content versioning), STO-85 (free-text privacy), STO-60 (opaque ids/legacy alias), STO-40/41 (hint behaviour/representation), STO-42–44 (assisted XP), STO-14/15 (quota policy, retention parameters), STO-89/91 (history-deletion backup/retention). Owner-confirmed/approved and binding: STO-71, 76, 82 (architecture only), 84 (requirement), 87, 88 (reserved field only), 90, 92, 93–100.

---

## 9. Exact pause boundary

**Completed**
* P0 · P0b implementation · P1 implementation (with documented closure limitations) · S1 implementation · S2 implementation · F1 and F2 fixes · S2 real-browser verification (80/80, VERIFIED WITH LIMITATIONS) · S2b readiness audit · S2b contract design · S2b red-team review.

**Not completed**
* Full P1 closure (B2–B6) · production-level PWA verification · cross-browser and cross-device verification · native Kyrgyz review · S2b design corrections (C-1…C-7) · S2b owner approval · **S2b-0 implementation · S2b-1 implementation** · detailed answer and feedback capture · writing and speaking history expansion · history UI · export/import · history deletion · IndexedDB · backend synchronisation · committing/pushing any of the work.

Nothing in the "not completed" list is implemented, partially implemented or stubbed in the code. (The only S2b-adjacent code present is S2's own: optional `startedAt/levelId/evidence/entrySchema` and preserved unknown fields.)

---

## 10. Resume instructions (in order)

1. **Inspect the preserved working tree and verify integrity:** `git status --short` should still show 28 modified + 21 untracked entries on `main` at `386c6a1`; `git stash list` empty. Run `npm ci` only if `node_modules` is missing, then `npm run check` — expect exit 0 with 773 tests / 31 files, 0 lint errors / 8 warnings. If anything differs, stop and reconcile before any work. Consider (owner decision) taking an external backup/branch commit first.
2. Read this file (`docs/implementation/PROJECT_PAUSE_CHECKPOINT.md`).
3. Read `S2_IMPLEMENTATION_REPORT.md` and `S2_REAL_BROWSER_VERIFICATION_REPORT.md` (including the F1/F2 addendum and NOT TESTED list).
4. Read `S2B_READINESS_AUDIT.md`, `S2B_CONTRACT_DESIGN.md`, `S2B_CONTRACT_RED_TEAM_REVIEW.md`.
5. Review findings F-01 … F-14 (§7).
6. **Only after the owner decides C-1…C-5**, correct the S2b design documentation (C-6, C-7, test additions included).
7. Re-run the independent design review of the corrected design.
8. Obtain **explicit written owner approval for S2b-0** (and separately for S2b-1).
9. Implement **only** the separately authorised stage.
10. Run all required automated tests and the real-browser harness (re-run the 80 checks plus the new items listed in the design's test matrix); report with the same evidence discipline (PASS/FAIL/NOT TESTED).

Independent of S2b, outstanding quality items an owner may wish to schedule: native Kyrgyz review; production-build/Service Worker/offline browser run; second-browser and device runs; STO-52/S2-M9 measurements (needed for STO-79/86); CI first run; first commit/branching strategy.

---

## 11. Explicit authorisation restrictions

* **No implementation authorisation is granted by this checkpoint.** S2b-0, S2b-1 and every later S2b stage remain unauthorised; S2b implementation has **not** started.
* Not authorised: history UI, export/import, history deletion, IndexedDB, backend synchronisation, new dependencies/Playwright, changes to S2 storage behaviour, resolving any OPEN decision, committing/pushing, resetting/stashing/cleaning the tree.
* The rules in force from earlier owner instructions still bind future work: never auto-prune/fold/delete history; Results independent of Core epochs; the Core is the sole reward authority; a failed Results write never grants XP; no unapproved change to tombstone expiry or XP rules; no silent loss of pending entries; unknown optional fields survive; git: no commit or push without separate permission.

---

## 12. Final preservation verification

Recorded by comparing the tree before and after creating this file:
* `git status --short` before: 49 entries (28 `M`, 21 `??`), identical entry list afterwards (the new file lies inside the already-untracked `docs/` directory, so the status line count does not change; per-file verification below).
* A SHA-1 inventory of `docs/`, `src/`, `tests/`, `scripts/`, `public/` (201 files) was taken before writing; afterwards **only** `docs/implementation/PROJECT_PAUSE_CHECKPOINT.md` is new and **no existing file differs**.
* No commit created; HEAD unchanged at `386c6a1`; no stash; no processes started by this task remain (the checkpoint task started none; the verification harness's earlier dev server on 5199 and Chrome profiles were already stopped/deleted; the owner's dev server on 5173 is untouched).
* Application source, tests, dependencies and package files: **not modified by this task**.

*Development of BilUp Til 2.0 is paused before S2b implementation.*
