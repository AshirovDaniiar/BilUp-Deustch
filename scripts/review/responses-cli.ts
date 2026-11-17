// npm run review:responses — validates the author responses to reviewer findings (docs/review/a2/responses/). Exit 1 on any error. Read-only.
import { formatResponseIssue, validateAllResponses } from './responses'

const r = validateAllResponses()
for (const i of r.issues) console.log(formatResponseIssue(i))
console.log(
  `[review:responses] ${r.responses} response(s) · ${r.errors} error(s) · ${r.warnings} warning(s) · open findings without an author decision: ${r.undecided.length}`,
)
for (const u of r.undecided) console.log(`  undecided: unit ${u.unit} · ${u.dimension} · ${u.findingId} · findingDigest ${u.findingDigest}`)
console.log('[review:responses] informational only: not connected to A2_REVIEWS or release validation')
process.exit(r.errors > 0 ? 1 : 0)
