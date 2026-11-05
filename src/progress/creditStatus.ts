/**
 * How a history entry relates to the learner's CURRENT progress (S2, STO-99 / design §13.7).
 *
 * The stored `entry.xp` is informational ("XP computed at the time"): it never grants XP and is never summed. Rewards are governed
 * exclusively by the Core ledger and tombstones, so the status is derived from the Core only — no flag is stored on the entry.
 *
 *   credited      the Core holds a tombstone for the attempt
 *   not-credited  no tombstone AND the entry is younger than the tombstone retention window → its XP is not part of current progress
 *   unknown       older than the tombstone window: tombstones expire (RETENTION.tombstoneDays), so absence proves nothing — NO label
 */
import { RETENTION, type StoredResult } from '../storage/activity'
import type { Core } from '../storage/core'

export type CreditStatus = 'credited' | 'not-credited' | 'unknown'

const DAY_MS = 86_400_000

export function creditStatus(entry: Pick<StoredResult, 'resultId' | 'finishedAt'>, core: Pick<Core, 'activity'>, now: number): CreditStatus {
  if (core.activity.tombstones.some(t => t.resultId === entry.resultId)) return 'credited'
  return entry.finishedAt >= now - RETENTION.tombstoneDays * DAY_MS ? 'not-credited' : 'unknown'
}
