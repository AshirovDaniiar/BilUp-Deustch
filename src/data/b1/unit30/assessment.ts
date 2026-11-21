import type { Exercise, L10n } from '../../types'
import type { A2TestQuestion, L10nStrict } from '../../a2/types'
import type { B1TestDef } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 30 revision (Wiederholung) exercises, `b1-ex-30-01` … `-10`: 4 fill / 4 choice / 2 order on the unit's three concepts (Nomen-Verb-Verbindungen × 3, sodass / so … dass /
 * damit / um … zu × 3, text-structuring words × 2), plus 2 RECYCLED items (↻ obwohl of Unit 22, ↻ Passiv Präsens of Unit 24) without a concept of this unit — the spaced-revision
 * part. Authored independently of the final test: no prompt, sentence or answer is shared. The items use only the closed lists (the 20 Nomen-Verb-Verbindungen; the
 * text-structuring words erstens, zweitens, außerdem, darüber hinaus, dennoch, daher, zum Beispiel); the constructions that are receptive in B1 (ohne … zu, Passiv Perfekt,
 * Genitiv attributes) never appear in a gap or a word order. All situations are fictional.
 */
export const UNIT_30_EXERCISES: Exercise[] = [
  {
    id: 'b1-ex-30-01',
    type: 'fill',
    unit: 30,
    concept: 'b1-nomen-verb-verbindungen',
    prompt: 'Wir müssen heute eine Entscheidung ___.',
    promptRu: 'Нам нужно принять решение сегодня.',
    promptKy: 'Биз бүгүн чечим кабыл алышыбыз керек.',
    options: ['treffen', 'machen', 'geben'],
    answer: 'treffen',
    why: w(
      'Устойчивая пара: «eine Entscheidung treffen». Machen и geben с этим существительным не употребляются.',
      'Туруктуу жуп: «eine Entscheidung treffen». machen жана geben бул зат атооч менен колдонулбайт.',
    ),
  },
  {
    id: 'b1-ex-30-02',
    type: 'choice',
    unit: 30,
    concept: 'b1-nomen-verb-verbindungen',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich nehme morgen Kontakt auf.', 'Ich aufnehme morgen Kontakt.', 'Ich nehme auf morgen Kontakt.'],
    answer: 'Ich nehme morgen Kontakt auf.',
    why: w(
      'Aufnehmen — разделяемый глагол: nehme на втором месте, приставка auf — в самом конце предложения.',
      'aufnehmen — бөлүнүүчү этиш: nehme экинчи орунда, auf приставкасы сүйлөмдүн эң аягында.',
    ),
  },
  {
    id: 'b1-ex-30-03',
    type: 'order',
    unit: 30,
    concept: 'b1-nomen-verb-verbindungen',
    prompt: 'Bilde den Satz.',
    promptRu: 'Объединение предоставляет помещение.',
    promptKy: 'Бирикме бөлмөнү берет.',
    words: ['Verfügung.', 'den', 'Der', 'zur', 'stellt', 'Verein', 'Raum'],
    answer: 'Der Verein stellt den Raum zur Verfügung.',
    why: w(
      'Подлежащее, затем глагол stellt на втором месте, дополнение (den Raum) и в конце устойчивая часть «zur Verfügung».',
      'Ээ, андан кийин экинчи орунда stellt этиши, толуктоочу (den Raum) жана аягында туруктуу бөлүк «zur Verfügung».',
    ),
  },
  {
    id: 'b1-ex-30-04',
    type: 'fill',
    unit: 30,
    concept: 'b1-konsekutiv-final',
    prompt: 'Wir sammeln Spenden, ___ die Kinder einen Spielplatz bekommen.',
    promptRu: 'Мы собираем пожертвования, чтобы дети получили площадку.',
    promptKy: 'Биз балдар оюн аянтчасын алышы үчүн кайрымдуулук акча чогултуп жатабыз.',
    options: ['damit', 'um', 'ob'],
    answer: 'damit',
    why: w(
      'Подлежащее другое (wir — die Kinder), поэтому damit с глаголом в конце. Um требует того же подлежащего и инфинитива с zu, а ob означает «ли».',
      'Ээ башка (wir — die Kinder), ошондуктан этиши аягындагы damit. Um бир эле ээни жана zu менен инфинитивди талап кылат, ал эми ob «же» дегенди билдирет.',
    ),
  },
  {
    id: 'b1-ex-30-05',
    type: 'choice',
    unit: 30,
    concept: 'b1-konsekutiv-final',
    prompt: 'In welchem Satz steht im zweiten Teil die Folge (das Ergebnis)?',
    promptRu: 'В каком предложении во второй части стоит следствие (результат)?',
    promptKy: 'Кайсы сүйлөмдө экинчи бөлүктө натыйжа (жыйынтык) турат?',
    options: [
      'Es hat geregnet, sodass das Fest ausgefallen ist.',
      'Das Fest ist ausgefallen, weil es geregnet hat.',
      'Das Fest ist ausgefallen, obwohl es geregnet hat.',
    ],
    answer: 'Es hat geregnet, sodass das Fest ausgefallen ist.',
    why: w(
      'Sodass вводит следствие: сначала дождь, потом результат (праздник отменили). В «weil» вторая часть — причина, а «obwohl» показывает уступку.',
      'sodass натыйжаны киргизет: адегенде жамгыр, андан кийин жыйынтык (майрам жокко чыкты). «weil» менен экинчи бөлүк — себеп, ал эми «obwohl» макул болбостукту көрсөтөт.',
    ),
  },
  {
    id: 'b1-ex-30-06',
    type: 'order',
    unit: 30,
    concept: 'b1-konsekutiv-final',
    prompt: 'Bilde den Satz.',
    promptRu: 'Было так шумно, что мы ничего не поняли.',
    promptKy: 'Ушунчалык ызы-чуу болгондуктан, биз эч нерсе түшүнгөн жокпуз.',
    words: ['dass', 'haben.', 'Es', 'nichts', 'laut,', 'wir', 'war', 'so', 'verstanden'],
    answer: 'Es war so laut, dass wir nichts verstanden haben.',
    why: w(
      'Главная часть «Es war so laut», затем запятая и dass; в придаточной части подлежащее, дополнение, Partizip II (verstanden) и haben — в самом конце.',
      'Башкы бөлүк «Es war so laut», андан кийин үтүр жана dass; кошумча бөлүктө ээ, толуктоочу, Partizip II (verstanden) жана haben эң аягында.',
    ),
  },
  {
    id: 'b1-ex-30-07',
    type: 'fill',
    unit: 30,
    concept: 'b1-textkohaesion',
    prompt: '___ ist der Platz zentral. Zweitens ist er ruhig.',
    promptRu: 'Во-первых, площадь находится в центре. Во-вторых, там тихо.',
    promptKy: 'Биринчиден, аянт борбордо жайгашкан. Экинчиден, ал жерде тынч.',
    options: ['Erstens', 'Dennoch', 'Daher'],
    answer: 'Erstens',
    why: w(
      'Вторая фраза начинается со слова «Zweitens», значит, первая должна начинаться с «Erstens». Dennoch и daher так не работают.',
      'Экинчи фраза «Zweitens» сөзү менен башталат, демек биринчиси «Erstens» менен башталышы керек. Dennoch жана daher мындай иштебейт.',
    ),
  },
  {
    id: 'b1-ex-30-08',
    type: 'choice',
    unit: 30,
    concept: 'b1-textkohaesion',
    prompt: 'Welcher Text ist logisch?',
    promptRu: 'Какой текст логичен?',
    promptKy: 'Кайсы текст логикалуу?',
    options: [
      'Es gibt Kritik. Daher machen viele mit.',
      'Es gibt Kritik. Zum Beispiel machen viele mit.',
      'Es gibt Kritik. Dennoch machen viele mit.',
    ],
    answer: 'Es gibt Kritik. Dennoch machen viele mit.',
    why: w(
      'Критика и участие — противопоставление, поэтому «dennoch» («всё же»). «Daher» означало бы, что критика — причина участия, а «zum Beispiel» вводит пример.',
      'Сын менен катышуу — карама-каршылык, ошондуктан «dennoch» («ошентсе да»). «Daher» сын катышуунун себеби экенин билдирмек, ал эми «zum Beispiel» мисал киргизет.',
    ),
  },
  {
    id: 'b1-ex-30-09',
    type: 'choice',
    unit: 30,
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Obwohl es regnet, kommen viele Nachbarn.', 'Obwohl es regnet, viele Nachbarn kommen.', 'Obwohl es regnet kommen, viele Nachbarn.'],
    answer: 'Obwohl es regnet, kommen viele Nachbarn.',
    why: w(
      '↻ Юнит 22: в придаточной части с obwohl глагол стоит в конце (regnet), а после запятой главная часть начинается с глагола (kommen).',
      '↻ 22-бөлүм: obwohl менен кошумча бөлүктө этиш аягында (regnet), ал эми үтүрдөн кийин башкы бөлүк этиштен башталат (kommen).',
    ),
  },
  {
    id: 'b1-ex-30-10',
    type: 'fill',
    unit: 30,
    prompt: 'Der Spielplatz ___ gerade von Freiwilligen gebaut.',
    promptRu: 'Площадка сейчас строится силами добровольцев.',
    promptKy: 'Оюн аянтчасы азыр ыктыярчылар тарабынан курулуп жатат.',
    options: ['wird', 'werden', 'hat'],
    answer: 'wird',
    why: w(
      '↻ Юнит 24: Passiv Präsens = werden + Partizip II. Подлежащее «der Spielplatz» — единственное число, поэтому wird. Werden — множественное число, hat — не Passiv.',
      '↻ 24-бөлүм: Passiv Präsens = werden + Partizip II. «der Spielplatz» ээси — жекелик сан, ошондуктан wird. Werden — көптүк сан, hat — Passiv эмес.',
    ),
  },
]

/** Test definition `unit-30` (kind topic, 15 questions). */
export const UNIT_30_TEST: B1TestDef = {
  id: 'unit-30',
  title: s('Итоговый тест: юнит 30', 'Жыйынтыктоочу тест: 30-бөлүм'),
  kind: 'topic',
  level: 'B1',
  unit: 30,
  size: 15,
}

/**
 * Unit 30 final test, `b1-ft-30-01` … `-15`. Composition (curriculum v2 §7.2): 8 grammar (2 `damit` / `um … zu` and sodass / so … dass versus weil, 2 text-structuring words,
 * 2 Nomen-Verb-Verbindungen, 2 recycled ↻: obwohl / trotzdem of Unit 22 and Passiv of Unit 24), 3 vocabulary, 4 reading, 0 listening — listening items enter a test only after the
 * text-to-speech playback has been verified on real devices. Reading items carry the German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate only the instruction
 * and the question. All texts are fictional. Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_30_FINAL: A2TestQuestion[] = [
  {
    id: 'b1-ft-30-01',
    prompt: 'Ich lerne Deutsch, ___ mehr Menschen zu verstehen.',
    promptRu: 'Я учу немецкий, чтобы понимать больше людей.',
    promptKy: 'Мен көбүрөөк адамдарды түшүнүү үчүн немис тилин үйрөнүп жатам.',
    options: ['um', 'damit', 'sodass'],
    answer: 'um',
    skill: 'grammar',
    concept: 'b1-konsekutiv-final',
    why: s(
      'Подлежащее одно и то же (ich … ich), а в конце стоит инфинитив с zu: um … zu. Damit и sodass требуют придаточной части со спрягаемым глаголом.',
      'Ээ бирдей (ich … ich), аягында zu менен инфинитив турат: um … zu. damit жана sodass жакка жараша өзгөргөн этиши бар кошумча бөлүктү талап кылат.',
    ),
  },
  {
    id: 'b1-ft-30-02',
    prompt: 'Welcher Satz nennt eine Folge?',
    promptRu: 'Какое предложение называет следствие?',
    promptKy: 'Кайсы сүйлөм натыйжаны атайт?',
    options: [
      'Das Fest war voll, weil viele Leute kamen.',
      'Es kamen so viele Leute, dass das Fest voll war.',
      'Das Fest war voll, obwohl wenige Leute kamen.',
    ],
    answer: 'Es kamen so viele Leute, dass das Fest voll war.',
    skill: 'grammar',
    concept: 'b1-konsekutiv-final',
    why: s(
      'So … dass называет степень и следствие: так много людей, что праздник был полон. В «weil» часть называет причину, а «obwohl» — уступку.',
      'So … dass даражаны жана натыйжаны атайт: ушунчалык көп адам келди, ошондуктан майрам толуп калды. «weil» менен бөлүк себепти атайт, ал эми «obwohl» — макул болбостукту.',
    ),
  },
  {
    id: 'b1-ft-30-03',
    prompt: 'Es gibt viele Freiwillige. ___ können wir mehr Hilfe anbieten.',
    promptRu: 'Есть много добровольцев. Поэтому мы можем предложить больше помощи.',
    promptKy: 'Ыктыярчылар көп. Ошондуктан биз көбүрөөк жардам сунуштай алабыз.',
    options: ['Dennoch', 'Zum Beispiel', 'Daher'],
    answer: 'Daher',
    skill: 'grammar',
    concept: 'b1-textkohaesion',
    why: s(
      'Из первого предложения следует второе: «daher» («поэтому»). Dennoch выражает контраст, а zum Beispiel вводит пример.',
      'Биринчи сүйлөмдөн экинчиси келип чыгат: «daher» («ошондуктан»). Dennoch карама-каршылыкты билдирет, ал эми zum Beispiel мисал киргизет.',
    ),
  },
  {
    id: 'b1-ft-30-04',
    prompt: 'Welche Reihenfolge ist logisch?',
    promptRu: 'Какой порядок логичен?',
    promptKy: 'Кайсы ирет логикалуу?',
    options: [
      'Außerdem ist es billig. Erstens ist der Platz zentral. Daher kommen viele.',
      'Erstens ist der Platz zentral. Außerdem ist es billig. Daher kommen viele.',
      'Daher kommen viele. Erstens ist der Platz zentral. Außerdem ist es billig.',
    ],
    answer: 'Erstens ist der Platz zentral. Außerdem ist es billig. Daher kommen viele.',
    skill: 'grammar',
    concept: 'b1-textkohaesion',
    why: s(
      'Сначала «erstens», потом «außerdem», в конце вывод «daher». Если вывод стоит в начале или «außerdem» перед «erstens», связь теряется.',
      'Адегенде «erstens», андан кийин «außerdem», аягында «daher» жыйынтыгы. Жыйынтык башында же «außerdem» «erstens» дан мурун турса, байланыш жоголот.',
    ),
  },
  {
    id: 'b1-ft-30-05',
    prompt: 'Der Raum steht allen Gruppen zur ___.',
    promptRu: 'Помещение в распоряжении всех групп.',
    promptKy: 'Бөлмө бардык топтордун карамагында.',
    options: ['Verfügung', 'Hilfe', 'Sprache'],
    answer: 'Verfügung',
    skill: 'grammar',
    concept: 'b1-nomen-verb-verbindungen',
    why: s(
      'Устойчивая пара: «zur Verfügung stehen» (быть в распоряжении). Hilfe и Sprache в этой паре не используются.',
      'Туруктуу жуп: «zur Verfügung stehen» (карамакта болуу). Hilfe жана Sprache бул жупта колдонулбайт.',
    ),
  },
  {
    id: 'b1-ft-30-06',
    prompt: 'Jeder kann einen kleinen Beitrag ___.',
    promptRu: 'Каждый может внести небольшой вклад.',
    promptKy: 'Ар ким кичинекей салым кошо алат.',
    options: ['machen', 'geben', 'leisten'],
    answer: 'leisten',
    skill: 'grammar',
    concept: 'b1-nomen-verb-verbindungen',
    why: s(
      'Устойчивая пара: «einen Beitrag leisten» (внести вклад). С Beitrag не говорят «machen» или «geben».',
      'Туруктуу жуп: «einen Beitrag leisten» (салым кошуу). Beitrag менен «machen» же «geben» деп айтышпайт.',
    ),
  },
  {
    id: 'b1-ft-30-07',
    prompt: 'Es regnet, ___ gehen wir zum Fest.',
    promptRu: 'Идёт дождь, всё равно мы идём на праздник.',
    promptKy: 'Жамгыр жаап жатат, баары бир биз майрамга барабыз.',
    options: ['trotzdem', 'deshalb', 'weil'],
    answer: 'trotzdem',
    skill: 'grammar',
    concept: 'b1-konzessive-saetze',
    why: s(
      '↻ Юнит 22: дождь не помеха — «trotzdem» («всё равно»). Deshalb означало бы, что дождь — причина идти, а weil требует придаточной части.',
      '↻ 22-бөлүм: жамгыр бөгөт эмес — «trotzdem» («баары бир»). Deshalb жамгыр баруунун себеби экенин билдирмек, ал эми weil кошумча бөлүктү талап кылат.',
    ),
  },
  {
    id: 'b1-ft-30-08',
    prompt: 'Welcher Satz ist Passiv?',
    promptRu: 'Какое предложение — Passiv?',
    promptKy: 'Кайсы сүйлөм — Passiv?',
    options: ['Die Nachbarn bauen den Garten.', 'Der Garten wird von den Nachbarn gebaut.', 'Der Garten ist sehr schön.'],
    answer: 'Der Garten wird von den Nachbarn gebaut.',
    skill: 'grammar',
    concept: 'b1-passiv-praesens',
    why: s(
      '↻ Юнит 24: Passiv = werden + Partizip II (wird … gebaut), действующее лицо — с von. Остальные предложения — Aktiv и описание.',
      '↻ 24-бөлүм: Passiv = werden + Partizip II (wird … gebaut), аракет кылуучу von менен. Калган сүйлөмдөр — Aktiv жана сүрөттөө.',
    ),
  },
  {
    id: 'b1-ft-30-09',
    prompt: 'In unserem Haus wohnen Menschen aus zehn Ländern. Das ist echte ___.',
    promptRu: 'В нашем доме живут люди из десяти стран. Это настоящее ___.',
    promptKy: 'Биздин үйдө он өлкөдөн келген адамдар жашайт. Бул чыныгы ___.',
    options: ['Spende', 'Versammlung', 'Vielfalt'],
    answer: 'Vielfalt',
    skill: 'vocabulary',
    why: s(
      'Много разных людей вместе — это Vielfalt (разнообразие). Spende — пожертвование, Versammlung — собрание.',
      'Көп ар кандай адамдар бирге — бул Vielfalt (ар түрдүүлүк). Spende — кайрымдуулук акча, Versammlung — чогулуш.',
    ),
  },
  {
    id: 'b1-ft-30-10',
    prompt: 'Sie bekommt für ihre Arbeit im Verein kein Geld. Sie arbeitet ___.',
    promptRu: 'За работу в объединении она не получает денег. Она работает ___.',
    promptKy: 'Бирикмедеги иши үчүн ал акча албайт. Ал ___ иштейт.',
    options: ['ehrenamtlich', 'schüchtern', 'kräftig'],
    answer: 'ehrenamtlich',
    skill: 'vocabulary',
    why: s(
      'Работа без оплаты на благо других — ehrenamtlich. Schüchtern — застенчивый, kräftig — крепкий.',
      'Башкалардын пайдасы үчүн акысыз иш — ehrenamtlich. Schüchtern — уялчаак, kräftig — бекем.',
    ),
  },
  {
    id: 'b1-ft-30-11',
    prompt: 'Mein Nachbar spricht gern mit neuen Leuten und hilft sofort. Er ist sehr ___.',
    promptRu: 'Мой сосед охотно говорит с новыми людьми и сразу помогает. Он очень ___.',
    promptKy: 'Менин кошуна жаңы адамдар менен сүйлөшкөндү жакшы көрөт жана дароо жардам берет. Ал абдан ___.',
    options: ['schüchtern', 'aufgeschlossen', 'schlank'],
    answer: 'aufgeschlossen',
    skill: 'vocabulary',
    why: s(
      'Открытый к людям и новому — aufgeschlossen. Schüchtern — наоборот, schlank — о телосложении.',
      'Адамдарга жана жаңылыкка ачык — aufgeschlossen. Schüchtern — тескерисинче, schlank — дене түзүлүшү жөнүндө.',
    ),
  },
  {
    id: 'b1-ft-30-12',
    prompt:
      'Lies die Mitteilung (erfunden): „Der Verein „Gartenfreunde“ sucht Helfer für den Hof. Wir treffen uns am Samstag um 10 Uhr, um Beete anzulegen. Bitte bringen Sie Handschuhe mit, damit sich niemand verletzt. Wer nicht kommen kann, gibt bitte bis Freitag Bescheid.“ Wann treffen sich die Helfer?',
    promptRu: 'Прочитайте сообщение (вымышленное). Когда встречаются помощники?',
    promptKy: 'Билдирүүнү окуңуз (ойдон чыгарылган). Жардамчылар качан жолугушат?',
    options: ['Am Freitag um 10 Uhr.', 'Am Sonntag um 9 Uhr.', 'Am Samstag um 10 Uhr.'],
    answer: 'Am Samstag um 10 Uhr.',
    skill: 'reading',
    why: s(
      'В тексте: «Wir treffen uns am Samstag um 10 Uhr». В пятницу нужно только сообщить, если вы не придёте.',
      'Текстте: «Wir treffen uns am Samstag um 10 Uhr». Жума күнү келе албасаңыз гана билдирүү керек.',
    ),
  },
  {
    id: 'b1-ft-30-13',
    prompt:
      'Lies die Mitteilung (erfunden): „Der Verein „Gartenfreunde“ sucht Helfer für den Hof. Wir treffen uns am Samstag um 10 Uhr, um Beete anzulegen. Bitte bringen Sie Handschuhe mit, damit sich niemand verletzt. Wer nicht kommen kann, gibt bitte bis Freitag Bescheid.“ Warum sollen die Helfer Handschuhe mitbringen?',
    promptRu: 'Прочитайте сообщение (вымышленное). Почему помощники должны взять перчатки?',
    promptKy: 'Билдирүүнү окуңуз (ойдон чыгарылган). Жардамчылар эмне үчүн кол кап алып келиши керек?',
    options: ['Weil der Verein keine Handschuhe hat.', 'Damit sich niemand verletzt.', 'Um Beete anzulegen.'],
    answer: 'Damit sich niemand verletzt.',
    skill: 'reading',
    why: s(
      'В тексте: «Bitte bringen Sie Handschuhe mit, damit sich niemand verletzt». Другие причины в тексте не названы.',
      'Текстте: «Bitte bringen Sie Handschuhe mit, damit sich niemand verletzt». Башка себептер текстте аталган эмес.',
    ),
  },
  {
    id: 'b1-ft-30-14',
    prompt:
      'Lies den Brief (erfunden): „Liebe Nachbarn, ich finde, dass wir einen neuen Spielplatz brauchen. Erstens gibt es im Viertel viele Kinder. Außerdem ist der alte Platz kaputt. Frau Kern findet das zu teuer. Dennoch möchte ich einen Vorschlag machen: Wir sammeln Spenden.“ Was schlägt die Person vor?',
    promptRu: 'Прочитайте письмо (вымышленное). Что предлагает автор?',
    promptKy: 'Катты окуңуз (ойдон чыгарылган). Автор эмнени сунуштайт?',
    options: ['Spenden für den Spielplatz sammeln.', 'Den alten Platz schließen.', 'Frau Kern um Geld bitten.'],
    answer: 'Spenden für den Spielplatz sammeln.',
    skill: 'reading',
    why: s(
      'В тексте: «Ich möchte einen Vorschlag machen: Wir sammeln Spenden». Закрыть площадку и просить деньги у госпожи Керн автор не предлагает.',
      'Текстте: «Ich möchte einen Vorschlag machen: Wir sammeln Spenden». Автор аянтчаны жабууну да, Керн айымдан акча сурууну да сунуштабайт.',
    ),
  },
  {
    id: 'b1-ft-30-15',
    prompt:
      'Lies den Brief (erfunden): „Liebe Nachbarn, ich finde, dass wir einen neuen Spielplatz brauchen. Erstens gibt es im Viertel viele Kinder. Außerdem ist der alte Platz kaputt. Frau Kern findet das zu teuer. Dennoch möchte ich einen Vorschlag machen: Wir sammeln Spenden.“ Was denkt Frau Kern?',
    promptRu: 'Прочитайте письмо (вымышленное). Что думает госпожа Керн?',
    promptKy: 'Катты окуңуз (ойдон чыгарылган). Керн айым эмне деп ойлойт?',
    options: ['Sie findet den Spielplatz nicht wichtig.', 'Sie möchte selbst Spenden sammeln.', 'Sie findet das Projekt zu teuer.'],
    answer: 'Sie findet das Projekt zu teuer.',
    skill: 'reading',
    why: s(
      'В тексте: «Frau Kern findet das zu teuer». О важности площадки или сборе пожертвований она ничего не говорит.',
      'Текстте: «Frau Kern findet das zu teuer». Ал аянтчанын маанилүүлүгү же кайрымдуулук акча чогултуу жөнүндө эч нерсе айтпайт.',
    ),
  },
]
