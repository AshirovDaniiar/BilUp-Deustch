import type { B1UnitMeta } from '../meta-types'
import { UNIT_21_SPEAKING_ID } from './unit'

/**
 * Unit 21 metadata: learning objectives (German + independent Russian and Kyrgyz), the productive / limited-productive / receptive classification
 * of the two approved concepts, strands, evidence for the required topic and the spaced-revision set. The Russian and Kyrgyz texts are AI-assisted
 * first drafts that no reviewer has checked. The classification is the approved product-design default; it is NOT confirmed by an independent
 * CEFR expert (Unit 21 carries no ⚑ decision).
 */
export const UNIT_21_META: B1UnitMeta = {
  unit: 21,
  canDo: [
    {
      de: 'Ich kann von vergangenen Erlebnissen zusammenhängend erzählen und die Reihenfolge der Ereignisse klar machen.',
      ru: 'Я могу связно рассказывать о пережитом и ясно показывать порядок событий.',
      ky: 'Мен башымдан өткөн окуяларды байланыштуу айтып, окуялардын иретин даана көрсөтө алам.',
    },
    {
      de: 'Ich kann über meine Kindheit und frühere Gewohnheiten sprechen.',
      ru: 'Я могу рассказывать о своём детстве и прежних привычках.',
      ky: 'Мен балалык чагым жана мурунку адаттарым жөнүндө айтып бере алам.',
    },
    {
      de: 'Ich kann Gefühle und Reaktionen zu einem Erlebnis beschreiben.',
      ru: 'Я могу описывать чувства и реакции, связанные с событием.',
      ky: 'Мен окуяга байланыштуу сезимдерди жана реакцияны сүрөттөй алам.',
    },
  ],
  objectives: {
    lesen: {
      de: 'Ich kann die Reihenfolge der Ereignisse und die Gefühle in einem persönlichen Text erkennen.',
      ru: 'Я могу определить порядок событий и чувства автора в личном тексте.',
      ky: 'Мен жеке текстте окуялардын иретин жана автордун сезимдерин аныктай алам.',
    },
    hoeren: {
      de: 'Ich kann die Abfolge von Ereignissen in einer Erzählung verstehen.',
      ru: 'Я могу понять последовательность событий в рассказе.',
      ky: 'Мен баяндагы окуялардын удаалаштыгын түшүнө алам.',
    },
    sprechen: {
      de: 'Ich kann ein Erlebnis erzählen und auf Nachfragen reagieren.',
      ru: 'Я могу рассказать о событии и отреагировать на уточняющие вопросы.',
      ky: 'Мен окуяны айтып берип, тактоочу суроолорго жооп бере алам.',
    },
    schreiben: {
      de: 'Ich kann eine Nachricht über ein Erlebnis schreiben und dabei Präteritum und zeitliche Konnektoren verwenden.',
      ru: 'Я могу написать сообщение о событии, используя Präteritum и временные союзы.',
      ky: 'Мен Präteritum жана убакыт байламталарын колдонуп, окуя жөнүндө билдирүү жаза алам.',
    },
  },
  differenceFromA2: {
    de: 'A2 berichtet kurz im Perfekt; B1 erzählt zusammenhängend und verbindet Ereignisse.',
    ru: 'В A2 вы коротко рассказывали о прошлом в Perfekt; в B1 вы рассказываете связно и соединяете события.',
    ky: 'A2 деңгээлинде өткөн жөнүндө Perfekt менен кыска айтчусуз; B1 деңгээлинде байланыштуу баяндап, окуяларды бириктиресиз.',
  },
  concepts: [
    {
      conceptId: 'b1-praeteritum-erzaehlen',
      proficiency: 'P-lim',
      load: 'H',
      role: 'new',
      // the closed list of 35 verbs (regular and irregular) the learner is held to; regular verbs follow the -te rule, the others must be learned
      closedList: [
        'sein',
        'haben',
        'gehen',
        'kommen',
        'sehen',
        'finden',
        'nehmen',
        'geben',
        'bleiben',
        'fahren',
        'laufen',
        'rufen',
        'schreiben',
        'lesen',
        'essen',
        'trinken',
        'schlafen',
        'sitzen',
        'stehen',
        'treffen',
        'verlieren',
        'beginnen',
        'helfen',
        'fallen',
        'schlagen',
        'bekommen',
        'wissen',
        'denken',
        'bringen',
        'kennen',
        'wohnen',
        'landen',
        'lachen',
        'verpassen',
        'aufwachen',
      ],
    },
    { conceptId: 'b1-temporale-konnektoren', proficiency: 'P', load: 'M', role: 'new' },
  ],
  scenario: {
    id: UNIT_21_SPEAKING_ID,
    unexpectedElement: {
      de: 'Der Gesprächspartner zweifelt an der Geschichte und fragt nach.',
      ru: 'Собеседник сомневается в истории и задаёт уточняющие вопросы.',
      ky: 'Маектеш окуяга шектенип, тактоочу суроолорду берет.',
    },
  },
  strands: {
    repairChunks: [
      { de: 'Können Sie das bitte wiederholen?', ru: 'Не могли бы вы повторить это?', ky: 'Муну кайталап берсеңиз болобу?' },
      { de: 'Was bedeutet das?', ru: 'Что это значит?', ky: 'Бул эмнени билдирет?' },
      { de: 'Wie sagt man … auf Deutsch?', ru: 'Как по-немецки сказать …?', ky: '… немисче кантип айтылат?' },
      { de: 'Habe ich das richtig verstanden?', ru: 'Я правильно понял это?', ky: 'Мен муну туура түшүндүмбү?' },
    ],
    strategyNote: {
      de: 'Achte beim Lesen auf Signalwörter wie zuerst, dann, danach, plötzlich und schließlich: Sie zeigen die Reihenfolge der Ereignisse.',
      ru: 'Во время чтения обращайте внимание на сигнальные слова zuerst, dann, danach, plötzlich, schließlich: они показывают порядок событий.',
      ky: 'Окуп жатканда zuerst, dann, danach, plötzlich, schließlich сыяктуу белги сөздөргө көңүл буруңуз: алар окуялардын иретин көрсөтөт.',
    },
  },
  topics: [{ topic: 'feelings', itemIds: ['v21-17', 'v21-18', 'v21-19', 'v21-20', 'b1-re-21-01', 'b1-li-21-01', UNIT_21_SPEAKING_ID] }],
  recapConcepts: ['a2-perfekt-erfahrungen', 'a2-ereignisse-verbinden', 'a2-wenn-als', 'a2-adjektivendungen-indefinit'],
  revision: {
    fromPrevious: ['v20-3', 'v20-6', 'v20-7', 'v20-9'],
    fromThirdBack: ['v18-1', 'v18-13'],
    fromA2: ['v11-1', 'v11-8'],
  },
}
