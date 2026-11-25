import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 31 vocabulary — Behörden, Verträge und Alltagsprobleme (B1). 40 NEW productive items (target 38–42), none of them an A1/A2 or earlier B1 headword
 * (legacy rule: cross-level lemma repeats are rejected by `b1-vocab-repeats-earlier-level`; v2 Units 301–336 allow reuse across units/levels and reject only same-unit duplicates — see `docs/b1/B1_ID_CONVENTIONS.md`). Themes: Behörde und Verfahren (Behörde, Bescheid, Zuständigkeit, Sachbearbeiter, Aktenzeichen, Nachweis,
 * Vollmacht, Genehmigung, Rückfrage, Ansprechpartner, Anlage, Betreff …) · Vertrag und Anbieter (Laufzeit, Vertragsbedingung, Anbieter, Tarif, Mahnung, Zahlungsfrist, Anliegen) ·
 * Schaden und Polizei (Schaden, Versicherung, Polizei, Zeuge, Diebstahl, melden) · Verben und Adjektive des formellen Umgangs. The established administrative words of A2 Unit 19 and of
 * Units 22–27 (Amt, Antrag, Formular, Frist, Unterlagen, Widerspruch, Vertrag, Kündigung, Anzeige, Termin, Gebühr, einreichen, verlängern, vereinbaren …) are REUSED in the texts as
 * revision but not listed again. Wortbildung strand: Kompositum (Aktenzeichen, Sachbearbeiter, Zahlungsfrist, Ansprechpartner, Vertragsbedingung), -er (Anbieter, Sachbearbeiter),
 * -ung (Bestätigung, Genehmigung, Versicherung, Zuständigkeit), -ig / -lich adjectives (zuständig, vollständig, verbindlich, erforderlich), un- (unvollständig).
 * Every office, provider, document and number in the example sentences is fictional; no entry states a legal rule. Russian and Kyrgyz are written independently; the Kyrgyz is an
 * AI-assisted FIRST DRAFT that has not been reviewed by a native speaker.
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb · a adjective
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Behörde und Verfahren
  ['die', 'Behörde', 'Behörden', 'государственное учреждение, ведомство', 'мамлекеттик мекеме, ведомство', 'Die Behörde im Beispiel schickt einen Brief mit einer Frist.', 'Учреждение из примера присылает письмо со сроком.', 'Мисалдагы мекеме мөөнөтү бар кат жиберет.'],
  ['der', 'Bescheid', 'Bescheide', 'решение, уведомление (от учреждения)', 'мекеменин чечими, кабарламасы', 'Im Bescheid steht, ob der Antrag angenommen wird.', 'В уведомлении написано, принимается ли заявление.', 'Кабарламада арыз кабыл алынабы же жокпу, жазылат.'],
  ['die', 'Zuständigkeit', 'Zuständigkeiten', 'компетенция, подведомственность', 'ыйгарым укук, караштуулук', 'Die Zuständigkeit steht auf der Internetseite vom Amt.', 'Подведомственность указана на сайте ведомства.', 'Караштуулук мекеменин сайтында көрсөтүлгөн.'],
  ['der', 'Sachbearbeiter', 'Sachbearbeiter', 'сотрудник, ведущий дело', 'иш жүргүзүүчү кызматкер', 'Der Sachbearbeiter ruft Sie morgen zurück.', 'Сотрудник, ведущий ваше дело, перезвонит вам завтра.', 'Иш жүргүзүүчү кызматкер сизге эртең кайра чалат.'],
  ['das', 'Aktenzeichen', 'Aktenzeichen', 'номер дела', 'иштин номери', 'Bitte nennen Sie immer das Aktenzeichen aus dem Schreiben.', 'Пожалуйста, всегда называйте номер дела из письма.', 'Сураныч, каттагы иштин номерин дайыма атаңыз.'],
  ['die', 'Bestätigung', 'Bestätigungen', 'подтверждение', 'ырастоо', 'Ich bitte um eine schriftliche Bestätigung.', 'Прошу письменное подтверждение.', 'Жазуу жүзүндөгү ырастоону сурайм.'],
  ['der', 'Nachweis', 'Nachweise', 'подтверждающий документ, доказательство', 'тастыктоочу документ, далил', 'Als Nachweis genügt eine Kopie.', 'В качестве подтверждения достаточно копии.', 'Тастыктоочу документ катары көчүрмө жетиштүү.'],
  ['die', 'Vollmacht', 'Vollmachten', 'доверенность', 'ишеним кат', 'Mit einer Vollmacht kann Ihr Freund den Brief abholen.', 'С доверенностью ваш друг может забрать письмо.', 'Ишеним кат менен досуңуз катты ала алат.'],
  ['die', 'Genehmigung', 'Genehmigungen', 'разрешение', 'уруксат', 'Die Genehmigung kommt per Post.', 'Разрешение приходит по почте.', 'Уруксат почта аркылуу келет.'],
  ['die', 'Rückfrage', 'Rückfragen', 'уточняющий вопрос', 'тактоочу суроо', 'Bei Rückfragen rufen Sie bitte an.', 'При уточняющих вопросах, пожалуйста, звоните.', 'Тактоочу суроолор болсо, сураныч, чалыңыз.'],
  ['der', 'Ansprechpartner', 'Ansprechpartner', 'контактное лицо', 'байланыш үчүн жооптуу адам', 'Herr Wolf ist Ihr Ansprechpartner.', 'Господин Вольф — ваше контактное лицо.', 'Вольф мырза — сиздин байланыш адамыңыз.'],
  ['die', 'Anlage', 'Anlagen', 'приложение (к письму)', 'тиркеме (каттагы)', 'Die Anlage enthält ein Formular.', 'В приложении находится бланк.', 'Тиркемеде бланк бар.'],
  ['der', 'Betreff', 'Betreffe', 'тема письма', 'каттын темасы', 'Schreiben Sie im Betreff das Aktenzeichen.', 'Напишите в теме письма номер дела.', 'Каттын темасына иштин номерин жазыңыз.'],
  // Vertrag und Anbieter
  ['die', 'Laufzeit', 'Laufzeiten', 'срок действия (договора)', 'келишимдин мөөнөтү', 'Der Vertrag hat eine Laufzeit von zwölf Monaten.', 'У договора срок действия двенадцать месяцев.', 'Келишимдин мөөнөтү он эки ай.'],
  ['die', 'Vertragsbedingung', 'Vertragsbedingungen', 'условие договора', 'келишимдин шарты', 'In den Vertragsbedingungen steht die Kündigungsfrist.', 'В условиях договора указан срок расторжения.', 'Келишимдин шарттарында бузуу мөөнөтү жазылган.'],
  ['der', 'Anbieter', 'Anbieter', 'поставщик услуг, оператор', 'кызмат көрсөтүүчү, оператор', 'Der Anbieter schreibt, dass der Preis gleich bleibt.', 'Оператор пишет, что цена остаётся прежней.', 'Оператор бааны өзгөрбөйт деп жазат.'],
  ['der', 'Tarif', 'Tarife', 'тариф', 'тариф (баа)', 'Mein Tarif ist nicht sehr teuer.', 'Мой тариф не очень дорогой.', 'Менин тарифим өтө кымбат эмес.'],
  ['die', 'Mahnung', 'Mahnungen', 'напоминание об оплате', 'төлөө жөнүндө эскертүү', 'Die Mahnung kam, obwohl ich schon bezahlt hatte.', 'Напоминание пришло, хотя я уже заплатил.', 'Мен төлөп койгонумда эскертүү келди.'],
  ['die', 'Zahlungsfrist', 'Zahlungsfristen', 'срок оплаты', 'төлөө мөөнөтү', 'Die Zahlungsfrist endet laut Rechnung am Monatsende.', 'Срок оплаты заканчивается, согласно счёту, в конце месяца.', 'Төлөө мөөнөтү эсеп боюнча айдын аягында бүтөт.'],
  ['das', 'Anliegen', 'Anliegen', 'просьба, дело, обращение', 'өтүнүч, маселе', 'Wie kann ich Ihnen bei Ihrem Anliegen helfen?', 'Чем я могу помочь вам по вашему вопросу?', 'Сиздин маселеңиз боюнча сизге кантип жардам бере алам?'],
  // Schaden und Polizei
  ['der', 'Schaden', 'Schäden', 'ущерб, повреждение', 'зыян, бузулуу', 'Der Schaden am Fahrrad ist klein.', 'Повреждение велосипеда небольшое.', 'Велосипеддеги бузулуу кичинекей.'],
  ['die', 'Versicherung', 'Versicherungen', 'страховка, страховая компания', 'камсыздандыруу, камсыздандыруу компаниясы', 'Meine Versicherung zahlt den Schaden vielleicht.', 'Моя страховая, возможно, оплатит ущерб.', 'Менин камсыздандыруум зыянды балким төлөйт.'],
  ['die', 'Polizei', '', 'полиция', 'полиция (укук коргоо)', 'Ich gehe zur Polizei und melde den Diebstahl.', 'Я иду в полицию и сообщаю о краже.', 'Мен полицияга барып, уурдалганын билдирем.'],
  ['der', 'Zeuge', 'Zeugen', 'свидетель', 'күбө', 'Ein Zeuge hat den Mann gesehen.', 'Свидетель видел этого мужчину.', 'Күбө ал адамды көргөн.'],
  ['der', 'Diebstahl', 'Diebstähle', 'кража', 'уурулук', 'Nach dem Diebstahl schreibe ich einen Bericht.', 'После кражи я пишу заявление.', 'Уурулуктан кийин мен билдирүү жазам.'],
  // Verben
  ['v', 'beantragen', '', 'подавать ходатайство, запрашивать (официально)', 'расмий түрдө сураныч берүү', 'Sie können den Termin online beantragen.', 'Вы можете запросить приём онлайн.', 'Сиз кабыл алууга онлайн жазыла аласыз.'],
  ['v', 'mitteilen', '', 'сообщать (официально)', 'билдирүү (расмий)', 'Bitte teilen Sie uns die neue Adresse mit.', 'Пожалуйста, сообщите нам новый адрес.', 'Сураныч, бизге жаңы дарегиңизди билдириңиз.'],
  ['v', 'nachreichen', '', 'представить позже (документ)', 'кийинчерээк тапшыруу (документти)', 'Den Nachweis kann ich morgen nachreichen.', 'Подтверждение я могу представить завтра.', 'Тастыктоочу документти мен эртең тапшыра алам.'],
  ['v', 'bearbeiten', '', 'обрабатывать, рассматривать', 'иштетүү, карап чыгуу', 'Der Antrag wird in der Reihenfolge bearbeitet.', 'Заявления рассматриваются по очереди.', 'Арыздар кезегине жараша каралат.'],
  ['v', 'genehmigen', '', 'одобрять, разрешать', 'уруксат берүү, жактыруу', 'Das Amt hat den Antrag genehmigt.', 'Ведомство одобрило заявление.', 'Мекеме арызга уруксат берди.'],
  ['v', 'bestätigen', '', 'подтверждать', 'ырастоо', 'Können Sie mir den Termin bestätigen?', 'Можете подтвердить мне приём?', 'Кабыл алуунун убактысын мага ырастай аласызбы?'],
  ['v', 'beachten', '', 'учитывать, соблюдать внимание', 'эске алуу, көңүл буруу', 'Bitte beachten Sie die Öffnungszeiten.', 'Пожалуйста, учитывайте часы работы.', 'Сураныч, иштөө убактысын эске алыңыз.'],
  ['v', 'einhalten', '', 'соблюдать (срок, правило)', 'сактоо (мөөнөттү, эрежени)', 'Die Frist muss man einhalten.', 'Срок нужно соблюдать.', 'Мөөнөттү сактоо керек.'],
  ['v', 'vorlegen', '', 'предъявлять, предоставлять на рассмотрение', 'көрсөтүү, караш үчүн берүү', 'Bitte legen Sie Ihren Ausweis vor.', 'Пожалуйста, предъявите ваше удостоверение.', 'Сураныч, күбөлүгүңүздү көрсөтүңүз.'],
  ['v', 'melden', '', 'сообщать, заявлять (о происшествии)', 'билдирүү, кабарлоо (окуя жөнүндө)', 'Wo kann ich den Schaden melden?', 'Где я могу сообщить об ущербе?', 'Зыян жөнүндө кайда билдирсем болот?'],
  // Adjektive
  ['a', 'zuständig', '', 'компетентный, ответственный (за вопрос)', 'жооптуу, караштуу', 'Für diese Frage ist ein anderes Amt zuständig.', 'За этот вопрос отвечает другое ведомство.', 'Бул суроо боюнча башка мекеме жооптуу.'],
  ['a', 'vollständig', '', 'полный, комплектный', 'толук, комплекттүү', 'Die Unterlagen sind vollständig.', 'Документы полные.', 'Документтер толук.'],
  ['a', 'unvollständig', '', 'неполный', 'толук эмес', 'Der Antrag ist leider unvollständig.', 'Заявление, к сожалению, неполное.', 'Арыз, тилекке каршы, толук эмес.'],
  ['a', 'verbindlich', '', 'обязательный, обязывающий', 'милдеттүү, байланыштуу', 'Die Anmeldung ist erst nach der Bestätigung verbindlich.', 'Регистрация становится обязательной только после подтверждения.', 'Каттоо ырастоодон кийин гана милдеттүү болот.'],
  ['a', 'erforderlich', '', 'необходимый, требуемый', 'зарыл, талап кылынган', 'Eine Kopie ist erforderlich.', 'Копия необходима.', 'Көчүрмө талап кылынат.'],
]

const posOf = (k: string): PartOfSpeech =>
  k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : k === 'x' ? 'other' : 'adj'

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v31-${i + 1}`,
    unit: 31,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in A1, A2 and Units 21–30. */
export const UNIT_31_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
