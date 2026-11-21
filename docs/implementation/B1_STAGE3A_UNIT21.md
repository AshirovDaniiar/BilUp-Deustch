# B1 Stage 3A — Unit 21 "Erlebnisse und Erinnerungen erzählen"

Unit 21 (permanent key `b1-erlebnisse-erinnerungen`) is authored and integrated. **B1 stays `planned`, `releasedLocales: []`, invisible to every learner and interface language (German never).** The content is an original, AI-assisted first draft: **no human CEFR, Russian or Kyrgyz review exists, and no official CEFR approval is claimed.** Nothing is committed; the 15 staged Storage/app files and A1/A2 content are untouched.

## Lesson structure (`src/data/b1/unit21/`, lazy chunk `b1-content-*.js`, 55.6 kB / 22.9 kB gzip)
| Component | Content |
| --- | --- |
| Vocabulary | **40** new items (target 38–42), ids `v21-1…40`; themes: Erinnerungen/Kindheit, Ereignisse/Begegnungen, Gefühle, Zeitadverbien, Verben des Erlebens; each with article/plural, German example, Russian and Kyrgyz translation of word **and** example; **no A1/A2 lemma repeated** (6 duplicates found by the overlap check were replaced) |
| Grammar | exactly the two approved concepts: `b1-praeteritum-erzaehlen` (P-lim, H; closed list of 35 verbs) and `b1-temporale-konnektoren` (P, M; bevor/während/seitdem/bis/nachdem + Perfekt); explanation, 5 examples, 4 typical mistakes, 3 real-life sentences, dialogue, speaking prompt, 3 "why?" notes — all ru + ky |
| Reading | 2 original texts (116 and 108 words; band 100–150): *Meine erste Nacht in Deutschland* (a difficult journey), *Mein erster Marathon* (a personal achievement); 3 questions each, glosses ru + ky |
| Listening | 2 scripts (128 and 116 words; band 110–140): *Zufällig getroffen* (a memorable encounter), *Unser erster Winter* (an important decision, memories); every line translated ru + ky; 4 questions each |
| Speaking | 1 scenario, 5 turns, the interlocutor doubts (unexpected element), hints and expected words, all ru + ky |
| Writing | 1 task, 70 words minimum, 5 expected elements, model text (81 words), 4 tips ru + ky |
| Exercises | 10: 8 on the two concepts (fill/choice/order) + 2 recycled A2 items (Perfekt, weil-clause) = the spaced-revision exercises |
| Review (spaced) | unit metadata `revision`: 4 words of Unit 20, 2 of Unit 18, 2 more from A2; A2 bridge recap of 4 concepts |
| Final test | `unit-21`, 15 questions: 8 grammar (6 on the concepts, 2 ↻ A2), 3 vocabulary, 4 reading; **0 listening** (audio unverified); answer positions 5/5/5 |
| Metadata | `B1_META[0]`: 3 can-do goals, objectives for the 4 skills (de + ru + ky), difference from A2, classification, 4 repair chunks, reading strategy, topic evidence (feelings) |

Texts stay inside the approved scope: Präteritum only of the 35-verb list (+ A2 modals), Perfekt in dialogue, no Plusquamperfekt, Passiv, Relativsatz, Infinitiv mit zu, obwohl/damit, Genitiv, Konjunktiv, adjectives without article (a test scans for these).

## Assessment honesty
The existing analysers return scores with high floors and detect only A1-era errors, so **B1 never shows them**: `src/services/feedback-mode.ts` (`usesChecklistFeedback`: B1, B2, C1) switches the writing and speaking labs to a transparent checklist (length reached, expected elements/words used), the disclosure "the app checks only length and expected words — not a language grade, level or exam", a learner **self-assessment** (writing rubric of 4 criteria × 3 learner-worded levels; speaking self-check; chips, not stored), and the model text. No numeric score or percentage is shown, recorded in the skill statistics, or used for mistake tracking; completion/XP follow the existing participation rule (evidence `self-reported`). 28 new `fb_*` interface keys (ru, ky, de; the Kyrgyz is an unreviewed AI draft). **A1/A2 feedback is unchanged** (A2 still shows its analysis scores — a separate decision, blocker B-9).

## Integration
`b1-content.ts` (units, vocabulary, grammar, why-notes, exercises, listening, reading, speaking, writing, tests, `unitSpeaking`, final test) · `B1_META` (`unit21/meta.ts`; types moved to `meta-types.ts` to avoid an import cycle that the boundary report caught) · catalog selectors, routes, the `unit-21` test, review and labs work through the **lazy loader** (verified with the real app in ru and ky; B1 switched to Beta inside the test only and restored). Validator: **0 errors, 0 warnings, no `b1-*` issue**; the only new review flag is Unit 21's missing human CEFR sign-off (32 flags in total).

## Listening / audio — what is and is not implemented
Listening uses the **existing** listening lab: each script is shown as a transcript with ru/ky translations and played through the browser's text-to-speech. **No audio file exists. Playback was not verified on any real device** (jsdom has no speech synthesis), so no test item depends on audio and nothing here claims functional audio. Real-device verification stays blocker B-7.

## Changes to existing files (each for a legitimate reason; no expectation was loosened to hide a failure)
`WritingLab.tsx`, `SpeakingLab.tsx` (B1 checklist mode), `i18n/{ru,ky,de}.ts` (+28 keys), `tests/i18n.test.ts` (key baseline 289 → 317, with the reason recorded), the A2 validation tests (`unit-11…20`, `a2-beta-readiness`: scoped to the A2 world through `withoutB1Content`, because they describe A2's own validation state and B1 now has a real unit; the B1 effect on A1/A2 output is tested separately), `metadata.test`/`unit-11` (a test that said "no unit ≥ 21 exists" now says "no A2 unit ≥ 21"), the Stage 1/2D tests that said "B1 holds no content", and `lazy-chunk.test` (new Unit 21 isolation test).

## Results
Full suite **81 files / 2250 tests passed** (was 79 / 2209); `content:validate` 0 errors, 0 warnings, 32 flags; `content:validate:release` 44 errors (unchanged); typecheck, build, format:check clean; lint 0 errors, the same 8 warnings; boundaries: the same 5 pre-existing violations, 0 cycles. Entry bundle 577 → 586.5 kB raw (+9 kB: the 28 UI strings × 3 languages and the checklist components); the B1 chunk is lazy and not precached.

## Limitations
Unreviewed AI-assisted German, Russian and **especially Kyrgyz** (no native review; the B1 grammar-terminology glossary is still missing, B-5); the CEFR suitability of every text is unverified; of the scenarios named in the curriculum only one speaking scenario and the two dialogues exist (e.g. "explain a delay and apologise" is not authored); no micro-task (not required in Unit 21); no learner-instructions collection and no AI-tutor content; the spaced-revision set lives in the metadata and the two recycled exercises — the app does not revise A2 words automatically inside B1 (B-12); the writing/speaking checks are substring/keyword based; A2 words used in examples are assumed known.
