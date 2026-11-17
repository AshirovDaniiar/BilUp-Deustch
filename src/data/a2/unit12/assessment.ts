import type { Exercise, L10n } from '../../types'
import type { A2TestDef, A2TestQuestion, L10nStrict } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 12 revision (Wiederholung) exercises, `a2-ex-12-01` … `-08` (3 fill / 3 choice / 2 order; concept 1 × 5, concept 2 × 3).
 * Authored independently of the final test below: no prompt, sentence or answer is shared.
 */
export const UNIT_12_EXERCISES: Exercise[] = [
  {
    id: 'a2-ex-12-01',
    type: 'fill',
    unit: 12,
    concept: 'a2-personalpronomen-dativverben',
    prompt: 'Meine Schwester hat Geburtstag. Ich schenke ___ ein Buch.',
    promptRu: 'У моей сестры день рождения. Я дарю ей книгу.',
    promptKy: 'Эжемдин туулган күнү. Мен ага китеп белек кылам.',
    options: ['ihr', 'sie', 'ihre'],
    answer: 'ihr',
    why: w(
      'Schenken берёт Dativ: человеку, который получает подарок, нужна форма ihr (Dativ от sie). Книга — это Akkusativ.',
      'schenken Dativ талап кылат: белек алган адамга ihr (sie ат атоочунун Dativ формасы) керек. Китеп — Akkusativ.',
    ),
  },
  {
    id: 'a2-ex-12-02',
    type: 'choice',
    unit: 12,
    concept: 'a2-personalpronomen-dativverben',
    prompt: 'Dein Freund fragt: „Kannst du mir helfen?“ Was antwortest du?',
    promptRu: 'Твой друг спрашивает: «Ты можешь мне помочь?» Что ты отвечаешь?',
    promptKy: 'Досуң сурайт: «Мага жардам бере аласыңбы?» Сен эмне деп жооп бересиң?',
    options: ['Ja, ich helfe dir gern.', 'Ja, ich helfe dich gern.', 'Ja, ich helfe ich gern.'],
    answer: 'Ja, ich helfe dir gern.',
    why: w(
      'Helfen требует Dativ: dir. Форма dich (Akkusativ) и форма ich (подлежащее) здесь неверны.',
      'helfen Dativ талап кылат: dir. dich (Akkusativ) жана ich (ээ) формалары бул жерде туура эмес.',
    ),
  },
  {
    id: 'a2-ex-12-03',
    type: 'order',
    unit: 12,
    concept: 'a2-personalpronomen-dativverben',
    prompt: 'Bilde den Satz.',
    promptRu: 'Я навещу тебя в субботу.',
    promptKy: 'Ишемби күнү сага барам.',
    words: ['Samstag.', 'dich', 'besuche', 'am', 'Ich'],
    answer: 'Ich besuche dich am Samstag.',
    why: w(
      'Besuchen берёт Akkusativ: dich. Глагол стоит на втором месте.',
      'besuchen Akkusativ алат: dich. Этиш экинчи орунда турат.',
    ),
  },
  {
    id: 'a2-ex-12-04',
    type: 'fill',
    unit: 12,
    concept: 'a2-personalpronomen-dativverben',
    prompt: 'Das Fahrrad gehört mein___ Bruder.',
    promptRu: 'Велосипед принадлежит моему брату.',
    promptKy: 'Велосипед менин агамдыкы.',
    options: ['em', 'en', 'er'],
    answer: 'em',
    why: w(
      'Gehören берёт Dativ. Мужской род в Dativ: der Bruder → dem Bruder, значит mein + em = meinem.',
      'gehören Dativ талап кылат. Dativ формасындагы эркек жынысы: der Bruder → dem Bruder, демек mein + em = meinem.',
    ),
  },
  {
    id: 'a2-ex-12-05',
    type: 'choice',
    unit: 12,
    concept: 'a2-personalpronomen-dativverben',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich helfe meiner Mutter oft.', 'Ich helfe meine Mutter oft.', 'Ich helfe meinen Mutter oft.'],
    answer: 'Ich helfe meiner Mutter oft.',
    why: w(
      'После helfen нужен Dativ. Женский род в Dativ: die Mutter → der Mutter, значит meiner Mutter.',
      'helfen этишинен кийин Dativ керек. Dativ формасындагы аял жынысы: die Mutter → der Mutter, демек meiner Mutter.',
    ),
  },
  {
    id: 'a2-ex-12-06',
    type: 'fill',
    unit: 12,
    concept: 'a2-reflexive-verben',
    prompt: 'Wir treffen ___ am Samstag.',
    promptRu: 'Мы встречаемся в субботу.',
    promptKy: 'Биз ишемби күнү жолугабыз.',
    options: ['uns', 'sich', 'euch'],
    answer: 'uns',
    why: w(
      'Sich treffen — возвратный глагол. Местоимение подходит к подлежащему: wir → uns.',
      'sich treffen — өздүк этиш. Ат атооч ээге туура келет: wir → uns.',
    ),
  },
  {
    id: 'a2-ex-12-07',
    type: 'order',
    unit: 12,
    concept: 'a2-reflexive-verben',
    prompt: 'Bilde den Satz.',
    promptRu: 'Мы познакомились на курсах немецкого.',
    promptKy: 'Биз немис тили курсунда таанышып калдык.',
    words: ['kennengelernt.', 'Deutschkurs', 'im', 'uns', 'Wir', 'haben'],
    answer: 'Wir haben uns im Deutschkurs kennengelernt.',
    why: w(
      'Вспомогательный глагол haben — на втором месте, uns — сразу после него, Partizip II (kennengelernt) — в самом конце.',
      'Жардамчы этиш haben — экинчи орунда, uns — андан дароо кийин, Partizip II (kennengelernt) — эң аягында.',
    ),
  },
  {
    id: 'a2-ex-12-08',
    type: 'choice',
    unit: 12,
    concept: 'a2-reflexive-verben',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Am Sonntag treffen wir uns.', 'Am Sonntag wir treffen uns.', 'Am Sonntag treffen uns wir.'],
    answer: 'Am Sonntag treffen wir uns.',
    why: w(
      'Если предложение начинается со слов «Am Sonntag», глагол остаётся вторым, а подлежащее и uns идут за ним: treffen wir uns.',
      'Сүйлөм «Am Sonntag» деген сөздөрдөн башталса, этиш экинчи орунда калат, ал эми ээ менен uns андан кийин келет: treffen wir uns.',
    ),
  },
]

/** Test definition `unit-12` (kind topic, 15 questions). */
export const UNIT_12_TEST: A2TestDef = {
  id: 'unit-12',
  title: s('Итоговый тест: юнит 12', 'Жыйынтыктоочу тест: 12-бөлүм'),
  kind: 'topic',
  level: 'A2',
  unit: 12,
  size: 15,
}

/**
 * Unit 12 final test, `a2-ft-12-01` … `-15`. Composition (decision of the Stage 7C brief, answering the Stage 7B audit): 8 grammar items set in
 * small everyday situations, 3 vocabulary, 4 reading items. Reading items carry the German text UNTRANSLATED in `prompt`; `promptRu` / `promptKy`
 * translate only the instruction and the question (never the text), so the item tests comprehension, not translation.
 * Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_12_FINAL: A2TestQuestion[] = [
  {
    id: 'a2-ft-12-01',
    prompt: 'Das ist Lena. Ich kenne ___ seit der Schule.',
    promptRu: 'Это Лена. Я знаю её со школы.',
    promptKy: 'Бул Лена. Мен аны мектептен бери билем.',
    options: ['ihr', 'ihre', 'sie'],
    answer: 'sie',
    skill: 'grammar',
    concept: 'a2-personalpronomen-dativverben',
    why: s(
      'Kennen берёт Akkusativ: кого? — sie (Akkusativ от sie). Ihr — это Dativ, а ihre — притяжательное слово.',
      'kennen Akkusativ алат: кимди? — sie (sie ат атоочунун Akkusativ формасы). Ihr — Dativ, ал эми ihre — таандык сөз.',
    ),
  },
  {
    id: 'a2-ft-12-02',
    prompt: 'Ich habe Hunger. Kannst du ___ ein Brot geben?',
    promptRu: 'Я голоден. Ты можешь дать мне хлеб?',
    promptKy: 'Мен ачмын. Мага нан бере аласыңбы?',
    options: ['mir', 'mich', 'ich'],
    answer: 'mir',
    skill: 'grammar',
    concept: 'a2-personalpronomen-dativverben',
    why: s(
      'Geben: человек (кому?) — Dativ, вещь (что?) — Akkusativ. Значит mir, а не mich.',
      'geben: адам (кимге?) — Dativ, нерсе (эмнени?) — Akkusativ. Демек mich эмес, mir.',
    ),
  },
  {
    id: 'a2-ft-12-03',
    prompt: '„Wem gehört die Jacke?“ – „Das ist meine Jacke. Sie gehört ___.“',
    promptRu: '«Кому принадлежит куртка?» — «Это моя куртка. Она принадлежит мне.»',
    promptKy: '«Куртка кимдики?» — «Бул менин курткам. Ал меники.»',
    options: ['ich', 'mir', 'mich'],
    answer: 'mir',
    skill: 'grammar',
    concept: 'a2-personalpronomen-dativverben',
    why: s(
      'Gehören требует Dativ: mir. Вопрос «Wem?» тоже подсказывает Dativ.',
      'gehören Dativ талап кылат: mir. «Wem?» деген суроо да Dativ экенин көрсөтөт.',
    ),
  },
  {
    id: 'a2-ft-12-04',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich besuche ihm am Sonntag.', 'Ich besuche ihn am Sonntag.', 'Ich besuche er am Sonntag.'],
    answer: 'Ich besuche ihn am Sonntag.',
    skill: 'grammar',
    concept: 'a2-personalpronomen-dativverben',
    why: s(
      'Besuchen берёт Akkusativ: ihn. Форма ihm — это Dativ, а er — подлежащее.',
      'besuchen Akkusativ алат: ihn. ihm — Dativ формасы, ал эми er — ээ.',
    ),
  },
  {
    id: 'a2-ft-12-05',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Sie zeigt ihren Freund das Foto.', 'Sie zeigt ihrem Freund dem Foto.', 'Sie zeigt ihrem Freund das Foto.'],
    answer: 'Sie zeigt ihrem Freund das Foto.',
    skill: 'grammar',
    concept: 'a2-personalpronomen-dativverben',
    why: s(
      'Zeigen: человек — Dativ (ihrem Freund), вещь — Akkusativ (das Foto), человек стоит раньше.',
      'zeigen: адам — Dativ (ihrem Freund), нерсе — Akkusativ (das Foto), адам мурун турат.',
    ),
  },
  {
    id: 'a2-ft-12-06',
    prompt: 'Wir sehen ___ morgen im Park.',
    promptRu: 'Мы увидимся завтра в парке.',
    promptKy: 'Биз эртең паркта көрүшөбүз.',
    options: ['uns', 'sich', 'euch'],
    answer: 'uns',
    skill: 'grammar',
    concept: 'a2-reflexive-verben',
    why: s(
      'Подлежащее wir требует местоимения uns: «мы видим друг друга». Sich подходит к er/sie, euch — к ihr.',
      'wir ээси uns ат атоочун талап кылат: «биз бири-бирибизди көрөбүз». Sich — er/sie үчүн, euch — ihr үчүн.',
    ),
  },
  {
    id: 'a2-ft-12-07',
    prompt: 'Meine Eltern ___ sich selten.',
    promptRu: 'Мои родители редко ссорятся.',
    promptKy: 'Менин ата-энем сейрек талашышат.',
    options: ['streite', 'streitet', 'streiten'],
    answer: 'streiten',
    skill: 'grammar',
    concept: 'a2-reflexive-verben',
    why: s(
      'Подлежащее «meine Eltern» — множественное число (sie), поэтому streiten (-en). Форма streite — для ich, streitet — для er/sie/es и ihr.',
      '«meine Eltern» ээси — көптүк сан (sie), ошондуктан streiten (-en). streite — ich үчүн, streitet — er/sie/es жана ihr үчүн.',
    ),
  },
  {
    id: 'a2-ft-12-08',
    prompt: 'Meine Eltern ___ sich 1990 in Bischkek kennengelernt.',
    promptRu: 'Мои родители познакомились в 1990 году в Бишкеке.',
    promptKy: 'Менин ата-энем 1990-жылы Бишкекте таанышкан.',
    options: ['haben', 'sind', 'werden'],
    answer: 'haben',
    skill: 'grammar',
    concept: 'a2-reflexive-verben',
    why: s(
      'У возвратных глаголов Perfekt образуется с haben: «haben sich … kennengelernt». Sein нужен глаголам движения и изменения состояния.',
      'Өздүк этиштерде Perfekt haben менен түзүлөт: «haben sich … kennengelernt». Sein кыймыл жана абал өзгөрүү этиштерине керек.',
    ),
  },
  {
    id: 'a2-ft-12-09',
    prompt: 'Tom sagt immer die Wahrheit. Er ist sehr ___.',
    promptRu: 'Том всегда говорит правду. Он очень …',
    promptKy: 'Том дайыма чындыкты айтат. Ал абдан …',
    options: ['eifersüchtig', 'ehrlich', 'traurig'],
    answer: 'ehrlich',
    skill: 'vocabulary',
    why: s(
      'Кто всегда говорит правду, тот ehrlich — честный. Eifersüchtig — ревнивый, traurig — грустный.',
      'Дайыма чындыкты айткан адам ehrlich — чынчыл. Eifersüchtig — кызганчаак, traurig — капа.',
    ),
  },
  {
    id: 'a2-ft-12-10',
    prompt: 'Wir müssen den Haushalt ___.',
    promptRu: 'Нам нужно поделить домашние дела.',
    promptKy: 'Биз үй-тиричиликти бөлүшүшүбүз керек.',
    options: ['heiraten', 'schenken', 'teilen'],
    answer: 'teilen',
    skill: 'vocabulary',
    why: s(
      'Устойчивое сочетание: den Haushalt teilen — «делить домашние дела». Heiraten и schenken сюда не подходят.',
      'Туруктуу сөз айкашы: den Haushalt teilen — «үй-тиричиликти бөлүшүү». heiraten жана schenken бул жерге туура келбейт.',
    ),
  },
  {
    id: 'a2-ft-12-11',
    prompt: 'Welches Wort passt nicht zum Thema „Familie“?',
    promptRu: 'Какое слово не подходит к теме «Семья»?',
    promptKy: '«Үй-бүлө» темасына кайсы сөз туура келбейт?',
    options: ['die Hausarbeit', 'die Großeltern', 'die Geschwister'],
    answer: 'die Hausarbeit',
    skill: 'vocabulary',
    why: s(
      'Die Großeltern и die Geschwister — члены семьи, а die Hausarbeit — это работа по дому.',
      'die Großeltern жана die Geschwister — үй-бүлө мүчөлөрү, ал эми die Hausarbeit — үй иши.',
    ),
  },
  {
    id: 'a2-ft-12-12',
    prompt:
      'Lies die Nachricht: „Hi Lara, am Samstag habe ich Zeit! Ich komme gern. Mein Cousin Max kommt auch. Ihr versteht euch bestimmt gut. Bis Samstag! Tim“ Wer kommt am Samstag zu Lara?',
    promptRu: 'Прочитайте сообщение. Кто придёт к Ларе в субботу?',
    promptKy: 'Билдирүүнү окуңуз. Ишемби күнү Ларага ким келет?',
    options: ['Nur Tim', 'Tim und sein Cousin', 'Tim und seine Eltern'],
    answer: 'Tim und sein Cousin',
    skill: 'reading',
    concept: 'a2-reflexive-verben',
    why: s(
      'В сообщении сказано: «Ich komme gern. Mein Cousin Max kommt auch». Значит приходят Tim и его двоюродный брат.',
      'Билдирүүдө айтылган: «Ich komme gern. Mein Cousin Max kommt auch». Демек Tim жана анын тууганы келет.',
    ),
  },
  {
    id: 'a2-ft-12-13',
    prompt:
      'Lies die Nachricht: „Hallo Selma, ich ziehe am Sonntag um und brauche Hilfe. Kannst du mir helfen? Ich koche dann für dich. Danke! Jonas“ Selma möchte helfen. Welche Antwort passt?',
    promptRu: 'Прочитайте сообщение. Сельма хочет помочь. Какой ответ подходит?',
    promptKy: 'Билдирүүнү окуңуз. Сельма жардам бергиси келет. Кайсы жооп ылайыктуу?',
    options: ['Danke, ich bin schon umgezogen.', 'Gern, ich ziehe am Sonntag um.', 'Klar, ich helfe dir gern. Wann?'],
    answer: 'Klar, ich helfe dir gern. Wann?',
    skill: 'reading',
    concept: 'a2-personalpronomen-dativverben',
    why: s(
      'Jonas просит о помощи. Подходит ответ, в котором Selma соглашается помочь и спрашивает время: «Klar, ich helfe dir gern. Wann?».',
      'Jonas жардам сурап жатат. Selma жардам берүүгө макул болуп, убакытты сураган жооп ылайыктуу: «Klar, ich helfe dir gern. Wann?».',
    ),
  },
  {
    id: 'a2-ft-12-14',
    prompt:
      'Lies den Text: „Ich verstehe mich gut mit meinem Kollegen Ali. Er ist immer hilfsbereit und ehrlich. Wir treffen uns oft nach der Arbeit und spielen Fußball.“ Was sagt der Text über Ali?',
    promptRu: 'Прочитайте текст. Что в тексте сказано об Али?',
    promptKy: 'Текстти окуңуз. Текст Али жөнүндө эмне дейт?',
    options: ['Er ist hilfsbereit und ehrlich.', 'Er ist traurig und eifersüchtig.', 'Er arbeitet nicht mehr hier.'],
    answer: 'Er ist hilfsbereit und ehrlich.',
    skill: 'reading',
    concept: 'a2-reflexive-verben',
    why: s(
      'В тексте сказано: «Er ist immer hilfsbereit und ehrlich». Остальные варианты в тексте не названы.',
      'Текстте айтылган: «Er ist immer hilfsbereit und ehrlich». Калган варианттар текстте айтылган эмес.',
    ),
  },
  {
    id: 'a2-ft-12-15',
    prompt:
      'Lies die Notiz: „Notiz an Tom: Ich habe heute keine Zeit für den Haushalt. Kannst du abwaschen? Dafür koche ich morgen für uns beide. Danke dir! Lea“ Was macht Lea morgen?',
    promptRu: 'Прочитайте записку. Что делает Леа завтра?',
    promptKy: 'Эскертмени окуңуз. Леа эртең эмне кылат?',
    options: ['Sie wäscht ab.', 'Sie kocht.', 'Sie ruft Tom an.'],
    answer: 'Sie kocht.',
    skill: 'reading',
    why: s(
      'Lea просит Tom помыть посуду, а сама готовит завтра: «Dafür koche ich morgen». Abwaschen — это просьба к Tom.',
      'Lea Tom дегенге идиш жууну суранат, ал эми өзү эртең тамак бышырат: «Dafür koche ich morgen». Abwaschen — Tom үчүн өтүнүч.',
    ),
  },
]
