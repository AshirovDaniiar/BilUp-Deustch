import type { Exercise, L10n } from '../../types'
import type { A2TestDef, A2TestQuestion, L10nStrict } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 16 revision (Wiederholung) exercises, `a2-ex-16-01` … `-08` (3 fill / 3 choice / 2 order; concept 1 × 3, concept 2 × 3, concept 3 × 2 — the Stage 7B plan).
 * Authored independently of the final test below: no prompt, sentence or answer is shared. Positions of the correct option: fill 1 / 0 / 2, choice 2 / 1 / 0.
 */
export const UNIT_16_EXERCISES: Exercise[] = [
  {
    id: 'a2-ex-16-01',
    type: 'fill',
    unit: 16,
    concept: 'a2-gern-lieber-am-liebsten',
    prompt: 'Ich lese gern, ich spiele lieber Fußball, aber ___ tanze ich.',
    promptRu: 'Я люблю читать, больше люблю играть в футбол, но больше всего люблю танцевать.',
    promptKy: 'Мен окуганды жакшы көрөм, футбол ойногонду көбүрөөк жакшы көрөм, бирок баарынан көп бийлегенди жакшы көрөм.',
    options: ['lieber', 'am liebsten', 'gern'],
    answer: 'am liebsten',
    why: w(
      'Это третья ступень ряда gern – lieber – am liebsten: «больше всего». После am liebsten глагол (tanze) остаётся вторым.',
      'Бул gern – lieber – am liebsten катарынын үчүнчү баскычы: «баарынан көп». am liebsten сөзүнөн кийин этиш (tanze) экинчи орунда калат.',
    ),
  },
  {
    id: 'a2-ex-16-02',
    type: 'choice',
    unit: 16,
    concept: 'a2-gern-lieber-am-liebsten',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich gehe lieber ins Kino wie ins Theater.', 'Ich gehe gerner ins Kino als ins Theater.', 'Ich gehe lieber ins Kino als ins Theater.'],
    answer: 'Ich gehe lieber ins Kino als ins Theater.',
    why: w(
      'Сравнительная форма от gern — lieber (форма gerner не существует). Для «чем» после неё стоит als, а не wie.',
      'gern сөзүнүн салыштыруу формасы — lieber (gerner формасы жок). «…дан» маанисин андан кийин wie эмес, als берет.',
    ),
  },
  {
    id: 'a2-ex-16-03',
    type: 'order',
    unit: 16,
    concept: 'a2-gern-lieber-am-liebsten',
    prompt: 'Bilde den Satz.',
    promptRu: 'Больше всего я люблю ходить в поход.',
    promptKy: 'Баарынан көп мен жөө жүргөндү жакшы көрөм.',
    words: ['liebsten', 'Am', 'ich.', 'wandere'],
    answer: 'Am liebsten wandere ich.',
    why: w(
      'Предложение начинается с am liebsten, поэтому глагол wandere стоит вторым, а подлежащее ich — после него.',
      'Сүйлөм am liebsten менен башталат, ошондуктан wandere этиши экинчи, ал эми ээси ich андан кийин турат.',
    ),
  },
  {
    id: 'a2-ex-16-04',
    type: 'fill',
    unit: 16,
    concept: 'a2-verben-mit-praepositionen',
    prompt: 'Ich interessiere mich ___ Musik.',
    promptRu: 'Я интересуюсь музыкой.',
    promptKy: 'Мен музыкага кызыгам.',
    options: ['für', 'an', 'auf'],
    answer: 'für',
    why: w(
      'Sich interessieren всегда идёт с предлогом für. Предлоги an и auf здесь не подходят.',
      'Sich interessieren ар дайым für предлогу менен колдонулат. an жана auf предлогдору бул жерге туура келбейт.',
    ),
  },
  {
    id: 'a2-ex-16-05',
    type: 'choice',
    unit: 16,
    concept: 'a2-verben-mit-praepositionen',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich warte auf dem Bus.', 'Ich warte auf den Bus.', 'Ich warte für den Bus.'],
    answer: 'Ich warte auf den Bus.',
    why: w(
      'Warten идёт с предлогом auf, а после этой пары стоит Akkusativ: den Bus. Форма dem — это Dativ.',
      'Warten auf предлогу менен колдонулат, ал эми бул жуптан кийин Akkusativ турат: den Bus. dem формасы — Dativ.',
    ),
  },
  {
    id: 'a2-ex-16-06',
    type: 'order',
    unit: 16,
    concept: 'a2-verben-mit-praepositionen',
    prompt: 'Bilde den Satz.',
    promptRu: 'Я радуюсь предстоящему празднику.',
    promptKy: 'Мен майрамга кубанып жатам.',
    words: ['freue', 'auf', 'mich', 'das', 'Ich', 'Fest.'],
    answer: 'Ich freue mich auf das Fest.',
    why: w(
      'Глагол freue — на втором месте, затем возвратное местоимение mich, потом предлог auf и дополнение в Akkusativ (das Fest).',
      'freue этиши экинчи орунда, андан кийин өздүк ат атооч mich, анан auf предлогу жана Akkusativдеги толуктооч (das Fest).',
    ),
  },
  {
    id: 'a2-ex-16-07',
    type: 'fill',
    unit: 16,
    concept: 'a2-ordinalzahlen-datum',
    prompt: 'Das Konzert ist am ___ Mai.',
    promptRu: 'Концерт — третьего мая.',
    promptKy: 'Концерт 3-майда.',
    options: ['drei', 'dreite', 'dritten'],
    answer: 'dritten',
    why: w(
      'В дате нужно порядковое число. У числа 3 особая форма: dritte, а после am добавляется -n: am dritten Mai.',
      'Датада иреттик сан керек. 3 санынын өзгөчө формасы бар: dritte, ал эми am сөзүнөн кийин -n кошулат: am dritten Mai.',
    ),
  },
  {
    id: 'a2-ex-16-08',
    type: 'choice',
    unit: 16,
    concept: 'a2-ordinalzahlen-datum',
    prompt: 'Wie liest du „am 12. Mai“?',
    promptRu: 'Как читается «am 12. Mai»?',
    promptKy: '«am 12. Mai» кандай окулат?',
    options: ['am zwölften Mai', 'am zwölf Mai', 'am zwölfte Mai'],
    answer: 'am zwölften Mai',
    why: w(
      'Точка после цифры означает порядковое число: zwölf → zwölfte. После am добавляется -n: am zwölften Mai.',
      'Цифрадан кийинки чекит иреттик сан экенин билдирет: zwölf → zwölfte. am сөзүнөн кийин -n кошулат: am zwölften Mai.',
    ),
  },
]

/** Test definition `unit-16` (kind topic, 15 questions). */
export const UNIT_16_TEST: A2TestDef = {
  id: 'unit-16',
  title: s('Итоговый тест: юнит 16', 'Жыйынтыктоочу тест: 16-бөлүм'),
  kind: 'topic',
  level: 'A2',
  unit: 16,
  size: 15,
}

/**
 * Unit 16 final test, `a2-ft-16-01` … `-15`. Composition: 7 grammar items (2 + 3 + 2, each in a small everyday sentence), 3 vocabulary items,
 * 5 items that read a short German text (a poster, a media text, an invitation, an opinion, an event notice).
 * Reading items carry the German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate only the instruction and the question.
 * Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_16_FINAL: A2TestQuestion[] = [
  {
    id: 'a2-ft-16-01',
    prompt: 'Ich höre ___ Musik, aber ich tanze lieber.',
    promptRu: 'Я люблю слушать музыку, но больше люблю танцевать.',
    promptKy: 'Мен музыка угууну жакшы көрөм, бирок бийлегенди көбүрөөк жакшы көрөм.',
    options: ['gern', 'lieber', 'am liebsten'],
    answer: 'gern',
    skill: 'grammar',
    concept: 'a2-gern-lieber-am-liebsten',
    why: s(
      'Первая ступень — gern («люблю»). Вторая ступень lieber уже есть во второй части предложения (tanze lieber).',
      'Биринчи баскыч — gern («жакшы көрөм»). Экинчи баскыч lieber сүйлөмдүн экинчи бөлүгүндө бар (tanze lieber).',
    ),
  },
  {
    id: 'a2-ft-16-02',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Lieber ich bleibe zu Hause.', 'Am liebsten bleibe ich zu Hause.', 'Am liebsten ich bleibe zu Hause.'],
    answer: 'Am liebsten bleibe ich zu Hause.',
    skill: 'grammar',
    concept: 'a2-gern-lieber-am-liebsten',
    why: s(
      'Если предложение начинается с am liebsten, глагол остаётся на втором месте: bleibe ich. В других вариантах глагол стоит на третьем месте.',
      'Сүйлөм am liebsten менен башталса, этиш экинчи орунда калат: bleibe ich. Башка варианттарда этиш үчүнчү орунда турат.',
    ),
  },
  {
    id: 'a2-ft-16-03',
    prompt: 'Ich warte ___ meine Freundin vor dem Kino.',
    promptRu: 'Я жду свою подругу у кинотеатра.',
    promptKy: 'Мен курбумду кинотеатрдын алдында күтүп жатам.',
    options: ['für', 'an', 'auf'],
    answer: 'auf',
    skill: 'grammar',
    concept: 'a2-verben-mit-praepositionen',
    why: s(
      'Warten всегда идёт с предлогом auf: warten auf + Akkusativ (auf meine Freundin).',
      'Warten ар дайым auf предлогу менен колдонулат: warten auf + Akkusativ (auf meine Freundin).',
    ),
  },
  {
    id: 'a2-ft-16-04',
    prompt: 'Wir sprechen ___ den Film.',
    promptRu: 'Мы говорим о фильме.',
    promptKy: 'Биз тасма жөнүндө сүйлөшүп жатабыз.',
    options: ['an', 'über', 'für'],
    answer: 'über',
    skill: 'grammar',
    concept: 'a2-verben-mit-praepositionen',
    why: s(
      'Sprechen «о чём-то» — sprechen über + Akkusativ (über den Film).',
      'Sprechen «бир нерсе жөнүндө» — sprechen über + Akkusativ (über den Film).',
    ),
  },
  {
    id: 'a2-ft-16-05',
    prompt: 'Meine Schwester interessiert sich für ___ Museum.',
    promptRu: 'Моя сестра интересуется музеем.',
    promptKy: 'Менин эжем музейге кызыгат.',
    options: ['das', 'dem', 'den'],
    answer: 'das',
    skill: 'grammar',
    concept: 'a2-verben-mit-praepositionen',
    why: s(
      'После für стоит Akkusativ. Museum — средний род, поэтому das Museum. Форма dem — Dativ, а den — мужской род.',
      'für предлогунан кийин Akkusativ турат. Museum — орто жынс, ошондуктан das Museum. dem формасы — Dativ, ал эми den — эркек жынс.',
    ),
  },
  {
    id: 'a2-ft-16-06',
    prompt: 'Das Theater beginnt am ___ Juni.',
    promptRu: 'Театр начинается седьмого июня.',
    promptKy: 'Театр 7-июнда башталат.',
    options: ['siebente', 'sieben', 'siebten'],
    answer: 'siebten',
    skill: 'grammar',
    concept: 'a2-ordinalzahlen-datum',
    why: s(
      'В дате нужно порядковое число: у 7. особая форма siebte, а после am — окончание -n: am siebten Juni.',
      'Датада иреттик сан керек: 7. санынын өзгөчө формасы siebte, ал эми am сөзүнөн кийин -n аякталышы: am siebten Juni.',
    ),
  },
  {
    id: 'a2-ft-16-07',
    prompt: 'Mein Geburtstag ist am 21. April. Wie sagst du das?',
    promptRu: 'Мой день рождения 21 апреля. Как это сказать?',
    promptKy: 'Менин туулган күнүм 21-апрелде. Муну кантип айтабыз?',
    options: ['Am einundzwanzigste April.', 'Am einundzwanzigsten April.', 'Am einundzwanzig April.'],
    answer: 'Am einundzwanzigsten April.',
    skill: 'grammar',
    concept: 'a2-ordinalzahlen-datum',
    why: s(
      'С 20-го числа порядковое число образуется с -ste, а после am добавляется -n: einundzwanzigsten.',
      '20дан баштап иреттик сан -ste менен түзүлөт, ал эми am сөзүнөн кийин -n кошулат: einundzwanzigsten.',
    ),
  },
  {
    id: 'a2-ft-16-08',
    prompt: 'Meine Freundin schickt mir ein Foto auf mein Handy. Ich bekomme eine ___.',
    promptRu: 'Подруга присылает мне фото на телефон. Я получаю сообщение.',
    promptKy: 'Курбум мага телефонума сүрөт жиберет. Мен билдирүү алам.',
    options: ['Nachricht', 'Sendung', 'Zeitung'],
    answer: 'Nachricht',
    skill: 'vocabulary',
    why: s(
      'То, что приходит на телефон от подруги, — die Nachricht («сообщение»). Die Sendung — передача, die Zeitung — газета.',
      'Курбудан телефонго келген нерсе — die Nachricht («билдирүү»). Die Sendung — берүү, die Zeitung — гезит.',
    ),
  },
  {
    id: 'a2-ft-16-09',
    prompt: 'Im Museum gibt es bis Mai eine ___ mit Fotos.',
    promptRu: 'В музее до мая идёт выставка фотографий.',
    promptKy: 'Музейде майга чейин сүрөттөрдүн көргөзмөсү бар.',
    options: ['Mannschaft', 'Zeitschrift', 'Ausstellung'],
    answer: 'Ausstellung',
    skill: 'vocabulary',
    why: s(
      'В музее показывают выставку: die Ausstellung. Die Mannschaft — спортивная команда, die Zeitschrift — журнал.',
      'Музейде көргөзмө көрсөтүлөт: die Ausstellung. Die Mannschaft — спорттук команда, die Zeitschrift — журнал.',
    ),
  },
  {
    id: 'a2-ft-16-10',
    prompt: 'Welches Wort passt nicht zum Thema „Medien“?',
    promptRu: 'Какое слово не подходит к теме «Медиа»?',
    promptKy: '«Медиа» темасына кайсы сөз туура келбейт?',
    options: ['die Zeitung', 'das Training', 'die App'],
    answer: 'das Training',
    skill: 'vocabulary',
    why: s(
      'Die Zeitung и die App — это медиа. Das Training — спортивное занятие.',
      'Die Zeitung жана die App — медиа. Das Training — спорттук сабак.',
    ),
  },
  {
    id: 'a2-ft-16-11',
    prompt:
      'Lies das Plakat: „Stadtfest am Samstag, 11. Mai. Konzert um 19 Uhr, Eintritt 8 Euro. Kinder bis 10 Jahre frei. Karten online oder an der Kasse.“ Wie viel kostet das Konzert für ein Kind von acht Jahren?',
    promptRu: 'Прочитайте плакат. Сколько стоит концерт для ребёнка восьми лет?',
    promptKy: 'Плакатты окуңуз. Сегиз жаштагы бала үчүн концерт канча турат?',
    options: ['Nichts, es ist frei.', '8 Euro', '4 Euro'],
    answer: 'Nichts, es ist frei.',
    skill: 'reading',
    why: s(
      'На плакате: «Kinder bis 10 Jahre frei». Ребёнку восьми лет вход бесплатный. Восемь евро платят взрослые.',
      'Плакатта: «Kinder bis 10 Jahre frei». Сегиз жаштагы балага кирүү акысыз. Сегиз евро чоңдор үчүн.',
    ),
  },
  {
    id: 'a2-ft-16-12',
    prompt:
      'Lies den Text: „Ich sehe nie fern. Ich lese die Nachrichten lieber im Internet und höre am Abend Musik über eine App. Mein Vater liest immer noch die Zeitung.“ Was macht der Schreiber am Abend?',
    promptRu: 'Прочитайте текст. Что автор делает вечером?',
    promptKy: 'Текстти окуңуз. Автор кечинде эмне кылат?',
    options: ['Er sieht fern.', 'Er liest die Zeitung.', 'Er hört Musik mit einer App.'],
    answer: 'Er hört Musik mit einer App.',
    skill: 'reading',
    why: s(
      'Автор пишет: «höre am Abend Musik über eine App». Он не смотрит телевизор, а газету читает его отец.',
      'Автор жазат: «höre am Abend Musik über eine App». Ал телевизор көрбөйт, ал эми гезитти анын атасы окуйт.',
    ),
  },
  {
    id: 'a2-ft-16-13',
    prompt:
      'Lies die Nachricht: „Hi Tom, am Samstag, 18. Mai, ist ein Fest im Park. Hast du Lust? Ich warte um 17 Uhr vor dem Kino auf dich. Lisa“ Welche Antwort passt?',
    promptRu: 'Прочитайте сообщение. Какой ответ подходит?',
    promptKy: 'Билдирүүнү окуңуз. Кайсы жооп ылайыктуу?',
    options: ['Super, ich komme gern! Bis Samstag.', 'Ich warte auf dem Kino.', 'Das Fest war langweilig.'],
    answer: 'Super, ich komme gern! Bis Samstag.',
    skill: 'reading',
    why: s(
      'Лиза приглашает на праздник. Подходит согласие: «Super, ich komme gern!». Остальные ответы не отвечают на приглашение.',
      'Лиза майрамга чакырат. Макул болуу туура келет: «Super, ich komme gern!». Калган жооптор чакырыкка жооп эмес.',
    ),
  },
  {
    id: 'a2-ft-16-14',
    prompt:
      'Lies den Kommentar: „Ich habe gestern den Film „Sommerregen“ gesehen. Die Geschichte war langweilig, aber die Musik war schön. Ich gehe lieber ins Konzert als ins Kino.“ Was findet die Person langweilig?',
    promptRu: 'Прочитайте комментарий. Что человек считает скучным?',
    promptKy: 'Комментарийди окуңуз. Адам эмнени зеригүүчү деп эсептейт?',
    options: ['Die Musik', 'Die Geschichte', 'Das Konzert'],
    answer: 'Die Geschichte',
    skill: 'reading',
    concept: 'a2-gern-lieber-am-liebsten',
    why: s(
      'В комментарии сказано: «Die Geschichte war langweilig». Музыка была красивой, а концерт нравится автору больше, чем кино.',
      'Комментарийде айтылган: «Die Geschichte war langweilig». Музыка сонун болгон, ал эми концерт автордун көңүлүнө кинодон көбүрөөк жагат.',
    ),
  },
  {
    id: 'a2-ft-16-15',
    prompt:
      'Lies die Info: „Museum: Ausstellung „Fotos aus der Stadt“ vom 2. bis 30. Juni. Montag zu. Eintritt 5 Euro, Kinder 3 Euro.“ Was steht in der Info?',
    promptRu: 'Прочитайте информацию. Что в ней сказано?',
    promptKy: 'Маалыматты окуңуз. Анда эмне айтылган?',
    options: ['Die Ausstellung ist im Mai.', 'Am Montag ist das Museum offen.', 'Die Ausstellung beginnt am 2. Juni.'],
    answer: 'Die Ausstellung beginnt am 2. Juni.',
    skill: 'reading',
    why: s(
      'В информации сказано: «vom 2. bis 30. Juni». Значит, выставка начинается 2 июня. В понедельник музей закрыт («Montag zu»).',
      'Маалыматта айтылган: «vom 2. bis 30. Juni». Демек, көргөзмө 2-июнда башталат. Дүйшөмбү күнү музей жабык («Montag zu»).',
    ),
  },
]
