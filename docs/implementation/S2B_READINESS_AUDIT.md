# S2b Readiness Audit and Implementation Plan — Complete Learning Attempt Capture

**Date:** 5 November 2026 · **Type:** audit and plan only. **No implementation authorisation is granted by this document.** No source, test, dependency, package file or existing document was changed to produce it.
**Evidence base:** the current working tree (HEAD `386c6a1` + uncommitted S1/S2 work) and the architecture documents in `docs/architecture/`. Claims about code cite `file:line` areas that were read. Where the register gives no answer the item is left **OPEN**; nothing OPEN is treated as approved.

**Files inspected.** Documents: `STORAGE_CANONICAL_DECISION_REGISTER.md`, `STORAGE_IMPLEMENTATION_GATE.md`, `STORAGE_S2_RESULTS_DESIGN.md`, `STORAGE_S2_MIGRATION_PLAN.md`, `STORAGE_S2_TEST_STRATEGY.md`, `STORAGE_S2_OWNER_APPROVAL_SHEET.md`, `STORAGE_S2_FINAL_ARCHITECTURE_APPROVAL_REVIEW.md`, `STORAGE_S2_FINAL_PRE_APPROVAL_AUDIT.md` (all under `docs/architecture/` — they do **not** exist at the repository root), `docs/implementation/S2_IMPLEMENTATION_REPORT.md`, `docs/implementation/S2_REAL_BROWSER_VERIFICATION_REPORT.md`. Code: `src/progress/{types,engine,policy,creditStatus}.ts`, `src/storage/{activity,results,persistence}.ts`, `src/app/store.tsx`, `src/features/tests/{QuizRunner,QuizPage,questions}.ts*`, `src/features/{writing/WritingLab,speaking/SpeakingLab,speaking/SpeakInput,reallife/RealLife,reading/ReadingLab,listening/ListeningLab,vocabulary/WordCard}.tsx`, `src/screens/{TopicScreen,UnitScreen,PracticeScreens}.tsx`, `src/services/{analysis,tutor,speech}.ts`, `src/data/{types,exercises}.ts`, the `tests/` tree.

---

## 1. Executive summary

* S2 stores the attempt **header** only. Each history entry holds `resultId, activityId, kind, finishedAt, activeMs, assisted, score, passed, xp (informational), items[{itemRef, outcome}]` plus optional `startedAt, levelId, evidence, entrySchema`. This is by design (design §13.8, free-text guard §13.11) — it is not a defect.
* **S2b capture does not exist in any feature.** No learning screen passes the learner's answer, the expected answer, the prompt, the feedback shown, the explanation language, the writing text, or the speaking text to the engine. `AttemptReport` (`src/app/store.tsx`) cannot even carry them: it has `activityId, kind, items[{itemRef,outcome}], score, completes, assisted, evidence`.
* The **storage layer is ready to receive** more fields: unknown optional fields of entries and items already survive sanitisation and every rewrite (`unknownKeys` in `src/storage/activity.ts`, tested in `tests/storage/s2-results.test.ts`).
* But the sanitiser has **no size bound on unknown fields** (only `items` ≤ 50 and ids ≤ 120 chars). Before any free text or content snapshot is captured a bounds policy must exist (this contradicts nothing approved, but the test strategy lists "length caps enforced by the sanitizer" as a requirement that is not yet implemented).
* Important classification result: in quizzes (the largest producer by volume) the learner's answer is a **selection from authored options or word chips**, not typed text (`QuizRunner`: `choose(opt)`, `checkOrder()`). Quiz `given`/`expected`/`prompt`/`why` are **authored course content, not personal data** — their issue is content versioning/copyright (STO-83), not personal-data privacy (STO-85). The **only learner-authored free text** in learning activities is the **writing text** (`WritingEditor` textarea) and the **speaking utterance** (typed into `SpeakInput` or recognised by the browser's Web Speech API). The tutor chat is a separate, already-stored record.
* **Blocking facts:** STO-83 and STO-85 are OPEN and were deferred to S2b *on condition that S2 captures no free text*; they must now be answered. The S2b design review and approval that STO-82 requires has not happened. STO-79/86 (budgets, storage tier) are OPEN and unmeasured (S2-M9 not run). Hint tracking depends on STO-40/41 (PROPOSED, behaviour change).
* **Verdict: NOT READY** for S2b as defined (answers, feedback, free text). A small structural stage (S2b-0/1, no free text, no content copy) can become READY WITH CONDITIONS once the owner approves its field list and authorises it (§12).

---

## 2. Current S2 baseline (verified)

| Area | State | Evidence |
|---|---|---|
| Record | `bilup-deutsch:results:de-general`, `{record:"results", v:1, epoch (informational), updatedAt, results[], deletions?, …unknown}` | `src/storage/results.ts` |
| Entry | fields above; `entrySchema` absent ⇒ 1; unknown fields kept | `StoredResult`, `sanitizeResults` |
| Items | `{itemRef, outcome, …unknown}`; cap `RETENTION.itemsPerResult = 50`; ids ≤ 120 chars | `activity.ts:21`, `KNOWN_ITEM` |
| Writer | `engine.recordResult` builds the stored entry (copies only the header fields; `courseId`, `completes`, `diagnostics` are **not** stored) | `src/progress/engine.ts` ~L143–153 |
| Write path | history first (read → union by `resultId` → write), then the Core; history failure never blocks credit (STO-80); in-memory pending queue with persistent notice | `persistence.ts`, `store.tsx` |
| Authority | Core tombstones + ledger alone decide XP; `creditStatus` derives credited / not-credited / no label beyond 400 days; `entry.xp` is never read by crediting code | `src/progress/creditStatus.ts`, `engine.ts` |
| No deletion | no folding/pruning of results; only tombstone expiry (400 d) unchanged | S2 report §2, design §13.12 |
| Snapshots | exclude history (`omitted:['history']`) | STO-76 |
| Verification | 773 tests / 31 files; real Chrome 156: 80/80 PASS after F1/F2 fixes; verdict `VERIFIED WITH LIMITATIONS` (limits: no process-kill test, no production-build/SW/offline, no other browsers, no headed review, Kyrgyz unreviewed) | verification report |
| Still OPEN in S2 | STO-79 (budgets, retention), STO-86 (tier), STO-83, STO-85; STO-89/91 deferred to the deletion stage | register |

**Existing relevant facts that constrain S2b**
1. **Write amplification:** every history write is read → union → rewrite of the *whole* record, so entry size multiplies on every attempt (register/pre-approval audit row 7). Detailed entries make this materially worse. Not measured (S2-M9 not run).
2. **Content ids are unstable:** `src/data/exercises.ts` generates ids with a module-level counter (`let n = 0; const id = () => 'ex' + String(++n)…`). Inserting or reordering an exercise renumbers all later ids. The ledger keys (`q:<id>`) already depend on this (STO-60/SD-08). History that stores only a reference would silently re-point.
3. **No stored-history deletion path exists** (STO-84/88/89 are not implemented). If S2b stores personal free text, the learner has no way to remove it short of clearing browser data. This is a privacy-relevant dependency (see §6).
4. **Tombstone-only duplicate authority** (STO-98): richer entries must not become a second duplicate/credit authority.

---

## 3. Existing attempt-capture audit (the 12 categories)

Legend — **Stored?** = in the persisted history entry today. **Free text?** = user-generated free text.

| # | Category | Source (actual) | Data flow today | Stored? | Gap | Interface change needed | Free text? |
|---|---|---|---|---|---|---|---|
| 1 | Exercise answers (the learner's `given`) | `QuizRunner.choose/checkOrder/finishQuestion` (`src/features/tests/QuizRunner.tsx`) | `given` is passed to `finishQuestion`, kept in component state `picked` and then discarded; `log.current` keeps `{q, ok, section}` only | **No** | `given` is available at the call site but not retained in `log`/not in `AttemptReport` | Yes: `AttemptReport.items[]` (`ItemOutcome`) gains optional detail; `QuizRunner.log` keeps `given` | **No** — option text or word-chip order from authored content |
| 2 | Correct / incorrect | same | `ok` → `ItemOutcome.outcome` `correct`/`incorrect` | **Yes** | none for quizzes; `partial`/`skipped` exist in the type but no producer emits them | none | No |
| 3 | Expected answers | `Question.answer` (`questions.ts`) | shown in feedback when wrong (`QuizRunner` feedback block) | **No** | not retained | same as #1 | No (authored content) |
| 4 | Prompts / question context | `Question.prompt`, `promptRu`, `options`, `words`, `audio` | rendered; not retained | **No** | only `itemRef` `q:<id>` stored — unstable id (§2) | needs snapshot decision (STO-83) | No (authored; copyright/versioning) |
| 5 | Feedback shown | quiz: `Question.why` via `tr(q.why, lang)`; writing: `analyseWriting()` → `WritingFeedback` (scores, checks, errors `{wrong,right,why}`, spelling, missing, formalityNote); speaking: `analyseSpeaking()` → `SpeakingScore` (scores, `corrections`, `tip`) | local deterministic analysers (`src/services/analysis.ts` — *"heuristic analysers"*, no network); held in component state only | **No** | scores partially summarised elsewhere (`actions.addScore`) but not per attempt | new optional entry/item fields | Writing/speaking feedback **quotes the learner's text** (`wrong`, `spelling.word`, `corrections.wrong`) — **derived free text** |
| 6 | Activity type / exercise type | `ActivityKind` (13 kinds); `Question.type` (`choice|fill|order|article`), `Question.skill/kind/concept` | `kind` stored; exercise `type` not | `kind` yes; exercise type/skill/concept **no** | small enums | optional item fields | No |
| 7 | Target language | constant: course `de-general` (`COURSE_ID`); text `lang="de"`, TTS/ASR `de-DE` | record key + `courseId` on `ActivityResult` | record-level (key) only; **`courseId` is dropped by `engine.recordResult`** | none needed (single course) | none, or per-entry `courseId` if multi-course is planned | No |
| 8 | Explanation language | `state.lang` (`Lang = 'ru'|'ky'|'de'`), used by `tr(…, lang)` | not captured | **No** | `lang` needed to interpret stored feedback "as shown then" | `AttemptReport`/`useAttempt.build` can read `state.lang` (it already reads `state.level`) — additive | No |
| 9 | Course / level | `levelRef = state.level` in `useAttempt.build` → `levelId` | stored since S2 | **Yes** (new entries); `courseId`, `completes` not | per-entry `courseId`/`completes` only if approved (design §13.8 "not stored in S2") | additive | No |
| 10 | Writing submissions | `WritingEditor` (`src/features/writing/WritingLab.tsx`) `text` state; `analyseWriting(text, task)` | text is analysed locally and shown; `attempt.finish` gets **no items, no score** (only `activityId, kind:'writing', completes, evidence:'heuristic'`) | **No** (not even a score on the attempt) | writing attempts currently carry no item outcomes | new capture + privacy decision | **YES — user free text, may contain personal data** |
| 11 | Speaking attempts & hint usage | `SpeakingSession` (`SpeakingLab.tsx`), `TopicScreen.onSpeak`, `DailyScreen.onSpeak`, `SpeakInput` | utterance arrives as `text` (typed or Web Speech recognition `rec.lang='de-DE'`) → `analyseSpeaking`; `Msg[]` in component state only; **hints: a hint button calls `onAnswer(h, null)` — tapping a hint SUBMITS it as the answer** (`SpeakingLab.tsx` ~L139); `assisted` is never set to `true` anywhere (`grep assisted src` → only `store.tsx` defaults) | **No** text, **no** hint usage; `assisted` always false | hint use cannot be captured truthfully without STO-40/41 (PROPOSED behaviour change). Topic/daily hints are a `<details>` reveal with no tracking | STO-40 (hint pre-fills, not submits), STO-41 (`assist` per item) | **YES** — typed text or ASR transcript |
| 12 | Listening / reading results | `ListeningLab`, `ReadingLab` → `QuizRunner` with `kind:'listening'/'reading'`, ids `lq-<ex.id>-<i>` / `ex###` | same as #1–#4 | outcomes only | same as quizzes; passage/transcript is authored content, long | same as quizzes; **passage text must not be copied** (copyright/size) | No |

Additional observations
* **Voice recordings:** the app never records or stores audio (`grep MediaRecorder|getUserMedia` → none). Speech recognition uses the browser's `SpeechRecognition`/`webkitSpeechRecognition`; the browser/vendor may process audio remotely — this is outside storage but must be disclosed (STO-85 wording). Only the recognised/typed **text** exists in the app.
* **Mistake linkage:** `actions.addMistake({kind, ref, concept})` writes `state.mistakes` (≤ 300, in the Core `progress`), keyed by question id / concept, with no `resultId` link. Linking a mistake to the attempt is an S2b design item (register mentions "mistake linkage"); today `mistakes` is capped and truncated, so it is **not** history.
* **AI-generated feedback:** none exists. `src/services/tutor.ts` is a rule-based mock behind an interface "so a real LLM backend can replace" it; `analysis.ts` is heuristic. If a real backend is added later, AI output becomes a new data class needing its own decision (§6).
* **Tutor conversations** are stored in the separate tutor record (S1), not in attempts. Out of S2b; do not duplicate them into history.

---

## 4. Activity coverage matrix

All 13 `ActivityKind`s were traced to producers. "Existing result data" = what `attempt.finish` passes and the entry stores today (header + `itemRef/outcome`). Priorities: **P1** structural/no-privacy value, **P2** content capture after STO-83, **P3** free text after STO-85, **—** none.

| Kind | Source (component → call) | Existing result data | Missing | Proposed additional fields (all optional, additive) | Privacy class | Required changes | Test coverage today | S2b priority |
|---|---|---|---|---|---|---|---|---|
| `quiz` | `QuizRunner` via `QuizPage` (`PracticeScreens`), `TopicScreen` practice/test (`topic:<id>:practice`/`:test`), `DailyScreen` quiz (`daily:<date>:quiz`), `review:due` | items `q:<id>` + outcome; score; `completes` not stored | `given`, `expected`, prompt/options snapshot, `why` shown, `lang`, exercise type/skill/concept | item: `given`, `expected`, `type`, `concept`, `ref`+snapshot; entry: `lang`, `entrySchema:2` | authored content (STO-83); not personal | `QuizRunner.log` retains `given`; `ItemOutcome` optional detail; `useAttempt.build` adds `lang` | engine + storage tests only; **no component test of capture** (`tests/progress/thresholds.test.tsx` and `app-wiring` touch `useAttempt` indirectly) | P1 (`lang`, `type`) / P2 (given, expected, prompt) |
| `review` | `QuizPage` in `PracticeScreens` (`<unit>:review`) | as quiz | as quiz | as quiz | as quiz | as quiz | none specific | P2 |
| `assessment` | `PracticeScreens` (`test:<def.id>`) via `QuizPage` | as quiz | as quiz | as quiz | as quiz | as quiz | none specific | P2 |
| `reading` | `ReadingLab` → `QuizRunner` (`ex:<text.id>`) | as quiz | as quiz; passage not stored (and must not be) | as quiz + passage **reference only** | authored content; passage is long/copyright-sensitive — **do not snapshot** | as quiz | none specific | P2 |
| `listening` | `ListeningLab` → `QuizRunner` (`ex:<ex.id>`) | as quiz | as quiz; transcript not stored (must not be) | as quiz + audio/transcript reference only | authored content | as quiz | none specific | P2 |
| `vocabulary-study` | `VocabStudy` in `UnitScreen` (`vocab-study:<unit>`) | no items, no score; `completes` not stored | words seen (could be `word:<id>` refs) | optional `items` of viewed word refs (outcome `skipped`? — semantics undecided) | none | decide whether viewing is an item at all (engine treats it as participation) | none | — (low value) |
| `word-practice` | `WordCard.onHeard` (`word-practice:<id>`) | item `word:<id>` correct/incorrect; evidence heuristic | heard text, expected word | item: `given` (ASR/typed text) | **learner speech text** (free text, short) | would capture `text` | none | P3 (STO-85) |
| `lesson` | `TopicScreen.finishTopic` (`topic:<id>`) | no items, no score | nothing meaningful | `lang`, `levelId` only | none | none | none | — |
| `speaking-scenario` | `SpeakingSession.finish` (`speak:<id>`) | no items/score; evidence heuristic; `assisted` false | per-turn utterance, `SpeakingScore`, corrections, hint usage | per-turn item: `given`, scores; `assist` | **free text + derived feedback quoting it** | needs STO-85; hint semantics need STO-40/41 | none | P3 / blocked |
| `speaking-prompt` | `TopicScreen.onSpeak` (`topicspeak:<id>`) | no items/score | utterance, score | as above | free text | as above | none | P3 / blocked |
| `writing` | `WritingEditor.analyse` (`ex:<task.id>`) | **no items, no score** | writing text, `WritingFeedback`, score summary | entry: text (capped), feedback summary (scores only?) | **highest-risk free text** | STO-85 first | none | P3 / blocked; (a score-only P1 variant needs owner approval) |
| `real-life` | `RealLifeTopic.answer` (`ex:real-<id>`) | score 1/1 or 0/1; **no items** | chosen option, correct option | item: `given`, `expected` (from `topic.challenge`) | authored content | add item with `itemRef` | none | P2 |
| `daily` | `DailyScreen.finish` (`daily:<date>`) | no items/score | nothing beyond its quiz and speaking parts (recorded separately as `quiz` and by `setDaily`) | none | — | none | none | — |

Notes: (a) the `speaking` parts of `daily` are not recorded as their own attempt today (only `daily:<date>` on completion). (b) No producer emits `partial` or `skipped`. (c) `completes` is a *derived* completion hint; the Core already stores completions, so per-entry `completes` has history value only for display.

---

## 5. Privacy and free-text analysis

### 5.1 Classification of data classes

| Data | Where it arises | User-generated free text? | Personal data risk | Status in register | S2b classification |
|---|---|---|---|---|---|
| Quiz `given` (option/chips) | `QuizRunner` | No (selection) | None | not addressed specifically; "typed answers" in STO-85 does not occur in current quizzes | **Requires owner decision** (only for the *content snapshot* aspect, STO-83) |
| `expected`, prompt, `why`, options | authored content (`exercises.ts`, `questions.ts`) | No | None; copyright/size/versioning | STO-83 OPEN | **Requires owner decision** (STO-83) |
| Writing text | `WritingEditor` textarea | **Yes** | **High** (may contain names, addresses, employers) | STO-85 OPEN | **Must not be captured in S2b until STO-85 is answered**; requires a privacy and retention policy |
| Speaking transcript / typed utterance | `SpeakInput`, ASR | **Yes** | Medium–high | STO-85 OPEN | **Must not be captured until STO-85**; requires policy |
| Voice recordings (audio) | not recorded anywhere | — | Very high | none | **Must not be captured in S2b** (no audio stored; keep it that way — explicit exclusion recommended) |
| Derived feedback quoting learner text (`errors[].wrong`, `spelling[].word`, `corrections.wrong`) | `analysis.ts` | **Yes (derived)** | Same as source text | STO-85 (implicitly) | **Treat as free text**; excluded until STO-85 |
| Feedback that quotes only authored text (`why`, `formalityNote`, `tip`) | authored/analyser strings | No | None | STO-83 | Requires owner decision (snapshot vs reference + `lang`) |
| Score summaries (`SpeakingScore`/`WritingFeedback.scores`) | analysers | No (numbers) | None | not addressed | **Requires owner decision** (could be a small P1-style numeric capture) |
| Explanation language `lang` | `state.lang` | No | None | design §13.8 lists `lang` as S2b | Already approved as an **S2b field in principle** (STO-82 architecture); needs authorisation |
| Per-entry `courseId`, `completes` | `ActivityResult` | No | None | §13.8 "not stored in S2" | Already approved in principle for S2b (STO-82); needs authorisation |
| Tutor conversations | `TutorChat`, tutor record (S1) | **Yes** | High | STO-23/29 (export/reset) | **Out of S2b — must not be duplicated into attempt history** |
| AI-generated feedback | none today (rule-based mock) | n/a | n/a | none | **OPEN** — if a real backend is introduced a new decision is required; S2b must not assume it |
| Hint usage | `SpeakingLab` hint buttons; `<details>` hints | No | None | STO-40/41 PROPOSED, STO-42–44 OPEN | **Requires owner decision**; blocked on STO-40 (current behaviour submits the hint) |
| Mistake↔attempt linkage | `addMistake` | No | None | listed under S2b scope | **Requires owner decision** (design needed) |

### 5.2 Exact answer to "which additional data may be captured in S2b"
* **Already approved in principle (STO-82 architecture approval, 5 Nov 2026; S2b itself needs separate design review + authorisation):** per-entry `courseId`, `completes`, `lang`, `entrySchema: 2`, `contentRef`, item detail (`given`, `expected`, `promptSnap`, `concept`, `errorClass`) and "all free text" are named as **S2b scope** — i.e. *where they will be captured*, **not** a decision *whether* free text may be stored. The register states STO-83/85 remain OPEN. Therefore "free text" is **not approved**.
* **Requires owner decision before any capture:** STO-83 (snapshot vs reference vs both), STO-85 (free text default/opt-in, caps, snapshots, export), STO-40/41 (hints), the numeric budgets/tier (STO-79/86).
* **Must not be captured in S2b:** audio, tutor conversations, passages/transcripts of reading/listening content, whole-exercise copies (register alternative explicitly "no whole-exercise copies"), and anything not in the approved list.
* **Requires a privacy and retention policy:** writing text, speaking text/transcripts, derived feedback quoting the learner. Note STO-87 (never auto-delete) and STO-71 (raw data never discarded automatically) mean a retention policy **cannot** mean automatic expiry without a new owner decision; the only available control is learner-initiated deletion, which is **not built** (STO-84/88/89/91 deferred).

### 5.3 Privacy-relevant constraints from approved decisions
* Free text is stored **plaintext in localStorage** (as the tutor transcript already is) — register STO-85 consequence.
* The pinned S1 migration backup (R1) and S1-era snapshots may still hold pre-S2 history and must be disclosed (STO-85 amendment).
* Composite snapshots exclude history (STO-76): S2b free text will therefore **not** be duplicated into snapshots, but it **is** subject to Reset-survives (STO-90): a learner who "resets" keeps their writing text. The reset confirmation wording (updated in S2) says history is retained; S2b must re-check that wording against newly captured free text.
* No `deletions` operation exists. A learner cannot erase captured writing text. **Recommendation for owner (not a decision):** do not capture free text before a deletion path (or an explicit owner acceptance of its absence) exists.

---

## 6. Results schema proposal (additive; no redesign)

Principle: keep `v:1` of the record, set `entrySchema: 2` only on entries written by S2b, keep all new fields **optional**, never invent them for old entries, and never read them in crediting code.

```
entry (schema 2, all new fields optional)
  …existing header…
  entrySchema: 2
  courseId?: string            # per-entry (design §13.8 names it S2b)
  lang?: 'ru'|'ky'|'de'        # explanation language at the time
  completes?: string[]         # display only; the Core owns completion
  capture?: 'basic'|'detail'   # absence = basic (migrated/legacy) — design §13.8/ test strategy "capture:'basic'"
  items[]:
    itemRef, outcome           # unchanged (key for credit/dedup)
    given?: string             # bounded; authored option text/word-chip order for quizzes
    expected?: string          # bounded; authored
    type?: 'choice'|'fill'|'order'|'article'
    concept?: string           # bounded id
    assist?: 'none'|'hint-viewed'|'hint-repeated'|'solution-shown'   # ONLY if STO-40/41 approved
    promptSnap?: string        # ONLY if STO-83 approves snapshots; bounded
    contentRef?: { id: string, v?: string }   # ONLY with STO-83 decision
    # free text fields — NOT proposed until STO-85 is answered
```
**Do not propose / do not implement now:** `text` (writing), `utterance`/`transcript` (speaking), `feedbackText` quoting learner text, any audio, passages, whole-exercise copies, AI output.

Schema rules S2b must satisfy (all derivable from approved S2 conditions):
1. Every new field is optional and ignored by `creditStatus`, `engine.recordResult` credit logic and merge-duplicate decisions (Core tombstones remain sole duplicate authority; `entry.xp` stays informational).
2. Unknown fields keep surviving (already implemented); a **bounds layer** must be added for new/unknown string fields (length caps, item cap already 50, entry byte cap) — enforced in the sanitiser and also at capture time. *Gap today: `unknownKeys` has no cap.* A truncation marker (visible, never silent repair) is needed because the 50-item truncation is already "visible, not repaired" per test strategy.
3. Legacy/migrated entries are never improved or back-filled (`capture` absent ⇒ basic).
4. A reader meeting `entrySchema` higher than it knows must keep the entry as-is (already tested in `s2-results.test.ts`).
5. `resultId` and idempotency are untouched; the attempt id is generated at attempt start (`useAttempt`) so a replay is a no-op in the engine.

---

## 7. Migration and compatibility analysis

* **No storage migration is needed** for additive optional fields: the record version stays 1; layout stays 2; an S2-era build reading an S2b entry keeps unknown fields (verified behaviour: unknown entry/item fields survive reads and rewrites). `schemaVersion` stays 2.
* **Downgrade:** an S2 build (this build) that loads a record containing S2b fields preserves them. A build older than S2 treats layout 2 as newer ⇒ read-only (existing S1 guard) — unchanged.
* **Historical entries without new fields** stay valid; UI (future) must show "details not recorded". `capture` absence means basic.
* **Cross-tab:** union by `resultId` already handles two tabs; with richer entries two tabs can never produce different content for the *same* `resultId` unless an attempt id is reused. Open edge: on a union conflict with the same id and different content, the current merge keeps one entry (it is not defined which). **Needs a test and an explicit rule** (e.g. first-written wins, no field-level merge) — not decided in the register; mark as design item in stage S2b-1.
* **Retry/pending queue:** the in-memory pending buffer holds whole entries; with richer entries its memory footprint grows (uncapped by STO-96). With free text the "pending notice → possible loss on close" warning (STO-100) carries more sensitive data. No new behaviour required, but **size per entry must be bounded** so a failing write does not hold unbounded memory.
* **Quota:** the record is a single localStorage key (~5 MB origin budget shared with the core, preferences, tutor, backups, quarantine). Detail multiplies entry size; STO-79 budgets and STO-86 tier are unmeasured (S2-M9). A quota failure today ⇒ pending + persistent notice, never deletion (STO-87). S2b may therefore bring users to the quota **much** sooner; this is the central technical risk (§11).
* **Performance:** whole-record read-union-write on every attempt; JSON parse/serialise cost grows linearly with history × entry size. Unmeasured.
* **Future versioning:** use `entrySchema` (integer, absent ⇒ 1); do not bump record `v`.

---

## 8. Implementation stages (small, independently verifiable)

None of these is authorised. Each stage needs the owner's written authorisation after the S2b design review. Stage order is strict; no stage touches S2 storage behaviour.

### Stage S2b-0 — Contract and guard rails (no capture)
* **Objective:** define the bounds layer and the extended in-memory contract so later stages cannot over-collect.
* **Files likely to change:** `src/storage/activity.ts` (size caps for unknown/optional string fields, entry byte cap, visible truncation marker), `src/progress/types.ts` (`ItemOutcome` optional detail), `src/app/store.tsx` (`AttemptReport`/`useAttempt.build` carry optional fields, read `state.lang`), `src/progress/engine.ts` (copy optional fields into the stored entry; never read them), new tests.
* **Data contract changes:** optional item/entry fields (§6) accepted and bounded; nothing captured by any feature yet.
* **Required tests:** sanitiser bounds (over-long strings truncated *visibly*, never silently), unknown-field preservation unchanged, historical entries without new fields, XP invariance (engine with/without detail ⇒ identical Core), "no capture without opt-in" guard (the S2 free-text guard test).
* **Migration implications:** none.
* **Risks:** truncation could make a stored value differ from what was shown; define marker.
* **Acceptance:** all S2 tests green unchanged (773); new tests prove bounded and credit-neutral.
* **Owner decisions needed:** field list and caps (new, unregistered); STO-82 implementation authorisation.

### Stage S2b-1 — Structural, non-text fields
* **Objective:** capture `lang`, `courseId`, `completes`, `capture:'detail'`, item `type`/`concept` where they already exist in memory.
* **Files:** `src/app/store.tsx` (`useAttempt.build`), `src/features/tests/QuizRunner.tsx` (retain `type/concept` in `log`), engine/storage as S2b-0.
* **Data contract:** adds only enumerations/ids; no learner-authored or authored text.
* **Tests:** per kind that goes through `QuizRunner` (quiz, review, assessment, reading, listening); Russian/Kyrgyz `lang`; missing optional fields; cross-tab union; retry after quota failure; duplicate attempts (same `resultId` twice ⇒ one entry, one tombstone); XP invariance.
* **Migration:** none.
* **Risks:** low.
* **Acceptance:** stored entry contains exactly the approved fields (fixtures per kind, test strategy §6).
* **Decisions:** only the S2b-0 ones.

### Stage S2b-2 — Quiz answer capture (`given`/`expected`) for closed-choice kinds
* **Objective:** retain the learner's selection and the expected answer for quiz-like kinds (`quiz`, `review`, `assessment`, `reading`, `listening`) and `real-life`.
* **Files:** `QuizRunner.tsx`, `RealLife.tsx`, `ItemOutcome`/`AttemptReport`.
* **Data contract:** `items[].given/expected` (bounded). Authored content only — **but** this is a content snapshot, so STO-83 must be answered first (snapshot vs reference).
* **Tests:** per exercise type (`choice`, `fill`, `order`, `article`), correct and incorrect, `order` joined chips; hint-free; renumbered-id fixture (snapshot still shows the answer as shown then); Kyrgyz/Russian; storage-failure retry; size per attempt (S2-M9).
* **Risks:** storage growth; copyright of authored content; id renumbering.
* **Acceptance:** `given` equals what the learner chose; `expected` equals content at that time; XP identical with and without.
* **Decisions:** **STO-83 (blocking), STO-79/STO-86 measurement (strongly advisable).**

### Stage S2b-3 — Prompt/feedback snapshot for quiz-like kinds
* **Objective:** `promptSnap`, shown `why` (with `lang`), `contentRef`.
* **Files:** as S2b-2.
* **Decisions:** STO-83; whether feedback is stored as text or reference+`lang`; byte budgets.
* **Risks:** largest size multiplier; do not copy reading passages/listening transcripts.

### Stage S2b-4 — Hint/assist capture (speaking)
* **Objective:** truthful `assist` per item.
* **Files:** `SpeakingLab.tsx`, `SpeakInput.tsx`, possibly `TopicScreen`/`PracticeScreens`.
* **Blocked on:** STO-40 (a hint tap currently *submits* the answer and counts as an attempt), STO-41, and — because `assisted` feeds XP via `assistedFactor` — STO-42/43/44. **S2b must not change XP.** If the owner wants hint *capture* without any XP/UX change, that is a new decision (unregistered).
* **Acceptance:** XP invariant; hint tap semantics unchanged unless STO-40 approved.

### Stage S2b-5 — Free text (writing, speaking) — only after STO-85
* **Objective:** store learner text under the approved privacy default.
* **Required before start:** STO-85 answered (default/opt-in, caps, snapshot/export treatment), a deletion path or explicit owner acceptance of its absence, retention statement consistent with STO-71/87, user-facing disclosure wording ru/ky/de.
* **Files:** `WritingLab.tsx`, `SpeakingLab.tsx`, `SpeakInput`, `TopicScreen`, `PracticeScreens`, `WordCard`; settings UI if opt-in.
* **Tests:** opt-in/out both paths; no text when off; caps; privacy fixtures; snapshots still exclude history; Reset retains (STO-90) and wording updated.
* **Risks:** highest.

### Not an S2b stage (explicitly excluded)
History UI, export/import, history deletion, retention/pruning, IndexedDB, backend sync, tutor-history copy, audio.

---

## 9. Test strategy

**Automatable (vitest/jsdom, existing patterns in `tests/storage/s2-*.test.ts*`, `tests/helpers.tsx`, `tests/storage/fakes.ts`):**

| Concern | Tests |
|---|---|
| Each activity kind (13) | fixture per kind producing the *exact* approved field set; `QuizRunner`/`WritingEditor`/`SpeakingSession`/`RealLifeTopic`/`WordCard`/`VocabStudy`/`DailyScreen`/`TopicScreen` component tests (none exist today — **new harness needed**: component tests with the real `AppProvider`) |
| Correct / incorrect | per exercise type (`choice`, `fill`, `order`, `article`) |
| Missing optional fields / historical entries | storage tests: entries without new fields load, merge, rewrite identically; `capture` absent ⇒ basic |
| Unknown optional field preservation | extends existing S2 tests to the new field names and to bounds interaction |
| Bounds | over-long strings/entries truncated visibly; item cap 50 shown; no entry exceeds the byte cap |
| Locales | `lang` = `ru`/`ky`/`de` stored correctly; German target is constant (`de-DE`); *English target is not supported by the app* (`Lang` is `ru|ky|de` explanation language; course is German only) — no English-target tests apply |
| Writing/speaking privacy boundaries | with the privacy default off, **no** text reaches storage (spy on `setItem`, scan the stored record for the typed marker string); with it on, caps apply; snapshots never contain history |
| Hint usage | only after STO-40/41: hint tap does not submit; `assist` set; XP unchanged |
| Cross-tab | two tabs different attempts ⇒ union; same `resultId` conflicting content ⇒ defined rule; reset in one tab keeps history |
| Retry after storage failure | quota on results only/both: pending count, notice, retry writes exactly once, no duplicates, no XP without Core |
| Duplicate attempts | double `finish` ⇒ one entry/one tombstone; renew creates a new id |
| XP invariance | property test: for any detail payload the Core (xp, ledger, tombstones, completions) equals the Core produced without detail |
| Existing S2 behaviour | re-run migration/recovery matrix, STO-90/92, compat refusal, F1/F2 regressions unchanged |
| Mutation | disable bounds ⇒ killed; let `entry.xp`/detail influence credit ⇒ killed; drop unknown fields ⇒ killed; capture without opt-in ⇒ killed |

**Require real-browser verification (same CDP harness, no new dependency):** quota with realistically sized entries (S2-M9 numbers), write latency with thousands of detailed entries, pagehide flush of a large pending queue, two-tab concurrent capture, Web Speech API recognition capturing (or not capturing) text, real keyboard/IME input of Kyrgyz/Cyrillic/German umlauts in the writing field, production build + Service Worker + offline. **Cannot be automated here / remain NOT TESTED until run:** mobile devices, other browsers, headed visual review, Kyrgyz native-speaker review.

---

## 10. Open owner decisions (register IDs reused; no duplicates; no OPEN item marked approved)

| ID | Current status | Exact question | Options (from evidence) | Technical consequence | Blocks S2b? |
|---|---|---|---|---|---|
| **STO-82** | Architecture APPROVED 5 Nov 2026; S2b capture requires **separate design review + approval**; implementation not authorised | Approve the S2b field list, staging and the (unregistered) caps below | design §13.8 table; this audit §6 | defines the exact contract | **Yes** — needs the S2b design review and written authorisation |
| **STO-83** | OPEN (deferred to S2b under the free-text guard) | How do historical attempts stay interpretable when content changes: snapshot, versioned reference, or both? | snapshot; reference+`lang`; both; freeze content (register alternatives) | decides entry size; `ex###` ids renumber (counter in `exercises.ts`), so references alone are unsafe until stable ids (STO-60/P2) | **Yes** for S2b-2/3 (content capture); not for S2b-0/1 |
| **STO-85** | OPEN (deferred to S2b) | Is free text (writing, speaking transcripts) stored by default, opt-in or never; caps; snapshot/export treatment? | register: opt-in or disclosed default with caps; store everything; never store | personal data plaintext in localStorage; interplay with Reset-survives (STO-90) and no deletion | **Yes** for S2b-5; not for S2b-0–3 |
| **STO-79** | OPEN | Retention values and numeric budgets (stay unfrozen until measured) | per register | caps in S2b-0 depend on measurement | **Advisory→blocking for caps** (cannot state a size guarantee) |
| **STO-86** | OPEN | localStorage record vs IndexedDB for detailed history | register | richer entries may exceed localStorage; IndexedDB is excluded from this task | **Advisory**, becomes blocking if S2-M9 shows quota exhaustion |
| **STO-40** | PROPOSED | Hint tap pre-fills instead of submitting? | register default vs "keep submit and mark assisted" | behaviour change in `SpeakingLab` (current code submits the hint) | **Yes** for S2b-4 only |
| **STO-41** | PROPOSED | Per-item `assist` representation | register default | additive item field | **Yes** for S2b-4 |
| **STO-42 / 43 / 44** | OPEN | Assisted XP factor; consistency rule; repeat detection | register | only if assist is allowed to affect XP; S2b must not change XP | Blocks S2b-4 *if* XP linkage is requested |
| **STO-60** | PROPOSED | Opaque ActivityRef ids with `legacyId` aliasing | register | stable content refs; avoids re-pointing | Advisory for S2b-2/3 (alternative: snapshot per STO-83) |
| **STO-84 / 88 / 89 / 91** | STO-84 requirement confirmed; 88 approved only as the reserved field; 89/91 deferred | Does capture of free text require a deletion path first? | owner decision (not in register as a question) | no deletion path exists | Advisory for S2b-5 (recommended gate) |
| **STO-71 / 76 / 87 / 90 / 98 / 99** | OWNER-CONFIRMED / approved | — | — | binding constraints (no auto-delete, no history in snapshots, tombstone authority) | Binding, not open |

**Decisions the register does not contain (no ID exists; proposed for registration — I did not assign IDs):**
1. **(U1)** Field-level caps and entry/record byte caps; what the visible truncation marker looks like.
2. **(U2)** Same-`resultId`, different-content merge rule.
3. **(U3)** Whether quiz `given`/`expected` is stored as text, ref-only, or only for incorrect answers (size lever) — depends on STO-83.
4. **(U4)** Whether score/feedback *summaries* (numeric, no text) may be captured for writing and speaking without free text.
5. **(U5)** Mistake↔attempt linkage design (currently `mistakes` is separate, capped at 300, no `resultId`).
6. **(U6)** Whether `vocabulary-study`, `lesson`, `daily` need any items at all.
7. **(U7)** Explicit exclusion of audio and tutor text from history (recommended; not yet recorded).
8. **(U8)** Consent/disclosure wording ru/ky/de if free text is ever stored.
9. **(U9)** Treatment of any future AI-generated feedback.

---

## 11. Risks and dependencies

| Risk | Severity | Note |
|---|---|---|
| localStorage quota exhaustion from detailed entries (whole-record rewrite per attempt; STO-79/86 unmeasured) | **High** | S2-M9 not run; STO-87 forbids deleting to make room |
| Capturing free text without a deletion path | **High (privacy)** | plaintext; survives Reset by STO-90 |
| Content ids renumber (`ex###` counter) ⇒ history re-points or contradicts what was shown | High | needs STO-83 snapshot or STO-60 stable ids |
| Unbounded unknown fields in the sanitiser (no caps today) | Medium | S2b-0 closes it |
| S2b touches every learning screen; **no component-level capture tests exist** | Medium | new harness needed |
| Hint semantics (hint tap submits) conflicts with truthful `assist` | Medium | STO-40 |
| Any capture change accidentally influencing XP | High | invariance tests/mutation; Core remains the only authority |
| Same-id conflicting content in cross-tab union | Low–Medium | rule U2 |
| Web Speech API may send audio to a vendor | Medium (disclosure) | outside storage; needs wording |
| Pending-queue memory growth with large entries | Low–Medium | bound entry size |
| Kyrgyz strings unreviewed (inherited from S1/S2) | Medium (release) | any new notice/disclosure text needs native review |

Dependencies: S2 accepted (verification verdict is `VERIFIED WITH LIMITATIONS`; limitations still open), STO-83/85 answers, STO-79/86 measurements, STO-40/41 only for hints, owner written authorisation per stage.

---

## 12. Explicit implementation readiness verdict

# **NOT READY**

Reasons (each independently sufficient): (1) STO-82 requires a **separate S2b design review and approval**, which has not occurred and no implementation authorisation exists; (2) **STO-83 and STO-85 are OPEN** and were deferred to S2b precisely because S2b is where they govern capture; (3) STO-79/STO-86 budgets/tier are **unmeasured** while S2b multiplies entry size; (4) hint capture is blocked by **STO-40/41**; (5) there is no learner deletion path for any captured free text.

**Path to READY WITH CONDITIONS (staged):**
* **S2b-0 and S2b-1** (bounds + structural non-text fields: `lang`, `courseId`, `completes`, `capture`, item `type/concept`) become **READY WITH CONDITIONS** once the owner (a) approves the S2b field list and caps (U1, U2), and (b) gives written implementation authorisation. They need no answer to STO-83/85.
* **S2b-2/3** additionally need STO-83 answered and S2-M9 size measurements.
* **S2b-4** additionally needs STO-40/41 (and an explicit "no XP change" statement).
* **S2b-5** additionally needs STO-85, the deletion-path decision, and disclosure wording.

*Document status: new file. No source code, tests, dependencies, package files or existing documents were modified by this task.*
