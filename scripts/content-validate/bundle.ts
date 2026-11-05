// The content currently shipped in src/data, as a validator input.
import { EXERCISES } from '../../src/data/exercises'
import { GRAMMAR } from '../../src/data/grammar'
import { LISTENING } from '../../src/data/listening'
import { READING } from '../../src/data/reading'
import { REAL_LIFE, TESTS } from '../../src/data/reallife'
import { SPEAKING } from '../../src/data/speaking'
import { UNITS } from '../../src/data/units'
import { VOCABULARY } from '../../src/data/vocabulary'
import { WRITING } from '../../src/data/writing'

export const currentBundle = () => ({
  units: UNITS,
  vocabulary: VOCABULARY,
  grammar: GRAMMAR,
  exercises: EXERCISES,
  listening: LISTENING,
  reading: READING,
  writing: WRITING,
  speaking: SPEAKING,
  realLife: REAL_LIFE,
  tests: TESTS,
})
