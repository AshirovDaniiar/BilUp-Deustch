import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_29_SOURCE } from './unit'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 29 grammar — the three APPROVED concepts of the unit (docs/b1/B1_ID_CONVENTIONS.md), nothing else:
 *  1. `b1-relativsaetze-dativ-praeposition` (M, productive): relative clauses with a relative pronoun in the Dativ (dem / der / dem / denen) and with a preposition + relative
 *     pronoun (in der, mit dem, bei denen, von dem, für den, in das), building on the Nominativ / Akkusativ relative clause of Unit 23. NOT taught: Genitiv relative
 *     pronouns (dessen / deren), `was` / `wo` as relative words, relative clauses with a preposition + `welch-`.
 *  2. `b1-genitivattribute` (M, RECEPTIVE — the conservative, enforced classification; decision D-7 is open, a closed productive set is the pending upgrade): the Genitiv
 *     attribute after a noun (das Haus meiner Eltern, die Hauptstadt des Landes, der Name der Stadt, die Meinung eines Freundes) is recognised in texts. It is never
 *     required in a gap, a word order, a writing checklist or a speaking prompt; the spoken alternative `von` + Dativ is shown. NOT taught: Genitiv prepositions as
 *     production, Genitiv relative pronouns, Genitiv after adjectives or verbs.
 *  3. `b1-plusquamperfekt-nachdem` (M, productive; decision D-6, fallback receptive first): Plusquamperfekt (hatte / war + Partizip II) for a background event that happened
 *     BEFORE another past event, and `nachdem` + Plusquamperfekt (the main clause in the Perfekt, or in the Präteritum of the closed list of Unit 21). NOT taught:
 *     Futur II, Konjunktiv II of the past (Unit 31), the Passiv in the Plusquamperfekt.
 * All travellers, hotels, railway companies and people are fictional; a custom is always described as a personal impression, never as a fact about a whole population.
 * Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native speaker. It describes the grammar idea
 * and uses no invented grammatical labels (docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md).
 */
export const UNIT_29_GRAMMAR: GrammarConcept[] = [
  {
    id: 'b1-relativsaetze-dativ-praeposition',
    category: 'relative',
    level: 'B1',
    unit: 29,
    visual: 'verbpos',
    title: l(
      'Relativsatz mit Dativ und Präposition (dem, der, denen; in der, mit dem) — точнее описать место и человека',
      'Dativ жана предлоги бар Relativsatz (dem, der, denen; in der, mit dem) — жерди жана адамды тагыраак сүрөттөө',
    ),
    summary: l(
      'В юните 23 вы строили Relativsatz с der / die / das и den. Теперь добавляются Dativ и предлоги: «Das ist der Kollege, dem ich oft helfe», «Die Stadt, in der ich lebe, ist klein», «Die Leute, mit denen wir gereist sind, waren nett». Род и число относительного местоимения берутся из слова перед запятой, а падеж определяет глагол или предлог в придаточной части. Dativ: der Mann → dem, die Frau → der, das Kind → dem, die Leute → denen. Предлог стоит прямо перед местоимением, глагол — в самом конце.',
      '23-бөлүмдө сиз der / die / das жана den менен Relativsatz түзгөнсүз. Эми Dativ жана предлогдор кошулат: «Das ist der Kollege, dem ich oft helfe», «Die Stadt, in der ich lebe, ist klein», «Die Leute, mit denen wir gereist sind, waren nett». Байланыш сөзүнүн жынысы жана саны үтүрдүн алдындагы сөздөн алынат, ал эми жалгоону кошумча бөлүктөгү этиш же предлог аныктайт. Dativ: der Mann → dem, die Frau → der, das Kind → dem, die Leute → denen. Предлог байланыш сөзүнүн дароо алдында турат, этиш — эң аягында.',
    ),
    discover: l(
      'Сравните: «Der Zug ist ausgefallen. Ich wollte mit dem Zug fahren» и «Der Zug, mit dem ich fahren wollte, ist ausgefallen». Какое слово заменило второе «dem Zug»? Где теперь стоит предлог и где — глагол wollte?',
      '«Der Zug ist ausgefallen. Ich wollte mit dem Zug fahren» жана «Der Zug, mit dem ich fahren wollte, ist ausgefallen» сүйлөмдөрүн салыштырыңыз. Экинчи «dem Zug» сөзүнүн ордуна кайсы сөз келди? Предлог эми кайда турат, wollte этиши кайда?',
    ),
    why: l(
      'Когда вы рассказываете о поездке, вы описываете не только «отель» или «семью», но и то, в чём вы жили и с кем общались: «Das Hotel, in dem wir übernachtet haben, …», «Die Familie, bei der ich gewohnt habe, …». Так рассказ звучит связно и точно, без цепочки коротких предложений. Это же нужно в жалобе, в отзыве и в сравнении мест.',
      'Саякат жөнүндө айтканда «мейманкана» же «үй-бүлө» эле эмес, ошондой эле эмнеде жашаганыңызды жана ким менен баарлашканыңызды сүрөттөйсүз: «Das Hotel, in dem wir übernachtet haben, …», «Die Familie, bei der ich gewohnt habe, …». Ошентип баян байланыштуу жана так угулат, кыска сүйлөмдөрдүн чынжырысыз. Бул даттанууда, пикирде жана жерлерди салыштырууда да керек.',
    ),
    when: [
      l(
        'Шаг 1 — род и число: слово перед запятой определяет форму. der Kollege → dem (Dativ), die Freundin → der, das Hotel → dem, die Leute → denen. «Die Leute, denen ich geholfen habe, …».',
        '1-кадам — жынысы жана саны: үтүрдүн алдындагы сөз форманы аныктайт. der Kollege → dem (Dativ), die Freundin → der, das Hotel → dem, die Leute → denen. «Die Leute, denen ich geholfen habe, …».',
      ),
      l(
        'Шаг 2 — падеж: Dativ нужен, если глагол требует Dativ (helfen, gefallen, gehören) или предлог — Dativ (mit, bei, von, aus, nach, zu). «Der Chef, dem das Hotel gehört, …», «die Familie, bei der wir wohnen».',
        '2-кадам — жалгоо: этиш Dativди талап кылса (helfen, gefallen, gehören) же предлог Dativ менен турса (mit, bei, von, aus, nach, zu) — Dativ керек. «Der Chef, dem das Hotel gehört, …», «die Familie, bei der wir wohnen».',
      ),
      l(
        'Шаг 3 — предлоги с двумя падежами (in, auf, an, über): «где?» → Dativ: «die Stadt, in der ich lebe»; «куда?» → Akkusativ: «das Land, in das ich reisen möchte». Предлоги с Akkusativ (für, durch, um): «der Freund, für den ich das Geschenk kaufe».',
        '3-кадам — эки жалгоолуу предлогдор (in, auf, an, über): «кайда?» → Dativ: «die Stadt, in der ich lebe»; «кайда?» (багыт) → Akkusativ: «das Land, in das ich reisen möchte». Akkusativ менен турган предлогдор (für, durch, um): «der Freund, für den ich das Geschenk kaufe».',
      ),
      l(
        'Шаг 4 — порядок слов: запятая, предлог + относительное местоимение, подлежащее, затем спрягаемый глагол в самом конце: «das Hotel, in dem wir übernachtet haben». Предлог всегда стоит перед местоимением, а не в конце.',
        '4-кадам — сөздөрдүн иреттери: үтүр, предлог + байланыш сөзү, ээ, андан кийин жакка жараша өзгөргөн этиш эң аягында: «das Hotel, in dem wir übernachtet haben». Предлог дайыма байланыш сөзүнүн алдында турат, аягында эмес.',
      ),
    ],
    examples: [
      {
        de: 'Das ist der Kollege, dem ich oft helfe.',
        ru: 'Это коллега, которому я часто помогаю.',
        ky: 'Бул мен көп жардам берген кесиптеш.',
        focus: 'Dativ ohne Präposition: helfen + Dativ → dem',
      },
      {
        de: 'Die Stadt, in der ich lebe, ist klein.',
        ru: 'Город, в котором я живу, небольшой.',
        ky: 'Мен жашаган шаар кичинекей.',
        focus: 'Präposition + Dativ: in der (wo?)',
      },
      {
        de: 'Die Leute, mit denen wir gereist sind, waren sehr nett.',
        ru: 'Люди, с которыми мы путешествовали, были очень милыми.',
        ky: 'Биз менен кошо саякаттаган адамдар абдан жакшы болду.',
        focus: 'Plural im Dativ: mit denen',
      },
      {
        de: 'Das Land, in das ich reisen möchte, liegt am Meer.',
        ru: 'Страна, в которую я хочу поехать, находится у моря.',
        ky: 'Мен баргым келген өлкө деңиздин жээгинде.',
        focus: 'Präposition + Akkusativ: in das (wohin?)',
      },
      {
        de: 'Der Zug, mit dem ich fahren wollte, ist ausgefallen.',
        ru: 'Поезд, на котором я хотел ехать, отменили.',
        ky: 'Мен барайын деген поезд жокко чыгарылды.',
        focus: 'Präposition + Dativ: mit dem',
      },
    ],
    mistakes: [
      {
        wrong: 'Das ist die Stadt, die ich lebe.',
        right: 'Das ist die Stadt, in der ich lebe.',
        note: l(
          'Предлог не пропадает: «ich lebe in der Stadt» → «die Stadt, in der ich lebe». Предлог стоит перед относительным местоимением.',
          'Предлог жок болбойт: «ich lebe in der Stadt» → «die Stadt, in der ich lebe». Предлог байланыш сөзүнүн алдында турат.',
        ),
      },
      {
        wrong: 'Der Kollege, den ich helfe, ist nett.',
        right: 'Der Kollege, dem ich helfe, ist nett.',
        note: l(
          'Глагол helfen требует Dativ, поэтому не den, а dem.',
          'helfen этиши Dativди талап кылат, ошондуктан den эмес, dem.',
        ),
      },
      {
        wrong: 'Die Leute, mit die wir gereist sind, waren nett.',
        right: 'Die Leute, mit denen wir gereist sind, waren nett.',
        note: l(
          'Множественное число в Dativ — denen (после mit нужен Dativ).',
          'Көптүк сандагы Dativ — denen (mit дан кийин Dativ керек).',
        ),
      },
      {
        wrong: 'Das Land, in dem ich reisen möchte, liegt am Meer.',
        right: 'Das Land, in das ich reisen möchte, liegt am Meer.',
        note: l(
          'Если речь о направлении («куда?»), после in нужен Akkusativ: in das. Dativ (in dem) отвечает на вопрос «где?».',
          'Багыт жөнүндө («кайда?») болсо, in дан кийин Akkusativ керек: in das. Dativ (in dem) «кайда?» (жайгашуу) деген суроого жооп берет.',
        ),
      },
      {
        wrong: 'Das Hotel, in dem wir haben gewohnt, war schön.',
        right: 'Das Hotel, in dem wir gewohnt haben, war schön.',
        note: l(
          'В придаточном предложении спрягаемый глагол (haben) стоит в самом конце: «gewohnt haben».',
          'Кошумча бөлүктө жакка жараша өзгөргөн этиш (haben) эң аягында турат: «gewohnt haben».',
        ),
      },
    ],
    reallife: [
      {
        de: 'Der Zug, auf den ich gewartet habe, ist ausgefallen.',
        ru: 'Поезд, которого я ждал, отменили.',
        ky: 'Мен күткөн поезд жокко чыгарылды.',
        focus: 'auf den (warten auf + Akkusativ)',
      },
      {
        de: 'Die Familie, bei der ich gewohnt habe, war sehr gastfreundlich.',
        ru: 'Семья, у которой я жил, была очень гостеприимной.',
        ky: 'Мен жашаган үй-бүлө абдан конок тосууга ыкчам болду.',
        focus: 'bei der',
      },
      {
        de: 'Das ist der Reiseführer, von dem ich dir erzählt habe.',
        ru: 'Вот путеводитель, о котором я тебе рассказывал.',
        ky: 'Бул мен сага айтып берген жол көрсөткүч.',
        focus: 'von dem',
      },
    ],
    dialogue: [
      {
        speaker: 'Mira',
        text: 'Wie war dein Urlaub? Du hast doch in einem kleinen Hotel übernachtet.',
        ru: 'Как прошёл твой отпуск? Ты ведь ночевал в маленьком отеле.',
        ky: 'Эс алууң кандай өттү? Сен кичинекей мейманканада түнөгөнсүң го.',
      },
      {
        speaker: 'Tom',
        text: 'Gut! Das Hotel, in dem wir übernachtet haben, war ruhig, aber es gab keine Rezeption.',
        ru: 'Хорошо! Отель, в котором мы ночевали, был тихим, но там не было ресепшена.',
        ky: 'Жакшы! Биз түнөгөн мейманкана тынч болду, бирок ресепшн болгон жок.',
      },
      {
        speaker: 'Mira',
        text: 'Und die Leute? Mit wem hast du gesprochen?',
        ru: 'А люди? С кем ты общался?',
        ky: 'Ал эми адамдар? Ким менен сүйлөштүң?',
      },
      {
        speaker: 'Tom',
        text: 'Mit dem Gastgeber. Er ist ein Mann, mit dem man gut reden kann. Und die Leute, bei denen wir gegessen haben, waren auch nett.',
        ru: 'С хозяином. Он человек, с которым можно хорошо поговорить. И люди, у которых мы ели, тоже были милыми.',
        ky: 'Үй ээси менен. Ал менен жакшы сүйлөшсө болот. Ал эми биз тамактанган адамдар да жакшы болду.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Опишите место, где вы останавливались, и человека, с которым вы там общались. Используйте Relativsatz с предлогом: «in dem …», «mit dem …».',
        'Токтогон жериңизди жана ал жерде баарлашкан адамды сүрөттөңүз. Предлогу бар Relativsatz колдонуңуз: «in dem …», «mit dem …».',
      ),
      sample: 'Das ist das Hotel, in dem ich übernachtet habe. Das ist der Gastgeber, mit dem ich viel gesprochen habe. Das ist die Stadt, in die ich wieder reisen möchte.',
      keywords: ['in dem', 'mit dem', 'in die', 'gastgeber'],
    },
    source: UNIT_29_SOURCE,
  },
  {
    id: 'b1-genitivattribute',
    category: 'cases',
    level: 'B1',
    unit: 29,
    visual: 'cases',
    title: l(
      'Genitivattribut (das Haus meiner Eltern, die Hauptstadt des Landes) — понимать при чтении',
      'Genitivattribut (das Haus meiner Eltern, die Hauptstadt des Landes) — окуганда түшүнүү',
    ),
    summary: l(
      'В текстах после существительного часто стоит слово в Genitiv: оно показывает, кому что принадлежит или к чему относится: «das Haus meiner Eltern», «die Hauptstadt des Landes», «der Name der Stadt», «die Meinung eines Freundes». Признаки: der Mann / das Land → des Mannes / des Landes (окончание -(e)s), die Stadt / die Eltern → der Stadt / der Eltern, мой/мой… → meines / meiner. В этом юните Genitiv нужно только узнавать при чтении. В разговоре и в письме можно сказать проще: «von + Dativ» — «das Haus von meinen Eltern».',
      'Тексттерде зат атоочтон кийин көп учурда Genitivдеги сөз келет: ал бир нерсе кимдики экенин же эмнеге тиешелүү экенин көрсөтөт: «das Haus meiner Eltern», «die Hauptstadt des Landes», «der Name der Stadt», «die Meinung eines Freundes». Белгилери: der Mann / das Land → des Mannes / des Landes (-(e)s уландысы), die Stadt / die Eltern → der Stadt / der Eltern, мой → meines / meiner. Бул бөлүмдө Genitivди окуганда гана таануу керек. Сүйлөшкөндө жана жазганда жөнөкөйүрөөк айтса болот: «von + Dativ» — «das Haus von meinen Eltern».',
    ),
    discover: l(
      'Сравните: «Das Haus meiner Eltern» и «Das Haus von meinen Eltern». Что одинаково по смыслу? Какие слова изменились в Genitiv: «meiner Eltern» — и «des Landes» в «die Hauptstadt des Landes»?',
      '«Das Haus meiner Eltern» жана «Das Haus von meinen Eltern» сүйлөмдөрүн салыштырыңыз. Маанилери кандай бирдей? Genitivде кайсы сөздөр өзгөрдү: «meiner Eltern» жана «die Hauptstadt des Landes» ичиндеги «des Landes»?',
    ),
    why: l(
      'Эти формы встречаются в путеводителях, отзывах и новостях: «der Name des Hotels», «die Mitte der Stadt», «die Meinung eines Freundes». Вы не обязаны писать их сами, но должны понимать, что они значат: кому принадлежит вещь или к чему относится слово. Тогда текст не распадается на непонятные куски.',
      'Бул формалар жол көрсөткүчтөрдө, пикирлерде жана жаңылыктарда кездешет: «der Name des Hotels», «die Mitte der Stadt», «die Meinung eines Freundes». Аларды өзүңүз жазышыңыз шарт эмес, бирок эмнени түшүндүрөрүн түшүнүшүңүз керек: нерсе кимдики экенин же сөз эмнеге тиешелүү экенин. Анда текст түшүнүксүз бөлүктөргө бөлүнүп кетпейт.',
    ),
    when: [
      l(
        'Шаг 1 — найти слово: после существительного стоит артикль или притяжательное слово + ещё одно существительное: «die Hauptstadt des Landes», «das Haus meiner Eltern». Спросите: «чей? / чего?» — Genitiv.',
        '1-кадам — сөздү табуу: зат атоочтон кийин артикль же ээлик сөз + дагы бир зат атооч келет: «die Hauptstadt des Landes», «das Haus meiner Eltern». «Кимдики? / эмненин?» — деп сурасаңыз, бул Genitiv.',
      ),
      l(
        'Шаг 2 — признаки: der / das → des + существительное на -(e)s (des Mannes, des Landes, des Hotels); die (ед. ч.) → der (der Stadt); die (мн. ч.) → der (der Eltern). С ein / mein: eines Freundes, einer Freundin, meines Bruders, meiner Eltern.',
        '2-кадам — белгилери: der / das → des + -(e)s менен бүткөн зат атооч (des Mannes, des Landes, des Hotels); die (жекелик) → der (der Stadt); die (көптүк) → der (der Eltern). ein / mein менен: eines Freundes, einer Freundin, meines Bruders, meiner Eltern.',
      ),
      l(
        'Шаг 3 — как понять смысл: переведите «das Haus meiner Eltern» как «дом моих родителей». Genitiv чаще всего показывает владельца или часть: «der Name des Hotels» — название отеля, «die Mitte der Stadt» — центр города.',
        '3-кадам — маанисин түшүнүү: «das Haus meiner Eltern» сөзүн «ата-энемдин үйү» деп которуңуз. Genitiv көбүнчө ээсин же бөлүктү көрсөтөт: «der Name des Hotels» — мейманкананын аты, «die Mitte der Stadt» — шаардын борбору.',
      ),
      l(
        'Шаг 4 — в речи и в своём тексте: используйте простую форму «von + Dativ»: «das Haus von meinen Eltern», «die Meinung von meinem Freund». Genitiv в этом юните не нужно писать и говорить самому.',
        '4-кадам — сүйлөөдө жана өз текстиңизде: жөнөкөй «von + Dativ» формасын колдонуңуз: «das Haus von meinen Eltern», «die Meinung von meinem Freund». Бул бөлүмдө Genitivди өзүңүз жазышыңыз же айтышыңыз керек эмес.',
      ),
    ],
    examples: [
      {
        de: 'Das Haus meiner Eltern steht am See.',
        ru: 'Дом моих родителей стоит у озера.',
        ky: 'Менин ата-энемдин үйү көлдүн жээгинде турат.',
        focus: 'meiner Eltern (Plural)',
      },
      {
        de: 'Die Hauptstadt des Landes ist sehr groß.',
        ru: 'Столица страны очень большая.',
        ky: 'Өлкөнүн борбору абдан чоң.',
        focus: 'des Landes (neutral, -es)',
      },
      {
        de: 'Der Name des Hotels steht auf der Rechnung.',
        ru: 'Название отеля написано в счёте.',
        ky: 'Мейманкананын аты эсепте жазылган.',
        focus: 'des Hotels (neutral, -s)',
      },
      {
        de: 'Das Zentrum der Stadt ist abends ruhig.',
        ru: 'Центр города вечером тихий.',
        ky: 'Шаардын борбору кечинде тынч.',
        focus: 'der Stadt (feminin)',
      },
      {
        de: 'Die Meinung eines Freundes hat mir geholfen.',
        ru: 'Мнение одного друга мне помогло.',
        ky: 'Бир досумдун пикири мага жардам берди.',
        focus: 'eines Freundes (maskulin, -es)',
      },
    ],
    mistakes: [
      {
        wrong: 'Das Auto meines Bruder ist neu.',
        right: 'Das Auto meines Bruders ist neu.',
        note: l(
          'У мужского и среднего рода слово в Genitiv обычно получает -(e)s: des Bruders, des Landes.',
          'Эркек жана ортолук родтогу сөз Genitivде көбүнчө -(e)s алат: des Bruders, des Landes.',
        ),
      },
      {
        wrong: 'Der Name des Stadt steht auf dem Plan.',
        right: 'Der Name der Stadt steht auf dem Plan.',
        note: l(
          'Женский род (die Stadt) в Genitiv: der Stadt — без окончания на существительном.',
          'Аял жынысы (die Stadt) Genitivде: der Stadt — зат атоочто уландысы жок.',
        ),
      },
      {
        wrong: 'Die Meinung meine Freundes ist wichtig.',
        right: 'Die Meinung meines Freundes ist wichtig.',
        note: l(
          'Притяжательное слово тоже получает окончание: meines Freundes, meiner Eltern.',
          'Ээлик сөз да уландыны алат: meines Freundes, meiner Eltern.',
        ),
      },
      {
        wrong: 'Das Haus meiner Eltern gehört mein Eltern.',
        right: 'Das Haus meiner Eltern gehört meinen Eltern.',
        note: l(
          'Genitiv (meiner Eltern) стоит после существительного. После глагола gehören нужен Dativ: meinen Eltern.',
          'Genitiv (meiner Eltern) зат атоочтон кийин турат. gehören этишинен кийин Dativ керек: meinen Eltern.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Die Meinung meiner Eltern ist mir wichtig.',
        ru: 'Мнение моих родителей мне важно.',
        ky: 'Ата-энемдин пикири мен үчүн маанилүү.',
        focus: 'meiner Eltern',
      },
      {
        de: 'Der Preis des Zimmers steht im Internet.',
        ru: 'Цена номера указана в интернете.',
        ky: 'Бөлмөнүн баасы интернетте жазылган.',
        focus: 'des Zimmers',
      },
      {
        de: 'Das ist die Adresse des Hotels.',
        ru: 'Вот адрес отеля.',
        ky: 'Бул мейманкананын дареги.',
        focus: 'des Hotels',
      },
    ],
    dialogue: [
      {
        speaker: 'Lena',
        text: 'Im Reiseführer steht: Das Zentrum der Stadt ist autofrei. Was heißt das?',
        ru: 'В путеводителе написано: «Das Zentrum der Stadt ist autofrei». Что это значит?',
        ky: 'Жол көрсөткүчтө: «Das Zentrum der Stadt ist autofrei» деп жазылган. Бул эмнени билдирет?',
      },
      {
        speaker: 'Jonas',
        text: 'Das Zentrum von der Stadt, also die Mitte. Dort darf man mit dem Auto nicht fahren.',
        ru: 'Центр города, то есть середина. Там нельзя ездить на машине.',
        ky: 'Шаардын борбору, башкача айтканда ортосу. Ал жерде машина менен жүрүүгө болбойт.',
      },
      {
        speaker: 'Lena',
        text: 'Ach so. Und hier: Die Öffnungszeiten des Museums sind von neun bis fünf.',
        ru: 'Понятно. А здесь: «Die Öffnungszeiten des Museums sind von neun bis fünf».',
        ky: 'Түшүнүктүү. А бул жерде: «Die Öffnungszeiten des Museums sind von neun bis fünf».',
      },
      {
        speaker: 'Jonas',
        text: 'Das sind die Zeiten, in denen das Museum offen ist. Der Text sagt es etwas förmlich.',
        ru: 'Это время, когда музей открыт. Текст говорит об этом немного официально.',
        ky: 'Бул музей ачык турган убакыт. Текст муну бир аз расмий айтып жатат.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Скажите проще, как в разговоре: используйте «von + Dativ» вместо Genitiv. Расскажите, чей дом вы видели и чьё мнение вам важно.',
        'Сүйлөшкөндөгүдөй жөнөкөй айтыңыз: Genitiv ордуна «von + Dativ» колдонуңуз. Кимдин үйүн көргөнүңүздү жана кимдин пикири сиз үчүн маанилүү экенин айтыңыз.',
      ),
      sample: 'Das Haus von meinen Eltern steht am See. Die Meinung von meinem Freund ist mir wichtig.',
      keywords: ['von', 'haus', 'meinung', 'eltern'],
    },
    source: UNIT_29_SOURCE,
  },
  {
    id: 'b1-plusquamperfekt-nachdem',
    category: 'tenses',
    level: 'B1',
    unit: 29,
    visual: 'timeline',
    title: l(
      'Plusquamperfekt und nachdem (hatte / war + Partizip II) — что было раньше',
      'Plusquamperfekt жана nachdem (hatte / war + Partizip II) — эмне мурун болгон',
    ),
    summary: l(
      'Plusquamperfekt рассказывает о событии, которое было раньше другого события в прошлом. Форма: hatte / war (Präteritum от haben / sein) + Partizip II в конце: «Ich hatte die Fahrkarte schon gekauft», «Wir waren angekommen». С nachdem история получает порядок: «Nachdem wir angekommen waren, haben wir gegessen» — сначала приезд (Plusquamperfekt), потом еда (Perfekt). В главной части — Perfekt (в разговоре) или Präteritum глаголов из списка юнита 21 (sein, haben, gehen, kommen …).',
      'Plusquamperfekt өткөндөгү башка окуядан мурун болгон окуя жөнүндө айтат. Формасы: hatte / war (haben / sein этиштеринин Präteritumу) + аягында Partizip II: «Ich hatte die Fahrkarte schon gekauft», «Wir waren angekommen». nachdem менен баянда тартип пайда болот: «Nachdem wir angekommen waren, haben wir gegessen» — адегенде келүү (Plusquamperfekt), андан кийин тамак (Perfekt). Башкы бөлүктө — Perfekt (оозеки сүйлөшүүдө) же 21-бөлүмдүн тизмесиндеги этиштердин Präteritumу (sein, haben, gehen, kommen …).',
    ),
    discover: l(
      'Сравните: «Ich habe die Fahrkarte gekauft. Der Zug ist ausgefallen» и «Ich hatte die Fahrkarte schon gekauft, aber der Zug ist ausgefallen». Что произошло первым? Какая форма показывает «ещё раньше»?',
      '«Ich habe die Fahrkarte gekauft. Der Zug ist ausgefallen» жана «Ich hatte die Fahrkarte schon gekauft, aber der Zug ist ausgefallen» сүйлөмдөрүн салыштырыңыз. Эмне биринчи болду? Кайсы форма «андан да мурун» дегенди көрсөтөт?',
    ),
    why: l(
      'Рассказ о поездке почти всегда содержит «предысторию»: «Ich hatte den Anschluss verpasst, deshalb …», «Nachdem wir angekommen waren, …». Без Plusquamperfekt все события звучат одинаково, и слушатель не понимает, что было причиной, а что — следствием. Особенно важно это в рассказе о проблеме в пути.',
      'Саякат жөнүндө баян дээрлик дайыма «алдыңкы окуяны» камтыйт: «Ich hatte den Anschluss verpasst, deshalb …», «Nachdem wir angekommen waren, …». Plusquamperfekt жок болсо, бардык окуялар бирдей угулат, угуучу эмне себеп, эмне натыйжа экенин түшүнбөйт. Жолдогу көйгөй жөнүндө айтканда бул өзгөчө маанилүү.',
    ),
    when: [
      l(
        'Шаг 1 — форма: hatte / hattest / hatte / hatten / hattet / hatten или war / warst / war / waren / wart / waren + Partizip II в конце. Движение или изменение состояния — war (ankommen → war angekommen); остальные глаголы — hatte (kaufen → hatte gekauft).',
        '1-кадам — формасы: hatte / hattest / hatte / hatten / hattet / hatten же war / warst / war / waren / wart / waren + аягында Partizip II. Кыймыл же абалдын өзгөрүшү — war (ankommen → war angekommen); калган этиштер — hatte (kaufen → hatte gekauft).',
      ),
      l(
        'Шаг 2 — nachdem: придаточное с nachdem стоит в Plusquamperfekt, глагол hatte / war — в самом конце: «Nachdem ich gegessen hatte, bin ich gegangen».',
        '2-кадам — nachdem: nachdem менен кошумча бөлүк Plusquamperfektте турат, hatte / war этиши эң аягында: «Nachdem ich gegessen hatte, bin ich gegangen».',
      ),
      l(
        'Шаг 3 — главная часть: после запятой сразу идёт глагол: «Nachdem wir angekommen waren, haben wir gegessen». Для рассказа в разговоре — Perfekt (haben gegessen, sind gegangen); Präteritum — только глаголы из списка юнита 21 (waren, hatten, gingen, kamen …).',
        '3-кадам — башкы бөлүк: үтүрдөн кийин дароо этиш келет: «Nachdem wir angekommen waren, haben wir gegessen». Оозеки баянда — Perfekt (haben gegessen, sind gegangen); Präteritum — 21-бөлүмдүн тизмесиндеги этиштер гана (waren, hatten, gingen, kamen …).',
      ),
      l(
        'Шаг 4 — предыстория без nachdem: «Ich war zu spät, weil ich den Bus verpasst hatte». Сравните с юнитом 21: там «nachdem + Perfekt» ещё допускалось; теперь для рассказа в прошлом — «nachdem + Plusquamperfekt». Только одно событие в прошлом — Perfekt.',
        '4-кадам — nachdem жок алдыңкы окуя: «Ich war zu spät, weil ich den Bus verpasst hatte». 21-бөлүм менен салыштырыңыз: ал жерде «nachdem + Perfekt» дагы жол берилген; эми өткөндөгү баян үчүн — «nachdem + Plusquamperfekt». Өткөндө бир эле окуя болсо — Perfekt.',
      ),
    ],
    examples: [
      {
        de: 'Ich hatte die Fahrkarte schon gekauft, aber der Zug ist ausgefallen.',
        ru: 'Я уже купил билет, но поезд отменили.',
        ky: 'Мен билетти буга чейин эле сатып алгам, бирок поезд жокко чыгарылды.',
        focus: 'hatte + gekauft (Vorvergangenheit)',
      },
      {
        de: 'Wir waren schon im Hotel angekommen, als es zu regnen begann.',
        ru: 'Мы уже приехали в отель, когда начался дождь.',
        ky: 'Жамгыр жаай баштаганда биз мейманканага келип болгонбуз.',
        focus: 'waren + angekommen (Bewegung)',
      },
      {
        de: 'Nachdem wir angekommen waren, haben wir etwas gegessen.',
        ru: 'После того как мы приехали, мы что-то поели.',
        ky: 'Биз келгенден кийин бир нерсе жедик.',
        focus: 'nachdem + Plusquamperfekt, Hauptsatz im Perfekt',
      },
      {
        de: 'Nachdem sie die Koffer gepackt hatte, hat sie ein Taxi gerufen.',
        ru: 'Собрав чемоданы, она вызвала такси.',
        ky: 'Чемодандарын жыйнагандан кийин ал такси чакырды.',
        focus: 'hatte + gepackt am Ende',
      },
      {
        de: 'Er war zu spät, weil er den Bus verpasst hatte.',
        ru: 'Он опоздал, потому что не успел на автобус.',
        ky: 'Ал автобуска үлгүрбөй калгандыктан кечикти.',
        focus: 'weil-Satz im Plusquamperfekt',
      },
    ],
    mistakes: [
      {
        wrong: 'Nachdem wir angekommen hatten, haben wir gegessen.',
        right: 'Nachdem wir angekommen waren, haben wir gegessen.',
        note: l(
          'Глагол ankommen (движение) образует Plusquamperfekt с war: «angekommen waren», а не «hatten».',
          'ankommen этиши (кыймыл) Plusquamperfektти war менен түзөт: «angekommen waren», «hatten» эмес.',
        ),
      },
      {
        wrong: 'Nachdem er hatte gegessen, ging er nach Hause.',
        right: 'Nachdem er gegessen hatte, ging er nach Hause.',
        note: l(
          'В придаточном предложении hatte стоит в самом конце, после Partizip II: «gegessen hatte».',
          'Кошумча бөлүктө hatte эң аягында, Partizip IIден кийин турат: «gegessen hatte».',
        ),
      },
      {
        wrong: 'Ich hatte den Zug verpassen.',
        right: 'Ich hatte den Zug verpasst.',
        note: l(
          'После hatte нужен Partizip II (verpasst), а не инфинитив (verpassen).',
          'hatte дан кийин Partizip II (verpasst) керек, инфинитив (verpassen) эмес.',
        ),
      },
      {
        wrong: 'Nachdem wir gegessen hatten, wir sind gegangen.',
        right: 'Nachdem wir gegessen hatten, sind wir gegangen.',
        note: l(
          'После придаточного предложения в главной части глагол стоит сразу за запятой (sind), потом подлежащее (wir).',
          'Кошумча бөлүктөн кийин башкы бөлүктө этиш үтүрдөн дароо кийин (sind) турат, андан кийин ээ (wir).',
        ),
      },
    ],
    reallife: [
      {
        de: 'Nachdem ich den Anschluss verpasst hatte, habe ich im Bahnhof gewartet.',
        ru: 'Не успев на пересадку, я ждал на вокзале.',
        ky: 'Которулуучу транспортко үлгүрбөй калгандан кийин мен вокзалда күттүм.',
        focus: 'nachdem + verpasst hatte',
      },
      {
        de: 'Ich hatte nicht gewusst, dass der Zug ausfällt.',
        ru: 'Я не знал, что поезд отменяется.',
        ky: 'Мен поезд жокко чыгарылаарын билген эмесмин.',
        focus: 'hatte + gewusst',
      },
      {
        de: 'Wir waren noch nie in dieser Stadt gewesen.',
        ru: 'Мы ещё никогда не были в этом городе.',
        ky: 'Биз бул шаарда мурда эч качан болбогонбуз.',
        focus: 'waren + gewesen',
      },
    ],
    dialogue: [
      {
        speaker: 'Anna',
        text: 'Warum bist du so spät?',
        ru: 'Почему ты так поздно?',
        ky: 'Сен эмнеге ушунча кечиктиң?',
      },
      {
        speaker: 'Ben',
        text: 'Ich hatte den Bus verpasst. Der nächste ist erst nach einer halben Stunde gekommen.',
        ru: 'Я не успел на автобус. Следующий пришёл только через полчаса.',
        ky: 'Мен автобуска үлгүрбөй калдым. Кийинкиси жарым сааттан кийин гана келди.',
      },
      {
        speaker: 'Anna',
        text: 'Und was hast du dann gemacht?',
        ru: 'И что ты потом сделал?',
        ky: 'Анан эмне кылдың?',
      },
      {
        speaker: 'Ben',
        text: 'Nachdem ich eine Weile gewartet hatte, bin ich zu Fuß gegangen.',
        ru: 'Подождав какое-то время, я пошёл пешком.',
        ky: 'Бир аз күткөндөн кийин мен жөө жөнөдүм.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите о проблеме в поездке и о том, что было раньше: что вы уже сделали или забыли. Используйте Plusquamperfekt и nachdem.',
        'Саякаттагы көйгөй жөнүндө жана мурда эмне болгонун айтыңыз: эмнени жасап койгонуңузду же унутуп калганыңызды. Plusquamperfekt жана nachdem колдонуңуз.',
      ),
      sample: 'Nachdem wir angekommen waren, haben wir das Hotel gesucht. Ich hatte die Adresse vergessen. Nachdem ich angerufen hatte, ist der Gastgeber gekommen.',
      keywords: ['nachdem', 'angekommen waren', 'hatte', 'gastgeber'],
    },
    source: UNIT_29_SOURCE,
  },
]

export const UNIT_29_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Die Stadt, in der ich lebe, ist klein.',
    ru: 'Город, в котором я живу, небольшой.',
    ky: 'Мен жашаган шаар кичинекей.',
    word: 'in der',
    conceptId: 'b1-relativsaetze-dativ-praeposition',
    reason: l(
      'In + die Stadt (где? — Dativ) → «in der». Род и число (die Stadt) берутся из слова перед запятой, падеж (Dativ) — от предлога in. Глагол lebe — в конце придаточного.',
      'In + die Stadt (кайда? — Dativ) → «in der». Жынысы жана саны (die Stadt) үтүрдүн алдындагы сөздөн алынат, жалгоосу (Dativ) in предлогунан. lebe этиши кошумча бөлүктүн аягында.',
    ),
    more: [
      {
        de: 'Das Hotel, in dem wir übernachtet haben, war ruhig.',
        ru: 'Отель, в котором мы ночевали, был тихим.',
        ky: 'Биз түнөгөн мейманкана тынч болду.',
      },
      {
        de: 'Die Familie, bei der ich gewohnt habe, war nett.',
        ru: 'Семья, у которой я жил, была милой.',
        ky: 'Мен жашаган үй-бүлө жакшы болду.',
      },
    ],
  },
  {
    sentence: 'Die Leute, mit denen wir gereist sind, waren sehr nett.',
    ru: 'Люди, с которыми мы путешествовали, были очень милыми.',
    ky: 'Биз менен кошо саякаттаган адамдар абдан жакшы болду.',
    word: 'denen',
    conceptId: 'b1-relativsaetze-dativ-praeposition',
    reason: l(
      'Die Leute — множественное число, mit требует Dativ: Dativ множественного числа — «denen». Для der / das / die в единственном числе — dem / dem / der.',
      'Die Leute — көптүк сан, mit Dativди талап кылат: көптүк сандын Dativи — «denen». Жекелик санда der / das / die үчүн — dem / dem / der.',
    ),
    more: [
      {
        de: 'Der Zug, mit dem ich fahren wollte, ist ausgefallen.',
        ru: 'Поезд, на котором я хотел ехать, отменили.',
        ky: 'Мен барайын деген поезд жокко чыгарылды.',
      },
      {
        de: 'Das ist der Kollege, dem ich oft helfe.',
        ru: 'Это коллега, которому я часто помогаю.',
        ky: 'Бул мен көп жардам берген кесиптеш.',
      },
    ],
  },
  {
    sentence: 'Das Haus meiner Eltern steht am See.',
    ru: 'Дом моих родителей стоит у озера.',
    ky: 'Менин ата-энемдин үйү көлдүн жээгинде турат.',
    word: 'meiner Eltern',
    conceptId: 'b1-genitivattribute',
    reason: l(
      '«Meiner Eltern» — Genitiv множественного числа: он показывает, чей это дом. В разговоре можно сказать проще: «das Haus von meinen Eltern». Здесь достаточно узнать форму при чтении.',
      '«Meiner Eltern» — көптүк сандагы Genitiv: ал үй кимдики экенин көрсөтөт. Сүйлөшкөндө жөнөкөйүрөөк айтса болот: «das Haus von meinen Eltern». Бул жерде окуганда формасын таануу жетиштүү.',
    ),
    more: [
      {
        de: 'Die Hauptstadt des Landes ist sehr groß.',
        ru: 'Столица страны очень большая.',
        ky: 'Өлкөнүн борбору абдан чоң.',
      },
      {
        de: 'Der Name des Hotels steht auf der Rechnung.',
        ru: 'Название отеля написано в счёте.',
        ky: 'Мейманкананын аты эсепте жазылган.',
      },
    ],
  },
  {
    sentence: 'Nachdem wir angekommen waren, haben wir etwas gegessen.',
    ru: 'После того как мы приехали, мы что-то поели.',
    ky: 'Биз келгенден кийин бир нерсе жедик.',
    word: 'waren',
    conceptId: 'b1-plusquamperfekt-nachdem',
    reason: l(
      '«Angekommen waren» — Plusquamperfekt: сначала мы приехали (раньше), потом поели (Perfekt). Глагол ankommen обозначает движение, поэтому war / waren, а не hatte. Форма waren стоит в самом конце придаточного.',
      '«Angekommen waren» — Plusquamperfekt: адегенде биз келдик (мурун), андан кийин жедик (Perfekt). ankommen этиши кыймылды билдирет, ошондуктан war / waren, hatte эмес. waren формасы кошумча бөлүктүн эң аягында турат.',
    ),
    more: [
      {
        de: 'Nachdem sie die Koffer gepackt hatte, hat sie ein Taxi gerufen.',
        ru: 'Собрав чемоданы, она вызвала такси.',
        ky: 'Чемодандарын жыйнагандан кийин ал такси чакырды.',
      },
      {
        de: 'Er war zu spät, weil er den Bus verpasst hatte.',
        ru: 'Он опоздал, потому что не успел на автобус.',
        ky: 'Ал автобуска үлгүрбөй калгандыктан кечикти.',
      },
    ],
  },
]
