import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_18_SOURCE } from '../provenance'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 18 grammar (Stage 7I). The TWO concepts of the approved Stage 7B plan, each with a capped scope (docs/authoring/A2_UNIT18_DESIGN_NOTES.md):
 *  1. `a2-praepositionen-reiseziele` — the pairs for destinations and places: nach / in / an / auf / zu (Wohin?), in / an / auf / bei (Wo?), aus / von (Woher?).
 *     Countries with an article are limited to die Schweiz, die Türkei, die USA. Taught as memorised pairs, not as a translation rule.
 *  2. `a2-zukunft-praesens-werden` — the PRESENT with a time word for the future (Nächstes Jahr fahre ich …); `werden` + Infinitiv is RECEPTIVE in general and
 *     productive only in the weather chunk `Es wird …` (kalt, warm, sonnig, regnen). No Futur II, no werden for intentions.
 * Not taught: other countries with an article, Genitiv, Dativ after prepositions with an adjective, `bis` / `entlang` / `über` as route prepositions.
 */
export const UNIT_18_GRAMMAR: GrammarConcept[] = [
  {
    id: 'a2-praepositionen-reiseziele',
    category: 'prepositions',
    level: 'A2',
    unit: 18,
    visual: 'prepositions',
    title: l('Предлоги для мест и целей поездки: nach, in, an, auf, zu, bei, aus, von', 'Жерлер жана саякат максаттары үчүн предлогдор: nach, in, an, auf, zu, bei, aus, von'),
    summary: l(
      'Предлог зависит от того, куда вы едете, где вы находитесь и откуда вы. Куда? К городу и стране без артикля — nach: «nach Berlin», «nach Italien». К стране с артиклем — in + Akkusativ: «in die Schweiz», «in die Türkei». К морю и озеру — an: «ans Meer», «an den See». В горы — «in die Berge». К человеку или месту — zu + Dativ: «zu meiner Tante», «zum Bahnhof». Где? «in Berlin», «in der Schweiz», «am Meer», «bei meiner Tante». Откуда? aus + Dativ — страна и город («aus Deutschland», «aus der Schweiz»), von + Dativ — место или человек («vom Bahnhof»). Страны с артиклем ограничиваем тремя: die Schweiz, die Türkei, die USA. Эти пары не выводят из русского или кыргызского языка: их учат как готовые сочетания.',
      'Предлог кайда баратканыңызга, кайдасыз жана кайдан экениңизге жараша тандалат. Кайда баратасыз? Артиклсиз шаарга жана өлкөгө — nach: «nach Berlin», «nach Italien». Артикли бар өлкөгө — in + Akkusativ: «in die Schweiz», «in die Türkei». Деңизге жана көлгө — an: «ans Meer», «an den See». Тоого — «in die Berge». Адамга же жерге — zu + Dativ: «zu meiner Tante», «zum Bahnhof». Кайдасыз? «in Berlin», «in der Schweiz», «am Meer», «bei meiner Tante». Кайдан? aus + Dativ — өлкө жана шаар («aus Deutschland», «aus der Schweiz»), von + Dativ — жер же адам («vom Bahnhof»). Артикли бар өлкөлөрдү үчөө менен чектейбиз: die Schweiz, die Türkei, die USA. Бул жуптарды орус же кыргыз тилинен чыгарууга болбойт: аларды даяр айкаш катары жаттоо керек.',
    ),
    discover: l(
      'Сравните: «Ich fahre nach Berlin» и «Ich fahre in die Schweiz». Почему в одном случае стоит nach без артикля, а в другом — in и артикль? А что вы скажете о море: «Wir fahren … Meer»?',
      '«Ich fahre nach Berlin» жана «Ich fahre in die Schweiz» деген сүйлөмдөрдү салыштырыңыз. Эмне үчүн бир учурда артиклсиз nach, экинчисинде in жана артикль турат? Ал эми деңиз жөнүндө эмне деп айтасыз: «Wir fahren … Meer»?',
    ),
    why: l(
      'Планируя поездку, покупая билет или рассказывая об отпуске, вы постоянно говорите, куда вы едете, где вы живёте и откуда приехали. Если выбрать другой предлог, вас поймут, но фраза прозвучит неверно. Набор небольшой: nach для городов и стран без артикля, in и an для остального, zu и bei для людей.',
      'Саякатты пландап, билет сатып алганда же эс алуу жөнүндө айтканда кайда барып жатканыңызды, кайда жашаарыңызды жана кайдан келгениңизди дайыма айтасыз. Башка предлогду тандасаңыз, сизди түшүнөт, бирок сүйлөм туура эмес угулат. Топтом кичине: артиклсиз шаарлар жана өлкөлөр үчүн nach, калганы үчүн in жана an, адамдар үчүн zu жана bei.',
    ),
    when: [
      l(
        'Wohin? Города и страны без артикля — nach: Ich fahre nach Berlin. Wir fliegen nach Italien.',
        'Wohin? Артиклсиз шаарлар жана өлкөлөр — nach: Ich fahre nach Berlin. Wir fliegen nach Italien.',
      ),
      l(
        'Wohin? Страны с артиклем и горы — in + Akkusativ: in die Schweiz, in die Türkei, in die Berge. Море и озеро — an: ans Meer, an den See.',
        'Wohin? Артикли бар өлкөлөр жана тоолор — in + Akkusativ: in die Schweiz, in die Türkei, in die Berge. Деңиз жана көл — an: ans Meer, an den See.',
      ),
      l(
        'Wohin? К человеку или месту — zu + Dativ: zu meiner Tante, zum Bahnhof (zu dem), zur Tankstelle (zu der).',
        'Wohin? Адамга же жерге — zu + Dativ: zu meiner Tante, zum Bahnhof (zu dem), zur Tankstelle (zu der).',
      ),
      l(
        'Где (Wo?): in Berlin, in der Schweiz, am Meer (an dem), im Wald, bei meiner Tante. Откуда (Woher?): aus Deutschland, aus der Schweiz, vom Bahnhof (von dem).',
        'Кайда (Wo?): in Berlin, in der Schweiz, am Meer (an dem), im Wald, bei meiner Tante. Кайдан (Woher?): aus Deutschland, aus der Schweiz, vom Bahnhof (von dem).',
      ),
    ],
    examples: [
      { de: 'Ich fahre nach Berlin.', ru: 'Я еду в Берлин.', ky: 'Мен Берлинге барам.', focus: 'nach + город' },
      { de: 'Wir fahren in die Schweiz.', ru: 'Мы едем в Швейцарию.', ky: 'Биз Швейцарияга барабыз.', focus: 'in + Akkusativ (die Schweiz)' },
      { de: 'Im Sommer fahren wir ans Meer.', ru: 'Летом мы едем к морю.', ky: 'Жайында биз деңизге барабыз.', focus: 'an + Akkusativ (ans = an das)' },
      { de: 'Ich fahre zu meiner Tante.', ru: 'Я еду к своей тёте.', ky: 'Мен теземе барам.', focus: 'zu + Dativ (человек)' },
      { de: 'Ich wohne bei meiner Tante.', ru: 'Я живу у своей тёти.', ky: 'Мен тезем менен чогуу жашайм.', focus: 'bei + Dativ (человек)' },
      { de: 'Ich komme aus der Schweiz.', ru: 'Я приехал из Швейцарии.', ky: 'Мен Швейцариядан келдим.', focus: 'aus + Dativ' },
    ],
    mistakes: [
      {
        wrong: 'Ich fahre in Berlin.',
        right: 'Ich fahre nach Berlin.',
        note: l(
          'К городу без артикля едут nach, а не in. Предлог in стоит на вопрос «Wo?»: Ich wohne in Berlin.',
          'Артиклсиз шаарга nach менен барышат, in менен эмес. in «Wo?» деген суроого турат: Ich wohne in Berlin.',
        ),
      },
      {
        wrong: 'Wir fahren nach die Schweiz.',
        right: 'Wir fahren in die Schweiz.',
        note: l(
          'Страна с артиклем: in + Akkusativ, а не nach.',
          'Артикли бар өлкө: in + Akkusativ, nach эмес.',
        ),
      },
      {
        wrong: 'Ich wohne zu meiner Tante.',
        right: 'Ich wohne bei meiner Tante.',
        note: l(
          'Zu — «к» (куда?). Где вы живёте — bei: bei meiner Tante.',
          'Zu — «…ге» (кайда?). Кайда жашасаңыз — bei: bei meiner Tante.',
        ),
      },
      {
        wrong: 'Im Sommer fahren wir am Meer.',
        right: 'Im Sommer fahren wir ans Meer.',
        note: l(
          'Направление («куда?») требует Akkusativ: ans Meer. Am Meer — это «где?»: Wir sind am Meer.',
          'Багыт («кайда?») Akkusativ талап кылат: ans Meer. Am Meer — бул «кайда?»: Wir sind am Meer.',
        ),
      },
    ],
    reallife: [
      { de: 'Ich möchte ein Ticket nach Hamburg.', ru: 'Я хотел бы билет до Гамбурга.', ky: 'Мен Гамбургга жол билетин алгым келет.', focus: 'nach Hamburg' },
      { de: 'Am Wochenende fahren wir an den See.', ru: 'На выходных мы едем к озеру.', ky: 'Дем алыш күндөрү биз көлгө барабыз.', focus: 'an den See' },
      { de: 'Wie komme ich zum Bahnhof?', ru: 'Как мне добраться до вокзала?', ky: 'Вокзалга кантип барсам болот?', focus: 'zum Bahnhof' },
      { de: 'Wir wohnen im Hotel am Strand.', ru: 'Мы живём в гостинице на пляже.', ky: 'Биз деңиз жээгиндеги мейманканада жашайбыз.', focus: 'im Hotel, am Strand' },
    ],
    dialogue: [
      { speaker: 'Lara', text: 'Wohin fährst du im Sommer?', ru: 'Куда ты едешь летом?', ky: 'Жайында сен кайда барасың?' },
      { speaker: 'Ben', text: 'Ich fahre in die Schweiz. Und du?', ru: 'Я еду в Швейцарию. А ты?', ky: 'Мен Швейцарияга барам. Ал эми сен?' },
      { speaker: 'Lara', text: 'Ich fahre ans Meer, zu meiner Tante.', ru: 'Я еду к морю, к тёте.', ky: 'Мен деңизге, теземе барам.' },
      { speaker: 'Ben', text: 'Und wo wohnt deine Tante?', ru: 'А где живёт твоя тётя?', ky: 'Ал эми сенин тезең кайда жашайт?' },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите, куда вы поедете в отпуск, где вы будете жить и откуда вы приехали: три коротких предложения.',
        'Эс алууга кайда барарыңызды, кайда жашаарыңызды жана кайдан келгениңизди айтып бериңиз: үч кыска сүйлөм.',
      ),
      sample: 'Ich fahre nach Italien. Ich wohne bei meiner Tante. Ich komme aus der Schweiz.',
      keywords: ['nach', 'bei', 'aus'],
    },
    source: UNIT_18_SOURCE,
  },
  {
    id: 'a2-zukunft-praesens-werden',
    category: 'tenses',
    level: 'A2',
    unit: 18,
    visual: 'timeline',
    title: l('Будущее: настоящее время + слово о времени (и «Es wird …» в прогнозе погоды)', 'Келечек: азыркы чак + убакыт сөзү («Es wird …» аба ырайынын божомолунда)'),
    summary: l(
      'О будущем в немецком обычно говорят в настоящем времени со словом о времени: «Nächstes Jahr fahre ich nach Italien», «Morgen kaufe ich ein Ticket», «Im Sommer fliege ich nach Wien». Слово о времени (morgen, im Sommer, in zwei Wochen, nächstes Jahr) показывает, что речь о будущем. Если слово о времени стоит в начале предложения, глагол остаётся вторым: «Morgen fahre ich …». Особая форма werden нужна нам в одном случае — прогноз погоды: «Morgen wird es regnen», «Am Wochenende wird es kalt». Другие предложения с werden (например, «Ich werde dich anrufen») вы будете узнавать, но не использовать.',
      'Келечек жөнүндө немис тилинде көбүнчө азыркы чакта убакыт сөзү менен айтышат: «Nächstes Jahr fahre ich nach Italien», «Morgen kaufe ich ein Ticket», «Im Sommer fliege ich nach Wien». Убакыт сөзү (morgen, im Sommer, in zwei Wochen, nächstes Jahr) сөз келечек жөнүндө экенин көрсөтөт. Убакыт сөзү сүйлөмдүн башында турса, этиш экинчи орунда калат: «Morgen fahre ich …». werden өзгөчө формасы бизге бир учурда гана керек — аба ырайынын божомолунда: «Morgen wird es regnen», «Am Wochenende wird es kalt». werden менен башка сүйлөмдөрдү (мисалы, «Ich werde dich anrufen») тааный бересиз, бирок колдонбойсуз.',
    ),
    discover: l(
      'Сравните: «Ich fahre nach Italien» и «Nächstes Jahr fahre ich nach Italien». В первом предложении поездка идёт сейчас или в будущем? Какое слово в втором предложении показывает время и где стоит глагол?',
      '«Ich fahre nach Italien» жана «Nächstes Jahr fahre ich nach Italien» деген сүйлөмдөрдү салыштырыңыз. Биринчи сүйлөмдө саякат азыр же келечекте болот? Экинчи сүйлөмдө кайсы сөз убакытты көрсөтөт жана этиш кайда турат?',
    ),
    why: l(
      'Когда вы обсуждаете планы на лето, покупаете билет «на завтра» или спрашиваете о погоде, вам нужно говорить о будущем. Хорошая новость: отдельной формы будущего времени не нужно — достаточно настоящего времени и слова о времени. Прогноз погоды — единственное место, где вы услышите и скажете «wird».',
      'Жайкы пландарды талкуулаганда, «эртеңки» билет сатып алганда же аба ырайы жөнүндө сураганда келечек жөнүндө айтуу керек. Жакшы жаңылык: келечектин өзүнчө формасы керек эмес — азыркы чак жана убакыт сөзү жетиштүү. Аба ырайынын божомолу — «wird» сөзүн угуп да, айтып да турган жалгыз жер.',
    ),
    when: [
      l(
        'Будущее = настоящее время + слово о времени: Morgen kaufe ich ein Ticket. Im Sommer fliege ich nach Wien. In zwei Wochen fahren wir ans Meer.',
        'Келечек = азыркы чак + убакыт сөзү: Morgen kaufe ich ein Ticket. Im Sommer fliege ich nach Wien. In zwei Wochen fahren wir ans Meer.',
      ),
      l(
        'Слово о времени в начале — глагол вторым: Nächstes Jahr fahre ich in die Schweiz. Am Samstag besichtigen wir die Stadt.',
        'Убакыт сөзү башында — этиш экинчи орунда: Nächstes Jahr fahre ich in die Schweiz. Am Samstag besichtigen wir die Stadt.',
      ),
      l(
        'Прогноз погоды: es wird + прилагательное или инфинитив. Morgen wird es regnen. Am Wochenende wird es kalt.',
        'Аба ырайынын божомолу: es wird + сын атооч же инфинитив. Morgen wird es regnen. Am Wochenende wird es kalt.',
      ),
      l(
        'Прошлое — Perfekt (юнит 11), будущее — настоящее время: Gestern bin ich gefahren. Morgen fahre ich.',
        'Өткөн убакыт — Perfekt (11-бөлүм), келечек — азыркы чак: Gestern bin ich gefahren. Morgen fahre ich.',
      ),
    ],
    examples: [
      { de: 'Nächstes Jahr fahre ich nach Italien.', ru: 'В следующем году я поеду в Италию.', ky: 'Келерки жылы мен Италияга барам.', focus: 'время в начале, глагол вторым' },
      { de: 'Morgen kaufe ich ein Ticket nach Berlin.', ru: 'Завтра я куплю билет до Берлина.', ky: 'Эртең мен Берлинге жол билетин сатып алам.', focus: 'Präsens + morgen' },
      { de: 'In zwei Wochen fahren wir ans Meer.', ru: 'Через две недели мы едем к морю.', ky: 'Эки жумадан кийин биз деңизге барабыз.', focus: 'in zwei Wochen' },
      { de: 'Morgen wird es regnen.', ru: 'Завтра будет дождь.', ky: 'Эртең жамгыр жаайт.', focus: 'es wird + Infinitiv' },
      { de: 'Am Wochenende wird es kalt.', ru: 'На выходных станет холодно.', ky: 'Дем алыш күндөрү суук болот.', focus: 'es wird + прилагательное' },
    ],
    mistakes: [
      {
        wrong: 'Morgen ich fahre nach Hamburg.',
        right: 'Morgen fahre ich nach Hamburg.',
        note: l(
          'Если слово о времени стоит первым, глагол остаётся вторым, а подлежащее идёт после него.',
          'Убакыт сөзү биринчи турса, этиш экинчи орунда калат, ал эми ээ андан кийин келет.',
        ),
      },
      {
        wrong: 'Nächstes Jahr bin ich nach Italien gefahren.',
        right: 'Nächstes Jahr fahre ich nach Italien.',
        note: l(
          'Для будущего нужен не Perfekt, а настоящее время со словом о времени.',
          'Келечек үчүн Perfekt эмес, убакыт сөзү бар азыркы чак керек.',
        ),
      },
      {
        wrong: 'Morgen es wird regnen.',
        right: 'Morgen wird es regnen.',
        note: l(
          'Форма wird стоит на втором месте, а es — после неё. Инфинитив regnen уходит в конец.',
          'wird формасы экинчи орунда турат, es андан кийин келет. regnen инфинитиви аягына өтөт.',
        ),
      },
      {
        wrong: 'Morgen es regnet werden.',
        right: 'Morgen wird es regnen.',
        note: l(
          'Здесь вспомогательный глагол werden меняется (wird), а смысловой глагол стоит в инфинитиве (regnen) в конце.',
          'Мында жардамчы этиш werden өзгөрөт (wird), ал эми маанилүү этиш инфинитивде (regnen) аягында турат.',
        ),
      },
    ],
    reallife: [
      { de: 'Wann fährst du? – Morgen früh.', ru: 'Когда ты едешь? — Завтра утром.', ky: 'Качан барасың? — Эртең эртең менен.', focus: 'Präsens + morgen' },
      { de: 'Nächste Woche fliegen wir nach Wien.', ru: 'На следующей неделе мы летим в Вену.', ky: 'Келерки жумада биз Венага учабыз.', focus: 'Nächste Woche + глагол' },
      { de: 'Wie wird das Wetter morgen?', ru: 'Какая завтра будет погода?', ky: 'Эртең аба ырайы кандай болот?', focus: 'wie wird das Wetter' },
    ],
    dialogue: [
      { speaker: 'Lara', text: 'Wann fährst du in den Urlaub?', ru: 'Когда ты едешь в отпуск?', ky: 'Эс алууга качан барасың?' },
      { speaker: 'Ben', text: 'Im August fahre ich ans Meer.', ru: 'В августе я еду к морю.', ky: 'Август айында мен деңизге барам.' },
      { speaker: 'Lara', text: 'Und wie wird das Wetter?', ru: 'А какая будет погода?', ky: 'Ал эми аба ырайы кандай болот?' },
      { speaker: 'Ben', text: 'Die Wettervorhersage sagt: Es wird sonnig.', ru: 'Прогноз погоды говорит: будет солнечно.', ky: 'Аба ырайынын божомолу айтат: күн ачык болот.' },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите о двух планах на будущее со словом о времени (morgen, im Sommer, nächstes Jahr) и скажите, какая будет погода.',
        'Убакыт сөзү менен (morgen, im Sommer, nächstes Jahr) келечектеги эки планыңыз жөнүндө айтып, аба ырайы кандай болорун айтыңыз.',
      ),
      sample: 'Im Sommer fahre ich ans Meer. Nächstes Jahr fahre ich in die Schweiz. Morgen wird es sonnig.',
      keywords: ['im sommer', 'nächstes jahr', 'wird'],
    },
    source: UNIT_18_SOURCE,
  },
]

/** "Why?" notes of Unit 18. */
export const UNIT_18_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Wir fahren in die Schweiz.',
    ru: 'Мы едем в Швейцарию.',
    ky: 'Биз Швейцарияга барабыз.',
    word: 'in',
    conceptId: 'a2-praepositionen-reiseziele',
    reason: l(
      'Die Schweiz — страна с артиклем. К таким странам едут in + Akkusativ (in die Schweiz), а nach стоит только перед городами и странами без артикля.',
      'Die Schweiz — артикли бар өлкө. Мындай өлкөлөргө in + Akkusativ менен барышат (in die Schweiz), ал эми nach артиклсиз шаарлардын жана өлкөлөрдүн алдында гана турат.',
    ),
    more: [
      { de: 'Ich fahre nach Berlin.', ru: 'Я еду в Берлин.', ky: 'Мен Берлинге барам.' },
      { de: 'Im Sommer fahren wir ans Meer.', ru: 'Летом мы едем к морю.', ky: 'Жайында биз деңизге барабыз.' },
    ],
  },
  {
    sentence: 'Ich wohne bei meiner Tante.',
    ru: 'Я живу у своей тёти.',
    ky: 'Мен тезем менен чогуу жашайм.',
    word: 'bei',
    conceptId: 'a2-praepositionen-reiseziele',
    reason: l(
      'Bei — «у кого-то» (где?), после bei всегда Dativ: meiner Tante. Если вы едете к человеку (куда?), нужен zu: zu meiner Tante.',
      'Bei — «бирөөнүн жеринде» (кайда?), bei сөзүнөн кийин ар дайым Dativ: meiner Tante. Адамга барсаңыз (кайда?), zu керек: zu meiner Tante.',
    ),
    more: [
      { de: 'Ich fahre zu meiner Tante.', ru: 'Я еду к своей тёте.', ky: 'Мен теземе барам.' },
      { de: 'Wir wohnen im Hotel am Strand.', ru: 'Мы живём в гостинице на пляже.', ky: 'Биз деңиз жээгиндеги мейманканада жашайбыз.' },
    ],
  },
  {
    sentence: 'Nächstes Jahr fahre ich nach Italien.',
    ru: 'В следующем году я поеду в Италию.',
    ky: 'Келерки жылы мен Италияга барам.',
    word: 'fahre',
    conceptId: 'a2-zukunft-praesens-werden',
    reason: l(
      'Это будущее, но глагол стоит в настоящем времени: слово о времени (nächstes Jahr) показывает, что речь о будущем. Оно стоит первым, поэтому fahre — вторым, а ich — после него.',
      'Бул келечек, бирок этиш азыркы чакта турат: убакыт сөзү (nächstes Jahr) сөз келечек жөнүндө экенин көрсөтөт. Ал биринчи турат, ошондуктан fahre — экинчи, ал эми ich андан кийин.',
    ),
    more: [
      { de: 'Morgen kaufe ich ein Ticket nach Berlin.', ru: 'Завтра я куплю билет до Берлина.', ky: 'Эртең мен Берлинге жол билетин сатып алам.' },
      { de: 'In zwei Wochen fahren wir ans Meer.', ru: 'Через две недели мы едем к морю.', ky: 'Эки жумадан кийин биз деңизге барабыз.' },
    ],
  },
  {
    sentence: 'Morgen wird es regnen.',
    ru: 'Завтра будет дождь.',
    ky: 'Эртең жамгыр жаайт.',
    word: 'wird',
    conceptId: 'a2-zukunft-praesens-werden',
    reason: l(
      'В прогнозе погоды используют es wird + инфинитив. Слово о времени (morgen) стоит первым, поэтому wird — вторым, es — после него, а инфинитив regnen — в конце.',
      'Аба ырайынын божомолунда es wird + инфинитив колдонулат. Убакыт сөзү (morgen) биринчи турат, ошондуктан wird — экинчи, es — андан кийин, ал эми regnen инфинитиви аягында.',
    ),
    more: [
      { de: 'Am Wochenende wird es kalt.', ru: 'На выходных станет холодно.', ky: 'Дем алыш күндөрү суук болот.' },
      { de: 'Die Wettervorhersage sagt: Es wird sonnig.', ru: 'Прогноз погоды говорит: будет солнечно.', ky: 'Аба ырайынын божомолу айтат: күн ачык болот.' },
    ],
  },
]
