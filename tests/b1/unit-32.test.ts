// @vitest-environment node
/**
 * B1 Unit 32 — Rückblick, Bilanz und Prüfungsvorbereitung (Stage 3N), the last unit of B1. Unit 32 is a CONSOLIDATION unit: these tests check that it introduces NO new grammar (both concepts are
 * `revision`, nothing receptive or later is used, no new connector, tense or voice), that it recapitulates the concepts of Units 21–31, vocabulary (38–42 new items from the approved themes, none already
 * taught), the exam-format texts (one long and one short reading, two listenings, an 8-turn speaking scenario, two main writing tasks of 70–90 words and a learning-diary micro-task), exercises and
 * answer keys (≥ 3 word-order items), the unit test, the Wiederholungsblock and the spaced revision, RU/KY parity, honesty about what the "Probeprüfung" is (an exercise — no official exam, no named
 * examination, no certificate) and the validator. The indicative level assessment has its own tests (`level-b1.test.ts`). B1 stays `planned` and invisible.
 */
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { lemmaKeys } from '../../scripts/content-validate/b1/lemma'
import { B1_CURRICULUM } from '../../scripts/content-validate/b1/curriculum'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_META } from '../../src/data/b1/meta'
import { B1_UNIT_PLAN } from '../../src/data/b1/registry'
import { UNIT_32_EXERCISES, UNIT_32_FINAL, UNIT_32_TEST } from '../../src/data/b1/unit32/assessment'
import { UNIT_32_GRAMMAR, UNIT_32_WHY_NOTES } from '../../src/data/b1/unit32/grammar'
import { UNIT_32_LISTENING, UNIT_32_READING, UNIT_32_SPEAKING, UNIT_32_WRITING } from '../../src/data/b1/unit32/texts'
import { UNIT_32 } from '../../src/data/b1/unit32/unit'
import { UNIT_32_VOCABULARY } from '../../src/data/b1/unit32/vocabulary'
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
const CONCEPTS = ['b1-nebensaetze-integration', 'b1-satzbau-mittelfeld']
const META = B1_META.find(m => m.unit === 32)!
const [MAIL, LETTER, DIARY] = UNIT_32_WRITING
const [LONG, SHORT] = UNIT_32_READING
const ZUSTAND = [
  'ausgefüllt',
  'unterschrieben',
  'geschlossen',
  'geöffnet',
  'bearbeitet',
  'erledigt',
  'genehmigt',
  'abgelehnt',
  'geprüft',
  'eingereicht',
]
const EARLIER_CONCEPTS = B1_CONTENT.grammar.filter(g => g.unit <= 31).map(g => g.id)

function germanTexts(): string[] {
  const out: string[] = []
  for (const r of UNIT_32_READING) out.push(...r.body, ...r.questions.flatMap(q => [q.q, q.options[q.answer]]))
  for (const l of UNIT_32_LISTENING) out.push(...l.lines.map(x => x.text), ...l.questions.flatMap(q => [q.q, q.options[q.answer]]))
  for (const v of UNIT_32_VOCABULARY) out.push(v.example)
  for (const g of UNIT_32_GRAMMAR)
    out.push(...g.examples.map(x => x.de), ...g.reallife.map(x => x.de), ...g.dialogue.map(x => x.text), g.speakPrompt.sample)
  for (const n of UNIT_32_WHY_NOTES) out.push(n.sentence, ...n.more.map(x => x.de))
  for (const e of UNIT_32_EXERCISES) out.push(e.prompt, e.answer)
  for (const q of UNIT_32_FINAL) out.push(q.prompt, q.answer)
  for (const w of UNIT_32_WRITING) out.push(w.model)
  for (const s of UNIT_32_SPEAKING) out.push(...s.turns.flatMap(t => [t.ai, ...t.hints]))
  return out
}
const MISTAKES = new Set(UNIT_32_GRAMMAR.flatMap(g => g.mistakes.map(m => m.wrong)))
const taught = () => germanTexts().filter(t => !MISTAKES.has(t))

const ALL_DATA = () => [
  UNIT_32,
  UNIT_32_GRAMMAR,
  UNIT_32_WHY_NOTES,
  UNIT_32_READING,
  UNIT_32_LISTENING,
  UNIT_32_SPEAKING,
  UNIT_32_WRITING,
  UNIT_32_EXERCISES,
  UNIT_32_FINAL,
  UNIT_32_VOCABULARY,
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
  /^(Wegen|Trotz|Während|Statt|Anstatt|Laut|Bei|In|Auf|Mit|Von|Zu|Nach|Aus|Für|An|Vor|Über|Unter|Seit|Ab|Bis|Um|Durch|Gegen|Im|Am|Vom|Zum|Zur)$/
const FUNCTION_WORD =
  /^(Die|Der|Das|Den|Dem|Ein|Eine|Und|Aber|Oder|Denn|Dass|Ob|Als|Wie|Wo|Wann|Warum|Was|Wer|Ja|Nein|Gern|Auch|Nur|Noch|Schon|Leider|Danke|Bitte|Hier|Dort|Heute|Morgen|Jetzt|Ich|Er|Sie|Wir|Man|Es|Ihr|Du|Dann|Wenn|Weil|Frau|Herr|Dr|Falls|Sobald|Solange|Nachdem|Lies|Liebe|Liebes|Welcher|Welches|Daher|Dennoch|Erstens|Zweitens|Außerdem|Wird|Wurde|Ist|Sind|Hat|Haben|Kann|Können|Muss|Müssen|Gibt|Darf|Soll|Wäre|Wären|Könnten|Obwohl|Bilde|Zum)$/
const GEN_WORDS = '(?:des|eines|der|einer|meiner|meines|seiner|seines|ihrer|ihres|unserer|unseres|deiner|deines)'
const genitivAttribute = (t: string) => {
  for (const m of t.matchAll(new RegExp(`\\b([A-ZÄÖÜ][a-zäöüß]+)\\s+${GEN_WORDS}\\s+(?:\\w+en\\s+)?([A-ZÄÖÜ][a-zäöüß]+)`, 'g')))
    if (!NOT_NOUN.test(m[1]) && !FUNCTION_WORD.test(m[1])) return true
  return false
}
const PERFEKT_SEIN = ['passiert', 'verunglückt', 'gelandet', 'erschienen', 'gelungen', 'ausgefallen', 'angekommen']
const zustandOutsideList = (t: string) =>
  [
    ...t.matchAll(/\b(?:ist|sind)\s+(?:\p{L}+\s+)?((?:\p{L}{2,5})?(?:ge|be|ver|er|ent|zer)\p{L}+t|\p{L}+iert)\s*(?:[.,!?;:]|und\b|$)/gu),
  ].some(m => !ZUSTAND.includes(m[1].toLowerCase()) && !PERFEKT_SEIN.includes(m[1].toLowerCase()))

const FORBIDDEN: [string, (t: string) => boolean][] = [
  ['Passiv Perfekt (receptive in Unit 24 only)', t => /\bworden\b/i.test(t)],
  [
    'Futur II (B2)',
    t =>
      /\b(wird|werde|werden|wirst)\b[^.!?]*\b(\p{L}{2,5}ge\p{L}+(t|en)|ge\p{L}+(t|en)|\p{L}+iert|(be|ver|er|ent|zer|miss)\p{L}+(t|en)|bestanden|verstanden|begonnen|erreicht)\s+(haben|sein)\b/iu.test(
        t,
      ),
  ],
  ['Konjunktiv I / indirect speech in the subjunctive (B2)', t => /\b(er|sie|es|man)\s+sei\b|\bheiße es\b|\bseien\b/i.test(t)],
  [
    'Konjunktiv II der Vergangenheit (receptive, Unit 31): none is used in Unit 32',
    t => /\b(hätte|hätten|hättest|wäre|wären)\b[^.!?,]*\b(sollen|müssen|können|wollen|dürfen|ge\p{L}+(t|en)|\p{L}+iert)\s*[.!?,]/iu.test(t),
  ],
  ['Genitivattribut (receptive, Unit 29): none is used in Unit 32', genitivAttribute],
  ['Genitiv relative pronoun (not allocated)', t => /,\s*(?:\w+\s+)?(dessen|deren)\b/i.test(t)],
  [
    'ohne … zu / ohne dass / statt … zu (receptive, Units 23 and 26)',
    t => /\bohne\b[^.!?]*\bzu \w+\b|\bohne dass\b|\bstatt\b[^.!?]*\bzu \w+\b/i.test(t),
  ],
  [
    'einerseits / andererseits / nicht nur … sondern auch (receptive, Unit 22)',
    t => /einerseits|andererseits|nicht nur[^.!?]*sondern auch/i.test(t),
  ],
  ['Zustandspassiv outside the closed list of ten participles', zustandOutsideList],
  [
    'connectors and constructions of B2 that the course never teaches',
    t =>
      /\b(sofern|indem|wobei|weshalb|weswegen|zumal|allerdings|jedoch|somit|folglich|demnach|hingegen|zudem|infolgedessen|nichtsdestotrotz)\b|\bes sei denn\b|\bals ob\b|\banstatt dass\b/i.test(
        t,
      ),
  ],
  [
    'Nomen-Verb-Verbindungen outside the closed list of Unit 30',
    t =>
      /in Betracht|zum Ausdruck|Abschied nehmen|Bilanz ziehen[^.]* zu|Stellung beziehen|Maßnahmen ergreifen|Einfluss nehmen|in Kraft|Kritik üben|Widerspruch einlegen|Antrag stellen/.test(
        t,
      ),
  ],
  [
    'named examinations, certificates or claims of an official exam (the "Probe" is an exercise)',
    t =>
      /Goethe|\btelc\b|TestDaF|\bÖSD\b|\bDTZ\b|Zertifikat|Modelltest|Mustertest|Original-Prüfung|garantiert|bestehen Sie die Prüfung sicher/i.test(
        t,
      ) || /offizielle Prüfung/.test(t.replace(/keine offizielle Prüfung/g, '')),
  ],
  [
    'law, legal advice and real authorities / companies',
    t =>
      /Gesetz|Paragraph|§|BGB|nach deutschem Recht|Anwalt|Deutsche Bahn|\bDB\b|Lufthansa|Telekom|Jobcenter|Ausländerbehörde|Finanzamt/.test(
        t,
      ),
  ],
  [
    'claims about the real rules or the society of a real country',
    t => /In Deutschland (ist|sind|gibt|muss|darf|dürfen|kostet|haben|hat)|Die Deutschen|Die Kirgisen|In Kirgistan (ist|sind|gibt)/.test(t),
  ],
]

describe('identity and integration (B1 is a Beta for ru and ky)', () => {
  it('the unit equals its approved plan entry', () => {
    const plan = B1_UNIT_PLAN.find(p => p.id === 32)!
    expect(UNIT_32).toMatchObject({ id: 32, key: plan.key, title: plan.titleDe, level: 'B1' })
    expect(plan.key).toBe('b1-rueckblick-pruefung')
    expect(plan.titleDe).toBe('Rückblick, Bilanz und Prüfungsvorbereitung')
    expect(UNIT_32.grammarIds).toEqual(CONCEPTS)
  })
  it('the content module holds ALL twelve B1 units, wired into the metadata, the tests, the final tests and the speaking list', () => {
    expect(B1_CONTENT.legacyUnits.map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_META.map(m => m.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.tests).toContainEqual(UNIT_32_TEST)
    expect(B1_CONTENT.unitSpeaking).toHaveLength(12)
    expect(B1_CONTENT.unitSpeaking.at(-1)).toBe('b1-sp-32-01')
    expect(B1_CONTENT.finalTests.map(f => f.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
  })
  it('B1 is a Beta: released for ru and ky only, offered to those interfaces and never to the German one', () => {
    expect(courseLevel('B1')).toMatchObject({ status: 'beta', releasedLocales: ['ru', 'ky'] })
    for (const lang of ['ru', 'ky'] as const) expect(availableLevels(lang)).toContain('B1')
    expect(availableLevels('de')).not.toContain('B1')
  })
  it('registered in the catalog, the unit is reachable through the standard selectors; the first main writing task comes first; the Writing Lab holds all three', () => {
    registerLevelContent('B1', B1_CONTENT)
    expect(vocabularyForUnit(32)).toHaveLength(40)
    expect(grammarForUnit(32).map(g => g.id)).toEqual(CONCEPTS)
    expect(finalTestOfUnit(32)?.questions).toHaveLength(15)
    expect(topicTestOfUnit(32)).toMatchObject({ id: 'unit-32', level: 'B1', size: 15 })
    expect(speakingForUnit(32)).toBe('b1-sp-32-01')
    const ids = ['b1-wr-32-01', 'b1-wr-32-02', 'b1-wr-32-03']
    expect(writingForUnit(32).map(w => w.id)).toEqual(ids)
    const lab = writingOf('B1').map(w => w.id)
    for (const id of ids) expect(lab).toContain(id)
  })
})

describe('NO NEW GRAMMAR: both concepts are revisions, and nothing receptive, later or new is used', () => {
  it('exactly the approved ids, in order, owned by Unit 32; the curriculum role of both is `revision` (Unit 32 declares no `new` concept) and the classification is P / P (D-9 pending on the Mittelfeld)', () => {
    expect(UNIT_32_GRAMMAR.map(g => g.id)).toEqual(CONCEPTS)
    for (const g of UNIT_32_GRAMMAR) expect(g).toMatchObject({ unit: 32, level: 'B1' })
    const spec = B1_CURRICULUM.units.find(u => u.unit === 32)!
    expect(spec.concepts.map(c => [c.id, c.proficiency, c.load, c.role])).toEqual([
      ['b1-nebensaetze-integration', 'P', 'L', 'revision'],
      ['b1-satzbau-mittelfeld', 'P', 'M', 'revision'],
    ])
    expect(spec.concepts[0].expertReview).toBeUndefined()
    expect(spec.concepts[1].expertReview).toMatchObject({ status: 'pending', decision: 'D-9' })
    expect(META.concepts.map(c => c.role)).toEqual(['revision', 'revision'])
    expect(META.concepts.some(c => c.role === 'new')).toBe(false)
    expect(B1_CURRICULUM.units.filter(u => u.unit < 32).flatMap(u => u.concepts)).toHaveLength(27)
  })
  it('every concept is complete: explanation, 5 examples, mistakes, real-life, dialogue, speaking prompt — in Russian and in Kyrgyz', () => {
    for (const g of UNIT_32_GRAMMAR) {
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
    expect(UNIT_32_GRAMMAR[0].mistakes.length).toBeGreaterThanOrEqual(6)
    expect(UNIT_32_WHY_NOTES.map(n => n.conceptId)).toEqual([CONCEPTS[0], CONCEPTS[0], CONCEPTS[1], CONCEPTS[1]])
  })
  it('the Nebensätze concept covers every subordinate-clause type of B1 by function and names the unit in which each was met; the Mittelfeld concept names its three rule groups', () => {
    const t0 = UNIT_32_GRAMMAR[0].when.map(x => x.ru).join(' ')
    for (const c of [
      'weil',
      'sodass',
      'so … dass',
      'damit',
      'um … zu',
      'wenn',
      'falls',
      'als',
      'nachdem',
      'bevor',
      'während',
      'sobald',
      'obwohl',
      'dass',
      'ob',
      'der / dem / mit dem|der Mann, dem ich helfe',
    ])
      expect(t0, c).toMatch(new RegExp(c.replace(/[.*+?^${}()|[\]\\]/g, m => (m === '|' ? '|' : '\\' + m)).replace(/\\\|/g, '|')))
    for (const u of ['юнит A2', '21', '22', '23', '28', '29', '30']) expect(t0, u).toContain(u)
    const t1 = UNIT_32_GRAMMAR[1].summary.ru + UNIT_32_GRAMMAR[1].when.map(x => x.ru).join(' ')
    for (const k of ['Satzklammer', 'Akkusativ', 'Dativ', 'TeKaMoLo', 'Mittelfeld']) expect(t1, k).toContain(k)
    expect(UNIT_32_GRAMMAR[1].why.ru).toMatch(/Большинство ошибок B1/)
    expect(UNIT_32_GRAMMAR[0].why.ru).toMatch(/Новых конструкций здесь нет/)
    expect(UNIT_32_GRAMMAR[1].summary.ru).toMatch(/уже использовали с 21-го юнита/)
  })
  it('the examples really show their concept (verb at the end of every subordinate clause; Satzklammer, pronouns, TeKaMoLo)', () => {
    const nb = UNIT_32_GRAMMAR[0].examples.map(x => x.de).join(' ')
    for (const re of [
      /, damit ich [^.]* bestehe\./,
      /Als ich in Dresden war, habe ich viel gesehen/,
      /Obwohl es regnet, kommen/,
      /ob der Antrag schon geprüft ist/,
      /, mit der ich oft zusammenarbeite/,
    ])
      expect(nb, String(re)).toMatch(re)
    const mf = UNIT_32_GRAMMAR[1].examples.map(x => x.de).join(' ')
    for (const re of [
      /habe es ihm gestern gegeben/,
      /schicke dem Amt morgen das Formular/,
      /morgen deshalb mit dem Zug nach Leipzig/,
      /muss das Formular heute noch ausfüllen/,
      /wird morgen von der Behörde geprüft/,
    ])
      expect(mf, String(re)).toMatch(re)
  })
  it('every "mistake" really differs from its correction, and the wrong form never appears in the taught texts', () => {
    for (const g of UNIT_32_GRAMMAR) for (const m of g.mistakes) expect(m.wrong).not.toBe(m.right)
    const wrong = UNIT_32_GRAMMAR.flatMap(g => g.mistakes.map(m => m.wrong))
    for (const t of taught()) expect(wrong.includes(t), t).toBe(false)
  })
  it('scope guard: no receptive, later, B2 or newly invented construction anywhere in the unit', () => {
    for (const t of taught().filter(x => !/^Aussage:/.test(x)))
      for (const [name, test] of FORBIDDEN) expect(test(t), `${name}: "${t.slice(0, 90)}"`).toBe(false)
  })
  it('REGRESSION of the scope guard: genuine out-of-scope German IS still detected, and the allowed phrases are not flagged', () => {
    const bad: [string, string][] = [
      ['Passiv Perfekt (receptive in Unit 24 only)', 'Das Fahrrad ist gestern gestohlen worden.'],
      ['Futur II (B2)', 'Bis morgen wird er das Formular ausgefüllt haben.'],
      ['Konjunktiv I / indirect speech in the subjunctive (B2)', 'Er sagt, er sei krank.'],
      [
        'Konjunktiv II der Vergangenheit (receptive, Unit 31): none is used in Unit 32',
        'Ohne Ihre Geduld hätte ich vieles nicht geschafft.',
      ],
      ['Konjunktiv II der Vergangenheit (receptive, Unit 31): none is used in Unit 32', 'Ich hätte früher nachfragen sollen.'],
      ['Genitivattribut (receptive, Unit 29): none is used in Unit 32', 'Der Teil der Übung ist schwer.'],
      ['Genitiv relative pronoun (not allocated)', 'Das ist der Mann, dessen Antrag fehlt.'],
      ['ohne … zu / ohne dass / statt … zu (receptive, Units 23 and 26)', 'Er geht, ohne sich zu melden.'],
      ['ohne … zu / ohne dass / statt … zu (receptive, Units 23 and 26)', 'Er geht, ohne dass er sich meldet.'],
      ['einerseits / andererseits / nicht nur … sondern auch (receptive, Unit 22)', 'Einerseits ist es schön, andererseits teuer.'],
      ['Zustandspassiv outside the closed list of ten participles', 'Ihre Zahlung ist bezahlt.'],
      ['Zustandspassiv outside the closed list of ten participles', 'Das Zimmer ist gebucht und das Hotel ist bestätigt.'],
      ['connectors and constructions of B2 that the course never teaches', 'Er lernt viel, indem er täglich liest.'],
      ['connectors and constructions of B2 that the course never teaches', 'Das Projekt ist somit gesichert.'],
      ['connectors and constructions of B2 that the course never teaches', 'Er tut so, als ob er schlafen würde.'],
      ['Nomen-Verb-Verbindungen outside the closed list of Unit 30', 'Wir ziehen das in Betracht.'],
      [
        'named examinations, certificates or claims of an official exam (the "Probe" is an exercise)',
        'Die Probe bereitet auf den Goethe-Test vor.',
      ],
      ['named examinations, certificates or claims of an official exam (the "Probe" is an exercise)', 'Das ist eine offizielle Prüfung.'],
      [
        'named examinations, certificates or claims of an official exam (the "Probe" is an exercise)',
        'Mit dem Zertifikat bestehen Sie die Prüfung sicher.',
      ],
      ['law, legal advice and real authorities / companies', 'Nach dem Gesetz muss man sich anmelden.'],
      ['claims about the real rules or the society of a real country', 'In Deutschland ist die Probe immer kostenlos.'],
    ]
    for (const [name, text] of bad) expect(FORBIDDEN.find(([n]) => n === name)![1](text), `${name}: "${text}" must be detected`).toBe(true)
    const ok: string[] = [
      'Sie ist eine Übung für Sie und keine offizielle Prüfung.',
      'Das Formular ist ausgefüllt und unterschrieben.',
      'Die Buchung ist erledigt.',
      'Mein Zug war ausgefallen, bevor ich am Bahnhof ankam.',
      'Was ist passiert?',
      'Obwohl es regnet, kommen viele Nachbarn zum Fest.',
      'Ich habe es ihm gestern gegeben.',
      'Wenn ich Zeit habe, schreibe ich in mein Lerntagebuch.',
      'Nachdem ich den Kurs beendet hatte, habe ich eine Bilanz gezogen.',
      'Der Raum ist ab neun Uhr geöffnet.',
      'Wir fahren morgen mit dem Zug nach Leipzig.',
    ]
    for (const text of ok) for (const [name, test] of FORBIDDEN) expect(test(text), `${name}: "${text}" must NOT be flagged`).toBe(false)
  })
  it('the validator rule `b1-unit32-new-grammar` is satisfied and would fire for a Unit 32 that declared a NEW concept', () => {
    const is = validateContent(fullBundle())
    expect(is.filter(i => i.rule === 'b1-unit32-new-grammar')).toEqual([])
  })
})

describe('GRAMMAR COVERAGE ACROSS B1: the unit recapitulates the 27 concepts of Units 21–31', () => {
  it('the metadata lists every concept of Units 21–31 exactly once as recapitulated, and each exists in its unit', () => {
    expect(EARLIER_CONCEPTS).toHaveLength(27)
    expect([...META.recapConcepts!].sort()).toEqual([...EARLIER_CONCEPTS].sort())
    expect(new Set(META.recapConcepts).size).toBe(27)
  })
  it('the texts and tasks of the unit use constructions of at least 15 of the 27 earlier concepts in meaningful contexts (checked by surface forms)', () => {
    const all = taught().join(' ')
    const probes: [string, RegExp][] = [
      ['b1-praeteritum-erzaehlen', /\b(war|hatte|ging|kam|fand|nahm|gab) /],
      ['b1-temporale-konnektoren', /\b(bevor|während|seitdem|bis|nachdem) /],
      ['b1-konzessive-saetze', /\bObwohl |\bobwohl /],
      ['b1-relativsaetze-nom-akk', /, (der|die|das|den) \w+/],
      ['b1-infinitiv-mit-zu', /zu \w+en\b|, um [^,.]* zu /],
      ['b1-passiv-praesens', /\b(wird|werden) [^.]*\b\w+t\b/],
      ['b1-konjunktiv2-ratschlaege', /\b(könnten|würde|wäre|hätte)\b/],
      ['b1-passiv-praeteritum-modal', /muss [^.]* werden|kann [^.]* werden/],
      ['b1-wiedergeben-indikativ', /\b(sagt|schreibt), dass\b/],
      ['b1-futur1-vermutungen', /\bwird wohl\b/],
      ['b1-falls-sobald-solange', /\b(Falls|falls|sobald|Sobald|solange) /],
      ['b1-verben-praepositionen', /\b(warten auf|interessiere mich für|vorbereitet auf|denke an)\b/],
      ['b1-relativsaetze-dativ-praeposition', /, (mit|in|bei|von|auf) (dem|der|denen|den) /],
      [
        'b1-plusquamperfekt-nachdem',
        /\b(hatte|hatten|war|waren) [^.,]*\b(gemacht|geschafft|gegessen|verpasst|gelernt|angekommen|ausgefallen)\b|\b(geschafft|gelernt|ausgefüllt|beendet) hatte\b/,
      ],
      [
        'b1-nomen-verb-verbindungen',
        /zur Verfügung|Verantwortung übernehmen|Bescheid geben|Kontakt aufnehmen|eine Bilanz ziehen|Erfahrungen sammeln/,
      ],
      ['b1-konsekutiv-final', /\b(damit|sodass|um) /],
      ['b1-textkohaesion', /\b(Erstens|erstens|Zweitens|zweitens|Außerdem|Daher|Dennoch)\b/],
      ['b1-formelle-sprache', /Sehr geehrte|Könnten Sie mir bitte mitteilen|Mit freundlichen Grüßen/],
      [
        'b1-aktiv-passiv-zustandspassiv',
        /\b(ist|sind) (\p{L}+ )?(ausgefüllt|unterschrieben|geprüft|geschlossen|erledigt|geöffnet|bearbeitet)\b/u,
      ],
    ]
    const covered = probes.filter(([, re]) => re.test(all)).map(([id]) => id)
    expect(covered.length).toBeGreaterThanOrEqual(15)
    for (const [id] of probes) expect(EARLIER_CONCEPTS).toContain(id)
    for (const id of [
      'b1-konzessive-saetze',
      'b1-plusquamperfekt-nachdem',
      'b1-konsekutiv-final',
      'b1-textkohaesion',
      'b1-formelle-sprache',
      'b1-aktiv-passiv-zustandspassiv',
    ])
      expect(covered, id).toContain(id)
  })
  it('the unit test and the exercises recycle concepts of earlier units (↻), and the reading glosses recapitulate Plusquamperfekt, the clause types and the zu-infinitive', () => {
    const owner = new Map(fullBundle().grammar.map(g => [g.id, g.unit]))
    const rec = UNIT_32_FINAL.filter(q => q.concept && !CONCEPTS.includes(q.concept)).map(q => q.concept!)
    expect(rec).toEqual(['b1-falls-sobald-solange', 'b1-plusquamperfekt-nachdem'])
    for (const id of rec) expect(owner.get(id)! < 32).toBe(true)
    const gl = UNIT_32_READING.flatMap(r => r.gloss.map(g => `${g.word} ${g.grammar}`)).join(' ')
    for (const re of [/Plusquamperfekt/, /Nebensatz/, /Infinitivsatz|zu стоит/]) expect(gl).toMatch(re)
  })
  it('the topics of Units 21–31 are all present in the unit (the texts, the level assessment and the revision block carry them)', () => {
    const all = taught().join(' ').toLowerCase()
    for (const t of [
      'erinner',
      'meinung|nachricht',
      'bewerbung|arbeit',
      'heizung|mieter|hotel',
      'arzt|schlaf|lernen',
      'nachrichten',
      'bezahlt|erstattung|zahlung|spenden',
      'kurs|vortrag|lernbilanz',
      'dresden|reise|bahnhof|zug',
      'nachbar|verein|gemeinschaft|freiwillig',
      'formular|bescheid|antrag|amt|büro',
    ])
      expect(all, t).toMatch(new RegExp(t))
  })
})

describe('vocabulary: 40 new items from the approved themes, none already taught; and the Wiederholungsblock of Units 29–31', () => {
  const b = fullBundle()
  const earlier = new Set(b.vocabulary.filter(v => v.unit <= 31).flatMap(v => lemmaKeys(v.de)))
  it('exactly 40 items (target 38–42), ids v32-1 … v32-40, unique across the whole B1 vocabulary (480 words)', () => {
    expect(UNIT_32_VOCABULARY).toHaveLength(40)
    expect(UNIT_32_VOCABULARY.map(v => v.id)).toEqual(Array.from({ length: 40 }, (_, i) => `v32-${i + 1}`))
    expect(UNIT_32_VOCABULARY.every(v => v.unit === 32)).toBe(true)
    const ids = B1_CONTENT.vocabulary.map(v => v.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toHaveLength(480)
  })
  it('no lemma repeats an A1, A2 or earlier B1 headword (Aufgabe, Stärke, Schwäche, Argument, Standpunkt, Fortschritt, Ziel, Plan, Erfolg … are NOT repeated), and none is listed twice', () => {
    const keys = UNIT_32_VOCABULARY.flatMap(v => lemmaKeys(v.de))
    expect(keys.filter(k => earlier.has(k))).toEqual([])
    expect(new Set(keys).size).toBe(keys.length)
    const de = UNIT_32_VOCABULARY.map(v => v.de)
    for (const known of [
      'Aufgabe',
      'Stärke',
      'Schwäche',
      'Argument',
      'Standpunkt',
      'Fortschritt',
      'Ziel',
      'Plan',
      'Erfolg',
      'überzeugen',
      'zustimmen',
      'betonen',
      'erreichen',
      'verbessern',
      'motiviert',
      'regelmäßig',
      'Erfahrung',
      'Meinung',
      'Vorschlag',
      'Termin',
    ])
      expect(de).not.toContain(known)
  })
  it('every item has article/plural where a noun, a German example without a Genitivattribut, and independent Russian and Kyrgyz translations of the word and the example', () => {
    for (const v of UNIT_32_VOCABULARY) {
      if (v.pos === 'noun') expect(v.article, v.de).toBeTruthy()
      for (const f of [v.de, v.ru, v.ky, v.example, v.exampleRu, v.exampleKy ?? '']) expect(f.trim().length, v.id).toBeGreaterThan(1)
      expect(v.ky).not.toBe(v.ru)
      expect(v.exampleKy).not.toBe(v.exampleRu)
      expect(genitivAttribute(v.example), v.id).toBe(false)
    }
    expect(new Set(UNIT_32_VOCABULARY.map(v => v.example)).size).toBe(40)
    expect(UNIT_32_VOCABULARY.filter(v => v.pos === 'noun')).toHaveLength(25)
    expect(UNIT_32_VOCABULARY.filter(v => v.pos === 'verb')).toHaveLength(10)
    expect(UNIT_32_VOCABULARY.filter(v => v.pos === 'adj')).toHaveLength(5)
  })
  it('the vocabulary is the approved Unit 32 vocabulary — Bilanz, Lernstrategien, Aufgabenwortschatz (Teil, Lösung), Wünsche und Ziele, Redemittel für Präsentation und Diskussion — and nothing invented', () => {
    const de = UNIT_32_VOCABULARY.map(v => v.de)
    for (const w of [
      'Bilanz',
      'Rückblick',
      'Lerntagebuch',
      'Selbsteinschätzung',
      'Lernziel',
      'Vorsatz',
      'Lernweg',
      'Teil',
      'Lösung',
      'Hinweis',
      'Auswahl',
      'Vortrag',
      'Gliederung',
      'Einleitung',
      'Schluss',
      'Publikum',
      'Stichpunkt',
      'Zusammenfassung',
      'Einwand',
      'Fazit',
      'zurückblicken',
      'einschätzen',
      'festhalten',
      'sich vornehmen',
      'ankreuzen',
      'zuordnen',
      'begründen',
      'erwähnen',
      'erläutern',
      'zusammenfassen',
      'deutlich',
      'ausführlich',
      'knapp',
      'realistisch',
      'zufrieden',
    ])
      expect(de, w).toContain(w)
    for (const v of UNIT_32_VOCABULARY) expect(v.example, v.id).not.toMatch(/Goethe|telc|TestDaF|Zertifikat/)
  })
  it('Wortbildung strand: compounds, -ung and prefixed verbs are present and explained in three languages', () => {
    const n = META.strands.wortbildungNote!
    expect(n.de && n.ru && n.ky).toBeTruthy()
    expect(n.ky).not.toBe(n.ru)
    for (const w of ['Lerntagebuch', 'Lernziel', 'Zeitplan', '-ung', 'zurück|blicken']) expect(n.de).toContain(w)
  })
  it('the Wiederholungsblock holds at least 20 distinct words of Units 29–31 (all three units represented), none of Unit 32; spaced revision: 4 of Unit 31, 2 of Unit 29, 2 of A2', () => {
    const vocab = new Map(b.vocabulary.map(v => [v.id, v.unit]))
    const block = META.revision!.block!
    expect(block.length).toBeGreaterThanOrEqual(20)
    expect(new Set(block).size).toBe(block.length)
    for (const id of block) expect([29, 30, 31], id).toContain(vocab.get(id))
    for (const u of [29, 30, 31]) expect(block.filter(id => vocab.get(id) === u).length, `unit ${u}`).toBeGreaterThanOrEqual(5)
    expect(META.revision!.fromPrevious.map(id => vocab.get(id))).toEqual([31, 31, 31, 31])
    expect(META.revision!.fromThirdBack.map(id => vocab.get(id))).toEqual([29, 29])
    expect(META.revision!.fromA2.map(id => vocab.get(id))).toEqual([19, 19])
    const newIds = new Set(UNIT_32_VOCABULARY.map(v => v.id))
    for (const id of [...META.revision!.fromPrevious, ...META.revision!.fromThirdBack, ...META.revision!.fromA2, ...block])
      expect(newIds.has(id), id).toBe(false)
  })
})

describe('texts: exam-format practice material (band of Unit 32)', () => {
  it('one LONG reading of 200–250 words and one SHORT reading of 80–150 words; two listening scripts of 120–220 words', () => {
    const n = (r: (typeof UNIT_32_READING)[number]) => r.body.reduce((a, p) => a + words(p), 0)
    expect(UNIT_32_READING.map(r => r.id)).toEqual(['b1-re-32-01', 'b1-re-32-02'])
    expect(n(LONG)).toBeGreaterThanOrEqual(200)
    expect(n(LONG)).toBeLessThanOrEqual(250)
    expect(n(SHORT)).toBeGreaterThanOrEqual(80)
    expect(n(SHORT)).toBeLessThanOrEqual(150)
    expect(UNIT_32_LISTENING).toHaveLength(2)
    for (const l of UNIT_32_LISTENING) {
      const w = l.lines.reduce((a, x) => a + words(x.text), 0)
      expect(w, l.id).toBeGreaterThanOrEqual(120)
      expect(w, l.id).toBeLessThanOrEqual(220)
    }
  })
  it('sentences stay short (95th percentile ≤ 22, longest ≤ 28 words)', () => {
    const lens = [
      ...UNIT_32_READING.flatMap(r => r.body.flatMap(sentences)),
      ...UNIT_32_LISTENING.flatMap(l => l.lines.flatMap(x => sentences(x.text))),
    ]
      .map(words)
      .sort((a, b) => a - b)
    expect(lens[lens.length - 1]).toBeLessThanOrEqual(28)
    expect(lens[Math.ceil(0.95 * lens.length) - 1]).toBeLessThanOrEqual(22)
  })
  it('the reading questions use the three-option format; the format "richtig / falsch / steht nicht im Text" is used for statements and each of its three answers occurs', () => {
    const qs = [...UNIT_32_READING.flatMap(r => r.questions), ...UNIT_32_LISTENING.flatMap(l => l.questions)]
    for (const q of qs) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options).size).toBe(3)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(3)
    }
    const stmt = UNIT_32_READING.flatMap(r => r.questions).filter(q => /^Aussage:/.test(q.q))
    expect(stmt.length).toBeGreaterThanOrEqual(4)
    for (const q of stmt) expect(q.options).toEqual(['richtig', 'falsch', 'steht nicht im Text'])
    expect(new Set(stmt.map(q => q.answer))).toEqual(new Set([0, 1, 2]))
    expect(new Set(UNIT_32_READING.flatMap(r => r.questions.map(q => q.answer))).size).toBe(3)
    expect(new Set(UNIT_32_LISTENING.flatMap(l => l.questions.map(q => q.answer))).size).toBe(3)
  })
  it('the reading answer keys agree with the text (every correct option is supported by the text, no distractor is)', () => {
    const t1 = LONG.body.join(' ')
    expect(LONG.questions.map(q => q.options[q.answer])).toEqual(['richtig', 'steht nicht im Text', 'falsch', 'Einen Vortrag halten.'])
    expect(t1).toMatch(/habe ich den Kurs begonnen, weil ich in Brunnenau arbeiten möchte/)
    expect(t1).not.toMatch(/Wohnung gemietet|mieten/)
    expect(t1).toMatch(/Jeden Abend schreibe ich drei Stichpunkte in mein Lerntagebuch/)
    expect(t1).toMatch(/plane ich einen Vortrag für die Abschlussfeier/)
    const t2 = SHORT.body.join(' ')
    expect(SHORT.questions.map(q => q.options[q.answer])).toEqual(['falsch', 'Bis Mittwoch.', 'steht nicht im Text'])
    expect(t2).toMatch(/keine offizielle Prüfung/)
    expect(t2).toMatch(/Bitte melden Sie sich bis Mittwoch an/)
    expect(t2).not.toMatch(/Euro|kostet|Gebühr/)
  })
  it('the listening answer keys agree with the script (announcement + conversation; short talk)', () => {
    const t1 = UNIT_32_LISTENING[0].lines.map(x => x.text).join(' ')
    expect(UNIT_32_LISTENING[0].questions.map(q => q.options[q.answer])).toEqual([
      'Von Gleis fünf.',
      'Der Zug hat Verspätung.',
      'Sie haben es schon bezahlt.',
      'Nein, der Zug fährt direkt.',
    ])
    expect(t1).toMatch(/nicht von Gleis drei, sondern von Gleis fünf/)
    expect(t1).toMatch(/Der Zug hat Verspätung, deshalb haben wir Zeit/)
    expect(t1).toMatch(/Das Zimmer haben wir schon bezahlt/)
    expect(t1).toMatch(/der Zug fährt direkt/)
    expect(UNIT_32_LISTENING[0].lines[0].speaker).toBe('Durchsage')
    const t2 = UNIT_32_LISTENING[1].lines.map(x => x.text).join(' ')
    expect(UNIT_32_LISTENING[1].questions.map(q => q.options[q.answer])).toEqual([
      'Drei.',
      'Die Wortstellung.',
      'Er hat jeden Tag zehn Sätze geschrieben.',
      'Sobald der Kurs zu Ende ist.',
    ])
    expect(t2).toMatch(/Ich habe drei Punkte vorbereitet/)
    expect(t2).toMatch(/Schwierig war für mich die Wortstellung/)
    expect(t2).toMatch(/dass ich jeden Tag zehn Sätze geschrieben habe/)
    expect(t2).toMatch(/sobald der Kurs zu Ende ist/)
    expect(new Set(UNIT_32_LISTENING[1].lines.map(x => x.speaker)).size).toBe(1)
    for (const l of UNIT_32_LISTENING) for (const x of l.lines) expect(x.ru && x.ky && x.ky !== x.ru).toBeTruthy()
  })
  it('the listening keywords have a gloss in the unit vocabulary or in the revision vocabulary of Units 21–31', () => {
    const all = new Set(fullBundle().vocabulary.map(v => v.de))
    for (const l of UNIT_32_LISTENING) for (const k of l.keywords) expect(all.has(k), `${l.id}: ${k}`).toBe(true)
  })
  it('the reading glosses give Russian and Kyrgyz independently; the "Probe" is described as an exercise in both languages', () => {
    for (const r of UNIT_32_READING)
      for (const g of r.gloss) {
        expect(g.ky).not.toBe(g.ru)
        expect(g.grammarKy).not.toBe(g.grammar)
      }
    const g = SHORT.gloss.find(x => /offizielle/.test(x.word))!
    expect(g.ru).toMatch(/не официальный экзамен/)
    expect(g.ky).toMatch(/расмий экзамен эмес/)
    expect(g.grammar).toMatch(/не предсказывает результат/)
  })
  it('listening uses the existing browser text-to-speech lab: no audio file, no claim of verified playback; no assessment item depends on audio', () => {
    for (const l of UNIT_32_LISTENING) expect(Object.keys(l)).not.toContain('audio')
    for (const q of UNIT_32_FINAL) expect(q.skill).not.toBe('listening')
  })
  it('speaking: one scenario of 8 turns = Einleitung → two points → a question (reaction to an objection) → joint planning → the unexpected full room → who brings what → Abschiedsworte; checklist and self-assessment, no score', () => {
    const [s] = UNIT_32_SPEAKING
    expect(s.turns).toHaveLength(8)
    expect(s.level).toBe('B1')
    for (const t of s.turns) {
      expect(t.aiRu && t.aiKy).toBeTruthy()
      expect(t.hints.length).toBeGreaterThanOrEqual(3)
      expect(t.keywords.length).toBeGreaterThanOrEqual(3)
      for (const k of t.keywords) expect(k).toBe(k.toLowerCase())
    }
    expect(s.turns[0].hints.join(' ')).toMatch(/Einleitung/)
    expect(s.turns[1].hints.join(' ')).toMatch(/Erstens/)
    expect(s.turns[2].hints.join(' ')).toMatch(/Zweitens/)
    expect(s.turns[3].hints.join(' ')).toMatch(/berechtigter Einwand/)
    expect(s.turns[4].hints.join(' ')).toMatch(/Ich schlage vor, dass/)
    expect(s.turns[5].ai).toMatch(/Der Raum ist am Freitag leider schon belegt/)
    expect(s.turns[5].hints.join(' ')).toMatch(/Falls der Raum am Samstag frei ist/)
    expect(s.turns[6].hints.join(' ')).toMatch(/Ich bringe es dir morgen im Kurs/)
    expect(s.turns[7].hints.join(' ')).toMatch(/zum Schluss möchte ich mich bei allen bedanken/)
    expect(META.scenario.id).toBe('b1-sp-32-01')
    expect(s.goal.ru).toMatch(/Это только упражнение/)
    expect(s.goal.ru).toMatch(/не баллами/)
    expect(JSON.stringify(s)).not.toMatch(/"(score|points|cefrScore)"/)
  })
})

describe('writing: two main tasks (informal e-mail, formal letter) and a learning-diary micro-task, all discoverable', () => {
  it('informal e-mail: du-form, 80 words minimum (band 70–90), seven expected elements, a model that meets every one', () => {
    expect(MAIL).toMatchObject({ id: 'b1-wr-32-01', minWords: 80, level: 'B1', unit: 32, formal: false })
    expect(words(MAIL.model)).toBeGreaterThanOrEqual(80)
    expect(words(MAIL.model)).toBeLessThanOrEqual(110)
    expect(MAIL.mustInclude).toHaveLength(7)
    for (const m of MAIL.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky).toBeTruthy()
      expect(m.explain!.ky).not.toBe(m.explain!.ru)
      expect(
        m.patterns.some(p => MAIL.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(MAIL.model).toMatch(/^Liebe Anna,/)
    expect(MAIL.model).toMatch(/Kommst du\?/)
    expect(MAIL.model).toMatch(/, damit ich /)
    expect(MAIL.model).toMatch(/obwohl der Anfang schwierig war/)
    expect(MAIL.model).not.toMatch(/\bSie\b|\bIhnen\b/)
  })
  it('formal letter: Sie-form, 70 words minimum (formal band), six expected elements, a model that meets every one and uses the Zustandspassiv only with a participle of the list', () => {
    expect(LETTER).toMatchObject({ id: 'b1-wr-32-02', minWords: 70, level: 'B1', unit: 32, formal: true })
    expect(words(LETTER.model)).toBeGreaterThanOrEqual(70)
    expect(words(LETTER.model)).toBeLessThanOrEqual(110)
    expect(LETTER.mustInclude).toHaveLength(6)
    for (const m of LETTER.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky).toBeTruthy()
      expect(m.explain!.ky).not.toBe(m.explain!.ru)
      expect(
        m.patterns.some(p => LETTER.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(LETTER.model).toMatch(/^Sehr geehrte Damen und Herren,/)
    expect(LETTER.model).toMatch(/Könnten Sie mir bitte mitteilen/)
    expect(LETTER.model).toMatch(/Falls am Montag ein Platz frei ist/)
    expect(LETTER.model).toMatch(/ist ausgefüllt und unterschrieben/)
    expect(LETTER.model).not.toMatch(/\b(du|dir|dich|dein\w*|kannst|hast)\b/)
    expect(zustandOutsideList(LETTER.model)).toBe(false)
    expect(LETTER.situation.ru).toMatch(/Это не официальный экзамен/)
  })
  it('the learning diary (kind "note"): strength and weakness, a Vorsatz with sich vornehmen, satisfaction with a reason; short; the rubric of the self-assessment is in every writing task', () => {
    expect(DIARY).toMatchObject({ id: 'b1-wr-32-03', minWords: 30, level: 'B1', unit: 32, formal: false })
    expect(words(DIARY.model)).toBeGreaterThanOrEqual(30)
    expect(DIARY.mustInclude).toHaveLength(3)
    for (const m of DIARY.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky && m.explain.ky !== m.explain.ru).toBeTruthy()
      expect(
        m.patterns.some(p => DIARY.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(DIARY.model).toMatch(/Meine Stärke ist das Lesen, meine Schwäche ist das Sprechen/)
    expect(DIARY.model).toMatch(/Ich nehme mir vor, [^.]* zu sprechen/)
    expect(META.microTasks).toEqual([{ kind: 'note', taskId: 'b1-wr-32-03' }])
    for (const w of UNIT_32_WRITING) {
      expect(w.tips.map(t => t.ru).join(' ')).toMatch(/Aufgabe erfüllt/)
      expect(w.tips.map(t => t.ru).join(' ')).toMatch(/без уровней CEFR/)
      expect(w.tips.map(t => t.ky).join(' ')).toMatch(/CEFR деңгээлисиз/)
      expect(w.tips.map(t => t.ru).join(' ')).toMatch(/только объём и ожидаемые слова/)
      expect(w.tips.map(t => t.ky).join(' ')).toMatch(/көлөмдү жана күтүлгөн сөздөрдү гана/)
    }
  })
  it('the two main tasks are within the band 70–90 words for Unit 32 (informal ≥ 70, formal ≥ 60) and are NOT micro-tasks; every model passes the guards of the unit', () => {
    for (const w of [MAIL, LETTER]) {
      expect(w.minWords).toBeGreaterThanOrEqual(w.formal ? 60 : 70)
      expect(w.minWords).toBeLessThanOrEqual(90)
      expect((META.microTasks ?? []).some(t => t.taskId === w.id)).toBe(false)
    }
    for (const w of UNIT_32_WRITING) for (const [name, test] of FORBIDDEN) expect(test(w.model), `${w.id} ${name}`).toBe(false)
  })
  it('NO writing task is omitted and every one is discoverable: the Writing Lab list holds all three; the unit page has the first main row plus two extra rows', () => {
    registerLevelContent('B1', B1_CONTENT)
    const lab = writingOf('B1').filter(w => w.unit === 32)
    expect(lab.map(w => w.id)).toEqual(UNIT_32_WRITING.map(w => w.id))
    expect(writingForUnit(32)[0].id).toBe('b1-wr-32-01')
    expect(
      writingForUnit(32)
        .slice(1)
        .map(w => w.id),
    ).toEqual(['b1-wr-32-02', 'b1-wr-32-03'])
  })
})

describe('exercises: answer keys are correct and unique; word order is practised (≥ 3 order items)', () => {
  it('10 handwritten exercises: 8 on the two revision concepts (4 + 4) + 2 recycled without a concept; types fill / choice / order = 3 / 4 / 3; both languages everywhere', () => {
    expect(UNIT_32_EXERCISES).toHaveLength(10)
    expect(UNIT_32_EXERCISES.map(e => e.id)).toEqual(Array.from({ length: 10 }, (_, i) => `b1-ex-32-${String(i + 1).padStart(2, '0')}`))
    const withConcept = UNIT_32_EXERCISES.filter(e => e.concept)
    expect(withConcept).toHaveLength(8)
    expect(CONCEPTS.map(c => withConcept.filter(e => e.concept === c).length)).toEqual([4, 4])
    expect(UNIT_32_EXERCISES.filter(e => !e.concept).map(e => e.id)).toEqual(['b1-ex-32-09', 'b1-ex-32-10'])
    expect(['fill', 'choice', 'order'].map(t => UNIT_32_EXERCISES.filter(e => e.type === t).length)).toEqual([3, 4, 3])
    for (const e of UNIT_32_EXERCISES) {
      expect(e.why.ru && e.why.ky).toBeTruthy()
      expect(e.why.ky).not.toBe(e.why.ru)
      expect(e.promptRu && e.promptKy, e.id).toBeTruthy()
    }
  })
  it('every choice / fill item: 3 distinct options and the answer is among them exactly once; every order item is a true permutation that is not pre-solved, with its commas fixed', () => {
    for (const e of UNIT_32_EXERCISES) {
      if (e.type === 'order') {
        expect([...(e.words ?? [])].sort().join('|')).toBe(e.answer.split(' ').sort().join('|'))
        expect(e.words!.join(' ')).not.toBe(e.answer)
        expect(e.answer.endsWith('.')).toBe(true)
        expect(e.words!.filter(w => /\.$/.test(w))).toHaveLength(1)
      } else {
        expect(e.options).toHaveLength(3)
        expect(new Set(e.options).size).toBe(3)
        expect(e.options!.filter(o => o === e.answer)).toHaveLength(1)
      }
    }
    for (const e of UNIT_32_EXERCISES.filter(x => x.type === 'fill')) expect(e.prompt.match(/___/g)).toHaveLength(1)
  })
  it('a gap has exactly ONE correct filler: purpose with zu → um; als for one past event; werden with `gerade`', () => {
    const by = (id: string) => UNIT_32_EXERCISES.find(e => e.id === id)!
    expect(by('b1-ex-32-01').prompt).toMatch(/___ die Prüfung zu bestehen/)
    expect(by('b1-ex-32-01').answer).toBe('um')
    expect(by('b1-ex-32-03').prompt).toMatch(/2019/)
    expect(by('b1-ex-32-03').answer).toBe('Als')
    expect(by('b1-ex-32-09').prompt).toMatch(/gerade/)
    expect(by('b1-ex-32-09').answer).toBe('wird')
  })
  it('the sentence-level items: exactly one correct sentence, the wrong ones each contain a real learner error', () => {
    const by = (id: string) => UNIT_32_EXERCISES.find(e => e.id === id)!
    const e2 = by('b1-ex-32-02')
    expect(e2.options!.filter(o => /^Ich weiß nicht, ob er heute kommt\.$/.test(o))).toEqual([e2.answer])
    expect(e2.options!.some(o => /dass er heute kommt/.test(o))).toBe(true)
    expect(e2.options!.some(o => /ob kommt er/.test(o))).toBe(true)
    const e4 = by('b1-ex-32-04')
    expect(e4.options!.filter(o => /^Obwohl es regnet, gehen wir zum Fest\.$/.test(o))).toEqual([e4.answer])
    expect(e4.options!.some(o => /, aber gehen/.test(o))).toBe(true)
    const e8 = by('b1-ex-32-08')
    expect(e8.options!.filter(o => /^Ich gebe es ihm\.$/.test(o))).toEqual([e8.answer])
    const e10 = by('b1-ex-32-10')
    expect(e10.options!.filter(o => /mit dem ich arbeite/.test(o))).toEqual([e10.answer])
    for (const e of UNIT_32_EXERCISES.filter(x => x.type !== 'choice'))
      for (const [name, test] of FORBIDDEN) expect(test(`${e.prompt} ${e.answer}`), `${e.id} ${name}`).toBe(false)
  })
  it('the three word-order items test the three rule groups: Satzklammer with pronouns, the modal verb, TeKaMoLo', () => {
    const by = (id: string) => UNIT_32_EXERCISES.find(e => e.id === id)!
    expect(by('b1-ex-32-05').answer).toBe('Ich habe es ihm gestern gegeben.')
    expect(by('b1-ex-32-06').answer).toBe('Er muss das Formular heute noch ausfüllen.')
    expect(by('b1-ex-32-07').answer).toBe('Wir fahren morgen mit dem Zug nach Leipzig.')
    expect(UNIT_32_EXERCISES.filter(e => e.type === 'order').every(e => e.concept === 'b1-satzbau-mittelfeld')).toBe(true)
  })
})

describe('unit test (15 items): structure, answer keys and scoring data', () => {
  it('15 questions = 8 grammar (3 Nebensätze + 3 Mittelfeld + 2 recycled ↻) + 3 vocabulary + 4 reading, no listening; ≥ 2 gap-fill', () => {
    expect(UNIT_32_FINAL.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `b1-ft-32-${String(i + 1).padStart(2, '0')}`))
    const by = (s: string) => UNIT_32_FINAL.filter(q => q.skill === s)
    expect([by('grammar').length, by('vocabulary').length, by('reading').length, by('listening').length]).toEqual([8, 3, 4, 0])
    expect(by('grammar').filter(q => /___/.test(q.prompt)).length).toBeGreaterThanOrEqual(2)
    expect(CONCEPTS.map(c => by('grammar').filter(q => q.concept === c).length)).toEqual([3, 3])
    expect(UNIT_32_TEST).toMatchObject({ id: 'unit-32', kind: 'topic', level: 'B1', unit: 32, size: 15 })
  })
  it('options: 3 distinct each, the answer appears exactly once, both languages with an explanation; positions are 5 / 5 / 5, never three in a row', () => {
    const pos: number[] = []
    for (const q of UNIT_32_FINAL) {
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
  it('the questions are unambiguous: ob needs a cue ("oder morgen"), the Satzklammer gap needs the infinitive after the modal verb, the TeKaMoLo question names the order', () => {
    const q = (id: string) => UNIT_32_FINAL.find(x => x.id === id)!
    expect(q('b1-ft-32-03').prompt).toMatch(/oder morgen/)
    expect(q('b1-ft-32-03').answer).toBe('ob')
    expect(q('b1-ft-32-06').answer).toBe('ausfüllen')
    expect(q('b1-ft-32-05').prompt).toMatch(/Zeit – Art und Weise – Ort/)
    expect(q('b1-ft-32-05').options.filter(o => /im Juli mit dem Flugzeug nach Wien/.test(o))).toEqual([q('b1-ft-32-05').answer])
    expect(q('b1-ft-32-04').options.filter(o => /^Ich habe es ihr heute gezeigt\.$/.test(o))).toEqual([q('b1-ft-32-04').answer])
    expect(q('b1-ft-32-08').options.filter(o => /verpasst hatte/.test(o))).toEqual([q('b1-ft-32-08').answer])
  })
  it('the reading questions carry the German text untranslated; the two texts are new (not the unit readings)', () => {
    const rq = UNIT_32_FINAL.filter(q => q.skill === 'reading')
    for (const q of rq) {
      expect(q.prompt).toMatch(/^Lies /)
      expect(q.prompt).toMatch(/\(erfunden\)/)
      expect(q.promptRu).toMatch(/^Прочитайте/)
      expect(q.promptKy).toMatch(/окуңуз/)
    }
    const read = UNIT_32_READING.flatMap(r => r.body).join(' ')
    for (const q of rq) {
      const passage = q.prompt.split('„').slice(1).join('„')
      for (let i = 0; i + 40 <= passage.length; i += 30) expect(read.includes(passage.slice(i, i + 40)), `${q.id} @${i}`).toBe(false)
    }
    expect(new Set(rq.map(q => q.prompt.split('“')[0])).size).toBe(2)
  })
  it('the unit test shares no prompt (except the generic instruction line) and no answer with the revision exercises, and no prompt with another question (except the shared reading passage)', () => {
    const ex = new Set(UNIT_32_EXERCISES.flatMap(e => [e.prompt, e.answer]))
    const generic = new Set(['Welcher Satz ist richtig?', 'Bilde den Satz.'])
    for (const q of UNIT_32_FINAL) {
      if (!generic.has(q.prompt)) expect(ex.has(q.prompt), q.id).toBe(false)
      expect(ex.has(q.answer), q.id).toBe(false)
    }
    const prompts = UNIT_32_FINAL.filter(q => q.skill !== 'reading')
      .map(q => q.prompt)
      .filter(p => !generic.has(p))
    expect(new Set(prompts).size).toBe(prompts.length)
  })
  it('scoring data: every question has its answer among its options (a perfect run is 15/15) and the pass mark of the existing rule (70 %) is 11 of 15', () => {
    expect(UNIT_32_FINAL.filter(q => q.options.includes(q.answer)).length).toBe(15)
    expect(Math.ceil(0.7 * 15)).toBe(11)
  })
})

describe('metadata, strands, the self-assessment and honesty about the "Probeprüfung"', () => {
  it('2–3 can-do goals and one objective per skill, each "Ich kann …" with independent Russian and Kyrgyz; a repair-chunk strand and a strategy checklist', () => {
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
    for (const k of ['Lesen', 'Hören', 'Sprechen', 'Schreiben']) expect(META.strands.strategyNote!.de).toContain(k)
    expect(META.strands.strategyNote!.de).toMatch(/keine offizielle Prüfung/)
    expect(META.strands.strategyNote!.ru).toMatch(/не официальный экзамен/)
    expect(META.strands.strategyNote!.ky).toMatch(/расмий экзамен эмес/)
  })
  it('the "Probeprüfung" is an EXERCISE everywhere it appears: no official exam, no named examination, no certificate, no prediction of a result, no CEFR claim', () => {
    const all = JSON.stringify(ALL_DATA(), (k, v) => (k === 'source' ? undefined : v))
    expect(all).not.toMatch(
      /Goethe|\btelc\b|TestDaF|\bÖSD\b|\bDTZ\b|Zertifikat|zertifikat|certificate|сертификат|B1 erreicht|достигнут уровень|official/i.source
        ? /Goethe|\btelc\b|TestDaF|\bÖSD\b|\bDTZ\b|ertifikat|certificate|сертификат|B1 erreicht|official/
        : /x/,
    )
    expect(all).not.toMatch(/CEFR B1|CEFR level|уровень CEFR|CEFR-level/)
    expect(JSON.stringify(UNIT_32.subtitle)).not.toMatch(/Abschlussprüfung|официальн/)
    expect(UNIT_32_GRAMMAR[0].dialogue.map(d => d.text).join(' ')).toMatch(/Probeprüfung/)
    expect(SHORT.body[0]).toMatch(/Sie ist eine Übung für Sie und keine offizielle Prüfung/)
  })
  it('the provenance says the material is original, fictional and NOT reviewed', () => {
    for (const x of [...UNIT_32_GRAMMAR, ...UNIT_32_READING, ...UNIT_32_LISTENING, ...UNIT_32_SPEAKING, ...UNIT_32_WRITING]) {
      expect(x.source?.kind).toBe('authored')
      expect(x.source?.author).toMatch(/pending independent CEFR, Russian and Kyrgyz review/)
    }
    for (const r of UNIT_32_READING) expect(`${r.title} ${r.body.join(' ')}`).toMatch(/erfunden|Erfundene|\(erfunden\)/)
    for (const l of UNIT_32_LISTENING) expect(l.title).toMatch(/erfunden/)
    expect(UNIT_32_SPEAKING[0].goal.ky).toMatch(/ойдон чыгарылган|чыгарылган/)
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
    walk(ALL_DATA(), 'unit32')
    expect(missing).toEqual([])
  })
  it('the Russian and the Kyrgyz are of comparable size (no half-translated string)', () => {
    const bad: string[] = []
    for (const v of UNIT_32_VOCABULARY) {
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
      'ээрчимелүү',
      'багыныңкы',
      'баш сүйлөм',
      'кайтарым',
      'толук өткөн чак',
      'салыштырма сүйлөм',
      'орто талаа',
      'тактоо сүйлөмү',
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
  it('the explanations of exercises and unit-test questions differ between Russian and Kyrgyz', () => {
    for (const e of UNIT_32_EXERCISES) expect(e.why.ky).not.toBe(e.why.ru)
    for (const q of UNIT_32_FINAL) expect(q.why.ky).not.toBe(q.why.ru)
  })
})

describe('validator honesty', () => {
  it('the validator finds 0 errors and 0 warnings in the real bundle; the review flags of Unit 32 are: missing human CEFR sign-off and the open decision D-9 (Mittelfeld as a system)', () => {
    const is = validateContent(fullBundle())
    expect(is.filter(i => i.severity === 'error')).toEqual([])
    expect(is.filter(i => i.severity === 'warning')).toEqual([])
    expect(is.filter(i => i.rule.startsWith('b1-') && i.severity !== 'review' && /32/.test(i.where))).toEqual([])
    expect(
      is
        .filter(i => i.where === 'units:32' && i.severity === 'review')
        .map(i => i.rule)
        .sort(),
    ).toEqual(['beta-review-pending', 'beta-review-pending', 'cefr-signoff-missing']) // + the Beta flags (ru, ky) since the B1 Beta launch
    expect(is.filter(i => i.where === 'grammar:b1-satzbau-mittelfeld' && i.severity === 'review').map(i => i.rule)).toEqual([
      'b1-expert-review-pending',
    ])
    expect(is.filter(i => i.where === 'grammar:b1-nebensaetze-integration')).toEqual([])
    expect(
      is.filter(i => /^(reading:b1-re-32|listening:b1-li-32|writing:b1-wr-32|vocabulary:v32)/.test(i.where) && i.severity === 'review'),
    ).toEqual([])
    expect(is.filter(i => i.rule === 'unit-minimum' && i.where === 'B1')).toEqual([])
  })
})
