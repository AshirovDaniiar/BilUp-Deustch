// Run: npm run content:validate   (executed with vite-node; exits 1 on errors)
import { currentBundle } from './bundle'
import { validateContent } from './validate'

const issues = validateContent(currentBundle())
const errors = issues.filter(i => i.severity === 'error')
console.log(`[content-validate] skeleton · ${errors.length} error(s)`)
for (const i of issues) console.log(`  ${i.severity.toUpperCase()} ${i.rule} ${i.where}: ${i.message}`)
if (errors.length) process.exit(1)
