import { useApp } from '../../app/store'
import { POLICIES } from '../../progress/policy'
import type { ActivityKind } from '../../progress/types'
import { pct } from '../../utils/text'
import { PASS_MESSAGES } from './pass-messages'
import type { QuizResult } from './QuizRunner'

/**
 * Result note for activities with a pass threshold. If the section was already completed earlier (including grandfathered legacy
 * completions) a failed repeat claims nothing.
 */
export function PassNote({
  result,
  kind,
  completionKey,
}: {
  result: QuizResult
  kind: Extract<ActivityKind, 'review' | 'assessment'>
  completionKey: string
}) {
  const { state, lang } = useApp()
  const threshold = POLICIES[kind].passThreshold
  if (threshold === null) return null
  const got = pct(result.correct, result.total)
  const passed = got >= threshold * 100
  if (!passed && state.completed.includes(completionKey)) return null
  const m = PASS_MESSAGES[lang]
  return (
    <p className="small" role="status" data-testid="pass-note" data-passed={passed}>
      {passed ? m.done : m.notYet.replace('{need}', String(Math.round(threshold * 100))).replace('{got}', String(got))}
    </p>
  )
}
