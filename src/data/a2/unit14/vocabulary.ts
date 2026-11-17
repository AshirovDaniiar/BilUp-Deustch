import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 14 vocabulary — Gesundheit und Wohlbefinden (Stage 7E). 38 items, exactly the approved Stage 7B vocabulary map:
 * 34 productive, 4 receptive (`UNIT_14_RECEPTIVE_WORDS`). Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted
 * first draft for native review (uncertain terms: docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md, §7). Everyday health language only:
 * no diagnosis vocabulary, no dosage advice. Example sentences use no reflexive Dativ (*sich die Zähne putzen*), no ihr-imperative, no Konjunktiv II.
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb · a adjective
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Körper
  ['der', 'Kopf', 'Köpfe', 'голова', 'баш', 'Mein Kopf tut seit gestern weh.', 'У меня со вчерашнего дня болит голова.', 'Менин башым кечээден бери ооруп жатат.'],
  ['der', 'Hals', 'Hälse', 'горло, шея', 'тамак, моюн', 'Der Hals tut mir weh.', 'У меня болит горло.', 'Менин тамагым ооруп жатат.'],
  ['der', 'Rücken', 'Rücken', 'спина', 'бел, арка', 'Nach der Arbeit tut mein Rücken weh.', 'После работы у меня болит спина.', 'Жумуштан кийин менин белим ооруйт.'],
  ['der', 'Bauch', 'Bäuche', 'живот', 'курсак, ич', 'Nach dem Essen tut mein Bauch weh.', 'После еды у меня болит живот.', 'Тамактан кийин менин курсагым ооруйт.'],
  ['der', 'Arm', 'Arme', 'рука (от плеча до кисти)', 'кол (ийинден билекке чейин)', 'Ich kann den Arm nicht bewegen.', 'Я не могу двигать рукой.', 'Мен колумду кыймылдата албайм.'],
  ['das', 'Bein', 'Beine', 'нога (от бедра до ступни)', 'бут (жамбаштан таманга чейин)', 'Nach dem Sport tut mein Bein weh.', 'После спорта у меня болит нога.', 'Спорттон кийин менин бутум ооруйт.'],
  ['der', 'Fuß', 'Füße', 'ступня', 'бутунун таманы', 'Mein Fuß tut mir seit Montag weh.', 'У меня с понедельника болит ступня.', 'Бутумдун таманы дүйшөмбүдөн бери ооруйт.'],
  ['die', 'Hand', 'Hände', 'кисть руки', 'кол (манжа менен алакан)', 'Meine Hand ist sehr kalt.', 'Моя рука очень холодная.', 'Менин колум абдан муздак.'],
  ['das', 'Auge', 'Augen', 'глаз', 'көз', 'Das Auge ist rot.', 'Глаз красный.', 'Көз кызарып калган.'],
  ['das', 'Ohr', 'Ohren', 'ухо', 'кулак', 'Mein Ohr tut weh.', 'У меня болит ухо.', 'Менин кулагым ооруйт.'],
  ['der', 'Zahn', 'Zähne', 'зуб', 'тиш', 'Ich muss zum Arzt, mein Zahn tut sehr weh.', 'Мне нужно к врачу, у меня сильно болит зуб.', 'Мен дарыгерге барышым керек, менин тишим катуу ооруйт.'],
  // Beschwerden
  ['die', 'Erkältung', 'Erkältungen', 'простуда', 'суук тийүү', 'Ich habe eine Erkältung.', 'У меня простуда.', 'Мага суук тийди.'],
  ['der', 'Husten', '', 'кашель', 'жөтөл', 'Ich habe seit drei Tagen Husten.', 'У меня кашель уже три дня.', 'Үч күндөн бери жөтөлүп жатам.'],
  ['der', 'Schnupfen', '', 'насморк', 'тумоо (мурундун бүтүшү)', 'Mit Schnupfen schlafe ich schlecht.', 'С насморком я плохо сплю.', 'Тумоо болгондо мен жаман уктайм.'],
  ['das', 'Fieber', '', 'температура, жар', 'ысытма (дене табынын көтөрүлүшү)', 'Ich habe Fieber und bleibe im Bett.', 'У меня температура, и я остаюсь в постели.', 'Менин ысытмам бар, мен керебетте жатам.'],
  ['die', 'Grippe', '', 'грипп', 'грипп (вирустан болгон оору)', 'Im Winter haben viele Leute Grippe.', 'Зимой у многих людей грипп.', 'Кышында көп адамдарда грипп болот.'],
  ['die', 'Kopfschmerzen', 'Kopfschmerzen', 'головная боль', 'баштын оорушу', 'Ich habe Kopfschmerzen.', 'У меня болит голова.', 'Менин башым ооруп жатат.'],
  ['die', 'Bauchschmerzen', 'Bauchschmerzen', 'боль в животе', 'ичтин оорушу', 'Mein Sohn hat Bauchschmerzen.', 'У моего сына болит живот.', 'Менин уулумдун ичи ооруйт.'],
  ['v', 'wehtun', '', 'болеть', 'ооруу', 'Wo tut es weh?', 'Где болит?', 'Кайсы жериңиз ооруйт?'],
  ['v', 'sich fühlen', '', 'чувствовать себя', 'өзүн сезүү', 'Ich fühle mich heute nicht gut.', 'Сегодня я плохо себя чувствую.', 'Бүгүн мен өзүмдү жаман сезип жатам.'],
  ['a', 'krank', '', 'больной', 'оорулуу', 'Mein Kind ist krank.', 'Мой ребёнок болен.', 'Менин балам оорулуу.'],
  ['a', 'gesund', '', 'здоровый; полезный для здоровья', 'дени сак; ден соолукка пайдалуу', 'Sport ist gesund.', 'Спорт полезен для здоровья.', 'Спорт ден соолукка пайдалуу.'],
  ['a', 'erkältet', '', 'простуженный', 'суук тийген', 'Ich bin erkältet.', 'Я простужен.', 'Мага суук тийген.'],
  // Arzt und Medikamente
  ['die', 'Praxis', 'Praxen', 'врачебный кабинет, практика', 'дарыгердин кабинети', 'Ich rufe in der Praxis an.', 'Я звоню в кабинет врача.', 'Мен дарыгердин кабинетине чалам.'],
  ['die', 'Tablette', 'Tabletten', 'таблетка', 'таблетка (дары)', 'Ich nehme zweimal am Tag eine Tablette.', 'Я принимаю по таблетке два раза в день.', 'Мен күнүнө эки жолу бирден таблетка ичем.'],
  ['die', 'Salbe', 'Salben', 'мазь', 'сүртүүчү дары (май сымал)', 'Die Salbe hilft mir gut.', 'Мазь мне хорошо помогает.', 'Бул сүртүүчү дары мага жакшы жардам берет.'],
  ['der', 'Notruf', 'Notrufe', 'экстренный вызов, номер срочной помощи', 'шашылыш чакыруу (номер)', 'Der Notruf in Deutschland ist 112.', 'Номер срочной помощи в Германии — 112.', 'Германияда шашылыш чакыруунун номери — 112.'],
  ['der', 'Krankenwagen', 'Krankenwagen', 'машина скорой помощи', 'тез жардам машинасы', 'Der Krankenwagen kommt in zehn Minuten.', 'Скорая приедет через десять минут.', 'Тез жардам он мүнөттөн кийин келет.'],
  ['die', 'Notaufnahme', 'Notaufnahmen', 'приёмное отделение (срочная помощь)', 'шашылыш жардам бөлүмү', 'Am Sonntag gehe ich in die Notaufnahme.', 'В воскресенье я иду в приёмное отделение.', 'Жекшемби күнү мен шашылыш жардам бөлүмүнө барам.'],
  ['die', 'Untersuchung', 'Untersuchungen', 'осмотр, обследование', 'текшерүү', 'Die Untersuchung dauert zehn Minuten.', 'Осмотр длится десять минут.', 'Текшерүү он мүнөткө созулат.'],
  ['v', 'untersuchen', '', 'осматривать, обследовать', 'текшерүү (дарыгердин)', 'Der Arzt untersucht den Hals.', 'Врач осматривает горло.', 'Дарыгер тамакты текшерет.'],
  ['die', 'Krankschreibung', 'Krankschreibungen', 'больничный лист', 'оорулуу барагы (жумуштан бошотуучу документ)', 'Ich brauche eine Krankschreibung für die Arbeit.', 'Мне нужен больничный для работы.', 'Мага жумуш үчүн оорулуу барагы керек.'],
  // Gesund leben
  ['die', 'Gesundheit', '', 'здоровье', 'ден соолук', 'Die Gesundheit ist wichtig.', 'Здоровье важно.', 'Ден соолук маанилүү.'],
  ['v', 'sich bewegen', '', 'двигаться', 'кыймылдоо', 'Ich bewege mich jeden Tag.', 'Я двигаюсь каждый день.', 'Мен күн сайын кыймылдайм.'],
  ['v', 'sich ausruhen', '', 'отдыхать, отдохнуть', 'эс алуу', 'Am Sonntag ruhe ich mich aus.', 'В воскресенье я отдыхаю.', 'Жекшемби күнү мен эс алам.'],
  ['v', 'sich entspannen', '', 'расслабляться', 'бошоңдоо, чыңалуудан арылуу', 'Mit Musik entspanne ich mich.', 'С музыкой я расслабляюсь.', 'Музыка менен мен бошоңдойм.'],
  ['der', 'Stress', '', 'стресс', 'стресс (психикалык чыңалуу)', 'Bei der Arbeit habe ich viel Stress.', 'На работе у меня много стресса.', 'Жумушта менин стрессим көп.'],
  ['v', 'trainieren', '', 'тренироваться', 'машыгуу', 'Ich trainiere zweimal in der Woche.', 'Я тренируюсь два раза в неделю.', 'Мен жумасына эки жолу машыгам.'],
]

const posOf = (k: string): PartOfSpeech => (k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : 'adj')

/** Unit 14 words that are RECOGNITION vocabulary: understood in texts and options, never required in a gap, speaking keyword or writing requirement. */
export const UNIT_14_RECEPTIVE_WORDS: readonly string[] = ['Grippe', 'Untersuchung', 'untersuchen', 'Krankschreibung']

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v14-${i + 1}`,
    unit: 14,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in Units 11–13. */
export const UNIT_14_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
