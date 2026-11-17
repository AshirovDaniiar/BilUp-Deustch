import type { Exercise, L10n } from '../../types'
import type { A2TestDef, A2TestQuestion, L10nStrict } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 15 revision (Wiederholung) exercises, `a2-ex-15-01` … `-08` (3 fill / 3 choice / 2 order; concept 1 × 3, concept 2 × 3, concept 3 × 2 — the Stage 7B plan).
 * Authored independently of the final test below: no prompt, sentence or answer is shared. Positions of the correct option: fill 1 / 0 / 2, choice 2 / 1 / 0.
 */
export const UNIT_15_EXERCISES: Exercise[] = [
  {
    id: 'a2-ex-15-01',
    type: 'fill',
    unit: 15,
    concept: 'a2-adjektivendungen-definit',
    prompt: 'Ich nehme die rot___ Jacke.',
    promptRu: 'Я беру красную куртку.',
    promptKy: 'Мен кызыл куртканы алам.',
    options: ['en', 'e', 'er'],
    answer: 'e',
    why: w(
      'Jacke — женский род. После die (Akkusativ) окончание -e: die rote Jacke. Окончание -en здесь не нужно.',
      'Jacke — аял жынстагы сөз. die (Akkusativ) сөзүнөн кийин -e аякталышы турат: die rote Jacke. Бул жерде -en керек эмес.',
    ),
  },
  {
    id: 'a2-ex-15-02',
    type: 'choice',
    unit: 15,
    concept: 'a2-adjektivendungen-definit',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Die schwarze Hosen sind zu lang.', 'Die schwarzen Hose sind zu lang.', 'Die schwarzen Hosen sind zu lang.'],
    answer: 'Die schwarzen Hosen sind zu lang.',
    why: w(
      'Hosen — множественное число. После die во множественном числе прилагательное получает -en: die schwarzen Hosen.',
      'Hosen — көптүк сан. Көптүк санда die сөзүнөн кийин сын атоочко -en кошулат: die schwarzen Hosen.',
    ),
  },
  {
    id: 'a2-ex-15-03',
    type: 'order',
    unit: 15,
    concept: 'a2-adjektivendungen-definit',
    prompt: 'Bilde den Satz.',
    promptRu: 'Какое пальто вы хотите?',
    promptKy: 'Кайсы пальтону каалайсыз?',
    words: ['Mantel', 'möchten', 'Welchen', 'Sie?'],
    answer: 'Welchen Mantel möchten Sie?',
    why: w(
      'Вопросительное слово стоит первым, глагол möchten — вторым. Mantel — мужской род, в Akkusativ — welchen.',
      'Суроо сөзү биринчи, möchten этиши экинчи турат. Mantel — эркек жынс, Akkusativде — welchen.',
    ),
  },
  {
    id: 'a2-ex-15-04',
    type: 'fill',
    unit: 15,
    concept: 'a2-mengen-indefinitpronomen',
    prompt: 'Ich möchte drei ___ Äpfel.',
    promptRu: 'Я хотел бы три килограмма яблок.',
    promptKy: 'Мен үч килограмм алма алгым келет.',
    options: ['Kilo', 'Kilos', 'Kilon'],
    answer: 'Kilo',
    why: w(
      'Kilo — мера среднего рода. После числа она остаётся без -s: drei Kilo. Затем идёт существительное без артикля.',
      'Kilo — орто жынстагы өлчөм. Санактан кийин ал -s албай калат: drei Kilo. Андан кийин артикльсиз зат атооч келет.',
    ),
  },
  {
    id: 'a2-ex-15-05',
    type: 'choice',
    unit: 15,
    concept: 'a2-mengen-indefinitpronomen',
    prompt: 'Haben Sie Tomaten? Welche Antwort ist richtig?',
    promptRu: 'У вас есть помидоры? Какой ответ правильный?',
    promptKy: 'Сизде томат барбы? Кайсы жооп туура?',
    options: ['Ja, ich habe einen.', 'Ja, ich habe welche.', 'Ja, ich habe keine.'],
    answer: 'Ja, ich habe welche.',
    why: w(
      'Tomaten — множественное число. Чтобы не повторять слово, берут welche. Einen — мужской род, keine — это «нет».',
      'Tomaten — көптүк сан. Сөздү кайталабоо үчүн welche колдонулат. Einen — эркек жынс, keine — «жок» дегенди билдирет.',
    ),
  },
  {
    id: 'a2-ex-15-06',
    type: 'order',
    unit: 15,
    concept: 'a2-mengen-indefinitpronomen',
    prompt: 'Bilde den Satz.',
    promptRu: 'Сколько бутылок воды вам нужно?',
    promptKy: 'Сизге канча бөтөлкө суу керек?',
    words: ['Flaschen', 'Wasser', 'brauchen', 'Sie?', 'viele', 'Wie'],
    answer: 'Wie viele Flaschen Wasser brauchen Sie?',
    why: w(
      'Flaschen — исчисляемое во множественном числе, поэтому wie viele. Глагол brauchen — на втором месте после «wie viele Flaschen Wasser».',
      'Flaschen — көптүк сандагы саналуучу зат атооч, ошондуктан wie viele. brauchen этиши «wie viele Flaschen Wasser» сөз айкашынан кийин экинчи орунда турат.',
    ),
  },
  {
    id: 'a2-ex-15-07',
    type: 'fill',
    unit: 15,
    concept: 'a2-hoefliche-bitten',
    prompt: 'Können Sie ___ bitte helfen?',
    promptRu: 'Вы можете мне, пожалуйста, помочь?',
    promptKy: 'Сураныч, мага жардам бере аласызбы?',
    options: ['ich', 'mich', 'mir'],
    answer: 'mir',
    why: w(
      'Helfen требует Dativ: mir (так вы учили в юните 12). Формы ich и mich здесь неверны.',
      'Helfen Dativ талап кылат: mir (12-бөлүмдө үйрөндүңүз). ich жана mich формалары бул жерде туура эмес.',
    ),
  },
  {
    id: 'a2-ex-15-08',
    type: 'choice',
    unit: 15,
    concept: 'a2-hoefliche-bitten',
    prompt: 'Sie sind im Café. Was sagen Sie höflich?',
    promptRu: 'Вы в кафе. Что вы вежливо скажете?',
    promptKy: 'Сиз кафедесиз. Сылык түрдө эмне дейсиз?',
    options: ['Ich möchte bitte einen Tee.', 'Gib mir einen Tee!', 'Ich will Tee.'],
    answer: 'Ich möchte bitte einen Tee.',
    why: w(
      'Вежливый заказ — «Ich möchte … bitte». Gib mir … — приказ для друга, а Ich will … звучит как требование.',
      'Сылык заказ — «Ich möchte … bitte». Gib mir … — дос үчүн буйрук, ал эми Ich will … талап сыяктуу угулат.',
    ),
  },
]

/** Test definition `unit-15` (kind topic, 15 questions). */
export const UNIT_15_TEST: A2TestDef = {
  id: 'unit-15',
  title: s('Итоговый тест: юнит 15', 'Жыйынтыктоочу тест: 15-бөлүм'),
  kind: 'topic',
  level: 'A2',
  unit: 15,
  size: 15,
}

/**
 * Unit 15 final test, `a2-ft-15-01` … `-15`. Composition: 7 grammar items (3 + 3 + 1, each in a small shop or restaurant sentence), 3 vocabulary items,
 * 5 items that read a short German text (menu, flyer, a customer's message, a dialogue in a shop, a service notice).
 * Reading items carry the German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate only the instruction and the question.
 * Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_15_FINAL: A2TestQuestion[] = [
  {
    id: 'a2-ft-15-01',
    prompt: 'Im Geschäft sagt der Kunde: „Ich nehme den ___ Mantel.“',
    promptRu: 'В магазине покупатель говорит: «Я беру серое пальто».',
    promptKy: 'Дүкөндө кардар айтат: «Мен боз пальтону алам».',
    options: ['grauen', 'graue', 'grauer'],
    answer: 'grauen',
    skill: 'grammar',
    concept: 'a2-adjektivendungen-definit',
    why: s(
      'Mantel — мужской род, после nehmen нужен Akkusativ: den. Окончание -en: den grauen Mantel. Формы -e и -er здесь не подходят.',
      'Mantel — эркек жынс, nehmen этишинен кийин Akkusativ керек: den. -en аякталышы: den grauen Mantel. -e жана -er формалары бул жерге туура келбейт.',
    ),
  },
  {
    id: 'a2-ft-15-02',
    prompt: 'Diese ___ Kleider sind heute reduziert.',
    promptRu: 'Эти красные платья сегодня со скидкой.',
    promptKy: 'Бул кызыл көйнөктөр бүгүн арзандатылган.',
    options: ['rote', 'roten', 'roter'],
    answer: 'roten',
    skill: 'grammar',
    concept: 'a2-adjektivendungen-definit',
    why: s(
      'Kleider — множественное число. После diese во множественном числе окончание всегда -en: diese roten Kleider.',
      'Kleider — көптүк сан. Көптүк санда diese сөзүнөн кийин аякталыш ар дайым -en: diese roten Kleider.',
    ),
  },
  {
    id: 'a2-ft-15-03',
    prompt: 'Dieser ___ Pullover passt mir nicht.',
    promptRu: 'Этот зелёный свитер мне не подходит.',
    promptKy: 'Бул жашыл жемпир мага туура келбейт.',
    options: ['grünen', 'grüner', 'grüne'],
    answer: 'grüne',
    skill: 'grammar',
    concept: 'a2-adjektivendungen-definit',
    why: s(
      'После dieser (мужской род, Nominativ) прилагательное получает -e: dieser grüne Pullover. Окончание -er было бы после ein-: ein grüner Pullover.',
      'dieser (эркек жынс, Nominativ) сөзүнөн кийин сын атоочко -e кошулат: dieser grüne Pullover. -er аякталышы ein- сөзүнөн кийин болмок: ein grüner Pullover.',
    ),
  },
  {
    id: 'a2-ft-15-04',
    prompt: 'Wir brauchen drei ___ Milch.',
    promptRu: 'Нам нужно три литра молока.',
    promptKy: 'Бизге үч литр сүт керек.',
    options: ['Liters', 'Liter', 'Litern'],
    answer: 'Liter',
    skill: 'grammar',
    concept: 'a2-mengen-indefinitpronomen',
    why: s(
      'Мера мужского рода после числа остаётся без -s и без окончания: drei Liter. Дальше идёт существительное Milch без артикля.',
      'Эркек жынстагы өлчөм санактан кийин -s жана аякталышсыз калат: drei Liter. Андан кийин артикльсиз Milch зат атоочу келет.',
    ),
  },
  {
    id: 'a2-ft-15-05',
    prompt: 'Haben Sie einen Mantel in Größe 38? – Nein, leider habe ich ___.',
    promptRu: 'У вас есть пальто размера 38? — Нет, к сожалению, у меня нет.',
    promptKy: 'Сизде 38-өлчөмдөгү пальто барбы? — Жок, тилекке каршы, менде жок.',
    options: ['keinen', 'keine', 'welche'],
    answer: 'keinen',
    skill: 'grammar',
    concept: 'a2-mengen-indefinitpronomen',
    why: s(
      'Mantel — мужской род, Akkusativ: einen → keinen. Keine подходит женскому роду и множественному числу, welche — «какой-то, некоторые».',
      'Mantel — эркек жынс, Akkusativ: einen → keinen. Keine аял жынска жана көптүк санга туура келет, welche — «кандайдыр бир, бир нече».',
    ),
  },
  {
    id: 'a2-ft-15-06',
    prompt: 'Wie ___ Brötchen möchten Sie?',
    promptRu: 'Сколько булочек вы хотите?',
    promptKy: 'Канча булочка каалайсыз?',
    options: ['viel', 'vielen', 'viele'],
    answer: 'viele',
    skill: 'grammar',
    concept: 'a2-mengen-indefinitpronomen',
    why: s(
      'Brötchen — исчисляемое существительное во множественном числе, поэтому wie viele. Wie viel — о цене и неисчисляемом: Wie viel kostet das?',
      'Brötchen — көптүк сандагы саналуучу зат атооч, ошондуктан wie viele. Wie viel — баа жана саналбай турган нерсе жөнүндө: Wie viel kostet das?',
    ),
  },
  {
    id: 'a2-ft-15-07',
    prompt: 'Sie möchten im Restaurant eine Suppe bestellen. Was sagen Sie?',
    promptRu: 'Вы хотите заказать в ресторане суп. Что вы скажете?',
    promptKy: 'Сиз ресторанда шорпо заказ бергиңиз келет. Эмне дейсиз?',
    options: ['Ich will Suppe.', 'Ich hätte gern eine Suppe.', 'Geben Sie mir Suppe!'],
    answer: 'Ich hätte gern eine Suppe.',
    skill: 'grammar',
    concept: 'a2-hoefliche-bitten',
    why: s(
      'Вежливый заказ — «Ich hätte gern …» или «Ich möchte …». Ich will и Geben Sie mir … звучат резко.',
      'Сылык заказ — «Ich hätte gern …» же «Ich möchte …». Ich will жана Geben Sie mir … кескин угулат.',
    ),
  },
  {
    id: 'a2-ft-15-08',
    prompt: 'Der Pullover kostet normal 60 Euro, heute nur 40 Euro. Er ist ___.',
    promptRu: 'Свитер обычно стоит 60 евро, сегодня только 40 евро. Он со скидкой.',
    promptKy: 'Жемпир адатта 60 евро турат, бүгүн болгону 40 евро. Ал арзандатылган.',
    options: ['reduziert', 'scharf', 'vegetarisch'],
    answer: 'reduziert',
    skill: 'vocabulary',
    why: s(
      'Если цена снижена, товар reduziert. Scharf — острый, vegetarisch — без мяса и рыбы.',
      'Баа төмөндөсө, буюм reduziert болот. Scharf — ачуу, vegetarisch — эт жана балыксыз.',
    ),
  },
  {
    id: 'a2-ft-15-09',
    prompt: 'Mein Fahrrad ist kaputt. Ich bringe es in die ___.',
    promptRu: 'Мой велосипед сломан. Я отвожу его в мастерскую.',
    promptKy: 'Менин велосипедим бузулган. Мен аны устаканага алып барам.',
    options: ['Reinigung', 'Praxis', 'Werkstatt'],
    answer: 'Werkstatt',
    skill: 'vocabulary',
    why: s(
      'Велосипед чинят в мастерской: die Werkstatt. Die Reinigung — химчистка, die Praxis — кабинет врача.',
      'Велосипедди устаканада оңдошот: die Werkstatt. Die Reinigung — кийим тазалоочу жай, die Praxis — дарыгердин кабинети.',
    ),
  },
  {
    id: 'a2-ft-15-10',
    prompt: 'Welches Wort passt nicht zu „Menü“?',
    promptRu: 'Какое слово не подходит к теме «Меню»?',
    promptKy: '«Меню» темасына кайсы сөз туура келбейт?',
    options: ['die Vorspeise', 'der Friseur', 'der Nachtisch'],
    answer: 'der Friseur',
    skill: 'vocabulary',
    why: s(
      'Die Vorspeise и der Nachtisch — части меню. Der Friseur — парикмахер, это услуга.',
      'Die Vorspeise жана der Nachtisch — менюнун бөлүктөрү. Der Friseur — чач тарач, бул кызмат.',
    ),
  },
  {
    id: 'a2-ft-15-11',
    prompt:
      'Lies die Speisekarte: „Vorspeise: Tomatensuppe 4 Euro (vegetarisch). Hauptspeise: Fisch mit Salat 12 Euro; Nudeln mit Tomatensoße 8 Euro (vegetarisch). Nachtisch: Eis 3 Euro. Gast: Ich esse kein Fleisch und keinen Fisch. Ich möchte eine Hauptspeise und einen Nachtisch.“ Was bestellt der Gast?',
    promptRu: 'Прочитайте меню и слова гостя. Что закажет гость?',
    promptKy: 'Менюну жана конок айткан сөздөрдү окуңуз. Конок эмне заказ берет?',
    options: ['Nudeln mit Tomatensoße und Eis', 'Fisch mit Salat und Eis', 'Tomatensuppe und Fisch mit Salat'],
    answer: 'Nudeln mit Tomatensoße und Eis',
    skill: 'reading',
    why: s(
      'Гость не ест ни мяса, ни рыбы и хочет основное блюдо и десерт. Подходят Nudeln (vegetarisch) и Eis. Fisch отпадает.',
      'Конок эт да, балык да жебейт жана негизги тамак менен таттуу тамак каалайт. Nudeln (vegetarisch) жана Eis туура келет. Fisch туура келбейт.',
    ),
  },
  {
    id: 'a2-ft-15-12',
    prompt:
      'Lies den Prospekt: „Angebote der Woche: Äpfel 1 Kilo 2 Euro. Käse 100 Gramm 1 Euro, ab 300 Gramm nur 2,50 Euro. Wasser 6 Flaschen 3 Euro. Nur bis Samstag. Lieferung ab 30 Euro kostenlos.“ Wie viel kosten 300 Gramm Käse?',
    promptRu: 'Прочитайте проспект. Сколько стоят 300 граммов сыра?',
    promptKy: 'Проспектти окуңуз. 300 грамм сыр канча турат?',
    options: ['3 Euro', '1 Euro', '2,50 Euro'],
    answer: '2,50 Euro',
    skill: 'reading',
    why: s(
      'В проспекте сказано: «ab 300 Gramm nur 2,50 Euro». Значит, 300 граммов стоят 2,50 Euro, а не 3 Euro (3 × 1 Euro).',
      'Проспектте айтылган: «ab 300 Gramm nur 2,50 Euro». Демек, 300 грамм 2,50 Euro турат, 3 Euro эмес (3 × 1 Euro).',
    ),
  },
  {
    id: 'a2-ft-15-13',
    prompt:
      'Lies die Nachricht: „Guten Tag, ich habe gestern bei Ihnen diesen blauen Pullover gekauft. Er ist zu klein. Ich habe die Quittung noch. Kann ich ihn umtauschen?“ Was möchte die Kundin?',
    promptRu: 'Прочитайте сообщение. Чего хочет покупательница?',
    promptKy: 'Билдирүүнү окуңуз. Сатып алуучу эмне каалайт?',
    options: ['Sie möchte den Pullover umtauschen.', 'Sie möchte das Geld für die Reparatur.', 'Sie möchte einen Termin beim Friseur.'],
    answer: 'Sie möchte den Pullover umtauschen.',
    skill: 'reading',
    why: s(
      'Покупательница пишет: «Kann ich ihn umtauschen?». Пуловер мал, чек у неё есть. О ремонте и парикмахере в сообщении ничего нет.',
      'Сатып алуучу жазат: «Kann ich ihn umtauschen?». Жемпир кичине, квитанциясы бар. Билдирүүдө оңдоо жана чач тарач жөнүндө эч нерсе жок.',
    ),
  },
  {
    id: 'a2-ft-15-14',
    prompt:
      'Lies den Dialog: „Kundin: Entschuldigung, ich suche eine Jacke in Größe 38. Verkäufer: Hier sind unsere Jacken. Die rote Jacke ist heute reduziert.“ Was sagt die Kundin höflich?',
    promptRu: 'Прочитайте диалог. Что вежливо скажет покупательница?',
    promptKy: 'Диалогду окуңуз. Сатып алуучу сылык түрдө эмне дейт?',
    options: ['Ich will diese Jacke, gib sie mir.', 'Darf ich die rote Jacke anprobieren?', 'Die Jacke ist nicht schön, ich gehe.'],
    answer: 'Darf ich die rote Jacke anprobieren?',
    skill: 'reading',
    concept: 'a2-hoefliche-bitten',
    why: s(
      'Вежливый вопрос — «Darf ich … anprobieren?». Остальные ответы резкие (Ich will …, gib sie mir) или не продолжают разговор.',
      'Сылык суроо — «Darf ich … anprobieren?». Калган жооптор кескин (Ich will …, gib sie mir) же сүйлөшүүнү улантпайт.',
    ),
  },
  {
    id: 'a2-ft-15-15',
    prompt:
      'Lies die Info: „Reparaturservice: Uhren, Fahrräder und Mäntel. Annahme Montag bis Freitag von 9 bis 17 Uhr. Die Reparatur dauert zwei bis drei Tage. Kleine Reparaturen kosten ab 10 Euro.“ Was steht in der Info?',
    promptRu: 'Прочитайте информацию. Что в ней сказано?',
    promptKy: 'Маалыматты окуңуз. Анда эмне айтылган?',
    options: ['Der Service repariert nur Uhren.', 'Der Service ist am Samstag offen.', 'Eine Reparatur dauert zwei bis drei Tage.'],
    answer: 'Eine Reparatur dauert zwei bis drei Tage.',
    skill: 'reading',
    why: s(
      'В информации сказано: «Die Reparatur dauert zwei bis drei Tage». Ремонтируют не только часы, а принимают с понедельника по пятницу.',
      'Маалыматта айтылган: «Die Reparatur dauert zwei bis drei Tage». Саатты гана эмес, оңдошот, ал эми кабыл алуу дүйшөмбүдөн жумага чейин.',
    ),
  },
]
