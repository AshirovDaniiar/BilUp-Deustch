import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_27_SOURCE } from './unit'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 27 grammar — the two APPROVED concepts of the unit (docs/b1/B1_ID_CONVENTIONS.md), nothing else:
 *  1. `b1-konjunktiv2-wuensche-irreal` (H, productive): wishes (Ich wünschte, ich hätte …), UNREAL conditions of the present (Wenn ich mehr Geld hätte, würde ich …;
 *     Wenn ich du wäre, würde ich …) and polite requests (Könnten Sie …? Würden Sie …?), which replace the A2 chunk "hätte gern". Builds on the advice forms of
 *     Unit 25. NOT taught: Konjunktiv II of the past (hätte … gemacht; receptive only, Unit 31), `als ob`, Konjunktiv I.
 *  2. `b1-genitiv-praepositionen` (M, limited-productive): wegen, trotz, während, statt + Genitiv — a CLOSED list of four prepositions (decision D-7: the
 *     productive use is unconfirmed, fallback receptive only). The Genitiv forms (des / der + -(e)s) are introduced here; A1 only gave an overview.
 *     NOT taught: the Genitiv attribute (die Qualität des Produkts; Unit 29), `statt … zu` (receptive, Unit 23), wegen + Dativ (colloquial).
 * Everything is language practice with FICTIONAL shops and sums: the unit gives no legal advice and no statement of consumer law.
 * Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native speaker. It describes the
 * grammar idea and uses no invented grammatical labels (docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md).
 */
export const UNIT_27_GRAMMAR: GrammarConcept[] = [
  {
    id: 'b1-konjunktiv2-wuensche-irreal',
    category: 'konjunktiv',
    level: 'B1',
    unit: 27,
    visual: 'modal',
    title: l(
      'Konjunktiv II: желания, нереальные условия и вежливые просьбы (Wenn ich mehr Geld hätte, würde ich …)',
      'Konjunktiv II: каалоолор, чындыкка жатпаган шарттар жана сылык өтүнүчтөр (Wenn ich mehr Geld hätte, würde ich …)',
    ),
    summary: l(
      'В юните 25 вы использовали Konjunktiv II для советов. Теперь с его помощью выражаются желания и нереальные ситуации в настоящем: «Wenn ich mehr Geld hätte, würde ich ein neues Handy kaufen» («Если бы у меня было больше денег, я бы купил новый телефон» — но денег нет). В части с wenn стоят формы hätte, wäre, könnte; в главной части — würde + инфинитив (или та же форма hätte/wäre). Желание: «Ich wünschte, ich hätte mehr Zeit». Вежливая просьба: «Könnten Sie mir bitte helfen?», «Würden Sie mir das Geld erstatten?» — вместо A2-фразы «Ich hätte gern …» можно сказать «Ich würde gern …». В части с wenn глагол стоит в конце: «…, wenn der Preis niedriger wäre».',
      '25-бөлүмдө сиз Konjunktiv IIди кеңеш үчүн колдондуңуз. Эми аны менен азыркы убакыттагы каалоолор жана чындыкка жатпаган абалдар билдирилет: «Wenn ich mehr Geld hätte, würde ich ein neues Handy kaufen» («Менде көбүрөөк акча болсо, мен жаңы телефон сатып алмакмын» — бирок акча жок). wenn менен башталган бөлүктө hätte, wäre, könnte формалары турат; башкы бөлүктө — würde + инфинитив (же ошол эле hätte/wäre формасы). Каалоо: «Ich wünschte, ich hätte mehr Zeit». Сылык өтүнүч: «Könnten Sie mir bitte helfen?», «Würden Sie mir das Geld erstatten?» — A2 деңгээлиндеги «Ich hätte gern …» ордуна «Ich würde gern …» деп айтууга болот. wenn бөлүгүндө этиш аягында турат: «…, wenn der Preis niedriger wäre».',
    ),
    discover: l(
      'Сравните: «Wenn der Preis niedriger ist, kaufe ich das Handy» и «Wenn der Preis niedriger wäre, würde ich das Handy kaufen». В каком предложении цена может измениться, а в каком — маловероятно? Какие формы глаголов изменились?',
      '«Wenn der Preis niedriger ist, kaufe ich das Handy» жана «Wenn der Preis niedriger wäre, würde ich das Handy kaufen» сүйлөмдөрүн салыштырыңыз. Кайсы сүйлөмдө баа өзгөрүшү мүмкүн, кайсынысында — күмөн? Этиштердин кайсы формалары өзгөрдү?',
    ),
    why: l(
      'При покупке и в банке вы часто говорите о том, чего у вас нет или чего вы хотели бы, и вежливо просите: «Wenn der Händler kulanter wäre, würde ich den Shop empfehlen», «Könnten Sie mir bitte einen Ersatz schicken?». Вежливая форма помогает договориться о решении: резкое «Geben Sie mir das Geld!» звучит как приказ.',
      'Сатып алууда жана банкта сиз көп учурда өзүңүздө жок нерсе же каалаган нерсе жөнүндө айтасыз жана сылык суранасыз: «Wenn der Händler kulanter wäre, würde ich den Shop empfehlen», «Könnten Sie mir bitte einen Ersatz schicken?». Сылык форма чечим боюнча макулдашууга жардам берет: катаал «Geben Sie mir das Geld!» буйрук сыяктуу угулат.',
    ),
    when: [
      l(
        'Шаг 1 — нереальное условие: «Wenn ich mehr Geld hätte, würde ich sparen». Часть с wenn: hätte / wäre / könnte, глагол в конце. Главная часть: würde + инфинитив. «Wenn ich du wäre, würde ich …» — стандартная фраза совета.',
        '1-кадам — чындыкка жатпаган шарт: «Wenn ich mehr Geld hätte, würde ich sparen». wenn бөлүгү: hätte / wäre / könnte, этиш аягында. Башкы бөлүк: würde + инфинитив. «Wenn ich du wäre, würde ich …» — кеңеш берүүнүн кадимки туюндурмасы.',
      ),
      l(
        'Шаг 2 — желание: «Ich wünschte, ich hätte mehr Zeit», «Ich wäre froh, wenn der Shop mir bald antworten könnte». Ставьте hätte / wäre; в части с wünschte глагол стоит на своём месте.',
        '2-кадам — каалоо: «Ich wünschte, ich hätte mehr Zeit», «Ich wäre froh, wenn der Shop mir bald antworten könnte». hätte / wäre колдонуңуз; wünschte менен башталган бөлүктө этиш өз ордунда турат.',
      ),
      l(
        'Шаг 3 — вежливая просьба: «Könnten Sie …?», «Würden Sie …?», «Ich würde gern …». Инфинитив — в конце. Сравните: «Geben Sie mir das Geld!» (приказ) → «Könnten Sie mir bitte das Geld zurückgeben?» (вежливо).',
        '3-кадам — сылык өтүнүч: «Könnten Sie …?», «Würden Sie …?», «Ich würde gern …». Инфинитив — аягында. Салыштырыңыз: «Geben Sie mir das Geld!» (буйрук) → «Könnten Sie mir bitte das Geld zurückgeben?» (сылык).',
      ),
      l(
        'Только для понимания: Konjunktiv II прошедшего времени («Ich hätte das Gerät zurückgegeben») вы встретите в текстах; писать так пока не нужно. Здесь — только настоящее.',
        'Түшүнүү үчүн гана: өткөн чактагы Konjunktiv IIди («Ich hätte das Gerät zurückgegeben») тексттерден көрөсүз; ушинтип жазуу азырынча керек эмес. Бул жерде — азыркы чак гана.',
      ),
    ],
    examples: [
      {
        de: 'Wenn ich mehr Geld hätte, würde ich ein neues Handy kaufen.',
        ru: 'Если бы у меня было больше денег, я бы купил новый телефон.',
        ky: 'Менде көбүрөөк акча болсо, мен жаңы телефон сатып алмакмын.',
        focus: 'Wenn … hätte, würde … + Infinitiv',
      },
      {
        de: 'Wenn der Preis niedriger wäre, würde ich das Sofa nehmen.',
        ru: 'Если бы цена была ниже, я бы взял диван.',
        ky: 'Баасы төмөнүрөөк болсо, мен диванды алмакмын.',
        focus: 'Wenn … wäre, würde …',
      },
      {
        de: 'Ich wünschte, ich hätte mehr Zeit für den Preisvergleich.',
        ru: 'Хотел бы я иметь больше времени на сравнение цен.',
        ky: 'Баа салыштырууга көбүрөөк убактым болсо экен.',
        focus: 'Wunsch: Ich wünschte, ich hätte …',
      },
      {
        de: 'Könnten Sie mir bitte das Geld erstatten?',
        ru: 'Не могли бы вы возместить мне деньги?',
        ky: 'Акчамды кайтарып бере аласызбы?',
        focus: 'höfliche Bitte: Könnten Sie …?',
      },
      {
        de: 'Würden Sie mir einen Ersatz schicken?',
        ru: 'Не могли бы вы прислать мне замену?',
        ky: 'Мага алмаштырууну жиберип бересизби?',
        focus: 'höfliche Bitte: Würden Sie …?',
      },
    ],
    mistakes: [
      {
        wrong: 'Wenn ich mehr Geld hätte, ich würde sparen.',
        right: 'Wenn ich mehr Geld hätte, würde ich sparen.',
        note: l(
          'После части с wenn глагол главной части стоит на первом месте: …, würde ich sparen.',
          'wenn бөлүгүнөн кийин башкы бөлүктүн этиши биринчи орунда турат: …, würde ich sparen.',
        ),
      },
      {
        wrong: 'Wenn der Preis niedriger ist, würde ich das Handy kaufen.',
        right: 'Wenn der Preis niedriger wäre, würde ich das Handy kaufen.',
        note: l(
          'Для нереального условия в обеих частях нужен Konjunktiv II: wäre … würde. «Ist» подходит только для реального условия.',
          'Чындыкка жатпаган шарт үчүн эки бөлүктө тең Konjunktiv II керек: wäre … würde. «ist» чыныгы шарт үчүн гана туура келет.',
        ),
      },
      {
        wrong: 'Wenn ich würde mehr Geld haben, würde ich sparen.',
        right: 'Wenn ich mehr Geld hätte, würde ich sparen.',
        note: l(
          'В части с wenn лучше формы hätte / wäre / könnte; «würde» с инфинитивом ставится в главную часть.',
          'wenn бөлүгүндө hätte / wäre / könnte формалары жакшы; инфинитиви менен «würde» башкы бөлүккө коюлат.',
        ),
      },
      {
        wrong: 'Gib mir sofort das Geld zurück, bitte.',
        right: 'Könnten Sie mir bitte das Geld zurückgeben?',
        note: l(
          'В магазине и банке нужна форма Sie и вежливая просьба с Konjunktiv II, а не приказ.',
          'Дүкөндө жана банкта Sie формасы жана Konjunktiv II менен сылык өтүнүч керек, буйрук эмес.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Wenn ich du wäre, würde ich die Rechnung noch einmal prüfen.',
        ru: 'На твоём месте я бы ещё раз проверил счёт.',
        ky: 'Сенин ордуңда мен эсепти дагы бир жолу текшерер элем.',
        focus: 'Wenn ich du wäre, würde ich …',
      },
      {
        de: 'Ich wäre froh, wenn der Shop mir bald antworten könnte.',
        ru: 'Я был бы рад, если бы магазин мог скоро мне ответить.',
        ky: 'Дүкөн мага жакында жооп бере алса, мен кубанмакмын.',
        focus: 'Ich wäre froh, wenn …',
      },
      {
        de: 'Ich würde gern einen Termin für die Rückgabe vereinbaren.',
        ru: 'Я бы хотел договориться о времени для возврата.',
        ky: 'Мен кайтарып берүү үчүн убакыт макулдашкым келет.',
        focus: 'Ich würde gern … (statt: Ich hätte gern …)',
      },
    ],
    dialogue: [
      {
        speaker: 'Kundin',
        text: 'Guten Tag. Könnten Sie mir bitte helfen? Mein Mixer ist kaputt.',
        ru: 'Добрый день. Не могли бы вы мне помочь? Мой блендер сломан.',
        ky: 'Кайырлуу күн. Мага жардам бере аласызбы? Менин блендерим бузулган.',
      },
      {
        speaker: 'Verkäufer',
        text: 'Das tut mir leid. Wenn Sie den Kaufbeleg hätten, könnten wir ihn sofort umtauschen.',
        ru: 'Сожалею. Если бы у вас был чек, мы могли бы сразу его обменять.',
        ky: 'Кечиресиз. Сизде чек болсо, биз аны дароо алмаштыра алмакпыз.',
      },
      {
        speaker: 'Kundin',
        text: 'Ich habe ihn leider nicht dabei. Würden Sie ihn ersetzen, auch wenn ich keinen Beleg habe?',
        ru: 'К сожалению, у меня его нет с собой. Не могли бы вы заменить его, даже если у меня нет чека?',
        ky: 'Тилекке каршы, менде ал жок. Менде чек болбосо да, аны алмаштырып бересизби?',
      },
      {
        speaker: 'Verkäufer',
        text: 'Ich würde gern helfen. Wenn Sie den Beleg per E-Mail schicken könnten, wäre das kein Problem.',
        ru: 'Я бы с удовольствием помог. Если бы вы смогли прислать чек по электронной почте, это не было бы проблемой.',
        ky: 'Мен жардам бергим келет. Чекти электрондук почта аркылуу жибере алсаңыз, көйгөй болмок эмес.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Скажите, что бы вы сделали, если бы у вас было больше денег или времени. Используйте «Wenn ich … hätte / wäre, würde ich …» и одну вежливую просьбу «Könnten Sie …?».',
        'Көбүрөөк акчаңыз же убактыңыз болсо, эмне кылмаксыз — айтып бериңиз. «Wenn ich … hätte / wäre, würde ich …» жана бир сылык өтүнүч «Könnten Sie …?» колдонуңуз.',
      ),
      sample:
        'Wenn ich mehr Geld hätte, würde ich eine Reise machen. Wenn ich weniger Arbeit hätte, hätte ich mehr Zeit. Könnten Sie mir bitte helfen?',
      keywords: ['wenn', 'hätte', 'würde', 'könnten'],
    },
    source: UNIT_27_SOURCE,
  },
  {
    id: 'b1-genitiv-praepositionen',
    category: 'prepositions',
    level: 'B1',
    unit: 27,
    visual: 'cases',
    title: l(
      'Genitiv-Präpositionen: wegen, trotz, während, statt — причины и уступки (wegen des Defekts)',
      'Genitiv-Präpositionen: wegen, trotz, während, statt — себептер жана каршылыктар (wegen des Defekts)',
    ),
    summary: l(
      'Четыре предлога требуют Genitiv: wegen («из-за»), trotz («несмотря на»), während («во время»), statt («вместо»). Формы Genitiv: мужской и средний род — des + существительное с -s или -es (der Defekt → wegen des Defekts, das Problem → wegen des Problems); женский род и множественное число — der (die Rechnung → wegen der Rechnung, die Kosten → trotz der Kosten). Слова с одним слогом и на -s, -ß, -x, -z получают -es (der Preis → des Preises). С неопределённым артиклем: eines Geschenks, einer Rechnung. В этом юните — только эти четыре предлога (закрытый список).',
      'Төрт предлог Genitivди талап кылат: wegen («себептүү»), trotz («карабастан»), während («учурунда»), statt («ордуна»). Genitiv формалары: эркек жана орто родто — des + -s же -es менен аяктаган зат атооч (der Defekt → wegen des Defekts, das Problem → wegen des Problems); аял родто жана көптүк санда — der (die Rechnung → wegen der Rechnung, die Kosten → trotz der Kosten). Бир муундуу жана -s, -ß, -x, -z менен аяктаган сөздөр -es алат (der Preis → des Preises). Аныкталбаган артикль менен: eines Geschenks, einer Rechnung. Бул бөлүмдө — ушул төрт предлог гана (жабык тизме).',
    ),
    discover: l(
      'Сравните: «Der Defekt ist groß. Ich rufe an» и «Wegen des Defekts rufe ich an». Что изменилось в артикле и в существительном «Defekt»? А как будет с «die Rechnung»?',
      '«Der Defekt ist groß. Ich rufe an» жана «Wegen des Defekts rufe ich an» сүйлөмдөрүн салыштырыңыз. Артиклде жана «Defekt» зат атоочунда эмне өзгөрдү? Ал эми «die Rechnung» менен кандай болот?',
    ),
    why: l(
      'Чтобы объяснить причину или уступку в жалобе или разговоре с банком, нужны короткие конструкции: «Wegen des Defekts möchte ich das Gerät zurückgeben», «Trotz der Gebühr bleibe ich bei der Bank», «Während der Garantiezeit ist die Reparatur kostenlos». В устной речи часто слышно «wegen dem», но в письме и на экзамене ожидается Genitiv.',
      'Даттанууда же банк менен сүйлөшүүдө себепти же каршылыкты түшүндүрүү үчүн кыска түзүмдөр керек: «Wegen des Defekts möchte ich das Gerät zurückgeben», «Trotz der Gebühr bleibe ich bei der Bank», «Während der Garantiezeit ist die Reparatur kostenlos». Оозеки сүйлөөдө «wegen dem» деп көп угулат, бирок жазууда жана экзаменде Genitiv күтүлөт.',
    ),
    when: [
      l(
        'Шаг 1 — запомните четыре предлога: wegen (причина), trotz (уступка), während (время), statt (замена) — и после них всегда Genitiv.',
        '1-кадам — төрт предлогду эстеп калыңыз: wegen (себеп), trotz (каршылык), während (убакыт), statt (алмаштыруу) — жана алардан кийин дайыма Genitiv.',
      ),
      l(
        'Шаг 2 — артикль: der / das → des (+ -s / -es у существительного); die / множественное число → der. «wegen des Regens», «trotz des Preises», «während der Öffnungszeiten», «statt eines Geschenks».',
        '2-кадам — артикль: der / das → des (+ зат атоочто -s / -es); die / көптүк сан → der. «wegen des Regens», «trotz des Preises», «während der Öffnungszeiten», «statt eines Geschenks».',
      ),
      l(
        'Шаг 3 — прилагательное: после des / der окончание -en: «wegen des hohen Preises», «trotz der hohen Kosten» (юнит 22).',
        '3-кадам — сын атооч: des / der сөздөрүнөн кийин уландысы -en: «wegen des hohen Preises», «trotz der hohen Kosten» (22-бөлүм).',
      ),
      l(
        'Только для понимания и для будущих юнитов: Genitiv как определение («die Qualität des Produkts») вы увидите в юните 29; «statt … zu» с инфинитивом («Statt zu warten, rufe ich an») пока только для понимания. Здесь — только четыре предлога с существительным.',
        'Түшүнүү үчүн жана кийинки бөлүмдөр үчүн: аныктооч катары Genitiv («die Qualität des Produkts») 29-бөлүмдө келет; инфинитив менен «statt … zu» («Statt zu warten, rufe ich an») азырынча түшүнүү үчүн гана. Бул жерде — зат атооч менен төрт предлог гана.',
      ),
    ],
    examples: [
      {
        de: 'Wegen des Defekts möchte ich das Gerät zurückgeben.',
        ru: 'Из-за дефекта я хочу вернуть устройство.',
        ky: 'Кемчиликтен улам мен шайманды кайтарып бергим келет.',
        focus: 'wegen + des Defekts (maskulin: des … -s)',
      },
      {
        de: 'Trotz der hohen Versandkosten bestelle ich dort.',
        ru: 'Несмотря на высокую стоимость доставки, я заказываю там.',
        ky: 'Жөнөтүү чыгымдары жогору болсо да, мен ошол жерден заказ берем.',
        focus: 'trotz + der (Plural) + hohen (-en)',
      },
      {
        de: 'Während der Öffnungszeiten ist der Kundendienst erreichbar.',
        ru: 'В часы работы служба поддержки доступна.',
        ky: 'Иштөө убактысында тейлөө кызматы жеткиликтүү.',
        focus: 'während + der (Plural)',
      },
      {
        de: 'Statt eines Geschenks bekomme ich einen Gutschein.',
        ru: 'Вместо подарка я получаю ваучер.',
        ky: 'Белектин ордуна мен купон алам.',
        focus: 'statt + eines Geschenks (neutral: -s)',
      },
      {
        de: 'Wegen der Rechnung rufe ich die Bank an.',
        ru: 'Из-за счёта я звоню в банк.',
        ky: 'Эсепке байланыштуу мен банкка чалам.',
        focus: 'wegen + der Rechnung (feminin: der)',
      },
    ],
    mistakes: [
      {
        wrong: 'Wegen dem Defekt möchte ich das Gerät zurückgeben.',
        right: 'Wegen des Defekts möchte ich das Gerät zurückgeben.',
        note: l(
          'После wegen стоит Genitiv: des Defekts, а не dem Defekt (так говорят в разговоре, но в тексте нужен Genitiv).',
          'wegen сөзүнөн кийин Genitiv турат: des Defekts, dem Defekt эмес (сүйлөшүүдө ушинтип айтышат, бирок жазууда Genitiv керек).',
        ),
      },
      {
        wrong: 'Trotz des Preis kaufe ich das Sofa.',
        right: 'Trotz des Preises kaufe ich das Sofa.',
        note: l(
          'У существительных мужского и среднего рода в Genitiv появляется -s или -es; после der Preis — -es.',
          'Эркек жана орто родтогу зат атоочторго Genitivде -s же -es кошулат; der Preis сөзүнөн кийин — -es.',
        ),
      },
      {
        wrong: 'Während des Öffnungszeiten ist der Laden geschlossen.',
        right: 'Während der Öffnungszeiten ist der Laden geöffnet.',
        note: l(
          'Множественное число: der, а не des; и по смыслу в часы работы магазин открыт, а не закрыт.',
          'Көптүк сан: der, des эмес; жана маанисине жараша иштөө убактысында дүкөн жабык эмес, ачык.',
        ),
      },
      {
        wrong: 'Statt ein Geschenk bekomme ich einen Gutschein.',
        right: 'Statt eines Geschenks bekomme ich einen Gutschein.',
        note: l(
          'После statt (с существительным) стоит Genitiv: eines Geschenks, а не Akkusativ ein Geschenk.',
          'statt (зат атооч менен) сөзүнөн кийин Genitiv турат: eines Geschenks, Akkusativ ein Geschenk эмес.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Wegen des schlechten Wetters bestelle ich online.',
        ru: 'Из-за плохой погоды я заказываю онлайн.',
        ky: 'Аба ырайы жаман болгондуктан мен онлайн заказ берем.',
        focus: 'wegen des schlechten Wetters',
      },
      {
        de: 'Trotz des Rabatts kaufe ich nichts.',
        ru: 'Несмотря на скидку, я ничего не покупаю.',
        ky: 'Арзандатууга карабастан мен эч нерсе албайм.',
        focus: 'trotz des Rabatts',
      },
      {
        de: 'Während des Einkaufs habe ich meine Karte verloren.',
        ru: 'Во время покупок я потерял свою карту.',
        ky: 'Сатып алуу учурунда мен картамды жоготтум.',
        focus: 'während des Einkaufs',
      },
    ],
    dialogue: [
      {
        speaker: 'Mitarbeiter',
        text: 'Warum möchten Sie das Konto wechseln?',
        ru: 'Почему вы хотите сменить счёт?',
        ky: 'Эмне үчүн эсепти алмаштыргыңыз келет?',
      },
      {
        speaker: 'Kunde',
        text: 'Wegen der hohen Gebühren. Trotz des guten Service ist mir das zu teuer.',
        ru: 'Из-за высоких комиссий. Несмотря на хороший сервис, для меня это слишком дорого.',
        ky: 'Жогорку комиссияга байланыштуу. Жакшы кызматка карабастан, мен үчүн бул өтө кымбат.',
      },
      {
        speaker: 'Mitarbeiter',
        text: 'Während der ersten Monate ist die Kontoführung kostenlos.',
        ru: 'В течение первых месяцев ведение счёта бесплатное.',
        ky: 'Алгачкы айлардын ичинде эсепти жүргүзүү акысыз.',
      },
      {
        speaker: 'Kunde',
        text: 'Das klingt gut. Statt einer Gebühr zahle ich dann einfach nichts.',
        ru: 'Звучит хорошо. Вместо комиссии я тогда просто ничего не плачу.',
        ky: 'Жакшы угулат. Анда комиссиянын ордуна мен жөн гана эч нерсе төлөбөйм.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Объясните, почему вы (не) покупаете что-то или меняете банк. Используйте wegen, trotz, während или statt с Genitiv: «Wegen des Preises …», «Trotz der Kosten …».',
        'Эмне үчүн бир нерсе сатып албай жатканыңызды же банкты алмаштырганыңызды түшүндүрүңүз. Genitiv менен wegen, trotz, während же statt колдонуңуз: «Wegen des Preises …», «Trotz der Kosten …».',
      ),
      sample: 'Wegen des hohen Preises kaufe ich das Handy nicht. Trotz der Kosten spare ich jeden Monat. Statt eines neuen Handys nehme ich ein altes.',
      keywords: ['wegen', 'trotz', 'des', 'der'],
    },
    source: UNIT_27_SOURCE,
  },
]

/** "Why?" notes: one word explained in one sentence. */
export const UNIT_27_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Wenn ich mehr Geld hätte, würde ich ein neues Handy kaufen.',
    ru: 'Если бы у меня было больше денег, я бы купил новый телефон.',
    ky: 'Менде көбүрөөк акча болсо, мен жаңы телефон сатып алмакмын.',
    word: 'hätte',
    conceptId: 'b1-konjunktiv2-wuensche-irreal',
    reason: l(
      'Hätte — Konjunktiv II: условие нереально (денег нет). В части с wenn глагол стоит в конце, в главной части — würde + инфинитив (kaufen).',
      'hätte — Konjunktiv II: шарт чындыкка жатпайт (акча жок). wenn бөлүгүндө этиш аягында, башкы бөлүктө — würde + инфинитив (kaufen).',
    ),
    more: [
      {
        de: 'Wenn der Preis niedriger wäre, würde ich das Sofa nehmen.',
        ru: 'Если бы цена была ниже, я бы взял диван.',
        ky: 'Баасы төмөнүрөөк болсо, мен диванды алмакмын.',
      },
      {
        de: 'Wenn ich du wäre, würde ich die Rechnung prüfen.',
        ru: 'На твоём месте я бы проверил счёт.',
        ky: 'Сенин ордуңда мен эсепти текшерер элем.',
      },
    ],
  },
  {
    sentence: 'Könnten Sie mir bitte das Geld erstatten?',
    ru: 'Не могли бы вы возместить мне деньги?',
    ky: 'Акчамды кайтарып бере аласызбы?',
    word: 'Könnten',
    conceptId: 'b1-konjunktiv2-wuensche-irreal',
    reason: l(
      'Könnten + Sie — очень вежливая просьба (Konjunktiv II). Инфинитив erstatten стоит в конце. «Können Sie …?» нейтрально, «Gib mir …!» звучит как приказ.',
      'Könnten + Sie — абдан сылык өтүнүч (Konjunktiv II). erstatten инфинитиви аягында турат. «Können Sie …?» бейтарап, «Gib mir …!» буйрук сыяктуу угулат.',
    ),
    more: [
      {
        de: 'Würden Sie mir einen Ersatz schicken?',
        ru: 'Не могли бы вы прислать мне замену?',
        ky: 'Мага алмаштырууну жиберип бересизби?',
      },
      {
        de: 'Ich würde gern einen Termin vereinbaren.',
        ru: 'Я бы хотел договориться о времени.',
        ky: 'Мен убакыт макулдашкым келет.',
      },
    ],
  },
  {
    sentence: 'Wegen des Defekts möchte ich das Gerät zurückgeben.',
    ru: 'Из-за дефекта я хочу вернуть устройство.',
    ky: 'Кемчиликтен улам мен шайманды кайтарып бергим келет.',
    word: 'des',
    conceptId: 'b1-genitiv-praepositionen',
    reason: l(
      'После wegen стоит Genitiv. «Der Defekt» — мужской род, поэтому des, а к существительному добавляется -s: des Defekts.',
      'wegen сөзүнөн кийин Genitiv турат. «Der Defekt» — эркек род, ошондуктан des, ал эми зат атоочко -s кошулат: des Defekts.',
    ),
    more: [
      {
        de: 'Trotz des Preises kaufe ich das Sofa.',
        ru: 'Несмотря на цену, я покупаю диван.',
        ky: 'Баасына карабастан мен диванды сатып алам.',
      },
      {
        de: 'Während des Einkaufs habe ich meine Karte verloren.',
        ru: 'Во время покупок я потерял свою карту.',
        ky: 'Сатып алуу учурунда мен картамды жоготтум.',
      },
    ],
  },
  {
    sentence: 'Trotz der hohen Versandkosten bestelle ich dort.',
    ru: 'Несмотря на высокую стоимость доставки, я заказываю там.',
    ky: 'Жөнөтүү чыгымдары жогору болсо да, мен ошол жерден заказ берем.',
    word: 'der',
    conceptId: 'b1-genitiv-praepositionen',
    reason: l(
      '«Die Versandkosten» — множественное число. В Genitiv множественного числа артикль — der, а прилагательное получает -en: der hohen Versandkosten.',
      '«Die Versandkosten» — көптүк сан. Көптүк сандын Genitivинде артикль — der, ал эми сын атооч -en алат: der hohen Versandkosten.',
    ),
    more: [
      {
        de: 'Wegen der Rechnung rufe ich die Bank an.',
        ru: 'Из-за счёта я звоню в банк.',
        ky: 'Эсепке байланыштуу мен банкка чалам.',
      },
      {
        de: 'Statt eines Geschenks bekomme ich einen Gutschein.',
        ru: 'Вместо подарка я получаю ваучер.',
        ky: 'Белектин ордуна мен купон алам.',
      },
    ],
  },
]
