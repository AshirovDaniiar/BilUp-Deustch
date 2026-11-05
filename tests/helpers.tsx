import { act, render } from '@testing-library/react'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { AppProvider, useApp } from '../src/app/store'
import type { KeyValueStore } from '../src/storage/kv'
import { KEYS } from '../src/storage/persistence'

/** The LEGACY key (pre-P1). P1 never writes it. */
export const KEY = KEYS.legacy
/** The current P1 record. */
export const CURRENT_KEY = KEYS.current

export const fixture = (name: string) => readFileSync(join(__dirname, 'fixtures', name), 'utf8')

type Ctx = ReturnType<typeof useApp>

/** Mounts the real AppProvider (production code) and exposes its live context. */
export function mountApp(kv?: KeyValueStore) {
  const ref: { current: Ctx | null } = { current: null }
  const Probe = () => {
    ref.current = useApp()
    return null
  }
  const view = render(
    <AppProvider kv={kv}>
      <Probe />
    </AppProvider>,
  )
  return {
    ...view,
    get ctx(): Ctx {
      if (!ref.current) throw new Error('not mounted')
      return ref.current
    },
    act: (fn: () => void) => act(fn),
  }
}

/** The persisted current record (full envelope), or null. */
export const storedRecord = () => {
  const raw = localStorage.getItem(CURRENT_KEY)
  if (raw === null) return null
  const core = JSON.parse(raw)
  // S1: preferences and tutor live in their own records. This view puts them back into the shape the tests were written for;
  // tests that care about the real layout read the three keys directly (see rawRecord).
  const prefs = localStorage.getItem('bilup-deutsch:prefs')
  const tutor = localStorage.getItem('bilup-deutsch:tutor:de-general')
  if (!(core.layout >= 1)) return core
  const p = prefs === null ? null : JSON.parse(prefs)
  const t = tutor === null ? null : JSON.parse(tutor)
  const resultsRaw = localStorage.getItem('bilup-deutsch:results:de-general')
  const results = resultsRaw === null ? null : JSON.parse(resultsRaw)
  const { record: _r, v: _v, epoch: _e, updatedAt: pAt, ...pf } = p ?? {}
  return {
    ...core,
    settingsAt: pAt ?? 0,
    tutorAt: t?.updatedAt ?? 0,
    tutorClearedAt: t?.clearedAt ?? 0,
    progress: { ...core.progress, ...pf, tutor: { messages: t?.messages ?? [] } },
    // S2: from layout 2 the detailed history is its own record
    activity: core.layout >= 2 ? { ...core.activity, results: results?.results ?? [] } : core.activity,
  }
}

/** One stored record exactly as written (parsed), or null. */
export const rawRecord = (key: string) => {
  const raw = localStorage.getItem(key)
  return raw === null ? null : JSON.parse(raw)
}

/** The persisted progress object (what used to live under the legacy key). */
export const stored = () => storedRecord()?.progress ?? null

// ---------------------------------------------------------------------------------------------------- ActivityResult builders
import type { ActivityResult } from '../src/progress/types'

let seq = 0
/** A complete, valid ActivityResult with a fresh resultId; override what the test cares about. */
export const mkResult = (over: Partial<ActivityResult> = {}): ActivityResult => ({
  resultId: `test-result-${++seq}`,
  courseId: 'de-general',
  activityId: 'topic:t',
  kind: 'lesson',
  levelId: 'A1',
  startedAt: Date.now() - 1000,
  finishedAt: Date.now(),
  activeMs: 500,
  assisted: false,
  items: [],
  score: null,
  evidence: 'measured',
  completes: [],
  ...over,
})

/** `n` correct quiz items named q:<prefix>1…n and a matching score. */
export const quizResult = (prefix: string, correct: number, total = correct, over: Partial<ActivityResult> = {}): ActivityResult =>
  mkResult({
    activityId: `quiz:${prefix}`,
    kind: 'quiz',
    items: Array.from({ length: total }, (_, i) => ({
      itemRef: `q:${prefix}${i + 1}`,
      outcome: i < correct ? ('correct' as const) : ('incorrect' as const),
    })),
    score: { earned: correct, possible: Math.max(1, total) },
    ...over,
  })

export function record(app: ReturnType<typeof mountApp>, result: ActivityResult) {
  let outcome!: ReturnType<ReturnType<typeof mountApp>['ctx']['actions']['record']>
  app.act(() => {
    outcome = app.ctx.actions.record(result)
  })
  return outcome
}
