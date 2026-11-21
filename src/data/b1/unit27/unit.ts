import type { ContentSource, LearningUnit } from '../../types'

/**
 * Provenance of the Unit 27 material: ORIGINAL material written for BilUp Til (no external text was copied or adapted), drafted with AI
 * assistance (Claude) and therefore NOT reviewed by any person. No CEFR, Russian or Kyrgyz reviewer has signed anything off; the Kyrgyz in
 * particular is an AI-assisted first draft for native review. This is not an official CEFR approval. All shops, products, people, prices and
 * transactions are FICTIONAL. The unit is language learning: shop rules mentioned in the texts (e.g. "return within 14 days") belong to the
 * fictional shop and are NOT statements of consumer law; nothing in the unit is legal advice.
 */
export const UNIT_27_SOURCE: ContentSource = {
  kind: 'authored',
  author: 'BilUp Til B1 authoring: original text drafted with AI assistance (Claude); pending independent CEFR, Russian and Kyrgyz review',
}

/** Unit 27 identity: equals its entry in the approved plan (`B1_UNIT_PLAN`), permanent. */
export const UNIT_27: LearningUnit = {
  id: 27,
  key: 'b1-konsum-reklamation',
  level: 'B1',
  title: 'Konsum, Geld und Reklamation',
  subtitle: {
    ru: 'Выражать желания и вежливо просить, подать рекламацию и договориться о решении, объяснять причины с wegen, trotz, während, statt',
    ky: 'Каалоолорду билдирүү жана сылык суроо, даттануу берүү жана чечим боюнча макулдашуу, wegen, trotz, während, statt менен себептерди түшүндүрүү',
    de: 'Wünsche ausdrücken, höflich bitten, reklamieren, Lösungen aushandeln und Gründe mit wegen, trotz, während, statt nennen',
  },
  icon: '🛒',
  grammarIds: ['b1-konjunktiv2-wuensche-irreal', 'b1-genitiv-praepositionen'],
}

export const UNIT_27_SPEAKING_ID = 'b1-sp-27-01'
