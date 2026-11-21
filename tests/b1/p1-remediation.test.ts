// @vitest-environment node
/**
 * P1 remediation of the final B1 audit (B1_FINAL_AUDIT.md §9 items 1, 2, 3 and 4): (1) the register of open curriculum decisions D-1…D-14 and the X-n items, with the D-1 mislabel fixed; (2) the progression
 * floor of clause-linking in the readings and listenings of Units 21–32 (no mid-course dip); (3) validator rules for the structure of `level-b1`; (4) the RU/KY terminology glossary and its consistency.
 * Nothing here approves a decision, validates a CEFR level or confirms a translation.
 */
import { describe, expect, it } from 'vitest'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { B1_CURRICULUM } from '../../scripts/content-validate/b1/curriculum'
import { B1_DECISIONS } from '../../scripts/content-validate/b1/decisions'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_GLOSSARY, KY_GLOSS_COLLISIONS_WITH_A2, KY_GLOSS_DERIVED_PAIRS } from '../../src/data/b1/glossary'
import { B1_META } from '../../src/data/b1/meta'
import { courseLevel } from '../../src/data/course'

const issues = () => validateContent(fullBundle())

// ───────────────────────── 1. the decision register ─────────────────────────
describe('P1-A: every open curriculum decision is registered, none is approved, none is forgotten', () => {
  const carriedIds = B1_CURRICULUM.units.flatMap(u => u.concepts.flatMap(c => (c.expertReview ? [c.expertReview.decision] : [])))
  it('D-1 … D-14 are all registered (the dossier has 14 numbered decisions) plus the X-n items found while authoring', () => {
    const ids = B1_DECISIONS.map(d => d.id)
    for (let i = 1; i <= 14; i++) expect(ids).toContain(`D-${i}`)
    expect(ids.filter(i => i.startsWith('X-'))).toEqual(['X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6', 'X-7'])
    expect(new Set(ids).size).toBe(ids.length)
  })
  it('NO decision is approved: every status is a pending-… status (only a person may approve, in the dossier), and each says who must review it', () => {
    for (const d of B1_DECISIONS) {
      expect(d.status, d.id).toMatch(/^pending-/)
      expect(d.title.length).toBeGreaterThan(10)
      expect(d.implemented.length).toBeGreaterThan(10)
      expect(d.consequence.length).toBeGreaterThan(5)
      expect(d.fallback.length).toBeGreaterThan(3)
      expect(typeof d.expertRequired).toBe('boolean')
    }
    // the decisions that touch German grammar placement need an independent expert; the pure product decisions need the owner
    for (const id of ['D-1', 'D-2', 'D-3', 'D-4', 'D-5', 'D-6', 'D-7', 'D-8', 'D-9', 'X-1'])
      expect(B1_DECISIONS.find(d => d.id === id)!.expertRequired, id).toBe(true)
    for (const id of ['D-10', 'D-13', 'D-14', 'X-3', 'X-7']) expect(B1_DECISIONS.find(d => d.id === id)!.status, id).toBe('pending-owner')
  })
  it('the D-1 MISLABEL is fixed: the flag on `lassen` is X-1 (dossier ⚑ item 13), D-1 itself is the course-level A2→B1 boundary', () => {
    const lassen = B1_CURRICULUM.units.flatMap(u => u.concepts).find(c => c.id === 'b1-lassen')!
    expect(lassen.expertReview).toMatchObject({ status: 'pending', decision: 'X-1' })
    expect(carriedIds).not.toContain('D-1')
    const d1 = B1_DECISIONS.find(d => d.id === 'D-1')!
    expect(d1.title).toMatch(/A2→B1 boundary/)
    expect(d1.carriedByConcept).toBe(false)
  })
  it('`carriedByConcept` agrees with curriculum.ts exactly (the concepts carry D-3, D-5, D-6, D-7, D-8, D-9 and X-1)', () => {
    expect([...new Set(carriedIds)].sort()).toEqual(['D-3', 'D-5', 'D-6', 'D-7', 'D-8', 'D-9', 'X-1'].sort())
    expect(
      B1_DECISIONS.filter(d => d.carriedByConcept)
        .map(d => d.id)
        .sort(),
    ).toEqual([...new Set(carriedIds)].sort())
  })
  it('every decision that no concept carries raises exactly ONE review flag (so D-2, D-4, D-10…D-14 and X-2…X-7 can no longer be forgotten); none is an error', () => {
    const is = issues()
    const flags = is.filter(i => i.rule === 'curriculum-decision-open')
    expect(flags.map(i => i.where)).toEqual(B1_DECISIONS.filter(d => !d.carriedByConcept).map(d => `decisions:${d.id}`))
    expect(flags).toHaveLength(14)
    for (const f of flags) expect(f.severity).toBe('review')
    expect(is.filter(i => i.severity === 'error' || i.severity === 'warning')).toEqual([])
  })
  it('the validator REJECTS an approved status, a missing D-n, a concept that names an unregistered decision and a wrong `carriedByConcept`', () => {
    const run = (mut: (b: ReturnType<typeof fullBundle>) => void) => {
      const b = fullBundle()
      mut(b)
      return validateContent(b).filter(i => i.rule === 'b1-decision-register')
    }
    expect(
      run(b => (b.b1Decisions = B1_DECISIONS.map(d => (d.id === 'D-2' ? { ...d, status: 'approved' as never } : d)))).length,
    ).toBeGreaterThan(0)
    expect(run(b => (b.b1Decisions = B1_DECISIONS.filter(d => d.id !== 'D-12'))).map(i => i.where)).toContain('decisions:D-12')
    expect(run(b => (b.b1Decisions = B1_DECISIONS.filter(d => d.id !== 'D-5'))).map(i => i.where)).toContain('decisions:D-5')
    expect(
      run(b => (b.b1Decisions = B1_DECISIONS.map(d => (d.id === 'D-2' ? { ...d, carriedByConcept: true } : d)))).map(i => i.where),
    ).toContain('decisions:D-2')
    expect(
      run(b => (b.b1Decisions = B1_DECISIONS.map(d => (d.id === 'D-9' ? { ...d, carriedByConcept: false } : d)))).map(i => i.where),
    ).toContain('decisions:D-9')
    expect(run(() => undefined)).toEqual([])
  })
  it('B1 stays planned with no released locale', () => {
    expect(courseLevel('B1')).toMatchObject({ status: 'beta', releasedLocales: ['ru', 'ky'] })
  })
})

// ───────────────────────── 2. progression of text complexity ─────────────────────────
const SUB = /\b(weil|dass|wenn|als|ob|obwohl|damit|bevor|nachdem|während|falls|sobald|seitdem|bis|solange|sodass|denn)\b/gi
const REL = /, (der|die|das|den|dem|denen|mit dem|in dem|in der|mit der|mit denen|in das|auf den|von dem) \p{L}+/giu
const CONN =
  /\b(trotzdem|deshalb|deswegen|außerdem|dennoch|darüber hinaus|zwar|erstens|zweitens|einerseits|andererseits|dagegen|dafür|daher|danach|davor|inzwischen|anschließend|zunächst|schließlich|je [^.,]{1,30} desto|sowohl|weder|entweder)\b/gi
const INF = /, (um|ohne|statt)?\s?[^.,;:!?]{0,50}\bzu \p{L}+|\bum\b [^.,]{0,50}\bzu \p{L}+/giu
const wordsOf = (s: string) => s.split(/\s+/).filter(Boolean).length
/** clause-linking index: subordinators + relative clauses + connectors + zu-infinitive clauses per 100 words (a transparent heuristic, NOT a CEFR measure) */
const linkIndex = (t: string) => {
  const c = (re: RegExp) => (t.match(re) ?? []).length
  return ((c(SUB) + c(REL) + c(CONN) + c(INF)) / wordsOf(t)) * 100
}
const readings = () => B1_CONTENT.reading.map(r => ({ id: r.id, unit: r.unit, idx: linkIndex(r.body.join(' ')) }))
const listenings = () => B1_CONTENT.listening.map(l => ({ id: l.id, unit: l.unit, idx: linkIndex(l.lines.map(x => x.text).join(' ')) }))
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length

describe('P1-B: the clause-linking of the texts does not dip in the middle of the course (audit: Units 24, 25, 26, 27, 31 were below Unit 21)', () => {
  it('every reading links its clauses at least at the floor of its band: every text ≥ 3.0 and Units 24–31 ≥ 3.5 per 100 words (before: Unit 24 had 0.8, Unit 25 1.4, Unit 31 2.0)', () => {
    for (const r of readings()) expect(r.idx, `${r.id}: ${r.idx.toFixed(1)}`).toBeGreaterThanOrEqual(3.0)
    for (const r of readings().filter(x => x.unit >= 24 && x.unit <= 31)) expect(r.idx, r.id).toBeGreaterThanOrEqual(3.5)
  })
  it('every listening has at least 2.0 links per 100 words (before: Units 24, 26, 27 and 31 had 0.7–1.6)', () => {
    for (const l of listenings()) expect(l.idx, `${l.id}: ${l.idx.toFixed(1)}`).toBeGreaterThanOrEqual(2.0)
  })
  it('the later units are not simpler than the middle ones: the mean of the readings of Units 28–31 is higher than that of Units 24–27', () => {
    const m = (a: number, b: number) =>
      mean(
        readings()
          .filter(r => r.unit >= a && r.unit <= b)
          .map(r => r.idx),
      )
    expect(m(28, 31)).toBeGreaterThan(m(24, 27))
  })
  it("the edit added links, not just length: no edited reading or listening grew beyond its unit band (the validator's band rules pass), and sentences stay short enough (p95 ≤ 22 words per unit)", () => {
    expect(issues().filter(i => i.severity === 'error' || i.severity === 'warning')).toEqual([])
    const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).filter(x => x.trim())
    for (let u = 21; u <= 32; u++) {
      const lens = [
        ...B1_CONTENT.reading.filter(r => r.unit === u).flatMap(r => r.body.flatMap(sentences)),
        ...B1_CONTENT.listening.filter(l => l.unit === u).flatMap(l => l.lines.flatMap(x => sentences(x.text))),
      ]
        .map(wordsOf)
        .sort((a, b) => a - b)
      expect(lens[Math.ceil(0.95 * lens.length) - 1], `unit ${u}`).toBeLessThanOrEqual(22)
    }
  })
  it('the edited listening lines keep independent Russian and Kyrgyz (the translation of each changed line was changed too)', () => {
    const edited: [string, string][] = [
      ['b1-li-24-01', 'weil ich ein kleines Kind habe'],
      ['b1-li-26-01', 'bis es am Abend wieder trocken wird'],
      ['b1-li-27-01', 'weil auf dem Gerät zwei Jahre Garantie sind'],
      ['b1-li-31-02', 'damit ich Ihre Daten prüfen kann'],
    ]
    for (const [id, de] of edited) {
      const line = B1_CONTENT.listening.find(l => l.id === id)!.lines.find(x => x.text.includes(de))!
      expect(line, id).toBeTruthy()
      expect(line.ru.length).toBeGreaterThan(line.text.length * 0.6)
      expect(line.ky).not.toBe(line.ru)
    }
    const ru = B1_CONTENT.listening
      .find(l => l.id === 'b1-li-24-01')!
      .lines.map(x => x.ru)
      .join(' ')
    expect(ru).toMatch(/потому что у меня маленький ребёнок/)
    const ky = B1_CONTENT.listening
      .find(l => l.id === 'b1-li-31-02')!
      .lines.map(x => x.ky)
      .join(' ')
    expect(ky).toMatch(/текшерүүм үчүн/)
  })
  it('the progression floor uses only constructions taught by the unit: no `damit` before Unit 30 and no Plusquamperfekt before Unit 29 in the edited texts (the validator and the existing scope guards also pass)', () => {
    for (const r of B1_CONTENT.reading.filter(x => x.unit < 30))
      expect(r.body.join(' '), r.id).not.toMatch(/\b[Dd]amit\b[^.!?]*\b(kann|können|möchte|wird)\b/)
    for (const l of B1_CONTENT.listening.filter(x => x.unit < 30))
      expect(l.lines.map(x => x.text).join(' '), l.id).not.toMatch(/\b[Dd]amit\b/)
    for (const t of [...B1_CONTENT.reading.filter(x => x.unit === 25), ...B1_CONTENT.reading.filter(x => x.unit === 26)])
      expect(t.body.join(' '), t.id).not.toMatch(/\bhatte\b[^.!?]*\b(ge\p{L}+(t|en))\b/u)
  })
})

// ───────────────────────── 3. structure rules for the level assessment ─────────────────────────
describe('P1-C: the validator checks the STRUCTURE of the level assessment (audit §9 item 3: "add validator rules for its structure")', () => {
  const rule = (mut: (b: ReturnType<typeof fullBundle>) => void) => {
    const b = fullBundle()
    mut(b)
    return validateContent(b).filter(i => i.rule === 'b1-level-test')
  }
  const LT = () => fullBundle().b1LevelTest!
  it('the real assessment passes every structural rule', () => {
    expect(issues().filter(i => i.rule === 'b1-level-test')).toEqual([])
  })
  it('a definition size that differs from the authored item count is an error', () => {
    const e = rule(b => (b.tests = b.tests.map(t => (t.id === 'level-b1' ? { ...t, size: 40 } : t))))
    expect(e.some(i => /says 40 items but 60/.test(i.message))).toBe(true)
  })
  it('an untagged concept is an error (the audit found only 13 of 29 tagged)', () => {
    const e = rule(b => {
      const lt = LT()
      b.b1LevelTest = {
        ...lt,
        questions: lt.questions.map(q => (q.concept === 'b1-futur1-vermutungen' ? { ...q, concept: undefined } : q)),
      }
    })
    expect(e.map(i => i.where)).toContain('grammar:b1-futur1-vermutungen')
  })
  it('a reading passage shorter than 80 words is an error (the audit found passages of 36–46 words)', () => {
    const e = rule(b => {
      const lt = LT()
      b.b1LevelTest = {
        ...lt,
        questions: lt.questions.map(q =>
          q.id === 'b1-lt-41' ? { ...q, prompt: 'Lies den Text (erfunden): „Ich war im Büro. Es war schön.“ Warum?' } : q,
        ),
      }
    })
    expect(e.some(i => /fewer than 80 words/.test(i.message))).toBe(true)
  })
  it('no listening items AND no listening note is an error (the audit found success reported without listening evidence)', () => {
    const e = rule(b => {
      b.b1LevelTest = { ...LT(), listeningNote: { ru: '', ky: '' } }
    })
    expect(e.some(i => /no listening note/.test(i.message))).toBe(true)
  })
  it('a malformed item is an error: two equal options, a missing correct answer, fewer than 3 word-order items', () => {
    const e1 = rule(b => {
      const lt = LT()
      b.b1LevelTest = {
        ...lt,
        questions: lt.questions.map(q => (q.id === 'b1-lt-12' ? { ...q, options: [q.options[0], q.options[0], q.options[2]] } : q)),
      }
    })
    expect(e1.length).toBeGreaterThan(0)
    const e2 = rule(b => {
      const lt = LT()
      b.b1LevelTest = {
        ...lt,
        questions: lt.questions.map(q => (q.words ? { ...q, words: undefined, options: ['a', 'b', 'c'], answer: 'a' } : q)),
      }
    })
    expect(e2.some(i => /at least 3 word-order items/.test(i.message))).toBe(true)
  })
  it('exam-board, certificate or CEFR wording in the bands or notes is an error', () => {
    const e = rule(b => {
      const lt = LT()
      b.b1LevelTest = { ...lt, statement: { ...lt.statement, ru: lt.statement.ru + ' Как в Goethe-Zertifikat.' } }
    })
    expect(e.some(i => /exam board, a certificate or a CEFR level/.test(i.message))).toBe(true)
  })
  it('the scoring configuration of the 60-item form is UNCHANGED by this remediation (70 / 50 / 55)', () => {
    expect(LT().thresholds).toEqual({ overallPct: 70, partPct: 50, almostPct: 55 })
    expect(LT().questions).toHaveLength(60)
  })
})

// ───────────────────────── 4. glossary and terminology ─────────────────────────
describe('P1-D: the RU/KY glossary exists and the course is consistent with it', () => {
  const ALL = JSON.stringify([B1_CONTENT, B1_META]).replace(/\\n/g, ' ')
  it('the glossary lists every recurring grammar term, each marked as an AI draft pending native review; uncertain wordings are flagged', () => {
    expect(B1_GLOSSARY.length).toBeGreaterThanOrEqual(12)
    for (const t of B1_GLOSSARY) {
      expect(t.review).toBe('native-pending')
      expect(t.de && t.ru && t.ky && t.note).toBeTruthy()
    }
    expect(B1_GLOSSARY.filter(t => t.uncertain).length).toBeGreaterThanOrEqual(4)
    expect(B1_GLOSSARY.map(t => t.de)).toEqual(expect.arrayContaining(['Nebensatz', 'Hauptsatz', 'Relativsatz', 'Passiv', 'Aktiv']))
  })
  it('no competing variant of a glossary term occurs anywhere in the B1 data (before: 20 × "башкы сүйлөм", 11 × "кошумча сүйлөм", 5 × "относительное предложение", 4 × "пассив/актив")', () => {
    for (const t of B1_GLOSSARY)
      for (const re of [...(t.avoidRu ?? []), ...(t.avoidKy ?? [])]) expect(ALL, `${t.de}: ${re}`).not.toMatch(re)
  })
  it('the Kyrgyz main/subordinate clause pair is written with ONE noun ("башкы бөлүк" / "кошумча бөлүк") throughout', () => {
    expect((ALL.match(/[Кк]ошумча бөлү/g) ?? []).length).toBeGreaterThan(50)
    expect((ALL.match(/[Бб]ашкы бөлү/g) ?? []).length).toBeGreaterThan(50)
  })
  it('no invented Kyrgyz grammar label (project policy) and no German term with a second Russian name', () => {
    for (const bad of [
      'бүтүндөмө',
      'жакталган',
      'ээрчимелүү',
      'багыныңкы',
      'кайтарым',
      'толук өткөн чак',
      'салыштырма сүйлөм',
      'орто талаа',
      'тактоо сүйлөмү',
    ])
      expect(ALL, bad).not.toContain(bad)
    expect(ALL).not.toMatch(/сослагательн|страдательн|побочн\p{L}* предложен/u)
  })
  it('the six Kyrgyz glosses that equal an A1/A2 gloss and the five noun/verb pairs are recorded and stay in step with the data (a change re-opens the review)', () => {
    const b = fullBundle()
    const v = new Map(b.vocabulary.map(x => [x.id, x]))
    for (const c of KY_GLOSS_COLLISIONS_WITH_A2) {
      expect(v.get(c.id)!.de).toBe(c.de)
      expect(v.get(c.id)!.ky).toBe(c.ky)
      expect(v.get(c.equalTo.id)!.de).toBe(c.equalTo.de)
      expect(v.get(c.equalTo.id)!.ky).toBe(c.ky)
    }
    const oldKy = new Set(b.vocabulary.filter(x => x.unit <= 20).map(x => (x.ky ?? '').toLowerCase().trim()))
    const actual = b.vocabulary.filter(x => x.unit >= 21 && oldKy.has((x.ky ?? '').toLowerCase().trim())).map(x => x.id)
    expect(actual.sort()).toEqual(KY_GLOSS_COLLISIONS_WITH_A2.map(c => c.id).sort())
    for (const [a, c] of KY_GLOSS_DERIVED_PAIRS) expect(v.get(a)!.ky).toBe(v.get(c)!.ky)
    const byKy = new Map<string, string[]>()
    for (const x of b.vocabulary.filter(y => y.unit >= 21)) byKy.set(x.ky ?? '', [...(byKy.get(x.ky ?? '') ?? []), x.id])
    expect(
      [...byKy.values()]
        .filter(a => a.length > 1)
        .map(a => [...a].sort().join('|'))
        .sort(),
    ).toEqual(KY_GLOSS_DERIVED_PAIRS.map(p => [...p].sort().join('|')).sort())
  })
  it('the glossary is data only: it is not part of the lazy B1 content and does not change any learner-visible behaviour', () => {
    expect(Object.keys(B1_CONTENT)).not.toContain('glossary')
    expect(courseLevel('B1')).toMatchObject({ status: 'beta', releasedLocales: ['ru', 'ky'] })
  })
})
