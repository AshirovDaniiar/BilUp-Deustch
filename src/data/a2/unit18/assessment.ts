import type { Exercise, L10n } from '../../types'
import type { A2TestDef, A2TestQuestion, L10nStrict } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 18 revision (Wiederholung) exercises, `a2-ex-18-01` … `-08` (3 fill / 3 choice / 2 order; concept 1 × 4, concept 2 × 4 — the Stage 7B plan).
 * Authored independently of the final test below: no prompt, sentence or answer is shared. Positions of the correct option: fill 1 / 0 / 2, choice 2 / 0 / 1.
 */
export const UNIT_18_EXERCISES: Exercise[] = [
  {
    id: 'a2-ex-18-01',
    type: 'fill',
    unit: 18,
    concept: 'a2-praepositionen-reiseziele',
    prompt: 'Im Sommer fahre ich ___ Italien.',
    promptRu: 'Летом я еду в Италию.',
    promptKy: 'Жайында мен Италияга барам.',
    options: ['in', 'nach', 'zu'],
    answer: 'nach',
    why: w(
      'Italien — страна без артикля, к ней едут nach. In стоит на вопрос «Wo?» или перед страной с артиклем (in die Schweiz).',
      'Italien — артиклсиз өлкө, ага nach менен барышат. in «Wo?» деген суроого же артикли бар өлкөнүн алдында турат (in die Schweiz).',
    ),
  },
  {
    id: 'a2-ex-18-02',
    type: 'choice',
    unit: 18,
    concept: 'a2-praepositionen-reiseziele',
    prompt: 'Wohin fahrt ihr im Sommer? Welche Antwort ist richtig?',
    promptRu: 'Куда вы едете летом? Какой ответ правильный?',
    promptKy: 'Жайында кайда барасыңар? Кайсы жооп туура?',
    options: ['Wir fahren am Meer.', 'Wir fahren an dem Meer.', 'Wir fahren ans Meer.'],
    answer: 'Wir fahren ans Meer.',
    why: w(
      'Вопрос «Wohin?» требует Akkusativ: an das Meer → ans Meer. Am Meer и an dem Meer — это «Wo?».',
      '«Wohin?» деген суроо Akkusativ талап кылат: an das Meer → ans Meer. Am Meer жана an dem Meer — бул «Wo?».',
    ),
  },
  {
    id: 'a2-ex-18-03',
    type: 'order',
    unit: 18,
    concept: 'a2-praepositionen-reiseziele',
    prompt: 'Bilde den Satz.',
    promptRu: 'Мы едем в Швейцарию.',
    promptKy: 'Биз Швейцарияга барабыз.',
    words: ['die', 'Wir', 'Schweiz.', 'in', 'fahren'],
    answer: 'Wir fahren in die Schweiz.',
    why: w(
      'Глагол fahren — на втором месте. Die Schweiz — страна с артиклем, поэтому in die Schweiz.',
      'fahren этиши экинчи орунда. Die Schweiz — артикли бар өлкө, ошондуктан in die Schweiz.',
    ),
  },
  {
    id: 'a2-ex-18-04',
    type: 'choice',
    unit: 18,
    concept: 'a2-praepositionen-reiseziele',
    prompt: 'Wo wohnst du im Urlaub? Welche Antwort ist richtig?',
    promptRu: 'Где ты живёшь в отпуске? Какой ответ правильный?',
    promptKy: 'Эс алууда кайда жашайсың? Кайсы жооп туура?',
    options: ['Ich wohne bei meiner Tante.', 'Ich wohne zu meiner Tante.', 'Ich wohne nach meiner Tante.'],
    answer: 'Ich wohne bei meiner Tante.',
    why: w(
      'Где вы живёте у человека — bei + Dativ (bei meiner Tante). Zu и nach отвечают на вопрос «куда?».',
      'Адамдын жеринде жашасаңыз — bei + Dativ (bei meiner Tante). Zu жана nach «кайда?» деген суроого жооп берет.',
    ),
  },
  {
    id: 'a2-ex-18-05',
    type: 'fill',
    unit: 18,
    concept: 'a2-zukunft-praesens-werden',
    prompt: 'Nächste Woche ___ ich nach Hamburg.',
    promptRu: 'На следующей неделе я еду в Гамбург.',
    promptKy: 'Келерки жумада мен Гамбургга барам.',
    options: ['fahre', 'bin gefahren', 'fuhr'],
    answer: 'fahre',
    why: w(
      'О будущем говорят в настоящем времени со словом о времени: Nächste Woche fahre ich. Perfekt и fuhr относятся к прошлому.',
      'Келечек жөнүндө убакыт сөзү менен азыркы чакта айтышат: Nächste Woche fahre ich. Perfekt жана fuhr өткөн убакытка тиешелүү.',
    ),
  },
  {
    id: 'a2-ex-18-06',
    type: 'choice',
    unit: 18,
    concept: 'a2-zukunft-praesens-werden',
    prompt: 'Welcher Satz spricht über die Zukunft?',
    promptRu: 'Какое предложение говорит о будущем?',
    promptKy: 'Кайсы сүйлөм келечек жөнүндө?',
    options: ['Gestern bin ich ans Meer gefahren.', 'Morgen fahre ich ans Meer.', 'Ich war am Meer.'],
    answer: 'Morgen fahre ich ans Meer.',
    why: w(
      'Слово о времени morgen показывает будущее. Gestern bin … gefahren и ich war — это прошлое.',
      'morgen убакыт сөзү келечекти көрсөтөт. Gestern bin … gefahren жана ich war — өткөн убакыт.',
    ),
  },
  {
    id: 'a2-ex-18-07',
    type: 'order',
    unit: 18,
    concept: 'a2-zukunft-praesens-werden',
    prompt: 'Bilde den Satz.',
    promptRu: 'Летом я еду к морю.',
    promptKy: 'Жайында мен деңизге барам.',
    words: ['fahre', 'Im', 'Meer.', 'ich', 'Sommer', 'ans'],
    answer: 'Im Sommer fahre ich ans Meer.',
    why: w(
      'Слово о времени (Im Sommer) стоит первым, поэтому глагол fahre — вторым, а ich — после него.',
      'Убакыт сөзү (Im Sommer) биринчи турат, ошондуктан fahre этиши экинчи, ал эми ich андан кийин.',
    ),
  },
  {
    id: 'a2-ex-18-08',
    type: 'fill',
    unit: 18,
    concept: 'a2-zukunft-praesens-werden',
    prompt: 'Morgen ___ es regnen.',
    promptRu: 'Завтра будет дождь.',
    promptKy: 'Эртең жамгыр жаайт.',
    options: ['werde', 'werden', 'wird'],
    answer: 'wird',
    why: w(
      'В прогнозе погоды стоит es wird + инфинитив. К подлежащему es подходит форма wird.',
      'Аба ырайынын божомолунда es wird + инфинитив турат. es ээсине wird формасы туура келет.',
    ),
  },
]

/** Test definition `unit-18` (kind topic, 15 questions). */
export const UNIT_18_TEST: A2TestDef = {
  id: 'unit-18',
  title: s('Итоговый тест: юнит 18', 'Жыйынтыктоочу тест: 18-бөлүм'),
  kind: 'topic',
  level: 'A2',
  unit: 18,
  size: 15,
}

/**
 * Unit 18 final test, `a2-ft-18-01` … `-15`. Composition: 7 grammar items (3 + 4, each in a small travel sentence), 3 vocabulary items,
 * 5 items that read a short German text (a price list, a station announcement, an invitation message, a request for help, a postcard).
 * Reading items carry the German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate only the instruction and the question.
 * Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_18_FINAL: A2TestQuestion[] = [
  {
    id: 'a2-ft-18-01',
    prompt: 'Ich wohne in Berlin, aber im Urlaub fahre ich ___ Spanien.',
    promptRu: 'Я живу в Берлине, но в отпуске еду в Испанию.',
    promptKy: 'Мен Берлинде жашайм, бирок эс алууда Испанияга барам.',
    options: ['nach', 'in', 'an'],
    answer: 'nach',
    skill: 'grammar',
    concept: 'a2-praepositionen-reiseziele',
    why: s(
      'Spanien — страна без артикля, к ней едут nach. In и an здесь не подходят.',
      'Spanien — артиклсиз өлкө, ага nach менен барышат. in жана an бул жерге туура келбейт.',
    ),
  },
  {
    id: 'a2-ft-18-02',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Wir fahren nach die Türkei.', 'Wir fahren in die Türkei.', 'Wir fahren zu die Türkei.'],
    answer: 'Wir fahren in die Türkei.',
    skill: 'grammar',
    concept: 'a2-praepositionen-reiseziele',
    why: s(
      'Die Türkei — страна с артиклем: in + Akkusativ (in die Türkei). Nach стоит только перед странами без артикля.',
      'Die Türkei — артикли бар өлкө: in + Akkusativ (in die Türkei). nach артиклсиз өлкөлөрдүн алдында гана турат.',
    ),
  },
  {
    id: 'a2-ft-18-03',
    prompt: 'Am Wochenende fahren wir ___ See.',
    promptRu: 'На выходных мы едем к озеру.',
    promptKy: 'Дем алыш күндөрү биз көлгө барабыз.',
    options: ['am', 'nach', 'an den'],
    answer: 'an den',
    skill: 'grammar',
    concept: 'a2-praepositionen-reiseziele',
    why: s(
      'К озеру едут an + Akkusativ: der See → an den See. Am (an dem) отвечает на «Wo?», nach здесь не подходит.',
      'Көлгө an + Akkusativ менен барышат: der See → an den See. Am (an dem) «Wo?» деген суроого жооп берет, nach бул жерге туура келбейт.',
    ),
  },
  {
    id: 'a2-ft-18-04',
    prompt: 'In zwei Wochen ___ ich ein Ticket nach Wien.',
    promptRu: 'Через две недели я куплю билет до Вены.',
    promptKy: 'Эки жумадан кийин мен Венага жол билетин сатып алам.',
    options: ['kaufte', 'kaufe', 'habe gekauft'],
    answer: 'kaufe',
    skill: 'grammar',
    concept: 'a2-zukunft-praesens-werden',
    why: s(
      'Слово о времени «in zwei Wochen» говорит о будущем, поэтому глагол стоит в настоящем времени: kaufe. Kaufte и habe gekauft — прошлое.',
      '«in zwei Wochen» убакыт сөзү келечек жөнүндө айтат, ошондуктан этиш азыркы чакта турат: kaufe. kaufte жана habe gekauft — өткөн убакыт.',
    ),
  },
  {
    id: 'a2-ft-18-05',
    prompt: 'Am Wochenende ___ es auf dem Berg kalt.',
    promptRu: 'На выходных на горе станет холодно.',
    promptKy: 'Дем алыш күндөрү тоодо суук болот.',
    options: ['wird', 'werde', 'wirst'],
    answer: 'wird',
    skill: 'grammar',
    concept: 'a2-zukunft-praesens-werden',
    why: s(
      'Es wird + прилагательное — так говорят о погоде в будущем. К es подходит форма wird.',
      'Es wird + сын атооч — келечектеги аба ырайы жөнүндө ушинтип айтышат. es ээсине wird формасы туура келет.',
    ),
  },
  {
    id: 'a2-ft-18-06',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Morgen ich fahre nach Hamburg.', 'Morgen ich nach Hamburg fahre.', 'Morgen fahre ich nach Hamburg.'],
    answer: 'Morgen fahre ich nach Hamburg.',
    skill: 'grammar',
    concept: 'a2-zukunft-praesens-werden',
    why: s(
      'Слово о времени стоит первым, поэтому глагол остаётся вторым (fahre), а подлежащее ich идёт после него.',
      'Убакыт сөзү биринчи турат, ошондуктан этиш экинчи орунда калат (fahre), ал эми ээ ich андан кийин келет.',
    ),
  },
  {
    id: 'a2-ft-18-07',
    prompt: 'Im Gebirge ist es im Sommer ___ als am Meer.',
    promptRu: 'В горах летом прохладнее, чем у моря.',
    promptKy: 'Тоодо жайында деңиз жээгине караганда салкыныраак.',
    options: ['kühl', 'kühler', 'am kühlsten'],
    answer: 'kühler',
    skill: 'grammar',
    why: s(
      'Для сравнения двух мест нужна форма на -er и слово als: kühler als. Это сравнение из юнита 13.',
      'Эки жерди салыштыруу үчүн -er менен бүткөн форма жана als сөзү керек: kühler als. Бул 13-бөлүмдөгү салыштыруу.',
    ),
  },
  {
    id: 'a2-ft-18-08',
    prompt: 'Vor der Reise bucht Lena ein Zimmer. Sie macht eine ___ im Internet.',
    promptRu: 'Перед поездкой Лена бронирует комнату. Она делает бронирование в интернете.',
    promptKy: 'Саякатка чейин Лена бөлмө брондойт. Ал интернетте брондоо жасайт.',
    options: ['Buchung', 'Besichtigung', 'Ausstellung'],
    answer: 'Buchung',
    skill: 'vocabulary',
    why: s(
      'Бронь комнаты — die Buchung. Die Besichtigung — осмотр, die Ausstellung — выставка.',
      'Бөлмө брондоо — die Buchung. Die Besichtigung — көрүп чыгуу, die Ausstellung — көргөзмө.',
    ),
  },
  {
    id: 'a2-ft-18-09',
    prompt: 'Auf der Autobahn stehen viele Autos und niemand fährt. Das ist ein ___.',
    promptRu: 'На автобане стоит много машин, и никто не едет. Это пробка.',
    promptKy: 'Автожолдо көп машина турат жана эч ким жүрбөйт. Бул тыгын.',
    options: ['Strand', 'Regen', 'Stau'],
    answer: 'Stau',
    skill: 'vocabulary',
    why: s(
      'Много машин, которые не едут, — это der Stau. Der Strand — пляж, der Regen — дождь.',
      'Жүрбөй турган көп машина — бул der Stau. Der Strand — деңиз жээги, der Regen — жамгыр.',
    ),
  },
  {
    id: 'a2-ft-18-10',
    prompt: 'Welches Wort passt nicht zum Thema „Wetter“?',
    promptRu: 'Какое слово не подходит к теме «Погода»?',
    promptKy: '«Аба ырайы» темасына кайсы сөз туура келбейт?',
    options: ['der Regen', 'der Fahrplan', 'der Wind'],
    answer: 'der Fahrplan',
    skill: 'vocabulary',
    why: s(
      'Der Regen и der Wind — погода. Der Fahrplan — расписание транспорта.',
      'Der Regen жана der Wind — аба ырайы. Der Fahrplan — транспорттун каттам графиги.',
    ),
  },
  {
    id: 'a2-ft-18-11',
    prompt:
      'Lies die Anzeige: „Ferienwohnung in Spanien: 7 Übernachtungen, 420 Euro für zwei Personen. Frühstück 8 Euro pro Person und Tag.“ Wie viel kostet eine Übernachtung?',
    promptRu: 'Прочитайте объявление. Сколько стоит одна ночь?',
    promptKy: 'Жарыяны окуңуз. Бир түнөө канча турат?',
    options: ['60 Euro', '210 Euro', '8 Euro'],
    answer: '60 Euro',
    skill: 'reading',
    why: s(
      'За 7 ночей — 420 Euro. 420 : 7 = 60 Euro за одну ночь. Frühstück оплачивается отдельно.',
      '7 түнөөгө — 420 Euro. 420 : 7 = 60 Euro бир түнөөгө. Frühstück өзүнчө төлөнөт.',
    ),
  },
  {
    id: 'a2-ft-18-12',
    prompt:
      'Lies die Durchsage: „Achtung am Bahnhof: Der Zug nach Hamburg kommt zehn Minuten später. Er fährt von Bahnsteig 3, nicht von Bahnsteig 5.“ Von welchem Bahnsteig fährt der Zug nach Hamburg?',
    promptRu: 'Прочитайте объявление на вокзале. С какой платформы отправляется поезд в Гамбург?',
    promptKy: 'Вокзалдагы жарыяны окуңуз. Гамбургга поезд кайсы перрондон жөнөйт?',
    options: ['Von Bahnsteig 5', 'Von Bahnsteig 10', 'Von Bahnsteig 3'],
    answer: 'Von Bahnsteig 3',
    skill: 'reading',
    why: s(
      'В объявлении сказано: «Er fährt von Bahnsteig 3, nicht von Bahnsteig 5». Значит, поезд отправляется с платформы 3.',
      'Жарыяда айтылган: «Er fährt von Bahnsteig 3, nicht von Bahnsteig 5». Демек, поезд 3-перрондон жөнөйт.',
    ),
  },
  {
    id: 'a2-ft-18-13',
    prompt:
      'Lies die Nachricht: „Hi Tom, wir fahren im Juli nach Italien und wohnen bei meiner Tante in Rom. Hast du Lust? Wir fahren mit dem Zug. Lena“ Wo wohnen Lena und ihre Freunde in Rom?',
    promptRu: 'Прочитайте сообщение. Где живут Лена и её друзья в Риме?',
    promptKy: 'Билдирүүнү окуңуз. Лена жана анын достору Римде кайда жашашат?',
    options: ['Bei Lenas Tante', 'In einer Jugendherberge', 'In einer Ferienwohnung'],
    answer: 'Bei Lenas Tante',
    skill: 'reading',
    concept: 'a2-praepositionen-reiseziele',
    why: s(
      'Лена пишет: «wohnen bei meiner Tante in Rom». Хостел и квартира для отдыха в сообщении не названы.',
      'Лена жазат: «wohnen bei meiner Tante in Rom». Мейманкана жана эс алуу батири билдирүүдө аталган эмес.',
    ),
  },
  {
    id: 'a2-ft-18-14',
    prompt:
      'Lies die Situation: „Eine Frau sagt am Bahnhof: Entschuldigung, ich habe mein Gepäck im Zug vergessen. Der Zug ist schon weg. Was kann ich tun?“ Welche Antwort passt?',
    promptRu: 'Прочитайте ситуацию. Какой ответ подходит?',
    promptKy: 'Кырдаалды окуңуз. Кайсы жооп ылайыктуу?',
    options: ['Das ist mir egal.', 'Fragen Sie bitte hier im Bahnhof. Die Mitarbeiter helfen Ihnen.', 'Fahren Sie ins Ausland.'],
    answer: 'Fragen Sie bitte hier im Bahnhof. Die Mitarbeiter helfen Ihnen.',
    skill: 'reading',
    why: s(
      'Женщина просит помощи. Вежливый полезный ответ — отправить её к сотрудникам вокзала. Остальные ответы грубые или не помогают.',
      'Аял жардам сурап жатат. Сылык жана пайдалуу жооп — аны вокзалдын кызматкерлерине жөнөтүү. Калган жооптор дөрөкөт же жардам бербейт.',
    ),
  },
  {
    id: 'a2-ft-18-15',
    prompt:
      'Lies die Postkarte: „Liebe Anna, wir sind am Montag in Spanien angekommen. Gestern haben wir die Stadt besichtigt. Nächste Woche fahren wir ans Meer.“ Was ist noch nicht passiert?',
    promptRu: 'Прочитайте открытку. Что ещё не произошло?',
    promptKy: 'Ачык катты окуңуз. Эмне азырынча болө элек?',
    options: ['Sie sind angekommen.', 'Sie haben die Stadt besichtigt.', 'Sie fahren ans Meer.'],
    answer: 'Sie fahren ans Meer.',
    skill: 'reading',
    concept: 'a2-zukunft-praesens-werden',
    why: s(
      'Perfekt («sind angekommen», «haben besichtigt») — это уже случилось. «Nächste Woche fahren wir ans Meer» — это план на будущее.',
      'Perfekt («sind angekommen», «haben besichtigt») — бул болуп өттү. «Nächste Woche fahren wir ans Meer» — бул келечектеги план.',
    ),
  },
]
