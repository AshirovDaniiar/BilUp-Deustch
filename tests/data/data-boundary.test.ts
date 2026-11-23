// @vitest-environment node
/**
 * Architectural boundary for content access (A2 plan, Stage 2). Replaces the Stage 1 "nobody imports the catalog" guard.
 *
 *   consumers (everything outside src/data)  → MAY use the catalog / course registry, MUST NOT import A2 data modules directly
 *   src/data/a2/*                            → import only data types and each other (never A1 content, never the catalog)
 *   A1 legacy modules                        → stay A1-only and pure: never import the catalog, the course registry or A2
 *   src/data/catalog.ts                      → the ONLY module that sees both A1 and A2
 *   whole-collection legacy imports in consumers are an explicit, shrinking allowlist (migrated in Stages 3 and 5)
 *
 * Together with tests/regression (value hashes of A1 data + behaviour baselines) and the "isolation" test in a1-isolation.test.ts,
 * this makes it structurally impossible for A2 content to reach an A1 consumer.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = join(__dirname, '../..')
const src = join(root, 'src')
const norm = (p: string) => p.split(sep).join('/')

const walk = (d: string): string[] => readdirSync(d).flatMap(n => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]))
const sources = walk(src).filter(f => /\.(ts|tsx)$/.test(f))

/** Resolved import targets of a file, relative to src/ and without extension; package imports are ignored. */
function importsOf(file: string): { spec: string; target: string; typeOnly: boolean }[] {
  const text = readFileSync(file, 'utf8')
  const out: { spec: string; target: string; typeOnly: boolean }[] = []
  for (const m of text.matchAll(/(import|export)(\s+type)?\s[^;]*?from\s+'(\.[^']*)'|import\s+'(\.[^']*)'/gs)) {
    const spec = m[3] ?? m[4]
    out.push({ spec, target: norm(relative(src, resolve(dirname(file), spec))).replace(/\.(ts|tsx)$/, ''), typeOnly: !!m[2] })
  }
  return out
}

const A1_LEGACY = [
  'units',
  'vocabulary',
  'grammar',
  'exercises',
  'listening',
  'reading',
  'speaking',
  'writing',
  'reallife',
  'cases',
  'visuals',
  'errorPatterns',
]
/** the collection modules (what the plan's level catalog replaces); cases/visuals/errorPatterns are grammar-lab helpers, not level content */
const A1_COLLECTIONS = ['units', 'vocabulary', 'grammar', 'exercises', 'listening', 'reading', 'speaking', 'writing', 'reallife']

const inData = (f: string) => norm(relative(src, f)).startsWith('data/')
const consumers = sources.filter(f => !inData(f))
const rel = (f: string) => norm(relative(src, f))

describe('consumers (outside src/data)', () => {
  it('never import an A2 data module directly — only the catalog selectors / course registry', () => {
    const offenders = consumers.flatMap(f =>
      importsOf(f)
        .filter(i => i.target.startsWith('data/a2/') || i.target === 'data/a2')
        .map(i => `${rel(f)} → ${i.spec}`),
    )
    expect(offenders).toEqual([])
  })

  it('may import the catalog and the course registry (and the migrated consumers do)', () => {
    const users = consumers.filter(f => importsOf(f).some(i => i.target === 'data/catalog' || i.target === 'data/course'))
    expect(users.length).toBeGreaterThan(10)
  })

  it('the remaining imports of whole A1 collections are exactly the recorded allowlist (shrink it when a consumer migrates; never grow it)', () => {
    // Tracked BY NAME: the collections themselves. Pure helpers (displayWord, caseForms) and constants (SECTIONS) are not collections.
    const COLLECTIONS = new Set([
      'UNITS',
      'UNIT_SPEAKING',
      'VOCABULARY',
      'GRAMMAR',
      'WHY_NOTES',
      'EXERCISES',
      'articleExercises',
      'LISTENING',
      'READING',
      'SPEAKING',
      'WRITING',
      'REAL_LIFE',
      'TESTS',
    ])
    const actual: Record<string, string[]> = {}
    for (const f of consumers) {
      const text = readFileSync(f, 'utf8')
      const names: string[] = []
      for (const m of text.matchAll(/import\s+\{([^}]*)\}\s+from\s+'(\.[^']*)'/gs)) {
        const target = norm(relative(src, resolve(dirname(f), m[2]))).replace(/\.(ts|tsx)$/, '')
        if (!target.startsWith('data/') || !A1_COLLECTIONS.includes(target.slice(5))) continue
        for (const part of m[1].split(',')) {
          const name = part.trim().replace(/\s+as\s+.*/, '')
          if (!name.startsWith('type ') && COLLECTIONS.has(name)) names.push(name)
        }
      }
      if (names.length) actual[rel(f)] = [...new Set(names)].sort()
    }
    // Why each remains:
    //  app/store.tsx               legacy-id migrator: maps OLD A1 completion keys only — A1-only by design (stays)
    //  features/reallife/RealLife  REAL_LIFE is shared by all levels (stays)
    //  features/tests/questions    REAL_LIFE (shared by all levels) for the daily phrase; every level pool is catalog-scoped
    //  services/tutor.ts           tutor knowledge — level-scoped and localised in the tutor stage
    // Since Stage 5 NO screen or lab reads a whole A1 collection: lists, labs and navigation are level-scoped through the catalog.
    expect(actual).toEqual({
      'app/store.tsx': ['LISTENING', 'READING', 'TESTS', 'WRITING'],
      'features/reallife/RealLife.tsx': ['REAL_LIFE'],
      'features/tests/questions.ts': ['REAL_LIFE'],
      'services/tutor.ts': ['EXERCISES', 'GRAMMAR', 'WHY_NOTES'],
    })
  })
})

describe('src/data layering', () => {
  const dataFile = (name: string) => join(src, 'data', name)

  it('A1 legacy modules stay A1-only and pure: they never import the catalog, the course registry or A2', () => {
    for (const m of A1_LEGACY) {
      const bad = importsOf(dataFile(`${m}.ts`)).filter(
        i => ['data/catalog', 'data/course'].includes(i.target) || i.target.startsWith('data/a2'),
      )
      expect(
        bad.map(b => b.spec),
        `data/${m}.ts`,
      ).toEqual([])
    }
    // and among themselves they only depend on types and other A1 legacy modules
    for (const m of A1_LEGACY) {
      for (const i of importsOf(dataFile(`${m}.ts`)))
        expect(['data/types', ...A1_LEGACY.map(x => `data/${x}`)], `data/${m}.ts imports ${i.spec}`).toContain(i.target)
    }
  })

  it('data/types.ts depends on nothing', () => {
    expect(importsOf(dataFile('types.ts'))).toEqual([])
  })

  it('A2 modules import only data types and sibling A2 modules — never A1 content, the catalog or the registry', () => {
    const dir = join(src, 'data/a2')
    for (const f of walk(dir).map(p => norm(relative(dir, p)))) {
      for (const i of importsOf(join(dir, f))) {
        // `data/curriculum` is the shared, content-free curriculum-v2 builder (the same one A1 uses)
        const ok = i.target === 'data/types' || i.target === 'data/curriculum' || (i.target.startsWith('data/a2/') && !i.target.includes('..'))
        expect(ok, `data/a2/${f} imports ${i.spec}`).toBe(true)
      }
    }
  })

  it('the catalog is the only module outside data/a2 and data/b1 that imports A2 modules (B1 may take TYPES from A2, never runtime code)', () => {
    const importers = sources
      .filter(f => !norm(relative(src, f)).startsWith('data/a2/') && !norm(relative(src, f)).startsWith('data/b1/'))
      .filter(f => importsOf(f).some(i => i.target.startsWith('data/a2/')))
    expect(importers.map(rel)).toEqual(['data/catalog.ts'])
  })

  it('B1 modules import only data types, sibling B1 modules and TYPE-ONLY A2 schema types — never A1 content, the catalog, the registry or A2 runtime code', () => {
    const dir = join(src, 'data/b1')
    for (const f of walk(dir).map(p => norm(relative(dir, p)))) {
      for (const i of importsOf(join(dir, f))) {
        // `data/curriculum` is the shared, content-free curriculum-v2 builder (the same one A1 and A2 use)
        const ok = i.target === 'data/types' || i.target === 'data/curriculum' || i.target.startsWith('data/b1/') || (i.target.startsWith('data/a2/') && i.typeOnly)
        expect(ok, `data/b1/${f} imports ${i.spec}`).toBe(true)
      }
    }
  })

  it('B1 content stays LAZY like A2: the catalog statically imports only the B1 plan, and loads the content by dynamic import; nobody else imports it', () => {
    const catalog = join(src, 'data/catalog.ts')
    for (const i of importsOf(catalog).filter(i => i.target.startsWith('data/b1/')))
      expect(i.typeOnly || i.target === 'data/b1/registry', `catalog statically imports ${i.spec}`).toBe(true)
    expect(readFileSync(catalog, 'utf8')).toContain("import('./b1/b1-content')")
    const offenders = sources
      .filter(f => !norm(relative(src, f)).startsWith('data/b1/') && rel(f) !== 'data/catalog.ts')
      .filter(f => readFileSync(f, 'utf8').includes('b1/b1-content'))
      .map(rel)
    expect(offenders).toEqual([])
  })

  it('A2 content stays LAZY: the catalog statically imports only the plan and types from A2, and loads the content by dynamic import', () => {
    const catalog = join(src, 'data/catalog.ts')
    const staticA2 = importsOf(catalog).filter(i => i.target.startsWith('data/a2/'))
    for (const i of staticA2) expect(i.typeOnly || i.target === 'data/a2/registry', `catalog statically imports ${i.spec}`).toBe(true)
    expect(readFileSync(catalog, 'utf8')).toContain("import('./a2/a2-content')")
  })

  it('nothing outside the catalog imports the A2 content module — not statically and not dynamically (build tooling and tests excepted)', () => {
    const offenders = sources
      .filter(f => !norm(relative(src, f)).startsWith('data/a2/') && rel(f) !== 'data/catalog.ts')
      .filter(f => readFileSync(f, 'utf8').includes('a2/a2-content'))
      .map(rel)
    expect(offenders).toEqual([])
  })

  it('the course registry depends only on data types', () => {
    expect(importsOf(dataFile('course.ts')).map(i => i.target)).toEqual(['data/types'])
  })
})
