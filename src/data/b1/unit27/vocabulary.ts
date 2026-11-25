import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 27 vocabulary — Konsum, Geld und Reklamation (B1). 40 NEW productive items (target 38–42), none of them an A1/A2 or earlier B1 headword
 * (legacy rule: cross-level lemma repeats are rejected by `b1-vocab-repeats-earlier-level`; v2 Units 301–336 allow reuse across units/levels and reject only same-unit duplicates — see `docs/b1/B1_ID_CONVENTIONS.md`). Themes: Reklamation und Rückgabe · Bank und Zahlung · Einkauf und Budget · Adjektive · Verben.
 * A2 Unit 15 and earlier units already taught the basic shopping and money words (Angebot, Preis, Rechnung, Quittung, Kunde, kaufen, bestellen, umtauschen,
 * Lieferung, Paket, Konto, Bank, Geldautomat, Gehalt, kündigen, vergleichen, entscheiden …); they are REUSED in the texts as revision but not listed again.
 * `Kredit` is RECEPTIVE only (curriculum): it is glossed in one reading and is not a vocabulary item. Wortbildung strand: Verb → Nomen (reklamieren →
 * Reklamation, bestellen → Bestellung, zahlen → Zahlung, erstatten → Erstattung), -er (Verbraucher, Händler), compounds (Mobilfunkvertrag, Kaufbeleg,
 * Preisvergleich), zurück- (zurückgeben, zurückzahlen). No verb needs a prepositional object (Unit 28). Every shop, product and sum is fictional; rules such as
 * "14 Tage" belong to a fictional shop and are not legal statements. Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted FIRST DRAFT.
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb · a adjective
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Reklamation und Rückgabe
  ['die', 'Reklamation', 'Reklamationen', 'рекламация, жалоба на товар', 'товарга даттануу, рекламация', 'Ich schicke dem Laden meine Reklamation per E-Mail.', 'Я отправляю магазину свою рекламацию по электронной почте.', 'Мен дүкөнгө даттануумду электрондук почта аркылуу жиберем.'],
  ['die', 'Garantie', 'Garantien', 'гарантия', 'кепилдик', 'Auf das Handy gibt es zwei Jahre Garantie.', 'На телефон дают два года гарантии.', 'Телефонго эки жыл кепилдик берилет.'],
  ['der', 'Umtausch', '', 'обмен (товара)', 'товарды алмаштыруу', 'Ein Umtausch ist nur mit dem Kaufbeleg möglich.', 'Обмен возможен только с чеком.', 'Алмаштыруу чек менен гана мүмкүн.'],
  ['der', 'Kaufbeleg', 'Kaufbelege', 'чек, документ о покупке', 'сатып алуу далили (чек)', 'Bitte bringen Sie den Kaufbeleg mit.', 'Пожалуйста, возьмите с собой чек.', 'Сураныч, чекти өзүңүз менен алып келиңиз.'],
  ['der', 'Ersatz', '', 'замена, заменяющий товар', 'алмаштыруу, ордуна берилген нерсе', 'Ich möchte einen Ersatz für das kaputte Gerät.', 'Я хочу замену для сломанного устройства.', 'Мен бузулган шаймандын ордуна алмаштыруу каалайм.'],
  ['die', 'Rückgabe', 'Rückgaben', 'возврат (товара)', 'кайтарып берүү', 'In diesem Laden ist die Rückgabe vierzehn Tage lang möglich.', 'В этом магазине возврат возможен в течение четырнадцати дней.', 'Бул дүкөндө кайтарып берүү он төрт күн бою мүмкүн.'],
  ['die', 'Erstattung', 'Erstattungen', 'возмещение (денег)', 'акчаны кайтаруу', 'Die Erstattung kommt in einer Woche auf mein Konto.', 'Возмещение придёт на мой счёт через неделю.', 'Акча бир жумада менин эсебиме келет.'],
  ['der', 'Händler', 'Händler', 'продавец, торговец', 'соодагер, сатуучу', 'Der Händler hat sich entschuldigt.', 'Продавец извинился.', 'Соодагер кечирим сурады.'],
  ['der', 'Verbraucher', 'Verbraucher', 'потребитель', 'керектөөчү', 'Verbraucher sollten vor dem Kauf die Preise vergleichen.', 'Потребителям стоит сравнивать цены перед покупкой.', 'Керектөөчүлөр сатып алардан мурун баааларды салыштырышы керек.'],
  // Bank und Zahlung
  ['die', 'Gebühr', 'Gebühren', 'сбор, комиссия', 'акы, комиссия', 'Die Bank verlangt jeden Monat eine Gebühr.', 'Банк каждый месяц берёт комиссию.', 'Банк ар айда комиссия алат.'],
  ['der', 'Dauerauftrag', 'Daueraufträge', 'постоянное поручение банку', 'банкка туруктуу төлөм тапшырмасы', 'Die Miete bezahle ich per Dauerauftrag.', 'Аренду я плачу по постоянному поручению.', 'Ижара акысын мен туруктуу тапшырма менен төлөйм.'],
  ['die', 'Lastschrift', 'Lastschriften', 'прямое списание со счёта', 'эсептен түз карматуу', 'Der Betrag wird per Lastschrift abgebucht.', 'Сумма списывается прямым дебетом.', 'Сумма эсептен түз карматуу менен алынат.'],
  ['die', 'Kreditkarte', 'Kreditkarten', 'кредитная карта', 'насыя картасы', 'Online bezahle ich oft mit der Kreditkarte.', 'В интернете я часто плачу кредитной картой.', 'Интернетте мен көбүнчө насыя картасы менен төлөйм.'],
  ['die', 'Zahlung', 'Zahlungen', 'платёж', 'төлөм', 'Die Zahlung ist heute angekommen.', 'Платёж сегодня поступил.', 'Төлөм бүгүн келип түштү.'],
  ['der', 'Betrag', 'Beträge', 'сумма, итоговая цифра', 'сумма, төлөмдүн өлчөмү', 'Der Betrag auf der Rechnung stimmt nicht.', 'Сумма в счёте неверная.', 'Эсептеги сумма туура эмес.'],
  ['der', 'Mobilfunkvertrag', 'Mobilfunkverträge', 'договор на мобильную связь', 'уюлдук байланыш келишими', 'Ich möchte meinen Mobilfunkvertrag kündigen.', 'Я хочу расторгнуть договор на мобильную связь.', 'Мен уюлдук байланыш келишимин токтоткум келет.'],
  ['die', 'Schulden', 'Schulden', 'долги (мн. ч.)', 'карыз (көптүк)', 'Ich möchte keine Schulden machen.', 'Я не хочу делать долги.', 'Мен карыз болгум келбейт.'],
  // Einkauf und Budget
  ['die', 'Bestellung', 'Bestellungen', 'заказ', 'буйрутма (заказ)', 'Meine Bestellung ist noch nicht da.', 'Мой заказ ещё не пришёл.', 'Менин заказым дагы келе элек.'],
  ['die', 'Versandkosten', 'Versandkosten', 'стоимость доставки (мн. ч.)', 'жөнөтүү чыгымдары (көптүк)', 'Die Versandkosten sind bei diesem Shop hoch.', 'Стоимость доставки в этом магазине высокая.', 'Бул дүкөндө жөнөтүү чыгымдары жогору.'],
  ['das', 'Budget', 'Budgets', 'бюджет, план расходов', 'бюджет, чыгым-киреше планы', 'Mein Budget für Kleidung ist klein.', 'Мой бюджет на одежду небольшой.', 'Кийимге бөлгөн бюджетим кичине.'],
  ['der', 'Preisvergleich', 'Preisvergleiche', 'сравнение цен', 'баа салыштыруу', 'Vor dem Kauf mache ich einen Preisvergleich.', 'Перед покупкой я сравниваю цены.', 'Сатып алардан мурун мен баа салыштырам.'],
  ['der', 'Gutschein', 'Gutscheine', 'ваучер, подарочная карта', 'белек купону', 'Ich bekomme einen Gutschein für den nächsten Einkauf.', 'Я получаю ваучер на следующую покупку.', 'Мен кийинки сатып алуу үчүн купон алам.'],
  ['der', 'Rabatt', 'Rabatte', 'скидка', 'арзандатуу', 'Im Winter gibt es hohe Rabatte.', 'Зимой бывают большие скидки.', 'Кышында чоң арзандатуулар болот.'],
  // Adjektive
  ['a', 'beschädigt', '', 'повреждённый', 'бузулган, зыян келген', 'Das Paket war beschädigt.', 'Посылка была повреждена.', 'Посылка бузулуп келген.'],
  ['a', 'mangelhaft', '', 'дефектный, с изъяном', 'кемчиликтүү', 'Die Ware ist leider mangelhaft.', 'Товар, к сожалению, дефектный.', 'Тилекке каршы, товар кемчиликтүү.'],
  ['a', 'fehlerhaft', '', 'с ошибкой, бракованный', 'каталуу, брактуу', 'Die Rechnung ist fehlerhaft.', 'Счёт содержит ошибки.', 'Эсепте каталар бар.'],
  ['a', 'kulant', '', 'идущий навстречу клиенту', 'кардарга жеңилдик берүүчү', 'Der Händler war sehr kulant.', 'Продавец очень пошёл навстречу.', 'Соодагер абдан жумшак мамиле кылды.'],
  ['a', 'preiswert', '', 'недорогой и хороший', 'арзан жана сапаттуу', 'Dieses Modell ist preiswert und gut.', 'Эта модель недорогая и хорошая.', 'Бул үлгү арзан жана жакшы.'],
  ['a', 'überteuert', '', 'слишком дорогой, завышенный по цене', 'өтө кымбат, баасы көтөрүлгөн', 'Die Preise im Zentrum sind oft überteuert.', 'Цены в центре часто завышены.', 'Борбордогу баалар көбүнчө өтө кымбат.'],
  // Verben
  ['v', 'reklamieren', '', 'подать рекламацию', 'даттануу, рекламация берүү', 'Ich möchte die kaputte Jacke reklamieren.', 'Я хочу подать рекламацию на сломанную куртку.', 'Мен бузулган курткага даттангым келет.'],
  ['v', 'zurückgeben', '', 'вернуть (товар)', 'кайтарып берүү', 'Ich kann das Paket zurückgeben.', 'Я могу вернуть посылку.', 'Мен посылканы кайтарып бере алам.'],
  ['v', 'erstatten', '', 'возместить', 'акчаны кайтарып берүү', 'Der Shop will mir das Geld erstatten.', 'Магазин хочет возместить мне деньги.', 'Дүкөн акчамды кайтарып бергиси келет.'],
  ['v', 'ersetzen', '', 'заменить', 'алмаштыруу', 'Bitte ersetzen Sie das Gerät.', 'Пожалуйста, замените устройство.', 'Сураныч, шайманды алмаштырыңыз.'],
  ['v', 'verlangen', '', 'требовать, брать (плату)', 'талап кылуу, акы алуу', 'Der Laden verlangt zehn Euro Gebühr.', 'Магазин берёт десять евро комиссии.', 'Дүкөн он евро акы алат.'],
  ['v', 'abbuchen', '', 'списывать со счёта', 'эсептен карматуу', 'Die Firma darf nicht zu viel Geld abbuchen.', 'Фирма не должна списывать слишком много денег.', 'Фирма өтө көп акчаны эсептен алып койбошу керек.'],
  ['v', 'zurückzahlen', '', 'вернуть деньги, выплатить долг', 'акчаны кайтарып төлөө', 'Ich muss das Geld im Mai zurückzahlen.', 'Я должен вернуть деньги в мае.', 'Мен акчаны майда кайтарып төлөшүм керек.'],
  ['v', 'stornieren', '', 'отменить (заказ)', 'жокко чыгаруу (заказды)', 'Ich möchte meine Bestellung stornieren.', 'Я хочу отменить свой заказ.', 'Мен заказымды жокко чыгаргым келет.'],
  ['v', 'widerrufen', '', 'отозвать (заказ, согласие)', 'кайра чакыртып алуу (заказды)', 'In diesem Shop kann man die Bestellung zwei Wochen lang widerrufen.', 'В этом магазине заказ можно отозвать в течение двух недель.', 'Бул дүкөндө заказды эки жума бою кайра чакыртып алууга болот.'],
  ['v', 'sparen', '', 'копить, экономить', 'үнөмдөө, жыйноо', 'Ich spare jeden Monat fünfzig Euro.', 'Я откладываю каждый месяц пятьдесят евро.', 'Мен ар айда элүү евро жыйнайм.'],
  ['v', 'ausgeben', '', 'тратить', 'сарптоо', 'Im Urlaub gebe ich gern viel Geld aus.', 'В отпуске я охотно трачу много денег.', 'Эс алууда мен көп акча сарптаганды жакшы көрөм.'],
]

const posOf = (k: string): PartOfSpeech =>
  k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : k === 'x' ? 'other' : 'adj'

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v27-${i + 1}`,
    unit: 27,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in A1, A2 and Units 21–26. */
export const UNIT_27_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
