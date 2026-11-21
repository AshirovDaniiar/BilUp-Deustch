import type { ContentSource, LearningUnit } from '../../types'

/**
 * Provenance of the Unit 28 material: ORIGINAL material written for BilUp Til (no external text was copied or adapted), drafted with AI
 * assistance (Claude) and therefore NOT reviewed by any person. No CEFR, Russian or Kyrgyz reviewer has signed anything off; the Kyrgyz in
 * particular is an AI-assisted first draft for native review. This is not an official CEFR approval. All schools, courses, universities, people,
 * dates and sums are FICTIONAL; no text describes the real rules of a real education system or institution.
 */
export const UNIT_28_SOURCE: ContentSource = {
  kind: 'authored',
  author: 'BilUp Til B1 authoring: original text drafted with AI assistance (Claude); pending independent CEFR, Russian and Kyrgyz review',
}

/** Unit 28 identity: equals its entry in the approved plan (`B1_UNIT_PLAN`), permanent. */
export const UNIT_28: LearningUnit = {
  id: 28,
  key: 'b1-bildung-zukunft',
  level: 'B1',
  title: 'Bildung, Lernen und Zukunftspläne',
  subtitle: {
    ru: 'Говорить об учёбе и планах, высказывать предположения и условия, общаться со школой и садом, пересказывать письма',
    ky: 'Окуу жана пландар жөнүндө сүйлөшүү, божомолдорду жана шарттарды билдирүү, мектеп жана бала бакча менен байланышуу, каттарды айтып берүү',
    de: 'Über Ausbildung, Studium und Pläne sprechen, Vermutungen und Bedingungen ausdrücken, mit Schule und Kita kommunizieren',
  },
  icon: '🎓',
  grammarIds: ['b1-futur1-vermutungen', 'b1-falls-sobald-solange', 'b1-verben-praepositionen'],
}

export const UNIT_28_SPEAKING_ID = 'b1-sp-28-01'
