import type { B1UnitMeta } from '../meta-types'
import { UNIT_24_SPEAKING_ID } from './unit'

/**
 * Unit 24 metadata: learning objectives (German + independent Russian and Kyrgyz), the productive / receptive classification of the two approved
 * concepts, strands, the opinion micro-task, the spaced-revision set and the Wiederholungsblock of Units 21–23. The Russian and Kyrgyz texts are AI-assisted
 * first drafts that no reviewer has checked. The classification is the approved product-design default; it is NOT confirmed by an independent CEFR expert:
 * decision D-5 (Passiv Perfekt is RECEPTIVE only: glossed in one reading, never required in a task or a test; a reviewer may promote it) is still open.
 */
export const UNIT_24_META: B1UnitMeta = {
  unit: 24,
  canDo: [
    {
      de: 'Ich kann Wohnungsanzeigen und eine Hausordnung verstehen.',
      ru: 'Я могу понимать объявления о квартирах и правила дома.',
      ky: 'Мен батир жөнүндө жарыяларды жана үйдүн эрежелерин түшүнө алам.',
    },
    {
      de: 'Ich kann einen Mangel in der Wohnung melden und eine Reparatur vereinbaren.',
      ru: 'Я могу сообщить о неисправности в квартире и договориться о ремонте.',
      ky: 'Мен батирдеги бузулууну билдирип, оңдоо боюнча макулдаша алам.',
    },
    {
      de: 'Ich kann mit Passiv Abläufe und Regeln beschreiben und über Umwelt und Energiesparen sprechen.',
      ru: 'Я могу с помощью Passiv описывать процессы и правила и говорить об окружающей среде и экономии энергии.',
      ky: 'Мен Passiv аркылуу процесстерди жана эрежелерди сүрөттөп, айлана-чөйрө жана энергияны үнөмдөө жөнүндө сүйлөй алам.',
    },
  ],
  objectives: {
    lesen: {
      de: 'Ich kann in einer Wohnungsanzeige und einer Hausordnung die wichtigen Informationen finden.',
      ru: 'Я могу найти важную информацию в объявлении о квартире и в правилах дома.',
      ky: 'Мен батир жөнүндө жарыядан жана үйдүн эрежелеринен маанилүү маалыматты таба алам.',
    },
    hoeren: {
      de: 'Ich kann bei einer Wohnungsbesichtigung und in einem Gespräch mit dem Hausmeister die wichtigen Informationen verstehen.',
      ru: 'Я могу понять важную информацию при осмотре квартиры и в разговоре со смотрителем дома.',
      ky: 'Мен батирди көрүп жатканда жана үйдү кароочу менен сүйлөшүүдө маанилүү маалыматты түшүнө алам.',
    },
    sprechen: {
      de: 'Ich kann einen Mangel melden, eine Reparatur vereinbaren und auf eine unerwartete Frage reagieren.',
      ru: 'Я могу сообщить о неисправности, договориться о ремонте и отреагировать на неожиданный вопрос.',
      ky: 'Мен бузулууну билдирип, оңдоо боюнча макулдашып, күтүлбөгөн суроого жооп бере алам.',
    },
    schreiben: {
      de: 'Ich kann eine formelle Mail an die Hausverwaltung mit Passiv und Adjektiven ohne Artikel schreiben.',
      ru: 'Я могу написать формальное письмо в управляющую компанию, используя Passiv и прилагательные без артикля.',
      ky: 'Мен Passiv жана артиклсиз сын атоочторду колдонуп, үйдү башкаруучу уюмга расмий кат жаза алам.',
    },
  },
  differenceFromA2: {
    de: 'A2 beschreibt die eigene Wohnung und die Zimmer; B1 versteht Verträge, Abläufe und Regeln, meldet Mängel, vereinbart Reparaturen und spricht über Umwelt.',
    ru: 'В A2 вы описывали свою квартиру и комнаты; в B1 вы понимаете договоры, процессы и правила, сообщаете о неисправностях, договариваетесь о ремонте и говорите об окружающей среде.',
    ky: 'A2 деңгээлинде сиз өз батириңизди жана бөлмөлөрдү сүрөттөдүңүз; B1 деңгээлинде келишимдерди, процесстерди жана эрежелерди түшүнөсүз, бузулууларды билдиресиз, оңдоо боюнча макулдашасыз жана айлана-чөйрө жөнүндө сүйлөйсүз.',
  },
  concepts: [
    {
      conceptId: 'b1-passiv-praesens',
      proficiency: 'P',
      load: 'H',
      role: 'new',
      // productive: Vorgangspassiv im Präsens (werden + Partizip II, von + Dativ); RECEPTIVE: Passiv Perfekt (glossed in one reading, never required)
      constructions: [{ label: 'Passiv Perfekt (ist … worden)', proficiency: 'R', forms: ['worden'] }],
    },
    { conceptId: 'b1-adjektive-ohne-artikel', proficiency: 'P', load: 'M', role: 'new' },
  ],
  scenario: {
    id: UNIT_24_SPEAKING_ID,
    unexpectedElement: {
      de: 'Die Nebenkostenabrechnung weicht von der letzten ab: Sie ist höher als sonst, und die Hausverwaltung fragt nach.',
      ru: 'Счёт за коммунальные услуги отличается от прошлого: он выше обычного, и управляющая компания задаёт вопрос.',
      ky: 'Коммуналдык төлөмдөрдүн эсеби мурункудан айырмаланат: ал адаттагыдан жогору жана үйдү башкаруучу уюм суроо берет.',
    },
  },
  strands: {
    repairChunks: [
      {
        de: 'Entschuldigung, können Sie das bitte noch einmal sagen?',
        ru: 'Извините, не могли бы вы повторить это ещё раз?',
        ky: 'Кечиресиз, муну дагы бир жолу кайталап берсеңиз болобу?',
      },
      {
        de: 'Meinen Sie den Wasserhahn im Bad oder in der Küche?',
        ru: 'Вы имеете в виду кран в ванной или на кухне?',
        ky: 'Сиз жуунуучу бөлмөдөгү кранды айтып жатасызбы же ашканадагыны?',
      },
      {
        de: 'Habe ich das richtig verstanden: Der Hausmeister kommt am Donnerstag?',
        ru: 'Я правильно понял: смотритель дома придёт в четверг?',
        ky: 'Мен туура түшүндүмбү: үйдү кароочу бейшембиде келет?',
      },
      {
        de: 'Können Sie mir das bitte per E-Mail schicken?',
        ru: 'Не могли бы вы прислать мне это по электронной почте?',
        ky: 'Муну мага электрондук почта аркылуу жиберсеңиз болобу?',
      },
    ],
    strategyNote: {
      de: 'Anzeigen lesen: Suche zuerst die Zahlen und Schlüsselwörter (Kaltmiete, Nebenkosten, Kaution, Lage, ab wann). Die kleinen Adjektive (helle, ruhige, neue) beschreiben die Wohnung.',
      ru: 'Как читать объявления: сначала найдите цифры и ключевые слова (Kaltmiete, Nebenkosten, Kaution, Lage, ab wann). Короткие прилагательные (helle, ruhige, neue) описывают квартиру.',
      ky: 'Жарыяларды кантип окуу керек: адегенде сандарды жана негизги сөздөрдү табыңыз (Kaltmiete, Nebenkosten, Kaution, Lage, ab wann). Кыска сын атоочтор (helle, ruhige, neue) батирди сүрөттөйт.',
    },
  },
  microTasks: [{ kind: 'meinung', taskId: 'b1-wr-24-02' }],
  revision: {
    fromPrevious: ['v23-18', 'v23-20', 'v23-22', 'v23-38'],
    fromThirdBack: ['v21-9', 'v21-33'],
    fromA2: ['v13-3', 'v13-28', 'v13-29'],
    // Wiederholungsblock (curriculum v2: Units 24, 28, 32): words of Units 21–23 for one dedicated review round
    block: [
      'v21-1',
      'v21-9',
      'v21-13',
      'v21-25',
      'v21-31',
      'v21-33',
      'v21-40',
      'v22-1',
      'v22-9',
      'v22-10',
      'v22-15',
      'v22-22',
      'v22-23',
      'v22-25',
      'v23-3',
      'v23-5',
      'v23-11',
      'v23-12',
      'v23-18',
      'v23-20',
      'v23-22',
      'v23-40',
    ],
  },
}
