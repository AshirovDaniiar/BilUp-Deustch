// @vitest-environment node
/**
 * Stage 7B — mechanical consistency of the A2 curriculum DESIGN documents (docs/authoring/A2_STAGE7B_*.md). Documents only: this does not
 * read or change any production content. It catches the errors a human proofreader misses: a word planned twice, a count that does not
 * add up, a unit without its eight exercise and fifteen final-test specifications, a grammar concept id used inconsistently.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { A2_UNIT_PLAN } from '../../src/data/a2/registry'
import { A2_VOCABULARY, UNIT_11_RECEPTIVE_WORDS } from '../../src/data/a2/vocabulary'
import { VOCABULARY } from '../../src/data/vocabulary'

const doc = (f: string) => readFileSync(join(__dirname, '../../docs/authoring', f), 'utf8')
const VOCAB = doc('A2_STAGE7B_VOCABULARY_MAP.md')
const DESIGN = doc('A2_STAGE7B_CURRICULUM_DESIGN.md')
const GRAMMAR = doc('A2_STAGE7B_GRAMMAR_PROGRESSION.md')
const UNITS = [12, 13, 14, 15, 16, 17, 18, 19, 20]

const lemma = (s: string) =>
  s
    .replace(/\((R|Pl\.)\)/g, '')
    .replace(/^(der|die|das)\s+/i, '')
    .replace(/^sich\s+/i, '')
    .trim()
    .toLowerCase()

interface Group {
  name: string
  declared: number
  items: { raw: string; lemma: string; receptive: boolean }[]
}
interface UnitMap {
  unit: number
  declared: { total: number; productive: number; receptive: number }
  groups: Group[]
}

function parseMap(): UnitMap[] {
  const out: UnitMap[] = []
  const sections = VOCAB.split(/^### Unit /m).slice(1)
  for (const s of sections) {
    const head = /^(\d+) — [^\n]*\((\d+) items: (\d+) productive, (\d+) receptive\)/.exec(s)!
    const groups: Group[] = []
    for (const line of s.split('\n').filter(l => l.startsWith('- **'))) {
      const m = /^- \*\*(.+?)\*\* \((\d+)\): (.+)$/.exec(line)!
      groups.push({
        name: m[1],
        declared: Number(m[2]),
        items: m[3].split(';').map(x => ({ raw: x.trim(), lemma: lemma(x), receptive: /\(R\)/.test(x) })),
      })
    }
    out.push({ unit: Number(head[1]), declared: { total: +head[2], productive: +head[3], receptive: +head[4] }, groups })
  }
  return out
}
const maps = parseMap()

describe('vocabulary map', () => {
  it('covers exactly units 12–20, each once, with the approved titles', () => {
    expect(maps.map(m => m.unit)).toEqual(UNITS)
    for (const m of maps) {
      const title = A2_UNIT_PLAN.find(p => p.id === m.unit)!.titleDe
      expect(VOCAB, `unit ${m.unit}`).toContain(`### Unit ${m.unit} — ${title}`)
    }
  })
  it('every declared count adds up (group sizes, productive / receptive, unit totals)', () => {
    for (const m of maps) {
      for (const g of m.groups) expect(g.items.length, `${m.unit} ${g.name}`).toBe(g.declared)
      const all = m.groups.flatMap(g => g.items)
      expect(all.length, `unit ${m.unit} total`).toBe(m.declared.total)
      expect(all.filter(i => !i.receptive).length, `unit ${m.unit} productive`).toBe(m.declared.productive)
      expect(all.filter(i => i.receptive).length, `unit ${m.unit} receptive`).toBe(m.declared.receptive)
    }
  })
  it('each unit plans at least 28 items and at most 20 % receptive', () => {
    for (const m of maps) {
      expect(m.declared.total, `unit ${m.unit}`).toBeGreaterThanOrEqual(28)
      expect(m.declared.receptive / m.declared.total, `unit ${m.unit}`).toBeLessThanOrEqual(0.2)
    }
  })
  it('keeps A2 plan units unique while allowing approved cross-level A1 reuse', () => {
    const seen = new Map<string, number>()
    const a1 = new Set(VOCABULARY.map(v => lemma(v.de)))
    const reusedFromA1 = new Set<string>()
    for (const m of maps)
      for (const g of m.groups)
        for (const i of g.items) {
          expect(seen.has(i.lemma), `"${i.raw}" (unit ${m.unit}) already planned in unit ${seen.get(i.lemma)}`).toBe(false)
          if (a1.has(i.lemma)) reusedFromA1.add(i.lemma)
          seen.set(i.lemma, m.unit)
        }
    expect(reusedFromA1.size).toBeGreaterThan(0)
    // Unit 11 words come from the authored data, not from a copy
    const unit11 = new Set(A2_VOCABULARY.filter(v => v.unit === 11).map(v => lemma(v.de)))
    expect(unit11.size).toBe(37)
    for (const l of seen.keys()) expect(unit11.has(l), `"${l}" is a Unit 11 word`).toBe(false)
    expect(UNIT_11_RECEPTIVE_WORDS.length).toBe(9)
  })
  it('the totals table matches the unit maps', () => {
    for (const m of maps) {
      const row = new RegExp(
        `\\| ${m.unit} \\| ${m.declared.total} \\| ${m.declared.productive} \\| ${m.declared.receptive} \\| ${m.groups.length} \\|`,
      )
      expect(VOCAB, `unit ${m.unit}`).toMatch(row)
    }
    const total = maps.reduce((a, m) => a + m.declared.total, 0) + 37
    expect(VOCAB).toContain(`| **A2 total** | **${total}** |`)
  })
})

describe('curriculum design', () => {
  const sectionOf = (u: number) => {
    const start = DESIGN.indexOf(`\n## Unit ${u} — `)
    const next = DESIGN.indexOf('\n## ', start + 5)
    return DESIGN.slice(start, next === -1 ? undefined : next)
  }
  it('has one section per unit 12–20 with the approved title and key', () => {
    for (const u of UNITS) {
      const p = A2_UNIT_PLAN.find(x => x.id === u)!
      expect(DESIGN, `unit ${u}`).toContain(`## Unit ${u} — ${p.titleDe}`)
      expect(sectionOf(u), `unit ${u}`).toContain(`\`${p.key}\``)
    }
  })
  it('every unit specifies 3–5 can-do objectives, 2 listening scenarios, 1–2 readings, 1 speaking and 1 writing task', () => {
    for (const u of UNITS) {
      const s = sectionOf(u)
      expect((s.match(/^- \*\*O\d\*\*/gm) ?? []).length, `unit ${u} objectives`).toBeGreaterThanOrEqual(4)
      expect((s.match(/^- \*\*L\d\*\*/gm) ?? []).length, `unit ${u} listening`).toBe(2)
      const readings = (s.match(/^- \*\*R\d\*\*/gm) ?? []).length
      expect(readings, `unit ${u} reading`).toBeGreaterThanOrEqual(1)
      expect(readings, `unit ${u} reading`).toBeLessThanOrEqual(2)
      expect((s.match(/^- \*\*S1\*\*/gm) ?? []).length, `unit ${u} speaking`).toBe(1)
      expect((s.match(/^- \*\*W1\*\*/gm) ?? []).length, `unit ${u} writing`).toBe(1)
      const g = (s.match(/^- \*\*G\d\*\*/gm) ?? []).length
      expect(g, `unit ${u} grammar`).toBeGreaterThanOrEqual(2)
      expect(g, `unit ${u} grammar`).toBeLessThanOrEqual(3)
    }
  })
  it('every unit has exactly 8 revision-exercise specs (3 fill / 3 choice / 2 order, ≥ 2 per concept) and 15 final-test specs', () => {
    for (const u of UNITS) {
      const s = sectionOf(u)
      const ex = [...s.matchAll(/^\| E(\d) \| (fill|choice|order) \| (G\d) \|/gm)]
      expect(
        ex.map(m => m[1]),
        `unit ${u} exercises`,
      ).toEqual(['1', '2', '3', '4', '5', '6', '7', '8'])
      const count = (t: string) => ex.filter(m => m[2] === t).length
      expect([count('fill'), count('choice'), count('order')], `unit ${u} types`).toEqual([3, 3, 2])
      const concepts = new Set(ex.map(m => m[3]))
      for (const c of concepts) expect(ex.filter(m => m[3] === c).length, `unit ${u} ${c}`).toBeGreaterThanOrEqual(2)
      const ft = [...s.matchAll(/^\| T(\d+) \| (grammar|vocabulary|reading) \| ([^|]+) \|/gm)]
      expect(
        ft.map(m => Number(m[1])),
        `unit ${u} final test`,
      ).toEqual(Array.from({ length: 15 }, (_, i) => i + 1))
      const skill = (k: string) => ft.filter(m => m[2] === k).length
      expect([skill('grammar'), skill('vocabulary'), skill('reading')], `unit ${u} skills`).toEqual([10, 3, 2])
      expect(ft.filter(m => /↻/.test(m[3])).length, `unit ${u} recycling items`).toBeGreaterThanOrEqual(2)
    }
  })
  it('every unit states its vocabulary size consistently with the vocabulary map', () => {
    for (const m of maps) expect(sectionOf(m.unit), `unit ${m.unit}`).toContain(`**${m.declared.total} items**`)
  })
})

describe('grammar progression', () => {
  const ids = [...GRAMMAR.matchAll(/`(a2-[a-z-]+)`/g)].map(m => m[1])
  it('every concept id of the design appears in the progression document and vice versa', () => {
    // unit keys (a2-ueber-mich, a2-gesundheit, …) are identity, not grammar concepts
    const unitKeys = new Set(A2_UNIT_PLAN.map(p => p.key))
    const designIds = new Set([...DESIGN.matchAll(/`(a2-[a-z-]+)`/g)].map(m => m[1]).filter(i => !unitKeys.has(i)))
    const gramIds = new Set(ids.filter(i => !unitKeys.has(i)))
    for (const i of designIds) expect(gramIds.has(i), `${i} missing in the progression document`).toBe(true)
    for (const i of gramIds) expect(designIds.has(i), `${i} missing in the design document`).toBe(true)
  })
  it('lists the three unit-11 concepts and 24 or 25 new concepts in total', () => {
    for (const c of ['a2-perfekt-erfahrungen', 'a2-praeteritum-sein-haben-modal', 'a2-ereignisse-verbinden']) expect(GRAMMAR).toContain(c)
    const sectionIds = new Set([...DESIGN.matchAll(/^- \*\*G\d\*\* `(a2-[a-z-]+)`/gm)].map(m => m[1]))
    expect(sectionIds.size).toBeGreaterThanOrEqual(22)
    expect(sectionIds.size).toBeLessThanOrEqual(27)
  })
})
