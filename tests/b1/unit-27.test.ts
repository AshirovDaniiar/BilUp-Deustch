// @vitest-environment node
/**
 * B1 Unit 27 — Konsum, Geld und Reklamation (Stage 3I). Checks the authored content against the approved curriculum: identity, the two approved concepts
 * (Konjunktiv II for wishes / unreal conditions / polite requests; Genitiv prepositions wegen, trotz, während, statt on a closed list), vocabulary (38–42, nothing
 * already taught), text sizes, the scope guard for later units — with REGRESSION samples proving that genuine out-of-scope German is still detected — the
 * consumer-safety rules (everything fictional, shop rules are not law, complaint / reply / general remark kept apart), RU/KY parity, exercise and answer-key
 * correctness, assessment structure, metadata, the opinion micro-task and its discoverability, topic evidence and spaced revision. B1 stays `planned`.
 */
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { lemmaKeys } from '../../scripts/content-validate/b1/lemma'
import { B1_CURRICULUM } from '../../scripts/content-validate/b1/curriculum'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_META } from '../../src/data/b1/meta'
import { B1_UNIT_PLAN } from '../../src/data/b1/registry'
import { UNIT_27_EXERCISES, UNIT_27_FINAL, UNIT_27_TEST } from '../../src/data/b1/unit27/assessment'
import { UNIT_27_GRAMMAR, UNIT_27_WHY_NOTES } from '../../src/data/b1/unit27/grammar'
import { UNIT_27_LISTENING, UNIT_27_READING, UNIT_27_SPEAKING, UNIT_27_WRITING } from '../../src/data/b1/unit27/texts'
import { UNIT_27 } from '../../src/data/b1/unit27/unit'
import { UNIT_27_VOCABULARY } from '../../src/data/b1/unit27/vocabulary'
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
const CONCEPTS = ['b1-konjunktiv2-wuensche-irreal', 'b1-genitiv-praepositionen']
const META = B1_META.find(m => m.unit === 27)!
const [MAIN, MICRO] = UNIT_27_WRITING

function germanTexts(): string[] {
  const out: string[] = []
  for (const r of UNIT_27_READING) out.push(...r.body, ...r.questions.flatMap(q => [q.q, ...q.options]))
  for (const l of UNIT_27_LISTENING) out.push(...l.lines.map(x => x.text), ...l.questions.flatMap(q => [q.q, ...q.options]))
  for (const v of UNIT_27_VOCABULARY) out.push(v.example)
  for (const g of UNIT_27_GRAMMAR)
    out.push(...g.examples.map(x => x.de), ...g.reallife.map(x => x.de), ...g.dialogue.map(x => x.text), g.speakPrompt.sample)
  for (const n of UNIT_27_WHY_NOTES) out.push(n.sentence, ...n.more.map(x => x.de))
  // prompts and answers only: the distractor options of a choice item are deliberately wrong forms and are never taught
  for (const e of UNIT_27_EXERCISES) out.push(e.prompt, e.answer)
  for (const q of UNIT_27_FINAL) out.push(q.prompt, q.answer)
  for (const w of UNIT_27_WRITING) out.push(w.model, w.mustInclude.map(m => m.label).join(' '))
  for (const s of UNIT_27_SPEAKING) out.push(...s.turns.flatMap(t => [t.ai, ...t.hints]))
  return out
}
const MISTAKES = new Set(UNIT_27_GRAMMAR.flatMap(g => g.mistakes.flatMap(m => [m.wrong, m.right])))
const taught = () => germanTexts().filter(t => !MISTAKES.has(t))

const ALL_DATA = () => [
  UNIT_27,
  UNIT_27_GRAMMAR,
  UNIT_27_WHY_NOTES,
  UNIT_27_READING,
  UNIT_27_LISTENING,
  UNIT_27_SPEAKING,
  UNIT_27_WRITING,
  UNIT_27_EXERCISES,
  UNIT_27_FINAL,
  UNIT_27_VOCABULARY,
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

const PREP = '(?:wegen|trotz|während|statt)'
/** removes the four allowed prepositional Genitiv phrases, so that only Genitiv ATTRIBUTES (Unit 29) remain visible to the attribute rule */
const withoutPrepGenitiv = (t: string) =>
  t.replace(new RegExp(`\\b${PREP}\\s+(?:des|der|eines|einer|dieser|dieses|unserer)\\s+(?:\\w+en\\s+)?[A-ZÄÖÜ][a-zäöüß]+`, 'gi'), ' ')
const NOT_NOUN = /^(Bei|In|Auf|Mit|Von|Zu|Nach|Aus|Für|An|Vor|Über|Unter|Seit|Ab|Bis|Um|Durch|Gegen|Im|Am|Vom|Zum|Zur)$/
const FUNCTION_WORD =
  /^(Die|Der|Das|Den|Dem|Ein|Eine|Und|Aber|Oder|Denn|Dass|Ob|Als|Wie|Wo|Wann|Warum|Was|Wer|Ja|Nein|Gern|Auch|Nur|Noch|Schon|Leider|Danke|Bitte|Hier|Dort|Heute|Morgen|Jetzt|Ich|Er|Sie|Wir|Man|Es|Ihr|Du|Dann|Wenn|Weil|Frau|Herr|Dr|Wegen|Trotz|Während|Statt)$/
/** a capitalised word followed by des / eines / der / einer + noun is a Genitiv attribute (Unit 29), unless the first word is an article, a preposition or another function word */
const genitivAttribute = (t: string) => {
  for (const m of withoutPrepGenitiv(t).matchAll(/\b([A-ZÄÖÜ][a-zäöüß]+)\s+(des|eines|der|einer)\s+(?:\w+en\s+)?([A-ZÄÖÜ][a-zäöüß]+)/g))
    if (!NOT_NOUN.test(m[1]) && !FUNCTION_WORD.test(m[1])) return true
  return false
}

const FORBIDDEN: [string, (t: string) => boolean][] = [
  ['damit (Unit 30)', t => /\bdamit\b/i.test(t)],
  ['Passiv Perfekt (receptive in Unit 24 only)', t => /\bworden\b/i.test(t)],
  ['Konjunktiv I / indirect speech in the subjunctive (B2)', t => /\b(er|sie|es|man)\s+sei\b|\bheiße es\b|\bgebe es\b|\bseien\b/i.test(t)],
  [
    'Konjunktiv II of the past (receptive, Unit 31)',
    t => /\b(hätte|hätten|hättest|wäre|wären)\b[^.!?,]*\b(ge\w+(t|en)|\w+iert)\s*[.!?,]/i.test(t),
  ],
  ['als ob (B2)', t => /\bals ob\b/i.test(t)],
  ['colloquial würde inside a wenn clause (the unit teaches hätte / wäre / könnte there)', t => /\bwenn\b[^.!?,]*\bwürde\b/i.test(t)],
  ['Konjunktiv II modals outside the approved forms (müsste, dürfte, wollte)', t => /\b(müsste|müssten|dürfte|dürften)\b/i.test(t)],
  ['wegen/trotz/während/statt + Dativ (colloquial, not taught)', t => /\b(wegen|trotz|während|statt)\s+(dem|den|einem)\b/i.test(t)],
  ['statt … zu with an infinitive (receptive, Unit 23)', t => /\bstatt\s+(zu\b|(?:\w+\s+){1,5}?zu\s+\w+(en|n)\b[.!?,])/i.test(t)],
  [
    'other Genitiv prepositions (closed list: wegen, trotz, während, statt)',
    t => /\b(außerhalb|innerhalb|aufgrund|anstatt|oberhalb|unterhalb|diesseits|jenseits|angesichts)\b/i.test(t),
  ],
  ['Genitiv attribute (Unit 29)', genitivAttribute],
  [
    'relative clause with a preposition (Unit 29)',
    t => /,\s*(an|auf|in|mit|von|für|bei|aus|über|nach|vor)\s+(dem|der|den|denen|dessen|deren)\s(?![^.!?]*\bzu \w+)/.test(t),
  ],
  ['Dativ / Genitiv relative pronoun (Unit 29)', t => /,\s*(dem|denen|dessen|deren)\s/.test(t)],
  [
    'verb + obligatory preposition (Unit 28)',
    t =>
      /\b(sich ärgern über|denken an|sich kümmern um|Angst vor|hält von|halten von|diskutieren über|sich freuen|abhängen von|teilnehmen an|sich interessieren für|bestehen aus|sich bewerben um|nachdenken über|berichten über)\b|\b(warte|wartest|wartet) auf\b|\b(denke|denkt) an\b|\b(spreche|spricht) über\b|\b(träume|träumt) von\b|\b(glaube|glaubt) an\b/i.test(
        t,
      ),
  ],
  [
    'receptive constructions of Units 22–23 (ohne … zu, einerseits)',
    t => /\bohne\b|einerseits|andererseits|nicht nur|sondern auch/i.test(t),
  ],
  ['Partizip I as adjective (receptive, Unit 26)', t => /\b(steigend|fallend|laufend|wachsend)(e|en|er|es|em)\b/i.test(t)],
  [
    'legal claims and legal vocabulary (the unit makes no statement of consumer law)',
    t => /Gesetz|gesetzlich|rechtlich|Verbraucherrecht|Rechtsanspruch|Anwalt|Klage\b|\bBGB\b|Recht auf/i.test(t),
  ],
]

describe('identity and integration (B1 is a Beta for ru and ky)', () => {
  it('the unit equals its approved plan entry', () => {
    const plan = B1_UNIT_PLAN.find(p => p.id === 27)!
    expect(UNIT_27).toMatchObject({ id: 27, key: plan.key, title: plan.titleDe, level: 'B1' })
    expect(plan.key).toBe('b1-konsum-reklamation')
    expect(plan.titleDe).toBe('Konsum, Geld und Reklamation')
    expect(UNIT_27.grammarIds).toEqual(CONCEPTS)
  })
  it('the content module holds Unit 27 after Units 21–26, wired into the metadata, the tests, the final tests and the speaking list', () => {
    expect(B1_CONTENT.units.map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_META.map(m => m.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.tests).toContainEqual(UNIT_27_TEST)
    expect(B1_CONTENT.unitSpeaking.slice(0, 7).at(-1)).toBe('b1-sp-27-01')
    expect(B1_CONTENT.finalTests.map(f => f.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
  })
  it('B1 is a Beta: released for ru and ky only, offered to those interfaces and never to the German one', () => {
    expect(courseLevel('B1')).toMatchObject({ status: 'beta', releasedLocales: ['ru', 'ky'] })
    for (const lang of ['ru', 'ky'] as const) expect(availableLevels(lang)).toContain('B1')
    expect(availableLevels('de')).not.toContain('B1')
  })
  it('registered in the catalog, the unit is reachable through the standard selectors; the main writing task comes first; the Writing Lab list holds both tasks', () => {
    registerLevelContent('B1', B1_CONTENT)
    expect(vocabularyForUnit(27)).toHaveLength(40)
    expect(grammarForUnit(27).map(g => g.id)).toEqual(CONCEPTS)
    expect(finalTestOfUnit(27)?.questions).toHaveLength(15)
    expect(topicTestOfUnit(27)).toMatchObject({ id: 'unit-27', level: 'B1', size: 15 })
    expect(speakingForUnit(27)).toBe('b1-sp-27-01')
    expect(writingForUnit(27).map(w => w.id)).toEqual(['b1-wr-27-01', 'b1-wr-27-02'])
    const lab = writingOf('B1').map(w => w.id)
    for (const id of ['b1-wr-27-01', 'b1-wr-27-02']) expect(lab).toContain(id)
  })
})

describe('grammar: only the two approved concepts', () => {
  it('exactly the approved ids, in order, owned by Unit 27, level B1', () => {
    expect(UNIT_27_GRAMMAR.map(g => g.id)).toEqual(CONCEPTS)
    for (const g of UNIT_27_GRAMMAR) expect(g).toMatchObject({ unit: 27, level: 'B1' })
    expect(B1_CURRICULUM.units.find(u => u.unit === 27)!.concepts.map(c => c.id)).toEqual(CONCEPTS)
  })
  it('every concept is complete: explanation, 5 examples, mistakes, real-life, dialogue, speaking prompt — in Russian and in Kyrgyz', () => {
    for (const g of UNIT_27_GRAMMAR) {
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
  it('the why-notes: two on Konjunktiv II and two on the Genitiv', () => {
    expect(UNIT_27_WHY_NOTES.map(n => n.conceptId)).toEqual([CONCEPTS[0], CONCEPTS[0], CONCEPTS[1], CONCEPTS[1]])
  })
  it('the examples really show their concept: wenn + hätte/wäre … würde, a wish, könnten/würden Sie; wegen/trotz/während/statt + des/der/eines', () => {
    const k = UNIT_27_GRAMMAR[0].examples.map(x => x.de)
    expect(k[0]).toMatch(/^Wenn [^,]*\bhätte\b, würde /)
    expect(k[1]).toMatch(/^Wenn [^,]*\bwäre\b, würde /)
    expect(k[2]).toMatch(/^Ich wünschte, ich hätte /)
    expect(k[3]).toMatch(/^Könnten Sie /)
    expect(k[4]).toMatch(/^Würden Sie /)
    for (const x of UNIT_27_GRAMMAR[1].examples)
      expect(x.de, x.de).toMatch(/\b(Wegen|Trotz|Während|Statt|wegen|trotz|während|statt) (des|der|eines|einer) /)
    const forms = UNIT_27_GRAMMAR[1].examples.map(x => x.focus ?? '').join(' ')
    for (const f of ['maskulin', 'Plural', 'neutral', 'feminin']) expect(forms, f).toContain(f)
  })
  it('every "mistake" really differs from its correction, and the wrong form never appears in the taught texts', () => {
    for (const g of UNIT_27_GRAMMAR) for (const m of g.mistakes) expect(m.wrong).not.toBe(m.right)
    const wrong = UNIT_27_GRAMMAR.flatMap(g => g.mistakes.map(m => m.wrong))
    for (const t of taught()) expect(wrong.includes(t), t).toBe(false)
  })
  it('scope guard: nothing that belongs to a later unit or is receptive-only (Konjunktiv II of the past, Genitiv attribute, statt … zu, Dativ after wegen, other Genitiv prepositions, legal claims …)', () => {
    for (const t0 of taught())
      for (const [name, test] of FORBIDDEN) {
        const t = t0.replace(/Liebe[rn]? \w+, /g, '')
        expect(test(t), `${name}: "${t.slice(0, 90)}"`).toBe(false)
      }
  })
  it('REGRESSION of the scope guard: genuine out-of-scope German IS still detected, and the allowed Genitiv phrases are not flagged', () => {
    const bad: [string, string][] = [
      ['damit (Unit 30)', 'Ich lerne viel, damit ich besser spreche.'],
      ['Passiv Perfekt (receptive in Unit 24 only)', 'Die Heizung ist erneuert worden.'],
      ['Konjunktiv I / indirect speech in the subjunctive (B2)', 'Er sagt, er sei krank.'],
      ['Konjunktiv II of the past (receptive, Unit 31)', 'Ich wäre gestern gern ins Kino gegangen.'],
      ['als ob (B2)', 'Er tut so, als ob er krank wäre.'],
      ['colloquial würde inside a wenn clause (the unit teaches hätte / wäre / könnte there)', 'Wenn ich mehr Zeit haben würde, käme ich.'],
      ['Konjunktiv II modals outside the approved forms (müsste, dürfte, wollte)', 'Ich müsste das Gerät zurückgeben.'],
      ['wegen/trotz/während/statt + Dativ (colloquial, not taught)', 'Wegen dem Defekt rufe ich an.'],
      ['statt … zu with an infinitive (receptive, Unit 23)', 'Statt zu warten, rufe ich an.'],
      ['other Genitiv prepositions (closed list: wegen, trotz, während, statt)', 'Innerhalb einer Woche kommt das Paket.'],
      ['Genitiv attribute (Unit 29)', 'Die Qualität des Produkts ist gut.'],
      ['Genitiv attribute (Unit 29)', 'Der Preis der Rechnung ist falsch.'],
      ['relative clause with a preposition (Unit 29)', 'Das ist der Mann, mit dem ich gesprochen habe.'],
      ['Dativ / Genitiv relative pronoun (Unit 29)', 'Das ist der Mann, dem ich geholfen habe.'],
      ['verb + obligatory preposition (Unit 28)', 'Ich warte auf den Bus.'],
      ['receptive constructions of Units 22–23 (ohne … zu, einerseits)', 'Er geht, ohne sich zu verabschieden.'],
      ['Partizip I as adjective (receptive, Unit 26)', 'Die steigenden Preise sind ein Problem.'],
      ['legal claims and legal vocabulary (the unit makes no statement of consumer law)', 'Laut Gesetz muss der Shop das Geld erstatten.'],
    ]
    for (const [name, text] of bad) expect(FORBIDDEN.find(([n]) => n === name)![1](text), `${name}: "${text}" must be detected`).toBe(true)
    const ok: string[] = [
      'Wegen des Defekts rufe ich an.',
      'Trotz der hohen Versandkosten bestelle ich dort.',
      'Während der Öffnungszeiten ist der Kundendienst erreichbar.',
      'Statt eines Geschenks bekomme ich einen Gutschein.',
      'Ich bin bei der Bank.',
      'Bei der Kontoführung gibt es keine Gebühr.',
      'Wenn ich du wäre, würde ich das Gerät zurückgeben.',
      'Es wäre gut, mit dem Hausarzt zu sprechen.',
    ]
    for (const text of ok) for (const [name, test] of FORBIDDEN) expect(test(text), `${name}: "${text}" must NOT be flagged`).toBe(false)
  })
  it('`statt` is only ever the Genitiv preposition (statt + des/der/eines/einer); `statt … zu` is not taught, and Unit 23 keeps it receptive only up to Unit 26', () => {
    for (const t of taught()
      .flatMap(sentences)
      .filter(x => /\bstatt\b/i.test(x)))
      expect(t, t).toMatch(/\bstatt (des|der|eines|einer|___) /i)
    const unit23 = B1_META.find(m => m.unit === 23)!.concepts[1].constructions!
    expect(unit23.find(c => c.forms.includes('statt'))).toMatchObject({ proficiency: 'R', receptiveThrough: 26 })
    expect(unit23.find(c => c.forms.includes('ohne'))!.receptiveThrough).toBeUndefined()
  })
  it('Genitiv is LIMITED to the four prepositions: every Genitiv article after wegen / trotz / während / statt, and none after any other word of the unit', () => {
    const all = taught().join(' ')
    for (const p of ['wegen', 'trotz', 'während', 'statt']) expect(all.toLowerCase(), p).toContain(p)
    expect(META.concepts[1].closedList).toEqual(['wegen', 'trotz', 'während', 'statt'])
  })
  it('the productive constructions are really used in the texts: wenn … hätte/wäre … würde, Ich wünschte, Könnten/Würden Sie, Ich würde gern, and the four Genitiv prepositions with des / der / eines', () => {
    const all = germanTexts().join(' ')
    expect(all).toMatch(/\bWenn [^.!?]*\bhätte\b[^.!?]*, würde /)
    expect(all).toMatch(/\bWenn [^.!?]*\bwäre\b[^.!?]*, würde /)
    expect(all).toMatch(/\bIch wünschte, ich hätte\b/)
    expect(all).toMatch(/\bKönnten Sie\b/)
    expect(all).toMatch(/\bWürden Sie\b/)
    expect(all).toMatch(/\bIch würde gern\b/)
    for (const re of [
      /[Ww]egen des \w+s\b/,
      /[Ww]egen der \w+/,
      /[Tt]rotz des \w+s\b/,
      /[Tt]rotz der \w+/,
      /[Ww]ährend der \w+/,
      /[Ww]ährend des \w+s\b/,
      /[Ss]tatt eines \w+s\b/,
      /[Ww]egen eines \w+s\b/,
    ])
      expect(all, String(re)).toMatch(re)
  })
})

describe('consumer safety: everything fictional, shop rules are not law, complaint / reply / general remark are kept apart', () => {
  it('every reading and listening is labelled as invented; the speaking scenario and the writing tasks say so in the learner’s language', () => {
    for (const r of UNIT_27_READING) expect(`${r.title} ${r.body.join(' ')}`, r.id).toMatch(/erfunden|Erfundene|erfundenen/)
    for (const l of UNIT_27_LISTENING) expect(l.title, l.id).toMatch(/erfunden/)
    expect(UNIT_27_SPEAKING[0].goal.ru).toMatch(/вымышлен/)
    expect(UNIT_27_SPEAKING[0].goal.ky).toMatch(/ойдон чыгарылган/)
    expect(MAIN.situation.ru).toMatch(/вымышлен/)
    expect(MAIN.situation.ru).toMatch(/не является юридическим/)
    expect(MAIN.situation.ky).toMatch(/ойдон чыгарылган/)
    expect(MAIN.situation.ky).toMatch(/юридикалык документ эмес/)
  })
  it('no real shop, bank, brand or product is named', () => {
    const all = germanTexts().join(' ')
    expect(all).not.toMatch(
      /Amazon|Zalando|Otto\b|Ikea|MediaMarkt|Saturn|Apple|Samsung|PayPal|Visa|Mastercard|Sparkasse|Volksbank|Commerzbank|Deutsche Bank|ING|N26|Klarna|eBay|Aldi|Lidl|Rewe/,
    )
    expect(all).toMatch(/Technikhaus Nord|Stadtbank/)
  })
  it('shop rules are attributed to the fictional shop (Bei uns / In diesem Laden / In diesem Shop), never stated as general rules', () => {
    for (const s of taught()
      .flatMap(sentences)
      .filter(x => /vierzehn Tage|14 Tage|zwei Wochen lang/.test(x)))
      expect(s, s).toMatch(/Bei uns|In diesem (Laden|Shop)/)
    expect(MAIN.tips.map(t => t.ru).join(' ')).toMatch(/без юридических утверждений/)
    expect(MAIN.tips.map(t => t.ky).join(' ')).toMatch(/юридикалык ырастоосуз/)
  })
  it('roles are separated: the complaint (Frau Krüger / Kunde / Beschwerdebrief), the seller’s reply (Herr Lang, Frau Moll, Händler) and the review are different speakers or labelled sections', () => {
    expect(new Set(UNIT_27_LISTENING[0].lines.map(x => x.speaker))).toEqual(new Set(['Herr Lang', 'Frau Krüger']))
    expect(new Set(UNIT_27_LISTENING[1].lines.map(x => x.speaker))).toEqual(new Set(['Frau Moll', 'Herr Arslan']))
    expect(UNIT_27_READING[0].body[0]).toMatch(/^Kundenbewertung/)
    expect(UNIT_27_READING[0].body[1]).toMatch(/^Beschwerdebrief/)
    expect(UNIT_27_SPEAKING[0].turns[3].ai).toMatch(/Bei uns ist der Umtausch/)
  })
  it('the complaint stays polite and asks for a reasonable solution: Konjunktiv II request, a named solution (Ersatz / Erstattung) and a deadline', () => {
    expect(MAIN.model).toMatch(/Könnten Sie mir bitte/)
    expect(MAIN.model).toMatch(/Ersatz schicken oder den Betrag .* erstatten/)
    expect(MAIN.model).toMatch(/bis nächsten Freitag/)
    expect(MAIN.model).not.toMatch(/!/)
    expect(MAIN.model).not.toMatch(/\bmuss\b|\bverlange ich\b|\bfordere\b/)
  })
})

describe('vocabulary: 40 new items, none already taught', () => {
  const b = fullBundle()
  const earlier = new Set(b.vocabulary.filter(v => v.unit <= 26).flatMap(v => lemmaKeys(v.de)))
  it('exactly 40 items (target 38–42), ids v27-1 … v27-40, unique across the whole B1 vocabulary', () => {
    expect(UNIT_27_VOCABULARY).toHaveLength(40)
    expect(UNIT_27_VOCABULARY.map(v => v.id)).toEqual(Array.from({ length: 40 }, (_, i) => `v27-${i + 1}`))
    expect(UNIT_27_VOCABULARY.every(v => v.unit === 27)).toBe(true)
    const ids = B1_CONTENT.vocabulary.map(v => v.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toHaveLength(480)
  })
  it('no lemma repeats an A1, A2 or earlier B1 headword (the A2 shopping words are NOT repeated), and none is listed twice', () => {
    const keys = UNIT_27_VOCABULARY.flatMap(v => lemmaKeys(v.de))
    expect(keys.filter(k => earlier.has(k))).toEqual([])
    expect(new Set(keys).size).toBe(keys.length)
    const de = UNIT_27_VOCABULARY.map(v => v.de)
    for (const known of [
      'Angebot',
      'Preis',
      'Rechnung',
      'Quittung',
      'Kunde',
      'Konto',
      'Überweisung',
      'Lieferung',
      'Paket',
      'Bank',
      'umtauschen',
      'bestellen',
      'kaufen',
      'vergleichen',
      'kündigen',
      'Kredit',
    ])
      expect(de).not.toContain(known)
  })
  it('every item has article/plural where a noun, a German example, and independent Russian and Kyrgyz translations of the word and the example', () => {
    for (const v of UNIT_27_VOCABULARY) {
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
    const ex = UNIT_27_VOCABULARY.map(v => v.example)
    expect(new Set(ex).size).toBe(ex.length)
  })
  it('the planned themes are present (complaint, bank, shopping, budget), `Kredit` is receptive only, and no verb needs a prepositional object', () => {
    const de = UNIT_27_VOCABULARY.map(v => v.de)
    for (const w of [
      'Reklamation',
      'Garantie',
      'Umtausch',
      'Gebühr',
      'Dauerauftrag',
      'Mobilfunkvertrag',
      'Bestellung',
      'Kreditkarte',
      'Budget',
      'Preisvergleich',
      'Rabatt',
      'kulant',
      'reklamieren',
      'erstatten',
      'zurückgeben',
      'sparen',
      'stornieren',
    ])
      expect(de, w).toContain(w)
    for (const v of UNIT_27_VOCABULARY.filter(x => x.pos === 'verb'))
      expect(`${v.ru} ${v.ky}`, v.de).not.toMatch(/\((an|über|auf|von|für|mit|um|vor) /)
    const withKredit = [...UNIT_27_READING, ...UNIT_27_LISTENING].filter(r =>
      /\bKredit\b/.test(JSON.stringify(r).replace(/Kreditkarte/g, '')),
    )
    expect(withKredit.map(r => r.id)).toEqual(['b1-re-27-02'])
    expect(UNIT_27_READING[1].gloss.some(g => g.word === 'der Kredit')).toBe(true)
    const production = [
      ...UNIT_27_EXERCISES.flatMap(e => [e.prompt, e.answer, ...(e.options ?? []), ...(e.words ?? [])]),
      ...UNIT_27_FINAL.flatMap(q => [q.prompt, q.answer, ...q.options]),
      ...UNIT_27_WRITING.flatMap(w => [w.model, ...w.mustInclude.flatMap(m => [m.label, ...m.patterns])]),
      ...UNIT_27_SPEAKING.flatMap(s => s.turns.flatMap(t => [t.ai, ...t.hints, ...t.keywords])),
    ]
    for (const t of production) expect(t.replace(/Kreditkarte/g, ''), t).not.toMatch(/\bKredit\b/i)
  })
  it('Wortbildung strand: -ung, -er, compounds and zurück- are present as items and explained in the metadata in three languages', () => {
    const de = UNIT_27_VOCABULARY.map(v => v.de)
    for (const w of [
      'Reklamation',
      'Bestellung',
      'Zahlung',
      'Erstattung',
      'Verbraucher',
      'Händler',
      'Mobilfunkvertrag',
      'Kaufbeleg',
      'zurückgeben',
      'zurückzahlen',
    ])
      expect(de, w).toContain(w)
    const n = META.strands.wortbildungNote!
    expect(n.de && n.ru && n.ky).toBeTruthy()
    expect(n.ky).not.toBe(n.ru)
    for (const w of ['-ung', '-er', 'Mobilfunkvertrag', 'zurück-']) expect(n.de).toContain(w)
  })
  it('the unit REUSES established shopping and money words as revision in its texts without listing them as new', () => {
    const all = germanTexts().join(' ')
    for (const w of ['Preis', 'Rechnung', 'Konto', 'Bank', 'Miete', 'Gehalt', 'Paket|Lieferung|geliefert', 'bestell', 'Kaufbeleg'])
      expect(all, w).toMatch(new RegExp(w))
  })
})

describe('texts: progressive targets (band for Units 27–29 and the curriculum text for Unit 27)', () => {
  it('2 readings of 130–170 words and 2 listening scripts of 130–160 words', () => {
    expect(UNIT_27_READING).toHaveLength(2)
    expect(UNIT_27_LISTENING).toHaveLength(2)
    for (const r of UNIT_27_READING) {
      const n = r.body.reduce((a, p) => a + words(p), 0)
      expect(n, r.id).toBeGreaterThanOrEqual(130)
      expect(n, r.id).toBeLessThanOrEqual(170)
    }
    for (const l of UNIT_27_LISTENING) {
      const n = l.lines.reduce((a, x) => a + words(x.text), 0)
      expect(n, l.id).toBeGreaterThanOrEqual(130)
      expect(n, l.id).toBeLessThanOrEqual(160)
    }
  })
  it('sentences stay short (95th percentile ≤ 20, longest ≤ 25 words)', () => {
    const lens = [
      ...UNIT_27_READING.flatMap(r => r.body.flatMap(sentences)),
      ...UNIT_27_LISTENING.flatMap(l => l.lines.flatMap(x => sentences(x.text))),
    ]
      .map(words)
      .sort((a, b) => a - b)
    expect(lens[lens.length - 1]).toBeLessThanOrEqual(25)
    expect(lens[Math.ceil(0.95 * lens.length) - 1]).toBeLessThanOrEqual(20)
  })
  it('every dialogue line carries a Russian and a Kyrgyz translation; questions have 3 distinct options, exactly one correct; answer positions vary', () => {
    for (const l of UNIT_27_LISTENING) for (const x of l.lines) expect(x.ru && x.ky && x.ky !== x.ru).toBeTruthy()
    const qs = [...UNIT_27_LISTENING.flatMap(l => l.questions), ...UNIT_27_READING.flatMap(r => r.questions)]
    for (const q of qs) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options).size).toBe(3)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(3)
    }
    expect(new Set(qs.map(q => q.answer)).size).toBe(3)
    expect(new Set(UNIT_27_READING.flatMap(r => r.questions.map(q => q.answer))).size).toBe(3)
    expect(new Set(UNIT_27_LISTENING.flatMap(l => l.questions.map(q => q.answer))).size).toBe(3)
  })
  it('the listening keywords all have a gloss in the unit vocabulary', () => {
    const de = new Set(UNIT_27_VOCABULARY.map(v => v.de))
    for (const l of UNIT_27_LISTENING) for (const k of l.keywords) expect(de.has(k), `${l.id}: ${k}`).toBe(true)
  })
  it('the listening dialogues are coherent: they open with the shop / bank greeting and close with a closing line; the seller refuses first and then finds a solution (unexpected element)', () => {
    expect(UNIT_27_LISTENING[0].lines[0].text).toMatch(/Technikhaus Nord/)
    expect(UNIT_27_LISTENING[0].lines.at(-1)!.text).toMatch(/Auf Wiedersehen/)
    expect(UNIT_27_LISTENING[1].lines[0].text).toMatch(/Stadtbank/)
    expect(UNIT_27_LISTENING[1].lines.at(-1)!.text).toMatch(/Auf Wiedersehen/)
    const l1 = UNIT_27_LISTENING[0].lines.map(x => x.text)
    expect(l1.findIndex(t => /Leider können wir ihn nicht umtauschen/.test(t))).toBeLessThan(
      l1.findIndex(t => /den Staubsauger ersetzen können/.test(t)),
    )
    const l2 = UNIT_27_LISTENING[1].lines.map(x => x.text)
    expect(l2.findIndex(t => /nicht möglich/.test(t))).toBeLessThan(l2.findIndex(t => /die Hälfte erstatten/.test(t)))
  })
  it('the listening answer keys agree with the script (every correct option is supported by the text, no distractor is)', () => {
    const l1 = UNIT_27_LISTENING[0].lines.map(x => x.text).join(' ')
    const q1 = UNIT_27_LISTENING[0].questions
    expect(q1.map(q => q.options[q.answer])).toEqual([
      'Der Staubsauger ist kaputt.',
      'Vierzehn Tage.',
      'Der Chef von Herrn Lang.',
      'Den Kaufbeleg.',
    ])
    expect(l1).toMatch(/Wegen eines Defekts funktioniert er nicht mehr/)
    expect(l1).toMatch(/nur vierzehn Tage lang möglich/)
    expect(l1).toMatch(/Mein Chef sagt, dass wir den Staubsauger ersetzen können/)
    expect(l1).toMatch(/Kaufbeleg per E-Mail/)
    expect(l1).not.toMatch(/sieben Tage|dreißig Tage|zu viel bezahlt/)
    const l2 = UNIT_27_LISTENING[1].lines.map(x => x.text).join(' ')
    const q2 = UNIT_27_LISTENING[1].questions
    expect(q2.map(q => q.options[q.answer])).toEqual([
      'Zehn Euro.',
      'Bei Zahlungen im Ausland mit der Kreditkarte.',
      'Die Hälfte.',
      'Den Dauerauftrag.',
    ])
    expect(l2).toMatch(/Gebühr von zehn Euro/)
    expect(l2).toMatch(/bei Zahlungen mit der Kreditkarte im Ausland/i)
    expect(l2).toMatch(/die Hälfte erstatten/)
    expect(l2).toMatch(/den Dauerauftrag für meine Miete zu ändern/)
  })
  it('the reading answer keys agree with the text', () => {
    const [r1, r2] = UNIT_27_READING
    const t1 = r1.body.join(' ')
    expect(r1.questions.map(q => q.options[q.answer])).toEqual(['Er war defekt.', 'steht nicht im Text', 'Wieder dort kaufen.'])
    expect(t1).toMatch(/schon nach drei Tagen defekt/)
    expect(t1).toMatch(/das Gerät zu ersetzen oder mir den Betrag von 49 Euro zu erstatten/)
    expect(t1).toMatch(/Wenn der Preis niedriger wäre, würde ich wieder dort kaufen/)
    const t2 = r2.body.join(' ')
    expect(r2.questions.map(q => q.options[q.answer])).toEqual(['Per Lastschrift.', 'Wegen der hohen Mieten.', 'richtig'])
    expect(t2).toMatch(/Handyrechnung wird per Lastschrift abgebucht/)
    expect(t2).toMatch(/Wegen der hohen Mieten bleibt am Ende wenig übrig/)
    expect(t2).toMatch(/Ich wünschte, ich hätte mehr Zeit für den Preisvergleich/)
  })
  it('the reading glosses give Russian and Kyrgyz for every word, independently', () => {
    for (const r of UNIT_27_READING) for (const g of r.gloss) expect(g.ky).not.toBe(g.ru)
    for (const r of UNIT_27_READING) for (const g of r.gloss) expect(g.grammarKy).not.toBe(g.grammar)
  })
  it('listening uses the existing browser text-to-speech lab: no audio file, no claim of verified playback; no assessment item depends on audio', () => {
    for (const l of UNIT_27_LISTENING) expect(Object.keys(l)).not.toContain('audio')
    for (const q of UNIT_27_FINAL) expect(q.skill).not.toBe('listening')
  })
  it('speaking: one scenario of 6 turns (complain and negotiate); the seller refuses in turn 4 (unexpected element) and the hints practise polite insisting with trotz / Konjunktiv II', () => {
    const [s] = UNIT_27_SPEAKING
    expect(s.turns).toHaveLength(6)
    expect(s.level).toBe('B1')
    for (const t of s.turns) {
      expect(t.aiRu && t.aiKy).toBeTruthy()
      expect(t.hints.length).toBeGreaterThanOrEqual(3)
      expect(t.keywords.length).toBeGreaterThanOrEqual(3)
      for (const k of t.keywords) expect(k).toBe(k.toLowerCase())
    }
    expect(s.turns[3].ai).toMatch(/Leider ist das nicht möglich/)
    expect(s.turns[3].hints.join(' ')).toMatch(/Trotz der Frist/)
    expect(s.turns[3].hints.join(' ')).toMatch(/Könnten Sie das bitte noch einmal prüfen/)
    expect(s.turns[2].hints.join(' ')).toMatch(/Ich würde gern/)
    expect(s.turns[2].hints.join(' ')).toMatch(/Könnten Sie mir bitte/)
    expect(s.titleRu && s.titleKy).toBeTruthy()
  })
})

describe('writing: the formal complaint and the opinion micro-task, both discoverable', () => {
  it('main task: formal, 80 words minimum, seven expected elements, a model that meets every one, with a Genitiv preposition and Konjunktiv II', () => {
    expect(MAIN).toMatchObject({ id: 'b1-wr-27-01', minWords: 80, level: 'B1', unit: 27, formal: true })
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
    expect(MAIN.model).toMatch(/^Sehr geehrte Damen und Herren/)
    expect(MAIN.model).toMatch(/Mit freundlichen Grüßen/)
    expect(MAIN.model).toMatch(/\b(Wegen|Trotz|Während|Statt) (des|der|eines|einer) /)
    expect((MAIN.model.match(/\b(Könnten|könnten|wäre|würde|würden)\b/g) ?? []).length).toBeGreaterThanOrEqual(2)
    expect(MAIN.model).not.toMatch(/\bdu\b|\bdir\b|\bdein/i)
    for (const t of MAIN.tips) expect(t.ky).not.toBe(t.ru)
  })
  it('the opinion micro-task (kind "meinung"): opinion + reason + a word of the topic; its model meets every element and is balanced', () => {
    expect(MICRO).toMatchObject({ id: 'b1-wr-27-02', minWords: 30, level: 'B1', unit: 27, formal: false })
    expect(META.microTasks).toEqual([{ kind: 'meinung', taskId: 'b1-wr-27-02' }])
    expect(words(MICRO.model)).toBeGreaterThanOrEqual(30)
    expect(MICRO.mustInclude).toHaveLength(3)
    for (const m of MICRO.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky && m.explain.ky !== m.explain.ru).toBeTruthy()
      expect(
        m.patterns.some(p => MICRO.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(MICRO.model).toMatch(/\bIch finde\b/)
    expect(MICRO.model).toMatch(/\bdenn\b|\bweil\b/)
    expect(MICRO.situation.ru).toMatch(/плюсы, и минусы|плюсы и минусы/)
  })
  it('NO required writing task is omitted: the curriculum asks for one main writing task and one opinion micro-task for Unit 27 (no mediation task), and the unit has exactly those', () => {
    const spec = B1_CURRICULUM.units.find(u => u.unit === 27)!.requires
    expect(spec.meinungMicroTask).toBe(true)
    expect(spec.mediationMicroTask).toBe(false)
    expect(UNIT_27_WRITING.map(w => w.id)).toEqual(['b1-wr-27-01', 'b1-wr-27-02'])
    expect(new Set(META.microTasks!.map(t => t.kind))).toEqual(new Set(['meinung']))
  })
  it('discoverability: every writing task of the unit is in the catalog list of the Writing Lab, and exactly one (the first) is the unit page’s main row while the rest get an extra row', () => {
    registerLevelContent('B1', B1_CONTENT)
    const lab = writingOf('B1').filter(w => w.unit === 27)
    expect(lab.map(w => w.id)).toEqual(UNIT_27_WRITING.map(w => w.id))
    expect(writingForUnit(27)[0].id).toBe('b1-wr-27-01')
    expect(
      writingForUnit(27)
        .slice(1)
        .map(w => w.id),
    ).toEqual(['b1-wr-27-02'])
  })
  it('the writing tips tell the learner that the app checks only length and expected words and that quality is self-assessed (all tasks)', () => {
    for (const w of UNIT_27_WRITING) {
      expect(w.tips.map(t => t.ru).join(' ')).toMatch(/только объём и ожидаемые слова/)
      expect(w.tips.map(t => t.ky).join(' ')).toMatch(/көлөмдү жана күтүлгөн сөздөрдү гана/)
    }
  })
})

describe('exercises: answer keys are correct and unique', () => {
  it('10 handwritten exercises: 8 on the two concepts (4 + 4) + 2 recycled without a concept; types fill / choice / order; both languages everywhere', () => {
    expect(UNIT_27_EXERCISES).toHaveLength(10)
    expect(UNIT_27_EXERCISES.map(e => e.id)).toEqual(Array.from({ length: 10 }, (_, i) => `b1-ex-27-${String(i + 1).padStart(2, '0')}`))
    const withConcept = UNIT_27_EXERCISES.filter(e => e.concept)
    expect(withConcept).toHaveLength(8)
    expect(CONCEPTS.map(c => withConcept.filter(e => e.concept === c).length)).toEqual([4, 4])
    expect(UNIT_27_EXERCISES.filter(e => !e.concept).map(e => e.id)).toEqual(['b1-ex-27-09', 'b1-ex-27-10'])
    expect(['fill', 'choice', 'order'].map(t => UNIT_27_EXERCISES.filter(e => e.type === t).length)).toEqual([4, 4, 2])
    for (const e of UNIT_27_EXERCISES) {
      expect(e.why.ru && e.why.ky).toBeTruthy()
      expect(e.why.ky).not.toBe(e.why.ru)
      expect(e.promptRu && e.promptKy, e.id).toBeTruthy()
    }
  })
  it('every choice / fill item: 3 distinct options and the answer is among them exactly once; every order item is a true permutation that is not pre-solved', () => {
    for (const e of UNIT_27_EXERCISES) {
      if (e.type === 'order') {
        expect([...(e.words ?? [])].sort().join('|')).toBe(e.answer.split(' ').sort().join('|'))
        expect(e.words!.join(' ')).not.toBe(e.answer)
      } else {
        expect(e.options).toHaveLength(3)
        expect(new Set(e.options).size).toBe(3)
        expect(e.options!.filter(o => o === e.answer)).toHaveLength(1)
      }
    }
    for (const e of UNIT_27_EXERCISES.filter(x => x.type === 'fill')) expect(e.prompt.match(/___/g)).toHaveLength(1)
  })
  it('the text-level item (ex 04): three sentences per option, exactly one correct, and the wrong ones each contain a real learner error', () => {
    const e = UNIT_27_EXERCISES.find(x => x.id === 'b1-ex-27-04')!
    for (const o of e.options!) expect(sentences(o)).toHaveLength(3)
    const wrong = e.options!.filter(o => o !== e.answer)
    expect(wrong.some(o => /Ich wünschte, ich habe/.test(o))).toBe(true)
    expect(wrong.some(o => /, ich würde sparen/.test(o))).toBe(true)
    expect(e.answer).not.toMatch(/ich habe mehr|, ich würde/)
  })
  it('the exercises really use their construction in the answer, and the Genitiv items use only the four prepositions', () => {
    const by = (id: string) => UNIT_27_EXERCISES.find(e => e.id === id)!
    expect(by('b1-ex-27-01').answer).toBe('hätte')
    expect(by('b1-ex-27-02').answer).toMatch(/wäre, würde ich/)
    expect(by('b1-ex-27-03').answer).toMatch(/^Könnten Sie .* erstatten\?$/)
    expect(by('b1-ex-27-05').answer).toBe('des')
    expect(by('b1-ex-27-06').answer).toMatch(/^Trotz des Regens/)
    expect(by('b1-ex-27-07').answer).toMatch(/^Während der Öffnungszeiten/)
    expect(by('b1-ex-27-08').answer).toBe('eines')
    for (const e of UNIT_27_EXERCISES.filter(x => x.concept === 'b1-genitiv-praepositionen'))
      expect(e.prompt + e.answer, e.id).toMatch(/Wegen|Trotz|Während|Statt|wegen|trotz|während|statt/)
  })
})

describe('final test: structure, answer keys and scoring data', () => {
  it('15 questions = 8 grammar (3 Konjunktiv II, 3 Genitiv, 2 recycled ↻) + 3 vocabulary + 4 reading, no listening; ≥ 2 gap-fill', () => {
    expect(UNIT_27_FINAL.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `b1-ft-27-${String(i + 1).padStart(2, '0')}`))
    const by = (s: string) => UNIT_27_FINAL.filter(q => q.skill === s)
    expect([by('grammar').length, by('vocabulary').length, by('reading').length, by('listening').length]).toEqual([8, 3, 4, 0])
    expect(by('grammar').filter(q => /___/.test(q.prompt)).length).toBeGreaterThanOrEqual(2)
    expect(CONCEPTS.map(c => by('grammar').filter(q => q.concept === c).length)).toEqual([3, 3])
    expect(
      by('grammar')
        .filter(q => q.concept && !CONCEPTS.includes(q.concept))
        .map(q => q.concept),
    ).toEqual(['b1-konjunktiv2-ratschlaege', 'b1-passiv-praesens'])
    expect(UNIT_27_TEST).toMatchObject({ id: 'unit-27', kind: 'topic', level: 'B1', unit: 27, size: 15 })
  })
  it('the recycled concepts really exist in earlier units (Units 25 and 24)', () => {
    const owner = new Map(fullBundle().grammar.map(g => [g.id, g.unit]))
    for (const q of UNIT_27_FINAL.filter(x => x.concept && !CONCEPTS.includes(x.concept)))
      expect(owner.get(q.concept!)! < 27, q.concept).toBe(true)
  })
  it('options: 3 distinct each, the answer appears exactly once, both languages with an explanation; positions are 5 / 5 / 5, never three in a row', () => {
    const pos: number[] = []
    for (const q of UNIT_27_FINAL) {
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
  it('the politeness question has exactly one polite request (Könnten Sie … bitte …?) among an order and a demand', () => {
    const q = UNIT_27_FINAL.find(x => x.id === 'b1-ft-27-02')!
    expect(q.options.filter(o => /^Könnten Sie .* bitte .*\?$/.test(o))).toEqual([q.answer])
    expect(q.options.filter(o => /!$/.test(o))).toHaveLength(1)
  })
  it('the Genitiv questions test form and ending: feminine/plural der, masculine des + -s, neuter -s', () => {
    expect(UNIT_27_FINAL.find(x => x.id === 'b1-ft-27-04')!.answer).toBe('der')
    expect(UNIT_27_FINAL.find(x => x.id === 'b1-ft-27-05')!.answer).toMatch(/des Einkaufs/)
    expect(UNIT_27_FINAL.find(x => x.id === 'b1-ft-27-06')!.answer).toBe('Wetters')
  })
  it('the final test shares no prompt (except the generic instruction line) and no answer with the revision exercises, and no prompt with another question', () => {
    const ex = new Set(UNIT_27_EXERCISES.flatMap(e => [e.prompt, e.answer]))
    const generic = new Set(['Welcher Satz ist richtig?', 'Bilde den Satz.'])
    for (const q of UNIT_27_FINAL) {
      if (!generic.has(q.prompt)) expect(ex.has(q.prompt), q.id).toBe(false)
      expect(ex.has(q.answer), q.id).toBe(false)
    }
    const prompts = UNIT_27_FINAL.map(q => q.prompt).filter(p => !generic.has(p))
    expect(new Set(prompts).size).toBe(prompts.length)
  })
  it('scoring data: every question has its answer among its options (a perfect run is 15/15) and the pass mark of the existing rule (70 %) is 11 of 15', () => {
    expect(UNIT_27_FINAL.filter(q => q.options.includes(q.answer)).length).toBe(15)
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
    expect(META.scenario.id).toBe('b1-sp-27-01')
    expect(META.strands.strategyNote!.de).toMatch(/höflich nachhaken/i)
  })
  it('the classification is the approved one: P/H and P-lim/M with the closed list of four prepositions; D-7 for the Genitiv prepositions is still OPEN', () => {
    expect(META.concepts.map(c => [c.conceptId, c.proficiency, c.load, c.role])).toEqual([
      ['b1-konjunktiv2-wuensche-irreal', 'P', 'H', 'new'],
      ['b1-genitiv-praepositionen', 'P-lim', 'M', 'new'],
    ])
    const spec = B1_CURRICULUM.units.find(u => u.unit === 27)!
    expect(spec.concepts[1].expertReview).toMatchObject({ status: 'pending', decision: 'D-7' })
    expect(spec.concepts[0].expertReview).toBeUndefined()
  })
  it('the topic "money-banking" is evidenced by real items of the unit', () => {
    const items = new Set([
      ...UNIT_27_VOCABULARY.map(v => v.id),
      ...UNIT_27_READING.map(r => r.id),
      ...UNIT_27_LISTENING.map(l => l.id),
      ...UNIT_27_EXERCISES.map(e => e.id),
      ...UNIT_27_WRITING.map(w => w.id),
      'b1-sp-27-01',
    ])
    expect(META.topics!.map(t => t.topic)).toEqual(['money-banking'])
    for (const t of META.topics!) {
      expect(t.itemIds.length).toBeGreaterThanOrEqual(5)
      for (const id of t.itemIds) expect(items.has(id), id).toBe(true)
    }
    const names = META.topics![0].itemIds.filter(id => id.startsWith('v27-')).map(id => UNIT_27_VOCABULARY.find(v => v.id === id)!.de)
    for (const n of ['Gebühr', 'Dauerauftrag', 'Lastschrift', 'Kreditkarte', 'Zahlung', 'Betrag', 'Schulden']) expect(names, n).toContain(n)
  })
  it('spaced revision: 4 words of Unit 26, 2 of Unit 24, 3 from A2 — real, existing vocabulary ids', () => {
    const vocab = new Map(fullBundle().vocabulary.map(v => [v.id, v.unit]))
    expect(META.revision!.fromPrevious.map(id => vocab.get(id))).toEqual([26, 26, 26, 26])
    expect(META.revision!.fromThirdBack.map(id => vocab.get(id))).toEqual([24, 24])
    expect(META.revision!.fromA2.length).toBeGreaterThanOrEqual(2)
    for (const id of META.revision!.fromA2) expect(vocab.get(id)! >= 11 && vocab.get(id)! <= 20, id).toBe(true)
  })
  it('the two kinds of vocabulary are kept apart: the 40 new items of Unit 27 vs. revision ids that are all earlier words', () => {
    const newIds = new Set(UNIT_27_VOCABULARY.map(v => v.id))
    const rev = [...META.revision!.fromPrevious, ...META.revision!.fromThirdBack, ...META.revision!.fromA2]
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
    walk(ALL_DATA(), 'unit27')
    expect(missing).toEqual([])
  })
  it('the Russian and the Kyrgyz are of comparable size (no half-translated string)', () => {
    const bad: string[] = []
    for (const v of UNIT_27_VOCABULARY) {
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
      'тактооч',
      'ээликтүү жөндөмө',
    ])
      expect(all, bad).not.toContain(bad)
  })
  it('every Kyrgyz string is written in Cyrillic (quoted German allowed) and the unit has a large Kyrgyz body', () => {
    const ky = kyTexts()
    expect(ky.length).toBeGreaterThan(250)
    expect(ky.filter(t => t.length > 25 && !/[А-Яа-яЁёҢңӨөҮү]/.test(t))).toEqual([])
  })
  it('the explanations of exercises and final-test questions differ between Russian and Kyrgyz', () => {
    for (const e of UNIT_27_EXERCISES) expect(e.why.ky).not.toBe(e.why.ru)
    for (const q of UNIT_27_FINAL) expect(q.why.ky).not.toBe(q.why.ru)
  })
})

describe('validator and assessment honesty', () => {
  it('the validator finds 0 errors and 0 warnings in the real bundle; the review flags of Unit 27 are exactly: missing human CEFR sign-off and the open decision D-7 for the Genitiv prepositions', () => {
    const is = validateContent(fullBundle())
    expect(is.filter(i => i.severity === 'error')).toEqual([])
    expect(is.filter(i => i.severity === 'warning')).toEqual([])
    expect(is.filter(i => i.rule.startsWith('b1-') && i.severity !== 'review')).toEqual([])
    expect(
      is
        .filter(i => i.where === 'units:27' && i.severity === 'review')
        .map(i => i.rule)
        .sort(),
    ).toEqual(['beta-review-pending', 'beta-review-pending', 'cefr-signoff-missing']) // + the Beta flags (ru, ky) since the B1 Beta launch
    expect(is.filter(i => i.where === 'grammar:b1-genitiv-praepositionen' && i.severity === 'review').map(i => i.rule)).toEqual([
      'b1-expert-review-pending',
    ])
    expect(
      is.filter(
        i =>
          /^(grammar:b1-konjunktiv2-wuensche|reading:b1-re-27|listening:b1-li-27|writing:b1-wr-27|vocabulary:v27)/.test(i.where) &&
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
    const all = JSON.stringify([UNIT_27_SPEAKING, UNIT_27_WRITING])
    expect(all).not.toMatch(/"(score|points|cefrScore|level_score)"/)
  })
  it('the provenance says the material is original, fictional where it reports transactions, not legal advice, and NOT reviewed', () => {
    for (const x of [...UNIT_27_GRAMMAR, ...UNIT_27_READING, ...UNIT_27_LISTENING, ...UNIT_27_SPEAKING, ...UNIT_27_WRITING]) {
      expect(x.source?.kind).toBe('authored')
      expect(x.source?.author).toMatch(/pending independent CEFR, Russian and Kyrgyz review/)
    }
  })
})
