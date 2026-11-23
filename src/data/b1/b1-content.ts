import type { A2FinalTest } from '../a2/tests'
import type { A2PlacementItem, LearnerInstruction, TutorTemplate } from '../a2/types'
import type {
  Exercise,
  GrammarConcept,
  LearningUnit,
  ListeningExercise,
  ReadingText,
  SpeakingScenario,
  VocabularyItem,
  WhyNote,
  WritingTask,
} from '../types'
import { B1_LEGACY_UNITS, B1_VISIBLE_UNITS } from './curriculum'
import { B1_V2_EXERCISES, B1_V2_GRAMMAR } from './grammar-v2'
import type { B1TestDef } from './types'
import { UNIT_21_FINAL, UNIT_21_EXERCISES, UNIT_21_TEST } from './unit21/assessment'
import { UNIT_21_GRAMMAR, UNIT_21_WHY_NOTES } from './unit21/grammar'
import { UNIT_21_LISTENING, UNIT_21_READING, UNIT_21_SPEAKING, UNIT_21_WRITING } from './unit21/texts'
import { UNIT_21_SPEAKING_ID } from './unit21/unit'
import { UNIT_21_VOCABULARY } from './unit21/vocabulary'
import { UNIT_22_FINAL, UNIT_22_EXERCISES, UNIT_22_TEST } from './unit22/assessment'
import { UNIT_22_GRAMMAR, UNIT_22_WHY_NOTES } from './unit22/grammar'
import { UNIT_22_LISTENING, UNIT_22_READING, UNIT_22_SPEAKING, UNIT_22_WRITING } from './unit22/texts'
import { UNIT_22_SPEAKING_ID } from './unit22/unit'
import { UNIT_22_VOCABULARY } from './unit22/vocabulary'
import { UNIT_23_FINAL, UNIT_23_EXERCISES, UNIT_23_TEST } from './unit23/assessment'
import { UNIT_23_GRAMMAR, UNIT_23_WHY_NOTES } from './unit23/grammar'
import { UNIT_23_LISTENING, UNIT_23_READING, UNIT_23_SPEAKING, UNIT_23_WRITING } from './unit23/texts'
import { UNIT_23_SPEAKING_ID } from './unit23/unit'
import { UNIT_23_VOCABULARY } from './unit23/vocabulary'
import { UNIT_24_FINAL, UNIT_24_EXERCISES, UNIT_24_TEST } from './unit24/assessment'
import { UNIT_24_GRAMMAR, UNIT_24_WHY_NOTES } from './unit24/grammar'
import { UNIT_24_LISTENING, UNIT_24_READING, UNIT_24_SPEAKING, UNIT_24_WRITING } from './unit24/texts'
import { UNIT_24_SPEAKING_ID } from './unit24/unit'
import { UNIT_24_VOCABULARY } from './unit24/vocabulary'
import { UNIT_25_FINAL, UNIT_25_EXERCISES, UNIT_25_TEST } from './unit25/assessment'
import { UNIT_25_GRAMMAR, UNIT_25_WHY_NOTES } from './unit25/grammar'
import { UNIT_25_LISTENING, UNIT_25_READING, UNIT_25_SPEAKING, UNIT_25_WRITING } from './unit25/texts'
import { UNIT_25_SPEAKING_ID } from './unit25/unit'
import { UNIT_25_VOCABULARY } from './unit25/vocabulary'
import { UNIT_26_FINAL, UNIT_26_EXERCISES, UNIT_26_TEST } from './unit26/assessment'
import { UNIT_26_GRAMMAR, UNIT_26_WHY_NOTES } from './unit26/grammar'
import { UNIT_26_LISTENING, UNIT_26_READING, UNIT_26_SPEAKING, UNIT_26_WRITING } from './unit26/texts'
import { UNIT_26_SPEAKING_ID } from './unit26/unit'
import { UNIT_26_VOCABULARY } from './unit26/vocabulary'
import { UNIT_27_FINAL, UNIT_27_EXERCISES, UNIT_27_TEST } from './unit27/assessment'
import { UNIT_27_GRAMMAR, UNIT_27_WHY_NOTES } from './unit27/grammar'
import { UNIT_27_LISTENING, UNIT_27_READING, UNIT_27_SPEAKING, UNIT_27_WRITING } from './unit27/texts'
import { UNIT_27_SPEAKING_ID } from './unit27/unit'
import { UNIT_27_VOCABULARY } from './unit27/vocabulary'
import { UNIT_28_FINAL, UNIT_28_EXERCISES, UNIT_28_TEST } from './unit28/assessment'
import { UNIT_28_GRAMMAR, UNIT_28_WHY_NOTES } from './unit28/grammar'
import { UNIT_28_LISTENING, UNIT_28_READING, UNIT_28_SPEAKING, UNIT_28_WRITING } from './unit28/texts'
import { UNIT_28_SPEAKING_ID } from './unit28/unit'
import { UNIT_28_VOCABULARY } from './unit28/vocabulary'
import { UNIT_29_FINAL, UNIT_29_EXERCISES, UNIT_29_TEST } from './unit29/assessment'
import { UNIT_29_GRAMMAR, UNIT_29_WHY_NOTES } from './unit29/grammar'
import { UNIT_29_LISTENING, UNIT_29_READING, UNIT_29_SPEAKING, UNIT_29_WRITING } from './unit29/texts'
import { UNIT_29_SPEAKING_ID } from './unit29/unit'
import { UNIT_29_VOCABULARY } from './unit29/vocabulary'
import { UNIT_30_FINAL, UNIT_30_EXERCISES, UNIT_30_TEST } from './unit30/assessment'
import { UNIT_30_GRAMMAR, UNIT_30_WHY_NOTES } from './unit30/grammar'
import { UNIT_30_LISTENING, UNIT_30_READING, UNIT_30_SPEAKING, UNIT_30_WRITING } from './unit30/texts'
import { UNIT_30_SPEAKING_ID } from './unit30/unit'
import { UNIT_30_VOCABULARY } from './unit30/vocabulary'
import { UNIT_31_FINAL, UNIT_31_EXERCISES, UNIT_31_TEST } from './unit31/assessment'
import { UNIT_31_GRAMMAR, UNIT_31_WHY_NOTES } from './unit31/grammar'
import { UNIT_31_LISTENING, UNIT_31_READING, UNIT_31_SPEAKING, UNIT_31_WRITING } from './unit31/texts'
import { UNIT_31_SPEAKING_ID } from './unit31/unit'
import { UNIT_31_VOCABULARY } from './unit31/vocabulary'
import { UNIT_32_FINAL, UNIT_32_EXERCISES, UNIT_32_TEST } from './unit32/assessment'
import { UNIT_32_GRAMMAR, UNIT_32_WHY_NOTES } from './unit32/grammar'
import { UNIT_32_LISTENING, UNIT_32_READING, UNIT_32_SPEAKING, UNIT_32_WRITING } from './unit32/texts'
import { UNIT_32_SPEAKING_ID } from './unit32/unit'
import { UNIT_32_VOCABULARY } from './unit32/vocabulary'
import { LEVEL_B1_ASSESSMENT, LEVEL_B1_TEST } from './level-test'
import type { B1LevelAssessment } from './types'

/**
 * The LOADABLE B1 content: every B1 collection in one module, so the bundler puts all of it (and only it) into ONE separate chunk
 * (`assets/b1-content-*.js`), exactly like the A2 level module. Nothing but the catalog may import this module, and the catalog does so only
 * through a dynamic `import()` (see `LOADERS` in `catalog.ts`). B1 is `planned`: the chunk is never requested for a learner.
 *
 * Authored so far: Units 21–32 (all of B1). Collection types are reused from the strict-level (A2) schema as TYPE-ONLY imports: this module has no runtime
 * import from any other level.
 */
export interface B1Content {
  units: LearningUnit[]
  /** pre-v2 units kept hidden (not listed) but addressable by id */
  legacyUnits: LearningUnit[]
  vocabulary: VocabularyItem[]
  grammar: GrammarConcept[]
  whyNotes: WhyNote[]
  exercises: Exercise[]
  listening: ListeningExercise[]
  reading: ReadingText[]
  speaking: SpeakingScenario[]
  writing: WritingTask[]
  tests: B1TestDef[]
  unitSpeaking: string[]
  finalTests: A2FinalTest[]
  placement: A2PlacementItem[]
  tutorTemplates: TutorTemplate[]
  instructions: LearnerInstruction[]
  /** the authored indicative level assessment `level-b1` (40 items, parts A–E); see `level-test.ts` */
  levelTest: B1LevelAssessment
}

export const B1_CONTENT: B1Content = {
  units: B1_VISIBLE_UNITS,
  legacyUnits: B1_LEGACY_UNITS,
  vocabulary: [...UNIT_21_VOCABULARY, ...UNIT_22_VOCABULARY, ...UNIT_23_VOCABULARY, ...UNIT_24_VOCABULARY, ...UNIT_25_VOCABULARY, ...UNIT_26_VOCABULARY, ...UNIT_27_VOCABULARY, ...UNIT_28_VOCABULARY, ...UNIT_29_VOCABULARY, ...UNIT_30_VOCABULARY, ...UNIT_31_VOCABULARY, ...UNIT_32_VOCABULARY],
  grammar: [...UNIT_21_GRAMMAR, ...UNIT_22_GRAMMAR, ...UNIT_23_GRAMMAR, ...UNIT_24_GRAMMAR, ...UNIT_25_GRAMMAR, ...UNIT_26_GRAMMAR, ...UNIT_27_GRAMMAR, ...UNIT_28_GRAMMAR, ...UNIT_29_GRAMMAR, ...UNIT_30_GRAMMAR, ...UNIT_31_GRAMMAR, ...UNIT_32_GRAMMAR, ...B1_V2_GRAMMAR],
  whyNotes: [...UNIT_21_WHY_NOTES, ...UNIT_22_WHY_NOTES, ...UNIT_23_WHY_NOTES, ...UNIT_24_WHY_NOTES, ...UNIT_25_WHY_NOTES, ...UNIT_26_WHY_NOTES, ...UNIT_27_WHY_NOTES, ...UNIT_28_WHY_NOTES, ...UNIT_29_WHY_NOTES, ...UNIT_30_WHY_NOTES, ...UNIT_31_WHY_NOTES, ...UNIT_32_WHY_NOTES],
  exercises: [...UNIT_21_EXERCISES, ...UNIT_22_EXERCISES, ...UNIT_23_EXERCISES, ...UNIT_24_EXERCISES, ...UNIT_25_EXERCISES, ...UNIT_26_EXERCISES, ...UNIT_27_EXERCISES, ...UNIT_28_EXERCISES, ...UNIT_29_EXERCISES, ...UNIT_30_EXERCISES, ...UNIT_31_EXERCISES, ...UNIT_32_EXERCISES, ...B1_V2_EXERCISES],
  listening: [...UNIT_21_LISTENING, ...UNIT_22_LISTENING, ...UNIT_23_LISTENING, ...UNIT_24_LISTENING, ...UNIT_25_LISTENING, ...UNIT_26_LISTENING, ...UNIT_27_LISTENING, ...UNIT_28_LISTENING, ...UNIT_29_LISTENING, ...UNIT_30_LISTENING, ...UNIT_31_LISTENING, ...UNIT_32_LISTENING],
  reading: [...UNIT_21_READING, ...UNIT_22_READING, ...UNIT_23_READING, ...UNIT_24_READING, ...UNIT_25_READING, ...UNIT_26_READING, ...UNIT_27_READING, ...UNIT_28_READING, ...UNIT_29_READING, ...UNIT_30_READING, ...UNIT_31_READING, ...UNIT_32_READING],
  speaking: [...UNIT_21_SPEAKING, ...UNIT_22_SPEAKING, ...UNIT_23_SPEAKING, ...UNIT_24_SPEAKING, ...UNIT_25_SPEAKING, ...UNIT_26_SPEAKING, ...UNIT_27_SPEAKING, ...UNIT_28_SPEAKING, ...UNIT_29_SPEAKING, ...UNIT_30_SPEAKING, ...UNIT_31_SPEAKING, ...UNIT_32_SPEAKING],
  writing: [...UNIT_21_WRITING, ...UNIT_22_WRITING, ...UNIT_23_WRITING, ...UNIT_24_WRITING, ...UNIT_25_WRITING, ...UNIT_26_WRITING, ...UNIT_27_WRITING, ...UNIT_28_WRITING, ...UNIT_29_WRITING, ...UNIT_30_WRITING, ...UNIT_31_WRITING, ...UNIT_32_WRITING],
  tests: [UNIT_21_TEST, UNIT_22_TEST, UNIT_23_TEST, UNIT_24_TEST, UNIT_25_TEST, UNIT_26_TEST, UNIT_27_TEST, UNIT_28_TEST, UNIT_29_TEST, UNIT_30_TEST, UNIT_31_TEST, UNIT_32_TEST, LEVEL_B1_TEST],
  /** speaking scenario per B1 unit; index 0 = Unit 21, index 1 = Unit 22, index 2 = Unit 23, index 3 = Unit 24, index 4 = Unit 25, index 5 = Unit 26, index 6 = Unit 27, index 7 = Unit 28, index 8 = Unit 29, index 9 = Unit 30, index 10 = Unit 31, index 11 = Unit 32 */
  unitSpeaking: [UNIT_21_SPEAKING_ID, UNIT_22_SPEAKING_ID, UNIT_23_SPEAKING_ID, UNIT_24_SPEAKING_ID, UNIT_25_SPEAKING_ID, UNIT_26_SPEAKING_ID, UNIT_27_SPEAKING_ID, UNIT_28_SPEAKING_ID, UNIT_29_SPEAKING_ID, UNIT_30_SPEAKING_ID, UNIT_31_SPEAKING_ID, UNIT_32_SPEAKING_ID],
  finalTests: [
    { unit: 21, questions: UNIT_21_FINAL },
    { unit: 22, questions: UNIT_22_FINAL },
    { unit: 23, questions: UNIT_23_FINAL },
    { unit: 24, questions: UNIT_24_FINAL },
    { unit: 25, questions: UNIT_25_FINAL },
    { unit: 26, questions: UNIT_26_FINAL },
    { unit: 27, questions: UNIT_27_FINAL },
    { unit: 28, questions: UNIT_28_FINAL },
    { unit: 29, questions: UNIT_29_FINAL },
    { unit: 30, questions: UNIT_30_FINAL },
    { unit: 31, questions: UNIT_31_FINAL },
    { unit: 32, questions: UNIT_32_FINAL },
  ],
  placement: [],
  tutorTemplates: [],
  instructions: [],
  levelTest: LEVEL_B1_ASSESSMENT,
}
