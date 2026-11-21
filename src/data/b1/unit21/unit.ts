import type { ContentSource, LearningUnit } from '../../types'

/**
 * Provenance of the Unit 21 material: ORIGINAL material written for BilUp Til (no external text was copied or adapted), drafted with AI
 * assistance (Claude) and therefore NOT reviewed by any person. No CEFR, Russian or Kyrgyz reviewer has signed anything off; the Kyrgyz in
 * particular is an AI-assisted first draft for native review. This is not an official CEFR approval.
 */
export const UNIT_21_SOURCE: ContentSource = {
  kind: 'authored',
  author: 'BilUp Til B1 authoring: original text drafted with AI assistance (Claude); pending independent CEFR, Russian and Kyrgyz review',
}

/** Unit 21 identity: equals its entry in the approved plan (`B1_UNIT_PLAN`), permanent. */
export const UNIT_21: LearningUnit = {
  id: 21,
  key: 'b1-erlebnisse-erinnerungen',
  level: 'B1',
  title: 'Erlebnisse und Erinnerungen erzählen',
  subtitle: {
    ru: 'Рассказать о пережитом связно и по порядку: события, чувства, воспоминания',
    ky: 'Башыңыздан өткөн окуяларды ирети менен байланыштуу айтып берүү: окуялар, сезимдер, эскерүүлөр',
    de: 'Von Erlebnissen zusammenhängend erzählen: Ereignisse, Gefühle, Erinnerungen',
  },
  icon: '🧳',
  grammarIds: ['b1-praeteritum-erzaehlen', 'b1-temporale-konnektoren'],
}

export const UNIT_21_SPEAKING_ID = 'b1-sp-21-01'
