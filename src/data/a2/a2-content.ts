import type { Exercise, GrammarConcept, LearningUnit, ListeningExercise, ReadingText, SpeakingScenario, VocabularyItem, WhyNote, WritingTask } from '../types'
import { A2_LEGACY_UNITS, A2_VISIBLE_UNITS } from './curriculum'
import { A2_EXERCISES } from './exercises'
import { A2_GRAMMAR, A2_WHY_NOTES } from './grammar'
import { A2_INSTRUCTIONS } from './instructions'
import { A2_LISTENING } from './listening'
import { A2_PLACEMENT_ITEMS } from './placement'
import { A2_READING } from './reading'
import { A2_SPEAKING } from './speaking'
import { A2_FINAL_TESTS, A2_TESTS, type A2FinalTest } from './tests'
import { A2_TUTOR_TEMPLATES } from './tutor'
import type { A2PlacementItem, A2TestDef, LearnerInstruction, TutorTemplate } from './types'
import { A2_UNIT_SPEAKING } from './units'
import { A2_VOCABULARY } from './vocabulary'
import { A2_WRITING } from './writing'

/**
 * The LOADABLE A2 content: every A2 collection in one module, so the bundler puts all of it (and only it) into ONE separate chunk
 * (`assets/a2-content-*.js`). Nothing but the catalog may import this module, and the catalog does so only through a dynamic
 * `import()` (see `loadLevelContent`), so the A1 entry bundle contains no A2 learning content.
 * The collections are the very same arrays the individual modules export (by reference).
 * The unit PLAN (`registry.ts`: identity only, no learning content) is small and stays in the entry bundle.
 */
export interface A2Content {
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
  tests: A2TestDef[]
  unitSpeaking: string[]
  finalTests: A2FinalTest[]
  placement: A2PlacementItem[]
  tutorTemplates: TutorTemplate[]
  instructions: LearnerInstruction[]
}

export const A2_CONTENT: A2Content = {
  units: A2_VISIBLE_UNITS,
  legacyUnits: A2_LEGACY_UNITS,
  vocabulary: A2_VOCABULARY,
  grammar: A2_GRAMMAR,
  whyNotes: A2_WHY_NOTES,
  exercises: A2_EXERCISES,
  listening: A2_LISTENING,
  reading: A2_READING,
  speaking: A2_SPEAKING,
  writing: A2_WRITING,
  tests: A2_TESTS,
  unitSpeaking: A2_UNIT_SPEAKING,
  finalTests: A2_FINAL_TESTS,
  placement: A2_PLACEMENT_ITEMS,
  tutorTemplates: A2_TUTOR_TEMPLATES,
  instructions: A2_INSTRUCTIONS,
}
