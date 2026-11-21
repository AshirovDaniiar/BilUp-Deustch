# B1 architecture proposal

**Status: PROPOSAL (Stage 2). Nothing here is implemented.** Evidence comes from reading the repository at commit `92a1917` (`feat(a2): …controlled Beta for ru and ky`); file:line references were checked on that tree. Companion documents: [`B1_CURRICULUM.md`](B1_CURRICULUM.md), [`B1_IMPLEMENTATION_PLAN.md`](B1_IMPLEMENTATION_PLAN.md), [`B1_QA_CHECKLIST.md`](B1_QA_CHECKLIST.md).

> **Update (Stage 2A/2B):** Stage 1 implemented the infrastructure described in §3 (registry `planned`, generalised lazy loader, `levelOfTestId` rule, PWA/bundle regex) — see `docs/implementation/B1_STAGE1_INFRASTRUCTURE.md`. Deviation: `B1_UNIT_PLAN` is intentionally **empty** until the owner approves curriculum v2 (`B1_CURRICULUM_V2_APPROVAL.md`); where this document says "12 `PlannedUnit` entries" read "after approval". The v2 curriculum has 29 concepts (not 34) and a revised allocation; B1 speaking/writing feedback must not display the existing numeric analyser scores (blocker B-9).

## 1. Summary

B1 can be added by **repeating the A2 pattern a second time**, but the A2 pattern is not yet level-generic: the *lazy-loading mechanism, one test-id rule, the PWA/bundle tooling, the Beta notice text and the validator's A2 constants are hard-coded for A2*. Level registration, availability, locale gating, navigation, progress scoping and storage **already work for any level** (verified below) and need **no change**.

| Area | Verdict |
| --- | --- |
| Level registry (`course.ts`) | one entry; no code change |
| Unit catalog / content slot (`catalog.ts`) | **generalise A2-only lazy code** (≈ 5 spots) |
| Availability + locale gating | works as is (B1 `beta` ⇒ `ru`/`ky` only, German hidden) |
| Navigation / routing | works as is, **one hard-coded test-id rule** (`routeAccess.ts:23`) |
| Lazy loading + PWA | **regex `a\d-content` excludes `b1-content`** (3 files); tests assume one lazy chunk |
| Progress isolation | works as is (unit-id-keyed); no storage change |
| Assessment | per-unit tests work (generic); level test / placement **not built even for A2** |
| Beta notification | **text mentions "A2" literally** (ru/ky/de) — must be parametrised |
| Content validator | strict policy applies to B1 automatically, **but A2 constants/heuristics/ownership rules are A2-specific** |

## 2. Current architecture (evidence)

### 2.1 Course registry — `src/data/course.ts`
* `COURSE.levels` has A1 (`released`, ids 1–10, `['ru','ky']`) and A2 (`beta`, 11–20, `['ru','ky']`) (`course.ts:33-42`). **B1 is not registered**; `LanguageLevel` already includes `'B1'|'B2'|'C1'` (`types.ts:4`).
* `isLevelVisible` = status ≠ `planned` (`:47`). `availableLevels(lang)`: visible AND (for `de`: status `released` with ≥1 explanation locale; otherwise `releasedLocales.includes(lang)`) (`:58-61`). This is the **single source** that navigation, dashboards, labs, direct URLs and the lazy loader derive from.
* `levelOfUnitId` resolves a unit's level from `unitIdRange` (works before any unit exists) (`:67`). `resolveActiveLevel` falls back to `DEFAULT_LEVEL` (A1) when the stored preference is not available, **without rewriting the stored preference** (`:81`).

### 2.2 Catalog — `src/data/catalog.ts`
* `LevelContent` has 16 collections (units, vocabulary, grammar, whyNotes, exercises, listening, reading, speaking, writing, tests, unitSpeaking, finalTests, placement, tutorTemplates, instructions, plan) (`:51-75`).
* A1 is static; A2 is a mutable empty slot `A2_LIVE` (`:103`) filled by `registerLevelContent` (`:218`) via `loadLevelContent` (`:243`) which does `import('./a2/a2-content')` (`:249`). B1 today: `contentOf('B1')` returns the frozen `EMPTY` (`:132`) — "levels without content are empty" (tested: `tests/data/catalog.test.ts:278`).
* **A2-specific code:** type `A2Content` import (`:23`), `A2_UNIT_PLAN` (`:24`), `A2_LIVE`/`CONTENT.A2` (`:103,124`), `isLevelContentLoaded` clause `level !== 'A2'` (`:211`), `registerLevelContent` `if (level !== 'A2' …) return` (`:219`), the literal dynamic import (`:249`).
* Level-of-item rule **D-1**: an item's level is its parent unit's level, never its own `level` tag (`:273-281`). Ids are globally unique across levels (`buildIndex`, `:178-181`).
* Per-unit selectors (`vocabularyForUnit`, `speakingForUnit`, `topicTestOfUnit`…) use `levelOfUnit(unit)` and the level's `unitIdRange` — generic.

### 2.3 Routing, visibility and loading — `src/app/*`
* `levelOfRoute` maps routes to the owning level via catalog lookups (`routeAccess.ts:30-63`); `isRouteAccessible` = `level === undefined || availableLevels(lang).includes(level)` (`:69-72`) — a hidden level's URL is "not found".
* `levelsToLoad(route, lang, activeLevel)` requests the chunk of a level that is **visible for the language, unloaded, and relevant** (owner of the route, the active level, or — for deep links to content not in any loaded level — *every* unloaded visible level) (`:81-91`). `App.tsx:68-90` loads, shows `LevelLoading`/`LevelLoadFailed` (retry without reload).
* **A2-specific:** `levelOfTestId` hard-codes `level-a2` / `placement-a2` (`routeAccess.ts:23`); `unit-N` is resolved from the unit range (generic).
* `LevelTabs` renders one chip per available level; with < 2 levels none (`LevelTabs.tsx:14-27`). `BetaNotice` shows for any level whose status is `beta` (`BetaNotice.tsx:11-19`).
* Most screens call `activeLevel(state)`/`unitsOfLevel(level)`; item rendering uses `levelOfUnit(...) !== 'A1'` to decide **strict ru/ky-only localisation** (e.g. `ListeningLab.tsx:71,231`, `ReadingLab.tsx:59`, `SpeakingLab.tsx:37,60`, `GrammarScreen.tsx:65`) — so **B1 inherits strict, no-fallback localisation with no UI change**.

### 2.4 Progress and storage
* Progress keys are `${unit}:${section}` (unit id global and never reused) (`course.ts:18`, `stats.ts:102-105`); `levelProgress`, `currentUnit`, `stageCounts`, `dueWordIds`, `weakConcepts`… are level-scoped and take the level explicitly (default A1, enforced by `tests/progress/level-call-sites.test.ts`).
* A mistake's level is derived from the concept/word it names (`stats.ts:56-65`) — no stored level.
* `UserProgress.level` is validated against `LEVELS` (which already contains `B1`) (`storage/validate.ts:385`); results carry optional `levelId` (≤ 16 chars) (`storage/activity.ts:203`); `engine.validateResult` accepts any `LEVELS` member (`progress/engine.ts:34`); protected test retention matches ids `^(placement|level-)` (`validate.ts:249`) — **`level-b1` and `placement-b1` are protected already**.
* XP is global (not per level), policy table is keyed by activity kind (`progress/policy.ts`).
* `activeLevel`/`resolveActiveLevel` keep a stored B1 preference but resolve to A1 when B1 is unavailable (rollback-safe).

### 2.5 Build/PWA
* One entry bundle, one `a2-content-*.js` chunk (844 176 B raw / 211 218 B gzip, `docs/implementation/A2_BETA_RELEASE.md` §5), **not precached**; cached by the service worker on first successful use in `LAZY_CACHE`, stale entries pruned against the build's `lazy` list (`pwa/sw-core.ts:93-152`).
* Detection by regex `/^assets\/a\d-content-[^/]*\.js$/` in `scripts/pwa/vite-plugin.ts:17` and `scripts/regression/bundle-size.mjs:25`. **`b1-content-….js` does not match `a\d`.**

### 2.6 Validator — `scripts/content-validate`
* Every level except `A1` (the only `LEGACY_LEVELS` member) is **strict** (`context.ts:6,45`): independent ru+ky, source provenance, unit minimums (28 vocab, 2–3 grammar, ≥2 listening, 1–2 reading, 1 speaking, 1 writing, ≥8 exercises, 15 final-test items), reference isolation (`references.ts`), id conventions by level prefix (`identity.ts:71`, `conventions.ts`), planned-unit identity from the course registry.
* Status policy: `planned` hidden; `beta` → non-blocking review flags; `released`/`--release` → blocking errors (`context.ts:53-56`, `A2_BETA_RELEASE.md` §1). Current: **0 errors, 0 warnings, 31 review flags** (run for this audit).
* **A2-specific:** `B1_PLUS_PATTERNS` flags *every legitimate B1 item* (Passiv, `obwohl`/`damit`/`nachdem`, Relativsatz, Plusquamperfekt, Konjunktiv-II-past, Genitiv) for review (`rules/cefr.ts:23-56`, applied to every strict level at `:88`); `READING_WORDS 30–180`, `SENTENCE_WORDS_MAX 22`, `LISTENING_WORDS_MAX 140` (`:57-60`); `firstStrictLevel()` (the level that "owns level-wide items") = A2 (`context.ts:23,60`); A2 placement rule "exactly one A2 placement" (`rules/assessment.ts`); `bundle.ts:35,41` statically registers `A2_CONTENT` only; `reviews.ts` `A2_REVIEWS` and `scripts/review/*` (human-review packages, `REVIEW_UNITS` = 11–20, `docs/review/a2/…`).

## 3. Recommended B1 structure

### 3.1 Files (all new unless stated)
```
src/data/b1/
  registry.ts            B1_UNIT_PLAN: 12 PlannedUnit {id 21–32, key, level:'B1', titleDe}  (identity only; stays in entry bundle)
  types.ts               B1TestDef { …Omit<A2TestDef,'level'>, level:'B1' }; type-only imports of L10nStrict, A2TestQuestion, PlannedUnit… from '../a2/types'
  b1-content.ts          B1Content (same shape as A2Content) + B1_CONTENT — the ONLY lazy entry point (chunk b1-content-*.js)
  units.ts vocabulary.ts grammar.ts exercises.ts listening.ts reading.ts speaking.ts writing.ts
  tests.ts placement.ts tutor.ts instructions.ts provenance.ts
  unit21/ … unit32/      one folder per unit (unit.ts, vocabulary.ts, grammar.ts, texts.ts, assessment.ts) — same layout as A2 unit12–20
docs/authoring/B1_*.md   authoring guide / design notes (after Stage B0)
docs/b1/                 these planning documents
```
Layering is unchanged (`data` rank 0, `scripts/check-boundaries.mjs`): `b1/*` imports only `data` types/modules; **no runtime import from `a2/*` or A1 modules** (otherwise Rollup would hoist shared code into a third shared chunk and break "B1 chunk = B1 only"). Type-only imports from `a2/types` are acceptable and zero-risk (no A2 file changes); the boundary test must be taught this rule explicitly (it currently asserts `a2/*` imports only data types and each other, and that only the catalog imports `a2/a2-content` — `tests/data/data-boundary.test.ts:163-169`).

### 3.2 Level registry
```ts
// src/data/course.ts — the only edit to the registry
{ id: 'B1', status: 'planned', unitIdRange: [21, 32], releasedLocales: [] }   // Stage B1 (infrastructure) — invisible
{ id: 'B1', status: 'beta',    unitIdRange: [21, 32], releasedLocales: ['ru', 'ky'] }  // Stage B-release — owner approval required
```
* `releasedLocales` can never contain `de` (`ExplanationLocale = Exclude<Lang,'de'>`), and `availableLevels('de')` returns only `released` levels — **B1 is hidden from the German interface by construction**, exactly as A2 (verified for A2 by `tests/navigation/a2-beta-readiness.test.tsx`). The `planned` → `beta` switch is the *only* visibility change.
* The existing rollback path is `status: 'planned', releasedLocales: []` (`A2_BETA_RELEASE.md` §7); stored preferences and progress remain.

### 3.3 Unit catalog and content slot
Generalise `catalog.ts` additively (A2 output must stay byte-identical):
```ts
type LazyLevel = 'A2' | 'B1'
const LIVE: Record<LazyLevel, Live<LevelContent>> = { A2: emptyLive(A2_UNIT_PLAN), B1: emptyLive(B1_UNIT_PLAN) }
const LOADERS: Record<LazyLevel, () => Promise<LevelContentPayload>> = {
  A2: () => import('./a2/a2-content').then(m => m.A2_CONTENT),
  B1: () => import('./b1/b1-content').then(m => m.B1_CONTENT),     // each import() is statically analysable → its own chunk
}
```
`isLevelContentLoaded` becomes `loaded.has(level) || !(level in LOADERS)`; `registerLevelContent(level, content)` drops the `level !== 'A2'` guard and assigns into `LIVE[level]`; the cross-level indexes (`allUnits`, `allVocabulary`, the eight maps) already take items from any content object. `A2Content`/`A2_UNIT_PLAN` are renamed/aliased as *level-neutral* types (`LevelContentPayload`) — type-only change. `plannedUnitsOf('B1')` returns the plan; `PlannedUnit.level` must widen from `'A2'` to `LanguageLevel` (type change in `a2/types.ts`, listed as the single permitted A2-file edit; it has no runtime effect).

### 3.4 Availability and locales
No new mechanism. Beta ⇒ `releasedLocales: ['ru','ky']`; German hidden; direct B1 URLs in German → `NotFound`, chunk **not requested** (the `levelsToLoad` filter derives from `availableLevels`).

### 3.5 Navigation
* `LevelTabs`/Home journey/Practice screens are data-driven and show A1, A2, B1 chips for `ru`/`ky` automatically (`LevelTabs.tsx`, `HomeScreen.tsx:69-80`). No layout change is expected for three chips (`.levels` is flex-wrap, `features.css:46`).
* **Required fix:** `levelOfTestId` — replace the two literals with a rule over `level-<x>` / `placement-<x>` where `<x>` is a registered level id (e.g. `/^(level|placement)-(a1|a2|b1)$/`), keeping `unit-N` by range. Without it a direct link to `/practice/tests/level-b1` cannot trigger the chunk load (the Stage 9A finding #2 repeated).
* **Deep-link caveat:** `levelsToLoad` loads *every* unloaded visible level when a deep link names content that is in no loaded level (`routeAccess.ts:88-90`). With two lazy levels, a stale/typo URL such as `/practice/listening/xyz` would pull both chunks (≈ 1 MB+ combined). Acceptable for Beta; if bandwidth matters, add static id-prefix resolution for content ids (`a2-li-…`, `b1-li-…`) — a deliberate, documented exception to "never parse ids" that A2 already made for tests.

### 3.6 Lazy loading and PWA
* New chunk `assets/b1-content-<hash>.js` from `b1-content.ts`; **not precached**, cached on first successful use via the existing `LAZY_CACHE` (`config.lazy` is already an array, `sw-core.ts:41,93`).
* **Required fixes:** (1) `LAZY_CONTENT` regex in `scripts/pwa/vite-plugin.ts:17` → `/^assets\/[a-z]\d-content-[^/]*\.js$/`; (2) same regex in `scripts/regression/bundle-size.mjs:25`; (3) update the tests that assert exactly one lazy chunk (`tests/data/lazy-chunk.test.ts:33-54`: `lazy` has length 1) and teach `tests/pwa/lazy-cache.test.ts` to use two chunk names. If these are missed, the B1 chunk would be **precached for everyone** (a privacy/bandwidth regression: users who cannot see B1 would download it) and counted into the entry bundle.
* Estimated B1 chunk size **≈ 1.0–1.3 MB raw / 250–330 kB gzip** (extrapolated from A2's 844 kB for 10 units; B1 has 12 units and longer texts) — an *estimate*, to be replaced by measurement in the first content stage.

### 3.7 Progress isolation
No change. Unit ids 21–32 are inside no existing range; progress keys, mastery (`v21-…` vocabulary ids), saved words, completion, activity results (`levelId: 'B1'`) are distinct from A1/A2 by construction; `levelProgress('B1')` counts only B1 units. Two verified properties to keep under test (QA §C): A1 and A2 percentages are unchanged when B1 content is loaded; the stored `level: 'B1'` preference survives a rollback to `planned` and resolves to A1.
**Storage / Persistence: no change is needed, therefore none is proposed.** (Note: the working tree currently contains **staged, uncommitted modifications to `src/storage/*`, `src/app/store.tsx`, `StorageNotice.tsx`, `storage-messages.ts` and eight tests** that were not made for this task; B1 work must start from a state where they are committed or explicitly set aside — see Plan blocker B-1.)

### 3.8 Beta notifications
* `BetaNotice` is already level-generic, but the text key `betaNotice` is **A2-specific in all three dictionaries** (`ru.ts:74`, `ky.ts:39`, `de.ts:59`: "Уровень A2 находится в бета-версии…"). The component prints `<b>{level} · Beta.</b>` then `t('betaNotice')`, so B1 would read "B1 · Beta. Уровень A2 находится в бета-версии".
* **Recommendation:** make the text level-aware by adding `{level}` interpolation (the dictionaries already support `{x}` placeholders, e.g. `rec_practice`), and assert that the rendered A2 string is identical to today's. Alternative: separate key `betaNoticeB1`. The new Russian/Kyrgyz wording is an **unreviewed AI draft** and must be added to the Kyrgyz review list (the A2 notice was treated the same way). It must claim no CEFR or native-language approval and must disclose that speaking/writing feedback is rule-based.
* i18n key baseline in `tests/i18n.test.ts` (currently 289) is a ratchet and must be updated with a stated reason.

## 4. Level availability matrix (target Beta state)

| Interface language | A1 | A2 | B1 |
| --- | --- | --- | --- |
| ru | released | beta | **beta** (new) |
| ky | released | beta | **beta** (new) |
| de | released | hidden | hidden |

## 5. Learner flow: gaps that exist independent of B1
* **No prerequisite gating.** Any visible level can be selected via `LevelTabs` (`actions.setProfile({level})`); an A1 learner can open B1. The Level/Placement tests that would recommend a level are not built for A2 (A1 placement top band says "A2 →" only when `placement-a2` exists, `PracticeScreens.tsx:180`). Recommendation for the Beta: no gating, B1 label states "recommended after A2", decision D-10 for the owner.
* The Home "journey" and `LEVELS` ordering (`HomeScreen.tsx:74`) already order by `LEVELS` index — fine for three levels.

## 6. Learning-experience components (reuse, no change)
Vocabulary study, grammar detail (Discover → Understand → Practice → Apply → Speak → Test → Review, `TopicScreen.tsx`), listening, reading, speaking, writing, review and the quiz runner are level-scoped through the catalog selectors and strict-localisation branches (`!== 'A1'`). B1 content types are the A2 types. **Type extensions needed** (additive): `GrammarVisual` has no `passive`/`relative` value (`types.ts:68`) — use `'none'` or add values (affects only the grammar visual switch, to be inspected in Stage B3); `GrammarCategory` already contains `passive`, `konjunktiv`, `relative`.

## 7. Release gates (Beta vs release)
Same as A2 (`A2_BETA_RELEASE.md` §1): at `beta` the missing human CEFR sign-offs (12), ru/ky reviews (24) and level test (1) are **non-blocking review flags**; `npm run content:validate:release` must stay red until real humans sign off. The B1 review expectation scales to 12 units × (CEFR + ru + ky) = 36 records.

## 8. Assessment support
| Piece | State | B1 action |
| --- | --- | --- |
| Unit topic tests (`unit-21…32`) | generic: `topicTestOfUnit`, `finalTestOfUnit`, `finalTestQuestions` (authored order, per-attempt option shuffle), strict ru/ky | author finals (15 each) — no code |
| Test-id → level (direct links) | A2 literals | generalise (§3.5) |
| `Question.promptKy`, strict hint/explanation | done (A2 Stage 9B/9C) | none |
| Level test `level-b1` | **A2's does not exist yet** (`beta-level-test-missing` flag) | design once for both levels (`A2_ASSESSMENT_DESIGN.md`); B1 follows A2 or both are built together; a *blueprint builder* is a code task (pure functions + tests) |
| Placement test | A1 placement exists; A2 placement empty; no B1 | **out of scope for the first B1 Beta**; A1 placement text must keep not claiming B1 |
| Result storage | optional `kind/parts/outcome/blueprint`, protected retention by `level-*` ids | none |
| XP | level/placement tests award no XP (decision) | keep; `assessment` kind must not be used for them |
| Listening in tests | unverified on real devices (TTS) | no listening items in finals until verified |

## 9. Content validator (needed for B1 to be usable)
1. **Per-level profile** (`LEVEL_PROFILE: Record<LanguageLevel, {readingWords, sentenceMax, listeningMax, ceilingPatterns}>`): A2 values = today's constants (A2 output unchanged, asserted by test); B1 = proposed 120–260 / 28 / 220 words and a *B2+* pattern table (Futur II, Konjunktiv I, long Partizipialattribute, `es sei denn`…). Without this, every B1 item shows false "B1+ construction" review flags and the flag stream becomes noise.
2. `firstStrictLevel()` and the "exactly one A2 placement" rule must become per-level (`level-owning` items such as placement items and shared templates).
3. `bundle.ts` registers the B1 content statically (as it does for A2) so the validator sees all levels.
4. `UNIT_MINIMUMS` stay shared (the contract is stated for every strict level); allow per-level overrides only if the owner changes the standard.
5. `A2_REVIEWS`/`scripts/review/*`: add B1 review record store and packages (units 21–32), reusing the Stage 8A generators; **no code ever records an approval**.
6. Messages that name "A2" (`long for A2 — review`) become level-parameterised.

## 10. Risks specific to this architecture
| Risk | Mitigation |
| --- | --- |
| Generalising catalog/route/tooling changes A2 behaviour | A2 isolation baseline: content-hash + selector-snapshot test for A2 (as `tests/regression/a1-*` does for A1), run before and after Stage B1 |
| B1 chunk precached or counted in entry | regex fix + `lazy-chunk` test for **two** chunks |
| Deep-link to unknown id loads both lazy chunks | accepted in Beta; optional id-prefix rule |
| Strict-localisation tests/validators assume "non-A1 ⇒ A2" wording | inventory in QA §B |
| The tutor is A1-only (`services/tutor.ts` uses `GRAMMAR`/`WHY_NOTES` of A1; `tutorTemplates` empty for A2) | B1 has **no tutor** in Beta; disclose |

## 11. Explicit non-goals
No change to `src/storage/*`, persistence, merge, recovery; no change to A1/A2 content or Beta visibility; no new dependencies; no German-interface B1; no placement test; no tutor templates.
