import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_18_SOURCE } from '../provenance'

/**
 * Unit 18 texts (Stage 7I): 2 listening dialogues, 2 readings, 1 speaking scenario, 1 writing task.
 * Register and genre (brief): NOT all travel-agency interactions. L1 is a face-to-face conversation at a station ticket counter (Sie); L2 two friends plan
 * the summer (du); R1 is a holiday brochure, R2 an informal postcard (past events in the Perfekt, a problem on the way, a plan); the speaking task S1 is an
 * INFORMAL conversation with an acquaintance about a holiday (du); the writing task is an informal postcard. No travel-agency dialogue, no telephone call,
 * no formal e-mail. Rules applied: prepositions of the unit (nach / in / an / auf / zu / bei / aus / von) with the three countries with an article; the future
 * with the present and a time word; `werden` only in `Es wird …`; no adjective after a Dativ preposition; no adjective without an article except the fixed time
 * expressions `Nächstes Jahr` / `Nächste Woche`; no `man`, no `als` as a conjunction, no Genitiv.
 */
export const UNIT_18_LISTENING: ListeningExercise[] = [
  {
    id: 'a2-li-18-01',
    unit: 18,
    level: 'A2',
    title: 'Am Bahnhof: Ein Ticket kaufen',
    lines: [
      { speaker: 'Herr Berger', text: 'Guten Tag. Wie kann ich helfen?', ru: 'Добрый день. Чем могу помочь?', ky: 'Кайырлуу күн. Сизге кантип жардам берсем болот?' },
      { speaker: 'Frau Sahin', text: 'Guten Tag. Ich möchte ein Ticket nach Hamburg, für morgen.', ru: 'Добрый день. Я хотела бы билет до Гамбурга на завтра.', ky: 'Кайырлуу күн. Мен эртеңкиге Гамбургга жол билетин алгым келет.' },
      { speaker: 'Herr Berger', text: 'Morgen fährt ein Zug um 8 Uhr und einer um 10 Uhr.', ru: 'Завтра есть поезд в 8 часов и один в 10 часов.', ky: 'Эртең саат 8де жана саат 10да поезд бар.' },
      { speaker: 'Frau Sahin', text: 'Ich nehme den Zug um 10 Uhr. Was kostet das Ticket?', ru: 'Я возьму поезд в 10 часов. Сколько стоит билет?', ky: 'Мен саат 10догу поездди алам. Билет канча турат?' },
      { speaker: 'Herr Berger', text: 'Hin und zurück kostet es 59 Euro.', ru: 'Туда и обратно он стоит 59 евро.', ky: 'Барып-келүүгө 59 евро турат.' },
      { speaker: 'Frau Sahin', text: 'Gut. Von welchem Bahnsteig fährt der Zug ab?', ru: 'Хорошо. С какой платформы отправляется поезд?', ky: 'Жакшы. Поезд кайсы перрондон жөнөйт?' },
      { speaker: 'Herr Berger', text: 'Von Bahnsteig fünf. Sie sehen es auch im Fahrplan.', ru: 'С платформы пять. Вы увидите это и в расписании.', ky: 'Бешинчи перрондон. Муну каттам графигинен да көрөсүз.' },
      { speaker: 'Frau Sahin', text: 'Ich habe viel Gepäck. Wie komme ich zu Bahnsteig fünf? Gibt es einen Aufzug?', ru: 'У меня много багажа. Как мне пройти к платформе пять? Есть ли лифт?', ky: 'Менин жүгүм көп. Бешинчи перронго кантип барам? Лифт барбы?' },
      { speaker: 'Herr Berger', text: 'Gehen Sie geradeaus, dann links. Dort ist der Aufzug. Möchten Sie noch eine Reiseversicherung?', ru: 'Идите прямо, потом налево. Там лифт. Хотите ещё туристическую страховку?', ky: 'Түз барыңыз, анан солго бурулуңуз. Лифт ошол жерде. Дагы саякат сактандыруусун алгыңыз келеби?' },
      { speaker: 'Frau Sahin', text: 'Nein, danke. Hier ist das Geld.', ru: 'Нет, спасибо. Вот деньги.', ky: 'Жок, рахмат. Мына акча.' },
    ],
    questions: [
      { q: 'Wohin möchte Frau Sahin fahren?', options: ['Nach Berlin', 'Nach Hamburg', 'Nach München'], answer: 1 },
      { q: 'Welchen Zug nimmt sie?', options: ['Den Zug um 10 Uhr', 'Den Zug um 8 Uhr', 'Den Zug um 12 Uhr'], answer: 0 },
      { q: 'Was kostet das Ticket hin und zurück?', options: ['49 Euro', '69 Euro', '59 Euro'], answer: 2 },
      { q: 'Von welchem Bahnsteig fährt der Zug ab?', options: ['Von Bahnsteig vier', 'Von Bahnsteig fünf', 'Von Bahnsteig sechs'], answer: 1 },
    ],
    keywords: ['Ticket', 'Fahrplan', 'Bahnsteig', 'Gepäck', 'Reiseversicherung'],
    source: UNIT_18_SOURCE,
  },
  {
    id: 'a2-li-18-02',
    unit: 18,
    level: 'A2',
    title: 'Wohin fahren wir im Sommer?',
    lines: [
      { speaker: 'Lara', text: 'Ben, wohin fahren wir im Sommer?', ru: 'Бен, куда мы едем летом?', ky: 'Бен, жайында биз кайда барабыз?' },
      { speaker: 'Ben', text: 'Ich möchte ans Meer. Ich liebe den Strand!', ru: 'Я хочу к морю. Я обожаю пляж!', ky: 'Мен деңизге баргым келет. Мен деңиз жээгин абдан жакшы көрөм!' },
      { speaker: 'Lara', text: 'Ans Meer? Ich fahre lieber in die Berge. Dort ist es kühler.', ru: 'К морю? Я бы лучше поехала в горы. Там прохладнее.', ky: 'Деңизгеби? Мен тоого барганды жакшы көрөм. Ал жерде салкыныраак.' },
      { speaker: 'Ben', text: 'Aber im Sommer wird es auch am Meer nicht zu heiß. Die Wettervorhersage sagt: viel Sonne und wenig Wind.', ru: 'Но летом и у моря не будет слишком жарко. Прогноз погоды говорит: много солнца и мало ветра.', ky: 'Бирок жайында деңиз жээгинде да өтө ысык болбойт. Аба ырайынын божомолу айтат: күн көп жана шамал аз.' },
      { speaker: 'Lara', text: 'Und Regen?', ru: 'А дождь?', ky: 'Ал эми жамгыр?' },
      { speaker: 'Ben', text: 'Fast kein Regen. Wir können im Meer schwimmen und am Abend einen Ausflug machen.', ru: 'Почти без дождя. Мы можем плавать в море, а вечером поехать на экскурсию.', ky: 'Дээрлик жамгыр жок. Биз деңизде сүзүп, кечинде сейилдөөгө чыга алабыз.' },
      { speaker: 'Lara', text: 'Okay, ans Meer. Wo schlafen wir? In einer Jugendherberge?', ru: 'Ладно, к морю. Где мы будем спать? В молодёжном хостеле?', ky: 'Макул, деңизге. Биз кайда жатабыз? Жаштар мейманканасындабы?' },
      { speaker: 'Ben', text: 'Ich habe eine Ferienwohnung gesehen. Eine Übernachtung kostet nur 40 Euro.', ru: 'Я видел квартиру для отдыха. Одна ночь стоит всего 40 евро.', ky: 'Мен эс алуу үчүн батир көрдүм. Бир түнөө болгону 40 евро турат.' },
      { speaker: 'Lara', text: 'Super! Dann buche ich die Wohnung heute noch.', ru: 'Здорово! Тогда я забронирую квартиру ещё сегодня.', ky: 'Сонун! Анда мен батирди бүгүн эле брондойм.' },
      { speaker: 'Ben', text: 'Prima. Nächstes Jahr fahren wir dann in die Berge.', ru: 'Отлично. А в следующем году тогда поедем в горы.', ky: 'Жакшы. Келерки жылы анда тоого барабыз.' },
    ],
    questions: [
      { q: 'Warum möchte Ben ans Meer?', options: ['Er liebt den Strand.', 'Er mag keine Berge.', 'Er hat dort Familie.'], answer: 0 },
      { q: 'Was sagt die Wettervorhersage?', options: ['Viel Regen', 'Viel Wind', 'Viel Sonne und wenig Wind'], answer: 2 },
      { q: 'Wo schlafen sie?', options: ['In einer Jugendherberge', 'In einer Ferienwohnung', 'Im Zelt'], answer: 1 },
      { q: 'Wann fahren sie in die Berge?', options: ['Nächstes Jahr', 'Im Winter', 'Im Herbst'], answer: 0 },
    ],
    keywords: ['Meer', 'Strand', 'Wettervorhersage', 'Ferienwohnung', 'Übernachtung'],
    source: UNIT_18_SOURCE,
  },
]

export const UNIT_18_READING: ReadingText[] = [
  {
    id: 'a2-re-18-01',
    unit: 18,
    level: 'A2',
    title: 'Prospekt: Ferien an der Ostsee',
    body: [
      'Prospekt: Ferien an der Ostsee',
      'Reisezeit: 3. bis 10. August. Preis: 480 Euro pro Person, Übernachtung mit Frühstück.',
      'Unterkunft: Ferienwohnung am Strand, 100 Meter bis zum Meer.',
      'Programm: Montag Ausflug mit der Fähre zur Insel. Mittwoch Wanderung im Wald. Freitag besichtigen wir die Stadt und alle Sehenswürdigkeiten.',
      'Nicht im Preis: Reiseversicherung. Buchung im Reisebüro oder online.',
    ],
    gloss: [
      { word: 'pro Person', ru: 'на человека', ky: 'бир адамга', example: 'Das Zimmer kostet 30 Euro pro Person.', grammar: 'pro + существительное без артикля: «за каждую единицу» (pro Person, pro Tag, pro Woche)', grammarKy: 'pro + артиклсиз зат атооч: «ар бирине» (pro Person, pro Tag, pro Woche)', related: ['die Übernachtung', 'die Buchung'] },
      { word: '3. bis 10. August', ru: 'с 3 по 10 августа', ky: '3-августтан 10-августка чейин', example: 'Der Urlaub ist vom 3. bis 10. August.', grammar: 'цифра с точкой — порядковое число (юнит 16); здесь достаточно понимать период', grammarKy: 'чекити бар цифра — иреттик сан (16-бөлүм); бул жерде убакыт аралыгын түшүнүү жетиштүү', related: ['der Sommer', 'der Ausflug'] },
      { word: 'Frühstück', ru: 'завтрак', ky: 'эртең мененки тамак', example: 'Das Frühstück ist im Preis.', grammar: 'существительное от глагола frühstücken (A1): das Frühstück', grammarKy: 'frühstücken этишинен (A1) жасалган зат атооч: das Frühstück', related: ['die Übernachtung', 'die Unterkunft'] },
      { word: 'Wanderung', ru: 'пешая прогулка, поход', ky: 'жөө жүрүш', example: 'Die Wanderung dauert drei Stunden.', grammar: 'существительное от wandern (юнит 16): die Wanderung', grammarKy: 'wandern этишинен (16-бөлүм) жасалган зат атооч: die Wanderung', related: ['der Wald', 'der Berg'] },
      { word: 'Insel', ru: 'остров', ky: 'арал', example: 'Die Fähre fährt zur Insel.', grammar: 'die Insel: «auf die Insel» (куда?), «auf der Insel» (где?)', grammarKy: 'die Insel: «auf die Insel» (кайда?), «auf der Insel» (кайда?)', related: ['die Fähre', 'das Meer'] },
    ],
    questions: [
      { q: 'Wie viel kostet die Reise pro Person?', options: ['380 Euro', '480 Euro', '580 Euro'], answer: 1 },
      { q: 'Was ist nicht im Preis?', options: ['Die Übernachtung', 'Das Frühstück', 'Die Reiseversicherung'], answer: 2 },
      { q: 'Was machen die Reisenden am Montag?', options: ['Einen Ausflug mit der Fähre', 'Eine Wanderung', 'Eine Stadtbesichtigung'], answer: 0 },
    ],
    source: UNIT_18_SOURCE,
  },
  {
    id: 'a2-re-18-02',
    unit: 18,
    level: 'A2',
    title: 'Eine Postkarte aus der Türkei',
    body: [
      'Liebe Anna, viele Grüße aus der Türkei! Wir sind am Montag mit dem Auto gefahren. Auf der Autobahn hatten wir einen Stau, und an der Grenze mussten wir lange warten. Der Zoll war dann schnell.',
      'Wir haben getankt, aber die Tankstelle war zu. Zum Glück hat uns ein Mann geholfen. Jetzt liegen wir am Strand, und die Sonne scheint. Nächstes Jahr fahren wir in die Schweiz. Dein Ben',
    ],
    gloss: [
      { word: 'viele Grüße', ru: 'большой привет', ky: 'жылуу саламдар', example: 'Viele Grüße aus Berlin!', grammar: 'начало открытки: «viele Grüße aus + место»; aus + Dativ (aus der Türkei)', grammarKy: 'ачык каттын башы: «viele Grüße aus + жер»; aus + Dativ (aus der Türkei)', related: ['die Grenze', 'das Ausland'] },
      { word: 'war zu', ru: 'была закрыта', ky: 'жабык болчу', example: 'Der Laden war zu.', grammar: 'zu sein = «быть закрытым» (разговорное); не путайте с наречием zu = «слишком»: zu heiß', grammarKy: 'zu sein = «жабык болуу» (оозеки); zu тактоочусу «өтө» дегенди да билдирет: zu heiß, аны чаташтырбаңыз', related: ['die Tankstelle', 'tanken'] },
      { word: 'Zum Glück', ru: 'к счастью', ky: 'бактыга жараша', example: 'Zum Glück ist nichts passiert.', grammar: 'устойчивое выражение; учить целиком', grammarKy: 'туруктуу сөз айкашы; бүтүндөй жаттоо керек', related: ['der Stau', 'die Autobahn'] },
      { word: 'geholfen', ru: 'помог (hat uns … geholfen)', ky: 'жардам берди (hat uns … geholfen)', example: 'Ein Mann hat mir geholfen.', grammar: 'helfen + Dativ (uns, mir); Perfekt: hat … geholfen, Partizip II в конце', grammarKy: 'helfen + Dativ (uns, mir); Perfekt: hat … geholfen, Partizip II аягында', related: ['das Gepäck', 'der Führerschein'] },
      { word: 'Dein Ben', ru: 'твой Бен (подпись)', ky: 'сенин Бенин (кол тамга)', example: 'Dein Max', grammar: 'неформальная подпись в конце открытки или письма другу: Dein / Deine + имя', grammarKy: 'досуна жазылган ачык катта же катта расмий эмес кол тамга: Dein / Deine + аты', related: ['viele Grüße', 'der Sommer'] },
    ],
    questions: [
      { q: 'Wie sind die Freunde gefahren?', options: ['Mit dem Auto', 'Mit dem Zug', 'Mit dem Bus'], answer: 0 },
      { q: 'Was war ein Problem auf der Fahrt?', options: ['Das Wetter', 'Ein Stau', 'Das Hotel'], answer: 1 },
      { q: 'Wohin fahren sie das nächste Mal?', options: ['In die Türkei', 'Ans Meer', 'In die Schweiz'], answer: 2 },
    ],
    source: UNIT_18_SOURCE,
  },
]

export const UNIT_18_SPEAKING: SpeakingScenario[] = [
  {
    id: 'a2-sp-18-01',
    title: 'Wie war dein Urlaub?',
    titleRu: 'Как прошёл твой отпуск?',
    titleKy: 'Эс алууң кандай өттү?',
    icon: '🏖️',
    level: 'A2',
    goal: {
      ru: 'Вы встретили знакомую или знакомого и разговариваете на «du». Расскажите, где вы были в отпуске и что делали (Perfekt), какая была погода и куда вы поедете в следующий раз (настоящее время со словом о времени).',
      ky: 'Сиз тааныш адамды жолуктуруп, «du» формасында сүйлөшүп жатасыз. Эс алууда кайда болгонуңузду жана эмне кылганыңызды (Perfekt), аба ырайы кандай болгонун жана кийинки жолу кайда барарыңызды (убакыт сөзү менен азыркы чак) айтып бериңиз.',
    },
    turns: [
      {
        ai: 'Hi! Wie war dein Urlaub? Wo warst du?',
        aiRu: 'Привет! Как прошёл твой отпуск? Где ты был?',
        aiKy: 'Салам! Эс алууң кандай өттү? Кайда болдуң?',
        hints: ['Ich war in der Türkei.', 'Wir waren am Meer.'],
        keywords: ['türkei', 'meer'],
      },
      {
        ai: 'Und was habt ihr gemacht?',
        aiRu: 'И что вы делали?',
        aiKy: 'Анан эмне кылдыңар?',
        hints: ['Wir haben viel geschwommen.', 'Wir haben einen Ausflug gemacht.'],
        keywords: ['haben', 'ausflug'],
      },
      {
        ai: 'Wie war das Wetter?',
        aiRu: 'Какая была погода?',
        aiKy: 'Аба ырайы кандай болду?',
        hints: ['Die Sonne hat geschienen.', 'Das Wetter war schön, aber manchmal hat es geregnet.'],
        keywords: ['wetter', 'sonne'],
      },
      {
        ai: 'Und wohin fährst du das nächste Mal?',
        aiRu: 'А куда ты поедешь в следующий раз?',
        aiKy: 'Ал эми кийинки жолу кайда барасың?',
        hints: ['Nächstes Jahr fahre ich in die Schweiz.', 'Im Sommer fahre ich zu meiner Tante.'],
        keywords: ['nächstes', 'sommer'],
      },
    ],
    source: UNIT_18_SOURCE,
  },
]

export const UNIT_18_WRITING: WritingTask[] = [
  {
    id: 'a2-wr-18-01',
    unit: 18,
    level: 'A2',
    title: 'Eine Postkarte aus dem Urlaub',
    situation: {
      ru: 'Вы в отпуске и пишете открытку другу или подруге (на «du»). Напишите, где вы сейчас, какая погода, что вы уже делали (две вещи в Perfekt) и что вы планируете (настоящее время со словом о времени), и закончите приветом.',
      ky: 'Сиз эс алууда досуңузга ачык кат жазып жатасыз («du» формасында). Азыр кайдасыз, аба ырайы кандай, эмне кылганыңызды (Perfektте эки нерсе) жана эмне пландап жатканыңызды (убакыт сөзү менен азыркы чак) жазыңыз жана саламдашуу менен аягына чыгыңыз.',
    },
    formal: false,
    minWords: 50,
    mustInclude: [
      { label: 'Anrede (Liebe / Lieber / Hallo)', patterns: ['liebe', 'lieber', 'hallo', 'hi '] },
      { label: 'Wo sind Sie? (… aus der Türkei / am Meer / in …)', patterns: ['aus ', 'am meer', 'am strand', 'am see', 'in der ', 'in den ', 'in die '] },
      { label: 'Wetter (Wetter / Sonne / Regen / Wind / Schnee)', patterns: ['wetter', 'sonne', 'regen', 'wind', 'schnee'] },
      { label: 'Zwei Aktivitäten im Perfekt (… gemacht, … besichtigt, … geschwommen …)', patterns: ['gemacht', 'besichtigt', 'geschwommen', 'gesehen', 'gegessen', 'gewandert', 'gefahren', 'getankt'] },
      { label: 'Plan mit Zeitwort (Nächstes Jahr / Im Sommer / Morgen / Nächste Woche …)', patterns: ['nächstes jahr', 'nächste woche', 'im sommer', 'im winter', 'morgen', 'in zwei wochen'] },
      { label: 'Gruß am Ende (Liebe Grüße / Viele Grüße / Tschüss)', patterns: ['grüße', 'tschüss'] },
    ],
    model:
      'Liebe Anna, viele Grüße aus der Türkei! Wir sind seit Montag am Meer. Das Wetter ist super: Die Sonne scheint jeden Tag. Gestern haben wir einen Ausflug gemacht und die Stadt besichtigt. Heute sind wir im Meer geschwommen. Das Essen ist auch toll. Nächstes Jahr fahren wir in die Schweiz, dort ist es kühler. Liebe Grüße, Ben',
    tips: [
      {
        ru: 'Это неформальная открытка: пишите «du», короткими предложениями. Начните с «Liebe …» и закончите «Liebe Grüße».',
        ky: 'Бул расмий эмес ачык кат: «du» формасында, кыска сүйлөмдөр менен жазыңыз. «Liebe …» деп баштап, «Liebe Grüße» деп аяктаңыз.',
      },
      {
        ru: 'Где вы: «Viele Grüße aus der Türkei», «Wir sind am Meer». Предлоги — как в юните: aus + Dativ, am Meer (где?).',
        ky: 'Кайдасыз: «Viele Grüße aus der Türkei», «Wir sind am Meer». Предлогдор бөлүмдөгүдөй: aus + Dativ, am Meer (кайда?).',
      },
      {
        ru: 'Что вы уже сделали — в Perfekt: «Wir haben einen Ausflug gemacht», «Wir sind geschwommen» (с sein: sind geschwommen, sind gefahren).',
        ky: 'Эмне кылганыңыз — Perfektте: «Wir haben einen Ausflug gemacht», «Wir sind geschwommen» (sein менен: sind geschwommen, sind gefahren).',
      },
      {
        ru: 'План на будущее — настоящее время со словом о времени: «Nächstes Jahr fahren wir in die Schweiz». Слово о времени стоит первым — глагол вторым.',
        ky: 'Келечектеги план — убакыт сөзү менен азыркы чак: «Nächstes Jahr fahren wir in die Schweiz». Убакыт сөзү биринчи — этиш экинчи.',
      },
    ],
    source: UNIT_18_SOURCE,
  },
]
