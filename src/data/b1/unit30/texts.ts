import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_30_SOURCE, UNIT_30_SPEAKING_ID } from './unit'

/**
 * Unit 30 texts: 2 listening scripts (an interview with the head of an association; a residents' meeting), 2 readings (a report on a neighbourhood association; two letters
 * to the editor with different views on one project), 1 speaking scenario (a short structured talk with a respectful objection) and 3 writing tasks (the main letter to the
 * editor / association text and TWO short micro-tasks: an opinion and a message to the neighbours). Targets of the band for Units 30–31 and the curriculum text for Unit 30:
 * reading 180–220 words, listening 160–190, sentences ≤ 26 words (95th percentile ≤ 20), 7 speaking turns, writing 90 words.
 * Original material; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native speaker.
 * ALL associations, neighbourhoods, projects and people are FICTIONAL and labelled so. A community question is shown with at least two fair views (Herr Brandt / Frau Lindner);
 * no opinion is stated as a fact and no group (generation, nationality, family model) is described by a stereotype.
 * Scope guard (curriculum v2): Nomen-Verb-Verbindungen only from the closed list of 20 (eine Entscheidung treffen, Kontakt aufnehmen, in Kontakt bleiben, Verantwortung übernehmen,
 * einen Beitrag leisten, Hilfe leisten, Rücksicht nehmen, zur Verfügung stehen, zur Verfügung stellen, in Frage kommen, eine Rolle spielen, Interesse zeigen, Bescheid geben,
 * Stellung nehmen, zur Sprache kommen, Unterstützung finden, einen Vorschlag machen, in Anspruch nehmen, Erfahrungen sammeln, eine Frage stellen); sodass / so … dass / damit /
 * um … zu; the text-structuring words only from the closed list (erstens, zweitens, außerdem, darüber hinaus, dennoch, daher, zum Beispiel). No Genitiv attribute (receptive,
 * Unit 29), no Zustandspassiv, no formal-register Konjunktiv II of the past, no Passiv Perfekt, no `ohne … zu`, no other connectors (allerdings, jedoch, somit, folglich, demnach, hingegen).
 * Listening: the dialogues are played with the browser's text-to-speech (the existing mechanism of the listening lab). That playback has NOT been
 * verified on real devices, so no final-test item depends on audio.
 */
export const UNIT_30_LISTENING: ListeningExercise[] = [
  {
    id: 'b1-li-30-01',
    unit: 30,
    level: 'B1',
    title: 'Interview mit der Vereinsvorsitzenden (erfunden)',
    lines: [
      {
        speaker: 'Herr Voss',
        text: 'Frau Weiß, Sie leiten den Verein „Nachbarn helfen Nachbarn“. Wie hat alles angefangen?',
        ru: 'Госпожа Вайс, вы возглавляете объединение «Соседи помогают соседям». С чего всё началось?',
        ky: 'Вайс айым, сиз «Кошуналар кошуналарга жардам берет» бирикмесин жетектейсиз. Баары кандай башталды?',
      },
      {
        speaker: 'Frau Weiß',
        text: 'Vor drei Jahren haben wir den Verein gegründet, damit ältere Nachbarn nicht allein sind. Heute haben wir fast hundert Mitglieder.',
        ru: 'Три года назад мы основали объединение, чтобы пожилые соседи не были одни. Сегодня у нас почти сто членов.',
        ky: 'Үч жыл мурун биз улгайган кошуналар жалгыз калбашы үчүн бирикме түздүк. Бүгүн бизде жүзгө жакын мүчө бар.',
      },
      {
        speaker: 'Herr Voss',
        text: 'Was machen Ihre Mitglieder genau?',
        ru: 'Что именно делают ваши члены?',
        ky: 'Сиздин мүчөлөр так эмне кылышат?',
      },
      {
        speaker: 'Frau Weiß',
        text: 'Erstens bringen wir Essen. Außerdem helfen wir bei Briefen von Ämtern. Zum Beispiel haben wir gestern einem Herrn geholfen, einen Antrag auszufüllen.',
        ru: 'Во-первых, мы приносим еду. Кроме того, мы помогаем с письмами из учреждений. Например, вчера мы помогли одному господину заполнить заявление.',
        ky: 'Биринчиден, биз тамак алып барабыз. Мындан тышкары, мекемелерден келген каттарга жардам беребиз. Мисалы, кечээ бир мырзага арыз толтурууга жардам бердик.',
      },
      {
        speaker: 'Herr Voss',
        text: 'Wie finden Sie neue Freiwillige?',
        ru: 'Как вы находите новых добровольцев?',
        ky: 'Жаңы ыктыярчыларды кантип табасыз?',
      },
      {
        speaker: 'Frau Weiß',
        text: 'Viele kommen durch Freunde. Andere sehen unser Plakat im Treffpunkt und fragen nach.',
        ru: 'Многие приходят через друзей. Другие видят наш плакат в месте встреч и спрашивают.',
        ky: 'Көптөр достору аркылуу келет. Башкалар жолугушуу жайындагы плакатты көрүп, сурашат.',
      },
      {
        speaker: 'Herr Voss',
        text: 'Machen alle freiwillig mit?',
        ru: 'Все участвуют добровольно?',
        ky: 'Баары ыктыярдуу катышабы?',
      },
      {
        speaker: 'Frau Weiß',
        text: 'Ja, alle arbeiten ehrenamtlich. Manchmal ist es so viel, dass die Leute müde werden. Dennoch bleiben die meisten dabei.',
        ru: 'Да, все работают на добровольных началах. Иногда дел так много, что люди устают. Всё же большинство остаётся.',
        ky: 'Ооба, баары ыктыярдуу негизде иштейт. Кээде иш ушунчалык көп болгондуктан, адамдар чарчашат. Ошентсе да көпчүлүгү калат.',
      },
      {
        speaker: 'Herr Voss',
        text: 'Das klingt nach viel Arbeit.',
        ru: 'Звучит как много работы.',
        ky: 'Көп иш болуп угулат.',
      },
      {
        speaker: 'Frau Weiß',
        text: 'Das stimmt, aber jede Hilfe zählt, auch eine Stunde im Monat. Niemand muss mehr machen, als er möchte.',
        ru: 'Это так, но любая помощь важна, даже час в месяц. Никто не обязан делать больше, чем хочет.',
        ky: 'Бул чын, бирок ар бир жардам маанилүү, айына бир саат болсо да. Эч ким каалагандан көп кылууга милдеттүү эмес.',
      },
      {
        speaker: 'Herr Voss',
        text: 'Was ist Ihnen besonders wichtig?',
        ru: 'Что для вас особенно важно?',
        ky: 'Сиз үчүн эмне өзгөчө маанилүү?',
      },
      {
        speaker: 'Frau Weiß',
        text: 'Rücksicht und Toleranz. Wir haben Mitglieder mit ganz verschiedenen Familienmodellen. Daher hören wir einander zu, bevor wir eine Entscheidung treffen.',
        ru: 'Внимание к другим и терпимость. У нас есть члены с совершенно разными моделями семьи. Поэтому мы выслушиваем друг друга, прежде чем принять решение.',
        ky: 'Башкаларды эске алуу жана чыдамкайлык. Бизде үй-бүлө үлгүлөрү такыр башка мүчөлөр бар. Ошондуктан биз чечим кабыл алуудан мурун бири-бирибизди угабыз.',
      },
      {
        speaker: 'Herr Voss',
        text: 'Was wünschen Sie sich für die Zukunft?',
        ru: 'Чего вы желаете на будущее?',
        ky: 'Келечекке эмне каалайсыз?',
      },
      {
        speaker: 'Frau Weiß',
        text: 'Mehr junge Leute, die einen Beitrag leisten. Wer Interesse hat, kann gern Kontakt aufnehmen.',
        ru: 'Больше молодых людей, которые вносят вклад. Кто заинтересован, может связаться с нами.',
        ky: 'Салым кошкон көбүрөөк жаштар. Кимдир бирөө кызыкса, биз менен байланыша алат.',
      },
    ],
    questions: [
      {
        q: 'Warum haben sie den Verein gegründet?',
        options: ['Damit ältere Nachbarn nicht allein sind.', 'Damit sie im Stadtteil mehr Geld verdienen können.', 'Damit die Stadt einen Garten baut.'],
        answer: 0,
      },
      {
        q: 'Was macht der Verein zuerst?',
        options: ['Er organisiert Reisen.', 'Er repariert Wohnungen.', 'Er bringt Essen.'],
        answer: 2,
      },
      {
        q: 'Warum werden manche Mitglieder müde?',
        options: ['Sie sind schon sehr alt.', 'Manchmal ist es sehr viel Arbeit.', 'Sie bekommen kein Material.'],
        answer: 1,
      },
      {
        q: 'Was wünscht sich Frau Weiß für die Zukunft?',
        options: ['Mehr junge Freiwillige.', 'Mehr Spenden von der Stadt.', 'Einen größeren Raum.'],
        answer: 0,
      },
    ],
    keywords: ['Ehrenamt', 'Toleranz', 'Beitrag'],
    source: UNIT_30_SOURCE,
  },
  {
    id: 'b1-li-30-02',
    unit: 30,
    level: 'B1',
    title: 'Eine Anwohnerversammlung (erfunden)',
    lines: [
      {
        speaker: 'Herr Kaya',
        text: 'Guten Abend und willkommen zur Versammlung. Heute sprechen wir über den Hof hinter dem Gemeindehaus.',
        ru: 'Добрый вечер и добро пожаловать на собрание. Сегодня мы говорим о дворе за общинным домом.',
        ky: 'Кайырлуу кеч жана чогулушка кош келиңиздер. Бүгүн биз жамаат үйүнүн арт жагындагы короо жөнүндө сүйлөшөбүз.',
      },
      {
        speaker: 'Frau Lindner',
        text: 'Ich habe eine Frage: Wer übernimmt die Verantwortung, wenn es abends laut wird?',
        ru: 'У меня вопрос: кто берёт ответственность, если вечером становится шумно?',
        ky: 'Менин суроом бар: кечинде ызы-чуу болсо, жоопкерчиликти ким алат?',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Das ist ein berechtigter Einwand. Aber der Hof ist so schön, dass viele Familien ihn nutzen möchten.',
        ru: 'Это обоснованное возражение. Но двор такой красивый, что многие семьи хотят им пользоваться.',
        ky: 'Бул орундуу каршылык. Бирок короо ушунчалык кооз болгондуктан, көптөгөн үй-бүлөлөр аны пайдалангысы келет.',
      },
      {
        speaker: 'Herr Kaya',
        text: 'Beide Meinungen sind wichtig. Wer möchte noch etwas sagen?',
        ru: 'Оба мнения важны. Кто хочет ещё что-то сказать?',
        ky: 'Эки пикир тең маанилүү. Дагы ким бир нерсе айткысы келет?',
      },
      {
        speaker: 'Frau Lindner',
        text: 'Darf ich sagen, was mir wichtig ist? Die Kinder in unserem Haus gehen um acht Uhr schlafen.',
        ru: 'Можно сказать, что для меня важно? Дети в нашем доме ложатся спать в восемь часов.',
        ky: 'Мен үчүн эмне маанилүү экенин айтсам болобу? Биздин үйдөгү балдар саат сегизде жатып калышат.',
      },
      {
        speaker: 'Herr Kaya',
        text: 'Danke, das ist hilfreich. Gibt es einen Vorschlag?',
        ru: 'Спасибо, это полезно. Есть ли предложение?',
        ky: 'Рахмат, бул пайдалуу. Сунуш барбы?',
      },
      {
        speaker: 'Frau Lindner',
        text: 'Erstens brauchen wir feste Zeiten. Zweitens sollten alle Rücksicht nehmen, damit die Kinder schlafen können.',
        ru: 'Во-первых, нам нужны фиксированные часы. Во-вторых, все должны считаться с другими, чтобы дети могли спать.',
        ky: 'Биринчиден, бизге белгилүү убакыт керек. Экинчиден, балдар уктай алышы үчүн баары башкаларды эске алышы керек.',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Ich bin einverstanden. Außerdem kann der Verein ein Schild aufstellen, um auf die Zeiten hinzuweisen.',
        ru: 'Я согласен. Кроме того, объединение может поставить табличку, чтобы указать время.',
        ky: 'Мен макулмун. Мындан тышкары, бирикме убакытты көрсөтүү үчүн такта коё алат.',
      },
      {
        speaker: 'Herr Kaya',
        text: 'Gut. Dann stimmen wir ab. Wer ist für feste Zeiten bis zwanzig Uhr?',
        ru: 'Хорошо. Тогда голосуем. Кто за фиксированные часы до двадцати часов?',
        ky: 'Жакшы. Анда добуш беребиз. Саат жыйырмага чейин белгилүү убакытты ким колдойт?',
      },
      {
        speaker: 'Frau Lindner',
        text: 'Das finde ich fair. Dennoch möchte ich, dass wir in drei Monaten noch einmal darüber sprechen.',
        ru: 'Я считаю это справедливым. Всё же я хочу, чтобы мы через три месяца обсудили это ещё раз.',
        ky: 'Мен муну калыс деп эсептейм. Ошентсе да үч айдан кийин муну дагы бир жолу талкуулашыбызды каалайм.',
      },
      {
        speaker: 'Herr Kaya',
        text: 'Einverstanden. Wir treffen eine Entscheidung und prüfen sie später. Wer beim Schild helfen kann, gibt mir bitte Bescheid.',
        ru: 'Согласен. Мы принимаем решение и проверим его позже. Кто может помочь с табличкой, сообщите мне, пожалуйста.',
        ky: 'Макул. Биз чечим кабыл алабыз жана аны кийин карап чыгабыз. Такта боюнча ким жардам бере алса, мага билдирип коюңуз.',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Ich stelle gern Farbe und Holz zur Verfügung. Das ist mein Beitrag.',
        ru: 'Я охотно предоставлю краску и дерево. Это мой вклад.',
        ky: 'Мен боёк менен жыгачты кубанып берем. Бул менин салымым.',
      },
    ],
    questions: [
      {
        q: 'Worüber sprechen die Anwohner?',
        options: ['Über den Hof hinter dem Gemeindehaus.', 'Über ein neues Schwimmbad.', 'Über den Verkehr auf der Hauptstraße.'],
        answer: 0,
      },
      {
        q: 'Was möchte Frau Lindner?',
        options: ['Dass niemand den Hof benutzt.', 'Feste Zeiten, damit die Kinder schlafen können.', 'Mehr Veranstaltungen am Abend.'],
        answer: 1,
      },
      {
        q: 'Was bietet Herr Brandt an?',
        options: ['Ein neues Schild für den Hof selbst zu kaufen.', 'Den Hof zu putzen.', 'Farbe und Holz zur Verfügung zu stellen.'],
        answer: 2,
      },
      {
        q: 'Was soll in drei Monaten passieren?',
        options: ['Man spricht noch einmal über die Zeiten.', 'Der Hof wird gebaut.', 'Die Versammlung findet nicht mehr statt.'],
        answer: 0,
      },
    ],
    keywords: ['Versammlung', 'Anwohner', 'Rücksicht'],
    source: UNIT_30_SOURCE,
  },
]

export const UNIT_30_READING: ReadingText[] = [
  {
    id: 'b1-re-30-01',
    unit: 30,
    level: 'B1',
    title: 'Ein Verein im Stadtteil (erfunden)',
    body: [
      'Erfundene Reportage: Im Stadtteil Birkenfeld gibt es seit drei Jahren den Verein „Nachbarn helfen Nachbarn“. Er hat fast hundert Mitglieder, und alle arbeiten ehrenamtlich. Der Verein möchte, dass im Viertel niemand allein bleibt. Die Mitglieder kommen aus vielen Ländern und sind zwischen zwanzig und achtzig Jahre alt.',
      'Die Vorsitzende heißt Frau Weiß. Sie ist eine schlanke, humorvolle Frau mit kurzen grauen Haaren. Sie sagt: „Erstens bringen wir älteren Menschen das Essen. Außerdem gehen wir mit ihnen einkaufen. Darüber hinaus organisieren wir jeden Monat ein Treffen, damit sich die Generationen kennenlernen.“',
      'Viele Freiwillige haben wenig Zeit. Sie übernehmen trotzdem Verantwortung, um etwas für ihren Stadtteil zu tun. Ein junger Student leistet jeden Samstag Hilfe beim Aufräumen. So lernt er viele Leute kennen. Das macht ihm Spaß, und er findet dort auch Freunde. Der Verein hat viele Freiwillige gefunden, sodass jede Woche jemand beim Einkaufen hilft.',
      'Nicht alle finden das Ehrenamt leicht. Manche Mitglieder sind müde, weil sie auch arbeiten. Dennoch machen die meisten weiter, denn die Gemeinschaft ist ihnen wichtig. Der Verein sucht neue Freiwillige und stellt dafür Schulungen zur Verfügung. Wer Interesse zeigt, kann einfach Kontakt aufnehmen.',
    ],
    gloss: [
      {
        word: 'damit sich die Generationen kennenlernen',
        ru: 'чтобы поколения познакомились (цель, другое подлежащее)',
        ky: 'муундар таанышышы үчүн (максат, башка ээ)',
        example: 'Wir sammeln Geld, damit die Kinder spielen können.',
        grammar: 'damit: цель, подлежащее другое (Verein — Generationen); глагол в конце',
        grammarKy: 'damit: максат, ээ башка (Verein — Generationen); этиш аягында',
        related: [],
      },
      {
        word: 'um etwas für ihren Stadtteil zu tun',
        ru: 'чтобы сделать что-то для своего района (цель, то же подлежащее)',
        ky: 'өз району үчүн бир нерсе кылуу үчүн (максат, ошол эле ээ)',
        example: 'Ich helfe, um neue Leute zu treffen.',
        grammar: 'um … zu + инфинитив: подлежащее то же (Freiwillige)',
        grammarKy: 'um … zu + инфинитив: ээ ошол эле (Freiwillige)',
        related: [],
      },
      {
        word: 'Erstens …, Außerdem …, Darüber hinaus …, Dennoch …',
        ru: 'Во-первых, … Кроме того, … Помимо этого, … Всё же … (слова-опоры текста)',
        ky: 'Биринчиден, … Мындан тышкары, … Мындан сырткары, … Ошентсе да … (текст таянычтары)',
        example: 'Erstens ist es ruhig. Außerdem ist es zentral.',
        grammar: 'слово-опора на первом месте, глагол сразу после него',
        grammarKy: 'таяныч сөз биринчи орунда, этиш андан дароо кийин',
        related: [],
      },
      {
        word: 'Verantwortung übernehmen, Hilfe leisten, zur Verfügung stellen, Kontakt aufnehmen',
        ru: 'брать ответственность, оказывать помощь, предоставлять, связываться (устойчивые пары)',
        ky: 'жоопкерчиликти алуу, жардам көрсөтүү, берүү, байланышуу (туруктуу жуптар)',
        example: 'Er leistet Hilfe und übernimmt Verantwortung.',
        grammar: 'Nomen-Verb-Verbindung: пара учится целиком',
        grammarKy: 'Nomen-Verb-Verbindung: жуп бүтүндөй үйрөнүлөт',
        related: [],
      },
      {
        word: 'sodass jede Woche jemand beim Einkaufen hilft',
        ru: 'так что каждую неделю кто-то помогает с покупками (следствие)',
        ky: 'ошондуктан ар жума кимдир бирөө дүкөнгө барууга жардам берет (натыйжа)',
        example: 'Es regnet, sodass wir drinnen bleiben.',
        grammar: 'sodass + глагол в конце: следствие; не путать с «so … dass»',
        grammarKy: 'sodass + аягында этиш: натыйжа; «so … dass» менен аралаштырбаңыз',
        related: [],
      },
    ],
    questions: [
      { q: 'Aussage: Der Verein „Nachbarn helfen Nachbarn“ besteht seit drei Jahren.', options: ['richtig', 'falsch', 'steht nicht im Text'], answer: 0 },
      {
        q: 'Warum organisiert der Verein jeden Monat ein Treffen?',
        options: ['Damit sich die Generationen kennenlernen.', 'Damit neue Mitglieder zahlen.', 'Damit niemand zu spät kommt.'],
        answer: 0,
      },
      {
        q: 'Warum machen die meisten Mitglieder trotz Müdigkeit weiter?',
        options: ['Sie bekommen dafür jeden Monat etwas Geld.', 'Die Gemeinschaft ist ihnen wichtig.', 'Der Chef zwingt sie.'],
        answer: 1,
      },
    ],
    source: UNIT_30_SOURCE,
  },
  {
    id: 'b1-re-30-02',
    unit: 30,
    level: 'B1',
    title: 'Zwei Leserbriefe zum „Offenen Hof“ (erfunden)',
    body: [
      'Leserbriefe (erfunden) zum Projekt „Offener Hof“: Der Stadtteil Birkenfeld möchte den Hof hinter dem Gemeindehaus zu einem Treffpunkt machen. Der Hof gehört der Stadt und wird bisher kaum genutzt. Zwei Anwohner schreiben ihre Meinung.',
      'Herr Brandt schreibt: „Ich finde die Idee gut. Erstens ist der Hof zentral, zweitens ist er ruhig. Zum Beispiel können Familien dort zusammen kochen. Darüber hinaus lernen sich die Generationen kennen. Ich wohne seit vierzig Jahren hier und kenne viele Nachbarn. Ich stelle gern meinen Tisch zur Verfügung.“',
      'Frau Lindner schreibt: „Ich verstehe die Idee, habe aber Sorgen. Abends ist es im Hof so still, dass man jedes Geräusch hört. Daher möchte ich feste Zeiten, damit die Kinder schlafen können. Außerdem sollte man die Anwohner fragen, bevor man eine Entscheidung trifft. Ein Fest im Jahr finde ich schön, jeden Abend ein Treffen eher schwierig. Ich wünsche mir, dass auch ältere Nachbarn ihre Meinung sagen können.“',
      'Der Vorstand hat reagiert: Er lädt alle zu einer Versammlung ein und bittet um Vorschläge. Es ist noch nichts entschieden. Beide Briefe nennen gute Gründe. Wer Interesse zeigt, kann Stellung nehmen und einen Vorschlag machen. Wer nicht kommen kann, gibt bitte schriftlich Bescheid.',
    ],
    gloss: [
      {
        word: 'so still, dass man jedes Geräusch hört',
        ru: 'так тихо, что слышен каждый звук (степень и следствие)',
        ky: 'ушунчалык тынч болгондуктан, ар бир добуш угулат (даража жана натыйжа)',
        example: 'Es war so laut, dass wir nichts verstanden haben.',
        grammar: 'so + прилагательное … dass + глагол в конце',
        grammarKy: 'so + сын атооч … dass + аягында этиш',
        related: [],
      },
      {
        word: 'Erstens …, zweitens …; Daher …; Außerdem …',
        ru: 'Во-первых, …, во-вторых, …; Поэтому …; Кроме того, … (слова-опоры)',
        ky: 'Биринчиден, …, экинчиден, …; Ошондуктан …; Мындан тышкары, … (таяныч сөздөр)',
        example: 'Daher gründen wir eine Gruppe.',
        grammar: 'слово-опора + глагол + подлежащее',
        grammarKy: 'таяныч сөз + этиш + ээ',
        related: [],
      },
      {
        word: 'Stellung nehmen, einen Vorschlag machen, Bescheid geben, zur Verfügung stellen',
        ru: 'высказать позицию, внести предложение, сообщить, предоставить (устойчивые пары)',
        ky: 'позиция билдирүү, сунуш киргизүү, билдирүү, берүү (туруктуу жуптар)',
        example: 'Wir geben bis Montag Bescheid.',
        grammar: 'Nomen-Verb-Verbindungen из списка юнита',
        grammarKy: 'бөлүмдүн тизмесиндеги Nomen-Verb-Verbindungen',
        related: [],
      },
    ],
    questions: [
      { q: 'Aussage: Der Hof hinter dem Gemeindehaus gehört dem Verein.', options: ['richtig', 'falsch', 'steht nicht im Text'], answer: 1 },
      {
        q: 'Was wünscht sich Frau Lindner?',
        options: ['Dass der Hof ganz geschlossen bleibt.', 'Mehr Feste am Abend.', 'Feste Zeiten für den Hof.'],
        answer: 2,
      },
      {
        q: 'Was ist über das Projekt schon entschieden?',
        options: ['Noch nichts.', 'Der Hof wird gebaut.', 'Der Hof bleibt geschlossen.'],
        answer: 0,
      },
    ],
    source: UNIT_30_SOURCE,
  },
]

export const UNIT_30_SPEAKING: SpeakingScenario[] = [
  {
    id: UNIT_30_SPEAKING_ID,
    title: 'Ein kurzer Vortrag über ein Nachbarschaftsprojekt',
    titleRu: 'Короткое выступление о проекте для соседей',
    titleKy: 'Кошуналар үчүн долбоор жөнүндө кыска чыгуу',
    icon: '🤝',
    level: 'B1',
    goal: {
      ru: 'Вы представляете идею проекта для района (вымышленного, например общий сад) на собрании жильцов. Постройте выступление: вступление — два пункта — заключение. Отреагируйте уважительно на возражение, предложите решение и пригласите других участвовать. Это самооценка по списку, а не оценка баллами.',
      ky: 'Сиз турак жайдын чогулушунда район үчүн (ойдон чыгарылган, мисалы жалпы бак) долбоордун идеясын тааныштырасыз. Чыгууну түзүңүз: киришүү — эки пункт — жыйынтык. Каршылыкка сый менен жооп бериңиз, чечим сунуштаңыз жана башкаларды катышууга чакырыңыз. Бул упай менен эмес, тизме боюнча өзүн баалоо.',
    },
    turns: [
      {
        ai: 'Guten Abend. Sie möchten uns Ihre Idee vorstellen. Worum geht es?',
        aiRu: 'Добрый вечер. Вы хотите представить нам свою идею. О чём речь?',
        aiKy: 'Кайырлуу кеч. Сиз бизге идеяңызды тааныштыргыңыз келет. Эмне жөнүндө?',
        hints: [
          'Ich möchte Ihnen kurz unser Projekt vorstellen: einen Gemeinschaftsgarten.',
          'Ich möchte über einen Garten für alle Nachbarn sprechen.',
          'Guten Abend. Es geht um einen Treffpunkt im Stadtteil.',
        ],
        keywords: ['projekt', 'garten', 'vorstellen', 'treffpunkt'],
      },
      {
        ai: 'Interessant. Was ist Ihr erster Punkt?',
        aiRu: 'Интересно. Какой ваш первый пункт?',
        aiKy: 'Кызыктуу. Биринчи пунктуңуз кандай?',
        hints: [
          'Erstens ist der Garten für alle offen.',
          'Erstens können dort alle Generationen zusammenarbeiten.',
          'Erstens leisten wir so einen Beitrag für den Stadtteil.',
        ],
        keywords: ['erstens', 'offen', 'generationen', 'beitrag'],
      },
      {
        ai: 'Und gibt es noch einen zweiten Punkt?',
        aiRu: 'А есть ещё второй пункт?',
        aiKy: 'Экинчи пункт дагы барбы?',
        hints: [
          'Außerdem kostet der Garten nicht viel.',
          'Darüber hinaus können Kinder dort etwas lernen.',
          'Zum Beispiel können wir zusammen Gemüse anbauen.',
        ],
        keywords: ['außerdem', 'darüber hinaus', 'beispiel', 'kosten'],
      },
      {
        ai: 'Ich habe eine Frage: Ist das nicht zu teuer? Wer soll das bezahlen?',
        aiRu: 'У меня вопрос: разве это не слишком дорого? Кто будет за это платить?',
        aiKy: 'Менин суроом бар: бул өтө кымбат эмеспи? Муну ким төлөйт?',
        hints: [
          'Das ist ein berechtigter Einwand. Wir sammeln Spenden, damit wir Material kaufen können.',
          'Moment, ich überlege kurz. Die Stadt kann uns Unterstützung geben.',
          'Habe ich Sie richtig verstanden? Sie machen sich Sorgen, weil es teuer ist?',
        ],
        keywords: ['einwand', 'spenden', 'damit', 'unterstützung'],
      },
      {
        ai: 'Das klingt vernünftig. Und wer macht bei so einem Projekt mit?',
        aiRu: 'Звучит разумно. А кто участвует в таком проекте?',
        aiKy: 'Акылдуу угулат. Ал эми мындай долбоорго ким катышат?',
        hints: [
          'Wir suchen Freiwillige, die Verantwortung übernehmen.',
          'Jeder kann einen kleinen Beitrag leisten.',
          'Wer Interesse hat, kann gern Kontakt aufnehmen.',
        ],
        keywords: ['freiwillige', 'verantwortung', 'beitrag', 'kontakt'],
      },
      {
        ai: 'Manche Nachbarn sind skeptisch. Sie sagen, dass der Garten zu laut ist. Was sagen Sie dazu?',
        aiRu: 'Некоторые соседи настроены скептически. Они говорят, что сад слишком шумный. Что вы на это скажете?',
        aiKy: 'Кээ бир кошуналар шектенишет. Алар бакты өтө ызы-чуулуу дешет. Сиз буга эмне дейсиз?',
        hints: [
          'Ich verstehe das. Dennoch glaube ich, dass das Projekt allen hilft.',
          'Das ist eine wichtige Meinung. Daher schlage ich feste Zeiten vor.',
          'Wir können Stellung nehmen und zusammen eine Lösung suchen.',
        ],
        keywords: ['verstehe', 'dennoch', 'daher', 'lösung'],
      },
      {
        ai: 'Danke. Möchten Sie noch einen Schluss sagen?',
        aiRu: 'Спасибо. Хотите сказать заключительные слова?',
        aiKy: 'Рахмат. Жыйынтыктоочу сөз айткыңыз келеби?',
        hints: [
          'Zum Schluss möchte ich sagen: Jeder ist willkommen. Daher bitte ich Sie mitzumachen.',
          'Vielen Dank für Ihre Fragen. Ich gebe Ihnen gern Bescheid.',
          'Danke fürs Zuhören. Machen Sie mit, damit der Garten ein Treffpunkt für alle wird.',
        ],
        keywords: ['schluss', 'willkommen', 'mitmachen', 'danke'],
      },
    ],
    source: UNIT_30_SOURCE,
  },
]

const TIP_SELF = {
  ru: 'После написания пройдите по списку ниже и оцените себя сами: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
  ky: 'Жазып бүткөндөн кийин төмөнкү тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
}

export const UNIT_30_WRITING: WritingTask[] = [
  {
    id: 'b1-wr-30-01',
    unit: 30,
    level: 'B1',
    title: 'Ein Leserbrief zu einem Nachbarschaftsprojekt',
    situation: {
      ru: 'В вашем районе (вымышленном) хотят создать общий сад. Напишите письмо в газету или текст для объединения: ваша позиция, не менее четырёх слов-опор (erstens, außerdem, darüber hinaus, dennoch, daher, zum Beispiel), цель с damit или um … zu, пара «существительное + глагол» и честное упоминание другой точки зрения.',
      ky: 'Сиздин райондо (ойдон чыгарылган) жалпы бак түзгүлөрү келет. Гезитке кат же бирикме үчүн текст жазыңыз: позицияңыз, жок дегенде төрт таяныч сөз (erstens, außerdem, darüber hinaus, dennoch, daher, zum Beispiel), damit же um … zu менен максат, «зат атооч + этиш» жуп жана башка көз карашты калыс эскерүү.',
    },
    formal: false,
    minWords: 90,
    mustInclude: [
      {
        label: 'Einleitung (Ich möchte über … schreiben / Ich schreibe zum Projekt …)',
        patterns: ['ich möchte', 'ich schreibe', 'zum projekt', 'zum garten'],
        explain: {
          ru: 'Начните коротко: о чём вы пишете и по какому поводу.',
          ky: 'Кыска баштаңыз: эмне жөнүндө жана кандай себеп менен жазып жатканыңызды айтыңыз.',
        },
      },
      {
        label: 'Erstens / zweitens (Erstens ist … Zweitens …)',
        patterns: ['erstens', 'zweitens'],
        explain: {
          ru: 'Перечислите доводы: erstens …, zweitens … (глагол сразу после слова-опоры).',
          ky: 'Далилдерди санап чыгыңыз: erstens …, zweitens … (этиш таяныч сөздөн дароо кийин).',
        },
      },
      {
        label: 'Außerdem / darüber hinaus (Außerdem kostet …)',
        patterns: ['außerdem', 'darüber hinaus'],
        explain: {
          ru: 'Добавьте ещё один довод словом außerdem или darüber hinaus.',
          ky: 'außerdem же darüber hinaus сөзү менен дагы бир далил кошуңуз.',
        },
      },
      {
        label: 'Zum Beispiel (Zum Beispiel können Nachbarn …)',
        patterns: ['zum beispiel'],
        explain: {
          ru: 'Приведите конкретный пример со словами zum Beispiel.',
          ky: 'zum Beispiel сөздөрү менен так мисал келтириңиз.',
        },
      },
      {
        label: 'Ziel (… damit … / … um … zu …)',
        patterns: ['damit', 'um '],
        explain: {
          ru: 'Одно предложение о цели: damit (другое подлежащее) или um … zu (то же подлежащее).',
          ky: 'Максат жөнүндө бир сүйлөм: damit (ээ башка) же um … zu (ээ ошол эле).',
        },
      },
      {
        label: 'Eine andere Sicht (Dennoch gibt es auch Sorgen …)',
        patterns: ['dennoch', 'manche', 'andere'],
        explain: {
          ru: 'Честно упомяните другую точку зрения: dennoch, manche Nachbarn, andere.',
          ky: 'Башка көз карашты калыс эскерүңүз: dennoch, manche Nachbarn, andere.',
        },
      },
      {
        label: 'Folgerung und Nomen-Verb-Verbindung (Daher … / Verantwortung übernehmen, Kontakt aufnehmen)',
        patterns: ['daher', 'verantwortung', 'kontakt aufnehmen', 'nehme kontakt', 'zur verfügung', 'beitrag'],
        explain: {
          ru: 'Закончите выводом с daher и используйте пару из списка: Verantwortung übernehmen, Kontakt aufnehmen, einen Beitrag leisten.',
          ky: 'daher менен жыйынтык чыгарып аяктаңыз жана тизмеден жупту колдонуңуз: Verantwortung übernehmen, Kontakt aufnehmen, einen Beitrag leisten.',
        },
      },
    ],
    model:
      'Ich möchte zum Projekt „Gemeinschaftsgarten“ schreiben. Erstens ist der Platz zentral, und zweitens ist er für alle offen. Außerdem kostet der Garten nicht viel. Zum Beispiel können Nachbarn dort zusammen Gemüse anbauen. Wir sammeln Spenden, damit wir Material kaufen können. Dennoch gibt es auch Sorgen: Manche Nachbarn fürchten Lärm. Das kann ich verstehen. Daher schlage ich feste Zeiten vor. Das Projekt kann den Zusammenhalt im Stadtteil stärken, und alle Generationen können mitmachen. Ich finde, das ist ein guter Anfang. Ich bin bereit, Verantwortung zu übernehmen. Wer Interesse hat, kann gern Kontakt aufnehmen.',
    tips: [
      {
        ru: 'Постройте письмо: вступление — два довода (erstens, außerdem) — пример (zum Beispiel) — другая точка зрения (dennoch) — вывод (daher). После слова-опоры глагол идёт сразу: «Außerdem kostet der Garten wenig».',
        ky: 'Катты түзүңүз: киришүү — эки далил (erstens, außerdem) — мисал (zum Beispiel) — башка көз караш (dennoch) — жыйынтык (daher). Таяныч сөздөн кийин этиш дароо келет: «Außerdem kostet der Garten wenig».',
      },
      {
        ru: 'Цель: «um … zu», если действует один человек («Ich helfe, um Leute kennenzulernen»), и «damit», если другой («…, damit wir Material kaufen können»). Не называйте мнение фактом: «Ich finde», «Manche Nachbarn fürchten».',
        ky: 'Максат: бир адам аракет кылса «um … zu» («Ich helfe, um Leute kennenzulernen»), башка адам болсо «damit» («…, damit wir Material kaufen können»). Пикирди факт катары атабаңыз: «Ich finde», «Manche Nachbarn fürchten».',
      },
      TIP_SELF,
    ],
    source: UNIT_30_SOURCE,
  },
  {
    id: 'b1-wr-30-02',
    unit: 30,
    level: 'B1',
    title: 'Meine Meinung: Sollte man sich ehrenamtlich engagieren?',
    situation: {
      ru: 'Друг спрашивает, стоит ли заниматься общественной работой. Напишите 2–3 предложения: ваше мнение, причина и ещё одна точка зрения (у других людей могут быть другие причины). Не называйте своё мнение фактом.',
      ky: 'Досуңуз коомдук иш менен алектенүү керекпи деп сурап жатат. 2–3 сүйлөм жазыңыз: пикириңиз, себеби жана дагы бир көз караш (башка адамдардын башка себептери болушу мүмкүн). Пикириңизди факт катары атабаңыз.',
    },
    formal: false,
    minWords: 30,
    mustInclude: [
      {
        label: 'Meinung (Ich finde, … / Meiner Meinung nach …)',
        patterns: ['ich finde', 'meiner meinung nach', 'ich glaube', 'ich denke'],
        explain: { ru: 'Скажите своё мнение: «Ich finde, …».', ky: 'Пикириңизди айтыңыз: «Ich finde, …».' },
      },
      {
        label: 'Grund (weil / denn / damit / um … zu)',
        patterns: ['weil', 'denn', 'damit', 'um '],
        explain: {
          ru: 'Назовите причину или цель: weil, denn, damit, um … zu.',
          ky: 'Себепти же максатты атаңыз: weil, denn, damit, um … zu.',
        },
      },
      {
        label: 'Eine andere Sicht (Dennoch / Manche Menschen …)',
        patterns: ['dennoch', 'manche', 'andere', 'nicht jeder'],
        explain: {
          ru: 'Упомяните другую точку зрения: dennoch, manche Menschen, andere.',
          ky: 'Башка көз карашты эскериңиз: dennoch, manche Menschen, andere.',
        },
      },
    ],
    model:
      'Ich finde, ein Ehrenamt ist eine gute Idee, weil man neue Leute kennenlernt und etwas Sinnvolles tut. Manche Menschen haben aber wenig Zeit oder Kraft. Dennoch kann jeder einen kleinen Beitrag leisten. Das ist nur meine Meinung.',
    tips: [
      {
        ru: 'Мнение, причина, другая точка зрения: три предложения достаточно. «Manche Menschen …» показывает, что вы видите и другую сторону.',
        ky: 'Пикир, себеп, башка көз караш: үч сүйлөм жетиштүү. «Manche Menschen …» сиз башка жагын да көрүп жатканыңызды көрсөтөт.',
      },
      {
        ru: 'Пишите «ich finde», а не «так должны делать все». Ваше мнение — это только ваше мнение.',
        ky: '«ich finde» деп жазыңыз, «баары ушундай кылышы керек» эмес. Сиздин пикириңиз — бул сиздин пикириңиз гана.',
      },
      TIP_SELF,
    ],
    source: UNIT_30_SOURCE,
  },
  {
    id: 'b1-wr-30-03',
    unit: 30,
    level: 'B1',
    title: 'Eine Nachricht an die Nachbarn: Wir suchen Freiwillige',
    situation: {
      ru: 'Вы организуете вымышленный проект в доме (уборка двора). Напишите короткое сообщение соседям: зачем проект (damit или um … zu), приглашение участвовать и как сообщить о своём участии (пара из списка, например Bescheid geben, Kontakt aufnehmen).',
      ky: 'Сиз үйдө ойдон чыгарылган долбоорду (короону тазалоо) уюштуруп жатасыз. Кошуналарга кыска билдирүү жазыңыз: долбоор эмне үчүн (damit же um … zu), катышууга чакыруу жана катышуу жөнүндө кантип билдирүү (тизмеден жуп, мисалы Bescheid geben, Kontakt aufnehmen).',
    },
    formal: false,
    minWords: 40,
    mustInclude: [
      {
        label: 'Anrede und Gruß (Liebe Nachbarn, … / Viele Grüße)',
        patterns: ['liebe nachbarn', 'liebe', 'viele grüße', 'herzliche grüße', 'freundliche grüße'],
        explain: {
          ru: 'Дружеское обращение в начале и приветливое прощание в конце.',
          ky: 'Башында достук кайрылуу, аягында жылуу коштошуу.',
        },
      },
      {
        label: 'Ziel (… damit … / … um … zu …)',
        patterns: ['damit', 'um '],
        explain: {
          ru: 'Объясните цель проекта: damit (другое подлежащее) или um … zu (то же подлежащее).',
          ky: 'Долбоордун максатын түшүндүрүңүз: damit (ээ башка) же um … zu (ээ ошол эле).',
        },
      },
      {
        label: 'Einladung und Nomen-Verb-Verbindung (Wer Interesse hat, … Bescheid geben / Kontakt aufnehmen)',
        patterns: ['bescheid geben', 'gibt bescheid', 'kontakt aufnehmen', 'nimmt kontakt', 'interesse hat', 'zur verfügung'],
        explain: {
          ru: 'Пригласите и скажите, как отозваться: Wer Interesse hat, gibt bitte Bescheid / nimmt Kontakt auf.',
          ky: 'Чакырыңыз жана кантип жооп берүү керектигин айтыңыз: Wer Interesse hat, gibt bitte Bescheid / nimmt Kontakt auf.',
        },
      },
      {
        label: 'Termin und Ort (am Samstag um zehn Uhr im Hof)',
        patterns: ['samstag', 'sonntag', 'uhr', 'im hof', 'am '],
        explain: {
          ru: 'Назовите день, время и место встречи.',
          ky: 'Жолугушуунун күнүн, убактысын жана жайын атаңыз.',
        },
      },
    ],
    model:
      'Liebe Nachbarn, wir möchten am Samstag um zehn Uhr den Hof aufräumen, damit die Kinder dort sicher spielen können. Wer Interesse hat, gibt mir bitte bis Donnerstag Bescheid. Wir stellen Handschuhe und Säcke zur Verfügung. Jede Hilfe zählt, auch eine Stunde. Viele Grüße, Mira',
    tips: [
      {
        ru: 'Пишите коротко и дружелюбно: цель, время и место, как отозваться. «Wer Interesse hat, gibt bitte Bescheid» — вежливое приглашение без давления.',
        ky: 'Кыска жана достук менен жазыңыз: максат, убакыт жана жай, кантип жооп берүү. «Wer Interesse hat, gibt bitte Bescheid» — басымсыз сылык чакыруу.',
      },
      {
        ru: 'Не обещайте лишнего и не давите на соседей: участие добровольное.',
        ky: 'Ашыкча убада бербеңиз жана кошуналарга басым жасабаңыз: катышуу ыктыярдуу.',
      },
      TIP_SELF,
    ],
    source: UNIT_30_SOURCE,
  },
]
