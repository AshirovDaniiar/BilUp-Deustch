import type { LanguageLevel, SpeakingScenario, SpeakingTurn } from './types'
import type { L10n } from './types'

type T = [string, string, string[], string[]]
const turns = (t: T[]): SpeakingTurn[] => t.map(([ai, aiRu, hints, keywords]) => ({ ai, aiRu, hints, keywords }))
const g = (ru: string, ky?: string): L10n => ({ ru, ky })

const S = (id: string, title: string, titleRu: string, icon: string, level: LanguageLevel, goal: L10n, t: T[]): SpeakingScenario =>
  ({ id, title, titleRu, icon, level, goal, turns: turns(t) })

export const SPEAKING: SpeakingScenario[] = [
  S('restaurant', 'Im Restaurant', 'В ресторане', '🍽️', 'A1', g('Закажите еду и напиток и попросите счёт.', 'Тамак жана суусундук буйрутма бериңиз.'), [
    ['Guten Abend. Was möchten Sie trinken?', 'Добрый вечер. Что вы хотите выпить?', ['Ich möchte ein Wasser, bitte.', 'Einen Tee, bitte.'], ['ich möchte', 'wasser', 'tee', 'bitte']],
    ['Gern. Und was möchten Sie essen?', 'С удовольствием. А что вы хотите поесть?', ['Ich nehme die Suppe.', 'Ich möchte einen Salat, bitte.'], ['ich nehme', 'ich möchte', 'suppe', 'salat']],
    ['Sehr gut. Sonst noch etwas?', 'Отлично. Что-нибудь ещё?', ['Nein, danke. Die Rechnung, bitte.', 'Nein, das ist alles. Zahlen, bitte.'], ['rechnung', 'zahlen', 'danke']],
  ]),
  S('doctor', 'Beim Arzt', 'У врача', '🩺', 'A1', g('Расскажите врачу, что у вас болит.', 'Дарыгерге эмнеңиз ооруганын айтыңыз.'), [
    ['Guten Tag. Was fehlt Ihnen?', 'Добрый день. На что жалуетесь?', ['Ich habe Kopfschmerzen.', 'Ich bin krank und müde.'], ['ich habe', 'kopfschmerzen', 'krank', 'müde']],
    ['Seit wann haben Sie die Schmerzen?', 'С каких пор у вас боли?', ['Seit zwei Tagen.', 'Seit gestern.'], ['seit', 'tagen', 'gestern']],
    ['Ich schreibe Ihnen ein Rezept. Gehen Sie bitte in die Apotheke.', 'Я выпишу вам рецепт. Сходите, пожалуйста, в аптеку.', ['Vielen Dank, Herr Doktor.', 'Danke. Auf Wiedersehen!'], ['danke', 'dank', 'wiedersehen']],
  ]),
  S('supermarket', 'Im Supermarkt', 'В супермаркете', '🛒', 'A1', g('Спросите цену и оплатите покупку.', 'Баасын сураңыз жана төлөңүз.'), [
    ['Hallo! Kann ich Ihnen helfen?', 'Привет! Могу я вам помочь?', ['Ja, wo ist das Brot, bitte?', 'Ich suche die Milch.'], ['wo ist', 'brot', 'milch', 'suche']],
    ['Das Brot ist dort hinten, links.', 'Хлеб вон там сзади, слева.', ['Wie viel kostet das Brot?', 'Danke! Wie viel kostet das?'], ['wie viel', 'kostet', 'danke']],
    ['Zwei Euro dreißig. Zahlen Sie bar oder mit Karte?', 'Два евро тридцать. Вы платите наличными или картой?', ['Mit Karte, bitte.', 'Ich zahle bar.'], ['karte', 'bar', 'zahle']],
  ]),
  S('work', 'Bei der Arbeit', 'На работе', '💼', 'A1', g('Поздоровайтесь с коллегой и расскажите о своей работе.', 'Кесиптешиңиз менен саламдашыңыз.'), [
    ['Guten Morgen! Sie sind neu hier, oder?', 'Доброе утро! Вы здесь новенький, да?', ['Ja, ich bin neu. Ich heiße Daniiar.', 'Ja, ich arbeite seit Montag hier.'], ['ich bin', 'ich heiße', 'neu', 'arbeite']],
    ['Willkommen im Team! Was machen Sie bei uns?', 'Добро пожаловать в команду! Чем вы у нас занимаетесь?', ['Ich arbeite im Büro.', 'Ich bin Fahrer.'], ['ich arbeite', 'ich bin', 'büro', 'fahrer']],
    ['Wunderbar. Um zwölf Uhr machen wir Pause.', 'Прекрасно. В двенадцать часов у нас перерыв.', ['Gut, bis später!', 'Danke, bis um zwölf!'], ['danke', 'später', 'zwölf']],
  ]),
  S('interview', 'Vorstellungsgespräch', 'Собеседование', '🤝', 'A2', g('Расскажите о себе и своём опыте.', 'Өзүңүз жана тажрыйбаңыз жөнүндө айтыңыз.'), [
    ['Guten Tag. Erzählen Sie bitte etwas über sich.', 'Добрый день. Расскажите, пожалуйста, немного о себе.', ['Ich heiße Daniiar und komme aus Kirgisistan.', 'Ich bin 25 Jahre alt und wohne in Berlin.'], ['ich heiße', 'ich komme', 'ich bin', 'wohne']],
    ['Haben Sie schon Erfahrung in diesem Beruf?', 'У вас уже есть опыт в этой профессии?', ['Ja, ich habe zwei Jahre Erfahrung.', 'Nein, aber ich lerne schnell.'], ['erfahrung', 'jahre', 'lerne']],
    ['Warum möchten Sie bei uns arbeiten?', 'Почему вы хотите работать у нас?', ['Ich möchte hier arbeiten, weil die Firma modern ist.', 'Weil ich Deutsch üben möchte.'], ['weil', 'möchte', 'arbeiten']],
  ]),
  S('station', 'Am Bahnhof', 'На вокзале', '🚆', 'A1', g('Купите билет и узнайте, с какого пути отправляется поезд.', 'Билет сатып алыңыз.'), [
    ['Guten Tag. Wohin möchten Sie fahren?', 'Добрый день. Куда вы хотите поехать?', ['Nach Hamburg, bitte.', 'Ich möchte nach Berlin fahren.'], ['nach', 'hamburg', 'berlin', 'möchte']],
    ['Einfach oder hin und zurück?', 'В одну сторону или туда и обратно?', ['Einfach, bitte.', 'Hin und zurück, bitte.'], ['einfach', 'zurück']],
    ['Das macht 39 Euro. Der Zug fährt um 9:15 Uhr von Gleis 3.', 'С вас 39 евро. Поезд отправляется в 9:15 с пути 3.', ['Danke. Muss ich umsteigen?', 'Danke! Von welchem Gleis?'], ['umsteigen', 'gleis', 'danke']],
  ]),
  S('viewing', 'Wohnungsbesichtigung', 'Осмотр квартиры', '🏠', 'A2', g('Узнайте об арендной плате и о квартире.', 'Батир жана ижара акысы жөнүндө сураңыз.'), [
    ['Hallo, kommen Sie herein. Das ist das Wohnzimmer.', 'Здравствуйте, входите. Это гостиная.', ['Die Wohnung gefällt mir.', 'Das Zimmer ist sehr hell.'], ['gefällt', 'zimmer', 'hell']],
    ['Haben Sie noch Fragen?', 'У вас есть ещё вопросы?', ['Wie hoch ist die Miete?', 'Gibt es einen Balkon?'], ['miete', 'balkon', 'wie hoch']],
    ['Die Miete beträgt 650 Euro, ohne Nebenkosten.', 'Аренда составляет 650 евро без коммунальных платежей.', ['Das ist okay. Wann kann ich einziehen?', 'Ich nehme die Wohnung.'], ['einziehen', 'nehme', 'wann']],
  ]),
  S('phone', 'Anruf bei einer Firma', 'Звонок в компанию', '📞', 'A2', g('Позвоните и попросите нужного человека.', 'Телефон чалып, керектүү адамды сураңыз.'), [
    ['Firma Schneider, guten Tag. Was kann ich für Sie tun?', 'Фирма Шнайдер, добрый день. Чем могу помочь?', ['Guten Tag, ich möchte Herrn Weber sprechen.', 'Ich rufe wegen einer Bewerbung an.'], ['ich möchte', 'sprechen', 'bewerbung']],
    ['Herr Weber ist leider nicht da. Möchten Sie eine Nachricht hinterlassen?', 'Господина Вебера, к сожалению, нет. Хотите оставить сообщение?', ['Ja, bitte. Ich heiße Daniiar.', 'Nein, ich rufe morgen wieder an.'], ['ja', 'nein', 'heiße', 'morgen']],
    ['Wie ist Ihre Telefonnummer?', 'Какой у вас номер телефона?', ['Meine Nummer ist null eins sieben sechs …', 'Meine Telefonnummer ist 0176 123456.'], ['nummer', 'telefonnummer']],
  ]),
  S('office', 'Ausländerbehörde', 'Ведомство по делам иностранцев', '🏛️', 'A2', g('Сообщите цель визита и покажите документы.', 'Ведомствого келүү максатын айтыңыз.'), [
    ['Guten Tag. Haben Sie einen Termin?', 'Добрый день. У вас назначено?', ['Ja, ich habe einen Termin um zehn Uhr.', 'Guten Tag. Mein Termin ist um zehn Uhr.'], ['termin', 'zehn', 'ich habe']],
    ['Worum geht es?', 'По какому вопросу?', ['Ich möchte meine Aufenthaltserlaubnis verlängern.', 'Ich brauche eine neue Aufenthaltserlaubnis.'], ['aufenthaltserlaubnis', 'verlängern', 'brauche']],
    ['Haben Sie Ihren Pass und Ihren Mietvertrag dabei?', 'У вас с собой паспорт и договор аренды?', ['Ja, hier ist mein Pass.', 'Ja, ich habe alles dabei.'], ['pass', 'dabei', 'mietvertrag']],
  ]),
  S('appointment', 'Einen Termin machen', 'Записаться на приём', '📅', 'A1', g('Договоритесь о дне и времени.', 'Күн жана убакытты макулдашыңыз.'), [
    ['Praxis Müller, guten Tag.', 'Практика Мюллер, добрый день.', ['Guten Tag. Ich möchte einen Termin.', 'Ich möchte einen Termin vereinbaren.'], ['termin', 'möchte']],
    ['Wann haben Sie Zeit?', 'Когда у вас есть время?', ['Am Montag um zehn Uhr.', 'Am Dienstag habe ich Zeit.'], ['am', 'montag', 'dienstag', 'uhr']],
    ['Montag, zehn Uhr, das passt. Wie ist Ihr Name?', 'Понедельник, десять часов — подходит. Как ваше имя?', ['Mein Name ist Daniiar.', 'Ich heiße Daniiar.'], ['name', 'heiße', 'ist']],
  ]),
  S('meeting', 'Neue Leute kennenlernen', 'Знакомство', '👋', 'A1', g('Представьтесь и расскажите о себе.', 'Өзүңүздү тааныштырыңыз.'), [
    ['Hallo! Ich bin Lena. Und wie heißt du?', 'Привет! Я Лена. А как тебя зовут?', ['Ich heiße Daniiar. Freut mich!', 'Hallo Lena, ich bin Daniiar.'], ['heiße', 'ich bin', 'freut']],
    ['Woher kommst du?', 'Откуда ты?', ['Ich komme aus Kirgisistan.', 'Ich komme aus Bischkek.'], ['komme', 'aus']],
    ['Und was machst du hier in Deutschland?', 'А что ты делаешь здесь, в Германии?', ['Ich lerne Deutsch und arbeite.', 'Ich studiere hier.'], ['lerne', 'arbeite', 'studiere']],
  ]),
]

export const speakingById = new Map(SPEAKING.map(s => [s.id, s]))
