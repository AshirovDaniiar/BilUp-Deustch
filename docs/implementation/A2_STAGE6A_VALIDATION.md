# A2 plan — Stage 6A: content validation foundation

A strict validator now exists for future A2 content, plus the metadata cleanup it depends on. **No A2 content was created; A2 remains planned, empty and invisible.** Earlier stages: [0](A2_STAGE0_BASELINE.md), [1](A2_STAGE1_CATALOG.md), [2](A2_STAGE2_MIGRATION.md), [3](A2_STAGE3_LEVEL_SCOPING.md), [4](A2_STAGE4_ANSWER_ORDER.md), [5](A2_STAGE5_NAVIGATION.md).

## 1. Architecture (`scripts/content-validate/`)
```
types.ts        Issue, Severity (error | warning | review | info), Mode (authoring | release), ContentBundle, ReviewRecord
context.ts      level resolution, severity policy ("strict" = every level except the legacy A1), issue collector
stats.ts        exact binomial test (no simulation, no randomness)
rules/          localization · cefr · answers · references · metadata   (each a pure function over the bundle)
validate.ts     entry point: the original core rules (unchanged) + the five rule modules
bundle.ts       currentBundle() = A1 only (legacy view, as before) · fullBundle() = A1 + A2 modules + course registry + sign-offs
reviews.ts      human sign-offs per unit and the "Kyrgyz intentionally equals Russian" allow-list — both empty
cli.ts          npm run content:validate [-- --release]
```
* **Severities.** `error` fails the run. `warning` is suspicious. **`review`** means *an automated check cannot decide; a human must sign it off* — it is never reported as a pass. `info` is measurement.
* **Modes.** `authoring` (default): gaps in a level that is still planned are information/review. `release` — and any level whose course status is beta/released — turns every gap and every missing sign-off into an error. The empty A2 therefore validates cleanly while authoring and is **refused** by a release run (10 missing units + the level test), by design.
* **Legacy exemption.** A1 is measured and reported but never failed by the strict rules; a bundle without a `course` is legacy as a whole. The original skeleton tests pass unchanged.
* Deterministic and offline: no `Math.random`, no network (a test stubs `fetch` and `Math.random` to throw), and the validator never modifies or fills in the bundle.

## 2. CEFR validation — and its limits
Reliable (errors): the declared level of grammar/listening/reading/writing/speaking must equal the level of the unit that holds it (`cefr-level-mismatch`); anything declared above A2 inside an A2 unit is `cefr-too-advanced-tag`; a unit in the A2 id range must declare A2.
Heuristic (**review flags only**): reading/listening length, sentences over 22 words, and eight German constructions that curricula place at B1+ (Passiv, obwohl/damit/falls/nachdem/…, trotzdem, Relativsatz, Plusquamperfekt, Konjunktiv II der Vergangenheit, Genitiv, Futur II).
Sign-off: every A2 unit with content needs a recorded human CEFR review — a review flag while authoring, an error when released.

**Measured limitations** (all existing A1 German relabelled as a strict level, pinned by a test):
* the heuristics produce **no false positives** on genuine A1 text and find the two real B1 constructions (the Genitiv concept and `trotzdem` in a writing model) — after tightening: the first version of the Relativsatz pattern flagged 7 of 10 units ("Ja, die Wohnung…"); it now needs a capitalised noun before the comma and excludes interjections;
* they **cannot** detect the B1-tagged reading text `re10` (verb-final passive without *ge-*, no marker word): only its declared tag reveals it. Absence of a flag means nothing;
* there is **no lexical check**: no authoritative CEFR word list is in the repository and none was invented. Vocabulary and text difficulty rest on the human sign-off. The validator says this on every run (`cefr-limits`).

## 3. Localization (RU and KY independent)
Table-driven (`A2_LOCALIZATION`), covering every localised field of units, vocabulary, grammar (title, summary, discover, why, when, speak prompt, mistake notes, examples/reallife/dialogue translations), exercises (prompt translations, why), listening (line translations), reading (gloss meaning and grammar note), speaking (title, goal, turns), writing (situation, tips), tests (titles) and authored final tests. For every A2 item: Russian **and** Kyrgyz must exist (`l10n-missing-ru/ky`), not be empty/whitespace (`l10n-empty-*`), not be placeholder text (`l10n-placeholder`), and Kyrgyz may not be a copy of Russian (`l10n-ky-equals-ru`, judged after trimming/spacing/case). A single short word that is identical (a name, loanword, number) is a **review** flag; an explicit allow-list (vocabulary *words* only, never sentences) turns it into information. Plain German content may not be empty. Characters are never inspected (02 §7.0).
The shared types gained **optional Kyrgyz siblings** (`exampleKy`, `GrammarExample.ky`, dialogue/line `ky`, `promptKy`, `titleKy`, `aiKy`, `grammarKy`, `WhyNote.ky`) and A2 got strict types (`L10nStrict`, `A2TestDef`, `A2TestQuestion`). Additive; no A1 data changed. The Kyrgyz measurement of A1 (272/352) is unchanged.

## 4. Answers (Listening and Reading)
Structure: ≥ 2 options (BilUp uses 3: other counts warn, > 5 errors), no empty or duplicate option, non-empty question, the correct index must point at an option (`answer-mapping`; the core `answer-index` rule still applies to every level).
Position bias — deterministic: an **exact two-sided binomial test** on the authored positions, per skill, level and option count (≥ 9 questions; fewer = "skipped", never "fine"): p < 0.01 is a warning, p < 0.001 an error; a run of ≥ 4 identical positions in a unit warns. Strict levels fail; **A1 is only measured** — exactly: listening 17/17/1 (p = 1.7·10⁻⁵), reading 14/4/0 (p = 1.4·10⁻⁴) — because the app shuffles option order per attempt (Stage 4).

## 5. References and provenance
Internal: a level's content may reference only its own level (`ref-cross-level`: A2 units → A2 concepts, A2 words → A2 words, A2 handwritten exercises → A2 concepts, A2 tests → A2 units); existence is the core rule's job. Provenance: authored A2 reading, listening, grammar, speaking and writing must declare a `source` (`authored` needs an author; `adapted`/`external` need a citation and licence): missing = warning while authoring, error for a release; malformed, incomplete or placeholder ("TODO", "n/a", "unknown") = error; a non-http(s) URL = error; a well-formed URL or a missing one is a **review** flag because the validator never goes online. It checks the declaration only — it never invents or completes one.

## 6. Metadata (application changes)
| Before | Now |
| --- | --- |
| unit page label "8 questions" (hard-coded) | `topicTestOfUnit(unit).size` |
| test link `/practice/tests/unit-<n>` (id pattern) | the test definition with `kind: 'topic'` and that `unit`; its `id` can be anything |
| writing task `wr<NN>` (id pattern) in the unit page and in `requiredSections` | `writingForUnit(unit)`: the task whose `unit` is that unit |
| Home test step "8 questions" + `unit-<n>` | same metadata |
A1 output is identical (every A1 unit has a `unit-<n>` test of size 8 and a `wr<NN>` task — now as metadata). The validator additionally checks the metadata: a topic test names an existing unit, at most one per unit, a positive integer size that **equals the number of authored final-test questions**; final-test questions are well-formed; the (positional) unit→scenario list references existing, unrepeated scenarios; every unit id lies in its level's range.
**Deliberately not changed:** `UNIT_SPEAKING` is a positional array in the A1 data (hash-guarded) and the Stage 1/2 tests pin its identity. It is now *validated* (existence, duplicates, length) and the A2 skeleton keeps the same form; replacing it with an explicit unit→scenario record is a recommended follow-up.
`A2_TESTS` is now typed `A2TestDef[]` (empty). Stage 1's one type-pin on it was updated to the stricter type (and asserted assignable to `TestDef`).
**Robustness fix found by a test:** `HomeScreen` crashed for a current unit without a listening dialogue or speaking scenario; those steps are now simply left out (A1 has all five: unchanged).

## 7. A2 minimums and release gates
`UNIT_MINIMUMS` encodes the approved standard (28 vocabulary, 2–3 grammar, 2 listening, 1–2 reading, 1 speaking, 1 writing, 8 handwritten exercises, 15 final-test questions, a topic test per unit, an A2 level test). A level that is beta/released must also have every unit reviewed (Russian and/or Kyrgyz) for every language it is released for — an error in any mode.

## 8. Tests — 248 new (`tests/content-validate/`, `tests/navigation/unit-metadata.test.tsx`)
A fully compliant synthetic A2 world (`fixtures.ts`, test-only) validates with **zero** errors/warnings/review flags — A2 content *can* be validated when introduced — and gives every rule a clean baseline to break. Localization: **every** localised field × (missing / empty / whitespace / missing-Russian / copied / placeholder). CEFR (34), answers (18, with closed-form cross-checks of the statistics), references (19, incl. offline and no-invention), metadata (22), UI metadata (10: real A1 identical; an A2 world with ids that follow no pattern and a 15-question test).
**Mutation tests** (source mutated, tests must fail; all restored): Kyrgyz copied from Russian accepted (28 tests fail); empty Kyrgyz accepted (52); missing Kyrgyz not reported (53); strict level switched off (205); A1 treated as strict (73); too-advanced tag accepted (5); heuristics disabled (11); CEFR sign-off never required (3); strong bias never an error (3); wrong p-value (3); duplicate options accepted (1); missing provenance accepted (8); any URL accepted (1); final-test size mismatch accepted (1); release gate never an error (10); unit page back to `unit-<n>`/"8" (1); writing requirement back to `wr<NN>` (6). One mutant was equivalent (the "is missing" branch is duplicated by the "is not text" branch for `undefined`) and was replaced by a meaningful one. **Two real defects were found by the tests themselves and fixed:** the vocabulary allow-list also excused the example *sentence*; and the Home crash above.

## 9. Verification
| Check | Result |
| --- | --- |
| typecheck / lint | pass / 0 errors, 8 pre-existing warnings |
| tests | **49 files, 1195 tests pass** (was 43 / 947); all 773 originals and Stage 0–5 protections green, no baseline touched |
| `content:validate` | authoring: **0 errors, 0 warnings, 0 review flags** on the real content (A1 measured, A2 empty); `--release`: refuses the empty A2 |
| boundaries / format | same 5 pre-existing violations, 0 cycles / 15 pre-existing flagged files |
| browser | all 10 A1 unit pages show "8 вопросов" with the same `unit-N` / `wrNN` links; Home steps unchanged; `/learn/unit/11` is "not found" |
| bundle | main JS 556.4 → **561.3 kB raw (+4.9 kB, +0.9 % since the A1 baseline; +0.2 kB for Stage 6A)**, gzip 178.1 kB. The validator lives in `scripts/` and is not shipped |

## 10. Next (Stage 6B, on approval)
Not in this stage: tutor migration (D-3), a storage decision for level-tagged skill scores / daily, replacing the positional `UNIT_SPEAKING`, and the authoring of A2 content itself.


See also: [Stage 6B — Content Infrastructure](A2_STAGE6B_INFRASTRUCTURE.md).
