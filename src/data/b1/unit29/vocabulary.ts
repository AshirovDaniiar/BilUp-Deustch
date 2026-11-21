import type { Article, PartOfSpeech, VocabularyItem } from '../../types'

/**
 * Unit 29 vocabulary — Reisen, Kultur und Alltag im Vergleich (B1). 40 NEW productive items (target 38–42), none of them an A1/A2 or earlier B1 headword
 * (checked by the validator rule `b1-vocab-repeats-earlier-level`). Themes: Reise und Panne (Reisepanne, Entschädigung, Beschwerde, Anschluss, Zugausfall, Rezeption …) ·
 * Reiseformen und Tourismus · Kultur, Bräuche und Alltag (Brauch, Tradition, Gastfreundschaft, Pünktlichkeit, Höflichkeit, Kulturschock) · Vergleich und Eindruck ·
 * Verben und Adjektive. The established travel words of A2 Unit 18 and of Units 10, 11, 16, 20, 21 and 27 (Unterkunft, Sehenswürdigkeit, Verspätung, Heimat, Fest,
 * Missverständnis, Gewohnheit, Erstattung, Panne, vergleichen, erleben …) are REUSED in the texts as revision but not listed again. Wortbildung strand: Kompositum
 * (Reisepanne, Zugausfall, Kulturschock, Gastgeber), -keit / -heit (Höflichkeit, Pünktlichkeit), -schaft (Gastfreundschaft), un- (ungewohnt). Every person, hotel and
 * railway company is fictional and no entry states a fact about a whole population. Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted
 * FIRST DRAFT that has not been reviewed by a native speaker.
 * Row: [kind, de, plural, ru, ky, example, exampleRu, exampleKy]   kind: der|die|das (noun) · v verb · a adjective
 */
type Row = [string, string, string, string, string, string, string, string]

const ROWS: Row[] = [
  // Reise und Panne
  ['die', 'Reisepanne', 'Reisepannen', 'сбой в поездке, неприятность в пути', 'жолдогу кыйынчылык, саякаттагы тоскоолдук', 'Bei unserer Reise gab es eine kleine Reisepanne.', 'В нашей поездке была небольшая неприятность в пути.', 'Биздин саякатта кичинекей жолдогу кыйынчылык болду.'],
  ['die', 'Entschädigung', 'Entschädigungen', 'компенсация', 'компенсация, зыянды жабуу', 'Für die lange Wartezeit bekommen Sie eine Entschädigung.', 'За долгое ожидание вы получите компенсацию.', 'Узак күткөнүңүз үчүн сиз компенсация аласыз.'],
  ['die', 'Beschwerde', 'Beschwerden', 'жалоба, претензия', 'даттануу, арыз-даттануу', 'Meine Beschwerde habe ich höflich und sachlich geschrieben.', 'Свою жалобу я написала вежливо и по делу.', 'Даттанууну мен сылык жана так жаздым.'],
  ['der', 'Anschluss', 'Anschlüsse', 'пересадка, стыковка (рейса, поезда)', 'которулуучу транспорт, улануу (поезд, рейс)', 'Wegen der Verspätung habe ich den Anschluss verpasst.', 'Из-за опоздания я не успел на пересадку.', 'Кечигүүнүн айынан мен которулуучу транспортко үлгүрбөй калдым.'],
  ['der', 'Fahrgast', 'Fahrgäste', 'пассажир (в транспорте)', 'жүргүнчү (транспортто)', 'Die Fahrgäste warten auf dem Bahnsteig.', 'Пассажиры ждут на платформе.', 'Жүргүнчүлөр перронда күтүп турушат.'],
  ['die', 'Rezeption', 'Rezeptionen', 'стойка регистрации, ресепшен', 'кабыл алуу жайы, ресепшн', 'An der Rezeption bekommen Sie den Schlüssel.', 'На ресепшене вы получите ключ.', 'Ресепшнде сиз ачкычты аласыз.'],
  ['der', 'Zugausfall', 'Zugausfälle', 'отмена поезда', 'поездин жокко чыгарылышы', 'Der Zugausfall hat unseren ganzen Plan geändert.', 'Отмена поезда изменила весь наш план.', 'Поездин жокко чыгарылышы биздин бүт пландын өзгөртүп салды.'],
  ['v', 'ausfallen', '', 'отменяться, не состояться', 'жокко чыгуу, болбой калуу', 'Der Zug nach Dresden fällt heute aus.', 'Поезд до Дрездена сегодня отменяется.', 'Дрезденге поезд бүгүн жокко чыгат.'],
  ['v', 'sich verspäten', '', 'опаздывать, задерживаться', 'кечигүү, жетүүгө кечигип калуу', 'Mein Flug hat sich um zwei Stunden verspätet.', 'Мой рейс задержался на два часа.', 'Менин рейсим эки саатка кечикти.'],
  ['v', 'übernachten', '', 'ночевать, переночевать', 'түнөө, түнөп калуу', 'Wir haben in einer kleinen Pension übernachtet.', 'Мы переночевали в маленьком пансионе.', 'Биз кичинекей пансионда түнөдүк.'],
  ['v', 'sich beschweren', '', 'жаловаться', 'даттануу', 'Ich möchte mich bei der Rezeption beschweren.', 'Я хочу пожаловаться на ресепшене.', 'Мен ресепшнге даттангым келет.'],
  // Reiseformen und Tourismus
  ['die', 'Pauschalreise', 'Pauschalreisen', 'организованная поездка «всё включено»', 'бардыгы камтылган уюштурулган саякат', 'Eine Pauschalreise ist bequem, aber nicht sehr flexibel.', 'Организованная поездка удобна, но не очень гибка.', 'Уюштурулган саякат ыңгайлуу, бирок өтө ийкемдүү эмес.'],
  ['die', 'Rundreise', 'Rundreisen', 'круговая поездка, тур с несколькими остановками', 'бир нече токтоочу айлануу саякат', 'Wir machen eine Rundreise durch drei Städte.', 'Мы едем в тур по трём городам.', 'Биз үч шаар боюнча айлануу саякатка чыгабыз.'],
  ['der', 'Reiseführer', 'Reiseführer', 'путеводитель', 'саякат жол көрсөткүчү (китеп)', 'Im Reiseführer steht viel über die Altstadt.', 'В путеводителе много написано о старом городе.', 'Жол көрсөткүчтө эски шаар жөнүндө көп жазылган.'],
  ['der', 'Tourismus', '', 'туризм', 'туризм (саякат)', 'Der Tourismus bringt der Stadt Geld, aber auch Lärm.', 'Туризм приносит городу деньги, но и шум.', 'Туризм шаарга акча алып келет, бирок ызы-чуу да алып келет.'],
  ['das', 'Reiseziel', 'Reiseziele', 'место назначения, цель поездки', 'барчу жер, саякаттын багыты', 'Unser Reiseziel liegt am Meer.', 'Наше место назначения находится у моря.', 'Биздин барчу жерибиз деңиздин жээгинде.'],
  // Kultur, Bräuche und Alltag
  ['die', 'Kultur', 'Kulturen', 'культура', 'маданият', 'Jede Kultur hat ihre eigenen Gewohnheiten.', 'У каждой культуры есть свои привычки.', 'Ар бир маданияттын өз адаттары бар.'],
  ['der', 'Brauch', 'Bräuche', 'обычай', 'каада-салт', 'In unserer Familie gibt es einen schönen Brauch zum Jahresende.', 'В нашей семье есть красивый обычай на конец года.', 'Биздин үй-бүлөдө жылдын аягында кооз каада-салт бар.'],
  ['die', 'Tradition', 'Traditionen', 'традиция', 'салт, үрп-адат', 'Das Fest ist für meine Freundin eine wichtige Tradition.', 'Этот праздник для моей подруги — важная традиция.', 'Бул майрам менин дугуна үчүн маанилүү салт.'],
  ['die', 'Gastfreundschaft', '', 'гостеприимство', 'коноктоо, конок тосуу', 'Die Gastfreundschaft in der Familie hat mich überrascht.', 'Гостеприимство в этой семье меня удивило.', 'Үй-бүлөдөгү конок тосуу мени таң калтырды.'],
  ['die', 'Höflichkeit', '', 'вежливость', 'сылыктык', 'Höflichkeit bedeutet nicht in jeder Familie dasselbe.', 'Вежливость не в каждой семье значит одно и то же.', 'Сылыктык ар бир үй-бүлөдө бирдей эле маанини билдирбейт.'],
  ['die', 'Pünktlichkeit', '', 'пунктуальность', 'так убагында келүү, так убакытты сактоо', 'Für meinen Chef ist Pünktlichkeit sehr wichtig.', 'Для моего начальника пунктуальность очень важна.', 'Менин начальнигим үчүн убакытты так сактоо өтө маанилүү.'],
  ['der', 'Kulturschock', 'Kulturschocks', 'культурный шок', 'маданий шок', 'Nach der Ankunft hatte ich einen kleinen Kulturschock.', 'После приезда у меня был небольшой культурный шок.', 'Келгенден кийин менде кичинекей маданий шок болду.'],
  ['die', 'Redewendung', 'Redewendungen', 'устойчивое выражение, идиома', 'туруктуу сөз айкашы, идиома', 'Diese Redewendung kannte ich noch nicht.', 'Этого устойчивого выражения я ещё не знал.', 'Бул туруктуу сөз айкашын мен али билчү эмесмин.'],
  ['der', 'Gastgeber', 'Gastgeber', 'хозяин (принимающий гостей)', 'үй ээси (конок тосуучу)', 'Unser Gastgeber hat uns viele Orte gezeigt.', 'Наш хозяин показал нам много мест.', 'Биздин үй ээси бизге көп жерлерди көрсөттү.'],
  // Vergleich und Eindruck
  ['der', 'Unterschied', 'Unterschiede', 'различие, разница', 'айырма', 'Der größte Unterschied ist für mich das Essen.', 'Самая большая разница для меня — еда.', 'Мен үчүн эң чоң айырма — тамак-аш.'],
  ['die', 'Gemeinsamkeit', 'Gemeinsamkeiten', 'общее, сходство', 'ортоктук, окшоштук', 'Es gibt auch viele Gemeinsamkeiten.', 'Есть и много общего.', 'Ортоктуктар да көп.'],
  ['der', 'Alltag', '', 'повседневная жизнь, будни', 'күнүмдүк жашоо', 'Im Alltag fallen mir viele kleine Unterschiede auf.', 'В повседневной жизни мне бросается в глаза много мелких различий.', 'Күнүмдүк жашоодо мага көптөгөн майда айырмачылыктар байкалат.'],
  ['die', 'Erwartung', 'Erwartungen', 'ожидание', 'күтүү, үмүт', 'Meine Erwartungen waren nicht zu hoch.', 'Мои ожидания были не слишком высокими.', 'Менин күткөндөрүм өтө жогору болгон эмес.'],
  ['der', 'Eindruck', 'Eindrücke', 'впечатление', 'таасир', 'Mein erster Eindruck von der Stadt war gut.', 'Моё первое впечатление о городе было хорошим.', 'Шаар жөнүндө менин биринчи таасирим жакшы болду.'],
  ['v', 'sich anpassen', '', 'приспосабливаться', 'ыңгайлашуу', 'Nach einigen Wochen hatte ich mich gut angepasst.', 'Через несколько недель я хорошо приспособился.', 'Бир нече жумадан кийин мен жакшы ыңгайлашып калдым.'],
  ['v', 'sich eingewöhnen', '', 'привыкать, осваиваться', 'көнүү, адаптация болуу', 'Es dauert, bis man sich in einer neuen Stadt eingewöhnt.', 'Нужно время, чтобы освоиться в новом городе.', 'Жаңы шаарга көнүү үчүн убакыт керек.'],
  ['v', 'auffallen', '', 'бросаться в глаза, обращать на себя внимание', 'көзгө урунуу, байкалуу', 'Mir ist aufgefallen, dass viele Läden sonntags geschlossen sind.', 'Мне бросилось в глаза, что многие магазины по воскресеньям закрыты.', 'Мага көптөгөн дүкөндөр жекшемби күнү жабык экени көзгө урунду.'],
  ['v', 'überraschen', '', 'удивлять, преподносить сюрприз', 'таң калтыруу', 'Die Leute waren sehr freundlich, das hat mich überrascht.', 'Люди были очень дружелюбны, и это меня удивило.', 'Адамдар абдан достук мамиледе болду, бул мени таң калтырды.'],
  ['a', 'gastfreundlich', '', 'гостеприимный', 'конок тосууга ыкчам, мейман дос', 'Meine Gastfamilie war sehr gastfreundlich.', 'Моя принимающая семья была очень гостеприимной.', 'Менин мейман үй-бүлөм өтө конок тосууга ыкчам болду.'],
  ['a', 'ungewohnt', '', 'непривычный', 'көнүмүш эмес, адатта болбогон', 'Das Essen war am Anfang etwas ungewohnt.', 'Еда сначала была немного непривычной.', 'Тамак алгач бир аз көнүмүш эмес болду.'],
  ['a', 'vertraut', '', 'знакомый, привычный', 'тааныш, көнүмүш', 'Nach einem Monat war mir alles vertraut.', 'Через месяц всё стало мне привычным.', 'Бир айдан кийин мага баары тааныш болуп калды.'],
  ['a', 'unterschiedlich', '', 'разный, различный', 'ар түрдүү, ар башка', 'Die Menschen denken oft unterschiedlich darüber.', 'Люди часто думают об этом по-разному.', 'Адамдар бул жөнүндө көп учурда ар башкача ойлошот.'],
  ['a', 'typisch', '', 'типичный', 'мүнөздүү', 'Das ist für diese Familie typisch, aber nicht für alle.', 'Это типично для этой семьи, но не для всех.', 'Бул ушул үй-бүлөгө мүнөздүү, бирок баарына эмес.'],
  ['a', 'zurückhaltend', '', 'сдержанный', 'токтоо, өзүн кармаган', 'Mein Nachbar ist zurückhaltend, aber sehr hilfsbereit.', 'Мой сосед сдержанный, но очень отзывчивый.', 'Менин кошунам токтоо, бирок абдан жардамчыл.'],
]

const posOf = (k: string): PartOfSpeech =>
  k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : k === 'x' ? 'other' : 'adj'

const base: VocabularyItem[] = ROWS.map(([kind, de, plural, ru, ky, example, exampleRu, exampleKy], i) => {
  const pos = posOf(kind)
  return {
    id: `v29-${i + 1}`,
    unit: 29,
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

/** `related` = thematic neighbours inside the unit (previous, next, next-but-one), as in A1, A2 and Units 21–28. */
export const UNIT_29_VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]].filter((n): n is VocabularyItem => !!n).map(n => n.id),
}))
