import type { Exercise, L10n } from '../../types'
import type { A2TestDef, A2TestQuestion, L10nStrict } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 14 revision (Wiederholung) exercises, `a2-ex-14-01` … `-08` (3 fill / 3 choice / 2 order; concept 1 × 3, concept 2 × 2, concept 3 × 3 — the Stage 7B plan).
 * Authored independently of the final test below: no prompt, sentence or answer is shared. Positions of the correct option: fill 1 / 0 / 2, choice 2 / 1 / 0.
 */
export const UNIT_14_EXERCISES: Exercise[] = [
  {
    id: 'a2-ex-14-01',
    type: 'fill',
    unit: 14,
    concept: 'a2-imperativ',
    prompt: 'Du hast Fieber. ___ bitte eine Tablette!',
    promptRu: 'У тебя температура. Прими, пожалуйста, таблетку!',
    promptKy: 'Сенин ысытмаң бар. Сураныч, таблетка ичип ал!',
    options: ['Nehm', 'Nimm', 'Nimmst'],
    answer: 'Nimm',
    why: w(
      'Это совет «ты» (du): основа глагола без -st и без du. У nehmen гласная меняется e → i: nimm.',
      'Бул «сен» (du) үчүн кеңеш: -st жок жана du жок этиштин уңгусу алынат. nehmen этишинде үндүү e → i өзгөрөт: nimm.',
    ),
  },
  {
    id: 'a2-ex-14-02',
    type: 'choice',
    unit: 14,
    concept: 'a2-imperativ',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Nehmen bitte Sie die Tablette!', 'Sie nehmen bitte die Tablette!', 'Nehmen Sie bitte die Tablette!'],
    answer: 'Nehmen Sie bitte die Tablette!',
    why: w(
      'В вежливом указании (Sie) глагол стоит первым, а Sie — сразу за ним. Слово bitte идёт после Sie.',
      'Сылык көрсөтмөдө (Sie) этиш биринчи, ал эми Sie андан кийин дароо турат. bitte сөзү Sie сөзүнөн кийин келет.',
    ),
  },
  {
    id: 'a2-ex-14-03',
    type: 'order',
    unit: 14,
    concept: 'a2-imperativ',
    prompt: 'Bilde den Satz.',
    promptRu: 'Отдохни, пожалуйста.',
    promptKy: 'Сураныч, эс алып ал.',
    words: ['aus.', 'Ruh', 'bitte', 'dich'],
    answer: 'Ruh dich bitte aus.',
    why: w(
      'Глагол стоит первым, затем dich. Приставка aus уходит в самый конец.',
      'Этиш биринчи турат, андан кийин dich келет. aus приставкасы эң аягына чыгат.',
    ),
  },
  {
    id: 'a2-ex-14-04',
    type: 'fill',
    unit: 14,
    concept: 'a2-sollen-duerfen',
    prompt: 'Der Arzt sagt: Du ___ viel Wasser trinken.',
    promptRu: 'Врач говорит: тебе нужно пить много воды.',
    promptKy: 'Дарыгер айтат: сен көп суу ичишиң керек.',
    options: ['sollst', 'soll', 'sollen'],
    answer: 'sollst',
    why: w(
      'Sollen передаёт указание другого человека. К du подходит форма sollst. Формы soll и sollen — для ich/er и wir/sie.',
      'Sollen башка адамдын көрсөтмөсүн билдирет. du үчүн sollst формасы туура келет. soll жана sollen формалары ich/er жана wir/sie үчүн.',
    ),
  },
  {
    id: 'a2-ex-14-05',
    type: 'choice',
    unit: 14,
    concept: 'a2-sollen-duerfen',
    prompt: 'Ihr Chef sagt: „Sie dürfen heute nicht arbeiten.“ Was bedeutet das?',
    promptRu: 'Ваш начальник говорит: «Вам сегодня нельзя работать». Что это значит?',
    promptKy: 'Жетекчиңиз айтат: «Сизге бүгүн иштөөгө болбойт». Бул эмнени билдирет?',
    options: ['Sie müssen heute länger arbeiten.', 'Sie bleiben zu Hause, Arbeiten geht heute nicht.', 'Sie können heute gut arbeiten.'],
    answer: 'Sie bleiben zu Hause, Arbeiten geht heute nicht.',
    why: w(
      'Nicht dürfen значит «нельзя». Müssen и können говорят о другом: «нужно» и «можете».',
      'Nicht dürfen «болбойт» дегенди билдирет. Müssen жана können башка нерсени билдирет: «керек» жана «болот».',
    ),
  },
  {
    id: 'a2-ex-14-06',
    type: 'order',
    unit: 14,
    concept: 'a2-wenn-saetze',
    prompt: 'Bilde den Satz.',
    promptRu: 'Когда я устал, я отдыхаю.',
    promptKy: 'Чарчаганымда мен эс алам.',
    words: ['aus.', 'Wenn', 'ich', 'müde', 'bin,', 'ruhe', 'ich', 'mich'],
    answer: 'Wenn ich müde bin, ruhe ich mich aus.',
    why: w(
      'В части с wenn глагол bin стоит в конце. После запятой главная часть начинается с глагола: ruhe ich mich aus (приставка aus — в конце).',
      'wenn бөлүгүндө bin этиши аягында турат. Үтүрдөн кийин башкы бөлүк этиштен башталат: ruhe ich mich aus (aus приставкасы аягында).',
    ),
  },
  {
    id: 'a2-ex-14-07',
    type: 'fill',
    unit: 14,
    concept: 'a2-wenn-saetze',
    prompt: 'Ich bleibe zu Hause, wenn ich Fieber ___.',
    promptRu: 'Я остаюсь дома, если у меня температура.',
    promptKy: 'Ысытмам болсо, мен үйдө калам.',
    options: ['hast', 'haben', 'habe'],
    answer: 'habe',
    why: w(
      'Глагол стоит в самом конце части с wenn и подходит к подлежащему ich: habe.',
      'Этиш wenn бөлүгүнүн эң аягында турат жана ich ээсине туура келет: habe.',
    ),
  },
  {
    id: 'a2-ex-14-08',
    type: 'choice',
    unit: 14,
    concept: 'a2-wenn-saetze',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Wenn ich Husten habe, trinke ich Tee.', 'Wenn ich Husten habe, ich trinke Tee.', 'Wenn ich habe Husten, trinke ich Tee.'],
    answer: 'Wenn ich Husten habe, trinke ich Tee.',
    why: w(
      'В части с wenn глагол — в конце (Husten habe), а главная часть после запятой начинается с глагола (trinke ich).',
      'wenn бөлүгүндө этиш аягында (Husten habe), ал эми үтүрдөн кийинки башкы бөлүк этиштен башталат (trinke ich).',
    ),
  },
]

/** Test definition `unit-14` (kind topic, 15 questions). */
export const UNIT_14_TEST: A2TestDef = {
  id: 'unit-14',
  title: s('Итоговый тест: юнит 14', 'Жыйынтыктоочу тест: 14-бөлүм'),
  kind: 'topic',
  level: 'A2',
  unit: 14,
  size: 15,
}

/**
 * Unit 14 final test, `a2-ft-14-01` … `-15`. Composition: 6 grammar items (2 + 2 + 2, each in a small everyday situation), 3 vocabulary items,
 * 6 items that read a short German text or message (appointment note, leaflet, emergency, advice, sick note, doctor's dialogue).
 * Reading items carry the German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate only the instruction and the question.
 * Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_14_FINAL: A2TestQuestion[] = [
  {
    id: 'a2-ft-14-01',
    prompt: 'Dein Freund hat Fieber und isst nichts. Du sagst: „___ etwas!“',
    promptRu: 'У твоего друга температура, и он ничего не ест. Ты говоришь: «Съешь что-нибудь!»',
    promptKy: 'Досуңдун ысытмасы бар жана ал эч нерсе жебей жатат. Сен айтасың: «Бир нерсе же!»',
    options: ['Iss', 'Esse', 'Isst'],
    answer: 'Iss',
    skill: 'grammar',
    concept: 'a2-imperativ',
    why: s(
      'Это совет «ты» (du): основа глагола без -st. У essen гласная меняется e → i: iss.',
      'Бул «сен» (du) үчүн кеңеш: -st жок этиштин уңгусу алынат. essen этишинде үндүү e → i өзгөрөт: iss.',
    ),
  },
  {
    id: 'a2-ft-14-02',
    prompt: 'Der Arzt sagt zu Ihnen: „___ Sie bitte drei Tage im Bett.“',
    promptRu: 'Врач говорит вам: «Оставайтесь, пожалуйста, три дня в постели».',
    promptKy: 'Дарыгер сизге айтат: «Сураныч, үч күн керебетте жатыңыз».',
    options: ['Bleibst', 'Bleiben', 'Bleib'],
    answer: 'Bleiben',
    skill: 'grammar',
    concept: 'a2-imperativ',
    why: s(
      'К вежливой форме «вы» (Sie) берут инфинитив: bleiben Sie. Bleib — форма для «ты»; bleibst — обычная форма с -st («ты остаёшься»), в указании её нет.',
      '«Сиз» (Sie) сылык формасы үчүн инфинитив алынат: bleiben Sie. Bleib — «сен» үчүн форма; bleibst — -st менен болгон жөнөкөй форма («сен калып жатасың»), көрсөтмөдө ал жок.',
    ),
  },
  {
    id: 'a2-ft-14-03',
    prompt: 'Du bist sehr müde. Deine Freundin sagt: „___ dich aus!“',
    promptRu: 'Ты очень устал. Твоя подруга говорит: «Отдохни!»',
    promptKy: 'Сен абдан чарчадың. Курбуң айтат: «Эс алып ал!»',
    options: ['Ruhe', 'Ruhst', 'Ruh'],
    answer: 'Ruh',
    skill: 'grammar',
    concept: 'a2-imperativ',
    why: s(
      'Это совет «ты» (du): основа ruh без окончания; местоимение dich идёт сразу за глаголом, приставка aus — в конце.',
      'Бул «сен» (du) үчүн кеңеш: ruh уңгусу аякталышсыз; dich ат атоочу этиштен кийин дароо келет, aus приставкасы аягында.',
    ),
  },
  {
    id: 'a2-ft-14-04',
    prompt: 'Meine Mutter ist krank. Der Arzt sagt, sie ___ viel schlafen.',
    promptRu: 'Моя мама больна. Врач говорит, что ей нужно много спать.',
    promptKy: 'Менин апам ооруп калды. Дарыгер анын көп уктоосу керек дейт.',
    options: ['sollen', 'soll', 'sollst'],
    answer: 'soll',
    skill: 'grammar',
    concept: 'a2-sollen-duerfen',
    why: s(
      'К подлежащему sie (она) подходит форма soll. Sollen говорит об указании врача. Формы sollen и sollst подходят другим лицам.',
      'sie (ал) ээсине soll формасы туура келет. Sollen дарыгердин көрсөтмөсүн билдирет. sollen жана sollst формалары башка жактарга туура келет.',
    ),
  },
  {
    id: 'a2-ft-14-05',
    prompt: 'Mit Fieber ___ Kinder nicht in die Schule gehen.',
    promptRu: 'С температурой детям нельзя ходить в школу.',
    promptKy: 'Ысытма болгондо балдарга мектепке барууга болбойт.',
    options: ['dürfen', 'darf', 'dürft'],
    answer: 'dürfen',
    skill: 'grammar',
    concept: 'a2-sollen-duerfen',
    why: s(
      'Подлежащее Kinder — множественное число (sie), поэтому dürfen. Nicht dürfen значит «нельзя». Форма darf — для ich/er, dürft — для ihr.',
      'Kinder ээси — көптүк сан (sie), ошондуктан dürfen. Nicht dürfen «болбойт» дегенди билдирет. darf формасы ich/er үчүн, dürft — ihr үчүн.',
    ),
  },
  {
    id: 'a2-ft-14-06',
    prompt: 'Wenn du Fieber hast, ___ du nicht arbeiten.',
    promptRu: 'Если у тебя температура, тебе нельзя работать.',
    promptKy: 'Ысытмаң болсо, сага иштөөгө болбойт.',
    options: ['darf', 'dürfen', 'darfst'],
    answer: 'darfst',
    skill: 'grammar',
    concept: 'a2-wenn-saetze',
    why: s(
      'После части с wenn главная часть начинается с глагола, а он должен подходить к du: darfst. Формы darf и dürfen — для других лиц.',
      'wenn бөлүгүнөн кийин башкы бөлүк этиштен башталат, ал du ээсине туура келиши керек: darfst. darf жана dürfen формалары башка жактар үчүн.',
    ),
  },
  {
    id: 'a2-ft-14-07',
    prompt: 'Ich kann nicht gut hören. Mein ___ tut weh.',
    promptRu: 'Я плохо слышу. У меня болит ухо.',
    promptKy: 'Мен жакшы уга албайм. Менин кулагым ооруйт.',
    options: ['Auge', 'Ohr', 'Zahn'],
    answer: 'Ohr',
    skill: 'vocabulary',
    why: s(
      'Слышат ухом: das Ohr. Das Auge — глаз, der Zahn — зуб.',
      'Кулак менен угушат: das Ohr. Das Auge — көз, der Zahn — тиш.',
    ),
  },
  {
    id: 'a2-ft-14-08',
    prompt: 'Ich habe Fieber und Husten. Ich habe eine ___.',
    promptRu: 'У меня температура и кашель. У меня простуда.',
    promptKy: 'Менин ысытмам жана жөтөлүм бар. Мага суук тийди.',
    options: ['Erkältung', 'Salbe', 'Praxis'],
    answer: 'Erkältung',
    skill: 'vocabulary',
    why: s(
      'Температура и кашель — признаки простуды: eine Erkältung. Die Salbe — мазь, die Praxis — кабинет врача.',
      'Ысытма жана жөтөл — суук тийүүнүн белгилери: eine Erkältung. Die Salbe — сүртүүчү дары, die Praxis — дарыгердин кабинети.',
    ),
  },
  {
    id: 'a2-ft-14-09',
    prompt: 'Welches Wort passt nicht zum Thema „Körper“?',
    promptRu: 'Какое слово не подходит к теме «Тело»?',
    promptKy: '«Дене» темасына кайсы сөз туура келбейт?',
    options: ['der Rücken', 'das Bein', 'der Krankenwagen'],
    answer: 'der Krankenwagen',
    skill: 'vocabulary',
    why: s(
      'Der Rücken и das Bein — части тела. Der Krankenwagen — машина скорой помощи.',
      'Der Rücken жана das Bein — дененин бөлүктөрү. Der Krankenwagen — тез жардам машинасы.',
    ),
  },
  {
    id: 'a2-ft-14-10',
    prompt:
      'Lies die Nachricht der Praxis: „Guten Tag Herr Weber, Ihr Termin ist am Donnerstag um 10 Uhr. Bitte bringen Sie Ihre Versichertenkarte mit. Wenn Sie nicht kommen können, rufen Sie uns bitte an.“ Was soll Herr Weber tun, wenn er nicht kommen kann?',
    promptRu: 'Прочитайте сообщение из кабинета врача. Что должен сделать господин Вебер, если не сможет прийти?',
    promptKy: 'Билдирүүнү окуңуз. Эгер келе албаса, Вебер мырза эмне кылышы керек?',
    options: ['Er soll zur Notaufnahme gehen.', 'Er soll die Praxis anrufen.', 'Er soll eine Tablette nehmen.'],
    answer: 'Er soll die Praxis anrufen.',
    skill: 'reading',
    why: s(
      'В сообщении сказано: «Wenn Sie nicht kommen können, rufen Sie uns bitte an». Значит, нужно позвонить в кабинет.',
      'Билдирүүдө айтылган: «Wenn Sie nicht kommen können, rufen Sie uns bitte an». Демек, кабинетке чалуу керек.',
    ),
  },
  {
    id: 'a2-ft-14-11',
    prompt:
      'Lies die Information: „Salbe gegen Rückenschmerzen: Zweimal am Tag auf den Rücken geben. Nicht in die Augen bringen. Die Hände danach waschen.“ Was soll der Patient nach der Salbe tun?',
    promptRu: 'Прочитайте информацию. Что нужно сделать после мази?',
    promptKy: 'Маалыматты окуңуз. Сүртүүчү дарыдан кийин эмне кылуу керек?',
    options: ['Die Hände waschen.', 'Die Augen waschen.', 'Zum Arzt gehen.'],
    answer: 'Die Hände waschen.',
    skill: 'reading',
    why: s(
      'В тексте сказано: «Die Hände danach waschen». Значит, после мази нужно вымыть руки.',
      'Текстте айтылган: «Die Hände danach waschen». Демек, сүртүүчү дарыдан кийин колду жуу керек.',
    ),
  },
  {
    id: 'a2-ft-14-12',
    prompt:
      'Lies den Text: „Auf der Straße liegt ein Mann. Er bewegt sich nicht. Eine Frau ruft die 112 an. Sie sagt: Hier ist ein Unfall in der Bahnhofstraße. Ein Mann liegt auf der Straße.“ Was sagt die Frau am Telefon?',
    promptRu: 'Прочитайте текст. Что говорит женщина по телефону?',
    promptKy: 'Текстти окуңуз. Аял телефондо эмне дейт?',
    options: ['Sie fragt nach einem Termin.', 'Sie sagt: Ich habe Fieber.', 'Sie sagt, wo der Unfall ist und was passiert ist.'],
    answer: 'Sie sagt, wo der Unfall ist und was passiert ist.',
    skill: 'reading',
    why: s(
      'Женщина называет место (Bahnhofstraße) и говорит, что случилось: на улице лежит человек. Так и нужно говорить в экстренном звонке.',
      'Аял жерин (Bahnhofstraße) атап, эмне болгонун айтат: көчөдө адам жатат. Шашылыш чалууда так ушундай айтуу керек.',
    ),
  },
  {
    id: 'a2-ft-14-13',
    prompt:
      'Lies die Nachricht: „Hallo Lena, ich habe seit gestern Husten und Schnupfen, aber kein Fieber. Ich bin sehr müde. Was soll ich tun? Jan“ Welche Antwort passt?',
    promptRu: 'Прочитайте сообщение. Какой ответ подходит?',
    promptKy: 'Билдирүүнү окуңуз. Кайсы жооп ылайыктуу?',
    options: ['Bleib heute zu Hause und trink viel Tee.', 'Geh heute zum Sport, das ist gesund.', 'Iss nichts und trink nichts.'],
    answer: 'Bleib heute zu Hause und trink viel Tee.',
    skill: 'reading',
    concept: 'a2-imperativ',
    why: s(
      'У Яна кашель, насморк и усталость, но нет температуры. Разумный совет — остаться дома и пить чай. Спорт и отказ от еды и питья не помогут.',
      'Яндын жөтөлү, тумоосу жана чарчоосу бар, бирок ысытмасы жок. Акылдуу кеңеш — үйдө калып, чай ичүү. Спорт жана жеп-ичпөө жардам бербейт.',
    ),
  },
  {
    id: 'a2-ft-14-14',
    prompt:
      'Lies die E-Mail: „Sehr geehrte Frau Klein, ich bin krank und darf diese Woche nicht arbeiten. Der Arzt sagt, ich soll im Bett bleiben. Wenn Sie Fragen haben, rufen Sie mich bitte an. Mit freundlichen Grüßen, Paul Roth“ Was sagt der Arzt?',
    promptRu: 'Прочитайте письмо. Что говорит врач?',
    promptKy: 'Катты окуңуз. Дарыгер эмне дейт?',
    options: ['Paul soll zur Arbeit gehen.', 'Paul soll im Bett bleiben.', 'Paul soll Frau Klein anrufen.'],
    answer: 'Paul soll im Bett bleiben.',
    skill: 'reading',
    concept: 'a2-sollen-duerfen',
    why: s(
      'В письме сказано: «Der Arzt sagt, ich soll im Bett bleiben». Значит, Paul должен оставаться в постели.',
      'Катта айтылган: «Der Arzt sagt, ich soll im Bett bleiben». Демек, Paul керебетте жатышы керек.',
    ),
  },
  {
    id: 'a2-ft-14-15',
    prompt:
      'Lies das Gespräch: „Arzt: Wo tut es weh? Patientin: Der Rücken tut mir seit drei Tagen weh. Arzt: Haben Sie Fieber? Patientin: Nein.“ Was ist das Problem der Patientin?',
    promptRu: 'Прочитайте разговор. В чём проблема пациентки?',
    promptKy: 'Сүйлөшүүнү окуңуз. Бейтаптын көйгөйү эмнеде?',
    options: ['Der Kopf tut ihr seit drei Tagen weh.', 'Sie hat seit drei Tagen Fieber.', 'Der Rücken tut ihr seit drei Tagen weh.'],
    answer: 'Der Rücken tut ihr seit drei Tagen weh.',
    skill: 'reading',
    why: s(
      'Пациентка говорит: болит спина (der Rücken) уже три дня, температуры нет. Остальные варианты в разговоре не названы.',
      'Бейтап белинин (der Rücken) үч күндөн бери оорутканын айтат, ысытмасы жок. Калган варианттар сүйлөшүүдө айтылган эмес.',
    ),
  },
]
