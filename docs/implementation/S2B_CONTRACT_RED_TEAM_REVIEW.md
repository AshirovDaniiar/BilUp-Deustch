# S2b Contract Design — Red-Team Review

**Date:** 5 November 2026 · **Subject:** `docs/implementation/S2B_CONTRACT_DESIGN.md` · **Type:** review only. Nothing was implemented, no decision status was changed, the design and all other documents are untouched.
**Method:** every claim that could be checked against files was checked. Values are labelled **[M]** measured from repository content/code, **[S]** synthetic (computed on an invented entry), **[P]** provisional engineering limit, **[B]** browser measurement. **No [B] value exists anywhere in the design or in this review.** Two throw-away read-only scripts computed [M]/[S] figures; both were deleted immediately (`git status` count unchanged at 49).

**Files inspected:** `S2B_CONTRACT_DESIGN.md`, `S2B_READINESS_AUDIT.md`; `docs/architecture/STORAGE_CANONICAL_DECISION_REGISTER.md` (STO-14, 60, 61, 79–83, 85–88, 93, 96), `STORAGE_S2_RESULTS_DESIGN.md` §13.8; code: `src/storage/{activity,results,persistence}.ts`, `src/progress/{engine,types,policy,creditStatus}.ts`, `src/app/store.tsx`, `src/features/tests/{questions,QuizRunner}.ts*`, `src/features/{reading/ReadingLab,progress/stats}.ts*`, `src/screens/PracticeScreens.tsx`, `src/utils/text.ts`, `src/data/{exercises,vocabulary,reading,listening,grammar,reallife}.ts`, `tests/fixtures/legacy/*`.
**Created:** only `docs/implementation/S2B_CONTRACT_RED_TEAM_REVIEW.md`.

---

## 0. Summary and verdict

No **Critical** finding: nothing in the design can, as written, change XP, the ledger, tombstones or lose existing history (§5 proves the isolation from the real call graph). There are **5 High** and **7 Medium** findings; the design is sound in direction but contains one policy that is unsafe as worded (preserve-verbatim), absolute size numbers that conflict with the owner-approved "no absolute budgets until measured" stance, a mislabelled language field, a stable-id plan with gaps, and several incorrect or unverifiable statements.

| ID | Severity | Title | Owner approval needed |
|---|---|---|---|
| F-01 | High | "Preserve verbatim" is under-specified and, as worded, defeats every limit and type guarantee | Yes (P-1 changes) |
| F-02 | High | Absolute entry/metadata caps contradict STO-79/STO-81 acceptance criteria; cap rule undefined when the header alone exceeds it | Yes |
| F-03 | High | `lang` does not mean what the design says (Kyrgyz learners are shown Russian) | Yes |
| F-04 | High | Stable-id plan: no compatibility mapping, lock scope too narrow, content-neutral release not required, meaning-drift unsolved | Yes (STO-60) |
| F-05 | High | Coupling risks in the proposed engine refactor and capture hook | No (engineering rule) |
| F-06 | Medium | Size figures in the design are wrong for its own schema; measured/synthetic/provisional not separated | No |
| F-07 | Medium | `itemsTotal` range contradicts `validateResult`; test T-L6 ("reader never drops") is false for the existing reader | Yes (T-L6 resolution) |
| F-08 | Medium | `courseId` is redundant (always equals the record's course) | Yes |
| F-09 | Medium | `xid` duplicates `itemRef` today; `capture`/`entrySchema`/`omitted` overlap | Yes |
| F-10 | Medium | Field vocabulary attributed to STO-82 is partly not in STO-82 / §13.8 | Yes |
| F-11 | Medium | Register consistency: omitted/contradicting IDs (STO-14, 61, 81, 96), handle collisions | Yes (register hygiene) |
| F-12 | Medium | S2b-1 delivers almost no user-visible value for most of the 13 kinds | Yes |
| F-13 | Low | Test-plan gaps | No |
| F-14 | Low | Unverified statements to soften | No |

# **Verdict: ACCEPTABLE WITH CONDITIONS**

S2b-0 and S2b-1 **can safely be authorised only after** the conditions in §9 are applied to the design and the owner approves the changed items. As the design stands today it should **not** be approved unamended.

---

## 1. Unknown-field preservation (F-01 — High)

### Evidence
* `src/storage/activity.ts`: `unknownKeys = (o, known) => Object.fromEntries(Object.entries(o).filter(([k]) => !known.has(k)))` — copies **any JSON value of any size or depth**; applied to entries (`KNOWN_ENTRY`, 14 keys) and items (`KNOWN_ITEM`, 2 keys). `src/storage/results.ts` `readResults` does the same for **record-level** extras (`meta.ext`), emitted first by `serializeResults`.
* Today's only bound on foreign data is `items` ≤ 50 and ids ≤ 120 chars; there is **no** size/depth bound on unknown values. Existing S2 behaviour — not a regression, but the design's P-1 ("preserve unvalidatable S2b values verbatim") extends it to *named, typed* fields.
* Prototype safety (tested): a stored key `"__proto__"` becomes an own property after `JSON.parse`; `Object.fromEntries`/spread keep it as an own property and `JSON.stringify` re-emits it; no prototype pollution occurs. So the mechanism is **safe against prototype pollution** — but it persists such a key forever.

### What preserve-verbatim could bypass
| Guarantee | Bypass | Realistic? |
|---|---|---|
| Type validation | A junk value under `lang`/`concept`/`type` stays in the entry. Any consumer reading `entry.lang` through the declared type `'ru'|'ky'|'de'` trusts it. | Yes, as soon as a History UI or any reader exists |
| Size limits | Caps apply only to what S2b *writes* (design §4 rule 5). A hand-edited, imported (later S4) or future-build entry with a 500 KB `concept` is preserved and **rewritten whole on every attempt** (whole-record read-union-write) → quota pressure and write amplification the design claims to prevent | Low today (no import), real after S4 |
| Schema guarantees | Entries claim `entrySchema:2` while carrying invalid S2b fields; no flag distinguishes "valid S2b" from "claims S2b" | Yes |
| Integrity checks | Existing check drops *invalid known* values (`startedAt:'bad'`), keeps invalid *new* ones — two inconsistent rules in one sanitiser | Yes |
| Privacy restrictions | The "no free text" guarantee is enforced only by *our writers*. Free text placed in a preserved key (e.g. `lang:"Mein Name ist Anna"`) from any other source survives every rewrite and cannot be removed (no deletion path, STO-84/88 not built) | Low today, real with import/sync |
| Safe serialization | JSON round-trip only; no functions/cycles possible; see prototype test | OK |
| Mechanism | `KNOWN_ENTRY` would contain `lang` etc., so `unknownKeys` would **exclude** them; the design never says where an invalid preserved value lives or what canonical order places it (design §2 says "preserved verbatim" and "canonical order" without a mechanism) | Yes — design gap |

### Recommended policy (replace P-1)
"Preserve" and "trust" are separate operations:
1. **Preserve (byte-faithful, always, no data loss):** the sanitiser never drops or rewrites a stored S2b value because it fails validation. Implementation: validated S2b fields are emitted from the typed path; a value that fails validation is kept in its original key **unchanged** (carry it in the same bag as unknown keys; define the bag precedence explicitly: validated value wins, otherwise original value). Required test: byte-identical round trip.
2. **Trust (never by type cast):** declare the stored types of new fields as `unknown`, and read them only through accessors (`readLang(entry): 'ru'|'ky'|'de'|undefined`) that validate on every read. No consumer may use the declared property type directly. Lint/test: no direct `entry.lang` access outside the accessor module.
3. **Gate by schema:** S2b semantics apply only when `entrySchema === 2` (the version this build knows). For `entrySchema > 2` the whole entry is opaque pass-through — preserved, not interpreted. For `entrySchema` absent/1 the S2b fields are treated like any unknown field.
4. **Envelope, not cap:** define a *preservation envelope* (e.g. per entry ≤ 32 KiB serialised, JSON depth ≤ 8) **far above** write limits. Outside the envelope the data is still preserved (status quo, no deletion/relocation) but the sanitiser emits an `Issue` and the entry is flagged for diagnostics. Relocating oversize foreign entries to quarantine would be a stronger option but is a new behaviour needing owner approval — **not recommended for S2b-0**.
5. **Write side stays strict:** capture rejects/omits anything outside the allowlist and limits (design §4); the privacy sentinel test must also assert that **no key outside the allowlist** is produced by any writer.
6. **Residual risk, to be stated to the owner:** foreign free text in a preserved key cannot be removed until a deletion path exists; therefore the future S4 import must run the same allowlist validation before data enters the record.

**Owner approval:** required (P-1 is an owner-visible policy; the replacement above is a different policy).

---

## 2. Stable exercise IDs (F-04 — High; F-09 partly)

### 2.1 Inventory of every id consumer (verified in code)
| Consumer | Key form | Source file(s) | Affected by renumbering? |
|---|---|---|---|
| XP credit ledger | `q:<exId>`, `word:<vocabId>`, `bonus:<activityId>`, `repeat:<kind>:<day>` | `engine.ts` (`give(item.itemRef…)`), `QuizRunner.tsx` (`q:${q.id}`), `WordCard.tsx` (`word:${item.id}`) | **Yes** — a renumbered exercise re-uses another exercise's ledger key (credits it as "already earned" or a different item) |
| Completion keys / `completed[]` | `ex:<re##|li##>`, `topic:<concept>`, `speak:<id>`, `ex:<writingTaskId>`, `ex:real-<id>`, `<unit>:section`, `test:<id>`, `vocab-study:<unit>`, `daily:<date>` | `ReadingLab.tsx:81`, `ListeningLab.tsx:94`, producers, `activityId` | **Yes** for `re##`/`li##` (counter ids); others literal |
| Vocabulary mastery | `state.mastery[vocabId]` | `store.tsx:363 answerVocab`, `stats.ts`, `WordCard`, `VocabularyScreen` | **Yes** — `v<unit>-<n>` is a per-unit counter; insertion mid-unit re-attaches mastery to a different word |
| Saved words | `state.saved[]` of vocab ids | `store.tsx:365`, `merge.ts:191` | **Yes** (same ids) |
| Mistakes | `ref` = question id / `real-<id>` / `speak-<id>` / task id | `QuizRunner.finishQuestion`, `RealLife`, `SpeakingLab` | Yes for `ex###`/`vq-…` |
| Existing Results | `items[].itemRef` (`q:ex012`, `q:vq-v3-4-de`, `q:lq-li02-1`, `q:rq-re01-0`, `word:v1-1`), `activityId` | S2 record | Yes |
| Tombstones | `resultId` (random per attempt) | `engine.ts` | **No** (not content-derived) |
| URLs / deep links | hash routes `#/practice/reading/<re##>`, listening, topic, speak … | routers/screens | Yes — bookmarks and shared links |
| Legacy `v1` blobs | vocab ids + completed keys (`tests/fixtures/legacy/v1-*.json` contain `v1-1…`) | `legacy` migration | Yes — migrated data carries counter ids |
| Cross-tab merges | `saved`, `mastery`, `credit` merged by key | `merge.ts` | Yes if two tabs run different bundles (see 2.3) |
| Derived ids | `art-<vocabId>`, `vq-<vocabId>-de/ru`, `lq-<li##>-<i>`, `rq-<re##>-<i>` | `exercises.ts`, `questions.ts`, `ReadingLab.tsx:53` | follow parents; `lq-`/`rq-` also depend on the question **index** |
| Badges/achievements | computed from `UserProgress` only (`stats.ts badges`) | — | Only through mastery/completed (above) |

Facts: counters at `exercises.ts` (`let n = 0; … ++n`), `reading.ts`, `listening.ts`, `vocabulary.ts` (`counters[unit]`). `git diff HEAD -- src/data` shows only `types.ts` modified, so the working-tree ids equal HEAD's.

### 2.2 What replacing counters with literals does
If each literal equals **exactly** the value the counter produces today, every consumer above sees identical keys: ledger, mastery, saved, completions, URLs, legacy blobs, existing Results all keep working. Therefore **no data migration is necessary** and the compatibility mapping is the **identity map**: `legacyId → legacyId`. Recommended explicit mapping artefact: a committed **golden id list generated by evaluating the current modules** (all ~460 counter-derived ids: 67 `ex`, 226 vocab, 10 `re`, 21 `li`, plus derived) and a test that the literals reproduce it byte-for-byte *before* the counters are deleted.

### 2.3 Gaps in the design (freezing alone is not enough)
1. **Release must be content-neutral.** If the freeze release also inserts/reorders content, an old tab (stale shell, still running counters) and a new tab disagree on ids and cross-tab merge unions mismatched ledger/mastery keys silently. Condition: the freeze release is a pure refactor verified by the golden list.
2. **Lock scope too narrow.** The design locks counter namespaces only. Literal ids (`grammar`, `speaking`, `writing`, `real-life`, test defs) are also Core completion keys; a rename silently orphans progress. The lock must cover **every id namespace that appears in a Core key or a URL**.
3. **Index-derived ids** (`lq-<li##>-<i>`, `rq-<re##>-<i>`) break on reordering questions; a lock of "question count and order" is mentioned for `lq` only — `rq` is missing, and `ReadingLab.tsx:53` builds `rq-` ids inline.
4. **Meaning drift under a stable id is not solved.** Editing `v3-7` to a different word keeps the id; mastery and ledger stay attached to the wrong word. `cfp` (fingerprint) covers exercise content as designed, but the plan does not define a fingerprint for vocabulary items (`word:` refs) or reading/listening items.
5. **History recorded before the freeze** against an earlier numbering is not repairable; the design says so, but should also forbid presenting such entries as reliable (a reader needs a "reference unverified" state, not just a note).
6. **STO-60 default is opaque ids with `legacyId` alias resolution** (register). The design's "legacy id = permanent id" is STO-60's *alternative direction*: it amounts to "approval to carry legacy keys indefinitely" (the register's own approval line), and it pre-empts opaque P2 ids. This must be presented to the owner as that approval, not as an implementation detail.
7. **Course separation:** ids are unique only within a course (record keys are per course; there is one course, `de-general`). The design's synthetic second-course test is acceptable; it must not be described as testing an English course (none exists).
8. Is a migration necessary? **No data migration; yes a one-time content/code refactor with a golden-list guard.** A migration would only be required if the owner chooses opaque ids later (then an alias table, still no history rewrite).

**Recommended correction:** add to the design: the golden list + byte-identical test; the content-neutral-release condition; lock scope = all id namespaces used in Core keys/URLs; fingerprint definitions per content type or an explicit "not covered" statement; reader state "reference unverified" for pre-freeze entries; frame as STO-60 approval. **Owner approval:** required.

---

## 3. Size limits and quota (F-02 High; F-06, F-07 Medium)

### 3.1 Recomputation
| Design claim | Recomputed | Class |
|---|---|---|
| 10-item header entry ≈ 714 chars | 707 | [S] |
| 50-item header entry ≈ 2 420 | 2 413 | [S] |
| 10-item S2b-1 entry ≈ 1 375 | **1 165** for the *proposed* schema | [S] |
| 50-item S2b-1 entry ≈ 5 341 | **4 411** | [S] |
| "≈ +65 chars per item" | **+46 (10 items) / +40 (50 items)** | [S] |
| entry-level S2b metadata ≈ 80–110 chars | 75 (`entrySchema,capture,courseId,lang`); 175 with `itemsTotal` + all six `omitted` names | [S] |
| worst case today ≈ 5.3 k | real maxima: items ≤ **15** (largest `size` in `reallife.ts` tests = 15; daily 5), longest `itemRef` **14** chars, longest concept id **13** → real worst entry ≈ **1.6 k** | [M]+[S] |
| "prompt ≤ 52, answer ≤ 41, `why` ≤ 84, options ≤ 40; 0/202 Kyrgyz `why`" | consistent with the data read | [M] |
| Absolute schema-valid worst case (50 items, every field at its limit) | **15 279** > 8 192 | [S] |

The design's 1 375/5 341/+65 figures were computed with `skill` and `completes` in the items/entry — fields the design itself **excludes**. They overstate the real figure by ~18–20 %. None of the numbers is a browser/quota measurement ([B] = none); STO-79 and STO-86 remain unresolved, as the design says, but the design then *adopts* numbers (below).

### 3.2 Findings
* **F-02 (High).** STO-79 acceptance criterion (register): *"Measurement report attached before any number is adopted."* STO-81 (approved): *"Absolute byte budgets (unsupported until measured)"*. The design proposes 256-char metadata and 8 192-char entry caps and a record guard constant. Whatever the label ("tripwire"), an enforcing entry-size number is an absolute budget. Also: when the **header + items alone** exceed 8 192 (valid at 50 long refs), design rule 2 ("omit all optional groups, header always kept") cannot satisfy the cap — behaviour undefined. **Correction:** split limits into (a) *structural validation bounds* on S2b fields (field lengths/enums — derived from content, not budgets; acceptable: `courseId`≤64 etc.) and (b) *size budgets* (entry, metadata, record) — **do not enforce any in S2b-0/1**; keep an optional *non-enforcing diagnostic* (issue/log in tests) with the figures above as documentation. With real maxima ≈ 1.6 KB the omission fallback is unnecessary in S2b-0/1 and removes `omitted` from the contract (see F-09). **Owner approval:** required (it changes what is asked of the owner under STO-79).
* **F-06 (Medium).** Correct the figures and label each as [M]/[S]/[P]/[B] in the design (table above).
* **F-07 (Medium).** `itemsTotal` range "51…1000" contradicts `validateResult`: `engine.ts` rejects `items.length > 500`. Correct to 51…500 (and note capture can never record more than 500). Test **T-L6** ("reader never drops entries/fields for exceeding caps") is **false for the existing reader**: `sanitizeResults` applies `.slice(0, RETENTION.itemsPerResult)` (50) to every stored entry's items **on read**, silently dropping items 51+ of entries written by any build with a larger cap — a downgrade data-loss path that exists today. Either (a) amend T-L6 to say "except the S2 items cap, which is approved design §13.8" or (b) change the reader (an S2 behaviour change — **not allowed here**). Recommend (a) and record it as a known property; `itemsTotal` then makes truncation visible only for what *this* build wrote.

### 3.3 Consequences of an oversized entry (no pruning/deletion proposed)
Every history write is read → union → rewrite of the whole results record, so an oversized entry increases the cost of every later write. On quota failure: history write fails → entry stays in the in-memory pending queue (STO-96: uncapped) → persistent notice (STO-100) → retry/flush on pagehide; credit is unaffected (STO-80); if storage never recovers the entry is lost at session end (accepted R3, STO-93). Nothing is deleted to make room (STO-87). Therefore the correct mitigation is to keep *written* entries small (allowlist, short ids), not to cap or prune stored ones. Browser quota behaviour ([B]) is unmeasured; STO-14's default (prune early above a mark) conflicts with STO-87 and is **not** invoked here.

---

## 4. Data-contract completeness

| Field | Assessment | Finding |
|---|---|---|
| `entrySchema:2` | Needed as the gate (policy §1.3) | keep |
| `capture:'structure'` | Overlaps `entrySchema`; set even for kinds with no structure (8 of 13); only value is future levels | **F-09**: drop until a second level exists |
| `courseId` | `validateResult` rejects any result whose `courseId !== COURSE_ID` (`engine.ts` ~L29) and the record key is per course ⇒ always `'de-general'`, zero information; the design's own rule is "don't add fields merely because they may be useful later" | **F-08 (Medium)**: defer to S4 export/import (where records leave their container); owner decision |
| `lang` | **Ambiguous / changes meaning** — see F-03 | **F-03 (High)** |
| `itemsTotal` | Useful, but range wrong (F-07); capture-side only | keep, fix range |
| `omitted` | Needed only if size budgets are enforced (F-02); ownership unclear when a limit hits *some* items; mixes group names and item-level names | drop with F-02, or define per-item semantics |
| item `type` | Authored enum, unambiguous; but for reading/listening/vocabulary (3 of the 5 quiz-family kinds) it is always `'choice'` ⇒ low information; **can change** if content is edited (cannot be reconstructed later) | keep, note |
| item `concept` | Authored grammar id; present only on grammar exercises; ownership: content, but concept ids are literals **not covered by the lock** (F-04.2) | keep, add to lock |
| `xid` | Equals the id part of `itemRef` for every current item (`q:<id>` → `<id>`), so it is **redundant until opaque ids/aliases exist** | **F-09**: remove from the contract until STO-60 opaque ids |
| `cfp` | Needs a per-content-type definition (exercise, vocab, reading, listening); reorder-stable definition not specified for `order` exercises (word-bank shuffle) | defer with STO-83; specify |
| `completes`, `assist`, `diagnostics` | correctly excluded | — |

**F-03 (High) — `lang`.** Evidence: `tr = (t, lang) => t[lang] ?? t.ru` (`src/utils/text.ts`); the data read shows **0 of 202** authored exercises have a Kyrgyz `why`; vocabulary questions are built with Russian-only `why` and hard-coded Russian prompts (`questions.ts`: "Что значит …", "Как по-немецки …"); reading questions use the passage as `why` (`ReadingLab.tsx:53`). A learner with `lang:'ky'` therefore sees **Russian** feedback and prompts almost everywhere. A stored `lang:'ky'` would be read by a future History UI as "feedback was in Kyrgyz" — wrong. The field is the **interface-language preference at finish**, not the language of anything shown. **Correction:** either rename it `uiLang` with that exact documented meaning (and never use it to label displayed text), or **defer** `lang` to the stage that stores shown text, where a per-text `shownLang` (post-fallback) is captured. **Owner approval:** required (STO-82 names `lang`).

**13 activity kinds:** all 13 are covered by tests T-K1…K8 (quiz, review, assessment, reading, listening, real-life, lesson, vocabulary-study, daily, writing, speaking-scenario, speaking-prompt, word-practice). Content check: `review:due` builds up to 10 vocabulary questions from `dueWordIds(state)` (current content), unit review 10, tests ≤ 15, daily 5 — all ≪ 50 items. Not verified: whether any kind can exceed 15 items (validation allows 500).

**F-12 (Medium) — value.** After removing the redundant/ambiguous fields above, S2b-1 adds to 8 of 13 kinds nothing but `entrySchema`, and to the quiz family a mostly-constant `type` and sparse `concept`. The owner should be told that S2b-1's user-visible value is close to nil until S2b-2/3; the recommended reduction is S2b-0 first (contract + accessors + diagnostics) and S2b-1 only if the owner wants `concept` grouping.

---

## 5. XP and progress isolation (F-05 — High, engineering rule)

### 5.1 Call graph (verified)
```
feature component
  → useAttempt().finish(AttemptReport)                        store.tsx ~L540–572
      → build() : ActivityResult { resultId, courseId, activityId, kind, levelId, startedAt, finishedAt, activeMs,
                                   assisted, items[{itemRef,outcome}], score, evidence, completes }
      → actions.record(result)                                 store.tsx ~L354
          → recordResult(core, result, now)  — called TWICE: once for the returned preview, once inside setCore's updater
              validateResult(result)            engine.ts L24–52 (reads the named fields only; rejects the whole attempt on failure)
              tombstone duplicate check         engine.ts (core.activity.tombstones only; STO-98)
              policyFor(result.kind); passes(score); factor = result.assisted ? assistedFactor : 1
              give(itemRef…) over result.items → award() → credit ledger, xp
              completions[] from result.activityId + result.completes
              stored = { named fields copied from result } → results list (history) ; tombstone appended
```
Separate paths that do **not** pass through `recordResult`: `actions.answerVocab` (mastery, called from `QuizRunner.finishQuestion` at answer time), `actions.addMistake`, `actions.addScore`, `setDaily`, saved words, tutor. Badges are computed from `UserProgress` (`stats.ts badges`: xp, activeDates, mastery, completed topics, scores) — they read no history.

### 5.2 Why S2b capture cannot affect rewards (as long as the rules below hold)
* `recordResult` reads from `result` only: `resultId, courseId, activityId, kind, levelId, startedAt, finishedAt, activeMs, assisted, items[].itemRef/outcome, score, evidence, completes`. New optional fields on `ActivityResult` are never read by it; `stored` is built by **explicit named copying**, so an extra field on `result` cannot reach storage or credit unless someone adds a line.
* XP, ledger, tombstones, completions come from `core.credit`/`core.activity.tombstones/completions`; mastery/mistakes/saved/badges never read `activity.results`; the only readers of `core.activity.results` are `engine.ts` (the **daily-cap** branch) and storage/merge code.

### 5.3 Couplings and interface risks (corrections)
1. **Latent history→credit read:** `engine.ts` `repeat.creditAfterFirst === 'daily-cap'` branch counts `core.activity.results.filter(r => r.activityId === …)`. It is **inactive** (policy comment: daily-cap "is NOT enabled"), so no effect today, but the design's blanket claim "history never influences credit" is not literally true of the code. Add to the design as a known latent coupling; I-1 must run with history loaded in both arms.
2. **Do not add detail validation to `validateResult`.** It rejects the entire attempt on failure ⇒ lost XP. Capture validation must live in `normalizeCapture` and fail by **omission**, never rejection.
3. **No spread of detail onto `stored`.** Copy named, already-normalised fields only.
4. **`recordResult` runs twice per record** (preview + updater, and React may re-run updaters): capture normalisation must be pure and deterministic (no time/random inside), and its exceptions must be caught (→ omit), never thrown into `setCore`.
5. **Stale-closure trap:** `useAttempt` memoises on `[actions, timer]`; `levelId` is read via `levelRef` for exactly this reason. `lang` must use the same ref pattern or the stored value will be stale (T-G1 must cover a language switch before `finish`).
6. **The proposed `toStoredEntry` extraction (design §7/§10) edits credit-adjacent code** that is currently verified by 773 tests and the browser run. Prefer the minimal change: leave `recordResult` credit logic untouched and add named optional copies in the `stored` literal via a pure `pickCapture(result)`. If the owner wants the extraction, do it as a behaviour-preserving refactor in its own commit with the I-1 differential test first.
7. **Type-level isolation:** introduce `type CreditFacts = Pick<ActivityResult, 'kind'|'items'|'assisted'|'score'|'activityId'|'completes'|'finishedAt'>` and make the credit section accept only that; detail fields then cannot be referenced there (compile-time proof).
8. **Invariant tests must include the real `AppProvider` + `QuizRunner`** (I-3), not only `recordResult`, because mastery/mistakes are updated by the component, not by the engine.

**Verdict on isolation:** with 1–8 adopted, capture cannot affect XP, ledger, tombstones, mastery, completed topics, achievements or duplicate-credit behaviour. **Owner approval:** not required (engineering rules), but the owner should see rule 6.

---

## 6. Decision-register consistency (F-10, F-11 — Medium)

Statuses are quoted from the register; none is changed.

| Cited by design | Register state / content | Consistent? |
|---|---|---|
| STO-82 | architecture APPROVED 5 Nov; default fields: per-entry `courseId, completes, lang, contentRef`, item `given, expected, promptSnap, concept, errorClass`, free text; §13.8: `entrySchema` (S2b writes 2), `capture` | **Partly.** `type`, `itemsTotal`, `omitted`, `xid`, `cfp` are **not** in STO-82/§13.8 (`cfp`/`xid` ≈ `contentRef` only loosely). The design's field table attributes `type` to "STO-82" — inaccurate. `errorClass` is not addressed. |
| STO-79 | OPEN; "budgets only after measurements"; acceptance "measurement report before any number is adopted" | **Contradicted** by adopting 256/8 192 (F-02) |
| STO-81 | approved: relative isolation, "absolute byte budgets unsupported until measured" | **Contradicted** by absolute caps; not cited by the design |
| STO-86 | OPEN | consistent |
| STO-83 | OPEN | consistent |
| STO-85 | OPEN | consistent |
| STO-60 | PROPOSED: **opaque** manifest ids + `legacyId` alias; owner approval = "carry legacy keys indefinitely" | **Tension** (design freezes legacy ids as canonical): present as that approval (F-04.6) |
| STO-84 / 88 / 89 / 91 | requirement confirmed / reserved field only / deferred | consistent |
| STO-40 / 41 / 42–44 | PROPOSED / OPEN | consistent |
| STO-71, 76, 87, 90, 98, 99, 100 | owner-confirmed/approved | consistent |
| STO-23 / STO-29 (design cites for "tutor excluded") | tutor transcript in export / under reset | loosely relevant; no register decision says tutor text is excluded from attempt history — P-5 is a genuine new decision |
| **Missing** | **STO-14** (OPEN: size budgets/quota-pressure policy; its default prunes results early — conflicts with approved STO-87 and the owner rule; must not be silently applied), **STO-15** (retention/compaction, OPEN), **STO-61** (exports/snapshots written before P2 stay importable — relevant to id freeze), **STO-96** (uncapped in-memory pending queue — entry size affects memory), **STO-93** (R3 residual loss at session end), **STO-80** (cited in text but not in the sheet) | design should cite or explicitly exclude |

**Duplicate/colliding proposals:** P-3 (record guard) overlaps STO-14/STO-87; P-4 (answer representation) is the STO-83 question restated; P-5 overlaps STO-85; the design's handles **P-1…P-10** differ from the audit's **U1…U9** for the same topics (e.g. audit U8 = consent wording, design P-8; audit U2 = same-id merge, design P-6) and collide visually with phase names (P0/P1/P2 manifests). **Correction:** one handle scheme (suggest "S2b-Q1…") with a mapping table to the audit; do not reuse the letter P.

**Contradictions inside the design:** (i) §1 "limits never block credit/history" vs rule 2 undefined when the header exceeds the cap (F-02); (ii) §4 rule 5 "reader never drops" vs T-L6 reality (F-07); (iii) §7 "cannot reach" vs the proposed refactor of `recordResult` (F-05.6); (iv) §3 table marks `xid`/`cfp` "safe" yet lists them in the S2b-1 contract while §11 says S2b-1 needs no STO-83.

---

## 7. Test plan gaps (F-13 — Low)

Add: (a) prototype/`__proto__`, deep-nesting and oversize-value fixtures through load → save → load (byte-identical, no pollution, issue emitted); (b) accessor tests (invalid `lang` → `undefined`, value preserved); (c) golden-id test (literals == current counter output) *before* removing counters; (d) lock validator for every id namespace and for `rq-`/`lq-` order; (e) old-bundle/new-bundle shared-storage test: an S2 bundle (cached by the Service Worker) rewrites a record containing S2b fields without loss (entries *and* items); (f) `lang` language-switch-before-finish test; (g) `recordResult` called twice with detail ⇒ identical; (h) normalisation throws ⇒ attempt still credited; (i) I-1 with history preloaded (latent daily-cap read); (j) T-X2 documents that the existing canonical-JSON tie-break (`j(have) >= j(r)`, lexical on sorted-key JSON) does **not** guarantee that the richer entry wins — expected, unchanged. Real-browser items from the design stand ([B] quota, tabs, IME, SW/offline).

## 8. Statements to soften (F-14 — Low)
"Largest producer ≤ 15 items" — verified for tests (15) and daily (5), unit review (10), due review (≤ 10); not verified for every screen. "Prototype pollution" — verified safe for this mechanism only. "No English target to test" — accurate (course is `de-general`, `Lang` is the explanation language). The design's phrase "restart stability" is true for the current counters only because module order is deterministic; it says nothing about source edits (as the design itself notes).

---

## 9. Conditions for authorisation and final statement

**Required changes to the design before the owner is asked to approve it** (all documentation-level; no code):
1. **C-1 (F-01):** replace P-1 with the preserve / trust / gate-by-schema / envelope policy of §1; state the residual foreign-free-text risk.
2. **C-2 (F-02, F-06, F-07):** remove enforcing entry/metadata/record numbers from S2b-0/1; keep structural field bounds; restate all figures with [M]/[S]/[P]/[B] labels and the corrected values; fix `itemsTotal` to 51…500; amend T-L6.
3. **C-3 (F-03):** rename `lang` → `uiLang` with the exact meaning, or defer it.
4. **C-4 (F-08, F-09, F-12):** drop `courseId`, `capture`, `xid` (and `omitted` if C-2 applied) from the S2b-1 contract unless the owner explicitly wants them; present the reduced allowlist (`entrySchema:2`; item `type`, `concept`; `itemsTotal`) and state S2b-1's limited value.
5. **C-5 (F-04):** add the golden-id list, content-neutral freeze release, all-namespace lock, per-type fingerprint definitions, "reference unverified" reader state, and frame the freeze as STO-60's "carry legacy keys indefinitely" approval.
6. **C-6 (F-05):** adopt the eight coupling rules of §5.3 (do not extract `toStoredEntry`; no detail validation in `validateResult`; named-copy only; `CreditFacts` type).
7. **C-7 (F-10, F-11):** correct the STO-82 attribution; list `type`/`itemsTotal` (and any retained extras) as additions needing approval; cite STO-14/15/61/81/93/96 or exclude them explicitly; unify decision handles.

**Owner approval required for:** C-1, C-2 (changes the STO-79 request), C-3, C-4, C-5, and the field list. **Not required:** C-6, test additions, corrected figures.

**Final statement.** **S2b-0 and S2b-1 can be safely authorised only after C-1…C-7 are applied to the design and the owner approves the items above.** On the current text of `S2B_CONTRACT_DESIGN.md` they should **not** be authorised: the preserve-verbatim policy and the enforcing absolute caps are the two points where it would otherwise contradict owner-approved positions or weaken guarantees. S2b-2 onward remains NOT READY (STO-83/85/79/86 open), unchanged.

*Document status: new file. No source code, tests, dependencies, package files, the design document or any other existing document were modified.*
