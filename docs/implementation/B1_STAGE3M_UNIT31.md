# B1 Stage 3M — Unit 31 (Behörden, Verträge und Alltagsprobleme): FINAL STATUS

B1 is still `planned`, `releasedLocales: []`, invisible (the German interface never offers B1). No commit or push. No CEFR approval, no native review of the Kyrgyz and no verified audio is claimed. **All offices, providers, police stations, people, file numbers, deadlines, fees and contract terms are fictional. Every deadline and contract condition is attributed to the fictional document or scenario ("laut diesem Schreiben", "laut diesen Vertragsbedingungen", "Diese Frist gilt nur für dieses Schreiben", "Beispielvertrag"); nothing is German law and nothing is legal advice** (tested, with regression samples).
Per the project strategy no separate review was started: all open review items are recorded in section 13 for the final B1 review after Unit 32.

## 1. Summary
Unit 31 (`b1-behoerden-recht`) is complete and wired into the existing B1 content module and metadata, derived from the curriculum, the v2 approval, `curriculum.ts` and the Unit 21–30 pattern. The administrative words already taught (Amt, Antrag, Formular, Frist, Unterlagen, Widerspruch, Vertrag, Kündigung, Anzeige, Termin, Gebühr, einreichen, verlängern, vereinbaren …) are **reused as revision, not listed as new**.

## 2. Files
**Created:** `src/data/b1/unit31/{unit,vocabulary,grammar,texts,assessment,meta}.ts`; `tests/b1/unit-31.test.ts` (69 tests); `tests/b1/unit-31-integration.test.tsx` (32 tests); this report.
**Modified:** `src/data/b1/b1-content.ts`, `src/data/b1/meta.ts`; expected lists ("Units 21–31", 440 vocabulary words, final tests, speaking list, 51 review flags, the D-8 flag for the Zustandspassiv) in the `b1-infrastructure`, `b1-approval`, `b1-profile`, `unit-21-audit`, `unit-21` … `unit-30` tests. **No shared UI or CSS change and no change to Units 21–30 content or metadata.**

## 3. Vocabulary
**40 new** `v31-1…40` (25 nouns, 10 verbs, 5 adjectives): Behörde und Verfahren (Behörde, Bescheid, Zuständigkeit, Sachbearbeiter, Aktenzeichen, Bestätigung, Nachweis, Vollmacht, Genehmigung, Rückfrage, Ansprechpartner, Anlage, Betreff), Vertrag und Anbieter (Laufzeit, Vertragsbedingung, Anbieter, Tarif, Mahnung, Zahlungsfrist, Anliegen), Schaden und Polizei (Schaden, Versicherung, Polizei, Zeuge, Diebstahl, melden), formal verbs (beantragen, mitteilen, nachreichen, bearbeiten, genehmigen, bestätigen, beachten, einhalten, vorlegen) and adjectives (zuständig, vollständig, unvollständig, verbindlich, erforderlich). Wortbildung strand (compounds, -er, -ung, -ig/-lich, un-). **Revision (not new):** 4 words of Unit 30, 2 of Unit 28, 2 of A2 Unit 19, all real ids, tested. No review block (curriculum: Units 24, 28, 32).

## 4. Grammar (approved allocation, nothing else)
* `b1-formelle-sprache` (L, **P**): Anrede and Gruß, three request patterns (*Ich bitte um …*, *Ich möchte Sie bitten, … zu …*, *Könnten Sie mir bitte mitteilen, …* — Konjunktiv-II politeness ↻ Units 25/27), formal verbs, choice of register (no mixing of Sie and du).
* `b1-aktiv-passiv-zustandspassiv` (M, **P**; decision **D-8 open**, fallback receptive only): Aktiv ↔ Passiv (Präsens and with a modal verb), Vorgangspassiv (*wird gerade bearbeitet*) versus Zustandspassiv (*ist geprüft*) — the Zustandspassiv **only with a closed list of ten participles**: ausgefüllt, unterschrieben, geschlossen, geöffnet, bearbeitet, erledigt, genehmigt, abgelehnt, geprüft, eingereicht.
* **Receptive only (no concept):** the Konjunktiv II der Vergangenheit (*Ich hätte früher nachfragen sollen*) — in ONE glossed reading, never required in a gap, order item, checklist or speaking hint (declared in `receptiveOnly`; the writing tip says it need not be written).
* Not taught (scope-guard test): Passiv Perfekt (`worden`), Futur II, Konjunktiv I, Genitiv attributes, `ohne … zu`, Doppelkonnektoren, Nomen-Verb-Verbindungen beyond Unit 30 (*Widerspruch einlegen*, *Antrag stellen*), the Mittelfeld rules of Unit 32, law, legal advice, real authorities/companies/emergency numbers.

## 5. Texts
Readings 155 and 150 words (curriculum 130–170, band minimum 150): a letter from an office with an enclosed form; a contract enquiry with the provider's answer. Listenings 144 and 141 words (140–170): a phone call to an office (status → missing document → deadline → written confirmation); a theft reported to the police (the officer sends the caller to her insurance "nach ihren eigenen Regeln" — no legal advice). Sentences ≤ 26, p95 ≤ 20. Speaking: 7 turns, a phone call to the fictional Bürgeramt; in turn 4 a document is missing (the unexpected element, answered calmly); turn 5 the deadline is "laut unserem Schreiben" and "gilt nur für dieses Schreiben". Feedback is checklist + self-assessment, no score.

## 6. Exercises
10 = 4 fill / 4 choice / 2 order: 4 formal language, 4 Aktiv/Passiv/Zustandspassiv, 2 recycled without concept (↻ Konjunktiv II, Units 25/27; ↻ Passiv Präsens, Unit 24). Every `werden`/`sein` gap carries a clear cue (*gerade*; *Die Tür ist zu*; plural subject), so exactly one filler is correct.

## 7. Assessment
`unit-31`, 15 questions = 8 grammar (register; Gruß; *bitten um*; Aktiv→Passiv; Vorgang; Zustand; ↻ Konjunktiv II; ↻ Passiv with a modal verb) / 3 vocabulary / 4 reading (find the missing document and the deadline "laut diesem Schreiben", the condition "laut diesen Vertragsbedingungen", the contact person) / 0 listening. Positions 5/5/5, never three in a row; each answer exactly once; nothing shared with the exercises. Pass mark 70 % (11 of 15), existing rule.

## 8. Writing tasks and how learners reach them
| Task | Type | Min. words | Model | Reached from |
| --- | --- | --- | --- | --- |
| `b1-wr-31-01` Eine formelle Anfrage an einen Anbieter oder ein Amt | main, **formal**; 6 explained items (Anrede/Gruß, Anlass, höfliche Bitte, Passiv/Zustand, Frist/Vertrag with source, Dank) | 70 | 71 | unit page writing row; Writing Lab |
| `b1-wr-31-02` Ein Behördenschreiben weitergeben | **mediation** micro-task (curriculum `mediationMicroTask`): relay the office letter in own words, informal, with the source | 30 | 40 | extra row on the unit page; Writing Lab |
| `b1-wr-31-03` Meine Meinung: Brief oder E-Mail an ein Amt? | opinion micro-task (curriculum `meinungMicroTask`), with another view and a pointer to ask the office | 30 | 39 | extra row; Writing Lab |
| `b1-wr-31-04` Ein verpasster Termin: eine formelle Nachricht | micro-task of kind `note`, formal; no health details | 30 | 43 | extra row; Writing Lab |

All use checklist feedback and self-assessment; no task is omitted (tested; browser-verified: main row + three extra rows + four Writing Lab entries). The curriculum's alternative "oder Widerspruch" is not authored: *Widerspruch einlegen* is a noun-verb pair outside the Unit 30 list, so the main task is an enquiry.

## 9. RU/KY
Independent ru and ky everywhere; parity checked structurally; Kyrgyz describes grammar, no new labels. **The Kyrgyz is an unreviewed AI draft.**

## 10. Browser QA (real Chromium via Playwright, Vite dev server; B1 switched to Beta in the page only). jsdom tests are NOT counted.
| Flow | ru 1280 | ru 390 | ky 1280 | ky 390 |
| --- | --- | --- | --- | --- |
| All 18 routes (unit, vocabulary, 2 topic + 2 grammar pages, 2 listenings, 2 readings, 4 writing tasks, Writing Lab list, speaking, unit test, review): no "not found", no `undefined`/`NaN`, no overflow | ✔ | ✔ | ✔ | ✔ |
| Unit page: main writing row linked and **all three extra rows clicked**, landing on tasks 02, 03 and 04 | ✔ | ✔ | ✔ | ✔ |
| Writing Lab list shows all four tasks | ✔ | ✔ | ✔ | ✔ |
| Reading ×2 (3 questions each): wrong then right, feedback + continue | ✔ | ✔ | ✔ | ✔ |
| Listening ×2 (4 questions each): same flow | ✔ | ✔ | ✔ | ✔ |
| Speaking, 7 turns: hints, expected words, no score bars; ending with disclosure + self-assessment | ✔ | ✔ | ✔ | ✔ |
| Writing ×4: model text ticks every checklist item (7 / 5 / 4 / 5 rows), no score bars or percentages | ✔ | ✔ | ✔ | ✔ |
| Unit test in the real runner, 11/15 → passed | ✔ | ✔ | ✔ | ✔ |

Console errors: none. Horizontal overflow: none. **NOT VERIFIED:** real speech synthesis/microphone, other browsers/devices, screen readers.

## 11–12. Automated results
| Check | Result |
| --- | --- |
| Full test suite | **103 files, 3145 tests passed** |
| `content:validate` | 0 errors, 0 warnings, 51 review flags |
| release gate | 44 errors (expected: B1 not released) |
| typecheck | 0 errors |
| lint | 0 errors, 8 warnings (existing baseline) |
| format:check | clean |
| production build | succeeds |

New review flags: CEFR sign-off of Unit 31 and `b1-expert-review-pending` for **D-8** (Zustandspassiv). The receptive Konjunktiv II der Vergangenheit raises no unexpected validator issue.

**Defects found while authoring (fixed, none weakened):** the new guards caught genuine **Genitiv attributes** four times — "das Datum Ihres Schreibens", "Ende der Laufzeit", "den Stand seines Antrags" (a correct answer option of a listening question) and the earlier vocabulary example "Internetseite des Amtes" — and a **Zustandspassiv outside the closed list** ("Dann ist alles geklärt" in a speaking hint); a Passiv Perfekt ("gestohlen worden") in the police dialogue (rewritten in the Aktiv); a Kyrgyz gloss copied from the Russian; a Russian title without Cyrillic; short Kyrgyz vocabulary translations; texts below the curriculum lengths; a repeated passage between a final-test reading and a unit reading. **Heuristic narrowing, with regression:** the Zustandspassiv guard first flagged "Was ist passiert?" (a Perfekt of a sein verb → `passiert` etc. are now exempt), the Genitiv guard flagged "Wird der Antrag bald genehmigt?" (sentence-initial finite verbs are now exempt), and the Futur-II and Zustandspassiv regexes now use Unicode letters so umlaut participles (*bestätigt*, *ausgefüllt*) are recognised. The regression tests feed genuine out-of-scope German (Passiv Perfekt, Futur II, Konjunktiv I, Konjunktiv II of the past outside its one reading, Genitiv attributes and relative pronouns, `ohne … zu`, *Widerspruch einlegen*, *Antrag stellen*, *Ihre Zahlung ist bestätigt*, Sie/du mixing, "nach dem Gesetz", "Sie haben das Recht", a real company, an emergency number, a claim about a country) and prove each is still detected, while the correct forms (e.g. "Das Formular ist ausgefüllt und unterschrieben", "Wir sind angekommen", "Hallo Mira, kannst du mir helfen?") are not flagged.

## 13. Remaining human review (recorded for the final B1 review after Unit 32)
1. Independent CEFR review of the unit and decision **D-8** (Zustandspassiv limited-productive on ten participles; fallback receptive only); of the receptive status of the Konjunktiv II der Vergangenheit (decision D-4); and of Passiv Perfekt remaining receptive (D-5).
2. **Legal/administrative review** of the fictional scenarios: that no sentence can be read as a rule of German administration, law or consumer rights, and that the attribution formulas ("laut diesem Schreiben", "Beispielvertrag") are clear enough for learners.
3. Native Russian and Kyrgyz review — formal register, Passiv and Zustandspassiv, administrative and contract vocabulary, police scene.
4. Teacher review of German naturalness (office letter, contract mail, police dialogue) and of the sensitivity of the theft scene.
5. Real-device TTS check. Owner decision whether the formal note should get its own `MicroTaskKind` instead of `note`, and whether a *Widerspruch* task should be added after a decision on the noun-verb list.

## 14–16. Confirmations
B1 remains hidden (`planned`, `releasedLocales: []`; German never offered B1). A1/A2 content, Storage/Persistence, approved ids/conventions and Units 21–30 learner content and metadata are untouched (only their tests' expected lists changed). The 15 staged files are unchanged (`git diff --cached --shortstat`: 15 files, 513 insertions, 103 deletions). No commit or push was made.
