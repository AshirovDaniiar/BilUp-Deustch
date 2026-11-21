# B1 Stage 3H — Unit 26 (Medien, Technik und Nachrichten): FINAL STATUS

B1 is still `planned`, `releasedLocales: []`, invisible (the German interface never offers B1). No commit or push. No CEFR approval, no native review of the Kyrgyz and no verified audio is claimed. **Every news item, film, place and person in the unit is fictional** and labelled as such; nothing reports a real event or makes a claim about a real person (tested).

## 1. Summary
Unit 26 (`b1-medien-technik`) is complete and wired into the existing B1 content module and metadata. Derived from `B1_CURRICULUM.md` (Unit 26), the v2 approval, `curriculum.ts` and the Unit 21–25 pattern. The A2 media words (Nachricht, Zeitung, Internet, Handy, App, Fernseher, Foto, herunterladen, Reparatur, Verbindung …) and Unit 25 *empfehlen* were already taught, so they are **reused as revision, not listed as new** (the lemma validator rejected *herunterladen*, *teilen*, *reparieren* and others during selection).

## 2. Files
**Created:** `src/data/b1/unit26/{unit,vocabulary,grammar,texts,assessment,meta}.ts`; `tests/b1/unit-26.test.ts` (64 tests); `tests/b1/unit-26-integration.test.tsx` (22 tests); this report.
**Modified:** `src/data/b1/b1-content.ts`, `src/data/b1/meta.ts`; expected lists ("Units 21–26", 240 vocabulary words, 6 speaking ids, 40 review flags, the new D-1 flag) in the `b1-infrastructure`, `b1-approval`, `b1-profile`, `unit-21` … `unit-25` tests. No shared UI/CSS, A1/A2 content or Storage code was changed.

## 3. Vocabulary
**40 new** `v26-1…40` (22 nouns, 8 adjectives, 10 verbs): news and sources, data and technology, book and film, adjectives, verbs. Wortbildung strand (-ung, -er, compounds, un-) is explained in the metadata. **Revision (not new):** 4 words of Unit 25, 2 of Unit 23, 4 of A2 Unit 16 — real ids, tested. Topic `book-film` is evidenced by real item ids.

## 4. Grammar (approved allocation, nothing else)
* `b1-passiv-praeteritum-modal` (P/M): **productive** Passiv Präsens with a modal verb (*muss repariert werden*); **limited** Passiv Präteritum (*wurde veröffentlicht*) on a closed list: veröffentlichen, gründen, bauen, erfinden, eröffnen, absagen (tested for every sentence of the unit).
* `b1-lassen` (P-lim/L): closed list of 6 expressions (tested); **`sich lassen` receptive**, in one glossed reading (decision D-1 open).
* `b1-wiedergeben-indikativ` (P/M): *sagt/schreibt, dass*, *fragte, ob*, *Es heißt, dass*, *laut* + Dativ, pronoun shift; Indicative only, no Konjunktiv I.
* **Receptive without concept:** Partizip I as adjective (*die steigenden Besucherzahlen*), one glossed reading.
* Not taught (scope-guard test): unreal conditions/wishes (27), Konjunktiv II of the past, Konjunktiv I, Passiv Perfekt, Genitiv, relative clause with preposition, verb + preposition, damit, `ohne/statt … zu`.

## 5. Texts
Readings 147 and 144 words (curriculum 140–180): a fictional news item with a reader comment (fact / rumour / opinion), a fictional film recommendation. Listenings 122 and 132 words (curriculum 120–150): short radio news (listening strategy "numbers and names") and a phone-shop dialogue (Handy reparieren lassen, Datenschutz). Sentences ≤ 24, p95 ≤ 18. Speaking: 6 turns, recommend a fictional film; in turn 4 the friend quotes "Im Netz heißt es …" and the learner must separate opinion from fact. Writing: main comment (`minWords` 80, model 87, six explained items, balanced advantage/disadvantage, modal Passiv, lassen, source), plus **two micro-tasks** required by the curriculum: opinion `b1-wr-26-02` and **mediation** `b1-wr-26-03` (relay a fictional shop message; partial coverage, no competence claim). Feedback is checklist + self-assessment, no score. The micro-tasks are reachable from the Writing lab list (the unit page links only the first task).

## 6. Exercises
10 = 4 fill / 4 choice / 2 order: 3 Passiv, 2 lassen, 3 Wiedergeben, 2 recycled without concept (↻ Relativsatz Unit 23, ↻ Passiv Präsens Unit 24); one text-level item (ex 08).

## 7. Assessment
`unit-26`, 15 questions = 8 grammar (2 Passiv, 2 lassen, 2 Wiedergeben, 2 recycled) / 3 vocabulary / 4 reading / 0 listening. Positions 5/5/5, never three in a row; each answer appears exactly once; nothing shared with the exercises. One reading item tests fact vs opinion. Pass mark 70 % (11 of 15), existing rule.

## 8. RU/KY
Independent ru and ky everywhere; parity checked structurally. Kyrgyz describes grammar, no new labels. **The Kyrgyz is an unreviewed AI draft.**

## 9. Browser QA (real Chromium via Playwright, Vite dev server; B1 switched to Beta in the page only). jsdom tests are NOT counted here.
| Flow | ru 1280 | ru 390 | ky 1280 | ky 390 |
| --- | --- | --- | --- | --- |
| All 18 routes load (unit, vocabulary, 3 topic + 3 grammar pages, 2 listenings, 2 readings, 3 writing tasks, speaking, unit test, review): no "not found", no `undefined`/`NaN`, no overflow | ✔ | ✔ | ✔ | ✔ |
| Reading ×2: open questions, answer wrong then right, feedback + continue to the end | ✔ | ✔ | ✔ | ✔ |
| Listening ×2: same flow | ✔ | ✔ | ✔ | ✔ |
| Speaking, 6 turns: hints, pick a hint, expected-word coverage, no score bars | ✔ | ✔ | ✔ | ✔ |
| Speaking ending: disclosure + self-assessment, no percentages | ✔ | ✔ | ✔ | ✔ |
| Writing ×3: model text ticks every checklist item (7 / 4 / 5 shown), no score bars or percentages | ✔ | ✔ | ✔ | ✔ |
| Unit test in the real runner, 11/15 → passed | ✔ | ✔ | ✔ | ✔ |

Console errors: none. Horizontal overflow: none. **NOT VERIFIED:** real speech synthesis/microphone, other browsers/devices, screen readers.

## 10–11. Automated results
| Check | Result |
| --- | --- |
| Full test suite | **93 files, 2652 tests passed** |
| `content:validate` | 0 errors, 0 warnings, 40 review flags |
| release gate | 44 errors (expected: B1 not released) |
| typecheck | 0 errors |
| lint | 0 errors, 8 warnings (existing baseline) |
| format:check | clean |
| production build | succeeds |

New review flags: CEFR sign-off of Unit 26 and `b1-expert-review-pending` for open decision **D-1** (`lassen`); earlier tests were adjusted to expect exactly these.

Defects found by the guards while authoring (fixed, none weakened): vocabulary already taught in A2; readings and one listening under the curriculum length; Russian titles in Latin script; two Kyrgyz glosses too short/long; the dialogue words *ohne* and a passive with a non-listed verb; a Kyrgyz label «кайтарым». **Heuristic narrowing, with regression:** the scope guard's relative-clause and Konjunktiv-II-past patterns were first narrowed (Unit 25); in this unit I added a regression test that feeds genuine out-of-scope German (damit, Passiv Perfekt, `er sei`, unreal condition/wish, Konjunktiv II past, Genitiv, relative clause with preposition/Dativ, verb + preposition, `ohne … zu`, `lässt sich lösen`) and proves each is still detected. That test found a real hole (conjugated *warte auf* was not caught), which I fixed by extending the verb + preposition rule. The receptive forms of `sich lassen` were narrowed to `lässt/lassen sich lösen/erklären` because the productive `sich die Haare schneiden lassen` contains the same words.

## 12. Remaining human review
1. Independent CEFR review of the unit and decision **D-1** (`lassen`/`sich lassen`); also the placement of limited Passiv Präteritum and Partizip I as receptive.
2. Native Russian and Kyrgyz review — Passiv, `lassen`, reporting (dass/ob), media vocabulary.
3. Teacher review of German naturalness and a media-literacy review so the fictional items and fact/opinion exercises are appropriate.
4. Real-device TTS check; owner decision on the micro-tasks being listed only in the Writing lab.

## 13–15. Confirmations
B1 remains hidden (`planned`, `releasedLocales: []`; German never offered B1). A1/A2 content, Storage/Persistence, approved ids/conventions and Units 21–25 content are untouched (only their tests' expected lists changed). The 15 staged files are unchanged (`git diff --cached --shortstat`: 15 files, 513 insertions, 103 deletions). No commit or push was made.
