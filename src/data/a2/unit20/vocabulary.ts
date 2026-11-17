import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 20 vocabulary — Pläne, Einladungen und gemeinsame Entscheidungen (Stage 7K). 37 items, exactly the approved Stage 7B vocabulary map:
 * 33 productive, 4 receptive (`UNIT_20_RECEPTIVE_WORDS`). Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted first draft for native
 * review (uncertain terms: docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md, §13). No artificial brackets: where both languages would use the same loan word,
 * each gloss gives its own natural wording (no pair is identical). Examples use no adjective after a Dativ preposition and no `werden`.
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb · a adjective · o other (adverb) · p phrase
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Einladung und Feier
  ['die', 'Einladung', 'Einladungen', 'приглашение', 'чакыруу', 'Danke für die Einladung!', 'Спасибо за приглашение!', 'Чакыруу үчүн рахмат!'],
  ['v', 'einladen', '', 'приглашать', 'чакыруу, конокко чакыруу', 'Ich lade dich zur Party ein.', 'Я приглашаю тебя на вечеринку.', 'Мен сени майрамга чакырам.'],
  ['die', 'Feier', 'Feiern', 'праздник, торжество', 'майрам, салтанат', 'Die Feier beginnt um 18 Uhr.', 'Праздник начинается в 18 часов.', 'Майрам саат 18де башталат.'],
  ['die', 'Party', 'Partys', 'вечеринка', 'достор чогулган кече', 'Die Party ist bei mir zu Hause.', 'Вечеринка будет у меня дома.', 'Достор чогулган кече менин үйүмдө болот.'],
  ['das', 'Geschenk', 'Geschenke', 'подарок', 'белек', 'Ich bringe ein Geschenk mit.', 'Я принесу подарок.', 'Мен белек алып барам.'],
  ['der', 'Geburtstag', 'Geburtstage', 'день рождения', 'туулган күн', 'Am Samstag habe ich Geburtstag.', 'В субботу у меня день рождения.', 'Ишемби күнү менин туулган күнүм.'],
  ['die', 'Hochzeit', 'Hochzeiten', 'свадьба', 'үйлөнүү тою', 'Wir gehen zur Hochzeit von Anna.', 'Мы идём на свадьбу Анны.', 'Биз Аннанын үйлөнүү тоюна барабыз.'],
  ['v', 'gratulieren', '', 'поздравлять', 'куттуктоо', 'Ich gratuliere dir zum Geburtstag.', 'Я поздравляю тебя с днём рождения.', 'Мен сени туулган күнүң менен куттуктайм.'],
  ['v', 'mitbringen', '', 'приносить с собой', 'өзү менен кошо алып келүү', 'Bringst du etwas zu trinken mit?', 'Ты принесёшь что-нибудь попить?', 'Сен ичүүгө бир нерсе алып келесиңби?'],
  ['v', 'sich verabreden', '', 'договариваться о встрече', 'жолугушууга макулдашуу', 'Wir verabreden uns für Samstag.', 'Мы договариваемся о встрече на субботу.', 'Биз ишемби күнүнө жолугушууга макулдашабыз.'],
  ['die', 'Verabredung', 'Verabredungen', 'договорённость о встрече, свидание', 'жолугушуу боюнча макулдашуу', 'Ich habe heute eine Verabredung.', 'У меня сегодня назначена встреча.', 'Менин бүгүн жолугушуу боюнча макулдашуум бар.'],
  // Vorschlagen und entscheiden
  ['v', 'vorschlagen', '', 'предлагать', 'сунуш кылуу', 'Ich schlage ein Picknick vor.', 'Я предлагаю устроить пикник.', 'Мен пикник уюштурууну сунуш кылам.'],
  ['der', 'Vorschlag', 'Vorschläge', 'предложение', 'сунуш', 'Das ist ein guter Vorschlag.', 'Это хорошее предложение.', 'Бул жакшы сунуш.'],
  ['v', 'zusagen', '', 'принять приглашение, согласиться прийти', 'келем деп убада берүү', 'Ich sage zu und komme gern.', 'Я принимаю приглашение и приду с удовольствием.', 'Мен келем деп убада берем жана кубаныч менен барам.'],
  ['die', 'Entscheidung', 'Entscheidungen', 'решение', 'чечим', 'Die Entscheidung ist schwer.', 'Решение трудное.', 'Чечим кабыл алуу оор.'],
  ['die', 'Möglichkeit', 'Möglichkeiten', 'возможность, вариант', 'мүмкүнчүлүк, вариант', 'Wir haben zwei Möglichkeiten.', 'У нас есть два варианта.', 'Бизде эки вариант бар.'],
  ['a', 'einverstanden', '', 'согласен', 'макул', 'Ich bin einverstanden.', 'Я согласен.', 'Мен макулмун.'],
  ['v', 'ablehnen', '', 'отклонять, отказываться', 'четке кагуу', 'Ich möchte die Einladung nicht ablehnen.', 'Я не хочу отклонять приглашение.', 'Мен чакырууну четке кагууну каалабайм.'],
  ['die', 'Alternative', 'Alternativen', 'альтернатива', 'башка жол', 'Hast du eine Alternative?', 'У тебя есть альтернатива?', 'Сенде башка жол барбы?'],
  ['v', 'abstimmen', '', 'голосовать, решать голосованием', 'добуш берүү', 'Wir stimmen ab: Kino oder Museum?', 'Мы голосуем: кино или музей?', 'Биз добуш беребиз: кинобу же музейби?'],
  ['der', 'Kompromiss', 'Kompromisse', 'компромисс', 'эки тараптын макулдашуусу', 'Das ist ein Kompromiss.', 'Это компромисс.', 'Бул эки тараптын макулдашуусу.'],
  // Planen und Zeit
  ['v', 'planen', '', 'планировать', 'пландоо', 'Wir planen ein Fest.', 'Мы планируем праздник.', 'Биз майрам пландап жатабыз.'],
  ['v', 'vorhaben', '', 'собираться, иметь в планах', 'ниети болуу, пландап коюу', 'Ich habe am Sonntag nichts vor.', 'В воскресенье у меня нет планов.', 'Жекшемби күнү менин эч кандай планым жок.'],
  ['der', 'Plan', 'Pläne', 'план', 'иш планы', 'Hast du schon einen Plan?', 'У тебя уже есть план?', 'Сенде иш планы барбы?'],
  ['v', 'organisieren', '', 'организовывать', 'уюштуруу', 'Wer organisiert die Party?', 'Кто организует вечеринку?', 'Кечени ким уюштурат?'],
  ['o', 'vielleicht', '', 'может быть', 'балким', 'Vielleicht komme ich später.', 'Может быть, я приду позже.', 'Балким, мен кийинчерээк келип калам.'],
  ['o', 'wahrscheinlich', '', 'вероятно', 'сыягы', 'Ich komme wahrscheinlich um acht.', 'Я приду, вероятно, в восемь.', 'Мен сыягы саат сегизде келем.'],
  ['o', 'sicher', '', 'наверняка, точно', 'так, анык', 'Ich komme sicher.', 'Я точно приду.', 'Мен анык келем.'],
  ['o', 'bald', '', 'скоро', 'жакында', 'Wir sehen uns bald.', 'Мы скоро увидимся.', 'Биз жакында көрүшөбүз.'],
  ['o', 'übermorgen', '', 'послезавтра', 'бүрсүгүнү', 'Übermorgen ist die Feier.', 'Послезавтра праздник.', 'Бүрсүгүнү майрам болот.'],
  ['o', 'spätestens', '', 'самое позднее', 'эң кеч дегенде', 'Spätestens um acht bin ich da.', 'Самое позднее в восемь я буду там.', 'Эң кеч дегенде саат сегизде мен ошол жерде болом.'],
  // Höflichkeit und Gefühle
  ['o', 'leider', '', 'к сожалению', 'тилекке каршы', 'Leider habe ich keine Zeit.', 'К сожалению, у меня нет времени.', 'Тилекке каршы, менде убакыт жок.'],
  ['o', 'schade', '', 'жаль', 'аябай өкүнүчтүү', 'Schade, du kommst nicht.', 'Жаль, ты не придёшь.', 'Аябай өкүнүчтүү, сен келбейсиң.'],
  ['o', 'herzlich', '', 'сердечно, от души', 'чын жүрөктөн', 'Wir laden dich herzlich ein.', 'Мы от души приглашаем тебя.', 'Биз сени чын жүрөктөн чакырабыз.'],
  ['v', 'sich entschuldigen', '', 'извиняться', 'кечирим суроо', 'Ich entschuldige mich für die Verspätung.', 'Я извиняюсь за опоздание.', 'Мен кечигип калганым үчүн кечирим сурайм.'],
  ['p', 'viel Spaß', '', 'желаю хорошо повеселиться', 'жакшы эс алгыла', 'Viel Spaß auf der Party!', 'Хорошо повеселиться на вечеринке!', 'Кечеде жакшы эс алгыла!'],
  ['p', 'Prost', '', 'за здоровье! (тост)', 'ден соолугуңарга! — деген тост', 'Prost! Auf deinen Geburtstag!', 'За здоровье! За твой день рождения!', 'Ден соолугуңарга! Туулган күнүң үчүн!'],
]

const posOf = (k: string): PartOfSpeech =>
  k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : k === 'a' ? 'adj' : k === 'p' ? 'phrase' : 'other'

/** Unit 20 words that are RECOGNITION vocabulary: understood in texts and options, never required in a gap, speaking keyword or writing requirement. */
export const UNIT_20_RECEPTIVE_WORDS: readonly string[] = ['ablehnen', 'Alternative', 'abstimmen', 'Kompromiss']

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v20-${i + 1}`,
    unit: 20,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in Units 11–19. */
export const UNIT_20_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
