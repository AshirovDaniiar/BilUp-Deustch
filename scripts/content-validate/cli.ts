// Run: npm run content:validate              (executed with vite-node; exits 1 on errors)
//      npm run content:validate -- --release  validate as if every level were being released (gaps and missing sign-offs become errors)
import { fullBundle } from './bundle'
import { validateContent } from './validate'
import type { Severity } from './types'

const release = process.argv.includes('--release')
const issues = validateContent(fullBundle(), { mode: release ? 'release' : 'authoring' })
const count = (s: Severity) => issues.filter(i => i.severity === s).length
console.log(
  `[content-validate] ${release ? 'release' : 'authoring'} · ${count('error')} error(s) · ${count('warning')} warning(s) · ${count('review')} review flag(s)`,
)
const order: Severity[] = ['error', 'warning', 'review', 'info']
for (const sev of order)
  for (const i of issues.filter(x => x.severity === sev)) console.log(`  ${i.severity.toUpperCase()} ${i.rule} ${i.where}: ${i.message}`)
if (count('error')) process.exit(1)
