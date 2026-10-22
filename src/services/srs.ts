import type { MasteryScore, MasteryStage } from '../data/types'

/** Leitner-style spaced repetition: box 0..5, interval grows with each correct answer. */
const DAY = 86_400_000
const INTERVALS_DAYS = [0, 1, 2, 4, 8, 16]
const MAX_BOX = INTERVALS_DAYS.length - 1

export const emptyMastery = (): MasteryScore => ({ box: 0, due: 0, seen: 0, wrong: 0 })

export function review(m: MasteryScore | undefined, correct: boolean, now = Date.now()): MasteryScore {
  const cur = m ?? emptyMastery()
  if (correct) {
    const box = Math.min(MAX_BOX, cur.box + 1)
    return { ...cur, box, seen: cur.seen + 1, due: now + INTERVALS_DAYS[box] * DAY }
  }
  const box = Math.max(1, cur.box - 2)
  return { ...cur, box, seen: cur.seen + 1, wrong: cur.wrong + 1, due: now + 10 * 60_000 }
}

export function stageOf(m?: MasteryScore): MasteryStage {
  if (!m || m.seen === 0) return 'new'
  if (m.box <= 1) return 'learning'
  if (m.box === 2) return 'familiar'
  if (m.box < MAX_BOX) return 'strong'
  return 'mastered'
}

export const isDue = (m: MasteryScore | undefined, now = Date.now()) => !!m && m.seen > 0 && m.due <= now

export const STAGES: MasteryStage[] = ['new', 'learning', 'familiar', 'strong', 'mastered']
