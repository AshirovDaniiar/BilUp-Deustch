// Stage 8D — author responses to reviewer findings: an APPEND-ONLY decision history kept beside (never inside) the reviewers' records.
//   docs/review/a2/responses/unit-NN.json   an array of responses; absent file = no responses yet
// A response records who decided what about which finding and why. Nothing here creates, edits or deletes a finding or a record, approves anything,
// or connects to A2_REVIEWS / release validation. `findingDigest` pins the exact finding text that was decided on, so a later silent edit is visible.
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { DIMENSIONS, REVIEW_UNITS, recordPath, unitSlug, type Dimension, type Finding, type ReviewRecord } from './system'
import { currentFacts, type FactsOf } from './validate-records'

export const RESPONSE_DIR = 'docs/review/a2/responses'
export const responsePath = (u: number) => `${RESPONSE_DIR}/${unitSlug(u)}.json`
export const DECISIONS = ['accepted', 'rejected', 'needs_clarification', 'deferred'] as const
export type Decision = (typeof DECISIONS)[number]
export const IMPLEMENTATION = ['not_started', 'implemented'] as const

export interface Response {
  schema: 1
  unit: number
  dimension: Dimension
  findingId: string
  /** digest of the finding (ref | severity | comment) at the time of the decision */
  findingDigest: string
  decision: Decision
  /** required for rejected / needs_clarification / deferred; optional for accepted */
  rationale: string
  decidedBy: { name: string; role: string }
  decisionDate: string
  implementation: { status: (typeof IMPLEMENTATION)[number]; description: string; packageFingerprintAfter: string }
}

export const findingDigest = (f: Pick<Finding, 'ref' | 'severity' | 'comment'>): string =>
  createHash('sha256').update(`${f.ref}|${f.severity}|${f.comment}`).digest('hex').slice(0, 12)

export interface ResponseIssue {
  level: 'error' | 'warning'
  unit: number
  dimension: Dimension | 'file'
  field: string
  message: string
}

const KEYS = [
  'schema',
  'unit',
  'dimension',
  'findingId',
  'findingDigest',
  'decision',
  'rationale',
  'decidedBy',
  'decisionDate',
  'implementation',
]
const AI_NAME = /\b(claude|anthropic|chatgpt|gpt-?\d*|openai|gemini|copilot|assistant|bot|ai|llm|automated|generated)\b/i
const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x)
const str = (x: unknown): x is string => typeof x === 'string'
const realDate = (s: string, today: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(s) && new Date(s + 'T00:00:00Z').toISOString().slice(0, 10) === s && s <= today

/** Validates the responses of one unit against that unit's reviewer records. Pure. */
export function validateResponses(unit: number, parsed: unknown, records: ReviewRecord[], facts: FactsOf, today: string): ResponseIssue[] {
  const out: ResponseIssue[] = []
  if (!Array.isArray(parsed))
    return [{ level: 'error', unit, dimension: 'file', field: '(root)', message: 'expected a JSON array of responses' }]
  const last = new Map<string, string>()
  parsed.forEach((raw, i) => {
    const at = `responses[${i}]`
    if (!isObj(raw)) return out.push({ level: 'error', unit, dimension: 'file', field: at, message: 'expected an object' })
    const dim = (DIMENSIONS as readonly unknown[]).includes(raw.dimension) ? (raw.dimension as Dimension) : undefined
    const D = dim ?? 'file'
    const err = (field: string, message: string) => out.push({ level: 'error', unit, dimension: D, field: `${at}.${field}`, message })
    const warn = (field: string, message: string) => out.push({ level: 'warning', unit, dimension: D, field: `${at}.${field}`, message })
    for (const k of Object.keys(raw)) if (!KEYS.includes(k)) err(k, `unknown field; allowed: ${KEYS.join(', ')}`)
    for (const k of KEYS) if (!(k in raw)) err(k, 'required field is missing')
    if (raw.schema !== 1) err('schema', 'expected 1')
    if (raw.unit !== unit) err('unit', `expected ${unit} (the number of this file), found ${JSON.stringify(raw.unit)}`)
    if (!dim) return err('dimension', `expected one of ${DIMENSIONS.join(', ')}`)

    // the finding must exist (a response can never outlive silently-deleted findings)
    const rec = records.find(r => r.dimension === dim)
    const finding = rec?.findings.find(f => f.id === raw.findingId)
    if (!str(raw.findingId) || raw.findingId === '') err('findingId', 'expected a non-empty finding id')
    else if (!finding)
      err(
        'findingId',
        `finding "${raw.findingId}" does not exist in the ${dim} record of unit ${unit}: findings must never be deleted once decided on — restore it`,
      )
    else {
      if (!str(raw.findingDigest) || !/^[0-9a-f]{12}$/.test(raw.findingDigest))
        err('findingDigest', 'expected 12 lowercase hex characters (see the guide)')
      else if (raw.findingDigest !== findingDigest(finding))
        warn(
          'findingDigest',
          `the finding ${finding.id} was changed after this decision (digest ${raw.findingDigest} → ${findingDigest(finding)}): add a new response to the history`,
        )
    }

    if (!str(raw.decision) || !(DECISIONS as readonly string[]).includes(raw.decision))
      err('decision', `expected one of ${DECISIONS.join(', ')}, found ${JSON.stringify(raw.decision)}`)
    const decision = raw.decision as Decision
    const rationale = str(raw.rationale) ? raw.rationale.trim() : ''
    if (!str(raw.rationale)) err('rationale', 'expected a string')
    else if (decision !== 'accepted' && (DECISIONS as readonly string[]).includes(decision) && rationale.length < 10)
      err('rationale', `a rationale of at least 10 characters is required when the decision is "${decision}"`)

    if (!isObj(raw.decidedBy)) err('decidedBy', 'expected an object { name, role }')
    else {
      const n = str(raw.decidedBy.name) ? raw.decidedBy.name.trim() : ''
      if (n === '') err('decidedBy.name', 'required: a named person decides, never "the system"')
      else if (AI_NAME.test(n)) err('decidedBy.name', `"${n}" looks like an AI or automated identity; a person must record the decision`)
      if (!str(raw.decidedBy.role) || raw.decidedBy.role.trim() === '') err('decidedBy.role', 'required (e.g. "content author", "editor")')
    }
    if (!str(raw.decisionDate) || !realDate(raw.decisionDate, today)) err('decisionDate', 'expected a real, non-future ISO date YYYY-MM-DD')
    else {
      const key = `${dim}|${raw.findingId}`
      if ((last.get(key) ?? '') > raw.decisionDate)
        err('decisionDate', 'history must stay in date order: this decision is older than the previous one for the same finding')
      last.set(key, raw.decisionDate)
    }

    const imp = raw.implementation
    if (!isObj(imp)) err('implementation', 'expected an object { status, description, packageFingerprintAfter }')
    else {
      if (imp.status !== 'not_started' && imp.status !== 'implemented')
        err('implementation.status', 'expected "not_started" or "implemented"')
      if (imp.status === 'implemented') {
        if (decision !== 'accepted') err('implementation.status', 'only an accepted finding can be implemented')
        if (!str(imp.description) || imp.description.trim().length < 10)
          err('implementation.description', 'describe the change (at least 10 characters), e.g. the data file and rows changed')
        if (!str(imp.packageFingerprintAfter) || !/^[0-9a-f]{12}$/.test(imp.packageFingerprintAfter))
          err('implementation.packageFingerprintAfter', 'the fingerprint of the regenerated package (12 hex characters)')
        else if (imp.packageFingerprintAfter !== facts(unit, dim).fingerprint)
          warn(
            'implementation.packageFingerprintAfter',
            `outdated: the package changed again since (then ${imp.packageFingerprintAfter}, now ${facts(unit, dim).fingerprint}); the reviewer re-checks the current one`,
          )
      } else if (imp.status === 'not_started' && (str(imp.packageFingerprintAfter) ? imp.packageFingerprintAfter : '') !== '')
        err('implementation.packageFingerprintAfter', 'must be empty while the status is "not_started"')
    }
  })
  // a finding marked resolved by its reviewer without any author decision is suspicious
  for (const r of records)
    for (const f of r.findings)
      if (f.status === 'resolved' && !parsed.some(p => isObj(p) && p.dimension === r.dimension && p.findingId === f.id))
        out.push({
          level: 'warning',
          unit,
          dimension: r.dimension,
          field: `findings.${f.id}`,
          message: 'resolved without any recorded author decision',
        })
  return out
}

export interface ResponseReport {
  issues: ResponseIssue[]
  errors: number
  warnings: number
  responses: number
  /** per unit and dimension: findings that are open and have no author decision yet */
  undecided: { unit: number; dimension: Dimension; findingId: string; findingDigest: string }[]
}

export function validateAllResponses(
  read: (p: string) => string | undefined = p => (existsSync(p) ? readFileSync(p, 'utf8') : undefined),
  facts: FactsOf = currentFacts,
  today: string = new Date().toISOString().slice(0, 10),
): ResponseReport {
  const issues: ResponseIssue[] = []
  const undecided: ResponseReport['undecided'] = []
  let responses = 0
  for (const unit of REVIEW_UNITS) {
    const rt = read(recordPath(unit))
    let records: ReviewRecord[] = []
    try {
      records = rt ? (JSON.parse(rt) as ReviewRecord[]) : []
    } catch {
      issues.push({
        level: 'error',
        unit,
        dimension: 'file',
        field: recordPath(unit),
        message: 'the reviewer records file is not valid JSON (run `npm run review:validate`)',
      })
      continue
    }
    const text = read(responsePath(unit))
    let parsed: unknown = []
    if (text !== undefined) {
      try {
        parsed = JSON.parse(text)
      } catch (e) {
        issues.push({
          level: 'error',
          unit,
          dimension: 'file',
          field: responsePath(unit),
          message: `not valid JSON: ${(e as Error).message}`,
        })
        continue
      }
    }
    if (Array.isArray(parsed)) responses += parsed.length
    issues.push(...validateResponses(unit, parsed, records, facts, today))
    for (const r of records)
      for (const f of r.findings)
        if (
          f.status === 'open' &&
          !(Array.isArray(parsed) && parsed.some(p => isObj(p) && p.dimension === r.dimension && p.findingId === f.id))
        )
          undecided.push({ unit, dimension: r.dimension, findingId: f.id, findingDigest: findingDigest(f) })
  }
  return {
    issues,
    errors: issues.filter(i => i.level === 'error').length,
    warnings: issues.filter(i => i.level === 'warning').length,
    responses,
    undecided,
  }
}

export const formatResponseIssue = (i: ResponseIssue): string =>
  `${i.level === 'error' ? 'ERROR  ' : 'WARNING'} unit ${i.unit} · ${i.dimension} · ${i.field}: ${i.message}`
