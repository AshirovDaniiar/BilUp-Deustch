// Validation context: level resolution, severity policy and the issue collector shared by all rules.
import type { LanguageLevel } from '../../src/data/types'
import type { ContentBundle, Issue, Mode, Severity } from './types'

/** Levels that predate the validation policy. Their content is measured and reported, never failed by the strict rules. */
const LEGACY_LEVELS: readonly LanguageLevel[] = ['A1']

export interface Ctx {
  bundle: ContentBundle
  mode: Mode
  issues: Issue[]
  add: (severity: Severity, rule: string, where: string, message: string) => void
  err: (rule: string, where: string, message: string) => void
  levelOfUnit: (unit: number | undefined) => LanguageLevel | undefined
  levelOfScenario: (id: string) => LanguageLevel | undefined
  /** strict = the level is subject to the full A2-style policy (every level except the legacy ones) */
  strict: (level: LanguageLevel | undefined) => boolean
  /** the level is being released (beta/released), or the run is a release run */
  releasing: (level: LanguageLevel) => boolean
  /** planned (hidden) / beta (visible, human reviews and level test pending — reported, not blocking) / released (everything blocks). Release mode = released. */
  phase: (level: LanguageLevel) => 'planned' | 'beta' | 'released'
  /** human-review and assessment requirements: error when released, otherwise the given (non-blocking) severity */
  gateReview: (level: LanguageLevel, soft: Severity) => Severity
  /** error when the level is releasing, otherwise the given softer severity */
  gate: (level: LanguageLevel, soft: Severity) => Severity
  statusOf: (level: LanguageLevel) => 'planned' | 'beta' | 'released' | undefined
  /** the first strict level of the course (the level that owns level-wide items such as placement items and shared templates) */
  firstStrictLevel: () => LanguageLevel | undefined
}

export function makeContext(bundle: ContentBundle, mode: Mode): Ctx {
  const issues: Issue[] = []
  const add: Ctx['add'] = (severity, rule, where, message) => issues.push({ severity, rule, where, message })
  const levelOfUnit: Ctx['levelOfUnit'] = unit => {
    if (unit === undefined || !Number.isInteger(unit) || !bundle.course) return undefined
    return bundle.course.find(l => unit >= l.unitIdRange[0] && unit <= l.unitIdRange[1])?.id
  }
  const statusOf: Ctx['statusOf'] = level => bundle.course?.find(l => l.id === level)?.status
  const strict: Ctx['strict'] = level => level !== undefined && !LEGACY_LEVELS.includes(level)
  const releasing: Ctx['releasing'] = level => mode === 'release' || (statusOf(level) !== undefined && statusOf(level) !== 'planned')
  const phase: Ctx['phase'] = level =>
    mode === 'release' || statusOf(level) === 'released' ? 'released' : statusOf(level) === 'beta' ? 'beta' : 'planned'
  return {
    bundle,
    mode,
    issues,
    add,
    err: (rule, where, message) => add('error', rule, where, message),
    levelOfUnit,
    levelOfScenario: id => bundle.speakingLevels?.[id],
    strict,
    releasing,
    phase,
    gateReview: (level, soft) => (phase(level) === 'released' ? 'error' : soft),
    gate: (level, soft) => (releasing(level) ? 'error' : soft),
    statusOf,
    firstStrictLevel: () => bundle.course?.find(l => strict(l.id))?.id,
  }
}
