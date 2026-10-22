import type { L10n, LanguageLevel, WritingTask } from './types'

const t = (ru: string, ky?: string): L10n => ({ ru, ky })
type M = [string, string[]]

const W = (id: string, level: LanguageLevel, unit: number, title: string, situation: L10n, formal: boolean, minWords: number, must: M[], model: string, tips: L10n[]): WritingTask =>
  ({ id, level, unit, title, situation, formal, minWords, mustInclude: must.map(([label, patterns]) => ({ label, patterns })), model, tips })

export const WRITING: WritingTask[] = [
  W('wr01', 'A1', 1, 'Über mich', t('Напишите о себе для нового языкового партнёра: имя, откуда вы, где живёте.', 'Өзүңүз жөнүндө жазыңыз.'), false, 25, [
    ['Begrüßung (Hallo / Hi)', ['hallo', 'hi', 'guten tag']], ['Name (ich heiße / ich bin)', ['ich heiße', 'ich bin', 'mein name ist']], ['Herkunft (ich komme aus)', ['ich komme aus']], ['Wohnort (ich wohne in)', ['ich wohne in']],
  ], 'Hallo! Ich heiße Daniiar und ich bin 25 Jahre alt. Ich komme aus Kirgisistan, aber jetzt wohne ich in Berlin. Ich spreche Russisch, Kirgisisch und ein bisschen Deutsch. Ich lerne jeden Tag, weil ich hier arbeiten möchte. Und du? Woher kommst du?', [
    t('Глагол — на втором месте: «Jetzt wohne ich in Berlin».'), t('Все существительные пишутся с заглавной буквы.')]),
  W('wr02', 'A1', 2, 'Meine Familie', t('Расскажите о своей семье: кто в ней, сколько лет, чем занимаются.', 'Үй-бүлөңүз жөнүндө жазыңыз.'), false, 30, [
    ['Mein/Meine …', ['mein ', 'meine ']], ['haben (Ich habe …)', ['ich habe', 'wir haben']], ['Alter (… Jahre alt)', ['jahre alt']],
  ], 'Meine Familie ist nicht sehr groß. Ich habe einen Bruder und eine Schwester. Mein Bruder ist 22 Jahre alt und studiert in Hamburg. Meine Schwester ist zwölf Jahre alt und geht noch zur Schule. Meine Eltern wohnen in Bischkek. Mein Vater arbeitet als Lehrer und meine Mutter ist Ärztin.', [
    t('mein — для der/das, meine — для die и множественного числа.'), t('Возраст: «Ich bin 25 Jahre alt», не «Ich habe 25 Jahre».')]),
  W('wr03', 'A1', 3, 'Mein Wochenende', t('Напишите, что вы обычно делаете на выходных.', 'Дем алышта эмне кыларыңызды жазыңыз.'), false, 35, [
    ['Am Samstag / Am Sonntag', ['am samstag', 'am sonntag', 'am wochenende']], ['Uhrzeit (um … Uhr)', ['um ']], ['Verb: gehen / machen / besuchen / kochen', ['gehe', 'mache', 'besuche', 'koche']],
  ], 'Am Wochenende stehe ich spät auf, um neun Uhr. Am Samstag gehe ich einkaufen und koche für meine Freunde. Am Abend sehen wir zusammen einen Film. Am Sonntag besuche ich manchmal meine Tante. Dann lerne ich noch eine Stunde Deutsch. Das Wochenende ist immer zu kurz!', [
    t('Время вперёд — подлежащее после глагола: «Am Samstag gehe ich …».'), t('aufstehen: «Ich stehe um 9 Uhr auf».')]),
  W('wr04', 'A1', 4, 'Tisch reservieren', t('Напишите письмо в ресторан: забронируйте столик на четверых на пятницу, 19 часов.', 'Рестораңга кат жазыңыз.'), true, 35, [
    ['Formelle Anrede', ['sehr geehrte']], ['Wunsch (ich möchte)', ['ich möchte', 'wir möchten']], ['Tag und Uhrzeit', ['freitag', 'uhr']], ['Grußformel', ['mit freundlichen grüßen']],
  ], 'Sehr geehrte Damen und Herren,\n\nich möchte für Freitag um 19 Uhr einen Tisch für vier Personen reservieren. Bitte schreiben Sie mir, ob das möglich ist. Meine Telefonnummer ist 0176 123456.\n\nVielen Dank und mit freundlichen Grüßen\nDaniiar Ashirov', [
    t('В официальном письме — Sie и «Sehr geehrte Damen und Herren».'), t('Закончите письмом «Mit freundlichen Grüßen».')]),
  W('wr05', 'A2', 5, 'E-Mail an den Vermieter', t('В квартире не работает отопление. Напишите письмо арендодателю и попросите починить.', 'Үй ээсине кат жазыңыз.'), true, 45, [
    ['Formelle Anrede', ['sehr geehrter', 'sehr geehrte']], ['Problem nennen (funktioniert nicht / ist kaputt)', ['funktioniert nicht', 'kaputt', 'defekt']], ['Bitte (Könnten Sie …)', ['könnten sie', 'können sie', 'bitte']], ['Grußformel', ['mit freundlichen grüßen']],
  ], 'Sehr geehrter Herr Schneider,\n\nseit drei Tagen funktioniert die Heizung in meiner Wohnung nicht mehr. Es ist sehr kalt, besonders am Abend. Könnten Sie bitte so schnell wie möglich einen Techniker schicken? Ich bin ab 16 Uhr zu Hause.\n\nVielen Dank im Voraus.\n\nMit freundlichen Grüßen\nDaniiar Ashirov', [
    t('«Könnten Sie bitte …» звучит вежливее, чем «Können Sie …».'), t('seit + Dativ: «seit drei Tagen».')]),
  W('wr06', 'A2', 6, 'Kurze Bewerbung', t('Вы хотите работать помощником повара. Напишите короткое заявление.', 'Жумушка арыз жазыңыз.'), true, 50, [
    ['Formelle Anrede', ['sehr geehrte']], ['Interesse (ich interessiere mich / ich bewerbe mich)', ['ich bewerbe mich', 'ich interessiere mich', 'bewerbung']], ['Erfahrung', ['erfahrung', 'jahre']], ['Grußformel', ['mit freundlichen grüßen']],
  ], 'Sehr geehrte Damen und Herren,\n\nich bewerbe mich als Küchenhilfe in Ihrem Restaurant. Ich habe zwei Jahre Erfahrung als Koch und arbeite gern im Team. Ich spreche Deutsch auf Niveau A2 und lerne jeden Tag weiter. Meinen Lebenslauf finden Sie im Anhang.\n\nÜber eine Einladung zu einem Gespräch würde ich mich freuen.\n\nMit freundlichen Grüßen\nDaniiar Ashirov', [
    t('«Ich bewerbe mich als …» — стандартная формула.'), t('Не забудьте приложить Lebenslauf.')]),
  W('wr07', 'A1', 7, 'Der Weg zu mir', t('Друг приезжает в гости. Объясните ему, как дойти от вокзала до вашего дома.', 'Досуңузга жолду түшүндүрүңүз.'), false, 35, [
    ['Richtung (links / rechts / geradeaus)', ['links', 'rechts', 'geradeaus']], ['Orientierungspunkt (Ampel / Bank / Apotheke / Park)', ['ampel', 'bank', 'apotheke', 'park', 'ecke']], ['Imperativ (Geh / Gehe / Nimm)', ['geh', 'nimm', 'fahr']],
  ], 'Hallo Tim! Vom Bahnhof ist es nicht weit. Geh zuerst geradeaus bis zur Ampel. Dort gehst du links. Dann siehst du eine Apotheke. Neben der Apotheke ist die Bank. Ich wohne im Haus direkt an der Ecke, im zweiten Stock. Ruf mich an, wenn du da bist!', [
    t('Дружеский императив: «Geh geradeaus!», «Nimm den Bus!».'), t('neben + Dativ: «neben der Apotheke».')]),
  W('wr08', 'A2', 8, 'Termin verschieben', t('Вы заболели. Напишите в практику и перенесите приём на другой день.', 'Дарыгерге жазыңыз.'), true, 40, [
    ['Formelle Anrede', ['sehr geehrte']], ['Termin', ['termin']], ['Grund (leider / krank)', ['leider', 'krank']], ['Neuer Vorschlag (am … um …)', ['am ', 'um ']], ['Grußformel', ['mit freundlichen grüßen']],
  ], 'Sehr geehrte Damen und Herren,\n\nich habe am Montag um neun Uhr einen Termin bei Frau Doktor Meier. Leider bin ich krank und kann nicht kommen. Könnte ich den Termin auf Mittwoch um elf Uhr verschieben? Wenn das nicht geht, rufe ich Sie morgen früh an.\n\nMit freundlichen Grüßen\nDaniiar Ashirov', [
    t('«Leider» смягчает отказ.'), t('Предложите новое время сразу — так письмо полезнее.')]),
  W('wr09', 'A2', 9, 'Eine Beschwerde', t('Купленная куртка порвалась через два дня. Напишите жалобу и попросите обмен или возврат денег.', 'Даттануу жазыңыз.'), true, 50, [
    ['Formelle Anrede', ['sehr geehrte']], ['Kaufdatum / Ware', ['jacke', 'gekauft', 'habe']], ['Wunsch (umtauschen / Geld zurück)', ['umtauschen', 'geld zurück', 'zurückgeben', 'erstatten']], ['Grußformel', ['mit freundlichen grüßen']],
  ], 'Sehr geehrte Damen und Herren,\n\nam 3. März habe ich bei Ihnen eine Jacke gekauft. Leider ist der Reißverschluss nach zwei Tagen kaputtgegangen. Ich habe den Kassenzettel noch. Ich möchte die Jacke gern umtauschen oder mein Geld zurückbekommen. Bitte schreiben Sie mir, wie ich das machen kann.\n\nMit freundlichen Grüßen\nDaniiar Ashirov', [
    t('Perfekt для прошлого: «Ich habe gekauft».'), t('Всегда указывайте дату и чек.')]),
  W('wr10', 'A2', 10, 'Zug oder Auto?', t('Выразите своё мнение: что лучше для поездки — поезд или машина? Назовите минимум две причины.', 'Пикириңизди билдириңиз.'), false, 50, [
    ['Meinung (Ich finde / Meiner Meinung nach)', ['ich finde', 'meiner meinung nach', 'ich denke']], ['Begründung mit weil', ['weil']], ['Gegensatz (aber)', ['aber', 'dagegen']],
  ], 'Ich finde, dass der Zug besser ist als das Auto. Erstens kann ich im Zug lesen oder Deutsch lernen, weil ich nicht fahren muss. Zweitens ist der Zug umweltfreundlicher. Das Auto ist aber manchmal praktischer, besonders wenn man viel Gepäck hat. Meiner Meinung nach ist der Zug für lange Reisen trotzdem die beste Wahl.', [
    t('После weil — глагол в конце.'), t('«Meiner Meinung nach» + порядок слов: глагол сразу после.')]),
]

export const writingById = new Map(WRITING.map(w => [w.id, w]))
