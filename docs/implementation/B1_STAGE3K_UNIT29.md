# B1 Stage 3K — Unit 29 (Reisen, Kultur und Alltag im Vergleich): FINAL STATUS

B1 is still `planned`, `releasedLocales: []`, invisible (the German interface never offers B1). No commit or push. No CEFR approval, no native review of the Kyrgyz and no verified audio is claimed. **All travellers, hotels, railway companies and people are fictional and labelled so. Every custom or everyday difference is presented as a personal impression of a named fictional person ("nur mein Eindruck, keine Regel für alle"); no text generalises about a nationality or describes the rules of a real country or operator** (tested, with regression samples).

## 1. Summary
Unit 29 (`b1-reisen-kultur`) is complete and wired into the existing B1 content module and metadata, derived from the curriculum, the v2 approval, `curriculum.ts` and the Unit 21–28 pattern. The established travel words of A2 Unit 18 and of Units 10, 11, 16, 20, 21 and 27 (Unterkunft, Sehenswürdigkeit, Verspätung, Heimat, Missverständnis, Erstattung …) are **reused as revision, not listed as new**.

## 2. Files
**Created:** `src/data/b1/unit29/{unit,vocabulary,grammar,texts,assessment,meta}.ts`; `tests/b1/unit-29.test.ts` (73 tests); `tests/b1/unit-29-integration.test.tsx` (29 tests); this report.
**Modified:** `src/data/b1/b1-content.ts`, `src/data/b1/meta.ts`; expected lists ("Units 21–29", 360 vocabulary words, final tests, speaking list, 47 review flags, the two new expert-review flags) in the `b1-infrastructure`, `b1-approval`, `b1-profile`, `unit-21-audit`, `unit-21` … `unit-28` tests. **No shared UI or CSS change** — the extra-writing rows of Stage 3I already link every micro-task.

## 3. Vocabulary
**40 new** `v29-1…40` (26 nouns, 8 verbs, 6 adjectives): breakdown and complaint (Reisepanne, Entschädigung, Beschwerde, Anschluss, Zugausfall, Rezeption, ausfallen, sich verspäten, übernachten, sich beschweren), travel forms (Pauschalreise, Rundreise, Reiseführer, Tourismus, Reiseziel), culture and everyday life (Kultur, Brauch, Tradition, Gastfreundschaft, Höflichkeit, Pünktlichkeit, Kulturschock, Redewendung, Gastgeber), comparison and impression (Unterschied, Gemeinsamkeit, Alltag, Erwartung, Eindruck, sich anpassen, sich eingewöhnen, auffallen, überraschen, gastfreundlich, ungewohnt, vertraut, unterschiedlich, typisch, zurückhaltend). Wortbildung strand (compounds, -keit, -schaft, un-). **Revision (not new):** 4 words of Unit 28, 2 of Unit 26, 2 of A2 Unit 18, all real ids, tested. No review block (curriculum: Units 24, 28, 32).

## 4. Grammar (approved allocation, nothing else)
* `b1-relativsaetze-dativ-praeposition` (M, **P**): Dativ (dem, der, denen) and preposition + relative pronoun (in der, mit dem, bei denen, auf den, in das); builds on Unit 23.
* `b1-genitivattribute` (M, **R** — the conservative, enforced classification; decision **D-7 open**): recognised in the readings (glossed) and the grammar page, recognition (choice) items only; spoken alternative `von + Dativ`. **Never required** in a gap, word order, writing checklist/model, speaking hint, listening script or vocabulary example (tested).
* `b1-plusquamperfekt-nachdem` (M, **P**; decision **D-6 open**, fallback receptive first): hatte / war + Partizip II, `nachdem` + Plusquamperfekt with a Perfekt (or Unit 21 closed-list Präteritum) main clause.
* Not taught (scope-guard test): Genitiv relative pronouns, `wo`/`was` relatives, `damit`, `sodass`, Passiv Perfekt, Futur II, Konjunktiv I and II of the past, `nachdem` + Perfekt, Präteritum outside the Unit 21 list after `nachdem`.
* Note: the curriculum text lists "Relativsatz + Genitivattribut" for the writing task; because the concept is enforced as receptive the Genitiv is **not required** in it (the tips say it need not be written).

## 5. Texts
Readings 172 and 172 words (curriculum 170–210): an invented experience report ("Mein erstes Jahr in Leipzig"); an invented hotel review and a notice of a cancelled train. Listenings 153 and 158 words (150–180): hotel reception (the booked room is unavailable — the unexpected element — then a solution and a compensation); an interview on two everyday lives with a misunderstanding story. Sentences ≤ 25, p95 ≤ 20. Speaking: 7 turns, a cancelled train; in turn 4 compensation is **only available online** (unexpected); turn 6 compares travelling habits as a personal impression. Comparison strand (im Vergleich zu, im Gegensatz zu, dagegen) present in texts and tested.

## 6. Exercises
10 = 4 fill / 4 choice / 2 order: 4 relative clauses, 3 Plusquamperfekt / nachdem, 1 Genitiv recognition (choice only), 2 recycled without concept (↻ Präteritum Unit 21; ↻ relative clause Nom/Akk Unit 23).

## 7. Assessment
`unit-29`, 15 questions = 8 grammar (2 relative pronoun after a preposition, 2 Plusquamperfekt form/sequence, 2 Genitiv recognition without a gap, ↻ Präteritum, ↻ relative Nom/Akk) / 3 vocabulary / 4 reading / 0 listening. Positions 5/5/5, never three in a row; each answer exactly once; nothing shared with the exercises. Pass mark 70 % (11 of 15), existing rule. The Plusquamperfekt gap names the tense in its prompt (a Perfekt form would also be possible after `nachdem` in Unit 21).

## 8. Writing tasks and how learners reach them
| Task | Type | Min. words | Model | Reached from |
| --- | --- | --- | --- | --- |
| `b1-wr-29-01` Ein Reisebericht: Meine schönste Reise | main; 7 explained items (relative clause with preposition, Plusquamperfekt, nachdem, comparison, personal impression, recommendation …) | 85 | 90 | unit page writing row; Writing Lab |
| `b1-wr-29-02` Meine Meinung: Pauschalreise oder selbst planen? | opinion micro-task (curriculum `meinungMicroTask`), opinion + reason + comparison | 30 | 39 | extra row on the unit page; Writing Lab |
| `b1-wr-29-03` Eine sachliche Hotelbewertung | micro-task of kind `note` (factual hotel review with a polite compensation request) | 40 | 42 | extra row; Writing Lab |

All use checklist feedback and self-assessment; no task is omitted (tested; browser-verified). The curriculum's alternative "Hotelbewertung" is covered by task 03.

## 9. RU/KY
Independent ru and ky everywhere; parity checked structurally; Kyrgyz describes grammar, no new labels. **The Kyrgyz is an unreviewed AI draft.**

## 10. Browser QA (real Chromium via Playwright, Vite dev server; B1 switched to Beta in the page only). jsdom tests are NOT counted.
| Flow | ru 1280 | ru 390 | ky 1280 | ky 390 |
| --- | --- | --- | --- | --- |
| All 17 routes (unit, vocabulary, 3 topic + 3 grammar pages, 2 listenings, 2 readings, 3 writing tasks, Writing Lab list, speaking, unit test, review): no "not found", no `undefined`/`NaN`, no overflow | ✔ | ✔ | ✔ | ✔ |
| Unit page: main writing row linked and **both extra rows clicked**, landing on tasks 02 and 03 | ✔ | ✔ | ✔ | ✔ |
| Writing Lab list shows all three tasks | ✔ | ✔ | ✔ | ✔ |
| Reading ×2 (3 questions each): wrong then right, feedback + continue | ✔ | ✔ | ✔ | ✔ |
| Listening ×2 (4 questions each): same flow | ✔ | ✔ | ✔ | ✔ |
| Speaking, 7 turns: hints, expected words, no score bars; ending with disclosure + self-assessment | ✔ | ✔ | ✔ | ✔ |
| Writing ×3: model text ticks every checklist item (8 / 4 / 4 rows), no score bars or percentages | ✔ | ✔ | ✔ | ✔ |
| Unit test in the real runner, 11/15 → passed | ✔ | ✔ | ✔ | ✔ |

Console errors: none. Horizontal overflow: none. **NOT VERIFIED:** real speech synthesis/microphone, other browsers/devices, screen readers.

## 11–12. Automated results
| Check | Result |
| --- | --- |
| Full test suite | **99 files, 2945 tests passed** |
| `content:validate` | 0 errors, 0 warnings, 47 review flags |
| release gate | 44 errors (expected: B1 not released) |
| typecheck | 0 errors |
| lint | 0 errors, 8 warnings (existing baseline) |
| format:check | clean |
| production build | succeeds |

New review flags: CEFR sign-off of Unit 29, `b1-expert-review-pending` for **D-7** (Genitivattribut) and **D-6** (Plusquamperfekt / nachdem).

**Defects found while authoring (fixed, none weakened):** Genitiv attributes in two vocabulary examples (removed, since the concept is receptive); a copied Kyrgyz gloss ×2; a quoted German example missing in Kyrgyz; short Kyrgyz vocabulary translations; reading 2, listening 1 and the main model below the curriculum lengths; Präteritum forms outside the Unit 21 list in grammar texts; an answer shared between an exercise and the final test; a Latin letter inside a Kyrgyz word. **Heuristic narrowing, with regression:** the Genitiv guard flagged "Wegen der Verspätung …" (a Unit 27 Genitiv *preposition*, not an attribute) — `Wegen/Trotz/Während/Statt` are now exempt, and the regression test proves real attributes (des Landes, meiner Eltern, des Hotels, der Stadt, eines Freundes) are still detected while "Wegen der Verspätung …" is not; the `nachdem` guard skips gap prompts but a regression sample (`Nachdem wir angekommen sind, …`, `…waren, suchten wir …`) is still detected; the "taught text" filter now excludes only the *wrong* mistake forms.

## 13. Remaining human review
1. Independent CEFR review of the unit and decisions **D-6** (Plusquamperfekt + nachdem productive; fallback receptive first) and **D-7** (Genitivattribut receptive; a closed productive set is the pending upgrade).
2. Native Russian and Kyrgyz review (relative clauses, Plusquamperfekt, Genitiv explanation, culture and travel vocabulary).
3. Intercultural/teacher review of the texts for balance and stereotyping, and of German naturalness.
4. Real-device TTS check. Owner decision whether the hotel review should get its own `MicroTaskKind` instead of `note`.

## 14–16. Confirmations
B1 remains hidden (`planned`, `releasedLocales: []`; German never offered B1). A1/A2 content, Storage/Persistence, approved ids/conventions and Units 21–28 content are untouched (only their tests' expected lists changed). The 15 staged files are unchanged (`git diff --cached --shortstat`: 15 files, 513 insertions, 103 deletions). No commit or push was made.
