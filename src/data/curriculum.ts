import type { LanguageLevel, LearningUnit } from './types'

/**
 * Shared builder of a level's CURRICULUM v2 unit list (A1: 38 units, A2: 43 units; same rules, one implementation).
 * A unit whose German title equals an existing (legacy) unit's title REUSES that unit (same id, content, progress keys); every other
 * title becomes an empty container with id `idBase + position` and its display `number`. Similar-but-different titles are never merged.
 * Legacy units that match no title are returned as `legacyUnits`: kept untouched and addressable by id, but not listed.
 */
export function buildCurriculum(
  level: LanguageLevel,
  titles: readonly string[],
  legacy: readonly LearningUnit[],
  idBase: number,
  /** existing grammar lessons (concept ids) to REFERENCE from a new unit, by unit title; never copies, never new content */
  grammarByTitle: Readonly<Record<string, readonly string[]>> = {},
  /** by unit title: concept id → what the (partially matching) lesson really covers */
  partialByTitle: Readonly<Record<string, Readonly<Record<string, string>>>> = {},
  /** by unit title: the approved grammar topic, stored on the unit as metadata (no lesson is created or attached) */
  topicByTitle: Readonly<Record<string, string>> = {},
): { units: LearningUnit[]; legacyUnits: LearningUnit[] } {
  const units = titles.map((title, i): LearningUnit => {
    const existing = legacy.find(u => u.title === title)
    if (existing) return existing
    const number = i + 1
    return { id: idBase + number, number, level, title, icon: '📘', subtitle: { ru: '', ky: '', de: '' }, grammarIds: [...(grammarByTitle[title] ?? [])],
      ...(partialByTitle[title] ? { grammarPartial: { ...partialByTitle[title] } } : {}),
      ...(topicByTitle[title] ? { grammarTopic: topicByTitle[title] } : {}),
    }
  })
  return { units, legacyUnits: legacy.filter(u => !units.includes(u)) }
}

/** Number shown to learners for a unit. */
export const unitNumber = (u: LearningUnit): number => u.number ?? u.id

/** True for an empty container created by `buildCurriculum` (only those carry a display `number`); never for authored/legacy units. */
export const isPlaceholderUnit = (u: LearningUnit): boolean => u.number !== undefined
