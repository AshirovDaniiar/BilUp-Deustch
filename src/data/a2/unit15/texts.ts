import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_15_SOURCE } from '../provenance'

/**
 * Unit 15 texts (Stage 7F): 2 listening dialogues, 2 readings, 1 speaking scenario, 1 writing task.
 * Rules applied: polite chunks from a CLOSED list (`Können Sie …?`, `Darf ich …?`, `Ich möchte …`, `Ich hätte gern …`); `hätte` occurs only in `hätte gern`;
 * attributive adjectives only after ein-/kein-/mein- or the definite article / dieser / welcher in Nominativ and Akkusativ (never after a Dativ preposition, never plural
 * without article); no `man`, no `als` / `dass` / `deshalb`, no ordinals, no `lassen`. Food, measures and clothes are named as German items. Prices are plain numbers.
 */
export const UNIT_15_LISTENING: ListeningExercise[] = [
  {
    id: 'a2-li-15-01',
    unit: 15,
    level: 'A2',
    title: 'Im Restaurant: Bestellen und bezahlen',
    lines: [
      { speaker: 'Kellner', text: 'Guten Abend. Möchten Sie bestellen?', ru: 'Добрый вечер. Вы хотите сделать заказ?', ky: 'Кайырлуу кеч. Заказ бергиңиз келеби?' },
      { speaker: 'Frau Lehmann', text: 'Ja, bitte. Ist die Tomatensuppe vegetarisch?', ru: 'Да, пожалуйста. Томатный суп вегетарианский?', ky: 'Ооба, сураныч. Томат шорпосу эт жана балыксызбы?' },
      { speaker: 'Kellner', text: 'Ja, sie ist ohne Fleisch. Die Vorspeise kostet vier Euro.', ru: 'Да, он без мяса. Закуска стоит четыре евро.', ky: 'Ооба, ал этсиз. Алгачкы тамак төрт евро турат.' },
      { speaker: 'Frau Lehmann', text: 'Dann nehme ich die Suppe. Was gibt es als Hauptspeise?', ru: 'Тогда я беру суп. Что есть из основных блюд?', ky: 'Анда мен шорпону алам. Негизги тамакка эмне бар?' },
      { speaker: 'Kellner', text: 'Wir haben Fisch mit Salat und Nudeln mit Tomatensoße. Die Nudeln sind vegetarisch, aber ein bisschen scharf.', ru: 'У нас есть рыба с салатом и макароны с томатным соусом. Макароны вегетарианские, но немного острые.', ky: 'Бизде салат менен балык жана томат соусу менен макарон бар. Макарон этсиз, бирок бир аз ачуу.' },
      { speaker: 'Frau Lehmann', text: 'Ich hätte gern die Nudeln, aber bitte eine kleine Portion. Und eine Flasche Wasser.', ru: 'Я хотела бы макароны, но, пожалуйста, маленькую порцию. И бутылку воды.', ky: 'Мен макарон алгым келет, бирок сураныч, кичине үлүш. Жана бир бөтөлкө суу.' },
      { speaker: 'Kellner', text: 'Gern. Möchten Sie auch einen Nachtisch?', ru: 'Конечно. Хотите ещё десерт?', ky: 'Макул. Акыркы таттуу тамак да каалайсызбы?' },
      { speaker: 'Frau Lehmann', text: 'Nein, danke. Aber später die Rechnung, bitte.', ru: 'Нет, спасибо. Но позже, пожалуйста, счёт.', ky: 'Жок, рахмат. Бирок кийинчерээк эсепти алып келиңиз.' },
      { speaker: 'Kellner', text: 'Die Suppe, die Nudeln und das Wasser: Das macht zusammen 15 Euro.', ru: 'Суп, макароны и вода: с вас вместе 15 евро.', ky: 'Шорпо, макарон жана суу: баары бирге 15 евро болду.' },
      { speaker: 'Frau Lehmann', text: 'Hier sind 20 Euro. Stimmt so, danke. Das Essen hat sehr gut geschmeckt!', ru: 'Вот 20 евро. Сдачи не надо, спасибо. Еда была очень вкусной!', ky: 'Мына 20 евро. Кайтарымы керек эмес, рахмат. Тамак абдан даамдуу экен!' },
    ],
    questions: [
      { q: 'Was bestellt Frau Lehmann als Hauptspeise?', options: ['Fisch mit Salat', 'Nudeln mit Tomatensoße', 'Tomatensuppe'], answer: 1 },
      { q: 'Warum fragt sie nach der Suppe?', options: ['Sie isst kein Fleisch.', 'Sie hat keinen Hunger.', 'Sie mag keine Tomaten.'], answer: 0 },
      { q: 'Wie viel kostet das Essen zusammen?', options: ['12 Euro', '20 Euro', '15 Euro'], answer: 2 },
      { q: 'Welche Portion möchte sie?', options: ['Eine große', 'Eine kleine', 'Eine normale'], answer: 1 },
    ],
    keywords: ['Vorspeise', 'Hauptspeise', 'Portion', 'Rechnung', 'vegetarisch'],
    source: UNIT_15_SOURCE,
  },
  {
    id: 'a2-li-15-02',
    unit: 15,
    level: 'A2',
    title: 'Im Kleidungsgeschäft: Ein Mantel',
    lines: [
      { speaker: 'Verkäuferin', text: 'Guten Tag, kann ich Ihnen helfen?', ru: 'Добрый день, могу я вам помочь?', ky: 'Кайырлуу күн, сизге жардам бере алабы?' },
      { speaker: 'Herr Kim', text: 'Ja, ich suche einen Mantel für den Winter.', ru: 'Да, я ищу пальто на зиму.', ky: 'Ооба, мен кыш үчүн пальто издеп жатам.' },
      { speaker: 'Verkäuferin', text: 'Wir haben diesen grauen Mantel und den schwarzen Mantel. Welche Größe haben Sie?', ru: 'У нас есть вот это серое пальто и чёрное пальто. Какой у вас размер?', ky: 'Бизде мына боз пальто жана кара пальто бар. Сиздин өлчөмүңүз кандай?' },
      { speaker: 'Herr Kim', text: 'Größe 50. Der graue gefällt mir. Darf ich ihn anprobieren?', ru: 'Размер 50. Серое мне нравится. Можно примерить?', ky: '50-өлчөм. Боз пальто мага жагат. Кийип көрсөм болобу?' },
      { speaker: 'Verkäuferin', text: 'Natürlich, gern.', ru: 'Конечно, пожалуйста.', ky: 'Албетте, макул.' },
      { speaker: 'Herr Kim', text: 'Er ist leider zu klein. Haben Sie ihn eine Größe größer?', ru: 'К сожалению, он мал. У вас есть он на размер больше?', ky: 'Тилекке каршы, ал өтө кичине. Сизде ал бир өлчөм чоңураагы барбы?' },
      { speaker: 'Verkäuferin', text: 'Ja, hier ist Größe 52. Der Mantel ist heute reduziert: nur 90 Euro statt 120 Euro.', ru: 'Да, вот размер 52. Пальто сегодня со скидкой: всего 90 евро вместо 120 евро.', ky: 'Ооба, мына 52-өлчөм. Пальто бүгүн арзандатылган: 120 евро ордуна болгону 90 евро.' },
      { speaker: 'Herr Kim', text: 'Diese Größe passt gut. Das ist ein günstiger Preis.', ru: 'Этот размер подходит хорошо. Это выгодная цена.', ky: 'Бул өлчөм жакшы туура келет. Бул пайдалуу баа.' },
      { speaker: 'Verkäuferin', text: 'Zahlen Sie bar oder mit Karte?', ru: 'Вы платите наличными или картой?', ky: 'Накталайбы же карта менен төлөйсүзбү?' },
      { speaker: 'Herr Kim', text: 'Mit Karte, bitte. Kann ich auch eine Quittung haben?', ru: 'Картой, пожалуйста. Можно ещё и чек?', ky: 'Карта менен, сураныч. Квитанция да берсеңиз болобу?' },
    ],
    questions: [
      { q: 'Welchen Mantel möchte Herr Kim anprobieren?', options: ['Den grauen', 'Den schwarzen', 'Beide'], answer: 0 },
      { q: 'Was ist das Problem mit Größe 50?', options: ['Sie ist zu groß.', 'Sie ist zu teuer.', 'Sie ist zu klein.'], answer: 2 },
      { q: 'Wie viel kostet der Mantel heute?', options: ['120 Euro', '90 Euro', '52 Euro'], answer: 1 },
      { q: 'Wie bezahlt Herr Kim?', options: ['Mit Karte', 'Bar', 'Mit Quittung'], answer: 0 },
    ],
    keywords: ['Mantel', 'Größe', 'reduziert', 'Quittung', 'anprobieren'],
    source: UNIT_15_SOURCE,
  },
]

export const UNIT_15_READING: ReadingText[] = [
  {
    id: 'a2-re-15-01',
    unit: 15,
    level: 'A2',
    title: 'Café Sonne: Speisekarte',
    body: [
      'Café Sonne – Speisekarte',
      'Vorspeise: Tomatensuppe 4,50 Euro (vegetarisch). Salat mit Brot 5 Euro.',
      'Hauptspeise: Fisch mit Salat 12 Euro. Nudeln mit Tomatensoße 8 Euro (vegetarisch, scharf). Wurst mit Brot 7 Euro.',
      'Nachtisch: Eis 3 Euro. Kuchen mit Sahne 4 Euro. Wasser (Flasche) 3 Euro. Kleine Portion: 2 Euro weniger.',
    ],
    gloss: [
      { word: 'Tomatensoße', ru: 'томатный соус', ky: 'томат соусу', example: 'Die Nudeln mit Tomatensoße sind lecker.', grammar: 'составное существительное: die Tomate + die Soße = die Tomatensoße (артикль — по последнему слову; между словами появляется -n-)', grammarKy: 'татаал зат атооч: die Tomate + die Soße = die Tomatensoße (артикль акыркы сөз боюнча; сөздөрдүн ортосунда -n- пайда болот)', related: ['die Tomate', 'die Nudeln'] },
      { word: 'Sahne', ru: 'сливки', ky: 'каймак', example: 'Ich esse Kuchen mit Sahne.', grammar: 'Kuchen mit Sahne: после mit — Dativ, но слово без артикля, поэтому форма не меняется', grammarKy: 'Kuchen mit Sahne: mit сөзүнөн кийин Dativ, бирок сөз артикльсиз, ошондуктан форма өзгөрбөйт', related: ['der Nachtisch', 'süß'] },
      { word: '2 Euro weniger', ru: 'на 2 евро дешевле', ky: '2 евро арзаныраак', example: 'Die kleine Portion kostet 2 Euro weniger.', grammar: 'weniger — «меньше»; «2 Euro weniger» = цена снижена на два евро', grammarKy: 'weniger — «азыраак»; «2 Euro weniger» = баа эки евро арзандатылган', related: ['die Portion', 'reduziert'] },
      { word: 'Kleine Portion', ru: 'маленькая порция', ky: 'кичине үлүш', example: 'Kleine Portion, bitte.', grammar: 'в меню: kleine Portion без артикля — краткая запись; вы понимаете её, но сами говорите «eine kleine Portion»', grammarKy: 'менюда: kleine Portion артикльсиз — кыска жазуу; аны түшүнөсүз, бирок өзүңүз «eine kleine Portion» дейсиз', related: ['die Portion', 'die Vorspeise'] },
      { word: '4,50 Euro', ru: 'четыре евро пятьдесят центов', ky: 'төрт евро элүү цент', example: 'Die Suppe kostet 4,50 Euro.', grammar: 'в Германии десятичная запятая: 4,50 читается «vier Euro fünfzig»', grammarKy: 'Германияда ондук үтүр колдонулат: 4,50 «vier Euro fünfzig» деп окулат', related: ['kosten', 'der Preis'] },
    ],
    questions: [
      { q: 'Was ist vegetarisch und kostet weniger als 5 Euro?', options: ['Der Fisch mit Salat', 'Die Tomatensuppe', 'Die Wurst mit Brot'], answer: 1 },
      { q: 'Wie viel kostet eine kleine Portion Nudeln?', options: ['8 Euro', '10 Euro', '6 Euro'], answer: 2 },
      { q: 'Was kostet am meisten?', options: ['Der Fisch mit Salat', 'Der Kuchen mit Sahne', 'Das Eis'], answer: 0 },
    ],
    source: UNIT_15_SOURCE,
  },
  {
    id: 'a2-re-15-02',
    unit: 15,
    level: 'A2',
    title: 'Angebote und Service',
    body: [
      'Angebote der Woche bei Markt Meyer',
      'Äpfel: 1 Kilo 2 Euro. Käse: 100 Gramm 1 Euro. Wasser: 6 Flaschen 3 Euro. Nur bis Samstag! Lieferung ab 30 Euro kostenlos.',
      'Service: Reparatur von Fahrrädern in der Werkstatt, Montag bis Freitag von 9 bis 17 Uhr. Wir liefern Ihr Fahrrad auch nach Hause.',
    ],
    gloss: [
      { word: 'Angebote', ru: 'предложения, акции', ky: 'сунуштар, акциялар', example: 'Heute gibt es viele Angebote.', grammar: 'множественное число от das Angebot; Angebote der Woche = «предложения недели»', grammarKy: 'das Angebot сөзүнүн көптүк түрү; Angebote der Woche = «жуманын сунуштары»', related: ['reduziert', 'der Preis'] },
      { word: 'kostenlos', ru: 'бесплатно', ky: 'акысыз', example: 'Die Lieferung ist kostenlos.', grammar: 'kosten + -los («без»): kostenlos = «без расходов»', grammarKy: 'kosten + -los («жок»): kostenlos = «чыгымсыз»', related: ['kosten', 'die Lieferung'] },
      { word: 'ab 30 Euro', ru: 'от 30 евро', ky: '30 еврондон баштап', example: 'Ab 30 Euro ist die Lieferung gratis.', grammar: 'ab + сумма: условие «начиная с этой суммы»', grammarKy: 'ab + сумма: «ушул суммадан баштап» шарты', related: ['die Lieferung', 'reduziert'] },
      { word: 'Wir liefern', ru: 'мы доставляем', ky: 'биз жеткирип беребиз', example: 'Wir liefern Ihre Tomaten bis 18 Uhr.', grammar: 'liefern — спрягается как обычный глагол: ich liefere, wir liefern; здесь только узнавание', grammarKy: 'liefern — кадимки этиштей жакталат: ich liefere, wir liefern; бул жерде тааныш гана', related: ['die Lieferung', 'die Werkstatt'] },
      { word: 'Service', ru: 'сервис, обслуживание', ky: 'тейлөө, кызмат', example: 'Der Service ist gut.', grammar: 'слово из английского языка; артикль — der Service; в тексте — заголовок раздела', grammarKy: 'англис тилинен кирген сөз; артикль — der Service; тексте — бөлүмдүн аталышы', related: ['die Reparatur', 'die Werkstatt'] },
    ],
    questions: [
      { q: 'Wie viel kosten 6 Flaschen Wasser?', options: ['3 Euro', '6 Euro', '1 Euro'], answer: 0 },
      { q: 'Bis wann sind die Angebote da?', options: ['Bis Freitag', 'Bis Samstag', 'Bis Sonntag'], answer: 1 },
      { q: 'Wann ist die Werkstatt offen?', options: ['Am Wochenende', 'Nur am Montag', 'Montag bis Freitag'], answer: 2 },
    ],
    source: UNIT_15_SOURCE,
  },
]

export const UNIT_15_SPEAKING: SpeakingScenario[] = [
  {
    id: 'a2-sp-15-01',
    title: 'Beim Friseur anrufen',
    titleRu: 'Звонок парикмахеру',
    titleKy: 'Чач тарачка чалуу',
    icon: '✂️',
    level: 'A2',
    goal: {
      ru: 'Вы звоните в парикмахерскую (на «Sie»). Запишитесь на приём, назовите день и время, скажите, что хотите сделать, спросите о цене и вежливо завершите разговор. Используйте вежливые обороты.',
      ky: 'Сиз чач тарач салонуна чалып жатасыз («Sie» формасында). Жазылыңыз, күн менен убакытты атаңыз, эмне кылгыңыз келерин айтыңыз, баасын сураңыз жана сүйлөшүүнү сылык аяктаңыз. Сылык айкаштарды колдонуңуз.',
    },
    turns: [
      {
        ai: 'Friseur Haarzeit, guten Tag. Was kann ich für Sie tun?',
        aiRu: 'Парикмахерская «Хаарцайт», добрый день. Чем могу вам помочь?',
        aiKy: '«Хаарцайт» чач тарач салону, кайырлуу күн. Сизге эмне кылып берсем болот?',
        hints: ['Ich möchte einen Termin machen.', 'Ich hätte gern einen Termin beim Friseur.'],
        keywords: ['termin', 'möchte', 'hätte gern'],
      },
      {
        ai: 'Wann haben Sie Zeit?',
        aiRu: 'Когда у вас есть время?',
        aiKy: 'Сизде качан убакыт бар?',
        hints: ['Am Donnerstag um 15 Uhr.', 'Haben Sie am Freitag Zeit?'],
        keywords: ['donnerstag', 'freitag', 'uhr'],
      },
      {
        ai: 'Was möchten Sie? Haare schneiden oder waschen?',
        aiRu: 'Что вы хотите? Подстричь или помыть волосы?',
        aiKy: 'Эмне каалайсыз? Чачты кыркуубу же жуубу?',
        hints: ['Ich möchte die Haare schneiden.', 'Können Sie die Haare bitte kürzer schneiden?'],
        keywords: ['haare', 'schneiden'],
      },
      {
        ai: 'Das kostet 25 Euro. Ist das in Ordnung?',
        aiRu: 'Это стоит 25 евро. Вас это устраивает?',
        aiKy: 'Бул 25 евро турат. Сизге ылайыктуубу?',
        hints: ['Ja, das ist in Ordnung.', 'Wie viel kostet es mit Waschen?', 'Gut, dann bis Donnerstag. Danke!'],
        keywords: ['kostet', 'danke'],
      },
    ],
    source: UNIT_15_SOURCE,
  },
]

export const UNIT_15_WRITING: WritingTask[] = [
  {
    id: 'a2-wr-15-01',
    unit: 15,
    level: 'A2',
    title: 'Eine E-Mail an das Geschäft: Umtausch',
    situation: {
      ru: 'Вы вчера купили куртку, но она оказалась мала. Напишите короткое официальное письмо в магазин (на «Sie»): скажите, что вы купили, какая проблема, попросите обменять куртку на размер больше, упомяните чек и назовите день, когда придёте.',
      ky: 'Сиз кечээ куртка сатып алдыңыз, бирок ал кичине болуп чыкты. Дүкөнгө («Sie» формасында) кыска расмий кат жазыңыз: эмне сатып алганыңызды, кандай көйгөй бар экенин айтыңыз, курткаңызды бир өлчөм чоңуна алмаштырууну сураңыз, квитанцияны эскертип, келе турган күндү атаңыз.',
    },
    formal: true,
    minWords: 50,
    mustInclude: [
      { label: 'Anrede (Sehr geehrte Damen und Herren)', patterns: ['sehr geehrte'] },
      { label: 'Kauf (… gekauft)', patterns: ['gekauft'] },
      {
        label: 'Adjektiv nach dem bestimmten Artikel (die blaue Jacke, den grauen Mantel …)',
        patterns: ['die blaue', 'die rote', 'die schwarze', 'die graue', 'die grüne', 'den blauen', 'den roten', 'den schwarzen', 'den grauen', 'das blaue', 'das rote', 'das weiße'],
      },
      { label: 'Problem (zu klein / zu groß / passt nicht)', patterns: ['zu klein', 'zu groß', 'zu lang', 'zu kurz', 'passt'] },
      { label: 'Wunsch (Ich möchte … umtauschen)', patterns: ['möchte', 'umtausch'] },
      { label: 'Höfliche Frage (Haben Sie …? / Können Sie …?)', patterns: ['haben sie', 'können sie'] },
      { label: 'Quittung', patterns: ['quittung', 'kassenzettel'] },
      { label: 'Schluss (Mit freundlichen Grüßen)', patterns: ['mit freundlichen grüßen'] },
    ],
    model:
      'Sehr geehrte Damen und Herren, ich habe gestern bei Ihnen die blaue Jacke gekauft. Leider ist sie zu klein. Die Größe passt mir nicht. Ich möchte die Jacke gern umtauschen: Haben Sie die Jacke eine Größe größer? Die Quittung habe ich noch. Ich komme am Samstag in Ihr Geschäft. Mit freundlichen Grüßen, Aida Petrova',
    tips: [
      {
        ru: 'Официальное письмо: «Sehr geehrte Damen und Herren» в начале и «Mit freundlichen Grüßen» в конце. Обращайтесь на «Sie».',
        ky: 'Расмий кат: башында «Sehr geehrte Damen und Herren», аягында «Mit freundlichen Grüßen». «Sie» формасында кайрылыңыз.',
      },
      {
        ru: 'Что вы купили: «Ich habe die blaue Jacke gekauft» — после die женского рода прилагательное получает -e.',
        ky: 'Эмне сатып алганыңыз: «Ich habe die blaue Jacke gekauft» — аял жынстагы die сөзүнөн кийин сын атоочко -e кошулат.',
      },
      {
        ru: 'Проблема и просьба вежливо: «Die Größe passt mir nicht», «Haben Sie die Jacke eine Größe größer?», «Ich möchte die Jacke umtauschen».',
        ky: 'Көйгөй жана сылык өтүнүч: «Die Größe passt mir nicht», «Haben Sie die Jacke eine Größe größer?», «Ich möchte die Jacke umtauschen».',
      },
      {
        ru: 'Упомяните чек: «Die Quittung habe ich noch». Это показывает, что вы можете подтвердить покупку.',
        ky: 'Чекти эскертиңиз: «Die Quittung habe ich noch». Бул сатып алганыңызды тастыктай аларыңызды көрсөтөт.',
      },
    ],
    source: UNIT_15_SOURCE,
  },
]
