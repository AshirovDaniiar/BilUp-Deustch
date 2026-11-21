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
    const a2 = rec.lazy.filter((p: string) => p.startsWith('assets/a2-content-'))
    expect(a2).toHaveLength(1)
    expect(read('sw.js')).toContain(a2[0])
  })

  // B1 Stage 1: B1 has its own lazy chunk (empty today: no lesson exists). It must behave exactly like the A2 chunk — never precached, lazy-listed.
  // B1 Unit 21 (Stage 3A): the learning material is in the B1 chunk and NOWHERE ELSE — a learner who cannot see B1 never downloads it.
  it('the Unit 21 learning content is in the b1 chunk and NOT in the entry bundle or the A2 chunk', () => {
    const entry = read(`assets/${assets.find(f => /^index-/.test(f) && f.endsWith('.js'))}`)
    const b1 = read(`assets/${assets.find(f => /^b1-content-/.test(f))}`)
    const a2 = read(`assets/${assets.find(f => /^a2-content-/.test(f))}`)
    for (const text of [
      'Meine erste Nacht in Deutschland',
      'b1-ft-21-01',
      'Zufällig getroffen',
      'Ошол кечте биз көп күлдүк.',
      'Erlebnisse und Erinnerungen erzählen',
    ]) {
      expect(b1.includes(text), `b1 chunk lacks "${text}"`).toBe(true)
      expect(a2.includes(text), `a2 chunk contains "${text}"`).toBe(false)
    }
    // the unit TITLE is part of the plan and may live in the entry bundle; the lessons may not
    for (const text of [
      'Meine erste Nacht in Deutschland',
      'b1-ft-21-01',
      'Zufällig getroffen',
      'Ошол кечте биз көп күлдүк.',
      'Fixturewort',
      'b1-praeteritum-erzaehlen',
    ])
      expect(entry.includes(text), `entry bundle contains "${text}"`).toBe(false)
  })
  it('has one separate B1 content chunk, referenced only by the entry bundle dynamic import (not by index.html)', () => {
    expect(assets.filter(f => /^b1-content-.*\.js$/.test(f))).toHaveLength(1)
    const entry = read(`assets/${assets.find(f => /^index-/.test(f) && f.endsWith('.js'))}`)
    expect(entry).toMatch(/b1-content-[\w-]+\.js/)
    expect(read('index.html')).not.toMatch(/b1-content/)
  })
  it('the B1 chunk is NOT precached (nobody downloads it while B1 is planned) and is listed as lazy next to A2; both are known to the worker', () => {
    const rec = JSON.parse(read('pwa-build.json'))
    expect(rec.precache.some((p: string) => /b1-content/.test(p))).toBe(false)
    expect(rec.precache.some((p: string) => /a2-content/.test(p))).toBe(false)
    expect(rec.lazy.filter((p: string) => p.startsWith('assets/b1-content-'))).toHaveLength(1)
    expect(rec.lazy).toHaveLength(2)
    for (const f of rec.lazy) expect(read('sw.js')).toContain(f)
  })
})
