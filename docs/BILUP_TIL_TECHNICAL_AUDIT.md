# BilUp Til — Technical, Architectural, Functional and UX/UI Audit

**Audit date:** 4 November 2026
**Repository:** `C:\BilUp Deutsch\BilUp Deutsch` (git: one commit, `386c6a1 initial commit`; package name `bilup-deutsch`)
**Type:** Audit only. No source, config, dependency or build file was modified.

## 0. Method and limits (read first)

| What was done | How |
|---|---|
| Read all 68 tracked files (~6,260 lines of `src/`) | Source inspection |
| Type check | `npx tsc --noEmit` → exit 0 |
| Content inventory | Bundled `src/data/*` and `features/tests/questions.ts` with the project's own `esbuild` into a scratchpad file (outside the repo) and counted records |
| **Rendered visual inspection** | Served the **existing `dist/` build** (built 22 Oct, after the last source edit) from a throw-away static server, drove headless Google Chrome via DevTools Protocol at **390×844 (DPR 3, mobile)**, **768×1024 (DPR 2, mobile)**, **1440×900 (DPR 1)**; 16 routes × 3 viewports. Measured horizontal overflow, nav mode, and interactive-element sizes; captured screenshots of 7 routes × 3 viewports; I viewed the home screens at all three sizes and the mobile Reading screen. |
| Not done | `npm run build` (would overwrite `dist/`), real-device tests, screen-reader tests, contrast measurement, speech recognition (needs mic), Kyrgyz linguistic review, `npm audit` against the live registry (an offline run reported 0 findings but is not reliable evidence), full interaction testing of quizzes and flows (flows were assessed from code) |

A previous, shorter version of this file existed (untracked). It was backed up outside the repo and replaced. Several of its statements did not survive verification and are corrected here (see Appendix A).

---

## 1. Executive Summary

BilUp Til (code name **BilUp Deutsch**) is a **client-only React 18 + TypeScript + Vite single-page app** for learning **German**. It is a surprisingly complete MVP: 10 A1 units, 226 vocabulary items, 20 grammar topics with a 7-step lesson model, 202 exercises, listening, reading, writing, speaking, a daily challenge, tests, spaced repetition, progress and badges. It type-checks cleanly, ships a 146 KB gzipped JS bundle, and renders without horizontal overflow at all three target sizes.

It is **not yet the platform in the vision**. The decisive gaps:

1. **The two language axes are not independent — and the model cannot be made so without a content-schema change.** One `lang` value (`'ru' | 'ky' | 'de'`) is simultaneously the UI locale and the explanation language, and `'de'` (the *learning* language) is offered as an *interface* language. German is hard-coded as the target in the data schema (`de`, `ru`, `ky` are property names), in speech (`'de-DE'`), in analysis and in the tutor. There is no learning-language setting, no course concept and no language registry.
2. **Kyrgyz is a thin overlay, and "Russian explanations" leak into every language.** 121 of 280 UI keys (43%) are translated into Kyrgyz; the rest silently fall back to Russian. In content, Kyrgyz exists for grammar titles/summaries/"why" and unit subtitles only; 0/202 exercise explanations, 0/40 grammar mistake notes and 0/20 "when to use" lists have Kyrgyz. Quiz questions, speaking feedback, tutor replies and writing feedback are hard-coded Russian strings regardless of the chosen language.
3. **Progress integrity is weak** (unlimited XP farming, tests marked complete at any score, unit 10 can never reach 100%, idle time counted as study time, unvalidated persisted state).
4. **No backend, accounts, sync, PWA manifest/service worker, tests, lint or CI.**
5. **"AI" features are rule-based simulations** (honestly disclosed in the UI) — fine for a prototype, unsafe as a basis for proficiency claims.
6. **Tablet is not designed**: 768×1024 receives the phone layout (bottom nav, single column) stretched to full width.

**Verdict:** continue, by **evolving** the project, not rewriting it. The UI primitives, content model, learning-flow design and service seams are worth keeping. The language/content/progress core needs re-architecture *before* adding English or more locales, because every added language multiplies the current hard-coding.

---

## 2. Project Structure

```
index.html, package.json, tsconfig.json, vite.config.ts, README.md, .gitignore
public/favicon.svg                      ← only static asset (no manifest, no icons, no SW)
src/main.tsx                            ← StrictMode → AppProvider → App
src/app/        App.tsx (route switch), Layout.tsx (sidebar/topbar/bottom nav),
                router.tsx (hash router, 41 lines), store.tsx (context + localStorage, 123 lines)
src/components/ ui.tsx (Card, Button, Chip, ProgressBar, Ring, PageHeader, Segmented, Sheet, ScoreBar), Logo, SpeakButton
src/data/       types.ts + vocabulary, grammar, cases, visuals, exercises, listening, reading,
                speaking, writing, reallife(+TESTS), units, errorPatterns   (all German-only content, typed TS arrays)
src/features/   grammar/ (CaseLab, Labs, Highlight), listening/, reading/, speaking/, writing/,
                tests/ (QuizRunner, QuizPage, questions.ts), vocabulary/WordCard, reallife/, ai/TutorChat, progress/stats.ts
src/screens/    Home, Learn, Unit, Topic, Practice(+Daily, Review, Tests), Vocabulary, Grammar, Progress, Profile, NotFound
src/services/   speech.ts (Web Speech API), srs.ts (Leitner), analysis.ts (heuristic scoring), tutor.ts (MockTutor)
src/i18n/       ru.ts (source of truth), ky.ts (overlay on ru), de.ts, index.ts
src/styles/     base.css (214 lines), features.css (286 lines)
src/utils/      date.ts, random.ts, text.ts
dist/           stale-able build output (gitignored)
docs/           this report
```
Largest files: `data/grammar.ts` 322, `features/grammar/Labs.tsx` 319, `data/vocabulary.ts` 300, `styles/features.css` 286 (very long minified-style lines).

Observations: clear separation of `data` / `features` / `screens` / `services`. Weaknesses: no `core`, no `languages` or `courses` layer; `features/` and `screens/` both contain route-level components (e.g. `ReadingList` lives in `features/`, `UnitScreen` in `screens/`); `App.tsx` imports every screen eagerly.

---

## 3. Technology Stack

| Area | Actual | Notes |
|---|---|---|
| UI | React 18.3.1 | Function components + hooks only |
| Language | TypeScript 5.9.3, `strict`, `noUnusedLocals/Parameters` | Check passes. Only one cast of note (`speech.ts:69`) |
| Build | Vite 5.4.21 + `@vitejs/plugin-react` | Default config (`vite.config.ts` is one line) |
| Routing | Custom **hash** router (`router.tsx`) | `#/learn/unit/1`; no history-mode URLs, no lazy routes |
| State | One React Context (`store.tsx`) with `useState` + `localStorage` key `bilup-deutsch:v1` | No reducer, no selectors, no persistence layer |
| Styling | Hand-written CSS with design tokens, dark theme, reduced-motion | No fonts loaded: `--font: 'Inter', system-ui…` but no `@font-face`/link exists, so system font is used |
| i18n | Home-made typed dictionaries (`ru`, `ky`, `de`) | No plural/format support; `{x}` replaced by hand (`HomeScreen.tsx:122`) |
| Speech | Browser Web Speech API (TTS + recognition) | Chrome/Edge for recognition |
| Backend / DB / Auth / API | **None** (no `fetch`, no `XMLHttpRequest`, no env usage — grep verified) | |
| Tests / lint / CI / formatter | **None** (no test script, no ESLint/Prettier config, no `.github`) | |
| Dependencies | 2 runtime (react, react-dom), 5 dev | Tiny, low supply-chain surface |
| Bundle (existing `dist/`) | 1 JS chunk 460 KB (**146 KB gzip**), CSS 38.5 KB (8.7 KB gzip) | |

---

## 4. Feature Inventory (verified against code and content counts)

| Feature | Where | What exists | Content volume |
|---|---|---|---|
| Dashboard | `HomeScreen.tsx` | Greeting, streak, week dots, XP, level track A1–C1, 5-step "today" path, daily-challenge card, recommendations | — |
| Curriculum | `LearnScreen`, `UnitScreen`, `data/units.ts` | 10 units × 8 sections (vocab, grammar, listening, reading, speaking, writing, review, test); per-unit progress | 10 units, all A1 |
| Vocabulary | `VocabularyScreen`, `WordCard`, `data/vocabulary.ts` | Search, unit/saved filter, article colour badges, case forms, TTS, voice repeat, related words, SRS stage | **226 words** (135 nouns, 42 verbs, 20 adj, 17 phrases, 12 other), 22–23 per unit |
| Spaced repetition | `services/srs.ts` | Leitner boxes 0–5, intervals 0/1/2/4/8/16 days, 10-min relearn on error | — |
| Grammar | `GrammarScreen`, `TopicScreen`, `features/grammar/*` | 7-step lesson: Discover → Understand → Practice → Apply → Speak → Test → Review; interactive visuals (cases, verb position, conjugation, separable verbs, timeline, prepositions); "WHY?" explanations | **20 concepts** (19 A1, 1 A2), 12 WHY notes, 3 examples each |
| Exercises / Quiz | `QuizRunner`, `data/exercises.ts`, `questions.ts` | choice, fill-in, word-order, article drill; feedback; per-concept stats | **202** (135 article, 45 fill, 11 choice, 11 order) |
| Tests | `PracticeScreens.tsx`, `data/reallife.ts` | 15 defs: placement, level-A1, grammar, vocabulary, listening, 10 unit tests | A2–C1 tests locked |
| Daily challenge | `DailyScreen` | 3 vocab + 1 grammar + 1 listening Q + speaking + phrase of day (seeded per date) | — |
| Listening | `ListeningLab.tsx` | **TTS-generated** dialogue, normal/slow, questions, transcript, tap-word replay | 21 dialogues (18 A1, 3 A2), 35 questions |
| Reading | `ReadingLab.tsx` | Tap-a-word gloss sheet, TTS, comprehension quiz | 10 texts (7 A1, 2 A2, 1 B1), 36 glosses |
| Writing | `WritingLab.tsx`, `analysis.ts` | Prompt, editor, rule-based feedback, model answer | 10 tasks |
| Speaking | `SpeakingLab.tsx`, `SpeakInput.tsx` | Scripted scenario chat, mic or typed input, heuristic scores | 11 scenarios, 33 turns |
| Real-life topics | `RealLife.tsx` | Vocab, phrases, dialogue, mini-challenge per topic | 15 topics |
| AI tutor | `TutorChat.tsx`, `tutor.ts` | **Regex/keyword mock** with 450 ms fake delay; UI says "Demo mode" | ~18 keyword rules |
| Progress | `ProgressScreen`, `stats.ts` | XP/level, streak, study time, skills, vocab stages, weak concepts, 8 badges | — |
| Profile/settings | `ProfileScreen` | Name, interface language (ru/ky/de), theme, weekly goal, reset | — |
| Auth, API, sync, PWA, notifications, export, analytics | **Not present** | | |

---

## 5. Functional Assessment

### 5.1 Learning-flow quality (positive)
- The Topic flow (`TopicScreen.tsx`) is pedagogically coherent: hook question → explanation with "why" → interactive visual → practice → dialogue → speaking → test → review with mistakes listed. This is the strongest asset.
- Mistakes feed recommendations (`stats.ts: weakConcepts`, `articleConfusion`) and the article drill — a real adaptive loop.
- Every unit has all 8 section types authored (10/10 writing, 10/10 speaking scenarios mapped, listening for all units).
- Content is typed and kept out of components, as documented.

### 5.2 Defects and weaknesses

**F-01 — Critical (for the product vision): language model conflates interface language, explanation language and learning language**
- Files: `data/types.ts:3,8-12`, `app/store.tsx:13,57`, `i18n/index.ts`, `screens/ProfileScreen.tsx:21-22`, `utils/text.ts:3`, `services/speech.ts:26,80`
- Evidence: `type Lang = 'ru' | 'ky' | 'de'` is both the UI locale and the key of `L10n`; `LANG_LABELS` offers **Deutsch** as an *interface* language; `L10n.de?` means "German UI text", while the vocabulary field `de` means "the target word". `VocabularyItem` hard-codes `de`, `ru`, `ky`, `exampleRu`; `GrammarExample` is `{de, ru}`; speech uses `u.lang = 'de-DE'` and `rec.lang = 'de-DE'`.
- Impact: "German with Kyrgyz explanations" vs "German with Russian explanations" is impossible to express; English cannot be added; a German-speaker UI cannot be separated from German as target.
- Fix: introduce `uiLocale`, `explanationLocale` (default = UI), `targetLanguage`, and a `courseId`. Re-model content as language-keyed translations (`text: { de: '…', ky: '…', ru: '…' }` plus `lang` code on the item) and move speech language to a per-language config.

**F-02 — High: "Russian explanations" are hard-coded into logic, so Kyrgyz and German users get Russian**
- Files: `features/tests/questions.ts:47-64,70-74` (`Что значит «…»?`, `Как по-немецки…`, `why: {ru: …}`); `services/analysis.ts:41,43,82,87-93` (Russian corrections/notes, `e.why.ru`); `services/tutor.ts` (all replies Russian; starters in `TutorChat.tsx:45`); `features/vocabulary/WordCard.tsx:92` (`'Скажите слово:'`); `screens/PracticeScreens.tsx:128` (placement result text); `features/reading/ReadingLab.tsx:95,104` and `ListeningLab.tsx:112` (always show `ru`, and Reading additionally `ky`, regardless of selected language; German UI hides translation).
- Impact: A Kyrgyz learner sees Russian quiz prompts, Russian feedback and a Russian tutor. The product promise (Kyrgyz *or* Russian explanations) is not met in practice.
- Fix: all strings through the i18n layer or content packs; analysers return message *keys + params*, not prose.

**F-03 — High: Kyrgyz coverage is low and untracked**
- Files: `i18n/ky.ts` (`...ru` spread), `i18n/index.ts:9`, `data/*`.
- Evidence (counted): ky.ts defines 121/280 keys (43%); the rest silently equal Russian text. Content: Kyrgyz present for 20/20 grammar `title/summary/why/discover`, 10/10 unit subtitles, 226/226 vocab meanings; **absent** for 0/20 `when`, 0/40 mistake notes, 0/202 exercise `why`, all listening/reading/speaking/writing text. 29 vocab items have `ky === ru` (not necessarily errors—e.g. loanwords—but unreviewed). `ky.ts:1` itself says "best effort… review with a native speaker". Some Kyrgyz strings read oddly (e.g. `incorrect: 'Таптакыр эмес'` literally "Not at all", whereas Russian says "Не совсем" = "Not quite").
- Impact: Users believe they use a Kyrgyz product and get mixed-language screens; no way to notice during development.
- Fix: completeness check in CI (`ky` keys ⊇ `ru` keys), a visible "missing translation" dev marker, native-speaker review workflow.

**F-04 — High: progress and XP can be inflated; completion is not tied to performance**
- `features/tests/QuizRunner.tsx:45` `addXp(5)` per correct answer and `:75` `addXp(10)` per finish, with no per-item or daily cap — the Practice/Review/Article drill can be repeated indefinitely.
- `screens/PracticeScreens.tsx:117-118`: any finished unit test (even 0%) calls `complete('${unit}:test')`; `:66` same for review.
- `features/writing/WritingLab.tsx:47` `addXp(15)` on **every** analyse press (editing the text clears feedback, so it can be repeated).
- `features/speaking/SpeakingLab.tsx:140` hint buttons submit the model answer as the learner's answer → near-perfect scores for free.
- `screens/TopicScreen.tsx:47-53`: a topic completes by pressing Finish even if practice/test were skipped or failed (speaking step is optional via ghost button).
- Impact: streaks/XP/badges/level percent are not reliable evidence of learning.
- Fix: a single `recordActivity(event)` reducer with idempotency keys, pass thresholds, daily XP caps.

**F-05 — Medium: Unit 10 can never be completed**
- Evidence: `readingForUnit(10)` is empty (counted: units with no reading = [10]); `unitProgress` requires all 8 sections (`stats.ts:37-41`); reading completion only occurs in `ReadingView` for a text of that unit. `levelProgress` therefore cannot reach 100% and the unit badge for unit 10 is unreachable. The Unit screen links "Reading" to the list for unit 10 (`UnitScreen.tsx:31`).
- Fix: add a unit-10 reading or make section lists data-driven.

**F-06 — Medium: study-time statistic is wrong**
- `store.tsx:83-88` adds 15 s every 15 s while the tab is visible, regardless of interaction; each tick re-renders the whole tree and re-serialises state (`:64-70`).
- Fix: count only intervals following user events with an idle timeout; label it an estimate.

**F-07 — Medium: persisted state is trusted and unversioned**
- `store.tsx:34-36`: `JSON.parse(raw) as Partial<UserProgress>` shallow-merged into defaults; key `bilup-deutsch:v1` has no version field or migrations; `scores`/`tutor` merge but e.g. `daily`, `mastery`, `tests` are not validated; a wrong-typed value (e.g. `completed: "x"`) will crash screens (`.includes` on strings is silent but `.map`/spread of non-arrays will throw).
- Fix: schema validation (e.g. Zod or hand-written guard), `schemaVersion`, migration table, "recover/reset" screen.

**F-08 — Medium: Tutor, analysis and assessment are simulations**
- `tutor.ts:43` module-level `pending` quiz answer is shared across all tutor instances/conversations and survives clearing the chat (`clearTutor` doesn't reset it); keyword rules match ambiguous substrings (`/\bmit\b|\bzu\b|\bnach\b/` etc.). `analysis.ts` scores are arithmetic on error-pattern counts and keyword hits (e.g. `clamp(96 - errors*14)`); pronunciation = browser recognition *confidence*, not a phonetic measure; typed answers give `null`. The placement test outputs `'A1 · start' | 'A1 · A2' | 'A2 →'` from a raw percentage (`PracticeScreens.tsx:128`) but only A1 content exists.
- The UI discloses the simulation (`tutorMock`, `analysisDisclaimer`) — good — but the scores look authoritative.
- Fix: keep behind interfaces; do not use for placement/certification; clear pending state per conversation.

**F-09 — Medium: Writing/Spelling checks are crude**
- `analysis.ts:75-80` flags any lower-case token that matches a known noun, e.g. "essen/morgen/bar" are excluded manually via `AMBIGUOUS`; other noun/verb homographs (e.g. *arbeit*? *leben*, *wohnen*, *kaufen*) would false-flag. Capitalisation rule `/^[a-zäöüß]/` fires on any sentence start after `.!?` including abbreviations.
- Fix: acceptable for MVP; list as known limitations or replace with a real service.

**F-10 — Low: Reading questions reuse quiz plumbing with misleading metadata**
- `ReadingLab.tsx:53`: questions are mapped to `kind: 'grammar'`, `why: { ru: text.body.join(' ') }` — a wrong answer is recorded as a grammar mistake with no concept, and the feedback box prints the whole passage in Russian-keyed text.

**F-11 — Low: speaking "Retry" reloads the page** (`SpeakingLab.tsx:125` `window.location.reload()`), and scenario start auto-plays TTS in a timeout (`:55`), which mobile browsers often block without a gesture.

**F-12 — Low: levels A2–C1 are inconsistently "locked"**
- `LearnScreen.tsx:23` locks A2+, `levelLocked` text says "will appear in later versions", but Listening (3 A2), Reading (2 A2 + 1 B1), Speaking (4 A2) and grammar `genitiv` (A2) exist and are reachable, while the Home level track shows A2–C1 as destinations. `HomeScreen.tsx:69-70` and `ProgressScreen.tsx:34` hard-code "A1".

**F-13 — Low: personal default data and naming**
- `store.tsx:13` default `name: 'Daniiar'` (a real person's name baked into the default state; every new user is greeted by it — visible in the screenshots). Product name is inconsistent: "BilUp Til" (brief) vs "BilUp Deutsch" in `index.html`, `package.json`, `Layout.tsx:29`, `ProfileScreen.tsx:13`, `README.md`, localStorage key.

---

## 6. UX/UI Assessment

### Strengths (seen in rendered pages)
- Cohesive visual identity: blue/violet palette, serif display headings, rounded cards, clear hierarchy; the Home hero, level track and "today" path (rendered at all 3 sizes) are clear and polished.
- Consistent component vocabulary (`Card`, `Chip`, `Ring`, `Sheet`, `PageHeader`).
- Dark theme and `prefers-reduced-motion` support; focus ring defined (`base.css:59`); `aria-current`, `aria-pressed`, `role="progressbar"`, `role="status"/"alert"`, `aria-live` on chat are used.
- Good affordances for language learning: tap-a-word, slow audio, "why?" everywhere, colour-coded articles/cases.

### Issues

| ID | Sev | Finding | Evidence / files | Fix |
|---|---|---|---|---|
| U-01 | High | No learning-language or explanation-language control; only a single "Interface language" switch, which includes German | `ProfileScreen.tsx:20-23` | Settings with 2 independent selectors; onboarding step |
| U-02 | High | **No onboarding**: first launch drops into a dashboard with fake name "Daniiar", level A1, no goal/language/level choice | `store.tsx:11-28`; screenshot | First-run flow: UI language → target language → explanation language → level/placement → goal |
| U-03 | Medium | Hard-coded English/German/Russian strings outside i18n: `aria-label="Back"`/`"Close"`, `aria-label="Navigation"` ×2, `"Reading Lab"`, `"Listening Lab"`, `"Writing Lab"`, `'Mo','Di'…` (Progress), `['M','D','M','D','F','S','S']` (Home) – German weekday initials shown to Russian/Kyrgyz users | `ui.tsx:75,127`, `Layout.tsx:28,63`, `ReadingLab.tsx:19`, `ProgressScreen.tsx:10`, `HomeScreen.tsx:15` | Use `Intl.DateTimeFormat(locale)` for weekdays; localise all aria labels |
| U-04 | Medium | Dialog (`Sheet`) has Escape and `aria-modal`, but **no focus move/trap/restore and no background scroll lock**; no `aria-describedby` | `ui.tsx:110-135` | Use `<dialog>` or a focus-trap utility |
| U-05 | Medium | Emoji used as icons in nav and headers (`Layout.tsx:10-20`) render differently per OS, appear greyed via CSS filter, and are not scalable/brandable | screenshots | SVG icon set |
| U-06 | Medium | Primary navigation has 5 bottom items; Tutor, Vocabulary, Grammar, Profile are only reachable from the top-bar icons/sidebar; "Vocabulary" and "Grammar" are buried on mobile (reachable via Learn quick-links) | `Layout.tsx:9-21` | Re-think IA (see §13) |
| U-07 | Medium | Reading: each word is its own `<button>` — 44 interactive elements on one short text; screen-reader and keyboard users must tab through every word | `ReadingLab.tsx:71-76`; audit count: 44 small targets | Sentence-level lookup, or single focusable text region with roving tabindex |
| U-08 | Low | Home greeting line wraps with the 👋 emoji orphaned on its own line at 390 px | mobile screenshot | `text-wrap: balance`, drop emoji |
| U-09 | Low | `Segmented` uses `role="tablist"` for what are mode switches without `tabpanel`s and no arrow-key support | `ui.tsx:98-106` | Use radio-group semantics or implement tab keys |
| U-10 | Low | Colour contrast not measured. Several text tokens are light (`--ink-3: #7b86a8` on `#f5f6fb` ≈ 3.3:1 by calculation — below 4.5:1 for small text, used for nav labels and small captions) | `base.css:13` | Verify with a contrast tool and darken `--ink-3` |
| U-11 | Low | Quizzes are 100% multiple-choice/tap; no typed answers except Writing/Speaking. Limited recall practice. | `QuizRunner.tsx` | Add typed-answer and listening-dictation types |

---

## 7. Responsive Design Assessment (rendered Chrome measurements)

Breakpoints in CSS: `min-width:1024` (sidebar), `700` (sheet becomes centred), `720` (quiz columns), `520` (step labels), plus `auto-fit` grids (`base.css:187-189`). There is **no tablet-specific layout**.

| Viewport | Layout rendered | Horizontal page overflow | Notes |
|---|---|---|---|
| **390×844** | Top bar + 5-item bottom nav, single column, `.main` = 390 px | **None on 16/16 routes** (`scrollWidth` = 390) | Safe-area insets are used (`env(safe-area-inset-*)`). `/grammar` has two buttons whose right edges are at 405 and 546 px, i.e. inside a horizontally scrolling container (the page itself does not overflow) — should be checked for discoverability. Interactive elements < 44×44 px: 3–44 per page (logo 97×30, icon buttons 40×40, step chips 48×42, Reading words ~39–41 px high, `Segmented` buttons 37 px high). |
| **768×1024** | **Same phone layout**: bottom nav, content stretched to 768 px | **None on 16/16** | Home path cards and Reading are one wide column; 1500-px-wide screenshot shows large empty card interiors and no side navigation. Tablet users on landscape (1024+) get the desktop sidebar; portrait iPad does not. No master-detail or two-column lesson layout. |
| **1440×900** | 252 px sidebar + content max-width 1120 px | **None** (docW 1425 only = scrollbar) | Looks professional. Touch-target count ≈0–3 (fine for mouse). Large side margins; no use of width for lesson/side panels. |

Rated: **Mobile — Good (with touch-target caveats); Tablet — Weak (unaddressed); Desktop — Good.** Not tested: landscape phone, 320 px wide, soft keyboard overlap with the sticky composer (`features.css:251,258` positions `bottom: nav-h + 8px`), real notch devices, text zoom 200%.

Related risks:
- `.composer`/`.tutor__form` are `position: sticky` above a fixed nav; on-screen keyboard behaviour is unverified.
- Heavy emoji and `backdrop-filter` use — fine in modern browsers.

---

## 8. Architecture Assessment (against the proposed target)

| Target module | Present? | Assessment |
|---|---|---|
| **Core · Authentication** | No | Nothing |
| **Core · Profile / Settings** | Partial | `ProfileScreen`: name, UI language, theme, weekly goal. Mixed into one `UserProgress` object. |
| **Core · Progress** | Partial | Rich local model (`UserProgress`: xp, mastery, scores, daily, tests…) but one blob, no events, no versions, no per-course scope |
| **Learning Engine · Vocabulary / SRS** | Yes | `srs.ts` clean and testable; progress keyed by vocab id (not by course) |
| **· Grammar** | Yes | Strong, but German-specific visuals/types (`GrammarVisual` = cases, separable…) |
| **· Exercises** | Yes | One generic `Question` type used by all surfaces — a good abstraction, but prompts are built as Russian strings |
| **· Reading / Listening** | Yes | Listening uses TTS only (no recorded audio) |
| **· Speaking** | Yes | Scripted; heuristic |
| **· Assessment** | Weak | Tests are random draws from the exercise pool; no calibrated items, no CEFR mapping |
| **Language Content · German** | Yes | All content is German; **no content-pack boundary** |
| **· English / Future** | No | Would require schema redesign (F-01) |
| **Localization · Kyrgyz / Russian** | Partial | Typed dictionaries (good) but incomplete (F-03) and bypassed by hard-coded prose (F-02) |
| **Responsive UI** | Partial | See §7 |
| **Platform · Web** | Yes | |
| **· PWA** | No | No manifest, icons, service worker, offline strategy, update flow |
| **· Native-ready** | Partial | Pure data/service modules are portable; UI is DOM/CSS-only, routing is `window.location.hash`, state uses `localStorage` directly in the provider, speech uses browser APIs directly |

Structural strengths: content/UI separation; service interfaces (`TutorService`); pure functions (`srs.ts`, `stats.ts`, `utils/`).

Structural weaknesses:
- **A-01 (High)** `AppProvider` mixes profile, progress, tutor chat, theme, timers and persistence; every state change re-renders every `useApp()` consumer and rewrites the whole JSON (`store.tsx:63-70`).
- **A-02 (High)** Persistence is called directly from the provider; no repository interface → no sync/offline-first path.
- **A-03 (Medium)** Hash router with manual `Number(c)` params (`App.tsx:27`), no route table/metadata, no code-splitting (`App.tsx:1-18` eager imports), so a route change cannot lazy-load content packs.
- **A-04 (Medium)** Content as TypeScript modules compiled into the bundle: adding languages multiplies bundle size; non-developers cannot edit it; no schema validation (IDs like `'wr01'`, `'art-<vocabId>'`, `'unit-3'` are constructed by string convention in several places — `UnitScreen.tsx:23`, `questions.ts`, `HomeScreen.tsx:39`).
- **A-05 (Medium)** Progress keys are untyped strings (`"3:test"`, `"topic:id"`, `"ex:id"`, `"speak:id"`), spread across 8+ files — the earlier "activity IDs vary" concern is real and measurable.
- **A-06 (Low)** Stats recompute over the full vocabulary on every render (`stageCounts`, `dueWordIds`) — fine at 226 items.

---

## 9. Security Assessment

Context: static client-only app; no network calls, no secrets (`grep` for `fetch|XMLHttpRequest|process.env|import.meta.env` found nothing; `.gitignore` excludes `*.local`; no `.env` in tree). Git history has one commit (not scanned for secrets beyond that).

| ID | Sev | Finding | Evidence | Recommendation |
|---|---|---|---|---|
| S-01 | Low | No XSS sinks: no `dangerouslySetInnerHTML`/`innerHTML`/`eval`; tutor output parsed into `<b>` nodes by a tiny renderer | `TutorChat.tsx:8-18` | Keep this when a real LLM is added; never render model output as HTML |
| S-02 | Medium (future) | No authentication/authorization/server. Any claim of "accounts" or cross-device progress is impossible today | repo-wide | Choose an auth provider before storing PII |
| S-03 | Medium | Unvalidated `localStorage` JSON (F-07) — also the only integrity boundary; users can edit XP/progress | `store.tsx:34` | Validate; accept that client state is untrusted for any competitive/credential feature |
| S-04 | Low | Learner name and full tutor chat history (60 msgs) are stored in plaintext localStorage | `store.tsx:108` | Disclose; offer "clear data/export"; don't store sensitive text |
| S-05 | Low | No Content-Security-Policy, no security headers (deployment not defined). `index.html` has none | `index.html` | Add CSP at hosting level (`script-src 'self'`) |
| S-06 | Low | Microphone: recognition is done by the browser's cloud service (Chrome) — audio leaves the device; no notice in UI | `speech.ts:67-97` | Add privacy note before first mic use |
| S-07 | Info | Dependency surface minimal (7 packages). `npm audit --offline` reported none but is not a real scan | | Run `npm audit` online + Dependabot in CI |
| S-08 | Info | Future AI backend: keep provider keys server-side, rate-limit, validate input, log prompts carefully | | |

No Critical/High vulnerabilities found in the current scope.

---

## 10. Performance Assessment

Measured: production bundle 460 KB / **146 KB gzip** single JS chunk, 8.7 KB gzip CSS; headless Chrome renders each route within the 500 ms wait used in the audit. No profiler run, no Lighthouse run (not available), so everything below is code-based unless stated.

| ID | Sev | Finding | Evidence | Fix |
|---|---|---|---|---|
| P-01 | Medium | All data + all screens are in one chunk; content growth directly increases first load | `App.tsx` eager imports; single `index-*.js` | Route-level `React.lazy`; load content packs per course/language as JSON |
| P-02 | Medium | Full-state serialisation on every change + 15-second idle ticker re-rendering the entire app | `store.tsx:63-88` | Split stores, debounce writes, drop the ticker |
| P-03 | Low | `/vocabulary` renders all 226 rows (page height ≈17,000 px) — no virtualisation; each row is a button | audit: docH 17451 | OK at this size; virtualise or paginate when >1000 |
| P-04 | Low | `ReadingView` calls `lookup()` twice per word per render, each doing `VOCABULARY.find` (linear) | `ReadingLab.tsx:72`, `:39-45` | Pre-built `Map` |
| P-05 | Low | Fonts: `Inter` is listed but never loaded → inconsistent typography across OS, but also no font-loading cost | `base.css:14` | Self-host a subset incl. Cyrillic + Kyrgyz letters (ү, ө, ң) |
| P-06 | Low | `speakSequence` uses chained `speechSynthesis` utterances with timers; voice list loads asynchronously (`onvoiceschanged`) so the first utterance may use a default voice | `speech.ts:5-14,39-52` | Await voices, expose voice selection |

---

## 11. Technical Debt (consolidated)

| ID | Sev | Debt | Files |
|---|---|---|---|
| D-01 | High | Zero automated tests (no unit, content, or e2e); pure modules (`srs`, `stats`, `analysis`, `questions`) are easily testable | repo |
| D-02 | High | No lint/format/CI; no `npm run lint`; `build` = `tsc --noEmit && vite build` only | `package.json` |
| D-03 | High | Schema hard-coded to German + RU/KY (F-01) | `data/types.ts` |
| D-04 | Medium | Duplicated "level chips + lock" UI in Reading/Listening/Writing/Tests/Learn | `ReadingLab.tsx:20-22`, `ListeningLab.tsx:22-26`, `WritingLab.tsx:18`, `PracticeScreens.tsx:101-103`, `LearnScreen.tsx:21-25` |
| D-05 | Medium | Duplicated speaking-then-score blocks (`TopicScreen.onSpeak`, `DailyScreen.onSpeak`, `SpeakingSession`) | `TopicScreen.tsx:55-60`, `PracticeScreens.tsx:151-155` |
| D-06 | Medium | Magic strings for progress keys and IDs (A-05) | many |
| D-07 | Medium | Long single-line CSS rules (features.css line 67 etc.) hurt maintainability; two global CSS files, no scoping | `styles/*.css` |
| D-08 | Low | Stale/`README` claims: "Grammar explanations are Russian-first; Kyrgyz/German exist for titles, summaries and core why" — consistent with findings; README architecture otherwise accurate | `README.md` |
| D-09 | Low | `Question.vocabId` for article items is derived by `id.replace('art-','')` | `questions.ts:41` |
| D-10 | Low | React `key={o}` for quiz options may duplicate if two options share text | `QuizRunner.tsx:145` |
| D-11 | Low | `dist/` exists in the working tree; building overwrites it (gitignored) | |

No dead-code or unused-variable errors (TS `noUnused*` passes).

---

## 12. Missing Features (relative to the vision)

| Priority | Missing | Notes |
|---|---|---|
| Critical | Learning-language + explanation-language settings, course/language registry | F-01 |
| Critical | English course content | none exists |
| High | Complete Kyrgyz localisation and review | F-03 |
| High | Onboarding & placement that sets level/goals | U-02 |
| High | PWA: manifest, icons (192/512, maskable), service worker, offline, install prompt, update flow | `public/` has only `favicon.svg` |
| High | Persistence layer with versioning, export/import, error surfacing | F-07 |
| Medium | Accounts + cloud sync + backend | S-02 |
| Medium | Tablet layout | §7 |
| Medium | Real audio (recorded/neural TTS) for listening and consistent voices | uses OS voices |
| Medium | Real AI tutor / pronunciation assessment (server-side) | F-08 |
| Medium | Tests, lint, CI, error boundary, analytics-free error logging | D-01/02; no `ErrorBoundary` exists (verified by grep absence: no `componentDidCatch`/boundary) |
| Low | Notifications/reminders, content CMS, A2–C1 content, accessibility statement | |

---

## 13. Recommended Architecture

Principles: **evolve, don't rewrite**; keep React/TS/Vite and the CSS tokens; introduce boundaries *where hard-coding currently lives*.

```
src/
  core/
    settings/    uiLocale, explanationLocale, targetLanguage, courseId, theme, goals
    progress/    event log + reducers (recordActivity), selectors, schema+migrations
    storage/     StorageRepository interface (LocalStorage now; IndexedDB / API later)
    auth/        interface only (anonymous now)
  engine/        generic activity runners: Quiz, Flashcards/SRS, Reading, Listening, Speaking, Writing
                 contract: Activity → ActivityResult {score, items[], durationMs}
  languages/
    registry.ts  { de: {speechLang:'de-DE', rtl:false, grammarKit…}, en: {…} }
    de/ en/      language-specific analysers, speech config, error patterns
  content/
    courses/<courseId>/  manifest.json (languagePair-agnostic), units, lessons
    translations/<locale>/…   explanations per locale (ky, ru, …) keyed by content id
  i18n/          UI strings only, ICU-style messages, completeness test
  ui/            design system (tokens, components, icons), responsive shells
  platform/      web router, speech adapter, PWA, (future) native adapters
```

Key design decisions:
1. **Course = (targetLanguage, level range, content version).** Settings hold `explanationLocale` independently from `uiLocale` (default equal). Content items carry the target-language text; explanations/translations live in per-locale files referenced by id, with a fallback chain `explanationLocale → uiLocale → en` that *reports* fallbacks in dev.
2. **Progress keyed by `courseId`** and typed `ActivityId` (`{kind, unitId, itemId}`); one reducer enforces XP caps, pass thresholds and idempotency.
3. **Analysers return structured results** (`{code, params}`), rendered through i18n; swap mock → remote service behind `AssessmentService`.
4. **Content as data** (JSON, validated by a schema at build time), lazy-loaded per course; a script checks translation coverage and broken ids.
5. **Navigation**: five primary destinations on mobile (Home, Learn, Practice, Review/Words, Me), tutor as floating action; desktop sidebar; **tablet** = collapsible rail + two-pane (list/detail) layouts.
6. **Routing**: keep hash routing until PWA hosting is chosen; then move to history routing with a typed route table and lazy loaders.
7. **PWA first, native later**: Workbox/`vite-plugin-pwa`, offline cache of app shell + downloaded course packs; keep `engine`/`core`/`content` free of DOM so a React Native/Capacitor shell can reuse them.

---

## 14. Prioritised Improvement Roadmap

| Phase | Work | Size | Exit criteria |
|---|---|---|---|
| **0 – Safety net (days)** | Add Vitest for `srs`, `stats`, `questions`, `analysis`; ESLint + Prettier; GitHub Actions (typecheck, lint, test, build); content-integrity script (unique ids, referenced ids exist, per-locale coverage report); remove default name "Daniiar"; error boundary | S | CI green; coverage report for ky/ru |
| **1 – Progress integrity** | Central `recordActivity`; XP caps; pass thresholds for test/review completion; add unit-10 reading; active-time tracking; versioned/validated storage + export/import + recovery | M | F-04…F-07 closed, tests added |
| **2 – Language model** | `settings` with 3 independent fields; `Course`/`Language` registry; refactor schema to language-keyed text; move speech language into registry; replace Russian literals with i18n keys/structured results; German stays as course #1 | L | German-with-Kyrgyz and German-with-Russian produce no Russian leaks in Kyrgyz mode (automated check) |
| **3 – Localisation quality** | Complete Kyrgyz UI keys, exercise explanations, mistakes, listening/reading translations; native review; remove `de` as an *interface* locale or define it intentionally | M-L (content) | ky ⊇ ru keys; review sign-off |
| **4 – Onboarding & IA** | First-run flow (languages, level, goal), re-think navigation, SVG icon set, accessible Sheet/dialog, aria localisation, contrast fixes | M | Manual a11y pass; axe-core clean on key pages |
| **5 – Responsive pro experience** | Tablet rail + two-pane layouts, 44 px touch targets, keyboard-safe composers, landscape/320 px checks, Playwright visual tests at 390/768/1440 | M | Screenshots in CI; no overflow; targets ≥44 px |
| **6 – PWA** | Manifest, icons, service worker, offline course packs, update prompt, history routing | M | Lighthouse PWA pass; offline lesson works |
| **7 – English course** | Add `en` target via content pack (A1 first) to validate the architecture | L | English course without touching engine code |
| **8 – Backend (optional)** | Auth, sync (event log), real tutor/assessment services, privacy/consent, monitoring | L | Decide after phases 0–7 |

---

## Final Recommendation

**1. Is the project worth continuing?** Yes. It is a working, well-structured MVP with real pedagogy and good UI. The cost of continuing is lower than a rewrite; the risk is building more languages on the current schema.

**2. What should be preserved?** The topic lesson model (`TopicScreen`), mistake-driven recommendations, the `Question` abstraction, SRS, design tokens and UI primitives, typed content separation, service interfaces (`TutorService`), honest "demo" disclosures, strict TypeScript, tiny dependency set.

**3. What should be refactored?** Store/persistence (split, validate, version), progress/XP rules, content schema and ID conventions, i18n usage (remove hard-coded prose), analysers (return structured results), router (typed table, lazy loading), duplicated level-chip and speaking blocks.

**4. What should be redesigned?** The language model and settings; onboarding; navigation/IA for mobile; the tablet layout; dialogs/a11y; icon system; Reading interaction model; assessment/placement.

**5. Five biggest weaknesses**
1. Interface/explanation/learning languages are not independent; German and Russian are hard-coded in schema and logic (F-01, F-02).
2. Kyrgyz is incomplete (43% of UI keys; no Kyrgyz exercise explanations) and fails silently (F-03).
3. Progress, XP and completion are not trustworthy and storage is unvalidated (F-04…F-07).
4. No tests/lint/CI, no PWA, no backend/accounts (D-01/02, §12).
5. Tablet unaddressed; accessibility and touch targets incomplete (§7, U-04, U-07).

**6. Five strongest existing features**
1. 7-step grammar lesson flow with "WHY?" explanations and interactive visuals.
2. Unified quiz engine feeding adaptive weak-area recommendations and article drills.
3. Leitner SRS with vocabulary mastery stages.
4. Broad skill coverage in one app (listening, reading, writing, speaking, real-life, daily challenge) with 10 coherent A1 units.
5. Clean, consistent visual design with dark mode and working desktop sidebar / mobile bottom-nav shells (no horizontal overflow at 390/768/1440).

**7. What should be implemented first?** Phase 0 (tests, lint, CI, content checks) and Phase 1 (progress integrity) in parallel with the Phase 2 design spike for the language model — the schema change must land before any new content (English, more Kyrgyz) is written.

**8. How to reach a professional desktop/tablet/mobile experience?** Keep the current desktop sidebar and mobile bottom-nav; add a tablet rail + two-pane layouts at ~768–1023 px; raise all interactive targets to ≥44 px; fix Sheet focus handling and sticky composers with the on-screen keyboard; replace emoji icons; localise weekday/aria strings via `Intl`; verify with automated Playwright screenshots at 390×844, 768×1024, 1440×900 plus real-device testing on iOS Safari and Android Chrome; then add the PWA shell.

---

## Appendix A — Corrections to the earlier draft of this file

| Earlier claim | Verified status |
|---|---|
| "Home daily challenge checks `daily.speaking`, but speaking completion does not set that value" | **Not a bug as stated.** `DailyScreen.finish` sets `speaking: true` (`PracticeScreens.tsx:156`), and `HomeScreen.tsx:30` reads it. The real nuance: reloading mid-challenge restarts the quiz and can re-award XP (covered by F-04). |
| "Single locale preference" only | Incomplete: three UI locales exist and `de` is offered as UI language, which conflates learning and interface language (F-01). |
| "Missing keys fall back to Russian silently" | Correct, but understated: 59% of Kyrgyz UI keys fall back; content fallback is far larger (F-03). |
| Not mentioned | Hard-coded Russian in quiz/analysis/tutor (F-02), default name "Daniiar" (F-13), unit 10 without reading (F-05), tests completing at any score (F-04), tablet layout (§7) — these were found by this audit. |
| "No browser inspection available" | Rendered inspection **was** possible via local headless Chrome and is reported in §7. |

## Appendix B — Raw measurements

- Routes measured per viewport: `/`, `/learn`, `/learn/unit/1`, `/learn/topic/akkusativ`, `/practice`, `/practice/reading/re01`, `/practice/listening/li01`, `/practice/writing/wr01`, `/practice/tests`, `/speak`, `/speak/meeting`, `/progress`, `/tutor`, `/vocabulary`, `/grammar`, `/profile`.
- Navigation mode: bottom nav at 390 and 768; sidebar at 1440.
- Page overflow: none at any viewport; `/grammar` mobile contains internally-scrolling elements.
- Small interactive targets (<44 px in either dimension) at 390 px: 3 (home) to 44 (reading); typical offenders: logo link 97×30, icon buttons 40×40, `Segmented` 37 px tall, step chips 48×42, vocabulary chips 37 px tall.
- Screenshots were generated in the session scratchpad, not in the repository.
