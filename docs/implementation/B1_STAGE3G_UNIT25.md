# B1 Stage 3G — Unit 25 (Gesundheit, Beziehungen und Lebensstil): FINAL STATUS

B1 is still `planned`, `releasedLocales: []`, invisible (the German interface never offers B1). No commit or push. No CEFR approval, no native review of the Kyrgyz and no verified audio is claimed. The material is for language learning; it contains no diagnosis or treatment advice.

## 1. Summary
Unit 25 (`b1-gesundheit-lebensstil`) is complete and wired into the existing B1 content module and metadata. No separate blueprint existed; it was derived from `B1_CURRICULUM.md` (Unit 25), the v2 approval, `curriculum.ts` and the Unit 21–24 pattern. The A2 body/illness words (Kopfschmerzen, Fieber, Praxis, Tablette, Stress, sich entspannen …) and, found by the lemma validator, *Vertrauen*, *sich streiten*, *sich erholen*, *ehrlich* were already taught in A1/A2, so they are **reused as revision, not listed as new**.

## 2. Files
**Created:** `src/data/b1/unit25/{unit,vocabulary,grammar,texts,assessment,meta}.ts`; `tests/b1/unit-25.test.ts` (60 tests); `tests/b1/unit-25-integration.test.tsx` (20 tests); this report.
**Modified:** `src/data/b1/b1-content.ts`, `src/data/b1/meta.ts`; expected lists ("Units 21–25", 200 vocabulary words, 5 speaking ids, 38 review flags) in `b1-infrastructure`, `b1-approval`, `b1-profile`, `unit-21`, `unit-21-audit`, `unit-22`, `unit-23`, `unit-24` tests. No shared UI/CSS, A1/A2 content or Storage code was changed.

## 3. Vocabulary
**40 new** `v25-1…40` (22 nouns, 8 adjectives, 10 verbs): health system and doctor, lifestyle, relationships and feelings, verbs. Wortbildung strand (-ung, compound, un-) is explained in the metadata. **Revision (not new):** 4 words of Unit 24, 2 of Unit 22, 3 of A2 Unit 14 — real ids, tested. Required topics `feelings` and `relationships` are evidenced by real item ids.

## 4. Grammar (approved allocation, nothing else)
* `b1-konjunktiv2-ratschlaege` (P/H): würde + Infinitiv, sollte, könnte, hätte, wäre for advice and polite requests; explicit A2 `sollst` vs B1 `solltest` contrast (summary, step, mistake, why-note, test question).
* `b1-reflexive-dativ` (P-lim/M): closed list of **10** expressions (cap 10); exercises/test items stay inside it (tested).
* Not taught (scope-guard test): unreal conditions and wishes (27), Konjunktiv II of the past, Passiv with modal/Präteritum (26), damit, Genitiv, relative clause with preposition, verb + preposition, `ohne/statt … zu`, Passiv Perfekt.

## 5. Texts
Readings 143 and 147 words (curriculum 140–180). Listenings 141 and 132 words (curriculum 130–160). Sentences ≤ 24, p95 ≤ 18. Speaking: 6 turns, quarrel with a friend, the friend rejects the advice in turn 4. Writing: main = mail to a friend with advice (`minWords` 75, model 89, six explained checklist items, ≥ 3 Konjunktiv II forms, one reflexive-Dativ phrase, points to the Hausarzt, tells the learner not to diagnose); plus the opinion micro-task `b1-wr-25-02` (30 words), required because the validator does not accept a micro-task as the main task. It is reachable through the Writing lab list, not from the unit page (shared UI untouched). Feedback is checklist + self-assessment, no score.

## 6. Exercises
10 = 3 fill / 5 choice / 2 order: 4 Konjunktiv II, 4 reflexive Dativ, 2 recycled without concept (A2 Imperativ, Unit 24 Passiv); one text-level item (ex 04).

## 7. Assessment
`unit-25`, 15 questions = 8 grammar (3 Konjunktiv II, 2 reflexive, 3 recycled: A2 `sollen`, A2 Imperativ, Unit 24 Passiv) / 3 vocabulary / 4 reading / 0 listening. Positions 5/5/5, never three in a row; each answer appears exactly once; nothing shared with the exercises. Pass mark 70 % (11 of 15), existing rule.

## 8. RU/KY
Independent ru and ky everywhere; parity checked structurally across all unit data. Kyrgyz describes grammar; for the reflexive verbs it reuses the project's A2 term «өздүк этиштер» and describes the pronoun (glossary), no new labels. **The Kyrgyz is an unreviewed AI draft.**

## 9. Browser QA (real Chromium via Playwright, Vite dev server; B1 switched to Beta in the page only, never in files). jsdom tests are NOT counted here.
| Flow | ru 1280 | ru 390 | ky 1280 | ky 390 |
| --- | --- | --- | --- | --- |
| All 15 routes load (no "not found", no `undefined`/`NaN`, no horizontal overflow) | ✔ | ✔ | ✔ | ✔ |
| Reading ×2: open questions, answer wrong then right, feedback + continue to the end | ✔ | ✔ | ✔ | ✔ |
| Listening ×2: open questions, answer wrong then right, feedback + continue to the end | ✔ | ✔ | ✔ | ✔ |
| Speaking, 6 turns: hints, pick a hint, expected-word coverage, no score bars | ✔ | ✔ | ✔ | ✔ |
| Speaking ending: disclosure + self-assessment checklist, no score, no percentages | ✔ | ✔ | ✔ | ✔ |
| Writing, both tasks: model text ticks all 7 / 4 checklist items, explanations in the learner's language, no score bars or percentages | ✔ | ✔ | ✔ | ✔ |
| Unit test played in the real runner (11/15 = 73 %) → passed | ✔ | ✔ | ✔ | ✔ |

* Console errors: none in any run. Horizontal overflow: none.
* NOT VERIFIED: real speech synthesis/microphone, other browsers/devices, screen readers.

## 10–11. Automated results
| Check | Result |
| --- | --- |
| Full test suite | **91 files, 2565 tests passed** |
| `content:validate` | 0 errors, 0 warnings, 38 review flags |
| release gate | 44 errors (expected: B1 not released) |
| typecheck | 0 errors |
| lint | 0 errors, 8 warnings (existing baseline) |
| format:check | clean |
| production build | succeeds |

Defects found by guards while authoring (fixed, none weakened): *Vertrauen* already A2 (→ Eifersucht); `ky` copy of `ru` in a gloss; two over-short Kyrgyz glosses; readings first under the curriculum's 140 words; a hint ("ich hätte gern früher angerufen") and a clause ("Wenn ihr … wollt, wäre …") that blurred Units 27/31 and were rewritten; `ohne` in the micro-task model; the Kyrgyz label «кайтарым этиш» (replaced by the A2 term). Test heuristics were narrowed only for real false positives (greeting commas, `mit dem … zu` infinitive clauses, JS `\b` with umlauts).

## 12. Remaining human review
1. Independent CEFR review of the unit (flag `cefr-signoff-missing units:25`); no expert decision (⚑) is attached to Unit 25.
2. Native Russian and Kyrgyz review — especially Konjunktiv II explanation, «өздүк этиштер», health and relationship vocabulary.
3. Teacher review of German naturalness (doctor consultation, podcast, forum text) and a health-content review so that nothing reads as medical advice.
4. Real-device TTS check; (browser QA of all listed flows is complete).
5. Owner decision on the micro-task being listed only in the Writing lab.

## 13–15. Confirmations
B1 remains hidden. A1/A2 content, Storage/Persistence, approved ids/conventions and Units 21–24 content are untouched (only their tests' expected lists changed). `git diff --cached --shortstat`: still 15 files, 513 insertions, 103 deletions. No commit or push was made.
