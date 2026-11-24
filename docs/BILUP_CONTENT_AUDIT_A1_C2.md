# BilUp Til — Content Audit and Production Roadmap (A1–C2)

**Audit date:** 2026-11-23  
**Scope:** repository evidence, source data, curriculum reports and validator output  
**Status:** Audit only — no curriculum or content was changed.

## 1. Executive findings

The repository has three materially different curriculum states:

| Level | Approved / planning document | Visible structure | Implemented learning content | Human CEFR review |
|---|---:|---:|---:|---|
| A1 | 38-unit grammar curriculum | 38 curriculum-v2 units + 10 legacy units hidden | 10 legacy units are authored | No complete review sign-off |
| A2 | 43-unit grammar curriculum | 43 curriculum-v2 units + 10 legacy units hidden | 10 legacy units are authored; 43-unit product is mostly empty | Pending for units 11–20 |
| B1 | 36-unit grammar curriculum plus 12-unit legacy/Beta plan | 36 curriculum-v2 units + 12 legacy units hidden | 12 legacy units are authored; 36-unit product is empty | Pending for units 21–32 |
| B2 | NOT FOUND | No authored level or unit plan | None | NOT FOUND |
| C1 | NOT FOUND | No authored level or unit plan | None | NOT FOUND |
| C2 | NOT FOUND | No unit curriculum | None | NOT FOUND |

Authoritative unit-plan sources:

- A1: `src/data/a1-curriculum.ts`
- A2: `src/data/a2/curriculum.ts` and `src/data/a2/registry.ts`
- B1: `src/data/b1/curriculum.ts` and `src/data/b1/registry.ts`
- B2: no curriculum or unit inventory found
- C1: no curriculum or unit inventory found
- C2: no curriculum or unit inventory found

The repository is structurally consistent, but it is not CEFR-complete. Structural validator result: `0 errors, 0 warnings, 95 review flags`.

## 2. A1 — 38 approved units

The approved grammar sequence is in `A1_CURRICULUM_TITLES` and `A1_GRAMMAR_TOPICS`. The implementation reuses confirmed legacy lessons rather than rewriting them.

| Implementation status | Number |
|---|---:|
| Fully reused existing grammar lessons | 15 |
| One partial lesson reused | 1 |
| Partial matches not assigned | 10 |
| No existing lesson | 12 |

The strongest implemented base is the legacy A1 course: 10 units, 226 vocabulary entries, 20 grammar concepts, 202 exercises, and complete legacy listening, reading, writing and speaking collections.

Key production gaps:

1. **22 of 38 approved A1 units have no complete target grammar lesson**: 12 have no existing lesson and 10 partial matches remain unassigned.
2. Alphabet and pronunciation are missing.
3. Personal pronouns in Nominativ, Akkusativ and Dativ are missing as separate topics.
4. Articles, articles with gender, indefinite articles and null articles are not fully separated.
5. Interrogative and demonstrative articles are missing.
6. Verbal vowel changes, imperative, compound verbs and final conjugation distinctions need authoring or deliberate splitting.
7. The modal-verb topic is only partial; `wollen` and `dürfen` are not taught by the existing reused lesson.
8. Legacy Unit 1 also contains lessons outside the approved Unit 1 topic. These are references, not copies.
9. The 38-unit curriculum has placeholder units 102–138 and no vocabulary, listening, reading, speaking or writing content except for explicitly reused grammar lessons.
10. Vocabulary for placeholder units must be authored around the approved grammar topic, not general themes.

### A1 unit roadmap

1. Author the 22 missing or incomplete grammar units.
2. Split combined legacy lessons only where the approved curriculum requires independent units.
3. Add all 38 units to the standard eight-section structure.
4. Add 38-unit vocabulary sets for the practical themes.
5. Complete RU/KY sentence translations and native-speaker terminology review.
6. Add German examples and Russian/Kyrgyz explanations to every exercise.
7. Add reading, listening, speaking and writing for every unit.
8. Remove or clearly record duplicate legacy lessons used as references.
9. Record a CEFR sign-off for each unit.

## 3. A2 — 43 approved units

`src/data/a2/curriculum.ts` contains the complete approved 43-topic grammar table. The implementation attached 13 suitable legacy lessons and left 30 approved topics unimplemented or only partially covered.

| Mapping status | Count |
|---|---:|
| Exact match attached | 8 |
| Semantic match attached | 5 |
| Partial match left empty | 13 |
| Cross-level candidate, not imported | 12 |
| No existing lesson / duplicate target | 5 |

The authored legacy A2 level has units 11–20 and a substantial implementation for the old 10-unit structure. It must not be presented as satisfying the 43-unit approved curriculum.

Major curriculum findings:

- Topics 17 and 36 duplicate *deshalb/deswegen*.
- A2 has combined legacy lessons that overlap 11–12 topics; the approved curriculum requires standalone units.
- `Perfekt` and `Partizip II`, reflexive verbs and reflexive pronouns, and comparison topics need clean topic separation.
- Futur I is not taught by the existing weather/future chunk.
- Imperative and `Konjunktiv II` require additional authoring or partial-coverage decisions.
- B1-only structures must not be imported into A2: infinitive with `zu`, adjectives without articles, genitive, relative clauses and pronominal adverbs.
- Genitivgrundlagen and indefinite pronouns need a final CEFR decision.
- Duplicate themes and overlapping structures must be handled without mapping the old 10 units wholesale to the new 43 units.

### A2 unit roadmap

1. Author 30 empty or incomplete approved units.
2. Decide whether to attach the 13 partial matches or explicitly mark them partial.
3. Split the combined legacy lessons into standalone units where required.
4. Resolve topics 17/36 duplication.
5. Complete the 43-unit vocabulary, exercises, reading, listening, speaking and writing content.
6. Add a real A2 level test; currently the validator reports that an A2 level test is missing.
7. Complete Russian and Kyrgyz native reviews for units 11–20.
8. Record CEFR review sign-offs for all 43 units.

## 4. B1 — 36 approved units

The approved 36-unit B1 curriculum is in `src/data/b1/curriculum.ts`. There are 29 approved grammar concepts in a separate 12-unit legacy plan and 36 new curriculum-v2 containers.

The old authored Units 21–32 are complete legacy data: 480 vocabulary entries, 29 authored grammar concepts, exercises, two readings and two listening texts per unit, speaking, writing and final tests. However, they implement the older 12-unit plan and must not be relabeled or assumed to complete the 36-unit curriculum.

The 36 curriculum-v2 units are empty containers except for referenced B1 grammar-v2 lesson metadata. The implementation has no automatic mapping from legacy Unit 21–32 to the new Unit 301–336.

| B1 implementation state | Count |
|---|---:|
| New v2 units | 36 |
| New v2 units with only grammar lesson metadata/content | 36 |
| Old authored legacy units | 12 |
| New v2 units with complete vocabulary/exercises/skills/assessment | 0 |

Major B1 findings:

- The old 12-unit domains and 36-unit one-topic design have overlapping grammar and themes.
- Mapping requires a new, topic-based editorial plan; exact title matching is insufficient.
- Text complexity is not monotonic and several texts are shorter than the target B1 band.
- Open CEFR decisions remain for passive, Nomen-Verb-Verbindungen, Zustandspassiv, Futur I, Genitiv, Plusquamperfekt, Konjunktiv II and Mittelfeld.
- Listening is text-to-speech only and has no real-device or natural-speech verification.
- The B1 level test does not assess listening and covers only 13 of 29 concepts.
- Kyrgyz terminology is AI-assisted and has no complete reviewed glossary.
- The content has no complete German/CEFR or native-language sign-off.

### B1 unit roadmap

The first pass should use the approved 36-unit table and make one topic complete per unit:

1. Units 301–303: past narration, sequence and tense comparison.
2. Units 304–306: Futur I, prepositional verbs and functional verb phrases.
3. Units 307–310: temporal and concession subclauses.
4. Units 311–314: infinitives and complex sentence connectors.
5. Units 315–317: relative clauses.
6. Units 318–320: all passive forms.
7. Units 321–324: Konjunktiv II and indirect speech.
8. Units 325–328: genitive and adjective/participle systems.
9. Units 329–332: word order, nominalization, style and concessive clauses.
10. Units 333–336: consecutive/final connectors and genitive/prepositional adverbs.

For every unit, author in this order:

1. Theme-specific 38–42 productive vocabulary items.
2. One complete primary grammar explanation.
3. Rules, exceptions, examples, mistakes and three-language translations.
4. 8–10 exercises.
5. Two reading texts and two listening texts.
6. One speaking scenario.
7. One main writing task and required micro-tasks.
8. 15-item unit test and unit final test.
9. Spaced-revision set and cross-level recycled vocabulary.
10. CEFR and native-language reviews.

## 5. B2 — NOT FOUND

No approved B2 grammar-topic or unit curriculum exists in the repository. `src/data/types.ts` and architecture documents allow B2 as a future level, but no authoring plan is registered in course content.

Production roadmap:

- Do not create B2 units by extrapolation.
- Obtain and record an owner-approved B2 unit/topic table.
- Define the stable unit IDs, titles and one primary grammar topic for every unit.
- Add a separate B2 content module and curriculum registry.
- Then produce vocabulary and all eight skill sections.

## 6. C1 — NOT FOUND

No C1 unit or approved grammar-topic plan exists. The course type and UI contain C1 only as architecture/UI scope.

Production roadmap:

- Define an owner-approved C1 curriculum.
- Specify communicative domains, productive versus receptive grammar, text bands and assessment.
- Obtain CEFR and native-speaker sign-offs before activation.

## 7. C2 — NOT FOUND

No C2 curriculum or unit plan exists. C2 appears only in journey UI and architecture documents.

Production roadmap:

- Obtain an approved C2 curriculum.
- Separate native-level mastery, precision, style and reception tasks from lower CEFR content.
- Do not treat C2 as a placeholder for adding more B2/C1 topics.

## 8. Cross-level production priorities

### P0 — curriculum integrity

- Preserve the 38/43/36 approved counts.
- Complete A1, A2 and B1 topic mappings using one primary grammar topic per unit.
- Add stable approved identities for A2 and B1 only from recorded owner approval.
- Mark or remove duplicate topics.

### P1 — content completion

**A1**

- 22 incomplete units
- Complete the standard eight sections for every unit

**A2**

- 30 incomplete/empty approved units
- 13 partial-match decisions
- Real A2 level test

**B1**

- 36 complete unit authoring passes
- Legacy 21–32 mapping decision
- Real listening assessment and 40-item assessment calibration

**B2/C1/C2**

- Approved curricula are required before unit authoring.

### P2 — localization and review

- Complete Kyrgyz explanations for 272 of 352 grammar/exercise L10n strings, per the validator's structural coverage report.
- Create one RU/KY grammar terminology glossary.
- Obtain native Kyrgyz review for all existing A2/B1 vocabulary and text.
- Obtain native Russian review for terminology and examples.
- Record source provenance for every adapted/external text.

### P3 — assessment and measurement

- Add a level test for A2.
- Resolve the B1 40-item versus 60-item assessment design.
- Add listening evidence to B1 level assessment.
- Equalize answer-option bias and correct-answer position distribution.
- Never present speaking/writing automation or an indicative level test as a CEFR certificate.
- Add CEFR and human review sign-offs for every unit.

## 9. One-topic validation checklist

Every production unit must satisfy all items below:

- Stable unit ID and approved German title
- Exactly one primary grammar topic
- Related practical theme
- Thematic vocabulary with article/plural/conjugation/preposition data where applicable
- Complete grammar rules and exceptions
- German examples
- Russian and Kyrgyz explanations
- Grammar exercises
- Vocabulary exercises
- Reading activity
- Listening activity
- Speaking activity
- Writing activity
- Unit assessment
- Source/provenance record
- CEFR review sign-off
- Russian review sign-off
- Kyrgyz review sign-off
