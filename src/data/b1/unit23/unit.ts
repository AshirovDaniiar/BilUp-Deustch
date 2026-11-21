import type { ContentSource, LearningUnit } from '../../types'

/**
 * Provenance of the Unit 23 material: ORIGINAL material written for BilUp Til (no external text was copied or adapted), drafted with AI
 * assistance (Claude) and therefore NOT reviewed by any person. No CEFR, Russian or Kyrgyz reviewer has signed anything off; the Kyrgyz in
 * particular is an AI-assisted first draft for native review. This is not an official CEFR approval.
 */
export const UNIT_23_SOURCE: ContentSource = {
  kind: 'authored',
  author: 'BilUp Til B1 authoring: original text drafted with AI assistance (Claude); pending independent CEFR, Russian and Kyrgyz review',
}

/** Unit 23 identity: equals its entry in the approved plan (`B1_UNIT_PLAN`), permanent. */
export const UNIT_23: LearningUnit = {
  id: 23,
  key: 'b1-arbeit-bewerbung',
  level: 'B1',
  title: 'Arbeit, Bewerbung und Karriere',
  subtitle: {
    ru: 'Понять объявление о вакансии, написать заявку, рассказать об опыте и целях на собеседовании',
    ky: 'Бош орун жөнүндө жарыяны түшүнүү, өтүнүч жазуу, маекте тажрыйбаңыз жана максаттарыңыз жөнүндө айтуу',
    de: 'Stellenanzeigen verstehen, sich bewerben, im Gespräch über Erfahrungen und Ziele sprechen',
  },
  icon: '💼',
  grammarIds: ['b1-relativsaetze-nom-akk', 'b1-infinitiv-mit-zu'],
}

export const UNIT_23_SPEAKING_ID = 'b1-sp-23-01'
