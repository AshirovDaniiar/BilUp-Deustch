import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_27_SOURCE, UNIT_27_SPEAKING_ID } from './unit'

/**
 * Unit 27 texts: 2 listening scripts, 2 readings, 1 speaking scenario, 2 writing tasks (the main formal complaint and the short opinion micro-task).
 * Targets of the band for Units 27–29 and the curriculum text for Unit 27: reading 130–170 words, listening 130–160, sentences ≤ 25 words (95th percentile ≤ 20),
 * 6–7 speaking turns, writing 80–85 words. Original material; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native speaker.
 * ALL shops, products, people, order numbers and sums are FICTIONAL and labelled as such. Shop rules ("Umtausch nur vierzehn Tage") belong to the fictional shop;
 * nothing states what consumer law says, and nothing is legal advice. The learner's complaint, the seller's reply and any general remark are kept apart
 * (speaker labels, "Beschwerdebrief", "Kundenbewertung").
 * Scope guard (curriculum v2): Konjunktiv II for wishes, unreal conditions of the present and polite requests only (no Konjunktiv II of the past, no `als ob`);
 * Genitiv only after wegen / trotz / während / statt (closed list), no Genitiv attribute (Unit 29), no `statt … zu`; Kredit appears in ONE reading, glossed
 * (receptive); no damit (Unit 30), no relative clause with a preposition (Unit 29), no verb with an obligatory prepositional object (Unit 28), no `ohne … zu`.
 * Listening: the dialogues are played with the browser's text-to-speech (the existing mechanism of the listening lab). That playback has NOT been
 * verified on real devices, so no final-test item depends on audio.
 */
export const UNIT_27_LISTENING: ListeningExercise[] = [
  {
    id: 'b1-li-27-01',
    unit: 27,
    level: 'B1',
    title: 'Ein Anruf beim Kundenservice (erfunden)',
    lines: [
      {
        speaker: 'Herr Lang',
        text: 'Technikhaus Nord, Kundenservice, Lang. Guten Tag.',
        ru: 'Технохаус Норд, служба поддержки клиентов, Ланг. Добрый день.',
        ky: 'Технохаус Норд, кардарларга тейлөө кызматы, Ланг. Кайырлуу күн.',
      },
      {
        speaker: 'Frau Krüger',
        text: 'Guten Tag. Ich habe vor zwei Wochen einen Staubsauger gekauft. Wegen eines Defekts funktioniert er nicht mehr.',
        ru: 'Добрый день. Две недели назад я купила пылесос. Из-за дефекта он больше не работает.',
        ky: 'Кайырлуу күн. Эки жума мурун мен чаң соргуч сатып алдым. Кемчиликтен улам ал мындан ары иштебейт.',
      },
      {
        speaker: 'Herr Lang',
        text: 'Das tut mir leid. Könnten Sie mir bitte die Bestellnummer sagen?',
        ru: 'Мне очень жаль. Не могли бы вы назвать номер заказа?',
        ky: 'Кечиресиз. Заказ номерин айтып бере аласызбы?',
      },
      {
        speaker: 'Frau Krüger',
        text: 'Ja, sie lautet 4711.',
        ru: 'Да, он 4711.',
        ky: 'Ооба, ал 4711.',
      },
      {
        speaker: 'Herr Lang',
        text: 'Danke. Leider können wir ihn nicht umtauschen. Bei uns ist der Umtausch nur vierzehn Tage lang möglich.',
        ru: 'Спасибо. К сожалению, мы не можем его обменять. У нас обмен возможен только в течение четырнадцати дней.',
        ky: 'Рахмат. Тилекке каршы, биз аны алмаштыра албайбыз. Бизде алмаштыруу он төрт күн бою гана мүмкүн.',
      },
      {
        speaker: 'Frau Krüger',
        text: 'Das verstehe ich nicht, weil auf dem Gerät zwei Jahre Garantie sind. Würden Sie ihn bitte ersetzen?',
        ru: 'Я этого не понимаю, потому что на устройство дано два года гарантии. Не могли бы вы его заменить?',
        ky: 'Муну түшүнбөйм, анткени шаймандын эки жыл кепилдиги бар. Аны алмаштырып бересизби?',
      },
      {
        speaker: 'Herr Lang',
        text: 'Mit der Garantie ist das etwas anderes. Trotz unserer Regel würde ich Ihnen gern helfen, wenn mein Chef einverstanden ist. Ich frage ihn.',
        ru: 'С гарантией это другое дело. Несмотря на наше правило, я бы с удовольствием вам помог, если мой начальник согласен. Я спрошу его.',
        ky: 'Кепилдик менен бул башка нерсе. Биздин эрежеге карабастан, начальнигим макул болсо, мен сизге жардам бергим келет. Мен андан сурайм.',
      },
      {
        speaker: 'Herr Lang',
        text: 'Mein Chef sagt, dass wir den Staubsauger ersetzen können.',
        ru: 'Мой начальник говорит, что мы можем заменить пылесос.',
        ky: 'Менин начальнигим чаң соргучту алмаштыра алабыз дейт.',
      },
      {
        speaker: 'Frau Krüger',
        text: 'Wunderbar. Wann bekomme ich den Ersatz?',
        ru: 'Замечательно. Когда я получу замену?',
        ky: 'Сонун. Алмаштырууну качан алам?',
      },
      {
        speaker: 'Herr Lang',
        text: 'In drei Tagen. Wenn Sie den Kaufbeleg per E-Mail schicken könnten, wäre es noch schneller.',
        ru: 'Через три дня. Если бы вы смогли прислать чек по электронной почте, было бы ещё быстрее.',
        ky: 'Үч күндөн кийин. Чекти электрондук почта аркылуу жибере алсаңыз, дагы тез болмок.',
      },
      {
        speaker: 'Frau Krüger',
        text: 'Das mache ich sofort. Vielen Dank für Ihre Hilfe.',
        ru: 'Сделаю сразу. Большое спасибо за вашу помощь.',
        ky: 'Дароо кылам. Жардамыңыз үчүн чоң рахмат.',
      },
      {
        speaker: 'Herr Lang',
        text: 'Gern geschehen. Auf Wiedersehen.',
        ru: 'Пожалуйста. До свидания.',
        ky: 'Эч нерсе эмес. Кайра көрүшкөнчө.',
      },
    ],
    questions: [
      {
        q: 'Warum ruft Frau Krüger an?',
        options: ['Der Staubsauger ist kaputt.', 'Sie will einen neuen Staubsauger kaufen.', 'Sie hat zu viel bezahlt.'],
        answer: 0,
      },
      { q: 'Wie lange ist der Umtausch im Laden möglich?', options: ['Sieben Tage.', 'Vierzehn Tage.', 'Dreißig Tage.'], answer: 1 },
      { q: 'Wer sagt, dass der Staubsauger ersetzt werden kann?', options: ['Frau Krüger.', 'Die Kollegin von Frau Krüger.', 'Der Chef von Herrn Lang.'], answer: 2 },
      { q: 'Was soll Frau Krüger per E-Mail schicken?', options: ['Den Kaufbeleg.', 'Ein Foto von der Kreditkarte.', 'Eine neue Bankkarte.'], answer: 0 },
    ],
    keywords: ['Reklamation', 'Garantie', 'Umtausch', 'Ersatz'],
    source: UNIT_27_SOURCE,
  },
  {
    id: 'b1-li-27-02',
    unit: 27,
    level: 'B1',
    title: 'Ein Anruf bei der Bank (erfunden)',
    lines: [
      {
        speaker: 'Frau Moll',
        text: 'Stadtbank, Kundenberatung, Moll. Guten Tag, was kann ich für Sie tun?',
        ru: 'Штадтбанк, консультация клиентов, Молль. Добрый день, чем могу помочь?',
        ky: 'Штадтбанк, кардарларды кеңешүү, Молль. Кайырлуу күн, мен сизге эмне кыла алам?',
      },
      {
        speaker: 'Herr Arslan',
        text: 'Guten Tag. Auf meinem Kontoauszug steht eine Gebühr von zehn Euro. Wegen dieser Gebühr rufe ich an.',
        ru: 'Добрый день. В моей выписке по счёту указана комиссия в десять евро. Я звоню из-за этой комиссии.',
        ky: 'Кайырлуу күн. Менин эсеп көчүрмөмдө он евро комиссия бар. Мен ушул комиссияга байланыштуу чалып жатам.',
      },
      {
        speaker: 'Frau Moll',
        text: 'Diese Gebühr gibt es bei Zahlungen mit der Kreditkarte im Ausland.',
        ru: 'Эта комиссия берётся при платежах кредитной картой за границей.',
        ky: 'Бул комиссия чет өлкөдө насыя картасы менен төлөгөндө алынат.',
      },
      {
        speaker: 'Herr Arslan',
        text: 'Ich war im Urlaub und habe nur einmal bezahlt. Könnten Sie die Gebühr bitte erstatten?',
        ru: 'Я был в отпуске и заплатил только один раз. Не могли бы вы возместить комиссию?',
        ky: 'Мен эс алууда болдум жана бир гана жолу төлөдүм. Комиссияны кайтарып бере аласызбы?',
      },
      {
        speaker: 'Frau Moll',
        text: 'Das ist leider nicht möglich. Nach unseren Regeln können wir die Gebühr nicht erstatten.',
        ru: 'К сожалению, это невозможно. По нашим правилам мы не можем возместить комиссию.',
        ky: 'Тилекке каршы, бул мүмкүн эмес. Биздин эрежелер боюнча комиссияны кайтара албайбыз.',
      },
      {
        speaker: 'Herr Arslan',
        text: 'Verstehe. Würden Sie das bitte noch einmal prüfen? Ich bin seit zehn Jahren Kunde.',
        ru: 'Понимаю. Не могли бы вы ещё раз это проверить? Я клиент уже десять лет.',
        ky: 'Түшүнүктүү. Муну дагы бир жолу текшерип бересизби? Мен он жылдан бери кардармын.',
      },
      {
        speaker: 'Frau Moll',
        text: 'Einen Moment bitte. Ich frage meine Kollegin. Sie sagt, dass wir die Hälfte erstatten können.',
        ru: 'Одну минуту. Я спрошу коллегу. Она говорит, что мы можем возместить половину.',
        ky: 'Бир мүнөт. Мен кесиптешимден сурайм. Ал жарымын кайтарып бере алабыз дейт.',
      },
      {
        speaker: 'Herr Arslan',
        text: 'Fünf Euro? Das ist besser als nichts. Wäre es auch möglich, den Dauerauftrag für meine Miete zu ändern?',
        ru: 'Пять евро? Это лучше, чем ничего. А можно ещё изменить постоянное поручение на мою аренду?',
        ky: 'Беш евробу? Эч нерседен жакшы. Ижарам үчүн туруктуу тапшырманы да өзгөртүүгө болобу?',
      },
      {
        speaker: 'Frau Moll',
        text: 'Ja, das können Sie online machen. Dafür gibt es keine Gebühr.',
        ru: 'Да, это можно сделать онлайн. За это комиссии нет.',
        ky: 'Ооба, муну онлайн кылууга болот. Бул үчүн комиссия жок.',
      },
      {
        speaker: 'Herr Arslan',
        text: 'Ich möchte ab Juli neunhundert Euro überweisen. Danke, dann bleibe ich Kunde. Auf Wiedersehen.',
        ru: 'Я хочу с июля переводить девятьсот евро. Спасибо, тогда я остаюсь клиентом. До свидания.',
        ky: 'Мен июлдан баштап тогуз жүз евро которгум келет. Рахмат, анда мен кардар бойдон калам. Кайра көрүшкөнчө.',
      },
    ],
    questions: [
      { q: 'Wie hoch ist die Gebühr?', options: ['Fünf Euro.', 'Zehn Euro.', 'Zwanzig Euro.'], answer: 1 },
      {
        q: 'Wann gibt es die Gebühr laut Frau Moll?',
        options: ['Bei Zahlungen im Ausland mit der Kreditkarte.', 'Bei jeder Überweisung.', 'Bei Barzahlung im Laden.'],
        answer: 0,
      },
      { q: 'Wie viel wird am Ende erstattet?', options: ['Nichts.', 'Alles.', 'Die Hälfte.'], answer: 2 },
      { q: 'Was möchte Herr Arslan ab Juli ändern?', options: ['Sein Konto.', 'Den Dauerauftrag.', 'Seine Kreditkarte.'], answer: 1 },
    ],
    keywords: ['Gebühr', 'Dauerauftrag', 'Kreditkarte', 'erstatten'],
    source: UNIT_27_SOURCE,
  },
]

export const UNIT_27_READING: ReadingText[] = [
  {
    id: 'b1-re-27-01',
    unit: 27,
    level: 'B1',
    title: 'Kundenbewertung und Beschwerdebrief (erfunden)',
    body: [
      'Kundenbewertung für den erfundenen Shop „Technikhaus Nord“: zwei Sterne. Der Mixer sieht gut aus, aber er war schon nach drei Tagen defekt. Wegen des Defekts musste ich den Händler anrufen. Er war freundlich, aber die Rückgabe dauerte lange. Insgesamt war die Beratung am Telefon gut, und die Verpackung war ordentlich. Während der Wartezeit hatte ich kein Gerät. Trotz der Probleme gebe ich nicht null Sterne, denn der Ersatz kam schnell. Wenn der Preis niedriger wäre, würde ich wieder dort kaufen.',
      'Beschwerdebrief (erfunden): Sehr geehrte Damen und Herren, am 3. Mai habe ich bei Ihnen einen Mixer bestellt, Bestellnummer 4711. Wegen eines Defekts funktioniert das Gerät nicht mehr. Ich möchte Sie bitten, das Gerät zu ersetzen oder mir den Betrag von 49 Euro zu erstatten. Ein Foto und den Kaufbeleg finden Sie im Anhang. Könnten Sie mir bitte bis Freitag antworten? Mit freundlichen Grüßen, Paul Weiß',
    ],
    gloss: [
      {
        word: 'Wegen des Defekts / Während der Wartezeit / Trotz der Probleme',
        ru: 'Из-за дефекта / Во время ожидания / Несмотря на проблемы (Genitiv)',
        ky: 'Кемчиликтен улам / Күтүү учурунда / Көйгөйлөргө карабастан (Genitiv)',
        example: 'Wegen des Regens bleiben wir hier.',
        grammar: 'wegen / während / trotz + Genitiv: des Defekts (m), der Wartezeit (f), der Probleme (pl)',
        grammarKy: 'wegen / während / trotz + Genitiv: des Defekts (э), der Wartezeit (а), der Probleme (көптүк)',
        related: [],
      },
      {
        word: 'Wenn der Preis niedriger wäre, würde ich …',
        ru: 'Если бы цена была ниже, я бы … (нереальное условие)',
        ky: 'Баасы төмөнүрөөк болсо, мен … (чындыкка жатпаган шарт)',
        example: 'Wenn ich mehr Zeit hätte, würde ich kommen.',
        grammar: 'Konjunktiv II: wäre в части с wenn (глагол в конце), würde + инфинитив в главной части',
        grammarKy: 'Konjunktiv II: wenn бөлүгүндө wäre (этиш аягында), башкы бөлүктө würde + инфинитив',
        related: [],
      },
      {
        word: 'Könnten Sie mir bitte … antworten?',
        ru: 'Не могли бы вы мне … ответить? (вежливая просьба)',
        ky: 'Мага … жооп бере аласызбы? (сылык өтүнүч)',
        example: 'Könnten Sie mir bitte helfen?',
        grammar: 'Könnten Sie …? — Konjunktiv II, вежливый вопрос',
        grammarKy: 'Könnten Sie …? — Konjunktiv II, сылык суроо',
        related: [],
      },
      {
        word: 'Ich möchte Sie bitten, … zu ersetzen',
        ru: 'Я хотел бы попросить вас заменить …',
        ky: 'Мен сизден … алмаштырууну суранам',
        example: 'Ich möchte Sie bitten, das Paket zu schicken.',
        grammar: 'bitten, … zu + инфинитив (юнит 23): zu стоит перед инфинитивом',
        grammarKy: 'bitten, … zu + инфинитив (23-бөлүм): zu инфинитивдин алдында турат',
        related: [],
      },
    ],
    questions: [
      { q: 'Was war nach drei Tagen mit dem Mixer?', options: ['Er war zu laut.', 'Er war defekt.', 'Er war beschädigt.'], answer: 1 },
      { q: 'Aussage: Paul Weiß hat dem Händler schon vorher einmal geschrieben.', options: ['richtig', 'falsch', 'steht nicht im Text'], answer: 2 },
      {
        q: 'Was würde der Kunde in der Bewertung machen, wenn der Preis niedriger wäre?',
        options: ['Den Shop verlassen.', 'Einen Gutschein kaufen.', 'Wieder dort kaufen.'],
        answer: 2,
      },
    ],
    source: UNIT_27_SOURCE,
  },
  {
    id: 'b1-re-27-02',
    unit: 27,
    level: 'B1',
    title: 'Mein Monatsbudget (erfunden)',
    body: [
      'Lena (eine erfundene Person) schreibt in ihrem Blog: Ich verdiene 1.600 Euro im Monat. Ich arbeite halbtags und gehe abends noch zum Sprachkurs. Die Miete bezahle ich per Dauerauftrag, und die Handyrechnung wird per Lastschrift abgebucht. Wegen der hohen Mieten bleibt am Ende wenig übrig. Trotz des kleinen Gehalts spare ich jeden Monat fünfzig Euro.',
      'Während des Studiums habe ich Schulden gemacht, und ich muss sie noch zurückzahlen. Einen Kredit möchte ich nicht noch einmal aufnehmen. Ich wünschte, ich hätte mehr Zeit für den Preisvergleich. Wenn ich mehr Rabatte nutzen könnte, würde ich im Jahr viel Geld sparen. Jeden Sonntag schreibe ich auf, was ich ausgegeben habe. Das hilft mir, den Überblick zu behalten. Mein Budget ist klein, aber ich gebe nur Geld aus, wenn ich etwas wirklich brauche. Das ist meine Meinung, kein Tipp für alle.',
    ],
    gloss: [
      {
        word: 'der Kredit',
        ru: 'кредит (только для понимания)',
        ky: 'насыя (түшүнүү үчүн гана)',
        example: 'Ein Kredit ist geliehenes Geld.',
        grammar: 'der Kredit, die Kredite — слово только для чтения; в тестах и заданиях не требуется',
        grammarKy: 'der Kredit, die Kredite — окуу үчүн гана сөз; тесттерде жана тапшырмаларда талап кылынбайт',
        related: [],
      },
      {
        word: 'per Dauerauftrag / per Lastschrift',
        ru: 'по постоянному поручению / прямым списанием',
        ky: 'туруктуу тапшырма менен / эсептен түз карматуу менен',
        example: 'Ich zahle die Miete per Dauerauftrag.',
        grammar: 'per + Akkusativ без артикля: способ платежа',
        grammarKy: 'per + артиклсиз Akkusativ: төлөө жолу',
        related: [],
      },
      {
        word: 'Ich wünschte, ich hätte …',
        ru: 'Хотел бы я иметь … (желание, нереально)',
        ky: 'Менде … болсо экен (каалоо, чындыкка жатпайт)',
        example: 'Ich wünschte, ich hätte mehr Geld.',
        grammar: 'Konjunktiv II для желания: hätte / wäre',
        grammarKy: 'каалоо үчүн Konjunktiv II: hätte / wäre',
        related: [],
      },
      {
        word: 'wird … abgebucht',
        ru: 'списывается (Passiv Präsens)',
        ky: 'эсептен алынат (Passiv Präsens)',
        example: 'Der Betrag wird abgebucht.',
        grammar: 'Passiv Präsens (юнит 24): wird + Partizip II в конце',
        grammarKy: 'Passiv Präsens (24-бөлүм): wird + аягында Partizip II',
        related: [],
      },
    ],
    questions: [
      { q: 'Wie wird die Handyrechnung bezahlt?', options: ['Per Dauerauftrag.', 'Per Lastschrift.', 'Bar im Laden.'], answer: 1 },
      {
        q: 'Warum bleibt am Monatsende wenig übrig?',
        options: ['Wegen der hohen Mieten.', 'Wegen der Versandkosten.', 'Wegen des Urlaubs.'],
        answer: 0,
      },
      { q: 'Aussage: Lena schreibt jeden Sonntag auf, was sie ausgegeben hat.', options: ['richtig', 'falsch', 'steht nicht im Text'], answer: 0 },
    ],
    source: UNIT_27_SOURCE,
  },
]

export const UNIT_27_SPEAKING: SpeakingScenario[] = [
  {
    id: UNIT_27_SPEAKING_ID,
    title: 'Reklamieren und eine Lösung aushandeln',
    titleRu: 'Подать рекламацию и договориться о решении',
    titleKy: 'Даттануу берүү жана чечим боюнча макулдашуу',
    icon: '🛒',
    level: 'B1',
    goal: {
      ru: 'Вы звоните в службу поддержки вымышленного магазина «Technikhaus Nord»: купленный вами электрический чайник неисправен. Опишите проблему, вежливо попросите замену или возврат денег и договоритесь о решении. В середине разговора сотрудник сначала отказывает (по правилу магазина — это не закон): оставайтесь вежливыми и ищите решение.',
      ky: 'Сиз ойдон чыгарылган «Technikhaus Nord» дүкөнүнүн тейлөө кызматына чалып жатасыз: сиз сатып алган чайник бузук. Көйгөйдү сүрөттөңүз, алмаштырууну же акчаны кайтарууну сылык суранып, чечим боюнча макулдашыңыз. Сүйлөшүүнүн ортосунда кызматкер адегенде баш тартат (дүкөндүн эрежеси боюнча — бул мыйзам эмес): сылык бойдон калыңыз жана чечим издеңиз.',
    },
    turns: [
      {
        ai: 'Technikhaus Nord, guten Tag. Wie kann ich Ihnen helfen?',
        aiRu: 'Технохаус Норд, добрый день. Чем могу помочь?',
        aiKy: 'Технохаус Норд, кайырлуу күн. Мен сизге кандай жардам бере алам?',
        hints: [
          'Guten Tag, ich möchte ein Gerät reklamieren.',
          'Ich habe vor einer Woche einen Wasserkocher bestellt.',
          'Er ist leider defekt.',
        ],
        keywords: ['reklamieren', 'bestellt', 'defekt', 'gerät'],
      },
      {
        ai: 'Das tut mir leid. Was genau ist das Problem?',
        aiRu: 'Мне жаль. В чём именно проблема?',
        aiKy: 'Кечиресиз. Так эмне көйгөй?',
        hints: [
          'Wegen eines Defekts funktioniert er nicht mehr.',
          'Er schaltet sich nach einer Minute aus.',
          'Außerdem war die Verpackung beschädigt.',
        ],
        keywords: ['defekt', 'funktioniert', 'verpackung', 'beschädigt'],
      },
      {
        ai: 'Was möchten Sie jetzt gern tun? Einen Umtausch oder eine Erstattung?',
        aiRu: 'Что вы хотели бы сделать теперь? Обмен или возврат денег?',
        aiKy: 'Эми эмне кылгыңыз келет? Алмаштырууну же акчаны кайтарууну?',
        hints: [
          'Ich würde gern einen Ersatz bekommen.',
          'Könnten Sie mir bitte das Geld erstatten?',
          'Ein Umtausch wäre auch in Ordnung.',
        ],
        keywords: ['ersatz', 'erstatten', 'umtausch', 'würde'],
      },
      {
        ai: 'Leider ist das nicht möglich. Bei uns ist der Umtausch nur vierzehn Tage lang möglich, und Sie haben den Kaufbeleg nicht dabei.',
        aiRu: 'К сожалению, это невозможно. У нас обмен возможен только в течение четырнадцати дней, и у вас нет с собой чека.',
        aiKy: 'Тилекке каршы, бул мүмкүн эмес. Бизде алмаштыруу он төрт күн бою гана мүмкүн, жана сизде чек жок.',
        hints: [
          'Trotz der Frist würde ich gern eine Lösung finden.',
          'Moment, ich überlege kurz. Könnten Sie das bitte noch einmal prüfen?',
          'Wenn Sie kulanter wären, würde ich den Shop weiterempfehlen.',
        ],
        keywords: ['trotz', 'lösung', 'prüfen', 'kulanter'],
      },
      {
        ai: 'Gut, ich frage meinen Chef. Er sagt, dass wir den Wasserkocher ersetzen können. Passt das für Sie?',
        aiRu: 'Хорошо, я спрошу начальника. Он говорит, что мы можем заменить чайник. Вас это устраивает?',
        aiKy: 'Жакшы, мен начальнигимден сурайм. Ал чайникти алмаштыра алабыз дейт. Бул сизге ылайыктуубу?',
        hints: [
          'Ja, das passt gut. Wann kommt der Ersatz?',
          'Wären Sie so freundlich, mir eine Bestätigung zu schicken?',
          'Vielen Dank für Ihre Hilfe.',
        ],
        keywords: ['ersatz', 'bestätigung', 'passt', 'danke'],
      },
      {
        ai: 'Gern. Ich schicke Ihnen die Bestätigung per E-Mail. Haben Sie noch eine Frage?',
        aiRu: 'Охотно. Я пришлю вам подтверждение по электронной почте. Есть ещё вопросы?',
        aiKy: 'Макул. Мен сизге ырастоону электрондук почта аркылуу жиберем. Дагы суроолоруңуз барбы?',
        hints: [
          'Nein, das ist alles. Vielen Dank.',
          'Würden Sie mir bitte auch die Versandkosten erstatten?',
          'Wegen der Wartezeit wäre das fair.',
        ],
        keywords: ['versandkosten', 'erstatten', 'wegen', 'fair'],
      },
    ],
    source: UNIT_27_SOURCE,
  },
]

export const UNIT_27_WRITING: WritingTask[] = [
  {
    id: 'b1-wr-27-01',
    unit: 27,
    level: 'B1',
    title: 'Eine Reklamation (formell)',
    situation: {
      ru: 'Вы купили в интернет-магазине (вымышленном) электрический чайник, и он неисправен. Напишите формальное письмо-рекламацию: назовите заказ (дату, номер), опишите проблему, используйте один предлог с Genitiv (wegen, trotz, während или statt), вежливую просьбу с Konjunktiv II («Könnten Sie …?», «Ich wäre dankbar, wenn …»), потребуйте замену или возврат денег и назовите срок ответа. Не меньше 80 слов. Это учебное письмо: оно не является юридическим документом.',
      ky: 'Сиз интернет-дүкөндөн (ойдон чыгарылган) электр чайник сатып алдыңыз, ал бузук. Расмий даттануу катын жазыңыз: заказды (күнүн, номерин) атаңыз, көйгөйдү сүрөттөңүз, Genitiv менен бир предлог (wegen, trotz, während же statt), Konjunktiv II менен сылык өтүнүч («Könnten Sie …?», «Ich wäre dankbar, wenn …») колдонуңуз, алмаштырууну же акчаны кайтарууну талап кылыңыз жана жооп берүү мөөнөтүн атаңыз. Кеминде 80 сөз. Бул окуу каты: ал юридикалык документ эмес.',
    },
    formal: true,
    minWords: 80,
    mustInclude: [
      {
        label: 'Anrede und Gruß (Sehr geehrte Damen und Herren … / Mit freundlichen Grüßen)',
        patterns: ['sehr geehrte', 'mit freundlichen grüßen', 'freundlichen grüßen'],
        explain: {
          ru: 'Формальное обращение в начале и формальное прощание в конце письма.',
          ky: 'Каттын башында расмий кайрылуу, аягында расмий коштошуу.',
        },
      },
      {
        label: 'Die Bestellung (… habe ich bei Ihnen … bestellt, Bestellnummer …)',
        patterns: ['bestell', 'gekauft', 'bestellnummer'],
        explain: {
          ru: 'Назовите, что, когда и под каким номером вы заказали.',
          ky: 'Эмнени, качан жана кандай номер менен заказ бергениңизди атаңыз.',
        },
      },
      {
        label: 'Das Problem (Das Gerät ist defekt / funktioniert nicht mehr / war beschädigt)',
        patterns: ['defekt', 'funktioniert nicht', 'beschädigt', 'mangelhaft', 'kaputt'],
        explain: {
          ru: 'Опишите проблему коротко и точно: что не работает или повреждено.',
          ky: 'Көйгөйдү кыска жана так сүрөттөңүз: эмне иштебейт же бузулган.',
        },
      },
      {
        label: 'Eine Genitiv-Präposition (Wegen des Defekts … / Trotz der Wartezeit …)',
        patterns: ['wegen des', 'wegen der', 'wegen eines', 'wegen einer', 'trotz des', 'trotz der', 'trotz eines', 'während des', 'während der', 'statt eines', 'statt der'],
        explain: {
          ru: 'Одно предложение с wegen, trotz, während или statt и Genitiv: des / der / eines / einer.',
          ky: 'Genitiv менен wegen, trotz, während же statt бар бир сүйлөм: des / der / eines / einer.',
        },
      },
      {
        label: 'Eine höfliche Bitte oder ein Wunsch im Konjunktiv II (Könnten Sie …? / Ich wäre dankbar, wenn …)',
        patterns: ['könnten sie', 'würden sie', 'ich wäre', 'wären sie', 'würde ich'],
        explain: {
          ru: 'Вежливая просьба или пожелание с Konjunktiv II: Könnten Sie …? Würden Sie …? Ich wäre dankbar, wenn …',
          ky: 'Konjunktiv II менен сылык өтүнүч же каалоо: Könnten Sie …? Würden Sie …? Ich wäre dankbar, wenn …',
        },
      },
      {
        label: 'Die Lösung (ein Ersatz oder das Geld zurück)',
        patterns: ['ersatz', 'ersetzen', 'erstatt', 'umtausch', 'geld zurück', 'betrag'],
        explain: {
          ru: 'Скажите, какого решения вы ждёте: замена или возврат денег.',
          ky: 'Кандай чечим күткөнүңүздү айтыңыз: алмаштыруу же акчаны кайтаруу.',
        },
      },
      {
        label: 'Die Frist (… bis nächsten Freitag antworten)',
        patterns: ['bis ', 'frist', 'antwort'],
        explain: {
          ru: 'Назовите срок, до которого вы ждёте ответ.',
          ky: 'Жооп күткөн мөөнөттү атаңыз.',
        },
      },
    ],
    model:
      'Sehr geehrte Damen und Herren, am 12. März habe ich bei Ihnen einen Wasserkocher bestellt (Bestellnummer 4711). Wegen eines Defekts funktioniert das Gerät nicht mehr: Es schaltet sich nach einer Minute aus. Den Kaufbeleg und ein Foto finden Sie im Anhang. Könnten Sie mir bitte einen Ersatz schicken oder den Betrag von 39 Euro erstatten? Ich wäre Ihnen dankbar, wenn Sie mir bis nächsten Freitag antworten könnten. Trotz der langen Wartezeit bin ich bereit, eine Lösung zu finden. Mit freundlichen Grüßen, Mara Klein',
    tips: [
      {
        ru: 'Начните формально: «Sehr geehrte Damen und Herren» и закончите «Mit freundlichen Grüßen». Используйте Sie. Пишите вежливо, но ясно: что произошло и чего вы хотите.',
        ky: 'Расмий баштаңыз: «Sehr geehrte Damen und Herren» жана «Mit freundlichen Grüßen» менен аяктаңыз. Sie колдонуңуз. Сылык, бирок так жазыңыз: эмне болду жана эмнени каалайсыз.',
      },
      {
        ru: 'Genitiv: «Wegen des Defekts», «Trotz der Wartezeit». Мужской и средний род — des + -s / -es, женский и множественное число — der.',
        ky: 'Genitiv: «Wegen des Defekts», «Trotz der Wartezeit». Эркек жана орто род — des + -s / -es, аял род жана көптүк сан — der.',
      },
      {
        ru: 'Konjunktiv II для вежливости: «Könnten Sie mir bitte …?», «Ich wäre dankbar, wenn Sie … könnten». Не требуйте приказом («Schicken Sie!») и не пишите, что закон обязывает магазин: это учебное письмо без юридических утверждений.',
        ky: 'Сылыктык үчүн Konjunktiv II: «Könnten Sie mir bitte …?», «Ich wäre dankbar, wenn Sie … könnten». Буйрук менен талап кылбаңыз («Schicken Sie!») жана мыйзам дүкөндү милдеттендирет деп жазбаңыз: бул юридикалык ырастоосуз окуу каты.',
      },
      {
        ru: 'После написания пройдите по списку ниже и оцените себя сами: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
        ky: 'Жазып бүткөндөн кийин төмөнкү тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
      },
    ],
    source: UNIT_27_SOURCE,
  },
  {
    id: 'b1-wr-27-02',
    unit: 27,
    level: 'B1',
    title: 'Meine Meinung: Lohnt sich der Kauf?',
    situation: {
      ru: 'В чате курса спорят, стоит ли покупать дорогой телефон. Напишите короткий комментарий: ваше мнение и причина, и одно слово по теме (например, Preis, Rabatt, sparen, Budget). Не меньше 30 слов. Это небольшое задание на мнение и аргумент: взвесьте и плюсы, и минусы.',
      ky: 'Курстун чатында кымбат телефон сатып алуу керекпи деп талашып жатышат. Кыска комментарий жазыңыз: пикириңиз жана себеби, жана теманы билдирген бир сөз (мисалы, Preis, Rabatt, sparen, Budget). Кеминде 30 сөз. Бул пикирди жана далилди айтуу боюнча кичинекей тапшырма: артыкчылыктарды да, кемчиликтерди да ойлонуңуз.',
    },
    formal: false,
    minWords: 30,
    mustInclude: [
      {
        label: 'Eigene Meinung (Ich finde, dass … / Ich denke, dass …)',
        patterns: ['ich finde', 'ich denke', 'ich glaube', 'meiner meinung nach'],
        explain: {
          ru: 'Одно предложение с вашим мнением: Ich finde, dass … или Ich denke, dass …',
          ky: 'Пикириңизди билдирген бир сүйлөм: Ich finde, dass … же Ich denke, dass …',
        },
      },
      {
        label: 'Ein Grund (… , weil … / … , denn …)',
        patterns: ['weil', 'denn', 'deshalb'],
        explain: {
          ru: 'Причина вашего мнения: weil (глагол в конце) или denn (порядок слов обычный).',
          ky: 'Пикириңиздин себеби: weil (этиш аягында) же denn (сөздөрдүн иреттери адаттагыдай).',
        },
      },
      {
        label: 'Ein Wort zum Thema (Preis, Geld, Rabatt, sparen, Budget, Preisvergleich)',
        patterns: ['preis', 'geld', 'rabatt', 'sparen', 'spare', 'budget', 'preisvergleich', 'kosten'],
        explain: {
          ru: 'Хотя бы одно слово по теме: цена, деньги, скидка, экономить, бюджет, сравнение цен.',
          ky: 'Темага байланыштуу жок дегенде бир сөз: баа, акча, арзандатуу, үнөмдөө, бюджет, баа салыштыруу.',
        },
      },
    ],
    model:
      'Ich finde, dass sich ein teures Handy nicht immer lohnt, weil ein günstiges Modell oft genauso gut ist. Wenn ich mehr Geld hätte, würde ich trotzdem zuerst die Preise vergleichen. Ich denke, dass ein gutes Budget wichtiger ist als der neueste Trend.',
    tips: [
      {
        ru: 'Начните с мнения: «Ich finde, dass …». Дайте причину с weil (глагол в конце) или denn. Можно добавить одно предложение с «Wenn ich … hätte, würde ich …».',
        ky: 'Пикирден баштаңыз: «Ich finde, dass …». weil (этиш аягында) же denn менен себебин айтыңыз. «Wenn ich … hätte, würde ich …» менен бир сүйлөм кошсоңуз болот.',
      },
      {
        ru: 'Используйте слова юнита: Preisvergleich, Budget, sparen, ausgeben, preiswert, überteuert.',
        ky: 'Бөлүмдүн сөздөрүн колдонуңуз: Preisvergleich, Budget, sparen, ausgeben, preiswert, überteuert.',
      },
      {
        ru: 'После написания оцените себя сами по списку: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
        ky: 'Жазып бүткөндөн кийин тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
      },
    ],
    source: UNIT_27_SOURCE,
  },
]
