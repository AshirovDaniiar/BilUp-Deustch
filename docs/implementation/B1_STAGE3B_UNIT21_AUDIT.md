# B1 Stage 3B — Unit 21 comprehensive quality audit

**Verdict: PASS WITH CONDITIONS** (§10). The audit found and fixed 10 confirmed defects in Unit 21 (content, Kyrgyz terminology, one UI bug); every fix is pinned by a test. The unit is still an **unreviewed AI-assisted draft**: no native Russian or Kyrgyz speaker and no CEFR expert has checked anything, **no official CEFR approval exists**, and **no audible playback was verified**. B1 remains `planned`, `releasedLocales: []`, invisible; nothing is committed; the 15 staged Storage/app files, A1/A2 content, `src/storage` and the approved unit ids are untouched.

**Method.** Full re-read of all Unit 21 sources; scripted checks (word counts, scope scan, lemma overlap, keyword glosses, answer-key and scoring through the real question builders); the real app in a real browser (Playwright/Chromium on the development machine, Vite dev server) with B1 switched to Beta **in the running page only** — no file was changed to do so — in Russian and Kyrgyz, desktop and 390 px; A1/A2 flows re-checked. The dev server and the tool's artifacts were removed afterwards.

## 1. German linguistic findings
Everything else checked was correct (word order, verb-final clauses, Präteritum forms, separable verbs, the 35-verb list, all 15 test items and 10 exercises).

| # | Finding | Status |
| --- | --- | --- |
| G1 | **Scope slip:** reading 2 had «große Schmerzen» — an adjective *without article* (the Unit 24 concept). My scope test did not cover it | **fixed** («Danach hatte ich Schmerzen …»); new heuristic test (fixed time phrases such as *letzte Woche* are deliberately exempt: A1/A2) |
| G2 | **Incoherent dialogue (listening 1):** Murat asked about the feelings *before* Jana had answered "what did you do?" | **fixed** (order: activities → feelings → reaction) |
| G3 | **Tense inconsistency with the unit's own rule** (Perfekt for talking, Präteritum for writing): the speaking hints modelled Präteritum (*kam, nahm, sah, fand*, *wohnte*) | **fixed** (hints now Perfekt: *bin … angekommen, habe … genommen*) |
| G4 | **Ambiguous distractor:** final test 07 «Gestern ___ ich … gegangen» offered *war* — formally a (rare) Plusquamperfekt | **fixed** (distractors *habe / bin / ist*; answer *bin*) |
| G5 | Content gap against the learner outcome "explain *why*": reasons were only recycled | **fixed:** *weil* is an expected element of the writing task, a speaking hint and a tip |
| G6 | Natural-German remarks (not errors; for the reviewer): *nachdem + Perfekt* with a past event is colloquial (the strict form is Plusquamperfekt, Unit 29 — as approved and as stated in the lesson); «zehn Jahre nicht gesehen» is more usual with *lang*; «Inzwischen kennst du fast das ganze Haus» is slightly stilted; the connectors *seitdem/bevor* recur very often (by design, but somewhat repetitive) | open (reviewer) |
| G7 | **Difficulty.** Too easy: *passieren, plötzlich, Unfall, Panne, Zufall* (A2–B1 borderline; they are not A1/A2 headwords in this repository), exercises 01/09 (single-form gap), reading 2 (average sentence ≈ 9 words: the lower edge of the B1 ramp, consistent with the approved Unit 21 band). Possibly too advanced: *bereuen, überwinden, gelingen* (B1-upper/B2 ⚑) | open (reviewer) |

## 2. Russian findings
One real error: the example for **Zufall** («…по счастливой случайности») added "счастливой", which the German does not say — **fixed**. All other translations were checked for meaning, gender agreement of the speakers (Jana/Aisha feminine, Murat/Nurlan masculine) and terminology (придаточное предложение, отделяемая приставка, Präteritum/Perfekt kept in Latin): consistent. Not verified by a native speaker.

## 3. Kyrgyz findings (no native approval is claimed)
**Confirmed errors, fixed:**
* K1 — Unit 21 introduced three grammar **labels the project's own glossary policy forbids or that are not recognised terms**: «бүтүндөмө сүйлөм» (×10, not a standard term), «жакталган этиш» (×3, open item K8), «бөлүнүүчү (уңгулуу) этиш» (×2, open K9). Replaced by **descriptions** (e.g. «bevor менен башталган сүйлөм бөлүгү», «этиш эң аягында турат», «приставкасы ажыраган этиш»), as in A2.
* K2 — «уңгу» (verb **stem**) had been used for the separable **prefix** (wrong): now «приставка», as A2 does.
* K3 — connector glosses were unnatural («…го чакта», «…га чейин (токтоо)»): now «…гандан мурун / …ып жатканда / …ган убактан бери / …ганга чейин / …гандан кийин».
* K4 — wrong or doubtful word choices: *aufgeben* «баш ийүү» (= "obey") → «багынып берүү»; *Und ob!* «Эстебегенде!» → «Албетте эстейм!»; *inzwischen* «ал эми» → «ошол убакыттын ичинде»; *gelingen* «ийгиликтүү чыгуу» → «ишке ашуу, ийгиликке жетүү».
* Kyrgyz is never a copy of the Russian and is always Cyrillic (tested); a test now forbids the three labels and the «уңгу» misuse from returning.

**Terms that REQUIRE a qualified Kyrgyz reviewer:** туура / туура эмес этиш (regular / irregular verb); приставка (prefix); уңгу (stem); байламта (conjunction); башкы сүйлөм (main clause); the descriptive phrases for subordinate clauses and verb-final position; өткөн чак; the five connector glosses above; кырсык, апаат (Unfall); эскерүү; ата мекенди, үйдү сагынуу (Heimweh); жеңилдик сезген (erleichtert); таң калган; чарчап-чаалыккан; кокусунан; сыноо, оор милдет (Herausforderung); батынуу, кайраттануу (sich trauen); өкүнүү; жолугуу (+ Dativ); көз ирмем; the idiom «Албетте эстейм!»; register (informal сен in dialogues); and all 28 new checklist / self-assessment UI strings. These join the existing glossary (`docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md` has no B1 section yet — blocker B-5).

## 4. Educational quality
| Outcome | Where it is trained | Assessment |
| --- | --- | --- |
| Narrate personal experiences | reading 1–2 (models), listening 1–2, speaking, writing | **Adequate** |
| Chronological order | zuerst/dann/danach/schließlich, 5 connectors, order exercises 03/07, speaking turn 3, writing element | **Adequate**, but only at **sentence** level in the exercises |
| Reasons | *weil* (A2 ↻, exercise 10, now writing/speaking) | **Partial** (fixed from "absent"); **consequences** are not trained (planned for Unit 30) |
| Feelings and reactions | 8 adjectives + nouns, listening 1 (explicit question), speaking turn 4, writing element | **Adequate** for vocabulary; no exercise isolates feelings |
| Connect events into a coherent story | only the free tasks (speaking, writing) | **Weakest point:** no exercise at text level (ordering sentences into a story, joining two sentences with a connector). The exercise cap (10) is reached; recommended for the next iteration |
The five situations of the brief each have a text: difficult journey (reading 1), achievement (reading 2), encounter (listening 1), important decision (listening 2). Exercise progression is sensible inside the sentence level (form → recognition → ordering) but ends there; production is only in speaking/writing.

## 5. Exercise and assessment QA
* **Every answer key was verified** (structurally by test through the real builders `finalTestQuestions` and `fromExercise`, and by reading): the answer is among the options exactly once, options are distinct and are only shuffled; order tokens reproduce the answer; 15 / 15 correct answers score 15 and the first distractor scores 0 everywhere.
* **Distractors** were read item by item: each is a plausible learner error (*kommte, nehmte, fahrten, sahten*, wrong verb position, wrong connector). One was ambiguous (G4, fixed); *Plötzlich / Zunächst / Inzwischen* (vocabulary 11) is acceptable, *Zunächst* is the weakest distractor.
* **Both approved concepts are assessed:** exercises 4 + 4, final-test items 3 + 3; the **2 recycled A2 items** are identified by their A2 concept (`a2-perfekt-erfahrungen`, `a2-wenn-als`), by the «↻ A2» marker in the explanation, and the 2 recycled exercises by having no concept — all pinned by a test.
* **Feedback:** every item has an explanation in Russian and Kyrgyz that names the correct form. Instruction lines of a task type («Welcher Satz ist richtig?», «Bilde den Satz.») are German-only, as in A2.
* **Scoring** is the existing 70 % rule (11 of 15).
* Order items have exactly one arrangement under the given tokens (capitalised first word).

## 6. Audio limitations
**Reviewed (code):** `services/speech.ts` selects a German voice (`de-DE` first, local before network), sets `lang = 'de-DE'`, splits long text into ≤ 160-character utterances, guards against stale events of cancelled utterances, and the listening lab plays line by line (normal / slow). **Observed (this machine, desktop Chromium, Windows):** speech synthesis present, 3 `de-DE` local voices, *Microsoft Hedda* chosen, `speak()` fired its start and end events — **an API-level check only; I did not hear it, and no iOS Safari or Android Chrome check was done.** Nothing here claims functional audio on learners' devices (blocker B-7).
**Limitations found (shared lab, A1/A2 affected too; not changed here):** (1) one voice for all speakers; (2) a speech error is treated like the end of playback (silent); (3) the "no German voice" notice (`audioUnavailable`) exists only in the quiz runner for audio questions — the listening lab shows no notice and disables *Play* only when synthesis is unsupported, and the transcript is reachable only **after** the questions, so a learner without audio cannot do the exercise; (4) no pause/resume (stop and replay only).
**Verified in the browser:** transcript of 14 lines with Kyrgyz translations, and all keyword chips glossed in Kyrgyz (two had no gloss before: **fixed**, §8).

## 7. Browser UI findings (Russian and Kyrgyz, 390 px and desktop)
* All 12 Unit 21 routes resolve, no "not found", **no console error**, **no horizontal overflow** at 390 px, except the bug below.
* Final test renders (gap item with shuffled options); review shows the vocabulary questions; reading, grammar, vocabulary cards, writing and speaking work in both languages; the B1 writing and speaking results show the checklist, the disclosure and the self-assessment, **no score bar and no percentage**; A2 writing still shows its 6 score bars and percentages and A1/A2 navigation is intact (B1 Beta existed only in the test page).
* **Bug (fixed):** on the speaking result the self-check chips (long sentences) did not wrap and widened the page to 639 px on a 390 px phone.
* **Pre-existing, shared, not changed:** the Kyrgyz interface still shows Russian chrome for inherited keys (*Ситуация, Ваш текст, 72 / 70 слов, Разобрать текст, Ответьте на вопросы, К сценариям, Вариант для сравнения*); the Beta banner on B1 says «Уровень **A2** находится в бета-версии» (blocker B-8); the writing checklist labels («Ein Grund mit weil …») are German-only because the task type has no localised label.
* Loading/error states: the lazy-chunk loading state appears on first load; the failure/retry path is covered by existing tests (A2) and was not re-forced in the browser.

## 8. Bugs fixed (all inside Unit 21 or its own new UI)
1 G1 adjective without article · 2 G2 dialogue order · 3 two listening keywords **without a gloss** («Schulfreundin», «seitdem» → replaced by glossed words; chips showed no translation) · 4 G3 Perfekt in speaking hints · 5 G5 missing reason element · 6 G4 ambiguous distractor · 7 Russian Zufall example · 8 Kyrgyz K1–K4 (labels against the glossary policy, wrong «уңгу», unnatural glosses, wrong words) · 9 self-check chip overflow (`.selfcheck` CSS in `features.css`, my component only) · 10 three TypeScript errors in my audit test (`tsc` is clean). New tests: `tests/b1/unit-21-audit.test.ts` (18).

## 9. Outstanding issues
1. No native Kyrgyz / Russian review and no CEFR review (conditions below); B1 Kyrgyz glossary missing (B-5).
2. Real-device audio verification (B-7); listening-lab limitations of §6 (shared code).
3. Text-level exercise gap (§4) and consequences not trained (Unit 30); the exercise cap is reached.
4. Beta notice says "A2" (B-8); Kyrgyz UI chrome partly Russian (shared); German-only checklist labels.
5. A2 feedback still shows numeric analysis scores (B-9 for A2 — owner decision).
6. Cross-level spaced revision is authored only (B-12); one speaking scenario of the three named in the curriculum.
7. Entry bundle +9 kB (UI strings, checklist components) — acceptable, recorded.

## 10. Final recommendation: **PASS WITH CONDITIONS**
Unit 21 is functionally sound, in scope, internally consistent and now free of the defects found. Conditions before it is treated as releasable content (not before Unit 22 authoring): (a) native Kyrgyz and Russian review of the term list in §3; (b) independent CEFR review of the texts and the ⚑ vocabulary (*bereuen, überwinden, gelingen*); (c) real-device audio test (iOS Safari, Android Chrome); (d) fix B-8 (level-aware Beta notice) and decide B-9 for A2; (e) add a text-level exercise if the owner raises the exercise cap or replaces a recall item. Proceeding to Unit 22 is reasonable provided the Kyrgyz **labelling rule found here** (describe, do not label) and the **adjective-without-article scope guard** are applied to every later unit.

## Results (actual)
Full suite **82 files / 2268 tests passed** (was 81 / 2250); `content:validate` 0 errors, 0 warnings, 32 review flags (31 A2 + Unit 21's missing human CEFR sign-off); `content:validate:release` 44 errors (unchanged); typecheck, build, format:check clean; lint 0 errors, the same 8 warnings.
