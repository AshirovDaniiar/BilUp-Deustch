# S2b-0 / S2b-1 Contract Design and Decision Resolution

**Date:** 5 November 2026 · **Type:** design only. **No implementation authorisation is granted. No decision status is changed.** The verdict of `S2B_READINESS_AUDIT.md` (**NOT READY** for S2b as a whole) is **not** changed automatically; §11 states the scoped position.
**Method:** the current working tree and `docs/architecture/*` were re-read; numbers below are either (a) taken from the source data (`src/data/*`), (b) simple arithmetic on a **synthetic** entry, or (c) explicitly labelled PROVISIONAL placeholders. **No browser measurement was made; STO-79 and STO-86 are not resolved by this document.**

**Files inspected (this task):** `docs/implementation/S2B_READINESS_AUDIT.md`, `S2_IMPLEMENTATION_REPORT.md`; `docs/architecture/STORAGE_CANONICAL_DECISION_REGISTER.md` (STO-60, 79, 82–88, 40–44), `STORAGE_S2_RESULTS_DESIGN.md` (§13.8, §13.11); code: `src/storage/{activity,results,defaults}.ts`, `src/progress/{types,engine}.ts`, `src/app/store.tsx` (`AttemptReport`, `useAttempt`), `src/features/tests/{questions,QuizRunner}.ts*`, `src/data/{exercises,vocabulary,reading,listening,writing,speaking,reallife,grammar}.ts`, `scripts/content-validate/`. **One throw-away read-only script** computed content statistics (it was run from a temporary file that was deleted immediately; `git status` count unchanged at 49).
**Created:** only `docs/implementation/S2B_CONTRACT_DESIGN.md`.

---

## 1. Executive summary

* **Scope designed:** S2b-0 (contract, limits, validation, no capture) and S2b-1 (structural, non-text fields captured from data already in memory). Both avoid free text, audio, authored-content copies and anything that STO-83/STO-85 govern.
* **Proposed S2b-1 allowlist (Tier A — needs only STO-82 field approval + authorisation):** entry `entrySchema:2`, `capture:'structure'`, `courseId`, `lang`, `itemsTotal` (only when truncation happens), `omitted` (only when a limit forces an explicit omission); item `type` and `concept`. **Tier B (needs STO-83 and STO-60):** item `xid` (stable exercise id) and `cfp` (content fingerprint) — no text. **Not proposed:** `completes` (named in design §13.8 but has no consumer and is derivable from the Core), `assist` (STO-40/41), `given`/`expected`/prompt/feedback (S2b-2/3), any free text.
* **Limits are enforced at capture time, before persistence, and never by truncating meaningful data.** If an optional S2b field would exceed its limit, that *field group* is omitted and the omission is recorded visibly (`omitted`); the header (outcomes, score, time) is always stored, so a limit can never block credit or history (STO-80). Existing silent item truncation at 50 becomes visible via `itemsTotal` (no storage-behaviour change for entries ≤ 50 items; today the largest producer builds ≤ 15 items).
* **Stable identity finding (new, material):** the counter ids are `ex###` (67 hand-written exercises, `let n = 0` in `exercises.ts`), `re##` (10 reading texts) and `li##` (21 listening exercises) and `v<unit>-<n>` (226 vocabulary items, per-unit counter in `vocabulary.ts`); derived ids (`art-<vocabId>` ×135, `vq-<vocabId>-de/ru`, `lq-<li##>-<index>`) inherit the instability. These ids already feed Core data (ledger keys `q:<id>`, vocabulary mastery by vocab id, completion keys `ex:<re##/li##>`). Hence the identity problem is **bigger than history**; the strategy (§5) freezes today's ids in an append-only lock verified by the existing `content:validate`, and pairs a reference with a fingerprint. A reference alone is explicitly **not** treated as sufficient for "as shown then" (that is STO-83).
* **XP safety by construction:** capture is built in a pure function that cannot reach the credit path; invariance is proved by a differential test (§7, §8).
* **Verdict (§11):** overall S2b **NOT READY** (unchanged); **S2b-0 + S2b-1 READY WITH CONDITIONS** (owner approvals C1–C6 and written authorisation); S2b-2 onward not ready.

---

## 2. Exact proposed schema

Additive to the existing `StoredResult`/`StoredItem` (`src/storage/activity.ts`). Record `v` stays 1; layout 2 and `schemaVersion` 2 unchanged. Names below are **proposals**; nothing is implemented.

```ts
// ── capture contract (in-memory, produced by features; NOT stored as is) ────────────────────────────────
export type ExerciseType = 'choice' | 'fill' | 'order' | 'article'          // = Question['type'] today
export interface ItemDetail {                                                // optional, per item
  type?: ExerciseType
  concept?: string                                                           // authored grammar-concept id, e.g. 'sein-haben'
  // Tier B only (needs STO-83 + STO-60):
  xid?: string                                                               // stable exercise id (see §5)
  cfp?: string                                                               // 8 lowercase hex: fingerprint of the content as shown
}
export interface AttemptDetail {                                             // optional, per attempt
  lang?: 'ru' | 'ky' | 'de'                                                  // explanation language in effect at finish
  courseId?: string                                                          // = COURSE_ID at capture
}
// AttemptReport (store.tsx) gains:  detail?: AttemptDetail;  items?: Array<ItemOutcome & ItemDetail>
// ActivityResult (progress/types.ts) gains the same optional fields; engine NEVER reads them for credit.

// ── stored form ─────────────────────────────────────────────────────────────────────────────────────────
export interface StoredItem {                                                // existing + optional S2b-1
  itemRef: string; outcome: 'correct' | 'incorrect' | 'partial' | 'skipped'
  type?: ExerciseType; concept?: string; xid?: string; cfp?: string
  [extra: string]: unknown                                                   // unknown optional fields survive (unchanged rule)
}
export interface StoredResult {                                              // existing + optional S2b-1
  /* …existing header unchanged: resultId, activityId, kind, finishedAt, activeMs, assisted, score, passed, xp (informational), items,
        startedAt?, levelId?, evidence?, entrySchema? … */
  entrySchema?: number                                                       // S2b writes 2 (absent ⇒ 1)
  capture?: 'structure'                                                      // absent ⇒ basic; 'answers'/'full' RESERVED, never written by S2b-0/1
  courseId?: string
  lang?: 'ru' | 'ky' | 'de'
  itemsTotal?: number                                                        // only when items were truncated: the real number of items
  omitted?: OmittedGroup[]                                                   // only when a limit forced an omission
  [extra: string]: unknown
}
export type OmittedGroup = 'lang' | 'courseId' | 'items.type' | 'items.concept' | 'items.xid' | 'items.cfp'
```

**Parsing rule (important, differs from today's handling of invalid optional values).** For every S2b field, a stored value that this build cannot validate (e.g. `lang:'en'` written by a later build, `capture:'answers'`) is **preserved verbatim** and treated as *absent for display* — it is never dropped or "repaired". Today `sanitizeResults` drops invalid `startedAt/levelId/evidence`; for the new fields that would cause data loss on downgrade/older-reader rewrite, so S2b-0 must treat them like unknown fields. (Existing S2 fields keep their current behaviour: no S2 change.)

**Canonical order** (so a re-read entry serialises identically — existing rule): known header, existing optional fields, S2b fields in the order above, then unknown fields. Moving a field from "unknown" to "known" must not change bytes of an already stored entry: tested (§8, T-S4).

---

## 3. Field-by-field classification

"Stored" = persisted in history today. "Safe" = contains no personal data, free text, audio or copied authored text. "Owner" = needs owner approval before capture.

| Field | Type | Req. | Limit / range | Stored today | Safe | Owner approval | Back-compat behaviour |
|---|---|---|---|---|---|---|---|
| `resultId, activityId, kind, finishedAt, activeMs, assisted, score, passed, xp, items[].itemRef/outcome` | as today | yes | ids ≤ 120; items ≤ 50 | **yes** | yes | already approved (S2) | unchanged |
| `startedAt, levelId, evidence` | num/str/enum | opt | as S2 | **yes** (S2) | yes | approved (§13.8) | unchanged |
| `entrySchema` | int ≥ 1 | opt | `2` written | enum only | yes | **STO-82 (arch approved; field list needs S2b approval)** | absent ⇒ 1; higher kept |
| `capture` | `'structure'` (reserved `'answers'|'full'`) | opt | fixed enum | no | yes | **STO-82** | absent ⇒ basic; unknown value preserved |
| `courseId` | string | opt | ≤ 64, `^[a-z0-9][a-z0-9-]*$` | **no** (dropped by `engine.recordResult`) | yes | **STO-82** (named S2b in §13.8) | absent for legacy, never back-filled; mismatch with the record's course is **preserved, never dropped** |
| `lang` | `'ru'|'ky'|'de'` | opt | 3 values | **no** | yes (a UI preference already in the preferences record) | **STO-82** | absent for legacy; unknown value preserved |
| `itemsTotal` | int | opt | 51…1000, only when truncated | no | yes | **new (unregistered, P-9)** | absent = not truncated |
| `omitted` | enum[] | opt | ≤ 6 names, fixed vocabulary | no | yes | **new (unregistered, P-10)** | absent = nothing omitted |
| `items[].type` | enum | opt | 4 values | **no** | yes (authored enum) | **STO-82** | absent for legacy |
| `items[].concept` | string | opt | ≤ 64, authored id (`grammar.ts` literal ids) | **no** | yes (authored id, not text) | **STO-82** | absent for vocab/listening/reading items |
| `items[].xid` | string | opt | ≤ 24 | no | yes | **STO-60 + STO-83** (Tier B) | absent for legacy; legacy `itemRef` remains the key |
| `items[].cfp` | 8 hex | opt | exactly 8 | no | yes (hash of authored content; not reversible to learner data) | **STO-83** (Tier B) | absent for legacy |
| `completes[]` (entry) | string[] | — | — | no | yes | approved in principle (§13.8) but **not proposed** (no consumer, derivable) | n/a |
| `diagnostics.analyzerVersion` (exists in `ActivityResult`) | string | — | — | no | yes | **not proposed**: only meaningful once analyser feedback is stored (S2b-3+) | n/a |
| `items[].assist`, `assisted` truthfulness | enum | — | — | `assisted` is always false today | yes | **STO-40/41/42–44** | **out of S2b-0/1** |
| `given`, `expected`, `promptSnap`, `why` shown | strings | — | — | no | authored content | **STO-83** | **out of S2b-0/1** |
| writing text, speaking text/transcript, derived feedback quoting learner text | strings | — | — | no | **no (free text)** | **STO-85 OPEN** | **excluded** |
| audio, tutor text, AI output | — | — | — | audio never; tutor in its own record | no | none exists | **excluded** |

`lang` semantics: the language in effect **at attempt finish** (`state.lang` read in `useAttempt.build`, as `levelId` already is). If the learner switches language mid-attempt the stored value is the finish-time language; this limitation is documented rather than adding a second field.

---

## 4. Size limits and rationale

**Basis.** Source-data statistics (read from `src/data/*`, not browser measurements): across 202 exercises prompt ≤ 52 chars (p95 30), answer ≤ 41, Russian `why` ≤ 84, options ≤ 40; no Kyrgyz `why` exists in the authored exercises (0 of 202). Synthetic-entry arithmetic (JSON string length; **not** a browser or quota measurement): a header entry with 10 items ≈ 714 chars, with 50 items ≈ 2 420; the same entry with the S2b-1 fields (`type`, `concept` per item, plus entry fields) ≈ 1 375 (10 items) / 5 341 (50 items), i.e. ≈ +65 chars per item including `concept`.

| Limit | Proposed value | Status | Rationale |
|---|---|---|---|
| Any S2b string field | per §3 (≤ 64 for `courseId`/`concept`, ≤ 24 `xid`, 8 `cfp`) | PROPOSED | authored ids are short; hard cap prevents a content bug from bloating history |
| Items per attempt | **50** (existing, unchanged) | existing | largest producer today ≤ 15 (level test) — never reached |
| Visible truncation | `itemsTotal` set when `items.length > 50` | PROPOSED (P-9) | today the engine silently drops items 51+ (`engine.ts` `.slice(0, RETENTION.itemsPerResult)`); S2b makes it visible without changing what is kept |
| Metadata per entry (S2b-added fields, excluding header and items) | **≤ 256 chars serialised** | PROVISIONAL | `entrySchema+capture+courseId+lang+itemsTotal+omitted` ≈ 80–110 chars; 256 leaves headroom, small enough to be a tripwire |
| Total serialised attempt (one entry) | **≤ 8 192 chars** (S2b-0/1) | PROVISIONAL | worst case today ≈ 5.3 k chars at 50 items with S2b-1; 8 k is a safety bound, revisited for S2b-2/3 when strings are added |
| Total Results record | **no hard cap**; one **capture-detail guard** `DETAIL_CAPTURE_MAX_RECORD_CHARS` | **PROVISIONAL placeholder: value must come from STO-79/STO-86 measurement; NOT chosen here** | STO-87 forbids deleting to make room and STO-71 forbids dropping history; a hard cap on the record would mean refusing to record attempts, which the owner has excluded. The guard only affects *optional detail* (below) |
| Maximum metadata size | the 256-char per-entry figure above | PROVISIONAL | same |

**Enforcement before persistence (capture side, single pure function — proposed `normalizeCapture(report)` in a new `src/progress/capture.ts`, called by `useAttempt.build`):**
1. Validate each S2b field against its type/enum/limit. A field that fails validation is **not written** (never coerced, never truncated mid-value) and its group name is added to `omitted`.
2. If the serialised entry would exceed the per-entry cap, **all optional S2b groups** are omitted together (`omitted` lists them); the header and the item outcomes are always kept; `capture` is then not set (the entry is basic).
3. If the record is at or above the capture-detail guard (when approved), new entries are written in basic form with `omitted` set; **entries are still recorded**, nothing is deleted, nothing blocks credit.
4. If `items.length > 50`: items beyond 50 are not stored (unchanged) and `itemsTotal` states the real count.
5. The sanitiser (read side) **never drops** a stored entry or field because of these caps — they apply to what S2b *writes*, not to what it *reads* (data safety: foreign or future data is preserved).
6. Over-cap *learner* data cannot occur in S2b-0/1 because no learner-authored text is captured; the rule "no silent truncation of meaningful data" is therefore met by omission-with-marker, not by truncation.

**Testable behaviours:** each of rules 1–4 has a test in §8 (T-L1…T-L8). **STO-79 / STO-86:** both remain **OPEN**. This document names the unmeasured inputs required (S2-M9 per-kind record sizes, write latency at thousands of entries, real quota behaviour on target devices) and fixes no numbers that depend on them.

---

## 5. Stable identity design

### 5.1 Investigation (verified in code)
| Content | Id | Origin | Stable? | Where the id already leaks into Core data |
|---|---|---|---|---|
| Hand-written exercises (67) | `ex001…` | `let n = 0; const id = () => 'ex' + String(++n)…` (`exercises.ts`) — **module-load order** | **No**: inserting/reordering renumbers all later ids | ledger `q:<id>`, mistakes `ref`, history `itemRef` |
| Article drills (135) | `art-<vocabId>` | derived from vocab id | follows vocab id | ledger `q:art-…` |
| Vocabulary (226) | `v<unit>-<n>` | per-unit counter (`counters[unit]` in `vocabulary.ts`) | **No**: inserting a word renumbers later words of the unit | **mastery map keyed by vocab id**, `word:<id>` ledger, saved words |
| Vocab questions | `vq-<vocabId>-de/ru` | derived | follows vocab id | ledger |
| Reading (10) | `re01…` | counter in `reading.ts` | **No** | **completion keys `ex:<re##>`**, `activityId` |
| Listening (21) | `li01…` | counter in `listening.ts` | **No** | completion keys `ex:<li##>`; question ids `lq-<li##>-<index>` also depend on the question's index |
| Grammar concepts, speaking scenarios, writing tasks, real-life topics | literal ids in source (`'articles'`, `S('…')`, `W('…')`, `T('…')`) | authored literal | **Yes** (as long as nobody renames them) | completion keys |

Restart: ids are recomputed identically at every load from the same source, so a restart alone is stable; the hazard is **source edits** (insertion, reordering, deletion, content update). The Core already carries this hazard (register STO-60, SD-08); history inherits it.

### 5.2 Strategy (proposal; ties into STO-60, does not replace it)
1. **Freeze, don't renumber.** Today's id of every item becomes its permanent stable id (`legacyId == stableId` for everything that exists now). This is the only choice that keeps existing ledger keys, mastery, completion keys and already-stored `itemRef`s valid with **no data migration** (consistent with STO-60 "stored history is not rewritten").
2. **Replace counters by explicit literals** in content source (a one-time mechanical codemod, performed as part of a future content task, *not* storage code). New items get **new explicit ids that are never a counter value of an existing id**; a deleted item's id is **retired**, never reused.
3. **Append-only id lock** (new file, proposed `content-ids.lock.json`, checked by the existing `npm run content:validate`): lists every id ever shipped with its kind and state (`active|retired`) and its current fingerprint. Validation fails when an id disappears without being marked retired, when a retired id is reused, when two items share an id, or when the lock was edited non-append-only (checked against git base in CI when available). Derived ids (`art-`, `vq-`, `lq-`) are checked as a function of their parents; **`lq-<li##>-<index>` is fragile** (index-based): the lock records the question count and order per listening exercise; reordering questions is a validation failure unless the owner re-bases.
4. **Reference + fingerprint (Tier B).** The stored item may carry `xid` (the stable id) and `cfp` — a short hash of the normalised content *as shown* (prompt, options as a set, answer). The fingerprint lets a future reader say "this exercise has changed since you answered" **without** storing any text and without copying content. It does **not** let the reader show what was displayed then; that requires a snapshot or immutable versions → **STO-83 remains the owner's decision**. This is why a reference alone is not claimed sufficient.
5. **Course separation.** The history record is already per course (`bilup-deutsch:results:<courseId>`); `itemRef`/`xid` are unique **within a course**; identity across courses is `(courseId, xid)`. The app today has exactly one course (`COURSE_ID = 'de-general'`) and `Lang = 'ru'|'ky'|'de'` is the **explanation** language, so there is **no English course or English target language to test**; the design therefore specifies the rule and tests it with a **synthetic second course id** fixture, labelled synthetic. An entry whose `courseId` differs from its record's course is preserved and never merged across records.
6. **Historical entries without stable ids.** Legacy entries keep `itemRef` (e.g. `q:ex012`); a reader resolves it through the lock: an id known to the lock resolves to the same id (identity map). Entries recorded against numbering that changed in the past (development profiles; unknowable) cannot be repaired: the reader must say "the reference may no longer match" and **never rewrite history**. Legacy entries are never back-filled with `xid`/`cfp` ("nothing invented", design §13.8).
7. **Core relationship.** Credit stays keyed by the existing `itemRef`; `xid`/`cfp` are ignored by crediting code. This does not change reward behaviour.
8. **Out of scope:** manifests (P2), renaming existing ids, the English course.

**Decision dependency:** the lock and codemod are a content-pipeline change that the owner must approve (STO-60 PROPOSED; STO-83 OPEN). S2b-0/1 Tier A does not depend on it.

---

## 6. Privacy boundaries (S2b-0 and S2b-1)

| Data | Decision for S2b-0/1 | Basis |
|---|---|---|
| Writing submissions | **Excluded.** Not read, not stored, not hashed, not length-counted | STO-85 OPEN; highest personal-data risk |
| Speaking transcripts / typed utterances / ASR text | **Excluded** (includes the `word-practice` heard text) | STO-85 OPEN |
| Voice recordings | **Excluded permanently from S2b**; the app does not record audio today (no `MediaRecorder`/`getUserMedia`); keep it that way. The Web Speech API is browser-provided; disclosure wording is a separate item (P-8) | no policy; not requested |
| Tutor conversations | **Excluded**; they remain in the tutor record; never copied into attempt history | STO-23/29 |
| Personal data | no field may hold learner-entered text; free-text-bearing derived feedback (`errors[].wrong`, `corrections.wrong`, `spelling.word`) is excluded | STO-85 |
| AI feedback | none exists (rule-based mock); **excluded** until a decision exists | no decision (P-12) |
| Authored exercise content (prompts, options, answers, `why`, passages, transcripts) | **Not copied in S2b-0/1.** Only authored *ids* and an authored *enum/concept id*; fingerprint (Tier B) is a hash, not text | STO-83 OPEN; copyright/size |
| Hint usage | **Excluded**; `assisted` stays as today | STO-40/41 |
| Explanation language, course | Captured (non-sensitive; the language is already in the preferences record) | STO-82 |

**Enforcement:** (1) the allowlist is a closed list in `normalizeCapture`; any key not on it is dropped *at capture*, never persisted; (2) a privacy test scans the stored record for sentinel strings typed into writing/speaking/tutor inputs and fails if any appears (§8, T-P1…T-P4); (3) the typed-field table in §2 contains no `string` field longer than 64 characters.

---

## 7. XP and progress invariants

**Design rules (making violation impossible, not merely tested):**
1. `engine.recordResult` credit logic is unchanged and **must not reference** `entrySchema, capture, courseId, lang, itemsTotal, omitted, type, concept, xid, cfp`. Stored-entry construction moves to a pure helper (`toStoredEntry(result, xp, passed)`) with no access to the core being modified.
2. `engine` decides duplicates from **Core tombstones only** (STO-98); detail fields never take part in `mergeResultLists` ordering except through the existing deterministic canonical-JSON tie-break (unchanged; a same-`resultId` conflict occurs only on a replayed attempt, because ids are generated per attempt).
3. `creditStatus` and `entry.xp` stay informational (STO-99).
4. Mastery (`actions.answerVocab`), completions, achievements (computed, not persisted) and `addMistake` are untouched by capture.

**Proving tests (differential, deterministic):**
* **I-1 Core equality:** for generated attempts (all 13 kinds, scores 0…max, assisted true/false, repeats) run `recordResult(core, resultWithoutDetail)` and `recordResult(core, resultWithDetail)` → everything in the Core except `activity.results[].(new fields)` is `deepEqual`: `progress.xp`, `credit`, `activity.tombstones`, `activity.completions`, `activity.summaries`, `progress.completed`.
* **I-2 Replay:** same `resultId` recorded twice (with and without detail) → second is a no-op; one tombstone; XP unchanged.
* **I-3 Mastery/mistakes/achievements:** through the real `AppProvider`+`QuizRunner`, answering the same sequence with capture on/off yields identical `state.mastery`, `state.mistakes`, `state.completed`, and identical computed achievements.
* **I-4 Failure isolation:** with the results write failing (quota) the Core and XP equal the success case (STO-80), and detail presence does not change the pending count semantics.
* **I-5 Fuzz:** random unknown/invalid detail payloads on the stored entry never change credit after reload (load → save → load).
* **Mutation:** make the engine read `lang`/`capture` for bonus → I-1 fails; let detail influence the dedup → I-2 fails.

---

## 8. Test matrix

`A` = automatable (vitest, existing helpers `tests/helpers.tsx`, `tests/storage/fakes.ts`); `B` = needs real-browser verification (same CDP harness as the S2 verification, no new dependency).

| ID | Test | Kind |
|---|---|---|
| **Contract validation** | | |
| T-C1 | each S2b field accepted at its limits and rejected (omitted + marker) just beyond; enums reject unknown at *capture* | A |
| T-C2 | stored invalid/unknown S2b values are **preserved verbatim** through load/save/merge (e.g. `lang:'en'`, `capture:'answers'`) and treated as absent for display | A |
| T-C3 | `capture` never `'answers'|'full'` from S2b-0/1 writers | A |
| **Size limits** | | |
| T-L1 | 10/15/50-item entries sizes within caps; test asserts the synthetic sizes above (±) | A |
| T-L2 | 51+ items → 50 stored + `itemsTotal` = true count; ≤ 50 → no `itemsTotal` | A |
| T-L3 | per-entry metadata cap exceeded (forced) → all optional groups omitted, `omitted` lists them, header intact, entry still stored, credit unchanged | A |
| T-L4 | over-long `concept`/`courseId` → that group omitted with marker, never truncated | A |
| T-L5 | record-level guard (only once its value is approved): entries written basic with marker; nothing deleted; entry count only increases | A (value) / B (real quota) |
| T-L6 | reader never drops entries/fields for exceeding caps | A |
| **Unknown fields & old entries** | | |
| T-U1 | entries/items with unknown optional fields survive rewrite and cross-tab union (extends existing S2 tests) | A |
| T-U2 | S2 entries without new fields load/merge/rewrite byte-identically; no back-fill; `capture` absent ⇒ basic | A |
| T-S4 | making `lang/courseId/...` "known" does not change the bytes of an already-stored entry (canonical order) | A |
| T-U3 | downgrade: this S2 build reads an entry with all S2b fields and re-saves without loss (fixture of the S2b shape against the **current** sanitiser) | A |
| **Stable identity** | | |
| T-I1 | id-lock validator: removed id without `retired` ⇒ error; reused retired id ⇒ error; duplicate id ⇒ error; non-append-only lock ⇒ error | A |
| T-I2 | inserting an exercise in a fixture content set does not change any existing id (given explicit literals) | A |
| T-I3 | derived ids: `art-`/`vq-`/`lq-` follow parents; reordering listening questions flagged | A |
| T-I4 | fingerprint changes when prompt/answer/options-set change; stable under option re-ordering and whitespace normalisation | A |
| T-I5 | legacy `itemRef` resolves via the lock; unknown legacy id ⇒ "may not match", history untouched | A |
| T-I6 | two synthetic courses (`de-general`, `x-test`): records isolated; `(courseId,xid)` unique; mismatched `courseId` entry preserved, not merged | A (synthetic) |
| **13 activity kinds** | per kind, through the real component with `AppProvider`: stored entry has **exactly** the allowlisted fields and nothing else | |
| T-K1…T-K5 | `quiz`, `review`, `assessment`, `reading`, `listening` (via `QuizRunner`): `lang`, `courseId`, `capture:'structure'`, per item `type`/`concept` where the Question has them (vocab/listening/reading items have none) | A (new component harness) |
| T-K6 | `real-life`: header + `lang`/`courseId`; no items invented | A |
| T-K7 | `lesson`, `vocabulary-study`, `daily`: header + `lang`/`courseId`; no items | A |
| T-K8 | `writing`, `speaking-scenario`, `speaking-prompt`, `word-practice`: header + `lang`/`courseId` only; **sentinel text typed/recognised is absent from storage** | A |
| **Locales** | | |
| T-G1 | `lang` = `ru` / `ky` / `de` stored as selected; switching language mid-attempt stores the finish-time value | A |
| T-G2 | Kyrgyz and Russian UI render the (unchanged) notices; no new user-visible strings in S2b-0/1 ⇒ no new Kyrgyz review obligation | A |
| T-G3 | German target: course is `de-general`; *no English target exists* — no such tests (stated, not faked) | — |
| **Privacy** | | |
| T-P1…P4 | sentinel strings in writing textarea, speaking input, ASR mock, tutor chat never appear in any `bilup-deutsch:*` key except the tutor key (for tutor text); allowlist drops unknown capture keys | A |
| T-P5 | real Chrome: type Cyrillic/umlaut sentinel in the writing field, finish, dump all keys ⇒ absent | B |
| **Storage failures** | | |
| T-F1 | quota on results only/both: pending count, persistent notice, retry writes once, no duplicates, detail preserved in the pending entry | A |
| T-F2 | pagehide/visibility flush of pending detailed entries | A / B (real events) |
| T-F3 | real quota with realistically sized entries; latency with thousands of entries | **B** (feeds STO-79/86; S2-M9) |
| **Cross-tab** | | |
| T-X1 | two tabs, different attempts with detail ⇒ union, both kept, one tombstone each | A / B (two real tabs) |
| T-X2 | same `resultId` in both tabs with different detail ⇒ the **existing** canonical-JSON rule applies deterministically (documented, not changed); XP once | A |
| T-X3 | reset in one tab keeps detailed history (STO-90) | A / B |
| **XP invariance** | I-1…I-5 and mutations of §7 | A / B (I-3 in the real app) |
| **Existing S2 behaviour** | full S2 suite (773 tests), the F1/F2 regressions, migration/recovery matrix unchanged | A; the 80-check browser harness re-run | B |

**Browser-only (cannot be settled by jsdom):** real quota/latency (STO-79/86), real pagehide, two real tabs, real IME/Cyrillic/umlaut input, Web Speech API behaviour, production build + Service Worker + offline, other browsers/mobile. These remain **NOT TESTED** until executed.

---

## 9. Owner decision sheet (proposed — **no status is changed by this document**)

Existing register IDs are reused. Items without a register ID carry a **document-local handle P-n** (not a register ID); the owner/register assigns IDs, if any.

| Topic | ID | Current status | Exact question | Options | Recommendation (not a decision) | Blocks |
|---|---|---|---|---|---|---|
| **Field allowlist** | **STO-82** (arch approved 5 Nov; capture needs separate approval) | architecture approved; S2b design review pending | Approve the Tier A allowlist of §3 (entry `entrySchema, capture, courseId, lang, itemsTotal, omitted`; item `type, concept`) and the exclusion of `completes`, `assist`, `diagnostics`? | (a) as proposed; (b) add `completes`; (c) smaller (drop `concept`) | (a) | S2b-1 |
| Parsing rule for S2b fields | P-1 (unregistered) | — | Preserve unvalidatable S2b values verbatim (vs drop like `startedAt`)? | preserve / drop | preserve (avoids loss on downgrade) | S2b-0 |
| **Size limits** | **STO-79** | OPEN | Accept the PROVISIONAL per-entry/metadata caps of §4 as *tripwires* (not budgets) and defer record-level numbers to measurements? | accept; revise numbers; no caps | accept tripwires only | S2b-0 (caps), not a size guarantee |
| Behaviour at a cap | P-2 | — | Omit the optional group with an `omitted` marker (never truncate, never block)? | omit+marker / refuse the attempt (rejected by STO-80) | omit+marker | S2b-0 |
| Visible item truncation | P-9 | — | Add `itemsTotal` when >50 items? | yes / keep silent | yes | S2b-0 |
| **Storage capacity / tier** | **STO-86**, STO-79 | OPEN, unmeasured | Run S2-M9 (record size/latency per kind, quota) before S2b-2? | measure first / proceed | measure first (before S2b-2; not before S2b-0/1) | S2b-2 |
| Capture-detail guard | P-3 | — | Add a record-size guard that downgrades *new* entries to basic (never deletes)? value from STO-79/86 | yes / no | decide after measurement | S2b-2 |
| **Stable identity** | **STO-60** (PROPOSED) | PROPOSED | Freeze today's ids as permanent; replace counters by explicit literals; append-only lock verified in `content:validate`? | as §5 / wait for P2 manifests / manual care | as §5 (smallest change that stops silent re-pointing, and also protects ledger/mastery/completions) | Tier B, S2b-2/3 |
| **Content versioning** | **STO-83** | OPEN | snapshot, reference+fingerprint, or both? | register: snapshot / reference / both / freeze | reference + fingerprint now (no text); snapshot decided with S2b-2 | S2b-2/3 and Tier B |
| **Exercise answer representation** | STO-83, P-4 | OPEN | Store `given`/`expected` as text, as refs, or only for incorrect answers? Quiz answers are selections from authored options (not personal data) | text / refs / incorrect-only / none | defer to S2b-2 after STO-83 and measurement | S2b-2 |
| **Free-text exclusions** | **STO-85** | OPEN | Confirm S2b-0/1 excludes writing, speaking, transcripts, derived feedback, audio, tutor text, AI output? Free-text default/caps for later? | exclude now; opt-in later; never | exclude now (no capture, no hashing, no length) | S2b-5 only; **none for S2b-0/1** |
| Audio & tutor permanently excluded | P-5 | — | Record the permanent exclusion of audio and tutor text from attempt history? | yes / no | yes | none |
| Hints | **STO-40/41**, STO-42–44 | PROPOSED/OPEN | Confirm hint capture is out of S2b-0/1 | yes | yes | S2b-4 |
| **Future deletion requirements** | **STO-84** (requirement confirmed), **STO-88** (reserved field only), STO-89, STO-91 | as register | Must a learner deletion path exist before any free text is captured (S2b-5)? Metadata-only S2b-1 does not require it | gate S2b-5 on deletion / accept absence | gate S2b-5 on deletion (privacy) | S2b-5 |
| Same-id conflict | P-6 | — | Keep the existing canonical-JSON tie-break (no S2 change)? | keep / richer-wins | keep | none |
| Disclosure wording | P-8 | — | Web Speech API/vendor disclosure and any future free-text consent text in ru/ky/de (+ Kyrgyz native review) | later | later | S2b-5 |
| Binding, not open | STO-71, 76, 87, 90, 98, 99, 100 | owner-confirmed/approved | — | — | — | binding |

---

## 10. Implementation sequence and dependencies

(Not authorised; each step needs written authorisation.)

1. **Owner gate G-A:** approve STO-82 allowlist (Tier A), P-1, P-2, P-9, STO-79 tripwire acceptance; authorise S2b-0 in writing.
2. **S2b-0** — pure `normalizeCapture`, bounds/omission rules, optional fields in `ActivityResult/AttemptReport/StoredItem/StoredResult`, preserve-verbatim parsing for S2b fields, `toStoredEntry` split in the engine; **no feature passes any detail yet**. Files likely: `src/progress/capture.ts` (new), `src/progress/types.ts`, `src/progress/engine.ts`, `src/storage/activity.ts`, `src/app/store.tsx`. Tests: T-C*, T-L*, T-U*, T-S4, I-1…I-5. Acceptance: all 773 S2 tests unchanged and green; no stored entry differs from today's for any current feature.
3. **Owner gate G-B:** authorise S2b-1.
4. **S2b-1** — `useAttempt.build` supplies `lang`/`courseId`; `QuizRunner` supplies `type`/`concept` per item; other producers supply the entry-level fields only. Files: `src/app/store.tsx`, `src/features/tests/QuizRunner.tsx` (retain `type/concept` in `log`). Tests: T-K*, T-G*, T-P*, T-F*, T-X*. Browser: re-run the 80-check harness + T-P5, T-X1 real tabs, T-F2.
5. **Later, separately gated:** identity lock/codemod (STO-60/83) → measurements S2-M9 (STO-79/86) → S2b-2/3 → STO-40/41 → S2b-4 → STO-85 + deletion path → S2b-5.

Dependencies: S2 baseline `VERIFIED WITH LIMITATIONS` (unchanged limits); the content pipeline change (lock + literals) is independent of storage code but gates Tier B.

---

## 11. Explicit readiness verdict

* **Overall S2b (audit scope: answers, feedback, free text): NOT READY — unchanged.** STO-83 and STO-85 remain OPEN, STO-79/86 remain OPEN and unmeasured, hints depend on STO-40/41, and no S2b implementation authorisation exists.
* **S2b-0 + S2b-1 (this design): READY WITH CONDITIONS.** The design is complete and implementable without answering STO-83/85/79/86 because it captures only enums, authored ids and the explanation language. **Conditions:** (C1) owner approves the Tier A allowlist (STO-82) and excludes `completes`/`assist`/`diagnostics`; (C2) owner approves P-1 (preserve-verbatim parsing); (C3) owner accepts the PROVISIONAL caps as tripwires and records that STO-79/86 stay OPEN; (C4) owner approves P-2 and P-9 (omit-with-marker; visible truncation); (C5) written implementation authorisation for S2b-0, then separately for S2b-1; (C6) the S2 acceptance limitations are acknowledged (verification verdict is `VERIFIED WITH LIMITATIONS`).
* **S2b-2 onward: NOT READY** (STO-83, measurements, stable-identity decision).

*Document status: new file. No source code, tests, dependencies, package files or existing documents were modified.*
