import { describe, expect, it } from 'vitest'
import { join } from 'node:path'
import { analyze, ALLOW_UP, RANK } from '../scripts/check-boundaries.mjs'

const fx = (name: string) => join(__dirname, 'fixtures/boundaries', name, 'src')

describe('boundary checker (report-only tool): rule engine', () => {
  it('accepts a clean downward-only layout', () => {
    const r = analyze(fx('clean'))
    expect(r.files).toBe(3)
    expect(r.violations).toEqual([])
    expect(r.cycles).toEqual([])
  })

  it('flags lower layers importing higher ones, and a file-level cycle', () => {
    const r = analyze(fx('violating'))
    const found = r.violations.map(v => `${v.from} -> ${v.to}`.replaceAll('\\', '/')).sort()
    expect(found).toEqual(['data/a.ts -> screens/s.ts', 'features/x.ts -> screens/s.ts'])
    expect(r.cycles.length).toBeGreaterThanOrEqual(1)
    expect(r.cycles[0].map(p => p.replaceAll('\\', '/'))).toEqual(expect.arrayContaining(['utils/f.ts', 'utils/g.ts']))
  })

  it('the rank table puts data lowest and the app shell highest', () => {
    expect(RANK.data).toBeLessThan(RANK.utils)
    expect(RANK.services).toBeLessThan(RANK.features)
    expect(RANK.features).toBeLessThan(RANK.screens)
    expect(RANK.screens).toBeLessThan(RANK.app)
    expect(ALLOW_UP.has('features>app')).toBe(true)
  })
})

describe('boundary report on the real source tree (report-only)', () => {
  const real = analyze(join(__dirname, '../src'))

  it('analyses the whole src tree', () => {
    expect(real.files).toBeGreaterThan(50)
    expect(real.edges).toBeGreaterThan(200)
  })

  it('records NO import cycles today (ratchet: must stay 0)', () => {
    expect(real.cycles).toEqual([])
  })

  it('KNOWN violations are pinned so new ones cannot appear silently (ratchet: may only shrink)', () => {
    const known = [
      'features/listening/ListeningLab.tsx -> screens/NotFound.tsx',
      'features/reading/ReadingLab.tsx -> screens/NotFound.tsx',
      'features/reallife/RealLife.tsx -> screens/NotFound.tsx',
      'features/speaking/SpeakingLab.tsx -> screens/NotFound.tsx',
      'features/writing/WritingLab.tsx -> screens/NotFound.tsx',
    ]
    const now = real.violations.map(v => `${v.from} -> ${v.to}`.replaceAll('\\', '/'))
    const unexpected = now.filter(v => !known.includes(v))
    expect(unexpected, 'new boundary violations introduced').toEqual([])
  })
})
