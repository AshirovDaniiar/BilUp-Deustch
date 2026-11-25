// B1 validator profile (Stage 2C). The synthetic B1 world (b1-fixtures.ts) sits on the REAL A1/A2 content. Nothing here is B1 learning content and no
// identity used here is proposed or permanent; the real B1 data (units, concepts, vocabulary, metadata) is still empty.
import { describe, expect, it } from 'vitest'
import { currentBundle, fullBundle } from '../../scripts/content-validate/bundle'
import { B1_CURRICULUM } from '../../scripts/content-validate/b1/curriculum'
import type { B1Curriculum } from '../../scripts/content-validate/b1/types'
import { lemmaKeys } from '../../scripts/content-validate/b1/lemma'
import { B1_PLUS_PATTERNS, LISTENING_WORDS_MAX, READING_WORDS, SENTENCE_WORDS_MAX } from '../../scripts/content-validate/rules/cefr'
import { B1_BANDS, b1BandOf, profileOf, B2_PLUS_PATTERNS } from '../../scripts/content-validate/profile'
import { validateContent } from '../../scripts/content-validate/validate'
import type { ContentBundle, Issue } from '../../scripts/content-validate/types'
import type { B1UnitMeta } from '../../src/data/b1/meta'
import { clone, validB1Bundle } from './b1-fixtures'

const run = (b: ContentBundle, mode: 'authoring' | 'release' = 'authoring') => validateContent(b, { mode })
const b1Of = (is: Issue[]) => is.filter(i => i.rule.startsWith('b1-'))
const find = (is: Issue[], rule: string, where?: string) =>
  is.find(i => i.rule === rule && (where === undefined || i.where.includes(where)))
const meta = (b: ContentBundle) => b.b1Meta![0] as B1UnitMeta
const t3 = (de: string, ru: string, ky: string) => ({ de, ru, ky })
const D5 = new Set([
  // B1 v2, unit 324 (Konjunktiv I, receptive only) — B2 heuristic review flags
  'cefr-structure-konjunktiv1 exercises:b1-ex-324-05#answer',
  'cefr-structure-konjunktiv1 exercises:b1-ex-324-07#answer',
  'cefr-structure-konjunktiv1 exercises:b1-ex-324-08#answer',
  'cefr-structure-konjunktiv1 grammar:b1-konjunktiv-1-einfuehrung#examples[0].de',
  'cefr-structure-passiv-perfekt reading:b1-re-24-02#body[2]',
  'b1-expert-review-pending grammar:b1-passiv-praesens',
  'b1-expert-review-pending grammar:b1-lassen',
  'b1-expert-review-pending grammar:b1-genitiv-praepositionen',
  'b1-expert-review-pending grammar:b1-futur1-vermutungen',
  'b1-expert-review-pending grammar:b1-genitivattribute',
  'b1-expert-review-pending grammar:b1-plusquamperfekt-nachdem',
  'b1-expert-review-pending grammar:b1-nomen-verb-verbindungen',
  'b1-expert-review-pending grammar:b1-aktiv-passiv-zustandspassiv',
  'b1-expert-review-pending grammar:b1-satzbau-mittelfeld',
])
const finalOf = (b: ContentBundle) => b.finalTests!.find(f => f.unit === 21)!

describe('regression: A1 and A2 validation is unchanged', () => {
  it('the shipped bundle validates with 0 errors and 0 warnings; the review flags are the documented A2/B1 sets (166)', () => {
    const is = run(fullBundle())
    expect(is.filter(i => i.severity === 'error')).toEqual([])
    expect(is.filter(i => i.severity === 'warning')).toEqual([])
    const flags = is.filter(i => i.severity === 'review')
    // The complete shipped bundle currently carries 166 review flags across A2 and B1.
    // 53 earlier flags + 14 register flags of the open decisions that no concept carries (P1 remediation)
    // + 24 Beta flags since the B1 Beta launch: no recorded Russian / Kyrgyz review for each of the 12 units ("blocks a full release")
    // + 4 flags of the B1 v2 Konjunktiv I lesson (unit 324, B2 heuristic: receptive-only, to be confirmed by the CEFR reviewer)
    // + 49 CEFR heuristic flags in the newer A2/B1 reading texts (review only, never structural errors)
    // + 22 vocabulary flags from the approved A2 curriculum-v2 expansion (11 Kyrgyz-equals-Russian notices + 11 CEFR heuristics).
    expect(flags).toHaveLength(166)
    const vocabularyReviews = flags.filter(i => /^vocabulary:/.test(i.where))
    expect(vocabularyReviews).toHaveLength(22)
    expect(vocabularyReviews.filter(i => i.rule === 'l10n-ky-equals-ru-short')).toHaveLength(11)
    expect(vocabularyReviews.filter(i => i.rule === 'cefr-structure-genitiv')).toHaveLength(9)
    expect(vocabularyReviews.filter(i => i.rule === 'cefr-structure-trotzdem')).toHaveLength(2)
    expect(vocabularyReviews.every(i => /^vocabulary:v2(2[2-9]|3[0-7])-\d+#(ru\/ky|example)$/.test(i.where))).toBe(true)
    expect(flags.filter(i => /^vocabulary:v3(0[1-9]|[12][0-9]|3[0-6])-/.test(i.where))).toEqual([])
    expect(flags.filter(i => i.rule === 'beta-review-pending' && /^B1 is in BETA/.test(i.message))).toHaveLength(24)
    expect(flags.filter(i => i.rule === 'curriculum-decision-open').map(i => i.where)).toEqual(
      ['D-1', 'D-2', 'D-4', 'D-10', 'D-11', 'D-12', 'D-13', 'D-14', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6', 'X-7'].map(d => `decisions:${d}`),
    )
    const additionalReadingReviews = flags.filter(
      i =>
        !/^units:(2[1-9]|3[0-2])$/.test(i.where) &&
        !/^vocabulary:/.test(i.where) &&
        !/^beta-|^cefr-signoff|^cefr-limits|^curriculum-decision-open/.test(i.rule) &&
        !D5.has(i.rule + ' ' + i.where),
    )
    expect(additionalReadingReviews).toHaveLength(49)
    expect(additionalReadingReviews.every(i => /^(cefr-structure-|cefr-sentence-length$)/.test(i.rule) && /^reading:(a2|b1)-re-/.test(i.where))).toBe(true)
    for (const u of [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
      expect(
        flags
          .filter(i => i.where === `units:${u}`)
          .map(i => i.rule)
          .sort(),
      ).toEqual(['beta-review-pending', 'beta-review-pending', 'cefr-signoff-missing'])
    expect(b1Of(is).map(i => `${i.rule} ${i.where}`)).toEqual([
      'b1-expert-review-pending grammar:b1-passiv-praesens',
      'b1-expert-review-pending grammar:b1-lassen',
      'b1-expert-review-pending grammar:b1-genitiv-praepositionen',
      'b1-expert-review-pending grammar:b1-futur1-vermutungen',
      'b1-expert-review-pending grammar:b1-genitivattribute',
      'b1-expert-review-pending grammar:b1-plusquamperfekt-nachdem',
      'b1-expert-review-pending grammar:b1-nomen-verb-verbindungen',
      'b1-expert-review-pending grammar:b1-aktiv-passiv-zustandspassiv',
      'b1-expert-review-pending grammar:b1-satzbau-mittelfeld',
    ])
  })
  it('the A2 calibration is exactly the original one (constants, pattern table, wording) and every non-B1 level keeps it', () => {
    expect(READING_WORDS).toEqual({ min: 30, max: 180 })
    expect(SENTENCE_WORDS_MAX).toBe(22)
    expect(LISTENING_WORDS_MAX).toBe(140)
    expect(profileOf('A2').patterns).toBe(B1_PLUS_PATTERNS)
    expect(profileOf('A1').patterns).toBe(B1_PLUS_PATTERNS)
    expect(profileOf(undefined).textChecks).toBe('generic')
    expect(profileOf('A2').patternMessage({ id: 'x', label: 'X', re: /x/ })).toBe(
      'possible B1+ construction: X. Heuristic — a CEFR reviewer must decide',
    )
  })
  it('adding a B1 unit changes nothing that is reported about A1 or A2 (same rules, same places)', () => {
    const key = (i: Issue) => `${i.severity}|${i.rule}|${i.where}`
    const own = (i: Issue) => /^units:2[1-9]|^units:3[0-2]|\bb1-|B1|unit-21|b1-/i.test(`${i.where} ${i.rule}`)
    const before = run(fullBundle())
      .filter(i => !own(i))
      .map(key)
      .sort()
    const after = run(validB1Bundle())
      .filter(i => !own(i))
      .map(key)
      .sort()
    expect(after).toEqual(before)
  })
  it('a bundle without any B1 content yields no b1- issue, in either mode', () => {
    expect(b1Of(run(currentBundle(), 'authoring'))).toEqual([])
    expect(b1Of(run(currentBundle(), 'release'))).toEqual([])
  })
})

describe('profile: B1 has its own calibration', () => {
  it('B1 units use the level-rules text checks and the B2+ ceiling table; B1 constructions are NOT flagged', () => {
    expect(profileOf('B1').textChecks).toBe('level-rules')
    expect(profileOf('B1').patterns).toBe(B2_PLUS_PATTERNS)
    const ids = B2_PLUS_PATTERNS.map(p => p.id)
    expect(ids).toEqual(['passiv-perfekt', 'konj2-vergangenheit', 'futur2', 'konjunktiv1', 'es-sei-denn', 'ohne-statt-dass', 'als-ob'])
    const hit = (s: string) => B2_PLUS_PATTERNS.filter(p => p.re.test(p.caseSensitive ? s : s.toLowerCase())).map(p => p.id)
    for (const ok of [
      'Das Haus wird gebaut, obwohl es regnet.',
      'Ich hätte gern einen Tee.',
      'Wenn ich Zeit hätte, würde ich kommen.',
      'Er hatte den Zug verpasst, nachdem er gegangen war.',
      'Der Müll muss getrennt werden.',
    ])
      expect(hit(ok), ok).toEqual([])
    expect(hit('Das Haus ist gebaut worden.')).toEqual(['passiv-perfekt'])
    expect(hit('Ich hätte das früher gemacht.')).toEqual(['konj2-vergangenheit'])
    expect(hit('Wir gehen, es sei denn, es regnet.')).toEqual(['es-sei-denn'])
  })
  it('the generic A2-calibrated length flags do not fire on B1 texts; the B1 band rules answer instead', () => {
    const b = validB1Bundle()
    b.reading.find(r => r.id === 'b1-re-21-01')!.body = [
      'Das ist ein sehr langer Satz mit vielen Wörtern darin, der absichtlich mehr als zweiundzwanzig Wörter hat, damit die Regel greift und niemand ihn übersieht.',
    ]
    const is = run(b)
    expect(is.filter(i => i.rule === 'cefr-sentence-length' && i.where.includes('b1-'))).toEqual([])
    expect(is.filter(i => i.rule === 'cefr-text-length' && i.where.includes('b1-re-21'))).toEqual([])
    expect(find(is, 'b1-sentence-length')).toBeDefined()
    expect(find(is, 'b1-reading-length', 'b1-re-21-01')).toBeDefined()
  })
  it('B2+ constructions in B1 items are review flags (heuristic), with the B2+ wording', () => {
    const b = validB1Bundle()
    b.reading.find(r => r.id === 'b1-re-21-02')!.body[0] += ' Der Film ist gesehen worden.'
    const f = find(run(b), 'cefr-structure-passiv-perfekt', 'b1-re-21-02')
    expect(f?.severity).toBe('review')
    expect(f?.message).toMatch(/possible B2\+ construction/)
  })
  it('the bands cover Units 21–32 exactly once and ramp upwards', () => {
    for (let u = 21; u <= 32; u++)
      expect(
        B1_BANDS.filter(b => u >= b.units[0] && u <= b.units[1]),
        `unit ${u}`,
      ).toHaveLength(1)
    for (const u of [20, 33, 0]) expect(b1BandOf(u)).toBeUndefined()
    expect(b1BandOf(21)!.reading).toEqual([100, 150])
    expect(b1BandOf(32)!.readingLong).toEqual([200, 250])
    const mins = [21, 23, 27, 30].map(u => b1BandOf(u)!.reading[0])
    expect([...mins].sort((a, b) => a - b)).toEqual(mins)
  })
})

describe('the compliant synthetic B1 unit', () => {
  it('passes every strict rule against the APPROVED allocation: no error, no warning, no B1 issue at all (Unit 21 carries no pending expert decision)', () => {
    const is = run(validB1Bundle())
    expect(is.filter(i => i.severity === 'error')).toEqual([])
    expect(is.filter(i => i.severity === 'warning')).toEqual([])
    expect(b1Of(is)).toEqual([])
  })
  it('also passes in beta mode (severities rise, but nothing is violated)', () => {
    const is = run(validB1Bundle({ status: 'beta' }))
    expect(b1Of(is).filter(i => i.severity !== 'review')).toEqual([])
  })
})

describe('vocabulary counts', () => {
  it('fewer than 38 or more than 42 new words is reported with the exact count and a fix', () => {
    const few = validB1Bundle()
    few.vocabulary = few.vocabulary.filter(v => !['v21-38', 'v21-39', 'v21-40'].includes(v.id))
    const f = find(run(few), 'b1-vocab-count')!
    expect(f.severity).toBe('warning')
    expect(f.message).toMatch(/37 new vocabulary items; the B1 target is 38–42/)
    expect(f.message).toMatch(/Fix: add 1 or more words/)
    const many = validB1Bundle()
    many.vocabulary.push(
      ...[41, 42, 43].map(n => ({ ...clone(many.vocabulary.find(v => v.id === 'v21-1')!), id: `v21-${n}`, de: `Zusatzwort${n}` })),
    )
    expect(find(run(many), 'b1-vocab-count')?.message).toMatch(/43 new vocabulary items/)
  })
  it('the same shortfall is an ERROR once B1 is beta (planned = warning)', () => {
    const b = validB1Bundle({ status: 'beta' })
    b.vocabulary = b.vocabulary.filter(v => !['v21-38', 'v21-39', 'v21-40'].includes(v.id))
    expect(find(run(b), 'b1-vocab-count')?.severity).toBe('error')
  })
})

describe('vocabulary reuse and same-unit duplicate validation', () => {
  const a1 = () => fullBundle().vocabulary.find(v => v.unit <= 10 && v.de.length > 3)!
  const a2 = () => fullBundle().vocabulary.find(v => v.unit >= 11 && v.unit <= 20 && v.de.length > 3)!
  it('rejects legacy cross-level/cross-unit reuse while v2 allows reuse', () => {
    const b = fullBundle()
    const pairs = [
      ['v22-21', 'v104-18'],
      ['v23-33', 'v105-21'],
      ['v25-34', 'v109-14'],
    ] as const

    for (const [b1Id, earlierId] of pairs) {
      const current = b.vocabulary.find(v => v.id === b1Id)!
      const earlier = b.vocabulary.find(v => v.id === earlierId)!
      expect(lemmaKeys(current.de)).toEqual(lemmaKeys(earlier.de))
    }

    b.vocabulary.find(v => v.id === 'v21-3')!.de = a1().de
    b.vocabulary.find(v => v.id === 'v22-3')!.de = b.vocabulary.find(v => v.id === 'v21-5')!.de
    expect(find(run(b), 'b1-vocab-repeats-earlier-level', 'v21-3')?.severity).toBe('error')
    expect(find(run(b), 'b1-vocab-duplicate-in-level', 'v22-3')?.severity).toBe('error')

    const v2 = structuredClone(fullBundle())
    v2.vocabulary.find(v => v.id === 'v301-1')!.de = a1().de
    v2.vocabulary.find(v => v.id === 'v302-1')!.de = v2.vocabulary.find(v => v.id === 'v301-2')!.de
    expect(
      run(v2).filter(i => i.severity === 'error' && ['vocabulary:v301-1', 'vocabulary:v302-1'].includes(i.where)),
    ).toEqual([])
  })
  it('detects a legacy A1/A2 repeat despite article, case or reflexive normalization', () => {
    const b = validB1Bundle()
    const w = a2()
    b.vocabulary.find(v => v.id === 'v21-4')!.de = `die ${w.de.replace(/^(der|die|das)\s+/i, '').toUpperCase()}`
    expect(find(run(b), 'b1-vocab-repeats-earlier-level', 'v21-4')?.severity).toBe('error')
    expect(lemmaKeys('sich freuen')).toEqual(['freuen'])
    expect(lemmaKeys('der Arzt, die Ärztin')).toEqual(['arzt', 'ärztin'])
    expect(lemmaKeys('das Haus (Gebäude)')).toEqual(['haus'])
  })
  it('validates optional new-sense notes when supplied; an unused allowance is reported', () => {
    const b = validB1Bundle()
    b.vocabulary.find(v => v.id === 'v21-3')!.de = a1().de
    meta(b).vocabularyAllowances = [{ id: 'v21-3', earlierId: a1().id, note: 'neue Bedeutung: im Sinn von „Anteil“' }]
    expect(run(b).some(i => i.severity === 'error' && i.where === 'vocabulary:v21-3')).toBe(false)
    meta(b).vocabularyAllowances![0].note = 'ok'
    expect(find(run(b), 'b1-vocab-allowance-note')?.severity).toBe('error')
    meta(b).vocabularyAllowances = [{ id: 'v21-9', earlierId: a1().id, note: 'neue Bedeutung hier' }]
    expect(find(run(b), 'b1-vocab-allowance-unused')).toBeDefined()
  })
  it('legacy same-unit and cross-unit repeats are errors; v2 allows cross-unit reuse', () => {
    const b = validB1Bundle()
    b.vocabulary.find(v => v.id === 'v21-6')!.de = b.vocabulary.find(v => v.id === 'v21-5')!.de.toLowerCase()
    expect(find(run(b), 'b1-vocab-duplicate-in-level', 'v21-6')?.severity).toBe('error')
    const acrossUnits = fullBundle()
    const unit22 = acrossUnits.vocabulary.filter(v => v.unit === 22)
    const reusable = acrossUnits.vocabulary
      .filter(v => v.unit === 21)
      .find(v => !unit22.some(other => lemmaKeys(other.de).some(k => lemmaKeys(v.de).includes(k))))!
    acrossUnits.vocabulary.find(v => v.id === 'v22-6')!.de = reusable.de
    expect(find(run(acrossUnits), 'b1-vocab-duplicate-in-level', 'v22-6')?.severity).toBe('error')

    const v2 = structuredClone(fullBundle())
    v2.vocabulary.find(v => v.id === 'v302-1')!.de = v2.vocabulary.find(v => v.id === 'v301-2')!.de
    expect(find(run(v2), 'b1-vocab-duplicate-in-level', 'v302-1')).toBeUndefined()
    v2.vocabulary.find(v => v.id === 'v301-7')!.de = v2.vocabulary.find(v => v.id === 'v301-5')!.de.toLowerCase()
    expect(find(run(v2), 'b1-vocab-duplicate-in-level', 'v301-7')?.severity).toBe('error')
  })
  it('same-unit duplicate detection does not depend on the curriculum approval', () => {
    const b = validB1Bundle()
    b.b1Curriculum = { ...(b.b1Curriculum as B1Curriculum), approved: true }
    b.vocabulary.find(v => v.id === 'v21-3')!.de = b.vocabulary.find(v => v.id === 'v21-5')!.de
    expect(find(run(b), 'b1-vocab-duplicate-in-level', 'v21-5')).toBeDefined()
  })
})

describe('grammar concept allocation', () => {
  it('the number of concepts of a unit must equal the curriculum allocation', () => {
    const b = validB1Bundle()
    b.grammar = b.grammar.filter(g => g.id !== 'b1-temporale-konnektoren')
    b.units.find(u => u.id === 21)!.grammarIds = ['b1-praeteritum-erzaehlen']
    const f = find(run(b), 'b1-allocation-count')!
    expect(f.message).toMatch(/1 grammar concepts; the curriculum allocates 2/)
    expect(f.message).toMatch(/Fix: add the missing concept/)
  })
  it('a unit may not combine two paradigm-heavy (H) concepts', () => {
    const b = validB1Bundle()
    meta(b).concepts[1].load = 'H'
    expect(find(run(b), 'b1-allocation-overload')?.message).toMatch(/2 paradigm-heavy/)
  })
  it('the total may not exceed the 29 concepts of the curriculum', () => {
    const b = validB1Bundle()
    for (let i = 0; i < 28; i++)
      b.grammar.push({ ...clone(b.grammar.find(g => g.id === 'b1-praeteritum-erzaehlen')!), id: `b1-extra-${i}`, unit: 22 })
    expect(find(run(b), 'b1-allocation-total')?.message).toMatch(/30 grammar concepts; the curriculum target is 29/)
  })
  it('Unit 32 may not declare a NEW grammar concept (consolidation only)', () => {
    const b = validB1Bundle()
    b.units.push({
      ...clone(b.units.find(u => u.id === 21)!),
      id: 32,
      key: 'b1-rueckblick-pruefung',
      title: 'Rückblick, Bilanz und Prüfungsvorbereitung',
      grammarIds: [],
    })
    const m = clone(meta(b))
    m.unit = 32
    b.b1Meta = [...b.b1Meta!, m]
    const f = find(run(b), 'b1-unit32-new-grammar')!
    expect(f.severity).toBe('error')
    expect(f.message).toMatch(/no new grammar system/)
    m.concepts.forEach(c => (c.role = 'revision'))
    expect(find(run(b), 'b1-unit32-new-grammar')).toBeUndefined()
  })
  it('while the approval is NOT recorded, concept ids are not enforced; a different classification is only a review flag', () => {
    const b = validB1Bundle()
    b.b1Curriculum = { ...b.b1Curriculum!, approved: false }
    expect(find(run(b), 'b1-allocation-id')).toBeUndefined()
    meta(b).concepts[1].proficiency = 'R'
    const f = find(run(b), 'b1-allocation-provisional-diff')!
    expect(f.severity).toBe('review')
    expect(f.message).toMatch(/not enforced until the approval is recorded/)
  })
  it('once the approval is recorded, ids, classification and list caps are enforced', () => {
    const approvedWith = (concepts: B1Curriculum['units'][number]['concepts']): B1Curriculum => ({
      approved: true,
      units: [{ unit: 21, concepts, requires: { ...B1_CURRICULUM.units[0].requires, topics: ['feelings'] } }],
    })
    const b = validB1Bundle()
    b.b1Curriculum = approvedWith([
      { id: 'b1-praeteritum-erzaehlen', proficiency: 'P-lim', load: 'H', role: 'new', listCap: 3 },
      { id: 'b1-temporale-konnektoren', proficiency: 'P', load: 'M', role: 'new' },
    ])
    expect(b1Of(run(b)).filter(i => i.severity !== 'review')).toEqual([])
    const wrongId = clone(b)
    wrongId.b1Curriculum = approvedWith([
      { id: 'b1-approved-one', proficiency: 'P-lim', load: 'H', role: 'new' },
      { id: 'b1-temporale-konnektoren', proficiency: 'P', load: 'M', role: 'new' },
    ])
    const is = run(wrongId)
    expect(find(is, 'b1-allocation-id', 'b1-praeteritum-erzaehlen')?.message).toMatch(/not in the approved allocation of unit 21/)
    expect(find(is, 'b1-allocation-missing')?.message).toMatch(/b1-approved-one/)
    const wrongClass = clone(b)
    meta(wrongClass).concepts[1].proficiency = 'R'
    expect(find(run(wrongClass), 'b1-allocation-classification')?.severity).toBe('error')
    const longList = clone(b)
    meta(longList).concepts[0].closedList = ['a', 'b', 'c', 'd']
    expect(find(run(longList), 'b1-closed-list-size')?.message).toMatch(/4 entries; the cap is 3/)
  })
})

describe('productive vs receptive classification', () => {
  it('every concept must be classified; the value must be P, P-lim or R; P-lim needs a closed list', () => {
    const missing = validB1Bundle()
    meta(missing).concepts = meta(missing).concepts.slice(0, 1)
    expect(find(run(missing), 'b1-proficiency-missing', 'b1-temporale-konnektoren')).toBeDefined()
    const bad = validB1Bundle()
    ;(meta(bad).concepts[0] as { proficiency: string }).proficiency = 'X'
    expect(find(run(bad), 'b1-proficiency-invalid')?.severity).toBe('error')
    const noList = validB1Bundle()
    delete meta(noList).concepts[0].closedList
    expect(find(run(noList), 'b1-closed-list-missing')?.message).toMatch(/closed list/)
  })
  it('a receptive-only form may NOT be required by a writing pattern, a speaking keyword, a gap-fill exercise or a gap-fill test item', () => {
    const b = validB1Bundle()
    meta(b).concepts[1].constructions = [{ label: 'Passiv Perfekt', proficiency: 'R', forms: ['worden'] }]
    b.writing.find(w => w.id === 'b1-wr-21-01')!.mustInclude = [{ label: 'Passiv', patterns: ['worden'] }]
    b.speaking.find(s => s.id === 'b1-sp-21-01')!.turns[0].keywords = ['worden']
    b.exercises.find(e => e.id === 'b1-ex-21-01')!.answer = 'gebaut worden'
    const gap = finalOf(b).questions.find(q => q.prompt.includes('___'))!
    gap.answer = 'gemacht worden'
    gap.options = ['gemacht worden', 'machen', 'gemacht']
    const is = run(b).filter(i => i.rule === 'b1-receptive-required')
    for (const w of ['writing:b1-wr-21-01', 'speaking:b1-sp-21-01', 'exercises:b1-ex-21-01', `finalTests:unit21/${gap.id}`])
      expect(
        is.some(i => i.where === w && i.severity === 'error'),
        w,
      ).toBe(true)
    expect(is[0].message).toMatch(/receptive-only in B1.*Fix: remove it from the production item/)
  })
  it('a receptive form may appear in TEXTS, and may become productive after its `receptiveThrough` unit', () => {
    const b = validB1Bundle()
    meta(b).concepts[1].constructions = [{ label: 'Passiv Perfekt', proficiency: 'R', forms: ['worden'] }]
    b.reading.find(r => r.id === 'b1-re-21-01')!.body[0] += ' Der Film ist gesehen worden.'
    expect(find(run(b), 'b1-receptive-required')).toBeUndefined()
    b.writing.find(w => w.id === 'b1-wr-21-01')!.mustInclude = [{ label: 'Passiv', patterns: ['worden'] }]
    expect(find(run(b), 'b1-receptive-required')).toBeDefined()
    meta(b).concepts[1].constructions![0].receptiveThrough = 20
    expect(find(run(b), 'b1-receptive-required')).toBeUndefined()
  })
  it('receptive-only constructions without a concept (e.g. Konjunktiv II der Vergangenheit) are enforced the same way', () => {
    const b = validB1Bundle()
    meta(b).receptiveOnly = [{ label: 'Konjunktiv II der Vergangenheit', proficiency: 'R', forms: ['hätte gekonnt'] }]
    b.writing.find(w => w.id === 'b1-wr-21-01')!.mustInclude = [{ label: 'KII', patterns: ['hätte gekonnt'] }]
    expect(find(run(b), 'b1-receptive-required', 'writing:b1-wr-21-01')).toBeDefined()
  })
  it('a whole-concept receptive classification forbids gap-fill/order practice of that concept', () => {
    const b = validB1Bundle()
    meta(b).concepts[0].proficiency = 'R'
    const is = run(b).filter(i => i.rule === 'b1-receptive-in-production')
    expect(is.some(i => i.where.startsWith('exercises:'))).toBe(true)
    expect(is.some(i => i.where.startsWith('finalTests:'))).toBe(true)
    expect(is[0].message).toMatch(/Fix: make it a recognition/)
  })
})

describe('RU/KY structural parity', () => {
  it('a Kyrgyz (or Russian) text without Cyrillic letters is reported (untranslated)', () => {
    const b = validB1Bundle()
    b.vocabulary.find(v => v.id === 'v21-1')!.ky = 'untranslated word'
    const f = find(run(b), 'b1-parity-script', 'vocabulary:v21-1')!
    expect(f.message).toMatch(/Kyrgyz text contains no Cyrillic/)
    const ru = validB1Bundle()
    ru.vocabulary.find(v => v.id === 'v21-2')!.ru = 'untranslated word'
    expect(find(run(ru), 'b1-parity-script', 'vocabulary:v21-2')?.message).toMatch(/Russian text contains no Cyrillic/)
  })
  it('numbers, {placeholders} and quoted German examples must agree between the two languages', () => {
    const b = validB1Bundle()
    b.vocabulary.find(v => v.id === 'v21-1')!.exampleKy = 'Бул мисал.' // Russian has the number 1
    b.grammar.find(g => g.id === 'b1-praeteritum-erzaehlen')!.why = l2('Нужен {word}.', 'Керек.')
    b.grammar.find(g => g.id === 'b1-temporale-konnektoren')!.title = l2('Форма «ging» и «sah»', 'Форма «ging»')
    const is = run(b)
    expect(find(is, 'b1-parity-numbers', 'vocabulary:v21-1')?.message).toMatch(/Russian \[1\] vs Kyrgyz \[\]/)
    expect(find(is, 'b1-parity-placeholder', 'b1-praeteritum-erzaehlen')?.message).toMatch(/\{word\}/)
    expect(find(is, 'b1-parity-quoted', 'b1-temporale-konnektoren')?.message).toMatch(/"sah"/)
  })
  it('a very different size is a review flag, never an error', () => {
    const b = validB1Bundle()
    const v = b.vocabulary.find(x => x.id === 'v21-1')!
    v.exampleRu = 'Это достаточно длинный пример предложения для проверки размера 1.'
    v.exampleKy = 'Мисал 1.'
    const f = find(run(b), 'b1-parity-length', 'vocabulary:v21-1')!
    expect(f.severity).toBe('review')
  })
  it('the unit metadata texts are covered, and a Kyrgyz copy of the Russian text is rejected', () => {
    const b = validB1Bundle()
    meta(b).objectives.lesen.ky = meta(b).objectives.lesen.ru
    expect(find(run(b), 'b1-objective-invalid', 'objectives.lesen')?.message).toMatch(/Kyrgyz is a copy of the Russian text/)
    const c = validB1Bundle()
    meta(c).strands.repairChunks[0].ky = 'plain latin text here'
    expect(find(run(c), 'b1-parity-script', 'repairChunks[0]')).toBeDefined()
  })
})

describe('required lesson components and learning objectives', () => {
  it('a B1 unit without metadata is reported, naming where to add it', () => {
    const b = validB1Bundle()
    b.b1Meta = []
    expect(find(run(b), 'b1-meta-missing')?.message).toMatch(/Fix: add a B1UnitMeta entry/)
  })
  it('metadata for a unit that is not an authored B1 unit is an error', () => {
    const b = validB1Bundle()
    b.b1Meta = [...b.b1Meta!, { ...clone(meta(b)), unit: 25 }, { ...clone(meta(b)), unit: 5 }]
    expect(find(run(b), 'b1-meta-orphan', 'b1Meta:25')?.severity).toBe('error')
    expect(find(run(b), 'b1-meta-orphan', 'b1Meta:5')?.severity).toBe('error')
  })
  it('objectives: 2–3 can-do goals and one objective per skill, each as "Ich kann …" in German plus ru and ky', () => {
    const b = validB1Bundle()
    meta(b).canDo = meta(b).canDo.slice(0, 1)
    meta(b).objectives.sprechen = t3('Wir können sprechen.', 'Мы можем говорить.', 'Биз сүйлөй алабыз.')
    meta(b).objectives.schreiben = t3('', 'Я могу писать.', 'Мен жаза алам.')
    delete (meta(b).objectives as Partial<typeof meta extends never ? never : Record<string, unknown>>).hoeren
    const is = run(b)
    expect(find(is, 'b1-objective-count')?.message).toMatch(/1 can-do goals; the standard is 2–3/)
    expect(find(is, 'b1-objective-form', 'sprechen')?.message).toMatch(/does not start with "Ich kann"/)
    expect(find(is, 'b1-objective-invalid', 'schreiben')?.message).toMatch(/de is empty/)
    expect(find(is, 'b1-objective-invalid', 'hoeren')?.message).toMatch(/missing/)
  })
  it('exactly 2 readings and 2 listenings; at most 10 handwritten exercises', () => {
    const b = validB1Bundle()
    b.reading = b.reading.filter(r => r.id !== 'b1-re-21-02')
    b.listening.push({ ...clone(b.listening.find(l => l.id === 'b1-li-21-01')!), id: 'b1-li-21-03' })
    for (let i = 9; i <= 11; i++)
      b.exercises.push({ ...clone(b.exercises.find(e => e.id === 'b1-ex-21-01')!), id: `b1-ex-21-${String(i).padStart(2, '0')}` })
    const is = run(b)
    expect(find(is, 'b1-reading-count')?.message).toMatch(/1 reading texts; B1 units have 2/)
    expect(find(is, 'b1-listening-count')?.message).toMatch(/3 listening texts/)
    expect(find(is, 'b1-exercise-count')?.message).toMatch(/11 handwritten exercises/)
  })
  it("communication-repair chunks (≥ 3), a strategy note and the scenario's unexpected element are required", () => {
    const b = validB1Bundle()
    meta(b).strands.repairChunks = meta(b).strands.repairChunks.slice(0, 2)
    delete meta(b).strands.strategyNote
    ;(meta(b).scenario as { unexpectedElement?: unknown }).unexpectedElement = undefined
    const is = run(b)
    expect(find(is, 'b1-strand-repair')?.message).toMatch(/2 communication-repair chunks; at least 3/)
    expect(find(is, 'b1-objective-invalid', 'strategyNote')).toBeDefined()
    expect(find(is, 'b1-objective-invalid', 'unexpectedElement')).toBeDefined()
  })
  it('the final test: 15 items as 6/3/4/2 (or 8/3/4/0 without listening), ≥ 2 gap-fill grammar items, ≥ 2 recycled (one from A2 in Units 21–28)', () => {
    const comp = validB1Bundle()
    finalOf(comp).questions[14].skill = 'grammar'
    expect(find(run(comp), 'b1-final-composition')?.message).toMatch(
      /grammar 7 \/ vocabulary 3 \/ reading 4 \/ listening 1; expected 6\/3\/4\/2/,
    )
    const noListening = validB1Bundle()
    finalOf(noListening).questions.forEach(q => (q.skill === 'listening' ? (q.skill = 'grammar') : undefined))
    expect(find(run(noListening), 'b1-final-composition')).toBeUndefined()
    const noGap = validB1Bundle()
    finalOf(noGap).questions.forEach(q => (q.prompt = q.prompt.replace('___', 'war')))
    expect(find(run(noGap), 'b1-final-production')?.message).toMatch(/only 0 grammar items/)
    const noRecycle = validB1Bundle()
    finalOf(noRecycle).questions[0].concept = 'b1-praeteritum-erzaehlen'
    finalOf(noRecycle).questions[1].concept = 'b1-praeteritum-erzaehlen'
    expect(find(run(noRecycle), 'b1-final-recycling')?.message).toMatch(/0 questions recycle earlier concepts/)
    const onlyA1 = validB1Bundle()
    const a1c = fullBundle().grammar.find(g => g.unit <= 10)!.id
    finalOf(onlyA1).questions[0].concept = a1c
    finalOf(onlyA1).questions[1].concept = a1c
    expect(find(run(onlyA1), 'b1-final-recycling')?.message).toMatch(/no recycled question comes from A2/)
  })
  it('requirements of the curriculum per unit: difference from A2, Wortbildung, micro-tasks, comparison phrases — each reported when missing and satisfied when present', () => {
    const b = validB1Bundle()
    const req = {
      ...B1_CURRICULUM.units[0].requires,
      topics: ['feelings'],
      wortbildung: true,
      meinungMicroTask: true,
      mediationMicroTask: true,
      comparison: true,
    }
    b.b1Curriculum = { approved: false, units: [{ ...B1_CURRICULUM.units[0], requires: req }] }
    delete meta(b).differenceFromA2
    const is = run(b)
    for (const r of ['b1-strand-meinung', 'b1-strand-mediation', 'b1-strand-comparison']) expect(find(is, r), r).toBeDefined()
    expect(find(is, 'b1-objective-invalid', 'differenceFromA2')).toBeDefined()
    expect(find(is, 'b1-objective-invalid', 'wortbildungNote')).toBeDefined()
    // satisfy them
    const ok = clone(b)
    meta(ok).differenceFromA2 = t3('A2 erzählt kurz.', 'A2 коротко.', 'A2 кыска.')
    meta(ok).strands.wortbildungNote = t3('Achte auf -ung.', 'Обратите внимание на -ung.', '-ung кошулмасына көңүл буруңуз.')
    meta(ok).strands.comparisonPhrases = ['im Vergleich zu', 'im Gegensatz zu', 'dagegen']
    ok.reading.find(r => r.id === 'b1-re-21-01')!.body[0] += ' Im Vergleich zu gestern ist es heute dagegen kalt.'
    ok.writing.push(
      { ...clone(ok.writing[ok.writing.length - 1]), id: 'b1-wr-21-02', minWords: 40 },
      { ...clone(ok.writing[ok.writing.length - 1]), id: 'b1-wr-21-03', minWords: 40 },
    )
    meta(ok).microTasks = [
      { kind: 'meinung', taskId: 'b1-wr-21-02' },
      { kind: 'mediation', taskId: 'b1-wr-21-03' },
    ]
    expect(b1Of(run(ok)).filter(i => i.severity !== 'review')).toEqual([])
  })
  it('required topics must cite existing items of the unit; the A2→B1 bridge must recap earlier concepts', () => {
    const b = validB1Bundle()
    meta(b).topics = [{ topic: 'feelings', itemIds: ['v99-1'] }]
    meta(b).recapConcepts = ['b1-praeteritum-erzaehlen']
    const is = run(b)
    expect(find(is, 'b1-topic-evidence')?.severity).toBe('error')
    expect(find(is, 'b1-bridge-recap')).toBeDefined()
    const none = validB1Bundle()
    delete meta(none).topics
    expect(find(run(none), 'b1-topic-missing')?.message).toMatch(/must cover the topic "feelings"/)
  })
  it('spaced revision: counts and windows (N−1, N−3, A2); unknown ids are errors', () => {
    const real = fullBundle().vocabulary
    const b = validB1Bundle()
    meta(b).revision = {
      fromPrevious: real
        .filter(v => v.unit === 15)
        .slice(0, 2)
        .map(v => v.id), // wrong unit and too few
      fromThirdBack: ['v99-9'], // unknown
      fromA2: real
        .filter(v => v.unit <= 10)
        .slice(0, 2)
        .map(v => v.id), // A1, not A2
    }
    const is = run(b)
    expect(find(is, 'b1-revision-size')?.message).toMatch(/fromPrevious lists 2 words; at least 4/)
    expect(find(is, 'b1-revision-window')?.message).toMatch(/outside the expected window/)
    expect(find(is, 'b1-revision-unknown')?.severity).toBe('error')
    const gone = validB1Bundle()
    delete meta(gone).revision
    expect(find(run(gone), 'b1-revision-missing')).toBeDefined()
  })
  it('text targets of the unit band: reading, listening, speaking turns, writing length (formal letters may be shorter)', () => {
    const b = validB1Bundle()
    b.reading.find(r => r.id === 'b1-re-21-01')!.body = [Array(5).fill('Wir gehen heute ins Kino und sehen einen langen Film.').join(' ')] // 50 words
    b.listening.find(l => l.id === 'b1-li-21-01')!.lines.length = 4 // 40 words
    b.speaking.find(s => s.id === 'b1-sp-21-01')!.turns.length = 3
    b.writing.find(w => w.id === 'b1-wr-21-01')!.minWords = 120
    const is = run(b)
    expect(find(is, 'b1-reading-length')?.message).toMatch(/50 words; units 21–22 target 100–150.*add about 50 words/)
    expect(find(is, 'b1-listening-length')?.message).toMatch(/40 words; units 21–22 target 110–140/)
    expect(find(is, 'b1-speaking-turns')?.message).toMatch(/3 turns; unit 21 targets 5–6/)
    expect(find(is, 'b1-writing-length')?.message).toMatch(/minWords is 120; unit 21 targets 70–80/)
    const formal = validB1Bundle()
    const w = formal.writing.find(x => x.id === 'b1-wr-21-01')!
    w.formal = true
    w.minWords = 60
    expect(find(run(formal), 'b1-writing-length')).toBeUndefined()
    w.minWords = 50
    expect(find(run(formal), 'b1-writing-length')?.message).toMatch(/targets 60–80 \(formal\)/)
  })
  it('the sentence-length limits of the band (maximum and 95th percentile)', () => {
    const b = validB1Bundle()
    const sentence = (n: number) => Array(n).fill('Wort').join(' ') + '.'
    b.reading.find(r => r.id === 'b1-re-21-01')!.body = [
      Array(3).fill(sentence(20)).join(' ') + ' ' + Array(3).fill('Wir gehen heute ins Kino und sehen einen langen Film.').join(' '),
    ]
    const is = run(b)
    expect(find(is, 'b1-sentence-length')?.message).toMatch(/the longest sentence of unit 21 has 20 words; the limit is 22|95th-percentile/)
  })
})

describe('clear, actionable messages', () => {
  it('every B1 error and warning names the problem and a fix; the unapproved flag names the file to change', () => {
    const b = validB1Bundle()
    b.vocabulary.find(v => v.id === 'v21-3')!.de = fullBundle().vocabulary.find(v => v.unit <= 10)!.de
    b.vocabulary = b.vocabulary.filter(v => v.id !== 'v21-40')
    b.reading = b.reading.filter(r => r.id !== 'b1-re-21-02')
    meta(b).concepts[1].load = 'H'
    meta(b).strands.repairChunks = []
    meta(b).canDo = []
    delete meta(b).revision
    b.b1Curriculum = { ...b.b1Curriculum!, approved: false } // the unapproved notice names the file to change
    const out = b1Of(run(b))
    const problems = out.filter(i => i.severity === 'error' || i.severity === 'warning')
    expect(problems).toHaveLength(6)
    expect(problems.some(i => i.rule === 'b1-vocab-repeats-earlier-level' && i.where === 'vocabulary:v21-3')).toBe(true)
    for (const i of problems) expect(i.message, `${i.rule} ${i.where}`).toMatch(/\. Fix: \S/)
    expect(out.find(i => i.rule === 'b1-curriculum-unapproved')!.message).toContain('scripts/content-validate/b1/approval.ts')
    expect(new Set(problems.map(i => i.rule)).size).toBeGreaterThanOrEqual(5)
  })
})

describe('the writing checklist is localized (Stage 3C)', () => {
  it('a B1 writing task whose expected element has no Russian AND Kyrgyz explanation is reported with a fix', () => {
    const b = validB1Bundle()
    delete (b.writing.find(w => w.id === 'b1-wr-21-01')!.mustInclude[0] as { explain?: unknown }).explain
    const f = find(run(b), 'b1-checklist-localized', 'b1-wr-21-01')!
    expect(f.severity).toBe('warning')
    expect(f.message).toMatch(/Fix: add `explain: { ru, ky }`/)
    const half = validB1Bundle()
    ;(half.writing.find(w => w.id === 'b1-wr-21-01')!.mustInclude[0] as { explain?: { ru: string; ky: string } }).explain = {
      ru: 'Приветствие.',
      ky: '',
    }
    expect(find(run(half), 'b1-checklist-localized')).toBeDefined()
  })
  it('the explanation pair is covered by the RU/KY parity checks (no Cyrillic in the Kyrgyz is reported)', () => {
    const b = validB1Bundle()
    ;(b.writing.find(w => w.id === 'b1-wr-21-01')!.mustInclude[0] as { explain?: { ru: string; ky: string } }).explain = {
      ru: 'Приветствие в письме.',
      ky: 'greeting in the letter',
    }
    expect(find(run(b), 'b1-parity-script', 'mustInclude[0]')).toBeDefined()
  })
  it('the real Unit 21 task passes (every item explained in both languages)', () => {
    expect(b1Of(run(fullBundle())).filter(i => i.rule === 'b1-checklist-localized')).toEqual([])
  })
})

function l2(ru: string, ky: string) {
  return { ru, ky }
}
