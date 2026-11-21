import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_21_SOURCE, UNIT_21_SPEAKING_ID } from './unit'

/**
 * Unit 21 texts: 2 listening scripts, 2 readings, 1 speaking scenario, 1 writing task. Targets of the band for Units 21–22: reading 100–150 words,
 * listening 110–140, sentences ≤ 22 words (95th percentile ≤ 16), 5–6 speaking turns, writing 70–80 words. Original material; the Kyrgyz is an
 * AI-assisted first draft that has not been reviewed by a native speaker.
 * Scope guard (curriculum v2): Präteritum only of the unit's closed verb list (+ the A2 modals); Perfekt in dialogue; no Plusquamperfekt, Passiv,
 * Relativsatz, Infinitiv mit zu, obwohl/damit, Genitiv, adjectives without article.
 * Listening: the dialogues are played with the browser's text-to-speech (the existing mechanism of the listening lab). That playback has NOT been
 * verified on real devices, so no final-test item depends on audio.
 */
export const UNIT_21_LISTENING: ListeningExercise[] = [
  {
    id: 'b1-li-21-01',
    unit: 21,
    level: 'B1',
    title: 'Zufällig getroffen',
    lines: [
      {
        speaker: 'Murat',
        text: 'Hallo Jana! Du strahlst ja heute. Was ist passiert?',
        ru: 'Привет, Яна! Ты сегодня просто сияешь. Что случилось?',
        ky: 'Салам, Яна! Бүгүн жүзүң жарк этип турат. Эмне болду?',
      },
      {
        speaker: 'Jana',
        text: 'Du glaubst es nicht: Ich habe am Samstag zufällig meine alte Schulfreundin getroffen!',
        ru: 'Ты не поверишь: в субботу я случайно встретила свою старую школьную подругу!',
        ky: 'Ишенбейсиң: ишемби күнү мен өзүмдүн эски мектеп курбумду кокусунан жолуктурдум!',
      },
      { speaker: 'Murat', text: 'Wirklich? Wo denn?', ru: 'Правда? А где?', ky: 'Чын элеби? Кайда?' },
      {
        speaker: 'Jana',
        text: 'Am Bahnhof. Bevor ich eingestiegen bin, habe ich plötzlich meinen Namen gehört.',
        ru: 'На вокзале. Прежде чем я села в поезд, я вдруг услышала своё имя.',
        ky: 'Вокзалда. Поездге түшөөрдөн мурун мен капыстан өз атымды уктум.',
      },
      { speaker: 'Murat', text: 'Und? Wer war es?', ru: 'И? Кто это был?', ky: 'Анан? Ал ким экен?' },
      {
        speaker: 'Jana',
        text: 'Mila! Wir haben uns zehn Jahre nicht gesehen.',
        ru: 'Мила! Мы десять лет не виделись.',
        ky: 'Мила! Биз он жыл бою көрүшкөн жокпуз.',
      },
      {
        speaker: 'Murat',
        text: 'Das ist ja eine tolle Überraschung! Was habt ihr dann gemacht?',
        ru: 'Какой замечательный сюрприз! А что вы потом делали?',
        ky: 'Кандай сонун күтүлбөгөн окуя! Анан эмне кылдыңар?',
      },
      {
        speaker: 'Jana',
        text: 'Wir sind in ein Café gegangen und haben stundenlang geredet.',
        ru: 'Мы пошли в кафе и несколько часов разговаривали.',
        ky: 'Биз кафеге барып, бир нече саат сүйлөштүк.',
      },
      {
        speaker: 'Murat',
        text: 'Und wie hast du dich gefühlt, als du sie gesehen hast?',
        ru: 'А что ты почувствовала, когда увидела её?',
        ky: 'Ал эми аны көргөндө өзүңү кандай сездиң?',
      },
      {
        speaker: 'Jana',
        text: 'Zuerst war ich sprachlos. Dann habe ich geweint und gelacht.',
        ru: 'Сначала я лишилась дара речи. Потом плакала и смеялась.',
        ky: 'Адегенде мен тилимден айрылып калдым. Анан ыйладым да, күлдүм да.',
      },
      {
        speaker: 'Murat',
        text: 'Habt ihr eure Handynummern getauscht?',
        ru: 'Вы обменялись номерами телефонов?',
        ky: 'Телефон номерлериңер менен алмаштыңарбы?',
      },
      {
        speaker: 'Jana',
        text: 'Ja! Nachdem wir bezahlt haben, haben wir Nummern ausgetauscht.',
        ru: 'Да! Когда мы расплатились, мы обменялись номерами.',
        ky: 'Ооба! Төлөп бүткөндөн кийин биз номерлер менен алмаштык.',
      },
      {
        speaker: 'Jana',
        text: 'Seitdem wir uns getroffen haben, schreiben wir jeden Tag. Ich war so erleichtert und glücklich.',
        ru: 'С тех пор как мы встретились, мы переписываемся каждый день. Я была так рада и счастлива.',
        ky: 'Жолугушкандан бери биз ар күнү жазышабыз. Мен абдан жеңилдеп, бактылуу болдум.',
      },
      {
        speaker: 'Murat',
        text: 'Wie schön! Dann erzähl mir am Montag mehr.',
        ru: 'Как здорово! Тогда расскажешь мне в понедельник ещё.',
        ky: 'Кандай жакшы! Анда дүйшөмбүдө мага дагы айтып бересиң.',
      },
    ],
    questions: [
      { q: 'Wo hat Jana ihre Schulfreundin getroffen?', options: ['Im Café', 'Am Bahnhof', 'Im Zug'], answer: 1 },
      {
        q: 'Woran hat Jana zuerst bemerkt, dass Mila da ist?',
        options: ['Sie hat ihren Namen gehört.', 'Sie hat sie im Zug gesehen.', 'Sie hat sie angerufen.'],
        answer: 0,
      },
      {
        q: 'Was machen Jana und Mila seitdem?',
        options: ['Sie wohnen zusammen.', 'Sie treffen sich jede Woche.', 'Sie schreiben jeden Tag.'],
        answer: 2,
      },
      { q: 'Wie fühlt sich Jana am Ende?', options: ['Enttäuscht und ein bisschen müde.', 'Erleichtert und glücklich.', 'Nervös.'], answer: 1 },
    ],
    keywords: ['zufällig', 'Begegnung', 'Überraschung', 'erleichtert', 'Zufall'],
    source: UNIT_21_SOURCE,
  },
  {
    id: 'b1-li-21-02',
    unit: 21,
    level: 'B1',
    title: 'Unser erster Winter',
    lines: [
      {
        speaker: 'Aisha',
        text: 'Nurlan, erinnerst du dich an unseren ersten Winter in Deutschland?',
        ru: 'Нурлан, ты помнишь нашу первую зиму в Германии?',
        ky: 'Нурлан, Германиядагы биздин биринчи кышты эстейсиңби?',
      },
      {
        speaker: 'Nurlan',
        text: 'Und ob! Damals hatte ich jeden Abend Heimweh.',
        ru: 'Ещё бы! Тогда я каждый вечер скучал по дому.',
        ky: 'Албетте эстейм! Ошол кезде мен ар кечте үйдү сагынчумун.',
      },
      {
        speaker: 'Aisha',
        text: 'Zunächst wolltest du sogar zurückfliegen.',
        ru: 'Поначалу ты даже хотел улететь обратно.',
        ky: 'Адегенде сен ал тургай кайра учуп кетүүнү каалагансың.',
      },
      {
        speaker: 'Nurlan',
        text: 'Stimmt. Ich konnte kaum Deutsch und fand keine Arbeit.',
        ru: 'Верно. Я почти не знал немецкого и не находил работу.',
        ky: 'Туура. Мен немисче дээрлик билчү эмесмин жана жумуш таба албадым.',
      },
      { speaker: 'Aisha', text: 'Und wann hat sich alles geändert?', ru: 'А когда всё изменилось?', ky: 'Анан баары качан өзгөрдү?' },
      {
        speaker: 'Nurlan',
        text: 'Nach drei Monaten. Eine Nachbarin hat mich zum Essen eingeladen.',
        ru: 'Через три месяца. Одна соседка пригласила меня на ужин.',
        ky: 'Үч айдан кийин. Бир кошуна мени тамакка чакырды.',
      },
      {
        speaker: 'Aisha',
        text: 'Inzwischen kennst du fast das ganze Haus.',
        ru: 'Теперь ты знаешь почти весь дом.',
        ky: 'Азыр сен дээрлик бүт үйдү тааныйсың.',
      },
      {
        speaker: 'Nurlan',
        text: 'Ja! Seitdem fühle ich mich hier zu Hause.',
        ru: 'Да! С тех пор я чувствую себя здесь как дома.',
        ky: 'Ооба! Ошондон бери мен бул жерде өз үйүмдөгүдөй сезем.',
      },
      { speaker: 'Aisha', text: 'Bereust du deine Entscheidung?', ru: 'Ты жалеешь о своём решении?', ky: 'Чечимиңе өкүнөсүңбү?' },
      {
        speaker: 'Nurlan',
        text: 'Nein, nie. Bevor ich kam, hatte ich Angst, aber schließlich war es die beste Entscheidung.',
        ru: 'Нет, никогда. Прежде чем приехать, я боялся, но в итоге это было лучшее решение.',
        ky: 'Жок, эч качан. Келерден мурун мен коркчумун, бирок акыры бул эң жакшы чечим болду.',
      },
      {
        speaker: 'Aisha',
        text: 'Weißt du noch, wie wir uns im Supermarkt verlaufen haben?',
        ru: 'А помнишь, как мы заблудились в супермаркете?',
        ky: 'Супермаркетте кантип адашып калганыбыз эсиңдеби?',
      },
      {
        speaker: 'Nurlan',
        text: 'Ja! Wir haben eine Stunde den Ausgang gesucht. Das war so peinlich!',
        ru: 'Да! Мы целый час искали выход. Было так неловко!',
        ky: 'Ооба! Биз бир саат чыгуу жолун издедик. Кандай уят болду!',
      },
      { speaker: 'Aisha', text: 'Ich bin stolz auf dich.', ru: 'Я горжусь тобой.', ky: 'Мен сенин менен сыймыктанам.' },
      {
        speaker: 'Nurlan',
        text: 'Danke! Du hast mir damals sehr geholfen.',
        ru: 'Спасибо! Ты мне тогда очень помогла.',
        ky: 'Рахмат! Ошондо сен мага абдан жардам бергенсиң.',
      },
    ],
    questions: [
      {
        q: 'Was wollte Nurlan zuerst tun?',
        options: ['Eine neue Wohnung suchen.', 'Nach Hause zurückfliegen.', 'Das Haus verkaufen.'],
        answer: 1,
      },
      { q: 'Wer hat Nurlan zum Essen eingeladen?', options: ['Seine Schwester', 'Ein Kollege', 'Eine Nachbarin'], answer: 2 },
      {
        q: 'Wie fühlt sich Nurlan seitdem?',
        options: ['Er fühlt sich hier zu Hause.', 'Er hat immer noch großes Heimweh.', 'Er will zurückfliegen.'],
        answer: 0,
      },
      { q: 'Wie war die Situation im Supermarkt?', options: ['Gefährlich.', 'Langweilig.', 'Peinlich.'], answer: 2 },
    ],
    keywords: ['Winter', 'Heimweh', 'Nachbarin', 'Entscheidung', 'Supermarkt'],
    source: UNIT_21_SOURCE,
  },
]

export const UNIT_21_READING: ReadingText[] = [
  {
    id: 'b1-re-21-01',
    unit: 21,
    level: 'B1',
    title: 'Meine erste Nacht in Deutschland',
    body: [
      'Vor drei Jahren kam ich zum ersten Mal nach Deutschland. Ich landete am Abend in Frankfurt und war sehr müde. Bevor ich den Bahnhof fand, lief ich fast eine Stunde durch den Flughafen. Dann nahm ich den Zug nach Kassel, denn dort wohnte mein Bruder.',
      'Während ich im Zug saß, schlief ich ein. Als ich aufwachte, stand der Zug schon in Göttingen! Ich verpasste meine Station und bekam plötzlich Angst. Mein Handy hatte kein Netz. Zum Glück half mir eine freundliche Frau. Sie rief meinen Bruder an, und er holte mich eine Stunde später ab.',
      'Wir lachten viel an diesem Abend. Heute denke ich gern an diese Nacht, weil sie mein erstes Abenteuer in Deutschland war.',
    ],
    gloss: [
      {
        word: 'landete',
        ru: 'приземлился (Präteritum от landen)',
        ky: 'конуп келдим, учактан түштүм (landen этишинин Präteritum формасы)',
        example: 'Das Flugzeug landete pünktlich.',
        grammar: 'правильный глагол: основа + -te → ich landete',
        grammarKy: 'туура этиш: уңгу + -te → ich landete',
        related: [],
      },
      {
        word: 'nahm',
        ru: 'взял, сел (на поезд) — Präteritum от nehmen',
        ky: 'алдым, түштүм (поездге) — nehmen этишинин Präteritum формасы',
        example: 'Ich nahm den Bus.',
        grammar: 'неправильный глагол: nehmen → nahm',
        grammarKy: 'туура эмес этиш: nehmen → nahm',
        related: [],
      },
      {
        word: 'aufwachte',
        ru: 'проснулся (в придаточном предложении)',
        ky: 'ойгондум (als менен башталган бөлүктө)',
        example: 'Als ich aufwachte, war es dunkel.',
        grammar: 'aufwachen: в придаточном предложении слитно, в конце',
        grammarKy: 'aufwachen: als менен башталган бөлүктө чогуу жазылып, аягында турат',
        related: [],
      },
      {
        word: 'Zum Glück',
        ru: 'к счастью',
        ky: 'бактыга жараша',
        example: 'Zum Glück war der Zug spät.',
        grammar: 'устойчивое выражение',
        grammarKy: 'туруктуу сөз айкашы',
        related: [],
      },
    ],
    questions: [
      {
        q: 'Warum bekam die Erzählerin plötzlich Angst?',
        options: ['Ihr Bruder war nicht zu Hause.', 'Sie verpasste ihre Station.', 'Sie verlor ihr Handy.'],
        answer: 1,
      },
      { q: 'Wer half ihr?', options: ['Eine freundliche Frau.', 'Ihr Bruder.', 'Ein Zugführer.'], answer: 0 },
      {
        q: 'Wie denkt die Erzählerin heute über diese Nacht?',
        options: ['Sie ärgert sich noch.', 'Sie möchte sie vergessen.', 'Sie denkt gern daran.'],
        answer: 2,
      },
    ],
    source: UNIT_21_SOURCE,
  },
  {
    id: 'b1-re-21-02',
    unit: 21,
    level: 'B1',
    title: 'Mein erster Marathon',
    body: [
      'Im Mai lief ich meinen ersten Marathon in Berlin. Schon als Kind wollte ich einen Marathon laufen. Aber ich hatte nie genug Mut.',
      'Seitdem ich in Deutschland wohne, laufe ich jeden Morgen im Park. Ein Jahr lang trainierte ich dreimal pro Woche. Bevor das Rennen begann, war ich sehr nervös. Meine Beine zitterten, und mein Herz schlug schnell. Dann fiel der Startschuss.',
      'Bis Kilometer dreißig ging alles gut. Danach hatte ich Schmerzen und wollte aufgeben. Doch die Zuschauer riefen meinen Namen. Ich lief weiter und kam nach fünf Stunden ins Ziel. Meine Freunde warteten schon im Ziel und weinten vor Freude. Ich war erschöpft, aber unglaublich stolz.',
    ],
    gloss: [
      {
        word: 'trainierte',
        ru: 'тренировался (Präteritum от trainieren)',
        ky: 'машыктым (trainieren этишинин Präteritum формасы)',
        example: 'Sie trainierte jeden Tag.',
        grammar: 'правильный глагол: основа + -te',
        grammarKy: 'туура этиш: уңгу + -te',
        related: [],
      },
      {
        word: 'schlug',
        ru: 'билось (Präteritum от schlagen)',
        ky: 'согуп турду (schlagen этишинин Präteritum формасы)',
        example: 'Mein Herz schlug schnell.',
        grammar: 'неправильный глагол: schlagen → schlug',
        grammarKy: 'туура эмес этиш: schlagen → schlug',
        related: [],
      },
      {
        word: 'der Startschuss',
        ru: 'стартовый выстрел',
        ky: 'старт мылтыгынын үнү',
        example: 'Dann fiel der Startschuss.',
        grammar: 'der Startschuss — мужской род',
        grammarKy: 'der Startschuss — эркек род',
        related: [],
      },
      {
        word: 'aufgeben',
        ru: 'сдаться, бросить',
        ky: 'таштоо, багынып берүү',
        example: 'Ich wollte nicht aufgeben.',
        grammar: 'глагол с отделяемой приставкой: auf|geben',
        grammarKy: 'приставкасы ажыраган этиш: auf|geben',
        related: [],
      },
    ],
    questions: [
      {
        q: 'Was wollte die Erzählerin schon als Kind?',
        options: ['Einen Marathon laufen.', 'In Deutschland wohnen.', 'Fußball spielen.'],
        answer: 0,
      },
      { q: 'Wie fühlte sie sich vor dem Rennen?', options: ['Sehr müde.', 'Sehr stolz.', 'Sehr nervös.'], answer: 2 },
      {
        q: 'Warum lief sie weiter?',
        options: ['Sie wollte schnell fertig sein.', 'Die Zuschauer riefen ihren Namen.', 'Ihr Trainer wartete im Ziel.'],
        answer: 1,
      },
    ],
    source: UNIT_21_SOURCE,
  },
]

export const UNIT_21_SPEAKING: SpeakingScenario[] = [
  {
    id: UNIT_21_SPEAKING_ID,
    title: 'Ein besonderes Erlebnis',
    titleRu: 'Особенное событие',
    titleKy: 'Өзгөчө окуя',
    icon: '🧳',
    level: 'B1',
    goal: {
      ru: 'Расскажите о событии, которое вы пережили: что случилось, в каком порядке и что вы чувствовали. Собеседник сомневается и задаёт вопросы.',
      ky: 'Башыңыздан өткөн окуяны айтып бериңиз: эмне болду, кандай иретте болду жана эмне сездиңиз. Маектешиңиз шектенип, суроолорду берет.',
    },
    turns: [
      {
        ai: 'Hallo! Erzähl mir von einem besonderen Erlebnis. Was war es?',
        aiRu: 'Привет! Расскажи мне о каком-нибудь особенном событии. Что это было?',
        aiKy: 'Салам! Мага бир өзгөчө окуя жөнүндө айтып бер. Ал эмне болгон?',
        hints: [
          'Ich habe eine Reise nach … gemacht.',
          'Es war ein unvergessliches Erlebnis.',
          'Ich habe zufällig meine alte Freundin getroffen.',
        ],
        keywords: ['reise', 'erlebnis', 'getroffen', 'freundin'],
      },
      {
        ai: 'Wirklich? Das klingt unglaublich! Wann war das und wo?',
        aiRu: 'Правда? Звучит невероятно! Когда это было и где?',
        aiKy: 'Чын элеби? Бул ишенгис болуп жатат! Качан жана кайда болгон?',
        hints: ['Das war vor einem Jahr in …', 'Damals habe ich noch in … gewohnt.', 'Es war im Sommer.'],
        keywords: ['vor', 'damals', 'sommer', 'jahr'],
      },
      {
        ai: 'Was ist dann passiert? Erzähl der Reihe nach.',
        aiRu: 'Что было потом? Рассказывай по порядку.',
        aiKy: 'Анан эмне болду? Ирети менен айтып бер.',
        hints: [
          'Zuerst bin ich in … angekommen.',
          'Dann habe ich den Zug genommen.',
          'Plötzlich habe ich … gesehen.',
          'Schließlich habe ich … gefunden.',
        ],
        keywords: ['zuerst', 'dann', 'plötzlich', 'schließlich'],
      },
      {
        ai: 'Und wie hast du dich dabei gefühlt?',
        aiRu: 'А что ты при этом чувствовал?',
        aiKy: 'Ал эми ошол учурда өзүңдү кандай сездиң?',
        hints: [
          'Ich war sehr erleichtert, weil alles gut gegangen ist.',
          'Ich war begeistert, aber auch nervös.',
          'Es war mir ein bisschen peinlich, weil …',
        ],
        keywords: ['war', 'erleichtert', 'weil', 'peinlich'],
      },
      {
        ai: 'Hat sich seitdem etwas verändert?',
        aiRu: 'С тех пор что-нибудь изменилось?',
        aiKy: 'Ошондон бери бир нерсе өзгөрдүбү?',
        hints: ['Seitdem schreiben wir uns jeden Tag.', 'Seitdem denke ich oft daran.', 'Bevor ich es erlebt habe, hatte ich Angst.'],
        keywords: ['seitdem', 'bevor', 'denke', 'schreiben'],
      },
    ],
    source: UNIT_21_SOURCE,
  },
]

export const UNIT_21_WRITING: WritingTask[] = [
  {
    id: 'b1-wr-21-01',
    unit: 21,
    level: 'B1',
    title: 'Eine Nachricht über ein Erlebnis',
    situation: {
      ru: 'Ваша подруга или ваш друг давно живёт в другом городе. Напишите ей или ему письмо о событии, которое вы недавно пережили (поездка, неожиданная встреча, трудный день, важное решение). Расскажите по порядку, что случилось, и как вы себя чувствовали. Не меньше 70 слов.',
      ky: 'Сиздин досуңуз же курбуңуз көптөн бери башка шаарда жашайт. Ага жакында башыңыздан өткөн окуя жөнүндө кат жазыңыз (саякат, күтүлбөгөн жолугушуу, оор күн, маанилүү чечим). Эмне болгонун ирети менен жана өзүңүздү кандай сезгениңизди айтып бериңиз. Кеминде 70 сөз.',
    },
    formal: false,
    minWords: 70,
    mustInclude: [
      {
        label: 'Anrede und Gruß (Hallo … / Liebe Grüße)',
        patterns: ['hallo', 'liebe ', 'hi ', 'grüße', 'bis bald'],
        explain: { ru: 'Приветствие в начале и прощание в конце письма.', ky: 'Каттын башында саламдашуу, аягында коштошуу.' },
      },
      {
        label: 'Präteritum (mindestens zwei Verben: kam, ging, sah, fand, nahm, war …)',
        patterns: ['kam ', 'ging ', 'sah ', 'fand ', 'nahm ', 'lief ', 'blieb ', 'fuhr ', ' war '],
        explain: { ru: 'Хотя бы два глагола в Präteritum.', ky: 'Präteritum формасында кеминде эки этиш.' },
      },
      {
        label: 'Ein zeitlicher Konnektor (bevor, während, seitdem, bis, nachdem)',
        patterns: ['bevor', 'während', 'seitdem', 'bis ', 'nachdem'],
        explain: { ru: 'Хотя бы один временной союз.', ky: 'Кеминде бир убакыт байламтасы.' },
      },
      {
        label: 'Reihenfolge der Ereignisse (zuerst, dann, danach, plötzlich, schließlich)',
        patterns: ['zuerst', 'dann ', 'danach', 'plötzlich', 'schließlich'],
        explain: { ru: 'Слова, которые показывают порядок событий.', ky: 'Окуялардын иретин көрсөткөн сөздөр.' },
      },
      {
        label: 'Ein Grund mit weil (Ich war …, weil …)',
        patterns: ['weil '],
        explain: { ru: 'Причина с союзом weil: глагол стоит в конце.', ky: 'weil байламтасы менен себеп: этиш аягында турат.' },
      },
      {
        label: 'Ein Gefühl (erleichtert, enttäuscht, begeistert, peinlich, stolz …)',
        patterns: ['erleichtert', 'enttäuscht', 'begeistert', 'peinlich', 'stolz', 'überrascht', 'glücklich'],
        explain: { ru: 'Слово, которое называет чувство.', ky: 'Сезимди атаган сөз.' },
      },
    ],
    model:
      'Hallo Mila, du glaubst nicht, was ich letzte Woche erlebt habe! Am Samstag fuhr ich zum ersten Mal allein nach Hamburg. Zuerst ging alles gut. Während ich im Zug saß, las ich ein Buch. Dann kam ich am Bahnhof an, aber mein Koffer war weg! Ich bekam Angst und lief durch den ganzen Bahnhof. Schließlich fand ich ihn bei der Polizei. Ich war so erleichtert! Seitdem passe ich viel besser auf. Schreib mir bald, wie es dir geht. Liebe Grüße, Aisha',
    tips: [
      {
        ru: 'В письменном рассказе используйте Präteritum (kam, ging, sah, war …), а в разговоре с другом — Perfekt. Не смешивайте формы в одном предложении.',
        ky: 'Жазма аңгемеде Präteritum (kam, ging, sah, war …) колдонуңуз, ал эми дос менен сүйлөшкөндө — Perfekt. Бир сүйлөмдө формаларды аралаштырбаңыз.',
      },
      {
        ru: 'Свяжите события словами bevor, während, seitdem, bis, nachdem: в придаточном предложении глагол стоит в конце.',
        ky: 'Окуяларды bevor, während, seitdem, bis, nachdem сөздөрү менен байланыштырыңыз: байламтадан кийинки бөлүктө этиш аягында турат.',
      },
      {
        ru: 'Объясните причину с weil: «Ich war erleichtert, weil …» — глагол стоит в конце.',
        ky: 'Себепти weil менен түшүндүрүңүз: «Ich war erleichtert, weil …» — этиш аягында турат.',
      },
      {
        ru: 'Покажите порядок событий: zuerst, dann, danach, plötzlich, schließlich — и не забудьте сказать, что вы чувствовали.',
        ky: 'Окуялардын иретин көрсөтүңүз: zuerst, dann, danach, plötzlich, schließlich — жана өзүңүздүн сезимиңизди айтууну унутпаңыз.',
      },
      {
        ru: 'После написания пройдите по списку ниже и оцените себя сами: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
        ky: 'Жазып бүткөндөн кийин төмөнкү тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
      },
    ],
    source: UNIT_21_SOURCE,
  },
]
