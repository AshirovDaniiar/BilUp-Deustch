import type { Exercise, GrammarConcept } from '../../types'
import { enrich, lesson, type LessonSpec } from './builder'
import { DERIVED_01 } from './derived-01'
import { DERIVED_02 } from './derived-02'
import { DERIVED_03 } from './derived-03'
import { DERIVED_04 } from './derived-04'
import { legacyLesson } from './legacy'
import { LESSONS_01 } from './lessons-01'
import { LESSONS_02 } from './lessons-02'
import { LESSONS_03 } from './lessons-03'
import { LESSONS_04 } from './lessons-04'
import { LESSONS_05 } from './lessons-05'
import { LESSONS_06 } from './lessons-06'
import { LESSONS_07 } from './lessons-07'

/**
 * The 36 B1 curriculum-v2 grammar lessons, one per new unit (301–336), in unit order, with their exercises.
 * NEW lessons come from the hand-written specs; ENRICHED lessons (derived-NN.ts) are based on an existing legacy lesson that stays unchanged.
 */
const SPECS: LessonSpec[] = [...LESSONS_01, ...LESSONS_02, ...LESSONS_03, ...LESSONS_04, ...LESSONS_05, ...LESSONS_06, ...LESSONS_07]
const DERIVED = [...DERIVED_01, ...DERIVED_02, ...DERIVED_03, ...DERIVED_04]

const built = [
  ...SPECS.map(lesson).map(b => ({ ...b, n: b.concept.unit - 300 })),
  ...DERIVED.map(d => ({ ...enrich(legacyLesson(d.from), d.spec), n: d.spec.n })),
].sort((a, b) => a.n - b.n)

export const B1_V2_GRAMMAR: GrammarConcept[] = built.map(b => b.concept)
export const B1_V2_EXERCISES: Exercise[] = built.flatMap(b => b.exercises)
/** unit number (1–36) → id of its lesson */
export const B1_V2_LESSON_OF_UNIT: Readonly<Record<number, string>> = Object.fromEntries(B1_V2_GRAMMAR.map(g => [g.unit - 300, g.id]))
/** unit number → how its lesson was made: 'new' (written for the unit) or the id of the legacy lesson it is based on ('enriched') */
export const B1_V2_ORIGIN: Readonly<Record<number, string>> = Object.fromEntries([
  ...SPECS.map(s => [s.n, 'new'] as const),
  ...DERIVED.map(d => [d.spec.n, d.from] as const),
])
