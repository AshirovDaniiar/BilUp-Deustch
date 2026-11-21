import type { B1UnitMeta } from '../meta-types'
import { UNIT_25_SPEAKING_ID } from './unit'

/**
 * Unit 25 metadata: learning objectives (German + independent Russian and Kyrgyz), the productive / limited-productive classification of the two approved
 * concepts (with the closed list of the reflexive verbs), strands (communication repair, Wortbildung), the opinion micro-task, the topic evidence for
 * feelings and relationships, and the spaced-revision set. The Russian and Kyrgyz texts are AI-assisted first drafts that no reviewer has checked. The
 * classification is the approved product-design default; it is NOT confirmed by an independent CEFR expert (Unit 25 carries no ⚑ decision).
 * The material is for language learning and contains no medical diagnosis or treatment advice.
 */
export const UNIT_25_META: B1UnitMeta = {
  unit: 25,
  canDo: [
    {
      de: 'Ich kann Ratschläge geben und um Rat bitten und höflich um etwas bitten.',
      ru: 'Я могу давать советы, просить совета и вежливо о чём-то просить.',
      ky: 'Мен кеңеш бере алам, кеңеш сурай алам жана бир нерсени сылык өтүнө алам.',
    },
    {
      de: 'Ich kann über Beschwerden, Gesundheit, Gefühle und Beziehungen sprechen und beim Arzt einen Termin vereinbaren.',
      ru: 'Я могу говорить о недомоганиях, здоровье, чувствах и отношениях и договариваться о приёме у врача.',
      ky: 'Мен ден соолуктагы ыңгайсыздыктар, ден соолук, сезимдер жана мамилелер жөнүндө сүйлөй алам жана дарыгерге кабыл алууга жазыла алам.',
    },
    {
      de: 'Ich kann einen Streit ansprechen und einen Freund in einer Mail beraten.',
      ru: 'Я могу заговорить о ссоре и дать совет другу в письме.',
      ky: 'Мен чатак жөнүндө сөз козгой алам жана досума катта кеңеш бере алам.',
    },
  ],
  objectives: {
    lesen: {
      de: 'Ich kann in einem Zeitschriftenartikel und in einem Forumsbeitrag Ratschläge und Gründe finden.',
      ru: 'Я могу найти советы и причины в журнальной статье и в сообщении на форуме.',
      ky: 'Мен журналдагы макаладан жана форумдагы билдирүүдөн кеңештерди жана себептерди таба алам.',
    },
    hoeren: {
      de: 'Ich kann ein Beratungsgespräch beim Hausarzt und einen Podcast über Stress in den wichtigen Punkten verstehen.',
      ru: 'Я могу понять главное в консультации у семейного врача и в подкасте о стрессе.',
      ky: 'Мен үй-бүлөлүк дарыгердин кеңешинде жана стресс жөнүндөгү подкастта негизги нерселерди түшүнө алам.',
    },
    sprechen: {
      de: 'Ich kann einen Streit ansprechen, Ratschläge geben und reagieren, wenn mein Rat zurückgewiesen wird.',
      ru: 'Я могу заговорить о ссоре, давать советы и отреагировать, если мой совет отвергают.',
      ky: 'Мен чатак жөнүндө сөз козгой алам, кеңеш бере алам жана кеңешим четке кагылганда жооп бере алам.',
    },
    schreiben: {
      de: 'Ich kann in einer Mail an einen Freund Verständnis zeigen und mit Konjunktiv II Ratschläge geben.',
      ru: 'Я могу в письме другу показать понимание и дать советы с помощью Konjunktiv II.',
      ky: 'Мен досума катта түшүнгөнүмдү көрсөтүп, Konjunktiv II аркылуу кеңеш бере алам.',
    },
  },
  differenceFromA2: {
    de: 'A2 lernt Körperteile, einen Arztbesuch und den Imperativ; B1 spricht über Lebensstil, Beziehungen und Gefühle und gibt höfliche, weiche Ratschläge.',
    ru: 'В A2 вы учили части тела, визит к врачу и Imperativ; в B1 вы говорите об образе жизни, отношениях и чувствах и даёте мягкие, вежливые советы.',
    ky: 'A2 деңгээлинде сиз дене мүчөлөрүн, дарыгерге баруу жана Imperativди үйрөндүңүз; B1 деңгээлинде жашоо образы, мамилелер жана сезимдер жөнүндө сүйлөйсүз жана жумшак, сылык кеңештерди бересиз.',
  },
  concepts: [
    { conceptId: 'b1-konjunktiv2-ratschlaege', proficiency: 'P', load: 'H', role: 'new' },
    {
      conceptId: 'b1-reflexive-dativ',
      proficiency: 'P-lim',
      load: 'M',
      role: 'new',
      // the closed list (cap 10): the learner is held to these expressions only
      closedList: [
        'sich die Hände waschen',
        'sich die Zähne putzen',
        'sich wehtun',
        'sich etwas merken',
        'sich etwas überlegen',
        'sich etwas vorstellen',
        'sich Zeit nehmen',
        'sich etwas wünschen',
        'sich den Arm brechen',
        'sich etwas kaufen',
      ],
    },
  ],
  scenario: {
    id: UNIT_25_SPEAKING_ID,
    unexpectedElement: {
      de: 'Der Freund weist den Rat zurück: „Das hilft mir nicht, ich brauche Zeit.“',
      ru: 'Друг отвергает совет: «Это мне не помогает, мне нужно время».',
      ky: 'Дос кеңешти четке кагат: «Бул мага жардам бербейт, мага убакыт керек».',
    },
  },
  strands: {
    repairChunks: [
      {
        de: 'Wie meinst du das? Kannst du das genauer erklären?',
        ru: 'Что ты имеешь в виду? Ты можешь объяснить точнее?',
        ky: 'Муну кандай айтып жатасың? Тагыраак түшүндүрүп бере аласыңбы?',
      },
      {
        de: 'Habe ich dich richtig verstanden? Du bist sauer, weil …',
        ru: 'Я правильно тебя понял? Ты злишься, потому что …',
        ky: 'Мен сени туура түшүндүмбү? Сен ачууланасың, анткени …',
      },
      {
        de: 'Das tut mir leid. Ich wollte dich nicht verletzen.',
        ru: 'Мне жаль. Я не хотел тебя обидеть.',
        ky: 'Кечир. Мен сени капа кылгым келген эмес.',
      },
      {
        de: 'Wie fühlst du dich gerade?',
        ru: 'Как ты себя сейчас чувствуешь?',
        ky: 'Сен азыр өзүңдү кандай сезип жатасың?',
      },
    ],
    strategyNote: {
      de: 'Gefühle ausdrücken und nachfragen: Sage zuerst, wie du dich fühlst („Ich bin enttäuscht“), und frage dann nach („Wie siehst du das?“). So bleibt das Gespräch ruhig.',
      ru: 'Выразить чувства и переспросить: сначала скажите, что вы чувствуете («Ich bin enttäuscht»), потом спросите («Wie siehst du das?»). Так разговор остаётся спокойным.',
      ky: 'Сезимдерди билдирүү жана кайра суроо: адегенде өзүңүздүн сезиминизди айтыңыз («Ich bin enttäuscht»), анан сураңыз («Wie siehst du das?»). Ошондо сүйлөшүү тынч бойдон калат.',
    },
    wortbildungNote: {
      de: 'Wörter bilden: Verb → Nomen mit -ung (behandeln → die Behandlung, überweisen → die Überweisung, ernähren → die Ernährung). Nomen + Nomen: Kranken + Kasse = die Krankenkasse (der Artikel kommt vom letzten Wort). Mit un- bekommt ein Adjektiv das Gegenteil: gesund → ungesund.',
      ru: 'Как образуются слова: глагол → существительное с -ung (behandeln → die Behandlung, überweisen → die Überweisung, ernähren → die Ernährung). Существительное + существительное: Kranken + Kasse = die Krankenkasse (артикль берётся от последнего слова). Приставка un- даёт противоположное значение: gesund → ungesund.',
      ky: 'Сөздөр кантип түзүлөт: этиш → -ung менен зат атооч (behandeln → die Behandlung, überweisen → die Überweisung, ernähren → die Ernährung). Зат атооч + зат атооч: Kranken + Kasse = die Krankenkasse (артикль акыркы сөздөн алынат). un- приставкасы тескери маани берет: gesund → ungesund.',
    },
  },
  microTasks: [{ kind: 'meinung', taskId: 'b1-wr-25-02' }],
  topics: [
    {
      topic: 'feelings',
      itemIds: ['v25-19', 'v25-28', 'v25-30', 'v25-33', 'b1-re-25-02', 'b1-li-25-02', UNIT_25_SPEAKING_ID],
    },
    {
      topic: 'relationships',
      itemIds: ['v25-20', 'v25-21', 'v25-22', 'v25-23', 'v25-24', 'v25-31', 'b1-re-25-02', UNIT_25_SPEAKING_ID],
    },
  ],
  revision: {
    fromPrevious: ['v24-25', 'v24-29', 'v24-31', 'v24-38'],
    fromThirdBack: ['v22-1', 'v22-15'],
    fromA2: ['v14-24', 'v14-25', 'v14-37'],
  },
}
