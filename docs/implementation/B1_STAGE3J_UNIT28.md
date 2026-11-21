# B1 Stage 3J — Unit 28 (Bildung, Lernen und Zukunftspläne): FINAL STATUS

B1 is still `planned`, `releasedLocales: []`, invisible (the German interface never offers B1). No commit or push. No CEFR approval, no native review of the Kyrgyz and no verified audio is claimed. **All schools, courses, universities, people, dates and sums are fictional and labelled so; no text describes the rules of a real education system** (tested: no real institution, exam or programme, no "In Deutschland …", and the word "Zertifikat" is not used anywhere).

## 1. Summary
Unit 28 (`b1-bildung-zukunft`) is complete and wired into the existing B1 content module and metadata. Derived from `B1_CURRICULUM.md` (Unit 28), the v2 approval, `curriculum.ts` and the Unit 21–27 pattern. Most of the curriculum's example words were already taught (Abschluss, Zeugnis, Prüfung, Ausbildung, Praktikum, Entschuldigung, Anmeldung, bestehen …), so they are **reused as revision, not listed as new**. The 20 prepositional verbs are grammar, not vocabulary items.

## 2. Files
**Created:** `src/data/b1/unit28/{unit,vocabulary,grammar,texts,assessment,meta}.ts`; `tests/b1/unit-28.test.ts` (68 tests); `tests/b1/unit-28-integration.test.tsx` (32 tests); this report.
**Modified:** `src/data/b1/b1-content.ts`, `src/data/b1/meta.ts`; expected lists ("Units 21–28", 320 vocabulary words, 8 final tests, 44 review flags, the D-3 flag, the speaking list) in the `b1-infrastructure`, `b1-approval`, `b1-profile`, `unit-21` … `unit-27` tests. **No shared UI or CSS change in this stage** — the unit page's extra-writing row added in Stage 3I already links every micro-task.

## 3. Vocabulary
**40 new** `v28-1…40` (22 nouns, 6 adjectives, 12 verbs): school and study, course and learning, school and Kita (Elternabend, Elterngespräch, Betreuung, Ganztagsschule, Lehrkraft, Warteliste), adjectives, verbs. Wortbildung strand in the metadata. **Revision (not new):** 4 words of Unit 27, 2 of Unit 25, 2 of A2, plus the **Wiederholungsblock** of 22 words of Units 25–27 (curriculum: Units 24, 28, 32), all real ids, tested.

## 4. Grammar (approved allocation, nothing else)
* `b1-futur1-vermutungen` (P-lim/L): Futur I for forecasts and for conjecture with *wohl* on a **closed list of ten infinitives** (sein, haben, kommen, gehen, schaffen, bestehen, lernen, studieren, arbeiten, geben); plans stay in the Präsens. Decision D-3 (fallback receptive only) is open.
* `b1-falls-sobald-solange` (P/L): the three subordinators; `wenn` revised (↻ A2); **`sodass` receptive** (one glossed reading, never required).
* `b1-verben-praepositionen` (P-lim/M): **closed list of 20 pairs** (the six A2 pairs + 14 new; Akkusativ and Dativ grouped) and wo(r)- / da(r)-.
* Not taught (scope-guard test): Futur II, Plusquamperfekt / nachdem, Konjunktiv I, Genitiv attributes, relative clauses with a preposition, any other verb + preposition pair, `damit`, `sodass` as a task item, `ohne … zu`, Futur I with any other infinitive.

## 5. Texts
Readings 155 and 152 words (curriculum 150–190): an invented Auslandsjahr report + school letter; online learning (balanced pros/cons). Listenings 142 and 140 words (curriculum 140–170): a study-advice talk and a call to the Kita; the Kita has **no place free** (the unexpected element), then a solution via the waiting list. Sentences ≤ 25, p95 ≤ 20. Speaking: 6 turns, parent–teacher talk (child ill, question about the exam); in turn 4 the afternoon care place is not available and the hints practise *falls / sobald / Warteliste*. Feedback is checklist + self-assessment, no score.

## 6. Exercises
10 = 4 fill / 4 choice / 2 order: 3 Futur I, 2 falls/sobald/solange, 3 verb + preposition / wo-da (one text-level item), 2 recycled without concept (↻ Infinitiv mit zu Unit 23, ↻ wenn A2 Unit 14).

## 7. Assessment
`unit-28`, 15 questions = 8 grammar (2 Futur I vs Präsens, 2 falls/sobald/solange, 2 verb + preposition with wo-/da-, 2 recycled) / 3 vocabulary / 4 reading / 0 listening. Positions 5/5/5, never three in a row; each answer exactly once; nothing shared with the exercises. Pass mark 70 % (11 of 15), existing rule.

## 8. Writing tasks and how learners reach them
| Task | Type | Min. words | Model | Reached from |
| --- | --- | --- | --- | --- |
| `b1-wr-28-01` Eine Anfrage zu einem Kurs (halbformell) | main; 7 explained items (verb + preposition, falls/sobald, Futur I, polite request …) | 80 | 81 | unit page writing row; Writing Lab |
| `b1-wr-28-02` Meine Meinung: Online lernen | opinion micro-task (curriculum: `meinungMicroTask`) | 30 | 41 | extra row on the unit page; Writing Lab |
| `b1-wr-28-03` Eine Kursinfo weitergeben | **mediation** micro-task (curriculum: `mediationMicroTask`) | 30 | 42 | extra row; Writing Lab |
| `b1-wr-28-04` Eine Entschuldigung an die Schule | apology note (curriculum's micro-task; metadata kind `note`) | 30 | 45 | extra row; Writing Lab |

All four use checklist feedback and self-assessment; no task is omitted (tested: the Writing Lab list holds all four, the unit page shows the main row plus three extra rows). The apology note tells the learner to share only the minimum about the child.

## 9. RU/KY
Independent ru and ky everywhere; parity checked structurally. Kyrgyz describes grammar, no new labels. **The Kyrgyz is an unreviewed AI draft.**

## 10. Browser QA (real Chromium via Playwright, Vite dev server; B1 switched to Beta in the page only). jsdom tests are NOT counted here.
| Flow | ru 1280 | ru 390 | ky 1280 | ky 390 |
| --- | --- | --- | --- | --- |
| All 20 routes (unit, vocabulary, 3 topic + 3 grammar pages, 2 listenings, 2 readings, 4 writing tasks, Writing Lab list, speaking, unit test, review): no "not found", no `undefined`/`NaN`, no overflow | ✔ | ✔ | ✔ | ✔ |
| Unit page: main writing row linked and **each of the 3 extra rows clicked**, landing on writing tasks 02, 03 and 04 | ✔ | ✔ | ✔ | ✔ |
| Writing Lab list shows all four tasks | ✔ | ✔ | ✔ | ✔ |
| Reading ×2: wrong then right, feedback + continue to the end | ✔ | ✔ | ✔ | ✔ |
| Listening ×2: same flow | ✔ | ✔ | ✔ | ✔ |
| Speaking, 6 turns: hints, pick a hint, expected-word coverage, no score bars; ending with disclosure + self-assessment | ✔ | ✔ | ✔ | ✔ |
| Writing ×4: model text ticks every checklist item (8 / 4 / 5 / 5 rows), no score bars or percentages | ✔ | ✔ | ✔ | ✔ |
| Unit test in the real runner, 11/15 → passed | ✔ | ✔ | ✔ | ✔ |

Console errors: none. Horizontal overflow: none. **NOT VERIFIED:** real speech synthesis/microphone, other browsers/devices, screen readers.

## 11–12. Automated results
| Check | Result |
| --- | --- |
| Full test suite | **97 files, 2843 tests passed** |
| `content:validate` | 0 errors, 0 warnings, 44 review flags |
| release gate | 44 errors (expected: B1 not released) |
| typecheck | 0 errors |
| lint | 0 errors, 8 warnings (existing baseline) |
| format:check | clean |
| production build | succeeds |

New review flags: CEFR sign-off of Unit 28 and `b1-expert-review-pending` for open decision **D-3** (Futur I).

**Defects found by the guards while authoring (fixed, none weakened):** a Kyrgyz gloss copied from the Russian; readings and listenings under the curriculum's lengths; a Futur I with *finden* (not on the closed list) in a speaking hint — **caught by the new "Futur I outside the closed list" guard** and rewritten with *geben*; a final-test answer ("Falls") shared with an exercise (→ full-sentence choice item); one Kyrgyz label «кайтарым»; the `sich freuen über` pair missing from the explanation of the 20 pairs. **Heuristic narrowing, with regression:** the Futur-list guard first flagged "… lernen, denn ich brauche Kontakt zu anderen" (clause segment now ends at the comma) and wrongly exempted infinitives starting with ver-/be-/er- (now only `ge-`); the Plusquamperfekt rule was simplified. The regression test feeds genuine out-of-scope German (Futur II, *nachdem*, `er sei`, Genitiv attributes, relative clauses with a preposition, verb + preposition pairs outside the list, `sodass`, `ohne … zu`, Futur I with *verschwinden* / *essen*, real programmes, "In Deutschland …") and proves each is still detected, while *Er wird wohl noch im Kurs sein*, *… wird im nächsten Schuljahr ausgebaut*, *Falls ein Platz frei wird …*, *Sobald ich genug Geld hatte, bin ich … gefahren* are not flagged. A test bug (backslashes lost when patching the test from a script, making a regex match everything) was found and fixed.

## 13. Remaining human review
1. Independent CEFR review of the unit and decision **D-3** (Futur I productive only for forecasts and *wohl* conjecture; fallback receptive only); the extent of the 20-pair list.
2. Native Russian and Kyrgyz review — Futur I and *wohl*, *falls / sobald / solange*, verb + preposition and wo-/da-, education and school/Kita vocabulary.
3. Teacher review of German naturalness (study advice, Kita call, school letter) and a child-data review of the apology note.
4. Real-device TTS check. Owner decision on whether the apology note (curriculum calls it a micro-task) should have its own `MicroTaskKind` instead of `note`.

## 14–16. Confirmations
B1 remains hidden (`planned`, `releasedLocales: []`; German never offered B1). A1/A2 content, Storage/Persistence, approved ids/conventions and Units 21–27 content are untouched (only their tests' expected lists changed). The 15 staged files are unchanged (`git diff --cached --shortstat`: 15 files, 513 insertions, 103 deletions). No commit or push was made.
