import type { GrammarConcept, L10n, WhyNote } from '../types'
import { UNIT_11_SOURCE } from './provenance'
import { UNIT_12_GRAMMAR, UNIT_12_WHY_NOTES } from './unit12/grammar'
import { UNIT_13_GRAMMAR, UNIT_13_WHY_NOTES } from './unit13/grammar'
import { UNIT_14_GRAMMAR, UNIT_14_WHY_NOTES } from './unit14/grammar'
import { UNIT_15_GRAMMAR, UNIT_15_WHY_NOTES } from './unit15/grammar'
import { UNIT_16_GRAMMAR, UNIT_16_WHY_NOTES } from './unit16/grammar'
import { UNIT_17_GRAMMAR, UNIT_17_WHY_NOTES } from './unit17/grammar'
import { UNIT_18_GRAMMAR, UNIT_18_WHY_NOTES } from './unit18/grammar'
import { UNIT_19_GRAMMAR, UNIT_19_WHY_NOTES } from './unit19/grammar'
import { UNIT_20_GRAMMAR, UNIT_20_WHY_NOTES } from './unit20/grammar'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/** A2 grammar concepts (units 11–20, `level: 'A2'`). Unit 11 has three concepts. */
const UNIT_11_A2_GRAMMAR: GrammarConcept[] = [
  // ───────────────────────── 1 · Perfekt ─────────────────────────
  {
    id: 'a2-perfekt-erfahrungen',
    category: 'tenses',
    level: 'A2',
    unit: 11,
    visual: 'timeline',
    title: l('Perfekt: что я пережил и сделал', 'Perfekt: мен эмне көрдүм жана эмне кылдым'),
    summary: l(
      'В разговоре о прошлом немцы используют Perfekt: вспомогательный глагол haben или sein стоит на втором месте, а Partizip II — в самом конце предложения. Большинство глаголов берут haben. Sein нужен глаголам движения (gehen, fahren, ziehen) и изменения состояния (aufwachsen, werden, bleiben).',
      'Өткөн чак жөнүндө сүйлөшкөндө немистер Perfekt колдонушат: жардамчы этиш haben же sein сүйлөмдүн экинчи орунда, ал эми Partizip II сүйлөмдүн эң аягында турат. Көпчүлүк этиштер haben алат. Sein кыймыл-аракет билдирген этиштерге (gehen, fahren, ziehen) жана абал өзгөргөндү билдирген этиштерге (aufwachsen, werden, bleiben) керек.',
    ),
    discover: l(
      'Сравните: «Ich habe in Berlin gearbeitet» и «Ich bin nach Berlin gezogen». Почему в первом предложении haben, а во втором sein?',
      '«Ich habe in Berlin gearbeitet» жана «Ich bin nach Berlin gezogen» деген сүйлөмдөрдү салыштырыңыз. Эмне үчүн биринчисинде haben, экинчисинде sein колдонулган?',
    ),
    why: l(
      'Perfekt — обычное прошедшее время в устной речи и в личных письмах. Когда вы рассказываете о своём пути, о работе и учёбе, почти всегда нужен Perfekt. Тот, кто хорошо владеет им, может рассказать о жизни, о событиях и об опыте.',
      'Perfekt — оозеки сүйлөөдө жана жеке каттарда эң көп колдонулган өткөн чак. Өз жолуңуз, иш жана окуу жөнүндө айтып берээрде дээрлик ар дайым Perfekt керек. Аны жакшы билген адам өз жашоосу, окуялар жана тажрыйба жөнүндө эркин айта алат.',
    ),
    when: [
      l(
        'Рассказ о событиях: Ich habe drei Jahre in Bischkek gearbeitet.',
        'Окуяларды айтып берүү: Ich habe drei Jahre in Bischkek gearbeitet.',
      ),
      l(
        'Вопрос об опыте: Hast du schon einmal im Ausland gelebt? — Nein, noch nie.',
        'Тажрыйба жөнүндө суроо: Hast du schon einmal im Ausland gelebt? — Nein, noch nie.',
      ),
      l(
        'Sein — глаголы движения и изменения: Ich bin umgezogen. Ich bin in Osch aufgewachsen.',
        'Sein — кыймыл-аракет жана өзгөрүү этиштери: Ich bin umgezogen. Ich bin in Osch aufgewachsen.',
      ),
      l(
        'Без приставки ge- в Partizip II: глаголы на be-, ent-, er-, ver- и на -ieren (bestanden, entschieden, erlebt, verändert, studiert).',
        'Partizip II формасында ge- жок: be-, ent-, er-, ver- жана -ieren менен аяктаган этиштерде (bestanden, entschieden, erlebt, verändert, studiert).',
      ),
      l(
        'Указания времени: vor zwei Jahren (два года назад), im Jahr 2019, letztes Jahr. Для действия, которое продолжается до сих пор, — seit и настоящее время: Ich lerne seit einem Jahr Deutsch.',
        'Убакыт көрсөткүчтөрү: vor zwei Jahren (эки жыл мурун), im Jahr 2019, letztes Jahr. Азыркыга чейин улана берген иш-аракет үчүн — seit жана учурдагы чак: Ich lerne seit einem Jahr Deutsch.',
      ),
    ],
    examples: [
      {
        de: 'Ich habe drei Jahre in Bischkek gearbeitet.',
        ru: 'Я три года работал в Бишкеке.',
        ky: 'Мен үч жыл Бишкекте иштедим.',
        focus: 'habe … gearbeitet',
      },
      {
        de: 'Wir sind vor zwei Jahren nach Hamburg umgezogen.',
        ru: 'Мы два года назад переехали в Гамбург.',
        ky: 'Биз эки жыл мурун Гамбургга көчүп бардык.',
        focus: 'sind … umgezogen',
      },
      {
        de: 'Er hat seine Ausbildung abgeschlossen.',
        ru: 'Он закончил своё профессиональное обучение.',
        ky: 'Ал кесиптик окуусун бүтүрдү.',
        focus: 'abgeschlossen',
      },
      {
        de: 'Hast du schon einmal in einem anderen Land gelebt?',
        ru: 'Ты когда-нибудь жил в другой стране?',
        ky: 'Сен мурда башка өлкөдө жашап көрдүң беле?',
        focus: 'schon einmal',
      },
      {
        de: 'Ich habe noch nie Sushi gegessen.',
        ru: 'Я никогда не ел суши.',
        ky: 'Мен эч качан суши жеген эмесмин.',
        focus: 'noch nie',
      },
    ],
    mistakes: [
      {
        wrong: 'Ich habe nach Berlin gefahren.',
        right: 'Ich bin nach Berlin gefahren.',
        note: l(
          'Fahren — глагол движения с целью «куда»: нужен sein, а не haben.',
          'Fahren — «кайда» деген багытты билдирген кыймыл этиши: haben эмес, sein керек.',
        ),
      },
      {
        wrong: 'Ich habe studiert in Berlin.',
        right: 'Ich habe in Berlin studiert.',
        note: l(
          'Partizip II всегда стоит в самом конце предложения.',
          'Partizip II ар дайым сүйлөмдүн эң аягында турат.',
        ),
      },
      {
        wrong: 'Ich habe die Prüfung gebestanden.',
        right: 'Ich habe die Prüfung bestanden.',
        note: l(
          'У глаголов с приставкой be- в Partizip II нет ge-: bestehen → bestanden.',
          'be- приставкасы бар этиштерде Partizip II формасына ge- кошулбайт: bestehen → bestanden.',
        ),
      },
      {
        wrong: 'Ich bin die Ausbildung abgeschlossen.',
        right: 'Ich habe die Ausbildung abgeschlossen.',
        note: l(
          'Если у глагола есть прямое дополнение (что? — die Ausbildung), обычно нужен haben.',
          'Этиштин түз толуктоочу сөзү (эмнени? — die Ausbildung) болсо, адатта haben колдонулат.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Ich habe schon als Verkäufer gearbeitet.',
        ru: 'Я уже работал продавцом.',
        ky: 'Мен буга чейин сатуучу болуп иштегенмин.',
        focus: 'schon',
      },
      {
        de: 'Ich bin 2022 nach Deutschland gekommen.',
        ru: 'Я приехал в Германию в 2022 году.',
        ky: 'Мен Германияга 2022-жылы келдим.',
        focus: 'bin … gekommen',
      },
      {
        de: 'In Leipzig habe ich viele Erfahrungen gesammelt.',
        ru: 'В Лейпциге я набрался много опыта.',
        ky: 'Лейпцигде мен көп тажрыйба топтодум.',
        focus: 'gesammelt',
      },
    ],
    dialogue: [
      {
        speaker: 'Jonas',
        text: 'Wo hast du eigentlich Deutsch gelernt?',
        ru: 'А где ты вообще учил немецкий?',
        ky: 'Сен немис тилин кайда үйрөндүң?',
      },
      {
        speaker: 'Aigerim',
        text: 'Zuerst habe ich einen Kurs in Bischkek besucht.',
        ru: 'Сначала я ходила на курсы в Бишкеке.',
        ky: 'Адегенде мен Бишкектеги курска бардым.',
      },
      {
        speaker: 'Jonas',
        text: 'Und wann bist du nach Deutschland gekommen?',
        ru: 'А когда ты приехала в Германию?',
        ky: 'Ал эми Германияга качан келдиң?',
      },
      {
        speaker: 'Aigerim',
        text: 'Vor einem Jahr. Jetzt lebe ich in Leipzig.',
        ru: 'Год назад. Теперь я живу в Лейпциге.',
        ky: 'Бир жыл мурун. Азыр мен Лейпцигде жашап жатам.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите тремя предложениями, что вы уже пережили: где выросли, что делали, когда переехали.',
        'Үч сүйлөм менен айтып бериңиз: кайда чоңойдуңуз, эмне кылдыңыз, качан көчтүңүз.',
      ),
      sample: 'Ich bin in Osch aufgewachsen. Ich habe drei Jahre als Verkäufer gearbeitet. Vor einem Jahr bin ich nach Deutschland gezogen.',
      keywords: ['ich habe', 'ich bin', 'gearbeitet', 'gezogen', 'aufgewachsen'],
    },
    source: UNIT_11_SOURCE,
  },

  // ───────────────────────── 2 · Präteritum von sein, haben, Modalverben ─────────────────────────
  {
    id: 'a2-praeteritum-sein-haben-modal',
    category: 'tenses',
    level: 'A2',
    unit: 11,
    visual: 'conjugation',
    title: l('Präteritum: war, hatte, konnte, wollte, musste (каким было прошлое)', 'Präteritum: war, hatte, konnte, wollte, musste (өткөн убакыт кандай болгон)'),
    summary: l(
      'С глаголами sein, haben и модальными глаголами (können, wollen, müssen) в разговоре о прошлом используют Präteritum, а не Perfekt: «Ich war müde», «Ich hatte keine Zeit», «Ich konnte nicht kommen». Формы: ich war / hatte / konnte / wollte / musste; du warst / hattest; wir waren / hatten / konnten. У ich и er/sie/es форма одинаковая.',
      'sein, haben жана модалдык этиштер (können, wollen, müssen) менен өткөн чак жөнүндө сүйлөгөндө Perfekt эмес, Präteritum колдонулат: «Ich war müde», «Ich hatte keine Zeit», «Ich konnte nicht kommen». Формалары: ich war / hatte / konnte / wollte / musste; du warst / hattest; wir waren / hatten / konnten. Ich жана er/sie/es үчүн форма бирдей.',
    ),
    discover: l(
      'Мы говорим «Ich bin nach Berlin gezogen» (Perfekt), но «Ich war müde», а не «Ich bin müde gewesen». Почему с некоторыми глаголами другое прошедшее время?',
      '«Ich bin nach Berlin gezogen» (Perfekt) деп айтабыз, бирок «Ich bin müde gewesen» эмес, «Ich war müde» деп айтабыз. Эмне үчүн кээ бир этиштерде өткөн чак башкача болот?',
    ),
    why: l(
      'Глаголы sein, haben и модальные глаголы используются очень часто, поэтому в живой речи у них осталась короткая форма Präteritum. Она нужна, чтобы описать, каким было прошлое: кем вы были, что у вас было, что вы хотели, могли и должны были.',
      'sein, haben жана модалдык этиштер абдан көп колдонулгандыктан, оозеки сүйлөөдө алардын кыска Präteritum формасы сакталып калган. Ал өткөн убакыт кандай болгонун сүрөттөө үчүн керек: ким болгонуңуз, эмнеңиз болгон, эмнени каалагансыз, эмнени жасай алгансыз жана эмнени жасашыңыз керек болгон.',
    ),
    when: [
      l(
        'Каким было прошлое: Früher war ich Student. Damals hatte ich wenig Geld.',
        'Өткөн убакыт кандай болгон: Früher war ich Student. Damals hatte ich wenig Geld.',
      ),
      l(
        'Что я мог, хотел или должен был: Ich konnte kein Deutsch. Ich wollte Ärztin werden. Ich musste viel lernen.',
        'Эмне кыла алгам, каалагам же милдеттүү болгон: Ich konnte kein Deutsch. Ich wollte Ärztin werden. Ich musste viel lernen.',
      ),
      l(
        'Модальные глаголы в Präteritum не имеют умлаута: können → konnte, müssen → musste.',
        'Модалдык этиштер Präteritum формасында умлаутсуз жазылат: können → konnte, müssen → musste.',
      ),
      l(
        'Другие глаголы в разговоре о прошлом остаются в Perfekt: Ich habe gearbeitet.',
        'Башка этиштер өткөн чак жөнүндө сүйлөгөндө Perfekt формасында калат: Ich habe gearbeitet.',
      ),
    ],
    examples: [
      {
        de: 'Damals war ich noch Student.',
        ru: 'Тогда я был ещё студентом.',
        ky: 'Ал кезде мен али студент элем.',
        focus: 'war',
      },
      {
        de: 'Ich hatte keine Arbeit, aber ich hatte viel Zeit.',
        ru: 'У меня не было работы, но было много времени.',
        ky: 'Менин жумушум жок болчу, бирок убактым көп болчу.',
        focus: 'hatte',
      },
      {
        de: 'Früher konnte ich kein Deutsch sprechen.',
        ru: 'Раньше я не умел говорить по-немецки.',
        ky: 'Мурда мен немисче сүйлөй алчу эмесмин.',
        focus: 'konnte',
      },
      {
        de: 'Mit 18 wollte ich Ärztin werden.',
        ru: 'В 18 лет я хотела стать врачом.',
        ky: '18 жашымда мен дарыгер болууну кааладым.',
        focus: 'wollte',
      },
      {
        de: 'Wir mussten viel arbeiten.',
        ru: 'Нам приходилось много работать.',
        ky: 'Биз көп иштешибиз керек болчу.',
        focus: 'mussten',
      },
    ],
    mistakes: [
      {
        wrong: 'Ich konnten kein Deutsch.',
        right: 'Ich konnte kein Deutsch.',
        note: l(
          'В Präteritum у können нет умлаута, а у ich нет окончания: ich konnte. Форма «konnten» — это wir и sie/Sie.',
          'können этишинин Präteritum формасында умлаут жок, ал эми ich үчүн мүчө жок: ich konnte. «konnten» формасы — wir жана sie/Sie үчүн.',
        ),
      },
      {
        wrong: 'Er hattet viel Arbeit.',
        right: 'Er hatte viel Arbeit.',
        note: l(
          'У er/sie/es в Präteritum нет окончания -t: er hatte, er war.',
          'er/sie/es үчүн Präteritum формасында -t мүчөсү жок: er hatte, er war.',
        ),
      },
      {
        wrong: 'Ich bin müde gewesen.',
        right: 'Ich war müde.',
        note: l(
          'В разговоре о прошлом с sein обычно говорят war, а не «bin gewesen».',
          'Өткөн чак жөнүндө сүйлөгөндө sein менен адатта «bin gewesen» эмес, war айтылат.',
        ),
      },
      {
        wrong: 'Damals muss ich viel lernen.',
        right: 'Damals musste ich viel lernen.',
        note: l(
          'Слово «damals» говорит о прошлом, поэтому модальный глагол тоже стоит в прошедшем времени.',
          '«Damals» сөзү өткөн убакытты көрсөтөт, ошондуктан модалдык этиш да өткөн чакта турушу керек.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Am Anfang konnte ich nur wenig Deutsch.',
        ru: 'В начале я знал по-немецки совсем немного.',
        ky: 'Башында мен немисче абдан аз билчүмүн.',
        focus: 'konnte',
      },
      {
        de: 'Ich hatte Angst vor Fehlern.',
        ru: 'Я боялся ошибок.',
        ky: 'Мен ката кетирүүдөн корктум.',
        focus: 'hatte',
      },
      {
        de: 'Früher war ich sehr schüchtern.',
        ru: 'Раньше я был очень застенчивым.',
        ky: 'Мурда мен абдан уяң элем.',
        focus: 'war',
      },
    ],
    dialogue: [
      {
        speaker: 'Frau Keller',
        text: 'Wie war der Anfang in Deutschland?',
        ru: 'Каким было начало в Германии?',
        ky: 'Германиядагы башталышы кандай болду?',
      },
      {
        speaker: 'Tomás',
        text: 'Schwer. Ich konnte kaum Deutsch sprechen.',
        ru: 'Трудным. Я почти не мог говорить по-немецки.',
        ky: 'Оор болду. Мен дээрлик немисче сүйлөй алган жокмун.',
      },
      {
        speaker: 'Frau Keller',
        text: 'Und die Arbeit? Hatten Sie schon eine Stelle?',
        ru: 'А работа? У вас уже было место?',
        ky: 'Ал эми жумуш? Сизде жумуш орду бар беле?',
      },
      {
        speaker: 'Tomás',
        text: 'Nein. Ich musste zuerst einen Sprachkurs machen.',
        ru: 'Нет. Мне сначала нужно было пройти языковой курс.',
        ky: 'Жок. Мен адегенде тил курсунан өтүшүм керек болчу.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Скажите, каким было ваше прошлое: кем вы были, что вы могли, хотели или должны были делать.',
        'Өткөн жашооңуз кандай болгонун айтыңыз: ким болгонсуз, эмне кыла алгансыз, эмнени каалагансыз же эмне кылышыңыз керек болгон.',
      ),
      sample: 'Früher war ich Student. Ich hatte wenig Geld, und ich musste viel lernen. Ich wollte im Ausland arbeiten.',
      keywords: ['war', 'hatte', 'musste', 'wollte', 'konnte'],
    },
    source: UNIT_11_SOURCE,
  },

  // ───────────────────────── 3 · Ereignisse verbinden ─────────────────────────
  {
    id: 'a2-ereignisse-verbinden',
    category: 'conjunctions',
    level: 'A2',
    unit: 11,
    visual: 'verbpos',
    title: l('Ereignisse verbinden: danach, weil, dass', 'Окуяларды байланыштыруу: danach, weil, dass'),
    summary: l(
      'Чтобы рассказать связно, нужны слова порядка (zuerst, dann, danach, später, schließlich) и союзы. После zuerst/danach/dann глагол стоит на втором месте: «Danach habe ich Arbeit gefunden». После weil и dass начинается придаточное предложение — глагол уходит в самый конец: «…, weil ich Arbeit gefunden habe».',
      'Баянды байланыштуу айтуу үчүн ырааттуулукту билдирген сөздөр (zuerst, dann, danach, später, schließlich) жана байламталар керек. Zuerst/danach/dann сөздөрүнөн кийин этиш экинчи орунда турат: «Danach habe ich Arbeit gefunden». Weil жана dass сөздөрүнөн кийин ээрчимелүү сүйлөм башталат — этиш эң аягына өтөт: «…, weil ich Arbeit gefunden habe».',
    ),
    discover: l(
      'Сравните: «Ich bin umgezogen. Ich habe Arbeit gefunden» и «Ich bin umgezogen, weil ich Arbeit gefunden habe». Что изменилось в порядке слов и что стало понятнее?',
      '«Ich bin umgezogen. Ich habe Arbeit gefunden» жана «Ich bin umgezogen, weil ich Arbeit gefunden habe» деген сүйлөмдөрдү салыштырыңыз. Сөздөрдүн тартиби кандай өзгөрдү жана эмне түшүнүктүү болду?',
    ),
    why: l(
      'Отдельные предложения звучат как список фактов. Слова порядка и союзы показывают, что за чем следует и почему это произошло. Так вы рассказываете о жизни, а не просто перечисляете события.',
      'Өзүнчө сүйлөмдөр фактылардын тизмеси сыяктуу угулат. Ырааттуулук сөздөрү жана байламталар эмне эмненин артынан болгонун жана эмне үчүн болгонун көрсөтөт. Ошентип сиз окуяларды санап чыкпастан, жашоо жөнүндө айтып бересиз.',
    ),
    when: [
      l(
        'Порядок событий: zuerst, dann, danach, später, schließlich — они стоят на первом месте, глагол — на втором.',
        'Окуялардын ырааты: zuerst, dann, danach, später, schließlich — алар биринчи орунда, этиш экинчи орунда турат.',
      ),
      l(
        'Причина: weil (вы уже знаете его из A1) + придаточное предложение, глагол в конце: Ich lerne Deutsch, weil ich hier arbeiten möchte.',
        'Себеп: weil (A1 деңгээлинен билесиз) + ээрчимелүү сүйлөм, этиш аягында: Ich lerne Deutsch, weil ich hier arbeiten möchte.',
      ),
      l(
        'Мнение или знание: Ich glaube / Ich weiß / Ich finde, dass … — глагол в конце: Ich weiß, dass du gut Deutsch sprichst.',
        'Пикир же билим: Ich glaube / Ich weiß / Ich finde, dass … — этиш аягында: Ich weiß, dass du gut Deutsch sprichst.',
      ),
      l(
        'В Perfekt придаточного предложения в самом конце стоит вспомогательный глагол: …, weil ich umgezogen bin.',
        'Ээрчимелүү сүйлөмдүн Perfekt формасында эң аягында жардамчы этиш турат: …, weil ich umgezogen bin.',
      ),
    ],
    examples: [
      {
        de: 'Zuerst habe ich Deutsch gelernt. Danach habe ich eine Stelle gesucht.',
        ru: 'Сначала я учил немецкий. После этого я искал работу.',
        ky: 'Адегенде мен немис тилин үйрөндүм. Андан кийин жумуш издедим.',
        focus: 'Danach habe ich',
      },
      {
        de: 'Ich bin umgezogen, weil ich Arbeit gefunden habe.',
        ru: 'Я переехал, потому что нашёл работу.',
        ky: 'Мен жумуш тапкандыктан көчүп кеттим.',
        focus: 'weil … gefunden habe',
      },
      {
        de: 'Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.',
        ru: 'Я учу немецкий, потому что хочу работать в Германии.',
        ky: 'Мен Германияда иштегим келгендиктен немис тилин үйрөнүп жатам.',
        focus: 'weil … arbeiten möchte',
      },
      {
        de: 'Ich glaube, dass Erfahrungen sehr wichtig sind.',
        ru: 'Я думаю, что опыт очень важен.',
        ky: 'Менин оюмча, тажрыйба абдан маанилүү.',
        focus: 'dass … sind',
      },
    ],
    mistakes: [
      {
        wrong: 'Ich bin umgezogen, weil ich habe Arbeit gefunden.',
        right: 'Ich bin umgezogen, weil ich Arbeit gefunden habe.',
        note: l(
          'После weil глагол уходит в конец предложения; вспомогательный глагол стоит после Partizip II.',
          'Weil сөзүнөн кийин этиш сүйлөмдүн аягына өтөт; жардамчы этиш Partizip II формасынан кийин турат.',
        ),
      },
      {
        wrong: 'Danach ich habe Arbeit gefunden.',
        right: 'Danach habe ich Arbeit gefunden.',
        note: l(
          'Если предложение начинается с danach, глагол всё равно стоит на втором месте, а подлежащее — после него.',
          'Сүйлөм danach сөзүнөн башталса да, этиш экинчи орунда турат, ал эми ээси андан кийин келет.',
        ),
      },
      {
        wrong: 'Ich glaube, dass er ist nett.',
        right: 'Ich glaube, dass er nett ist.',
        note: l(
          'После dass спрягаемый глагол стоит в самом конце придаточного предложения.',
          'Dass сөзүнөн кийин жөндөлгөн этиш ээрчимелүү сүйлөмдүн эң аягында турат.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Zuerst habe ich ein Praktikum gemacht, und danach hat mir die Firma eine Stelle angeboten.',
        ru: 'Сначала я прошёл стажировку, а потом фирма предложила мне место.',
        ky: 'Адегенде мен практикадан өттүм, андан кийин фирма мага жумуш орду сунуштады.',
        focus: 'danach hat',
      },
      {
        de: 'Ich finde, dass dieser Kurs sehr gut ist.',
        ru: 'Я считаю, что этот курс очень хороший.',
        ky: 'Менимче, бул курс абдан жакшы.',
        focus: 'dass … ist',
      },
    ],
    dialogue: [
      {
        speaker: 'Jonas',
        text: 'Warum bist du nach Leipzig gezogen?',
        ru: 'Почему ты переехала в Лейпциг?',
        ky: 'Эмне үчүн Лейпцигге көчүп келдиң?',
      },
      {
        speaker: 'Aigerim',
        text: 'Weil mein Mann hier eine Stelle gefunden hat.',
        ru: 'Потому что мой муж нашёл здесь работу.',
        ky: 'Анткени жолдошум бул жерде жумуш тапты.',
      },
      {
        speaker: 'Jonas',
        text: 'Und was hast du danach gemacht?',
        ru: 'А что ты делала после этого?',
        ky: 'Андан кийин эмне кылдың?',
      },
      {
        speaker: 'Aigerim',
        text: 'Zuerst habe ich einen Deutschkurs besucht. Dann habe ich ein Praktikum gefunden.',
        ru: 'Сначала я ходила на курсы немецкого. Потом нашла стажировку.',
        ky: 'Адегенде мен немис тили курсуна бардым. Анан практика таптым.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите, что вы сделали сначала и что потом, и объясните причину с помощью weil.',
        'Адегенде эмне кылганыңызды, анан эмне кылганыңызды айтыңыз жана себебин weil менен түшүндүрүңүз.',
      ),
      sample: 'Zuerst habe ich Deutsch gelernt. Danach bin ich nach Deutschland gezogen, weil ich dort arbeiten wollte.',
      keywords: ['zuerst', 'danach', 'weil', 'dass'],
    },
    source: UNIT_11_SOURCE,
  },
]

/** A2 "why?" notes powering the WHY button. Unit 11: one note per typical learner question. */
const UNIT_11_A2_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Wir sind vor zwei Jahren nach Hamburg umgezogen.',
    ru: 'Мы два года назад переехали в Гамбург.',
    ky: 'Биз эки жыл мурун Гамбургга көчүп бардык.',
    word: 'sind',
    conceptId: 'a2-perfekt-erfahrungen',
    reason: l(
      'Umziehen означает перемену места — это движение с целью «куда» (nach Hamburg). Такие глаголы образуют Perfekt с sein.',
      'Umziehen — жашаган жерди өзгөртүү, башкача айтканда «кайда» (nach Hamburg) деген багыттагы кыймыл. Мындай этиштер Perfekt формасын sein менен түзөт.',
    ),
    more: [
      { de: 'Ich bin in Osch aufgewachsen.', ru: 'Я вырос в Оше.', ky: 'Мен Ошто чоңойдум.' },
      { de: 'Sie ist Ärztin geworden.', ru: 'Она стала врачом.', ky: 'Ал дарыгер болду.' },
    ],
  },
  {
    sentence: 'Ich habe die Prüfung bestanden.',
    ru: 'Я сдал экзамен.',
    ky: 'Мен сынактан өттүм.',
    word: 'bestanden',
    conceptId: 'a2-perfekt-erfahrungen',
    reason: l(
      'Bestehen начинается с приставки be-. У таких глаголов Partizip II образуется без ge-: bestanden, а не «gebestanden».',
      'Bestehen этиши be- приставкасынан башталат. Мындай этиштердин Partizip II формасы ge- кошулбай түзүлөт: bestanden, «gebestanden» эмес.',
    ),
    more: [
      { de: 'Er hat sich für ein Studium entschieden.', ru: 'Он решил учиться в вузе.', ky: 'Ал университетте окууну чечти.' },
      { de: 'Sie hat in Wien studiert.', ru: 'Она училась в Вене.', ky: 'Ал Венада окуду.' },
    ],
  },
  {
    sentence: 'Früher konnte ich kein Deutsch sprechen.',
    ru: 'Раньше я не умел говорить по-немецки.',
    ky: 'Мурда мен немисче сүйлөй алчу эмесмин.',
    word: 'konnte',
    conceptId: 'a2-praeteritum-sein-haben-modal',
    reason: l(
      'Слово «früher» указывает на прошлое. Модальные глаголы в рассказе о прошлом обычно стоят в Präteritum: konnte, wollte, musste — без умлаута.',
      '«Früher» сөзү өткөн убакытты көрсөтөт. Өткөн чак жөнүндө айтканда модалдык этиштер адатта Präteritum формасында турат: konnte, wollte, musste — умлаутсуз.',
    ),
    more: [
      { de: 'Ich musste viel lernen.', ru: 'Мне приходилось много учиться.', ky: 'Мен көп окушум керек болчу.' },
      { de: 'Mit 18 wollte ich Ärztin werden.', ru: 'В 18 лет я хотела стать врачом.', ky: '18 жашымда мен дарыгер болууну кааладым.' },
    ],
  },
  {
    sentence: 'Ich bin umgezogen, weil ich Arbeit gefunden habe.',
    ru: 'Я переехал, потому что нашёл работу.',
    ky: 'Мен жумуш тапкандыктан көчүп кеттим.',
    word: 'habe',
    conceptId: 'a2-ereignisse-verbinden',
    reason: l(
      'Weil начинает придаточное предложение, а в нём спрягаемый глагол стоит в самом конце. В Perfekt это вспомогательный глагол: «… gefunden habe».',
      'Weil ээрчимелүү сүйлөмдү баштайт, анда жөндөлгөн этиш эң аягында турат. Perfekt формасында бул жардамчы этиш: «… gefunden habe».',
    ),
    more: [
      { de: 'Ich lerne Deutsch, weil ich hier arbeiten möchte.', ru: 'Я учу немецкий, потому что хочу здесь работать.', ky: 'Мен бул жерде иштегим келгендиктен немис тилин үйрөнүп жатам.' },
      { de: 'Ich weiß, dass du gut Deutsch sprichst.', ru: 'Я знаю, что ты хорошо говоришь по-немецки.', ky: 'Сенин немисче жакшы сүйлөгөнүңдү билем.' },
    ],
  },
  {
    sentence: 'Danach habe ich eine Ausbildung begonnen.',
    ru: 'После этого я начал профессиональное обучение.',
    ky: 'Андан кийин мен кесиптик окууну баштадым.',
    word: 'habe',
    conceptId: 'a2-ereignisse-verbinden',
    reason: l(
      'Danach стоит на первом месте, поэтому глагол (habe) занимает второе место, а подлежащее (ich) — третье. Глагол всегда второй.',
      'Danach биринчи орунда турат, ошондуктан этиш (habe) экинчи орунга, ал эми ээси (ich) үчүнчү орунга өтөт. Этиш ар дайым экинчи орунда турат.',
    ),
    more: [
      { de: 'Zuerst habe ich Deutsch gelernt.', ru: 'Сначала я учил немецкий.', ky: 'Адегенде мен немис тилин үйрөндүм.' },
      { de: 'Schließlich habe ich die Stelle bekommen.', ru: 'В конце концов я получил это место.', ky: 'Акырында мен ал жумуш ордун алдым.' },
    ],
  },
]

/** Unit 11 (pilot, unchanged) followed by Unit 12 (Stage 7C). */
export const A2_GRAMMAR: GrammarConcept[] = [...UNIT_11_A2_GRAMMAR, ...UNIT_12_GRAMMAR, ...UNIT_13_GRAMMAR, ...UNIT_14_GRAMMAR, ...UNIT_15_GRAMMAR, ...UNIT_16_GRAMMAR, ...UNIT_17_GRAMMAR, ...UNIT_18_GRAMMAR, ...UNIT_19_GRAMMAR, ...UNIT_20_GRAMMAR]

/** Unit 11 notes followed by Unit 12 notes. */
export const A2_WHY_NOTES: WhyNote[] = [...UNIT_11_A2_WHY_NOTES, ...UNIT_12_WHY_NOTES, ...UNIT_13_WHY_NOTES, ...UNIT_14_WHY_NOTES, ...UNIT_15_WHY_NOTES, ...UNIT_16_WHY_NOTES, ...UNIT_17_WHY_NOTES, ...UNIT_18_WHY_NOTES, ...UNIT_19_WHY_NOTES, ...UNIT_20_WHY_NOTES]
