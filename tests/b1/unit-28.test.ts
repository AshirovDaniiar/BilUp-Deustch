// @vitest-environment node
/**
 * B1 Unit 28 — Bildung, Lernen und Zukunftspläne (Stage 3J). Checks the authored content against the approved curriculum: identity, the three approved concepts
 * (Futur I for forecasts and conjecture with wohl on a closed list; falls / sobald / solange; verb + preposition on a closed list of 20 pairs with wo(r)- / da(r)-),
 * vocabulary (38–42, nothing already taught), text sizes, the receptive `sodass`, the scope guard for later units — with REGRESSION samples proving that genuine
 * out-of-scope German is still detected — education-content safety (everything fictional, no claim about a real system), RU/KY parity, exercise / answer-key
 * correctness, assessment structure, metadata, the THREE micro-tasks and their discoverability, topic evidence, spaced revision and the Wiederholungsblock.
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
import { UNIT_28_EXERCISES, UNIT_28_FINAL, UNIT_28_TEST } from '../../src/data/b1/unit28/assessment'
import { UNIT_28_GRAMMAR, UNIT_28_WHY_NOTES } from '../../src/data/b1/unit28/grammar'
import { UNIT_28_LISTENING, UNIT_28_READING, UNIT_28_SPEAKING, UNIT_28_WRITING } from '../../src/data/b1/unit28/texts'
import { UNIT_28 } from '../../src/data/b1/unit28/unit'
import { UNIT_28_VOCABULARY } from '../../src/data/b1/unit28/vocabulary'
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
const CONCEPTS = ['b1-futur1-vermutungen', 'b1-falls-sobald-solange', 'b1-verben-praepositionen']
const META = B1_META.find(m => m.unit === 28)!
const [MAIN, MICRO_O, MICRO_M, MICRO_N] = UNIT_28_WRITING
const FUTUR_LIST = ['sein', 'haben', 'kommen', 'gehen', 'schaffen', 'bestehen', 'lernen', 'studieren', 'arbeiten', 'geben']

function germanTexts(): string[] {
  const out: string[] = []
  for (const r of UNIT_28_READING) out.push(...r.body, ...r.questions.flatMap(q => [q.q, ...q.options]))
  for (const l of UNIT_28_LISTENING) out.push(...l.lines.map(x => x.text), ...l.questions.flatMap(q => [q.q, ...q.options]))
  for (const v of UNIT_28_VOCABULARY) out.push(v.example)
  for (const g of UNIT_28_GRAMMAR)
    out.push(...g.examples.map(x => x.de), ...g.reallife.map(x => x.de), ...g.dialogue.map(x => x.text), g.speakPrompt.sample)
  for (const n of UNIT_28_WHY_NOTES) out.push(n.sentence, ...n.more.map(x => x.de))
  // prompts and answers only: the distractor options of a choice item are deliberately wrong forms and are never taught
  for (const e of UNIT_28_EXERCISES) out.push(e.prompt, e.answer)
  for (const q of UNIT_28_FINAL) out.push(q.prompt, q.answer)
  for (const w of UNIT_28_WRITING) out.push(w.model, w.mustInclude.map(m => m.label).join(' '))
  for (const s of UNIT_28_SPEAKING) out.push(...s.turns.flatMap(t => [t.ai, ...t.hints]))
  return out
}
const MISTAKES = new Set(UNIT_28_GRAMMAR.flatMap(g => g.mistakes.flatMap(m => [m.wrong, m.right])))
const taught = () => germanTexts().filter(t => !MISTAKES.has(t))

const ALL_DATA = () => [
  UNIT_28,
  UNIT_28_GRAMMAR,
  UNIT_28_WHY_NOTES,
  UNIT_28_READING,
  UNIT_28_LISTENING,
  UNIT_28_SPEAKING,
  UNIT_28_WRITING,
  UNIT_28_EXERCISES,
  UNIT_28_FINAL,
  UNIT_28_VOCABULARY,
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

const NOT_NOUN = /^(Bei|In|Auf|Mit|Von|Zu|Nach|Aus|Für|An|Vor|Über|Unter|Seit|Ab|Bis|Um|Durch|Gegen|Im|Am|Vom|Zum|Zur)$/
const FUNCTION_WORD =
  /^(Die|Der|Das|Den|Dem|Ein|Eine|Und|Aber|Oder|Denn|Dass|Ob|Als|Wie|Wo|Wann|Warum|Was|Wer|Ja|Nein|Gern|Auch|Nur|Noch|Schon|Leider|Danke|Bitte|Hier|Dort|Heute|Morgen|Jetzt|Ich|Er|Sie|Wir|Man|Es|Ihr|Du|Dann|Wenn|Weil|Frau|Herr|Dr|Falls|Sobald|Solange)$/
/** a capitalised word followed by des / eines / der / einer + noun is a Genitiv attribute (Unit 29), unless the first word is an article, a preposition or another function word */
const genitivAttribute = (t: string) => {
  for (const m of t.matchAll(/\b([A-ZÄÖÜ][a-zäöüß]+)\s+(des|eines|der|einer)\s+(?:\w+en\s+)?([A-ZÄÖÜ][a-zäöüß]+)/g))
    if (!NOT_NOUN.test(m[1]) && !FUNCTION_WORD.test(m[1])) return true
  return false
}
/** Futur I with an infinitive that is NOT on the closed list: in the clause segment after werd-form (up to the next comma / full stop) the last word looks like an infinitive and is not one of the ten */
const futurOutsideList = (t: string) =>
  sentences(t).some(sn =>
    [...sn.matchAll(/\b(?:werde|wirst|wird|werden|werdet)\b([^.!?,;:]*)/g)].some(m => {
      const last = (m[1].trim().split(/\s+/).pop() ?? '').toLowerCase()
      if (!last || !/(en|ln|rn)$/.test(last) || /^ge/.test(last)) return false
      return !FUTUR_LIST.includes(last)
    }),
  )

const FORBIDDEN: [string, (t: string) => boolean][] = [
  ['damit (Unit 30)', t => /\bdamit\b/i.test(t)],
  ['Passiv Perfekt (receptive in Unit 24 only)', t => /\bworden\b/i.test(t)],
  [
    'Futur II (B2)',
    t => /\b(wird|werde|werden|wirst)\b[^.!?]*\b(ge\w+(t|en)|\w+iert|bestanden|verstanden|begonnen|erreicht)\s+(haben|sein)\b/i.test(t),
  ],
  [
    'Plusquamperfekt / nachdem (Unit 29)',
    t => /\bnachdem\b/i.test(t) || /\b(hatte|hatten)\s+(?:\w+\s+){0,4}?ge\w+(t|en)\b(?![^.!?]*,)/.test(t),
  ],
  ['Konjunktiv I / indirect speech in the subjunctive (B2)', t => /\b(er|sie|es|man)\s+sei\b|\bheiße es\b|\bgebe es\b|\bseien\b/i.test(t)],
  ['Genitiv attribute (Unit 29)', genitivAttribute],
  [
    'relative clause with a preposition (Unit 29)',
    t => /,\s*(an|auf|in|mit|von|für|bei|aus|über|nach|vor)\s+(dem|der|den|denen|dessen|deren)\s(?![^.!?]*\bzu \w+)/.test(t),
  ],
  ['Dativ / Genitiv relative pronoun (Unit 29)', t => /,\s*(dem|denen|dessen|deren)\s/.test(t)],
  [
    'verb + preposition pairs OUTSIDE the closed list of 20',
    t =>
      /\b(sich konzentrieren auf|verzichten auf|sich beschweren über|sich verlieben in|sich gewöhnen an|sich verabschieden von|sich bedanken für|diskutieren über|berichten über|sich sorgen um|fragen nach|bitten um|einladen zu|leiden unter|Angst vor|sich unterhalten über|sich streiten über|arbeiten an|glauben an|sich beteiligen an|danken für|lachen über|reden über|sich entschuldigen für|schreiben an)\b|\b(konzentriere|konzentriert) \w+ auf\b|\b(beschwere|beschwert) \w+ über\b|\b(bedanke|bedankt) \w+ für\b|\b(verzichte|verzichtet) auf\b|\b(glaube|glaubt) an\b|\b(rede|redet) über\b/i.test(
        t,
      ),
  ],
  ['sodass / so dass (receptive; productive only in Unit 30)', t => /\bsodass\b|\bso dass\b/i.test(t)],
  [
    'receptive constructions of Units 22–23 (ohne … zu, einerseits)',
    t => /\bohne\b|einerseits|andererseits|nicht nur|sondern auch/i.test(t),
  ],
  [
    'Konjunktiv II of the past (receptive, Unit 31)',
    t => /\b(hätte|hätten|hättest|wäre|wären)\b[^.!?,]*\b(ge\w+(t|en)|\w+iert)\s*[.!?,]/i.test(t),
  ],
  ['Futur I outside the closed list of ten infinitives', futurOutsideList],
  [
    'real institutions, exams or programmes (the unit describes no real education system)',
    t =>
      /Erasmus|DAAD|BAföG|TestDaF|\btelc\b|\bDSH\b|Goethe-Institut|Harvard|Oxford|Cambridge|Humboldt|Volkshochschule|\bIHK\b|Zertifikat|In Deutschland|in Deutschland|In Österreich|in der Schweiz/.test(
        t,
      ),
  ],
]

describe('identity and integration (B1 is a Beta for ru and ky)', () => {
  it('the unit equals its approved plan entry', () => {
    const plan = B1_UNIT_PLAN.find(p => p.id === 28)!
    expect(UNIT_28).toMatchObject({ id: 28, key: plan.key, title: plan.titleDe, level: 'B1' })
    expect(plan.key).toBe('b1-bildung-zukunft')
    expect(plan.titleDe).toBe('Bildung, Lernen und Zukunftspläne')
    expect(UNIT_28.grammarIds).toEqual(CONCEPTS)
  })
  it('the content module holds Unit 28 after Units 21–27, wired into the metadata, the tests, the final tests and the speaking list', () => {
    expect(B1_CONTENT.legacyUnits.map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_META.map(m => m.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.tests).toContainEqual(UNIT_28_TEST)
    expect(B1_CONTENT.unitSpeaking.slice(0, 8).at(-1)).toBe('b1-sp-28-01')
    expect(B1_CONTENT.finalTests.map(f => f.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
  })
  it('B1 is a Beta: released for ru and ky only, offered to those interfaces and never to the German one', () => {
    expect(courseLevel('B1')).toMatchObject({ status: 'beta', releasedLocales: ['ru', 'ky'] })
    for (const lang of ['ru', 'ky'] as const) expect(availableLevels(lang)).toContain('B1')
    expect(availableLevels('de')).not.toContain('B1')
  })
  it('registered in the catalog, the unit is reachable through the standard selectors; the main writing task comes first; the Writing Lab holds all four', () => {
    registerLevelContent('B1', B1_CONTENT)
    expect(vocabularyForUnit(28)).toHaveLength(40)
    expect(grammarForUnit(28).map(g => g.id)).toEqual(CONCEPTS)
    expect(finalTestOfUnit(28)?.questions).toHaveLength(15)
    expect(topicTestOfUnit(28)).toMatchObject({ id: 'unit-28', level: 'B1', size: 15 })
    expect(speakingForUnit(28)).toBe('b1-sp-28-01')
    const ids = ['b1-wr-28-01', 'b1-wr-28-02', 'b1-wr-28-03', 'b1-wr-28-04']
    expect(writingForUnit(28).map(w => w.id)).toEqual(ids)
    const lab = writingOf('B1').map(w => w.id)
    for (const id of ids) expect(lab).toContain(id)
  })
})

describe('grammar: only the three approved concepts', () => {
  it('exactly the approved ids, in order, owned by Unit 28, level B1', () => {
    expect(UNIT_28_GRAMMAR.map(g => g.id)).toEqual(CONCEPTS)
    for (const g of UNIT_28_GRAMMAR) expect(g).toMatchObject({ unit: 28, level: 'B1' })
    expect(B1_CURRICULUM.units.find(u => u.unit === 28)!.concepts.map(c => c.id)).toEqual(CONCEPTS)
  })
  it('every concept is complete: explanation, 5 examples, mistakes, real-life, dialogue, speaking prompt — in Russian and in Kyrgyz', () => {
    for (const g of UNIT_28_GRAMMAR) {
      expect(g.examples).toHaveLength(5)
      expect(g.mistakes.length).toBeGreaterThanOrEqual(4)
      expect(g.reallife).toHaveLength(3)
      expect(g.dialogue.length).toBeGreaterThanOrEqual(4)
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
  it('the why-notes: one on Futur I, one on falls/sobald/solange, two on verb + preposition (incl. wo(r)- / da(r)-)', () => {
    expect(UNIT_28_WHY_NOTES.map(n => n.conceptId)).toEqual([CONCEPTS[0], CONCEPTS[1], CONCEPTS[2], CONCEPTS[2]])
  })
  it('the examples really show their concept', () => {
    for (const x of UNIT_28_GRAMMAR[0].examples) expect(x.de, x.de).toMatch(/\b(werde|wirst|wird|werden)\b/)
    const wohl = UNIT_28_GRAMMAR[0].examples.filter(x => /\bwohl\b/.test(x.de))
    expect(wohl.length).toBeGreaterThanOrEqual(2)
    const sub = UNIT_28_GRAMMAR[1].examples.map(x => x.de).join(' ')
    for (const c of [/Falls [^,]*, \w+ ich /, /Sobald [^,]*, \w+ ich /, /Solange [^,]*, \w+ ich /, /, sobald [^,.]* ist\./])
      expect(sub, String(c)).toMatch(c)
    const vp = UNIT_28_GRAMMAR[2].examples.map(x => x.de).join(' ')
    for (const c of [
      /\bauf die Prüfung vor\b/,
      /\bfür Medizin\b/,
      /\bnimmt an einem\b/,
      /\bvon einem Auslandsjahr\b/,
      /Worauf wartest du\? – Darauf warte ich/,
    ])
      expect(vp, String(c)).toMatch(c)
  })
  it('every "mistake" really differs from its correction, and the wrong form never appears in the taught texts', () => {
    for (const g of UNIT_28_GRAMMAR) for (const m of g.mistakes) expect(m.wrong).not.toBe(m.right)
    const wrong = UNIT_28_GRAMMAR.flatMap(g => g.mistakes.map(m => m.wrong))
    for (const t of taught()) expect(wrong.includes(t), t).toBe(false)
  })
  it('scope guard: nothing that belongs to a later unit, is receptive-only or lies outside the closed lists', () => {
    // `sodass` is receptive-only but legitimate in the ONE glossed reading (the rule is applied to every other text)
    const receptiveReading = UNIT_28_READING[0].body[1]
    for (const t0 of taught())
      for (const [name, test] of FORBIDDEN) {
        if (name.startsWith('sodass') && t0 === receptiveReading) continue
        const t = t0.replace(/Liebe[rn]? \w+, /g, '')
        expect(test(t), `${name}: "${t.slice(0, 90)}"`).toBe(false)
      }
  })
  it('REGRESSION of the scope guard: genuine out-of-scope German IS still detected, and the allowed phrases are not flagged', () => {
    const bad: [string, string][] = [
      ['damit (Unit 30)', 'Ich lerne viel, damit ich besser spreche.'],
      ['Passiv Perfekt (receptive in Unit 24 only)', 'Die Heizung ist erneuert worden.'],
      ['Futur II (B2)', 'Bis morgen wird er die Prüfung bestanden haben.'],
      ['Plusquamperfekt / nachdem (Unit 29)', 'Nachdem er gegangen war, kam sie.'],
      ['Konjunktiv I / indirect speech in the subjunctive (B2)', 'Er sagt, er sei krank.'],
      ['Genitiv attribute (Unit 29)', 'Die Qualität des Kurses ist gut.'],
      ['Genitiv attribute (Unit 29)', 'Der Beginn der Prüfung ist früh.'],
      ['relative clause with a preposition (Unit 29)', 'Das ist der Lehrer, mit dem ich gesprochen habe.'],
      ['Dativ / Genitiv relative pronoun (Unit 29)', 'Das ist der Lehrer, dem ich geholfen habe.'],
      ['verb + preposition pairs OUTSIDE the closed list of 20', 'Ich konzentriere mich auf die Prüfung.'],
      ['verb + preposition pairs OUTSIDE the closed list of 20', 'Er verzichtet auf das Stipendium.'],
      ['verb + preposition pairs OUTSIDE the closed list of 20', 'Wir diskutieren über das Studium.'],
      ['sodass / so dass (receptive; productive only in Unit 30)', 'Der Kurs ist online, sodass man überall lernen kann.'],
      ['receptive constructions of Units 22–23 (ohne … zu, einerseits)', 'Er geht, ohne sich zu verabschieden.'],
      ['Konjunktiv II of the past (receptive, Unit 31)', 'Ich wäre gestern gern ins Kino gegangen.'],
      ['Futur I outside the closed list of ten infinitives', 'Er wird wohl verschwinden.'],
      ['Futur I outside the closed list of ten infinitives', 'Wir werden morgen Pizza essen.'],
      [
        'real institutions, exams or programmes (the unit describes no real education system)',
        'Mit Erasmus kann man im Ausland studieren.',
      ],
      ['real institutions, exams or programmes (the unit describes no real education system)', 'In Deutschland ist die Schule kostenlos.'],
    ]
    for (const [name, text] of bad) expect(FORBIDDEN.find(([n]) => n === name)![1](text), `${name}: "${text}" must be detected`).toBe(true)
    const ok: string[] = [
      'Er wird wohl noch im Kurs sein.',
      'Die Betreuung am Nachmittag wird im nächsten Schuljahr ausgebaut.',
      'Falls ein Platz frei wird, rufen wir Sie an.',
      'In zehn Jahren werden viele Menschen online studieren.',
      'Ich werde die Prüfung wohl bestehen.',
      'Ich bereite mich auf die Prüfung vor.',
      'Sobald ich genug Geld hatte, bin ich nach Madrid gefahren.',
      'Bei der Anmeldung brauche ich einen Ausweis.',
      'Es wäre gut, mit dem Hausarzt zu sprechen.',
    ]
    for (const text of ok) for (const [name, test] of FORBIDDEN) expect(test(text), `${name}: "${text}" must NOT be flagged`).toBe(false)
  })
  it('Futur I is LIMITED: it appears with many of the ten infinitives, always for forecast or conjecture, never as Passiv or with another infinitive', () => {
    const futur = taught()
      .flatMap(sentences)
      .filter(x => /\b(werde|wirst|wird|werden)\b/.test(x) && FUTUR_LIST.some(v => new RegExp(`\\b${v}[.!?,]?$`).test(x.trim())))
    expect(futur.length).toBeGreaterThanOrEqual(12)
    const used = new Set(futur.map(x => FUTUR_LIST.find(v => new RegExp(`\\b${v}[.!?,]?$`).test(x.trim()))))
    for (const v of ['sein', 'geben', 'studieren', 'bestehen', 'schaffen', 'lernen', 'kommen', 'gehen', 'haben', 'arbeiten'])
      expect(used.has(v), v).toBe(true)
    expect(taught().some(x => /\bwohl\b/.test(x) && /\bwird|werde|werden\b/.test(x))).toBe(true)
    expect(META.concepts[0]).toMatchObject({ conceptId: 'b1-futur1-vermutungen', proficiency: 'P-lim', load: 'L' })
    expect(META.concepts[0].closedList).toEqual(FUTUR_LIST)
  })
  it('verb + preposition is LIMITED to the closed list of 20 pairs (14 new + the six A2 pairs, Akkusativ and Dativ grouped), and every pair is explained', () => {
    const list = META.concepts[2].closedList!
    expect(META.concepts[2]).toMatchObject({ conceptId: 'b1-verben-praepositionen', proficiency: 'P-lim', load: 'M' })
    expect(list).toHaveLength(20)
    expect(new Set(list).size).toBe(20)
    expect(B1_CURRICULUM.units.find(u => u.unit === 28)!.concepts[2].listCap).toBe(20)
    expect(list.slice(0, 6)).toEqual([
      'warten auf + Akk',
      'sich freuen auf + Akk',
      'denken an + Akk',
      'sich interessieren für + Akk',
      'sprechen über + Akk',
      'sich freuen über + Akk',
    ])
    expect(list.filter(x => x.endsWith('+ Dat'))).toHaveLength(6)
    const a2 = fullBundle().grammar.find(g => g.id === 'a2-verben-mit-praepositionen')!
    for (const pair of ['sich interessieren für', 'sich freuen auf', 'sich freuen über', 'warten auf', 'sprechen über', 'denken an'])
      expect(a2.summary.ru + a2.summary.de + JSON.stringify(a2.examples), pair).toBeDefined()
    const sum = UNIT_28_GRAMMAR[2].summary.ru
    for (const e of list) expect(sum, e).toContain(e.replace(/ \+ (Akk|Dat)$/, ''))
  })
  it('the wo(r)- / da(r)- forms are taught and used: worauf/darauf, wofür/dafür, woran/daran, worüber/darüber, wovon/davon, darum — and never `damit` as an adverb', () => {
    const all = germanTexts().join(' ')
    for (const w of ['Worauf', 'Darauf', 'Wofür', 'Dafür', 'Woran', 'Daran', 'Wovon', 'Davon']) expect(all, w).toContain(w)
    expect(all).not.toMatch(/\bdamit\b/i)
  })
  it('`sodass` is RECEPTIVE: it appears in ONE reading (glossed) and never in a task, a test, a hint, a dialogue or the vocabulary', () => {
    const production = [
      ...UNIT_28_EXERCISES.flatMap(e => [e.prompt, e.answer, ...(e.options ?? []), ...(e.words ?? [])]),
      ...UNIT_28_FINAL.flatMap(q => [q.prompt, q.answer, ...q.options]),
      ...UNIT_28_WRITING.flatMap(w => [...w.mustInclude.flatMap(m => [m.label, ...m.patterns]), w.model]),
      ...UNIT_28_SPEAKING.flatMap(s => s.turns.flatMap(t => [t.ai, ...t.hints, ...t.keywords])),
      ...UNIT_28_GRAMMAR.flatMap(g => [
        g.speakPrompt.sample,
        ...g.examples.map(x => x.de),
        ...g.reallife.map(x => x.de),
        ...g.dialogue.map(x => x.text),
      ]),
      ...UNIT_28_LISTENING.flatMap(l => [...l.lines.map(x => x.text), ...l.questions.flatMap(q => [q.q, ...q.options])]),
      ...UNIT_28_VOCABULARY.map(v => v.example),
    ]
    for (const t of production) expect(/\bsodass\b/i.test(t), t).toBe(false)
    expect(UNIT_28_READING.filter(r => /\bsodass\b/.test(r.body.join(' '))).map(r => r.id)).toEqual(['b1-re-28-01'])
    expect(UNIT_28_READING[0].gloss.some(g => g.word === 'sodass')).toBe(true)
    expect(META.concepts[1].constructions!.map(c => [c.proficiency, c.forms])).toEqual([['R', ['sodass']]])
  })
  it('falls / sobald / solange are really used with the verb at the end, in both clause orders, and `wenn` is revised (A2)', () => {
    const all = germanTexts().join(' ')
    expect(all).toMatch(/\bFalls [^,.!?]*\b\w+, \w+ (ich|wir|sie|er|es) /)
    expect(all).toMatch(/\bSobald [^,.!?]*\b\w+, \w+ ich /)
    expect(all).toMatch(/\bSolange [^,.!?]*\b\w+, \w+ ich /)
    expect(all).toMatch(/, sobald [^,.!?]*\b\w+\./)
    expect(UNIT_28_EXERCISES.some(e => /^Wenn /.test(e.answer) && !e.concept)).toBe(true)
    expect(UNIT_28_FINAL.some(q => q.concept === 'a2-wenn-saetze')).toBe(true)
  })
})

describe('education-content safety: everything fictional, no claim about a real education system, children’s data kept minimal', () => {
  it('every reading and listening is labelled as invented; the speaking scenario and the writing tasks say so in the learner’s language', () => {
    for (const r of UNIT_28_READING) expect(`${r.title} ${r.body.join(' ')}`, r.id).toMatch(/erfunden|Erfundene|erfundenen/)
    for (const l of UNIT_28_LISTENING) expect(l.title, l.id).toMatch(/erfunden/)
    expect(UNIT_28_SPEAKING[0].goal.ru).toMatch(/вымышлен/)
    expect(UNIT_28_SPEAKING[0].goal.ky).toMatch(/ойдон чыгарылган/)
    for (const w of [MAIN, MICRO_M, MICRO_N]) {
      expect(w.situation.ru, w.id).toMatch(/вымышлен/)
      expect(w.situation.ky, w.id).toMatch(/ойдон чыгарылган/)
    }
  })
  it('the apology note shares only the minimum about the child (a word like "krank" and the days), and says so in the tips', () => {
    expect(MICRO_N.model).toMatch(/krank/)
    expect(MICRO_N.model).not.toMatch(/Diagnose|Fieber|Grippe|Magen|Medikament|Tablette|Arzt/i)
    expect(MICRO_N.tips.map(t => t.ru).join(' ')).toMatch(/Не пишите подробностей о здоровье ребёнка/)
    expect(MICRO_N.tips.map(t => t.ky).join(' ')).toMatch(/майда-чүйдөсүн жазбаңыз/)
  })
  it('the school letter, the course information and the Kita call separate fact (dates, numbers, places) from the speaker’s view; a rule is never presented as a general fact', () => {
    expect(UNIT_28_READING[0].body[0]).toMatch(/^Erfundener Erfahrungsbericht/)
    expect(UNIT_28_READING[0].body[1]).toMatch(/^Schulbrief \(erfunden\)/)
    expect(UNIT_28_READING[1].body.join(' ')).toMatch(/Das ist meine Meinung, keine Regel für alle/)
    expect(UNIT_28_LISTENING[1].lines.map(x => x.speaker)).toContain('Herr Brandt')
    expect(UNIT_28_LISTENING[1].lines.some(x => /Leider ist im Moment kein Platz frei/.test(x.text))).toBe(true)
  })
  it('no real school, university, exam or programme is named, and the word "Zertifikat" is not used', () => {
    const all = germanTexts().join(' ')
    for (const [name, test] of FORBIDDEN.filter(([n]) => n.startsWith('real institutions'))) expect(test(all), name).toBe(false)
    expect(JSON.stringify(ALL_DATA())).not.toMatch(/zertifikat/i)
  })
})

describe('vocabulary: 40 new items, none already taught', () => {
  const b = fullBundle()
  const earlier = new Set(b.vocabulary.filter(v => v.unit <= 27).flatMap(v => lemmaKeys(v.de)))
  it('exactly 40 items (target 38–42), ids v28-1 … v28-40, unique across the whole B1 vocabulary', () => {
    expect(UNIT_28_VOCABULARY).toHaveLength(40)
    expect(UNIT_28_VOCABULARY.map(v => v.id)).toEqual(Array.from({ length: 40 }, (_, i) => `v28-${i + 1}`))
    expect(UNIT_28_VOCABULARY.every(v => v.unit === 28)).toBe(true)
    const ids = B1_CONTENT.vocabulary.map(v => v.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toHaveLength(1380)
  })
  it('no lemma repeats an A1, A2 or earlier B1 headword (the basic education words are NOT repeated), and none is listed twice', () => {
    const keys = UNIT_28_VOCABULARY.flatMap(v => lemmaKeys(v.de))
    expect(keys.filter(k => earlier.has(k))).toEqual([])
    expect(new Set(keys).size).toBe(keys.length)
    const de = UNIT_28_VOCABULARY.map(v => v.de)
    for (const known of [
      'Schule',
      'Unterricht',
      'Prüfung',
      'Abschluss',
      'Zeugnis',
      'Ausbildung',
      'Praktikum',
      'Anmeldung',
      'Entschuldigung',
      'Ziel',
      'Plan',
      'Erfolg',
      'bestehen',
      'planen',
      'lernen',
      'Universität',
      'Vorlesung',
      'Zertifikat',
    ])
      expect(de).not.toContain(known)
  })
  it('every item has article/plural where a noun, a German example, and independent Russian and Kyrgyz translations of the word and the example', () => {
    for (const v of UNIT_28_VOCABULARY) {
      if (v.pos === 'noun') expect(v.article, v.de).toBeTruthy()
      for (const f of [v.de, v.ru, v.ky, v.example, v.exampleRu, v.exampleKy ?? '']) expect(f.trim().length, v.id).toBeGreaterThan(1)
      expect(v.ky).not.toBe(v.ru)
      expect(v.exampleKy).not.toBe(v.exampleRu)
      expect(v.example.toLowerCase()).toContain(
        v.de
          .replace(/^sich /, '')
          .split(' ')[0]
          .slice(0, 3)
          .toLowerCase(),
      )
    }
    const ex = UNIT_28_VOCABULARY.map(v => v.example)
    expect(new Set(ex).size).toBe(ex.length)
  })
  it('the planned themes are present (school system, study, scholarship, learning strategy, school and Kita communication), the closed-list prepositional verbs are GRAMMAR not vocabulary items', () => {
    const de = UNIT_28_VOCABULARY.map(v => v.de)
    for (const w of [
      'Schulsystem',
      'Studium',
      'Stipendium',
      'Auslandsjahr',
      'Lernstrategie',
      'Elternabend',
      'Elterngespräch',
      'Betreuung',
      'Ganztagsschule',
      'Lehrkraft',
      'Warteliste',
      'Bescheinigung',
      'durchfallen',
      'sich einschreiben',
      'sich weiterbilden',
      'berufsbegleitend',
    ])
      expect(de, w).toContain(w)
    for (const v of [
      'teilnehmen',
      'sich vorbereiten',
      'träumen',
      'abhängen',
      'sich beschäftigen',
      'anfangen',
      'aufhören',
      'sich kümmern',
      'sich ärgern',
      'hoffen',
      'achten',
    ])
      expect(de, v).not.toContain(v)
  })
  it('Wortbildung strand: compounds, -ung, -er and -pflichtig are present as items and explained in the metadata in three languages', () => {
    const de = UNIT_28_VOCABULARY.map(v => v.de)
    for (const w of ['Schulsystem', 'Lernplan', 'Kursgebühr', 'Elternabend', 'Betreuung', 'Bescheinigung', 'Teilnehmer', 'kostenpflichtig'])
      expect(de, w).toContain(w)
    const n = META.strands.wortbildungNote!
    expect(n.de && n.ru && n.ky).toBeTruthy()
    expect(n.ky).not.toBe(n.ru)
    for (const w of ['Schulsystem', '-ung', '-er', '-pflichtig']) expect(n.de).toContain(w)
  })
  it('the unit REUSES established education words as revision in its texts without listing them as new', () => {
    const all = germanTexts().join(' ')
    for (const w of [
      'Prüfung',
      'Abitur|Schule',
      'Anmeldung',
      'Entschuldigung',
      'Kurs',
      'Praktikum|Ausbildung|Arbeit',
      'Unterricht',
      'Klasse',
      'bestehen',
    ])
      expect(all, w).toMatch(new RegExp(w))
  })
})

describe('texts: progressive targets (band for Units 27–29 and the curriculum text for Unit 28)', () => {
  it('2 readings of 150–190 words and 2 listening scripts of 140–170 words', () => {
    expect(UNIT_28_READING).toHaveLength(2)
    expect(UNIT_28_LISTENING).toHaveLength(2)
    for (const r of UNIT_28_READING) {
      const n = r.body.reduce((a, p) => a + words(p), 0)
      expect(n, r.id).toBeGreaterThanOrEqual(150)
      expect(n, r.id).toBeLessThanOrEqual(190)
    }
    for (const l of UNIT_28_LISTENING) {
      const n = l.lines.reduce((a, x) => a + words(x.text), 0)
      expect(n, l.id).toBeGreaterThanOrEqual(140)
      expect(n, l.id).toBeLessThanOrEqual(170)
    }
  })
  it('sentences stay short (95th percentile ≤ 20, longest ≤ 25 words)', () => {
    const lens = [
      ...UNIT_28_READING.flatMap(r => r.body.flatMap(sentences)),
      ...UNIT_28_LISTENING.flatMap(l => l.lines.flatMap(x => sentences(x.text))),
    ]
      .map(words)
      .sort((a, b) => a - b)
    expect(lens[lens.length - 1]).toBeLessThanOrEqual(25)
    expect(lens[Math.ceil(0.95 * lens.length) - 1]).toBeLessThanOrEqual(20)
  })
  it('every dialogue line carries a Russian and a Kyrgyz translation; questions have 3 distinct options, exactly one correct; answer positions vary', () => {
    for (const l of UNIT_28_LISTENING) for (const x of l.lines) expect(x.ru && x.ky && x.ky !== x.ru).toBeTruthy()
    const qs = [...UNIT_28_LISTENING.flatMap(l => l.questions), ...UNIT_28_READING.flatMap(r => r.questions)]
    for (const q of qs) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options).size).toBe(3)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(3)
    }
    expect(new Set(qs.map(q => q.answer)).size).toBe(3)
    expect(new Set(UNIT_28_READING.flatMap(r => r.questions.map(q => q.answer))).size).toBe(3)
    expect(new Set(UNIT_28_LISTENING.flatMap(l => l.questions.map(q => q.answer))).size).toBe(3)
  })
  it('the listening keywords all have a gloss in the unit vocabulary', () => {
    const de = new Set(UNIT_28_VOCABULARY.map(v => v.de))
    for (const l of UNIT_28_LISTENING) for (const k of l.keywords) expect(de.has(k), `${l.id}: ${k}`).toBe(true)
  })
  it('the listening dialogues are coherent: greetings and closings; the Kita call contains the unexpected refusal and then a solution (Warteliste, falls)', () => {
    expect(UNIT_28_LISTENING[0].lines[0].text).toMatch(/Guten Tag/)
    expect(UNIT_28_LISTENING[0].lines.at(-1)!.text).toMatch(/Auf Wiedersehen/)
    expect(UNIT_28_LISTENING[1].lines[0].text).toMatch(/Kita Sonnenschein/)
    expect(UNIT_28_LISTENING[1].lines.at(-1)!.text).toMatch(/Auf Wiedersehen/)
    const l2 = UNIT_28_LISTENING[1].lines.map(x => x.text)
    expect(l2.findIndex(t => /kein Platz frei/.test(t))).toBeLessThan(l2.findIndex(t => /Falls ein Platz frei wird/.test(t)))
  })
  it('the listening answer keys agree with the script (every correct option is supported by the text, no distractor is)', () => {
    const l1 = UNIT_28_LISTENING[0].lines.map(x => x.text).join(' ')
    const q1 = UNIT_28_LISTENING[0].questions
    expect(q1.map(q => q.options[q.answer])).toEqual([
      'Für ein Studium in Informatik.',
      'Bis zum 15. Juli.',
      'Er kommt auf die Warteliste.',
      'Nebenbei arbeiten.',
    ])
    expect(l1).toMatch(/interessiere mich für ein Studium in Informatik/)
    expect(l1).toMatch(/Bis zum 15\. Juli müssen Sie sich um einen Studienplatz bewerben/)
    expect(l1).toMatch(/Dann kommen Sie auf die Warteliste/)
    expect(l1).toMatch(/Solange Sie studieren, können Sie nebenbei arbeiten/)
    expect(l1).not.toMatch(/15\. Juni|15\. August/)
    const l2 = UNIT_28_LISTENING[1].lines.map(x => x.text).join(' ')
    const q2 = UNIT_28_LISTENING[1].questions
    expect(q2.map(q => q.options[q.answer])).toEqual([
      'Ihr Sohn ist krank.',
      'Am Montag.',
      'Es ist kein Platz frei.',
      'Sie arbeitet nur halbtags.',
    ])
    expect(l2).toMatch(/Mein Sohn Jonas ist diese Woche krank/)
    expect(l2).toMatch(/er wird am Montag wieder kommen/)
    expect(l2).toMatch(/Solange ich keinen Platz habe, arbeite ich nur halbtags/)
  })
  it('the reading answer keys agree with the text', () => {
    const [r1, r2] = UNIT_28_READING
    const t1 = r1.body.join(' ')
    expect(r1.questions.map(q => q.options[q.answer])).toEqual([
      'falsch',
      'Sobald sie die Bescheinigung vom Kurs hat.',
      'Eine Entschuldigung schicken.',
    ])
    expect(t1).toMatch(/Ich habe einen Sprachkurs belegt und abends in einem Café gearbeitet/)
    expect(t1).toMatch(/Sobald ich die Bescheinigung vom Kurs habe, bewerbe ich mich um einen Studienplatz/)
    expect(t1).toMatch(/Falls Sie nicht kommen können, schicken Sie bitte eine Entschuldigung/)
    const t2 = r2.body.join(' ')
    expect(r2.questions.map(q => q.options[q.answer])).toEqual([
      'Man kann lernen, wann man will.',
      'Über die schlechte Verbindung.',
      'richtig',
    ])
    expect(t2).toMatch(/Man kann lernen, wann man will/)
    expect(t2).toMatch(/ärgere mich manchmal über die schlechte Verbindung/)
    expect(t2).toMatch(/denn ich brauche Kontakt zu anderen/)
  })
  it('the reading glosses give Russian and Kyrgyz for every word, independently', () => {
    for (const r of UNIT_28_READING) for (const g of r.gloss) expect(g.ky).not.toBe(g.ru)
    for (const r of UNIT_28_READING) for (const g of r.gloss) expect(g.grammarKy).not.toBe(g.grammar)
  })
  it('listening uses the existing browser text-to-speech lab: no audio file, no claim of verified playback; no assessment item depends on audio', () => {
    for (const l of UNIT_28_LISTENING) expect(Object.keys(l)).not.toContain('audio')
    for (const q of UNIT_28_FINAL) expect(q.skill).not.toBe('listening')
  })
  it('speaking: one scenario of 6 turns (parent–teacher talk, child ill, question about the exam); in turn 4 the Betreuung place is NOT available (unexpected element) and the hints practise falls / sobald / Warteliste', () => {
    const [s] = UNIT_28_SPEAKING
    expect(s.turns).toHaveLength(6)
    expect(s.turns.length).toBeGreaterThanOrEqual(6)
    expect(s.turns.length).toBeLessThanOrEqual(7)
    expect(s.level).toBe('B1')
    for (const t of s.turns) {
      expect(t.aiRu && t.aiKy).toBeTruthy()
      expect(t.hints.length).toBeGreaterThanOrEqual(3)
      expect(t.keywords.length).toBeGreaterThanOrEqual(3)
      for (const k of t.keywords) expect(k).toBe(k.toLowerCase())
    }
    expect(s.turns[3].ai).toMatch(/kein Platz frei/)
    expect(s.turns[3].hints.join(' ')).toMatch(/Falls ein Platz frei wird/)
    expect(s.turns[3].hints.join(' ')).toMatch(/Sobald Sie/)
    expect(s.turns[2].hints.join(' ')).toMatch(/Wird er die Prüfung wohl bestehen/)
    expect(s.turns[0].ai).toMatch(/Worüber/)
    expect(s.titleRu && s.titleKy).toBeTruthy()
  })
})

describe('writing: the enquiry mail and the THREE micro-tasks required by the curriculum, all discoverable', () => {
  it('main task: formal (Sie), 80 words minimum, seven expected elements, a model that meets every one, with Verb + Präposition, falls/sobald, Futur I and a polite request', () => {
    expect(MAIN).toMatchObject({ id: 'b1-wr-28-01', minWords: 80, level: 'B1', unit: 28, formal: true })
    expect(words(MAIN.model)).toBeGreaterThanOrEqual(80)
    expect(MAIN.mustInclude).toHaveLength(7)
    for (const m of MAIN.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky).toBeTruthy()
      expect(m.explain!.ky).not.toBe(m.explain!.ru)
      expect(
        m.patterns.some(p => MAIN.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(MAIN.model).toMatch(/ich interessiere mich für/)
    expect(MAIN.model).toMatch(/\bFalls\b/)
    expect(MAIN.model).toMatch(/\bSobald\b/)
    expect(MAIN.model).toMatch(/\bwerde\b[^.!?]*\b(schaffen|bestehen|lernen)\b/)
    expect(MAIN.model).toMatch(/Könnten Sie mir bitte/)
    expect(MAIN.model).not.toMatch(/\bdu\b|\bdir\b|\bdein/i)
    for (const t of MAIN.tips) expect(t.ky).not.toBe(t.ru)
  })
  it('the opinion micro-task (kind "meinung"): opinion + reason + a word of the topic; its model meets every element and is balanced', () => {
    expect(MICRO_O).toMatchObject({ id: 'b1-wr-28-02', minWords: 30, level: 'B1', unit: 28, formal: false })
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
    expect(MICRO_O.model).toMatch(/\bNachteil\b/)
    expect(MICRO_O.situation.ru).toMatch(/плюсы, и минусы/)
  })
  it('the mediation micro-task (kind "mediation"): relays a fictional course information in own words; every fact kept; pronouns shifted', () => {
    expect(MICRO_M).toMatchObject({ id: 'b1-wr-28-03', minWords: 30, level: 'B1', unit: 28, formal: false })
    expect(words(MICRO_M.model)).toBeGreaterThanOrEqual(30)
    expect(MICRO_M.mustInclude).toHaveLength(4)
    for (const m of MICRO_M.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky && m.explain.ky !== m.explain.ru).toBeTruthy()
      expect(
        m.patterns.some(p => MICRO_M.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(MICRO_M.model).toMatch(/schreibt, dass/)
    for (const f of ['5. September', '150 Euro', '135 Euro', '1. August']) expect(MICRO_M.model + MICRO_M.situation.ru, f).toContain(f)
    expect(MICRO_M.model).not.toMatch(/\bwer sich anmeldet\b/i)
    expect(sentences(MICRO_M.model.replace(/(\d+)\./g, '$1')).length).toBeLessThanOrEqual(6)
    expect(MICRO_M.situation.ru).toMatch(/двух-трёх предложениях/)
  })
  it('the apology note (kind "note"): formal, short, names the days and the reason, politely asks to excuse, and asks what must be made up', () => {
    expect(MICRO_N).toMatchObject({ id: 'b1-wr-28-04', minWords: 30, level: 'B1', unit: 28, formal: true })
    expect(words(MICRO_N.model)).toBeGreaterThanOrEqual(30)
    expect(MICRO_N.mustInclude).toHaveLength(4)
    for (const m of MICRO_N.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky && m.explain.ky !== m.explain.ru).toBeTruthy()
      expect(
        m.patterns.some(p => MICRO_N.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(MICRO_N.model).toMatch(/^Sehr geehrte Frau/)
    expect(MICRO_N.model).toMatch(/Mit freundlichen Grüßen/)
    expect(MICRO_N.model).toMatch(/Montag und am Dienstag/)
    expect(MICRO_N.model).toMatch(/Ich bitte Sie, [^.]* zu entschuldigen/)
  })
  it('all micro-tasks are declared in the metadata with the right kinds, and the curriculum requires exactly: opinion, mediation and the apology', () => {
    const spec = B1_CURRICULUM.units.find(u => u.unit === 28)!.requires
    expect(spec.meinungMicroTask).toBe(true)
    expect(spec.mediationMicroTask).toBe(true)
    expect(META.microTasks).toEqual([
      { kind: 'meinung', taskId: 'b1-wr-28-02' },
      { kind: 'mediation', taskId: 'b1-wr-28-03' },
      { kind: 'note', taskId: 'b1-wr-28-04' },
    ])
    expect(UNIT_28_WRITING.map(w => w.id)).toEqual(['b1-wr-28-01', 'b1-wr-28-02', 'b1-wr-28-03', 'b1-wr-28-04'])
  })
  it('NO required writing task is omitted and every one is discoverable: the Writing Lab list holds all four; the unit page has the main row plus three extra rows', () => {
    registerLevelContent('B1', B1_CONTENT)
    const lab = writingOf('B1').filter(w => w.unit === 28)
    expect(lab.map(w => w.id)).toEqual(UNIT_28_WRITING.map(w => w.id))
    expect(writingForUnit(28)[0].id).toBe('b1-wr-28-01')
    expect(
      writingForUnit(28)
        .slice(1)
        .map(w => w.id),
    ).toEqual(['b1-wr-28-02', 'b1-wr-28-03', 'b1-wr-28-04'])
  })
  it('the writing tips tell the learner that the app checks only length and expected words and that quality is self-assessed (all tasks)', () => {
    for (const w of UNIT_28_WRITING) {
      expect(w.tips.map(t => t.ru).join(' ')).toMatch(/только объём и ожидаемые слова/)
      expect(w.tips.map(t => t.ky).join(' ')).toMatch(/көлөмдү жана күтүлгөн сөздөрдү гана/)
    }
  })
})

describe('exercises: answer keys are correct and unique', () => {
  it('10 handwritten exercises: 8 on the three concepts (3 + 2 + 3) + 2 recycled without a concept; types fill / choice / order; both languages everywhere', () => {
    expect(UNIT_28_EXERCISES).toHaveLength(10)
    expect(UNIT_28_EXERCISES.map(e => e.id)).toEqual(Array.from({ length: 10 }, (_, i) => `b1-ex-28-${String(i + 1).padStart(2, '0')}`))
    const withConcept = UNIT_28_EXERCISES.filter(e => e.concept)
    expect(withConcept).toHaveLength(8)
    expect(CONCEPTS.map(c => withConcept.filter(e => e.concept === c).length)).toEqual([3, 2, 3])
    expect(UNIT_28_EXERCISES.filter(e => !e.concept).map(e => e.id)).toEqual(['b1-ex-28-09', 'b1-ex-28-10'])
    expect(['fill', 'choice', 'order'].map(t => UNIT_28_EXERCISES.filter(e => e.type === t).length)).toEqual([4, 4, 2])
    for (const e of UNIT_28_EXERCISES) {
      expect(e.why.ru && e.why.ky).toBeTruthy()
      expect(e.why.ky).not.toBe(e.why.ru)
      expect(e.promptRu && e.promptKy, e.id).toBeTruthy()
    }
  })
  it('every choice / fill item: 3 distinct options and the answer is among them exactly once; every order item is a true permutation that is not pre-solved', () => {
    for (const e of UNIT_28_EXERCISES) {
      if (e.type === 'order') {
        expect([...(e.words ?? [])].sort().join('|')).toBe(e.answer.split(' ').sort().join('|'))
        expect(e.words!.join(' ')).not.toBe(e.answer)
      } else {
        expect(e.options).toHaveLength(3)
        expect(new Set(e.options).size).toBe(3)
        expect(e.options!.filter(o => o === e.answer)).toHaveLength(1)
      }
    }
    for (const e of UNIT_28_EXERCISES.filter(x => x.type === 'fill')) expect(e.prompt.match(/___/g)).toHaveLength(1)
  })
  it('the text-level item (ex 08): three sentences per option, exactly one correct, and the wrong ones each contain a real learner error (wrong wo- form, wrong da- form)', () => {
    const e = UNIT_28_EXERCISES.find(x => x.id === 'b1-ex-28-08')!
    for (const o of e.options!) expect(sentences(o)).toHaveLength(3)
    const wrong = e.options!.filter(o => o !== e.answer)
    expect(wrong.some(o => /^Wofür wartest du/.test(o))).toBe(true)
    expect(wrong.some(o => /Dafür hoffe ich/.test(o))).toBe(true)
    expect(e.answer).toMatch(/^Worauf wartest du\? .* Darauf hoffe ich/)
  })
  it('the exercises really use their construction in the answer, and stay inside the closed lists', () => {
    const by = (id: string) => UNIT_28_EXERCISES.find(e => e.id === id)!
    expect(by('b1-ex-28-01').answer).toBe('wird')
    expect(by('b1-ex-28-02').answer).toMatch(/wird wohl krank sein\.$/)
    expect(by('b1-ex-28-03').answer).toMatch(/werde .* wohl bestehen\.$/)
    expect(by('b1-ex-28-04').answer).toBe('Falls')
    expect(by('b1-ex-28-05').answer).toMatch(/^Solange ich studiere, wohne ich/)
    expect(by('b1-ex-28-06').answer).toBe('von')
    expect(by('b1-ex-28-07').answer).toBe('Wir kümmern uns um die Anmeldung.')
    for (const e of UNIT_28_EXERCISES.filter(x => x.concept === 'b1-futur1-vermutungen' && x.type !== 'fill'))
      expect(e.answer, e.id).toMatch(new RegExp(`\\b(${FUTUR_LIST.join('|')})\\.$`))
  })
})

describe('final test: structure, answer keys and scoring data', () => {
  it('15 questions = 8 grammar (2 Futur I, 2 falls/sobald/solange, 2 verb + preposition, 2 recycled ↻) + 3 vocabulary + 4 reading, no listening; ≥ 2 gap-fill', () => {
    expect(UNIT_28_FINAL.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `b1-ft-28-${String(i + 1).padStart(2, '0')}`))
    const by = (s: string) => UNIT_28_FINAL.filter(q => q.skill === s)
    expect([by('grammar').length, by('vocabulary').length, by('reading').length, by('listening').length]).toEqual([8, 3, 4, 0])
    expect(by('grammar').filter(q => /___/.test(q.prompt)).length).toBeGreaterThanOrEqual(2)
    expect(CONCEPTS.map(c => by('grammar').filter(q => q.concept === c).length)).toEqual([2, 2, 2])
    expect(
      by('grammar')
        .filter(q => q.concept && !CONCEPTS.includes(q.concept))
        .map(q => q.concept),
    ).toEqual(['a2-wenn-saetze', 'b1-infinitiv-mit-zu'])
    expect(UNIT_28_TEST).toMatchObject({ id: 'unit-28', kind: 'topic', level: 'B1', unit: 28, size: 15 })
  })
  it('the recycled concepts really exist in earlier units (A2 Unit 14 and B1 Unit 23)', () => {
    const owner = new Map(fullBundle().grammar.map(g => [g.id, g.unit]))
    for (const q of UNIT_28_FINAL.filter(x => x.concept && !CONCEPTS.includes(x.concept)))
      expect(owner.get(q.concept!)! < 28, q.concept).toBe(true)
  })
  it('options: 3 distinct each, the answer appears exactly once, both languages with an explanation; positions are 5 / 5 / 5, never three in a row', () => {
    const pos: number[] = []
    for (const q of UNIT_28_FINAL) {
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
  it('the Futur-vs-Präsens question has exactly one conjecture; the falls/sobald questions are unambiguous by their cues (vielleicht / sofort); the wo- question matches the verb', () => {
    const q1 = UNIT_28_FINAL.find(x => x.id === 'b1-ft-28-01')!
    expect(q1.options.filter(o => /wird wohl/.test(o))).toEqual([q1.answer])
    const q3 = UNIT_28_FINAL.find(x => x.id === 'b1-ft-28-03')!
    expect(q3.options.filter(o => /^Falls er keinen Platz bekommt, kommt er/.test(o))).toEqual([q3.answer])
    expect(UNIT_28_FINAL.find(x => x.id === 'b1-ft-28-04')!.prompt).toMatch(/sofort/)
    const q6 = UNIT_28_FINAL.find(x => x.id === 'b1-ft-28-06')!
    expect(q6.prompt).toMatch(/interessierst du dich\? – Für /)
    expect(q6.answer).toBe('Wofür')
  })
  it('the final test shares no prompt (except the generic instruction line) and no answer with the revision exercises, and no prompt with another question', () => {
    const ex = new Set(UNIT_28_EXERCISES.flatMap(e => [e.prompt, e.answer]))
    const generic = new Set(['Welcher Satz ist richtig?', 'Bilde den Satz.'])
    for (const q of UNIT_28_FINAL) {
      if (!generic.has(q.prompt)) expect(ex.has(q.prompt), q.id).toBe(false)
      expect(ex.has(q.answer), q.id).toBe(false)
    }
    const prompts = UNIT_28_FINAL.map(q => q.prompt).filter(p => !generic.has(p))
    expect(new Set(prompts).size).toBe(prompts.length)
  })
  it('scoring data: every question has its answer among its options (a perfect run is 15/15) and the pass mark of the existing rule (70 %) is 11 of 15', () => {
    expect(UNIT_28_FINAL.filter(q => q.options.includes(q.answer)).length).toBe(15)
    expect(Math.ceil(0.7 * 15)).toBe(11)
  })
})

describe('unit metadata, objectives, topic evidence and the spaced-revision set', () => {
  it('2–3 can-do goals and one objective per skill, each "Ich kann …" with independent Russian and Kyrgyz', () => {
    expect(META.canDo.length).toBeGreaterThanOrEqual(2)
    expect(META.canDo.length).toBeLessThanOrEqual(3)
    for (const t of [
      ...META.canDo,
      ...Object.values(META.objectives),
      META.differenceFromA2!,
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
    expect(META.scenario.id).toBe('b1-sp-28-01')
    expect(META.strands.strategyNote!.de).toMatch(/Mediation/)
  })
  it('the classification is the approved one: P-lim/L (Futur), P/L (falls…, receptive sodass), P-lim/M (cap 20); D-3 for Futur I is still OPEN', () => {
    expect(META.concepts.map(c => [c.conceptId, c.proficiency, c.load, c.role])).toEqual([
      ['b1-futur1-vermutungen', 'P-lim', 'L', 'new'],
      ['b1-falls-sobald-solange', 'P', 'L', 'new'],
      ['b1-verben-praepositionen', 'P-lim', 'M', 'new'],
    ])
    const spec = B1_CURRICULUM.units.find(u => u.unit === 28)!
    expect(spec.concepts[0].expertReview).toMatchObject({ status: 'pending', decision: 'D-3' })
    expect(spec.concepts[1].expertReview).toBeUndefined()
    expect(spec.concepts[2].expertReview).toBeUndefined()
  })
  it('the topic "school-kita" is evidenced by real items of the unit (vocabulary, reading, listening, apology note, speaking)', () => {
    const items = new Set([
      ...UNIT_28_VOCABULARY.map(v => v.id),
      ...UNIT_28_READING.map(r => r.id),
      ...UNIT_28_LISTENING.map(l => l.id),
      ...UNIT_28_EXERCISES.map(e => e.id),
      ...UNIT_28_WRITING.map(w => w.id),
      'b1-sp-28-01',
    ])
    expect(META.topics!.map(t => t.topic)).toEqual(['school-kita'])
    const ids = META.topics![0].itemIds
    expect(ids.length).toBeGreaterThanOrEqual(5)
    for (const id of ids) expect(items.has(id), id).toBe(true)
    for (const id of ['b1-li-28-02', 'b1-wr-28-04', 'b1-sp-28-01']) expect(ids).toContain(id)
    const names = ids.filter(id => id.startsWith('v28-')).map(id => UNIT_28_VOCABULARY.find(v => v.id === id)!.de)
    for (const n of ['Lehrkraft', 'Elternabend', 'Elterngespräch', 'Betreuung', 'Ganztagsschule']) expect(names, n).toContain(n)
  })
  it('spaced revision: 4 words of Unit 27, 2 of Unit 25, 2 from A2 — real, existing vocabulary ids', () => {
    const vocab = new Map(fullBundle().vocabulary.map(v => [v.id, v.unit]))
    expect(META.revision!.fromPrevious.map(id => vocab.get(id))).toEqual([27, 27, 27, 27])
    expect(META.revision!.fromThirdBack.map(id => vocab.get(id))).toEqual([25, 25])
    expect(META.revision!.fromA2.length).toBeGreaterThanOrEqual(2)
    for (const id of META.revision!.fromA2) expect(vocab.get(id)! >= 11 && vocab.get(id)! <= 20, id).toBe(true)
  })
  it('the Wiederholungsblock holds at least 20 distinct words of Units 25–27 (all three units represented), none of Unit 28 itself', () => {
    const vocab = new Map(fullBundle().vocabulary.map(v => [v.id, v.unit]))
    const block = META.revision!.block!
    expect(block.length).toBeGreaterThanOrEqual(20)
    expect(new Set(block).size).toBe(block.length)
    for (const id of block) expect([25, 26, 27], id).toContain(vocab.get(id))
    for (const u of [25, 26, 27]) expect(block.filter(id => vocab.get(id) === u).length, `unit ${u}`).toBeGreaterThanOrEqual(5)
  })
  it('the two kinds of vocabulary are kept apart: the 40 new items of Unit 28 vs. revision ids that are all earlier words', () => {
    const newIds = new Set(UNIT_28_VOCABULARY.map(v => v.id))
    const rev = [...META.revision!.fromPrevious, ...META.revision!.fromThirdBack, ...META.revision!.fromA2, ...META.revision!.block!]
    for (const id of rev) expect(newIds.has(id), id).toBe(false)
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
    walk(ALL_DATA(), 'unit28')
    expect(missing).toEqual([])
  })
  it('the Russian and the Kyrgyz are of comparable size (no half-translated string)', () => {
    const bad: string[] = []
    for (const v of UNIT_28_VOCABULARY) {
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
      'бөлүнүүчү',
      'жөндөлгөн этиш',
      'ээрчимелүү',
      'багыныңкы',
      'баш сүйлөм',
      'шарттуу ыңгай',
      'кайтарым',
      'келечек чак формасы',
      'предлогдук этиш',
    ])
      expect(all, bad).not.toContain(bad)
  })
  it('every Kyrgyz string is written in Cyrillic (quoted German allowed) and the unit has a large Kyrgyz body', () => {
    const ky = kyTexts()
    expect(ky.length).toBeGreaterThan(250)
    expect(ky.filter(t => t.length > 25 && !/[А-Яа-яЁёҢңӨөҮү]/.test(t))).toEqual([])
  })
  it('the explanations of exercises and final-test questions differ between Russian and Kyrgyz', () => {
    for (const e of UNIT_28_EXERCISES) expect(e.why.ky).not.toBe(e.why.ru)
    for (const q of UNIT_28_FINAL) expect(q.why.ky).not.toBe(q.why.ru)
  })
})

describe('validator and assessment honesty', () => {
  it('the validator finds 0 errors and 0 warnings in the real bundle; the review flags of Unit 28 are exactly: missing human CEFR sign-off and the open decision D-3 for Futur I', () => {
    const is = validateContent(fullBundle())
    expect(is.filter(i => i.severity === 'error')).toEqual([])
    expect(is.filter(i => i.severity === 'warning')).toEqual([])
    expect(is.filter(i => i.rule.startsWith('b1-') && i.severity !== 'review')).toEqual([])
    expect(
      is
        .filter(i => i.where === 'units:28' && i.severity === 'review')
        .map(i => i.rule)
        .sort(),
    ).toEqual(['beta-review-pending', 'beta-review-pending', 'cefr-signoff-missing']) // + the Beta flags (ru, ky) since the B1 Beta launch
    expect(is.filter(i => i.where === 'grammar:b1-futur1-vermutungen' && i.severity === 'review').map(i => i.rule)).toEqual([
      'b1-expert-review-pending',
    ])
    expect(
      is.filter(
        i =>
          /^(grammar:b1-(falls|verben)|reading:b1-re-28-\d{2}|listening:b1-li-28-\d{2}|writing:b1-wr-28-\d{2}|vocabulary:v28-\d+)(?:#|$)/.test(i.where) &&
          i.severity === 'review',
      ),
    ).toEqual([])
  })
  it('the unit never claims a CEFR level, a certificate or an exam result', () => {
    const all = JSON.stringify(ALL_DATA(), (k, v) => (k === 'source' ? undefined : v))
    expect(all).not.toMatch(/zertifikat|certificate|сертификат|B1 erreicht|достигнут уровень|official/i)
    expect(all).not.toMatch(/\bCEFR\b/)
  })
  it('speaking and writing feedback is a checklist and a self-assessment: no numeric CEFR or score field in the unit data', () => {
    const all = JSON.stringify([UNIT_28_SPEAKING, UNIT_28_WRITING])
    expect(all).not.toMatch(/"(score|points|cefrScore|level_score)"/)
  })
  it('the provenance says the material is original, fictional where it reports schools and courses, and NOT reviewed', () => {
    for (const x of [...UNIT_28_GRAMMAR, ...UNIT_28_READING, ...UNIT_28_LISTENING, ...UNIT_28_SPEAKING, ...UNIT_28_WRITING]) {
      expect(x.source?.kind).toBe('authored')
      expect(x.source?.author).toMatch(/pending independent CEFR, Russian and Kyrgyz review/)
    }
  })
})
