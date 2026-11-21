import type { ContentSource, LearningUnit } from '../../types'

/**
 * Provenance of the Unit 26 material: ORIGINAL material written for BilUp Til (no external text was copied or adapted), drafted with AI
 * assistance (Claude) and therefore NOT reviewed by any person. No CEFR, Russian or Kyrgyz reviewer has signed anything off; the Kyrgyz in
 * particular is an AI-assisted first draft for native review. This is not an official CEFR approval. All news items, places, films and people
 * in the unit are FICTIONAL and exist only to practise the language; none of them reports a real event or makes a claim about a real person.
 */
export const UNIT_26_SOURCE: ContentSource = {
  kind: 'authored',
  author: 'BilUp Til B1 authoring: original text drafted with AI assistance (Claude); pending independent CEFR, Russian and Kyrgyz review',
}

/** Unit 26 identity: equals its entry in the approved plan (`B1_UNIT_PLAN`), permanent. */
export const UNIT_26: LearningUnit = {
  id: 26,
  key: 'b1-medien-technik',
  level: 'B1',
  title: 'Medien, Technik und Nachrichten',
  subtitle: {
    ru: 'Оценивать новости и источники, пересказывать чужие слова, говорить о технике, фильмах и защите данных',
    ky: 'Жаңылыктарды жана булактарды баалоо, башкалардын сөзүн айтып берүү, техника, тасмалар жана маалыматты коргоо жөнүндө сүйлөшүү',
    de: 'Nachrichten und Quellen beurteilen, Gesagtes wiedergeben, über Technik, Filme und Datenschutz sprechen',
  },
  icon: '📰',
  grammarIds: ['b1-passiv-praeteritum-modal', 'b1-lassen', 'b1-wiedergeben-indikativ'],
}

export const UNIT_26_SPEAKING_ID = 'b1-sp-26-01'
