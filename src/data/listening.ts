import type { LanguageLevel, ListeningExercise } from './types'

type Line = [string, string, string]
type Q = [string, string[], number]

let n = 0
const L = (unit: number, level: LanguageLevel, title: string, lines: Line[], qs: Q[], keywords: string[]): ListeningExercise => ({
  id: `li${String(++n).padStart(2, '0')}`,
  unit,
  level,
  title,
  lines: lines.map(([speaker, text, ru]) => ({ speaker, text, ru })),
  questions: qs.map(([q, options, answer]) => ({ q, options, answer })),
  keywords,
})

export const LISTENING: ListeningExercise[] = [
  L(1, 'A1', 'Sich kennenlernen', [
    ['Anna', 'Hallo, ich bin Anna. Und du?', 'Привет, я Анна. А ты?'],
    ['Tim', 'Hallo Anna, ich bin Tim. Freut mich!', 'Привет, Анна, я Тим. Приятно!'],
    ['Anna', 'Woher kommst du, Tim?', 'Откуда ты, Тим?'],
    ['Tim', 'Ich komme aus Österreich. Und du?', 'Я из Австрии. А ты?'],
    ['Anna', 'Ich komme aus Polen, aber ich wohne in Berlin.', 'Я из Польши, но живу в Берлине.'],
  ], [['Woher kommt Tim?', ['Aus Polen', 'Aus Österreich', 'Aus Berlin'], 1], ['Wo wohnt Anna?', ['In Polen', 'In Wien', 'In Berlin'], 2]], ['kommen', 'wohnen', 'Freut mich']),
  L(1, 'A1', 'Im Deutschkurs', [
    ['Lehrerin', 'Guten Morgen! Wie heißen Sie?', 'Доброе утро! Как вас зовут?'],
    ['Daniiar', 'Guten Morgen. Ich heiße Daniiar.', 'Доброе утро. Меня зовут Данияр.'],
    ['Lehrerin', 'Wie bitte? Können Sie das buchstabieren?', 'Простите? Вы можете назвать по буквам?'],
    ['Daniiar', 'D-A-N-I-I-A-R.', 'Д-А-Н-И-И-А-Р.'],
    ['Lehrerin', 'Danke, Daniiar. Willkommen im Kurs!', 'Спасибо, Данияр. Добро пожаловать на курс!'],
  ], [['Was bittet die Lehrerin?', ['Daniiar soll den Namen buchstabieren.', 'Daniiar soll nach Hause gehen.', 'Daniiar soll Kaffee holen.'], 0]], ['Wie bitte?', 'Name', 'Danke']),
  L(2, 'A1', 'Geschwister', [
    ['Lena', 'Hast du Geschwister?', 'У тебя есть братья и сёстры?'],
    ['Daniiar', 'Ja, ich habe eine Schwester und zwei Brüder.', 'Да, у меня сестра и два брата.'],
    ['Lena', 'Wie alt ist deine Schwester?', 'Сколько лет твоей сестре?'],
    ['Daniiar', 'Sie ist zwölf Jahre alt.', 'Ей двенадцать лет.'],
  ], [['Wie viele Brüder hat Daniiar?', ['Einen', 'Zwei', 'Drei'], 1], ['Wie alt ist die Schwester?', ['Zwölf', 'Zwanzig', 'Zehn'], 0]], ['Schwester', 'Bruder', 'alt']),
  L(2, 'A1', 'Das Familienfoto', [
    ['Tim', 'Wer ist das auf dem Foto?', 'Кто это на фото?'],
    ['Anna', 'Das ist meine Oma. Sie ist achtzig Jahre alt.', 'Это моя бабушка. Ей восемьдесят лет.'],
    ['Tim', 'Und der Mann neben ihr?', 'А мужчина рядом с ней?'],
    ['Anna', 'Das ist mein Opa. Er kocht sehr gern.', 'Это мой дедушка. Он очень любит готовить.'],
  ], [['Wer ist achtzig?', ['Der Opa', 'Die Oma', 'Die Mutter'], 1], ['Was macht der Opa gern?', ['Lesen', 'Kochen', 'Schlafen'], 1]], ['Oma', 'Opa', 'kochen']),
  L(3, 'A1', 'Mein Morgen', [
    ['Max', 'Wann stehst du auf?', 'Когда ты встаёшь?'],
    ['Eva', 'Um halb sieben. Dann dusche ich und frühstücke.', 'В половине седьмого. Потом принимаю душ и завтракаю.'],
    ['Max', 'Und wann fängt die Arbeit an?', 'А когда начинается работа?'],
    ['Eva', 'Um acht Uhr.', 'В восемь часов.'],
  ], [['Wann steht Eva auf?', ['Um 6:30 Uhr', 'Um 8:00 Uhr', 'Um 7:30 Uhr'], 0], ['Was macht Eva nach dem Aufstehen?', ['Sie arbeitet.', 'Sie duscht und frühstückt.', 'Sie kauft ein.'], 1]], ['aufstehen', 'duschen', 'frühstücken']),
  L(3, 'A1', 'Nach der Arbeit', [
    ['Tim', 'Was machst du abends?', 'Что ты делаешь вечером?'],
    ['Anna', 'Ich koche und sehe manchmal fern.', 'Я готовлю и иногда смотрю телевизор.'],
    ['Tim', 'Gehst du nie spazieren?', 'А ты никогда не гуляешь?'],
    ['Anna', 'Doch, am Wochenende oft.', 'Конечно, на выходных часто.'],
  ], [['Wann geht Anna oft spazieren?', ['Abends', 'Am Wochenende', 'Nie'], 1]], ['abends', 'manchmal', 'oft']),
  L(4, 'A1', 'Im Café', [
    ['Kellnerin', 'Guten Tag. Was möchten Sie trinken?', 'Добрый день. Что вы хотите выпить?'],
    ['Gast', 'Ich möchte einen Kaffee mit Milch, bitte.', 'Я хотел бы кофе с молоком, пожалуйста.'],
    ['Kellnerin', 'Gern. Möchten Sie auch etwas essen?', 'Конечно. Хотите что-нибудь поесть?'],
    ['Gast', 'Ja, ein Käsebrötchen, bitte.', 'Да, булочку с сыром, пожалуйста.'],
  ], [['Was bestellt der Gast zu trinken?', ['Tee', 'Kaffee mit Milch', 'Wasser'], 1], ['Was bestellt er zu essen?', ['Ein Käsebrötchen', 'Eine Suppe', 'Einen Salat'], 0]], ['möchten', 'Kaffee', 'Milch']),
  L(4, 'A1', 'Die Rechnung', [
    ['Gast', 'Die Rechnung, bitte.', 'Счёт, пожалуйста.'],
    ['Kellner', 'Zusammen oder getrennt?', 'Вместе или раздельно?'],
    ['Gast', 'Zusammen, bitte.', 'Вместе, пожалуйста.'],
    ['Kellner', 'Das macht achtzehn Euro fünfzig.', 'С вас восемнадцать евро пятьдесят.'],
  ], [['Wie bezahlt der Gast?', ['Getrennt', 'Zusammen', 'Gar nicht'], 1], ['Wie viel kostet es?', ['18,50 €', '15,80 €', '28,50 €'], 0]], ['Rechnung', 'zusammen', 'getrennt']),
  L(5, 'A1', 'Wohnungsbesichtigung', [
    ['Vermieter', 'Die Wohnung hat zwei Zimmer, eine Küche und ein Bad.', 'В квартире две комнаты, кухня и ванная.'],
    ['Interessent', 'Wie hoch ist die Miete?', 'Какая арендная плата?'],
    ['Vermieter', 'Sie kostet 650 Euro im Monat.', 'Она стоит 650 евро в месяц.'],
    ['Interessent', 'Gibt es einen Balkon?', 'Есть балкон?'],
    ['Vermieter', 'Ja, einen kleinen Balkon.', 'Да, небольшой балкон.'],
  ], [['Wie viele Zimmer hat die Wohnung?', ['Eins', 'Zwei', 'Drei'], 1], ['Wie hoch ist die Miete?', ['560 €', '650 €', '605 €'], 1]], ['Miete', 'Balkon', 'Zimmer']),
  L(5, 'A1', 'Der Umzug', [
    ['Tim', 'Wohin kommt das Sofa?', 'Куда пойдёт диван?'],
    ['Anna', 'Ins Wohnzimmer, bitte. Ans Fenster.', 'В гостиную, пожалуйста. К окну.'],
    ['Tim', 'Und der Tisch?', 'А стол?'],
    ['Anna', 'Der steht in der Küche.', 'Он стоит на кухне.'],
  ], [['Wohin kommt das Sofa?', ['In die Küche', 'Ins Wohnzimmer', 'Ins Bad'], 1]], ['Sofa', 'Wohnzimmer', 'Tisch']),
  L(6, 'A1', 'Im Vorstellungsgespräch', [
    ['Chefin', 'Haben Sie Erfahrung als Koch?', 'У вас есть опыт работы поваром?'],
    ['Bewerber', 'Ja, ich habe zwei Jahre Erfahrung.', 'Да, у меня два года опыта.'],
    ['Chefin', 'Können Sie am Wochenende arbeiten?', 'Вы можете работать по выходным?'],
    ['Bewerber', 'Ja, das ist kein Problem.', 'Да, это не проблема.'],
  ], [['Wie lange arbeitet der Bewerber schon als Koch?', ['Ein Jahr', 'Zwei Jahre', 'Drei Jahre'], 1], ['Kann er am Wochenende arbeiten?', ['Ja', 'Nein', 'Vielleicht'], 0]], ['Erfahrung', 'Koch', 'Wochenende']),
  L(6, 'A1', 'Pause im Büro', [
    ['Kollege', 'Machen wir jetzt Pause?', 'Сделаем сейчас перерыв?'],
    ['Kollegin', 'Gern. Ich habe Hunger.', 'С удовольствием. Я голодна.'],
    ['Kollege', 'Wir können in die Kantine gehen.', 'Мы можем пойти в столовую.'],
    ['Kollegin', 'Gute Idee! Ich nehme eine Suppe.', 'Хорошая идея! Я возьму суп.'],
  ], [['Wohin gehen die Kollegen?', ['In die Kantine', 'Ins Büro', 'Nach Hause'], 0]], ['Pause', 'Kollege', 'Suppe']),
  L(7, 'A1', 'Der Weg zum Bahnhof', [
    ['Tourist', 'Entschuldigung, wo ist der Bahnhof?', 'Извините, где вокзал?'],
    ['Passantin', 'Gehen Sie geradeaus bis zur Ampel. Dann links.', 'Идите прямо до светофора. Затем налево.'],
    ['Tourist', 'Ist es weit?', 'Это далеко?'],
    ['Passantin', 'Nein, nur fünf Minuten zu Fuß.', 'Нет, всего пять минут пешком.'],
  ], [['Wo muss der Tourist links abbiegen?', ['An der Ampel', 'An der Bank', 'Am Bahnhof'], 0], ['Wie weit ist es?', ['Fünf Minuten', 'Fünfzig Minuten', 'Fünfzehn Minuten'], 0]], ['geradeaus', 'links', 'Ampel']),
  L(7, 'A1', 'Wo ist die Apotheke?', [
    ['Anna', 'Entschuldigung, wo ist die Apotheke?', 'Извините, где аптека?'],
    ['Mann', 'Die Apotheke ist neben der Bank.', 'Аптека рядом с банком.'],
    ['Anna', 'Und wo ist die Bank?', 'А где банк?'],
    ['Mann', 'Dort rechts, an der Ecke.', 'Вон там справа, на углу.'],
  ], [['Wo ist die Apotheke?', ['Neben der Bank', 'Neben der Post', 'Neben dem Park'], 0]], ['Apotheke', 'Bank', 'Ecke']),
  L(8, 'A1', 'Ein Arzttermin', [
    ['Praxis', 'Praxis Doktor Meier, guten Tag.', 'Практика доктора Майер, добрый день.'],
    ['Patient', 'Guten Tag. Ich möchte einen Termin vereinbaren.', 'Добрый день. Я хотел бы записаться на приём.'],
    ['Praxis', 'Haben Sie am Dienstag um zehn Uhr Zeit?', 'У вас есть время во вторник в десять часов?'],
    ['Patient', 'Ja, das passt gut. Vielen Dank!', 'Да, это подходит. Большое спасибо!'],
  ], [['Wann ist der Termin?', ['Dienstag, 10 Uhr', 'Donnerstag, 10 Uhr', 'Dienstag, 12 Uhr'], 0]], ['Termin', 'vereinbaren', 'Zeit haben']),
  L(8, 'A2', 'Termin verschieben', [
    ['Patient', 'Guten Tag, hier ist Daniiar. Ich habe einen Termin am Montag.', 'Добрый день, это Данияр. У меня приём в понедельник.'],
    ['Praxis', 'Ja, Montag um neun Uhr.', 'Да, в понедельник в девять часов.'],
    ['Patient', 'Leider bin ich krank. Kann ich den Termin verschieben?', 'К сожалению, я болен. Можно перенести приём?'],
    ['Praxis', 'Natürlich. Geht es am Mittwoch um elf Uhr?', 'Конечно. Подойдёт в среду в одиннадцать?'],
  ], [['Warum ruft der Patient an?', ['Er will den Termin verschieben.', 'Er will einen Arzt finden.', 'Er will bezahlen.'], 0], ['Welcher neue Termin wird vorgeschlagen?', ['Mittwoch, 11 Uhr', 'Montag, 9 Uhr', 'Freitag, 11 Uhr'], 0]], ['verschieben', 'leider', 'krank']),
  L(9, 'A1', 'Im Supermarkt', [
    ['Kunde', 'Entschuldigung, wie viel kostet das Brot?', 'Извините, сколько стоит хлеб?'],
    ['Verkäuferin', 'Das Brot kostet zwei Euro dreißig.', 'Хлеб стоит два евро тридцать.'],
    ['Kunde', 'Gut, ich nehme es. Kann ich mit Karte zahlen?', 'Хорошо, я его возьму. Можно заплатить картой?'],
    ['Verkäuferin', 'Ja, natürlich. An der Kasse bitte.', 'Да, конечно. На кассе, пожалуйста.'],
  ], [['Wie viel kostet das Brot?', ['2,30 €', '3,20 €', '2,03 €'], 0], ['Wie möchte der Kunde zahlen?', ['Bar', 'Mit Karte', 'Gar nicht'], 1]], ['kosten', 'Karte', 'Kasse']),
  L(9, 'A2', 'Eine Jacke anprobieren', [
    ['Verkäufer', 'Kann ich Ihnen helfen?', 'Могу я вам помочь?'],
    ['Kundin', 'Ja, ich suche eine Jacke in Größe M.', 'Да, я ищу куртку размера M.'],
    ['Verkäufer', 'Die Umkleide ist dort hinten.', 'Примерочная вон там сзади.'],
    ['Kundin', 'Die Jacke gefällt mir, aber sie ist zu teuer.', 'Куртка мне нравится, но она слишком дорогая.'],
  ], [['Welche Größe sucht die Kundin?', ['S', 'M', 'L'], 1], ['Was ist das Problem?', ['Die Jacke ist zu klein.', 'Die Jacke ist zu teuer.', 'Die Jacke ist zu lang.'], 1]], ['Größe', 'teuer', 'gefallen']),
  L(10, 'A1', 'Am Bahnhof', [
    ['Reisender', 'Eine Fahrkarte nach Hamburg, bitte.', 'Один билет до Гамбурга, пожалуйста.'],
    ['Verkäuferin', 'Der Zug fährt um neun Uhr fünfzehn auf Gleis drei ab.', 'Поезд отправляется в 9:15 с пути три.'],
    ['Reisender', 'Muss ich umsteigen?', 'Мне нужно делать пересадку?'],
    ['Verkäuferin', 'Nein, der Zug fährt direkt.', 'Нет, поезд идёт напрямую.'],
  ], [['Von welchem Gleis fährt der Zug?', ['Gleis 3', 'Gleis 5', 'Gleis 9'], 0], ['Muss der Reisende umsteigen?', ['Ja', 'Nein', 'Das weiß man nicht'], 1]], ['Fahrkarte', 'Gleis', 'umsteigen']),
  L(10, 'A2', 'Durchsage: Verspätung', [
    ['Durchsage', 'Achtung auf Gleis vier. Der Zug nach München hat zwanzig Minuten Verspätung.', 'Внимание, путь четыре. Поезд до Мюнхена опаздывает на двадцать минут.'],
    ['Durchsage', 'Wir bitten um Entschuldigung.', 'Просим прощения.'],
    ['Reisende', 'Oh nein, dann verpasse ich meinen Anschluss.', 'О нет, тогда я упущу пересадку.'],
  ], [['Wie lange hat der Zug Verspätung?', ['10 Minuten', '20 Minuten', '40 Minuten'], 1], ['Was befürchtet die Reisende?', ['Sie verpasst den Anschluss.', 'Sie hat kein Ticket.', 'Sie hat Hunger.'], 0]], ['Verspätung', 'Anschluss', 'Durchsage']),
  L(10, 'A1', 'Am Flughafen', [
    ['Mitarbeiter', 'Guten Tag. Haben Sie Ihren Pass dabei?', 'Добрый день. У вас с собой паспорт?'],
    ['Reisender', 'Ja, hier bitte.', 'Да, вот, пожалуйста.'],
    ['Mitarbeiter', 'Haben Sie einen Koffer?', 'У вас есть чемодан?'],
    ['Reisender', 'Ja, einen großen Koffer.', 'Да, один большой чемодан.'],
  ], [['Was zeigt der Reisende?', ['Seinen Pass', 'Seine Fahrkarte', 'Sein Hotel'], 0]], ['Pass', 'Koffer', 'Flughafen']),
]

export const listeningById = new Map(LISTENING.map(e => [e.id, e]))
export const listeningForUnit = (unit: number) => LISTENING.filter(e => e.unit === unit)
