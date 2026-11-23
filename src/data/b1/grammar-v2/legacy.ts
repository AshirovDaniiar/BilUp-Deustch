import type { Exercise, GrammarConcept } from '../../types'
import { UNIT_22_EXERCISES } from '../unit22/assessment'
import { UNIT_22_GRAMMAR } from '../unit22/grammar'
import { UNIT_24_EXERCISES } from '../unit24/assessment'
import { UNIT_24_GRAMMAR } from '../unit24/grammar'
import { UNIT_26_EXERCISES } from '../unit26/assessment'
import { UNIT_26_GRAMMAR } from '../unit26/grammar'
import { UNIT_27_EXERCISES } from '../unit27/assessment'
import { UNIT_27_GRAMMAR } from '../unit27/grammar'
import { UNIT_30_EXERCISES } from '../unit30/assessment'
import { UNIT_30_GRAMMAR } from '../unit30/grammar'
import { UNIT_32_EXERCISES } from '../unit32/assessment'
import { UNIT_32_GRAMMAR } from '../unit32/grammar'

/** READ-ONLY access to the legacy B1 lessons (units 21–32) that the enriched lessons are based on. Nothing here is modified. */
const GRAMMAR: readonly GrammarConcept[] = [...UNIT_22_GRAMMAR, ...UNIT_24_GRAMMAR, ...UNIT_26_GRAMMAR, ...UNIT_27_GRAMMAR, ...UNIT_30_GRAMMAR, ...UNIT_32_GRAMMAR]
const EXERCISES: readonly Exercise[] = [...UNIT_22_EXERCISES, ...UNIT_24_EXERCISES, ...UNIT_26_EXERCISES, ...UNIT_27_EXERCISES, ...UNIT_30_EXERCISES, ...UNIT_32_EXERCISES]

export function legacyLesson(id: string): { concept: GrammarConcept; exercises: readonly Exercise[] } {
  const concept = GRAMMAR.find(g => g.id === id)
  if (!concept) throw new Error(`legacy B1 lesson "${id}" not found`)
  return { concept, exercises: EXERCISES.filter(e => e.concept === id) }
}
