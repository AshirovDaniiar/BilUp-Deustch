# BilUp Til A2 — Grammar Mapping Report (43 approved topics)

> Reuse of **existing** A2 grammar lessons only. No grammar was written, rewritten or copied. A confirmed match is attached to the new unit **by reference** (the new unit lists the existing lesson id); the lesson, its examples, exercises, ids and progress keys stay where they are (legacy A2 units 11–20 stay hidden and untouched).
> **CEFR rule:** only lessons tagged **A2** in the data are used. B1 lessons and the A2-tagged lesson of the hidden legacy A1 data are reported as *cross-level candidates* and **not** imported.
> **Combined-lesson rule:** a lesson is attached **once** (to its best primary destination). Other topics it touches are reported as *partial/secondary overlaps* and stay empty.

## 1. Legacy A2 grammar inventory (27 lessons, all read in full)

Sources: `src/data/a2/grammar.ts` (unit 11) and `src/data/a2/unit12 … unit20/grammar.ts`, each with explanation, rules, examples, common mistakes, 2–5 hand-written exercises and an explicit "Not taught" scope note. All 27 are `level: 'A2'`, `source.kind: 'authored'` (human CEFR review pending).

| Unit | Lessons |
|---:|---|
| 11 | `a2-perfekt-erfahrungen`, `a2-praeteritum-sein-haben-modal`, `a2-ereignisse-verbinden` |
| 12 | `a2-personalpronomen-dativverben`, `a2-reflexive-verben` |
| 13 | `a2-adjektivendungen-indefinit`, `a2-komparativ-superlativ`, `a2-positionsverben` |
| 14 | `a2-imperativ`, `a2-sollen-duerfen`, `a2-wenn-saetze` |
| 15 | `a2-adjektivendungen-definit`, `a2-mengen-indefinitpronomen`, `a2-hoefliche-bitten` |
| 16 | `a2-gern-lieber-am-liebsten`, `a2-verben-mit-praepositionen`, `a2-ordinalzahlen-datum` |
| 17 | `a2-deshalb-darum`, `a2-wenn-als` |
| 18 | `a2-praepositionen-reiseziele`, `a2-zukunft-praesens-werden` |
| 19 | `a2-man-regeln-verbote`, `a2-indirekte-fragen`, `a2-wegbeschreibung-praepositionen` |
| 20 | `a2-vorschlaege-verabredungen`, `a2-absichten-plaene`, `a2-satzverbindungen-integration` |

## 2. Mapping report

Match types: **Exact** · **Semantic** · **Partial** · **No existing lesson** · **Cross-level candidate** (the only suitable lesson is B1, or A2-tagged inside hidden legacy A1). Decision: **Attach** or **Leave empty**.

| № | Grammar topic | Target unit | Existing lesson | Match | Coverage | Decision |
|---:|---|---|---|---|---|---|
| 01 | Perfekt: Vertiefung | Mein letztes Jahr | `a2-perfekt-erfahrungen` | **Semantic** | haben/sein choice, Partizip II position, no-*ge-* verbs (be-, ent-, er-, ver-, -ieren), *schon einmal / noch nie*, *vor … Jahren*, *seit* | **Attach** (primary destination; also touches 02) |
| 02 | Partizip II: regelmäßige und unregelmäßige Verben | Besondere Erlebnisse und Erinnerungen | `a2-perfekt-erfahrungen` (used by 01) | Partial | Shows participles in use and the no-*ge-* rule; does **not** systematically teach the regular (*ge-…-t*) vs irregular (*ge-…-en*, stem change) formation. The A1 lesson `perfekt` does (hidden/other level) | Leave empty — secondary overlap (§4) |
| 03 | Präteritum: Modalverben und häufige Verben | Als ich ein Kind war | `a2-praeteritum-sein-haben-modal` | Partial | Covers *sein, haben* and *können, wollen, müssen* (war, hatte, konnte, wollte, musste; du/wir forms). Missing: **other frequent verbs** (gehen, kommen, geben, bleiben …) — the lesson says they stay in Perfekt; no *sollen/dürfen*; no ihr/sie forms table | Leave empty — **decision list** |
| 04 | Reflexive Verben | Meine tägliche Routine | `a2-reflexive-verben` | **Exact** | Verbs that always take *sich* (treffen, kennenlernen, verstehen, streiten), position in main clause and Perfekt, reciprocal meaning; Akkusativ forms only | **Attach** (primary; also touches 05) |
| 05 | Reflexivpronomen | Körperpflege und Gesundheit | `a2-reflexive-verben` (used by 04) | Partial | The pronoun forms (mich, dich, sich, uns, euch) are taught only inside the verb lesson, Akkusativ only; **reflexive Dativ** (*sich die Zähne putzen*, *mir die Hände waschen*) is explicitly not taught (B1 `b1-reflexive-dativ`) | Leave empty — secondary overlap |
| 06 | Verben mit Dativ | Menschen helfen und begegnen | `a2-personalpronomen-dativverben` (used by 23) | Partial | Dativ verbs helfen, gehören, gefallen, schenken, geben, zeigen are taught, but inside a lesson whose primary focus is the pronoun paradigm | Leave empty — secondary overlap (alternative primary, see decision list) |
| 07 | Verben mit Akkusativ und Dativ | Geschenke und Überraschungen | `a2-personalpronomen-dativverben` (used by 23) | Partial | Two-object order (person Dativ before thing Akkusativ: *schenken, geben, zeigen*) is one rule inside the same lesson | Leave empty — secondary overlap |
| 08 | Verben mit Präpositionen | Worüber sprechen wir? | `a2-verben-mit-praepositionen` | **Exact** | Closed set of six pairs with Akkusativ (interessieren für, freuen auf/über, warten auf, sprechen über, denken an), article forms, reflexive pronoun agreement. Limits: no Dativ pairs, no *Wofür?/Worauf?/da(r)-* | **Attach** (A2-scope closed list; limits documented) |
| 09 | Futur I | Meine Zukunftspläne | `a2-zukunft-praesens-werden` | Partial | Teaches *Präsens + time word* for the future; *werden* appears **only** as the weather chunk *Es wird …*. No Futur I formation (*werden + Infinitiv*), "No werden for intentions". Real Futur I = B1 `b1-futur1-vermutungen` | Leave empty — **decision list** (not a Futur I match) |
| 10 | Satzstellung im Hauptsatz: Vertiefung | Geschichten und Erlebnisse erzählen | `a2-ereignisse-verbinden` | Partial | Verb stays 2nd after *zuerst/dann/danach/später/schließlich*. Missing: Satzklammer, Mittelfeld, TeKaMoLo, Dativ/Akkusativ order (B1 `b1-satzbau-mittelfeld`). The lesson is mostly sequencing + *weil/dass* | Leave empty |
| 11 | Nebensätze mit weil | Warum ist das so? | `a2-ereignisse-verbinden`, `a2-deshalb-darum` | Partial | *weil* with verb-final is taught only as one part of two combined lessons (events+dass; weil vs deshalb); no stand-alone *weil* lesson | Leave empty |
| 12 | Nebensätze mit dass | Was ich denke und glaube | `a2-ereignisse-verbinden` | Partial | *dass* after *glauben/wissen/finden* inside the events lesson; no stand-alone *dass* lesson | Leave empty |
| 13 | Nebensätze mit wenn | Was mache ich, wenn …? | `a2-wenn-saetze` | **Exact** | *wenn* (habit/condition), verb final, main clause starts with the verb when the *wenn*-clause is first, 3 exercises | **Attach** |
| 14 | Temporalsätze mit als und wenn | Besondere Momente im Leben | `a2-wenn-als` | **Exact** | *wenn* (present/future/repeated) vs *als* (single past event), word order, 4 mistakes pairs | **Attach** |
| 15 | Indirekte Fragen | Höflich nachfragen | `a2-indirekte-fragen` | **Exact** | Two frames (*Können Sie mir sagen, wo/wann/wie …?*, *Ich möchte wissen, ob …*), verb final, *ob* for yes/no. Limit: only these frames | **Attach** |
| 16 | Infinitiv mit zu | Wünsche und persönliche Ziele | — (A2 says "Not taught: *zu* + Infinitiv") | **Cross-level candidate** | B1 `b1-infinitiv-mit-zu` (B1, unit 23): *zu*-Infinitiv and *um … zu* | Leave empty — not imported |
| 17 | Satzverbindungen mit deshalb und deswegen | Gründe und Folgen | `a2-deshalb-darum` | **Semantic** | *deshalb* + verb in position 2, contrasted with *weil*; *darum* as synonym. The word **deswegen** is not named (same function as *deshalb/darum*) | **Attach** (primary; 36 is the same topic) |
| 18 | Adjektivdeklination mit bestimmtem Artikel | Menschen beschreiben | `a2-adjektivendungen-definit` | **Exact** | After der/die/das, dieser, welcher: Nominativ + Akkusativ, singular and plural (-e / -en). Limit: no Dativ/Genitiv (B1 `b1-adjektive-dativ-genitiv`) | **Attach** (A2-scope Nom/Akk) |
| 19 | Adjektivdeklination mit unbestimmtem Artikel | Neue Menschen kennenlernen | `a2-adjektivendungen-indefinit` | **Exact** | After ein-/kein-/mein-: singular Nominativ + Akkusativ (-er, -en, -es, -e), dropped *e* (dunkel, teuer). Limit: no plural, no Dativ | **Attach** (A2-scope) |
| 20 | Adjektivdeklination ohne Artikel | Eigenschaften und Charakter | — (A2: "endings without an article … not taught") | **Cross-level candidate** | B1 `b1-adjektive-ohne-artikel` (B1, unit 24) | Leave empty — not imported |
| 21 | Genitiv: Grundlagen | Familie und Besitz | — | **Cross-level candidate** | Hidden legacy **A1** lesson `genitiv` ("Genitiv (Überblick)", tagged **A2**, legacy A1 unit 10); B1 `b1-genitivattribute` (B1) | Leave empty — not imported (see §6) |
| 22 | N-Deklination | Menschen und Berufe | — | No existing lesson | No A2, B1 or A1 lesson | Leave empty |
| 23 | Personalpronomen im Akkusativ und Dativ: Vertiefung | Beziehungen und Kommunikation | `a2-personalpronomen-dativverben` | **Semantic** | Full Akkusativ + Dativ forms for all persons (mich…Sie / mir…Ihnen), which verbs take which case, pronouns after prepositions (mit ihm), two-object order; 5 exercises | **Attach** (primary: the pronoun paradigm is the core; also touches 06, 07) |
| 24 | Indefinitpronomen | Jeder, niemand und etwas | `a2-mengen-indefinitpronomen` | Partial | Covers *welche / einen / keinen / eine / keine* (replacing a noun), *wie viel / wie viele*, quantity words. Missing: **jeder, niemand, jemand, etwas, nichts, alle, man** | Leave empty |
| 25 | Relativpronomen im Nominativ | Menschen, die ich kenne | — | **Cross-level candidate** | B1 `b1-relativsaetze-nom-akk` (B1, unit 23; teaches Nominativ and Akkusativ together) | Leave empty — not imported |
| 26 | Relativpronomen im Akkusativ | Dinge, die ich brauche | — | **Cross-level candidate** | Same B1 lesson as 25 (not split or duplicated) | Leave empty — not imported |
| 27 | Komparativ | Stadt oder Land? | `a2-komparativ-superlativ` | **Semantic** | Combined lesson: Komparativ + *als*, umlaut, *gut–besser, viel–mehr, gern–lieber*, *teurer*; predicative only. Superlativ (*am -sten*) is in the same lesson | **Attach** (primary; also touches 28, 29) |
| 28 | Superlativ | Das Beste in meinem Leben | `a2-komparativ-superlativ` (used by 27) | Partial | *am -sten*, *am besten/meisten/liebsten* taught inside the combined lesson; the related `a2-gern-lieber-am-liebsten` covers the preference series | Leave empty — secondary overlap |
| 29 | Vergleichssätze mit als und wie | Früher und heute im Vergleich | `a2-komparativ-superlativ` (used by 27) | Partial | *als* only. **No *so … wie / genauso … wie*** (the lesson lists "größer wie" as a mistake) | Leave empty |
| 30 | Adjektive als Nomen | Gute und schlechte Eigenschaften | — | No existing lesson | none | Leave empty |
| 31 | Adverbien der Zeit, des Ortes und der Art und Weise | Mein Alltag und meine Umgebung | — | No existing lesson | Time words appear inside other lessons (`a2-ereignisse-verbinden`, `a2-zukunft-praesens-werden`) but no adverb lesson | Leave empty |
| 32 | Wechselpräpositionen: Wo und Wohin? | Meine Wohnung und mein Wohnort | `a2-positionsverben` | **Semantic** | Wo? → Dativ with stehen/liegen/hängen vs Wohin? → Akkusativ with stellen/legen/hängen; the nine prepositions (an, auf, in, neben, über, unter, vor, zwischen, hinter); contracted forms; mistakes and exercises. Taught through position verbs (A1 `wechsel` is the plain version, used in A1) | **Attach** |
| 33 | Pronominaladverbien: darauf, darüber, damit | Gespräche und Reaktionen | — (unit 16 note: "*Wofür? / Worauf? and the da(r)-adverbs are NOT taught*") | **Cross-level candidate** | B1 `b1-verben-praepositionen` (Worauf? / Darauf) | Leave empty — not imported |
| 34 | Präpositionen mit Genitiv: erste Einführung | Die Umgebung und ihre Besonderheiten | — | **Cross-level candidate** | B1 `b1-genitiv-praepositionen` (wegen, trotz, während, statt) | Leave empty — not imported |
| 35 | Konnektor: trotzdem | Schwierigkeiten im Alltag | — (A2: "*trotzdem* not taught") | **Cross-level candidate** | B1 `b1-konzessive-saetze` (obwohl, trotzdem, zwar … aber) | Leave empty — not imported |
| 36 | Konnektor: deshalb und deswegen | Entscheidungen und Konsequenzen | `a2-deshalb-darum` (used by 17) | No existing lesson (duplicate topic) | **Same concept as topic 17**; the only lesson is already attached there and is not duplicated | Leave empty — duplicate target topic |
| 37 | Konnektor: außerdem | Was macht meine Stadt besonders? | — | **Cross-level candidate** | B1 `b1-textkohaesion` (erstens, außerdem, darüber hinaus …) | Leave empty — not imported |
| 38 | Konnektoren: entweder … oder | Entscheidungen treffen | — | **Cross-level candidate** | B1 `b1-doppelkonnektoren` (je … desto, weder … noch, entweder … oder, sowohl … als auch) | Leave empty — not imported |
| 39 | Konnektoren: sowohl … als auch | Zwei Möglichkeiten verbinden | — | **Cross-level candidate** | Same B1 lesson as 38 (not split) | Leave empty — not imported |
| 40 | Konnektoren: nicht nur … sondern auch | Was ist mir wichtig? | — | No existing lesson | Not even in the B1 lesson | Leave empty |
| 41 | Konjunktiv II: höfliche Bitten | Im Hotel und im Restaurant | `a2-hoefliche-bitten` | Partial | Polite requests with *Können Sie…? / Darf ich…? / ich möchte*; *Ich hätte gern* is taught **as a memorised phrase** ("without analysing its form"). **No Konjunktiv II teaching** (würde, hätte, könnte, wäre as forms). Real Konjunktiv II: B1 `b1-konjunktiv2-ratschlaege` | Leave empty — **decision list** (a fixed phrase is not a Konjunktiv II lesson) |
| 42 | Konjunktiv II: Wünsche | Wenn ich mehr Zeit hätte … | — (only the chunk *Wie wäre es mit …* in `a2-vorschlaege-verabredungen`, also taught as fixed) | **Cross-level candidate** | B1 `b1-konjunktiv2-wuensche-irreal` (wishes, unreal conditions) | Leave empty — not imported |
| 43 | Imperativ: Vertiefung | Ratschläge und Anweisungen | `a2-imperativ` | **Exact** | du- and Sie-forms, vowel change e→i(e), separable and reflexive verbs, *nicht*, *bitte*; 3 exercises. **Limits (stated by the lesson): no ihr-imperative, no *sein*-imperative (sei/seid/seien)** | **Attach** (limits documented) |

### Totals

| Category | Count | Topics |
|---|---:|---|
| Exact (attached) | 8 | 04, 08, 13, 14, 15, 18, 19, 43 |
| Semantic (attached) | 5 | 01, 17, 23, 27, 32 |
| **Attached (Grammar populated)** | **13** | |
| Partial (decision list, left empty) | 13 | 02, 03, 05, 06, 07, 09, 10, 11, 12, 24, 28, 29, 41 |
| Cross-level candidates (not imported) | 12 | 16, 20, 21, 25, 26, 33, 34, 35, 37, 38, 39, 42 |
| No existing lesson | 5 | 22, 30, 31, 36 (duplicate of 17), 40 |
| **Total** | **43** | (13 + 13 + 12 + 5) |

## 3. Combined lessons: one destination only

| Lesson | Possible destinations | Primary (attached) | Reason | Secondary (left empty) |
|---|---|---|---|---|
| `a2-perfekt-erfahrungen` | 01, 02 | **01** | Instructional focus is Perfekt as a tense (auxiliary choice, experience questions); participle formation is only a side rule | 02 |
| `a2-personalpronomen-dativverben` | 06, 07, 23 | **23** | The lesson opens with and is built around the full pronoun paradigm (Akkusativ and Dativ); the Dativ verbs and the two-object rule illustrate it | 06, 07 |
| `a2-reflexive-verben` | 04, 05 | **04** | It teaches reflexive *verbs*; the pronoun forms are taught as part of them | 05 |
| `a2-komparativ-superlativ` | 27, 28, 29 | **27** | Starts with and mainly practises the Komparativ + *als*; Superlativ is the second half; *wie* is absent | 28, 29 |
| `a2-deshalb-darum` | 11, 17, 36 | **17** | The lesson's subject is *deshalb/darum*; *weil* appears as the contrast | 11 (partial), 36 (duplicate topic) |
| `a2-ereignisse-verbinden` | 10, 11, 12 (and 01/02) | none | It combines three things (sequence adverbs, *weil*, *dass*); no single approved topic matches its focus, so it is attached nowhere | 10, 11, 12 |
| `a2-satzverbindungen-integration` | 11, 12, 13, 17, 36, 38 | none | A consolidation lesson with "no new connectors"; it would duplicate the stand-alone lessons | — |
| `a2-praeteritum-sein-haben-modal` | 03 | none | Partial only (see 03) | 03 |

## 4. Overlapping or duplicate target topics (curriculum issues)

* **17 and 36** are the same topic (*deshalb/deswegen*).
* **11, 12, 13, 14, 17** all concern subordinate/connector clauses; the legacy A2 teaches them in three combined lessons, the new list wants five single-topic lessons.
* **01 / 02** (Perfekt vs Partizip II), **04 / 05** (reflexive verbs vs pronouns), **06 / 07 / 23** (Dativ verbs, two objects, pronouns), **27 / 28 / 29** (Komparativ, Superlativ, *als/wie*): one legacy lesson each, several topics.
* **25 / 26** (relative pronouns) and **38 / 39 / 40** (double connectors) map to a single B1 lesson each.
* **41 / 42** (both Konjunktiv II) have no A2 lesson at all.
* **18 / 19 / 20** is a clean trio, but legacy A2 teaches only the first two, capped at Nominativ/Akkusativ.
* **32** overlaps A1 **35** (*Wechselpräpositionen*) across levels; **21** overlaps the hidden A1 `genitiv`.

## 5. Legacy A2 lessons not assigned (14 of 27)

| Lesson | Why |
|---|---|
| `a2-praeteritum-sein-haben-modal` | Partial for 03 (frequent verbs missing) |
| `a2-ereignisse-verbinden` | Combined, no single destination (10/11/12) |
| `a2-sollen-duerfen` | No approved topic (modal verbs *sollen/dürfen*) |
| `a2-mengen-indefinitpronomen` | Partial for 24 |
| `a2-hoefliche-bitten` | Partial for 41 (fixed phrase, not Konjunktiv II) |
| `a2-gern-lieber-am-liebsten` | No approved topic (related to 28) |
| `a2-ordinalzahlen-datum` | No approved topic |
| `a2-praepositionen-reiseziele` | No approved topic |
| `a2-zukunft-praesens-werden` | Not Futur I (09) |
| `a2-man-regeln-verbote` | No approved topic |
| `a2-wegbeschreibung-praepositionen` | No approved topic |
| `a2-vorschlaege-verabredungen` | No approved topic (*Wie wäre es mit* is a fixed chunk, not 42) |
| `a2-absichten-plaene` | No approved topic (*vorhaben/wollen/planen*; not Futur I) |
| `a2-satzverbindungen-integration` | Consolidation of several connector topics |

13 lessons are attached; 14 stay in hidden legacy.

## 6. Cross-level candidates (reported, not imported)

| Topic | Source lesson | Level | Why it is not imported |
|---|---|---|---|
| 16 Infinitiv mit zu | `b1-infinitiv-mit-zu` | **B1** | B1 content; A2 explicitly excludes it |
| 20 Adjektive ohne Artikel | `b1-adjektive-ohne-artikel` | **B1** | B1 content |
| 21 Genitiv: Grundlagen | `genitiv` | **A2 tag in hidden legacy A1** (A1 unit 10) | Belongs to the hidden A1 data and is unassigned in the new A1 plan; it is only an "overview" (der Name des Mannes, *von + Dativ* as the spoken alternative). Candidate for manual decision. Also B1 `b1-genitivattribute` |
| 25, 26 Relativpronomen | `b1-relativsaetze-nom-akk` | **B1** | B1 content, one lesson for both topics |
| 33 Pronominaladverbien | `b1-verben-praepositionen` | **B1** | B1 content |
| 34 Genitiv-Präpositionen | `b1-genitiv-praepositionen` | **B1** | B1 content (the B1 reviewers still list it as limited-productive) |
| 35 trotzdem | `b1-konzessive-saetze` | **B1** | B1 content |
| 37 außerdem | `b1-textkohaesion` | **B1** | B1 content |
| 38, 39 entweder … oder / sowohl … als auch | `b1-doppelkonnektoren` | **B1** | B1 content, one lesson for both topics |
| 42 Konjunktiv II: Wünsche | `b1-konjunktiv2-wuensche-irreal` | **B1** | B1 content |
| 41 (also) | `b1-konjunktiv2-ratschlaege` | **B1** | B1 content (alongside the partial A2 chunk lesson) |
| 09 (also) | `b1-futur1-vermutungen` | **B1** | B1 content (alongside the partial A2 lesson) |
| 10 (also) | `b1-satzbau-mittelfeld` | **B1** | B1 content |
| 05 (also) | `b1-reflexive-dativ` | **B1** | B1 content |

## 7. Decisions awaiting your approval (not applied)

1. **03 Präteritum** — attach `a2-praeteritum-sein-haben-modal` as *partial* (covers sein, haben, können/wollen/müssen; not other frequent verbs)? (analogous to A1 unit 27)
2. **09 Futur I** — attach `a2-zukunft-praesens-werden` as partial? (not Futur I: Präsens + time word, *Es wird …* weather only)
3. **41 Konjunktiv II: höfliche Bitten** — attach `a2-hoefliche-bitten` as partial? (fixed phrases incl. *Ich hätte gern*; no Konjunktiv II teaching)
4. **24 Indefinitpronomen** — attach `a2-mengen-indefinitpronomen` as partial? (*welche/einen/keinen* only)
5. **Alternative primary destination for `a2-personalpronomen-dativverben`:** keep 23 (pronouns) or move to 06 (Dativ verbs)?
6. **28 / 29** — attach the combined `a2-komparativ-superlativ` as partial to Superlativ / *als-wie*, or leave as is?
7. **10, 11, 12** — use `a2-ereignisse-verbinden` as a partial lesson for one of them?
8. **02 Partizip II** — attach `a2-perfekt-erfahrungen` again (partial), or consider the A1 `perfekt` lesson (cross-level) instead?
9. **21 Genitiv: Grundlagen** — import the A2-tagged legacy A1 `genitiv` lesson?
10. **18 / 19 / 43** were attached as **Exact** with documented limits (Nominativ/Akkusativ only; no ihr/sein imperative). Say if you want them downgraded to partial.

## 8. Results

* Grammar sections populated by reuse: **13** of 43.
* Grammar sections left empty: **30** (13 partial · 12 cross-level · 5 no lesson).
* New educational content created: **none** (this report and tests only).
