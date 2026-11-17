// npm run review:validate — validates the 30 hand-edited A2 review records. Exit code 1 if any error. Never approves or rewrites a record.
import { formatIssue, validateAll } from './validate-records'

const r = validateAll()
for (const i of r.issues) console.log(formatIssue(i))
console.log(
  `[review:validate] ${r.filesChecked} files, ${r.recordsChecked} records · ${r.errors} error(s) · ${r.warnings} warning(s) · valid approvals: ${r.approved.length}${
    r.approved.length ? ' (' + r.approved.map(a => `${a.unit}/${a.dimension}`).join(', ') + ')' : ''
  }`,
)
console.log('[review:validate] informational only: not connected to A2_REVIEWS or release validation')
process.exit(r.errors > 0 ? 1 : 0)
