import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_19_SOURCE } from '../provenance'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 19 grammar (Stage 7J). The THREE concepts of the approved Stage 7B plan, each with a capped scope (docs/authoring/A2_UNIT19_DESIGN_NOTES.md):
 *  1. `a2-man-regeln-verbote` — `man` + modal (darf / muss / kann), erlaubt / verboten, `Bitte nicht + Infinitiv`, nicht dürfen vs. nicht müssen. No Passiv notices.
 *  2. `a2-indirekte-fragen` — TWO frames only (audit D-4): `Können Sie mir sagen, wo / wann / wie … ?` and `Ich möchte wissen, ob …`; verb final; W-questions and `ob`.
 *  3. `a2-wegbeschreibung-praepositionen` — an … vorbei, bis zu(r), gegenüber von, zwischen, über + Akkusativ; Imperativ (Sie) for directions.
 * Not taught: indirect questions with other frames, `ob` after other verbs, Passiv, the du/ihr imperative for directions, ordinals, adjectives after a Dativ preposition.
 */
export const UNIT_19_GRAMMAR: GrammarConcept[] = [
  {
    id: 'a2-man-regeln-verbote',
    category: 'verbs',
    level: 'A2',
    unit: 19,
    visual: 'modal',
    title: l('Правила и запреты: man + модальный глагол, erlaubt / verboten, «Bitte nicht …»', 'Эрежелер жана тыюулар: man + модалдык этиш, erlaubt / verboten, «Bitte nicht …»'),
    summary: l(
      'Правила и объявления говорят безлично: man — «все, кто здесь находится». После man стоит форма как после er / sie: «Man darf hier nicht parken», «Man muss das Formular ausfüllen», «Man kann am Schalter bezahlen». Разрешено или запрещено, говорят также словами erlaubt и verboten: «Parken ist hier verboten». Вежливая просьба на табличке: «Bitte nicht rauchen» (Bitte nicht + инфинитив). Важное различие: nicht dürfen — запрещено («Man darf nicht parken»), а nicht müssen — делать необязательно, но можно («Man muss nicht bezahlen»). Пассивные таблички вроде «Hier wird geparkt» мы не используем.',
      'Эрежелер жана жарыялар жекеликсиз айтылат: man — «бул жерде жүргөндөрдүн баары». man сөзүнөн кийин er / sie сыяктуу форма турат: «Man darf hier nicht parken», «Man muss das Formular ausfüllen», «Man kann am Schalter bezahlen». Уруксат бар же тыюу салынганын erlaubt жана verboten сөздөрү менен да айтышат: «Parken ist hier verboten». Такталардагы сылык өтүнүч: «Bitte nicht rauchen» (Bitte nicht + инфинитив). Маанилүү айырма: nicht dürfen — тыюу салынган («Man darf nicht parken»), ал эми nicht müssen — милдеттүү эмес, бирок болот («Man muss nicht bezahlen»). «Hier wird geparkt» сыяктуу пассивдүү такталарды колдонбойбуз.',
    ),
    discover: l(
      'Сравните: «Man darf hier nicht parken» и «Man muss hier nicht bezahlen». В обоих предложениях есть nicht. Одно из них запрещает, другое — нет. Какое?',
      '«Man darf hier nicht parken» жана «Man muss hier nicht bezahlen» деген сүйлөмдөрдү салыштырыңыз. Экөөндө тең nicht бар. Бири тыюу салат, экинчиси — жок. Кайсынысы?',
    ),
    why: l(
      'В офисе, на почте и на улице вы читаете таблички и слышите правила: что можно, что нужно, что нельзя. Если перепутать «nicht dürfen» и «nicht müssen», вы поймёте правило наоборот.',
      'Кеңседе, почтада жана көчөдө такталарды окуп, эрежелерди угасыз: эмне болот, эмне керек, эмне болбойт. «nicht dürfen» менен «nicht müssen» сөздөрүн чаташтырсаңыз, эрежени тескерисинче түшүнөсүз.',
    ),
    when: [
      l(
        'Правило для всех: man + модальный глагол в форме er / sie (darf, muss, kann). Man darf hier parken. Man muss einen Ausweis mitbringen.',
        'Баарына эреже: man + er / sie формасындагы модалдык этиш (darf, muss, kann). Man darf hier parken. Man muss einen Ausweis mitbringen.',
      ),
      l(
        'Запрет — nicht dürfen: Man darf hier nicht rauchen. Разрешение — dürfen: Man darf hier Fotos machen.',
        'Тыюу — nicht dürfen: Man darf hier nicht rauchen. Уруксат — dürfen: Man darf hier Fotos machen.',
      ),
      l(
        'Необязательно — nicht müssen: Man muss nicht bezahlen (можно, но не нужно). Не путайте с nicht dürfen (нельзя).',
        'Милдеттүү эмес — nicht müssen: Man muss nicht bezahlen (болот, бирок керек эмес). nicht dürfen (болбойт) менен чаташтырбаңыз.',
      ),
      l(
        'Табличка: Rauchen ist verboten. Parken ist erlaubt. Вежливо и коротко: Bitte nicht rauchen. Bitte nicht parken.',
        'Такта: Rauchen ist verboten. Parken ist erlaubt. Сылык жана кыска: Bitte nicht rauchen. Bitte nicht parken.',
      ),
    ],
    examples: [
      { de: 'Hier darf man nicht parken.', ru: 'Здесь нельзя парковаться.', ky: 'Бул жерде унаа токтотууга болбойт.', focus: 'man + darf nicht' },
      { de: 'Man muss das Formular ausfüllen.', ru: 'Нужно заполнить бланк.', ky: 'Бланкты толтуруу керек.', focus: 'man + muss' },
      { de: 'Man kann am Schalter bezahlen.', ru: 'Платить можно у окошка.', ky: 'Терезеде төлөөгө болот.', focus: 'man + kann' },
      { de: 'Man muss nicht bezahlen.', ru: 'Платить не нужно.', ky: 'Төлөөнүн кереги жок.', focus: 'nicht müssen = необязательно' },
      { de: 'Rauchen ist hier verboten.', ru: 'Курить здесь запрещено.', ky: 'Бул жерде тамеки чегүүгө тыюу салынган.', focus: 'verboten' },
      { de: 'Bitte nicht rauchen.', ru: 'Просьба не курить.', ky: 'Тамеки чекпегиле деп суранабыз.', focus: 'Bitte nicht + Infinitiv' },
    ],
    mistakes: [
      {
        wrong: 'Man dürfen hier nicht parken.',
        right: 'Man darf hier nicht parken.',
        note: l(
          'После man глагол стоит в форме как после er / sie: darf, а не dürfen.',
          'man сөзүнөн кийин этиш er / sie сыяктуу формада турат: darf, dürfen эмес.',
        ),
      },
      {
        wrong: 'Man muss hier nicht parken.',
        right: 'Man darf hier nicht parken.',
        note: l(
          'Если парковаться нельзя, нужно «nicht dürfen». Man muss nicht parken значит «парковаться не обязательно».',
          'Унаа токтотууга болбосо, «nicht dürfen» керек. Man muss nicht parken «унаа токтотуу милдеттүү эмес» дегенди билдирет.',
        ),
      },
      {
        wrong: 'Man darf nicht bezahlen.',
        right: 'Man muss nicht bezahlen.',
        note: l(
          'Если платить не нужно (бесплатно), говорят «nicht müssen». Man darf nicht bezahlen значит «платить запрещено».',
          'Төлөө керек болбосо (акысыз), «nicht müssen» дейт. Man darf nicht bezahlen «төлөөгө тыюу салынган» дегенди билдирет.',
        ),
      },
      {
        wrong: 'Bitte nicht zu rauchen.',
        right: 'Bitte nicht rauchen.',
        note: l(
          'После «Bitte nicht» стоит чистый инфинитив, без zu.',
          '«Bitte nicht» сөзүнөн кийин zu жок таза инфинитив турат.',
        ),
      },
    ],
    reallife: [
      { de: 'Im Park darf man nicht Fußball spielen.', ru: 'В парке нельзя играть в футбол.', ky: 'Паркта футбол ойноого болбойт.', focus: 'man darf nicht' },
      { de: 'Für die Anmeldung muss man einen Ausweis mitbringen.', ru: 'Для регистрации нужно взять с собой удостоверение личности.', ky: 'Каттоо үчүн инсандыкты күбөлөндүрүүчү документти ала келүү керек.', focus: 'man muss' },
      { de: 'Am Sonntag ist das Amt geschlossen.', ru: 'В воскресенье учреждение закрыто.', ky: 'Жекшемби күнү мекеме жабык.', focus: 'geschlossen' },
      { de: 'Hier ist Parken erlaubt.', ru: 'Здесь парковка разрешена.', ky: 'Бул жерде унаа токтотууга уруксат.', focus: 'erlaubt' },
    ],
    dialogue: [
      { speaker: 'Frau Roth', text: 'Entschuldigung, darf man hier parken?', ru: 'Извините, здесь можно парковаться?', ky: 'Кечиресиз, бул жерде унаа токтотууга болобу?' },
      { speaker: 'Herr Maier', text: 'Nein, hier ist Parken verboten.', ru: 'Нет, здесь парковка запрещена.', ky: 'Жок, бул жерде унаа токтотууга тыюу салынган.' },
      { speaker: 'Frau Roth', text: 'Und dort, bei der Post?', ru: 'А там, у почты?', ky: 'Ал эми ошол жакта, почтанын жанындабы?' },
      { speaker: 'Herr Maier', text: 'Ja, dort darf man parken. Man muss nicht bezahlen.', ru: 'Да, там можно парковаться. Платить не нужно.', ky: 'Ооба, ал жерде унаа токтотууга болот. Төлөөнүн кереги жок.' },
    ],
    speakPrompt: {
      prompt: l(
        'Назовите три правила: что на почте можно, что нужно и что нельзя (с man).',
        'Почтада эмне болоорун, эмне керек экенин жана эмне болбой турганын (man менен) үч эреже менен айтыңыз.',
      ),
      sample: 'Man darf hier nicht rauchen. Man muss am Schalter warten. Man kann die Briefmarken dort kaufen.',
      keywords: ['man', 'darf', 'muss'],
    },
    source: UNIT_19_SOURCE,
  },
  {
    id: 'a2-indirekte-fragen',
    category: 'wordorder',
    level: 'A2',
    unit: 19,
    visual: 'verbpos',
    title: l('Вежливый вопрос: «Können Sie mir sagen, wo …?» и «Ich möchte wissen, ob …»', 'Сылык суроо: «Können Sie mir sagen, wo …?» жана «Ich möchte wissen, ob …»'),
    summary: l(
      'Чтобы спросить вежливо (в учреждении, на улице), вопрос вставляют в рамку: «Können Sie mir sagen, …?» или «Ich möchte wissen, …». Внутри рамки вопрос превращается в придаточное: глагол уходит в конец. С вопросительным словом: «Können Sie mir sagen, wo das Bürgeramt ist?» (wo, wann, wie). Без вопросительного слова (вопрос «да / нет») ставится ob: «Ich möchte wissen, ob ich einen Termin brauche». Мы учим только эти две рамки. Русское «ли» и кыргызское «-бы» устроены иначе: ориентируйтесь только на немецкий порядок слов.',
      'Сылык суроо берүү үчүн (мекемеде, көчөдө) суроо алкакка салынат: «Können Sie mir sagen, …?» же «Ich möchte wissen, …». Алкактын ичинде суроо бириккен сүйлөмгө айланат: этиш аягына өтөт. Суроо сөзү менен: «Können Sie mir sagen, wo das Bürgeramt ist?» (wo, wann, wie). Суроо сөзү жок («ооба / жок» суроосу) ob коюлат: «Ich möchte wissen, ob ich einen Termin brauche». Биз ушул эки алкакты гана үйрөнөбүз. Орусча «ли» жана кыргызча «-бы» башкача түзүлөт: жалаң гана немис сөз тартибине таяныңыз.',
    ),
    discover: l(
      'Сравните: «Wo ist das Bürgeramt?» и «Können Sie mir sagen, wo das Bürgeramt ist?». Где стоит глагол ist в первом вопросе и где — во втором?',
      '«Wo ist das Bürgeramt?» жана «Können Sie mir sagen, wo das Bürgeramt ist?» деген суроолорду салыштырыңыз. Биринчи суроодо ist этиши кайда турат, экинчисинде кайда?',
    ),
    why: l(
      'Прямой вопрос «Wo ist die Post?» звучит коротко. В учреждении и с незнакомыми людьми «Können Sie mir sagen, wo die Post ist?» звучит вежливее. Порядок слов легко запомнить: в конце — глагол.',
      '«Wo ist die Post?» деген түз суроо кыска угулат. Мекемеде жана тааныш эмес адамдар менен «Können Sie mir sagen, wo die Post ist?» сылыгыраак угулат. Сөз тартибин эстеп калуу оңой: аягында — этиш.',
    ),
    when: [
      l(
        'Рамка 1 + W-слово (wo, wann, wie): Können Sie mir sagen, wo die Post ist? Können Sie mir sagen, wann das Amt geöffnet ist?',
        '1-алкак + W-сөз (wo, wann, wie): Können Sie mir sagen, wo die Post ist? Können Sie mir sagen, wann das Amt geöffnet ist?',
      ),
      l(
        'Рамка 2 + ob для вопроса «да / нет»: Ich möchte wissen, ob ich einen Termin brauche. Ich möchte wissen, ob das Amt heute geöffnet ist.',
        '2-алкак + «ооба / жок» суроосу үчүн ob: Ich möchte wissen, ob ich einen Termin brauche. Ich möchte wissen, ob das Amt heute geöffnet ist.',
      ),
      l(
        'Глагол — в конце придаточного: …, wo die Post ist. …, ob ich einen Termin brauche. После запятой подлежащее идёт перед глаголом.',
        'Этиш бириккен сүйлөмдүн аягында турат: …, wo die Post ist. …, ob ich einen Termin brauche. Үтүрдөн кийин ээ этиштин алдында турат.',
      ),
      l(
        'Вопросительный знак — в конце всего предложения: Können Sie mir sagen, wie ich zum Bahnhof komme?',
        'Суроо белгиси бүт сүйлөмдүн аягында турат: Können Sie mir sagen, wie ich zum Bahnhof komme?',
      ),
    ],
    examples: [
      { de: 'Können Sie mir sagen, wo das Bürgeramt ist?', ru: 'Вы не подскажете, где находится бюро обслуживания граждан?', ky: 'Жарандарды тейлөө бөлүмү кайда экенин айтып бере аласызбы?', focus: 'wo … ist (глагол в конце)' },
      { de: 'Können Sie mir sagen, wann das Amt geöffnet ist?', ru: 'Вы не подскажете, когда открыто учреждение?', ky: 'Мекеме качан ачык экенин айтып бере аласызбы?', focus: 'wann … ist' },
      { de: 'Können Sie mir sagen, wie ich zum Bahnhof komme?', ru: 'Вы не подскажете, как мне добраться до вокзала?', ky: 'Вокзалга кантип барарымды айтып бере аласызбы?', focus: 'wie … komme' },
      { de: 'Ich möchte wissen, ob ich einen Termin brauche.', ru: 'Я хотел бы знать, нужна ли мне запись.', ky: 'Мага кабыл алуу убактысы керекпи, билгим келет.', focus: 'ob … brauche' },
      { de: 'Ich möchte wissen, ob die Post heute geöffnet ist.', ru: 'Я хотел бы знать, открыта ли сегодня почта.', ky: 'Почта бүгүн ачыкпы, билгим келет.', focus: 'ob … ist' },
    ],
    mistakes: [
      {
        wrong: 'Können Sie mir sagen, wo ist die Post?',
        right: 'Können Sie mir sagen, wo die Post ist?',
        note: l(
          'После «wo» в рамке глагол уходит в конец: wo die Post ist.',
          'Алкактагы «wo» сөзүнөн кийин этиш аягына өтөт: wo die Post ist.',
        ),
      },
      {
        wrong: 'Ich möchte wissen, ist das Amt geöffnet.',
        right: 'Ich möchte wissen, ob das Amt geöffnet ist.',
        note: l(
          'Для вопроса «да / нет» нужно слово ob, а глагол ist стоит в конце.',
          '«Ооба / жок» суроосу үчүн ob сөзү керек, ал эми ist этиши аягында турат.',
        ),
      },
      {
        wrong: 'Können Sie mir sagen, wenn das Amt geöffnet ist?',
        right: 'Können Sie mir sagen, wann das Amt geöffnet ist?',
        note: l(
          'Wenn — «если»; вопросительное слово «когда» — wann.',
          'Wenn — «эгер»; «качан» деген суроо сөзү — wann.',
        ),
      },
      {
        wrong: 'Können Sie mir sagen, dass die Post wo ist?',
        right: 'Können Sie mir sagen, wo die Post ist?',
        note: l(
          'Вопросительное слово (wo) стоит сразу после запятой, дополнительное dass не нужно.',
          'Суроо сөзү (wo) үтүрдөн кийин дароо турат, кошумча dass керек эмес.',
        ),
      },
    ],
    reallife: [
      { de: 'Können Sie mir sagen, wann der Bus kommt?', ru: 'Вы не подскажете, когда придёт автобус?', ky: 'Автобус качан келерин айтып бере аласызбы?', focus: 'wann … kommt' },
      { de: 'Können Sie mir sagen, wo ich das Formular bekomme?', ru: 'Вы не подскажете, где я получу бланк?', ky: 'Бланкты кайдан аларымды айтып бере аласызбы?', focus: 'wo … bekomme' },
      { de: 'Ich möchte wissen, ob ich hier parken darf.', ru: 'Я хотел бы знать, можно ли здесь парковаться.', ky: 'Бул жерде унаа токтотууга болобу, билгим келет.', focus: 'ob … darf' },
    ],
    dialogue: [
      { speaker: 'Frau Berg', text: 'Entschuldigung, können Sie mir sagen, wo der Schalter für Pakete ist?', ru: 'Извините, вы не подскажете, где окошко для посылок?', ky: 'Кечиресиз, посылкалар үчүн терезе кайда экенин айтып бере аласызбы?' },
      { speaker: 'Herr Weiß', text: 'Gehen Sie zu Schalter zwei.', ru: 'Идите к окошку два.', ky: 'Экинчи терезеге барыңыз.' },
      { speaker: 'Frau Berg', text: 'Danke. Ich möchte auch wissen, ob ich eine Briefmarke brauche.', ru: 'Спасибо. Я хотела бы ещё узнать, нужна ли мне марка.', ky: 'Рахмат. Мага почта маркасы керекпи, дагы билгим келет.' },
      { speaker: 'Herr Weiß', text: 'Nein, Sie bezahlen am Schalter.', ru: 'Нет, вы платите у окошка.', ky: 'Жок, сиз терезеде төлөйсүз.' },
    ],
    speakPrompt: {
      prompt: l(
        'Задайте два вежливых вопроса в учреждении: один с wo или wann, один с ob.',
        'Мекемеде эки сылык суроо бериңиз: бирөө wo же wann менен, бирөө ob менен.',
      ),
      sample: 'Können Sie mir sagen, wann das Amt geöffnet ist? Ich möchte wissen, ob ich einen Termin brauche.',
      keywords: ['können sie mir sagen', 'ich möchte wissen', 'ob'],
    },
    source: UNIT_19_SOURCE,
  },
  {
    id: 'a2-wegbeschreibung-praepositionen',
    category: 'prepositions',
    level: 'A2',
    unit: 19,
    visual: 'prepositions',
    title: l('Описание пути: an … vorbei, bis zu, gegenüber von, zwischen, über', 'Жолду түшүндүрүү: an … vorbei, bis zu, gegenüber von, zwischen, über'),
    summary: l(
      'Путь объясняют повелительным наклонением на «Sie» и несколькими предлогами. Bis zu + Dativ — «до»: «Gehen Sie bis zur Kreuzung» (zur = zu der). An … vorbei — «мимо»: «Gehen Sie an der Bank vorbei» (an + Dativ). Gegenüber von + Dativ — «напротив»: «Die Post ist gegenüber von der Apotheke». Zwischen + Dativ (где?) — «между»: «Das Café ist zwischen der Bank und der Post». Über + Akkusativ — «через»: «Gehen Sie über die Straße». Направления — geradeaus, links, rechts. Прилагательные и порядковые числительные в описании пути мы не используем.',
      'Жолду «Sie» формасындагы буйрук ыңгайы жана бир нече предлог менен түшүндүрүшөт. Bis zu + Dativ — «чейин»: «Gehen Sie bis zur Kreuzung» (zur = zu der). An … vorbei — «жанынан өтүп»: «Gehen Sie an der Bank vorbei» (an + Dativ). Gegenüber von + Dativ — «каршысында»: «Die Post ist gegenüber von der Apotheke». Zwischen + Dativ (кайда?) — «ортосунда»: «Das Café ist zwischen der Bank und der Post». Über + Akkusativ — «аркылуу»: «Gehen Sie über die Straße». Багыттар — geradeaus, links, rechts. Жолду сүрөттөөдө сын атоочторду жана иреттик сан атоочторду колдонбойбуз.',
    ),
    discover: l(
      'Сравните: «Gehen Sie bis zur Kreuzung» и «Gehen Sie bis die Kreuzung». Какое предложение правильное и какой падеж стоит после «zu»?',
      '«Gehen Sie bis zur Kreuzung» жана «Gehen Sie bis die Kreuzung» деген сүйлөмдөрдү салыштырыңыз. Кайсы сүйлөм туура жана «zu» сөзүнөн кийин кайсы жөндөмө турат?',
    ),
    why: l(
      'Спросить дорогу вы уже умеете (A1). Теперь нужно понять ответ и объяснить путь самому: до перекрёстка, мимо банка, напротив аптеки. Эти пять предлогов покрывают почти все простые объяснения.',
      'Жолду сурай билесиз (A1). Эми жоопту түшүнүп, жолду өзүңүз түшүндүрүү керек: жол кесилишине чейин, банктын жанынан өтүп, дарыканын каршысында. Бул беш предлог жөнөкөй түшүндүрмөлөрдүн дээрлик баарын камтыйт.',
    ),
    when: [
      l(
        'Путь — Imperativ (Sie): Gehen Sie geradeaus. Gehen Sie links. Nehmen Sie die Straßenbahn.',
        'Жол — Imperativ (Sie): Gehen Sie geradeaus. Gehen Sie links. Nehmen Sie die Straßenbahn.',
      ),
      l(
        '«До» — Bis zu + Dativ (zum / zur): Gehen Sie bis zur Kreuzung. Gehen Sie bis zum Bahnhof. «Мимо» — An … vorbei + Dativ: Gehen Sie an der Bank vorbei.',
        '«чейин» — Bis zu + Dativ (zum / zur): Gehen Sie bis zur Kreuzung. Gehen Sie bis zum Bahnhof. «жанынан өтүп» — An … vorbei + Dativ: Gehen Sie an der Bank vorbei.',
      ),
      l(
        'Где находится место: gegenüber von + Dativ (Die Post ist gegenüber von der Apotheke), zwischen + Dativ (zwischen der Bank und der Post), neben + Dativ (A1).',
        'Жер кайда экени: gegenüber von + Dativ (Die Post ist gegenüber von der Apotheke), zwischen + Dativ (zwischen der Bank und der Post), neben + Dativ (A1).',
      ),
      l(
        'Через улицу — über + Akkusativ: Gehen Sie über die Straße. Объяснить путь коротко: «Dann links, an der Ampel rechts».',
        'Көчөнү кесип өтүү — über + Akkusativ: Gehen Sie über die Straße. Жолду кыскача түшүндүрүү: «Dann links, an der Ampel rechts».',
      ),
    ],
    examples: [
      { de: 'Gehen Sie geradeaus bis zur Kreuzung.', ru: 'Идите прямо до перекрёстка.', ky: 'Жол кесилишине чейин түз барыңыз.', focus: 'bis zu + Dativ (zur = zu der)' },
      { de: 'Gehen Sie an der Bank vorbei.', ru: 'Пройдите мимо банка.', ky: 'Банктын жанынан өтүп барыңыз.', focus: 'an … vorbei + Dativ' },
      { de: 'Die Post ist gegenüber von der Apotheke.', ru: 'Почта находится напротив аптеки.', ky: 'Почта дарыканын каршысында.', focus: 'gegenüber von + Dativ' },
      { de: 'Das Café ist zwischen der Bank und der Post.', ru: 'Кафе находится между банком и почтой.', ky: 'Кафе банк менен почтанын ортосунда.', focus: 'zwischen + Dativ' },
      { de: 'Gehen Sie über die Straße.', ru: 'Перейдите через улицу.', ky: 'Көчөнү кесип өтүңүз.', focus: 'über + Akkusativ' },
    ],
    mistakes: [
      {
        wrong: 'Gehen Sie bis die Kreuzung.',
        right: 'Gehen Sie bis zur Kreuzung.',
        note: l(
          'Для «до места» нужно bis zu + Dativ: zu der → zur.',
          '«Жерге чейин» үчүн bis zu + Dativ керек: zu der → zur.',
        ),
      },
      {
        wrong: 'Gehen Sie an die Bank vorbei.',
        right: 'Gehen Sie an der Bank vorbei.',
        note: l(
          'An … vorbei всегда требует Dativ: an der Bank vorbei.',
          'An … vorbei ар дайым Dativ талап кылат: an der Bank vorbei.',
        ),
      },
      {
        wrong: 'Die Post ist gegenüber die Apotheke.',
        right: 'Die Post ist gegenüber von der Apotheke.',
        note: l(
          'Нужны два слова: gegenüber von, и после них Dativ (der Apotheke).',
          'Эки сөз керек: gegenüber von, андан кийин Dativ (der Apotheke).',
        ),
      },
      {
        wrong: 'Gehen Sie über der Straße.',
        right: 'Gehen Sie über die Straße.',
        note: l(
          'Движение через улицу («куда?») требует Akkusativ: über die Straße.',
          'Көчөнү кесип өтүү («кайда?») Akkusativ талап кылат: über die Straße.',
        ),
      },
    ],
    reallife: [
      { de: 'Wie komme ich zum Rathaus? – Gehen Sie geradeaus bis zur Ampel.', ru: 'Как пройти к ратуше? — Идите прямо до светофора.', ky: 'Шаардык башкарма имаратына кантип барам? — Светофорго чейин түз барыңыз.', focus: 'bis zur Ampel' },
      { de: 'Der Geldautomat ist neben der Bank.', ru: 'Банкомат находится рядом с банком.', ky: 'Акча чыгаруучу аппарат банктын жанында.', focus: 'neben + Dativ' },
      { de: 'Gehen Sie bis zum Bahnhof und dann rechts.', ru: 'Идите до вокзала, а потом направо.', ky: 'Вокзалга чейин барыңыз, анан оңго бурулуңуз.', focus: 'bis zum Bahnhof' },
      { de: 'Gehen Sie an der Straßenbahn vorbei, dann links.', ru: 'Пройдите мимо трамвая, потом налево.', ky: 'Трамвайдын жанынан өтүп барыңыз, анан солго бурулуңуз.', focus: 'an … vorbei, links' },
    ],
    dialogue: [
      { speaker: 'Lena', text: 'Entschuldigung, wie komme ich zum Rathaus?', ru: 'Извините, как мне пройти к ратуше?', ky: 'Кечиресиз, шаардык башкарма имаратына кантип барам?' },
      { speaker: 'Herr Klein', text: 'Gehen Sie geradeaus bis zur Ampel. Dann gehen Sie über die Straße.', ru: 'Идите прямо до светофора. Потом перейдите улицу.', ky: 'Светофорго чейин түз барыңыз. Анан көчөнү кесип өтүңүз.' },
      { speaker: 'Lena', text: 'Und dann?', ru: 'А потом?', ky: 'Анан эмне кылам?' },
      { speaker: 'Herr Klein', text: 'Das Rathaus ist gegenüber von der Bank.', ru: 'Ратуша находится напротив банка.', ky: 'Шаардык башкарма имараты банктын каршысында.' },
    ],
    speakPrompt: {
      prompt: l(
        'Объясните путь от вокзала до почты: три коротких предложения с bis zu, an … vorbei и gegenüber von.',
        'Вокзалдан почтага чейинки жолду түшүндүрүңүз: bis zu, an … vorbei жана gegenüber von менен үч кыска сүйлөм.',
      ),
      sample: 'Gehen Sie geradeaus bis zur Kreuzung. Gehen Sie an der Bank vorbei. Die Post ist gegenüber von der Apotheke.',
      keywords: ['bis zur', 'vorbei', 'gegenüber'],
    },
    source: UNIT_19_SOURCE,
  },
]

/** "Why?" notes of Unit 19. */
export const UNIT_19_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Hier darf man nicht parken.',
    ru: 'Здесь нельзя парковаться.',
    ky: 'Бул жерде унаа токтотууга болбойт.',
    word: 'darf',
    conceptId: 'a2-man-regeln-verbote',
    reason: l(
      'После man модальный глагол стоит в форме как после er / sie: darf, а не dürfen. Nicht dürfen — запрет; nicht müssen — «не обязательно».',
      'man сөзүнөн кийин модалдык этиш er / sie сыяктуу формада турат: darf, dürfen эмес. Nicht dürfen — тыюу; nicht müssen — «милдеттүү эмес».',
    ),
    more: [
      { de: 'Man muss nicht bezahlen.', ru: 'Платить не нужно.', ky: 'Төлөөнүн кереги жок.' },
      { de: 'Man muss das Formular ausfüllen.', ru: 'Нужно заполнить бланк.', ky: 'Бланкты толтуруу керек.' },
    ],
  },
  {
    sentence: 'Können Sie mir sagen, wo die Post ist?',
    ru: 'Вы не подскажете, где почта?',
    ky: 'Почта кайда экенин айтып бере аласызбы?',
    word: 'ist',
    conceptId: 'a2-indirekte-fragen',
    reason: l(
      'Вопрос «Wo ist die Post?» вставлен в рамку «Können Sie mir sagen, …?». Внутри рамки это придаточное: вопросительное слово wo стоит первым, а глагол ist уходит в конец.',
      '«Wo ist die Post?» деген суроо «Können Sie mir sagen, …?» алкагына салынган. Алкактын ичинде бул бириккен сүйлөм: суроо сөзү wo биринчи турат, ал эми ist этиши аягына өтөт.',
    ),
    more: [
      { de: 'Ich möchte wissen, ob ich einen Termin brauche.', ru: 'Я хотел бы знать, нужна ли мне запись.', ky: 'Мага кабыл алуу убактысы керекпи, билгим келет.' },
      { de: 'Können Sie mir sagen, wann das Amt geöffnet ist?', ru: 'Вы не подскажете, когда открыто учреждение?', ky: 'Мекеме качан ачык экенин айтып бере аласызбы?' },
    ],
  },
  {
    sentence: 'Gehen Sie bis zur Kreuzung.',
    ru: 'Идите до перекрёстка.',
    ky: 'Жол кесилишине чейин барыңыз.',
    word: 'zur',
    conceptId: 'a2-wegbeschreibung-praepositionen',
    reason: l(
      'Bis zu + Dativ: zu der Kreuzung → zur Kreuzung. Die Kreuzung женского рода, поэтому после zu стоит der, а вместе они сливаются в zur.',
      'Bis zu + Dativ: zu der Kreuzung → zur Kreuzung. Die Kreuzung — аял жынысында, ошондуктан zu сөзүнөн кийин der турат, экөө кошулуп zur болот.',
    ),
    more: [
      { de: 'Gehen Sie an der Bank vorbei.', ru: 'Пройдите мимо банка.', ky: 'Банктын жанынан өтүп барыңыз.' },
      { de: 'Die Post ist gegenüber von der Apotheke.', ru: 'Почта находится напротив аптеки.', ky: 'Почта дарыканын каршысында.' },
    ],
  },
]
