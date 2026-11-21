import type { ContentSource, LearningUnit } from '../../types'

/**
 * Provenance of the Unit 22 material: ORIGINAL material written for BilUp Til (no external text was copied or adapted), drafted with AI
 * assistance (Claude) and therefore NOT reviewed by any person. No CEFR, Russian or Kyrgyz reviewer has signed anything off; the Kyrgyz in
 * particular is an AI-assisted first draft for native review. This is not an official CEFR approval.
 */
export const UNIT_22_SOURCE: ContentSource = {
  kind: 'authored',
  author: 'BilUp Til B1 authoring: original text drafted with AI assistance (Claude); pending independent CEFR, Russian and Kyrgyz review',
}

/** Unit 22 identity: equals its entry in the approved plan (`B1_UNIT_PLAN`), permanent. */
export const UNIT_22: LearningUnit = {
  id: 22,
  key: 'b1-meinungen-diskussion',
  level: 'B1',
  title: 'Meinungen äußern und diskutieren',
  subtitle: {
    ru: 'Высказать мнение, привести причины, согласиться или возразить и поучаствовать в простом обсуждении',
    ky: 'Пикир айтуу, себептерин келтирүү, макул болуу же каршы чыгуу жана жөнөкөй талкууга катышуу',
    de: 'Meinungen äußern, begründen, zustimmen und widersprechen: an einer einfachen Diskussion teilnehmen',
  },
  icon: '💬',
  grammarIds: ['b1-konzessive-saetze', 'b1-doppelkonnektoren', 'b1-adjektive-dativ-genitiv'],
}

export const UNIT_22_SPEAKING_ID = 'b1-sp-22-01'
