# A2 Unit 11 — Kyrgyz linguistic QA (assistant pass; NOT native-speaker approval)

Stage 7A.1. All ≈270 Kyrgyz strings of unit 11 were read once more field by field. **Nothing was changed**; corrections are proposed and wait for approval. This pass was done by the AI assistant that drafted the text. It is a second read, not independent review, and it cannot replace a native speaker. **No Kyrgyz sign-off is recorded** (`A2_REVIEWS` empty; release still fails for unit 11).

## 1. What is automated vs. what is human

| | Checked by | Result |
| --- | --- | --- |
| Every Kyrgyz field present, non-empty, not a placeholder | validator + tests | pass (0 errors) |
| Kyrgyz is never identical to the Russian | validator + tests | pass (0 copies, `SAME_AS_RU` empty) |
| German quotes inside explanations identical in RU and KY | test | pass |
| Kyrgyz-specific letters (ү, ө, ң) occur | heuristic test | 76 % of word glosses; all sentences and explanations |
| **Grammatical correctness, spelling, natural phrasing, terminology, register** | **nobody yet** (assistant read only) | findings below |

## 2. Findings from the assistant's read (proposed, not applied)

Severity: **H** probable error, **M** unnatural or inconsistent, **L** style.

| # | Sev | Field(s) | Current | Proposed | Why |
| --- | --- | --- | --- | --- | --- |
| K1 | H | `a2-praeteritum-sein-haben-modal.ex4` | «Биз көп иштеши керек болчубуз.» | «Бизге көп иштөөгө туура келди.» (or «Биз көп иштешибиз керек болчу.») | *иштеши* is a 3rd-person form; it does not agree with *биз*. |
| K2 | H | `a2-in-11-review` | «жоопттон» | «жооптон» | spelling (double т). |
| K3 | H | `v11-33` example | «…туулгамын.» | «…туулганмын.» | standard form of "I was born". |
| K4 | M | `v11-33` word | «туулган болуу» | «туулуу» (gloss: "to be born") | the "…болуу" frame is calqued from *geboren sein*. |
| K5 | M | `a2-perfekt-erfahrungen.rl0` | «…иштегем.» | «…иштегенмин.» | colloquial contraction; unit uses the full form elsewhere. |
| K6 | M | `a2-perfekt-erfahrungen.dlg0`, `a2-li-11-01` line 0 | «Сен өзү кайда/кайдан …» | drop *өзү*: «Сен немис тилин кайда үйрөндүң?», «Сен кайдан келдиң?» | *өзү* is an awkward calque of *eigentlich*; no natural Kyrgyz equivalent is needed. |
| K7 | M | `v11-24` *schaffen* | «аткара алуу, жөндөө» | «аткара алуу, жетишүү» | *жөндөө* ("to arrange/fix") is a different meaning. Also reading 1 gloss `g4` «аткарган, жөндөгөн». |
| K8 | M | terms: *жөндөлгөн этиш* (conjugated/finite verb) in `a2-ereignisse-verbinden`, ft-08, ft-09, ex-11-08 | «жөндөлгөн этиш» | «жакталган этиш» | *жөндөлгөн* is the participle of declension (nouns); a verb with person endings is *жакталган*. Needs native confirmation. |
| K9 | M | terms: separable prefix | text uses «ажыраган ab- приставкасы» (ex-11-02); the review report says «бөлүнүүчү» | pick one: «бөлүнүүчү приставка» | inconsistent term. |
| K10 | M | instructions `a2-in-11-vocabulary` | «аттык сөздөрдү» (nouns) | «зат атоочторду» | *аттык сөз* is not the usual school term. |
| K11 | M | `why sind reason` | «жайды өзгөртүү» | «жашаган жерди өзгөртүү» | *жай* is ambiguous (place / comfort). |
| K12 | M | clause terms | «ээрчимелүү сүйлөм» (subordinate clause) | confirm against the school grammar term used in Kyrgyzstan (e.g. «багыныңкы сүйлөм») | term choice, used 10+ times. |
| K13 | L | `v11-26` *stolz* | «сыймыктанган» (participle) | «сыймыктуу» or «сыймыктануу» | adjective vs. participle; the German word is an adjective. |
| K14 | L | register | informal «анан» next to «андан кийин» in dialogues (`dlg3`, `a2-li-11-02.3`) | choose one per text | register mixing. |
| K15 | L | `v11-37` *seit* | «бери» | «…дан бери» (with example) | the postposition needs the ablative; a one-word gloss can mislead. |
| K16 | L | `v11-16` / `v11-36` *umziehen* | «көчүп кетүү» (move away) | «көчүп баруу» in contexts of arriving | direction nuance (*көчүп кетүү* = leave). |
| K17 | L | instruction `a2-in-11-test` | «эсептетүү үчүн» | «эсептелиши үчүн» | more natural passive. |
| K18 | L | formal/informal address in instructions | «-ңыз» (polite) used consistently | confirm that polite address is the intended standard for learner instructions | consistency with the existing Kyrgyz UI. |

Russian: no problem found in this read; a Russian reviewer should still check it (explicit statement: the assistant has no evidence either way beyond one read).

## 3. Terminology used (needs one native decision, then it is fixed everywhere)

Perfekt / Präteritum / Partizip II / Dativ — kept as Latin terms · өткөн чак (past tense) · жардамчы этиш (auxiliary verb) · кыймыл-аракет этиши (motion verb) · модалдык этиш (modal verb) · байламта (conjunction) · баш сүйлөм / ээрчимелүү сүйлөм (main / subordinate clause) · приставка (prefix) · мүчө (ending) · ээ (subject) · көптүк сан (plural) · бөлүм (unit; matches the existing UI word).

## 4. Fields that REQUIRE native reviewer attention

Because none of the text has been reviewed, **every Kyrgyz field of unit 11 does**. Priority order for a reviewer's time:

1. **Grammar explanations** (the highest risk: terminology and accuracy): all `title / summary / discover / why / when / mistakes[].note` of the three concepts (≈ 35 fields); why-note reasons (5); exercise and final-test `why` (23).
2. **Dialogues and listening translations** (naturalness): listening lines (20), grammar dialogues (12), speaking turns (4).
3. **Vocabulary glosses and example translations** (37 × 2): especially K3, K4, K7, K13, K15, K16.
4. **Instructions and task text** (9 instructions, writing situation/tips, speaking goal).
5. Prompts of exercises/final test (23) — mostly short; check K1.

Specific fields named in §2 (K1–K18) should be answered first.

## 5. Consistency between components (assistant check)

* Same word, same gloss in vocabulary, example, grammar, reading gloss, why-notes: ✓ for *тажрыйба, сынак, максат, ийгилик, жумуш орду, чоңой-*; **inconsistent**: *schaffen* (аткара алуу / жөндөө / аткарган), *geboren sein* (туулган / туулгамын), *separable prefix* (K9).
* Feedback (`why`) uses the same grammar terms as the concept explanations: ✓ except K8/K9.
* Instructions use polite *-ңыз* throughout; learner-facing dialogue lines use *сен* (informal) or *сиз* matching the German du/Sie: ✓.

## 6. How to proceed

Approve (all, some, none) of K1–K18; I apply approved items and re-run the validators and tests (all Kyrgyz-dependent tests only check presence/difference, so wording changes are safe). After a native reviewer has reviewed the unit, a **person** records `A2_REVIEWS[11] = { cefr, ru, ky: true, reviewer, date }`.

---

## Corrections applied in Stage 7A.2 (record) — NOT native-speaker approval

Applied only where the correction is linguistically unambiguous; everything else is **unchanged and still marked for the native reviewer**.

| # | Status | Detail |
| --- | --- | --- |
| K1 | **applied** | «Биз көп иштеши керек болчубуз» → «Биз көп иштешибиз керек болчу». Investigation: *иштеши* carries the 3rd-person possessive ending, so it cannot agree with *биз*; the standard obligation frame is *<verb>-(ы)ш + person-possessive + керек*. |
| K2 | **applied** | «жоопттон» → «жооптон». Investigation: the ablative of *жооп* is *жооп + тон* = *жооптон*; the doubled т was a typing error. |
| K3 | **applied** (example only) | «туулгамын» → «туулганмын». Investigation: the participle is *туулган* and the first-person copula *-мын* attaches to it (*туулган-мын*); *туулгамын* is not a standard form. The word gloss «туулган болуу» (K4) is left for the reviewer. |
| K5 | applied | «иштегем» → «иштегенмин» (full standard form; the unit uses full forms elsewhere). |
| K6 | applied | dropped the filler *өзү* in «Сен немис тилин кайда үйрөндүң?» and «Сен кайдан келдиң?» (the shorter sentence is correct either way). |
| K10 | applied | «аттык сөздөрдү» → «зат атоочторду» (standard school term for nouns). |
| K11 | applied | «жайды өзгөртүү» → «жашаган жерди өзгөртүү» (removes the ambiguity of *жай*). |
| K15 | applied | gloss of *seit* «бери» → «бери (…дан/…ден бери)». |
| K17 | applied | «эсептетүү үчүн» → «эсептелиши үчүн» (passive "to be counted"; *эсептетүү* is causative). |
| K4, K7, K8, K9, K12, K13, K14, K16, K18 | **unchanged — native review required** | terminology and phrasing choices (*туулган болуу*, *жөндөө* for *schaffen*, *жөндөлгөн / жакталган этиш*, *ажыраган / бөлүнүүчү приставка*, *ээрчимелүү / багыныңкы сүйлөм*, *сыймыктанган*, *анан* register, *көчүп кетүү / баруу*, polite address). A test asserts these originals are still present, so a later reviewer sees exactly what the assistant drafted. |

New Kyrgyz written in this stage (replacement sentences for the CEFR decisions, three UI strings for the loading states) is again an AI-assisted draft and is added to the native-review list: unit 11 replacement sentences in listening 2, concept 2/3 notes and examples, ft-11-05/06/09 and ex-11-04 explanations; UI keys `levelLoading`, `levelLoadFailed`, `levelLoadFailedAgain` (also unreviewed in the German and Russian sense — a human should read all three languages).
