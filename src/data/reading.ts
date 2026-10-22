import type { LanguageLevel, ReadingGloss, ReadingText } from './types'

type G = [string, string, string, string, string, string[]]
const gl = (rows: G[]): ReadingGloss[] => rows.map(([word, ru, ky, example, grammar, related]) => ({ word, ru, ky, example, grammar, related }))

let n = 0
const R = (level: LanguageLevel, unit: number, title: string, body: string[], gloss: G[], questions: [string, string[], number][]): ReadingText => ({
  id: `re${String(++n).padStart(2, '0')}`,
  level,
  unit,
  title,
  body,
  gloss: gl(gloss),
  questions: questions.map(([q, options, answer]) => ({ q, options, answer })),
})

export const READING: ReadingText[] = [
  R('A1', 1, 'Mein Name ist Anna', [
    'Hallo! Mein Name ist Anna Kowalski. Ich bin 28 Jahre alt und komme aus Polen. Jetzt wohne ich in Berlin.',
    'Ich spreche Polnisch, Deutsch und ein bisschen Englisch. Ich lerne jeden Tag Deutsch, denn ich möchte hier arbeiten.',
  ], [
    ['komme', 'прихожу; родом из', 'келем; … чыгамын', 'Ich komme aus Polen.', 'kommen → ich komme', ['kommen', 'woher', 'aus']],
    ['wohne', 'живу', 'жашайм', 'Ich wohne in Berlin.', 'wohnen → ich wohne (-e после ich)', ['wohnen', 'die Wohnung']],
    ['spreche', 'говорю', 'сүйлөйм', 'Ich spreche Deutsch.', 'sprechen: ich spreche, du sprichst', ['sprechen', 'die Sprache']],
    ['möchte', 'хотела бы', 'каалайм', 'Ich möchte einen Kaffee.', 'модальный глагол; инфинитив в конце', ['können', 'müssen']],
  ], [['Woher kommt Anna?', ['Aus Deutschland', 'Aus Polen', 'Aus England'], 1], ['Warum lernt Anna Deutsch?', ['Sie möchte in Deutschland arbeiten.', 'Sie mag Englisch nicht.', 'Sie hat Urlaub.'], 0]]),
  R('A1', 2, 'Meine Familie', [
    'Ich habe eine große Familie. Meine Eltern wohnen in Bischkek. Mein Vater ist Lehrer und meine Mutter ist Ärztin.',
    'Ich habe zwei Brüder und eine Schwester. Mein Bruder Aibek studiert in Hamburg. Meine Schwester ist erst zehn Jahre alt.',
  ], [
    ['Eltern', 'родители', 'ата-эне', 'Meine Eltern sind nett.', 'только множественное число: die Eltern', ['die Mutter', 'der Vater']],
    ['Ärztin', 'врач (женщина)', 'дарыгер (аял)', 'Die Ärztin arbeitet im Krankenhaus.', 'женская форма на -in: der Arzt → die Ärztin', ['der Arzt', 'das Krankenhaus']],
    ['studiert', 'учится (в вузе)', 'окуйт', 'Er studiert in Hamburg.', 'studieren → er studiert', ['die Universität']],
    ['erst', 'всего лишь, только', 'жаңы эле', 'Sie ist erst zehn.', 'наречие', ['schon', 'nur']],
  ], [['Was ist die Mutter von Beruf?', ['Lehrerin', 'Ärztin', 'Köchin'], 1], ['Wo studiert der Bruder?', ['In Hamburg', 'In Bischkek', 'In Berlin'], 0]]),
  R('A1', 3, 'Mein Tag', [
    'Ich stehe um halb sieben auf. Zuerst dusche ich, dann frühstücke ich. Ich trinke Tee und esse ein Brot mit Käse.',
    'Um acht Uhr fahre ich zur Arbeit. Abends koche ich, lese ein Buch oder lerne Deutsch.',
  ], [
    ['stehe', 'встаю', 'турам', 'Ich stehe früh auf.', 'aufstehen — отделяемый глагол: stehe … auf', ['aufstehen']],
    ['zuerst', 'сначала', 'адегенде', 'Zuerst gehe ich einkaufen.', 'наречие порядка: zuerst, dann, danach', ['dann', 'danach']],
    ['fahre', 'еду', 'барам (транспортто)', 'Ich fahre mit dem Bus.', 'fahren: ich fahre, du fährst', ['der Bus', 'die U-Bahn']],
    ['abends', 'по вечерам', 'кечинде', 'Abends sehe ich fern.', 'наречие времени; -s показывает повторяемость', ['der Abend', 'morgens']],
  ], [['Wann steht die Person auf?', ['Um 6:30 Uhr', 'Um 8:00 Uhr', 'Um 7:00 Uhr'], 0], ['Was macht die Person abends?', ['Sie fährt zur Arbeit.', 'Sie kocht, liest oder lernt.', 'Sie schläft sofort.'], 1]]),
  R('A1', 4, 'Im Restaurant', [
    'Heute essen wir im Restaurant. Die Kellnerin bringt die Speisekarte. Ich bestelle eine Suppe und ein Wasser.',
    'Mein Freund nimmt einen Salat und einen Tee. Das Essen ist lecker. Am Ende bezahlen wir zusammen.',
  ], [
    ['bringt', 'приносит', 'алып келет', 'Er bringt das Essen.', 'bringen → er bringt', ['bestellen']],
    ['bestelle', 'заказываю', 'буйрутма берем', 'Ich bestelle einen Kaffee.', 'bestellen + Akkusativ', ['die Speisekarte']],
    ['nimmt', 'берёт', 'алат', 'Er nimmt einen Salat.', 'nehmen: ich nehme, er nimmt', ['nehmen']],
    ['bezahlen', 'оплачиваем', 'төлөйбүз', 'Wir bezahlen zusammen.', 'bezahlen → wir bezahlen', ['zahlen', 'die Rechnung']],
  ], [['Was bestellt der Erzähler?', ['Eine Suppe und ein Wasser', 'Einen Salat und einen Tee', 'Fleisch und Reis'], 0]]),
  R('A1', 5, 'Meine neue Wohnung', [
    'Ich habe eine neue Wohnung. Sie hat zwei Zimmer, eine kleine Küche und ein Bad. Die Miete ist nicht teuer.',
    'Im Wohnzimmer steht ein Sofa. Das Bett steht im Schlafzimmer. Von meinem Balkon sehe ich einen Park.',
  ], [
    ['neue', 'новую', 'жаңы', 'Ich habe eine neue Wohnung.', 'прилагательное получает окончание: eine neue Wohnung', ['alt', 'groß']],
    ['steht', 'стоит', 'турат', 'Das Sofa steht im Wohnzimmer.', 'stehen — положение, вопрос Wo? → Dativ', ['liegen', 'sitzen']],
    ['sehe', 'вижу', 'көрөм', 'Ich sehe einen Park.', 'sehen: ich sehe, du siehst', ['der Park']],
  ], [['Wie viele Zimmer hat die Wohnung?', ['Zwei', 'Drei', 'Vier'], 0], ['Was sieht die Person vom Balkon?', ['Einen Park', 'Die Küche', 'Ein Hotel'], 0]]),
  R('A1', 6, 'Mein Beruf', [
    'Ich bin Koch von Beruf. Ich arbeite in einem Restaurant in der Stadtmitte. Meine Kollegen sind sehr nett.',
    'Die Arbeit beginnt um zehn Uhr und endet um sechs. Am Montag habe ich frei.',
  ], [
    ['Koch', 'повар', 'ашпозчу', 'Er ist Koch.', 'der Koch → die Köchin', ['die Küche']],
    ['beginnt', 'начинается', 'башталат', 'Der Kurs beginnt um 18 Uhr.', 'beginnen → es beginnt', ['enden', 'anfangen']],
    ['frei', 'свободный; выходной', 'бош', 'Am Montag habe ich frei.', '«frei haben» = иметь выходной', ['der Feierabend']],
  ], [['Wann beginnt die Arbeit?', ['Um 6 Uhr', 'Um 10 Uhr', 'Um 8 Uhr'], 1], ['Wann hat die Person frei?', ['Am Montag', 'Am Freitag', 'Am Sonntag'], 0]]),
  R('A1', 7, 'Meine Stadt', [
    'Ich wohne in einer kleinen Stadt. Es gibt einen Bahnhof, eine Schule und viele Geschäfte. Die Apotheke ist neben der Bank.',
    'Ich fahre mit dem Bus zur Arbeit. Die Haltestelle ist nur fünf Minuten von meiner Wohnung entfernt.',
  ], [
    ['Geschäfte', 'магазины', 'дүкөндөр', 'In der Stadt gibt es viele Geschäfte.', 'мн. ч. от das Geschäft', ['kaufen', 'der Markt']],
    ['neben', 'рядом с', 'жанында', 'Die Apotheke ist neben der Bank.', 'Wechselpräposition: Wo? → Dativ (neben der Bank)', ['in', 'auf']],
    ['entfernt', 'удалён', 'алыс', 'Fünf Minuten entfernt.', 'причастие как прилагательное', ['weit', 'nah']],
  ], [['Wo ist die Apotheke?', ['Neben der Bank', 'Neben dem Bahnhof', 'In der Schule'], 0]]),
  R('A2', 8, 'Ein Termin beim Arzt', [
    'Gestern habe ich angerufen und einen Termin beim Arzt vereinbart. Die Ärztin hat am Mittwoch um halb elf Zeit.',
    'Ich muss pünktlich sein und meine Versichertenkarte mitbringen. Wenn ich nicht kommen kann, muss ich den Termin vorher absagen.',
  ], [
    ['angerufen', 'позвонил', 'чалдым', 'Ich habe die Praxis angerufen.', 'Perfekt от anrufen: habe … angerufen', ['anrufen', 'telefonieren']],
    ['vereinbart', 'договорился', 'макулдаштым', 'Wir haben einen Termin vereinbart.', 'Partizip II от vereinbaren (без ge-)', ['der Termin']],
    ['mitbringen', 'принести с собой', 'ала келүү', 'Bitte bringen Sie den Pass mit.', 'отделяемый глагол: bringe … mit', ['bringen']],
    ['absagen', 'отменить', 'жокко чыгаруу', 'Ich muss absagen.', 'отделяемый глагол: sage … ab', ['verschieben']],
  ], [['Wann ist der Termin?', ['Am Mittwoch um 10:30 Uhr', 'Am Montag um 9 Uhr', 'Am Freitag um 11 Uhr'], 0], ['Was soll man mitbringen?', ['Die Versichertenkarte', 'Den Mietvertrag', 'Einen Koffer'], 0]]),
  R('A2', 9, 'Einkaufen am Samstag', [
    'Am Samstag gehe ich immer auf den Markt. Dort kaufe ich Gemüse, Obst und Käse. Das ist frisch und günstiger als im Supermarkt.',
    'Danach brauche ich noch eine neue Jacke. Im Geschäft probiere ich drei Jacken an, aber sie sind alle zu teuer.',
  ], [
    ['frisch', 'свежий', 'жаңы', 'Das Brot ist frisch.', 'прилагательное', ['das Gemüse', 'das Obst']],
    ['günstiger', 'дешевле', 'арзаныраак', 'Der Markt ist günstiger.', 'сравнительная степень: günstig → günstiger', ['billig', 'teuer']],
    ['probiere', 'примеряю', 'кийип көрөм', 'Ich probiere die Jacke an.', 'anprobieren — отделяемый: probiere … an', ['anprobieren']],
  ], [['Wo kauft die Person Gemüse?', ['Auf dem Markt', 'Im Büro', 'Am Bahnhof'], 0], ['Warum kauft sie keine Jacke?', ['Die Jacken sind zu teuer.', 'Das Geschäft ist zu.', 'Sie hat kein Geld dabei.'], 0]]),
  R('B1', 6, 'Arbeiten in Deutschland', [
    'Wer in Deutschland arbeiten möchte, braucht oft eine Arbeitserlaubnis. Menschen aus Ländern außerhalb der EU müssen diese bei der Ausländerbehörde beantragen.',
    'Außerdem ist es wichtig, dass die Berufsabschlüsse anerkannt werden. Deshalb lohnt es sich, schon früh Deutsch zu lernen und alle Dokumente zu sammeln.',
  ], [
    ['beantragen', 'подавать заявление, ходатайствовать', 'арыз берүү', 'Ich möchte ein Visum beantragen.', 'be- + Antrag; Perfekt: habe beantragt; требует Akkusativ', ['der Antrag', 'die Erlaubnis']],
    ['Arbeitserlaubnis', 'разрешение на работу', 'иштөөгө уруксат', 'Ohne Arbeitserlaubnis darf ich nicht arbeiten.', 'сложное слово: Arbeit + Erlaubnis → die', ['die Aufenthaltserlaubnis']],
    ['anerkannt', 'признанный', 'таанылган', 'Mein Abschluss ist anerkannt.', 'Partizip II от anerkennen; пассив: werden anerkannt', ['anerkennen', 'der Abschluss']],
    ['lohnt', 'стоит усилий', 'пайдалуу', 'Es lohnt sich zu lernen.', 'sich lohnen — возвратный глагол', ['sich lohnen']],
  ], [['Wo beantragt man die Arbeitserlaubnis?', ['Bei der Ausländerbehörde', 'Bei der Post', 'In der Schule'], 0], ['Was empfiehlt der Text?', ['Früh Deutsch lernen und Dokumente sammeln', 'Nicht arbeiten', 'Sofort umziehen'], 0]]),
]

export const readingById = new Map(READING.map(t => [t.id, t]))
export const readingForUnit = (unit: number) => READING.filter(t => t.unit === unit)
