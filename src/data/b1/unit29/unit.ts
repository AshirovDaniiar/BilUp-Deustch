import type { ContentSource, LearningUnit } from '../../types'

/**
 * Provenance of the Unit 29 material: ORIGINAL material written for BilUp Til (no external text was copied or adapted), drafted with AI
 * assistance (Claude) and therefore NOT reviewed by any person. No CEFR, Russian or Kyrgyz reviewer has signed anything off; the Kyrgyz in
 * particular is an AI-assisted first draft for native review. This is not an official CEFR approval. All travellers, hotels, railway companies
 * and people are FICTIONAL; every statement about customs is a personal impression of a fictional person and never a claim about a whole
 * country or population.
 */
export const UNIT_29_SOURCE: ContentSource = {
  kind: 'authored',
  author: 'BilUp Til B1 authoring: original text drafted with AI assistance (Claude); pending independent CEFR, Russian and Kyrgyz review',
}

/** Unit 29 identity: equals its entry in the approved plan (`B1_UNIT_PLAN`), permanent. */
export const UNIT_29: LearningUnit = {
  id: 29,
  key: 'b1-reisen-kultur',
  level: 'B1',
  title: 'Reisen, Kultur und Alltag im Vergleich',
  subtitle: {
    ru: 'Рассказывать о поездках с предысторией, сравнивать обычаи и повседневность, точнее описывать людей и места, спокойно решать проблемы в пути',
    ky: 'Саякат жөнүндө алдыңкы окуялары менен айтуу, каада-салттарды жана күнүмдүк жашоону салыштыруу, адамдарды жана жерлерди тагыраак сүрөттөө, жолдогу көйгөйлөрдү сабырдуу чечүү',
    de: 'Von Reisen mit Hintergrund erzählen, Bräuche und Alltag vergleichen, Orte und Personen genauer beschreiben, Probleme unterwegs sachlich klären',
  },
  icon: '🧭',
  grammarIds: ['b1-relativsaetze-dativ-praeposition', 'b1-genitivattribute', 'b1-plusquamperfekt-nachdem'],
}

export const UNIT_29_SPEAKING_ID = 'b1-sp-29-01'
