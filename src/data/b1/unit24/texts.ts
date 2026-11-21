import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_24_SOURCE, UNIT_24_SPEAKING_ID } from './unit'

/**
 * Unit 24 texts: 2 listening scripts, 2 readings, 1 speaking scenario, 1 writing task. Targets of the band for Units 23–26: reading 120–180 words (the
 * curriculum text asks 120–160), listening 120–160 (curriculum: 120–140), sentences ≤ 24 words (95th percentile ≤ 18), 6 speaking turns, writing 70–80 words.
 * Original material; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native speaker.
 * Scope guard (curriculum v2): Passiv only in the Präsens (werden + Partizip II); Passiv Perfekt (`ist … worden`) appears in ONE reading only, glossed (receptive).
 * No Passiv with a modal verb or in the Präteritum (Unit 26), no Konjunktiv II (Unit 25), no relative clause with a preposition (Unit 29), no damit (Unit 30),
 * no Genitiv, no `ohne … zu` / `statt … zu`, and no verb with an obligatory prepositional object (Unit 28).
 * Listening: the dialogues are played with the browser's text-to-speech (the existing mechanism of the listening lab). That playback has NOT been
 * verified on real devices, so no final-test item depends on audio.
 */
export const UNIT_24_LISTENING: ListeningExercise[] = [
  {
    id: 'b1-li-24-01',
    unit: 24,
    level: 'B1',
    title: 'Die Wohnungsbesichtigung',
    lines: [
      {
        speaker: 'Herr Lenz',
        text: 'Guten Tag, Frau Demir. Kommen Sie herein. Das ist die Wohnung im Erdgeschoss.',
        ru: 'Добрый день, госпожа Демир. Входите. Это квартира на первом этаже.',
        ky: 'Кайырлуу күн, Демир айым. Кириңиз. Бул биринчи кабаттагы батир.',
      },
      {
        speaker: 'Frau Demir',
        text: 'Guten Tag, Herr Lenz. Sie ist sehr hell. Wie hoch ist die Kaltmiete?',
        ru: 'Добрый день, господин Ленц. Она очень светлая. Какая аренда без коммунальных платежей?',
        ky: 'Кайырлуу күн, Ленц мырза. Ал абдан жарык. Коммуналдык төлөмсүз ижара акысы канча?',
      },
      {
        speaker: 'Herr Lenz',
        text: 'Die Kaltmiete beträgt 620 Euro. Dazu kommen die Heizkosten und die Nebenkosten.',
        ru: 'Аренда без коммунальных платежей — 620 евро. К этому добавляются расходы на отопление и коммунальные услуги.',
        ky: 'Коммуналдык төлөмсүз ижара акысы 620 евро. Ага жылытуу чыгымдары жана коммуналдык төлөмдөр кошулат.',
      },
      {
        speaker: 'Frau Demir',
        text: 'Und wie hoch ist die Kaution?',
        ru: 'А какой размер залога?',
        ky: 'Ал эми кепилдик акча канча?',
      },
      {
        speaker: 'Herr Lenz',
        text: 'Zwei Monatsmieten. Sie wird nach dem Auszug zurückgezahlt.',
        ru: 'Две месячные арендные платы. Её возвращают после выезда.',
        ky: 'Эки айлык ижара акысы. Ал көчүп чыккандан кийин кайтарылат.',
      },
      {
        speaker: 'Frau Demir',
        text: 'Ist die Wohnung ruhig? Das ist mir wichtig, weil ich ein kleines Kind habe.',
        ru: 'В квартире тихо? Это для меня важно, потому что у меня маленький ребёнок.',
        ky: 'Батир тынчбы? Бул мен үчүн маанилүү, анткени менин кичинекей балам бар.',
      },
      {
        speaker: 'Herr Lenz',
        text: 'Ja, die Lage ist ruhig. Nur das Treppenhaus ist ein bisschen hellhörig.',
        ru: 'Да, район тихий. Только на лестничной клетке немного слышно всё.',
        ky: 'Ооба, жер тынч. Тепкич жайында гана үн бир аз өтүп турат.',
      },
      {
        speaker: 'Frau Demir',
        text: 'Gibt es Mängel? Der Wasserhahn im Bad sieht alt aus.',
        ru: 'Есть ли дефекты? Кран в ванной выглядит старым.',
        ky: 'Кемчиликтер барбы? Жуунуучу бөлмөдөгү суу краны эски көрүнөт.',
      },
      {
        speaker: 'Herr Lenz',
        text: 'Stimmt. Er wird nächste Woche repariert, und außerdem wird die Küche gestrichen, bevor Sie einziehen.',
        ru: 'Верно. Его починят на следующей неделе, а кроме того кухню покрасят, прежде чем вы въедете.',
        ky: 'Туура. Аны келерки жумада оңдошот, мындан тышкары сиз көчүп кирерден мурун ашкана боёлот.',
      },
      {
        speaker: 'Frau Demir',
        text: 'Das klingt gut. Wann kann ich einziehen?',
        ru: 'Звучит хорошо. Когда я смогу въехать?',
        ky: 'Жакшы угулат. Качан көчүп кире алам?',
      },
      {
        speaker: 'Herr Lenz',
        text: 'Am ersten Juli. Vorher wird die Wohnung gereinigt.',
        ru: 'Первого июля. До этого квартиру уберут.',
        ky: 'Бир июлда. Ага чейин батир тазаланат.',
      },
      {
        speaker: 'Frau Demir',
        text: 'Dann möchte ich zuerst den Mietvertrag lesen.',
        ru: 'Тогда я сначала хотела бы прочитать договор аренды.',
        ky: 'Анда мен адегенде ижара келишимин окугум келет.',
      },
      {
        speaker: 'Herr Lenz',
        text: 'Natürlich. Ich schicke ihn Ihnen heute per E-Mail.',
        ru: 'Конечно. Я отправлю его вам сегодня по электронной почте.',
        ky: 'Албетте. Мен аны сизге бүгүн электрондук почта аркылуу жиберем.',
      },
      {
        speaker: 'Frau Demir',
        text: 'Vielen Dank, Herr Lenz. Auf Wiedersehen.',
        ru: 'Большое спасибо, господин Ленц. До свидания.',
        ky: 'Чоң рахмат, Ленц мырза. Кайра көрүшкөнчө.',
      },
    ],
    questions: [
      { q: 'Wie hoch ist die Kaltmiete?', options: ['620 Euro.', '520 Euro.', '720 Euro.'], answer: 0 },
      {
        q: 'Warum fragt Frau Demir nach einer ruhigen Wohnung?',
        options: ['Sie arbeitet zu Hause.', 'Sie hat einen kleinen Hund.', 'Sie hat ein kleines Kind.'],
        answer: 2,
      },
      { q: 'Was wird nächste Woche repariert?', options: ['Die Heizung.', 'Der Wasserhahn.', 'Das Fenster.'], answer: 1 },
      { q: 'Wie bekommt Frau Demir den Mietvertrag?', options: ['Per Post.', 'Beim nächsten Termin.', 'Per E-Mail.'], answer: 2 },
    ],
    keywords: ['Kaltmiete', 'Erdgeschoss', 'Lage', 'Wasserhahn'],
    source: UNIT_24_SOURCE,
  },
  {
    id: 'b1-li-24-02',
    unit: 24,
    level: 'B1',
    title: 'Ein Anruf beim Hausmeister',
    lines: [
      {
        speaker: 'Herr Kurz',
        text: 'Hausmeister Kurz, guten Tag.',
        ru: 'Смотритель дома Курц, добрый день.',
        ky: 'Үйдү кароочу Курц, кайырлуу күн.',
      },
      {
        speaker: 'Frau Weber',
        text: 'Guten Tag, Herr Kurz. Hier ist Weber aus dem dritten Stock. Ich möchte einen Mangel melden.',
        ru: 'Добрый день, господин Курц. Это Вебер с третьего этажа. Я хочу сообщить о неисправности.',
        ky: 'Кайырлуу күн, Курц мырза. Бул үчүнчү кабаттан Вебер. Мен кемчиликти билдиргим келет.',
      },
      {
        speaker: 'Herr Kurz',
        text: 'Was ist denn passiert?',
        ru: 'Что же случилось?',
        ky: 'Эмне болду?',
      },
      {
        speaker: 'Frau Weber',
        text: 'Die Heizung im Schlafzimmer ist defekt, und im Bad gibt es Schimmel an der Wand.',
        ru: 'Отопление в спальне неисправно, а в ванной на стене плесень.',
        ky: 'Уктоочу бөлмөдөгү жылытуу бузук, жуунуучу бөлмөдө дубалда көк бар.',
      },
      {
        speaker: 'Herr Kurz',
        text: 'Das ist ärgerlich. Seit wann ist die Heizung kaputt?',
        ru: 'Это неприятно. С каких пор отопление не работает?',
        ky: 'Бул жагымсыз. Жылытуу качантан бери бузулган?',
      },
      {
        speaker: 'Frau Weber',
        text: 'Seit vier Tagen. Die Wohnung ist feucht und kalt.',
        ru: 'Уже четыре дня. В квартире сыро и холодно.',
        ky: 'Төрт күндөн бери. Батир нымдуу жана муздак.',
      },
      {
        speaker: 'Herr Kurz',
        text: 'Ich schreibe es auf. Die Heizung wird morgen früh um acht Uhr kontrolliert.',
        ru: 'Я запишу. Отопление проверят завтра утром в восемь часов.',
        ky: 'Мен муну жазып алам. Жылытуу эртең эртең менен саат сегизде текшерилет.',
      },
      {
        speaker: 'Frau Weber',
        text: 'Und der Schimmel? Wird er auch entfernt?',
        ru: 'А плесень? Её тоже уберут?',
        ky: 'Ал эми көк? Ал да алынып салынабы?',
      },
      {
        speaker: 'Herr Kurz',
        text: 'Dafür ist die Hausverwaltung zuständig. Die Meldung wird heute noch an die Hausverwaltung geschickt.',
        ru: 'За это отвечает управляющая компания. Сообщение сегодня же отправят в управляющую компанию.',
        ky: 'Бул үчүн үйдү башкаруучу уюм жооптуу. Билдирүү бүгүн эле үйдү башкаруучу уюмга жөнөтүлөт.',
      },
      {
        speaker: 'Frau Weber',
        text: 'Gut. Muss ich selbst etwas tun?',
        ru: 'Хорошо. Мне самой нужно что-то сделать?',
        ky: 'Жакшы. Мен өзүм бир нерсе кылышым керекпи?',
      },
      {
        speaker: 'Herr Kurz',
        text: 'Bitte lüften Sie das Bad mehrmals am Tag. Dann wird es nicht noch feuchter.',
        ru: 'Пожалуйста, проветривайте ванную несколько раз в день. Тогда она не станет ещё более сырой.',
        ky: 'Сураныч, жуунуучу бөлмөнү күнүнө бир нече жолу желдетиңиз. Ошондо ал андан бетер нымдуу болбойт.',
      },
      {
        speaker: 'Frau Weber',
        text: 'Das mache ich. Vielen Dank für die schnelle Hilfe.',
        ru: 'Так и сделаю. Большое спасибо за быструю помощь.',
        ky: 'Мен муну кылам. Тез жардам бергениңиз үчүн чоң рахмат.',
      },
      {
        speaker: 'Herr Kurz',
        text: 'Gern. Bis morgen, Frau Weber.',
        ru: 'Пожалуйста. До завтра, госпожа Вебер.',
        ky: 'Эч нерсе эмес. Эртеңге чейин, Вебер айым.',
      },
    ],
    questions: [
      { q: 'Was ist in der Wohnung defekt?', options: ['Der Herd.', 'Die Waschmaschine.', 'Die Heizung.'], answer: 2 },
      { q: 'Seit wann ist die Heizung kaputt?', options: ['Seit vier Tagen.', 'Seit zwei Tagen.', 'Seit einer Woche.'], answer: 0 },
      { q: 'Wer ist für den Schimmel zuständig?', options: ['Der Hausmeister.', 'Die Hausverwaltung.', 'Die Nachbarin.'], answer: 1 },
      {
        q: 'Was soll Frau Weber im Bad tun?',
        options: ['Das Bad jeden Tag streichen.', 'Das Bad mehrmals am Tag lüften.', 'Das Bad nicht mehr benutzen.'],
        answer: 1,
      },
    ],
    keywords: ['Hausmeister', 'Mangel', 'Schimmel', 'defekt'],
    source: UNIT_24_SOURCE,
  },
]

export const UNIT_24_READING: ReadingText[] = [
  {
    id: 'b1-re-24-01',
    unit: 24,
    level: 'B1',
    title: 'Wohnungsanzeige und Hausordnung',
    body: [
      'Zu vermieten: Helle 3-Zimmer-Wohnung im Altbau, Erdgeschoss, ruhige Lage, zehn Minuten zum Bahnhof. Wir vermieten ab 1. Juli eine Wohnung mit großem Wohnzimmer, neuer Küche und kleinem Balkon. Die Kaltmiete beträgt 650 Euro, dazu kommen Heizkosten und Nebenkosten. Die Kaution ist drei Monatsmieten hoch. Haustiere sind nach Absprache erlaubt, und ein Parkplatz ist vorhanden. Bevor Sie einziehen, wird die Wohnung frisch gestrichen. Wenn Sie die Wohnung sehen möchten, melden Sie sich bitte bei der Hausverwaltung.',
      'Aus der Hausordnung: Der Müll wird getrennt: Papier, Glas, Plastik und Restmüll. Das Treppenhaus wird jede Woche gereinigt, und Fahrräder werden im Keller abgestellt. Nach 22 Uhr wird die Ruhe eingehalten, denn das Haus ist hellhörig. Defekte Lampen und andere Mängel werden dem Hausmeister gemeldet, der kleine Schäden schnell repariert. Bitte lesen Sie die Regeln genau, weil sie für alle Mieter gelten.',
    ],
    gloss: [
      {
        word: 'Helle 3-Zimmer-Wohnung',
        ru: 'светлая трёхкомнатная квартира (объявление)',
        ky: 'үч бөлмөлүү жарык батир (жарыя)',
        example: 'Helle Zimmer machen eine Wohnung freundlich.',
        grammar: 'нет артикля: helle = Nominativ, женский род (-e)',
        grammarKy: 'артикль жок: helle = Nominativ, аял род (-e)',
        related: [],
      },
      {
        word: 'mit großem Wohnzimmer',
        ru: 'с большой гостиной',
        ky: 'чоң конок бөлмөлүү',
        example: 'Wir vermieten eine Wohnung mit großem Balkon.',
        grammar: 'mit + Dativ, нет артикля: средний род — -em',
        grammarKy: 'mit + Dativ, артикль жок: орто род — -em',
        related: [],
      },
      {
        word: 'wird … gereinigt',
        ru: 'убирают, моют (Passiv)',
        ky: 'тазаланат (Passiv)',
        example: 'Das Treppenhaus wird jede Woche gereinigt.',
        grammar: 'Passiv: wird + Partizip II в конце; кто убирает — неважно',
        grammarKy: 'Passiv: wird + Partizip II аягында; ким тазалаганы маанилүү эмес',
        related: [],
      },
      {
        word: 'Restmüll',
        ru: 'остаточный мусор (то, что нельзя сдать на переработку)',
        ky: 'калдык таштанды (кайра иштетүүгө жарабаган)',
        example: 'Der Restmüll kommt in die graue Tonne.',
        grammar: 'der Restmüll — мужской род; Mülltrennung: Papier, Glas, Plastik, Restmüll',
        grammarKy: 'der Restmüll — эркек род; Mülltrennung: Papier, Glas, Plastik, Restmüll',
        related: [],
      },
    ],
    questions: [
      {
        q: 'Was passiert vor dem Einzug mit der Wohnung?',
        options: ['Sie wird frisch gestrichen.', 'Sie wird verkauft.', 'Sie wird komplett neu möbliert.'],
        answer: 0,
      },
      { q: 'Wohin kommen die Fahrräder?', options: ['In den Hof.', 'In den Keller.', 'In das Treppenhaus.'], answer: 1 },
      {
        q: 'Wem werden Mängel gemeldet?',
        options: ['Den Nachbarn im Haus.', 'Dem Elektriker.', 'Dem Hausmeister.'],
        answer: 2,
      },
    ],
    source: UNIT_24_SOURCE,
  },
  {
    id: 'b1-re-24-02',
    unit: 24,
    level: 'B1',
    title: 'Umweltaktion im Viertel',
    body: [
      'In unserem Viertel gibt es dieses Jahr eine Umweltaktion. Am Samstag wird im Park Müll gesammelt, und alte Fahrräder werden kostenlos repariert. Auch alte Handys und Flaschen werden zum Recycling abgegeben.',
      'Viele Nachbarn finden die Idee gut. Frau Berger sagt: „Ich verbrauche weniger Strom, seit ich sparsame Lampen benutze. Außerdem vermeide ich Verpackung, denn Plastik ist schlecht für das Klima.“ Herr Kaya findet, dass nachhaltiges Leben nicht teuer sein muss. Er fährt jeden Tag mit dem Fahrrad zur Arbeit.',
      'Auch im Haus ist schon viel für die Umwelt gemacht worden. Die Heizung ist erneuert worden, und die Fenster sind neu gestrichen worden. Deshalb wird jetzt weniger Energie verbraucht. Die Abrechnung der Heizkosten ist zum ersten Mal niedriger als im letzten Jahr.',
    ],
    gloss: [
      {
        word: 'ist erneuert worden',
        ru: 'была заменена (Passiv Perfekt, только для понимания)',
        ky: 'жаңыланган (Passiv Perfekt, түшүнүү үчүн гана)',
        example: 'Das Dach ist repariert worden.',
        grammar: 'Passiv в прошлом: ist + Partizip II + worden; в этом юните только для чтения',
        grammarKy: 'өткөн чактагы Passiv: ist + Partizip II + worden; бул бөлүмдө окуу үчүн гана',
        related: [],
      },
      {
        word: 'sind neu gestrichen worden',
        ru: 'были заново покрашены (Passiv Perfekt, только для понимания)',
        ky: 'жаңыдан боёлгон (Passiv Perfekt, түшүнүү үчүн гана)',
        example: 'Die Wände sind gestern gestrichen worden.',
        grammar: 'sind (множественное число) + Partizip II + worden',
        grammarKy: 'sind (көптүк сан) + Partizip II + worden',
        related: [],
      },
      {
        word: 'nachhaltiges Leben',
        ru: 'жизнь, бережная к ресурсам',
        ky: 'ресурстарды сарамжалдуу колдонуп жашоо',
        example: 'Nachhaltiges Leben beginnt im Alltag.',
        grammar: 'нет артикля: nachhaltiges = Nominativ, средний род (-es)',
        grammarKy: 'артикль жок: nachhaltiges = Nominativ, орто род (-es)',
        related: [],
      },
      {
        word: 'zum Recycling abgeben',
        ru: 'сдать на переработку',
        ky: 'кайра иштетүүгө өткөрүү',
        example: 'Alte Batterien werden im Supermarkt abgegeben.',
        grammar: 'abgeben — отделяемая приставка; Passiv: werden … abgegeben',
        grammarKy: 'abgeben — ажыраган приставка; Passiv: werden … abgegeben',
        related: [],
      },
    ],
    questions: [
      {
        q: 'Was wird am Samstag im Park gemacht?',
        options: ['Es wird ein Konzert gespielt.', 'Es wird Müll gesammelt.', 'Es werden Fahrräder verkauft.'],
        answer: 1,
      },
      {
        q: 'Warum vermeidet Frau Berger Verpackung?',
        options: ['Sie findet Plastik schlecht für das Klima.', 'Verpackung ist zu teuer.', 'Sie hat zu Hause keinen Platz für den Müll.'],
        answer: 0,
      },
      { q: 'Was wird im Haus jetzt weniger verbraucht?', options: ['Wasser.', 'Energie.', 'Papier.'], answer: 1 },
    ],
    source: UNIT_24_SOURCE,
  },
]

export const UNIT_24_SPEAKING: SpeakingScenario[] = [
  {
    id: UNIT_24_SPEAKING_ID,
    title: 'Einen Mangel melden',
    titleRu: 'Сообщить о неисправности',
    titleKy: 'Бузулууну билдирүү',
    icon: '🏠',
    level: 'B1',
    goal: {
      ru: 'Вы звоните в управляющую компанию. Сообщите о неисправности в квартире, объясните, с каких пор она есть, и договоритесь о ремонте. В середине разговора появляется неожиданный вопрос о счёте за коммунальные услуги.',
      ky: 'Сиз үйдү башкаруучу уюмга чалып жатасыз. Батирдеги бузулууну билдириңиз, ал качантан бери бар экенин түшүндүрүңүз жана оңдоо боюнча макулдашыңыз. Сүйлөшүүнүн ортосунда коммуналдык төлөмдөрдүн эсеби жөнүндө күтүлбөгөн суроо чыгат.',
    },
    turns: [
      {
        ai: 'Hausverwaltung Lenz, guten Tag. Wie kann ich Ihnen helfen?',
        aiRu: 'Управляющая компания Ленц, добрый день. Чем могу помочь?',
        aiKy: 'Ленц үйдү башкаруучу уюму, кайырлуу күн. Сизге кандай жардам бере алам?',
        hints: [
          'Guten Tag, ich möchte einen Mangel melden.',
          'Ich wohne in der Lindenstraße 5, im zweiten Stock.',
          'Mein Name ist …, ich bin Mieterin in Ihrem Haus.',
        ],
        keywords: ['mangel', 'melden', 'wohne', 'stock'],
      },
      {
        ai: 'Was ist denn kaputt?',
        aiRu: 'Что же сломалось?',
        aiKy: 'Эмне бузулду?',
        hints: [
          'Der Wasserhahn im Bad ist undicht.',
          'Die Heizung im Schlafzimmer ist defekt.',
          'An der Wand im Bad gibt es Schimmel.',
        ],
        keywords: ['wasserhahn', 'heizung', 'schimmel', 'defekt', 'undicht'],
      },
      {
        ai: 'Seit wann gibt es das Problem? Und was ist schon passiert?',
        aiRu: 'С каких пор есть проблема? И что уже сделано?',
        aiKy: 'Көйгөй качантан бери бар? Жана эмне иш кылынды?',
        hints: [
          'Seit zwei Wochen läuft Wasser auf den Boden.',
          'Ich habe schon den Hausmeister angerufen.',
          'Das Problem wird jeden Tag schlimmer.',
        ],
        keywords: ['seit', 'hausmeister', 'wasser', 'boden'],
      },
      {
        ai: 'Moment, ich sehe gerade Ihre Nebenkostenabrechnung. Sie ist diesmal höher als sonst. Haben Sie dazu auch eine Frage?',
        aiRu: 'Минутку, я вижу ваш счёт за коммунальные услуги. В этот раз он выше обычного. У вас есть вопрос и по этому поводу?',
        aiKy: 'Бир мүнөт, мен сиздин коммуналдык төлөмдөрдүн эсебин көрүп жатам. Бул жолу ал адаттагыдан жогору. Бул боюнча да сурооңуз барбы?',
        hints: [
          'Ja, warum sind die Nebenkosten so hoch?',
          'Moment, ich überlege kurz. Wie werden die Heizkosten berechnet?',
          'Können Sie mir die Abrechnung bitte per E-Mail schicken?',
        ],
        keywords: ['nebenkosten', 'abrechnung', 'hoch', 'frage'],
      },
      {
        ai: 'Gut, ich notiere beides. Die Heizung wird am Donnerstag kontrolliert. Passt Ihnen das?',
        aiRu: 'Хорошо, я запишу оба вопроса. Отопление проверят в четверг. Вам это подходит?',
        aiKy: 'Жакшы, экөөнү тең жазып алам. Жылытуу бейшембиде текшерилет. Бул сизге ылайыктуубу?',
        hints: [
          'Donnerstag passt gut. Wann genau?',
          'Leider arbeite ich am Donnerstag. Geht auch Freitag?',
          'Ich bin ab 15 Uhr zu Hause.',
        ],
        keywords: ['donnerstag', 'passt', 'freitag', 'uhr'],
      },
      {
        ai: 'Haben Sie noch eine Frage? Sonst schicken wir Ihnen eine Bestätigung per E-Mail.',
        aiRu: 'У вас есть ещё вопросы? Если нет, мы пришлём вам подтверждение по электронной почте.',
        aiKy: 'Дагы суроолоруңуз барбы? Болбосо, биз сизге ырастоону электрондук почта аркылуу жиберебиз.',
        hints: [
          'Wird der Schimmel auch entfernt?',
          'Vielen Dank für Ihre Hilfe.',
          'Ich finde es wichtig, dass die Heizung schnell funktioniert.',
        ],
        keywords: ['schimmel', 'entfernt', 'danke', 'bestätigung'],
      },
    ],
    source: UNIT_24_SOURCE,
  },
]

export const UNIT_24_WRITING: WritingTask[] = [
  {
    id: 'b1-wr-24-01',
    unit: 24,
    level: 'B1',
    title: 'Eine Mail an die Hausverwaltung',
    situation: {
      ru: 'В вашей квартире есть неисправность (например, неисправное отопление, течёт кран или плесень в ванной). Напишите формальное письмо в управляющую компанию: сообщите, где вы живёте, опишите проблему, напишите минимум два предложения в Passiv, выскажите своё мнение с причиной и попросите назначить срок ремонта. Не меньше 70 слов.',
      ky: 'Батириңизде бузулуу бар (мисалы, жылытуу иштебейт, суу краны агат же жуунуучу бөлмөдө көк пайда болгон). Үйдү башкаруучу уюмга расмий кат жазыңыз: кайда жашаарыңызды билдириңиз, көйгөйдү сүрөттөңүз, кеминде эки сүйлөмдү Passiv менен жазыңыз, өз оюңузду себеби менен айтыңыз жана оңдоо үчүн убакыт берүүнү сураңыз. Кеминде 70 сөз.',
    },
    formal: true,
    minWords: 70,
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
        label: 'Wohnung und Adresse (Meine Wohnung liegt in der … straße, im … Stock)',
        patterns: ['meine wohnung', 'stock', 'straße', 'wohnung'],
        explain: {
          ru: 'Скажите, где вы живёте: улица, дом, этаж.',
          ky: 'Кайда жашаарыңызды айтыңыз: көчө, үй, кабат.',
        },
      },
      {
        label: 'Der Mangel (Die Heizung ist defekt / Der Wasserhahn ist undicht / Im Bad gibt es Schimmel)',
        patterns: ['heizung', 'wasserhahn', 'schimmel', 'defekt', 'undicht', 'mangel', 'kaputt'],
        explain: {
          ru: 'Опишите неисправность понятно и коротко: что именно и с каких пор.',
          ky: 'Бузулууну түшүнүктүү жана кыскача сүрөттөңүз: эмне экенин жана качантан бери экенин.',
        },
      },
      {
        label: 'Zwei Sätze im Passiv (… wird … kontrolliert / … werden … repariert)',
        patterns: [' wird ', ' werden '],
        explain: {
          ru: 'Предложения с wird / werden и Partizip II в конце: что уже делается или что нужно сделать.',
          ky: 'wird / werden жана аягында Partizip II бар сүйлөмдөр: эмне кылынып жатат же эмне кылынышы керек.',
        },
      },
      {
        label: 'Ein Adjektiv ohne Artikel (feuchte Wände, kaltes Wasser, schnelle Hilfe)',
        patterns: ['feuchte', 'kalte', 'kaltes', 'kaltem', 'schnelle', 'neue', 'nasse', 'warmes', 'warmem', 'defekte'],
        explain: {
          ru: 'Прилагательное без артикля с правильным окончанием: feuchte Wände, kaltes Wasser, schnelle Hilfe.',
          ky: 'Артиклисиз сын атооч туура улангы менен: feuchte Wände, kaltes Wasser, schnelle Hilfe.',
        },
      },
      {
        label: 'Bitte um einen Termin (Bitte schicken Sie mir einen Termin für die Reparatur)',
        patterns: ['termin', 'bitte', 'antwort'],
        explain: {
          ru: 'Вежливая просьба: назначить срок ремонта или ответить на письмо.',
          ky: 'Сылык суранычыңыз: оңдоо үчүн убакыт дайындоо же катка жооп берүү.',
        },
      },
    ],
    model:
      'Sehr geehrte Damen und Herren, meine Wohnung liegt in der Lindenstraße 5, im zweiten Stock, und ich möchte einen Mangel melden. Seit einer Woche ist die Heizung im Schlafzimmer defekt, und im Bad gibt es feuchte Wände mit Schimmel. Der Hausmeister hat gesagt: Die Heizung wird morgen kontrolliert, aber der Schimmel wird nicht entfernt. Das finde ich nicht gut. Ich finde, dass die Hausverwaltung schnell helfen soll, denn feuchte Wohnungen sind schlecht für die Gesundheit. Bitte schicken Sie mir einen Termin für die Reparatur. Mit freundlichen Grüßen, Elena Petrova',
    tips: [
      {
        ru: 'Начните формально: «Sehr geehrte Damen und Herren» и закончите «Mit freundlichen Grüßen». Используйте Sie, а не du.',
        ky: 'Расмий баштаңыз: «Sehr geehrte Damen und Herren» жана «Mit freundlichen Grüßen» менен аяктаңыз. du эмес, Sie колдонуңуз.',
      },
      {
        ru: 'Напишите минимум два предложения в Passiv: «Die Heizung wird morgen kontrolliert», «Der Schimmel wird nicht entfernt». Werden / wird в нужной форме, Partizip II — в самом конце.',
        ky: 'Passiv менен кеминде эки сүйлөм жазыңыз: «Die Heizung wird morgen kontrolliert», «Der Schimmel wird nicht entfernt». werden / wird керектүү формада, Partizip II — эң аягында.',
      },
      {
        ru: 'Опишите жильё прилагательными без артикля: «feuchte Wände» (Nominativ, множественное число: -e), «mit kaltem Wasser» (Dativ, средний род: -em), «schnelle Hilfe» (Akkusativ, женский род: -e).',
        ky: 'Турак жайды артиклисиз сын атоочтор менен сүрөттөңүз: «feuchte Wände» (Nominativ, көптүк: -e), «mit kaltem Wasser» (Dativ, орто род: -em), «schnelle Hilfe» (Akkusativ, аял род: -e).',
      },
      {
        ru: 'Пишите коротко и по делу: адрес, проблема, что уже делается, просьба о сроке. Одно предложение с мнением («Ich finde, dass …») можно добавить, но оно не обязательно.',
        ky: 'Кыска жана так жазыңыз: дарек, көйгөй, эмне кылынып жатат, убакыт дайындоо өтүнүчү. Оюңузду билдирген бир сүйлөм («Ich finde, dass …») кошсоңуз болот, бирок милдеттүү эмес.',
      },
      {
        ru: 'После написания пройдите по списку ниже и оцените себя сами: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
        ky: 'Жазып бүткөндөн кийин төмөнкү тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
      },
    ],
    source: UNIT_24_SOURCE,
  },
  {
    id: 'b1-wr-24-02',
    unit: 24,
    level: 'B1',
    title: 'Kommentar zur Umweltaktion',
    situation: {
      ru: 'В вашем районе проходит экологическая акция (см. текст «Umweltaktion im Viertel»). Напишите короткий комментарий для чата соседей: ваше мнение и причина, одно слово об окружающей среде или экономии энергии. Не меньше 30 слов. Это небольшое задание на мнение и аргумент.',
      ky: 'Сиздин районуңузда экологиялык акция өтүп жатат («Umweltaktion im Viertel» текстин караңыз). Кошуналардын чатына кыска комментарий жазыңыз: оюңуз жана себеби, айлана-чөйрө же энергияны үнөмдөө жөнүндө бир сөз. Кеминде 30 сөз. Бул оюңузду жана далилиңизди айтуу боюнча кичинекей тапшырма.',
    },
    formal: false,
    minWords: 30,
    mustInclude: [
      {
        label: 'Eigene Meinung (Ich finde, dass … / Ich denke, dass …)',
        patterns: ['ich finde', 'ich denke', 'ich glaube', 'meiner meinung nach'],
        explain: {
          ru: 'Одно предложение с вашим мнением: Ich finde, dass … или Ich denke, dass …',
          ky: 'Оюңузду билдирген бир сүйлөм: Ich finde, dass … же Ich denke, dass …',
        },
      },
      {
        label: 'Ein Grund (… , weil … / … , denn …)',
        patterns: ['weil', 'denn', 'deshalb'],
        explain: {
          ru: 'Причина вашего мнения: weil (глагол в конце) или denn (порядок слов обычный).',
          ky: 'Оюңуздун себеби: weil (этиш аягында) же denn (сөздөрдүн иреттери адаттагыдай).',
        },
      },
      {
        label: 'Ein Wort zur Umwelt (Umwelt, Energie, Strom, Müll, Klima, Verpackung)',
        patterns: ['umwelt', 'energie', 'strom', 'müll', 'klima', 'verpackung', 'recycl', 'fahrrad'],
        explain: {
          ru: 'Хотя бы одно слово по теме: окружающая среда, энергия, электричество, мусор, климат, упаковка.',
          ky: 'Темага байланыштуу жок дегенде бир сөз: айлана-чөйрө, энергия, электр, таштанды, климат, таңгак.',
        },
      },
    ],
    model:
      'Ich finde die Umweltaktion sehr gut, denn viele Menschen machen mit. Ich denke, dass wir weniger Müll haben, wenn wir alte Flaschen recyceln. Außerdem verbrauche ich weniger Strom, weil ich abends das Licht ausmache. Das ist gut für die Umwelt und auch für mein Geld.',
    tips: [
      {
        ru: 'Начните с мнения: «Ich finde, dass …» или «Ich denke, dass …». Затем дайте причину с weil (глагол в конце) или denn.',
        ky: 'Оюңуздан баштаңыз: «Ich finde, dass …» же «Ich denke, dass …». Андан кийин weil (этиш аягында) же denn менен себебин айтыңыз.',
      },
      {
        ru: 'Используйте слова юнита: Umwelt, Energie, Strom, Verpackung, nachhaltig, vermeiden, recyceln.',
        ky: 'Бөлүмдүн сөздөрүн колдонуңуз: Umwelt, Energie, Strom, Verpackung, nachhaltig, vermeiden, recyceln.',
      },
      {
        ru: 'После написания оцените себя сами по списку: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
        ky: 'Жазып бүткөндөн кийин тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
      },
    ],
    source: UNIT_24_SOURCE,
  },
]
