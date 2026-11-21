/**
 * The learner's detailed attempt history as its OWN record (S2, STORAGE_S2_RESULTS_DESIGN.md §3.1, §11, §13).
 *
 *   key  bilup-deutsch:results:<course>     { record:"results", v:1, epoch, updatedAt, results:[…], deletions?, …unknown }
 *
 * Rules that this module (pure, no I/O) and its callers implement:
 *  - The record is INDEPENDENT of Core epochs: \`epoch\` is informational and never makes the record stale (STO-90).
 *  - Every write is read → UNION-merge → write; entries are never removed, folded or pruned (STO-71/87, owner decision C4).
 *  - Unknown optional fields of entries, items and of the record itself survive sanitisation and rewrites (STO-82).
 *  - \`deletions\` is RESERVED for the future history-deletion stage: validated, preserved, merged by max, never written with a value by
 *    S2 code and never used to drop an entry (STO-88).
 */
import { compareKeys, sanitizeResults, type OrderKey, type StoredResult } from './activity'
import { isPlainObject, type Issue } from './validate'

export const RESULTS_VERSION = 1

export type Deletions = Record<string, { throughKey: OrderKey; at: number }>
export interface ResultsMeta {
  /** reserved, inactive in S2 */
  deletions?: Deletions
  /** unknown record-level fields, preserved verbatim */
  ext: Record<string, unknown>
}
export const emptyResultsMeta = (): ResultsMeta => ({ ext: {} })

export type ResultsRead =
  | { state: 'absent' }
  | { state: 'ok'; results: StoredResult[]; meta: ResultsMeta; issues: Issue[] }
  /** not parseable / not a results record: the exact bytes must be quarantined before anything replaces them */
  | { state: 'damaged'; reason: string }
  /** written by a newer version: never rewritten; history-readonly for the session */
  | { state: 'future' }

const KNOWN = new Set(['record', 'v', 'epoch', 'updatedAt', 'results', 'deletions'])
const isNum = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v)

const j = (v: unknown): string =>
  JSON.stringify(v, (_k, val) =>
    val && typeof val === 'object' && !Array.isArray(val)
      ? Object.fromEntries(Object.entries(val as Record<string, unknown>).sort(([x], [y]) => (x < y ? -1 : x > y ? 1 : 0)))
      : val,
  )

function sanitizeDeletions(v: unknown): Deletions | undefined {
  if (!isPlainObject(v)) return undefined
  const out: Deletions = {}
  for (const [scope, d] of Object.entries(v)) {
    if (
      !isPlainObject(d) ||
      !isPlainObject(d.throughKey) ||
      !isNum(d.throughKey.finishedAt) ||
      typeof d.throughKey.resultId !== 'string' ||
      !isNum(d.at)
    )
      continue
    out[scope] = { throughKey: { finishedAt: d.throughKey.finishedAt, resultId: d.throughKey.resultId }, at: d.at }
  }
  return Object.keys(out).length ? out : undefined
}

export function readResults(raw: string | null): ResultsRead {
  if (raw === null) return { state: 'absent' }
  let o: unknown
  try {
    o = JSON.parse(raw)
  } catch {
    return { state: 'damaged', reason: 'not valid JSON' }
  }
  if (!isPlainObject(o)) return { state: 'damaged', reason: 'not a JSON object' }
  if (o.record !== 'results') return { state: 'damaged', reason: 'not a results record' }
  if (typeof o.v !== 'number' || !Number.isInteger(o.v) || o.v < 1) return { state: 'damaged', reason: 'missing version' }
  if (o.v > RESULTS_VERSION) return { state: 'future' }
  if (!Array.isArray(o.results)) return { state: 'damaged', reason: 'results is not a list' }
  const issues: Issue[] = []
  const results = sanitizeResults(o.results, issues)
  const meta: ResultsMeta = { ext: Object.fromEntries(Object.entries(o).filter(([k]) => !KNOWN.has(k))) }
  const deletions = sanitizeDeletions(o.deletions)
  if (deletions) meta.deletions = deletions
  return { state: 'ok', results, meta, issues }
}

/** Deterministic: entries sorted by (finishedAt, resultId); unknown record-level fields first (they can never override a known one). */
export function serializeResults(results: readonly StoredResult[], meta: ResultsMeta, epoch: number, now: number): string {
  const sorted = [...results].sort((a, b) => compareKeys(a, b))
  return JSON.stringify({
    ...meta.ext,
    record: 'results',
    v: RESULTS_VERSION,
    epoch,
    updatedAt: now,
    results: sorted,
    ...(meta.deletions ? { deletions: meta.deletions } : {}),
  })
}

/** Union by resultId — history is append-only: nothing is ever dropped. If two copies differ, the canonically larger one wins (deterministic). */
export function mergeResultLists(a: readonly StoredResult[], b: readonly StoredResult[]): StoredResult[] {
  const byId = new Map<string, StoredResult>()
  for (const r of [...a, ...b]) {
    const have = byId.get(r.resultId)
    byId.set(r.resultId, have && j(have) >= j(r) ? have : r)
  }
  return [...byId.values()].sort((x, y) => compareKeys(x, y))
}

export function mergeResultsMeta(a: ResultsMeta, b: ResultsMeta): ResultsMeta {
  const ext: Record<string, unknown> = {}
  for (const k of [...new Set([...Object.keys(a.ext), ...Object.keys(b.ext)])].sort())
    ext[k] = k in a.ext && k in b.ext ? (j(a.ext[k]) >= j(b.ext[k]) ? a.ext[k] : b.ext[k]) : (a.ext[k] ?? b.ext[k])
  let deletions: Deletions | undefined
  if (a.deletions || b.deletions) {
    deletions = {}
    for (const scope of new Set([...Object.keys(a.deletions ?? {}), ...Object.keys(b.deletions ?? {})])) {
      const x = a.deletions?.[scope]
      const y = b.deletions?.[scope]
      deletions[scope] = !x ? y! : !y ? x : compareKeys(x.throughKey, y.throughKey) >= 0 ? x : y
    }
  }
  return deletions ? { ext, deletions } : { ext }
}

/** ids present in `memory` but not in `stored`: the entries that are NOT yet persisted (the pending history, design §13.4). */
export const pendingIds = (memory: readonly StoredResult[], stored: readonly StoredResult[]): string[] => {
  const have = new Set(stored.map(r => r.resultId))
  return memory.filter(r => !have.has(r.resultId)).map(r => r.resultId)
}

/** Equal ignoring the record's own write time, its informational epoch and the order of object keys (a re-read record must not be rewritten for ordering alone). */
export function sameResultsRecord(stored: string | null, next: string): boolean {
  if (stored === null) return false
  if (stored === next) return true
  try {
    const a = JSON.parse(stored)
    const b = JSON.parse(next)
    if (!isPlainObject(a) || !isPlainObject(b)) return false
    return j({ ...a, updatedAt: 0, epoch: 0 }) === j({ ...b, updatedAt: 0, epoch: 0 }) // `epoch` is informational: it alone never causes a write (STO-90)
  } catch {
    return false
  }
}
