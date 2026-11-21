# B1 Unit 22 — content blueprint: "Meinungen äußern und diskutieren"

**Status: BLUEPRINT. Unit 22 is NOT authored** — no vocabulary entry, text, exercise, test or metadata of Unit 22 exists in the repository, and B1 stays `planned` and invisible. This document turns the owner-approved allocation (`B1_CURRICULUM_V2_APPROVAL.md` §2/§3, `B1_ID_CONVENTIONS.md`) into a precise authoring plan, using the validator's actual requirements (`B1_STAGE2C_VALIDATOR.md`) and the lessons of the Unit 21 audit (`B1_STAGE3B_UNIT21_AUDIT.md`). Every German sentence below is an *illustration of a pattern*, not final content. No CEFR approval is claimed; all Russian/Kyrgyz wording below is a **candidate for reviewers**, not approved text.

## 1. Approved identity and contract
| Item | Value (approved, permanent) |
| --- | --- |
| Unit id / key / title | **22** · `b1-meinungen-diskussion` · *Meinungen äußern und diskutieren* |
| Concepts (3) | `b1-konzessive-saetze` (**P**, load M) · `b1-doppelkonnektoren` (**P**, M; with receptive constructions) · `b1-adjektive-dativ-genitiv` (**P**, L) — all `role: new`, **no ⚑ decision** attached to this unit |
| Requirements (validator) | difference-from-A2 statement · comparison phrases (≥ 3, ≥ 2 occurring in the unit's texts) · A2 revision in the review set · repair chunks (≥ 3) · strategy note · scenario with an unexpected element |
| Band 21–22 targets | vocabulary **38–42** · 2 readings of **100–150** words · 2 listening texts of **110–140** words · sentences p95 ≤ 16 / max ≤ 22 · speaking scenario **5–6** turns · main writing task `minWords` **70–80** (formal ≥ 60) |
| Counts | 8–10 exercises (hand-written) · final test **15** = grammar 8 / vocabulary 3 / reading 4 / listening 0 (until real-device audio is verified) · ≥ 2 gap-fill · ≥ 2 recycled (**one from A2**) |
| Id patterns | `v22-<n>` · `b1-ex-22-<nn>` · `b1-li-22-01/02` · `b1-re-22-01/02` · `b1-wr-22-01` · `b1-sp-22-01` · `b1-ft-22-<nn>` · test `unit-22` |
| Integration points | `src/data/b1/unit22/` (unit, vocabulary, grammar, texts, assessment, meta) · `b1-content.ts` · `meta.ts` · **`unitSpeaking` is positional: `['b1-sp-21-01','b1-sp-22-01']`** |

**Learner outcome.** After Unit 22 the learner can state an opinion, justify it, concede a point, set two things against each other and join in a simple discussion on a familiar topic — in speech (scripted) and in a short forum text.
**Difference from A2** (required text): A2 expresses preferences and suggestions (*Wollen wir …? Ich finde … gut*); B1 *weighs up*: gives a reason, concedes a counter-argument and still keeps the position.

## 2. Scope guard (what Unit 22 may and may not contain)
The two lessons of Stage 3B apply from the first sentence: **scan for later-unit constructions** and **no grammar labels in Kyrgyz**.
| Allowed (taught or revised) | Forbidden in any learner-facing German (incl. instructions, options, hints) | Unit |
| --- | --- | --- |
| *weil, dass, wenn, deshalb* (↻ A2); *bevor, während, seitdem, bis, nachdem* (↻ 21); Präteritum of the 35-verb list in *narrative* only | Relativsatz (*der …, der*) | 23 |
| *obwohl, trotzdem, zwar … aber* · *je … desto, weder … noch, entweder … oder, sowohl … als auch* | Infinitiv mit *zu*, *um … zu*, *damit* (also in instruction lines — the guard caught *damit* in a Unit 21 instruction) | 23 / 30 |
| adjectives **after an article** or possessive: Dativ singular, Nom/Akk/Dat plural (*mit einem guten Argument, die wichtigen Gründe*) | **adjectives without article** (*gute Gründe, mit netten Nachbarn*) — except fixed time phrases | 24 |
| opinion frames: *Ich finde / denke / glaube, dass …*; *Meiner Meinung nach …*; *Das sehe ich anders.*; *Da hast du recht.*; *Ich stimme dir zu.* | Passiv; Konjunktiv II (*ich würde sagen, ich hätte gern*); Genitiv noun phrases and *wegen/trotz/während + Genitiv* | 24–27 |
| verbs without a prepositional object (*diskutieren, meinen, finden, zustimmen, widersprechen, überzeugen, vergleichen*) | **verbs with an obligatory preposition** (*sich ärgern über, abhängen von, halten von, Was hältst du davon?, sich kümmern um, teilnehmen an*) and *da(r)-/wo(r)-* | 28 |
**Receptive-only in this unit (never required in a gap, hint, keyword or `mustInclude`):** *einerseits … andererseits*, *nicht nur … sondern auch* (declared as `constructions` with `forms`).

## 3. Decisions to confirm before authoring (none changes an approved classification)
| # | Question | Proposed handling |
| --- | --- | --- |
| U22-1 | The concept name says *Dativ/Genitiv* but **Genitiv noun phrases are taught only in Units 27/29**. | Teach and test **Dativ singular and plural** productively; show the Genitiv endings (also **-en**) as **one pattern line, receptive, no item, no production**. Classification stays **P** (unchanged). Reviewer to confirm (D-7 family). |
| U22-2 | *Ich bin der Meinung, dass …* contains a Genitiv. | Offer it as an **unanalysed chunk** (receptive); the productive frame is *Meiner Meinung nach …* / *Ich finde, dass …*. |
| U22-3 | *weder … noch* with two verbs forces inversion (*weder lese ich, noch schreibe ich*). | Restrict to **nouns/adjectives** (*weder Zeit noch Lust; weder groß noch hell*). |
| U22-4 | Text-level exercises (Stage 3C solution, §9) — the cap of 10 is kept. | Two of the ten exercises are text-level `choice` items. |
| U22-5 | Kyrgyz renderings of the connectors (§10) | Candidate glosses only; reviewer decides; **describe, never label**. |

## 4. Vocabulary plan (40 new items; validator target 38–42)
**Rules:** no A1/A2/Unit-21 lemma as new (`b1-vocab-repeats-earlier-level`); nouns with article + plural; each word with a German example, Russian and Kyrgyz translation of word **and** example; verbs listed without prepositional objects (§2); examples avoid Genitiv, Konjunktiv II, adjectives without article.
**Already taught (use as recycled/known, do NOT list as new)** — found by the overlap check: *Kompromiss (v20-21), ablehnen (v20-18), vielleicht (v20-26), wahrscheinlich (v20-27), sicher (v20-28), Erfahrung (v11-1), Zusammenleben (v12-32), Lärm (v13-26), modern (v13-20), günstig/teuer/ruhig (A1 v5), gesund (v14-22), finden (v7-21)*.
**Verified free candidates (47; prune 7 at authoring)**
| Group | Candidates | n |
| --- | --- | --- |
| Meinung und Argument | die Meinung · das Argument · der Standpunkt · die Einstellung · die Behauptung · das Vorurteil · der Widerspruch · die Zustimmung · die Ablehnung · der Zweifel · der Vorteil · der Nachteil | 12 |
| Gesellschaft und Zusammenleben | die Diskussion · die Gesellschaft · die Mehrheit · die Minderheit · die Verantwortung · die Freiheit · die Sicherheit · der Einfluss · die Entwicklung · das Risiko | 10 |
| Stadt/Land, Haus, Alltag | die Großstadt · das Dorf · das Haustier · die Regel · die Pflicht · die Gewohnheit | 6 |
| Beurteilen (Adjektive) | nützlich · schädlich · sinnvoll · unnötig · umstritten · überzeugend · vernünftig · gerecht | 8 |
| Diskutieren (Verben) | diskutieren · behaupten · zustimmen · widersprechen · überzeugen · verteidigen · vergleichen · unterstützen · bevorzugen · kritisieren · betonen | 11 |
*Drop first if pruning:* Einstellung, Behauptung, Entwicklung, Gewohnheit, bevorzugen, betonen, gerecht (closest to A2/B2 level or least useful in the texts).
**Strand phrases (not counted as vocabulary):** comparison phrases *im Vergleich zu · im Gegensatz zu · dagegen* (≥ 3 declared, ≥ 2 used in texts); opinion frames of §2; repair chunks (§8). **Possible overlap risk:** *dagegen/dafür* are adverbs — decide whether to list them (they are not in A1/A2 vocabulary).
**Spaced-revision set (meta `revision`, ids verified to exist):** `fromPrevious` (unit 21, ≥ 4): v21-14 *Mut*, v21-15 *Enttäuschung*, v21-12 *Herausforderung*, v21-36 *überwinden* · `fromThirdBack` (unit 19, ≥ 2): v19-6 *Formular*, v19-7 *Antrag* · `fromA2` (units 11–20, ≥ 2): v20-21 *Kompromiss*, v20-18 *ablehnen*. (Thematic fit is deliberate: Kompromiss/ablehnen reappear in the discussion texts.)

## 5. Grammar plan (all three concepts, ru + ky, same structure as Unit 21)
### 5.1 `b1-konzessive-saetze` — *obwohl, trotzdem, zwar … aber* (P, M)
* **Teach:** *obwohl* opens a subordinate part, verb **last**; if it comes first, the main clause starts with the verb (*Obwohl es regnet, gehe ich spazieren*). *trotzdem* is a main-clause adverb in position 1 → verb **second** (*Es regnet. Trotzdem gehe ich spazieren*). *zwar … aber*: *Zwar ist die Wohnung klein, aber sie ist hell.* Contrast with *weil* (reason) and *deshalb* (consequence), both ↻ A2.
* **Learner errors to target (4 mistakes):** *obwohl* + verb second; *trotzdem* + verb last; *obwohl/weil* confused (meaning); missing inversion after the *obwohl*-part.
* **L1 note:** Russian *хотя* ≈ *obwohl*; *всё равно / тем не менее* ≈ *trotzdem*; *правда …, но* ≈ *zwar … aber*.
* **Illustrations:** *Ich bleibe hier, obwohl die Miete hoch ist.* · *Die Miete ist hoch. Trotzdem bleibe ich.* · *Zwar ist das Dorf ruhig, aber es gibt keine Kinos.*
### 5.2 `b1-doppelkonnektoren` (P, M)
* **Productive:** *je … desto* (comparative in both parts; verb last in the *je*-part, verb second after *desto*; needs A2 *Komparativ*, incl. *mehr/besser/lieber*); *weder … noch* (nouns/adjectives only, §3); *entweder … oder* (*oder* does not move the verb: *Entweder wir bleiben, oder wir gehen.*); *sowohl … als auch* (plural verb: *Sowohl Anna als auch Tom spielen Fußball.*).
* **Receptive:** *einerseits … andererseits*, *nicht nur … sondern auch* — appear in reading 2 only, glossed.
* **Illustrations:** *Je länger ich hier wohne, desto besser verstehe ich die Menschen.* · *Das Zimmer ist weder groß noch hell.* · *Wir fahren entweder mit dem Zug oder mit dem Bus.*
* **Errors to target:** wrong verb position after *desto*; *je* with positive form instead of comparative; *weder … noch* with *nicht*; *sowohl … als auch* with a singular verb.
### 5.3 `b1-adjektive-dativ-genitiv` — endings after the article (P, L)
* **Teach (productive):** after *der/die/das/ein/kein/mein* and *dem/der/einem/einer/meinem/meiner*, **Dativ singular and plural** adjectives end in **-en** (*mit einem guten Argument, in der kleinen Stadt, mit den neuen Nachbarn*); plural after *die/diese/meine* (Nom/Akk): **-en** (*die wichtigen Gründe*). Recycle A2 Nom/Akk singular (*ein großer Vorteil, eine gute Idee, ein neues Argument*).
* **Receptive line (no item):** the Genitiv endings are also -en (*des guten Arguments*) — one sentence in the explanation, **no example sentence with a Genitiv noun phrase in any exercise or test** (§3, U22-1).
* **Errors to target:** *in der kleine Stadt*, *mit einem gute Argument*, *die wichtige Gründe*.
* **Why light:** all endings in this concept are the same (-en) once the case is recognised.
**For each concept (as in Unit 21):** title, summary, discover question, why, 4–5 *when* lines, 5 examples, 4 mistakes with notes, 3 real-life sentences, a 4–5-turn dialogue, speaking prompt with keywords, 3 "why?" notes — all in ru and ky, written independently.

## 6. Reading (2 texts, each 100–150 words)
| Id | Genre / situation | Structure | Must show | Question design (3 × 3 options) |
| --- | --- | --- | --- | --- |
| `b1-re-22-01` | **Forum, two posts:** *Stadt oder Land?* (Mia pro city, Jonas pro village) | opinion → reason → concession → conclusion, one post each (~60 words) | *obwohl, trotzdem, zwar … aber, weil*; Dativ adjectives (*in der kleinen Stadt*) | (1) who holds which position, (2) the reason given, (3) which concession is made — **include one *steht nicht im Text* item** |
| `b1-re-22-02` | **Leserbrief:** *Haustiere in Mietwohnungen?* | position, two reasons, an objection answered, a result | *je … desto, weder … noch, sowohl … als auch*; **one** *einerseits … andererseits* (receptive, glossed) | (1) author's position, (2) which arguments, (3) detail about the objection |
Length: 100–150 words each, sentence p95 ≤ 16, longest ≤ 22; **tense: Präsens** (opinion), Präteritum only for a short anecdote from the 35-verb list. Glosses ru + ky for ≥ 4 words per text. Positions of correct answers vary (e.g. 2,0,1 / 1,2,0).

## 7. Listening (2 scripts, each 110–140 words; browser text-to-speech)
| Id | Situation | Speakers / moves | Notes |
| --- | --- | --- | --- |
| `b1-li-22-01` | **WG meeting about house rules** (quiet hours, cleaning plan) | Lea and Nils; Lea states a position, Nils objects, Lea concedes with *zwar … aber*, Nils concedes with *obwohl* | the **unexpected element**: Nils changes his mind on one point |
| `b1-li-22-02` | **Radio interview:** *Smartphones für Kinder?* | host and guest; host asks for pros/cons, guest uses *je … desto* and *weder … noch* | formal register *Sie* for host–guest; present tense |
* 14–16 lines, every line with ru + ky; 4 questions each (gist, detail, speaker's attitude, a concession); **keywords: only words that have a gloss in the vocabulary** (Unit 21 bug); dialogue **order must be coherent** (Unit 21 bug).
* No assessment item depends on audio. Real-device playback is **still unverified** (B-7); the lab limitations found in Stage 3B (single voice, silent errors, no "no German voice" notice, transcript only after questions) apply.

## 8. Speaking (`b1-sp-22-01`, 6 turns) — *Diskussion in der WG: ein Haustier?*
Spoken narration/opinion in the **Präsens/Perfekt** (never Präteritum in hints). Each turn: AI line (de + ru + ky), 3–4 hints, 3–4 lowercase keywords. Avoid *halten von*, *kümmern um* (§2).
| Turn | AI move | Target language | Example hint frame |
| --- | --- | --- | --- |
| 1 | proposes the topic ("Ich möchte eine Katze in die WG holen. Wie findest du die Idee?") | opinion frame | *Ich finde die Idee …, weil …* |
| 2 | objects ("Aber Katzen machen Dreck.") — **unexpected element: a counter-argument** | concession | *Zwar …, aber …* / *Trotzdem finde ich …* |
| 3 | asks for a reason ("Warum ist dir das wichtig?") | reason, *weil* | *Weil ich … / Je …, desto …* |
| 4 | offers a compromise | agreement/disagreement | *Da hast du recht.* / *Das sehe ich anders.* |
| 5 | adds a condition | *entweder … oder* | *Entweder …, oder …* |
| 6 | asks for a decision | summary | *Obwohl …, bin ich einverstanden / nicht einverstanden.* |
**Strands (required):** ≥ 3 repair chunks, e.g. *Das habe ich nicht verstanden. · Meinst du …? · Kannst du das genauer erklären? · Lass mich bitte ausreden.* (imperative A2); one reading/listening strategy note (*find position + reason; opinion signals*); comparison phrases (≥ 3).
**Feedback:** the B1 checklist and self-assessment (never a score) — see §11.

## 9. Writing and exercises
### 9.1 Writing (`b1-wr-22-01`, informal-neutral forum post, `minWords` 80, `formal: false`)
Situation (ru + ky): the learner posts a pro/contra opinion on a familiar topic (e.g. smartphones for children, a pet in a flat, city vs village). **Expected elements, each with `label` (German) and `explain` {ru, ky} (required since Stage 3C):** (1) greeting/closing for a forum; (2) own opinion (*Ich finde/denke, dass …* / *Meiner Meinung nach*); (3) a reason with *weil*; (4) a concession with *obwohl / trotzdem / zwar … aber*; (5) one productive double connector (*je … desto / weder … noch / entweder … oder / sowohl … als auch*); (6) a closing recommendation. **Never** require *einerseits/andererseits* or *nicht nur … sondern auch*. Model text ≥ 80 words in Präsens, 5 tips (ru + ky), and the transparent checklist + 4-criteria self-assessment as in Unit 21.
### 9.2 Exercises (10; types fill / choice / order; counts: concept 8 + recycled 2)
| # | Type | Concept | Skill | Skeleton (distractors = real learner errors) |
| --- | --- | --- | --- | --- |
| 01 | fill | konzessive | *obwohl* vs *weil* | gap in a sentence with a clear concession |
| 02 | choice | konzessive | verb position after *obwohl* (V last) | 3 forms: V2 / V last / wrong inversion |
| 03 | order | konzessive | *trotzdem* + V2 | tokens of a 2-sentence pair |
| 04 | **choice (text-level)** | konzessive + doppel | **short 3-sentence opinion text** — pick the text that is correct *and* logical | wrong V position / wrong connector meaning |
| 05 | fill | doppelkonnektoren | *je … desto* + comparative | needs *Komparativ* ↻ |
| 06 | choice | doppelkonnektoren | *weder … noch* with nouns | *nicht … noch*, *weder … oder* |
| 07 | order | doppelkonnektoren | *Je …, desto …* word order | tokens incl. comparative |
| 08 | choice | adjective Dativ | choose the correct ending form | *kleine/kleinen/kleiner* |
| 09 | **fill ↻ A2** | — | *deshalb* vs *trotzdem* (consequence vs concession) | no concept of this unit |
| 10 | **choice ↻ A2/21** | — | Komparativ or Präteritum from Unit 21 | no concept of this unit |
**Text-level requirement (solution, no new exercise type):** exercises 04 (and 09/10 variants) are ordinary `choice` items whose prompt or options are **three-sentence texts**, as implemented for Unit 21 (`b1-ex-21-01`, `-05`). This stays inside the approved types and the 8–10 cap. A real production/sequence type would be an architecture decision (owner) and is **not** assumed.

## 10. Assessment — unit test `unit-22` (15 questions)
Composition **grammar 8 / vocabulary 3 / reading 4 / listening 0**; ids `b1-ft-22-01…15`; both languages for prompt-instruction and explanation; reading passages stay German in the prompt.
| # | Skill | Concept (field) | Notes |
| --- | --- | --- | --- |
| 01–02 | grammar (gap) | `b1-konzessive-saetze` | *obwohl*/*trotzdem* choice |
| 03–04 | grammar | `b1-doppelkonnektoren` | one gap, one recognition |
| 05–06 | grammar | `b1-adjektive-dativ-genitiv` | **Dativ and plural only** (U22-1) |
| 07 | grammar ↻ | `a2-komparativ-superlativ` | **the required A2 item** |
| 08 | grammar ↻ | `a2-deshalb-darum` | consequence vs concession (or Unit 21 concept) |
| 09–11 | vocabulary | — | usage in context; unambiguous distractors |
| 12–15 | reading | — | 3-option incl. one *richtig/falsch/steht nicht im Text*; short texts |
Answer-position target **5 / 5 / 5**, never three in a row; ≥ 2 gap-fill; every concept ≥ 2 items; no prompt or answer shared with the exercises (except the generic instruction line). Pass = 70 % (11 of 15), existing rule. The 40-item level test remains an indicative instrument, not certification.

## 11. RU/KY localization plan
* **Independent authoring** (not word-for-word translation); Kyrgyz never copies Russian; no Latin-only Kyrgyz (validator parity rules); numbers, `{placeholders}` and quoted German identical in both.
* **Terminology policy (from the Stage 3B findings):** describe, do not label — **no** «бүтүндөмө/багыныңкы/жакталган/бөлүнүүчү» as grammar labels; use descriptions («… менен башталган сүйлөм бөлүгү», «этиш эң аягында турат»). «уңгу» = stem only; prefix = «приставка».
* **Connector glosses (candidates, unreviewed):**
| German | Russian | Kyrgyz (candidate) |
| --- | --- | --- |
| obwohl | хотя | «…ганына карабастан» / «…са да» |
| trotzdem | всё же, тем не менее | «ошого карабастан» |
| zwar … aber | правда …, но | «…ыбы, бирок» |
| je … desto | чем …, тем … | «канчалык …, ошончолук …» |
| weder … noch | ни … ни | «… да, … да эмес» |
| entweder … oder | или … или, либо … либо | «же … же» |
| sowohl … als auch | как …, так и … | «… да, … да» |
| einerseits … andererseits (R) | с одной стороны … с другой стороны | «бир жагынан … экинчи жагынан» |
**These go to a B1 section of the Kyrgyz glossary (blocker B-5) and must be confirmed by a qualified Kyrgyz reviewer; none is approved.**
* **UI:** all checklist, self-assessment, Beta-notice and navigation strings already exist in ru and ky (Stage 3C); the writing checklist items carry `explain`. Unit 22 adds **no new interface keys** unless a new screen element is needed.
* **Register:** informal *du/сен* in dialogues, *Sie/сиз* for the radio interview; follow each text's German register.

## 12. Validation, tests and definition of done
**Validator expectations for the authored unit:** 0 errors and 0 warnings; no `b1-*` issue; one new review flag (`cefr-signoff-missing units:22`). Rules that will bite: `b1-vocab-count/-repeats-earlier-level`, `b1-allocation-count` (3), `b1-reading/listening-length`, `b1-sentence-length`, `b1-speaking-turns` (5–6), `b1-writing-length`, `b1-final-composition/-production/-recycling` (one A2), `b1-strand-comparison`, `b1-revision-*`, `b1-receptive-required` (einerseits/andererseits/nicht nur/sondern auch), `b1-checklist-localized`, `b1-parity-*`.
**Tests to write (copy the Unit 21 set):** `tests/b1/unit-22.test.ts` (identity, concepts, vocabulary overlap/count, band targets, scope guard incl. **adjective-without-article**, **Genitiv phrase**, **zu-Infinitiv/damit**, **Konjunktiv II**, **verb+preposition**, receptive forms never required, answer keys 5/5/5, exercises, final test, metadata, honesty) · `tests/b1/unit-22-audit.test.ts` style guards (keywords glossed, dialogue coherence, Kyrgyz label ban, hints in Präsens) · extend `unit-21-integration.test.tsx` routes to Unit 22 · extend `lazy-chunk.test.ts` (Unit 22 text only in the b1 chunk) · update any test that names "only Unit 21" (`B1_CONTENT.units`, `B1_META`).
**Definition of done:** validator clean · all tests green · browser pass in ru and ky at 390 px (no overflow, no console error) · A1/A2 untouched · B1 still planned · limitations and reviewer term list written to `docs/implementation/B1_STAGE3D_UNIT22.md` (suggested) · no commit unless asked.

## 13. Authoring order
1 Vocabulary (overlap check) → 2 grammar (3 concepts) → 3 readings → 4 listening scripts (check keyword glosses) → 5 speaking → 6 writing + checklist `explain` → 7 exercises → 8 final test → 9 metadata (objectives, difference-from-A2, repair chunks, strategy, comparison phrases, revision, constructions with receptive `forms`) → 10 integration (`b1-content`, `meta`, `unitSpeaking`) → 11 validator + tests → 12 browser audit.
