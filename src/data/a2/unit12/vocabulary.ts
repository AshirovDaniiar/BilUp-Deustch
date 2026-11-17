import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 12 vocabulary — Familie, Freunde und Zusammenleben (Stage 7C). 40 items from the approved Stage 7B vocabulary map:
 * 35 productive, 5 receptive (`UNIT_12_RECEPTIVE_WORDS`). Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted
 * first draft for native review. Kinship terms are given as DESCRIPTIONS (no invented single term): see docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md.
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb · a adjective
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Verwandte und Beziehungen
  ['der', 'Cousin', 'Cousins', 'двоюродный брат', 'ата-энесинин бир тууганынын уулу', 'Mein Cousin wohnt in Hamburg.', 'Мой двоюродный брат живёт в Гамбурге.', 'Ата-энемдин бир тууганынын уулу Гамбургда жашайт.'],
  ['die', 'Cousine', 'Cousinen', 'двоюродная сестра', 'ата-энесинин бир тууганынын кызы', 'Meine Cousine hat im Mai geheiratet.', 'Моя двоюродная сестра вышла замуж в мае.', 'Ата-энемдин бир тууганынын кызы май айында баш кошту.'],
  ['die', 'Geschwister', 'Geschwister', 'братья и сёстры', 'бир туугандар', 'Hast du Geschwister?', 'У тебя есть братья или сёстры?', 'Сенин бир туугандарың барбы?'],
  ['die', 'Großeltern', 'Großeltern', 'бабушка и дедушка', 'чоң ата менен чоң эне', 'Meine Großeltern wohnen auf dem Land.', 'Мои бабушка и дедушка живут в деревне.', 'Менин чоң атам менен чоң энем айылда жашашат.'],
  ['der', 'Partner', 'Partner', 'партнёр, спутник жизни', 'өнөктөш', 'Mein Partner kocht gern.', 'Мой партнёр любит готовить.', 'Менин өнөктөшүм тамак бышырганды жакшы көрөт.'],
  ['die', 'Partnerin', 'Partnerinnen', 'партнёрша, спутница жизни', 'өнөктөш (аял)', 'Seine Partnerin arbeitet als Ärztin.', 'Его партнёрша работает врачом.', 'Анын өнөктөшү дарыгер болуп иштейт.'],
  ['das', 'Paar', 'Paare', 'пара', 'жуп', 'Das Paar wohnt seit zwei Jahren zusammen.', 'Эта пара живёт вместе уже два года.', 'Бул жуп эки жылдан бери чогуу жашап келет.'],
  ['a', 'ledig', '', 'не состоящий в браке', 'үй-бүлө куруй элек', 'Mein Bruder ist noch ledig.', 'Мой брат ещё не женат.', 'Менин агам али үй-бүлө куруй элек.'],
  ['a', 'geschieden', '', 'разведённый', 'ажырашкан', 'Sie ist seit drei Jahren geschieden.', 'Она разведена уже три года.', 'Ал үч жылдан бери ажырашкан.'],
  ['der', 'Verwandte', 'Verwandte', 'родственник', 'тууган', 'Am Sonntag besuchen wir Verwandte.', 'В воскресенье мы навещаем родственников.', 'Жекшемби күнү биз туугандарыбызга барабыз.'],
  ['der', 'Bekannte', 'Bekannte', 'знакомый', 'тааныш', 'Ein Bekannter hat mir die Wohnung gezeigt.', 'Знакомый показал мне квартиру.', 'Бир тааныш мага батирди көрсөттү.'],
  // Charakter (predicative use only in this unit)
  ['a', 'freundlich', '', 'дружелюбный', 'ак көңүл', 'Mein Chef ist immer freundlich.', 'Мой начальник всегда дружелюбный.', 'Менин жетекчим дайыма ак көңүл.'],
  ['a', 'nett', '', 'милый, приятный', 'жагымдуу', 'Deine Schwester ist wirklich nett.', 'Твоя сестра очень милая.', 'Сенин эжең чындап эле жагымдуу.'],
  ['a', 'sympathisch', '', 'симпатичный (о человеке)', 'сүйкүмдүү', 'Dein Freund ist mir sympathisch.', 'Твой друг мне симпатичен.', 'Сенин досуң мага сүйкүмдүү сезилет.'],
  ['a', 'lustig', '', 'весёлый, забавный', 'шайыр', 'Mein Opa ist sehr lustig.', 'Мой дедушка очень весёлый.', 'Менин чоң атам абдан шайыр.'],
  ['a', 'ehrlich', '', 'честный', 'чынчыл', 'Ein guter Freund ist immer ehrlich.', 'Хороший друг всегда честен.', 'Жакшы дос дайыма чынчыл болот.'],
  ['a', 'höflich', '', 'вежливый', 'сылык', 'Die Kinder sind sehr höflich.', 'Дети очень вежливые.', 'Балдар абдан сылык.'],
  ['a', 'hilfsbereit', '', 'готовый помочь', 'жардамга даяр', 'Meine Kollegen sind hilfsbereit.', 'Мои коллеги всегда готовы помочь.', 'Менин кесиптештерим жардам берүүгө даяр.'],
  ['a', 'zuverlässig', '', 'надёжный', 'ишенимдүү', 'Mein Bruder ist immer zuverlässig.', 'Мой брат всегда надёжен.', 'Менин агам дайыма ишенимдүү.'],
  ['a', 'eifersüchtig', '', 'ревнивый', 'кызганчаак', 'Er ist manchmal eifersüchtig.', 'Он иногда ревнует.', 'Ал кээде кызганчаак болот.'],
  // Gefühle
  ['a', 'glücklich', '', 'счастливый', 'бактылуу', 'Wir sind sehr glücklich.', 'Мы очень счастливы.', 'Биз абдан бактылуубуз.'],
  ['a', 'traurig', '', 'грустный', 'капа', 'Ich bin traurig, weil mein Freund umzieht.', 'Мне грустно, потому что мой друг переезжает.', 'Досум көчүп кеткендиктен мен капамын.'],
  ['a', 'wütend', '', 'злой, сердитый', 'ачуулуу', 'Ich bin wütend, weil du nicht angerufen hast.', 'Я зол, потому что ты не позвонил.', 'Сен чалбаганыңдан улам мен ачуулуумун.'],
  ['v', 'lieben', '', 'любить', 'сүйүү', 'Ich liebe meine Familie.', 'Я люблю свою семью.', 'Мен үй-бүлөмдү сүйөм.'],
  ['v', 'mögen', '', 'нравиться, любить (людей, еду)', 'жактыруу', 'Ich mag deinen Bruder sehr.', 'Мне очень нравится твой брат.', 'Мен сенин агаңды абдан жактырам.'],
  ['v', 'vertrauen', '', 'доверять', 'ишенүү', 'Ich vertraue meiner Schwester.', 'Я доверяю своей сестре.', 'Мен эжеме ишенем.'],
  // Zusammenleben und Haushalt
  ['v', 'sich kennenlernen', '', 'познакомиться', 'таанышуу', 'Wir haben uns im Deutschkurs kennengelernt.', 'Мы познакомились на курсах немецкого.', 'Биз немис тили курсунда таанышып калдык.'],
  ['v', 'sich treffen', '', 'встречаться', 'жолугушуу', 'Wir treffen uns am Samstag.', 'Мы встречаемся в субботу.', 'Биз ишемби күнү жолугабыз.'],
  ['v', 'sich verstehen', '', 'понимать друг друга, ладить', 'бири-бирин түшүнүү, тил табышуу', 'Ich verstehe mich gut mit meiner Schwester.', 'Я хорошо лажу со своей сестрой.', 'Мен эжем менен жакшы тил табышам.'],
  ['v', 'sich streiten', '', 'ссориться, спорить', 'талашуу', 'Wir streiten uns selten.', 'Мы редко ссоримся.', 'Биз сейрек талашабыз.'],
  ['v', 'heiraten', '', 'жениться, выходить замуж', 'баш кошуу', 'Meine Eltern haben 1995 geheiratet.', 'Мои родители поженились в 1995 году.', 'Менин ата-энем 1995-жылы баш коштушкан.'],
  ['v', 'zusammenleben', '', 'жить вместе', 'чогуу жашоо', 'Wir leben seit einem Jahr zusammen.', 'Мы живём вместе уже год.', 'Биз бир жылдан бери чогуу жашап жатабыз.'],
  ['der', 'Haushalt', 'Haushalte', 'домашнее хозяйство', 'үй-тиричилик', 'Wir teilen den Haushalt.', 'Мы делим домашние дела.', 'Биз үй-тиричиликти бөлүшөбүз.'],
  ['die', 'Hausarbeit', 'Hausarbeiten', 'работа по дому', 'үй иши', 'Die Hausarbeit macht mir keinen Spaß.', 'Работа по дому не доставляет мне радости.', 'Үй иши мага кубаныч алып келбейт.'],
  ['v', 'abwaschen', '', 'мыть посуду', 'идиш жуу', 'Wer wäscht heute ab?', 'Кто сегодня моет посуду?', 'Бүгүн идишти ким жууйт?'],
  ['v', 'aufräumen', '', 'убирать, наводить порядок', 'жыйноо, тартипке келтирүү', 'Ich räume mein Zimmer auf.', 'Я убираюсь в своей комнате.', 'Мен бөлмөмдү жыйнайм.'],
  ['v', 'teilen', '', 'делить, делиться', 'бөлүшүү', 'Wir teilen die Arbeit.', 'Мы делим работу.', 'Биз ишти бөлүшөбүз.'],
  ['v', 'schenken', '', 'дарить', 'белек кылуу', 'Ich schenke meiner Mutter Blumen.', 'Я дарю маме цветы.', 'Мен апама гүл белек кылам.'],
  ['v', 'gehören', '', 'принадлежать', 'таандык болуу, …-ныкы болуу', 'Das Fahrrad gehört meinem Bruder.', 'Велосипед принадлежит моему брату.', 'Велосипед менин агамдыкы.'],
  ['v', 'gefallen', '', 'нравиться', 'жагуу', 'Das Geschenk gefällt mir.', 'Подарок мне нравится.', 'Белек мага жагат.'],
]

const posOf = (k: string): PartOfSpeech => (k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : 'adj')

/** Unit 12 words that are RECOGNITION vocabulary: understood in texts and options, never required in a gap, speaking keyword or writing requirement. */
export const UNIT_12_RECEPTIVE_WORDS: readonly string[] = ['geschieden', 'Verwandte', 'Bekannte', 'eifersüchtig', 'vertrauen']

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v12-${i + 1}`,
    unit: 12,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in A1 and Unit 11. */
export const UNIT_12_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
