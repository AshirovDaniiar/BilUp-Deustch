// Production bundle size report (D-5 of the A2 plan). Run after `npm run build:ci`.
//   node scripts/regression/bundle-size.mjs                      → print the report
//   node scripts/regression/bundle-size.mjs --save <file.json>   → also save it (used once, for the A1 baseline)
//   node scripts/regression/bundle-size.mjs --compare <file.json> → print the difference against a saved report
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { join, relative, sep } from 'node:path'
import { brotliCompressSync, gzipSync } from 'node:zlib'

const OUT = '.tmp-build'
const args = process.argv.slice(2)
const flag = name => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined)

const walk = dir =>
  readdirSync(dir).flatMap(n => {
    const p = join(dir, n)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })

const size = buf => ({ raw: buf.length, gzip: gzipSync(buf).length, brotli: brotliCompressSync(buf).length })
const sum = list =>
  list.reduce((a, s) => ({ raw: a.raw + s.raw, gzip: a.gzip + s.gzip, brotli: a.brotli + s.brotli }), { raw: 0, gzip: 0, brotli: 0 })

const files = walk(OUT).map(p => ({ path: relative(OUT, p).split(sep).join('/'), ...size(readFileSync(p)) }))
// lazy level-content chunks (assets/a2-content-*.js) are reported separately: not part of the entry bundle or the precache
const LAZY = /^assets\/a\d-content-[^/]*\.js$/
const js = files.filter(f => /\.js$/.test(f.path) && f.path.startsWith('assets/') && !LAZY.test(f.path))
const lazy = files.filter(f => LAZY.test(f.path))
const css = files.filter(f => /\.css$/.test(f.path))
const precache = files.filter(f => !['sw.js', 'pwa-config.json', 'pwa-build.json'].includes(f.path) && !LAZY.test(f.path))
const dataFiles = readdirSync('src/data')
  .filter(f => f.endsWith('.ts'))
  .map(f => size(readFileSync(join('src/data', f))))

const report = {
  note: 'sizes in bytes; gzip/brotli are per-file compressed sizes',
  mainJs: sum(js),
  lazyJs: sum(lazy),
  lazyFiles: lazy.map(f => f.path),
  css: sum(css),
  jsFiles: js.map(f => f.path),
  precacheFiles: precache.length,
  precacheTotal: sum(precache),
  srcDataTs: { files: dataFiles.length, ...sum(dataFiles) },
}

const base = flag('--compare') ? JSON.parse(readFileSync(flag('--compare'), 'utf8')) : null
const kb = n => `${(n / 1024).toFixed(1)} kB`
const line = (label, cur, old) =>
  `${label.padEnd(22)} raw ${kb(cur.raw).padStart(9)}  gzip ${kb(cur.gzip).padStart(9)}  brotli ${kb(cur.brotli).padStart(9)}` +
  (old
    ? `   Δ raw ${((cur.raw - old.raw) / 1024).toFixed(1)} kB (${(((cur.raw - old.raw) / old.raw) * 100).toFixed(1)} %), gzip ${((cur.gzip - old.gzip) / 1024).toFixed(1)} kB`
    : '')
console.log(line('main JS', report.mainJs, base?.mainJs))
console.log(line('lazy chunks (A2)', report.lazyJs, undefined))
console.log(line('main + lazy (A2 on)', sum([report.mainJs, report.lazyJs]), base?.mainJs))
console.log(line('CSS', report.css, base?.css))
console.log(line('precache total', report.precacheTotal, base?.precacheTotal))
console.log(line('src/data/*.ts (source)', report.srcDataTs, base?.srcDataTs))
console.log(`precache files: ${report.precacheFiles}`)
if (flag('--save')) writeFileSync(flag('--save'), JSON.stringify(report, null, 2) + '\n')
