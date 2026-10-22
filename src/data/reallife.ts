import type { L10n, RealLifeTopic, TestDef } from './types'

type P = [string, string]
type D = [string, string, string]
const w = (ru: string): L10n => ({ ru })

const T = (id: string, icon: string, title: string, titleRu: string, vocab: P[], phrases: P[], dialogue: D[], q: string, options: string[], answer: number, why: string, speakingScenarioId?: string): RealLifeTopic => ({
  id, icon, title, titleRu,
  vocab: vocab.map(([de, ru]) => ({ de, ru })),
  phrases: phrases.map(([de, ru]) => ({ de, ru })),
  dialogue: dialogue.map(([speaker, text, ru]) => ({ speaker, text, ru })),
  challenge: { q, options, answer, why: w(why) },
  speakingScenarioId,
})

export const REAL_LIFE: RealLifeTopic[] = [
  T('wohnung', '🏠', 'Wohnung', 'Жильё', [['die Kaution', 'залог'], ['die Nebenkosten', 'коммунальные платежи'], ['der Mietvertrag', 'договор аренды'], ['die Besichtigung', 'осмотр']],
    [['Ist die Wohnung noch frei?', 'Квартира ещё свободна?'], ['Wie hoch sind die Nebenkosten?', 'Каковы коммунальные платежи?'], ['Wann kann ich einziehen?', 'Когда я могу въехать?']],
    [['Mieter', 'Ist die Wohnung noch frei?', 'Квартира ещё свободна?'], ['Vermieter', 'Ja. Sie kostet 650 Euro warm.', 'Да. Она стоит 650 евро с коммунальными.'], ['Mieter', 'Wann kann ich sie besichtigen?', 'Когда я могу её посмотреть?']],
    'Was bedeutet „warm“ bei der Miete?', ['Die Nebenkosten sind schon enthalten.', 'Die Wohnung ist beheizt.', 'Die Miete ist teuer.'], 0, '«Warmmiete» = аренда вместе с отоплением и коммунальными платежами.', 'viewing'),
  T('arbeit', '💼', 'Arbeit', 'Работа', [['der Arbeitsvertrag', 'трудовой договор'], ['die Probezeit', 'испытательный срок'], ['der Urlaub', 'отпуск'], ['die Krankmeldung', 'больничный']],
    [['Ich bin neu im Team.', 'Я новенький в команде.'], ['Wann ist Feierabend?', 'Когда заканчивается рабочий день?'], ['Ich bin heute krank.', 'Я сегодня болен.']],
    [['Chef', 'Willkommen! Ihre Probezeit dauert sechs Monate.', 'Добро пожаловать! Ваш испытательный срок — шесть месяцев.'], ['Mitarbeiter', 'Verstanden. Wann beginnt die Arbeit?', 'Понятно. Когда начинается работа?'], ['Chef', 'Um acht Uhr.', 'В восемь часов.']],
    'Wie lange dauert die Probezeit im Beispiel?', ['Drei Monate', 'Sechs Monate', 'Ein Jahr'], 1, 'Im Dialog sagt der Chef: «sechs Monate».', 'work'),
  T('bewerbung', '📄', 'Bewerbung', 'Заявление о приёме', [['der Lebenslauf', 'резюме'], ['das Anschreiben', 'сопроводительное письмо'], ['das Vorstellungsgespräch', 'собеседование'], ['die Stelle', 'вакансия']],
    [['Ich bewerbe mich um die Stelle als …', 'Я претендую на должность …'], ['Ich habe zwei Jahre Erfahrung.', 'У меня два года опыта.'], ['Ich würde mich über eine Einladung freuen.', 'Я буду рад приглашению.']],
    [['Chefin', 'Warum möchten Sie bei uns arbeiten?', 'Почему вы хотите у нас работать?'], ['Bewerber', 'Weil Ihre Firma sehr modern ist.', 'Потому что ваша фирма очень современная.'], ['Chefin', 'Wann könnten Sie anfangen?', 'Когда вы могли бы начать?']],
    'Was gehört in eine Bewerbung?', ['Lebenslauf und Anschreiben', 'Nur ein Foto', 'Der Mietvertrag'], 0, 'Стандартный пакет: Lebenslauf + Anschreiben (+ Zeugnisse).', 'interview'),
  T('arzt', '🩺', 'Arzt', 'Врач', [['die Schmerzen', 'боли'], ['das Rezept', 'рецепт'], ['die Krankenkasse', 'больничная касса'], ['die Überweisung', 'направление']],
    [['Ich habe Kopfschmerzen.', 'У меня болит голова.'], ['Ich brauche ein Rezept.', 'Мне нужен рецепт.'], ['Ich habe einen Termin um zehn Uhr.', 'У меня приём в десять.']],
    [['Ärztin', 'Was fehlt Ihnen?', 'На что жалуетесь?'], ['Patient', 'Ich habe Fieber und Husten.', 'У меня температура и кашель.'], ['Ärztin', 'Ich schreibe Ihnen ein Rezept.', 'Я выпишу вам рецепт.']],
    'Wohin geht man mit einem Rezept?', ['In die Apotheke', 'Zur Post', 'Zur Bank'], 0, 'Rezept → Apotheke.', 'doctor'),
  T('apotheke', '💊', 'Apotheke', 'Аптека', [['die Tablette', 'таблетка'], ['das Medikament', 'лекарство'], ['rezeptfrei', 'без рецепта'], ['die Nebenwirkung', 'побочное действие']],
    [['Haben Sie etwas gegen Kopfschmerzen?', 'У вас есть что-нибудь от головной боли?'], ['Wie oft muss ich das nehmen?', 'Как часто нужно это принимать?'], ['Ich habe ein Rezept.', 'У меня есть рецепт.']],
    [['Kunde', 'Haben Sie etwas gegen Husten?', 'У вас есть что-нибудь от кашля?'], ['Apothekerin', 'Ja, dieser Saft ist rezeptfrei.', 'Да, этот сироп без рецепта.'], ['Kunde', 'Wie oft muss ich ihn nehmen?', 'Как часто нужно его принимать?']],
    'Was bedeutet „rezeptfrei“?', ['Man braucht kein Rezept.', 'Das Medikament ist gratis.', 'Nur mit Rezept.'], 0, 'rezept-frei = «свободно от рецепта».'),
  T('bank', '🏦', 'Bank', 'Банк', [['das Konto', 'счёт'], ['die Überweisung', 'перевод'], ['die Karte', 'карта'], ['abheben', 'снимать']],
    [['Ich möchte ein Konto eröffnen.', 'Я хотел бы открыть счёт.'], ['Ich möchte Geld abheben.', 'Я хотел бы снять деньги.'], ['Wie hoch sind die Gebühren?', 'Каков размер комиссий?']],
    [['Kunde', 'Ich möchte ein Konto eröffnen.', 'Я хотел бы открыть счёт.'], ['Berater', 'Haben Sie Ihren Pass und Ihre Meldebescheinigung dabei?', 'У вас с собой паспорт и справка о регистрации?'], ['Kunde', 'Ja, hier bitte.', 'Да, вот пожалуйста.']],
    'Welche Dokumente braucht man für ein Konto?', ['Pass und Meldebescheinigung', 'Nur eine Fahrkarte', 'Ein Rezept'], 0, 'Нужны документ и подтверждение регистрации.'),
  T('post', '📮', 'Post', 'Почта', [['das Paket', 'посылка'], ['der Brief', 'письмо'], ['die Briefmarke', 'марка'], ['abholen', 'забирать']],
    [['Ich möchte ein Paket abholen.', 'Я хотел бы забрать посылку.'], ['Was kostet ein Brief nach Polen?', 'Сколько стоит письмо в Польшу?'], ['Eine Briefmarke, bitte.', 'Одну марку, пожалуйста.']],
    [['Kunde', 'Ich möchte ein Paket abholen.', 'Я хотел бы забрать посылку.'], ['Mitarbeiter', 'Haben Sie die Benachrichtigung dabei?', 'У вас с собой уведомление?'], ['Kunde', 'Ja, und meinen Ausweis.', 'Да, и мой документ.']],
    'Was bedeutet „abholen“?', ['забирать', 'отправлять', 'терять'], 0, 'abholen — прийти и забрать.'),
  T('supermarkt', '🛒', 'Supermarkt', 'Супермаркет', [['das Pfand', 'залог за тару'], ['die Tüte', 'пакет'], ['das Angebot', 'акция'], ['die Kasse', 'касса']],
    [['Wo finde ich die Milch?', 'Где найти молоко?'], ['Brauchen Sie eine Tüte?', 'Вам нужен пакет?'], ['Mit Karte, bitte.', 'Картой, пожалуйста.']],
    [['Kassiererin', 'Brauchen Sie eine Tüte?', 'Вам нужен пакет?'], ['Kunde', 'Ja, bitte. Und kann ich mit Karte zahlen?', 'Да, пожалуйста. И можно заплатить картой?'], ['Kassiererin', 'Natürlich.', 'Конечно.']],
    'Was ist „Pfand“?', ['Залог за бутылку', 'Скидка', 'Пакет'], 0, 'Pfand возвращают при сдаче бутылок.', 'supermarket'),
  T('bahn', '🚆', 'Deutsche Bahn', 'Немецкие железные дороги', [['das Gleis', 'путь'], ['die Verspätung', 'опоздание'], ['umsteigen', 'пересаживаться'], ['der Anschluss', 'пересадка, стыковка']],
    [['Von welchem Gleis fährt der Zug?', 'С какого пути отправляется поезд?'], ['Der Zug hat Verspätung.', 'Поезд опаздывает.'], ['Muss ich umsteigen?', 'Мне нужно пересаживаться?']],
    [['Reisender', 'Wann fährt der nächste Zug nach Köln?', 'Когда отправляется ближайший поезд до Кёльна?'], ['Mitarbeiter', 'Um 10:15 Uhr von Gleis 7.', 'В 10:15 с пути 7.'], ['Reisender', 'Danke!', 'Спасибо!']],
    'Von welchem Gleis fährt der Zug im Dialog?', ['Gleis 7', 'Gleis 10', 'Gleis 15'], 0, '«von Gleis 7».', 'station'),
  T('behoerde', '🏛️', 'Ausländerbehörde', 'Ведомство по делам иностранцев', [['die Aufenthaltserlaubnis', 'вид на жительство'], ['verlängern', 'продлевать'], ['der Antrag', 'заявление'], ['die Unterlagen', 'документы']],
    [['Ich möchte meinen Aufenthaltstitel verlängern.', 'Я хотел бы продлить свой вид на жительство.'], ['Welche Unterlagen brauche ich?', 'Какие документы мне нужны?'], ['Ich habe einen Termin.', 'У меня назначено.']],
    [['Mitarbeiter', 'Haben Sie alle Unterlagen dabei?', 'У вас с собой все документы?'], ['Antragsteller', 'Ja, hier ist mein Pass und mein Arbeitsvertrag.', 'Да, вот мой паспорт и трудовой договор.'], ['Mitarbeiter', 'Danke, bitte warten Sie draußen.', 'Спасибо, подождите, пожалуйста, снаружи.']],
    'Was bedeutet „Unterlagen“?', ['Документы', 'Подарки', 'Деньги'], 0, 'Unterlagen = документы / бумаги.', 'office'),
  T('anmeldung', '📝', 'Anmeldung', 'Регистрация по месту жительства', [['die Anmeldung', 'регистрация'], ['das Bürgeramt', 'бюро регистрации'], ['die Meldebescheinigung', 'справка о регистрации'], ['umziehen', 'переезжать']],
    [['Ich möchte mich anmelden.', 'Я хотел бы зарегистрироваться.'], ['Ich bin gestern umgezogen.', 'Я вчера переехал.'], ['Hier ist mein Mietvertrag.', 'Вот мой договор аренды.']],
    [['Mitarbeiterin', 'Wie kann ich Ihnen helfen?', 'Чем могу помочь?'], ['Bürger', 'Ich möchte mich anmelden. Ich bin neu in der Stadt.', 'Я хотел бы зарегистрироваться. Я новенький в городе.'], ['Mitarbeiterin', 'Haben Sie Ihren Mietvertrag dabei?', 'У вас с собой договор аренды?']],
    'Was braucht man für die Anmeldung?', ['Pass und Mietvertrag', 'Einen Koffer', 'Ein Rezept'], 0, 'Нужен документ и подтверждение адреса.'),
  T('telefon', '📞', 'Telefon', 'Телефон', [['der Anrufbeantworter', 'автоответчик'], ['zurückrufen', 'перезвонить'], ['die Nachricht', 'сообщение'], ['verbinden', 'соединить']],
    [['Könnten Sie das bitte wiederholen?', 'Не могли бы вы повторить?'], ['Ich rufe später noch einmal an.', 'Я позвоню позже ещё раз.'], ['Können Sie mich mit Herrn Weber verbinden?', 'Можете соединить меня с господином Вебером?']],
    [['Anrufer', 'Guten Tag, ich möchte Frau Weber sprechen.', 'Добрый день, я хотел бы поговорить с госпожой Вебер.'], ['Zentrale', 'Einen Moment, ich verbinde Sie.', 'Минутку, я вас соединю.'], ['Anrufer', 'Vielen Dank.', 'Большое спасибо.']],
    'Was bedeutet „Ich verbinde Sie“?', ['Я вас соединю', 'Я вас забуду', 'Я вам помогу забрать'], 0, 'verbinden = соединять.', 'phone'),
  T('behoerden', '📑', 'Behörden', 'Учреждения и формуляры', [['das Formular', 'формуляр'], ['ausfüllen', 'заполнять'], ['unterschreiben', 'подписывать'], ['die Frist', 'срок']],
    [['Wo muss ich unterschreiben?', 'Где мне нужно подписать?'], ['Können Sie mir helfen, das Formular auszufüllen?', 'Вы можете помочь мне заполнить формуляр?'], ['Bis wann muss ich das abgeben?', 'До какого срока нужно это сдать?']],
    [['Bürger', 'Können Sie mir bitte beim Formular helfen?', 'Вы можете мне помочь с формуляром?'], ['Mitarbeiter', 'Natürlich. Hier bitte Name und Adresse.', 'Конечно. Здесь, пожалуйста, имя и адрес.'], ['Bürger', 'Und hier unterschreibe ich?', 'А здесь я подписываю?']],
    'Was macht man mit einem Formular?', ['Man füllt es aus.', 'Man isst es.', 'Man fährt damit.'], 0, 'das Formular ausfüllen.'),
  T('universitaet', '🎓', 'Universität', 'Университет', [['die Vorlesung', 'лекция'], ['das Semester', 'семестр'], ['die Prüfung', 'экзамен'], ['die Bibliothek', 'библиотека']],
    [['Wann beginnt die Vorlesung?', 'Когда начинается лекция?'], ['Ich schreibe nächste Woche eine Prüfung.', 'На следующей неделе у меня экзамен.'], ['Wo ist die Bibliothek?', 'Где библиотека?']],
    [['Student A', 'Hast du schon für die Prüfung gelernt?', 'Ты уже готовился к экзамену?'], ['Student B', 'Noch nicht. Ich gehe heute in die Bibliothek.', 'Ещё нет. Сегодня иду в библиотеку.'], ['Student A', 'Gute Idee, ich komme mit.', 'Хорошая идея, я с тобой.']],
    'Wohin geht Student B?', ['In die Bibliothek', 'Zur Post', 'Zum Arzt'], 0, '«Ich gehe heute in die Bibliothek».'),
  T('restaurant', '🍽️', 'Restaurant', 'Ресторан', [['die Vorspeise', 'закуска'], ['das Hauptgericht', 'основное блюдо'], ['das Trinkgeld', 'чаевые'], ['reservieren', 'бронировать']],
    [['Ich hätte gern die Speisekarte.', 'Я бы хотел меню.'], ['Das Essen war sehr lecker.', 'Еда была очень вкусной.'], ['Stimmt so.', 'Сдачи не надо.']],
    [['Kellner', 'Haben Sie schon gewählt?', 'Вы уже выбрали?'], ['Gast', 'Ja, ich nehme das Hauptgericht mit Reis.', 'Да, я возьму основное блюдо с рисом.'], ['Gast', 'Und die Rechnung, bitte. Stimmt so.', 'И счёт, пожалуйста. Сдачи не надо.']],
    'Was bedeutet „Stimmt so“?', ['Сдачи не надо', 'Это неверно', 'Принесите ещё'], 0, 'Так вы оставляете чаевые.', 'restaurant'),
]

export const realLifeById = new Map(REAL_LIFE.map(t => [t.id, t]))

export const TESTS: TestDef[] = [
  { id: 'placement', title: { ru: 'Тест на определение уровня', ky: 'Деңгээлди аныктоо тести', de: 'Einstufungstest' }, kind: 'placement', level: 'A1', size: 12 },
  { id: 'level-a1', title: { ru: 'Тест уровня A1', de: 'A1-Test' }, kind: 'level', level: 'A1', size: 15 },
  { id: 'grammar', title: { ru: 'Тест по грамматике', ky: 'Грамматика тести', de: 'Grammatiktest' }, kind: 'grammar', level: 'A1', size: 12 },
  { id: 'vocabulary', title: { ru: 'Тест по лексике', ky: 'Сөз байлыгы тести', de: 'Wortschatztest' }, kind: 'vocabulary', level: 'A1', size: 15 },
  { id: 'listening', title: { ru: 'Тест на аудирование', ky: 'Угуу тести', de: 'Hörverstehen' }, kind: 'listening', level: 'A1', size: 8 },
  ...Array.from({ length: 10 }, (_, i): TestDef => ({ id: `unit-${i + 1}`, title: { ru: `Мини-тест: юнит ${i + 1}` }, kind: 'topic', level: 'A1', unit: i + 1, size: 8 })),
]
export const testById = new Map(TESTS.map(t => [t.id, t]))
