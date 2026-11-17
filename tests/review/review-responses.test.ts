// @vitest-environment node
/** Stage 8D — author responses to reviewer findings: decisions, history, preserved findings, implementation records, independence. */
import { describe, expect, it } from 'vitest'
import { A2_REVIEWS } from '../../scripts/content-validate/reviews'
import {
  findingDigest,
  responsePath,
  validateAllResponses,
  validateResponses,
  type Response,
  type ResponseIssue,
} from '../../scripts/review/responses'
import { emptyRecord, recordPath, type Dimension, type Finding, type ReviewRecord } from '../../scripts/review/system'
import type { FactsOf } from '../../scripts/review/validate-records'

const TODAY = '2026-09-01'
const FP: Record<Dimension, string> = { 'de-cefr': 'aaaaaaaaaaaa', 'ru-localization': 'bbbbbbbbbbbb', 'ky-localization': 'cccccccccccc' }
const facts: FactsOf = (_u, d) => ({ fingerprint: FP[d], refs: new Set() })
const finding = (over: Partial<Finding> = {}): Finding => ({
  id: 'F1',
  ref: 'v20-5.example',
  severity: 'major',
  comment: 'The sentence is a literal translation.',
  status: 'open',
  ...over,
})
const records = (f: Finding[] = [finding()], d: Dimension = 'ky-localization'): ReviewRecord[] =>
  (['de-cefr', 'ru-localization', 'ky-localization'] as const).map(x => ({ ...emptyRecord(20, 'T', x), findings: x === d ? f : [] }))
const resp = (over: Partial<Response> = {}): Response => ({
  schema: 1,
  unit: 20,
  dimension: 'ky-localization',
  findingId: 'F1',
  findingDigest: findingDigest(finding()),
  decision: 'accepted',
  rationale: '',
  decidedBy: { name: 'Example Author', role: 'content author' },
  decisionDate: '2026-08-10',
  implementation: { status: 'not_started', description: '', packageFingerprintAfter: '' },
  ...over,
})
const run = (rs: unknown, recs: ReviewRecord[] = records()): ResponseIssue[] => validateResponses(20, rs, recs, facts, TODAY)
const errors = (i: ResponseIssue[]) => i.filter(x => x.level === 'error')
const fields = (i: ResponseIssue[]) => errors(i).map(x => x.field)

describe('author decisions', () => {
  it('accepts valid responses for all four decisions', () => {
    expect(run([resp()])).toEqual([])
    expect(run([resp({ decision: 'rejected', rationale: 'The wording is the standard textbook form.' })])).toEqual([])
    expect(run([resp({ decision: 'needs_clarification', rationale: 'Which wording do you suggest instead?' })])).toEqual([])
    expect(run([resp({ decision: 'deferred', rationale: 'Postponed until the glossary review of unit 20.' })])).toEqual([])
  })
  it('rejects an unknown decision', () => {
    expect(fields(run([resp({ decision: 'maybe' as never })]))).toEqual(['responses[0].decision'])
  })
  it('requires a rationale for rejected, needs_clarification and deferred — not for accepted', () => {
    for (const decision of ['rejected', 'needs_clarification', 'deferred'] as const)
      expect(fields(run([resp({ decision, rationale: 'short' })])), decision).toEqual(['responses[0].rationale'])
    expect(run([resp({ decision: 'accepted', rationale: '' })])).toEqual([])
  })
  it('requires a named human decider with a role, and rejects an AI identity', () => {
    expect(fields(run([resp({ decidedBy: { name: '', role: 'author' } })]))).toEqual(['responses[0].decidedBy.name'])
    expect(fields(run([resp({ decidedBy: { name: 'Example', role: ' ' } })]))).toEqual(['responses[0].decidedBy.role'])
    for (const name of ['Claude', 'the assistant', 'GPT-4', 'bot'])
      expect(fields(run([resp({ decidedBy: { name, role: 'author' } })])), name).toEqual(['responses[0].decidedBy.name'])
  })
  it('requires a real, non-future date', () => {
    for (const d of ['10.08.2026', '2026-02-30', '2027-01-01', ''])
      expect(fields(run([resp({ decisionDate: d })])), d).toEqual(['responses[0].decisionDate'])
  })
})

describe('findings are preserved and history is append-only', () => {
  it('a response whose finding was deleted from the reviewer record is an error that says to restore it', () => {
    const e = errors(run([resp()], records([])))
    expect(e).toHaveLength(1)
    expect(e[0]).toMatchObject({ unit: 20, dimension: 'ky-localization', field: 'responses[0].findingId' })
    expect(e[0].message).toMatch(/never be deleted.*restore/)
  })
  it('a finding that was edited after the decision is flagged (digest mismatch) — never silently accepted', () => {
    const w = run([resp()], records([finding({ comment: 'Changed comment text.' })])).filter(x => x.level === 'warning')
    expect(w).toHaveLength(1)
    expect(w[0].message).toMatch(/changed after this decision/)
    const sev = run([resp()], records([finding({ severity: 'minor' })])).filter(x => x.level === 'warning')
    expect(sev).toHaveLength(1)
  })
  it('several responses to one finding form a history: needs_clarification → accepted → implemented is valid; going back in time is not', () => {
    const history = [
      resp({ decision: 'needs_clarification', rationale: 'Please suggest the wording you prefer.', decisionDate: '2026-08-10' }),
      resp({ decision: 'accepted', decisionDate: '2026-08-12' }),
      resp({
        decision: 'accepted',
        decisionDate: '2026-08-20',
        implementation: {
          status: 'implemented',
          description: 'Reworded v20-5.example in unit20/vocabulary.ts',
          packageFingerprintAfter: FP['ky-localization'],
        },
      }),
    ]
    expect(run(history)).toEqual([])
    expect(fields(run([history[1], history[0]]))).toEqual(['responses[1].decisionDate'])
  })
  it('a finding the reviewer marked resolved without any author decision is a warning', () => {
    const w = run([], records([finding({ status: 'resolved' })]))
    expect(errors(w)).toEqual([])
    expect(w.map(x => x.message)).toEqual(['resolved without any recorded author decision'])
  })
})

describe('implementation records', () => {
  const impl = (over: object) =>
    resp({
      implementation: {
        status: 'implemented',
        description: 'Reworded v20-5.example',
        packageFingerprintAfter: FP['ky-localization'],
        ...over,
      } as never,
    })
  it('an implemented accepted finding needs a description and the regenerated package fingerprint', () => {
    expect(run([impl({})])).toEqual([])
    expect(fields(run([impl({ description: 'x' })]))).toEqual(['responses[0].implementation.description'])
    expect(fields(run([impl({ packageFingerprintAfter: '' })]))).toEqual(['responses[0].implementation.packageFingerprintAfter'])
  })
  it('only an accepted finding can be implemented; not_started must carry no fingerprint', () => {
    expect(fields(run([{ ...impl({}), decision: 'rejected', rationale: 'Standard textbook wording.' }]))).toEqual([
      'responses[0].implementation.status',
    ])
    expect(
      fields(run([resp({ implementation: { status: 'not_started', description: '', packageFingerprintAfter: 'aaaaaaaaaaaa' } })])),
    ).toEqual(['responses[0].implementation.packageFingerprintAfter'])
  })
  it('an implementation recorded against an older package fingerprint is a warning (the package changed again)', () => {
    const w = run([impl({ packageFingerprintAfter: 'dddddddddddd' })])
    expect(errors(w)).toEqual([])
    expect(w[0].message).toMatch(/outdated/)
  })
})

describe('shape, independence and the real repository', () => {
  it('rejects unknown / missing fields, wrong unit, a non-array and a bad dimension', () => {
    expect(fields(run([{ ...resp(), approvedBy: 'x' }]))).toEqual(['responses[0].approvedBy'])
    const { rationale: _r, ...missing } = resp()
    expect(fields(run([missing]))).toEqual(['responses[0].rationale', 'responses[0].rationale'])
    expect(fields(run([resp({ unit: 12 })]))).toEqual(['responses[0].unit'])
    expect(errors(run({ a: 1 }))[0]).toMatchObject({ dimension: 'file', field: '(root)' })
    expect(fields(run([resp({ dimension: 'xx' as never })]))).toEqual(['responses[0].dimension'])
  })
  it('a response is bound to ITS dimension: the same finding id in another dimension does not match', () => {
    const e = errors(run([resp({ dimension: 'ru-localization' })]))
    expect(e[0]).toMatchObject({ dimension: 'ru-localization', field: 'responses[0].findingId' })
  })
  it('each dimension is decided independently: a Russian decision never touches the Kyrgyz finding (undecided stays listed)', () => {
    const files: Record<string, string> = {
      [recordPath(20)]: JSON.stringify([
        ...records([finding()], 'ru-localization').map(r => (r.dimension === 'ky-localization' ? { ...r, findings: [finding()] } : r)),
      ]),
      [responsePath(20)]: JSON.stringify([resp({ dimension: 'ru-localization' })]),
    }
    const r = validateAllResponses(p => files[p], facts, TODAY)
    expect(r.undecided).toEqual([{ unit: 20, dimension: 'ky-localization', findingId: 'F1', findingDigest: findingDigest(finding()) }])
  })
  it('the real repository: no responses yet, no findings invented, nothing undecided, nothing approved', () => {
    const r = validateAllResponses()
    expect(r).toMatchObject({ errors: 0, warnings: 0, responses: 0, undecided: [] })
    expect(A2_REVIEWS).toEqual({})
  })
})
