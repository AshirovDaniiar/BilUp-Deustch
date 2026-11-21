import type { ContentSource, LearningUnit } from '../../types'

/**
 * Provenance of the Unit 31 material: ORIGINAL material written for BilUp Til (no external text was copied or adapted), drafted with AI
 * assistance (Claude) and therefore NOT reviewed by any person. No CEFR, Russian or Kyrgyz reviewer has signed anything off; the Kyrgyz in
 * particular is an AI-assisted first draft for native review. This is not an official CEFR approval. ALL offices, providers, police stations, documents, file numbers,
 * deadlines, fees and contract terms are FICTIONAL and belong to the fictional document or scenario in which they appear; they are NOT German law, NOT the rules of
 * a real authority or company, and NOT legal advice. The unit teaches language only.
 */
export const UNIT_31_SOURCE: ContentSource = {
  kind: 'authored',
  author: 'BilUp Til B1 authoring: original text drafted with AI assistance (Claude); pending independent CEFR, Russian and Kyrgyz review',
}

/** Unit 31 identity: equals its entry in the approved plan (`B1_UNIT_PLAN`), permanent. */
export const UNIT_31: LearningUnit = {
  id: 31,
  key: 'b1-behoerden-recht',
  level: 'B1',
  title: 'Behörden, Verträge und Alltagsprobleme',
  subtitle: {
    ru: 'Формально и вежливо писать и говорить, понимать письма учреждений и условия договоров, использовать Passiv и состояние результата, спокойно объяснять проблему',
    ky: 'Расмий жана сылык жазуу жана сүйлөө, мекемелердин каттарын жана келишим шарттарын түшүнүү, Passiv жана жыйынтык абалын колдонуу, көйгөйдү сабырдуу түшүндүрүү',
    de: 'Formell und höflich schreiben und sprechen, Behördenbriefe und Vertragsbedingungen verstehen, Passiv und Zustandspassiv benutzen, ein Problem sachlich klären',
  },
  icon: '📄',
  grammarIds: ['b1-formelle-sprache', 'b1-aktiv-passiv-zustandspassiv'],
}

export const UNIT_31_SPEAKING_ID = 'b1-sp-31-01'
