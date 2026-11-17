import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_19_SOURCE } from '../provenance'

/**
 * Unit 19 texts (Stage 7J): 2 listening dialogues, 2 readings, 1 speaking scenario, 1 writing task. Formal register (Sie) by design of the unit.
 * L1 = Bürgeramt (registration, documents, form, deadline); L2 = the DIRECTIONS micro-task on the street (ask for the post office, understand the route, then
 * the parcel counter and the cash machine). R1 = a form with instructions; R2 = a notice board (opening hours, rules, a diversion). S1 = the directions micro-task
 * in the speaking lab (explain a short route from a mini-map, answer, ask an indirect question). W1 = a short formal e-mail to an office.
 * Administrative content describes the GERMAN procedure as language practice; no legal advice. Rules applied: man only with a modal; indirect questions only with the
 * two frames; Imperativ Sie; no adjective after a Dativ preposition; no ordinals; no Passiv notices; receptive words (Aufenthaltserlaubnis, überweisen, Umleitung)
 * only in texts, never as a required answer.
 */
export const UNIT_19_LISTENING: ListeningExercise[] = [
  {
    id: 'a2-li-19-01',
    unit: 19,
    level: 'A2',
    title: 'Im Bürgeramt: Anmeldung',
    lines: [
      { speaker: 'Frau Keller', text: 'Guten Tag und willkommen im Bürgeramt. Wie kann ich Ihnen helfen?', ru: 'Добрый день и добро пожаловать в бюро обслуживания граждан. Чем могу вам помочь?', ky: 'Кайырлуу күн, жарандарды тейлөө бөлүмүнө кош келиңиз. Сизге кантип жардам берсем болот?' },
      { speaker: 'Herr Novak', text: 'Guten Tag. Ich wohne seit einer Woche hier. Ich möchte mich anmelden.', ru: 'Добрый день. Я живу здесь уже неделю. Я хотел бы зарегистрироваться.', ky: 'Кайырлуу күн. Мен бул жерде бир жумадан бери жашайм. Мен каттоодон өткүм келет.' },
      { speaker: 'Frau Keller', text: 'Haben Sie einen Termin?', ru: 'У вас есть запись на приём?', ky: 'Сизде кабыл алуу убактысы барбы?' },
      { speaker: 'Herr Novak', text: 'Ja, heute um 10 Uhr. Hier ist mein Ausweis. Brauche ich noch etwas?', ru: 'Да, сегодня в 10 часов. Вот моё удостоверение личности. Нужно ли ещё что-нибудь?', ky: 'Ооба, бүгүн саат 10да. Мына менин инсандыгымды күбөлөндүрүүчү документим. Дагы бир нерсе керекпи?' },
      { speaker: 'Frau Keller', text: 'Ja, den Mietvertrag. Haben Sie ihn dabei?', ru: 'Да, договор аренды. Он у вас с собой?', ky: 'Ооба, ижара келишими. Ал сизде барбы?' },
      { speaker: 'Herr Novak', text: 'Ja, hier. Und das Formular habe ich schon ausgefüllt.', ru: 'Да, вот. И бланк я уже заполнил.', ky: 'Ооба, мына. Ал эми бланкты мен мурун эле толтурдум.' },
      { speaker: 'Frau Keller', text: 'Gut. Aber hier fehlt Ihre Unterschrift. Bitte unterschreiben Sie hier.', ru: 'Хорошо. Но здесь не хватает вашей подписи. Пожалуйста, подпишите здесь.', ky: 'Жакшы. Бирок бул жерде сиздин кол тамгаңыз жок. Сураныч, бул жерге кол коюңуз.' },
      { speaker: 'Herr Novak', text: 'Entschuldigung. Können Sie mir sagen, wie lange die Anmeldung dauert?', ru: 'Извините. Вы не подскажете, сколько времени занимает регистрация?', ky: 'Кечиресиз. Каттоо канча убакытка созулаарын айтып бере аласызбы?' },
      { speaker: 'Frau Keller', text: 'Nur fünf Minuten. Für die Aufenthaltserlaubnis gehen Sie bitte zum Amt in der Bahnhofstraße.', ru: 'Всего пять минут. За разрешением на пребывание идите, пожалуйста, в учреждение на Бангофштрассе.', ky: 'Болгону беш мүнөт. Жашоого уруксат үчүн Бангофштрассеге жайгашкан мекемеге барыңыз.' },
      { speaker: 'Herr Novak', text: 'Danke. Wie lange habe ich Zeit für die Anmeldung?', ru: 'Спасибо. Сколько времени у меня есть на регистрацию?', ky: 'Рахмат. Каттоо үчүн менде канча убакыт бар?' },
      { speaker: 'Frau Keller', text: 'Zwei Wochen. Man darf nicht länger warten.', ru: 'Две недели. Дольше ждать нельзя.', ky: 'Эки жума. Мындан узак күтүүгө болбойт.' },
      { speaker: 'Herr Novak', text: 'Dann habe ich noch eine Woche. Vielen Dank und auf Wiedersehen.', ru: 'Тогда у меня есть ещё неделя. Большое спасибо и до свидания.', ky: 'Анда менде дагы бир жума бар. Чоң рахмат жана кош болуңуз.' },
    ],
    questions: [
      { q: 'Was braucht Herr Novak für die Anmeldung?', options: ['Nur seinen Ausweis', 'Ausweis und Mietvertrag', 'Ausweis und Aufenthaltserlaubnis'], answer: 1 },
      { q: 'Was fehlt auf dem Formular?', options: ['Die Unterschrift', 'Der Name', 'Das Datum'], answer: 0 },
      { q: 'Wie lange dauert die Anmeldung?', options: ['Eine Stunde', 'Zehn Minuten', 'Fünf Minuten'], answer: 2 },
      { q: 'Wie lange hat Herr Novak Zeit für die Anmeldung?', options: ['Eine Woche', 'Zwei Wochen', 'Vier Wochen'], answer: 1 },
    ],
    keywords: ['Bürgeramt', 'Anmeldung', 'Formular', 'Unterschrift', 'Ausweis'],
    source: UNIT_19_SOURCE,
  },
  {
    id: 'a2-li-19-02',
    unit: 19,
    level: 'A2',
    title: 'Auf der Straße: Wo ist die Post?',
    lines: [
      { speaker: 'Frau Lenz', text: 'Entschuldigung, können Sie mir sagen, wo die Post ist?', ru: 'Извините, вы не подскажете, где почта?', ky: 'Кечиресиз, почта кайда экенин айтып бере аласызбы?' },
      { speaker: 'Herr Vogel', text: 'Ja, gern. Gehen Sie hier geradeaus bis zur Kreuzung.', ru: 'Да, с удовольствием. Идите здесь прямо до перекрёстка.', ky: 'Ооба, кубанычта. Бул жерден жол кесилишине чейин түз барыңыз.' },
      { speaker: 'Frau Lenz', text: 'Bis zur Kreuzung. Und dann?', ru: 'До перекрёстка. А потом?', ky: 'Жол кесилишине чейин. Анан эмне?' },
      { speaker: 'Herr Vogel', text: 'Dann gehen Sie rechts, an der Bank vorbei. Die Post ist gegenüber von der Apotheke.', ru: 'Потом идите направо, мимо банка. Почта находится напротив аптеки.', ky: 'Анан оңго барыңыз, банктын жанынан өтүп. Почта дарыканын каршысында.' },
      { speaker: 'Frau Lenz', text: 'Ist das weit?', ru: 'Это далеко?', ky: 'Алысбы?' },
      { speaker: 'Herr Vogel', text: 'Nein, nur fünf Minuten zu Fuß. Die Post ist heute bis 18 Uhr geöffnet.', ru: 'Нет, всего пять минут пешком. Почта сегодня открыта до 18 часов.', ky: 'Жок, жөө болгону беш мүнөт. Почта бүгүн саат 18ге чейин ачык.' },
      { speaker: 'Frau Lenz', text: 'Prima. Ich möchte ein Paket abschicken. Was muss ich tun?', ru: 'Отлично. Я хочу отправить посылку. Что мне нужно сделать?', ky: 'Мыкты. Мен таңгак жөнөткүм келет. Эмне кылышым керек?' },
      { speaker: 'Herr Vogel', text: 'Gehen Sie zu Schalter zwei. Dort bekommen Sie auch Briefmarken. Ein Paket kostet etwa acht Euro.', ru: 'Идите к окошку два. Там вы получите и почтовые марки. Посылка стоит примерно восемь евро.', ky: 'Экинчи терезеге барыңыз. Ал жерден почта маркасын да аласыз. Таңгак болжол менен сегиз евро турат.' },
      { speaker: 'Frau Lenz', text: 'Danke. Gibt es hier auch einen Geldautomaten? Ich muss noch Geld abheben.', ru: 'Спасибо. Здесь есть банкомат? Мне ещё нужно снять деньги.', ky: 'Рахмат. Бул жерде акча чыгаруучу аппарат барбы? Мага дагы акча алуу керек.' },
      { speaker: 'Herr Vogel', text: 'Ja, neben der Bank. Dort kann man auch Geld überweisen. Aber Achtung: Dort ist eine Baustelle. Es gibt eine Umleitung.', ru: 'Да, рядом с банком. Там можно также перевести деньги. Но осторожно: там стройка. Есть объезд.', ky: 'Ооба, банктын жанында. Ал жерде акча да которууга болот. Бирок этият болуңуз: ал жерде курулуш бар. Айланма жол бар.' },
    ],
    questions: [
      { q: 'Wohin geht Frau Lenz an der Kreuzung?', options: ['Nach rechts', 'Nach links', 'Geradeaus'], answer: 0 },
      { q: 'Wo ist die Post?', options: ['Neben der Bank', 'Am Bahnhof', 'Gegenüber von der Apotheke'], answer: 2 },
      { q: 'Wie lange dauert der Weg zu Fuß?', options: ['Zehn Minuten', 'Fünf Minuten', 'Fünfzehn Minuten'], answer: 1 },
      { q: 'Wohin geht Frau Lenz mit dem Paket?', options: ['Zu Schalter zwei', 'Zu Schalter fünf', 'Zum Geldautomaten'], answer: 0 },
    ],
    keywords: ['Kreuzung', 'Post', 'Paket', 'Schalter', 'Geldautomat'],
    source: UNIT_19_SOURCE,
  },
]

export const UNIT_19_READING: ReadingText[] = [
  {
    id: 'a2-re-19-01',
    unit: 19,
    level: 'A2',
    title: 'Formular: Anmeldung beim Bürgeramt',
    body: [
      'Formular: Anmeldung beim Bürgeramt',
      'Bitte ausfüllen: Name, Vorname, Geburtstag, Straße.',
      'Bitte mitbringen: Ausweis und Mietvertrag.',
      'Nicht vergessen: Unterschrift! Ohne Unterschrift ist das Formular nicht fertig.',
      'Abgeben: Schalter 3, Montag bis Freitag von 8 bis 12 Uhr.',
      'Die Anmeldung dauert etwa fünf Minuten. Bei Fragen hilft Ihnen die Auskunft an Schalter 1.',
      'Für die Aufenthaltserlaubnis gibt es ein anderes Formular.',
    ],
    gloss: [
      { word: 'Vorname', ru: 'имя (в отличие от фамилии)', ky: 'аты (фамилиясынан айырмаланып)', example: 'Mein Vorname ist Peter, mein Name ist Novak.', grammar: 'der Vorname — личное имя; der Name на формуляре — фамилия', grammarKy: 'der Vorname — жеке аты; формулярдагы der Name — фамилия', related: ['das Formular', 'der Ausweis'] },
      { word: 'mitbringen', ru: 'принести с собой, взять с собой', ky: 'өзү менен кошо алып келүү', example: 'Bitte bringen Sie den Ausweis mit.', grammar: 'отделяемая приставка mit-: «bringen … mit»; в списке — инфинитив', grammarKy: 'mit- приставкасы сүйлөмдө этиштен бөлүнүп турат: «bringen … mit»; тизмеде — инфинитив', related: ['der Ausweis', 'abschicken'] },
      { word: 'Ohne', ru: 'без', ky: 'жок', example: 'Ohne Termin geht es nicht.', grammar: 'ohne + Akkusativ: «ohne Unterschrift» (существительное без артикля)', grammarKy: 'ohne + Akkusativ: «ohne Unterschrift» (артиклсиз зат атооч)', related: ['die Unterschrift', 'der Antrag'] },
      { word: 'abgeben', ru: 'сдать, подать (документ)', ky: 'тапшыруу (документти)', example: 'Ich gebe das Formular am Schalter ab.', grammar: 'отделяемая приставка ab-: «geben … ab»; в списке — инфинитив', grammarKy: 'ab- приставкасы сүйлөмдө этиштен бөлүнүп турат: «geben … ab»; тизмеде — инфинитив', related: ['der Schalter', 'ausfüllen'] },
      { word: 'fertig', ru: 'готов, завершён', ky: 'даяр, бүткөн', example: 'Die Anmeldung ist fertig.', grammar: 'прилагательное в сказуемом: «ist fertig» (без окончаний)', grammarKy: 'баяндоочтогу сын атооч: «ist fertig» (жалгоосуз)', related: ['die Anmeldung', 'unterschreiben'] },
    ],
    questions: [
      { q: 'Was muss man mitbringen?', options: ['Nur den Ausweis', 'Den Ausweis und den Mietvertrag', 'Die Aufenthaltserlaubnis und den Ausweis'], answer: 1 },
      { q: 'Wo muss man das Formular abgeben?', options: ['Am Schalter 1', 'Am Schalter 5', 'Am Schalter 3'], answer: 2 },
      { q: 'Was darf man nicht vergessen?', options: ['Die Unterschrift', 'Das Foto', 'Die Briefmarke'], answer: 0 },
    ],
    source: UNIT_19_SOURCE,
  },
  {
    id: 'a2-re-19-02',
    unit: 19,
    level: 'A2',
    title: 'Rathaus: Öffnungszeiten und Regeln',
    body: [
      'Rathaus: Öffnungszeiten und Regeln',
      'Bürgeramt: Montag bis Freitag 8 bis 12 Uhr. Donnerstag auch 14 bis 18 Uhr. Samstag und Sonntag geschlossen.',
      'Im Haus: Bitte nicht rauchen. Man darf hier keine Fotos machen.',
      'Parkplatz: Nur für Besucher. Man darf höchstens zwei Stunden parken.',
      'Achtung Baustelle: Es gibt eine Umleitung. Der Eingang ist jetzt hinter dem Haus.',
    ],
    gloss: [
      { word: 'Besucher', ru: 'посетитель, гость', ky: 'келүүчү, конок', example: 'Der Parkplatz ist nur für Besucher.', grammar: 'der Besucher — мужской род; женский род: die Besucherin', grammarKy: 'der Besucher — эркек жынысы; аял жынысы: die Besucherin', related: ['der Parkplatz', 'das Rathaus'] },
      { word: 'höchstens', ru: 'самое большее, не более', ky: 'эң көп дегенде', example: 'Die Anmeldung dauert höchstens zehn Minuten.', grammar: 'наречие: höchstens + число; «не больше»', grammarKy: 'тактооч: höchstens + сан; «көп дегенде»', related: ['parken', 'die Öffnungszeiten'] },
      { word: 'Eingang', ru: 'вход', ky: 'кире бериш', example: 'Der Eingang ist neben der Bank.', grammar: 'der Eingang; противоположное слово — der Ausgang (выход)', grammarKy: 'der Eingang; тескери сөз — der Ausgang (чыгуу)', related: ['das Schild', 'geöffnet'] },
      { word: 'Bitte nicht rauchen', ru: 'просьба не курить', ky: 'тамеки чекпегиле деп суранабыз', example: 'Bitte nicht parken.', grammar: 'табличка: Bitte nicht + инфинитив (без zu)', grammarKy: 'такта: Bitte nicht + инфинитив (zu жок)', related: ['verboten', 'erlaubt'] },
      { word: 'Samstag und Sonntag geschlossen', ru: 'в субботу и воскресенье закрыто', ky: 'ишемби жана жекшемби жабык', example: 'Montag geschlossen.', grammar: 'в объявлении глагол sein опускают: «Sonntag geschlossen» = «Am Sonntag ist geschlossen»', grammarKy: 'жарыяда sein этиши түшүрүлөт: «Sonntag geschlossen» = «Am Sonntag ist geschlossen»', related: ['geöffnet', 'geschlossen'] },
    ],
    questions: [
      { q: 'Wann ist das Bürgeramt am Donnerstag auch geöffnet?', options: ['Am Nachmittag bis 18 Uhr', 'Nur am Vormittag', 'Am Abend bis 20 Uhr'], answer: 0 },
      { q: 'Was ist im Haus verboten?', options: ['Telefonieren', 'Fotos machen', 'Fragen stellen'], answer: 1 },
      { q: 'Wo ist der Eingang jetzt?', options: ['Vor dem Haus', 'Neben dem Parkplatz', 'Hinter dem Haus'], answer: 2 },
    ],
    source: UNIT_19_SOURCE,
  },
]

export const UNIT_19_SPEAKING: SpeakingScenario[] = [
  {
    id: 'a2-sp-19-01',
    title: 'Nach dem Weg fragen und erklären',
    titleRu: 'Спросить дорогу и объяснить путь',
    titleKy: 'Жолду сурап, түшүндүрүү',
    icon: '🗺️',
    level: 'A2',
    goal: {
      ru: 'Вы стоите на вокзале. Мини-карта: от вокзала идите прямо до перекрёстка, потом направо, мимо банка; почта находится напротив аптеки (пять минут пешком, открыта до 18 часов). Незнакомый человек спрашивает вас о дороге (на «Sie»). Объясните путь, ответьте на вопросы и в конце сами задайте один вежливый вопрос.',
      ky: 'Сиз вокзалда турасыз. Мини-карта: вокзалдан жол кесилишине чейин түз, анан оңго, банктын жанынан өтүп барасыз; почта дарыканын каршысында (жөө беш мүнөт, саат 18ге чейин ачык). Тааныш эмес адам сизден жол сурайт («Sie» формасында). Жолду түшүндүрүңүз, суроолорго жооп бериңиз жана аягында өзүңүз бир сылык суроо бериңиз.',
    },
    turns: [
      {
        ai: 'Entschuldigung, können Sie mir sagen, wo hier die Post ist?',
        aiRu: 'Извините, вы не подскажете, где здесь почта?',
        aiKy: 'Кечиресиз, бул жерде почта кайда экенин айтып бере аласызбы?',
        hints: ['Gehen Sie geradeaus bis zur Kreuzung.', 'Dann gehen Sie rechts, an der Bank vorbei.'],
        keywords: ['geradeaus', 'kreuzung'],
      },
      {
        ai: 'Und wo genau ist die Post?',
        aiRu: 'А где именно находится почта?',
        aiKy: 'Ал эми почта так кайда?',
        hints: ['Die Post ist gegenüber von der Apotheke.', 'Sie ist neben der Apotheke.'],
        keywords: ['gegenüber', 'apotheke'],
      },
      {
        ai: 'Ist das weit? Und ist die Post noch geöffnet?',
        aiRu: 'Это далеко? И почта ещё открыта?',
        aiKy: 'Алысбы? Почта дагы ачыкпы?',
        hints: ['Nein, nur fünf Minuten zu Fuß.', 'Ja, die Post ist bis 18 Uhr geöffnet.'],
        keywords: ['minuten', 'geöffnet'],
      },
      {
        ai: 'Vielen Dank! Haben Sie auch eine Frage an mich?',
        aiRu: 'Большое спасибо! У вас тоже есть ко мне вопрос?',
        aiKy: 'Чоң рахмат! Сизде мага да бир суроо барбы?',
        hints: ['Können Sie mir sagen, wo hier ein Geldautomat ist?', 'Ich möchte wissen, ob die Bank noch geöffnet ist.'],
        keywords: ['können sie mir sagen', 'ich möchte wissen'],
      },
    ],
    source: UNIT_19_SOURCE,
  },
]

export const UNIT_19_WRITING: WritingTask[] = [
  {
    id: 'a2-wr-19-01',
    unit: 19,
    level: 'A2',
    title: 'Eine E-Mail an das Bürgeramt',
    situation: {
      ru: 'Вы недавно переехали и хотите зарегистрироваться. Напишите короткое официальное письмо (e-mail) в бюро обслуживания граждан: поприветствуйте, спросите часы работы (индиректный вопрос), спросите, нужна ли запись (ob …), напишите одно предложение с man, поблагодарите и вежливо попрощайтесь. Это языковое упражнение; настоящие правила уточняйте в учреждении.',
      ky: 'Сиз жакында көчүп келип, каттоодон өткүңүз келет. Жарандарды тейлөө бөлүмүнө кыска расмий кат (e-mail) жазыңыз: саламдашыңыз, иштөө убактысын сураңыз (кыйыр суроо), кабыл алуу убактысы керекпи деп сураңыз (ob …), man менен бир сүйлөм жазыңыз, рахмат айтып, сылык коштошуңуз. Бул тилдик көнүгүү; чыныгы эрежелерди мекемеден тактаңыз.',
    },
    formal: true,
    minWords: 60,
    mustInclude: [
      { label: 'Anrede (Sehr geehrte Damen und Herren)', patterns: ['sehr geehrte', 'sehr geehrter'] },
      { label: 'Frage nach den Öffnungszeiten mit „Können Sie mir sagen, wann/wo …?“', patterns: ['können sie mir sagen'] },
      { label: 'Frage mit „ob“ (Ich möchte wissen, ob …)', patterns: ['ob '] },
      { label: 'Ein Satz mit „man“ (Man muss … / Man darf … / Kann man …?)', patterns: ['man '] },
      { label: 'Dank (Vielen Dank / Danke für Ihre Auskunft)', patterns: ['vielen dank', 'danke'] },
      { label: 'Gruß (Mit freundlichen Grüßen)', patterns: ['mit freundlichen grüßen', 'freundliche grüße'] },
    ],
    model:
      'Sehr geehrte Damen und Herren, ich wohne seit einer Woche in Köln und möchte mich anmelden. Können Sie mir sagen, wann das Bürgeramt am Donnerstag geöffnet ist? Ich möchte auch wissen, ob ich einen Termin brauche. Ich weiß: Man muss den Ausweis und den Mietvertrag mitbringen. Das Formular habe ich schon ausgefüllt. Vielen Dank für Ihre Auskunft. Mit freundlichen Grüßen, Peter Novak',
    tips: [
      {
        ru: 'Это официальное письмо: пишите на «Sie» и начните с «Sehr geehrte Damen und Herren». В конце — «Mit freundlichen Grüßen» и ваше имя.',
        ky: 'Бул расмий кат: «Sie» формасында жазып, «Sehr geehrte Damen und Herren» деп баштаңыз. Аягында — «Mit freundlichen Grüßen» жана атыңыз.',
      },
      {
        ru: 'Вежливый вопрос: «Können Sie mir sagen, wann das Bürgeramt geöffnet ist?» — глагол в конце. Вопрос «да / нет»: «Ich möchte wissen, ob ich einen Termin brauche.»',
        ky: 'Сылык суроо: «Können Sie mir sagen, wann das Bürgeramt geöffnet ist?» — этиш аягында. «Ооба / жок» суроосу: «Ich möchte wissen, ob ich einen Termin brauche.»',
      },
      {
        ru: 'Одно правило с man: «Man muss den Ausweis mitbringen» или «Man darf hier nicht parken». Форма как после er / sie.',
        ky: 'man менен бир эреже: «Man muss den Ausweis mitbringen» же «Man darf hier nicht parken». Форма er / sie сыяктуу.',
      },
      {
        ru: 'Достаточно простых слов: Termin, Ausweis, Formular, Öffnungszeiten. Пишите короткими предложениями и проверьте, что в письме есть все шесть элементов.',
        ky: 'Жөнөкөй сөздөр жетиштүү: Termin, Ausweis, Formular, Öffnungszeiten. Кыска сүйлөмдөр менен жазып, катта алты элементтин баары бар экенин текшериңиз.',
      },
    ],
    source: UNIT_19_SOURCE,
  },
]
