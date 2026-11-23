# BilUp B1 — Grammar Content Implementation Report

Status: implemented, **uncommitted** (nothing was committed or pushed).
Scope: Grammar section of the 36 new B1 Units (ids 301–336).

## 1. Result

All 36 new B1 Units now open a real Grammar lesson (no placeholder, no heading-only entry). Each Unit has **exactly one** lesson; no lesson is shared between Units.
Every lesson has 8 German examples (each with Russian and Kyrgyz), 4 rules/formation notes, 4 mistakes with corrections, 2 real-life sentences, a 4-line dialogue, a speaking prompt, a "discover" question, a "why it matters" note and **8 practice questions** (fill / choice / order, 3-option answers rotated through all positions, each with an explanatory `why` in Russian and Kyrgyz).

## 2. Preservation (unchanged)

* The 29 legacy B1 lessons (units 21–32), their exercises, ids and progress keys are untouched; the legacy Units 21–32 stay hidden-but-addressable (`/learn/unit/21` still works).
* New lessons are **separate records** with new ids (`b1-…`), new exercise ids (`b1-ex-3NN-NN`) and `unit = 300 + n`. A legacy lesson is only *read* (`grammar-v2/legacy.ts`).
* A1, A2, homepage / journey and shared storage were not changed.
* Legacy-unit references inside reused text ("в юните 22", "(22-бөлүм)") were removed by the builder because they do not apply to the new Unit.

## 3. Mapping: reused, enriched, new

* **Enriched** = the existing legacy lesson (explanation, rules, examples, mistakes, dialogue, exercises, RU **and** KY as authored) is the basis of a separate new record, extended with extra examples, rules and exercises up to the 8 + 8 target.
* **New** = a separate lesson written for that Unit (Russian and Kyrgyz written independently). Where the approved plan named a related legacy lesson (319, 320, 322, 325, 331, 333, 336), it served as a content reference only; its text was not copied into a legacy-derived record.

| Unit | Topic | Lesson id | Origin | Examples | Questions |
|---|---|---|---|---|---|
| 301 | Präteritum: regelmäßige und unregelmäßige Verben | `b1-praeteritum-regelmaessig-unregelmaessig` | New | 8 | 8 |
| 302 | Plusquamperfekt | `b1-plusquamperfekt` | New | 8 | 8 |
| 303 | Zeitformen im Vergleich | `b1-zeitformen-im-vergleich` | New | 8 | 8 |
| 304 | Futur I: Vermutungen und Prognosen | `b1-futur-1-vermutungen-prognosen` | New | 8 | 8 |
| 305 | Verben mit Präpositionen: Vertiefung | `b1-verben-mit-praepositionen-vertiefung` | New | 8 | 8 |
| 306 | Funktionsverbgefüge: Grundlagen | `b1-funktionsverbgefuege-grundlagen` | New | 8 | 8 |
| 307 | Temporalsätze mit bevor und nachdem | `b1-temporalsaetze-bevor-nachdem` | New | 8 | 8 |
| 308 | Nebensätze mit obwohl | `b1-nebensaetze-mit-obwohl` | New | 8 | 8 |
| 309 | Nebensätze mit während | `b1-nebensaetze-mit-waehrend` | New | 8 | 8 |
| 310 | Nebensätze mit seitdem und bis | `b1-nebensaetze-mit-seitdem-und-bis` | New | 8 | 8 |
| 311 | Infinitivkonstruktionen mit zu | `b1-infinitivkonstruktionen-mit-zu` | New | 8 | 8 |
| 312 | Um … zu und damit | `b1-um-zu-und-damit` | New | 8 | 8 |
| 313 | Zweiteilige Konnektoren | `b1-zweiteilige-konnektoren` | Enriched from `b1-doppelkonnektoren` | 8 | 8 |
| 314 | Erweiterte Satzverbindungen | `b1-erweiterte-satzverbindungen` | Enriched from `b1-textkohaesion` | 8 | 8 |
| 315 | Relativsätze im Dativ | `b1-relativsaetze-im-dativ` | New | 8 | 8 |
| 316 | Relativsätze mit Präpositionen | `b1-relativsaetze-mit-praepositionen` | New | 8 | 8 |
| 317 | Relativsätze mit was und wo | `b1-relativsaetze-mit-was-und-wo` | New | 8 | 8 |
| 318 | Passiv Präsens | `b1-passiv-praesens-grundlagen` | Enriched from `b1-passiv-praesens` | 8 | 8 |
| 319 | Passiv Präteritum | `b1-passiv-praeteritum` | New | 8 | 8 |
| 320 | Zustandspassiv | `b1-zustandspassiv` | New | 8 | 8 |
| 321 | Konjunktiv II: Wünsche und irreale Situationen | `b1-konjunktiv-2-wuensche-irreale-situationen` | Enriched from `b1-konjunktiv2-wuensche-irreal` | 8 | 8 |
| 322 | Konjunktiv II: Ratschläge und Bedingungen | `b1-konjunktiv-2-ratschlaege-bedingungen` | New | 8 | 8 |
| 323 | Indirekte Rede: Grundlagen | `b1-indirekte-rede-grundlagen` | Enriched from `b1-wiedergeben-indikativ` | 8 | 8 |
| 324 | Konjunktiv I: Einführung | `b1-konjunktiv-1-einfuehrung` | New | 8 | 8 |
| 325 | Genitiv und Genitivpräpositionen | `b1-genitiv-und-genitivpraepositionen` | New | 8 | 8 |
| 326 | Adjektivdeklination: Vertiefung | `b1-adjektivdeklination-vertiefung` | Enriched from `b1-adjektive-dativ-genitiv` | 8 | 8 |
| 327 | N-Deklination: Vertiefung | `b1-n-deklination-vertiefung` | New | 8 | 8 |
| 328 | Partizip I und II als Adjektive | `b1-partizip-1-und-2-als-adjektive` | New | 8 | 8 |
| 329 | Wortstellung im Mittelfeld | `b1-wortstellung-im-mittelfeld` | Enriched from `b1-satzbau-mittelfeld` | 8 | 8 |
| 330 | Nominalisierung: Grundlagen | `b1-nominalisierung-grundlagen` | New | 8 | 8 |
| 331 | Verbalstil und Nominalstil: Einführung | `b1-verbalstil-und-nominalstil-einfuehrung` | New | 8 | 8 |
| 332 | Konzessive Konnektoren | `b1-konzessive-konnektoren` | Enriched from `b1-konzessive-saetze` | 8 | 8 |
| 333 | Konsekutive Konnektoren | `b1-konsekutive-konnektoren` | New | 8 | 8 |
| 334 | Finale Konnektoren | `b1-finale-konnektoren` | New | 8 | 8 |
| 335 | Präpositionen mit Genitiv | `b1-praepositionen-mit-genitiv` | Enriched from `b1-genitiv-praepositionen` | 8 | 8 |
| 336 | Präpositionaladverbien: Vertiefung | `b1-praepositionaladverbien-vertiefung` | New | 8 | 8 |

Totals: 10 enriched, 26 new, 36 lessons, 288 examples, 288 practice questions.
Distinctions kept as required: 308/309/310 (one subordinator each), 312 vs 334 vs 333 (purpose vs consequence), 321 vs 322, 325 vs 335, 305 vs 336, 318/319/320, 323 vs 324.

## 4. Localization

* Russian and Kyrgyz are written independently for every title, summary, rule, example, mistake note, dialogue line, speaking prompt and exercise explanation; the validator rejects Kyrgyz that is a copy of Russian (`l10n-ky-equals-ru`) and reports 0 such cases.
* Several Kyrgyz phrases were corrected during the work (e.g. unit 5 reflexive-pronoun phrase, clause terms aligned to the project glossary: «кошумча бөлүк» / «башкы бөлүк», Relativsatz kept as the German term; invented labels such as «жакталган», «салыштырма сүйлөм» removed).
* All new text is an AI draft marked `kind: authored` and **pending native-speaker (Kyrgyz and Russian) and independent CEFR review**; this is stated in each lesson's `source`. German UI shows German titles only where the UI already did so.

## 5. Quality notes / open review items

* Unit 324 (Konjunktiv I) is intentionally receptive/introductory; the CEFR heuristic raises 4 B2 **review flags** for it (not errors or warnings). Baselines in `tests/content-validate/b1-profile.test.ts` were updated to include them. A CEFR reviewer should confirm the placement.
* Unit 319 / 320 / 331 sentences should be checked by a German expert for register.
* The authored-order of choice answers is varied across the three positions (checked by a test).

## 6. Verification (all run on the final state)

| Check | Result |
|---|---|
| `npx tsc --noEmit` | clean |
| `npm run lint` | 0 errors (8 pre-existing a11y warnings in unrelated files) |
| `npm run content:validate` | 0 errors, 0 warnings, 95 review flags (all human sign-off / decision flags; 4 new Konjunktiv I flags) |
| Full test suite (`vitest run`) | 119 files / 3,390 tests passed before the new test file; new `tests/b1/grammar-v2.test.ts` (4 tests) passes |
| `npm run build` | succeeds |
| Browser QA (Playwright, dev server) | see section 7 |

Tests changed: `tests/data/b1-curriculum.test.ts`, `tests/b1/b1-curriculum-ui.test.tsx` (lesson-aware expectations), `tests/b1/level-b1.test.ts` (legacy-only concept count), `tests/content-validate/fixtures.ts` (`withoutB1Content` also excludes units 301–336), `tests/content-validate/b1-profile.test.ts` (Konjunktiv I review flags). Added: `tests/b1/grammar-v2.test.ts`.

## 7. Browser QA

Playwright against the dev server, for each of the 36 Units: the Unit page shows a grammar link, the lesson opens with `?unit=<id>`, no horizontal overflow, no `undefined` / `NaN`, no "not found".

| Language | 390 px | 1280 px |
|---|---|---|
| Russian | 36 / 36 OK | 36 / 36 OK |
| Kyrgyz | 36 / 36 OK | 36 / 36 OK |

Also verified: legacy `/learn/unit/21` and the legacy lesson `/learn/topic/b1-konzessive-saetze` still open unchanged; the new lesson opens in unit context with a back arrow; the homepage loads. German UI was not swept (B1 is released for ru/ky only; the German UI shows "not found" for B1 by design). Not done in the browser: completing every lesson end-to-end (covered by the jsdom tests for unit-context completion keys).

## 8. Code map

* `src/data/b1/grammar-v2/builder.ts` — authoring helper (`lesson`, `enrich`, legacy-reference cleaning).
* `lessons-01…07.ts` — 26 new lessons; `derived-01…04.ts` — 10 enriched lessons; `legacy.ts` — read-only legacy access; `index.ts` — assembly (`B1_V2_GRAMMAR`, `B1_V2_EXERCISES`, `B1_V2_LESSON_OF_UNIT`, `B1_V2_ORIGIN`).
* `src/data/b1/b1-content.ts` and `src/data/b1/curriculum.ts` attach the lessons to the Units by id (`grammarIds`).
