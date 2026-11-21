# B1 Stage 3I — Unit 27 (Konsum, Geld und Reklamation): FINAL STATUS

B1 is still `planned`, `releasedLocales: []`, invisible (the German interface never offers B1). No commit or push. No CEFR approval, no native review of the Kyrgyz and no verified audio is claimed. **All shops, products, people, order numbers and sums are fictional and labelled so; shop rules in the texts ("Umtausch nur vierzehn Tage") belong to the fictional shop and are not statements of consumer law; nothing is legal advice** (tested).

## 1. Summary
Unit 27 (`b1-konsum-reklamation`) is complete and wired into the existing B1 content module and metadata. Derived from `B1_CURRICULUM.md` (Unit 27), the v2 approval, `curriculum.ts` and the Unit 21–26 pattern. Most of the curriculum's example words were already taught (Angebot, Rechnung, Konto, Überweisung, Vertrag, kündigen, umtauschen …), so they are **reused as revision, not listed as new**. `Kredit` is receptive per the curriculum: one glossed reading, never a vocabulary item or a task word.

## 2. Files
**Created:** `src/data/b1/unit27/{unit,vocabulary,grammar,texts,assessment,meta}.ts`; `tests/b1/unit-27.test.ts` (65 tests); `tests/b1/unit-27-integration.test.tsx` (26 tests); this report.
**Modified:**
* `src/data/b1/b1-content.ts`, `src/data/b1/meta.ts` (Unit 27 added).
* **`src/data/b1/unit23/meta.ts`: one field.** The Unit 23 receptive construction `statt … zu` gets `receptiveThrough: 26` (the mechanism the metadata types provide for a receptive form that becomes productive later). Without it the validator rightly refuses `statt` in Unit 27's production items, where it is now the Genitiv preposition. Unit 23's content is unchanged; `ohne` stays receptive for the whole level.
* **`src/screens/UnitScreen.tsx` (shared UI, additive and minimal):** the unit page showed only the first writing task, so the required micro-tasks of Units 24–27 were reachable only from the Writing Lab. Tasks beyond the first now get an extra row (`data-testid="extra-writing"`) under the section list. Units with one writing task (all of A1/A2) render exactly as before (tested for an A1 unit). No CSS change.
* Expected lists ("Units 21–27", 280 vocabulary words, 7 final tests, 42 review flags, the D-7 flag) in the `b1-infrastructure`, `b1-approval`, `b1-profile`, `unit-21` … `unit-26` tests.

## 3. Vocabulary
**40 new** `v27-1…40` (23 nouns, 6 adjectives, 11 verbs): complaint and return, bank and payment, shopping and budget, adjectives, verbs. Wortbildung strand (-ung, -er, compounds, zurück-) is in the metadata. **Revision (not new):** 4 words of Unit 26, 2 of Unit 24, 3 of A2 (Units 15 and 19) — real ids, tested. Topic `money-banking` is evidenced by real item ids.

## 4. Grammar (approved allocation, nothing else)
* `b1-konjunktiv2-wuensche-irreal` (P/H): wishes (*Ich wünschte, ich hätte …*), unreal conditions of the present (*Wenn ich mehr Geld hätte, würde ich …*), polite requests (*Könnten Sie …? Würden Sie …? Ich würde gern …*, replacing the A2 chunk *hätte gern*).
* `b1-genitiv-praepositionen` (P-lim/M): closed list **wegen, trotz, während, statt** + Genitiv (des/der/eines/einer, -s/-es). Decision D-7 (productive use unconfirmed) is open.
* Not taught (scope-guard test): Konjunktiv II of the past, `als ob`, Konjunktiv I, **Genitiv attributes (Unit 29)**, `statt … zu`, wegen + Dativ, other Genitiv prepositions, relative clauses with a preposition, verb + preposition, damit, `ohne … zu`, legal vocabulary.

## 5. Texts
Readings 145 and 137 words (curriculum 130–170): a customer review + complaint letter (kept as labelled sections), a monthly-budget blog. Listenings 133 and 141 words (curriculum 130–160): customer-service call and bank call; in both the other side first refuses, then a solution is found. Sentences ≤ 25, p95 ≤ 20. Speaking: 6 turns, complain and negotiate; the seller refuses in turn 4 (fictional shop rule) and the hints practise polite insisting (*Trotz der Frist …*, *Könnten Sie das bitte noch einmal prüfen?*). Feedback is checklist + self-assessment, no score.

## 6. Exercises
10 = 4 fill / 4 choice / 2 order: 4 Konjunktiv II, 4 Genitiv, 2 recycled without concept (↻ Konjunktiv II advice Unit 25, ↻ Passiv with modal Unit 26); one text-level item (ex 04).

## 7. Assessment
`unit-27`, 15 questions = 8 grammar (3 Konjunktiv II: unreal condition, politeness register, … ; 3 Genitiv forms: plural *der*, masculine *des … -s*, neuter *-s*; 2 recycled: Unit 25 advice, Unit 24 Passiv) / 3 vocabulary / 4 reading / 0 listening. Positions 5/5/5, never three in a row; each answer exactly once; nothing shared with the exercises. Pass mark 70 % (11 of 15), existing rule.

## 8. Writing tasks and how learners reach them
| Task | Type | Min. words | Model | Reached from |
| --- | --- | --- | --- | --- |
| `b1-wr-27-01` Eine Reklamation (formell) | main, formal; Konjunktiv II + Genitiv preposition, solution and deadline, 7 explained items | 80 | 83 | unit page writing row; Writing Lab list |
| `b1-wr-27-02` Meine Meinung: Lohnt sich der Kauf? | opinion micro-task (curriculum: `meinungMicroTask`) | 30 | 42 | **extra row on the unit page** (new); Writing Lab list |

The curriculum requires no mediation task for Unit 27 (tested: `mediationMicroTask: false`). Both tasks use checklist feedback and self-assessment; the first states that it is a learning letter and not a legal document.

## 9. RU/KY
Independent ru and ky everywhere; parity checked structurally. Kyrgyz describes grammar, no new labels. **The Kyrgyz is an unreviewed AI draft.**

## 10. Browser QA (real Chromium via Playwright, Vite dev server; B1 switched to Beta in the page only). jsdom tests are NOT counted here.
| Flow | ru 1280 | ru 390 | ky 1280 | ky 390 |
| --- | --- | --- | --- | --- |
| All 16 routes (unit, vocabulary, 2 topic + 2 grammar pages, 2 listenings, 2 readings, both writing tasks, Writing Lab list, speaking, unit test, review): no "not found", no `undefined`/`NaN`, no overflow | ✔ | ✔ | ✔ | ✔ |
| Unit page: both writing tasks linked; clicking the extra row opens the micro-task | ✔ | ✔ | ✔ | ✔ |
| Writing Lab list shows both tasks | ✔ | ✔ | ✔ | ✔ |
| Reading ×2: wrong then right, feedback + continue to the end | ✔ | ✔ | ✔ | ✔ |
| Listening ×2: same flow | ✔ | ✔ | ✔ | ✔ |
| Speaking, 6 turns: hints, pick a hint, expected-word coverage, no score bars; ending with disclosure + self-assessment | ✔ | ✔ | ✔ | ✔ |
| Writing `b1-wr-27-01` (8 checklist rows) and `b1-wr-27-02` (4 rows): model text ticks every item, no score bars or percentages | ✔ | ✔ | ✔ | ✔ |
| Unit test in the real runner, 11/15 → passed | ✔ | ✔ | ✔ | ✔ |

Console errors: none. Horizontal overflow: none. **NOT VERIFIED:** real speech synthesis/microphone, other browsers/devices, screen readers.

## 11–12. Automated results
| Check | Result |
| --- | --- |
| Full test suite | **95 files, 2743 tests passed** |
| `content:validate` | 0 errors, 0 warnings, 42 review flags |
| release gate | 44 errors (expected: B1 not released) |
| typecheck | 0 errors |
| lint | 0 errors, 8 warnings (existing baseline) |
| format:check | clean |
| production build | succeeds |

New review flags: CEFR sign-off of Unit 27 and `b1-expert-review-pending` for open decision **D-7** (Genitiv prepositions).

**Defects found by guards while authoring (fixed, none weakened):** vocabulary already taught; readings under the curriculum's 130 words; `ohne` in a dialogue; `statt` refused by the validator (→ `receptiveThrough`); colloquial *würde* inside a *wenn* clause in three texts (the unit teaches *hätte/wäre/könnte* there); a past-tense wish-form; Kyrgyz glosses too short; a gift-voucher gloss containing the word "сертификат" tripped the no-certificate guard. **The new Genitiv-attribute guard caught four genuine out-of-scope phrases in my own material** (*am Ende des Monats*, *Nachricht der Bank*, *Erstattung des Betrags*, *Rechnung der Bank*), all rewritten. **Heuristic narrowing with regression:** the attribute rule ignores capitalised articles, prepositions and function words; the regression test feeds *Die Qualität des Produkts*, *Der Preis der Rechnung*, `statt zu`, `wegen dem`, `innerhalb`, `als ob`, `er sei`, Konjunktiv II of the past, `ohne … zu`, a relative clause with a preposition, legal wording and more, and proves each is still detected, while *Wegen des Defekts*, *Trotz der Versandkosten*, *Bei der Bank* and *Es wäre gut, mit dem Hausarzt zu sprechen* are not flagged.

## 13. Remaining human review
1. Independent CEFR review of the unit and decision **D-7** (productive Genitiv prepositions, fallback receptive-only); the whole Konjunktiv II system.
2. Native Russian and Kyrgyz review — Konjunktiv II for wishes/conditions, Genitiv, and the banking and consumer vocabulary.
3. Teacher review of German naturalness and a consumer-education review confirming the fictional shop rules cannot be read as legal statements.
4. Real-device TTS check. Owner confirmation of the two small shared changes (`receptiveThrough` in Unit 23 metadata; the extra writing row in `UnitScreen`).

## 14–16. Confirmations
B1 remains hidden (`planned`, `releasedLocales: []`; German never offered B1). A1/A2 content, Storage/Persistence, approved ids/conventions and Units 21–26 content are untouched (the only edits outside Unit 27 are the two listed above and the tests' expected lists). The 15 staged files are unchanged (`git diff --cached --shortstat`: 15 files, 513 insertions, 103 deletions). No commit or push was made.
