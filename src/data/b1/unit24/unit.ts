import type { ContentSource, LearningUnit } from '../../types'

/**
 * Provenance of the Unit 24 material: ORIGINAL material written for BilUp Til (no external text was copied or adapted), drafted with AI
 * assistance (Claude) and therefore NOT reviewed by any person. No CEFR, Russian or Kyrgyz reviewer has signed anything off; the Kyrgyz in
 * particular is an AI-assisted first draft for native review. This is not an official CEFR approval.
 */
export const UNIT_24_SOURCE: ContentSource = {
  kind: 'authored',
  author: 'BilUp Til B1 authoring: original text drafted with AI assistance (Claude); pending independent CEFR, Russian and Kyrgyz review',
}

/** Unit 24 identity: equals its entry in the approved plan (`B1_UNIT_PLAN`), permanent. */
export const UNIT_24: LearningUnit = {
  id: 24,
  key: 'b1-wohnen-umwelt',
  level: 'B1',
  title: 'Wohnen, Umzug und Umwelt',
  subtitle: {
    ru: 'Понять объявление о квартире и правила дома, сообщить о неисправности, обсудить переезд и защиту окружающей среды',
    ky: 'Батир жөнүндө жарыяны жана үй эрежелерин түшүнүү, бузулууну билдирүү, көчүү жана айлана-чөйрөнү коргоо жөнүндө сүйлөшүү',
    de: 'Wohnungsanzeigen und Hausordnung verstehen, Mängel melden, über Umzug und Umwelt sprechen',
  },
  icon: '🏠',
  grammarIds: ['b1-passiv-praesens', 'b1-adjektive-ohne-artikel'],
}

export const UNIT_24_SPEAKING_ID = 'b1-sp-24-01'
