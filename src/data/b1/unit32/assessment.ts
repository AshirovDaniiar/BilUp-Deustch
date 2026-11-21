import type { Exercise, L10n } from '../../types'
import type { A2TestQuestion, L10nStrict } from '../../a2/types'
import type { B1TestDef } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 32 revision (Wiederholung) exercises, `b1-ex-32-01` … `-10`: 3 fill / 4 choice / 3 order on the two REVISION concepts (Nebensätze im Überblick × 4: um … zu, ob, als, obwohl; Mittelfeld × 4: three
 * word-order items — Satzklammer with pronouns, the modal verb, TeKaMoLo — and one pronoun-order choice), plus 2 RECYCLED items without a concept (↻ Passiv with `gerade` of Unit 31, ↻ relative
 * clause with a preposition of Unit 29). Authored independently of the unit test and of the level assessment: no prompt, sentence or answer is shared. The word-order items have one natural
 * solution (the Mittelfeld allows variants; the items are built so that the learner's likely alternatives break a rule of the unit — D-9). Nothing new is taught here.
 */
export const UNIT_32_EXERCISES: Exercise[] = [
  {
    id: 'b1-ex-32-01',
    type: 'fill',
    unit: 32,
    concept: 'b1-nebensaetze-integration',
    prompt: 'Ich lerne jeden Tag, ___ die Prüfung zu bestehen.',
    promptRu: 'Я учусь каждый день, чтобы сдать экзамен.',
    promptKy: 'Мен экзаменден өтүш үчүн күн сайын окуйм.',
    options: ['um', 'damit', 'weil'],
    answer: 'um',
    why: w(
      'В конце стоит инфинитив с zu, а действует один и тот же человек (я учусь — я хочу сдать): um … zu. Damit и weil требуют придаточной части со спрягаемым глаголом.',
      'Аягында zu менен инфинитив турат жана бир эле адам аракет кылат (мен окуйм — мен өтүүнү каалайм): um … zu. Damit жана weil жакка жараша өзгөргөн этиши бар кошумча бөлүктү талап кылат.',
    ),
  },
  {
    id: 'b1-ex-32-02',
    type: 'choice',
    unit: 32,
    concept: 'b1-nebensaetze-integration',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich weiß nicht, ob er heute kommt.', 'Ich weiß nicht, dass er heute kommt.', 'Ich weiß nicht, ob kommt er heute.'],
    answer: 'Ich weiß nicht, ob er heute kommt.',
    why: w(
      'Для вопроса «да или нет» нужен ob, а глагол стоит в самом конце придаточного. «Dass» вводит утверждение, а в третьем варианте нарушен порядок слов.',
      '«Ооба же жок» суроосу үчүн ob керек, ал эми этиш кошумча бөлүктүн эң аягында турат. «Dass» билдирүүнү киргизет, ал эми үчүнчү вариантта сөздөрдүн ирети бузулган.',
    ),
  },
  {
    id: 'b1-ex-32-03',
    type: 'fill',
    unit: 32,
    concept: 'b1-nebensaetze-integration',
    prompt: '___ ich 2019 in Berlin war, habe ich viel gesehen.',
    promptRu: 'Когда я в 2019 году был в Берлине, я многое увидел.',
    promptKy: '2019-жылы Берлинде болгондо мен көп нерсе көрдүм.',
    options: ['Als', 'Wenn', 'Ob'],
    answer: 'Als',
    why: w(
      'Один раз в прошлом (2019) — als. Wenn — для повторяющегося действия или будущего, ob — «ли».',
      'Өткөндө бир жолу (2019) — als. Wenn — кайталанган аракет же келечек үчүн, ob — «же».',
    ),
  },
  {
    id: 'b1-ex-32-04',
    type: 'choice',
    unit: 32,
    concept: 'b1-nebensaetze-integration',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Obwohl es regnet, gehen wir zum Fest.', 'Obwohl es regnet, aber gehen wir zum Fest.', 'Obwohl es regnet, wir gehen zum Fest.'],
    answer: 'Obwohl es regnet, gehen wir zum Fest.',
    why: w(
      'После придаточного с obwohl главная часть начинается с глагола (gehen wir), слово «aber» не нужно. В третьем варианте глагол стоит не на первом месте.',
      'obwohl менен кошумча бөлүктөн кийин башкы бөлүк этиштен башталат (gehen wir), «aber» керек эмес. Үчүнчү вариантта этиш биринчи орунда турбайт.',
    ),
  },
  {
    id: 'b1-ex-32-05',
    type: 'order',
    unit: 32,
    concept: 'b1-satzbau-mittelfeld',
    prompt: 'Bilde den Satz.',
    promptRu: 'Я отдал это ему вчера.',
    promptKy: 'Мен муну ага кечээ бердим.',
    words: ['gegeben.', 'ihm', 'Ich', 'gestern', 'habe', 'es'],
    answer: 'Ich habe es ihm gestern gegeben.',
    why: w(
      'Habe — на втором месте, Partizip II (gegeben) — в самом конце. В середине сначала местоимения (Akkusativ es перед Dativ ihm), потом время (gestern).',
      'Habe — экинчи орунда, Partizip II (gegeben) — эң аягында. Ортосунда адегенде ат атоочтор (Akkusativ es Dativ ihm дин алдында), андан кийин убакыт (gestern).',
    ),
  },
  {
    id: 'b1-ex-32-06',
    type: 'order',
    unit: 32,
    concept: 'b1-satzbau-mittelfeld',
    prompt: 'Bilde den Satz.',
    promptRu: 'Ему нужно сегодня ещё заполнить бланк.',
    promptKy: 'Ал бүгүн дагы бланкты толтурушу керек.',
    words: ['ausfüllen.', 'Er', 'das', 'noch', 'muss', 'Formular', 'heute'],
    answer: 'Er muss das Formular heute noch ausfüllen.',
    why: w(
      'Модальный глагол muss — на втором месте, инфинитив (ausfüllen) — в самом конце, а всё остальное — между ними: дополнение (das Formular), потом время (heute noch).',
      'Модалдык этиш muss — экинчи орунда, инфинитив (ausfüllen) — эң аягында, калганы алардын ортосунда: толуктоочу (das Formular), андан кийин убакыт (heute noch).',
    ),
  },
  {
    id: 'b1-ex-32-07',
    type: 'order',
    unit: 32,
    concept: 'b1-satzbau-mittelfeld',
    prompt: 'Bilde den Satz.',
    promptRu: 'Мы едем завтра на поезде в Лейпциг.',
    promptKy: 'Биз эртең поезд менен Лейпцигге барабыз.',
    words: ['Leipzig.', 'Zug', 'Wir', 'nach', 'morgen', 'fahren', 'mit', 'dem'],
    answer: 'Wir fahren morgen mit dem Zug nach Leipzig.',
    why: w(
      'Порядок TeKaMoLo: время (morgen), способ (mit dem Zug), место (nach Leipzig). Глагол fahren — на втором месте.',
      'TeKaMoLo иреттери: убакыт (morgen), ыкма (mit dem Zug), жер (nach Leipzig). Fahren этиши — экинчи орунда.',
    ),
  },
  {
    id: 'b1-ex-32-08',
    type: 'choice',
    unit: 32,
    concept: 'b1-satzbau-mittelfeld',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich gebe es ihm.', 'Ich gebe ihm es.', 'Ich ihm gebe es.'],
    answer: 'Ich gebe es ihm.',
    why: w(
      'Из двух местоимений Akkusativ (es) стоит раньше Dativ (ihm), а глагол — на втором месте.',
      'Эки ат атоочтун Akkusativи (es) Dativден (ihm) мурун турат, ал эми этиш — экинчи орунда.',
    ),
  },
  {
    id: 'b1-ex-32-09',
    type: 'fill',
    unit: 32,
    prompt: 'Das Formular ___ gerade ausgefüllt.',
    promptRu: 'Бланк сейчас заполняется.',
    promptKy: 'Бланк азыр толтурулуп жатат.',
    options: ['wird', 'ist', 'hat'],
    answer: 'wird',
    why: w(
      '↻ Юнит 31: слово gerade показывает процесс, который идёт сейчас: werden + Partizip II. Ist ausgefüllt описывало бы готовый результат.',
      '↻ 31-бөлүм: gerade сөзү азыр жүрүп жаткан процессти көрсөтөт: werden + Partizip II. Ist ausgefüllt даяр жыйынтыкты сүрөттөмөк.',
    ),
  },
  {
    id: 'b1-ex-32-10',
    type: 'choice',
    unit: 32,
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Das ist der Kollege, mit dem ich arbeite.', 'Das ist der Kollege, mit den ich arbeite.', 'Das ist der Kollege, den ich mit arbeite.'],
    answer: 'Das ist der Kollege, mit dem ich arbeite.',
    why: w(
      '↻ Юнит 29: предлог стоит перед относительным местоимением, а mit требует Dativ: mit dem. В других вариантах неверны падеж или место предлога.',
      '↻ 29-бөлүм: предлог байланыш сөзүнүн алдында турат, ал эми mit Dativди талап кылат: mit dem. Башка варианттарда жалгоо же предлогдун орду туура эмес.',
    ),
  },
]

/** Test definition `unit-32` (kind topic, 15 questions). */
export const UNIT_32_TEST: B1TestDef = {
  id: 'unit-32',
  title: s('Итоговый тест: юнит 32', 'Жыйынтыктоочу тест: 32-бөлүм'),
  kind: 'topic',
  level: 'B1',
  unit: 32,
  size: 15,
}

/**
 * Unit 32 final test, `b1-ft-32-01` … `-15`. Composition (curriculum v2 §7.2): 8 grammar (3 Nebensätze im Überblick, 3 Mittelfeld — two ordering questions and one gap on the Satzklammer —, 2 recycled ↻:
 * sobald of Unit 28 and Plusquamperfekt / nachdem of Unit 29), 3 vocabulary, 4 reading, 0 listening — listening items enter a test only after the text-to-speech playback has been verified on real
 * devices. Reading items carry the German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate only the instruction and the question. All texts are fictional. This is a knowledge check of
 * the unit (70 % pass rule), separate from the indicative level assessment `level-b1`. Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_32_FINAL: A2TestQuestion[] = [
  {
    id: 'b1-ft-32-01',
    prompt: 'Ich bleibe zu Hause, ___ ich krank bin.',
    promptRu: 'Я остаюсь дома, потому что я болен.',
    promptKy: 'Мен ооруп калгандыктан үйдө калам.',
    options: ['weil', 'dass', 'ob'],
    answer: 'weil',
    skill: 'grammar',
    concept: 'b1-nebensaetze-integration',
    why: s(
      'Причина — weil, а глагол (bin) стоит в самом конце. Dass вводит утверждение, ob — вопрос «да или нет».',
      'Себеп — weil, ал эми этиш (bin) эң аягында турат. Dass билдирүүнү киргизет, ob — «ооба же жок» суроосун.',
    ),
  },
  {
    id: 'b1-ft-32-02',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich lerne, damit ich bestehe die Prüfung.', 'Ich lerne, damit ich die Prüfung bestehe.', 'Ich lerne, damit bestehe ich die Prüfung.'],
    answer: 'Ich lerne, damit ich die Prüfung bestehe.',
    skill: 'grammar',
    concept: 'b1-nebensaetze-integration',
    why: s(
      'В придаточном с damit спрягаемый глагол (bestehe) стоит в самом конце, после дополнения. В других вариантах он стоит раньше.',
      'damit менен кошумча бөлүктө жакка жараша өзгөргөн этиш (bestehe) толуктоочудан кийин эң аягында турат. Башка варианттарда ал эртерээк турат.',
    ),
  },
  {
    id: 'b1-ft-32-03',
    prompt: 'Ich weiß nicht, ___ er heute kommt oder morgen.',
    promptRu: 'Я не знаю, придёт ли он сегодня или завтра.',
    promptKy: 'Ал бүгүн келеби же эртеңби, билбейм.',
    options: ['dass', 'weil', 'ob'],
    answer: 'ob',
    skill: 'grammar',
    concept: 'b1-nebensaetze-integration',
    why: s(
      'Здесь вопрос («сегодня или завтра?»): нужен ob. Dass вводит утверждение, weil — причину.',
      'Бул жерде суроо («бүгүнбү же эртеңби?»): ob керек. Dass билдирүүнү, weil — себепти киргизет.',
    ),
  },
  {
    id: 'b1-ft-32-04',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich habe gezeigt es ihr heute.', 'Ich habe es ihr heute gezeigt.', 'Ich habe ihr es heute gezeigt.'],
    answer: 'Ich habe es ihr heute gezeigt.',
    skill: 'grammar',
    concept: 'b1-satzbau-mittelfeld',
    why: s(
      'Partizip II (gezeigt) — в самом конце, а из двух местоимений Akkusativ (es) стоит раньше Dativ (ihr).',
      'Partizip II (gezeigt) — эң аягында, ал эми эки ат атоочтун Akkusativи (es) Dativден (ihr) мурун турат.',
    ),
  },
  {
    id: 'b1-ft-32-05',
    prompt: 'Welcher Satz folgt der Reihenfolge Zeit – Art und Weise – Ort?',
    promptRu: 'Какое предложение следует порядку «время — способ — место»?',
    promptKy: 'Кайсы сүйлөм «убакыт — ыкма — жер» иретине ылайык?',
    options: ['Sie fliegt im Juli mit dem Flugzeug nach Wien.', 'Sie fliegt nach Wien mit dem Flugzeug im Juli.', 'Sie fliegt mit dem Flugzeug im Juli nach Wien.'],
    answer: 'Sie fliegt im Juli mit dem Flugzeug nach Wien.',
    skill: 'grammar',
    concept: 'b1-satzbau-mittelfeld',
    why: s(
      'TeKaMoLo: Temporal (morgen), Modal (mit dem Zug), Lokal (nach Leipzig). В других вариантах порядок нарушен.',
      'TeKaMoLo: Temporal (morgen), Modal (mit dem Zug), Lokal (nach Leipzig). Башка варианттарда иреттери бузулган.',
    ),
  },
  {
    id: 'b1-ft-32-06',
    prompt: 'Er muss das Formular heute noch ___.',
    promptRu: 'Ему нужно сегодня ещё заполнить бланк.',
    promptKy: 'Ал бүгүн дагы бланкты толтурушу керек.',
    options: ['ausgefüllt', 'ausfüllt', 'ausfüllen'],
    answer: 'ausfüllen',
    skill: 'grammar',
    concept: 'b1-satzbau-mittelfeld',
    why: s(
      'После модального глагола (muss) в самом конце стоит инфинитив: ausfüllen. Partizip II и форма er/sie/es здесь не подходят.',
      'Модалдык этиштен (muss) кийин эң аягында инфинитив турат: ausfüllen. Partizip II жана er/sie/es формасы бул жерге туура келбейт.',
    ),
  },
  {
    id: 'b1-ft-32-07',
    prompt: 'Sobald der Kurs zu Ende ___, schreibe ich meine Bewerbung.',
    promptRu: 'Как только курс закончится, я напишу своё заявление.',
    promptKy: 'Курс бүтөөр замат мен арызымды жазам.',
    options: ['ist', 'war', 'wäre'],
    answer: 'ist',
    skill: 'grammar',
    concept: 'b1-falls-sobald-solange',
    why: s(
      '↻ Юнит 28: после sobald глагол стоит в конце, и для будущего события используется Präsens: «zu Ende ist». War — прошедшее, wäre — Konjunktiv II.',
      '↻ 28-бөлүм: sobald дан кийин этиш аягында турат, жана келечектеги окуя үчүн Präsens колдонулат: «zu Ende ist». War — өткөн чак, wäre — Konjunktiv II.',
    ),
  },
  {
    id: 'b1-ft-32-08',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Nachdem ich hatte den Anschluss verpasst, habe ich gewartet.',
      'Nachdem ich den Anschluss verpasst hatte, habe ich gewartet.',
      'Nachdem hatte ich den Anschluss verpasst, habe ich gewartet.',
    ],
    answer: 'Nachdem ich den Anschluss verpasst hatte, habe ich gewartet.',
    skill: 'grammar',
    concept: 'b1-plusquamperfekt-nachdem',
    why: s(
      '↻ Юнит 29: в придаточном с nachdem Partizip II (verpasst) стоит перед hatte в самом конце. В других вариантах hatte стоит слишком рано.',
      '↻ 29-бөлүм: nachdem менен кошумча бөлүктө Partizip II (verpasst) эң аягындагы hatte дан мурун турат. Башка варианттарда hatte өтө эрте турат.',
    ),
  },
  {
    id: 'b1-ft-32-09',
    prompt: 'Ich schreibe die wichtigsten Wörter für meinen Vortrag auf Karten. Das sind meine ___.',
    promptRu: 'Я пишу самые важные слова для выступления на карточках. Это мои ___.',
    promptKy: 'Мен чыгуум үчүн эң маанилүү сөздөрдү карталарга жазам. Булар менин ___.',
    options: ['Einwände', 'Lösungen', 'Stichpunkte'],
    answer: 'Stichpunkte',
    skill: 'vocabulary',
    why: s(
      'Опорные слова для выступления — Stichpunkte. Einwände — возражения, Lösungen — решения.',
      'Чыгуу үчүн тянак сөздөр — Stichpunkte. Einwände — каршы пикирлер, Lösungen — чечимдер.',
    ),
  },
  {
    id: 'b1-ft-32-10',
    prompt: 'Am Kursende schaue ich zurück und ziehe eine ___.',
    promptRu: 'В конце курса я оглядываюсь назад и подвожу ___.',
    promptKy: 'Курстун аягында мен артка карап, ___ чыгарам.',
    options: ['Bilanz', 'Probe', 'Auswahl'],
    answer: 'Bilanz',
    skill: 'vocabulary',
    why: s(
      'Устойчивое выражение: eine Bilanz ziehen — «подводить итоги». Probe — репетиция, Auswahl — выбор.',
      'Туруктуу туюндурма: eine Bilanz ziehen — «жыйынтык чыгаруу». Probe — даярдык, Auswahl — тандоо.',
    ),
  },
  {
    id: 'b1-ft-32-11',
    prompt: 'Im Vortrag gibt es drei Teile: die Einleitung, den Hauptteil und den ___.',
    promptRu: 'В выступлении три части: вступление, основная часть и ___.',
    promptKy: 'Чыгууда үч бөлүк бар: киришүү, негизги бөлүк жана ___.',
    options: ['Einwand', 'Schluss', 'Hinweis'],
    answer: 'Schluss',
    skill: 'vocabulary',
    why: s(
      'Последняя часть выступления — der Schluss (заключение). Einwand — возражение, Hinweis — указание.',
      'Чыгуунун акыркы бөлүгү — der Schluss (жыйынтык). Einwand — каршы пикир, Hinweis — көрсөтмө.',
    ),
  },
  {
    id: 'b1-ft-32-12',
    prompt:
      'Lies die Nachricht (erfunden): „Liebe Gruppe, das Abschlussfest ist am Samstag um 18 Uhr im Kursraum. Bitte sagen Sie bis Donnerstag, was Sie mitbringen. Getränke und Kuchen sind willkommen. Wer nicht kommen kann, schreibt kurz eine Nachricht.“ Wann ist das Abschlussfest?',
    promptRu: 'Прочитайте сообщение (вымышленное). Когда прощальный праздник?',
    promptKy: 'Билдирүүнү окуңуз (ойдон чыгарылган). Коштошуу майрамы качан?',
    options: ['Am Freitag um 18 Uhr.', 'Am Samstag um 16 Uhr.', 'Am Samstag um 18 Uhr.'],
    answer: 'Am Samstag um 18 Uhr.',
    skill: 'reading',
    why: s(
      'В сообщении: «am Samstag um 18 Uhr». Другие дни и время в тексте не названы.',
      'Билдирүүдө: «am Samstag um 18 Uhr». Башка күндөр жана убакыт текстте аталган эмес.',
    ),
  },
  {
    id: 'b1-ft-32-13',
    prompt:
      'Lies die Nachricht (erfunden): „Liebe Gruppe, das Abschlussfest ist am Samstag um 18 Uhr im Kursraum. Bitte sagen Sie bis Donnerstag, was Sie mitbringen. Getränke und Kuchen sind willkommen. Wer nicht kommen kann, schreibt kurz eine Nachricht.“ Was soll man bis Donnerstag sagen?',
    promptRu: 'Прочитайте сообщение (вымышленное). Что нужно сказать до четверга?',
    promptKy: 'Билдирүүнү окуңуз (ойдон чыгарылган). Бейшембиге чейин эмнени айтуу керек?',
    options: ['Wer die Einladung schreibt.', 'Was man mitbringt.', 'Wer den Raum bezahlt.'],
    answer: 'Was man mitbringt.',
    skill: 'reading',
    why: s(
      'В сообщении: «Bitte sagen Sie bis Donnerstag, was Sie mitbringen». О приглашении и об оплате зала там не сказано.',
      'Билдирүүдө: «Bitte sagen Sie bis Donnerstag, was Sie mitbringen». Чакыруу жана залды төлөө жөнүндө анда айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-32-14',
    prompt:
      'Lies den Absatz (erfunden): „Obwohl Aigerim viel gearbeitet hat, hat sie jeden Abend gelernt. Sie schreibt neue Wörter auf Karten, damit sie sie nicht vergisst. Am Wochenende übt sie mit einer Freundin, die schon lange in Brunnenau wohnt.“ Warum schreibt Aigerim Wörter auf Karten?',
    promptRu: 'Прочитайте абзац (вымышленный). Почему Айгерим пишет слова на карточках?',
    promptKy: 'Абзацты окуңуз (ойдон чыгарылган). Айгерим сөздөрдү эмне үчүн карталарга жазат?',
    options: ['Damit sie sie nicht vergisst.', 'Weil sie ein Referat hält.', 'Um ein Spiel zu machen.'],
    answer: 'Damit sie sie nicht vergisst.',
    skill: 'reading',
    why: s(
      'В тексте: «damit sie sie nicht vergisst». О докладе и об игре там не сказано.',
      'Текстте: «damit sie sie nicht vergisst». Баяндама жана оюн жөнүндө анда айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-32-15',
    prompt:
      'Lies den Absatz (erfunden): „Obwohl Aigerim viel gearbeitet hat, hat sie jeden Abend gelernt. Sie schreibt neue Wörter auf Karten, damit sie sie nicht vergisst. Am Wochenende übt sie mit einer Freundin, die schon lange in Brunnenau wohnt.“ Mit wem übt sie am Wochenende?',
    promptRu: 'Прочитайте абзац (вымышленный). С кем она занимается в выходные?',
    promptKy: 'Абзацты окуңуз (ойдон чыгарылган). Ал дем алыш күндөрү ким менен машыгат?',
    options: ['Mit ihrer Lehrerin.', 'Mit ihrem Bruder.', 'Mit einer Freundin.'],
    answer: 'Mit einer Freundin.',
    skill: 'reading',
    why: s(
      'В тексте: «übt sie mit einer Freundin». Об учительнице и брате ничего не сказано.',
      'Текстте: «übt sie mit einer Freundin». Мугалим жана ага-ини жөнүндө эч нерсе айтылган эмес.',
    ),
  },
]
