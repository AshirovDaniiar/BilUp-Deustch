import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_16_SOURCE } from '../provenance'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 16 grammar (Stage 7G). Three concepts of the approved Stage 7B plan, each with a capped scope (docs/authoring/A2_UNIT16_DESIGN_NOTES.md):
 *  1. `a2-gern-lieber-am-liebsten` — the preference scale with verbs; `lieber als` and `besser als` recycle the unit-13 Komparativ (als only).
 *  2. `a2-verben-mit-praepositionen` — a CLOSED set of six pairs, all with Akkusativ (audit D-7): sich interessieren für, sich freuen auf, sich freuen über,
 *     warten auf, sprechen über, denken an. The question words Wofür? / Worauf? and the da(r)- adverbs are NOT taught.
 *  3. `a2-ordinalzahlen-datum` — ordinals 1.–31. in dates only: `der dritte Mai`, `am dritten Mai`, `am 3. Mai`; no ordinals above 31.
 * Not taught: other verb–preposition pairs, the Dativ after prepositions with an adjective, ordinals outside dates, `Lust haben auf`, vorschlagen-style forms (unit 20).
 */
export const UNIT_16_GRAMMAR: GrammarConcept[] = [
  {
    id: 'a2-gern-lieber-am-liebsten',
    category: 'adjectives',
    level: 'A2',
    unit: 16,
    visual: 'verbpos',
    title: l('gern – lieber – am liebsten: что вы любите и что любите больше', 'gern – lieber – am liebsten: эмнени жакшы көрөрүңүз жана эмнени көбүрөөк жакшы көрөрүңүз'),
    summary: l(
      'Слово gern ставят после глагола и говорят, что вам нравится делать: «Ich spiele gern Fußball». Если вы любите что-то больше, используйте lieber: «Ich schwimme lieber». Больше всего — am liebsten: «Am liebsten tanze ich». Это ряд gern – lieber – am liebsten (особая форма, как gut – besser – am besten из юнита 13). Для сравнения двух занятий берут lieber … als: «Ich lese lieber Bücher als Zeitungen». Если am liebsten стоит в начале предложения, глагол остаётся вторым: «Am liebsten tanze ich». «Не люблю» — nicht gern.',
      'gern сөзү этиштен кийин коюлат жана эмне кылууну жакшы көрөрүңүздү билдирет: «Ich spiele gern Fußball». Бир нерсени көбүрөөк жакшы көрсөңүз, lieber колдонулат: «Ich schwimme lieber». Баарынан көп — am liebsten: «Am liebsten tanze ich». Бул gern – lieber – am liebsten катары (өзгөчө форма, 13-бөлүмдөгү gut – besser – am besten сыяктуу). Эки ишти салыштыруу үчүн lieber … als алынат: «Ich lese lieber Bücher als Zeitungen». am liebsten сүйлөмдүн башында турса, этиш экинчи орунда калат: «Am liebsten tanze ich». «Жакшы көрбөйм» — nicht gern.',
    ),
    discover: l(
      'Сравните: «Ich spiele gern Fußball», «Ich schwimme lieber» и «Am liebsten tanze ich». Какое слово стоит где? Что случилось с подлежащим «ich» в третьем предложении?',
      '«Ich spiele gern Fußball», «Ich schwimme lieber» жана «Am liebsten tanze ich» деген сүйлөмдөрдү салыштырыңыз. Кайсы сөз кайда турат? Үчүнчү сүйлөмдө «ich» ээси менен эмне болду?',
    ),
    why: l(
      'Когда вы знакомитесь, говорите о выходных или выбираете, что делать вместе, вам нужно сказать, что вы любите и что любите больше. Эти три слова — самый короткий способ. Вы уже знаете сравнение из юнита 13: lieber работает так же, как «-er», только особая форма.',
      'Таанышканда, дем алыш күндөрү жөнүндө сүйлөгөндө же чогуу эмне кылууну тандаганда эмнени жакшы көрөрүңүздү жана эмнени көбүрөөк жакшы көрөрүңүздү айтышыңыз керек. Бул үч сөз — эң кыска жол. Салыштырууну 13-бөлүмдөн билесиз: lieber «-er» сыяктуу эле иштейт, бирок өзгөчө форма.',
    ),
    when: [
      l(
        'gern — после глагола: Ich tanze gern. Ich spiele gern Fußball. Отрицание: Ich lese nicht gern.',
        'gern — этиштен кийин: Ich tanze gern. Ich spiele gern Fußball. Четтөө: Ich lese nicht gern.',
      ),
      l(
        'lieber — «больше»: Ich schwimme lieber. Сравнение двух занятий: Ich gehe lieber ins Kino als ins Theater.',
        'lieber — «көбүрөөк»: Ich schwimme lieber. Эки ишти салыштыруу: Ich gehe lieber ins Kino als ins Theater.',
      ),
      l(
        'am liebsten — «больше всего»: Am liebsten wandere ich. Глагол стоит вторым.',
        'am liebsten — «баарынан көп»: Am liebsten wandere ich. Этиш экинчи орунда турат.',
      ),
      l(
        'Сравнение вещей (юнит 13) — besser als: Der Film ist besser als das Buch.',
        'Нерселерди салыштыруу (13-бөлүм) — besser als: Der Film ist besser als das Buch.',
      ),
    ],
    examples: [
      { de: 'Ich spiele gern Fußball.', ru: 'Я люблю играть в футбол.', ky: 'Мен футбол ойногонду жакшы көрөм.', focus: 'gern' },
      { de: 'Ich schwimme lieber.', ru: 'Я больше люблю плавать.', ky: 'Мен сүзгөндү көбүрөөк жакшы көрөм.', focus: 'lieber' },
      { de: 'Am liebsten tanze ich.', ru: 'Больше всего я люблю танцевать.', ky: 'Баарынан көп мен бийлегенди жакшы көрөм.', focus: 'am liebsten (глагол вторым)' },
      { de: 'Ich lese lieber Bücher als Zeitungen.', ru: 'Я больше люблю читать книги, чем газеты.', ky: 'Мен гезитке караганда китеп окугандыкты көбүрөөк жакшы көрөм.', focus: 'lieber … als' },
      { de: 'Ich gehe nicht gern ins Theater.', ru: 'Я не люблю ходить в театр.', ky: 'Мен театрга барганды жактырбайм.', focus: 'nicht gern' },
      { de: 'Der Film ist besser als das Buch.', ru: 'Фильм лучше, чем книга.', ky: 'Тасма китептен жакшыраак.', focus: 'besser als (юнит 13)' },
    ],
    mistakes: [
      {
        wrong: 'Ich gern spiele Fußball.',
        right: 'Ich spiele gern Fußball.',
        note: l(
          'Gern стоит после глагола, а не перед ним.',
          'Gern этиштен кийин турат, андан мурун эмес.',
        ),
      },
      {
        wrong: 'Am liebsten ich tanze.',
        right: 'Am liebsten tanze ich.',
        note: l(
          'Если в начале стоит am liebsten, то глагол остаётся на втором месте, а ich идёт после него.',
          'Башында am liebsten турса, этиш экинчи орунда калат, ал эми ich андан кийин келет.',
        ),
      },
      {
        wrong: 'Ich lese mehr gern Bücher.',
        right: 'Ich lese lieber Bücher.',
        note: l(
          'У gern особая форма: lieber. Нельзя говорить «mehr gern».',
          'gern сөзүнүн өзгөчө формасы бар: lieber. «mehr gern» деп айтууга болбойт.',
        ),
      },
      {
        wrong: 'Ich gehe lieber ins Kino wie ins Theater.',
        right: 'Ich gehe lieber ins Kino als ins Theater.',
        note: l(
          'После lieber «чем» передаёт als, как и после других форм сравнения.',
          'lieber сөзүнөн кийин «…дан» маанисин башка салыштыруу формаларындагыдай эле als берет.',
        ),
      },
    ],
    reallife: [
      { de: 'Was machst du am liebsten am Wochenende?', ru: 'Что ты больше всего любишь делать на выходных?', ky: 'Дем алыш күндөрү сен эмнени баарынан көп жакшы көрөсүң?', focus: 'am liebsten' },
      { de: 'Ich höre gern Musik, aber ich tanze lieber.', ru: 'Я люблю слушать музыку, но больше люблю танцевать.', ky: 'Мен музыка угууну жакшы көрөм, бирок бийлегенди көбүрөөк жакшы көрөм.', focus: 'gern / lieber' },
      { de: 'Gehen wir ins Kino oder lieber ins Café?', ru: 'Пойдём в кино или лучше в кафе?', ky: 'Кинотеатрга барабызбы же кафеге барганыбыз жакшыбы?', focus: 'lieber' },
    ],
    dialogue: [
      { speaker: 'Jonas', text: 'Was machst du gern in deiner Freizeit?', ru: 'Что ты любишь делать в свободное время?', ky: 'Бош убактыңда сен эмнени жасаганды жакшы көрөсүң?' },
      { speaker: 'Lea', text: 'Ich lese gern, aber ich tanze lieber.', ru: 'Я люблю читать, но больше люблю танцевать.', ky: 'Мен окуганды жакшы көрөм, бирок бийлегенди көбүрөөк жакшы көрөм.' },
      { speaker: 'Jonas', text: 'Und am liebsten?', ru: 'А больше всего?', ky: 'Ал эми баарынан көпбү?' },
      { speaker: 'Lea', text: 'Am liebsten gehe ich mit Freunden wandern.', ru: 'Больше всего я люблю ходить в поход с друзьями.', ky: 'Баарынан көп мен достор менен жөө жүргөндү жакшы көрөм.' },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите о своих занятиях: что вы любите, что любите больше и что — больше всего.',
        'Өзүңүздүн ишиңиз жөнүндө айтып бериңиз: эмнени жакшы көрөрүңүздү, эмнени көбүрөөк жана эмнени баарынан көп жакшы көрөрүңүздү.',
      ),
      sample: 'Ich spiele gern Fußball. Ich schwimme lieber. Am liebsten tanze ich.',
      keywords: ['gern', 'lieber', 'am liebsten'],
    },
    source: UNIT_16_SOURCE,
  },
  {
    id: 'a2-verben-mit-praepositionen',
    category: 'prepositions',
    level: 'A2',
    unit: 16,
    visual: 'prepositions',
    title: l('Шесть глаголов с предлогом: interessieren für, freuen auf / über, warten auf, sprechen über, denken an', 'Предлогдуу алты этиш: interessieren für, freuen auf / über, warten auf, sprechen über, denken an'),
    summary: l(
      'Некоторые глаголы всегда идут с одним и тем же предлогом, и после предлога стоит Akkusativ. Выучите шесть пар целиком: sich interessieren für (интересоваться), sich freuen auf (радоваться чему-то будущему), sich freuen über (радоваться чему-то, что есть или было), warten auf (ждать), sprechen über (говорить о), denken an (думать о). Примеры: «Ich interessiere mich für Sport», «Ich freue mich auf das Konzert», «Ich warte auf den Bus». Предлог не выводят из русского или кыргызского: каждую пару нужно выучить как слово.',
      'Кээ бир этиштер ар дайым бир эле предлог менен колдонулат жана предлогдон кийин Akkusativ турат. Алты жуптун баарын бүтүндөй үйрөнүңүз: sich interessieren für (кызыгуу), sich freuen auf (келе турган нерсеге кубануу), sich freuen über (бар же болгон нерсеге кубануу), warten auf (күтүү), sprechen über (…жөнүндө сүйлөө), denken an (…жөнүндө ойлонуу). Мисалдар: «Ich interessiere mich für Sport», «Ich freue mich auf das Konzert», «Ich warte auf den Bus». Предлогду орус же кыргыз тилинен чыгарууга болбойт: ар бир жупту сөз катары жаттоо керек.',
    ),
    discover: l(
      'Сравните: «Ich warte auf den Bus» и «Ich warte auf dem Bus». Какое предложение верное и почему? Какой артикль стоит после предлога?',
      '«Ich warte auf den Bus» жана «Ich warte auf dem Bus» деген сүйлөмдөрдү салыштырыңыз. Кайсы сүйлөм туура жана эмне үчүн? Предлогдон кийин кандай артикль турат?',
    ),
    why: l(
      'Когда вы говорите о своих интересах, ожиданиях и планах, вам нужны именно эти глаголы: «Ich interessiere mich für Fotos», «Ich freue mich auf das Wochenende». Если выбрать другой предлог, вас поймут, но фраза прозвучит неверно. Шесть пар — это небольшой набор, который реально выучить.',
      'Кызыкчылыктарыңыз, күтүүлөрүңүз жана пландарыңыз жөнүндө сүйлөгөндө сизге дал ушул этиштер керек: «Ich interessiere mich für Fotos», «Ich freue mich auf das Wochenende». Башка предлогду тандасаңыз, сизди түшүнөт, бирок сүйлөм туура эмес угулат. Алты жуп — чындап жаттоого мүмкүн болгон кичинекей топтом.',
    ),
    when: [
      l(
        'interessieren für, freuen auf / über, warten auf, sprechen über, denken an — после предлога всегда Akkusativ.',
        'interessieren für, freuen auf / über, warten auf, sprechen über, denken an — предлогдон кийин ар дайым Akkusativ.',
      ),
      l(
        'sich freuen auf — предстоящее: Ich freue mich auf den Urlaub. sich freuen über — то, что есть или было: Ich freue mich über das Geschenk.',
        'sich freuen auf — келе турган нерсе: Ich freue mich auf den Urlaub. sich freuen über — бар же болгон нерсе: Ich freue mich über das Geschenk.',
      ),
      l(
        'Возвратные глаголы (юнит 12): местоимение подходит к лицу — Ich interessiere mich, du interessierst dich, wir freuen uns.',
        'Өздүк этиштер (12-бөлүм): ат атооч жакка туура келет — Ich interessiere mich, du interessierst dich, wir freuen uns.',
      ),
      l(
        'Артикль в Akkusativ: der → den (auf den Bus), die → die (auf die Ausstellung), das → das (auf das Konzert).',
        'Akkusativдеги артикль: der → den (auf den Bus), die → die (auf die Ausstellung), das → das (auf das Konzert).',
      ),
    ],
    examples: [
      { de: 'Ich interessiere mich für Sport.', ru: 'Я интересуюсь спортом.', ky: 'Мен спортко кызыгам.', focus: 'sich interessieren für' },
      { de: 'Ich freue mich auf das Konzert.', ru: 'Я радуюсь предстоящему концерту.', ky: 'Мен концертке кубанып жатам.', focus: 'sich freuen auf' },
      { de: 'Ich freue mich über das Foto.', ru: 'Я рад этой фотографии.', ky: 'Мен бул сүрөткө кубандым.', focus: 'sich freuen über' },
      { de: 'Ich warte auf den Bus.', ru: 'Я жду автобус.', ky: 'Мен автобусту күтүп жатам.', focus: 'warten auf + Akkusativ' },
      { de: 'Wir sprechen über den Film.', ru: 'Мы говорим о фильме.', ky: 'Биз тасма жөнүндө сүйлөшүп жатабыз.', focus: 'sprechen über' },
      { de: 'Ich denke oft an die Ferien.', ru: 'Я часто думаю об отпуске.', ky: 'Мен тез-тез эс алууну ойлойм.', focus: 'denken an' },
    ],
    mistakes: [
      {
        wrong: 'Ich interessiere mich an Sport.',
        right: 'Ich interessiere mich für Sport.',
        note: l(
          'Sich interessieren всегда идёт с für.',
          'Sich interessieren ар дайым für менен колдонулат.',
        ),
      },
      {
        wrong: 'Ich warte auf dem Bus.',
        right: 'Ich warte auf den Bus.',
        note: l(
          'После warten auf стоит Akkusativ: den Bus, а не dem Bus.',
          'warten auf сөзүнөн кийин Akkusativ турат: dem Bus эмес, den Bus.',
        ),
      },
      {
        wrong: 'Ich freue mich über das Wochenende.',
        right: 'Ich freue mich auf das Wochenende.',
        note: l(
          'О чём-то будущем говорят с auf, а über — о том, что уже есть или было.',
          'Келечектеги нерсе жөнүндө auf менен айтылат, ал эми über — бар же болгон нерсе жөнүндө.',
        ),
      },
      {
        wrong: 'Ich denke auf dich.',
        right: 'Ich denke an dich.',
        note: l(
          'Denken идёт с предлогом an, и после него — Akkusativ (an dich).',
          'Denken an предлогу менен колдонулат, андан кийин Akkusativ турат (an dich).',
        ),
      },
    ],
    reallife: [
      { de: 'Interessierst du dich für Filme?', ru: 'Ты интересуешься фильмами?', ky: 'Сен тасмаларга кызыгасыңбы?', focus: 'interessierst du dich für' },
      { de: 'Wir warten auf dich vor dem Kino.', ru: 'Мы ждём тебя у кинотеатра.', ky: 'Биз сени кинотеатрдын алдында күтүп жатабыз.', focus: 'warten auf dich' },
      { de: 'Ich freue mich auf Samstag.', ru: 'Я жду субботы.', ky: 'Мен ишембини күтүп жатам.', focus: 'freue mich auf' },
    ],
    dialogue: [
      { speaker: 'Tim', text: 'Interessierst du dich für Fotos?', ru: 'Ты интересуешься фотографией?', ky: 'Сен сүрөткө тартууга кызыгасыңбы?' },
      { speaker: 'Mia', text: 'Ja! Ich freue mich auf die Ausstellung am Samstag.', ru: 'Да! Я жду выставку в субботу.', ky: 'Ооба! Мен ишемби күнкү көргөзмөгө кубанып жатам.' },
      { speaker: 'Tim', text: 'Wir sprechen nach der Arbeit über die Ausstellung, okay?', ru: 'Давай поговорим о выставке после работы, хорошо?', ky: 'Жумуштан кийин көргөзмө жөнүндө сүйлөшөлү, макулбу?' },
      { speaker: 'Mia', text: 'Gern. Ich warte auf dich vor dem Museum.', ru: 'С удовольствием. Я жду тебя у музея.', ky: 'Кубанам. Мен сени музейдин алдында күтөм.' },
    ],
    speakPrompt: {
      prompt: l(
        'Скажите, чем вы интересуетесь, чего вы ждёте и на что радуетесь: два-три предложения.',
        'Эмнеге кызыгарыңызды, эмнени күтүп жатканыңызды жана эмнеге кубанып жатканыңызды айтыңыз: эки-үч сүйлөм.',
      ),
      sample: 'Ich interessiere mich für Fotos. Ich freue mich auf das Wochenende. Ich warte auf den Bus.',
      keywords: ['interessiere mich für', 'freue mich auf', 'warte auf'],
    },
    source: UNIT_16_SOURCE,
  },
  {
    id: 'a2-ordinalzahlen-datum',
    category: 'wordorder',
    level: 'A2',
    unit: 16,
    visual: 'timeline',
    title: l('Порядковые числительные и дата: am dritten Mai', 'Иреттик сан атоочтор жана дата: am dritten Mai'),
    summary: l(
      'Порядковое число показывает порядок: «первый, второй, третий». Для даты нужны числа от 1 до 31. Формы: 1. erste, 2. zweite, 3. dritte, 7. siebte, 8. achte (особые), 4.–19. — число + -te (vierte, zwölfte, neunzehnte), 20.–31. — число + -ste (zwanzigste, dreißigste, einunddreißigste). На письме после цифры ставится точка: 3. Mai. На вопрос «когда?» говорят am + порядковое число с окончанием -n: «am dritten Mai», «am ersten Juni» (am 3. Mai). Если речь о том, какое сегодня число, окончание -e: «Heute ist der dritte Mai». Порядковые числительные выше 31 здесь не нужны.',
      'Иреттик сан иретти көрсөтөт: «биринчи, экинчи, үчүнчү». Дата үчүн 1ден 31ге чейинки сандар керек. Формалар: 1. erste, 2. zweite, 3. dritte, 7. siebte, 8. achte (өзгөчө), 4.–19. — сан + -te (vierte, zwölfte, neunzehnte), 20.–31. — сан + -ste (zwanzigste, dreißigste, einunddreißigste). Жазууда цифрадан кийин чекит коюлат: 3. Mai. «Качан?» деген суроого am + иреттик сан -n аякталышы менен айтылат: «am dritten Mai», «am ersten Juni» (am 3. Mai). Бүгүн кайсы күн экенин айтканда аякталыш -e: «Heute ist der dritte Mai». 31ден жогорку иреттик сандар бул жерде керек эмес.',
    ),
    discover: l(
      'Сравните: «Heute ist der dritte Mai» и «Das Konzert ist am dritten Mai». Что изменилось в окончании слова dritte и почему?',
      '«Heute ist der dritte Mai» жана «Das Konzert ist am dritten Mai» деген сүйлөмдөрдү салыштырыңыз. dritte сөзүнүн аякталышы эмне болуп өзгөрдү жана эмне үчүн?',
    ),
    why: l(
      'Билеты, афиши, праздники и приглашения всегда содержат дату. Без порядкового числительного вы не сможете сказать, когда концерт, и не поймёте афишу. Правило короткое: -te до 19, -ste с 20, а после am — окончание -n.',
      'Билеттер, афишалар, майрамдар жана чакырыктардын баары датаны камтыйт. Иреттик сансыз концерт качан экенин айта албайсыз жана афишаны түшүнбөйсүз. Эреже кыска: 19га чейин -te, 20дан баштап -ste, ал эми am сөзүнөн кийин -n аякталышы.',
    ),
    when: [
      l(
        'Особые формы: 1. der erste, 3. der dritte, 7. der siebte, 8. der achte.',
        'Өзгөчө формалар: 1. der erste, 3. der dritte, 7. der siebte, 8. der achte.',
      ),
      l(
        '2.–19.: число + -te (zweite, vierte, zwölfte, neunzehnte). 20.–31.: число + -ste (zwanzigste, einunddreißigste).',
        '2.–19.: сан + -te (zweite, vierte, zwölfte, neunzehnte). 20.–31.: сан + -ste (zwanzigste, einunddreißigste).',
      ),
      l(
        'Когда? — am + окончание -n: Das Konzert ist am zwölften Mai. Am dritten Mai habe ich Zeit.',
        'Качан? — am + -n аякталышы: Das Konzert ist am zwölften Mai. Am dritten Mai habe ich Zeit.',
      ),
      l(
        'Какое сегодня число? — der + окончание -e: Heute ist der dritte Mai. Цифрами: Heute ist der 3. Mai.',
        'Бүгүн кайсы күн? — der + -e аякталышы: Heute ist der dritte Mai. Цифра менен: Heute ist der 3. Mai.',
      ),
    ],
    examples: [
      { de: 'Heute ist der erste Mai.', ru: 'Сегодня первое мая.', ky: 'Бүгүн май айынын биринчиси.', focus: 'der erste' },
      { de: 'Das Konzert ist am dritten Mai.', ru: 'Концерт — третьего мая.', ky: 'Концерт 3-майда.', focus: 'am dritten' },
      { de: 'Die Ausstellung beginnt am zwölften Juni.', ru: 'Выставка начинается двенадцатого июня.', ky: 'Көргөзмө 12-июнда башталат.', focus: 'am zwölften (-te + -n)' },
      { de: 'Mein Geburtstag ist am zwanzigsten Juli.', ru: 'Мой день рождения двадцатого июля.', ky: 'Менин туулган күнүм 20-июлда.', focus: 'am zwanzigsten (-ste + -n)' },
      { de: 'Am 7. August gehe ich ins Theater.', ru: 'Седьмого августа я иду в театр.', ky: '7-августта мен театрга барам.', focus: 'am 7. (читается am siebten)' },
    ],
    mistakes: [
      {
        wrong: 'Das Konzert ist am drei Mai.',
        right: 'Das Konzert ist am dritten Mai.',
        note: l(
          'В дате нужно порядковое число, а не количественное: dritten, а не drei.',
          'Датада санак эмес, иреттик сан керек: drei эмес, dritten.',
        ),
      },
      {
        wrong: 'Das Konzert ist am dritte Mai.',
        right: 'Das Konzert ist am dritten Mai.',
        note: l(
          'После am окончание -n: am dritten Mai.',
          'am сөзүнөн кийин -n аякталышы: am dritten Mai.',
        ),
      },
      {
        wrong: 'Das Fest ist am zwanzigten Juni.',
        right: 'Das Fest ist am zwanzigsten Juni.',
        note: l(
          'С 20-го числа добавляют -ste, а не -te: zwanzigsten.',
          '20дан баштап -te эмес, -ste кошулат: zwanzigsten.',
        ),
      },
      {
        wrong: 'Heute ist der siebente Mai.',
        right: 'Heute ist der siebte Mai.',
        note: l(
          'У 7. особая форма: siebte (не siebente).',
          '7. санынын өзгөчө формасы бар: siebte (siebente эмес).',
        ),
      },
    ],
    reallife: [
      { de: 'Wann ist das Konzert? – Am zwölften Mai.', ru: 'Когда концерт? — Двенадцатого мая.', ky: 'Концерт качан? — 12-майда.', focus: 'am zwölften' },
      { de: 'Welcher Tag ist heute? – Heute ist der 3. Mai.', ru: 'Какое сегодня число? — Сегодня 3 мая.', ky: 'Бүгүн кайсы күн? — Бүгүн 3-май.', focus: 'der 3.' },
      { de: 'Die Karten gibt es bis zum 10. Mai.', ru: 'Билеты есть до 10 мая.', ky: 'Билеттер 10-майга чейин бар.', focus: 'bis zum 10.' },
    ],
    dialogue: [
      { speaker: 'Lea', text: 'Wann ist das Konzert?', ru: 'Когда концерт?', ky: 'Концерт качан?' },
      { speaker: 'Jonas', text: 'Am dritten Mai um 20 Uhr.', ru: 'Третьего мая в 20 часов.', ky: '3-майда саат 20да.' },
      { speaker: 'Lea', text: 'Und die Ausstellung?', ru: 'А выставка?', ky: 'Ал эми көргөзмө?' },
      { speaker: 'Jonas', text: 'Sie beginnt am zwölften Mai.', ru: 'Она начинается двенадцатого мая.', ky: 'Ал 12-майда башталат.' },
    ],
    speakPrompt: {
      prompt: l(
        'Назовите дату своего дня рождения и дату одного события, которого вы ждёте.',
        'Туулган күнүңүздүн датасын жана күтүп жаткан бир иш-чаранын датасын атаңыз.',
      ),
      sample: 'Mein Geburtstag ist am zwanzigsten Juli. Das Konzert ist am dritten Mai.',
      keywords: ['am zwanzigsten', 'am dritten'],
    },
    source: UNIT_16_SOURCE,
  },
]

/** "Why?" notes of Unit 16. */
export const UNIT_16_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Am liebsten tanze ich.',
    ru: 'Больше всего я люблю танцевать.',
    ky: 'Баарынан көп мен бийлегенди жакшы көрөм.',
    word: 'tanze',
    conceptId: 'a2-gern-lieber-am-liebsten',
    reason: l(
      'Предложение начинается с am liebsten, поэтому глагол tanze остаётся вторым, а подлежащее ich стоит после него.',
      'Сүйлөм am liebsten менен башталат, ошондуктан tanze этиши экинчи орунда калат, ал эми ээси ich андан кийин турат.',
    ),
    more: [
      { de: 'Ich spiele gern Fußball.', ru: 'Я люблю играть в футбол.', ky: 'Мен футбол ойногонду жакшы көрөм.' },
      { de: 'Ich schwimme lieber.', ru: 'Я больше люблю плавать.', ky: 'Мен сүзгөндү көбүрөөк жакшы көрөм.' },
    ],
  },
  {
    sentence: 'Ich lese lieber Bücher als Zeitungen.',
    ru: 'Я больше люблю читать книги, чем газеты.',
    ky: 'Мен гезитке караганда китеп окугандыкты көбүрөөк жакшы көрөм.',
    word: 'lieber',
    conceptId: 'a2-gern-lieber-am-liebsten',
    reason: l(
      'Lieber — форма сравнения от gern (как besser от gut). Для сравнения двух занятий после lieber ставится als.',
      'Lieber — gern сөзүнүн салыштыруу формасы (gut сөзүнөн besser сыяктуу). Эки ишти салыштырууда lieber сөзүнөн кийин als коюлат.',
    ),
    more: [
      { de: 'Der Film ist besser als das Buch.', ru: 'Фильм лучше, чем книга.', ky: 'Тасма китептен жакшыраак.' },
      { de: 'Ich gehe lieber ins Kino als ins Theater.', ru: 'Я больше люблю ходить в кино, чем в театр.', ky: 'Мен театрга караганда кинотеатрга барганды көбүрөөк жакшы көрөм.' },
    ],
  },
  {
    sentence: 'Ich warte auf den Bus.',
    ru: 'Я жду автобус.',
    ky: 'Мен автобусту күтүп жатам.',
    word: 'den',
    conceptId: 'a2-verben-mit-praepositionen',
    reason: l(
      'Warten идёт с предлогом auf, и после этой пары стоит Akkusativ: der Bus → den Bus.',
      'Warten auf предлогу менен колдонулат жана бул жуптан кийин Akkusativ турат: der Bus → den Bus.',
    ),
    more: [
      { de: 'Ich interessiere mich für Sport.', ru: 'Я интересуюсь спортом.', ky: 'Мен спортко кызыгам.' },
      { de: 'Wir sprechen über den Film.', ru: 'Мы говорим о фильме.', ky: 'Биз тасма жөнүндө сүйлөшүп жатабыз.' },
    ],
  },
  {
    sentence: 'Ich freue mich auf das Konzert.',
    ru: 'Я радуюсь предстоящему концерту.',
    ky: 'Мен концертке кубанып жатам.',
    word: 'auf',
    conceptId: 'a2-verben-mit-praepositionen',
    reason: l(
      'Sich freuen auf говорит о чём-то будущем (концерт ещё впереди). О том, что есть или было, говорят sich freuen über. Местоимение mich подходит к подлежащему ich.',
      'Sich freuen auf келе турган нерсе жөнүндө айтат (концерт али алдыда). Бар же болгон нерсе жөнүндө sich freuen über колдонулат. mich ат атоочу ich ээсине туура келет.',
    ),
    more: [
      { de: 'Ich freue mich über das Foto.', ru: 'Я рад этой фотографии.', ky: 'Мен бул сүрөткө кубандым.' },
      { de: 'Wir freuen uns auf Samstag.', ru: 'Мы ждём субботы.', ky: 'Биз ишембини күтүп жатабыз.' },
    ],
  },
  {
    sentence: 'Das Konzert ist am dritten Mai.',
    ru: 'Концерт — третьего мая.',
    ky: 'Концерт 3-майда.',
    word: 'dritten',
    conceptId: 'a2-ordinalzahlen-datum',
    reason: l(
      'Для даты нужно порядковое число: drei → dritte. После am (на вопрос «когда?») к нему добавляется окончание -n: am dritten Mai. Цифрами пишут: am 3. Mai.',
      'Дата үчүн иреттик сан керек: drei → dritte. am сөзүнөн кийин («качан?» деген суроого) ага -n аякталышы кошулат: am dritten Mai. Цифра менен: am 3. Mai.',
    ),
    more: [
      { de: 'Heute ist der erste Mai.', ru: 'Сегодня первое мая.', ky: 'Бүгүн май айынын биринчиси.' },
      { de: 'Mein Geburtstag ist am zwanzigsten Juli.', ru: 'Мой день рождения двадцатого июля.', ky: 'Менин туулган күнүм 20-июлда.' },
    ],
  },
]
