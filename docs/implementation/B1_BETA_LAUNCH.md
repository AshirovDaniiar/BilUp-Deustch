# B1 Beta Launch — available to all learners on the Russian and Kyrgyz interfaces

**B1 is a BETA, not a stable release, not a certification.** It was activated through the existing Beta mechanism (the same one as A2): `COURSE.levels` entry `B1` changed from `status: 'planned', releasedLocales: []` to **`status: 'beta', releasedLocales: ['ru', 'ky']`** in `src/data/course.ts`. No other switch exists or was added: no pilot group, no per-account restriction, no feature flag. The formal release gate (`content:validate:release`) is **closed** and was neither changed nor bypassed. No CEFR, Goethe/telc, native-speaker or expert approval is claimed; no open decision (D-1…D-14, X-1…X-7) was approved.

## 1. Activation
* **One-line registry change** (`src/data/course.ts`, comment updated) — everything else (level tabs, routes, lazy loading, the Beta notice, the service-worker handling of lazy level chunks) already followed the A2 Beta architecture and generalises to B1 (verified by tests and in the browser, §5).
* **Beta notice:** the existing `BetaNotice` component (used on the level tabs and on unit screens) already renders `betaNoticeLevel` for any `beta` level. Russian: *«Уровень B1 находится в бета-версии. Материалы ещё проходят экспертную проверку, поэтому часть переводов может быть изменена. Мы будем рады вашим отзывам.»* Kyrgyz: *«B1 деңгээли бета-версияда. … Пикириңизди билдирсеңиз, кубанабыз.»* Exactly **one** notice per page (checked on all 12 unit pages and the catalog). **No feedback button exists in the app** (the A2 notice only says feedback is welcome), so none was invented.
* **German interface:** B1 is not offered (a level is offered to `de` only when `released`); its unit and assessment routes are "not found" there.

## 2. Availability (verified)
* `availableLevels('ru')` and `('ky')` = A1, A2, **B1**; `availableLevels('de')` = A1. The registry holds exactly the 12 approved permanent units and keys (`b1-erlebnisse-erinnerungen` … `b1-rueckblick-pruefung`), all 12 wired into the lazy `B1_CONTENT` chunk (`b1-content-*.js`, 1.23 MB, not precached); unit tests `unit-21…32` and `level-b1` registered; `levelTest` carries 60 items. No route returns "not found" for any unit, vocabulary page, grammar page, text, writing task, speaking scenario or test.
* **The 12 visible units:** 21 Erlebnisse und Erinnerungen erzählen · 22 Meinungen äußern und diskutieren · 23 Arbeit, Bewerbung und Karriere · 24 Wohnen, Umzug und Umwelt · 25 Gesundheit, Beziehungen und Lebensstil · 26 Medien, Technik und Nachrichten · 27 Konsum, Geld und Reklamation · 28 Bildung, Lernen und Zukunftspläne · 29 Reisen, Kultur und Alltag im Vergleich · 30 Gesellschaft, Zusammenleben und Engagement · 31 Behörden, Verträge und Alltagsprobleme · 32 Rückblick, Bilanz und Prüfungsvorbereitung.
* **The 60-item `level-b1` assessment** (A 10 · B 30 · C 12 · D 0 · E 8; 70 % overall and 50 % per part; bands qualified "по проверенным частям"; the card states that listening is not tested for a technical reason) is listed on the Tests page ("Тесты по уровням — B1 — 60 вопросов") and runs start to finish.

## 3. Test updates caused by the launch (no test weakened)
Activating B1 changed the *shipped* state that many tests had pinned as "B1 is planned". Each was updated to the new truth, never skipped:
* **B1 integration and unit tests** (`tests/b1/*`): "B1 is planned" → "B1 is a Beta for ru and ky"; the hidden-state checks (routes "not found", chunk never requested) are kept as an explicit **hypothetical `planned` state** that each test switches on and restores; after each test B1 returns to the shipped Beta. Per-unit validator expectations gained the two Beta flags (ru, ky).
* **A1/A2 "worlds"** (`a1-world`, `a2-world`, `level-scoping-empty`) describe the course *without* B1 — they plan B1 in their existing setup hook; `lazy-level`, `a2-beta-readiness`, `catalog`, `infrastructure`, `metadata` expectations list B1 where the real registry is meant.
* **Fixture** `withoutB1Content` marks B1 `planned` (a level with no units cannot be visible), like the A2 fixture.
* **New** `tests/b1/beta-launch.test.tsx` (12 tests): the shipped registry (beta, ru/ky only, not `released`), every learner of ru/ky is offered B1 with no restriction, 12 permanent units wired, the Learn page lists all 12 with one Beta notice, all unit/test/writing/speaking routes resolve for ru and ky, the level test is listed with 60 questions, German never sees B1, A1 unchanged, honest notice text, and the release gate still reporting the B1 reviews as pending.

## 4. Automated results
| Check | Result |
|---|---|
| Full Vitest | **111 files, 3335 tests, all passed** (3323 before; +12) |
| `tsc --noEmit` | clean |
| ESLint | 0 errors, 8 baseline warnings |
| Prettier `format:check` | clean |
| `content:validate` (authoring) | **0 errors, 0 warnings, 91 review flags** (the 67 earlier + 24 Beta flags: no recorded Russian/Kyrgyz review for any of the 12 units) |
| **`content:validate:release` (the release gate)** | **CLOSED — 67 errors** (22 `cefr-signoff-missing`: A2 11–20 and B1 21–32; 44 `release-gate-review`: no recorded Russian/Kyrgyz review for A2 Units 11–20 and B1 Units 21–32; 1 A2 `unit-minimum`: no A2 level test). Before the launch it was 43; the 24 additional errors are exactly B1's missing ru/ky reviews, now counted because B1 is released for those locales. **Not passed, not bypassed.** |
| Production build | succeeds (`b1-content-*.js` 1.23 MB lazy chunk beside `a2-content-*.js` 0.84 MB; main bundle 0.61 MB) |

## 5. Browser QA — real Chromium via Playwright, Vite dev server, **no COURSE patching** (a fresh learner on the shipped state; only the interface language was seeded), PWA install notice never dismissed
The learner flow was driven by clicking: Learn → level tab **B1** → each unit link → unit page → routes of that unit. Four combinations:
| | ru 1280 px | ky 390 px | ru 390 px | ky 1280 px |
|---|---|---|---|---|
| Scope | **full** | **full** | standard | standard |
| Level tabs show A1 / A2 / B1 | ✓ | ✓ | ✓ | ✓ |
| Catalog lists units 21–32; exactly one Beta notice | ✓ 12 | ✓ 12 | ✓ 12 | ✓ 12 |
| Every unit opened from the catalog (title, vocabulary link, all of its writing tasks, speaking scenario, unit test link, one notice, no overflow) | 12/12 | 12/12 | 12/12 | 12/12 |
| Vocabulary page, first grammar topic and grammar page of every unit | 12/12 | 12/12 | 12/12 | 12/12 |
| Reading and listening quizzes answered to the end | **48/48** | **48/48** | 24/24 (first text of each unit) | 24/24 |
| Writing tasks analysed with the model text (main tasks and micro-tasks; checklist shown, no score bar) | **29/29** | **29/29** | 12/12 (main tasks) | 12/12 |
| Speaking scenarios played turn by turn to the end | **12/12** | **12/12** | 3/3 (21, 26, 32) | 3/3 |
| Unit tests answered completely (pass note "passed") | **12/12** | **12/12** | 3/3 | 3/3 |
| Level assessment listed on the Tests page, then all 60 items answered (incl. word-order items) | ✓ → band **reached** (60/60) | ✓ → band **almost** (52/60, part E 0/8) | ✓ → band **repeat** (30/60) | ✓ → band **reached** (60/60) |
| Result card: band, parts A/B/C/E, fixed statement, **listening note** shown | ✓ | ✓ | ✓ | ✓ |
| PWA install notice visible during the whole run and never dismissed; `has-pwa-note` set; nothing blocked | ✓ | ✓ | ✓ | ✓ |
| Horizontal overflow / console errors / broken routes | none | none | none | none |
"Standard" = the first reading, listening, writing and speaking item of each unit plus unit tests 21, 26 and 32 (not every item). **German interface (1280 px):** no B1 tab, 0 B1 links, the unit and assessment routes show "Seite nicht gefunden"; no error.
**Not verified:** real devices, iOS Safari (including its separate install notice), Firefox, Edge, screen readers, **real speech output** (listening is text-to-speech in the browser; headless Chromium cannot confirm audible playback), the native-language quality of any text, and ru-390 / ky-1280 for *every* item (sampled as stated).

## 6. Release gate status and remaining limitations
* **The gate is closed** (§4). A Beta needs no recorded reviews; a stable release does. The authoring validator reports them as Beta review flags, never as passed.
* **Not claimed anywhere:** CEFR level or certification, Goethe/telc/ÖSD equivalence, native-speaker approval, expert review. The assessment states it is an indicative progress check (tested).
* **Open decisions** — all still pending: D-1…D-14 (grammar placement, closed lists, text ramp, mediation, prerequisite policy) and X-1…X-7 (see `scripts/content-validate/b1/decisions.ts`); 14 raise validator review flags; nothing was approved.
* **Known limitations of the Beta:** unreviewed AI-assisted German and **Kyrgyz** (a draft); the six Kyrgyz glosses and the vocabulary gaps registered for owner/native review (P2 report); the listening part of `level-b1` is empty for a *technical* reason (speech output unverified on real devices); thresholds and form size of `level-b1` are provisional and uncalibrated; no learner pilot; no feedback mechanism in the app.

## 7. Git (see §8–9 for the exact record)
Before any Git operation the state was recorded; the 15 staged Storage/app/test files were set aside and never touched. A path-scoped commit (`git commit -m … -- <explicit paths>`) was used, so the index entries of the 15 staged files and their staged diff stayed byte-identical.

## 8. Commit
* **Hash:** `9815e82c57415a2dd14ac7758810551acbe8b2c1` (short `9815e82`), message `feat(b1): launch B1 beta for all learners`, on top of `92a1917` (A2 Beta). Author as configured in the repository. **Not pushed.**
* **Content:** 207 files — 158 added, 49 modified, **0 deleted**; 46,136 insertions, 163 deletions. Added: `src/data/b1/**` (12 unit folders, registry, content module, metadata, level test, glossary, vocabulary review), `scripts/content-validate/b1/**`, `profile.ts`, `rules/b1.ts`, `src/features/tests/{LevelResultCard,levelAssessment}`, `src/features/feedback/SelfAssessment.tsx`, `src/services/feedback-mode.ts`, `tests/b1/**` (32 files), `tests/content-validate/b1-*`, `tests/pwa/reserve-space.test.tsx`, `docs/b1/**` and `docs/implementation/B1_*.md` (22 reports incl. this one). Modified (49): the course registry (the Beta switch), catalog/loader/route access, the Beta notice, quiz/writing/speaking screens, i18n (ru/ky/de strings), PWA prompt + CSS (notice no longer covers controls), validator wiring, bundle-size/PWA build scripts, and the tests that pinned the old state.
* **Path-scoped:** the commit was made with explicit paths (`git commit -F msg -- <207 paths>`); I verified afterwards that it contains exactly those paths, **no** path of the 15 staged files, and no deletion.
* This section was written after the commit and is recorded in a small follow-up docs-only commit (a file cannot contain the hash of the commit that adds it).

## 9. The 15 staged files (verified after the commit)
`src/app/StorageNotice.tsx`, `src/app/storage-messages.ts`, `src/app/store.tsx`, `src/storage/{activity,merge,persistence,results,slices,validate}.ts`, `tests/legacy-storage.test.tsx`, `tests/progress/engine.test.ts`, `tests/storage/{s1-split.test.ts,s1-verification.test.tsx,s2-app.test.tsx,s2-results.test.ts}` — **still staged; the staged file list and the staged diff are byte-identical to the copies recorded before any Git operation (15 files, 513 insertions, 103 deletions); none is part of the commit.** No `git reset`, `restore`, `stash` or unstaging was used.

## 10. Final confirmations
No push was performed. A1/A2 learning content and Storage/Persistence were not modified (the A1/A2 test files that changed only describe the course without B1 or list B1 where the real registry is meant). No unit was rewritten for the launch. P3 and a new audit were not started. Untracked `.playwright-mcp/` (browser-tool logs) was deliberately left out of the commit.
