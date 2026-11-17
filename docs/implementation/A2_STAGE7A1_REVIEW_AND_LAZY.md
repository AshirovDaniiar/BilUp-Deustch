# A2 Stage 7A.1 — Pilot review and lazy A2 loading

Scope: review of unit 11 and the smallest safe architecture that keeps A2 out of the A1 entry bundle. No educational content changed, A2 still `planned`/invisible, units 12–20 empty, storage/progress/A1 untouched, nothing committed. (The stage was interrupted once by a network error; the working tree was inspected and only unfinished work resumed.)

## 1. CEFR and Kyrgyz review (documents only; decisions pending)
* `docs/authoring/A2_UNIT11_CEFR_PROPOSALS.md` — every flag analysed against the A1 prerequisites, with keep / simplify / replace recommendations and a decision column. Findings worth knowing: `weil` is **already taught in A1** (unit 6), so concept 3 is partly revision; Konjunktiv II look-alike distractors are **not A2** (recommend replace); adjective + `dass` and the stacked clause in reading 2 should be simplified; du/Sie is consistent inside every text.
* `docs/authoring/A2_UNIT11_KY_QA.md` — automated checks vs. human review kept separate; 18 proposed Kyrgyz corrections (3 probable errors: *иштеши керек болчубуз*, *жоопттон*, *туулгамын*); the list of fields that need a native reviewer (all of them, in priority order). **No sign-off recorded**; `A2_REVIEWS` is still `{}`.

## 2. Lazy A2 architecture (implemented)
Findings: A2 data entered the entry bundle only because `catalog.ts` imported every A2 module statically; all consumers read A2 through catalog selectors, so a lazy slot behind the same selectors is enough — no consumer changed its imports.

| Piece | Change |
| --- | --- |
| `src/data/a2/a2-content.ts` (new) | aggregates the 15 A2 collections (same arrays by reference) → Rollup emits **one** chunk `assets/a2-content-*.js` |
| `src/data/catalog.ts` | A2 slot starts **empty** (identical to the state before any unit existed); `registerLevelContent` fills it in place (collections, indexes, flat lists; idempotent); `loadLevelContent(level, {preview?})` = dynamic `import('./a2/a2-content')`. Allowed only if the level is visible per the course registry; `preview: true` works only when `import.meta.env.DEV` (compiled to `false` in a production build), so a planned level can never be loaded in a shipped app. The unit plan (identity only) stays eager. Selectors stay synchronous and typed |
| `src/app/routeAccess.ts` | `levelsToLoad(route, lang, activeLevel)` — empty for every A1 route, every planned level, every language a level is not released for; a visible, unloaded level is requested only when the route belongs to it, it is the learner's active level, or the route names content found in no loaded level |
| `src/app/App.tsx` | renders A1 routes exactly as before (no extra state change); for a needed level it loads, then renders (not-found on failure) |
| `src/services/analysis.ts` | the noun map was built once at import from `allVocabulary`; now rebuilt when a lazy level's words arrive |
| `scripts/pwa/vite-plugin.ts` | the A2 chunk is **excluded from the service-worker precache** (a learner who cannot see A2 never downloads it) |
| `scripts/content-validate/bundle.ts`, `tests/load-a2.ts` | build tooling and tests register the content statically (no environment dependency) |
| `scripts/regression/bundle-size.mjs` | reports entry bundle, lazy chunks and "A2 on" total separately |
| `tests/data/data-boundary.test.ts` | + only the catalog may load the A2 content (static or dynamic); the catalog's static A2 imports are the plan and types only |

No cross-level import, no cycle (boundaries: 5 baseline violations, 0 cycles).

## 3. Measurements (file bytes; Vite's console figure counts characters, not bytes, and understates Cyrillic)
| | raw | gzip | brotli |
| --- | --- | --- | --- |
| Before unit 11 (Stage 6B) | 575 833 | ≈ 182 400 (Stage 5 report: 178.1 KiB) | — |
| Stage 7A, eager | 658 223 | 203 970 | — |
| **Now: A1 entry bundle** | **578 225** | **182 075** | 150 608 |
| **Now: separate A2 chunk** (unit 11 only) | **82 600** | **22 313** | 19 024 |
| Total when A2 is enabled (entry + chunk) | 660 825 | 204 388 | 169 632 |
| CSS | 42 751 | 9 221 | — |
| Precache (13 files) | A2 chunk **not** in it | | |

A1 initial JS vs. Stage 7A: **−80.0 kB raw, −21.9 kB gzip**. Vs. before unit 11: **+2.4 kB raw, ≈ −0.3 kB gzip** (the loader, route gate and the unit plan); A1 initial loading is therefore *not strictly unchanged* in raw size, but A2 content costs it nothing. Enabling A2 costs +2.6 kB over the eager build (chunk wrapper). Ten-unit cost is **not** extrapolated; each added unit must be measured from its chunk (current data: unit 11 = 82.6 kB raw / 22.3 kB gzip as one chunk). If the single chunk becomes large, splitting per unit is possible behind the same loader.

Proof the split works (test on the real build): the entry bundle contains none of five distinctive unit-11 strings, the chunk contains all; `index.html` and `sw.js` do not mention the chunk.

## 4. Safe way to exercise unit 11 without exposing it
Production is untouched (`planned`, `releasedLocales: []`). Three layers, all implemented as tests:
1. **Data**: validator + 40 unit-11 tests (Stage 7A).
2. **Real app, real content, real lazy loader**: `tests/navigation/unit-11-smoke.test.tsx` switches A2 to `beta` for one language **inside the test only** (restored after each test) and renders unit page, topic, grammar, 2 listening, 2 reading, writing and speaking routes in `ru` and `ky` (20 tests): every route shows its content; a language the level is not released for gets "not found".
3. **Loader behaviour**: `tests/data/lazy-level.test.tsx` (9 tests): initial state empty; planned level rejects without the dev flag; the gate requests nothing for A1 routes/dashboard/labs even when A2 is visible; on-demand load; idempotence.

For manual review in a browser a developer can use `npm run dev` and temporarily set A2 to `beta` locally; **not done here** (it would be a visibility change). Left for the release stage: caching of the A2 chunk after release (it is deliberately outside the precache), and a loading/error UI string (currently an empty busy page, then the existing "not found").

## 5. Regression and validation
| Check | Result |
| --- | --- |
| Full tests | **55 files, 1485 tests pass** (7A: 52 / 1450; +35: lazy-level 9, lazy-chunk 4, unit-11 smoke 20, boundary 2) |
| A1 regression oracle + level scoping + navigation | included above; baselines unchanged |
| `tsc --noEmit` | clean |
| ESLint | 0 errors, 8 warnings (same pre-existing files) |
| `content:validate` | 0 errors, 0 warnings, 1 review flag (missing human sign-off) |
| `content:validate:release` | fails as required (exit 1) |
| Boundaries | 5 baseline violations, 0 cycles |
| Production build | passes; chunk split verified |
| Prettier on files touched | clean |

## 6. Open items
Decisions on `A2_UNIT11_CEFR_PROPOSALS.md` (F1–F11) and `A2_UNIT11_KY_QA.md` (K1–K18); a native Kyrgyz and a qualified CEFR review; the A2 chunk caching/loading-UI decisions for the release stage. Unit 12 not started.
