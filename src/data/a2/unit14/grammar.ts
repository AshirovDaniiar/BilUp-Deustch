import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_14_SOURCE } from '../provenance'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 14 grammar (Stage 7E). Three concepts of the approved Stage 7B plan, each with a capped scope (see docs/authoring/A2_UNIT14_DESIGN_NOTES.md):
 *  1. `a2-imperativ` — du- and Sie-forms only (audit: no ihr), vowel change e→i(e), separable and reflexive verbs, `nicht`, `bitte`.
 *  2. `a2-sollen-duerfen` — sollen and dürfen in the present; müssen / können recycled. No `sollte` (Konjunktiv II).
 *  3. `a2-wenn-saetze` — `wenn` for condition / habit, verb at the end, inversion in the main clause. No `als`, no `wenn` + Konjunktiv II.
 * Not taught: the ihr-imperative, the sein-imperative, reflexive Dativ (`sich die Zähne putzen`), `man`, `obwohl` / `deshalb` and other later connectors.
 */
export const UNIT_14_GRAMMAR: GrammarConcept[] = [
  {
    id: 'a2-imperativ',
    category: 'verbs',
    level: 'A2',
    unit: 14,
    visual: 'verbpos',
    title: l('Императив: просьба и совет (du и Sie)', 'Буйрук же өтүнүч формасы: кеңеш жана суроо (du жана Sie)'),
    summary: l(
      'Чтобы дать совет или инструкцию, глагол ставят на первое место. К «ты» (du) берут основу глагола без -st: «Trink viel Wasser!». У глаголов с e → i (nehmen, sprechen, essen) гласная меняется: «Nimm eine Tablette!», «Sprich langsam!», «Iss etwas!». К «вы» (Sie) берут инфинитив и сразу за ним Sie: «Nehmen Sie eine Tablette!». У возвратных и отделяемых глаголов местоимение стоит после глагола, а приставка уходит в конец: «Ruh dich aus!», «Ruhen Sie sich aus!». Отрицание — nicht: «Geh nicht zur Arbeit!». Вежливее со словом bitte. Форму для ihr и форму для sein мы в этом юните не учим.',
      'Кеңеш же көрсөтмө берүү үчүн этиш биринчи орунга коюлат. «Сен» (du) үчүн этиштин -st жок уңгусу алынат: «Trink viel Wasser!». e → i өзгөрүүчү этиштерде (nehmen, sprechen, essen) үндүү өзгөрөт: «Nimm eine Tablette!», «Sprich langsam!», «Iss etwas!». «Сиз» (Sie) үчүн инфинитив алынып, андан кийин дароо Sie турат: «Nehmen Sie eine Tablette!». Өздүк этиштерде жана приставкалуу этиштерде ат атооч этиштен кийин турат, ал эми приставка аягына чыгат: «Ruh dich aus!», «Ruhen Sie sich aus!». Четтөө — nicht: «Geh nicht zur Arbeit!». bitte сөзү менен сылыгыраак угулат. ihr үчүн форманы жана sein этишинин формасын бул бөлүмдө үйрөнбөйбүз.',
    ),
    discover: l(
      'Сравните: «Du nimmst eine Tablette» и «Nimm eine Tablette!». Что изменилось в глаголе и что случилось с «du»?',
      '«Du nimmst eine Tablette» жана «Nimm eine Tablette!» деген сүйлөмдөрдү салыштырыңыз. Этишке эмне болду жана «du» эмне болду?',
    ),
    why: l(
      'У врача, в аптеке, в инструкции к лекарству и в разговоре с другом вы постоянно слышите короткие указания: «Nehmen Sie …», «Trink …». Их нужно сразу понимать. Говорить так вы будете в основном в двух ситуациях: совет другу (du) и вежливая просьба незнакомому (Sie + bitte). Начните с глаголов, которые вы уже знаете.',
      'Дарыгерде, дарыканада, дарынын көрсөтмөсүндө жана дос менен сүйлөшкөндө кыска көрсөтмөлөрдү дайыма угасыз: «Nehmen Sie …», «Trink …». Аларды дароо түшүнүү керек. Өзүңүз негизинен эки учурда колдоносуз: доско кеңеш (du) жана тааныш эмес адамга сылык өтүнүч (Sie + bitte). Билген этиштериңизден баштаңыз.',
    ),
    when: [
      l(
        'Совет другу (du): основа глагола, без du. Trink viel Tee. Bleib im Bett. Geh nicht zur Arbeit.',
        'Досуңузга кеңеш (du): этиштин уңгусу, du жок. Trink viel Tee. Bleib im Bett. Geh nicht zur Arbeit.',
      ),
      l(
        'Гласная меняется у e → i: nehmen – nimm, sprechen – sprich, essen – iss. У schlafen и fahren гласная не меняется: schlaf, fahr.',
        'e → i өзгөрүүчү этиштерде үндүү өзгөрөт: nehmen – nimm, sprechen – sprich, essen – iss. schlafen жана fahren этиштеринде үндүү өзгөрбөйт: schlaf, fahr.',
      ),
      l(
        'Вежливая просьба (Sie): инфинитив + Sie. Nehmen Sie die Tablette. Kommen Sie bitte um neun Uhr.',
        'Сылык өтүнүч (Sie): инфинитив + Sie. Nehmen Sie die Tablette. Kommen Sie bitte um neun Uhr.',
      ),
      l(
        'Возвратные и отделяемые глаголы: Ruh dich aus! Ruhen Sie sich aus! Rufen Sie den Notruf an!',
        'Өздүк жана приставкалуу этиштер: Ruh dich aus! Ruhen Sie sich aus! Rufen Sie den Notruf an!',
      ),
    ],
    examples: [
      { de: 'Trink viel Wasser!', ru: 'Пей много воды!', ky: 'Көп суу ич!', focus: 'trink (du, без -st)' },
      { de: 'Nimm eine Tablette.', ru: 'Прими таблетку.', ky: 'Бир таблетка ич.', focus: 'nehmen → nimm' },
      { de: 'Ruh dich aus!', ru: 'Отдохни!', ky: 'Эс ал!', focus: 'sich ausruhen → ruh dich aus' },
      { de: 'Nehmen Sie die Tablette mit Wasser.', ru: 'Примите таблетку с водой.', ky: 'Таблетканы суу менен ичиңиз.', focus: 'nehmen Sie (Sie)' },
      { de: 'Kommen Sie bitte um neun Uhr.', ru: 'Приходите, пожалуйста, в девять часов.', ky: 'Сураныч, саат тогузда келиңиз.', focus: 'kommen Sie + bitte' },
      { de: 'Geh nicht zur Arbeit!', ru: 'Не ходи на работу!', ky: 'Жумушка барба!', focus: 'nicht' },
    ],
    mistakes: [
      {
        wrong: 'Nehm eine Tablette!',
        right: 'Nimm eine Tablette!',
        note: l(
          'У nehmen гласная меняется: nimm. Формы nehm здесь нет.',
          'nehmen этишинде үндүү өзгөрөт: nimm. Мында nehm формасы жок.',
        ),
      },
      {
        wrong: 'Sie nehmen die Tablette!',
        right: 'Nehmen Sie die Tablette!',
        note: l(
          'В указании глагол стоит первым, а Sie — сразу за ним.',
          'Көрсөтмөдө этиш биринчи турат, ал эми Sie андан кийин дароо келет.',
        ),
      },
      {
        wrong: 'Ruh aus dich!',
        right: 'Ruh dich aus!',
        note: l(
          'Местоимение (dich) стоит сразу после глагола, приставка aus — в самом конце.',
          'Ат атооч (dich) этиштен кийин дароо турат, ал эми aus приставкасы эң аягында.',
        ),
      },
      {
        wrong: 'Schläf viel!',
        right: 'Schlaf viel!',
        note: l(
          'У schlafen гласная в императиве не меняется: schlaf (не schläf).',
          'schlafen этишинде буйрук формасында үндүү өзгөрбөйт: schlaf (schläf эмес).',
        ),
      },
    ],
    reallife: [
      { de: 'Bleiben Sie bitte im Bett.', ru: 'Оставайтесь, пожалуйста, в постели.', ky: 'Сураныч, керебетте жатыңыз.', focus: 'bleiben Sie' },
      { de: 'Rufen Sie bitte die 112 an!', ru: 'Позвоните, пожалуйста, по номеру 112!', ky: 'Сураныч, 112 номерине чалыңыз!', focus: 'Rufen Sie … an' },
      { de: 'Ruf mich bitte an, wenn es dir schlechter geht.', ru: 'Позвони мне, пожалуйста, если тебе станет хуже.', ky: 'Сага начарыраак болуп калса, мага чалып койчу.', focus: 'ruf … an' },
    ],
    dialogue: [
      { speaker: 'Patient', text: 'Ich habe Fieber und Husten.', ru: 'У меня температура и кашель.', ky: 'Менин ысытмам жана жөтөлүм бар.' },
      { speaker: 'Ärztin', text: 'Bleiben Sie drei Tage im Bett und trinken Sie viel Tee.', ru: 'Оставайтесь три дня в постели и пейте много чая.', ky: 'Үч күн керебетте жатып, көп чай ичиңиз.' },
      { speaker: 'Patient', text: 'Muss ich auch Tabletten nehmen?', ru: 'Мне нужно принимать и таблетки?', ky: 'Мен таблетка да ичишим керекпи?' },
      { speaker: 'Ärztin', text: 'Ja, nehmen Sie zweimal am Tag eine Tablette.', ru: 'Да, принимайте по таблетке два раза в день.', ky: 'Ооба, күнүнө эки жолу бирден таблетка ичиңиз.' },
    ],
    speakPrompt: {
      prompt: l(
        'Ваш друг простужен. Дайте ему три совета с императивом (du): что пить, что делать, чего не делать.',
        'Досуңузга суук тийди. Ага буйрук формасын (du) колдонуп үч кеңеш бериңиз: эмне ичүү, эмне кылуу, эмне кылбоо керек.',
      ),
      sample: 'Trink viel Tee. Ruh dich aus. Geh nicht zur Arbeit.',
      keywords: ['trink', 'ruh', 'geh'],
    },
    source: UNIT_14_SOURCE,
  },
  {
    id: 'a2-sollen-duerfen',
    category: 'verbs',
    level: 'A2',
    unit: 14,
    visual: 'modal',
    title: l('Модальные глаголы sollen и dürfen (müssen и können — повторение)', 'Модалдык этиштер sollen жана dürfen (müssen жана können — кайталоо)'),
    summary: l(
      'Sollen значит «должен по чьему-то совету или указанию»: «Der Arzt sagt: Ich soll viel trinken». Dürfen значит «можно, разрешено»; nicht dürfen — «нельзя»: «Du darfst heute nicht arbeiten». Müssen (нужно) и können (могу) вы знаете из A1. Формы в Präsens: ich soll / darf, du sollst / darfst, er soll / darf, wir sollen / dürfen, ihr sollt / dürft, sie sollen / dürfen. У dürfen в единственном числе гласная меняется (darf). Модальный глагол стоит на втором месте, смысловой глагол в инфинитиве — в конце, без zu. Осторожно: nicht müssen — «не нужно», а nicht dürfen — «нельзя».',
      'Sollen «башка бирөөнүн кеңеши же көрсөтмөсү боюнча милдеттүү» дегенди билдирет: «Der Arzt sagt: Ich soll viel trinken». Dürfen «уруксат бар» дегенди билдирет; nicht dürfen — «болбойт, тыюу»: «Du darfst heute nicht arbeiten». Müssen (керек) жана können (болот, билем) этиштерин A1 деңгээлинен билесиз. Präsens формалары: ich soll / darf, du sollst / darfst, er soll / darf, wir sollen / dürfen, ihr sollt / dürft, sie sollen / dürfen. dürfen этишинин жекелик санында үндүү өзгөрөт (darf). Модалдык этиш экинчи орунда, маанилүү этиш инфинитивде аягында турат, zu жок. Этият болуңуз: nicht müssen — «кереги жок», ал эми nicht dürfen — «болбойт».',
    ),
    discover: l(
      'Сравните: «Du musst nicht arbeiten» и «Du darfst nicht arbeiten». В одном случае работать необязательно, в другом — запрещено. Какое предложение какое?',
      '«Du musst nicht arbeiten» жана «Du darfst nicht arbeiten» деген сүйлөмдөрдү салыштырыңыз. Бирөөндө иштөөнүн кереги жок, экинчисинде иштөөгө болбойт. Кайсы сүйлөм кайсысы?',
    ),
    why: l(
      'Врач, аптекарь и начальник говорят вам, что вы должны, можете и не можете делать. «Ich soll im Bett bleiben» и «Ich darf nicht arbeiten» — самые полезные предложения при болезни. Различие между «нельзя» и «не нужно» важно: ошибка в нём меняет смысл.',
      'Дарыгер, дарыкачы жана жетекчи сизге эмне кылуу керек, эмне кылууга болот жана болбойт деп айтат. «Ich soll im Bett bleiben» жана «Ich darf nicht arbeiten» — оорунун учурундагы эң пайдалуу сүйлөмдөр. «Болбойт» менен «кереги жок» дегендин айырмасы маанилүү: ал жерде жаңылсаңыз, маани өзгөрөт.',
    ),
    when: [
      l(
        'Совет или указание другого человека — sollen: Ich soll viel Wasser trinken. Sie sollen drei Tage im Bett bleiben.',
        'Башка адамдын кеңеши же көрсөтмөсү — sollen: Ich soll viel Wasser trinken. Sie sollen drei Tage im Bett bleiben.',
      ),
      l(
        'Разрешение и запрет — dürfen: Darf ich nach Hause gehen? Du darfst heute nicht arbeiten.',
        'Уруксат жана тыюу — dürfen: Darf ich nach Hause gehen? Du darfst heute nicht arbeiten.',
      ),
      l(
        'Необходимость — müssen: Ich muss zum Arzt gehen. Возможность — können: Ich kann nicht schlafen.',
        'Зарылдык — müssen: Ich muss zum Arzt gehen. Мүмкүнчүлүк — können: Ich kann nicht schlafen.',
      ),
      l(
        'Модальный глагол — на втором месте, инфинитив — в конце: Kinder unter zwölf Jahren dürfen die Tabletten nicht nehmen.',
        'Модалдык этиш экинчи орунда, инфинитив аягында: Kinder unter zwölf Jahren dürfen die Tabletten nicht nehmen.',
      ),
    ],
    examples: [
      { de: 'Ich soll viel Wasser trinken.', ru: 'Мне нужно пить много воды (так сказал врач).', ky: 'Мен көп суу ичишим керек (дарыгер ушундай деди).', focus: 'soll' },
      { de: 'Sie sollen drei Tage im Bett bleiben.', ru: 'Вам нужно три дня оставаться в постели.', ky: 'Сиз үч күн керебетте жатышыңыз керек.', focus: 'sollen' },
      { de: 'Du darfst heute nicht arbeiten.', ru: 'Тебе сегодня нельзя работать.', ky: 'Сага бүгүн иштөөгө болбойт.', focus: 'darfst nicht' },
      { de: 'Darf ich nach Hause gehen?', ru: 'Можно мне пойти домой?', ky: 'Мен үйгө кетсем болобу?', focus: 'darf (вопрос)' },
      { de: 'Kinder unter zwölf Jahren dürfen die Tabletten nicht nehmen.', ru: 'Детям до двенадцати лет эти таблетки принимать нельзя.', ky: 'Он эки жашка чейинки балдарга бул таблеткаларды ичүүгө болбойт.', focus: 'dürfen nicht' },
      { de: 'Ich muss zum Arzt gehen.', ru: 'Мне нужно идти к врачу.', ky: 'Мен дарыгерге барышым керек.', focus: 'muss (повторение)' },
    ],
    mistakes: [
      {
        wrong: 'Ich soll zum Arzt zu gehen.',
        right: 'Ich soll zum Arzt gehen.',
        note: l(
          'После модального глагола инфинитив стоит без zu.',
          'Модалдык этиштен кийин инфинитив zu жок турат.',
        ),
      },
      {
        wrong: 'Du dürfst nicht rauchen.',
        right: 'Du darfst nicht rauchen.',
        note: l(
          'У dürfen в единственном числе гласная меняется: ich darf, du darfst, er darf.',
          'dürfen этишинин жекелик санында үндүү өзгөрөт: ich darf, du darfst, er darf.',
        ),
      },
      {
        wrong: 'Du musst nicht rauchen.',
        right: 'Du darfst nicht rauchen.',
        note: l(
          'Nicht müssen значит «не нужно». Чтобы сказать «нельзя», берут nicht dürfen.',
          'Nicht müssen «кереги жок» дегенди билдирет. «Болбойт» дегенди айтуу үчүн nicht dürfen колдонулат.',
        ),
      },
      {
        wrong: 'Ich soll bleibe im Bett.',
        right: 'Ich soll im Bett bleiben.',
        note: l(
          'Смысловой глагол стоит в инфинитиве и в самом конце: bleiben.',
          'Маанилүү этиш инфинитивде жана эң аягында турат: bleiben.',
        ),
      },
    ],
    reallife: [
      { de: 'Darf ich heute zu Hause bleiben?', ru: 'Можно мне сегодня остаться дома?', ky: 'Мен бүгүн үйдө калсам болобу?', focus: 'Darf ich' },
      { de: 'Der Arzt sagt, ich soll mich ausruhen.', ru: 'Врач говорит, что мне нужно отдохнуть.', ky: 'Дарыгер мага эс алышым керек дейт.', focus: 'soll' },
      { de: 'Mit Fieber darfst du nicht trainieren.', ru: 'С температурой тебе нельзя тренироваться.', ky: 'Ысытма болгондо сага машыгууга болбойт.', focus: 'darfst nicht' },
    ],
    dialogue: [
      { speaker: 'Tom', text: 'Ich habe Fieber. Ich muss zum Arzt gehen.', ru: 'У меня температура. Мне нужно к врачу.', ky: 'Менин ысытмам бар. Мен дарыгерге барышым керек.' },
      { speaker: 'Mia', text: 'Was sagt der Arzt?', ru: 'Что говорит врач?', ky: 'Дарыгер эмне дейт?' },
      { speaker: 'Tom', text: 'Ich soll im Bett bleiben und viel trinken.', ru: 'Мне нужно оставаться в постели и много пить.', ky: 'Мен керебетте жатып, көп суу ичишим керек.' },
      { speaker: 'Mia', text: 'Dann darfst du nicht arbeiten.', ru: 'Тогда тебе нельзя работать.', ky: 'Анда сага иштөөгө болбойт.' },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите, что вам можно и нельзя делать, когда вы больны, и что вам советует врач.',
        'Ооруп калганда эмне кылууга болорун жана болбосун, ошондой эле дарыгер сизге эмне кеңеш берерин айтып бериңиз.',
      ),
      sample: 'Ich darf nicht arbeiten. Ich soll im Bett bleiben und viel trinken.',
      keywords: ['darf', 'soll'],
    },
    source: UNIT_14_SOURCE,
  },
  {
    id: 'a2-wenn-saetze',
    category: 'conjunctions',
    level: 'A2',
    unit: 14,
    visual: 'verbpos',
    title: l('Придаточное с wenn: «когда, если»', 'wenn менен башталган сүйлөм бөлүгү: «качан, эгер»'),
    summary: l(
      'Wenn связывает условие или повторяющееся событие с тем, что из этого следует: «Wenn ich Fieber habe, bleibe ich im Bett». В части с wenn спрягаемый глагол уходит в самый конец: «wenn ich Fieber habe». Если часть с wenn стоит первой, то после запятой главная часть начинается с глагола (он на первом месте, подлежащее — после него): «…, bleibe ich im Bett». Если главная часть стоит первой, порядок слов в ней обычный: «Ich bleibe im Bett, wenn ich Fieber habe». Здесь wenn значит «если» и «всякий раз, когда»; для прошлого одного события (als) — позже.',
      'Wenn шарт же кайталанып турган окуяны андан келип чыккан нерсе менен байланыштырат: «Wenn ich Fieber habe, bleibe ich im Bett». wenn менен башталган бөлүктө жакталышы бар этиш эң аягына өтөт: «wenn ich Fieber habe». Эгер wenn бөлүгү биринчи турса, үтүрдөн кийин башкы бөлүк этиштен башталат (этиш биринчи орунда, ээ андан кийин): «…, bleibe ich im Bett». Эгер башкы бөлүк биринчи турса, андагы сөз тартиби адаттагыдай: «Ich bleibe im Bett, wenn ich Fieber habe». Бул жерде wenn «эгер» жана «качан болбосун» дегенди билдирет; өткөн убакыттагы бир жолку окуя үчүн (als) кийинчерээк.',
    ),
    discover: l(
      'Сравните: «Ich habe Fieber. Ich bleibe im Bett.» и «Wenn ich Fieber habe, bleibe ich im Bett.» Где в первом предложении стоит «habe», а где во втором? Что стоит сразу после запятой?',
      '«Ich habe Fieber. Ich bleibe im Bett.» жана «Wenn ich Fieber habe, bleibe ich im Bett.» деген сүйлөмдөрдү салыштырыңыз. «habe» биринчисинде кайсы жерде, экинчисинде кайсы жерде турат? Үтүрдөн кийин дароо эмне турат?',
    ),
    why: l(
      'Когда вы объясняете, что вы делаете при болезни, или слушаете совет врача («Wenn Sie Schmerzen haben, nehmen Sie eine Tablette»), вам нужен wenn. Это одна из самых частых связок в разговорной речи. Главное — запомнить две вещи: глагол в конце части с wenn и глагол на первом месте в главной части после неё.',
      'Ооруп калганда эмне кыларыңызды түшүндүргөндө же дарыгердин кеңешин уккандарда («Wenn Sie Schmerzen haben, nehmen Sie eine Tablette») сизге wenn керек. Бул оозеки сүйлөөдөгү эң көп колдонулган байланыштыргычтардын бири. Эки нерсени эстеп калуу жетиштүү: wenn бөлүгүндө этиш аягында, андан кийинки башкы бөлүктө этиш биринчи орунда.',
    ),
    when: [
      l(
        'Привычка, «всякий раз, когда»: Wenn ich Kopfschmerzen habe, gehe ich früh ins Bett.',
        'Адат, «качан болбосун»: Wenn ich Kopfschmerzen habe, gehe ich früh ins Bett.',
      ),
      l(
        'Условие, «если»: Wenn du Fieber hast, darfst du nicht arbeiten.',
        'Шарт, «эгер»: Wenn du Fieber hast, darfst du nicht arbeiten.',
      ),
      l(
        'Часть с wenn первой: глагол уходит в конец, а главная часть начинается с глагола: Wenn es dir schlecht geht, ruf mich an.',
        'wenn бөлүгү биринчи: этиш аягына өтөт, ал эми башкы бөлүк этиштен башталат: Wenn es dir schlecht geht, ruf mich an.',
      ),
      l(
        'Главная часть первой: порядок обычный: Ich bleibe im Bett, wenn ich Fieber habe.',
        'Башкы бөлүк биринчи: сөз тартиби адаттагыдай: Ich bleibe im Bett, wenn ich Fieber habe.',
      ),
    ],
    examples: [
      { de: 'Wenn ich Fieber habe, bleibe ich im Bett.', ru: 'Когда у меня температура, я остаюсь в постели.', ky: 'Менин ысытмам болсо, мен керебетте жатам.', focus: 'wenn … habe, bleibe ich' },
      { de: 'Ich bleibe im Bett, wenn ich Fieber habe.', ru: 'Я остаюсь в постели, если у меня температура.', ky: 'Менин ысытмам болсо, мен керебетте жатам.', focus: 'wenn ich Fieber habe (в конце)' },
      { de: 'Wenn du Kopfschmerzen hast, nimmst du eine Tablette.', ru: 'Когда у тебя болит голова, ты принимаешь таблетку.', ky: 'Башың ооруса, сен таблетка ичесиң.', focus: 'wenn … hast, nimmst du' },
      { de: 'Wenn ich Stress habe, höre ich Musik.', ru: 'Когда у меня стресс, я слушаю музыку.', ky: 'Стресс болгондо мен музыка угам.', focus: 'wenn … habe, höre ich' },
      { de: 'Wenn du krank bist, darfst du nicht trainieren.', ru: 'Если ты болен, тебе нельзя тренироваться.', ky: 'Эгер ооруп калсаң, сага машыгууга болбойт.', focus: 'wenn … bist, darfst du' },
    ],
    mistakes: [
      {
        wrong: 'Wenn ich Fieber habe, ich bleibe im Bett.',
        right: 'Wenn ich Fieber habe, bleibe ich im Bett.',
        note: l(
          'После части с wenn главная часть начинается с глагола: bleibe ich.',
          'wenn бөлүгүнөн кийин башкы бөлүк этиштен башталат: bleibe ich.',
        ),
      },
      {
        wrong: 'Wenn ich habe Fieber, bleibe ich im Bett.',
        right: 'Wenn ich Fieber habe, bleibe ich im Bett.',
        note: l(
          'В части с wenn спрягаемый глагол стоит в самом конце: Fieber habe.',
          'wenn бөлүгүндө жакталышы бар этиш эң аягында турат: Fieber habe.',
        ),
      },
      {
        wrong: 'Ich bleibe im Bett, wenn ich habe Fieber.',
        right: 'Ich bleibe im Bett, wenn ich Fieber habe.',
        note: l(
          'И после главной части глагол с wenn уходит в конец.',
          'Башкы бөлүктөн кийин да wenn менен келген этиш аягына өтөт.',
        ),
      },
    ],
    reallife: [
      { de: 'Wenn Sie Fragen haben, rufen Sie mich bitte an.', ru: 'Если у вас есть вопросы, позвоните мне, пожалуйста.', ky: 'Суроолоруңуз болсо, сураныч, мага чалыңыз.', focus: 'wenn … haben, rufen Sie' },
      { de: 'Wenn es mir besser geht, komme ich wieder zur Arbeit.', ru: 'Когда мне станет лучше, я снова приду на работу.', ky: 'Мага жакшыраак болгондо, мен жумушка кайра келем.', focus: 'wenn es mir besser geht' },
      { de: 'Was machst du, wenn du Rückenschmerzen hast?', ru: 'Что ты делаешь, когда у тебя болит спина?', ky: 'Белиң ооруганда сен эмне кыласың?', focus: 'wenn du … hast (в конце)' },
    ],
    dialogue: [
      { speaker: 'Mia', text: 'Was machst du, wenn du Kopfschmerzen hast?', ru: 'Что ты делаешь, когда у тебя болит голова?', ky: 'Башың ооруганда сен эмне кыласың?' },
      { speaker: 'Tom', text: 'Wenn ich Kopfschmerzen habe, trinke ich viel Wasser.', ru: 'Когда у меня болит голова, я пью много воды.', ky: 'Башым ооруганда мен көп суу ичем.' },
      { speaker: 'Mia', text: 'Und wenn das nicht hilft?', ru: 'А если это не помогает?', ky: 'Ал эми ал жардам бербесе?' },
      { speaker: 'Tom', text: 'Dann nehme ich eine Tablette und ruhe mich aus.', ru: 'Тогда я принимаю таблетку и отдыхаю.', ky: 'Анда мен таблетка ичип, эс алам.' },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите, что вы делаете, когда у вас что-то болит или когда вы устали.',
        'Бир жериңиз ооруганда же чарчаганда эмне кыларыңызды айтып бериңиз.',
      ),
      sample: 'Wenn ich Kopfschmerzen habe, trinke ich Wasser. Wenn ich müde bin, ruhe ich mich aus.',
      keywords: ['wenn', 'habe', 'bin'],
    },
    source: UNIT_14_SOURCE,
  },
]

/** "Why?" notes of Unit 14. */
export const UNIT_14_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Nimm eine Tablette.',
    ru: 'Прими таблетку.',
    ky: 'Бир таблетка ич.',
    word: 'Nimm',
    conceptId: 'a2-imperativ',
    reason: l(
      'Это совет «ты» (du): берётся основа глагола без -st и без du. У nehmen гласная меняется e → i: du nimmst → nimm.',
      'Бул «сен» (du) үчүн кеңеш: этиштин -st жок уңгусу алынат, du айтылбайт. nehmen этишинде үндүү e → i өзгөрөт: du nimmst → nimm.',
    ),
    more: [
      { de: 'Sprich bitte langsamer.', ru: 'Говори, пожалуйста, медленнее.', ky: 'Сураныч, жайыраак сүйлөчү.' },
      { de: 'Iss etwas.', ru: 'Съешь что-нибудь.', ky: 'Бир нерсе же.' },
    ],
  },
  {
    sentence: 'Nehmen Sie die Tablette mit Wasser.',
    ru: 'Примите таблетку с водой.',
    ky: 'Таблетканы суу менен ичиңиз.',
    word: 'Nehmen',
    conceptId: 'a2-imperativ',
    reason: l(
      'Для вежливой формы (Sie) глагол стоит в форме инфинитива на первом месте, а Sie — сразу за ним.',
      'Сылык форма (Sie) үчүн этиш инфинитив формасында биринчи орунда турат, ал эми Sie андан кийин дароо келет.',
    ),
    more: [
      { de: 'Kommen Sie bitte um neun Uhr.', ru: 'Приходите, пожалуйста, в девять часов.', ky: 'Сураныч, саат тогузда келиңиз.' },
      { de: 'Ruhen Sie sich aus.', ru: 'Отдохните.', ky: 'Эс алыңыз.' },
    ],
  },
  {
    sentence: 'Ich soll viel Wasser trinken.',
    ru: 'Мне нужно пить много воды.',
    ky: 'Мен көп суу ичишим керек.',
    word: 'soll',
    conceptId: 'a2-sollen-duerfen',
    reason: l(
      'Sollen говорит о совете или указании другого человека (например врача). Модальный глагол — на втором месте, инфинитив trinken — в конце.',
      'Sollen башка адамдын (мисалы, дарыгердин) кеңешин же көрсөтмөсүн билдирет. Модалдык этиш экинчи орунда, trinken инфинитиви аягында турат.',
    ),
    more: [
      { de: 'Sie sollen im Bett bleiben.', ru: 'Вам нужно оставаться в постели.', ky: 'Сиз керебетте жатышыңыз керек.' },
      { de: 'Du sollst nicht so viel arbeiten.', ru: 'Тебе не нужно столько работать.', ky: 'Сен ушунча көп иштебешиң керек.' },
    ],
  },
  {
    sentence: 'Du darfst heute nicht arbeiten.',
    ru: 'Тебе сегодня нельзя работать.',
    ky: 'Сага бүгүн иштөөгө болбойт.',
    word: 'darfst',
    conceptId: 'a2-sollen-duerfen',
    reason: l(
      'Nicht dürfen — «нельзя». У dürfen в единственном числе гласная меняется: ich darf, du darfst, er darf. Это не то же самое, что nicht müssen («не нужно»).',
      'Nicht dürfen — «болбойт». dürfen этишинин жекелик санында үндүү өзгөрөт: ich darf, du darfst, er darf. Бул nicht müssen («кереги жок») дегенден башка нерсе.',
    ),
    more: [
      { de: 'Darf ich nach Hause gehen?', ru: 'Можно мне пойти домой?', ky: 'Мен үйгө кетсем болобу?' },
      { de: 'Mit Fieber dürfen wir nicht trainieren.', ru: 'С температурой нам нельзя тренироваться.', ky: 'Ысытма болгондо бизге машыгууга болбойт.' },
    ],
  },
  {
    sentence: 'Wenn ich Fieber habe, bleibe ich im Bett.',
    ru: 'Когда у меня температура, я остаюсь в постели.',
    ky: 'Менин ысытмам болсо, мен керебетте жатам.',
    word: 'habe',
    conceptId: 'a2-wenn-saetze',
    reason: l(
      'В части с wenn глагол habe стоит в самом конце. Главная часть после запятой начинается с глагола: bleibe ich, а не ich bleibe.',
      'wenn бөлүгүндө habe этиши эң аягында турат. Үтүрдөн кийинки башкы бөлүк этиштен башталат: ich bleibe эмес, bleibe ich.',
    ),
    more: [
      { de: 'Ich bleibe im Bett, wenn ich Fieber habe.', ru: 'Я остаюсь в постели, если у меня температура.', ky: 'Менин ысытмам болсо, мен керебетте жатам.' },
      { de: 'Wenn du krank bist, darfst du nicht trainieren.', ru: 'Если ты болен, тебе нельзя тренироваться.', ky: 'Эгер ооруп калсаң, сага машыгууга болбойт.' },
    ],
  },
]
