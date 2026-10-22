# BilUp Deutsch 🇩🇪

*Deutsch verstehen. Deutsch sprechen.* — an educational German-learning app (React + TypeScript + Vite).

```
npm install
npm run dev         # http://localhost:5173
npm run typecheck
npm run build
```

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
