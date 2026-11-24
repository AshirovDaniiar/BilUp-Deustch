import { describe, expect, it } from 'vitest'
import { A1_MERKSATZE } from '../src/data/a1-merksaetze'
import { A2_MERKSATZE } from '../src/data/a2/a2-merksaetze'
import { B1_MERKSATZE } from '../src/data/b1/b1-merksaetze'

describe('approved Merksätze integration', () => {
  it('has exactly 38, 43 and 36 level units', () => {
    expect(A1_MERKSATZE).toHaveLength(38)
    expect(A2_MERKSATZE).toHaveLength(43)
    expect(B1_MERKSATZE).toHaveLength(36)
  })

  it('has 737 approved sentence pairs across all units', () => {
    const counts = [A1_MERKSATZE, A2_MERKSATZE, B1_MERKSATZE].map(items =>
      items.reduce((sum, item) => sum + item.sentences.length, 0),
    )
    expect(counts).toEqual([191, 258, 288])
  })

  it('uses stable unit IDs and non-empty German/Russian pairs', () => {
    const all = [...A1_MERKSATZE, ...A2_MERKSATZE, ...B1_MERKSATZE]
    expect(new Set(all.map(item => item.unit)).size).toBe(117)
    for (const item of all) {
      expect(item.sentences.length).toBeGreaterThan(0)
      for (const sentence of item.sentences) {
        expect(sentence.de.trim()).not.toBe('')
        expect(sentence.ru.trim()).not.toBe('')
      }
    }
  })
})
