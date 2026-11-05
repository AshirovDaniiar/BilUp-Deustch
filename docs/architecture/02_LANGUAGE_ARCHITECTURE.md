# 02 — Language Architecture

Part of the BilUp Til 2.0 set ([01](01_PRODUCT_ARCHITECTURE.md) defines labels **[V] [R] [A] [F]** and vocabulary). Addresses findings **V-01, V-02, V-03, V-18** and the "no silent Russian fallback" requirement.

---

## 1. Verified current state

| Fact [V] | Evidence |
|---|---|
| One union `Lang = 'ru' \| 'ky' \| 'de'` is both UI locale and the key of `L10n` | `src/data/types.ts:3,8-12` |
| `UserProgress.lang` is the single language preference; Profile exposes one selector labelled *interface language*, offering Deutsch | `types.ts:176-179`; `ProfileScreen.tsx:20-22` |
| `de` means two things: "German UI text" (`L10n.de`) and "the target word" (`VocabularyItem.de`) | `types.ts:8-12,26-35` |
| Target language embedded in field names (`de`, `ru`, `ky`, `exampleRu`, `GrammarExample{de,ru}`) | `types.ts:26-46` |
| Speech hard-coded to `de-DE` | `services/speech.ts:26,80` |
| Kyrgyz: 121/280 UI keys overridden, 159 inherit Russian (`...ru`); runtime fallback `?? ru` | `i18n/ky.ts:1-6`; `i18n/index.ts:9` |
| `tr(t, lang)` falls back to `t.ru` | `utils/text.ts:3` |
| Hard-coded Russian prose in logic | `questions.ts:47-74,134-137`; `tutor.ts`; `analysis.ts:41-93`; `WordCard.tsx:92`; `PracticeScreens.tsx:128`; **`features/grammar/Labs.tsx:157,193,229-230,289`** (Russian prose plus a binary `lang === 'de' ? German : Russian` branch that gives Kyrgyz users Russian — omitted by the earlier reports, found by the architecture review) |
| Reading gloss shows RU and KY simultaneously; Listening shows `ru` only (hidden for `de`) | `ReadingLab.tsx:95-104`; `ListeningLab.tsx:112` |
| Content counts without KY: exercise "why" 0/202; mistake notes 0/40; "when" notes 0/70; listening lines 0/86 | data bundling in both reports |

Consequence: "German with Kyrgyz explanations" cannot be expressed, English cannot be added by writing content alone, and a Kyrgyz learner receives Russian quizzes, feedback and tutor replies.

---

## 2. Target model **[R]**

### 2.1 The four settings
```ts
// illustrative contract — not implemented
type LocaleCode = string;            // validated against LocaleRegistry ('ky' | 'ru' initially)
type LanguageCode = string;          // validated against LanguageRegistry ('de' | 'en' initially)
type CourseId = string;              // validated against CourseRegistry ('de-general' | 'en-general')

interface LearnerSettings {
  uiLocale: LocaleCode;              // chrome only
  explanationLocale: LocaleCode;     // ALL instructional material
  targetLanguage: LanguageCode;      // language being learned
  courseId: CourseId;                // implies targetLanguage
  theme: 'auto' | 'light' | 'dark';
  // goals, reminders, etc. live in profile/preferences, not here
}
```
Invariants (enforced by `core/settings`, tested):
1. `course(courseId).targetLanguage === targetLanguage`.
2. **Release semantics are per level, selectable per course** *(clarified — review X-3)*: a level is *available* for a learner iff `explanationLocale ∈ course.releasedLocales[levelId]` (04 §3, §7). A course is *selectable* for an `explanationLocale` iff at least one of its levels is available in that locale. Unavailable levels are shown as *"not yet available in <your language>"* (chrome in `uiLocale`) — **never** rendered in a different language.
3. Changing `uiLocale` never changes `explanationLocale` or `courseId`, and vice-versa. Onboarding pre-fills `explanationLocale = uiLocale` as a convenience only.
4. Changing `targetLanguage` switches to that language's default course for the learner (or to the course chosen); progress stays in the previous course (05 §3).
5. Changing `explanationLocale` never changes `courseId`, enrollment, progress or history (§2.4).

### 2.4 Changing `explanationLocale` during an active course **[R]** *(new — review R-3, X-3)*
`explanationLocale` is a **presentation setting**: it selects the language of instructional text. All progress is keyed by language-neutral content ids (04 §2, 05 §3), so switching **never resets, duplicates or migrates** learning history.

| Aspect | Behaviour on switch (e.g. `ru` → `ky`) |
|---|---|
| Course, enrollment, level position | unchanged; the same `courseId` continues |
| XP, credit ledger, completion, mastery/SRS, saved items, mistakes, streak, daily rewards | unchanged (not keyed by locale; no copy is made) |
| Stored results | keep an informational `explanationLocale` tag (metadata only, never part of any key or credit rule) |
| In-progress activity attempt | **discarded without credit or penalty** after a confirmation prompt, because generated text (e.g. translated answer options) depends on the locale; completed results are untouched. Lesson steps already passed are retained if the lesson is resumable (the lesson stores step progress by content id) |
| Levels/activities released in the new locale | work immediately |
| Levels **not** released in the new locale | shown locked with reason *"not yet available in Kyrgyz"*; "Continue" recommends the next activity among released ones; a one-tap **"switch back to <previous locale>"** is offered. There is no per-level mixing and no silent substitution |
| If *no* level of the course is released in the new locale | the switch is blocked with an explanation (the course is not selectable in that locale, §2.1 item 2) |
| Daily challenge of the current day | keeps its seed (date + course); prompts re-render in the new locale; the daily reward key is unchanged, so no second reward |
| Tutor history | older messages stay in the language they were written, labelled by locale; new messages use the new locale; the learner may clear history (05 §3) |
| Placement/assessment history | unchanged; displayed with new-locale labels |
| `uiLocale` | independent: switching it alone changes chrome only |

Tests: 02 §7 (items "Locale switch preserves progress", "Locale switch discards in-flight attempt"), 05 §12.

### 2.2 Registries (configuration, not code branches)
```ts
interface LocaleDescriptor {
  code: LocaleCode;                  // 'ky', 'ru'
  endonym: string;                   // 'Кыргызча', 'Русский'
  script: 'Cyrl' | 'Latn' | …;
  direction: 'ltr' | 'rtl';
  intl: string;                      // BCP-47 for Intl APIs, e.g. 'ky-KG', 'ru-RU'
  pluralRule: string;                // from Intl.PluralRules
  status: 'released' | 'beta' | 'planned';
  fontStack: string[];               // must cover Cyrillic incl. ү ө ң
}
interface LanguageDescriptor {      // a target language
  code: LanguageCode;                // 'de', 'en'
  endonym: string;                   // 'Deutsch', 'English'
  speech: { tts: string[]; recognition: string };  // ['de-DE'], ['en-GB','en-US']
  orthography: { caseSensitiveNouns: boolean; … }; // used by writing checks
  analyzers: AnalyzerSetId;          // language-specific error patterns / checks
  levelScale: LevelScaleId;          // 'cefr'
}
interface LevelScale { id: 'cefr'; levels: { id: string; order: number; label: MessageRef }[] }
```
- Adding an explanation locale = add a `LocaleDescriptor`, a UI catalog and per-course translation bundles. **No** change to engine, schema or components.
- Adding a target language = add a `LanguageDescriptor`, analyzer set, speech config and at least one course pack.
- The current `de.ts` UI dictionary is not part of the initial `LocaleRegistry` (UI locales are `ky`, `ru`); it stays dormant (Q1 in 01 §9). Importantly, "German UI" and "German as target" become unrelated concepts with different identifiers (`LocaleCode` vs `LanguageCode`).

### 2.3 Identity of code spaces
`LocaleCode` and `LanguageCode` are **separate branded types** and are never compared or interchangeable (compile-time guard). The collision that exists today (`de` = locale and language) cannot recur.

---

## 3. What is "chrome" and what is "instructional"

Normative classification (drives which locale a string uses and what tests enforce):

| Surface | Class | Locale |
|---|---|---|
| Navigation labels, buttons, settings labels, empty/error states, form validation, dates/numbers, ARIA labels, onboarding chrome, install/offline notices | **Chrome** | `uiLocale` |
| Grammar explanations, "why", "when", examples' translations, common-mistake notes | **Instructional** | `explanationLocale` |
| Quiz instructions/prompts' meta text ("What does … mean?", "Fill in the blank"), answer rationale | **Instructional** | `explanationLocale` |
| Vocabulary meanings, example translations, reading/listening glosses and translations, transcripts' translations | **Instructional** | `explanationLocale` |
| Speaking/writing feedback, corrections, tips, rubric descriptions, scores' labels in feedback cards | **Instructional** | `explanationLocale` |
| Tutor replies, suggestions, starter prompts | **Instructional** | `explanationLocale` |
| Placement/test result text and recommendations | **Instructional** | `explanationLocale` |
| Lesson titles, unit subtitles, goals ("what you will understand") | **Instructional** | `explanationLocale` |
| Daily-challenge prompts and hints | **Instructional** | `explanationLocale` |
| Target-language text (words, sentences, dialogues, passages, prompts to be answered) | **Target text** | `targetLanguage` — never translated, never an "explanation" |
| Marketplace UI | Chrome | `uiLocale` |
| Subscription UI (plan names and descriptions, checkout, status, usage meters, payment and denial messages, renewal/failed-payment notices) | Chrome | `uiLocale` |
| BilUp Live UI (schedule, lobby, buttons, moderation notices, denial reasons) | Chrome | `uiLocale` |
| **BilUp Live instructional content** (poll/quiz text, task instructions, feedback, materials; each published item needs a version per released `explanationLocale` — 10 §12) | Instructional | `explanationLocale` |
| Live chat messages | User-generated | author's language, tagged; never translated or substituted |
| Live teacher's *spoken* instruction language | — | **unresolved (10 L-01)**; written learner-facing Live material still follows `explanationLocale` |
| Invoices, receipts, subscription terms (legal text) | Chrome-class, legal | language policy to be set with legal advice **[A]** (11 U-03) |
| Teacher bio / offer description | **User-generated** | author's language, tagged `contentLocale`; never machine-substituted (09 §4) |
| Notifications (booking, lesson reminders) | Chrome-class | `uiLocale` |

Edge case: a string embedding both (e.g. "Что значит «Haus»?") is composed from a chrome/instructional template (`explanationLocale`) plus a target-text parameter.

When `uiLocale = ru` and `explanationLocale = ky`, the screen legitimately mixes Russian chrome with Kyrgyz instruction; the test suite asserts that **no instructional node contains Russian** and **no chrome node contains Kyrgyz**, respectively (§7).

---

## 4. Message architecture

### 4.1 `MessageRef` instead of prose **[R]**
Services and domain code never return natural-language strings. They return references:
```ts
interface MessageRef { key: string; params?: Record<string, string | number | MessageRef>; ns: 'ui' | 'instruction' }
```
Rendering resolves with the correct locale by namespace: `ns:'ui'` → `uiLocale`; `ns:'instruction'` → `explanationLocale`.

Examples of conversions required by V-03:

| Today (hard-coded) | Target |
|---|---|
| `questions.ts:50` ``Что значит «${word}»?`` | `{ns:'instruction', key:'quiz.vocab.meaningOf', params:{word}}` (word stays target text) |
| `analysis.ts:41` "Так сказали бы чаще всего…" | `{ns:'instruction', key:'speaking.feedback.naturalPhrasing'}` |
| `analysis.ts:82` "начало предложения / Каждое предложение…" | `{ns:'instruction', key:'writing.spelling.capitalizeSentenceStart'}` |
| `tutor.ts` replies | tutor returns `{ text: MessageRef \| TutorContentRef }` (see 03 §9) |
| `PracticeScreens.tsx:128` "A1 · start" | `{ns:'instruction', key:'assessment.placement.result', params:{level, confidence}}` |
| `WordCard.tsx:92` "Скажите слово:" | `{ns:'ui'/'instruction', key:'vocab.repeatWord'}` |

### 4.2 Catalogs
- **UI catalog** per `uiLocale`: flat keys, ICU-style plural/select messages (use `Intl.PluralRules`/`Intl.ListFormat`/`Intl.DateTimeFormat`; weekday initials from `Intl`, replacing the German hard-codes `['M','D','M','D','F','S','S']`, `['Mo','Di',…]` in `HomeScreen.tsx:15`, `ProgressScreen.tsx:10`).
- **Instruction catalog** per `explanationLocale`: generic templates (feedback, quiz meta, rubric) shared by all courses, plus **course-specific** content translations in the course pack (04 §5).
- Key naming: `domain.area.name`; keys are the contract; Russian is no longer the "source of truth" dictionary shape — a locale-neutral **key schema** (`catalog.schema.ts`) defines required keys, and `ky`/`ru` are peers.

### 4.3 Parameter handling for Kyrgyz and Russian
Kyrgyz is agglutinative and has vowel harmony: concatenating a parameter into a template can require suffix changes. Rule **[R]**: templates must not append suffixes to dynamic words; use structures like `“{word}” — meaning` or let translators receive full sentences with named placeholders and write the surrounding grammar. Plural/number forms use `Intl.PluralRules` categories per locale; translators supply the categories the locale needs.

---

## 5. Strict locale policy — "no silent fallback" **[R]**

### 5.1 Rules
1. **No cross-locale fallback, anywhere.** `ky ↔ ru` substitution is forbidden at build, test and runtime. The `...ru` spread in `i18n/ky.ts`, `?? ru` in `i18n/index.ts:9` and `t[lang] ?? t.ru` in `utils/text.ts:3` are retired at stage S4 (§5.3), **not earlier**: during the rollout they survive only in the isolated, disclosed legacy path. New-architecture code never contains them.
2. **Build-time gate:** a coverage validator (04 §7, 07 §7) fails CI if a *released* locale lacks any required key or content translation. Released = declared `status: 'released'` in the locale and `releasedLocales` in the course level.
3. **Runtime on a missing key** (defect that escaped the gate or a not-yet-released locale in dev):
   - Development/test: throw/console error + visible marker `⟦missing: key⟧`.
   - Production: render an explicit, locale-correct generic notice if one exists, otherwise a neutral marker (`⚠`) and emit a diagnostics event. **It never renders text in another locale.**
4. **Availability instead of fallback:** a course/level is offered to a learner only for explanation locales in which it is fully released. If `ky` is not complete for `de-general/B1`, a `ky` learner sees B1 as *"coming in Kyrgyz"* (chrome in `uiLocale`) — not as Russian text. This turns missing translation into a product state rather than a leak.
5. **Target text is exempt** (it is the subject matter), as is user-generated marketplace content (09 §4), which is labelled with its own language.
6. **Machine translation is not a runtime fallback.** A machine-translated draft may be used by authors, but content enters `released` only after human review (04 §8).

### 5.2 Locale status lifecycle
`planned → beta → released`. `beta` locales are selectable only behind a flag/preview. A locale may be released for the UI before it is released for a course level (they are tracked separately).

### 5.3 Staged localization rollout **[R]** *(new — review H-3)*
The strict policy (§5.1) applies to everything built on the new architecture. The **existing** Kyrgyz experience, however, currently depends on Russian leakage (`ky.ts` spread; 121/280 UI keys overridden **[V]**). Removing that fallback before replacement Kyrgyz translations exist would downgrade current Kyrgyz users. Therefore the rollout is staged and the fallback is **retired only after the replacement is available and passes its gate**:

| Stage | Russian (`ru`) | Kyrgyz (`ky`) | Flags |
|---|---|---|---|
| **S0 Legacy** (today) | existing behaviour | existing behaviour (Russian leakage) | — |
| **S1 Shadow** (P2) | new resolver, catalogs and provenance instrumentation run beside the legacy `t()`/`tr()`; strict mode **off** in production; missing-key reports collected | same; fallback counters in dev/CI show exactly what is untranslated | `i18n.strict=off` |
| **S2 Russian strict** (R1a, after gate G-ru) | new path only for `ru` explanation; strict policy on; legacy `ru` removed | **Disclosed legacy mode:** Kyrgyz users keep the legacy path, with a visible, localized notice ("parts of this app are still shown in Russian") and the fallback counter active. This is the *only* sanctioned fallback in the product, it is never silent, and it has an end date tied to G-ky | `i18n.strict.ru=on`, `i18n.legacy.ky=on` |
| **S3 Kyrgyz preview** | — | new Kyrgyz path available only to internal testers/closed beta (flag); **not publicly selectable** | `i18n.preview.ky` |
| **S4 Kyrgyz public** (R1b, after gate G-ky) | — | strict policy on; legacy Kyrgyz path and all `ru` fallbacks deleted from code; `releasedLocales` lists `ky` for exactly the levels that passed | `i18n.strict.ky=on` |

Rules:
- Gates G-ru and G-ky are per **(course, level, locale)** — definitions in 04 §7.3.
- New-architecture code paths never fall back, in any stage; the legacy mode lives only in the legacy code path (isolated in `legacy-i18n/`, deleted at S4; a CI counter tracks its remaining call sites — 08 P2).
- If a learner who is in disclosed legacy mode later reaches S4, their settings and progress are unchanged (§2.4).
- Public Kyrgyz marketing/availability statements are made only after S4.

---

## 6. Language-specific behaviour behind registries **[R]**
| Concern | Today | Target |
|---|---|---|
| Speech | `de-DE` literal | `LanguageDescriptor.speech`; voice selection by language; TTS voice list awaited before first utterance (audit P-06) |
| Error patterns, spelling and capitalisation checks | German in `data/errorPatterns.ts`, `analysis.ts` (noun-capitalisation rule) | `languages/<code>/analyzers`; capitalisation rule gated by `orthography.caseSensitiveNouns` (true for `de`, false for `en`) |
| Grammar visuals (`cases`, `separable`, …) | German `GrammarVisual` union | per-language visual registry; courses reference visuals by id; unknown visual id fails validation |
| Articles / case forms in vocabulary | `article?: 'der'\|'die'\|'das'` in core item type | moved into `de` **language extension** of the item (04 §4.2); `en` items carry their own extension (e.g. irregular forms) |
| Sorting/search normalisation | `normalize()` removes ASCII punctuation | locale-aware normalization (Cyrillic ү/ө/ң, German ß/umlauts) via `Intl.Collator` + explicit folding rules |
| Tutor keyword rules | Russian/German regexes | per-language knowledge base + locale response templates (03 §9) |

---

## 7. Test strategy for the language architecture **[R]**

### 7.0 Principle: validate *provenance*, never *characters* **[R]** *(revised — review C-1)*
Russian and Kyrgyz share most of their Cyrillic alphabet (the Kyrgyz alphabet itself contains ы, э, ё, щ, ъ in addition to ү, ө, ң — confirm with a native reviewer). **No test, lint rule or runtime check may decide which language a string is in by inspecting its letters, scripts or words.** Correct verification asks *where a string came from*: which catalog or content bundle, for which locale, under which key.

**Provenance mechanism.** In test/instrumented builds the message resolver (and the content-text accessor) wraps every resolved string with `{ source: 'ui-catalog' | 'instruction-catalog' | 'course-translation' | 'target-text' | 'user-generated', locale, bundleId, key }` and renders it as `data-i18n-*` attributes on the DOM node. Production builds strip the attributes (or keep a compact form for diagnostics). Target text is rendered through a `<TargetText lang>` component and user-generated text through `<UserText lang>`, so every legitimate text node has a source.

### 7.1 Test matrix

| Test | Asserts | Phase |
|---|---|---|
| Catalog key-set equality | for every catalog schema, each *released* locale has exactly the required key set (structural, no text inspection) | P2–P3 |
| Content coverage | for each course, level and released locale: 100 % of translatable fields present (by id and field) | P3 |
| **Provenance leak test** | Render representative screens over the settings matrix `uiLocale × explanationLocale ∈ {ky,ru}²` × `targetLanguage ∈ {de,en}`. For every visible text node: (a) it has provenance (nodes without provenance fail — this also catches hard-coded literals in **any** script); (b) chrome nodes: `source ∈ ui-catalog` and `locale === uiLocale`; (c) instructional nodes: `source ∈ {instruction-catalog, course-translation}` and `locale === explanationLocale`; (d) `target-text` nodes carry the course's `targetLanguage`; (e) no `⟦missing` markers | P2–P3 |
| **Kyrgyz never falls back (fault injection)** | In a test fixture, delete one key from the `ky` catalog and one translation entry from the `ky` course bundle. Assert: the UI shows the marker (`⟦missing: key⟧` in test builds, neutral `⚠` in production builds) **and** the rendered text does not equal the `ru` string for that key, and no node under that key has `locale === 'ru'` provenance | P2–P3 |
| **Bundle-load assertion** | With `explanationLocale = ky`, record all catalog/translation modules loaded (module-loader spy; Playwright request log in E2E). Assert that **no `ru` instruction/translation bundle was requested** (the `ru` UI catalog may be loaded only when `uiLocale = ru`). Mirror assertion for `ru`. This proves absence of fallback *by construction* rather than by output inspection | P3 |
| Resolver unit tests | resolver reads only the catalog of the requested locale; requesting a missing key never consults another locale | P2 |
| Identical-string guard (catalog level) | `ky` and `ru` values for the same key may be identical only if the entry carries an explicit `sameAsOtherLocale: true` flag (loanwords, numerals, brand names). Comparison is by equality of strings and flags — no character classes | P3 |
| **Valid Kyrgyz text is never misclassified** | Fixture strings containing every letter of the Kyrgyz alphabet (including ы э ё щ ъ ү ө ң) and mixed Kyrgyz/Russian-looking words pass all tests when carrying `ky` provenance; the suite contains no character-class or language-identification logic (verified by a lint rule banning regexes over Unicode ranges in `tests/i18n/**`) | P2 |
| Type-level separation | `LocaleCode` ≠ `LanguageCode` | P2 |
| Settings invariants | unit tests for §2.1 rules, including release-per-level semantics | P2 |
| **Locale switch preserves progress** | Switch `ru → ky → ru` on a fixture learner: XP, credit ledger, completions, mastery, saved items, streak identical before/after; no duplicated records (§2.4) | P2/P3 |
| **Locale switch discards in-flight attempt** | Start a quiz, switch locale, confirm; assert the attempt is dropped with no credit/penalty and completed results unchanged | P3 |
| Service output | analyzers/tutor/question builders return `MessageRef`, never raw prose (type-level + unit tests) | P2–P4 |
| Pseudo-locale | `xx-long` (≈+40 % length) UI run for overflow, since Kyrgyz strings are often longer | P5 |
| Formatting | dates/plurals via `Intl` in `ky` and `ru` | P3 |
| **Release-gate tests** | the gate checklist of 04 §7.3 is machine-checkable for its automated items (coverage, provenance, E2E in locale) and the manual items (native review sign-off, sampling result) are recorded as signed artefacts the gate script requires | P3 |

### 7.2 Static rule (script-agnostic)
A repository lint rule **[R]**: in `src/**` (excluding `catalogs/`, `content/`, tests), user-visible text — JSX text nodes, `aria-*`, `title`, `placeholder`, `alt`, and template/string literals passed to rendering components — must not be a literal string containing any letters. Visible text must come from `<T/>`/`useText()` (catalog), `<TargetText/>` or `<UserText/>`. Allow-list: brand names and symbols. The rule is **script-agnostic**, so it also catches Latin-script leaks (`"Reading Lab"`, `aria-label="Back"`, German strings in `Labs.tsx` **[V]**) that a Cyrillic-only rule would miss.

---

## 8. Migration notes
Mapping from today's fields to the target (full conversion plan in 04 §9, phases in 08):

| Today | Target |
|---|---|
| `UserProgress.lang` | split into `uiLocale` and `explanationLocale` (both initialised from the old value if it is `ru`/`ky`; if it is `de`, set both to `ru` and record a notice — Q1) |
| `L10n {ru,ky?,de?}` | `translations/<locale>/…` keyed by content id; the `de?` branch is dropped from instruction content (German is the target, not an explanation locale in scope) |
| `VocabularyItem.ru/ky/exampleRu` | `vocab.<id>.meaning` / `vocab.<id>.exampleTranslation` in each locale bundle; **`exampleKy` does not exist today** (schema only stores `exampleRu`) and must be authored |
| `ky.ts` spread | removed; coverage report lists exact gaps |

## 9. Open items
- Q1 (dormant `de` UI), Q2 (Kyrgyz authoring/review capacity), Q12 (brand), Q16 (quality-gate thresholds) — see [01 §9](01_PRODUCT_ARCHITECTURE.md).
- Native-speaker confirmation of the Kyrgyz alphabet statement in §7.0 and of the fixture strings used by the "valid Kyrgyz text" test.
- End date for the disclosed legacy Kyrgyz mode (§5.3) is set by gate G-ky, not by a calendar date.
- Whether ICU MessageFormat via a library (e.g. `intl-messageformat`) or a minimal in-house formatter is adopted — decide in P2 (07 §3).
