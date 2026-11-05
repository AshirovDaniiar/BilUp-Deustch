/**
 * Permanent, compact credit ledger (05 §4.3) — the record of "what XP was credited and why".
 *
 * Idempotency model (P1): every XP award is addressed by a stable CREDIT KEY (e.g. `topic:akkusativ`, `word:w12`, `daily:2025-03-01`).
 * `award(key, requested)` credits only the difference between `requested` and what that key already received, so
 *   - replaying the same activity (double-fired handler, reload, repeat) credits 0,
 *   - a later, larger award for the same key tops up the difference once (e.g. a word first heard wrongly: 1 XP, later correctly: 3 XP → +2),
 *   - total XP = Σ entry.xp and the per-key state can always be re-derived from the entries (see `deriveCredited`).
 * Entry ids are deterministic (`<key>@<creditedTo>`), so even a replay of persisted entries cannot create a second credit.
 * Bounded size: entries grow with distinct credit keys (content items + days), not with attempts.
 */
import { isPlainObject } from './validate'
import type { Issue } from './validate'

export const POLICY_VERSION = 'p1-1'
export const MAX_AWARD = 1000
export const MAX_KEY = 120

export type CreditKind = 'earn' | 'legacy-opening' | 'legacy-seed' | 'reconcile'

export interface CreditEntry {
  id: string
  kind: CreditKind
  /** credit key for 'earn'; a label for the other kinds */
  key: string
  /** XP added to the total by this entry (0 for seeds) */
  xp: number
  /** 'earn': cumulative XP credited to `key` after this entry */
  creditedTo?: number
  /** 'legacy-seed': keys already credited before migration, with the amount treated as credited */
  credits?: Record<string, number>
  policyVersion: string
  at: number
}

export interface CreditState {
  entries: CreditEntry[]
}

export const emptyCredit = (): CreditState => ({ entries: [] })

export const totalXp = (entries: readonly CreditEntry[]): number => entries.reduce((a, e) => a + e.xp, 0)

/** key → cumulative credited amount, derived from the entries (never trusted from a cache). */
export function deriveCredited(entries: readonly CreditEntry[]): Map<string, number> {
  const m = new Map<string, number>()
  const raise = (k: string, v: number) => {
    if (v > (m.get(k) ?? 0)) m.set(k, v)
  }
  for (const e of entries) {
    if (e.kind === 'earn') raise(e.key, e.creditedTo ?? e.xp)
    if (e.kind === 'legacy-seed' && e.credits) for (const [k, v] of Object.entries(e.credits)) raise(k, v)
  }
  return m
}

export const validKey = (k: unknown): k is string => typeof k === 'string' && k.length > 0 && k.length <= MAX_KEY && k.trim() === k

export interface AwardResult {
  state: CreditState
  awarded: number
}

/**
 * Pure. Returns the SAME state object (identity) when nothing is credited, so callers can skip persistence.
 * Invalid keys or amounts credit nothing.
 */
export function award(
  state: CreditState,
  key: string,
  requested: number,
  at: number,
  policyVersion: string = POLICY_VERSION,
  credited = deriveCredited(state.entries),
): AwardResult {
  if (!validKey(key) || !Number.isFinite(requested) || requested <= 0) return { state, awarded: 0 }
  const want = Math.min(MAX_AWARD, Math.floor(requested))
  const have = credited.get(key) ?? 0
  const delta = want - have
  if (delta <= 0) return { state, awarded: 0 }
  const entry: CreditEntry = { id: `${key}@${want}`, kind: 'earn', key, xp: delta, creditedTo: want, policyVersion, at }
  return { state: { entries: [...state.entries, entry] }, awarded: delta }
}

const KINDS: CreditKind[] = ['earn', 'legacy-opening', 'legacy-seed', 'reconcile']

/** Validates persisted entries; drops uninterpretable ones, collapses duplicate ids (a replayed entry never counts twice). */
export function sanitizeEntries(input: unknown): { entries: CreditEntry[]; issues: Issue[] } {
  const issues: Issue[] = []
  if (input === undefined) return { entries: [], issues }
  if (!Array.isArray(input)) return { entries: [], issues: [{ path: 'credit.entries', problem: 'expected array' }] }
  const seen = new Set<string>()
  const entries: CreditEntry[] = []
  let dropped = 0
  let dup = 0
  for (const e of input) {
    if (
      !isPlainObject(e) ||
      typeof e.id !== 'string' ||
      e.id === '' ||
      !(KINDS as unknown[]).includes(e.kind) ||
      typeof e.key !== 'string' ||
      !Number.isFinite(e.xp) ||
      (e.xp as number) < 0 ||
      !Number.isFinite(e.at)
    ) {
      dropped++
      continue
    }
    if (seen.has(e.id)) {
      dup++
      continue
    }
    seen.add(e.id)
    const entry: CreditEntry = {
      id: e.id,
      kind: e.kind as CreditKind,
      key: e.key,
      xp: Math.floor(e.xp as number),
      policyVersion: typeof e.policyVersion === 'string' ? e.policyVersion : 'unknown',
      at: e.at as number,
    }
    if (entry.kind === 'earn') {
      const ct = e.creditedTo
      entry.creditedTo = typeof ct === 'number' && Number.isFinite(ct) && ct >= entry.xp ? Math.floor(ct) : entry.xp
    }
    if (entry.kind === 'legacy-seed' && isPlainObject(e.credits)) {
      entry.credits = {}
      for (const [k, v] of Object.entries(e.credits))
        if (validKey(k) && typeof v === 'number' && Number.isFinite(v) && v > 0) entry.credits[k] = Math.floor(v)
    }
    entries.push(entry)
  }
  if (dropped) issues.push({ path: 'credit.entries', problem: `${dropped} invalid entr${dropped === 1 ? 'y' : 'ies'} dropped` })
  if (dup)
    issues.push({
      path: 'credit.entries',
      problem: `${dup} duplicate entr${dup === 1 ? 'y' : 'ies'} collapsed (a credit is never counted twice)`,
    })
  return { entries, issues }
}

/**
 * Makes `progress.xp` and the ledger agree WITHOUT ever lowering a learner's XP: if the ledger is short, an explicit 'reconcile'
 * entry is appended for the difference; if the ledger is larger, the ledger total is used (it is the permanent record).
 */
export function reconcileXp(
  entries: CreditEntry[],
  progressXp: number,
  at: number,
): { entries: CreditEntry[]; xp: number; reconciled: number } {
  const sum = totalXp(entries)
  if (progressXp > sum) {
    const diff = progressXp - sum
    return {
      entries: [
        ...entries,
        { id: `reconcile@${sum}->${progressXp}`, kind: 'reconcile', key: 'reconcile', xp: diff, policyVersion: POLICY_VERSION, at },
      ],
      xp: progressXp,
      reconciled: diff,
    }
  }
  return { entries, xp: sum, reconciled: 0 }
}
