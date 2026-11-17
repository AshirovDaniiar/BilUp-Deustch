import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_20_SOURCE } from '../provenance'

/**
 * Unit 20 texts (Stage 7K): 2 listening dialogues, 2 readings, 1 speaking scenario, 1 writing task — varied registers, NOT all formal e-mails.
 * L1 = two friends plan the weekend (informal, du); L2 = a colleague is invited to a birthday party (formal-friendly, Sie); R1 = a personal invitation card
 * (informal, du); R2 = a short e-mail exchange between two friends (a polite decline with a reason and an alternative); S1 = negotiating a weekend plan with a
 * friend (du); W1 = an informal invitation message. Rules applied: `Wie wäre es mit …?` only as a fixed chunk; `Lass uns …` du-imperative only; vorhaben with the particle at the
 * end; connectors und / aber / oder / denn / weil / wenn / dass / deshalb with correct word order; dates with digits (14. Juni); no `werden`, no Konjunktiv II
 * except the chunk, no `zu` + Infinitiv, no ihr-imperative, no `obwohl` / `damit`. Receptive words (ablehnen, Alternative, abstimmen, Kompromiss) occur only in
 * texts and word cards, never as a required answer.
 */
export const UNIT_20_LISTENING: ListeningExercise[] = [
  {
    id: 'a2-li-20-01',
    unit: 20,
    level: 'A2',
    title: 'Was machen wir am Samstag?',
    lines: [
      { speaker: 'Mia', text: 'Hallo Jonas! Was hast du am Samstag vor?', ru: 'Привет, Йонас! Какие у тебя планы на субботу?', ky: 'Салам, Йонас! Ишемби күнүнө сенин пландарың кандай?' },
      { speaker: 'Jonas', text: 'Noch nichts. Wollen wir etwas zusammen machen?', ru: 'Пока ничего. Хочешь, сделаем что-нибудь вместе?', ky: 'Азырынча эч нерсе. Чогуу бир нерсе кылабызбы?' },
      { speaker: 'Mia', text: 'Gern! Wie wäre es mit einem Ausflug an den See?', ru: 'С удовольствием! Как насчёт поездки к озеру?', ky: 'Кубанычта! Көлгө сейилдеп барсакчы?' },
      { speaker: 'Jonas', text: 'Die Wettervorhersage sagt Regen. Dann ist der See nicht schön. Lass uns ins Kino gehen!', ru: 'Прогноз обещает дождь. Тогда у озера будет неприятно. Давай сходим в кино!', ky: 'Аба ырайынын божомолу жамгыр деп айтат. Анда көлдө жагымсыз болот. Келчи, киного барып келели!' },
      { speaker: 'Mia', text: 'Ins Kino? Ich war diese Woche schon im Kino. Ich schlage vor, dass wir ins Museum gehen.', ru: 'В кино? Я уже была на этой неделе в кино. Я предлагаю пойти в музей.', ky: 'Киногобу? Мен бул жумада киного барып келгем. Мен музейге барууну сунуштайм.' },
      { speaker: 'Jonas', text: 'Das Museum finde ich langweilig, denn ich war schon oft dort. Wie wäre es mit Kino und danach Pizza?', ru: 'Музей я считаю скучным, ведь я часто там бывал. А как насчёт кино и потом пиццы?', ky: 'Музей мага кызыксыз сезилет, анткени мен ал жерде көп болгом. Кино, анан пицца кандай болот?' },
      { speaker: 'Mia', text: 'Sollen wir abstimmen? Ich bin auch für Kino und Pizza.', ru: 'Проголосуем? Я тоже за кино и пиццу.', ky: 'Добуш беребизби? Мен да кино менен пиццанын тарапкерүмүн.' },
      { speaker: 'Jonas', text: 'Dann sind wir einverstanden. Das ist ein Kompromiss! Wann treffen wir uns?', ru: 'Значит, мы согласны. Это компромисс! Когда встретимся?', ky: 'Анда экөөбүз тең макулбуз. Бул эки тараптын макулдашуусу! Качан жолугабыз?' },
      { speaker: 'Mia', text: 'Spätestens um halb vier. Der Film beginnt um vier.', ru: 'Самое позднее в половине четвёртого. Фильм начинается в четыре.', ky: 'Эң кеч дегенде саат үч жарымда. Тасма төрттө башталат.' },
      { speaker: 'Jonas', text: 'Okay, bis Samstag! Ich bringe die Karten mit.', ru: 'Хорошо, до субботы! Я принесу билеты.', ky: 'Макул, ишембиге чейин! Мен билеттерди алып келем.' },
    ],
    questions: [
      { q: 'Was schlägt Mia zuerst vor?', options: ['Einen Kinobesuch', 'Einen Ausflug an den See', 'Einen Besuch im Museum'], answer: 1 },
      { q: 'Warum ist der See keine gute Idee?', options: ['Es regnet am Samstag.', 'Der See ist zu weit.', 'Jonas hat keine Zeit.'], answer: 0 },
      { q: 'Was machen die beiden am Samstag?', options: ['Museum und Pizza', 'Nur Kino', 'Kino und danach Pizza'], answer: 2 },
      { q: 'Wann wollen sie sich spätestens treffen?', options: ['Um vier Uhr', 'Um halb vier', 'Um halb fünf'], answer: 1 },
    ],
    keywords: ['Samstag', 'Kino', 'Museum', 'Pizza', 'Kompromiss'],
    source: UNIT_20_SOURCE,
  },
  {
    id: 'a2-li-20-02',
    unit: 20,
    level: 'A2',
    title: 'Eine Einladung zum Geburtstag',
    lines: [
      { speaker: 'Herr Brandt', text: 'Frau Aydin, ich habe am 12. Mai Geburtstag. Ich möchte Sie zu meiner Feier einladen.', ru: 'Госпожа Айдын, у меня 12 мая день рождения. Я хотел бы пригласить вас на мой праздник.', ky: 'Айдын айым, менин туулган күнүм 12-майда. Мен сизди өзүмдүн майрамыма чакыргым келет.' },
      { speaker: 'Frau Aydin', text: 'Das ist nett, vielen Dank! Wo feiern Sie?', ru: 'Как мило, большое спасибо! Где вы празднуете?', ky: 'Бул абдан сылык, чоң рахмат! Сиз кайда майрамдайсыз?' },
      { speaker: 'Herr Brandt', text: 'Bei mir zu Hause, ab 18 Uhr.', ru: 'У меня дома, с 18 часов.', ky: 'Менин үйүмдө, саат 18ден тартып.' },
      { speaker: 'Frau Aydin', text: 'Am 12. Mai? Ich möchte die Einladung nicht ablehnen. Leider habe ich da schon einen Termin.', ru: '12 мая? Я не хочу отклонять приглашение. К сожалению, у меня уже назначена встреча.', ky: '12-майдабы? Мен чакырууну четке каккым келбейт. Тилекке каршы, ал күнү менде жолугушуу бар.' },
      { speaker: 'Herr Brandt', text: 'Schade! Können Sie vielleicht später kommen?', ru: 'Жаль! Вы не могли бы прийти позже?', ky: 'Аябай өкүнүчтүү! Кийинчерээк келе албайсызбы?' },
      { speaker: 'Frau Aydin', text: 'Der Termin ist bis 19 Uhr. Ich komme gern um halb acht, wenn das okay ist.', ru: 'Встреча до 19 часов. Я с удовольствием приду в половине восьмого, если это нормально.', ky: 'Жолугушуу саат 19га чейин. Эгер болсо, мен саат жети жарымда кубанычта келем.' },
      { speaker: 'Herr Brandt', text: 'Natürlich! Das ist kein Problem. Bringen Sie nichts mit. Wir haben genug.', ru: 'Конечно! Это не проблема. Ничего не приносите. У нас всего достаточно.', ky: 'Албетте! Бул көйгөй эмес. Эч нерсе алып келбеңиз. Бизде жетиштүү.' },
      { speaker: 'Frau Aydin', text: 'Doch, ich bringe ein Geschenk mit. Es ist doch Ihr Geburtstag!', ru: 'Нет, я принесу подарок. Это же ваш день рождения!', ky: 'Жок, мен белек алып келем. Бул сиздин туулган күнүңүз да!' },
      { speaker: 'Herr Brandt', text: 'Das ist sehr nett. Also sagen Sie zu?', ru: 'Это очень мило. Значит, вы принимаете приглашение?', ky: 'Бул абдан сылык. Анда сиз келем деп убада бересизби?' },
      { speaker: 'Frau Aydin', text: 'Ja, ich sage zu. Ich gratuliere schon jetzt und wünsche Ihnen viel Spaß!', ru: 'Да, я принимаю приглашение. Я поздравляю уже сейчас и желаю вам хорошо повеселиться!', ky: 'Ооба, мен келем деп убада берем. Мен азыртан эле куттуктайм жана сизге жакшы эс алууну каалайм!' },
    ],
    questions: [
      { q: 'Wann ist die Feier?', options: ['Am 12. Mai', 'Am 2. Mai', 'Am 21. Mai'], answer: 0 },
      { q: 'Warum kann Frau Aydin nicht früh kommen?', options: ['Sie ist krank.', 'Sie arbeitet im Ausland.', 'Sie hat bis 19 Uhr einen Termin.'], answer: 2 },
      { q: 'Wann kommt Frau Aydin?', options: ['Um 18 Uhr', 'Um halb acht', 'Um 19 Uhr'], answer: 1 },
      { q: 'Was bringt Frau Aydin mit?', options: ['Ein Geschenk', 'Einen Kuchen', 'Nichts'], answer: 0 },
    ],
    keywords: ['Geburtstag', 'Feier', 'Einladung', 'Termin', 'Geschenk'],
    source: UNIT_20_SOURCE,
  },
]

export const UNIT_20_READING: ReadingText[] = [
  {
    id: 'a2-re-20-01',
    unit: 20,
    level: 'A2',
    title: 'Einladung zu meiner Party',
    body: [
      'Einladung zu meiner Party',
      'Liebe Anna, ich habe am 14. Juni Geburtstag. Ich lade dich herzlich zu meiner Party ein.',
      'Wann? Samstag, 14. Juni, ab 19 Uhr. Wo? Im Garten, Gartenstraße 5.',
      'Jeder bringt etwas zu essen oder zu trinken mit. Ein Geschenk brauchst du nicht.',
      'Bitte antworte bis zum 7. Juni: Kommst du? Dann kann ich besser planen.',
      'Deine Lena',
    ],
    gloss: [
      { word: 'herzlich', ru: 'сердечно, от души', ky: 'чын жүрөктөн', example: 'Wir laden dich herzlich ein.', grammar: 'наречие: herzlich einladen; без окончаний', grammarKy: 'тактооч: herzlich einladen; жалгоосуз', related: ['die Einladung', 'einladen'] },
      { word: 'Jeder', ru: 'каждый, все', ky: 'ар бир адам, баары', example: 'Jeder bringt etwas mit.', grammar: 'jeder — местоимение «каждый»; глагол в форме er (bringt)', grammarKy: 'jeder — «ар бир» ат атооч; этиш er формасында (bringt)', related: ['mitbringen', 'das Geschenk'] },
      { word: 'etwas zu essen oder zu trinken', ru: 'что-нибудь поесть или попить', ky: 'жегенге же ичкенге бир нерсе', example: 'Ich habe etwas zu trinken mitgebracht.', grammar: 'устойчивое сочетание: etwas zu essen / zu trinken; учить целиком', grammarKy: 'туруктуу сөз айкашы: etwas zu essen / zu trinken; бүтүндөй жаттоо керек', related: ['mitbringen', 'die Party'] },
      { word: 'antworte', ru: 'ответь', ky: 'жооп бер', example: 'Antworte bitte bald.', grammar: 'повелительное наклонение на «du»: antworte (корень + e)', grammarKy: '«du» формасындагы буйрук ыңгайы: antworte (уңгу + e)', related: ['zusagen', 'bald'] },
      { word: 'Gartenstraße 5', ru: 'улица Гартенштрассе, дом 5', ky: 'Гартенштрассе көчөсү, 5-үй', example: 'Ich wohne in der Gartenstraße 5.', grammar: 'адрес: название улицы + номер дома', grammarKy: 'дарек: көчөнүн аты + үйдүн номери', related: ['die Verabredung', 'die Feier'] },
    ],
    questions: [
      { q: 'Was ist der Anlass der Einladung?', options: ['Eine Hochzeit', 'Ein Geburtstag', 'Ein Konzert'], answer: 1 },
      { q: 'Wo ist die Party?', options: ['Im Café', 'Bei Anna zu Hause', 'Im Garten'], answer: 2 },
      { q: 'Bis wann soll Anna antworten?', options: ['Bis zum 7. Juni', 'Bis zum 14. Juni', 'Bis zum 1. Juni'], answer: 0 },
    ],
    source: UNIT_20_SOURCE,
  },
  {
    id: 'a2-re-20-02',
    unit: 20,
    level: 'A2',
    title: 'E-Mails: Absage und Alternative',
    body: [
      'Von Nora an Tom',
      'Hallo Tom, danke für die Einladung zum Grillen! Leider kann ich am Samstag nicht kommen, denn ich muss arbeiten. Wie wäre es mit Sonntag? Da habe ich Zeit und bringe einen Salat mit. Liebe Grüße, Nora',
      'Von Tom an Nora',
      'Hallo Nora, schade! Am Sonntag geht es leider nicht, weil meine Eltern kommen. Ich habe eine Alternative: Wir grillen am Freitag nach der Arbeit. Dann kannst du kommen, wenn du willst. Antworte mir bitte bis morgen. Tom',
    ],
    gloss: [
      { word: 'Grillen', ru: 'барбекю, жарка на гриле', ky: 'мангалда тамак бышыруу', example: 'Wir gehen zum Grillen in den Park.', grammar: 'das Grillen — существительное от глагола grillen; «zum Grillen» = «на барбекю»', grammarKy: 'das Grillen — grillen этишинен жасалган зат атооч; «zum Grillen» = «мангалга»', related: ['die Einladung', 'die Feier'] },
      { word: 'Wie wäre es mit Sonntag?', ru: 'А как насчёт воскресенья?', ky: 'Жекшемби кандай болот?', example: 'Wie wäre es mit Montag?', grammar: 'готовое выражение-предложение: Wie wäre es mit + существительное; учить целиком', grammarKy: 'даяр сунуш сөз айкашы: Wie wäre es mit + зат атооч; бүтүндөй жаттоо керек', related: ['der Vorschlag', 'vorschlagen'] },
      { word: 'Eltern', ru: 'родители', ky: 'ата-эне', example: 'Meine Eltern kommen zu Besuch.', grammar: 'только множественное число: die Eltern', grammarKy: 'көптүк санда гана: die Eltern', related: ['die Verabredung', 'sicher'] },
      { word: 'nach der Arbeit', ru: 'после работы', ky: 'иштен кийин', example: 'Nach der Arbeit gehe ich schwimmen.', grammar: 'nach + Dativ: nach der Arbeit (die Arbeit — женский род)', grammarKy: 'nach + Dativ: nach der Arbeit (die Arbeit — аял жынысы)', related: ['spätestens', 'bald'] },
      { word: 'wenn du willst', ru: 'если хочешь', ky: 'кааласаң', example: 'Komm doch, wenn du willst.', grammar: 'wenn + глагол в конце: wenn du willst; предложение условия', grammarKy: 'wenn + этиш аягында: wenn du willst; шарт сүйлөмү', related: ['einverstanden', 'die Möglichkeit'] },
    ],
    questions: [
      { q: 'Warum kann Nora am Samstag nicht kommen?', options: ['Sie muss arbeiten.', 'Sie ist krank.', 'Sie hat keine Lust.'], answer: 0 },
      { q: 'Warum geht Sonntag für Tom nicht?', options: ['Er arbeitet am Sonntag.', 'Seine Eltern kommen.', 'Er hat keinen Salat.'], answer: 1 },
      { q: 'Was schlägt Tom vor?', options: ['Sonntag im Park', 'Samstag am Abend', 'Freitag nach der Arbeit'], answer: 2 },
    ],
    source: UNIT_20_SOURCE,
  },
]

export const UNIT_20_SPEAKING: SpeakingScenario[] = [
  {
    id: 'a2-sp-20-01',
    title: 'Wir planen das Wochenende',
    titleRu: 'Планируем выходные',
    titleKy: 'Дем алыш күндөрүн пландайбыз',
    icon: '📅',
    level: 'A2',
    goal: {
      ru: 'Вы с другом (на «du») планируете выходные. У вас разные желания: он хочет в поход, а вы устали. Предложите другой вариант (Wollen wir …? / Wie wäre es mit …?), объясните причину (weil / denn / deshalb), договоритесь о компромиссе и назначьте время.',
      ky: 'Сиз досуңуз менен («du» формасында) дем алыш күндөрүн пландап жатасыз. Экөөңүздүн каалооңуз башка: ал жөө жүрүшкө баргысы келет, ал эми сиз чарчадыңыз. Башка вариант сунуштаңыз (Wollen wir …? / Wie wäre es mit …?), себебин түшүндүрүңүз (weil / denn / deshalb), эки тараптын макулдашуусуна келип, убакытты бекитиңиз.',
    },
    turns: [
      {
        ai: 'Hi! Was machen wir am Wochenende? Ich möchte gern wandern.',
        aiRu: 'Привет! Что делаем на выходных? Я хотел бы сходить в поход.',
        aiKy: 'Салам! Дем алыш күндөрү эмне кылабыз? Мен жөө жүрүшкө баргым келет.',
        hints: ['Wie wäre es mit Schwimmen?', 'Wollen wir lieber ins Kino gehen?'],
        keywords: ['wie wäre es', 'wollen wir'],
      },
      {
        ai: 'Warum denn Kino? Das Wetter ist doch gut.',
        aiRu: 'Почему именно кино? Погода же хорошая.',
        aiKy: 'Эмнеге дал кино? Аба ырайы жакшы го.',
        hints: ['Ich bin müde, deshalb möchte ich nicht wandern.', 'Ich möchte nicht wandern, weil ich müde bin.'],
        keywords: ['weil', 'deshalb'],
      },
      {
        ai: 'Okay. Ich schlage vor: Am Vormittag wandern wir, am Nachmittag gehen wir ins Kino. Einverstanden? Das ist ein Kompromiss.',
        aiRu: 'Хорошо. Я предлагаю: утром мы идём в поход, днём — в кино. Согласен? Это компромисс.',
        aiKy: 'Макул. Мен сунуштайм: эртең менен жөө жүрүшкө барабыз, түштөн кийин киного барабыз. Макулбу? Бул эки тараптын макулдашуусу.',
        hints: ['Ja, einverstanden. Das ist eine gute Idee.', 'Ja, gern. Dann können wir beides machen.'],
        keywords: ['einverstanden', 'gute idee'],
      },
      {
        ai: 'Super! Wann treffen wir uns, und was bringst du mit?',
        aiRu: 'Отлично! Когда встретимся и что ты принесёшь?',
        aiKy: 'Мыкты! Качан жолугабыз жана сен эмне алып келесиң?',
        hints: ['Spätestens um 9 Uhr am Bahnhof.', 'Ich bringe etwas zu trinken mit.'],
        keywords: ['uhr', 'bringe'],
      },
    ],
    source: UNIT_20_SOURCE,
  },
]

export const UNIT_20_WRITING: WritingTask[] = [
  {
    id: 'a2-wr-20-01',
    unit: 20,
    level: 'A2',
    title: 'Eine Einladung zur Party',
    situation: {
      ru: 'Вы организуете вечеринку и пишете сообщение другу или подруге (на «du»). Напишите: по какому случаю вечеринка, дату (цифрой с точкой), место и время, что принести, одну причину с weil и просьбу ответить. Закончите приветом.',
      ky: 'Сиз кече уюштуруп, досуңузга билдирүү жазып жатасыз («du» формасында). Жазыңыз: кече кандай шартта өтөт, датасы (чекити бар цифра менен), жери жана убактысы, эмне алып келүү керек, weil менен бир себеп жана жооп берүүнү суроо. Саламдашуу менен аяктаңыз.',
    },
    formal: false,
    minWords: 60,
    mustInclude: [
      { label: 'Anrede (Hallo / Liebe / Lieber)', patterns: ['hallo', 'liebe', 'lieber', 'hi '] },
      { label: 'Anlass (Geburtstag / Party / Feier)', patterns: ['geburtstag', 'party', 'feier'] },
      {
        label: 'Datum mit Ordnungszahl (z. B. 21. Juni)',
        patterns: ['. januar', '. februar', '. märz', '. april', '. mai', '. juni', '. juli', '. august', '. september', '. oktober', '. november', '. dezember'],
      },
      { label: 'Ort und Uhrzeit (… bei mir / im Garten / ab 18 Uhr)', patterns: ['uhr'] },
      { label: 'Was soll mitgebracht werden? (Bring … mit)', patterns: ['mit'] },
      { label: 'Ein Grund mit „weil“', patterns: ['weil '] },
      { label: 'Bitte um Antwort (Antworte bitte / Kommst du?)', patterns: ['antworte', 'kommst du', 'sag mir', 'hast du zeit'] },
      { label: 'Gruß am Ende (Liebe Grüße / Bis bald)', patterns: ['grüße', 'bis bald', 'tschüss'] },
    ],
    model:
      'Hallo Sara, ich habe am 21. Juni Geburtstag und lade dich herzlich zu meiner Party ein. Wir feiern am Samstag ab 18 Uhr bei mir zu Hause. Bring bitte etwas zu trinken mit. Ich feiere im Garten, weil ich viele Freunde einlade. Hast du am Samstag Zeit? Antworte bitte bis zum 14. Juni. Ich freue mich sehr auf dich! Liebe Grüße, Ben',
    tips: [
      {
        ru: 'Это неформальное сообщение: пишите на «du», короткими предложениями. Начните с «Hallo …» или «Liebe …» и закончите «Liebe Grüße».',
        ky: 'Бул расмий эмес билдирүү: «du» формасында, кыска сүйлөмдөр менен жазыңыз. «Hallo …» же «Liebe …» деп баштап, «Liebe Grüße» деп аяктаңыз.',
      },
      {
        ru: 'Дата — цифрой с точкой: «am 21. Juni». Время и место: «am Samstag ab 18 Uhr bei mir zu Hause».',
        ky: 'Дата — чекити бар цифра менен: «am 21. Juni». Убакыт жана жер: «am Samstag ab 18 Uhr bei mir zu Hause».',
      },
      {
        ru: 'Что принести: «Bring bitte etwas zu trinken mit» (императив на «du», приставка mit — в конце). Причина: «…, weil ich viele Freunde einlade» — глагол в конце.',
        ky: 'Эмне алып келүү керек: «Bring bitte etwas zu trinken mit» («du» формасындагы буйрук, mit приставкасы аягында). Себеп: «…, weil ich viele Freunde einlade» — этиш аягында.',
      },
      {
        ru: 'Не забудьте попросить ответ: «Antworte bitte bis zum 14. Juni» или «Kommst du?». Для письма достаточно простых слов из юнита.',
        ky: 'Жооп сурап коюуну унутпаңыз: «Antworte bitte bis zum 14. Juni» же «Kommst du?». Кат үчүн бөлүмдөгү жөнөкөй сөздөр жетиштүү.',
      },
    ],
    source: UNIT_20_SOURCE,
  },
]
