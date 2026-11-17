// Stage 8B — validation of the hand-edited A2 review records (docs/review/a2/records/unit-NN.json). Pure functions + a file loader.
// Validation never approves, repairs or rewrites anything. It is NOT connected to `A2_REVIEWS` or release validation.
import { existsSync, readFileSync } from 'node:fs'
import {
  DIMENSIONS,
  REVIEW_UNITS,
  SEVERITIES,
  STATUSES,
  buildModel,
  collectUnit,
  evaluateRecord,
  fingerprintOf,
  recordPath,
  type Dimension,
  type ReviewRecord,
} from './system'

export interface RecordIssue {
  level: 'error' | 'warning'
  unit: number
  /** the review dimension, or `file` for problems of the whole records file */
  dimension: Dimension | 'file'
  field: string
  message: string
}

/** What a record is validated against: the current fingerprint and the existing row references of each package. */
export interface PackageFacts {
  fingerprint: string
  refs: ReadonlySet<string>
}
export type FactsOf = (unit: number, dimension: Dimension) => PackageFacts

export const currentFacts: FactsOf = (unit, dimension) => {
  const m = buildModel(collectUnit(unit), dimension)
  return { fingerprint: fingerprintOf(m), refs: new Set(m.sections.flatMap(s => s.rows.map(r => r.ref))) }
}

const ISO = /^\d{4}-\d{2}-\d{2}$/
const FP = /^[0-9a-f]{12}$/
const RECORD_KEYS = ['schema', 'unit', 'title', 'dimension', 'status', 'reviewer', 'reviewDate', 'reviewedFingerprint', 'findings']
const FINDING_KEYS = ['id', 'ref', 'severity', 'comment', 'status']
const isObj = (x: unknown): x is Record<string, unknown> => typeof x === 'object' && x !== null && !Array.isArray(x)
const str = (x: unknown): x is string => typeof x === 'string'

function validDate(s: string, today: string): string | undefined {
  if (!ISO.test(s)) return 'expected an ISO date YYYY-MM-DD'
  const d = new Date(s + 'T00:00:00Z')
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s) return 'not a real calendar date'
  if (s > today) return `is in the future (today is ${today})`
  return undefined
}

/**
 * Validates the parsed content of one records file. `facts` supplies the current fingerprint / row refs per dimension.
 * `today` is injectable (YYYY-MM-DD) so tests are deterministic.
 */
export function validateRecords(unit: number, parsed: unknown, facts: FactsOf, today: string, expectedTitle: string): RecordIssue[] {
  const out: RecordIssue[] = []
  const err = (dimension: RecordIssue['dimension'], field: string, message: string) =>
    out.push({ level: 'error', unit, dimension, field, message })
  const warn = (dimension: RecordIssue['dimension'], field: string, message: string) =>
    out.push({ level: 'warning', unit, dimension, field, message })

  if (!Array.isArray(parsed)) {
    err('file', '(root)', 'expected a JSON array with exactly three records (de-cefr, ru-localization, ky-localization)')
    return out
  }
  if (parsed.length !== DIMENSIONS.length) err('file', '(root)', `expected exactly ${DIMENSIONS.length} records, found ${parsed.length}`)

  for (const dim of DIMENSIONS) {
    const found = parsed.filter(r => isObj(r) && r.dimension === dim)
    if (found.length === 0) err(dim, 'dimension', `the record for "${dim}" is missing`)
    if (found.length > 1) err(dim, 'dimension', `duplicate records for "${dim}" (${found.length}); expected one`)
  }
  parsed.forEach((r, i) => {
    if (!isObj(r) || !(DIMENSIONS as readonly unknown[]).includes(r.dimension)) {
      err('file', `[${i}].dimension`, `expected one of ${DIMENSIONS.join(', ')}`)
    }
  })

  for (const raw of parsed) {
    if (!isObj(raw) || !(DIMENSIONS as readonly unknown[]).includes(raw.dimension)) continue
    const dim = raw.dimension as Dimension
    const e = (field: string, message: string) => err(dim, field, message)

    for (const k of Object.keys(raw)) if (!RECORD_KEYS.includes(k)) e(k, `unknown field; allowed fields: ${RECORD_KEYS.join(', ')}`)
    for (const k of RECORD_KEYS) if (!(k in raw)) e(k, 'required field is missing')
    if (raw.schema !== 1) e('schema', `expected 1, found ${JSON.stringify(raw.schema)}`)
    if (raw.unit !== unit) e('unit', `expected ${unit} (the number of this file), found ${JSON.stringify(raw.unit)}`)
    if (raw.title !== expectedTitle) e('title', `expected "${expectedTitle}", found ${JSON.stringify(raw.title)}`)

    const status = raw.status
    if (!str(status) || !(STATUSES as readonly string[]).includes(status)) {
      e('status', `expected one of ${STATUSES.join(', ')}, found ${JSON.stringify(status)}`)
      continue
    }

    // reviewer
    let name = ''
    let qualification = ''
    if (!isObj(raw.reviewer)) e('reviewer', 'expected an object { name, qualification }')
    else {
      for (const k of Object.keys(raw.reviewer))
        if (k !== 'name' && k !== 'qualification') e(`reviewer.${k}`, 'unknown field; allowed: name, qualification')
      if (!str(raw.reviewer.name)) e('reviewer.name', 'expected a string')
      else name = raw.reviewer.name.trim()
      if (!str(raw.reviewer.qualification)) e('reviewer.qualification', 'expected a string')
      else qualification = raw.reviewer.qualification.trim()
    }
    const date = str(raw.reviewDate) ? raw.reviewDate : undefined
    if (date === undefined) e('reviewDate', 'expected a string (empty until the review is finished)')
    const reviewed = str(raw.reviewedFingerprint) ? raw.reviewedFingerprint : undefined
    if (reviewed === undefined) e('reviewedFingerprint', 'expected a string (empty until the review is finished)')

    // findings
    const findings: ReviewRecord['findings'] = []
    if (!Array.isArray(raw.findings)) e('findings', 'expected an array')
    else {
      const f = facts(unit, dim)
      const ids = new Set<string>()
      raw.findings.forEach((x, i) => {
        const at = `findings[${i}]`
        if (!isObj(x)) return e(at, 'expected an object { id, ref, severity, comment, status }')
        for (const k of Object.keys(x)) if (!FINDING_KEYS.includes(k)) e(`${at}.${k}`, `unknown field; allowed: ${FINDING_KEYS.join(', ')}`)
        if (!str(x.id) || x.id.trim() === '') e(`${at}.id`, 'expected a non-empty string')
        else if (ids.has(x.id)) e(`${at}.id`, `duplicate finding id "${x.id}"`)
        else ids.add(x.id)
        if (!str(x.ref) || x.ref.trim() === '') e(`${at}.ref`, 'expected a non-empty row reference (the Ref column of the package)')
        else if (!f.refs.has(x.ref)) e(`${at}.ref`, `"${x.ref}" is not a row of the ${dim} package of unit ${unit}`)
        if (!str(x.severity) || !(SEVERITIES as readonly string[]).includes(x.severity))
          e(`${at}.severity`, `expected one of ${SEVERITIES.join(', ')}, found ${JSON.stringify(x.severity)}`)
        if (!str(x.comment) || x.comment.trim().length < 3) e(`${at}.comment`, 'a description is required (at least 3 characters)')
        if (x.status !== 'open' && x.status !== 'resolved')
          e(`${at}.status`, `expected "open" or "resolved", found ${JSON.stringify(x.status)}`)
        if (
          str(x.id) &&
          str(x.ref) &&
          str(x.severity) &&
          str(x.comment) &&
          (x.status === 'open' || x.status === 'resolved') &&
          (SEVERITIES as readonly string[]).includes(x.severity)
        )
          findings.push(x as unknown as ReviewRecord['findings'][number])
      })
    }

    // status-dependent rules
    const needsName = status !== 'pending'
    const final = status === 'approved' || status === 'changes_requested'
    if (needsName && name === '') e('reviewer.name', `required when status is "${status}"`)
    if (final) {
      if (qualification === '') e('reviewer.qualification', `required when status is "${status}"`)
      if (date === undefined || date === '') e('reviewDate', `required when status is "${status}" (YYYY-MM-DD)`)
      else {
        const m = validDate(date, today)
        if (m) e('reviewDate', m)
      }
      if (reviewed === undefined || reviewed === '')
        e('reviewedFingerprint', `required when status is "${status}": copy the fingerprint from the package header`)
      else if (!FP.test(reviewed)) e('reviewedFingerprint', 'expected 12 lowercase hex characters (copy it from the package)')
    } else if (date && date !== '') {
      const m = validDate(date, today)
      if (m) e('reviewDate', m)
    }
    if (
      name !== '' &&
      evaluateRecord(
        { ...(raw as unknown as ReviewRecord), reviewer: { name, qualification: 'x' }, status: 'pending', findings: [] },
        '',
      ).problems.some(p => /AI or automated/.test(p))
    )
      e('reviewer.name', `"${name}" looks like an AI or automated identity; the reviewer must be a person`)
    if (
      status === 'pending' &&
      (name !== '' || qualification !== '' || (date ?? '') !== '' || (reviewed ?? '') !== '' || findings.length > 0)
    )
      warn(
        dim,
        'status',
        'reviewer data or findings are present but the status is still "pending"; set "in_review" when the review has started',
      )

    const open = findings.filter(x => x.status === 'open')
    if (status === 'approved') {
      const blocking = open.filter(x => x.severity === 'blocker' || x.severity === 'major')
      if (blocking.length > 0)
        e('findings', `an approved record must have no open blocker/major finding (open: ${blocking.map(x => x.id).join(', ')})`)
    }
    if (status === 'changes_requested' && open.length === 0) e('findings', 'status "changes_requested" needs at least one open finding')

    // stale detection (against the CURRENT package)
    const current = facts(unit, dim).fingerprint
    if (reviewed && FP.test(reviewed) && reviewed !== current) {
      if (status === 'approved')
        e(
          'reviewedFingerprint',
          `stale approval: reviewed ${reviewed}, current ${current} — the content changed after the review; the approval no longer applies`,
        )
      else warn(dim, 'reviewedFingerprint', `outdated: reviewed ${reviewed}, current ${current}`)
    }
  }
  return out
}

export interface ValidationReport {
  issues: RecordIssue[]
  errors: number
  warnings: number
  /** per unit and dimension: the validly approved dimensions of the CURRENT content (independent of each other) */
  approved: { unit: number; dimension: Dimension }[]
  filesChecked: number
  recordsChecked: number
}

export function validateAll(
  read: (path: string) => string | undefined = p => (existsSync(p) ? readFileSync(p, 'utf8') : undefined),
  facts: FactsOf = currentFacts,
  today: string = new Date().toISOString().slice(0, 10),
  titleOf: (unit: number) => string = u => collectUnit(u).unit.title,
): ValidationReport {
  const issues: RecordIssue[] = []
  const approved: ValidationReport['approved'] = []
  let recordsChecked = 0
  let filesChecked = 0
  for (const unit of REVIEW_UNITS) {
    const text = read(recordPath(unit))
    if (text === undefined) {
      issues.push({
        level: 'error',
        unit,
        dimension: 'file',
        field: recordPath(unit),
        message: 'records file is missing (run `npm run review:system` to create it)',
      })
      continue
    }
    filesChecked++
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch (e) {
      issues.push({ level: 'error', unit, dimension: 'file', field: recordPath(unit), message: `not valid JSON: ${(e as Error).message}` })
      continue
    }
    if (Array.isArray(parsed)) recordsChecked += parsed.length
    const found = validateRecords(unit, parsed, facts, today, titleOf(unit))
    issues.push(...found)
    // approval is judged per dimension: a dimension counts only if ITS record has no error
    if (Array.isArray(parsed))
      for (const r of parsed as ReviewRecord[])
        if (r && r.status === 'approved' && !found.some(i => i.level === 'error' && i.dimension === r.dimension))
          approved.push({ unit, dimension: r.dimension })
  }
  return {
    issues,
    errors: issues.filter(i => i.level === 'error').length,
    warnings: issues.filter(i => i.level === 'warning').length,
    approved,
    filesChecked,
    recordsChecked,
  }
}

export const formatIssue = (i: RecordIssue): string =>
  `${i.level === 'error' ? 'ERROR  ' : 'WARNING'} unit ${i.unit} · ${i.dimension} · ${i.field}: ${i.message}`
