import type { Exercise, L10n } from '../../types'
import type { A2TestQuestion, L10nStrict } from '../../a2/types'
import type { B1TestDef } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 27 revision (Wiederholung) exercises, `b1-ex-27-01` … `-10`: 4 fill / 4 choice / 2 order on the unit's two concepts (Konjunktiv II: wishes, unreal conditions,
 * polite requests × 4; Genitiv prepositions × 4), plus 2 RECYCLED items (↻ Konjunktiv II advice of Unit 25, ↻ Passiv with modal verb of Unit 26) without a concept
 * of this unit — the spaced-revision part. Exercise 04 is a TEXT-level `choice` item (three sentences). Authored independently of the final test: no prompt,
 * sentence or answer is shared. The Genitiv items use only wegen / trotz / während / statt + noun (never `statt … zu`); no item uses Konjunktiv II of the past.
 * All situations are fictional language practice, not legal statements.
 */
export const UNIT_27_EXERCISES: Exercise[] = [
  {
    id: 'b1-ex-27-01',
    type: 'fill',
    unit: 27,
    concept: 'b1-konjunktiv2-wuensche-irreal',
    prompt: 'Wenn ich mehr Geld ___, würde ich ein neues Handy kaufen.',
    promptRu: 'Если бы у меня было больше денег, я бы купил новый телефон.',
    promptKy: 'Менде көбүрөөк акча болсо, мен жаңы телефон сатып алмакмын.',
    options: ['hätte', 'habe', 'hatte'],
    answer: 'hätte',
    why: w(
      'Нереальное условие (денег нет) требует Konjunktiv II: hätte. Habe — реальное условие, hatte — Präteritum (прошлое).',
      'Чындыкка жатпаган шарт (акча жок) Konjunktiv IIди талап кылат: hätte. habe — чыныгы шарт, hatte — Präteritum (өткөн чак).',
    ),
  },
  {
    id: 'b1-ex-27-02',
    type: 'choice',
    unit: 27,
    concept: 'b1-konjunktiv2-wuensche-irreal',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Wenn ich du wäre, würde ich das Gerät zurückgeben.',
      'Wenn ich du bin, würde ich das Gerät zurückgeben.',
      'Wenn ich du wäre, ich würde das Gerät zurückgeben.',
    ],
    answer: 'Wenn ich du wäre, würde ich das Gerät zurückgeben.',
    why: w(
      'В части с wenn нужна форма wäre (Konjunktiv II), а после неё в главной части глагол würde стоит на первом месте: …, würde ich … zurückgeben.',
      'wenn бөлүгүндө wäre формасы (Konjunktiv II) керек, андан кийин башкы бөлүктө würde этиши биринчи орунда турат: …, würde ich … zurückgeben.',
    ),
  },
  {
    id: 'b1-ex-27-03',
    type: 'order',
    unit: 27,
    concept: 'b1-konjunktiv2-wuensche-irreal',
    prompt: 'Bilde den Satz.',
    promptRu: 'Не могли бы вы, пожалуйста, возместить мне сумму?',
    promptKy: 'Сураныч, мага сумманы кайтарып бере аласызбы?',
    words: ['Betrag', 'mir', 'bitte', 'Sie', 'den', 'Könnten', 'erstatten?'],
    answer: 'Könnten Sie mir bitte den Betrag erstatten?',
    why: w(
      'Вежливая просьба: Könnten на первом месте, затем Sie; инфинитив (erstatten) — в самом конце.',
      'Сылык өтүнүч: Könnten биринчи орунда, андан кийин Sie; инфинитив (erstatten) — эң аягында.',
    ),
  },
  {
    id: 'b1-ex-27-04',
    type: 'choice',
    unit: 27,
    concept: 'b1-konjunktiv2-wuensche-irreal',
    prompt: 'Welcher kleine Text ist richtig?',
    promptRu: 'Какой короткий текст составлен правильно?',
    promptKy: 'Кайсы кыска текст туура түзүлгөн?',
    options: [
      'Ich wünschte, ich habe mehr Geld. Wenn ich mehr Geld hätte, würde ich sparen. Dann wäre ich ruhiger.',
      'Ich wünschte, ich hätte mehr Geld. Wenn ich mehr Geld hätte, würde ich sparen. Dann wäre ich ruhiger.',
      'Ich wünschte, ich hätte mehr Geld. Wenn ich mehr Geld hätte, ich würde sparen. Dann wäre ich ruhiger.',
    ],
    answer: 'Ich wünschte, ich hätte mehr Geld. Wenn ich mehr Geld hätte, würde ich sparen. Dann wäre ich ruhiger.',
    why: w(
      'В первом тексте после «Ich wünschte» стоит «habe» вместо Konjunktiv II (hätte). В третьем тексте после части с wenn нарушен порядок слов («ich würde» вместо «würde ich»). Во втором тексте всё верно.',
      'Биринчи текстте «Ich wünschte» сөзүнөн кийин Konjunktiv II (hätte) ордуна «habe» турат. Үчүнчү текстте wenn бөлүгүнөн кийин сөздөрдүн ирети бузулган («würde ich» ордуна «ich würde»). Экинчи текстте баары туура.',
    ),
  },
  {
    id: 'b1-ex-27-05',
    type: 'fill',
    unit: 27,
    concept: 'b1-genitiv-praepositionen',
    prompt: 'Wegen ___ Defekts rufe ich den Händler an.',
    promptRu: 'Из-за дефекта я звоню продавцу.',
    promptKy: 'Кемчиликтен улам мен соодагерге чалам.',
    options: ['des', 'dem', 'der'],
    answer: 'des',
    why: w(
      'После wegen стоит Genitiv. «Der Defekt» — мужской род, поэтому des (и -s у существительного: des Defekts). Dem — Dativ, der — женский род.',
      'wegen сөзүнөн кийин Genitiv турат. «Der Defekt» — эркек род, ошондуктан des (жана зат атоочто -s: des Defekts). dem — Dativ, der — аял род.',
    ),
  },
  {
    id: 'b1-ex-27-06',
    type: 'choice',
    unit: 27,
    concept: 'b1-genitiv-praepositionen',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Trotz des Regens gehen wir einkaufen.',
      'Trotz dem Regen gehen wir einkaufen.',
      'Trotz der Regens gehen wir einkaufen.',
    ],
    answer: 'Trotz des Regens gehen wir einkaufen.',
    why: w(
      'После trotz стоит Genitiv: der Regen (мужской род) → des Regens, с окончанием -s у существительного. «Dem Regen» — Dativ.',
      'trotz сөзүнөн кийин Genitiv турат: der Regen (эркек род) → des Regens, зат атоочто -s уландысы менен. «Dem Regen» — Dativ.',
    ),
  },
  {
    id: 'b1-ex-27-07',
    type: 'order',
    unit: 27,
    concept: 'b1-genitiv-praepositionen',
    prompt: 'Bilde den Satz.',
    promptRu: 'В часы работы служба поддержки доступна.',
    promptKy: 'Иштөө убактысында тейлөө кызматы жеткиликтүү.',
    words: ['Öffnungszeiten', 'Kundendienst', 'der', 'ist', 'Während', 'erreichbar.', 'der'],
    answer: 'Während der Öffnungszeiten ist der Kundendienst erreichbar.',
    why: w(
      '«Die Öffnungszeiten» — множественное число, поэтому после während стоит der. Глагол ist — на втором месте после целого оборота «Während der Öffnungszeiten».',
      '«Die Öffnungszeiten» — көптүк сан, ошондуктан während сөзүнөн кийин der турат. ist этиши «Während der Öffnungszeiten» бүтүн сөз айкашынан кийин экинчи орунда турат.',
    ),
  },
  {
    id: 'b1-ex-27-08',
    type: 'fill',
    unit: 27,
    concept: 'b1-genitiv-praepositionen',
    prompt: 'Statt ___ Geschenks bekomme ich einen Gutschein.',
    promptRu: 'Вместо подарка я получаю ваучер.',
    promptKy: 'Белектин ордуна мен купон алам.',
    options: ['eines', 'einem', 'ein'],
    answer: 'eines',
    why: w(
      'После statt (с существительным) стоит Genitiv: das Geschenk (средний род) → eines Geschenks. Einem — Dativ, ein — Nominativ/Akkusativ.',
      'statt (зат атооч менен) сөзүнөн кийин Genitiv турат: das Geschenk (орто род) → eines Geschenks. einem — Dativ, ein — Nominativ/Akkusativ.',
    ),
  },
  // ↻ Wiederholung (recycled, spaced revision; no concept of this unit)
  {
    id: 'b1-ex-27-09',
    type: 'choice',
    unit: 27,
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'An deiner Stelle würde ich den Preis vergleichen.',
      'An deiner Stelle ich würde den Preis vergleichen.',
      'An deiner Stelle würde ich den Preis vergleiche.',
    ],
    answer: 'An deiner Stelle würde ich den Preis vergleichen.',
    why: w(
      '↻ Юнит 25: совет с würde: после «An deiner Stelle» глагол würde стоит перед ich, а инфинитив (vergleichen) — в самом конце.',
      '↻ 25-бөлүм: würde менен кеңеш: «An deiner Stelle» сөзүнөн кийин würde этиши ich алдында турат, ал эми инфинитив (vergleichen) — эң аягында.',
    ),
  },
  {
    id: 'b1-ex-27-10',
    type: 'fill',
    unit: 27,
    prompt: 'Das Gerät muss ersetzt ___.',
    promptRu: 'Устройство нужно заменить.',
    promptKy: 'Шайманды алмаштыруу керек.',
    options: ['werden', 'wird', 'sein'],
    answer: 'werden',
    why: w(
      '↻ Юнит 26: Passiv с модальным глаголом: muss + Partizip II (ersetzt) + werden в самом конце.',
      '↻ 26-бөлүм: модаль этиш менен Passiv: muss + Partizip II (ersetzt) + эң аягында werden.',
    ),
  },
]

/** Test definition `unit-27` (kind topic, 15 questions). */
export const UNIT_27_TEST: B1TestDef = {
  id: 'unit-27',
  title: s('Итоговый тест: юнит 27', 'Жыйынтыктоочу тест: 27-бөлүм'),
  kind: 'topic',
  level: 'B1',
  unit: 27,
  size: 15,
}

/**
 * Unit 27 final test, `b1-ft-27-01` … `-15`. Composition (curriculum v2 §7.2): 8 grammar (3 on Konjunktiv II: unreal condition, politeness register, wishes; 3 on
 * Genitiv forms; 2 recycled ↻: Konjunktiv II advice of Unit 25 and Passiv of Unit 24), 3 vocabulary, 4 reading, 0 listening — listening items enter a test only
 * after the text-to-speech playback has been verified on real devices. Reading items carry the German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy`
 * translate only the instruction and the question. All texts are fictional. Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_27_FINAL: A2TestQuestion[] = [
  {
    id: 'b1-ft-27-01',
    prompt: 'Wenn der Preis niedriger ___, würde ich das Handy kaufen.',
    promptRu: 'Если бы цена была ниже, я бы купил телефон.',
    promptKy: 'Баасы төмөнүрөөк болсо, мен телефон сатып алмакмын.',
    options: ['wäre', 'war', 'ist'],
    answer: 'wäre',
    skill: 'grammar',
    concept: 'b1-konjunktiv2-wuensche-irreal',
    why: s(
      'Нереальное условие: в части с wenn нужен Konjunktiv II — wäre. War (Präteritum) и ist (Präsens) не выражают нереальность.',
      'Чындыкка жатпаган шарт: wenn бөлүгүндө Konjunktiv II керек — wäre. war (Präteritum) жана ist (Präsens) чындыкка жатпагандыкты билдирбейт.',
    ),
  },
  {
    id: 'b1-ft-27-02',
    prompt: 'Welche Bitte ist am höflichsten?',
    promptRu: 'Какая просьба самая вежливая?',
    promptKy: 'Кайсы өтүнүч эң сылык?',
    options: ['Geben Sie mir das Geld zurück!', 'Könnten Sie mir bitte das Geld zurückgeben?', 'Ich will mein Geld zurück.'],
    answer: 'Könnten Sie mir bitte das Geld zurückgeben?',
    skill: 'grammar',
    concept: 'b1-konjunktiv2-wuensche-irreal',
    why: s(
      'Вежливая просьба — Könnten Sie … bitte …? (Konjunktiv II). Приказ («Geben Sie …!») и требование («Ich will …») звучат резко.',
      'Сылык өтүнүч — Könnten Sie … bitte …? (Konjunktiv II). Буйрук («Geben Sie …!») жана талап («Ich will …») катаал угулат.',
    ),
  },
  {
    id: 'b1-ft-27-03',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Wenn ich würde mehr Zeit haben, ich würde kommen.',
      'Wenn ich mehr Zeit habe, würde ich kommen.',
      'Wenn ich mehr Zeit hätte, würde ich kommen.',
    ],
    answer: 'Wenn ich mehr Zeit hätte, würde ich kommen.',
    skill: 'grammar',
    concept: 'b1-konjunktiv2-wuensche-irreal',
    why: s(
      'Нереальное условие: hätte в части с wenn, würde + инфинитив в главной части, глагол würde — перед ich. Другие варианты нарушают форму или порядок слов.',
      'Чындыкка жатпаган шарт: wenn бөлүгүндө hätte, башкы бөлүктө würde + инфинитив, würde этиши — ich алдында. Башка варианттар форманы же сөздөрдүн иретин бузат.',
    ),
  },
  {
    id: 'b1-ft-27-04',
    prompt: 'Wegen ___ hohen Versandkosten bestelle ich dort nicht.',
    promptRu: 'Из-за высокой стоимости доставки я там не заказываю.',
    promptKy: 'Жөнөтүү чыгымдары жогору болгондуктан мен ал жерден заказ бербейм.',
    options: ['des', 'der', 'dem'],
    answer: 'der',
    skill: 'grammar',
    concept: 'b1-genitiv-praepositionen',
    why: s(
      '«Die Versandkosten» — множественное число. В Genitiv множественного числа артикль — der, прилагательное — hohen (-en).',
      '«Die Versandkosten» — көптүк сан. Көптүк сандын Genitivинде артикль — der, сын атооч — hohen (-en).',
    ),
  },
  {
    id: 'b1-ft-27-05',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Während des Einkaufs habe ich einen Freund getroffen.',
      'Während dem Einkauf habe ich einen Freund getroffen.',
      'Während der Einkauf habe ich einen Freund getroffen.',
    ],
    answer: 'Während des Einkaufs habe ich einen Freund getroffen.',
    skill: 'grammar',
    concept: 'b1-genitiv-praepositionen',
    why: s(
      'После während стоит Genitiv: der Einkauf (мужской род) → des Einkaufs (с -s). Dem — Dativ, а «der Einkauf» — Nominativ.',
      'während сөзүнөн кийин Genitiv турат: der Einkauf (эркек род) → des Einkaufs (-s менен). dem — Dativ, ал эми «der Einkauf» — Nominativ.',
    ),
  },
  {
    id: 'b1-ft-27-06',
    prompt: 'Wegen des ___ bleiben wir zu Hause.',
    promptRu: 'Из-за погоды мы остаёмся дома.',
    promptKy: 'Аба ырайына байланыштуу биз үйдө калабыз.',
    options: ['Wetter', 'Wetterns', 'Wetters'],
    answer: 'Wetters',
    skill: 'grammar',
    concept: 'b1-genitiv-praepositionen',
    why: s(
      'У существительных среднего рода в Genitiv появляется -s: das Wetter → des Wetters.',
      'Орто родтогу зат атоочтор Genitivде -s алат: das Wetter → des Wetters.',
    ),
  },
  {
    id: 'b1-ft-27-07',
    prompt: 'Freundlicher Rat: Du ___ vor dem Kauf die Preise vergleichen.',
    promptRu: 'Дружеский совет: Тебе стоило бы сравнить цены перед покупкой.',
    promptKy: 'Достук кеңеш: Сен сатып алардан мурун баааларды салыштырышың керек болмок.',
    options: ['solltest', 'sollst', 'sollten'],
    answer: 'solltest',
    skill: 'grammar',
    concept: 'b1-konjunktiv2-ratschlaege',
    why: s(
      '↻ Юнит 25: дружеский совет — Konjunktiv II: solltest. Sollst звучит как указание, sollten — форма для wir/sie.',
      '↻ 25-бөлүм: достук кеңеш — Konjunktiv II: solltest. sollst көрсөтмө сыяктуу угулат, sollten — wir/sie формасы.',
    ),
  },
  {
    id: 'b1-ft-27-08',
    prompt: 'Die Ware ___ morgen geliefert.',
    promptRu: 'Товар доставят завтра.',
    promptKy: 'Товар эртең жеткирилет.',
    options: ['wirst', 'wird', 'werden'],
    answer: 'wird',
    skill: 'grammar',
    concept: 'b1-passiv-praesens',
    why: s(
      '↻ Юнит 24: Passiv Präsens — wird/werden + Partizip II. «Die Ware» — единственное число: wird.',
      '↻ 24-бөлүм: Passiv Präsens — wird/werden + Partizip II. «Die Ware» — жекелик сан: wird.',
    ),
  },
  {
    id: 'b1-ft-27-09',
    prompt: 'Wenn ein Produkt kaputt ist, kann man es ___.',
    promptRu: 'Если товар сломан, на него можно подать ___.',
    promptKy: 'Товар бузук болсо, ага ___ мүмкүн.',
    options: ['ausgeben', 'sparen', 'reklamieren'],
    answer: 'reklamieren',
    skill: 'vocabulary',
    why: s(
      'На дефектный товар подают рекламацию: reklamieren. Ausgeben — тратить, sparen — копить.',
      'Дефектүү товарга даттанышат: reklamieren. ausgeben — сарптоо, sparen — жыйноо.',
    ),
  },
  {
    id: 'b1-ft-27-10',
    prompt: 'Wenn der Shop das Geld zurückzahlt, bekommt man eine ___.',
    promptRu: 'Если магазин возвращает деньги, человек получает ___.',
    promptKy: 'Дүкөн акчаны кайтарып төлөсө, адам ___ алат.',
    options: ['Erstattung', 'Garantie', 'Gebühr'],
    answer: 'Erstattung',
    skill: 'vocabulary',
    why: s(
      'Возврат денег — Erstattung. Garantie — гарантия, Gebühr — комиссия, сбор.',
      'Акчаны кайтаруу — Erstattung. Garantie — кепилдик, Gebühr — комиссия, акы.',
    ),
  },
  {
    id: 'b1-ft-27-11',
    prompt: 'Ein Händler, der dem Kunden entgegenkommt, ist ___.',
    promptRu: 'Продавец, который идёт клиенту навстречу, — ___.',
    promptKy: 'Кардарга жеңилдик берген соодагер — ___.',
    options: ['mangelhaft', 'kulant', 'beschädigt'],
    answer: 'kulant',
    skill: 'vocabulary',
    why: s(
      'Продавец, который идёт навстречу, — kulant. Mangelhaft и beschädigt описывают товар, а не человека.',
      'Жеңилдик берген соодагер — kulant. mangelhaft жана beschädigt товарды сүрөттөйт, адамды эмес.',
    ),
  },
  {
    id: 'b1-ft-27-12',
    prompt:
      'Lies den Brief (erfunden): „Sehr geehrte Damen und Herren, die bestellte Jacke ist beschädigt angekommen. Wegen des Schadens möchte ich die Jacke zurückgeben. Bitte erstatten Sie mir den Betrag von 79 Euro.“ Was verlangt der Kunde?',
    promptRu: 'Прочитайте письмо (вымышленное). Чего требует клиент?',
    promptKy: 'Катты окуңуз (ойдон чыгарылган). Кардар эмнени талап кылат?',
    options: ['Eine andere Farbe.', 'Einen Gutschein.', 'Das Geld zurück.'],
    answer: 'Das Geld zurück.',
    skill: 'reading',
    why: s(
      'В письме: «Bitte erstatten Sie mir den Betrag von 79 Euro» — клиент хочет вернуть деньги. О другом цвете и ваучере ничего не сказано.',
      'Катта: «Bitte erstatten Sie mir den Betrag von 79 Euro» — кардар акчасын кайтарууну каалайт. Башка түс жана купон жөнүндө эч нерсе айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-27-13',
    prompt:
      'Lies die Nachricht von der Bank (erfunden): „Ab Juni kostet das Konto eine Gebühr von drei Euro im Monat. Der Dauerauftrag für Ihre Miete bleibt gleich.“ Was ändert sich?',
    promptRu: 'Прочитайте сообщение банка (вымышленное). Что меняется?',
    promptKy: 'Банктын билдирүүсүн окуңуз (ойдон чыгарылган). Эмне өзгөрөт?',
    options: ['Die Miete steigt.', 'Das Konto kostet eine Gebühr.', 'Der Dauerauftrag endet.'],
    answer: 'Das Konto kostet eine Gebühr.',
    skill: 'reading',
    why: s(
      'В сообщении: «Ab Juni kostet das Konto eine Gebühr». Постоянное поручение остаётся прежним, о росте аренды не сказано.',
      'Билдирүүдө: «Ab Juni kostet das Konto eine Gebühr». Туруктуу тапшырма мурункудай калат, ижара акысынын көбөйгөнү жөнүндө айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-27-14',
    prompt:
      'Lies den Text (erfunden): „Ich wünschte, ich hätte weniger Schulden. Wenn mein Gehalt höher wäre, könnte ich schneller zurückzahlen. Im Moment spare ich nur zwanzig Euro im Monat.“ Was stimmt?',
    promptRu: 'Прочитайте текст (вымышленный). Что верно?',
    promptKy: 'Текстти окуңуз (ойдон чыгарылган). Эмне туура?',
    options: ['Die Person hat Schulden.', 'Die Person hat viel Geld.', 'Die Person spart viel.'],
    answer: 'Die Person hat Schulden.',
    skill: 'reading',
    why: s(
      'В тексте: «Ich wünschte, ich hätte weniger Schulden» — долги есть. Денег немного, сбережения маленькие (двадцать евро).',
      'Текстте: «Ich wünschte, ich hätte weniger Schulden» — карыз бар. Акча аз, жыйнагандары кичине (жыйырма евро).',
    ),
  },
  {
    id: 'b1-ft-27-15',
    prompt:
      'Lies den Text (erfunden): „Der Laden gibt im Januar zwanzig Prozent Rabatt auf Jacken. Trotz des Rabatts kaufe ich nichts, denn ich brauche keine Jacke.“ Warum kauft die Person nichts?',
    promptRu: 'Прочитайте текст (вымышленный). Почему человек ничего не покупает?',
    promptKy: 'Текстти окуңуз (ойдон чыгарылган). Адам эмне үчүн эч нерсе албайт?',
    options: ['Der Rabatt ist zu klein.', 'Der Laden ist zu weit weg.', 'Sie braucht keine Jacke.'],
    answer: 'Sie braucht keine Jacke.',
    skill: 'reading',
    why: s(
      'В тексте: «denn ich brauche keine Jacke». О маленькой скидке и далёком магазине ничего не сказано.',
      'Текстте: «denn ich brauche keine Jacke». Скидканын кичинелиги жана дүкөндүн алыстыгы жөнүндө эч нерсе айтылган эмес.',
    ),
  },
]
