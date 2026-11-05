# 04 — Content Architecture

Part of the BilUp Til 2.0 set ([01](01_PRODUCT_ARCHITECTURE.md)). Addresses **V-01, V-02, V-06, V-18**, config-driven course structure, and the course-pack/language-registry strategy.

---

## 1. Verified current content model

| Fact [V] | Evidence |
|---|---|
| Content is TypeScript modules compiled into the bundle: `vocabulary, grammar, cases, visuals, exercises, listening, reading, speaking, writing, reallife, units, errorPatterns` | `src/data/*` |
| Target language is encoded in field names: `VocabularyItem{de, ru, ky, example, exampleRu, article?}`, `GrammarExample{de, ru}`, `ListeningExercise.lines[{speaker,text,ru}]`, `ReadingGloss{word, ru, ky,…}` | `data/types.ts:26-139` |
| Translatable text uses `L10n{ru, ky?, de?}` with Russian mandatory | `types.ts:8-12` |
| Counts at HEAD: 10 units (all A1); 226 vocabulary (22–23/unit); 20 grammar concepts (19 A1, 1 A2); 202 exercises (135 article, 45 fill, 11 choice, 11 order); 21 listening (18 A1, 3 A2); 10 reading (7 A1, 2 A2, 1 B1); 11 speaking scenarios; 10 writing tasks; 15 tests | bundled counts in both reports |
| Unit 10 has no reading text | `data/reading.ts` |
| Unit structure is fixed to 8 section ids | `stats.ts:37-48`; `data/units.ts` |
| Ids are built by string convention (`'wr01'`, `` `unit-${n}` ``, `'art-<vocabId>'`, `'topic:id'`) in several places | `UnitScreen.tsx:23`; `questions.ts:41`; `HomeScreen.tsx:39` |
| Kyrgyz gaps in content: exercise "why" 0/202, mistake notes 0/40, "when" notes 0/70, listening lines 0/86; vocabulary has no Kyrgyz example translation (schema stores `exampleRu` only); 29 vocabulary items have `ky === ru` (needs review, not necessarily wrong) | both reports |
| No schema validation of content; no coverage tooling | repo |
| Reading glosses show both ru and ky | `ReadingLab.tsx:95-104` |

---

## 2. Course pack — overview **[R]**

A **course pack** is a versioned, immutable-per-version content bundle for one `courseId`.

```
content/courses/de-general/
  course.manifest.json            ← identity, levels, structure, policies, locale release matrix
  items/                          ← target-language, locale-neutral content (language-neutral ids)
    vocabulary.json  grammar.json  exercises.json  dialogues.json  passages.json
    speaking.json  writing.json  assessments.json
  translations/
    ky/ …  ru/ …                  ← one bundle per explanation locale, keyed by content id
  extensions/de/                  ← German-specific data (articles, case forms, visuals config)
  assets/                         ← audio, images (optional, later)
```
The same shape serves `en-general`. Additional courses (`de-exam`, `de-business`) are additional folders.

Principles:
1. **Items are language-of-instruction neutral.** The *target-language* text and structural metadata live in `items/`; every explanation/translation lives in `translations/<locale>/` keyed by stable content id.
2. **One source for structure.** Only the manifest defines units, ordering and required activities.
3. **No literals in code** for levels/lesson counts/sections (03 §6).
4. **Validated at build** (§6) and **versioned** (§10).
5. **Plain data (JSON)** — non-developers can edit; loadable lazily; cacheable for offline (06/07).

### 2.1 Course pack vs. language pack **[R]** *(new — review H-5)*
A course is not complete with content alone. Two artefacts together make a target language usable:

| Artefact | Scope | Contents | Lives in |
|---|---|---|---|
| **Course pack** | one `courseId` | manifest, items, translations (this document) | `content/courses/<courseId>/` |
| **Language pack** | one `targetLanguage` (shared by all its courses) | writing-feedback analyzers and error patterns; speaking-feedback rules; **error explanations** (one entry per finding code, per explanation locale); tutor knowledge base and answer templates (per explanation locale); grammar-visual set; speech/recognition configuration; orthography flags; normalisation rules | `languages/<code>/` (code) + `content/language-packs/<code>/translations/<locale>/` (text) |

The manifest declares a `capabilities` list (`writingFeedback`, `speakingFeedback`, `errorExplanations`, `tutor`, `grammarVisuals`, …). A capability that is declared must be fully translated for every released locale (same coverage rules as course content, §7); a capability that is not declared is hidden in the UI with an honest note (never silently absent). English v1 cannot be marked complete without the capabilities its learners see in German (03 §8.1).

---

## 3. Manifest and structure (configuration-driven)

```ts
// illustrative contract — not implemented
interface CourseManifest {
  courseId: CourseId; version: string; schemaVersion: number;
  targetLanguage: LanguageCode; levelScale: LevelScaleId;      // 'cefr'
  title: ContentRef;                                            // translated per locale
  levels: LevelDef[];                                           // ordered; ids from the scale
  releasedLocales: Record<LevelId, LocaleCode[]>;               // computed/asserted by coverage gate (§7)
  lessonTemplates: Record<TemplateId, StepDef[]>;               // e.g. 'grammar-7step'
  policies: { reward: RewardPolicy; unlock: UnlockRule[]; assessmentBands: BandDef[] };
  capabilities: CapabilityId[];                                 // 'writingFeedback' | 'speakingFeedback' | 'errorExplanations' | 'tutor' | … (§2.1)
  // Simplicity rule (review O-3): start with fixed structure + these declarative fields;
  // add lesson-template / unlock-rule features only when the second course (English A1) needs them.
}
interface LevelDef {
  levelId: LevelId;                         // 'A1'…'B2' now; 'C1','C2' allowed with status:'planned'
  status: 'planned' | 'beta' | 'released';
  units: UnitDef[];
}
interface UnitDef {
  unitId: string;                           // stable, e.g. 'u03'
  title: ContentRef; subtitle: ContentRef; icon: string;
  required: ActivityRef[];                  // ANY number/kind of activities; drives progress denominators
  optional?: ActivityRef[];
  concepts: ConceptRef[];                   // grammar concepts taught
  vocabulary: ItemRef[];
}
```
Consequences:
- A unit may have 6 or 12 required activities. **Unit 10's missing reading (V-06)** is either authored or explicitly not listed as required in the manifest — visible in review, caught by validation otherwise.
- `levels` may hold `A1–B2` for both languages with different unit counts. `C1`/`C2` are legal but `planned` (empty or absent).
- Section kinds are **not** a fixed enum of 8; the `ActivityKind` registry (03 §3) is the vocabulary.
- Unlock rules (e.g. "unit n+1 requires unit n tests passed", "level B1 requires A2 assessment ≥ band") are data, evaluated by the engine.

---

## 4. Item schema

### 4.1 Core items (language-agnostic shape)
```ts
interface VocabularyItem {                 // items/vocabulary.json
  id: ItemId;                              // 'de-general/v/haus' — stable, never reused
  lemma: string;                           // target-language headword (German/English)
  pos: PartOfSpeech;
  forms?: Record<string, string>;          // language-neutral key/value; semantics defined by extension
  example: { text: string };               // target-language example sentence
  related: ItemId[];
  tags: string[]; levelId: LevelId; unitId: string;
  ext?: Record<string, unknown>;           // validated by language extension schema (§4.2)
}
// translations/<locale>/vocabulary.json:  { "de-general/v/haus": { meaning: "…", exampleTranslation: "…" } }
```
Likewise: `GrammarConcept` (structure, examples' *target text*, visual id), `Exercise` (item type, prompt *target text*, options, answer, rationale **id**), `Dialogue` (lines: speaker, target text), `Passage` (paragraphs, glosses by word id, questions), `SpeakingScenario` (turns' target text, hint texts, keywords), `WritingTask`, `AssessmentDef`.

### 4.2 Language extensions
Language-specific data validated by a per-language schema (`extensions/<lang>/schema`):
- **German (`de`)**: `article: 'der'|'die'|'das'`, `plural`, `caseForms {nom, akk, dat}`, separable verb split, verb position rules; article drill items; `GrammarVisual` ids (`cases`, `verbpos`, `separable`, `timeline`, …).
- **English (`en`) [F-content]**: irregular forms, phrasal verbs, countability, etc. — defined when the English course is authored (P7). The registry/validator accepts new extension schemas without engine change.

The core never imports an extension; the engine treats `ext` opaquely and surfaces it only through registered *language surfaces* (e.g. German `WordCard` forms panel, article quiz type).

---

## 5. Translations

- One bundle per `explanationLocale` per course: keys = content ids + field names (`<id>.<field>`), values = text or structured text (e.g. `when: string[]`).
- **Required fields** are computed from the item schemas: every translatable field of every released item must be present (e.g. for each exercise: rationale; each grammar mistake: note; each "when" entry; each listening/reading translated line; each vocabulary: meaning *and* example translation).
- **Distinct locales, no inheritance:** `ky` and `ru` bundles are peers; there is no `extends` or fallback relationship (02 §5).
- **Generic instructional templates** (quiz meta text, feedback, rubric) live in the shared *instruction catalog* (02 §4.2), not in each course.
- Reading/listening: translation shown to the learner is the one for `explanationLocale` only (fixes V-18).
- Marketplace user-generated text is outside course packs (09 §4).

---

## 6. Validation (build/CI) **[R]**

A `content-validate` tool (run in CI and locally) checks, per pack:

| Check | Catches |
|---|---|
| JSON schema validation of manifest, items, extensions, translations | malformed content |
| Unique, stable ids; id namespace matches `courseId`; no id reuse vs. previous version (id registry diff) | ID drift (string-convention ids today) |
| Reference integrity: every `ActivityRef/ItemRef/ConceptRef/ContentRef` resolves | broken links |
| Structure: each unit's `required` activities resolve and each kind has ≥ minimum items | **unit 10 reading gap (V-06)** |
| Level scale: manifest levels ⊆ registry scale; items' `levelId` valid; `released` levels have non-empty units | invalid CEFR usage |
| Policies: thresholds in [0,1]; unlock rules reference existing units | policy errors |
| Extension validation per language | German-only fields leaking into English |
| Audio/asset existence (when present) | missing media |
| No target-language text inside translation bundles and no translations inside items | schema hygiene |
| Lints: no placeholder text (`TODO`, `???`), no identical `ky`/`ru` strings for non-loanword content without an explicit `sameAsOtherLocale: true` flag (reviews today's 29 `ky===ru` cases) | silent copies |

Output: machine-readable report + human summary; CI fails on errors.

---

## 7. Coverage and release gating

- **Coverage report:** for each `(course, level, locale)` — translatable fields present / required, split by content type; lists exact missing ids.
- **Release matrix:** `releasedLocales[level]` may only contain locales at **100 %** coverage *and* review status `approved` (§8). The validator rejects a manifest that claims otherwise.
- **Gating in product:** the course selector shows a level as available for `explanationLocale` only if released for it. Otherwise: "Not yet available in Kyrgyz" (chrome in `uiLocale`) — never Russian instruction text.
- **Current baseline to close [V]:** Kyrgyz has 0 exercise rationales (0/202), 0 mistake notes (0/40), 0 "when" notes (0/70), 0 listening-line translations (0/86), no vocabulary example translations → the `de-general/A1` pack is **not releasable in `ky`** until authored. Russian coverage of the existing content is by construction near-complete but has not been verified for the new schema; it goes through the same gate.

### 7.3 Release gates per (course, level, locale) **[R]** *(new — review H-3, H-6)*
A `(course, level, locale)` triple becomes *public* only when **all** of its gate items pass. Gates are named **G-ru** (Russian explanation) and **G-ky** (Kyrgyz explanation); they have identical structure, but Kyrgyz carries the stricter staffing requirement (§13.5) and is the only locale with a pre-existing legacy path (02 §5.3). The gate script reads signed artefacts for the manual items.

| # | Gate item | Type | G-ru | G-ky |
|---|---|---|---|---|
| 1 | **Coverage 100 %** of translatable fields: UI catalog, instruction catalog, course translations, language-pack capabilities (error explanations, tutor, feedback templates) | automated | required | required |
| 2 | **Provenance and bundle-load tests** pass for the locale (02 §7.1) — includes "no `ru` bundle loaded in `ky` mode" and fault-injection | automated | required | required |
| 3 | **E2E journeys in that locale** (onboarding → lesson → quiz → review → progress → writing/speaking feedback → tutor) with zero missing-markers and zero provenance failures | automated | required | required |
| 4 | **Native linguistic review `approved`**: for launch-scope content (small corpus, §13.1) **100 % of UI + instructional text is reviewed**; for larger levels a stratified sample of ≥ 20 % of fields per content type, with **0 critical errors** (meaning-changing, wrong grammar rule, offensive/inappropriate) and ≤ 2 % minor errors — a failed sample sends the whole type back to review | manual, signed | required | required |
| 5 | **Independent second reviewer** (different person from translator and from reviewer 1) signs the sampled/complete review | manual, signed | recommended | **required** |
| 6 | **Pedagogical sign-off**: a qualified teacher confirms explanations are correct and level-appropriate (CEFR) | manual, signed | required | required |
| 7 | **In-product walkthrough** by a native reviewer on phone, tablet and desktop: no truncated, overlapping or mixed-language screens (pseudo-locale test also green) | manual + automated | required | required |
| 8 | Same-string guard: identical `ky`/`ru` strings carry an explicit `sameAsOtherLocale` flag | automated | n/a | required |
| 9 | No legacy-path call sites remain for that locale (CI counter = 0) | automated | required (for S2) | required (for S4) |

Thresholds in row 4 are proposals (decision Q16, 01 §9). Gate results are stored with the pack version, so `releasedLocales` is derived from evidence, not hand-edited.
**Public availability rules:** (a) S2/R1a: Russian becomes strict-and-public per level when G-ru passes for that level; (b) S4/R1b: Kyrgyz becomes publicly selectable per level only when G-ky passes; before that it exists only as internal/closed preview (02 §5.3); (c) a level that fails the gate stays *not yet available in that locale* — it never silently uses another locale.

---

## 8. Authoring and review workflow **[R]**

| State | Meaning |
|---|---|
| `draft` | being written (machine-translated drafts allowed as *authoring aids only*) |
| `in-review` | assigned to a native-speaker reviewer |
| `approved` | human-reviewed; eligible for release matrix |
| `released` | included in a published pack version |

- Each translation record has `{ status, reviewer, reviewedAt }` stored in sidecar metadata (not shipped to clients).
- Kyrgyz review requires native-speaker reviewers — at least a translator and an **independent** second reviewer for gate G-ky (§7.3, §13.5; resourcing is Q2 in 01 §9 **[A]**). A person never reviews their own translation.
- Content authors work with JSON/YAML plus validator feedback; an optional future CMS [F] would write the same format.
- Pedagogical review (CEFR alignment, difficulty tags for placement bands) is separate from linguistic review **[R]**.

---

## 9. Conversion plan for existing content **[R]**

A one-off, reproducible script (outside application source; reads `src/data`, writes pack files) — executed in P3:

| Existing | Becomes |
|---|---|
| `units.ts` (10 units, fixed 8 sections, `UNIT_SPEAKING`) | manifest `units` with explicit `required` lists; unit 10 reading decision (author or drop requirement) |
| `vocabulary.ts` (226) | `items/vocabulary.json` (`lemma`, `forms`, `ext.de` article/plural/case forms) + `translations/ru` (`meaning`, `exampleTranslation` from `exampleRu`) + `translations/ky` (`meaning` from `ky`; **example translations to be authored**) |
| `grammar.ts`, `cases.ts`, `visuals.ts` | concepts + `ext.de` visuals; `L10n.ru/ky` → translations; `L10n.de` (German UI text) → discarded unless Q1 reverses |
| `exercises.ts` (202) | items; `why: L10n` → `translations/<locale>/exercises`; Kyrgyz **to be authored** |
| `listening.ts`, `reading.ts`, `speaking.ts`, `writing.ts`, `reallife.ts` | passages/dialogues/scenarios/tasks with translations split per locale |
| `errorPatterns.ts` | `languages/de/analyzers` data + instruction messages by key |
| `TESTS` in `reallife.ts` | `assessments.json` with bands/thresholds |
| Russian prose in `questions.ts`/`analysis.ts`/`tutor.ts` | instruction catalog keys (02 §4) |

Conversion is **checked by a round-trip test**: rendering each existing screen from the converted `ru` pack equals today's output (golden snapshots of resolved text) before the old modules are deleted.

Mapping of id conventions: legacy ids (`'wr01'`, `'re03'`, `'art-…'`, unit `3`) are kept in a `legacyId` table used by the progress migrator (05 §11).

---

## 10. Packaging, loading and versioning

- **Format:** JSON; each file schema-versioned. Pack version = semver + content hash.
- **Loading:** `content` module exposes `CourseCatalogPort` (manifest + lazy `loadUnit(unitId)`, `loadTranslations(locale, scope)`); the app loads the manifest and **only the active explanation locale's** bundle (smaller than today's single 460 KB chunk, and lazily by unit).
- **Offline [F-P6]:** the service worker (07 §5) caches manifest + units + the learner's locale bundle; levels can be downloaded as packs.
- **Versioning rules:** ids are never reused or re-meant; content changes bump the pack version; removing an item requires a tombstone so stored progress referencing it can be migrated or archived (05 §7).
- **Distribution:** static files on CDN at first (no backend needed) — **until P8b**. *(Revision 3)* Once subscriptions exist, **paid course packs are delivered through entitlement-checked access** (signed, expiring URLs or an authenticated endpoint; 11 §13) rather than as public static files; free-tier or trial content, if any (11 U-01), may stay public. Content that has been delivered to an entitled client (or cached offline) can be copied — an accepted residual risk. A content API/CMS [F] later.

---

## 11. Tests required **[R]**

| Test | Phase |
|---|---|
| JSON-schema tests for all content types (valid + invalid fixtures) | P3 |
| Validator unit tests (each check has a failing fixture, including "unit lists a reading activity with no reading item") | P3 |
| Coverage report golden test (known gaps listed exactly) | P3 |
| Round-trip conversion snapshot tests (existing German A1 pack) | P3 |
| Id stability test (ids present in previous release still exist or have tombstones) | P3 |
| Locale leak test uses real packs (02 §7) | P3 |
| Loader tests: lazy load by unit; failure/retry; version mismatch | P3/P6 |
| Large-pack performance budget (parse time, memory) | P7 |

## 12. Open items
- Whether translations live as many small files or one per type per locale (decide by diff/review ergonomics in P3).
- Exact CEFR syllabus sources for A1–B2 for German and English (Q3, 01 §9) **[A]**.
- Whether to host content outside the app bundle from the start (affects CORS/cache policy; proposal: same origin static assets).
- Audio strategy (continue TTS vs recorded) — decide at P7; the `AudioSource` port keeps the engine neutral.

- Additional open items (revision 2): quality-gate thresholds (Q16); approval of the minimum launch scope (Q15) and of the depth factor in §13.3; whether a standardised Kyrgyz grammar-terminology glossary exists or must be created (§13.5) **[A]**; throughput pilot results (§13.6) replace every productivity figure below.

---

## 13. Content production plan, minimum launch scope and workload **[R/A]** *(new — review H-6, H-5)*

> **Status of the numbers.** The *baseline measurements* in §13.2 were taken from the repository (word counts computed from `src/data/*`; approximate, see method note). Everything in §13.3–§13.5 that is a *productivity rate, scale factor or headcount* is an **[A] planning assumption** for the decisions gate G0 and must be replaced by measurements from the pilot in §13.6. The figures are order-of-magnitude estimates, not commitments.

### 13.1 Minimum launch scope (MLS) **[R]**
The approved initial scope (A1–B2, German and English, Kyrgyz and Russian explanations) is the *architecture and roadmap target*. The **minimum launch scope** is the smallest set that delivers the product promise ("one platform; independent language settings; complete Kyrgyz or Russian") and is the first thing to approve at G0 (Q15):

| Step | Course · levels | Explanation locales | Notes |
|---|---|---|---|
| **MLS-1** | `de-general` · **A1** (existing 10 units) | **ru** first (R1a), then **ky** (R1b, only after G-ky) | Convert and review existing content; author missing Kyrgyz; resolve unit-10 reading |
| **MLS-2** | `en-general` · **A1** | ru, then ky | Includes the English language pack (writing/speaking feedback, error explanations, tutor) — an English A1 without feedback capabilities is not "complete" (03 §8.1) |
| Staged | A2, B1, B2 for both languages | per level and per locale | Each (course, level, locale) is released independently through its own gate (§7.3); **not required for launch** |
| Architecture-only | C1, C2 | — | `planned` in the level scale; no content or gate |

Product decision required: the **depth** of a level. Today's German A1 is an MVP-depth level (10 units, 226 words, 20 grammar topics, 202 exercises). Whether MLS ships at MVP depth or a deeper A1 changes the estimate (§13.3 depth factor D).

### 13.2 Baseline measurements (German A1, repository HEAD `386c6a1`) **[V, approximate]**
Method: a throw-away script (outside the repository) bundled `src/data/*` and summed whitespace-delimited words in translation-side fields (`ru`, `exampleRu`, `promptRu`, `titleRu`, `aiRu`) and target-language fields (`de`, `text`, `example`, `prompt`, `ai`, `model`, `sample`, `sentence`, `body`, `hints`, `options`, `answer`, `title`, `word`, `plural`); UI words from `src/i18n/ru.ts`. Reading passages have **no** full translations today (only glosses). Text embedded in code (`tutor.ts`, `analysis.ts`, `Labs.tsx`, `questions.ts`) was **not** measured.

| Content set | Translation-side words | Translatable fields | Target-language words |
|---|---|---|---|
| Vocabulary (226) | 1,162 | 452 | 1,433 |
| Grammar concepts (20) | 2,914 | 370 | 1,487 |
| WHY notes (12) | 290 | 47 | 250 |
| Exercises (202) | 2,273 | 393 | 1,373 |
| Listening (21) | 418 | 86 | 766 |
| Reading (10) | 54 | 36 | 759 |
| Speaking (11) | 298 | 55 | 566 |
| Writing (10) | 264 | 30 | 510 |
| Real-life (15) | 591 | 180 | 688 |
| Units (10) | 37 | 10 | 58 |
| **Total content** | **≈ 8,300** | **≈ 1,660** | **≈ 7,900** |
| UI catalog (280 keys) | ≈ 655 | 280 | — |

Define **1 A1-equivalent (A1-eq)** = one level at the current German A1 depth ≈ 7,900 target-language words to author and ≈ 8,300 content words (+ ≈ 650 UI words, once) to translate per explanation locale. Kyrgyz today covers roughly a quarter of the translatable fields (121/280 UI keys; titles/summaries/"why" for grammar; vocabulary meanings; 0 exercise rationales, 0 mistake notes, 0 "when" notes, 0 listening translations — §7), so ≈ 75 % of the content translation is still to be done for `ky`.

### 13.3 Workload model **[A]**
**Scope units.** Level weights (A2 ≈ 1.2, B1 ≈ 1.5, B2 ≈ 1.8 A1-eq — higher levels have longer texts and more grammar) give 5.5 A1-eq per language; German + English = **11 A1-eq**. German A1 (1 A1-eq at depth 1) already exists. Depth factor **D** ∈ {1 (MVP depth, as today), 2 (standard), 3 (full-course depth)}.
**Language-pack and catalog text per locale** (feedback templates, error explanations, tutor, UI/instruction catalogs): ≈ 7,000 words for both languages over A1–B2 (≈ 0.7k UI, 2.5k German pack, 4k English pack) **[A]**.
**Productivity assumptions (words per person-day) [A]:** original CEFR-aligned authoring with exercises and rationales 400–700; review of authored target text 2,500–4,000; translation of instructional text with context: Russian 1,000–1,500, Kyrgyz 800–1,200; native linguistic review of translations 3,000–5,000; in-context QA in the product adds 25 % to review effort. Excluded: product engineering, audio recording, project management.

| Scenario | New target-language authoring | Translation per locale (content + packs) | Estimated effort (person-days) | ≈ person-years (220 d) |
|---|---|---|---|---|
| **D = 1** (MVP depth) | ≈ 79 k words | ≈ 98 k words | **≈ 330 – 530** (authoring 113–198, authoring review 20–32, ru translate 65–98 + review/QA 25–41, ky translate 82–123 + review/QA 25–41) | 1.5 – 2.4 |
| **D = 2** (standard) | ≈ 166 k | ≈ 190 k | **≈ 660 – 1,070** | 3.0 – 4.9 |
| **D = 3** (full-course) | ≈ 253 k | ≈ 281 k | **≈ 990 – 1,600** | 4.5 – 7.3 |

Reading of the table: even at MVP depth, A1–B2 for both languages in both locales is on the order of **1.5–2.4 person-years of content and linguistic work**; at a standard depth it is **3–5**. This is why the Set treats full A1–B2 as a staged roadmap (§13.1) rather than a launch requirement.

**Minimum launch scope effort (D = 1):**

| Item | Work | Person-days |
|---|---|---|
| MLS-1 `ru` | review existing ≈ 11.5 k words (content + UI + German pack), conversion QA, new catalog templates, pedagogical sign-off | ≈ 6 – 9 |
| MLS-1 `ky` | translate ≈ 9 k missing words (≈ 75 % of content + 159 UI keys + pack), complete native review by two independent reviewers of the small corpus, in-context QA, pedagogical sign-off, unit-10 reading | ≈ 14 – 23 |
| MLS-2 English A1 content | author ≈ 7.9 k words, native review | ≈ 13 – 23 |
| MLS-2 translations | ≈ 10 k words per locale for content + English pack share; ru and ky incl. review and QA | ≈ 23 – 36 |
| MLS-2 English language pack (analyzers, error patterns, tutor intents, speaking rules) — linguist + engineer | see §13.4 | ≈ 25 – 40 |
| **MLS total** | | **≈ 80 – 130 person-days** (≈ 0.4 – 0.6 person-years), excluding product engineering |

### 13.4 Language-pack workload **[A]**
Per target language, for the feedback capabilities of 03 §8.1: error-pattern catalogue (target ≈ 30–60 patterns for A1–B2, ≈ 15–25 for A1), explanation per pattern per locale (≈ 40–80 words each), tutor intents (≈ 10–20 intents, templates per locale), speaking-rule tables per scenario, speech configuration. German exists in code today (≈ 12 error patterns, ≈ 18 tutor rules, unmeasured) and is converted and extended (≈ 10–20 person-days incl. engineering); English is new (**25–40 person-days for A1** with a linguist and an engineer, plus ≈ 15–30 for A2–B2 growth) **[A]**. Translations of pack text are included in the per-locale figures of §13.3.

### 13.5 Staffing and native-speaker review resources **[R/A]**
| Role | Needed for | Minimum for launch (MLS) | Scale-up (D = 2) | Notes |
|---|---|---|---|---|
| **Kyrgyz translator** (native, educator/linguist background) | G-ky | 1 | 1–2 | ≈ 17–36 days for MLS; must not review own work |
| **Kyrgyz reviewer 1** (native linguist) | G-ky | 1 | 1–2 | complete review of launch corpus |
| **Kyrgyz independent reviewer 2** (native; different person) | G-ky row 5 | 1 | 1 | sampling/second pass; **so ≥ 3 distinct Kyrgyz people** |
| **Russian translator + reviewer** (different people) | G-ru | 2 | 2–3 | third reviewer recommended |
| **German author-teacher** and **native/C2 reviewer** | `de` content, pack | 1 + 1 | 2 + 1 | CEFR-experienced |
| **English author-teacher** and **native/C2 reviewer** | `en` content, pack | 1 + 1 | 2 + 1 | accent policy decision |
| **Pedagogical sign-off teacher** per language | gate row 6 | 1 per language (may be the reviewer if not the author) | | |
| **Curriculum lead** (CEFR) | syllabus, difficulty tags, levels | 0.5 FTE | 1 FTE | |
| **Content engineer / QA** | conversion, validator fixes, in-context QA | 0.5 FTE | 0.5–1 FTE | |
| Audio (if replacing TTS) | [F] | — | — | out of MLS |

**Kyrgyz terminology risk [A]:** a standardised Kyrgyz vocabulary for German/English grammar terms (cases, tenses, articles, modal verbs) may not exist in a form learners recognise. A **terminology glossary and style guide** (approved by the Kyrgyz reviewers and pedagogical teacher) is a G0 deliverable and a prerequisite for translation; inconsistent terminology would be a quality-gate failure even if every sentence is grammatical.

### 13.6 Throughput pilot and governance **[R]**
- **Pilot (during G0/P0):** one unit of German A1 (≈ 800 words) is translated into Kyrgyz and Russian, reviewed independently, and one English A1 unit is authored; measure words/day, defect rate per reviewer pass and rework. The measured rates replace the §13.3 assumptions, and the estimate is re-issued before P3/P7 commitments.
- **Tracking:** the coverage dashboard (§7) plus a production board per (course, level, locale); status per record (§8); weekly defect-rate report.
- **Change control:** content changes after a gate re-open the affected items only (id-level diff), not the whole level.
- (Revision 3) **BilUp Live materials, polls, quizzes and tasks need `ky` and `ru` versions every week (10 §12) — recurring translation work that is NOT included in the estimates of §13**; the Live teacher's spoken-language policy is undecided (10 L-01). Paid content delivery must be entitlement-gated (11 §13), which changes the static-CDN assumption of §10 from P8b onward.
