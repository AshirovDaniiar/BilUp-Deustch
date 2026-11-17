import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 19 vocabulary — Stadtleben und öffentliche Dienste (Stage 7J). 38 items, exactly the approved Stage 7B vocabulary map:
 * 35 productive, 3 receptive (`UNIT_19_RECEPTIVE_WORDS`). Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted first draft for native
 * review (uncertain terms: docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md, §12). Administrative words describe the GERMAN procedure; they are language practice and
 * make no legal claim. No artificial brackets: where both languages would use the same loan word, each gloss gives its own natural wording (no pair is identical).
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb · a adjective
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Behörden und Formulare
  ['das', 'Amt', 'Ämter', 'учреждение, ведомство', 'мамлекеттик мекеме', 'Das Amt ist im Rathaus.', 'Это учреждение находится в ратуше.', 'Бул мекеме шаар башкармасынын имаратында.'],
  ['das', 'Rathaus', 'Rathäuser', 'ратуша, здание городской администрации', 'шаардык башкарма имараты', 'Das Rathaus liegt neben der Bank.', 'Ратуша находится рядом с банком.', 'Шаардык башкарма имараты банктын жанында жайгашкан.'],
  ['das', 'Bürgeramt', 'Bürgerämter', 'бюро обслуживания граждан (регистрация, документы)', 'жарандарды тейлөө бөлүмү', 'Im Bürgeramt bekomme ich einen Termin.', 'В бюро обслуживания граждан я получаю запись на приём.', 'Жарандарды тейлөө бөлүмүндө мен кабыл алуу убактысын алам.'],
  ['die', 'Anmeldung', 'Anmeldungen', 'регистрация по месту жительства, запись', 'жашаган жер боюнча каттоо, жазылуу', 'Die Anmeldung dauert fünf Minuten.', 'Регистрация занимает пять минут.', 'Каттоо беш мүнөткө созулат.'],
  ['v', 'sich anmelden', '', 'зарегистрироваться, записаться', 'каттоодон өтүү, жазылуу', 'Ich melde mich im Bürgeramt an.', 'Я регистрируюсь в бюро обслуживания граждан.', 'Мен жарандарды тейлөө бөлүмүндө каттоодон өтөм.'],
  ['das', 'Formular', 'Formulare', 'бланк, анкета', 'толтурула турган барак', 'Das Formular liegt am Schalter.', 'Бланк лежит у окошка.', 'Толтурула турган барак терезенин жанында жатат.'],
  ['der', 'Antrag', 'Anträge', 'заявление, ходатайство', 'арыз', 'Ich schreibe einen Antrag.', 'Я пишу заявление.', 'Мен арыз жазам.'],
  ['v', 'ausfüllen', '', 'заполнять', 'толтуруу', 'Ich fülle das Formular aus.', 'Я заполняю бланк.', 'Мен бланкты толтурам.'],
  ['die', 'Unterschrift', 'Unterschriften', 'подпись', 'кол тамга', 'Hier fehlt Ihre Unterschrift.', 'Здесь не хватает вашей подписи.', 'Бул жерде сиздин кол тамгаңыз жок.'],
  ['v', 'unterschreiben', '', 'подписывать', 'кол коюу', 'Bitte unterschreiben Sie hier.', 'Пожалуйста, подпишите здесь.', 'Сураныч, бул жерге кол коюңуз.'],
  ['der', 'Ausweis', 'Ausweise', 'удостоверение личности, паспорт', 'инсандыкты күбөлөндүрүүчү документ', 'Ich habe meinen Ausweis dabei.', 'У меня с собой удостоверение личности.', 'Менин инсандыгымды күбөлөндүрүүчү документим жанымда.'],
  ['die', 'Aufenthaltserlaubnis', 'Aufenthaltserlaubnisse', 'разрешение на пребывание, вид на жительство', 'жашоого уруксат', 'Er hat eine Aufenthaltserlaubnis.', 'У него есть разрешение на пребывание.', 'Анын жашоого уруксаты бар.'],
  // Post und Bank
  ['das', 'Paket', 'Pakete', 'посылка', 'почта аркылуу жөнөтүлүүчү таңгак', 'Das Paket ist schwer.', 'Посылка тяжёлая.', 'Таңгак оор.'],
  ['die', 'Briefmarke', 'Briefmarken', 'почтовая марка', 'почта маркасы', 'Eine Briefmarke kostet einen Euro.', 'Почтовая марка стоит один евро.', 'Бир почта маркасы бир евро турат.'],
  ['der', 'Brief', 'Briefe', 'письмо', 'кат', 'Ich schreibe einen Brief an das Amt.', 'Я пишу письмо в учреждение.', 'Мен мекемеге кат жазам.'],
  ['v', 'abschicken', '', 'отправлять', 'жөнөтүү', 'Ich schicke das Paket heute ab.', 'Я отправляю посылку сегодня.', 'Мен таңгакты бүгүн жөнөтөм.'],
  ['der', 'Schalter', 'Schalter', 'окошко, стойка обслуживания', 'кызмат көрсөтүүчү терезе', 'Am Schalter zwei bekommen Sie Briefmarken.', 'У окошка два вы получите почтовые марки.', 'Экинчи терезеден сиз почта маркасын аласыз.'],
  ['der', 'Geldautomat', 'Geldautomaten', 'банкомат', 'акча чыгаруучу аппарат', 'Der Geldautomat ist neben der Bank.', 'Банкомат находится рядом с банком.', 'Акча чыгаруучу аппарат банктын жанында.'],
  ['v', 'abheben', '', 'снимать деньги со счёта', 'эсептен акча алуу', 'Ich hebe hundert Euro ab.', 'Я снимаю сто евро.', 'Мен жүз евро алам.'],
  ['v', 'überweisen', '', 'переводить деньги на счёт', 'акча которуу', 'Ich überweise die Miete jeden Monat.', 'Я перевожу арендную плату каждый месяц.', 'Мен ижара акысын ар айда котором.'],
  // Verkehr und Stadt
  ['der', 'Fußgänger', 'Fußgänger', 'пешеход', 'жөө жүрүүчү', 'Die Fußgänger warten an der Ampel.', 'Пешеходы ждут у светофора.', 'Жөө жүрүүчүлөр светофордун жанында күтүшөт.'],
  ['der', 'Radweg', 'Radwege', 'велосипедная дорожка', 'велосипед жолу', 'Der Radweg ist neben der Straße.', 'Велосипедная дорожка идёт рядом с улицей.', 'Велосипед жолу көчөнүн жанында.'],
  ['die', 'Kreuzung', 'Kreuzungen', 'перекрёсток', 'жол кесилиши', 'An der Kreuzung gehen Sie links.', 'На перекрёстке идите налево.', 'Жол кесилишинде солго бурулуңуз.'],
  ['die', 'Straßenbahn', 'Straßenbahnen', 'трамвай', 'рельс менен жүргөн шаар транспорту', 'Die Straßenbahn fährt alle zehn Minuten.', 'Трамвай ходит каждые десять минут.', 'Рельс менен жүргөн шаар транспорту он мүнөт сайын жүрөт.'],
  ['der', 'Parkplatz', 'Parkplätze', 'парковка, место для парковки', 'унаа токтотуучу жай', 'Der Parkplatz ist nur für Besucher.', 'Парковка только для посетителей.', 'Унаа токтотуучу жай конокторго гана.'],
  ['v', 'parken', '', 'парковаться, ставить машину', 'унаа токтотуу', 'Hier darf man nicht parken.', 'Здесь нельзя парковаться.', 'Бул жерде унаа токтотууга болбойт.'],
  ['die', 'Verbindung', 'Verbindungen', 'транспортное сообщение, рейс', 'каттам байланышы', 'Die Verbindung nach Köln ist gut.', 'Сообщение до Кёльна хорошее.', 'Кёльнгө каттам байланышы жакшы.'],
  ['der', 'Verkehr', '', 'движение (транспорта), транспортный поток', 'жол кыймылы', 'Am Morgen ist viel Verkehr.', 'Утром много транспорта на дорогах.', 'Эртең менен жол кыймылы күчтүү.'],
  ['die', 'Baustelle', 'Baustellen', 'стройка, участок дорожных работ', 'курулуш аянты', 'Auf der Baustelle arbeiten viele Bauarbeiter.', 'На стройке работает много строителей.', 'Курулуш аянтында көп курулуш жумушчулары иштейт.'],
  ['der', 'Spielplatz', 'Spielplätze', 'детская площадка', 'балдар оюн аянтчасы', 'Die Kinder spielen auf dem Spielplatz.', 'Дети играют на детской площадке.', 'Балдар оюн аянтчасында ойношот.'],
  ['die', 'Umleitung', 'Umleitungen', 'объезд, объездной путь', 'айланма жол', 'Wegen der Baustelle gibt es eine Umleitung.', 'Из-за стройки есть объезд.', 'Курулушка байланыштуу айланма жол бар.'],
  // Regeln und Auskunft
  ['a', 'erlaubt', '', 'разрешено', 'уруксат берилген', 'Hier ist das Parken erlaubt.', 'Здесь парковка разрешена.', 'Бул жерде унаа токтотууга уруксат берилген.'],
  ['a', 'verboten', '', 'запрещено', 'тыюу салынган', 'Rauchen ist hier verboten.', 'Здесь курить запрещено.', 'Бул жерде тамеки чегүүгө тыюу салынган.'],
  ['das', 'Schild', 'Schilder', 'знак, табличка, указатель', 'белги, көрсөткүч такта', 'Auf dem Schild steht „Parken verboten“.', 'На знаке написано «Парковка запрещена».', 'Белгиде «Унаа токтотууга тыюу салынган» деп жазылган.'],
  ['die', 'Öffnungszeiten', 'Öffnungszeiten', 'часы работы', 'иштөө убактысы', 'Die Öffnungszeiten stehen an der Tür.', 'Часы работы написаны на двери.', 'Иштөө убактысы эшикте жазылган.'],
  ['a', 'geöffnet', '', 'открыт', 'ачык', 'Die Post ist bis 18 Uhr geöffnet.', 'Почта открыта до 18 часов.', 'Почта саат 18ге чейин ачык.'],
  ['a', 'geschlossen', '', 'закрыт', 'жабык', 'Am Sonntag ist die Bank geschlossen.', 'В воскресенье банк закрыт.', 'Жекшемби күнү банк жабык.'],
  ['die', 'Auskunft', 'Auskünfte', 'справка, информация', 'маалымат, түшүндүрмө', 'Danke für die Auskunft.', 'Спасибо за информацию.', 'Маалымат үчүн рахмат.'],
]

const posOf = (k: string): PartOfSpeech => (k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : 'adj')

/** Unit 19 words that are RECOGNITION vocabulary: understood in texts and options, never required in a gap, speaking keyword or writing requirement. */
export const UNIT_19_RECEPTIVE_WORDS: readonly string[] = ['Aufenthaltserlaubnis', 'überweisen', 'Umleitung']

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v19-${i + 1}`,
    unit: 19,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in Units 11–18. */
export const UNIT_19_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
