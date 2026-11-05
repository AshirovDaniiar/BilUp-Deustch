import { describe, expect, it } from 'vitest'
import { emptyMastery, isDue, review, stageOf, STAGES } from '../src/services/srs'

const NOW = 1_700_000_000_000
const DAY = 86_400_000

describe('srs.review (Leitner boxes 0..5)', () => {
  it('first correct answer: box 0 → 1, due in 1 day', () => {
    expect(review(undefined, true, NOW)).toEqual({ box: 1, seen: 1, wrong: 0, due: NOW + DAY })
  })

  it('intervals grow 1,2,4,8,16 days and cap at box 5', () => {
    let m = emptyMastery()
    const days: number[] = []
    for (let i = 0; i < 7; i++) {
      m = review(m, true, NOW)
      days.push((m.due - NOW) / DAY)
    }
    expect(days).toEqual([1, 2, 4, 8, 16, 16, 16])
    expect(m.box).toBe(5)
    expect(m.seen).toBe(7)
  })

  it('wrong answer drops two boxes (min box 1), counts the error and is due in 10 minutes', () => {
    const m = review({ box: 5, due: 0, seen: 9, wrong: 0 }, false, NOW)
    expect(m).toEqual({ box: 3, seen: 10, wrong: 1, due: NOW + 10 * 60_000 })
  })

  it('KNOWN-QUIRK (pinned, not endorsed): a wrong FIRST answer moves a new word to box 1, same as a correct one', () => {
    expect(review(undefined, false, NOW).box).toBe(1)
  })

  it('does not mutate its input', () => {
    const input = { box: 2, due: 5, seen: 2, wrong: 0 }
    review(input, true, NOW)
    expect(input).toEqual({ box: 2, due: 5, seen: 2, wrong: 0 })
  })
})

describe('srs.stageOf / isDue', () => {
  it.each([
    [undefined, 'new'],
    [{ box: 3, due: 0, seen: 0, wrong: 0 }, 'new'],
    [{ box: 1, due: 0, seen: 1, wrong: 0 }, 'learning'],
    [{ box: 2, due: 0, seen: 2, wrong: 0 }, 'familiar'],
    [{ box: 3, due: 0, seen: 3, wrong: 0 }, 'strong'],
    [{ box: 4, due: 0, seen: 4, wrong: 0 }, 'strong'],
    [{ box: 5, due: 0, seen: 5, wrong: 0 }, 'mastered'],
  ])('stageOf(%j) = %s', (m, stage) => {
    expect(stageOf(m)).toBe(stage)
  })

  it('exposes the five stages in learning order', () => {
    expect(STAGES).toEqual(['new', 'learning', 'familiar', 'strong', 'mastered'])
  })

  it('isDue: only seen words whose due time has passed', () => {
    expect(isDue(undefined, NOW)).toBe(false)
    expect(isDue({ box: 1, due: NOW - 1, seen: 0, wrong: 0 }, NOW)).toBe(false) // never seen
    expect(isDue({ box: 1, due: NOW - 1, seen: 1, wrong: 0 }, NOW)).toBe(true)
    expect(isDue({ box: 1, due: NOW, seen: 1, wrong: 0 }, NOW)).toBe(true)
    expect(isDue({ box: 1, due: NOW + 1, seen: 1, wrong: 0 }, NOW)).toBe(false)
  })
})
