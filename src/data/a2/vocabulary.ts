import type { Article, PartOfSpeech, VocabularyItem } from '../types'
import { UNIT_12_VOCABULARY } from './unit12/vocabulary'
import { UNIT_13_VOCABULARY } from './unit13/vocabulary'
import { UNIT_14_VOCABULARY } from './unit14/vocabulary'
import { UNIT_15_VOCABULARY } from './unit15/vocabulary'
import { UNIT_16_VOCABULARY } from './unit16/vocabulary'
import { UNIT_17_VOCABULARY } from './unit17/vocabulary'
import { UNIT_18_VOCABULARY } from './unit18/vocabulary'
import { UNIT_19_VOCABULARY } from './unit19/vocabulary'
import { UNIT_20_VOCABULARY } from './unit20/vocabulary'

/**
 * A2 vocabulary (ids `v<unit>-<n>`, units 11–20). Unit 11 is the pilot unit "Über mich und meine Erfahrungen".
 *
 * Compact authoring format → expanded into VocabularyItem (Russian, Kyrgyz and the example translations are all authored
 * separately; nothing is derived from another language).
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]
 * kind: der|die|das (noun) · v verb · a adjective · p phrase · o other
 * `related` = thematic neighbours inside the same unit (previous, next, next-but-one), as in A1.
 * Kyrgyz glosses and example translations are an AI-assisted first draft and need a native-speaker review (see the unit review report).
 */
type Row = [string, string, string, string, string, string, string, string]

const UNIT_11: Row[] = [
  // Erfahrungen und Lebensweg
  ['die', 'Erfahrung', 'Erfahrungen', 'опыт', 'тажрыйба', 'Ich habe viel Erfahrung als Verkäufer.', 'У меня большой опыт работы продавцом.', 'Менин сатуучу катары иштеген тажрыйбам көп.'],
  ['das', 'Erlebnis', 'Erlebnisse', 'событие, яркое впечатление', 'башынан өткөргөн окуя', 'Die Reise war ein tolles Erlebnis.', 'Поездка была замечательным впечатлением.', 'Бул саякат укмуштуудай эсте каларлык окуя болду.'],
  ['die', 'Ausbildung', 'Ausbildungen', 'профессиональное обучение', 'кесиптик окуу', 'Nach der Schule habe ich eine Ausbildung gemacht.', 'После школы я прошёл профессиональное обучение.', 'Мектептен кийин мен кесиптик окуудан өттүм.'],
  ['der', 'Abschluss', 'Abschlüsse', 'окончание учёбы, диплом', 'окууну аяктоо, диплом', 'Mit dem Abschluss finde ich leichter eine Stelle.', 'С дипломом мне легче найти работу.', 'Диплом менен жумуш табуу мага жеңилирээк.'],
  ['die', 'Prüfung', 'Prüfungen', 'экзамен', 'сынак', 'Die Prüfung war schwer, aber ich habe sie bestanden.', 'Экзамен был трудным, но я его сдал.', 'Сынак оор болду, бирок мен аны ийгиликтүү тапшырдым.'],
  ['das', 'Praktikum', 'Praktika', 'стажировка', 'практика', 'Ich mache ein Praktikum in einem Hotel.', 'Я прохожу стажировку в гостинице.', 'Мен мейманканада практикадан өтүп жатам.'],
  ['die', 'Stelle', 'Stellen', 'должность, рабочее место', 'жумуш орду', 'Ich habe eine neue Stelle gefunden.', 'Я нашёл новую работу.', 'Мен жаңы жумуш орду таптым.'],
  ['der', 'Umzug', 'Umzüge', 'переезд', 'көчүү', 'Nach dem Umzug war alles neu.', 'После переезда всё было новым.', 'Көчүп барганыбыздан кийин баары жаңы болду.'],
  ['die', 'Heimat', '', 'родина, родные места', 'мекен, туулуп өскөн жер', 'Ich vermisse meine Heimat manchmal.', 'Иногда я скучаю по родине.', 'Кээде мекенимди сагынам.'],
  ['der', 'Traum', 'Träume', 'мечта', 'арман', 'Mein Traum ist ein eigenes Café.', 'Моя мечта — своё кафе.', 'Менин арманым — өзүмдүн кафем.'],
  ['das', 'Ziel', 'Ziele', 'цель', 'максат', 'Mein Ziel ist ein guter Abschluss.', 'Моя цель — хороший диплом.', 'Менин максатым — дипломду жакшы бүтүрүү.'],
  ['der', 'Erfolg', 'Erfolge', 'успех', 'ийгилик', 'Der Kurs war ein großer Erfolg.', 'Курс имел большой успех.', 'Курс чоң ийгилик болду.'],
  ['die', 'Veränderung', 'Veränderungen', 'изменение, перемена', 'өзгөрүү', 'Die Veränderung war am Anfang schwer.', 'Перемена вначале была трудной.', 'Өзгөрүү башында оор болду.'],
  // Verben für Erlebtes
  ['v', 'erleben', '', 'пережить, испытать', 'башынан өткөрүү', 'In Berlin habe ich viel erlebt.', 'В Берлине я многое пережил.', 'Берлинде мен көп нерсени башымдан өткөрдүм.'],
  ['v', 'abschließen', '', 'завершить, закончить', 'аягына чыгаруу, бүтүрүү', 'Ich habe meine Ausbildung abgeschlossen.', 'Я закончил своё профессиональное обучение.', 'Мен кесиптик окуумду бүтүрдүм.'],
  ['v', 'umziehen', '', 'переезжать', 'көчүп кетүү', 'Wir sind vor einem Jahr umgezogen.', 'Мы переехали год назад.', 'Биз бир жыл мурун көчүп кеттик.'],
  ['v', 'aufwachsen', '', 'вырасти, провести детство', 'чоңоюу, өсүү', 'Ich bin in Osch aufgewachsen.', 'Я вырос в Оше.', 'Мен Ошто чоңойдум.'],
  ['v', 'sich verändern', '', 'измениться', 'өзгөрүп кетүү', 'Mein Leben hat sich verändert.', 'Моя жизнь изменилась.', 'Менин жашоом өзгөрдү.'],
  ['v', 'sich entscheiden', '', 'решиться, принять решение', 'чечим кабыл алуу', 'Ich habe mich für ein Studium entschieden.', 'Я решил учиться в вузе.', 'Мен университетте окууну чечтим.'],
  ['v', 'gewinnen', '', 'выиграть, победить', 'жеңүү, утуу', 'Wir haben das Spiel gewonnen.', 'Мы выиграли игру.', 'Биз оюнда жеңдик.'],
  ['v', 'bestehen', '', 'сдать (экзамен)', 'сынактан өтүү', 'Ich habe die Prüfung bestanden.', 'Я сдал экзамен.', 'Мен сынактан өттүм.'],
  ['v', 'erreichen', '', 'достичь', 'жетүү', 'Er hat sein Ziel erreicht.', 'Он достиг своей цели.', 'Ал максатына жетти.'],
  ['v', 'beginnen', '', 'начинать, начаться', 'баштоо', 'Mit 18 habe ich die Ausbildung begonnen.', 'В 18 лет я начал обучение.', '18 жашымда мен окууну баштадым.'],
  ['v', 'schaffen', '', 'справиться, суметь', 'аткара алуу, жөндөө', 'Ich habe es geschafft!', 'У меня получилось!', 'Мен аткара алдым!'],
  // Bewertung und Zeit
  ['a', 'erfolgreich', '', 'успешный', 'ийгиликтүү', 'Sie ist eine erfolgreiche Köchin.', 'Она успешный повар.', 'Ал ийгиликтүү ашпозчу.'],
  ['a', 'stolz', '', 'гордый', 'сыймыктанган', 'Ich bin stolz auf meine Schwester.', 'Я горжусь своей сестрой.', 'Мен эжем менен сыймыктанам.'],
  ['o', 'früher', '', 'раньше', 'мурда', 'Früher habe ich in Osch gewohnt.', 'Раньше я жил в Оше.', 'Мурда мен Ошто жашаган элем.'],
  ['o', 'damals', '', 'тогда, в то время', 'ал кезде', 'Damals war ich noch Student.', 'Тогда я ещё был студентом.', 'Ал кезде мен али студент элем.'],
  ['o', 'zuerst', '', 'сначала', 'адегенде', 'Zuerst habe ich Deutsch gelernt.', 'Сначала я учил немецкий.', 'Адегенде мен немис тилин үйрөндүм.'],
  ['o', 'danach', '', 'после этого', 'андан кийин', 'Danach habe ich Arbeit gesucht.', 'После этого я искал работу.', 'Андан кийин мен жумуш издедим.'],
  ['o', 'schließlich', '', 'в конце концов', 'акыры, акырында', 'Schließlich habe ich die Stelle bekommen.', 'В конце концов я получил это место.', 'Акырында мен ал жумуш ордун алдым.'],
  // Wendungen
  ['p', 'Erfahrungen sammeln', '', 'набираться опыта', 'тажрыйба топтоо', 'Im Ausland kann man viele Erfahrungen sammeln.', 'За границей можно набраться много опыта.', 'Чет өлкөдө көп тажрыйба топтоого болот.'],
  ['p', 'geboren sein', '', 'родиться', 'туулган болуу', 'Ich bin 1999 in Karakol geboren.', 'Я родился в 1999 году в Караколе.', 'Мен 1999-жылы Каракол шаарында туулганмын.'],
  ['p', 'noch nie', '', 'ещё никогда', 'эч качан', 'Ich habe noch nie Sushi gegessen.', 'Я никогда не ел суши.', 'Мен эч качан суши жеген эмесмин.'],
  ['p', 'schon einmal', '', 'уже когда-либо, уже раз', 'мурда бир жолу', 'Hast du schon einmal im Ausland gelebt?', 'Ты когда-нибудь жил за границей?', 'Сен мурда чет өлкөдө жашап көрдүң беле?'],
  ['p', 'vor zwei Jahren', '', 'два года назад', 'эки жыл мурун', 'Vor zwei Jahren bin ich umgezogen.', 'Два года назад я переехал.', 'Эки жыл мурун мен көчүп кеттим.'],
  ['o', 'seit', '', 'с (какого-то времени), уже (о длительности)', 'бери (…дан/…ден бери)', 'Ich lerne seit einem Jahr Deutsch.', 'Я учу немецкий уже год.', 'Мен немис тилин бир жылдан бери үйрөнүп жатам.'],
]

const posOf = (k: string): PartOfSpeech =>
  k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : k === 'a' ? 'adj' : k === 'p' ? 'phrase' : 'other'

const expand = (unit: number, rows: Row[]): VocabularyItem[] => {
  const base = rows.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i): VocabularyItem => {
    const pos = posOf(kind)
    return {
      id: `v${unit}-${i + 1}`,
      unit,
      pos,
      article: pos === 'noun' ? (kind as Article) : undefined,
      de,
      plural: plural || undefined,
      ru,
      ky,
      example,
      exampleRu,
      exampleKy,
      related: [],
    }
  })
  return base.map((v, i) => ({ ...v, related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id) }))
}

/** A2 vocabulary (ids `v<unit>-<n>`, units 11–20). Only unit 11 is authored so far. */
export const A2_VOCABULARY: VocabularyItem[] = [...expand(11, UNIT_11), ...UNIT_12_VOCABULARY, ...UNIT_13_VOCABULARY, ...UNIT_14_VOCABULARY, ...UNIT_15_VOCABULARY, ...UNIT_16_VOCABULARY, ...UNIT_17_VOCABULARY, ...UNIT_18_VOCABULARY, ...UNIT_19_VOCABULARY, ...UNIT_20_VOCABULARY]

/**
 * Unit 11 words that are RECOGNITION vocabulary (Stage 7A.2, decision F4): the learner must understand them in texts, glosses and
 * answer options, but no task REQUIRES producing them — no fill-in gap, writing requirement or speaking keyword depends on them.
 * (The data model has no "receptive" field; this list is the record, and a test enforces the rule.)
 */
export const UNIT_11_RECEPTIVE_WORDS: readonly string[] = [
  'Abschluss',
  'Veränderung',
  'sich verändern',
  'Erlebnis',
  'Heimat',
  'erreichen',
  'schaffen',
  'abschließen',
  'sich entscheiden',
]
