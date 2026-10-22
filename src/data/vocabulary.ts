import type { Article, PartOfSpeech, VocabularyItem } from './types'

/**
 * Compact authoring format → expanded into VocabularyItem.
 * [unit, kind, de, plural, ru, ky, example, exampleRu]
 * kind: der|die|das (noun) · v verb · a adjective · p phrase · o other
 * NOTE: Kyrgyz glosses should be reviewed by a native speaker before release.
 */
type Row = [number, string, string, string, string, string, string, string]

const rows: Row[] = [
  // ---------- UNIT 1 · Hallo & Ich ----------
  [1, 'p', 'Hallo', '', 'привет', 'салам', 'Hallo, ich bin Daniiar.', 'Привет, я Данияр.'],
  [1, 'p', 'Guten Morgen', '', 'доброе утро', 'кайырлуу таң', 'Guten Morgen, Frau Weber!', 'Доброе утро, госпожа Вебер!'],
  [1, 'p', 'Guten Tag', '', 'добрый день', 'кайырлуу күн', 'Guten Tag, ich habe einen Termin.', 'Добрый день, у меня назначено.'],
  [1, 'p', 'Guten Abend', '', 'добрый вечер', 'кайырлуу кеч', 'Guten Abend, wie geht es Ihnen?', 'Добрый вечер, как у вас дела?'],
  [1, 'p', 'Tschüss', '', 'пока', 'саламатта бол', 'Tschüss, bis morgen!', 'Пока, до завтра!'],
  [1, 'p', 'Auf Wiedersehen', '', 'до свидания', 'кош болуңуз', 'Auf Wiedersehen und einen schönen Tag!', 'До свидания и хорошего дня!'],
  [1, 'p', 'Danke', '', 'спасибо', 'рахмат', 'Danke für Ihre Hilfe.', 'Спасибо за вашу помощь.'],
  [1, 'p', 'Bitte', '', 'пожалуйста', 'сураныч', 'Einen Kaffee, bitte.', 'Один кофе, пожалуйста.'],
  [1, 'p', 'Entschuldigung', '', 'извините', 'кечиресиз', 'Entschuldigung, wo ist der Bahnhof?', 'Извините, где вокзал?'],
  [1, 'p', 'Wie geht es Ihnen?', '', 'как у вас дела?', 'кандайсыз?', 'Guten Tag, Herr Müller. Wie geht es Ihnen?', 'Добрый день, господин Мюллер. Как у вас дела?'],
  [1, 'p', 'Wie bitte?', '', 'что, простите?', 'кечиресиз, кайталаңызчы', 'Wie bitte? Können Sie das wiederholen?', 'Простите? Вы можете повторить?'],
  [1, 'p', 'Ich verstehe nicht.', '', 'я не понимаю', 'мен түшүнгөн жокмун', 'Ich verstehe nicht. Langsamer, bitte.', 'Я не понимаю. Помедленнее, пожалуйста.'],
  [1, 'p', 'Freut mich.', '', 'приятно познакомиться', 'таанышканыма кубанычтамын', 'Ich bin Anna. – Freut mich!', 'Я Анна. — Очень приятно!'],
  [1, 'o', 'ja', '', 'да', 'ооба', 'Ja, das stimmt.', 'Да, верно.'],
  [1, 'o', 'nein', '', 'нет', 'жок', 'Nein, danke.', 'Нет, спасибо.'],
  [1, 'die', 'Sprache', 'Sprachen', 'язык', 'тил', 'Ich lerne die deutsche Sprache.', 'Я учу немецкий язык.'],
  [1, 'das', 'Land', 'Länder', 'страна', 'өлкө', 'Mein Land ist schön.', 'Моя страна красивая.'],
  [1, 'der', 'Name', 'Namen', 'имя', 'аты', 'Mein Name ist Daniiar.', 'Меня зовут Данияр.'],
  [1, 'v', 'heißen', '', 'называться, зваться', 'аталуу', 'Ich heiße Anna.', 'Меня зовут Анна.'],
  [1, 'v', 'kommen', '', 'приходить, происходить из', 'келүү', 'Ich komme aus Kirgisistan.', 'Я родом из Кыргызстана.'],
  [1, 'v', 'wohnen', '', 'жить, проживать', 'жашоо', 'Ich wohne in Berlin.', 'Я живу в Берлине.'],
  [1, 'v', 'sprechen', '', 'говорить', 'сүйлөө', 'Ich spreche Russisch und ein bisschen Deutsch.', 'Я говорю по-русски и немного по-немецки.'],
  [1, 'v', 'sein', '', 'быть', 'болуу', 'Ich bin neu hier.', 'Я здесь новенький.'],

  // ---------- UNIT 2 · Meine Familie ----------
  [2, 'die', 'Familie', 'Familien', 'семья', 'үй-бүлө', 'Meine Familie ist groß.', 'Моя семья большая.'],
  [2, 'die', 'Mutter', 'Mütter', 'мама', 'эне', 'Meine Mutter kocht gern.', 'Моя мама любит готовить.'],
  [2, 'der', 'Vater', 'Väter', 'папа', 'ата', 'Mein Vater arbeitet bei einer Firma.', 'Мой папа работает в фирме.'],
  [2, 'die', 'Eltern', '', 'родители', 'ата-эне', 'Meine Eltern wohnen in Bischkek.', 'Мои родители живут в Бишкеке.'],
  [2, 'der', 'Bruder', 'Brüder', 'брат', 'ага / ини', 'Mein Bruder studiert in Hamburg.', 'Мой брат учится в Гамбурге.'],
  [2, 'die', 'Schwester', 'Schwestern', 'сестра', 'эже / сиңди', 'Meine Schwester ist zehn Jahre alt.', 'Моей сестре десять лет.'],
  [2, 'das', 'Kind', 'Kinder', 'ребёнок', 'бала', 'Wir haben zwei Kinder.', 'У нас двое детей.'],
  [2, 'der', 'Sohn', 'Söhne', 'сын', 'уул', 'Mein Sohn geht in den Kindergarten.', 'Мой сын ходит в детский сад.'],
  [2, 'die', 'Tochter', 'Töchter', 'дочь', 'кыз', 'Meine Tochter heißt Aida.', 'Мою дочь зовут Аида.'],
  [2, 'der', 'Opa', 'Opas', 'дедушка', 'чоң ата', 'Mein Opa erzählt gern Geschichten.', 'Мой дедушка любит рассказывать истории.'],
  [2, 'die', 'Oma', 'Omas', 'бабушка', 'чоң эне', 'Meine Oma backt sehr gut.', 'Моя бабушка очень хорошо печёт.'],
  [2, 'der', 'Onkel', 'Onkel', 'дядя', 'таяке', 'Mein Onkel wohnt in Deutschland.', 'Мой дядя живёт в Германии.'],
  [2, 'die', 'Tante', 'Tanten', 'тётя', 'таяже', 'Meine Tante besucht uns am Sonntag.', 'Моя тётя навестит нас в воскресенье.'],
  [2, 'der', 'Ehemann', 'Ehemänner', 'муж', 'күйөө', 'Ihr Ehemann ist Arzt.', 'Её муж — врач.'],
  [2, 'die', 'Ehefrau', 'Ehefrauen', 'жена', 'жубай', 'Seine Ehefrau kommt aus Polen.', 'Его жена родом из Польши.'],
  [2, 'der', 'Freund', 'Freunde', 'друг', 'дос', 'Das ist mein Freund Tim.', 'Это мой друг Тим.'],
  [2, 'die', 'Freundin', 'Freundinnen', 'подруга', 'дос кыз', 'Meine Freundin spricht drei Sprachen.', 'Моя подруга говорит на трёх языках.'],
  [2, 'v', 'haben', '', 'иметь', 'ээ болуу', 'Ich habe zwei Brüder.', 'У меня два брата.'],
  [2, 'a', 'verheiratet', '', 'женат / замужем', 'үй-бүлөлүү', 'Ich bin verheiratet.', 'Я женат / замужем.'],
  [2, 'a', 'alt', '', 'старый', 'карыган, эски', 'Wie alt bist du?', 'Сколько тебе лет?'],
  [2, 'a', 'jung', '', 'молодой', 'жаш', 'Meine Schwester ist noch jung.', 'Моя сестра ещё молодая.'],
  [2, 'a', 'groß', '', 'большой, высокий', 'чоң', 'Mein Bruder ist sehr groß.', 'Мой брат очень высокий.'],
  [2, 'a', 'klein', '', 'маленький', 'кичине', 'Wir haben eine kleine Familie.', 'У нас маленькая семья.'],

  // ---------- UNIT 3 · Mein Alltag ----------
  [3, 'der', 'Tag', 'Tage', 'день', 'күн', 'Der Tag beginnt um sechs Uhr.', 'День начинается в шесть часов.'],
  [3, 'der', 'Morgen', 'Morgen', 'утро', 'эртең мененки убакыт', 'Am Morgen trinke ich Tee.', 'Утром я пью чай.'],
  [3, 'der', 'Abend', 'Abende', 'вечер', 'кеч', 'Am Abend sehe ich fern.', 'Вечером я смотрю телевизор.'],
  [3, 'die', 'Nacht', 'Nächte', 'ночь', 'түн', 'In der Nacht schlafe ich tief.', 'Ночью я крепко сплю.'],
  [3, 'die', 'Freizeit', '', 'свободное время', 'бош убакыт', 'In meiner Freizeit lese ich viel.', 'В свободное время я много читаю.'],
  [3, 'v', 'aufstehen', '', 'вставать', 'туруу', 'Ich stehe um sieben Uhr auf.', 'Я встаю в семь часов.'],
  [3, 'v', 'frühstücken', '', 'завтракать', 'эртең мененки тамак ичүү', 'Wir frühstücken zusammen.', 'Мы завтракаем вместе.'],
  [3, 'v', 'arbeiten', '', 'работать', 'иштөө', 'Ich arbeite von neun bis fünf.', 'Я работаю с девяти до пяти.'],
  [3, 'v', 'lernen', '', 'учить, учиться', 'үйрөнүү', 'Ich lerne jeden Tag Deutsch.', 'Я каждый день учу немецкий.'],
  [3, 'v', 'schlafen', '', 'спать', 'уктоо', 'Ich schlafe acht Stunden.', 'Я сплю восемь часов.'],
  [3, 'v', 'kochen', '', 'готовить', 'тамак жасоо', 'Heute koche ich Suppe.', 'Сегодня я варю суп.'],
  [3, 'v', 'putzen', '', 'убирать, чистить', 'тазалоо', 'Am Samstag putze ich die Wohnung.', 'В субботу я убираю квартиру.'],
  [3, 'v', 'lesen', '', 'читать', 'окуу', 'Abends lese ich ein Buch.', 'Вечером я читаю книгу.'],
  [3, 'v', 'fernsehen', '', 'смотреть телевизор', 'телевизор көрүү', 'Wir sehen am Abend fern.', 'Вечером мы смотрим телевизор.'],
  [3, 'v', 'duschen', '', 'принимать душ', 'душка түшүү', 'Ich dusche jeden Morgen.', 'Я принимаю душ каждое утро.'],
  [3, 'o', 'heute', '', 'сегодня', 'бүгүн', 'Heute habe ich frei.', 'Сегодня у меня выходной.'],
  [3, 'o', 'morgen', '', 'завтра', 'эртең', 'Morgen arbeite ich nicht.', 'Завтра я не работаю.'],
  [3, 'o', 'immer', '', 'всегда', 'дайыма', 'Ich trinke immer Kaffee.', 'Я всегда пью кофе.'],
  [3, 'o', 'oft', '', 'часто', 'көп учурда', 'Ich gehe oft spazieren.', 'Я часто гуляю.'],
  [3, 'o', 'manchmal', '', 'иногда', 'кээде', 'Manchmal koche ich für Freunde.', 'Иногда я готовлю для друзей.'],
  [3, 'o', 'nie', '', 'никогда', 'эч качан', 'Ich stehe nie früh auf.', 'Я никогда не встаю рано.'],
  [3, 'a', 'müde', '', 'усталый', 'чарчаган', 'Nach der Arbeit bin ich müde.', 'После работы я устал.'],

  // ---------- UNIT 4 · Essen & Trinken ----------
  [4, 'das', 'Brot', 'Brote', 'хлеб', 'нан', 'Ich esse Brot mit Käse.', 'Я ем хлеб с сыром.'],
  [4, 'das', 'Wasser', '', 'вода', 'суу', 'Ein Glas Wasser, bitte.', 'Стакан воды, пожалуйста.'],
  [4, 'der', 'Kaffee', 'Kaffees', 'кофе', 'кофе', 'Ich möchte einen Kaffee.', 'Я хотел бы кофе.'],
  [4, 'der', 'Tee', 'Tees', 'чай', 'чай', 'Trinkst du gern Tee?', 'Ты любишь пить чай?'],
  [4, 'die', 'Milch', '', 'молоко', 'сүт', 'Ich trinke Kaffee mit Milch.', 'Я пью кофе с молоком.'],
  [4, 'der', 'Apfel', 'Äpfel', 'яблоко', 'алма', 'Der Apfel ist sehr süß.', 'Яблоко очень сладкое.'],
  [4, 'das', 'Fleisch', '', 'мясо', 'эт', 'Ich esse kein Fleisch.', 'Я не ем мясо.'],
  [4, 'der', 'Käse', '', 'сыр', 'сыр', 'Möchten Sie Käse?', 'Хотите сыр?'],
  [4, 'das', 'Ei', 'Eier', 'яйцо', 'жумуртка', 'Zum Frühstück esse ich zwei Eier.', 'На завтрак я ем два яйца.'],
  [4, 'der', 'Reis', '', 'рис', 'күрүч', 'Dazu gibt es Reis.', 'К этому подают рис.'],
  [4, 'die', 'Suppe', 'Suppen', 'суп', 'шорпо', 'Die Suppe ist heiß.', 'Суп горячий.'],
  [4, 'der', 'Salat', 'Salate', 'салат', 'салат', 'Ich nehme einen Salat.', 'Я возьму салат.'],
  [4, 'die', 'Kartoffel', 'Kartoffeln', 'картофель', 'картөшкө', 'Ich esse gern Kartoffeln.', 'Я люблю картошку.'],
  [4, 'das', 'Gemüse', '', 'овощи', 'жашылча', 'Gemüse ist gesund.', 'Овощи полезны.'],
  [4, 'die', 'Speisekarte', 'Speisekarten', 'меню', 'меню', 'Die Speisekarte, bitte.', 'Меню, пожалуйста.'],
  [4, 'die', 'Rechnung', 'Rechnungen', 'счёт', 'эсеп', 'Die Rechnung, bitte!', 'Счёт, пожалуйста!'],
  [4, 'v', 'essen', '', 'есть, кушать', 'жеш', 'Wir essen um zwölf Uhr.', 'Мы едим в двенадцать часов.'],
  [4, 'v', 'trinken', '', 'пить', 'ичүү', 'Ich trinke Wasser.', 'Я пью воду.'],
  [4, 'v', 'bestellen', '', 'заказывать', 'буйрутма берүү', 'Ich bestelle eine Suppe.', 'Я заказываю суп.'],
  [4, 'v', 'möchten', '', 'хотеть (вежливо)', 'каалоо', 'Ich möchte bitte zahlen.', 'Я хотел бы расплатиться.'],
  [4, 'v', 'zahlen', '', 'платить', 'төлөө', 'Zusammen oder getrennt zahlen?', 'Платить вместе или раздельно?'],
  [4, 'a', 'lecker', '', 'вкусный', 'даамдуу', 'Das schmeckt sehr lecker!', 'Это очень вкусно!'],
  [4, 'p', 'Hunger haben', '', 'быть голодным', 'ачка болуу', 'Ich habe großen Hunger.', 'Я очень голоден.'],

  // ---------- UNIT 5 · Meine Wohnung ----------
  [5, 'die', 'Wohnung', 'Wohnungen', 'квартира', 'батир', 'Meine Wohnung hat drei Zimmer.', 'В моей квартире три комнаты.'],
  [5, 'das', 'Haus', 'Häuser', 'дом', 'үй', 'Das Haus ist alt.', 'Дом старый.'],
  [5, 'das', 'Zimmer', 'Zimmer', 'комната', 'бөлмө', 'Das Zimmer ist hell.', 'Комната светлая.'],
  [5, 'die', 'Küche', 'Küchen', 'кухня', 'ашкана', 'Die Küche ist klein.', 'Кухня маленькая.'],
  [5, 'das', 'Bad', 'Bäder', 'ванная', 'ванна бөлмөсү', 'Das Bad ist neben der Küche.', 'Ванная рядом с кухней.'],
  [5, 'das', 'Schlafzimmer', 'Schlafzimmer', 'спальня', 'уктоочу бөлмө', 'Im Schlafzimmer steht ein Bett.', 'В спальне стоит кровать.'],
  [5, 'das', 'Wohnzimmer', 'Wohnzimmer', 'гостиная', 'конок бөлмө', 'Im Wohnzimmer steht ein Sofa.', 'В гостиной стоит диван.'],
  [5, 'der', 'Tisch', 'Tische', 'стол', 'стол', 'Der Tisch ist aus Holz.', 'Стол деревянный.'],
  [5, 'der', 'Stuhl', 'Stühle', 'стул', 'отургуч', 'Ich brauche noch einen Stuhl.', 'Мне нужен ещё один стул.'],
  [5, 'das', 'Bett', 'Betten', 'кровать', 'керебет', 'Das Bett ist sehr bequem.', 'Кровать очень удобная.'],
  [5, 'das', 'Sofa', 'Sofas', 'диван', 'диван', 'Wir sitzen auf dem Sofa.', 'Мы сидим на диване.'],
  [5, 'der', 'Schrank', 'Schränke', 'шкаф', 'шкаф', 'Die Kleidung ist im Schrank.', 'Одежда в шкафу.'],
  [5, 'das', 'Fenster', 'Fenster', 'окно', 'терезе', 'Kannst du das Fenster öffnen?', 'Ты можешь открыть окно?'],
  [5, 'die', 'Tür', 'Türen', 'дверь', 'эшик', 'Bitte schließen Sie die Tür.', 'Закройте, пожалуйста, дверь.'],
  [5, 'der', 'Schlüssel', 'Schlüssel', 'ключ', 'ачкыч', 'Ich habe meinen Schlüssel verloren.', 'Я потерял свой ключ.'],
  [5, 'der', 'Balkon', 'Balkone', 'балкон', 'балкон', 'Die Wohnung hat einen Balkon.', 'В квартире есть балкон.'],
  [5, 'der', 'Kühlschrank', 'Kühlschränke', 'холодильник', 'муздаткыч', 'Der Kühlschrank ist leer.', 'Холодильник пуст.'],
  [5, 'die', 'Miete', 'Mieten', 'арендная плата', 'ижара акысы', 'Die Miete kostet 650 Euro.', 'Аренда стоит 650 евро.'],
  [5, 'der', 'Vermieter', 'Vermieter', 'арендодатель', 'үй ээси', 'Der Vermieter wohnt im Erdgeschoss.', 'Арендодатель живёт на первом этаже.'],
  [5, 'v', 'mieten', '', 'снимать, арендовать', 'ижарага алуу', 'Ich möchte eine Wohnung mieten.', 'Я хотел бы снять квартиру.'],
  [5, 'a', 'teuer', '', 'дорогой', 'кымбат', 'Die Wohnung ist zu teuer.', 'Квартира слишком дорогая.'],
  [5, 'a', 'günstig', '', 'недорогой, выгодный', 'арзан', 'Das Zimmer ist günstig.', 'Комната недорогая.'],
  [5, 'a', 'ruhig', '', 'тихий', 'тынч', 'Die Straße ist sehr ruhig.', 'Улица очень тихая.'],

  // ---------- UNIT 6 · Arbeit & Beruf ----------
  [6, 'die', 'Arbeit', '', 'работа', 'жумуш', 'Die Arbeit beginnt um acht Uhr.', 'Работа начинается в восемь часов.'],
  [6, 'der', 'Beruf', 'Berufe', 'профессия', 'кесип', 'Was sind Sie von Beruf?', 'Кто вы по профессии?'],
  [6, 'der', 'Arzt', 'Ärzte', 'врач', 'дарыгер', 'Ich gehe zum Arzt.', 'Я иду к врачу.'],
  [6, 'die', 'Ärztin', 'Ärztinnen', 'врач (женщина)', 'дарыгер (аял)', 'Die Ärztin ist sehr freundlich.', 'Врач очень приветлива.'],
  [6, 'der', 'Lehrer', 'Lehrer', 'учитель', 'мугалим', 'Mein Lehrer erklärt gut.', 'Мой учитель хорошо объясняет.'],
  [6, 'der', 'Fahrer', 'Fahrer', 'водитель', 'айдоочу', 'Mein Bruder ist Fahrer.', 'Мой брат — водитель.'],
  [6, 'der', 'Koch', 'Köche', 'повар', 'ашпозчу', 'Der Koch arbeitet im Restaurant.', 'Повар работает в ресторане.'],
  [6, 'der', 'Chef', 'Chefs', 'начальник', 'башчы', 'Mein Chef ist nett.', 'Мой начальник приятный.'],
  [6, 'der', 'Kollege', 'Kollegen', 'коллега', 'кесиптеш', 'Meine Kollegen helfen mir.', 'Мои коллеги мне помогают.'],
  [6, 'das', 'Büro', 'Büros', 'офис', 'кеңсе', 'Ich bin im Büro.', 'Я в офисе.'],
  [6, 'die', 'Firma', 'Firmen', 'фирма, компания', 'компания', 'Die Firma sucht neue Mitarbeiter.', 'Фирма ищет новых сотрудников.'],
  [6, 'der', 'Kunde', 'Kunden', 'клиент', 'кардар', 'Der Kunde wartet am Telefon.', 'Клиент ждёт у телефона.'],
  [6, 'das', 'Gehalt', 'Gehälter', 'зарплата', 'маяна', 'Das Gehalt ist gut.', 'Зарплата хорошая.'],
  [6, 'der', 'Vertrag', 'Verträge', 'договор', 'келишим', 'Ich unterschreibe den Vertrag.', 'Я подписываю договор.'],
  [6, 'die', 'Bewerbung', 'Bewerbungen', 'заявка на работу', 'жумушка арыз', 'Ich schreibe eine Bewerbung.', 'Я пишу заявление о приёме на работу.'],
  [6, 'der', 'Lebenslauf', 'Lebensläufe', 'резюме', 'резюме', 'Bitte schicken Sie Ihren Lebenslauf.', 'Пришлите, пожалуйста, ваше резюме.'],
  [6, 'die', 'Pause', 'Pausen', 'перерыв', 'танапис', 'Wir machen jetzt Pause.', 'Мы сейчас делаем перерыв.'],
  [6, 'die', 'Erfahrung', 'Erfahrungen', 'опыт', 'тажрыйба', 'Ich habe zwei Jahre Erfahrung.', 'У меня два года опыта.'],
  [6, 'v', 'verdienen', '', 'зарабатывать', 'тапкан', 'Er verdient 2.500 Euro im Monat.', 'Он зарабатывает 2500 евро в месяц.'],
  [6, 'v', 'suchen', '', 'искать', 'издөө', 'Ich suche eine Arbeit.', 'Я ищу работу.'],
  [6, 'v', 'helfen', '', 'помогать', 'жардам берүү', 'Kann ich Ihnen helfen?', 'Могу я вам помочь?'],
  [6, 'a', 'arbeitslos', '', 'безработный', 'жумушсуз', 'Er ist seit drei Monaten arbeitslos.', 'Он три месяца без работы.'],

  // ---------- UNIT 7 · In der Stadt ----------
  [7, 'die', 'Stadt', 'Städte', 'город', 'шаар', 'Die Stadt ist sehr grün.', 'Город очень зелёный.'],
  [7, 'die', 'Straße', 'Straßen', 'улица', 'көчө', 'Die Straße ist lang.', 'Улица длинная.'],
  [7, 'der', 'Bahnhof', 'Bahnhöfe', 'вокзал', 'вокзал', 'Wo ist der Bahnhof?', 'Где вокзал?'],
  [7, 'die', 'Haltestelle', 'Haltestellen', 'остановка', 'аялдама', 'Die Haltestelle ist da vorne.', 'Остановка вон там впереди.'],
  [7, 'der', 'Bus', 'Busse', 'автобус', 'автобус', 'Der Bus kommt gleich.', 'Автобус скоро приедет.'],
  [7, 'die', 'U-Bahn', 'U-Bahnen', 'метро', 'метро', 'Ich fahre mit der U-Bahn.', 'Я еду на метро.'],
  [7, 'das', 'Krankenhaus', 'Krankenhäuser', 'больница', 'оорукана', 'Das Krankenhaus ist in der Nähe.', 'Больница находится неподалёку.'],
  [7, 'die', 'Apotheke', 'Apotheken', 'аптека', 'дарыкана', 'Ich gehe in die Apotheke.', 'Я иду в аптеку.'],
  [7, 'die', 'Bank', 'Banken', 'банк', 'банк', 'Die Bank öffnet um neun Uhr.', 'Банк открывается в девять.'],
  [7, 'die', 'Post', '', 'почта', 'почта', 'Die Post ist neben der Bank.', 'Почта рядом с банком.'],
  [7, 'der', 'Supermarkt', 'Supermärkte', 'супермаркет', 'супермаркет', 'Der Supermarkt ist bis 22 Uhr offen.', 'Супермаркет открыт до 22 часов.'],
  [7, 'der', 'Park', 'Parks', 'парк', 'парк', 'Wir gehen im Park spazieren.', 'Мы гуляем в парке.'],
  [7, 'die', 'Schule', 'Schulen', 'школа', 'мектеп', 'Die Schule ist gegenüber.', 'Школа напротив.'],
  [7, 'die', 'Ampel', 'Ampeln', 'светофор', 'светофор', 'Bei der Ampel links.', 'На светофоре налево.'],
  [7, 'die', 'Ecke', 'Ecken', 'угол', 'бурч', 'An der Ecke ist ein Café.', 'На углу есть кафе.'],
  [7, 'o', 'links', '', 'налево, слева', 'солго', 'Gehen Sie links.', 'Идите налево.'],
  [7, 'o', 'rechts', '', 'направо, справа', 'оңго', 'Dann rechts.', 'Затем направо.'],
  [7, 'o', 'geradeaus', '', 'прямо', 'түз', 'Gehen Sie geradeaus.', 'Идите прямо.'],
  [7, 'a', 'weit', '', 'далеко', 'алыс', 'Ist es weit von hier?', 'Это далеко отсюда?'],
  [7, 'a', 'nah', '', 'близко', 'жакын', 'Die Apotheke ist ganz nah.', 'Аптека совсем рядом.'],
  [7, 'v', 'finden', '', 'находить', 'табуу', 'Ich finde die Straße nicht.', 'Я не нахожу улицу.'],
  [7, 'p', 'Wo ist …?', '', 'где находится …?', 'кайда …?', 'Entschuldigung, wo ist die Post?', 'Извините, где почта?'],

  // ---------- UNIT 8 · Zeit & Termine ----------
  [8, 'die', 'Uhr', 'Uhren', 'часы; час (время)', 'саат', 'Wie viel Uhr ist es?', 'Который час?'],
  [8, 'die', 'Stunde', 'Stunden', 'час (длительность)', 'саат (убакыт)', 'Der Kurs dauert zwei Stunden.', 'Курс длится два часа.'],
  [8, 'die', 'Minute', 'Minuten', 'минута', 'мүнөт', 'Warten Sie bitte fünf Minuten.', 'Подождите, пожалуйста, пять минут.'],
  [8, 'die', 'Woche', 'Wochen', 'неделя', 'жума', 'Nächste Woche habe ich Urlaub.', 'На следующей неделе у меня отпуск.'],
  [8, 'der', 'Monat', 'Monate', 'месяц', 'ай', 'Ich wohne seit einem Monat hier.', 'Я живу здесь уже месяц.'],
  [8, 'das', 'Jahr', 'Jahre', 'год', 'жыл', 'Ich lerne seit einem Jahr Deutsch.', 'Я учу немецкий уже год.'],
  [8, 'der', 'Montag', 'Montage', 'понедельник', 'дүйшөмбү', 'Am Montag habe ich einen Termin.', 'В понедельник у меня встреча.'],
  [8, 'der', 'Freitag', 'Freitage', 'пятница', 'жума (күн)', 'Am Freitag arbeite ich bis zwölf.', 'В пятницу я работаю до двенадцати.'],
  [8, 'der', 'Samstag', 'Samstage', 'суббота', 'ишемби', 'Am Samstag gehe ich einkaufen.', 'В субботу я хожу за покупками.'],
  [8, 'der', 'Sonntag', 'Sonntage', 'воскресенье', 'жекшемби', 'Am Sonntag schlafe ich lange.', 'В воскресенье я долго сплю.'],
  [8, 'das', 'Wochenende', 'Wochenenden', 'выходные', 'дем алыш', 'Was machst du am Wochenende?', 'Что ты делаешь на выходных?'],
  [8, 'der', 'Termin', 'Termine', 'встреча, запись на приём', 'жолугушуу, убакыт макулдашуу', 'Ich möchte einen Termin vereinbaren.', 'Я хотел бы записаться на приём.'],
  [8, 'der', 'Kalender', 'Kalender', 'календарь', 'календарь', 'Ich schaue in den Kalender.', 'Я смотрю в календарь.'],
  [8, 'v', 'vereinbaren', '', 'договариваться', 'макулдашуу', 'Wir vereinbaren einen Termin.', 'Мы договариваемся о встрече.'],
  [8, 'v', 'verschieben', '', 'переносить', 'жылдыруу', 'Kann ich den Termin verschieben?', 'Могу я перенести приём?'],
  [8, 'v', 'absagen', '', 'отменять', 'жокко чыгаруу', 'Leider muss ich den Termin absagen.', 'К сожалению, мне нужно отменить встречу.'],
  [8, 'v', 'dauern', '', 'длиться', 'созулуу', 'Wie lange dauert das?', 'Как долго это длится?'],
  [8, 'a', 'pünktlich', '', 'пунктуальный, вовремя', 'так убагында', 'Bitte kommen Sie pünktlich.', 'Пожалуйста, приходите вовремя.'],
  [8, 'a', 'früh', '', 'рано', 'эрте', 'Ich stehe früh auf.', 'Я рано встаю.'],
  [8, 'a', 'spät', '', 'поздно', 'кеч', 'Es ist schon spät.', 'Уже поздно.'],
  [8, 'o', 'wann', '', 'когда', 'качан', 'Wann hast du Zeit?', 'Когда у тебя есть время?'],
  [8, 'p', 'Wie spät ist es?', '', 'который час?', 'саат канча болду?', 'Entschuldigung, wie spät ist es?', 'Извините, который час?'],

  // ---------- UNIT 9 · Einkaufen ----------
  [9, 'v', 'kaufen', '', 'покупать', 'сатып алуу', 'Ich kaufe Brot und Milch.', 'Я покупаю хлеб и молоко.'],
  [9, 'v', 'kosten', '', 'стоить', 'баасы … болуу', 'Wie viel kostet das?', 'Сколько это стоит?'],
  [9, 'v', 'brauchen', '', 'нуждаться, требоваться', 'муктаж болуу', 'Ich brauche eine Tüte.', 'Мне нужен пакет.'],
  [9, 'v', 'nehmen', '', 'брать', 'алуу', 'Ich nehme das.', 'Я возьму это.'],
  [9, 'v', 'anprobieren', '', 'примерять', 'кийип көрүү', 'Kann ich die Jacke anprobieren?', 'Можно примерить куртку?'],
  [9, 'v', 'umtauschen', '', 'обменять', 'алмаштыруу', 'Ich möchte die Hose umtauschen.', 'Я хотел бы обменять брюки.'],
  [9, 'der', 'Preis', 'Preise', 'цена', 'баа', 'Der Preis ist fair.', 'Цена справедливая.'],
  [9, 'das', 'Geld', '', 'деньги', 'акча', 'Ich habe kein Geld dabei.', 'У меня нет с собой денег.'],
  [9, 'der', 'Euro', 'Euro', 'евро', 'евро', 'Das macht fünf Euro.', 'С вас пять евро.'],
  [9, 'die', 'Kasse', 'Kassen', 'касса', 'касса', 'Bitte zahlen Sie an der Kasse.', 'Пожалуйста, платите на кассе.'],
  [9, 'die', 'Tüte', 'Tüten', 'пакет', 'баштык', 'Brauchen Sie eine Tüte?', 'Вам нужен пакет?'],
  [9, 'die', 'Karte', 'Karten', 'карта, билет', 'карта', 'Kann ich mit Karte zahlen?', 'Могу я заплатить картой?'],
  [9, 'das', 'Angebot', 'Angebote', 'предложение, акция', 'арзандатуу', 'Heute gibt es ein Angebot.', 'Сегодня есть акция.'],
  [9, 'das', 'Geschäft', 'Geschäfte', 'магазин', 'дүкөн', 'Das Geschäft öffnet um zehn.', 'Магазин открывается в десять.'],
  [9, 'der', 'Markt', 'Märkte', 'рынок', 'базар', 'Am Samstag gehe ich auf den Markt.', 'В субботу я хожу на рынок.'],
  [9, 'die', 'Größe', 'Größen', 'размер', 'өлчөм', 'Welche Größe haben Sie?', 'Какой у вас размер?'],
  [9, 'die', 'Hose', 'Hosen', 'брюки', 'шым', 'Die Hose ist zu lang.', 'Брюки слишком длинные.'],
  [9, 'die', 'Jacke', 'Jacken', 'куртка', 'куртка', 'Die Jacke gefällt mir.', 'Мне нравится куртка.'],
  [9, 'der', 'Schuh', 'Schuhe', 'туфля, обувь', 'бут кийим', 'Die Schuhe sind bequem.', 'Туфли удобные.'],
  [9, 'der', 'Kassenzettel', 'Kassenzettel', 'чек', 'чек', 'Behalten Sie den Kassenzettel.', 'Сохраните чек.'],
  [9, 'a', 'bar', '', 'наличными', 'накталай', 'Ich zahle bar.', 'Я плачу наличными.'],
  [9, 'a', 'billig', '', 'дешёвый', 'арзан', 'Das ist nicht billig.', 'Это недёшево.'],
  [9, 'p', 'Wie viel kostet das?', '', 'сколько это стоит?', 'бул канча турат?', 'Entschuldigung, wie viel kostet das?', 'Извините, сколько это стоит?'],

  // ---------- UNIT 10 · Unterwegs ----------
  [10, 'v', 'reisen', '', 'путешествовать', 'саякаттоо', 'Ich reise gern.', 'Я люблю путешествовать.'],
  [10, 'v', 'umsteigen', '', 'делать пересадку', 'которулуу', 'In Köln müssen Sie umsteigen.', 'В Кёльне вам нужно сделать пересадку.'],
  [10, 'v', 'ankommen', '', 'прибывать', 'келип жетүү', 'Der Zug kommt um 14 Uhr an.', 'Поезд прибывает в 14 часов.'],
  [10, 'v', 'abfahren', '', 'отправляться', 'жөнөө', 'Der Zug fährt um acht Uhr ab.', 'Поезд отправляется в восемь часов.'],
  [10, 'v', 'reservieren', '', 'бронировать', 'брондоо', 'Ich möchte einen Platz reservieren.', 'Я хотел бы забронировать место.'],
  [10, 'v', 'fliegen', '', 'лететь', 'учуу', 'Wir fliegen nach München.', 'Мы летим в Мюнхен.'],
  [10, 'der', 'Zug', 'Züge', 'поезд', 'поезд', 'Der Zug hat Verspätung.', 'Поезд опаздывает.'],
  [10, 'die', 'Fahrkarte', 'Fahrkarten', 'билет (на транспорт)', 'билет', 'Eine Fahrkarte nach Berlin, bitte.', 'Один билет до Берлина, пожалуйста.'],
  [10, 'das', 'Gleis', 'Gleise', 'путь, платформа', 'жол, платформа', 'Der Zug fährt auf Gleis 5 ab.', 'Поезд отправляется с пути 5.'],
  [10, 'die', 'Abfahrt', 'Abfahrten', 'отправление', 'жөнөө', 'Die Abfahrt ist um 9:15 Uhr.', 'Отправление в 9:15.'],
  [10, 'die', 'Ankunft', 'Ankünfte', 'прибытие', 'келүү', 'Die Ankunft ist um 12:40 Uhr.', 'Прибытие в 12:40.'],
  [10, 'die', 'Verspätung', 'Verspätungen', 'опоздание, задержка', 'кечигүү', 'Der Zug hat zehn Minuten Verspätung.', 'Поезд опаздывает на десять минут.'],
  [10, 'der', 'Flughafen', 'Flughäfen', 'аэропорт', 'аэропорт', 'Der Flughafen ist weit weg.', 'Аэропорт далеко.'],
  [10, 'das', 'Flugzeug', 'Flugzeuge', 'самолёт', 'учак', 'Das Flugzeug landet gleich.', 'Самолёт скоро приземлится.'],
  [10, 'der', 'Koffer', 'Koffer', 'чемодан', 'чемодан', 'Mein Koffer ist sehr schwer.', 'Мой чемодан очень тяжёлый.'],
  [10, 'der', 'Pass', 'Pässe', 'паспорт', 'паспорт', 'Haben Sie Ihren Pass dabei?', 'У вас с собой паспорт?'],
  [10, 'das', 'Hotel', 'Hotels', 'гостиница', 'мейманкана', 'Das Hotel liegt im Zentrum.', 'Отель находится в центре.'],
  [10, 'die', 'Reise', 'Reisen', 'поездка', 'саякат', 'Gute Reise!', 'Счастливого пути!'],
  [10, 'der', 'Urlaub', '', 'отпуск', 'эс алуу', 'Im Urlaub fahre ich ans Meer.', 'В отпуске я еду на море.'],
  [10, 'das', 'Auto', 'Autos', 'машина', 'машина', 'Ich fahre mit dem Auto zur Arbeit.', 'Я езжу на работу на машине.'],
  [10, 'das', 'Fahrrad', 'Fahrräder', 'велосипед', 'велосипед', 'Ich fahre mit dem Fahrrad.', 'Я езжу на велосипеде.'],
  [10, 'a', 'direkt', '', 'прямой, напрямую', 'түз', 'Gibt es eine direkte Verbindung?', 'Есть прямой рейс?'],
  [10, 'a', 'verspätet', '', 'опаздывающий', 'кечиккен', 'Der Bus ist verspätet.', 'Автобус опаздывает.'],
]

const posOf = (k: string): PartOfSpeech =>
  k === 'der' || k === 'die' || k === 'das' ? 'noun' : k === 'v' ? 'verb' : k === 'a' ? 'adj' : k === 'p' ? 'phrase' : 'other'

const counters: Record<number, number> = {}
const base = rows.map(([unit, kind, de, plural, ru, ky, example, exampleRu]) => {
  counters[unit] = (counters[unit] ?? 0) + 1
  const item: VocabularyItem = {
    id: `v${unit}-${counters[unit]}`,
    unit,
    pos: posOf(kind),
    article: posOf(kind) === 'noun' ? (kind as Article) : undefined,
    de,
    plural: plural || undefined,
    ru,
    ky,
    example,
    exampleRu,
    related: [],
  }
  return item
})

// Related words = thematic neighbours within the same unit (rows are authored in thematic groups).
export const VOCABULARY: VocabularyItem[] = base.map((v, i) => ({
  ...v,
  related: [base[i - 1], base[i + 1], base[i + 2]]
    .filter((n): n is VocabularyItem => !!n && n.unit === v.unit)
    .map(n => n.id),
}))

export const vocabById = new Map(VOCABULARY.map(v => [v.id, v]))
export const vocabForUnit = (unit: number) => VOCABULARY.filter(v => v.unit === unit)
export const displayWord = (v: VocabularyItem) => (v.article ? `${v.article} ${v.de}` : v.de)

/** Case forms for masculine / feminine / neuter nouns; used in the rich vocabulary card. */
export function caseForms(v: VocabularyItem) {
  if (!v.article) return null
  const a = v.article
  const akk = a === 'der' ? 'den' : a
  const dat = a === 'die' ? 'der' : 'dem'
  return { nom: `${a} ${v.de}`, akk: `${akk} ${v.de}`, dat: `${dat} ${v.de}` }
}
