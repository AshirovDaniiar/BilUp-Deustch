import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_12_SOURCE } from '../provenance'

/**
 * Unit 12 texts (Stage 7C): 2 listening dialogues, 2 readings, 1 speaking scenario, 1 writing task.
 * Rules applied (Stage 7B audit): imperative only as fixed expressions (`Komm vorbei!`, `Ruf mich an!`, `Sag mal`, `Erzähl mal`); no `wenn`-clauses
 * (taught in unit 14); no Genitiv; no attributive adjectives (unit 13); receptive words appear only in texts and options.
 */
export const UNIT_12_LISTENING: ListeningExercise[] = [
  {
    id: 'a2-li-12-01',
    unit: 12,
    level: 'A2',
    title: 'Am Telefon: Eine Hochzeit in der Familie',
    lines: [
      { speaker: 'Marco', text: 'Hallo Aida! Wie geht es dir?', ru: 'Привет, Аида! Как у тебя дела?', ky: 'Салам, Аида! Иштериң кандай?' },
      { speaker: 'Aida', text: 'Gut, danke! Ich komme gerade von einer Hochzeit. Meine Cousine hat geheiratet.', ru: 'Хорошо, спасибо! Я только что со свадьбы. Моя двоюродная сестра вышла замуж.', ky: 'Жакшы, рахмат! Мен жаңы эле үйлөнүү тоюнан келдим. Ата-энемдин бир тууганынын кызы баш кошту.' },
      { speaker: 'Marco', text: 'Oh, schön! Kennst du ihren Partner schon?', ru: 'О, как здорово! Ты уже знаешь её партнёра?', ky: 'О, кандай сонун! Анын өнөктөшүн мурдатан билесиңби?' },
      { speaker: 'Aida', text: 'Ja, ich mag ihn sehr. Er ist freundlich und lustig.', ru: 'Да, он мне очень нравится. Он дружелюбный и весёлый.', ky: 'Ооба, мен аны абдан жактырам. Ал ак көңүл жана шайыр.' },
      { speaker: 'Marco', text: 'Und habt ihr euch alle gut verstanden?', ru: 'А вы все хорошо ладили?', ky: 'Силер баарыңар жакшы тил табыштыңарбы?' },
      { speaker: 'Aida', text: 'Fast alle. Meine Großeltern waren sehr glücklich.', ru: 'Почти все. Мои бабушка и дедушка были очень счастливы.', ky: 'Дээрлик баары. Менин чоң атам менен чоң энем абдан бактылуу болушту.' },
      { speaker: 'Marco', text: 'Hast du auch deine Geschwister getroffen?', ru: 'А своих братьев и сестёр ты тоже встретила?', ky: 'Бир туугандарыңды да жолуктурдуңбу?' },
      { speaker: 'Aida', text: 'Ja, mein Bruder hat mich abgeholt. Wir haben uns lange nicht gesehen.', ru: 'Да, брат встретил меня. Мы давно не виделись.', ky: 'Ооба, агам мени тосуп алды. Биз көптөн бери көрүшкөн жокпуз.' },
      { speaker: 'Marco', text: 'Komm doch mal vorbei! Dann erzählst du mir alles.', ru: 'Заходи как-нибудь! Тогда расскажешь мне всё.', ky: 'Бир келип кет! Анан мага баарын айтып бересиң.' },
      { speaker: 'Aida', text: 'Gern! Ich rufe dich morgen an.', ru: 'С удовольствием! Я позвоню тебе завтра.', ky: 'Кубанып! Мен сага эртең чалам.' },
    ],
    questions: [
      { q: 'Wo war Aida gerade?', options: ['Bei Marco', 'Auf einer Hochzeit', 'Im Deutschkurs'], answer: 1 },
      { q: 'Was sagt Aida über den Partner ihrer Cousine?', options: ['Er ist freundlich und lustig.', 'Er ist oft wütend.', 'Er ist sehr schüchtern.'], answer: 0 },
      { q: 'Wer hat Aida abgeholt?', options: ['Marco', 'Ihre Cousine', 'Ihr Bruder'], answer: 2 },
      { q: 'Was macht Aida morgen?', options: ['Sie ruft Marco an.', 'Sie besucht ihre Großeltern.', 'Sie geht zu einer Hochzeit.'], answer: 0 },
    ],
    keywords: ['Hochzeit', 'Cousine', 'Großeltern', 'abgeholt', 'vorbei'],
    source: UNIT_12_SOURCE,
  },
  {
    id: 'a2-li-12-02',
    unit: 12,
    level: 'A2',
    title: 'In der Wohnung: Wer macht was?',
    lines: [
      { speaker: 'Nora', text: 'Ben, wir müssen über die Hausarbeit sprechen.', ru: 'Бен, нам надо поговорить о домашних делах.', ky: 'Бен, биз үй иштери жөнүндө сүйлөшүшүбүз керек.' },
      { speaker: 'Ben', text: 'Stimmt. Letzte Woche haben wir uns schon gestritten.', ru: 'Верно. На прошлой неделе мы уже поссорились.', ky: 'Туура. Өткөн жумада биз мурунтан эле талашып калдык.' },
      { speaker: 'Nora', text: 'Ich möchte nicht wieder streiten. Wollen wir die Arbeit teilen?', ru: 'Я не хочу снова ссориться. Давай поделим работу?', ky: 'Мен кайра талашкым келбейт. Ишти бөлүшөлүбү?' },
      { speaker: 'Ben', text: 'Gute Idee. Ich räume die Küche auf und wasche ab.', ru: 'Хорошая идея. Я убираю кухню и мою посуду.', ky: 'Жакшы идея. Мен ашкананы жыйнап, идиш жууйм.' },
      { speaker: 'Nora', text: 'Dann putze ich das Bad und kaufe ein.', ru: 'Тогда я убираю ванную и делаю покупки.', ky: 'Анда мен ваннаны тазалап, соода кылам.' },
      { speaker: 'Ben', text: 'Super. Kannst du mir am Samstag helfen?', ru: 'Отлично. Ты можешь помочь мне в субботу?', ky: 'Сонун. Ишемби күнү мага жардам бере аласыңбы?' },
      { speaker: 'Nora', text: 'Klar, ich helfe dir gern. Aber dann hilfst du mir am Sonntag, okay?', ru: 'Конечно, с радостью помогу. Но тогда в воскресенье ты поможешь мне, хорошо?', ky: 'Албетте, сага кубанып жардам берем. Бирок анда жекшемби күнү сен мага жардам бересиң, макулбу?' },
      { speaker: 'Ben', text: 'Abgemacht! Und morgen koche ich für uns.', ru: 'Договорились! А завтра я готовлю на нас обоих.', ky: 'Макул болдук! Ал эми эртең мен экөөбүзгө тамак бышырам.' },
      { speaker: 'Nora', text: 'Danke dir! Ich bin glücklich. Wir verstehen uns wirklich gut.', ru: 'Спасибо! Я счастлива. Мы правда хорошо ладим.', ky: 'Рахмат! Мен бактылуумун. Биз чындап эле жакшы тил табышабыз.' },
      { speaker: 'Ben', text: 'Ja, das finde ich auch.', ru: 'Да, я тоже так считаю.', ky: 'Ооба, мен да ошентип ойлойм.' },
    ],
    questions: [
      { q: 'Was ist das Thema?', options: ['Ein Urlaub', 'Ein Geschenk', 'Die Hausarbeit'], answer: 2 },
      { q: 'Was macht Ben?', options: ['Er putzt das Bad.', 'Er räumt die Küche auf und wäscht ab.', 'Er kauft ein.'], answer: 1 },
      { q: 'Wer hilft wem am Samstag?', options: ['Nora hilft Ben.', 'Ben hilft Nora.', 'Sie helfen ihrer Mutter.'], answer: 0 },
      { q: 'Wie verstehen sich Nora und Ben?', options: ['Schlecht.', 'Gut.', 'Gar nicht.'], answer: 1 },
    ],
    keywords: ['Hausarbeit', 'teilen', 'Küche', 'helfe', 'verstehen'],
    source: UNIT_12_SOURCE,
  },
]

export const UNIT_12_READING: ReadingText[] = [
  {
    id: 'a2-re-12-01',
    unit: 12,
    level: 'A2',
    title: 'Mein Freund Kai',
    body: [
      'Ich heiße Aliya und lebe seit zwei Jahren in Köln. Mein Freund Kai und ich haben uns im Deutschkurs kennengelernt.',
      'Kai ist sehr hilfsbereit und lustig. Er hilft mir oft, und ich koche manchmal für ihn. Wir streiten uns selten, aber manchmal ist er ein bisschen eifersüchtig. Er mag meine Freunde nicht so gern, weil er sie nicht gut kennt.',
      'Ich vertraue ihm. Für mich ist er wie ein Bruder.',
    ],
    gloss: [
      { word: 'kennengelernt', ru: 'познакомились (Partizip II от sich kennenlernen)', ky: 'таанышып калдык (sich kennenlernen этишинин Partizip II формасы)', example: 'Wir haben uns im Deutschkurs kennengelernt.', grammar: 'sich + Perfekt с haben: wir haben uns … kennengelernt', grammarKy: 'sich + haben менен Perfekt: wir haben uns … kennengelernt', related: ['sich kennenlernen', 'sich treffen'] },
      { word: 'eifersüchtig', ru: 'ревнивый', ky: 'кызганчаак', example: 'Er ist manchmal eifersüchtig.', grammar: 'после sein прилагательное не изменяется: er ist eifersüchtig', grammarKy: 'sein этишинен кийин сын атооч өзгөрбөйт: er ist eifersüchtig', related: ['vertrauen', 'wütend'] },
      { word: 'ihm', ru: 'ему (Dativ от er)', ky: 'ага (er ат атоочунун Dativ формасы)', example: 'Ich vertraue ihm.', grammar: 'vertrauen требует Dativ: ihm, а не ihn', grammarKy: 'vertrauen Dativ талап кылат: ihn эмес, ihm', related: ['vertrauen', 'helfen'] },
      { word: 'hilft', ru: 'помогает', ky: 'жардам берет', example: 'Er hilft mir oft.', grammar: 'helfen + Dativ; у er меняется гласная: helfen → er hilft', grammarKy: 'helfen + Dativ; er үчүн үндүү өзгөрөт: helfen → er hilft', related: ['helfen', 'hilfsbereit'] },
    ],
    questions: [
      { q: 'Wie haben sich Aliya und Kai kennengelernt?', options: ['Im Deutschkurs.', 'Bei der Arbeit.', 'Im Urlaub.'], answer: 0 },
      { q: 'Was stimmt über Kai?', options: ['Er ist oft wütend.', 'Er ist sehr schüchtern.', 'Er ist hilfsbereit und lustig.'], answer: 2 },
      { q: 'Warum mag Kai die Freunde von Aliya nicht so gern?', options: ['Sie sind unhöflich.', 'Er kennt sie nicht gut.', 'Sie streiten oft.'], answer: 1 },
    ],
    source: UNIT_12_SOURCE,
  },
  {
    id: 'a2-re-12-02',
    unit: 12,
    level: 'A2',
    title: 'Putzplan und Notizen',
    body: [
      'Putzplan für unsere Wohnung: Montag – Küche aufräumen (Ben). Dienstag – Bad putzen (Nora). Mittwoch – abwaschen (Ben und Nora). Samstag – Wohnung aufräumen (Ben).',
      'Notiz von Nora: Ben, kannst du mir am Dienstag helfen? Ich habe viel Arbeit. Danke dir!',
      'Notiz von Ben: Klar, ich helfe dir gern. Dafür hilfst du mir am Samstag. Okay?',
    ],
    gloss: [
      { word: 'Putzplan', ru: 'график уборки', ky: 'тазалоо графиги', example: 'Wir haben einen Putzplan.', grammar: 'составное существительное: putzen + der Plan = der Putzplan (артикль — по последнему слову)', grammarKy: 'татаал зат атооч: putzen + der Plan = der Putzplan (артикль акыркы сөз боюнча)', related: ['aufräumen', 'der Haushalt'] },
      { word: 'aufräumen', ru: 'убирать, наводить порядок', ky: 'жыйноо, тартипке келтирүү', example: 'Ich räume mein Zimmer auf.', grammar: 'отделяемая приставка: ich räume … auf', grammarKy: 'приставка (auf) сүйлөмдүн аягына чыгат: ich räume … auf', related: ['abwaschen', 'die Hausarbeit'] },
      { word: 'abwaschen', ru: 'мыть посуду', ky: 'идиш жуу', example: 'Wer wäscht heute ab?', grammar: 'отделяемая приставка: er wäscht … ab', grammarKy: 'приставка (ab) сүйлөмдүн аягына чыгат: er wäscht … ab', related: ['aufräumen', 'teilen'] },
      { word: 'Dafür', ru: 'взамен, за это', ky: 'анын ордуна', example: 'Dafür hilfst du mir am Samstag.', grammar: 'наречие «dafür» — «взамен»; стоит на первом месте, глагол — на втором', grammarKy: '«dafür» тактооч «анын ордуна» дегенди билдирет; биринчи орунда турат, этиш экинчи орунда', related: ['helfen', 'danke'] },
    ],
    questions: [
      { q: 'Wer putzt das Bad?', options: ['Ben', 'Nora', 'Ben und Nora'], answer: 1 },
      { q: 'Wann hilft Ben Nora?', options: ['Am Montag', 'Am Samstag', 'Am Dienstag'], answer: 2 },
      { q: 'Was möchte Ben dafür?', options: ['Nora hilft ihm am Samstag.', 'Nora kocht am Sonntag.', 'Nora kauft ein.'], answer: 0 },
    ],
    source: UNIT_12_SOURCE,
  },
]

export const UNIT_12_SPEAKING: SpeakingScenario[] = [
  {
    id: 'a2-sp-12-01',
    title: 'Über einen Freund erzählen',
    titleRu: 'Рассказ о друге',
    titleKy: 'Дос жөнүндө айтып берүү',
    icon: '👥',
    level: 'A2',
    goal: {
      ru: 'Новый коллега спрашивает вас о ваших друзьях. Расскажите о друге или подруге: как зовут, как вы познакомились, какой он или она, как вы ладите и что делаете вместе.',
      ky: 'Жаңы кесиптешиңиз досторуңуз жөнүндө сурайт. Досуңуз же курбуңуз жөнүндө айтып бериңиз: аты ким, кантип таанышканыңыз, ал кандай, кандай тил табышаарыңыз жана чогуу эмне кыларыңыз.',
    },
    turns: [
      {
        ai: 'Sag mal, wer ist dein Freund oder deine Freundin? Wie heißt er oder sie?',
        aiRu: 'Скажи, кто твой друг или подруга? Как его или её зовут?',
        aiKy: 'Айтчы, досуң же курбуң ким? Анын аты ким?',
        hints: ['Mein Freund heißt …', 'Meine Freundin heißt …'],
        keywords: ['freund', 'freundin', 'heißt'],
      },
      {
        ai: 'Wie habt ihr euch kennengelernt?',
        aiRu: 'Как вы познакомились?',
        aiKy: 'Силер кантип таанышып калдыңар?',
        hints: ['Wir haben uns im Deutschkurs kennengelernt.', 'Wir haben uns bei der Arbeit kennengelernt.'],
        keywords: ['uns', 'kennengelernt'],
      },
      {
        ai: 'Wie ist er oder sie? Und versteht ihr euch gut?',
        aiRu: 'Какой он или она? И вы хорошо ладите?',
        aiKy: 'Ал кандай? Силер жакшы тил табышасыңарбы?',
        hints: ['Er ist sehr …', 'Sie ist sehr …', 'Wir verstehen uns gut.'],
        keywords: ['ist', 'sehr', 'verstehen', 'uns'],
      },
      {
        ai: 'Was macht ihr zusammen? Hilft er oder sie dir manchmal?',
        aiRu: 'Что вы делаете вместе? Он или она иногда тебе помогает?',
        aiKy: 'Силер чогуу эмне кыласыңар? Ал кээде сага жардам береби?',
        hints: ['Wir treffen uns am …', 'Er hilft mir oft.', 'Ich helfe ihr manchmal.'],
        keywords: ['treffen', 'hilft', 'mir', 'ihr', 'ihm'],
      },
    ],
    source: UNIT_12_SOURCE,
  },
]

export const UNIT_12_WRITING: WritingTask[] = [
  {
    id: 'a2-wr-12-01',
    unit: 12,
    level: 'A2',
    title: 'Eine Nachricht an die Mitbewohnerin',
    situation: {
      ru: 'Вы живёте в общей квартире. Напишите короткое сообщение соседке или соседу: поблагодарите за помощь, попросите о помощи, распределите две домашние обязанности, объясните причину с weil и скажите, как вы ладите.',
      ky: 'Сиз бир батирде чогуу жашайсыз. Кошунаңызга кыска билдирүү жазыңыз: жардамы үчүн рахмат айтыңыз, жардам сурап көрүңүз, эки үй ишин бөлүштүрүңүз, себебин weil менен түшүндүрүңүз жана кандай тил табышаарыңызды айтыңыз.',
    },
    formal: false,
    minWords: 50,
    mustInclude: [
      { label: 'Anrede (Hallo / Liebe / Hi)', patterns: ['hallo', 'liebe ', 'hi '] },
      { label: 'Danke sagen', patterns: ['danke'] },
      { label: 'Bitte um Hilfe (Kannst du mir …?)', patterns: ['kannst du mir', 'kannst du uns'] },
      { label: 'Dativ-Pronomen (mir, dir, ihm, ihr)', patterns: ['mir', 'dir', 'ihm', 'ihr'] },
      { label: 'Akkusativ-Pronomen (dich, mich, ihn, sie)', patterns: ['dich', 'mich', 'ihn '] },
      { label: 'Reflexives Verb (verstehen uns / treffen uns / streiten uns)', patterns: ['uns ', 'mich ', 'sich '] },
      { label: 'Hausarbeit (Hausarbeit, abwaschen, putzen, aufräumen)', patterns: ['hausarbeit', 'abwasch', 'wasche ab', 'putz', 'räume', 'aufräum'] },
      { label: 'Ein Grund mit weil', patterns: ['weil '] },
    ],
    model:
      'Hallo Nora, danke für deine Hilfe gestern! Ich habe heute viel Hausarbeit, weil Besuch kommt. Kannst du mir am Samstag helfen? Ich räume die Küche auf und wasche ab. Du putzt das Bad, okay? Wir verstehen uns gut, und wir streiten uns nie. Am Sonntag koche ich für dich. Ruf mich bitte an, ich habe noch Fragen. Bis bald, Ben',
    tips: [
      {
        ru: 'Для просьбы используйте «Kannst du mir …?»: после mir глагол стоит в конце — «Kannst du mir helfen?».',
        ky: 'Өтүнүч үчүн «Kannst du mir …?» колдонуңуз: mir сөзүнөн кийин этиш аягында турат — «Kannst du mir helfen?».',
      },
      {
        ru: 'Человеку — Dativ (mir, dir, ihm, ihr), вещи или человеку после anrufen — Akkusativ (mich, dich, ihn, sie).',
        ky: 'Адамга — Dativ (mir, dir, ihm, ihr); anrufen этишинен кийин — Akkusativ (mich, dich, ihn, sie).',
      },
      {
        ru: 'Возвратные глаголы: «Wir verstehen uns», «Wir streiten uns nie» — местоимение подходит к лицу.',
        ky: 'Өздүк этиштер: «Wir verstehen uns», «Wir streiten uns nie» — ат атооч жакка туура келет.',
      },
      {
        ru: 'Причину объясняйте через weil: глагол уходит в конец — «…, weil Besuch kommt».',
        ky: 'Себепти weil менен түшүндүрүңүз: этиш аягына өтөт — «…, weil Besuch kommt».',
      },
    ],
    source: UNIT_12_SOURCE,
  },
]
