# B1 identities and id conventions (permanent)

**Status:** the owner approved the B1 product design (curriculum v2) on 2026-11-20 — see `B1_CURRICULUM_V2_APPROVAL.md` §10 and `scripts/content-validate/b1/approval.ts`. This is **not** an official CEFR approval; the ⚑ grammar decisions are still pending independent expert verification. B1 stays `planned`, with no released locale, invisible to every learner (German interface never). No B1 lesson exists.

An id is only a **name**: identity, ownership and behaviour come from explicit metadata (`unit`, `kind`, `level`, `size`); the application never parses an id. The conventions make ids predictable and collision-free. They are enforced by the validator (`scripts/content-validate/conventions.ts`, `rules/identity.ts`) and tested in `tests/content-validate/b1-approval.test.ts`.

## Rules for every permanent id
1. **Never reused, never renamed, never given a new meaning.** A removed item keeps its id retired.
2. A unit's numeric id is the key of progress, routes and storage; it is global and unique across levels. Legacy units use 21–32; curriculum-v2 units use 301–336.
3. A change to an approved identity (unit key/title, concept id) is a **recorded curriculum change**: dossier + `registry.ts` / `curriculum.ts` + test, together — never an accident (the frozen-identity test fails otherwise).
4. Ids are unique across **all** levels; B1 ids carry the level prefix `b1-` (vocabulary keys carry the unit number).

## Units (`src/data/b1/registry.ts`, `B1_UNIT_PLAN`)
| Id | Key | Titel (Deutsch) |
| --- | --- | --- |
| 21 | `b1-erlebnisse-erinnerungen` | Erlebnisse und Erinnerungen erzählen |
| 22 | `b1-meinungen-diskussion` | Meinungen äußern und diskutieren |
| 23 | `b1-arbeit-bewerbung` | Arbeit, Bewerbung und Karriere |
| 24 | `b1-wohnen-umwelt` | Wohnen, Umzug und Umwelt |
| 25 | `b1-gesundheit-lebensstil` | Gesundheit, Beziehungen und Lebensstil |
| 26 | `b1-medien-technik` | Medien, Technik und Nachrichten |
| 27 | `b1-konsum-reklamation` | Konsum, Geld und Reklamation |
| 28 | `b1-bildung-zukunft` | Bildung, Lernen und Zukunftspläne |
| 29 | `b1-reisen-kultur` | Reisen, Kultur und Alltag im Vergleich |
| 30 | `b1-gesellschaft-engagement` | Gesellschaft, Zusammenleben und Engagement |
| 31 | `b1-behoerden-recht` | Behörden, Verträge und Alltagsprobleme |
| 32 | `b1-rueckblick-pruefung` | Rückblick, Bilanz und Prüfungsvorbereitung |

An authored unit must match its plan entry exactly (`id`, `key`, `title` = the German title, `level: 'B1'`). A unit not in the plan cannot hold content.

The visible curriculum-v2 units are separate containers, numbered 301–336 by display position. Their vocabulary ids use the unit's numeric id, for example `v301-1`; they do not reuse legacy ids such as `v21-1`.

## Item id conventions (unit 21 shown)
| Kind | Form | Notes |
| --- | --- | --- |
| Unit key | `b1-<slug>` (letters and hyphens) | from the plan |
| **Vocabulary key** | `v21-<n>` | `n` = 1, 2, 3 … within the unit, no leading zero; the unit number is part of the key, so the ids of different units never collide |
| Grammar concept | `b1-<kebab-case>` | the 29 approved ids (below); no others |
| Revision exercise | `b1-ex-21-<nn>` | `nn` = 01 … 10 |
| Article drill | `art-v21-<n>` | generated from the noun `v21-<n>` of the same unit |
| Listening text | `b1-li-21-<nn>` | exactly 2 per unit |
| Reading text | `b1-re-21-<nn>` | exactly 2 per unit |
| Writing task / micro-task | `b1-wr-21-<nn>` | the main task is `01`; micro-tasks (notes, opinion, mediation) follow |
| Speaking scenario | `b1-sp-21-<nn>` | the unit part is the unit it is assigned to |
| Unit test | `unit-21` | one `topic` definition per unit, `size` = 15 |
| Level test | `level-b1` | exactly one (not yet authored) |
| Placement test | `placement-b1` | not planned for the first Beta |
| Final-test question | `b1-ft-21-<nn>` | `nn` = 01 … 15 |
| Placement item / tutor template / instruction | `b1-pl-<nn>` / `b1-tt-<kebab>` / `b1-in-<kebab>` | only if ever authored |

**Vocabulary rules (keys and content):** legacy B1 Units 21–32 reject a NEW word that repeats an A1/A2 lemma (`b1-vocab-repeats-earlier-level`, unless a `vocabularyAllowances` entry explains the new sense) and reject repeated lemmas across legacy B1; they target 38–42 new items. Curriculum-v2 Units 301–336 allow reuse across Units and CEFR levels and reject duplicate lemmas within one Unit (`b1-vocab-duplicate-in-level`); they follow their own source counts (Units 301–320 have 25 items each in the current import). Optional new-sense allowances are validated when supplied. Both `ky` translations and `exampleKy` are authored, never copied from Russian.

## The 29 approved grammar concept ids
| Unit | Concepts | Proficiency (enforced) |
| --- | --- | --- |
| 21 | `b1-praeteritum-erzaehlen`, `b1-temporale-konnektoren` | P-lim (≤ 35 verbs), P |
| 22 | `b1-konzessive-saetze`, `b1-doppelkonnektoren`, `b1-adjektive-dativ-genitiv` | P, P, P |
| 23 | `b1-relativsaetze-nom-akk`, `b1-infinitiv-mit-zu` | P, P |
| 24 | `b1-passiv-praesens` ⚑, `b1-adjektive-ohne-artikel` | P, P |
| 25 | `b1-konjunktiv2-ratschlaege`, `b1-reflexive-dativ` | P, P-lim (≤ 10 verbs) |
| 26 | `b1-passiv-praeteritum-modal`, `b1-lassen` ⚑, `b1-wiedergeben-indikativ` | P, P-lim, P |
| 27 | `b1-konjunktiv2-wuensche-irreal`, `b1-genitiv-praepositionen` ⚑ | P, P-lim |
| 28 | `b1-futur1-vermutungen` ⚑, `b1-falls-sobald-solange`, `b1-verben-praepositionen` | P-lim, P, P-lim (≤ 20 verbs) |
| 29 | `b1-relativsaetze-dativ-praeposition`, `b1-genitivattribute` ⚑, `b1-plusquamperfekt-nachdem` ⚑ | P, **R**, P |
| 30 | `b1-nomen-verb-verbindungen` ⚑, `b1-konsekutiv-final`, `b1-textkohaesion` | P-lim (≤ 20), P, P-lim |
| 31 | `b1-formelle-sprache`, `b1-aktiv-passiv-zustandspassiv` ⚑ | P, P |
| 32 | `b1-nebensaetze-integration`, `b1-satzbau-mittelfeld` ⚑ (revision, no new grammar) | P, P |

⚑ = pending independent expert verification (decisions D-1…D-15 of the dossier). **Genitivattribute is enforced as R**: the dossier says "R-first; P-lim ⚑", and an uncertain classification is never silently upgraded; a closed productive set is the pending upgrade. Passiv Perfekt, Partizip I/II als Adjektiv, *sich lassen*, Konjunktiv II der Vergangenheit and the other receptive-only constructions are receptive and are declared per unit in the metadata (`receptiveOnly` / `constructions`).

## What is deliberately NOT defined yet
The vocabulary entries for curriculum-v2 Units 301–320 are authored separately from the legacy unit plan above; Units 321–336 have no vocabulary yet. `B1_META` (legacy unit metadata: objectives in German + Russian + Kyrgyz, scenario ids, strand items) remains scoped to the legacy units and stays unchanged until those units are authored.
