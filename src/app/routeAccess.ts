import { availableLevels, resolveActiveLevel } from '../data/course'
import {
  levelOfConceptId,
  levelOfListeningId,
  levelOfReadingId,
  levelOfScenarioId,
  levelOfUnit,
  isLevelContentLoaded,
  levelOfWritingId,
  testIndex,
} from '../data/catalog'
import type { Lang, LanguageLevel } from '../data/types'
import type { Route } from './router'

/**
 * Level that owns a TEST id without needing the level's content to be loaded: the topic tests `unit-N` belong to the level of unit N, and the
 * fixed A2 assessment ids belong to A2. (A2 tests are not in `testIndex` until the lazy chunk is loaded, so a direct link must be resolved
 * statically, or the chunk would never be requested.) Other ids are looked up in the catalog; unknown ids resolve to undefined.
 */
export function levelOfTestId(id: string): LanguageLevel | undefined {
  const m = /^unit-(\d+)$/.exec(id)
  if (m) return levelOfUnit(Number(m[1]))
  if (id === 'level-a2' || id === 'placement-a2') return 'A2'
  return testIndex.get(id)?.level
}

/**
 * Level that owns the content a route addresses, or undefined when the route addresses no leveled content (or content that does
 * not exist — the screen itself answers "not found" for that). Level = level of the parent unit (D-1).
 */
export function levelOfRoute(r: Route): LanguageLevel | undefined {
  const [a, b, c] = r.parts
  switch (a) {
    case 'learn':
      if (b === 'unit' && c) return levelOfUnit(Number(c))
      if (b === 'topic' && c) return levelOfConceptId(c)
      return undefined
    case 'grammar':
      return b ? levelOfConceptId(b) : undefined
    case 'practice':
      switch (b) {
        case 'listening':
          return c ? levelOfListeningId(c) : undefined
        case 'reading':
          return c ? levelOfReadingId(c) : undefined
        case 'writing':
          return c ? levelOfWritingId(c) : undefined
        case 'tests':
          return c ? levelOfTestId(c) : undefined
        case 'review': {
          const unit = r.query.get('unit')
          return unit ? levelOfUnit(Number(unit)) : undefined
        }
        default:
          return undefined
      }
    case 'speak':
      return b ? levelOfScenarioId(b) : undefined
    default:
      return undefined
  }
}

/**
 * Direct URLs are subject to the same visibility rule as navigation: content of a level that is planned, or not released for the
 * learner's language, is "not found" — no matter whether the catalog contains it.
 */
export const isRouteAccessible = (r: Route, lang: Lang): boolean => {
  const level = levelOfRoute(r)
  return level === undefined || availableLevels(lang).includes(level)
}

/**
 * Lazy levels whose content must be loaded before this route can be shown. EMPTY for every A1 route and for every level that is
 * planned (a planned level is not in `availableLevels`, so nothing is ever requested for it): the A1 path costs one cheap check and
 * no extra render. A level is requested only when it is visible for the learner's language AND not loaded yet AND the route concerns
 * it: the route's content belongs to it, it is the learner's active level, or the route names content that is not in any loaded
 * level (it may belong to the unloaded one).
 */
export function levelsToLoad(r: Route, lang: Lang, activeLevel: LanguageLevel): LanguageLevel[] {
  const unloaded = availableLevels(lang).filter(l => !isLevelContentLoaded(l))
  if (unloaded.length === 0) return []
  const owner = levelOfRoute(r)
  if (owner !== undefined && !unloaded.includes(owner)) return []
  const wanted = new Set<LanguageLevel>()
  if (owner !== undefined) wanted.add(owner)
  const active = resolveActiveLevel(activeLevel, lang)
  if (unloaded.includes(active)) wanted.add(active)
  if (owner === undefined && r.parts.length >= 2) for (const l of unloaded) wanted.add(l)
  return [...wanted]
}
