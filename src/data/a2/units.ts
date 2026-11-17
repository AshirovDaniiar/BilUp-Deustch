import type { LearningUnit } from '../types'
import { UNIT_12, UNIT_12_SPEAKING_ID } from './unit12/unit'
import { UNIT_13, UNIT_13_SPEAKING_ID } from './unit13/unit'
import { UNIT_14, UNIT_14_SPEAKING_ID } from './unit14/unit'
import { UNIT_15, UNIT_15_SPEAKING_ID } from './unit15/unit'
import { UNIT_16, UNIT_16_SPEAKING_ID } from './unit16/unit'
import { UNIT_17, UNIT_17_SPEAKING_ID } from './unit17/unit'
import { UNIT_18, UNIT_18_SPEAKING_ID } from './unit18/unit'
import { UNIT_19, UNIT_19_SPEAKING_ID } from './unit19/unit'
import { UNIT_20, UNIT_20_SPEAKING_ID } from './unit20/unit'

/** A2 units (ids 11–20, `level: 'A2'`). Only the pilot unit 11 is authored; units 12–20 are authored in later stages. */
const UNIT_11_A2_UNITS: LearningUnit[] = [
  {
    id: 11,
    key: 'a2-ueber-mich',
    level: 'A2',
    title: 'Über mich und meine Erfahrungen',
    subtitle: {
      ru: 'Рассказать о себе, своём пути и опыте',
      ky: 'Өзүңүз, жашоо жолуңуз жана тажрыйбаңыз жөнүндө айтып берүү',
      de: 'Von sich, dem eigenen Weg und Erfahrungen erzählen',
    },
    icon: '🧭',
    grammarIds: ['a2-perfekt-erfahrungen', 'a2-praeteritum-sein-haben-modal', 'a2-ereignisse-verbinden'],
  },
]

/** Speaking scenario per A2 unit; index 0 = unit 11. */
export const A2_UNIT_SPEAKING: string[] = ['a2-sp-11-01', UNIT_12_SPEAKING_ID, UNIT_13_SPEAKING_ID, UNIT_14_SPEAKING_ID, UNIT_15_SPEAKING_ID, UNIT_16_SPEAKING_ID, UNIT_17_SPEAKING_ID, UNIT_18_SPEAKING_ID, UNIT_19_SPEAKING_ID, UNIT_20_SPEAKING_ID]

/** Unit 11 (pilot, unchanged) followed by Unit 12 (Stage 7C). */
export const A2_UNITS: LearningUnit[] = [...UNIT_11_A2_UNITS, UNIT_12, UNIT_13, UNIT_14, UNIT_15, UNIT_16, UNIT_17, UNIT_18, UNIT_19, UNIT_20]
