import type { Exercise, L10n } from '../../types'
import type { A2TestQuestion, L10nStrict } from '../../a2/types'
import type { B1TestDef } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 29 revision (Wiederholung) exercises, `b1-ex-29-01` … `-10`: 4 fill / 4 choice / 2 order on the unit's concepts (relative clause with Dativ and preposition × 4,
 * Plusquamperfekt and nachdem × 3, Genitivattribut × 1 — RECOGNITION only, a `choice` item, because the concept is receptive), plus 2 RECYCLED items (↻ Präteritum of
 * Unit 21, ↻ relative clause Nominativ / Akkusativ of Unit 23) without a concept of this unit — the spaced-revision part. Authored independently of the final test:
 * no prompt, sentence or answer is shared. The items use only the taught constructions; no gap or word order contains a Genitiv attribute, a Genitiv relative pronoun,
 * `damit` or `sodass`. All situations are fictional.
 */
export const UNIT_29_EXERCISES: Exercise[] = [
  {
    id: 'b1-ex-29-01',
    type: 'fill',
    unit: 29,
    concept: 'b1-relativsaetze-dativ-praeposition',
    prompt: 'Das ist der Kollege, ___ ich oft helfe.',
    promptRu: 'Это коллега, которому я часто помогаю.',
    promptKy: 'Бул мен көп жардам берген кесиптеш.',
    options: ['dem', 'den', 'der'],
    answer: 'dem',
    why: w(
      'Глагол helfen требует Dativ. Слово «der Kollege» — мужской род, поэтому относительное местоимение в Dativ — dem. Den был бы Akkusativ, der — женский род.',
      'helfen этиши Dativди талап кылат. «der Kollege» сөзү — эркек род, ошондуктан Dativдеги байланыш сөзү — dem. Den Akkusativ болмок, der — аял жынысы.',
    ),
  },
  {
    id: 'b1-ex-29-02',
    type: 'choice',
    unit: 29,
    concept: 'b1-relativsaetze-dativ-praeposition',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Die Stadt, in der ich wohne, ist klein.', 'Die Stadt, die ich wohne in, ist klein.', 'Die Stadt, in die ich wohne, ist klein.'],
    answer: 'Die Stadt, in der ich wohne, ist klein.',
    why: w(
      'Предлог стоит перед относительным местоимением. «Где?» — Dativ: in der. «In die» означало бы направление («куда?»), а предлог в конце придаточного — ошибка.',
      'Предлог байланыш сөзүнүн алдында турат. «Кайда?» — Dativ: in der. «In die» багытты («кайда?») билдирмек, ал эми кошумча бөлүктүн аягындагы предлог — ката.',
    ),
  },
  {
    id: 'b1-ex-29-03',
    type: 'order',
    unit: 29,
    concept: 'b1-relativsaetze-dativ-praeposition',
    prompt: 'Bilde den Satz.',
    promptRu: 'Это подруга, с которой я путешествую.',
    promptKy: 'Бул мен менен кошо саякаттаган дугуна.',
    words: ['reise.', 'mit', 'Das', 'die', 'der', 'ich', 'Freundin,', 'ist'],
    answer: 'Das ist die Freundin, mit der ich reise.',
    why: w(
      'После запятой идёт предлог (mit) + относительное местоимение (der), затем подлежащее (ich) и глагол (reise) в конце.',
      'Үтүрдөн кийин предлог (mit) + байланыш сөзү (der), андан кийин ээ (ich) жана этиш (reise) аягында келет.',
    ),
  },
  {
    id: 'b1-ex-29-04',
    type: 'fill',
    unit: 29,
    concept: 'b1-relativsaetze-dativ-praeposition',
    prompt: 'Die Leute, bei ___ wir wohnen, sind sehr nett.',
    promptRu: 'Люди, у которых мы живём, очень милые.',
    promptKy: 'Биз жашаган адамдар абдан жакшы.',
    options: ['denen', 'den', 'die'],
    answer: 'denen',
    why: w(
      'Предлог bei требует Dativ, а «die Leute» — множественное число: bei denen. Den и die — не Dativ множественного числа.',
      'bei предлогу Dativди талап кылат, ал эми «die Leute» — көптүк сан: bei denen. Den жана die көптүк сандагы Dativ эмес.',
    ),
  },
  {
    id: 'b1-ex-29-05',
    type: 'fill',
    unit: 29,
    concept: 'b1-plusquamperfekt-nachdem',
    prompt: 'Nachdem wir angekommen ___, sind wir essen gegangen.',
    promptRu: 'После того как мы приехали, мы пошли поесть.',
    promptKy: 'Биз келгенден кийин тамак ичкени бардык.',
    options: ['waren', 'hatten', 'sind'],
    answer: 'waren',
    why: w(
      'Plusquamperfekt от ankommen (глагол движения) образуется с war / waren: «angekommen waren». Hatten подходит к другим глаголам, sind — это Perfekt.',
      'ankommen (кыймыл этиши) Plusquamperfektти war / waren менен түзөт: «angekommen waren». Hatten башка этиштерге туура келет, sind — Perfekt.',
    ),
  },
  {
    id: 'b1-ex-29-06',
    type: 'choice',
    unit: 29,
    concept: 'b1-plusquamperfekt-nachdem',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Nachdem ich gegessen hatte, bin ich gegangen.', 'Nachdem ich hatte gegessen, bin ich gegangen.', 'Nachdem ich gegessen hatte, ich bin gegangen.'],
    answer: 'Nachdem ich gegessen hatte, bin ich gegangen.',
    why: w(
      'В придаточном предложении Partizip II стоит перед hatte в самом конце, а главная часть начинается с глагола (bin ich). В других вариантах порядок слов нарушен.',
      'Кошумча бөлүктө Partizip II эң аягындагы hatte дан мурун турат, ал эми башкы бөлүк этиштен башталат (bin ich). Башка варианттарда сөздөрдүн ирети бузулган.',
    ),
  },
  {
    id: 'b1-ex-29-07',
    type: 'order',
    unit: 29,
    concept: 'b1-plusquamperfekt-nachdem',
    prompt: 'Bilde den Satz.',
    promptRu: 'Собрав чемоданы, она вызвала такси.',
    promptKy: 'Чемодандарын жыйнагандан кийин ал такси чакырды.',
    words: ['gerufen.', 'Taxi', 'hatte,', 'sie', 'Nachdem', 'Koffer', 'hat', 'die', 'gepackt', 'ein', 'sie'],
    answer: 'Nachdem sie die Koffer gepackt hatte, hat sie ein Taxi gerufen.',
    why: w(
      'Придаточное с nachdem: Partizip II (gepackt) + hatte в конце; после запятой сразу глагол hat, потом sie, ein Taxi и Partizip II (gerufen) в конце.',
      'nachdem менен кошумча бөлүк: аягында Partizip II (gepackt) + hatte; үтүрдөн кийин дароо hat этиши, андан кийин sie, ein Taxi жана аягында Partizip II (gerufen).',
    ),
  },
  {
    id: 'b1-ex-29-08',
    type: 'choice',
    unit: 29,
    concept: 'b1-genitivattribute',
    prompt: 'Welcher Satz sagt dasselbe wie: „Das ist das Auto meines Bruders“?',
    promptRu: 'Какое предложение говорит то же самое, что «Das ist das Auto meines Bruders»?',
    promptKy: '«Das ist das Auto meines Bruders» сүйлөмү менен бирдей маанидеги кайсы сүйлөм?',
    options: ['Mein Bruder kauft ein Auto.', 'Ich fahre mit meinem Bruder.', 'Das Auto gehört meinem Bruder.'],
    answer: 'Das Auto gehört meinem Bruder.',
    why: w(
      '«Meines Bruders» — Genitiv: он показывает, чьё это авто. То же самое: «das Auto gehört meinem Bruder» (gehören + Dativ) или «das Auto von meinem Bruder». Остальные предложения говорят о другом.',
      '«Meines Bruders» — Genitiv: ал унаа кимдики экенин көрсөтөт. Ошол эле маани: «das Auto gehört meinem Bruder» (gehören + Dativ) же «das Auto von meinem Bruder». Калган сүйлөмдөр башка нерсе жөнүндө.',
    ),
  },
  {
    id: 'b1-ex-29-09',
    type: 'choice',
    unit: 29,
    prompt: 'Welcher Satz erzählt von der Vergangenheit richtig?',
    promptRu: 'Какое предложение правильно рассказывает о прошлом?',
    promptKy: 'Кайсы сүйлөм өткөн чак жөнүндө туура айтат?',
    options: ['Letzten Sommer wir waren in Dresden.', 'Letzten Sommer sind wir in Dresden gewesen waren.', 'Letzten Sommer waren wir in Dresden.'],
    answer: 'Letzten Sommer waren wir in Dresden.',
    why: w(
      '↻ Юнит 21: Präteritum от sein — waren. После слова «Letzten Sommer» глагол стоит на втором месте (waren), потом подлежащее (wir).',
      '↻ 21-бөлүм: sein этишинин Präteritumу — waren. «Letzten Sommer» сөзүнөн кийин этиш экинчи орунда (waren), андан кийин ээ (wir).',
    ),
  },
  {
    id: 'b1-ex-29-10',
    type: 'fill',
    unit: 29,
    prompt: 'Die Freunde, ___ ich besucht habe, wohnen in Leipzig.',
    promptRu: 'Друзья, которых я навестил, живут в Лейпциге.',
    promptKy: 'Мен конокко барган достор Лейпцигде жашашат.',
    options: ['die', 'denen', 'der'],
    answer: 'die',
    why: w(
      '↻ Юнит 23: besuchen требует Akkusativ, «die Freunde» — множественное число: die. Denen — Dativ множественного числа, der — не подходит.',
      '↻ 23-бөлүм: besuchen Akkusativди талап кылат, «die Freunde» — көптүк сан: die. Denen — көптүк сандагы Dativ, der — туура келбейт.',
    ),
  },
]

/** Test definition `unit-29` (kind topic, 15 questions). */
export const UNIT_29_TEST: B1TestDef = {
  id: 'unit-29',
  title: s('Итоговый тест: юнит 29', 'Жыйынтыктоочу тест: 29-бөлүм'),
  kind: 'topic',
  level: 'B1',
  unit: 29,
  size: 15,
}

/**
 * Unit 29 final test, `b1-ft-29-01` … `-15`. Composition (curriculum v2 §7.2): 8 grammar (2 relative pronoun after a preposition, 2 Plusquamperfekt: form and sequence,
 * 2 Genitivattribut RECOGNITION — non-gap, because the concept is receptive —, 2 recycled ↻: Präteritum of Unit 21 and relative clause Nominativ / Akkusativ of Unit 23),
 * 3 vocabulary, 4 reading, 0 listening — listening items enter a test only after the text-to-speech playback has been verified on real devices. Reading items carry the
 * German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate only the instruction and the question. All texts are fictional. Authored positions of the correct
 * answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_29_FINAL: A2TestQuestion[] = [
  {
    id: 'b1-ft-29-01',
    prompt: 'Das ist die Stadt, in ___ ich lebe.',
    promptRu: 'Это город, в котором я живу.',
    promptKy: 'Бул мен жашаган шаар.',
    options: ['der', 'die', 'dem'],
    answer: 'der',
    skill: 'grammar',
    concept: 'b1-relativsaetze-dativ-praeposition',
    why: s(
      'In + «где?» требует Dativ, а die Stadt — женский род: in der. In die отвечало бы на вопрос «куда?», in dem — для мужского и среднего рода.',
      'In + «кайда?» Dativди талап кылат, ал эми die Stadt — аял жынысы: in der. In die «кайда?» (багыт) деген суроого жооп болмок, in dem — эркек жана орто род үчүн.',
    ),
  },
  {
    id: 'b1-ft-29-02',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Die Familie, bei die ich wohne, ist nett.', 'Die Familie, bei der ich wohne, ist nett.', 'Die Familie, bei den ich wohne, ist nett.'],
    answer: 'Die Familie, bei der ich wohne, ist nett.',
    skill: 'grammar',
    concept: 'b1-relativsaetze-dativ-praeposition',
    why: s(
      'Bei требует Dativ, die Familie — женский род: bei der. Die и den не являются формами Dativ женского рода.',
      'Bei Dativди талап кылат, die Familie — аял жынысы: bei der. Die жана den аял жынысынын Dativ формалары эмес.',
    ),
  },
  {
    id: 'b1-ft-29-03',
    prompt: 'Setze das Plusquamperfekt ein: Nachdem er gegessen ___, ging er nach Hause.',
    promptRu: 'Вставьте форму Plusquamperfekt: после того как он поел, он пошёл домой.',
    promptKy: 'Plusquamperfekt формасын коюңуз: ал тамактангандан кийин үйүнө кетти.',
    options: ['hat', 'wurde', 'hatte'],
    answer: 'hatte',
    skill: 'grammar',
    concept: 'b1-plusquamperfekt-nachdem',
    why: s(
      'Plusquamperfekt = hatte + Partizip II (gegessen hatte). Hat — Perfekt, wurde — Passiv, поэтому они не подходят.',
      'Plusquamperfekt = hatte + Partizip II (gegessen hatte). Hat — Perfekt, wurde — Passiv, ошондуктан алар туура келбейт.',
    ),
  },
  {
    id: 'b1-ft-29-04',
    prompt: 'Nachdem ich den Anschluss verpasst hatte, habe ich ein Taxi genommen. Was ist zuerst passiert?',
    promptRu: 'Что произошло раньше?',
    promptKy: 'Эмне мурун болду?',
    options: ['Ich habe ein Taxi genommen.', 'Ich habe den Anschluss verpasst.', 'Ich bin im Hotel angekommen.'],
    answer: 'Ich habe den Anschluss verpasst.',
    skill: 'grammar',
    concept: 'b1-plusquamperfekt-nachdem',
    why: s(
      'Plusquamperfekt (verpasst hatte) показывает более раннее событие: сначала пересадка не удалась, потом было такси.',
      'Plusquamperfekt (verpasst hatte) мурунку окуяны көрсөтөт: адегенде которулуу ишке ашкан жок, андан кийин такси болду.',
    ),
  },
  {
    id: 'b1-ft-29-05',
    prompt: 'Welcher Satz sagt dasselbe wie „Das ist die Adresse des Hotels“?',
    promptRu: 'Какое предложение говорит то же самое, что «Das ist die Adresse des Hotels»?',
    promptKy: '«Das ist die Adresse des Hotels» сүйлөмү менен бирдей маанидеги кайсы сүйлөм?',
    options: ['Das ist die Adresse von dem Hotel.', 'Das ist die Adresse für das Hotel.', 'Das Hotel hat keine Adresse.'],
    answer: 'Das ist die Adresse von dem Hotel.',
    skill: 'grammar',
    concept: 'b1-genitivattribute',
    why: s(
      '«Des Hotels» — Genitivattribut: оно показывает, чей адрес. В разговоре его заменяет «von + Dativ» (von dem Hotel). Остальные предложения говорят о другом.',
      '«Des Hotels» — Genitivattribut: ал даректин кимдики экенин көрсөтөт. Сүйлөшкөндө аны «von + Dativ» алмаштырат (von dem Hotel). Калган сүйлөмдөр башка нерсе жөнүндө.',
    ),
  },
  {
    id: 'b1-ft-29-06',
    prompt: 'Wo steht das Genitivattribut? „Der Preis des Zimmers steht im Internet.“',
    promptRu: 'Где здесь Genitivattribut (слово, которое показывает, чего именно)?',
    promptKy: 'Бул жерде Genitivattribut (эмненин экенин көрсөткөн сөз) кайда?',
    options: ['Der Preis', 'im Internet', 'des Zimmers'],
    answer: 'des Zimmers',
    skill: 'grammar',
    concept: 'b1-genitivattribute',
    why: s(
      '«Des Zimmers» отвечает на вопрос «чего?» (цена чего? — номера): это Genitivattribut. «Der Preis» — главное слово, «im Internet» — место.',
      '«Des Zimmers» «эмненин?» деген суроого жооп берет (эмненин баасы? — бөлмөнүн): бул Genitivattribut. «Der Preis» — негизги сөз, «im Internet» — жер.',
    ),
  },
  {
    id: 'b1-ft-29-07',
    prompt: 'Gestern ___ wir viel Spaß in Dresden.',
    promptRu: 'Вчера нам было очень весело в Дрездене.',
    promptKy: 'Кечээ Дрезденде бизге абдан кубанычтуу болду.',
    options: ['hatten', 'haben', 'hätten'],
    answer: 'hatten',
    skill: 'grammar',
    concept: 'b1-praeteritum-erzaehlen',
    why: s(
      '↻ Юнит 21: Präteritum от haben для рассказа в прошлом — hatten. Haben — настоящее время, hätten — Konjunktiv II.',
      '↻ 21-бөлүм: өткөндөгү баян үчүн haben этишинин Präteritumу — hatten. Haben — азыркы чак, hätten — Konjunktiv II.',
    ),
  },
  {
    id: 'b1-ft-29-08',
    prompt: 'Der Reiseführer, ___ ich gekauft habe, ist sehr gut.',
    promptRu: 'Путеводитель, который я купил, очень хороший.',
    promptKy: 'Мен сатып алган жол көрсөткүч абдан жакшы.',
    options: ['der', 'den', 'dem'],
    answer: 'den',
    skill: 'grammar',
    concept: 'b1-relativsaetze-nom-akk',
    why: s(
      '↻ Юнит 23: kaufen требует Akkusativ, der Reiseführer — мужской род: den. Der было бы Nominativ, dem — Dativ.',
      '↻ 23-бөлүм: kaufen Akkusativди талап кылат, der Reiseführer — эркек род: den. Der Nominativ болмок, dem — Dativ.',
    ),
  },
  {
    id: 'b1-ft-29-09',
    prompt: 'Der Zug fällt aus. Die Fahrgäste bekommen Geld für die lange Wartezeit. Das nennt man ___.',
    promptRu: 'Поезд отменили. Пассажиры получают деньги за долгое ожидание. Это называется ___.',
    promptKy: 'Поезд жокко чыгарылды. Жүргүнчүлөр узак күткөнү үчүн акча алышат. Муну ___ дейт.',
    options: ['Beschwerde', 'Anschluss', 'Entschädigung'],
    answer: 'Entschädigung',
    skill: 'vocabulary',
    why: s(
      'Деньги за неудобство — Entschädigung (компенсация). Beschwerde — жалоба, Anschluss — пересадка.',
      'Ыңгайсыздык үчүн акча — Entschädigung (компенсация). Beschwerde — даттануу, Anschluss — которулуу.',
    ),
  },
  {
    id: 'b1-ft-29-10',
    prompt: 'Ich musste umsteigen, aber ich habe den ___ verpasst.',
    promptRu: 'Мне нужно было сделать пересадку, но я не успел на ___.',
    promptKy: 'Мен которулушум керек эле, бирок ___ үлгүрбөй калдым.',
    options: ['Anschluss', 'Brauch', 'Eindruck'],
    answer: 'Anschluss',
    skill: 'vocabulary',
    why: s(
      'Пересадочный поезд, на который нужно успеть, — der Anschluss. Brauch — обычай, Eindruck — впечатление.',
      'Жетишиш керек болгон которулуучу поезд — der Anschluss. Brauch — каада-салт, Eindruck — таасир.',
    ),
  },
  {
    id: 'b1-ft-29-11',
    prompt: 'Meine Gastfamilie hat uns sehr freundlich aufgenommen. Sie war sehr ___.',
    promptRu: 'Моя принимающая семья очень тепло нас приняла. Она была очень ___.',
    promptKy: 'Менин мейман үй-бүлөм бизди абдан жылуу кабыл алды. Ал абдан ___ болду.',
    options: ['unterschiedlich', 'gastfreundlich', 'ungewohnt'],
    answer: 'gastfreundlich',
    skill: 'vocabulary',
    why: s(
      'Тот, кто тепло принимает гостей, — gastfreundlich. Unterschiedlich — разный, ungewohnt — непривычный.',
      'Конокторду жылуу кабыл алган — gastfreundlich. Unterschiedlich — ар башка, ungewohnt — көнүмүш эмес.',
    ),
  },
  {
    id: 'b1-ft-29-12',
    prompt:
      'Lies den Reisebericht (erfunden): „Samira war mit ihrem Bruder in Wien. Nachdem sie angekommen waren, hatten sie zuerst Hunger. Das Restaurant, in dem sie gegessen haben, war klein und laut. Im Vergleich zu ihrer Heimatstadt war es ungewohnt, dass das Essen so lange gedauert hat.“ Was war für Samira ungewohnt?',
    promptRu: 'Прочитайте отчёт о поездке (вымышленный). Что было для Самиры непривычным?',
    promptKy: 'Саякат баянын окуңуз (ойдон чыгарылган). Самира үчүн эмне көнүмүш эмес болду?',
    options: ['Dass das Restaurant klein war.', 'Dass ihr Bruder Hunger hatte.', 'Dass das Essen so lange gedauert hat.'],
    answer: 'Dass das Essen so lange gedauert hat.',
    skill: 'reading',
    why: s(
      'В тексте: «Im Vergleich zu ihrer Heimatstadt war es ungewohnt, dass das Essen so lange gedauert hat». Размер ресторана и голод брата — другие детали.',
      'Текстте: «Im Vergleich zu ihrer Heimatstadt war es ungewohnt, dass das Essen so lange gedauert hat». Ресторандын көлөмү жана иниси ачка болгону — башка майда-чүйдөлөр.',
    ),
  },
  {
    id: 'b1-ft-29-13',
    prompt:
      'Lies den Reisebericht (erfunden): „Samira war mit ihrem Bruder in Wien. Nachdem sie angekommen waren, hatten sie zuerst Hunger. Das Restaurant, in dem sie gegessen haben, war klein und laut. Im Vergleich zu ihrer Heimatstadt war es ungewohnt, dass das Essen so lange gedauert hat.“ Wie war das Restaurant?',
    promptRu: 'Прочитайте отчёт о поездке (вымышленный). Каким был ресторан?',
    promptKy: 'Саякат баянын окуңуз (ойдон чыгарылган). Ресторан кандай болду?',
    options: ['Groß und ruhig.', 'Klein und laut.', 'Neu und teuer.'],
    answer: 'Klein und laut.',
    skill: 'reading',
    why: s(
      'В тексте: «Das Restaurant, in dem sie gegessen haben, war klein und laut».',
      'Текстте: «Das Restaurant, in dem sie gegessen haben, war klein und laut».',
    ),
  },
  {
    id: 'b1-ft-29-14',
    prompt:
      'Lies die Mitteilung (erfunden): „Liebe Gäste, im Hotel Bergblick gab es gestern einen Wasserschaden. Nachdem die Handwerker gekommen waren, haben sie alles repariert. Gäste, denen das Zimmer nicht gefällt, bekommen ein neues Zimmer. Das Frühstück gibt es heute ab 8 Uhr.“ Wer bekommt ein neues Zimmer?',
    promptRu: 'Прочитайте сообщение (вымышленное). Кто получит новый номер?',
    promptKy: 'Билдирүүнү окуңуз (ойдон чыгарылган). Ким жаңы бөлмө алат?',
    options: ['Gäste, denen das Zimmer nicht gefällt.', 'Alle Gäste.', 'Gäste, die zu spät frühstücken.'],
    answer: 'Gäste, denen das Zimmer nicht gefällt.',
    skill: 'reading',
    why: s(
      'В тексте: «Gäste, denen das Zimmer nicht gefällt, bekommen ein neues Zimmer». Не все гости и не те, кто поздно завтракает.',
      'Текстте: «Gäste, denen das Zimmer nicht gefällt, bekommen ein neues Zimmer». Бардык конок эмес жана кечигип эртең мененки тамак ичкендер эмес.',
    ),
  },
  {
    id: 'b1-ft-29-15',
    prompt:
      'Lies die Mitteilung (erfunden): „Liebe Gäste, im Hotel Bergblick gab es gestern einen Wasserschaden. Nachdem die Handwerker gekommen waren, haben sie alles repariert. Gäste, denen das Zimmer nicht gefällt, bekommen ein neues Zimmer. Das Frühstück gibt es heute ab 8 Uhr.“ Ab wann gibt es heute Frühstück?',
    promptRu: 'Прочитайте сообщение (вымышленное). С какого времени сегодня завтрак?',
    promptKy: 'Билдирүүнү окуңуз (ойдон чыгарылган). Бүгүн эртең мененки тамак саат канчадан баштап?',
    options: ['Ab 7 Uhr.', 'Ab 9 Uhr.', 'Ab 8 Uhr.'],
    answer: 'Ab 8 Uhr.',
    skill: 'reading',
    why: s(
      'В тексте: «Das Frühstück gibt es heute ab 8 Uhr».',
      'Текстте: «Das Frühstück gibt es heute ab 8 Uhr».',
    ),
  },
]
