import type { UserProgress } from '../data/types'
import { emptyActivity, type ActivityState } from './activity'
import { emptyCredit, type CreditState } from './credit'
import { defaultProgress } from './defaults'
import { emptyResultsMeta, type ResultsMeta } from './results'

export interface OriginInfo {
  from: 'legacy-v1'
  migratedAt: number
  /** the verified backup of the ORIGINAL legacy bytes; never rotated away */
  backupKey: string
  /** fingerprint of the legacy key as last seen (used to detect writes by a stale app version) */
  legacyFingerprint: string
  /** XP the legacy key held when last seen; later increases are merged as a delta */
  legacyXp?: number
}

/** The pinned exact-bytes copy taken before a development profile's monolith record was split (STO-05, S1 design U1). */
export interface UpgradeInfo {
  /** the NEWEST pinned exact-bytes backup (S2: the layout-1 course record before the results split; S1: the monolith before the split) */
  backupKey: string
  at: number
  /** older pinned backups that must also survive rotation (e.g. the S1 monolith backup once the S2 upgrade has happened) */
  earlier?: string[]
}

/** What the application holds in memory and persists (the `UserProgress` part keeps the exact pre-P1 shape). */
export interface Core {
  progress: UserProgress
  credit: CreditState
  activity: ActivityState
  extras: Record<string, unknown>
  origin: OriginInfo | null
  /** bumped by deliberate replacements (reset, restore, start fresh): other tabs ADOPT a higher epoch instead of merging into it */
  epoch: number
  /** time of the last change to the profile/settings group (last-writer-wins across tabs) */
  settingsAt: number
  /** time of the last change to the tutor transcript, and of the last "clear conversation" (S1 design §3.2); 0 when never */
  tutorAt: number
  tutorClearedAt: number
  /** set once a monolith record has been split; names the pinned backup of the original monolith bytes */
  upgrade: UpgradeInfo | null
  /** record-level data of the history record that is not entries: reserved `deletions` (inactive in S2) and unknown fields, preserved */
  resultsMeta: ResultsMeta
}

export const freshCore = (): Core => ({
  progress: defaultProgress(),
  credit: emptyCredit(),
  activity: emptyActivity(),
  extras: {},
  origin: null,
  epoch: 0,
  settingsAt: 0,
  tutorAt: 0,
  tutorClearedAt: 0,
  upgrade: null,
  resultsMeta: emptyResultsMeta(),
})

/** A replacement epoch that is larger than any previous one, even across tabs and restarts. */
export const nextEpoch = (previous: number, now: number): number => Math.max(previous + 1, Math.floor(now / 1000))
