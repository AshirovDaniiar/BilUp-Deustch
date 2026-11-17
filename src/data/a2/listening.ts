import type { ListeningExercise } from '../types'
import { UNIT_11_SOURCE } from './provenance'
import { UNIT_12_LISTENING } from './unit12/texts'
import { UNIT_13_LISTENING } from './unit13/texts'
import { UNIT_14_LISTENING } from './unit14/texts'
import { UNIT_15_LISTENING } from './unit15/texts'
import { UNIT_16_LISTENING } from './unit16/texts'
import { UNIT_17_LISTENING } from './unit17/texts'
import { UNIT_18_LISTENING } from './unit18/texts'
import { UNIT_19_LISTENING } from './unit19/texts'
import { UNIT_20_LISTENING } from './unit20/texts'

/** A2 listening dialogues (units 11–20), ids `a2-li-<unit>-<nn>`. Unit 11 has two. */
const UNIT_11_A2_LISTENING: ListeningExercise[] = [
  {
    id: 'a2-li-11-01',
    unit: 11,
    level: 'A2',
    title: 'Im Deutschkurs: Woher kommst du, und was hast du gemacht?',
    lines: [
      { speaker: 'Jonas', text: 'Hallo Aigerim! Woher kommst du eigentlich?', ru: 'Привет, Айгерим! Откуда ты вообще?', ky: 'Салам, Айгерим! Сен кайдан келдиң?' },
      { speaker: 'Aigerim', text: 'Ich komme aus Kirgisistan. Ich bin in Osch aufgewachsen, aber ich habe in Bischkek studiert.', ru: 'Я из Кыргызстана. Я выросла в Оше, но училась в Бишкеке.', ky: 'Мен Кыргызстандан келдим. Мен Ошто чоңойдум, бирок Бишкекте окудум.' },
      { speaker: 'Jonas', text: 'Was hast du studiert?', ru: 'А что ты изучала?', ky: 'Эмнени окудуң?' },
      { speaker: 'Aigerim', text: 'Wirtschaft. Danach habe ich zwei Jahre in einer Bank gearbeitet.', ru: 'Экономику. После этого я два года работала в банке.', ky: 'Экономика. Андан кийин эки жыл банкта иштедим.' },
      { speaker: 'Jonas', text: 'Und warum bist du nach Deutschland gekommen?', ru: 'А почему ты приехала в Германию?', ky: 'Ал эми эмне үчүн Германияга келдиң?' },
      { speaker: 'Aigerim', text: 'Weil mein Mann hier eine Stelle gefunden hat. Wir sind vor einem Jahr nach Leipzig gezogen.', ru: 'Потому что мой муж нашёл здесь работу. Мы переехали в Лейпциг год назад.', ky: 'Анткени жолдошум бул жерде жумуш тапты. Биз бир жыл мурун Лейпцигге көчүп келдик.' },
      { speaker: 'Jonas', text: 'Und wie war der Anfang?', ru: 'И каким было начало?', ky: 'Башталышы кандай болду?' },
      { speaker: 'Aigerim', text: 'Schwer. Ich konnte kaum Deutsch sprechen, aber jetzt geht es schon besser.', ru: 'Трудным. Я почти не могла говорить по-немецки, но теперь уже лучше.', ky: 'Оор болду. Мен дээрлик немисче сүйлөй алчу эмес элем, бирок азыр жакшырып калды.' },
      { speaker: 'Jonas', text: 'Du sprichst wirklich gut. Hast du schon einmal in einem deutschen Büro gearbeitet?', ru: 'Ты правда хорошо говоришь. Ты когда-нибудь работала в немецком офисе?', ky: 'Сен чын эле жакшы сүйлөйсүң. Мурда немис кеңсесинде иштеп көрдүң беле?' },
      { speaker: 'Aigerim', text: 'Noch nie, aber ich suche gerade ein Praktikum.', ru: 'Ещё никогда, но сейчас я ищу стажировку.', ky: 'Эч качан иштеген эмесмин, бирок азыр практика издеп жатам.' },
    ],
    questions: [
      { q: 'Wo ist Aigerim aufgewachsen?', options: ['In Bischkek', 'In Osch', 'In Leipzig'], answer: 1 },
      { q: 'Was hat Aigerim nach dem Studium gemacht?', options: ['Sie hat ein Praktikum gemacht.', 'Sie hat einen Deutschkurs besucht.', 'Sie hat zwei Jahre in einer Bank gearbeitet.'], answer: 2 },
      { q: 'Warum sind Aigerim und ihr Mann nach Leipzig gezogen?', options: ['Ihr Mann hat dort eine Stelle gefunden.', 'Aigerim wollte dort studieren.', 'Sie haben dort Familie.'], answer: 0 },
      { q: 'Was hat Aigerim noch nie gemacht?', options: ['In Bischkek gelebt', 'Wirtschaft studiert', 'In einem deutschen Büro gearbeitet'], answer: 2 },
    ],
    keywords: ['aufgewachsen', 'studiert', 'gezogen', 'weil', 'noch nie'],
    source: UNIT_11_SOURCE,
  },
  {
    id: 'a2-li-11-02',
    unit: 11,
    level: 'A2',
    title: 'Ein Interview: Was hat sich verändert?',
    lines: [
      { speaker: 'Frau Keller', text: 'Tomás, Sie leben seit drei Jahren in Deutschland. Was hat sich in dieser Zeit verändert?', ru: 'Томас, вы живёте в Германии уже три года. Что изменилось за это время?', ky: 'Томас, сиз Германияда үч жылдан бери жашап жатасыз. Бул убакыттын ичинде эмне өзгөрдү?' },
      { speaker: 'Tomás', text: 'Sehr viel! Früher habe ich in Madrid in einem Hotel gearbeitet. Jetzt arbeite ich als Techniker in München.', ru: 'Очень многое! Раньше я работал в гостинице в Мадриде. Теперь я работаю техником в Мюнхене.', ky: 'Абдан көп нерсе! Мурда мен Мадридде мейманканада иштечү элем. Азыр Мюнхенде техник болуп иштейм.' },
      { speaker: 'Frau Keller', text: 'Wie haben Sie diese Stelle gefunden?', ru: 'Как вы нашли это место?', ky: 'Бул жумуш ордун кантип таптыңыз?' },
      { speaker: 'Tomás', text: 'Zuerst habe ich einen Sprachkurs gemacht. Danach habe ich ein Praktikum gemacht, und dann hat mir die Firma die Stelle angeboten.', ru: 'Сначала я прошёл языковой курс. После этого я прошёл стажировку, а потом фирма предложила мне место.', ky: 'Адегенде мен тил курсунан өттүм. Андан кийин практикадан өттүм, анан фирма мага жумуш ордун сунуштады.' },
      { speaker: 'Frau Keller', text: 'Das ist ein großer Erfolg! War das Praktikum schwer?', ru: 'Это большой успех! Стажировка была трудной?', ky: 'Бул чоң ийгилик! Практика оор болдубу?' },
      { speaker: 'Tomás', text: 'Ja, ein bisschen. Ich musste viel Deutsch sprechen, und ich hatte Angst vor Fehlern.', ru: 'Да, немного. Мне приходилось много говорить по-немецки, и я боялся ошибок.', ky: 'Ооба, бир аз. Мен көп немисче сүйлөшүм керек болчу жана ката кетирүүдөн корктум.' },
      { speaker: 'Frau Keller', text: 'Und was war Ihr größter Erfolg in dieser Zeit?', ru: 'А что было вашим самым большим успехом за это время?', ky: 'Ал эми бул убакыттын ичинде эң чоң ийгилигиңиз эмне болду?' },
      { speaker: 'Tomás', text: 'Ich habe die Deutschprüfung bestanden, und ich bin sehr stolz.', ru: 'Я сдал экзамен по немецкому, и я очень горжусь.', ky: 'Мен немис тили боюнча сынактан өттүм жана абдан сыймыктанам.' },
      { speaker: 'Frau Keller', text: 'Herzlichen Glückwunsch! Haben Sie schon ein neues Ziel?', ru: 'Поздравляю! У вас уже есть новая цель?', ky: 'Куттуктайм! Сизде жаңы максат бар беле?' },
      { speaker: 'Tomás', text: 'Ja. Zuerst möchte ich noch besser Deutsch sprechen. Dann suche ich eine Wohnung mit Balkon.', ru: 'Да. Сначала я хочу ещё лучше говорить по-немецки. Потом буду искать квартиру с балконом.', ky: 'Ооба. Адегенде мен дагы жакшыраак немисче сүйлөгүм келет. Андан кийин балконлуу батир издейм.' },
    ],
    questions: [
      { q: 'Wo hat Tomás früher gearbeitet?', options: ['In einem Hotel in Madrid', 'Bei einer Firma in München', 'In einer Schule in Berlin'], answer: 0 },
      { q: 'Was hat Tomás zuerst gemacht?', options: ['Er hat ein Praktikum gemacht.', 'Er hat einen Sprachkurs gemacht.', 'Er hat die Stelle in München bekommen.'], answer: 1 },
      { q: 'Was war im Praktikum schwierig?', options: ['Er hatte zu wenig Arbeit.', 'Er konnte nicht pünktlich kommen.', 'Er musste viel Deutsch sprechen.'], answer: 2 },
      { q: 'Was hat Tomás geschafft?', options: ['Er hat eine Wohnung mit Balkon gefunden.', 'Er hat die Deutschprüfung bestanden.', 'Er hat ein Hotel in Madrid eröffnet.'], answer: 1 },
    ],
    keywords: ['früher', 'zuerst', 'danach', 'stolz', 'Ziel'],
    source: UNIT_11_SOURCE,
  },
]

/** Unit 11 (pilot, unchanged) followed by Unit 12 (Stage 7C). */
export const A2_LISTENING: ListeningExercise[] = [...UNIT_11_A2_LISTENING, ...UNIT_12_LISTENING, ...UNIT_13_LISTENING, ...UNIT_14_LISTENING, ...UNIT_15_LISTENING, ...UNIT_16_LISTENING, ...UNIT_17_LISTENING, ...UNIT_18_LISTENING, ...UNIT_19_LISTENING, ...UNIT_20_LISTENING]
