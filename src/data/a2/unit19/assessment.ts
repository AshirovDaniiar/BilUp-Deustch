import type { Exercise, L10n } from '../../types'
import type { A2TestDef, A2TestQuestion, L10nStrict } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 19 revision (Wiederholung) exercises, `a2-ex-19-01` … `-08` (3 fill / 3 choice / 2 order; concepts: man 2, indirect questions 3, directions 3 — the Stage 7B plan).
 * Authored independently of the final test below: no prompt, sentence or answer is shared. Positions of the correct option: fill 1 / 0 / 2, choice 2 / 0 / 1.
 */
export const UNIT_19_EXERCISES: Exercise[] = [
  {
    id: 'a2-ex-19-01',
    type: 'fill',
    unit: 19,
    concept: 'a2-man-regeln-verbote',
    prompt: 'Hier ___ man nicht parken.',
    promptRu: 'Здесь нельзя парковаться.',
    promptKy: 'Бул жерде унаа токтотууга болбойт.',
    options: ['muss', 'darf', 'will'],
    answer: 'darf',
    why: w(
      'Запрет выражается словами nicht dürfen: после man стоит darf. Man muss nicht parken значило бы «парковаться не обязательно».',
      'Тыюу nicht dürfen сөздөрү менен айтылат: man сөзүнөн кийин darf турат. Man muss nicht parken «унаа токтотуу милдеттүү эмес» дегенди билдирет.',
    ),
  },
  {
    id: 'a2-ex-19-02',
    type: 'choice',
    unit: 19,
    concept: 'a2-man-regeln-verbote',
    prompt: 'Hier ist das Rauchen verboten. Welcher Satz passt?',
    promptRu: 'Здесь курить запрещено. Какое предложение подходит?',
    promptKy: 'Бул жерде тамеки чегүүгө тыюу салынган. Кайсы сүйлөм ылайыктуу?',
    options: ['Man muss hier rauchen.', 'Man darf hier rauchen.', 'Man darf hier nicht rauchen.'],
    answer: 'Man darf hier nicht rauchen.',
    why: w(
      'Verboten = «запрещено», то есть man darf nicht. Man darf rauchen — разрешение, man muss rauchen — обязанность.',
      'Verboten = «тыюу салынган», башкача айтканда man darf nicht. Man darf rauchen — уруксат, man muss rauchen — милдет.',
    ),
  },
  {
    id: 'a2-ex-19-03',
    type: 'order',
    unit: 19,
    concept: 'a2-indirekte-fragen',
    prompt: 'Bilde den Satz.',
    promptRu: 'Вы не подскажете, где находится бюро обслуживания граждан?',
    promptKy: 'Жарандарды тейлөө бөлүмү кайда экенин айтып бере аласызбы?',
    words: ['Bürgeramt', 'wo', 'Sie', 'ist?', 'Können', 'das', 'sagen,', 'mir'],
    answer: 'Können Sie mir sagen, wo das Bürgeramt ist?',
    why: w(
      'Рамка «Können Sie mir sagen,» стоит в начале. После запятой идёт wo, затем подлежащее das Bürgeramt, а глагол ist — в конце.',
      '«Können Sie mir sagen,» алкагы башында турат. Үтүрдөн кийин wo, анан ээ das Bürgeramt келет, ал эми ist этиши аягында.',
    ),
  },
  {
    id: 'a2-ex-19-04',
    type: 'fill',
    unit: 19,
    concept: 'a2-indirekte-fragen',
    prompt: 'Ich möchte wissen, ___ ich einen Termin brauche.',
    promptRu: 'Я хотел бы знать, нужна ли мне запись.',
    promptKy: 'Мага кабыл алуу убактысы керекпи, билгим келет.',
    options: ['ob', 'wo', 'wie'],
    answer: 'ob',
    why: w(
      'Вопрос «да / нет» («Brauche ich einen Termin?») вставляется с ob, а глагол brauche уходит в конец.',
      '«Ооба / жок» суроосу («Brauche ich einen Termin?») ob менен киргизилет, ал эми brauche этиши аягына өтөт.',
    ),
  },
  {
    id: 'a2-ex-19-05',
    type: 'choice',
    unit: 19,
    concept: 'a2-indirekte-fragen',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Können Sie mir sagen, wann das Amt geöffnet ist?', 'Können Sie mir sagen, wann ist das Amt geöffnet?', 'Können Sie mir sagen, wann geöffnet das Amt ist?'],
    answer: 'Können Sie mir sagen, wann das Amt geöffnet ist?',
    why: w(
      'В рамке вопрос становится придаточным: после wann идёт подлежащее das Amt, а глагол ist — в самом конце.',
      'Алкакта суроо бириккен сүйлөмгө айланат: wann сөзүнөн кийин ээ das Amt келет, ал эми ist этиши эң аягында турат.',
    ),
  },
  {
    id: 'a2-ex-19-06',
    type: 'order',
    unit: 19,
    concept: 'a2-wegbeschreibung-praepositionen',
    prompt: 'Bilde den Satz.',
    promptRu: 'Пройдите мимо банка.',
    promptKy: 'Банктын жанынан өтүп барыңыз.',
    words: ['vorbei.', 'Sie', 'Bank', 'Gehen', 'der', 'an'],
    answer: 'Gehen Sie an der Bank vorbei.',
    why: w(
      'Повелительное наклонение на «Sie»: Gehen Sie … An … vorbei обрамляют слово с Dativ: an der Bank vorbei.',
      '«Sie» формасындагы буйрук ыңгайы: Gehen Sie … An … vorbei Dativ менен турган сөздү курчап турат: an der Bank vorbei.',
    ),
  },
  {
    id: 'a2-ex-19-07',
    type: 'fill',
    unit: 19,
    concept: 'a2-wegbeschreibung-praepositionen',
    prompt: 'Die Post ist gegenüber von ___ Apotheke.',
    promptRu: 'Почта находится напротив аптеки.',
    promptKy: 'Почта дарыканын каршысында.',
    options: ['die', 'den', 'der'],
    answer: 'der',
    why: w(
      'После gegenüber von стоит Dativ. Die Apotheke — женского рода, в Dativ артикль der: gegenüber von der Apotheke.',
      'gegenüber von сөзүнөн кийин Dativ турат. Die Apotheke — аял жынысында, Dativде артикль der: gegenüber von der Apotheke.',
    ),
  },
  {
    id: 'a2-ex-19-08',
    type: 'choice',
    unit: 19,
    concept: 'a2-wegbeschreibung-praepositionen',
    prompt: 'Wie komme ich zur Post? Welche Antwort ist richtig?',
    promptRu: 'Как мне добраться до почты? Какой ответ правильный?',
    promptKy: 'Почтага кантип барам? Кайсы жооп туура?',
    options: ['Gehen Sie bis die Kreuzung, dann links.', 'Gehen Sie bis zur Kreuzung, dann links.', 'Gehen Sie bis zu die Kreuzung, dann links.'],
    answer: 'Gehen Sie bis zur Kreuzung, dann links.',
    why: w(
      'Для «до места» нужно bis zu + Dativ: zu der Kreuzung → zur Kreuzung.',
      '«Жерге чейин» үчүн bis zu + Dativ керек: zu der Kreuzung → zur Kreuzung.',
    ),
  },
]

/** Test definition `unit-19` (kind topic, 15 questions). */
export const UNIT_19_TEST: A2TestDef = {
  id: 'unit-19',
  title: s('Итоговый тест: юнит 19', 'Жыйынтыктоочу тест: 19-бөлүм'),
  kind: 'topic',
  level: 'A2',
  unit: 19,
  size: 15,
}

/**
 * Unit 19 final test, `a2-ft-19-01` … `-15`. Composition: 7 grammar items (G1 3, G2 2 — the audit limit of two indirect-question items —, G3 2), 3 vocabulary
 * items, 5 items that read a short German text (a notice board, an information text, a route description, a situation, a playground notice).
 * Reading items carry the German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate only the instruction and the question.
 * Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_19_FINAL: A2TestQuestion[] = [
  {
    id: 'a2-ft-19-01',
    prompt: 'Auf dem Parkplatz ___ man nur zwei Stunden bleiben.',
    promptRu: 'На парковке можно оставаться только два часа.',
    promptKy: 'Унаа токтотуучу жайда болгону эки саат турууга болот.',
    options: ['darf', 'dürfen', 'darfst'],
    answer: 'darf',
    skill: 'grammar',
    concept: 'a2-man-regeln-verbote',
    why: s(
      'После man глагол стоит в форме как после er / sie: man darf. Формы dürfen и darfst к man не подходят.',
      'man сөзүнөн кийин этиш er / sie сыяктуу формада турат: man darf. dürfen жана darfst формалары man менен колдонулбайт.',
    ),
  },
  {
    id: 'a2-ft-19-02',
    prompt: 'Am Eingang steht: „Hier sind Fotos erlaubt.“ Welcher Satz passt?',
    promptRu: 'У входа написано: «Здесь разрешены фотографии». Какое предложение подходит?',
    promptKy: 'Кире беришке «Бул жерде сүрөткө тартууга уруксат» деп жазылган. Кайсы сүйлөм ылайыктуу?',
    options: ['Man darf hier keine Fotos machen.', 'Man darf hier Fotos machen.', 'Man muss hier Fotos machen.'],
    answer: 'Man darf hier Fotos machen.',
    skill: 'grammar',
    concept: 'a2-man-regeln-verbote',
    why: s(
      'Erlaubt = «разрешено»: man darf Fotos machen. Keine Fotos — это запрет, а man muss — обязанность.',
      'Erlaubt = «уруксат берилген»: man darf Fotos machen. Keine Fotos — тыюу, ал эми man muss — милдет.',
    ),
  },
  {
    id: 'a2-ft-19-03',
    prompt: 'Die Anmeldung kostet nichts. Welcher Satz ist richtig?',
    promptRu: 'Регистрация ничего не стоит. Какое предложение правильное?',
    promptKy: 'Каттоо акысыз. Кайсы сүйлөм туура?',
    options: ['Man darf nicht bezahlen.', 'Man kann nicht bezahlen.', 'Man muss nicht bezahlen.'],
    answer: 'Man muss nicht bezahlen.',
    skill: 'grammar',
    concept: 'a2-man-regeln-verbote',
    why: s(
      'Если платить не нужно, говорят «nicht müssen». Man darf nicht bezahlen — «платить запрещено», man kann nicht bezahlen — «не получается заплатить».',
      'Төлөөнүн кереги жок болсо, «nicht müssen» дейт. Man darf nicht bezahlen — «төлөөгө тыюу салынган», man kann nicht bezahlen — «төлөй албайт».',
    ),
  },
  {
    id: 'a2-ft-19-04',
    prompt: 'Sie suchen die Post und fragen höflich. Welcher Satz ist richtig?',
    promptRu: 'Вы ищете почту и спрашиваете вежливо. Какое предложение правильное?',
    promptKy: 'Сиз почтаны издеп, сылык суроо берип жатасыз. Кайсы сүйлөм туура?',
    options: ['Wo Post ist, können Sie mir sagen?', 'Können Sie mir sagen, wo die Post ist?', 'Können Sie mir sagen, wo ist die Post?'],
    answer: 'Können Sie mir sagen, wo die Post ist?',
    skill: 'grammar',
    concept: 'a2-indirekte-fragen',
    why: s(
      'После запятой стоит wo, затем подлежащее die Post, а глагол ist уходит в конец. Вариант с «wo ist» оставляет глагол на втором месте.',
      'Үтүрдөн кийин wo турат, анан ээ die Post, ал эми ist этиши аягына өтөт. «wo ist» варианты этишти экинчи орунда калтырат.',
    ),
  },
  {
    id: 'a2-ft-19-05',
    prompt: 'Können Sie mir sagen, ___ der Bahnhof ist?',
    promptRu: 'Вы не подскажете, где вокзал?',
    promptKy: 'Вокзал кайда экенин айтып бере аласызбы?',
    options: ['wo', 'ob', 'wann'],
    answer: 'wo',
    skill: 'grammar',
    concept: 'a2-indirekte-fragen',
    why: s(
      'Спрашивают о месте, поэтому нужно вопросительное слово wo. Ob — для вопроса «да / нет», wann — о времени.',
      'Жер жөнүндө суралат, ошондуктан суроо сөзү wo керек. Ob — «ооба / жок» суроосу үчүн, wann — убакыт жөнүндө.',
    ),
  },
  {
    id: 'a2-ft-19-06',
    prompt: 'Gehen Sie hier geradeaus ___ zur Kreuzung.',
    promptRu: 'Идите здесь прямо до перекрёстка.',
    promptKy: 'Бул жерден жол кесилишине чейин түз барыңыз.',
    options: ['nach', 'zu', 'bis'],
    answer: 'bis',
    skill: 'grammar',
    concept: 'a2-wegbeschreibung-praepositionen',
    why: s(
      'Bis zur Kreuzung — «до перекрёстка». Nach и zu сами по себе не выражают «до».',
      'Bis zur Kreuzung — «жол кесилишине чейин». Nach жана zu өзүнчө «чейин» дегенди билдирбейт.',
    ),
  },
  {
    id: 'a2-ft-19-07',
    prompt: 'Das Café ist zwischen der Bank und ___ Post.',
    promptRu: 'Кафе находится между банком и почтой.',
    promptKy: 'Кафе банк менен почтанын ортосунда.',
    options: ['die', 'der', 'den'],
    answer: 'der',
    skill: 'grammar',
    concept: 'a2-wegbeschreibung-praepositionen',
    why: s(
      'Zwischen с вопросом «где?» требует Dativ. Die Post — женского рода, в Dativ артикль der: zwischen der Bank und der Post.',
      'Zwischen «кайда?» деген суроо менен Dativ талап кылат. Die Post — аял жынысында, Dativде артикль der: zwischen der Bank und der Post.',
    ),
  },
  {
    id: 'a2-ft-19-08',
    prompt: 'Ich möchte Briefmarken kaufen. Ich gehe zum ___.',
    promptRu: 'Я хочу купить почтовые марки. Я иду к окошку.',
    promptKy: 'Мен почта маркасын сатып алгым келет. Мен терезеге барам.',
    options: ['Schalter', 'Spielplatz', 'Radweg'],
    answer: 'Schalter',
    skill: 'vocabulary',
    why: s(
      'Марки покупают у окошка на почте — am Schalter. Der Spielplatz — детская площадка, der Radweg — велодорожка.',
      'Почта маркасын почтадагы терезеден сатып алышат — am Schalter. Der Spielplatz — балдар оюн аянтчасы, der Radweg — велосипед жолу.',
    ),
  },
  {
    id: 'a2-ft-19-09',
    prompt: 'Ich muss das Formular noch ___ und unterschreiben.',
    promptRu: 'Мне ещё нужно заполнить бланк и подписать его.',
    promptKy: 'Мен бланкты дагы толтуруп, кол коюшум керек.',
    options: ['abschicken', 'abheben', 'ausfüllen'],
    answer: 'ausfüllen',
    skill: 'vocabulary',
    why: s(
      'Бланк заполняют: ein Formular ausfüllen. Abschicken — отправить, abheben — снять деньги со счёта.',
      'Бланкты толтурат: ein Formular ausfüllen. Abschicken — жөнөтүү, abheben — эсептен акча алуу.',
    ),
  },
  {
    id: 'a2-ft-19-10',
    prompt: 'Welches Wort passt nicht zum Thema „Verkehr“?',
    promptRu: 'Какое слово не подходит к теме «Транспорт и движение»?',
    promptKy: '«Транспорт жана жол кыймылы» темасына кайсы сөз туура келбейт?',
    options: ['die Kreuzung', 'die Unterschrift', 'der Radweg'],
    answer: 'die Unterschrift',
    skill: 'vocabulary',
    why: s(
      'Die Kreuzung и der Radweg связаны с дорогой. Die Unterschrift — подпись на документе.',
      'Die Kreuzung жана der Radweg жол менен байланыштуу. Die Unterschrift — документтеги кол тамга.',
    ),
  },
  {
    id: 'a2-ft-19-11',
    prompt:
      'Lies den Aushang: „Post am Bahnhof: Montag bis Freitag 8 bis 18 Uhr, Samstag 9 bis 12 Uhr, Sonntag geschlossen. Pakete nur an Schalter 2.“ Wann ist die Post am Samstag geöffnet?',
    promptRu: 'Прочитайте объявление. Когда почта открыта в субботу?',
    promptKy: 'Жарыяны окуңуз. Почта ишемби күнү качан ачык?',
    options: ['Von 9 bis 12 Uhr', 'Von 8 bis 18 Uhr', 'Gar nicht'],
    answer: 'Von 9 bis 12 Uhr',
    skill: 'reading',
    why: s(
      'В объявлении написано: «Samstag 9 bis 12 Uhr». В будни почта работает дольше, а в воскресенье закрыта.',
      'Жарыяда жазылган: «Samstag 9 bis 12 Uhr». Иш күндөрү почта узагыраак иштейт, ал эми жекшемби күнү жабык.',
    ),
  },
  {
    id: 'a2-ft-19-12',
    prompt:
      'Lies die Information: „Anmeldung beim Bürgeramt: Bitte bringen Sie Ihren Ausweis und das Formular mit. Das Formular finden Sie im Internet. Ohne Termin ist die Anmeldung nicht möglich.“ Was brauchen Sie außerdem?',
    promptRu: 'Прочитайте информацию. Что нужно ещё?',
    promptKy: 'Маалыматты окуңуз. Дагы эмне керек?',
    options: ['Ein Paket', 'Eine Briefmarke', 'Einen Termin'],
    answer: 'Einen Termin',
    skill: 'reading',
    why: s(
      'В тексте сказано: «Ohne Termin ist die Anmeldung nicht möglich». Значит, нужна запись. Paket и Briefmarke не упоминаются.',
      'Текстте айтылган: «Ohne Termin ist die Anmeldung nicht möglich». Демек, кабыл алуу убактысы керек. Paket жана Briefmarke айтылган эмес.',
    ),
  },
  {
    id: 'a2-ft-19-13',
    prompt:
      'Lies die Wegbeschreibung: „Gehen Sie geradeaus bis zur Ampel. Dort gehen Sie links, an der Schule vorbei. Der Spielplatz ist gegenüber von der Schule.“ Wohin gehen Sie an der Ampel?',
    promptRu: 'Прочитайте описание пути. Куда идут у светофора?',
    promptKy: 'Жолдун сүрөттөмөсүн окуңуз. Светофордун жанында кайда барышат?',
    options: ['Nach links', 'Nach rechts', 'Geradeaus'],
    answer: 'Nach links',
    skill: 'reading',
    concept: 'a2-wegbeschreibung-praepositionen',
    why: s(
      'У светофора («Dort») идут налево: «Dort gehen Sie links». Прямо идут только до светофора.',
      'Светофордо («Dort») солго барышат: «Dort gehen Sie links». Түз светофорго чейин гана барышат.',
    ),
  },
  {
    id: 'a2-ft-19-14',
    prompt:
      'Lies die Situation: „Ein Mann fragt Sie: Entschuldigung, wo ist die Haltestelle? Sie wissen: Die Haltestelle ist bei der Kreuzung rechts.“ Was sagen Sie?',
    promptRu: 'Прочитайте ситуацию. Что вы скажете?',
    promptKy: 'Кырдаалды окуңуз. Сиз эмне дейсиз?',
    options: ['Ich habe keine Zeit.', 'Gehen Sie bis zur Kreuzung und dann rechts.', 'Die Haltestelle ist verboten.'],
    answer: 'Gehen Sie bis zur Kreuzung und dann rechts.',
    skill: 'reading',
    concept: 'a2-wegbeschreibung-praepositionen',
    why: s(
      'Полезный и вежливый ответ объясняет путь: «bis zur Kreuzung und dann rechts». Остальные ответы грубые или не по теме.',
      'Пайдалуу жана сылык жооп жолду түшүндүрөт: «bis zur Kreuzung und dann rechts». Калган жооптор дөрөкөт же теманын чегинен чыгат.',
    ),
  },
  {
    id: 'a2-ft-19-15',
    prompt:
      'Lies den Aushang: „Spielplatz: täglich 8 bis 20 Uhr geöffnet. Fahrräder bitte vor dem Eingang parken. Bitte nicht rauchen.“ Was darf man auf dem Spielplatz nicht?',
    promptRu: 'Прочитайте объявление. Что нельзя делать на детской площадке?',
    promptKy: 'Жарыяны окуңуз. Балдар оюн аянтчасында эмне кылууга болбойт?',
    options: ['Spielen', 'Fahrräder vor dem Eingang parken', 'Rauchen'],
    answer: 'Rauchen',
    skill: 'reading',
    concept: 'a2-man-regeln-verbote',
    why: s(
      '«Bitte nicht rauchen» — просьба не курить, то есть курить нельзя. Играть можно, а велосипеды оставляют перед входом.',
      '«Bitte nicht rauchen» — тамеки чекпегиле деген өтүнүч, башкача айтканда тамеки чегүүгө болбойт. Ойноого болот, ал эми велосипеддер кире беришке коюлат.',
    ),
  },
]
