# BilUp Til B1 — Curriculum Structure Report (36 units × 8 sections)

> **Structure only.** No educational content was created, mapped or migrated. The 36 new B1 units are empty containers; the twelve existing B1 units (ids 21–32) are hidden legacy content, untouched. B1's access, availability and release status (Beta for ru + ky) are unchanged.

## 1. What was built (same architecture as A1 and A2)

* **Shared builder:** `buildCurriculum` in `src/data/curriculum.ts` (the one used for A1 and A2). One optional parameter was added (`topicByTitle`) so a unit can carry its approved grammar topic as metadata.
* **B1 table:** `src/data/b1/curriculum.ts` holds the 36 titles with their grammar topics, builds the units with ids `300 + position` and keeps the twelve authored units as hidden legacy. It lives in the lazy B1 chunk (the entry bundle still holds no B1 content).
* **Registry:** B1 gets the extra id range `[301, 336]` (`extraUnitIdRanges`), exactly like A1 (`102–138`) and A2 (`201–243`). The legacy range `21–32` is unchanged. A test checks that no existing unit uses an id in 301–336.
* **Catalog:** `B1_CONTENT.units` is now the 36 listed units and `B1_CONTENT.legacyUnits` the twelve hidden ones; `registerLevelContent` adds both to `allUnits`, so every legacy unit is still addressable by id (`/learn/unit/21` … `/learn/unit/32`) and keeps all its routes.
* **Type:** `LearningUnit.grammarTopic?: string` — planning metadata; never a lesson, never in `grammarIds`.
* **Screens:** none changed. The empty-unit behaviour (placeholder, no statistics, never "current") is the behaviour already built for A1/A2.

## 2. The 36 new units (ids, titles, grammar topics)

| № | Unit id | Unit title | Grammar topic (metadata only) |
|---:|---:|---|---|
| 01 | 301 | Geschichten und Erlebnisse erzählen | Präteritum: regelmäßige und unregelmäßige Verben |
| 02 | 302 | Was vorher passiert war | Plusquamperfekt |
| 03 | 303 | Vergangenheit, Gegenwart und Zukunft | Zeitformen im Vergleich |
| 04 | 304 | Wie wird die Zukunft aussehen? | Futur I: Vermutungen und Prognosen |
| 05 | 305 | Beziehungen und Gespräche | Verben mit Präpositionen: Vertiefung |
| 06 | 306 | Arbeit, Alltag und Entscheidungen | Funktionsverbgefüge: Grundlagen |
| 07 | 307 | Was mache ich vorher und nachher? | Temporalsätze mit bevor und nachdem |
| 08 | 308 | Schwierigkeiten und Herausforderungen | Nebensätze mit obwohl |
| 09 | 309 | Zwei Dinge gleichzeitig | Nebensätze mit während |
| 10 | 310 | Veränderungen im Leben | Nebensätze mit seitdem und bis |
| 11 | 311 | Pläne, Ziele und Möglichkeiten | Infinitivkonstruktionen mit zu |
| 12 | 312 | Ziele erreichen und Wünsche verwirklichen | Um … zu und damit |
| 13 | 313 | Verschiedene Möglichkeiten verbinden | Zweiteilige Konnektoren |
| 14 | 314 | Komplexe Gedanken ausdrücken | Erweiterte Satzverbindungen |
| 15 | 315 | Menschen, denen ich begegne | Relativsätze im Dativ |
| 16 | 316 | Menschen und Dinge, über die ich spreche | Relativsätze mit Präpositionen |
| 17 | 317 | Alles, was mir wichtig ist | Relativsätze mit was und wo |
| 18 | 318 | Wie werden Produkte hergestellt? | Passiv Präsens |
| 19 | 319 | Wie wurde früher gearbeitet? | Passiv Präteritum |
| 20 | 320 | Wie sieht die Welt heute aus? | Zustandspassiv |
| 21 | 321 | Wenn ich die Möglichkeit hätte … | Konjunktiv II: Wünsche und irreale Situationen |
| 22 | 322 | Was würde ich an deiner Stelle tun? | Konjunktiv II: Ratschläge und Bedingungen |
| 23 | 323 | Was andere Menschen gesagt haben | Indirekte Rede: Grundlagen |
| 24 | 324 | Nachrichten und Informationen wiedergeben | Konjunktiv I: Einführung |
| 25 | 325 | Besitz, Herkunft und Zusammenhänge | Genitiv und Genitivpräpositionen |
| 26 | 326 | Menschen, Orte und Dinge genauer beschreiben | Adjektivdeklination: Vertiefung |
| 27 | 327 | Menschen und ihre Eigenschaften | N-Deklination: Vertiefung |
| 28 | 328 | Eigenschaften und Beschreibungen | Partizip I und II als Adjektive |
| 29 | 329 | Informationen richtig strukturieren | Wortstellung im Mittelfeld |
| 30 | 330 | Handlungen und Prozesse als Nomen | Nominalisierung: Grundlagen |
| 31 | 331 | Alltagssprache und formelle Sprache | Verbalstil und Nominalstil: Einführung |
| 32 | 332 | Gegensätze und unerwartete Situationen | Konzessive Konnektoren |
| 33 | 333 | Ursachen und Konsequenzen | Konsekutive Konnektoren |
| 34 | 334 | Ziele und Absichten | Finale Konnektoren |
| 35 | 335 | Gesellschaft, Umwelt und Veränderungen | Präpositionen mit Genitiv |
| 36 | 336 | Worauf kommt es an? | Präpositionaladverbien: Vertiefung |

### Section containers (36 × 8 = 288)

Every unit above has exactly these eight sections, in this order, all empty:

| № | Section | Identifier |
|---:|---|---|
| 1 | Vocabulary | `vocabulary` |
| 2 | Grammar | `grammar` |
| 3 | Listening | `listening` |
| 4 | Reading | `reading` |
| 5 | Speaking | `speaking` |
| 6 | Writing | `writing` |
| 7 | Review | `review` |
| 8 | Test | `test` |

Each shows the existing localized placeholder: KY `Контент кийинчерээк кошулат.` · RU `Контент будет добавлен позже.` · DE `Der Inhalt wird später ergänzt.` (German learners are not offered B1 — unchanged — so the German text is covered by a dictionary test). No container holds content and none is marked complete.

## 3. Legacy preservation

| Item | Status |
|---|---|
| Legacy units 21–32 | 12 units kept in the data, ids unchanged, **hidden** from the B1 listing, still reachable by direct link |
| Exact-title matches with the new list | **0** — all 36 are new containers; nothing was reused or merged |
| Vocabulary, grammar (29 lessons), exercises, listening, reading, speaking, writing, tests, final tests, level test `level-b1` | untouched (same arrays, same ids) |
| Progress and completion records (`21:vocabulary` … `32:test`, `topic:*`, `ex:*`) | untouched; verified in the browser after navigation |
| Automatic mapping of legacy content to new units | **none** |
| Content from other levels imported | **none** |

**Progress treatment:** B1 level progress now counts only the 36 listed units, which are empty and require nothing, so hidden-legacy completions do not move B1 progress (same treatment as the hidden A1/A2 units). Per-unit progress of units 21–32 still computes when they are opened directly. Continue Learning never selects an empty unit; with B1 active and nothing to continue, it uses the A1 unit (the same fallback as A2).

## 4. Tests and results

**New tests**
* `tests/data/b1-curriculum.test.ts`: 36 units; order and exact titles; numbers 1–36; ids 301–336 unique and collision-free; grammar topics on the right units with no lesson attached; 8 standard sections / 288 empty containers; empty units never current; legacy 21–32 preserved, hidden and addressable; no mapping.
* `tests/b1/b1-curriculum-ui.test.tsx`: 36 cards in order and no legacy card; placeholder (KY/RU) on every card and every section; no words / 0/0 / % / progress bar; German text in the dictionary; Continue Learning skips empty units; legacy unit 21 reachable with its saved progress intact.
* Helper: `tests/b1-authored.ts`.

**Updated tests** (assertions that treated 21–32 as the listed B1 units now describe them as hidden legacy; none weakened): the `tests/b1/unit-NN` and `unit-NN-integration` suites (`B1_CONTENT.units` → `legacyUnits`), `b1-infrastructure`, `beta-launch` (the folder lists 301–336 and no legacy card), `tests/content-validate/b1-approval.test.ts`, `tests/data/data-boundary.test.ts` (B1 may import the shared content-free builder, as A2 already may).

| Check | Result |
|---|---|
| TypeScript | pass |
| Lint | 0 errors (8 existing warnings) |
| Content validation | 0 errors |
| Production build | pass (B1 stays a separate lazy chunk) |
| Full test suite | **119 files, 3,390 tests, all pass** |

**Browser (Chromium, 390 px and 1280 px, Kyrgyz / Russian / German):** the B1 folder lists exactly 36 cards in order with the placeholder only (no legacy card, no statistics, no clipping, no horizontal scroll); all 36 unit pages have 8 empty sections with correct localized labels; legacy `/learn/unit/21` opens with its content and its saved progress ("8 / 8"); the 98 seeded completion keys survived; A1 still lists 38 units and A2 43; German is not offered B1 (unchanged). No console errors.

## 5. Files changed

* **New:** `src/data/b1/curriculum.ts`, `tests/data/b1-curriculum.test.ts`, `tests/b1/b1-curriculum-ui.test.tsx`, `tests/b1-authored.ts`, this report.
* **Source:** `src/data/curriculum.ts`, `src/data/types.ts`, `src/data/course.ts`, `src/data/b1/b1-content.ts`.
* **Tests (updated):** `tests/b1/unit-21 … unit-32` (+ `-integration`, `unit-21-audit`), `tests/b1/b1-infrastructure.test.ts`, `tests/b1/beta-launch.test.tsx`, `tests/content-validate/b1-approval.test.ts`, `tests/data/data-boundary.test.ts`.

## 6. Issues and limitations

* **B1 now follows the same "nothing to continue" state as A2:** a B1 learner has nothing to continue until content is mapped or authored, so Home falls back to the A1 unit.
* **Same title in two levels:** new B1 unit 01 *Geschichten und Erlebnisse erzählen* has the same title as new A2 unit 10 (ids 301 and 210). They are separate units; the duplicate is in the supplied tables.
* **Overlapping themes with A2 (curriculum, not code):** for example B1 21 *Wenn ich die Möglichkeit hätte …* vs A2 42; B1 04 *Futur I* vs A2 09; B1 25 *Genitiv* vs A2 21/34; B1 22–24 (Konjunktiv, Indirekte Rede); B1 08–10 vs A2 11–14. Relevant for the later mapping step.
* **Beta notice:** the existing B1 Beta notice still shows on every B1 page, including the empty units.
* **Not done on purpose:** no content audit and no mapping of the twelve legacy units to the 36 new ones — that is the next step.
