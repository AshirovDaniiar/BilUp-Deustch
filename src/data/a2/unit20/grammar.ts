import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_20_SOURCE } from '../provenance'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 20 grammar (Stage 7K) — the capstone. The THREE concepts of the approved Stage 7B plan, each with a capped scope (docs/authoring/A2_UNIT20_DESIGN_NOTES.md):
 *  1. `a2-vorschlaege-verabredungen` — suggesting and answering: `Wollen wir …?`, `Lass uns …` (du-imperative), `Wie wäre es mit …?` (a FIXED CHUNK, never explained as
 *     a Konjunktiv form — same status as `hätte gern`, audit D-3), `Ich schlage vor, dass …`, accepting (Gern / Einverstanden / Gute Idee) and declining politely
 *     (Leider kann ich nicht …, denn …).
 *  2. `a2-absichten-plaene` — `vorhaben` (separable, particle at the end), `wollen`, `möchten`, `planen`; future time words (übermorgen, bald, spätestens, am Wochenende).
 *     Future meaning = Präsens + time word (unit 18). No `werden` for intentions, no `zu` + Infinitiv.
 *  3. `a2-satzverbindungen-integration` — cumulative practice of und / aber / oder / denn / weil / wenn / dass / deshalb, with the three word-order patterns
 *     (main clause: und, aber, oder, denn; verb final: weil, wenn, dass; inversion: deshalb). No new connector; `entweder … oder` stays receptive and is not shown.
 * Not taught: Konjunktiv II as a form (`wäre`, `würde`, `könnte`), `lassen` as a verb, other `lass`-forms, `zu` + Infinitiv, `obwohl`, `damit`, Relativsatz, Passiv, ihr-imperative.
 */
export const UNIT_20_GRAMMAR: GrammarConcept[] = [
  {
    id: 'a2-vorschlaege-verabredungen',
    category: 'verbs',
    level: 'A2',
    unit: 20,
    visual: 'modal',
    title: l('Предложения и приглашения: Wollen wir …?, Lass uns …, Wie wäre es mit …?, Ich schlage vor, dass …', 'Сунуштар жана чакыруулар: Wollen wir …?, Lass uns …, Wie wäre es mit …?, Ich schlage vor, dass …'),
    summary: l(
      'Чтобы договориться о встрече, нужны готовые формулы. Предложить: «Wollen wir ins Kino gehen?», «Lass uns ins Kino gehen!» (на «du»), «Wie wäre es mit einem Kaffee?» (готовое выражение: после mit — существительное в Dativ), «Ich schlage vor, dass wir ins Kino gehen» (глагол в конце). Согласиться: «Ja, gern», «Gute Idee», «Einverstanden». Вежливо отказаться: «Leider kann ich nicht, denn ich muss arbeiten» или «Tut mir leid, aber …», и предложить другое: «Wie wäre es mit Sonntag?». Wie wäre es mit … мы учим как целое выражение, а не как форму глагола: другие подобные формы (wäre, würde, könnte) в этом юните не разбираются.',
      'Жолугушууга макулдашуу үчүн даяр формулалар керек. Сунуштоо: «Wollen wir ins Kino gehen?», «Lass uns ins Kino gehen!» («du» формасында), «Wie wäre es mit einem Kaffee?» (даяр сөз айкашы: mit сөзүнөн кийин Dativдеги зат атооч), «Ich schlage vor, dass wir ins Kino gehen» (этиш аягында). Макул болуу: «Ja, gern», «Gute Idee», «Einverstanden». Сылык баш тартуу: «Leider kann ich nicht, denn ich muss arbeiten» же «Tut mir leid, aber …», анан башкасын сунуштоо: «Wie wäre es mit Sonntag?». Wie wäre es mit … бүтүндөй сөз айкашы катары үйрөнүлөт, этиштин формасы катары эмес: wäre, würde, könnte сыяктуу башка формалар бул бөлүмдө талкууланбайт.',
    ),
    discover: l(
      'Сравните: «Wollen wir ins Kino gehen?» и «Ich schlage vor, dass wir ins Kino gehen». Где стоит глагол gehen в каждом предложении?',
      '«Wollen wir ins Kino gehen?» жана «Ich schlage vor, dass wir ins Kino gehen» деген сүйлөмдөрдү салыштырыңыз. Ар бир сүйлөмдө gehen этиши кайда турат?',
    ),
    why: l(
      'Договариваться о встрече нужно каждый день: с друзьями, коллегами, соседями. Если знать пять-шесть формул, можно предложить, согласиться, вежливо отказаться и предложить другой вариант, не выглядя грубым.',
      'Жолугушууга макулдашуу күн сайын керек: достор, кесиптештер, коңшулар менен. Беш-алты формуланы билсеңиз, сунуш кылууга, макул болууга, сылык баш тартууга жана башка вариант сунуштоого болот, дөрөкөт көрүнбөйсүз.',
    ),
    when: [
      l(
        'Предложение другу: Wollen wir …? (вопрос, глагол в конце) или Lass uns … (императив на «du»): Wollen wir morgen Fußball spielen? Lass uns Pizza essen!',
        'Досуңузга сунуш: Wollen wir …? (суроо, этиш аягында) же Lass uns … («du» формасындагы буйрук): Wollen wir morgen Fußball spielen? Lass uns Pizza essen!',
      ),
      l(
        'Готовое выражение: Wie wäre es mit + Dativ. Wie wäre es mit einem Kaffee? Wie wäre es mit Sonntag? Не разбирайте его как форму глагола.',
        'Даяр сөз айкашы: Wie wäre es mit + Dativ. Wie wäre es mit einem Kaffee? Wie wäre es mit Sonntag? Аны этиштин формасы катары талдабаңыз.',
      ),
      l(
        'Формальнее: Ich schlage vor, dass wir … + глагол в конце. Ich schlage vor, dass wir um acht anfangen.',
        'Расмийирээк: Ich schlage vor, dass wir … + этиш аягында. Ich schlage vor, dass wir um acht anfangen.',
      ),
      l(
        'Ответ: согласие — Ja, gern. Gute Idee. Einverstanden. Отказ — Leider kann ich nicht, denn …  Tut mir leid, aber … Вариант — Wie wäre es mit …?',
        'Жооп: макул болуу — Ja, gern. Gute Idee. Einverstanden. Баш тартуу — Leider kann ich nicht, denn …  Tut mir leid, aber … Вариант — Wie wäre es mit …?',
      ),
    ],
    examples: [
      { de: 'Wollen wir morgen ins Kino gehen?', ru: 'Пойдём завтра в кино?', ky: 'Эртең киного барабызбы?', focus: 'Wollen wir …? (глагол в конце)' },
      { de: 'Lass uns Pizza essen!', ru: 'Давай поедим пиццу!', ky: 'Келгиле, пицца жейли!', focus: 'Lass uns … (du)' },
      { de: 'Wie wäre es mit einem Kaffee?', ru: 'Как насчёт кофе?', ky: 'Кофе ичсекчи?', focus: 'Wie wäre es mit + Dativ (готовое выражение)' },
      { de: 'Ich schlage vor, dass wir um acht anfangen.', ru: 'Я предлагаю начать в восемь.', ky: 'Мен саат сегизде баштоону сунуштайм.', focus: 'Ich schlage vor, dass … (глагол в конце)' },
      { de: 'Ja, gern. Das ist eine gute Idee.', ru: 'Да, с удовольствием. Это хорошая идея.', ky: 'Ооба, кубанычта. Бул жакшы идея.', focus: 'согласие' },
      { de: 'Leider kann ich nicht, denn ich muss arbeiten.', ru: 'К сожалению, не могу, ведь мне нужно работать.', ky: 'Тилекке каршы, мен болбойт, анткени мага иштеш керек.', focus: 'вежливый отказ с причиной' },
    ],
    mistakes: [
      {
        wrong: 'Wollen wir gehen ins Kino?',
        right: 'Wollen wir ins Kino gehen?',
        note: l(
          'После Wollen wir инфинитив стоит в конце предложения.',
          'Wollen wir сөзүнөн кийин инфинитив сүйлөмдүн аягында турат.',
        ),
      },
      {
        wrong: 'Wie wäre es mit ein Kaffee?',
        right: 'Wie wäre es mit einem Kaffee?',
        note: l(
          'После mit всегда Dativ: einem Kaffee. Выражение целиком учите как готовое.',
          'mit сөзүнөн кийин ар дайым Dativ турат: einem Kaffee. Сөз айкашын бүтүндөй даяр катары жаттаңыз.',
        ),
      },
      {
        wrong: 'Ich schlage vor, dass wir gehen ins Kino.',
        right: 'Ich schlage vor, dass wir ins Kino gehen.',
        note: l(
          'После dass глагол уходит в конец придаточного.',
          'dass сөзүнөн кийин этиш бириккен сүйлөмдүн аягына өтөт.',
        ),
      },
      {
        wrong: 'Ich kann nicht, weil ich muss arbeiten.',
        right: 'Ich kann nicht, denn ich muss arbeiten.',
        note: l(
          'После denn порядок слов обычный (глагол вторым). После weil глагол стоял бы в конце: weil ich arbeiten muss.',
          'denn сөзүнөн кийин сөз тартиби кадимкидей (этиш экинчи). weil сөзүнөн кийин этиш аягында турмак: weil ich arbeiten muss.',
        ),
      },
    ],
    reallife: [
      { de: 'Wollen wir am Samstag zusammen kochen?', ru: 'Приготовим вместе в субботу?', ky: 'Ишемби күнү чогуу тамак бышыралыбы?', focus: 'Wollen wir …?' },
      { de: 'Tut mir leid, aber am Freitag habe ich keine Zeit.', ru: 'Мне жаль, но в пятницу у меня нет времени.', ky: 'Кечиресиз, бирок бейшемби күнү менде убакыт жок.', focus: 'Tut mir leid, aber …' },
      { de: 'Wie wäre es mit übermorgen?', ru: 'А как насчёт послезавтра?', ky: 'Бүрсүгүнү кандай болот?', focus: 'Wie wäre es mit … (вариант)' },
    ],
    dialogue: [
      { speaker: 'Nina', text: 'Wollen wir am Samstag ins Kino gehen?', ru: 'Пойдём в субботу в кино?', ky: 'Ишемби күнү киного барабызбы?' },
      { speaker: 'Paul', text: 'Leider kann ich nicht, denn ich muss arbeiten.', ru: 'К сожалению, не могу, ведь мне нужно работать.', ky: 'Тилекке каршы, мен болбойт, анткени мага иштеш керек.' },
      { speaker: 'Nina', text: 'Schade! Wie wäre es mit Sonntag?', ru: 'Жаль! А как насчёт воскресенья?', ky: 'Аябай өкүнүчтүү! Жекшемби кандай болот?' },
      { speaker: 'Paul', text: 'Ja, gern. Einverstanden!', ru: 'Да, с удовольствием. Согласен!', ky: 'Ооба, кубанычта. Макул!' },
    ],
    speakPrompt: {
      prompt: l(
        'Предложите другу что-нибудь на выходные: используйте Wollen wir …? и Wie wäre es mit …?, а затем согласитесь или вежливо откажитесь с причиной.',
        'Досуңузга дем алыш күндөрүнө бир нерсе сунуштаңыз: Wollen wir …? жана Wie wäre es mit …? колдонуңуз, андан кийин макул болуңуз же себеби менен сылык баш тартыңыз.',
      ),
      sample: 'Wollen wir am Samstag schwimmen gehen? Wie wäre es mit dem See? Leider kann ich nicht, denn ich muss arbeiten.',
      keywords: ['wollen wir', 'wie wäre es', 'leider'],
    },
    source: UNIT_20_SOURCE,
  },
  {
    id: 'a2-absichten-plaene',
    category: 'verbs',
    level: 'A2',
    unit: 20,
    visual: 'separable',
    title: l('Намерения и планы: vorhaben, wollen, möchten, planen', 'Ниеттер жана пландар: vorhaben, wollen, möchten, planen'),
    summary: l(
      'О планах говорят четырьмя глаголами. Vorhaben — «иметь в планах», отделяемая приставка уходит в конец: «Was hast du am Samstag vor?» — «Ich habe nichts vor». Wollen — желание или решение: «Ich will nach Köln fahren». Möchten — вежливое желание: «Ich möchte dich einladen». Planen — планировать что-то конкретное: «Wir planen eine Party». Время будущего показывают словами: morgen, übermorgen, bald, am Wochenende, spätestens um acht. Отдельная форма будущего времени не нужна: достаточно настоящего времени и слова о времени (юнит 18).',
      'Пландар жөнүндө төрт этиш менен айтышат. Vorhaben — «планда болуу», приставкасы аягына өтөт: «Was hast du am Samstag vor?» — «Ich habe nichts vor». Wollen — каалоо же чечим: «Ich will nach Köln fahren». Möchten — сылык каалоо: «Ich möchte dich einladen». Planen — бир конкреттүү нерсени пландоо: «Wir planen eine Party». Келечекти убакыт сөздөрү көрсөтөт: morgen, übermorgen, bald, am Wochenende, spätestens um acht. Келечектин өзүнчө формасы керек эмес: азыркы чак жана убакыт сөзү жетиштүү (18-бөлүм).',
    ),
    discover: l(
      'Сравните: «Ich habe am Sonntag nichts vor» и «Ich möchte am Sonntag nichts machen». Что в первом предложении уходит в конец и как называется этот глагол с приставкой?',
      '«Ich habe am Sonntag nichts vor» жана «Ich möchte am Sonntag nichts machen» деген сүйлөмдөрдү салыштырыңыз. Биринчи сүйлөмдө эмне аягына өтөт жана приставкасы бар бул этиш кандай аталат?',
    ),
    why: l(
      'Когда вас приглашают или вы сами зовёте других, вы спрашиваете «Was hast du vor?» и говорите о своих планах. Нужно различать: что вы хотите (wollen, möchten) и что у вас уже запланировано (vorhaben, planen).',
      'Сизди чакырышканда же өзүңүз башкаларды чакырганда «Was hast du vor?» деп сурап, пландарыңыз жөнүндө айтасыз. Эмнени каалаганыңызды (wollen, möchten) жана эмне пландалып калганын (vorhaben, planen) айырмалоо керек.',
    ),
    when: [
      l(
        'Vorhaben: приставка vor — в конце. Was hast du am Wochenende vor? Wir haben nichts vor. Heute Abend habe ich etwas vor.',
        'Vorhaben: vor приставкасы аягында. Was hast du am Wochenende vor? Wir haben nichts vor. Heute Abend habe ich etwas vor.',
      ),
      l(
        'Wollen — решение, möchten — вежливо: Ich will heute früh schlafen. Ich möchte dich zu meiner Party einladen.',
        'Wollen — чечим, möchten — сылык: Ich will heute früh schlafen. Ich möchte dich zu meiner Party einladen.',
      ),
      l(
        'Planen + конкретное существительное: Wir planen eine Party. Wer plant das Fest? Слова о времени: übermorgen, bald, spätestens.',
        'Planen + конкреттүү зат атооч: Wir planen eine Party. Wer plant das Fest? Убакыт сөздөрү: übermorgen, bald, spätestens.',
      ),
      l(
        'Будущее — настоящее время + слово о времени: Übermorgen organisiere ich die Feier. Слово о времени стоит первым — глагол вторым.',
        'Келечек — азыркы чак + убакыт сөзү: Übermorgen organisiere ich die Feier. Убакыт сөзү биринчи турат — этиш экинчи.',
      ),
    ],
    examples: [
      { de: 'Was hast du am Samstag vor?', ru: 'Какие у тебя планы на субботу?', ky: 'Ишемби күнүнө сенин пландарың кандай?', focus: 'vorhaben: vor — в конце' },
      { de: 'Ich habe am Sonntag nichts vor.', ru: 'В воскресенье у меня нет планов.', ky: 'Жекшемби күнү менин эч кандай планым жок.', focus: 'vorhaben + nichts' },
      { de: 'Ich möchte dich zu meiner Party einladen.', ru: 'Я хотел бы пригласить тебя на мою вечеринку.', ky: 'Мен сени өзүмдүн кечеме чакыргым келет.', focus: 'möchten (вежливо)' },
      { de: 'Wir planen eine Party für Anna.', ru: 'Мы планируем вечеринку для Анны.', ky: 'Биз Анна үчүн кече пландап жатабыз.', focus: 'planen + Akkusativ' },
      { de: 'Übermorgen organisiere ich die Feier.', ru: 'Послезавтра я организую праздник.', ky: 'Бүрсүгүнү мен майрамды уюштурам.', focus: 'время впереди, глагол вторым' },
    ],
    mistakes: [
      {
        wrong: 'Ich vorhabe am Sonntag nichts.',
        right: 'Ich habe am Sonntag nichts vor.',
        note: l(
          'Vorhaben — отделяемый глагол: habe стоит на втором месте, а vor — в самом конце.',
          'Vorhaben — приставкасы бөлүнүп калган этиш: habe экинчи орунда турат, ал эми vor — эң аягында.',
        ),
      },
      {
        wrong: 'Was hast du vor am Samstag?',
        right: 'Was hast du am Samstag vor?',
        note: l(
          'Приставка vor стоит в конце предложения, после слов о времени.',
          'vor приставкасы сүйлөмдүн аягында, убакыт сөздөрүнөн кийин турат.',
        ),
      },
      {
        wrong: 'Ich werde morgen eine Party planen.',
        right: 'Morgen plane ich eine Party.',
        note: l(
          'Для планов нужно настоящее время со словом о времени, а не werden.',
          'Пландар үчүн убакыт сөзү бар азыркы чак керек, werden эмес.',
        ),
      },
      {
        wrong: 'Ich möchte dich einladen zu meiner Party.',
        right: 'Ich möchte dich zu meiner Party einladen.',
        note: l(
          'После möchten второй глагол (einladen) стоит в конце предложения.',
          'möchten сөзүнөн кийин экинчи этиш (einladen) сүйлөмдүн аягында турат.',
        ),
      },
    ],
    reallife: [
      { de: 'Hast du am Freitag schon etwas vor?', ru: 'У тебя в пятницу уже есть планы?', ky: 'Бейшемби күнү сенин пландарың барбы?', focus: 'vorhaben in einer Frage' },
      { de: 'Wir wollen bald zusammen verreisen.', ru: 'Мы хотим скоро поехать вместе в путешествие.', ky: 'Биз жакында чогуу саякаттап чыккыбыз келет.', focus: 'wollen + bald' },
      { de: 'Spätestens am Montag antworte ich dir.', ru: 'Самое позднее в понедельник я отвечу тебе.', ky: 'Эң кеч дегенде дүйшөмбү күнү сага жооп берем.', focus: 'spätestens' },
    ],
    dialogue: [
      { speaker: 'Lena', text: 'Was hast du am Wochenende vor?', ru: 'Какие у тебя планы на выходные?', ky: 'Дем алыш күндөрүнө сенин пландарың кандай?' },
      { speaker: 'Max', text: 'Noch nichts. Ich möchte vielleicht schwimmen gehen.', ru: 'Пока ничего. Может быть, я хотел бы пойти плавать.', ky: 'Азырынча эч нерсе. Балким, мен сүзүүгө барсам деп турам.' },
      { speaker: 'Lena', text: 'Wir planen am Samstag ein Picknick. Kommst du mit?', ru: 'В субботу мы планируем пикник. Ты с нами?', ky: 'Ишемби күнү биз пикник пландап жатабыз. Сен биз менен барасыңбы?' },
      { speaker: 'Max', text: 'Gern! Ich bringe etwas zu trinken mit.', ru: 'С удовольствием! Я принесу что-нибудь попить.', ky: 'Кубанычта! Мен ичүүгө бир нерсе алып келем.' },
    ],
    speakPrompt: {
      prompt: l(
        'Спросите друга о планах (Was hast du … vor?) и расскажите о своих: что вы планируете, когда и что вы хотите.',
        'Досуңуздан пландары жөнүндө сураңыз (Was hast du … vor?) жана өзүңүздүн пландарыңыз жөнүндө айтыңыз: эмне пландап жатасыз, качан жана эмнени каалайсыз.',
      ),
      sample: 'Was hast du am Samstag vor? Ich habe nichts vor. Übermorgen plane ich eine Party.',
      keywords: ['vor', 'plane', 'übermorgen'],
    },
    source: UNIT_20_SOURCE,
  },
  {
    id: 'a2-satzverbindungen-integration',
    category: 'conjunctions',
    level: 'A2',
    unit: 20,
    visual: 'verbpos',
    title: l('Повторение: und, aber, oder, denn, weil, wenn, dass, deshalb', 'Кайталоо: und, aber, oder, denn, weil, wenn, dass, deshalb'),
    summary: l(
      'Все связки, которые вы уже знаете, работают по трём схемам. 1) und, aber, oder, denn — обычный порядок, глагол вторым: «Ich komme nicht, denn ich muss arbeiten». 2) weil, wenn, dass — глагол в конце: «Ich komme nicht, weil ich arbeiten muss»; «Wenn es regnet, bleiben wir zu Hause»; «Ich finde, dass das Kino eine gute Idee ist». 3) deshalb — глагол сразу после него: «Ich muss arbeiten, deshalb komme ich nicht». Новых связок нет: вы учитесь выбирать подходящую и ставить глагол на место, чтобы объяснить отказ, условие и решение.',
      'Билген байламталардын баары үч схема боюнча иштейт. 1) und, aber, oder, denn — кадимки тартип, этиш экинчи: «Ich komme nicht, denn ich muss arbeiten». 2) weil, wenn, dass — этиш аягында: «Ich komme nicht, weil ich arbeiten muss»; «Wenn es regnet, bleiben wir zu Hause»; «Ich finde, dass das Kino eine gute Idee ist». 3) deshalb — этиш андан кийин дароо: «Ich muss arbeiten, deshalb komme ich nicht». Жаңы байламталар жок: баш тартууну, шартты жана чечимди түшүндүрүү үчүн ылайыктуусун тандап, этишти өз ордуна коюуну үйрөнөсүз.',
    ),
    discover: l(
      'Сравните три предложения: «…, denn ich muss arbeiten», «…, weil ich arbeiten muss», «…, deshalb komme ich nicht». Где стоит глагол muss или komme в каждом из них?',
      'Үч сүйлөмдү салыштырыңыз: «…, denn ich muss arbeiten», «…, weil ich arbeiten muss», «…, deshalb komme ich nicht». Алардын ар биринде muss же komme этиши кайда турат?',
    ),
    why: l(
      'Когда вы отказываетесь от приглашения, нужно объяснить причину, поставить условие или принять решение вместе: тут сразу нужны weil, denn, wenn, deshalb. Если перепутать порядок слов, смысл понятен, но фраза звучит неправильно.',
      'Чакырууну четке каккан кезде себебин түшүндүрүү, шарт коюу же чогуу чечим кабыл алуу керек: бул жерде weil, denn, wenn, deshalb дароо керек болот. Сөз тартибин чаташтырсаңыз, мааниси түшүнүктүү, бирок сүйлөм туура эмес угулат.',
    ),
    when: [
      l(
        'Главное предложение без изменений: und, aber, oder, denn. Ich möchte kommen, aber ich habe keine Zeit. Wir gehen essen, oder wir gehen ins Kino.',
        'Башкы сүйлөм өзгөрүүсүз: und, aber, oder, denn. Ich möchte kommen, aber ich habe keine Zeit. Wir gehen essen, oder wir gehen ins Kino.',
      ),
      l(
        'Глагол в конце: weil, wenn, dass. Ich bleibe zu Hause, weil ich müde bin. Wenn du Zeit hast, komm doch. Ich finde, dass die Idee gut ist.',
        'Этиш аягында: weil, wenn, dass. Ich bleibe zu Hause, weil ich müde bin. Wenn du Zeit hast, komm doch. Ich finde, dass die Idee gut ist.',
      ),
      l(
        'Deshalb — глагол сразу после него: Ich bin müde, deshalb bleibe ich zu Hause. Сравните с weil: Ich bleibe zu Hause, weil ich müde bin.',
        'Deshalb — этиш андан кийин дароо: Ich bin müde, deshalb bleibe ich zu Hause. weil менен салыштырыңыз: Ich bleibe zu Hause, weil ich müde bin.',
      ),
      l(
        'Если придаточное стоит первым, главное начинается с глагола: Wenn es regnet, bleiben wir zu Hause. Weil ich müde bin, bleibe ich zu Hause.',
        'Бириккен сүйлөм биринчи турса, башкы сүйлөм этиштен башталат: Wenn es regnet, bleiben wir zu Hause. Weil ich müde bin, bleibe ich zu Hause.',
      ),
    ],
    examples: [
      { de: 'Ich komme nicht, denn ich muss arbeiten.', ru: 'Я не приду, ведь мне нужно работать.', ky: 'Мен келбейм, анткени мага иштеш керек.', focus: 'denn: глагол вторым' },
      { de: 'Ich komme nicht, weil ich arbeiten muss.', ru: 'Я не приду, потому что мне нужно работать.', ky: 'Мен келбейм, себеби мага иштеш керек.', focus: 'weil: глагол в конце' },
      { de: 'Ich muss arbeiten, deshalb komme ich nicht.', ru: 'Мне нужно работать, поэтому я не приду.', ky: 'Мага иштеш керек, ошондуктан мен келбейм.', focus: 'deshalb: глагол сразу после' },
      { de: 'Wenn es regnet, bleiben wir zu Hause.', ru: 'Если пойдёт дождь, мы останемся дома.', ky: 'Жамгыр жааса, биз үйдө калабыз.', focus: 'wenn: условие' },
      { de: 'Ich finde, dass das eine gute Idee ist.', ru: 'Я считаю, что это хорошая идея.', ky: 'Менимче, бул жакшы идея.', focus: 'dass: глагол в конце' },
    ],
    mistakes: [
      {
        wrong: 'Ich komme nicht, weil ich muss arbeiten.',
        right: 'Ich komme nicht, weil ich arbeiten muss.',
        note: l(
          'После weil спрягаемый глагол (muss) стоит в самом конце.',
          'weil сөзүнөн кийин өзгөргөн этиш формасы (muss) эң аягында турат.',
        ),
      },
      {
        wrong: 'Ich komme nicht, denn ich arbeiten muss.',
        right: 'Ich komme nicht, denn ich muss arbeiten.',
        note: l(
          'После denn порядок слов обычный: глагол muss вторым, инфинитив в конце.',
          'denn сөзүнөн кийин сөз тартиби кадимкидей: muss этиши экинчи, инфинитив аягында.',
        ),
      },
      {
        wrong: 'Ich bin müde, deshalb ich bleibe zu Hause.',
        right: 'Ich bin müde, deshalb bleibe ich zu Hause.',
        note: l(
          'После deshalb сразу идёт глагол, а подлежащее — после него.',
          'deshalb сөзүнөн кийин дароо этиш келет, ал эми ээ андан кийин.',
        ),
      },
      {
        wrong: 'Wenn es regnet, wir bleiben zu Hause.',
        right: 'Wenn es regnet, bleiben wir zu Hause.',
        note: l(
          'Главное предложение после придаточного начинается с глагола.',
          'Бириккен сүйлөмдөн кийинки башкы сүйлөм этиштен башталат.',
        ),
      },
    ],
    reallife: [
      { de: 'Ich komme gern, aber ich kann erst um acht.', ru: 'Я с удовольствием приду, но смогу только в восемь.', ky: 'Мен кубанычта келем, бирок болгону саат сегизде келе алам.', focus: 'aber' },
      { de: 'Wenn du willst, bringe ich einen Kuchen mit.', ru: 'Если хочешь, я принесу пирог.', ky: 'Кааласаң, мен торт алып келем.', focus: 'wenn' },
      { de: 'Ich möchte, dass wir zusammen entscheiden.', ru: 'Я хочу, чтобы мы решили вместе.', ky: 'Мен биз чогуу чечим кабыл алганыбызды каалайм.', focus: 'dass' },
    ],
    dialogue: [
      { speaker: 'Tim', text: 'Kommst du am Samstag zur Party?', ru: 'Ты придёшь в субботу на вечеринку?', ky: 'Ишемби күнү кечеге келесиңби?' },
      { speaker: 'Eva', text: 'Leider nicht, denn ich muss arbeiten.', ru: 'К сожалению, нет, ведь мне нужно работать.', ky: 'Тилекке каршы, жок, анткени мага иштеш керек.' },
      { speaker: 'Tim', text: 'Schade! Ich glaube, dass es eine schöne Party ist.', ru: 'Жаль! Я думаю, что это будет хорошая вечеринка.', ky: 'Аябай өкүнүчтүү! Менимче, бул кооз кече болот.' },
      { speaker: 'Eva', text: 'Wenn ich früher fertig bin, komme ich später.', ru: 'Если я закончу раньше, я приду позже.', ky: 'Эгер мен эртерээк бүтүрсөм, кийинчерээк келем.' },
    ],
    speakPrompt: {
      prompt: l(
        'Откажитесь от приглашения и объясните причину тремя способами: с denn, с weil и с deshalb.',
        'Чакырууну четке кагып, себебин үч жол менен түшүндүрүңүз: denn, weil жана deshalb менен.',
      ),
      sample: 'Ich komme nicht, denn ich muss arbeiten. Ich komme nicht, weil ich arbeiten muss. Ich muss arbeiten, deshalb komme ich nicht.',
      keywords: ['denn', 'weil', 'deshalb'],
    },
    source: UNIT_20_SOURCE,
  },
]

/** "Why?" notes of Unit 20. */
export const UNIT_20_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Wollen wir morgen ins Kino gehen?',
    ru: 'Пойдём завтра в кино?',
    ky: 'Эртең киного барабызбы?',
    word: 'gehen',
    conceptId: 'a2-vorschlaege-verabredungen',
    reason: l(
      'Это вопрос-предложение: Wollen wir стоит в начале, а инфинитив gehen уходит в конец. Ответить можно «Ja, gern» или «Einverstanden».',
      'Бул суроо-сунуш: Wollen wir башында турат, ал эми gehen инфинитиви аягына өтөт. «Ja, gern» же «Einverstanden» деп жооп берсе болот.',
    ),
    more: [
      { de: 'Wie wäre es mit einem Kaffee?', ru: 'Как насчёт кофе?', ky: 'Кофе ичсекчи?' },
      { de: 'Lass uns Pizza essen!', ru: 'Давай поедим пиццу!', ky: 'Келгиле, пицца жейли!' },
    ],
  },
  {
    sentence: 'Was hast du am Samstag vor?',
    ru: 'Какие у тебя планы на субботу?',
    ky: 'Ишемби күнүнө сенин пландарың кандай?',
    word: 'vor',
    conceptId: 'a2-absichten-plaene',
    reason: l(
      'Vorhaben — отделяемый глагол: habe (hast) стоит на своём месте, а приставка vor уходит в конец предложения.',
      'Vorhaben — приставкасы бөлүнүп калган этиш: habe (hast) өз ордунда турат, ал эми vor приставкасы сүйлөмдүн аягына өтөт.',
    ),
    more: [
      { de: 'Ich habe am Sonntag nichts vor.', ru: 'В воскресенье у меня нет планов.', ky: 'Жекшемби күнү менин эч кандай планым жок.' },
      { de: 'Übermorgen organisiere ich die Feier.', ru: 'Послезавтра я организую праздник.', ky: 'Бүрсүгүнү мен майрамды уюштурам.' },
    ],
  },
  {
    sentence: 'Ich komme nicht, weil ich arbeiten muss.',
    ru: 'Я не приду, потому что мне нужно работать.',
    ky: 'Мен келбейм, себеби мага иштеш керек.',
    word: 'muss',
    conceptId: 'a2-satzverbindungen-integration',
    reason: l(
      'После weil спрягаемый глагол (muss) уходит в конец придаточного, а инфинитив arbeiten стоит перед ним. После denn порядок был бы обычным: denn ich muss arbeiten.',
      'weil сөзүнөн кийин өзгөргөн этиш формасы (muss) бириккен сүйлөмдүн аягына өтөт, ал эми arbeiten инфинитиви андан мурун турат. denn сөзүнөн кийин тартип кадимкидей болмок: denn ich muss arbeiten.',
    ),
    more: [
      { de: 'Ich muss arbeiten, deshalb komme ich nicht.', ru: 'Мне нужно работать, поэтому я не приду.', ky: 'Мага иштеш керек, ошондуктан мен келбейм.' },
      { de: 'Wenn es regnet, bleiben wir zu Hause.', ru: 'Если пойдёт дождь, мы останемся дома.', ky: 'Жамгыр жааса, биз үйдө калабыз.' },
    ],
  },
]
