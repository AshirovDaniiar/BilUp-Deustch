// B1 Stage 2D — the owner's approval of the PRODUCT DESIGN is recorded, the permanent identities exist, and the approval dossier, the unit plan and
// the validator configuration agree. This is NOT an official CEFR approval: the ⚑ decisions stay marked "pending independent expert verification",
// B1 stays `planned`, with no released locale, invisible to every learner, and no B1 content exists yet.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { B1_APPROVAL } from '../../scripts/content-validate/b1/approval'
import { B1_CONCEPT_TARGET, B1_CURRICULUM } from '../../scripts/content-validate/b1/curriculum'
import { fullBundle } from '../../scripts/content-validate/bundle'
import { conventions } from '../../scripts/content-validate/conventions'
import { validateContent } from '../../scripts/content-validate/validate'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_META } from '../../src/data/b1/meta'
import { B1_UNIT_PLAN } from '../../src/data/b1/registry'
import { COURSE, availableLevels, courseLevel, isLevelVisible } from '../../src/data/course'

const dossier = readFileSync(join(__dirname, '../../docs/b1/B1_CURRICULUM_V2_APPROVAL.md'), 'utf8')
const section = (from: string, to: string) => dossier.slice(dossier.indexOf(from), dossier.indexOf(to))
const rows = (s: string) =>
  s
    .split('\n')
    .filter(l => /^\| \d/.test(l))
    .map(l => l.split('|').map(c => c.trim()))
const unitRows = rows(section('## 2.', '## 3.')) // | unit | `key` | title | function | overlap | concepts |
const conceptRows = rows(section('## 3.', '## 4.')) // | # | unit | `id` | topic | proficiency | prerequisites | relation | load |
const strip = (s: string) => s.replace(/`/g, '')

describe('the owner approval is recorded — as an approval of the product design only', () => {
  it('is recorded with its scope, and states that CEFR expert verification is still pending', () => {
    expect(B1_APPROVAL.recorded).toBe(true)
    expect(B1_APPROVAL.scope).toBe('product-design')
    expect(B1_APPROVAL.cefrExpertVerification).toBe('pending')
    expect(B1_APPROVAL.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(B1_APPROVAL.by).toBeTruthy()
    expect(B1_APPROVAL.reference).toContain('B1_CURRICULUM_V2_APPROVAL.md')
    expect(B1_CURRICULUM.approved).toBe(true)
  })
  it('the dossier records the approval and does NOT claim official CEFR approval', () => {
    expect(dossier).toMatch(/Owner approval of the product design is recorded/)
    expect(dossier).toMatch(/not an official CEFR approval/i)
    expect(dossier).toMatch(/CEFR[^.\n]*expert[^.\n]*pending|pending independent expert/i)
  })
})

describe('B1 is a Beta for the Russian and Kyrgyz explanation languages (owner approval, B1 Beta launch)', () => {
  it('status beta (NOT released), released locales ru and ky only, visible, offered to the ru and ky interfaces and never to the German interface', () => {
    expect(courseLevel('B1')).toMatchObject({ status: 'beta', releasedLocales: ['ru', 'ky'], unitIdRange: [21, 32] })
    expect(isLevelVisible('B1')).toBe(true)
    for (const lang of ['ru', 'ky'] as const) expect(availableLevels(lang), lang).toContain('B1')
    expect(availableLevels('de')).not.toContain('B1')
    expect(COURSE.levels.map(l => l.id)).toEqual(['A1', 'A2', 'B1'])
  })
  it('only Units 21–28 are authored: the other collections are empty, and B1 is still planned (no learner can reach it)', () => {
    expect(B1_CONTENT.legacyUnits.map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    for (const k of ['placement', 'tutorTemplates', 'instructions'] as const) expect(B1_CONTENT[k]).toHaveLength(0)
    expect(B1_META.map(m => m.unit)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
  })
})

describe('permanent unit identities (B1_UNIT_PLAN)', () => {
  it('12 units, ids 21–32 in order, unique keys and titles, level B1', () => {
    expect(B1_UNIT_PLAN.map(p => p.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(new Set(B1_UNIT_PLAN.map(p => p.key)).size).toBe(12)
    expect(new Set(B1_UNIT_PLAN.map(p => p.titleDe)).size).toBe(12)
    expect(B1_UNIT_PLAN.every(p => p.level === 'B1')).toBe(true)
  })
  it('FROZEN: the approved identities (a change here is a curriculum change, never an accident)', () => {
    expect(B1_UNIT_PLAN.map(p => `${p.id} ${p.key} | ${p.titleDe}`)).toEqual([
      '21 b1-erlebnisse-erinnerungen | Erlebnisse und Erinnerungen erzählen',
      '22 b1-meinungen-diskussion | Meinungen äußern und diskutieren',
      '23 b1-arbeit-bewerbung | Arbeit, Bewerbung und Karriere',
      '24 b1-wohnen-umwelt | Wohnen, Umzug und Umwelt',
      '25 b1-gesundheit-lebensstil | Gesundheit, Beziehungen und Lebensstil',
      '26 b1-medien-technik | Medien, Technik und Nachrichten',
      '27 b1-konsum-reklamation | Konsum, Geld und Reklamation',
      '28 b1-bildung-zukunft | Bildung, Lernen und Zukunftspläne',
      '29 b1-reisen-kultur | Reisen, Kultur und Alltag im Vergleich',
      '30 b1-gesellschaft-engagement | Gesellschaft, Zusammenleben und Engagement',
      '31 b1-behoerden-recht | Behörden, Verträge und Alltagsprobleme',
      '32 b1-rueckblick-pruefung | Rückblick, Bilanz und Prüfungsvorbereitung',
    ])
  })
  it('agrees with the approval dossier §2 (ids, keys, German titles)', () => {
    expect(unitRows.map(r => [Number(r[1]), strip(r[2]), r[3]])).toEqual(B1_UNIT_PLAN.map(p => [p.id, p.key, p.titleDe]))
  })
  it('the keys follow the unit-key convention and the ids lie in the B1 range, so the validator accepts the plan', () => {
    const conv = conventions('b1')
    for (const p of B1_UNIT_PLAN) {
      expect(conv.unitKey.re.test(p.key), p.key).toBe(true)
      expect(p.id).toBeGreaterThanOrEqual(21)
      expect(p.id).toBeLessThanOrEqual(32)
    }
    const issues = validateContent(fullBundle())
    expect(issues.filter(i => /^plan-|^unit-key|^unit-title|^unit-not-planned/.test(i.rule))).toEqual([])
    expect(issues.filter(i => i.severity === 'error')).toEqual([])
  })
})

describe('B1 id conventions (permanent forms; ids are never reused or renamed, a retired item keeps its id)', () => {
  const c = conventions('b1')
  const ok = (cv: { re: RegExp }, ...ids: string[]) => ids.forEach(id => expect(cv.re.test(id), id).toBe(true))
  const no = (cv: { re: RegExp }, ...ids: string[]) => ids.forEach(id => expect(cv.re.test(id), id).toBe(false))
  it('vocabulary keys are v<unit>-<n> and belong to their unit', () => {
    ok(c.vocabulary(21), 'v21-1', 'v21-42')
    no(c.vocabulary(21), 'v22-1', 'v21-0', 'v21-01', 'v2-1', 'v21-', 'b1-v21-1')
  })
  it('lesson ids: exercise, listening, reading, writing, speaking, final-test question and unit/level/placement tests', () => {
    ok(c.exercise(24), 'b1-ex-24-01')
    ok(c.listening(24), 'b1-li-24-02')
    ok(c.reading(24), 'b1-re-24-01')
    ok(c.writing(24), 'b1-wr-24-02')
    ok(c.speaking, 'b1-sp-24-01')
    ok(c.finalQuestion(24), 'b1-ft-24-15')
    ok(c.unitTest(24), 'unit-24')
    ok(c.levelTest, 'level-b1')
    ok(c.placementTest, 'placement-b1')
    no(c.exercise(24), 'a2-ex-24-01', 'b1-ex-25-01', 'b1-ex-24-1')
    no(c.levelTest, 'level-a2')
    ok(c.placementItem, 'b1-pl-01')
    ok(c.instruction, 'b1-in-listening')
    ok(c.tutorTemplate, 'b1-tt-explain')
  })
  it('grammar concept ids are b1-<kebab-case>', () => {
    for (const row of conceptRows) ok(c.grammar, strip(row[3]))
    no(c.grammar, 'a2-wenn-als', 'B1-Passiv', 'b1_passiv')
  })
  it('the vocabulary/lesson id spaces of the levels cannot collide', () => {
    expect(new Set(['v21-1', 'v2-1', 'v11-1', 'v1-1']).size).toBe(4)
    for (const id of ['b1-ex-21-01', 'a2-ex-11-01']) expect(id.startsWith('b1-') || id.startsWith('a2-')).toBe(true)
  })
})

describe('the validator configuration agrees with the approval dossier (§3: 29 concepts)', () => {
  const spec = B1_CURRICULUM.units.flatMap(u => u.concepts.map(c => ({ unit: u.unit, ...c })))
  it('29 concepts; ids, units, allocation counts equal the dossier', () => {
    expect(B1_CONCEPT_TARGET).toBe(29)
    expect(spec).toHaveLength(29)
    expect(conceptRows).toHaveLength(29)
    expect(conceptRows.map(r => [Number(r[2]), strip(r[3])])).toEqual(spec.map(c => [c.unit, c.id]))
    expect(new Set(spec.map(c => c.id)).size).toBe(29)
    // concepts per unit equal the dossier's §2 column
    expect(B1_CURRICULUM.units.map(u => u.concepts.length)).toEqual(unitRows.map(r => Number.parseInt(r[6], 10)))
    expect(B1_CURRICULUM.units.map(u => u.unit)).toEqual(B1_UNIT_PLAN.map(p => p.id))
  })
  it('load equals the dossier column for every concept', () => {
    expect(conceptRows.map(r => r[r.length - 2])).toEqual(spec.map(c => c.load))
  })
  it('proficiency equals the dossier — except that "R-first" is enforced as the CONSERVATIVE R (no silent upgrade of an uncertain decision)', () => {
    const lead = (cell: string) => {
      const first = cell
        .replace('⚑', '')
        .trim()
        .split(/[\s;(/]/)[0]
      return first === 'R-first' ? 'R' : first
    }
    expect(conceptRows.map(r => lead(r[5]))).toEqual(spec.map(c => c.proficiency))
    expect(spec.find(c => c.id === 'b1-genitivattribute')!.proficiency).toBe('R')
  })
  it('every concept the dossier marks ⚑ carries a pending expert review in the configuration, and no other concept does', () => {
    const flagged = conceptRows.filter(r => r.join(' ').includes('⚑')).map(r => strip(r[3]))
    expect(flagged).toEqual([
      'b1-passiv-praesens',
      'b1-lassen',
      'b1-genitiv-praepositionen',
      'b1-futur1-vermutungen',
      'b1-genitivattribute',
      'b1-plusquamperfekt-nachdem',
      'b1-nomen-verb-verbindungen',
      'b1-aktiv-passiv-zustandspassiv',
      'b1-satzbau-mittelfeld',
    ])
    expect(spec.filter(c => c.expertReview).map(c => c.id)).toEqual(flagged)
    for (const c of spec.filter(x => x.expertReview)) {
      expect(c.expertReview!.status).toBe('pending')
      expect(c.expertReview!.decision).toMatch(/^(D|X)-\d+$/)
      expect(c.expertReview!.note.length).toBeGreaterThan(20)
    }
  })
  it('structure: 2–3 concepts per unit, never two H in one unit, Unit 32 is revision only, P-lim caps as named in the curriculum', () => {
    for (const u of B1_CURRICULUM.units) {
      expect(u.concepts.length, `unit ${u.unit}`).toBeGreaterThanOrEqual(2)
      expect(u.concepts.length, `unit ${u.unit}`).toBeLessThanOrEqual(3)
      expect(u.concepts.filter(c => c.load === 'H').length, `unit ${u.unit}`).toBeLessThan(2)
    }
    expect(B1_CURRICULUM.units[11].concepts.every(c => c.role === 'revision')).toBe(true)
    expect(
      B1_CURRICULUM.units
        .slice(0, 11)
        .flatMap(u => u.concepts)
        .every(c => c.role === 'new'),
    ).toBe(true)
    const caps = Object.fromEntries(spec.filter(c => c.listCap).map(c => [c.id, c.listCap]))
    expect(caps).toEqual({
      'b1-praeteritum-erzaehlen': 35,
      'b1-reflexive-dativ': 10,
      'b1-verben-praepositionen': 20,
      'b1-nomen-verb-verbindungen': 20,
    })
  })
})
