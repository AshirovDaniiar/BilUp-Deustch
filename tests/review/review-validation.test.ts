// @vitest-environment node
/** Stage 8B — validation of the hand-edited A2 review records: valid / invalid records, stale fingerprints, missing reviewer details, approval constraints. */
import { describe, expect, it } from 'vitest'
import { A2_REVIEWS } from '../../scripts/content-validate/reviews'
import { DIMENSIONS, REVIEW_UNITS, emptyRecord, recordPath, type Dimension, type ReviewRecord } from '../../scripts/review/system'
import { formatIssue, validateAll, validateRecords, type FactsOf, type RecordIssue } from '../../scripts/review/validate-records'
import { isLevelVisible } from '../../src/data/course'

const TODAY = '2026-06-01'
const TITLE = 'Unit title'
const FP: Record<Dimension, string> = { 'de-cefr': 'aaaaaaaaaaaa', 'ru-localization': 'bbbbbbbbbbbb', 'ky-localization': 'cccccccccccc' }
const facts: FactsOf = (_u, d) => ({ fingerprint: FP[d], refs: new Set(['v20-1.word', 'v20-1.example']) })
const base = (unit = 20): ReviewRecord[] => DIMENSIONS.map(d => emptyRecord(unit, TITLE, d))
const approved = (d: Dimension, unit = 20): ReviewRecord => ({
  ...emptyRecord(unit, TITLE, d),
  status: 'approved',
  reviewer: { name: 'Aigul Example', qualification: 'native speaker, philologist' },
  reviewDate: '2026-05-20',
  reviewedFingerprint: FP[d],
})
const withRec = (d: Dimension, rec: ReviewRecord, unit = 20): ReviewRecord[] => base(unit).map(r => (r.dimension === d ? rec : r))
const check = (recs: unknown, unit = 20): RecordIssue[] => validateRecords(unit, recs, facts, TODAY, TITLE)
const errors = (i: RecordIssue[]) => i.filter(x => x.level === 'error')
const finding = (over: object = {}) => ({
  id: 'F1',
  ref: 'v20-1.word',
  severity: 'minor',
  comment: 'Please check the article.',
  status: 'open',
  ...over,
})

describe('valid records', () => {
  it('the initial (pending, empty) records of every unit are valid', () => {
    expect(check(base())).toEqual([])
  })
  it('a complete approval for the current fingerprint is valid', () => {
    expect(check(withRec('ru-localization', approved('ru-localization')))).toEqual([])
  })
  it('in_review needs only a name; changes_requested with an open finding and complete details is valid', () => {
    expect(
      check(
        withRec('ky-localization', {
          ...emptyRecord(20, TITLE, 'ky-localization'),
          status: 'in_review',
          reviewer: { name: 'Aigul Example', qualification: '' },
        }),
      ),
    ).toEqual([])
    const cr = { ...approved('de-cefr'), status: 'changes_requested' as const, findings: [finding({ severity: 'major' })] as never }
    expect(errors(check(withRec('de-cefr', cr)))).toEqual([])
  })
  it('approval with only minor / suggestion / resolved findings is valid', () => {
    const rec = {
      ...approved('de-cefr'),
      findings: [
        finding(),
        finding({ id: 'F2', severity: 'suggestion' }),
        finding({ id: 'F3', severity: 'blocker', status: 'resolved' }),
      ] as never,
    }
    expect(errors(check(withRec('de-cefr', rec)))).toEqual([])
  })
})

describe('invalid records — each error names the unit, the dimension, the field and the reason', () => {
  const one = (d: Dimension, rec: object, unit = 20) => errors(check(withRec(d, rec as ReviewRecord, unit), unit))
  it('rejects a bad status', () => {
    const e = one('ru-localization', { ...emptyRecord(20, TITLE, 'ru-localization'), status: 'done' })
    expect(e).toHaveLength(1)
    expect(e[0]).toMatchObject({ unit: 20, dimension: 'ru-localization', field: 'status' })
    expect(e[0].message).toMatch(/pending, in_review, changes_requested, approved/)
  })
  it('rejects missing reviewer details for each final status, field by field', () => {
    const r = approved('ky-localization')
    for (const [field, patch] of [
      ['reviewer.name', { reviewer: { ...r.reviewer, name: '' } }],
      ['reviewer.qualification', { reviewer: { ...r.reviewer, qualification: ' ' } }],
      ['reviewDate', { reviewDate: '' }],
      ['reviewedFingerprint', { reviewedFingerprint: '' }],
    ] as const) {
      const e = one('ky-localization', { ...r, ...patch })
      expect(
        e.map(x => x.field),
        field,
      ).toContain(field)
      expect(e.every(x => x.unit === 20 && x.dimension === 'ky-localization')).toBe(true)
    }
    const started = one('de-cefr', { ...emptyRecord(20, TITLE, 'de-cefr'), status: 'in_review' })
    expect(started.map(x => x.field)).toEqual(['reviewer.name'])
  })
  it('rejects invalid, impossible and future dates', () => {
    for (const d of ['20.05.2026', '2026-5-2', '2026-02-30', '2026-13-01', 'yesterday'])
      expect(
        one('de-cefr', { ...approved('de-cefr'), reviewDate: d }).map(x => x.field),
        d,
      ).toContain('reviewDate')
    const future = one('de-cefr', { ...approved('de-cefr'), reviewDate: '2026-12-31' })
    expect(future[0].message).toMatch(/future/)
  })
  it('rejects a malformed fingerprint', () => {
    expect(one('de-cefr', { ...approved('de-cefr'), reviewedFingerprint: 'ABC' })[0]).toMatchObject({ field: 'reviewedFingerprint' })
  })
  it('rejects an AI / bot identity presented as the reviewer', () => {
    for (const name of ['Claude', 'ChatGPT', 'GPT-4', 'AI assistant', 'review bot', 'Gemini', 'automated'])
      expect(
        one('ru-localization', { ...approved('ru-localization'), reviewer: { name, qualification: 'native speaker' } }).map(x => x.field),
        name,
      ).toContain('reviewer.name')
    expect(
      one('ru-localization', {
        ...emptyRecord(20, TITLE, 'ru-localization'),
        status: 'in_review',
        reviewer: { name: 'Claude', qualification: '' },
      }).map(x => x.field),
    ).toContain('reviewer.name')
  })
  it('rejects invalid or incomplete findings (severity, description, status, id, ref)', () => {
    const e = one('de-cefr', {
      ...approved('de-cefr'),
      findings: [
        finding({ severity: 'critical' }),
        finding({ id: 'F2', comment: ' ' }),
        finding({ id: 'F3', status: 'done' }),
        finding({ id: 'F1' }),
        finding({ id: 'F5', ref: 'v99-1.word' }),
        finding({ id: '' }),
      ],
    })
    const fields = e.map(x => x.field)
    expect(fields).toEqual(
      expect.arrayContaining([
        'findings[0].severity',
        'findings[1].comment',
        'findings[2].status',
        'findings[3].id',
        'findings[4].ref',
        'findings[5].id',
      ]),
    )
    expect(e.find(x => x.field === 'findings[4].ref')!.message).toMatch(/not a row of the de-cefr package of unit 20/)
    expect(e.find(x => x.field === 'findings[0].severity')!.message).toMatch(/blocker, major, minor, suggestion/)
  })
  it('rejects unknown and missing fields and a wrong unit, title or schema', () => {
    const r = emptyRecord(20, TITLE, 'de-cefr') as unknown as Record<string, unknown>
    const extra = one('de-cefr', { ...r, approvedBy: 'x' })
    expect(extra.map(x => x.field)).toEqual(['approvedBy'])
    const { reviewDate: _d, ...missing } = r
    expect(one('de-cefr', missing).map(x => x.field)).toEqual(['reviewDate', 'reviewDate'])
    expect(one('de-cefr', { ...r, unit: 12 }).map(x => x.field)).toEqual(['unit'])
    expect(one('de-cefr', { ...r, title: 'other' }).map(x => x.field)).toEqual(['title'])
    expect(one('de-cefr', { ...r, schema: 2 }).map(x => x.field)).toEqual(['schema'])
    expect(one('de-cefr', { ...r, findings: 'none' }).map(x => x.field)).toEqual(['findings'])
    expect(one('de-cefr', { ...r, reviewer: 'Anna' }).map(x => x.field)).toEqual(['reviewer'])
  })
  it('rejects a file that is not exactly the three records (missing, duplicate, not an array)', () => {
    expect(errors(check({ a: 1 }))[0]).toMatchObject({ dimension: 'file', field: '(root)' })
    expect(errors(check(base().slice(0, 2))).map(x => `${x.dimension}:${x.field}`)).toEqual(
      expect.arrayContaining(['file:(root)', 'ky-localization:dimension']),
    )
    expect(errors(check([...base(), base()[0]])).map(x => `${x.dimension}:${x.field}`)).toEqual(
      expect.arrayContaining(['file:(root)', 'de-cefr:dimension']),
    )
    expect(errors(check([...base().slice(0, 2), { dimension: 'xx-yy' }])).map(x => x.field)).toEqual(
      expect.arrayContaining(['[2].dimension']),
    )
  })
  it('warns (does not fail) when reviewer data exists while the status is still pending', () => {
    const i = check(withRec('de-cefr', { ...emptyRecord(20, TITLE, 'de-cefr'), reviewer: { name: 'Anna', qualification: '' } }))
    expect(errors(i)).toEqual([])
    expect(i.filter(x => x.level === 'warning')).toHaveLength(1)
  })
  it('formats an issue with unit, dimension, field and reason', () => {
    const e = one('ky-localization', { ...approved('ky-localization'), reviewDate: '' })
    expect(formatIssue(e[0])).toMatch(/^ERROR\s+unit 20 · ky-localization · reviewDate: required when status is "approved"/)
  })
})

describe('approval constraints', () => {
  it('an approved record with an open blocker or major finding is invalid; changes_requested without an open finding is invalid', () => {
    for (const severity of ['blocker', 'major']) {
      const e = errors(check(withRec('ru-localization', { ...approved('ru-localization'), findings: [finding({ severity })] as never })))
      expect(e).toHaveLength(1)
      expect(e[0]).toMatchObject({ dimension: 'ru-localization', field: 'findings' })
      expect(e[0].message).toMatch(/no open blocker\/major finding \(open: F1\)/)
    }
    const cr = errors(check(withRec('ru-localization', { ...approved('ru-localization'), status: 'changes_requested' })))
    expect(cr.map(x => x.field)).toEqual(['findings'])
  })
})

describe('stale fingerprints after content changes', () => {
  it('an approval with an outdated fingerprint is an error that names both fingerprints', () => {
    const e = errors(check(withRec('ru-localization', { ...approved('ru-localization'), reviewedFingerprint: 'dddddddddddd' })))
    expect(e).toHaveLength(1)
    expect(e[0]).toMatchObject({ unit: 20, dimension: 'ru-localization', field: 'reviewedFingerprint' })
    expect(e[0].message).toMatch(/stale approval: reviewed dddddddddddd, current bbbbbbbbbbbb/)
  })
  it('the fingerprint of another dimension is stale too (dimensions are never mixed)', () => {
    const e = errors(check(withRec('ky-localization', { ...approved('ky-localization'), reviewedFingerprint: FP['ru-localization'] })))
    expect(e.map(x => x.field)).toEqual(['reviewedFingerprint'])
  })
  it('an outdated fingerprint on a changes_requested record is only a warning', () => {
    const rec = {
      ...approved('de-cefr'),
      status: 'changes_requested' as const,
      findings: [finding()] as never,
      reviewedFingerprint: 'dddddddddddd',
    }
    const i = check(withRec('de-cefr', rec))
    expect(errors(i)).toEqual([])
    expect(i.filter(x => x.level === 'warning')[0].message).toMatch(/outdated/)
  })
})

describe('independence of the three dimensions (validateAll)', () => {
  const files =
    (over: Record<string, ReviewRecord[]> = {}) =>
    (p: string) => {
      const u = REVIEW_UNITS.find(x => recordPath(x) === p)!
      return JSON.stringify(over[String(u)] ?? base(u).map(r => ({ ...r, title: TITLE })))
    }
  const run = (read: (p: string) => string | undefined) => validateAll(read, facts, TODAY, () => TITLE)
  it('a valid Russian approval does not approve Kyrgyz or German; an invalid Kyrgyz record does not invalidate the Russian approval', () => {
    const recs = base(12).map(r => ({ ...r, title: TITLE }))
    recs[1] = { ...approved('ru-localization', 12) }
    recs[2] = { ...approved('ky-localization', 12), reviewDate: '' }
    const r = run(files({ '12': recs }))
    expect(r.approved).toEqual([{ unit: 12, dimension: 'ru-localization' }])
    expect(r.issues.filter(i => i.level === 'error').every(i => i.unit === 12 && i.dimension === 'ky-localization')).toBe(true)
  })
  it('reports a missing file and invalid JSON per unit', () => {
    const r = run(p => (p === recordPath(11) ? undefined : p === recordPath(13) ? '{ not json' : files()(p)))
    expect(r.issues.filter(i => i.level === 'error').map(i => `${i.unit}:${i.dimension}`)).toEqual(['11:file', '13:file'])
    expect(r.filesChecked).toBe(9) // the missing file is not counted; the unreadable one was read
  })
  it('checks all ten units and thirty records', () => {
    const r = run(files())
    expect(r).toMatchObject({ errors: 0, warnings: 0, filesChecked: 10, recordsChecked: 30, approved: [] })
  })
})

describe('the real records of the repository', () => {
  it('all 30 committed records are valid against the CURRENT packages; none is approved', () => {
    const r = validateAll()
    expect(r.issues.filter(i => i.level === 'error').map(formatIssue)).toEqual([])
    expect(r).toMatchObject({ filesChecked: 10, recordsChecked: 30, approved: [] })
  })
  it('stays disconnected from the release gate: A2_REVIEWS empty (Beta with the reviews pending)', () => {
    expect(A2_REVIEWS).toEqual({})
    expect(isLevelVisible('A2')).toBe(true)
  })
})
