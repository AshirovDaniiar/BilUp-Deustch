# B1 Stage 3L — Unit 30 (Gesellschaft, Zusammenleben und Engagement): FINAL STATUS

B1 is still `planned`, `releasedLocales: []`, invisible (the German interface never offers B1). No commit or push. No CEFR approval, no native review of the Kyrgyz and no verified audio is claimed. **All associations, neighbourhoods, projects and people are fictional and labelled so.** A contested community question (a courtyard project) is shown with both views (supporter and sceptic) and a neutral committee; opinions are always a named person's view ("Ich finde", "Manche Nachbarn …"); no stereotype about a generation or group, no politics, no real organisation (tested, with regression samples).
Per the project strategy no separate review was started: all open review items are recorded in section 13 for the final B1 review after Unit 32.

## 1. Summary
Unit 30 (`b1-gesellschaft-engagement`) is complete and wired into the existing B1 content module and metadata, derived from the curriculum, the v2 approval, `curriculum.ts` and the Unit 21–29 pattern. The society words of Unit 22 (Gesellschaft, Mehrheit, Minderheit, Vorurteil, gerecht, diskutieren, unterstützen) and the A2/B1 words Verein, Nachbarschaft, Spielplatz, Verantwortung, Veranstaltung, abstimmen, vorschlagen, hilfsbereit are **reused as revision, not listed as new**. The 20 Nomen-Verb-Verbindungen are grammar, not vocabulary items.

## 2. Files
**Created:** `src/data/b1/unit30/{unit,vocabulary,grammar,texts,assessment,meta}.ts`; `tests/b1/unit-30.test.ts` (70 tests); `tests/b1/unit-30-integration.test.tsx` (29 tests); this report.
**Modified:** `src/data/b1/b1-content.ts`, `src/data/b1/meta.ts`; **one field in Unit 28's metadata** (`src/data/b1/unit28/meta.ts`: `receptiveThrough: 29` on the receptive `sodass`, because `sodass` becomes productive in Unit 30 — the same mechanism as `statt … zu` in Unit 23; no learner content of Unit 28 changed); expected lists ("Units 21–30", 400 vocabulary words, final tests, speaking list, 49 review flags, the D-8 flag) in the `b1-infrastructure`, `b1-approval`, `b1-profile`, `unit-21-audit`, `unit-21` … `unit-29` tests. **No shared UI or CSS change.**

## 3. Vocabulary
**40 new** `v30-1…40` (23 nouns, 7 verbs, 10 adjectives): Ehrenamt und Verein (Ehrenamt, Mitglied, Vorstand, Spende, Initiative, Engagement, Versammlung, Treffpunkt, Stadtteil, Anwohner, Nachbarschaftshilfe), Zusammenleben (Gemeinschaft, Vielfalt, Toleranz, Solidarität, Zusammenhalt, Integration, Gleichberechtigung, Generation, Familienmodell, Rücksicht, Beitrag, Unterstützung), verbs (sich engagieren, spenden, sich beteiligen, integrieren, gründen, mitmachen, akzeptieren), Personenbeschreibung (ehrenamtlich, freiwillig, sozial, tolerant, aufgeschlossen, großzügig, humorvoll, schüchtern, schlank, kräftig). Wortbildung strand (compounds, -schaft, -ung, -lich). **Revision (not new):** 4 words of Unit 29, 2 of Unit 27, 2 of A2, all real ids, tested.

## 4. Grammar (approved allocation, nothing else)
* `b1-nomen-verb-verbindungen` (M, **P-lim**; decision **D-8 open**, fallback receptive only): a **closed list of 20** (eine Entscheidung treffen, Kontakt aufnehmen, Verantwortung übernehmen, einen Beitrag leisten, zur Verfügung stehen/stellen, Bescheid geben, Interesse zeigen …), cap 20, declared in the metadata and explained in ru/ky.
* `b1-konsekutiv-final` (M, **P**): `sodass`, `so … dass` (result), `damit` (other subject) versus `um … zu` (same subject), `weil` versus `sodass`. `sodass` is productive from here (receptive in Unit 28).
* `b1-textkohaesion` (L, **P-lim**): closed list erstens, **zweitens**, außerdem, darüber hinaus, dennoch, daher, zum Beispiel (the six of the curriculum plus the necessary pair *zweitens*; the reviewer may remove it), position 1 + verb.
* Not taught (scope-guard test): other text connectors (allerdings, jedoch, somit, folglich, demnach, hingegen, zudem …), other noun-verb pairs, Genitiv attributes (none used), `ohne … zu`, Passiv Perfekt, Konjunktiv II of the past, Futur II, Konjunktiv I, Genitiv relative pronouns.

## 5. Texts
Readings 187 and 192 words (curriculum 180–220): an invented report on a neighbourhood association; two letters to the editor with different views on one project. Listenings 170 and 165 words (160–190): an interview with the head of an association; a residents' meeting (objection → vote → review in three months). Sentences ≤ 26, p95 ≤ 20. Speaking: 7 turns, a short structured talk (Einleitung – two points – Schluss); in turn 4 a listener objects ("Ist das nicht zu teuer?") — the unexpected element, answered respectfully; turn 6 a sceptical neighbour's view. Feedback is checklist + self-assessment, no score.

## 6. Exercises
10 = 4 fill / 4 choice / 2 order: 3 Nomen-Verb-Verbindungen, 3 damit / um … zu / sodass / so … dass, 2 text-structuring words, 2 recycled without concept (↻ obwohl, Unit 22; ↻ Passiv Präsens, Unit 24). The purpose gap deliberately does not offer `sodass` as a distractor (it would also be grammatical).

## 7. Assessment
`unit-30`, 15 questions = 8 grammar (um … zu; Folge so … dass; Gliederungswort daher; logical order of a three-sentence text; two noun-verb pairs; ↻ trotzdem; ↻ Passiv) / 3 vocabulary / 4 reading / 0 listening. Positions 5/5/5, never three in a row; each answer exactly once; nothing shared with the exercises. Pass mark 70 % (11 of 15), existing rule.

## 8. Writing tasks and how learners reach them
| Task | Type | Min. words | Model | Reached from |
| --- | --- | --- | --- | --- |
| `b1-wr-30-01` Ein Leserbrief zu einem Nachbarschaftsprojekt | main; 7 explained items — separate items for erstens/zweitens, außerdem/darüber hinaus, zum Beispiel, dennoch (other view), daher + a noun-verb pair; goal with damit/um … zu | 90 | 92 | unit page writing row; Writing Lab |
| `b1-wr-30-02` Meine Meinung: Sollte man sich ehrenamtlich engagieren? | opinion micro-task (curriculum `meinungMicroTask`), with another view | 30 | 37 | extra row on the unit page; Writing Lab |
| `b1-wr-30-03` Eine Nachricht an die Nachbarn: Wir suchen Freiwillige | micro-task of kind `note` (invitation to a local project; participation voluntary) | 40 | 44 | extra row; Writing Lab |

All use checklist feedback and self-assessment; no task is omitted (tested; browser-verified). The "at least four Gliederungswörter" of the curriculum is covered by four separate checklist items plus a test that the model uses ≥ 4 different ones.

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
| Writing ×3: model text ticks every checklist item (8 / 4 / 5 rows), no score bars or percentages | ✔ | ✔ | ✔ | ✔ |
| Unit test in the real runner, 11/15 → passed | ✔ | ✔ | ✔ | ✔ |

Console errors: none. Horizontal overflow: none. **NOT VERIFIED:** real speech synthesis/microphone, other browsers/devices, screen readers.

## 11–12. Automated results
| Check | Result |
| --- | --- |
| Full test suite | **101 files, 3044 tests passed** |
| `content:validate` | 0 errors, 0 warnings, 49 review flags |
| release gate | 44 errors (expected: B1 not released) |
| typecheck | 0 errors |
| lint | 0 errors, 8 warnings (existing baseline) |
| format:check | clean |
| production build | succeeds |

New review flags: CEFR sign-off of Unit 30 and `b1-expert-review-pending` for **D-8** (Nomen-Verb-Verbindungen).

**Defects found while authoring (fixed, none weakened):** a Genitiv attribute ("Die Vielfalt der Menschen …") in a vocabulary example — caught by the new Genitiv guard and rewritten; `sodass` was still declared receptive for the whole level, so its first productive use would have been rejected by the validator (fixed with `receptiveThrough: 29`, test added); a Kyrgyz vocabulary translation equal to the Russian; readings, listenings and the model below the curriculum lengths; a Konjunktiv I in a speaking prompt ("sei") and an ungrammatical "so viele Freiwillige …, sodass" (both rewritten); Latin letters inside Kyrgyz words; a purpose gap whose distractor `sodass` would also have been grammatical (replaced). **Heuristic narrowing, with regression:** the Futur-II guard now also recognises be-/ver-/er-/ent- participles; the "outside the closed list" guard for noun-verb pairs recognises inflected forms ("nimmt Abschied"); the passage-copy check slides over 40-character chunks; each is proven by positive and negative regression samples. The regression tests feed genuine out-of-scope German (Passiv Perfekt, Futur II, Konjunktiv I and II of the past, Genitiv attributes and relative pronouns, `ohne … zu`, Doppelkonnektoren, allerdings/somit, noun-verb pairs outside the list, "so … sodass", "um die Kinder … zu", verb-second after `damit`, "Daher wir …", parties, real organisations, claims about a country, stereotypes about groups) and prove each is still detected, while the correct forms (e.g. "Es war so laut, dass …", "…, sodass das Fest ein Erfolg wird", "Wegen der Verspätung …") are not flagged.

## 13. Remaining human review (recorded for the final B1 review after Unit 32)
1. Independent CEFR review of the unit and decision **D-8** (Nomen-Verb-Verbindungen P-lim, 20 pairs; fallback receptive only) and of the extent/choice of the 20 pairs; whether `zweitens` belongs in the closed text-connector list.
2. Review of the `sodass` change of status (receptive in Unit 28, productive in Unit 30) across Units 28–30.
3. Native Russian and Kyrgyz review — Nomen-Verb-Verbindungen, `damit`/`um … zu`/`sodass`, text-structuring words, society and volunteering vocabulary, Personenbeschreibung.
4. Teacher/intercultural review of balance and inclusiveness (courtyard debate, the volunteering interview, personal descriptions) and of German naturalness.
5. Real-device TTS check. Owner decision whether the neighbours' message should get its own `MicroTaskKind` instead of `note`.

## 14–16. Confirmations
B1 remains hidden (`planned`, `releasedLocales: []`; German never offered B1). A1/A2 content, Storage/Persistence, approved ids/conventions and Units 21–29 learner content are untouched (only their tests' expected lists and the single `receptiveThrough` field of Unit 28's metadata changed). The 15 staged files are unchanged (`git diff --cached --shortstat`: 15 files, 513 insertions, 103 deletions). No commit or push was made.
