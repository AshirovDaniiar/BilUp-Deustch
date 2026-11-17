// @vitest-environment node
/**
 * Stage 3 guard. The level-scoped functions default to A1 so that the pre-A2 call style and the 773 original tests keep their meaning,
 * but APPLICATION code must never rely on that default: a screen that forgot the level would silently show A1 in an A2 flow.
 * This test scans src/ and fails on any call that omits the level argument.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { describe, expect, it } from 'vitest'

const src = join(__dirname, '../../src')
const walk = (d: string): string[] => readdirSync(d).flatMap(n => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]))
const files = walk(src).filter(f => /\.(ts|tsx)$/.test(f))
const rel = (f: string) => relative(src, f).split(sep).join('/')

/** function → minimum number of arguments (the position of its `level` parameter). */
const REQUIRES_LEVEL: Record<string, number> = {
  stageCounts: 2,
  dueWordIds: 2,
  masteredCount: 2,
  levelProgress: 2,
  recommendations: 2,
  weakConcepts: 3,
  articleConfusion: 2,
  articleDrill: 3,
  buildLevelDaily: 2,
}

/** Top-level argument count of the call whose "(" is at `open`; null when it cannot be parsed. */
function argCount(text: string, open: number): number | null {
  let depth = 0
  let args = 0
  let sawToken = false
  let quote: string | null = null
  for (let i = open; i < text.length; i++) {
    const c = text[i]
    if (quote) {
      if (c === '\\') i++
      else if (c === quote) quote = null
      continue
    }
    if (c === "'" || c === '"' || c === '`') {
      quote = c
      sawToken = true
    } else if (c === '(' || c === '[' || c === '{') {
      depth++
      if (depth > 1) sawToken = true
    } else if (c === ')' || c === ']' || c === '}') {
      depth--
      if (depth === 0) return sawToken ? args + 1 : 0
    } else if (c === ',' && depth === 1) args++
    else if (depth >= 1 && !/\s/.test(c)) sawToken = true
  }
  return null
}

function calls(file: string) {
  const text = readFileSync(file, 'utf8')
  const out: { name: string; args: number; line: number }[] = []
  for (const name of Object.keys(REQUIRES_LEVEL)) {
    for (const m of text.matchAll(new RegExp(`(?<![.\\w])${name}\\(`, 'g'))) {
      const before = text.slice(Math.max(0, (m.index ?? 0) - 16), m.index)
      if (/(function|const|let)\s+$/.test(before)) continue // the definition itself
      const n = argCount(text, (m.index ?? 0) + name.length)
      out.push({ name, args: n ?? -1, line: text.slice(0, m.index).split('\n').length })
    }
  }
  return out
}

describe('level-scoped functions are never called without an explicit level in application code', () => {
  it('every call in src/ passes the level (the implicit A1 default is for legacy callers and tests only)', () => {
    const offenders = files.flatMap(f =>
      calls(f)
        .filter(c => c.args < REQUIRES_LEVEL[c.name])
        .map(c => `${rel(f)}:${c.line} ${c.name}(${c.args} args, needs ${REQUIRES_LEVEL[c.name]})`),
    )
    expect(offenders).toEqual([])
  })

  it('the scanner sees the real call sites (guards the guard)', () => {
    const all = files.flatMap(f => calls(f).map(c => `${rel(f)} ${c.name}`))
    for (const expected of [
      'screens/HomeScreen.tsx levelProgress',
      'screens/ProgressScreen.tsx stageCounts',
      'screens/PracticeScreens.tsx articleDrill',
      'screens/PracticeScreens.tsx buildLevelDaily',
      'features/progress/stats.ts weakConcepts',
    ])
      expect(all, expected).toContain(expected)
  })

  it('the legacy A1-only helpers are used only where recorded', () => {
    const legacyDaily = files
      .filter(f => rel(f) !== 'features/tests/questions.ts' && /\bbuildDaily\(/.test(readFileSync(f, 'utf8')))
      .map(rel)
    expect(legacyDaily).toEqual([]) // screens use buildLevelDaily(date, activeLevel)
    const oneArgCurrentUnit = files
      .filter(f => /\bcurrentUnit\(\w+\)/.test(readFileSync(f, 'utf8')) && rel(f) !== 'features/progress/stats.ts')
      .map(rel)
    expect(oneArgCurrentUnit).toEqual([]) // Home passes the active level since Stage 5; the 1-argument A1 form is for legacy callers and tests
  })

  it('argument counting handles nesting, strings and template literals', () => {
    const t = "f(a, g(b, c), 'x,y', `t,${1}`, [1, 2], {a: 1, b: 2}, d)"
    expect(argCount(t, 1)).toBe(7)
    expect(argCount('f()', 1)).toBe(0)
    expect(argCount('f(a)', 1)).toBe(1)
  })
})
