import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 24 vocabulary — Wohnen, Umzug und Umwelt (B1). 40 NEW productive items (target 38–42), none of them an A1/A2 or earlier B1 headword
 * (checked by the validator rule `b1-vocab-repeats-earlier-level`). Themes: Wohnung und Vertrag · Haus und Mängel · Umzug · Energie und Umwelt · Verben.
 * A2 Unit 13 already taught the basic housing words (Mietvertrag, Kaution, Nebenkosten, Hausordnung, Mülltrennung, Heizung, Nachbar …); they are REUSED in
 * the texts and exercises as revision, but not listed again. No verb needs a prepositional object (Unit 28). Russian and Kyrgyz are written independently;
 * the Kyrgyz is an AI-assisted FIRST DRAFT that has not been reviewed by a native speaker.
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb · a adjective
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Wohnung und Vertrag
  ['der', 'Hausmeister', 'Hausmeister', 'смотритель дома, завхоз', 'үйдү кароочу, үй тейлөөчү', 'Der Hausmeister repariert den Wasserhahn.', 'Смотритель дома чинит кран.', 'Үйдү кароочу кранды оңдоп жатат.'],
  ['die', 'Hausverwaltung', 'Hausverwaltungen', 'управляющая компания дома', 'үйдү башкаруучу уюм', 'Ich habe eine E-Mail an die Hausverwaltung geschrieben.', 'Я написал письмо в управляющую компанию.', 'Мен үйдү башкаруучу уюмга кат жаздым.'],
  ['die', 'Kaltmiete', '', 'арендная плата без коммунальных платежей', 'коммуналдык төлөмсүз ижара акысы', 'Die Kaltmiete beträgt 650 Euro im Monat.', 'Аренда без коммунальных платежей — 650 евро в месяц.', 'Коммуналдык төлөмсүз ижара акысы айына 650 евро.'],
  ['die', 'Heizkosten', 'Heizkosten', 'расходы на отопление', 'жылытуу чыгымдары', 'Die Heizkosten sind im Winter hoch.', 'Расходы на отопление зимой высокие.', 'Жылытуу чыгымдары кышында жогору.'],
  ['die', 'Abrechnung', 'Abrechnungen', 'расчёт, итоговый счёт', 'эсеп-кысап, жыйынтык эсеп', 'Die Abrechnung für das Jahr kommt im März.', 'Годовой расчёт приходит в марте.', 'Жылдык эсеп-кысап мартта келет.'],
  ['die', 'Kündigungsfrist', 'Kündigungsfristen', 'срок уведомления о расторжении договора', 'келишимди токтотуу жөнүндө эскертүү мөөнөтү', 'Die Kündigungsfrist beträgt drei Monate.', 'Срок уведомления о расторжении — три месяца.', 'Келишимди токтотуу жөнүндө эскертүү мөөнөтү — үч ай.'],
  ['der', 'Nachmieter', 'Nachmieter', 'следующий жилец, преемник по аренде', 'кийинки ижарачы', 'Wir suchen einen Nachmieter für unsere Wohnung.', 'Мы ищем следующего жильца для нашей квартиры.', 'Биз батирибизге кийинки ижарачы издеп жатабыз.'],
  ['die', 'Wohngemeinschaft', 'Wohngemeinschaften', 'совместная квартира (WG)', 'бир батирди бирге ижарага алып жашоо (WG)', 'Viele Studenten leben in einer Wohngemeinschaft.', 'Многие студенты живут в совместной квартире.', 'Көптөгөн студенттер бир батирди бирге ижарага алып жашашат.'],
  ['die', 'Lage', 'Lagen', 'расположение, место', 'жайгашкан жери', 'Die Wohnung hat eine ruhige Lage.', 'У квартиры тихое расположение.', 'Батир тынч жерде жайгашкан.'],
  ['das', 'Erdgeschoss', 'Erdgeschosse', 'первый этаж', 'биринчи кабат', 'Die Wohnung liegt im Erdgeschoss.', 'Квартира находится на первом этаже.', 'Батир биринчи кабатта жайгашкан.'],
  ['der', 'Altbau', 'Altbauten', 'старый дом (старой постройки)', 'эски курулуш үй', 'Wir wohnen in einem Altbau mit hohen Decken.', 'Мы живём в старом доме с высокими потолками.', 'Биз шыптары бийик эски үйдө жашайбыз.'],
  // Haus und Mängel
  ['das', 'Treppenhaus', 'Treppenhäuser', 'лестничная клетка', 'тепкич жайы', 'Im Treppenhaus stehen oft Fahrräder.', 'На лестничной клетке часто стоят велосипеды.', 'Тепкич жайында көбүнчө велосипеддер турат.'],
  ['die', 'Mülltonne', 'Mülltonnen', 'мусорный бак', 'таштанды челеги', 'Die Mülltonne steht im Hof und wird jeden Dienstag geleert.', 'Мусорный бак стоит во дворе, его опорожняют каждый вторник.', 'Таштанды челеги короодо турат, аны ар шейшембиде бошотушат.'],
  ['der', 'Mangel', 'Mängel', 'недостаток, дефект', 'кемчилик, бузулуу', 'Ich muss dem Vermieter den Mangel melden.', 'Я должен сообщить арендодателю о дефекте.', 'Мен ижарага берүүчүгө кемчиликти билдиришим керек.'],
  ['der', 'Schimmel', '', 'плесень', 'көк (нымдуулуктан)', 'Im Bad gibt es Schimmel an der Wand.', 'В ванной на стене плесень.', 'Жуунуучу бөлмөдө дубалда көк бар.'],
  ['der', 'Wasserhahn', 'Wasserhähne', 'водопроводный кран', 'суу краны', 'Der Wasserhahn in der Küche ist undicht.', 'Кран на кухне течёт.', 'Ашканадагы суу краны агып жатат.'],
  ['a', 'feucht', '', 'влажный, сырой', 'нымдуу', 'Die Wände im Keller sind feucht.', 'Стены в подвале сырые.', 'Жертөлөдөгү дубалдар нымдуу.'],
  ['a', 'undicht', '', 'негерметичный, протекающий', 'тыгыз эмес, агып турган', 'Das Fenster im Schlafzimmer ist undicht.', 'Окно в спальне не герметично.', 'Уктоочу бөлмөдөгү терезе тыгыз эмес.'],
  ['a', 'defekt', '', 'неисправный', 'бузук', 'Der Aufzug ist seit gestern defekt.', 'Лифт со вчерашнего дня неисправен.', 'Лифт кечээден бери бузук.'],
  ['a', 'hellhörig', '', 'с плохой звукоизоляцией (всё слышно)', 'үн өтүп турган, дубалы жука', 'Die Wohnung ist hellhörig, man hört alles.', 'В квартире плохая звукоизоляция, слышно всё.', 'Батирде үн өтүп турат, баары угулат.'],
  ['a', 'zentral', '', 'центральный, в центре', 'борбордо жайгашкан', 'Die Wohnung liegt sehr zentral.', 'Квартира находится очень близко к центру.', 'Батир борборго абдан жакын жайгашкан.'],
  // Umzug
  ['der', 'Umzugskarton', 'Umzugskartons', 'коробка для переезда', 'көчүү үчүн куту', 'Ich brauche noch zehn Umzugskartons.', 'Мне нужно ещё десять коробок для переезда.', 'Мага дагы он көчүү кутусу керек.'],
  ['v', 'einrichten', '', 'обставлять, оборудовать (жильё)', 'жайлаштыруу, жабдуу (батирди)', 'Wir wollen die Wohnung gemütlich einrichten.', 'Мы хотим уютно обставить квартиру.', 'Биз батирди жайлуу кылып жабдыгыбыз келет.'],
  ['v', 'vermieten', '', 'сдавать в аренду', 'ижарага берүү', 'Er will das Zimmer vermieten.', 'Он хочет сдать комнату.', 'Ал бөлмөнү ижарага бергиси келет.'],
  ['v', 'lüften', '', 'проветривать', 'желдетүү', 'Im Bad muss man mehrmals am Tag lüften.', 'В ванной нужно проветривать несколько раз в день.', 'Жуунуучу бөлмөнү күнүнө бир нече жолу желдетүү керек.'],
  ['v', 'streichen', '', 'красить (стены)', 'боёо (дубалды)', 'Wir wollen das Wohnzimmer selbst streichen.', 'Мы хотим покрасить гостиную сами.', 'Биз конок бөлмөнү өзүбүз боёгубуз келет.'],
  ['v', 'abholen', '', 'забирать, вывозить', 'алып кетүү', 'Das Paket können Sie morgen abholen.', 'Посылку вы можете забрать завтра.', 'Посылканы эртең алып кете аласыз.'],
  ['v', 'anschließen', '', 'подключать', 'туташтыруу', 'Der Elektriker soll die Waschmaschine anschließen.', 'Электрик должен подключить стиральную машину.', 'Электрик кир жуугуч машинаны туташтырышы керек.'],
  // Energie und Umwelt
  ['die', 'Umwelt', '', 'окружающая среда', 'айлана-чөйрө', 'Wir wollen die Umwelt schützen.', 'Мы хотим защищать окружающую среду.', 'Биз айлана-чөйрөнү коргоону каалайбыз.'],
  ['das', 'Klima', '', 'климат (в мире)', 'климат, аймактын жалпы аба ырайы', 'Das Klima verändert sich auf der ganzen Welt.', 'Климат меняется во всём мире.', 'Климат бүткүл дүйнөдө өзгөрүп жатат.'],
  ['die', 'Energie', 'Energien', 'энергия (тепло, электричество)', 'энергия, күч-кубат', 'Die Sonne liefert saubere Energie.', 'Солнце даёт чистую энергию.', 'Күн таза энергия берет.'],
  ['der', 'Strom', '', 'электричество, ток', 'электр тогу, электр энергиясы', 'Wir sparen Strom, wenn wir das Licht ausmachen.', 'Мы экономим электричество, если выключаем свет.', 'Жарыкты өчүрсөк, электр тогун үнөмдөйбүз.'],
  ['die', 'Verpackung', 'Verpackungen', 'упаковка', 'таңгак', 'Viel Verpackung ist schlecht für die Umwelt.', 'Много упаковки вредно для окружающей среды.', 'Көп таңгак айлана-чөйрөгө зыяндуу.'],
  ['a', 'umweltfreundlich', '', 'экологичный, безвредный для природы', 'айлана-чөйрөгө зыянсыз', 'Ein Fahrrad ist umweltfreundlich.', 'Велосипед экологичен.', 'Велосипед айлана-чөйрөгө зыян келтирбейт.'],
  ['a', 'nachhaltig', '', 'устойчивый, бережный к ресурсам', 'келечекти ойлогон, ресурстарды сарамжалдуу колдонгон', 'Viele Menschen wollen nachhaltig leben.', 'Многие люди хотят жить бережно к ресурсам.', 'Көптөгөн адамдар ресурстарды сарамжалдуу колдонуп жашоону каалашат.'],
  ['a', 'sparsam', '', 'экономный', 'үнөмчүл', 'Mein Auto ist sehr sparsam.', 'Моя машина очень экономичная.', 'Менин унаам абдан үнөмчүл.'],
  ['v', 'verbrauchen', '', 'расходовать, потреблять', 'сарптоо, пайдаланып бүтүрүү', 'Eine alte Waschmaschine verbraucht viel Energie.', 'Старая стиральная машина расходует много энергии.', 'Эски кир жуугуч машина көп энергия сарптайт.'],
  ['v', 'vermeiden', '', 'избегать', 'качуу, алдын алуу', 'Wir wollen unnötigen Müll vermeiden.', 'Мы хотим избегать ненужного мусора.', 'Биз керексиз таштандыдан качкыбыз келет.'],
  ['v', 'heizen', '', 'отапливать', 'жылытуу (үйдү)', 'Im Winter heizen wir mit Gas.', 'Зимой мы отапливаем газом.', 'Кышында биз газ менен жылытабыз.'],
  ['v', 'recyceln', '', 'перерабатывать (вторсырьё)', 'кайра иштетүү', 'Alte Flaschen kann man recyceln.', 'Старые бутылки можно переработать.', 'Эски бөтөлкөлөрдү кайра иштетүүгө болот.'],
]

const posOf = (k: string): PartOfSpeech =>
  k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : k === 'x' ? 'other' : 'adj'

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v24-${i + 1}`,
    unit: 24,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in A1, A2 and Units 21–23. */
export const UNIT_24_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
