import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_23_SOURCE } from './unit'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 23 grammar — the two APPROVED concepts of the unit (docs/b1/B1_ID_CONVENTIONS.md), nothing else:
 *  1. `b1-relativsaetze-nom-akk` (H, productive): relative clauses with the relative pronoun in the Nominativ or Akkusativ (der / die / das / die; den / die / das /
 *     die). NOT taught: relative clauses with a preposition, Dativ or Genitiv (Unit 29).
 *  2. `b1-infinitiv-mit-zu` (M, productive): zu + Infinitiv (also with separable verbs: aufzustehen) and um … zu. `ohne … zu` and `statt … zu` are RECEPTIVE
 *     only (one line in the explanation and one glossed reading; never in a gap, a word order or a checklist item). `damit` is Unit 30.
 * Not taught here: Passiv, Konjunktiv II, adjectives without article (Unit 24), verbs with a prepositional object (Unit 28).
 * Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native speaker. It describes the
 * grammar idea and does not use invented grammatical labels (see docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md).
 */
export const UNIT_23_GRAMMAR: GrammarConcept[] = [
  {
    id: 'b1-relativsaetze-nom-akk',
    category: 'relative',
    level: 'B1',
    unit: 23,
    visual: 'verbpos',
    title: l(
      'Relativsatz (der, die, das; den) — описать человека или вещь точнее',
      'Relativsatz (der, die, das; den) — адамды же нерсени тагыраак сүрөттөө',
    ),
    summary: l(
      'В объявлении и на собеседовании нужно точно описать, кого или что вы ищете: «Wir suchen einen Mitarbeiter, der gern im Team arbeitet». Часть после запятой с der / die / das / den называется Relativsatz: она уточняет слово перед запятой. Относительное местоимение берёт род и число у этого слова (der Mitarbeiter → der), а падеж — от своей роли в придаточной части: подлежащее — Nominativ (der, die, das), дополнение — Akkusativ (den, die, das). Глагол стоит в самом конце, части отделяются запятыми.',
      'Жарыяда жана маекте кимди же эмнени издеп жатканыңызды так айтуу керек: «Wir suchen einen Mitarbeiter, der gern im Team arbeitet». Үтүрдөн кийинки der / die / das / den менен башталган бөлүк Relativsatz деп аталат: ал үтүрдүн алдындагы сөздү тактайт. der / die / das / den сөзү атынын жынысын жана санын алдыңкы сөздөн алат (der Mitarbeiter → der), ал эми жалгоосу сүйлөм бөлүгүндөгү ролуна жараша болот: ээ болсо — Nominativ (der, die, das), толуктоочу болсо — Akkusativ (den, die, das). Этиш эң аягында турат, бөлүктөр үтүр менен бөлүнөт.',
    ),
    discover: l(
      'Сравните: «Der Chef ist nett. Alle mögen ihn» и «Der Chef, den alle mögen, ist nett». Что стало одним предложением? Какое слово заменило «ihn» и где теперь стоит глагол mögen?',
      '«Der Chef ist nett. Alle mögen ihn» жана «Der Chef, den alle mögen, ist nett» сүйлөмдөрүн салыштырыңыз. Эмне бир сүйлөм болду? «ihn» сөзүнүн ордуна кайсы сөз келди жана mögen этиши эми кайда турат?',
    ),
    why: l(
      'В A2 вы описывали двумя короткими предложениями. На B1 нужно соединять информацию: «Ich habe in einer Firma gearbeitet, die viele Kunden hatte». Так звучат хорошие заявки, анкеты и ответы на собеседовании: коротко, точно и без повторов. Тот же приём вы встретите почти в каждом немецком тексте.',
      'A2 деңгээлинде сиз эки кыска сүйлөм менен сүрөттөдүңүз. B1 деңгээлинде маалыматты бириктирүү керек: «Ich habe in einer Firma gearbeitet, die viele Kunden hatte». Жакшы өтүнүчтөр, анкеталар жана маектеги жооптор ушундай угулат: кыска, так жана кайталоосуз. Бул ыкманы дээрлик ар бир немис текстинен көрөсүз.',
    ),
    when: [
      l(
        'Шаг 1 — род и число: слово перед запятой определяет форму. der Mann → der, die Firma → die, das Büro → das, die Kunden → die. «Das ist die Firma, die in Köln sitzt».',
        '1-кадам — жынысы жана саны: үтүрдүн алдындагы сөз формасын аныктайт. der Mann → der, die Firma → die, das Büro → das, die Kunden → die. «Das ist die Firma, die in Köln sitzt».',
      ),
      l(
        'Шаг 2 — падеж: кто или что делает действие в придаточной части? Тогда Nominativ: «der Mitarbeiter, der arbeitet». Кого или что оно касается? Тогда Akkusativ: «der Chef, den alle mögen». Различие видно только у мужского рода: der — den. У die и das формы одинаковые.',
        '2-кадам — жалгоосу: кошумча бөлүктө ким же эмне аракет кылат? Анда Nominativ: «der Mitarbeiter, der arbeitet». Аракет кимге же эмнеге багытталган? Анда Akkusativ: «der Chef, den alle mögen». Айырма эркек родто гана көрүнөт: der — den. die жана das менен формалар бирдей.',
      ),
      l(
        'Спрягаемый глагол стоит в самом конце: «die Stelle, die ich schon lange suche». Если глагол с приставкой, он пишется слитно: «der Kollege, der morgen anfängt».',
        'Этиш (жакка жараша өзгөргөн формасында) эң аягында турат: «die Stelle, die ich schon lange suche». Приставкасы бар этиш чогуу жазылат: «der Kollege, der morgen anfängt».',
      ),
      l(
        'Relativsatz всегда отделяется запятыми. Если он в середине, запятая стоит до и после: «Der Chef, den alle mögen, heißt Herr Wolf». В этом юните — только Nominativ и Akkusativ; Relativsätze с предлогами появятся в юните 29.',
        'Relativsatz дайыма үтүр менен бөлүнөт. Ортодо турса, үтүр мурун да, кийин да коюлат: «Der Chef, den alle mögen, heißt Herr Wolf». Бул бөлүмдө Nominativ жана Akkusativ гана; предлогу бар Relativsatz 29-бөлүмдө келет.',
      ),
    ],
    examples: [
      {
        de: 'Wir suchen einen Mitarbeiter, der gern im Team arbeitet.',
        ru: 'Мы ищем сотрудника, который любит работать в команде.',
        ky: 'Биз командада иштегенди жактырган кызматкерди издеп жатабыз.',
        focus: 'der (Nominativ): einen Mitarbeiter → der … arbeitet',
      },
      {
        de: 'Die Firma, die in Hamburg sitzt, sucht eine Verkäuferin.',
        ru: 'Фирма, которая находится в Гамбурге, ищет продавщицу.',
        ky: 'Гамбургда жайгашкан фирма сатуучу аял издеп жатат.',
        focus: 'die (Nominativ, Relativsatz in der Mitte)',
      },
      {
        de: 'Das ist die Stelle, die ich schon lange suche.',
        ru: 'Это должность, которую я давно ищу.',
        ky: 'Бул мен көптөн бери издеп жүргөн кызмат.',
        focus: 'die (Akkusativ: ich suche die Stelle)',
      },
      {
        de: 'Der Chef, den alle mögen, heißt Herr Wolf.',
        ru: 'Начальника, которого все любят, зовут господин Вольф.',
        ky: 'Баары жакшы көргөн начальниктин аты — Вольф мырза.',
        focus: 'den (Akkusativ, maskulin)',
      },
      {
        de: 'Ich habe ein Angebot bekommen, das sehr gut ist.',
        ru: 'Я получил предложение, которое очень хорошее.',
        ky: 'Мен абдан жакшы болгон сунуш алдым.',
        focus: 'das (Nominativ, Neutrum)',
      },
    ],
    mistakes: [
      {
        wrong: 'Das ist der Mann, die in der Firma arbeitet.',
        right: 'Das ist der Mann, der in der Firma arbeitet.',
        note: l(
          'Форма определяется словом перед запятой: der Mann → der, а не die.',
          'Форманы үтүрдүн алдындагы сөз аныктайт: der Mann → der, die эмес.',
        ),
      },
      {
        wrong: 'Der Chef, der alle mögen, ist nett.',
        right: 'Der Chef, den alle mögen, ist nett.',
        note: l(
          'Alle mögen den Chef — это дополнение, значит, Akkusativ: den.',
          'Alle mögen den Chef — бул толуктоочу, демек, Akkusativ: den.',
        ),
      },
      {
        wrong: 'Ich suche eine Stelle, die ist interessant.',
        right: 'Ich suche eine Stelle, die interessant ist.',
        note: l(
          'В Relativsatz глагол уходит в самый конец: …, die interessant ist.',
          'Relativsatz бөлүгүндө этиш эң аягына өтөт: …, die interessant ist.',
        ),
      },
      {
        wrong: 'Die Firma die in Hamburg sitzt sucht jemanden.',
        right: 'Die Firma, die in Hamburg sitzt, sucht jemanden.',
        note: l('Relativsatz отделяется запятыми с обеих сторон.', 'Relativsatz эки жагынан тең үтүр менен бөлүнөт.'),
      },
    ],
    reallife: [
      {
        de: 'Ich arbeite in einem Betrieb, der Möbel baut.',
        ru: 'Я работаю на предприятии, которое делает мебель.',
        ky: 'Мен эмерек жасаган ишканада иштейм.',
        focus: 'der',
      },
      {
        de: 'Die Kollegin, die mich einarbeitet, ist sehr geduldig.',
        ru: 'Коллега, которая вводит меня в курс дела, очень терпелива.',
        ky: 'Мени жумушка үйрөтүп жаткан кесиптеш аял абдан сабырдуу.',
        focus: 'die … einarbeitet',
      },
      {
        de: 'Das ist der Vertrag, den ich unterschreiben soll.',
        ru: 'Это договор, который я должен подписать.',
        ky: 'Бул мен кол коюшум керек болгон келишим.',
        focus: 'den (Akkusativ)',
      },
    ],
    dialogue: [
      {
        speaker: 'Frau Roth',
        text: 'Was für einen Mitarbeiter suchen Sie?',
        ru: 'Какого сотрудника вы ищете?',
        ky: 'Кандай кызматкер издеп жатасыз?',
      },
      {
        speaker: 'Herr Adler',
        text: 'Einen Kollegen, der zuverlässig ist und gern mit Kunden spricht.',
        ru: 'Коллегу, который надёжен и любит общаться с клиентами.',
        ky: 'Ишенимдүү жана кардарлар менен сүйлөшкөндү жактырган кесиптеш.',
      },
      {
        speaker: 'Frau Roth',
        text: 'Und welche Aufgaben hat er?',
        ru: 'А какие у него будут обязанности?',
        ky: 'Анын милдеттери кандай болот?',
      },
      {
        speaker: 'Herr Adler',
        text: 'Er bearbeitet die Anfragen, die per E-Mail kommen.',
        ru: 'Он обрабатывает запросы, которые приходят по электронной почте.',
        ky: 'Ал электрондук почта аркылуу келген сурамдарды иштеп чыгат.',
      },
      {
        speaker: 'Frau Roth',
        text: 'Gut. Ich kenne einen Bewerber, den Sie sicher mögen.',
        ru: 'Хорошо. Я знаю кандидата, который вам наверняка понравится.',
        ky: 'Жакшы. Мен сизге сөзсүз жагчу бир талапкерди билем.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Опишите идеального коллегу или работодателя. Используйте минимум два Relativsatz: «Ich suche einen Kollegen, der …», «Ich möchte eine Firma, die …».',
        'Идеалдуу кесиптешти же иш берүүчүнү сүрөттөп бериңиз. Кеминде эки Relativsatz колдонуңуз: «Ich suche einen Kollegen, der …», «Ich möchte eine Firma, die …».',
      ),
      sample:
        'Ich suche eine Firma, die ein gutes Arbeitsklima hat. Mein Kollege soll ein Mensch sein, der freundlich ist und den alle mögen.',
      keywords: ['firma', 'die', 'der', 'den'],
    },
    source: UNIT_23_SOURCE,
  },
  {
    id: 'b1-infinitiv-mit-zu',
    category: 'verbs',
    level: 'B1',
    unit: 23,
    visual: 'separable',
    title: l('Infinitiv mit zu und um … zu — цель и намерение', 'Infinitiv mit zu жана um … zu — максат жана ниет'),
    summary: l(
      'После многих выражений немецкий использует инфинитив с частицей zu: «Es ist wichtig, pünktlich zu sein». Zu стоит прямо перед инфинитивом в конце; перед ним ставится запятая. С глаголами с отделяемой приставкой zu встаёт между приставкой и основой: aufstehen → aufzustehen, einreichen → einzureichen. Для цели есть um … zu: «Ich lerne Deutsch, um eine Stelle zu finden» — «чтобы найти работу». После модальных глаголов (müssen, können, wollen) zu не нужно.',
      'Көптөгөн туюндурмалардан кийин немис тили zu бөлүкчөсү бар инфинитивди колдонот: «Es ist wichtig, pünktlich zu sein». zu инфинитивдин дароо алдында, сүйлөмдүн аягында турат; анын алдына үтүр коюлат. Приставкасы ажыраган этиштерде zu приставка менен уңгунун ортосуна кирет: aufstehen → aufzustehen, einreichen → einzureichen. Максатты көрсөтүү үчүн um … zu бар: «Ich lerne Deutsch, um eine Stelle zu finden» — «жумуш табуу үчүн». müssen, können, wollen сыяктуу модаль этиштерден кийин zu керек эмес.',
    ),
    discover: l(
      'Сравните: «Ich muss früh aufstehen» и «Ich versuche, früh aufzustehen». Что добавилось к инфинитиву и куда встало? Почему после müssen нет zu, а после versuchen есть?',
      '«Ich muss früh aufstehen» жана «Ich versuche, früh aufzustehen» сүйлөмдөрүн салыштырыңыз. Инфинитивге эмне кошулду жана кайда турат? Эмне үчүн müssen этишинен кийин zu жок, ал эми versuchen этишинен кийин бар?',
    ),
    why: l(
      'В заявке и на собеседовании нужно объяснять намерения и цели: «Mein Ziel ist es, in drei Jahren Abteilungsleiterin zu werden», «Ich bewerbe mich, um Erfahrung zu sammeln». Без zu и um … zu речь остаётся простой. С ними вы звучите увереннее и точнее.',
      'Өтүнүчтө жана маекте ниетиңизди жана максатыңызды түшүндүрүү керек: «Mein Ziel ist es, in drei Jahren Abteilungsleiterin zu werden», «Ich bewerbe mich, um Erfahrung zu sammeln». zu жана um … zu болбосо, сүйлөө жөнөкөй бойдон калат. Алар менен сиз ишенимдүү жана так угуласыз.',
    ),
    when: [
      l(
        'Zu + инфинитив после выражений вроде es ist wichtig / leicht / schwer, ich habe vor, ich versuche, ich vergesse, ich fange an, ich höre auf: «Ich habe vor, mich zu bewerben». Часть с zu стоит в конце и отделяется запятой.',
        'Zu + инфинитив es ist wichtig / leicht / schwer, ich habe vor, ich versuche, ich vergesse, ich fange an, ich höre auf сыяктуу туюндурмалардан кийин колдонулат: «Ich habe vor, mich zu bewerben». zu менен башталган бөлүк аягында турат жана үтүр менен бөлүнөт.',
      ),
      l(
        'Отделяемая приставка: zu встаёт между приставкой и основой, всё пишется слитно: «Ich vergesse nie, die Unterlagen einzureichen», «Sie versucht, früh aufzustehen».',
        'Ажыраган приставка: zu приставка менен уңгунун ортосуна кирет, баары чогуу жазылат: «Ich vergesse nie, die Unterlagen einzureichen», «Sie versucht, früh aufzustehen».',
      ),
      l(
        'Um … zu — цель: «Ich lerne Deutsch, um eine Stelle zu finden». Подлежащее то же самое: я учу, и я ищу. Zu стоит перед инфинитивом в конце: «um Sie kennenzulernen».',
        'Um … zu — максат: «Ich lerne Deutsch, um eine Stelle zu finden». Ээ бир эле: мен үйрөнөм жана мен издейм. zu аягында инфинитивдин алдында турат: «um Sie kennenzulernen».',
      ),
      l(
        'Без zu: после модальных глаголов (müssen, können, wollen, dürfen, sollen) и werden: «Ich muss früh aufstehen». Только для понимания: «ohne … zu» («без того чтобы») и «statt … zu» («вместо того чтобы») — вы встретите их в текстах, но писать их пока не нужно.',
        'zu жок: модаль этиштерден (müssen, können, wollen, dürfen, sollen) жана werden этишинен кийин: «Ich muss früh aufstehen». Түшүнүү үчүн гана: «ohne … zu» («…бастан») жана «statt … zu» («…нын ордуна») — аларды тексттерден көрөсүз, бирок жазуу азырынча керек эмес.',
      ),
    ],
    examples: [
      {
        de: 'Es ist wichtig, pünktlich zu sein.',
        ru: 'Важно быть пунктуальным.',
        ky: 'Убагында болуу маанилүү.',
        focus: 'Es ist wichtig, … zu sein',
      },
      {
        de: 'Ich habe vor, mich bei der Firma zu bewerben.',
        ru: 'Я собираюсь подать заявку в эту фирму.',
        ky: 'Мен ушул фирмага өтүнүч бергим келет.',
        focus: 'Ich habe vor, … zu bewerben',
      },
      {
        de: 'Ich versuche, jeden Tag früh aufzustehen.',
        ru: 'Я пытаюсь каждый день рано вставать.',
        ky: 'Мен күн сайын эрте турууга аракет кылам.',
        focus: 'aufzustehen (zu zwischen auf und stehen)',
      },
      {
        de: 'Ich lerne Deutsch, um eine gute Stelle zu finden.',
        ru: 'Я учу немецкий, чтобы найти хорошую работу.',
        ky: 'Мен жакшы жумуш табуу үчүн немис тилин үйрөнөм.',
        focus: 'um … zu finden',
      },
      {
        de: 'Sie hat vergessen, die Unterlagen einzureichen.',
        ru: 'Она забыла подать документы.',
        ky: 'Ал документтерди тапшырууну унутуп калды.',
        focus: 'einzureichen',
      },
    ],
    mistakes: [
      {
        wrong: 'Ich versuche, früh zu aufstehen.',
        right: 'Ich versuche, früh aufzustehen.',
        note: l(
          'У глаголов с отделяемой приставкой zu встаёт между приставкой и основой: auf-zu-stehen.',
          'Приставкасы ажыраган этиштерде zu приставка менен уңгунун ортосуна кирет: auf-zu-stehen.',
        ),
      },
      {
        wrong: 'Ich muss zu arbeiten.',
        right: 'Ich muss arbeiten.',
        note: l('После модального глагола müssen частица zu не ставится.', 'müssen модаль этишинен кийин zu бөлүкчөсү коюлбайт.'),
      },
      {
        wrong: 'Ich lerne Deutsch, um eine Stelle finden.',
        right: 'Ich lerne Deutsch, um eine Stelle zu finden.',
        note: l('В конструкции um … zu перед инфинитивом всегда стоит zu.', 'um … zu түзүмүндө инфинитивдин алдында дайыма zu турат.'),
      },
      {
        wrong: 'Ich habe keine Zeit, zu lesen die Anzeige.',
        right: 'Ich habe keine Zeit, die Anzeige zu lesen.',
        note: l(
          'Инфинитив с zu стоит в самом конце, остальные слова — перед ним.',
          'zu менен инфинитив эң аягында турат, калган сөздөр андан мурун келет.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Mein Ziel ist es, in drei Jahren Abteilungsleiterin zu werden.',
        ru: 'Моя цель — через три года стать руководителем отдела.',
        ky: 'Менин максатым — үч жылдан кийин бөлүм башчысы болуу.',
        focus: 'zu werden',
      },
      {
        de: 'Ich rufe an, um einen Termin zu vereinbaren.',
        ru: 'Я звоню, чтобы договориться о встрече.',
        ky: 'Мен жолугушуу макулдашуу үчүн чалып жатам.',
        focus: 'um … zu vereinbaren',
      },
      {
        de: 'Es fällt mir leicht, mit Kunden zu sprechen.',
        ru: 'Мне легко общаться с клиентами.',
        ky: 'Мага кардарлар менен сүйлөшүү оңой.',
        focus: 'Es fällt mir leicht, … zu sprechen',
      },
    ],
    dialogue: [
      {
        speaker: 'Frau Roth',
        text: 'Warum möchten Sie bei uns arbeiten?',
        ru: 'Почему вы хотите работать у нас?',
        ky: 'Эмне үчүн бизде иштегиңиз келет?',
      },
      {
        speaker: 'Herr Kaya',
        text: 'Ich möchte in einem Team arbeiten, um viel zu lernen.',
        ru: 'Я хочу работать в команде, чтобы многому научиться.',
        ky: 'Мен көп нерсе үйрөнүү үчүн командада иштегим келет.',
      },
      {
        speaker: 'Frau Roth',
        text: 'Haben Sie schon Erfahrung, Kunden zu beraten?',
        ru: 'У вас уже есть опыт консультирования клиентов?',
        ky: 'Кардарларга кеңеш берүү боюнча тажрыйбаңыз барбы?',
      },
      {
        speaker: 'Herr Kaya',
        text: 'Ja, ich habe zwei Jahre gelernt, ruhig zu bleiben, auch wenn es stressig ist.',
        ru: 'Да, два года я учился сохранять спокойствие, даже когда стрессово.',
        ky: 'Ооба, эки жыл бою стресс болсо да сабырдуу калууну үйрөндүм.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите о своих планах в работе и учёбе. Используйте zu + инфинитив («Ich habe vor, … zu …») и um … zu.',
        'Жумуштагы жана окуудагы пландарыңыз жөнүндө айтып бериңиз. zu + инфинитив («Ich habe vor, … zu …») жана um … zu колдонуңуз.',
      ),
      sample:
        'Ich habe vor, eine Weiterbildung zu machen. Ich lerne jeden Tag Deutsch, um eine gute Stelle zu finden. Es ist wichtig, nicht aufzugeben.',
      keywords: ['vor', 'zu', 'um', 'wichtig'],
    },
    source: UNIT_23_SOURCE,
  },
]

/** "Why?" notes: one word explained in one sentence. */
export const UNIT_23_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Wir suchen einen Mitarbeiter, der gern im Team arbeitet.',
    ru: 'Мы ищем сотрудника, который любит работать в команде.',
    ky: 'Биз командада иштегенди жактырган кызматкерди издеп жатабыз.',
    word: 'der',
    conceptId: 'b1-relativsaetze-nom-akk',
    reason: l(
      'Der относится к слову «Mitarbeiter» (мужской род) и является подлежащим придаточной части — поэтому Nominativ. Глагол arbeitet стоит в конце.',
      'der «Mitarbeiter» сөзүнө таандык (эркек род) жана кошумча бөлүктүн ээси — ошондуктан Nominativ. arbeitet этиши аягында турат.',
    ),
    more: [
      {
        de: 'Die Firma, die in Hamburg sitzt, sucht eine Verkäuferin.',
        ru: 'Фирма, которая находится в Гамбурге, ищет продавщицу.',
        ky: 'Гамбургда жайгашкан фирма сатуучу аял издеп жатат.',
      },
      {
        de: 'Ich habe ein Angebot bekommen, das sehr gut ist.',
        ru: 'Я получил предложение, которое очень хорошее.',
        ky: 'Мен абдан жакшы болгон сунуш алдым.',
      },
    ],
  },
  {
    sentence: 'Der Chef, den alle mögen, heißt Herr Wolf.',
    ru: 'Начальника, которого все любят, зовут господин Вольф.',
    ky: 'Баары жакшы көргөн начальниктин аты — Вольф мырза.',
    word: 'den',
    conceptId: 'b1-relativsaetze-nom-akk',
    reason: l(
      'Alle mögen den Chef — начальник здесь дополнение, поэтому Akkusativ: den (а не der). Подлежащее придаточной части — «alle».',
      'Alle mögen den Chef — бул жерде начальник толуктоочу, ошондуктан Akkusativ: den (der эмес). Кошумча бөлүктүн ээси — «alle».',
    ),
    more: [
      {
        de: 'Das ist die Stelle, die ich schon lange suche.',
        ru: 'Это должность, которую я давно ищу.',
        ky: 'Бул мен көптөн бери издеп жүргөн кызмат.',
      },
      {
        de: 'Das ist der Vertrag, den ich unterschreiben soll.',
        ru: 'Это договор, который я должен подписать.',
        ky: 'Бул мен кол коюшум керек болгон келишим.',
      },
    ],
  },
  {
    sentence: 'Ich versuche, jeden Tag früh aufzustehen.',
    ru: 'Я пытаюсь каждый день рано вставать.',
    ky: 'Мен күн сайын эрте турууга аракет кылам.',
    word: 'aufzustehen',
    conceptId: 'b1-infinitiv-mit-zu',
    reason: l(
      'У глагола aufstehen отделяемая приставка auf-, поэтому zu встаёт между приставкой и основой: aufzustehen (одно слово). Перед частью с zu стоит запятая.',
      'aufstehen этишинин ажыраган auf- приставкасы бар, ошондуктан zu приставка менен уңгунун ортосуна кирет: aufzustehen (бир сөз). zu менен башталган бөлүктүн алдына үтүр коюлат.',
    ),
    more: [
      {
        de: 'Sie hat vergessen, die Unterlagen einzureichen.',
        ru: 'Она забыла подать документы.',
        ky: 'Ал документтерди тапшырууну унутуп калды.',
      },
      {
        de: 'Ich lerne Deutsch, um eine gute Stelle zu finden.',
        ru: 'Я учу немецкий, чтобы найти хорошую работу.',
        ky: 'Мен жакшы жумуш табуу үчүн немис тилин үйрөнөм.',
      },
    ],
  },
]
