// @vitest-environment node
/**
 * B1 Unit 30 — Gesellschaft, Zusammenleben und Engagement (Stage 3L). Checks the authored content against the approved curriculum: identity, the three approved concepts
 * (Nomen-Verb-Verbindungen on a CLOSED list of 20, decision D-8 open; sodass / so … dass / damit / um … zu; the text-structuring words on a closed list), vocabulary (38–42,
 * nothing already taught), text sizes, the scope guard for later units and for receptive constructions — with REGRESSION samples proving that genuine out-of-scope German is
 * still detected —, social-content safety (everything fictional, both views of a community question shown fairly, no stereotype about a generation or a group, no politics,
 * no real organisation), RU/KY parity, exercise / answer-key correctness, assessment structure, metadata, the writing tasks and their discoverability and spaced revision.
 * B1 stays `planned` and invisible; no CEFR approval of any kind is implied.
 */
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { lemmaKeys } from '../../scripts/content-validate/b1/lemma'
import { B1_CURRICULUM } from '../../scripts/content-validate/b1/curriculum'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_META } from '../../src/data/b1/meta'
import { B1_UNIT_PLAN } from '../../src/data/b1/registry'
import { UNIT_30_EXERCISES, UNIT_30_FINAL, UNIT_30_TEST } from '../../src/data/b1/unit30/assessment'
import { UNIT_30_GRAMMAR, UNIT_30_WHY_NOTES } from '../../src/data/b1/unit30/grammar'
import { UNIT_30_LISTENING, UNIT_30_READING, UNIT_30_SPEAKING, UNIT_30_WRITING } from '../../src/data/b1/unit30/texts'
import { UNIT_30 } from '../../src/data/b1/unit30/unit'
import { UNIT_30_VOCABULARY } from '../../src/data/b1/unit30/vocabulary'
import { availableLevels, courseLevel } from '../../src/data/course'
import {
  finalTestOfUnit,
  grammarForUnit,
  registerLevelContent,
  speakingForUnit,
  topicTestOfUnit,
  vocabularyForUnit,
  writingForUnit,
  writingOf,
} from '../../src/data/catalog'

const words = (s: string) => s.split(/\s+/).filter(Boolean).length
const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).filter(x => x.trim())
const CONCEPTS = ['b1-nomen-verb-verbindungen', 'b1-konsekutiv-final', 'b1-textkohaesion']
const META = B1_META.find(m => m.unit === 30)!
const [MAIN, MICRO_O, MICRO_N] = UNIT_30_WRITING
const NVV = META.concepts[0].closedList!
const CONNECTORS = META.concepts[2].closedList!

/** every correct or taught German string of the unit (distractors of choice items are deliberately wrong forms and are not taught) */
function germanTexts(): string[] {
  const out: string[] = []
  for (const r of UNIT_30_READING) out.push(...r.body, ...r.questions.flatMap(q => [q.q, q.options[q.answer]]))
  for (const l of UNIT_30_LISTENING) out.push(...l.lines.map(x => x.text), ...l.questions.flatMap(q => [q.q, q.options[q.answer]]))
  for (const v of UNIT_30_VOCABULARY) out.push(v.example)
  for (const g of UNIT_30_GRAMMAR)
    out.push(...g.examples.map(x => x.de), ...g.reallife.map(x => x.de), ...g.dialogue.map(x => x.text), g.speakPrompt.sample)
  for (const n of UNIT_30_WHY_NOTES) out.push(n.sentence, ...n.more.map(x => x.de))
  for (const e of UNIT_30_EXERCISES) out.push(e.prompt, e.answer)
  for (const q of UNIT_30_FINAL) out.push(q.prompt, q.answer)
  for (const w of UNIT_30_WRITING) out.push(w.model, w.mustInclude.map(m => m.label).join(' '))
  for (const s of UNIT_30_SPEAKING) out.push(...s.turns.flatMap(t => [t.ai, ...t.hints]))
  return out
}
const MISTAKES = new Set(UNIT_30_GRAMMAR.flatMap(g => g.mistakes.map(m => m.wrong)))
const taught = () => germanTexts().filter(t => !MISTAKES.has(t))

const ALL_DATA = () => [
  UNIT_30,
  UNIT_30_GRAMMAR,
  UNIT_30_WHY_NOTES,
  UNIT_30_READING,
  UNIT_30_LISTENING,
  UNIT_30_SPEAKING,
  UNIT_30_WRITING,
  UNIT_30_EXERCISES,
  UNIT_30_FINAL,
  UNIT_30_VOCABULARY,
  META,
]

function kyTexts(): string[] {
  const out: string[] = []
  const walk = (v: unknown, key = '') => {
    if (typeof v === 'string') {
      if (/^(ky|exampleKy|promptKy|aiKy|titleKy|grammarKy)$/.test(key)) out.push(v)
    } else if (Array.isArray(v)) v.forEach(x => walk(x, key))
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (k !== 'source') walk(x, k)
  }
  walk(ALL_DATA())
  return out
}

const NOT_NOUN =
  /^(Wegen|Trotz|Während|Statt|Anstatt|Bei|In|Auf|Mit|Von|Zu|Nach|Aus|Für|An|Vor|Über|Unter|Seit|Ab|Bis|Um|Durch|Gegen|Im|Am|Vom|Zum|Zur)$/
const FUNCTION_WORD =
  /^(Die|Der|Das|Den|Dem|Ein|Eine|Und|Aber|Oder|Denn|Dass|Ob|Als|Wie|Wo|Wann|Warum|Was|Wer|Ja|Nein|Gern|Auch|Nur|Noch|Schon|Leider|Danke|Bitte|Hier|Dort|Heute|Morgen|Jetzt|Ich|Er|Sie|Wir|Man|Es|Ihr|Du|Dann|Wenn|Weil|Frau|Herr|Dr|Falls|Sobald|Solange|Nachdem|Lies|Liebe|Liebes|Welcher|Welches|Setze|Daher|Dennoch|Erstens|Zweitens|Außerdem|Wer)$/
const GEN_WORDS = '(?:des|eines|der|einer|meiner|meines|seiner|seines|ihrer|ihres|unserer|unseres|deiner|deines)'
/** a capitalised noun followed by a Genitiv article / possessive + noun: a Genitivattribut (receptive in B1; the Unit 30 texts do not use any) */
const genitivAttribute = (t: string) => {
  for (const m of t.matchAll(new RegExp(`\\b([A-ZÄÖÜ][a-zäöüß]+)\\s+${GEN_WORDS}\\s+(?:\\w+en\\s+)?([A-ZÄÖÜ][a-zäöüß]+)`, 'g')))
    if (!NOT_NOUN.test(m[1]) && !FUNCTION_WORD.test(m[1])) return true
  return false
}

/** a text-structuring word of the closed list in position 1 must be followed by the finite verb, not by a pronoun subject */
const connectorThenSubject = (t: string) =>
  sentences(t).some(sn => /^(Erstens|Zweitens|Außerdem|Darüber hinaus|Dennoch|Daher|Zum Beispiel) (ich|du|er|sie|es|wir|ihr|man) /.test(sn))
/** `sodass` after `so + adjective` is the wrong form (it must be `so … dass`) */
const soSodass = (t: string) => /\bso \w+, sodass\b/i.test(t)
/** purpose with `um` and a second subject (um die Kinder … zu haben) */
const umWithSecondSubject = (t: string) => /\bum (die|der|das) (Kinder|Nachbarn|Leute|Familien)\b[^,.!?]*\bzu \w+/.test(t)
/** `damit` / `weil` / `dass` / `sodass` clause that ends in the infinitive-looking verb group is fine; a verb DIRECTLY after the subordinator + subject is wrong */
const subordinateVerbSecond = (t: string) =>
  /\b(damit|sodass|dass|weil) (die Kinder|wir|sie|er|es|ich|man) (haben|können|kaufen|sind|ist|bekommen|werden) \w+/.test(t) &&
  !/\b(damit|sodass|dass|weil) (die Kinder|wir|sie|er|es|ich|man) (haben|können|kaufen|sind|ist|bekommen|werden)\s*[.,!?]/.test(t)

const FORBIDDEN: [string, (t: string) => boolean][] = [
  ['Passiv Perfekt (receptive in Unit 24 only)', t => /\bworden\b/i.test(t)],
  [
    'Futur II (B2)',
    t =>
      /\b(wird|werde|werden|wirst)\b[^.!?]*\b(ge\w+(t|en)|\w+iert|(be|ver|er|ent|zer|miss)\w+(t|en)|bestanden|verstanden|begonnen|erreicht)\s+(haben|sein)\b/i.test(
        t,
      ),
  ],
  ['Konjunktiv I / indirect speech in the subjunctive (B2)', t => /\b(er|sie|es|man)\s+sei\b|\bheiße es\b|\bgebe es\b|\bseien\b/i.test(t)],
  [
    'Konjunktiv II of the past (receptive, Unit 31)',
    t => /\b(hätte|hätten|hättest|wäre|wären)\b[^.!?,]*\b(ge\w+(t|en)|\w+iert)\s*[.!?,]/i.test(t),
  ],
  ['Genitivattribut (receptive, Unit 29): none is used in Unit 30', genitivAttribute],
  ['Genitiv relative pronoun (not allocated)', t => /,\s*(?:\w+\s+)?(dessen|deren)\b/i.test(t)],
  ['ohne … zu / statt … zu (receptive, Units 23 and 26)', t => /\bohne\b[^.!?]*\bzu \w+\b|\bstatt\b[^.!?]*\bzu \w+\b/i.test(t)],
  [
    'einerseits / andererseits / nicht nur … sondern auch (receptive, Unit 22)',
    t => /einerseits|andererseits|nicht nur[^.!?]*sondern auch/i.test(t),
  ],
  [
    'text connectors outside the closed list (allerdings, jedoch, somit, folglich, demnach, hingegen, zudem, ferner, infolgedessen)',
    t =>
      /\b(Allerdings|Jedoch|Somit|Folglich|Demnach|Hingegen|Zudem|Ferner|Infolgedessen|Nichtsdestotrotz|Gleichwohl|Außerdem hin)\b|\b(allerdings|jedoch|somit|folglich|demnach|hingegen|zudem|infolgedessen)\b/.test(
        t,
      ),
  ],
  [
    'Nomen-Verb-Verbindungen outside the closed list of 20',
    t =>
      /in Betracht|zum Ausdruck|Abschied nehmen|nimmt Abschied|nehme Abschied|Bilanz ziehen|in Erwägung|zur Diskussion|unter Beweis|Stellung beziehen|Maßnahmen ergreifen|Einfluss nehmen|Rechnung tragen|in Kraft|zur Anwendung|in Gang|Platz nehmen|Kritik üben|Bedeutung haben|zur Wahl stehen|unter Druck|ins Leben rufen|in die Tat umsetzen/.test(
        t,
      ),
  ],
  ['so + adjective + sodass (the form is so … dass)', soSodass],
  ['um … zu with a second subject (the form is damit)', umWithSecondSubject],
  ['verb in second position after a subordinating conjunction', subordinateVerbSecond],
  ['text connector followed by a pronoun subject (the verb must follow the connector)', connectorThenSubject],
  [
    'politics, parties and real organisations (the unit is non-partisan and invents all organisations)',
    t =>
      /Partei|Politiker|Regierung|Kanzler|Bundestag|Wahlkampf|AfD|CDU|SPD|FDP|Linke|Demonstration|Caritas|Diakonie|Rotes Kreuz|Amnesty|Greenpeace|UNICEF|Deutsche Welle|Volkshochschule/.test(
        t,
      ),
  ],
  [
    'claims about the real rules or the society of a real country',
    t =>
      /In Deutschland (ist|sind|gibt|muss|darf|dürfen|kostet|haben|hat)|Die Deutschen|Die Kirgisen|In Kirgistan (ist|sind|gibt)|In der Schweiz|In Österreich/.test(
        t,
      ),
  ],
]

/** a generalisation about a generation, nationality, family model or social group (the unit shows individuals and "manche") */
const stereotype = (t: string) =>
  /\b(die|alle|viele)\s+(Jungen|Alten|Jugendlichen|Senioren|Rentner|Ausländer|Migranten|Zuwanderer|Flüchtlinge|Frauen|Männer|Muslime|Christen|Behinderten|Alleinerziehenden|Deutschen|Kirgisen|Russen|Türken)\s+(sind|können|wollen|haben|machen|interessieren)\b|\b(Junge|Alte|Jugendliche|Senioren|Rentner|Ausländer|Migranten|Frauen|Männer)\s+(sind|können|wollen)\s+(immer|nie|alle|nur)\b|\balle (Alten|Jungen|Nachbarn aus [A-ZÄÖÜ]\w+) (sind|wollen|haben)\b/i.test(
    t,
  )

describe('identity and integration (B1 is a Beta for ru and ky)', () => {
  it('the unit equals its approved plan entry', () => {
    const plan = B1_UNIT_PLAN.find(p => p.id === 30)!
    expect(UNIT_30).toMatchObject({ id: 30, key: plan.key, title: plan.titleDe, level: 'B1' })
    expect(plan.key).toBe('b1-gesellschaft-engagement')
    expect(plan.titleDe).toBe('Gesellschaft, Zusammenleben und Engagement')
    expect(UNIT_30.grammarIds).toEqual(CONCEPTS)
  })
  it('the content module holds Unit 30 after Units 21–29, wired into the metadata, the tests, the final tests and the speaking list', () => {
    expect(B1_CONTENT.legacyUnits.map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_META.map(m => m.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.tests).toContainEqual(UNIT_30_TEST)
    expect(B1_CONTENT.unitSpeaking.slice(0, 10).at(-1)).toBe('b1-sp-30-01')
    expect(B1_CONTENT.finalTests.map(f => f.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
  })
  it('B1 is a Beta: released for ru and ky only, offered to those interfaces and never to the German one', () => {
    expect(courseLevel('B1')).toMatchObject({ status: 'beta', releasedLocales: ['ru', 'ky'] })
    for (const lang of ['ru', 'ky'] as const) expect(availableLevels(lang)).toContain('B1')
    expect(availableLevels('de')).not.toContain('B1')
  })
  it('registered in the catalog, the unit is reachable through the standard selectors; the main writing task comes first; the Writing Lab holds all three', () => {
    registerLevelContent('B1', B1_CONTENT)
    expect(vocabularyForUnit(30)).toHaveLength(40)
    expect(grammarForUnit(30).map(g => g.id)).toEqual(CONCEPTS)
    expect(finalTestOfUnit(30)?.questions).toHaveLength(15)
    expect(topicTestOfUnit(30)).toMatchObject({ id: 'unit-30', level: 'B1', size: 15 })
    expect(speakingForUnit(30)).toBe('b1-sp-30-01')
    const ids = ['b1-wr-30-01', 'b1-wr-30-02', 'b1-wr-30-03']
    expect(writingForUnit(30).map(w => w.id)).toEqual(ids)
    const lab = writingOf('B1').map(w => w.id)
    for (const id of ids) expect(lab).toContain(id)
  })
})

describe('grammar: only the three approved concepts', () => {
  it('exactly the approved ids, in order, owned by Unit 30, level B1; the curriculum classification is P-lim / P / P-lim (D-8 pending on the first)', () => {
    expect(UNIT_30_GRAMMAR.map(g => g.id)).toEqual(CONCEPTS)
    for (const g of UNIT_30_GRAMMAR) expect(g).toMatchObject({ unit: 30, level: 'B1' })
    const spec = B1_CURRICULUM.units.find(u => u.unit === 30)!
    expect(spec.concepts.map(c => c.id)).toEqual(CONCEPTS)
    expect(spec.concepts.map(c => c.proficiency)).toEqual(['P-lim', 'P', 'P-lim'])
    expect(spec.concepts[0].listCap).toBe(20)
    expect(spec.concepts[0].expertReview).toMatchObject({ status: 'pending', decision: 'D-8' })
    expect(spec.concepts[1].expertReview).toBeUndefined()
    expect(spec.concepts[2].expertReview).toBeUndefined()
  })
  it('every concept is complete: explanation, 5 examples, mistakes, real-life, dialogue, speaking prompt — in Russian and in Kyrgyz', () => {
    for (const g of UNIT_30_GRAMMAR) {
      expect(g.examples).toHaveLength(5)
      expect(g.mistakes.length).toBeGreaterThanOrEqual(4)
      expect(g.reallife).toHaveLength(3)
      expect(g.dialogue.length).toBeGreaterThanOrEqual(4)
      expect(g.when).toHaveLength(4)
      for (const l of [g.title, g.summary, g.discover, g.why, ...g.when, g.speakPrompt.prompt, ...g.mistakes.map(m => m.note)]) {
        expect(l.ru.length).toBeGreaterThan(5)
        expect((l.ky ?? '').length).toBeGreaterThan(5)
        expect(l.ky).not.toBe(l.ru)
      }
      for (const x of [...g.examples, ...g.reallife, ...g.dialogue]) {
        expect(x.ru).toBeTruthy()
        expect(x.ky).toBeTruthy()
        expect(x.ky).not.toBe(x.ru)
      }
    }
  })
  it('the why-notes: one on the Nomen-Verb-Verbindungen, two on damit / sodass, one on the text-structuring words', () => {
    expect(UNIT_30_WHY_NOTES.map(n => n.conceptId)).toEqual([CONCEPTS[0], CONCEPTS[1], CONCEPTS[1], CONCEPTS[2]])
  })
  it('the examples really show their concept', () => {
    const nvv = UNIT_30_GRAMMAR[0].examples.map(x => x.de).join(' ')
    for (const re of [
      /eine Entscheidung treffen/,
      /nehme [^.]*Kontakt auf/,
      /Verantwortung/,
      /zur Verfügung/,
      /einen [^.]* Beitrag leisten/,
    ])
      expect(nvv, String(re)).toMatch(re)
    const kf = UNIT_30_GRAMMAR[1].examples.map(x => x.de).join(' ')
    for (const re of [/, sodass \w+/, /so laut, dass/, /, damit die Kinder/, /, um [^,.]*(\bzu \w+|\w+zu\w+)/])
      expect(kf, String(re)).toMatch(re)
    for (const x of UNIT_30_GRAMMAR[2].examples)
      expect(x.de, x.de).toMatch(/^(Erstens|Zweitens|Außerdem|Darüber hinaus|Dennoch|Zum Beispiel|Es gibt auch Kritik\. Dennoch)/)
  })
  it('every "mistake" really differs from its correction, and the wrong form never appears in the taught texts', () => {
    for (const g of UNIT_30_GRAMMAR) for (const m of g.mistakes) expect(m.wrong).not.toBe(m.right)
    const wrong = UNIT_30_GRAMMAR.flatMap(g => g.mistakes.map(m => m.wrong))
    for (const t of taught()) expect(wrong.includes(t), t).toBe(false)
  })
  it('scope guard: nothing that belongs to a later unit, is receptive-only or lies outside the closed lists', () => {
    for (const t0 of taught())
      for (const [name, test] of FORBIDDEN) {
        const t = t0.replace(/Liebe[rn]? \w+, /g, '')
        expect(test(t), `${name}: "${t.slice(0, 90)}"`).toBe(false)
      }
  })
  it('REGRESSION of the scope guard: genuine out-of-scope German IS still detected, and the allowed phrases are not flagged', () => {
    const bad: [string, string][] = [
      ['Passiv Perfekt (receptive in Unit 24 only)', 'Die Heizung ist erneuert worden.'],
      ['Futur II (B2)', 'Bis morgen wird er das Projekt gebaut haben.'],
      ['Konjunktiv I / indirect speech in the subjunctive (B2)', 'Er sagt, er sei krank.'],
      ['Konjunktiv II of the past (receptive, Unit 31)', 'Ich wäre gern zum Fest gegangen.'],
      ['Genitivattribut (receptive, Unit 29): none is used in Unit 30', 'Die Ziele des Vereins sind klar.'],
      ['Genitivattribut (receptive, Unit 29): none is used in Unit 30', 'Das Haus meiner Eltern steht am See.'],
      ['Genitiv relative pronoun (not allocated)', 'Das ist der Mann, dessen Auto hier steht.'],
      ['ohne … zu / statt … zu (receptive, Units 23 and 26)', 'Er hilft, ohne etwas zu fragen.'],
      ['einerseits / andererseits / nicht nur … sondern auch (receptive, Unit 22)', 'Einerseits ist es schön, andererseits teuer.'],
      [
        'text connectors outside the closed list (allerdings, jedoch, somit, folglich, demnach, hingegen, zudem, ferner, infolgedessen)',
        'Allerdings gibt es Kritik.',
      ],
      [
        'text connectors outside the closed list (allerdings, jedoch, somit, folglich, demnach, hingegen, zudem, ferner, infolgedessen)',
        'Das Projekt ist somit gesichert.',
      ],
      ['Nomen-Verb-Verbindungen outside the closed list of 20', 'Wir ziehen das in Betracht.'],
      ['Nomen-Verb-Verbindungen outside the closed list of 20', 'Er nimmt Abschied von den Nachbarn.'],
      ['Nomen-Verb-Verbindungen outside the closed list of 20', 'Die Regeln treten bald in Kraft.'],
      ['so + adjective + sodass (the form is so … dass)', 'Es war so laut, sodass wir nichts verstanden haben.'],
      ['um … zu with a second subject (the form is damit)', 'Wir sammeln Geld, um die Kinder einen Spielplatz zu bauen.'],
      ['verb in second position after a subordinating conjunction', 'Wir sammeln Spenden, damit die Kinder haben einen Spielplatz.'],
      ['text connector followed by a pronoun subject (the verb must follow the connector)', 'Daher wir gründen eine Gruppe.'],
      ['text connector followed by a pronoun subject (the verb must follow the connector)', 'Zum Beispiel wir können kochen.'],
      [
        'politics, parties and real organisations (the unit is non-partisan and invents all organisations)',
        'Die Partei unterstützt den Verein.',
      ],
      [
        'politics, parties and real organisations (the unit is non-partisan and invents all organisations)',
        'Der Verein arbeitet mit der Caritas zusammen.',
      ],
      ['claims about the real rules or the society of a real country', 'In Deutschland ist das Ehrenamt sehr beliebt.'],
    ]
    for (const [name, text] of bad) expect(FORBIDDEN.find(([n]) => n === name)![1](text), `${name}: "${text}" must be detected`).toBe(true)
    const ok: string[] = [
      'Es war so laut, dass wir nichts verstanden haben.',
      'Viele Nachbarn helfen mit, sodass das Fest ein großer Erfolg wird.',
      'Ich helfe im Verein, um neue Leute kennenzulernen.',
      'Wir sammeln Spenden, damit die Kinder einen Spielplatz haben.',
      'Außerdem hilft der Verein vielen Familien.',
      'Daher gründen wir eine Gruppe.',
      'Zum Beispiel können Nachbarn zusammen kochen.',
      'Wegen der Verspätung habe ich den Anschluss verpasst.',
      'Ich nehme morgen Kontakt auf.',
      'Der Raum steht allen Gruppen zur Verfügung.',
      'Dennoch machen viele Nachbarn mit.',
    ]
    for (const text of ok) for (const [name, test] of FORBIDDEN) expect(test(text), `${name}: "${text}" must NOT be flagged`).toBe(false)
  })
  it('the Nomen-Verb-Verbindungen are LIMITED: exactly the closed list of 20 (cap 20), each pair is explained in both languages, and the texts use many of them', () => {
    expect(META.concepts[0]).toMatchObject({ conceptId: 'b1-nomen-verb-verbindungen', proficiency: 'P-lim', load: 'M', role: 'new' })
    expect(NVV).toHaveLength(20)
    expect(new Set(NVV).size).toBe(20)
    expect(B1_CURRICULUM.units.find(u => u.unit === 30)!.concepts[0].listCap).toBe(20)
    const g = UNIT_30_GRAMMAR[0]
    const ru = g.when.map(x => x.ru).join(' ')
    const ky = g.when.map(x => x.ky).join(' ')
    for (const pair of NVV) {
      expect(ru, pair).toContain(pair)
      expect(ky, pair).toContain(pair)
    }
    const all = taught().join(' ')
    const forms: Record<string, RegExp> = {
      'eine Entscheidung treffen':
        /Entscheidung (zu )?trifft|Entscheidung treffen|Entscheidung trifft|treffen wir eine Entscheidung|eine Entscheidung treffen/,
      'Kontakt aufnehmen': /Kontakt aufnehmen|nehme[^.]* Kontakt auf|nimmt[^.]* Kontakt auf|nehmen Sie[^.]* Kontakt auf/,
      'Verantwortung übernehmen': /Verantwortung (zu )?übernehm|übernimm[^.]* Verantwortung|übernehmen[^.]* Verantwortung/,
      'einen Beitrag leisten': /Beitrag leist|leistet[^.]* Beitrag|leisten[^.]* Beitrag/,
      'Hilfe leisten': /Hilfe leist/,
      'zur Verfügung stehen': /zur Verfügung stehen|steht[^.]* zur Verfügung/,
      'zur Verfügung stellen': /zur Verfügung stell|stell\w+[^.]* zur Verfügung/,
      'Interesse zeigen': /Interesse zeig|zeigen Interesse|zeigt Interesse/,
      'Bescheid geben': /Bescheid geben|gibt[^.]* Bescheid|geben Sie[^.]* Bescheid|Bescheid\b/,
      'Stellung nehmen': /Stellung nehmen/,
      'einen Vorschlag machen': /Vorschlag machen/,
      'Erfahrungen sammeln': /Erfahrungen sammeln/,
      'Rücksicht nehmen': /Rücksicht nehmen/,
      'Unterstützung finden': /Unterstützung (finden|geben)|Unterstützung für/,
      'eine Frage stellen': /Frage stellen/,
    }
    const found = Object.entries(forms)
      .filter(([, re]) => re.test(all))
      .map(([k]) => k)
    expect(found.length).toBeGreaterThanOrEqual(11)
    for (const k of [
      'eine Entscheidung treffen',
      'Kontakt aufnehmen',
      'Verantwortung übernehmen',
      'einen Beitrag leisten',
      'zur Verfügung stehen',
      'zur Verfügung stellen',
      'Bescheid geben',
      'Interesse zeigen',
    ])
      expect(found, k).toContain(k)
  })
  it('the separable pair is conjugated correctly and the article / case of each noun is right (spot checks on the taught texts)', () => {
    const all = taught().join(' ')
    expect(all).not.toMatch(/\baufnehme\b|\baufnimmt\b|\bleistet ein Beitrag\b|\bmachen eine Entscheidung\b|zu Verfügung/)
    expect(all).toMatch(/einen (kleinen )?Beitrag/)
    expect(all).toMatch(/Ich nehme [^.]* Kontakt auf/)
  })
  it('sodass / so … dass / damit / um … zu: all four are used, `sodass` is PRODUCTIVE now (its receptive status of Unit 28 ends with Unit 29) and the same-subject rule holds', () => {
    const all = taught().join(' ')
    for (const re of [/, sodass \w+/, /so \w+, dass /, /, damit \w+/, /, um [^,.!?]* zu \w+/]) expect(all, String(re)).toMatch(re)
    expect(META.concepts[1]).toMatchObject({ conceptId: 'b1-konsekutiv-final', proficiency: 'P', load: 'M', role: 'new' })
    const m28 = B1_META.find(m => m.unit === 28)!.concepts[1].constructions![0]
    expect(m28).toMatchObject({ proficiency: 'R', forms: ['sodass'], receptiveThrough: 29 })
    // sodass really appears in production items of Unit 30 (a gap, a word order, a writing pattern, a speaking hint)
    const production = [
      ...UNIT_30_EXERCISES.flatMap(e => [e.prompt, e.answer, ...(e.options ?? []), ...(e.words ?? [])]),
      ...UNIT_30_FINAL.flatMap(q => [q.prompt, q.answer]),
      ...UNIT_30_SPEAKING.flatMap(s => s.turns.flatMap(t => t.hints)),
    ].join(' ')
    expect(production).toMatch(/\bsodass\b/)
    // damit and um … zu each appear in a production item, so the learner practises the choice between them
    expect(production).toMatch(/\bdamit\b/)
    expect(UNIT_30_FINAL.some(q => q.answer === 'um' && /zu \w+/.test(q.prompt))).toBe(true)
    // Units 21–29 still never use sodass in production (the receptive guard of the validator passes for them): checked by the validator below
  })
  it('the text-structuring words are LIMITED to the closed list (the 6 curriculum words + zweitens) and are used in position 1 with the verb directly after them', () => {
    expect(META.concepts[2]).toMatchObject({ conceptId: 'b1-textkohaesion', proficiency: 'P-lim', load: 'L', role: 'new' })
    expect(CONNECTORS).toEqual(['erstens', 'zweitens', 'außerdem', 'darüber hinaus', 'dennoch', 'daher', 'zum Beispiel'])
    const all = taught().join(' ')
    for (const c of CONNECTORS) expect(all.toLowerCase(), c).toContain(c.toLowerCase())
    for (const t of taught().flatMap(sentences)) expect(connectorThenSubject(t), t).toBe(false)
    expect(UNIT_30_GRAMMAR[2].examples.map(x => x.de).join(' ')).toMatch(/Erstens liegt/)
  })
})

describe('social content: fictional, balanced, respectful — no stereotype, no politics, no real organisation', () => {
  it('every reading and listening is labelled as invented; the speaking scenario and the tasks say so in the learner’s language', () => {
    for (const r of UNIT_30_READING) expect(`${r.title} ${r.body.join(' ')}`, r.id).toMatch(/erfunden|Erfundene/)
    for (const l of UNIT_30_LISTENING) expect(l.title, l.id).toMatch(/erfunden/)
    expect(UNIT_30_READING[0].body[0]).toMatch(/^Erfundene Reportage/)
    expect(UNIT_30_READING[1].body[0]).toMatch(/^Leserbriefe \(erfunden\)/)
    expect(UNIT_30_SPEAKING[0].goal.ru).toMatch(/вымышлен/)
    expect(UNIT_30_SPEAKING[0].goal.ky).toMatch(/ойдон чыгарылган/)
    for (const w of [MAIN, MICRO_N]) {
      expect(w.situation.ru, w.id).toMatch(/вымышлен/)
      expect(w.situation.ky, w.id).toMatch(/ойдон чыгарылган/)
    }
    for (const q of UNIT_30_FINAL.filter(x => x.skill === 'reading')) expect(q.prompt, q.id).toMatch(/\(erfunden\)/)
  })
  it('a contested community question (the courtyard) is shown with BOTH views, fairly: a supporter and a sceptic, with their reasons, and a neutral committee', () => {
    const r2 = UNIT_30_READING[1].body.join(' ')
    expect(r2).toMatch(/Herr Brandt schreibt: „Ich finde die Idee gut/)
    expect(r2).toMatch(/Frau Lindner schreibt: „Ich verstehe die Idee, habe aber Sorgen/)
    expect(r2).toMatch(/Beide Briefe nennen gute Gründe/)
    expect(r2).toMatch(/Es ist noch nichts entschieden/)
    expect(r2).toMatch(/Ein Fest im Jahr finde ich schön/)
    const l2 = UNIT_30_LISTENING[1].lines.map(x => x.text).join(' ')
    expect(l2).toMatch(/Das ist ein berechtigter Einwand/)
    expect(l2).toMatch(/Beide Meinungen sind wichtig/)
    expect(l2).toMatch(/Das finde ich fair\. Dennoch möchte ich/)
    expect(UNIT_30_LISTENING[1].lines.some(x => /stimmen wir ab/.test(x.text))).toBe(true)
  })
  it('opinions are personal and marked as such ("Ich finde", "Manche …", "nur meine Meinung"), in the tasks, the models, the speaking hints and the strategy note', () => {
    expect(MICRO_O.model).toMatch(/Ich finde/)
    expect(MICRO_O.model).toMatch(/Manche Menschen/)
    expect(MICRO_O.model).toMatch(/Das ist nur meine Meinung/)
    expect(MAIN.model).toMatch(/Manche Nachbarn fürchten Lärm\. Das kann ich verstehen/)
    expect(UNIT_30_SPEAKING[0].turns[5].hints.join(' ')).toMatch(/Ich verstehe das\. Dennoch/)
    expect(UNIT_30_SPEAKING[0].turns[3].hints.join(' ')).toMatch(/berechtigter Einwand/)
    expect(META.strands.strategyNote!.de).toMatch(/nicht von „den Jungen“, „den Alten“ oder anderen Gruppen/)
    expect(MICRO_O.tips.map(t => t.ru).join(' ')).toMatch(/только ваше мнение/)
    expect(MICRO_O.tips.map(t => t.ky).join(' ')).toMatch(/өз|сиздин пикириңиз/)
    expect(MICRO_N.tips.map(t => t.ru).join(' ')).toMatch(/добровольное/)
  })
  it('no text states a stereotype, names a party or a real organisation, or invents the rules of a real country', () => {
    for (const t of taught()) expect(stereotype(t), `stereotype: "${t.slice(0, 100)}"`).toBe(false)
    const all = JSON.stringify(ALL_DATA(), (k, v) => (k === 'source' ? undefined : v))
    for (const [name, test] of FORBIDDEN.filter(([n]) => /^(politics|claims about)/.test(n))) expect(test(all), name).toBe(false)
    expect(all).not.toMatch(/\bdie Jungen\b|\bdie Alten\b|\balle Alten\b|\balle Jungen\b|\bTypisch (deutsch|kirgisisch)\b/)
  })
  it('REGRESSION of the stereotype guard: generalisations about groups are detected, descriptions of individuals are not', () => {
    for (const t of [
      'Die Jungen wollen nur feiern.',
      'Alle Alten sind einsam.',
      'Die Senioren können nicht mehr helfen.',
      'Rentner sind immer zu Hause.',
      'Alle Nachbarn aus Birkenfeld sind laut.',
      'Die Ausländer wollen alle unter sich bleiben.',
    ])
      expect(stereotype(t), t).toBe(true)
    for (const t of [
      'Sie ist eine schlanke, humorvolle Frau mit kurzen grauen Haaren.',
      'Manche Nachbarn sind skeptisch.',
      'Die Mitglieder kommen aus vielen Ländern.',
      'Mein Nachbar ist aufgeschlossen und hilft sofort.',
      'Viele Menschen engagieren sich in ihrer Freizeit.',
      'Ältere Menschen und junge Familien wohnen hier.',
    ])
      expect(stereotype(t), t).toBe(false)
  })
  it('people are described by character and appearance only as INDIVIDUALS (a named or a single person), never as a type of group: the description words are used with a person', () => {
    const v = UNIT_30_VOCABULARY.filter(x =>
      ['humorvoll', 'schüchtern', 'schlank', 'kräftig', 'großzügig', 'aufgeschlossen', 'tolerant'].includes(x.de),
    )
    expect(v).toHaveLength(7)
    for (const x of v) expect(x.example, x.de).toMatch(/\b(Sie|Er|Der|Die|Meine?|Zwei|Am Anfang|Das)\b/)
    expect(UNIT_30_READING[0].body[1]).toMatch(
      /Die Vorsitzende heißt Frau Weiß\. Sie ist eine schlanke, humorvolle Frau mit kurzen grauen Haaren/,
    )
  })
  it('the vocabulary examples describe individuals, families or associations, not a country or a population', () => {
    for (const v of UNIT_30_VOCABULARY) expect(v.example, v.id).not.toMatch(/\bin (Deutschland|Kirgistan|Russland|Europa|Asien)\b/)
  })
})

describe('vocabulary: 40 new items, none already taught', () => {
  const b = fullBundle()
  const earlier = new Set(b.vocabulary.filter(v => v.unit <= 29).flatMap(v => lemmaKeys(v.de)))
  it('exactly 40 items (target 38–42), ids v30-1 … v30-40, unique across the whole B1 vocabulary', () => {
    expect(UNIT_30_VOCABULARY).toHaveLength(40)
    expect(UNIT_30_VOCABULARY.map(v => v.id)).toEqual(Array.from({ length: 40 }, (_, i) => `v30-${i + 1}`))
    expect(UNIT_30_VOCABULARY.every(v => v.unit === 30)).toBe(true)
    const ids = B1_CONTENT.vocabulary.map(v => v.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toHaveLength(1380)
  })
  it('no lemma repeats an A1, A2 or earlier B1 headword (the society words of Unit 22 and the A2 words are NOT repeated), and none is listed twice', () => {
    const keys = UNIT_30_VOCABULARY.flatMap(v => lemmaKeys(v.de))
    expect(keys.filter(k => earlier.has(k))).toEqual([])
    expect(new Set(keys).size).toBe(keys.length)
    const de = UNIT_30_VOCABULARY.map(v => v.de)
    for (const known of [
      'Verein',
      'Zusammenleben',
      'Veranstaltung',
      'Verantwortung',
      'Nachbarschaft',
      'Vorurteil',
      'Gesellschaft',
      'Mehrheit',
      'Minderheit',
      'Spielplatz',
      'Aufgabe',
      'unterstützen',
      'organisieren',
      'gerecht',
      'hilfsbereit',
      'rücksichtsvoll',
      'zuverlässig',
      'diskutieren',
      'abstimmen',
      'vorschlagen',
      'Nachbar',
      'Antrag',
    ])
      expect(de).not.toContain(known)
  })
  it('every item has article/plural where a noun, a German example, and independent Russian and Kyrgyz translations of the word and the example', () => {
    for (const v of UNIT_30_VOCABULARY) {
      if (v.pos === 'noun') expect(v.article, v.de).toBeTruthy()
      for (const f of [v.de, v.ru, v.ky, v.example, v.exampleRu, v.exampleKy ?? '']) expect(f.trim().length, v.id).toBeGreaterThan(1)
      expect(v.ky).not.toBe(v.ru)
      expect(v.exampleKy).not.toBe(v.exampleRu)
    }
    const ex = UNIT_30_VOCABULARY.map(v => v.example)
    expect(new Set(ex).size).toBe(ex.length)
    expect(UNIT_30_VOCABULARY.filter(v => v.pos === 'noun').length).toBeGreaterThanOrEqual(20)
    expect(UNIT_30_VOCABULARY.filter(v => v.pos === 'verb').length).toBeGreaterThanOrEqual(6)
    expect(UNIT_30_VOCABULARY.filter(v => v.pos === 'adj').length).toBeGreaterThanOrEqual(8)
  })
  it('the planned themes are present (Ehrenamt, Verein, Integration, Gleichberechtigung, Generationen, Familienmodelle, Nachbarschaftshilfe, Spende, Personenbeschreibung)', () => {
    const de = UNIT_30_VOCABULARY.map(v => v.de)
    for (const w of [
      'Ehrenamt',
      'Mitglied',
      'Vorstand',
      'Spende',
      'Initiative',
      'Versammlung',
      'Treffpunkt',
      'Gemeinschaft',
      'Vielfalt',
      'Toleranz',
      'Zusammenhalt',
      'Integration',
      'Gleichberechtigung',
      'Generation',
      'Familienmodell',
      'Nachbarschaftshilfe',
      'sich engagieren',
      'spenden',
      'sich beteiligen',
      'ehrenamtlich',
      'freiwillig',
      'schlank',
      'kräftig',
      'humorvoll',
      'schüchtern',
      'aufgeschlossen',
      'großzügig',
    ])
      expect(de, w).toContain(w)
  })
  it('the nouns of the Nomen-Verb-Verbindungen that are not yet known are vocabulary items; the pairs themselves are grammar', () => {
    const de = UNIT_30_VOCABULARY.map(v => v.de)
    for (const w of ['Rücksicht', 'Beitrag', 'Unterstützung']) expect(de, w).toContain(w)
    for (const p of NVV) expect(de).not.toContain(p)
  })
  it('Wortbildung strand: compounds, -schaft, -ung, -lich are present as items and explained in the metadata in three languages', () => {
    const de = UNIT_30_VOCABULARY.map(v => v.de)
    for (const w of [
      'Nachbarschaftshilfe',
      'Familienmodell',
      'Treffpunkt',
      'Stadtteil',
      'Gemeinschaft',
      'Versammlung',
      'Unterstützung',
      'ehrenamtlich',
    ])
      expect(de, w).toContain(w)
    const n = META.strands.wortbildungNote!
    expect(n.de && n.ru && n.ky).toBeTruthy()
    expect(n.ky).not.toBe(n.ru)
    for (const w of ['Nachbarschaftshilfe', '-schaft', '-ung', '-lich']) expect(n.de).toContain(w)
  })
  it('the unit REUSES the established society and community words as revision in its texts without listing them as new', () => {
    const all = germanTexts().join(' ')
    for (const w of [
      'Verein',
      'Nachbarn',
      'Spielplatz',
      'Verantwortung',
      'Veranstaltung|Treffen',
      'Generationen',
      'abstimmen|stimmen wir ab',
      'Vorschlag',
      'Gesellschaft|Gemeinschaft',
    ])
      expect(all, w).toMatch(new RegExp(w))
  })
})

describe('texts: progressive targets (band for Units 30–31 and the curriculum text for Unit 30)', () => {
  it('2 readings of 180–220 words and 2 listening scripts of 160–190 words', () => {
    expect(UNIT_30_READING).toHaveLength(2)
    expect(UNIT_30_LISTENING).toHaveLength(2)
    for (const r of UNIT_30_READING) {
      const n = r.body.reduce((a, p) => a + words(p), 0)
      expect(n, r.id).toBeGreaterThanOrEqual(180)
      expect(n, r.id).toBeLessThanOrEqual(220)
    }
    for (const l of UNIT_30_LISTENING) {
      const n = l.lines.reduce((a, x) => a + words(x.text), 0)
      expect(n, l.id).toBeGreaterThanOrEqual(160)
      expect(n, l.id).toBeLessThanOrEqual(190)
    }
  })
  it('sentences stay short (95th percentile ≤ 20, longest ≤ 26 words)', () => {
    const lens = [
      ...UNIT_30_READING.flatMap(r => r.body.flatMap(sentences)),
      ...UNIT_30_LISTENING.flatMap(l => l.lines.flatMap(x => sentences(x.text))),
    ]
      .map(words)
      .sort((a, b) => a - b)
    expect(lens[lens.length - 1]).toBeLessThanOrEqual(26)
    expect(lens[Math.ceil(0.95 * lens.length) - 1]).toBeLessThanOrEqual(20)
  })
  it('every dialogue line carries a Russian and a Kyrgyz translation; questions have 3 distinct options, exactly one correct; answer positions vary', () => {
    for (const l of UNIT_30_LISTENING) for (const x of l.lines) expect(x.ru && x.ky && x.ky !== x.ru).toBeTruthy()
    const qs = [...UNIT_30_LISTENING.flatMap(l => l.questions), ...UNIT_30_READING.flatMap(r => r.questions)]
    for (const q of qs) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options).size).toBe(3)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(3)
    }
    expect(new Set(UNIT_30_READING.flatMap(r => r.questions.map(q => q.answer))).size).toBe(3)
    expect(new Set(UNIT_30_LISTENING.flatMap(l => l.questions.map(q => q.answer))).size).toBe(3)
  })
  it('the listening keywords all have a gloss in the unit vocabulary', () => {
    const de = new Set(UNIT_30_VOCABULARY.map(v => v.de))
    for (const l of UNIT_30_LISTENING) for (const k of l.keywords) expect(de.has(k), `${l.id}: ${k}`).toBe(true)
  })
  it('the listening dialogues are coherent: greetings and closings; the interview names a purpose, a result and a limit; the meeting moves from objection to a vote and a review', () => {
    const l1 = UNIT_30_LISTENING[0].lines.map(x => x.text)
    expect(l1[0]).toMatch(/Wie hat alles angefangen/)
    expect(l1.at(-1)).toMatch(/Kontakt aufnehmen/)
    expect(l1.join(' ')).toMatch(/damit ältere Nachbarn nicht allein sind/)
    expect(l1.join(' ')).toMatch(/so viel, dass die Leute müde werden\. Dennoch bleiben die meisten dabei/)
    const l2 = UNIT_30_LISTENING[1].lines.map(x => x.text)
    expect(l2[0]).toMatch(/willkommen zur Versammlung/)
    const idx = (re: RegExp) => l2.findIndex(t => re.test(t))
    expect(idx(/berechtigter Einwand/)).toBeLessThan(idx(/stimmen wir ab/))
    expect(idx(/stimmen wir ab/)).toBeLessThan(idx(/in drei Monaten noch einmal/))
    expect(idx(/in drei Monaten noch einmal/)).toBeLessThan(idx(/zur Verfügung/))
  })
  it('the listening answer keys agree with the script (every correct option is supported by the text, no distractor is)', () => {
    const t1 = UNIT_30_LISTENING[0].lines.map(x => x.text).join(' ')
    const q1 = UNIT_30_LISTENING[0].questions
    expect(q1.map(q => q.options[q.answer])).toEqual([
      'Damit ältere Nachbarn nicht allein sind.',
      'Er bringt Essen.',
      'Manchmal ist es sehr viel Arbeit.',
      'Mehr junge Freiwillige.',
    ])
    expect(t1).toMatch(/Erstens bringen wir Essen/)
    expect(t1).toMatch(/Mehr junge Leute, die einen Beitrag leisten/)
    expect(t1).not.toMatch(/Reisen|Wohnungen reparieren|größeren Raum|Spenden von der Stadt/)
    const t2 = UNIT_30_LISTENING[1].lines.map(x => x.text).join(' ')
    const q2 = UNIT_30_LISTENING[1].questions
    expect(q2.map(q => q.options[q.answer])).toEqual([
      'Über den Hof hinter dem Gemeindehaus.',
      'Feste Zeiten, damit die Kinder schlafen können.',
      'Farbe und Holz zur Verfügung zu stellen.',
      'Man spricht noch einmal über die Zeiten.',
    ])
    expect(t2).toMatch(/Heute sprechen wir über den Hof hinter dem Gemeindehaus/)
    expect(t2).toMatch(/feste Zeiten\. Zweitens sollten alle Rücksicht nehmen, damit die Kinder schlafen können/)
    expect(t2).toMatch(/Ich stelle gern Farbe und Holz zur Verfügung/)
    expect(t2).not.toMatch(/Schwimmbad|hauptstraße/i)
  })
  it('the reading answer keys agree with the text', () => {
    const [r1, r2] = UNIT_30_READING
    const t1 = r1.body.join(' ')
    expect(r1.questions.map(q => q.options[q.answer])).toEqual([
      'richtig',
      'Damit sich die Generationen kennenlernen.',
      'Die Gemeinschaft ist ihnen wichtig.',
    ])
    expect(t1).toMatch(/Erstens bringen wir älteren Menschen das Essen\. Außerdem gehen wir mit ihnen einkaufen/)
    expect(t1).toMatch(/jeden Monat ein Treffen, damit sich die Generationen kennenlernen/)
    expect(t1).toMatch(/die Gemeinschaft ist ihnen wichtig/)
    const t2 = r2.body.join(' ')
    expect(r2.questions.map(q => q.options[q.answer])).toEqual(['falsch', 'Feste Zeiten für den Hof.', 'Noch nichts.'])
    expect(t2).toMatch(/Erstens ist der Hof zentral, zweitens ist er ruhig/)
    expect(t2).toMatch(/Daher möchte ich feste Zeiten/)
    expect(t2).toMatch(/Es ist noch nichts entschieden/)
  })
  it('the reading glosses give Russian and Kyrgyz for every word, independently, and gloss damit / um … zu, the connectors, the pairs and sodass', () => {
    for (const r of UNIT_30_READING) for (const g of r.gloss) expect(g.ky).not.toBe(g.ru)
    for (const r of UNIT_30_READING) for (const g of r.gloss) expect(g.grammarKy).not.toBe(g.grammar)
    const gl = UNIT_30_READING.flatMap(r => r.gloss.map(g => g.word + ' ' + g.grammar)).join(' ')
    for (const re of [/damit/, /um … zu/, /Erstens/, /Nomen-Verb-Verbindung/, /sodass/, /so … dass|so \+ /]) expect(gl).toMatch(re)
  })
  it('listening uses the existing browser text-to-speech lab: no audio file, no claim of verified playback; no assessment item depends on audio', () => {
    for (const l of UNIT_30_LISTENING) expect(Object.keys(l)).not.toContain('audio')
    for (const q of UNIT_30_FINAL) expect(q.skill).not.toBe('listening')
  })
  it('speaking: one scenario of 7 turns = Einleitung – two points – an objection (unexpected) – participation – a sceptical view – Schluss; the hints practise the text-structuring words, damit and the pairs', () => {
    const [s] = UNIT_30_SPEAKING
    expect(s.turns).toHaveLength(7)
    expect(s.level).toBe('B1')
    for (const t of s.turns) {
      expect(t.aiRu && t.aiKy).toBeTruthy()
      expect(t.hints.length).toBeGreaterThanOrEqual(3)
      expect(t.keywords.length).toBeGreaterThanOrEqual(3)
      for (const k of t.keywords) expect(k).toBe(k.toLowerCase())
    }
    expect(s.turns[0].hints.join(' ')).toMatch(/kurz unser Projekt vorstellen/)
    expect(s.turns[1].hints.join(' ')).toMatch(/Erstens/)
    expect(s.turns[2].hints.join(' ')).toMatch(/Außerdem/)
    expect(s.turns[2].hints.join(' ')).toMatch(/Darüber hinaus/)
    expect(s.turns[2].hints.join(' ')).toMatch(/Zum Beispiel/)
    expect(s.turns[3].ai).toMatch(/Ist das nicht zu teuer/)
    expect(s.turns[3].hints.join(' ')).toMatch(/damit wir Material kaufen können/)
    expect(s.turns[4].hints.join(' ')).toMatch(/Verantwortung übernehmen/)
    expect(s.turns[5].ai).toMatch(/skeptisch/)
    expect(s.turns[5].hints.join(' ')).toMatch(/Dennoch/)
    expect(s.turns[5].hints.join(' ')).toMatch(/Daher/)
    expect(s.turns[6].hints.join(' ')).toMatch(/Zum Schluss/)
    expect(META.scenario.id).toBe('b1-sp-30-01')
    expect(s.titleRu && s.titleKy).toBeTruthy()
    expect(s.goal.ru).toMatch(/самооценка/)
  })
})

describe('writing: the letter to the editor and the micro-tasks, all discoverable', () => {
  it('main task: 90 words minimum, a model that meets every one of the 7 expected elements, with at least four different text-structuring words', () => {
    expect(MAIN).toMatchObject({ id: 'b1-wr-30-01', minWords: 90, level: 'B1', unit: 30, formal: false })
    expect(words(MAIN.model)).toBeGreaterThanOrEqual(90)
    expect(MAIN.mustInclude).toHaveLength(7)
    for (const m of MAIN.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky).toBeTruthy()
      expect(m.explain!.ky).not.toBe(m.explain!.ru)
      expect(
        m.patterns.some(p => MAIN.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    const used = CONNECTORS.filter(c => MAIN.model.toLowerCase().includes(c))
    expect(used.length).toBeGreaterThanOrEqual(4)
    expect(MAIN.model).toMatch(/Erstens [^.]*, und zweitens/)
    expect(MAIN.model).toMatch(/damit wir Material kaufen können/)
    expect(MAIN.model).toMatch(/Dennoch gibt es auch Sorgen/)
    expect(MAIN.model).toMatch(/Daher schlage ich/)
    for (const t of MAIN.tips) expect(t.ky).not.toBe(t.ru)
  })
  it('the main task uses only the closed lists and no receptive construction in its model, and states opinions as opinions', () => {
    for (const [name, test] of FORBIDDEN) expect(test(MAIN.model), name).toBe(false)
    expect(MAIN.model).toMatch(/Manche Nachbarn fürchten Lärm/)
    expect(MAIN.model).toMatch(/Das kann ich verstehen/)
    expect(MAIN.tips.map(t => t.ru).join(' ')).toMatch(/Не называйте мнение фактом/)
    expect(MAIN.tips.map(t => t.ky).join(' ')).toMatch(/Пикирди факт катары атабаңыз/)
  })
  it('the opinion micro-task (kind "meinung", required by the curriculum): opinion + reason + another view; its model meets every element', () => {
    expect(MICRO_O).toMatchObject({ id: 'b1-wr-30-02', minWords: 30, level: 'B1', unit: 30, formal: false })
    expect(words(MICRO_O.model)).toBeGreaterThanOrEqual(30)
    expect(MICRO_O.mustInclude).toHaveLength(3)
    for (const m of MICRO_O.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky && m.explain.ky !== m.explain.ru).toBeTruthy()
      expect(
        m.patterns.some(p => MICRO_O.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(MICRO_O.model).toMatch(/\bIch finde\b/)
    expect(MICRO_O.model).toMatch(/Manche Menschen haben aber wenig Zeit/)
    expect(MICRO_O.model).toMatch(/Dennoch kann jeder einen kleinen Beitrag leisten/)
    expect(MICRO_O.situation.ru).toMatch(/Не называйте своё мнение фактом/)
  })
  it('the message to the neighbours (kind "note"): friendly, a goal with damit, an invitation with a pair, a date and a place — participation is voluntary', () => {
    expect(MICRO_N).toMatchObject({ id: 'b1-wr-30-03', minWords: 40, level: 'B1', unit: 30, formal: false })
    expect(words(MICRO_N.model)).toBeGreaterThanOrEqual(40)
    expect(MICRO_N.mustInclude).toHaveLength(4)
    for (const m of MICRO_N.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky && m.explain.ky !== m.explain.ru).toBeTruthy()
      expect(
        m.patterns.some(p => MICRO_N.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(MICRO_N.model).toMatch(/^Liebe Nachbarn/)
    expect(MICRO_N.model).toMatch(/damit die Kinder dort sicher spielen können/)
    expect(MICRO_N.model).toMatch(/gibt mir bitte bis Donnerstag Bescheid/)
    expect(MICRO_N.model).toMatch(/zur Verfügung/)
    expect(MICRO_N.model).toMatch(/Jede Hilfe zählt, auch eine Stunde/)
    expect(MICRO_N.model).not.toMatch(/müssen alle|Pflicht|sonst/)
  })
  it('the curriculum requires the opinion micro-task and the metadata declares both micro-tasks with the right kinds', () => {
    const spec = B1_CURRICULUM.units.find(u => u.unit === 30)!.requires
    expect(spec.meinungMicroTask).toBe(true)
    expect(spec.wortbildung).toBe(true)
    expect(META.microTasks).toEqual([
      { kind: 'meinung', taskId: 'b1-wr-30-02' },
      { kind: 'note', taskId: 'b1-wr-30-03' },
    ])
    expect(UNIT_30_WRITING.map(w => w.id)).toEqual(['b1-wr-30-01', 'b1-wr-30-02', 'b1-wr-30-03'])
  })
  it('NO writing task is omitted and every one is discoverable: the Writing Lab list holds all three; the unit page has the main row plus two extra rows', () => {
    registerLevelContent('B1', B1_CONTENT)
    const lab = writingOf('B1').filter(w => w.unit === 30)
    expect(lab.map(w => w.id)).toEqual(UNIT_30_WRITING.map(w => w.id))
    expect(writingForUnit(30)[0].id).toBe('b1-wr-30-01')
    expect(
      writingForUnit(30)
        .slice(1)
        .map(w => w.id),
    ).toEqual(['b1-wr-30-02', 'b1-wr-30-03'])
  })
  it('the writing tips tell the learner that the app checks only length and expected words and that quality is self-assessed (all tasks)', () => {
    for (const w of UNIT_30_WRITING) {
      expect(w.tips.map(t => t.ru).join(' ')).toMatch(/только объём и ожидаемые слова/)
      expect(w.tips.map(t => t.ky).join(' ')).toMatch(/көлөмдү жана күтүлгөн сөздөрдү гана/)
    }
  })
})

describe('exercises: answer keys are correct and unique', () => {
  it('10 handwritten exercises: 8 on the three concepts (3 + 3 + 2) + 2 recycled without a concept; types fill / choice / order; both languages everywhere', () => {
    expect(UNIT_30_EXERCISES).toHaveLength(10)
    expect(UNIT_30_EXERCISES.map(e => e.id)).toEqual(Array.from({ length: 10 }, (_, i) => `b1-ex-30-${String(i + 1).padStart(2, '0')}`))
    const withConcept = UNIT_30_EXERCISES.filter(e => e.concept)
    expect(withConcept).toHaveLength(8)
    expect(CONCEPTS.map(c => withConcept.filter(e => e.concept === c).length)).toEqual([3, 3, 2])
    expect(UNIT_30_EXERCISES.filter(e => !e.concept).map(e => e.id)).toEqual(['b1-ex-30-09', 'b1-ex-30-10'])
    expect(['fill', 'choice', 'order'].map(t => UNIT_30_EXERCISES.filter(e => e.type === t).length)).toEqual([4, 4, 2])
    for (const e of UNIT_30_EXERCISES) {
      expect(e.why.ru && e.why.ky).toBeTruthy()
      expect(e.why.ky).not.toBe(e.why.ru)
      expect(e.promptRu && e.promptKy, e.id).toBeTruthy()
    }
  })
  it('every choice / fill item: 3 distinct options and the answer is among them exactly once; every order item is a true permutation that is not pre-solved', () => {
    for (const e of UNIT_30_EXERCISES) {
      if (e.type === 'order') {
        expect([...(e.words ?? [])].sort().join('|')).toBe(e.answer.split(' ').sort().join('|'))
        expect(e.words!.join(' ')).not.toBe(e.answer)
      } else {
        expect(e.options).toHaveLength(3)
        expect(new Set(e.options).size).toBe(3)
        expect(e.options!.filter(o => o === e.answer)).toHaveLength(1)
      }
    }
    for (const e of UNIT_30_EXERCISES.filter(x => x.type === 'fill')) expect(e.prompt.match(/___/g)).toHaveLength(1)
  })
  it('a gap has exactly ONE correct filler: the wrong options each produce an ungrammatical or a differently-meaning sentence', () => {
    const by = (id: string) => UNIT_30_EXERCISES.find(e => e.id === id)!
    expect(by('b1-ex-30-01').answer).toBe('treffen')
    expect(by('b1-ex-30-04').options).toEqual(['damit', 'um', 'ob'])
    expect(by('b1-ex-30-04').answer).toBe('damit')
    // `sodass` is NOT offered as a distractor of the purpose gap (it would also be grammatical there)
    expect(by('b1-ex-30-04').options).not.toContain('sodass')
    expect(by('b1-ex-30-07').answer).toBe('Erstens')
    expect(by('b1-ex-30-07').prompt).toMatch(/Zweitens/)
    expect(by('b1-ex-30-10').answer).toBe('wird')
    expect(by('b1-ex-30-10').prompt).toMatch(/gerade/)
  })
  it('the sentence-level items: exactly one correct sentence, the wrong ones each contain a real learner error', () => {
    const e2 = UNIT_30_EXERCISES.find(x => x.id === 'b1-ex-30-02')!
    expect(e2.options!.filter(o => /^Ich nehme morgen Kontakt auf\.$/.test(o))).toEqual([e2.answer])
    expect(e2.options!.some(o => /aufnehme/.test(o))).toBe(true)
    expect(e2.options!.some(o => /nehme auf morgen/.test(o))).toBe(true)
    const e5 = UNIT_30_EXERCISES.find(x => x.id === 'b1-ex-30-05')!
    expect(e5.options!.filter(o => /sodass/.test(o))).toEqual([e5.answer])
    expect(e5.options!.some(o => /weil/.test(o))).toBe(true)
    expect(e5.options!.some(o => /obwohl/.test(o))).toBe(true)
    const e8 = UNIT_30_EXERCISES.find(x => x.id === 'b1-ex-30-08')!
    expect(e8.options!.filter(o => /Dennoch/.test(o))).toEqual([e8.answer])
    expect(e8.options!.some(o => /Daher/.test(o))).toBe(true)
    expect(e8.options!.some(o => /Zum Beispiel/.test(o))).toBe(true)
    const e9 = UNIT_30_EXERCISES.find(x => x.id === 'b1-ex-30-09')!
    expect(e9.options!.filter(o => /^Obwohl es regnet, kommen viele Nachbarn\.$/.test(o))).toEqual([e9.answer])
  })
  it('the exercises really use their construction, with commas fixed in the order items, and recycle the earlier concepts correctly', () => {
    const by = (id: string) => UNIT_30_EXERCISES.find(e => e.id === id)!
    expect(by('b1-ex-30-03').answer).toBe('Der Verein stellt den Raum zur Verfügung.')
    expect(by('b1-ex-30-06').answer).toBe('Es war so laut, dass wir nichts verstanden haben.')
    expect(by('b1-ex-30-06').words!.some(w => /,$/.test(w))).toBe(true)
    for (const e of UNIT_30_EXERCISES.filter(x => x.type !== 'choice'))
      for (const [name, test] of FORBIDDEN) expect(test(`${e.prompt} ${e.answer}`), `${e.id} ${name}`).toBe(false)
  })
})

describe('final test: structure, answer keys and scoring data', () => {
  it('15 questions = 8 grammar (2 damit/um … zu & Folge + 2 text-structuring words + 2 Nomen-Verb-Verbindungen + 2 recycled ↻) + 3 vocabulary + 4 reading, no listening; ≥ 2 gap-fill', () => {
    expect(UNIT_30_FINAL.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `b1-ft-30-${String(i + 1).padStart(2, '0')}`))
    const by = (s: string) => UNIT_30_FINAL.filter(q => q.skill === s)
    expect([by('grammar').length, by('vocabulary').length, by('reading').length, by('listening').length]).toEqual([8, 3, 4, 0])
    expect(by('grammar').filter(q => /___/.test(q.prompt)).length).toBeGreaterThanOrEqual(2)
    expect(CONCEPTS.map(c => by('grammar').filter(q => q.concept === c).length)).toEqual([2, 2, 2])
    expect(
      by('grammar')
        .filter(q => q.concept && !CONCEPTS.includes(q.concept))
        .map(q => q.concept),
    ).toEqual(['b1-konzessive-saetze', 'b1-passiv-praesens'])
    expect(UNIT_30_TEST).toMatchObject({ id: 'unit-30', kind: 'topic', level: 'B1', unit: 30, size: 15 })
  })
  it('the recycled concepts really exist in earlier units (obwohl / trotzdem of Unit 22, Passiv of Unit 24)', () => {
    const owner = new Map(fullBundle().grammar.map(g => [g.id, g.unit]))
    expect(owner.get('b1-konzessive-saetze')).toBe(22)
    expect(owner.get('b1-passiv-praesens')).toBe(24)
  })
  it('options: 3 distinct each, the answer appears exactly once, both languages with an explanation; positions are 5 / 5 / 5, never three in a row', () => {
    const pos: number[] = []
    for (const q of UNIT_30_FINAL) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options).size).toBe(3)
      expect(q.options.filter(o => o === q.answer)).toHaveLength(1)
      expect(q.promptRu && q.promptKy).toBeTruthy()
      expect(q.why.ru && q.why.ky).toBeTruthy()
      expect(q.why.ky).not.toBe(q.why.ru)
      pos.push(q.options.indexOf(q.answer))
    }
    expect([0, 1, 2].map(p => pos.filter(x => x === p).length)).toEqual([5, 5, 5])
    for (let i = 2; i < pos.length; i++) expect(pos[i] === pos[i - 1] && pos[i] === pos[i - 2]).toBe(false)
  })
  it('the grammar questions are unambiguous: the purpose gap needs um (same subject, infinitive with zu), the Folge question has exactly one so … dass sentence, the order question has exactly one logical order, the pair gaps have one idiomatic filler', () => {
    const q = (id: string) => UNIT_30_FINAL.find(x => x.id === id)!
    expect(q('b1-ft-30-01').prompt).toMatch(/um|___ mehr Menschen zu verstehen/)
    expect(q('b1-ft-30-01').answer).toBe('um')
    expect(q('b1-ft-30-02').options.filter(o => /so viele Leute, dass/.test(o))).toEqual([q('b1-ft-30-02').answer])
    expect(q('b1-ft-30-03').answer).toBe('Daher')
    const q4 = q('b1-ft-30-04')
    const order = (t: string) => ['Erstens', 'Außerdem', 'Daher'].map(w => t.indexOf(w))
    const logical = q4.options.filter(o => {
      const [a, b, c] = order(o)
      return a < b && b < c
    })
    expect(logical).toEqual([q4.answer])
    expect(q('b1-ft-30-05').answer).toBe('Verfügung')
    expect(q('b1-ft-30-06').answer).toBe('leisten')
    expect(q('b1-ft-30-07').answer).toBe('trotzdem')
  })
  it('the reading questions carry the German text untranslated and ask about one fact each; the two texts are new (not the unit readings)', () => {
    const rq = UNIT_30_FINAL.filter(q => q.skill === 'reading')
    for (const q of rq) {
      expect(q.prompt).toMatch(/^Lies /)
      expect(q.promptRu).toMatch(/^Прочитайте/)
      expect(q.promptKy).toMatch(/окуңуз/)
    }
    const read = UNIT_30_READING.flatMap(r => r.body).join(' ')
    for (const q of rq) {
      const passage = q.prompt.split('„').slice(1).join('„')
      for (let i = 0; i + 40 <= passage.length; i += 30) expect(read.includes(passage.slice(i, i + 40)), `${q.id} @${i}`).toBe(false)
    }
    expect(new Set(rq.map(q => q.prompt.split('“')[0])).size).toBe(2)
  })
  it('the final test shares no prompt (except the generic instruction line) and no answer with the revision exercises, and no prompt with another question (except the shared reading passage)', () => {
    const ex = new Set(UNIT_30_EXERCISES.flatMap(e => [e.prompt, e.answer]))
    const generic = new Set(['Welcher Satz ist richtig?', 'Bilde den Satz.', 'Welcher Text ist logisch?'])
    for (const q of UNIT_30_FINAL) {
      if (!generic.has(q.prompt)) expect(ex.has(q.prompt), q.id).toBe(false)
      expect(ex.has(q.answer), q.id).toBe(false)
    }
    const prompts = UNIT_30_FINAL.filter(q => q.skill !== 'reading')
      .map(q => q.prompt)
      .filter(p => !generic.has(p))
    expect(new Set(prompts).size).toBe(prompts.length)
  })
  it('scoring data: every question has its answer among its options (a perfect run is 15/15) and the pass mark of the existing rule (70 %) is 11 of 15', () => {
    expect(UNIT_30_FINAL.filter(q => q.options.includes(q.answer)).length).toBe(15)
    expect(Math.ceil(0.7 * 15)).toBe(11)
  })
})

describe('unit metadata, objectives and the spaced-revision set', () => {
  it('2–3 can-do goals and one objective per skill, each "Ich kann …" with independent Russian and Kyrgyz', () => {
    expect(META.canDo.length).toBeGreaterThanOrEqual(2)
    expect(META.canDo.length).toBeLessThanOrEqual(3)
    for (const t of [
      ...META.canDo,
      ...Object.values(META.objectives),
      META.scenario.unexpectedElement,
      META.strands.strategyNote!,
      ...META.strands.repairChunks,
    ]) {
      expect(t.de && t.ru && t.ky).toBeTruthy()
      expect(t.ky).not.toBe(t.ru)
    }
    for (const t of [...META.canDo, ...Object.values(META.objectives)]) expect(t.de.startsWith('Ich kann')).toBe(true)
    expect(Object.keys(META.objectives)).toEqual(['lesen', 'hoeren', 'sprechen', 'schreiben'])
    expect(META.strands.repairChunks.length).toBeGreaterThanOrEqual(3)
  })
  it('the classification is the approved one: P-lim/M (closed list of 20, D-8 open), P/M, P-lim/L (closed list)', () => {
    expect(META.concepts.map(c => [c.conceptId, c.proficiency, c.load, c.role])).toEqual([
      ['b1-nomen-verb-verbindungen', 'P-lim', 'M', 'new'],
      ['b1-konsekutiv-final', 'P', 'M', 'new'],
      ['b1-textkohaesion', 'P-lim', 'L', 'new'],
    ])
    expect(META.concepts.filter(c => c.load === 'H')).toHaveLength(0)
  })
  it('spaced revision: 4 words of Unit 29, 2 of Unit 27, 2 from A2 — real, existing vocabulary ids', () => {
    const vocab = new Map(fullBundle().vocabulary.map(v => [v.id, v.unit]))
    expect(META.revision!.fromPrevious.map(id => vocab.get(id))).toEqual([29, 29, 29, 29])
    expect(META.revision!.fromThirdBack.map(id => vocab.get(id))).toEqual([27, 27])
    for (const id of META.revision!.fromA2) {
      expect(vocab.get(id)! >= 11 && vocab.get(id)! <= 20, id).toBe(true)
    }
    expect(META.revision!.fromA2.length).toBeGreaterThanOrEqual(2)
    const newIds = new Set(UNIT_30_VOCABULARY.map(v => v.id))
    for (const id of [...META.revision!.fromPrevious, ...META.revision!.fromThirdBack, ...META.revision!.fromA2])
      expect(newIds.has(id), id).toBe(false)
    expect(META.revision!.block).toBeUndefined()
  })
})

describe('RU / KY parity and quality guards', () => {
  it('parity: every German item with a Russian text has a Kyrgyz text that is not identical, in every structure of the unit', () => {
    const missing: string[] = []
    const walk = (v: unknown, path: string) => {
      if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${path}[${i}]`))
      if (!v || typeof v !== 'object') return
      const o = v as Record<string, unknown>
      for (const [k, x] of Object.entries(o)) {
        if (k === 'source') continue
        const pair: Record<string, string> = {
          ru: 'ky',
          exampleRu: 'exampleKy',
          promptRu: 'promptKy',
          aiRu: 'aiKy',
          titleRu: 'titleKy',
          grammar: 'grammarKy',
        }
        const ky = pair[k]
        if (ky && typeof x === 'string' && x.trim()) {
          const y = o[ky]
          if (typeof y !== 'string' || !y.trim() || (y === x && /[А-Яа-я]/.test(x))) missing.push(`${path}.${k}`)
        }
        walk(x, `${path}.${k}`)
      }
    }
    walk(ALL_DATA(), 'unit30')
    expect(missing).toEqual([])
  })
  it('the Russian and the Kyrgyz are of comparable size (no half-translated string)', () => {
    const bad: string[] = []
    for (const v of UNIT_30_VOCABULARY) {
      if (v.ky.length < v.ru.length * 0.3 || v.ky.length > v.ru.length * 3.5) bad.push(`${v.id} ${v.ru} / ${v.ky}`)
      if ((v.exampleKy ?? '').length < v.exampleRu.length * 0.5) bad.push(`${v.id} example`)
    }
    expect(bad).toEqual([])
  })
  it('no invented Kyrgyz grammar label (project glossary policy): grammar is described, not labelled', () => {
    const all = kyTexts().join(' \n ')
    for (const bad of [
      'бүтүндөмө',
      'жакталган',
      'бөлүнүүчү этиш жуп',
      'ээрчимелүү',
      'багыныңкы',
      'баш сүйлөм',
      'кайтарым',
      'толук өткөн чак',
      'натыйжа сүйлөмү',
      'максат сүйлөмү',
      'номинал',
      'атоо-этиш',
    ])
      expect(all, bad).not.toContain(bad)
  })
  it('every Kyrgyz string is written in Cyrillic (quoted German allowed), has no Latin letter inside a Cyrillic word, and the unit has a large Kyrgyz body', () => {
    const ky = kyTexts()
    expect(ky.length).toBeGreaterThan(250)
    expect(ky.filter(t => t.length > 25 && !/[А-Яа-яЁёҢңӨөҮү]/.test(t))).toEqual([])
    for (const t of ky)
      expect(/[А-Яа-яЁёҢңӨөҮү][A-Za-z][А-Яа-яЁёҢңӨөҮү]|(?:^|[\s«(—])[A-Za-z][А-Яа-яЁёҢңӨөҮү]/.test(t), t.slice(0, 80)).toBe(false)
  })
  it('the explanations of exercises and final-test questions differ between Russian and Kyrgyz', () => {
    for (const e of UNIT_30_EXERCISES) expect(e.why.ky).not.toBe(e.why.ru)
    for (const q of UNIT_30_FINAL) expect(q.why.ky).not.toBe(q.why.ru)
  })
})

describe('validator and assessment honesty', () => {
  it('the validator finds 0 errors and 0 warnings in the real bundle (the receptive `sodass` of Unit 28 is no longer receptive in Unit 30); the review flags of Unit 30 are: missing human CEFR sign-off and the open decision D-8', () => {
    const is = validateContent(fullBundle())
    expect(is.filter(i => i.severity === 'error')).toEqual([])
    expect(is.filter(i => i.severity === 'warning')).toEqual([])
    expect(is.filter(i => i.rule.startsWith('b1-') && i.severity !== 'review' && /30/.test(i.where))).toEqual([])
    expect(is.filter(i => i.rule === 'b1-receptive-required')).toEqual([])
    expect(
      is
        .filter(i => i.where === 'units:30' && i.severity === 'review')
        .map(i => i.rule)
        .sort(),
    ).toEqual(['beta-review-pending', 'beta-review-pending', 'cefr-signoff-missing']) // + the Beta flags (ru, ky) since the B1 Beta launch
    expect(is.filter(i => i.where === 'grammar:b1-nomen-verb-verbindungen' && i.severity === 'review').map(i => i.rule)).toEqual([
      'b1-expert-review-pending',
    ])
    expect(is.filter(i => /^grammar:b1-(konsekutiv-final|textkohaesion)$/.test(i.where))).toEqual([])
    expect(
      is.filter(i => /^(reading:b1-re-30-\d{2}|listening:b1-li-30-\d{2}|writing:b1-wr-30-\d{2}|vocabulary:v30-\d+)(?:#|$)/.test(i.where) && i.severity === 'review'),
    ).toEqual([])
  })
  it('the unit never claims a CEFR level, a certificate or an exam result', () => {
    const all = JSON.stringify(ALL_DATA(), (k, v) => (k === 'source' ? undefined : v))
    expect(all).not.toMatch(/zertifikat|certificate|сертификат|B1 erreicht|достигнут уровень|official/i)
    expect(all).not.toMatch(/\bCEFR\b/)
  })
  it('speaking and writing feedback is a checklist and a self-assessment: no numeric CEFR or score field in the unit data', () => {
    const all = JSON.stringify([UNIT_30_SPEAKING, UNIT_30_WRITING])
    expect(all).not.toMatch(/"(score|points|cefrScore|level_score)"/)
  })
  it('the provenance says the material is original, fictional where it reports associations and people, and NOT reviewed', () => {
    for (const x of [...UNIT_30_GRAMMAR, ...UNIT_30_READING, ...UNIT_30_LISTENING, ...UNIT_30_SPEAKING, ...UNIT_30_WRITING]) {
      expect(x.source?.kind).toBe('authored')
      expect(x.source?.author).toMatch(/pending independent CEFR, Russian and Kyrgyz review/)
    }
  })
})
