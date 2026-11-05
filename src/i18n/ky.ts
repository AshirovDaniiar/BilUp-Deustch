import type { Dict } from './ru'
import { ru } from './ru'

/** Kyrgyz translation – best effort; untranslated keys fall back to Russian. Review with a native speaker. */
export const ky: Dict = {
  ...ru,
  // S2: the detailed attempt history is kept by a reset (STO-90). UNREVIEWED Kyrgyz — native review required before any Kyrgyz release.
  resetConfirm: 'Бул түзмөктөгү жетишкендикти (XP, өтүлгөн темалар, сөздөр) тазалайсызбы? Аракеттериңиздин толук тарыхы сакталат — аны өзүнчө тастыкталган аракет менен гана өчүрүүгө болот.',
  nav_home: 'Башкы бет', nav_learn: 'Үйрөнүү', nav_practice: 'Практика', nav_speak: 'Сүйлөө', nav_progress: 'Жетишкендик',
  nav_tutor: 'AI-окутуучу', nav_vocabulary: 'Сөздөр', nav_grammar: 'Грамматика', nav_profile: 'Профиль',
  back: 'Артка', next: 'Улантуу', check: 'Текшерүү', continue: 'Улантуу', finish: 'Бүтүрүү', retry: 'Дагы бир жолу', close: 'Жабуу',
  correct: 'Туура!', incorrect: 'Таптакыр эмес', why: 'Эмне үчүн?', when: 'Качан?', examples: 'Мисалдар', mistakes: 'Көп кетүүчү каталар', reallife: 'Чыныгы жашоодо',
  listen: 'Угуу', speak: 'Сүйлөө', save: 'Сактоо', saved: 'Сакталды', practice: 'Көнүгүү', start: 'Баштоо', open: 'Ачуу',
  level: 'Деңгээл', unit: 'Бөлүм', score: 'Жыйынтык', result: 'Жыйынтык', strengths: 'Күчтүү жактары', weaknesses: 'Бекемдөө керек', recommended: 'Кийинки сунуш',
  slow: 'Жай', normal: 'Кадимки', repeat: 'Кайталоо', transcript: 'Текст', showTranscript: 'Текстти көрсөт', play: 'Угуу', stop: 'Токтотуу',
  comingSoon: 'Жакында', words: 'сөз', min: 'мүн.', days: 'күн', of: '/', all: 'Баары', locked: 'Жакында',
  goodMorning: 'Кайырлуу таң', goodDay: 'Кайырлуу күн', goodEvening: 'Кайырлуу кеч',
  journey: 'Немис тилиндеги жолуңуз', todayLearning: 'Бүгүнкү сабак', session: 'сабак',
  streak: 'Катар', weekly: 'Жума', continueLearning: 'ҮЙРӨНҮҮНҮ УЛАНТУУ', newWords: 'жаңы сөз', questionsN: 'суроо',
  stepVocabulary: 'Сөздөр', stepGrammar: 'Грамматика', stepListening: 'Угуу', stepSpeaking: 'Сүйлөө', stepTest: 'Мини-тест',
  dailyChallenge: 'Күндүн тапшырмасы',
  currentLevel: 'Азыркы деңгээл', daysShort: 'күн',
  learnTitle: 'Окуу жолу',
  sec_vocabulary: 'Сөздөр', sec_grammar: 'Грамматика', sec_listening: 'Угуу', sec_reading: 'Окуу', sec_speaking: 'Сүйлөө', sec_writing: 'Жазуу', sec_review: 'Кайталоо', sec_test: 'Жыйынтык тест',
  step_discover: 'Ачуу', step_understand: 'Түшүнүү', step_practice: 'Көнүгүү', step_apply: 'Колдонуу', step_speak: 'Айтуу', step_test: 'Текшерүү', step_review: 'Жыйынтык',
  grammarLab: 'Grammar Lab', whyLabel: 'ЭМНЕ ҮЧҮН?',
  vocabTitle: 'Сөздүк', search: 'Издөө…',
  stage_new: 'Жаңы', stage_learning: 'Үйрөнүүдө', stage_familiar: 'Тааныш', stage_strong: 'Бекем', stage_mastered: 'Өздөштүрүлдү',
  plural: 'Көптүк', meaning: 'Мааниси', pronunciation: 'Айтылышы', grammarForms: 'Грамматика', example: 'Мисал', related: 'Байланышкан сөздөр',
  practiceTitle: 'Практика',
  speakingLab: 'Speaking Lab', yourGoal: 'Максатыңыз', hold: 'Басып сүйлөңүз', listening: 'Угуп жатам…',
  progressTitle: 'Жетишкендигиңиз', overallLevel: 'Жалпы деңгээл', studyTime: 'Окуу убактысы', masteredWords: 'Өздөштүрүлгөн сөздөр', completedTopics: 'Өтүлгөн темалар', skills: 'Көндүмдөр',
  profileTitle: 'Профиль', yourName: 'Атыңыз', interfaceLang: 'Интерфейс тили', theme: 'Тема', weeklyGoal: 'Жумалык максат (күн)',
  tutorTitle: 'BilUp AI', tutorPlaceholder: 'Немис тили боюнча суроо бериңиз…',
  testsTitle: 'Тесттер', takeTest: 'Тестти баштоо',
}
