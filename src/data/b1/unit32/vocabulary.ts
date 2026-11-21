import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 32 vocabulary — Rückblick, Bilanz und Prüfungsvorbereitung (B1). 40 NEW productive items (target 38–42), none of them an A1/A2 or earlier B1 headword (checked by the validator rule
 * `b1-vocab-repeats-earlier-level`). The themes are those of the approved curriculum for Unit 32: Bilanz und Lernweg (Bilanz, Rückblick, Lerntagebuch, Selbsteinschätzung, Lernziel,
 * Vorsatz, Lernweg, Rückschlag, Geduld, Zeitplan, zurückblicken, einschätzen, festhalten, sich vornehmen) · Aufgabenwortschatz (Teil, Lösung, Hinweis, Auswahl, Probe, Ergebnis, ankreuzen,
 * zuordnen, ergänzen is known) · Redemittel für Vortrag und Diskussion (Vortrag, Gliederung, Einleitung, Schluss, Publikum, Stichpunkt, Zusammenfassung, Einwand, Fazit, begründen,
 * erwähnen, erläutern, zusammenfassen) · Adjektive des Urteilens (deutlich, ausführlich, knapp, realistisch, zufrieden). The words that were taught earlier (Aufgabe, Stärke, Schwäche,
 * Argument, Standpunkt, Fortschritt, Ziel, Plan, Erfolg, überzeugen, zustimmen, betonen, erreichen, verbessern, motiviert, regelmäßig …) are REUSED in the texts as revision but not listed again;
 * together with the Wiederholungsblock of Units 29–31 declared in the metadata they form the revision part of the unit. Wortbildung strand: Kompositum (Lerntagebuch, Lernziel, Lernweg,
 * Zeitplan, Rückblick, Rückschlag), -ung (Zusammenfassung, Selbsteinschätzung, Gliederung), Verben mit Vorsilbe (zurückblicken, einschätzen, festhalten, zuordnen, ankreuzen).
 * Every person, course and event is fictional. Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted FIRST DRAFT that has not been reviewed by a native speaker.
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb · a adjective
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Bilanz und Lernweg
  ['die', 'Bilanz', 'Bilanzen', 'итог, подведение итогов', 'жыйынтык, жыйынтык чыгаруу', 'Am Kursende ziehe ich eine ehrliche Bilanz.', 'В конце курса я подвожу честные итоги.', 'Курстун аягында мен чынчыл жыйынтык чыгарам.'],
  ['der', 'Rückblick', 'Rückblicke', 'взгляд назад, ретроспектива', 'артка кароо, ретроспектива', 'Im Rückblick war der erste Monat am schwersten.', 'Оглядываясь назад, труднее всего был первый месяц.', 'Артка карасак, эң оор болгон биринчи ай болду.'],
  ['das', 'Lerntagebuch', 'Lerntagebücher', 'дневник обучения', 'окуу күндөлүгү', 'In mein Lerntagebuch schreibe ich jede Woche drei Sätze.', 'В свой дневник обучения я пишу каждую неделю три предложения.', 'Окуу күндөлүгүмө мен ар жума үч сүйлөм жазам.'],
  ['die', 'Selbsteinschätzung', 'Selbsteinschätzungen', 'самооценка', 'өзүн баалоо', 'Die Selbsteinschätzung hilft mir, die nächsten Schritte zu planen.', 'Самооценка помогает мне планировать следующие шаги.', 'Өзүн баалоо мага кийинки кадамдарды пландоого жардам берет.'],
  ['das', 'Lernziel', 'Lernziele', 'учебная цель', 'окуу максаты', 'Mein Lernziel für den Herbst ist ein kurzer Vortrag.', 'Моя учебная цель на осень — короткое выступление.', 'Күзгө менин окуу максатым — кыска чыгуу.'],
  ['der', 'Vorsatz', 'Vorsätze', 'намерение, зарок', 'ниет, убада', 'Mein Vorsatz ist, jeden Tag zehn Minuten zu lesen.', 'Мой зарок — читать каждый день по десять минут.', 'Менин ниетим — ар күнү он мүнөт окуу.'],
  ['der', 'Lernweg', 'Lernwege', 'путь обучения', 'окуу жолу', 'Jeder Lernweg sieht ein bisschen anders aus.', 'У каждого путь обучения выглядит немного по-своему.', 'Ар бир окуу жолу бир аз башкача көрүнөт.'],
  ['der', 'Rückschlag', 'Rückschläge', 'неудача, откат', 'ийгиликсиздик, артка кетүү', 'Nach dem Rückschlag habe ich nicht aufgegeben.', 'После неудачи я не сдался.', 'Ийгиликсиздиктен кийин мен таштаган жокмун.'],
  ['die', 'Geduld', '', 'терпение', 'сабыр', 'Für das Lernen braucht man Geduld.', 'Для учёбы нужно терпение.', 'Окуу үчүн сабыр керек.'],
  ['der', 'Zeitplan', 'Zeitpläne', 'график, расписание', 'убакыт графиги', 'Mit einem Zeitplan lerne ich ruhiger.', 'С графиком я учусь спокойнее.', 'Убакыт графиги менен мен тынчыраак окуйм.'],
  // Aufgabenwortschatz
  ['der', 'Teil', 'Teile', 'часть (задания, теста)', 'бөлүк (тапшырманын, тесттин)', 'Der erste Teil ist zum Lesen, der zweite zum Schreiben.', 'Первая часть — для чтения, вторая — для письма.', 'Биринчи бөлүк окуу үчүн, экинчиси жазуу үчүн.'],
  ['die', 'Lösung', 'Lösungen', 'решение, ответ (к заданию)', 'чечим, жооп (тапшырмага)', 'Die Lösung steht hinten im Heft.', 'Ответ указан в конце тетради.', 'Жооп дептердин аягында жазылган.'],
  ['der', 'Hinweis', 'Hinweise', 'указание, подсказка', 'көрсөтмө, кеңеш', 'Lies zuerst den Hinweis zur Aufgabe.', 'Сначала прочитай указание к заданию.', 'Адегенде тапшырмага көрсөтмөнү окуп ал.'],
  ['die', 'Auswahl', '', 'выбор, набор вариантов', 'тандоо, варианттар топтому', 'Bei jeder Frage gibt es eine Auswahl aus drei Antworten.', 'В каждом вопросе есть выбор из трёх ответов.', 'Ар бир суроодо үч жооптун тандоосу бар.'],
  ['die', 'Probe', 'Proben', 'проба, репетиция', 'сынак, даярдык', 'Die Probe vor dem Vortrag hat mir geholfen.', 'Репетиция перед выступлением мне помогла.', 'Чыгуунун алдындагы даярдык мага жардам берди.'],
  ['das', 'Ergebnis', 'Ergebnisse', 'результат', 'жыйынтык, натыйжа', 'Das Ergebnis zeigt, was ich noch wiederholen sollte.', 'Результат показывает, что мне ещё стоит повторить.', 'Жыйынтык мен дагы эмнени кайталашым керек экенин көрсөтөт.'],
  // Vortrag und Diskussion
  ['der', 'Vortrag', 'Vorträge', 'доклад, выступление', 'баяндама, чыгуу', 'Mein Vortrag dauert zwei Minuten.', 'Моё выступление длится две минуты.', 'Менин чыгуум эки мүнөткө созулат.'],
  ['die', 'Gliederung', 'Gliederungen', 'структура, план (текста)', 'түзүлүш, план (тексттин)', 'Eine klare Gliederung macht den Vortrag verständlich.', 'Чёткая структура делает выступление понятным.', 'Даана түзүлүш чыгууну түшүнүктүү кылат.'],
  ['die', 'Einleitung', 'Einleitungen', 'вступление', 'киришүү', 'In der Einleitung sage ich kurz, worum es geht.', 'Во вступлении я коротко говорю, о чём пойдёт речь.', 'Киришүүдө мен эмне жөнүндө экенин кыскача айтам.'],
  ['der', 'Schluss', 'Schlüsse', 'заключение, конец', 'жыйынтык, аягы', 'Am Schluss bedanke ich mich beim Publikum.', 'В заключение я благодарю слушателей.', 'Аягында мен угуучуларга ыраазычылык билдирем.'],
  ['das', 'Publikum', '', 'публика, слушатели', 'угуучулар, көрүүчүлөр', 'Das Publikum hat viele Fragen gestellt.', 'Слушатели задали много вопросов.', 'Угуучулар көп суроо беришти.'],
  ['der', 'Stichpunkt', 'Stichpunkte', 'опорное слово, тезис', 'тянак сөз, тезис', 'Ich schreibe drei Stichpunkte auf eine Karte.', 'Я пишу три опорных слова на карточку.', 'Мен картага үч тянак сөз жазам.'],
  ['die', 'Zusammenfassung', 'Zusammenfassungen', 'краткое изложение, резюме', 'кыскача баяндама, жыйынтык', 'Die Zusammenfassung hat nur fünf Sätze.', 'В кратком изложении всего пять предложений.', 'Кыскача баяндама беш эле сүйлөмдөн турат.'],
  ['der', 'Einwand', 'Einwände', 'возражение', 'каршы пикир', 'Auf einen Einwand antworte ich höflich.', 'На возражение я отвечаю вежливо.', 'Каршы пикирге мен сылык жооп берем.'],
  ['das', 'Fazit', 'Fazits', 'вывод, итог', 'тыянак', 'Mein Fazit ist positiv.', 'Мой вывод положительный.', 'Менин тыянагым оң.'],
  // Verben
  ['v', 'zurückblicken', '', 'оглядываться назад', 'артка кароо', 'Zum Kursende möchte ich auf das Jahr zurückblicken.', 'К концу курса я хочу оглянуться на год.', 'Курстун аягында мен жылга артка кароону каалайм.'],
  ['v', 'einschätzen', '', 'оценивать, определять', 'баалоо, аныктоо', 'Kannst du deinen Wortschatz gut einschätzen?', 'Ты можешь хорошо оценить свой словарный запас?', 'Сен өз сөз байлыгыңды жакшы баалай аласыңбы?'],
  ['v', 'festhalten', '', 'записывать, фиксировать', 'жазып коюу, бекитүү', 'Ich halte neue Wörter im Lerntagebuch fest.', 'Новые слова я записываю в дневник обучения.', 'Жаңы сөздөрдү мен окуу күндөлүгүмө жазып коём.'],
  ['v', 'sich vornehmen', '', 'намереваться, ставить себе цель', 'ниет кылуу, максат коюу', 'Ich nehme mir vor, öfter Deutsch zu sprechen.', 'Я намерен чаще говорить по-немецки.', 'Мен немисче көбүрөөк сүйлөөнү ниет кылам.'],
  ['v', 'ankreuzen', '', 'отмечать крестиком', 'белгилөө (кресттин белгиси менен)', 'Bitte kreuze die richtige Antwort an.', 'Пожалуйста, отметь правильный ответ.', 'Сураныч, туура жоопту белгиле.'],
  ['v', 'zuordnen', '', 'соотносить, сопоставлять', 'шайкеш коюу, дал келтирүү', 'Ordne jeder Überschrift den passenden Text zu.', 'Сопоставь каждому заголовку подходящий текст.', 'Ар бир аталышка ылайыктуу текстти дал келтир.'],
  ['v', 'begründen', '', 'обосновывать', 'негиздөө', 'Bitte begründe deine Meinung mit einem Beispiel.', 'Пожалуйста, обоснуй своё мнение примером.', 'Сураныч, өз пикириңди мисал менен негизде.'],
  ['v', 'erwähnen', '', 'упоминать', 'эскерүү, атап өтүү', 'Im Vortrag erwähne ich auch eine Schwierigkeit.', 'В выступлении я упоминаю и одну трудность.', 'Чыгууда мен бир кыйынчылыкты да эскерем.'],
  ['v', 'erläutern', '', 'пояснять, разъяснять', 'түшүндүрүп берүү', 'Könnten Sie das bitte kurz erläutern?', 'Не могли бы вы кратко пояснить это?', 'Муну кыскача түшүндүрүп бере аласызбы?'],
  ['v', 'zusammenfassen', '', 'резюмировать, кратко пересказать', 'кыскача айтып берүү', 'Am Ende fasse ich die wichtigsten Punkte zusammen.', 'В конце я резюмирую самые важные пункты.', 'Аягында мен эң маанилүү пункттарды кыскача айтам.'],
  // Adjektive
  ['a', 'deutlich', '', 'ясный, отчётливый', 'ачык, даана', 'Sprich bitte deutlich und nicht zu schnell.', 'Говори, пожалуйста, чётко и не слишком быстро.', 'Сураныч, даана жана өтө ылдам эмес сүйлө.'],
  ['a', 'ausführlich', '', 'подробный', 'кеңири, толук', 'Die Antwort darf ausführlich sein.', 'Ответ может быть подробным.', 'Жооп кеңири болушу мүмкүн.'],
  ['a', 'knapp', '', 'краткий; скудный', 'кыска; жетишсиз', 'Eine knappe Zusammenfassung reicht.', 'Достаточно краткого резюме.', 'Кыска жыйынтык жетиштүү.'],
  ['a', 'realistisch', '', 'реалистичный', 'реалдуу', 'Ein realistisches Ziel motiviert mehr als ein großes.', 'Реалистичная цель мотивирует больше, чем большая.', 'Реалдуу максат чоң максатка караганда көбүрөөк шыктандырат.'],
  ['a', 'zufrieden', '', 'довольный', 'ыраазы', 'Mit meinem Fortschritt bin ich zufrieden.', 'Своим прогрессом я доволен.', 'Өз жылышыма мен ыраазымын.'],
]

const posOf = (k: string): PartOfSpeech =>
  k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : k === 'x' ? 'other' : 'adj'

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v32-${i + 1}`,
    unit: 32,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in A1, A2 and Units 21–31. */
export const UNIT_32_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
