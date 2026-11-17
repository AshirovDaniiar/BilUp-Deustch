// @vitest-environment node
/**
 * Stage 7A.1 — the SHIPPED artifact: A2 learning content is in its own chunk, outside the entry bundle and outside the precache.
 * Builds the real application into a temporary directory (never dist/) and inspects the output.
 */
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { build } from 'vite'

const root = join(__dirname, '../..')
const out = mkdtempSync(join(tmpdir(), 'bilup-lazy-'))
const read = (f: string) => readFileSync(join(out, f), 'utf8')
let assets: string[] = []

beforeAll(async () => {
  await build({ root, configFile: join(root, 'vite.config.ts'), logLevel: 'silent', build: { outDir: out, emptyOutDir: true } })
  assets = readdirSync(join(out, 'assets'))
}, 120_000)
afterAll(() => rmSync(out, { recursive: true, force: true }))

const LEARNING_TEXT = [
  'Perfekt: что я пережил и сделал',
  'Mein Weg nach Deutschland',
  'Erfahrungen sammeln',
  'a2-ft-11-01',
  'тажрыйба топтоо',
]

describe('built output', () => {
  it('has one separate A2 content chunk next to the entry bundle', () => {
    expect(assets.filter(f => /^a2-content-.*\.js$/.test(f))).toHaveLength(1)
    expect(assets.filter(f => /^index-.*\.js$/.test(f))).toHaveLength(1)
  })
  it('the A2 learning content is in the chunk and NOT in the entry bundle', () => {
    const entry = read(`assets/${assets.find(f => /^index-/.test(f) && f.endsWith('.js'))}`)
    const chunk = read(`assets/${assets.find(f => /^a2-content-/.test(f))}`)
    for (const text of LEARNING_TEXT) {
      expect(chunk.includes(text), `chunk lacks "${text}"`).toBe(true)
      expect(entry.includes(text), `entry bundle contains "${text}"`).toBe(false)
    }
    expect(entry).toMatch(/a2-content-[\w-]+\.js/) // the dynamic import points at the chunk
  })
  it('index.html does not preload or reference the chunk', () => {
    expect(read('index.html')).not.toMatch(/a2-content/)
  })
  it('the service-worker precache does not contain the chunk (a learner who cannot see A2 never downloads it); it is listed as lazy', () => {
    const rec = JSON.parse(read('pwa-build.json'))
    expect(rec.precache.some((p: string) => /a2-content/.test(p))).toBe(false)
    expect(rec.precache.some((p: string) => /^assets\/index-.*\.js$/.test(p))).toBe(true)
    // …but the worker knows it as a LAZY file: cached only after its first successful use (see tests/pwa/lazy-cache.test.ts)
    expect(rec.lazy).toHaveLength(1)
    expect(rec.lazy[0].startsWith('assets/a2-content-')).toBe(true)
    expect(read('sw.js')).toContain(rec.lazy[0])
  })
})
