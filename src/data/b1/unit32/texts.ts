import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_32_SOURCE, UNIT_32_SPEAKING_ID } from './unit'

/**
 * Unit 32 texts — the practice material of the consolidation unit, in the format the curriculum names (a "Probeprüfung" as an EXERCISE: not an official exam, not a mock of any named examination,
 * no prediction of a result): 2 readings (one LONG, 200–250 words, and one SHORT notice, 80–150), 2 listening scripts of up to 220 words (an announcement followed by a conversation; a short talk),
 * 1 speaking scenario of 8 turns (a 2–3-minute talk about the own learning path + a joint plan for the course farewell, exercise only) and 3 writing tasks (an informal e-mail and a formal
 * letter of 70–90 words as main tasks, and a short learning-diary entry with a self-assessment as a micro-task). The reading questions use the three-option format of the curriculum, several of them
 * "richtig / falsch / steht nicht im Text". Sentences: 95th percentile ≤ 22 words, longest ≤ 28.
 * The texts recycle the topics of Units 21–31 (experiences, opinions, work, housing and environment, health and lifestyle, media, money, education, travel, society, authorities) with the constructions
 * of the course — Nebensätze, relative clauses, Plusquamperfekt, Passiv, the Zustandspassiv only with the ten participles of Unit 31 — and introduce NOTHING new: no new connector, tense or voice,
 * no Genitiv attribute, no Passiv Perfekt (… worden), no Konjunktiv II der Vergangenheit, no B2 construction.
 * ALL courses, offices, people and events are FICTIONAL and labelled so. Original material; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native speaker.
 * Listening: the dialogues are played with the browser's text-to-speech (the existing mechanism of the listening lab). That playback has NOT been verified on real devices, so no final-test item depends on audio.
 */
export const UNIT_32_LISTENING: ListeningExercise[] = [
  {
    id: 'b1-li-32-01',
    unit: 32,
    level: 'B1',
    title: 'Durchsage und Gespräch am Bahnhof (erfunden)',
    lines: [
      {
        speaker: 'Durchsage',
        text: 'Achtung, eine Durchsage für die Reisenden nach Dresden. Der Zug fährt heute nicht von Gleis drei, sondern von Gleis fünf. Er hat zehn Minuten Verspätung. Wir bitten um Entschuldigung.',
        ru: 'Внимание, объявление для пассажиров до Дрездена. Поезд отправляется сегодня не с пути три, а с пути пять. Он опаздывает на десять минут. Просим прощения.',
        ky: 'Көңүл буруңуз, Дрезденге баруучу жүргүнчүлөр үчүн жарыя. Поезд бүгүн үчүнчү жолдон эмес, бешинчи жолдон жөнөйт. Ал он мүнөткө кечигип жатат. Кечирим сурайбыз.',
      },
      {
        speaker: 'Mira',
        text: 'Hast du das gehört? Gleis fünf! Wir müssen schnell gehen, damit wir den Zug nicht verpassen.',
        ru: 'Ты слышал? Путь пять! Нам надо идти быстро, чтобы не опоздать на поезд.',
        ky: 'Уктуңбу? Беш жол! Поездге кечикпеш үчүн бизге тез баруу керек.',
      },
      {
        speaker: 'Ben',
        text: 'Keine Panik. Der Zug hat Verspätung, deshalb haben wir Zeit. Ich möchte nur noch schnell die Fahrkarten prüfen.',
        ru: 'Без паники. Поезд опаздывает, поэтому у нас есть время. Я только хочу быстро проверить билеты.',
        ky: 'Паника болбосун. Поезд кечигип жатат, ошондуктан бизде убакыт бар. Мен билеттерди тез гана текшергим келет.',
      },
      {
        speaker: 'Mira',
        text: 'Gut. Nachdem wir in Dresden angekommen sind, rufe ich meine Kollegin an. Sie wartet im Café auf uns.',
        ru: 'Хорошо. Когда мы приедем в Дрезден, я позвоню своей коллеге. Она ждёт нас в кафе.',
        ky: 'Жакшы. Дрезденге жеткенден кийин мен кесиптешиме чалам. Ал бизди кафеде күтүп жатат.',
      },
      {
        speaker: 'Ben',
        text: 'Wenn das Café zu ist, gehen wir ins Hotel. Das Zimmer haben wir schon bezahlt, die Buchung ist erledigt.',
        ru: 'Если кафе закрыто, пойдём в отель. Номер мы уже оплатили, бронь оформлена.',
        ky: 'Кафе жабык болсо, мейманканага барабыз. Бөлмөнү биз буга чейин эле төлөдүк, заказ бүттү.',
      },
      {
        speaker: 'Mira',
        text: 'Du denkst immer an alles. Weißt du, ob wir in Dresden umsteigen müssen?',
        ru: 'Ты всегда обо всём думаешь. Ты не знаешь, нужно ли нам пересаживаться в Дрездене?',
        ky: 'Сен дайыма баарын ойлойсуң. Дрезденде которулушубуз керекпи, билесиңби?',
      },
      {
        speaker: 'Ben',
        text: 'Nein, der Zug fährt direkt. Ich habe es dir gestern schon gesagt.',
        ru: 'Нет, поезд идёт прямо. Я тебе вчера уже об этом говорил.',
        ky: 'Жок, поезд түз барат. Мен сага муну кечээ эле айткам.',
      },
    ],
    questions: [
      {
        q: 'Von welchem Gleis fährt der Zug heute?',
        options: ['Von Gleis drei.', 'Von Gleis fünf.', 'Von Gleis acht.'],
        answer: 1,
      },
      {
        q: 'Warum haben die beiden noch Zeit?',
        options: ['Der Zug hat Verspätung.', 'Der Zug fährt später ab als geplant, weil Gleis fünf gesperrt ist.', 'Sie haben keine Fahrkarten.'],
        answer: 0,
      },
      {
        q: 'Was ist mit dem Hotelzimmer?',
        options: ['Es ist noch nicht gebucht.', 'Es ist zu teuer.', 'Sie haben es schon bezahlt.'],
        answer: 2,
      },
      {
        q: 'Müssen Mira und Ben in Dresden umsteigen?',
        options: ['Nein, der Zug fährt direkt.', 'Ja, in Leipzig.', 'Das wissen sie nicht.'],
        answer: 0,
      },
    ],
    keywords: ['Fortschritt', 'Hinweis', 'Ergebnis'],
    source: UNIT_32_SOURCE,
  },
  {
    id: 'b1-li-32-02',
    unit: 32,
    level: 'B1',
    title: 'Ein kurzer Vortrag: Meine Lernbilanz (erfunden)',
    lines: [
      {
        speaker: 'Ben',
        text: 'Guten Abend. Ich möchte Ihnen heute meine Lernbilanz vorstellen. Ich habe drei Punkte vorbereitet: was ich gelernt habe, was schwierig war und was ich mir vornehme.',
        ru: 'Добрый вечер. Сегодня я хочу представить вам свои учебные итоги. Я подготовил три пункта: чему я научился, что было трудным и что я намерен делать.',
        ky: 'Кайырлуу кеч. Бүгүн мен силерге өз окуу жыйынтыгымды тааныштыргым келет. Мен үч пунктту даярдадым: эмнени үйрөндүм, эмне кыйын болду жана эмнени ниет кылам.',
      },
      {
        speaker: 'Ben',
        text: 'Erstens: Ich habe gelernt, über meine Erfahrungen zu erzählen. Als ich im Frühling angefangen habe, konnte ich nur kurze Sätze sagen. Jetzt erzähle ich eine ganze Geschichte.',
        ru: 'Во-первых: я научился рассказывать о своём опыте. Когда я начал весной, я мог говорить только короткими предложениями. Теперь я рассказываю целую историю.',
        ky: 'Биринчиден: мен өз тажрыйбам жөнүндө айтууну үйрөндүм. Жазында баштаганымда мен кыска сүйлөмдөр гана айта алчумун. Азыр мен бүтүндөй окуяны айтып берем.',
      },
      {
        speaker: 'Ben',
        text: 'Zweitens: Schwierig war für mich die Wortstellung. Obwohl ich die Regeln kannte, habe ich oft Fehler gemacht. Mir hat geholfen, dass ich jeden Tag zehn Sätze geschrieben habe.',
        ru: 'Во-вторых: мне было трудно с порядком слов. Хотя я знал правила, я часто делал ошибки. Мне помогло то, что я каждый день писал по десять предложений.',
        ky: 'Экинчиден: мен үчүн сөздөрдүн иреттери кыйын болду. Эрежелерди билсем да, мен көп ката кылдым. Мага күн сайын он сүйлөм жазганым жардам берди.',
      },
      {
        speaker: 'Ben',
        text: 'Drittens: Mein Ziel ist, im Herbst in einer Firma zu arbeiten, in der ich Deutsch sprechen kann. Dafür schreibe ich eine Bewerbung, sobald der Kurs zu Ende ist.',
        ru: 'В-третьих: моя цель — осенью работать в фирме, где я смогу говорить по-немецки. Для этого я напишу заявление о приёме на работу, как только закончится курс.',
        ky: 'Үчүнчүдөн: менин максатым — күзүндө немисче сүйлөй турган фирмада иштөө. Ал үчүн мен курс бүтөөр замат жумушка арыз жазам.',
      },
      {
        speaker: 'Ben',
        text: 'Zum Schluss möchte ich mich bei meiner Lehrerin und bei der ganzen Gruppe bedanken. Ihre Geduld hat mir sehr geholfen. Vielen Dank fürs Zuhören.',
        ru: 'В заключение я хочу поблагодарить мою учительницу и всю группу. Ваше терпение мне очень помогло. Большое спасибо за внимание.',
        ky: 'Жыйынтыктап, мен мугалимиме жана бүт топко ыраазычылык билдиргим келет. Силердин сабырыңар мага абдан жардам берди. Көңүл бурганыңыздар үчүн чоң рахмат.',
      },
    ],
    questions: [
      {
        q: 'Wie viele Punkte hat Ben für seinen Vortrag vorbereitet?',
        options: ['Zwei.', 'Drei.', 'Vier.'],
        answer: 1,
      },
      {
        q: 'Was war für Ben schwierig?',
        options: ['Die Aussprache.', 'Die Zeiten der Verben.', 'Die Wortstellung.'],
        answer: 2,
      },
      {
        q: 'Was hat ihm geholfen?',
        options: ['Er hat jeden Tag zehn Sätze geschrieben.', 'Er hat ein ganzes Jahr im Ausland gelebt.', 'Er hat einen zweiten Kurs besucht.'],
        answer: 0,
      },
      {
        q: 'Wann schreibt Ben seine Bewerbung?',
        options: ['Schon im Frühling.', 'Sobald der Kurs zu Ende ist.', 'Nach der Abschlussfeier im Winter.'],
        answer: 1,
      },
    ],
    keywords: ['Bilanz', 'Vortrag', 'Gliederung'],
    source: UNIT_32_SOURCE,
  },
]

export const UNIT_32_READING: ReadingText[] = [
  {
    id: 'b1-re-32-01',
    unit: 32,
    level: 'B1',
    title: 'Meine Lernbilanz nach zwölf Wochen (erfunden)',
    body: [
      'Erfundene Lernbilanz von Mira Okan: Vor zwölf Wochen habe ich den Kurs begonnen, weil ich in Brunnenau arbeiten möchte. Am Anfang war ich unsicher, denn ich hatte lange nicht gelernt. Nachdem ich die ersten Wochen geschafft hatte, wurde es leichter. Meine Lehrerin sagt, dass ich keine Angst vor Fehlern haben muss.',
      'Besonders gern erinnere ich mich an die Reise nach Dresden. Dort hatte ich eine Panne: Mein Zug war ausgefallen, bevor ich am Bahnhof ankam. Ich habe ruhig bei der Rezeption nachgefragt, und das Hotel hat mir ein anderes Zimmer gegeben. So konnte ich viele Sätze aus dem Unterricht wirklich benutzen.',
      'Im Alltag helfen mir kleine Gewohnheiten. Jeden Abend schreibe ich drei Stichpunkte in mein Lerntagebuch, damit ich nichts vergesse. Wenn ich einen Fehler mache, notiere ich ihn und suche die Regel dazu. Außerdem lese ich Nachrichten, obwohl ich nicht alles verstehe. Das Ergebnis ist, dass ich die wichtigen Wörter schneller finde. Mit der Zeit habe ich verstanden, dass kleine Schritte wichtiger sind als große Pläne.',
      'Meine Stärke ist das Lesen, meine Schwäche das Sprechen. Deshalb plane ich einen Vortrag für die Abschlussfeier. Ich habe mir vorgenommen, dem Publikum zwei Dinge zu zeigen: erstens, was ich gelernt habe, und zweitens, was ich noch verbessern möchte. Wenn alles klappt, gebe ich im Herbst meine Bewerbung ab.',
    ],
    gloss: [
      {
        word: 'Nachdem ich die ersten Wochen geschafft hatte, …',
        ru: 'Когда я справилась с первыми неделями, … (Plusquamperfekt: сначала это, потом остальное)',
        ky: 'Мен алгачкы жумаларды ийгиликтүү өткөндөн кийин, … (Plusquamperfekt: адегенде бул, анан калганы)',
        example: 'Nachdem wir angekommen waren, haben wir gegessen.',
        grammar: 'nachdem + Plusquamperfekt (hatte / war + Partizip II в конце); главная часть — Perfekt или Präteritum',
        grammarKy: 'nachdem + Plusquamperfekt (аягында hatte / war + Partizip II); башкы бөлүк — Perfekt же Präteritum',
        related: [],
      },
      {
        word: 'weil, denn, damit, obwohl, wenn, bevor',
        ru: 'потому что, так как, чтобы, хотя, если / когда, прежде чем (придаточные: глагол в конце; denn — главное предложение)',
        ky: 'анткени, себеби, үчүн, … да, эгер / качан, … мурун (кошумча бөлүктөр: этиш аягында; denn — башкы бөлүк)',
        example: 'Ich lerne, damit ich besser spreche.',
        grammar: 'Nebensatz: союз + подлежащее + … + глагол в конце; повторение всех типов — в грамматике юнита',
        grammarKy: 'Nebensatz: байламта + ээ + … + аягында этиш; бардык түрлөрүн кайталоо — бөлүмдүн грамматикасында',
        related: [],
      },
      {
        word: 'Mein Zug war ausgefallen, bevor ich am Bahnhof ankam.',
        ru: 'Мой поезд был отменён ещё до того, как я приехала на вокзал. (Plusquamperfekt + bevor)',
        ky: 'Вокзалга жеткенге чейин эле поездим жокко чыгарылган эле. (Plusquamperfekt + bevor)',
        example: 'Ich hatte die Fahrkarte schon gekauft.',
        grammar: 'war ausgefallen = Plusquamperfekt (ausfallen → sein); bevor + Präteritum из списка юнита 21 (ankam)',
        grammarKy: 'war ausgefallen = Plusquamperfekt (ausfallen → sein); bevor + 21-бөлүмдүн тизмесиндеги Präteritum (ankam)',
        related: [],
      },
      {
        word: 'Ich habe mir vorgenommen, dem Publikum zwei Dinge zu zeigen',
        ru: 'Я решила показать слушателям две вещи (sich vornehmen + инфинитив с zu)',
        ky: 'Мен угуучуларга эки нерсени көрсөтүүнү чечтим (sich vornehmen + zu менен инфинитив)',
        example: 'Ich nehme mir vor, jeden Tag zu lesen.',
        grammar: 'Infinitivsatz с zu: zu стоит прямо перед инфинитивом в конце; запятая перед инфинитивной частью',
        grammarKy: 'zu менен инфинитив бөлүгү: zu инфинитивдин дароо алдында аягында; инфинитив бөлүгүнүн алдында үтүр',
        related: [],
      },
    ],
    questions: [
      {
        q: 'Aussage: Mira hat den Kurs begonnen, weil sie in Brunnenau arbeiten möchte.',
        options: ['richtig', 'falsch', 'steht nicht im Text'],
        answer: 0,
      },
      {
        q: 'Aussage: Mira hat in Dresden eine Wohnung gemietet.',
        options: ['richtig', 'falsch', 'steht nicht im Text'],
        answer: 2,
      },
      {
        q: 'Aussage: Mira schreibt jeden Morgen in ihr Lerntagebuch.',
        options: ['richtig', 'falsch', 'steht nicht im Text'],
        answer: 1,
      },
      {
        q: 'Was möchte Mira bei der Abschlussfeier tun?',
        options: ['Einen Vortrag halten.', 'Eine Reise planen.', 'Den Kurs wechseln.'],
        answer: 0,
      },
    ],
    source: UNIT_32_SOURCE,
  },
  {
    id: 'b1-re-32-02',
    unit: 32,
    level: 'B1',
    title: 'Information zum Kursende (erfunden)',
    body: [
      'Kursbüro Brunnenau (erfunden): Zum Kursende bieten wir am Freitag um zehn Uhr eine Probe an. Sie ist eine Übung für Sie und keine offizielle Prüfung. Die Probe hat vier Teile: Lesen, Hören, Schreiben und Sprechen.',
      'Bitte melden Sie sich bis Mittwoch an. Das Formular muss ausgefüllt und unterschrieben werden. Bringen Sie einen Stift mit, damit Sie die Aufgaben bearbeiten können. Wer krank ist, gibt uns bitte vorher Bescheid. Das Ergebnis besprechen wir gemeinsam in der Gruppe, falls Sie das möchten. Der Raum ist ab neun Uhr geöffnet. Bei Fragen ist Frau Weiß Ihre Ansprechpartnerin.',
    ],
    gloss: [
      {
        word: 'Das Formular muss ausgefüllt und unterschrieben werden.',
        ru: 'Бланк должен быть заполнен и подписан. (Passiv с модальным глаголом)',
        ky: 'Бланк толтурулуп, кол коюлушу керек. (модалдык этиш менен Passiv)',
        example: 'Das Formular muss eingereicht werden.',
        grammar: 'модальный глагол … Partizip II + werden в конце',
        grammarKy: 'модалдык этиш … аягында Partizip II + werden',
        related: [],
      },
      {
        word: 'keine offizielle Prüfung',
        ru: 'это не официальный экзамен — только упражнение для вас',
        ky: 'бул расмий экзамен эмес — силер үчүн көнүгүү гана',
        example: 'Die Probe ist freiwillig.',
        grammar: 'в этом юните «Probe» — упражнение; она не предсказывает результат никакого настоящего экзамена',
        grammarKy: 'бул бөлүмдө «Probe» — көнүгүү; ал эч кандай чыныгы экзамендин жыйынтыгын алдын ала айтпайт',
        related: [],
      },
    ],
    questions: [
      {
        q: 'Aussage: Die Probe ist eine offizielle Prüfung.',
        options: ['richtig', 'falsch', 'steht nicht im Text'],
        answer: 1,
      },
      {
        q: 'Bis wann soll man sich anmelden?',
        options: ['Bis Freitag.', 'Bis Montag.', 'Bis Mittwoch.'],
        answer: 2,
      },
      {
        q: 'Aussage: Die Probe kostet zehn Euro.',
        options: ['richtig', 'falsch', 'steht nicht im Text'],
        answer: 2,
      },
    ],
    source: UNIT_32_SOURCE,
  },
]

export const UNIT_32_SPEAKING: SpeakingScenario[] = [
  {
    id: UNIT_32_SPEAKING_ID,
    title: 'Mein kurzer Vortrag und die Abschlussfeier',
    titleRu: 'Моё короткое выступление и прощальный праздник курса',
    titleKy: 'Менин кыска чыгуум жана курстун коштошуу майрамы',
    icon: '🎤',
    level: 'B1',
    goal: {
      ru: 'Вы готовите короткое выступление о своём обучении (2–3 минуты в реальности): вступление, два пункта, заключение — и вместе с партнёром (вымышленным) планируете прощальный праздник курса. Это только упражнение. Отреагируйте на вопрос и на неожиданное сообщение, что зал занят, и оцените себя по списку, а не баллами.',
      ky: 'Сиз өз окуу жөнүндө кыска чыгууну даярдайсыз (чындыгында 2–3 мүнөт): киришүү, эки пункт, жыйынтык — жана (ойдон чыгарылган) шериги менен курстун коштошуу майрамын чогуу пландайсыз. Бул көнүгүү гана. Суроого жана зал бош эмес экени жөнүндөгү күтүлбөгөн кабарга жооп бериңиз жана өзүңүздү упай менен эмес, тизме боюнча баалаңыз.',
    },
    turns: [
      {
        ai: 'Schön, dass du da bist. Du möchtest deinen Vortrag für die Abschlussfeier üben. Womit fängst du an?',
        aiRu: 'Хорошо, что ты пришёл. Ты хочешь потренировать выступление для прощального праздника. С чего ты начнёшь?',
        aiKy: 'Келгениң жакшы болду. Сен коштошуу майрамына чыгууңду машыккың келет. Эмеден баштайсың?',
        hints: [
          'Ich fange mit der Einleitung an: Ich möchte Ihnen heute meine Lernbilanz vorstellen.',
          'Zuerst sage ich kurz, worum es in meinem Vortrag geht.',
          'Ich habe drei Stichpunkte vorbereitet.',
        ],
        keywords: ['einleitung', 'lernbilanz', 'vorstellen', 'stichpunkte'],
      },
      {
        ai: 'Gut. Was war dein wichtigster Fortschritt?',
        aiRu: 'Хорошо. Какой был твой самый важный прогресс?',
        aiKy: 'Жакшы. Сенин эң маанилүү жылышың эмне болду?',
        hints: [
          'Erstens kann ich jetzt eine ganze Geschichte erzählen.',
          'Nachdem ich viel geübt hatte, wurde das Sprechen leichter.',
          'Als ich angefangen habe, konnte ich nur kurze Sätze sagen.',
        ],
        keywords: ['erstens', 'geschichte', 'nachdem', 'geübt'],
      },
      {
        ai: 'Und was möchtest du noch verbessern?',
        aiRu: 'А что ты ещё хочешь улучшить?',
        aiKy: 'Ал эми дагы эмнени жакшыртууну каалайсың?',
        hints: [
          'Zweitens möchte ich die Wortstellung verbessern.',
          'Ich übe jeden Tag, damit ich weniger Fehler mache.',
          'Meine Schwäche ist das Sprechen, obwohl ich viel lese.',
        ],
        keywords: ['zweitens', 'verbessern', 'schwäche', 'damit'],
      },
      {
        ai: 'Ich habe eine Frage: Warum glaubst du, dass das Lerntagebuch wirklich hilft?',
        aiRu: 'У меня вопрос: почему ты думаешь, что дневник обучения действительно помогает?',
        aiKy: 'Менин суроом бар: окуу күндөлүгү чындап эле жардам берерин эмнеге ойлойсуң?',
        hints: [
          'Ich glaube, dass es hilft, weil ich meine Fehler sehe.',
          'Das ist ein berechtigter Einwand. Für mich hilft es, auch wenn es nicht für alle gleich ist.',
          'Wenn ich etwas aufschreibe, vergesse ich es weniger.',
        ],
        keywords: ['glaube', 'weil', 'fehler', 'aufschreibe'],
      },
      {
        ai: 'Danke, das war klar. Jetzt planen wir die Abschlussfeier. Wann sollen wir sie machen?',
        aiRu: 'Спасибо, было понятно. Теперь планируем прощальный праздник. Когда мы его проведём?',
        aiKy: 'Рахмат, түшүнүктүү болду. Эми коштошуу майрамын пландайбыз. Аны качан өткөрөбүз?',
        hints: [
          'Ich schlage vor, dass wir sie am Freitag um achtzehn Uhr machen.',
          'Wie wäre es mit Freitagabend im Kursraum?',
          'Wenn alle Zeit haben, passt mir der Freitag am besten.',
        ],
        keywords: ['freitag', 'vorschlag', 'achtzehn', 'zeit'],
      },
      {
        ai: 'Der Raum ist am Freitag leider schon belegt. Was machen wir jetzt?',
        aiRu: 'Зал в пятницу, к сожалению, уже занят. Что нам теперь делать?',
        aiKy: 'Тилекке каршы, жума күнү зал бош эмес. Эми эмне кылабыз?',
        hints: [
          'Moment, ich überlege kurz. Falls der Raum am Samstag frei ist, können wir ihn dann nehmen.',
          'Wir können auch im Garten feiern, wenn das Wetter schön ist.',
          'Habe ich Sie richtig verstanden? Nur der Freitag ist nicht möglich?',
        ],
        keywords: ['falls', 'samstag', 'garten', 'verstanden'],
      },
      {
        ai: 'Gut, dann machen wir es am Samstag. Wer bringt was mit?',
        aiRu: 'Хорошо, тогда сделаем в субботу. Кто что принесёт?',
        aiKy: 'Жакшы, анда ишембиде өткөрөбүз. Ким эмне алып келет?',
        hints: [
          'Ich bringe morgen die Getränke mit. Du kannst mir die Liste schicken.',
          'Ich habe die Einladung schon geschrieben und schicke sie dir heute noch.',
          'Ich bringe es dir morgen im Kurs, damit du es vorher sehen kannst.',
        ],
        keywords: ['bringe', 'getränke', 'liste', 'einladung'],
      },
      {
        ai: 'Dann haben wir einen Plan. Möchtest du zum Schluss noch ein paar Abschiedsworte sagen?',
        aiRu: 'Тогда у нас есть план. Хочешь в конце сказать ещё несколько слов на прощание?',
        aiKy: 'Анда бизде план бар. Аягында коштошуу сөздөрүн айткың келеби?',
        hints: [
          'Ja, zum Schluss möchte ich mich bei allen bedanken, die mir geholfen haben.',
          'Ich habe viel gelernt und viele nette Leute kennengelernt. Vielen Dank!',
          'Mein Fazit ist positiv, auch wenn nicht alles leicht war.',
        ],
        keywords: ['schluss', 'bedanken', 'fazit', 'dank'],
      },
    ],
    source: UNIT_32_SOURCE,
  },
]

const TIP_SELF = {
  ru: 'После написания пройдите по списку ниже и оцените себя сами: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
  ky: 'Жазып бүткөндөн кийин төмөнкү тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
}
const TIP_RUBRIC = {
  ru: 'Самооценка по четырём критериям (без уровней CEFR): «Aufgabe erfüllt» (нет / частично / полностью), «Zusammenhang» (отдельные предложения / связаны союзами / чёткая структура), «Wortschatz» (часто искал слова / в основном подходящий / разнообразный), «Genauigkeit» (много ошибок / несколько / мало).',
  ky: 'Төрт критерий боюнча өзүн баалоо (CEFR деңгээлисиз): «Aufgabe erfüllt» (жок / жарым-жартылай / толук), «Zusammenhang» (жеке сүйлөмдөр / байламталар менен байланышкан / так түзүлүш), «Wortschatz» (көп издедим / көбүнчө ылайыктуу / ар түрдүү), «Genauigkeit» (көп ката / бир нече / аз).',
}

export const UNIT_32_WRITING: WritingTask[] = [
  {
    id: 'b1-wr-32-01',
    unit: 32,
    level: 'B1',
    title: 'Eine E-Mail an eine Freundin: Mein Kurs ist zu Ende',
    situation: {
      ru: 'Ваш курс подходит к концу. Напишите неформальное письмо подруге (du): как прошёл курс (Perfekt / Präteritum), что было трудно и что помогло (weil / obwohl), чему вы хотите научиться дальше (damit или um … zu), и пригласите её на прощальный праздник (предложение и просьба ответить).',
      ky: 'Сиздин курсуңуз бүтүп баратат. Курбуңузга расмий эмес кат жазыңыз (du): курс кандай өттү (Perfekt / Präteritum), эмне кыйын болду жана эмне жардам берди (weil / obwohl), андан ары эмнени үйрөнгүңүз келет (damit же um … zu) жана аны коштошуу майрамына чакырыңыз (сунуш жана жооп берүүнү өтүнүү).',
    },
    formal: false,
    minWords: 80,
    mustInclude: [
      {
        label: 'Anrede und Gruß (Liebe Anna, … / Viele Grüße)',
        patterns: ['liebe', 'lieber', 'hallo', 'viele grüße', 'liebe grüße', 'herzliche grüße'],
        explain: {
          ru: 'Дружеское обращение в начале и приветливое прощание в конце (форма du).',
          ky: 'Башында достук кайрылуу жана аягында жылуу коштошуу (du формасы).',
        },
      },
      {
        label: 'Rückblick (Der Kurs war … / Ich habe … gelernt)',
        patterns: ['habe ', 'hatte ', 'war ', 'bin '],
        explain: {
          ru: 'Расскажите в прошедшем времени, как прошёл курс: Perfekt в разговоре или Präteritum (war, hatte).',
          ky: 'Курс кандай өткөнүн өткөн чакта айтыңыз: оозеки Perfekt же Präteritum (war, hatte).',
        },
      },
      {
        label: 'Grund und Gegensatz (weil … / obwohl …)',
        patterns: ['weil', 'obwohl', 'denn'],
        explain: {
          ru: 'Одно предложение с weil (причина) или obwohl (уступка): глагол в придаточном — в конце.',
          ky: 'weil (себеп) же obwohl (макул болбостук) менен бир сүйлөм: кошумча бөлүктө этиш аягында.',
        },
      },
      {
        label: 'Ziel (damit … / um … zu …)',
        patterns: ['damit', 'um '],
        explain: {
          ru: 'Одно предложение о цели: damit (другое подлежащее) или um … zu (то же подлежащее).',
          ky: 'Максат жөнүндө бир сүйлөм: damit (ээ башка) же um … zu (ээ ошол эле).',
        },
      },
      {
        label: 'Ein Wort der Gliederung (erstens, außerdem, daher, dennoch)',
        patterns: ['erstens', 'außerdem', 'daher', 'dennoch', 'zum beispiel', 'zweitens'],
        explain: {
          ru: 'Используйте хотя бы одно слово-опору для структуры (erstens, außerdem, daher, dennoch).',
          ky: 'Түзүлүш үчүн жок дегенде бир таяныч сөздү колдонуңуз (erstens, außerdem, daher, dennoch).',
        },
      },
      {
        label: 'Einladung und Frage (Hast du Zeit? / Kommst du …?)',
        patterns: ['kommst du', 'hast du zeit', 'möchtest du', 'hast du lust', 'ich lade dich ein', 'schreib mir'],
        explain: {
          ru: 'Пригласите подругу и попросите ответить: «Kommst du?», «Schreib mir bitte kurz».',
          ky: 'Курбуңузду чакырып, жооп берүүнү өтүнүңүз: «Kommst du?», «Schreib mir bitte kurz».',
        },
      },
      {
        label: 'Fazit und Gefühl (Ich bin zufrieden / Mein Fazit ist …)',
        patterns: ['zufrieden', 'fazit', 'stolz', 'froh'],
        explain: {
          ru: 'Подведите итог одним предложением: «Ich bin zufrieden», «Mein Fazit ist positiv».',
          ky: 'Бир сүйлөм менен жыйынтык чыгарыңыз: «Ich bin zufrieden», «Mein Fazit ist positiv».',
        },
      },
    ],
    model:
      'Liebe Anna, in zwei Wochen ist mein Deutschkurs zu Ende. Ich habe viel gelernt, obwohl der Anfang schwierig war. Erstens kann ich jetzt längere Geschichten erzählen. Außerdem verstehe ich die Nachrichten besser, weil ich jeden Tag gelesen habe. Mein Fazit ist positiv: Ich bin zufrieden. Im Herbst möchte ich weiterlernen, damit ich im Beruf sicherer spreche. Wir machen am Samstag eine kleine Abschlussfeier. Es gibt Kuchen und Musik. Ich freue mich schon sehr darauf. Kommst du? Schreib mir bitte kurz. Viele Grüße, Mira',
    tips: [
      {
        ru: 'Порядок письма: обращение — итог курса — причина или уступка — цель — приглашение — прощание. Придаточные заканчиваются глаголом; после придаточного в начале предложения глагол стоит сразу после запятой.',
        ky: 'Каттын иреттери: кайрылуу — курстун жыйынтыгы — себеп же макул болбостук — максат — чакыруу — коштошуу. Кошумча бөлүктөр этиш менен бүтөт; сүйлөмдүн башындагы кошумча бөлүктөн кийин этиш үтүрдөн дароо кийин турат.',
      },
      {
        ru: 'Проверьте порядок слов в середине предложения: местоимения раньше существительных, время раньше места («Wir machen am Samstag im Kursraum eine Feier»).',
        ky: 'Сүйлөмдүн ортосундагы сөз иретин текшериңиз: ат атоочтор зат атоочтордун алдында, убакыт жердин алдында («Wir machen am Samstag im Kursraum eine Feier»).',
      },
      TIP_RUBRIC,
      TIP_SELF,
    ],
    source: UNIT_32_SOURCE,
  },
  {
    id: 'b1-wr-32-02',
    unit: 32,
    level: 'B1',
    title: 'Ein formeller Brief: Den Termin der Probe verschieben',
    situation: {
      ru: 'Вы не можете прийти на пробу (упражнение) в вымышленном Kursbüro Brunnenau в пятницу. Напишите формальное письмо (Sie): обращение, повод, причина (weil), вежливая просьба о другом времени, одно предложение с falls или wenn и благодарность. Это не официальный экзамен — ссылайтесь на объявление.',
      ky: 'Сиз ойдон чыгарылган Kursbüro Brunnenauда жума күнү өтүүчү сынакка (көнүгүүгө) келе албайсыз. Расмий кат жазыңыз (Sie): кайрылуу, себеп, себеп (weil), башка убакытты сылык суроо, falls же wenn менен бир сүйлөм жана ыраазычылык. Бул расмий экзамен эмес — жарыяга шилтеме бериңиз.',
    },
    formal: true,
    minWords: 70,
    mustInclude: [
      {
        label: 'Anrede und Gruß (Sehr geehrte Damen und Herren, … / Mit freundlichen Grüßen)',
        patterns: ['sehr geehrte', 'sehr geehrter', 'mit freundlichen grüßen'],
        explain: {
          ru: 'Официальное обращение и «Mit freundlichen Grüßen»; везде форма Sie.',
          ky: 'Расмий кайрылуу жана «Mit freundlichen Grüßen»; бардык жерде Sie формасы.',
        },
      },
      {
        label: 'Anlass (Ich schreibe Ihnen wegen … / zur Probe am Freitag)',
        patterns: ['ich schreibe ihnen', 'wegen', 'zur probe', 'zu ihrer information', 'bezug'],
        explain: {
          ru: 'Коротко скажите, по какому поводу вы пишете.',
          ky: 'Эмне себептен жазып жатканыңызды кыскача айтыңыз.',
        },
      },
      {
        label: 'Grund (weil …)',
        patterns: ['weil', 'denn'],
        explain: {
          ru: 'Назовите причину: weil + глагол в конце.',
          ky: 'Себепти атаңыз: weil + аягында этиш.',
        },
      },
      {
        label: 'Höfliche Bitte (Könnten Sie mir bitte mitteilen, … / Ich bitte um …)',
        patterns: ['könnten sie', 'ich bitte um', 'ich möchte sie bitten', 'würden sie'],
        explain: {
          ru: 'Одна вежливая просьба: «Könnten Sie mir bitte mitteilen, ob …», «Ich bitte um einen anderen Termin».',
          ky: 'Бир сылык өтүнүч: «Könnten Sie mir bitte mitteilen, ob …», «Ich bitte um einen anderen Termin».',
        },
      },
      {
        label: 'Bedingung (falls … / wenn …)',
        patterns: ['falls', 'wenn'],
        explain: {
          ru: 'Одно предложение с falls или wenn: например, «Falls am Montag ein Platz frei ist, …».',
          ky: 'falls же wenn менен бир сүйлөм: мисалы, «Falls am Montag ein Platz frei ist, …».',
        },
      },
      {
        label: 'Dank (Vielen Dank im Voraus)',
        patterns: ['vielen dank', 'danke', 'im voraus'],
        explain: { ru: 'Поблагодарите заранее.', ky: 'Алдын ала ыраазычылык билдириңиз.' },
      },
    ],
    model:
      'Sehr geehrte Damen und Herren, ich schreibe Ihnen wegen der Probe am Freitag um zehn Uhr. Leider kann ich nicht teilnehmen, weil ich an diesem Tag arbeiten muss. Könnten Sie mir bitte mitteilen, ob es einen anderen Termin gibt? Falls am Montag ein Platz frei ist, komme ich gern am Nachmittag. Das Anmeldeformular ist ausgefüllt und unterschrieben und wird heute noch per Post geschickt. Vielen Dank im Voraus. Mit freundlichen Grüßen, Mira Okan',
    tips: [
      {
        ru: 'Формальное письмо: везде Sie, «Könnten Sie …», слова «mitteilen», «Termin». Срок и условия называйте как принадлежащие объявлению Kursbüro (вымышленному), а не как правило.',
        ky: 'Расмий кат: бардык жерде Sie, «Könnten Sie …», «mitteilen», «Termin» сөздөрү. Мөөнөттү жана шарттарды Kursbüro жарыясына (ойдон чыгарылган) таандык катары атаңыз, эреже катары эмес.',
      },
      {
        ru: 'Для статуса бланка можно использовать Zustandspassiv с причастием из списка юнита 31 («ist ausgefüllt und unterschrieben»).',
        ky: 'Бланктын статусу үчүн 31-бөлүмдүн тизмесиндеги причастие менен Zustandspassivди колдонсо болот («ist ausgefüllt und unterschrieben»).',
      },
      TIP_RUBRIC,
      TIP_SELF,
    ],
    source: UNIT_32_SOURCE,
  },
  {
    id: 'b1-wr-32-03',
    unit: 32,
    level: 'B1',
    title: 'Mein Lerntagebuch: Stärken, Schwächen und ein Vorsatz',
    situation: {
      ru: 'Напишите короткую запись в дневнике обучения (3–4 предложения): в чём ваша сильная сторона, в чём слабая, чего вы себе намерены (sich vornehmen) и довольны ли вы своим прогрессом — с объяснением (weil).',
      ky: 'Окуу күндөлүгүнө кыска жазуу жазыңыз (3–4 сүйлөм): кайсы жагыңыз күчтүү, кайсы жагыңыз алсыз, эмнени ниет кыласыз (sich vornehmen) жана өз жылышыңызга ыраазыбысыз — түшүндүрмө менен (weil).',
    },
    formal: false,
    minWords: 30,
    mustInclude: [
      {
        label: 'Stärke und Schwäche (Meine Stärke ist … / Meine Schwäche ist …)',
        patterns: ['stärke', 'schwäche', 'gut', 'schwer'],
        explain: {
          ru: 'Назовите одну сильную и одну слабую сторону: «Meine Stärke ist das Lesen, meine Schwäche das Sprechen».',
          ky: 'Бир күчтүү жана бир алсыз жагын атаңыз: «Meine Stärke ist das Lesen, meine Schwäche das Sprechen».',
        },
      },
      {
        label: 'Vorsatz (Ich nehme mir vor, … zu …)',
        patterns: ['nehme mir vor', 'möchte', 'will', 'mein ziel', 'mein lernziel'],
        explain: {
          ru: 'Скажите, что вы намерены делать: «Ich nehme mir vor, jeden Tag zu sprechen».',
          ky: 'Эмне кылууну ниет кылганыңызды айтыңыз: «Ich nehme mir vor, jeden Tag zu sprechen».',
        },
      },
      {
        label: 'Zufriedenheit mit Grund (Ich bin zufrieden, weil …)',
        patterns: ['zufrieden', 'weil', 'stolz'],
        explain: {
          ru: 'Скажите, довольны ли вы прогрессом, и объясните почему (weil).',
          ky: 'Жылышыңызга ыраазыбы экениңизди айтып, эмне үчүн экенин түшүндүрүңүз (weil).',
        },
      },
    ],
    model:
      'Meine Stärke ist das Lesen, meine Schwäche ist das Sprechen. Ich nehme mir vor, jeden Tag zehn Minuten laut zu sprechen, damit ich sicherer werde. Mit meinem Fortschritt bin ich zufrieden, weil ich jetzt eine ganze Geschichte erzählen kann.',
    tips: [
      {
        ru: 'Дневник — для вас: пишите честно и коротко. Сравните эту запись с первой записью курса — это ваш личный итог.',
        ky: 'Күндөлүк — өзүңүз үчүн: чынчыл жана кыска жазыңыз. Бул жазууну курстун биринчи жазуусу менен салыштырыңыз — бул сиздин жеке жыйынтыгыңыз.',
      },
      TIP_RUBRIC,
      TIP_SELF,
    ],
    source: UNIT_32_SOURCE,
  },
]
