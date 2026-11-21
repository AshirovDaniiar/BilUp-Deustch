// @vitest-environment node
/**
 * The final indicative B1 level assessment `level-b1` (form b1-level-v2, P0 remediation): 60 items — A 10 · B 30 · C 12 · D 0 · E 8. Each describe block below is a REGRESSION test of one defect of the
 * final audit (B1_FINAL_AUDIT.md §6.1): concept coverage, reading length, practical-section size, answer-length bias, guess-pass probability, success without listening evidence.
 */
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { LEVEL_B1_ASSESSMENT as A, LEVEL_B1_TEST } from '../../src/data/b1/level-test'
import { evaluateLevel, levelOutcomeCode, LEVEL_BLUEPRINT } from '../../src/features/tests/levelAssessment'
import { courseLevel } from '../../src/data/course'

const Q = A.questions
const count = (p: string) => Q.filter(q => q.part === p).length
const UNIT_ITEMS = () => [...B1_CONTENT.finalTests.flatMap(f => f.questions), ...B1_CONTENT.exercises]
const words = (s: string) => s.split(/\s+/).filter(Boolean).length
const STMT = 'richtig|falsch|steht nicht im Text'
const mcItems = () => Q.filter(q => !q.words)
const tally = (a: number, b: number, c: number, e: number) =>
  ({ A: [a, 10], B: [b, 30], C: [c, 12], E: [e, 8] }) as Record<string, [number, number]>
/** the correct option is STRICTLY longer than every wrong one (ties do not count — an earlier audit measured ties as "longest") */
const strictlyLongest = (q: { options: string[]; answer: string }) => q.options.every(o => o === q.answer || o.length < q.answer.length)
const choose = (n: number, k: number) => {
  let r = 1
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i
  return r
}
/** probability that a pure guesser (3 options) gets at least k of n right */
const guessTail = (n: number, k: number, p = 1 / 3) => {
  let s = 0
  for (let i = k; i <= n; i++) s += choose(n, i) * p ** i * (1 - p) ** (n - i)
  return s
}
const partNeed = (n: number) => Math.ceil((A.thresholds.partPct / 100) * n)

describe('structure', () => {
  it('60 scored items: A 10 · B 30 · C 12 · D 0 · E 8; definition id level-b1, kind level, size 60 (equals the authored count)', () => {
    expect(Q).toHaveLength(60)
    expect(['A', 'B', 'C', 'D', 'E'].map(count)).toEqual([10, 30, 12, 0, 8])
    expect(LEVEL_B1_TEST).toMatchObject({ id: 'level-b1', kind: 'level', level: 'B1', size: 60 })
    expect(LEVEL_B1_TEST.size).toBe(Q.length)
    expect(B1_CONTENT.tests).toContainEqual(LEVEL_B1_TEST)
    expect(B1_CONTENT.levelTest).toBe(A)
    expect(Q.map(q => q.id)).toEqual(Array.from({ length: 60 }, (_, i) => `b1-lt-${String(i + 1).padStart(2, '0')}`))
    expect(LEVEL_BLUEPRINT).toBe('b1-level-v2')
  })
  it('at least 3 word-order items with tokens, none pre-solved', () => {
    const ord = Q.filter(q => q.words)
    expect(ord.length).toBeGreaterThanOrEqual(3)
    for (const q of ord) {
      expect(q.part).toBe('B')
      expect([...q.words!].sort().join('|')).toBe(q.answer.split(' ').sort().join('|'))
      expect(q.words!.join(' ')).not.toBe(q.answer)
    }
  })
  it('choice items: 3 distinct options, the answer once; ru + ky prompt and independent explanations', () => {
    for (const q of mcItems()) {
      expect(q.options).toHaveLength(3)
      expect(new Set(q.options).size).toBe(3)
      expect(q.options.filter(o => o === q.answer)).toHaveLength(1)
    }
    for (const q of Q) {
      expect(q.promptRu && q.promptKy && q.why.ru && q.why.ky).toBeTruthy()
      expect(q.why.ky).not.toBe(q.why.ru)
      expect(q.promptKy).not.toBe(q.promptRu)
    }
  })
  it('the statement format occurs with all three answers, twice each', () => {
    const st = Q.filter(q => q.options.join('|') === STMT)
    expect(st).toHaveLength(6)
    for (const a of ['richtig', 'falsch', 'steht nicht im Text']) expect(st.filter(q => q.answer === a)).toHaveLength(2)
  })
})

describe('DEFECT 1 (audit: only 13 of 29 concepts tagged) — every concept of Units 21–32 is examined by at least one item', () => {
  const real = fullBundle()
    .grammar.filter(g => g.unit >= 21)
    .map(g => g.id)
  it('all 29 concepts of the B1 bundle (27 of Units 21–31 + the 2 revision concepts of Unit 32) are tagged on a scored item', () => {
    expect(real).toHaveLength(29)
    const tagged = new Set(Q.filter(q => q.concept).map(q => q.concept))
    expect(real.filter(id => !tagged.has(id))).toEqual([])
    for (const id of tagged) expect(real.includes(id!), id).toBe(true)
  })
  it('part B carries one item per concept of Units 21–31 and word-order items for the two Unit-32 concepts', () => {
    const b = Q.filter(q => q.part === 'B')
    const early = b.filter(q => q.unit <= 31)
    expect(new Set(early.map(q => q.concept)).size).toBe(27)
    expect(b.filter(q => q.unit === 32).map(q => q.concept)).toEqual([
      'b1-satzbau-mittelfeld',
      'b1-satzbau-mittelfeld',
      'b1-nebensaetze-integration',
    ])
  })
  it('the receptive Genitivattribut item only asks for COMPREHENSION (the concept is receptive), never for a production gap', () => {
    const g = Q.find(q => q.concept === 'b1-genitivattribute')!
    expect(g.options.length).toBe(3)
    expect(g.prompt).not.toMatch(/___/)
    expect(g.promptRu).toMatch(/Что/)
  })
  it('items span every unit 21–32 and the vocabulary part touches ten different units', () => {
    expect(new Set(Q.map(q => q.unit))).toEqual(new Set([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]))
    expect(new Set(Q.filter(q => q.part === 'A').map(q => q.unit)).size).toBe(10)
  })
})

describe('DEFECT 2 (audit: reading passages of 36–46 words) — three new developed passages of at least 80 words', () => {
  const passages = () => {
    const m = new Map<string, number>()
    for (const q of Q.filter(x => x.part === 'C')) {
      const p = q.prompt.split('„')[1].split('“')[0]
      m.set(p, words(p))
    }
    return m
  }
  it('three distinct passages, each 80–130 words (the course minimum for a B1 reading is 80), four items each', () => {
    const ps = passages()
    expect(ps.size).toBe(3)
    for (const [text, n] of ps) {
      expect(n, text.slice(0, 30)).toBeGreaterThanOrEqual(80)
      expect(n, text.slice(0, 30)).toBeLessThanOrEqual(130)
      expect(Q.filter(q => q.part === 'C' && q.prompt.includes(text))).toHaveLength(4)
    }
  })
  it('every reading item names its text as fictional and its Russian/Kyrgyz instruction is unique', () => {
    const c = Q.filter(q => q.part === 'C')
    for (const q of c) expect(q.prompt).toMatch(/\(erfunden\)/)
    expect(new Set(c.map(q => q.promptRu)).size).toBe(12)
    expect(new Set(c.map(q => q.promptKy)).size).toBe(12)
  })
  it('the correct reading answers are supported by the text, the wrong ones are not', () => {
    const [p1, p2, p3] = [...passages().keys()]
    expect(p1).toMatch(/weil ich mir viele Gedanken gemacht hatte/)
    expect(p1).toMatch(/Bevor wir mit der Arbeit begannen, tranken wir zusammen einen Kaffee/)
    expect(p1).toMatch(/obwohl ich mich noch unsicher fühlte/)
    expect(p1).toMatch(/besser, als ich gedacht hatte/)
    expect(p2).toMatch(/Wenn Sie uns ein Foto schicken/)
    expect(p2).toMatch(/innerhalb von zehn Tagen/)
    expect(p2).toMatch(/schicken wir Ihnen kostenlos/)
    expect(p2).not.toMatch(/repar/i)
    expect(p3).toMatch(/damit der Hof im Sommer bunter aussieht/)
    expect(p3).toMatch(/mit einer Spende/)
    expect(p3).toMatch(/stellt Familie Brandt zur Verfügung/)
    expect(p3).not.toMatch(/Mittagessen/)
  })
})

describe('DEFECT 3 (audit: practical section of 4 items) — eight practical-language items', () => {
  it('part E has 8 items covering register, refusal, complaint, repair, mediation, advice, concession and a polite request', () => {
    const e = Q.filter(q => q.part === 'E')
    expect(e).toHaveLength(8)
    expect(new Set(e.map(q => q.prompt)).size).toBe(8)
    const text = e.map(q => q.answer).join(' ')
    for (const re of [
      /Entschuldigen Sie, könnten Sie/,
      /leider nicht/,
      /leider sehr laut/,
      /noch einmal wiederholen/,
      /In dem Brief steht, dass/,
      /würde ich/,
      /Obwohl/,
      /Könnte ich/,
    ])
      expect(text).toMatch(re)
  })
})

describe('DEFECT 4 (audit: correct answer was the longest option in 22 of 37 items) — answer-length bias is bounded and measured STRICTLY (ties do not count)', () => {
  it('overall at most 40 % of the choice items have the correct option strictly longest (a random baseline is about 33 %); the old form had 46 %', () => {
    const items = mcItems()
    expect(items.filter(strictlyLongest).length / items.length).toBeLessThanOrEqual(0.4)
  })
  it('no part is biased: A, B, C and E each stay at or below 50 % (E was 4 of 4 and C 7 of 13 in the old form)', () => {
    for (const p of ['A', 'B', 'C', 'E']) {
      const items = mcItems().filter(q => q.part === p)
      expect(items.filter(strictlyLongest).length / items.length, `part ${p}`).toBeLessThanOrEqual(0.5)
    }
  })
  it('the correct option is strictly SHORTEST in at least 15 % of the items, so length is not a cue in either direction', () => {
    const items = mcItems()
    const shortest = items.filter(q => q.options.every(o => o === q.answer || o.length > q.answer.length)).length
    expect(shortest / items.length).toBeGreaterThanOrEqual(0.15)
  })
  it('sentence-length options (≥ 40 characters) stay within a factor of 1.45 of each other (distractors are as developed as the answer)', () => {
    for (const q of mcItems()) {
      const lens = q.options.map(o => o.length)
      if (Math.min(...lens) < 40) continue
      expect(Math.max(...lens) / Math.min(...lens), q.id).toBeLessThanOrEqual(1.45)
    }
  })
  it('the unit tests (15 items each) are NOT materially biased when measured strictly: ≤ 40 % over all 180 questions (audit correction: the earlier 45 % counted ties)', () => {
    const all = B1_CONTENT.finalTests.flatMap(f => f.questions)
    expect(all).toHaveLength(180)
    expect(all.filter(strictlyLongest).length / all.length).toBeLessThanOrEqual(0.4)
    const ex = B1_CONTENT.exercises.filter(e => e.type === 'choice').map(e => ({ options: e.options ?? [], answer: e.answer }))
    expect(ex.filter(strictlyLongest).length / ex.length).toBeLessThanOrEqual(0.4)
  })
  it('positional bias stays controlled: 17 / 17 / 17 over the choice items; statements 2 / 2 / 2; never three equal in a row', () => {
    const pos = mcItems().map(q => q.options.indexOf(q.answer))
    const st = Q.filter(q => q.options.join('|') === STMT).map(q => q.options.indexOf(q.answer))
    const rest = mcItems()
      .filter(q => q.options.join('|') !== STMT)
      .map(q => q.options.indexOf(q.answer))
    expect([0, 1, 2].map(p => rest.filter(x => x === p).length)).toEqual([17, 17, 17])
    expect([0, 1, 2].map(p => st.filter(x => x === p).length)).toEqual([2, 2, 2])
    for (let i = 2; i < pos.length; i++) expect(pos[i] === pos[i - 1] && pos[i] === pos[i - 2], `item ${i + 1}`).toBe(false)
  })
})

describe('DEFECT 5 (audit: guessing could pass a part too easily) — the part threshold is 50 % and the guess-pass probabilities are bounded', () => {
  it('thresholds: 70 % overall, 50 % per part (was 40 %), 55 % for "almost" (provisional, uncalibrated)', () => {
    expect(A.thresholds).toEqual({ overallPct: 70, partPct: 50, almostPct: 55 })
  })
  it('a pure guesser (1 of 3) reaches the per-part threshold with probability ≤ 0.30 in every part and ≤ 0.1 % in all four parts together', () => {
    const parts: [string, number][] = [
      ['A', 10],
      ['B', 30],
      ['C', 12],
      ['E', 8],
    ]
    let all = 1
    for (const [k, n] of parts) {
      expect(count(k)).toBe(n)
      const p = guessTail(n, partNeed(n))
      expect(p, `part ${k}`).toBeLessThanOrEqual(0.3)
      all *= p
    }
    expect(all).toBeLessThanOrEqual(0.001)
    // the old form: a 4-item part at 40 % was passed by more than 40 % of guessers
    expect(guessTail(4, 2)).toBeGreaterThan(0.4)
  })
  it('a pure guesser reaches "almost" (≥ 55 % = 33 of 60) with probability below 0.1 % and "reached" (≥ 70 % = 42) below 10⁻⁷', () => {
    expect(guessTail(60, Math.ceil(0.55 * 60))).toBeLessThan(1e-3)
    expect(guessTail(60, Math.ceil(0.7 * 60))).toBeLessThan(1e-7)
  })
  it('reached needs ≥ 70 % overall AND ≥ 50 % in every part; a weak part blocks it', () => {
    expect(evaluateLevel(A, tally(10, 30, 12, 8)).band).toBe('reached')
    expect(evaluateLevel(A, tally(8, 21, 8, 5)).band).toBe('reached') // 42/60 = 70 %
    expect(evaluateLevel(A, tally(10, 30, 12, 3)).band).toBe('almost') // E 3/8 = 38 % < 50 %
    expect(evaluateLevel(A, tally(10, 30, 12, 4)).band).toBe('reached') // E 4/8 = 50 %
    expect(evaluateLevel(A, tally(4, 30, 12, 8)).band).toBe('almost') // A 4/10 = 40 % < 50 %
  })
  it('almost ≥ 55 % overall; repeat otherwise; an empty part counts as fine', () => {
    expect(evaluateLevel(A, tally(6, 17, 7, 3)).band).toBe('almost') // 33/60 = 55 %
    expect(evaluateLevel(A, tally(5, 17, 7, 3)).band).toBe('repeat') // 32/60
    expect(evaluateLevel(A, tally(0, 0, 0, 0)).band).toBe('repeat')
    const o = evaluateLevel(A, { A: [10, 10], B: [30, 30], C: [12, 12], E: [8, 8], D: [0, 0] })
    expect(o).toMatchObject({ correct: 60, total: 60, pct: 100, band: 'reached' })
  })
  it('stored codes fit the storage limits', () => {
    for (const b of ['reached', 'almost', 'repeat'] as const) expect(levelOutcomeCode(b).length).toBeLessThanOrEqual(40)
    expect(LEVEL_BLUEPRINT.length).toBeLessThanOrEqual(40)
  })
})

describe('DEFECT 6 (audit: success reported without listening evidence) — the card says what is not measured, and why', () => {
  it('there are no listening items, and none is added here (the reason is technical: speech output is not verified on real devices)', () => {
    expect(Q.filter(q => q.part === 'D' || q.skill === 'listening')).toHaveLength(0)
    expect(A.parts.map(p => p.key)).toEqual(['A', 'B', 'C', 'E'])
  })
  it('the listening note exists in ru and ky, names the TECHNICAL reason and says listening is NOT less important', () => {
    expect(A.listeningNote.ru).toMatch(/Аудирование в эту проверку не входит/)
    expect(A.listeningNote.ru).toMatch(/Причина техническая/)
    expect(A.listeningNote.ru).toMatch(/не проверено на реальных устройствах/)
    expect(A.listeningNote.ru).toMatch(/не значит, что аудирование менее важно/)
    expect(A.listeningNote.ky).toMatch(/Угуу бул текшерүүгө кирген жок/)
    expect(A.listeningNote.ky).toMatch(/техникалык/)
    expect(A.listeningNote.ky).not.toBe(A.listeningNote.ru)
  })
  it('even the best band is qualified "по проверенным частям" / "текшерилген бөлүктөр боюнча" — it never claims the whole course goal', () => {
    for (const b of ['reached', 'almost'] as const) {
      expect(A.bands[b].ru).toMatch(/по проверенным частям/)
      expect(A.bands[b].ky).toMatch(/текшерилген бөлүктөр боюнча/)
    }
    expect(A.bands.repeat.ru).not.toMatch(/достигнут/)
  })
})

describe('independence, scope and honesty', () => {
  it('no prompt or answer is shared with any unit test or exercise of B1', () => {
    const used = new Set(UNIT_ITEMS().flatMap(x => [x.prompt, x.answer]))
    const generic = new Set(['Bilde den Satz.', 'Welcher Satz ist richtig?'])
    for (const q of Q) {
      if (!generic.has(q.prompt)) expect(used.has(q.prompt), q.id).toBe(false)
      if (q.part === 'A' || q.part === 'E' || q.answer.length > 14)
        expect(used.has(q.answer) && !['richtig', 'falsch', 'steht nicht im Text'].includes(q.answer), q.id).toBe(false)
    }
  })
  it('no prompt is used twice inside the assessment (outside the shared reading passages and the word-order instruction)', () => {
    const ps = Q.filter(q => q.part !== 'C' && !q.words).map(q => q.prompt)
    expect(new Set(ps).size).toBe(ps.length)
  })
  it('fixed statement: indicative, not a certificate, no exam prediction, no speaking/writing; no CEFR/Goethe/telc claims anywhere in the assessment', () => {
    expect(A.statement.ru).toMatch(/ориентировочная/)
    expect(A.statement.ru).toMatch(/не сертификат/)
    expect(A.statement.ru).toMatch(/не предсказывает/)
    expect(A.statement.ru).toMatch(/не оценивает говорение и письмо/)
    expect(A.statement.ky).toMatch(/сертификат эмес/)
    expect(A.statement.ky).not.toBe(A.statement.ru)
    expect(A.companion.ru).toMatch(/юнита 32/)
    expect(A.companion.ky).not.toBe(A.companion.ru)
    const all = JSON.stringify([A.bands, A.statement, A.companion, A.listeningNote, LEVEL_B1_TEST, A.parts, Q])
    expect(all).not.toMatch(/Goethe|telc|TestDaF|ÖSD|CEFR|Zertifikat/)
    for (const b of Object.values(A.bands)) expect(b.ky).not.toBe(b.ru)
  })
  it('no B2 or receptive-only construction appears in the German text of the assessment', () => {
    const all = Q.map(q => `${q.prompt} ${q.answer} ${q.options.join(' ')} ${(q.words ?? []).join(' ')}`).join(' ')
    const forbidden = [
      /\bworden\b/,
      /\b(hätte|hätten|wäre|wären)\b[^.!?,]*\b(sollen|müssen|können|wollen|gemacht|gewesen)\b/,
      /\bohne\b[^.!?]*\bzu \w+/,
      /einerseits|andererseits/,
      /\b(sofern|indem|wobei|weshalb|zumal|allerdings|jedoch|somit|folglich|demnach|hingegen|zudem)\b/,
      /, (dessen|deren)\b/,
      /\ber sei\b|\bseien\b/,
      /Goethe|telc|Deutsche Bahn|Jobcenter|Gesetz|Paragraph/,
    ]
    for (const re of forbidden) expect(all, String(re)).not.toMatch(re)
  })
  it('B1 stays planned with no released locale; the validator finds 0 errors and 0 warnings', () => {
    expect(courseLevel('B1')).toMatchObject({ status: 'beta', releasedLocales: ['ru', 'ky'] })
    const is = validateContent(fullBundle())
    expect(is.filter(i => i.severity === 'error' || i.severity === 'warning')).toEqual([])
  })
})
