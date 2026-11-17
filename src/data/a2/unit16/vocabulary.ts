import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 16 vocabulary — Freizeit, Medien und Kultur (Stage 7G). 36 items, exactly the approved Stage 7B vocabulary map:
 * 33 productive, 3 receptive (`UNIT_16_RECEPTIVE_WORDS`). Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted
 * first draft for native review (uncertain terms: docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md, §9). Leisure and culture are glossed as GERMAN-context
 * items (neutral scenes). Many media / culture words are loans that are identical in Russian and Kyrgyz: where the Kyrgyz would equal the Russian a short
 * bracket explains the word (the SAME_AS_RU allow-list is not used).
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb · a adjective · o other
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Hobbys und Sport
  ['das', 'Hobby', 'Hobbys', 'хобби', 'хобби (бош убакытта жасаган сүйүктүү иш)', 'Ich habe ein neues Hobby.', 'У меня новое хобби.', 'Менин жаңы хоббим бар.'],
  ['der', 'Verein', 'Vereine', 'клуб, объединение (спортивное, по интересам)', 'уюм, клуб (спорт же кызыкчылык боюнча)', 'Mein Bruder spielt im Verein Fußball.', 'Мой брат играет в футбол в клубе.', 'Менин агам клубда футбол ойнойт.'],
  ['v', 'schwimmen', '', 'плавать', 'сүзүү', 'Ich schwimme jeden Dienstag.', 'Я плаваю каждый вторник.', 'Мен ар шейшемби күнү сүзөм.'],
  ['v', 'wandern', '', 'ходить в поход, гулять пешком по природе', 'табиятта жөө жүрүү', 'Am Sonntag wandern wir zwei Stunden.', 'В воскресенье мы гуляем пешком два часа.', 'Жекшемби күнү биз эки саат жөө жүрөбүз.'],
  ['v', 'tanzen', '', 'танцевать', 'бийлөө', 'Meine Schwester tanzt gern.', 'Моя сестра любит танцевать.', 'Менин эжем бийлегенди жакшы көрөт.'],
  ['v', 'malen', '', 'рисовать, писать красками', 'сүрөт тартуу', 'Mein Sohn malt ein Bild.', 'Мой сын рисует картину.', 'Менин уулум сүрөт тартып жатат.'],
  ['v', 'fotografieren', '', 'фотографировать', 'сүрөткө тартуу', 'Am Wochenende fotografiere ich viel.', 'На выходных я много фотографирую.', 'Дем алыш күндөрү мен көп сүрөткө тартам.'],
  ['v', 'joggen', '', 'бегать трусцой', 'ден соолук үчүн жай чуркоо', 'Ich jogge dreimal in der Woche.', 'Я бегаю трусцой три раза в неделю.', 'Мен жумасына үч жолу жай чуркайм.'],
  ['das', 'Training', 'Trainings', 'тренировка', 'машыгуу (сабак)', 'Das Training beginnt um 18 Uhr.', 'Тренировка начинается в 18 часов.', 'Машыгуу саат 18де башталат.'],
  ['die', 'Mannschaft', 'Mannschaften', 'команда (спортивная)', 'команда (спорттук)', 'Unsere Mannschaft spielt am Samstag.', 'Наша команда играет в субботу.', 'Биздин команда ишемби күнү ойнойт.'],
  // Medien
  ['das', 'Internet', '', 'интернет', 'интернет (дүйнөлүк тармак)', 'Ich lese die Nachrichten im Internet.', 'Я читаю новости в интернете.', 'Мен жаңылыктарды интернеттен окуйм.'],
  ['das', 'Handy', 'Handys', 'мобильный телефон', 'уюлдук телефон', 'Mein Handy liegt auf dem Tisch.', 'Мой мобильный лежит на столе.', 'Менин уюлдук телефоном столдун үстүндө жатат.'],
  ['die', 'Nachricht', 'Nachrichten', 'сообщение; новость', 'билдирүү; жаңылык', 'Ich schreibe dir eine Nachricht.', 'Я напишу тебе сообщение.', 'Мен сага билдирүү жазам.'],
  ['die', 'Zeitung', 'Zeitungen', 'газета', 'гезит', 'Mein Opa liest jeden Morgen die Zeitung.', 'Мой дедушка каждое утро читает газету.', 'Менин чоң атам ар эртең менен гезит окуйт.'],
  ['die', 'Zeitschrift', 'Zeitschriften', 'журнал', 'журнал (мезгилдүү басылма)', 'Diese Zeitschrift kommt jede Woche.', 'Этот журнал выходит каждую неделю.', 'Бул журнал ар жума чыгат.'],
  ['die', 'Sendung', 'Sendungen', 'передача', 'берүү (радио же телевизордогу)', 'Die Sendung beginnt um 20 Uhr.', 'Передача начинается в 20 часов.', 'Берүү саат 20да башталат.'],
  ['der', 'Fernseher', 'Fernseher', 'телевизор', 'телевизор (көрсөткүч аппарат)', 'Der Fernseher ist im Wohnzimmer.', 'Телевизор стоит в гостиной.', 'Телевизор конок бөлмөдө турат.'],
  ['die', 'App', 'Apps', 'приложение (на телефоне)', 'тиркеме (телефондогу)', 'Ich habe eine App für Deutsch.', 'У меня есть приложение для немецкого.', 'Менде немис тили үчүн тиркеме бар.'],
  ['das', 'Foto', 'Fotos', 'фотография', 'сүрөт (фотосүрөт)', 'Ich mache ein Foto von dir.', 'Я сделаю твою фотографию.', 'Мен сенин сүрөтүңдү тартам.'],
  ['v', 'herunterladen', '', 'скачивать', 'жүктөп алуу', 'Ich lade die App herunter.', 'Я скачиваю приложение.', 'Мен тиркемени жүктөп алам.'],
  ['o', 'online', '', 'онлайн, через интернет', 'интернет аркылуу', 'Die Karten gibt es auch online.', 'Билеты есть и онлайн.', 'Билеттер интернеттен да бар.'],
  // Kultur und Veranstaltungen
  ['das', 'Kino', 'Kinos', 'кинотеатр, кино', 'кинотеатр', 'Am Freitag gehe ich ins Kino.', 'В пятницу я иду в кино.', 'Жума күнү мен кинотеатрга барам.'],
  ['das', 'Theater', 'Theater', 'театр', 'театр (оюн коюлуучу жай)', 'Wir gehen am Samstag ins Theater.', 'В субботу мы идём в театр.', 'Ишемби күнү биз театрга барабыз.'],
  ['das', 'Museum', 'Museen', 'музей', 'музей (тарыхый жана көркөм буюмдар коюлган жай)', 'Am Sonntag besuchen wir das Museum.', 'В воскресенье мы идём в музей.', 'Жекшемби күнү биз музейге барабыз.'],
  ['die', 'Ausstellung', 'Ausstellungen', 'выставка', 'көргөзмө', 'Die Ausstellung dauert drei Wochen.', 'Выставка длится три недели.', 'Көргөзмө үч жума созулат.'],
  ['das', 'Konzert', 'Konzerte', 'концерт', 'концерт (музыкалык кече)', 'Das Konzert beginnt um 20 Uhr.', 'Концерт начинается в 20 часов.', 'Концерт саат 20да башталат.'],
  ['das', 'Fest', 'Feste', 'праздник, гуляние', 'майрам, той-оюн', 'Im Sommer gibt es ein Fest im Park.', 'Летом в парке бывает праздник.', 'Жайында паркта майрам болот.'],
  ['der', 'Feiertag', 'Feiertage', 'праздничный выходной день', 'майрамдык дем алыш күнү', 'Der 3. Oktober ist ein Feiertag.', '3 октября — праздничный выходной.', '3-октябрь — майрамдык дем алыш күнү.'],
  ['die', 'Eintrittskarte', 'Eintrittskarten', 'входной билет', 'кирүү билети', 'Eine Eintrittskarte kostet zehn Euro.', 'Входной билет стоит десять евро.', 'Бир кирүү билети он евро турат.'],
  ['die', 'Veranstaltung', 'Veranstaltungen', 'мероприятие', 'иш-чара', 'Die Veranstaltung ist am Samstag.', 'Мероприятие — в субботу.', 'Иш-чара ишемби күнү болот.'],
  // Meinung und Vorlieben
  ['a', 'langweilig', '', 'скучный', 'зеригүүчү, кызыксыз', 'Der Film war leider langweilig.', 'Фильм, к сожалению, был скучным.', 'Тасма, тилекке каршы, зеригүүчү экен.'],
  ['a', 'spannend', '', 'захватывающий, напряжённый', 'толкундантуучу, кызыктуу', 'Das Buch ist sehr spannend.', 'Книга очень захватывающая.', 'Китеп абдан толкундантуучу.'],
  ['a', 'interessant', '', 'интересный (содержательный)', 'кызыктуу (маани-мазмундуу)', 'Die Ausstellung war sehr interessant.', 'Выставка была очень интересной.', 'Көргөзмө абдан маани-мазмундуу болду.'],
  ['v', 'sich interessieren', '', 'интересоваться (чем-то)', 'кызыгуу', 'Ich interessiere mich für Sport.', 'Я интересуюсь спортом.', 'Мен спортко кызыгам.'],
  ['v', 'sich freuen', '', 'радоваться', 'кубануу', 'Ich freue mich auf das Wochenende.', 'Я радуюсь предстоящим выходным.', 'Мен дем алыш күндөрүнө кубанып жатам.'],
  ['v', 'warten', '', 'ждать', 'күтүү', 'Ich warte auf den Bus.', 'Я жду автобус.', 'Мен автобусту күтүп жатам.'],
]

const posOf = (k: string): PartOfSpeech => (k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : k === 'a' ? 'adj' : 'other')

/** Unit 16 words that are RECOGNITION vocabulary: understood in texts and options, never required in a gap, speaking keyword or writing requirement. */
export const UNIT_16_RECEPTIVE_WORDS: readonly string[] = ['Mannschaft', 'herunterladen', 'online']

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v16-${i + 1}`,
    unit: 16,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in Units 11–15. */
export const UNIT_16_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
