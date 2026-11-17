import type { Exercise, L10n } from '../../types'
import type { A2TestDef, A2TestQuestion, L10nStrict } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 17 revision (Wiederholung) exercises, `a2-ex-17-01` … `-08` (3 fill / 3 choice / 2 order; concept 1 × 4, concept 2 × 4 — the Stage 7B plan with two concepts).
 * Authored independently of the final test below: no prompt, sentence or answer is shared. Positions of the correct option: fill 1 / 0 / 2, choice 2 / 0 / 1.
 */
export const UNIT_17_EXERCISES: Exercise[] = [
  {
    id: 'a2-ex-17-01',
    type: 'fill',
    unit: 17,
    concept: 'a2-deshalb-darum',
    prompt: 'Ich habe keine Erfahrung, ___ mache ich ein Praktikum.',
    promptRu: 'У меня нет опыта, поэтому я прохожу практику.',
    promptKy: 'Менде тажрыйба жок, ошондуктан мен практикадан өтөм.',
    options: ['weil', 'deshalb', 'wenn'],
    answer: 'deshalb',
    why: w(
      'Первая часть — причина, вторая — следствие, и глагол mache стоит сразу после слова. Это порядок слов для deshalb. Weil и wenn отправили бы глагол в конец.',
      'Биринчи бөлүк — себеп, экинчиси — натыйжа, ал эми mache этиши ушул сөздөн кийин дароо турат. Бул deshalb үчүн сөз тартиби. weil жана wenn этишти аягына жылдырмак.',
    ),
  },
  {
    id: 'a2-ex-17-02',
    type: 'choice',
    unit: 17,
    concept: 'a2-deshalb-darum',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich bin müde, deshalb ich gehe ins Bett.', 'Ich bin müde, deshalb ich ins Bett gehe.', 'Ich bin müde, deshalb gehe ich ins Bett.'],
    answer: 'Ich bin müde, deshalb gehe ich ins Bett.',
    why: w(
      'После deshalb глагол стоит на втором месте (gehe), а подлежащее (ich) — после него. В конец глагол не уходит.',
      'deshalb сөзүнөн кийин этиш экинчи орунда турат (gehe), ал эми ээ (ich) андан кийин келет. Этиш аягына өтпөйт.',
    ),
  },
  {
    id: 'a2-ex-17-03',
    type: 'order',
    unit: 17,
    concept: 'a2-deshalb-darum',
    prompt: 'Bilde den Satz.',
    promptRu: 'Я хочу работать, поэтому ищу место.',
    promptKy: 'Мен иштегим келет, ошондуктан жумуш издеп жатам.',
    words: ['deshalb', 'Ich', 'Stelle.', 'suche', 'möchte', 'eine', 'arbeiten,', 'ich'],
    answer: 'Ich möchte arbeiten, deshalb suche ich eine Stelle.',
    why: w(
      'Сначала причина (Ich möchte arbeiten), после запятой — deshalb и глагол suche на втором месте, потом подлежащее ich.',
      'Адегенде себеп (Ich möchte arbeiten), үтүрдөн кийин — deshalb жана экинчи орундагы suche этиши, андан кийин ээ ich.',
    ),
  },
  {
    id: 'a2-ex-17-04',
    type: 'choice',
    unit: 17,
    concept: 'a2-deshalb-darum',
    prompt: 'Wie verbindest du die Sätze? „Ich arbeite in Teilzeit.“ – „Ich habe mehr Zeit.“',
    promptRu: 'Как соединить предложения? «Я работаю на неполную ставку». — «У меня больше времени».',
    promptKy: 'Сүйлөмдөрдү кантип байланыштырасың? «Мен толук эмес убакыт иштейм». — «Менин убактым көбүрөөк».',
    options: ['Ich arbeite in Teilzeit, deshalb habe ich mehr Zeit.', 'Ich arbeite in Teilzeit, deshalb ich habe mehr Zeit.', 'Ich arbeite in Teilzeit, weil habe ich mehr Zeit.'],
    answer: 'Ich arbeite in Teilzeit, deshalb habe ich mehr Zeit.',
    why: w(
      'Работа на неполную ставку — причина, больше времени — следствие. Следствие вводит deshalb, за ним сразу глагол habe.',
      'Толук эмес убакыт иштөө — себеп, убакыттын көбүрөөк болушу — натыйжа. Натыйжаны deshalb киргизет, андан кийин дароо habe этиши келет.',
    ),
  },
  {
    id: 'a2-ex-17-05',
    type: 'fill',
    unit: 17,
    concept: 'a2-wenn-als',
    prompt: 'Jeden Montag, ___ ich Frühschicht habe, stehe ich um fünf Uhr auf.',
    promptRu: 'Каждый понедельник, когда у меня ранняя смена, я встаю в пять часов.',
    promptKy: 'Ар дүйшөмбү күнү эрте алмашуум болгондо мен саат бешке турам.',
    options: ['wenn', 'als', 'weil'],
    answer: 'wenn',
    why: w(
      'Событие повторяется («каждый понедельник»), поэтому wenn. Als — только для одного события в прошлом.',
      'Окуя кайталанат («ар дүйшөмбү күнү»), ошондуктан wenn. Als — өткөндөгү бир жолку окуя үчүн гана.',
    ),
  },
  {
    id: 'a2-ex-17-06',
    type: 'choice',
    unit: 17,
    concept: 'a2-wenn-als',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Wenn ich 20 war, habe ich die Ausbildung beendet.', 'Als ich 20 war, habe ich die Ausbildung beendet.', 'Als ich 20 bin, habe ich die Ausbildung beendet.'],
    answer: 'Als ich 20 war, habe ich die Ausbildung beendet.',
    why: w(
      'Обучение вы закончили один раз в прошлом: als и war. Форма bin не подходит к прошлому, а wenn — к одному событию.',
      'Окууну өткөндө бир жолу бүттүңүз: als жана war. bin формасы өткөнгө туура келбейт, ал эми wenn бир жолку окуяга жарабайт.',
    ),
  },
  {
    id: 'a2-ex-17-07',
    type: 'order',
    unit: 17,
    concept: 'a2-wenn-als',
    prompt: 'Bilde den Satz.',
    promptRu: 'Когда мне было 19, я начал работать в мастерской.',
    promptKy: '19 жашымда мен устаканада иштей баштагам.',
    words: ['ich', 'Als', 'Werkstatt', '19', 'habe', 'angefangen.', 'war,', 'in', 'ich', 'einer'],
    answer: 'Als ich 19 war, habe ich in einer Werkstatt angefangen.',
    why: w(
      'В части с als глагол war — в конце. Главная часть после запятой начинается с глагола: habe ich … angefangen (Partizip II — в конце).',
      'als бөлүгүндө war этиши аягында. Үтүрдөн кийинки башкы бөлүк этиштен башталат: habe ich … angefangen (Partizip II — аягында).',
    ),
  },
  {
    id: 'a2-ex-17-08',
    type: 'fill',
    unit: 17,
    concept: 'a2-wenn-als',
    prompt: 'Wenn der Chef Zeit ___, spricht er mit dem Team.',
    promptRu: 'Когда у начальника есть время, он разговаривает с командой.',
    promptKy: 'Жетекчинин убактысы болгондо ал жамаат менен сүйлөшөт.',
    options: ['er hat', 'hat er', 'hat'],
    answer: 'hat',
    why: w(
      'В части с wenn спрягаемый глагол стоит в самом конце, и подлежащее (der Chef) уже названо: Zeit hat.',
      'wenn бөлүгүндө жакталышы бар этиш эң аягында турат, ал эми ээси (der Chef) мурун эле аталган: Zeit hat.',
    ),
  },
]

/** Test definition `unit-17` (kind topic, 15 questions). */
export const UNIT_17_TEST: A2TestDef = {
  id: 'unit-17',
  title: s('Итоговый тест: юнит 17', 'Жыйынтыктоочу тест: 17-бөлүм'),
  kind: 'topic',
  level: 'A2',
  unit: 17,
  size: 15,
}

/**
 * Unit 17 final test, `a2-ft-17-01` … `-15`. Composition: 7 grammar items (3 + 4, each in a small school / work sentence), 3 vocabulary items,
 * 5 items that read a short German text (a job ad, a CV, a team message, a reason in a message, an interview question).
 * Reading items carry the German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate only the instruction and the question.
 * Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_17_FINAL: A2TestQuestion[] = [
  {
    id: 'a2-ft-17-01',
    prompt: 'Mein Bruder arbeitet in Vollzeit, ___ hat er wenig Freizeit.',
    promptRu: 'Мой брат работает на полную ставку, поэтому у него мало свободного времени.',
    promptKy: 'Менин агам толук жумуш убактысы менен иштейт, ошондуктан анын бош убактысы аз.',
    options: ['deshalb', 'weil', 'wenn'],
    answer: 'deshalb',
    skill: 'grammar',
    concept: 'a2-deshalb-darum',
    why: s(
      'Работа в Vollzeit — причина, мало свободного времени — следствие. Следствие вводит deshalb, и за ним идёт глагол hat. Weil и wenn не подходят по смыслу и порядку слов.',
      'Vollzeit иштөө — себеп, бош убакыттын аздыгы — натыйжа. Натыйжаны deshalb киргизет, андан кийин hat этиши келет. weil жана wenn мааниси жана сөз тартиби боюнча туура келбейт.',
    ),
  },
  {
    id: 'a2-ft-17-02',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich spare Geld, darum ich kaufe ein Auto.', 'Ich spare Geld, darum kaufe ich ein Auto.', 'Ich spare Geld, darum kaufe ein Auto ich.'],
    answer: 'Ich spare Geld, darum kaufe ich ein Auto.',
    skill: 'grammar',
    concept: 'a2-deshalb-darum',
    why: s(
      'Darum, как и deshalb, стоит на первом месте, а глагол kaufe — сразу на втором, потом подлежащее ich.',
      'Darum, deshalb сыяктуу эле, биринчи орунда турат, ал эми kaufe этиши дароо экинчи орунда, андан кийин ээ ich келет.',
    ),
  },
  {
    id: 'a2-ft-17-03',
    prompt: 'Ich lerne Deutsch, ___ ich in Deutschland arbeiten möchte.',
    promptRu: 'Я учу немецкий, потому что хочу работать в Германии.',
    promptKy: 'Мен немис тилин үйрөнөм, анткени Германияда иштегим келет.',
    options: ['deshalb', 'darum', 'weil'],
    answer: 'weil',
    skill: 'grammar',
    concept: 'a2-deshalb-darum',
    why: s(
      'После пропуска глагол möchte стоит в конце: это порядок слов для weil. Deshalb и darum требуют глагола сразу после слова.',
      'Бош орундан кийин möchte этиши аягында турат: бул weil үчүн сөз тартиби. Deshalb жана darum этиштин ушул сөздөн кийин дароо келишин талап кылат.',
    ),
  },
  {
    id: 'a2-ft-17-04',
    prompt: '___ ich gestern im Vorstellungsgespräch war, habe ich viele Fragen bekommen.',
    promptRu: 'Когда я вчера был на собеседовании, мне задали много вопросов.',
    promptKy: 'Кечээ жумушка кабыл алуу маегинде болгондо мага көп суроо беришти.',
    options: ['Wenn', 'Als', 'Weil'],
    answer: 'Als',
    skill: 'grammar',
    concept: 'a2-wenn-als',
    why: s(
      'Собеседование было один раз вчера — одно событие в прошлом, поэтому als. Wenn было бы для повторяющегося события.',
      'Маек кечээ бир жолу болду — өткөндөгү бир жолку окуя, ошондуктан als. Wenn кайталануучу окуя үчүн болмок.',
    ),
  },
  {
    id: 'a2-ft-17-05',
    prompt: '___ ich mit der Ausbildung fertig bin, suche ich eine Stelle.',
    promptRu: 'Когда я закончу обучение, я буду искать место.',
    promptKy: 'Окууну бүткөндө мен жумуш издейм.',
    options: ['Wenn', 'Als', 'Dann'],
    answer: 'Wenn',
    skill: 'grammar',
    concept: 'a2-wenn-als',
    why: s(
      'Речь о будущем (я ещё не закончил), поэтому wenn. Als употребляется только для прошедшего события.',
      'Сөз келечек жөнүндө (мен азырынча бүтө элекмин), ошондуктан wenn. Als өткөн окуя үчүн гана колдонулат.',
    ),
  },
  {
    id: 'a2-ft-17-06',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Wenn ich habe Hunger, esse ich ein Brötchen.', 'Wenn ich Hunger habe, ich esse ein Brötchen.', 'Wenn ich Hunger habe, esse ich ein Brötchen.'],
    answer: 'Wenn ich Hunger habe, esse ich ein Brötchen.',
    skill: 'grammar',
    concept: 'a2-wenn-als',
    why: s(
      'В части с wenn глагол habe — в конце. Главная часть после запятой начинается с глагола: esse ich.',
      'wenn бөлүгүндө habe этиши аягында. Үтүрдөн кийинки башкы бөлүк этиштен башталат: esse ich.',
    ),
  },
  {
    id: 'a2-ft-17-07',
    prompt: 'Als ich 20 war, ___ ich nach Köln umgezogen.',
    promptRu: 'Когда мне было 20, я переехал в Кёльн.',
    promptKy: '20 жашымда мен Кёльнгө көчүп бардым.',
    options: ['habe', 'bin', 'war'],
    answer: 'bin',
    skill: 'grammar',
    concept: 'a2-wenn-als',
    why: s(
      'После als-части главная часть начинается с глагола. «Umziehen» (переехать) в Perfekt берёт sein: bin umgezogen, как в юните 11.',
      'als бөлүгүнөн кийин башкы бөлүк этиштен башталат. «Umziehen» (көчүп баруу) Perfektте sein алат: bin umgezogen, 11-бөлүмдөгүдөй.',
    ),
  },
  {
    id: 'a2-ft-17-08',
    prompt: 'Tom macht eine Ausbildung als Mechaniker. Zweimal pro Woche hat er Unterricht in der ___.',
    promptRu: 'Том проходит обучение на механика. Два раза в неделю у него занятия в профессиональном училище.',
    promptKy: 'Том механик болуп кесиптик окуу окуп жатат. Жумасына эки жолу анын сабагы кесиптик окуу жайында.',
    options: ['Berufsschule', 'Vorlesung', 'Besprechung'],
    answer: 'Berufsschule',
    skill: 'vocabulary',
    why: s(
      'При Ausbildung учатся в профессиональном училище: die Berufsschule. Die Vorlesung — лекция в вузе, die Besprechung — совещание на работе.',
      'Ausbildung учурунда кесиптик окуу жайында окушат: die Berufsschule. Die Vorlesung — жогорку окуу жайындагы лекция, die Besprechung — жумуштагы жыйналыш.',
    ),
  },
  {
    id: 'a2-ft-17-09',
    prompt: 'Frau Meier arbeitet jeden Tag acht Stunden. Sie arbeitet in ___.',
    promptRu: 'Фрау Майер работает каждый день по восемь часов. Она работает на полную ставку.',
    promptKy: 'Майер айым күн сайын сегиз саат иштейт. Ал толук жумуш убактысы менен иштейт.',
    options: ['Teilzeit', 'Überstunden', 'Vollzeit'],
    answer: 'Vollzeit',
    skill: 'vocabulary',
    why: s(
      'Полный рабочий день — Vollzeit. Teilzeit — неполный, а Überstunden — часы сверх нормы.',
      'Толук жумуш күнү — Vollzeit. Teilzeit — толук эмес, ал эми Überstunden — нормадан ашыкча саат.',
    ),
  },
  {
    id: 'a2-ft-17-10',
    prompt: 'Welches Wort ist kein Beruf?',
    promptRu: 'Какое слово не является профессией?',
    promptKy: 'Кайсы сөз кесип эмес?',
    options: ['der Bäcker', 'das Zeugnis', 'der Polizist'],
    answer: 'das Zeugnis',
    skill: 'vocabulary',
    why: s(
      'Der Bäcker и der Polizist — профессии. Das Zeugnis — документ с оценками.',
      'Der Bäcker жана der Polizist — кесиптер. Das Zeugnis — баалары бар документ.',
    ),
  },
  {
    id: 'a2-ft-17-11',
    prompt:
      'Lies die Anzeige: „Bäckerei Berger sucht Bäcker (m/w/d) in Teilzeit, 20 Stunden pro Woche. Sie haben eine Ausbildung als Bäcker. Sie stehen gern früh auf. Wir bieten ein nettes Team.“ Was braucht der Bewerber?',
    promptRu: 'Прочитайте объявление. Что нужно соискателю?',
    promptKy: 'Жарыяны окуңуз. Арыз ээсине эмне керек?',
    options: ['Eine Ausbildung als Bäcker', 'Ein Zertifikat für Deutsch', 'Zwei Jahre Erfahrung'],
    answer: 'Eine Ausbildung als Bäcker',
    skill: 'reading',
    why: s(
      'В объявлении сказано: «Sie haben eine Ausbildung als Bäcker». Сертификат по немецкому и два года опыта в тексте не названы.',
      'Жарыяда айтылган: «Sie haben eine Ausbildung als Bäcker». Немис тили боюнча тастыктама жана эки жылдык тажрыйба текстте аталган эмес.',
    ),
  },
  {
    id: 'a2-ft-17-12',
    prompt:
      'Lies den Lebenslauf: „Als Paul 16 war, hat er die Schule beendet. Danach hat er zwei Jahre eine Ausbildung als Mechaniker gemacht. Seit dem Abschluss arbeitet er in einer Werkstatt.“ Was hat Paul zuerst gemacht?',
    promptRu: 'Прочитайте резюме. Что Пауль сделал сначала?',
    promptKy: 'Түшүндүрмө баракты окуңуз. Пауль адегенде эмне кылды?',
    options: ['Er hat in einer Werkstatt gearbeitet.', 'Er hat eine Ausbildung gemacht.', 'Er hat die Schule beendet.'],
    answer: 'Er hat die Schule beendet.',
    skill: 'reading',
    why: s(
      'Порядок событий: сначала школа («Als Paul 16 war»), потом обучение («Danach»), потом работа («Seit dem Abschluss»).',
      'Окуялардын тартиби: адегенде мектеп («Als Paul 16 war»), анан окуу («Danach»), анан жумуш («Seit dem Abschluss»).',
    ),
  },
  {
    id: 'a2-ft-17-13',
    prompt:
      'Lies die Nachricht: „Hallo Team, morgen um 9 Uhr ist eine Besprechung. Wenn Sie nicht kommen können, schreiben Sie bitte eine Nachricht an Frau Roth. Danke!“ Was sollen die Kollegen tun, wenn sie nicht kommen können?',
    promptRu: 'Прочитайте сообщение. Что должны сделать коллеги, если не смогут прийти?',
    promptKy: 'Билдирүүнү окуңуз. Эгер келе алышпаса, кесиптештер эмне кылышы керек?',
    options: ['Frau Roth eine Nachricht schreiben', 'Zum Arzt gehen', 'Überstunden machen'],
    answer: 'Frau Roth eine Nachricht schreiben',
    skill: 'reading',
    why: s(
      'В сообщении сказано: «Wenn Sie nicht kommen können, schreiben Sie bitte eine Nachricht an Frau Roth». Об Arzt и Überstunden речи нет.',
      'Билдирүүдө айтылган: «Wenn Sie nicht kommen können, schreiben Sie bitte eine Nachricht an Frau Roth». Arzt жана Überstunden жөнүндө сөз жок.',
    ),
  },
  {
    id: 'a2-ft-17-14',
    prompt:
      'Lies die Nachricht: „Liebe Nina, ich arbeite ab Mai in Teilzeit, weil ich einen Kurs mache. Deshalb habe ich am Freitag frei. Dein Paul“ Warum arbeitet Paul in Teilzeit?',
    promptRu: 'Прочитайте сообщение. Почему Пауль работает на неполную ставку?',
    promptKy: 'Билдирүүнү окуңуз. Пауль эмне үчүн толук эмес убакыт иштейт?',
    options: ['Er hat am Freitag frei.', 'Er macht einen Kurs.', 'Er sucht eine Stelle.'],
    answer: 'Er macht einen Kurs.',
    skill: 'reading',
    why: s(
      'Причина названа после weil: «weil ich einen Kurs mache». Свободная пятница — это следствие (deshalb), а не причина.',
      'Себеп weil сөзүнөн кийин аталган: «weil ich einen Kurs mache». Бош жума күнү — бул натыйжа (deshalb), себеп эмес.',
    ),
  },
  {
    id: 'a2-ft-17-15',
    prompt:
      'Lies den Dialog: „Chef: Guten Tag. Sie bewerben sich als Programmierer. Warum möchten Sie bei uns arbeiten?“ Welche Antwort passt?',
    promptRu: 'Прочитайте диалог. Какой ответ подходит?',
    promptKy: 'Диалогду окуңуз. Кайсы жооп ылайыктуу?',
    options: ['Ich weiß nicht.', 'Das Geld ist egal.', 'Ich arbeite gern im Team, deshalb bewerbe ich mich bei Ihnen.'],
    answer: 'Ich arbeite gern im Team, deshalb bewerbe ich mich bei Ihnen.',
    skill: 'reading',
    concept: 'a2-deshalb-darum',
    why: s(
      'На вопрос «Warum …?» нужна причина. Хороший ответ даёт причину и следствие с deshalb. Остальные ответы не объясняют ничего.',
      '«Warum …?» деген суроого себеп керек. Жакшы жооп себепти жана deshalb менен натыйжаны берет. Калган жооптор эч нерсени түшүндүрбөйт.',
    ),
  },
]
