import type { Exercise, L10n } from '../../types'
import type { A2TestQuestion, L10nStrict } from '../../a2/types'
import type { B1TestDef } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 26 revision (Wiederholung) exercises, `b1-ex-26-01` … `-10`: 4 fill / 4 choice / 2 order on the unit's three concepts (Passiv with modal / Präteritum × 3,
 * lassen × 2, Wiedergeben × 3), plus 2 RECYCLED items (↻ Relativsatz of Unit 23, ↻ Passiv Präsens of Unit 24) without a concept of this unit — the spaced-revision
 * part. Exercise 08 is a TEXT-level `choice` item (three sentences). Authored independently of the final test: no prompt, sentence or answer is shared.
 * The items use only the closed lists (Passiv Präteritum: veröffentlichen, gründen, bauen, erfinden, eröffnen, absagen; lassen: the 6 expressions); the receptive
 * constructions (`sich lassen`, Partizip I as adjective, Passiv Perfekt `… worden`, ohne/statt … zu, einerseits) never appear in a gap or a word order.
 */
export const UNIT_26_EXERCISES: Exercise[] = [
  {
    id: 'b1-ex-26-01',
    type: 'fill',
    unit: 26,
    concept: 'b1-passiv-praeteritum-modal',
    prompt: 'Das Handy muss repariert ___.',
    promptRu: 'Телефон нужно починить.',
    promptKy: 'Телефонду оңдоо керек.',
    options: ['werden', 'wird', 'sein'],
    answer: 'werden',
    why: w(
      'После модального глагола (muss) в конце стоит инфинитив werden: «muss repariert werden». Wird — спрягаемая форма, она здесь не нужна.',
      'Модаль этиштен (muss) кийин аягында werden инфинитиви турат: «muss repariert werden». wird — жакка жараша өзгөргөн форма, бул жерде керек эмес.',
    ),
  },
  {
    id: 'b1-ex-26-02',
    type: 'choice',
    unit: 26,
    concept: 'b1-passiv-praeteritum-modal',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Der Artikel wurde gestern veröffentlicht.',
      'Der Artikel wird gestern veröffentlicht.',
      'Der Artikel wurde gestern veröffentlichen.',
    ],
    answer: 'Der Artikel wurde gestern veröffentlicht.',
    why: w(
      'Для события в прошлом (gestern) нужен Passiv Präteritum: wurde + Partizip II (veröffentlicht). Wird — Präsens, инфинитив вместо Partizip II неверен.',
      'Өткөн окуя (gestern) үчүн Passiv Präteritum керек: wurde + Partizip II (veröffentlicht). wird — Präsens, Partizip II ордуна инфинитив туура эмес.',
    ),
  },
  {
    id: 'b1-ex-26-03',
    type: 'order',
    unit: 26,
    concept: 'b1-passiv-praeteritum-modal',
    prompt: 'Bilde den Satz.',
    promptRu: 'Пароль нужно изменить.',
    promptKy: 'Сыр сөздү өзгөртүү керек.',
    words: ['werden.', 'Das', 'muss', 'geändert', 'Passwort'],
    answer: 'Das Passwort muss geändert werden.',
    why: w(
      'Muss стоит на втором месте, а Partizip II (geändert) и werden — в самом конце, werden последним.',
      'muss экинчи орунда турат, ал эми Partizip II (geändert) жана werden — эң аягында, werden акыркы.',
    ),
  },
  {
    id: 'b1-ex-26-04',
    type: 'fill',
    unit: 26,
    concept: 'b1-lassen',
    prompt: 'Ich ___ mein Handy reparieren.',
    promptRu: 'Я отдаю телефон в ремонт.',
    promptKy: 'Мен телефонумду оңдотуп жатам.',
    options: ['lasse', 'lässt', 'lassen'],
    answer: 'lasse',
    why: w(
      'К ich подходит lasse. Lässt — форма для du и er/sie/es, lassen — для wir и sie. Инфинитив reparieren — в конце, без zu.',
      'ich үчүн lasse туура келет. lässt — du жана er/sie/es формасы, lassen — wir жана sie үчүн. reparieren инфинитиви — аягында, zu жок.',
    ),
  },
  {
    id: 'b1-ex-26-05',
    type: 'choice',
    unit: 26,
    concept: 'b1-lassen',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Sie lässt ihr Fahrrad reparieren.', 'Sie lässt ihr Fahrrad zu reparieren.', 'Sie lässt ihr Fahrrad repariert.'],
    answer: 'Sie lässt ihr Fahrrad reparieren.',
    why: w(
      'После lassen стоит голый инфинитив: без zu и не Partizip II. Лицо sie — lässt.',
      'lassen этишинен кийин жылаңач инфинитив турат: zu жок жана Partizip II эмес. sie жагы — lässt.',
    ),
  },
  {
    id: 'b1-ex-26-06',
    type: 'fill',
    unit: 26,
    concept: 'b1-wiedergeben-indikativ',
    prompt: 'Tom sagt: „Ich lese die Zeitung.“ – Tom sagt, dass ___ die Zeitung liest.',
    promptRu: 'Том говорит: «Я читаю газету». — Том говорит, что он читает газету.',
    promptKy: 'Том: «Мен гезитти окуп жатам» дейт. — Том гезитти окуп жатканын айтат.',
    options: ['er', 'ich', 'sie'],
    answer: 'er',
    why: w(
      'В пересказе «ich» Тома становится «er», а глагол стоит в конце: …, dass er die Zeitung liest. Sie не подходит к Тому.',
      'Айтып бергенде Томдун «ich» сөзү «er» болот, этиш аягында турат: …, dass er die Zeitung liest. sie Том үчүн туура келбейт.',
    ),
  },
  {
    id: 'b1-ex-26-07',
    type: 'order',
    unit: 26,
    concept: 'b1-wiedergeben-indikativ',
    prompt: 'Bilde den Satz.',
    promptRu: 'Она спросила, прочитал ли я сообщение.',
    promptKy: 'Ал мен кабарды окудумбу деп сурады.',
    words: ['fragte,', 'habe.', 'Sie', 'ob', 'ich', 'die', 'Meldung', 'gelesen'],
    answer: 'Sie fragte, ob ich die Meldung gelesen habe.',
    why: w(
      'Вопрос без вопросительного слова передаётся с ob, а глагол (habe) стоит в самом конце: …, ob ich … gelesen habe.',
      'Суроо сөзү жок суроо ob менен айтылат, ал эми этиш (habe) эң аягында турат: …, ob ich … gelesen habe.',
    ),
  },
  {
    id: 'b1-ex-26-08',
    type: 'choice',
    unit: 26,
    concept: 'b1-wiedergeben-indikativ',
    prompt: 'Welcher kleine Text ist richtig?',
    promptRu: 'Какой короткий текст составлен правильно?',
    promptKy: 'Кайсы кыска текст туура түзүлгөн?',
    options: [
      'Laut dem Bericht kommen mehr Besucher. Es heißt, dass die Bibliothek ist länger geöffnet. Jan sagt, dass er die Meldung gelesen hat.',
      'Laut dem Bericht kommen mehr Besucher. Es heißt, dass die Bibliothek länger geöffnet ist. Jan sagt, dass er die Meldung gelesen hat.',
      'Laut dem Bericht kommen mehr Besucher. Es heißt, dass die Bibliothek länger geöffnet ist. Jan sagt, dass ich die Meldung gelesen hat.',
    ],
    answer: 'Laut dem Bericht kommen mehr Besucher. Es heißt, dass die Bibliothek länger geöffnet ist. Jan sagt, dass er die Meldung gelesen hat.',
    why: w(
      'В первом тексте во втором предложении глагол после dass не в конце. В третьем тексте Ян говорит о себе, значит «er hat», а не «ich … hat». Во втором тексте всё верно.',
      'Биринчи текстте экинчи сүйлөмдө dass сөзүнөн кийин этиш аягында эмес. Үчүнчү текстте Ян өзү жөнүндө айтат, демек «er hat», «ich … hat» эмес. Экинчи текстте баары туура.',
    ),
  },
  // ↻ Wiederholung (recycled, spaced revision; no concept of this unit)
  {
    id: 'b1-ex-26-09',
    type: 'fill',
    unit: 26,
    prompt: 'Das ist der Film, ___ ich gestern gesehen habe.',
    promptRu: 'Это фильм, который я вчера посмотрел.',
    promptKy: 'Бул мен кечээ көргөн тасма.',
    options: ['den', 'der', 'das'],
    answer: 'den',
    why: w(
      '↻ Юнит 23: «der Film» — мужской род, а в придаточной части это дополнение (ich habe den Film gesehen): Akkusativ — den.',
      '↻ 23-бөлүм: «der Film» — эркек род, ал эми кошумча бөлүктө бул толуктоочу (ich habe den Film gesehen): Akkusativ — den.',
    ),
  },
  {
    id: 'b1-ex-26-10',
    type: 'choice',
    unit: 26,
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Die App wird morgen aktualisiert.',
      'Die App wird morgen aktualisieren.',
      'Die App werden morgen aktualisiert.',
    ],
    answer: 'Die App wird morgen aktualisiert.',
    why: w(
      '↻ Юнит 24: Passiv Präsens = wird + Partizip II в конце. «Die App» — единственное число (wird), инфинитив вместо Partizip II неверен.',
      '↻ 24-бөлүм: Passiv Präsens = wird + аягында Partizip II. «Die App» — жекелик сан (wird), Partizip II ордуна инфинитив туура эмес.',
    ),
  },
]

/** Test definition `unit-26` (kind topic, 15 questions). */
export const UNIT_26_TEST: B1TestDef = {
  id: 'unit-26',
  title: s('Итоговый тест: юнит 26', 'Жыйынтыктоочу тест: 26-бөлүм'),
  kind: 'topic',
  level: 'B1',
  unit: 26,
  size: 15,
}

/**
 * Unit 26 final test, `b1-ft-26-01` … `-15`. Composition (curriculum v2 §7.2): 8 grammar (2 on Passiv with modal / Präteritum, 2 on lassen, 2 on Wiedergeben,
 * 2 recycled ↻: Passiv Präsens of Unit 24, Relativsatz of Unit 23), 3 vocabulary, 4 reading, 0 listening — listening items enter a test only after the
 * text-to-speech playback has been verified on real devices. Reading items carry the German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy` translate
 * only the instruction and the question. All texts are fictional. Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_26_FINAL: A2TestQuestion[] = [
  {
    id: 'b1-ft-26-01',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: [
      'Das Konto kann jederzeit geschlossen werden.',
      'Das Konto kann jederzeit schließen werden.',
      'Das Konto kann jederzeit geschlossen wird.',
    ],
    answer: 'Das Konto kann jederzeit geschlossen werden.',
    skill: 'grammar',
    concept: 'b1-passiv-praeteritum-modal',
    why: s(
      'Passiv с модальным глаголом: kann + Partizip II (geschlossen) + werden в самом конце. Инфинитив вместо Partizip II и wird вместо werden — ошибки.',
      'Модаль этиш менен Passiv: kann + Partizip II (geschlossen) + эң аягында werden. Partizip II ордуна инфинитив жана werden ордуна wird — каталар.',
    ),
  },
  {
    id: 'b1-ft-26-02',
    prompt: 'Die Zeitung ___ vor hundert Jahren gegründet.',
    promptRu: 'Газета была основана сто лет назад.',
    promptKy: 'Гезит жүз жыл мурун негизделген.',
    options: ['wird', 'wurde', 'wurden'],
    answer: 'wurde',
    skill: 'grammar',
    concept: 'b1-passiv-praeteritum-modal',
    why: s(
      'Событие в прошлом (vor hundert Jahren) — Passiv Präteritum; «die Zeitung» — единственное число: wurde. Wird — Präsens, wurden — множественное число.',
      'Өткөн окуя (vor hundert Jahren) — Passiv Präteritum; «die Zeitung» — жекелик сан: wurde. wird — Präsens, wurden — көптүк сан.',
    ),
  },
  {
    id: 'b1-ft-26-03',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich lasse mein Passwort ändere.', 'Ich lasse mein Passwort zu ändern.', 'Ich lasse mein Passwort ändern.'],
    answer: 'Ich lasse mein Passwort ändern.',
    skill: 'grammar',
    concept: 'b1-lassen',
    why: s(
      'Lassen + голый инфинитив в конце: «ändern». Спрягаемая форма «ändere» и инфинитив с zu неверны.',
      'lassen + аягында жылаңач инфинитив: «ändern». Жакка жараша өзгөргөн «ändere» формасы жана zu менен инфинитив туура эмес.',
    ),
  },
  {
    id: 'b1-ft-26-04',
    prompt: 'Er ___ sich die Haare schneiden.',
    promptRu: 'Он стрижётся (ему стригут волосы).',
    promptKy: 'Ал чачын кыркытып жатат.',
    options: ['lassen', 'lässt', 'lasse'],
    answer: 'lässt',
    skill: 'grammar',
    concept: 'b1-lassen',
    why: s(
      'К er подходит lässt (гласная меняется). Lassen — для wir/sie, lasse — для ich.',
      'er үчүн lässt туура келет (үндүү өзгөрөт). lassen — wir/sie үчүн, lasse — ich үчүн.',
    ),
  },
  {
    id: 'b1-ft-26-05',
    prompt: 'Lara sagt: „Ich habe die Nachricht gelesen.“ Welcher Satz gibt das richtig wieder?',
    promptRu: 'Лара говорит: «Я прочитала сообщение». Какое предложение передаёт это правильно?',
    promptKy: 'Лара: «Мен билдирүүнү окудум» дейт. Кайсы сүйлөм муну туура айтып берет?',
    options: [
      'Lara sagt, dass sie die Nachricht gelesen hat.',
      'Lara sagt, dass ich die Nachricht gelesen hat.',
      'Lara sagt, dass sie hat die Nachricht gelesen.',
    ],
    answer: 'Lara sagt, dass sie die Nachricht gelesen hat.',
    skill: 'grammar',
    concept: 'b1-wiedergeben-indikativ',
    why: s(
      'Ich Лары становится sie, время (Perfekt) остаётся, а глагол hat стоит в самом конце после dass.',
      'Ларанын ich сөзү sie болот, чак (Perfekt) өзгөрбөйт, ал эми hat этиши dass сөзүнөн кийин эң аягында турат.',
    ),
  },
  {
    id: 'b1-ft-26-06',
    prompt: 'Sie fragte, ___ ich Zeit habe.',
    promptRu: 'Она спросила, есть ли у меня время.',
    promptKy: 'Ал менин убактым барбы деп сурады.',
    options: ['dass', 'wer', 'ob'],
    answer: 'ob',
    skill: 'grammar',
    concept: 'b1-wiedergeben-indikativ',
    why: s(
      'Вопрос «Hast du Zeit?» (ответ «да/нет») передаётся с ob. Dass — для утверждений, wer — вопросительное слово («кто»).',
      '«Hast du Zeit?» суроосу («ооба/жок») ob менен айтылат. dass — ырастоолор үчүн, wer — суроо сөзү («ким»).',
    ),
  },
  {
    id: 'b1-ft-26-07',
    prompt: 'Die Meldung ___ morgen veröffentlicht.',
    promptRu: 'Сообщение будет опубликовано завтра.',
    promptKy: 'Кабар эртең жарыяланат.',
    options: ['wird', 'werden', 'wirst'],
    answer: 'wird',
    skill: 'grammar',
    concept: 'b1-passiv-praesens',
    why: s(
      '↻ Юнит 24: Passiv Präsens — wird/werden + Partizip II. «Die Meldung» — единственное число: wird.',
      '↻ 24-бөлүм: Passiv Präsens — wird/werden + Partizip II. «Die Meldung» — жекелик сан: wird.',
    ),
  },
  {
    id: 'b1-ft-26-08',
    prompt: 'Das ist die Journalistin, ___ den Bericht geschrieben hat.',
    promptRu: 'Это журналистка, которая написала репортаж.',
    promptKy: 'Бул репортажды жазган журналист аял.',
    options: ['den', 'die', 'das'],
    answer: 'die',
    skill: 'grammar',
    concept: 'b1-relativsaetze-nom-akk',
    why: s(
      '↻ Юнит 23: «die Journalistin» — женский род и подлежащее придаточной части («sie hat geschrieben»): Nominativ — die.',
      '↻ 23-бөлүм: «die Journalistin» — аял род жана кошумча бөлүктүн ээси («sie hat geschrieben»): Nominativ — die.',
    ),
  },
  {
    id: 'b1-ft-26-09',
    prompt: 'Eine Information, der man vertrauen kann, ist ___.',
    promptRu: 'Информация, которой можно доверять, — это ___.',
    promptKy: 'Ишенүүгө боло турган маалымат — бул ___.',
    options: ['unseriös', 'kostenlos', 'glaubwürdig'],
    answer: 'glaubwürdig',
    skill: 'vocabulary',
    why: s(
      'Информация, которой можно доверять, — glaubwürdig. Unseriös — сомнительный, kostenlos — бесплатный.',
      'Ишенүүгө боло турган маалымат — glaubwürdig. unseriös — шектүү, kostenlos — акысыз.',
    ),
  },
  {
    id: 'b1-ft-26-10',
    prompt: 'Wer die Zeitung am Bildschirm und nicht auf Papier liest, liest sie ___.',
    promptRu: 'Кто читает газету с экрана, а не на бумаге, читает её ___.',
    promptKy: 'Гезитти кагазда эмес, экрандан окуган адам аны ___ окуйт.',
    options: ['digital', 'aktuell', 'vertraulich'],
    answer: 'digital',
    skill: 'vocabulary',
    why: s(
      'Чтение с экрана — digital (в цифровом виде). Aktuell — свежий, vertraulich — конфиденциальный.',
      'Экрандан окуу — digital (санарип түрдө). aktuell — жаңы, vertraulich — купуя.',
    ),
  },
  {
    id: 'b1-ft-26-11',
    prompt: 'Eine Person, die für eine Zeitung arbeitet und Berichte schreibt, ist ein ___.',
    promptRu: 'Человек, который работает в газете и пишет репортажи, — это ___.',
    promptKy: 'Гезитте иштеп, репортаждарды жазган адам — бул ___.',
    options: ['Nutzer', 'Journalist', 'Schauspieler'],
    answer: 'Journalist',
    skill: 'vocabulary',
    why: s(
      'Тот, кто пишет репортажи для газеты, — Journalist. Nutzer — пользователь, Schauspieler — актёр.',
      'Гезит үчүн репортаждарды жазган адам — Journalist. Nutzer — колдонуучу, Schauspieler — артист.',
    ),
  },
  {
    id: 'b1-ft-26-12',
    prompt:
      'Lies die Nachricht (erfunden): „Der Kundendienst schreibt: Ihr Laptop ist fertig. Der neue Akku muss noch geladen werden. Sie können den Laptop ab Montag abholen.“ Was kann die Kundin am Montag tun?',
    promptRu: 'Прочитайте сообщение (вымышленное). Что может сделать клиентка в понедельник?',
    promptKy: 'Билдирүүнү окуңуз (ойдон чыгарылган). Кардар аял дүйшөмбүдө эмне кыла алат?',
    options: ['Den Laptop bezahlen.', 'Den Akku kaufen.', 'Den Laptop abholen.'],
    answer: 'Den Laptop abholen.',
    skill: 'reading',
    why: s(
      'В сообщении: «Sie können den Laptop ab Montag abholen». Об оплате и покупке аккумулятора ничего не сказано.',
      'Билдирүүдө: «Sie können den Laptop ab Montag abholen». Төлөө жана батарея сатып алуу жөнүндө эч нерсе айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-26-13',
    prompt:
      'Lies den kurzen Text (erfunden): „Laut dem Wetterbericht regnet es morgen den ganzen Tag. Es heißt, dass der Zug deshalb später kommt. Julia sagt, dass sie zu Hause bleibt.“ Was sagt Julia?',
    promptRu: 'Прочитайте короткий текст (вымышленный). Что говорит Юлия?',
    promptKy: 'Кыска текстти окуңуз (ойдон чыгарылган). Юлия эмне дейт?',
    options: ['Sie nimmt den Zug.', 'Sie bleibt zu Hause.', 'Sie geht in die Redaktion.'],
    answer: 'Sie bleibt zu Hause.',
    skill: 'reading',
    why: s(
      'В тексте: «Julia sagt, dass sie zu Hause bleibt». О поездке на поезде и о редакции ничего не сказано.',
      'Текстте: «Julia sagt, dass sie zu Hause bleibt». Поезд менен жолго чыгуу жана редакция жөнүндө эч нерсе айтылган эмес.',
    ),
  },
  {
    id: 'b1-ft-26-14',
    prompt:
      'Lies den Text: „Der Film dauert zwei Stunden. Ich finde ihn zu lang. Mein Freund sagt, dass er spannend ist.“ Welcher Satz ist eine Tatsache, die man prüfen kann?',
    promptRu: 'Прочитайте текст. Какое предложение — это факт, который можно проверить?',
    promptKy: 'Текстти окуңуз. Кайсы сүйлөм текшерүүгө боло турган факт?',
    options: ['Der Film dauert zwei Stunden.', 'Der Film ist zu lang.', 'Der Film ist spannend.'],
    answer: 'Der Film dauert zwei Stunden.',
    skill: 'reading',
    why: s(
      'Продолжительность (два часа) можно проверить — это факт. «Zu lang» и «spannend» — мнения.',
      'Узактыгын (эки саат) текшерүүгө болот — бул факт. «Zu lang» жана «spannend» — пикирлер.',
    ),
  },
  {
    id: 'b1-ft-26-15',
    prompt:
      'Lies den Text (erfunden): „Ein Nutzer schreibt, dass die App ein Problem hat. Der Kundendienst antwortet, dass das Update kostenlos verfügbar ist.“ Was sagt der Kundendienst?',
    promptRu: 'Прочитайте текст (вымышленный). Что говорит служба поддержки?',
    promptKy: 'Текстти окуңуз (ойдон чыгарылган). Тейлөө кызматы эмне дейт?',
    options: ['Die App ist nicht mehr verfügbar.', 'Das Update kostet zehn Euro.', 'Das Update ist kostenlos verfügbar.'],
    answer: 'Das Update ist kostenlos verfügbar.',
    skill: 'reading',
    why: s(
      'В тексте: «Der Kundendienst antwortet, dass das Update kostenlos verfügbar ist». Про платное обновление и недоступное приложение не сказано.',
      'Текстте: «Der Kundendienst antwortet, dass das Update kostenlos verfügbar ist». Акы төлөнүүчү жаңыртуу жана жеткиликсиз тиркеме жөнүндө айтылган эмес.',
    ),
  },
]
