import type { Exercise, L10n } from '../../types'
import type { A2TestDef, A2TestQuestion, L10nStrict } from '../types'

const w = (ru: string, ky: string): L10n => ({ ru, ky })
const s = (ru: string, ky: string): L10nStrict => ({ ru, ky })

/**
 * Unit 20 revision (Wiederholung) exercises, `a2-ex-20-01` … `-08` (3 fill / 3 choice / 2 order; concepts 3 / 3 / 2 — the Stage 7B plan E1–E8).
 * Authored independently of the final test below: no prompt, sentence or answer is shared. Positions of the correct option: fill 1 / 0 / 2, choice 2 / 0 / 1.
 */
export const UNIT_20_EXERCISES: Exercise[] = [
  {
    id: 'a2-ex-20-01',
    type: 'fill',
    unit: 20,
    concept: 'a2-vorschlaege-verabredungen',
    prompt: 'Wollen wir heute Abend ins Kino ___?',
    promptRu: 'Пойдём сегодня вечером в кино?',
    promptKy: 'Бүгүн кечинде киного барабызбы?',
    options: ['gehe', 'gehen', 'gehst'],
    answer: 'gehen',
    why: w(
      'После Wollen wir инфинитив стоит в конце вопроса: Wollen wir … gehen? Формы gehe и gehst — это спряжение, здесь нужен инфинитив.',
      'Wollen wir сөзүнөн кийин инфинитив суроонун аягында турат: Wollen wir … gehen? gehe жана gehst — өзгөргөн формалар, бул жерде инфинитив керек.',
    ),
  },
  {
    id: 'a2-ex-20-02',
    type: 'choice',
    unit: 20,
    concept: 'a2-vorschlaege-verabredungen',
    prompt: 'Dein Freund fragt: „Wollen wir morgen schwimmen gehen?“ Du hast Zeit und Lust. Welche Antwort passt?',
    promptRu: 'Друг спрашивает: «Пойдём завтра плавать?» У тебя есть время и желание. Какой ответ подходит?',
    promptKy: 'Досуң сурайт: «Эртең сүзүүгө барабызбы?» Сенде убакыт да, каалоо да бар. Кайсы жооп ылайыктуу?',
    options: ['Das ist mir egal.', 'Leider kann ich nicht.', 'Ja, gern. Gute Idee!'],
    answer: 'Ja, gern. Gute Idee!',
    why: w(
      'Согласие звучит так: «Ja, gern», «Gute Idee», «Einverstanden». «Leider kann ich nicht» — отказ, а «Das ist mir egal» звучит безразлично.',
      'Макул болуу мындай угулат: «Ja, gern», «Gute Idee», «Einverstanden». «Leider kann ich nicht» — баш тартуу, ал эми «Das ist mir egal» кайдыгер угулат.',
    ),
  },
  {
    id: 'a2-ex-20-03',
    type: 'order',
    unit: 20,
    concept: 'a2-vorschlaege-verabredungen',
    prompt: 'Bilde den Satz.',
    promptRu: 'Как насчёт кофе?',
    promptKy: 'Кофе ичсекчи?',
    words: ['Kaffee?', 'es', 'Wie', 'einem', 'mit', 'wäre'],
    answer: 'Wie wäre es mit einem Kaffee?',
    why: w(
      'Это готовое выражение: Wie wäre es mit + Dativ. После mit — einem Kaffee (Dativ).',
      'Бул даяр сөз айкашы: Wie wäre es mit + Dativ. mit сөзүнөн кийин — einem Kaffee (Dativ).',
    ),
  },
  {
    id: 'a2-ex-20-04',
    type: 'fill',
    unit: 20,
    concept: 'a2-absichten-plaene',
    prompt: 'Was ___ du am Samstag vor?',
    promptRu: 'Какие у тебя планы на субботу?',
    promptKy: 'Ишемби күнүнө сенин пландарың кандай?',
    options: ['hast', 'habe', 'hat'],
    answer: 'hast',
    why: w(
      'К du подходит hast: du hast … vor. Приставка vor стоит в конце предложения.',
      'du менен hast туура келет: du hast … vor. vor приставкасы сүйлөмдүн аягында турат.',
    ),
  },
  {
    id: 'a2-ex-20-05',
    type: 'choice',
    unit: 20,
    concept: 'a2-absichten-plaene',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich habe am Sonntag nichts vor.', 'Ich vorhabe am Sonntag nichts.', 'Ich habe vor am Sonntag nichts.'],
    answer: 'Ich habe am Sonntag nichts vor.',
    why: w(
      'Vorhaben — отделяемый глагол: habe на втором месте, vor — в самом конце предложения.',
      'Vorhaben — приставкасы бөлүнүп калган этиш: habe экинчи орунда, vor — сүйлөмдүн эң аягында.',
    ),
  },
  {
    id: 'a2-ex-20-06',
    type: 'order',
    unit: 20,
    concept: 'a2-absichten-plaene',
    prompt: 'Bilde den Satz.',
    promptRu: 'Послезавтра я планирую вечеринку.',
    promptKy: 'Бүрсүгүнү мен кече пландайм.',
    words: ['plane', 'Party.', 'Übermorgen', 'eine', 'ich'],
    answer: 'Übermorgen plane ich eine Party.',
    why: w(
      'Слово о времени (Übermorgen) стоит первым, поэтому глагол plane — вторым, а ich — после него.',
      'Убакыт сөзү (Übermorgen) биринчи турат, ошондуктан plane этиши экинчи, ал эми ich андан кийин.',
    ),
  },
  {
    id: 'a2-ex-20-07',
    type: 'fill',
    unit: 20,
    concept: 'a2-satzverbindungen-integration',
    prompt: 'Ich bleibe zu Hause, ___ ich krank bin.',
    promptRu: 'Я остаюсь дома, потому что болен.',
    promptKy: 'Мен ооруп калгандыктан үйдө калам.',
    options: ['denn', 'deshalb', 'weil'],
    answer: 'weil',
    why: w(
      'Глагол bin стоит в конце — значит, нужен weil. После denn глагол стоял бы вторым, после deshalb — сразу за ним.',
      'bin этиши аягында турат — демек, weil керек. denn сөзүнөн кийин этиш экинчи болмок, deshalb сөзүнөн кийин — андан дароо кийин.',
    ),
  },
  {
    id: 'a2-ex-20-08',
    type: 'choice',
    unit: 20,
    concept: 'a2-satzverbindungen-integration',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Ich bin müde, deshalb ich gehe nach Hause.', 'Ich bin müde, deshalb gehe ich nach Hause.', 'Ich bin müde, deshalb gehe nach Hause ich.'],
    answer: 'Ich bin müde, deshalb gehe ich nach Hause.',
    why: w(
      'После deshalb сразу идёт глагол (gehe), а подлежащее ich — после него.',
      'deshalb сөзүнөн кийин дароо этиш (gehe) келет, ал эми ээ ich андан кийин.',
    ),
  },
]

/** Test definition `unit-20` (kind topic, 15 questions). */
export const UNIT_20_TEST: A2TestDef = {
  id: 'unit-20',
  title: s('Итоговый тест: юнит 20', 'Жыйынтыктоочу тест: 20-бөлүм'),
  kind: 'topic',
  level: 'A2',
  unit: 20,
  size: 15,
}

/**
 * Unit 20 final test, `a2-ft-20-01` … `-15`. Composition: 7 grammar items (G1 2, G2 2, G3 2, one recycled date item), 3 vocabulary items, 5 items that read
 * a short German text (an invitation, a reply, a situation, a notice, a short exchange). Reading items carry the German text UNTRANSLATED in `prompt`;
 * `promptRu` / `promptKy` translate only the instruction and the question. Authored positions of the correct answer: 5 / 5 / 5, never three in a row.
 */
export const UNIT_20_FINAL: A2TestQuestion[] = [
  {
    id: 'a2-ft-20-01',
    prompt: 'Wir haben beide nichts vor. ___ wir zusammen kochen?',
    promptRu: 'У нас обоих нет планов. Приготовим вместе?',
    promptKy: 'Экөөбүздө тең план жок. Чогуу тамак бышыралыбы?',
    options: ['Wollen', 'Wollt', 'Will'],
    answer: 'Wollen',
    skill: 'grammar',
    concept: 'a2-vorschlaege-verabredungen',
    why: s(
      'Предложение «мы вдвоём» начинается с Wollen wir …? К wir подходит форма wollen, а wollt — к ihr и will — к ich / er.',
      '«Экөөбүз» деген сунуш Wollen wir …? менен башталат. wir менен wollen формасы туура келет, wollt — ihr менен, will — ich / er менен.',
    ),
  },
  {
    id: 'a2-ft-20-02',
    prompt: 'Ein Kollege lädt dich zum Essen ein, aber du hast keine Zeit. Welche Antwort ist höflich?',
    promptRu: 'Коллега приглашает тебя на обед, но у тебя нет времени. Какой ответ вежливый?',
    promptKy: 'Кесиптеш сени тамакка чакырат, бирок сенде убакыт жок. Кайсы жооп сылык?',
    options: ['Nein, ich will nicht.', 'Leider kann ich nicht, denn ich habe einen Termin.', 'Das ist mir egal.'],
    answer: 'Leider kann ich nicht, denn ich habe einen Termin.',
    skill: 'grammar',
    concept: 'a2-vorschlaege-verabredungen',
    why: s(
      'Вежливый отказ содержит «leider» и причину с denn. «Nein, ich will nicht» звучит грубо, а «Das ist mir egal» — безразлично.',
      'Сылык баш тартууда «leider» жана denn менен себеп бар. «Nein, ich will nicht» дөрөкөт, ал эми «Das ist mir egal» кайдыгер угулат.',
    ),
  },
  {
    id: 'a2-ft-20-03',
    prompt: 'Hast du am Freitag schon etwas ___?',
    promptRu: 'У тебя в пятницу уже есть планы?',
    promptKy: 'Бейшемби күнү сенин пландарың барбы?',
    options: ['vorhabe', 'hast vor', 'vor'],
    answer: 'vor',
    skill: 'grammar',
    concept: 'a2-absichten-plaene',
    why: s(
      'В вопросе Hast du … etwas vor? глагол hast уже стоит в начале, а приставка vor идёт в самом конце.',
      'Hast du … etwas vor? деген суроодо hast этиши башында турат, ал эми vor приставкасы эң аягында.',
    ),
  },
  {
    id: 'a2-ft-20-04',
    prompt: 'Du lädst Gäste höflich ein. Welcher Satz passt?',
    promptRu: 'Ты вежливо приглашаешь гостей. Какое предложение подходит?',
    promptKy: 'Сен конокторду сылык чакырып жатасың. Кайсы сүйлөм ылайыктуу?',
    options: ['Ich will dich einladen.', 'Ich möchte dich zu meiner Feier einladen.', 'Du musst kommen.'],
    answer: 'Ich möchte dich zu meiner Feier einladen.',
    skill: 'grammar',
    concept: 'a2-absichten-plaene',
    why: s(
      'Вежливое желание — ich möchte. Ich will и du musst звучат слишком резко для приглашения.',
      'Сылык каалоо — ich möchte. Ich will жана du musst чакыруу үчүн өтө кескин угулат.',
    ),
  },
  {
    id: 'a2-ft-20-05',
    prompt: 'Ich kann nicht kommen, ___ ich muss arbeiten.',
    promptRu: 'Я не могу прийти, ведь мне нужно работать.',
    promptKy: 'Мен келе албайм, анткени мага иштеш керек.',
    options: ['denn', 'weil', 'deshalb'],
    answer: 'denn',
    skill: 'grammar',
    concept: 'a2-satzverbindungen-integration',
    why: s(
      'За пропуском стоит обычный порядок слов: ich muss arbeiten — глагол вторым. Так бывает после denn. После weil глагол ушёл бы в конец.',
      'Боштуктан кийин кадимки сөз тартиби турат: ich muss arbeiten — этиш экинчи. Бул denn сөзүнөн кийин болот. weil сөзүнөн кийин этиш аягына өтмөк.',
    ),
  },
  {
    id: 'a2-ft-20-06',
    prompt: 'Welcher Satz ist richtig?',
    promptRu: 'Какое предложение правильное?',
    promptKy: 'Кайсы сүйлөм туура?',
    options: ['Wenn es regnet, wir bleiben zu Hause.', 'Wenn es regnet, bleiben zu Hause wir.', 'Wenn es regnet, bleiben wir zu Hause.'],
    answer: 'Wenn es regnet, bleiben wir zu Hause.',
    skill: 'grammar',
    concept: 'a2-satzverbindungen-integration',
    why: s(
      'Придаточное с wenn стоит первым, поэтому главное предложение начинается с глагола: bleiben wir.',
      'wenn менен бириккен сүйлөм биринчи турат, ошондуктан башкы сүйлөм этиштен башталат: bleiben wir.',
    ),
  },
  {
    id: 'a2-ft-20-07',
    prompt: 'Lena sagt: „Ich habe am einundzwanzigsten Juni Geburtstag.“ Welches Datum ist das?',
    promptRu: 'Лена говорит это предложение. Какая это дата?',
    promptKy: 'Лена ушуну айтат. Бул кайсы дата?',
    options: ['Am 12. Juni', 'Am 21. Juni', 'Am 1. Juni'],
    answer: 'Am 21. Juni',
    skill: 'grammar',
    why: s(
      'Einundzwanzigsten — это 21-е: порядковое число в дате (юнит 16) записывают цифрой с точкой, am 21. Juni.',
      'Einundzwanzigsten — 21-инчи: датадагы иреттик сан (16-бөлүм) чекити бар цифра менен жазылат, am 21. Juni.',
    ),
  },
  {
    id: 'a2-ft-20-08',
    prompt: 'Zum Geburtstag bringe ich ein ___ mit.',
    promptRu: 'На день рождения я принесу подарок.',
    promptKy: 'Туулган күнгө мен белек алып барам.',
    options: ['Geschenk', 'Entscheidung', 'Verabredung'],
    answer: 'Geschenk',
    skill: 'vocabulary',
    why: s(
      'На день рождения приносят подарок — das Geschenk. Die Entscheidung — решение, die Verabredung — договорённость о встрече.',
      'Туулган күнгө белек алып барышат — das Geschenk. Die Entscheidung — чечим, die Verabredung — жолугушуу боюнча макулдашуу.',
    ),
  },
  {
    id: 'a2-ft-20-09',
    prompt: 'Wir schreiben eine ___ für die Hochzeit.',
    promptRu: 'Мы пишем приглашение на свадьбу.',
    promptKy: 'Биз үйлөнүү тоюна чакыруу жазып жатабыз.',
    options: ['Entscheidung', 'Möglichkeit', 'Einladung'],
    answer: 'Einladung',
    skill: 'vocabulary',
    why: s(
      'Устойчивое сочетание: eine Einladung schreiben. Entscheidung и Möglichkeit сюда по смыслу не подходят.',
      'Туруктуу сөз айкашы: eine Einladung schreiben. Entscheidung жана Möglichkeit мында мааниси боюнча туура келбейт.',
    ),
  },
  {
    id: 'a2-ft-20-10',
    prompt: 'Welches Wort passt nicht zum Thema „Zeit und Plan“?',
    promptRu: 'Какое слово не подходит к теме «Время и план»?',
    promptKy: '«Убакыт жана план» темасына кайсы сөз туура келбейт?',
    options: ['übermorgen', 'das Geschenk', 'spätestens'],
    answer: 'das Geschenk',
    skill: 'vocabulary',
    why: s(
      'Übermorgen и spätestens — слова о времени. Das Geschenk — подарок, оно не относится к теме времени.',
      'Übermorgen жана spätestens — убакыт сөздөрү. Das Geschenk — белек, ал убакыт темасына тиешелүү эмес.',
    ),
  },
  {
    id: 'a2-ft-20-11',
    prompt:
      'Lies die Einladung: „Liebe Familie Roth, wir feiern am 5. Juli unsere Hochzeit. Die Feier beginnt um 15 Uhr im Café am See. Bitte antworten Sie bis zum 20. Juni.“ Wann beginnt die Feier?',
    promptRu: 'Прочитайте приглашение. Когда начинается праздник?',
    promptKy: 'Чакыруунун текстин окуңуз. Майрам качан башталат?',
    options: ['Um 15 Uhr', 'Um 5 Uhr', 'Um 20 Uhr'],
    answer: 'Um 15 Uhr',
    skill: 'reading',
    why: s(
      'В приглашении написано: «Die Feier beginnt um 15 Uhr». Числа 5 и 20 относятся к датам (5. Juli, 20. Juni).',
      'Чакырууда жазылган: «Die Feier beginnt um 15 Uhr». 5 жана 20 сандары даталарга тиешелүү (5. Juli, 20. Juni).',
    ),
  },
  {
    id: 'a2-ft-20-12',
    prompt:
      'Lies die Nachricht: „Hallo Paul, ich kann am Samstag leider nicht kommen, weil ich krank bin. Wie wäre es mit Sonntag? Dann bin ich wieder gesund. Max“ Welcher Tag passt Max?',
    promptRu: 'Прочитайте сообщение. Какой день подходит Максу?',
    promptKy: 'Билдирүүнү окуңуз. Макска кайсы күн ылайыктуу?',
    options: ['Samstag', 'Freitag', 'Sonntag'],
    answer: 'Sonntag',
    skill: 'reading',
    concept: 'a2-vorschlaege-verabredungen',
    why: s(
      'Макс отказывается от субботы (он болен) и предлагает воскресенье: «Wie wäre es mit Sonntag?». Пятница не упоминается.',
      'Макс ишембиден баш тартат (ал оорулуу) жана жекшембини сунуштайт: «Wie wäre es mit Sonntag?». Бейшемби айтылган эмес.',
    ),
  },
  {
    id: 'a2-ft-20-13',
    prompt:
      'Lies die Situation: „Dein Nachbar fragt: Hast du am Samstag Zeit? Wir feiern im Garten. Du hast leider schon einen Termin, aber du möchtest höflich antworten.“ Welche Antwort passt?',
    promptRu: 'Прочитайте ситуацию. Какой ответ подходит?',
    promptKy: 'Кырдаалды окуңуз. Кайсы жооп ылайыктуу?',
    options: ['Danke für die Einladung! Leider habe ich einen Termin. Wie wäre es mit Sonntag?', 'Ich habe keine Lust.', 'Ich komme, aber ich bringe nichts mit.'],
    answer: 'Danke für die Einladung! Leider habe ich einen Termin. Wie wäre es mit Sonntag?',
    skill: 'reading',
    concept: 'a2-vorschlaege-verabredungen',
    why: s(
      'Вежливый ответ благодарит, называет причину и предлагает другой день. «Ich habe keine Lust» звучит грубо, а третий ответ не соответствует ситуации: гость не может прийти.',
      'Сылык жооп ыраазычылык билдирет, себебин айтат жана башка күндү сунуштайт. «Ich habe keine Lust» дөрөкөт, ал эми үчүнчү жооп кырдаалга туура келбейт: конок келе албайт.',
    ),
  },
  {
    id: 'a2-ft-20-14',
    prompt:
      'Lies den Aushang: „Sommerfest im Park: Samstag, 16. August, ab 14 Uhr. Jeder bringt etwas zum Essen mit. Bei Regen feiern wir in der Schule.“ Wo feiern sie bei Regen?',
    promptRu: 'Прочитайте объявление. Где они празднуют, если идёт дождь?',
    promptKy: 'Жарыяны окуңуз. Жамгыр жааса, алар кайда майрамдашат?',
    options: ['Im Park', 'In der Schule', 'Im Garten'],
    answer: 'In der Schule',
    skill: 'reading',
    concept: 'a2-absichten-plaene',
    why: s(
      'В объявлении: «Bei Regen feiern wir in der Schule». Парк — это место при хорошей погоде.',
      'Жарыяда: «Bei Regen feiern wir in der Schule». Парк — аба ырайы жакшы болгондогу жер.',
    ),
  },
  {
    id: 'a2-ft-20-15',
    prompt:
      'Lies das Gespräch: „Anna: Wollen wir Pizza essen? Ben: Ich habe keinen Hunger. Anna: Wie wäre es mit einem Salat? Ben: Gut, einverstanden.“ Was entscheiden die beiden?',
    promptRu: 'Прочитайте разговор. Что решают двое?',
    promptKy: 'Сүйлөшүүнү окуңуз. Экөө эмнени чечишет?',
    options: ['Pizza essen', 'Nichts essen', 'Salat essen'],
    answer: 'Salat essen',
    skill: 'reading',
    why: s(
      'Бен не хочет пиццу, Анна предлагает салат, и Бен соглашается («einverstanden»). Значит, они едят салат.',
      'Бен пицца жегиси келбейт, Анна салат сунуштайт жана Бен макул болот («einverstanden»). Демек, алар салат жешет.',
    ),
  },
]
