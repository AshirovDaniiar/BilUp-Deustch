# A2 Stage 7A.2 — Review decisions, lazy-loading UX and chunk caching

Scope: Unit 11 corrections only; localized loading/failure states with retry; safe caching of the lazy A2 chunk. A2 stays `planned` and invisible, units 12–20 empty, A1 content / storage / progress untouched, no human review recorded, nothing committed.

## 1. Content corrections (details in the two authoring documents)
* CEFR (`A2_UNIT11_CEFR_PROPOSALS.md`, "Decisions applied"): F1 `dass` only after glauben/wissen/finden; F2 dense Perfekt-in-subclause simplified (reading 2; ft-11-09 now tests present-tense verb-final); F5 all Konjunktiv II distractors and the term removed; F4 recognition-only vocabulary recorded (`UNIT_11_RECEPTIVE_WORDS`) and enforced by test; F11 `weil` marked as A1 revision; F3, F6–F10 unchanged.
* Kyrgyz (`A2_UNIT11_KY_QA.md`, "Corrections applied"): **9 applied** (K1, K2, K3-example, K5, K6, K10, K11, K15, K17); **9 left unchanged and marked for native review** (K4, K7, K8, K9, K12, K13, K14, K16, K18). The three investigated items: *иштеши керек болчубуз* (person disagreement → fixed), *жоопттон* (spelling → fixed), *туулгамын* (non-standard → *туулганмын*).
* `A2_REVIEWS` is still `{}`; release validation still names the missing unit 11 sign-off (tested).

## 2. Loading UX (implemented)
`src/app/LevelLoadStatus.tsx` + `App.tsx`; strings `levelLoading`, `levelLoadFailed`, `levelLoadFailedAgain` in **ru, ky and de** (separate texts, tested to differ).
* While a lazy level loads: a localized status (`role="status"`, page `aria-busy`), never the "not found" page.
* On failure: localized alert + **Retry** button (existing `retry` string, per language). Retry increments an attempt counter, so the effect calls `loadLevelContent` again; the catalog forgets a failed load (`loading.delete` on rejection) and re-requests the chunk. **No application reload.** After a failed retry the text adds a localized "reload the page" hint.
* A1 routes (and every planned level) render exactly as before: no status, no request (tested: 0 loader calls on an A1 route).
* Limit: a browser may cache a *failed* dynamic import of the same URL until the page is reloaded (behaviour differs by browser); that is what the reload hint is for. The chunk URL is content-hashed, so a retry cannot change it.

## 3. Chunk caching — design and implementation
Decision: the existing worker can support it safely with a small, isolated extension, so it was implemented (no refactor).

| Requirement | Mechanism |
| --- | --- |
| Do not precache A2 for A1 users | The chunk (`assets/a2-content-*.js`) is excluded from the precache list and from the shell version hash. The worker lists it separately as **lazy** (`__LAZY__`, also written to `pwa-build.json`). Nothing fetches it at install. A user who never opens A2 never downloads or stores it. |
| Cache only on use | `classify()` returns `lazy` for exactly the listed URLs. First request: network → store → serve. Later requests: cache-first. One dedicated cache, `bilup-shell-lazy` (it carries the shell prefix, so the kill-switch and the "disable PWA" path delete it with the rest). The cache is **not created** at activation for users who never loaded the chunk. |
| Never cache failed responses | A response is stored only if `status === 200`, `ok`, not redirected, not opaque/error, and `Content-Type` contains `javascript` (`isCacheableChunk`). 404, 500, HTML error pages, 206, empty content-type: never stored (tested). Failures are not negatively cached; the next request retries the network. Cache-storage failures never break loading. |
| New deployments cannot serve a stale incompatible chunk | (1) The chunk filename is **content-hashed** and the entry bundle embeds that exact filename, so a given entry bundle can only ever ask for its own chunk; any change to the chunk changes its hash, hence the entry bundle, hence the shell version and the worker → the update prompt. (2) The new worker's lazy list contains only the new URL; an old URL is no longer matched (not served from the cache by the new worker). (3) On **activation** the worker deletes every entry of `bilup-shell-lazy` whose URL is not in its own list (old deployments) and never deletes the lazy cache as an "old shell cache". (4) Updates still wait for the user's accept (existing `skipWaiting` policy), so an open page keeps a matching entry+chunk pair until it is reloaded. |
| Preserve A1 behaviour | `createShell` without a `lazy` list behaves exactly as before (tested); install, navigation, asset handling, kill-switch and the version hash are unchanged; all 118 PWA tests (incl. the built-artifact tests) pass. |

Invalidation / versioning summary: *identity = hashed URL; scope = one cache; lifetime = until the next worker activation prunes it; kill = removed with all shell caches.* There is no time-based expiry and no manual version number to forget.

Residual risk (documented, not hidden): a tab that stays open on an old entry bundle after its worker was replaced and pruned, and that opens A2 for the first time, requests the old chunk URL; the host has removed it → load failure state → Retry fails → reload hint → reload fixes it. This is the standard hashed-asset behaviour; the update prompt exists to avoid it.

## 4. Measurements (file bytes)
| | raw | gzip | brotli |
| --- | --- | --- | --- |
| A1 entry bundle (now) | 579 763 | 182 583 | 151 066 |
| A2 chunk (now) | 83 127 | 22 466 | 19 133 |
| Entry + chunk (A2 on) | 662 890 | 205 049 | 170 199 |
| `sw.js` | 3 646 | — | — |
| Stage 7A.1 (entry / chunk) | 578 225 / 82 600 | 182 075 / 22 313 | — |

vs. Stage 7A.1: entry **+1.5 kB raw / +0.5 kB gzip** (loading/failure components, three i18n keys ×3 languages); chunk +0.5 kB (content edits). vs. the eager Stage 7A build the A1 entry is still **−78.5 kB raw / −21.4 kB gzip**. The A2 chunk is not in the precache (13 files, verified in `pwa-build.json`).

## 5. Validation
| Check | Result |
| --- | --- |
| Full tests | **57 files, 1517 tests pass** (7A.1: 55 / 1485; +32: lazy-cache 12, lazy-ux 11, unit-11 decisions 9 incl. updated) |
| A1 regression oracle, level scoping, navigation, PWA built-artifact tests | pass; A1 baselines unchanged |
| `i18n.test.ts` key baseline | 280 → **283** (three new keys, reason recorded in the test); Kyrgyz-identical-to-Russian ratchet unchanged |
| `tsc` | clean |
| ESLint | 0 errors, the same 8 pre-existing warnings |
| `content:validate` (RU/KY presence, difference, German-quote preservation, schema, CEFR heuristics) | 0 errors, 0 warnings, 1 review flag (missing human sign-off) |
| `content:validate:release` | fails as required (11 errors) |
| Boundaries | 5 baseline violations, 0 cycles |
| Production build | passes; chunk split and lazy list verified |

## 6. Open items
Native Kyrgyz review (K4, K7, K8, K9, K12, K13, K14, K16, K18 plus all text); qualified CEFR review; human read of the three new UI strings in ru/ky/de; release-stage decision whether to keep chunk caching as designed. Unit 12 not started.
