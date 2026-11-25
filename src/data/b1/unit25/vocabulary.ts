import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 25 vocabulary — Gesundheit, Beziehungen und Lebensstil (B1). 40 NEW productive items (target 38–42), none of them an A1/A2 or earlier B1 headword
 * (legacy rule: cross-level lemma repeats are rejected by `b1-vocab-repeats-earlier-level`; v2 Units 301–336 allow reuse across units/levels and reject only same-unit duplicates — see `docs/b1/B1_ID_CONVENTIONS.md`). Themes: Gesundheitssystem und Arzt · Lebensstil und Gesundheit · Beziehungen und Gefühle ·
 * Verben. A2 Unit 14 already taught the body and illness words (Kopfschmerzen, Fieber, Praxis, Tablette, Stress, sich entspannen, trainieren …); they are
 * REUSED in the texts as revision but not listed again. Wortbildung strand: Krankenkasse (Kranken + Kasse), Behandlung / Überweisung / Ernährung (-ung),
 * ungesund (un-). No verb needs a prepositional object (Unit 28). Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted FIRST DRAFT that
 * has not been reviewed by a native speaker. The health vocabulary is for language learning, not medical advice.
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb · a adjective
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Gesundheitssystem und Arzt
  ['die', 'Krankenkasse', 'Krankenkassen', 'больничная касса (медицинская страховая компания)', 'медициналык камсыздандыруу кассасы', 'Meine Krankenkasse bezahlt die Behandlung.', 'Моя больничная касса оплачивает лечение.', 'Менин медициналык камсыздандыруу кассам дарылоону төлөйт.'],
  ['der', 'Hausarzt', 'Hausärzte', 'семейный врач', 'үй-бүлөлүк дарыгер', 'Mein Hausarzt hat am Montag Sprechstunde.', 'У моего семейного врача в понедельник приём.', 'Менин үй-бүлөлүк дарыгеримдин дүйшөмбүдө кабыл алуусу бар.'],
  ['die', 'Überweisung', 'Überweisungen', 'направление (к врачу-специалисту)', 'адис дарыгерге жолдомо', 'Der Hausarzt gibt mir eine Überweisung zum Spezialisten.', 'Семейный врач выписывает мне направление к специалисту.', 'Үй-бүлөлүк дарыгер мага адис дарыгерге жолдомо берет.'],
  ['das', 'Rezept', 'Rezepte', 'рецепт (на лекарство)', 'дарыга жазылган рецепт', 'Für dieses Medikament brauchen Sie ein Rezept.', 'Для этого лекарства нужен рецепт.', 'Бул дары үчүн рецепт керек.'],
  ['die', 'Beschwerden', 'Beschwerden', 'жалобы, недомогание (мн. ч.)', 'ыңгайсыздык, ооруунун белгилери (көптүк)', 'Seit Montag habe ich Beschwerden im Rücken.', 'С понедельника у меня беспокоят боли в спине.', 'Дүйшөмбүдөн бери белим ооруп, мени кыйнап жатат.'],
  ['die', 'Behandlung', 'Behandlungen', 'лечение', 'дарылоо', 'Die Behandlung dauert zwei Wochen.', 'Лечение длится две недели.', 'Дарылоо эки жума созулат.'],
  ['die', 'Nebenwirkung', 'Nebenwirkungen', 'побочное действие', 'терс таасир', 'Dieses Medikament kann Nebenwirkungen haben.', 'У этого лекарства могут быть побочные действия.', 'Бул дарынын терс таасирлери болушу мүмкүн.'],
  ['die', 'Vorsorge', '', 'профилактика, профилактический осмотр', 'алдын алуу, профилактикалык текшерүү', 'Einmal im Jahr gehe ich zur Vorsorge.', 'Раз в год я хожу на профилактический осмотр.', 'Жылына бир жолу профилактикалык текшерүүгө барам.'],
  // Lebensstil und Gesundheit
  ['der', 'Lebensstil', 'Lebensstile', 'образ жизни', 'жашоо образы', 'Ich möchte meinen Lebensstil ändern.', 'Я хочу изменить свой образ жизни.', 'Мен жашоо образымды өзгөрткүм келет.'],
  ['die', 'Ernährung', '', 'питание', 'тамактануу', 'Eine ausgewogene Ernährung ist wichtig für die Gesundheit.', 'Сбалансированное питание важно для здоровья.', 'Тең салмактуу тамактануу ден соолук үчүн маанилүү.'],
  ['der', 'Schlaf', '', 'сон', 'уйку', 'Zu wenig Schlaf macht müde.', 'Слишком мало сна — и человек устаёт.', 'Уйку аз болсо, адам чарчайт.'],
  ['die', 'Gewohnheit', 'Gewohnheiten', 'привычка', 'адат', 'Ein Spaziergang nach dem Essen ist eine gute Gewohnheit.', 'Прогулка после еды — хорошая привычка.', 'Тамактангандан кийин сейилдөө — жакшы адат.'],
  ['der', 'Ausgleich', '', 'баланс, противовес (отдых от работы)', 'тең салмактуулук, ордун толтуруу', 'Sport ist ein guter Ausgleich zur Arbeit.', 'Спорт — хороший противовес работе.', 'Спорт — жумуштун ордун толтуруучу жакшы жол.'],
  ['die', 'Erholung', '', 'отдых, восстановление сил', 'эс алуу, күч жыйноо', 'Am Wochenende brauche ich Erholung.', 'В выходные мне нужен отдых.', 'Дем алыш күндөрү мага эс алуу керек.'],
  ['a', 'ausgeglichen', '', 'уравновешенный', 'токтоо, тынч мүнөздүү', 'Nach dem Urlaub bin ich viel ausgeglichener.', 'После отпуска я намного уравновешеннее.', 'Эс алуудан кийин мен абдан токтоо болуп калдым.'],
  ['a', 'ausgewogen', '', 'сбалансированный', 'тең салмактуу, ар түрдүү курамдуу', 'Ich esse ausgewogen: viel Gemüse und wenig Fleisch.', 'Я питаюсь сбалансированно: много овощей и мало мяса.', 'Мен тең салмактуу тамактанам: көп жашылча жана аз эт.'],
  ['a', 'ungesund', '', 'нездоровый, вредный для здоровья', 'ден соолукка зыяндуу', 'Zu viel Zucker ist ungesund.', 'Слишком много сахара вредно.', 'Өтө көп кант ден соолукка зыяндуу.'],
  ['a', 'regelmäßig', '', 'регулярный, регулярно', 'үзгүлтүксүз, дайыма', 'Ich mache regelmäßig Sport.', 'Я регулярно занимаюсь спортом.', 'Мен үзгүлтүксүз спорт менен машыгам.'],
  ['a', 'gestresst', '', 'в стрессе, напряжённый', 'стресстеги, чыңалган', 'Vor der Prüfung war ich total gestresst.', 'Перед экзаменом я был совершенно в стрессе.', 'Экзамендин алдында мен абдан стресс ичинде болдум.'],
  // Beziehungen und Gefühle
  ['die', 'Beziehung', 'Beziehungen', 'отношения', 'мамиле, байланыш', 'Eine gute Beziehung braucht Zeit und Vertrauen.', 'Хорошие отношения требуют времени и доверия.', 'Жакшы мамиле убакытты жана ишенимди талап кылат.'],
  ['die', 'Freundschaft', 'Freundschaften', 'дружба', 'достук', 'Unsere Freundschaft ist schon zehn Jahre alt.', 'Нашей дружбе уже десять лет.', 'Биздин достукка он жыл болду.'],
  ['die', 'Eifersucht', '', 'ревность', 'кызганычтуулук', 'Eifersucht kann eine Beziehung schwer machen.', 'Ревность может осложнить отношения.', 'Кызганычтуулук мамилени татаалдаштырышы мүмкүн.'],
  ['das', 'Missverständnis', 'Missverständnisse', 'недоразумение', 'түшүнбөстүк', 'Das war nur ein Missverständnis.', 'Это было просто недоразумение.', 'Бул жөн гана түшүнбөстүк болду.'],
  ['der', 'Streit', 'Streite', 'ссора', 'чатак', 'Nach dem Streit hat er mich angerufen.', 'После ссоры он мне позвонил.', 'Чатактан кийин ал мага чалды.'],
  ['der', 'Ratschlag', 'Ratschläge', 'совет', 'кеңеш', 'Danke für deinen Ratschlag.', 'Спасибо за твой совет.', 'Кеңешиң үчүн рахмат.'],
  ['das', 'Verständnis', '', 'понимание, сочувствие', 'түшүнүү, боорукерлик', 'Mein Chef hat viel Verständnis für meine Situation.', 'У моего начальника много понимания к моей ситуации.', 'Менин начальнигим абалымды абдан түшүнөт.'],
  ['der', 'Vorwurf', 'Vorwürfe', 'упрёк', 'айыптоо, күнөөлөө', 'Sein Vorwurf hat mich sehr getroffen.', 'Его упрёк сильно задел меня.', 'Анын айыптоосу мени катуу ооруттту.'],
  ['a', 'verständnisvoll', '', 'понимающий, чуткий', 'түшүнүүчү, боорукер', 'Meine Freundin ist sehr verständnisvoll.', 'Моя подруга очень чуткая.', 'Менин курбум абдан боорукер.'],
  ['a', 'rücksichtsvoll', '', 'внимательный к другим, тактичный', 'башкаларды ойлогон, этият', 'Gute Nachbarn sind rücksichtsvoll.', 'Хорошие соседи тактичны.', 'Жакшы кошуналар башкаларды ойлошот.'],
  ['a', 'einsam', '', 'одинокий', 'жалгыз калган', 'In der neuen Stadt fühle ich mich manchmal einsam.', 'В новом городе я иногда чувствую себя одиноким.', 'Жаңы шаарда мен кээде өзүмдү жалгыз сезем.'],
  // Verben
  ['v', 'sich versöhnen', '', 'помириться', 'элдешүү', 'Nach dem Streit wollen wir uns versöhnen.', 'После ссоры мы хотим помириться.', 'Чатактан кийин биз элдешкибиз келет.'],
  ['v', 'sich trennen', '', 'расстаться', 'ажырашуу', 'Meine Eltern haben sich nach vielen Jahren getrennt.', 'Мои родители расстались спустя много лет.', 'Менин ата-энем көп жылдан кийин ажырашты.'],
  ['v', 'sich beruhigen', '', 'успокоиться', 'тынчтануу', 'Nach dem Spaziergang konnte ich mich beruhigen.', 'После прогулки я смог успокоиться.', 'Сейилдегенден кийин мен тынчтана алдым.'],
  ['v', 'empfehlen', '', 'рекомендовать', 'сунуштоо', 'Ich kann dir diesen Arzt empfehlen.', 'Я могу порекомендовать тебе этого врача.', 'Мен сага бул дарыгерди сунуштай алам.'],
  ['v', 'behandeln', '', 'лечить', 'дарылоо', 'Der Hausarzt behandelt viele Patienten.', 'Семейный врач лечит многих пациентов.', 'Үй-бүлөлүк дарыгер көп бейтапты дарылайт.'],
  ['v', 'verschreiben', '', 'выписывать (лекарство)', 'рецепт жазып берүү', 'Die Ärztin kann Ihnen ein Medikament verschreiben.', 'Врач может выписать вам лекарство.', 'Дарыгер сизге дары жазып бере алат.'],
  ['v', 'vorbeugen', '', 'предотвращать', 'алдын алуу', 'Sport kann vielen Krankheiten vorbeugen.', 'Спорт может предотвратить многие болезни.', 'Спорт көп ооруулардын алдын алышы мүмкүн.'],
  ['v', 'sich ernähren', '', 'питаться', 'тамактануу (өзүн)', 'Ich möchte mich gesünder ernähren.', 'Я хочу питаться здоровее.', 'Мен ден соолукка пайдалуураак тамактангым келет.'],
  ['v', 'einschlafen', '', 'засыпать', 'уктап кетүү', 'Abends kann ich oft nicht einschlafen.', 'Вечером я часто не могу уснуть.', 'Кечинде мен көбүнчө уктай албайм.'],
  ['v', 'zunehmen', '', 'прибавлять в весе, увеличиваться', 'толуу, көбөйүү', 'Ich möchte nicht zunehmen.', 'Я не хочу поправиться.', 'Мен толгум келбейт.'],
]

const posOf = (k: string): PartOfSpeech =>
  k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : k === 'x' ? 'other' : 'adj'

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v25-${i + 1}`,
    unit: 25,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in A1, A2 and Units 21–24. */
export const UNIT_25_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
