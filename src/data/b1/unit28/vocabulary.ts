import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 28 vocabulary — Bildung, Lernen und Zukunftspläne (B1). 40 NEW productive items (target 38–42), none of them an A1/A2 or earlier B1 headword
 * (legacy rule: cross-level lemma repeats are rejected by `b1-vocab-repeats-earlier-level`; v2 Units 301–336 allow reuse across units/levels and reject only same-unit duplicates — see `docs/b1/B1_ID_CONVENTIONS.md`). Themes: Schule und Studium · Kurs und Lernen · Schule und Kita (Eltern, Betreuung) ·
 * Adjektive · Verben. A2 and earlier units already taught the basic education words (Schule, Unterricht, Prüfung, Abschluss, Zeugnis, Ausbildung, Praktikum,
 * Anmeldung, Entschuldigung, Ziel, Plan, Erfolg, bestehen, planen …); they are REUSED in the texts as revision but not listed again. The prepositional verbs of the
 * unit (the closed list of 20) are GRAMMAR, not vocabulary items; no other verb of this list needs a prepositional object. Wortbildung strand: Kompositum
 * (Schulsystem, Studiengang, Lernplan, Kursgebühr, Elternabend), -ung (Betreuung, Bescheinigung), -er (Teilnehmer), un-/-pflichtig adjectives. The word
 * "Zertifikat" is deliberately not used (the unit makes no certification claims). Every school, course and sum is fictional. Russian and Kyrgyz are written
 * independently; the Kyrgyz is an AI-assisted FIRST DRAFT that has not been reviewed by a native speaker.
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb · a adjective
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Schule und Studium
  ['das', 'Schulsystem', 'Schulsysteme', 'система школьного образования', 'мектеп билим берүү тутуму', 'Das Schulsystem ist in jedem Land anders.', 'Система школьного образования в каждой стране своя.', 'Мектеп билим берүү тутуму ар бир өлкөдө башка.'],
  ['das', 'Abitur', '', 'аттестат зрелости (в Германии)', 'орто билим аттестаты (Abitur)', 'Nächstes Jahr mache ich mein Abitur.', 'В следующем году я сдаю экзамены на аттестат зрелости.', 'Келерки жылы мен Abitur тапшырам.'],
  ['das', 'Studium', 'Studien', 'учёба в вузе', 'жогорку окуу жайындагы окуу', 'Nach dem Abitur beginnt für viele das Studium.', 'После аттестата многие начинают учёбу в вузе.', 'Abiturдан кийин көптөр жогорку окуу жайында окуй башташат.'],
  ['der', 'Studiengang', 'Studiengänge', 'направление (специальность) обучения', 'окуу багыты, адистик', 'Welchen Studiengang möchtest du wählen?', 'Какое направление ты хочешь выбрать?', 'Сен кайсы окуу багытын тандагың келет?'],
  ['die', 'Hochschule', 'Hochschulen', 'высшее учебное заведение', 'жогорку окуу жайы', 'Die Hochschule ist nur zehn Minuten vom Bahnhof entfernt.', 'Вуз находится всего в десяти минутах от вокзала.', 'Жогорку окуу жайы вокзалдан он мүнөттүк жерде.'],
  ['das', 'Stipendium', 'Stipendien', 'стипендия, пособие на учёбу', 'окуу үчүн акчалай жардам (стипендия)', 'Mit einem Stipendium bekommt man Geld für das Studium.', 'Со стипендией человек получает деньги на учёбу.', 'Стипендия менен адам окуу үчүн акча алат.'],
  ['das', 'Auslandsjahr', 'Auslandsjahre', 'год за границей', 'чет өлкөдө өткөргөн жыл', 'Im Auslandsjahr habe ich viel gelernt.', 'За год за границей я многому научился.', 'Чет өлкөдөгү жылда мен көп нерсе үйрөндүм.'],
  ['die', 'Lehrkraft', 'Lehrkräfte', 'преподаватель, учитель (независимо от пола)', 'мугалим (жынысы көрсөтүлбөгөн)', 'Die Lehrkraft erklärt die Aufgabe noch einmal.', 'Преподаватель ещё раз объясняет задание.', 'Мугалим тапшырманы дагы бир жолу түшүндүрөт.'],
  ['das', 'Referat', 'Referate', 'доклад (в учёбе)', 'баяндама (окууда)', 'Nächste Woche halte ich ein Referat.', 'На следующей неделе я делаю доклад.', 'Келерки жумада мен баяндама жасайм.'],
  // Kurs und Lernen
  ['die', 'Lernstrategie', 'Lernstrategien', 'стратегия обучения', 'окуу стратегиясы', 'Eine gute Lernstrategie spart viel Zeit.', 'Хорошая стратегия обучения экономит много времени.', 'Жакшы окуу стратегиясы көп убакытты үнөмдөйт.'],
  ['der', 'Lernplan', 'Lernpläne', 'план обучения', 'окуу планы', 'Ich schreibe jede Woche einen Lernplan.', 'Я пишу план обучения каждую неделю.', 'Мен ар жумада окуу планын жазам.'],
  ['der', 'Fortschritt', 'Fortschritte', 'прогресс, успех', 'ийгилик, алдыга жылуу', 'Jeden Monat sehe ich einen kleinen Fortschritt.', 'Каждый месяц я вижу небольшой прогресс.', 'Ар айда мен кичинекей ийгилик көрөм.'],
  ['die', 'Motivation', '', 'мотивация', 'умтулуу, шыктануу', 'Meine Motivation ist am Morgen am größten.', 'Моя мотивация сильнее всего по утрам.', 'Менин умтулуум эртең менен эң күчтүү.'],
  ['die', 'Konzentration', '', 'концентрация, внимание', 'көңүл топтоо', 'Für Hausaufgaben braucht man Konzentration.', 'Для домашних заданий нужна концентрация.', 'Үй тапшырмасы үчүн көңүл топтоо керек.'],
  ['der', 'Teilnehmer', 'Teilnehmer', 'участник', 'катышуучу', 'Der Kurs hat zwölf Teilnehmer.', 'В курсе двенадцать участников.', 'Курста он эки катышуучу бар.'],
  ['die', 'Kursgebühr', 'Kursgebühren', 'плата за курс', 'курс акысы', 'Die Kursgebühr beträgt 120 Euro.', 'Плата за курс — 120 евро.', 'Курс акысы 120 евро.'],
  ['die', 'Bescheinigung', 'Bescheinigungen', 'справка, подтверждение', 'тактама, далилдеме', 'Nach dem Kurs bekommt man eine Bescheinigung.', 'После курса выдают справку.', 'Курстан кийин далилдеме беришет.'],
  ['die', 'Warteliste', 'Wartelisten', 'список ожидания', 'күтүү тизмеси', 'Ich stehe auf der Warteliste für den Kurs.', 'Я стою в списке ожидания на курс.', 'Мен курс үчүн күтүү тизмесинде турам.'],
  // Schule und Kita
  ['der', 'Elternabend', 'Elternabende', 'родительское собрание', 'ата-энелер чогулушу', 'Am Dienstag ist ein Elternabend in der Schule.', 'Во вторник в школе родительское собрание.', 'Шейшембиде мектепте ата-энелер чогулушу болот.'],
  ['das', 'Elterngespräch', 'Elterngespräche', 'беседа с родителями', 'ата-эне менен сүйлөшүү', 'Die Lehrerin lädt uns zu einem Elterngespräch ein.', 'Учительница приглашает нас на беседу с родителями.', 'Мугалим бизди ата-эне менен сүйлөшүүгө чакырат.'],
  ['die', 'Betreuung', '', 'присмотр, уход (за детьми)', 'бала багуу, камкордук', 'Für die Betreuung am Nachmittag gibt es einen Platz.', 'На присмотр во второй половине дня есть место.', 'Түштөн кийинки бала багуу үчүн орун бар.'],
  ['die', 'Ganztagsschule', 'Ganztagsschulen', 'школа полного дня', 'толук күндүк мектеп', 'In der Ganztagsschule essen die Kinder zu Mittag.', 'В школе полного дня дети обедают.', 'Толук күндүк мектепте балдар түшкү тамак ичишет.'],
  // Adjektive
  ['a', 'ehrgeizig', '', 'амбициозный', 'амбициялуу, умтулуучу', 'Meine Schwester ist sehr ehrgeizig.', 'Моя сестра очень амбициозна.', 'Менин эжем абдан амбициялуу.'],
  ['a', 'gründlich', '', 'основательный, тщательный', 'терең, кылдат', 'Man muss für die Prüfung gründlich lernen.', 'К экзамену нужно учиться основательно.', 'Экзамен үчүн терең окуу керек.'],
  ['a', 'staatlich', '', 'государственный', 'мамлекеттик', 'Diese Hochschule ist staatlich.', 'Этот вуз государственный.', 'Бул жогорку окуу жайы мамлекеттик.'],
  ['a', 'berufsbegleitend', '', 'без отрыва от работы', 'иш менен катар жүргүзүлүүчү', 'Ich mache eine berufsbegleitende Weiterbildung.', 'Я прохожу повышение квалификации без отрыва от работы.', 'Мен иштен ажырабай квалификациямды жогорулатып жатам.'],
  ['a', 'kostenpflichtig', '', 'платный', 'акы төлөнүүчү', 'Dieser Kurs ist kostenpflichtig.', 'Этот курс платный.', 'Бул курс акы төлөнүүчү.'],
  ['a', 'anspruchsvoll', '', 'сложный, требовательный', 'татаал, жогорку талаптуу', 'Das Studium ist anspruchsvoll.', 'Учёба в вузе сложная.', 'Жогорку окуу жайындагы окуу татаал.'],
  // Verben
  ['v', 'belegen', '', 'записаться на (курс), посещать', 'курска жазылуу, катышуу', 'Im Herbst belege ich einen Sprachkurs.', 'Осенью я записываюсь на языковой курс.', 'Күзүндө мен тил курсуна жазылам.'],
  ['v', 'sich einschreiben', '', 'записаться, зачислиться (в вуз)', 'окууга жазылуу (жогорку окуу жайына)', 'Bis Mai muss man sich einschreiben.', 'До мая нужно записаться.', 'Майга чейин окууга жазылуу керек.'],
  ['v', 'durchfallen', '', 'провалиться (на экзамене)', 'экзаменден өтпөй калуу', 'Ich will in der Prüfung nicht durchfallen.', 'Я не хочу провалиться на экзамене.', 'Мен экзаменден өтпөй калгым келбейт.'],
  ['v', 'wiederholen', '', 'повторять', 'кайталоо', 'Vor der Prüfung wiederhole ich den Stoff.', 'Перед экзаменом я повторяю материал.', 'Экзамендин алдында мен материалды кайталайм.'],
  ['v', 'sich konzentrieren', '', 'сосредоточиться', 'көңүл топтоо', 'Abends kann ich mich schlecht konzentrieren.', 'Вечером мне трудно сосредоточиться.', 'Кечинде мага көңүл топтоо кыйын.'],
  ['v', 'verbessern', '', 'улучшать', 'жакшыртуу', 'Ich möchte mein Deutsch verbessern.', 'Я хочу улучшить свой немецкий.', 'Мен немис тилимди жакшыртким келет.'],
  ['v', 'fördern', '', 'поддерживать, развивать', 'колдоо, өнүктүрүү', 'Gute Lehrkräfte fördern ihre Schüler.', 'Хорошие преподаватели поддерживают своих учеников.', 'Жакшы мугалимдер окуучуларын колдошот.'],
  ['v', 'ermöglichen', '', 'делать возможным', 'мүмкүн кылуу', 'Ein Stipendium ermöglicht das Studium.', 'Стипендия делает возможной учёбу.', 'Стипендия окууну мүмкүн кылат.'],
  ['v', 'vermuten', '', 'предполагать', 'божомолдоо', 'Ich vermute, dass der Test schwer ist.', 'Я предполагаю, что тест трудный.', 'Мен тест оор го деп божомолдойм.'],
  ['v', 'absolvieren', '', 'пройти, завершить (курс, практику)', 'бүтүрүү (курсту, практиканы)', 'Er will ein Praktikum absolvieren.', 'Он хочет пройти практику.', 'Ал практикадан өткүсү келет.'],
  ['v', 'sich weiterbilden', '', 'повышать квалификацию', 'квалификациясын жогорулатуу', 'Viele wollen sich nach der Arbeit weiterbilden.', 'Многие хотят повышать квалификацию после работы.', 'Көптөр иштен кийин квалификациясын жогорулаткысы келет.'],
  ['v', 'unterrichten', '', 'преподавать', 'сабак берүү', 'Sie unterrichtet Mathematik an einer Schule.', 'Она преподаёт математику в школе.', 'Ал мектепте математикадан сабак берет.'],
]

const posOf = (k: string): PartOfSpeech =>
  k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : k === 'x' ? 'other' : 'adj'

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v28-${i + 1}`,
    unit: 28,
    pos,
    article: pos === 'noun' ? (kind as Article) : undefined,
    de,
    plural: plural || undefined,
    ru,
    ky,
    example,
    exampleRu,
    exampleKy,
    related: [],
  }
})

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in A1, A2 and Units 21–27. */
export const UNIT_28_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
