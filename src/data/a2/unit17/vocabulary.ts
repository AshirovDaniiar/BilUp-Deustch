import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 17 vocabulary — Schule, Ausbildung und Beruf (Stage 7H). 37 items, exactly the approved Stage 7B vocabulary map:
 * 30 productive, 7 receptive (`UNIT_17_RECEPTIVE_WORDS`). Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted
 * first draft for native review (uncertain terms: docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md, §10). Institutions are glossed as GERMAN institutions
 * (Berufsschule, Ausbildung …), no equivalence with another education system is claimed. NO artificial brackets: where Russian and Kyrgyz would both
 * use the same loan word, each gloss gives the natural, independently chosen wording (a second sense or a native phrase), so that no pair is identical.
 * Occupations are listed in the masculine form; the feminine form (-in) is given in the example.
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Schule und Studium
  ['die', 'Klasse', 'Klassen', 'класс (школьный)', 'мектептеги класс', 'In meiner Klasse sind zwanzig Kinder.', 'В моём классе двадцать детей.', 'Менин классымда жыйырма бала бар.'],
  ['das', 'Fach', 'Fächer', 'школьный предмет', 'окуу предмети', 'Mathematik ist ein schweres Fach.', 'Математика — трудный предмет.', 'Математика — оор окуу предмети.'],
  ['die', 'Note', 'Noten', 'оценка (в школе)', 'мектепте коюлган баа', 'Ich habe eine gute Note in Deutsch.', 'У меня хорошая оценка по немецкому.', 'Менин немис тилинен жакшы баам бар.'],
  ['das', 'Zeugnis', 'Zeugnisse', 'табель, свидетельство об оценках', 'окуу жыйынтыгы жазылган күбөлүк', 'Im Juli bekommen die Kinder das Zeugnis.', 'В июле дети получают табель.', 'Июль айында балдар күбөлүк алышат.'],
  ['der', 'Stundenplan', 'Stundenpläne', 'расписание уроков', 'сабактардын жадыбалы', 'Der Stundenplan hängt an der Tür.', 'Расписание уроков висит на двери.', 'Сабактардын жадыбалы эшикте илинип турат.'],
  ['die', 'Hausaufgabe', 'Hausaufgaben', 'домашнее задание', 'үй тапшырмасы', 'Ich mache zuerst die Hausaufgaben.', 'Сначала я делаю домашнее задание.', 'Мен адегенде үй тапшырмасын аткарам.'],
  ['der', 'Unterricht', '', 'урок, занятия', 'сабак, окуу убактысы', 'Der Unterricht beginnt um acht Uhr.', 'Занятия начинаются в восемь часов.', 'Сабак саат сегизде башталат.'],
  ['die', 'Berufsschule', 'Berufsschulen', 'профессиональное училище (часть дуальной системы Ausbildung)', 'кесиптик окуу жайы (Ausbildung тутумунун бир бөлүгү)', 'Er geht dreimal pro Woche in die Berufsschule.', 'Он ходит в профессиональное училище три раза в неделю.', 'Ал жумасына үч жолу кесиптик окуу жайына барат.'],
  ['die', 'Universität', 'Universitäten', 'университет', 'университет, жогорку окуу жайы', 'Meine Schwester studiert an der Universität.', 'Моя сестра учится в университете.', 'Менин эжем университетте окуйт.'],
  ['das', 'Semester', 'Semester', 'семестр', 'жарым жылдык окуу мезгили', 'Das Semester beginnt im Oktober.', 'Семестр начинается в октябре.', 'Окуу мезгили октябрь айында башталат.'],
  ['die', 'Vorlesung', 'Vorlesungen', 'лекция (в вузе)', 'университеттеги лекция', 'Die Vorlesung dauert zwei Stunden.', 'Лекция длится два часа.', 'Лекция эки саатка созулат.'],
  // Ausbildung und Qualifikation
  ['das', 'Zertifikat', 'Zertifikate', 'сертификат', 'тастыктама, билимди далилдеген документ', 'Ich habe ein Zertifikat für Deutsch.', 'У меня есть сертификат по немецкому.', 'Менин немис тили боюнча тастыктамам бар.'],
  ['der', 'Kurs', 'Kurse', 'курс (занятия)', 'окуу курсу', 'Der Kurs beginnt am Montag.', 'Курс начинается в понедельник.', 'Окуу курсу дүйшөмбү күнү башталат.'],
  ['die', 'Kenntnisse', 'Kenntnisse', 'знания, навыки', 'билим жана көндүмдөр', 'Meine Kenntnisse in Deutsch sind noch nicht perfekt.', 'Мои знания немецкого ещё не идеальны.', 'Менин немис тилин билүүм азырынча мыкты эмес.'],
  ['v', 'sich bewerben', '', 'подавать заявку на работу, претендовать', 'жумушка арыз берүү', 'Ich bewerbe mich um eine Stelle als Bäcker.', 'Я подаю заявку на место пекаря.', 'Мен нан бышыруучу болуп иштөө үчүн арыз берем.'],
  ['die', 'Fähigkeit', 'Fähigkeiten', 'способность, умение', 'жөндөм', 'Sprachen lernen ist eine Fähigkeit.', 'Изучать языки — это способность.', 'Тил үйрөнүү — бул жөндөм.'],
  ['die', 'Weiterbildung', 'Weiterbildungen', 'повышение квалификации, дополнительное обучение', 'квалификацияны жогорулатуу', 'Meine Firma bezahlt die Weiterbildung.', 'Моя фирма оплачивает повышение квалификации.', 'Менин фирмам квалификацияны жогорулатуунун акысын төлөйт.'],
  // Arbeitswelt
  ['der', 'Arbeitgeber', 'Arbeitgeber', 'работодатель', 'жумуш берүүчү', 'Mein Arbeitgeber ist eine kleine Firma.', 'Мой работодатель — небольшая фирма.', 'Менин жумуш берүүчүм — кичинекей фирма.'],
  ['das', 'Vorstellungsgespräch', 'Vorstellungsgespräche', 'собеседование при приёме на работу', 'жумушка кабыл алуу үчүн маек', 'Morgen habe ich ein Vorstellungsgespräch.', 'Завтра у меня собеседование.', 'Эртең менин жумушка кабыл алуу үчүн маегим бар.'],
  ['die', 'Teilzeit', '', 'неполная занятость, неполный рабочий день', 'толук эмес жумуш убактысы', 'Ich arbeite in Teilzeit.', 'Я работаю на неполную ставку.', 'Мен толук эмес жумуш убактысы менен иштейм.'],
  ['die', 'Vollzeit', '', 'полная занятость, полный рабочий день', 'толук жумуш убактысы', 'Er arbeitet in Vollzeit, vierzig Stunden pro Woche.', 'Он работает на полную ставку, сорок часов в неделю.', 'Ал жумасына кырк саат толук жумуш убактысы менен иштейт.'],
  ['der', 'Arbeitsvertrag', 'Arbeitsverträge', 'трудовой договор', 'эмгек келишими', 'Im Arbeitsvertrag steht die Arbeitszeit.', 'В трудовом договоре указано рабочее время.', 'Эмгек келишиминде жумуш убактысы жазылган.'],
  ['die', 'Arbeitszeit', 'Arbeitszeiten', 'рабочее время', 'жумуш убактысы', 'Meine Arbeitszeit ist von acht bis sechzehn Uhr.', 'Моё рабочее время — с восьми до шестнадцати часов.', 'Менин жумуш убактым саат сегизден он алтыга чейин.'],
  ['die', 'Überstunden', 'Überstunden', 'сверхурочные часы', 'ашыкча иштелген саат', 'Ich mache oft Überstunden.', 'Я часто работаю сверхурочно.', 'Мен көп учурда ашыкча иштейм.'],
  ['die', 'Besprechung', 'Besprechungen', 'совещание, планёрка', 'жыйналыш, макулдашуу', 'Um zehn Uhr haben wir eine Besprechung.', 'В десять часов у нас совещание.', 'Саат он да бизде жыйналыш бар.'],
  ['das', 'Team', 'Teams', 'команда, рабочая группа', 'жамаат, иш тобу', 'Ich arbeite gern in einem Team.', 'Я люблю работать в команде.', 'Мен жамаат менен иштегенди жакшы көрөм.'],
  ['der', 'Arbeitnehmer', 'Arbeitnehmer', 'работник по найму', 'жалданып иштеген адам', 'Der Arbeitnehmer bekommt jeden Monat sein Gehalt.', 'Работник получает зарплату каждый месяц.', 'Жалданып иштеген адам ар айда маянасын алат.'],
  ['v', 'kündigen', '', 'расторгать договор, увольняться (подать заявление)', 'келишимди бузуу, жумуштан кетүү', 'Er kündigt seinen Job im Mai.', 'Он увольняется с работы в мае.', 'Ал май айында жумуштан кетет.'],
  ['die', 'Kündigung', 'Kündigungen', 'увольнение, расторжение договора', 'жумуштан бошотуу, келишимди бузуу', 'Die Kündigung kommt per Brief.', 'Уведомление об увольнении приходит по почте.', 'Жумуштан бошотуу жөнүндө билдирүү каттан келет.'],
  // Berufe
  ['der', 'Mechaniker', 'Mechaniker', 'механик, автослесарь', 'механик, машина оңдоочу', 'Der Mechaniker repariert mein Auto.', 'Механик ремонтирует мою машину.', 'Механик менин машинамды оңдоп жатат.'],
  ['der', 'Krankenpfleger', 'Krankenpfleger', 'медбрат', 'эркек медайым', 'Der Krankenpfleger arbeitet im Krankenhaus.', 'Медбрат работает в больнице.', 'Эркек медайым оорукананда иштейт.'],
  ['der', 'Bäcker', 'Bäcker', 'пекарь', 'нан бышыруучу', 'Der Bäcker steht um drei Uhr auf.', 'Пекарь встаёт в три часа.', 'Нан бышыруучу саат үчтө турат.'],
  ['der', 'Polizist', 'Polizisten', 'полицейский', 'полиция кызматкери', 'Der Polizist hilft uns.', 'Полицейский нам помогает.', 'Полиция кызматкери бизге жардам берет.'],
  ['der', 'Ingenieur', 'Ingenieure', 'инженер', 'инженер, техникалык адис', 'Meine Schwester ist Ingenieurin.', 'Моя сестра — инженер.', 'Менин эжем — инженер аял.'],
  ['der', 'Handwerker', 'Handwerker', 'мастер-ремесленник (строительные и ремонтные работы)', 'кол өнөрчү, уста', 'Der Handwerker kommt am Montag.', 'Мастер придёт в понедельник.', 'Уста дүйшөмбү күнү келет.'],
  ['der', 'Bauarbeiter', 'Bauarbeiter', 'строитель, рабочий на стройке', 'курулуш жумушчусу', 'Der Bauarbeiter arbeitet draußen.', 'Строитель работает на улице.', 'Курулуш жумушчусу сыртта иштейт.'],
  ['der', 'Programmierer', 'Programmierer', 'программист', 'программа түзүүчү', 'Mein Bruder ist Programmierer.', 'Мой брат — программист.', 'Менин агам программа түзүүчү.'],
]

const posOf = (k: string): PartOfSpeech => (k === 'der' || k === 'die' || k === 'das' ? 'noun' : 'verb')

/** Unit 17 words that are RECOGNITION vocabulary: understood in texts and options, never required in a gap, speaking keyword or writing requirement. */
export const UNIT_17_RECEPTIVE_WORDS: readonly string[] = ['Semester', 'Vorlesung', 'Fähigkeit', 'Weiterbildung', 'Arbeitnehmer', 'kündigen', 'Kündigung']

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v17-${i + 1}`,
    unit: 17,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in Units 11–16. */
export const UNIT_17_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
