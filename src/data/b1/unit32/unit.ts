import type { ContentSource, LearningUnit } from '../../types'

/**
 * Provenance of the Unit 32 material: ORIGINAL material written for BilUp Til (no external text was copied or adapted), drafted with AI
 * assistance (Claude) and therefore NOT reviewed by any person. No CEFR, Russian or Kyrgyz reviewer has signed anything off; the Kyrgyz in
 * particular is an AI-assisted first draft for native review. This is not an official CEFR approval. Unit 32 is a CONSOLIDATION and practice unit: its "Probeprüfung" is an
 * exercise for the learner, not an official exam, not a mock of any named examination and no prediction of an exam result. All courses, schools, people, offices and
 * events in the texts are FICTIONAL.
 */
export const UNIT_32_SOURCE: ContentSource = {
  kind: 'authored',
  author: 'BilUp Til B1 authoring: original text drafted with AI assistance (Claude); pending independent CEFR, Russian and Kyrgyz review',
}

/** Unit 32 identity: equals its entry in the approved plan (`B1_UNIT_PLAN`), permanent. */
export const UNIT_32: LearningUnit = {
  id: 32,
  key: 'b1-rueckblick-pruefung',
  level: 'B1',
  title: 'Rückblick, Bilanz und Prüfungsvorbereitung',
  subtitle: {
    ru: 'Подвести итоги, повторить Nebensätze и порядок слов в середине предложения, потренироваться в заданиях в стиле экзамена, подготовить короткое выступление и пройти итоговую проверку курса',
    ky: 'Жыйынтык чыгаруу, Nebensatz жана сүйлөмдүн ортосундагы сөз иретин кайталоо, экзамен стилиндеги тапшырмаларды машыгуу, кыска чыгууну даярдоо жана курстун жыйынтыктоочу текшерүүсүнөн өтүү',
    de: 'Bilanz ziehen, Nebensätze und Mittelfeld wiederholen, Aufgaben im Prüfungsformat üben, einen kurzen Vortrag vorbereiten und den Fortschrittscheck des Kurses durchführen',
  },
  icon: '🏁',
  grammarIds: ['b1-nebensaetze-integration', 'b1-satzbau-mittelfeld'],
}

export const UNIT_32_SPEAKING_ID = 'b1-sp-32-01'
