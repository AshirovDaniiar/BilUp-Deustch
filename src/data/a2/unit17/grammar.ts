import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_17_SOURCE } from '../provenance'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 17 grammar (Stage 7H). The TWO concepts of the approved Stage 7B plan, each with a capped scope (docs/authoring/A2_UNIT17_DESIGN_NOTES.md):
 *  1. `a2-deshalb-darum` — `deshalb / darum` in a main clause (verb in position 2) vs. `weil` (verb final). Not taught: `trotzdem`, `also`, `denn` as a rule.
 *  2. `a2-wenn-als` — `wenn` (present / future, repeated events, also repeated in the past) vs. `als` (ONE event in the past). The als-clause is capped to
 *     the Präteritum of sein / haben (`war`, `hatte`) or the Perfekt (auxiliary at the end); no other Präteritum forms. Decision D-2 of the Stage 7B report:
 *     the plan as written is implemented (see the design notes for the audit's alternative).
 * Not taught: `bevor / nachdem / während` (B1), `seit` clauses, `als` in comparison (unit 13), the temporal prepositions concept proposed by the audit.
 */
export const UNIT_17_GRAMMAR: GrammarConcept[] = [
  {
    id: 'a2-deshalb-darum',
    category: 'conjunctions',
    level: 'A2',
    unit: 17,
    visual: 'verbpos',
    title: l('weil и deshalb / darum: причина и следствие', 'weil жана deshalb / darum: себеп жана натыйжа'),
    summary: l(
      'Причину и следствие можно связать двумя способами. С weil причина стоит в придаточной части, и глагол уходит в конец: «Ich mache ein Praktikum, weil ich keine Erfahrung habe». С deshalb (или darum) сначала называют причину, а следствие идёт в главной части: deshalb стоит на первом месте, и глагол сразу за ним: «Ich habe keine Erfahrung, deshalb mache ich ein Praktikum». С deshalb и darum глагол в конец не уходит. Смысл у обоих способов один: причина → следствие.',
      'Себепти жана натыйжаны эки жол менен байланыштырса болот. weil менен себеп кошумча бөлүктө турат, этиш аягына өтөт: «Ich mache ein Praktikum, weil ich keine Erfahrung habe». deshalb (же darum) менен адегенде себеп аталат, ал эми натыйжа башкы бөлүктө турат: deshalb биринчи орунда, этиш андан кийин дароо: «Ich habe keine Erfahrung, deshalb mache ich ein Praktikum». deshalb жана darum менен этиш аягына өтпөйт. Экөөнүн мааниси бирдей: себеп → натыйжа.',
    ),
    discover: l(
      'Сравните: «Ich bin müde, weil ich viel arbeite» и «Ich arbeite viel, deshalb bin ich müde». Где стоит причина в каждом предложении? Где стоит глагол после weil и где — после deshalb?',
      '«Ich bin müde, weil ich viel arbeite» жана «Ich arbeite viel, deshalb bin ich müde» деген сүйлөмдөрдү салыштырыңыз. Ар бир сүйлөмдө себеп кайда турат? weil сөзүнөн кийин этиш кайда, ал эми deshalb сөзүнөн кийин кайда турат?',
    ),
    why: l(
      'Когда вы рассказываете о работе, учёбе или причине смены места, вам нужно объяснить причину и следствие: «Ich arbeite in Teilzeit, deshalb habe ich mehr Zeit». Вы уже знаете weil из юнита 11; deshalb и darum дают второй способ, который звучит естественно в разговоре и на собеседовании. Главное правило: после deshalb порядок слов обычный — глагол на втором месте.',
      'Жумуш, окуу же ордун алмаштыруу себеби жөнүндө айтып жатканда себепти жана натыйжаны түшүндүрүү керек: «Ich arbeite in Teilzeit, deshalb habe ich mehr Zeit». weil сөзүн 11-бөлүмдөн билесиз; deshalb жана darum маектешүүдө жана жумушка кабыл алуу маегинде табигый угулган экинчи жолду берет. Негизги эреже: deshalb сөзүнөн кийин сөз тартиби кадимкидей — этиш экинчи орунда.',
    ),
    when: [
      l(
        'weil — причина стоит после него, глагол в конце: Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.',
        'weil — себеп андан кийин турат, этиш аягында: Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.',
      ),
      l(
        'deshalb / darum — следствие в главной части: Ich möchte in Deutschland arbeiten, deshalb lerne ich Deutsch.',
        'deshalb / darum — натыйжа башкы бөлүктө: Ich möchte in Deutschland arbeiten, deshalb lerne ich Deutsch.',
      ),
      l(
        'Порядок слов после deshalb: deshalb — позиция 1, глагол — позиция 2, потом подлежащее: deshalb lerne ich, deshalb hat er mehr Zeit.',
        'deshalb сөзүнөн кийинки сөз тартиби: deshalb — 1-орун, этиш — 2-орун, андан кийин ээ: deshalb lerne ich, deshalb hat er mehr Zeit.',
      ),
      l(
        'Darum значит то же, что deshalb: Der Bäcker beginnt um drei Uhr, darum steht er sehr früh auf.',
        'Darum сөзү deshalb менен бирдей мааниде: Der Bäcker beginnt um drei Uhr, darum steht er sehr früh auf.',
      ),
    ],
    examples: [
      { de: 'Ich habe keine Erfahrung, deshalb mache ich ein Praktikum.', ru: 'У меня нет опыта, поэтому я прохожу практику.', ky: 'Менде тажрыйба жок, ошондуктан мен практикадан өтөм.', focus: 'deshalb + глагол (позиция 2)' },
      { de: 'Ich mache ein Praktikum, weil ich keine Erfahrung habe.', ru: 'Я прохожу практику, потому что у меня нет опыта.', ky: 'Мен практикадан өтөм, анткени менде тажрыйба жок.', focus: 'weil + глагол в конце' },
      { de: 'Der Bäcker beginnt um drei Uhr, darum steht er sehr früh auf.', ru: 'Пекарь начинает работу в три часа, поэтому он встаёт очень рано.', ky: 'Нан бышыруучу саат үчтө иштей баштайт, ошондуктан абдан эрте турат.', focus: 'darum' },
      { de: 'Mein Bruder arbeitet in Teilzeit, deshalb hat er mehr Zeit.', ru: 'Мой брат работает на неполную ставку, поэтому у него больше времени.', ky: 'Менин агам толук эмес убакыт иштейт, ошондуктан анын убактысы көбүрөөк.', focus: 'deshalb hat er' },
      { de: 'Ich lerne Deutsch, darum besuche ich einen Kurs.', ru: 'Я учу немецкий, поэтому хожу на курс.', ky: 'Мен немис тилин үйрөнөм, ошондуктан курска барам.', focus: 'darum besuche ich' },
    ],
    mistakes: [
      {
        wrong: 'Ich habe keine Erfahrung, deshalb ich mache ein Praktikum.',
        right: 'Ich habe keine Erfahrung, deshalb mache ich ein Praktikum.',
        note: l(
          'После deshalb глагол стоит сразу на втором месте, а подлежащее — после него.',
          'deshalb сөзүнөн кийин этиш дароо экинчи орунда турат, ал эми ээ андан кийин келет.',
        ),
      },
      {
        wrong: 'Ich habe keine Erfahrung, deshalb ich ein Praktikum mache.',
        right: 'Ich habe keine Erfahrung, deshalb mache ich ein Praktikum.',
        note: l(
          'После deshalb глагол в конец не уходит — это порядок слов для weil.',
          'deshalb сөзүнөн кийин этиш аягына өтпөйт — бул weil үчүн сөз тартиби.',
        ),
      },
      {
        wrong: 'Ich mache ein Praktikum, weil mache ich keine Erfahrung.',
        right: 'Ich mache ein Praktikum, weil ich keine Erfahrung habe.',
        note: l(
          'После weil глагол уходит в конец: weil ich … habe.',
          'weil сөзүнөн кийин этиш аягына өтөт: weil ich … habe.',
        ),
      },
      {
        wrong: 'Ich bin müde, deshalb ich arbeite viel.',
        right: 'Ich arbeite viel, deshalb bin ich müde.',
        note: l(
          'Deshalb вводит следствие: сначала причина (я много работаю), потом следствие (я устал).',
          'Deshalb натыйжаны киргизет: адегенде себеп (мен көп иштейм), анан натыйжа (мен чарчадым).',
        ),
      },
    ],
    reallife: [
      { de: 'Ich möchte mehr Geld verdienen, deshalb suche ich eine neue Stelle.', ru: 'Я хочу зарабатывать больше, поэтому ищу новую работу.', ky: 'Мен көбүрөөк акча тапкым келет, ошондуктан жаңы жумуш издеп жатам.', focus: 'deshalb suche ich' },
      { de: 'Ich habe Erfahrung als Verkäufer, deshalb bewerbe ich mich.', ru: 'У меня есть опыт продавца, поэтому я подаю заявку.', ky: 'Менде сатуучу катары тажрыйба бар, ошондуктан мен арыз берем.', focus: 'deshalb bewerbe ich mich' },
      { de: 'Ich bewerbe mich, weil ich gern im Team arbeite.', ru: 'Я подаю заявку, потому что люблю работать в команде.', ky: 'Мен арыз берем, анткени жамаат менен иштегенди жакшы көрөм.', focus: 'weil … arbeite' },
    ],
    dialogue: [
      { speaker: 'Nina', text: 'Warum arbeitest du jetzt in Teilzeit?', ru: 'Почему ты теперь работаешь на неполную ставку?', ky: 'Эмне үчүн сен азыр толук эмес убакыт иштейсиң?' },
      { speaker: 'Paul', text: 'Ich mache einen Kurs, weil ich eine neue Stelle suche.', ru: 'Я хожу на курс, потому что ищу новую работу.', ky: 'Мен курска барам, анткени жаңы жумуш издеп жатам.' },
      { speaker: 'Nina', text: 'Und das Geld?', ru: 'А деньги?', ky: 'Ал эми акча?' },
      { speaker: 'Paul', text: 'Ich verdiene jetzt weniger, deshalb spare ich mehr.', ru: 'Я теперь зарабатываю меньше, поэтому больше экономлю.', ky: 'Мен азыр азыраак акча табам, ошондуктан көбүрөөк үнөмдөйм.' },
    ],
    speakPrompt: {
      prompt: l(
        'Объясните двумя предложениями, почему вы учите немецкий или хотите сменить работу: один раз с weil, один раз с deshalb.',
        'Эмне үчүн немис тилин үйрөнүп жатканыңызды же жумушту алмаштыргыңыз келерин эки сүйлөм менен түшүндүрүңүз: бир жолу weil менен, бир жолу deshalb менен.',
      ),
      sample: 'Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte. Ich möchte hier arbeiten, deshalb besuche ich einen Kurs.',
      keywords: ['weil', 'deshalb'],
    },
    source: UNIT_17_SOURCE,
  },
  {
    id: 'a2-wenn-als',
    category: 'conjunctions',
    level: 'A2',
    unit: 17,
    visual: 'timeline',
    title: l('wenn и als: «когда»', 'wenn жана als: «качан»'),
    summary: l(
      'Русское «когда» и кыргызское «-ганда» передают два разных немецких слова. Wenn — для настоящего и будущего («Wenn ich Zeit habe, …»), для повторяющихся событий («Wenn ich Spätschicht habe, schlafe ich lange») и для повторяющихся событий в прошлом («Wenn ich Schule hatte, habe ich früh gefrühstückt»). Als — только для одного события в прошлом: «Als ich 18 war, habe ich die Schule beendet». В обоих случаях в придаточной части глагол стоит в конце, а главная часть после неё начинается с глагола. Als мы здесь используем только с war / hatte или с Perfekt (вспомогательный глагол в конце): «Als ich die Stelle bekommen habe, …».',
      'Орусча «когда» жана кыргызча «-ганда» эки башка немис сөзүн билдирет. Wenn — азыркы жана келечектеги учурга («Wenn ich Zeit habe, …»), кайталануучу окуяларга («Wenn ich Spätschicht habe, schlafe ich lange») жана өткөндөгү кайталануучу окуяларга («Wenn ich Schule hatte, habe ich früh gefrühstückt»). Als — өткөндөгү бир жолку окуя үчүн гана: «Als ich 18 war, habe ich die Schule beendet». Экөөндө тең кошумча бөлүктө этиш аягында турат, ал эми андан кийинки башкы бөлүк этиштен башталат. Als сөзүн бул жерде war / hatte менен же Perfekt менен гана колдонобуз (жардамчы этиш аягында): «Als ich die Stelle bekommen habe, …».',
    ),
    discover: l(
      'Сравните: «Wenn ich 18 bin, …» и «Als ich 18 war, …». Какое предложение о прошлом, а какое — о будущем? А что вы скажете, если речь идёт о том, что случалось каждый день?',
      '«Wenn ich 18 bin, …» жана «Als ich 18 war, …» деген сүйлөмдөрдү салыштырыңыз. Кайсы сүйлөм өткөн убакыт жөнүндө, кайсынысы келечек жөнүндө? Ал эми күн сайын болуп турган нерсе жөнүндө сөз болсо эмне дейсиз?',
    ),
    why: l(
      'Рассказ о карьере — это события в разное время: «Als ich 18 war, habe ich die Schule beendet», «Wenn ich Frühschicht habe, stehe ich um fünf auf». Если для всего использовать одно слово, фраза прозвучит неверно. Правило короткое: одно событие в прошлом — als, всё остальное — wenn. Для русскоязычного и кыргызоязычного ученика это ловушка: перевод «когда» подходит к обоим словам, поэтому ориентируйтесь на смысл, а не на перевод.',
      'Карьера жөнүндөгү баян — ар кандай убакыттагы окуялар: «Als ich 18 war, habe ich die Schule beendet», «Wenn ich Frühschicht habe, stehe ich um fünf auf». Баары үчүн бир сөз колдонсоңуз, сүйлөм туура эмес угулат. Эреже кыска: өткөндөгү бир жолку окуя — als, калганынын баары — wenn. Орусча жана кыргызча сүйлөгөн окуучу үчүн бул тузак: «качан» деген котормо эки сөзгө тең туура келет, ошондуктан котормого эмес, маанисине таянып чечиңиз.',
    ),
    when: [
      l(
        'Wenn — настоящее и будущее: Wenn ich Zeit habe, lese ich die Zeitung. Wenn ich die Stelle bekomme, ziehe ich um.',
        'Wenn — азыркы жана келечектеги учур: Wenn ich Zeit habe, lese ich die Zeitung. Wenn ich die Stelle bekomme, ziehe ich um.',
      ),
      l(
        'Wenn — повторяющееся событие: Wenn ich Spätschicht habe, schlafe ich lange. Тоже в прошлом: Wenn ich Schule hatte, habe ich früh gefrühstückt.',
        'Wenn — кайталануучу окуя: Wenn ich Spätschicht habe, schlafe ich lange. Өткөндө да: Wenn ich Schule hatte, habe ich früh gefrühstückt.',
      ),
      l(
        'Als — одно событие в прошлом: Als ich 18 war, habe ich die Schule beendet. Als ich im Praktikum war, habe ich viel gelernt.',
        'Als — өткөндөгү бир жолку окуя: Als ich 18 war, habe ich die Schule beendet. Als ich im Praktikum war, habe ich viel gelernt.',
      ),
      l(
        'Порядок слов: глагол в конце придаточной части, потом главная часть начинается с глагола: Als ich 18 war, habe ich …',
        'Сөз тартиби: кошумча бөлүктүн аягында этиш, андан кийин башкы бөлүк этиштен башталат: Als ich 18 war, habe ich …',
      ),
    ],
    examples: [
      { de: 'Als ich 18 war, habe ich die Schule beendet.', ru: 'Когда мне было 18, я закончил школу.', ky: 'Мен 18 жашта болгондо мектепти бүтүрдүм.', focus: 'als + war (одно событие)' },
      { de: 'Als ich im Praktikum war, habe ich ein Zertifikat bekommen.', ru: 'Когда я был на практике, я получил сертификат.', ky: 'Практикада болгондо мен тастыктама алдым.', focus: 'als … war' },
      { de: 'Als ich die Stelle bekommen habe, war ich sehr glücklich.', ru: 'Когда я получил это место, я был очень счастлив.', ky: 'Мен бул жумушту алганда абдан бактылуу болдум.', focus: 'als + Perfekt (habe в конце)' },
      { de: 'Wenn ich Spätschicht habe, schlafe ich lange.', ru: 'Когда у меня поздняя смена, я долго сплю.', ky: 'Менин кечки алмашуум болсо, мен узак уктайм.', focus: 'wenn (повтор)' },
      { de: 'Wenn ich die Stelle bekomme, ziehe ich um.', ru: 'Если я получу это место, я перееду.', ky: 'Эгер мен бул жумушту алсам, көчүп кетем.', focus: 'wenn (будущее)' },
    ],
    mistakes: [
      {
        wrong: 'Wenn ich 18 war, habe ich die Schule beendet.',
        right: 'Als ich 18 war, habe ich die Schule beendet.',
        note: l(
          'Одно событие в прошлом — als, а не wenn.',
          'Өткөндөгү бир жолку окуя — als, wenn эмес.',
        ),
      },
      {
        wrong: 'Als ich Spätschicht habe, schlafe ich lange.',
        right: 'Wenn ich Spätschicht habe, schlafe ich lange.',
        note: l(
          'Повторяющееся событие в настоящем — wenn; als для этого не подходит.',
          'Азыркы убакыттагы кайталануучу окуя — wenn; als бул үчүн жарабайт.',
        ),
      },
      {
        wrong: 'Als ich 18 war, ich habe die Schule beendet.',
        right: 'Als ich 18 war, habe ich die Schule beendet.',
        note: l(
          'После придаточной части главная часть начинается с глагола: habe ich.',
          'Кошумча бөлүктөн кийин башкы бөлүк этиштен башталат: habe ich.',
        ),
      },
      {
        wrong: 'Wenn ich Zeit habe ich lese.',
        right: 'Wenn ich Zeit habe, lese ich.',
        note: l(
          'Между частями ставится запятая, а после неё главная часть начинается с глагола.',
          'Бөлүктөрдүн ортосуна үтүр коюлат, андан кийин башкы бөлүк этиштен башталат.',
        ),
      },
    ],
    reallife: [
      { de: 'Wenn ich Zeit habe, mache ich eine Weiterbildung.', ru: 'Когда у меня будет время, я пройду курс повышения квалификации.', ky: 'Убактым болгондо мен квалификациямды жогорулатам.', focus: 'wenn ich Zeit habe' },
      { de: 'Als ich jung war, habe ich in einer Bäckerei angefangen.', ru: 'Когда я был молод, я начал работать в пекарне.', ky: 'Жаш кезимде мен нан бышыруучу жайда иштей баштагам.', focus: 'als ich jung war' },
      { de: 'Wenn ich um fünf Uhr aufstehe, bin ich müde.', ru: 'Когда я встаю в пять часов, я устаю.', ky: 'Саат бешке турсам, мен чарчайм.', focus: 'wenn ich aufstehe' },
    ],
    dialogue: [
      { speaker: 'Nina', text: 'Wann hast du die Ausbildung gemacht?', ru: 'Когда ты проходил обучение?', ky: 'Окууну качан бүттүң?' },
      { speaker: 'Paul', text: 'Als ich 18 war, habe ich in einer Werkstatt angefangen.', ru: 'Когда мне было 18, я начал в мастерской.', ky: '18 жашымда мен устаканада баштагам.' },
      { speaker: 'Nina', text: 'Und wie ist es jetzt?', ru: 'А как сейчас?', ky: 'Ал эми азыр кандай?' },
      { speaker: 'Paul', text: 'Wenn ich früh anfange, bin ich um drei Uhr fertig.', ru: 'Когда я начинаю рано, я заканчиваю в три часа.', ky: 'Эрте баштасам, мен саат үчтө бүтөм.' },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите о своём пути: что вы сделали, когда вам было определённое количество лет (als), и что вы обычно делаете на работе или в учёбе (wenn).',
        'Өз жолуңуз жөнүндө айтып бериңиз: белгилүү жашта эмне кылганыңызды (als) жана жумушта же окууда адатта эмне кыларыңызды (wenn).',
      ),
      sample: 'Als ich 18 war, habe ich die Schule beendet. Wenn ich früh anfange, bin ich um drei Uhr fertig.',
      keywords: ['als', 'wenn'],
    },
    source: UNIT_17_SOURCE,
  },
]

/** "Why?" notes of Unit 17. */
export const UNIT_17_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Ich habe keine Erfahrung, deshalb mache ich ein Praktikum.',
    ru: 'У меня нет опыта, поэтому я прохожу практику.',
    ky: 'Менде тажрыйба жок, ошондуктан мен практикадан өтөм.',
    word: 'deshalb',
    conceptId: 'a2-deshalb-darum',
    reason: l(
      'Deshalb вводит следствие. Оно стоит на первом месте, поэтому глагол mache — на втором, а подлежащее ich — после него.',
      'Deshalb натыйжаны киргизет. Ал биринчи орунда турат, ошондуктан mache этиши экинчи, ал эми ээси ich андан кийин келет.',
    ),
    more: [
      { de: 'Ich lerne Deutsch, darum besuche ich einen Kurs.', ru: 'Я учу немецкий, поэтому хожу на курс.', ky: 'Мен немис тилин үйрөнөм, ошондуктан курска барам.' },
      { de: 'Mein Bruder arbeitet in Teilzeit, deshalb hat er mehr Zeit.', ru: 'Мой брат работает на неполную ставку, поэтому у него больше времени.', ky: 'Менин агам толук эмес убакыт иштейт, ошондуктан анын убактысы көбүрөөк.' },
    ],
  },
  {
    sentence: 'Ich mache ein Praktikum, weil ich keine Erfahrung habe.',
    ru: 'Я прохожу практику, потому что у меня нет опыта.',
    ky: 'Мен практикадан өтөм, анткени менде тажрыйба жок.',
    word: 'habe',
    conceptId: 'a2-deshalb-darum',
    reason: l(
      'После weil начинается придаточная часть: подлежащее ich идёт сразу за weil, а глагол habe уходит в самый конец.',
      'weil сөзүнөн кийин кошумча бөлүк башталат: ээ ich weil сөзүнөн кийин дароо турат, ал эми habe этиши эң аягына өтөт.',
    ),
    more: [
      { de: 'Ich bewerbe mich, weil ich gern im Team arbeite.', ru: 'Я подаю заявку, потому что люблю работать в команде.', ky: 'Мен арыз берем, анткени жамаат менен иштегенди жакшы көрөм.' },
      { de: 'Ich lerne Deutsch, weil ich in Deutschland arbeiten möchte.', ru: 'Я учу немецкий, потому что хочу работать в Германии.', ky: 'Мен немис тилин үйрөнөм, анткени Германияда иштегим келет.' },
    ],
  },
  {
    sentence: 'Als ich 18 war, habe ich die Schule beendet.',
    ru: 'Когда мне было 18, я закончил школу.',
    ky: 'Мен 18 жашта болгондо мектепти бүтүрдүм.',
    word: 'Als',
    conceptId: 'a2-wenn-als',
    reason: l(
      'Школу вы закончили один раз в прошлом, поэтому als. В части с als глагол war — в конце, а главная часть начинается с глагола: habe ich.',
      'Мектепти өткөндө бир жолу бүтүрдүңүз, ошондуктан als. als бөлүгүндө war этиши аягында, ал эми башкы бөлүк этиштен башталат: habe ich.',
    ),
    more: [
      { de: 'Als ich im Praktikum war, habe ich ein Zertifikat bekommen.', ru: 'Когда я был на практике, я получил сертификат.', ky: 'Практикада болгондо мен тастыктама алдым.' },
      { de: 'Als ich die Stelle bekommen habe, war ich sehr glücklich.', ru: 'Когда я получил это место, я был очень счастлив.', ky: 'Мен бул жумушту алганда абдан бактылуу болдум.' },
    ],
  },
  {
    sentence: 'Wenn ich Spätschicht habe, schlafe ich lange.',
    ru: 'Когда у меня поздняя смена, я долго сплю.',
    ky: 'Менин кечки алмашуум болсо, мен узак уктайм.',
    word: 'Wenn',
    conceptId: 'a2-wenn-als',
    reason: l(
      'Поздняя смена бывает много раз, это повторяющееся событие, поэтому wenn. Глагол habe — в конце, а главная часть начинается с глагола: schlafe ich.',
      'Кечки алмашуу көп жолу болот, бул кайталануучу окуя, ошондуктан wenn. habe этиши аягында, ал эми башкы бөлүк этиштен башталат: schlafe ich.',
    ),
    more: [
      { de: 'Wenn ich die Stelle bekomme, ziehe ich um.', ru: 'Если я получу это место, я перееду.', ky: 'Эгер мен бул жумушту алсам, көчүп кетем.' },
      { de: 'Wenn ich Schule hatte, habe ich früh gefrühstückt.', ru: 'Когда у меня были уроки, я рано завтракал.', ky: 'Менин сабагым болгондо мен эрте эртең мененки тамак ичкем.' },
    ],
  },
]
