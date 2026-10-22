import { VOCABULARY } from './vocabulary'
import type { Exercise, L10n } from './types'

let n = 0
const id = () => `ex${String(++n).padStart(3, '0')}`
const w = (ru: string, ky?: string): L10n => ({ ru, ky })

const fill = (unit: number, concept: string, prompt: string, answer: string, options: string[], why: string, promptRu?: string): Exercise =>
  ({ id: id(), type: 'fill', unit, concept, prompt, promptRu, answer, options, why: w(why) })
const choice = (unit: number, concept: string, prompt: string, answer: string, options: string[], why: string, promptRu?: string): Exercise =>
  ({ id: id(), type: 'choice', unit, concept, prompt, promptRu, answer, options, why: w(why) })
const order = (unit: number, concept: string, sentence: string, why: string, promptRu?: string): Exercise => {
  const words = sentence.split(' ')
  return { id: id(), type: 'order', unit, concept, prompt: 'Составьте предложение', promptRu, answer: sentence, words: [...words].reverse(), why: w(why) }
}

const handwritten: Exercise[] = [
  // Unit 1
  fill(1, 'articles', '___ Bahnhof ist groß.', 'der', ['der', 'die', 'das'], 'Bahnhof — мужской род: der Bahnhof.', 'Вокзал большой.'),
  choice(1, 'sein-haben', 'Как сказать «Мне 25 лет»?', 'Ich bin 25 Jahre alt.', ['Ich bin 25 Jahre alt.', 'Ich habe 25 Jahre alt.', 'Ich habe 25 Jahre.'], 'Возраст — состояние: sein, а не haben.'),
  fill(1, 'sein-haben', 'Wir ___ aus Kirgisistan.', 'sind', ['sind', 'ist', 'bin'], 'wir → sind.', 'Мы родом из Кыргызстана.'),
  order(1, 'questions', 'Woher kommst du?', 'W-слово, затем глагол (2-е место), затем подлежащее.', 'Откуда ты?'),
  fill(1, 'questions', '___ wohnen Sie?', 'Wo', ['Wo', 'Wer', 'Was'], 'Спрашиваем о месте — Wo.', 'Где вы живёте?'),
  choice(1, 'questions', 'Какой вопрос — «да/нет»-вопрос?', 'Sprichst du Deutsch?', ['Sprichst du Deutsch?', 'Wie heißt du?', 'Woher kommst du?'], 'В вопросе «да/нет» нет W-слова — глагол стоит первым.'),
  fill(1, 'nominativ', 'Das ist ___ Lehrer.', 'ein', ['ein', 'einen', 'einem'], 'После sein — Nominativ: ein Lehrer.', 'Это учитель.'),
  fill(1, 'sein-haben', 'Du ___ müde.', 'bist', ['bist', 'ist', 'bin'], 'du → bist.', 'Ты устал.'),
  // Unit 2
  fill(2, 'plural', 'Ich habe zwei ___.', 'Brüder', ['Brüder', 'Bruder', 'Bruders'], 'der Bruder → die Brüder (умлаут + -).', 'У меня два брата.'),
  choice(2, 'plural', 'Множественное число от «das Kind»:', 'die Kinder', ['die Kinder', 'die Kinds', 'die Kindern'], 'Средний род часто берёт -er: das Kind → die Kinder.'),
  fill(2, 'possessive', 'Das ist ___ Mutter.', 'meine', ['meine', 'mein', 'meinen'], 'Женский род → meine.', 'Это моя мама.'),
  fill(2, 'possessive', 'Ich besuche ___ Bruder.', 'meinen', ['meinen', 'mein', 'meinem'], 'Прямое дополнение мужского рода → meinen.', 'Я навещаю моего брата.'),
  choice(2, 'plural', 'Множественное число от «die Frau»:', 'die Frauen', ['die Frauen', 'die Fraue', 'die Fräuer'], 'Женский род чаще берёт -(e)n.'),
  fill(2, 'sein-haben', 'Wie alt ___ deine Schwester?', 'ist', ['ist', 'bist', 'sind'], 'Подлежащее «deine Schwester» = sie → ist.', 'Сколько лет твоей сестре?'),
  order(2, 'verb-position', 'Meine Eltern wohnen in Bischkek.', 'Глагол — на втором месте после блока «Meine Eltern».', 'Мои родители живут в Бишкеке.'),
  // Unit 3
  fill(3, 'regular-verbs', 'Ich ___ jeden Tag Deutsch.', 'lerne', ['lerne', 'lernst', 'lernt'], 'ich → -e.', 'Я каждый день учу немецкий.'),
  fill(3, 'regular-verbs', 'Du ___ gut Deutsch.', 'sprichst', ['sprichst', 'sprechst', 'spricht'], 'sprechen: e → i в формах du и er/sie/es.', 'Ты хорошо говоришь по-немецки.'),
  order(3, 'verb-position', 'Heute lerne ich Deutsch.', 'Первое место — «Heute», глагол — второе, «ich» — после глагола.', 'Сегодня я учу немецкий.'),
  order(3, 'separable', 'Ich stehe um sieben Uhr auf.', 'Приставка auf уходит в конец предложения.', 'Я встаю в семь часов.'),
  choice(3, 'verb-position', 'Какой порядок слов верный?', 'Morgen fahre ich nach Köln.', ['Morgen fahre ich nach Köln.', 'Morgen ich fahre nach Köln.', 'Morgen nach Köln ich fahre.'], 'Глагол всегда на втором месте.'),
  fill(3, 'regular-verbs', 'Er ___ im Büro.', 'arbeitet', ['arbeitet', 'arbeitt', 'arbeite'], 'Основа на -t → добавляем -et: er arbeitet.', 'Он работает в офисе.'),
  fill(3, 'separable', 'Wir kaufen am Samstag ___.', 'ein', ['ein', 'auf', 'an'], 'einkaufen → kaufen … ein.', 'Мы делаем покупки в субботу.'),
  // Unit 4
  fill(4, 'akkusativ', 'Ich möchte ___ Kaffee.', 'einen', ['einen', 'ein', 'einem'], 'Der Kaffee, прямое дополнение → einen.', 'Я хотел бы кофе.'),
  fill(4, 'negation', 'Ich esse ___ Fleisch.', 'kein', ['kein', 'keinen', 'nicht'], 'Das Fleisch — средний род, без артикля → kein.', 'Я не ем мясо.'),
  fill(4, 'modal', 'Ich möchte einen Kaffee ___.', 'bestellen', ['bestellen', 'bestelle', 'bestellt'], 'После модального глагола — инфинитив в конце.', 'Я хотел бы заказать кофе.'),
  order(4, 'modal', 'Ich möchte einen Tee bestellen.', 'möchte — на втором месте, bestellen — инфинитив в конце.', 'Я хотел бы заказать чай.'),
  fill(4, 'akkusativ', 'Ich nehme ___ Salat.', 'den', ['den', 'der', 'dem'], 'Der Salat в Akkusativ → den.', 'Я возьму салат.'),
  fill(4, 'negation', 'Ich arbeite heute ___.', 'nicht', ['nicht', 'kein', 'keine'], 'Отрицаем глагол → nicht.', 'Сегодня я не работаю.'),
  choice(4, 'negation', 'Ich habe ___ Hunger.', 'keinen', ['keinen', 'kein', 'keine'], 'Der Hunger — мужской род, Akkusativ → keinen.'),
  // Unit 5
  fill(5, 'wechsel', 'Ich bin in ___ Küche.', 'der', ['der', 'die', 'den'], 'Wo? → Dativ: in der Küche.', 'Я на кухне.'),
  fill(5, 'wechsel', 'Ich gehe in ___ Küche.', 'die', ['die', 'der', 'dem'], 'Wohin? → Akkusativ: in die Küche.', 'Я иду на кухню.'),
  fill(5, 'wechsel', 'Das Buch liegt auf ___ Tisch.', 'dem', ['dem', 'den', 'der'], 'liegen = Wo? → Dativ.', 'Книга лежит на столе.'),
  fill(5, 'wechsel', 'Ich lege das Buch auf ___ Tisch.', 'den', ['den', 'dem', 'der'], 'legen = Wohin? → Akkusativ.', 'Я кладу книгу на стол.'),
  choice(5, 'wechsel', 'Wir stellen die Lampe ___ Sofa. (куда?)', 'neben das', ['neben das', 'neben dem', 'neben der'], 'Wohin? → Akkusativ; das Sofa → das.'),
  order(5, 'verb-position', 'Das Sofa steht im Wohnzimmer.', 'Глагол — второй блок.', 'Диван стоит в гостиной.'),
  // Unit 6
  fill(6, 'conjunctions', 'Ich lerne Deutsch, ___ ich in Deutschland arbeite.', 'weil', ['weil', 'und', 'aber'], 'Причина → weil, глагол в конце.', 'Я учу немецкий, потому что работаю в Германии.'),
  order(6, 'conjunctions', 'Ich lerne Deutsch, weil ich hier arbeite.', 'После weil глагол arbeite — в самом конце.', 'Я учу немецкий, потому что работаю здесь.'),
  fill(6, 'conjunctions', 'Möchten Sie Kaffee ___ Tee?', 'oder', ['oder', 'aber', 'denn'], 'Выбор между двумя вещами → oder.', 'Хотите кофе или чай?'),
  fill(6, 'conjunctions', 'Ich suche Arbeit, ___ ich habe noch keine Erfahrung.', 'aber', ['aber', 'oder', 'und'], 'Противопоставление → aber.', 'Я ищу работу, но у меня пока нет опыта.'),
  choice(6, 'conjunctions', 'Какое предложение верное?', 'Ich bleibe zu Hause, weil ich krank bin.', ['Ich bleibe zu Hause, weil ich krank bin.', 'Ich bleibe zu Hause, weil ich bin krank.', 'Ich bleibe zu Hause, weil bin ich krank.'], 'После weil — глагол в конец.'),
  fill(6, 'dativ-prep', 'Ich arbeite ___ einer Firma.', 'bei', ['bei', 'nach', 'zu'], 'bei + Dativ: «работать в компании».', 'Я работаю в фирме.'),
  // Unit 7
  fill(7, 'dativ', 'Ich helfe ___ Frau.', 'der', ['der', 'die', 'den'], 'helfen + Dativ; die Frau → der Frau.', 'Я помогаю женщине.'),
  fill(7, 'dativ-prep', 'Ich fahre mit ___ Bus.', 'dem', ['dem', 'den', 'der'], 'mit + Dativ: der Bus → dem Bus.', 'Я еду на автобусе.'),
  fill(7, 'dativ-prep', 'Ich gehe ___ Arzt.', 'zum', ['zum', 'zur', 'beim'], 'zu + dem = zum (der Arzt).', 'Я иду к врачу.'),
  fill(7, 'dativ-prep', 'Ich gehe ___ Apotheke.', 'zur', ['zur', 'zum', 'bei'], 'zu + der = zur (die Apotheke).', 'Я иду в аптеку.'),
  fill(7, 'dativ', 'Die Jacke gefällt ___.', 'mir', ['mir', 'mich', 'ich'], 'gefallen + Dativ: mir.', 'Мне нравится куртка.'),
  fill(7, 'dativ-prep', 'Ich komme ___ Kirgisistan.', 'aus', ['aus', 'nach', 'bei'], 'Происхождение → aus + Dativ.', 'Я родом из Кыргызстана.'),
  order(7, 'dativ-prep', 'Ich fahre mit der U-Bahn.', 'mit + Dativ: die U-Bahn → der U-Bahn.', 'Я еду на метро.'),
  // Unit 8
  fill(8, 'time-order', 'Der Termin ist ___ Montag.', 'am', ['am', 'im', 'um'], 'Дни недели → am.', 'Приём в понедельник.'),
  fill(8, 'time-order', 'Der Kurs beginnt ___ 18 Uhr.', 'um', ['um', 'am', 'im'], 'Точное время → um.', 'Курс начинается в 18 часов.'),
  fill(8, 'time-order', '___ Juli fahre ich nach Hause.', 'Im', ['Im', 'Am', 'Um'], 'Месяцы → im.', 'В июле я еду домой.'),
  fill(8, 'perfekt', 'Gestern ___ ich Kaffee getrunken.', 'habe', ['habe', 'bin', 'hat'], 'trinken → Perfekt с haben.', 'Вчера я пил кофе.'),
  fill(8, 'perfekt', 'Ich ___ nach Berlin gefahren.', 'bin', ['bin', 'habe', 'hat'], 'fahren — движение → sein.', 'Я поехал в Берлин.'),
  order(8, 'perfekt', 'Ich habe Deutsch gelernt.', 'haben на 2-м месте, Partizip II — в конце.', 'Я учил немецкий.'),
  fill(8, 'perfekt', 'Ich habe Kaffee ___.', 'getrunken', ['getrunken', 'trinken', 'getrinkt'], 'Неправильный глагол: trinken → getrunken.', 'Я выпил кофе.'),
  // Unit 9
  fill(9, 'akk-prep', 'Das ist ein Geschenk ___ meinen Vater.', 'für', ['für', 'mit', 'zu'], 'für + Akkusativ: «для».', 'Это подарок для моего отца.'),
  fill(9, 'akk-prep', 'Ich trinke Kaffee ___ Zucker.', 'ohne', ['ohne', 'mit', 'für'], 'ohne + Akkusativ: «без».', 'Я пью кофе без сахара.'),
  fill(9, 'akk-prep', 'Das ist für ___.', 'mich', ['mich', 'mir', 'ich'], 'für + Akkusativ → mich.', 'Это для меня.'),
  order(9, 'verb-position', 'Wie viel kostet das?', 'W-вопрос: Wie viel, глагол, подлежащее.', 'Сколько это стоит?'),
  choice(9, 'questions', 'Как спросить о цене?', 'Wie viel kostet das?', ['Wie viel kostet das?', 'Wo kostet das?', 'Wann kostet das?'], 'Вопрос о количестве/цене — Wie viel.'),
  fill(9, 'akk-prep', 'Ich kaufe das für ___ Mutter.', 'meine', ['meine', 'meinen', 'mein'], 'Женский род после für → meine (без изменений).', 'Я покупаю это для моей мамы.'),
  // Unit 10
  fill(10, 'genitiv', 'Das ist das Auto ___ Mannes.', 'des', ['des', 'der', 'dem'], 'Genitiv мужского рода: des Mannes.', 'Это машина мужчины.'),
  fill(10, 'genitiv', 'Das ist die Tasche ___ Frau.', 'der', ['der', 'des', 'den'], 'Genitiv женского рода: der Frau.', 'Это сумка женщины.'),
  fill(10, 'separable', 'Der Zug kommt um 14 Uhr ___.', 'an', ['an', 'auf', 'ab'], 'ankommen → kommt … an.', 'Поезд прибывает в 14 часов.'),
  order(10, 'separable', 'Der Zug fährt um acht Uhr ab.', 'abfahren: fährt … ab.', 'Поезд отправляется в восемь часов.'),
  choice(10, 'genitiv', 'Как разговорно сказать «das Auto meines Vaters»?', 'das Auto von meinem Vater', ['das Auto von meinem Vater', 'das Auto von meines Vaters', 'das Auto meinem Vater'], 'В речи Genitiv часто заменяют на von + Dativ.'),
  choice(10, 'perfekt', 'Welcher Satz ist richtig?', 'Ich bin mit dem Zug gefahren.', ['Ich bin mit dem Zug gefahren.', 'Ich habe mit dem Zug gefahren.', 'Ich bin mit dem Zug fahren.'], 'fahren → Perfekt с sein + gefahren.'),
]

function articleHint(v: { de: string; article?: string }): string {
  const x = v.de.toLowerCase()
  if (/(ung|heit|keit|schaft)$/.test(x)) return ' Окончание -ung/-heit/-keit/-schaft → die.'
  if (/(chen|ment)$/.test(x)) return ' Окончание -chen/-ment → das.'
  return ' Учите слово вместе с артиклем.'
}

/** One "der/die/das?" drill per noun in the vocabulary – generated, not hand-authored. */
export const articleExercises: Exercise[] = VOCABULARY.filter(v => v.article).map(v => ({
  id: `art-${v.id}`,
  type: 'article',
  unit: v.unit,
  concept: 'articles',
  prompt: v.de,
  promptRu: v.ru,
  options: ['der', 'die', 'das'],
  answer: v.article as string,
  why: w(`${v.article} ${v.de} (мн. ч.: die ${v.plural ?? v.de}).${articleHint(v)}`),
}))

export const EXERCISES: Exercise[] = [...handwritten, ...articleExercises]
export const exerciseById = new Map(EXERCISES.map(e => [e.id, e]))
export const exercisesForUnit = (unit: number) => EXERCISES.filter(e => e.unit === unit)
export const exercisesForConcept = (concept: string) => handwritten.filter(e => e.concept === concept)
export const HANDWRITTEN_COUNT = handwritten.length
