// @vitest-environment node
/**
 * A1 regression guard (A2 plan, Stage 0). Fails if ANY A1 content or A1-visible behaviour changes.
 * If a failure is an intentional, approved change: re-capture with `npx vite-node scripts/regression/capture-a1.ts`
 * and record the reason in the commit and in docs/implementation/A2_STAGE0_BASELINE.md. Never "fix" it by loosening a check.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { computeBehaviour, computeContentHashes, computeSelectors } from './a1-snapshot'

const load = (name: string) => JSON.parse(readFileSync(join(__dirname, 'baselines', name), 'utf8')) as unknown

describe('A1 content is untouched', () => {
  const baseline = load('a1-content-hashes.json') as ReturnType<typeof computeContentHashes>
  const now = computeContentHashes()

  it('every A1 data collection is value-identical (count + SHA-256 of its JSON)', () => {
    expect(now.semantic).toEqual(baseline.semantic)
  })

  it('every A1 data source file is byte-identical (SHA-256, CRLF-normalised)', () => {
    expect(now.files).toEqual(baseline.files)
  })
})

describe('A1 selector baseline (the future level catalog must reproduce these exactly for A1)', () => {
  it('id lists, per-unit counts, test definitions and the lab lists by item level are unchanged', () => {
    expect(computeSelectors()).toEqual(load('a1-selectors.json'))
  })
})

describe('A1 behaviour baseline', () => {
  const baseline = load('a1-behaviour.json') as Awaited<ReturnType<typeof computeBehaviour>>
  let now: Awaited<ReturnType<typeof computeBehaviour>>
  it('computes', async () => {
    now = await computeBehaviour()
    expect(now).toBeTruthy()
  })

  it('progress maths: required sections, unit/level progress, current unit, badges, recommendations, word stages', () => {
    expect(now.progress).toEqual(baseline.progress)
  })

  it('seeded daily challenge, every A1 test definition, unit reviews, concept questions and article drills', () => {
    expect(now.questions).toEqual(baseline.questions)
  })

  it('AI tutor answers for ru/ky/de × A1/A2 (recorded as they are today)', () => {
    expect(now.tutor).toEqual(baseline.tutor)
  })
})
