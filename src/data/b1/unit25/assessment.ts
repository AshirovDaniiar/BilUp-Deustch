import type { Exercise, L10n } from '../../types'
import type { A2TestQuestion, L10nStrict } from '../../a2/types'
import type { B1TestDef } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 25 revision (Wiederholung) exercises, `b1-ex-25-01` … `-10`: 3 fill / 5 choice / 2 order on the unit's two concepts (Konjunktiv II × 4, reflexive verbs
 * with Dativ × 4), plus 2 RECYCLED items (↻ A2 Imperativ, ↻ Unit 24 Passiv) without a concept of this unit — the spaced-revision part. Exercise 04 is a
 * TEXT-level `choice` item (three sentences). Authored independently of the final test: no prompt, sentence or answer is shared.
 * The reflexive items use only the closed list of 10 verbs; the receptive constructions of Units 22–24 never appear in a gap or a word order.
 */
export const UNIT_25_EXERCISES: Exercise[] = [
  {
    id: 'b1-ex-25-01',
    type: 'fill',
    unit: 25,
    concept: 'b1-konjunktiv2-ratschlaege',
    prompt: 'An deiner Stelle ___ ich früher ins Bett gehen.',
    promptRu: 'На твоём месте я бы раньше ложился спать.',
    promptKy: 'Сенин ордуңда мен эртерээк жатмакмын.',
    options: ['würde', 'werde', 'würden'],
    answer: 'würde',
    why: w(
      'Совет «на твоём месте» — Konjunktiv II: würde (ich würde) + инфинитив в конце. Werde — будущее время, würden — форма для wir/sie.',
      'Кеңеш «сенин ордуңда» — Konjunktiv II: würde (ich würde) + аягында инфинитив. werde — келечек чак, würden — wir/sie формасы.',
    ),
  },
  {
    id: 'b1-ex-25-02',
    type: 'choice',
    unit: 25,
    concept: 'b1-konjunktiv2-ratschlaege',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Du solltest mehr Gemüse essen.', 'Du solltest zu mehr Gemüse essen.', 'Du solltest mehr Gemüse isst.'],
    answer: 'Du solltest mehr Gemüse essen.',
    why: w(
      'После solltest (как после других модальных глаголов) стоит инфинитив без zu, и он — в самом конце: …, mehr Gemüse essen.',
      'solltest этишинен кийин (башка модаль этиштер сыяктуу) zu жок инфинитив турат жана ал эң аягында: …, mehr Gemüse essen.',
    ),
  },
  {
    id: 'b1-ex-25-03',
    type: 'order',
    unit: 25,
    concept: 'b1-konjunktiv2-ratschlaege',
    prompt: 'Bilde den Satz.',
    promptRu: 'Ты мог бы вечером погулять.',
    promptKy: 'Сен кечинде сейилдеп келишиң мүмкүн.',
    words: ['machen.', 'Du', 'einen', 'abends', 'Spaziergang', 'könntest'],
    answer: 'Du könntest abends einen Spaziergang machen.',
    why: w(
      'Könntest стоит на втором месте после Du, а инфинитив (machen) — в самом конце предложения, без zu.',
      'Könntest Du сөзүнөн кийин экинчи орунда турат, ал эми инфинитив (machen) — сүйлөмдүн эң аягында, zu жок.',
    ),
  },
  {
    id: 'b1-ex-25-04',
    type: 'choice',
    unit: 25,
    concept: 'b1-konjunktiv2-ratschlaege',
    prompt: 'Welcher kleine Text ist richtig?',
    promptRu: 'Какой короткий текст составлен правильно?',
    promptKy: 'Кайсы кыска текст туура түзүлгөн?',
    options: [
      'An deiner Stelle ich würde mit ihm reden. Du solltest ehrlich sein. Es wäre gut, ruhig zu bleiben.',
      'An deiner Stelle würde ich mit ihm reden. Du solltest ehrlich sein. Es wäre gut, ruhig zu bleiben.',
      'An deiner Stelle würde ich mit ihm reden. Du solltest ehrlich zu sein. Es wäre gut, ruhig zu bleiben.',
    ],
    answer: 'An deiner Stelle würde ich mit ihm reden. Du solltest ehrlich sein. Es wäre gut, ruhig zu bleiben.',
    why: w(
      'В первом тексте в первом предложении неверный порядок слов («ich würde» вместо «würde ich»). В третьем тексте после solltest стоит лишнее zu. Во втором тексте всё верно: «würde ich», «solltest … sein», «wäre gut, … zu bleiben».',
      'Биринчи текстте биринчи сүйлөмдө сөздөрдүн ирети туура эмес («ich würde» «würde ich» ордуна). Үчүнчү текстте solltest этишинен кийин ашыкча zu бар. Экинчи текстте баары туура: «würde ich», «solltest … sein», «wäre gut, … zu bleiben».',
    ),
  },
  {
    id: 'b1-ex-25-05',
    type: 'fill',
    unit: 25,
    concept: 'b1-reflexive-dativ',
    prompt: 'Ich putze ___ jeden Abend die Zähne.',
    promptRu: 'Я чищу зубы каждый вечер.',
    promptKy: 'Мен күн сайын кечинде тишимди тазалайм.',
    options: ['mir', 'mich', 'sich'],
    answer: 'mir',
    why: w(
      'В предложении есть Akkusativ-дополнение (die Zähne), поэтому «себе» — в Dativ: ich → mir. Mich подошло бы без дополнения, sich — для er/sie/es.',
      'Сүйлөмдө Akkusativ толуктоочу бар (die Zähne), ошондуктан «өзүмө» — Dativде: ich → mir. mich толуктоочу жок болгондо туура келмек, sich — er/sie/es үчүн.',
    ),
  },
  {
    id: 'b1-ex-25-06',
    type: 'choice',
    unit: 25,
    concept: 'b1-reflexive-dativ',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Hast du dir beim Sport wehgetan?', 'Hast du dich beim Sport wehgetan?', 'Hast du ihr beim Sport wehgetan?'],
    answer: 'Hast du dir beim Sport wehgetan?',
    why: w(
      'Выражение «sich wehtun» требует Dativ: к du подходит dir. Dich (Akkusativ) здесь неверно, ihr — это уже другой человек.',
      '«sich wehtun» туюндурмасы Dativди талап кылат: du үчүн dir туура келет. dich (Akkusativ) бул жерде туура эмес, ihr — башка адам.',
    ),
  },
  {
    id: 'b1-ex-25-07',
    type: 'order',
    unit: 25,
    concept: 'b1-reflexive-dativ',
    prompt: 'Bilde den Satz.',
    promptRu: 'В выходные она выделяет себе много времени.',
    promptKy: 'Дем алыш күндөрү ал өзүнө көп убакыт бөлөт.',
    words: ['Zeit.', 'sich', 'Sie', 'viel', 'Wochenende', 'am', 'nimmt'],
    answer: 'Sie nimmt sich am Wochenende viel Zeit.',
    why: w(
      'Sich nehmen + Zeit: у sie форма Dativ — sich. Глагол nimmt стоит на втором месте, а Zeit (Akkusativ) — в конце.',
      'Sich Zeit nehmen: sie үчүн Dativ формасы — sich. nimmt этиши экинчи орунда турат, ал эми Zeit (Akkusativ) — аягында.',
    ),
  },
  {
    id: 'b1-ex-25-08',
    type: 'choice',
    unit: 25,
    concept: 'b1-reflexive-dativ',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Wir merken uns den Weg.', 'Wir merken mich den Weg.', 'Wir merken sich den Weg.'],
    answer: 'Wir merken uns den Weg.',
    why: w(
      'К wir подходит uns (Dativ и Akkusativ одинаковы), а «den Weg» — Akkusativ-дополнение: «sich etwas merken».',
      'wir үчүн uns туура келет (Dativ жана Akkusativ бирдей), ал эми «den Weg» — Akkusativ толуктоочу: «sich etwas merken».',
    ),
  },
  // ↻ Wiederholung (recycled, spaced revision; no concept of this unit)
  {
    id: 'b1-ex-25-09',
    type: 'fill',
    unit: 25,
    prompt: 'Anna, ___ bitte mehr Obst!',
    promptRu: 'Анна, ешь, пожалуйста, больше фруктов!',
    promptKy: 'Анна, сураныч, көбүрөөк жемиш же!',
    options: ['iss', 'isst', 'essen'],
    answer: 'iss',
    why: w(
      '↻ A2: Imperativ для «du» — основа глагола. У essen меняется гласная: du isst → iss! Isst — форма для ihr, essen — для Sie / wir.',
      '↻ A2: «du» үчүн Imperativ — этиштин уңгусу. essen этишинде үндүү өзгөрөт: du isst → iss! isst — ihr формасы, essen — Sie / wir үчүн.',
    ),
  },
  {
    id: 'b1-ex-25-10',
    type: 'choice',
    unit: 25,
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Die Praxis wird um acht Uhr geöffnet.',
      'Die Praxis wird um acht Uhr öffnen.',
      'Die Praxis werden um acht Uhr geöffnet.',
    ],
    answer: 'Die Praxis wird um acht Uhr geöffnet.',
    why: w(
      '↻ Юнит 24: Passiv Präsens = wird + Partizip II в конце. «Die Praxis» — единственное число (wird), а не werden; инфинитив вместо Partizip II не подходит.',
      '↻ 24-бөлүм: Passiv Präsens = wird + аягында Partizip II. «Die Praxis» — жекелик сан (wird), werden эмес; Partizip II ордуна инфинитив туура келбейт.',
    ),
  },
]

/** Test definition `unit-25` (kind topic, 15 questions). */
export const UNIT_25_TEST: B1TestDef = {
  id: 'unit-25',
  title: s('Итоговый тест: юнит 25', 'Жыйынтыктоочу тест: 25-бөлүм'),
  kind: 'topic',
  level: 'B1',
  unit: 25,
  size: 15,
}

/**
 * Unit 25 final test, `b1-ft-25-01` … `-15`. Composition (curriculum v2 §7.2): 8 grammar (3 on Konjunktiv II, 2 on reflexive verbs with Dativ, 3 recycled ↻:
 * Imperativ and sollen of A2 Unit 14, Passiv of Unit 24), 3 vocabulary, 4 reading, 0 listening — listening items enter a test only after the text-to-speech
 * playback has been verified on real devices. Reading items carry the German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate only the
 * instruction and the question. Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_25_FINAL: A2TestQuestion[] = [
  {
    id: 'b1-ft-25-01',
    prompt: 'Sehr höflich gefragt: ___ Sie am Montag einen Termin frei?',
    promptRu: 'Очень вежливый вопрос: У вас есть свободное время в понедельник?',
    promptKy: 'Абдан сылык суроо: Дүйшөмбүдө бош убактыңыз барбы?',
    options: ['Hätten', 'Haben', 'Hatten'],
    answer: 'Hätten',
    skill: 'grammar',
    concept: 'b1-konjunktiv2-ratschlaege',
    why: s(
      'Для очень вежливого вопроса нужен Konjunktiv II: Hätten Sie …? Haben Sie — нейтральный вопрос, Hatten — Präteritum.',
      'Абдан сылык суроо үчүн Konjunktiv II керек: Hätten Sie …? Haben Sie — бейтарап суроо, Hatten — Präteritum.',
    ),
  },
  {
    id: 'b1-ft-25-02',
    prompt: 'Welcher Satz ist ein freundlicher Rat?',
    promptRu: 'Какое предложение — дружеский совет?',
    promptKy: 'Кайсы сүйлөм достук кеңеш?',
    options: ['Du sollst mehr schlafen!', 'Du solltest vielleicht mehr schlafen.', 'Du schläfst mehr!'],
    answer: 'Du solltest vielleicht mehr schlafen.',
    skill: 'grammar',
    concept: 'b1-konjunktiv2-ratschlaege',
    why: s(
      'Мягкий совет — это Konjunktiv II: solltest (+ vielleicht). «Du sollst …» и «Du schläfst mehr!» звучат как указание.',
      'Жумшак кеңеш — Konjunktiv II: solltest (+ vielleicht). «Du sollst …» жана «Du schläfst mehr!» көрсөтмө сыяктуу угулат.',
    ),
  },
  {
    id: 'b1-ft-25-03',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'An deiner Stelle würde ich zum Arzt gehe.',
      'An deiner Stelle ich würde zum Arzt gehen.',
      'An deiner Stelle würde ich zum Arzt gehen.',
    ],
    answer: 'An deiner Stelle würde ich zum Arzt gehen.',
    skill: 'grammar',
    concept: 'b1-konjunktiv2-ratschlaege',
    why: s(
      'Würde стоит перед ich, а инфинитив gehen — в самом конце. «gehe» — спрягаемая форма, а «ich würde» после вводной части нарушает порядок слов.',
      'würde ich сөзүнүн алдында турат, ал эми инфинитив gehen — эң аягында. «gehe» — жакка жараша өзгөргөн форма, ал эми киришүү бөлүгүнөн кийинки «ich würde» сөздөрдүн иретин бузат.',
    ),
  },
  {
    id: 'b1-ft-25-04',
    prompt: 'Wann nimmst du ___ endlich Zeit für Sport?',
    promptRu: 'Когда ты наконец выделишь себе время на спорт?',
    promptKy: 'Спортко эң акыры качан өзүңө убакыт бөлөсүң?',
    options: ['dich', 'dir', 'mir'],
    answer: 'dir',
    skill: 'grammar',
    concept: 'b1-reflexive-dativ',
    why: s(
      'Sich Zeit nehmen: «Zeit» — Akkusativ, поэтому «себе» в Dativ: к du подходит dir. Dich — Akkusativ, mir — для ich.',
      'Sich Zeit nehmen: «Zeit» — Akkusativ, ошондуктан «өзүңө» Dativде: du үчүн dir туура келет. dich — Akkusativ, mir — ich үчүн.',
    ),
  },
  {
    id: 'b1-ft-25-05',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Er hat sich den Fuß gebrochen.', 'Er hat ihn den Fuß gebrochen.', 'Er hat mich den Fuß gebrochen.'],
    answer: 'Er hat sich den Fuß gebrochen.',
    skill: 'grammar',
    concept: 'b1-reflexive-dativ',
    why: s(
      'Он сломал СЕБЕ ногу: возвратное местоимение er → sich (Dativ), а «den Fuß» — Akkusativ-дополнение. Ihn и mich не возвратные формы для er.',
      'Ал ӨЗҮНҮН буту сынды: sich сыяктуу ат атооч er → sich (Dativ), ал эми «den Fuß» — Akkusativ толуктоочу. ihn жана mich er үчүн sich сыяктуу формалар эмес.',
    ),
  },
  {
    id: 'b1-ft-25-06',
    prompt: 'Mein Arzt sagt, ich ___ viel Wasser trinken.',
    promptRu: 'Мой врач говорит, что я должен пить много воды.',
    promptKy: 'Дарыгерим мен көп суу ичишим керек дейт.',
    options: ['sollen', 'sollst', 'soll'],
    answer: 'soll',
    skill: 'grammar',
    concept: 'a2-sollen-duerfen',
    why: s(
      '↻ A2: указание врача — sollen: ich soll. Sollen — инфинитив и форма wir/sie, sollst — для du.',
      '↻ A2: дарыгердин көрсөтмөсү — sollen: ich soll. sollen — инфинитив жана wir/sie формасы, sollst — du үчүн.',
    ),
  },
  {
    id: 'b1-ft-25-07',
    prompt: 'Bitte ___ Sie hier Platz!',
    promptRu: 'Пожалуйста, садитесь здесь!',
    promptKy: 'Сураныч, бул жерге отуруңуз!',
    options: ['Nehmen', 'Nimm', 'Nehmt'],
    answer: 'Nehmen',
    skill: 'grammar',
    concept: 'a2-imperativ',
    why: s(
      '↻ A2: вежливое обращение «Sie» — Imperativ = инфинитив + Sie: Nehmen Sie Platz! Nimm — для du, Nehmt — для ihr.',
      '↻ A2: сылык кайрылуу «Sie» — Imperativ = инфинитив + Sie: Nehmen Sie Platz! Nimm — du үчүн, Nehmt — ihr үчүн.',
    ),
  },
  {
    id: 'b1-ft-25-08',
    prompt: 'In dieser Praxis ___ Patienten von zwei Ärzten behandelt.',
    promptRu: 'В этой практике пациентов лечат два врача.',
    promptKy: 'Бул практикада бейтаптарды эки дарыгер дарылайт.',
    options: ['wird', 'werden', 'wirst'],
    answer: 'werden',
    skill: 'grammar',
    concept: 'b1-passiv-praesens',
    why: s(
      '↻ Юнит 24: подлежащее «Patienten» — множественное число, значит werden + Partizip II (behandelt). Wird — для единственного числа.',
      '↻ 24-бөлүм: ээси «Patienten» — көптүк сан, демек werden + Partizip II (behandelt). wird — жекелик сан үчүн.',
    ),
  },
  {
    id: 'b1-ft-25-09',
    prompt: 'Nach einem Streit möchten Freunde wieder Frieden haben: Sie wollen sich ___.',
    promptRu: 'После ссоры друзья хотят снова жить в мире: они хотят ___.',
    promptKy: 'Чатактан кийин достор кайра тынчтыкта жашагысы келет: алар ___ каалашат.',
    options: ['trennen', 'einschlafen', 'versöhnen'],
    answer: 'versöhnen',
    skill: 'vocabulary',
    why: s(
      'Помириться после ссоры — sich versöhnen. Sich trennen — расстаться, einschlafen — заснуть.',
      'Чатактан кийин элдешүү — sich versöhnen. sich trennen — ажырашуу, einschlafen — уктап кетүү.',
    ),
  },
  {
    id: 'b1-ft-25-10',
    prompt: 'Der Hausarzt gibt Ihnen eine ___ zum Spezialisten.',
    promptRu: 'Семейный врач выдаёт вам ___ к специалисту.',
    promptKy: 'Үй-бүлөлүк дарыгер сизге адиске ___ берет.',
    options: ['Überweisung', 'Ernährung', 'Gewohnheit'],
    answer: 'Überweisung',
    skill: 'vocabulary',
    why: s(
      'Документ от семейного врача для визита к специалисту — Überweisung (направление). Ernährung — питание, Gewohnheit — привычка.',
      'Адиске баруу үчүн үй-бүлөлүк дарыгердин документи — Überweisung (жолдомо). Ernährung — тамактануу, Gewohnheit — адат.',
    ),
  },
  {
    id: 'b1-ft-25-11',
    prompt: 'Wer ruhig bleibt und selten Stress hat, ist oft ___.',
    promptRu: 'Кто сохраняет спокойствие и редко испытывает стресс, часто ___.',
    promptKy: 'Токтоо болуп, сейрек стресс алган адам көбүнчө ___.',
    options: ['einsam', 'ausgeglichen', 'ungesund'],
    answer: 'ausgeglichen',
    skill: 'vocabulary',
    why: s(
      'Спокойный человек без частого стресса — ausgeglichen (уравновешенный). Einsam — одинокий, ungesund — вредный для здоровья.',
      'Токтоо жана стресси аз адам — ausgeglichen (тең салмактуу). einsam — жалгыз калган, ungesund — ден соолукка зыяндуу.',
    ),
  },
  {
    id: 'b1-ft-25-12',
    prompt:
      'Lies den Text: „Seit einem Monat esse ich ausgewogener. Ich koche mehr selbst, und abends nehme ich mir Zeit zum Entspannen. Ich schlafe jetzt besser und bin tagsüber nicht mehr so müde.“ Was hat sich verändert?',
    promptRu: 'Прочитайте текст. Что изменилось?',
    promptKy: 'Текстти окуңуз. Эмне өзгөрдү?',
    options: ['Die Person arbeitet weniger.', 'Die Person treibt mehr Sport.', 'Die Person schläft besser.'],
    answer: 'Die Person schläft besser.',
    skill: 'reading',
    why: s(
      'В тексте: «Ich schlafe jetzt besser». О сокращении работы и о спорте ничего не сказано.',
      'Текстте: «Ich schlafe jetzt besser». Иштин азайгандыгы жана спорт жөнүндө эч нерсе айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-25-13',
    prompt:
      'Lies die Nachricht: „Sehr geehrte Frau Weber, Ihr Termin am Dienstag fällt leider aus. Hätten Sie am Donnerstag um zehn Uhr Zeit? Bitte rufen Sie uns an. Freundliche Grüße, Praxis Dr. Haas“ Was soll Frau Weber tun?',
    promptRu: 'Прочитайте сообщение. Что должна сделать госпожа Вебер?',
    promptKy: 'Билдирүүнү окуңуз. Вебер айым эмне кылышы керек?',
    options: ['Am Dienstag kommen.', 'Wegen eines neuen Termins anrufen.', 'Ein Rezept abholen.'],
    answer: 'Wegen eines neuen Termins anrufen.',
    skill: 'reading',
    why: s(
      'В сообщении: «Bitte rufen Sie uns an» — нужно позвонить из-за нового времени приёма. Приём во вторник отменён, о рецепте не сказано.',
      'Билдирүүдө: «Bitte rufen Sie uns an» — жаңы кабыл алуу убактысы үчүн чалуу керек. Шейшембидеги кабыл алуу жокко чыгарылган, рецепт жөнүндө айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-25-14',
    prompt:
      'Lies den Text: „Meine Freundin Eva und ich haben uns gestritten, weil sie meine Nachricht falsch verstanden hat. Zuerst war ich wütend, aber dann habe ich sie angerufen. Jetzt haben wir uns versöhnt.“ Was ist passiert?',
    promptRu: 'Прочитайте текст. Что произошло?',
    promptKy: 'Текстти окуңуз. Эмне болду?',
    options: ['Die Freundinnen haben sich wieder versöhnt.', 'Die Freundinnen haben sich getrennt.', 'Eva ist umgezogen.'],
    answer: 'Die Freundinnen haben sich wieder versöhnt.',
    skill: 'reading',
    why: s(
      'В тексте: «Jetzt haben wir uns versöhnt» — подруги помирились. Об отъезде Евы и разрыве дружбы ничего не сказано.',
      'Текстте: «Jetzt haben wir uns versöhnt» — курбулар элдешти. Еванын көчүп кеткени жана достуктун бузулганы жөнүндө айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-25-15',
    prompt:
      'Lies den Text: „Ein Tipp gegen Stress: Mach jeden Tag eine kurze Pause im Freien. Du könntest zehn Minuten gehen oder einfach in den Himmel schauen. Wenn du dich lange sehr schlecht fühlst, sprich bitte mit einem Arzt.“ Was wird empfohlen?',
    promptRu: 'Прочитайте текст. Что рекомендуется?',
    promptKy: 'Текстти окуңуз. Эмне сунушталат?',
    options: ['Mehr Kaffee trinken.', 'Länger arbeiten.', 'Eine kurze Pause im Freien machen.'],
    answer: 'Eine kurze Pause im Freien machen.',
    skill: 'reading',
    why: s(
      'В тексте: «Mach jeden Tag eine kurze Pause im Freien». О кофе и более долгой работе ничего не сказано.',
      'Текстте: «Mach jeden Tag eine kurze Pause im Freien». Кофе жана көбүрөөк иштөө жөнүндө эч нерсе айтылган эмес.',
    ),
  },
]
