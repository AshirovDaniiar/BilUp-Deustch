import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_22_SOURCE, UNIT_22_SPEAKING_ID } from './unit'

/**
 * Unit 22 texts: 2 listening scripts, 2 readings, 1 speaking scenario, 1 writing task. Targets of the band for Units 21–22: reading 100–150 words,
 * listening 110–140, sentences ≤ 22 words (95th percentile ≤ 16), 5–6 speaking turns, writing 70–80 words. Original material; the Kyrgyz is an
 * AI-assisted first draft that has not been reviewed by a native speaker.
 * Scope guard (curriculum v2): no Relativsatz, Infinitiv mit zu, damit, Genitiv, Passiv, Konjunktiv II, adjectives without article, and no verb with an
 * obligatory prepositional object (Unit 28). einerseits … andererseits appears in ONE reading only, glossed (receptive).
 * Listening: the dialogues are played with the browser's text-to-speech (the existing mechanism of the listening lab). That playback has NOT been
 * verified on real devices, so no final-test item depends on audio.
 */
export const UNIT_22_LISTENING: ListeningExercise[] = [
  {
    id: 'b1-li-22-01',
    unit: 22,
    level: 'B1',
    title: 'Neue Regel in der WG',
    lines: [
      {
        speaker: 'Lea',
        text: 'Wir brauchen eine neue Regel für die Ruhezeit. Meiner Meinung nach ist ab zehn Uhr abends Ruhe wichtig.',
        ru: 'Нам нужно новое правило о тишине. По моему мнению, с десяти вечера тишина очень важна.',
        ky: 'Биз үчүн тынчтык убактысы боюнча жаңы эреже керек. Менин оюмча, кечки саат ондон баштап тынчтык маанилүү.',
      },
      {
        speaker: 'Nils',
        text: 'Das sehe ich anders. Ich arbeite oft bis spät und koche gern am Abend.',
        ru: 'А я смотрю на это иначе. Я часто работаю допоздна и люблю готовить вечером.',
        ky: 'Мен буга башкача карайм. Мен көп учурда кечке чейин иштейм жана кечинде тамак жасаганды жакшы көрөм.',
      },
      {
        speaker: 'Lea',
        text: 'Zwar verstehe ich dich, aber ich muss morgens früh aufstehen.',
        ru: 'Я тебя, правда, понимаю, но мне рано вставать по утрам.',
        ky: 'Сени түшүнгөнүм чын, бирок мен эртең менен эрте турушум керек.',
      },
      {
        speaker: 'Nils',
        text: 'Trotzdem finde ich zehn Uhr zu früh. Elf Uhr ist ein guter Kompromiss.',
        ru: 'Всё равно десять часов, по-моему, слишком рано. Одиннадцать часов — хороший компромисс.',
        ky: 'Ошого карабастан, менимче, саат он өтө эрте. Саат он бир — жакшы компромисс.',
      },
      {
        speaker: 'Lea',
        text: 'Je später die Ruhezeit beginnt, desto kürzer schlafe ich.',
        ru: 'Чем позже начинается тишина, тем короче я сплю.',
        ky: 'Тынчтык убактысы канчалык кеч башталса, мен ошончолук аз уктайм.',
      },
      {
        speaker: 'Nils',
        text: 'Das ist ein starkes Argument. Obwohl ich spät nach Hause komme, kann ich leise kochen.',
        ru: 'Это сильный довод. Хотя я поздно прихожу домой, я могу готовить тихо.',
        ky: 'Бул күчтүү далил. Үйгө кеч келсем да, мен жай тамак жасай алам.',
      },
      {
        speaker: 'Lea',
        text: 'Wirklich? Dann bin ich einverstanden. Aber was ist mit Besuch?',
        ru: 'Правда? Тогда я согласна. Но как быть с гостями?',
        ky: 'Чын эле? Анда мен макулмун. Бирок конокторго эмне кылабыз?',
      },
      {
        speaker: 'Nils',
        text: 'Tom findet Besuch am Abend schön. Ich bin dagegen, weil ich dann nicht arbeiten kann.',
        ru: 'Том считает вечерних гостей хорошей идеей. А я против, потому что тогда не могу работать.',
        ky: 'Том кечки конокторду жакшы деп эсептейт. Ал эми мен каршымын, анткени ошондо иштей албайм.',
      },
      {
        speaker: 'Lea',
        text: 'Tom hat recht: Das Risiko ist klein. Sowohl du als auch ich sind oft unterwegs.',
        ru: 'Том прав: риск небольшой. И ты, и я часто бываем в разъездах.',
        ky: 'Том туура айтат: тобокел кичине. Сен да, мен да көп учурда сыртта жүрөбүз.',
      },
      {
        speaker: 'Nils',
        text: 'Stimmt. Dann ändere ich meine Meinung: Besuch ist erlaubt, aber nur bis elf Uhr.',
        ru: 'Верно. Тогда я меняю своё мнение: гости разрешены, но только до одиннадцати.',
        ky: 'Туура. Анда мен пикиримди өзгөртөм: конокторго болот, бирок саат он бирге чейин гана.',
      },
      {
        speaker: 'Lea',
        text: 'Einverstanden! Ich schreibe die Regeln auf.',
        ru: 'Договорились! Я запишу правила.',
        ky: 'Макул! Мен эрежелерди жазып коём.',
      },
    ],
    questions: [
      {
        q: 'Warum möchte Lea ab zehn Uhr Ruhe?',
        options: ['Sie arbeitet in der Woche nachts.', 'Sie muss morgens früh aufstehen.', 'Sie hat Besuch.'],
        answer: 1,
      },
      {
        q: 'Wie reagiert Nils zuerst auf den Vorschlag?',
        options: ['Er stimmt sofort zu.', 'Er lacht darüber.', 'Er sieht es anders.'],
        answer: 2,
      },
      {
        q: 'Was ändert Nils am Ende?',
        options: ['Er kocht nicht mehr für die ganze WG.', 'Er ist für Besuch bis elf Uhr.', 'Er zieht aus der WG aus.'],
        answer: 1,
      },
      {
        q: 'Was macht Lea am Ende?',
        options: ['Sie schreibt die Regeln auf.', 'Sie zieht aus der WG aus.', 'Sie kocht ab jetzt für alle Mitbewohner.'],
        answer: 0,
      },
    ],
    keywords: ['Regel', 'Meinung', 'Argument', 'Risiko', 'Zustimmung'],
    source: UNIT_22_SOURCE,
  },
  {
    id: 'b1-li-22-02',
    unit: 22,
    level: 'B1',
    title: 'Smartphones für Kinder?',
    lines: [
      {
        speaker: 'Moderatorin',
        text: 'Guten Morgen, Herr Brandt. Sollen Kinder ein Smartphone haben?',
        ru: 'Доброе утро, господин Брандт. Должны ли дети иметь смартфон?',
        ky: 'Куттуу таң, Брандт мырза. Балдардын смартфону болушу керекпи?',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Guten Morgen. Ich bin weder dafür noch dagegen. Das Alter ist entscheidend.',
        ru: 'Доброе утро. Я ни за, ни против. Решает возраст.',
        ky: 'Куттуу таң. Мен колдоого да, каршы да эмесмин. Жаш чечет.',
      },
      {
        speaker: 'Moderatorin',
        text: 'Welchen Vorteil sehen Sie?',
        ru: 'Какое преимущество вы видите?',
        ky: 'Кандай артыкчылыкты көрөсүз?',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Ein Smartphone ist nützlich. Die Kinder rufen ihre Eltern an und finden schnell Informationen.',
        ru: 'Смартфон полезен. Дети звонят родителям и быстро находят информацию.',
        ky: 'Смартфон пайдалуу. Балдар ата-энесине чалып, маалыматты тез табышат.',
      },
      {
        speaker: 'Moderatorin',
        text: 'Und der Nachteil?',
        ru: 'А недостаток?',
        ky: 'Ал эми кемчилиги?',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Je länger ein Kind am Handy sitzt, desto weniger schläft es. Das ist ein echtes Risiko.',
        ru: 'Чем дольше ребёнок сидит с телефоном, тем меньше он спит. Это настоящий риск.',
        ky: 'Бала телефонго канчалык көп отурса, ошончолук аз уктайт. Бул чыныгы тобокел.',
      },
      {
        speaker: 'Moderatorin',
        text: 'Viele Eltern behaupten, dass ein Handy die Kinder sicherer macht.',
        ru: 'Многие родители утверждают, что телефон делает детей безопаснее.',
        ky: 'Көптөгөн ата-энелер телефон балдарды коопсуз кылат деп ырасташат.',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Das ist umstritten. Obwohl ich das Argument verstehe, bin ich skeptisch.',
        ru: 'Это спорный вопрос. Хотя я понимаю этот довод, я отношусь скептически.',
        ky: 'Бул талаштуу маселе. Бул далилди түшүнсөм да, мен ишенбейм.',
      },
      {
        speaker: 'Moderatorin',
        text: 'Was empfehlen Sie den Eltern?',
        ru: 'Что вы советуете родителям?',
        ky: 'Ата-энелерге эмне кеңеш бересиз?',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Entweder gibt es eine feste Zeit, oder die Eltern kontrollieren das Handy. Sowohl die Schule als auch die Familie tragen Verantwortung.',
        ru: 'Либо устанавливается твёрдое время, либо родители контролируют телефон. И школа, и семья несут ответственность.',
        ky: 'Же так убакыт белгиленет, же ата-энелер телефонду көзөмөлдөйт. Мектеп да, үй-бүлө да жоопкерчиликти көтөрөт.',
      },
      {
        speaker: 'Moderatorin',
        text: 'Vielen Dank für das Gespräch.',
        ru: 'Большое спасибо за беседу.',
        ky: 'Маек үчүн чоң рахмат.',
      },
      {
        speaker: 'Herr Brandt',
        text: 'Gern geschehen. Mein Rat: Gespräche sind besser als Verbote.',
        ru: 'Пожалуйста. Мой совет: разговоры лучше запретов.',
        ky: 'Ыраазычылык. Менин кеңешим: сүйлөшүү тыюудан жакшыраак.',
      },
    ],
    questions: [
      {
        q: 'Was meint Herr Brandt zu Smartphones für Kinder?',
        options: ['Er ist ganz klar dagegen, aus Prinzip.', 'Er ist weder dafür noch dagegen.', 'Er ist ganz dafür.'],
        answer: 1,
      },
      {
        q: 'Welchen Vorteil nennt er?',
        options: ['Kinder erreichen ihre Eltern und finden Informationen.', 'Kinder lernen schneller schlafen.', 'Kinder sparen auf diese Weise jeden Monat viel Geld für ihre Eltern.'],
        answer: 0,
      },
      {
        q: 'Was ist nach Herrn Brandt ein Risiko?',
        options: ['Das Handy ist für viele Familien viel zu teuer im Monat.', 'Kinder schlafen weniger, wenn sie lange am Handy sitzen.', 'Die Schule verbietet Handys.'],
        answer: 1,
      },
      { q: 'Was empfiehlt er am Ende?', options: ['Ein klares Verbot für alle Handys in der Schule.', 'Ein Handy für jedes Kind.', 'Mehr Gespräche und weniger Verbote.'], answer: 2 },
    ],
    keywords: ['Vorteil', 'Nachteil', 'Risiko', 'Verantwortung', 'umstritten'],
    source: UNIT_22_SOURCE,
  },
]

export const UNIT_22_READING: ReadingText[] = [
  {
    id: 'b1-re-22-01',
    unit: 22,
    level: 'B1',
    title: 'Stadt oder Land?',
    body: [
      'Im Forum „Zusammen leben“ fragt Lena: Wo lebt man besser, in der Großstadt oder auf dem Dorf? Hier sind zwei Antworten.',
      'Mia: Ich finde das Leben in der Großstadt besser. Zwar ist die Miete hoch und es ist oft laut, aber hier gibt es viele Möglichkeiten: Kinos, Cafés und Vereine. Im Vergleich zu meinem Heimatdorf ist alles nah. Obwohl ich wenig Ruhe habe, möchte ich nicht umziehen. Je länger ich hier wohne, desto mehr mag ich die Stadt.',
      'Jonas: Ich sehe das anders. Auf dem Dorf habe ich meine Ruhe und einen großen Garten. Ich kenne meine Nachbarn, und wir helfen uns, wenn jemand Hilfe braucht. Trotzdem ist es nicht perfekt: Es gibt kaum Busse, und ich brauche ein Auto. Das ist teuer, aber ich fahre nur zehn Minuten zur Arbeit. Für mich ist das Dorf die bessere Wahl.',
    ],
    gloss: [
      {
        word: 'Zwar … aber',
        ru: 'правда …, но (признать и возразить)',
        ky: 'чын, бирок (моюнга алып туруп каршы айтуу)',
        example: 'Zwar ist das Zimmer klein, aber es ist hell.',
        grammar: 'zwar … aber: после aber обычный порядок слов',
        grammarKy: 'zwar … aber: aber сөзүнөн кийин сөздөрдүн ирети кадимкидей',
        related: [],
      },
      {
        word: 'Im Vergleich zu',
        ru: 'по сравнению с (+ Dativ)',
        ky: '…га салыштырганда (+ Dativ)',
        example: 'Im Vergleich zu Berlin ist Bonn klein.',
        grammar: 'im Vergleich zu + Dativ: после zu стоит Dativ (zu meinem Heimatdorf)',
        grammarKy: 'im Vergleich zu + Dativ: zu сөзүнөн кийин Dativ келет (zu meinem Heimatdorf)',
        related: [],
      },
      {
        word: 'Je … desto',
        ru: 'чем … тем',
        ky: 'канчалык … ошончолук',
        example: 'Je mehr ich übe, desto besser spreche ich.',
        grammar: 'je + сравнительная степень, desto + сравнительная степень',
        grammarKy: 'je + салыштырма даража, desto + салыштырма даража',
        related: [],
      },
      {
        word: 'Trotzdem',
        ru: 'всё же, несмотря на это',
        ky: 'ошого карабастан',
        example: 'Es regnet. Trotzdem gehen wir raus.',
        grammar: 'trotzdem — на первом месте, глагол — на втором',
        grammarKy: 'trotzdem — биринчи орунда, этиш — экинчи орунда',
        related: [],
      },
    ],
    questions: [
      {
        q: 'Welchen Nachteil nennt Mia?',
        options: ['Die Miete ist hoch.', 'Es gibt keine Kinos.', 'Ihre Nachbarn sind unfreundlich.'],
        answer: 0,
      },
      {
        q: 'Warum braucht Jonas ein Auto?',
        options: ['Er hat einen großen Garten.', 'Es gibt kaum Busse.', 'Seine Arbeit ist weit weg.'],
        answer: 1,
      },
      {
        q: 'Was sagt Jonas über das Dorf?',
        options: ['Er will in zwei Jahren in die Stadt umziehen.', 'Die Großstadt ist besser.', 'Das Dorf ist für ihn die bessere Wahl.'],
        answer: 2,
      },
    ],
    source: UNIT_22_SOURCE,
  },
  {
    id: 'b1-re-22-02',
    unit: 22,
    level: 'B1',
    title: 'Haustiere in der Mietwohnung?',
    body: [
      'Ein Leserbrief zum Thema „Haustiere in der Mietwohnung“. Der Vermieter in unserem Haus verbietet alle Haustiere. Ich finde diese Regel nicht gerecht.',
      'Einerseits verstehe ich den Vermieter: Manche Tiere machen Lärm und Schmutz. Andererseits sind Tiere für viele Menschen wichtig. Sowohl die Kinder als auch ihre Großeltern sind mit einem Haustier glücklicher. Im Gegensatz zu einem Hund braucht eine Katze keinen Garten.',
      'Meine Katze Mimi ist weder laut noch gefährlich. Sie schläft den ganzen Tag und stört niemanden. Je ruhiger ein Tier ist, desto weniger Probleme gibt es. Deshalb mache ich einen Vorschlag: Jeder Mieter darf ein kleines Tier halten. Was denken Sie? Schreiben Sie mir!',
    ],
    gloss: [
      {
        word: 'Einerseits … andererseits',
        ru: 'с одной стороны … с другой стороны (только для понимания)',
        ky: 'бир жагынан … экинчи жагынан (түшүнүү үчүн гана)',
        example: 'Einerseits ist es teuer, andererseits ist es bequem.',
        grammar: 'двойной союз для двух сторон вопроса; в этом юните — только для чтения',
        grammarKy: 'маселенин эки жагын көрсөткөн эки бөлүктүү байламта; бул бөлүмдө окуу үчүн гана',
        related: [],
      },
      {
        word: 'Im Gegensatz zu',
        ru: 'в отличие от (+ Dativ)',
        ky: '…дан айырмаланып (+ Dativ)',
        example: 'Im Gegensatz zu einem Hund braucht eine Katze wenig Platz.',
        grammar: 'im Gegensatz zu + Dativ: после zu стоит Dativ (zu einem Hund)',
        grammarKy: 'im Gegensatz zu + Dativ: zu сөзүнөн кийин Dativ келет (zu einem Hund)',
        related: [],
      },
      {
        word: 'Sowohl … als auch',
        ru: 'как … так и; и … и',
        ky: '… да, … да',
        example: 'Sowohl Anna als auch Tom spielen Fußball.',
        grammar: 'sowohl A als auch B: глагол во множественном числе',
        grammarKy: 'sowohl A als auch B: этиш көптүк санда',
        related: [],
      },
      {
        word: 'der Vermieter',
        ru: 'арендодатель, хозяин квартиры',
        ky: 'батирдин ээси, ижарага берүүчү',
        example: 'Der Vermieter wohnt im Erdgeschoss.',
        grammar: 'der Vermieter — мужской род',
        grammarKy: 'der Vermieter — эркек род',
        related: [],
      },
    ],
    questions: [
      {
        q: 'Was kritisiert die Schreiberin?',
        options: ['Die Miete ist in diesem Haus viel zu hoch.', 'Der Vermieter erlaubt keine Haustiere.', 'Die Nachbarn sind zu laut.'],
        answer: 1,
      },
      { q: 'Welches Tier hat die Schreiberin?', options: ['Einen Hund.', 'Einen Vogel.', 'Eine Katze.'], answer: 2 },
      {
        q: 'Was schlägt sie vor?',
        options: ['Jeder Mieter darf ein kleines Tier halten.', 'Alle Haustiere müssen bis Juli aus dem Haus ausziehen.', 'Der Vermieter baut einen Garten.'],
        answer: 0,
      },
    ],
    source: UNIT_22_SOURCE,
  },
]

export const UNIT_22_SPEAKING: SpeakingScenario[] = [
  {
    id: UNIT_22_SPEAKING_ID,
    title: 'Diskussion in der WG: ein Haustier?',
    titleRu: 'Обсуждение в общежитии: домашнее животное?',
    titleKy: 'Бирге жашаган батирде талкуу: үй жаныбары?',
    icon: '💬',
    level: 'B1',
    goal: {
      ru: 'Вы хотите взять кошку в квартиру, где живёте не один. Выскажите мнение, объясните причину, признайте возражение соседа и договоритесь. Собеседник сначала возражает.',
      ky: 'Сиз жалгыз жашабаган батирге мышык алгыңыз келет. Пикириңизди айтыңыз, себебин түшүндүрүңүз, кошунаңыздын каршы пикирин моюнга алып, макулдашыңыз. Маектешиңиз адегенде каршы чыгат.',
    },
    turns: [
      {
        ai: 'Hallo! Ich möchte eine Katze in unsere WG holen. Wie findest du die Idee?',
        aiRu: 'Привет! Я хочу взять кошку в нашу квартиру. Как тебе эта идея?',
        aiKy: 'Салам! Мен биздин батирге мышык алгым келет. Бул идея сага кандай жагат?',
        hints: ['Ich finde die Idee gut, weil …', 'Meiner Meinung nach ist das ein Vorteil.', 'Ich bin nicht sicher, denn …'],
        keywords: ['finde', 'idee', 'weil', 'meinung'],
      },
      {
        ai: 'Aber Katzen machen Dreck und sind manchmal laut. Das ist doch ein Nachteil!',
        aiRu: 'Но кошки пачкают и иногда шумят. Это же минус!',
        aiKy: 'Бирок мышыктар булгайт жана кээде ызы-чуу чыгарат. Бул кемчилик го!',
        hints: ['Zwar machen Katzen Dreck, aber …', 'Obwohl Katzen manchmal laut sind, …', 'Trotzdem finde ich die Idee gut.'],
        keywords: ['zwar', 'aber', 'obwohl', 'trotzdem'],
      },
      {
        ai: 'Warum ist dir das so wichtig?',
        aiRu: 'Почему тебе это так важно?',
        aiKy: 'Эмне үчүн бул сен үчүн ушунчалык маанилүү?',
        hints: [
          'Weil ich mich dann nicht allein fühle.',
          'Ein Haustier hat viele Vorteile.',
          'Je länger ich allein bin, desto mehr wünsche ich mir ein Tier.',
        ],
        keywords: ['weil', 'vorteile', 'je', 'desto'],
      },
      {
        ai: 'Das ist ein starkes Argument. Ich mache dir einen Vorschlag: Wir probieren es einen Monat.',
        aiRu: 'Это сильный довод. Я предлагаю: давай попробуем на один месяц.',
        aiKy: 'Бул күчтүү далил. Мен сунуш кылам: бир ай байкап көрөлү.',
        hints: ['Da hast du recht.', 'Ich stimme dir zu.', 'Das sehe ich anders.'],
        keywords: ['recht', 'stimme', 'zu', 'anders'],
      },
      {
        ai: 'Dann müssen wir Regeln machen. Entweder bleibt die Katze in meinem Zimmer, oder sie darf ins Wohnzimmer.',
        aiRu: 'Тогда нам нужны правила. Либо кошка остаётся в моей комнате, либо ей можно в гостиную.',
        aiKy: 'Анда бизге эрежелер керек. Же мышык менин бөлмөмдө калат, же конок бөлмөгө киришине болот.',
        hints: ['Entweder … oder …', 'Ich möchte weder … noch …', 'Sowohl du als auch ich müssen helfen.'],
        keywords: ['entweder', 'oder', 'weder', 'sowohl'],
      },
      {
        ai: 'Und jetzt sag mir deine Entscheidung. Bist du einverstanden?',
        aiRu: 'А теперь скажи мне своё решение. Ты согласен?',
        aiKy: 'Эми өз чечимиңди айт. Макулсуңбу?',
        hints: [
          'Obwohl es nicht perfekt ist, bin ich einverstanden.',
          'Ich bin nicht einverstanden, weil …',
          'Trotzdem unterstütze ich den Plan.',
        ],
        keywords: ['einverstanden', 'obwohl', 'trotzdem', 'weil'],
      },
    ],
    source: UNIT_22_SOURCE,
  },
]

export const UNIT_22_WRITING: WritingTask[] = [
  {
    id: 'b1-wr-22-01',
    unit: 22,
    level: 'B1',
    title: 'Ein Beitrag im Forum: Pro und Kontra',
    situation: {
      ru: 'В интернет-форуме обсуждают вопрос: «Должны ли дети иметь собственный смартфон?» (можно выбрать другую знакомую тему: домашнее животное, город или деревня). Напишите свой пост: выскажите мнение, объясните причину, признайте возражение и дайте совет. Не меньше 80 слов.',
      ky: 'Интернет-форумда «Балдардын жеке смартфону болушу керекпи?» деген суроо талкууланууда (башка таанаш теманы тандаса болот: үй жаныбары, шаар же айыл). Өз постуңузду жазыңыз: пикириңизди айтыңыз, себебин түшүндүрүңүз, каршы пикирди моюнга алыңыз жана кеңеш бериңиз. Кеминде 80 сөз.',
    },
    formal: false,
    minWords: 80,
    mustInclude: [
      {
        label: 'Gruß (Hallo zusammen … / Viele Grüße)',
        patterns: ['hallo', 'liebe ', 'hi ', 'grüße', 'bis bald'],
        explain: {
          ru: 'Приветствие в начале и подпись или прощание в конце поста.',
          ky: 'Постун башында саламдашуу, аягында кол тамга же коштошуу.',
        },
      },
      {
        label: 'Eigene Meinung (Ich finde, dass … / Meiner Meinung nach …)',
        patterns: ['ich finde', 'ich denke', 'ich glaube', 'meiner meinung nach'],
        explain: {
          ru: 'Ваше мнение: одно предложение с Ich finde, dass … или Meiner Meinung nach …',
          ky: 'Сиздин пикириңиз: Ich finde, dass … же Meiner Meinung nach … менен бир сүйлөм.',
        },
      },
      {
        label: 'Ein Grund mit weil',
        patterns: ['weil '],
        explain: { ru: 'Причина с союзом weil: глагол стоит в конце.', ky: 'weil байламтасы менен себеп: этиш аягында турат.' },
      },
      {
        label: 'Ein Zugeständnis (obwohl / trotzdem / zwar … aber)',
        patterns: ['obwohl', 'trotzdem', 'zwar'],
        explain: {
          ru: 'Признание возражения: obwohl, trotzdem или zwar … aber.',
          ky: 'Каршы пикирди моюнга алуу: obwohl, trotzdem же zwar … aber.',
        },
      },
      {
        label: 'Ein Doppelkonnektor (je … desto / weder … noch / entweder … oder / sowohl … als auch)',
        patterns: ['desto', 'weder', 'entweder', 'sowohl'],
        explain: {
          ru: 'Один двойной союз: je … desto, weder … noch, entweder … oder или sowohl … als auch.',
          ky: 'Бир эки бөлүктүү байламта: je … desto, weder … noch, entweder … oder же sowohl … als auch.',
        },
      },
      {
        label: 'Ein Tipp am Schluss (Mein Tipp: … / Ich schlage vor, …)',
        patterns: ['mein tipp', 'schlage vor', 'empfehle', 'mein vorschlag'],
        explain: {
          ru: 'Совет или предложение в конце: Mein Tipp: … или Ich schlage vor, …',
          ky: 'Аягында кеңеш же сунуш: Mein Tipp: … же Ich schlage vor, …',
        },
      },
    ],
    model:
      'Hallo zusammen, ich finde, dass Kinder ab zwölf Jahren ein Smartphone haben dürfen. Es hat viele Vorteile: Die Kinder erreichen ihre Eltern schnell, und sie finden Informationen für die Schule. Zwar kann ein Handy auch ein Risiko sein, aber mit einer klaren Regel geht es gut. Obwohl viele Eltern dagegen sind, bleibe ich bei meiner Meinung, weil Verbote nicht helfen. Je früher Kinder das Handy kennenlernen, desto vernünftiger nutzen sie es. Mein Tipp: Das Handy bleibt nachts weder im Zimmer noch im Bett. Viele Grüße, Aylin',
    tips: [
      {
        ru: 'Начните с мнения («Ich finde, dass …») и сразу назовите причину с weil: в части с weil глагол стоит в конце.',
        ky: 'Пикириңизден баштаңыз («Ich finde, dass …») жана себебин дароо weil менен атаңыз: weil бөлүгүндө этиш аягында турат.',
      },
      {
        ru: 'Признайте возражение: obwohl (глагол в конце), trotzdem (глагол на втором месте) или zwar … aber. Так ваш текст звучит взвешенно.',
        ky: 'Каршы пикирди моюнга алыңыз: obwohl (этиш аягында), trotzdem (этиш экинчи орунда) же zwar … aber. Ошондо текстиңиз таразаланган болуп угулат.',
      },
      {
        ru: 'Используйте один двойной союз, который вы хорошо знаете: je … desto (оба раза сравнительная степень) или weder … noch. Einerseits … andererseits для письма пока не нужны.',
        ky: 'Жакшы билген бир эки бөлүктүү байламтаны колдонуңуз: je … desto (эки жолу тең салыштырма даража) же weder … noch. Einerseits … andererseits жазуу үчүн азырынча керек эмес.',
      },
      {
        ru: 'После артикля прилагательное в Dativ и во множественном числе получает -en: «mit einem guten Argument», «die wichtigen Gründe».',
        ky: 'Артиклден кийин Dativде жана көптүк санда сын атоочко -en кошулат: «mit einem guten Argument», «die wichtigen Gründe».',
      },
      {
        ru: 'После написания пройдите по списку ниже и оцените себя сами: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
        ky: 'Жазып бүткөндөн кийин төмөнкү тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
      },
    ],
    source: UNIT_22_SOURCE,
  },
]
