import type { Exercise, L10n } from '../../types'
import type { A2TestQuestion, L10nStrict } from '../../a2/types'
import type { B1TestDef } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 23 revision (Wiederholung) exercises, `b1-ex-23-01` … `-10`: 3 fill / 5 choice / 2 order on the unit's two concepts (Relativsatz × 4, zu-Infinitiv
 * and um … zu × 4), plus 2 RECYCLED items (↻ A2: adjective endings, Perfekt of a separable verb) without a concept of this unit — the spaced-revision
 * part. Exercise 04 is a TEXT-level `choice` item (three sentences). Authored independently of the final test: no prompt, sentence or answer is shared.
 * The receptive constructions (ohne … zu, statt … zu; and those of Unit 22) never appear in a gap or a word order.
 */
export const UNIT_23_EXERCISES: Exercise[] = [
  {
    id: 'b1-ex-23-01',
    type: 'fill',
    unit: 23,
    concept: 'b1-relativsaetze-nom-akk',
    prompt: 'Das ist der Kollege, ___ mir bei der Arbeit hilft.',
    promptRu: 'Это коллега, который помогает мне на работе.',
    promptKy: 'Бул жумушта мага жардам берген кесиптеш.',
    options: ['der', 'die', 'das'],
    answer: 'der',
    why: w(
      'Слово перед запятой — «der Kollege» (мужской род), и оно же подлежащее придаточной части («er hilft»): Nominativ, мужской род — der.',
      'Үтүрдүн алдындагы сөз — «der Kollege» (эркек род), ал кошумча бөлүктүн ээси да («er hilft»): Nominativ, эркек род — der.',
    ),
  },
  {
    id: 'b1-ex-23-02',
    type: 'choice',
    unit: 23,
    concept: 'b1-relativsaetze-nom-akk',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Ich suche einen Chef, den alle respektieren.',
      'Ich suche einen Chef, der alle respektieren.',
      'Ich suche einen Chef, den respektieren alle.',
    ],
    answer: 'Ich suche einen Chef, den alle respektieren.',
    why: w(
      'Alle respektieren den Chef — начальник здесь дополнение, поэтому Akkusativ (den), а глагол стоит в самом конце: …, den alle respektieren.',
      'Alle respektieren den Chef — бул жерде начальник толуктоочу, ошондуктан Akkusativ (den), ал эми этиш эң аягында турат: …, den alle respektieren.',
    ),
  },
  {
    id: 'b1-ex-23-03',
    type: 'order',
    unit: 23,
    concept: 'b1-relativsaetze-nom-akk',
    prompt: 'Bilde den Satz.',
    promptRu: 'У меня есть коллега, которая очень отзывчива.',
    promptKy: 'Менин абдан боорукер кесиптешим бар.',
    words: ['Kollegin,', 'hilfsbereit', 'Ich', 'eine', 'sehr', 'habe', 'die', 'ist.'],
    answer: 'Ich habe eine Kollegin, die sehr hilfsbereit ist.',
    why: w(
      'Слово «Kollegin» женского рода — поэтому die. В части с die глагол стоит в самом конце (ist), а перед ней ставится запятая.',
      '«Kollegin» сөзү аял род — ошондуктан die. die менен башталган бөлүктө этиш эң аягында турат (ist), анын алдына үтүр коюлат.',
    ),
  },
  {
    id: 'b1-ex-23-04',
    type: 'choice',
    unit: 23,
    concept: 'b1-relativsaetze-nom-akk',
    prompt: 'Welcher kleine Text ist richtig?',
    promptRu: 'Какой короткий текст составлен правильно?',
    promptKy: 'Кайсы кыска текст туура түзүлгөн?',
    options: [
      'Ich arbeite in einer Firma. Die Firma, die baut Möbel, sitzt in Kassel. Mein Chef ist ein Mann, den alle mögen.',
      'Ich arbeite in einer Firma. Die Firma, die Möbel baut, sitzt in Kassel. Mein Chef ist ein Mann, den alle mögen.',
      'Ich arbeite in einer Firma. Die Firma, die Möbel baut, sitzt in Kassel. Mein Chef ist ein Mann, der alle mögen.',
    ],
    answer: 'Ich arbeite in einer Firma. Die Firma, die Möbel baut, sitzt in Kassel. Mein Chef ist ein Mann, den alle mögen.',
    why: w(
      'В первом тексте во втором предложении глагол не в конце (die baut Möbel), в третьем — неверный падеж: «alle mögen den Mann» требует Akkusativ (den), а не der. Во втором тексте всё верно.',
      'Биринчи текстте экинчи сүйлөмдө этиш аягында эмес (die baut Möbel), үчүнчүсүндө жалгоо туура эмес: «alle mögen den Mann» Akkusativди (den) талап кылат, der эмес. Экинчи текстте баары туура.',
    ),
  },
  {
    id: 'b1-ex-23-05',
    type: 'fill',
    unit: 23,
    concept: 'b1-infinitiv-mit-zu',
    prompt: 'Es ist wichtig, pünktlich ___ sein.',
    promptRu: 'Важно быть пунктуальным.',
    promptKy: 'Убагында болуу маанилүү.',
    options: ['zu', 'um', 'für'],
    answer: 'zu',
    why: w(
      'После выражения es ist wichtig инфинитив стоит с частицей zu: …, pünktlich zu sein. Um … zu нужно для цели, а не здесь.',
      'es ist wichtig туюндурмасынан кийин инфинитив zu бөлүкчөсү менен турат: …, pünktlich zu sein. um … zu максат үчүн керек, бул жерде эмес.',
    ),
  },
  {
    id: 'b1-ex-23-06',
    type: 'choice',
    unit: 23,
    concept: 'b1-infinitiv-mit-zu',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich versuche, früh aufzustehen.', 'Ich versuche, früh zu aufstehen.', 'Ich versuche, früh aufstehen zu.'],
    answer: 'Ich versuche, früh aufzustehen.',
    why: w(
      'У глагола aufstehen отделяемая приставка: zu встаёт между приставкой и основой — aufzustehen (одно слово).',
      'aufstehen этишинин ажыраган приставкасы бар: zu приставка менен уңгунун ортосуна кирет — aufzustehen (бир сөз).',
    ),
  },
  {
    id: 'b1-ex-23-07',
    type: 'order',
    unit: 23,
    concept: 'b1-infinitiv-mit-zu',
    prompt: 'Bilde den Satz.',
    promptRu: 'Она читает объявление, чтобы проверить требования.',
    promptKy: 'Ал талаптарды текшерүү үчүн жарыяны окуйт.',
    words: ['Anzeige,', 'um', 'Sie', 'prüfen.', 'die', 'zu', 'liest', 'Voraussetzungen', 'die'],
    answer: 'Sie liest die Anzeige, um die Voraussetzungen zu prüfen.',
    why: w(
      'Um … zu показывает цель: часть с um стоит после запятой, а zu — прямо перед инфинитивом в самом конце (zu prüfen).',
      'um … zu максатты көрсөтөт: um менен башталган бөлүк үтүрдөн кийин турат, ал эми zu — инфинитивдин дароо алдында, эң аягында (zu prüfen).',
    ),
  },
  {
    id: 'b1-ex-23-08',
    type: 'choice',
    unit: 23,
    concept: 'b1-infinitiv-mit-zu',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich kann gut im Team arbeiten.', 'Ich kann gut im Team zu arbeiten.', 'Ich kann gut im Team arbeiten zu.'],
    answer: 'Ich kann gut im Team arbeiten.',
    why: w(
      'После модального глагола können частица zu не ставится: Ich kann … arbeiten.',
      'können модаль этишинен кийин zu бөлүкчөсү коюлбайт: Ich kann … arbeiten.',
    ),
  },
  // ↻ Wiederholung (recycled from A2, spaced revision; no concept of this unit)
  {
    id: 'b1-ex-23-09',
    type: 'fill',
    unit: 23,
    prompt: 'Ich suche eine ___ Stelle.',
    promptRu: 'Я ищу новую работу.',
    promptKy: 'Мен жаңы жумуш издеп жатам.',
    options: ['neue', 'neuen', 'neuer'],
    answer: 'neue',
    why: w(
      '↻ A2: после eine (женский род, Akkusativ) прилагательное получает -e: eine neue Stelle.',
      '↻ A2: eine (аял род, Akkusativ) сөзүнөн кийин сын атоочко -e кошулат: eine neue Stelle.',
    ),
  },
  {
    id: 'b1-ex-23-10',
    type: 'choice',
    unit: 23,
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Gestern habe ich die Unterlagen eingereicht.',
      'Gestern habe ich die Unterlagen einreicht.',
      'Gestern habe ich die Unterlagen geeinreicht.',
    ],
    answer: 'Gestern habe ich die Unterlagen eingereicht.',
    why: w(
      '↻ A2: Partizip II глагола с отделяемой приставкой: ge вставляется между приставкой и основой — ein-ge-reicht → eingereicht.',
      '↻ A2: Приставкасы ажыраган этиштин Partizip II формасы: ge приставка менен уңгунун ортосуна кирет — ein-ge-reicht → eingereicht.',
    ),
  },
]

/** Test definition `unit-23` (kind topic, 15 questions). */
export const UNIT_23_TEST: B1TestDef = {
  id: 'unit-23',
  title: s('Итоговый тест: юнит 23', 'Жыйынтыктоочу тест: 23-бөлүм'),
  kind: 'topic',
  level: 'B1',
  unit: 23,
  size: 15,
}

/**
 * Unit 23 final test, `b1-ft-23-01` … `-15`. Composition (curriculum v2 §7.2): 8 grammar (6 on the two concepts + 2 recycled A2 items ↻), 3 vocabulary,
 * 4 reading, 0 listening — listening items enter a test only after the text-to-speech playback has been verified on real devices. Reading items carry the
 * German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate only the instruction and the question. Authored positions of the correct answer:
 * 5 / 5 / 5, never three in a row.
 */
export const UNIT_23_FINAL: A2TestQuestion[] = [
  {
    id: 'b1-ft-23-01',
    prompt: 'Das ist die Stelle, ___ ich suche.',
    promptRu: 'Это должность, которую я ищу.',
    promptKy: 'Бул мен издеп жүргөн кызмат.',
    options: ['die', 'der', 'den'],
    answer: 'die',
    skill: 'grammar',
    concept: 'b1-relativsaetze-nom-akk',
    why: s(
      'Слово «Stelle» женского рода, а Akkusativ женского рода звучит так же, как Nominativ: die. Глагол suche — в самом конце.',
      '«Stelle» сөзү аял род, ал эми аял родтун Akkusativи Nominativ менен бирдей: die. suche этиши эң аягында.',
    ),
  },
  {
    id: 'b1-ft-23-02',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Der Mann, die dort arbeitet, ist mein Vorgesetzter.',
      'Der Mann, der dort arbeitet, ist mein Vorgesetzter.',
      'Der Mann, der arbeitet dort, ist mein Vorgesetzter.',
    ],
    answer: 'Der Mann, der dort arbeitet, ist mein Vorgesetzter.',
    skill: 'grammar',
    concept: 'b1-relativsaetze-nom-akk',
    why: s(
      'Der Mann → der (мужской род, Nominativ), и глагол стоит в конце: …, der dort arbeitet, … Форма die не подходит, а «der arbeitet dort» нарушает порядок слов.',
      'Der Mann → der (эркек род, Nominativ), этиш аягында турат: …, der dort arbeitet, … die формасы туура келбейт, ал эми «der arbeitet dort» сөздөрдүн иретин бузат.',
    ),
  },
  {
    id: 'b1-ft-23-03',
    prompt: 'Das Angebot, ___ ich bekommen habe, ist gut.',
    promptRu: 'Предложение, которое я получил, хорошее.',
    promptKy: 'Мен алган сунуш жакшы.',
    options: ['der', 'die', 'das'],
    answer: 'das',
    skill: 'grammar',
    concept: 'b1-relativsaetze-nom-akk',
    why: s(
      'Das Angebot — средний род, значит, относительное местоимение das (Akkusativ: ich habe das Angebot bekommen).',
      'Das Angebot — орто род, демек, Relativsatz сөзү das (Akkusativ: ich habe das Angebot bekommen).',
    ),
  },
  {
    id: 'b1-ft-23-04',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Es ist leicht, Kunden beraten zu.', 'Es ist leicht, Kunden zu beraten.', 'Es ist leicht, zu Kunden beraten.'],
    answer: 'Es ist leicht, Kunden zu beraten.',
    skill: 'grammar',
    concept: 'b1-infinitiv-mit-zu',
    why: s(
      'Zu стоит прямо перед инфинитивом, а инфинитив — в самом конце: …, Kunden zu beraten.',
      'zu инфинитивдин дароо алдында турат, инфинитив болсо эң аягында: …, Kunden zu beraten.',
    ),
  },
  {
    id: 'b1-ft-23-05',
    prompt: 'Ich arbeite viel, ___ Geld zu sparen.',
    promptRu: 'Я много работаю, чтобы копить деньги.',
    promptKy: 'Мен акча чогултуу үчүн көп иштейм.',
    options: ['um', 'für', 'weil'],
    answer: 'um',
    skill: 'grammar',
    concept: 'b1-infinitiv-mit-zu',
    why: s(
      'Цель действия выражает um … zu: um Geld zu sparen. Für и weil с инфинитивом zu не используются.',
      'Аракеттин максатын um … zu билдирет: um Geld zu sparen. für жана weil zu менен инфинитивде колдонулбайт.',
    ),
  },
  {
    id: 'b1-ft-23-06',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Vergiss nicht, die Unterlagen zu einreichen.',
      'Vergiss nicht, die Unterlagen einreichen zu.',
      'Vergiss nicht, die Unterlagen einzureichen.',
    ],
    answer: 'Vergiss nicht, die Unterlagen einzureichen.',
    skill: 'grammar',
    concept: 'b1-infinitiv-mit-zu',
    why: s(
      'У глагола einreichen отделяемая приставка ein-, поэтому zu встаёт внутрь: einzureichen.',
      'einreichen этишинин ажыраган ein- приставкасы бар, ошондуктан zu ичине кирет: einzureichen.',
    ),
  },
  {
    id: 'b1-ft-23-07',
    prompt: 'Ich kenne den ___ Chef.',
    promptRu: 'Я знаю нового начальника.',
    promptKy: 'Мен жаңы начальникти тааныйм.',
    options: ['neue', 'neuen', 'neuer'],
    answer: 'neuen',
    skill: 'grammar',
    concept: 'a2-adjektivendungen-definit',
    why: s(
      '↻ A2: после den (мужской род, Akkusativ) прилагательное получает -en: den neuen Chef.',
      '↻ A2: den (эркек род, Akkusativ) сөзүнөн кийин сын атоочко -en кошулат: den neuen Chef.',
    ),
  },
  {
    id: 'b1-ft-23-08',
    prompt: 'Morgen stelle ich ___ in der Firma vor.',
    promptRu: 'Завтра я представлюсь в фирме (приду на собеседование).',
    promptKy: 'Эртең мен фирмада өзүмдү тааныштырам (маекке барам).',
    options: ['mir', 'sich', 'mich'],
    answer: 'mich',
    skill: 'grammar',
    concept: 'a2-reflexive-verben',
    why: s(
      '↻ A2: к ich подходит возвратное местоимение mich: ich stelle mich vor.',
      '↻ A2: ich менен mich туура келет: ich stelle mich vor.',
    ),
  },
  {
    id: 'b1-ft-23-09',
    prompt: 'Die ersten sechs Monate in einer neuen Firma heißen oft ___.',
    promptRu: 'Первые шесть месяцев в новой фирме часто называют ___.',
    promptKy: 'Жаңы фирмадагы алгачкы алты айды көбүнчө ___ деп аташат.',
    options: ['Probezeit', 'Frist', 'Referenz'],
    answer: 'Probezeit',
    skill: 'vocabulary',
    why: s(
      'Первые месяцы работы, когда проверяют нового сотрудника, называются Probezeit. Frist — срок, Referenz — рекомендация.',
      'Жаңы кызматкер текшерилген алгачкы айлар Probezeit деп аталат. Frist — мөөнөт, Referenz — сунуштама.',
    ),
  },
  {
    id: 'b1-ft-23-10',
    prompt: 'Das ___ erklärt, warum man die Stelle möchte.',
    promptRu: 'В ___ объясняют, почему человек хочет эту должность.',
    promptKy: '___ адам бул кызматты эмне үчүн каалаарын түшүндүрөт.',
    options: ['Arbeitsklima', 'Anschreiben', 'Arbeitsvertrag'],
    answer: 'Anschreiben',
    skill: 'vocabulary',
    why: s(
      'Письмо, которое прилагают к заявке и в котором объясняют мотивацию, — das Anschreiben. Arbeitsklima — атмосфера, Arbeitsvertrag — договор.',
      'Өтүнүчкө кошулуп, мотивацияны түшүндүргөн кат — das Anschreiben. Arbeitsklima — атмосфера, Arbeitsvertrag — келишим.',
    ),
  },
  {
    id: 'b1-ft-23-11',
    prompt: 'Meine größte ___ ist, dass ich sehr zuverlässig bin.',
    promptRu: 'Моя главная ___ — я очень надёжен.',
    promptKy: 'Менин эң чоң ___ — мен абдан ишенимдүүмүн.',
    options: ['Stärke', 'Schwäche', 'Frist'],
    answer: 'Stärke',
    skill: 'vocabulary',
    why: s(
      'Надёжность — положительное качество, то есть Stärke. Schwäche — слабая сторона, Frist — срок.',
      'Ишенимдүүлүк — оң сапат, башкача айтканда Stärke. Schwäche — алсыз жак, Frist — мөөнөт.',
    ),
  },
  {
    id: 'b1-ft-23-12',
    prompt:
      'Lies die Anzeige: „Wir suchen eine Verkäuferin, die freundlich ist und gern im Team arbeitet. Eine Ausbildung ist nicht nötig. Die Probezeit dauert drei Monate.“ Was muss die Bewerberin mögen?',
    promptRu: 'Прочитайте объявление. Что должна любить кандидатка?',
    promptKy: 'Жарыяны окуңуз. Талапкер аял эмнени жакшы көрүшү керек?',
    options: ['Eine lange Ausbildung.', 'Die Arbeit am Computer.', 'Die Arbeit im Team.'],
    answer: 'Die Arbeit im Team.',
    skill: 'reading',
    why: s(
      'В объявлении: «die … gern im Team arbeitet». Образование не обязательно, о работе за компьютером не сказано.',
      'Жарыяда: «die … gern im Team arbeitet». Билим милдеттүү эмес, компьютерде иштөө жөнүндө айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-23-13',
    prompt:
      'Lies den Text: „Ich habe mich beworben, um in einer anderen Stadt zu arbeiten. Die Firma, die mich eingeladen hat, sitzt in Leipzig. Das Gespräch ist am Montag.“ Warum hat sich die Person beworben?',
    promptRu: 'Прочитайте текст. Почему человек подал заявку?',
    promptKy: 'Текстти окуңуз. Адам эмне үчүн өтүнүч берди?',
    options: ['Um in einer anderen Stadt zu arbeiten.', 'Um mehr Urlaub zu bekommen.', 'Um eine Weiterbildung zu machen.'],
    answer: 'Um in einer anderen Stadt zu arbeiten.',
    skill: 'reading',
    why: s(
      'В тексте: «um in einer anderen Stadt zu arbeiten». Об отпуске и обучении ничего не сказано.',
      'Текстте: «um in einer anderen Stadt zu arbeiten». Эс алуу жана окуу жөнүндө эч нерсе айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-23-14',
    prompt:
      'Lies die Nachricht: „Liebe Frau Roth, ich muss das Gespräch am Freitag leider absagen, weil ich krank bin. Die Krankmeldung schicke ich Ihnen morgen. Kann ich einen neuen Termin bekommen?“ Was möchte die Person?',
    promptRu: 'Прочитайте сообщение. Чего хочет этот человек?',
    promptKy: 'Билдирүүнү окуңуз. Бул адам эмнени каалайт?',
    options: ['Die Stelle absagen.', 'Einen neuen Termin.', 'Die Unterlagen zurück.'],
    answer: 'Einen neuen Termin.',
    skill: 'reading',
    why: s(
      'В сообщении: «Kann ich einen neuen Termin bekommen?». Отказываться от должности человек не собирается.',
      'Билдирүүдө: «Kann ich einen neuen Termin bekommen?». Адам кызматтан баш тартууну ойлобойт.',
    ),
  },
  {
    id: 'b1-ft-23-15',
    prompt:
      'Lies den Text: „Mein Kollege Ben, den ich seit drei Jahren kenne, hat eine neue Stelle bekommen. Er ist jetzt Abteilungsleiter. Das finde ich toll.“ Was stimmt?',
    promptRu: 'Прочитайте текст. Что верно?',
    promptKy: 'Текстти окуңуз. Эмне туура?',
    options: ['Ben ist neu in der Firma.', 'Ben arbeitet in einer anderen Stadt.', 'Ben hat jetzt eine neue Stelle.'],
    answer: 'Ben hat jetzt eine neue Stelle.',
    skill: 'reading',
    why: s(
      'В тексте: «hat eine neue Stelle bekommen. Er ist jetzt Abteilungsleiter». Новым в фирме Бен не назван, о другом городе не сказано.',
      'Текстте: «hat eine neue Stelle bekommen. Er ist jetzt Abteilungsleiter». Бен фирмада жаңы деп аталган эмес, башка шаар жөнүндө айтылган эмес.',
    ),
  },
]
