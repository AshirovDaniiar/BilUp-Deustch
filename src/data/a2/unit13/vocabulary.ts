import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 13 vocabulary — Wohnen und Nachbarschaft (Stage 7D). 37 items, exactly the approved Stage 7B vocabulary map:
 * 33 productive, 4 receptive (`UNIT_13_RECEPTIVE_WORDS`). Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted
 * first draft for native review (uncertain terms are listed in docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md, §6).
 * Example sentences respect the unit's grammar limits: attributive adjectives only after ein-/kein-/mein- (Nominativ, Akkusativ),
 * never after the definite article, never in the plural, never after a Dativ preposition.
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb · a adjective
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Wohnungssuche und Vertrag
  ['die', 'Anzeige', 'Anzeigen', 'объявление', 'жарнама', 'Ich habe die Anzeige im Internet gelesen.', 'Я прочитал объявление в интернете.', 'Мен жарнаманы интернеттен окудум.'],
  ['die', 'Besichtigung', 'Besichtigungen', 'осмотр (квартиры)', 'батирди көрүп чыгуу', 'Die Besichtigung ist am Donnerstag um 17 Uhr.', 'Осмотр — в четверг в 17 часов.', 'Батирди көрүп чыгуу бейшемби күнү саат 17де.'],
  ['der', 'Mietvertrag', 'Mietverträge', 'договор аренды', 'ижара келишими', 'Der Mietvertrag ist für zwei Jahre.', 'Договор аренды заключён на два года.', 'Ижара келишими эки жылга түзүлгөн.'],
  ['die', 'Kaution', 'Kautionen', 'залог (при аренде)', 'кепилдик акча (ижарага алгандагы)', 'Für die Wohnung brauche ich 1.200 Euro Kaution.', 'Для этой квартиры мне нужно 1200 евро залога.', 'Бул батир үчүн мага 1200 евро кепилдик акча керек.'],
  ['die', 'Nebenkosten', 'Nebenkosten', 'дополнительные платежи (вода, отопление, вывоз мусора)', 'кошумча төлөмдөр (суу, жылытуу, таштанды)', 'Die Nebenkosten sind nicht in der Miete.', 'Дополнительные платежи не входят в арендную плату.', 'Кошумча төлөмдөр ижара акысына кирбейт.'],
  ['der', 'Mieter', 'Mieter', 'жилец, арендатор', 'ижарачы', 'Die Mieter im Haus sind sehr nett.', 'Жильцы в доме очень приятные.', 'Үйдөгү ижарачылар абдан жагымдуу.'],
  ['v', 'einziehen', '', 'въезжать, переезжать (в жильё)', 'көчүп кирүү', 'Wir ziehen am Samstag in eine neue Wohnung ein.', 'В субботу мы переезжаем в новую квартиру.', 'Ишемби күнү биз жаңы батирге көчүп кирип жатабыз.'],
  ['v', 'ausziehen', '', 'съезжать, выезжать (из жилья)', 'көчүп чыгуу', 'Mein Bruder zieht im Juni aus.', 'Мой брат съезжает в июне.', 'Менин агам июнь айында көчүп чыгат.'],
  // Räume und Ausstattung
  ['der', 'Flur', 'Flure', 'коридор, прихожая', 'коридор, кире бериш', 'Im Flur steht ein kleines Regal.', 'В коридоре стоит маленькая полка.', 'Коридордо кичинекей текче турат.'],
  ['der', 'Keller', 'Keller', 'подвал', 'жертөлө', 'Mein Fahrrad steht im Keller.', 'Мой велосипед стоит в подвале.', 'Менин велосипедим жертөлөдө турат.'],
  ['der', 'Aufzug', 'Aufzüge', 'лифт', 'лифт (көтөргүч)', 'Das Haus hat leider keinen Aufzug.', 'В доме, к сожалению, нет лифта.', 'Үйдө, тилекке каршы, лифт жок.'],
  ['die', 'Heizung', 'Heizungen', 'отопление', 'жылытуу системасы', 'Im Winter ist die Heizung wichtig.', 'Зимой отопление очень важно.', 'Кышында жылытуу системасы абдан маанилүү.'],
  ['die', 'Waschmaschine', 'Waschmaschinen', 'стиральная машина', 'кир жуугуч машина', 'Die Waschmaschine steht im Bad.', 'Стиральная машина стоит в ванной.', 'Кир жуугуч машина ванна бөлмөсүндө турат.'],
  ['der', 'Herd', 'Herde', 'плита (кухонная)', 'ашкана плитасы', 'Der Herd ist neu, aber die Küche ist klein.', 'Плита новая, но кухня маленькая.', 'Плита жаңы, бирок ашкана кичине.'],
  ['das', 'Regal', 'Regale', 'полка, стеллаж', 'текче', 'Die Bücher stehen im Regal.', 'Книги стоят на полке.', 'Китептер текчеде турат.'],
  ['der', 'Dachboden', 'Dachböden', 'чердак', 'чатыр асты (чердак)', 'Auf dem Dachboden ist es im Sommer sehr warm.', 'На чердаке летом очень тепло.', 'Чатыр астында жайында абдан жылуу.'],
  // Eigenschaften
  ['a', 'hell', '', 'светлый', 'жарык', 'Das Wohnzimmer ist sehr hell.', 'Гостиная очень светлая.', 'Конок бөлмө абдан жарык.'],
  ['a', 'dunkel', '', 'тёмный', 'караңгы', 'Der Flur ist leider dunkel.', 'Коридор, к сожалению, тёмный.', 'Коридор, тилекке каршы, караңгы.'],
  ['a', 'gemütlich', '', 'уютный', 'жайлуу, жылуу-жумшак', 'Meine Wohnung ist klein, aber gemütlich.', 'Моя квартира маленькая, но уютная.', 'Менин батирим кичинекей, бирок жайлуу.'],
  ['a', 'modern', '', 'современный', 'заманбап', 'Die Küche ist modern.', 'Кухня современная.', 'Ашкана заманбап.'],
  ['a', 'möbliert', '', 'меблированный (с мебелью)', 'эмерек коюлган', 'Das Zimmer ist möbliert.', 'Комната сдаётся с мебелью.', 'Бөлмөдө эмерек бар.'],
  ['a', 'geräumig', '', 'просторный', 'кенен', 'Die Wohnung ist geräumig.', 'Квартира просторная.', 'Батир кенен.'],
  // Nachbarschaft und Hausordnung
  ['der', 'Nachbar', 'Nachbarn', 'сосед', 'кошуна', 'Mein Nachbar ist sehr freundlich.', 'Мой сосед очень дружелюбный.', 'Менин кошуном абдан ак көңүл.'],
  ['die', 'Nachbarin', 'Nachbarinnen', 'соседка', 'кошуна (аял)', 'Die Nachbarin wohnt neben uns.', 'Соседка живёт рядом с нами.', 'Кошуна аял биздин жаныбызда жашайт.'],
  ['die', 'Nachbarschaft', 'Nachbarschaften', 'соседи, район вокруг дома', 'кошуналар жана үй-айлана', 'Die Nachbarschaft hier ist ruhig.', 'Соседи и район здесь спокойные.', 'Бул жердеги кошуналар жана үй-айлана тынч.'],
  ['der', 'Lärm', '', 'шум', 'ызы-чуу', 'Abends gibt es oft Lärm auf der Straße.', 'Вечером на улице часто шумно.', 'Кечинде көчөдө көп ызы-чуу болот.'],
  ['der', 'Müll', '', 'мусор', 'таштанды', 'Der Müll steht im Keller.', 'Мусор стоит в подвале.', 'Таштанды жертөлөдө турат.'],
  ['die', 'Hausordnung', 'Hausordnungen', 'правила проживания в доме', 'үйдө жашоонун тартиби', 'Die Hausordnung hängt im Flur.', 'Правила проживания висят в коридоре.', 'Үйдө жашоонун тартиби коридордо илинип турат.'],
  ['die', 'Mülltrennung', '', 'раздельный сбор мусора', 'таштандыны түрү боюнча бөлүү', 'Die Mülltrennung steht in der Hausordnung.', 'Раздельный сбор мусора указан в правилах дома.', 'Таштандыны түрү боюнча бөлүү үйдө жашоонун тартибинде жазылган.'],
  ['v', 'grüßen', '', 'здороваться, приветствовать', 'саламдашуу', 'Ich grüße meine Nachbarn immer freundlich.', 'Я всегда приветливо здороваюсь с соседями.', 'Мен кошуналарым менен дайыма жылуу саламдашам.'],
  ['v', 'stören', '', 'мешать, беспокоить', 'тынчын алуу, тоскоол болуу', 'Die Musik stört die Nachbarn.', 'Музыка мешает соседям.', 'Музыка кошуналардын тынчын алат.'],
  ['v', 'renovieren', '', 'делать ремонт', 'оңдоп-түзөө (ремонт жасоо)', 'Der Vermieter renoviert die Küche im Sommer.', 'Арендодатель делает ремонт на кухне летом.', 'Үй ээси жайында ашкананы оңдоп-түзөйт.'],
  // Einrichten (Position / Richtung)
  ['v', 'stehen', '', 'стоять', 'тик турат', 'Das Sofa steht im Wohnzimmer.', 'Диван стоит в гостиной.', 'Диван конок бөлмөдө турат.'],
  ['v', 'liegen', '', 'лежать', 'жатат (жаткан абалда)', 'Die Zeitung liegt auf dem Tisch.', 'Газета лежит на столе.', 'Гезит столдун үстүндө жатат.'],
  ['v', 'hängen', '', 'висеть', 'илинип турат', 'Das Bild hängt an der Wand.', 'Картина висит на стене.', 'Сүрөт дубалда илинип турат.'],
  ['v', 'stellen', '', 'ставить (вертикально)', 'тик коюу', 'Ich stelle den Stuhl ans Fenster.', 'Я ставлю стул к окну.', 'Мен отургучту терезенин жанына тик коём.'],
  ['v', 'legen', '', 'класть (горизонтально)', 'жаткырып коюу', 'Ich lege das Buch auf den Tisch.', 'Я кладу книгу на стол.', 'Мен китепти столдун үстүнө жаткырып коём.'],
]

const posOf = (k: string): PartOfSpeech => (k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : 'adj')

/** Unit 13 words that are RECOGNITION vocabulary: understood in texts and options, never required in a gap, speaking keyword or writing requirement. */
export const UNIT_13_RECEPTIVE_WORDS: readonly string[] = ['Dachboden', 'geräumig', 'Mülltrennung', 'renovieren']

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v13-${i + 1}`,
    unit: 13,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in Unit 11 and Unit 12. */
export const UNIT_13_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
