import type { UserProgress } from '../data/types'

/** Single course until P2 introduces course packs; used in storage keys now so P2 needs no data migration (08 P1 item 8). */
export const COURSE_ID = 'de-general'

export const emptyScores = (): UserProgress['scores'] => ({
  vocabulary: [],
  grammar: [],
  listening: [],
  reading: [],
  writing: [],
  speaking: [],
})

/** Same shape as before P1. The hard-coded personal name is gone (V-15, 05 §10): an empty name is the neutral onboarding state. */
export const defaultProgress = (): UserProgress => ({
  name: '',
  lang: 'ru',
  theme: 'auto',
  level: 'A1',
  xp: 0,
  activeDates: [],
  studySeconds: 0,
  completed: [],
  mastery: {},
  saved: [],
  mistakes: [],
  scores: emptyScores(),
  daily: {},
  tests: [],
  weeklyGoal: 5,
  tutor: { messages: [] },
})

/** The placeholder the app used to ship with. Only recognised in order to clean up legacy records (05 §11). */
export const LEGACY_PLACEHOLDER_NAME = 'Daniiar'
