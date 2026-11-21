import type { B1UnitMeta } from '../meta-types'
import { UNIT_23_SPEAKING_ID } from './unit'

/**
 * Unit 23 metadata: learning objectives (German + independent Russian and Kyrgyz), the productive / receptive classification of the two approved
 * concepts, strands and the spaced-revision set. The Russian and Kyrgyz texts are AI-assisted first drafts that no reviewer has checked. The
 * classification is the approved product-design default; it is NOT confirmed by an independent CEFR expert (Unit 23 carries no ⚑ decision).
 * `ohne … zu` and `statt … zu` are declared RECEPTIVE: they are glossed in one reading and never required in a task or a test.
 */
export const UNIT_23_META: B1UnitMeta = {
  unit: 23,
  canDo: [
    {
      de: 'Ich kann Stellenanzeigen verstehen und ein Bewerbungsschreiben verfassen.',
      ru: 'Я могу понимать объявления о вакансиях и писать заявку о приёме на работу.',
      ky: 'Мен бош орун жөнүндө жарыяларды түшүнүп, жумушка кабыл алуу үчүн өтүнүч жаза алам.',
    },
    {
      de: 'Ich kann in einem Vorstellungsgespräch über Erfahrungen, Stärken und Ziele sprechen.',
      ru: 'Я могу на собеседовании рассказать об опыте, сильных сторонах и целях.',
      ky: 'Мен маекте тажрыйбам, күчтүү жактарым жана максаттарым жөнүндө айта алам.',
    },
    {
      de: 'Ich kann Personen und Dinge mit Relativsätzen genauer beschreiben.',
      ru: 'Я могу точнее описывать людей и предметы с помощью Relativsatz.',
      ky: 'Мен адамдарды жана нерселерди Relativsatz менен тагыраак сүрөттөй алам.',
    },
  ],
  objectives: {
    lesen: {
      de: 'Ich kann in einer Stellenanzeige die Aufgaben und die Voraussetzungen erkennen.',
      ru: 'Я могу найти в объявлении о вакансии обязанности и требования.',
      ky: 'Мен бош орун жөнүндө жарыядан милдеттерди жана талаптарды таба алам.',
    },
    hoeren: {
      de: 'Ich kann in einem Vorstellungsgespräch und in einem Telefonat die wichtigen Informationen verstehen.',
      ru: 'Я могу понять важную информацию в собеседовании и в телефонном разговоре.',
      ky: 'Мен маекте жана телефон сүйлөшүүсүндө маанилүү маалыматты түшүнө алам.',
    },
    sprechen: {
      de: 'Ich kann in einem Vorstellungsgespräch Fragen beantworten und auf eine unerwartete Änderung reagieren.',
      ru: 'Я могу на собеседовании отвечать на вопросы и реагировать на неожиданное изменение.',
      ky: 'Мен маекте суроолорго жооп берип, күтүлбөгөн өзгөрүүгө жооп бере алам.',
    },
    schreiben: {
      de: 'Ich kann ein formelles Bewerbungsschreiben mit Relativsatz und um … zu schreiben.',
      ru: 'Я могу написать формальное письмо с заявкой, используя Relativsatz и um … zu.',
      ky: 'Мен Relativsatz жана um … zu колдонуп, расмий өтүнүч кат жаза алам.',
    },
  },
  differenceFromA2: {
    de: 'A2 nennt Berufe und Ausbildung allgemein; B1 bewirbt sich: Anzeige verstehen, Erfahrung nennen, Ziele erklären und genau beschreiben.',
    ru: 'В A2 вы называли профессии и образование в общем виде; в B1 вы подаёте заявку: понимаете объявление, называете опыт, объясняете цели и описываете точно.',
    ky: 'A2 деңгээлинде сиз кесиптерди жана билимди жалпысынан атадыңыз; B1 деңгээлинде өтүнүч бересиз: жарыяны түшүнөсүз, тажрыйбаңызды айтасыз, максаттарыңызды түшүндүрүп, так сүрөттөйсүз.',
  },
  concepts: [
    { conceptId: 'b1-relativsaetze-nom-akk', proficiency: 'P', load: 'H', role: 'new' },
    {
      conceptId: 'b1-infinitiv-mit-zu',
      proficiency: 'P',
      load: 'M',
      role: 'new',
      // productive: zu + Infinitiv (also with separable verbs) and um … zu; RECEPTIVE: the two below (glossed in a reading, never required)
      constructions: [
        { label: 'ohne … zu', proficiency: 'R', forms: ['ohne'] },
        // `statt` becomes a productive Genitiv preposition in Unit 27 (b1-genitiv-praepositionen): receptive only up to and including Unit 26
        { label: 'statt … zu', proficiency: 'R', forms: ['statt'], receptiveThrough: 26 },
      ],
    },
  ],
  scenario: {
    id: UNIT_23_SPEAKING_ID,
    unexpectedElement: {
      de: 'Das Gespräch wird unterbrochen: Der Chef kommt und der Termin soll vielleicht verschoben werden.',
      ru: 'Разговор прерывается: приходит начальник, и встречу, возможно, придётся перенести.',
      ky: 'Маек үзүлөт: начальник келип, жолугушууну, балким, жылдырууга туура келет.',
    },
  },
  strands: {
    repairChunks: [
      {
        de: 'Das ist eine gute Frage. Moment, ich überlege kurz.',
        ru: 'Это хороший вопрос. Минутку, я подумаю.',
        ky: 'Бул жакшы суроо. Бир мүнөт, ойлонуп алайын.',
      },
      { de: 'Können Sie das bitte wiederholen?', ru: 'Не могли бы вы повторить это?', ky: 'Муну кайталап берсеңиз болобу?' },
      { de: 'Habe ich Sie richtig verstanden?', ru: 'Я правильно вас понял?', ky: 'Мен сизди туура түшүндүмбү?' },
      { de: 'Wie meinen Sie das?', ru: 'Что вы имеете в виду?', ky: 'Муну кандай түшүнүү керек?' },
    ],
    strategyNote: {
      de: 'Zeit gewinnen: Sage zuerst „Das ist eine gute Frage“ oder „Moment, ich überlege kurz“. Dann antwortest du ruhiger und genauer.',
      ru: 'Выиграйте время: сначала скажите «Das ist eine gute Frage» или «Moment, ich überlege kurz». Тогда вы ответите спокойнее и точнее.',
      ky: 'Убакыт утуңуз: адегенде «Das ist eine gute Frage» же «Moment, ich überlege kurz» деп айтыңыз. Ошондо сиз тынчыраак жана тагыраак жооп бересиз.',
    },
  },
  revision: {
    fromPrevious: ['v22-2', 'v22-9', 'v22-10', 'v22-15'],
    fromThirdBack: ['v20-3', 'v20-6'],
    fromA2: ['v17-15', 'v17-19'],
  },
}
