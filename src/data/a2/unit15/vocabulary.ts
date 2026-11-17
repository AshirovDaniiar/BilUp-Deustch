import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 15 vocabulary — Essen, Einkaufen und Dienstleistungen (Stage 7F). 38 items, exactly the approved Stage 7B vocabulary map:
 * 36 productive, 2 receptive (`UNIT_15_RECEPTIVE_WORDS`). Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted
 * first draft for native review (uncertain terms: docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md, §8). Food, measures and clothing are glossed as GERMAN
 * items (no local pack sizes or customs imported). Example sentences respect the grammar scope: attributive adjectives only after ein-/kein-/mein- and
 * the definite article / dieser / welcher (Nominativ, Akkusativ, never after a Dativ preposition, never in the plural without article).
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb · a adjective
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Lebensmittel
  ['das', 'Obst', '', 'фрукты', 'жемиш', 'Im Sommer esse ich viel Obst.', 'Летом я ем много фруктов.', 'Жайында мен көп жемиш жейм.'],
  ['die', 'Wurst', 'Würste', 'колбаса, колбасные изделия', 'колбаса (эттен жасалган даярдалган азык)', 'Zum Frühstück esse ich Brot mit Wurst.', 'На завтрак я ем хлеб с колбасой.', 'Эртең мененки тамакка мен нанды колбаса менен жейм.'],
  ['der', 'Fisch', 'Fische', 'рыба', 'балык', 'Am Freitag koche ich Fisch.', 'В пятницу я готовлю рыбу.', 'Жума күнү мен балык бышырам.'],
  ['die', 'Butter', '', 'сливочное масло', 'сары май', 'Die Butter ist im Kühlschrank.', 'Масло лежит в холодильнике.', 'Сары май муздаткычта турат.'],
  ['der', 'Joghurt', 'Joghurts', 'йогурт', 'йогурт (даамдуу сүт азыгы)', 'Ich esse jeden Morgen einen Joghurt.', 'Я ем йогурт каждое утро.', 'Мен күн сайын эртең менен бир йогурт жейм.'],
  ['die', 'Nudeln', 'Nudeln', 'макароны, лапша', 'макарон, кесме', 'Heute gibt es Nudeln mit Tomaten.', 'Сегодня на ужин макароны с помидорами.', 'Бүгүн макарон менен помидор бар.'],
  ['das', 'Mehl', '', 'мука', 'ун', 'Für den Kuchen brauche ich Mehl.', 'Для пирога мне нужна мука.', 'Торт үчүн мага ун керек.'],
  ['der', 'Zucker', '', 'сахар', 'кант', 'Möchten Sie Zucker im Tee?', 'Хотите сахар в чай?', 'Чайга кант салалыбы?'],
  ['die', 'Tomate', 'Tomaten', 'помидор', 'томат (помидор)', 'Ich kaufe drei Tomaten.', 'Я покупаю три помидора.', 'Мен үч томат сатып алам.'],
  // Mengen und Verpackungen
  ['das', 'Kilo', 'Kilo', 'килограмм', 'килограмм (кг)', 'Ich möchte ein Kilo Äpfel.', 'Я хотел бы килограмм яблок.', 'Мен бир килограмм алма алгым келет.'],
  ['das', 'Gramm', 'Gramm', 'грамм', 'грамм (г)', 'Zweihundert Gramm Käse, bitte.', 'Двести граммов сыра, пожалуйста.', 'Сураныч, эки жүз грамм сыр.'],
  ['der', 'Liter', 'Liter', 'литр', 'литр (л)', 'Ich brauche einen Liter Milch.', 'Мне нужен литр молока.', 'Мага бир литр сүт керек.'],
  ['die', 'Flasche', 'Flaschen', 'бутылка', 'бөтөлкө', 'Zwei Flaschen Wasser, bitte.', 'Две бутылки воды, пожалуйста.', 'Сураныч, эки бөтөлкө суу.'],
  ['die', 'Dose', 'Dosen', 'консервная банка', 'калай банка', 'Ich kaufe eine Dose Tomaten.', 'Я покупаю банку помидоров.', 'Мен бир банка томат сатып алам.'],
  ['die', 'Packung', 'Packungen', 'пачка, упаковка', 'таңгак, куту', 'Eine Packung Nudeln kostet einen Euro.', 'Пачка макарон стоит один евро.', 'Бир таңгак макарон бир евро турат.'],
  ['das', 'Stück', 'Stücke', 'кусок, штука', 'бөлүк, даана', 'Ein Stück Kuchen, bitte.', 'Кусочек торта, пожалуйста.', 'Сураныч, бир бөлүк торт.'],
  ['die', 'Scheibe', 'Scheiben', 'ломтик, тонкий кусок', 'тилке, жука кесим', 'Ich möchte drei Scheiben Wurst.', 'Я хотел бы три ломтика колбасы.', 'Мен үч тилке колбаса алгым келет.'],
  // Restaurant und Geschmack
  ['die', 'Vorspeise', 'Vorspeisen', 'закуска (первое блюдо перед основным)', 'алгачкы жеңил тамак', 'Als Vorspeise nehme ich eine Suppe.', 'В качестве закуски я беру суп.', 'Алгачкы тамак катары мен шорпо алам.'],
  ['die', 'Hauptspeise', 'Hauptspeisen', 'основное блюдо', 'негизги тамак', 'Die Hauptspeise ist Fisch mit Salat.', 'Основное блюдо — рыба с салатом.', 'Негизги тамак — салат менен балык.'],
  ['der', 'Nachtisch', 'Nachtische', 'десерт', 'акыркы таттуу тамак', 'Zum Nachtisch möchte ich ein Eis.', 'На десерт я хочу мороженое.', 'Акыркы таттуу тамакка мен балмуздак каалайм.'],
  ['die', 'Portion', 'Portionen', 'порция', 'бир үлүш (порция)', 'Die Portion ist sehr groß.', 'Порция очень большая.', 'Бул үлүш абдан чоң.'],
  ['a', 'scharf', '', 'острый', 'ачуу', 'Die Suppe ist mir zu scharf.', 'Суп для меня слишком острый.', 'Шорпо мага өтө ачуу.'],
  ['a', 'süß', '', 'сладкий', 'таттуу', 'Der Kuchen ist sehr süß.', 'Торт очень сладкий.', 'Торт абдан таттуу.'],
  ['a', 'vegetarisch', '', 'вегетарианский (без мяса и рыбы)', 'эт жана балыксыз (вегетариандык)', 'Ich esse vegetarisch.', 'Я ем вегетарианскую пищу.', 'Мен эт жана балык жебейм.'],
  ['v', 'schmecken', '', 'быть вкусным, иметь вкус', 'даамдуу болуу, даам берүү', 'Die Suppe schmeckt gut.', 'Суп вкусный.', 'Шорпо даамдуу.'],
  // Kleidung
  ['das', 'Kleid', 'Kleider', 'платье', 'көйнөк (аялдардын)', 'Das Kleid gefällt mir.', 'Платье мне нравится.', 'Бул көйнөк мага жагат.'],
  ['der', 'Pullover', 'Pullover', 'свитер, пуловер', 'жемпир', 'Im Winter trage ich einen Pullover.', 'Зимой я ношу свитер.', 'Кышында мен жемпир кийем.'],
  ['der', 'Mantel', 'Mäntel', 'пальто', 'пальто (сырткы кийим)', 'Der Mantel ist zu teuer.', 'Пальто слишком дорогое.', 'Пальто өтө кымбат.'],
  ['v', 'passen', '', 'подходить (по размеру), быть впору', 'туура келүү (өлчөмү боюнча)', 'Die Größe passt mir nicht.', 'Этот размер мне не подходит.', 'Бул өлчөм мага туура келбейт.'],
  // Einkaufen und Dienstleistungen
  ['a', 'reduziert', '', 'со скидкой, уценённый', 'арзандатылган', 'Der Pullover ist heute reduziert.', 'Свитер сегодня со скидкой.', 'Жемпир бүгүн арзандатылган.'],
  ['die', 'Quittung', 'Quittungen', 'квитанция, чек об оплате', 'төлөнгөндүгү жөнүндө кагаз (квитанция)', 'Bitte behalten Sie die Quittung.', 'Сохраните, пожалуйста, чек.', 'Сураныч, квитанцияны сактап коюңуз.'],
  ['der', 'Friseur', 'Friseure', 'парикмахер', 'чач тарач', 'Ich habe einen Termin beim Friseur.', 'У меня запись к парикмахеру.', 'Менин чач тарачка жазылганым бар.'],
  ['die', 'Reinigung', 'Reinigungen', 'химчистка', 'кийим тазалоочу жай (химиялык тазалоо)', 'Die Reinigung ist neben der Bank.', 'Химчистка находится рядом с банком.', 'Кийим тазалоочу жай банктын жанында.'],
  ['die', 'Reparatur', 'Reparaturen', 'ремонт', 'оңдоо', 'Die Reparatur kostet 40 Euro.', 'Ремонт стоит 40 евро.', 'Оңдоо 40 евро турат.'],
  ['v', 'reparieren', '', 'ремонтировать, чинить', 'оңдоо (бузулган нерсени)', 'Können Sie die Uhr reparieren?', 'Вы можете починить часы?', 'Сиз саатты оңдой аласызбы?'],
  ['die', 'Werkstatt', 'Werkstätten', 'мастерская', 'устакана', 'Mein Auto ist in der Werkstatt.', 'Моя машина в мастерской.', 'Менин машинам устаканада.'],
  ['die', 'Lieferung', 'Lieferungen', 'доставка', 'жеткирүү', 'Die Lieferung dauert zwei Tage.', 'Доставка занимает два дня.', 'Жеткирүү эки күнгө созулат.'],
  ['v', 'liefern', '', 'доставлять', 'жеткирип берүү', 'Wir liefern auch am Samstag.', 'Мы доставляем и по субботам.', 'Биз ишемби күнү да жеткирип беребиз.'],
]

const posOf = (k: string): PartOfSpeech => (k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : 'adj')

/** Unit 15 words that are RECOGNITION vocabulary: understood in texts and options, never required in a gap, speaking keyword or writing requirement. */
export const UNIT_15_RECEPTIVE_WORDS: readonly string[] = ['Lieferung', 'liefern']

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v15-${i + 1}`,
    unit: 15,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in Units 11–14. */
export const UNIT_15_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
