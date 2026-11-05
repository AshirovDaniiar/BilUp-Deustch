# S2 Real-Browser Verification Report

**Date:** 5 November 2026 · **Scope:** verification of the implemented S2 only (no S2b, no history UI, no export/import, no deletion, no new dependency, no Playwright, no source change, nothing committed).

## 1. Environment

| Item | Value |
|---|---|
| Browser | **Google Chrome 156.0.8078.80** (the installed browser), run with `--headless=new` (real Chrome engine; no window shown) |
| Driver | Chrome DevTools Protocol over Node's built-in `WebSocket` (Node 24) — a ~250-line throw-away script in the session scratchpad; **no dependency added, nothing installed** |
| Profile | A **new empty temporary profile** (`--user-data-dir` in the OS temp folder), deleted afterwards. No real learner profile was opened, read or modified. Confirmed afterwards: 0 of my Chrome processes and 0 profile folders remain; the user's own Chrome was not touched |
| App under test | `vite` dev server on `localhost:5199` serving the **current working tree** (HEAD `386c6a1` + all uncommitted work incl. S2). Dev server, not the production build; the Service Worker was not exercised |
| Data | **Synthetic only**: learner "Synthetic Learner" with attempts `seed-0…seed-n` (lessons, real engine credit: 20 XP each), seeded in the browser with the app's own serializers (the S1 layout-1 / monolith formats), plus the app's own UI for new attempts (real-life topics) |
| Faults | (a) **real**: browser's own `QuotaExceededError` (localStorage filled to 5 242 879 B); (b) **injected** by wrapping `Storage.prototype.setItem` in the page (per-key failure, silent "lost" write, `localStorage` access denied, storage events suppressed) — every injected case is labelled below |
| Result | `final.json` / `final.log` in the session scratchpad (78 PASS, 2 FAIL, 12 notes) |

Honest limits of the method: the harness runs headless; there is no human-visible rendering review; seeding uses the app's own serializers (so S1-format bytes are the app's, not independently hand-built); a true process-kill between two `localStorage` writes cannot be produced deterministically from outside.

## 2. Verdict summary

| | Scenario | Result |
|---|---|---|
| A | Migration | **PASS** (24 checks) — one sub-case partial (see A4) |
| B | Cross-tab | **PASS for data safety**; **FAIL** for one required notice (B2b.6) |
| C | Replacement operations | **PASS** for Reset, Start Fresh, Rollback, full-composite Restore, history merge; **FAIL: core-only restore does not preserve current Preferences/Tutor on the UI path (C3a.2)** |
| D | Storage failure | **PASS** (11 checks; real quota; real pagehide; real visibility-hidden) |
| E | Compatibility mode | **PASS** (9 checks) |

## 3. Failures (stop-and-report items)

### F1 — STO-92 violated on the real recovery path (C3a.2) · severity: HIGH (data is kept, but in the wrong place)
* **Steps (real Chrome, reproduced 4 times):** S1 profile → upgraded (pin = layout-1 backup) → current preferences set to `CURRENT NAME`/light, tutor message `tutor-current` added, 2 more attempts → stored course record damaged → app opens in recovery → learner clicks **Restore** on the pinned S1 copy and confirms.
* **Expected (STO-92):** Core restored from the copy; **current Preferences and Tutor kept**; history merged.
* **Actual:** Core restored (XP 60, 3 tombstones ✔) and history kept (5 entries ✔), but the live **preferences record was overwritten with defaults** (`name:""`, `theme:"auto"`) and the **tutor record emptied** (`messages:[]`). Writes during the restore: `quarantine ×2`, `v2`, `prefs {name:"",…}`, `tutor`.
* **Not permanently lost:** the learner's `CURRENT NAME` and `tutor-current` survive in the two quarantine copies the restore created first (verified by searching every stored value). But the UI offers no way to restore a preferences/tutor copy, so the learner would have to use "download all saved data".
* **Cause (code reading + control):** `restoreFrom` obtains the current preferences/tutor with `readStored(kv)`, which returns `null` when the stored **core** is unreadable. The recovery UI offers Restore only in exactly that state, so the preservation branch is skipped and the copy's default slices are committed. **Control (C3a.ctl, PASS):** the identical `restoreFrom` call on a *healthy* core preserves preferences and tutor — which is why the jsdom test (healthy core) passed.
* **Not changed:** no source edit was authorised for this task. Needs an owner decision on the fix (e.g. read the preferences/tutor records directly, not through the core).

### F2 — STO-95 notice missing on the retry path (B2b.6) · severity: MEDIUM (data safe, learner not told)
* **Steps:** tab 2 holds an unsaved attempt (its writes fail); tab 1 resets (core epoch replaced); tab 2 **misses the storage event**; the failure clears and tab 2 presses **Retry**.
* **Expected:** informational notice `replaced` ("saved in history, XP is not part of current progress").
* **Actual:** attempt correctly kept in history exactly once, **no XP** credited (XP 0, no tombstone), but **no notice** at +50 ms … +2 s. When the tab *does* receive the storage event (B2a) the notice appears ✔.
* **Cause:** the `replaced` check exists in the main save effect and the storage-event path; **`retrySave` adopts the replaced core without it** (`src/app/store.tsx`, retrySave block).

## 4. Scenario evidence

Format: initial state → actions → expected → actual → result. "Dump" = the localStorage records (summaries, no personal data).

### A. Migration (real Chrome)
| ID | Initial state | Actions | Expected | Actual | Result |
|---|---|---|---|---|---|
| A1 | layout-1: `v2` (history inline ×3) + `prefs` + `tutor` + legacy key + unknown key | open app | layout 2; history in `results` record ×3; XP/tombstones unchanged; pin = exact original bytes; prefs/tutor/legacy/unknown byte-identical; order backup → results → course | all as expected; observed writes `[backup, results, v2]` | **PASS** (A1.0–A1.6) |
| A2 | layout 0 monolith ×2 | open app | → layout 2 directly, exact pin | as expected | **PASS** |
| A3 | upgraded profile | real reload | no second migration (0 writes from the new load, same pin, no new backup, results record byte-identical) | as expected; only the previous session's pagehide study-time save changed the course record | **PASS** |
| A4.1–4 | layout 1 ×3 | **[injected]** fail the backup / the history / the course write, or silently lose the history write; then open healthy | original bytes and data intact after the failed session; next healthy load converges to layout 2, 3 attempts, XP 60, pin = exact pre-upgrade bytes | all 4 stages × (intact / not half-upgraded / disk-safe after close / converges) | **PASS** (16 checks) |
| A4 crash | — | true process-kill mid-write | — | cannot be produced deterministically | **NOT TESTED** (partially covered by failed/lost-write stages and the jsdom crash matrix) |

Note found while verifying: a compat-mode session legitimately re-saves the layout-1 record on tab close; the pin is the bytes stored **at upgrade time**, not the pre-failure bytes. Credit entries are re-serialized compactly (`creditedTo` omitted when equal to `xp`) — pre-existing S1 normalization, not a loss.

### B. Cross-tab (two real tabs, real `storage` events)
| ID | Actions | Expected | Actual | Result |
|---|---|---|---|---|
| B1 | 2 tabs, 4 rounds × (near-concurrent click in both) = 8 new attempts on 2 seed attempts; control: same 8 in one tab (XP 110) | 10 history entries once each; 10 tombstones; XP = control | 10/10/110, no duplicates; a 3rd tab reads the same state, writes nothing | **PASS** (B1.1–4) |
| B2a | tab 2 has an unsaved attempt (writes failing, persistent notice shown); tab 1 Reset (confirmed); tab 2 recovers (events delivered) | reset keeps history byte-identical; the attempt is kept once; no stale XP | history 4 entries, attempt once, XP 0, no tombstone, `replaced` notice shown | **PASS** |
| B2b | same, but tab 2 **misses storage events** (injected) and presses Retry | same data outcome **and** `replaced` notice | data outcome ✔ (attempt once, XP 0, reload stable); **notice absent** | data **PASS** / notice **FAIL (F2)** |
| B-stale reload | reload tab 2 | same stored state | unchanged | **PASS** |

### C. Replacement operations
| ID | Initial | Actions | Expected | Actual | Result |
|---|---|---|---|---|---|
| C1 Reset (real UI) | layout 2, 3 attempts | Profile → Reset, confirm | results record byte-identical and never written; XP 0; confirm text (ru) says history is kept and deletable only separately | as expected. Writes: `backup, v2, prefs, tutor` — none to `results` | **PASS** |
| C2 Start Fresh (real UI) | core record damaged | notice → Options → Start Fresh → confirm | results byte-identical, not written; fresh core XP 0; history ×3; damaged bytes quarantined | as expected | **PASS** |
| C3a Core-only restore (real UI) | S1 pin; current prefs/tutor edited; 2 more attempts; core damaged | Restore the pinned copy | Core from copy; **prefs & tutor preserved**; history 5 kept | Core ✔, history ✔, pin unchanged ✔, damaged bytes quarantined ✔; **prefs/tutor reset to defaults** | **FAIL (F1)** (C3a.1, .3, .4 PASS) |
| C3a.ctl | same but core **healthy**, API call in real Chrome | `restoreFrom(pin)` | prefs/tutor preserved | preserved | **PASS** (control) |
| C3b/c Composite restore + history merge (real UI) | live history `seed-0…2` + copy with `seed-0, hist-only-1, hist-only-2` (S1-era snapshot, content-addressed) | Restore the copy | core and prefs from copy (name `COPY NAME`); history = **union**, `seed-0` once; nothing removed | as expected | **PASS** |
| C4 Rollback (**API call in real Chrome — the app has no Rollback button**) | layout 2 + legacy record | `rollbackToLegacy` | only core/prefs/tutor removed; results byte-identical; legacy untouched; next start migrates and re-attaches all history | as expected | **PASS** |

### D. Storage failure
| ID | Setup | Expected | Actual | Result |
|---|---|---|---|---|
| D1 **real quota** | localStorage filled to the browser's own limit (genuine `QuotaExceededError`) | persistent notice, no dismiss, retry offered; older history untouched; after freeing space + Retry: attempt once in history and ledger; reload: no 2nd credit | all as expected | **PASS** (D1.0–D1.4) |
| D2 [injected: only the history key fails] | — | XP/tombstone saved, entry pending, notice with count; Retry saves once, XP unchanged | as expected | **PASS** |
| D3 [injected: `localStorage` access throws `SecurityError`] | — | app still renders and tells the learner | as expected | **PASS** |
| D5 pagehide (**real navigation away**) | pending entry, storage then healthy, no retry click | flushed | entry persisted | **PASS** |
| D5 visibility (**real** tab switch; `visibilityState` reported `hidden`) | same | flushed | persisted | **PASS** |

### E. Compatibility mode
Setup **[injected: backup writes fail]** so the layout-1 upgrade cannot complete (a restorable copy pre-exists).
| ID | Expected | Actual | Result |
|---|---|---|---|
| E0 | layout stays 1, data intact, `upgrade-pending` notice | as expected | **PASS** |
| E1 Reset (real UI) | refused with message, **0** `setItem/removeItem` calls, nothing changed | as expected | **PASS** |
| E2 Start Fresh / E3 Core Restore / E4 Rollback (**API calls in real Chrome** — their UI needs a damaged core) | refused (`blocked: upgrade-pending`), **0** writes | as expected | **PASS** ×3 |
| E5 | storage byte-identical after the four refusals | identical | **PASS** |
| E6–E8 | healthy session: upgrade completes; operations available; Reset (real UI) works, history ×3 kept, no refusal | as expected | **PASS** |

## 5. Report wording reconciliation (request §4)
Corrected in `S2_IMPLEMENTATION_REPORT.md` §2. The sentence "Reset, Start Fresh, Core Restore and Rollback never touch the history record" mixed three things:
* **Preserving existing Results** — all four operations; Reset/Start Fresh/Rollback do not even write the record (verified byte-identical, C1/C2/C4).
* **Merging historical Results** — only Core Restore may write the record, and only by union (adds entries the source carries that Results lacks; verified C3c); never before a failed merge allows replacement.
* **Replacing or deleting Results** — nothing does (no check observed any removal or overwrite).
Behaviour matches the approved architecture; only the wording was imprecise. No code was changed for this.

## 6. Final verdict

# **VERIFIED WITH LIMITATIONS** — superseded: F1 and F2 were fixed and re-verified (see Addendum).

* Data safety held in every scenario: no history entry was ever lost, duplicated or silently replaced; no XP was granted without the Core; real quota, real pagehide/visibility, real cross-tab and the migration matrix behave as designed.
* **Two deviations from the approved design** were found only because of the real browser (F1, F2). F1 resets the learner's preferences and tutor chat in place on the recovery path (recoverable from quarantine, but contrary to STO-92).

### Not tested
* True process kill between two writes (A4 crash).
* Production build / Service Worker / offline shell; other browsers (Firefox, Safari), mobile browsers.
* Headed-window rendering and visual review; accessibility of the new notices with a screen reader.
* Rollback and Start Fresh/Core Restore *in compatibility mode* through the UI (not reachable there); exercised via API in real Chrome.
* Concurrency beyond two tabs / 4 rounds; storage events under heavy load.
* Kyrgyz notice and reset texts (unreviewed; only their presence is covered by tests).
* Real-device quota behaviour (other browsers have different limits).
* M-series measurements (size/timing budgets).

### Remaining risks
F1 and F2 above; R3 (session ends while storage keeps failing) as accepted; the S1 residual cross-tab race; earlier S1 pruning of dev profiles not recoverable.

**Git:** unchanged by this task — 28 tracked modified, 21 untracked entries, HEAD `386c6a1`; this report and the wording fix are the only files written. Nothing committed. S2b not started.

---

# Addendum (5 Nov 2026) — F1 and F2 fixed and re-verified

Owner authorised fixing F1 and F2 only. Nothing committed; no dependency added.

## F1 — Preferences and Tutor reset on pinned-backup Restore
* **Root cause:** `restoreFrom` obtained the current preferences/tutor through `readStored`, which returns `null` when the course record is damaged — exactly the state in which the recovery UI offers Restore. The STO-92 branch was skipped and defaults were written.
* **Files:** `src/storage/persistence.ts` (`restoreFrom`).
* **Implementation:** when `readStored` returns null, the preferences and tutor records are read directly (`readPrefs`/`readTutor`, independent of core health). A record that reads `ok` is kept exactly (epoch raised to the restore epoch); absent/damaged/newer records follow the existing behaviour (defaults in memory, damaged bytes already quarantined by `preserveCurrent`). Healthy-core path unchanged. History merge, quarantine and safety snapshot unchanged.
* **Tests:** `tests/storage/s2-results.test.ts` — 4 new: damaged core + valid prefs/tutor via pinned S1 backup (memory, disk, reload, history merged); independently damaged preferences; independently damaged tutor; retry after a failed restore.
* **Data safety:** only removes a loss; no record is deleted or overwritten with defaults while valid. Mutation (branch disabled) fails the new tests.

## F2 — No `replaced` notice after Retry
* **Root cause:** `retrySave` adopted the merged core without the STO-95 stale-epoch check that the save effect and `syncFromStorage` perform.
* **Files:** `src/app/store.tsx` (`retrySave`).
* **Implementation:** same condition (higher epoch adopted and locally credited, never-persisted entries absent from the new Core) → `setReplacedNotice(true)`; the notice is armed only if not already shown. Results are saved by the existing path; XP still comes only from the Core.
* **Tests:** `tests/storage/s2-app.test.tsx` — 2 new: missed event then Retry (notice, Results kept, no XP, tombstone absent); second Retry does not re-raise, dismissal, later failure episode re-arms per STO-94/STO-100. Mutation fails both.
* **Data safety:** UI notice only; no storage behaviour changed.

## Verification
* `npm run check`: typecheck pass; ESLint 0 errors / 8 warnings (pre-existing); **773 tests / 31 files pass** (767 + 6); content validation 0 errors; boundaries 5 report-only; production build passes.
* **Real Chrome 156.0.8078.80, same harness, temporary profile, synthetic data: 80 PASS, 0 FAIL, 12 notes** (previously 78 PASS, 2 FAIL of the same 80 checks). C3a.2 and B2b.6 now PASS; all 78 earlier PASS checks still PASS.
* Not tested (unchanged): true process kill between writes, production build/Service Worker/offline, other browsers/mobile, headed visual review, Kyrgyz review, >2 tabs.

## Verdict: **VERIFIED WITH LIMITATIONS** (limits = the unchanged NOT TESTED list above; both deviations resolved).
