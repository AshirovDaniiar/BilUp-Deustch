# BilUp Til 2.0 — Storage S2: Test Strategy

**DESIGN ONLY.** Maps every invariant of [`STORAGE_S2_RESULTS_DESIGN.md`](STORAGE_S2_RESULTS_DESIGN.md) §4 to concrete tests. Existing suites (688 tests) must stay green or be updated with a written reason; S1 suites are the pattern to extend.

## 1. Layers
| Layer | Tooling | Content |
|---|---|---|
| Unit (pure) | vitest | `pruneActivity` + watermark, `mergeActivity`, results codec (`readResults/serializeResults`), order-key helpers, engine rule "late result ≤ watermark" |
| Persistence | vitest on `memoryKV`/`faultyKV` | write order, guards, damage handling, migration R0–R4, snapshots/restore |
| App | vitest + jsdom + real `AppProvider` | write isolation per action, two-tab events, notices |
| Property / exhaustive | vitest | prune idempotence/monotonicity, merge algebra on summaries, crash-order permutations |
| Failure injection | `faultyKV` (quota, unavailable, crash-before/after, lying write) at every write index | migration, record, prune, restore |
| Mutation | scratch script (as in S1) | listed in §3 |
| Real browser | Playwright (S6, **needs dependency approval**) + manual iOS/Android | storage events, quota, two-context races, heavy profile upgrade, M-series measurements. **None of this is claimed until actually run.** |
| Regression | existing XP/mastery/engine/cross-tab/legacy suites | fixtures compared before/after S2 |

## 2. Invariant → test matrix
| # | Invariant | Tests (names are proposed) |
|---|---|---|
| 1 | XP never twice | (a) engine suite unchanged; (b) `results record deleted → replay of a known resultId is a no-op`; (c) `results damaged → XP, ledger, completions byte-identical`; (d) property: random replay sequences ⇒ ledger sum constant |
| 2 | Replay can't duplicate | `append is idempotent by resultId`; `crash after results-append, before core ⇒ replay credited exactly once`; `crash after core ⇒ replay no-op` |
| 3 | Opening balances | migration fixture with `legacy-opening` + `legacy-seed`: `credit` and `progress.xp` equal before/after; v1-migrated profile → S2 upgrade |
| 4 | **DEFERRED — future deletion stage (prune/watermark inactive in S2; replaced by the S2 tests of §12–§14).** Pruning cannot double-count | `prune twice = prune once`; `crash between core(summaries+watermark) and results trim ⇒ next prune folds nothing twice`; `two tabs prune the same prefix ⇒ summaries never exceed single-tab totals`; `late result ≤ watermark folded once`; property: Σ(summaries)+|raw| = number of distinct recorded ids in a single-writer run |
| 5 | **DEFERRED — future deletion stage (removal-after-core inactive in S2; additions-before-core remain an S2 test).** Crash cannot lose raw and summary | crash matrix on every write of `record`, `prune`, `record+prune`; assertion: every `resultId` ever recorded is either raw or counted in summaries (single writer) |
| 6 | Corrupt results ≠ corrupt core | bytes/not-object/wrong record/missing version/repairs/future `v` (a differing `epoch` is **not** corruption for results — STO-90; the S1 "epoch above/below" cases are SUPERSEDED by STO-90 / design §11 — non-operative history); core bytes identical, no recovery screen, quarantine holds exact bytes (copy S1 matrix for the new key); quarantine failure ⇒ not replaced |
| 7 | Stale tab | stale-core tab: **zero core writes** (core guard) **and** its new attempt is merged into results (never dropped); results never overwritten or emptied; ~~"stale results record on disk ignored on load"~~ and ~~"slice-guard test for the results key"~~ are SUPERSEDED by STO-90 / design §11 — non-operative history; app-level reset-vs-pending-result test |
| 8 | Migration idempotent / crash-safe | `rerun changes nothing`; crash/quota/lying at each of R1–R3 ⇒ converges to the same state; resume from each §1 state; `layout 2` written only after verification (mutation M-S2-3) |
| 9 | Backups/quarantine | pinned R1 backup equals original S1 bytes; survives `rotateBackups`; damaged results bytes quarantined before replace |
| 10 | `v1` untouched | log assertion `no set/remove of bilup-deutsch:v1` in every journey above |
| 11 | Unknown keys | plant `bilup-deutsch:future-x`/foreign keys; unchanged after upgrade, record, prune, restore, rollback |
| 12 | Progress/mastery consistent | existing `engine/stats/app-wiring` suites; fixture: same sequence of results before/after S2 ⇒ identical `progress`, `credit`, `completions`, `summaries` |

Additional S2-specific tests: write isolation (`result ⇒ results+core only; preference/tutor change ⇒ own key only; pruning ⇒ order core then results`), composite snapshot contains/omits results exactly as STO-76 decides, old-build read-only (`layout 2` ⇒ `future-version`, zero writes), compat mode when R1/R2/R3 fail, notice texts (ru/ky/de) for a damaged results record, recovery panel lists the new quarantine copy and does not offer it as restorable, `evaluateRaw` rejects `record: "results"`.

## 3. Mutation plan (≥ 12, each must be killed or justified as equivalent)
M-S2-1 **results record treated as stale/invalidated because of the core epoch, or emptied by a replacement (the STO-90 violation; replaces the earlier inverted "stale results slice accepted")** · M-S2-2 core-epoch guard removed (core groups only) · M-S2-3 `layout 2` written before verification · M-S2-4 backup (R1) skipped · M-S2-5 results replaced instead of merged in R2 · M-S2-6 watermark not advanced · M-S2-7 raw ≤ watermark not dropped · M-S2-8 removal written before core in a prune · M-S2-9 addition written after core · M-S2-10 tombstones moved into the results record · M-S2-11 results damage treated as core damage · M-S2-12 unknown key removed · M-S2-13 `v1` written · M-S2-14 summaries merge back to per-field max without watermark · M-S2-15 damaged bytes replaced without quarantine · M-S2-16 stale-core guard also blocks the results append · M-S2-17 replace mode writes the in-memory (empty/old) buffer to the results key · M-S2-18 core-only restore writes default preferences/tutor · M-S2-19 `pruneActivity` still folds in `recordResult` or `mergeActivity` · M-S2-20 `rollbackToLegacy` removes the results key · M-S2-21 rollback/restore replaces results instead of merging.
**Deferred (watermark/prune/removal inactive in S2; future deletion stage): M-S2-6, M-S2-7, M-S2-8, M-S2-14.** In S2 the corresponding tests are: nothing is folded or removed anywhere, the watermark is never written with a value, tombstone expiry is unchanged (§14).

## 4. Real-browser measurement set (design only; no numbers frozen — STO-79)
| Id | Measurement | Method | Decides |
|---|---|---|---|
| S2-M1 | Core record size before/after S2 at light/regular/heavy profiles | generate with the engine, `new Blob([raw]).size` and UTF-16 units | size of snapshot/composite; whether core is small enough that every result rewrite is cheap |
| S2-M2 | Results record size vs number of entries, entries per result | same | whether segmenting/compaction is justified |
| S2-M3 | Write frequency per session (results appended per minute of use) | instrumented session | amplification |
| S2-M4 | `JSON.stringify`/`setItem` time for each record at 500 entries, with 4× CPU throttle and on a mid/low Android and an older iPhone | Playwright trace + manual | latency budget |
| S2-M5 | Recovery time: load with damaged results (quarantine + default) and with a heavy valid profile | Playwright | startup cost |
| S2-M6 | Quota pressure: fill storage then record results / prune / migrate | Playwright + manual | eviction/early-prune policy, compat mode behaviour |
| S2-M7 | Two-context concurrent recording and pruning | Playwright (shared context) | real `storage` event ordering; undercount bound |
| S2-M8 | Large histories: 5 000+ recorded ids over 400 days of simulated time | engine simulation | tombstone/summaries size, prune cost |

## 5. Exit criteria for S2 (implementation stage)
**Deferred / not applicable to S2:** every row of §7 (STO-84 deletion tests) and the history-backup and interrupted-deletion rows of §8 test a deletion operation that S2 does **not** implement; they are **future-stage design constraints, not S2 exit criteria**. S2 exit requires: all matrix rows of §2 (**except rows 4–5, deferred**), §6 (except deletion rows), §8 (non-deletion rows), §9 and §10 green; mutation survivors justified in writing; failure-injection matrices pass; XP/mastery regression fixtures identical; `npm run check` green; report lists browser checks as outstanding unless executed.

## 6. Update 5 Nov 2026 — tests required by the history requirement (STO-71 confirmed)
Invariant rows 4 and 5 are re-read as "**any approved deletion** (user-initiated or policy) cannot double-count nor lose both copies"; there is **no automatic pruning** unless the owner approves one.

| Area | Tests |
|---|---|
| **No silent deletion** | recording 2 000 attempts never removes or folds any entry; quota failure on the history write keeps the entry in memory, shows a notice, retries on the next save, **never** deletes older entries; rotation/snapshots never delete history; mutation: reintroduce `pruneActivity` auto-fold ⇒ killed |
| **Entry schema** | `entrySchema` accepted/rejected; unknown optional fields preserved on rewrite; missing optional fields valid; `capture:"basic"` for migrated entries; bounds (given/expected/prompt/free-text length caps) enforced by the sanitizer |
| **Capture fixtures (S2b)** | one fixture per kind (quiz, review, assessment, word-practice, reading/listening quiz, real-life, writing, speaking-scenario/prompt, vocabulary-study, lesson, daily): the stored entry contains exactly the approved fields; the submitted answer equals what the learner entered; expected answer equals the content at that time |
| **Interpretability over time** | change a fixture exercise's answer/translation/id ⇒ the stored entry still shows the answer/feedback as shown then; remove the exercise ⇒ entry still renders from its snapshot; renumber `ex###` ids ⇒ history is not re-pointed; explanation language changed afterwards ⇒ stored `lang` used |
| **Legacy honesty** | migrated entries are `capture:"basic"`; the reader reports "details not recorded", never fabricates; the 50-item truncation is visible, not repaired |
| **Deletion (when approved)** | delete one attempt / one course / all: history removed, **XP, ledger, tombstones, completions unchanged**; replay of a deleted attempt's `resultId` is still a no-op; crash between the two writes of a deletion converges (watermark rules); deletion is confirmed and never triggered by quota |
| **Privacy** | free-text capture follows the approved default (opt-in/opt-out); excluded/included in snapshots exactly as STO-76 decides; export (S4) honours the tutor-style optional flag |
| **Size/scale (simulation, then browser)** | 5 000+ attempts with detail: serialisation time, record size, load time; Playwright/real devices for capacity and quota (S2-M1…M8 plus S2-M9 below). **Nothing is claimed until run.** |
| **Daily-cap rule** | with unbounded history the repeat rule never over-credits (property test against a reference model) |

Additional measurement **S2-M9:** record size and write time per attempt for each kind with the proposed detail (quiz of 10/20/50 items, writing 150 words, speaking scenario) to size the storage tier decision (STO-86).

## 7. Update 5 Nov 2026 — tests for STO-84 (deleting history must not change progress) — **DEFERRED: future deletion stage, NOT part of S2 exit criteria**
| Requirement | Test |
|---|---|
| Only the results record is written | recording-store: a deletion performs exactly one `setItem` (results key); **zero** writes to course/prefs/tutor/legacy keys; unknown keys untouched |
| Core untouched | course record bytes identical before/after; `credit`, `progress`, `activity.completions/tombstones/summaries`, `epoch` equal (deep + byte) |
| XP, ledger | XP and ledger sum unchanged; replay of every deleted `resultId` ⇒ `duplicate`, 0 XP; replay of a *new* attempt of a deleted activity ⇒ no first-time credit again |
| Mastery, completion | `progress.mastery`, `progress.completed`, `completions` identical; a topic completed only by a deleted attempt stays complete |
| Achievements | `badges()` output identical before/after on a fixture with unlocked badges (nothing persisted) |
| Scopes | `course` deletes only that course's entries (two-course fixture; the other record untouched); `all` deletes every course's; unknown scope rejected |
| Markers | marker lives in the results record only; merges (stale tab/older copy) never resurrect deleted entries; merge of markers is idempotent/commutative/associative (exhaustive); entries recorded after deletion are kept |
| Safety snapshot + confirmation | snapshot failure ⇒ deletion refused, nothing changes; confirmation text states scope, counts and "XP, mastery, completed topics and achievements are not affected" (ru/ky/de); never invoked by quota |
| Crash/failure | crash/quota/lying write at the single write ⇒ history intact or deleted, never partial; core never modified in either outcome |
| Repeat rule direction | after deletion the daily-cap repeat credit is ≤ the credit without deletion for a randomized sequence (property test) |
| Clock edge | attempt finished under an earlier clock than the marker is dropped and reported, not silently kept/lost |
| Mutations | deletion also clears tombstones · deletion removes completions · deletion bumps epoch · marker stored in the core · marker not merged · deletion without snapshot · deletion on quota pressure ⇒ all must be killed |

## 8. Update 5 Nov 2026 — design-level test cases for STO-76 (snapshots exclude history) and recovery semantics
(Design only — no test is written or changed in this task.)
| Case | Expected |
|---|---|
| **Core-only snapshot** | `preserveCurrent` on a profile with history yields a record with **no** `activity.results`, marker `omitted:['history']`, and includes ledger, tombstones, summaries, completions, mastery, completed, preferences, tutor; its size does not grow when history grows (property test) |
| **Core-only snapshot restoration** | restore ⇒ core/prefs/tutor as snapshotted; the live results record is **unchanged byte-for-byte**; history is not dropped as stale (epoch exemption, STO-90); orphan marking of newer attempts |
| **Missing history** | results key absent ⇒ empty buffer, notice, core byte-identical, XP/ledger/mastery/completed unchanged; restore dialog text says history is absent and does not promise recovery |
| **Corrupt history** | exact bytes quarantined first; empty buffer; quarantine copy listed as a results source, **not** offered as core recovery |
| **Snapshot with no history** | restore of it neither removes nor restores history; `omitted` shown |
| **S1-era snapshot containing history** | restore **merges** the history into the live results record (union); live entries never removed |
| **Separate history backup (when deletion is built, STO-89)** | HB written and read-back verified before deletion; deletion refused if HB fails; HB excluded from composite snapshots and from ordinary backup rotation; HB contains exactly the deleted scope's entries; expiry only per the approved duration; explicit early purge needs a separate confirmation; unknown keys untouched |
| **Interrupted history deletion** | crash/quota/lying write at (a) HB write, (b) results rewrite: history intact+extra HB, or deleted+HB — never partial, never core writes |
| **Recovery without history** | after a core restore with no history source, the app reports "history not recovered" and never "restored"; no XP change |
| **XP and mastery invariance** | for every path above: ledger, XP, tombstones, mastery, completed, completions, summaries byte/deep-equal; `badges()` output unchanged; replay of any resultId from history ⇒ no XP; deleted/restored history never re-enables first-time XP |
| **Reset/start-fresh/restore vs results (STO-90)** | results record content unchanged by these operations (if STO-90 default approved); orphan labelling shown |
| **R1 caveat** | pinned R1 backup equals the S1 core bytes and survives rotation; named in the migration notice |
| **Mutations** | snapshot includes results · snapshot omits the `omitted` marker · restore replaces instead of merges history · results treated as stale on core restore · HB skipped · HB included in rotation · deletion writes the core · deletion proceeds when HB fails ⇒ all killed |

## 9. Update 5 Nov 2026 — design-level tests for STO-90 (design only; no test is written in this task)
| Case | Expected |
|---|---|
| Reset | results key **byte-identical** and **zero writes** to it; history still loads; entries labelled "XP not part of current progress" where applicable; ledger/XP reset exactly as in S1 |
| Start fresh (after an unreadable core) | same; the results record is not quarantined because of core damage |
| Core restore / `restoreFrom` (composite snapshot without history) | results record unchanged; **not** treated as stale despite the epoch bump; entries newer than the restored point labelled |
| `restoreFrom` of a snapshot or S1 core that contains history | history **merged** (union) into the results record; no live entry removed |
| `rollbackToLegacy` / rollback to S1 via R1 | results key not removed; merge on the next S2 load; nothing reduced |
| Epoch change in another tab | other tab's results record is merged, never invalidated; a stale tab can add entries, never overwrite or remove newer ones |
| No automatic deletion | static/behavioural test: no code path removes results entries except the (future, explicit) deletion operation; quota, rotation, migration, stale-epoch cleanup never remove them |
| XP/ledger/mastery/completed/achievements | unchanged by every history operation; replay of history resultIds ⇒ no XP; first-time credit never re-enabled |
| Mutations | stale-epoch rule applied to the results record · reset writes/empties the results key · rollback removes the results key · restore replaces history instead of merging · quota path removes entries ⇒ all killed |

## 10. Additions after the final consistency review (5 Nov 2026; design only — no test is written)
| Case | Expected |
|---|---|
| **Reset-confirmation wording (design §11 N7)** | ru, ky, de strings exist, state that detailed history is retained and can only be deleted separately, and are shown before `reset`; Kyrgyz marked for native review |
| **Results ignore replace mode** | `saveProgress(..., {replace:true})` after reset/start-fresh/restore: results key byte-identical; never overwritten by the in-memory buffer |
| **Zero results writes on replacement** | recording-store: reset, start-fresh, core restore, rollbackToLegacy ⇒ no `setItem`/`removeItem` on the results key (additive merge from a history-bearing restore source is the only exception) |
| **Stale-core tab keeps its attempt** | tab with an old epoch records an attempt after another tab reset: core write rejected (no XP), results entry merged, history label derived from missing tombstone |
| **Results ok / core fails and the reverse** | the four-row table of design §11 N3 (no XP without core; pending queue + notice when results fail; no duplicate on retry) |
| **Core-only restore (R1, layout-1/2 copies)** | restores Core only; current preferences and tutor unchanged (not defaulted); dialog text states it; history merged from R1 |
| **Rollback via R1** | results record kept; R1 history merged; core data after the upgrade reverts; no results key removal |
| **Merge-path prune** | no fold/removal in `recordResult` **or** `mergeActivity` (property test: results count never decreases) |

## 11. After the owner decisions of 5 Nov 2026 (STO-90 extended to Rollback; STO-92 approved) — design-level tests (no test is written)
**Dedicated STO-92 tests required in S2 (owner instruction):**
| Area | Tests |
|---|---|
| **Migration** | S1 profile with history, preferences, tutor → S2 upgrade: results merged, core ledger/progress byte-equal, preferences/tutor untouched; R1 pinned |
| **Restore (core-only copy)** | restore of R1 / a layout-1/2 core copy / quarantined core bytes: **Core replaced; current preferences and tutor byte-equal; not defaulted**; R1's history merged; dialog states "progress only — your settings and tutor chat are kept" (ru/ky/de) |
| **Restore (composite snapshot)** | composite snapshot restores its own exact preferences/tutor (it contains them); history untouched/merged if the snapshot carries it |
| **Rollback** | rollback through R1 and `rollbackToLegacy`: results key never removed or overwritten; R1 history merged; preferences/tutor preserved for R1 rollback; v1 rollback removes only core/prefs/tutor |
| **Regression** | the S1 suites that assumed "restoring a core-only copy writes default preferences/tutor" are updated **with a written reason** (intentional behaviour change); XP/ledger/mastery/completed/achievement fixtures identical |
**Write-combination tests (design §12):** rows 1, 2a, 2b, 3, 4 each with: history entry present/absent as specified; XP only via Core; no duplicate on retry (property: retries never change ledger sum or entry count); notices shown (2b conflict notice, 3/4 history-not-saved notice, 2a/4 save-failed); pagehide flush drains the pending queue; duplicate check uses tombstones only (a history entry without tombstone does not block a legitimate credit); `entry.xp` never read by crediting code (static/mutation test). Mutations: **M-S2-22** results write skipped when the core is rejected · **M-S2-23** XP credited when only the results write succeeded · **M-S2-24** pending entry dropped after one failed retry · **M-S2-25** duplicate check authoritative on results · **M-S2-26** conflict notice removed (silent XP vanish).

## 12. Tests for the owner-accepted decisions of 5 Nov 2026 (design level — none is written)
| Decision | Test | Expected | Mutation (must be killed) |
|---|---|---|---|
| **STO-93 R3** | storage unavailable, entry pending, user tries to dismiss | failure notice stays visible until the failure clears; text warns about loss on closing/reloading; **retry** button present; nothing claims durability | M-S2-32 failure notice dismissible · M-S2-33 warning text missing |
| **STO-94** | dismiss an informational notice, then a new failure / failure-kind change | notice re-armed; same episode stays dismissed | M-S2-27 notice hidden after a prior dismissal |
| **STO-95** | stale-core tab records an attempt after another tab reset | core write rejected (zero core writes); entry merged; notice `replaced` distinguishes "kept in history" from "XP not part of current progress"; ru/ky/de strings exist; `save-failed` and `replaced` are different notices | M-S2-26 notice removed · M-S2-34 conflict treated as a storage failure |
| **STO-96** | results write fails repeatedly; 1 000 pending entries; newer-version results record | nothing discarded; pending count shown; retry drains without duplicates; newer version ⇒ `history-readonly`, record never rewritten, entries kept | M-S2-24 dropped after a retry · M-S2-30 queue capped/dropped · M-S2-35 newer-version record rewritten |
| **STO-97** | pagehide and visibility-hidden with (a) zero study seconds + non-empty queue, (b) unsaved core, (c) unavailable storage | (a),(b) written synchronously; (c) fails silently, no throw; no durability assertion | M-S2-28 flush gated only on study seconds |
| **STO-98** | entry without tombstone; tombstone without entry; replay; history merged from R1/snapshot; retries | credit allowed once / blocked / no-op; history never grants or denies first-time XP; ledger sum constant | M-S2-25 results authoritative · M-S2-36 duplicate check removed entirely |
| **STO-99** | creditStatus for entries within / beyond 400 days, with/without tombstone; `entry.xp` never read by crediting code (static) | credited / not-credited / **no label** beyond the window | M-S2-23 XP from results · M-S2-29 label ignores tombstone expiry |
| **STO-82** | entries with unknown optional fields, missing optional fields, higher `entrySchema`, migrated entries | unknown fields survive sanitisation and rewrite; nothing invented for migrated entries; reader tolerant | M-S2-37 unknown fields dropped · M-S2-38 invented `startedAt`/`levelId` for migrated entries |
| **STO-74 / 77 restriction** | 2 000 recorded attempts, cross-tab merges, restores | no entry folded/removed anywhere; `prunedThrough`/`deletions` never written with a value; summaries identical before/after (no new folding); existing summaries' merge unchanged | M-S2-19 prune still folds in `recordResult`/`mergeActivity` · M-S2-39 watermark written |

## 13. STO-100 (owner-confirmed) and the S2 free-text guard — design-level tests (none is written)
| Decision | Test | Expected | Mutation |
|---|---|---|---|
| STO-100 | for each of `save-failed`, `history-not-saved`, `history-readonly`: failure persists | **no dismiss control**; notice stays until the condition clears; re-appears on every new episode/transition | M-S2-32 failure notice dismissible · M-S2-40 notice not re-shown after the failure clears and recurs |
| STO-100 | informational notices (`repaired`, slice notices, `replaced`) | dismissible; dismissal bound to the episode; a new episode re-arms | M-S2-27 |
| Free-text guard (STO-83/85 deferred) | record an attempt of every kind; scan stored entries and the history API | entries contain **only** the `design §13.8` fields; items only `itemRef`/`outcome`; no answer/prompt/feedback/writing/speaking text is stored or exposed; unknown future fields are preserved but never written by S2 | M-S2-41 S2 writes `given`/`expected`/text · M-S2-42 history API exposes free text |

## 14. Tests for the owner decisions C4 and C5 (5 Nov 2026) — design level, none is written
| Decision | Test | Expected | Mutation |
|---|---|---|---|
| **C4** | record 2 000 attempts across > 400 simulated days; cross-tab merges; restores | no result folded or removed (count never decreases); tombstones older than 400 days **are** expired exactly as before; XP/ledger/credit rules identical to the S1 fixtures; `creditStatus` returns no label beyond the window | M-S2-19 results folding still active · M-S2-43 tombstone expiry disabled or changed · M-S2-44 credit rule changed · M-S2-29 label ignores expiry |
| **C5** | upgrade fails (backup/quota/lying write) ⇒ compat mode; then Reset, Start Fresh, Core Restore, Rollback (each) | each refused **before any write** (zero setItem/removeItem on every key); message in ru/ky/de explains the upgrade must finish first; retry-upgrade offered; all data and history byte-identical | M-S2-45 operation executes partially in compat mode · M-S2-46 refusal only in the UI (layer below still writes) · M-S2-47 history replaced/emptied by compat handling |
| **C5** | upgrade later succeeds | the four operations are available again; embedded history merged (union) into the results record, nothing replaced; `layout 2` verified | M-S2-48 operations stay blocked after success · M-S2-49 R2 replaces instead of merges |
| **C5** | failed upgrade | existing data intact (byte-equal core/prefs/tutor/history), R1 pinned, no unknown key touched | — |
