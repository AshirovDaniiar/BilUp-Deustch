import { UNIT_12_FINAL, UNIT_12_TEST } from './unit12/assessment'
import { UNIT_13_FINAL, UNIT_13_TEST } from './unit13/assessment'
import { UNIT_14_FINAL, UNIT_14_TEST } from './unit14/assessment'
import { UNIT_15_FINAL, UNIT_15_TEST } from './unit15/assessment'
import { UNIT_16_FINAL, UNIT_16_TEST } from './unit16/assessment'
import { UNIT_17_FINAL, UNIT_17_TEST } from './unit17/assessment'
import { UNIT_18_FINAL, UNIT_18_TEST } from './unit18/assessment'
import { UNIT_19_FINAL, UNIT_19_TEST } from './unit19/assessment'
import { UNIT_20_FINAL, UNIT_20_TEST } from './unit20/assessment'
import type { A2TestDef, A2TestQuestion, L10nStrict } from './types'

/** Dedicated authored final test of one A2 unit (15 questions, separate from the revision exercises — decision D-2). */
export interface A2FinalTest {
  unit: number
  questions: A2TestQuestion[]
}

const w = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/** A2 test definitions: `unit-11`…`unit-20`, `level-a2` (and later the placement extension). Only `unit-11` is authored so far. */
const UNIT_11_TESTS: A2TestDef[] = [
  {
    id: 'unit-11',
    title: { ru: 'Итоговый тест: юнит 11', ky: 'Жыйынтыктоочу тест: 11-бөлүм' },
    kind: 'topic',
    level: 'A2',
    unit: 11,
    size: 15,
  },
]

/**
 * Unit 11 final test. Authored separately from `A2_EXERCISES`: different sentences, different verbs and different distractors, and
 * the questions cover different objectives (Perfekt with sein / without ge- / Partizip position / irregular Partizip / time words,
 * Präteritum of sein, modal and haben, weil and dass, topic vocabulary, and two short reading tasks).
 * The authored position of the correct answer is spread evenly (5 / 5 / 5 over three options, never more than two in a row).
 */
const UNIT_11_FINAL: A2TestQuestion[] = [
  {
    id: 'a2-ft-11-01',
    prompt: '„Wo bist du aufgewachsen?“ – „Ich ___ in einem kleinen Dorf aufgewachsen.“',
    promptRu: '«Где ты вырос?» — «Я вырос в маленькой деревне.»',
    promptKy: '«Сен кайда чоңойдуң?» — «Мен кичинекей айылда чоңойдум.»',
    options: ['habe', 'sind', 'bin'],
    answer: 'bin',
    skill: 'grammar',
    concept: 'a2-perfekt-erfahrungen',
    why: w(
      'Aufwachsen означает развитие, изменение состояния, поэтому Perfekt образуется с sein: «bin … aufgewachsen».',
      'Aufwachsen — өсүү, абалдын өзгөрүшү, ошондуктан Perfekt sein менен түзүлөт: «bin … aufgewachsen».',
    ),
  },
  {
    id: 'a2-ft-11-02',
    prompt: 'Meine Schwester hat in Wien Medizin ___.',
    promptRu: 'Моя сестра училась в Вене на медицинском.',
    promptKy: 'Эжем Венада медицина боюнча окуган.',
    options: ['studiert', 'gestudiert', 'studieren'],
    answer: 'studiert',
    skill: 'grammar',
    concept: 'a2-perfekt-erfahrungen',
    why: w(
      'Глаголы на -ieren образуют Partizip II без ge-: studieren → studiert.',
      '-ieren менен аяктаган этиштердин Partizip II формасы ge- кошулбай түзүлөт: studieren → studiert.',
    ),
  },
  {
    id: 'a2-ft-11-03',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich habe gemacht 2020 mein Abitur.', 'Ich habe 2020 mein Abitur gemacht.', 'Ich 2020 mein Abitur habe gemacht.'],
    answer: 'Ich habe 2020 mein Abitur gemacht.',
    skill: 'grammar',
    concept: 'a2-perfekt-erfahrungen',
    why: w(
      'Haben стоит на втором месте, Partizip II (gemacht) — в самом конце предложения.',
      'Haben экинчи орунда, Partizip II (gemacht) сүйлөмдүн эң аягында турат.',
    ),
  },
  {
    id: 'a2-ft-11-04',
    prompt: 'Hast du schon einmal Pizza mit Ananas ___?',
    promptRu: 'Ты когда-нибудь ел пиццу с ананасом?',
    promptKy: 'Сен мурда ананас салынган пицца жеп көрдүң беле?',
    options: ['geessen', 'gegessen', 'gegesst'],
    answer: 'gegessen',
    skill: 'grammar',
    concept: 'a2-perfekt-erfahrungen',
    why: w(
      'Essen — неправильный глагол: Partizip II образуется с ge- и окончанием -en: gegessen.',
      'Essen — туура эмес этиш: Partizip II ge- жана -en мүчөсү менен түзүлөт: gegessen.',
    ),
  },
  {
    id: 'a2-ft-11-05',
    prompt: 'Vor zehn Jahren ___ ich noch Schüler.',
    promptRu: 'Десять лет назад я был ещё школьником.',
    promptKy: 'Он жыл мурун мен али окуучу элем.',
    options: ['sein', 'bin', 'war'],
    answer: 'war',
    skill: 'grammar',
    concept: 'a2-praeteritum-sein-haben-modal',
    why: w(
      'Vor zehn Jahren — прошлое, значит нужен Präteritum от sein: ich war. «Bin» — настоящее время, «sein» — инфинитив: здесь они не подходят.',
      'Vor zehn Jahren — өткөн убакыт, ошондуктан sein этишинин Präteritum формасы керек: ich war. «Bin» — азыркы чак, «sein» — инфинитив: бул жерге алар туура келбейт.',
    ),
  },
  {
    id: 'a2-ft-11-06',
    prompt: 'Wir ___ gestern bis acht Uhr arbeiten. (müssen)',
    promptRu: 'Вчера нам пришлось работать до восьми часов.',
    promptKy: 'Кечээ бизге саат сегизге чейин иштөөгө туура келди.',
    options: ['mussten', 'musste', 'müssen'],
    answer: 'mussten',
    skill: 'grammar',
    concept: 'a2-praeteritum-sein-haben-modal',
    why: w(
      'Wir + Präteritum: mussten (без умлаута). Musste — форма для ich и er/sie/es, müssen — настоящее время или инфинитив.',
      'Wir + Präteritum: mussten (умлаутсуз). Musste — ich жана er/sie/es үчүн форма, müssen — азыркы чак же инфинитив.',
    ),
  },
  {
    id: 'a2-ft-11-07',
    prompt: 'Gestern ___ du keine Zeit, und du hast nicht angerufen.',
    promptRu: 'Вчера у тебя не было времени, и ты не позвонил.',
    promptKy: 'Кечээ сенде убакыт жок болду жана сен чалган жоксуң.',
    options: ['hast', 'hatte', 'hattest'],
    answer: 'hattest',
    skill: 'grammar',
    concept: 'a2-praeteritum-sein-haben-modal',
    why: w(
      'Gestern указывает на прошлое, а du требует окончания -st: du hattest. Hatte — это ich и er/sie/es.',
      'Gestern өткөн убакытты көрсөтөт, ал эми du -st мүчөсүн талап кылат: du hattest. Hatte — ich жана er/sie/es үчүн.',
    ),
  },
  {
    id: 'a2-ft-11-08',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Er ist nach Deutschland gekommen, weil er hier eine Arbeit hat.',
      'Er ist nach Deutschland gekommen, weil er hat hier eine Arbeit.',
      'Er ist nach Deutschland gekommen, weil hier er eine Arbeit hat.',
    ],
    answer: 'Er ist nach Deutschland gekommen, weil er hier eine Arbeit hat.',
    skill: 'grammar',
    concept: 'a2-ereignisse-verbinden',
    why: w(
      'В придаточном предложении после weil подлежащее стоит сразу за союзом, а спрягаемый глагол (hat) — в самом конце.',
      'Weil байламтасынан кийинки ээрчимелүү сүйлөмдө ээси байламтанын дароо артынан келет, ал эми жөндөлгөн этиш (hat) эң аягында турат.',
    ),
  },
  {
    id: 'a2-ft-11-09',
    prompt: 'Ich weiß, dass du sehr gut Deutsch ___.',
    promptRu: 'Я знаю, что ты очень хорошо говоришь по-немецки.',
    promptKy: 'Сенин немисче абдан жакшы сүйлөгөнүңдү билем.',
    options: ['spricht', 'sprichst', 'sprechen'],
    answer: 'sprichst',
    skill: 'grammar',
    concept: 'a2-ereignisse-verbinden',
    why: w(
      'После dass спрягаемый глагол стоит в конце придаточного предложения и согласуется с подлежащим: du → sprichst.',
      'Dass сөзүнөн кийин жөндөлгөн этиш ээрчимелүү сүйлөмдүн аягында турат жана ээ менен макулдашат: du → sprichst.',
    ),
  },
  {
    id: 'a2-ft-11-10',
    prompt: 'Ich wohne ___ drei Jahren in Berlin.',
    promptRu: 'Я живу в Берлине уже три года.',
    promptKy: 'Мен Берлинде үч жылдан бери жашап жатам.',
    options: ['vor', 'für', 'seit'],
    answer: 'seit',
    skill: 'grammar',
    concept: 'a2-perfekt-erfahrungen',
    why: w(
      'Действие продолжается до сих пор, поэтому нужны seit + Dativ и настоящее время. Vor + Dativ означает «назад» и требует Perfekt.',
      'Иш-аракет азыркыга чейин улана берет, ошондуктан seit + Dativ жана учурдагы чак керек. Vor + Dativ «мурун» дегенди билдирет жана Perfekt талап кылат.',
    ),
  },
  {
    id: 'a2-ft-11-11',
    prompt: 'Ich habe die Prüfung bestanden. Ich bin sehr ___.',
    promptRu: 'Я сдал экзамен. Я очень горжусь.',
    promptKy: 'Мен сынактан өттүм. Мен абдан сыймыктанам.',
    options: ['stolz', 'traurig', 'hungrig'],
    answer: 'stolz',
    skill: 'vocabulary',
    why: w(
      'Stolz sein означает «гордиться»: после успеха человек чувствует гордость.',
      'Stolz sein «сыймыктануу» дегенди билдирет: ийгиликтен кийин адам сыймыктанат.',
    ),
  },
  {
    id: 'a2-ft-11-12',
    prompt: 'Im Ausland kann man viele Erfahrungen ___.',
    promptRu: 'За границей можно набраться много опыта.',
    promptKy: 'Чет өлкөдө көп тажрыйба топтоого болот.',
    options: ['bestehen', 'sammeln', 'abschließen'],
    answer: 'sammeln',
    skill: 'vocabulary',
    why: w(
      'Устойчивое выражение: Erfahrungen sammeln — «набираться опыта». Bestehen и abschließen с Erfahrungen не сочетаются.',
      'Туруктуу сөз айкашы: Erfahrungen sammeln — «тажрыйба топтоо». Bestehen жана abschließen Erfahrungen сөзү менен айкалышпайт.',
    ),
  },
  {
    id: 'a2-ft-11-13',
    prompt: 'Welches Wort gehört nicht zum Thema „Ausbildung“?',
    promptRu: 'Какое слово не относится к теме «Профессиональное обучение»?',
    promptKy: '«Кесиптик окуу» темасына кайсы сөз тиешелүү эмес?',
    options: ['die Prüfung', 'der Abschluss', 'die Heimat'],
    answer: 'die Heimat',
    skill: 'vocabulary',
    why: w(
      'Die Prüfung и der Abschluss связаны с учёбой, а die Heimat — это родина, родные места.',
      'Die Prüfung жана der Abschluss окуу менен байланыштуу, ал эми die Heimat — мекен, туулуп өскөн жер.',
    ),
  },
  {
    id: 'a2-ft-11-14',
    prompt:
      'Lies den Text: „Letztes Jahr bin ich nach Dresden gezogen. In Osch habe ich einen Deutschkurs gemacht. Am Anfang konnte ich im Supermarkt nicht alles verstehen. Jetzt geht es besser.“ Wann konnte die Person nicht alles verstehen?',
    promptRu:
      'Прочитайте текст: «В прошлом году я переехал в Дрезден. В Оше я прошёл курс немецкого. Сначала в супермаркете я понимал не всё. Теперь получается лучше.» Когда человек понимал не всё?',
    promptKy:
      'Текстти окуңуз: «Былтыр мен Дрезденге көчүп бардым. Ошто мен немис тили курсунан өттүм. Башында супермаркетте баарын түшүнчү эмесмин. Азыр жакшыраак болуп калды.» Адам качан баарын түшүнгөн эмес?',
    options: ['Am Anfang', 'Jetzt', 'Vor dem Deutschkurs'],
    answer: 'Am Anfang',
    skill: 'reading',
    concept: 'a2-praeteritum-sein-haben-modal',
    why: w(
      'В тексте сказано: «Am Anfang konnte ich … nicht alles verstehen». «Jetzt» — наоборот, теперь стало лучше.',
      'Текстте айтылган: «Am Anfang konnte ich … nicht alles verstehen». «Jetzt» — тескерисинче, азыр жакшыраак болду.',
    ),
  },
  {
    id: 'a2-ft-11-15',
    prompt:
      'Lies den Text: „Ich bin in Osch aufgewachsen. 2018 habe ich mein Abitur gemacht. Danach habe ich ein Jahr als Kellner gearbeitet, weil ich Geld für das Studium sparen wollte. Jetzt studiere ich in Leipzig.“ Warum hat der Sprecher als Kellner gearbeitet?',
    promptRu:
      'Прочитайте текст: «Я вырос в Оше. В 2018 году я окончил школу. После этого год работал официантом, потому что хотел накопить деньги на учёбу. Сейчас я учусь в Лейпциге.» Почему говорящий работал официантом?',
    promptKy:
      'Текстти окуңуз: «Мен Ошто чоңойдум. 2018-жылы мен мектепти бүтүрдүм. Андан кийин бир жыл официант болуп иштедим, анткени окууга акча чогултууну кааладым. Азыр Лейпцигде окуп жатам.» Сүйлөөчү эмне үчүн официант болуп иштеген?',
    options: ['Er wollte in Leipzig wohnen.', 'Er wollte Geld für das Studium sparen.', 'Er hat das Abitur nicht bestanden.'],
    answer: 'Er wollte Geld für das Studium sparen.',
    skill: 'reading',
    concept: 'a2-ereignisse-verbinden',
    why: w(
      'Причина указана после weil: «weil ich Geld für das Studium sparen wollte». Остальные варианты в тексте не названы.',
      'Себеп weil сөзүнөн кийин берилген: «weil ich Geld für das Studium sparen wollte». Калган варианттар текстте айтылган эмес.',
    ),
  },
]

/** A2 test definitions: unit 11 (pilot) and unit 12. */
export const A2_TESTS: A2TestDef[] = [...UNIT_11_TESTS, UNIT_12_TEST, UNIT_13_TEST, UNIT_14_TEST, UNIT_15_TEST, UNIT_16_TEST, UNIT_17_TEST, UNIT_18_TEST, UNIT_19_TEST, UNIT_20_TEST]

/** Authored final-test questions, one entry per A2 unit. Only unit 11 is authored so far. */
export const A2_FINAL_TESTS: A2FinalTest[] = [
  { unit: 11, questions: UNIT_11_FINAL },
  { unit: 12, questions: UNIT_12_FINAL },
  { unit: 13, questions: UNIT_13_FINAL },
  { unit: 14, questions: UNIT_14_FINAL },
  { unit: 15, questions: UNIT_15_FINAL },
  { unit: 16, questions: UNIT_16_FINAL },
  { unit: 17, questions: UNIT_17_FINAL },
  { unit: 18, questions: UNIT_18_FINAL },
  { unit: 19, questions: UNIT_19_FINAL },
  { unit: 20, questions: UNIT_20_FINAL },
]
