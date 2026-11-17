import type { Exercise, L10n } from '../../types'
import type { A2TestDef, A2TestQuestion, L10nStrict } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 13 revision (Wiederholung) exercises, `a2-ex-13-01` … `-08` (3 fill / 3 choice / 2 order; concept 1 × 3, concept 2 × 3, concept 3 × 2 — the Stage 7B plan).
 * Authored independently of the final test below: no prompt, sentence or answer is shared. Positions of the correct option: fill 1 / 0 / 2, choice 2 / 0 / 1.
 */
export const UNIT_13_EXERCISES: Exercise[] = [
  {
    id: 'a2-ex-13-01',
    type: 'fill',
    unit: 13,
    concept: 'a2-adjektivendungen-indefinit',
    prompt: 'Das ist eine hell___ Wohnung.',
    promptRu: 'Это светлая квартира.',
    promptKy: 'Бул жарык батир.',
    options: ['er', 'e', 'es'],
    answer: 'e',
    why: w(
      'Wohnung — женский род (die). После eine прилагательное получает -e: eine helle Wohnung. Окончания -er и -es подходят мужскому и среднему роду.',
      'Wohnung — аял жынсындагы сөз (die). eine сөзүнөн кийин сын атоочко -e кошулат: eine helle Wohnung. -er жана -es аякталыштары эркек жана орто жынстагы сөздөргө туура келет.',
    ),
  },
  {
    id: 'a2-ex-13-02',
    type: 'choice',
    unit: 13,
    concept: 'a2-adjektivendungen-indefinit',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Die Wohnung hat einen kleine Balkon.', 'Die Wohnung hat einen kleiner Balkon.', 'Die Wohnung hat einen kleinen Balkon.'],
    answer: 'Die Wohnung hat einen kleinen Balkon.',
    why: w(
      'Balkon — мужской род (der). После einen (Akkusativ) прилагательное получает -en: einen kleinen Balkon.',
      'Balkon — эркек жынстагы сөз (der). einen (Akkusativ) сөзүнөн кийин сын атоочко -en кошулат: einen kleinen Balkon.',
    ),
  },
  {
    id: 'a2-ex-13-03',
    type: 'order',
    unit: 13,
    concept: 'a2-adjektivendungen-indefinit',
    prompt: 'Bilde den Satz.',
    promptRu: 'Я ищу светлую квартиру.',
    promptKy: 'Мен жарык батир издеп жатам.',
    words: ['Wohnung.', 'helle', 'suche', 'eine', 'Ich'],
    answer: 'Ich suche eine helle Wohnung.',
    why: w(
      'Глагол suche стоит на втором месте. Затем eine, прилагательное с окончанием -e (helle) и существительное Wohnung.',
      'suche этиши экинчи орунда турат. Андан кийин eine, -e аякталышы бар сын атооч (helle) жана Wohnung зат атоочу келет.',
    ),
  },
  {
    id: 'a2-ex-13-04',
    type: 'fill',
    unit: 13,
    concept: 'a2-komparativ-superlativ',
    prompt: 'Wohnung A kostet 900 Euro, Wohnung B nur 600 Euro. Wohnung B ist ___ als Wohnung A.',
    promptRu: 'Квартира A стоит 900 евро, квартира B — только 600 евро. Квартира B дешевле, чем квартира A.',
    promptKy: 'A батири 900 евро турат, B батири болгону 600 евро. B батири A батиринен арзаныраак.',
    options: ['billiger', 'billig', 'billigste'],
    answer: 'billiger',
    why: w(
      'Для сравнения двух квартир к прилагательному добавляют -er: billig → billiger. Затем идёт als.',
      'Эки батирди салыштыруу үчүн сын атоочко -er кошулат: billig → billiger. Андан кийин als келет.',
    ),
  },
  {
    id: 'a2-ex-13-05',
    type: 'choice',
    unit: 13,
    concept: 'a2-komparativ-superlativ',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Meine neue Wohnung ist größer als meine alte Wohnung.', 'Meine neue Wohnung ist größer wie meine alte Wohnung.', 'Meine neue Wohnung ist groß als meine alte Wohnung.'],
    answer: 'Meine neue Wohnung ist größer als meine alte Wohnung.',
    why: w(
      'Сравнение требует формы на -er (größer) и слова als. Wie после Komparativ не ставят, а форма groß без -er не сравнивает.',
      'Салыштыруу үчүн -er менен бүткөн форма (größer) жана als сөзү керек. Komparativден кийин wie коюлбайт, ал эми -er жок groß формасы салыштырбайт.',
    ),
  },
  {
    id: 'a2-ex-13-06',
    type: 'order',
    unit: 13,
    concept: 'a2-komparativ-superlativ',
    prompt: 'Bilde den Satz.',
    promptRu: 'Моя комната самая уютная.',
    promptKy: 'Менин бөлмөм эң жайлуу.',
    words: ['gemütlichsten.', 'am', 'ist', 'Zimmer', 'Mein'],
    answer: 'Mein Zimmer ist am gemütlichsten.',
    why: w(
      'Для «самый» после sein ставят am и форму на -sten: am gemütlichsten. Глагол ist — на втором месте.',
      '«Эң» дегенди айтуу үчүн sein этишинен кийин am жана -sten менен бүткөн форма коюлат: am gemütlichsten. ist этиши экинчи орунда турат.',
    ),
  },
  {
    id: 'a2-ex-13-07',
    type: 'fill',
    unit: 13,
    concept: 'a2-positionsverben',
    prompt: 'Ich ___ den Stuhl neben das Fenster.',
    promptRu: 'Я ставлю стул рядом с окном.',
    promptKy: 'Мен отургучту терезенин жанына коём.',
    options: ['steht', 'stehe', 'stelle'],
    answer: 'stelle',
    why: w(
      'Вы сами ставите стул куда-то (neben das Fenster — Akkusativ, вопрос «Wohin?»). Для действия нужен stellen: ich stelle.',
      'Сиз отургучту бир жакка өзүңүз коюп жатасыз (neben das Fenster — Akkusativ, «Wohin?» деген суроо). Аракет үчүн stellen керек: ich stelle.',
    ),
  },
  {
    id: 'a2-ex-13-08',
    type: 'choice',
    unit: 13,
    concept: 'a2-positionsverben',
    prompt: 'Wo ist das Buch?',
    promptRu: 'Где книга?',
    promptKy: 'Китеп кайда?',
    options: ['Es liegt auf das Sofa.', 'Es liegt auf dem Sofa.', 'Es legt auf dem Sofa.'],
    answer: 'Es liegt auf dem Sofa.',
    why: w(
      'Вопрос «Wo?» описывает положение: глагол liegt и Dativ (auf dem Sofa). Legt и auf das Sofa относятся к вопросу «Wohin?».',
      '«Wo?» деген суроо абалды сүрөттөйт: liegt этиши жана Dativ (auf dem Sofa). Legt жана auf das Sofa «Wohin?» деген суроого тиешелүү.',
    ),
  },
]

/** Test definition `unit-13` (kind topic, 15 questions). */
export const UNIT_13_TEST: A2TestDef = {
  id: 'unit-13',
  title: s('Итоговый тест: юнит 13', 'Жыйынтыктоочу тест: 13-бөлүм'),
  kind: 'topic',
  level: 'A2',
  unit: 13,
  size: 15,
}

/**
 * Unit 13 final test, `a2-ft-13-01` … `-15`. Composition: 7 grammar items (3 + 2 + 2, each in a small everyday sentence), 3 vocabulary items, 5 items
 * that read a short German text or message (an ad, a house notice, a neighbour's complaint, a report to the landlord, a choice between two ads).
 * Reading items carry the German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate only the instruction and the question.
 * Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_13_FINAL: A2TestQuestion[] = [
  {
    id: 'a2-ft-13-01',
    prompt: 'Im Haus gibt es einen ___ Aufzug.',
    promptRu: 'В доме есть новый лифт.',
    promptKy: 'Үйдө жаңы лифт бар.',
    options: ['neuen', 'neue', 'neuer'],
    answer: 'neuen',
    skill: 'grammar',
    concept: 'a2-adjektivendungen-indefinit',
    why: s(
      'Aufzug — мужской род (der). После «es gibt» нужен Akkusativ: einen neuen Aufzug. Форма -er — это Nominativ, а -e — женский род.',
      'Aufzug — эркек жынстагы сөз (der). «es gibt» этишинен кийин Akkusativ керек: einen neuen Aufzug. -er формасы — Nominativ, ал эми -e — аял жынсы.',
    ),
  },
  {
    id: 'a2-ft-13-02',
    prompt: 'Dein Wohnzimmer ist wirklich schön! Das ist ein ___ Zimmer.',
    promptRu: 'Твоя гостиная действительно красивая! Это уютная комната.',
    promptKy: 'Сенин конок бөлмөң чындап эле сонун! Бул жайлуу бөлмө.',
    options: ['gemütliche', 'gemütliches', 'gemütlichen'],
    answer: 'gemütliches',
    skill: 'grammar',
    concept: 'a2-adjektivendungen-indefinit',
    why: s(
      'Zimmer — средний род (das). После ein у слов среднего рода окончание -es: ein gemütliches Zimmer.',
      'Zimmer — орто жынстагы сөз (das). ein сөзүнөн кийин орто жынстагы сөздөрдө -es аякталышы турат: ein gemütliches Zimmer.',
    ),
  },
  {
    id: 'a2-ft-13-03',
    prompt: 'Die Wohnung hat leider keine ___ Küche.',
    promptRu: 'В квартире, к сожалению, нет современной кухни.',
    promptKy: 'Батирде, тилекке каршы, заманбап ашкана жок.',
    options: ['moderner', 'modernes', 'moderne'],
    answer: 'moderne',
    skill: 'grammar',
    concept: 'a2-adjektivendungen-indefinit',
    why: s(
      'Küche — женский род (die). После keine (Akkusativ) окончание -e: keine moderne Küche. Формы -er и -es подходят мужскому и среднему роду.',
      'Küche — аял жынстагы сөз (die). keine (Akkusativ) сөзүнөн кийин -e аякталышы турат: keine moderne Küche. -er жана -es формалары эркек жана орто жынска туура келет.',
    ),
  },
  {
    id: 'a2-ft-13-04',
    prompt: 'Mir gefällt die Küche gut, aber das Bad gefällt mir noch ___.',
    promptRu: 'Кухня мне нравится, но ванная нравится мне ещё больше.',
    promptKy: 'Ашкана мага жагат, бирок ванна бөлмөсү мага андан да жакшы жагат.',
    options: ['guter', 'besser', 'am besten'],
    answer: 'besser',
    skill: 'grammar',
    concept: 'a2-komparativ-superlativ',
    why: s(
      'Komparativ от gut — особая форма besser. Формы guter не существует в сравнении, а am besten значит «лучше всего» (Superlativ).',
      'gut сөзүнүн Komparativ формасы өзгөчө: besser. Салыштырууда guter формасы жок, ал эми am besten «баарынан жакшы» дегенди билдирет (Superlativ).',
    ),
  },
  {
    id: 'a2-ft-13-05',
    prompt: 'Von allen Räumen in der Wohnung ist der Keller ___.',
    promptRu: 'Из всех помещений в квартире подвал самый тёмный.',
    promptKy: 'Батирдеги бардык бөлмөлөрдүн ичинен жертөлө эң караңгы.',
    options: ['am dunkelsten', 'dunkler', 'dunkelsten'],
    answer: 'am dunkelsten',
    skill: 'grammar',
    concept: 'a2-komparativ-superlativ',
    why: s(
      'Для «самый» после sein нужна форма am … -sten: am dunkelsten. Dunkler сравнивает только два предмета, а dunkelsten без am здесь не подходит.',
      '«Эң» дегенди айтуу үчүн sein этишинен кийин am … -sten формасы керек: am dunkelsten. Dunkler эки нерсени гана салыштырат, ал эми am жок dunkelsten бул жерге туура келбейт.',
    ),
  },
  {
    id: 'a2-ft-13-06',
    prompt: 'Das Bild ___ schon an der Wand.',
    promptRu: 'Картина уже висит на стене.',
    promptKy: 'Сүрөт дубалда илинип турат.',
    options: ['legt', 'stellt', 'hängt'],
    answer: 'hängt',
    skill: 'grammar',
    concept: 'a2-positionsverben',
    why: s(
      'Картина уже на своём месте (вопрос «Wo?», an der Wand — Dativ): hängt. Legt и stellt — глаголы действия, после них стоял бы Akkusativ.',
      'Сүрөт өз ордунда («Wo?» деген суроо, an der Wand — Dativ): hängt. Legt жана stellt — аракетти билдирген этиштер, алардан кийин Akkusativ турмак.',
    ),
  },
  {
    id: 'a2-ft-13-07',
    prompt: 'Wohin kommt die Waschmaschine? – Wir stellen sie in ___ Bad.',
    promptRu: 'Куда поставить стиральную машину? — Мы ставим её в ванную.',
    promptKy: 'Кир жуугуч машинаны кайсы жакка коёбуз? — Биз аны ванна бөлмөсүнө коёбуз.',
    options: ['dem', 'das', 'den'],
    answer: 'das',
    skill: 'grammar',
    concept: 'a2-positionsverben',
    why: s(
      'Вопрос «Wohin?» требует Akkusativ. Bad — средний род, поэтому in das Bad. Форма dem — это Dativ («Wo?»), а den — мужской род.',
      '«Wohin?» деген суроо Akkusativ талап кылат. Bad — орто жынстагы сөз, ошондуктан in das Bad. dem формасы — Dativ («Wo?»), ал эми den — эркек жынс.',
    ),
  },
  {
    id: 'a2-ft-13-08',
    prompt: 'Zur Miete kommen noch die ___ für Wasser, Heizung und Müll.',
    promptRu: 'К арендной плате добавляются ещё дополнительные платежи за воду, отопление и мусор.',
    promptKy: 'Ижара акысына дагы суу, жылытуу жана таштанды үчүн кошумча төлөмдөр кошулат.',
    options: ['Nebenkosten', 'Kaution', 'Anzeige'],
    answer: 'Nebenkosten',
    skill: 'vocabulary',
    why: s(
      'Деньги за воду, отопление и мусор — это Nebenkosten, их платят каждый месяц. Kaution — залог, который платят один раз при въезде, а Anzeige — объявление.',
      'Суу, жылытуу жана таштанды үчүн төлөнгөн акча — Nebenkosten, аны ар айда төлөшөт. Kaution — көчүп киргенде бир жолу төлөнгөн кепилдик акча, ал эми Anzeige — жарнама.',
    ),
  },
  {
    id: 'a2-ft-13-09',
    prompt: 'Im Mai ziehe ich in meine eigene Wohnung ___.',
    promptRu: 'В мае я переезжаю в собственную квартиру.',
    promptKy: 'Май айында мен өзүмдүн батиримге көчүп кирем.',
    options: ['aus', 'um', 'ein'],
    answer: 'ein',
    skill: 'vocabulary',
    why: s(
      'В жильё въезжают: «in eine Wohnung einziehen». Ausziehen значит «съехать из жилья», а umziehen — «переехать» без указания, куда именно.',
      'Турак жайга көчүп киришет: «in eine Wohnung einziehen». Ausziehen «турак жайдан көчүп чыгууну» билдирет, ал эми umziehen — кайда экенин көрсөтпөстөн «көчүп кетүү».',
    ),
  },
  {
    id: 'a2-ft-13-10',
    prompt: 'Welches Wort passt nicht zum Thema „Nachbarschaft“?',
    promptRu: 'Какое слово не подходит к теме «Соседство»?',
    promptKy: '«Кошуначылык» темасына кайсы сөз туура келбейт?',
    options: ['der Lärm', 'der Herd', 'die Hausordnung'],
    answer: 'der Herd',
    skill: 'vocabulary',
    why: s(
      'Der Lärm и die Hausordnung связаны с жизнью рядом с соседями. Der Herd — это плита на кухне.',
      'Der Lärm жана die Hausordnung кошуналар менен чогуу жашоого байланыштуу. Der Herd — ашканадагы плита.',
    ),
  },
  {
    id: 'a2-ft-13-11',
    prompt:
      'Lies die Anzeige: „Zu vermieten: 3 Zimmer, Küche, Bad, Balkon. Nur fünf Minuten vom Bahnhof. Miete: 780 Euro, Nebenkosten: 150 Euro, Kaution: 1.560 Euro. Ab sofort frei.“ Wie viel muss man jeden Monat bezahlen?',
    promptRu: 'Прочитайте объявление. Сколько нужно платить каждый месяц?',
    promptKy: 'Жарнаманы окуңуз. Ар айда канча төлөө керек?',
    options: ['930 Euro', '780 Euro', '1.560 Euro'],
    answer: '930 Euro',
    skill: 'reading',
    why: s(
      'Каждый месяц платят аренду и Nebenkosten: 780 + 150 = 930 Euro. Kaution (1.560 Euro) платят один раз.',
      'Ар айда ижара акысын жана Nebenkostenди төлөшөт: 780 + 150 = 930 Euro. Kaution (1.560 Euro) бир жолу төлөнөт.',
    ),
  },
  {
    id: 'a2-ft-13-12',
    prompt:
      'Lies die Notiz: „Liebe Mieter, am Freitag arbeiten wir im Keller. Von 9 bis 12 Uhr funktioniert die Waschmaschine nicht, und die Heizung ist bis 11 Uhr aus. Der Aufzug fährt wie immer. Danke! Ihre Hausverwaltung“ Was funktioniert am Freitag um 10 Uhr nicht?',
    promptRu: 'Прочитайте записку. Что не работает в пятницу в 10 часов?',
    promptKy: 'Эскертмени окуңуз. Жума күнү саат 10догу эмне иштебейт?',
    options: ['Nur die Waschmaschine', 'Der Aufzug und die Heizung', 'Die Waschmaschine und die Heizung'],
    answer: 'Die Waschmaschine und die Heizung',
    skill: 'reading',
    why: s(
      'В 10 часов Waschmaschine ещё не работает (с 9 до 12), Heizung выключено (до 11), а Aufzug едет как обычно.',
      'Саат 10до Waschmaschine иштебейт (9дан 12ге чейин), Heizung өчүк (11ге чейин), ал эми Aufzug адаттагыдай иштейт.',
    ),
  },
  {
    id: 'a2-ft-13-13',
    prompt:
      'Lies die Nachricht: „Guten Abend, hier ist Herr Weber von nebenan. Ihre Musik ist leider sehr laut, und ich möchte schlafen.“ Welche Antwort passt?',
    promptRu: 'Прочитайте сообщение. Какой ответ подходит?',
    promptKy: 'Билдирүүнү окуңуз. Кайсы жооп ылайыктуу?',
    options: ['Oh, Entschuldigung! Ich mache die Musik gleich leiser.', 'Die Musik bleibt so laut. Das ist meine Wohnung.', 'Ich mache die Musik gleich lauter.'],
    answer: 'Oh, Entschuldigung! Ich mache die Musik gleich leiser.',
    skill: 'reading',
    why: s(
      'Сосед просит тишины. Вежливый ответ — извиниться и сделать музыку тише (leiser). Остальные ответы грубые или делают шум ещё сильнее.',
      'Кошуна тынчтык сурап жатат. Сылык жооп — кечирим суранып, музыканы акыныраак кылуу (leiser). Калган жооптор дөрөкөт же ызы-чууну дагы күчөтөт.',
    ),
  },
  {
    id: 'a2-ft-13-14',
    prompt:
      'Lies die Situation: „Lena ist vor einer Woche in eine neue Wohnung eingezogen. Die Heizung funktioniert nicht, und es ist sehr kalt.“ Welche Nachricht an den Vermieter passt?',
    promptRu: 'Прочитайте описание ситуации. Какое сообщение арендодателю подходит?',
    promptKy: 'Кырдаалдын сүрөттөлүшүн окуңуз. Үй ээсине кайсы билдирүү ылайыктуу?',
    options: [
      'Guten Tag, ich möchte die Wohnung besichtigen. Ist sie noch frei?',
      'Guten Tag, in meiner Wohnung funktioniert die Heizung nicht. Kann jemand kommen?',
      'Hallo, meine Nachbarn sind zu laut. Ich ziehe aus.',
    ],
    answer: 'Guten Tag, in meiner Wohnung funktioniert die Heizung nicht. Kann jemand kommen?',
    skill: 'reading',
    why: s(
      'Проблема — неработающее отопление. Нужное сообщение называет проблему и просит прийти. Первое сообщение — запрос на осмотр квартиры, третье — жалоба на шум.',
      'Көйгөй — жылытуу системасынын иштебей калышы. Керектүү билдирүү көйгөйдү айтып, келүүнү суранат. Биринчи билдирүү — батирди көрүүгө суроо, үчүнчүсү — ызы-чууга даттануу.',
    ),
  },
  {
    id: 'a2-ft-13-15',
    prompt:
      'Lies die Anzeigen: „Lara sucht eine helle Wohnung mit Keller. Anzeige A: 2 Zimmer, 520 Euro, dunkel, kein Keller. Anzeige B: 2 Zimmer, 600 Euro, hell, mit Keller.“ Welche Anzeige passt zu Lara?',
    promptRu: 'Прочитайте объявления. Какое объявление подходит Ларе?',
    promptKy: 'Жарнамаларды окуңуз. Кайсы жарнама Ларага ылайыктуу?',
    options: ['Anzeige A', 'Beide Anzeigen', 'Anzeige B'],
    answer: 'Anzeige B',
    skill: 'reading',
    why: s(
      'Лара ищет светлую квартиру с подвалом. В объявлении B квартира светлая и с подвалом, а в объявлении A она тёмная и без подвала.',
      'Лара подвалы бар жарык батир издеп жатат. B жарнамасында батир жарык жана жертөлөсү бар, ал эми A жарнамасында ал караңгы жана жертөлөсү жок.',
    ),
  },
]
