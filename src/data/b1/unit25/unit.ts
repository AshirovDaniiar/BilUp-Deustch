import type { ContentSource, LearningUnit } from '../../types'

/**
 * Provenance of the Unit 25 material: ORIGINAL material written for BilUp Til (no external text was copied or adapted), drafted with AI
 * assistance (Claude) and therefore NOT reviewed by any person. No CEFR, Russian or Kyrgyz reviewer has signed anything off; the Kyrgyz in
 * particular is an AI-assisted first draft for native review. This is not an official CEFR approval. The material is for language learning:
 * it is not medical information, diagnosis or treatment advice.
 */
export const UNIT_25_SOURCE: ContentSource = {
  kind: 'authored',
  author: 'BilUp Til B1 authoring: original text drafted with AI assistance (Claude); pending independent CEFR, Russian and Kyrgyz review',
}

/** Unit 25 identity: equals its entry in the approved plan (`B1_UNIT_PLAN`), permanent. */
export const UNIT_25: LearningUnit = {
  id: 25,
  key: 'b1-gesundheit-lebensstil',
  level: 'B1',
  title: 'Gesundheit, Beziehungen und Lebensstil',
  subtitle: {
    ru: 'Давать советы и вежливо просить, говорить о самочувствии, чувствах и отношениях, прояснять ссору',
    ky: 'Кеңеш берүү жана сылык суроо, ден соолук, сезимдер жана мамилелер жөнүндө сүйлөшүү, чатакты тактоо',
    de: 'Ratschläge geben, über Beschwerden, Gefühle und Beziehungen sprechen, einen Streit klären',
  },
  icon: '🧘',
  grammarIds: ['b1-konjunktiv2-ratschlaege', 'b1-reflexive-dativ'],
}

export const UNIT_25_SPEAKING_ID = 'b1-sp-25-01'
