// Report-only module-boundary check (P0, 08 P0 / 07 §6). Does NOT fail the build unless run with --strict.
// The rules below describe the CURRENT folder layout (src/<folder>), not the target L0–L5 modules of 07 §6.1;
// they are provisional and exist to record today's violations and stop new ones from appearing silently.
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/** Rank by "height": a folder may import folders of equal or lower rank only (except where listed in `allowUp`). */
export const RANK = {
  data: 0,
  utils: 1,
  i18n: 1,
  services: 2,
  storage: 2,
  progress: 3,
  components: 3,
  features: 4,
  pwa: 4,
  screens: 5,
  app: 6,
  main: 7,
}
/** Pairs (importer -> imported) known to go "up" in the current code base and tolerated for now. */
export const ALLOW_UP = new Set(['features>app', 'components>app', 'screens>app', 'pwa>app'])

const EXT = /\.(ts|tsx)$/
const IMPORT = /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|import\s*['"]([^'"]+)['"]/g

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (EXT.test(e.name) && !/\.test\.(ts|tsx)$/.test(e.name)) out.push(p)
  }
  return out
}

const topFolder = (srcRoot, file) => {
  const rel = path.relative(srcRoot, file).split(path.sep)
  return rel.length === 1 ? rel[0].replace(EXT, '') : rel[0]
}

function resolveImport(from, spec) {
  if (!spec.startsWith('.')) return null
  const base = path.resolve(path.dirname(from), spec)
  for (const c of [base, base + '.ts', base + '.tsx', path.join(base, 'index.ts'), path.join(base, 'index.tsx')]) {
    if (fs.existsSync(c) && fs.statSync(c).isFile()) return c
  }
  return null
}

/** Analyse a `src` directory. Returns { files, edges, violations, cycles }. */
export function analyze(srcRoot) {
  const files = walk(srcRoot)
  const edges = []
  for (const f of files) {
    const text = fs.readFileSync(f, 'utf8')
    for (const m of text.matchAll(IMPORT)) {
      const target = resolveImport(f, m[1] ?? m[2] ?? m[3])
      if (target) edges.push({ from: f, to: target })
    }
  }
  const violations = []
  for (const e of edges) {
    const a = topFolder(srcRoot, e.from)
    const b = topFolder(srcRoot, e.to)
    if (a === b || !(a in RANK) || !(b in RANK)) continue
    if (RANK[b] > RANK[a] && !ALLOW_UP.has(`${a}>${b}`)) {
      violations.push({
        rule: 'no-upward-import',
        from: path.relative(srcRoot, e.from),
        to: path.relative(srcRoot, e.to),
        detail: `${a} (rank ${RANK[a]}) imports ${b} (rank ${RANK[b]})`,
      })
    }
  }
  // file-level cycles (DFS, Tarjan-free: report each back-edge once)
  const adj = new Map()
  for (const e of edges) (adj.get(e.from) ?? adj.set(e.from, []).get(e.from)).push(e.to)
  const state = new Map()
  const stack = []
  const cycles = []
  const dfs = n => {
    state.set(n, 1)
    stack.push(n)
    for (const m of adj.get(n) ?? []) {
      if (state.get(m) === 1) cycles.push([...stack.slice(stack.indexOf(m)), m].map(x => path.relative(srcRoot, x)))
      else if (!state.has(m)) dfs(m)
    }
    stack.pop()
    state.set(n, 2)
  }
  for (const f of files) if (!state.has(f)) dfs(f)
  return { files: files.length, edges: edges.length, violations, cycles }
}

function main() {
  const args = process.argv.slice(2)
  const strict = args.includes('--strict')
  const root = path.resolve(args.find(a => !a.startsWith('--')) ?? 'src')
  const r = analyze(root)
  console.log(`[boundaries] report-only · ${r.files} files · ${r.edges} internal imports`)
  for (const v of r.violations) console.log(`  VIOLATION ${v.rule}: ${v.from} -> ${v.to}  (${v.detail})`)
  for (const c of r.cycles) console.log(`  CYCLE ${c.join(' -> ')}`)
  console.log(
    `[boundaries] ${r.violations.length} violation(s), ${r.cycles.length} cycle(s)${strict ? '' : ' (not enforced; use --strict)'}`,
  )
  if (strict && (r.violations.length || r.cycles.length)) process.exit(1)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
