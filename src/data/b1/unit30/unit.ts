import type { ContentSource, LearningUnit } from '../../types'

/**
 * Provenance of the Unit 30 material: ORIGINAL material written for BilUp Til (no external text was copied or adapted), drafted with AI
 * assistance (Claude) and therefore NOT reviewed by any person. No CEFR, Russian or Kyrgyz reviewer has signed anything off; the Kyrgyz in
 * particular is an AI-assisted first draft for native review. This is not an official CEFR approval. All associations, neighbourhoods, projects and people are
 * FICTIONAL; opinions on community matters are shown as the views of named fictional persons, with both sides presented fairly, and are never stated as facts
 * about a society, a generation or a social group.
 */
export const UNIT_30_SOURCE: ContentSource = {
  kind: 'authored',
  author: 'BilUp Til B1 authoring: original text drafted with AI assistance (Claude); pending independent CEFR, Russian and Kyrgyz review',
}

/** Unit 30 identity: equals its entry in the approved plan (`B1_UNIT_PLAN`), permanent. */
export const UNIT_30: LearningUnit = {
  id: 30,
  key: 'b1-gesellschaft-engagement',
  level: 'B1',
  title: 'Gesellschaft, Zusammenleben und Engagement',
  subtitle: {
    ru: 'Говорить об обществе, добровольной работе и жизни в районе, выражать цель и следствие, структурировать короткое выступление и текст',
    ky: 'Коом, ыктыярдуу иш жана райондогу жашоо жөнүндө сүйлөө, максатты жана натыйжаны билдирүү, кыска чыгууну жана текстти түзүү',
    de: 'Über Gesellschaft, Ehrenamt und Nachbarschaft sprechen, Ziel und Folge ausdrücken, einen kurzen Vortrag und einen Text gliedern',
  },
  icon: '🤝',
  grammarIds: ['b1-nomen-verb-verbindungen', 'b1-konsekutiv-final', 'b1-textkohaesion'],
}

export const UNIT_30_SPEAKING_ID = 'b1-sp-30-01'
