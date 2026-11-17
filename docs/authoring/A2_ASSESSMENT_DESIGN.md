# A2 assessment design — Level Test and Placement Test (proposal)

Status: **design proposal only (Stage 9A). Nothing is implemented, nothing is approved.** Findings about the existing architecture: `docs/implementation/A2_STAGE9A_ASSESSMENT_AUDIT.md`. All numbers below are proposals for a decision; they are not calibrated against real learner data.

## 0. Principles

1. **Honesty about what is measured.** A short multiple-choice test measures recognition of vocabulary, grammar and reading/listening comprehension at A2. It does **not** establish speaking or writing proficiency, and neither test may claim a CEFR certificate. Both say: "a recommendation, not a certificate".
2. **A2 stays invisible** until the release decision. Both tests are gated by the same level-visibility rule as every A2 route.
3. **Separate from unit tests.** Unit tests (`unit-NN`, 15 authored questions, 70 % to complete the unit section) keep their meaning and their stored results; the new tests have their own ids, results and retention.
4. **RU and KY independent.** No Russian fallback in Kyrgyz (strict localization, as for all A2 content).
5. **Receptive vocabulary is never required** (as in the units).
6. **Reuse before invention:** use the existing authored banks where honest, and author new items only where the blueprint needs evidence the banks do not give.

## 1. A2 Level Test (`level-a2`)

### 1.1 Purpose
A cumulative check after Units 11–20: "has the learner mastered the A2 content of this course?" It is an achievement test of the course, aligned to the A2 progression, not a placement.

### 1.2 Structure (proposal: 40 questions, 5 parts)

| Part | Items | Source | Notes |
| --- | --- | --- | --- |
| A Vocabulary | 8 | one meaning/usage item per two units from the authored final-test vocabulary items (30 exist: 3 per unit) | each unit represented at least once across A+B; receptive words allowed only as options, never as the required answer |
| B Grammar | 14 | final-test grammar items of the approved concepts (73 exist; all 27 A2 concepts are represented) | every one of the 11–20 units' concepts at least once; weighted to the A2 core (Perfekt/Präteritum of sein/haben/modals, adjective endings after article words, comparison, Imperativ + sollen/dürfen, polite requests, preferences and verb + preposition, connectors weil/dass/deshalb/wenn/denn, prepositions of place and destination, *man*, indirect questions (≤ 1), future with Präsens) |
| C Reading | 8 | final-test reading items (47 exist) + the lab reading questions (2 texts × 3 per unit) | at least 4 text types (message/e-mail, notice/sign, form, advertisement, short report); German passage in the question, translations only of the question |
| D Listening | 6 | the authored listening dialogues' questions (20 dialogues × 4 exist) | played through the existing text-to-speech (`audio` field); technical verification of audio on target devices is a prerequisite (audit D-9). If audio cannot be verified, D is replaced by 6 more C items and the test is declared **"reading-based"** |
| E Practical language use | 4 | **new** situational items (choose the appropriate reaction: register du/Sie, polite request, accepting/declining an invitation, asking the way) | the only newly authored part; separate from final tests and exercises (validator rule) |

Position of the correct answer balanced (as in the units); no item repeats a prompt of a revision exercise.

**Reuse caveat:** items taken from unit final tests have been seen by a learner who took those tests. The level test is therefore *cumulative*; it must say so, and a fresh authored bank (≥ 80 items) is the later improvement if a stricter, independent test is wanted. This is a decision for the owner (§5).

### 1.3 Time
Recommended 45 minutes, **no hard time limit** (adult learners, reading difficulty, accessibility); the screen shows an elapsed-time indicator only. No time-based scoring.

### 1.4 Scoring and result
* One point per correct item; no negative marking; the order of options is randomised per attempt (existing behaviour, `answerOrder.ts`).
* **Pass: ≥ 70 % overall** (the course-wide assessment threshold of the progress policy), **and** no part below 40 % (a learner who cannot read or cannot understand any listening cannot "pass A2"): otherwise the result is "70 % reached, but part X needs work".
* Result bands: `< 50 %` "not yet — review units listed" · `50–69 %` "almost — review the weak concepts" · `≥ 70 %` "passed".
* Report by part and by concept (the existing `weak`/`strong` lists) and link each weak concept to its unit.
* Statement shown with every result: *"This test checks reading, listening, vocabulary and grammar. Speaking and writing are practised in the units and are not measured here."*
* Retake: allowed any time; each attempt stored.

### 1.5 RU/KY
All learner texts come from authored A2 items with strict `ru` and `ky`; new interface strings (test title, instructions, part names, result statements, the "not a certificate" statement, the time indicator) are added to both dictionaries and authored independently; the German interface falls back to nothing for A2 (as the A2 UI today). Instructions are `LearnerInstruction`-style entries (new scopes `level-test` and `placement`), reviewed like all A2 text.

### 1.6 Storage
Separate from unit tests: the result record has its own id (`level-a2`), the blueprint version, the part scores, the outcome, the time spent and the attempt date. See the audit for the storage options; the proposal is to **extend the existing `tests[]` record with optional fields and protect level/placement results from the 50-entry eviction** (the least invasive path), not to share a bucket with unit-test retention. Level-test results never complete a unit section and never alter unit denominators.

## 2. A2 Placement Test (`placement-a2`)

### 2.1 What it answers
A recommendation of the starting point for a learner who says they already know some German. Three outcomes — and the third is a legitimate, first-class result:

| Outcome | Meaning | Recommended action |
| --- | --- | --- |
| **A1 readiness** | the learner's A1 evidence is not secure | start (or continue) A1 at the unit of the weakest A1 band |
| **A2 readiness** | A1 evidence is secure and A2-core evidence is adequate | start A2 at Unit 11; optionally skip known units later (not part of this proposal) |
| **Insufficient evidence** | results are inconsistent, too many items skipped/"don't know", or the score sits in the uncertain zone | offer to take the A1 unit tests / the A2 Unit 11 test, or retake the placement; no label of level is shown |

### 2.2 Structure (proposal: 24 items, calibrated bands)

| Band | Items | Content | Source |
| --- | --- | --- | --- |
| A1-secure (low) | 8 | A1 content of units 5–10 (Perfekt basics, modals, Akkusativ/Dativ, weil, time, separable verbs) | existing A1 exercises are *not* reused as such: new authored items (validator rule: placement items are authored separately) |
| Bridge (mid) | 8 | Units 11–13 level | new |
| A2-core (high) | 8 | Units 14–20 level (Imperativ/sollen, polite requests, preferences, connectors, prepositions, *man*) | new |

* Every item has a visible "I don't know / Не знаю / Билбейм" option (authored in both languages, counted as "no evidence", not as wrong) to discourage guessing; three-option items give a 33 % chance level, so the thresholds sit well above it.
* Adaptive branching is **not** proposed (complexity and calibration); a fixed form with bands is simpler to validate and review.
* The existing validator already requires ≥ 6 authored items, all three bands, size = number of items, and separation from finals/exercises.

### 2.3 Decision rule (proposal, uncalibrated)
Let `low`, `mid`, `high` be the proportion correct in each band, `dk` the number of "I don't know" answers.

| Condition | Outcome |
| --- | --- |
| `dk > 8` (a third of the items) | insufficient evidence |
| `low < 0.60` | **A1 readiness** (recommend the A1 unit of the weakest area) |
| `low ≥ 0.75` and `mid ≥ 0.70` and `high ≥ 0.60` | **A2 readiness** |
| `low ≥ 0.60` and not the A2 rule, and (`high > mid + 0.25` or `mid < 0.40` while `high ≥ 0.60`) — i.e. an inconsistent pattern | insufficient evidence |
| any other combination in the middle | insufficient evidence |

The rule deliberately produces *insufficient evidence* rather than a forced label when the data are ambiguous. With 8 items per band the sampling uncertainty is large (a learner with a true 70 % rate will fall below 60 % in a band about one time in four): hence the wide uncertain zone, the wording "recommendation", and the retake option. The thresholds must be revisited after a pilot with real learners; no claim of accuracy is made until then.

### 2.4 What it must say
"This short test suggests where to start. It cannot show your speaking or writing level and it is not an official CEFR result." Outcome texts for all three outcomes in RU and KY.

### 2.5 Relation to the existing A1 placement
The existing A1 `placement` test (12 A1 questions, bands relative to A1 units, three score bands 35 % / 75 %) tests A1 only; its top band currently reads "A2 →" only when A2 is available to the learner. Proposal: when A2 is visible, an A1-placement top-band result **offers the A2 placement** instead of implying A2 readiness; the A1 test itself is not modified.

## 3. Blueprint rules for the authored items (both tests)

* Each item: id, skill, concept/unit tag, band (placement), RU and KY (`promptRu`/`promptKy`, `why` strict), exactly one correct option, three options, balanced positions.
* No reuse of a revision exercise or placement item as a level-test item; level-test items reused from unit finals are declared as such (the audit explains the validator consequence).
* Coverage matrix (concept × part) checked by a test; each unit 11–20 contributes ≥ 3 level-test items.
* New items pass the **human review system** (a pseudo-unit "level/placement" needs packages and records for the three dimensions: an extension of Stage 8A, listed in the plan).

## 4. What is explicitly not proposed
No speaking or writing scoring; no timer-based scoring; no adaptive testing; no certificate or CEFR claim; no automatic skipping of units; no change to the A1 tests; no link between the tests and the release gate.

## 5. Decisions needed from the owner
1. Level test items: reuse of unit-final-test items (cumulative, cheap) **or** a fresh authored bank (independent, ≈ 80 new items to author and review).
2. Include the listening part (requires audio verification) or declare the first release reading-based.
3. Pass rule: 70 % overall plus the 40 % part floor, or 70 % overall only.
4. Whether the level test earns XP (the current `assessment` policy pays XP per first-time correct answer).
5. Placement: approve the three-outcome model and the "I don't know" option; approve the provisional thresholds as a pilot starting point.
6. Storage: optional-field extension with protected retention (proposed) vs a new storage slice (requires a persistence schema decision).
