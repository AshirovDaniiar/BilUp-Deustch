# A2 authoring guide

This is the contract for writing the ten A2 units of BilUp Til. It is enforced by the content validator (`scripts/content-validate`); a test keeps this guide in agreement with the validator's conventions and schemas.

**State today:** A2 is *planned* and *invisible*. Only the pilot unit 11 is authored (Stage 7A); it is the reference for the content standard — see `docs/authoring/A2_UNIT11_CEFR_REVIEW.md` for what a reviewer must decide. Units 12–20, the level test and the placement extension are still empty. A2 becomes visible only when its content passes release validation and a human has approved it (see §10).

## 1. Principles

1. **Identity is metadata, not a name.** Ownership and behaviour come from explicit fields (`unit`, `kind`, `level`, `size`); the application never parses an id. IDs follow conventions (§2) only so they are predictable and never collide.
2. **The level of an item is the level of its parent unit.** An item belongs to A2 because its `unit` is 11–20. Never rely on the item's own `level` tag; it must agree with the unit.
3. **Russian and Kyrgyz are independent.** Both are authored, both reviewed. Neither is ever a fallback, a draft or a copy of the other (§5).
4. **Nothing is invented.** No placeholder text, no made-up sources, no auto-translation.
5. **Practice and assessment are separate.** Eight revision exercises and fifteen final-test questions per unit, authored separately (§7).

## 2. ID conventions

| Kind | Form (unit 11 shown) | Notes |
| --- | --- | --- |
| Unit key | `a2-ueber-mich` | `a2-<slug>`; permanent, never reused; the numeric unit id (11–20) stays the key of progress and routes |
| Vocabulary | `v11-<n>` | `n` = 1, 2, 3 … within the unit |
| Grammar concept | `a2-<kebab-case>` | descriptive, e.g. one concept id never changes meaning |
| Revision exercise | `a2-ex-11-<nn>` | `nn` = 01 … 08 |
| Article drill | `art-v11-<n>` | generated from the noun `v11-<n>` of the **same unit** |
| Listening dialogue | `a2-li-11-<nn>` | |
| Reading text | `a2-re-11-<nn>` | |
| Writing task | `a2-wr-11-<nn>` | |
| Speaking scenario | `a2-sp-<unit>-<nn>` | the unit part is the unit it is assigned to |
| Unit test | `unit-11` | the unit's final test definition |
| Level test | `level-a2` | exactly one |
| Placement test | `placement-a2` | exactly one |
| Final-test question | `a2-ft-11-<nn>` | `nn` = 01 … 15 |
| Placement item | `a2-pl-<nn>` | |
| Tutor template | `a2-tt-<kebab-case>` | |
| Learner instruction | `a2-in-<kebab-case>` | |

Rules: ids are unique across **all** levels; an id is never reused or given a new meaning; a removed item keeps its id retired. A convention violation is a *warning* while authoring and an *error* in a release.

## 3. The ten units (the approved plan)

The plan lives in `src/data/a2/registry.ts`. It holds **stable identity only** — no Russian/Kyrgyz text.

| Unit id | Stable key | Approved German title |
| --- | --- | --- |
| 11 | `a2-ueber-mich` | Über mich und meine Erfahrungen |
| 12 | `a2-familie-freunde` | Familie, Freunde und Zusammenleben |
| 13 | `a2-wohnen-nachbarschaft` | Wohnen und Nachbarschaft |
| 14 | `a2-gesundheit` | Gesundheit und Wohlbefinden |
| 15 | `a2-essen-einkaufen` | Essen, Einkaufen und Dienstleistungen |
| 16 | `a2-freizeit-medien` | Freizeit, Medien und Kultur |
| 17 | `a2-schule-beruf` | Schule, Ausbildung und Beruf |
| 18 | `a2-reisen-urlaub` | Reisen, Urlaub und Mobilität |
| 19 | `a2-stadtleben` | Stadtleben und öffentliche Dienste |
| 20 | `a2-plaene-einladungen` | Pläne, Einladungen und gemeinsame Entscheidungen |

An authored unit (in `src/data/a2/units.ts`) must match its plan entry: same `id`, same `key`, `title` equal to the approved German title, `level: 'A2'`. A unit that is not in the plan cannot hold content.

**Ownership:** every item names its unit (`unit: 11`). A unit's concepts, vocabulary and revision exercises may reference only that unit (`ref-cross-unit`); nothing in A2 may reference A1 (`ref-cross-level`).

## 4. Content types: required and optional fields

Unless noted, text fields are non-empty. "L10n" = an object with **both** `ru` and `ky`. Optional fields are marked *(optional)*. The authoritative tables are `A2_SCHEMA` and `A2_LOCALIZATION` in the validator.

### units
`id`, `key`, `level` (`A2`), `title` (German), `subtitle` (L10n), `icon`, `grammarIds` (non-empty; each concept belongs to this unit).

### vocabulary
`id`, `unit`, `pos` (`noun | verb | adj | phrase | other`), `de`, `ru`, `ky`, `example`, `exampleRu`, `exampleKy`, `related` (ids of words of the same unit; may be empty). A noun requires `article` (`der | die | das`); `plural` *(optional)*. Only a noun has an article.

### grammar
`id`, `category`, `level`, `unit`, `title`, `summary`, `discover`, `why` (all L10n), `when` (non-empty list of L10n), `examples` (non-empty; each `de`, `ru`, `ky`, `focus` *(optional)*), `mistakes` (each `wrong`, `right`, `note` L10n), `reallife` (each `de`, `ru`, `ky`), `visual`, `dialogue` (each `speaker`, `text`, `ru`, `ky`), `speakPrompt` (`prompt` L10n, `sample`, `keywords` non-empty), `source`.

### exercises
Revision (Wiederholung) exercises. `id`, `type` (`choice | fill | order | article`), `unit`, `concept` *(optional; a concept of this unit)*, `prompt`, `promptRu`, `promptKy`, `answer`, `why` (L10n); `options` for `choice`, `fill` and `article` (at least two, distinct, containing `answer`; an article exercise offers exactly `der / die / das`); a `fill` prompt has exactly one blank `___`; an `order` exercise lists its scrambled `words`, which must match the answer sentence.

### listening
`id`, `unit`, `level`, `title`, `lines` (non-empty; each `speaker`, `text`, `ru`, `ky`), `questions` (non-empty; §6), `keywords`, `source`.

### reading
`id`, `unit`, `level`, `title`, `body` (non-empty list of paragraphs), `gloss` (each `word`, `ru`, `ky`, `example`, `grammar`, `grammarKy`, `related`), `questions` (non-empty; §6), `source`.

### speaking
`id`, `title`, `titleRu`, `titleKy`, `icon`, `level`, `goal` (L10n), `turns` (non-empty; each `ai`, `aiRu`, `aiKy`, `hints` non-empty, `keywords` non-empty), `source`. The scenario is assigned to its unit through `A2_UNIT_SPEAKING` (position 0 = unit 11).

### writing
`id`, `unit`, `level`, `title`, `situation` (L10n), `formal`, `minWords`, `mustInclude` (non-empty; each `label`, `patterns` non-empty), `model`, `tips` (L10n list), `source`.

### tests
Test definitions. `id`, `title` (L10n), `kind` (`topic | level | placement | …`), `level`, `size` (a positive integer), and for a `topic` test the `unit` it belongs to. The unit page shows `size`; it must equal the number of authored questions (§7).

### finalTests
Authored final-test questions, one entry per unit: `unit` and `questions`. Each question: `id`, `prompt`, `promptRu`, `promptKy`, `options` (at least two, distinct), `answer` (the text of the correct option), `skill`, `why` (L10n), `concept` *(optional)*.

### placementItems
Authored placement items: the same fields as a final-test question plus `band` (`low | mid | high`).

### tutorTemplates
`id`, `kind`, `text` (L10n), `unit` *(optional)*, `placeholders` *(optional)*.

### instructions
`id`, `scope`, `text` (L10n), `unit` *(optional)*.

## 5. Localization rules

* Every localised field needs **Russian and Kyrgyz**, written separately. A field with only Russian is invalid — there is no fallback at runtime for A2 (`trStrict` returns nothing rather than another language).
* Empty, whitespace-only and placeholder text (`TODO`, `TBD`, `???`) are invalid.
* Kyrgyz that equals the Russian is invalid. A single short word that is genuinely identical (a name, a loanword, a number) raises a *review* flag; a vocabulary word may be allow-listed in `scripts/content-validate/reviews.ts` (`SAME_AS_RU`) — never a sentence.
* German content (the target language) must not be empty.
* Both languages get a human review (§9); the release gate requires the sign-off for every language the level is released for.

## 6. Answer options and the correct answer

* **Listening and reading questions:** `{ q, options, answer }` where `answer` is the **index** of the correct option in `options`. Three options (other counts warn), each non-empty, no two the same.
* **Exercises, final-test and placement questions:** `answer` is the **text** of the correct option, and it must be one of the options.
* Authors do not control the order students see: the app shuffles listening and reading options per attempt. The validator still tests the *authored* positions (an exact binomial test) and flags a concentration in one position, so aim for an even spread.

## 7. Revision exercises, final tests, level test, placement

* **8 revision (Wiederholung) exercises per unit** (type other than `article`), practising the unit's own concepts.
* **15 final-test questions per unit**, authored **separately**: a final-test question may not reuse a revision exercise (same prompt and answer, or the same id). The unit's `unit-<n>` definition has `size: 15`.
* **One level test** (`level-a2`, kind `level`): a definition composed from A2's own pools.
* **Placement extension:** authored `placementItems` (at least six, spread over `low`, `mid`, `high`) and one `placement-a2` definition whose `size` equals the number of items. No A2 placement is offered until they exist.
* Per unit minimum: 28 vocabulary items, 2–3 grammar concepts, 2 listening dialogues, 1–2 reading texts, 1 speaking scenario, 1 writing task.

## 8. Provenance and references

* Every reading text, listening dialogue, grammar concept, speaking scenario and writing task declares `source`: `{ kind: 'authored', author }`, or `{ kind: 'adapted' | 'external', citation, license, url? }`.
* Citations and licences must be real. Placeholders (`TODO`, `n/a`, `unknown`) are errors. A URL must be http(s); the validator never fetches it, so a URL raises a *review* flag for a person to confirm.
* Never invent a source to make validation pass: write what is true, or do not use the material.

## 9. CEFR review and sign-off

Automated checks cannot establish that German text is A2. The validator checks the declared level against the unit, raises **review flags** for length, long sentences and B1+ constructions, and **requires a recorded human sign-off** per unit with content.
A reviewer records it in `scripts/content-validate/reviews.ts` (`A2_REVIEWS[11] = { cefr: true, ru: true, ky: true, reviewer, date }`). Only a person adds an entry. Release is blocked while a unit lacks a sign-off for the CEFR level or for a language the level is released for.

## 10. Validating

```
npm run content:validate                 # authoring: gaps in a planned level are information; invalid content is an error
npm run content:validate:release         # release: every gap and every missing sign-off is an error
```

* Authoring validation must report **0 errors** at all times; review flags and warnings are for the reviewer.
* **Release validation must pass before A2 is made visible** (`COURSE.levels[A2].status` beta/released with `releasedLocales`). It currently **fails on purpose** — there is no A2 content. A visible level is always validated as a release.
* The validator is offline and deterministic. It reads `fullBundle()`, which includes every A2 module automatically.

**Never:** add Russian-only or Kyrgyz-only content, copy one language into the other, reuse exercises as final-test questions, add placeholder content, or change A1 data.

## 11. Tutor-facing content (schema only)

`tutorTemplates` hold localised AI-Tutor response templates; `instructions` hold language-specific learner instructions. Both need independent Russian and Kyrgyz text. A template's `{placeholders}` must be **declared** and used **identically in both languages**. The tutor itself is migrated in its own stage; these structures only ensure A2 content can carry what it will need, with no language standing in for another.
