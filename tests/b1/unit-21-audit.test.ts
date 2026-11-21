// @vitest-environment node
/**
 * B1 Unit 21 — Stage 3B quality audit: regression tests for every DEFECT the audit confirmed (so none can return) and the answer-key / scoring checks.
 * None of this is a native-speaker or CEFR review; it pins mechanical, verifiable properties only.
 */
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { UNIT_21_EXERCISES, UNIT_21_FINAL } from '../../src/data/b1/unit21/assessment'
import { UNIT_21_GRAMMAR, UNIT_21_WHY_NOTES } from '../../src/data/b1/unit21/grammar'
import { UNIT_21_LISTENING, UNIT_21_READING, UNIT_21_SPEAKING, UNIT_21_WRITING } from '../../src/data/b1/unit21/texts'
import { UNIT_21_VOCABULARY } from '../../src/data/b1/unit21/vocabulary'
import { finalTestQuestions, fromExercise } from '../../src/features/tests/questions'

/** every Kyrgyz string of the unit */
function kyTexts(): string[] {
  const out: string[] = []
  for (const v of UNIT_21_VOCABULARY) out.push(v.ky, v.exampleKy ?? '')
  for (const g of UNIT_21_GRAMMAR) {
    for (const l of [g.title, g.summary, g.discover, g.why, ...g.when, g.speakPrompt.prompt, ...g.mistakes.map(m => m.note)])
      out.push(l.ky ?? '')
    for (const x of [...g.examples, ...g.reallife, ...g.dialogue]) out.push(x.ky ?? '')
  }
  for (const n of UNIT_21_WHY_NOTES) out.push(n.ky ?? '', n.reason.ky ?? '', ...n.more.map(x => x.ky ?? ''))
  for (const e of UNIT_21_EXERCISES) out.push(e.promptKy ?? '', e.why.ky ?? '')
  for (const q of UNIT_21_FINAL) out.push(q.promptKy ?? '', q.why.ky)
  for (const l of UNIT_21_LISTENING) out.push(...l.lines.map(x => x.ky ?? ''))
  for (const r of UNIT_21_READING) for (const g of r.gloss) out.push(g.ky, g.grammarKy ?? '')
  for (const s of UNIT_21_SPEAKING) out.push(s.titleKy ?? '', s.goal.ky ?? '', ...s.turns.map(t => t.aiKy ?? ''))
  for (const w of UNIT_21_WRITING) out.push(w.situation.ky ?? '', ...w.tips.map(t => t.ky ?? ''))
  return out
}

describe('Kyrgyz terminology follows the project glossary policy (docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md)', () => {
  it('no grammar label that the A2 policy deliberately avoids or that is not a recognised term: describe the idea instead', () => {
    const all = kyTexts().join('\n')
    for (const bad of ['бүтүндөмө', 'жакталган', 'бөлүнүүчү', 'жөндөлгөн этиш', 'ээрчимелүү'])
      expect(all, `label "${bad}"`).not.toContain(bad)
  })
  it('«уңгу» (stem) is used only for the verb STEM; the separable prefix is called «приставка», as in A2', () => {
    const all = kyTexts().join('\n')
    expect(all).not.toMatch(/уңгу[^\n]{0,40}(сүйлөмдүн аягына|аягына өтөт|аягына чыгат)/)
    expect(all).toMatch(/приставка/)
  })
  it('Kyrgyz is never a copy of the Russian, and every Kyrgyz text is written in Cyrillic', () => {
    for (const t of kyTexts().filter(Boolean)) expect(/[Ѐ-ӿ]/.test(t) || /^[\d\s.,!?«»…-]+$/.test(t), t.slice(0, 40)).toBe(true)
    for (const v of UNIT_21_VOCABULARY) expect(v.ky).not.toBe(v.ru)
  })
})

describe('confirmed defects stay fixed', () => {
  const DETERMINERS = new Set([
    'der',
    'die',
    'das',
    'dem',
    'den',
    'des',
    'ein',
    'eine',
    'einen',
    'einem',
    'einer',
    'eines',
    'mein',
    'meine',
    'meinen',
    'meinem',
    'meiner',
    'unser',
    'unsere',
    'unseren',
    'dein',
    'deine',
    'deinen',
    'sein',
    'seine',
    'seinen',
    'ihr',
    'ihre',
    'ihren',
    'kein',
    'keine',
    'keinen',
    'diese',
    'diesen',
    'diesem',
    'dieser',
    'sehr',
    'beim',
    'zum',
    'zur',
    'im',
  ])
  const ADJECTIVES = [
    'große',
    'großes',
    'großen',
    'kleine',
    'kleinen',
    'schöne',
    'schönes',
    'starke',
    'starker',
    'starken',
    'laute',
    'lauten',
    'alte',
    'alten',
    'alter',
    'freundliche',
    'tolle',
    'neue',
    'neuen',
    'neuer',
    'erste',
    'ersten',
    'erstes',
    'ganze',
    'ganzen',
    'lange',
    'langen',
    'zweiten',
    'besondere',
    'besonderen',
  ] // fixed time phrases (letzte Woche, nächstes Jahr) are A1/A2 and deliberately not listed
  it('SCOPE: no adjective without an article (that is the Unit 24 concept) — "große Schmerzen" had slipped into reading 2', () => {
    const texts = [
      ...UNIT_21_READING.flatMap(r => r.body),
      ...UNIT_21_LISTENING.flatMap(l => l.lines.map(x => x.text)),
      ...UNIT_21_VOCABULARY.map(v => v.example),
      ...UNIT_21_WRITING.map(w => w.model),
      ...UNIT_21_FINAL.flatMap(q => [q.prompt, ...q.options]),
    ]
    const hits: string[] = []
    for (const t of texts) {
      const tokens = t
        .replace(/[„“”.,!?:;()–—]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
      tokens.forEach((w, i) => {
        if (
          ADJECTIVES.includes(w.toLowerCase()) &&
          /^[A-ZÄÖÜ]/.test(tokens[i + 1] ?? '') &&
          !DETERMINERS.has((tokens[i - 1] ?? '').toLowerCase())
        )
          hits.push(`${tokens[i - 1] ?? '^'} ${w} ${tokens[i + 1]} — ${t.slice(0, 50)}`)
      })
    }
    expect(hits).toEqual([])
  })
  it('the dialogue is coherent: Murat asks about the feelings only AFTER Jana has told what they did', () => {
    const lines = UNIT_21_LISTENING[0].lines.map(l => l.text)
    const idx = (s: string) => lines.findIndex(l => l.includes(s))
    expect(idx('Wir sind in ein Café gegangen')).toBeGreaterThan(idx('Was habt ihr dann gemacht'))
    expect(idx('wie hast du dich gefühlt')).toBeGreaterThan(idx('Wir sind in ein Café gegangen'))
    expect(idx('Zuerst war ich sprachlos')).toBe(idx('wie hast du dich gefühlt') + 1)
  })
  it('every listening keyword has a gloss in the vocabulary (two had none, so the chips showed no translation)', () => {
    const vocab = fullBundle().vocabulary
    for (const l of UNIT_21_LISTENING)
      for (const k of l.keywords)
        expect(
          vocab.some(v => v.de.toLowerCase() === k.toLowerCase()),
          `${l.id}: ${k}`,
        ).toBe(true)
  })
  it('spoken narration is modelled in PERFEKT (the unit teaches: Perfekt for talking, Präteritum for writing): no strong Präteritum in the speaking hints', () => {
    const hints = UNIT_21_SPEAKING[0].turns.flatMap(t => t.hints)
    for (const h of hints) expect(h, h).not.toMatch(/\b(kam|nahm|sah|fand|ging|lief|wohnte|verpasste|bekam)\b/)
    expect(hints.some(h => /habe .* (gewohnt|genommen|gesehen|gefunden)|bin .* angekommen/.test(h))).toBe(true)
  })
  it('"explain what happened and WHY": a reason (weil) is an expected element of the writing task and a hint of the speaking scenario', () => {
    expect(UNIT_21_WRITING[0].mustInclude.some(m => m.patterns.includes('weil '))).toBe(true)
    expect(UNIT_21_SPEAKING[0].turns.some(t => t.hints.some(h => h.includes('weil')))).toBe(true)
    expect(UNIT_21_WRITING[0].tips.some(t => t.ru.includes('weil') && (t.ky ?? '').includes('weil'))).toBe(true)
  })
  it('the ↻ A2 item "Gestern ___ ich … gegangen" has no distractor that is also a valid (if rare) form', () => {
    const q = UNIT_21_FINAL.find(x => x.id === 'b1-ft-21-07')!
    expect(q.options).toEqual(['habe', 'bin', 'ist'])
    expect(q.answer).toBe('bin')
  })
  it('Russian: the example of "Zufall" no longer adds a "счастливая" (lucky) that the German does not say', () => {
    expect(UNIT_21_VOCABULARY.find(v => v.de === 'Zufall')!.exampleRu).not.toMatch(/счастлив/)
  })
})

describe('answer keys, distractors and scoring (the real question builders)', () => {
  it('final test: 15 questions in authored order; the answer is always among the options and matches EXACTLY ONE option; options are distinct', () => {
    for (const seed of ['a', 'b', 'c', 'd']) {
      const qs = finalTestQuestions(21, UNIT_21_FINAL, seed)
      expect(qs.map(q => q.id)).toEqual(UNIT_21_FINAL.map(q => q.id))
      qs.forEach((q, i) => {
        expect(q.options, q.id).toBeDefined()
        expect(
          q.options!.filter(o => o === q.answer),
          q.id,
        ).toHaveLength(1)
        expect(new Set(q.options).size, q.id).toBe(q.options!.length)
        expect([...q.options!].sort()).toEqual([...UNIT_21_FINAL[i].options].sort()) // shuffled per attempt, never changed
        expect(q.type).toBe(UNIT_21_FINAL[i].prompt.includes('___') ? 'fill' : 'choice')
      })
    }
  })
  it('answering every question with the authored answer scores 15 / 15; answering with the first distractor scores 0 for the items where the answer is not first', () => {
    const qs = finalTestQuestions(21, UNIT_21_FINAL, 'score')
    expect(qs.filter(q => q.options!.includes(q.answer)).length).toBe(15)
    const firstWrong = qs.map(q => q.options!.find(o => o !== q.answer)!)
    expect(firstWrong.filter((o, i) => o === qs[i].answer).length).toBe(0)
  })
  it('the 10 revision exercises build into questions whose answer is valid (choice/fill: among the options; order: the tokens form the answer)', () => {
    for (const e of UNIT_21_EXERCISES) {
      const q = fromExercise(e)
      if (e.type === 'order') expect([...(q.words ?? [])].sort().join('|')).toBe(e.answer.split(' ').sort().join('|'))
      else expect(q.options, e.id).toContain(e.answer)
    }
  })
  it('both approved concepts are assessed: exercises (4 + 4) and final-test items (3 + 3 on the concepts), plus 2 recycled A2 items — identified by their A2 concept and by the "↻ A2" marker in the explanation', () => {
    const onConcept = (id: string) => UNIT_21_FINAL.filter(q => q.concept === id).length
    expect(onConcept('b1-praeteritum-erzaehlen')).toBe(3)
    expect(onConcept('b1-temporale-konnektoren')).toBe(3)
    expect(UNIT_21_EXERCISES.filter(e => e.concept === 'b1-praeteritum-erzaehlen')).toHaveLength(4)
    expect(UNIT_21_EXERCISES.filter(e => e.concept === 'b1-temporale-konnektoren')).toHaveLength(4)
    const recycledFinal = UNIT_21_FINAL.filter(q => q.concept?.startsWith('a2-'))
    expect(recycledFinal.map(q => q.id)).toEqual(['b1-ft-21-07', 'b1-ft-21-08'])
    for (const q of UNIT_21_FINAL) expect(q.why.ru.startsWith('↻ A2')).toBe(recycledFinal.includes(q))
    for (const e of UNIT_21_EXERCISES) expect(e.why.ru.startsWith('↻ A2')).toBe(!e.concept)
  })
  it('every exercise and question explains the answer in both languages, and the explanation names the correct form', () => {
    for (const e of UNIT_21_EXERCISES) {
      expect(e.why.ru.length).toBeGreaterThan(25)
      expect((e.why.ky ?? '').length).toBeGreaterThan(25)
    }
    for (const q of UNIT_21_FINAL) {
      expect(q.why.ru.length).toBeGreaterThan(25)
      expect(q.why.ky.length).toBeGreaterThan(25)
    }
  })
})

describe('educational coverage: the stated learner outcomes are all trained somewhere', () => {
  const de = (s: string) => new RegExp(s)
  it('the five situations of the brief each have a text: journey/difficult experience (reading 1), achievement (reading 2), encounter (listening 1), decision (listening 2)', () => {
    expect(UNIT_21_READING[0].body.join(' ')).toMatch(de('Deutschland')) // first night abroad, a difficult journey
    expect(UNIT_21_READING[1].title).toBe('Mein erster Marathon')
    expect(UNIT_21_LISTENING[0].title).toBe('Zufällig getroffen')
    expect(UNIT_21_LISTENING[1].lines.map(l => l.text).join(' ')).toMatch(de('Entscheidung'))
  })
  it('chronology (zuerst/dann/danach/schließlich + connectors), reasons (weil), feelings and coherent connection appear in the productive tasks', () => {
    const w = UNIT_21_WRITING[0].mustInclude.map(m => m.label).join(' ')
    for (const part of ['zeitlicher Konnektor', 'Reihenfolge', 'weil', 'Gefühl', 'Präteritum']) expect(w).toContain(part)
    const sp = UNIT_21_SPEAKING[0].turns.map(t => t.ai).join(' ')
    for (const part of ['Wann', 'Reihe nach', 'gefühlt', 'seitdem']) expect(sp).toContain(part)
  })
  it('the unit is contained in the B1 chunk and nothing leaks into the A1/A2 modules (identity of A1/A2 content untouched)', () => {
    expect(B1_CONTENT.units.map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_CONTENT.vocabulary.every(v => v.unit >= 21 && v.unit <= 32)).toBe(true)
  })
})
