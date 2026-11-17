import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_12_SOURCE } from '../provenance'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 12 grammar (Stage 7C). Two concepts, deliberately of unequal depth (decision of the Stage 7C brief and the Stage 7B audit):
 *  1. `a2-personalpronomen-dativverben` — the MAIN concept: personal pronouns in Akkusativ and Dativ, with a small set of Dativ verbs.
 *  2. `a2-reflexive-verben` — a SMALLER concept: reflexive pronoun (Akkusativ forms only) with a closed set of verbs.
 * Not taught here: pronoun–pronoun order, reflexive Dativ, the imperative as a paradigm (only the fixed expressions of the unit's chunk list).
 */
export const UNIT_12_GRAMMAR: GrammarConcept[] = [
  {
    id: 'a2-personalpronomen-dativverben',
    category: 'pronouns',
    level: 'A2',
    unit: 12,
    visual: 'cases',
    title: l('Личные местоимения в Akkusativ и Dativ — и глаголы с Dativ', 'Akkusativ жана Dativ формасындагы ат атоочтор жана Dativ талап кылган этиштер'),
    summary: l(
      'Когда вы говорите о людях, вам нужны местоимения «меня, тебя, его, ей…». В немецком у них две формы: Akkusativ (mich, dich, ihn, sie, es, uns, euch, sie, Sie) и Dativ (mir, dir, ihm, ihr, ihm, uns, euch, ihnen, Ihnen). Большинство глаголов берут Akkusativ (lieben, besuchen, anrufen). Несколько важных глаголов берут Dativ: helfen, gehören, gefallen, schenken, geben, zeigen. Человек — это Dativ, вещь — Akkusativ: «Ich schenke ihr ein Buch».',
      'Адамдар жөнүндө сүйлөгөндө «мени, сени, аны, ага…» деген ат атоочтор керек. Немис тилинде алардын эки формасы бар: Akkusativ (mich, dich, ihn, sie, es, uns, euch, sie, Sie) жана Dativ (mir, dir, ihm, ihr, ihm, uns, euch, ihnen, Ihnen). Көпчүлүк этиштер Akkusativ алат (lieben, besuchen, anrufen). Бир нече маанилүү этиш Dativ талап кылат: helfen, gehören, gefallen, schenken, geben, zeigen. Адам — Dativ, нерсе — Akkusativ: «Ich schenke ihr ein Buch».',
    ),
    discover: l(
      'Сравните: «Ich rufe dich an» и «Ich helfe dir». В обоих предложениях вы обращаетесь к одному и тому же человеку. Почему в первом dich, а во втором dir?',
      '«Ich rufe dich an» жана «Ich helfe dir» деген сүйлөмдөрдү салыштырыңыз. Экөөндө тең сиз бир эле адамга кайрылып жатасыз. Эмне үчүн биринчисинде dich, экинчисинде dir?',
    ),
    why: l(
      'Каждый разговор о семье и друзьях — это «я и другие»: я звоню им, помогаю им, дарю им, они нравятся мне. Без местоимений в Akkusativ и Dativ вы не сможете сказать, кто что делает для кого. Вам не нужно учить всю таблицу сразу: начните с ich/du/er/sie и с шести глаголов.',
      'Үй-бүлө жана достор жөнүндө ар бир сүйлөшүү — «мен жана башкалар»: мен аларга чалам, жардам берем, белек кылам, алар мага жагат. Akkusativ жана Dativ ат атоочтору болбосо, ким кимге эмне кылганын айта албайсыз. Бардык таблицаны бир учурда жаттоонун кереги жок: ich/du/er/sie менен жана алты этиштен баштаңыз.',
    ),
    when: [
      l(
        'Akkusativ после большинства глаголов: Ich liebe dich. Ich besuche ihn. Ich rufe sie an.',
        'Көпчүлүк этиштерден кийин Akkusativ: Ich liebe dich. Ich besuche ihn. Ich rufe sie an.',
      ),
      l(
        'Dativ после helfen, gehören, gefallen: Ich helfe dir. Das Fahrrad gehört ihm. Die Jacke gefällt mir.',
        'helfen, gehören, gefallen этиштеринен кийин Dativ: Ich helfe dir. Das Fahrrad gehört ihm. Die Jacke gefällt mir.',
      ),
      l(
        'Dativ и после предлогов, которые вы знаете из A1: mit ihm, bei ihr, zu uns.',
        'A1 деңгээлинен билген предлогдордон кийин да Dativ: mit ihm, bei ihr, zu uns.',
      ),
      l(
        'С двумя дополнениями (schenken, geben, zeigen) человек в Dativ стоит перед вещью в Akkusativ: Ich schenke ihm ein Buch. Ich zeige meiner Mutter das Foto.',
        'Эки толуктоочу болгондо (schenken, geben, zeigen) Dativ формасындагы адам Akkusativ формасындагы нерседен мурун турат: Ich schenke ihm ein Buch. Ich zeige meiner Mutter das Foto.',
      ),
    ],
    examples: [
      { de: 'Ich rufe ihn heute an.', ru: 'Я сегодня позвоню ему.', ky: 'Мен бүгүн ага чалам.', focus: 'ihn (Akkusativ)' },
      { de: 'Ich helfe dir gern.', ru: 'Я с удовольствием тебе помогу.', ky: 'Мен сага кубанып жардам берем.', focus: 'dir (Dativ)' },
      { de: 'Das Fahrrad gehört meinem Bruder.', ru: 'Велосипед принадлежит моему брату.', ky: 'Велосипед менин агамдыкы.', focus: 'meinem Bruder (Dativ)' },
      { de: 'Die Jacke gefällt mir.', ru: 'Куртка мне нравится.', ky: 'Куртка мага жагат.', focus: 'mir (Dativ)' },
      { de: 'Ich schenke meiner Mutter Blumen.', ru: 'Я дарю маме цветы.', ky: 'Мен апама гүл белек кылам.', focus: 'meiner Mutter (Dativ) + Blumen (Akkusativ)' },
    ],
    mistakes: [
      {
        wrong: 'Ich helfe dich.',
        right: 'Ich helfe dir.',
        note: l(
          'Helfen всегда требует Dativ, поэтому dir, а не dich.',
          'helfen этиши ар дайым Dativ талап кылат, ошондуктан dich эмес, dir.',
        ),
      },
      {
        wrong: 'Ich rufe ihm an.',
        right: 'Ich rufe ihn an.',
        note: l(
          'Anrufen берёт Akkusativ: звоним «кого?» — ihn. Dativ нужен только у особых глаголов (helfen, gehören, gefallen …).',
          'anrufen этиши Akkusativ алат: «кимди?» — ihn. Dativ өзгөчө этиштерде гана керек (helfen, gehören, gefallen …).',
        ),
      },
      {
        wrong: 'Das Buch gehört ich.',
        right: 'Das Buch gehört mir.',
        note: l(
          'После gehören нужен Dativ: mir. Форма ich — это только подлежащее.',
          'gehören этишинен кийин Dativ керек: mir. ich формасы — бул ээ гана.',
        ),
      },
      {
        wrong: 'Er schenkt ein Buch ihm.',
        right: 'Er schenkt ihm ein Buch.',
        note: l(
          'Если вещь названа существительным, человек (Dativ) ставится раньше: Er schenkt ihm ein Buch.',
          'Эгер нерсе зат атооч менен аталса, адам (Dativ) мурун келет: Er schenkt ihm ein Buch.',
        ),
      },
    ],
    reallife: [
      { de: 'Kannst du mir bitte helfen?', ru: 'Ты можешь мне помочь?', ky: 'Мага жардам бере аласыңбы?', focus: 'mir' },
      { de: 'Wie geht es dir?', ru: 'Как у тебя дела?', ky: 'Иштериң кандай?', focus: 'dir' },
      { de: 'Ich besuche dich am Wochenende.', ru: 'Я навещу тебя на выходных.', ky: 'Дем алыш күндөрү сага барам.', focus: 'dich' },
    ],
    dialogue: [
      { speaker: 'Mira', text: 'Hast du Zeit? Ich brauche deine Hilfe.', ru: 'У тебя есть время? Мне нужна твоя помощь.', ky: 'Убактың барбы? Мага сенин жардамың керек.' },
      { speaker: 'Tom', text: 'Klar, ich helfe dir gern. Was ist los?', ru: 'Конечно, я с радостью помогу. Что случилось?', ky: 'Албетте, мен сага кубанып жардам берем. Эмне болду?' },
      { speaker: 'Mira', text: 'Mein Bruder hat Geburtstag. Ich möchte ihm etwas schenken.', ru: 'У моего брата день рождения. Я хочу ему что-нибудь подарить.', ky: 'Менин агамдын туулган күнү. Мен ага бир нерсе белек кылгым келет.' },
      { speaker: 'Tom', text: 'Ich kenne ihn doch. Ihm gefallen Bücher.', ru: 'Я же его знаю. Ему нравятся книги.', ky: 'Мен аны билем го. Ага китептер жагат.' },
    ],
    speakPrompt: {
      prompt: l(
        'Скажите, кому вы что дарите и кому помогаете. Используйте три глагола: schenken, helfen, anrufen.',
        'Кимге эмне белек кылаарыңызды жана кимге жардам берээриңизди айтыңыз. Үч этишти колдонуңуз: schenken, helfen, anrufen.',
      ),
      sample: 'Ich schenke meiner Mutter Blumen. Ich helfe meinem Bruder oft. Ich rufe meine Freundin jeden Tag an.',
      keywords: ['schenke', 'helfe', 'rufe', 'meiner', 'meinem'],
    },
    source: UNIT_12_SOURCE,
  },

  {
    id: 'a2-reflexive-verben',
    category: 'verbs',
    level: 'A2',
    unit: 12,
    visual: 'conjugation',
    title: l('Возвратные глаголы: sich treffen, sich verstehen …', 'Өздүк этиштер: sich treffen, sich verstehen …'),
    summary: l(
      'Некоторые глаголы всегда идут с «sich»: sich treffen, sich kennenlernen, sich verstehen, sich streiten. Местоимение меняется по лицам: ich — mich, du — dich, er/sie/es — sich, wir — uns, ihr — euch, sie/Sie — sich. Оно стоит сразу после глагола; в Perfekt — после вспомогательного глагола: «Wir haben uns im Deutschkurs kennengelernt». Вспомогательный глагол в Perfekt у этих глаголов — haben.',
      'Кээ бир этиштер дайыма «sich» менен жүрөт: sich treffen, sich kennenlernen, sich verstehen, sich streiten. Ат атооч жак боюнча өзгөрөт: ich — mich, du — dich, er/sie/es — sich, wir — uns, ihr — euch, sie/Sie — sich. Ал этиштен дароо кийин турат; Perfekt формасында жардамчы этиштен кийин: «Wir haben uns im Deutschkurs kennengelernt». Бул этиштерде Perfekt үчүн жардамчы этиш — haben.',
    ),
    discover: l(
      '«Wir treffen uns» и «Wir treffen Anna». Чем отличаются эти предложения? И где стоит uns, если предложение начинается со слов «Am Samstag»?',
      '«Wir treffen uns» жана «Wir treffen Anna». Бул сүйлөмдөр эмнеси менен айырмаланат? Ал эми сүйлөм «Am Samstag» деген сөздөрдөн башталса, uns кайда турат?',
    ),
    why: l(
      'Рассказывая о друзьях и семье, вы постоянно говорите, как люди встречаются, знакомятся, ладят или спорят. Для этого нужны именно эти глаголы. Выучите их как готовые выражения и следите за двумя вещами: местоимение подходит к лицу, и оно стоит возле глагола.',
      'Достор жана үй-бүлө жөнүндө айтып жатканда, адамдар кантип жолугушарын, таанышарын, тил табышарын же талашарын дайыма айтасыз. Ал үчүн дал ушул этиштер керек. Аларды даяр туюнтмалар катары үйрөнүп, эки нерсени байкаңыз: ат атооч жакка туура келиши керек жана ал этиштин жанында турат.',
    ),
    when: [
      l(
        'Настоящее время: Ich verstehe mich gut mit meiner Schwester. Wir treffen uns am Samstag.',
        'Азыркы чак: Ich verstehe mich gut mit meiner Schwester. Wir treffen uns am Samstag.',
      ),
      l(
        'Если предложение начинается не с подлежащего, глагол остаётся вторым, а sich/uns — сразу после подлежащего: Am Samstag treffen wir uns.',
        'Сүйлөм ээден башталбаса, этиш экинчи орунда калат, ал эми sich/uns ээден дароо кийин келет: Am Samstag treffen wir uns.',
      ),
      l(
        'Perfekt: haben + sich + Partizip II в конце: Wir haben uns auf einer Feier kennengelernt.',
        'Perfekt: haben + sich + аягында Partizip II: Wir haben uns auf einer Feier kennengelernt.',
      ),
      l(
        'Смысл «друг друга»: Wir sehen uns morgen. Meine Eltern streiten sich selten. Это значит, что действие происходит между людьми.',
        '«Бири-бирин» мааниси: Wir sehen uns morgen. Meine Eltern streiten sich selten. Бул иш-аракет адамдардын ортосунда болгонун билдирет.',
      ),
    ],
    examples: [
      { de: 'Ich verstehe mich gut mit meiner Schwester.', ru: 'Я хорошо лажу со своей сестрой.', ky: 'Мен эжем менен жакшы тил табышам.', focus: 'mich' },
      { de: 'Wir treffen uns am Samstag.', ru: 'Мы встречаемся в субботу.', ky: 'Биз ишемби күнү жолугабыз.', focus: 'uns' },
      { de: 'Am Samstag treffen wir uns.', ru: 'В субботу мы встречаемся.', ky: 'Ишемби күнү биз жолугабыз.', focus: 'treffen wir uns' },
      { de: 'Wir haben uns im Deutschkurs kennengelernt.', ru: 'Мы познакомились на курсах немецкого.', ky: 'Биз немис тили курсунда таанышып калдык.', focus: 'haben uns … kennengelernt' },
      { de: 'Meine Eltern streiten sich selten.', ru: 'Мои родители редко ссорятся.', ky: 'Менин ата-энем сейрек талашышат.', focus: 'sich' },
    ],
    mistakes: [
      {
        wrong: 'Wir treffen sich am Samstag.',
        right: 'Wir treffen uns am Samstag.',
        note: l(
          'Местоимение должно подходить к лицу: wir → uns. Sich — только для er/sie/es и sie/Sie.',
          'Ат атооч жакка туура келиши керек: wir → uns. Sich — er/sie/es жана sie/Sie үчүн гана.',
        ),
      },
      {
        wrong: 'Ich verstehe mir gut mit ihm.',
        right: 'Ich verstehe mich gut mit ihm.',
        note: l(
          'У этих глаголов местоимение стоит в форме Akkusativ: mich, а не mir.',
          'Бул этиштерде ат атооч Akkusativ формасында турат: mir эмес, mich.',
        ),
      },
      {
        wrong: 'Wir haben kennengelernt uns im Deutschkurs.',
        right: 'Wir haben uns im Deutschkurs kennengelernt.',
        note: l(
          'Partizip II стоит в самом конце; uns идёт сразу после haben.',
          'Partizip II эң аягында турат; uns haben сөзүнөн дароо кийин келет.',
        ),
      },
    ],
    reallife: [
      { de: 'Wann treffen wir uns?', ru: 'Когда мы встретимся?', ky: 'Биз качан жолугабыз?', focus: 'uns' },
      { de: 'Wir verstehen uns sehr gut.', ru: 'Мы очень хорошо понимаем друг друга.', ky: 'Биз бири-бирибизди абдан жакшы түшүнөбүз.', focus: 'uns' },
      { de: 'Streitet ihr euch oft?', ru: 'Вы часто ссоритесь?', ky: 'Силер көп талашасыңарбы?', focus: 'euch' },
    ],
    dialogue: [
      { speaker: 'Anna', text: 'Wie habt ihr euch eigentlich kennengelernt?', ru: 'А как вы, собственно, познакомились?', ky: 'Силер өзүңөр кантип таанышып калдыңар?' },
      { speaker: 'Jonas', text: 'Wir haben uns auf einer Feier kennengelernt.', ru: 'Мы познакомились на празднике.', ky: 'Биз майрамда таанышып калдык.' },
      { speaker: 'Anna', text: 'Und versteht ihr euch gut?', ru: 'И вы хорошо ладите?', ky: 'Силер жакшы тил табышасыңарбы?' },
      { speaker: 'Jonas', text: 'Ja, sehr gut. Wir treffen uns jeden Freitag.', ru: 'Да, очень хорошо. Мы встречаемся каждую пятницу.', ky: 'Ооба, абдан жакшы. Биз ар жума сайын жолугабыз.' },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите о своём друге или подруге: как вы познакомились, как вы ладите и когда вы встречаетесь.',
        'Досуңуз же курбуңуз жөнүндө айтып бериңиз: кантип таанышканыңызды, кандай тил табышканыңызды жана качан жолугарыңызды.',
      ),
      sample: 'Wir haben uns im Deutschkurs kennengelernt. Wir verstehen uns sehr gut. Am Samstag treffen wir uns.',
      keywords: ['uns', 'kennengelernt', 'verstehen', 'treffen'],
    },
    source: UNIT_12_SOURCE,
  },
]

/** "Why?" notes of Unit 12. */
export const UNIT_12_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Ich helfe dir gern.',
    ru: 'Я с удовольствием тебе помогу.',
    ky: 'Мен сага кубанып жардам берем.',
    word: 'dir',
    conceptId: 'a2-personalpronomen-dativverben',
    reason: l(
      'Helfen — глагол с Dativ. Поэтому после него стоит dir (Dativ), а не dich (Akkusativ).',
      'Helfen — Dativ талап кылган этиш. Ошондуктан андан кийин dich (Akkusativ) эмес, dir (Dativ) турат.',
    ),
    more: [
      { de: 'Das Buch gehört mir.', ru: 'Книга принадлежит мне.', ky: 'Китеп мага таандык.' },
      { de: 'Ich rufe dich an.', ru: 'Я тебе позвоню.', ky: 'Мен сага чалам.' },
    ],
  },
  {
    sentence: 'Ich schenke meiner Mutter Blumen.',
    ru: 'Я дарю маме цветы.',
    ky: 'Мен апама гүл белек кылам.',
    word: 'meiner',
    conceptId: 'a2-personalpronomen-dativverben',
    reason: l(
      'Мама — человек, который получает подарок: это Dativ. Женский род в Dativ: die Mutter → meiner Mutter. Цветы — вещь, они в Akkusativ.',
      'Апа — белек алган адам: бул Dativ. Dativ формасындагы аял жынысы: die Mutter → meiner Mutter. Гүл — нерсе, ал Akkusativ формасында.',
    ),
    more: [
      { de: 'Ich zeige meinem Bruder das Foto.', ru: 'Я показываю брату фото.', ky: 'Мен агама сүрөттү көрсөтөм.' },
      { de: 'Er schenkt ihr ein Buch.', ru: 'Он дарит ей книгу.', ky: 'Ал ага китеп белек кылат.' },
    ],
  },
  {
    sentence: 'Wir treffen uns am Samstag.',
    ru: 'Мы встречаемся в субботу.',
    ky: 'Биз ишемби күнү жолугабыз.',
    word: 'uns',
    conceptId: 'a2-reflexive-verben',
    reason: l(
      'Sich treffen — возвратный глагол. Местоимение подходит к лицу: wir → uns. Оно означает «друг друга».',
      'Sich treffen — өздүк этиш. Ат атооч жакка туура келет: wir → uns. Ал «бири-бирин» дегенди билдирет.',
    ),
    more: [
      { de: 'Ich verstehe mich gut mit ihr.', ru: 'Я хорошо лажу с ней.', ky: 'Мен аны менен жакшы тил табышам.' },
      { de: 'Meine Eltern streiten sich selten.', ru: 'Мои родители редко ссорятся.', ky: 'Менин ата-энем сейрек талашышат.' },
    ],
  },
  {
    sentence: 'Wir haben uns im Deutschkurs kennengelernt.',
    ru: 'Мы познакомились на курсах немецкого.',
    ky: 'Биз немис тили курсунда таанышып калдык.',
    word: 'uns',
    conceptId: 'a2-reflexive-verben',
    reason: l(
      'В Perfekt местоимение uns стоит сразу после вспомогательного глагола haben, а Partizip II (kennengelernt) — в самом конце предложения.',
      'Perfekt формасында uns ат атооч жардамчы этиш haben сөзүнөн дароо кийин турат, ал эми Partizip II (kennengelernt) сүйлөмдүн эң аягында.',
    ),
    more: [
      { de: 'Wir haben uns auf einer Feier getroffen.', ru: 'Мы встретились на празднике.', ky: 'Биз майрамда жолугуштук.' },
      { de: 'Habt ihr euch gestritten?', ru: 'Вы поссорились?', ky: 'Силер талаштыңарбы?' },
    ],
  },
]
