import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_25_SOURCE, UNIT_25_SPEAKING_ID } from './unit'

/**
 * Unit 25 texts: 2 listening scripts, 2 readings, 1 speaking scenario, 2 writing tasks (the main mail and the short opinion micro-task). Targets of the band for
 * Units 23–26: reading 120–180 words (the curriculum text asks 140–180), listening 120–160 (curriculum: 130–160), sentences ≤ 24 words (95th percentile ≤ 18),
 * 6 speaking turns, writing 70–80 words. Original material; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native speaker.
 * Scope guard (curriculum v2): Konjunktiv II only for advice and polite requests (würde, sollte, könnte, hätte, wäre) — no unreal conditions or wishes (Unit 27), no
 * Konjunktiv II of the past; reflexive verbs with Dativ only from the closed list of 10; no Passiv Perfekt, no relative clause with a preposition (Unit 29),
 * no damit (Unit 30), no verb with an obligatory prepositional object (Unit 28). The texts are for language learning: they give no diagnosis or treatment
 * advice and always point to professional help (Hausarzt, Beratungsstelle).
 * Listening: the dialogues are played with the browser's text-to-speech (the existing mechanism of the listening lab). That playback has NOT been
 * verified on real devices, so no final-test item depends on audio.
 */
export const UNIT_25_LISTENING: ListeningExercise[] = [
  {
    id: 'b1-li-25-01',
    unit: 25,
    level: 'B1',
    title: 'Beim Hausarzt',
    lines: [
      {
        speaker: 'Dr. Haas',
        text: 'Guten Tag, Frau Keller. Was führt Sie heute zu mir?',
        ru: 'Добрый день, госпожа Келлер. Что привело вас сегодня ко мне?',
        ky: 'Кайырлуу күн, Келлер айым. Бүгүн сизди эмне менен келтирди?',
      },
      {
        speaker: 'Frau Keller',
        text: 'Guten Tag, Herr Doktor. Ich habe oft Kopfschmerzen, und ich schlafe schlecht.',
        ru: 'Добрый день, доктор. У меня часто болит голова, и я плохо сплю.',
        ky: 'Кайырлуу күн, дарыгер мырза. Башым көп ооруйт жана жаман уктайм.',
      },
      {
        speaker: 'Dr. Haas',
        text: 'Seit wann haben Sie diese Beschwerden?',
        ru: 'С каких пор у вас эти жалобы?',
        ky: 'Бул ыңгайсыздыктар качантан бери бар?',
      },
      {
        speaker: 'Frau Keller',
        text: 'Seit zwei Wochen. Ich arbeite viel, oft bis spät, und esse nur schnell etwas zwischendurch.',
        ru: 'Две недели. Я много работаю, часто допоздна, и ем только на ходу.',
        ky: 'Эки жумадан бери. Мен көп иштейм, көбүнчө кечке чейин, жана тамакты шашып жеп коём.',
      },
      {
        speaker: 'Dr. Haas',
        text: 'Ich möchte Sie zuerst untersuchen. Danach sprechen wir über Ihren Lebensstil.',
        ru: 'Сначала я хотел бы вас осмотреть. После этого мы поговорим о вашем образе жизни.',
        ky: 'Адегенде сизди текшергим келет. Андан кийин жашоо образыңыз жөнүндө сүйлөшөбүз.',
      },
      {
        speaker: 'Dr. Haas',
        text: 'Bei der Untersuchung sehe ich jetzt nichts Ungewöhnliches. Ich würde Ihnen trotzdem empfehlen, mehr Pausen zu machen.',
        ru: 'При осмотре я сейчас не вижу ничего необычного. Тем не менее я бы рекомендовал вам делать больше перерывов.',
        ky: 'Текшерүүдө азыр адаттан тыш эч нерсе көрбөйм. Ошентсе да мен сизге көбүрөөк тыныгуу жасоону сунуштайт элем.',
      },
      {
        speaker: 'Frau Keller',
        text: 'Und was soll ich essen?',
        ru: 'А что мне есть?',
        ky: 'Ал эми мен эмне жешим керек?',
      },
      {
        speaker: 'Dr. Haas',
        text: 'Eine ausgewogene Ernährung wäre gut, mit Obst, Gemüse und genug Wasser. Sie sollten abends früher ins Bett gehen.',
        ru: 'Хорошо было бы питаться сбалансированно: фрукты, овощи и достаточно воды. Вам стоило бы вечером раньше ложиться спать.',
        ky: 'Тең салмактуу тамактануу жакшы болмок: жемиш, жашылча жана жетиштүү суу. Сиз кечинде эртерээк жатышыңыз керек болмок.',
      },
      {
        speaker: 'Frau Keller',
        text: 'Brauche ich ein Rezept?',
        ru: 'Мне нужен рецепт?',
        ky: 'Мага рецепт керекпи?',
      },
      {
        speaker: 'Dr. Haas',
        text: 'Nein, im Moment nicht. Sie könnten in vier Wochen wiederkommen.',
        ru: 'Нет, сейчас не нужен. Вы могли бы прийти снова через четыре недели.',
        ky: 'Жок, азыр керек эмес. Сиз төрт жумадан кийин кайра келишиңиз мүмкүн.',
      },
      {
        speaker: 'Dr. Haas',
        text: 'Wenn die Kopfschmerzen bleiben, gebe ich Ihnen eine Überweisung zu einem Spezialisten.',
        ru: 'Если головные боли останутся, я выдам вам направление к специалисту.',
        ky: 'Баш ооруу калса, мен сизге адис дарыгерге жолдомо берем.',
      },
      {
        speaker: 'Frau Keller',
        text: 'Kann ich auch Sport machen?',
        ru: 'Мне можно заниматься спортом?',
        ky: 'Мен спорт менен да машыга аламбы?',
      },
      {
        speaker: 'Dr. Haas',
        text: 'Ja, ein Spaziergang am Tag wäre schon ein guter Anfang.',
        ru: 'Да, ежедневная прогулка была бы уже хорошим началом.',
        ky: 'Ооба, күнүнө бир сейилдөө эле жакшы башталыш болмок.',
      },
      {
        speaker: 'Frau Keller',
        text: 'Vielen Dank, Herr Doktor. Auf Wiedersehen.',
        ru: 'Большое спасибо, доктор. До свидания.',
        ky: 'Чоң рахмат, дарыгер мырза. Кайра көрүшкөнчө.',
      },
    ],
    questions: [
      { q: 'Seit wann hat Frau Keller Beschwerden?', options: ['Seit zwei Wochen.', 'Seit zwei Tagen.', 'Seit zwei Monaten.'], answer: 0 },
      {
        q: 'Was empfiehlt der Arzt für den Abend?',
        options: ['Abends noch länger im Büro arbeiten.', 'Mehr Kaffee trinken.', 'Früher ins Bett gehen.'],
        answer: 2,
      },
      { q: 'Wann soll Frau Keller wiederkommen?', options: ['In zwei Wochen.', 'In vier Wochen.', 'In einem Jahr.'], answer: 1 },
      {
        q: 'Wann bekommt sie eine Überweisung?',
        options: ['Sofort.', 'Wenn die Kopfschmerzen bleiben.', 'Nie.'],
        answer: 1,
      },
    ],
    keywords: ['Beschwerden', 'Ernährung', 'Überweisung', 'Lebensstil'],
    source: UNIT_25_SOURCE,
  },
  {
    id: 'b1-li-25-02',
    unit: 25,
    level: 'B1',
    title: 'Ein Podcast über Stress',
    lines: [
      {
        speaker: 'Frau Lang',
        text: 'Willkommen zu unserem Podcast. Heute sprechen wir über Stress im Alltag. Bei uns ist die Psychologin Frau Dr. Voss.',
        ru: 'Добро пожаловать в наш подкаст. Сегодня мы говорим о стрессе в повседневной жизни. У нас в гостях психолог доктор Фосс.',
        ky: 'Подкастыбызга кош келиңиз. Бүгүн биз күнүмдүк стресс жөнүндө сүйлөшөбүз. Бизде психолог Фосс айым.',
      },
      {
        speaker: 'Frau Dr. Voss',
        text: 'Guten Tag, ich freue mich.',
        ru: 'Добрый день, я рада.',
        ky: 'Кайырлуу күн, мен кубанычтамын.',
      },
      {
        speaker: 'Frau Lang',
        text: 'Viele Menschen sind gestresst. Was würden Sie als Erstes empfehlen?',
        ru: 'Многие люди испытывают стресс. Что бы вы порекомендовали в первую очередь?',
        ky: 'Көптөгөн адамдар стресс алышат. Эң алгач эмнени сунуштамаксыз?',
      },
      {
        speaker: 'Frau Dr. Voss',
        text: 'Zuerst sollte man merken, wann der Stress beginnt. Oft helfen kleine Pausen.',
        ru: 'Сначала стоит заметить, когда начинается стресс. Часто помогают небольшие перерывы.',
        ky: 'Адегенде стресс качан башталарын байкоо керек. Көбүнчө кичине тыныгуулар жардам берет.',
      },
      {
        speaker: 'Frau Lang',
        text: 'Was könnte man in einer Pause machen?',
        ru: 'Что можно делать во время перерыва?',
        ky: 'Тыныгууда эмне кылууга болот?',
      },
      {
        speaker: 'Frau Dr. Voss',
        text: 'Man könnte kurz spazieren gehen oder einfach tief atmen. Das kostet nichts.',
        ru: 'Можно ненадолго прогуляться или просто глубоко подышать. Это ничего не стоит.',
        ky: 'Кыскача сейилдеп келсе же жөн эле терең дем алса болот. Бул эч нерсеге турбайт.',
      },
      {
        speaker: 'Frau Lang',
        text: 'Und nach der Arbeit?',
        ru: 'А после работы?',
        ky: 'Ал эми жумуштан кийин?',
      },
      {
        speaker: 'Frau Dr. Voss',
        text: 'Sport ist ein guter Ausgleich. Auch Zeit mit Freunden wäre wichtig, denn Beziehungen geben Kraft.',
        ru: 'Спорт — хороший противовес. Время с друзьями тоже было бы важно, ведь отношения дают силы.',
        ky: 'Спорт — жакшы тең салмактуулук. Достор менен өткөргөн убакыт да маанилүү болмок, анткени мамилелер күч берет.',
      },
      {
        speaker: 'Frau Lang',
        text: 'Viele sagen, sie haben keine Zeit.',
        ru: 'Многие говорят, что у них нет времени.',
        ky: 'Көптөр убактым жок дешет.',
      },
      {
        speaker: 'Frau Dr. Voss',
        text: 'Dann würde ich mir jeden Tag zehn Minuten nur für mich nehmen.',
        ru: 'Тогда я бы выделяла себе каждый день десять минут только для себя.',
        ky: 'Анда мен күн сайын өзүм үчүн он мүнөт бөлмөкмүн.',
      },
      {
        speaker: 'Frau Lang',
        text: 'Und wenn der Stress zu groß wird?',
        ru: 'А если стресс становится слишком сильным?',
        ky: 'Ал эми стресс өтө чоңойсо?',
      },
      {
        speaker: 'Frau Dr. Voss',
        text: 'Dann sollte man mit dem Hausarzt oder einer Beratungsstelle sprechen. Man muss das nicht allein schaffen.',
        ru: 'Тогда стоит поговорить с семейным врачом или в консультационном центре. Не нужно справляться с этим в одиночку.',
        ky: 'Анда үй-бүлөлүк дарыгер менен же кеңеш берүү борбору менен сүйлөшүү керек. Муну жалгыз эле жеңүүнүн кереги жок.',
      },
      {
        speaker: 'Frau Lang',
        text: 'Vielen Dank, Frau Dr. Voss.',
        ru: 'Большое спасибо, доктор Фосс.',
        ky: 'Чоң рахмат, Фосс айым.',
      },
      {
        speaker: 'Frau Dr. Voss',
        text: 'Gern geschehen.',
        ru: 'Пожалуйста.',
        ky: 'Эч нерсе эмес.',
      },
    ],
    questions: [
      {
        q: 'Worüber spricht der Podcast?',
        options: ['Über Urlaub.', 'Über Ernährung.', 'Über Stress im Alltag.'],
        answer: 2,
      },
      {
        q: 'Was kann man in einer Pause machen?',
        options: ['Spazieren gehen oder tief atmen.', 'Einkaufen gehen.', 'Fernsehen.'],
        answer: 0,
      },
      {
        q: 'Was empfiehlt Frau Dr. Voss, wenn man keine Zeit hat?',
        options: ['Weniger schlafen.', 'Jeden Tag zehn Minuten nur für sich nehmen.', 'Noch mehr arbeiten.'],
        answer: 1,
      },
      {
        q: 'Wer kann helfen, wenn der Stress zu groß wird?',
        options: ['Nur der Chef und die Kollegen aus dem Büro.', 'Nur Freunde.', 'Der Hausarzt oder eine Beratungsstelle.'],
        answer: 2,
      },
    ],
    keywords: ['gestresst', 'Ausgleich', 'Beziehung', 'Erholung'],
    source: UNIT_25_SOURCE,
  },
]

export const UNIT_25_READING: ReadingText[] = [
  {
    id: 'b1-re-25-01',
    unit: 25,
    level: 'B1',
    title: 'Wie viel Schlaf brauchen wir?',
    body: [
      'Viele Menschen schlafen zu wenig. Experten sagen, dass Erwachsene meistens sieben bis neun Stunden Schlaf brauchen. Wer lange wach bleibt, ist am nächsten Tag oft müde und gestresst. Auch die Konzentration wird schlechter, weil sich der Körper nicht erholen kann, und manche Menschen nehmen zu. Besonders Schichtarbeiter und Eltern kleiner Kinder haben oft Probleme.',
      'Was kann man tun? Man sollte jeden Tag ungefähr zur gleichen Zeit ins Bett gehen. Abends könnte man das Handy früher weglegen und ein Buch lesen. Auch regelmäßiger Sport am Tag hilft, aber nicht, wenn es schon spät am Abend ist. Ein ausgeglichener Lebensstil mit kleinen Pausen wäre ideal. Wichtig ist: Außerdem sollte man abends nicht zu schwer essen. Jeder Mensch ist anders.',
      'Wenn jemand lange schlecht schläft und sich ständig müde fühlt, sollte er mit dem Hausarzt sprechen. Der Arzt kann untersuchen, woran es liegt, und bei Bedarf eine Überweisung geben. Ratschläge aus einem Artikel ersetzen keinen Arztbesuch.',
    ],
    gloss: [
      {
        word: 'sollte / könnte / wäre',
        ru: 'стоило бы / можно было бы / было бы (Konjunktiv II: совет)',
        ky: 'ылайыктуу болмок / болмок / болмок (Konjunktiv II: кеңеш)',
        example: 'Man sollte früher ins Bett gehen.',
        grammar: 'Konjunktiv II для совета; инфинитив в конце, без zu',
        grammarKy: 'кеңеш үчүн Konjunktiv II; инфинитив аягында, zu жок',
        related: [],
      },
      {
        word: 'nehmen … zu',
        ru: 'прибавляют в весе (zunehmen)',
        ky: 'толушат (zunehmen)',
        example: 'Im Urlaub nehme ich oft zu.',
        grammar: 'zunehmen — отделяемая приставка: er nimmt zu',
        grammarKy: 'zunehmen — ажыраган приставка: er nimmt zu',
        related: [],
      },
      {
        word: 'regelmäßiger Sport',
        ru: 'регулярные занятия спортом',
        ky: 'үзгүлтүксүз спорт',
        example: 'Frische Luft und regelmäßiger Sport helfen.',
        grammar: 'нет артикля: regelmäßiger = Nominativ, мужской род (-er)',
        grammarKy: 'артикль жок: regelmäßiger = Nominativ, эркек род (-er)',
        related: [],
      },
      {
        word: 'bei Bedarf',
        ru: 'при необходимости',
        ky: 'керек болсо',
        example: 'Bei Bedarf rufe ich Sie an.',
        grammar: 'устойчивое выражение; Bedarf — мужской род',
        grammarKy: 'туруктуу туюндурма; Bedarf — эркек род',
        related: [],
      },
    ],
    questions: [
      {
        q: 'Wie viele Stunden Schlaf brauchen Erwachsene meistens?',
        options: ['Fünf bis sechs.', 'Sieben bis neun.', 'Zehn bis zwölf.'],
        answer: 1,
      },
      {
        q: 'Was könnte man abends tun?',
        options: ['Das Handy früher weglegen.', 'Mehr Kaffee trinken.', 'Noch intensiv Sport machen.'],
        answer: 0,
      },
      {
        q: 'Was sagt der Text über langen, schlechten Schlaf?',
        options: ['Man soll noch ein paar Wochen nichts tun.', 'Man soll sofort Tabletten nehmen.', 'Man sollte mit dem Hausarzt sprechen.'],
        answer: 2,
      },
    ],
    source: UNIT_25_SOURCE,
  },
  {
    id: 'b1-re-25-02',
    unit: 25,
    level: 'B1',
    title: 'Ein Missverständnis unter Freunden',
    body: [
      'Mara schreibt im Forum: Letzte Woche hatte ich einen Streit mit meiner besten Freundin. Wir sind schon seit der Schule befreundet. Wir wollten uns am Samstag treffen, aber ich habe ihre Nachricht nicht gesehen. Sie hat zwei Stunden gewartet, weil sie dachte, dass ich komme, und war sehr enttäuscht. Am Abend hat sie mir einen Vorwurf gemacht: „Du denkst nie an mich!“ Das hat mich traurig gemacht, denn es stimmt nicht. Es war nur ein Missverständnis. Ich habe mich sofort entschuldigt, aber sie wollte nicht mit mir reden, bis sie sich beruhigt hat. Was soll ich tun?',
      'Jan antwortet: Ich kenne das. An deiner Stelle würde ich sie anrufen und ehrlich erklären, was passiert ist. Du könntest dich auch entschuldigen, obwohl es nicht deine Schuld war. In einer Freundschaft sind Verständnis und Vertrauen wichtig. Möchtet ihr euch schnell versöhnen? Dann wäre ein Treffen am Wochenende eine gute Idee. Gib ihr etwas Zeit, bis sie bereit ist. Schreib uns, wie es war!',
    ],
    gloss: [
      {
        word: 'An deiner Stelle würde ich …',
        ru: 'на твоём месте я бы … (совет)',
        ky: 'сенин ордуңда мен … (кеңеш)',
        example: 'An deiner Stelle würde ich ihr schreiben.',
        grammar: 'würde на втором месте, инфинитив — в конце',
        grammarKy: 'würde экинчи орунда, инфинитив — аягында',
        related: [],
      },
      {
        word: 'einen Vorwurf machen',
        ru: 'упрекнуть, предъявить упрёк',
        ky: 'айып тагуу, күнөөлөө',
        example: 'Mach mir bitte keinen Vorwurf.',
        grammar: 'устойчивое сочетание: jemandem einen Vorwurf machen',
        grammarKy: 'туруктуу сөз айкашы: jemandem einen Vorwurf machen',
        related: [],
      },
      {
        word: 'euch versöhnen',
        ru: 'помириться (вы)',
        ky: 'элдешүү (силер)',
        example: 'Wir wollen uns versöhnen.',
        grammar: 'sich versöhnen: возвратное местоимение, ihr → euch',
        grammarKy: 'sich versöhnen: sich сыяктуу ат атооч, ihr → euch',
        related: [],
      },
      {
        word: 'obwohl',
        ru: 'хотя (глагол в конце)',
        ky: '… болсо да (этиш аягында)',
        example: 'Er kommt, obwohl er krank ist.',
        grammar: 'придаточное с obwohl (Unit 22): глагол в конце',
        grammarKy: 'obwohl менен кошумча бөлүк (22-бөлүм): этиш аягында',
        related: [],
      },
    ],
    questions: [
      {
        q: 'Warum war Maras Freundin enttäuscht?',
        options: ['Mara hat ihr Geschenk zu Hause vergessen.', 'Mara ist nicht zum Treffen gekommen.', 'Mara hat sie nicht eingeladen.'],
        answer: 1,
      },
      {
        q: 'Was empfiehlt Jan?',
        options: ['Mara soll die Freundin anrufen und alles erklären.', 'Mara soll ihr einen sehr langen Brief per Post schreiben.', 'Mara soll einfach warten.'],
        answer: 0,
      },
      { q: 'Was war das Problem?', options: ['Ein Geldstreit.', 'Ein Umzug.', 'Ein Missverständnis.'], answer: 2 },
    ],
    source: UNIT_25_SOURCE,
  },
]

export const UNIT_25_SPEAKING: SpeakingScenario[] = [
  {
    id: UNIT_25_SPEAKING_ID,
    title: 'Einen Streit mit einem Freund klären',
    titleRu: 'Прояснить ссору с другом',
    titleKy: 'Досуң менен чатакты чечүү',
    icon: '🧘',
    level: 'B1',
    goal: {
      ru: 'Вы поссорились с другом Йонасом и хотите поговорить. Объясните, что случилось, покажите понимание, дайте один-два совета и договоритесь о встрече. В середине разговора друг неожиданно отвергает ваш совет.',
      ky: 'Сиз досуңуз Йонас менен урушуп калдыңыз жана сүйлөшкүңүз келет. Эмне болгонун түшүндүрүңүз, түшүнгөнүңүздү көрсөтүңүз, бир-эки кеңеш бериңиз жана жолугушуу боюнча макулдашыңыз. Сүйлөшүүнүн ортосунда дос кеңешиңизди күтүлбөгөн жерден четке кагат.',
    },
    turns: [
      {
        ai: 'Hallo! Du wolltest mit mir reden. Was ist denn los?',
        aiRu: 'Привет! Ты хотел поговорить со мной. Что случилось?',
        aiKy: 'Салам! Сен мени менен сүйлөшкүң келди эле. Эмне болду?',
        hints: [
          'Ich möchte über unseren Streit sprechen.',
          'Es tut mir leid, dass wir uns gestritten haben.',
          'Ich glaube, es war ein Missverständnis.',
        ],
        keywords: ['streit', 'sprechen', 'missverständnis', 'leid'],
      },
      {
        ai: 'Ich war sauer, weil du nicht angerufen hast. Du hast mir gefehlt.',
        aiRu: 'Я злился, потому что ты не позвонил. Мне тебя не хватало.',
        aiKy: 'Мен ачууландым, анткени сен чалган жоксуң. Сен мага жетишпедиң.',
        hints: [
          'Ich kann das gut verstehen.',
          'Du hast recht, es tut mir leid.',
          'Ich habe die Nachricht leider zu spät gesehen.',
        ],
        keywords: ['verstehen', 'recht', 'nachricht', 'spät'],
      },
      {
        ai: 'Und was meinst du, was wir jetzt tun sollen?',
        aiRu: 'И как ты думаешь, что нам теперь делать?',
        aiKy: 'Сен кандай ойдосуң, эми биз эмне кылышыбыз керек?',
        hints: [
          'An deiner Stelle würde ich auch erst einmal reden.',
          'Wir könnten uns am Wochenende treffen.',
          'Du solltest mir sagen, was dich genau geärgert hat.',
        ],
        keywords: ['stelle', 'könnten', 'treffen', 'solltest'],
      },
      {
        ai: 'Ehrlich gesagt: Deinen Rat finde ich nicht gut. Das hilft mir nicht, ich brauche Zeit.',
        aiRu: 'Честно говоря, твой совет мне не нравится. Он мне не помогает, мне нужно время.',
        aiKy: 'Чынын айтканда, сенин кеңешиң мага жакпайт. Ал мага жардам бербейт, мага убакыт керек.',
        hints: [
          'Das ist okay. Nimm dir die Zeit, die du brauchst.',
          'Moment, ich überlege kurz. Wann wäre es für dich besser?',
          'Entschuldige, ich wollte dir nicht wehtun.',
        ],
        keywords: ['zeit', 'okay', 'wäre', 'entschuldige'],
      },
      {
        ai: 'Danke, dass du das verstehst. Hättest du am Samstag Zeit für ein Gespräch?',
        aiRu: 'Спасибо, что ты понимаешь. У тебя найдётся время в субботу для разговора?',
        aiKy: 'Түшүнгөнүң үчүн рахмат. Ишембиде сүйлөшүүгө убактың болобу?',
        hints: [
          'Ja, am Samstag passt gut.',
          'Wir könnten zusammen einen Kaffee trinken.',
          'Ich merke mir den Termin: Samstag um drei.',
        ],
        keywords: ['samstag', 'passt', 'kaffee', 'termin'],
      },
      {
        ai: 'Schön. Wie fühlst du dich jetzt?',
        aiRu: 'Хорошо. Как ты себя сейчас чувствуешь?',
        aiKy: 'Жакшы. Сен азыр өзүңдү кандай сезип жатасың?',
        hints: [
          'Ich fühle mich viel besser und ruhiger.',
          'Ich bin froh, dass wir uns versöhnen.',
          'Freundschaft ist mir wichtig.',
        ],
        keywords: ['fühle', 'besser', 'versöhnen', 'freundschaft'],
      },
    ],
    source: UNIT_25_SOURCE,
  },
]

export const UNIT_25_WRITING: WritingTask[] = [
  {
    id: 'b1-wr-25-01',
    unit: 25,
    level: 'B1',
    title: 'Eine Mail an einen Freund mit Rat',
    situation: {
      ru: 'Ваш друг написал вам: он плохо спит и очень устаёт на работе. Напишите ему дружеское письмо: поблагодарите за сообщение, покажите понимание, дайте советы (минимум три формы Konjunktiv II: würde, solltest, könntest, wäre …), используйте одно выражение с Dativ-местоимением (например, «Nimm dir Zeit …») и сердечно попрощайтесь. Не меньше 75 слов. Посоветуйте также обратиться к врачу, если проблема не проходит — вы не ставите диагноз.',
      ky: 'Досуңуз сизге жазды: ал жаман уктайт жана жумушта катуу чарчайт. Ага достук кат жазыңыз: билдирүүсү үчүн рахмат айтыңыз, түшүнгөнүңүздү көрсөтүңүз, кеңештерди бериңиз (кеминде үч Konjunktiv II формасы: würde, solltest, könntest, wäre …), Dativ ат атоочу бар бир туюндурманы колдонуңуз (мисалы, «Nimm dir Zeit …») жана жылуу коштошуңуз. Кеминде 75 сөз. Көйгөй өтпөсө, дарыгерге кайрылууну да кеңеш кылыңыз — сиз диагноз койбойсуз.',
    },
    formal: false,
    minWords: 75,
    mustInclude: [
      {
        label: 'Anrede und Dank (Lieber … / Liebe …, danke für deine Nachricht)',
        patterns: ['lieber', 'liebe ', 'hallo', 'danke'],
        explain: {
          ru: 'Дружеское обращение в начале и благодарность за сообщение друга.',
          ky: 'Каттын башында достук кайрылуу жана досуңуздун билдирүүсү үчүн рахмат.',
        },
      },
      {
        label: 'Verständnis zeigen (Es tut mir leid, … / Ich kann das gut verstehen)',
        patterns: ['tut mir leid', 'verstehen', 'verständnis'],
        explain: {
          ru: 'Покажите, что вы понимаете чувства друга.',
          ky: 'Досуңуздун сезимдерин түшүнгөнүңүздү көрсөтүңүз.',
        },
      },
      {
        label: 'Drei Ratschläge im Konjunktiv II (An deiner Stelle würde ich … / Du solltest … / Du könntest … / Es wäre gut, …)',
        patterns: ['würde ich', 'solltest', 'könntest', 'wäre gut', 'wäre es'],
        explain: {
          ru: 'Минимум три совета с würde, solltest, könntest или wäre: глагол в конце, без zu (кроме «Es wäre gut, … zu …»).',
          ky: 'würde, solltest, könntest же wäre менен кеминде үч кеңеш: этиш аягында, zu жок («Es wäre gut, … zu …» тышкары).',
        },
      },
      {
        label: 'Ein Reflexivpronomen im Dativ (Nimm dir Zeit … / Gönn dir … / Merk dir …)',
        patterns: ['nimm dir', 'nimmst dir', 'dir zeit', 'merk dir', 'überleg dir', 'wasch dir', 'putz dir', 'mir zeit'],
        explain: {
          ru: 'Одна фраза из списка с mir / dir: Nimm dir Zeit, Merk dir …, Überleg dir …',
          ky: 'Тизмедеги mir / dir менен бир сөз айкашы: Nimm dir Zeit, Merk dir …, Überleg dir …',
        },
      },
      {
        label: 'Hinweis auf Hilfe (Wenn es nicht besser wird, sprich mit deinem Hausarzt)',
        patterns: ['hausarzt', 'arzt', 'ärztin', 'beratungsstelle'],
        explain: {
          ru: 'Предложите обратиться к врачу или в консультационный центр, если проблема не проходит.',
          ky: 'Көйгөй өтпөсө, дарыгерге же кеңеш берүү борборуна кайрылууну сунуштаңыз.',
        },
      },
      {
        label: 'Gruß (Liebe Grüße / Bis bald)',
        patterns: ['liebe grüße', 'bis bald', 'herzliche grüße', 'viele grüße'],
        explain: {
          ru: 'Дружеское прощание в конце письма.',
          ky: 'Каттын аягында достук коштошуу.',
        },
      },
    ],
    model:
      'Lieber Tim, danke für deine Nachricht. Es tut mir leid, dass du so gestresst bist und so schlecht schläfst. Ich kann das gut verstehen. An deiner Stelle würde ich abends früher ins Bett gehen und das Handy weglegen. Du solltest auch jeden Tag eine kleine Pause machen. Du könntest zum Beispiel nach der Arbeit spazieren gehen. Nimm dir am Wochenende Zeit für dich und für deine Freunde. Es wäre auch gut, mit dem Hausarzt zu sprechen, wenn es nicht besser wird. Ich drücke dir die Daumen! Liebe Grüße, Lena',
    tips: [
      {
        ru: 'Начните по-дружески: «Lieber Tim» и закончите «Liebe Grüße». Используйте du. Сначала покажите понимание («Es tut mir leid …»), потом давайте советы.',
        ky: 'Достук баштаңыз: «Lieber Tim» жана «Liebe Grüße» менен аяктаңыз. du колдонуңуз. Адегенде түшүнгөнүңүздү көрсөтүңүз («Es tut mir leid …»), анан кеңештерди бериңиз.',
      },
      {
        ru: 'Дайте минимум три совета: «An deiner Stelle würde ich … gehen», «Du solltest … machen», «Du könntest … trinken». Würde / solltest / könntest — на втором месте, инфинитив — в самом конце, без zu.',
        ky: 'Кеминде үч кеңеш бериңиз: «An deiner Stelle würde ich … gehen», «Du solltest … machen», «Du könntest … trinken». würde / solltest / könntest — экинчи орунда, инфинитив — эң аягында, zu жок.',
      },
      {
        ru: 'Добавьте одно выражение с Dativ: «Nimm dir Zeit für dich», «Merk dir …». Помните: mir / dir (не mich / dich), если есть Akkusativ-дополнение.',
        ky: 'Dativ менен бир туюндурма кошуңуз: «Nimm dir Zeit für dich», «Merk dir …». Эсиңизде болсун: Akkusativ толуктоочу бар болсо mir / dir (mich / dich эмес).',
      },
      {
        ru: 'Вы не врач: не ставьте диагноз и не называйте лекарства. Посоветуйте обратиться к Hausarzt, если проблема не проходит.',
        ky: 'Сиз дарыгер эмессиз: диагноз койбоңуз жана дарыларды атабаңыз. Көйгөй өтпөсө, Hausarztка кайрылууну кеңеш кылыңыз.',
      },
      {
        ru: 'После написания пройдите по списку ниже и оцените себя сами: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
        ky: 'Жазып бүткөндөн кийин төмөнкү тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
      },
    ],
    source: UNIT_25_SOURCE,
  },
  {
    id: 'b1-wr-25-02',
    unit: 25,
    level: 'B1',
    title: 'Meine Meinung: Gesund leben',
    situation: {
      ru: 'В чате вашего курса обсуждают здоровый образ жизни. Напишите короткий комментарий: что вы думаете о здоровых привычках (сон, спорт, питание) и почему. Не меньше 30 слов. Это небольшое задание на мнение и аргумент.',
      ky: 'Курсуңуздун чатында ден соолукка пайдалуу жашоо жөнүндө талкуу жүрүп жатат. Кыска комментарий жазыңыз: ден соолукка пайдалуу адаттар (уйку, спорт, тамактануу) жөнүндө эмне ойлойсуз жана эмне үчүн. Кеминде 30 сөз. Бул оюңузду жана далилиңизди айтуу боюнча кичинекей тапшырма.',
    },
    formal: false,
    minWords: 30,
    mustInclude: [
      {
        label: 'Eigene Meinung (Ich finde, dass … / Ich denke, dass …)',
        patterns: ['ich finde', 'ich denke', 'ich glaube', 'meiner meinung nach'],
        explain: {
          ru: 'Одно предложение с вашим мнением: Ich finde, dass … или Ich denke, dass …',
          ky: 'Оюңузду билдирген бир сүйлөм: Ich finde, dass … же Ich denke, dass …',
        },
      },
      {
        label: 'Ein Grund (… , weil … / … , denn …)',
        patterns: ['weil', 'denn', 'deshalb'],
        explain: {
          ru: 'Причина вашего мнения: weil (глагол в конце) или denn (порядок слов обычный).',
          ky: 'Оюңуздун себеби: weil (этиш аягында) же denn (сөздөрдүн иреттери адаттагыдай).',
        },
      },
      {
        label: 'Ein Wort zum Thema (Schlaf, Sport, Ernährung, Stress, Gesundheit, Pause)',
        patterns: ['schlaf', 'sport', 'ernährung', 'stress', 'gesund', 'pause', 'erholung'],
        explain: {
          ru: 'Хотя бы одно слово по теме: сон, спорт, питание, стресс, здоровье, перерыв.',
          ky: 'Темага байланыштуу жок дегенде бир сөз: уйку, спорт, тамактануу, стресс, ден соолук, тыныгуу.',
        },
      },
    ],
    model:
      'Ich finde, dass guter Schlaf sehr wichtig für die Gesundheit ist, denn bei zu wenig Erholung bin ich schnell gestresst. Ich denke auch, dass regelmäßiger Sport hilft, weil ich danach ruhiger bin. Eine ausgewogene Ernährung gehört für mich auch zu einem gesunden Lebensstil.',
    tips: [
      {
        ru: 'Начните с мнения: «Ich finde, dass …» или «Ich denke, dass …». Затем дайте причину с weil (глагол в конце) или denn.',
        ky: 'Оюңуздан баштаңыз: «Ich finde, dass …» же «Ich denke, dass …». Андан кийин weil (этиш аягында) же denn менен себебин айтыңыз.',
      },
      {
        ru: 'Используйте слова юнита: Schlaf, Ernährung, Gewohnheit, ausgewogen, regelmäßig, ungesund.',
        ky: 'Бөлүмдүн сөздөрүн колдонуңуз: Schlaf, Ernährung, Gewohnheit, ausgewogen, regelmäßig, ungesund.',
      },
      {
        ru: 'После написания оцените себя сами по списку: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
        ky: 'Жазып бүткөндөн кийин тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
      },
    ],
    source: UNIT_25_SOURCE,
  },
]
