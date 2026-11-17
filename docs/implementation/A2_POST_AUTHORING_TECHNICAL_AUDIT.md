# A2 Post-Authoring Technical Audit

Scope: technical audit only, after the authoring of Units 11–20. No course content, A1 data, earlier unit data, validator, review tooling, localisation brackets, release status or visibility was changed. Nothing is committed. **No release preparation was started.**

## 1. Summary

| Area | Result |
| --- | --- |
| Full test suite | **68 files, 1937 tests, all pass** (final run, 61 s) — but see §2 (two time-dependent tests failed once under load) |
| TypeScript | clean |
| ESLint | 0 errors, 8 pre-existing warnings |
| Content validation | 0 errors, 0 warnings, 10 review flags (missing CEFR sign-offs of units 11–20); `content:validate:release` exits 1 as required |
| A1 regression set (regression, progress, navigation, PWA, data) | 25 files / 412 tests |
| Production build | passes |
| A2 planned and invisible | confirmed (§3) |
| A2 lazy and not precached | confirmed in code and in build output (§4) |
| Unit 20 fingerprint locked | done (§5) |
| Units 11–19 fingerprints | protected and verified unchanged (§5) |
| A1 entry bundle | 579 763 bytes — identical to every stage since 7C (§6) |
| Unintended changes to A1 / Units 11–19 | none found (§8) |

## 2. Test results and the one instability found

* Final full run: **68 files / 1937 tests pass.**
* An earlier full run during this audit showed failures in three places: the Unit 20 fingerprint test (a real, explained problem — see §5) and, in the same run, `tests/data/lazy-level.test.tsx` ("an A2 route loads the chunk on demand") and `tests/navigation/a1-world.test.tsx` ("ru: no A2 label…"). Both of the latter pass in isolation (32/32) and in the final full run. That earlier run overlapped with a second copy of the audit script that had been started in the background, so CPU contention is the likely cause, but this is **not proven**.
* Together with the `lazy-ux` German failures fixed in Stage 7K (a fixed 600 ms wait before the real chunk import), this is a pattern: **tests that render the real App and import the real A2 chunk are time-sensitive, and the chunk is now 844 kB.** Remaining fixed waits / default timeouts in `lazy-level`, `lazy-ux`, `a1-world` are a flakiness risk (§9).

## 3. A2 planned and invisible

* `src/data/course.ts`: `{ id: 'A2', status: 'planned', unitIdRange: [11, 20], releasedLocales: [] }`; `isLevelVisible` returns false for `planned`.
* Tests that assert it and pass: `metadata`, `infrastructure`, `catalog`, `lazy-level`, `a1-world` (no A2 label, no locked level, no placeholder on any A1 route, in all interface languages) and every `unit-NN` boundary test (`isLevelVisible('A2') === false`, `availableLevels` = `['A1']`).
* `loadLevelContent` refuses to load a level that is `planned` (checked in `src/data/catalog.ts`, covered by `lazy-level`).

## 4. Lazy loading and precache — implementation and build output

* **Implementation.** `src/data/catalog.ts` imports A2 only as a *type* statically (`import type { A2Content }`) and loads the content with a dynamic `import('./a2/a2-content')` inside `loadLevelContent`. `scripts/pwa/vite-plugin.ts` classifies `assets/a2-content-*.js` as `lazy`, writes it to `lazy` (not `precache`) in `pwa-build.json`, and `src/pwa/sw-core.ts` caches lazy files only after their first successful fetch (`LAZY_CACHE`, which carries the shell prefix so the kill switch also removes it).
* **Build output (this audit).** `dist` assets: `index-D1upI1ZW.js`, `a2-content-BBw1SwVu.js`, one CSS file. `pwa-build.json`: `lazy = ['assets/a2-content-BBw1SwVu.js']`; `precache` has 13 entries and **none contains `a2`**. The entry bundle references the chunk only through the dynamic import. Unit text (e.g. unit titles, `a2-ft-20-01`) occurs only in the A2 chunk.
* **One observation, not a defect:** the *titles* of the ten planned units (`A2_UNIT_PLAN`, `registry.ts`, e.g. "Stadtleben und öffentliche Dienste") are in the entry bundle. This is the approved curriculum metadata (ids, keys, German titles — no learning content, no Russian/Kyrgyz) and is deliberately static; it is not visible in the UI while A2 is planned.

## 5. Fingerprints

* Units 11–19: locked in `tests/content-validate/unit-20.test.ts` (and earlier units in the later tests); all equal the recorded values: U11 `502db4af8249`/`dd636659c06f`, U12 `4b6f9b8dcf73`/`3a8c03023e72`, U13 `c99778902721`/`fc311c5a7e08`, U14 `d932881835ec`/`39b892b0a8a1`, U15 `12d4f84dfbf1`/`9bbdddbf1eba`, U16 `f75f46556cf7`/`3ee2c25167a6`, U17 `5725c4bc6a78`/`16cc2220e1f2`, U18 `c469c9dbe60d`/`38594483c4ff`, U19 `71fd78d8fd82`/`46eef58246ed`.
* **Unit 20 is now locked** in the same test (`unit-20.test.ts`, "Units 11–19 are unchanged and Unit 20 is locked"): **`3d596de6c98d` / `4672a7bd87b7`**.
* **Correction to the Stage 7K report:** it quoted `cb4c73129f45` / `cefaa1a14030` for Unit 20. That value was measured *before* one last edit of the writing-task model text (two words added to reach the 60-word minimum). The audit re-measured and the lock test caught the stale value on its first run — i.e. the lock works. The current values above are the authoritative ones.
* Limit of the protection: the review-package fingerprint covers the content the review tooling exports for a unit; it is not a hash of every source file.

## 6. Bundle sizes

| File | raw | gzip -9 | brotli -11 |
| --- | --- | --- | --- |
| A1 entry bundle `index-*.js` | **579 763** (unchanged) | 181 871 (`wc`-based figure; 182 301 with this tool) | 151 026 |
| A2 chunk `a2-content-*.js` (units 11–20) | **844 176** | 211 218 (211 754 with this tool) | 155 690 |

The entry bundle is byte-for-byte the same size as at Stages 7C–7K (only the content hash in its file name differs, because it embeds the A2 chunk's hashed file name). Growth of the A2 chunk: 589 574 (units 11–17) → 666 754 (18) → 756 388 (19) → 844 176 raw (20); about +85 kB raw per unit, ≈ 21 kB gzip.

## 7. Performance assessment of the A2 chunk (no architecture change made)

* The chunk is loaded **once, on first use of A2** — never for A1 learners, never at start-up, and not precached, so it does not affect first load, install size or the A1 offline shell. After the first successful fetch the service worker caches it.
* Cost when it is loaded: ≈ 211 kB gzip / 156 kB brotli. On a ~1.5 Mbps mobile link that is roughly 1–1.2 s of transfer (gzip), then parse/evaluate of ≈ 844 kB of JavaScript objects (mostly string literals; typically tens of ms on a recent phone, noticeably more on low-end devices). The static host's compression is unknown here: brotli would save ≈ 26 %.
* The chunk is **monolithic**: a learner who opens one unit downloads all ten units, all skills (vocabulary, grammar, texts, tests, instructions, provenance), in all three languages' strings. At ≈ 88 kB raw per unit this scales linearly with any further level.
* Test-suite effect: real-chunk import time already causes timing sensitivity in tests (§2).
* **Assessment:** acceptable for a lazy, cached, post-release-gate level; not a launch blocker by itself. It becomes a concern for low-end devices and slow networks, and for the CI timing of tests.
* **Proposals only (not implemented; need approval):**
  1. *Per-unit chunks* (`a2-unit-11` … `a2-unit-20`) loaded by route, with the unit list metadata kept small; typical first-use download drops to ≈ 21 kB gzip. Requires changes to `loadLevelContent`, the catalog selectors (which assume a whole level is present), the service-worker `lazy` list and the validator bundle assembly — a real architecture change.
  2. *Per-skill split* inside the chunk (tests/instructions loaded on demand): smaller gain, similar complexity.
  3. *Keep the single chunk*, require brotli on the host, and make the time-sensitive tests poll instead of using fixed waits. Lowest risk.
  Recommendation: option 3 now; decide option 1 only if measured first-use latency on target devices is unacceptable.

## 8. No unintended changes

* `git status` lists exactly the same modified tracked files as at the start of the session (the pre-existing app/i18n/PWA/validator edits, `tests/i18n.test.ts`, `tests/pwa/fakes.ts`); no A1 data file (`src/data/vocabulary.ts`, `grammar.ts`, `exercises.ts`, `listening.ts`, `units.ts`, …) is modified, and the A1 oracle/regression tests pass (412).
* Units 11–19: fingerprints identical (§5); their test files were edited only for boundary assertions in earlier stages (11–20 counts), never for content.
* This audit changed exactly two things: the Unit 20 fingerprint lock in `tests/content-validate/unit-20.test.ts`, and this document.
* Caveat: the repository has only three commits and many A2/catalog files are untracked, so `git diff` cannot by itself prove "unchanged since Stage X"; the evidence is the fingerprints, the A1 oracle tests and the unmodified-file list.

## 9. Remaining risks

1. **Time-sensitive tests** (real chunk import, fixed waits) — flaky under load and getting slower as the chunk grows.
2. **All A2 content is unreviewed AI output**: no CEFR, Russian or Kyrgyz sign-off exists (`A2_REVIEWS = {}`); Kyrgyz terminology is open (glossary §6–§13), dates provisional, many Kyrgyz glosses descriptive.
3. **Loan-word glosses / `SAME_AS_RU`** not implemented; brackets in Units 12–16 remain.
4. **Review tooling is Unit-11-specific**; only the fingerprint package exists for 12–20, there are no review packages for them.
5. **Missing for release (by design):** level test `level-a2`, placement items, tutor templates — release validation still fails.
6. **Chunk size** grows ≈ 21 kB gzip per unit-equivalent; monolithic.
7. **Fingerprint lock scope** is the exported review content, not every source file.
8. An unrelated warning set (8 ESLint warnings, 5 boundary violations from the baseline) remains.

## 10. Recommended next steps (none started)

1. Approve a test-timing hardening pass (replace remaining fixed waits with polling in `lazy-level`, `lazy-ux`, `a1-world`).
2. Decide the chunk strategy (§7 option 3 now, option 1 only if measured need).
3. Plan human reviews: native Kyrgyz, Russian and CEFR sign-offs for Units 11–20, starting with the Kyrgyz open questions.
4. Decide on generalising the review tooling and on `SAME_AS_RU` / bracket policy.
5. Only after that: level test, placement and tutor content, then release preparation (separate approval).
