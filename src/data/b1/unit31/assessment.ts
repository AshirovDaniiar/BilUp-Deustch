import type { Exercise, L10n } from '../../types'
import type { A2TestQuestion, L10nStrict } from '../../a2/types'
import type { B1TestDef } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 31 revision (Wiederholung) exercises, `b1-ex-31-01` … `-10`: 4 fill / 4 choice / 2 order on the unit's two concepts (formal language × 4, Aktiv ↔ Passiv and
 * Zustandspassiv × 4), plus 2 RECYCLED items (↻ Konjunktiv II of Units 25 / 27, ↻ Passiv Präsens of Unit 24) without a concept of this unit — the spaced-revision part.
 * Authored independently of the final test: no prompt, sentence or answer is shared. The Zustandspassiv appears only with the ten participles of the list (ausgefüllt, unterschrieben,
 * geschlossen, geöffnet, bearbeitet, erledigt, genehmigt, abgelehnt, geprüft, eingereicht); the receptive constructions (Passiv Perfekt, Konjunktiv II of the past) never appear in a gap or a
 * word order. A gap that contrasts werden and sein carries a clear cue (gerade / "Die Tür ist zu"), so that exactly one filler is correct. All offices and documents are fictional.
 */
export const UNIT_31_EXERCISES: Exercise[] = [
  {
    id: 'b1-ex-31-01',
    type: 'fill',
    unit: 31,
    concept: 'b1-formelle-sprache',
    prompt: 'Ich möchte Sie bitten, den Antrag bis Freitag ___ bearbeiten.',
    promptRu: 'Я хотел бы попросить вас рассмотреть заявление до пятницы.',
    promptKy: 'Мен сизден арызды жума күнүнө чейин карап чыгууну өтүнгүм келет.',
    options: ['zu', 'um', 'ob'],
    answer: 'zu',
    why: w(
      'После «Ich möchte Sie bitten,» идёт инфинитив с zu, который стоит прямо перед глаголом: «… zu bearbeiten». Um zu — для цели, ob — «ли».',
      '«Ich möchte Sie bitten,» дан кийин zu менен инфинитив келет, ал этиштин алдында дароо турат: «… zu bearbeiten». Um zu — максат үчүн, ob — «же» дегенди билдирет.',
    ),
  },
  {
    id: 'b1-ex-31-02',
    type: 'choice',
    unit: 31,
    concept: 'b1-formelle-sprache',
    prompt: 'Sie schreiben an ein Amt. Welcher Satz passt?',
    promptRu: 'Вы пишете в учреждение. Какое предложение подходит?',
    promptKy: 'Сиз мекемеге жазып жатасыз. Кайсы сүйлөм ылайыктуу?',
    options: [
      'Könnten Sie mir bitte mitteilen, wann das Amt geöffnet ist?',
      'Sag mir mal, wann das Amt aufmacht!',
      'Wann ist das Amt offen, hallo?',
    ],
    answer: 'Könnten Sie mir bitte mitteilen, wann das Amt geöffnet ist?',
    why: w(
      'Для учреждения нужны форма Sie, Konjunktiv II с bitte и формальный глагол mitteilen. Остальные варианты слишком разговорные и не вежливы.',
      'Мекеме үчүн Sie формасы, bitte менен Konjunktiv II жана расмий mitteilen этиши керек. Калган варианттар өтө оозеки жана сылык эмес.',
    ),
  },
  {
    id: 'b1-ex-31-03',
    type: 'order',
    unit: 31,
    concept: 'b1-formelle-sprache',
    prompt: 'Bilde den Satz.',
    promptRu: 'Прошу письменное подтверждение.',
    promptKy: 'Жазуу жүзүндөгү ырастоону сурайм.',
    words: ['Bestätigung.', 'um', 'Ich', 'eine', 'bitte', 'schriftliche'],
    answer: 'Ich bitte um eine schriftliche Bestätigung.',
    why: w(
      'Подлежащее и глагол (Ich bitte), затем предлог um и дополнение в Akkusativ: «um eine schriftliche Bestätigung».',
      'Ээ жана этиш (Ich bitte), андан кийин um предлогу жана Akkusativдеги толуктоочу: «um eine schriftliche Bestätigung».',
    ),
  },
  {
    id: 'b1-ex-31-04',
    type: 'choice',
    unit: 31,
    concept: 'b1-formelle-sprache',
    prompt: 'Welche Anrede passt zu einem Brief an ein Amt, wenn Sie den Namen nicht kennen?',
    promptRu: 'Какое обращение подходит для письма в учреждение, если вы не знаете имени?',
    promptKy: 'Атын билбесеңиз, мекемеге каттагы кайсы кайрылуу ылайыктуу?',
    options: ['Sehr geehrte Damen und Herren,', 'Hallo zusammen,', 'Liebe Leute,'],
    answer: 'Sehr geehrte Damen und Herren,',
    why: w(
      'Если адресат неизвестен, в официальном письме пишут «Sehr geehrte Damen und Herren,». «Hallo zusammen» и «Liebe Leute» — разговорные.',
      'Адресат белгисиз болсо, расмий катта «Sehr geehrte Damen und Herren,» деп жазылат. «Hallo zusammen» жана «Liebe Leute» — оозеки.',
    ),
  },
  {
    id: 'b1-ex-31-05',
    type: 'fill',
    unit: 31,
    concept: 'b1-aktiv-passiv-zustandspassiv',
    prompt: 'Der Antrag ___ gerade von der Behörde bearbeitet.',
    promptRu: 'Заявление сейчас рассматривается ведомством.',
    promptKy: 'Арыз азыр мекеме тарабынан каралып жатат.',
    options: ['wird', 'ist', 'hat'],
    answer: 'wird',
    why: w(
      'Слово gerade показывает процесс, который идёт сейчас: werden + Partizip II (Vorgangspassiv). Ist bearbeitet описывало бы готовый результат, а hat не образует Passiv.',
      'gerade сөзү азыр жүрүп жаткан процессти көрсөтөт: werden + Partizip II (Vorgangspassiv). Ist bearbeitet даяр жыйынтыкты сүрөттөмөк, ал эми hat Passiv түзбөйт.',
    ),
  },
  {
    id: 'b1-ex-31-06',
    type: 'choice',
    unit: 31,
    concept: 'b1-aktiv-passiv-zustandspassiv',
    prompt: 'Welcher Satz ist die richtige Passiv-Form von „Die Behörde prüft die Unterlagen“?',
    promptRu: 'Какое предложение — правильная форма Passiv для «Die Behörde prüft die Unterlagen»?',
    promptKy: 'Кайсы сүйлөм «Die Behörde prüft die Unterlagen» сүйлөмүнүн туура Passiv формасы?',
    options: [
      'Die Unterlagen werden von der Behörde geprüft.',
      'Die Unterlagen wird von der Behörde prüfen.',
      'Die Unterlagen sind von der Behörde prüft.',
    ],
    answer: 'Die Unterlagen werden von der Behörde geprüft.',
    why: w(
      'Die Unterlagen — множественное число и новое подлежащее: werden + Partizip II (geprüft), действующее лицо — von der Behörde. В других вариантах неверны форма werden или причастие.',
      'Die Unterlagen — көптүк сан жана жаңы ээ: werden + Partizip II (geprüft), аракет кылуучу — von der Behörde. Башка варианттарда werden формасы же причастие туура эмес.',
    ),
  },
  {
    id: 'b1-ex-31-07',
    type: 'order',
    unit: 31,
    concept: 'b1-aktiv-passiv-zustandspassiv',
    prompt: 'Bilde den Satz.',
    promptRu: 'Бланк нужно подать до пятницы.',
    promptKy: 'Бланкты жума күнүнө чейин тапшыруу керек.',
    words: ['werden.', 'Das', 'bis', 'muss', 'eingereicht', 'Formular', 'Freitag'],
    answer: 'Das Formular muss bis Freitag eingereicht werden.',
    why: w(
      'Модальный глагол muss на втором месте, а Partizip II (eingereicht) и werden — в самом конце предложения.',
      'Модалдык этиш muss экинчи орунда, ал эми Partizip II (eingereicht) жана werden сүйлөмдүн эң аягында.',
    ),
  },
  {
    id: 'b1-ex-31-08',
    type: 'fill',
    unit: 31,
    concept: 'b1-aktiv-passiv-zustandspassiv',
    prompt: 'Die Tür ist zu: Das Amt ___ heute geschlossen.',
    promptRu: 'Дверь закрыта: ведомство сегодня закрыто.',
    promptKy: 'Эшик жабык: мекеме бүгүн жабык.',
    options: ['ist', 'wird', 'hat'],
    answer: 'ist',
    why: w(
      'Дверь уже закрыта — значит, нужен результат: sein + Partizip II (Zustandspassiv). «Wird geschlossen» описывало бы сам процесс закрытия, а hat не образует Passiv.',
      'Эшик жабылган — демек, жыйынтык керек: sein + Partizip II (Zustandspassiv). «Wird geschlossen» жабылуу процессин сүрөттөмөк, ал эми hat Passiv түзбөйт.',
    ),
  },
  {
    id: 'b1-ex-31-09',
    type: 'choice',
    unit: 31,
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Wenn ich mehr Zeit hätte, würde ich persönlich kommen.',
      'Wenn ich mehr Zeit hatte, würde ich persönlich kommen.',
      'Wenn ich mehr Zeit hätte, ich würde persönlich kommen.',
    ],
    answer: 'Wenn ich mehr Zeit hätte, würde ich persönlich kommen.',
    why: w(
      '↻ Юниты 25 и 27: в нереальном условии — hätte (Konjunktiv II), а главная часть после запятой начинается с глагола (würde ich).',
      '↻ 25 жана 27-бөлүмдөр: реалдуу эмес шартта — hätte (Konjunktiv II), ал эми үтүрдөн кийинки башкы бөлүк этиштен башталат (würde ich).',
    ),
  },
  {
    id: 'b1-ex-31-10',
    type: 'fill',
    unit: 31,
    prompt: 'Die Unterlagen ___ morgen per Post geschickt.',
    promptRu: 'Документы будут отправлены завтра по почте.',
    promptKy: 'Документтер эртең почта аркылуу жөнөтүлөт.',
    options: ['werden', 'wird', 'sind'],
    answer: 'werden',
    why: w(
      '↻ Юнит 24: Passiv Präsens = werden + Partizip II. Подлежащее «die Unterlagen» — множественное число, поэтому werden, а не wird.',
      '↻ 24-бөлүм: Passiv Präsens = werden + Partizip II. «die Unterlagen» ээси — көптүк сан, ошондуктан wird эмес, werden.',
    ),
  },
]

/** Test definition `unit-31` (kind topic, 15 questions). */
export const UNIT_31_TEST: B1TestDef = {
  id: 'unit-31',
  title: s('Итоговый тест: юнит 31', 'Жыйынтыктоочу тест: 31-бөлүм'),
  kind: 'topic',
  level: 'B1',
  unit: 31,
  size: 15,
}

/**
 * Unit 31 final test, `b1-ft-31-01` … `-15`. Composition (curriculum v2 §7.2): 8 grammar (3 formal language: choose the register, Gruß, the preposition of the request; 3 Aktiv ↔ Passiv and
 * Zustandspassiv: rewrite, Vorgang versus Zustand ×2; 2 recycled ↻: Konjunktiv II of Unit 27 and Passiv with a modal verb of Unit 26), 3 vocabulary, 4 reading (find the deadline /
 * the document in the text), 0 listening — listening items enter a test only after the text-to-speech playback has been verified on real devices. Reading items carry the German text
 * UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate only the instruction and the question. All offices, documents and deadlines are fictional and attributed to the fictional
 * document. Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_31_FINAL: A2TestQuestion[] = [
  {
    id: 'b1-ft-31-01',
    prompt: 'Sie schreiben an eine Behörde. Welcher Satz passt?',
    promptRu: 'Вы пишете в ведомство. Какое предложение подходит?',
    promptKy: 'Сиз ведомствого жазып жатасыз. Кайсы сүйлөм ылайыктуу?',
    options: [
      'Könnten Sie mir bitte mitteilen, bis wann ich den Nachweis vorlegen muss?',
      'Sag mir mal, bis wann ich den Nachweis bringen soll!',
      'Bis wann muss ich das Zeug bringen?',
    ],
    answer: 'Könnten Sie mir bitte mitteilen, bis wann ich den Nachweis vorlegen muss?',
    skill: 'grammar',
    concept: 'b1-formelle-sprache',
    why: s(
      'В официальном письме нужны Sie, Konjunktiv II с bitte и формальные слова (mitteilen, vorlegen). Остальные варианты — разговорные и невежливые.',
      'Расмий катта Sie, bitte менен Konjunktiv II жана расмий сөздөр (mitteilen, vorlegen) керек. Калган варианттар — оозеки жана сылык эмес.',
    ),
  },
  {
    id: 'b1-ft-31-02',
    prompt: 'Mit freundlichen ___',
    promptRu: 'Формула прощания в конце официального письма.',
    promptKy: 'Расмий каттын аягындагы коштошуу формуласы.',
    options: ['Grüße', 'Grüßen', 'Gruß'],
    answer: 'Grüßen',
    skill: 'grammar',
    concept: 'b1-formelle-sprache',
    why: s(
      'После mit нужен Dativ множественного числа: «Mit freundlichen Grüßen».',
      'mit дан кийин көптүк сандагы Dativ керек: «Mit freundlichen Grüßen».',
    ),
  },
  {
    id: 'b1-ft-31-03',
    prompt: 'Ich bitte ___ eine schriftliche Antwort bis Freitag.',
    promptRu: 'Прошу письменный ответ до пятницы.',
    promptKy: 'Жума күнүнө чейин жазуу жүзүндөгү жооп сурайм.',
    options: ['für', 'an', 'um'],
    answer: 'um',
    skill: 'grammar',
    concept: 'b1-formelle-sprache',
    why: s(
      'Просят «о чём-то» с предлогом um: «bitten um + Akkusativ».',
      '«Бир нерсени» сурашканда um предлогу колдонулат: «bitten um + Akkusativ».',
    ),
  },
  {
    id: 'b1-ft-31-04',
    prompt: 'Die Behörde prüft den Antrag. Welcher Satz sagt dasselbe im Passiv?',
    promptRu: 'Какое предложение говорит то же самое в Passiv?',
    promptKy: 'Кайсы сүйлөм ошол эле нерсени Passivде айтат?',
    options: ['Der Antrag prüft die Behörde.', 'Der Antrag wird von der Behörde geprüft.', 'Der Antrag ist von der Behörde prüfen.'],
    answer: 'Der Antrag wird von der Behörde geprüft.',
    skill: 'grammar',
    concept: 'b1-aktiv-passiv-zustandspassiv',
    why: s(
      'Акк.-дополнение (den Antrag) становится подлежащим, глагол — wird + Partizip II, действующее лицо — von der Behörde. В других вариантах смысл или форма неверны.',
      'Akkusativдеги толуктоочу (den Antrag) ээ болот, этиш — wird + Partizip II, аракет кылуучу — von der Behörde. Башка варианттарда маани же форма туура эмес.',
    ),
  },
  {
    id: 'b1-ft-31-05',
    prompt: 'Das Amt schließt gerade die Tür. Welcher Satz beschreibt den Vorgang?',
    promptRu: 'Ведомство сейчас закрывает дверь. Какое предложение описывает процесс?',
    promptKy: 'Мекеме азыр эшикти жаап жатат. Кайсы сүйлөм процессти сүрөттөйт?',
    options: ['Die Tür wird gerade geschlossen.', 'Die Tür ist geschlossen.', 'Die Tür hat geschlossen.'],
    answer: 'Die Tür wird gerade geschlossen.',
    skill: 'grammar',
    concept: 'b1-aktiv-passiv-zustandspassiv',
    why: s(
      'Процесс, который идёт сейчас, описывает werden + Partizip II с gerade. «Ist geschlossen» — результат, а «hat geschlossen» не Passiv.',
      'Азыр жүрүп жаткан процессти werden + Partizip II gerade менен сүрөттөйт. «Ist geschlossen» — жыйынтык, ал эми «hat geschlossen» Passiv эмес.',
    ),
  },
  {
    id: 'b1-ft-31-06',
    prompt: 'Sie rufen an, aber niemand kommt: Das Büro ist zu. Welcher Satz beschreibt den Zustand (das Ergebnis)?',
    promptRu: 'Вы звоните, но никто не отвечает: бюро закрыто. Какое предложение описывает состояние (результат)?',
    promptKy: 'Сиз чалып жатасыз, бирок эч ким жок: бюро жабык. Кайсы сүйлөм абалды (жыйынтыкты) сүрөттөйт?',
    options: ['Das Büro wird geschlossen.', 'Das Büro wird gerade geschlossen.', 'Das Büro ist geschlossen.'],
    answer: 'Das Büro ist geschlossen.',
    skill: 'grammar',
    concept: 'b1-aktiv-passiv-zustandspassiv',
    why: s(
      'Закрыто уже сейчас — это результат: sein + Partizip II (Zustandspassiv). Обе формы с wird описывают сам процесс закрытия.',
      'Азыр эле жабык — бул жыйынтык: sein + Partizip II (Zustandspassiv). wird менен эки форма тең жабылуу процессин сүрөттөйт.',
    ),
  },
  {
    id: 'b1-ft-31-07',
    prompt: 'Wenn ich mehr Zeit ___, würde ich noch einmal persönlich vorbeikommen.',
    promptRu: 'Если бы у меня было больше времени, я бы зашёл ещё раз лично.',
    promptKy: 'Менде убакыт көбүрөөк болсо, мен дагы бир жолу жеке өзүм келмекмин.',
    options: ['hätte', 'habe', 'hatte'],
    answer: 'hätte',
    skill: 'grammar',
    concept: 'b1-konjunktiv2-wuensche-irreal',
    why: s(
      '↻ Юнит 27: нереальное условие требует Konjunktiv II: hätte (+ würde в главной части). Habe — настоящее время, hatte — прошедшее.',
      '↻ 27-бөлүм: реалдуу эмес шарт Konjunktiv IIни талап кылат: hätte (+ башкы бөлүктө würde). Habe — азыркы чак, hatte — өткөн чак.',
    ),
  },
  {
    id: 'b1-ft-31-08',
    prompt: 'Der Antrag muss bis Freitag ___ werden.',
    promptRu: 'Заявление нужно подписать до пятницы.',
    promptKy: 'Арызга жума күнүнө чейин кол коюу керек.',
    options: ['unterschreiben', 'unterschrieben', 'unterschreibt'],
    answer: 'unterschrieben',
    skill: 'grammar',
    concept: 'b1-passiv-praeteritum-modal',
    why: s(
      '↻ Юнит 26: Passiv с модальным глаголом = модальный глагол … Partizip II + werden. Partizip II от unterschreiben — unterschrieben.',
      '↻ 26-бөлүм: модалдык этиш менен Passiv = модалдык этиш … Partizip II + werden. unterschreiben этишинин Partizip IIси — unterschrieben.',
    ),
  },
  {
    id: 'b1-ft-31-09',
    prompt: 'Ein Brief von der Behörde mit einer Entscheidung heißt ___.',
    promptRu: 'Письмо из ведомства с решением называется ___.',
    promptKy: 'Ведомстводон чечими бар кат ___ деп аталат.',
    options: ['Mahnung', 'Anlage', 'Bescheid'],
    answer: 'Bescheid',
    skill: 'vocabulary',
    why: s(
      'Уведомление с решением — Bescheid. Mahnung — напоминание об оплате, Anlage — приложение к письму.',
      'Чечими бар кабарлама — Bescheid. Mahnung — төлөө жөнүндө эскертүү, Anlage — каттын тиркемеси.',
    ),
  },
  {
    id: 'b1-ft-31-10',
    prompt: 'Für Ausweise ist ein anderes Amt ___.',
    promptRu: 'За удостоверения отвечает другое ведомство.',
    promptKy: 'Күбөлүктөр үчүн башка мекеме ___.',
    options: ['zuständig', 'vollständig', 'verbindlich'],
    answer: 'zuständig',
    skill: 'vocabulary',
    why: s(
      'Тот, кто отвечает за вопрос, — zuständig. Vollständig — полный, verbindlich — обязательный.',
      'Суроого жооптуу — zuständig. Vollständig — толук, verbindlich — милдеттүү.',
    ),
  },
  {
    id: 'b1-ft-31-11',
    prompt: 'Der Vertrag hat eine ___ von zwölf Monaten.',
    promptRu: 'У договора срок действия двенадцать месяцев.',
    promptKy: 'Келишимдин мөөнөтү он эки ай.',
    options: ['Mahnung', 'Laufzeit', 'Anlage'],
    answer: 'Laufzeit',
    skill: 'vocabulary',
    why: s(
      'Срок действия договора — Laufzeit. Mahnung — напоминание, Anlage — приложение.',
      'Келишимдин аракет мөөнөтү — Laufzeit. Mahnung — эскертүү, Anlage — тиркеме.',
    ),
  },
  {
    id: 'b1-ft-31-12',
    prompt:
      'Lies das Schreiben (erfunden): „Sehr geehrter Herr Aydin, Ihr Antrag ist eingegangen und wird gerade bearbeitet. Es fehlt noch der Mietvertrag. Bitte reichen Sie ihn laut diesem Schreiben bis zum 3. Juni nach. Mit freundlichen Grüßen, Frau Cetin“ Was fehlt noch?',
    promptRu: 'Прочитайте письмо (вымышленное). Что ещё не хватает?',
    promptKy: 'Катты окуңуз (ойдон чыгарылган). Дагы эмне жетишпейт?',
    options: ['Der Antrag.', 'Die Unterschrift.', 'Der Mietvertrag.'],
    answer: 'Der Mietvertrag.',
    skill: 'reading',
    why: s(
      'В письме: «Es fehlt noch der Mietvertrag». Заявление уже поступило, о подписи в письме речи нет.',
      'Катта: «Es fehlt noch der Mietvertrag». Арыз келип түштү, кол тамга жөнүндө катта сөз жок.',
    ),
  },
  {
    id: 'b1-ft-31-13',
    prompt:
      'Lies das Schreiben (erfunden): „Sehr geehrter Herr Aydin, Ihr Antrag ist eingegangen und wird gerade bearbeitet. Es fehlt noch der Mietvertrag. Bitte reichen Sie ihn laut diesem Schreiben bis zum 3. Juni nach. Mit freundlichen Grüßen, Frau Cetin“ Bis wann soll der Mietvertrag nachgereicht werden — laut diesem Schreiben?',
    promptRu: 'Прочитайте письмо (вымышленное). До какого срока нужно представить договор аренды — согласно этому письму?',
    promptKy: 'Катты окуңуз (ойдон чыгарылган). Ижара келишимин кайсы мөөнөткө чейин тапшыруу керек — бул кат боюнча?',
    options: ['Bis zum 13. Juni.', 'Bis zum 3. Juni.', 'Bis zum 30. Mai.'],
    answer: 'Bis zum 3. Juni.',
    skill: 'reading',
    why: s(
      'В письме: «bis zum 3. Juni» — срок принадлежит этому вымышленному письму. Другие даты в тексте не названы.',
      'Катта: «bis zum 3. Juni» — мөөнөт ушул ойдон чыгарылган катка таандык. Башка даталар текстте аталган эмес.',
    ),
  },
  {
    id: 'b1-ft-31-14',
    prompt:
      'Lies die E-Mail (erfunden): „Sehr geehrte Frau Lorenz, Ihre Anfrage ist bearbeitet. Eine Kündigung ist laut diesen Vertragsbedingungen nur schriftlich möglich. Bei Fragen ist Frau Demir Ihre Ansprechpartnerin. Diese Angaben gelten nur in diesem Beispielvertrag.“ Wie ist eine Kündigung laut dieser E-Mail möglich?',
    promptRu: 'Прочитайте письмо (вымышленное). Как возможно расторжение — согласно этому письму?',
    promptKy: 'Катты окуңуз (ойдон чыгарылган). Келишимди бузуу кандайча мүмкүн — бул кат боюнча?',
    options: ['Nur schriftlich.', 'Per Telefon.', 'Per Nachricht an Frau Demir.'],
    answer: 'Nur schriftlich.',
    skill: 'reading',
    why: s(
      'В письме: «eine Kündigung ist … nur schriftlich möglich» — условие вымышленного договора. О телефоне и сообщениях в тексте ничего не сказано.',
      'Катта: «eine Kündigung ist … nur schriftlich möglich» — ойдон чыгарылган келишимдин шарты. Телефон жана билдирүүлөр жөнүндө текстте эч нерсе айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-31-15',
    prompt:
      'Lies die E-Mail (erfunden): „Sehr geehrte Frau Lorenz, Ihre Anfrage ist bearbeitet. Eine Kündigung ist laut diesen Vertragsbedingungen nur schriftlich möglich. Bei Fragen ist Frau Demir Ihre Ansprechpartnerin. Diese Angaben gelten nur in diesem Beispielvertrag.“ Wer ist die Ansprechpartnerin?',
    promptRu: 'Прочитайте письмо (вымышленное). Кто контактное лицо?',
    promptKy: 'Катты окуңуз (ойдон чыгарылган). Байланыш адамы ким?',
    options: ['Frau Lorenz.', 'Herr Meyer.', 'Frau Demir.'],
    answer: 'Frau Demir.',
    skill: 'reading',
    why: s(
      'В письме: «Frau Demir ist Ihre Ansprechpartnerin». Госпожа Лоренц — адресат письма.',
      'Катта: «Frau Demir ist Ihre Ansprechpartnerin». Лоренц айым — каттын адресаты.',
    ),
  },
]
