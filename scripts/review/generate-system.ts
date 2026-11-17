// npm run review:system — writes the 30 review packages (units 11–20 × 3 dimensions) and, ONLY IF ABSENT, the 10 records files.
// Existing records are never overwritten: they hold human work (names, dates, findings, approvals).
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import {
  DIMENSIONS,
  PACKAGE_DIR,
  RECORD_DIR,
  REVIEW_UNITS,
  initialRecords,
  packageMarkdown,
  packagePath,
  recordPath,
  reviewModel,
} from './system'

mkdirSync(PACKAGE_DIR, { recursive: true })
mkdirSync(RECORD_DIR, { recursive: true })
let records = 0
for (const u of REVIEW_UNITS) {
  for (const d of DIMENSIONS) writeFileSync(packagePath(u, d), packageMarkdown(reviewModel(u, d)))
  if (!existsSync(recordPath(u))) {
    writeFileSync(recordPath(u), JSON.stringify(initialRecords(u), null, 2) + '\n')
    records++
  }
}
console.log(`[review] wrote ${REVIEW_UNITS.length * DIMENSIONS.length} packages, ${records} new records files`)
