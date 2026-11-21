import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_22_SOURCE } from './unit'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 22 grammar — the three APPROVED concepts of the unit (docs/b1/B1_ID_CONVENTIONS.md), nothing else:
 *  1. `b1-konzessive-saetze` (M, productive): obwohl, trotzdem, zwar … aber. weil / deshalb are only revised (↻ A2).
 *  2. `b1-doppelkonnektoren` (M, productive): je … desto, weder … noch, entweder … oder, sowohl … als auch. einerseits … andererseits and nicht nur … sondern auch
 *     are RECEPTIVE only (they are glossed in a text and never required in a task or a test).
 *  3. `b1-adjektive-dativ-genitiv` (L, productive): adjective endings after the article in the Dativ (singular and plural) and the plural. The Genitiv endings
 *     are named in ONE receptive line only (Genitiv noun phrases belong to Units 27/29): no example sentence, exercise or test item contains a Genitiv.
 * Not taught here: Relativsatz, Infinitiv mit zu, damit, adjectives without article, Passiv, Konjunktiv II, verbs with a prepositional object.
 * Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native speaker. It describes
 * the grammar idea and does not use invented grammatical labels (see docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md).
 */
export const UNIT_22_GRAMMAR: GrammarConcept[] = [
  {
    id: 'b1-konzessive-saetze',
    category: 'conjunctions',
    level: 'B1',
    unit: 22,
    visual: 'verbpos',
    title: l('obwohl, trotzdem, zwar … aber — уступка', 'obwohl, trotzdem, zwar … aber — макул болуп туруп каршы айтуу'),
    summary: l(
      'С weil вы называете причину, с deshalb — следствие. Но иногда факт не мешает вам поступить иначе: «хотя идёт дождь, я иду гулять». Для этого в немецком есть obwohl, trotzdem и zwar … aber. После obwohl глагол стоит в конце: «Ich gehe spazieren, obwohl es regnet». Trotzdem — наречие, после него глагол на втором месте: «Es regnet. Trotzdem gehe ich spazieren». Zwar … aber признаёт довод и всё же возражает: «Zwar ist die Wohnung klein, aber sie ist hell».',
      'weil менен себепти, deshalb менен натыйжаны айтасыз. Бирок кээде бир факт сиздин башкача иш кылууңузга тоскоол болбойт: «жамгыр жаап жатса да, мен сейилдегени чыгам». Ал үчүн немис тилинде obwohl, trotzdem жана zwar … aber бар. obwohl сөзүнөн кийин этиш аягында турат: «Ich gehe spazieren, obwohl es regnet». trotzdem — бул сүйлөмдүн башында турган сөз, андан кийин этиш экинчи орунда келет: «Es regnet. Trotzdem gehe ich spazieren». zwar … aber бир жагын моюнга алып, бирок каршы айтат: «Zwar ist die Wohnung klein, aber sie ist hell».',
    ),
    discover: l(
      'Сравните: «Ich bleibe zu Hause, weil es regnet» и «Ich gehe spazieren, obwohl es regnet». Чем отличается смысл? Что стоит в конце — и в первом, и во втором предложении?',
      '«Ich bleibe zu Hause, weil es regnet» жана «Ich gehe spazieren, obwohl es regnet» сүйлөмдөрүн салыштырыңыз. Мааниси кандай айырмаланат? Эки сүйлөмдө тең аягында эмне турат?',
    ),
    why: l(
      'В A2 вы говорили «я думаю…» и «потому что…». На B1 нужно взвешивать: признать довод собеседника и всё же остаться при своём мнении. Именно так звучит вежливое, убедительное обсуждение. Obwohl, trotzdem и zwar … aber делают вашу речь взрослее и точнее.',
      'A2 деңгээлинде сиз «менимче…» жана «себеби…» деп айттыңыз. B1 деңгээлинде ойлорду таразалоо керек: маектешиңиздин далилин тануу эмес, моюнга алып туруп, өз пикириңизде калуу. Сылык жана ишенимдүү талкуу так ушундай угулат. obwohl, trotzdem жана zwar … aber сүйлөөңүздү так жана жетилген кылат.',
    ),
    when: [
      l(
        'obwohl: уступка внутри одного предложения. Глагол в конце: «Obwohl die Miete hoch ist, bleibe ich hier». Если часть с obwohl стоит первой, сразу после запятой идёт глагол главного предложения (bleibe ich).',
        'obwohl: бир сүйлөмдүн ичинде макул болуп туруп каршы айтуу. Этиш аягында: «Obwohl die Miete hoch ist, bleibe ich hier». obwohl менен башталган бөлүк биринчи келсе, үтүрдөн кийин дароо башкы бөлүктүн этиши турат (bleibe ich).',
      ),
      l(
        'trotzdem: связывает два предложения и занимает первое место, поэтому глагол — второй: «Die Miete ist hoch. Trotzdem bleibe ich hier».',
        'trotzdem: эки сүйлөмдү байланыштырат жана биринчи орунда турат, ошондуктан этиш экинчи орунда: «Die Miete ist hoch. Trotzdem bleibe ich hier».',
      ),
      l(
        'zwar … aber: сначала признаёте плюс или минус, затем возражаете: «Zwar ist das Dorf ruhig, aber es gibt kein Kino». После aber порядок слов обычный.',
        'zwar … aber: адегенде бир жагын моюнга аласыз, анан каршы айтасыз: «Zwar ist das Dorf ruhig, aber es gibt kein Kino». aber сөзүнөн кийин сөздөрдүн ирети кадимкидей.',
      ),
      l(
        'Не путайте смысл: weil — причина («потому что»), deshalb — следствие («поэтому»), obwohl и trotzdem — уступка («хотя», «всё же»). Из A2 вы знаете weil и deshalb: «Es regnet, deshalb bleibe ich hier».',
        'Маанисин чаташтырбаңыз: weil — себеп («себеби»), deshalb — натыйжа («ошондуктан»), obwohl жана trotzdem — каршы келүү («…са да», «ошого карабастан»). weil жана deshalb A2 деңгээлинен белгилүү: «Es regnet, deshalb bleibe ich hier».',
      ),
    ],
    examples: [
      {
        de: 'Ich bleibe hier, obwohl die Miete hoch ist.',
        ru: 'Я остаюсь здесь, хотя аренда высокая.',
        ky: 'Ижара баасы жогору болсо да, мен бул жерде калам.',
        focus: 'obwohl … ist (глагол в конце)',
      },
      {
        de: 'Obwohl es spät ist, arbeitet er noch.',
        ru: 'Хотя уже поздно, он ещё работает.',
        ky: 'Кеч болсо да, ал дагы иштеп жатат.',
        focus: 'Obwohl … ist, arbeitet er',
      },
      {
        de: 'Die Miete ist hoch. Trotzdem bleibe ich hier.',
        ru: 'Аренда высокая. Всё же я остаюсь здесь.',
        ky: 'Ижара баасы жогору. Ошого карабастан мен бул жерде калам.',
        focus: 'Trotzdem bleibe ich (глагол — второй)',
      },
      {
        de: 'Zwar ist das Dorf ruhig, aber es gibt kein Kino.',
        ru: 'Деревня, правда, тихая, но кинотеатра там нет.',
        ky: 'Айыл тынч экени чын, бирок кинотеатр жок.',
        focus: 'zwar … aber',
      },
      {
        de: 'Es regnet. Deshalb nehme ich einen Schirm.',
        ru: 'Идёт дождь. Поэтому я беру зонт.',
        ky: 'Жамгыр жаап жатат. Ошондуктан мен кол чатыр алам.',
        focus: '↻ A2: deshalb — следствие, не уступка',
      },
    ],
    mistakes: [
      {
        wrong: 'Ich bleibe hier, obwohl die Miete ist hoch.',
        right: 'Ich bleibe hier, obwohl die Miete hoch ist.',
        note: l(
          'После obwohl спрягаемый глагол уходит в самый конец: …, obwohl die Miete hoch ist.',
          'obwohl сөзүнөн кийин этиш эң аягына өтөт: …, obwohl die Miete hoch ist.',
        ),
      },
      {
        wrong: 'Obwohl es regnet, ich gehe spazieren.',
        right: 'Obwohl es regnet, gehe ich spazieren.',
        note: l(
          'Часть с obwohl стоит первой — поэтому сразу после запятой идёт глагол главного предложения: gehe ich.',
          'obwohl менен башталган бөлүк биринчи турат — ошондуктан үтүрдөн кийин дароо башкы бөлүктүн этиши келет: gehe ich.',
        ),
      },
      {
        wrong: 'Es regnet. Trotzdem ich gehe spazieren.',
        right: 'Es regnet. Trotzdem gehe ich spazieren.',
        note: l(
          'Trotzdem занимает первое место, поэтому глагол — на втором, а подлежащее идёт за ним.',
          'Trotzdem биринчи орунда турат, ошондуктан этиш экинчи орунда, ээ андан кийин келет.',
        ),
      },
      {
        wrong: 'Ich bin müde, obwohl ich habe gut geschlafen.',
        right: 'Ich bin müde, obwohl ich gut geschlafen habe.',
        note: l(
          'В Perfekt после obwohl вспомогательный глагол стоит в самом конце: …, obwohl ich gut geschlafen habe.',
          'Perfekt болсо, obwohl сөзүнөн кийин жардамчы этиш эң аягында турат: …, obwohl ich gut geschlafen habe.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Obwohl ich wenig Zeit habe, gehe ich zum Deutschkurs.',
        ru: 'Хотя у меня мало времени, я хожу на курсы немецкого.',
        ky: 'Убактым аз болсо да, мен немис тили курстарына барам.',
        focus: 'obwohl',
      },
      {
        de: 'Das Essen ist teuer. Trotzdem gehen wir oft ins Restaurant.',
        ru: 'Еда дорогая. И всё же мы часто ходим в ресторан.',
        ky: 'Тамак кымбат. Ошого карабастан биз көп учурда ресторанга барабыз.',
        focus: 'trotzdem',
      },
      {
        de: 'Zwar ist die Arbeit schwer, aber sie macht mir Spaß.',
        ru: 'Работа, правда, тяжёлая, но она мне нравится.',
        ky: 'Жумуш оор экени чын, бирок ал мага жагат.',
        focus: 'zwar … aber',
      },
    ],
    dialogue: [
      {
        speaker: 'Mia',
        text: 'Warum bleibst du in Hamburg? Die Mieten sind so hoch.',
        ru: 'Почему ты остаёшься в Гамбурге? Аренда такая высокая.',
        ky: 'Эмне үчүн Гамбургда каласың? Ижара баалары абдан жогору.',
      },
      {
        speaker: 'Jan',
        text: 'Obwohl alles teuer ist, liebe ich diese Stadt.',
        ru: 'Хотя всё дорого, я люблю этот город.',
        ky: 'Баары кымбат болсо да, мен бул шаарды жакшы көрөм.',
      },
      {
        speaker: 'Mia',
        text: 'Zwar ist es hier schön, aber ich finde es zu laut.',
        ru: 'Здесь, правда, красиво, но мне кажется, слишком шумно.',
        ky: 'Бул жерде сулуу экени чын, бирок мага өтө ызы-чуу сезилет.',
      },
      {
        speaker: 'Jan',
        text: 'Es ist laut. Trotzdem gehe ich nicht weg.',
        ru: 'Шумно. Всё равно я не уеду.',
        ky: 'Ызы-чуу. Ошого карабастан мен кетпейм.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Назовите одну вещь, которую вы любите, хотя у неё есть минус (город, работа, еда). Используйте obwohl и trotzdem.',
        'Минусу бар, бирок сиз жакшы көргөн бир нерсени атаңыз (шаар, жумуш, тамак). obwohl жана trotzdem колдонуңуз.',
      ),
      sample: 'Obwohl die Stadt laut ist, wohne ich gern hier. Die Wohnung ist klein. Trotzdem bleibe ich.',
      keywords: ['obwohl', 'trotzdem', 'ist', 'bleibe'],
    },
    source: UNIT_22_SOURCE,
  },
  {
    id: 'b1-doppelkonnektoren',
    category: 'conjunctions',
    level: 'B1',
    unit: 22,
    visual: 'verbpos',
    title: l(
      'Двойные союзы: je … desto, weder … noch, entweder … oder, sowohl … als auch',
      'Эки бөлүктүү байламталар: je … desto, weder … noch, entweder … oder, sowohl … als auch',
    ),
    summary: l(
      'Двойные союзы состоят из двух частей и соединяют две идеи. Je … desto выражает «чем … тем»: «Je länger ich hier wohne, desto besser verstehe ich die Leute». Weder … noch — «ни … ни»: «Das Zimmer ist weder groß noch hell». Entweder … oder — «или … или»: «Wir fahren entweder mit dem Zug oder mit dem Bus». Sowohl … als auch — «как … так и»: «Sowohl Anna als auch Tom spielen Fußball». В текстах вы также встретите einerseits … andererseits («с одной стороны … с другой») и nicht nur … sondern auch («не только … но и») — их нужно только понимать.',
      'Эки бөлүктүү байламталар эки ойду бириктирет. je … desto «канчалык … ошончолук» дегенди билдирет: «Je länger ich hier wohne, desto besser verstehe ich die Leute». weder … noch — «… да, … да эмес»: «Das Zimmer ist weder groß noch hell». entweder … oder — «же … же»: «Wir fahren entweder mit dem Zug oder mit dem Bus». sowohl … als auch — «… да, … да»: «Sowohl Anna als auch Tom spielen Fußball». Тексттерде einerseits … andererseits («бир жагынан … экинчи жагынан») жана nicht nur … sondern auch («… гана эмес, … да») да кездешет — аларды түшүнүү гана жетиштүү.',
    ),
    discover: l(
      'Сравните: «Ich lerne viel. Ich verstehe mehr» и «Je mehr ich lerne, desto mehr verstehe ich». Что делает второе предложение сильнее? Какой порядок слов в каждой его части?',
      '«Ich lerne viel. Ich verstehe mehr» жана «Je mehr ich lerne, desto mehr verstehe ich» сүйлөмдөрүн салыштырыңыз. Экинчи сүйлөмдү эмне күчтүү кылат? Анын ар бир бөлүгүндө сөздөрдүн ирети кандай?',
    ),
    why: l(
      'С этими союзами вы связываете идеи в одно точное высказывание: меняется одно — меняется и другое (je … desto), нет ни того, ни другого (weder … noch), выбор из двух (entweder … oder) или оба сразу (sowohl … als auch). В дискуссиях и в письме с их помощью можно коротко и ясно сравнивать.',
      'Бул байламталар менен ойлорду бир так сүйлөмгө бириктиресиз: бири өзгөрсө, экинчиси да өзгөрөт (je … desto), экөө тең жок (weder … noch), экөөнүн бирин тандоо (entweder … oder) же экөө тең бирдей (sowohl … als auch). Талкууда жана жазууда алар менен кыска жана даана салыштырууга болот.',
    ),
    when: [
      l(
        'je … desto: в обеих частях сравнительная степень (A2): länger, besser, mehr. В части с je глагол в конце, в части с desto — на втором месте: «Je älter ich werde, desto ruhiger werde ich».',
        'je … desto: эки бөлүктө тең салыштырма даража (A2): länger, besser, mehr. je бөлүгүндө этиш аягында, desto бөлүгүндө экинчи орунда: «Je älter ich werde, desto ruhiger werde ich».',
      ),
      l(
        'weder … noch: с существительными и прилагательными — без nicht: «Ich habe weder Zeit noch Lust». Не говорите «nicht … noch».',
        'weder … noch: зат атоочтор жана сын атоочтор менен — nicht болбойт: «Ich habe weder Zeit noch Lust». «nicht … noch» деп айтпаңыз.',
      ),
      l(
        'entweder … oder: порядок слов не меняется. «Entweder wir bleiben, oder wir gehen» — после oder идёт обычное предложение. С существительными: «entweder Tee oder Kaffee».',
        'entweder … oder: сөздөрдүн ирети өзгөрбөйт. «Entweder wir bleiben, oder wir gehen» — oder сөзүнөн кийин кадимки сүйлөм келет. Зат атооч менен: «entweder Tee oder Kaffee».',
      ),
      l(
        'sowohl … als auch: два равных элемента, глагол — во множественном числе: «Sowohl Anna als auch Tom spielen Fußball». Только для понимания: einerseits … andererseits, nicht nur … sondern auch.',
        'sowohl … als auch: бирдей эки элемент, этиш — көптүк санда: «Sowohl Anna als auch Tom spielen Fußball». Түшүнүү үчүн гана: einerseits … andererseits, nicht nur … sondern auch.',
      ),
    ],
    examples: [
      {
        de: 'Je länger ich hier wohne, desto besser verstehe ich die Leute.',
        ru: 'Чем дольше я здесь живу, тем лучше понимаю людей.',
        ky: 'Бул жерде канчалык көп жашасам, адамдарды ошончолук жакшы түшүнөм.',
        focus: 'je … länger, desto besser',
      },
      {
        de: 'Das Zimmer ist weder groß noch hell.',
        ru: 'Комната ни большая, ни светлая.',
        ky: 'Бөлмө чоң да эмес, жарык да эмес.',
        focus: 'weder … noch',
      },
      {
        de: 'Wir fahren entweder mit dem Zug oder mit dem Bus.',
        ru: 'Мы поедем либо на поезде, либо на автобусе.',
        ky: 'Биз же поезд менен, же автобус менен барабыз.',
        focus: 'entweder … oder',
      },
      {
        de: 'Sowohl Anna als auch Tom spielen Fußball.',
        ru: 'И Анна, и Том играют в футбол.',
        ky: 'Анна да, Том да футбол ойнойт.',
        focus: 'sowohl … als auch (спряжение: spielen)',
      },
      {
        de: 'Einerseits ist die Stadt laut, andererseits ist sie lebendig.',
        ru: 'С одной стороны, город шумный, с другой — живой.',
        ky: 'Бир жагынан шаар ызы-чуу, экинчи жагынан жандуу.',
        focus: 'только для понимания: einerseits … andererseits',
      },
    ],
    mistakes: [
      {
        wrong: 'Je länger ich wohne hier, desto besser verstehe ich.',
        right: 'Je länger ich hier wohne, desto besser verstehe ich.',
        note: l(
          'В части с je спрягаемый глагол стоит в самом конце: …, je länger ich hier wohne.',
          'je бөлүгүндө этиш эң аягында турат: …, je länger ich hier wohne.',
        ),
      },
      {
        wrong: 'Je mehr ich übe, desto ich spreche besser.',
        right: 'Je mehr ich übe, desto besser spreche ich.',
        note: l(
          'После desto идёт сравнительная степень, а потом глагол: desto besser spreche ich.',
          'desto сөзүнөн кийин салыштырма даража, андан кийин этиш келет: desto besser spreche ich.',
        ),
      },
      {
        wrong: 'Ich habe nicht Zeit noch Lust.',
        right: 'Ich habe weder Zeit noch Lust.',
        note: l('Вторая часть noch требует первой части weder, а не nicht.', 'noch сөзү алдында weder талап кылат, nicht эмес.'),
      },
      {
        wrong: 'Sowohl Anna als auch Tom spielt Fußball.',
        right: 'Sowohl Anna als auch Tom spielen Fußball.',
        note: l(
          'Речь о двух людях, поэтому глагол стоит во множественном числе: spielen.',
          'Сөз эки киши жөнүндө, ошондуктан этиш көптүк санда турат: spielen.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Je früher ich aufstehe, desto mehr Zeit habe ich.',
        ru: 'Чем раньше я встаю, тем больше у меня времени.',
        ky: 'Канчалык эрте турсам, ошончолук убактым көп болот.',
        focus: 'je … desto',
      },
      {
        de: 'Ich esse weder Fleisch noch Fisch.',
        ru: 'Я не ем ни мяса, ни рыбы.',
        ky: 'Мен эт да, балык да жебейм.',
        focus: 'weder … noch',
      },
      {
        de: 'Das Fest ist entweder am Samstag oder am Sonntag.',
        ru: 'Праздник будет либо в субботу, либо в воскресенье.',
        ky: 'Майрам же ишембиде, же жекшембиде болот.',
        focus: 'entweder … oder',
      },
    ],
    dialogue: [
      {
        speaker: 'Eva',
        text: 'Wie gefällt dir dein neuer Kurs?',
        ru: 'Как тебе твои новые курсы?',
        ky: 'Жаңы курстарың сага кандай жагат?',
      },
      {
        speaker: 'Ben',
        text: 'Je mehr ich übe, desto besser verstehe ich die Grammatik.',
        ru: 'Чем больше я занимаюсь, тем лучше понимаю грамматику.',
        ky: 'Канчалык көп көнүгүү жасасам, грамматиканы ошончолук жакшы түшүнөм.',
      },
      {
        speaker: 'Eva',
        text: 'Gehst du am Samstag oder am Sonntag zur Prüfung?',
        ru: 'Ты идёшь на экзамен в субботу или в воскресенье?',
        ky: 'Экзаменге ишембиде барасыңбы же жекшембиде?',
      },
      {
        speaker: 'Ben',
        text: 'Weder noch! Die Prüfung ist erst am Montag.',
        ru: 'Ни то, ни другое! Экзамен только в понедельник.',
        ky: 'Экөө тең эмес! Экзамен дүйшөмбүдө гана.',
      },
      {
        speaker: 'Eva',
        text: 'Dann lernen wir entweder heute oder morgen zusammen.',
        ru: 'Тогда мы позанимаемся вместе либо сегодня, либо завтра.',
        ky: 'Анда биз же бүгүн, же эртең чогуу даярданабыз.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите о своих привычках и вкусах. Используйте je … desto и weder … noch или entweder … oder.',
        'Адаттарыңыз жана табитиңиз жөнүндө айтып бериңиз. je … desto жана weder … noch же entweder … oder колдонуңуз.',
      ),
      sample:
        'Je mehr ich lerne, desto besser verstehe ich Deutsch. Am Wochenende gehe ich entweder spazieren oder ich lese. Ich habe weder Zeit noch Geld für eine Reise.',
      keywords: ['je', 'desto', 'entweder', 'weder'],
    },
    source: UNIT_22_SOURCE,
  },
  {
    id: 'b1-adjektive-dativ-genitiv',
    category: 'adjectives',
    level: 'B1',
    unit: 22,
    visual: 'cases',
    title: l('Прилагательные в Dativ и во множественном числе', 'Сын атоочтор Dativ жана көптүк санда'),
    summary: l(
      'После артикля (der, die, das, ein, kein, mein) прилагательное получает окончание. В A2 вы выучили Nominativ и Akkusativ в единственном числе. Теперь добавляются два случая: Dativ единственного числа и множественное число. Здесь всё просто: окончание -en. «Ich wohne in einem kleinen Dorf». «Wir helfen den netten Nachbarn». «Die wichtigen Gründe stehen im Text». Окончания в Genitiv тоже -en, но Genitiv вы изучите позже (юниты 27 и 29) — здесь мы его только упоминаем.',
      'Артиклден (der, die, das, ein, kein, mein) кийин сын атооч жалгоо алат. A2 деңгээлинде сиз жекелик сандагы Nominativ жана Akkusativ жөнүндө үйрөндүңүз. Эми дагы эки учур кошулат: жекелик сандагы Dativ жана көптүк сан. Бул жерде баары жөнөкөй: жалгоо -en. «Ich wohne in einem kleinen Dorf». «Wir helfen den netten Nachbarn». «Die wichtigen Gründe stehen im Text». Genitiv учурунда да жалгоо -en, бирок Genitiv кийинчерээк үйрөнүлөт (27 жана 29-бөлүмдөр) — бул жерде аны жөн гана эскертебиз.',
    ),
    discover: l(
      'Сравните: «in einem kleinen Dorf», «in der kleinen Stadt», «mit den kleinen Kindern». Какое окончание повторяется? Что объединяет эти три группы слов?',
      '«in einem kleinen Dorf», «in der kleinen Stadt», «mit den kleinen Kindern» сүйлөм бөлүктөрүн салыштырыңыз. Кайсы жалгоо кайталанат? Бул үч сөз тобун эмне бириктирет?',
    ),
    why: l(
      'В дискуссии вы описываете и оцениваете: «в маленьком городе», «с новыми соседями», «из-за важных причин». Правильные окончания делают речь естественной. А правило простое: после Dativ и во множественном числе почти всегда стоит -en.',
      'Талкууда сиз сыпаттап, баалайсыз: «кичинекей шаарда», «жаңы кошуналар менен», «маанилүү себептерден». Туура жалгоолор сүйлөөнү табигый кылат. Ал эми эреже жөнөкөй: Dativдан жана көптүк сандан кийин дээрлик дайыма -en турат.',
    ),
    when: [
      l(
        'Dativ единственного числа после артикля: -en во всех родах. «in einem kleinen Dorf» (das), «mit dem neuen Auto» (das), «in der kleinen Stadt» (die), «mit einem guten Argument» (das).',
        'Артиклден кийинки жекелик сандагы Dativ: бардык роддордо -en. «in einem kleinen Dorf» (das), «mit dem neuen Auto» (das), «in der kleinen Stadt» (die), «mit einem guten Argument» (das).',
      ),
      l(
        'Множественное число после die, diese, meine, keine: -en. «die wichtigen Gründe», «meine neuen Nachbarn», «keine guten Ideen». В Dativ добавляется ещё -n у существительного: «mit den neuen Nachbarn».',
        'die, diese, meine, keine артынан көптүк санда: -en. «die wichtigen Gründe», «meine neuen Nachbarn», «keine guten Ideen». Dativде зат атоочко дагы -n кошулат: «mit den neuen Nachbarn».',
      ),
      l(
        'Повторение A2: Nominativ и Akkusativ единственного числа: «ein großer Vorteil», «eine gute Idee», «ein neues Argument»; «Ich habe einen großen Garten».',
        'A2 кайталоо: жекелик сандагы Nominativ жана Akkusativ: «ein großer Vorteil», «eine gute Idee», «ein neues Argument»; «Ich habe einen großen Garten».',
      ),
      l(
        'Только для информации: окончания в Genitiv тоже -en (в Genitiv существительное меняется — это тема юнитов 27 и 29). Прилагательные без артикля — юнит 24, здесь их нет.',
        'Маалымат үчүн гана: Genitiv учурунда да жалгоо -en (Genitivде зат атооч да өзгөрөт — бул 27 жана 29-бөлүмдөрдүн темасы). Артиклсиз сын атоочтор — 24-бөлүм, бул жерде алар жок.',
      ),
    ],
    examples: [
      {
        de: 'Wir wohnen in einem kleinen Dorf.',
        ru: 'Мы живём в маленькой деревне.',
        ky: 'Биз кичинекей айылда жашайбыз.',
        focus: 'einem kleinen Dorf (Dativ, das)',
      },
      {
        de: 'Ich arbeite in der großen Firma.',
        ru: 'Я работаю в большой фирме.',
        ky: 'Мен чоң фирмада иштейм.',
        focus: 'der großen Firma (Dativ, die)',
      },
      {
        de: 'Mit dem neuen Argument hat sie uns überzeugt.',
        ru: 'Новым доводом она нас убедила.',
        ky: 'Жаңы далил менен ал бизди ишендирди.',
        focus: 'dem neuen Argument (Dativ, das)',
      },
      {
        de: 'Die wichtigen Gründe stehen im Text.',
        ru: 'Важные причины названы в тексте.',
        ky: 'Маанилүү себептер текстте жазылган.',
        focus: 'die wichtigen Gründe (Plural)',
      },
      {
        de: 'Wir helfen den netten Nachbarn.',
        ru: 'Мы помогаем милым соседям.',
        ky: 'Биз боорукер кошуналарга жардам беребиз.',
        focus: 'den netten Nachbarn (Dativ Plural, -n am Nomen)',
      },
    ],
    mistakes: [
      {
        wrong: 'Wir wohnen in einem kleine Dorf.',
        right: 'Wir wohnen in einem kleinen Dorf.',
        note: l(
          'После einem (Dativ) прилагательное получает -en: einem kleinen Dorf.',
          'einem (Dativ) сөзүнөн кийин сын атоочко -en кошулат: einem kleinen Dorf.',
        ),
      },
      {
        wrong: 'Ich lebe in der kleine Stadt.',
        right: 'Ich lebe in der kleinen Stadt.',
        note: l(
          'In der (Dativ, женский род) — тоже -en: der kleinen Stadt. Без -n — это форма Nominativ, она здесь не подходит.',
          'In der (Dativ, аял род) — дагы -en: der kleinen Stadt. -n жок форма Nominativге таандык, бул жерге ылайык эмес.',
        ),
      },
      {
        wrong: 'Die wichtige Gründe sind klar.',
        right: 'Die wichtigen Gründe sind klar.',
        note: l(
          'Во множественном числе после die — всегда -en: die wichtigen Gründe.',
          'Көптүк санда die сөзүнөн кийин дайыма -en: die wichtigen Gründe.',
        ),
      },
      {
        wrong: 'Wir helfen den netten Nachbar.',
        right: 'Wir helfen den netten Nachbarn.',
        note: l(
          'В Dativ множественного числа существительное тоже получает -n: den netten Nachbarn.',
          'Көптүк сандагы Dativде зат атооч да -n алат: den netten Nachbarn.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Ich wohne in einer kleinen Wohnung.',
        ru: 'Я живу в маленькой квартире.',
        ky: 'Мен кичинекей батирде жашайм.',
        focus: 'einer kleinen Wohnung',
      },
      {
        de: 'Er schreibt mit dem neuen Handy eine Nachricht.',
        ru: 'Он пишет сообщение на новом телефоне.',
        ky: 'Ал жаңы телефондон билдирүү жазат.',
        focus: 'dem neuen Handy',
      },
      {
        de: 'Die jungen Leute diskutieren gern.',
        ru: 'Молодые люди любят спорить.',
        ky: 'Жаштар талкуулагандан ыраазы.',
        focus: 'die jungen Leute (Plural)',
      },
    ],
    dialogue: [
      { speaker: 'Lea', text: 'Wo wohnst du jetzt?', ru: 'Где ты сейчас живёшь?', ky: 'Азыр кайда жашайсың?' },
      {
        speaker: 'Max',
        text: 'In einem kleinen Dorf, mit meinen alten Freunden.',
        ru: 'В маленькой деревне, вместе со старыми друзьями.',
        ky: 'Кичинекей айылда, эски достордум менен.',
      },
      {
        speaker: 'Lea',
        text: 'Und wie ist das Leben in dem kleinen Dorf?',
        ru: 'А какая жизнь в маленькой деревне?',
        ky: 'Ал эми кичинекей айылдагы жашоо кандай?',
      },
      {
        speaker: 'Max',
        text: 'Ruhig! Die neuen Nachbarn sind sehr freundlich.',
        ru: 'Спокойная! Новые соседи очень дружелюбные.',
        ky: 'Тынч! Жаңы кошуналар абдан достук мамилелүү.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Опишите место, где вы живёте, и людей вокруг. Используйте Dativ: in einem …, in der …, mit den … .',
        'Жашаган жериңизди жана айланаңыздагы адамдарды сүрөттөп бериңиз. Dativ колдонуңуз: in einem …, in der …, mit den … .',
      ),
      sample: 'Ich wohne in einer kleinen Stadt. In der Stadt gibt es einen großen Park. Ich gehe oft mit meinen neuen Freunden dorthin.',
      keywords: ['wohne', 'einer', 'kleinen', 'neuen'],
    },
    source: UNIT_22_SOURCE,
  },
]

/** "Why?" notes: one word explained in one sentence. */
export const UNIT_22_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Obwohl die Miete hoch ist, bleibe ich hier.',
    ru: 'Хотя аренда высокая, я остаюсь здесь.',
    ky: 'Ижара баасы жогору болсо да, мен бул жерде калам.',
    word: 'obwohl',
    conceptId: 'b1-konzessive-saetze',
    reason: l(
      'Obwohl показывает уступку («хотя»). Часть с obwohl кончается глаголом (ist), а за запятой сразу идёт глагол главного предложения: bleibe ich.',
      'obwohl каршы келүүнү көрсөтөт («…са да»). obwohl менен башталган бөлүк этиш менен бүтөт (ist), ал эми үтүрдөн кийин дароо башкы бөлүктүн этиши келет: bleibe ich.',
    ),
    more: [
      { de: 'Ich gehe spazieren, obwohl es regnet.', ru: 'Я иду гулять, хотя идёт дождь.', ky: 'Жамгыр жааса да, мен сейилдегени чыгам.' },
      {
        de: 'Es regnet. Trotzdem gehe ich spazieren.',
        ru: 'Идёт дождь. Всё же я иду гулять.',
        ky: 'Жамгыр жаап жатат. Ошого карабастан мен сейилдегени чыгам.',
      },
    ],
  },
  {
    sentence: 'Je länger ich hier wohne, desto besser verstehe ich die Leute.',
    ru: 'Чем дольше я здесь живу, тем лучше понимаю людей.',
    ky: 'Бул жерде канчалык көп жашасам, адамдарды ошончолук жакшы түшүнөм.',
    word: 'desto',
    conceptId: 'b1-doppelkonnektoren',
    reason: l(
      'Je … desto всегда с сравнительной степенью (länger, besser). В части с je глагол в конце (wohne), в части с desto глагол на втором месте (verstehe ich).',
      'je … desto дайыма салыштырма даража менен колдонулат (länger, besser). je бөлүгүндө этиш аягында (wohne), desto бөлүгүндө этиш экинчи орунда (verstehe ich).',
    ),
    more: [
      {
        de: 'Je früher ich aufstehe, desto mehr Zeit habe ich.',
        ru: 'Чем раньше я встаю, тем больше у меня времени.',
        ky: 'Канчалык эрте турсам, ошончолук убактым көп болот.',
      },
      { de: 'Das Zimmer ist weder groß noch hell.', ru: 'Комната ни большая, ни светлая.', ky: 'Бөлмө чоң да эмес, жарык да эмес.' },
    ],
  },
  {
    sentence: 'Wir wohnen in einem kleinen Dorf.',
    ru: 'Мы живём в маленькой деревне.',
    ky: 'Биз кичинекей айылда жашайбыз.',
    word: 'kleinen',
    conceptId: 'b1-adjektive-dativ-genitiv',
    reason: l(
      'После in + einem (Dativ) прилагательное получает окончание -en: einem kleinen Dorf. То же — в Dativ женского рода (der kleinen Stadt) и во множественном числе (den kleinen Kindern).',
      'in + einem (Dativ) артынан сын атоочко -en жалгоосу кошулат: einem kleinen Dorf. Аял род Dativде (der kleinen Stadt) жана көптүк санда (den kleinen Kindern) да ушундай.',
    ),
    more: [
      { de: 'Ich arbeite in der großen Firma.', ru: 'Я работаю в большой фирме.', ky: 'Мен чоң фирмада иштейм.' },
      { de: 'Wir helfen den netten Nachbarn.', ru: 'Мы помогаем милым соседям.', ky: 'Биз боорукер кошуналарга жардам беребиз.' },
    ],
  },
]
