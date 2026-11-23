import type { DeriveSpec } from './builder'

/**
 * Units 313, 314, 318 — ENRICHED lessons. Each is based on an existing legacy B1 lesson (named in `from`) whose rules, examples, mistakes, dialogue and exercises (RU + KY)
 * are reused unchanged in the NEW record; the extra examples, rules and practice questions below bring it to 8 examples and 8 questions.
 */
export interface Derived {
  /** id of the legacy lesson this one is based on */
  from: string
  spec: DeriveSpec
}

export const DERIVED_01: Derived[] = [
  {
    from: 'b1-doppelkonnektoren',
    spec: {
      n: 13,
      slug: 'zweiteilige-konnektoren',
      topic: 'Zweiteilige Konnektoren',
      title: ['Zweiteilige Konnektoren — je … desto, weder … noch, entweder … oder, sowohl … als auch', 'Эки бөлүктүү байламталар — je … desto, weder … noch, entweder … oder, sowohl … als auch'],
      ex: [
        ['Nicht nur das Essen, sondern auch die Stimmung war toll.', 'Не только еда, но и атмосфера была отличной.', 'Тамак гана эмес, атмосфера да сонун болду.', 'nicht nur … sondern auch'],
        ['Entweder du hilfst mir jetzt, oder ich mache es allein.', 'Либо ты поможешь мне сейчас, либо я сделаю это сам.', 'Же сен азыр мага жардам бер, же мен өзүм кылам.', 'entweder … oder (два предложения)'],
        ['Je mehr ich übe, desto sicherer fühle ich mich.', 'Чем больше я тренируюсь, тем увереннее себя чувствую.', 'Канчалык көп машыксам, ошончолук өзүмдү ишенимдүү сезем.', 'je … desto + Komparativ'],
      ],
      tasks: [
        ['f', 'Sie hat ___ Zeit noch Geld für einen Urlaub.', 'У неё нет ни времени, ни денег на отпуск.', 'Анда эс алууга убакыт да, акча да жок.', 'weder', ['nicht', 'kein'], ['Weder … noch — «ни … ни» без дополнительного nicht.', 'weder … noch — «не … не», кошумча nicht жок.']],
        ['c', 'Welcher Satz ist richtig?', 'Какое предложение правильное?', 'Кайсы сүйлөм туура?', 'Sowohl mein Bruder als auch meine Schwester wohnen in Berlin.', ['Sowohl mein Bruder als auch meine Schwester wohnt in Berlin.', 'Sowohl mein Bruder und meine Schwester wohnen in Berlin.'], ['Два подлежащих → глагол во множественном числе; вторая часть — «als auch», не «und».', 'Эки ээ → этиш көптүк санда; экинчи бөлүк — «als auch», «und» эмес.']],
        ['c', 'Was bedeutet „entweder … oder“?', 'Что означает «entweder … oder»?', '«entweder … oder» эмнени билдирет?', 'eine von zwei Möglichkeiten', ['beide Möglichkeiten', 'keine Möglichkeit'], ['Entweder … oder = «или … или»: выбирают одно из двух.', 'entweder … oder = «же … же»: экөөнүн бирин тандашат.']],
        ['o', 'Entweder fahren wir mit dem Zug, oder wir nehmen das Auto.', 'Либо мы поедем на поезде, либо возьмём машину.', 'Же биз поезд менен барабыз, же машинага отурабыз.', ['После entweder — обычный порядок слов; после oder — новое предложение.', 'entwederден кийин — кадимки тартип; oderден кийин — жаңы сүйлөм.']],
        ['f', 'Nicht nur die Preise, ___ auch die Mieten sind gestiegen.', 'Выросли не только цены, но и аренда.', 'Баалар гана эмес, ижара акысы да өстү.', 'sondern', ['aber', 'und'], ['Nicht nur … sondern auch — «не только … но и».', 'nicht nur … sondern auch — «гана эмес … дагы».']],
      ],
    },
  },
  {
    from: 'b1-textkohaesion',
    spec: {
      n: 14,
      slug: 'erweiterte-satzverbindungen',
      topic: 'Erweiterte Satzverbindungen',
      title: ['Erweiterte Satzverbindungen — erstens, außerdem, daher, dennoch, sonst …', 'Кеңейтилген сүйлөм байланыштары — erstens, außerdem, daher, dennoch, sonst …'],
      ex: [
        ['Ich muss früher aufstehen, sonst verpasse ich den Zug.', 'Мне нужно встать раньше, иначе я опоздаю на поезд.', 'Мен эртерээк турушум керек, антпесем поездге кечигип калам.', 'sonst («иначе»)'],
        ['Der Plan ist gut. Allerdings kostet er viel Geld.', 'План хороший. Правда, он стоит много денег.', 'План жакшы. Бирок ал көп акча турат.', 'allerdings («правда, однако»)'],
        ['Es hat geregnet. Deswegen fiel das Fest aus.', 'Шёл дождь. Поэтому праздник отменили.', 'Жамгыр жаады. Ошондуктан майрам болбой калды.', 'deswegen («поэтому»)'],
      ],
      when: [
        ['Другие частые слова-связки: sonst («иначе»), allerdings («правда, однако»), deswegen («поэтому»). Они тоже стоят на первом месте, за ними сразу идёт глагол: «Sonst verpasse ich den Zug».', 'Башка көп колдонулган байланыштыруучу сөздөр: sonst («антпесе»), allerdings («бирок»), deswegen («ошондуктан»). Алар да биринчи орунда турат, андан кийин дароо этиш келет: «Sonst verpasse ich den Zug».'],
      ],
      tasks: [
        ['f', 'Es regnet. ___ nehme ich einen Schirm mit.', 'Идёт дождь. Поэтому я беру зонт.', 'Жамгыр жаап жатат. Ошондуктан мен кол чатыр алам.', 'Deshalb', ['Obwohl', 'Weil'], ['Deshalb — следствие; после него глагол на втором месте.', 'deshalb — натыйжа; андан кийин этиш экинчи орунда.']],
        ['f', 'Der Verein ist klein. ___ machen viele Leute mit.', 'Объединение маленькое. Всё же многие участвуют.', 'Бирикме кичинекей. Ошентсе да көп адам катышат.', 'Dennoch', ['Daher', 'Erstens'], ['Dennoch — «всё же»: результат вопреки доводу.', 'dennoch — «ошентсе да»: аргументке карабай жыйынтык.']],
        ['f', 'Ich muss lernen, ___ bestehe ich die Prüfung nicht.', 'Мне нужно учиться, иначе я не сдам экзамен.', 'Мен окушум керек, антпесем экзаменди тапшыра албайм.', 'sonst', ['dennoch', 'außerdem'], ['Sonst = «иначе»: показывает последствие, если не сделать.', 'sonst = «антпесе»: аткарбаса кандай натыйжа болорун көрсөтөт.']],
        ['c', 'Welcher Satz ist richtig?', 'Какое предложение правильное?', 'Кайсы сүйлөм туура?', 'Außerdem hilft der Verein auch älteren Menschen.', ['Außerdem der Verein hilft auch älteren Menschen.', 'Außerdem, hilft der Verein auch älteren Menschen.'], ['После «Außerdem» сразу идёт глагол, без запятой.', '«Außerdem»дан кийин үтүрсүз дароо этиш келет.']],
        ['c', 'Welches Wort passt? „Das Wetter ist schlecht. ___ gehen wir spazieren.“', 'Какое слово подходит? «Das Wetter ist schlecht. ___ gehen wir spazieren.»', 'Кайсы сөз ылайыктуу? «Das Wetter ist schlecht. ___ gehen wir spazieren.»', 'Trotzdem', ['Deshalb', 'Zum Beispiel'], ['Погода плохая, но мы гуляем — уступка: trotzdem.', 'Аба ырайы жаман, бирок сейилдейбиз — кетирим: trotzdem.']],
        ['o', 'Allerdings kostet der Kurs sehr viel Geld.', 'Правда, курс стоит очень дорого.', 'Бирок курс абдан кымбат.', ['После allerdings — глагол (kostet), потом подлежащее.', 'allerdingsтен кийин — этиш (kostet), анан ээ.']],
      ],
    },
  },
  {
    from: 'b1-passiv-praesens',
    spec: {
      n: 18,
      slug: 'passiv-praesens-grundlagen',
      topic: 'Passiv Präsens',
      title: ['Passiv Präsens — werden + Partizip II', 'Passiv Präsens — werden + Partizip II формасы'],
      ex: [
        ['Hier wird nicht geraucht.', 'Здесь не курят.', 'Бул жерде тамеки чегилбейт.', 'wird … geraucht (без исполнителя)'],
        ['Die Rechnungen werden per E-Mail verschickt.', 'Счета отправляют по электронной почте.', 'Эсептер электрондук почта аркылуу жөнөтүлөт.', 'werden … verschickt (мн. число)'],
        ['Das Brot wird jeden Morgen frisch gebacken.', 'Хлеб каждое утро выпекают свежим.', 'Нан күн сайын эртең менен жаңы бышырылат.', 'wird … gebacken'],
      ],
      tasks: [
        ['f', 'Das Brot ___ jeden Morgen frisch gebacken.', 'Хлеб каждое утро выпекают свежим.', 'Нан күн сайын эртең менен жаңы бышырылат.', 'wird', ['werden', 'ist'], ['Подлежащее «das Brot» — единственное число: wird.', 'ээ «das Brot» — жекелик сан: wird.']],
        ['f', 'Die Rechnungen ___ per E-Mail verschickt.', 'Счета отправляют по электронной почте.', 'Эсептер электрондук почта аркылуу жөнөтүлөт.', 'werden', ['wird', 'sind'], ['Множественное число → werden.', 'Көптүк сан → werden.']],
        ['c', 'Wie lautet das Passiv von „Man repariert das Fahrrad“?', 'Как звучит Passiv от «Man repariert das Fahrrad»?', '«Man repariert das Fahrrad» сүйлөмүнүн Passivi кандай?', 'Das Fahrrad wird repariert.', ['Das Fahrrad repariert wird.', 'Das Fahrrad wird reparieren.'], ['Werden на втором месте + Partizip II в конце.', 'werden экинчи орунда + Partizip II аягында.']],
        ['o', 'Hier wird nicht geraucht.', 'Здесь не курят.', 'Бул жерде тамеки чегилбейт.', ['Werden на втором месте; nicht перед Partizip II.', 'werden экинчи орунда; nicht Partizip IIнин алдында.']],
      ],
    },
  },
]
