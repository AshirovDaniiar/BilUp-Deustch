import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 18 vocabulary — Reisen, Urlaub und Mobilität (Stage 7I). 39 items, exactly the approved Stage 7B vocabulary map:
 * 33 productive, 6 receptive (`UNIT_18_RECEPTIVE_WORDS`). Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted
 * first draft for native review (uncertain terms: docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md, §11). Neutral European travel scenes; border, customs and
 * driving-licence words are glossed as German-context items. No artificial brackets: where both languages would use the same loan word, each gloss gives
 * its own natural wording, so no pair is identical. Example sentences use no adjective after a Dativ preposition and no adjective without an article.
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Reise planen
  ['v', 'buchen', '', 'бронировать, заказывать', 'брондоо, буйрутма берүү', 'Ich buche die Reise im Internet.', 'Я бронирую поездку в интернете.', 'Мен саякатты интернеттен брондойм.'],
  ['die', 'Buchung', 'Buchungen', 'бронирование, заказ', 'брондоо, буйрутма', 'Die Buchung ist bis Freitag möglich.', 'Бронирование возможно до пятницы.', 'Брондоо жумага чейин мүмкүн.'],
  ['das', 'Reisebüro', 'Reisebüros', 'туристическое агентство', 'саякат агенттиги', 'Im Reisebüro gibt es viele Prospekte.', 'В туристическом агентстве много проспектов.', 'Саякат агенттигинде жарнама китепчелери көп.'],
  ['die', 'Unterkunft', 'Unterkünfte', 'жильё на время поездки', 'убактылуу жайгашуучу жер', 'Die Unterkunft liegt direkt am Strand.', 'Жильё находится прямо на пляже.', 'Жайгашуучу жер дал деңиз жээгинде.'],
  ['die', 'Übernachtung', 'Übernachtungen', 'ночёвка, ночь в гостинице', 'түнөө, бир түн', 'Eine Übernachtung kostet 40 Euro.', 'Одна ночь стоит 40 евро.', 'Бир түнөө 40 евро турат.'],
  ['die', 'Jugendherberge', 'Jugendherbergen', 'молодёжный хостел (недорогое жильё для путешественников)', 'жаштар мейманканасы (арзан түнөө жай)', 'Die Jugendherberge ist günstig.', 'Молодёжный хостел недорогой.', 'Жаштар мейманканасы арзан.'],
  ['die', 'Ferienwohnung', 'Ferienwohnungen', 'квартира для отдыха', 'эс алуу үчүн батир', 'Wir mieten eine Ferienwohnung am Meer.', 'Мы снимаем квартиру для отдыха у моря.', 'Биз деңиз жээгинен эс алуу үчүн батир ижарага алабыз.'],
  ['der', 'Prospekt', 'Prospekte', 'проспект, рекламный буклет', 'жарнама китепчеси', 'Im Prospekt steht der Preis.', 'В проспекте указана цена.', 'Жарнама китепчесинде баасы жазылган.'],
  ['die', 'Reiseversicherung', 'Reiseversicherungen', 'туристическая страховка', 'саякат сактандыруусу', 'Die Reiseversicherung kostet zehn Euro.', 'Туристическая страховка стоит десять евро.', 'Саякат сактандыруусу он евро турат.'],
  // Unterwegs
  ['das', 'Ticket', 'Tickets', 'билет (на транспорт)', 'жол билети', 'Ich kaufe ein Ticket nach Berlin.', 'Я покупаю билет до Берлина.', 'Мен Берлинге жол билетин сатып алам.'],
  ['der', 'Fahrplan', 'Fahrpläne', 'расписание движения', 'каттам графиги', 'Der Fahrplan hängt am Bahnhof.', 'Расписание висит на вокзале.', 'Каттам графиги вокзалда илинип турат.'],
  ['der', 'Bahnsteig', 'Bahnsteige', 'платформа (на вокзале)', 'перрон', 'Der Zug fährt von Bahnsteig fünf ab.', 'Поезд отправляется с платформы пять.', 'Поезд бешинчи перрондон жөнөйт.'],
  ['das', 'Gepäck', '', 'багаж', 'саякаттагы жүк', 'Mein Gepäck ist schwer.', 'Мой багаж тяжёлый.', 'Менин жүгүм оор.'],
  ['die', 'Autobahn', 'Autobahnen', 'автобан, скоростное шоссе', 'ылдам жүрүүчү автожол', 'Wir fahren auf der Autobahn nach München.', 'Мы едем по автобану в Мюнхен.', 'Биз ылдам жүрүүчү автожол менен Мюнхенге барабыз.'],
  ['v', 'tanken', '', 'заправляться, заправлять машину', 'бензин куюу', 'Wir müssen noch tanken.', 'Нам ещё нужно заправиться.', 'Биз дагы бензин куюшубуз керек.'],
  ['die', 'Tankstelle', 'Tankstellen', 'заправочная станция', 'май куючу жай', 'Dort ist eine Tankstelle.', 'Там заправка.', 'Ал жерде май куючу жай бар.'],
  ['der', 'Stau', 'Staus', 'пробка (на дороге)', 'тыгын', 'Auf der Autobahn gibt es einen Stau.', 'На автобане пробка.', 'Автожолдо тыгын бар.'],
  ['der', 'Führerschein', 'Führerscheine', 'водительские права', 'айдоочулук күбөлүк', 'Ich mache den Führerschein.', 'Я получаю водительские права.', 'Мен айдоочулук күбөлүк алуу үчүн окуп жатам.'],
  ['der', 'Zoll', '', 'таможня', 'бажы', 'Am Zoll müssen wir warten.', 'На таможне нам нужно подождать.', 'Бажыда биз күтүшүбүз керек.'],
  ['die', 'Fähre', 'Fähren', 'паром', 'суудан өтүүчү кеме', 'Die Fähre fährt um zehn Uhr.', 'Паром отходит в десять часов.', 'Суудан өтүүчү кеме саат он да жөнөйт.'],
  // Urlaub und Natur
  ['der', 'Strand', 'Strände', 'пляж', 'деңиз жээги', 'Am Strand liegen viele Leute.', 'На пляже лежит много людей.', 'Деңиз жээгинде көп адам жатат.'],
  ['das', 'Meer', 'Meere', 'море', 'деңиз', 'Wir fahren im Sommer ans Meer.', 'Летом мы едем к морю.', 'Жайында биз деңизге барабыз.'],
  ['der', 'Berg', 'Berge', 'гора', 'тоо', 'Im Winter fahren wir in die Berge.', 'Зимой мы едем в горы.', 'Кышында биз тоого барабыз.'],
  ['der', 'See', 'Seen', 'озеро', 'көл', 'Wir schwimmen im See.', 'Мы плаваем в озере.', 'Биз көлдө сүзөбүз.'],
  ['die', 'Sonne', '', 'солнце', 'асмандагы күн', 'Die Sonne scheint heute.', 'Сегодня светит солнце.', 'Бүгүн күн жаркырап турат.'],
  ['der', 'Regen', '', 'дождь', 'жамгыр', 'Bei Regen bleiben wir im Hotel.', 'В дождь мы остаёмся в гостинице.', 'Жамгыр жааганда биз мейманканада калабыз.'],
  ['der', 'Schnee', '', 'снег', 'кар', 'Im Winter gibt es Schnee.', 'Зимой бывает снег.', 'Кышында кар болот.'],
  ['der', 'Wind', 'Winde', 'ветер', 'шамал', 'Heute gibt es viel Wind.', 'Сегодня сильный ветер.', 'Бүгүн шамал катуу.'],
  ['das', 'Wetter', '', 'погода', 'аба ырайы', 'Das Wetter ist heute schön.', 'Сегодня хорошая погода.', 'Бүгүн аба ырайы жакшы.'],
  ['der', 'Wald', 'Wälder', 'лес', 'токой', 'Wir gehen im Wald spazieren.', 'Мы гуляем в лесу.', 'Биз токойдо сейилдейбиз.'],
  ['die', 'Wettervorhersage', 'Wettervorhersagen', 'прогноз погоды', 'аба ырайынын божомолу', 'Die Wettervorhersage sagt Regen.', 'Прогноз погоды обещает дождь.', 'Аба ырайынын божомолу жамгыр деп айтат.'],
  // Orte, Jahreszeiten, Aktivitäten
  ['das', 'Ausland', '', 'заграница, другая страна', 'чет өлкө', 'Im Ausland brauche ich oft einen Pass.', 'За границей мне часто нужен паспорт.', 'Чет өлкөдө мага көп учурда паспорт керек.'],
  ['der', 'Sommer', 'Sommer', 'лето', 'жай', 'Im Sommer fahre ich nach Italien.', 'Летом я еду в Италию.', 'Жайында мен Италияга барам.'],
  ['der', 'Winter', 'Winter', 'зима', 'кыш', 'Im Winter ist es kalt.', 'Зимой холодно.', 'Кышында суук.'],
  ['der', 'Ausflug', 'Ausflüge', 'экскурсия, поездка на один день', 'саякат, бир күндүк сейилдөө', 'Am Sonntag machen wir einen Ausflug.', 'В воскресенье мы едем на экскурсию.', 'Жекшемби күнү биз бир күндүк сейилдөөгө барабыз.'],
  ['v', 'besichtigen', '', 'осматривать (достопримечательности)', 'кыдырып көрүү', 'Wir besichtigen die Stadt.', 'Мы осматриваем город.', 'Биз шаарды кыдырып көрөбүз.'],
  ['die', 'Sehenswürdigkeit', 'Sehenswürdigkeiten', 'достопримечательность', 'көрүүгө арзырлык жер', 'Die Stadt hat viele Sehenswürdigkeiten.', 'В городе много достопримечательностей.', 'Шаарда көрүүгө арзырлык жерлер көп.'],
  ['v', 'sich erholen', '', 'отдыхать, восстанавливать силы', 'эс алып күч алуу', 'Im Urlaub erhole ich mich gut.', 'В отпуске я хорошо отдыхаю.', 'Эс алууда мен жакшы күч алам.'],
  ['die', 'Grenze', 'Grenzen', 'граница (между странами)', 'чек ара', 'Die Grenze ist nicht weit.', 'Граница недалеко.', 'Чек ара алыс эмес.'],
]

const posOf = (k: string): PartOfSpeech => (k === 'der' || k === 'die' || k === 'das' ? 'noun' : 'verb')

/** Unit 18 words that are RECOGNITION vocabulary: understood in texts and options, never required in a gap, speaking keyword or writing requirement. */
export const UNIT_18_RECEPTIVE_WORDS: readonly string[] = ['Prospekt', 'Reiseversicherung', 'Zoll', 'Fähre', 'Wettervorhersage', 'Grenze']

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v18-${i + 1}`,
    unit: 18,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in Units 11–17. */
export const UNIT_18_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
