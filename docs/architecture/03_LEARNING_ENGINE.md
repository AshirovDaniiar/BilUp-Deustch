# 03 — Learning Engine

Part of the BilUp Til 2.0 set ([01](01_PRODUCT_ARCHITECTURE.md) defines labels and vocabulary). Addresses **V-03, V-04, V-05, V-09, V-10, V-11, V-16**, and the "no hard-coded lesson counts or CEFR levels" requirement.

---

## 1. Verified current state

| Fact [V] | Evidence |
|---|---|
| A shared `Question` type (`choice`, `fill`, `order`, `article`) is rendered by one `QuizRunner` for practice, tests, daily, review, reading and listening questions | `features/tests/questions.ts:10-27`; `QuizRunner.tsx` |
| `QuizRunner` mutates global state directly: `addXp(5)` per correct, `addXp(10)` per finish, `answerVocab`, `addMistake` | `QuizRunner.tsx:39-46,75` |
| Other activities each award rewards themselves: writing +15 per analysis; speaking +20 on finish; topic +20; daily +25; word repeat +3/+1 | `WritingLab.tsx:46-49`; `SpeakingLab.tsx:85-95`; `TopicScreen.tsx:47-60`; `PracticeScreens.tsx:156`; `WordCard.tsx:26` |
| Completion is a free string set (`"3:test"`, `"topic:id"`, `"ex:id"`, `"speak:id"`), written from many components; unit test and review complete at any score | `store.tsx:97`; `PracticeScreens.tsx:66,115-119` |
| Fixed 8 sections per unit and `UNITS.length*8` denominators | `stats.ts:37-48` |
| Heuristic assessment: speaking/writing scores are arithmetic over keyword hits and pattern counts; pronunciation = recognition *confidence* | `services/analysis.ts` |
| Speaking hints are submitted as answers (`onAnswer(h,null)`) and scored | `SpeakingLab.tsx:137-141` |
| Reading questions mapped to `kind:'grammar'` with the whole passage as `why` | `ReadingLab.tsx:53` |
| Tutor holds one module-level `pending` answer; `clearTutor` does not reset it | `services/tutor.ts:43,65-78` |
| Placement can output "A2 →" from a raw percentage; only A1 content is exposed | `PracticeScreens.tsx:127-128`; `LearnScreen.tsx:21-46` |
| Prose (Russian) built inside services | `questions.ts`, `analysis.ts`, `tutor.ts` |
| Leitner SRS (boxes 0–5, intervals 0/1/2/4/8/16 days; relearn after 10 min) is clean and pure | `services/srs.ts` |

---

## 2. Engine overview **[R]**

The Learning Engine (layer L3) is the **one runtime** for every learner activity. Learning surfaces (L4) provide the interaction UI; the engine provides contracts, rules and state transitions. It follows the single authoritative dependency policy in [01 §4.2](01_PRODUCT_ARCHITECTURE.md): it imports only `shared`/`shared/contracts` and the public APIs of lower layers (`platform`, and — only if needed for concrete utilities — `languages`/`content`); it **never imports `core`** (same layer). Everything it needs from `core` or `content` arrives as a contract implemented elsewhere and wired in `app`: `ProgressPort`, `SettingsPort`, `CourseCatalogPort`, `LanguagePackPort`, `SpeechPort`. *(Reconciled in revision 2 — review H-1.)*

```
Course pack ──(CourseCatalogPort)──► Engine ──► Activity runner (UI from features/*)
                                        │
                     ActivityResult ────┴──► ProgressPort.record()  (core/progress, doc 05)
                                                 │
                                   RewardPolicy ─► XP, completion, mastery updates (idempotent)
```

Responsibilities:
1. **Activity registry** — maps `activity.kind` → definition schema + runner component + result mapper.
2. **Session lifecycle** — start/answer/finish, attempt counters, assisted vs unassisted flag.
3. **Result emission** — exactly one `ActivityResult` per attempt, with an idempotency key.
4. **Policies** — completion thresholds, reward rules, repeat-credit — configured by the course pack (not literals).
5. **Mastery** — SRS scheduling per *learning item*, scoped to course.
6. **Assessment ports** — heuristic now, remote later, always labelled.
7. **Next-step selection** — recommendations from progress + course structure.

It does **not** own: persistence (05), content storage (04), locale rendering (02), routing/layout (06).

---

## 3. Activity model

### 3.1 Activity kinds (initial)
Mapped to existing features so working behaviour is preserved:

| `kind` | Existing implementation to preserve | Notes |
|---|---|---|
| `lesson` (guided multi-step) | `TopicScreen` 7-step flow | Steps are **declared in the course pack** (`discover, understand, practice, apply, speak, test, review` is the default template, not a constant). |
| `quiz` | `QuizRunner` question types | Question item types: `choice`, `fill`, `order`, `article` (language-extension; `article` is German-specific, 04 §4.2), extensible (`typed`, `dictation` [F]) |
| `vocabulary-study` / `srs-review` | `VocabStudy`, `ReviewScreen`, `srs.ts` | |
| `reading` | `ReadingLab` | Passage + gloss lookup + comprehension questions |
| `listening` | `ListeningLab` | Audio source = TTS now, recorded audio later (`AudioSource` port) |
| `speaking-scenario` | `SpeakingLab` | Scripted turns |
| `speaking-prompt` | topic speaking step, daily speaking | |
| `writing` | `WritingLab` | |
| `assessment` | `buildTest`, placement, level, unit tests | See §7 |
| `daily` | `DailyScreen` | Composed activity (child activities) |
| `tutor` | `TutorChat` | Conversational; no scoring by default |

### 3.2 Definition vs instance
```ts
// illustrative contract — not implemented
interface ActivityDef {                    // lives in the course pack (04)
  id: ActivityId;                          // stable, namespaced: 'de-general/u03/reading/re03'
  kind: ActivityKind;
  levelId: LevelId;                        // from the course's level scale
  skills: SkillId[];                       // 'vocabulary' | 'grammar' | 'reading' | …  (skill list is configuration)
  contentRefs: ContentRef[];               // items used
  policy?: PolicyOverrides;                // threshold / reward overrides
}
interface ActivityAttempt { attemptId: string; activityId: ActivityId; startedAt: number; assisted: boolean }
```
UI components receive `ActivityDef` + resolved content (already localised by `explanationLocale`) and report events to the engine; they do **not** call `addXp`/`complete`.

---

## 4. `ActivityResult` and reward policy (closes V-04, V-05, V-16)

### 4.1 One result contract **[R]**
```ts
interface ActivityResult {
  resultId: string;                 // = attemptId; idempotency key (also see 05 §4)
  courseId: CourseId;
  activityId: ActivityId;
  kind: ActivityKind;
  levelId: LevelId;
  startedAt: number; finishedAt: number;
  activeMs: number;                 // measured active time (05 §5)
  assisted: boolean;                // hints/solutions shown, or hint text submitted as answer
  items: ItemOutcome[];             // per item: itemRef, correct|partial|incorrect|skipped, skill, conceptRef?, responseSummary
  score: { earned: number; possible: number } | null;   // null for non-scored kinds
  evidence: 'measured' | 'heuristic' | 'self-reported';  // see §7
  diagnostics?: { analyzerVersion: string };
}
```
Everything downstream — XP, completion, mastery, mistake history, stats, badges — is **derived from stored results** (05 §4). Components never touch XP or completion.

### 4.2 Reward policy (configurable per course/activity) **[R]**
```ts
interface RewardPolicy {
  xpBasis: 'perCorrectFirstTime' | 'perResult' | 'none';
  xpPerUnit: number;
  firstCompletionBonus: number;
  repeat: { creditAfterFirst: 'none' | 'reduced' | 'daily-cap'; reducedFactor?: number; dailyCapXp?: number };
  assistedFactor: number;          // 0 ≤ f ≤ 1 for assisted attempts
  passThreshold: number | null;    // fraction 0..1; null = participation-based
}
```
Defaults (**[R]**, tunable in the pack): `passThreshold` for assessments and unit tests; participation-based for lessons; `repeat.creditAfterFirst = 'daily-cap'` with a per-day XP ceiling per activity kind.

Rules:
1. **Idempotent by `resultId`.** Re-processing the same result changes nothing.
2. **First-time credit** is tied to `(courseId, itemRef)` for per-item XP, so repeating a quiz with the same items cannot re-earn the same XP; reduced/daily-capped credit applies to repeats. The record of which items already earned credit is the **permanent credit ledger** (05 §4.3), not raw results, so the rule keeps working after raw results are archived or pruned. Every credit entry stores the `policyVersion` that produced it; changing a policy never silently recomputes history (05 §4.3).
3. **Completion is derived**, not written: an activity is *completed* when it has ≥ 1 result satisfying `passThreshold` (or participation rule). Unit and level completion are computed from the manifest's required activities (§6). This fixes V-05: a 0 % unit test no longer completes the unit.
4. **Attempts are always recorded** (for mastery/analytics) even when not credited.
5. **Assisted attempts** (hints used as answers, solution viewed) are flagged and credit-reduced (V-16). In the speaking scenario, hints become *supportive*: showing a hint does not submit it; if the learner *repeats* the hint text aloud/typed it is recorded as `assisted:true` production.
6. **Daily challenge** is a composite activity: its reward is issued once per local day per course (`dailyKey`), regardless of how many times the finish handler runs (V-04).
7. **Word-repeat reward** (3/1 XP in `WordCard.tsx:26`) becomes a capped micro-activity (`none` XP by default **[R]**).

### 4.3 What is *not* a reward rule
Mastery (SRS) is never gated by XP caps — spaced-repetition scheduling must reflect actual recall, so mastery updates for every attempted item regardless of reward credit (§5).

---

## 5. Mastery and SRS

- Keep the Leitner algorithm and interval table as the default `SchedulerStrategy` (preserve `srs.ts`; extract constants into configuration; keep it a pure function).
- **Key change:** mastery is keyed by `(courseId, learningItemId)`, not a global vocabulary id; a word in `de-general` and `en-general` are different items.
- `learningItem` = anything that can be reviewed: vocabulary entry, grammar concept, article (German extension), phrase. Item types come from the pack.
- Stage names (`new/learning/familiar/strong/mastered`) are computed from scheduler state through a mapping defined in configuration.
- A future alternative scheduler (e.g. FSRS) plugs in via `SchedulerStrategy` **[F]**.
- Due-queue selection is per course and level-aware (does not offer items from levels not yet released/unlocked).

---

## 6. Course progression is configuration-driven (closes V-06 and the "no hard-coded counts/levels" rule)

### 6.1 Today (hard-coded) [V]
`stats.ts:37-48` — eight fixed section ids, `UNITS.length * 8`; `LearnScreen.tsx:23` — `l === 'A1'` locks; `HomeScreen.tsx:69-70`, `ProgressScreen.tsx:34` — literal "A1"; `TopicScreen` fixed 7 steps; `PracticeScreens.tsx:99-103` — level list rendering with `'level-a1'`.

### 6.2 Target **[R]**
The course manifest (04 §3) declares:
- the ordered **levels** (ids from the level scale, with `status: released | beta | planned`),
- per level the ordered **modules/units**, and per unit its **required activities** (any number, any kind),
- lesson step templates,
- assessment definitions and unlock rules.

The engine computes:
- `unitProgress = completedRequiredActivities / requiredActivities` — denominators come from the manifest; a unit with 7 or 12 required activities works unchanged.
- `levelProgress`, `currentUnit`, "next recommended activity", unlocks — all from the manifest + derived completion.
- Level labelling for UI by the `LevelScale` registry; code contains **no** `'A1'`, `10`, or `8` literals (lint rule on string/number literals in engine and stats **[R]**).
- Locked/unavailable levels from `status` and locale release (02 §5), never from a hard-coded list.

**Unit 10 issue (V-06):** the validator (04 §6) fails the pack build when a unit lists a required activity whose content is missing, or when a unit declares a section kind with zero items; the migration of today's `de-general` pack either authors a reading for unit 10 or removes the requirement for that unit explicitly in the manifest (visible, reviewable). Progress denominators then match reality.

### 6.3 Extending to C1/C2
Adding C1/C2 = add `released`/`planned` level entries and content to the manifest; no engine change. Until content exists, they render as *planned* and are not selectable.

---

## 7. Assessment and placement (closes V-11) **[R]**

1. **Evidence classes** on every result: `measured` (objective items auto-scored), `heuristic` (rule-based speaking/writing/tutor), `self-reported`. UI must label heuristic feedback as *practice feedback* with the standard disclosure (preserving the existing `analysisDisclaimer`/`tutorMock` honesty).
2. **No proficiency claims from heuristic evidence.** Placement/level estimates use only `measured` items.
3. **Placement is bounded by available evidence:** the result is clamped to the highest level whose pack status is `released` *and* has enough items for a calibrated band (`minItemsPerBand` in the assessment definition). If only A1 content exists, the result can say "A1 — start here" or "above A1 — higher levels not yet available"; it can never say "A2".
4. Results are expressed as `{ levelId, confidence: 'low'|'medium'|'high', basedOn: itemCount }` and rendered through `MessageRef`. The label is "estimate".
5. Level/unit tests use `passThreshold` from policy (V-05).
6. **Calibration [A]:** the current tests are random draws from the exercise pool (no item difficulty parameters). Items need difficulty/band tags to support placement; until then placement stays "rough estimate". Psychometric validation is not planned in scope **[A]**.
7. **Assessment port:** `AssessmentPort { evaluateSpeaking(...), evaluateWriting(...) }` returns `{ scores, findings: Finding[] }` where `Finding` carries `MessageRef` + target-text excerpts. Implementations: `HeuristicAssessment` (current `analysis.ts`, refactored, language-specific analyzers per 02 §6) and `RemoteAssessment` [F]. The pronunciation score remains `null` for typed input and is described as *recognition confidence*, not phonetic accuracy.

---

## 8. Speaking, writing and feedback

- Analyzers (`analysis.ts`) move to `languages/<code>/analyzers` and return `Finding { code, severity, ref: MessageRef, wrong?, right?, conceptRef? }` — no prose (V-03).
- Reading comprehension questions get their own mistake kind `reading` with a per-question rationale from the pack; the whole passage is never used as "why" (V-09). `Mistake.kind` becomes a configurable skill/kind taxonomy (pack-defined), including `reading`.
- The language-specific spelling rule that flags lower-case nouns (`AMBIGUOUS` list in `analysis.ts:60`) is only enabled for languages with `caseSensitiveNouns` and is a *suggestion*, not a score penalty, until reviewed [R].
- Speaking auto-play of the first turn needs a user gesture on mobile (retained as best-effort; fallback = visible play button). "Retry" must reset state rather than `window.location.reload()` (`SpeakingLab.tsx:125`).

---

### 8.1 Language-pack completeness: feedback parity for every target language **[R]** *(new — review H-5)*
Feedback is part of course completeness, not an add-on. A **language pack** (`languages/<code>/`, implementing the `LanguagePackPort` contract; see 04 §2.1) supplies, for its target language:

| Capability | German pack (convert existing) | English pack (new, required for the English course) |
|---|---|---|
| **Writing feedback** | pattern checks (`errorPatterns.ts`, `analysis.ts` German rules: noun capitalisation, word order, du/Sie formality) → `Finding`s | English rules (articles, tense/aspect, subject-verb agreement, word order, prepositions, spelling variants, register); *no* German-only rules (case, noun capitalisation) |
| **Speaking feedback** | keyword/pattern hints per scenario turn, naturalness from model hints | same structure; accent policy (en-GB / en-US) is a configuration decision; recognition language per pack (`en-GB`/`en-US`) |
| **Error explanations** | each `Finding.code` has an explanation entry per explanation locale (`ky`, `ru`) plus a link to the grammar concept | ≈ the same, with English concepts; written and reviewed in both locales |
| **Tutor responses** | per-language knowledge base (intents, keyword/pattern rules, answer blocks referencing concepts and examples) | English knowledge base with the same intent set (explain concept, correct my sentence, give examples, quiz me, difference between X and Y) |
| **Grammar visuals** | German set | English set or explicit "none" in the manifest (validated) |
| **Speech config** | `de-DE` | `en-GB`/`en-US` |

Acceptance for "English course complete" (08 P7a/P7): English writing feedback, speaking feedback, tutor replies and error explanations exist **and** are released in each explanation locale that the course is released in. If a capability is deliberately absent in a release, the manifest declares it (`capabilities`), the UI hides the entry points and shows an honest note — it is never silently missing.
Workload estimates for these packs are in 04 §13.4.

## 9. Tutor (closes V-10)

- `TutorService.reply(input, ctx)` gets a **conversation-scoped state object**: `TutorSession { id, pendingQuiz?: {...}, lastConceptRef? }` created per conversation and **destroyed on reset** (`clearTutor`). No module-level mutable state.
- Replies are `TutorReply { blocks: (MessageRef | ContentRef | TargetText)[]; suggestions: MessageRef[] }`. All text is in `explanationLocale` or target language (02 §3).
- The mock tutor keeps its disclosure; its knowledge base moves to per-language modules with keyword rules defined per `explanationLocale` (today the regexes mix Russian, German and Kyrgyz words in one list).
- A future remote LLM tutor [F] is a different `TutorService` implementation; secrets stay server-side (07 §10); output is rendered as text nodes only (preserve `TutorChat`'s no-HTML approach).
- **Entitlement and fair use (revision 3):** access to the AI Tutor is the entitlement `tutor.ai` with a configurable `UsagePolicy` (11 §3, §11) granted by both BilUp Basic and BilUp Premium Live; limits are product policy on the plan version, metered **server-side** at the tutor proxy, never constants in the client or the engine. The existing rule-based mock tutor has no marginal cost and stays local; metering applies when a remote tutor exists.
- Pending quiz answers evaluated by the same normalisation as quizzes, per-language.

---

## 10. Existing feature → engine mapping (preserve list)

| Existing feature | Preserved as | Changes required |
|---|---|---|
| `TopicScreen` 7-step lesson | `lesson` kind, default step template | steps from manifest; emits `ActivityResult` for practice/test sub-activities and one lesson result; completion derived |
| `QuizRunner`/`QuizPage` | `quiz` runner | stop writing XP/mistakes directly; emit result; messages by `MessageRef` |
| `srs.ts` | `SchedulerStrategy` default | course-scoped keys; config constants |
| `stats.ts` recommendations | `engine/next-steps` | read manifest; no literals |
| Daily challenge | `daily` composite | day-key reward once; localised prompts; composition from pack |
| Listening/Reading/Writing/Speaking labs | respective runners (L4 surfaces) | result emission; remove hard-coded Russian; reading kind fix |
| Real-life topics | `lesson`/`dialogue` content | content conversion (04 §9) |
| Article drill | German language-extension quiz item | gated by `de` extension |
| Tutor chat UI | `tutor` surface | session scoping |
| Badges | derived from results + manifest | rules moved to config; text via `MessageRef` |

---

## 11. Tests required **[R]**

| Level | Tests |
|---|---|
| Unit (pure) | reward policy table-driven tests (first credit, repeats, assisted, daily cap, idempotent re-processing); completion derivation (threshold pass/fail); SRS transitions (preserve current behaviour with golden tests before refactor); unit/level progress from manifests with arbitrary counts (7, 8, 12 required activities); placement clamping when only A1 released; message-ref purity (analyzers/tutor/questions return no raw text) |
| Property | `record(result)` twice ≡ once; XP never decreases; total XP independent of event order for the same result set |
| Integration | quiz → result → progress update through `ProgressPort` with an in-memory repository; tutor session reset clears pending state; speaking hint flow flags `assisted` |
| Contract | each activity kind's result schema validated (runtime schema) |
| E2E (Playwright) | complete a unit; repeat a quiz and assert XP not re-earned; fail a unit test and assert unit stays incomplete; settings-matrix leak test (02 §7) |

### Added tests (revision 2)
| Test | Asserts |
|---|---|
| Credit survives pruning | after archiving raw results, replaying a new result for an already-credited item awards no first-time XP (uses the credit ledger) |
| Policy-version stability | changing `RewardPolicy` leaves existing credit entries and totals unchanged; only new results use the new version |
| Language-pack contract | each pack implements writing, speaking, error-explanation and tutor capabilities or declares the gap in `capabilities`; every `Finding.code` has an explanation in each released explanation locale (coverage test) |

## 12. Open items
- Default `passThreshold` values and daily XP caps are product decisions **[A]** (propose 0.7 for tests, 0 for lessons; confirm with pedagogy owner).
- Whether `skills` taxonomy (vocabulary, grammar, listening, reading, writing, speaking) is global or per course — proposal: global default list in configuration, extensible per pack.
- Calibration data for placement (item difficulty) does not exist (Q-level, tied to Q3 in 01 §9).
