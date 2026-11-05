# BilUp Deutsch 🇩🇪

*Deutsch verstehen. Deutsch sprechen.* — an educational German-learning app (React + TypeScript + Vite).

```
npm install
npm run dev         # http://localhost:5173
npm run typecheck
npm run build
```

## Quality checks (P0)

```
npm ci                      # clean install (CI uses this)
npm run typecheck           # tsc --noEmit (src, tests, scripts)
npm run lint                # ESLint (typescript-eslint, react-hooks, jsx-a11y; a11y findings are warnings for now)
npm run format:check        # Prettier — applied to files introduced in P0 only; legacy src is not reformatted
npm test                    # Vitest + Testing Library (jsdom); `npm run test:coverage` for coverage
npm run content:validate    # content-validate SKELETON: ids + reference integrity of src/data
npm run boundaries:report   # REPORT-ONLY module-boundary check (add --strict to fail on violations)
npm run build:ci            # typecheck + production build into .tmp-build (does not touch dist/)
npm run check               # all of the above in sequence
```

Details, limitations and known gaps: [`docs/implementation/P0_ENGINEERING_REPORT.md`](docs/implementation/P0_ENGINEERING_REPORT.md).

## PWA (P0b) — offline application shell only

The app is installable. A service worker (`/sw.js`, generated at build time) precaches **only the static shell** (HTML, hashed JS/CSS, manifest, icon) in one versioned cache and serves it when the network is unavailable. Lessons, progress, tutor and everything else are **not** cached and are **not** available offline beyond what the loaded JavaScript already contains. Details: [`docs/implementation/P0B_PWA_REPORT.md`](docs/implementation/P0B_PWA_REPORT.md).

Switching it off (the app keeps working normally):

| Where | How |
|---|---|
| On one device | open the app once with `?pwa=off` (e.g. `https://host/?pwa=off`); `?pwa=on` re-enables |
| On the host, no rebuild | edit the static file `pwa-config.json` → `{ "enabled": false }` |
| At build time | `VITE_PWA_DISABLED=true npm run build` (no registration; cleans up an existing worker) or `VITE_PWA_KILL=true npm run build` (replaces `sw.js` with a self-removing kill-switch worker so existing installs remove themselves) |

The service worker is never registered by `npm run dev`.

## Progress storage (P1)

Learner progress lives in **one versioned record** (`bilup-deutsch:v2:de-general`). The legacy key `bilup-deutsch:v1` is **read-only for this version**: it is never modified or deleted. On the first start the app validates it, writes a verified exact-bytes backup, migrates it, and continues from the new record.

* **XP and completion change only through `actions.record(ActivityResult)`** (src/progress). XP is credited once per never-credited item and once per activity (credit ledger), so replays and double-fired handlers cannot inflate it. Unit tests and unit reviews must reach **70 %** to count as completed; a 0 % test no longer completes anything. Pre-existing completions are grandfathered.
* **Unreadable or repaired data is quarantined** (exact bytes under `bilup-deutsch:quarantine:*`) and never replaced automatically: the learner sees a notice and a recovery screen (download, restore a verified backup, retry, start fresh) and every replacement needs a confirmation.
* **Several tabs** converge by merging; progress written to the legacy key by a stale cached app version is merged forward exactly once.
* Study time counts only visible, recently-active time; there is no global timer.
* There is no hard-coded default name any more.

Guarantees, limits and what is still open: [`docs/implementation/P1_COMPLETION_REPORT.md`](docs/implementation/P1_COMPLETION_REPORT.md) (earlier report: [`P1_PROGRESS_STORAGE_REPORT.md`](docs/implementation/P1_PROGRESS_STORAGE_REPORT.md), partly superseded).

## Architecture

```
src/
  app/        shell: hash router, layout (sidebar / bottom nav), progress store (localStorage)
  components/ design-system primitives (Card, Button, Ring, Sheet …), Logo, SpeakButton
  screens/    route-level screens (Home, Learn, Unit, Topic flow, Practice, Progress, Grammar, Vocabulary, Profile)
  features/   grammar (CaseLab, sentence blocks, conjugation, prepositions, timeline …), vocabulary,
              listening, reading, writing, speaking, tests (QuizRunner), ai (tutor chat), reallife, progress
  data/       structured content, separate from UI: types, units, vocabulary, grammar, cases, visuals,
              exercises, listening, speaking, reading, writing, reallife (+tests), errorPatterns
  services/   speech (Web Speech API), srs (Leitner spaced repetition), analysis (speaking/writing), tutor
  i18n/       ru (source of truth), de, ky
```

* **Core learning model** (`screens/TopicScreen.tsx`): Discover → Understand → Practice → Apply → Speak → Test → Review.
* **WHY?** (`features/grammar/Highlight.tsx`, data in `data/grammar.ts` `WHY_NOTES`).
* **Backend-ready**: content is plain typed data; `services/tutor.ts` exposes a `TutorService` interface and
  `services/analysis.ts` keeps pure functions — swap in an API implementation without touching the UI.
* Progress is stored locally (`bilup-deutsch:v1`). No backend in the MVP.

## Known limitations

* The AI tutor, speaking analysis and writing analysis are **rule-based simulations**, not a language model.
* Pronunciation scoring needs browser speech recognition (Chrome/Edge); other browsers fall back to typed answers.
* Kyrgyz UI and glosses are best-effort and should be reviewed by a native speaker. Grammar explanations are
  Russian-first; Kyrgyz/German exist for titles, summaries and the core "why" texts.
* Levels A2–C1 are visible in the UI but locked (A1 content only).
