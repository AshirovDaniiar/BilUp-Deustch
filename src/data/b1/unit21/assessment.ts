import type { Exercise, L10n } from '../../types'
import type { A2TestQuestion, L10nStrict } from '../../a2/types'
import type { B1TestDef } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 21 revision (Wiederholung) exercises, `b1-ex-21-01` … `-10`: 2 fill / 5 choice / 3 order on the unit's two concepts (concept 1 × 4,
 * concept 2 × 4), plus 2 RECYCLED items (↻ A2: Perfekt, weil-clause) without a concept of this unit — the spaced-revision part. Authored
 * independently of the final test: no prompt, sentence or answer is shared.
 */
export const UNIT_21_EXERCISES: Exercise[] = [
  {
    id: 'b1-ex-21-01',
    type: 'choice',
    unit: 21,
    concept: 'b1-praeteritum-erzaehlen',
    prompt:
      'Bringe die Sätze in die richtige Reihenfolge: (1) Schließlich holte mich mein Bruder ab. (2) Ich landete am Abend in Frankfurt. (3) Dann nahm ich den Zug nach Kassel.',
    promptRu: 'Расставьте предложения по порядку, чтобы история была логичной (текст из трёх предложений).',
    promptKy: 'Окуя логикалуу болушу үчүн сүйлөмдөрдү туура иретке коюңуз (үч сүйлөмдөн турган текст).',
    options: ['2 – 3 – 1', '2 – 1 – 3', '3 – 2 – 1'],
    answer: '2 – 3 – 1',
    why: w(
      'Порядок задают слова-сигналы: «am Abend» (начало) → «Dann» (следующий шаг) → «Schließlich» (конец). Правильно: 2 – 3 – 1. Все три предложения в Präteritum: landete, nahm, holte … ab.',
      'Иретти белги сөздөр көрсөтөт: «am Abend» (башы) → «Dann» (кийинки кадам) → «Schließlich» (аягы). Туура жооп: 2 – 3 – 1. Үч сүйлөм тең Präteritum формасында: landete, nahm, holte … ab.',
    ),
  },
  {
    id: 'b1-ex-21-02',
    type: 'choice',
    unit: 21,
    concept: 'b1-praeteritum-erzaehlen',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Dann nahm ich den Zug.', 'Dann ich nahm den Zug.', 'Dann nehmte ich den Zug.'],
    answer: 'Dann nahm ich den Zug.',
    why: w(
      'После «Dann» глагол стоит на втором месте (nahm ich), а nehmen — неправильный глагол: nahm, а не nehmte.',
      '«Dann» сөзүнөн кийин этиш экинчи орунда турат (nahm ich), ал эми nehmen — туура эмес этиш: nehmte эмес, nahm.',
    ),
  },
  {
    id: 'b1-ex-21-03',
    type: 'order',
    unit: 21,
    concept: 'b1-praeteritum-erzaehlen',
    prompt: 'Bilde den Satz.',
    promptRu: 'Я целый час шёл по аэропорту.',
    promptKy: 'Мен аэропорттун ичинде бир саат бою жүрдүм.',
    words: ['Flughafen.', 'den', 'durch', 'lief', 'Ich', 'eine', 'Stunde'],
    answer: 'Ich lief eine Stunde durch den Flughafen.',
    why: w(
      'Спрягаемый глагол (lief) — на втором месте, сразу после подлежащего. Время (eine Stunde) и место (durch den Flughafen) идут после него.',
      'Жакталган этиш (lief) экинчи орунда, ээден дароо кийин турат. Убакыт (eine Stunde) жана жер (durch den Flughafen) андан кийин келет.',
    ),
  },
  {
    id: 'b1-ex-21-04',
    type: 'fill',
    unit: 21,
    concept: 'b1-praeteritum-erzaehlen',
    prompt: 'Als ich aufwachte, ___ der Zug schon in Göttingen.',
    promptRu: 'Когда я проснулся, поезд уже стоял в Геттингене.',
    promptKy: 'Мен ойгонгондо поезд Геттингенде эле турган.',
    options: ['stand', 'stehte', 'gestanden'],
    answer: 'stand',
    why: w(
      'Stehen — неправильный глагол: stand. «stehte» — неверная форма, а gestanden нужен только вместе с haben или sein.',
      'Stehen — туура эмес этиш: stand. «stehte» — туура эмес форма, ал эми gestanden haben же sein менен гана керек.',
    ),
  },
  {
    id: 'b1-ex-21-05',
    type: 'choice',
    unit: 21,
    concept: 'b1-temporale-konnektoren',
    prompt: 'Welche kleine Geschichte ist richtig und logisch erzählt?',
    promptRu: 'Какой короткий рассказ составлен правильно и логично?',
    promptKy: 'Кайсы кыска баян туура жана логикалуу түзүлгөн?',
    options: [
      'Zuerst ging ich zum Bahnhof. Bevor ich nahm den Zug, kaufte ich eine Fahrkarte. Dann fuhr ich nach Köln.',
      'Zuerst ging ich zum Bahnhof. Bevor ich den Zug nahm, ich kaufte eine Fahrkarte. Dann fuhr ich nach Köln.',
      'Zuerst ging ich zum Bahnhof. Bevor ich den Zug nahm, kaufte ich eine Fahrkarte. Dann fuhr ich nach Köln.',
    ],
    answer: 'Zuerst ging ich zum Bahnhof. Bevor ich den Zug nahm, kaufte ich eine Fahrkarte. Dann fuhr ich nach Köln.',
    why: w(
      'В первом тексте после bevor глагол стоит не в конце (nahm den Zug), во втором после придаточного нет перестановки (ich kaufte). В третьем всё верно: Bevor ich den Zug nahm, kaufte ich … — и события идут в логичном порядке.',
      'Биринчи текстте bevor сөзүнөн кийин этиш аягында турбайт (nahm den Zug), экинчисинде bevor менен башталган бөлүктөн кийин сөз иретинин алмашуусу жок (ich kaufte). Үчүнчүсүндө баары туура: Bevor ich den Zug nahm, kaufte ich … — жана окуялар логикалуу иретте.',
    ),
  },
  {
    id: 'b1-ex-21-06',
    type: 'choice',
    unit: 21,
    concept: 'b1-temporale-konnektoren',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Seitdem ich in Berlin wohne, lerne ich Deutsch.',
      'Seitdem ich wohne in Berlin, lerne ich Deutsch.',
      'Seitdem ich in Berlin wohne, ich lerne Deutsch.',
    ],
    answer: 'Seitdem ich in Berlin wohne, lerne ich Deutsch.',
    why: w(
      'В придаточном предложении глагол стоит в конце (wohne), а в главном, которое идёт после запятой, — сразу за запятой (lerne ich).',
      'Бүтүндөмө сүйлөмдө этиш аягында турат (wohne), ал эми үтүрдөн кийинки башкы бөлүктө — үтүрдөн дароо кийин (lerne ich).',
    ),
  },
  {
    id: 'b1-ex-21-07',
    type: 'order',
    unit: 21,
    concept: 'b1-temporale-konnektoren',
    prompt: 'Bilde den Satz.',
    promptRu: 'Перед уходом я позвонил.',
    promptKy: 'Кетерден мурун мен чалдым.',
    words: ['an.', 'ich', 'Bevor', 'ging,', 'rief', 'ich'],
    answer: 'Bevor ich ging, rief ich an.',
    why: w(
      'Придаточное с bevor стоит первым: глагол в конце (ging). Затем сразу глагол главного предложения: rief ich … an.',
      'bevor менен башталган сүйлөм бөлүгү биринчи турат: этиш аягында (ging). Андан кийин дароо башкы бөлүктүн этиши: rief ich … an.',
    ),
  },
  {
    id: 'b1-ex-21-08',
    type: 'choice',
    unit: 21,
    concept: 'b1-temporale-konnektoren',
    prompt: 'Zwei Dinge passierten gleichzeitig. Welches Wort passt? „___ ich schlief, kam er nach Hause.“',
    promptRu: 'Две вещи произошли одновременно. Какое слово подходит?',
    promptKy: 'Эки нерсе бир убакта болду. Кайсы сөз ылайыктуу?',
    options: ['Während', 'Bevor', 'Bis'],
    answer: 'Während',
    why: w(
      'Während = «пока, в то время как»: оба события шли одновременно. Bevor означало бы «до того как», bis — «пока не».',
      'Während = «…ып жатканда»: эки окуя тең бир убакта өттү. Bevor «…гандан мурун» дегенди, bis — «…ганга чейин» дегенди билдирет.',
    ),
  },
  // ↻ Wiederholung (recycled from A2, spaced revision; no concept of this unit)
  {
    id: 'b1-ex-21-09',
    type: 'fill',
    unit: 21,
    prompt: 'Gestern bin ich spät nach Hause ___.',
    promptRu: 'Вчера я поздно вернулся домой.',
    promptKy: 'Кечээ мен үйгө кеч келдим.',
    options: ['gekommen', 'gekommt', 'kommen'],
    answer: 'gekommen',
    why: w(
      '↻ A2: в разговоре о прошлом — Perfekt. С sein: bin … gekommen. Kommen — неправильный глагол, Partizip II — gekommen.',
      '↻ A2: өткөн чак жөнүндө сүйлөшкөндө — Perfekt. sein менен: bin … gekommen. Kommen — туура эмес этиш, Partizip II — gekommen.',
    ),
  },
  {
    id: 'b1-ex-21-10',
    type: 'order',
    unit: 21,
    prompt: 'Bilde den Satz.',
    promptRu: 'Я был усталым, потому что плохо спал.',
    promptKy: 'Мен начар уктаганым үчүн чарчаган элем.',
    words: ['geschlafen', 'habe.', 'weil', 'schlecht', 'Ich', 'müde,', 'ich', 'war'],
    answer: 'Ich war müde, weil ich schlecht geschlafen habe.',
    why: w(
      '↻ A2: после weil спрягаемый глагол стоит в самом конце: …, weil ich schlecht geschlafen habe.',
      '↻ A2: weil сөзүнөн кийин этиш эң аягында турат: …, weil ich schlecht geschlafen habe.',
    ),
  },
]

/** Test definition `unit-21` (kind topic, 15 questions). */
export const UNIT_21_TEST: B1TestDef = {
  id: 'unit-21',
  title: s('Итоговый тест: юнит 21', 'Жыйынтыктоочу тест: 21-бөлүм'),
  kind: 'topic',
  level: 'B1',
  unit: 21,
  size: 15,
}

/**
 * Unit 21 final test, `b1-ft-21-01` … `-15`. Composition (curriculum v2 §7.2): 8 grammar (6 gap-fill/recognition on the two concepts + 2 recycled A2
 * items ↻), 3 vocabulary, 4 reading, 0 listening — listening items enter a test only after the text-to-speech playback has been verified on real
 * devices. Reading items carry the German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate only the instruction and the question.
 * Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_21_FINAL: A2TestQuestion[] = [
  {
    id: 'b1-ft-21-01',
    prompt: 'Als Kind ___ ich bei meinen Großeltern.',
    promptRu: 'В детстве я жил у бабушки и дедушки.',
    promptKy: 'Балалык чагымда мен чоң атам менен чоң энемдин үйүндө жашадым.',
    options: ['wohnte', 'wohnt', 'gewohnt'],
    answer: 'wohnte',
    skill: 'grammar',
    concept: 'b1-praeteritum-erzaehlen',
    why: s(
      'Правильный глагол wohnen в Präteritum: основа + -te → ich wohnte. Wohnt — это Präsens, gewohnt — Partizip II.',
      'Туура этиш wohnen Präteritum формасында: уңгу + -te → ich wohnte. Wohnt — Präsens, gewohnt — Partizip II.',
    ),
  },
  {
    id: 'b1-ft-21-02',
    prompt: 'Am Montag ___ mein neuer Job.',
    promptRu: 'В понедельник началась моя новая работа.',
    promptKy: 'Дүйшөмбүдө менин жаңы жумушум башталды.',
    options: ['beginnte', 'begann', 'begonnen'],
    answer: 'begann',
    skill: 'grammar',
    concept: 'b1-praeteritum-erzaehlen',
    why: s(
      'Beginnen — неправильный глагол: begann. «Beginnte» не существует, а begonnen нужно для Perfekt (hat begonnen).',
      'Beginnen — туура эмес этиш: begann. «Beginnte» жок, ал эми begonnen Perfekt үчүн керек (hat begonnen).',
    ),
  },
  {
    id: 'b1-ft-21-03',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Wir fahrten nach Wien und sahten viele Museen.',
      'Wir fuhren nach Wien und haben gesehen viele Museen.',
      'Wir fuhren nach Wien und sahen viele Museen.',
    ],
    answer: 'Wir fuhren nach Wien und sahen viele Museen.',
    skill: 'grammar',
    concept: 'b1-praeteritum-erzaehlen',
    why: s(
      'Fahren → fuhr, sehen → sah (wir: fuhren, sahen). В одном предложении не смешивают Präteritum и Perfekt.',
      'Fahren → fuhr, sehen → sah (wir: fuhren, sahen). Бир сүйлөмдө Präteritum менен Perfekt аралаштырылбайт.',
    ),
  },
  {
    id: 'b1-ft-21-04',
    prompt: '___ ich Deutsch lerne, verstehe ich die Nachrichten besser.',
    promptRu: 'С тех пор как я учу немецкий, я лучше понимаю новости.',
    promptKy: 'Немис тилин үйрөнгөндөн бери мен жаңылыктарды жакшыраак түшүнөм.',
    options: ['Bevor', 'Seitdem', 'Bis'],
    answer: 'Seitdem',
    skill: 'grammar',
    concept: 'b1-temporale-konnektoren',
    why: s(
      'Начало в прошлом и продолжение до сегодня — seitdem («с тех пор как»). Bevor и bis здесь по смыслу не подходят.',
      'Башталышы өткөндө жана бүгүнкүгө чейин уланат — seitdem («…ган убактан бери»). Bevor жана bis бул жерде маанилүү эмес.',
    ),
  },
  {
    id: 'b1-ft-21-05',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Bevor wir aßen, rief ich meine Mutter an.',
      'Bevor wir aßen, ich rief meine Mutter an.',
      'Bevor aßen wir, rief ich meine Mutter an.',
    ],
    answer: 'Bevor wir aßen, rief ich meine Mutter an.',
    skill: 'grammar',
    concept: 'b1-temporale-konnektoren',
    why: s(
      'В придаточном предложении глагол в конце (wir aßen), а сразу после запятой идёт глагол главного: rief ich.',
      'Бүтүндөмө сүйлөмдө этиш аягында (wir aßen), ал эми үтүрдөн дароо кийин башкы бөлүктүн этиши келет: rief ich.',
    ),
  },
  {
    id: 'b1-ft-21-06',
    prompt: 'Ich wartete am Bahnhof, ___ der Zug kam.',
    promptRu: 'Я ждал на вокзале, пока не пришёл поезд.',
    promptKy: 'Мен поезд келгенге чейин вокзалда күттүм.',
    options: ['bevor', 'während', 'bis'],
    answer: 'bis',
    skill: 'grammar',
    concept: 'b1-temporale-konnektoren',
    why: s(
      'Ожидание продолжалось до момента, когда пришёл поезд: bis («пока не»). Während значило бы «одновременно», bevor — «до того как».',
      'Күтүү поезд келген учурга чейин созулду: bis («…га чейин»). Während «бир убакта» дегенди, bevor — «…га чейин» дегенди билдирет.',
    ),
  },
  {
    id: 'b1-ft-21-07',
    prompt: 'Gestern ___ ich lange im Park spazieren gegangen.',
    promptRu: 'Вчера я долго гулял в парке.',
    promptKy: 'Кечээ мен паркта көпкө сейилдедим.',
    options: ['habe', 'bin', 'ist'],
    answer: 'bin',
    skill: 'grammar',
    concept: 'a2-perfekt-erfahrungen',
    why: s(
      '↻ A2: gehen — глагол движения, Perfekt образуется с sein: bin … gegangen.',
      '↻ A2: gehen — кыймыл этиши, Perfekt sein менен түзүлөт: bin … gegangen.',
    ),
  },
  {
    id: 'b1-ft-21-08',
    prompt: 'Als ich ein Kind ___, wohnten wir auf dem Land.',
    promptRu: 'Когда я был ребёнком, мы жили в деревне.',
    promptKy: 'Мен бала кезимде биз айылда жашачубуз.',
    options: ['bin', 'wurde', 'war'],
    answer: 'war',
    skill: 'grammar',
    concept: 'a2-wenn-als',
    why: s(
      '↻ A2: als — для одного периода или события в прошлом; глагол в Präteritum: als ich ein Kind war.',
      '↻ A2: als — өткөндөгү бир мезгил же бир окуя үчүн; этиш Präteritum формасында: als ich ein Kind war.',
    ),
  },
  {
    id: 'b1-ft-21-09',
    prompt: 'Ich habe den Bus ___. Jetzt muss ich zu Fuß gehen.',
    promptRu: 'Я упустил автобус. Теперь мне придётся идти пешком.',
    promptKy: 'Мен автобуска жетпей калдым. Эми жөө баруумга туура келет.',
    options: ['verpasst', 'bemerkt', 'erlebt'],
    answer: 'verpasst',
    skill: 'vocabulary',
    why: s(
      'Verpassen = упустить, опоздать на транспорт: «Ich habe den Bus verpasst». Bemerken — заметить, erleben — пережить.',
      'Verpassen = транспортко жетпей калуу: «Ich habe den Bus verpasst». Bemerken — байкоо, erleben — башынан өткөрүү.',
    ),
  },
  {
    id: 'b1-ft-21-10',
    prompt: 'Als ich meinen Pass wiederfand, war ich sehr ___.',
    promptRu: 'Когда я снова нашёл свой паспорт, я очень ___.',
    promptKy: 'Паспортумду кайра тапканда мен абдан ___.',
    options: ['enttäuscht', 'erleichtert', 'peinlich'],
    answer: 'erleichtert',
    skill: 'vocabulary',
    why: s(
      'Потерянная вещь найдена — человек чувствует облегчение: erleichtert. Enttäuscht — разочарован.',
      'Жоголгон нерсе табылды — адам жеңилдейт: erleichtert. Enttäuscht — көңүлү калган.',
    ),
  },
  {
    id: 'b1-ft-21-11',
    prompt: 'Ich schlief tief. ___ hörte ich einen lauten Knall und wachte auf.',
    promptRu: 'Я крепко спал. ___ я услышал громкий хлопок и проснулся.',
    promptKy: 'Мен катуу уктап жаттым. ___ катуу күрсүлдөгөн үн угуп, ойгонуп кеттим.',
    options: ['Zunächst', 'Inzwischen', 'Plötzlich'],
    answer: 'Plötzlich',
    skill: 'vocabulary',
    why: s(
      'Неожиданное событие — plötzlich («вдруг»). Zunächst — «сначала», inzwischen — «тем временем».',
      'Күтүлбөгөн окуя — plötzlich («капыстан»). Zunächst — «адегенде», inzwischen — «ошол аралыкта».',
    ),
  },
  {
    id: 'b1-ft-21-12',
    prompt:
      'Lies den Text: „Vor zwei Jahren kam ich nach Leipzig. Zuerst hatte ich Heimweh, aber ich fand schnell Freunde. Seitdem fühle ich mich hier wohl.“ Was stimmt?',
    promptRu: 'Прочитайте текст. Что верно?',
    promptKy: 'Текстти окуңуз. Эмне туура?',
    options: ['Die Person hatte am Anfang Heimweh.', 'Die Person wohnt seit zwei Tagen in Leipzig.', 'Die Person hat keine Freunde.'],
    answer: 'Die Person hatte am Anfang Heimweh.',
    skill: 'reading',
    why: s(
      'В тексте сказано: «Zuerst hatte ich Heimweh». Остальные варианты в тексте не названы или противоречат ему.',
      'Текстте айтылган: «Zuerst hatte ich Heimweh». Калган варианттар текстте айтылган эмес же ага каршы келет.',
    ),
  },
  {
    id: 'b1-ft-21-13',
    prompt:
      'Lies den Text: „Während ich im Café wartete, kam plötzlich mein alter Lehrer herein. Ich war überrascht und freute mich sehr. Wir redeten bis zum Abend.“ Wie lange sprachen die beiden?',
    promptRu: 'Прочитайте текст. Как долго разговаривали эти двое?',
    promptKy: 'Текстти окуңуз. Экөө канчага чейин сүйлөштү?',
    options: ['Nur kurz.', 'Bis zum Abend.', 'Bis zum Mittag.'],
    answer: 'Bis zum Abend.',
    skill: 'reading',
    why: s(
      'В тексте: «Wir redeten bis zum Abend». Значит, разговор шёл до вечера.',
      'Текстте: «Wir redeten bis zum Abend». Демек, сүйлөшүү кечке чейин созулду.',
    ),
  },
  {
    id: 'b1-ft-21-14',
    prompt:
      'Lies die Nachricht: „Hallo Tim, gestern hatte ich eine Panne: Mein Fahrrad ging kaputt, bevor ich im Büro ankam. Ich lief den Rest zu Fuß und kam zu spät. Mein Chef war nicht böse. Ich war erleichtert!“ Warum kam die Person zu spät?',
    promptRu: 'Прочитайте сообщение. Почему человек опоздал?',
    promptKy: 'Билдирүүнү окуңуз. Адам эмне үчүн кечикти?',
    options: ['Sie verpasste den Bus.', 'Sie schlief zu lange.', 'Ihr Fahrrad ging kaputt.'],
    answer: 'Ihr Fahrrad ging kaputt.',
    skill: 'reading',
    why: s(
      'В сообщении: «Mein Fahrrad ging kaputt … Ich lief den Rest zu Fuß und kam zu spät». Автобус и сон в тексте не упоминаются.',
      'Билдирүүдө: «Mein Fahrrad ging kaputt … Ich lief den Rest zu Fuß und kam zu spät». Автобус жана уйку тууралуу айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-21-15',
    prompt:
      'Lies den Text: „Nachdem ich gegessen habe, gehe ich meistens spazieren. Heute habe ich im Park einen alten Freund getroffen. Wir haben lange geredet. Seitdem schreiben wir uns jede Woche.“ Was machen die beiden seitdem?',
    promptRu: 'Прочитайте текст. Что делают эти двое с тех пор?',
    promptKy: 'Текстти окуңуз. Ошондон бери экөө эмне кылышат?',
    options: ['Sie schreiben sich jede Woche.', 'Sie gehen zusammen spazieren.', 'Sie wohnen zusammen.'],
    answer: 'Sie schreiben sich jede Woche.',
    skill: 'reading',
    why: s(
      'В тексте: «Seitdem schreiben wir uns jede Woche». Вместе они не гуляют и не живут.',
      'Текстте: «Seitdem schreiben wir uns jede Woche». Алар чогуу сейилдебейт да, жашабайт да.',
    ),
  },
]
