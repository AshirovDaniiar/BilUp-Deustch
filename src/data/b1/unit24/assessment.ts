import type { Exercise, L10n } from '../../types'
import type { A2TestQuestion, L10nStrict } from '../../a2/types'
import type { B1TestDef } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 24 revision (Wiederholung) exercises, `b1-ex-24-01` … `-10`: 3 fill / 5 choice / 2 order on the unit's two concepts (Passiv Präsens × 4, adjectives
 * without article × 4), plus 2 RECYCLED items (↻ A2: Positionsverben, wenn-Sätze) without a concept of this unit — the spaced-revision part. Exercise 04
 * is a TEXT-level `choice` item (three sentences). Authored independently of the final test: no prompt, sentence or answer is shared.
 * The receptive construction of this unit (Passiv Perfekt: `… worden`) and those of Units 22 and 23 never appear in a gap or a word order.
 */
export const UNIT_24_EXERCISES: Exercise[] = [
  {
    id: 'b1-ex-24-01',
    type: 'fill',
    unit: 24,
    concept: 'b1-passiv-praesens',
    prompt: 'Der Müll ___ jeden Montag abgeholt.',
    promptRu: 'Мусор вывозят каждый понедельник.',
    promptKy: 'Таштанды ар дүйшөмбүдө алынып кетилет.',
    options: ['wird', 'werden', 'ist'],
    answer: 'wird',
    why: w(
      'Подлежащее «der Müll» — единственное число, поэтому в Passiv нужна форма wird: …, wird … abgeholt. Werden — форма множественного числа, ist в Passiv не используется.',
      'Ээси «der Müll» — жекелик сан, ошондуктан Passiv үчүн wird формасы керек: …, wird … abgeholt. werden — көптүк сан формасы, ist Passiv Präsens ичинде колдонулбайт.',
    ),
  },
  {
    id: 'b1-ex-24-02',
    type: 'choice',
    unit: 24,
    concept: 'b1-passiv-praesens',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Die Fenster werden gestrichen.', 'Die Fenster wird gestrichen.', 'Die Fenster werden streichen.'],
    answer: 'Die Fenster werden gestrichen.',
    why: w(
      '«Die Fenster» — множественное число, поэтому werden, а в конце стоит Partizip II (gestrichen), а не инфинитив.',
      '«Die Fenster» — көптүк сан, ошондуктан werden, ал эми аягында инфинитив эмес, Partizip II (gestrichen) турат.',
    ),
  },
  {
    id: 'b1-ex-24-03',
    type: 'order',
    unit: 24,
    concept: 'b1-passiv-praesens',
    prompt: 'Bilde den Satz.',
    promptRu: 'Отопление завтра починят.',
    promptKy: 'Жылытуу эртең оңдолот.',
    words: ['morgen', 'Die', 'repariert.', 'Heizung', 'wird'],
    answer: 'Die Heizung wird morgen repariert.',
    why: w(
      'Форма wird стоит на втором месте, а Partizip II (repariert) — в самом конце предложения.',
      'wird формасы экинчи орунда турат, ал эми Partizip II (repariert) — сүйлөмдүн эң аягында.',
    ),
  },
  {
    id: 'b1-ex-24-04',
    type: 'choice',
    unit: 24,
    concept: 'b1-passiv-praesens',
    prompt: 'Welcher kleine Text ist richtig?',
    promptRu: 'Какой короткий текст составлен правильно?',
    promptKy: 'Кайсы кыска текст туура түзүлгөн?',
    options: [
      'Die Wohnung wird im Mai renoviert. Die Zimmer wird vor dem Einzug gestrichen. Der Müll wird getrennt.',
      'Die Wohnung wird im Mai renovieren. Die Zimmer werden vor dem Einzug gestrichen. Der Müll wird getrennt.',
      'Die Wohnung wird im Mai renoviert. Die Zimmer werden vor dem Einzug gestrichen. Der Müll wird getrennt.',
    ],
    answer: 'Die Wohnung wird im Mai renoviert. Die Zimmer werden vor dem Einzug gestrichen. Der Müll wird getrennt.',
    why: w(
      'В первом тексте во втором предложении «die Zimmer» требует werden, а не wird. Во втором тексте в первом предложении стоит инфинитив (renovieren) вместо Partizip II. В третьем тексте всё верно.',
      'Биринчи текстте экинчи сүйлөмдө «die Zimmer» werden талап кылат, wird эмес. Экинчи текстте биринчи сүйлөмдө Partizip II ордуна инфинитив (renovieren) турат. Үчүнчү текстте баары туура.',
    ),
  },
  {
    id: 'b1-ex-24-05',
    type: 'fill',
    unit: 24,
    concept: 'b1-adjektive-ohne-artikel',
    prompt: 'Wir suchen ___ Zimmer in ruhiger Lage.',
    promptRu: 'Мы ищем светлые комнаты в тихом районе.',
    promptKy: 'Биз тынч жердеги жарык бөлмөлөрдү издеп жатабыз.',
    options: ['helle', 'hellen', 'heller'],
    answer: 'helle',
    why: w(
      'Артикля нет, «Zimmer» — множественное число в Akkusativ: окончание -e, как у die. Окончание -en было бы после предлога с Dativ, например «in hellen Zimmern».',
      'Артикль жок, «Zimmer» — Akkusativ, көптүк сан: уланды -e, die сыяктуу. -en Dativ талап кылган предлогдон кийин болмок, мисалы «in hellen Zimmern».',
    ),
  },
  {
    id: 'b1-ex-24-06',
    type: 'choice',
    unit: 24,
    concept: 'b1-adjektive-ohne-artikel',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Im Keller ist kalte Luft.', 'Im Keller ist kalter Luft.', 'Im Keller ist kaltes Luft.'],
    answer: 'Im Keller ist kalte Luft.',
    why: w(
      '«Die Luft» — женский род, артикля нет, Nominativ: окончание -e (kalte Luft).',
      '«Die Luft» — аял род, артикль жок, Nominativ: уланды -e (kalte Luft).',
    ),
  },
  {
    id: 'b1-ex-24-07',
    type: 'order',
    unit: 24,
    concept: 'b1-adjektive-ohne-artikel',
    prompt: 'Bilde den Satz.',
    promptRu: 'Он никогда не пьёт холодный кофе.',
    promptKy: 'Ал эч качан муздак кофе ичпейт.',
    words: ['nie', 'Er', 'kalten', 'Kaffee.', 'trinkt'],
    answer: 'Er trinkt nie kalten Kaffee.',
    why: w(
      '«Der Kaffee» — мужской род, Akkusativ, артикля нет: окончание -en (kalten Kaffee).',
      '«Der Kaffee» — эркек род, Akkusativ, артикль жок: уланды -en (kalten Kaffee).',
    ),
  },
  {
    id: 'b1-ex-24-08',
    type: 'choice',
    unit: 24,
    concept: 'b1-adjektive-ohne-artikel',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Im Altbau gibt es oft Wohnungen mit dicken Wänden.',
      'Im Altbau gibt es oft Wohnungen mit dicke Wänden.',
      'Im Altbau gibt es oft Wohnungen mit dicker Wänden.',
    ],
    answer: 'Im Altbau gibt es oft Wohnungen mit dicken Wänden.',
    why: w(
      'После mit стоит Dativ, множественное число без артикля — окончание -en: mit dicken Wänden.',
      'mit сөзүнөн кийин Dativ турат, артиклсиз көптүк санда уланды -en: mit dicken Wänden.',
    ),
  },
  // ↻ Wiederholung (recycled from A2, spaced revision; no concept of this unit)
  {
    id: 'b1-ex-24-09',
    type: 'fill',
    unit: 24,
    prompt: 'Ich ___ die Umzugskartons in den Keller.',
    promptRu: 'Я ставлю коробки для переезда в подвал.',
    promptKy: 'Мен көчүү кутуларын жертөлөгө коем.',
    options: ['stelle', 'stehe', 'liege'],
    answer: 'stelle',
    why: w(
      '↻ A2: вопрос «куда?» и Akkusativ (in den Keller) требуют глагола с движением и объекта: stellen — ich stelle. Stehen и liegen отвечают на вопрос «где?».',
      '↻ A2: «кайда?» суроосу жана Akkusativ (in den Keller) объектти жайгаштырган этишти талап кылат: stellen — ich stelle. stehen жана liegen «кайда?» деген суроого жооп берет.',
    ),
  },
  {
    id: 'b1-ex-24-10',
    type: 'choice',
    unit: 24,
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Wenn der Wasserhahn undicht ist, rufe ich den Hausmeister an.',
      'Wenn der Wasserhahn ist undicht, rufe ich den Hausmeister an.',
      'Wenn der Wasserhahn undicht ist, ich rufe den Hausmeister an.',
    ],
    answer: 'Wenn der Wasserhahn undicht ist, rufe ich den Hausmeister an.',
    why: w(
      '↻ A2: в части с wenn глагол стоит в конце (undicht ist), а в главном предложении после запятой глагол идёт на первое место: …, rufe ich … an.',
      '↻ A2: wenn менен башталган бөлүктө этиш аягында турат (undicht ist), ал эми үтүрдөн кийинки башкы бөлүктө этиш биринчи орунга чыгат: …, rufe ich … an.',
    ),
  },
]

/** Test definition `unit-24` (kind topic, 15 questions). */
export const UNIT_24_TEST: B1TestDef = {
  id: 'unit-24',
  title: s('Итоговый тест: юнит 24', 'Жыйынтыктоочу тест: 24-бөлүм'),
  kind: 'topic',
  level: 'B1',
  unit: 24,
  size: 15,
}

/**
 * Unit 24 final test, `b1-ft-24-01` … `-15`. Composition (curriculum v2 §7.2): 8 grammar (3 on Passiv Präsens, 2 on adjectives without article, 3 recycled ↻:
 * Positionsverben A2-13, wenn-Sätze A2-14, Relativsatz Unit 23), 3 vocabulary, 4 reading, 0 listening — listening items enter a test only after the
 * text-to-speech playback has been verified on real devices. Reading items carry the German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate
 * only the instruction and the question. Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_24_FINAL: A2TestQuestion[] = [
  {
    id: 'b1-ft-24-01',
    prompt: 'Die Umzugskartons ___ am Samstag abgeholt.',
    promptRu: 'Коробки для переезда заберут в субботу.',
    promptKy: 'Көчүү кутулары ишембиде алынып кетилет.',
    options: ['werden', 'wird', 'wirst'],
    answer: 'werden',
    skill: 'grammar',
    concept: 'b1-passiv-praesens',
    why: s(
      '«Die Umzugskartons» — множественное число, значит нужна форма werden. Partizip II abgeholt (ab-ge-holt) стоит в конце.',
      '«Die Umzugskartons» — көптүк сан, демек werden формасы керек. Partizip II abgeholt (ab-ge-holt) аягында турат.',
    ),
  },
  {
    id: 'b1-ft-24-02',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Der Schimmel wird entfernen.', 'Der Schimmel wird entfernt.', 'Der Schimmel entfernt wird.'],
    answer: 'Der Schimmel wird entfernt.',
    skill: 'grammar',
    concept: 'b1-passiv-praesens',
    why: s(
      'Passiv = wird + Partizip II в конце: wird entfernt. Инфинитив после wird и неверный порядок слов («entfernt wird») не подходят.',
      'Passiv = wird + аягында Partizip II: wird entfernt. wird менен инфинитив жана сөздөрдүн туура эмес иреттери («entfernt wird») туура келбейт.',
    ),
  },
  {
    id: 'b1-ft-24-03',
    prompt: 'Der Hausmeister kontrolliert die Heizung. Welcher Satz im Passiv hat dieselbe Bedeutung?',
    promptRu: 'Какое предложение в Passiv имеет то же значение?',
    promptKy: 'Passiv менен кайсы сүйлөмдүн мааниси ошол бойдон калат?',
    options: [
      'Der Hausmeister wird von der Heizung kontrolliert.',
      'Die Heizung kontrolliert den Hausmeister.',
      'Die Heizung wird vom Hausmeister kontrolliert.',
    ],
    answer: 'Die Heizung wird vom Hausmeister kontrolliert.',
    skill: 'grammar',
    concept: 'b1-passiv-praesens',
    why: s(
      'При переходе в Passiv Akkusativ-дополнение (die Heizung) становится подлежащим, а исполнитель получает von + Dativ (vom Hausmeister). В двух других предложениях роли поменялись, и смысл другой.',
      'Passiv болгондо Akkusativ толуктоочу (die Heizung) ээ болот, ал эми аткаруучу von + Dativ алат (vom Hausmeister). Калган эки сүйлөмдө ролдор алмашып, маани башка болуп калган.',
    ),
  },
  {
    id: 'b1-ft-24-04',
    prompt: 'Die Wohnung liegt in ___ Lage.',
    promptRu: 'Квартира находится в центральном районе.',
    promptKy: 'Батир борбордо жайгашкан.',
    options: ['zentrale', 'zentraler', 'zentralem'],
    answer: 'zentraler',
    skill: 'grammar',
    concept: 'b1-adjektive-ohne-artikel',
    why: s(
      'После in (где?) стоит Dativ; «die Lage» — женский род, артикля нет: окончание -er (in zentraler Lage).',
      'in (кайда?) сөзүнөн кийин Dativ турат; «die Lage» — аял род, артикль жок: уланды -er (in zentraler Lage).',
    ),
  },
  {
    id: 'b1-ft-24-05',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich brauche frisches Brot.', 'Ich brauche frischer Brot.', 'Ich brauche frischem Brot.'],
    answer: 'Ich brauche frisches Brot.',
    skill: 'grammar',
    concept: 'b1-adjektive-ohne-artikel',
    why: s(
      '«Das Brot» — средний род, Akkusativ (brauchen + Akkusativ), артикля нет: окончание -es.',
      '«Das Brot» — орто род, Akkusativ (brauchen + Akkusativ), артикль жок: уланды -es.',
    ),
  },
  {
    id: 'b1-ft-24-06',
    prompt: 'Das Regal ___ im Flur.',
    promptRu: 'Стеллаж стоит в коридоре.',
    promptKy: 'Текче коридордо турат.',
    options: ['legt', 'stellt', 'steht'],
    answer: 'steht',
    skill: 'grammar',
    concept: 'a2-positionsverben',
    why: s(
      '↻ A2: «где?» (im Flur, Dativ) — глагол положения stehen: das Regal steht. Stellen и legen обозначают действие «поставить», «положить».',
      '↻ A2: «кайда?» (im Flur, Dativ) — абалды көрсөткөн этиш stehen: das Regal steht. stellen жана legen «коюу» аракетин билдирет.',
    ),
  },
  {
    id: 'b1-ft-24-07',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Wenn der Aufzug defekt ist, nehme ich die Treppe.',
      'Wenn der Aufzug defekt ist, ich nehme die Treppe.',
      'Wenn der Aufzug ist defekt, nehme ich die Treppe.',
    ],
    answer: 'Wenn der Aufzug defekt ist, nehme ich die Treppe.',
    skill: 'grammar',
    concept: 'a2-wenn-saetze',
    why: s(
      '↻ A2: после wenn-части глагол главного предложения стоит на первом месте (nehme ich), а в самой части с wenn — в конце (defekt ist).',
      '↻ A2: wenn бөлүгүнөн кийин башкы бөлүктүн этиши биринчи орунда турат (nehme ich), ал эми wenn бөлүгүнүн өзүндө — аягында (defekt ist).',
    ),
  },
  {
    id: 'b1-ft-24-08',
    prompt: 'Das ist der Nachbar, ___ mir beim Umzug hilft.',
    promptRu: 'Это сосед, который помогает мне с переездом.',
    promptKy: 'Бул мага көчүүдө жардам берген кошуна.',
    options: ['den', 'der', 'das'],
    answer: 'der',
    skill: 'grammar',
    concept: 'b1-relativsaetze-nom-akk',
    why: s(
      '↻ Юнит 23: «der Nachbar» — мужской род, и он же подлежащее придаточной части («er hilft»): Nominativ — der.',
      '↻ 23-бөлүм: «der Nachbar» — эркек род, ал кошумча бөлүктүн ээси да («er hilft»): Nominativ — der.',
    ),
  },
  {
    id: 'b1-ft-24-09',
    prompt: 'Wenn es im Bad feucht ist, soll man mehrmals am Tag ___.',
    promptRu: 'Если в ванной сыро, нужно несколько раз в день ___.',
    promptKy: 'Жуунуучу бөлмө нымдуу болсо, күнүнө бир нече жолу ___ керек.',
    options: ['streichen', 'vermieten', 'lüften'],
    answer: 'lüften',
    skill: 'vocabulary',
    why: s(
      'Чтобы в сырой комнате стало лучше, её проветривают: lüften. Streichen — красить, vermieten — сдавать в аренду.',
      'Нымдуу бөлмөнү жакшыртуу үчүн аны желдетишет: lüften. streichen — боёо, vermieten — ижарага берүү.',
    ),
  },
  {
    id: 'b1-ft-24-10',
    prompt: 'Wenn ich ausziehe, sucht der Vermieter einen ___.',
    promptRu: 'Когда я съезжаю, арендодатель ищет ___.',
    promptKy: 'Мен көчүп чыкканда, ижарага берүүчү ___ издейт.',
    options: ['Nachmieter', 'Hausmeister', 'Altbau'],
    answer: 'Nachmieter',
    skill: 'vocabulary',
    why: s(
      'Человека, который заселяется после вас, называют Nachmieter. Hausmeister — смотритель дома, Altbau — старый дом.',
      'Сизден кийин көчүп кирген адамды Nachmieter деп аташат. Hausmeister — үйдү кароочу, Altbau — эски курулуш үй.',
    ),
  },
  {
    id: 'b1-ft-24-11',
    prompt: 'Wer wenig Strom und Wasser verbraucht und die Natur schützt, lebt ___.',
    promptRu: 'Кто мало расходует электричество и воду и защищает природу, живёт ___.',
    promptKy: 'Электр тогун жана сууну аз сарптап, жаратылышты коргогон адам ___ жашайт.',
    options: ['defekt', 'nachhaltig', 'hellhörig'],
    answer: 'nachhaltig',
    skill: 'vocabulary',
    why: s(
      'Бережная к ресурсам и природе жизнь называется nachhaltig. Defekt — неисправный, hellhörig — с плохой звукоизоляцией.',
      'Ресурстарды жана жаратылышты сарамжалдуу колдонгон жашоо nachhaltig деп аталат. defekt — бузук, hellhörig — үн өтүп турган.',
    ),
  },
  {
    id: 'b1-ft-24-12',
    prompt:
      'Lies die Anzeige: „Vermietet wird ab sofort eine helle Wohnung im Erdgeschoss. Die Kaltmiete beträgt 540 Euro. Haustiere sind nicht erlaubt. Die Wohnung wird vor dem Einzug gestrichen.“ Was wird vor dem Einzug gemacht?',
    promptRu: 'Прочитайте объявление. Что делают перед заселением?',
    promptKy: 'Жарыяны окуңуз. Көчүп киргенге чейин эмне кылынат?',
    options: ['Die Heizung wird erneuert.', 'Die Fenster werden repariert.', 'Die Wohnung wird gestrichen.'],
    answer: 'Die Wohnung wird gestrichen.',
    skill: 'reading',
    why: s(
      'В объявлении: «Die Wohnung wird vor dem Einzug gestrichen». Об отоплении и окнах ничего не сказано.',
      'Жарыяда: «Die Wohnung wird vor dem Einzug gestrichen». Жылытуу жана терезелер жөнүндө эч нерсе айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-24-13',
    prompt:
      'Lies den Aushang: „Die Treppe wird jeden Freitag gereinigt. Bitte stellen Sie nichts in das Treppenhaus. Defekte Lampen melden Sie bitte dem Hausmeister.“ Was soll man tun, wenn eine Lampe defekt ist?',
    promptRu: 'Прочитайте объявление в доме. Что нужно сделать, если лампа неисправна?',
    promptKy: 'Үйдөгү жарыяны окуңуз. Лампа бузук болсо, эмне кылуу керек?',
    options: ['Den Vermieter anrufen.', 'Den Hausmeister informieren.', 'Eine neue Lampe kaufen.'],
    answer: 'Den Hausmeister informieren.',
    skill: 'reading',
    why: s(
      'В тексте: «Defekte Lampen melden Sie bitte dem Hausmeister». О звонке арендодателю и покупке лампы ничего не сказано.',
      'Текстте: «Defekte Lampen melden Sie bitte dem Hausmeister». Ижарага берүүчүгө чалуу жана лампа сатып алуу жөнүндө эч нерсе айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-24-14',
    prompt:
      'Lies die Nachricht: „Liebe Frau Roth, in der Küche ist der Wasserhahn seit gestern undicht. Der Hausmeister war leider nicht da. Können Sie bitte jemanden schicken?“ Was möchte die Mieterin?',
    promptRu: 'Прочитайте сообщение. Чего хочет арендаторша?',
    promptKy: 'Билдирүүнү окуңуз. Ижарачы аял эмнени каалайт?',
    options: ['Dass jemand den Wasserhahn repariert.', 'Dass sie umziehen kann.', 'Dass die Miete niedriger wird.'],
    answer: 'Dass jemand den Wasserhahn repariert.',
    skill: 'reading',
    why: s(
      'В сообщении: «Können Sie bitte jemanden schicken?» — ей нужен человек, который починит кран. О переезде и арендной плате не сказано.',
      'Билдирүүдө: «Können Sie bitte jemanden schicken?» — ага кранды оңдой турган адам керек. Көчүү жана ижара акысы жөнүндө айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-24-15',
    prompt:
      'Lies den Text: „Wir sind letzten Monat umgezogen. In der neuen Wohnung wird der Müll genau getrennt. Außerdem brauchen wir weniger Energie, weil die Fenster dicht sind. Das ist gut für die Umwelt und für unser Geld.“ Was stimmt?',
    promptRu: 'Прочитайте текст. Что верно?',
    promptKy: 'Текстти окуңуз. Эмне туура?',
    options: ['Die Familie zieht bald um.', 'Die Familie wohnt jetzt in einem Altbau.', 'Die Familie spart Energie.'],
    answer: 'Die Familie spart Energie.',
    skill: 'reading',
    why: s(
      'В тексте: «brauchen wir weniger Energie» — семья экономит энергию. Переезд уже состоялся, об Altbau не сказано.',
      'Текстте: «brauchen wir weniger Energie» — үй-бүлө энергияны үнөмдөйт. Көчүү буга чейин болгон, Altbau жөнүндө айтылган эмес.',
    ),
  },
]
