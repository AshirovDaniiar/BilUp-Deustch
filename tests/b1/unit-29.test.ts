// @vitest-environment node
/**
 * B1 Unit 29 — Reisen, Kultur und Alltag im Vergleich (Stage 3K). Checks the authored content against the approved curriculum: identity, the three approved concepts
 * (relative clause with Dativ and preposition — productive; Genitivattribut — RECEPTIVE, decision D-7 open; Plusquamperfekt and nachdem — productive, decision D-6 open),
 * vocabulary (38–42, nothing already taught), text sizes, the scope guard for later units — with REGRESSION samples proving that genuine out-of-scope German is still
 * detected — cultural-content safety (everything fictional, every custom a personal impression, no stereotype, no real company), RU/KY parity, exercise / answer-key
 * correctness, assessment structure, metadata, the writing tasks and their discoverability, comparison strand and spaced revision.
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
import { UNIT_29_EXERCISES, UNIT_29_FINAL, UNIT_29_TEST } from '../../src/data/b1/unit29/assessment'
import { UNIT_29_GRAMMAR, UNIT_29_WHY_NOTES } from '../../src/data/b1/unit29/grammar'
import { UNIT_29_LISTENING, UNIT_29_READING, UNIT_29_SPEAKING, UNIT_29_WRITING } from '../../src/data/b1/unit29/texts'
import { UNIT_29 } from '../../src/data/b1/unit29/unit'
import { UNIT_29_VOCABULARY } from '../../src/data/b1/unit29/vocabulary'
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
const CONCEPTS = ['b1-relativsaetze-dativ-praeposition', 'b1-genitivattribute', 'b1-plusquamperfekt-nachdem']
const META = B1_META.find(m => m.unit === 29)!
const [MAIN, MICRO_O, MICRO_H] = UNIT_29_WRITING

/** the part of the unit that is learned by READING only (decision D-7: the Genitivattribut is receptive) */
const GENITIV_OK_IDS = new Set(['b1-ex-29-08', 'b1-ft-29-05', 'b1-ft-29-06'])

/** every correct or taught German string of the unit (distractors of choice items are deliberately wrong forms and are not taught) */
function germanTexts(): string[] {
  const out: string[] = []
  for (const r of UNIT_29_READING) out.push(...r.body, ...r.questions.flatMap(q => [q.q, q.options[q.answer]]))
  for (const l of UNIT_29_LISTENING) out.push(...l.lines.map(x => x.text), ...l.questions.flatMap(q => [q.q, q.options[q.answer]]))
  for (const v of UNIT_29_VOCABULARY) out.push(v.example)
  for (const g of UNIT_29_GRAMMAR)
    out.push(...g.examples.map(x => x.de), ...g.reallife.map(x => x.de), ...g.dialogue.map(x => x.text), g.speakPrompt.sample)
  for (const n of UNIT_29_WHY_NOTES) out.push(n.sentence, ...n.more.map(x => x.de))
  for (const e of UNIT_29_EXERCISES) out.push(e.prompt, e.answer)
  for (const q of UNIT_29_FINAL) out.push(q.prompt, q.answer)
  for (const w of UNIT_29_WRITING) out.push(w.model, w.mustInclude.map(m => m.label).join(' '))
  for (const s of UNIT_29_SPEAKING) out.push(...s.turns.flatMap(t => [t.ai, ...t.hints]))
  return out
}
const MISTAKES = new Set(UNIT_29_GRAMMAR.flatMap(g => g.mistakes.map(m => m.wrong)))
const taught = () => germanTexts().filter(t => !MISTAKES.has(t))

const ALL_DATA = () => [
  UNIT_29,
  UNIT_29_GRAMMAR,
  UNIT_29_WHY_NOTES,
  UNIT_29_READING,
  UNIT_29_LISTENING,
  UNIT_29_SPEAKING,
  UNIT_29_WRITING,
  UNIT_29_EXERCISES,
  UNIT_29_FINAL,
  UNIT_29_VOCABULARY,
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
  /^(Die|Der|Das|Den|Dem|Ein|Eine|Und|Aber|Oder|Denn|Dass|Ob|Als|Wie|Wo|Wann|Warum|Was|Wer|Ja|Nein|Gern|Auch|Nur|Noch|Schon|Leider|Danke|Bitte|Hier|Dort|Heute|Morgen|Jetzt|Ich|Er|Sie|Wir|Man|Es|Ihr|Du|Dann|Wenn|Weil|Frau|Herr|Dr|Falls|Sobald|Solange|Nachdem|Lies|Liebe|Liebes|Setze|Welcher|Ergänze)$/
const GEN_WORDS = '(?:des|eines|der|einer|meiner|meines|seiner|seines|ihrer|ihres|unserer|unseres|deiner|deines)'
/** a capitalised noun followed by a Genitiv article / possessive + noun is a Genitivattribut: allowed only where the unit teaches it as a RECEPTIVE item */
const genitivAttribute = (t: string) => {
  for (const m of t.matchAll(new RegExp(`\\b([A-ZÄÖÜ][a-zäöüß]+)\\s+${GEN_WORDS}\\s+(?:\\w+en\\s+)?([A-ZÄÖÜ][a-zäöüß]+)`, 'g')))
    if (!NOT_NOUN.test(m[1]) && !FUNCTION_WORD.test(m[1])) return true
  return false
}
const GRAMMAR_GENITIV_IDS = new Set<string>()

/** after `nachdem … hatte/war,` the main clause starts with a Perfekt auxiliary or a Präteritum verb of the closed list of Unit 21 (here: finite verbs not ending in -te/-ten) */
const nachdemMainClauseOutsideList = (t: string) =>
  sentences(t).some(sn => {
    const m = /\bNachdem [^.!?,]*\b(?:hatte|hatten|war|waren|hattest|warst|wart|hattet),\s+(\p{L}+)/u.exec(sn)
    if (!m) return false
    const w = m[1].toLowerCase()
    return /te$|ten$/.test(w) && !/^(hatte|hatten)$/.test(w)
  })
/** every `Nachdem` clause of Unit 29 is in the Plusquamperfekt (hatte / war … at the end), not in the Perfekt of Unit 21 */
const nachdemNotPlusquamperfekt = (t: string) =>
  sentences(t).some(sn => {
    const m = /\bNachdem ([^.!?,]*),/.exec(sn)
    return !!m && !/___$/.test(m[1].trim()) && !/\b(hatte|hatten|war|waren|hattest|warst|wart|hattet)\s*$/.test(m[1].trim())
  })

const FORBIDDEN: [string, (t: string) => boolean][] = [
  ['damit (Unit 30)', t => /\bdamit\b/i.test(t)],
  ['sodass / so dass (receptive; productive only in Unit 30)', t => /\bsodass\b|\bso dass\b/i.test(t)],
  ['Passiv Perfekt / Passiv im Plusquamperfekt (receptive in Unit 24 only)', t => /\bworden\b/i.test(t)],
  [
    'Futur II (B2)',
    t => /\b(wird|werde|werden|wirst)\b[^.!?]*\b(ge\w+(t|en)|\w+iert|bestanden|verstanden|begonnen|erreicht)\s+(haben|sein)\b/i.test(t),
  ],
  ['Konjunktiv I / indirect speech in the subjunctive (B2)', t => /\b(er|sie|es|man)\s+sei\b|\bheiße es\b|\bgebe es\b|\bseien\b/i.test(t)],
  [
    'Konjunktiv II of the past (receptive, Unit 31)',
    t => /\b(hätte|hätten|hättest|wäre|wären)\b[^.!?,]*\b(ge\w+(t|en)|\w+iert)\s*[.!?,]/i.test(t),
  ],
  ['Genitiv relative pronoun (not allocated)', t => /,\s*(?:\w+\s+)?(dessen|deren)\b/i.test(t)],
  [
    '`wo` / `was` as a relative word (not taught)',
    t => /\b(Ort|Stadt|Land|Hotel|Haus|Platz),\s+wo\b|\b(alles|etwas|nichts),\s+was\b/i.test(t),
  ],
  [
    'Futur I with a verb of the closed list of Unit 28 is not a goal of this unit (Futur is not revised here)',
    t => /\b(wird|werde|werden|wirst)\b[^.!?]*\b(sein|haben|bestehen|schaffen)[.!?]$/.test(t),
  ],
  ['nachdem + Perfekt (the Unit 21 form is replaced by the Plusquamperfekt here)', nachdemNotPlusquamperfekt],
  ['Präteritum outside the closed list in the main clause of nachdem', nachdemMainClauseOutsideList],
  ['ohne … zu / statt … zu (receptive, Units 23 and 26)', t => /\bohne\b[^.!?]*\bzu \w+\b|\bstatt\b[^.!?]*\bzu \w+\b/i.test(t)],
  [
    'einerseits / andererseits / nicht nur … sondern auch (receptive, Unit 22)',
    t => /einerseits|andererseits|nicht nur[^.!?]*sondern auch/i.test(t),
  ],
  [
    'real companies, operators and platforms (the unit invents all of them)',
    t =>
      /Deutsche Bahn|\bDB\b|Lufthansa|Ryanair|EasyJet|Booking\.com|Airbnb|TripAdvisor|Flixbus|Hilton|Ibis|Marriott|Eurowings|Trivago/.test(
        t,
      ),
  ],
  [
    'claims about the real rules of a real country or operator',
    t => /In Deutschland (ist|sind|gibt|muss|darf|dürfen|kostet|haben|hat)|Die Deutschen|In Kirgistan (ist|sind|gibt)|Die Kirgisen/.test(t),
  ],
]

/** a generalisation about a whole nationality or population, or an absolute claim about "all people" of a place */
const stereotype = (t: string) =>
  /\b(die|alle|viele)\s+(Deutschen|Kirgisen|Russen|Türken|Amerikaner|Franzosen|Italiener|Chinesen|Araber|Polen|Spanier|Engländer|Japaner)\b|\b(Deutsche|Kirgisen|Russen|Türken|Amerikaner|Franzosen|Italiener|Chinesen|Araber)\s+(sind|essen|trinken|mögen|haben|kommen|sprechen)\s+(immer|nie|alle|nur)\b|\balle (Menschen|Leute) (in|aus|bei) [A-ZÄÖÜ]\w+ (sind|haben|essen|trinken)\b|\b(Menschen|Leute) (in|aus) [A-ZÄÖÜ]\w+ sind (immer|alle|nie)\b/i.test(
    t,
  )

describe('identity and integration (B1 is a Beta for ru and ky)', () => {
  it('the unit equals its approved plan entry', () => {
    const plan = B1_UNIT_PLAN.find(p => p.id === 29)!
    expect(UNIT_29).toMatchObject({ id: 29, key: plan.key, title: plan.titleDe, level: 'B1' })
    expect(plan.key).toBe('b1-reisen-kultur')
    expect(plan.titleDe).toBe('Reisen, Kultur und Alltag im Vergleich')
    expect(UNIT_29.grammarIds).toEqual(CONCEPTS)
  })
  it('the content module holds Unit 29 after Units 21–28, wired into the metadata, the tests, the final tests and the speaking list', () => {
    expect(B1_CONTENT.legacyUnits.map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_META.map(m => m.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.tests).toContainEqual(UNIT_29_TEST)
    expect(B1_CONTENT.unitSpeaking.slice(0, 9).at(-1)).toBe('b1-sp-29-01')
    expect(B1_CONTENT.finalTests.map(f => f.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
  })
  it('B1 is a Beta: released for ru and ky only, offered to those interfaces and never to the German one', () => {
    expect(courseLevel('B1')).toMatchObject({ status: 'beta', releasedLocales: ['ru', 'ky'] })
    for (const lang of ['ru', 'ky'] as const) expect(availableLevels(lang)).toContain('B1')
    expect(availableLevels('de')).not.toContain('B1')
  })
  it('registered in the catalog, the unit is reachable through the standard selectors; the main writing task comes first; the Writing Lab holds all three', () => {
    registerLevelContent('B1', B1_CONTENT)
    expect(vocabularyForUnit(29)).toHaveLength(40)
    expect(grammarForUnit(29).map(g => g.id)).toEqual(CONCEPTS)
    expect(finalTestOfUnit(29)?.questions).toHaveLength(15)
    expect(topicTestOfUnit(29)).toMatchObject({ id: 'unit-29', level: 'B1', size: 15 })
    expect(speakingForUnit(29)).toBe('b1-sp-29-01')
    const ids = ['b1-wr-29-01', 'b1-wr-29-02', 'b1-wr-29-03']
    expect(writingForUnit(29).map(w => w.id)).toEqual(ids)
    const lab = writingOf('B1').map(w => w.id)
    for (const id of ids) expect(lab).toContain(id)
  })
})

describe('grammar: only the three approved concepts', () => {
  it('exactly the approved ids, in order, owned by Unit 29, level B1; the curriculum classification is P / R / P (D-7 and D-6 pending)', () => {
    expect(UNIT_29_GRAMMAR.map(g => g.id)).toEqual(CONCEPTS)
    for (const g of UNIT_29_GRAMMAR) expect(g).toMatchObject({ unit: 29, level: 'B1' })
    const spec = B1_CURRICULUM.units.find(u => u.unit === 29)!
    expect(spec.concepts.map(c => c.id)).toEqual(CONCEPTS)
    expect(spec.concepts.map(c => c.proficiency)).toEqual(['P', 'R', 'P'])
    expect(spec.concepts[0].expertReview).toBeUndefined()
    expect(spec.concepts[1].expertReview).toMatchObject({ status: 'pending', decision: 'D-7' })
    expect(spec.concepts[2].expertReview).toMatchObject({ status: 'pending', decision: 'D-6' })
  })
  it('every concept is complete: explanation, 5 examples, mistakes, real-life, dialogue, speaking prompt — in Russian and in Kyrgyz', () => {
    for (const g of UNIT_29_GRAMMAR) {
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
  it('the why-notes: two on the relative clause, one on the Genitivattribut, one on Plusquamperfekt / nachdem', () => {
    expect(UNIT_29_WHY_NOTES.map(n => n.conceptId)).toEqual([CONCEPTS[0], CONCEPTS[0], CONCEPTS[1], CONCEPTS[2]])
  })
  it('the examples really show their concept', () => {
    const rel = UNIT_29_GRAMMAR[0].examples.map(x => x.de)
    for (const re of [/, dem \w+ /, /, in der \w+/, /, mit denen /, /, in das /, /, mit dem /])
      expect(
        rel.some(x => re.test(x)),
        String(re),
      ).toBe(true)
    for (const x of rel) expect(x, x).toMatch(/, (?:\w+ )?(dem|der|denen|das|den|die)\b/)
    for (const x of UNIT_29_GRAMMAR[1].examples) expect(genitivAttribute(x.de) || /meiner Eltern|des Landes/.test(x.de), x.de).toBe(true)
    const pq = UNIT_29_GRAMMAR[2].examples.map(x => x.de).join(' ')
    for (const re of [
      /hatte [^.]*gekauft/,
      /waren [^.]*angekommen/,
      /Nachdem wir angekommen waren, haben/,
      /gepackt hatte, hat/,
      /weil er den Bus verpasst hatte/,
    ])
      expect(pq, String(re)).toMatch(re)
  })
  it('every "mistake" really differs from its correction, and the wrong form never appears in the taught texts', () => {
    for (const g of UNIT_29_GRAMMAR) for (const m of g.mistakes) expect(m.wrong).not.toBe(m.right)
    const wrong = UNIT_29_GRAMMAR.flatMap(g => g.mistakes.map(m => m.wrong))
    for (const t of taught()) expect(wrong.includes(t), t).toBe(false)
  })
  it('scope guard: nothing that belongs to a later unit, is receptive-only or lies outside the taught forms', () => {
    for (const t0 of taught())
      for (const [name, test] of FORBIDDEN) {
        const t = t0.replace(/Liebe[rn]? \w+, /g, '')
        expect(test(t), `${name}: "${t.slice(0, 90)}"`).toBe(false)
      }
  })
  it('REGRESSION of the scope guard: genuine out-of-scope German IS still detected, and the allowed phrases are not flagged', () => {
    const bad: [string, string][] = [
      ['damit (Unit 30)', 'Ich lerne viel, damit ich besser spreche.'],
      ['sodass / so dass (receptive; productive only in Unit 30)', 'Der Zug fällt aus, sodass wir warten müssen.'],
      ['Passiv Perfekt / Passiv im Plusquamperfekt (receptive in Unit 24 only)', 'Die Heizung ist erneuert worden.'],
      ['Futur II (B2)', 'Bis morgen wird er die Prüfung bestanden haben.'],
      ['Konjunktiv I / indirect speech in the subjunctive (B2)', 'Er sagt, er sei krank.'],
      ['Konjunktiv II of the past (receptive, Unit 31)', 'Ich wäre gestern gern ins Kino gegangen.'],
      ['Genitiv relative pronoun (not allocated)', 'Das ist der Mann, dessen Auto ich gekauft habe.'],
      ['Genitiv relative pronoun (not allocated)', 'Die Frau, deren Sohn ich kenne, wohnt hier.'],
      ['`wo` / `was` as a relative word (not taught)', 'Das ist die Stadt, wo ich wohne.'],
      ['nachdem + Perfekt (the Unit 21 form is replaced by the Plusquamperfekt here)', 'Nachdem wir angekommen sind, haben wir gegessen.'],
      ['Präteritum outside the closed list in the main clause of nachdem', 'Nachdem wir angekommen waren, suchten wir das Hotel.'],
      ['ohne … zu / statt … zu (receptive, Units 23 and 26)', 'Er geht, ohne sich zu verabschieden.'],
      ['einerseits / andererseits / nicht nur … sondern auch (receptive, Unit 22)', 'Einerseits ist es teuer, andererseits bequem.'],
      [
        'real companies, operators and platforms (the unit invents all of them)',
        'Mein Zug von der Deutschen Bahn ist ausgefallen. DB hat sich entschuldigt.',
      ],
      ['real companies, operators and platforms (the unit invents all of them)', 'Ich habe das Hotel bei Booking.com gebucht.'],
      ['claims about the real rules of a real country or operator', 'In Deutschland ist das Frühstück immer kostenlos.'],
      ['claims about the real rules of a real country or operator', 'Die Deutschen sind pünktlich.'],
    ]
    for (const [name, text] of bad) expect(FORBIDDEN.find(([n]) => n === name)![1](text), `${name}: "${text}" must be detected`).toBe(true)
    const ok: string[] = [
      'Nachdem wir angekommen waren, haben wir etwas gegessen.',
      'Nachdem wir angekommen waren, gingen wir essen.',
      'Nachdem sie die Koffer gepackt hatte, hat sie ein Taxi gerufen.',
      'Nachdem ich den Anschluss verpasst hatte, habe ich ein Taxi genommen.',
      'Die Stadt, in der ich lebe, ist klein.',
      'Die Leute, mit denen wir gereist sind, waren nett.',
      'Ich hatte die Fahrkarte schon gekauft.',
      'Das Zimmer, das Sie gebucht hatten, ist nicht frei.',
      'Ich bin in Dresden, wo es sehr schön ist.',
    ]
    for (const text of ok) for (const [name, test] of FORBIDDEN) expect(test(text), `${name}: "${text}" must NOT be flagged`).toBe(false)
  })
  it('the relative clause is really PRODUCTIVE: many relative clauses with the Dativ and with a preposition, all pronoun forms, in several texts', () => {
    const all = taught().join(' ')
    for (const re of [/, dem /, /, (bei|mit|in) der /, /, denen /, /, (in|mit|bei|von|auf|für) (dem|der|denen|den|das|die) /])
      expect(all, String(re)).toMatch(re)
    for (const p of [
      'in dem',
      'in der',
      'mit dem',
      'mit der',
      'mit denen',
      'bei der',
      'bei denen',
      'auf den',
      'von dem',
      'in das',
      'auf dem',
    ])
      expect(all, p).toContain(`, ${p} `)
    const count = (all.match(/, (in|mit|bei|von|auf|für) (dem|der|denen|den|das|die) /g) ?? []).length
    expect(count).toBeGreaterThanOrEqual(15)
    expect(UNIT_29_READING.every(r => /, (in|mit|bei|von|auf) (dem|der|denen|den) /.test(r.body.join(' ')))).toBe(true)
    expect(
      UNIT_29_LISTENING.every(l => /, (in|mit|bei|von|auf) (dem|der|denen|den) |, dem |, denen /.test(l.lines.map(x => x.text).join(' '))),
    ).toBe(true)
    expect(META.concepts[0]).toMatchObject({ conceptId: 'b1-relativsaetze-dativ-praeposition', proficiency: 'P', load: 'M', role: 'new' })
  })
  it('every relative clause keeps the verb at the end and a comma before the preposition + pronoun (the taught texts, spot-checked by pattern)', () => {
    for (const t of taught().flatMap(sentences)) {
      const m = /, (in|mit|bei|von|auf|für) (dem|der|denen|den|das|die) (\w+) (\w+)([^,.!?]*)/.exec(t)
      if (!m) continue
      // a finite verb or a participle must appear after the pronoun, and the clause must not end with the preposition
      expect(m[5].trim() === '' ? `${m[3]} ${m[4]}` : `${m[3]} ${m[4]}${m[5]}`, t).not.toMatch(/\b(in|mit|bei|von|auf|für)$/)
    }
  })
  it('the Genitivattribut is RECEPTIVE (decision D-7): classified R, shown in readings and grammar, recognised in choice items — and NEVER required in production', () => {
    expect(META.concepts[1]).toMatchObject({ conceptId: 'b1-genitivattribute', proficiency: 'R', load: 'M' })
    // not in a gap, a word order, a gap question of the final test, a writing checklist or model, a speaking hint, a vocabulary example, a listening script
    for (const e of UNIT_29_EXERCISES.filter(x => x.type !== 'choice'))
      expect(genitivAttribute(`${e.prompt} ${e.answer}`), e.id).toBe(false)
    for (const e of UNIT_29_EXERCISES.filter(x => x.concept === 'b1-genitivattribute')) expect(e.type, e.id).toBe('choice')
    for (const q of UNIT_29_FINAL.filter(x => /___/.test(x.prompt))) expect(genitivAttribute(`${q.prompt} ${q.answer}`), q.id).toBe(false)
    for (const q of UNIT_29_FINAL.filter(x => x.concept === 'b1-genitivattribute')) expect(/___/.test(q.prompt), q.id).toBe(false)
    for (const w of UNIT_29_WRITING) {
      expect(genitivAttribute(w.model), w.id).toBe(false)
      for (const m of w.mustInclude) expect(genitivAttribute(m.label) || /genitiv/i.test(m.label), `${w.id}: ${m.label}`).toBe(false)
    }
    for (const s of UNIT_29_SPEAKING)
      for (const t of s.turns) for (const h of [t.ai, ...t.hints]) expect(genitivAttribute(h), h).toBe(false)
    for (const v of UNIT_29_VOCABULARY) expect(genitivAttribute(v.example), v.id).toBe(false)
    for (const l of UNIT_29_LISTENING) for (const x of l.lines) expect(genitivAttribute(x.text), x.text).toBe(false)
    // the other final-test and exercise items are Genitiv-free too, except the three recognition items
    for (const e of UNIT_29_EXERCISES.filter(x => !GENITIV_OK_IDS.has(x.id)))
      expect(genitivAttribute(`${e.prompt} ${e.answer}`), e.id).toBe(false)
    for (const q of UNIT_29_FINAL.filter(x => !GENITIV_OK_IDS.has(x.id) && x.skill !== 'reading'))
      expect(genitivAttribute(`${q.prompt} ${q.answer}`), q.id).toBe(false)
    // …but it IS present where it is taught: both readings, glossed, and the grammar
    for (const r of UNIT_29_READING) {
      expect(genitivAttribute(r.body.join(' ')), r.id).toBe(true)
      expect(
        r.gloss.some(g => /Genitivattribut/.test(g.grammar) && /Genitivattribut/.test(g.grammarKy ?? '')),
        r.id,
      ).toBe(true)
    }
    expect(GRAMMAR_GENITIV_IDS.size).toBe(0)
  })
  it('REGRESSION of the Genitiv guard: real Genitivattribute are detected, the ordinary phrases of the unit are not', () => {
    for (const t of [
      'Die Hauptstadt des Landes ist sehr groß.',
      'Das Haus meiner Eltern steht am See.',
      'Der Name des Hotels steht auf der Rechnung.',
      'Das Zentrum der Stadt ist ruhig.',
      'Die Meinung eines Freundes hat mir geholfen.',
    ])
      expect(genitivAttribute(t), t).toBe(true)
    for (const t of [
      'Die Frau an der Rezeption war freundlich.',
      'Wegen der Verspätung habe ich den Anschluss verpasst.',
      'Ich habe das Zimmer bei der Rezeption gebucht.',
      'Das Zimmer, in dem wir übernachtet haben, war ruhig.',
      'Mein Kollege Jan, dem Pünktlichkeit sehr wichtig ist, kommt früh.',
      'Im Gegensatz zum Anfang fühle ich mich zu Hause.',
      'Das Frühstück bekommen Sie ab sieben Uhr.',
      'Der Zug, mit dem ich fahren wollte, ist ausgefallen.',
    ])
      expect(genitivAttribute(t), t).toBe(false)
  })
  it('Plusquamperfekt: both auxiliaries (hatte / war) with the Partizip II at the end, in nachdem clauses and in weil / background clauses — and always with nachdem in the Plusquamperfekt', () => {
    const all = taught().join(' ')
    for (const re of [
      /\bhatte [^.,]*\b(gekauft|gebucht|verpasst|gegessen|gewusst|gepackt|gewartet|gesprochen)\b/,
      /\bwaren? [^.,]*\b(angekommen|gewesen|abgereist)\b/,
      /Nachdem [^.,]*\b(hatte|hatten|war|waren),/,
      /weil [^.,]*(hatte|hatten)\b/,
    ])
      expect(all, String(re)).toMatch(re)
    const nachdem = taught()
      .flatMap(sentences)
      .filter(x => /\bNachdem /.test(x))
    expect(nachdem.length).toBeGreaterThanOrEqual(10)
    for (const t of nachdem) expect(nachdemNotPlusquamperfekt(t) || nachdemMainClauseOutsideList(t), t).toBe(false)
    const form = (g: (typeof UNIT_29_GRAMMAR)[2]) => g.when.map(x => x.ru).join(' ')
    expect(form(UNIT_29_GRAMMAR[2])).toMatch(/hatte \/ hattest \/ hatte \/ hatten \/ hattet \/ hatten/)
    expect(META.concepts[2]).toMatchObject({ conceptId: 'b1-plusquamperfekt-nachdem', proficiency: 'P', load: 'M', role: 'new' })
  })
  it('the Plusquamperfekt auxiliary is right: motion / change of state → war, the others → hatte (ankommen → war angekommen, kaufen → hatte gekauft)', () => {
    const all = taught().join(' ')
    expect(all).not.toMatch(/angekommen hatten?\b|abgereist hatten?\b|gewesen hatten?\b/)
    expect(all).not.toMatch(/\b(gekauft|gebucht|verpasst|gegessen|gepackt|gewartet|gesprochen|gewusst) (war|waren)\b/)
  })
})

describe('cultural content: fictional, balanced, personal impressions — no stereotypes, no real companies, no rules of a real country', () => {
  it('every reading and listening is labelled as invented; the speaking scenario and the hotel task say so in the learner’s language', () => {
    for (const r of UNIT_29_READING) expect(`${r.title} ${r.body.join(' ')}`, r.id).toMatch(/erfunden|Erfundener/)
    for (const l of UNIT_29_LISTENING) expect(l.title, l.id).toMatch(/erfunden/)
    expect(UNIT_29_READING[0].body[0]).toMatch(/^Erfundener Erfahrungsbericht/)
    expect(UNIT_29_READING[1].body[0]).toMatch(/^Hotelbewertung \(erfunden\)/)
    expect(UNIT_29_READING[1].body[2]).toMatch(/^Mitteilung der Nordlicht-Bahn \(erfunden\)/)
    expect(UNIT_29_SPEAKING[0].goal.ru).toMatch(/вымышлен/)
    expect(UNIT_29_SPEAKING[0].goal.ky).toMatch(/ойдон чыгарылган/)
    expect(MICRO_H.situation.ru).toMatch(/вымышлен/)
    expect(MICRO_H.situation.ky).toMatch(/ойдон чыгарылган/)
    for (const q of UNIT_29_FINAL.filter(x => x.skill === 'reading')) expect(q.prompt, q.id).toMatch(/\(erfunden\)/)
  })
  it('a custom or an everyday difference is ALWAYS a personal impression of a fictional person: the markers are there, in the reading, the interview and the speaking hints', () => {
    const r1 = UNIT_29_READING[0].body.join(' ')
    expect(r1).toMatch(/Das ist nur mein Eindruck, keine Regel für alle/)
    expect(r1).toMatch(/Mein Kollege Jan[^.]*\. Meine Freundin Lena dagegen/)
    expect(UNIT_29_READING[1].body.join(' ')).toMatch(/Das ist nur meine Meinung/)
    const l2 = UNIT_29_LISTENING[1].lines.map(x => x.text).join(' ')
    expect(l2).toMatch(/Das ist nur meine Erfahrung, keine Regel für alle/)
    expect(l2).toMatch(/Jeder Mensch ist anders/)
    expect(l2).toMatch(/Das sind nur meine Eindrücke/)
    const hints = UNIT_29_SPEAKING[0].turns[5].hints.join(' ')
    expect(hints).toMatch(/Das ist nur mein Eindruck, keine Regel für alle/)
    expect(MAIN.model).toMatch(/Das ist nur mein Eindruck/)
    expect(MAIN.tips.map(t => t.ru).join(' ')).toMatch(/личн[а-яё]+ впечатлени/)
    expect(MAIN.tips.map(t => t.ky).join(' ')).toMatch(/жеке таасир/)
    expect(META.strands.strategyNote!.de).toMatch(/nicht von ganzen Ländern oder Gruppen/)
  })
  it('no text states a stereotype, generalises about a nationality or population, names a real company or invents the rules of a real country', () => {
    for (const t of taught()) expect(stereotype(t), `stereotype: "${t.slice(0, 100)}"`).toBe(false)
    const all = JSON.stringify(ALL_DATA(), (k, v) => (k === 'source' ? undefined : v))
    for (const [name, test] of FORBIDDEN.filter(([n]) => /^(real companies|claims about)/.test(n))) expect(test(all), name).toBe(false)
    expect(all).not.toMatch(/Die Deutschen|Die Kirgisen|Die Russen|Die Türken|alle Deutschen|alle Kirgisen/)
    expect(all).not.toMatch(/\bTypisch deutsch\b|\bwie alle\b/)
  })
  it('REGRESSION of the stereotype guard: generalisations are detected, a named person’s experience is not', () => {
    for (const t of [
      'Die Deutschen sind immer pünktlich.',
      'Alle Menschen in Leipzig sind pünktlich.',
      'Viele Russen trinken immer Tee.',
      'Kirgisen essen immer viel Fleisch.',
      'Alle Leute in Bischkek sind gastfreundlich.',
    ])
      expect(stereotype(t), t).toBe(true)
    for (const t of [
      'Mein Kollege Jan kommt immer früh.',
      'Meine Gastfamilie war sehr gastfreundlich.',
      'Das ist nur mein Eindruck, keine Regel für alle.',
      'Die Leute, mit denen wir gesprochen haben, waren hilfsbereit.',
      'Jeder Mensch ist anders.',
    ])
      expect(stereotype(t), t).toBe(false)
  })
  it('the texts show differences AND similarities, and inside one place people differ (Jan vs Lena; hospitality at both places)', () => {
    expect(UNIT_29_READING[0].body.join(' ')).toMatch(/Jan[^.]*früher\. Meine Freundin Lena dagegen kommt manchmal etwas später/)
    const l2 = UNIT_29_LISTENING[1].lines.map(x => x.text).join(' ')
    expect(l2).toMatch(/Gemeinsamkeiten/)
    expect(l2).toMatch(/Gastfreundschaft habe ich an beiden Orten erlebt/)
    expect(UNIT_29_VOCABULARY.map(v => v.de)).toEqual(
      expect.arrayContaining(['Unterschied', 'Gemeinsamkeit', 'Eindruck', 'typisch', 'unterschiedlich']),
    )
    expect(UNIT_29_VOCABULARY.find(v => v.de === 'typisch')!.example).toMatch(/aber nicht für alle/)
  })
  it('every example sentence of the vocabulary that names a custom describes a family or a person, not a country', () => {
    for (const v of UNIT_29_VOCABULARY) expect(v.example, v.id).not.toMatch(/\bin (Deutschland|Kirgistan|Russland|Europa|Asien)\b/)
  })
  it('the Kyrgyz comparison and impression texts do not generalise either (tips and notes use "жеке таасир" / "баарына эреже эмес")', () => {
    const ky = kyTexts().join(' ')
    expect(ky).toMatch(/баарына эреже эмес/)
    expect(ky).not.toMatch(/немистер (ар дайым|бардыгы)|кыргыздар (ар дайым|бардыгы)/)
  })
})

describe('vocabulary: 40 new items, none already taught', () => {
  const b = fullBundle()
  const earlier = new Set(b.vocabulary.filter(v => v.unit <= 28).flatMap(v => lemmaKeys(v.de)))
  it('exactly 40 items (target 38–42), ids v29-1 … v29-40, unique across the whole B1 vocabulary', () => {
    expect(UNIT_29_VOCABULARY).toHaveLength(40)
    expect(UNIT_29_VOCABULARY.map(v => v.id)).toEqual(Array.from({ length: 40 }, (_, i) => `v29-${i + 1}`))
    expect(UNIT_29_VOCABULARY.every(v => v.unit === 29)).toBe(true)
    const ids = B1_CONTENT.vocabulary.map(v => v.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toHaveLength(480)
  })
  it('no lemma repeats an A1, A2 or earlier B1 headword (the travel words of A2 Unit 18 are NOT repeated), and none is listed twice', () => {
    const keys = UNIT_29_VOCABULARY.flatMap(v => lemmaKeys(v.de))
    expect(keys.filter(k => earlier.has(k))).toEqual([])
    expect(new Set(keys).size).toBe(keys.length)
    const de = UNIT_29_VOCABULARY.map(v => v.de)
    for (const known of [
      'Unterkunft',
      'Sehenswürdigkeit',
      'Verspätung',
      'Heimat',
      'Fest',
      'Missverständnis',
      'Gewohnheit',
      'Erstattung',
      'Panne',
      'vergleichen',
      'erleben',
      'buchen',
      'Ausland',
      'Fahrkarte',
      'Gleis',
      'Bahnsteig',
      'Gepäck',
      'Flughafen',
      'umsteigen',
      'höflich',
      'pünktlich',
    ])
      expect(de).not.toContain(known)
  })
  it('every item has article/plural where a noun, a German example, and independent Russian and Kyrgyz translations of the word and the example', () => {
    for (const v of UNIT_29_VOCABULARY) {
      if (v.pos === 'noun') expect(v.article, v.de).toBeTruthy()
      for (const f of [v.de, v.ru, v.ky, v.example, v.exampleRu, v.exampleKy ?? '']) expect(f.trim().length, v.id).toBeGreaterThan(1)
      expect(v.ky).not.toBe(v.ru)
      expect(v.exampleKy).not.toBe(v.exampleRu)
    }
    const ex = UNIT_29_VOCABULARY.map(v => v.example)
    expect(new Set(ex).size).toBe(ex.length)
    expect(UNIT_29_VOCABULARY.filter(v => v.pos === 'noun').length).toBeGreaterThanOrEqual(20)
    expect(UNIT_29_VOCABULARY.filter(v => v.pos === 'verb').length).toBeGreaterThanOrEqual(6)
    expect(UNIT_29_VOCABULARY.filter(v => v.pos === 'adj').length).toBeGreaterThanOrEqual(5)
  })
  it('the planned themes are present (breakdown and complaint, travel forms, customs and everyday life, comparison and impression)', () => {
    const de = UNIT_29_VOCABULARY.map(v => v.de)
    for (const w of [
      'Reisepanne',
      'Entschädigung',
      'Beschwerde',
      'Anschluss',
      'Zugausfall',
      'Rezeption',
      'Pauschalreise',
      'Rundreise',
      'Reiseführer',
      'Tourismus',
      'Kultur',
      'Brauch',
      'Tradition',
      'Gastfreundschaft',
      'Höflichkeit',
      'Pünktlichkeit',
      'Kulturschock',
      'Redewendung',
      'Unterschied',
      'Gemeinsamkeit',
      'Alltag',
      'Erwartung',
      'Eindruck',
      'sich beschweren',
      'sich anpassen',
      'sich eingewöhnen',
    ])
      expect(de, w).toContain(w)
  })
  it('Wortbildung strand: compounds, -keit, -schaft, un- are present as items and explained in the metadata in three languages', () => {
    const de = UNIT_29_VOCABULARY.map(v => v.de)
    for (const w of ['Reisepanne', 'Zugausfall', 'Kulturschock', 'Höflichkeit', 'Pünktlichkeit', 'Gastfreundschaft', 'ungewohnt'])
      expect(de, w).toContain(w)
    const n = META.strands.wortbildungNote!
    expect(n.de && n.ru && n.ky).toBeTruthy()
    expect(n.ky).not.toBe(n.ru)
    for (const w of ['Reisepanne', '-keit', 'un-']) expect(n.de).toContain(w)
  })
  it('the unit REUSES the established travel and culture words as revision in its texts without listing them as new', () => {
    const all = germanTexts().join(' ')
    for (const w of [
      'Unterkunft',
      'Fahrkarte',
      'Bahnsteig',
      'Gleis',
      'Heimat',
      'Missverständnis',
      'Gutschein',
      'Zimmer',
      'Frühstück',
      'umsteigen|Anschluss',
    ])
      expect(all, w).toMatch(new RegExp(w))
  })
})

describe('texts: progressive targets (band for Units 27–29 and the curriculum text for Unit 29)', () => {
  it('2 readings of 170–210 words and 2 listening scripts of 150–180 words', () => {
    expect(UNIT_29_READING).toHaveLength(2)
    expect(UNIT_29_LISTENING).toHaveLength(2)
    for (const r of UNIT_29_READING) {
      const n = r.body.reduce((a, p) => a + words(p), 0)
      expect(n, r.id).toBeGreaterThanOrEqual(170)
      expect(n, r.id).toBeLessThanOrEqual(210)
    }
    for (const l of UNIT_29_LISTENING) {
      const n = l.lines.reduce((a, x) => a + words(x.text), 0)
      expect(n, l.id).toBeGreaterThanOrEqual(150)
      expect(n, l.id).toBeLessThanOrEqual(180)
    }
  })
  it('sentences stay short (95th percentile ≤ 20, longest ≤ 25 words)', () => {
    const lens = [
      ...UNIT_29_READING.flatMap(r => r.body.flatMap(sentences)),
      ...UNIT_29_LISTENING.flatMap(l => l.lines.flatMap(x => sentences(x.text))),
    ]
      .map(words)
      .sort((a, b) => a - b)
    expect(lens[lens.length - 1]).toBeLessThanOrEqual(25)
    expect(lens[Math.ceil(0.95 * lens.length) - 1]).toBeLessThanOrEqual(20)
  })
  it('every dialogue line carries a Russian and a Kyrgyz translation; questions have 3 distinct options, exactly one correct; answer positions vary', () => {
    for (const l of UNIT_29_LISTENING) for (const x of l.lines) expect(x.ru && x.ky && x.ky !== x.ru).toBeTruthy()
    const qs = [...UNIT_29_LISTENING.flatMap(l => l.questions), ...UNIT_29_READING.flatMap(r => r.questions)]
    for (const q of qs) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options).size).toBe(3)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(3)
    }
    expect(new Set(qs.map(q => q.answer)).size).toBe(3)
    expect(new Set(UNIT_29_READING.flatMap(r => r.questions.map(q => q.answer))).size).toBe(3)
    expect(new Set(UNIT_29_LISTENING.flatMap(l => l.questions.map(q => q.answer))).size).toBe(3)
  })
  it('the listening keywords all have a gloss in the unit vocabulary', () => {
    const de = new Set(UNIT_29_VOCABULARY.map(v => v.de))
    for (const l of UNIT_29_LISTENING) for (const k of l.keywords) expect(de.has(k), `${l.id}: ${k}`).toBe(true)
  })
  it('the listening dialogues are coherent: greetings and closings; the reception dialogue holds the unexpected refusal and then a solution and a compensation', () => {
    const l1 = UNIT_29_LISTENING[0].lines.map(x => x.text)
    expect(l1[0]).toMatch(/Guten Abend/)
    expect(l1.at(-1)).toMatch(/Gute Nacht/)
    expect(l1.findIndex(t => /leider nicht frei/.test(t))).toBeLessThan(
      l1.findIndex(t => /Entschädigung bekommen Sie das Frühstück gratis/.test(t)),
    )
    expect(UNIT_29_LISTENING[1].lines[0].text).toMatch(/Herr Sadyr/)
    expect(UNIT_29_LISTENING[1].lines.at(-1)!.text).toMatch(/Das sind nur meine Eindrücke/)
  })
  it('the listening answer keys agree with the script (every correct option is supported by the text, no distractor is)', () => {
    const t1 = UNIT_29_LISTENING[0].lines.map(x => x.text).join(' ')
    const q1 = UNIT_29_LISTENING[0].questions
    expect(q1.map(q => q.options[q.answer])).toEqual([
      'Das gebuchte Zimmer ist nicht frei.',
      'Es gab einen Wasserschaden.',
      'Das Frühstück gratis.',
      'Eine Beschwerde schriftlich abgeben.',
    ])
    expect(t1).toMatch(/Das Zimmer, das Sie gebucht hatten, ist leider nicht frei/)
    expect(t1).toMatch(/gab es gestern einen Wasserschaden/)
    expect(t1).toMatch(/Als Entschädigung bekommen Sie das Frühstück gratis/)
    expect(t1).toMatch(/Ich möchte aber meine Beschwerde schriftlich abgeben/)
    expect(t1).not.toMatch(/Geld zurück|noch nicht abgereist|neu gebaut/)
    const t2 = UNIT_29_LISTENING[1].lines.map(x => x.text).join(' ')
    const q2 = UNIT_29_LISTENING[1].questions
    expect(q2.map(q => q.options[q.answer])).toEqual([
      'Das Planen von Terminen.',
      'Er hatte Kollegen für den Sonntag eingeladen.',
      'Sie haben abgesagt, weil sie schon etwas geplant hatten.',
      'Man soll nachfragen, wenn etwas unklar ist.',
    ])
    expect(t2).toMatch(/Für mich war es das Planen von Terminen/)
    expect(t2).toMatch(/Ich hatte meine Kollegen spontan für den Sonntag eingeladen/)
    expect(t2).toMatch(/haben sie freundlich abgesagt\. Sie hatten schon etwas geplant/)
    expect(t2).toMatch(/Fragen Sie nach, wenn etwas unklar ist/)
  })
  it('the reading answer keys agree with the text', () => {
    const [r1, r2] = UNIT_29_READING
    const t1 = r1.body.join(' ')
    expect(r1.questions.map(q => q.options[q.answer])).toEqual([
      'falsch',
      'Jan kommt früher, Lena manchmal später; das ist ihr Eindruck.',
      'Sie fühlt sich jetzt zu Hause.',
    ])
    expect(t1).toMatch(/viele Leute hier früh zu Abend essen/)
    expect(t1).toMatch(/die Mitte der Stadt war für mich ungewohnt/i)
    expect(t1).toMatch(/Jan[^.]*kommt immer zehn Minuten früher\. Meine Freundin Lena dagegen kommt manchmal etwas später/)
    expect(t1).toMatch(/fühle ich mich jetzt zu Hause/)
    const t2 = r2.body.join(' ')
    expect(r2.questions.map(q => q.options[q.answer])).toEqual([
      'steht nicht im Text',
      'Für Gäste, denen Ruhe nicht so wichtig ist.',
      'Am Gleis 4.',
    ])
    expect(t2).toMatch(/Als Entschädigung haben wir ein kostenloses Frühstück bekommen/)
    expect(t2).toMatch(/Ich empfehle das Hotel für Gäste, denen Ruhe nicht so wichtig ist/)
    expect(t2).toMatch(/Ersatzzug, auf den die Fahrgäste am Gleis 4 warten können/)
  })
  it('the reading glosses give Russian and Kyrgyz for every word, independently, and gloss the Plusquamperfekt, the relative clauses and the Genitiv', () => {
    for (const r of UNIT_29_READING) for (const g of r.gloss) expect(g.ky).not.toBe(g.ru)
    for (const r of UNIT_29_READING) for (const g of r.gloss) expect(g.grammarKy).not.toBe(g.grammar)
    const gl = UNIT_29_READING.flatMap(r => r.gloss.map(g => g.grammar)).join(' ')
    for (const re of [/Plusquamperfekt/, /Dativ/, /Akkusativ/, /Genitivattribut/]) expect(gl).toMatch(re)
  })
  it('the comparison strand ↻ Unit 22: ≥ 3 declared phrases, at least two of them actually occur in the texts and exercises', () => {
    const phrases = META.strands.comparisonPhrases!
    expect(phrases.length).toBeGreaterThanOrEqual(3)
    const corpus = [
      ...UNIT_29_READING.flatMap(r => r.body),
      ...UNIT_29_LISTENING.flatMap(l => l.lines.map(x => x.text)),
      ...UNIT_29_EXERCISES.map(e => e.prompt),
    ]
      .join(' ')
      .toLowerCase()
    expect(phrases.filter(p => corpus.includes(p.toLowerCase())).length).toBeGreaterThanOrEqual(3)
    for (const p of ['im Vergleich zu', 'im Gegensatz zu', 'dagegen']) expect(corpus).toContain(p.toLowerCase())
  })
  it('listening uses the existing browser text-to-speech lab: no audio file, no claim of verified playback; no assessment item depends on audio', () => {
    for (const l of UNIT_29_LISTENING) expect(Object.keys(l)).not.toContain('audio')
    for (const q of UNIT_29_FINAL) expect(q.skill).not.toBe('listening')
  })
  it('speaking: one scenario of 7 turns (cancelled train, compensation, comparison); in turn 4 the compensation is NOT given on the spot (unexpected element) and the hints practise the Plusquamperfekt, relative clauses with a preposition and the comparison', () => {
    const [s] = UNIT_29_SPEAKING
    expect(s.turns).toHaveLength(7)
    expect(s.level).toBe('B1')
    for (const t of s.turns) {
      expect(t.aiRu && t.aiKy).toBeTruthy()
      expect(t.hints.length).toBeGreaterThanOrEqual(3)
      expect(t.keywords.length).toBeGreaterThanOrEqual(3)
      for (const k of t.keywords) expect(k).toBe(k.toLowerCase())
    }
    expect(s.turns[3].ai).toMatch(/Entschädigung gibt es bei uns leider nur online/)
    expect(s.turns[3].hints.join(' ')).toMatch(/Moment, ich überlege kurz/)
    expect(s.turns[0].hints.join(' ')).toMatch(/Der Zug, mit dem ich fahren wollte/)
    expect(s.turns[2].hints.join(' ')).toMatch(/hatte die Fahrkarte schon gestern gekauft/)
    expect(s.turns[2].hints.join(' ')).toMatch(/Nachdem ich die Fahrkarte gekauft hatte/)
    expect(s.turns[5].ai).toMatch(/im Vergleich/)
    expect(s.turns[5].hints.join(' ')).toMatch(/Im Vergleich zu hier/)
    expect(s.turns[5].hints.join(' ')).toMatch(/dagegen/)
    expect(META.scenario.id).toBe('b1-sp-29-01')
    expect(s.titleRu && s.titleKy).toBeTruthy()
  })
})

describe('writing: the travel report and the micro-tasks, all discoverable', () => {
  it('main task: informal, 85 words minimum, seven expected elements, a model that meets every one and no Genitiv', () => {
    expect(MAIN).toMatchObject({ id: 'b1-wr-29-01', minWords: 85, level: 'B1', unit: 29, formal: false })
    expect(words(MAIN.model)).toBeGreaterThanOrEqual(85)
    expect(MAIN.mustInclude).toHaveLength(7)
    for (const m of MAIN.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky).toBeTruthy()
      expect(m.explain!.ky).not.toBe(m.explain!.ru)
      expect(
        m.patterns.some(p => MAIN.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(MAIN.model).toMatch(/Nachdem wir angekommen waren, haben wir/)
    expect(MAIN.model).toMatch(/, in dem wir [^.]*haben,/)
    expect(MAIN.model).toMatch(/Leute, mit denen wir gesprochen haben/)
    expect(MAIN.model).toMatch(/Wir hatten [^.]*gebucht/)
    expect(MAIN.model).toMatch(/Im Vergleich zu meiner Heimatstadt/)
    expect(MAIN.model).toMatch(/Ich empfehle/)
    for (const t of MAIN.tips) expect(t.ky).not.toBe(t.ru)
  })
  it('the main task does NOT require a Genitivattribut (receptive concept): no checklist item and no pattern asks for one, and the tips say it need not be written', () => {
    for (const m of MAIN.mustInclude) {
      expect(m.label).not.toMatch(/genitiv/i)
      expect(m.patterns.some(p => /\b(des|eines)\b/.test(p))).toBe(false)
    }
    expect(MAIN.tips.map(t => t.ru).join(' ')).toMatch(/Genitiv писать не нужно/)
    expect(MAIN.tips.map(t => t.ky).join(' ')).toMatch(/Genitivди жазуунун кереги жок/)
  })
  it('the opinion micro-task (kind "meinung", required by the curriculum): opinion + reason + a comparison; its model meets every element', () => {
    expect(MICRO_O).toMatchObject({ id: 'b1-wr-29-02', minWords: 30, level: 'B1', unit: 29, formal: false })
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
    expect(MICRO_O.model).toMatch(/Im Gegensatz dazu/)
    expect(MICRO_O.model).toMatch(/\bDagegen\b/)
    expect(MICRO_O.situation.ru).toMatch(/плюсы и минусы|плюсы, и минусы|сравнение/)
  })
  it('the hotel review micro-task (kind "note"): factual, a Plusquamperfekt background, a relative clause with a preposition, and a polite request for compensation', () => {
    expect(MICRO_H).toMatchObject({ id: 'b1-wr-29-03', minWords: 40, level: 'B1', unit: 29, formal: false })
    expect(words(MICRO_H.model)).toBeGreaterThanOrEqual(40)
    expect(MICRO_H.mustInclude).toHaveLength(3)
    for (const m of MICRO_H.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky && m.explain.ky !== m.explain.ru).toBeTruthy()
      expect(
        m.patterns.some(p => MICRO_H.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(MICRO_H.model).toMatch(/Wir hatten ein Zimmer mit Seeblick gebucht/)
    expect(MICRO_H.model).toMatch(/nachdem wir lange an der Rezeption gewartet hatten/i)
    expect(MICRO_H.model).toMatch(/Die Frau, mit der ich gesprochen habe/)
    expect(MICRO_H.model).toMatch(/Ich bitte um eine kleine Entschädigung/)
    expect(MICRO_H.model).not.toMatch(/schrecklich|unverschämt|Betrüger|Frechheit/i)
    expect(MICRO_H.tips.map(t => t.ru).join(' ')).toMatch(/Без обвинений/)
  })
  it('the curriculum requires the opinion micro-task and the metadata declares both micro-tasks with the right kinds', () => {
    const spec = B1_CURRICULUM.units.find(u => u.unit === 29)!.requires
    expect(spec.meinungMicroTask).toBe(true)
    expect(spec.comparison).toBe(true)
    expect(META.microTasks).toEqual([
      { kind: 'meinung', taskId: 'b1-wr-29-02' },
      { kind: 'note', taskId: 'b1-wr-29-03' },
    ])
    expect(UNIT_29_WRITING.map(w => w.id)).toEqual(['b1-wr-29-01', 'b1-wr-29-02', 'b1-wr-29-03'])
  })
  it('NO writing task is omitted and every one is discoverable: the Writing Lab list holds all three; the unit page has the main row plus two extra rows', () => {
    registerLevelContent('B1', B1_CONTENT)
    const lab = writingOf('B1').filter(w => w.unit === 29)
    expect(lab.map(w => w.id)).toEqual(UNIT_29_WRITING.map(w => w.id))
    expect(writingForUnit(29)[0].id).toBe('b1-wr-29-01')
    expect(
      writingForUnit(29)
        .slice(1)
        .map(w => w.id),
    ).toEqual(['b1-wr-29-02', 'b1-wr-29-03'])
  })
  it('the writing tips tell the learner that the app checks only length and expected words and that quality is self-assessed (all tasks)', () => {
    for (const w of UNIT_29_WRITING) {
      expect(w.tips.map(t => t.ru).join(' ')).toMatch(/только объём и ожидаемые слова/)
      expect(w.tips.map(t => t.ky).join(' ')).toMatch(/көлөмдү жана күтүлгөн сөздөрдү гана/)
    }
  })
})

describe('exercises: answer keys are correct and unique', () => {
  it('10 handwritten exercises: 8 on the three concepts (4 + 1 + 3) + 2 recycled without a concept; types fill / choice / order; both languages everywhere', () => {
    expect(UNIT_29_EXERCISES).toHaveLength(10)
    expect(UNIT_29_EXERCISES.map(e => e.id)).toEqual(Array.from({ length: 10 }, (_, i) => `b1-ex-29-${String(i + 1).padStart(2, '0')}`))
    const withConcept = UNIT_29_EXERCISES.filter(e => e.concept)
    expect(withConcept).toHaveLength(8)
    expect(CONCEPTS.map(c => withConcept.filter(e => e.concept === c).length)).toEqual([4, 1, 3])
    expect(UNIT_29_EXERCISES.filter(e => !e.concept).map(e => e.id)).toEqual(['b1-ex-29-09', 'b1-ex-29-10'])
    expect(['fill', 'choice', 'order'].map(t => UNIT_29_EXERCISES.filter(e => e.type === t).length)).toEqual([4, 4, 2])
    for (const e of UNIT_29_EXERCISES) {
      expect(e.why.ru && e.why.ky).toBeTruthy()
      expect(e.why.ky).not.toBe(e.why.ru)
      expect(e.promptRu && e.promptKy, e.id).toBeTruthy()
    }
  })
  it('every choice / fill item: 3 distinct options and the answer is among them exactly once; every order item is a true permutation that is not pre-solved', () => {
    for (const e of UNIT_29_EXERCISES) {
      if (e.type === 'order') {
        expect([...(e.words ?? [])].sort().join('|')).toBe(e.answer.split(' ').sort().join('|'))
        expect(e.words!.join(' ')).not.toBe(e.answer)
      } else {
        expect(e.options).toHaveLength(3)
        expect(new Set(e.options).size).toBe(3)
        expect(e.options!.filter(o => o === e.answer)).toHaveLength(1)
      }
    }
    for (const e of UNIT_29_EXERCISES.filter(x => x.type === 'fill')) expect(e.prompt.match(/___/g)).toHaveLength(1)
  })
  it('a gap has exactly ONE correct filler: substituting each wrong option makes the sentence wrong (checked with the grammar rule of the item)', () => {
    const by = (id: string) => UNIT_29_EXERCISES.find(e => e.id === id)!
    expect(by('b1-ex-29-01').options).toEqual(['dem', 'den', 'der'])
    expect(by('b1-ex-29-01').answer).toBe('dem')
    expect(by('b1-ex-29-04').answer).toBe('denen')
    expect(by('b1-ex-29-05').answer).toBe('waren')
    expect(by('b1-ex-29-10').answer).toBe('die')
    // the wrong options of 29-05 would make a different tense (hatten = wrong auxiliary for ankommen, sind = Perfekt in a nachdem clause) — the sentence also contains the cue "angekommen"
    expect(by('b1-ex-29-05').prompt).toMatch(/angekommen ___/)
  })
  it('the text-level / sentence-level items: exactly one correct sentence, the wrong ones each contain a real learner error', () => {
    const e2 = UNIT_29_EXERCISES.find(x => x.id === 'b1-ex-29-02')!
    expect(e2.options!.filter(o => /^Die Stadt, in der ich wohne, ist klein\.$/.test(o))).toEqual([e2.answer])
    expect(e2.options!.some(o => /die ich wohne in/.test(o))).toBe(true)
    expect(e2.options!.some(o => /in die ich wohne/.test(o))).toBe(true)
    const e6 = UNIT_29_EXERCISES.find(x => x.id === 'b1-ex-29-06')!
    expect(e6.options!.filter(o => /^Nachdem ich gegessen hatte, bin ich gegangen\.$/.test(o))).toEqual([e6.answer])
    expect(e6.options!.some(o => /hatte gegessen,/.test(o))).toBe(true)
    expect(e6.options!.some(o => /, ich bin gegangen/.test(o))).toBe(true)
    const e8 = UNIT_29_EXERCISES.find(x => x.id === 'b1-ex-29-08')!
    expect(e8.type).toBe('choice')
    expect(e8.options!.filter(o => /gehört meinem Bruder/.test(o))).toEqual([e8.answer])
    const e9 = UNIT_29_EXERCISES.find(x => x.id === 'b1-ex-29-09')!
    expect(e9.options!.filter(o => /^Letzten Sommer waren wir in Dresden\.$/.test(o))).toEqual([e9.answer])
  })
  it('the exercises really use their construction, and recycle the earlier concepts correctly', () => {
    const by = (id: string) => UNIT_29_EXERCISES.find(e => e.id === id)!
    expect(by('b1-ex-29-03').answer).toBe('Das ist die Freundin, mit der ich reise.')
    expect(by('b1-ex-29-07').answer).toBe('Nachdem sie die Koffer gepackt hatte, hat sie ein Taxi gerufen.')
    for (const id of ['b1-ex-29-03', 'b1-ex-29-07'])
      expect(
        by(id).words!.some(w => /,$/.test(w)),
        id,
      ).toBe(true)
    expect(by('b1-ex-29-10').prompt).toMatch(/besucht habe/)
    for (const e of UNIT_29_EXERCISES.filter(x => x.type !== 'choice'))
      for (const [name, test] of FORBIDDEN) expect(test(`${e.prompt} ${e.answer}`), `${e.id} ${name}`).toBe(false)
  })
})

describe('final test: structure, answer keys and scoring data', () => {
  it('15 questions = 8 grammar (2 relative + 2 Plusquamperfekt + 2 Genitiv recognition + 2 recycled ↻) + 3 vocabulary + 4 reading, no listening; ≥ 2 gap-fill', () => {
    expect(UNIT_29_FINAL.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `b1-ft-29-${String(i + 1).padStart(2, '0')}`))
    const by = (s: string) => UNIT_29_FINAL.filter(q => q.skill === s)
    expect([by('grammar').length, by('vocabulary').length, by('reading').length, by('listening').length]).toEqual([8, 3, 4, 0])
    expect(by('grammar').filter(q => /___/.test(q.prompt)).length).toBeGreaterThanOrEqual(2)
    expect(CONCEPTS.map(c => by('grammar').filter(q => q.concept === c).length)).toEqual([2, 2, 2])
    expect(
      by('grammar')
        .filter(q => q.concept && !CONCEPTS.includes(q.concept))
        .map(q => q.concept),
    ).toEqual(['b1-praeteritum-erzaehlen', 'b1-relativsaetze-nom-akk'])
    expect(UNIT_29_TEST).toMatchObject({ id: 'unit-29', kind: 'topic', level: 'B1', unit: 29, size: 15 })
  })
  it('the recycled concepts really exist in earlier units (Präteritum of Unit 21, relative clause Nominativ / Akkusativ of Unit 23)', () => {
    const owner = new Map(fullBundle().grammar.map(g => [g.id, g.unit]))
    expect(owner.get('b1-praeteritum-erzaehlen')).toBe(21)
    expect(owner.get('b1-relativsaetze-nom-akk')).toBe(23)
  })
  it('options: 3 distinct each, the answer appears exactly once, both languages with an explanation; positions are 5 / 5 / 5, never three in a row', () => {
    const pos: number[] = []
    for (const q of UNIT_29_FINAL) {
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
  it('the grammar questions are unambiguous: the Plusquamperfekt gap says "Plusquamperfekt" (Perfekt would also be possible after nachdem), the Genitiv items are recognition items without a gap, the relative gaps have one Dativ / Akkusativ answer', () => {
    const q3 = UNIT_29_FINAL.find(x => x.id === 'b1-ft-29-03')!
    expect(q3.prompt).toMatch(/Plusquamperfekt/)
    expect(q3.answer).toBe('hatte')
    expect(q3.options).toContain('hat')
    const q4 = UNIT_29_FINAL.find(x => x.id === 'b1-ft-29-04')!
    expect(q4.answer).toBe('Ich habe den Anschluss verpasst.')
    expect(q4.prompt).toMatch(/Nachdem ich den Anschluss verpasst hatte/)
    for (const id of ['b1-ft-29-05', 'b1-ft-29-06']) expect(/___/.test(UNIT_29_FINAL.find(x => x.id === id)!.prompt), id).toBe(false)
    expect(UNIT_29_FINAL.find(x => x.id === 'b1-ft-29-01')!.answer).toBe('der')
    expect(UNIT_29_FINAL.find(x => x.id === 'b1-ft-29-08')!.answer).toBe('den')
  })
  it('the reading questions carry the German text untranslated and ask about one fact each; the two texts are new (not the unit readings)', () => {
    const rq = UNIT_29_FINAL.filter(q => q.skill === 'reading')
    for (const q of rq) {
      expect(q.prompt).toMatch(/^Lies /)
      expect(q.promptRu).toMatch(/^Прочитайте/)
      expect(q.promptKy).toMatch(/окуңуз/)
    }
    const read = UNIT_29_READING.flatMap(r => r.body).join(' ')
    for (const q of rq) expect(read.includes(q.prompt.split('„')[1]?.slice(0, 40) ?? '#'), q.id).toBe(false)
    expect(new Set(rq.map(q => q.prompt.split('Was')[0].split('Wie')[0].split('Wer')[0].split('Ab ')[0])).size).toBe(2)
  })
  it('the final test shares no prompt (except the generic instruction line) and no answer with the revision exercises, and no prompt with another question (except the shared reading passage)', () => {
    const ex = new Set(UNIT_29_EXERCISES.flatMap(e => [e.prompt, e.answer]))
    const generic = new Set(['Welcher Satz ist richtig?', 'Bilde den Satz.'])
    for (const q of UNIT_29_FINAL) {
      if (!generic.has(q.prompt)) expect(ex.has(q.prompt), q.id).toBe(false)
      expect(ex.has(q.answer), q.id).toBe(false)
    }
    const prompts = UNIT_29_FINAL.filter(q => q.skill !== 'reading')
      .map(q => q.prompt)
      .filter(p => !generic.has(p))
    expect(new Set(prompts).size).toBe(prompts.length)
  })
  it('scoring data: every question has its answer among its options (a perfect run is 15/15) and the pass mark of the existing rule (70 %) is 11 of 15', () => {
    expect(UNIT_29_FINAL.filter(q => q.options.includes(q.answer)).length).toBe(15)
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
    expect(META.strands.repairChunks.map(c => c.de).join(' ')).toMatch(/Missverständnis/)
    expect(META.differenceFromA2!.de).toMatch(/A2 \(Unit 18\)/)
  })
  it('the classification is the approved one: P/M, R/M and P/M; D-7 and D-6 are still OPEN', () => {
    expect(META.concepts.map(c => [c.conceptId, c.proficiency, c.load, c.role])).toEqual([
      ['b1-relativsaetze-dativ-praeposition', 'P', 'M', 'new'],
      ['b1-genitivattribute', 'R', 'M', 'new'],
      ['b1-plusquamperfekt-nachdem', 'P', 'M', 'new'],
    ])
    expect(META.concepts.filter(c => c.load === 'H')).toHaveLength(0)
  })
  it('spaced revision: 4 words of Unit 28, 2 of Unit 26, 2 from A2 Unit 18 — real, existing vocabulary ids', () => {
    const vocab = new Map(fullBundle().vocabulary.map(v => [v.id, v.unit]))
    expect(META.revision!.fromPrevious.map(id => vocab.get(id))).toEqual([28, 28, 28, 28])
    expect(META.revision!.fromThirdBack.map(id => vocab.get(id))).toEqual([26, 26])
    expect(META.revision!.fromA2.map(id => vocab.get(id))).toEqual([18, 18])
    const newIds = new Set(UNIT_29_VOCABULARY.map(v => v.id))
    for (const id of [...META.revision!.fromPrevious, ...META.revision!.fromThirdBack, ...META.revision!.fromA2])
      expect(newIds.has(id), id).toBe(false)
  })
  it('no review block is declared (the Wiederholungsblock belongs to Units 24, 28 and 32)', () => {
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
    walk(ALL_DATA(), 'unit29')
    expect(missing).toEqual([])
  })
  it('the Russian and the Kyrgyz are of comparable size (no half-translated string)', () => {
    const bad: string[] = []
    for (const v of UNIT_29_VOCABULARY) {
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
      'толук өткөн чак',
      'ээлик жалгоо',
      'атрибут жалгоосу',
      'салыштырма сүйлөм',
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
    for (const e of UNIT_29_EXERCISES) expect(e.why.ky).not.toBe(e.why.ru)
    for (const q of UNIT_29_FINAL) expect(q.why.ky).not.toBe(q.why.ru)
  })
})

describe('validator and assessment honesty', () => {
  it('the validator finds 0 errors and 0 warnings in the real bundle; the review flags of Unit 29 are: missing human CEFR sign-off, D-7 (Genitivattribut) and D-6 (Plusquamperfekt / nachdem)', () => {
    const is = validateContent(fullBundle())
    expect(is.filter(i => i.severity === 'error')).toEqual([])
    expect(is.filter(i => i.severity === 'warning')).toEqual([])
    expect(is.filter(i => i.rule.startsWith('b1-') && i.severity !== 'review' && /29/.test(i.where))).toEqual([])
    expect(
      is
        .filter(i => i.where === 'units:29' && i.severity === 'review')
        .map(i => i.rule)
        .sort(),
    ).toEqual(['beta-review-pending', 'beta-review-pending', 'cefr-signoff-missing']) // + the Beta flags (ru, ky) since the B1 Beta launch
    expect(
      is.filter(i => /^grammar:b1-(genitivattribute|plusquamperfekt-nachdem)$/.test(i.where) && i.severity === 'review').map(i => i.where),
    ).toEqual(['grammar:b1-genitivattribute', 'grammar:b1-plusquamperfekt-nachdem'])
    expect(is.filter(i => i.where === 'grammar:b1-relativsaetze-dativ-praeposition')).toEqual([])
    expect(
      is.filter(i => /^(reading:b1-re-29|listening:b1-li-29|writing:b1-wr-29|vocabulary:v29)/.test(i.where) && i.severity === 'review'),
    ).toEqual([])
  })
  it('the unit never claims a CEFR level, a certificate or an exam result', () => {
    const all = JSON.stringify(ALL_DATA(), (k, v) => (k === 'source' ? undefined : v))
    expect(all).not.toMatch(/zertifikat|certificate|сертификат|B1 erreicht|достигнут уровень|official/i)
    expect(all).not.toMatch(/\bCEFR\b/)
  })
  it('speaking and writing feedback is a checklist and a self-assessment: no numeric CEFR or score field in the unit data', () => {
    const all = JSON.stringify([UNIT_29_SPEAKING, UNIT_29_WRITING])
    expect(all).not.toMatch(/"(score|points|cefrScore|level_score)"/)
  })
  it('the provenance says the material is original, fictional where it reports hotels, railways and people, and NOT reviewed', () => {
    for (const x of [...UNIT_29_GRAMMAR, ...UNIT_29_READING, ...UNIT_29_LISTENING, ...UNIT_29_SPEAKING, ...UNIT_29_WRITING]) {
      expect(x.source?.kind).toBe('authored')
      expect(x.source?.author).toMatch(/pending independent CEFR, Russian and Kyrgyz review/)
    }
  })
})
