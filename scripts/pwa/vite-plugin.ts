// Build-time generator of the service worker (P0b). Runs only for `vite build`.
//   normal build            → dist/sw.js       = shell worker, with the precache list and a content-hash version injected
//   VITE_PWA_KILL=true      → dist/sw.js       = KILL-SWITCH worker (same URL, so existing installs pick it up), pwa-config.json = disabled
// Nothing is hashed or listed from outside the build output; sw.js and pwa-config.json are never part of the precache.
import { build } from 'esbuild'
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import type { Plugin } from 'vite'

const NOT_PRECACHED = new Set(['sw.js', 'pwa-config.json'])
const SKIP = /\.map$/i
/**
 * Lazy level-content chunks (`assets/a2-content-*.js`, see src/data/a2/a2-content.ts) are NOT part of the shell precache: a learner
 * who cannot see the level must never download it. When a level is released, its caching strategy is decided in that release.
 */
const LAZY_CONTENT = /^assets\/a\d-content-[^/]*\.js$/

function listFiles(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) listFiles(p, out)
    else out.push(p)
  }
  return out
}

export interface ShellManifest {
  version: string
  precache: string[]
  /** lazy content chunks: not precached, cached by the worker only after their first successful use */
  lazy: string[]
}

/** Pure: list + version for a set of [relativePath, content] entries. The version changes iff any shell file changes. */
export function buildShellManifest(files: { path: string; content: Uint8Array | string }[]): ShellManifest {
  const entries = files
    .filter(f => !NOT_PRECACHED.has(f.path) && !SKIP.test(f.path) && !LAZY_CONTENT.test(f.path))
    .map(f => ({ path: f.path, hash: createHash('sha256').update(f.content).digest('hex') }))
    .sort((a, b) => (a.path < b.path ? -1 : 1))
  const version = createHash('sha256')
    .update(entries.map(e => `${e.path}:${e.hash}`).join('\n'))
    .digest('hex')
    .slice(0, 12)
  const lazy = files
    .filter(f => LAZY_CONTENT.test(f.path))
    .map(f => f.path)
    .sort()
  return { version, precache: entries.map(e => e.path), lazy }
}

export function shellWorkerPlugin(opts: { kill?: boolean } = {}): Plugin {
  let outDir = 'dist'
  let root = process.cwd()
  const kill = opts.kill ?? process.env.VITE_PWA_KILL === 'true'
  return {
    name: 'bilup-shell-worker',
    apply: 'build',
    configResolved(cfg) {
      outDir = resolve(cfg.root, cfg.build.outDir)
      root = cfg.root
    },
    async closeBundle() {
      const entry = resolve(root, 'src/pwa', kill ? 'kill-sw.ts' : 'sw.ts')
      const files = listFiles(outDir).map(p => ({ path: relative(outDir, p).split(sep).join('/'), content: readFileSync(p) }))
      const manifest = buildShellManifest(files)
      const result = await build({
        entryPoints: [entry],
        bundle: true,
        write: false,
        format: 'iife',
        target: 'es2020',
        minify: true,
        define: {
          __SHELL_VERSION__: JSON.stringify(manifest.version),
          __PRECACHE__: JSON.stringify(manifest.precache),
          __LAZY__: JSON.stringify(manifest.lazy),
        },
        logLevel: 'silent',
      })
      mkdirSync(outDir, { recursive: true })
      writeFileSync(join(outDir, 'sw.js'), result.outputFiles[0].text)
      writeFileSync(join(outDir, 'pwa-config.json'), JSON.stringify({ enabled: !kill }) + '\n')
      writeFileSync(
        join(outDir, 'pwa-build.json'),
        JSON.stringify({ kill, version: manifest.version, precache: manifest.precache, lazy: manifest.lazy }, null, 2) + '\n',
      )
    },
  }
}
