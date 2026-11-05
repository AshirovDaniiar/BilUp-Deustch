# P0b — PWA Foundation (installable app, offline application shell only) — Report

**Date:** 5 November 2026 · **Baseline:** git `386c6a1` plus the uncommitted P0 work (see `P0_ENGINEERING_REPORT.md`) · **Nothing is committed.**
**Scope:** P0b only (08 §3 "P0b — PWA-lite"). No P1, backend, AI Tutor, subscriptions, Live or Marketplace.
**Headline limitation:** everything below was verified with unit tests, a sandboxed execution of the generated `sw.js`, and local builds. **No real browser, device, Lighthouse run or HTTPS deployment was used** (§9).

---

## 1. Decisions taken (and what was left open)

| Topic | Decision | Basis |
|---|---|---|
| **Branding (Q12 is OPEN)** | Manifest uses the identity **already shipped** — `name: "BilUp Deutsch"` (equals the `<title>` of `index.html`), `short_name: "BilUp"`. The documents' proposal "BilUp Til" is **not** applied. The manifest description says "provisional". A test fails if the manifest name ever differs from the page title without a deliberate change. | Task rule: unresolved branding ⇒ documented provisional identity, no final assets |
| **Icons** | The only icon is the **existing** `/favicon.svg` (`sizes: "any"`). **No PNG set, no maskable icon, no apple-touch-icon were generated** (a test asserts there is no `public/icons`). | Task rule: no final branded assets |
| Tooling | **No `vite-plugin-pwa`/Workbox.** A ~60-line in-repo Vite plugin + a hand-written ~150-line worker. Only `esbuild` was added as an explicit devDependency (already installed transitively by Vite, same 0.21.5 — no new package). | Smallest surface; every caching rule is auditable |
| Default state | PWA registration is **on** in production builds; off in dev. Three independent off-switches (§4). | 08 mentions a flag; staged rollout is done with the remote switch |
| Update policy | `registerType: 'prompt'` equivalent: new worker waits; activates only when the learner presses *Update*. | 07 §5 |

---

## 2. Files changed

### Created
| Path | Purpose |
|---|---|
| `public/manifest.webmanifest` | Web App Manifest (provisional identity) |
| `public/pwa-config.json` | Remote kill-switch file `{ "enabled": true }` (static, fetched uncached) |
| `src/pwa/sw-core.ts` | Worker logic as pure functions over injected `caches`/`fetch`: versioning, install, activation cleanup, request classification, shell serving |
| `src/pwa/sw.ts` | Production worker entry (wiring only); bundled to `sw.js` |
| `src/pwa/kill-sw.ts` | Kill-switch worker entry; bundled to `sw.js` when `VITE_PWA_KILL=true` |
| `src/pwa/register.ts` | Page-side lifecycle: kill-switch evaluation, registration, update detection (fully dependency-injected, never throws) |
| `src/pwa/PwaPrompt.tsx`, `src/pwa/pwa.css`, `src/pwa/messages.ts` | Responsive install/update notices in ru/ky/de |
| `src/vite-env.d.ts` | `/// <reference types="vite/client" />` (types for `import.meta.env`) |
| `scripts/pwa/vite-plugin.ts` | Build plugin: computes the precache list and content-hash version, bundles and writes `sw.js`, `pwa-config.json`, `pwa-build.json` |
| `tests/pwa/{fakes.ts, sw-core.test.ts, register.test.ts, manifest.test.ts, build-artifact.test.ts, prompt.test.tsx}` | 106 new tests (§7) |
| `docs/implementation/P0B_PWA_REPORT.md` | This file |

### Modified (tracked files — complete list, all inspected in `git diff`)
| Path | Change |
|---|---|
| `index.html` | **+1 line:** `<link rel="manifest" href="/manifest.webmanifest" />` |
| `src/main.tsx` | **+30 lines:** import of `PwaPrompt`/`registerPwa`; a `startPwa()` wrapper (try/catch around building the dependencies) and `<PwaPrompt handle={pwa} />` rendered next to `<App />`. No other line changed. |
| `vite.config.ts` | Adds `shellWorkerPlugin()` to `plugins` |
| `package.json` / `package-lock.json` | `esbuild` made an explicit devDependency; `format`/`format:check` scripts now include `vite.config.ts` and `src/pwa` |
| `README.md` | New "PWA (P0b)" section (kill-switch table) |
| `scripts/check-boundaries.mjs`, `vitest.config.ts`, `tests/setup.ts` (P0 files, untracked) | `pwa` folder ranked like `features`; coverage scope extended to the PWA modules; test setup tolerates the node environment |

**Not touched:** every existing screen, component, store, service, data and style file; the progress storage key and logic (`src/app/store.tsx` unchanged); `public/favicon.svg`; `dist/`.

---

## 3. PWA architecture

```
BUILD  vite build ──► dist/ (index.html, assets/*.js|css hashed, manifest, favicon)
          └─ plugin (closeBundle): hash every shell file ─► version = sha256(paths+hashes)[:12]
                                   esbuild-bundle src/pwa/sw.ts with __SHELL_VERSION__ / __PRECACHE__
                                   ─► dist/sw.js , dist/pwa-config.json , dist/pwa-build.json (record, never cached)

PAGE   main.tsx ─► registerPwa(deps)         (fire-and-forget; app renders regardless)
          dev? build-disabled? ?pwa=off? pwa-config.json says off?  ─► clean up (unregister + delete shell caches), stop
          else navigator.serviceWorker.register('/sw.js', {scope:'/'})
          updatefound / waiting + existing controller ─► PwaPrompt "update available"
          [Update] ─► postMessage SKIP_WAITING ─► controllerchange ─► single reload

WORKER sw.js (sw-core)
          install   : open "bilup-shell-<version>", addAll(shell files, cache:'reload'); any failure ⇒ delete cache, install fails
          activate  : delete other "bilup-shell-*" caches, clients.claim()
          fetch     : classify(request) → 'asset' | 'navigation' | 'ignore'
          message   : only {type:'SKIP_WAITING'} is honoured
```

The app uses **hash routing**, so the document is always `/` or `/index.html`; history-mode URLs are not introduced (08: "hash routing unchanged").

---

## 4. Caching strategy and kill-switch

### 4.1 What is cached
Exactly the files emitted by the build, listed by the plugin: `index.html`, hashed `assets/*.js` and `*.css`, `manifest.webmanifest`, `favicon.svg` — **in the current build 5 files**. Source maps, `sw.js`, `pwa-config.json` and `pwa-build.json` are excluded.

### 4.2 How requests are served
| Request | Behaviour |
|---|---|
| Precached asset (exact URL, query ignored) | **Cache-first**; on a miss, network. Cache storage errors fall through to the network. |
| Page navigation to `/` or `/index.html` | **Network-first** (a deploy is seen immediately); on offline, timeout (3 s) or HTTP ≥ 500 → the cached `index.html` of the current version. Offline with no cache ⇒ the network error propagates (nothing invented). |
| **Everything else** | **Not intercepted** (`respondWith` is never called): unknown URLs, other navigations, other origins, non-GET, requests with `Authorization` or `Range`, and any path below the app root starting with `api`, `auth`, `login`, `logout`, `account`, `pay(ment(s))`, `checkout`, `billing`, `subscription(s)`, `entitlement(s)`, `tutor`, `ai`, `live`, `stream(s)`, `video`, `rtc`, `ws`, `socket`, `webhook(s)` |
| Runtime caching | **None.** The worker never calls `cache.put`; a test asserts it. No background sync, no push, no periodic sync. |

Hence, per the safety requirements: API responses, authentication/payment data, AI-Tutor responses, Live/stream resources and learner progress are structurally outside what the worker can touch (progress lives in `localStorage`, which service workers cannot access, and the page never writes it from PWA code).

### 4.3 Versioning and cleanup
* Cache name = `bilup-shell-<12-hex content hash>`. The hash covers every shell file, including non-hashed ones (`index.html`, manifest, favicon), so any shell change yields a new cache. Identical sources ⇒ identical version (tested with two builds).
* On activation the worker deletes **only** caches whose name starts with `bilup-shell-` and differs from the current one; foreign caches are never touched (tested).
* Install is **all-or-nothing**: if any file fails, the half-filled cache is deleted and installation fails, leaving the previous worker in charge.

### 4.4 Kill-switch — three independent mechanisms
| # | Mechanism | Effect | Needs rebuild? |
|---|---|---|---|
| 1 | **Remote:** host edits `pwa-config.json` to `{ "enabled": false }` | On next page load the page unregisters the worker (scope-filtered) and deletes `bilup-shell-*` caches; status `disabled-remote`. Unreachable/404/invalid/other values ⇒ **no opinion**, shell keeps working. Fetched with `cache: 'no-store'`, 3 s timeout. | No |
| 2 | **Local:** `?pwa=off` (remembered in `bilup-pwa:disabled`), `?pwa=on` re-enables | Same cleanup, this device only | No |
| 3 | **Build:** `VITE_PWA_DISABLED=true` (page never registers, cleans up) or **`VITE_PWA_KILL=true`** | `KILL`: the build writes a **kill-switch `sw.js` at the same URL**; browsers that already have the shell worker fetch it through the normal worker update check. It has **no fetch handler**, calls `skipWaiting`, deletes shell caches and unregisters itself; it does not claim, navigate or reload open pages and never touches `localStorage`. `pwa-config.json` is written as disabled. | Yes (deploy) |

Dev server: the worker is never registered, and an existing one on the same origin is removed. The normal web application keeps working in every case (tests below), and no kill path reads or writes the progress key (a test records every storage key touched).

---

## 5. Update flow and install experience
* **Update:** a new `sw.js` (detected when the page loads, when the tab becomes visible again, and by the browser's own checks) installs in the background and **waits**. A notice ("Update available — Update / Later") appears; *Later* hides it for the session. Only *Update* sends `SKIP_WAITING`; the page then reloads once on `controllerchange`. Nothing reloads mid-lesson without a click. First-ever install is not announced as an update.
* **Install:** Chromium `beforeinstallprompt` is captured (browser mini-infobar suppressed) and offered as an *Install* button; *Later* is remembered under `bilup-pwa:install-dismissed`; hidden when already standalone and after `appinstalled`. **iOS Safari** (no install event) gets an "Add to Home Screen" hint (Share → Add to Home Screen), shown only in Safari proper.
* **Responsive:** one fixed card, `z-index` above the bottom bar. < 600 px: stacked, full width (max 520 px) above the bottom navigation using the existing `--nav-h` and `env(safe-area-inset-bottom)`; ≥ 600 px: row layout; ≥ 1024 px (where the app switches to the sidebar): bottom-right corner card, max 420 px. Buttons are ≥ 44 × 44 px, `type="button"`, visible focus ring, `role="status"` `aria-live="polite"`, long text wraps.
* **Honest copy:** the install text says lessons still need an internet connection; nothing promises offline learning.
* **Languages:** ru/de are straightforward; the **Kyrgyz lines are unreviewed** (same status as `src/i18n/ky.ts`) and must pass the Kyrgyz review (Q2/Q16) before the Kyrgyz release gate. The messages live in `src/pwa/messages.ts` so no existing dictionary changed; a test checks all three languages define every key.

---

## 6. What "offline" means after P0b
The installed or cached app **shell** (HTML + the JavaScript/CSS bundle) starts without a network. Because all current lesson content is inside that JavaScript bundle, the existing static learning content will in practice render, but **this is a side effect of how the MVP is built, not a feature**: no content packs, no download manager, no offline guarantee for any future data, and Web Speech recognition/synthesis availability depends on the browser. The documents' "offline learning" is P6; nothing here promises it.

---

## 7. Tests and results (actual outputs)

| Suite (new, `tests/pwa/`) | Tests | What it proves |
|---|---|---|
| `manifest.test.ts` | 8 | required members; `start_url` inside `scope`; theme colour equals the `<meta>`; linked from `index.html`; icons exist and types match; **provisional branding rules** (name == title, only the existing favicon, no `public/icons`, no maskable); no out-of-scope manifest features; kill-switch config valid |
| `sw-core.test.ts` | 45 | **cache versioning** (names/prefix/resolution); **install** (fills, all-or-nothing, offline reject); **activation/cleanup** (removes old, keeps ours, never foreign, kill-switch deletion); message contract; **classification matrix** (non-GET, cross-origin, 17 API-like paths for fetch and navigate, Authorization/Range, unknown assets, other navigations); **serving** (cache-first, offline asset, broken cache storage, online navigation, **offline shell fallback**, slow-network fallback, 5xx fallback, offline-no-cache error, **no runtime cache writes**, old shell keeps working) |
| `register.test.ts` | 22 | registration URL/scope; **registration failure never throws**; unsupported browsers; cache storage unavailable; throwing storage/fetch; **kill-switch** (build flag, dev, `?pwa=off` remembered, `?pwa=on`, remote off, remote unreachable/404/bad JSON/other values, uncached fetch, no progress-key access, scope/prefix-limited cleanup); **update** (first install ≠ update, update with controller, waiting-at-load, unsubscribe, `applyUpdate` posts `SKIP_WAITING` without reloading, single reload on `controllerchange`, `checkForUpdate` offline-safe) |
| `build-artifact.test.ts` | 16 | **builds the real app three times into temp dirs** (two normal, one `VITE_PWA_KILL`) and **executes the generated `sw.js` in a sandbox**: file set, precache list vs disk, deterministic version, install/activate/skipWaiting/claim behaviour, offline root + asset from the built files, API-like requests ignored, `SKIP_WAITING`, failed-install atomicity; kill build has no fetch handler, takes over, clears only our caches, unregisters, does not claim; `buildShellManifest` rules |
| `prompt.test.tsx` | 15 | update notice (appears, applies, "Later", language, a11y attributes, visibility check), install notice (captured, prevented default, dismissal key, standalone, `appinstalled`), iOS hint (Safari yes, CriOS no), all-language message completeness, progress key untouched |

### Command results
| Command | Result |
|---|---|
| `npm run typecheck` | exit 0 (includes `src/pwa`, `scripts/pwa`, `tests/pwa`) |
| `npm run lint` | **0 errors, 8 warnings** (the same 8 pre-existing jsx-a11y warnings; none in new code) |
| `npm run format:check` | "All matched files use Prettier code style" (P0 + P0b files) |
| `npm test` | **14 files, 216 tests passed, 0 failed** — 110 P0 tests unchanged and passing + 106 new |
| `npm run content:validate` | 0 errors (info: 272/352 L10n strings without Kyrgyz) |
| `npm run boundaries:report` | 5 violations (unchanged, pre-existing), 0 cycles; the new `pwa` folder adds none |
| `npm run build:ci` | OK. JS **422.52 kB / 148.96 kB gzip** (P0 baseline 415.95 kB / 146.22 kB → **+2.7 kB gzip**, the notices + registration), CSS 8.88 kB gzip; `sw.js` 2,645 bytes; version `a1c7e4480233`; 5 precached files |
| `npm run check` (all of the above in sequence) | **exit 0** |
| `npm audit --omit=dev` | found 0 vulnerabilities (dev-tooling advisories unchanged from P0) |
| `npm ci --dry-run` | exit 0 |
| Coverage (configured pure/PWA scope) | 97.22 % statements, 92.81 % branches; `sw-core.ts` 98 %, `register.ts` 95 %, `PwaPrompt.tsx` 98 % (`sw.ts`/`kill-sw.ts` run only inside the sandbox, so they are not instrumented) |
| **Mutation sanity check** | Temporarily broke `sw-core.ts` (cleanup deleting foreign caches, dropping the non-GET rule, truncating the precache list): **many tests failed** (install, cleanup, 5× method rules, offline fallback, slow network, 5xx, built-artifact install); restored byte-identical (`cmp`) and 106/106 passed again |

Existing P0 tests: **unchanged and passing** (110/110).

---

## 8. Security considerations
* **Scope of interception is allow-list based:** only the exact precached files and the app-root navigation; the API/payment/auth/tutor/live/stream deny-pattern and the Authorization/Range/non-GET/cross-origin rules are additional guards. When the backend arrives (P8+), any new path outside that allow-list is untouched by default; the deny-pattern is a second line of defence for URLs that happen to share the scope.
* **No sensitive data in caches:** only public static build output. No `Set-Cookie`/credentials handling exists in the worker.
* **No XSS surface added:** the only new HTML-producing code is React-rendered static strings.
* **Message channel:** the worker accepts only `{type:'SKIP_WAITING'}`; anything else is ignored. A page of the same origin (the only one that can reach it) can at most activate an already-installed update.
* **Cache poisoning / stale-code risk:** `cache: 'reload'` at install bypasses the HTTP cache; content-hashed names; atomic install; versioned cache; kill-switch with three independent paths including a build that replaces the worker at the same URL. **Operational requirement (not enforceable from the repo):** the host must serve `sw.js`, `pwa-config.json` and `index.html` with `Cache-Control: no-cache` (or `max-age=0`), otherwise update and kill-switch propagation can be delayed by HTTP caching. `Content-Type: application/manifest+json` is recommended for the manifest. HTTPS is required for service workers (localhost excepted).
* **A bad worker is the dominant risk of this feature**; it is mitigated by the above, but a deployed buggy `sw.js` still reaches browsers only on their next update check — the kill-switch is therefore a mitigation, not instantaneous.
* **Storage:** the PWA code uses two own keys (`bilup-pwa:disabled`, `bilup-pwa:install-dismissed`). It never reads, writes or deletes `bilup-deutsch:v1`; no `localStorage` data is deleted by any path (tested).
* **Privacy:** the page requests `pwa-config.json` from its own origin on each load (one small static request); no third parties, no telemetry.

---

## 9. Browser compatibility and limitations — and what was NOT verified
**Not verified (be careful when relying on this):**
* **No real-browser run:** no Chrome/Safari/Firefox session, no Lighthouse/installability audit, no DevTools Application-panel check, no device test, no HTTPS deployment. The worker was executed only in a Node sandbox with fakes; real-browser behaviours (worker update timing, `clients.claim`, `beforeinstallprompt`, `display-mode`) are as documented but **untested here**.
* **Installability in Chromium is not confirmed.** The manifest offers only an SVG icon (`sizes: "any"`); Chromium's installability criteria have historically asked for 192 px and 512 px raster icons, and I did not verify whether an SVG-only icon list suffices in current versions. If Lighthouse reports a missing icon, the fix is the branded PNG/maskable set, which waits for the brand decision (Q12).
* The update flow across two real deployments was verified only by simulation (two builds are deterministic, events are faked).

**Known limitations by platform (from documentation/experience, not tested here):**
| Platform | Limitation |
|---|---|
| iOS/iPadOS Safari | No `beforeinstallprompt` (manual Share → Add to Home Screen); no `apple-touch-icon` PNG ⇒ a screenshot/blank icon is used until branded assets exist; storage of installed PWAs can be evicted under pressure; speech recognition is limited |
| Firefox desktop | Does not support installing PWAs; the worker still provides the offline shell |
| Safari desktop / Chromium | Installable via browser menu/prompt; behaviour differs by version |
| All | Private/incognito modes may disable workers or cache storage ⇒ the app falls back to normal web behaviour (tested at the logic level); the first visit is always online; a newly deployed version reaches a returning user after the next update check plus acceptance |

---

## 10. Deferred (explicitly not done)
| Item | Phase |
|---|---|
| Final branded name, 192/512 PNG + maskable icons, `apple-touch-icon`, splash screens, per-locale manifest | After Q12 |
| Playwright install/update/kill-switch E2E in real Chromium/WebKit, Lighthouse CI installability gate, manual iOS/Android check | Needs browser tooling (P0 deferrals) — **required before claiming the 08 P0b acceptance** |
| Offline lessons, content-pack download, runtime caching, IndexedDB, offline banners, quota UI | P6 |
| Background sync, push notifications | not planned in P0b |
| History-mode URLs / host rewrite rules | decided with hosting (Q6/Q13) |
| CI check that production hosting sends the right cache headers | needs the chosen host |
| Reviewing the Kyrgyz PWA strings | Q2/Q16 |
| A staged-rollout procedure (percentage rollout) | operational; the remote switch allows an instant off but not a percentage |

---

## 11. Risks to existing users
| Risk | Assessment |
|---|---|
| Change to learning behaviour | None intended: no existing screen/store/data file changed; `main.tsx` adds one sibling component and one fire-and-forget call. The notice component renders `null` unless an update is ready, an install prompt is available, or the visitor is on iOS Safari outside standalone mode (the iOS hint). |
| Existing progress | Untouched: the PWA code cannot reach `bilup-deutsch:v1`, and tests assert it for every path including all kill-switch paths. |
| **Stale-shell incident** | The principal new risk (a cached shell serving old code). Mitigated by network-first navigation, versioned atomic cache, prompt-based updates and the kill-switch; residual risk depends on correct hosting cache headers (§8). |
| First deployment affects every returning user | The worker registers on the first load after deployment. A staged rollout is possible only by publishing `pwa-config.json` as disabled first and enabling later. |
| Bundle size | +2.7 kB gzip JS. |
| Unverified browser behaviour | See §9. |
