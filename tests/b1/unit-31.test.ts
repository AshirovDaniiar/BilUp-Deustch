// @vitest-environment node
/**
 * B1 Unit 31 — Behörden, Verträge und Alltagsprobleme (Stage 3M). Checks the authored content against the approved curriculum: identity, the two approved concepts (the formal register;
 * Aktiv ↔ Passiv with the Zustandspassiv on a closed list of ten participles, decision D-8 open), the RECEPTIVE Konjunktiv II der Vergangenheit, vocabulary (38–42, nothing already
 * taught), text sizes, the scope guard for receptive and later constructions — with REGRESSION samples proving that genuine out-of-scope German is still detected —, administrative-content
 * safety (every office, provider, document, deadline and contract term fictional and attributed to the fictional document; no law, no legal advice, no real company), RU/KY parity,
 * exercise / answer-key correctness, assessment structure, metadata, the writing tasks (incl. mediation and the required opinion) and their discoverability, the topic "emergency / police"
 * and the spaced revision. B1 stays `planned` and invisible; no CEFR approval of any kind is implied.
 */
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { lemmaKeys } from '../../scripts/content-validate/b1/lemma'
import { B1_CURRICULUM } from '../../scripts/content-validate/b1/curriculum'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_META } from '../../src/data/b1/meta'
import { B1_UNIT_PLAN } from '../../src/data/b1/registry'
import { UNIT_31_EXERCISES, UNIT_31_FINAL, UNIT_31_TEST } from '../../src/data/b1/unit31/assessment'
import { UNIT_31_GRAMMAR, UNIT_31_WHY_NOTES } from '../../src/data/b1/unit31/grammar'
import { UNIT_31_LISTENING, UNIT_31_READING, UNIT_31_SPEAKING, UNIT_31_WRITING } from '../../src/data/b1/unit31/texts'
import { UNIT_31 } from '../../src/data/b1/unit31/unit'
import { UNIT_31_VOCABULARY } from '../../src/data/b1/unit31/vocabulary'
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
const CONCEPTS = ['b1-formelle-sprache', 'b1-aktiv-passiv-zustandspassiv']
const META = B1_META.find(m => m.unit === 31)!
const [MAIN, MICRO_M, MICRO_O, MICRO_N] = UNIT_31_WRITING
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

/** the ONE place where the receptive Konjunktiv II der Vergangenheit may occur: the first paragraph of the contract reading and its gloss entry */
const KII_PAST_OK = new Set<string>([
  UNIT_31_READING[1].body[0],
  ...UNIT_31_READING[1].gloss.filter(g => /hätte/.test(g.word)).flatMap(g => [g.word, g.example]),
])

/** every correct or taught German string of the unit (distractors of choice items are deliberately wrong forms and are not taught) */
function germanTexts(): string[] {
  const out: string[] = []
  for (const r of UNIT_31_READING) out.push(...r.body, ...r.questions.flatMap(q => [q.q, q.options[q.answer]]))
  for (const l of UNIT_31_LISTENING) out.push(...l.lines.map(x => x.text), ...l.questions.flatMap(q => [q.q, q.options[q.answer]]))
  for (const v of UNIT_31_VOCABULARY) out.push(v.example)
  for (const g of UNIT_31_GRAMMAR)
    out.push(...g.examples.map(x => x.de), ...g.reallife.map(x => x.de), ...g.dialogue.map(x => x.text), g.speakPrompt.sample)
  for (const n of UNIT_31_WHY_NOTES) out.push(n.sentence, ...n.more.map(x => x.de))
  for (const e of UNIT_31_EXERCISES) out.push(e.prompt, e.answer)
  for (const q of UNIT_31_FINAL) out.push(q.prompt, q.answer)
  for (const w of UNIT_31_WRITING) out.push(w.model, w.mustInclude.map(m => m.label).join(' '))
  for (const s of UNIT_31_SPEAKING) out.push(...s.turns.flatMap(t => [t.ai, ...t.hints]))
  return out
}
const MISTAKES = new Set(UNIT_31_GRAMMAR.flatMap(g => g.mistakes.map(m => m.wrong)))
const taught = () => germanTexts().filter(t => !MISTAKES.has(t))

const ALL_DATA = () => [
  UNIT_31,
  UNIT_31_GRAMMAR,
  UNIT_31_WHY_NOTES,
  UNIT_31_READING,
  UNIT_31_LISTENING,
  UNIT_31_SPEAKING,
  UNIT_31_WRITING,
  UNIT_31_EXERCISES,
  UNIT_31_FINAL,
  UNIT_31_VOCABULARY,
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
  /^(Die|Der|Das|Den|Dem|Ein|Eine|Und|Aber|Oder|Denn|Dass|Ob|Als|Wie|Wo|Wann|Warum|Was|Wer|Ja|Nein|Gern|Auch|Nur|Noch|Schon|Leider|Danke|Bitte|Hier|Dort|Heute|Morgen|Jetzt|Ich|Er|Sie|Wir|Man|Es|Ihr|Du|Dann|Wenn|Weil|Frau|Herr|Dr|Falls|Sobald|Solange|Nachdem|Lies|Liebe|Liebes|Welcher|Welches|Daher|Dennoch|Erstens|Zweitens|Außerdem|Wird|Wurde|Ist|Sind|Hat|Haben|Kann|Können|Muss|Müssen|Gibt|Darf|Soll|Wäre|Wären|Könnten)$/
const GEN_WORDS = '(?:des|eines|der|einer|meiner|meines|seiner|seines|ihrer|ihres|unserer|unseres|deiner|deines)'
const genitivAttribute = (t: string) => {
  for (const m of t.matchAll(new RegExp(`\\b([A-ZÄÖÜ][a-zäöüß]+)\\s+${GEN_WORDS}\\s+(?:\\w+en\\s+)?([A-ZÄÖÜ][a-zäöüß]+)`, 'g')))
    if (!NOT_NOUN.test(m[1]) && !FUNCTION_WORD.test(m[1])) return true
  return false
}
/** Partizip II of verbs whose Perfekt is formed with sein (Was ist passiert? — a Perfekt, not a Zustandspassiv) */
const PERFEKT_SEIN = ['passiert', 'verunglückt', 'gelandet', 'erschienen', 'gelungen']
/** a Zustandspassiv (ist / sind + regular Partizip II) whose participle is NOT on the closed list of ten */
const zustandOutsideList = (t: string) =>
  [
    ...t.matchAll(/\b(?:ist|sind)\s+(?:\p{L}+\s+)?((?:\p{L}{2,5})?(?:ge|be|ver|er|ent|zer)\p{L}+t|\p{L}+iert)\s*(?:[.,!?;:]|und\b|$)/gu),
  ].some(m => !ZUSTAND.includes(m[1].toLowerCase()) && !PERFEKT_SEIN.includes(m[1].toLowerCase()))
/** a formal sentence that mixes the register: formal address together with du-forms */
const registerMix = (t: string) =>
  /(Sehr geehrte|Sehr geehrter|Mit freundlichen Grüßen)/.test(t) && /\b(du|dir|dich|dein|deine|deinen|kannst|willst|hast)\b/.test(t)

const FORBIDDEN: [string, (t: string) => boolean][] = [
  ['Passiv Perfekt (receptive in Unit 24 only)', t => /\bworden\b/i.test(t)],
  [
    'Futur II (B2)',
    t =>
      /\b(wird|werde|werden|wirst)\b[^.!?]*\b(\p{L}{2,5}ge\p{L}+(t|en)|ge\p{L}+(t|en)|\p{L}+iert|(be|ver|er|ent|zer|miss)\p{L}+(t|en)|bestanden|verstanden|begonnen|erreicht)\s+(haben|sein)\b/iu.test(
        t,
      ),
  ],
  ['Konjunktiv I / indirect speech in the subjunctive (B2)', t => /\b(er|sie|es|man)\s+sei\b|\bheiße es\b|\bgebe es\b|\bseien\b/i.test(t)],
  [
    'Konjunktiv II der Vergangenheit outside the one glossed reading (receptive)',
    t =>
      !KII_PAST_OK.has(t) &&
      /\b(hätte|hätten|hättest|wäre|wären)\b[^.!?,]*\b(sollen|müssen|können|wollen|dürfen|ge\w+(t|en)|\w+iert)\s*[.!?,]/i.test(t),
  ],
  ['Genitivattribut (receptive, Unit 29): none is used in Unit 31', genitivAttribute],
  ['Genitiv relative pronoun (not allocated)', t => /,\s*(?:\w+\s+)?(dessen|deren)\b/i.test(t)],
  ['ohne … zu / statt … zu (receptive, Units 23 and 26)', t => /\bohne\b[^.!?]*\bzu \w+\b|\bstatt\b[^.!?]*\bzu \w+\b/i.test(t)],
  [
    'einerseits / andererseits / nicht nur … sondern auch (receptive, Unit 22)',
    t => /einerseits|andererseits|nicht nur[^.!?]*sondern auch/i.test(t),
  ],
  [
    'Nomen-Verb-Verbindungen outside the closed list of Unit 30',
    t =>
      /in Betracht|zum Ausdruck|Abschied nehmen|Bilanz ziehen|in Erwägung|zur Diskussion|unter Beweis|Stellung beziehen|Maßnahmen ergreifen|Einfluss nehmen|Rechnung tragen|in Kraft|zur Anwendung|in Gang|Platz nehmen|Kritik üben|Bedeutung haben|Anzeige erstatten|Widerspruch einlegen|Antrag stellen|Einspruch erheben|Klage erheben|Kenntnis nehmen/.test(
        t,
      ),
  ],
  ['Zustandspassiv outside the closed list of ten participles', zustandOutsideList],
  ['register mix: formal address with du-forms', registerMix],
  [
    'law, legal advice and real authorities / companies (the unit invents all of them and gives no legal advice)',
    t =>
      /Gesetz|Paragraph|§|BGB|nach deutschem Recht|gesetzlich|Rechtsanspruch|rechtlich|Anwalt|Verbraucherzentrale|Datenschutzgrundverordnung|DSGVO|Aufenthaltsgesetz|Jobcenter|Ausländerbehörde|Finanzamt|Deutsche Post|Telekom|Vodafone|Allianz|Sie haben das Recht|Sie haben Anspruch|Sie sind verpflichtet|rechtsverbindlich garantiert/.test(
        t,
      ),
  ],
  ['real emergency numbers', t => /\b11[02]\b|Notrufnummer/.test(t)],
  [
    'claims about the real rules of a real country',
    t =>
      /In Deutschland (ist|sind|gibt|muss|darf|dürfen|kostet|haben|hat)|Die Deutschen|In Kirgistan (ist|sind|gibt)|In der Schweiz|In Österreich/.test(
        t,
      ),
  ],
]

describe('identity and integration (B1 is a Beta for ru and ky)', () => {
  it('the unit equals its approved plan entry', () => {
    const plan = B1_UNIT_PLAN.find(p => p.id === 31)!
    expect(UNIT_31).toMatchObject({ id: 31, key: plan.key, title: plan.titleDe, level: 'B1' })
    expect(plan.key).toBe('b1-behoerden-recht')
    expect(plan.titleDe).toBe('Behörden, Verträge und Alltagsprobleme')
    expect(UNIT_31.grammarIds).toEqual(CONCEPTS)
  })
  it('the content module holds Unit 31 after Units 21–30, wired into the metadata, the tests, the final tests and the speaking list', () => {
    expect(B1_CONTENT.units.map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_META.map(m => m.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.tests).toContainEqual(UNIT_31_TEST)
    expect(B1_CONTENT.unitSpeaking.slice(0, 11).at(-1)).toBe('b1-sp-31-01')
    expect(B1_CONTENT.finalTests.map(f => f.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
  })
  it('B1 is a Beta: released for ru and ky only, offered to those interfaces and never to the German one', () => {
    expect(courseLevel('B1')).toMatchObject({ status: 'beta', releasedLocales: ['ru', 'ky'] })
    for (const lang of ['ru', 'ky'] as const) expect(availableLevels(lang)).toContain('B1')
    expect(availableLevels('de')).not.toContain('B1')
  })
  it('registered in the catalog, the unit is reachable through the standard selectors; the main writing task comes first; the Writing Lab holds all four', () => {
    registerLevelContent('B1', B1_CONTENT)
    expect(vocabularyForUnit(31)).toHaveLength(40)
    expect(grammarForUnit(31).map(g => g.id)).toEqual(CONCEPTS)
    expect(finalTestOfUnit(31)?.questions).toHaveLength(15)
    expect(topicTestOfUnit(31)).toMatchObject({ id: 'unit-31', level: 'B1', size: 15 })
    expect(speakingForUnit(31)).toBe('b1-sp-31-01')
    const ids = ['b1-wr-31-01', 'b1-wr-31-02', 'b1-wr-31-03', 'b1-wr-31-04']
    expect(writingForUnit(31).map(w => w.id)).toEqual(ids)
    const lab = writingOf('B1').map(w => w.id)
    for (const id of ids) expect(lab).toContain(id)
  })
})

describe('grammar: only the two approved concepts, plus the receptive Konjunktiv II der Vergangenheit', () => {
  it('exactly the approved ids, in order, owned by Unit 31, level B1; the curriculum classification is P / P (D-8 pending on the second)', () => {
    expect(UNIT_31_GRAMMAR.map(g => g.id)).toEqual(CONCEPTS)
    for (const g of UNIT_31_GRAMMAR) expect(g).toMatchObject({ unit: 31, level: 'B1' })
    const spec = B1_CURRICULUM.units.find(u => u.unit === 31)!
    expect(spec.concepts.map(c => c.id)).toEqual(CONCEPTS)
    expect(spec.concepts.map(c => c.proficiency)).toEqual(['P', 'P'])
    expect(spec.concepts[0].expertReview).toBeUndefined()
    expect(spec.concepts[1].expertReview).toMatchObject({ status: 'pending', decision: 'D-8' })
  })
  it('every concept is complete: explanation, 5 examples, mistakes, real-life, dialogue, speaking prompt — in Russian and in Kyrgyz', () => {
    for (const g of UNIT_31_GRAMMAR) {
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
  it('the why-notes: two on the formal register, two on Passiv / Zustandspassiv', () => {
    expect(UNIT_31_WHY_NOTES.map(n => n.conceptId)).toEqual([CONCEPTS[0], CONCEPTS[0], CONCEPTS[1], CONCEPTS[1]])
  })
  it('the examples really show their concept', () => {
    const fm = UNIT_31_GRAMMAR[0].examples.map(x => x.de).join(' ')
    for (const re of [
      /^Sehr geehrte Frau Berger/,
      /Ich bitte um eine schriftliche Bestätigung/,
      /Ich möchte Sie bitten, [^.]* zu \w+/,
      /Könnten Sie mir bitte mitteilen/,
      /Mit freundlichen Grüßen/,
    ])
      expect(fm, String(re)).toMatch(re)
    const pv = UNIT_31_GRAMMAR[1].examples.map(x => x.de).join(' ')
    for (const re of [
      /wird von der Behörde bearbeitet/,
      /muss bis Freitag eingereicht werden/,
      /wird gerade ausgefüllt/,
      /ist ausgefüllt und unterschrieben/,
      /ist heute geschlossen/,
    ])
      expect(pv, String(re)).toMatch(re)
  })
  it('every "mistake" really differs from its correction, and the wrong form never appears in the taught texts', () => {
    for (const g of UNIT_31_GRAMMAR) for (const m of g.mistakes) expect(m.wrong).not.toBe(m.right)
    const wrong = UNIT_31_GRAMMAR.flatMap(g => g.mistakes.map(m => m.wrong))
    for (const t of taught()) expect(wrong.includes(t), t).toBe(false)
  })
  it('scope guard: nothing receptive-only, later or outside the closed lists is used outside its one allowed place', () => {
    for (const t0 of taught())
      for (const [name, test] of FORBIDDEN) {
        const t = t0.replace(/Liebe[rn]? \w+, /g, '')
        expect(test(t), `${name}: "${t.slice(0, 90)}"`).toBe(false)
      }
  })
  it('REGRESSION of the scope guard: genuine out-of-scope German IS still detected, and the allowed phrases are not flagged', () => {
    const bad: [string, string][] = [
      ['Passiv Perfekt (receptive in Unit 24 only)', 'Das Fahrrad ist gestern gestohlen worden.'],
      ['Futur II (B2)', 'Bis morgen wird er das Formular ausgefüllt haben.'],
      ['Konjunktiv I / indirect speech in the subjunctive (B2)', 'Das Amt sagt, er sei krank.'],
      ['Konjunktiv II der Vergangenheit outside the one glossed reading (receptive)', 'Ich hätte den Termin beachten sollen.'],
      ['Konjunktiv II der Vergangenheit outside the one glossed reading (receptive)', 'Wir wären gern früher gekommen.'],
      ['Genitivattribut (receptive, Unit 29): none is used in Unit 31', 'Der Antrag des Kunden ist unvollständig.'],
      ['Genitiv relative pronoun (not allocated)', 'Das ist der Mann, dessen Antrag fehlt.'],
      ['ohne … zu / statt … zu (receptive, Units 23 and 26)', 'Er geht, ohne sich zu melden.'],
      ['Nomen-Verb-Verbindungen outside the closed list of Unit 30', 'Ich möchte Widerspruch einlegen.'],
      ['Nomen-Verb-Verbindungen outside the closed list of Unit 30', 'Sie müssen einen Antrag stellen.'],
      ['Zustandspassiv outside the closed list of ten participles', 'Ihre Zahlung ist bestätigt.'],
      ['Zustandspassiv outside the closed list of ten participles', 'Die Rechnung sind bezahlt, und der Vertrag ist gekündigt.'],
      ['register mix: formal address with du-forms', 'Sehr geehrte Frau Berger, kannst du mir helfen?'],
      [
        'law, legal advice and real authorities / companies (the unit invents all of them and gives no legal advice)',
        'Nach dem Gesetz müssen Sie die Frist einhalten.',
      ],
      [
        'law, legal advice and real authorities / companies (the unit invents all of them and gives no legal advice)',
        'Sie haben das Recht auf Verlängerung.',
      ],
      [
        'law, legal advice and real authorities / companies (the unit invents all of them and gives no legal advice)',
        'Mein Vertrag mit der Telekom läuft aus.',
      ],
      ['real emergency numbers', 'Rufen Sie 112 an.'],
      ['claims about the real rules of a real country', 'In Deutschland ist die Kündigung immer schriftlich.'],
    ]
    for (const [name, text] of bad) expect(FORBIDDEN.find(([n]) => n === name)![1](text), `${name}: "${text}" must be detected`).toBe(true)
    const ok: string[] = [
      'Ihr Antrag ist geprüft und wird jetzt weitergeleitet.',
      'Das Formular ist ausgefüllt und unterschrieben.',
      'Die Tür ist zu: Das Amt ist heute geschlossen.',
      'Leider ist Ihr Antrag abgelehnt.',
      'Ihr Antrag ist eingegangen und wird gerade bearbeitet.',
      'Wir sind gestern angekommen.',
      'Der Antrag ist leider unvollständig.',
      'Sehr geehrte Frau Berger, könnten Sie mir bitte helfen?',
      'Hallo Mira, kannst du mir helfen?',
      'Wenn ich mehr Zeit hätte, würde ich persönlich kommen.',
      'Danke. Wird der Antrag bald genehmigt?',
      'Ist der Antrag schon geprüft?',
      'Ich hätte gern einen Termin.',
      'Laut diesen Vertragsbedingungen ist eine Kündigung nur schriftlich möglich.',
      'Das Amt schreibt, dass dein Antrag unvollständig ist.',
    ]
    for (const text of ok) for (const [name, test] of FORBIDDEN) expect(test(text), `${name}: "${text}" must NOT be flagged`).toBe(false)
  })
  it('the formal register is PRODUCTIVE: Anrede and Gruß, the three request patterns, formal verbs — and the formal tasks never use du-forms', () => {
    const all = taught().join(' ')
    for (const re of [
      /Sehr geehrte Frau/,
      /Sehr geehrte Damen und Herren/,
      /Sehr geehrter Herr/,
      /Mit freundlichen Grüßen/,
      /Ich bitte um /,
      /Ich möchte Sie bitten, [^.]* zu \w+/,
      /Könnten Sie mir bitte mitteilen/,
      /Vielen Dank im Voraus/,
    ])
      expect(all, String(re)).toMatch(re)
    for (const v of ['mitteilen', 'beantragen', 'bestätigen', 'vorlegen', 'nachreichen'])
      expect(
        UNIT_31_VOCABULARY.map(x => x.de),
        v,
      ).toContain(v)
    for (const w of [MAIN, MICRO_N]) {
      expect(w.formal, w.id).toBe(true)
      expect(w.model, w.id).not.toMatch(/\b(du|dir|dich|dein\w*|kannst|hast)\b/)
    }
    expect(MICRO_M.formal).toBe(false)
    expect(MICRO_M.model).toMatch(/\bdein\b|\bdu\b/)
    expect(META.concepts[0]).toMatchObject({ conceptId: 'b1-formelle-sprache', proficiency: 'P', load: 'L', role: 'new' })
  })
  it('Aktiv ↔ Passiv and the Vorgang / Zustand contrast: many Passiv sentences with werden (Präsens and with a modal verb), the Vorgangspassiv always with a time cue and the Zustandspassiv only with the closed list of ten participles', () => {
    const all = taught().join(' ')
    expect((all.match(/\b(wird|werden) [^.?!,]*\b\w+t\b/g) ?? []).length).toBeGreaterThanOrEqual(12)
    expect(all).toMatch(/muss [^.]* werden\./)
    expect(all).toMatch(/müssen [^.]* werden\./)
    expect(all).toMatch(/kann [^.]* werden\./)
    expect((all.match(/wird gerade \w+/g) ?? []).length).toBeGreaterThanOrEqual(3)
    const used = ZUSTAND.filter(p => new RegExp(`\\b(ist|sind) ([\\p{L} ]{0,24})?${p}\\b|\\b${p} (ist|sind)\\b`, 'u').test(all))
    expect(used.length).toBeGreaterThanOrEqual(8)
    for (const p of ['ausgefüllt', 'unterschrieben', 'geschlossen', 'geprüft', 'bearbeitet']) expect(used, p).toContain(p)
    expect(META.concepts[1]).toMatchObject({ conceptId: 'b1-aktiv-passiv-zustandspassiv', proficiency: 'P', load: 'M', role: 'new' })
    expect(META.concepts[1].constructions![0]).toMatchObject({ proficiency: 'P-lim' })
    for (const p of ZUSTAND) expect(META.concepts[1].constructions![0].label).toContain(p)
    for (const p of ZUSTAND) expect(UNIT_31_GRAMMAR[1].summary.ru, p).toContain(p)
    for (const p of ZUSTAND) expect(UNIT_31_GRAMMAR[1].summary.ky, p).toContain(p)
  })
  it('the Konjunktiv II der Vergangenheit is RECEPTIVE: exactly one reading contains it, with a gloss in both languages; it is never in a gap, an order item, a checklist or a speaking hint', () => {
    const readings = UNIT_31_READING.filter(r => /hätte [^.]*sollen/.test(r.body.join(' ')))
    expect(readings.map(r => r.id)).toEqual(['b1-re-31-02'])
    const g = UNIT_31_READING[1].gloss.find(x => /hätte/.test(x.word))!
    expect(g.ru && g.ky && g.ky !== g.ru).toBeTruthy()
    expect(g.grammar).toMatch(/только для чтения|только для понимания|для чтения/)
    expect(g.grammarKy).toMatch(/окуу үчүн гана/)
    expect(META.receptiveOnly![0]).toMatchObject({ proficiency: 'R' })
    const production = [
      ...UNIT_31_EXERCISES.flatMap(e => [e.prompt, e.answer, ...(e.options ?? []), ...(e.words ?? [])]),
      ...UNIT_31_FINAL.flatMap(q => [q.prompt, q.answer, ...q.options]),
      ...UNIT_31_SPEAKING.flatMap(s => s.turns.flatMap(t => [...t.hints, ...t.keywords])),
      ...UNIT_31_WRITING.flatMap(w => [w.model, ...w.mustInclude.flatMap(m => [m.label, ...m.patterns])]),
      ...UNIT_31_LISTENING.flatMap(l => l.lines.map(x => x.text)),
    ].join(' ')
    expect(production).not.toMatch(/hätte [^.]*sollen|hätte [^.]*müssen|wäre [^.]* gewesen/)
    expect(MAIN.tips.map(t => t.ru).join(' ')).toMatch(/Конъюнктив II прошедшего времени/)
  })
  it('REGRESSION of the Zustandspassiv guard: participles outside the closed list are detected, the Perfekt with sein and adjectives are not', () => {
    for (const t of [
      'Ihre Zahlung ist bestätigt.',
      'Der Vertrag ist gekündigt.',
      'Das Paket ist zugestellt.',
      'Die Rechnung ist bezahlt und der Antrag ist verlängert.',
    ])
      expect(zustandOutsideList(t), t).toBe(true)
    for (const t of [
      'Der Antrag ist geprüft.',
      'Das Formular ist ausgefüllt und unterschrieben.',
      'Ihr Antrag ist eingegangen.',
      'Wir sind angekommen.',
      'Was ist passiert?',
      'Gestern ist ein Unfall passiert.',
      'Das ist nett.',
      'Der Antrag ist unvollständig.',
      'Die Frist ist kurz.',
      'Das Amt ist geöffnet.',
    ])
      expect(zustandOutsideList(t), t).toBe(false)
  })
})

describe('administrative content: educational, fictional, attributed — no law, no legal advice, no real office or company', () => {
  it('every reading and listening is labelled as invented; the speaking scenario and the tasks say so in the learner’s language', () => {
    for (const r of UNIT_31_READING) expect(`${r.title} ${r.body.join(' ')}`, r.id).toMatch(/erfunden|Erfundene/)
    for (const l of UNIT_31_LISTENING) expect(l.title, l.id).toMatch(/erfunden/)
    expect(UNIT_31_READING[0].body[0]).toMatch(/^Erfundenes Behördenschreiben/)
    expect(UNIT_31_READING[1].body[0]).toMatch(/^Erfundene E-Mail/)
    expect(UNIT_31_READING[1].body[1]).toMatch(/^Antwort von NordNetz \(erfunden\)/)
    expect(UNIT_31_SPEAKING[0].goal.ru).toMatch(/вымышлен/)
    expect(UNIT_31_SPEAKING[0].goal.ky).toMatch(/ойдон чыгарылган/)
    for (const w of [MAIN, MICRO_N]) {
      expect(w.situation.ru, w.id).toMatch(/вымышлен/)
      expect(w.situation.ky, w.id).toMatch(/ойдон чыгарылган/)
    }
    for (const q of UNIT_31_FINAL.filter(x => x.skill === 'reading')) expect(q.prompt, q.id).toMatch(/\(erfunden\)/)
  })
  it('every deadline and every contract term is ATTRIBUTED to the fictional document or scenario and never stated as a general rule', () => {
    const r1 = UNIT_31_READING[0].body
    expect(r1.find(p => /20\. Mai/.test(p))).toMatch(/Diese Frist gilt nur für dieses Schreiben/)
    const r2 = UNIT_31_READING[1].body
    expect(r2[1]).toMatch(/Laut diesen Vertragsbedingungen ist eine Kündigung nur schriftlich möglich/)
    expect(r2[1]).toMatch(/Alle Angaben gelten nur für diesen Beispielvertrag/)
    expect(r2[1]).toMatch(/Laut diesen Vertragsbedingungen beginnt die Frist/)
    const l1 = UNIT_31_LISTENING[0].lines.map(x => x.text)
    expect(l1.find(t => /zwanzigsten Mai/.test(t))).toMatch(/^Laut unserem Schreiben/)
    expect(l1.find(t => /zwei Wochen/.test(t))).toMatch(/^Laut unserem Schreiben/)
    const sp = UNIT_31_SPEAKING[0].turns[4].ai
    expect(sp).toMatch(/Laut unserem Schreiben bis zum zwanzigsten Mai\. Diese Frist gilt nur für dieses Schreiben/)
    for (const q of UNIT_31_FINAL.filter(x => /3\. Juni|nur schriftlich möglich/.test(x.prompt)))
      expect(q.prompt, q.id).toMatch(/laut (diesem Schreiben|diesen Vertragsbedingungen)|Beispielvertrag/)
    expect(UNIT_31_READING[0].questions[1].q).toMatch(/laut diesem Schreiben/)
    expect(UNIT_31_READING[1].questions[1].q).toMatch(/laut diesen Vertragsbedingungen/)
    expect(MICRO_M.situation.ru).toMatch(/согласно письму/)
    expect(META.strands.strategyNote!.de).toMatch(/gelten nur für dieses Schreiben oder diesen Vertrag/)
    expect(META.strands.strategyNote!.ru).toMatch(/действуют только для этого письма/)
    expect(META.strands.strategyNote!.ky).toMatch(/ушул катка же ушул келишимге гана таандык/)
  })
  it('the police dialogue gives no legal advice: the officer sends the caller to her insurance, which handles the damage "nach ihren eigenen Regeln"', () => {
    const t = UNIT_31_LISTENING[1].lines.map(x => x.text).join(' ')
    expect(t).toMatch(/Das müssen Sie bei Ihrer Versicherung erfragen\. Sie meldet den Schaden nach ihren eigenen Regeln/)
    expect(t).not.toMatch(/müssen Sie innerhalb|ist gesetzlich|nach dem Gesetz|haben Sie das Recht/)
    expect(UNIT_31_LISTENING[1].title).toMatch(/erfunden/)
    expect(UNIT_31_LISTENING[1].lines[0].text).toMatch(/Polizeiwache Brunnenau/)
  })
  it('no text states a law, gives legal advice, names a real authority, company or emergency number, or invents the rules of a real country', () => {
    const all = JSON.stringify(ALL_DATA(), (k, v) => (k === 'source' ? undefined : v))
    for (const [name, test] of FORBIDDEN.filter(([n]) => /^(law|real emergency|claims about)/.test(n))) expect(test(all), name).toBe(false)
    for (const t of taught()) expect(/Gesetz|Paragraph|§|Recht auf|Anspruch auf/.test(t), t).toBe(false)
  })
  it('all offices, providers, people and file numbers are fictional and recognisable as such (Brunnenau, NordNetz, "Beispielvertrag", "erfunden")', () => {
    const all = JSON.stringify(ALL_DATA(), (k, v) => (k === 'source' ? undefined : v))
    expect(all).toMatch(/Bürgeramt Brunnenau/)
    expect(all).toMatch(/NordNetz/)
    expect(all).toMatch(/Beispielvertrag/)
    expect(all).toMatch(/Aktenzeichen 17-0425/)
    expect(UNIT_31_READING[0].body[0]).toMatch(/Aktenzeichen 17-0425:/)
    expect(UNIT_31_SOURCE_NOTICE()).toBe(true)
  })
})

function UNIT_31_SOURCE_NOTICE(): boolean {
  return UNIT_31_GRAMMAR.every(g => /pending independent CEFR, Russian and Kyrgyz review/.test(g.source!.author!))
}

describe('vocabulary: 40 new items, none already taught', () => {
  const b = fullBundle()
  const earlier = new Set(b.vocabulary.filter(v => v.unit <= 30).flatMap(v => lemmaKeys(v.de)))
  it('exactly 40 items (target 38–42), ids v31-1 … v31-40, unique across the whole B1 vocabulary', () => {
    expect(UNIT_31_VOCABULARY).toHaveLength(40)
    expect(UNIT_31_VOCABULARY.map(v => v.id)).toEqual(Array.from({ length: 40 }, (_, i) => `v31-${i + 1}`))
    expect(UNIT_31_VOCABULARY.every(v => v.unit === 31)).toBe(true)
    const ids = B1_CONTENT.vocabulary.map(v => v.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toHaveLength(480)
  })
  it('no lemma repeats an A1, A2 or earlier B1 headword (Amt, Antrag, Formular, Frist, Unterlagen, Widerspruch, Vertrag … are NOT repeated), and none is listed twice', () => {
    const keys = UNIT_31_VOCABULARY.flatMap(v => lemmaKeys(v.de))
    expect(keys.filter(k => earlier.has(k))).toEqual([])
    expect(new Set(keys).size).toBe(keys.length)
    const de = UNIT_31_VOCABULARY.map(v => v.de)
    for (const known of [
      'Amt',
      'Antrag',
      'Formular',
      'Frist',
      'Unterlagen',
      'Widerspruch',
      'Vertrag',
      'Kündigung',
      'Anzeige',
      'Termin',
      'Gebühr',
      'Unterschrift',
      'Auskunft',
      'Notruf',
      'Unfall',
      'einreichen',
      'verlängern',
      'vereinbaren',
      'kündigen',
      'widersprechen',
      'Öffnungszeiten',
      'Rechnung',
      'Kunde',
    ])
      expect(de).not.toContain(known)
  })
  it('every item has article/plural where a noun, a German example, and independent Russian and Kyrgyz translations of the word and the example', () => {
    for (const v of UNIT_31_VOCABULARY) {
      if (v.pos === 'noun') expect(v.article, v.de).toBeTruthy()
      for (const f of [v.de, v.ru, v.ky, v.example, v.exampleRu, v.exampleKy ?? '']) expect(f.trim().length, v.id).toBeGreaterThan(1)
      expect(v.ky).not.toBe(v.ru)
      expect(v.exampleKy).not.toBe(v.exampleRu)
    }
    const ex = UNIT_31_VOCABULARY.map(v => v.example)
    expect(new Set(ex).size).toBe(ex.length)
    expect(UNIT_31_VOCABULARY.filter(v => v.pos === 'noun')).toHaveLength(25)
    expect(UNIT_31_VOCABULARY.filter(v => v.pos === 'verb')).toHaveLength(10)
    expect(UNIT_31_VOCABULARY.filter(v => v.pos === 'adj')).toHaveLength(5)
    for (const v of UNIT_31_VOCABULARY) expect(genitivAttribute(v.example), v.id).toBe(false)
  })
  it('the planned themes are present (Bescheid, Frist-related words, Aktenzeichen, Zuständigkeit, Versicherung, Schaden, Polizei, Zeuge, contract terms)', () => {
    const de = UNIT_31_VOCABULARY.map(v => v.de)
    for (const w of [
      'Behörde',
      'Bescheid',
      'Zuständigkeit',
      'Sachbearbeiter',
      'Aktenzeichen',
      'Nachweis',
      'Vollmacht',
      'Genehmigung',
      'Ansprechpartner',
      'Anlage',
      'Laufzeit',
      'Vertragsbedingung',
      'Anbieter',
      'Tarif',
      'Mahnung',
      'Zahlungsfrist',
      'Schaden',
      'Versicherung',
      'Polizei',
      'Zeuge',
      'Diebstahl',
      'beantragen',
      'mitteilen',
      'nachreichen',
      'bearbeiten',
      'genehmigen',
      'zuständig',
      'vollständig',
      'unvollständig',
      'verbindlich',
      'erforderlich',
    ])
      expect(de, w).toContain(w)
  })
  it('Wortbildung strand: compounds, -er, -ung, -ig / -lich, un- are present as items and explained in the metadata in three languages', () => {
    const de = UNIT_31_VOCABULARY.map(v => v.de)
    for (const w of [
      'Aktenzeichen',
      'Zahlungsfrist',
      'Ansprechpartner',
      'Anbieter',
      'Sachbearbeiter',
      'Bestätigung',
      'Genehmigung',
      'zuständig',
      'verbindlich',
      'unvollständig',
    ])
      expect(de, w).toContain(w)
    const n = META.strands.wortbildungNote!
    expect(n.de && n.ru && n.ky).toBeTruthy()
    expect(n.ky).not.toBe(n.ru)
    for (const w of ['Aktenzeichen', '-er', '-ung', 'un-']) expect(n.de).toContain(w)
  })
  it('the unit REUSES the established administrative words as revision in its texts without listing them as new', () => {
    const all = germanTexts().join(' ')
    for (const w of [
      'Antrag',
      'Formular',
      'Frist',
      'Unterlagen',
      'Vertrag',
      'Termin',
      'Unterschrift',
      'Öffnungszeiten',
      'einreichen|eingereicht',
      'verlängern',
      'Ausweis',
      'Kündigung',
      'Zahlung',
    ])
      expect(all, w).toMatch(new RegExp(w))
  })
})

describe('texts: progressive targets (band for Units 30–31 and the curriculum text for Unit 31)', () => {
  it('2 readings of 150–170 words and 2 listening scripts of 140–170 words', () => {
    expect(UNIT_31_READING).toHaveLength(2)
    expect(UNIT_31_LISTENING).toHaveLength(2)
    for (const r of UNIT_31_READING) {
      const n = r.body.reduce((a, p) => a + words(p), 0)
      expect(n, r.id).toBeGreaterThanOrEqual(150)
      expect(n, r.id).toBeLessThanOrEqual(170)
    }
    for (const l of UNIT_31_LISTENING) {
      const n = l.lines.reduce((a, x) => a + words(x.text), 0)
      expect(n, l.id).toBeGreaterThanOrEqual(140)
      expect(n, l.id).toBeLessThanOrEqual(170)
    }
  })
  it('sentences stay short (95th percentile ≤ 20, longest ≤ 26 words)', () => {
    const lens = [
      ...UNIT_31_READING.flatMap(r => r.body.flatMap(sentences)),
      ...UNIT_31_LISTENING.flatMap(l => l.lines.flatMap(x => sentences(x.text))),
    ]
      .map(words)
      .sort((a, b) => a - b)
    expect(lens[lens.length - 1]).toBeLessThanOrEqual(26)
    expect(lens[Math.ceil(0.95 * lens.length) - 1]).toBeLessThanOrEqual(20)
  })
  it('every dialogue line carries a Russian and a Kyrgyz translation; questions have 3 distinct options, exactly one correct; answer positions vary', () => {
    for (const l of UNIT_31_LISTENING) for (const x of l.lines) expect(x.ru && x.ky && x.ky !== x.ru).toBeTruthy()
    const qs = [...UNIT_31_LISTENING.flatMap(l => l.questions), ...UNIT_31_READING.flatMap(r => r.questions)]
    for (const q of qs) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options).size).toBe(3)
      expect(q.answer).toBeGreaterThanOrEqual(0)
      expect(q.answer).toBeLessThan(3)
    }
    expect(new Set(UNIT_31_READING.flatMap(r => r.questions.map(q => q.answer))).size).toBe(3)
    expect(new Set(UNIT_31_LISTENING.flatMap(l => l.questions.map(q => q.answer))).size).toBe(3)
  })
  it('the listening keywords all have a gloss in the unit vocabulary', () => {
    const de = new Set(UNIT_31_VOCABULARY.map(v => v.de))
    for (const l of UNIT_31_LISTENING) for (const k of l.keywords) expect(de.has(k), `${l.id}: ${k}`).toBe(true)
  })
  it('the listening dialogues are coherent: greeting and closing; the phone call moves from the status to the missing document, the deadline (laut Schreiben) and a written confirmation; the police dialogue from the report to the next steps', () => {
    const l1 = UNIT_31_LISTENING[0].lines.map(x => x.text)
    expect(l1[0]).toMatch(/Bürgeramt Brunnenau, guten Tag/)
    expect(l1.at(-1)).toMatch(/Auf Wiederhören/)
    const idx = (re: RegExp) => l1.findIndex(t => re.test(t))
    expect(idx(/Aktenzeichen/)).toBeLessThan(idx(/fehlt noch der Nachweis/))
    expect(idx(/fehlt noch der Nachweis/)).toBeLessThan(idx(/zwanzigsten Mai/))
    expect(idx(/zwanzigsten Mai/)).toBeLessThan(idx(/schriftlich zu bestätigen/))
    const l2 = UNIT_31_LISTENING[1].lines.map(x => x.text)
    expect(l2[0]).toMatch(/Polizeiwache Brunnenau, guten Tag/)
    expect(l2.join(' ')).toMatch(/Ein Zeuge hat einen jungen Mann mit einer grünen Jacke gesehen/)
    expect(l2.join(' ')).toMatch(
      /Haben Sie Ihren Ausweis dabei, damit ich Ihre Daten prüfen kann\?[^]*Leider nicht, weil er zu Hause liegt/,
    )
  })
  it('the listening answer keys agree with the script (every correct option is supported by the text, no distractor is)', () => {
    const t1 = UNIT_31_LISTENING[0].lines.map(x => x.text).join(' ')
    expect(UNIT_31_LISTENING[0].questions.map(q => q.options[q.answer])).toEqual([
      'Er möchte wissen, wie es mit seinem Antrag steht.',
      'Der Nachweis über den Wohnort.',
      'Auch per Post.',
      'Eine schriftliche Bestätigung.',
    ])
    expect(t1).toMatch(/Ich rufe wegen meines Antrags an/)
    expect(t1).toMatch(/Leider fehlt noch der Nachweis über Ihren Wohnort/)
    expect(t1).toMatch(/kann auch per Post nachgereicht werden/)
    expect(t1).toMatch(/Sie erhalten die Bestätigung heute noch/)
    expect(t1).not.toMatch(/zurückziehen|abholen|genehmigte Formular/)
    const t2 = UNIT_31_LISTENING[1].lines.map(x => x.text).join(' ')
    expect(UNIT_31_LISTENING[1].questions.map(q => q.options[q.answer])).toEqual([
      'Einen Diebstahl.',
      'Einen jungen Mann mit einer grünen Jacke.',
      'Der Ausweis, den sie später vorlegen kann.',
      'Ihre Versicherung.',
    ])
    expect(t2).toMatch(/Ich möchte einen Diebstahl melden/)
    expect(t2).toMatch(/Kann ich ihn später vorlegen\?[^]*Ja, das geht/)
    expect(t2).not.toMatch(/Verkehrsunfall|Wohnungsschaden|Vermieter/)
  })
  it('the reading answer keys agree with the text', () => {
    const [r1, r2] = UNIT_31_READING
    const t1 = r1.body.join(' ')
    expect(r1.questions.map(q => q.options[q.answer])).toEqual([
      'steht nicht im Text',
      'Bis zum 20. Mai.',
      'Dem Amt vorher Bescheid geben.',
    ])
    expect(t1).toMatch(/noch der Nachweis über Ihren Wohnort fehlt/)
    expect(t1).toMatch(/Bitte reichen Sie den Nachweis bis zum 20\. Mai nach/)
    expect(t1).toMatch(/Falls Sie die Frist nicht einhalten können, teilen Sie uns das bitte vorher mit/)
    const t2 = r2.body.join(' ')
    expect(r2.questions.map(q => q.options[q.answer])).toEqual(['steht nicht im Text', 'Nur schriftlich.', 'Herr Wolf.'])
    expect(t2).toMatch(/Könnten Sie mir bitte mitteilen, ob eine Kündigung jetzt noch möglich ist/)
    expect(t2).toMatch(/Kündigung nur schriftlich möglich/)
    expect(t2).toMatch(/Bei Fragen ist Herr Wolf Ihr Ansprechpartner/)
  })
  it('the reading glosses give Russian and Kyrgyz for every word, independently, and gloss Vorgang / Zustand, the modal Passiv, the formal verbs, the receptive Konjunktiv II der Vergangenheit and the source of the deadline', () => {
    for (const r of UNIT_31_READING) for (const g of r.gloss) expect(g.ky).not.toBe(g.ru)
    for (const r of UNIT_31_READING) for (const g of r.gloss) expect(g.grammarKy).not.toBe(g.grammar)
    const gl = UNIT_31_READING.flatMap(r => r.gloss.map(g => `${g.word} ${g.ru} ${g.grammar}`)).join(' ')
    for (const re of [
      /Vorgangspassiv|процесс/,
      /Zustandspassiv/,
      /модальн/,
      /Konjunktiv II der Vergangenheit/,
      /форма Sie/,
      /laut \+ Dativ/,
    ])
      expect(gl).toMatch(re)
  })
  it('listening uses the existing browser text-to-speech lab: no audio file, no claim of verified playback; no assessment item depends on audio', () => {
    for (const l of UNIT_31_LISTENING) expect(Object.keys(l)).not.toContain('audio')
    for (const q of UNIT_31_FINAL) expect(q.skill).not.toBe('listening')
  })
  it('speaking: one scenario of 7 turns = status → Aktenzeichen → Passiv status → a missing document (unexpected) → the deadline (laut Schreiben) → who decides → summary; the hints practise the formal request patterns and Passiv', () => {
    const [s] = UNIT_31_SPEAKING
    expect(s.turns).toHaveLength(7)
    expect(s.level).toBe('B1')
    for (const t of s.turns) {
      expect(t.aiRu && t.aiKy).toBeTruthy()
      expect(t.hints.length).toBeGreaterThanOrEqual(3)
      expect(t.keywords.length).toBeGreaterThanOrEqual(3)
      for (const k of t.keywords) expect(k).toBe(k.toLowerCase())
    }
    expect(s.turns[0].hints.join(' ')).toMatch(/Könnten Sie mir bitte mitteilen, wie es mit meinem Antrag steht/)
    expect(s.turns[2].ai).toMatch(/wird gerade bearbeitet\. Das Formular ist ausgefüllt/)
    expect(s.turns[2].hints.join(' ')).toMatch(/Könnten Sie mir bitte mitteilen, welche Unterlagen noch gebraucht werden/)
    expect(s.turns[3].ai).toMatch(/Leider fehlt noch ein Dokument/)
    expect(s.turns[3].hints.join(' ')).toMatch(/Moment, ich überlege kurz/)
    expect(s.turns[4].hints.join(' ')).toMatch(/Ich möchte Sie bitten, mir die Frist schriftlich zu bestätigen/)
    expect(s.turns[5].ai).toMatch(/Sachbearbeiter entscheiden/)
    expect(s.turns[6].hints.join(' ')).toMatch(/Auf Wiederhören/)
    expect(META.scenario.id).toBe('b1-sp-31-01')
    expect(s.goal.ru).toMatch(/самооценка/)
    expect(s.goal.ru).toMatch(/не закону/)
  })
})

describe('writing: the formal enquiry and the micro-tasks (mediation, opinion, formal note), all discoverable', () => {
  it('main task: FORMAL, 70 words minimum (within the formal band 60–90), six expected elements, a model that meets every one and keeps the formal register', () => {
    expect(MAIN).toMatchObject({ id: 'b1-wr-31-01', minWords: 70, level: 'B1', unit: 31, formal: true })
    expect(words(MAIN.model)).toBeGreaterThanOrEqual(70)
    expect(MAIN.mustInclude).toHaveLength(6)
    for (const m of MAIN.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky).toBeTruthy()
      expect(m.explain!.ky).not.toBe(m.explain!.ru)
      expect(
        m.patterns.some(p => MAIN.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(MAIN.model).toMatch(/^Sehr geehrte Damen und Herren,/)
    expect(MAIN.model).toMatch(/Könnten Sie mir bitte mitteilen/)
    expect(MAIN.model).toMatch(/Ich bitte um eine schriftliche Antwort/)
    expect(MAIN.model).toMatch(/wird noch bearbeitet/)
    expect(MAIN.model).toMatch(/Laut Ihren Vertragsbedingungen/)
    expect(MAIN.model).toMatch(/Vielen Dank im Voraus\. Mit freundlichen Grüßen/)
    for (const t of MAIN.tips) expect(t.ky).not.toBe(t.ru)
  })
  it('the main task uses only allowed constructions in its model and does not require the receptive Konjunktiv II der Vergangenheit or a Genitiv', () => {
    for (const [name, test] of FORBIDDEN) expect(test(MAIN.model), name).toBe(false)
    for (const m of MAIN.mustInclude)
      expect(
        m.patterns.some(p => /hätte|wäre|\b(des|eines)\b/.test(p)),
        m.label,
      ).toBe(false)
    expect(MAIN.tips.map(t => t.ru).join(' ')).toMatch(/со ссылкой/)
    expect(MAIN.tips.map(t => t.ky).join(' ')).toMatch(/шилтеме/)
  })
  it('the mediation micro-task (kind "mediation", required by the curriculum): relays the office letter in own words, informal (du), facts with their source, no invented consequences', () => {
    expect(MICRO_M).toMatchObject({ id: 'b1-wr-31-02', minWords: 30, level: 'B1', unit: 31, formal: false })
    expect(words(MICRO_M.model)).toBeGreaterThanOrEqual(30)
    expect(MICRO_M.mustInclude).toHaveLength(4)
    for (const m of MICRO_M.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky && m.explain.ky !== m.explain.ru).toBeTruthy()
      expect(
        m.patterns.some(p => MICRO_M.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(MICRO_M.model).toMatch(/^Das Amt schreibt, dass dein Antrag unvollständig ist/)
    expect(MICRO_M.model).toMatch(/bis zum 20\. Mai nachreichen, das steht im Brief/)
    expect(MICRO_M.model).not.toMatch(/Strafe|Geld verlieren|sonst/)
    expect(sentences(MICRO_M.model.replace(/(\d+)\./g, '$1')).length).toBeLessThanOrEqual(6)
    expect(MICRO_M.tips.map(t => t.ru).join(' ')).toMatch(/это вопрос к учреждению/)
    expect(MICRO_M.situation.ru).toMatch(/двух-трёх предложениях/)
  })
  it('the opinion micro-task (kind "meinung", required by the curriculum): opinion + reason + another view, and an honest pointer to ask the office', () => {
    expect(MICRO_O).toMatchObject({ id: 'b1-wr-31-03', minWords: 30, level: 'B1', unit: 31, formal: false })
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
    expect(MICRO_O.model).toMatch(/Andere finden einen Brief besser/)
    expect(MICRO_O.model).toMatch(/Dennoch frage ich vorher, was das Amt wünscht/)
    expect(MICRO_O.tips.map(t => t.ru).join(' ')).toMatch(/спросить у самого учреждения/)
    expect(MICRO_O.tips.map(t => t.ru).join(' ')).toMatch(/только ваше мнение/)
  })
  it('the formal note (kind "note"): Anrede, a brief reason without health details, a polite request for a new appointment, thanks and Gruß', () => {
    expect(MICRO_N).toMatchObject({ id: 'b1-wr-31-04', minWords: 30, level: 'B1', unit: 31, formal: true })
    expect(words(MICRO_N.model)).toBeGreaterThanOrEqual(30)
    expect(MICRO_N.mustInclude).toHaveLength(4)
    for (const m of MICRO_N.mustInclude) {
      expect(m.explain?.ru && m.explain?.ky && m.explain.ky !== m.explain.ru).toBeTruthy()
      expect(
        m.patterns.some(p => MICRO_N.model.toLowerCase().includes(p)),
        m.label,
      ).toBe(true)
    }
    expect(MICRO_N.model).toMatch(/^Sehr geehrte Frau Berger/)
    expect(MICRO_N.model).toMatch(/weil ich krank war/)
    expect(MICRO_N.model).not.toMatch(/Diagnose|Fieber|Grippe|Magen|Medikament|Tablette|Arzt/i)
    expect(MICRO_N.model).toMatch(/Könnten Sie mir bitte einen neuen Termin mitteilen/)
    expect(MICRO_N.model).toMatch(/Mit freundlichen Grüßen/)
    expect(MICRO_N.tips.map(t => t.ru).join(' ')).toMatch(/krank/)
    expect(MICRO_N.situation.ru).toMatch(/Не пишите подробностей о здоровье/)
  })
  it('the curriculum requires the opinion AND the mediation micro-task; the metadata declares all three micro-tasks with the right kinds', () => {
    const spec = B1_CURRICULUM.units.find(u => u.unit === 31)!.requires
    expect(spec.meinungMicroTask).toBe(true)
    expect(spec.mediationMicroTask).toBe(true)
    expect(spec.topics).toEqual(['emergency-police'])
    expect(META.microTasks).toEqual([
      { kind: 'mediation', taskId: 'b1-wr-31-02' },
      { kind: 'meinung', taskId: 'b1-wr-31-03' },
      { kind: 'note', taskId: 'b1-wr-31-04' },
    ])
    expect(UNIT_31_WRITING.map(w => w.id)).toEqual(['b1-wr-31-01', 'b1-wr-31-02', 'b1-wr-31-03', 'b1-wr-31-04'])
  })
  it('NO writing task is omitted and every one is discoverable: the Writing Lab list holds all four; the unit page has the main row plus three extra rows', () => {
    registerLevelContent('B1', B1_CONTENT)
    const lab = writingOf('B1').filter(w => w.unit === 31)
    expect(lab.map(w => w.id)).toEqual(UNIT_31_WRITING.map(w => w.id))
    expect(writingForUnit(31)[0].id).toBe('b1-wr-31-01')
    expect(
      writingForUnit(31)
        .slice(1)
        .map(w => w.id),
    ).toEqual(['b1-wr-31-02', 'b1-wr-31-03', 'b1-wr-31-04'])
  })
  it('the writing tips tell the learner that the app checks only length and expected words and that quality is self-assessed (all tasks)', () => {
    for (const w of UNIT_31_WRITING) {
      expect(w.tips.map(t => t.ru).join(' ')).toMatch(/только объём и ожидаемые слова/)
      expect(w.tips.map(t => t.ky).join(' ')).toMatch(/көлөмдү жана күтүлгөн сөздөрдү гана/)
    }
  })
})

describe('the required topic "emergency / police" and the spaced revision', () => {
  it('the topic is evidenced by real items of the unit (vocabulary Schaden, Versicherung, Polizei, Zeuge, Diebstahl, melden and the police dialogue)', () => {
    const topic = META.topics!.find(t => t.topic === 'emergency-police')!
    expect(META.topics!.map(t => t.topic)).toEqual(['emergency-police'])
    const items = new Set([
      ...UNIT_31_VOCABULARY.map(v => v.id),
      ...UNIT_31_READING.map(r => r.id),
      ...UNIT_31_LISTENING.map(l => l.id),
      ...UNIT_31_EXERCISES.map(e => e.id),
      ...UNIT_31_WRITING.map(w => w.id),
      'b1-sp-31-01',
      'b1-sp-32-01',
    ])
    for (const id of topic.itemIds) expect(items.has(id), id).toBe(true)
    const names = topic.itemIds.filter(id => id.startsWith('v31-')).map(id => UNIT_31_VOCABULARY.find(v => v.id === id)!.de)
    expect(names).toEqual(['Schaden', 'Versicherung', 'Polizei', 'Zeuge', 'Diebstahl', 'melden'])
    expect(topic.itemIds).toContain('b1-li-31-02')
  })
  it('spaced revision: 4 words of Unit 30, 2 of Unit 28, 2 from A2 — real, existing vocabulary ids, none of them new in Unit 31', () => {
    const vocab = new Map(fullBundle().vocabulary.map(v => [v.id, v.unit]))
    expect(META.revision!.fromPrevious.map(id => vocab.get(id))).toEqual([30, 30, 30, 30])
    expect(META.revision!.fromThirdBack.map(id => vocab.get(id))).toEqual([28, 28])
    expect(META.revision!.fromA2.map(id => vocab.get(id))).toEqual([19, 19])
    const newIds = new Set(UNIT_31_VOCABULARY.map(v => v.id))
    for (const id of [...META.revision!.fromPrevious, ...META.revision!.fromThirdBack, ...META.revision!.fromA2])
      expect(newIds.has(id), id).toBe(false)
    expect(META.revision!.block).toBeUndefined()
  })
})

describe('exercises: answer keys are correct and unique', () => {
  it('10 handwritten exercises: 8 on the two concepts (4 + 4) + 2 recycled without a concept; types fill / choice / order; both languages everywhere', () => {
    expect(UNIT_31_EXERCISES).toHaveLength(10)
    expect(UNIT_31_EXERCISES.map(e => e.id)).toEqual(Array.from({ length: 10 }, (_, i) => `b1-ex-31-${String(i + 1).padStart(2, '0')}`))
    const withConcept = UNIT_31_EXERCISES.filter(e => e.concept)
    expect(withConcept).toHaveLength(8)
    expect(CONCEPTS.map(c => withConcept.filter(e => e.concept === c).length)).toEqual([4, 4])
    expect(UNIT_31_EXERCISES.filter(e => !e.concept).map(e => e.id)).toEqual(['b1-ex-31-09', 'b1-ex-31-10'])
    expect(['fill', 'choice', 'order'].map(t => UNIT_31_EXERCISES.filter(e => e.type === t).length)).toEqual([4, 4, 2])
    for (const e of UNIT_31_EXERCISES) {
      expect(e.why.ru && e.why.ky).toBeTruthy()
      expect(e.why.ky).not.toBe(e.why.ru)
      expect(e.promptRu && e.promptKy, e.id).toBeTruthy()
    }
  })
  it('every choice / fill item: 3 distinct options and the answer is among them exactly once; every order item is a true permutation that is not pre-solved', () => {
    for (const e of UNIT_31_EXERCISES) {
      if (e.type === 'order') {
        expect([...(e.words ?? [])].sort().join('|')).toBe(e.answer.split(' ').sort().join('|'))
        expect(e.words!.join(' ')).not.toBe(e.answer)
      } else {
        expect(e.options).toHaveLength(3)
        expect(new Set(e.options).size).toBe(3)
        expect(e.options!.filter(o => o === e.answer)).toHaveLength(1)
      }
    }
    for (const e of UNIT_31_EXERCISES.filter(x => x.type === 'fill')) expect(e.prompt.match(/___/g)).toHaveLength(1)
  })
  it('the werden / sein gaps have exactly ONE correct filler because of a clear cue (gerade → werden; "Die Tür ist zu" → sein; plural subject → werden)', () => {
    const by = (id: string) => UNIT_31_EXERCISES.find(e => e.id === id)!
    expect(by('b1-ex-31-05').prompt).toMatch(/gerade/)
    expect(by('b1-ex-31-05').answer).toBe('wird')
    expect(by('b1-ex-31-08').prompt).toMatch(/Die Tür ist zu/)
    expect(by('b1-ex-31-08').answer).toBe('ist')
    expect(by('b1-ex-31-10').prompt).toMatch(/Die Unterlagen/)
    expect(by('b1-ex-31-10').answer).toBe('werden')
    expect(by('b1-ex-31-10').options).not.toContain('ist')
    expect(by('b1-ex-31-01').answer).toBe('zu')
  })
  it('the sentence-level items: exactly one correct sentence, the wrong ones each contain a real learner error', () => {
    const by = (id: string) => UNIT_31_EXERCISES.find(e => e.id === id)!
    const e2 = by('b1-ex-31-02')
    expect(e2.options!.filter(o => /^Könnten Sie mir bitte mitteilen/.test(o))).toEqual([e2.answer])
    expect(e2.options!.some(o => /^Sag mir mal/.test(o))).toBe(true)
    const e4 = by('b1-ex-31-04')
    expect(e4.options!.filter(o => /^Sehr geehrte/.test(o))).toEqual([e4.answer])
    const e6 = by('b1-ex-31-06')
    expect(e6.options!.filter(o => /^Die Unterlagen werden von der Behörde geprüft\.$/.test(o))).toEqual([e6.answer])
    expect(e6.options!.some(o => /wird von der Behörde prüfen/.test(o))).toBe(true)
    expect(e6.options!.some(o => /sind von der Behörde prüft/.test(o))).toBe(true)
    const e9 = by('b1-ex-31-09')
    expect(e9.options!.filter(o => /^Wenn ich mehr Zeit hätte, würde ich persönlich kommen\.$/.test(o))).toEqual([e9.answer])
  })
  it('the exercises really use their construction, with the Passiv order item having the modal verb in position 2, and stay inside the guards', () => {
    const by = (id: string) => UNIT_31_EXERCISES.find(e => e.id === id)!
    expect(by('b1-ex-31-03').answer).toBe('Ich bitte um eine schriftliche Bestätigung.')
    expect(by('b1-ex-31-07').answer).toBe('Das Formular muss bis Freitag eingereicht werden.')
    for (const e of UNIT_31_EXERCISES.filter(x => x.type !== 'choice'))
      for (const [name, test] of FORBIDDEN) expect(test(`${e.prompt} ${e.answer}`), `${e.id} ${name}`).toBe(false)
  })
})

describe('final test: structure, answer keys and scoring data', () => {
  it('15 questions = 8 grammar (3 formal register + 3 Aktiv/Passiv/Zustand + 2 recycled ↻) + 3 vocabulary + 4 reading, no listening; ≥ 2 gap-fill', () => {
    expect(UNIT_31_FINAL.map(q => q.id)).toEqual(Array.from({ length: 15 }, (_, i) => `b1-ft-31-${String(i + 1).padStart(2, '0')}`))
    const by = (s: string) => UNIT_31_FINAL.filter(q => q.skill === s)
    expect([by('grammar').length, by('vocabulary').length, by('reading').length, by('listening').length]).toEqual([8, 3, 4, 0])
    expect(by('grammar').filter(q => /___/.test(q.prompt)).length).toBeGreaterThanOrEqual(2)
    expect(CONCEPTS.map(c => by('grammar').filter(q => q.concept === c).length)).toEqual([3, 3])
    expect(
      by('grammar')
        .filter(q => q.concept && !CONCEPTS.includes(q.concept))
        .map(q => q.concept),
    ).toEqual(['b1-konjunktiv2-wuensche-irreal', 'b1-passiv-praeteritum-modal'])
    expect(UNIT_31_TEST).toMatchObject({ id: 'unit-31', kind: 'topic', level: 'B1', unit: 31, size: 15 })
  })
  it('the recycled concepts really exist in earlier units (Konjunktiv II of Unit 27, Passiv with a modal verb of Unit 26)', () => {
    const owner = new Map(fullBundle().grammar.map(g => [g.id, g.unit]))
    expect(owner.get('b1-konjunktiv2-wuensche-irreal')).toBe(27)
    expect(owner.get('b1-passiv-praeteritum-modal')).toBe(26)
  })
  it('options: 3 distinct each, the answer appears exactly once, both languages with an explanation; positions are 5 / 5 / 5, never three in a row', () => {
    const pos: number[] = []
    for (const q of UNIT_31_FINAL) {
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
  it('the grammar questions are unambiguous: the Vorgang question has a time cue, the Zustand question has "das Büro ist zu", the Passiv rewrite has one correct form, the register question has one formal sentence', () => {
    const q = (id: string) => UNIT_31_FINAL.find(x => x.id === id)!
    expect(q('b1-ft-31-01').options.filter(o => /^Könnten Sie mir bitte mitteilen/.test(o))).toEqual([q('b1-ft-31-01').answer])
    expect(q('b1-ft-31-02').answer).toBe('Grüßen')
    expect(q('b1-ft-31-03').answer).toBe('um')
    expect(q('b1-ft-31-04').options.filter(o => /^Der Antrag wird von der Behörde geprüft\.$/.test(o))).toEqual([q('b1-ft-31-04').answer])
    expect(q('b1-ft-31-05').prompt).toMatch(/gerade/)
    expect(q('b1-ft-31-05').answer).toMatch(/wird gerade geschlossen/)
    expect(q('b1-ft-31-06').prompt).toMatch(/Das Büro ist zu/)
    expect(q('b1-ft-31-06').options.filter(o => /^Das Büro ist geschlossen\.$/.test(o))).toEqual([q('b1-ft-31-06').answer])
    expect(q('b1-ft-31-07').answer).toBe('hätte')
    expect(q('b1-ft-31-08').answer).toBe('unterschrieben')
  })
  it('the reading questions carry the German text untranslated, name the fictional source in the question about a deadline or a condition, and the two texts are new (not the unit readings)', () => {
    const rq = UNIT_31_FINAL.filter(q => q.skill === 'reading')
    for (const q of rq) {
      expect(q.prompt).toMatch(/^Lies /)
      expect(q.promptRu).toMatch(/^Прочитайте/)
      expect(q.promptKy).toMatch(/окуңуз/)
    }
    const read = UNIT_31_READING.flatMap(r => r.body).join(' ')
    for (const q of rq) {
      const passage = q.prompt.split('„').slice(1).join('„')
      for (let i = 0; i + 40 <= passage.length; i += 30) expect(read.includes(passage.slice(i, i + 40)), `${q.id} @${i}`).toBe(false)
    }
    expect(new Set(rq.map(q => q.prompt.split('“')[0])).size).toBe(2)
    expect(rq[1].prompt).toMatch(/laut diesem Schreiben/)
    expect(rq[2].prompt).toMatch(/laut dieser E-Mail/)
  })
  it('the final test shares no prompt (except the generic instruction line) and no answer with the revision exercises, and no prompt with another question (except the shared reading passage)', () => {
    const ex = new Set(UNIT_31_EXERCISES.flatMap(e => [e.prompt, e.answer]))
    const generic = new Set(['Welcher Satz ist richtig?', 'Bilde den Satz.'])
    for (const q of UNIT_31_FINAL) {
      if (!generic.has(q.prompt)) expect(ex.has(q.prompt), q.id).toBe(false)
      expect(ex.has(q.answer), q.id).toBe(false)
    }
    const prompts = UNIT_31_FINAL.filter(q => q.skill !== 'reading')
      .map(q => q.prompt)
      .filter(p => !generic.has(p))
    expect(new Set(prompts).size).toBe(prompts.length)
  })
  it('scoring data: every question has its answer among its options (a perfect run is 15/15) and the pass mark of the existing rule (70 %) is 11 of 15', () => {
    expect(UNIT_31_FINAL.filter(q => q.options.includes(q.answer)).length).toBe(15)
    expect(Math.ceil(0.7 * 15)).toBe(11)
  })
})

describe('unit metadata and objectives', () => {
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
    expect(META.differenceFromA2!.de).toMatch(/A2 \(Unit 19\)/)
    expect(META.strands.strategyNote!.de).toMatch(/Mediation/)
  })
  it('the classification is the approved one: P/L (formal register) and P/M (Aktiv/Passiv with a limited Zustandspassiv, D-8 open); no H concept', () => {
    expect(META.concepts.map(c => [c.conceptId, c.proficiency, c.load, c.role])).toEqual([
      ['b1-formelle-sprache', 'P', 'L', 'new'],
      ['b1-aktiv-passiv-zustandspassiv', 'P', 'M', 'new'],
    ])
    expect(META.concepts.filter(c => c.load === 'H')).toHaveLength(0)
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
    walk(ALL_DATA(), 'unit31')
    expect(missing).toEqual([])
  })
  it('the Russian and the Kyrgyz are of comparable size (no half-translated string)', () => {
    const bad: string[] = []
    for (const v of UNIT_31_VOCABULARY) {
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
      'жаңы жакшы',
      'эрксиз ыңгай',
      'абал тукуму',
      'пассив тукуму',
      'жат этиш',
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
    for (const e of UNIT_31_EXERCISES) expect(e.why.ky).not.toBe(e.why.ru)
    for (const q of UNIT_31_FINAL) expect(q.why.ky).not.toBe(q.why.ru)
  })
})

describe('validator and assessment honesty', () => {
  it('the validator finds 0 errors and 0 warnings in the real bundle (the receptive Konjunktiv II der Vergangenheit raises no unexpected issue); the review flags of Unit 31 are: missing human CEFR sign-off and the open decision D-8 (Zustandspassiv)', () => {
    const is = validateContent(fullBundle())
    expect(is.filter(i => i.severity === 'error')).toEqual([])
    expect(is.filter(i => i.severity === 'warning')).toEqual([])
    expect(is.filter(i => i.rule.startsWith('b1-') && i.severity !== 'review' && /31/.test(i.where))).toEqual([])
    expect(is.filter(i => i.rule === 'b1-receptive-required')).toEqual([])
    expect(
      is
        .filter(i => i.where === 'units:31' && i.severity === 'review')
        .map(i => i.rule)
        .sort(),
    ).toEqual(['beta-review-pending', 'beta-review-pending', 'cefr-signoff-missing']) // + the Beta flags (ru, ky) since the B1 Beta launch
    expect(is.filter(i => i.where === 'grammar:b1-aktiv-passiv-zustandspassiv' && i.severity === 'review').map(i => i.rule)).toEqual([
      'b1-expert-review-pending',
    ])
    expect(is.filter(i => i.where === 'grammar:b1-formelle-sprache')).toEqual([])
    expect(
      is.filter(i => /^(reading:b1-re-31|listening:b1-li-31|writing:b1-wr-31|vocabulary:v31)/.test(i.where) && i.severity === 'review'),
    ).toEqual([])
  })
  it('the unit never claims a CEFR level, a certificate or an exam result', () => {
    const all = JSON.stringify(ALL_DATA(), (k, v) => (k === 'source' ? undefined : v))
    expect(all).not.toMatch(/zertifikat|certificate|сертификат|B1 erreicht|достигнут уровень|official/i)
    expect(all).not.toMatch(/\bCEFR\b/)
  })
  it('speaking and writing feedback is a checklist and a self-assessment: no numeric CEFR or score field in the unit data', () => {
    const all = JSON.stringify([UNIT_31_SPEAKING, UNIT_31_WRITING])
    expect(all).not.toMatch(/"(score|points|cefrScore|level_score)"/)
  })
  it('the provenance says the material is original, fictional where it reports offices, providers and documents, and NOT reviewed — and NOT German law or legal advice', () => {
    for (const x of [...UNIT_31_GRAMMAR, ...UNIT_31_READING, ...UNIT_31_LISTENING, ...UNIT_31_SPEAKING, ...UNIT_31_WRITING]) {
      expect(x.source?.kind).toBe('authored')
      expect(x.source?.author).toMatch(/pending independent CEFR, Russian and Kyrgyz review/)
    }
  })
})
