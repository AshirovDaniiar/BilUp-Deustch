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

export const LEGACY_READING: ReadingText[] = [
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

/** Approved Lesetexte A1 supplied in BilUp_Til_Kurze_Lesetexte_A1-B1.docx. */
export const A1_LESETEXTE: ReadingText[] = [
  {
    id: 're01',
    level: 'A1',
    unit: 1,
    title: "Hallo & Ich",
    body: ["Hallo! Ich heiße Aibek und komme aus Kirgisistan. Ich bin neunzehn Jahre alt und wohne mit meiner Familie in Bischkek. Heute ist mein erster Tag in einem Deutschkurs. Am Morgen stehe ich früh auf, ziehe mein blaues Hemd an und esse mit meiner Mutter Frühstück. Sie macht Tee und Brot mit Käse. Mein Vater fragt: „Bist du schon fertig?“ Ich lache und sage: „Ja, fast!“ Dann nehme ich meinen Rucksack und gehe zur Bushaltestelle."],
    wordCount: 74,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Hallo & Ich", "Wer bin ich?", "Unterwegs in der Stadt"],
      answer: 0
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're02',
    level: 'A1',
    unit: 102,
    title: "Wer bin ich?",
    body: ["Ich heiße Meerim, bin zwanzig Jahre alt und wohne in Osch. Viele Menschen fragen mich: „Wer bist du?“ Das ist eine einfache Frage, aber ich kann viel darüber erzählen. Ich bin Studentin und lerne an einer Universität. Meine Lieblingsfächer sind Sprachen und Geschichte. Ich spreche Kirgisisch und Russisch. Jetzt lerne ich Deutsch, weil ich später in Deutschland studieren möchte."],
    wordCount: 59,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Hallo & Ich", "Wer bin ich?", "Mein Tagesablauf"],
      answer: 1
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're03',
    level: 'A1',
    unit: 103,
    title: "Mein Tagesablauf",
    body: ["Mein Name ist Nurbek. Ich bin achtzehn Jahre alt und wohne in einer kleinen Wohnung in Bischkek. Mein Alltag ist meistens ähnlich, aber jeder Tag bringt etwas Neues. Unter der Woche stehe ich um sieben Uhr auf. Zuerst mache ich mein Bett und gehe ins Badezimmer. Danach dusche ich, putze meine Zähne und ziehe mich an. Um halb acht frühstücke ich mit meinem Vater."],
    wordCount: 64,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Familie und Freunde", "Wer bin ich?", "Mein Tagesablauf"],
      answer: 2
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're04',
    level: 'A1',
    unit: 104,
    title: "Familie und Freunde",
    body: ["Meine Familie ist nicht sehr groß, aber wir verbringen viel Zeit miteinander. Ich heiße Aizada und wohne mit meinen Eltern und meinem kleinen Bruder in Karakol. Meine Mutter heißt Gulnara. Sie arbeitet in einer Bäckerei und steht jeden Morgen sehr früh auf. Mein Vater heißt Marat und ist Busfahrer. Mein Bruder Timur ist zehn Jahre alt und geht in die vierte Klasse."],
    wordCount: 62,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Familie und Freunde", "Ich stelle mich vor", "Mein Tagesablauf"],
      answer: 0
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're05',
    level: 'A1',
    unit: 105,
    title: "Ich stelle mich vor",
    body: ["Guten Tag! Mein Name ist Elina Sadykova. Ich bin zweiundzwanzig Jahre alt und komme aus Talas in Kirgisistan. Seit zwei Jahren wohne ich in Bischkek. Hier studiere ich Wirtschaft an der Universität. Ich studiere im dritten Jahr. Ich spreche Kirgisisch und Russisch. Seit sechs Monaten lerne ich Deutsch. Am Anfang war die Aussprache schwierig, aber jetzt verstehe ich schon viele einfache Gespräche."],
    wordCount: 62,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Familie und Freunde", "Ich stelle mich vor", "Mein Leben in Deutschland"],
      answer: 1
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're06',
    level: 'A1',
    unit: 106,
    title: "Mein Leben in Deutschland",
    body: ["Seit drei Monaten lebt Bakyt in Deutschland. Er kommt aus Kirgisistan und wohnt jetzt in Leipzig. Am Anfang war vieles neu für ihn. Die Straßen waren anders, die Häuser sahen anders aus und die Menschen sprachen sehr schnell. Zum Glück besucht Bakyt einen Deutschkurs. Dort lernt er jeden Vormittag neue Wörter und übt kleine Gespräche. Seine Lehrerin heißt Frau Schneider. Sie erklärt langsam und hilft, wenn jemand eine Frage hat."],
    wordCount: 70,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Neue Bekanntschaften", "Ich stelle mich vor", "Mein Leben in Deutschland"],
      answer: 2
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're07',
    level: 'A1',
    unit: 107,
    title: "Neue Bekanntschaften",
    body: ["Am ersten Tag im Sprachkurs sitzt Aijan neben einem Mädchen mit kurzen braunen Haaren. Das Mädchen lächelt und sagt: „Hallo, ich bin Sophie. Wie heißt du?“ Aijan stellt sich vor und erzählt, dass sie aus Kirgisistan kommt. Sophie kommt aus Österreich und wohnt seit einem Jahr in der Stadt. Beide lernen Deutsch, weil sie später eine Ausbildung machen möchten. In der Pause gehen sie zusammen in die Cafeteria."],
    wordCount: 68,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Neue Bekanntschaften", "Fragen über mich", "Mein Leben in Deutschland"],
      answer: 0
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're08',
    level: 'A1',
    unit: 108,
    title: "Fragen über mich",
    body: ["In unserem Deutschkurs machen wir heute ein Kennenlernspiel. Jeder bekommt eine Karte mit Fragen. Ich heiße Emir und sitze mit meiner Partnerin Alina zusammen. Sie liest die erste Frage vor: „Woher kommst du?“ Ich antworte, dass ich aus Bischkek komme. Dann fragt sie: „Wo wohnst du jetzt?“ Ich erzähle, dass ich mit meinem Cousin in einer kleinen Wohnung wohne. Danach sprechen wir über unsere Familien. Alina hat zwei Schwestern und einen Bruder."],
    wordCount: 72,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Neue Bekanntschaften", "Fragen über mich", "Was machst du gern?"],
      answer: 1
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're09',
    level: 'A1',
    unit: 109,
    title: "Was machst du gern?",
    body: ["Mein Freund Nursultan hat viele Interessen. Er macht gern Sport und spielt dreimal pro Woche Fußball. Am liebsten trainiert er mit seinen Freunden auf dem Platz neben der Schule. Wenn das Wetter schlecht ist, bleibt er zu Hause und sieht sich ein Fußballspiel im Fernsehen an. Seine Lieblingsmannschaft spielt in Europa. Ich bin anders als Nursultan. Ich lese gern und höre oft Musik. Besonders mag ich ruhige Musik, wenn ich lerne oder mit dem Bus fahre."],
    wordCount: 76,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Dinge und Gegenstände", "Fragen über mich", "Was machst du gern?"],
      answer: 2
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're10',
    level: 'A1',
    unit: 110,
    title: "Dinge und Gegenstände",
    body: ["In meinem Alltag benutze ich viele Dinge. Morgens brauche ich zuerst meinen Wecker, damit ich pünktlich aufstehe. Im Badezimmer liegen meine Zahnbürste, Zahnpasta und ein Handtuch. Danach ziehe ich meine Kleidung an und packe meine Tasche. In meiner Tasche sind mein Schlüssel, mein Handy, ein Heft und zwei Stifte. Für den Deutschkurs brauche ich ein Buch und ein Wörterbuch. Das Buch ist ziemlich dick, aber die Übungen sind interessant."],
    wordCount: 69,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Dinge und Gegenstände", "In meinem Zimmer", "Was machst du gern?"],
      answer: 0
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're11',
    level: 'A1',
    unit: 111,
    title: "In meinem Zimmer",
    body: ["Mein Zimmer ist nicht sehr groß, aber ich fühle mich dort wohl. Ich wohne mit meinen Eltern und meiner Schwester in einer Wohnung in Bischkek. Mein Zimmer liegt neben dem Wohnzimmer. Wenn man hineinkommt, steht links ein großes Bett. Daneben ist ein kleiner Nachttisch mit einer Lampe. Am Morgen schalte ich die Lampe aus und mache das Fenster auf. Gegenüber vom Bett steht mein Schreibtisch. Dort mache ich meine Hausaufgaben und lerne Deutsch."],
    wordCount: 73,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Dinge und Gegenstände", "In meinem Zimmer", "Was ist das?"],
      answer: 1
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're12',
    level: 'A1',
    unit: 112,
    title: "Was ist das?",
    body: ["Heute hilft Amina ihrer Großmutter beim Aufräumen. Im Wohnzimmer stehen viele alte Sachen, und einige davon kennt Amina nicht. Sie nimmt einen kleinen Gegenstand aus einer Schublade und fragt: „Oma, was ist das?“ Ihre Großmutter lächelt. „Das ist ein Kompass. Dein Großvater hat ihn früher auf Reisen benutzt.“ Amina findet auch eine runde Dose aus Metall. Darin liegen alte Fotos. Auf einem Bild sieht sie ihre Mutter als kleines Kind."],
    wordCount: 70,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Frühstück und Mahlzeiten", "In meinem Zimmer", "Was ist das?"],
      answer: 2
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're13',
    level: 'A1',
    unit: 113,
    title: "Frühstück und Mahlzeiten",
    body: ["Bei uns beginnt der Tag meistens mit einem gemeinsamen Frühstück. Meine Mutter steht früh auf und bereitet den Tisch vor. Es gibt Brot, Butter, Käse und manchmal Eier. Mein Vater trinkt schwarzen Tee, meine kleine Schwester trinkt lieber Milch. Ich esse gern Haferflocken mit einem Apfel. Am Wochenende haben wir mehr Zeit und machen manchmal Pfannkuchen. Mittags esse ich oft in der Universität. In der Mensa gibt es verschiedene Gerichte."],
    wordCount: 70,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Frühstück und Mahlzeiten", "Meine Haustiere und Tiere", "Was ist das?"],
      answer: 0
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're14',
    level: 'A1',
    unit: 114,
    title: "Meine Haustiere und Tiere",
    body: ["Bei meiner Familie lebt eine Katze. Sie heißt Momo und ist drei Jahre alt. Meine kleine Schwester hat den Namen ausgesucht, weil die Katze sehr freundlich ist. Momo ist grau und hat weiße Pfoten. Am Morgen wartet sie oft vor der Küchentür. Wenn meine Mutter ihr Futter gibt, läuft sie sofort zum Napf. Nach dem Frühstück schläft Momo gern auf dem Sofa. Manchmal liegt sie auch auf meinem Schreibtisch, obwohl ich dort lernen möchte."],
    wordCount: 74,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Frühstück und Mahlzeiten", "Meine Haustiere und Tiere", "Zusammengesetzte Wörter im Alltag"],
      answer: 1
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're15',
    level: 'A1',
    unit: 115,
    title: "Zusammengesetzte Wörter im Alltag",
    body: ["Wenn ich Deutsch lerne, entdecke ich oft lange Wörter. Am Anfang sehen sie schwierig aus, aber viele bestehen aus zwei oder mehr kleinen Wörtern. Zum Beispiel ist ein Wörterbuch ein Buch mit Wörtern. Eine Haustür ist die Tür von einem Haus. Wenn ich diese Teile erkenne, kann ich die Bedeutung leichter verstehen. Heute gehe ich mit meinem Bruder zum Bahnhof. Wir brauchen eine Fahrkarte für den Zug."],
    wordCount: 67,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Meine Familie und meine Sachen", "Meine Haustiere und Tiere", "Zusammengesetzte Wörter im Alltag"],
      answer: 2
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're16',
    level: 'A1',
    unit: 116,
    title: "Meine Familie und meine Sachen",
    body: ["Bei uns zu Hause hat jeder seine eigenen Sachen. Meine Mutter hat eine große Tasche für die Arbeit. Darin sind ihr Portemonnaie, ein Schlüssel und ein kleines Notizbuch. Mein Vater trägt oft eine Uhr und hat immer sein Handy dabei. Meine Schwester Aijan besitzt viele Bücher und bunte Stifte. Sie legt ihre Schulsachen meistens ordentlich auf den Schreibtisch. Ich habe einen Rucksack, einen Laptop und ein Fahrrad. Mein Rucksack ist schon alt, aber er gehört mir und ist sehr praktisch."],
    wordCount: 80,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Meine Familie und meine Sachen", "Fragen beim Einkaufen", "Zusammengesetzte Wörter im Alltag"],
      answer: 0
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're17',
    level: 'A1',
    unit: 117,
    title: "Fragen beim Einkaufen",
    body: ["Am Samstag geht Aizada mit ihrer Mutter auf den Markt. Sie brauchen Obst, Gemüse und einige Dinge für das Abendessen. Zuerst bleiben sie an einem Stand mit Äpfeln stehen. Aizada fragt den Verkäufer: „Wie viel kostet ein Kilo Äpfel?“ Der Mann antwortet: „Hundert Som.“ Ihre Mutter nimmt ein Kilo und bittet ihn um zwei große Tomaten. Danach gehen sie zu einem Stand mit Kleidung. Aizada sucht ein T-Shirt für ihren Bruder. Sie findet ein blaues T-Shirt und fragt die Verkäuferin: „Haben Sie das auch in Größe M?“ Die Verkäuferin schaut nach und bringt ein anderes T-Shirt."],
    wordCount: 96,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Meine Familie und meine Sachen", "Fragen beim Einkaufen", "Menschen und Dinge beschreiben"],
      answer: 1
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're18',
    level: 'A1',
    unit: 118,
    title: "Menschen und Dinge beschreiben",
    body: ["Mein Cousin Azamat ist ein freundlicher und hilfsbereiter Mensch. Er ist mittelgroß, hat kurze dunkle Haare und trägt meistens eine Brille. Seine Augen sind braun. Er lacht oft und spricht gern mit anderen Menschen. Wenn jemand Hilfe braucht, ist Azamat sofort da. Manchmal ist er ein bisschen unordentlich, aber auf ihn kann man sich verlassen. Meine Freundin Elvira sieht ganz anders aus. Sie ist groß und hat lange schwarze Haare. Sie trägt gern helle Kleidung und bequeme Schuhe."],
    wordCount: 78,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Was mache ich nicht?", "Fragen beim Einkaufen", "Menschen und Dinge beschreiben"],
      answer: 2
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're19',
    level: 'A1',
    unit: 119,
    title: "Was mache ich nicht?",
    body: ["Ich versuche, gesund zu leben, aber natürlich mache ich nicht alles perfekt. Zum Beispiel trinke ich keinen Kaffee am Abend, weil ich dann schlecht schlafe. Ich esse auch nicht jeden Tag Süßigkeiten. Früher habe ich oft Schokolade gekauft, aber jetzt nehme ich lieber Obst mit zur Universität. Das klappt nicht immer, doch ich gebe mir Mühe. Am Wochenende stehe ich nicht so früh auf wie an den anderen Tagen. Trotzdem bleibe ich nicht lange im Bett."],
    wordCount: 76,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Was mache ich nicht?", "Was habe ich nicht?", "Menschen und Dinge beschreiben"],
      answer: 0
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're20',
    level: 'A1',
    unit: 120,
    title: "Was habe ich nicht?",
    body: ["Heute möchte ich meine Tasche für einen Ausflug packen. Morgen fahre ich mit meiner Klasse an den Issyk-Kul. Ich habe schon eine Wasserflasche, ein T-Shirt und eine Sonnenbrille eingepackt. Aber ich habe noch keine Sonnencreme. Meine Mutter sagt, dass ich auch eine Mütze mitnehmen soll. Zum Glück habe ich eine blaue Mütze im Schrank. Ich suche außerdem meine Kamera, aber ich finde sie nicht. Vielleicht liegt sie bei meinem Bruder. Er hat manchmal meine Sachen, ohne mich zu fragen."],
    wordCount: 79,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Was mache ich nicht?", "Was habe ich nicht?", "Wer oder was?"],
      answer: 1
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're21',
    level: 'A1',
    unit: 121,
    title: "Wer oder was?",
    body: ["Am Sonntag besucht Nurlan mit seiner Schwester einen kleinen Flohmarkt. Dort gibt es viele interessante Dinge: alte Bücher, Kleidung, Geschirr und Spielzeug. An einem Stand sieht Aijan eine kleine Holzfigur. Sie fragt ihren Bruder: „Was ist das?“ Nurlan antwortet, dass es wahrscheinlich ein traditionelles Pferd ist. Der Verkäufer erklärt, dass die Figur aus Kirgisistan kommt und von Hand gemacht wurde. Danach entdecken sie eine Kiste mit alten Büchern. Aijan nimmt ein Buch heraus und fragt: „Wer hat das geschrieben?“ Der Verkäufer zeigt auf den Namen der Autorin."],
    wordCount: 87,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Was kaufe und esse ich?", "Was habe ich nicht?", "Wer oder was?"],
      answer: 2
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're22',
    level: 'A1',
    unit: 122,
    title: "Was kaufe und esse ich?",
    body: ["Nach dem Deutschkurs gehe ich oft in den Supermarkt. Heute möchte ich etwas für das Abendessen kaufen. Zu Hause sind nur noch wenige Lebensmittel im Kühlschrank. Ich brauche Kartoffeln, Karotten, Zwiebeln und etwas Fleisch. Außerdem möchte ich Brot und Joghurt kaufen. Meine Mutter hat mir eine Einkaufsliste geschickt, damit ich nichts vergesse. Im Gemüsebereich nehme ich zuerst ein Kilo Kartoffeln. Die Karotten sehen frisch aus, deshalb kaufe ich auch einige davon. Danach gehe ich zur Fleischtheke."],
    wordCount: 76,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Was kaufe und esse ich?", "Meine täglichen Aktivitäten", "Wer oder was?"],
      answer: 0
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're23',
    level: 'A1',
    unit: 123,
    title: "Meine täglichen Aktivitäten",
    body: ["Mein Tag ist oft voll, denn ich habe viele Aufgaben. Ich stehe um sieben Uhr auf und bereite mich auf den Unterricht vor. Zuerst wasche ich mich, ziehe mich an und frühstücke. Danach gehe ich zur Bushaltestelle. Während der Fahrt höre ich manchmal deutsche Podcasts. So kann ich neue Wörter lernen und die Aussprache üben. Am Vormittag besuche ich die Universität. Ich habe Vorlesungen, mache Notizen und spreche mit meinen Kommilitonen. In der Mittagspause esse ich in der Mensa."],
    wordCount: 79,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Was kaufe und esse ich?", "Meine täglichen Aktivitäten", "Wem gehört das?"],
      answer: 1
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're24',
    level: 'A1',
    unit: 124,
    title: "Wem gehört das?",
    body: ["Im Deutschkurs finden wir heute nach der Pause ein schwarzes Handy auf einem Stuhl. Niemand weiß, wem es gehört. Unsere Lehrerin nimmt es nicht sofort mit, sondern fragt zuerst die Gruppe: „Wem gehört dieses Handy?“ Alle sehen sich um. Aibek sagt, dass es nicht seins ist. Amina schaut in ihre Tasche und findet ihr eigenes Telefon. Dann entdeckt Timur eine kleine blaue Tasche neben dem Fenster. Er fragt: „Gehört die Tasche jemandem?“ Die Lehrerin öffnet sie nicht, denn persönliche Sachen soll man nicht ohne Erlaubnis durchsuchen."],
    wordCount: 86,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Geschenke für Freunde", "Meine täglichen Aktivitäten", "Wem gehört das?"],
      answer: 2
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're25',
    level: 'A1',
    unit: 125,
    title: "Geschenke für Freunde",
    body: ["Am Freitag hat meine Freundin Amina Geburtstag. Ich möchte ihr ein schönes Geschenk kaufen, aber ich weiß noch nicht genau, was sie braucht. Amina liest gern und interessiert sich für Kunst. Deshalb gehe ich nach der Universität in eine Buchhandlung. Dort sehe ich ein Buch über Malerei. Die Bilder sind sehr schön, und der Preis ist nicht zu hoch. Ich frage den Verkäufer, ob er das Buch als Geschenk einpacken kann. Er legt es in eine blaue Papiertüte und macht eine Schleife darum."],
    wordCount: 83,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Geschenke für Freunde", "Freunde und Geschenke", "Wem gehört das?"],
      answer: 0
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're26',
    level: 'A1',
    unit: 126,
    title: "Freunde und Geschenke",
    body: ["Am Freitag treffe ich meine Freunde in einem kleinen Café. Meine Freundin Dana hat bald Geburtstag, und wir möchten eine Überraschung für sie vorbereiten. Nurlan bringt eine Karte mit, Elvira kauft Blumen und ich suche ein passendes Geschenk. Wir kennen Dana schon seit vielen Jahren. Sie mag Bücher, Musik und schöne Dinge für ihre Wohnung. Zuerst gehen wir in ein Geschäft für Haushaltswaren. Dort sehen wir eine Tasse mit einem Bild von Bergen."],
    wordCount: 73,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Geschenke für Freunde", "Freunde und Geschenke", "Was kann und muss ich?"],
      answer: 1
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're27',
    level: 'A1',
    unit: 127,
    title: "Was kann und muss ich?",
    body: ["In meiner Familie hat jeder bestimmte Aufgaben. Ich kann gut kochen und meiner Mutter in der Küche helfen. Mein Bruder kann sehr gut Fahrrad fahren, aber er kann nicht besonders gut kochen. Meine kleine Schwester kann schon allein ihre Schultasche packen. Sie muss aber noch daran denken, ihre Hausaufgaben rechtzeitig zu machen. Am Montag muss ich früh aufstehen, denn mein Unterricht beginnt um acht Uhr. Vor dem Unterricht muss ich frühstücken und meine Bücher einpacken."],
    wordCount: 75,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Meine Wünsche und Möglichkeiten", "Freunde und Geschenke", "Was kann und muss ich?"],
      answer: 2
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're28',
    level: 'A1',
    unit: 128,
    title: "Meine Wünsche und Möglichkeiten",
    body: ["Jeder Mensch hat Wünsche. Ich möchte zum Beispiel gut Deutsch sprechen und später in Deutschland studieren. Dafür brauche ich Zeit, Geduld und einen guten Lernplan. Im Moment besuche ich einen Sprachkurs und lerne jeden Abend zu Hause. Ich kann nicht jeden Tag mehrere Stunden lernen, weil ich auch arbeite und meiner Familie helfe. Trotzdem versuche ich, regelmäßig zu üben. Meine Freundin Aizada hat andere Wünsche. Sie möchte eine eigene kleine Bäckerei eröffnen."],
    wordCount: 72,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Meine Wünsche und Möglichkeiten", "Mein Morgen und mein Alltag", "Was kann und muss ich?"],
      answer: 0
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're29',
    level: 'A1',
    unit: 129,
    title: "Mein Morgen und mein Alltag",
    body: ["Mein Morgen beginnt normalerweise um sechs Uhr dreißig. Wenn der Wecker klingelt, stehe ich auf und öffne das Fenster. Zuerst gehe ich ins Badezimmer, wasche mein Gesicht und putze meine Zähne. Danach ziehe ich mich an und mache mein Bett. Ich versuche, mein Handy am Morgen nicht sofort zu benutzen, damit ich ruhig in den Tag starten kann. Um sieben Uhr frühstücke ich. Meistens esse ich Brot mit Käse oder ein Ei. Dazu trinke ich schwarzen Tee. Während ich frühstücke, spreche ich kurz mit meiner Mutter."],
    wordCount: 86,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Meine Wünsche und Möglichkeiten", "Mein Morgen und mein Alltag", "Im Restaurant und zu Hause"],
      answer: 1
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're30',
    level: 'A1',
    unit: 130,
    title: "Im Restaurant und zu Hause",
    body: ["Am Samstag möchte meine Familie nicht kochen. Deshalb gehen wir am Abend in ein kleines Restaurant in unserer Nähe. Mein Vater reserviert einen Tisch für fünf Personen. Als wir ankommen, begrüßt uns ein Kellner und zeigt uns einen Platz am Fenster. Er bringt die Speisekarten und fragt, ob wir schon etwas trinken möchten. Meine Mutter bestellt schwarzen Tee, mein Vater nimmt Wasser. Meine Schwester möchte eine Limonade. Ich lese die Speisekarte und entscheide mich für Lagman. Mein Bruder bestellt Manty."],
    wordCount: 80,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Meine Freizeit und Hobbys", "Mein Morgen und mein Alltag", "Im Restaurant und zu Hause"],
      answer: 2
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're31',
    level: 'A1',
    unit: 131,
    title: "Meine Freizeit und Hobbys",
    body: ["In meiner Freizeit mache ich gern verschiedene Dinge. Unter der Woche habe ich nicht viel Zeit, weil ich studiere und am Abend Deutsch lerne. Trotzdem versuche ich, jeden Tag eine kleine Pause zu machen. Manchmal höre ich Musik, lese ein Buch oder gehe eine Runde spazieren. Wenn das Wetter schön ist, treffe ich meine Freunde im Park. Mein bester Freund heißt Ermek. Er spielt gern Basketball und trainiert zweimal pro Woche. Am Wochenende gehen wir manchmal zusammen auf den Sportplatz."],
    wordCount: 80,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Meine Freizeit und Hobbys", "Uhrzeit, Tage und Termine", "Im Restaurant und zu Hause"],
      answer: 0
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're32',
    level: 'A1',
    unit: 132,
    title: "Uhrzeit, Tage und Termine",
    body: ["Am Montag beginnt meine Woche früh. Um sieben Uhr stehe ich auf und frühstücke. Um acht Uhr fährt mein Bus zur Universität. Der Unterricht beginnt um halb neun und endet meistens um zwei Uhr. Am Dienstag habe ich zusätzlich einen Deutschkurs. Er beginnt um sechzehn Uhr und dauert bis halb sechs. Am Mittwoch treffe ich meine Freundin Aizada. Wir haben einen Termin in der Bibliothek, weil wir gemeinsam für eine Prüfung lernen möchten. Wir treffen uns um Viertel nach drei vor dem Eingang."],
    wordCount: 83,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Meine Freizeit und Hobbys", "Uhrzeit, Tage und Termine", "Wohin gehe ich?"],
      answer: 1
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're33',
    level: 'A1',
    unit: 133,
    title: "Wohin gehe ich?",
    body: ["Heute habe ich mehrere Dinge zu erledigen. Zuerst gehe ich zur Universität, denn am Vormittag habe ich eine Vorlesung. Danach möchte ich in die Bibliothek gehen, um ein Buch zurückzugeben. Meine Freundin Amina kommt mit. Sie muss dort für eine Prüfung lernen. Wir bleiben ungefähr eine Stunde und gehen dann zusammen in die Mensa. Nach dem Mittagessen fahre ich ins Stadtzentrum. Ich möchte ein Geschenk für meinen Vater kaufen. In einem Geschäft suche ich eine warme Mütze. Danach gehe ich zur Post, weil ich ein Paket an meine Tante schicken muss."],
    wordCount: 91,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Wo bin ich?", "Uhrzeit, Tage und Termine", "Wohin gehe ich?"],
      answer: 2
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're34',
    level: 'A1',
    unit: 134,
    title: "Wo bin ich?",
    body: ["Wenn ich in einer neuen Stadt bin, muss ich zuerst herausfinden, wo wichtige Orte liegen. Letzte Woche war ich zum ersten Mal in Osch. Ich bin mit dem Bus angekommen und wusste nicht genau, wo mein Hotel ist. Deshalb habe ich eine Frau an der Haltestelle gefragt: „Entschuldigung, wo ist das Stadtzentrum?“ Sie hat mir freundlich den Weg erklärt. Das Hotel lag in einer ruhigen Straße, nicht weit vom Markt entfernt. Neben dem Hotel gab es eine Bäckerei und gegenüber einen kleinen Park."],
    wordCount: 83,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Wo bin ich?", "Meine Wohnung und Möbel", "Wohin gehe ich?"],
      answer: 0
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're35',
    level: 'A1',
    unit: 135,
    title: "Meine Wohnung und Möbel",
    body: ["Wir wohnen in einer gemütlichen Wohnung im dritten Stock. Sie ist nicht sehr groß, aber für unsere Familie reicht sie aus. Es gibt ein Wohnzimmer, zwei Schlafzimmer, eine Küche und ein Badezimmer. Im Wohnzimmer stehen ein großes Sofa und zwei Sessel. Vor dem Sofa liegt ein Teppich. An der Wand hängt ein Fernseher, und neben dem Fenster steht eine grüne Pflanze. Die Küche ist klein, aber praktisch. Neben dem Kühlschrank steht der Herd. Über dem Tisch hängen zwei Lampen."],
    wordCount: 79,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Wo bin ich?", "Meine Wohnung und Möbel", "Früher und heute"],
      answer: 1
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're36',
    level: 'A1',
    unit: 136,
    title: "Früher und heute",
    body: ["Als mein Vater jung war, sah sein Alltag ganz anders aus als heute. Er wohnte mit seinen Eltern und vier Geschwistern in einem Dorf in der Nähe von Naryn. Das Haus war klein, aber die Familie hatte einen großen Garten. Mein Vater ging jeden Morgen zu Fuß zur Schule. Einen Bus gab es in seinem Dorf damals nicht. Nach dem Unterricht half er seinen Eltern bei der Arbeit und spielte draußen mit seinen Freunden. Heute ist vieles einfacher."],
    wordCount: 78,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Was habe ich gemacht?", "Meine Wohnung und Möbel", "Früher und heute"],
      answer: 2
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're37',
    level: 'A1',
    unit: 137,
    title: "Was habe ich gemacht?",
    body: ["Gestern hatte ich einen sehr aktiven Tag. Am Morgen bin ich um sieben Uhr aufgestanden und habe zuerst gefrühstückt. Danach habe ich meine Tasche gepackt und bin zur Universität gefahren. In der ersten Vorlesung haben wir über Wirtschaft gesprochen. Ich habe viele Notizen gemacht, weil das Thema für die Prüfung wichtig ist. In der Mittagspause habe ich mit meinem Freund Bekzat in der Mensa gegessen. Wir haben Suppe und Brot genommen und über unsere Pläne für das Wochenende gesprochen."],
    wordCount: 79,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Was habe ich gemacht?", "Unterwegs in der Stadt", "Früher und heute"],
      answer: 0
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
  {
    id: 're38',
    level: 'A1',
    unit: 138,
    title: "Unterwegs in der Stadt",
    body: ["Heute fahre ich mit meiner Cousine Meerim ins Stadtzentrum. Wir möchten einige Besorgungen machen und danach einen Kaffee trinken. Zuerst gehen wir zur Bushaltestelle. Der Bus kommt nach fünf Minuten, und wir steigen ein. Während der Fahrt schauen wir aus dem Fenster. Auf den Straßen sind viele Autos und Menschen unterwegs. Wir steigen am zentralen Platz aus. Dort steht ein großes Denkmal, und gegenüber befindet sich ein Einkaufszentrum. Meerim möchte ein neues Notizbuch kaufen. Wir gehen in einen Schreibwarenladen und suchen ein Heft mit einem schönen Umschlag."],
    wordCount: 87,
    gloss: [],
    questions: [{
      q: 'Wie lautet der Titel dieses Textes?',
      options: ["Was habe ich gemacht?", "Unterwegs in der Stadt", "Hallo & Ich"],
      answer: 1
    }],
    source: { kind: 'authored', author: 'BilUp Til' },
  },
]

export const READING: ReadingText[] = [
  ...A1_LESETEXTE,
]

export const readingById = new Map(READING.map(t => [t.id, t]))
export const readingForUnit = (unit: number) => READING.filter(t => t.unit === unit)
