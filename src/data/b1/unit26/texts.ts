import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_26_SOURCE, UNIT_26_SPEAKING_ID } from './unit'

/**
 * Unit 26 texts: 2 listening scripts, 2 readings, 1 speaking scenario, 3 writing tasks (the main comment and two short micro-tasks: opinion and mediation).
 * Targets of the band for Units 23–26: reading 120–180 words (the curriculum text asks 140–180), listening 120–160 (curriculum: 120–150), sentences ≤ 24 words
 * (95th percentile ≤ 18), 6 speaking turns, writing 70–80 words. Original material; the Kyrgyz is an AI-assisted first draft that has not been reviewed.
 * ALL news, places, films and people are FICTIONAL and labelled as such in the learner's language; nothing reports a real event or makes a claim about a
 * real person. Scope guard (curriculum v2): Passiv with a modal verb and Passiv Präteritum only with the closed list of verbs (veröffentlichen, gründen, bauen,
 * erfinden, eröffnen, absagen); `lassen` only with the closed list of 6; reporting only in the Indicative (no Konjunktiv I). RECEPTIVE, in ONE reading each and
 * glossed: Partizip I as adjective (b1-re-26-01), `sich lassen` (b1-re-26-02). No Passiv Perfekt, no relative clause with a preposition (Unit 29), no damit
 * (Unit 30), no Genitiv, no verb with an obligatory prepositional object (Unit 28), no `ohne … zu` / `statt … zu`.
 * Listening: the dialogues are played with the browser's text-to-speech (the existing mechanism of the listening lab). That playback has NOT been
 * verified on real devices, so no final-test item depends on audio. Strand: listening strategy "numbers and names".
 */
export const UNIT_26_LISTENING: ListeningExercise[] = [
  {
    id: 'b1-li-26-01',
    unit: 26,
    level: 'B1',
    title: 'Die Nachrichten um zwölf Uhr (erfunden)',
    lines: [
      {
        speaker: 'Frau Ott',
        text: 'Guten Tag, hier sind die Nachrichten um zwölf Uhr. Alle Meldungen sind für den Deutschkurs erfunden und nicht echt.',
        ru: 'Добрый день, это новости в двенадцать часов. Все сообщения придуманы для курса немецкого языка.',
        ky: 'Кайырлуу күн, саат он экидеги жаңылыктар. Бардык кабарлар немис тили курсу үчүн ойлоп табылган.',
      },
      {
        speaker: 'Frau Ott',
        text: 'In Grünfeld wurde gestern die neue Brücke eröffnet. Sie wurde in zwei Jahren gebaut und kostete drei Millionen Euro.',
        ru: 'В Грюнфельде вчера открыли новый мост. Его строили два года, он стоил три миллиона евро.',
        ky: 'Грюнфельдде кечээ жаңы көпүрө ачылды. Ал эки жылда курулду жана үч миллион евро турду.',
      },
      {
        speaker: 'Frau Ott',
        text: 'Laut der Stadt kann die Brücke ab sofort von Autos und Fahrrädern benutzt werden.',
        ru: 'Согласно городу, мостом можно пользоваться с этого момента как автомобилям, так и велосипедам.',
        ky: 'Шаардын айтуусунча, көпүрөнү азыртан баштап автоунаалар да, велосипеддер да колдоно алат.',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Und wie wird das Wetter am Nachmittag?',
        ru: 'А какая будет погода днём?',
        ky: 'Ал эми түштөн кийин аба ырайы кандай болот?',
      },
      {
        speaker: 'Frau Ott',
        text: 'Am Nachmittag regnet es bei zwölf Grad, bis es am Abend wieder trocken wird.',
        ru: 'Днём идёт дождь при двенадцати градусах, пока вечером снова не станет сухо.',
        ky: 'Түштөн кийин он эки градуста жамгыр жаайт, кечинде кайра кургак болгонго чейин.',
      },
      {
        speaker: 'Frau Ott',
        text: 'Noch eine Meldung: Das Fußballspiel am Samstag wurde abgesagt. Es heißt, dass der Platz zu nass ist.',
        ru: 'Ещё одно сообщение: футбольный матч в субботу отменили. Говорят, что поле слишком мокрое.',
        ky: 'Дагы бир кабар: ишембидеги футбол оюну жокко чыгарылды. Талаа өтө нымдуу деп айтышат.',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Wann wird das Spiel nachgeholt?',
        ru: 'Когда матч сыграют заново?',
        ky: 'Оюн качан кайра өткөрүлөт?',
      },
      {
        speaker: 'Frau Ott',
        text: 'Das ist noch nicht bekannt. Wenn wir mehr wissen, finden Sie neue Informationen auf unserer Webseite.',
        ru: 'Это пока неизвестно. Если мы узнаем больше, вы найдёте новую информацию на нашем сайте.',
        ky: 'Бул азырынча белгисиз. Көбүрөөк билсек, жаңы маалыматты сайтыбыздан таба аласыз.',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Das waren die Nachrichten. Danke fürs Zuhören und einen schönen Tag.',
        ru: 'Это были новости. Спасибо, что слушали, и хорошего дня.',
        ky: 'Жаңылыктар ушулар болду. Уккан үчүн рахмат жана жакшы күн каалайбыз.',
      },
    ],
    questions: [
      { q: 'Wann wurde die neue Brücke eröffnet?', options: ['Gestern.', 'Heute.', 'Vor einem Jahr.'], answer: 0 },
      { q: 'Was kostete die Brücke?', options: ['Zwei Millionen Euro.', 'Drei Millionen Euro.', 'Zwölf Millionen Euro.'], answer: 1 },
      {
        q: 'Warum wurde das Fußballspiel abgesagt?',
        options: ['Es heißt, dass der Trainer krank geworden ist.', 'Es gibt kein Geld.', 'Es heißt, dass der Platz zu nass ist.'],
        answer: 2,
      },
      { q: 'Wie ist das Wetter am Nachmittag?', options: ['Es schneit.', 'Es regnet.', 'Es ist sonnig.'], answer: 1 },
    ],
    keywords: ['Meldung', 'Journalist', 'Redaktion', 'veröffentlichen'],
    source: UNIT_26_SOURCE,
  },
  {
    id: 'b1-li-26-02',
    unit: 26,
    level: 'B1',
    title: 'Im Handyshop',
    lines: [
      {
        speaker: 'Herr Lutz',
        text: 'Guten Tag, was kann ich für Sie tun?',
        ru: 'Добрый день, чем могу вам помочь?',
        ky: 'Кайырлуу күн, мен сизге эмне кыла алам?',
      },
      {
        speaker: 'Frau Neumann',
        text: 'Guten Tag. Mein Bildschirm ist kaputt, und der Akku hält nicht mehr lange. Ich möchte das Handy reparieren lassen.',
        ru: 'Добрый день. У меня разбит экран, и аккумулятор держит недолго. Я хочу отдать телефон в ремонт.',
        ky: 'Кайырлуу күн. Менин экраным сынган, батарея да көпкө чыдабайт. Мен телефонду оңдотким келет.',
      },
      {
        speaker: 'Herr Lutz',
        text: 'Das ist möglich. Der Bildschirm muss ausgetauscht werden, und den Akku können wir auch prüfen.',
        ru: 'Это возможно. Экран нужно заменить, и аккумулятор мы тоже можем проверить.',
        ky: 'Бул мүмкүн. Экранды алмаштыруу керек, батареяны да текшере алабыз.',
      },
      {
        speaker: 'Frau Neumann',
        text: 'Wie lange dauert die Reparatur, und was kostet sie?',
        ru: 'Сколько длится ремонт и сколько он стоит?',
        ky: 'Оңдоо канча убакытка созулат жана канча турат?',
      },
      {
        speaker: 'Herr Lutz',
        text: 'Drei Tage. Die Reparatur kostet 89 Euro. Sie können das Handy am Freitag abholen.',
        ru: 'Три дня. Ремонт стоит 89 евро. Телефон вы можете забрать в пятницу.',
        ky: 'Үч күн. Оңдоо 89 евро турат. Телефонду жумада алып кете аласыз.',
      },
      {
        speaker: 'Frau Neumann',
        text: 'Und meine Daten? Sie sollten nicht gelöscht werden.',
        ru: 'А мои данные? Их не стоило бы удалять.',
        ky: 'Ал эми менин маалыматтарым? Аларды өчүрбөш керек.',
      },
      {
        speaker: 'Herr Lutz',
        text: 'Keine Sorge. Wir speichern alle Daten vorher. Das Passwort muss aber geändert werden, wenn Sie das Handy abholen.',
        ru: 'Не волнуйтесь. Мы заранее сохраняем все данные. Но пароль нужно будет изменить, когда вы заберёте телефон.',
        ky: 'Тынчсызданбаңыз. Биз бардык маалыматты алдын ала сактайбыз. Бирок телефонду алганда сыр сөздү өзгөртүү керек.',
      },
      {
        speaker: 'Frau Neumann',
        text: 'Mein Mann sagt, dass die Reparatur im Internet billiger ist. Stimmt das?',
        ru: 'Мой муж говорит, что ремонт в интернете дешевле. Это правда?',
        ky: 'Күйөөм интернетте оңдоо арзан дейт. Бул туурабы?',
      },
      {
        speaker: 'Herr Lutz',
        text: 'Das kann ich nicht sagen. Aber der Kundendienst der Firma gibt Ihnen eine Garantie.',
        ru: 'Этого я сказать не могу. Но служба поддержки фирмы даёт вам гарантию.',
        ky: 'Муну мен айта албайм. Бирок фирманын тейлөө кызматы сизге кепилдик берет.',
      },
      {
        speaker: 'Frau Neumann',
        text: 'Gut, dann lasse ich es hier reparieren. Vielen Dank.',
        ru: 'Хорошо, тогда я отдам его в ремонт здесь. Большое спасибо.',
        ky: 'Жакшы, анда мен аны ушул жерде оңдотом. Чоң рахмат.',
      },
      {
        speaker: 'Herr Lutz',
        text: 'Gern geschehen. Bis Freitag, Frau Neumann.',
        ru: 'Пожалуйста. До пятницы, госпожа Нойман.',
        ky: 'Эч нерсе эмес. Жумага чейин, Нойман айым.',
      },
    ],
    questions: [
      { q: 'Was muss am Handy ausgetauscht werden?', options: ['Der Bildschirm.', 'Das Ladegerät.', 'Die Tasche.'], answer: 0 },
      { q: 'Was kostet die Reparatur?', options: ['19 Euro.', '99 Euro.', '89 Euro.'], answer: 2 },
      {
        q: 'Wann kann Frau Neumann das Handy abholen?',
        options: ['Am Montag.', 'Am Freitag.', 'Am Mittwoch.'],
        answer: 1,
      },
      {
        q: 'Was sagt Frau Neumanns Mann über die Reparatur?',
        options: ['Sie ist im Internet billiger.', 'Sie dauert zu lange.', 'Sie ist nicht nötig.'],
        answer: 0,
      },
    ],
    keywords: ['Bildschirm', 'Akku', 'Passwort', 'Kundendienst'],
    source: UNIT_26_SOURCE,
  },
]

export const UNIT_26_READING: ReadingText[] = [
  {
    id: 'b1-re-26-01',
    unit: 26,
    level: 'B1',
    title: 'Eine Meldung und ein Leserkommentar (erfunden)',
    body: [
      'Erfundene Meldung für den Deutschkurs: Die Stadtbibliothek von Grünfeld wurde gestern nach einem Jahr wieder eröffnet. Ein neuer Eingang wurde gebaut, und neue Bücher können jetzt auch digital ausgeliehen werden. Das WLAN ist kostenlos. Außerdem gibt es jeden Mittwoch einen Lesekreis für Kinder, und viele Familien kommen mit ihren Kindern. Laut der Stadt kommen jeden Tag mehr Besucher, obwohl die Bibliothek ein Jahr geschlossen war. Die steigenden Besucherzahlen freuen den Bürgermeister.',
      'Leserkommentar von Jana: Ich finde die Meldung gut, aber eine Frage bleibt: Wer bezahlt das alles? Es heißt, dass die Stadt viel Geld ausgegeben hat. Das ist nur ein Gerücht, aber ich möchte die Zahlen sehen, bevor ich es glaube. Mein Nachbar sagt, dass die Bibliothek jetzt länger geöffnet ist. Ich werde das auf der Webseite überprüfen. Man sollte Nachrichten immer kritisch lesen und mehrere Quellen vergleichen. Eine einzige Zeitung ist für mich nicht genug. Eine Bibliothek, die Bücher und Internet anbietet, ist für viele Menschen wichtig.',
    ],
    gloss: [
      {
        word: 'wurde … eröffnet / wurde … gebaut',
        ru: 'была открыта / был построен (Passiv Präteritum)',
        ky: 'ачылды / курулду (Passiv Präteritum)',
        example: 'Die Zeitung wurde vor hundert Jahren gegründet.',
        grammar: 'Passiv Präteritum: wurde + Partizip II в конце',
        grammarKy: 'Passiv Präteritum: wurde + аягында Partizip II',
        related: [],
      },
      {
        word: 'können … ausgeliehen werden',
        ru: 'можно взять на время (Passiv с модальным глаголом)',
        ky: 'убактылуу алууга болот (модаль этиш менен Passiv)',
        example: 'Das Handy muss repariert werden.',
        grammar: 'модальный глагол + Partizip II + werden в конце',
        grammarKy: 'модаль этиш + Partizip II + аягында werden',
        related: [],
      },
      {
        word: 'die steigenden Besucherzahlen',
        ru: 'растущее число посетителей (Partizip как прилагательное, только для понимания)',
        ky: 'көбөйүп жаткан келүүчүлөрдүн саны (сын атооч катары Partizip, түшүнүү үчүн гана)',
        example: 'Die steigenden Preise sind ein Problem.',
        grammar: 'steigen → steigend: «растущий»; в этом юните только для чтения',
        grammarKy: 'steigen → steigend: «көбөйүп жаткан»; бул бөлүмдө окуу үчүн гана',
        related: [],
      },
      {
        word: 'Es heißt, dass …',
        ru: 'Говорят, что … (слух, источник неизвестен)',
        ky: '… деп айтышат (имиш-аякта, булагы белгисиз)',
        example: 'Es heißt, dass es morgen regnet.',
        grammar: 'Es heißt, dass + глагол в конце; это ещё не проверенный факт',
        grammarKy: 'Es heißt, dass + аягында этиш; бул дагы текшерилбеген факт',
        related: [],
      },
    ],
    questions: [
      { q: 'Wann wurde die Bibliothek wieder eröffnet?', options: ['Vor einem Jahr.', 'Gestern.', 'Nächste Woche.'], answer: 1 },
      { q: 'Was können Leser jetzt digital machen?', options: ['Bücher ausleihen.', 'Bücher kaufen.', 'Bücher schreiben.'], answer: 0 },
      { q: 'Aussage: Jana hält es für ein Gerücht, dass die Stadt viel Geld ausgegeben hat.', options: ['richtig', 'falsch', 'steht nicht im Text'], answer: 0 },
    ],
    source: UNIT_26_SOURCE,
  },
  {
    id: 'b1-re-26-02',
    unit: 26,
    level: 'B1',
    title: 'Ein Film, den ich empfehle (erfunden)',
    body: [
      'Filmtipp: „Der letzte Zug“ (ein erfundener Film). Die Handlung ist einfach: Die Hauptfigur Mia verpasst nachts den letzten Zug und muss in einer fremden Stadt bis zum Morgen warten. Dort trifft sie einen alten Mann, der ihr eine Geschichte erzählt. Die Geschichte lässt sich in zwei Sätzen erklären, aber der Film hat viel Spannung. Der Film läuft seit zwei Wochen und hat eine ruhige Musik.',
      'Der Schauspieler, der den alten Mann spielt, ist großartig. Ich habe ihn mit einer Freundin gesehen, und wir haben danach lange geredet. Das Kino war fast voll. Das Ende habe ich nicht erwartet. Laut den Kritikern in der Zeitung ist der Film zu langsam; ich finde das nicht. Es heißt, dass der Film im Kino und im Stream gezeigt wird. Ich würde ihn allen empfehlen, die ruhige Filme mögen. Aber jeder sollte selbst entscheiden: Eine Meinung ist keine Tatsache.',
    ],
    gloss: [
      {
        word: 'lässt sich … erklären',
        ru: 'можно объяснить (sich lassen: «можно», только для понимания)',
        ky: 'түшүндүрүүгө болот (sich lassen: «мүмкүн», түшүнүү үчүн гана)',
        example: 'Das Problem lässt sich lösen.',
        grammar: 'sich lassen + инфинитив = «можно сделать»; в этом юните только для чтения',
        grammarKy: 'sich lassen + инфинитив = «жасоого болот»; бул бөлүмдө окуу үчүн гана',
        related: [],
      },
      {
        word: 'Laut den Kritikern',
        ru: 'По мнению критиков (laut + Dativ)',
        ky: 'Сынчылардын айтуусунча (laut + Dativ)',
        example: 'Laut dem Bericht kommen mehr Besucher.',
        grammar: 'laut + Dativ множественного числа: die Kritiker → den Kritikern',
        grammarKy: 'laut + көптүк санда Dativ: die Kritiker → den Kritikern',
        related: [],
      },
      {
        word: 'Eine Meinung ist keine Tatsache.',
        ru: 'Мнение — это не факт.',
        ky: 'Пикир — бул факт эмес.',
        example: 'Das ist nur meine Meinung.',
        grammar: 'Meinung = что человек думает; Tatsache = то, что можно проверить',
        grammarKy: 'Meinung = адам эмне ойлойт; Tatsache = текшерүүгө боло турган нерсе',
        related: [],
      },
      {
        word: 'würde … empfehlen',
        ru: 'я бы посоветовал (Konjunktiv II, юнит 25)',
        ky: 'мен сунуштамакмын (Konjunktiv II, 25-бөлүм)',
        example: 'Ich würde dir den Film empfehlen.',
        grammar: 'würde + инфинитив в конце',
        grammarKy: 'würde + аягында инфинитив',
        related: [],
      },
    ],
    questions: [
      {
        q: 'Was passiert mit der Hauptfigur Mia?',
        options: ['Sie verliert nachts ihr Handy im Zug.', 'Sie gewinnt eine Reise.', 'Sie verpasst den letzten Zug.'],
        answer: 2,
      },
      { q: 'Aussage: Die Autorin stimmt den Kritikern zu, dass der Film zu langsam ist.', options: ['richtig', 'falsch', 'steht nicht im Text'], answer: 1 },
      {
        q: 'Wem würde die Autorin den Film empfehlen?',
        options: ['Allen, die ruhige Filme mögen.', 'Nur Kindern.', 'Niemandem.'],
        answer: 0,
      },
    ],
    source: UNIT_26_SOURCE,
  },
]

export const UNIT_26_SPEAKING: SpeakingScenario[] = [
  {
    id: UNIT_26_SPEAKING_ID,
    title: 'Einen Film empfehlen',
    titleRu: 'Порекомендовать фильм',
    titleKy: 'Тасманы сунуштоо',
    icon: '🎬',
    level: 'B1',
    goal: {
      ru: 'Подруга Лена спрашивает, какой фильм посмотреть. Расскажите, о чём фильм, назовите своё впечатление и порекомендуйте его. В середине разговора Лена сообщает, что «в сети пишут» о фильме плохо: отличите мнение от факта. Фильм вымышленный.',
      ky: 'Курбуңуз Лена кайсы тасманы көрүү керектигин сурайт. Тасма эмне жөнүндө экенин айтып, өз таасириңизди билдирип, аны сунуштаңыз. Сүйлөшүүнүн ортосунда Лена тармакта тасма жөнүндө жаман жазышканын айтат: пикир менен фактыны айырыңыз. Тасма ойдон чыгарылган.',
    },
    turns: [
      {
        ai: 'Hallo! Hast du in letzter Zeit einen guten Film gesehen?',
        aiRu: 'Привет! Ты в последнее время смотрел хороший фильм?',
        aiKy: 'Салам! Сен акыркы убакта жакшы тасма көрдүңбү?',
        hints: [
          'Ja, ich habe „Der letzte Zug“ gesehen.',
          'Der Film hat eine spannende Handlung.',
          'Ich kann ihn dir empfehlen.',
        ],
        keywords: ['film', 'gesehen', 'handlung', 'empfehlen'],
      },
      {
        ai: 'Was passiert in dem Film?',
        aiRu: 'Что происходит в фильме?',
        aiKy: 'Тасмада эмне болот?',
        hints: [
          'Die Hauptfigur verpasst den letzten Zug.',
          'Sie trifft einen alten Mann.',
          'Am Ende erzählt er ihr eine Geschichte.',
        ],
        keywords: ['hauptfigur', 'zug', 'mann', 'geschichte'],
      },
      {
        ai: 'Und wie hat dir der Film gefallen?',
        aiRu: 'И как тебе понравился фильм?',
        aiKy: 'Ал эми тасма сага кандай жакты?',
        hints: [
          'Mir hat die Spannung gefallen.',
          'Der Schauspieler war großartig.',
          'Ich finde die Handlung einfach, aber gut.',
        ],
        keywords: ['spannung', 'schauspieler', 'finde', 'handlung'],
      },
      {
        ai: 'Im Netz heißt es, dass der Film langweilig ist. Das habe ich in einem Kommentar gelesen. Stimmt das?',
        aiRu: 'В сети пишут, что фильм скучный. Я прочитала это в комментарии. Это правда?',
        aiKy: 'Тармакта тасма зериктирет деп жазышат. Муну мен комментарийден окудум. Бул туурабы?',
        hints: [
          'Das ist nur eine Meinung, keine Tatsache.',
          'Laut der Zeitung ist der Film zu langsam, aber ich finde das nicht.',
          'Moment, ich überlege kurz. Wer hat das geschrieben?',
        ],
        keywords: ['meinung', 'tatsache', 'laut', 'zeitung'],
      },
      {
        ai: 'Okay, ich schaue ihn mir an. Wo kann ich den Film sehen?',
        aiRu: 'Хорошо, я посмотрю его. Где можно посмотреть этот фильм?',
        aiKy: 'Макул, мен аны көрөм. Бул тасманы кайдан көрсө болот?',
        hints: [
          'Der Film wird im Kino und im Stream gezeigt.',
          'Er kann im Stream angesehen werden.',
          'Ich schicke dir den Link.',
        ],
        keywords: ['kino', 'stream', 'gezeigt', 'link'],
      },
      {
        ai: 'Danke für die Empfehlung! Soll ich dir danach schreiben, wie er war?',
        aiRu: 'Спасибо за рекомендацию! Мне написать тебе потом, какой он был?',
        aiKy: 'Сунуш үчүн рахмат! Кийин сага тасма кандай экенин жазайынбы?',
        hints: [
          'Ja, gern. Schreib mir deine Meinung.',
          'Dann reden wir am Wochenende.',
          'Ich bin gespannt, was du sagst.',
        ],
        keywords: ['gern', 'meinung', 'wochenende', 'gespannt'],
      },
    ],
    source: UNIT_26_SOURCE,
  },
]

export const UNIT_26_WRITING: WritingTask[] = [
  {
    id: 'b1-wr-26-01',
    unit: 26,
    level: 'B1',
    title: 'Ein Kommentar zu einem Medienthema',
    situation: {
      ru: 'В интернет-статье о социальных сетях читатели оставляют комментарии. Напишите свой комментарий: назовите тему, выскажите мнение с причиной, назовите один плюс и один минус, передайте чужие слова или источник («Laut dem Artikel …», «Es heißt, dass …»), используйте один Passiv с модальным глаголом и одно выражение с lassen. Не меньше 80 слов. Статья придумана: не выдавайте слухи за факты.',
      ky: 'Социалдык тармактар жөнүндөгү интернет макаласына окурмандар комментарий калтырышат. Өз комментарийиңизди жазыңыз: теманы атаңыз, пикириңизди себеби менен айтыңыз, бир артыкчылык жана бир кемчиликти атаңыз, башкалардын сөзүн же булакты айтып бериңиз («Laut dem Artikel …», «Es heißt, dass …»), модаль этиш менен бир Passiv жана lassen менен бир туюндурма колдонуңуз. Кеминде 80 сөз. Макала ойдон чыгарылган: имиш-аякта сөздөрдү факт катары бербеңиз.',
    },
    formal: false,
    minWords: 80,
    mustInclude: [
      {
        label: 'Das Thema (Ich möchte etwas zum Artikel über … sagen)',
        patterns: ['artikel', 'thema', 'netzwerk', 'medien'],
        explain: {
          ru: 'Скажите, к какой теме или статье вы пишете.',
          ky: 'Кайсы теманы же макаланы талкуулап жатканыңызды айтыңыз.',
        },
      },
      {
        label: 'Meinung mit Grund (Ich finde, dass …, weil …)',
        patterns: ['ich finde', 'ich denke', 'ich glaube', 'weil', 'denn'],
        explain: {
          ru: 'Ваше мнение и причина: Ich finde, dass …, weil …',
          ky: 'Пикириңиз жана себеби: Ich finde, dass …, weil …',
        },
      },
      {
        label: 'Ein Vorteil und ein Nachteil (Ein Vorteil ist … / Ein Nachteil ist …)',
        patterns: ['vorteil', 'nachteil'],
        explain: {
          ru: 'Дайте сбалансированную оценку: один плюс и один минус.',
          ky: 'Тең салмактуу баа бериңиз: бир артыкчылык жана бир кемчилик.',
        },
      },
      {
        label: 'Wiedergeben (Laut dem Artikel … / Es heißt, dass … / … sagt, dass …)',
        patterns: ['laut ', 'es heißt', 'sagt, dass', 'schreibt, dass', 'steht, dass'],
        explain: {
          ru: 'Передайте чужие слова или назовите источник: laut + Dativ, Es heißt, dass …, … sagt, dass … (глагол в конце).',
          ky: 'Башкалардын сөзүн айтып бериңиз же булакты атаңыз: laut + Dativ, Es heißt, dass …, … sagt, dass … (этиш аягында).',
        },
      },
      {
        label: 'Passiv mit Modalverb (… muss geprüft werden / … kann gelöscht werden)',
        patterns: [' werden.', ' werden,'],
        explain: {
          ru: 'Одно предложение с модальным глаголом, Partizip II и werden в конце.',
          ky: 'Модаль этиш, Partizip II жана аягындагы werden менен бир сүйлөм.',
        },
      },
      {
        label: 'lassen (Ich lasse mein Passwort ändern / … prüfen)',
        patterns: ['lasse ', 'lässt ', 'lassen'],
        explain: {
          ru: 'Одно предложение с lassen + инфинитив из списка юнита.',
          ky: 'Бөлүмдүн тизмесиндеги lassen + инфинитив менен бир сүйлөм.',
        },
      },
    ],
    model:
      'Hallo zusammen, ich möchte etwas zum Artikel über soziale Netzwerke sagen. Ich finde, dass soziale Netzwerke viele Vorteile haben, weil man schnell mit Freunden sprechen kann. Ein Nachteil ist, dass viele private Daten gespeichert werden. Laut dem Artikel nutzen immer mehr junge Leute ihr Handy täglich vier Stunden. Es heißt, dass Nachrichten im Netz oft nicht geprüft werden. Deshalb muss jede Meldung kritisch gelesen werden. Mein Passwort lasse ich regelmäßig ändern, und mein Handy lasse ich beim Kundendienst prüfen, wenn der Akku schlecht ist. Was meint ihr?',
    tips: [
      {
        ru: 'Начните с темы и мнения: «Ich möchte etwas zum Artikel … sagen. Ich finde, dass …, weil …». Покажите обе стороны: «Ein Vorteil ist …, ein Nachteil ist …».',
        ky: 'Теманы жана пикирди айтып баштаңыз: «Ich möchte etwas zum Artikel … sagen. Ich finde, dass …, weil …». Эки жагын көрсөтүңүз: «Ein Vorteil ist …, ein Nachteil ist …».',
      },
      {
        ru: 'Передавая чужие слова, называйте источник: «Laut dem Artikel …», «Es heißt, dass …». Отделяйте факт («Tatsache») от слуха и мнения.',
        ky: 'Башкалардын сөзүн айтып бергенде булакты атаңыз: «Laut dem Artikel …», «Es heißt, dass …». Фактыны («Tatsache») имиш-аякта сөздөн жана пикирден айырыңыз.',
      },
      {
        ru: 'Passiv с модальным глаголом: «… muss geprüft werden» — werden в самом конце. Lassen: «Ich lasse mein Handy prüfen» — инфинитив без zu в конце.',
        ky: 'Модаль этиш менен Passiv: «… muss geprüft werden» — werden эң аягында. Lassen: «Ich lasse mein Handy prüfen» — аягында zu жок инфинитив.',
      },
      {
        ru: 'После написания пройдите по списку ниже и оцените себя сами: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
        ky: 'Жазып бүткөндөн кийин төмөнкү тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
      },
    ],
    source: UNIT_26_SOURCE,
  },
  {
    id: 'b1-wr-26-02',
    unit: 26,
    level: 'B1',
    title: 'Meine Meinung: Soziale Netzwerke',
    situation: {
      ru: 'В чате курса обсуждают социальные сети. Напишите короткий комментарий: ваше мнение и причина, и одно слово по теме (например, Datenschutz, Nutzer, Werbung). Не меньше 30 слов. Это небольшое задание на мнение и аргумент: оцените и плюсы, и минусы.',
      ky: 'Курстун чатында социалдык тармактар талкууланып жатат. Кыска комментарий жазыңыз: пикириңиз жана себеби, жана теманы билдирген бир сөз (мисалы, Datenschutz, Nutzer, Werbung). Кеминде 30 сөз. Бул пикирди жана далилди айтуу боюнча кичинекей тапшырма: артыкчылыктарды да, кемчиликтерди да баалаңыз.',
    },
    formal: false,
    minWords: 30,
    mustInclude: [
      {
        label: 'Eigene Meinung (Ich finde, dass … / Ich denke, dass …)',
        patterns: ['ich finde', 'ich denke', 'ich glaube', 'meiner meinung nach'],
        explain: {
          ru: 'Одно предложение с вашим мнением: Ich finde, dass … или Ich denke, dass …',
          ky: 'Пикириңизди билдирген бир сүйлөм: Ich finde, dass … же Ich denke, dass …',
        },
      },
      {
        label: 'Ein Grund (… , weil … / … , denn …)',
        patterns: ['weil', 'denn', 'deshalb'],
        explain: {
          ru: 'Причина вашего мнения: weil (глагол в конце) или denn (порядок слов обычный).',
          ky: 'Пикириңиздин себеби: weil (этиш аягында) же denn (сөздөрдүн иреттери адаттагыдай).',
        },
      },
      {
        label: 'Ein Wort zum Thema (Netzwerk, Datenschutz, Nutzer, Werbung, Passwort)',
        patterns: ['netzwerk', 'datenschutz', 'nutzer', 'werbung', 'passwort', 'internet', 'handy'],
        explain: {
          ru: 'Хотя бы одно слово по теме: сеть, защита данных, пользователь, реклама, пароль.',
          ky: 'Темага байланыштуу жок дегенде бир сөз: тармак, маалыматты коргоо, колдонуучу, жарнама, сыр сөз.',
        },
      },
    ],
    model:
      'Ich finde, dass soziale Netzwerke nützlich sind, weil man Freunde in anderen Ländern sehen kann. Ich denke aber auch, dass man beim Datenschutz vorsichtig sein muss, denn viele Nutzer zeigen zu viel Privates. Mit einem guten Passwort fühle ich mich sicherer.',
    tips: [
      {
        ru: 'Начните с мнения: «Ich finde, dass …». Дайте причину с weil (глагол в конце) или denn. Назовите один плюс и один минус.',
        ky: 'Пикирден баштаңыз: «Ich finde, dass …». weil (этиш аягында) же denn менен себебин айтыңыз. Бир артыкчылык жана бир кемчиликти атаңыз.',
      },
      {
        ru: 'Используйте слова юнита: Netzwerk, Datenschutz, Nutzer, Werbung, Passwort, kritisch.',
        ky: 'Бөлүмдүн сөздөрүн колдонуңуз: Netzwerk, Datenschutz, Nutzer, Werbung, Passwort, kritisch.',
      },
      {
        ru: 'После написания оцените себя сами по списку: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
        ky: 'Жазып бүткөндөн кийин тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
      },
    ],
    source: UNIT_26_SOURCE,
  },
  {
    id: 'b1-wr-26-03',
    unit: 26,
    level: 'B1',
    title: 'Eine Nachricht weitergeben',
    situation: {
      ru: 'Вы получили сообщение от магазина (вымышленное): «Guten Tag Frau Neumann, Ihr Handy wurde repariert. Sie können es ab Freitag abholen. Die Reparatur kostet 89 Euro. Bitte bringen Sie Ihren Ausweis mit.» Расскажите подруге по-немецки своими словами, что написал магазин: используйте «Der Laden schreibt, dass …». Не меньше 30 слов. Это небольшое задание на пересказ (медиация): вы передаёте информацию, а не оцениваете.',
      ky: 'Сиз дүкөндөн билдирүү алдыңыз (ойдон чыгарылган): «Guten Tag Frau Neumann, Ihr Handy wurde repariert. Sie können es ab Freitag abholen. Die Reparatur kostet 89 Euro. Bitte bringen Sie Ihren Ausweis mit.» Дүкөн эмне жазганын курбуңузга немисче өз сөзүңүз менен айтып бериңиз: «Der Laden schreibt, dass …» колдонуңуз. Кеминде 30 сөз. Бул кайра айтып берүү (медиация) боюнча кичинекей тапшырма: сиз маалыматты өткөрөсүз, баалабайсыз.',
    },
    formal: false,
    minWords: 30,
    mustInclude: [
      {
        label: 'Wiedergeben (Der Laden schreibt, dass …)',
        patterns: ['schreibt, dass', 'sagt, dass', 'schreibt', 'laut '],
        explain: {
          ru: 'Передайте сообщение с «schreibt, dass …»: глагол в конце, ich → er / sie.',
          ky: 'Билдирүүнү «schreibt, dass …» менен айтып бериңиз: этиш аягында, ich → er / sie.',
        },
      },
      {
        label: 'Der Tag (Freitag)',
        patterns: ['freitag'],
        explain: { ru: 'Назовите день, когда можно забрать телефон.', ky: 'Телефонду алып кетүүгө боло турган күндү атаңыз.' },
      },
      {
        label: 'Der Preis (89 Euro)',
        patterns: ['89'],
        explain: { ru: 'Назовите цену ремонта.', ky: 'Оңдоонун баасын атаңыз.' },
      },
      {
        label: 'Der Ausweis (Ich soll den Ausweis mitbringen)',
        patterns: ['ausweis'],
        explain: { ru: 'Не забудьте про документ, который нужно взять.', ky: 'Өзүң менен алып баруу керек болгон документти унутпаңыз.' },
      },
    ],
    model:
      'Der Laden schreibt, dass mein Handy repariert ist. Ich kann es ab Freitag abholen. Die Reparatur kostet 89 Euro, und ich soll meinen Ausweis mitbringen. Ich gehe am Freitag nach der Arbeit hin. Möchtest du mitkommen?',
    tips: [
      {
        ru: 'Передавайте только содержание сообщения: день, цену, документ. Начните с «Der Laden schreibt, dass …», глагол — в конце.',
        ky: 'Билдирүүнүн мазмунун гана өткөрүңүз: күн, баа, документ. «Der Laden schreibt, dass …» менен баштаңыз, этиш — аягында.',
      },
      {
        ru: 'Меняйте местоимения: «Ihr Handy» → «mein Handy», «Sie können» → «ich kann». Время не меняется.',
        ky: 'Ат атоочторду алмаштырыңыз: «Ihr Handy» → «mein Handy», «Sie können» → «ich kann». Чак өзгөрбөйт.',
      },
      {
        ru: 'После написания оцените себя сами по списку: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
        ky: 'Жазып бүткөндөн кийин тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
      },
    ],
    source: UNIT_26_SOURCE,
  },
]
