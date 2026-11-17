import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_16_SOURCE } from '../provenance'

/**
 * Unit 16 texts (Stage 7G): 2 listening dialogues, 2 readings, 1 speaking scenario, 1 writing task.
 * Genre variety (brief): the listening dialogue L1 and the speaking task S1 are INFORMAL (du, friends / colleagues); L2 is a face-to-face ticket-counter
 * conversation (Sie), not a telephone call; the writing task is an informal blog / forum comment, not an e-mail. Rules applied: `Wie wäre es mit …?` and
 * `Ich hätte gern …` are the only Konjunktiv-II-looking chunks; ordinals only in dates; attributive adjectives only in the unit-13/15 scope; no `man`,
 * no `deshalb` / `denn` / `dass` / `obwohl`, no `lassen`, no zu + Infinitiv; the verb–preposition pairs are the six of the unit (all Akkusativ).
 */
export const UNIT_16_LISTENING: ListeningExercise[] = [
  {
    id: 'a2-li-16-01',
    unit: 16,
    level: 'A2',
    title: 'Was machen wir am Wochenende?',
    lines: [
      { speaker: 'Jonas', text: 'Hey Lea, was machst du am Wochenende?', ru: 'Привет, Леа, что ты делаешь на выходных?', ky: 'Салам, Леа, дем алыш күндөрү эмне кылат элең?' },
      { speaker: 'Lea', text: 'Noch nichts. Am liebsten bleibe ich zu Hause und lese. Und du?', ru: 'Пока ничего. Больше всего я люблю остаться дома и почитать. А ты?', ky: 'Азырынча эч нерсе. Баарынан көп үйдө калып китеп окугум келет. Ал эми сен?' },
      { speaker: 'Jonas', text: 'Ich gehe lieber raus. Wie wäre es mit einem Konzert im Park? Am Samstag ist ein Fest.', ru: 'Я лучше пойду на улицу. Как насчёт концерта в парке? В субботу там праздник.', ky: 'Мен тышка чыкканды жакшы көрөм. Паркта концертке барсак кандай? Ишемби күнү майрам болот.' },
      { speaker: 'Lea', text: 'Ein Konzert? Ich interessiere mich eigentlich mehr für Filme.', ru: 'Концерт? Вообще-то я больше интересуюсь фильмами.', ky: 'Концертпи? Чынында мен тасмаларга көбүрөөк кызыгам.' },
      { speaker: 'Jonas', text: 'Dann gehen wir ins Kino! Es gibt einen neuen Film. Alle sagen, er ist spannend.', ru: 'Тогда пойдём в кино! Вышел новый фильм. Все говорят, что он захватывающий.', ky: 'Анда кинотеатрга барабыз! Жаңы тасма чыкты. Баары аны толкундантуучу дейт.' },
      { speaker: 'Lea', text: 'Gut, aber ich gehe nicht gern abends ins Kino. Geht es auch am Nachmittag?', ru: 'Хорошо, но вечером я не люблю ходить в кино. Можно днём?', ky: 'Макул, бирок кечинде кинотеатрга барганды жактырбайм. Түштөн кийин болобу?' },
      { speaker: 'Jonas', text: 'Klar, am Samstag um 15 Uhr. Und danach gehen wir zum Fest, okay?', ru: 'Конечно, в субботу в 15 часов. А потом пойдём на праздник, хорошо?', ky: 'Албетте, ишемби күнү саат 15те. Андан кийин майрамга барабыз, макулбу?' },
      { speaker: 'Lea', text: 'Okay! So haben wir beide Spaß: erst Kino, dann Fest. Ich freue mich schon!', ru: 'Ладно! Так нам обоим будет весело: сначала кино, потом праздник. Я уже радуюсь!', ky: 'Макул! Ошентип экөөбүздүн тең көңүлүбүз ачылат: адегенде кинотеатр, анан майрам. Мен азыртан эле кубанып жатам!' },
      { speaker: 'Jonas', text: 'Super! Ich kaufe die Eintrittskarten online.', ru: 'Отлично! Я куплю билеты онлайн.', ky: 'Сонун! Мен кирүү билеттерин интернеттен сатып алам.' },
      { speaker: 'Lea', text: 'Prima. Schick mir eine Nachricht mit der Uhrzeit.', ru: 'Здорово. Пришли мне сообщение со временем.', ky: 'Жакшы. Мага убакыты менен билдирүү жибер.' },
    ],
    questions: [
      { q: 'Was macht Lea am liebsten?', options: ['Sie geht ins Kino.', 'Sie bleibt zu Hause und liest.', 'Sie geht zu einem Konzert.'], answer: 1 },
      { q: 'Was möchte Jonas am Samstag?', options: ['Zu einem Fest mit Konzert gehen.', 'Zu Hause bleiben.', 'Fußball spielen.'], answer: 0 },
      { q: 'Wann gehen sie ins Kino?', options: ['Am Samstag um 20 Uhr.', 'Am Sonntag um 15 Uhr.', 'Am Samstag um 15 Uhr.'], answer: 2 },
      { q: 'Was kauft Jonas online?', options: ['Zeitschriften', 'Eintrittskarten', 'Handys'], answer: 1 },
    ],
    keywords: ['Wochenende', 'Konzert', 'Kino', 'Eintrittskarten', 'online'],
    source: UNIT_16_SOURCE,
  },
  {
    id: 'a2-li-16-02',
    unit: 16,
    level: 'A2',
    title: 'An der Kinokasse',
    lines: [
      { speaker: 'Kassiererin', text: 'Guten Abend, was darf es sein?', ru: 'Добрый вечер, что вам угодно?', ky: 'Кайырлуу кеч, эмне каалайсыз?' },
      { speaker: 'Herr Kim', text: 'Guten Abend. Ich möchte Karten für den Film „Sommerregen“.', ru: 'Добрый вечер. Я хотел бы билеты на фильм «Летний дождь».', ky: 'Кайырлуу кеч. Мен «Жайкы жамгыр» тасмасына билеттерди алгым келет.' },
      { speaker: 'Kassiererin', text: 'Für heute oder für einen anderen Tag?', ru: 'На сегодня или на другой день?', ky: 'Бүгүнкү күнгөбү же башка күнгөбү?' },
      { speaker: 'Herr Kim', text: 'Am vierten Mai. Das ist ein Samstag.', ru: 'На четвёртое мая, это суббота.', ky: '4-майга, бул ишемби.' },
      { speaker: 'Kassiererin', text: 'Am vierten Mai läuft der Film um 18 und um 21 Uhr. Eine Karte kostet 9 Euro, für Kinder 6 Euro.', ru: 'Четвёртого мая фильм идёт в 18 и в 21 час. Билет стоит 9 евро, для детей 6 евро.', ky: '4-майда тасма саат 18де жана 21де көрсөтүлөт. Бир билет 9 евро, балдар үчүн 6 евро.' },
      { speaker: 'Herr Kim', text: 'Wir sind zwei Erwachsene und ein Kind. Wie viel kostet das zusammen?', ru: 'Нас двое взрослых и ребёнок. Сколько это стоит вместе?', ky: 'Биз эки чоң киши жана бир баласыз. Баары бирге канча турат?' },
      { speaker: 'Kassiererin', text: 'Zweimal 9 Euro und einmal 6 Euro: Das macht 24 Euro.', ru: 'Дважды по 9 евро и один раз 6 евро: с вас 24 евро.', ky: 'Эки жолу 9 евро жана бир жолу 6 евро: 24 евро болду.' },
      { speaker: 'Herr Kim', text: 'Gut, dann nehmen wir den Film um 18 Uhr. Kann ich die Karten auch online kaufen?', ru: 'Хорошо, тогда мы берём сеанс в 18 часов. Можно купить билеты и онлайн?', ky: 'Жакшы, анда биз саат 18деги көрсөтүүнү алабыз. Билеттерди интернеттен да сатып алсам болобу?' },
      { speaker: 'Kassiererin', text: 'Ja, aber heute können Sie bar oder mit Karte bezahlen.', ru: 'Да, но сегодня вы можете оплатить наличными или картой.', ky: 'Ооба, бирок бүгүн накталай же карта менен төлөй аласыз.' },
      { speaker: 'Herr Kim', text: 'Dann zahle ich mit Karte. Danke!', ru: 'Тогда я заплачу картой. Спасибо!', ky: 'Анда мен карта менен төлөйм. Рахмат!' },
    ],
    questions: [
      { q: 'Für welches Datum möchte Herr Kim Karten?', options: ['Für den vierten Mai', 'Für den dritten Mai', 'Für heute'], answer: 0 },
      { q: 'Wann läuft der Film am vierten Mai?', options: ['Um 16 und 19 Uhr', 'Um 20 und 22 Uhr', 'Um 18 und 21 Uhr'], answer: 2 },
      { q: 'Wie viel kostet alles zusammen?', options: ['18 Euro', '24 Euro', '27 Euro'], answer: 1 },
      { q: 'Wie möchte Herr Kim bezahlen?', options: ['Mit Karte', 'Bar', 'Online'], answer: 0 },
    ],
    keywords: ['Karten', 'Film', 'Mai', 'Euro', 'Karte'],
    source: UNIT_16_SOURCE,
  },
]

export const UNIT_16_READING: ReadingText[] = [
  {
    id: 'a2-re-16-01',
    unit: 16,
    level: 'A2',
    title: 'Kulturwoche im Stadtpark',
    body: [
      'Kulturwoche im Stadtpark',
      'Konzert: Freitag, 3. Mai, 20 Uhr. Eintritt 12 Euro.',
      'Ausstellung „Fotos aus aller Welt“: täglich von 10 bis 18 Uhr, vom 4. bis 19. Mai. Eintritt frei.',
      'Kindertheater: Sonntag, 5. Mai, 15 Uhr. Eintrittskarten: Erwachsene 6 Euro, Kinder 3 Euro. Karten online oder an der Kasse. Mehr Informationen online.',
    ],
    gloss: [
      { word: '3. Mai', ru: 'третье мая (читается: der dritte Mai)', ky: '3-май (окулушу: der dritte Mai)', example: 'Das Konzert ist am 3. Mai.', grammar: 'после цифры стоит точка — это порядковое число; в речи: am dritten Mai', grammarKy: 'цифрадан кийин чекит турат — бул иреттик сан; оозеки сүйлөөдө: am dritten Mai', related: ['das Konzert', 'der Feiertag'] },
      { word: 'vom 4. bis 19. Mai', ru: 'с 4 по 19 мая', ky: '4-майдан 19-майга чейин', example: 'Die Ausstellung ist vom 4. bis 19. Mai.', grammar: 'vom … bis …: период времени; вы понимаете эту форму, говорить так пока не нужно', grammarKy: 'vom … bis …: убакыт аралыгы; бул форманы түшүнөсүз, азырынча өзүңүз айтпайсыз', related: ['die Ausstellung', 'die Veranstaltung'] },
      { word: 'täglich', ru: 'ежедневно', ky: 'күн сайын', example: 'Das Museum ist täglich offen.', grammar: 'наречие от слова der Tag: täglich = «каждый день»', grammarKy: 'der Tag сөзүнөн жасалган тактооч: täglich = «ар күнү»', related: ['das Museum', 'die Ausstellung'] },
      { word: 'Eintritt frei', ru: 'вход свободный (бесплатно)', ky: 'кирүү акысыз', example: 'Im Museum ist der Eintritt heute frei.', grammar: 'der Eintritt — плата за вход; «frei» здесь значит «бесплатно»', grammarKy: 'der Eintritt — кирүү акысы; «frei» бул жерде «акысыз» дегенди билдирет', related: ['die Eintrittskarte', 'das Kino'] },
      { word: 'Erwachsene', ru: 'взрослые', ky: 'чоңдор', example: 'Erwachsene zahlen mehr als Kinder.', grammar: 'существительное от прилагательного; во множественном числе без артикля — Erwachsene', grammarKy: 'сын атоочтон жасалган зат атооч; көптүк санда артикльсиз — Erwachsene', related: ['die Veranstaltung', 'das Theater'] },
    ],
    questions: [
      { q: 'Wann ist das Konzert?', options: ['Am 4. Mai um 10 Uhr', 'Am 3. Mai um 20 Uhr', 'Am 5. Mai um 15 Uhr'], answer: 1 },
      { q: 'Wie viel kostet die Ausstellung?', options: ['12 Euro', '3 Euro', 'Sie ist frei.'], answer: 2 },
      { q: 'Was ist für Familien mit Kindern am besten?', options: ['Das Kindertheater', 'Das Konzert', 'Die Ausstellung'], answer: 0 },
    ],
    source: UNIT_16_SOURCE,
  },
  {
    id: 'a2-re-16-02',
    unit: 16,
    level: 'A2',
    title: 'Mein Handy und ich',
    body: [
      'Ich heiße Mara und habe mein Handy fast den ganzen Tag bei mir. Am Morgen lese ich die Nachrichten im Internet. Am Abend sehe ich Sendungen online. Ich finde Fernsehen langweilig.',
      'Ich mache viele Fotos und schicke sie meinen Freunden. Jede Woche lade ich eine neue App herunter. Mein Bruder spielt in einer Mannschaft, und ich schreibe ihm oft eine Nachricht. Meine Oma liest lieber die Zeitung.',
    ],
    gloss: [
      { word: 'den ganzen Tag', ru: 'целый день', ky: 'күнү бою', example: 'Ich arbeite den ganzen Tag.', grammar: 'выражение времени в Akkusativ (den Tag); прилагательное ganz получает -en: den ganzen Tag', grammarKy: 'Akkusativдеги убакыт айкашы (den Tag); ganz сын атоочу -en алат: den ganzen Tag', related: ['der Tag', 'das Handy'] },
      { word: 'bei mir', ru: 'при себе, со мной', ky: 'жанымда, өзүм менен', example: 'Ich habe mein Handy immer bei mir.', grammar: 'bei mir haben = «иметь при себе»: bei + Dativ (mir); устойчивое сочетание, учить целиком', grammarKy: 'bei mir haben = «жанында болуу»: bei + Dativ (mir); туруктуу сөз айкашы, бүтүндөй жаттоо керек', related: ['das Handy', 'die Nachricht'] },
      { word: 'Nachrichten', ru: 'новости', ky: 'жаңылыктар', example: 'Ich lese jeden Tag die Nachrichten.', grammar: 'die Nachricht — сообщение; во множественном числе die Nachrichten — ещё и «новости» (в газете, по телевизору)', grammarKy: 'die Nachricht — билдирүү; көптүк санда die Nachrichten — «жаңылыктар» дегенди да билдирет (гезитте, телевизорде)', related: ['die Zeitung', 'das Internet'] },
      { word: 'herunter', ru: 'скачиваю (lade … herunter)', ky: 'жүктөп алам (lade … herunter)', example: 'Ich lade ein Foto herunter.', grammar: 'отделяемая приставка: ich lade … herunter (инфинитив — herunterladen); здесь достаточно узнавать', grammarKy: 'приставка аягына чыгат: ich lade … herunter (инфинитив — herunterladen); бул жерде тааный билүү жетиштүү', related: ['die App', 'online'] },
      { word: 'schicke', ru: 'отправляю, посылаю', ky: 'жиберем', example: 'Ich schicke dir ein Foto.', grammar: 'schicken + Dativ (кому?) + Akkusativ (что?): ich schicke sie meinen Freunden', grammarKy: 'schicken + Dativ (кимге?) + Akkusativ (эмнени?): ich schicke sie meinen Freunden', related: ['das Foto', 'die Nachricht'] },
    ],
    questions: [
      { q: 'Was macht Mara am Morgen?', options: ['Sie liest die Nachrichten.', 'Sie sieht Sendungen.', 'Sie macht Fotos.'], answer: 0 },
      { q: 'Was findet Mara langweilig?', options: ['Das Handy', 'Das Fernsehen', 'Die Zeitung'], answer: 1 },
      { q: 'Was liest Maras Oma lieber?', options: ['Nachrichten im Internet', 'Eine Zeitschrift', 'Die Zeitung'], answer: 2 },
    ],
    source: UNIT_16_SOURCE,
  },
]

export const UNIT_16_SPEAKING: SpeakingScenario[] = [
  {
    id: 'a2-sp-16-01',
    title: 'Hobbys und Wochenende',
    titleRu: 'Хобби и выходные',
    titleKy: 'Хобби жана дем алыш күндөрү',
    icon: '🎬',
    level: 'A2',
    goal: {
      ru: 'Вы разговариваете с коллегой на «du» в перерыве. Расскажите, что вы любите делать, что вы делаете на выходных, когда это будет (дата) и что вы об этом думаете.',
      ky: 'Сиз тыныгууда кесиптешиңиз менен «du» формасында сүйлөшүп жатасыз. Эмне кылууну жакшы көрөрүңүздү, дем алыш күндөрү эмне кыларыңызды, ал качан болорун (дата) жана ал жөнүндө эмне ойлогонуңузду айтыңыз.',
    },
    turns: [
      {
        ai: 'Hallo! Was machst du eigentlich gern in deiner Freizeit?',
        aiRu: 'Привет! А что ты вообще любишь делать в свободное время?',
        aiKy: 'Салам! Бош убактыңда сен эмнени жасаганды жакшы көрөсүң?',
        hints: ['Ich spiele gern Fußball.', 'Am liebsten tanze ich.'],
        keywords: ['gern', 'liebsten'],
      },
      {
        ai: 'Und am Wochenende? Was machst du?',
        aiRu: 'А на выходных? Что ты делаешь?',
        aiKy: 'Ал эми дем алыш күндөрү? Эмне кыласың?',
        hints: ['Am Samstag gehe ich ins Kino.', 'Ich freue mich auf das Konzert.'],
        keywords: ['kino', 'freue'],
      },
      {
        ai: 'Ins Konzert? Wann ist das?',
        aiRu: 'На концерт? А когда это?',
        aiKy: 'Концертке? Ал качан болот?',
        hints: ['Am zwölften Mai um 20 Uhr.', 'Am 12. Mai.'],
        keywords: ['mai', 'uhr'],
      },
      {
        ai: 'Cool! Wie findest du die Band? Soll ich mitkommen?',
        aiRu: 'Круто! Как тебе эта группа? Мне пойти с тобой?',
        aiKy: 'Сонун! Бул топ сага кандай? Мен да барсамбы?',
        hints: ['Ich finde die Band spannend.', 'Komm doch mit!', 'Wie wäre es mit einer Eintrittskarte für dich?'],
        keywords: ['finde', 'mit'],
      },
    ],
    source: UNIT_16_SOURCE,
  },
]

export const UNIT_16_WRITING: WritingTask[] = [
  {
    id: 'a2-wr-16-01',
    unit: 16,
    level: 'A2',
    title: 'Ein Kommentar zum Film',
    situation: {
      ru: 'Вы смотрели фильм, были на концерте или на выставке. Напишите короткий неформальный комментарий для форума или блога (на «du»): что это было и когда (дата словами), что вы об этом думаете (два прилагательных), что вы любите больше всего, чем вы интересуетесь или чего ждёте, и дайте совет.',
      ky: 'Сиз тасма көрдүңүз, концертте же көргөзмөдө болдуңуз. Форум же блог үчүн кыска расмий эмес комментарий жазыңыз («du» формасында): ал эмне болгонун жана качан болгонун (датаны сөз менен), ал жөнүндө эмне ойлогонуңузду (эки сын атооч), эмнени баарынан көп жакшы көрөрүңүздү, эмнеге кызыгарыңызды же эмнени күтөрүңүздү жазып, кеңеш бериңиз.',
    },
    formal: false,
    minWords: 50,
    mustInclude: [
      {
        label: 'Datum mit Ordnungszahl (am dritten Mai / am 3. Mai)',
        patterns: [
          'am ersten', 'am zweiten', 'am dritten', 'am vierten', 'am fünften', 'am sechsten', 'am siebten', 'am achten', 'am neunten', 'am zehnten',
          'am elften', 'am zwölften', 'am dreizehnten', 'am vierzehnten', 'am fünfzehnten', 'am sechzehnten', 'am siebzehnten', 'am achtzehnten',
          'am neunzehnten', 'am zwanzigsten', 'am einundzwanzigsten', 'am zweiundzwanzigsten', 'am dreiundzwanzigsten', 'am vierundzwanzigsten',
          'am fünfundzwanzigsten', 'am sechsundzwanzigsten', 'am siebenundzwanzigsten', 'am achtundzwanzigsten', 'am neunundzwanzigsten',
          'am dreißigsten', 'am einunddreißigsten', 'am 1', 'am 2', 'am 3',
        ],
      },
      { label: 'Was (Film, Konzert, Ausstellung, Theater …)', patterns: ['film', 'konzert', 'ausstellung', 'theater', 'sendung', 'veranstaltung', 'museum', 'fest'] },
      { label: 'Meinung mit Adjektiven (spannend, langweilig, interessant, lustig …)', patterns: ['spannend', 'langweilig', 'interessant', 'lustig', 'toll', 'schön', 'super'] },
      { label: 'Vorliebe (gern / lieber / am liebsten)', patterns: ['am liebsten', 'lieber', 'gern'] },
      { label: 'Verb mit Präposition (interessieren für, freuen auf, warten auf …)', patterns: ['interessiere mich für', 'freue mich auf', 'freue mich über', 'gefreut', 'warte auf', 'denke an', 'spreche über', 'sprechen über'] },
      { label: 'Empfehlung (Du musst … sehen! Geh …)', patterns: ['musst', 'geh ', 'schau ', 'lohnt'] },
    ],
    model:
      'Ich habe am dritten Mai den neuen Film im Kino gesehen. Er war sehr spannend und lustig. Ich sehe am liebsten Filme im Kino, nicht im Fernseher. Ich habe mich schon lange auf den Film gefreut, und er war wirklich gut! Die Eintrittskarte kostet nur acht Euro. Ich interessiere mich auch für Konzerte. Du musst den Film unbedingt sehen! Geh am Wochenende hin.',
    tips: [
      {
        ru: 'Это неформальный комментарий: можно писать «du» и короткими предложениями. Начните с того, что это было и когда.',
        ky: 'Бул расмий эмес комментарий: «du» формасын жана кыска сүйлөмдөрдү колдонсоңуз болот. Эмне болгонунан жана качан болгонунан баштаңыз.',
      },
      {
        ru: 'Дата: «am dritten Mai» — порядковое число с окончанием -n после am. До 19 — окончание -te, с 20 — -ste.',
        ky: 'Дата: «am dritten Mai» — am сөзүнөн кийин -n аякталышы бар иреттик сан. 19га чейин -te, 20дан баштап -ste.',
      },
      {
        ru: 'Мнение и предпочтение: «Er war sehr spannend und lustig», «Ich sehe am liebsten Filme im Kino». После am liebsten глагол остаётся вторым.',
        ky: 'Пикир жана артыкчылык: «Er war sehr spannend und lustig», «Ich sehe am liebsten Filme im Kino». am liebsten сөзүнөн кийин этиш экинчи орунда калат.',
      },
      {
        ru: 'Глагол с предлогом: «Ich habe mich auf den Film gefreut» (Akkusativ). Совет: «Du musst den Film sehen!» или «Geh hin!».',
        ky: 'Предлогдуу этиш: «Ich habe mich auf den Film gefreut» (Akkusativ). Кеңеш: «Du musst den Film sehen!» же «Geh hin!».',
      },
    ],
    source: UNIT_16_SOURCE,
  },
]
