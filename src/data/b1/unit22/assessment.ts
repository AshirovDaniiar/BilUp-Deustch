import type { Exercise, L10n } from '../../types'
import type { A2TestQuestion, L10nStrict } from '../../a2/types'
import type { B1TestDef } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 22 revision (Wiederholung) exercises, `b1-ex-22-01` … `-10`: 3 fill / 5 choice / 2 order on the unit's three concepts (concessions × 4, double
 * connectors × 3, adjective endings × 1), plus 2 RECYCLED items (↻ A2: deshalb vs trotzdem, Komparativ) without a concept of this unit — the
 * spaced-revision part. Two items are TEXT-level `choice` items (three-sentence texts). Authored independently of the final test: no prompt, sentence or
 * answer is shared. The receptive constructions (einerseits … andererseits, nicht nur … sondern auch) never appear in a gap or a word order.
 */
export const UNIT_22_EXERCISES: Exercise[] = [
  {
    id: 'b1-ex-22-01',
    type: 'fill',
    unit: 22,
    concept: 'b1-konzessive-saetze',
    prompt: 'Ich gehe spazieren, ___ es regnet.',
    promptRu: 'Я иду гулять, хотя идёт дождь.',
    promptKy: 'Жамгыр жаап жатса да, мен сейилдегени чыгам.',
    options: ['obwohl', 'weil', 'deshalb'],
    answer: 'obwohl',
    why: w(
      'Дождь не мешает прогулке — это уступка: obwohl («хотя»). Weil назвало бы причину, а deshalb — следствие и в этом месте не подходит.',
      'Жамгыр сейилдөөгө тоскоол болбойт — бул каршы келүү: obwohl («…са да»). weil себепти көрсөтмөк, ал эми deshalb натыйжаны билдирет жана бул жерге ылайык эмес.',
    ),
  },
  {
    id: 'b1-ex-22-02',
    type: 'choice',
    unit: 22,
    concept: 'b1-konzessive-saetze',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Ich bleibe hier, obwohl die Miete hoch ist.',
      'Ich bleibe hier, obwohl die Miete ist hoch.',
      'Ich bleibe hier, obwohl ist die Miete hoch.',
    ],
    answer: 'Ich bleibe hier, obwohl die Miete hoch ist.',
    why: w(
      'После obwohl спрягаемый глагол стоит в самом конце: …, obwohl die Miete hoch ist.',
      'obwohl сөзүнөн кийин этиш эң аягында турат: …, obwohl die Miete hoch ist.',
    ),
  },
  {
    id: 'b1-ex-22-03',
    type: 'order',
    unit: 22,
    concept: 'b1-konzessive-saetze',
    prompt: 'Bilde den Satz.',
    promptRu: 'Квартира, правда, маленькая, но светлая.',
    promptKy: 'Батир кичинекей экени чын, бирок жарык.',
    words: ['aber', 'Zwar', 'ist', 'die', 'Wohnung', 'klein,', 'hell.'],
    answer: 'Zwar ist die Wohnung klein, aber hell.',
    why: w(
      'Zwar открывает предложение, глагол (ist) — на втором месте. После запятой aber вводит возражение: «aber hell».',
      'Zwar сүйлөмдү баштайт, этиш (ist) экинчи орунда. Үтүрдөн кийин aber каршы пикирди киргизет: «aber hell».',
    ),
  },
  {
    id: 'b1-ex-22-04',
    type: 'choice',
    unit: 22,
    concept: 'b1-konzessive-saetze',
    prompt: 'Welcher kleine Text ist richtig und logisch?',
    promptRu: 'Какой короткий текст составлен правильно и логично?',
    promptKy: 'Кайсы кыска текст туура жана логикалуу түзүлгөн?',
    options: [
      'Das Zimmer ist klein. Obwohl es teuer ist, ich nehme es. Trotzdem suche ich weiter.',
      'Das Zimmer ist klein. Obwohl es teuer ist, nehme ich es. Trotzdem suche ich weiter.',
      'Das Zimmer ist klein. Obwohl es ist teuer, nehme ich es. Trotzdem suche ich weiter.',
    ],
    answer: 'Das Zimmer ist klein. Obwohl es teuer ist, nehme ich es. Trotzdem suche ich weiter.',
    why: w(
      'В первом тексте после части с obwohl нет перестановки (ich nehme), в третьем глагол после obwohl не в конце (es ist teuer). Во втором всё верно: Obwohl es teuer ist, nehme ich es — и trotzdem с глаголом на втором месте.',
      'Биринчи текстте obwohl бөлүгүнөн кийин сөз иретинин алмашуусу жок (ich nehme), үчүнчүсүндө obwohl сөзүнөн кийин этиш аягында эмес (es ist teuer). Экинчисинде баары туура: Obwohl es teuer ist, nehme ich es — жана trotzdem менен этиш экинчи орунда.',
    ),
  },
  {
    id: 'b1-ex-22-05',
    type: 'fill',
    unit: 22,
    concept: 'b1-doppelkonnektoren',
    prompt: 'Je länger ich hier wohne, ___ besser gefällt es mir.',
    promptRu: 'Чем дольше я здесь живу, тем больше мне здесь нравится.',
    promptKy: 'Бул жерде канчалык көп жашасам, ошончолук мага жакшы.',
    options: ['desto', 'weil', 'dass'],
    answer: 'desto',
    why: w(
      'Je … desto — «чем … тем»: после je и после desto стоит сравнительная степень (länger, besser).',
      'je … desto — «канчалык … ошончолук»: je жана desto сөздөрүнөн кийин салыштырма даража турат (länger, besser).',
    ),
  },
  {
    id: 'b1-ex-22-06',
    type: 'choice',
    unit: 22,
    concept: 'b1-doppelkonnektoren',
    prompt: 'Das Zimmer ist weder groß ___ hell.',
    promptRu: 'Комната ни большая, ни светлая.',
    promptKy: 'Бөлмө чоң да эмес, жарык да эмес.',
    options: ['noch', 'oder', 'und'],
    answer: 'noch',
    why: w(
      'К weder всегда подходит noch: weder … noch («ни … ни»). С oder получится entweder … oder — это другое значение.',
      'weder сөзүнө дайыма noch кошулат: weder … noch («… да, … да эмес»). oder менен entweder … oder болот — бул башка маани.',
    ),
  },
  {
    id: 'b1-ex-22-07',
    type: 'order',
    unit: 22,
    concept: 'b1-doppelkonnektoren',
    prompt: 'Bilde den Satz.',
    promptRu: 'Чем старше я становлюсь, тем спокойнее я становлюсь.',
    promptKy: 'Канчалык улгайган сайын, ошончолук токтоло берем.',
    words: ['werde,', 'Je', 'desto', 'ich', 'älter', 'ruhiger', 'werde', 'ich.'],
    answer: 'Je älter ich werde, desto ruhiger werde ich.',
    why: w(
      'В части с je глагол в конце (werde), в части с desto — на втором месте (werde ich). В обеих частях — сравнительная степень: älter, ruhiger.',
      'je бөлүгүндө этиш аягында (werde), desto бөлүгүндө экинчи орунда (werde ich). Эки бөлүктө тең салыштырма даража: älter, ruhiger.',
    ),
  },
  {
    id: 'b1-ex-22-08',
    type: 'choice',
    unit: 22,
    concept: 'b1-adjektive-dativ-genitiv',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Er wohnt in einem kleinen Dorf.', 'Er wohnt in einem kleine Dorf.', 'Er wohnt in einem kleines Dorf.'],
    answer: 'Er wohnt in einem kleinen Dorf.',
    why: w(
      'После in einem (Dativ) прилагательное получает -en: einem kleinen Dorf. Формы kleine и kleines здесь неверны.',
      'in einem (Dativ) сөзүнөн кийин сын атоочко -en кошулат: einem kleinen Dorf. kleine жана kleines формалары бул жерде туура эмес.',
    ),
  },
  // ↻ Wiederholung (recycled from A2, spaced revision; no concept of this unit)
  {
    id: 'b1-ex-22-09',
    type: 'fill',
    unit: 22,
    prompt: 'Es regnet stark. ___ bleibe ich heute zu Hause.',
    promptRu: 'Идёт сильный дождь. Поэтому сегодня я остаюсь дома.',
    promptKy: 'Катуу жамгыр жаап жатат. Ошондуктан бүгүн мен үйдө калам.',
    options: ['Deshalb', 'Trotzdem', 'Obwohl'],
    answer: 'Deshalb',
    why: w(
      '↻ A2: deshalb называет следствие («поэтому»): дождь — причина, поэтому я остаюсь дома. Trotzdem означало бы «всё же» и противоречило бы смыслу.',
      '↻ A2: deshalb натыйжаны көрсөтөт («ошондуктан»): жамгыр — себеп, ошондуктан мен үйдө калам. Trotzdem «ошого карабастан» дегенди билдирип, маанисине каршы келмек.',
    ),
  },
  {
    id: 'b1-ex-22-10',
    type: 'choice',
    unit: 22,
    prompt: 'Im Vergleich zu Berlin ist Leipzig ___.',
    promptRu: 'По сравнению с Берлином Лейпциг меньше.',
    promptKy: 'Берлинге салыштырганда Лейпциг кичирээк.',
    options: ['kleiner', 'klein', 'am kleinsten'],
    answer: 'kleiner',
    why: w(
      '↻ A2: при сравнении двух городов нужна сравнительная степень: klein → kleiner. Am kleinsten — превосходная степень, для сравнения двух нет.',
      '↻ A2: эки шаарды салыштырганда салыштырма даража керек: klein → kleiner. Am kleinsten — эң жогорку даража, ал экөөнү салыштырууда колдонулбайт.',
    ),
  },
]

/** Test definition `unit-22` (kind topic, 15 questions). */
export const UNIT_22_TEST: B1TestDef = {
  id: 'unit-22',
  title: s('Итоговый тест: юнит 22', 'Жыйынтыктоочу тест: 22-бөлүм'),
  kind: 'topic',
  level: 'B1',
  unit: 22,
  size: 15,
}

/**
 * Unit 22 final test, `b1-ft-22-01` … `-15`. Composition (curriculum v2 §7.2): 8 grammar (6 on the three concepts + 2 recycled A2 items ↻), 3 vocabulary,
 * 4 reading, 0 listening — listening items enter a test only after the text-to-speech playback has been verified on real devices. Reading items carry the
 * German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate only the instruction and the question. Authored positions of the correct answer:
 * 5 / 5 / 5, never three in a row. The adjective items test the Dativ and the plural only (the Genitiv is not examined).
 */
export const UNIT_22_FINAL: A2TestQuestion[] = [
  {
    id: 'b1-ft-22-01',
    prompt: 'Ich bin müde. ___ gehe ich heute zur Party.',
    promptRu: 'Я устал. Всё же сегодня я иду на вечеринку.',
    promptKy: 'Мен чарчадым. Ошого карабастан бүгүн кечеге барам.',
    options: ['Trotzdem', 'Deshalb', 'Obwohl'],
    answer: 'Trotzdem',
    skill: 'grammar',
    concept: 'b1-konzessive-saetze',
    why: s(
      'Усталость не останавливает — это уступка: trotzdem, а за ним глагол на втором месте (gehe ich). Deshalb дало бы следствие, obwohl не ставит глагол на второе место.',
      'Чарчоо токтотпойт — бул каршы келүү: trotzdem, андан кийин этиш экинчи орунда (gehe ich). Deshalb натыйжаны берет, ал эми obwohl этишти экинчи орунга койбойт.',
    ),
  },
  {
    id: 'b1-ft-22-02',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Obwohl ich müde bin, ich gehe zur Party.',
      'Obwohl ich müde bin, gehe ich zur Party.',
      'Obwohl ich bin müde, gehe ich zur Party.',
    ],
    answer: 'Obwohl ich müde bin, gehe ich zur Party.',
    skill: 'grammar',
    concept: 'b1-konzessive-saetze',
    why: s(
      'В части с obwohl глагол стоит в конце (müde bin), а сразу за запятой — глагол главного предложения: gehe ich.',
      'obwohl бөлүгүндө этиш аягында (müde bin), ал эми үтүрдөн кийин дароо башкы бөлүктүн этиши: gehe ich.',
    ),
  },
  {
    id: 'b1-ft-22-03',
    prompt: '___ meine Schwester noch mein Bruder mag Fisch.',
    promptRu: 'Ни моя сестра, ни мой брат не любят рыбу.',
    promptKy: 'Эжем да, иним да балыкты жактырбайт.',
    options: ['Entweder', 'Sowohl', 'Weder'],
    answer: 'Weder',
    skill: 'grammar',
    concept: 'b1-doppelkonnektoren',
    why: s(
      'Во второй части стоит noch, значит, в первой нужен weder: weder … noch («ни … ни»).',
      'Экинчи бөлүктө noch турат, демек, биринчи бөлүктө weder керек: weder … noch («… да, … да эмес»).',
    ),
  },
  {
    id: 'b1-ft-22-04',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Je mehr ich übe, desto besser ich spreche.',
      'Je mehr ich übe, desto besser spreche ich.',
      'Je mehr ich übe, besser desto spreche ich.',
    ],
    answer: 'Je mehr ich übe, desto besser spreche ich.',
    skill: 'grammar',
    concept: 'b1-doppelkonnektoren',
    why: s(
      'В части с je глагол в конце (übe), после desto — сравнительная степень, а затем глагол: desto besser spreche ich.',
      'je бөлүгүндө этиш аягында (übe), desto сөзүнөн кийин салыштырма даража, андан кийин этиш: desto besser spreche ich.',
    ),
  },
  {
    id: 'b1-ft-22-05',
    prompt: 'Das Buch liegt auf dem ___ Tisch.',
    promptRu: 'Книга лежит на новом столе.',
    promptKy: 'Китеп жаңы столдун үстүндө жатат.',
    options: ['neuen', 'neue', 'neuer'],
    answer: 'neuen',
    skill: 'grammar',
    concept: 'b1-adjektive-dativ-genitiv',
    why: s(
      'После auf + dem (Dativ) прилагательное получает -en: dem neuen Tisch.',
      'auf + dem (Dativ) сөзүнөн кийин сын атоочко -en кошулат: dem neuen Tisch.',
    ),
  },
  {
    id: 'b1-ft-22-06',
    prompt: 'Wir helfen den ___ Nachbarn.',
    promptRu: 'Мы помогаем милым соседям.',
    promptKy: 'Биз боорукер кошуналарга жардам беребиз.',
    options: ['netter', 'nette', 'netten'],
    answer: 'netten',
    skill: 'grammar',
    concept: 'b1-adjektive-dativ-genitiv',
    why: s(
      'Helfen требует Dativ, во множественном числе после den — окончание -en: den netten Nachbarn.',
      'helfen Dativди талап кылат, көптүк санда den сөзүнөн кийин -en жалгоосу: den netten Nachbarn.',
    ),
  },
  {
    id: 'b1-ft-22-07',
    prompt: 'Mit dem Rad bin ich ___ als mit dem Bus.',
    promptRu: 'На велосипеде я быстрее, чем на автобусе.',
    promptKy: 'Велосипед менен автобустан тезирээк барам.',
    options: ['schnell', 'schneller', 'am schnellsten'],
    answer: 'schneller',
    skill: 'grammar',
    concept: 'a2-komparativ-superlativ',
    why: s(
      '↻ A2: «чем» (als) требует сравнительной степени: schnell → schneller.',
      '↻ A2: «…дан» (als) салыштырма даражаны талап кылат: schnell → schneller.',
    ),
  },
  {
    id: 'b1-ft-22-08',
    prompt: 'Ich habe Hunger. ___ koche ich jetzt.',
    promptRu: 'Я голоден. Поэтому сейчас я готовлю.',
    promptKy: 'Мен ачмын. Ошондуктан азыр тамак жасайм.',
    options: ['Darum', 'Obwohl', 'Trotzdem'],
    answer: 'Darum',
    skill: 'grammar',
    concept: 'a2-deshalb-darum',
    why: s(
      '↻ A2: голод — причина, готовка — следствие: darum («поэтому»). Trotzdem противоречило бы смыслу.',
      '↻ A2: ачкычылык — себеп, тамак жасоо — натыйжа: darum («ошондуктан»). Trotzdem маанисине каршы келмек.',
    ),
  },
  {
    id: 'b1-ft-22-09',
    prompt: 'Das ist nur eine ___: Es gibt keinen Beweis dafür.',
    promptRu: 'Это только ___: доказательств этому нет.',
    promptKy: 'Бул жөн гана ___: буга далил жок.',
    options: ['Regel', 'Freiheit', 'Behauptung'],
    answer: 'Behauptung',
    skill: 'vocabulary',
    why: s(
      'Утверждение без доказательства — Behauptung. Regel — правило, Freiheit — свобода.',
      'Далилсиз айтылган сөз — Behauptung. Regel — эреже, Freiheit — эркиндик.',
    ),
  },
  {
    id: 'b1-ft-22-10',
    prompt: 'Das Smartphone hat einen ___: Man ist immer erreichbar.',
    promptRu: 'У смартфона есть ___: до человека всегда можно дозвониться.',
    promptKy: 'Смартфондун ___ бар: адамга дайыма байланышууга болот.',
    options: ['Vorteil', 'Zweifel', 'Widerspruch'],
    answer: 'Vorteil',
    skill: 'vocabulary',
    why: s(
      '«Всегда на связи» — плюс: Vorteil. Zweifel — сомнение, Widerspruch — возражение.',
      '«Дайыма байланышта» — артыкчылык: Vorteil. Zweifel — шек, Widerspruch — каршы пикир.',
    ),
  },
  {
    id: 'b1-ft-22-11',
    prompt: 'Zu viel Zucker ist ___ für die Gesundheit.',
    promptRu: 'Слишком много сахара ___ для здоровья.',
    promptKy: 'Өтө көп кант ден соолукка ___.',
    options: ['nützlich', 'schädlich', 'gerecht'],
    answer: 'schädlich',
    skill: 'vocabulary',
    why: s(
      'Слишком много сахара вредно: schädlich. Nützlich — полезный, gerecht — справедливый.',
      'Өтө көп кант зыяндуу: schädlich. Nützlich — пайдалуу, gerecht — адилеттүү.',
    ),
  },
  {
    id: 'b1-ft-22-12',
    prompt:
      'Lies den Text: „Ich wohne seit einem Jahr in einer WG. Obwohl mein Zimmer klein ist, gefällt es mir. Die Miete ist günstig, und die Küche ist groß.“ Warum gefällt der Person die WG?',
    promptRu: 'Прочитайте текст. Почему этому человеку нравится квартира с соседями?',
    promptKy: 'Текстти окуңуз. Бул адамга бирге жашаган батир эмне үчүн жагат?',
    options: ['Das Zimmer ist groß.', 'Sie wohnt allein.', 'Die Miete ist günstig.'],
    answer: 'Die Miete ist günstig.',
    skill: 'reading',
    why: s(
      'В тексте: «Die Miete ist günstig, und die Küche ist groß». Комната маленькая, и человек живёт не один.',
      'Текстте: «Die Miete ist günstig, und die Küche ist groß». Бөлмө кичинекей жана адам жалгыз жашабайт.',
    ),
  },
  {
    id: 'b1-ft-22-13',
    prompt:
      'Lies den Text: „Meine Eltern sind gegen ein Haustier. Sie sagen: Je größer das Tier ist, desto mehr Arbeit macht es. Trotzdem wünsche ich mir einen Hund.“ Was wünscht sich die Person?',
    promptRu: 'Прочитайте текст. Чего желает этот человек?',
    promptKy: 'Текстти окуңуз. Бул адам эмнени каалайт?',
    options: ['Eine Katze.', 'Einen Hund.', 'Ein Pferd.'],
    answer: 'Einen Hund.',
    skill: 'reading',
    why: s(
      'В тексте: «Trotzdem wünsche ich mir einen Hund». Родители против, но автор хочет собаку.',
      'Текстте: «Trotzdem wünsche ich mir einen Hund». Ата-энелер каршы, бирок автор ит каалайт.',
    ),
  },
  {
    id: 'b1-ft-22-14',
    prompt:
      'Lies den Leserbrief: „Die Stadt will ein neues Parkhaus bauen. Manche finden das sinnvoll, weil es zu wenige Parkplätze gibt. Ich bin dagegen: Das Parkhaus ist teuer, und wir brauchen mehr Busse.“ Was meint die Schreiberin?',
    promptRu: 'Прочитайте письмо читателя. Что думает автор письма?',
    promptKy: 'Окурмандын катын окуңуз. Каттын автору эмне деп ойлойт?',
    options: ['Sie will mehr Busse.', 'Sie ist für das Parkhaus.', 'Sie braucht mehr Parkplätze.'],
    answer: 'Sie will mehr Busse.',
    skill: 'reading',
    why: s(
      'В письме: «Ich bin dagegen … wir brauchen mehr Busse». Автор против парковки и за автобусы.',
      'Катта: «Ich bin dagegen … wir brauchen mehr Busse». Автор паркингге каршы жана автобустарды колдойт.',
    ),
  },
  {
    id: 'b1-ft-22-15',
    prompt:
      'Lies den Text: „Tom isst weder Fleisch noch Fisch. Sein Bruder isst dagegen fast alles. Am Wochenende kochen beide gern zusammen.“ Was stimmt?',
    promptRu: 'Прочитайте текст. Что верно?',
    promptKy: 'Текстти окуңуз. Эмне туура?',
    options: ['Tom und sein Bruder essen dasselbe.', 'Tom kocht nie.', 'Tom isst kein Fleisch und keinen Fisch.'],
    answer: 'Tom isst kein Fleisch und keinen Fisch.',
    skill: 'reading',
    why: s(
      'Weder Fleisch noch Fisch значит «ни мяса, ни рыбы». Брат ест почти всё (dagegen), а готовят они вместе.',
      'Weder Fleisch noch Fisch «эт да, балык да жебейт» дегенди билдирет. Ини дээрлик баарын жейт (dagegen), ал эми алар чогуу тамак жасашат.',
    ),
  },
]
