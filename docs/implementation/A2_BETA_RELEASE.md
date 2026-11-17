# A2 controlled Beta release (Russian and Kyrgyz)

**Status: A2 is `beta` for `ru` and `ky`** (`src/data/course.ts`: `status: 'beta'`, `releasedLocales: ['ru', 'ky']`), by explicit owner approval. **Human CEFR and native-language reviews are NOT done**: `A2_REVIEWS` is empty, all 30 review records are `pending`, and nothing in this release claims approval. The A2 Level Test and Placement Test do not exist yet. Nothing is committed.

## 1. Release-gate policy (validator)

| Level status | Human sign-offs, locale reviews, level test |
| --- | --- |
| `planned` | hidden; as before |
| `beta` | **non-blocking review flags**: `cefr-signoff-missing` (10), `beta-review-pending` (one per unit and released locale: 20), `beta-level-test-missing` (1). `content:validate`: **0 errors, 0 warnings, 31 review flags** |
| `released` / `--release` | **unchanged blocking errors**: `cefr-signoff-missing`, `release-gate-review`, `unit-minimum` (no level test). `content:validate:release`: **31 errors** |

Implementation: `ctx.phase(level)` and `ctx.gateReview` (`scripts/content-validate/context.ts`) used by the three rules (`cefr.ts`, `metadata.ts`). Structural rules (unit minimums, references, identity …) stay blocking for any visible level. Full-release safeguards were not weakened (tested: every sign-off, every locale review and the level test are errors in release mode; no `beta-*` rule appears there).

## 2. Locale visibility

`releasedLocales` alone was **not** sufficient: `availableLevels('de')` offered a level when it was released for *any* locale, so German-interface users would have seen A2. Rule changed (`src/data/course.ts`): the German interface is offered a level **only when its status is `released`**. A1 (released) is unchanged for German; a Beta level reaches only its released explanation languages. Every route, tab, dashboard and the lazy loader derive from `availableLevels`, so direct URLs follow the same rule. Verified: `ru` and `ky` → `['A1','A2']`, `de` → `['A1']`, A2 URLs in German → "not found" (the chunk is not requested).

## 3. Beta notice

`src/components/BetaNotice.tsx`, shown under the level tabs (learn, vocabulary-related labs, speaking / listening / reading / writing labs) and on every A2 unit page, for any level whose status is `beta`. New interface key `betaNotice` (ru, ky, de — three independent texts): A2 is in Beta; content still undergoes expert review; some translations may be revised; feedback is welcome. It claims no CEFR or native-language approval (tested). **The Russian and Kyrgyz wording is an unreviewed AI draft** (to be added to the Kyrgyz review list).

## 4. Tests

* New `tests/navigation/a2-beta-readiness.test.tsx` (13): all routes of Units 11–20 (> 150 per language, via the real app and the real lazy chunk) in ru and ky with no "not found", no empty page and no logged error; navigation screens; German hidden; Beta notice in ru and ky (not on A1); validator policy (Beta flags, release errors); progress and saved words (persistence round trip); production state.
* **Updated only because the expectation legitimately changed:** the "A2 planned and invisible" assertions of the unit tests (11–20), catalog, infrastructure, metadata, review tests and the `unit-11` production check (now Beta); the validator expectations for Beta versus released (cefr, metadata, shared `beta-flags.ts`); the `emptyA2Bundle` fixture (an *empty planned* A2); the "pre-A2 world" tests (`a1-world`, `a2-world`, `level-scoping-*`) now set A2 to planned explicitly in a hook instead of relying on production; the German lazy-UX tests use a fully released level (German is not offered Beta); the i18n key baseline (288 → 289).

## 5. QA results

| Check | Result |
| --- | --- |
| Full suite | **76 files, 2121 tests pass** |
| A1 regression set | 26 files, 426 tests pass |
| `tsc` | clean |
| ESLint | 0 errors, the same 8 pre-existing warnings |
| `content:validate` (authoring / Beta) | 0 errors, 0 warnings, 31 review flags |
| `content:validate:release` | **31 errors** (full release still blocked, as required) |
| `review:validate` | 0 errors, 0 approvals |
| Build | passes; A2 chunk `lazy`, **not precached** |
| Bundle | entry 590 572 bytes raw (185 476 gzip; 589 421 before this change); A2 chunk 844 176 / 211 218 (unchanged) |

## 6. Known limitations of the Beta (disclosed, not blockers)

* Human CEFR and native Russian / Kyrgyz reviews pending; all A2 text, including the Beta notice and the Kyrgyz interface strings, is an AI-assisted draft.
* No A2 Level Test or Placement Test (the A1 placement no longer names A2); no AI Tutor for A2.
* Listening uses browser text-to-speech; real-device verification (iOS Safari, Android Chrome) is still outstanding (a transcript fallback appears when no German voice exists).
* About 119 Kyrgyz course-UI strings are still identical to Russian (A1 UI, outside A2).
* No XP is awarded by any diagnostic test (none exists yet).

## 7. Rolling back

Set A2 back to `status: 'planned', releasedLocales: []` in `src/data/course.ts`: A2 disappears from every screen and route; the tests that describe the hidden world already set that state themselves. No content or storage changes are needed (A2 progress and saved words stay in the learner's storage).
