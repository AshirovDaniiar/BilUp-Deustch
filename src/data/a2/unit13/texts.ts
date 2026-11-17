import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_13_SOURCE } from '../provenance'

/**
 * Unit 13 texts (Stage 7D): 2 listening dialogues, 2 readings, 1 speaking scenario, 1 writing task.
 * Rules applied (Stage 7B audit, decisions D-1 and D-5): no imperative (house rules are nominal notices: `Ruhe: täglich von 22 bis 6 Uhr`), no
 * `dürfen` / `man`, no `wenn` / `dass` / Konjunktiv II, no ordinals, no date with a month. Attributive adjectives only after ein-/kein-/mein-
 * (Nominativ, Akkusativ, singular); predicative adjectives are unlimited. A household problem (a broken heating) is reported in a listening
 * dialogue with everyday words (`funktioniert nicht`); these are text words, not vocabulary items, and no task requires them.
 */
export const UNIT_13_LISTENING: ListeningExercise[] = [
  {
    id: 'a2-li-13-01',
    unit: 13,
    level: 'A2',
    title: 'Am Telefon: Eine Wohnung besichtigen',
    lines: [
      { speaker: 'Herr Brandt', text: 'Brandt, guten Tag.', ru: 'Брандт, добрый день.', ky: 'Брандт угуп жатат, кайырлуу күн.' },
      { speaker: 'Frau Petrova', text: 'Guten Tag, hier spricht Petrova. Ich habe Ihre Anzeige gelesen. Ist die Wohnung noch frei?', ru: 'Добрый день, говорит Петрова. Я прочитала ваше объявление. Квартира ещё свободна?', ky: 'Кайырлуу күн, Петрова сүйлөп жатат. Мен сиздин жарнамаңызды окудум. Батир азырынча бошпу?' },
      { speaker: 'Herr Brandt', text: 'Ja, die Wohnung ist noch frei. Sie hat zwei Zimmer und einen kleinen Balkon. Es gibt auch einen Aufzug.', ru: 'Да, квартира ещё свободна. В ней две комнаты и небольшой балкон. Есть и лифт.', ky: 'Ооба, батир азырынча бош. Анда эки бөлмө жана кичинекей балкон бар. Лифт да бар.' },
      { speaker: 'Frau Petrova', text: 'Wie hoch ist die Miete?', ru: 'Сколько стоит аренда?', ky: 'Ижара акысы канча?' },
      { speaker: 'Herr Brandt', text: 'Die Miete kostet 650 Euro. Dazu kommen 120 Euro Nebenkosten.', ru: 'Аренда стоит 650 евро. К этому добавляются 120 евро дополнительных платежей.', ky: 'Ижара акысы 650 евро. Ага 120 евро кошумча төлөмдөр кошулат.' },
      { speaker: 'Frau Petrova', text: 'Und wie viel Kaution muss ich bezahlen?', ru: 'А сколько залога мне нужно заплатить?', ky: 'Ал эми кепилдик акчаны канча төлөшүм керек?' },
      { speaker: 'Herr Brandt', text: 'Für die Kaution brauchen Sie 1.300 Euro. Möchten Sie die Wohnung sehen?', ru: 'Для залога вам нужно 1300 евро. Хотите посмотреть квартиру?', ky: 'Кепилдик акча үчүн сизге 1300 евро керек. Батирди көргүңүз келеби?' },
      { speaker: 'Frau Petrova', text: 'Ja, gern. Ist eine Besichtigung am Donnerstag möglich?', ru: 'Да, с удовольствием. Можно осмотреть квартиру в четверг?', ky: 'Ооба, кубанам. Бейшемби күнү батирди көрүп чыгууга болобу?' },
      { speaker: 'Herr Brandt', text: 'Donnerstag um 17 Uhr passt gut. Die Adresse ist Lindenstraße 8.', ru: 'В четверг в 17 часов подходит. Адрес — Линденштрассе, 8.', ky: 'Бейшемби күнү саат 17де ылайыктуу. Дареги — Линденштрассе, 8.' },
      { speaker: 'Frau Petrova', text: 'Sehr gut, dann komme ich am Donnerstag um 17 Uhr. Vielen Dank, Herr Brandt. Auf Wiederhören!', ru: 'Очень хорошо, тогда я приду в четверг в 17 часов. Большое спасибо, господин Брандт. До свидания!', ky: 'Абдан жакшы, анда бейшемби күнү саат 17де келем. Чоң рахмат, Брандт мырза. Саламат болуңуз!' },
    ],
    questions: [
      { q: 'Wie hoch sind die Nebenkosten?', options: ['650 Euro', '120 Euro', '1.300 Euro'], answer: 1 },
      { q: 'Wann ist die Besichtigung?', options: ['Donnerstag um 17 Uhr', 'Donnerstag um 15 Uhr', 'Freitag um 17 Uhr'], answer: 0 },
      { q: 'Wie viel Kaution braucht man?', options: ['120 Euro', '650 Euro', '1.300 Euro'], answer: 2 },
      { q: 'Was sagt Herr Brandt über das Haus?', options: ['Es hat keinen Keller.', 'Es gibt einen Aufzug.', 'Es ist nicht mehr frei.'], answer: 1 },
    ],
    keywords: ['Anzeige', 'Nebenkosten', 'Kaution', 'Besichtigung', 'Aufzug'],
    source: UNIT_13_SOURCE,
  },
  {
    id: 'a2-li-13-02',
    unit: 13,
    level: 'A2',
    title: 'Der Umzug: Wohin kommt was?',
    lines: [
      { speaker: 'Tim', text: 'So, alles steht im Flur. Wohin stellen wir zuerst das Regal?', ru: 'Так, всё стоит в коридоре. Куда мы сначала поставим полку?', ky: 'Ошентип, баары коридордо турат. Адегенде текчени кайсы жакка коёбуз?' },
      { speaker: 'Lena', text: 'Das Regal kommt ins Wohnzimmer, an die Wand neben die Tür.', ru: 'Полка пойдёт в гостиную, к стене рядом с дверью.', ky: 'Текче конок бөлмөгө, эшиктин жанындагы дубалга коюлат.' },
      { speaker: 'Tim', text: 'Gut. Und das Sofa? Ich stelle es vor das Fenster.', ru: 'Хорошо. А диван? Я поставлю его перед окном.', ky: 'Макул. Ал эми диван? Мен аны терезенин алдына коём.' },
      { speaker: 'Lena', text: 'Nein, lieber an die Wand. Die Heizung unter dem Fenster funktioniert nicht, da ist es immer kalt.', ru: 'Нет, лучше к стене. Отопление под окном не работает, там всегда холодно.', ky: 'Жок, дубалга коюу жакшыраак. Терезенин астындагы жылытуу системасы иштебейт, ал жер дайыма суук.' },
      { speaker: 'Tim', text: 'Dann schreibst du dem Vermieter, oder?', ru: 'Тогда ты напишешь арендодателю, да?', ky: 'Анда сен үй ээсине жазасың, туурабы?' },
      { speaker: 'Lena', text: 'Ja, heute Abend. Die Lampe stelle ich auf das Regal.', ru: 'Да, сегодня вечером. Лампу я поставлю на полку.', ky: 'Ооба, бүгүн кечинде. Лампаны мен текчеге коём.' },
      { speaker: 'Tim', text: 'Und das Bild? Ich hänge es über das Sofa.', ru: 'А картина? Я повешу её над диваном.', ky: 'Ал эми сүрөт? Мен аны дивандын үстүнө илем.' },
      { speaker: 'Lena', text: 'Gute Idee. Die Waschmaschine steht schon im Bad.', ru: 'Хорошая идея. Стиральная машина уже стоит в ванной.', ky: 'Жакшы идея. Кир жуугуч машина ваннада эле турат.' },
      { speaker: 'Tim', text: 'Dann ist fast alles fertig. Deine Wohnung ist richtig gemütlich!', ru: 'Тогда почти всё готово. Твоя квартира по-настоящему уютная!', ky: 'Анда дээрлик баары даяр. Сенин батириң чындап эле жайлуу!' },
      { speaker: 'Lena', text: 'Danke für deine Hilfe! Du bekommst heute Abend eine Pizza.', ru: 'Спасибо за помощь! Вечером ты получишь пиццу.', ky: 'Жардамың үчүн рахмат! Бүгүн кечинде пицца жейсиң.' },
    ],
    questions: [
      { q: 'Wohin kommt das Regal?', options: ['Ins Schlafzimmer', 'In den Keller', 'Ins Wohnzimmer'], answer: 2 },
      { q: 'Warum stellen sie das Sofa nicht vor das Fenster?', options: ['Die Heizung unter dem Fenster funktioniert nicht.', 'Das Fenster ist zu klein.', 'Das Sofa ist zu groß.'], answer: 0 },
      { q: 'Was macht Lena heute Abend?', options: ['Sie kauft ein Regal.', 'Sie schreibt dem Vermieter.', 'Sie ruft Tim an.'], answer: 1 },
      { q: 'Wo steht die Waschmaschine?', options: ['Im Keller', 'Im Flur', 'Im Bad'], answer: 2 },
    ],
    keywords: ['Regal', 'Sofa', 'Heizung', 'Vermieter', 'Waschmaschine'],
    source: UNIT_13_SOURCE,
  },
]

export const UNIT_13_READING: ReadingText[] = [
  {
    id: 'a2-re-13-01',
    unit: 13,
    level: 'A2',
    title: 'Wohnung zu vermieten',
    body: [
      'Wohnung zu vermieten: 2 Zimmer, Küche, Bad, 58 m², Balkon, Keller, Dachboden. Ab sofort frei.',
      'Die Wohnung ist hell, geräumig und modern. Das Bad ist neu renoviert. Sie hat eine neue Küche mit Herd und einen kleinen Balkon. Im Haus gibt es einen Aufzug. Die Heizung ist auch neu. Die Wohnung ist nicht möbliert.',
      'Miete: 640 Euro. Nebenkosten: 110 Euro. Kaution: 1.280 Euro.',
      'Besichtigung: Mittwoch oder Freitag, 18 Uhr. Bitte anrufen: Frau Keller, Telefon 0151 234 567.',
    ],
    gloss: [
      { word: 'zu vermieten', ru: 'сдаётся (в аренду)', ky: 'ижарага берилет', example: 'Wohnung zu vermieten.', grammar: 'устойчивая формула объявлений: zu vermieten = «сдаётся»; строить такую форму самому пока не нужно', grammarKy: 'жарнамалардагы туруктуу сөз айкашы: zu vermieten = «ижарага берилет»; мындай форманы азырынча өзүңүз түзбөйсүз', related: ['die Anzeige', 'der Mieter'] },
      { word: 'm²', ru: 'квадратных метров (Quadratmeter)', ky: 'чарчы метр (Quadratmeter)', example: 'Die Wohnung hat 58 m².', grammar: 'сокращение в объявлениях: m² читается «Quadratmeter» и показывает площадь', grammarKy: 'жарнамалардагы кыскартуу: m² «Quadratmeter» деп окулат жана аянтты көрсөтөт', related: ['das Zimmer', 'geräumig'] },
      { word: 'ab sofort', ru: 'сразу, с этого момента', ky: 'дароо, ушул замандан тартып', example: 'Die Wohnung ist ab sofort frei.', grammar: 'ab sofort = «прямо сейчас»; фраза из объявлений, дату называть не нужно', grammarKy: 'ab sofort = «азыр эле»; жарнамалардагы сөз айкашы, күндү атоонун кереги жок', related: ['einziehen', 'die Anzeige'] },
      { word: 'Nebenkosten', ru: 'дополнительные платежи (вода, отопление, вывоз мусора)', ky: 'кошумча төлөмдөр (суу, жылытуу, таштанды)', example: 'Die Nebenkosten sind nicht in der Miete.', grammar: 'только множественное число; их платят каждый месяц вместе с арендой: Miete + Nebenkosten', grammarKy: 'көптүк санда гана колдонулат; аларды ар айда ижара акысы менен бирге төлөшөт: Miete + Nebenkosten', related: ['die Kaution', 'der Mietvertrag'] },
      { word: 'nicht möbliert', ru: 'без мебели', ky: 'эмереги жок', example: 'Das Zimmer ist nicht möbliert.', grammar: 'nicht + прилагательное после sein: окончания нет; в квартире нет шкафов, кровати, стола', grammarKy: 'sein этишинен кийин nicht + сын атооч: аякталыш жок; батирде шкаф, керебет, стол жок', related: ['möbliert', 'das Regal'] },
    ],
    questions: [
      { q: 'Wie viel muss man jeden Monat bezahlen?', options: ['640 Euro', '750 Euro', '1.280 Euro'], answer: 1 },
      { q: 'Herr Ali hat keine Möbel. Passt die Wohnung für ihn?', options: ['Ja, die Wohnung ist möbliert.', 'Ja, die Wohnung hat einen Keller.', 'Nein, die Wohnung ist nicht möbliert.'], answer: 2 },
      { q: 'Wann kann man die Wohnung sehen?', options: ['Am Mittwoch oder am Freitag um 18 Uhr.', 'Jeden Tag um 8 Uhr.', 'Nur am Samstag.'], answer: 0 },
    ],
    source: UNIT_13_SOURCE,
  },
  {
    id: 'a2-re-13-02',
    unit: 13,
    level: 'A2',
    title: 'Hausordnung und eine Notiz',
    body: [
      'Hausordnung – Lindenstraße 8',
      'Ruhe: täglich von 22 bis 6 Uhr. Waschmaschine im Keller: Montag und Donnerstag. Fahrräder bitte nicht im Flur. Mülltrennung: Papier, Glas, Restmüll.',
      'Notiz von Frau Demir (Wohnung 5): Liebe Nachbarn, am Samstag habe ich Geburtstag. Am Abend ist es bei uns etwas laut. Entschuldigung für den Lärm! Sie können gern vorbeikommen.',
    ],
    gloss: [
      { word: 'Ruhe', ru: 'тишина (время, когда нельзя шуметь)', ky: 'тынчтык (ызы-чуу кылууга болбогон убакыт)', example: 'Ruhe: täglich von 22 bis 6 Uhr.', grammar: 'объявление без глагола: «Ruhe: von … bis …» значит, что в это время нужно вести себя тихо', grammarKy: 'этишсиз жарыя: «Ruhe: von … bis …» бул убакытта тынч болуу керек дегенди билдирет', related: ['der Lärm', 'die Hausordnung'] },
      { word: 'bitte nicht', ru: 'просьба не …', ky: '…басаңыз экен деген өтүнүч', example: 'Fahrräder bitte nicht im Flur.', grammar: 'короткая просьба без глагола: «Fahrräder bitte nicht im Flur» = «Просим не оставлять велосипеды в коридоре»; такие записки вы понимаете, но сами не строите', grammarKy: 'этишсиз кыска өтүнүч: «Fahrräder bitte nicht im Flur» = «Велосипедди коридорго койбосоңуз экен»; мындай эскертмелерди түшүнөсүз, бирок өзүңүз түзбөйсүз', related: ['der Flur', 'stören'] },
      { word: 'Mülltrennung', ru: 'раздельный сбор мусора', ky: 'таштандыны түрү боюнча бөлүү', example: 'Die Mülltrennung steht in der Hausordnung.', grammar: 'составное существительное: Müll + die Trennung = die Mülltrennung (артикль — по последнему слову)', grammarKy: 'татаал зат атооч: Müll + die Trennung = die Mülltrennung (артикль акыркы сөз боюнча)', related: ['der Müll', 'die Hausordnung'] },
      { word: 'Restmüll', ru: 'остаточный мусор (всё, что не бумага и не стекло)', ky: 'калган таштанды (кагаз менен айнектен башкасынын баары)', example: 'Papier, Glas, Restmüll.', grammar: 'составное существительное: der Rest + der Müll = der Restmüll', grammarKy: 'татаал зат атооч: der Rest + der Müll = der Restmüll', related: ['der Müll', 'die Mülltrennung'] },
      { word: 'vorbeikommen', ru: 'зайти, заглянуть', ky: 'бир кирип кетүү', example: 'Sie können gern vorbeikommen.', grammar: 'отделяемая приставка: в инфинитиве слитно (vorbeikommen), в обычном предложении она уходит в конец: Ich komme vorbei.', grammarKy: 'инфинитивде приставка этиш менен бирге жазылат (vorbeikommen); кадимки сүйлөмдө приставка аягына чыгат: Ich komme vorbei.', related: ['der Nachbar', 'grüßen'] },
    ],
    questions: [
      { q: 'Wann ist in diesem Haus Ruhe?', options: ['Von 22 bis 6 Uhr.', 'Von 6 bis 22 Uhr.', 'Nur am Wochenende.'], answer: 0 },
      { q: 'Wann kann man im Haus waschen?', options: ['Nur am Samstag.', 'Am Montag und am Donnerstag.', 'Jeden Tag ab 22 Uhr.'], answer: 1 },
      { q: 'Warum schreibt Frau Demir die Notiz?', options: ['Sie hat ein Problem mit dem Müll.', 'Sie zieht am Samstag aus.', 'Sie hat am Samstag Geburtstag, und abends ist es laut.'], answer: 2 },
    ],
    source: UNIT_13_SOURCE,
  },
]

export const UNIT_13_SPEAKING: SpeakingScenario[] = [
  {
    id: 'a2-sp-13-01',
    title: 'Die Wohnung besichtigen',
    titleRu: 'Осмотр квартиры',
    titleKy: 'Батирди көрүп чыгуу',
    icon: '🏠',
    level: 'A2',
    goal: {
      ru: 'Вы осматриваете квартиру вместе с арендодателем (на «Sie»). Скажите, что вам нравится, спросите о дополнительных платежах и залоге, сравните квартиру с вашей нынешней и скажите, куда вы поставите мебель.',
      ky: 'Сиз үй ээси менен бирге батирди көрүп жатасыз («Sie» формасында сүйлөшөсүз). Эмне жактырганыңызды айтыңыз, кошумча төлөмдөр менен кепилдик акча жөнүндө сураңыз, батирди азыркы батириңиз менен салыштырыңыз жана эмерегиңизди кайсы жакка коерүңүздү айтыңыз.',
    },
    turns: [
      {
        ai: 'Guten Tag, ich bin Herr Brandt, der Vermieter. Wie gefällt Ihnen die Wohnung?',
        aiRu: 'Добрый день, я господин Брандт, арендодатель. Как вам квартира?',
        aiKy: 'Кайырлуу күн, мен Брандт мырза, үй ээсимин. Батир сизге кандай жагат?',
        hints: ['Die Wohnung ist hell und modern.', 'Das Wohnzimmer ist sehr gemütlich.'],
        keywords: ['wohnung', 'hell', 'gemütlich'],
      },
      {
        ai: 'Haben Sie noch Fragen zur Miete?',
        aiRu: 'У вас есть ещё вопросы по аренде?',
        aiKy: 'Ижара акысына байланыштуу дагы суроолоруңуз барбы?',
        hints: ['Wie hoch sind die Nebenkosten?', 'Wie viel Kaution muss ich bezahlen?'],
        keywords: ['nebenkosten', 'kaution'],
      },
      {
        ai: 'Wo wohnen Sie jetzt? Ist diese Wohnung größer?',
        aiRu: 'Где вы живёте сейчас? Эта квартира больше?',
        aiKy: 'Азыр кайда жашайсыз? Бул батир чоңбу?',
        hints: ['Meine Wohnung ist kleiner und dunkler als diese Wohnung.', 'Diese Wohnung ist größer als meine Wohnung.'],
        keywords: ['als', 'kleiner', 'größer'],
      },
      {
        ai: 'Möchten Sie die Wohnung nehmen? Und wohin stellen Sie Ihre Möbel?',
        aiRu: 'Хотите взять эту квартиру? И куда вы поставите свою мебель?',
        aiKy: 'Бул батирди алгыңыз келеби? Ал эми эмерегиңизди кайсы жакка коёсуз?',
        hints: ['Ja, ich nehme die Wohnung. Das Sofa stelle ich ins Wohnzimmer.', 'Das Bett steht im Schlafzimmer.', 'Das Regal stelle ich in den Flur.'],
        keywords: ['stelle', 'sofa', 'schlafzimmer'],
      },
    ],
    source: UNIT_13_SOURCE,
  },
]

export const UNIT_13_WRITING: WritingTask[] = [
  {
    id: 'a2-wr-13-01',
    unit: 13,
    level: 'A2',
    title: 'Eine E-Mail zur Wohnungsanzeige',
    situation: {
      ru: 'Вы прочитали объявление о квартире. Напишите короткое официальное письмо арендодателю (на «Sie»): скажите, что прочитали объявление, опишите, какую квартиру вы ищете, задайте вопрос о дополнительных платежах или о залоге, сравните квартиру с вашей нынешней, скажите, что хотите её посмотреть, и предложите день и время.',
      ky: 'Сиз батир жөнүндөгү жарнаманы окудуңуз. Үй ээсине («Sie» формасында) кыска расмий кат жазыңыз: жарнаманы окуганыңызды айтыңыз, кандай батир издегениңизди сүрөттөңүз, кошумча төлөмдөр же кепилдик акча жөнүндө суроо бериңиз, батирди азыркы батириңиз менен салыштырыңыз, аны көргүңүз келерин айтыңыз жана күн менен убакытты сунуштаңыз.',
    },
    formal: true,
    minWords: 50,
    mustInclude: [
      { label: 'Anrede (Sehr geehrte Frau … / Sehr geehrter Herr …)', patterns: ['sehr geehrte'] },
      { label: 'Anzeige gelesen', patterns: ['anzeige'] },
      {
        label: 'Adjektiv mit Endung (eine helle Wohnung, einen großen Balkon …)',
        patterns: ['eine helle', 'eine kleine', 'eine moderne', 'eine ruhige', 'eine große', 'einen großen', 'einen kleinen', 'ein helles', 'ein großes', 'ein kleines', 'ein gemütliches', 'eine gemütliche'],
      },
      { label: 'Frage zu Nebenkosten oder Kaution', patterns: ['nebenkosten', 'kaution'] },
      { label: 'Vergleich mit als (größer / kleiner / heller … als)', patterns: [' als '] },
      { label: 'Wunsch (Ich möchte …)', patterns: ['möchte'] },
      { label: 'Besichtigung mit Tag und Uhrzeit', patterns: ['besichtigung'] },
      { label: 'Schluss (Mit freundlichen Grüßen)', patterns: ['mit freundlichen grüßen'] },
    ],
    model:
      'Sehr geehrte Frau Keller, ich habe Ihre Anzeige im Internet gelesen. Ich suche eine helle Wohnung mit Balkon, und Ihre Wohnung gefällt mir sehr. Sie ist größer als meine Wohnung. Wie hoch sind die Nebenkosten? Muss ich eine Kaution bezahlen? Ich möchte die Wohnung gern sehen. Ist am Mittwoch um 18 Uhr eine Besichtigung möglich? Vielen Dank und mit freundlichen Grüßen, Aida Petrova',
    tips: [
      {
        ru: 'Официальное письмо начинается с «Sehr geehrte Frau …» или «Sehr geehrter Herr …» и заканчивается словами «Mit freundlichen Grüßen».',
        ky: 'Расмий кат «Sehr geehrte Frau …» же «Sehr geehrter Herr …» деген сөздөрдөн башталып, «Mit freundlichen Grüßen» деген сөздөр менен аяктайт.',
      },
      {
        ru: 'Описывая нужную квартиру, ставьте окончания: «eine helle Wohnung», «einen großen Balkon», «ein gemütliches Zimmer».',
        ky: 'Керектүү батирди сүрөттөгөндө аякталыштарды коюңуз: «eine helle Wohnung», «einen großen Balkon», «ein gemütliches Zimmer».',
      },
      {
        ru: 'Для сравнения: «Ihre Wohnung ist größer als meine Wohnung». После сравнения «чем» передаёт als, а не wie.',
        ky: 'Салыштыруу үчүн: «Ihre Wohnung ist größer als meine Wohnung». Салыштыруудан кийин «…дан» маанисин als берет, wie эмес.',
      },
      {
        ru: 'Вежливый вопрос о времени: «Ist am Mittwoch um 18 Uhr eine Besichtigung möglich?». Назовите день недели и время.',
        ky: 'Убакыт жөнүндө сылык суроо: «Ist am Mittwoch um 18 Uhr eine Besichtigung möglich?». Жуманын күнүн жана убакытты атаңыз.',
      },
    ],
    source: UNIT_13_SOURCE,
  },
]
