import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_28_SOURCE, UNIT_28_SPEAKING_ID } from './unit'

/**
 * Unit 28 texts: 2 listening scripts, 2 readings, 1 speaking scenario, 4 writing tasks (the main enquiry mail and THREE short micro-tasks required by the
 * curriculum: opinion, mediation of a school letter / course information, and the apology note to the school). Targets of the band for Units 27–29 and the
 * curriculum text for Unit 28: reading 150–190 words, listening 140–170, sentences ≤ 25 words (95th percentile ≤ 20), 6–7 speaking turns, writing 80–85 words.
 * Original material; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native speaker.
 * ALL schools, courses, universities, people, dates and sums are FICTIONAL and labelled so; nothing describes the real rules of a real education system.
 * Scope guard (curriculum v2): Futur I only for forecasts and conjecture with `wohl` and only with the closed list of ten infinitives (sein, haben, kommen, gehen,
 * schaffen, bestehen, lernen, studieren, arbeiten, geben); falls / sobald / solange with the verb at the end; verb + preposition only from the closed list of 20 pairs
 * (the six A2 pairs + 14 new), wo(r)- / da(r)- only for these; `sodass` appears in ONE reading, glossed (receptive). No Futur II, no `damit` (Unit 30), no relative
 * clause with a preposition (Unit 29), no Plusquamperfekt / nachdem (Unit 29), no Genitiv attribute (Unit 29), no `ohne … zu`, and the word "Zertifikat" is not used.
 * Listening: the dialogues are played with the browser's text-to-speech (the existing mechanism of the listening lab). That playback has NOT been
 * verified on real devices, so no final-test item depends on audio.
 */
export const UNIT_28_LISTENING: ListeningExercise[] = [
  {
    id: 'b1-li-28-01',
    unit: 28,
    level: 'B1',
    title: 'Eine Studienberatung (erfunden)',
    lines: [
      {
        speaker: 'Frau Ostermann',
        text: 'Guten Tag, Herr Demir. Worüber möchten Sie sich informieren?',
        ru: 'Добрый день, господин Демир. О чём вы хотели бы получить информацию?',
        ky: 'Кайырлуу күн, Демир мырза. Эмне жөнүндө маалымат алгыңыз келет?',
      },
      {
        speaker: 'Herr Demir',
        text: 'Guten Tag. Ich interessiere mich für ein Studium in Informatik.',
        ru: 'Добрый день. Я интересуюсь учёбой по информатике.',
        ky: 'Кайырлуу күн. Мен информатика боюнча окууга кызыгам.',
      },
      {
        speaker: 'Frau Ostermann',
        text: 'Haben Sie das Abitur schon?',
        ru: 'У вас уже есть аттестат зрелости?',
        ky: 'Сизде Abitur бар беле?',
      },
      {
        speaker: 'Herr Demir',
        text: 'Ja, seit einem Jahr. Ich habe gearbeitet und mich auf das Studium vorbereitet.',
        ru: 'Да, уже год. Я работал и готовился к учёбе.',
        ky: 'Ооба, бир жылдан бери. Мен иштедим жана окууга даярдандым.',
      },
      {
        speaker: 'Frau Ostermann',
        text: 'Gut. Bis zum 15. Juli müssen Sie sich um einen Studienplatz bewerben.',
        ru: 'Хорошо. До 15 июля вам нужно подать заявку на место в вузе.',
        ky: 'Жакшы. 15-июлга чейин сиз окуу ордуна өтүнүч берүүңүз керек.',
      },
      {
        speaker: 'Herr Demir',
        text: 'Und falls ich keinen Platz bekomme?',
        ru: 'А если я вдруг не получу места?',
        ky: 'Ал эми эгер мен орун албай калсам?',
      },
      {
        speaker: 'Frau Ostermann',
        text: 'Dann kommen Sie auf die Warteliste. Sobald ein Platz frei wird, schreiben wir Ihnen.',
        ru: 'Тогда вы попадёте в список ожидания. Как только освободится место, мы вам напишем.',
        ky: 'Анда сиз күтүү тизмесине киресиз. Орун бошоору менен биз сизге жазабыз.',
      },
      {
        speaker: 'Herr Demir',
        text: 'Ich habe wenig Geld. Darauf muss ich achten. Was kostet das Studium?',
        ru: 'У меня мало денег. На это мне нужно обратить внимание. Сколько стоит учёба?',
        ky: 'Менде акча аз. Буга мен көңүл бурушум керек. Окуу канча турат?',
      },
      {
        speaker: 'Frau Ostermann',
        text: 'Die Hochschule ist staatlich. Sie zahlen nur einen kleinen Beitrag. Falls Sie ein Stipendium bekommen, ist es noch günstiger.',
        ru: 'Вуз государственный. Вы платите только небольшой взнос. Если вы получите стипендию, будет ещё дешевле.',
        ky: 'Жогорку окуу жайы мамлекеттик. Сиз кичинекей жарна гана төлөйсүз. Стипендия алсаңыз, дагы арзаныраак болот.',
      },
      {
        speaker: 'Herr Demir',
        text: 'Das wird wohl nicht leicht sein, aber ich werde es schaffen.',
        ru: 'Это, наверное, будет нелегко, но я справлюсь.',
        ky: 'Бул, балким, оңой болбойт, бирок мен аны жеңем.',
      },
      {
        speaker: 'Frau Ostermann',
        text: 'Das glaube ich auch. Solange Sie studieren, können Sie nebenbei arbeiten.',
        ru: 'Я тоже так думаю. Пока вы учитесь, вы можете подрабатывать.',
        ky: 'Мен да ушундай ойлойм. Сиз окуп жатканда кошумча иштей аласыз.',
      },
      {
        speaker: 'Herr Demir',
        text: 'Wunderbar. Ich bewerbe mich sofort, denn die Frist ist bald vorbei. Vielen Dank für die Beratung.',
        ru: 'Замечательно. Я подам заявку сразу, ведь срок скоро заканчивается. Большое спасибо за консультацию.',
        ky: 'Сонун. Мен дароо өтүнүч берем, анткени мөөнөт жакында бүтөт. Кеңеш үчүн чоң рахмат.',
      },
      {
        speaker: 'Frau Ostermann',
        text: 'Gern geschehen. Auf Wiedersehen.',
        ru: 'Пожалуйста. До свидания.',
        ky: 'Эч нерсе эмес. Кайра көрүшкөнчө.',
      },
    ],
    questions: [
      {
        q: 'Wofür interessiert sich Herr Demir?',
        options: ['Für ein Studium in Informatik.', 'Für einen Sprachkurs.', 'Für eine Ausbildung als Koch.'],
        answer: 0,
      },
      { q: 'Bis wann muss er sich bewerben?', options: ['Bis zum 15. Juni.', 'Bis zum 15. Juli.', 'Bis zum 15. August.'], answer: 1 },
      {
        q: 'Was passiert, falls er keinen Platz bekommt?',
        options: ['Er muss ins Ausland gehen.', 'Er bekommt ein Stipendium.', 'Er kommt auf die Warteliste.'],
        answer: 2,
      },
      {
        q: 'Was kann er tun, solange er studiert?',
        options: ['Nebenbei arbeiten.', 'Ein Praktikum im Ausland machen.', 'Nur am Wochenende lernen.'],
        answer: 0,
      },
    ],
    keywords: ['Studium', 'Stipendium', 'Warteliste', 'Hochschule'],
    source: UNIT_28_SOURCE,
  },
  {
    id: 'b1-li-28-02',
    unit: 28,
    level: 'B1',
    title: 'Ein Anruf in der Kita (erfunden)',
    lines: [
      {
        speaker: 'Herr Brandt',
        text: 'Kita Sonnenschein, Brandt, guten Tag.',
        ru: 'Детский сад «Солнышко», Брандт, добрый день.',
        ky: 'Бала бакча «Күнчолпон», Брандт, кайырлуу күн.',
      },
      {
        speaker: 'Frau Roth',
        text: 'Guten Tag, hier ist Roth. Mein Sohn Jonas ist diese Woche krank.',
        ru: 'Добрый день, это Рот. Мой сын Йонас на этой неделе болен.',
        ky: 'Кайырлуу күн, бул Рот. Менин уулум Йонас ушул жумада ооруп жатат.',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Das tut mir leid. Wird er wohl bald wieder gesund sein?',
        ru: 'Мне очень жаль. Он, наверное, скоро поправится?',
        ky: 'Кечиресиз. Ал, балким, жакында айыгып кетер?',
      },
      {
        speaker: 'Frau Roth',
        text: 'Ich hoffe darauf. Der Arzt sagt, er wird am Montag wieder kommen.',
        ru: 'Я надеюсь на это. Врач говорит, что в понедельник он снова придёт.',
        ky: 'Мен буга үмүттөнөм. Дарыгер дүйшөмбүдө ал кайра келет дейт.',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Gut. Schicken Sie uns bitte eine Entschuldigung, sobald er wieder da ist.',
        ru: 'Хорошо. Пожалуйста, пришлите нам объяснительную, как только он снова придёт.',
        ky: 'Жакшы. Ал кайра келери менен бизге, сураныч, кечирим катын жиберип коюңуз.',
      },
      {
        speaker: 'Frau Roth',
        text: 'Das mache ich. Ich habe noch eine Frage zur Betreuung am Nachmittag. Ab September brauche ich einen Platz.',
        ru: 'Сделаю. У меня ещё вопрос о присмотре во второй половине дня. С сентября мне нужно место.',
        ky: 'Кылам. Мен түштөн кийинки бала багуу жөнүндө дагы бир суроо берем. Сентябрдан баштап мага орун керек.',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Leider ist im Moment kein Platz frei.',
        ru: 'К сожалению, сейчас нет свободных мест.',
        ky: 'Тилекке каршы, азыр бош орун жок.',
      },
      {
        speaker: 'Frau Roth',
        text: 'Das ist schade. Gibt es eine Warteliste?',
        ru: 'Жаль. Есть ли список ожидания?',
        ky: 'Өкүнүчтүү. Күтүү тизмеси барбы?',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Ja. Falls ein Platz frei wird, rufen wir Sie an. Das wird wohl im Oktober sein.',
        ru: 'Да. Если освободится место, мы вам позвоним. Это, наверное, будет в октябре.',
        ky: 'Ооба. Орун бошосо, биз сизге чалабыз. Бул, балким, октябрда болот.',
      },
      {
        speaker: 'Frau Roth',
        text: 'Solange ich keinen Platz habe, arbeite ich nur halbtags. Ich kümmere mich auch um eine andere Betreuung.',
        ru: 'Пока у меня нет места, я работаю только полдня. Я также займусь другим присмотром.',
        ky: 'Орун жок кезде мен жарым күн гана иштейм. Мен башка бала багуу жөнүндө да кам көрөм.',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Das ist eine gute Idee, Frau Roth. Am Elternabend am Dienstag können wir weiter sprechen.',
        ru: 'Хорошая идея, госпожа Рот. На родительском собрании во вторник мы сможем поговорить дальше.',
        ky: 'Жакшы ой, Рот айым. Шейшембидеги ата-энелер чогулушунда биз сүйлөшүүнү улантабыз.',
      },
      {
        speaker: 'Frau Roth',
        text: 'Ich freue mich darauf. Vielen Dank. Auf Wiedersehen.',
        ru: 'Я жду этого. Большое спасибо. До свидания.',
        ky: 'Мен муну чыдамсыздык менен күтөм. Чоң рахмат. Кайра көрүшкөнчө.',
      },
    ],
    questions: [
      {
        q: 'Warum ruft Frau Roth an?',
        options: ['Sie will das Kind abholen.', 'Ihr Sohn ist krank.', 'Sie hat einen Elternabend verpasst.'],
        answer: 1,
      },
      { q: 'Wann wird Jonas laut Arzt wieder kommen?', options: ['Am Montag.', 'Am Dienstag.', 'Am Freitag.'], answer: 0 },
      {
        q: 'Was ist im Moment mit der Betreuung am Nachmittag?',
        options: ['Es gibt viele Plätze.', 'Die Kita ist geschlossen.', 'Es ist kein Platz frei.'],
        answer: 2,
      },
      {
        q: 'Was macht Frau Roth, solange sie keinen Platz hat?',
        options: ['Sie arbeitet nur halbtags.', 'Sie zieht um.', 'Sie wechselt die Stadt und die Arbeit.'],
        answer: 0,
      },
    ],
    keywords: ['Betreuung', 'Warteliste', 'Elternabend', 'Ganztagsschule'],
    source: UNIT_28_SOURCE,
  },
]

export const UNIT_28_READING: ReadingText[] = [
  {
    id: 'b1-re-28-01',
    unit: 28,
    level: 'B1',
    title: 'Auslandsjahr und Schulbrief (erfunden)',
    body: [
      'Erfundener Erfahrungsbericht: Nach dem Abitur habe ich ein Auslandsjahr in Spanien gemacht. Ich habe einen Sprachkurs belegt und abends in einem Café gearbeitet. Am Anfang war es anstrengend, denn ich habe wenig verstanden. Ich habe mich auf jede Stunde gut vorbereitet und jeden Abend Vokabeln wiederholt. Meine Fortschritte waren bald groß, weil ich jeden Tag gesprochen habe. Das Wohnheim war günstig und nur zehn Minuten vom Kurs entfernt. Heute interessiere ich mich für ein Studium in Europa, das ich nach dem Kurs beginnen möchte. Sobald ich die Bescheinigung vom Kurs habe, bewerbe ich mich um einen Studienplatz. Falls ich ein Stipendium bekomme, werde ich wohl im Herbst nach Hamburg gehen.',
      'Schulbrief (erfunden): Liebe Eltern, am Dienstag, den 12. Mai, findet um 19 Uhr ein Elternabend für die Klasse 5b statt. Bitte denken Sie an die Anmeldung für die Ganztagsschule. Falls Sie nicht kommen können, schicken Sie bitte eine Entschuldigung. Die Betreuung am Nachmittag wird im nächsten Schuljahr ausgebaut, sodass mehr Kinder einen Platz bekommen. Freundliche Grüße, Ihre Klassenlehrerin',
    ],
    gloss: [
      {
        word: 'Sobald ich … habe, bewerbe ich mich um …',
        ru: 'Как только у меня будет …, я подам заявку на … (sobald; sich bewerben um)',
        ky: '… болору менен мен … үчүн өтүнүч берем (sobald; sich bewerben um)',
        example: 'Sobald ich Zeit habe, bewerbe ich mich um einen Platz.',
        grammar: 'sobald: глагол в конце; sich bewerben um + Akkusativ',
        grammarKy: 'sobald: этиш аягында; sich bewerben um + Akkusativ',
        related: [],
      },
      {
        word: 'werde ich wohl … gehen',
        ru: 'я, наверное, поеду … (Futur I с wohl)',
        ky: 'мен, балким, … барам (wohl менен Futur I)',
        example: 'Ich werde wohl im Herbst nach Berlin gehen.',
        grammar: 'werden + wohl + инфинитив в конце: предположение или прогноз',
        grammarKy: 'werden + wohl + аягында инфинитив: божомол же болжол',
        related: [],
      },
      {
        word: 'Bitte denken Sie an …',
        ru: 'Пожалуйста, не забудьте о … (denken an + Akkusativ)',
        ky: 'Сураныч, … жөнүндө унутпаңыз (denken an + Akkusativ)',
        example: 'Denken Sie bitte an die Anmeldung.',
        grammar: 'denken an + Akkusativ: пара глагол + предлог (A2)',
        grammarKy: 'denken an + Akkusativ: этиш + предлог жубу (A2)',
        related: [],
      },
      {
        word: 'sodass',
        ru: 'так что, в результате чего (только для понимания)',
        ky: 'ошондуктан, натыйжада (түшүнүү үчүн гана)',
        example: 'Es regnet, sodass wir drinnen bleiben.',
        grammar: 'sodass + глагол в конце: следствие; в этом юните только для чтения (юнит 30)',
        grammarKy: 'sodass + аягында этиш: натыйжа; бул бөлүмдө окуу үчүн гана (30-бөлүм)',
        related: [],
      },
    ],
    questions: [
      { q: 'Aussage: Die Person hat im Auslandsjahr nur Urlaub in Spanien gemacht.', options: ['richtig', 'falsch', 'steht nicht im Text'], answer: 1 },
      {
        q: 'Wann bewirbt sie sich um einen Studienplatz?',
        options: ['Sobald sie die Bescheinigung vom Kurs hat.', 'Sobald sie im Herbst ein Stipendium bekommen hat.', 'Im nächsten Schuljahr.'],
        answer: 0,
      },
      {
        q: 'Was sollen Eltern tun, die nicht zum Elternabend kommen können?',
        options: ['Anrufen.', 'Eine Entschuldigung schicken.', 'Ein Kind schicken.'],
        answer: 1,
      },
    ],
    source: UNIT_28_SOURCE,
  },
  {
    id: 'b1-re-28-02',
    unit: 28,
    level: 'B1',
    title: 'Online lernen: Vor- und Nachteile (erfunden)',
    body: [
      'Viele Menschen entscheiden sich für einen Onlinekurs. Der Vorteil: Man kann lernen, wann man will, und man spart den Weg zur Schule. Für manche ist ein Onlinekurs auch billiger, weil sie keine Fahrkarte brauchen. Ein Teilnehmer (erfundene Person) schreibt: Ich nehme an einem Kurs teil, der ganz online ist. Solange ich Internet habe, kann ich überall lernen. Falls ich eine Frage habe, schreibe ich der Lehrkraft.',
      'Aber ich ärgere mich manchmal über die schlechte Verbindung, und die Konzentration ist zu Hause schwieriger. Eine dritte Teilnehmerin schreibt: Ich plane meine Woche genau, sonst arbeite ich zu wenig. Ein fester Lernplan hilft mir sehr. Eine andere Teilnehmerin schreibt: Ich werde online wohl nicht so viel lernen, denn ich brauche Kontakt zu anderen. Das ist meine Meinung, keine Regel für alle. In Zukunft werden wohl noch mehr Menschen online lernen. Der Unterricht im Klassenzimmer wird aber wohl weiter wichtig sein. Beides hat Vor- und Nachteile.',
    ],
    gloss: [
      {
        word: 'sich entscheiden für / teilnehmen an',
        ru: 'решиться на … / участвовать в … (пары глагол + предлог)',
        ky: '… тандоо / … катышуу (этиш + предлог жуптары)',
        example: 'Ich entscheide mich für den Abendkurs.',
        grammar: 'пары: sich entscheiden + für (Akkusativ); teilnehmen + an (Dativ)',
        grammarKy: 'жуптар: sich entscheiden + für (Akkusativ); teilnehmen + an (Dativ)',
        related: [],
      },
      {
        word: 'Solange ich Internet habe …',
        ru: 'Пока у меня есть интернет … (solange)',
        ky: 'Менде интернет бар кезде … (solange)',
        example: 'Solange ich Zeit habe, lerne ich.',
        grammar: 'solange: пока длится состояние; глагол в конце',
        grammarKy: 'solange: абал созулуп турганда; этиш аягында',
        related: [],
      },
      {
        word: 'ich ärgere mich über',
        ru: 'я злюсь из-за … (sich ärgern über + Akkusativ)',
        ky: 'мен … жөнүндө ачууланам (sich ärgern über + Akkusativ)',
        example: 'Ich ärgere mich über den Lärm.',
        grammar: 'пара: sich ärgern + über (Akkusativ)',
        grammarKy: 'жуп: sich ärgern + über (Akkusativ)',
        related: [],
      },
      {
        word: 'werden wohl … lernen',
        ru: 'будут, вероятно, учиться (Futur I с wohl)',
        ky: 'балким, окушат (wohl менен Futur I)',
        example: 'Viele werden wohl online lernen.',
        grammar: 'werden (Plural) + wohl + инфинитив: прогноз',
        grammarKy: 'werden (көптүк) + wohl + инфинитив: болжол',
        related: [],
      },
    ],
    questions: [
      {
        q: 'Was ist ein Vorteil von Onlinekursen?',
        options: ['Man kann lernen, wann man will.', 'Man hat mehr Kontakt zu anderen.', 'Man braucht kein Internet.'],
        answer: 0,
      },
      {
        q: 'Worüber ärgert sich der Teilnehmer manchmal?',
        options: ['Über die Kursgebühr.', 'Über die Lehrkraft.', 'Über die schlechte Verbindung.'],
        answer: 2,
      },
      { q: 'Aussage: Eine Teilnehmerin plant ihre Woche genau.', options: ['richtig', 'falsch', 'steht nicht im Text'], answer: 0 },
    ],
    source: UNIT_28_SOURCE,
  },
]

export const UNIT_28_SPEAKING: SpeakingScenario[] = [
  {
    id: UNIT_28_SPEAKING_ID,
    title: 'Ein Elterngespräch',
    titleRu: 'Беседа с учителем (родительская встреча)',
    titleKy: 'Мугалим менен ата-эненин сүйлөшүүсү',
    icon: '🎓',
    level: 'B1',
    goal: {
      ru: 'Вы родитель и говорите с учителем вашего сына (вымышленная школа). Расскажите, что сын был болен, задайте вопрос об учёбе и о подготовке к экзамену и договоритесь о присмотре. В середине разговора выясняется, что места для присмотра во второй половине дня нет: сохраните вежливость и найдите решение.',
      ky: 'Сиз ата-энесиз жана уулуңуздун мугалими менен сүйлөшүп жатасыз (ойдон чыгарылган мектеп). Уулуңуз ооруп калганын айтыңыз, окуу жана экзаменге даярдануу боюнча суроо бериңиз жана бала багуу боюнча макулдашыңыз. Сүйлөшүүнүн ортосунда түштөн кийинки бала багуу үчүн орун жок экени белгилүү болот: сылык бойдон калыңыз жана чечим табыңыз.',
    },
    turns: [
      {
        ai: 'Guten Tag, schön, dass Sie Zeit haben. Worüber möchten Sie mit mir sprechen?',
        aiRu: 'Добрый день, хорошо, что вы нашли время. О чём вы хотели бы со мной поговорить?',
        aiKy: 'Кайырлуу күн, убакыт тапканыңыз жакшы болду. Мен менен эмне жөнүндө сүйлөшкүңүз келет?',
        hints: [
          'Ich möchte über meinen Sohn sprechen.',
          'Er war letzte Woche krank.',
          'Ich habe auch eine Frage zum Unterricht.',
        ],
        keywords: ['sprechen', 'sohn', 'krank', 'frage'],
      },
      {
        ai: 'Ja, ich habe gesehen, dass er gefehlt hat. Geht es ihm wieder besser?',
        aiRu: 'Да, я видел, что он отсутствовал. Ему снова лучше?',
        aiKy: 'Ооба, мен анын келбей калганын көрдүм. Ал кайрадан жакшыбы?',
        hints: [
          'Ja, er ist wieder gesund.',
          'Ich schicke Ihnen die Entschuldigung morgen.',
          'Er hat sich zu Hause ausgeruht.',
        ],
        keywords: ['gesund', 'entschuldigung', 'ausgeruht', 'besser'],
      },
      {
        ai: 'Was ist Ihre Frage zum Unterricht?',
        aiRu: 'Какой у вас вопрос по поводу учёбы?',
        aiKy: 'Окуу боюнча кандай суроо бар?',
        hints: [
          'Wie bereitet sich mein Sohn am besten auf die Prüfung vor?',
          'Wird er die Prüfung wohl bestehen?',
          'Worauf soll er zu Hause achten?',
        ],
        keywords: ['prüfung', 'vorbereiten', 'achten', 'bestehen'],
      },
      {
        ai: 'Das ist eine gute Frage. Übrigens: Für die Betreuung am Nachmittag ist leider kein Platz frei.',
        aiRu: 'Хороший вопрос. Кстати: на присмотр во второй половине дня, к сожалению, нет свободного места.',
        aiKy: 'Жакшы суроо. Айтмакчы: түштөн кийинки бала багуу үчүн, тилекке каршы, бош орун жок.',
        hints: [
          'Das ist schade. Falls ein Platz frei wird, rufen Sie mich bitte an.',
          'Moment, ich überlege kurz. Gibt es eine Warteliste?',
          'Sobald Sie etwas wissen, schreiben Sie mir bitte.',
        ],
        keywords: ['falls', 'warteliste', 'sobald', 'platz'],
      },
      {
        ai: 'Ja, wir setzen Sie auf die Warteliste. Sobald ein Platz frei ist, melden wir uns. Passt Ihnen das?',
        aiRu: 'Да, мы внесём вас в список ожидания. Как только освободится место, мы свяжемся с вами. Вас это устраивает?',
        aiKy: 'Ооба, биз сизди күтүү тизмесине киргизебиз. Орун бошоору менен биз сиз менен байланышабыз. Бул сизге ылайыктуубу?',
        hints: [
          'Ja, das passt gut. Vielen Dank.',
          'Dann wird es wohl eine andere Lösung geben.',
          'Ich kümmere mich um eine andere Betreuung.',
        ],
        keywords: ['warteliste', 'passt', 'lösung', 'kümmere'],
      },
      {
        ai: 'Gern. Haben Sie noch eine Frage? Am Elternabend am Dienstag besprechen wir den Stundenplan.',
        aiRu: 'Охотно. Есть ли ещё вопросы? На родительском собрании во вторник мы обсудим расписание.',
        aiKy: 'Макул. Дагы суроолоруңуз барбы? Шейшембидеги ата-энелер чогулушунда биз сабак тартибин талкуулайбыз.',
        hints: [
          'Nein, das ist alles. Ich freue mich auf den Elternabend.',
          'Ich werde pünktlich da sein.',
          'Ich denke an die Anmeldung für die Ganztagsschule.',
        ],
        keywords: ['elternabend', 'freue', 'pünktlich', 'anmeldung'],
      },
    ],
    source: UNIT_28_SOURCE,
  },
]

const TIP_SELF = {
  ru: 'После написания пройдите по списку ниже и оцените себя сами: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
  ky: 'Жазып бүткөндөн кийин төмөнкү тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
}

export const UNIT_28_WRITING: WritingTask[] = [
  {
    id: 'b1-wr-28-01',
    unit: 28,
    level: 'B1',
    title: 'Eine Anfrage zu einem Kurs (halbformell)',
    situation: {
      ru: 'Вы хотите записаться на вечерний языковой курс (вымышленный). Напишите полуформальное письмо-запрос: скажите, чем вы интересуетесь (пара глагол + предлог), задайте вопросы о начале и стоимости, используйте falls / sobald / solange, один Futur I с wohl или с werden, назовите причину и вежливо попросите ответить. Не меньше 80 слов.',
      ky: 'Сиз кечки тил курсуна жазылгыңыз келет (ойдон чыгарылган). Жарым расмий суроо катын жазыңыз: эмнеге кызыкканыңызды айтыңыз (этиш + предлог жубу), башталышы жана баасы жөнүндө суроо бериңиз, falls / sobald / solange, wohl менен же werden менен бир Futur I колдонуңуз, себебин атаңыз жана жооп берүүнү сылык сураныңыз. Кеминде 80 сөз.',
    },
    formal: true,
    minWords: 80,
    mustInclude: [
      {
        label: 'Anrede und Gruß (Guten Tag Frau … / Mit freundlichen Grüßen)',
        patterns: ['guten tag', 'sehr geehrte', 'mit freundlichen grüßen', 'freundliche grüße'],
        explain: {
          ru: 'Вежливое обращение в начале и вежливое прощание в конце письма (форма Sie).',
          ky: 'Каттын башында сылык кайрылуу, аягында сылык коштошуу (Sie формасы).',
        },
      },
      {
        label: 'Verb mit Präposition (Ich interessiere mich für … / Ich bereite mich auf … vor)',
        patterns: ['interessiere mich für', 'bewerbe mich um', 'bereite mich', 'nehme an', 'träume von', 'freue mich auf', 'kümmere mich um'],
        explain: {
          ru: 'Одна пара глагол + предлог из списка юнита: Ich interessiere mich für …, Ich bereite mich auf … vor.',
          ky: 'Бөлүмдүн тизмесинен бир этиш + предлог жубу: Ich interessiere mich für …, Ich bereite mich auf … vor.',
        },
      },
      {
        label: 'Fragen zum Kurs (Wann beginnt der Kurs? Wie hoch ist die Kursgebühr?)',
        patterns: ['kursgebühr', 'kostet', 'kosten', 'beginnt', 'beginn', 'dauer'],
        explain: {
          ru: 'Задайте вежливо хотя бы один вопрос о начале, длительности или стоимости курса.',
          ky: 'Курстун башталышы, узактыгы же баасы жөнүндө жок дегенде бир суроону сылык бериңиз.',
        },
      },
      {
        label: 'falls / sobald / solange (Falls noch ein Platz frei ist, … )',
        patterns: ['falls', 'sobald', 'solange'],
        explain: {
          ru: 'Одно предложение с falls, sobald или solange: глагол в конце придаточного, в главной части — сразу после запятой.',
          ky: 'falls, sobald же solange менен бир сүйлөм: кошумча бөлүктө этиш аягында, башкы бөлүктө — үтүрдөн дароо кийин.',
        },
      },
      {
        label: 'Futur I (Ich werde den Kurs wohl gut schaffen)',
        patterns: ['werde ', 'wird wohl', 'werden wohl'],
        explain: {
          ru: 'Одно предложение с werden + инфинитив (из списка: sein, haben, kommen, gehen, schaffen, bestehen, lernen, studieren, arbeiten, geben), можно с wohl.',
          ky: 'werden + инфинитив менен бир сүйлөм (тизмеден: sein, haben, kommen, gehen, schaffen, bestehen, lernen, studieren, arbeiten, geben), wohl менен болушу мүмкүн.',
        },
      },
      {
        label: 'Ein Grund (… , denn ich arbeite / … , weil …)',
        patterns: ['denn', 'weil', 'deshalb'],
        explain: {
          ru: 'Назовите причину вашего интереса: denn (порядок слов обычный) или weil (глагол в конце).',
          ky: 'Кызыгууңуздун себебин атаңыз: denn (сөздөрдүн иреттери адаттагыдай) же weil (этиш аягында).',
        },
      },
      {
        label: 'Bitte um Antwort (Vielen Dank im Voraus / Bitte schreiben Sie mir)',
        patterns: ['antwort', 'vielen dank', 'bitte', 'könnten sie'],
        explain: {
          ru: 'Вежливая просьба ответить или благодарность: Vielen Dank im Voraus.',
          ky: 'Жооп берүүнү сылык суроо же ыраазычылык: Vielen Dank im Voraus.',
        },
      },
    ],
    model:
      'Guten Tag Frau Berger, ich interessiere mich für Ihren Abendkurs „Deutsch für den Beruf“. Ich arbeite tagsüber, deshalb suche ich einen berufsbegleitenden Kurs. Könnten Sie mir bitte sagen, wann der Kurs beginnt und wie hoch die Kursgebühr ist? Falls noch ein Platz frei ist, melde ich mich sofort an. Sobald ich Ihre Antwort habe, bereite ich mich auf den Test vor. Ich werde den Kurs wohl gut schaffen, denn ich bin motiviert. Vielen Dank im Voraus. Mit freundlichen Grüßen, Ali Demir',
    tips: [
      {
        ru: 'Начните вежливо: «Guten Tag Frau …» и закончите «Mit freundlichen Grüßen». Используйте Sie. Это полуформальное письмо: коротко, ясно, вежливо.',
        ky: 'Сылык баштаңыз: «Guten Tag Frau …» жана «Mit freundlichen Grüßen» менен аяктаңыз. Sie колдонуңуз. Бул жарым расмий кат: кыска, так, сылык.',
      },
      {
        ru: 'Пара глагол + предлог — целиком: «Ich interessiere mich für …» (Akkusativ), «Ich nehme an … teil» (Dativ). Futur I — werden на втором месте, инфинитив в конце: «Ich werde den Kurs wohl schaffen».',
        ky: 'Этиш + предлог жубу — бүтүндөй: «Ich interessiere mich für …» (Akkusativ), «Ich nehme an … teil» (Dativ). Futur I — werden экинчи орунда, инфинитив аягында: «Ich werde den Kurs wohl schaffen».',
      },
      {
        ru: 'Falls / sobald / solange: глагол в придаточном — в конце, а после запятой в главной части глагол сразу за запятой: «Falls ein Platz frei ist, melde ich mich an».',
        ky: 'Falls / sobald / solange: кошумча бөлүктө этиш аягында, ал эми үтүрдөн кийин башкы бөлүктө этиш үтүрдөн дароо кийин: «Falls ein Platz frei ist, melde ich mich an».',
      },
      TIP_SELF,
    ],
    source: UNIT_28_SOURCE,
  },
  {
    id: 'b1-wr-28-02',
    unit: 28,
    level: 'B1',
    title: 'Meine Meinung: Online lernen',
    situation: {
      ru: 'В чате курса обсуждают обучение онлайн. Напишите короткий комментарий: ваше мнение и причина, и одно слово по теме (например, Kurs, Konzentration, Vorteil, Nachteil). Не меньше 30 слов. Это небольшое задание на мнение и аргумент: взвесьте и плюсы, и минусы.',
      ky: 'Курстун чатында онлайн окуу талкууланып жатат. Кыска комментарий жазыңыз: пикириңиз жана себеби, жана теманы билдирген бир сөз (мисалы, Kurs, Konzentration, Vorteil, Nachteil). Кеминде 30 сөз. Бул пикирди жана далилди айтуу боюнча кичинекей тапшырма: артыкчылыктарды да, кемчиликтерди да ойлонуңуз.',
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
        label: 'Ein Wort zum Thema (online, Kurs, Konzentration, Vorteil, Nachteil, lernen)',
        patterns: ['online', 'kurs', 'konzentration', 'vorteil', 'nachteil', 'lernen', 'unterricht'],
        explain: {
          ru: 'Хотя бы одно слово по теме: онлайн, курс, концентрация, плюс, минус, учиться.',
          ky: 'Темага байланыштуу жок дегенде бир сөз: онлайн, курс, көңүл топтоо, артыкчылык, кемчилик, окуу.',
        },
      },
    ],
    model:
      'Ich finde, dass Onlinekurse praktisch sind, weil man zu Hause und zu jeder Zeit lernen kann. Ein Nachteil ist aber die Konzentration, denn zu Hause gibt es viele Ablenkungen. Ich werde online wohl gut lernen, solange ich einen festen Lernplan habe.',
    tips: [
      {
        ru: 'Начните с мнения: «Ich finde, dass …». Дайте причину с weil (глагол в конце) или denn. Назовите один плюс и один минус.',
        ky: 'Пикирден баштаңыз: «Ich finde, dass …». weil (этиш аягында) же denn менен себебин айтыңыз. Бир артыкчылык жана бир кемчиликти атаңыз.',
      },
      {
        ru: 'Используйте слова юнита: Lernplan, Konzentration, Lernstrategie, Fortschritt, anspruchsvoll, gründlich.',
        ky: 'Бөлүмдүн сөздөрүн колдонуңуз: Lernplan, Konzentration, Lernstrategie, Fortschritt, anspruchsvoll, gründlich.',
      },
      TIP_SELF,
    ],
    source: UNIT_28_SOURCE,
  },
  {
    id: 'b1-wr-28-03',
    unit: 28,
    level: 'B1',
    title: 'Eine Kursinfo weitergeben',
    situation: {
      ru: 'Вы получили информацию о курсе (вымышленную): «Der Sprachkurs beginnt am 5. September. Die Kursgebühr beträgt 150 Euro. Wer sich bis zum 1. August anmeldet, zahlt nur 135 Euro.» Расскажите подруге по-немецки в двух-трёх предложениях своими словами, что в ней написано: используйте «Die Kursinfo schreibt, dass …». Не меньше 30 слов. Это небольшое задание на пересказ (медиация): вы передаёте информацию, а не оцениваете её.',
      ky: 'Сиз курс жөнүндө маалымат алдыңыз (ойдон чыгарылган): «Der Sprachkurs beginnt am 5. September. Die Kursgebühr beträgt 150 Euro. Wer sich bis zum 1. August anmeldet, zahlt nur 135 Euro.» Анда эмне жазылганын курбуңузга немисче эки-үч сүйлөм менен өз сөзүңүз менен айтып бериңиз: «Die Kursinfo schreibt, dass …» колдонуңуз. Кеминде 30 сөз. Бул кайра айтып берүү (медиация) боюнча кичинекей тапшырма: сиз маалыматты өткөрөсүз, баалабайсыз.',
    },
    formal: false,
    minWords: 30,
    mustInclude: [
      {
        label: 'Wiedergeben (Die Kursinfo schreibt, dass …)',
        patterns: ['schreibt, dass', 'sagt, dass', 'steht, dass', 'laut '],
        explain: {
          ru: 'Передайте информацию с «schreibt, dass …»: глагол в конце, Sie → er / sie / man.',
          ky: 'Маалыматты «schreibt, dass …» менен айтып бериңиз: этиш аягында, Sie → er / sie / man.',
        },
      },
      {
        label: 'Der Beginn (5. September)',
        patterns: ['5. september', 'fünften september', 'september'],
        explain: { ru: 'Назовите, когда начинается курс.', ky: 'Курс качан башталарын атаңыз.' },
      },
      {
        label: 'Der Preis (150 / 135 Euro)',
        patterns: ['150', '135'],
        explain: { ru: 'Назовите стоимость (и скидку при ранней записи).', ky: 'Баасын (жана эрте жазылууда арзандатууну) атаңыз.' },
      },
      {
        label: 'Die Frist (bis zum 1. August)',
        patterns: ['1. august', 'ersten august', 'august'],
        explain: { ru: 'Назовите срок ранней записи.', ky: 'Эрте жазылуу мөөнөтүн атаңыз.' },
      },
    ],
    model:
      'Die Kursinfo schreibt, dass der Sprachkurs am 5. September beginnt. Er kostet 150 Euro. Wenn wir uns bis zum 1. August anmelden, zahlen wir nur 135 Euro. Ich möchte mich anmelden, sobald ich Zeit habe. Möchtest du mit mir den Kurs besuchen?',
    tips: [
      {
        ru: 'Передавайте только содержание: начало, цену, срок. Начните с «Die Kursinfo schreibt, dass …», глагол — в конце.',
        ky: 'Мазмунун гана өткөрүңүз: башталышы, баасы, мөөнөтү. «Die Kursinfo schreibt, dass …» менен баштаңыз, этиш — аягында.',
      },
      {
        ru: 'Меняйте форму обращения: «Wer sich anmeldet, zahlt …» → «Wenn wir uns anmelden, zahlen wir …». Время не меняется.',
        ky: 'Кайрылуу формасын алмаштырыңыз: «Wer sich anmeldet, zahlt …» → «Wenn wir uns anmelden, zahlen wir …». Чак өзгөрбөйт.',
      },
      TIP_SELF,
    ],
    source: UNIT_28_SOURCE,
  },
  {
    id: 'b1-wr-28-04',
    unit: 28,
    level: 'B1',
    title: 'Eine Entschuldigung an die Schule',
    situation: {
      ru: 'Ваш сын Йонас болел в понедельник и во вторник и не был в школе. Напишите короткую записку-объяснительную учительнице (вымышленной): назовите, кто болел и в какие дни, объясните причину, вежливо попросите извинить отсутствие и спросите, что нужно наверстать. Не меньше 30 слов. Это небольшая записка (формальная, Sie).',
      ky: 'Уулуңуз Йонас дүйшөмбүдө жана шейшембиде ооруп, мектепке бара алган жок. Мугалимге (ойдон чыгарылган) кыска кечирим катын жазыңыз: ким ооруганын жана кайсы күндөрү экенин атаңыз, себебин түшүндүрүңүз, келбей калганын кечирүүнү сылык суранып, эмнени толуктоо керек экенин сураңыз. Кеминде 30 сөз. Бул кичинекей кат (расмий, Sie).',
    },
    formal: true,
    minWords: 30,
    mustInclude: [
      {
        label: 'Anrede und Gruß (Sehr geehrte Frau … / Mit freundlichen Grüßen)',
        patterns: ['sehr geehrte', 'guten tag', 'mit freundlichen grüßen', 'freundliche grüße'],
        explain: {
          ru: 'Вежливое обращение и вежливое прощание.',
          ky: 'Сылык кайрылуу жана сылык коштошуу.',
        },
      },
      {
        label: 'Der Grund und die Tage (… war am Montag und am Dienstag krank)',
        patterns: ['krank', 'montag', 'dienstag'],
        explain: { ru: 'Назовите причину (болезнь) и дни отсутствия.', ky: 'Себебин (ооруу) жана келбеген күндөрдү атаңыз.' },
      },
      {
        label: 'Die Bitte (Ich bitte Sie, … zu entschuldigen / Bitte schreiben Sie mir)',
        patterns: ['entschuldig', 'bitte', 'bitte sie'],
        explain: { ru: 'Вежливая просьба извинить отсутствие.', ky: 'Келбей калганды кечирүүнү сылык суроо.' },
      },
      {
        label: 'Eine Frage (Was muss er nachholen?) oder falls / sobald',
        patterns: ['nachholen', 'hausaufgaben', 'falls', 'sobald', 'wann'],
        explain: { ru: 'Спросите, что нужно наверстать, или используйте falls / sobald.', ky: 'Эмнени толуктоо керек экенин сураңыз же falls / sobald колдонуңуз.' },
      },
    ],
    model:
      'Sehr geehrte Frau Weber, mein Sohn Jonas war am Montag und am Dienstag krank. Er konnte deshalb nicht zur Schule kommen. Ich bitte Sie, sein Fehlen zu entschuldigen. Falls er Hausaufgaben nachholen muss, schreiben Sie mir bitte eine kurze Nachricht. Mit freundlichen Grüßen, Anna Roth',
    tips: [
      {
        ru: 'Пишите коротко и вежливо: кто, когда, почему, просьба. «Ich bitte Sie, … zu entschuldigen» — инфинитив с zu (юнит 23).',
        ky: 'Кыска жана сылык жазыңыз: ким, качан, эмне үчүн, өтүнүч. «Ich bitte Sie, … zu entschuldigen» — zu менен инфинитив (23-бөлүм).',
      },
      {
        ru: 'Не пишите подробностей о здоровье ребёнка: достаточно слова «krank» и дней отсутствия.',
        ky: 'Баланын ден соолугу боюнча майда-чүйдөсүн жазбаңыз: «krank» сөзү жана келбеген күндөр жетиштүү.',
      },
      TIP_SELF,
    ],
    source: UNIT_28_SOURCE,
  },
]
