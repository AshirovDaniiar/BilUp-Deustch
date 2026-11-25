import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 26 vocabulary — Medien, Technik und Nachrichten (B1). 40 NEW productive items (target 38–42), none of them an A1/A2 or earlier B1 headword
 * (legacy rule: cross-level lemma repeats are rejected by `b1-vocab-repeats-earlier-level`; v2 Units 301–336 allow reuse across units/levels and reject only same-unit duplicates — see `docs/b1/B1_ID_CONVENTIONS.md`). Themes: Nachrichten und Quellen · Daten und Technik · Buch und Film · Adjektive · Verben.
 * A2 Unit 16 already taught the basic media words (Nachricht, Zeitung, Internet, Handy, App, Fernseher, Foto, herunterladen …) and Unit 25 empfehlen; they are
 * REUSED in the texts as revision but not listed again. Wortbildung strand: -ung (Meldung, Handlung, Werbung), -er (Leser, Nutzer, Schauspieler),
 * compounds (Datenschutz, Bildschirm, Passwort, Kundendienst), un- (unseriös). No verb needs a prepositional object (Unit 28). All example sentences are about
 * fictional or general situations. Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted FIRST DRAFT that has not been reviewed by a
 * native speaker.
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb · a adjective
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Nachrichten und Quellen
  ['die', 'Schlagzeile', 'Schlagzeilen', 'заголовок (в газете)', 'гезиттеги негизги аталыш', 'Die Schlagzeile klingt spannend, aber der Text ist kurz.', 'Заголовок звучит интересно, но текст короткий.', 'Негизги аталыш кызыктуу угулат, бирок текст кыска.'],
  ['die', 'Meldung', 'Meldungen', 'короткое сообщение, новость', 'кыска кабар', 'Die Meldung kam um acht Uhr im Radio.', 'Новость прозвучала в восемь часов по радио.', 'Кабар саат сегизде радиодо угулду.'],
  ['der', 'Bericht', 'Berichte', 'репортаж, отчёт', 'репортаж, баяндама', 'Der Bericht ist lang und sehr genau.', 'Репортаж длинный и очень точный.', 'Репортаж узун жана абдан так.'],
  ['die', 'Quelle', 'Quellen', 'источник', 'булак (маалымат булагы)', 'Gute Journalisten nennen ihre Quelle.', 'Хорошие журналисты называют свой источник.', 'Жакшы журналисттер өз булагын аташат.'],
  ['der', 'Journalist', 'Journalisten', 'журналист', 'журналист, кабарчы', 'Der Journalist schreibt jeden Tag einen Artikel.', 'Журналист каждый день пишет статью.', 'Журналист күн сайын макала жазат.'],
  ['die', 'Redaktion', 'Redaktionen', 'редакция (газеты, канала)', 'редакция, басма кеңсеси', 'Die Redaktion prüft jede Meldung.', 'Редакция проверяет каждое сообщение.', 'Редакция ар бир кабарды текшерет.'],
  ['der', 'Leser', 'Leser', 'читатель', 'окурман', 'Viele Leser schreiben der Zeitung.', 'Многие читатели пишут в газету.', 'Көптөгөн окурмандар гезитке жазышат.'],
  ['die', 'Tatsache', 'Tatsachen', 'факт', 'чындык, факт', 'Eine Tatsache kann man prüfen.', 'Факт можно проверить.', 'Фактыны текшерүүгө болот.'],
  ['das', 'Gerücht', 'Gerüchte', 'слух', 'имиш-аякта сөз', 'Dieses Gerücht habe ich nur im Chat gelesen.', 'Этот слух я прочитал только в чате.', 'Бул имиш сөздү мен чатта гана окудум.'],
  ['die', 'Werbung', '', 'реклама', 'жарнама', 'Im Internet sehe ich viel Werbung.', 'В интернете я вижу много рекламы.', 'Интернетте мен көп жарнама көрөм.'],
  // Daten und Technik
  ['der', 'Datenschutz', '', 'защита данных', 'маалыматты коргоо', 'Datenschutz ist im Internet sehr wichtig.', 'Защита данных в интернете очень важна.', 'Интернетте маалыматты коргоо абдан маанилүү.'],
  ['das', 'Passwort', 'Passwörter', 'пароль', 'сыр сөз (пароль)', 'Ein gutes Passwort ist lang und schwer zu raten.', 'Хороший пароль длинный, и его трудно угадать.', 'Жакшы сыр сөз узун жана аны табуу кыйын.'],
  ['der', 'Nutzer', 'Nutzer', 'пользователь', 'колдонуучу', 'Viele Nutzer teilen private Fotos.', 'Многие пользователи делятся личными фотографиями.', 'Көптөгөн колдонуучулар жеке сүрөттөрүн бөлүшөт.'],
  ['das', 'Konto', 'Konten', 'учётная запись, счёт', 'эсеп (аккаунт)', 'Ich habe mein Konto mit einem neuen Passwort geschützt.', 'Я защитил свою учётную запись новым паролем.', 'Мен эсебимди жаңы сыр сөз менен коргодум.'],
  ['das', 'Netzwerk', 'Netzwerke', 'сеть (социальная сеть)', 'тармак (социалдык тармак)', 'In welchem Netzwerk bist du aktiv?', 'В какой социальной сети ты активен?', 'Сен кайсы социалдык тармакта активдүүсүң?'],
  ['der', 'Bildschirm', 'Bildschirme', 'экран, монитор', 'көрсөткүч (экран)', 'Der Bildschirm ist gesprungen.', 'Экран треснул.', 'Экран жарака кетти.'],
  ['der', 'Akku', 'Akkus', 'аккумулятор (батарея телефона)', 'телефондун батареясы', 'Der Akku ist nach zwei Stunden leer.', 'Аккумулятор разряжается через два часа.', 'Батарея эки сааттан кийин бүтөт.'],
  ['der', 'Kundendienst', '', 'служба поддержки клиентов', 'кардарларга тейлөө кызматы', 'Der Kundendienst hat mir per E-Mail geantwortet.', 'Служба поддержки ответила мне по электронной почте.', 'Тейлөө кызматы мага электрондук почта аркылуу жооп берди.'],
  // Buch und Film
  ['die', 'Handlung', 'Handlungen', 'сюжет, фабула', 'сюжет, окуянын жүрүшү', 'Die Handlung ist einfach, aber spannend.', 'Сюжет простой, но увлекательный.', 'Сюжет жөнөкөй, бирок кызыктуу.'],
  ['die', 'Hauptfigur', 'Hauptfiguren', 'главный герой', 'башкы каарман', 'Die Hauptfigur im Buch heißt Anna.', 'Главную героиню книги зовут Анна.', 'Китептеги башкы каарманды Анна деп аташат.'],
  ['die', 'Spannung', '', 'напряжение, интрига', 'тымызын кызыгуу, чыңалуу', 'Der Film hat viel Spannung.', 'В фильме много напряжения.', 'Тасмада чыңалуу көп.'],
  ['der', 'Schauspieler', 'Schauspieler', 'актёр', 'ойноочу, артист', 'Der Schauspieler spielt einen Lehrer.', 'Актёр играет учителя.', 'Артист мугалимди ойнойт.'],
  // Adjektive
  ['a', 'glaubwürdig', '', 'достоверный, заслуживающий доверия', 'ишенимге татыктуу, ишенимдүү', 'Diese Quelle ist nicht glaubwürdig.', 'Этот источник не заслуживает доверия.', 'Бул булак ишенимдүү эмес.'],
  ['a', 'aktuell', '', 'актуальный, свежий', 'азыркы, жаңы', 'Ich lese gern aktuelle Nachrichten.', 'Я люблю читать свежие новости.', 'Мен жаңы жаңылыктарды окугандан ырахат алам.'],
  ['a', 'digital', '', 'цифровой', 'санарип', 'Ich lese die Zeitung digital.', 'Я читаю газету в цифровом виде.', 'Мен гезитти санарип түрдө окуйм.'],
  ['a', 'unseriös', '', 'несерьёзный, сомнительный', 'ишеничсиз, шектүү', 'Die Webseite wirkt unseriös.', 'Сайт выглядит сомнительно.', 'Сайт шектүү көрүнөт.'],
  ['a', 'kostenlos', '', 'бесплатный', 'акысыз', 'Das Update ist kostenlos.', 'Обновление бесплатное.', 'Жаңыртуу акысыз.'],
  ['a', 'kritisch', '', 'критический, критичный', 'сын көз менен, сынчыл', 'Man sollte Nachrichten kritisch lesen.', 'Новости нужно читать критически.', 'Жаңылыктарды сын көз менен окуу керек.'],
  ['a', 'verfügbar', '', 'доступный, имеющийся', 'жеткиликтүү', 'Die App ist nicht mehr verfügbar.', 'Приложение больше недоступно.', 'Тиркеме мындан ары жеткиликтүү эмес.'],
  ['a', 'vertraulich', '', 'конфиденциальный', 'купуя', 'Das sind vertrauliche Daten.', 'Это конфиденциальные данные.', 'Булар купуя маалыматтар.'],
  // Verben
  ['v', 'veröffentlichen', '', 'опубликовать', 'жарыялоо', 'Die Zeitung will den Bericht morgen veröffentlichen.', 'Газета хочет опубликовать репортаж завтра.', 'Гезит репортажды эртең жарыялагысы келет.'],
  ['v', 'berichten', '', 'сообщать (о событии)', 'кабарлоо, билдирүү (окуя жөнүндө)', 'Die Zeitung berichtet heute aus der Stadt.', 'Сегодня газета сообщает новости из города.', 'Бүгүн гезит шаардан кабарлап жатат.'],
  ['v', 'bewerten', '', 'оценивать', 'баалоо', 'Viele Nutzer bewerten den Film mit fünf Sternen.', 'Многие пользователи оценивают фильм на пять звёзд.', 'Көптөгөн колдонуучулар тасманы беш жылдыз менен баалашат.'],
  ['v', 'aktualisieren', '', 'обновить', 'жаңыртуу', 'Ich muss die App aktualisieren.', 'Мне нужно обновить приложение.', 'Мен тиркемени жаңыртышым керек.'],
  ['v', 'speichern', '', 'сохранять', 'сактоо', 'Bitte speichern Sie die Datei.', 'Пожалуйста, сохраните файл.', 'Сураныч, файлды сактаңыз.'],
  ['v', 'löschen', '', 'удалять', 'өчүрүү', 'Ich möchte das alte Foto löschen.', 'Я хочу удалить старую фотографию.', 'Мен эски сүрөттү өчүргүм келет.'],
  ['v', 'überprüfen', '', 'проверять', 'текшерүү', 'Man sollte jede Information überprüfen.', 'Каждую информацию нужно проверять.', 'Ар бир маалыматты текшерүү керек.'],
  ['v', 'verbreiten', '', 'распространять', 'таратуу', 'Manche Leute verbreiten Gerüchte im Netz.', 'Некоторые люди распространяют слухи в сети.', 'Айрым адамдар тармакта имиш-аякты таратышат.'],
  ['v', 'abonnieren', '', 'подписаться', 'жазылуу', 'Ich möchte diesen Kanal abonnieren.', 'Я хочу подписаться на этот канал.', 'Мен бул каналга жазылгым келет.'],
  ['v', 'installieren', '', 'установить (программу)', 'орнотуу (программаны)', 'Ich muss das Programm neu installieren.', 'Мне нужно заново установить программу.', 'Мен программаны кайра орнотушум керек.'],
]

const posOf = (k: string): PartOfSpeech =>
  k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : k === 'x' ? 'other' : 'adj'

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v26-${i + 1}`,
    unit: 26,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in A1, A2 and Units 21–25. */
export const UNIT_26_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
