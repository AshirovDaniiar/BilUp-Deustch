import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 30 vocabulary — Gesellschaft, Zusammenleben und Engagement (B1). 40 NEW productive items (target 38–42), none of them an A1/A2 or earlier B1 headword
 * (legacy rule: cross-level lemma repeats are rejected by `b1-vocab-repeats-earlier-level`; v2 Units 301–336 allow reuse across units/levels and reject only same-unit duplicates — see `docs/b1/B1_ID_CONVENTIONS.md`). Themes: Ehrenamt und Verein (Ehrenamt, Mitglied, Vorstand, Spende, Initiative, Engagement …) · Zusammenleben
 * (Gemeinschaft, Vielfalt, Toleranz, Zusammenhalt, Integration, Gleichberechtigung, Generation, Familienmodell, Stadtteil, Anwohner …) · Verben des Engagements ·
 * Personenbeschreibung (Charakter und Aussehen). The established society words of Unit 22 (Gesellschaft, Mehrheit, Minderheit, Vorurteil, gerecht, diskutieren, unterstützen),
 * of A2 (Verein, Nachbarschaft, Spielplatz, Veranstaltung, organisieren, abstimmen, vorschlagen, hilfsbereit, zuverlässig) and of Units 23, 25 and 29 (Aufgabe, rücksichtsvoll,
 * Unterschied, Kultur) are REUSED in the texts as revision but not listed again. The 20 Nomen-Verb-Verbindungen of the unit are GRAMMAR (a closed list), not vocabulary items;
 * their nouns that are not yet known (Rücksicht, Beitrag, Unterstützung) are vocabulary items. Wortbildung strand: Kompositum (Nachbarschaftshilfe, Familienmodell, Treffpunkt,
 * Stadtteil), -schaft (Gemeinschaft), -keit is not needed here; -lich / -ig adjectives (ehrenamtlich, freiwillig), -ung (Versammlung, Unterstützung). Every association,
 * neighbourhood and person is fictional, and no entry states a fact about a social group. Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted
 * FIRST DRAFT that has not been reviewed by a native speaker.
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb · a adjective
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Ehrenamt und Verein
  ['das', 'Ehrenamt', 'Ehrenämter', 'общественная (добровольная) работа', 'коомдук (ыктыярдуу) иш', 'Sie macht ein Ehrenamt im Stadtteil und bekommt dafür kein Geld.', 'Она занимается общественной работой в районе и не получает за это денег.', 'Ал райондо коомдук иш кылат жана ал үчүн акча албайт.'],
  ['das', 'Mitglied', 'Mitglieder', 'член (организации)', 'мүчө (уюмдун)', 'Der Verein hat über hundert Mitglieder.', 'В объединении больше ста членов.', 'Бирикмеде жүздөн ашык мүчө бар.'],
  ['der', 'Vorstand', 'Vorstände', 'правление', 'башкарма', 'Der Vorstand trifft sich einmal im Monat.', 'Правление собирается раз в месяц.', 'Башкарма айына бир жолу чогулат.'],
  ['die', 'Spende', 'Spenden', 'пожертвование', 'кайрымдуулук, жардам акча', 'Für das Fest brauchen wir noch Spenden.', 'Для праздника нам ещё нужны пожертвования.', 'Майрам үчүн бизге дагы кайрымдуулук акча керек.'],
  ['die', 'Initiative', 'Initiativen', 'инициатива, инициативная группа', 'демилге, демилгелүү топ', 'Die Initiative möchte einen Treffpunkt für alle Generationen schaffen.', 'Инициативная группа хочет создать место встреч для всех поколений.', 'Демилгелүү топ бардык муундар үчүн жолугушуу жайын түзгүсү келет.'],
  ['das', 'Engagement', '', 'активное участие, вовлечённость', 'активдүү катышуу, берилгендик', 'Mit viel Engagement bauen die Nachbarn den Garten auf.', 'С большой вовлечённостью соседи создают сад.', 'Чоң берилгендик менен кошуналар бакты түзүп жатышат.'],
  ['die', 'Versammlung', 'Versammlungen', 'собрание', 'чогулуш', 'Die Versammlung beginnt um 19 Uhr im Gemeindehaus.', 'Собрание начинается в 19 часов в общинном доме.', 'Чогулуш саат 19да жамаат үйүндө башталат.'],
  ['der', 'Treffpunkt', 'Treffpunkte', 'место встреч', 'жолугушуу жайы', 'Der Platz ist ein beliebter Treffpunkt für Nachbarn.', 'Площадь — любимое место встреч соседей.', 'Аянт кошуналардын жактырган жолугушуу жайы.'],
  ['der', 'Stadtteil', 'Stadtteile', 'район города', 'шаардын району', 'In unserem Stadtteil wohnen viele junge Familien.', 'В нашем районе живёт много молодых семей.', 'Биздин райондо жаш үй-бүлөлөр көп жашайт.'],
  ['der', 'Anwohner', 'Anwohner', 'житель (ближайших домов)', 'жакын жердин тургуну', 'Die Anwohner sprechen über den Verkehr in der Straße.', 'Жители обсуждают движение на улице.', 'Тургундар көчөдөгү кыймыл жөнүндө сүйлөшүп жатышат.'],
  ['die', 'Nachbarschaftshilfe', '', 'помощь соседей', 'кошуналардын өз ара жардамы', 'Die Nachbarschaftshilfe bringt älteren Menschen das Essen.', 'Помощь соседей приносит пожилым людям еду.', 'Кошуналардын жардамы улгайган адамдарга тамак алып барат.'],
  // Zusammenleben
  ['die', 'Gemeinschaft', 'Gemeinschaften', 'сообщество, общность', 'жамаат, бирдикте болуу', 'In einer Gemeinschaft hilft man sich gegenseitig.', 'В сообществе люди помогают друг другу.', 'Жамаатта адамдар бири-бирине жардам берет.'],
  ['die', 'Vielfalt', '', 'разнообразие', 'ар түрдүүлүк', 'Die Vielfalt macht unser Viertel lebendig.', 'Разнообразие делает наш квартал живым.', 'Ар түрдүүлүк кварталыбызды жандуу кылат.'],
  ['die', 'Toleranz', '', 'терпимость', 'чыдамкайлык, сабырдуулук', 'Toleranz bedeutet, andere Meinungen auszuhalten.', 'Терпимость означает выдерживать другие мнения.', 'Сабырдуулук башка пикирлерге чыдай билүүнү билдирет.'],
  ['die', 'Solidarität', '', 'солидарность', 'ынтымак, бири-бирин колдоо', 'In schwierigen Zeiten zeigen viele Menschen Solidarität.', 'В трудные времена многие люди проявляют солидарность.', 'Кыйын мезгилдерде көптөгөн адамдар ынтымак көрсөтөт.'],
  ['der', 'Zusammenhalt', '', 'сплочённость', 'бириктүүлүк', 'Ein starker Zusammenhalt hilft in schwierigen Zeiten.', 'Сильная сплочённость помогает в трудные времена.', 'Күчтүү бириктүүлүк кыйын мезгилдерде жардам берет.'],
  ['die', 'Integration', '', 'интеграция', 'интеграция, коомго кошулуу', 'Integration braucht Zeit und Kontakt zwischen den Menschen.', 'Интеграции нужны время и контакты между людьми.', 'Интеграцияга убакыт жана адамдардын ортосундагы байланыш керек.'],
  ['die', 'Gleichberechtigung', '', 'равноправие', 'укуктардын теңдиги', 'Gleichberechtigung ist ein wichtiges Thema in vielen Vereinen.', 'Равноправие — важная тема во многих объединениях.', 'Укуктардын теңдиги көптөгөн бирикмелерде маанилүү тема.'],
  ['die', 'Generation', 'Generationen', 'поколение', 'муун', 'Drei Generationen leben in einem Haus.', 'Три поколения живут в одном доме.', 'Үч муун бир үйдө жашайт.'],
  ['das', 'Familienmodell', 'Familienmodelle', 'модель семьи', 'үй-бүлө үлгүсү', 'Es gibt viele verschiedene Familienmodelle.', 'Существует много разных моделей семьи.', 'Үй-бүлөнүн көптөгөн ар кандай үлгүлөрү бар.'],
  ['die', 'Rücksicht', '', 'уважение к другим, учёт интересов', 'башкалардын кызыкчылыгын эске алуу', 'Im Haus brauchen wir etwas Rücksicht aufeinander.', 'В доме нам нужно немного учитывать друг друга.', 'Үйдө бизге бири-бирибизди бир аз эске алуу керек.'],
  ['der', 'Beitrag', 'Beiträge', 'вклад; взнос', 'салым; жардам', 'Jeder Beitrag zählt, auch ein kleiner.', 'Каждый вклад важен, даже маленький.', 'Ар бир салым маанилүү, кичинекей болсо да.'],
  ['die', 'Unterstützung', '', 'поддержка', 'колдоо', 'Wir suchen Unterstützung für unser Projekt.', 'Мы ищем поддержку для нашего проекта.', 'Биз долбообуз үчүн колдоо издеп жатабыз.'],
  // Verben des Engagements
  ['v', 'sich engagieren', '', 'активно участвовать, быть вовлечённым', 'активдүү катышуу', 'Viele Menschen engagieren sich in ihrer Freizeit.', 'Многие люди активно участвуют в свободное время.', 'Көптөгөн адамдар бош убактысында активдүү катышат.'],
  ['v', 'spenden', '', 'жертвовать', 'кайрымдуулук кылуу', 'Viele Nachbarn spenden Kleidung und Bücher.', 'Многие соседи жертвуют одежду и книги.', 'Көптөгөн кошуналар кийим жана китеп берет.'],
  ['v', 'sich beteiligen', '', 'принимать участие', 'катышуу', 'Alle dürfen sich an der Planung beteiligen.', 'Все могут принять участие в планировании.', 'Баары пландоого катыша алат.'],
  ['v', 'integrieren', '', 'интегрировать, включать', 'интеграциялоо, камтуу', 'Der Verein möchte neue Nachbarn integrieren.', 'Объединение хочет включить новых соседей.', 'Бирикме жаңы кошуналарды камтууну каалайт.'],
  ['v', 'gründen', '', 'основывать', 'түзүү, негиздөө', 'Wir möchten einen Verein gründen.', 'Мы хотим основать объединение.', 'Биз бирикме түзгүбүз келет.'],
  ['v', 'mitmachen', '', 'участвовать вместе со всеми', 'бирге катышуу', 'Wer macht beim Aufräumen mit?', 'Кто участвует в уборке?', 'Тазалоого ким катышат?'],
  ['v', 'akzeptieren', '', 'принимать, признавать', 'кабыл алуу, макул болуу', 'Man muss nicht alles gut finden, aber man kann es akzeptieren.', 'Не нужно считать всё хорошим, но можно это принять.', 'Баарын жакшы деп эсептөөнүн кереги жок, бирок муну кабыл алууга болот.'],
  // Charakter und Aussehen (Personenbeschreibung)
  ['a', 'ehrenamtlich', '', 'общественный, на добровольных началах', 'коомдук, ыктыярдуу негизде', 'Die Trainerin arbeitet ehrenamtlich.', 'Тренер работает на добровольных началах.', 'Машыктыруучу ыктыярдуу негизде иштейт.'],
  ['a', 'freiwillig', '', 'добровольный', 'ыктыярдуу', 'Die Hilfe ist freiwillig, niemand muss mitmachen.', 'Помощь добровольная, никто не обязан участвовать.', 'Жардам ыктыярдуу, эч ким катышууга милдеттүү эмес.'],
  ['a', 'sozial', '', 'социальный, общественный', 'социалдык, коомдук', 'Er hat einen sozialen Beruf gewählt.', 'Он выбрал социальную профессию.', 'Ал социалдык кесип тандады.'],
  ['a', 'tolerant', '', 'терпимый', 'чыдамкай', 'Meine Nachbarin ist sehr tolerant gegenüber anderen Meinungen.', 'Моя соседка очень терпима к другим мнениям.', 'Менин кошуна эжем башка пикирлерге абдан чыдамкай.'],
  ['a', 'aufgeschlossen', '', 'открытый (к людям и новому)', 'ачык (адамдарга жана жаңылыкка)', 'Der neue Nachbar ist freundlich und aufgeschlossen.', 'Новый сосед дружелюбный и открытый.', 'Жаңы кошуна достук жана ачык мүнөздүү.'],
  ['a', 'großzügig', '', 'щедрый', 'берешен', 'Die Familie war großzügig und hat viel gespendet.', 'Семья была щедрой и много пожертвовала.', 'Үй-бүлө берешен болуп, көп кайрымдуулук кылды.'],
  ['a', 'humorvoll', '', 'с чувством юмора', 'тамашакеч, юмору бар', 'Der Vorsitzende ist ein humorvoller Mann mit grauen Haaren.', 'Председатель — человек с чувством юмора и седыми волосами.', 'Төрага — тамашакеч, чачы агарган адам.'],
  ['a', 'schüchtern', '', 'застенчивый', 'уялчаак', 'Am Anfang war sie schüchtern, jetzt spricht sie vor der Gruppe.', 'Сначала она была застенчивой, теперь выступает перед группой.', 'Алгач ал уялчаак эле, азыр топтун алдында сүйлөйт.'],
  ['a', 'schlank', '', 'стройный', 'ичке, шыңга', 'Die Leiterin ist groß und schlank.', 'Руководительница высокая и стройная.', 'Жетекчи узун жана ичке.'],
  ['a', 'kräftig', '', 'крепкий, сильный (о телосложении)', 'бекем, тың (дене түзүлүшү)', 'Zwei kräftige Helfer tragen die Tische.', 'Два крепких помощника несут столы.', 'Эки тың жардамчы столдорду көтөрүп барат.'],
]

const posOf = (k: string): PartOfSpeech =>
  k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : k === 'x' ? 'other' : 'adj'

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v30-${i + 1}`,
    unit: 30,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in A1, A2 and Units 21–29. */
export const UNIT_30_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
