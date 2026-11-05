# 06 — Responsive Design, Accessibility and UX Platform

Part of the BilUp Til 2.0 set ([01](01_PRODUCT_ARCHITECTURE.md)). Addresses **V-12, V-15 (brand), V-19**, tablet limitations, small touch targets, and responsive requirements for the marketplace (09). PWA behaviour is specified in [07 §5](07_TECHNOLOGY_STACK.md); this document covers the UX layer.

---

## 1. Verified current state

Evidence: Audit (rendered Chrome, 16 routes × 3 viewports, single author) and Review (independent: Home at 390/768/1440, Reading at 390/768). Both used headless Chrome DevTools; **no real devices, screen readers or contrast tools**.

| Fact | Status | Evidence |
|---|---|---|
| Shell modes: 390 and 768 → top bar + 5-item bottom nav (sidebar hidden); 1440 → 252 px sidebar, content max 1120 px | **[V]** both | `base.css:73-108`; CDP |
| Only one structural breakpoint (`min-width:1024px`); other media queries: 520, 700 (sheet), 720 (quiz columns) | **[V]** | `base.css:93,179`; `features.css:67,277` |
| Portrait tablet (768) receives the stretched phone shell: single column, bottom nav | **[V]** both | screenshots; Review §5 |
| No document-level horizontal overflow: Home (390/768/1440), Reading (390/768) | **[V]** both. Other routes: Audit only. `body{overflow-x:hidden}` could mask child overflow | `base.css:50-53` |
| `/grammar` at 390 contains elements at right edges 405/546 px inside an internally scrolling container | [V] Audit only | |
| Touch targets < 44 px: `.iconbtn` 40×40 (`base.css:91`); Reading word buttons ≈53×41 (Review) and 39–41 high (Audit); Home: 3 targets under 44; Segmented/chips ≈37 px high | **[V]** | CDP measurements |
| Safe-area insets used (`env(safe-area-inset-*)`), `100dvh`, sticky composer above fixed nav | **[V]** | `base.css:73-82`; `features.css:251,258` |
| Dark theme and `prefers-reduced-motion` supported; `:focus-visible` ring defined | **[V]** | `base.css:34,59,212` |
| `Sheet`: Escape closes; `role=dialog aria-modal`; **no** focus placement/trap/restore or scroll lock | **[V]** (Review corrected Audit) | `ui.tsx:110-135` |
| `Segmented` uses `role=tablist` without panels or arrow keys | **[V]** | `ui.tsx:98-106` |
| Reading uses one `<button>` per word (40–44 tab stops for a short text) | **[V]** | `ReadingLab.tsx:71-76` |
| Hard-coded English/German/Russian ARIA and labels (`"Back"`, `"Close"`, `"Navigation"`) and weekday letters | **[V]** | `ui.tsx:75,127`; `Layout.tsx:28,63`; `HomeScreen.tsx:15`; `ProgressScreen.tsx:10` |
| Emoji used as nav icons (greyed via CSS filter) | **[V]** | `Layout.tsx:9-21` |
| Font `Inter` named but never loaded | **[V]** | `base.css` `--font` |
| Contrast: `--ink-3 #7b86a8` on `#f5f6fb` ≈ 3.3:1 (Audit hand calculation) | **[A]** unmeasured | `base.css:13` |
| Real-device, landscape-phone, 320 px, 200 % zoom, soft-keyboard behaviour | **[A]** not tested | |

---

## 2. Design goals **[R]**

1. **Three first-class experiences** — phone, tablet, desktop — plus landscape and large-screen variants, not "phone layout stretched".
2. **Touch-first correctness**: ≥ 44 × 44 CSS px for primary interactive targets (WCAG 2.2 AA minimum 24 × 24 + spacing; **44 is our standard**).
3. **WCAG 2.2 AA** for core learning flows and marketplace booking.
4. **Text-expansion safe**: Kyrgyz and Russian strings are often longer than English; no fixed-width labels.
5. **PWA-ready**: installable shell, safe areas, offline states, no layout dependence on browser chrome.
6. **One component library** serving learning and marketplace (consistent tokens).

---

## 3. Breakpoints and window classes **[R]**

Window-size classes (container-query friendly) — values are configuration in `ui/tokens`, not scattered literals:

| Class | Width | Typical devices | Shell |
|---|---|---|---|
| **compact** | < 600 px | phones portrait | top app bar + bottom nav (≤5 items), single column |
| **medium** | 600–1023 px | tablets portrait, large phones landscape, small windows | **navigation rail** (icons + labels), content in 1–2 panes |
| **expanded** | 1024–1439 px | tablets landscape, laptops | full sidebar (collapsible to rail), two-pane layouts, side panels |
| **large** | ≥ 1440 px | desktop | sidebar + centered content (max readable width) + optional right-hand context panel |

Today's single `1024` breakpoint maps to the start of *expanded*; the new *medium* class fixes V-12. Height classes (≤ 480 px = landscape phone) adjust sticky bars and composers.

Use CSS container queries for components (cards, quiz options, lesson steps) so they respond to their pane, not only the viewport.

---

## 4. Shells and navigation (IA) **[R]**

### 4.1 Information architecture
Primary destinations (same set across shells):

| Destination | Contains |
|---|---|
| **Home** | today's plan, streak, recommendations, continue learning |
| **Learn** | course map (levels → units → lessons), vocabulary, grammar library |
| **Practice** | review (SRS), quizzes, daily challenge, listening, reading, writing, speaking, tests |
| **Live** [F-P8c] | BilUp Live schedule, lobby and participation (German and English sessions); visible according to decision 10 L-09; **joining is enforced server-side by entitlement, never by navigation** |
| **Teachers** [F-P9] | search, bookings, classroom (marketplace; separate paid service; hidden until the module is enabled) |
| **Progress** | stats, mistakes, badges |
| **Me** | profile, settings (4 language/course settings), **subscription and usage (plan, renewal, upgrade/downgrade, AI Tutor allowance)**, data/export, teacher dashboard link [F] |

Tutor becomes a **floating action/side panel** rather than a top-bar icon; Vocabulary and Grammar are reachable from Learn (today they are hidden on mobile behind quick links — Audit U-06).
**Navigation composition (resolved — review X-8; extended in revision 3):** there are up to **seven** destinations (Home, Learn, Practice, Live, Teachers, Progress, Me) but the **compact bottom nav holds at most five**. Rule, configuration-driven: when BilUp Live is enabled the compact bottom nav = **Home, Learn, Practice, Live, Me** (five items); **Progress** and **Teachers** are reached from prominent cards on Home and entries in Me (never removed); when Live is disabled the bottom nav = Home, Learn, Practice, Progress, Me (Teachers, if enabled, replaces Progress as before). The **medium/expanded/large rail/sidebar shows all enabled destinations**. This is a UX proposal (Live may also be positioned differently — a product decision); tests assert ≤ 5 items on compact in every module-flag combination and that Progress and Teachers are reachable in ≤ 2 taps.

### 4.2 Shell behaviour per class
| Class | Navigation | Content | Notes |
|---|---|---|---|
| compact | bottom nav + top bar (course/locale shown) | single column; sticky action bar above nav | safe-area bottom padding; keyboard-aware composers |
| medium | **left rail** (72–88 px), optional bottom sheet for secondary | 1 column up to ~720 px, **two-pane for list/detail** (e.g. unit list + unit detail, teacher list + profile) | portrait iPad use-case |
| expanded | collapsible sidebar (252 px) | two-pane; lesson with side panel (examples/vocabulary) | |
| large | sidebar | max-width ~1120–1280 px; optional context panel (tutor, hints, glossary) | line length ≤ ~75 ch for reading |

### 4.3 Learning-flow layouts
- **Lesson (7-step) flow:** compact = stepper collapsed to "step n of N" (today's pattern), medium+ = stepper rail + step content + optional "why/examples" side panel.
- **Quiz:** answer options in 1 column (compact), 2 (medium), 3 for article drills (preserves existing `quiz__options` logic); sticky "check/continue" bar thumb-reachable.
- **Reading:** replace per-word `<button>` with a single text region and a **lookup interaction** (tap/click word → popover/side panel) with roving focus or sentence-level navigation; targets get ≥ 44 px effective hit area through padding on a wrapper, plus keyboard "next word" navigation. Side panel on expanded+ instead of a bottom sheet.
- **Speaking/Tutor:** composer docks above the keyboard (use `visualViewport` / `dvh`), not behind the fixed nav.
- **Marketplace:** search filters as a bottom sheet (compact), left filter column (expanded); booking calendar adapts (day list on compact, week grid on expanded); timezone always shown (09 §7).

---

## 5. Touch targets, spacing, typography **[R]**

| Rule | Value |
|---|---|
| Minimum interactive size | 44 × 44 px (icon buttons today 40 → 44; chips/segmented min-height 44; reading words via padded wrapper) |
| Spacing between targets | ≥ 8 px |
| Base type | 16 px minimum for body; inputs 16 px (prevents iOS zoom); use `rem` and `clamp()` |
| Fonts | Self-hosted variable font with **Cyrillic including ү ө ң** and Latin Extended (ä ö ü ß) — replaces the unloaded `Inter` stack; `font-display: swap`; subset by script |
| Line length | reading text ≤ 75 ch |
| Motion | respect `prefers-reduced-motion` (kept); no essential info in animation |
| Icons | SVG icon set (tree-shaken), `currentColor`, accessible names via `MessageRef` — replaces emoji nav (consistency across OSes; Kyrgyz/Russian screens don't depend on emoji fonts) |
| Colour | tokens retained; **fix `--ink-3` and any failing pair after measurement**; semantic roles (case/word-role colours) must not be the only information carrier (add labels/shape) |

---

## 6. Accessibility requirements **[R]**

1. **Dialogs/sheets** (V-19): use native `<dialog>` or a tested focus-trap utility; move focus in, trap, restore on close, `inert` background, scroll lock, `aria-labelledby`/`describedby`.
2. **Tabs/segmented:** choose correct semantics — radio group for mode switches; full tab pattern (arrow keys, panels) only for real tabs.
3. **Landmarks:** `header/nav/main`; skip link; one `h1` per view; unique `aria-label`s for the two `nav` landmarks (currently identical `Navigation`).
4. **Localised ARIA:** all labels through the message catalog (`uiLocale`); `lang` attributes on mixed-language runs (`lang="de"` for target text inside Kyrgyz/Russian UI, `lang="ky"`/`"ru"` for explanations, including when `explanationLocale ≠ uiLocale`) — also improves TTS/screen-reader pronunciation.
5. **Live regions** for quiz feedback and chat (kept; verify politeness).
6. **Focus management on route change** (move focus to `h1`); `window.scrollTo(0,0)` alone (`App.tsx:62`) is not sufficient.
7. **Audio/speech:** controls with text alternatives; transcripts always available (existing transcript step retained); don't require voice input (typed fallback retained).
8. **Reduced data/motion, dark mode, 200 % zoom/text spacing** pass.
9. **Marketplace:** accessible calendar/date-time picker, error summaries on forms, payment forms via provider-hosted fields tested with keyboard and screen reader.

---

## 7. Brand, locale and layout robustness

- Product name in UI/metadata: **"BilUp Til"** **[R, Q12]**; "BilUp Deutsch" survives only as a course title (`de-general` title) — resolves V-15's naming inconsistency. Default display name is empty/localised (V-15).
- Pseudo-locale `xx-long` (+40 % text) and a Kyrgyz/Russian screenshot pass are part of visual tests.
- RTL is not required (initial locales LTR) but components use logical CSS properties (`margin-inline`, …) to keep future locales possible **[F]**.
- Dates, numbers, currencies via `Intl` (`uiLocale`); times for bookings in the user's timezone with explicit zone labels.

---

## 8. Performance and platform considerations
- Route-level code splitting and lazy content (07 §4, 04 §10) reduce initial JS on mobile networks.
- Avoid layout shift: reserve space for async content; skeletons instead of spinners.
- `backdrop-filter`/heavy shadows have a low-power fallback.
- Install/offline UX (offline banner, "update available" toast) is chrome in `uiLocale` — specified in 07 §5.
- Native-readiness **[F]**: no component reads `window`/`navigator` directly; platform capabilities (speech, storage, share, haptics) are ports.

---

## 9. Test plan **[R]**

| Test | Tool | Gate |
|---|---|---|
| Visual regression at **390×844 (compact), 768×1024 (medium portrait), 1024×768 (medium/expanded boundary), 1440×900 (large)** + 844×390 landscape phone, for every route in a route manifest | Playwright screenshots — **pixel baselines in Chromium only** on a curated set of routes; WebKit and Firefox run the same routes for **overflow, touch-target and axe audits without pixel baselines** *(simplified — review O-6)* | no unexpected diff; reviewed baselines |
| **Overflow detector** per route: any element whose bounding box exceeds the viewport (not relying on `body.scrollWidth` because `overflow-x:hidden` masks it) and clipped text | Playwright script | zero findings on all routes (re-establishes Audit's single-author result for every route) |
| **Touch-target audit**: all visible `a, button, input, [role=…]` ≥ 44×44 or exempted with documented reason | Playwright | ≤ allowlist |
| Accessibility scan (axe-core) on key flows in `ky` and `ru`, light/dark | `@axe-core/playwright` | no serious/critical |
| Keyboard-only walkthroughs (lesson, quiz, reading lookup, dialog, booking) | Playwright scripted | pass |
| Contrast: automated token-pair check in CI | script on tokens | AA pass |
| Text-expansion/pseudo-locale run | Playwright | no overflow/clip |
| Real-device smoke matrix (iOS Safari, Android Chrome, iPad) before each release; screen-reader spot checks (VoiceOver, TalkBack, NVDA) | manual checklist | signed off (Q14) |
| Lighthouse (performance/PWA/a11y) budgets | CI | thresholds in 07 §4 and §7 |

### Acceptance criteria for P5
- Medium (tablet) shell implemented; zero overflow and ≥ 44 px target violations on all routes in the manifest; dialogs pass focus tests; contrast pass; all four language-setting combinations render without clipped or mixed-locale text; manual device smoke done.

## 10. Open items
- Exact bottom-nav composition once Teachers is enabled (5-item limit).
- Whether the tutor is a global floating panel or a Practice sub-route.
- Font choice and licensing (self-hosting), covering Kyrgyz glyphs.
- Real-device lab availability (Q14).
- (Revision 2) Two-pane/master-detail layouts in P5 are built on whichever router approach is chosen at the start of P5 (07 §3); the navigation composition rule (≤ 5 compact items with the marketplace on or off) is in §4.1.
