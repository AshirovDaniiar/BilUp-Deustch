import type { Exercise, L10n } from '../../types'
import type { A2TestQuestion, L10nStrict } from '../../a2/types'
import type { B1TestDef } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 28 revision (Wiederholung) exercises, `b1-ex-28-01` … `-10`: 4 fill / 4 choice / 2 order on the unit's three concepts (Futur I with wohl × 3, falls / sobald /
 * solange × 2, verb + preposition and wo(r)- / da(r)- × 3), plus 2 RECYCLED items (↻ Infinitiv mit zu of Unit 23, ↻ wenn of A2 Unit 14) without a concept of this
 * unit — the spaced-revision part. Exercise 08 is a TEXT-level `choice` item (three sentences). Authored independently of the final test: no prompt, sentence or
 * answer is shared. The items use only the closed lists (Futur I: sein, haben, kommen, gehen, schaffen, bestehen, lernen, studieren, arbeiten, geben; the 20 verb +
 * preposition pairs); the receptive `sodass` and the constructions of Units 22–27 never appear in a gap or a word order. All situations are fictional.
 */
export const UNIT_28_EXERCISES: Exercise[] = [
  {
    id: 'b1-ex-28-01',
    type: 'fill',
    unit: 28,
    concept: 'b1-futur1-vermutungen',
    prompt: 'Nächstes Jahr ___ es mehr Studienplätze geben.',
    promptRu: 'В следующем году мест для учёбы будет больше.',
    promptKy: 'Келерки жылы окуу орундары көбөйөт.',
    options: ['wird', 'ist', 'wurde'],
    answer: 'wird',
    why: w(
      'Прогноз о будущем: Futur I = wird + инфинитив в конце (geben). «Ist» не выражает будущее, «wurde» — прошедшее время Passiv.',
      'Келечек жөнүндө болжол: Futur I = wird + аягында инфинитив (geben). «ist» келечекти билдирбейт, «wurde» — Passivдин өткөн чагы.',
    ),
  },
  {
    id: 'b1-ex-28-02',
    type: 'choice',
    unit: 28,
    concept: 'b1-futur1-vermutungen',
    prompt: 'Welcher Satz drückt eine Vermutung aus?',
    promptRu: 'Какое предложение выражает предположение?',
    promptKy: 'Кайсы сүйлөм божомолду билдирет?',
    options: ['Er wird wohl krank sein.', 'Er wird bald gesund.', 'Er ist krank gewesen.'],
    answer: 'Er wird wohl krank sein.',
    why: w(
      'Предположение о настоящем — wird + wohl + инфинитив (sein). «Er wird bald gesund» — это «становится здоровым», а «ist … gewesen» — прошедшее.',
      'Азыркы чак жөнүндө божомол — wird + wohl + инфинитив (sein). «Er wird bald gesund» — «айыгып баратат», ал эми «ist … gewesen» — өткөн чак.',
    ),
  },
  {
    id: 'b1-ex-28-03',
    type: 'order',
    unit: 28,
    concept: 'b1-futur1-vermutungen',
    prompt: 'Bilde den Satz.',
    promptRu: 'Я, наверное, сдам экзамен.',
    promptKy: 'Мен, балким, экзаменден өтөм.',
    words: ['bestehen.', 'wohl', 'Ich', 'Prüfung', 'die', 'werde'],
    answer: 'Ich werde die Prüfung wohl bestehen.',
    why: w(
      'Werde стоит на втором месте, wohl — после дополнения, а инфинитив (bestehen) — в самом конце предложения.',
      'werde экинчи орунда турат, wohl — толуктоочтон кийин, ал эми инфинитив (bestehen) — сүйлөмдүн эң аягында.',
    ),
  },
  {
    id: 'b1-ex-28-04',
    type: 'fill',
    unit: 28,
    concept: 'b1-falls-sobald-solange',
    prompt: '___ ich die Prüfung vielleicht nicht bestehe, wiederhole ich sie im Herbst.',
    promptRu: 'Если вдруг я не сдам экзамен, я пересдам его осенью.',
    promptKy: 'Экзаменден өтпөй калсам, аны күзүндө кайра тапшырам.',
    options: ['Falls', 'Solange', 'Sobald'],
    answer: 'Falls',
    why: w(
      'Возможный, но не обязательный случай («vielleicht») — falls. Solange («пока») и sobald («как только») не подходят по смыслу.',
      'Мүмкүн болгон, бирок милдеттүү эмес учур («vielleicht») — falls. solange («… бою») жана sobald («болору менен») мааниси боюнча туура келбейт.',
    ),
  },
  {
    id: 'b1-ex-28-05',
    type: 'choice',
    unit: 28,
    concept: 'b1-falls-sobald-solange',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Solange ich studiere, wohne ich bei meinen Eltern.',
      'Solange ich studiere, ich wohne bei meinen Eltern.',
      'Solange ich wohne bei meinen Eltern, studiere ich.',
    ],
    answer: 'Solange ich studiere, wohne ich bei meinen Eltern.',
    why: w(
      'В придаточном глагол (studiere) стоит в конце, а в главной части глагол (wohne) идёт сразу после запятой. В других вариантах порядок слов нарушен.',
      'Кошумча бөлүктө этиш (studiere) аягында турат, ал эми башкы бөлүктө этиш (wohne) үтүрдөн дароо кийин келет. Башка варианттарда сөздөрдүн ирети бузулган.',
    ),
  },
  {
    id: 'b1-ex-28-06',
    type: 'fill',
    unit: 28,
    concept: 'b1-verben-praepositionen',
    prompt: 'Sie träumt ___ einem Auslandsjahr.',
    promptRu: 'Она мечтает о годе за границей.',
    promptKy: 'Ал чет өлкөдө бир жыл жөнүндө кыялданат.',
    options: ['von', 'auf', 'für'],
    answer: 'von',
    why: w(
      'Глагол träumen всегда идёт с предлогом von, а после него стоит Dativ: von einem Auslandsjahr.',
      'träumen этиши дайыма von предлогу менен жүрөт, андан кийин Dativ турат: von einem Auslandsjahr.',
    ),
  },
  {
    id: 'b1-ex-28-07',
    type: 'order',
    unit: 28,
    concept: 'b1-verben-praepositionen',
    prompt: 'Bilde den Satz.',
    promptRu: 'Мы занимаемся записью.',
    promptKy: 'Биз жазылуу менен алектенип жатабыз.',
    words: ['uns', 'Wir', 'die', 'um', 'Anmeldung.', 'kümmern'],
    answer: 'Wir kümmern uns um die Anmeldung.',
    why: w(
      'Пара sich kümmern um: глагол на втором месте, возвратное местоимение uns, затем um + Akkusativ (die Anmeldung).',
      'sich kümmern um жубу: этиш экинчи орунда, sich сыяктуу ат атооч uns, андан кийин um + Akkusativ (die Anmeldung).',
    ),
  },
  {
    id: 'b1-ex-28-08',
    type: 'choice',
    unit: 28,
    concept: 'b1-verben-praepositionen',
    prompt: 'Welcher kleine Text ist richtig?',
    promptRu: 'Какой короткий текст составлен правильно?',
    promptKy: 'Кайсы кыска текст туура түзүлгөн?',
    options: [
      'Wofür wartest du? Ich warte auf die Antwort. Darauf hoffe ich schon lange.',
      'Worauf wartest du? Ich warte auf die Antwort. Darauf hoffe ich schon lange.',
      'Worauf wartest du? Ich warte auf die Antwort. Dafür hoffe ich schon lange.',
    ],
    answer: 'Worauf wartest du? Ich warte auf die Antwort. Darauf hoffe ich schon lange.',
    why: w(
      'Warten идёт с auf, поэтому вопрос — worauf (а не wofür). Hoffen тоже идёт с auf, значит ответ — darauf (а не dafür). Во втором тексте всё верно.',
      'warten auf менен жүрөт, ошондуктан суроо — worauf (wofür эмес). hoffen да auf менен жүрөт, демек жооп — darauf (dafür эмес). Экинчи текстте баары туура.',
    ),
  },
  // ↻ Wiederholung (recycled, spaced revision; no concept of this unit)
  {
    id: 'b1-ex-28-09',
    type: 'fill',
    unit: 28,
    prompt: 'Es ist wichtig, regelmäßig ___ lernen.',
    promptRu: 'Важно регулярно учиться.',
    promptKy: 'Үзгүлтүксүз окуу маанилүү.',
    options: ['zu', 'um', 'für'],
    answer: 'zu',
    why: w(
      '↻ Юнит 23: после выражения «es ist wichtig» инфинитив стоит с частицей zu прямо перед инфинитивом: …, regelmäßig zu lernen.',
      '↻ 23-бөлүм: «es ist wichtig» туюндурмасынан кийин инфинитив zu бөлүкчөсү менен инфинитивдин дароо алдында турат: …, regelmäßig zu lernen.',
    ),
  },
  {
    id: 'b1-ex-28-10',
    type: 'choice',
    unit: 28,
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Wenn ich müde bin, mache ich eine Pause.',
      'Wenn ich müde bin, ich mache eine Pause.',
      'Wenn ich bin müde, mache ich eine Pause.',
    ],
    answer: 'Wenn ich müde bin, mache ich eine Pause.',
    why: w(
      '↻ A2: в части с wenn глагол стоит в конце (müde bin), а в главной части после запятой глагол идёт на первое место: …, mache ich …',
      '↻ A2: wenn бөлүгүндө этиш аягында турат (müde bin), ал эми үтүрдөн кийинки башкы бөлүктө этиш биринчи орунга чыгат: …, mache ich …',
    ),
  },
]

/** Test definition `unit-28` (kind topic, 15 questions). */
export const UNIT_28_TEST: B1TestDef = {
  id: 'unit-28',
  title: s('Итоговый тест: юнит 28', 'Жыйынтыктоочу тест: 28-бөлүм'),
  kind: 'topic',
  level: 'B1',
  unit: 28,
  size: 15,
}

/**
 * Unit 28 final test, `b1-ft-28-01` … `-15`. Composition (curriculum v2 §7.2): 8 grammar (2 Futur I vs Präsens, 2 falls / sobald / solange, 2 verb + preposition
 * with wo(r)- / da(r)-, 2 recycled ↻: wenn of A2 Unit 14 and Infinitiv mit zu of Unit 23), 3 vocabulary, 4 reading, 0 listening — listening items enter a test only
 * after the text-to-speech playback has been verified on real devices. Reading items carry the German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy`
 * translate only the instruction and the question. All texts are fictional. Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_28_FINAL: A2TestQuestion[] = [
  {
    id: 'b1-ft-28-01',
    prompt: 'Welcher Satz ist eine Vermutung?',
    promptRu: 'Какое предложение — предположение?',
    promptKy: 'Кайсы сүйлөм — божомол?',
    options: ['Er wird wohl noch im Kurs sein.', 'Er ist heute im Kurs.', 'Er war gestern im Kurs.'],
    answer: 'Er wird wohl noch im Kurs sein.',
    skill: 'grammar',
    concept: 'b1-futur1-vermutungen',
    why: s(
      'Предположение о настоящем выражает wird + wohl + инфинитив. Остальные предложения сообщают факт — в настоящем и в прошедшем.',
      'Азыркы чак жөнүндө божомолду wird + wohl + инфинитив билдирет. Калган сүйлөмдөр фактыны билдирет — азыркы жана өткөн чакта.',
    ),
  },
  {
    id: 'b1-ft-28-02',
    prompt: 'In zehn Jahren ___ viele Menschen online studieren.',
    promptRu: 'Через десять лет многие люди будут учиться онлайн.',
    promptKy: 'Он жылдан кийин көптөгөн адамдар онлайн окушат.',
    options: ['studieren', 'werden', 'wurden'],
    answer: 'werden',
    skill: 'grammar',
    concept: 'b1-futur1-vermutungen',
    why: s(
      'Прогноз о будущем: werden (множественное число) + инфинитив studieren в конце. Wurden — прошедшее время.',
      'Келечек жөнүндө болжол: werden (көптүк сан) + аягында studieren инфинитиви. wurden — өткөн чак.',
    ),
  },
  {
    id: 'b1-ft-28-03',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Falls er keinen Platz bekommt, er kommt auf die Warteliste.',
      'Falls er bekommt keinen Platz, kommt er auf die Warteliste.',
      'Falls er keinen Platz bekommt, kommt er auf die Warteliste.',
    ],
    answer: 'Falls er keinen Platz bekommt, kommt er auf die Warteliste.',
    skill: 'grammar',
    concept: 'b1-falls-sobald-solange',
    why: s(
      'В придаточном предложении с falls глагол (bekommt) стоит в конце, а в главной части глагол (kommt) идёт сразу после запятой. В других вариантах порядок слов нарушен.',
      'falls менен кошумча бөлүктө этиш (bekommt) аягында турат, ал эми башкы бөлүктө этиш (kommt) үтүрдөн дароо кийин келет. Башка варианттарда сөздөрдүн ирети бузулган.',
    ),
  },
  {
    id: 'b1-ft-28-04',
    prompt: 'Ich rufe dich sofort an, ___ der Kurs vorbei ist.',
    promptRu: 'Я сразу позвоню тебе, как только закончится курс.',
    promptKy: 'Курс бүтөр замат мен сага дароо чалам.',
    options: ['falls', 'sobald', 'solange'],
    answer: 'sobald',
    skill: 'grammar',
    concept: 'b1-falls-sobald-solange',
    why: s(
      '«Как только закончится курс» — sobald. Solange («пока») по смыслу не подходит, а falls передаёт неуверенность.',
      '«Курс бүтөр замат» — sobald. solange («… бою») мааниси боюнча туура келбейт, ал эми falls ишенбестикти билдирет.',
    ),
  },
  {
    id: 'b1-ft-28-05',
    prompt: 'Ich bereite mich ___ die Prüfung vor.',
    promptRu: 'Я готовлюсь к экзамену.',
    promptKy: 'Мен экзаменге даярданып жатам.',
    options: ['auf', 'für', 'an'],
    answer: 'auf',
    skill: 'grammar',
    concept: 'b1-verben-praepositionen',
    why: s(
      'Sich vorbereiten всегда идёт с предлогом auf (+ Akkusativ): auf die Prüfung.',
      'sich vorbereiten дайыма auf предлогу менен жүрөт (+ Akkusativ): auf die Prüfung.',
    ),
  },
  {
    id: 'b1-ft-28-06',
    prompt: '___ interessierst du dich? – Für Medizin.',
    promptRu: 'Чем ты интересуешься? — Медициной.',
    promptKy: 'Сен эмнеге кызыгасың? — Медицинага.',
    options: ['Worauf', 'Woran', 'Wofür'],
    answer: 'Wofür',
    skill: 'grammar',
    concept: 'b1-verben-praepositionen',
    why: s(
      'Sich interessieren идёт с für, поэтому вопрос — wofür (wo + für). Worauf относится к auf, woran — к an.',
      'sich interessieren für менен жүрөт, ошондуктан суроо — wofür (wo + für). worauf auf менен, woran an менен байланыштуу.',
    ),
  },
  {
    id: 'b1-ft-28-07',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Wenn ich Zeit habe, lerne ich Deutsch.', 'Wenn ich Zeit habe, ich lerne Deutsch.', 'Wenn ich habe Zeit, lerne ich Deutsch.'],
    answer: 'Wenn ich Zeit habe, lerne ich Deutsch.',
    skill: 'grammar',
    concept: 'a2-wenn-saetze',
    why: s(
      '↻ A2: в части с wenn глагол стоит в конце (habe), а в главной части после запятой — на первом месте (lerne ich).',
      '↻ A2: wenn бөлүгүндө этиш аягында (habe), ал эми үтүрдөн кийинки башкы бөлүктө — биринчи орунда (lerne ich).',
    ),
  },
  {
    id: 'b1-ft-28-08',
    prompt: 'Ich habe vor, nächstes Jahr ein Studium ___.',
    promptRu: 'Я собираюсь в следующем году начать учёбу.',
    promptKy: 'Мен келерки жылы окуу баштоону пландап жатам.',
    options: ['beginnen', 'zu beginnen', 'beginne zu'],
    answer: 'zu beginnen',
    skill: 'grammar',
    concept: 'b1-infinitiv-mit-zu',
    why: s(
      '↻ Юнит 23: после «Ich habe vor,» инфинитив стоит с zu прямо перед ним: zu beginnen, и в самом конце предложения.',
      '↻ 23-бөлүм: «Ich habe vor,» сөзүнөн кийин инфинитив zu менен жана ал эң аягында турат: zu beginnen.',
    ),
  },
  {
    id: 'b1-ft-28-09',
    prompt: 'Geld vom Staat für das Studium heißt ___.',
    promptRu: 'Деньги от государства на учёбу называются ___.',
    promptKy: 'Окуу үчүн мамлекеттен берилген акча ___ деп аталат.',
    options: ['Kursgebühr', 'Fortschritt', 'Stipendium'],
    answer: 'Stipendium',
    skill: 'vocabulary',
    why: s(
      'Деньги на учёбу, которые человек получает, — Stipendium. Kursgebühr — плата за курс, Fortschritt — прогресс.',
      'Адам окуу үчүн алган акча — Stipendium. Kursgebühr — курс акысы, Fortschritt — ийгилик.',
    ),
  },
  {
    id: 'b1-ft-28-10',
    prompt: 'Wenn man eine Prüfung nicht besteht, fällt man ___.',
    promptRu: 'Если человек не сдал экзамен, он ___ (проваливается).',
    promptKy: 'Адам экзаменден өтпөсө, ал ___ (жыгылат).',
    options: ['durch', 'aus', 'weg'],
    answer: 'durch',
    skill: 'vocabulary',
    why: s(
      'Провалиться на экзамене — durchfallen (fällt durch). Другие слова образуют другие глаголы.',
      'Экзаменден өтпөй калуу — durchfallen (fällt durch). Башка сөздөр башка этиштерди түзөт.',
    ),
  },
  {
    id: 'b1-ft-28-11',
    prompt: 'Ein Kurs, den man neben der Arbeit besucht, ist ___.',
    promptRu: 'Курс, который посещают параллельно с работой, — ___.',
    promptKy: 'Иш менен катар барган курс — ___.',
    options: ['kostenpflichtig', 'berufsbegleitend', 'staatlich'],
    answer: 'berufsbegleitend',
    skill: 'vocabulary',
    why: s(
      'Учёба без отрыва от работы — berufsbegleitend. Kostenpflichtig — платный, staatlich — государственный.',
      'Иштен ажырабай окуу — berufsbegleitend. kostenpflichtig — акы төлөнүүчү, staatlich — мамлекеттик.',
    ),
  },
  {
    id: 'b1-ft-28-12',
    prompt:
      'Lies den Schulbrief (erfunden): „Liebe Eltern, am Dienstag findet um 19 Uhr ein Elternabend statt. Falls Sie nicht kommen können, schicken Sie bitte eine Entschuldigung.“ Was sollen Eltern tun, die nicht kommen können?',
    promptRu: 'Прочитайте школьное письмо (вымышленное). Что должны сделать родители, которые не смогут прийти?',
    promptKy: 'Мектептин катын окуңуз (ойдон чыгарылган). Келе албаган ата-энелер эмне кылышы керек?',
    options: ['Ein Kind schicken.', 'Anrufen.', 'Eine Entschuldigung schicken.'],
    answer: 'Eine Entschuldigung schicken.',
    skill: 'reading',
    why: s(
      'В письме: «Falls Sie nicht kommen können, schicken Sie bitte eine Entschuldigung». О звонке и о ребёнке ничего не сказано.',
      'Катта: «Falls Sie nicht kommen können, schicken Sie bitte eine Entschuldigung». Чалуу жана бала жиберүү жөнүндө эч нерсе айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-28-13',
    prompt:
      'Lies die Kursinfo (erfunden): „Der Sprachkurs beginnt am 5. September und dauert drei Monate. Die Kursgebühr beträgt 150 Euro. Wer sich bis zum 1. August anmeldet, zahlt nur 135 Euro.“ Was kostet der Kurs bei früher Anmeldung?',
    promptRu: 'Прочитайте информацию о курсе (вымышленную). Сколько стоит курс при ранней записи?',
    promptKy: 'Курс жөнүндө маалыматты окуңуз (ойдон чыгарылган). Эрте жазылганда курс канча турат?',
    options: ['150 Euro.', '135 Euro.', '115 Euro.'],
    answer: '135 Euro.',
    skill: 'reading',
    why: s(
      'В информации: «Wer sich bis zum 1. August anmeldet, zahlt nur 135 Euro». 150 евро — обычная цена, 115 евро не упоминается.',
      'Маалыматта: «Wer sich bis zum 1. August anmeldet, zahlt nur 135 Euro». 150 евро — кадимки баа, 115 евро айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-28-14',
    prompt:
      'Lies den Text (erfunden): „Mia sagt: Ich glaube, ich werde die Prüfung bestehen, denn ich habe gut gelernt. Mein Bruder wird die Prüfung wohl nicht bestehen, er hat kaum gelernt.“ Wer besteht laut Mia wohl nicht?',
    promptRu: 'Прочитайте текст (вымышленный). Кто, по мнению Мии, наверное, не сдаст?',
    promptKy: 'Текстти окуңуз (ойдон чыгарылган). Мианын оюнча ким, балким, өтпөйт?',
    options: ['Ihr Bruder.', 'Mia selbst.', 'Beide.'],
    answer: 'Ihr Bruder.',
    skill: 'reading',
    why: s(
      'В тексте: «Mein Bruder wird die Prüfung wohl nicht bestehen» — брат, скорее всего, не сдаст. Сама Миа уверена, что сдаст.',
      'Текстте: «Mein Bruder wird die Prüfung wohl nicht bestehen» — иниси, көрүнүшү боюнча, өтпөйт. Миянын өзү өтөрүнө ишенет.',
    ),
  },
  {
    id: 'b1-ft-28-15',
    prompt:
      'Lies den Bericht (erfunden): „Ich wollte im Auslandsjahr Spanisch lernen. Sobald ich genug Geld hatte, bin ich nach Madrid gefahren. Ich habe dort einen Kurs belegt und jeden Abend wiederholt.“ Was hat die Person getan, als sie genug Geld hatte?',
    promptRu: 'Прочитайте рассказ (вымышленный). Что сделал человек, когда у него появились деньги?',
    promptKy: 'Баянды окуңуз (ойдон чыгарылган). Акчасы жетиштүү болгондо адам эмне кылды?',
    options: ['Sie hat studiert.', 'Sie ist zurückgefahren.', 'Sie ist nach Madrid gefahren.'],
    answer: 'Sie ist nach Madrid gefahren.',
    skill: 'reading',
    why: s(
      'В тексте: «Sobald ich genug Geld hatte, bin ich nach Madrid gefahren». О возвращении и об учёбе в вузе не сказано.',
      'Текстте: «Sobald ich genug Geld hatte, bin ich nach Madrid gefahren». Кайтып келүү жана жогорку окуу жайында окуу жөнүндө айтылган эмес.',
    ),
  },
]
