import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_14_SOURCE } from '../provenance'

/**
 * Unit 14 texts (Stage 7E): 2 listening dialogues, 2 readings, 1 speaking scenario, 1 writing task.
 * Rules applied: imperative only du and Sie (no ihr, no sein-imperative); sollen / dürfen only in the present; `wenn` only for condition / habit;
 * no Konjunktiv II, no `man`, no `als` / `deshalb` / `obwohl`; no reflexive Dativ; attributive adjectives only after ein-/kein-/mein- (Nom/Akk, singular).
 * Health language is everyday language practice, NOT medical advice: the leaflet is an exercise text (`Übungstext`) and no dosage claim is meant for real use.
 * The emergency-call micro-task (audit D-8) is placed in reading text 2: the Notruf 112 and the three questions of an emergency call.
 */
export const UNIT_14_LISTENING: ListeningExercise[] = [
  {
    id: 'a2-li-14-01',
    unit: 14,
    level: 'A2',
    title: 'Am Telefon: Ein Termin in der Praxis',
    lines: [
      { speaker: 'Frau Neumann', text: 'Praxis Dr. Berger, guten Tag.', ru: 'Врачебный кабинет доктора Бергер, добрый день.', ky: 'Доктор Бергердин кабинети, кайырлуу күн.' },
      { speaker: 'Herr Sadykov', text: 'Guten Tag, hier ist Sadykov. Ich möchte einen Termin. Ich habe seit zwei Tagen Fieber und Husten.', ru: 'Добрый день, это Садыков. Я хотел бы записаться на приём. У меня уже два дня температура и кашель.', ky: 'Кайырлуу күн, мен Садыковмун. Мен жазылгым келет. Эки күндөн бери менин ысытмам жана жөтөлүм бар.' },
      { speaker: 'Frau Neumann', text: 'Oh, das tut mir leid. Wo tut es weh?', ru: 'О, мне очень жаль. Где болит?', ky: 'О, абдан капа болдум. Кайсы жериңиз ооруйт?' },
      { speaker: 'Herr Sadykov', text: 'Der Hals und der Kopf tun mir weh. Ich fühle mich sehr schlecht.', ru: 'У меня болят горло и голова. Я чувствую себя очень плохо.', ky: 'Менин тамагым жана башым ооруп жатат. Мен өзүмдү абдан жаман сезип жатам.' },
      { speaker: 'Frau Neumann', text: 'Können Sie am Mittwoch um neun Uhr kommen?', ru: 'Вы можете прийти в среду в девять часов?', ky: 'Шаршемби күнү саат тогузда келе аласызбы?' },
      { speaker: 'Herr Sadykov', text: 'Mittwoch ist zu spät. Mein Fieber ist hoch. Kann ich heute kommen?', ru: 'В среду слишком поздно. У меня высокая температура. Можно прийти сегодня?', ky: 'Шаршемби күнү өтө кеч. Менин ысытмам жогору. Бүгүн келсем болобу?' },
      { speaker: 'Frau Neumann', text: 'Heute um 16 Uhr ist ein Termin frei. Die Untersuchung dauert etwa zehn Minuten.', ru: 'Сегодня в 16 часов есть свободное время. Осмотр длится около десяти минут.', ky: 'Бүгүн саат 16да бош убакыт бар. Текшерүү болжол менен он мүнөткө созулат.' },
      { speaker: 'Herr Sadykov', text: 'Gut, danke. Was soll ich mitbringen?', ru: 'Хорошо, спасибо. Что мне взять с собой?', ky: 'Макул, рахмат. Мен өзүм менен эмне алып келишим керек?' },
      { speaker: 'Frau Neumann', text: 'Bringen Sie bitte Ihre Versichertenkarte mit.', ru: 'Возьмите, пожалуйста, вашу страховую карточку.', ky: 'Сураныч, сактандыруу картаңызды алып келиңиз.' },
      { speaker: 'Herr Sadykov', text: 'Gut, das mache ich. Vielen Dank und auf Wiederhören!', ru: 'Хорошо, так и сделаю. Большое спасибо и до свидания!', ky: 'Макул, ошентем. Чоң рахмат жана саламат болуңуз!' },
    ],
    questions: [
      { q: 'Seit wann hat Herr Sadykov Fieber und Husten?', options: ['Seit gestern', 'Seit zwei Tagen', 'Seit einer Woche'], answer: 1 },
      { q: 'Wann bekommt er einen Termin?', options: ['Am Mittwoch um 9 Uhr', 'Morgen um 16 Uhr', 'Heute um 16 Uhr'], answer: 2 },
      { q: 'Was soll er mitbringen?', options: ['Seine Versichertenkarte', 'Seine Tabletten', 'Ein Foto'], answer: 0 },
      { q: 'Was tut ihm weh?', options: ['Der Bauch und der Rücken', 'Der Hals und der Kopf', 'Die Ohren'], answer: 1 },
    ],
    keywords: ['Termin', 'Fieber', 'Husten', 'Versichertenkarte', 'weh'],
    source: UNIT_14_SOURCE,
  },
  {
    id: 'a2-li-14-02',
    unit: 14,
    level: 'A2',
    title: 'Eine Freundin gibt Tipps',
    lines: [
      { speaker: 'Mia', text: 'Hallo Tom, wie geht es dir?', ru: 'Привет, Том, как у тебя дела?', ky: 'Салам, Том, иштериң кандай?' },
      { speaker: 'Tom', text: 'Nicht gut. Ich bin erkältet. Der Hals tut mir weh, und ich habe Schnupfen.', ru: 'Не очень. Я простужен. У меня болит горло и насморк.', ky: 'Анча жакшы эмес. Мага суук тийди. Тамагым ооруйт жана тумоом бар.' },
      { speaker: 'Mia', text: 'Hast du Fieber? Ich hoffe, es ist keine Grippe.', ru: 'У тебя температура? Надеюсь, это не грипп.', ky: 'Ысытмаң барбы? Грипп болбосо экен.' },
      { speaker: 'Tom', text: 'Nein, aber ich bin sehr müde. Ich muss heute noch arbeiten.', ru: 'Нет, но я очень устал. Мне сегодня ещё нужно работать.', ky: 'Жок, бирок абдан чарчадым. Бүгүн дагы иштешим керек.' },
      { speaker: 'Mia', text: 'Das geht nicht! Du bist krank und musst dich ausruhen. Bleib im Bett.', ru: 'Так нельзя! Ты болен и должен отдохнуть. Оставайся в постели.', ky: 'Антип болбойт! Сен оорулуусуң, эс алышың керек. Керебетте жат.' },
      { speaker: 'Tom', text: 'Und was soll ich essen oder trinken?', ru: 'А что мне есть и пить?', ky: 'Ал эми эмне жеп-ичишим керек?' },
      { speaker: 'Mia', text: 'Trink viel Tee und iss eine Suppe. Geh nicht raus, es ist kalt.', ru: 'Пей много чая и ешь суп. Не выходи на улицу, там холодно.', ky: 'Көп чай ич жана шорпо же. Сыртка чыкпа, суук.' },
      { speaker: 'Tom', text: 'Danke für die Tipps. Wenn es mir morgen besser geht, gehe ich wieder arbeiten.', ru: 'Спасибо за советы. Если мне завтра станет лучше, я пойду на работу.', ky: 'Кеңештериң үчүн рахмат. Эртең жакшыраак болуп калсам, жумушка кайра барам.' },
      { speaker: 'Mia', text: 'Gut. Und wenn du Fieber bekommst, geh zum Arzt. Er schreibt dir eine Krankschreibung.', ru: 'Хорошо. А если у тебя поднимется температура, иди к врачу. Он выпишет тебе больничный.', ky: 'Жакшы. Ал эми ысытмаң көтөрүлсө, дарыгерге бар. Ал сага оорулуу барагын жазып берет.' },
      { speaker: 'Tom', text: 'Ja, das mache ich. Du bist wirklich eine gute Freundin!', ru: 'Да, так и сделаю. Ты действительно хорошая подруга!', ky: 'Ооба, ошентем. Сен чындап эле жакшы курбусуң!' },
    ],
    questions: [
      { q: 'Was tut Tom weh?', options: ['Der Hals', 'Der Kopf', 'Der Rücken'], answer: 0 },
      { q: 'Welchen Rat gibt Mia nicht?', options: ['Er soll im Bett bleiben.', 'Er soll viel Tee trinken.', 'Er soll Tabletten nehmen.'], answer: 2 },
      { q: 'Warum soll Tom sich ausruhen?', options: ['Er hat Fieber.', 'Er ist krank.', 'Er hat keine Arbeit.'], answer: 1 },
      { q: 'Wann geht Tom wieder arbeiten?', options: ['Wenn es ihm besser geht.', 'Wenn Mia anruft.', 'Wenn er Fieber hat.'], answer: 0 },
    ],
    keywords: ['erkältet', 'Hals', 'ausruhen', 'Tee', 'Arzt'],
    source: UNIT_14_SOURCE,
  },
]

export const UNIT_14_READING: ReadingText[] = [
  {
    id: 'a2-re-14-01',
    unit: 14,
    level: 'A2',
    title: 'Schmerztabletten: Gebrauchsinformation',
    body: [
      'Schmerztabletten – Gebrauchsinformation (Übungstext)',
      'Erwachsene nehmen eine Tablette, bis zu dreimal am Tag. Nehmen Sie die Tablette mit Wasser. Nicht mehr als drei Tabletten pro Tag! Kinder unter zwölf Jahren dürfen diese Tabletten nicht nehmen.',
      'Wenn Sie nach drei Tagen noch Fieber haben, gehen Sie zum Arzt. Bei Bauchschmerzen: Tabletten nicht mehr nehmen und den Arzt fragen.',
    ],
    gloss: [
      { word: 'Gebrauchsinformation', ru: 'инструкция по применению (листок-вкладыш)', ky: 'колдонуу боюнча көрсөтмө (дарынын барактасы)', example: 'Lesen Sie die Gebrauchsinformation.', grammar: 'составное существительное: Gebrauch + Information; артикль — по последнему слову: die Gebrauchsinformation', grammarKy: 'татаал зат атооч: Gebrauch + Information; артикль акыркы сөз боюнча: die Gebrauchsinformation', related: ['die Tablette', 'die Salbe'] },
      { word: 'Übungstext', ru: 'учебный текст (для тренировки, не настоящая инструкция)', ky: 'машыгуу тексти (чыныгы көрсөтмө эмес)', example: 'Das ist ein Übungstext.', grammar: 'в учебнике такой текст нужен только для языка; для настоящих лекарств читайте настоящую инструкцию и спрашивайте врача или в аптеке', grammarKy: 'бул текст тил үйрөнүү үчүн гана; чыныгы дарылар үчүн чыныгы көрсөтмөнү окуп, дарыгерден же дарыканадан сураңыз', related: ['die Tablette', 'der Arzt'] },
      { word: 'bis zu', ru: 'до (не больше чем)', ky: '…ге чейин (андан көп эмес)', example: 'Ich trinke bis zu drei Tassen Tee.', grammar: 'bis zu + число показывает максимум: bis zu dreimal = «самое большее три раза»', grammarKy: 'bis zu + сан эң көп чекти көрсөтөт: bis zu dreimal = «эң көп дегенде үч жолу»', related: ['trinken', 'die Tablette'] },
      { word: 'dreimal am Tag', ru: 'три раза в день', ky: 'күнүнө үч жолу', example: 'Ich putze dreimal am Tag die Zähne.', grammar: 'число + mal: zweimal, dreimal; am Tag = «в день»', grammarKy: 'сан + mal: zweimal, dreimal; am Tag = «күнүнө»', related: ['die Tablette', 'trainieren'] },
      { word: 'Erwachsene', ru: 'взрослые', ky: 'чоңдор (бойго жеткендер)', example: 'Erwachsene und Kinder.', grammar: 'существительное от прилагательного: здесь во множественном числе без артикля — Erwachsene', grammarKy: 'сын атоочтон жасалган зат атооч: бул жерде көптүк санда артикльсиз — Erwachsene', related: ['gesund', 'krank'] },
    ],
    questions: [
      { q: 'Wie viele Tabletten darf ein Erwachsener höchstens pro Tag nehmen?', options: ['Eine', 'Drei', 'Zwölf'], answer: 1 },
      { q: 'Wer darf die Tabletten nicht nehmen?', options: ['Erwachsene', 'Menschen mit Fieber', 'Kinder unter zwölf Jahren'], answer: 2 },
      { q: 'Wann soll ein Erwachsener zum Arzt gehen?', options: ['Wenn er nach drei Tagen noch Fieber hat.', 'Wenn er Wasser trinkt.', 'Wenn er eine Tablette nimmt.'], answer: 0 },
    ],
    source: UNIT_14_SOURCE,
  },
  {
    id: 'a2-re-14-02',
    unit: 14,
    level: 'A2',
    title: 'Gesund bleiben und der Notruf',
    body: [
      'Gesund bleiben – Tipps gegen Stress',
      'Bewegen Sie sich jeden Tag, zum Beispiel: Gehen Sie eine halbe Stunde spazieren. Schlafen Sie sieben bis acht Stunden. Ruhen Sie sich am Abend aus. Wenn Sie viel Stress haben, entspannen Sie sich mit Musik.',
      'Im Notfall: Rufen Sie den Notruf 112 an. Sagen Sie: Wo sind Sie? Was ist passiert? Bleiben Sie am Telefon. Der Krankenwagen kommt zu Ihnen.',
    ],
    gloss: [
      { word: 'zum Beispiel', ru: 'например', ky: 'мисалы', example: 'Ich mag Sport, zum Beispiel Schwimmen.', grammar: 'устойчивое выражение; на письме часто сокращают: z. B.', grammarKy: 'туруктуу сөз айкашы; жазууда көбүнчө кыскартышат: z. B.', related: ['trainieren', 'sich bewegen'] },
      { word: 'spazieren', ru: 'гулять (в составе spazieren gehen)', ky: 'сейилдөө (spazieren gehen түрүндө)', example: 'Wir gehen am Sonntag spazieren.', grammar: 'spazieren gehen: gehen — на втором месте, spazieren — в конце: Gehen Sie spazieren!', grammarKy: 'spazieren gehen: gehen экинчи орунда, spazieren аягында: Gehen Sie spazieren!', related: ['sich bewegen', 'gesund'] },
      { word: 'Im Notfall', ru: 'в экстренном случае', ky: 'шашылыш учурда', example: 'Im Notfall rufe ich die 112 an.', grammar: 'der Notfall — экстренный случай; im Notfall = «если случилось срочное»', grammarKy: 'der Notfall — шашылыш учур; im Notfall = «шашылыш нерсе болсо»', related: ['der Notruf', 'der Krankenwagen'] },
      { word: 'Was ist passiert?', ru: 'Что случилось?', ky: 'Эмне болду?', example: 'Was ist passiert? Ich brauche Hilfe.', grammar: 'устойчивый вопрос; passiert — Partizip II, форму учить не нужно: запомните вопрос целиком', grammarKy: 'туруктуу суроо; passiert — Partizip II, форманы үйрөнүүнүн кереги жок: суроону бүтүндөй эстеп калыңыз', related: ['der Notruf', 'die Notaufnahme'] },
      { word: 'am Telefon', ru: 'у телефона, по телефону', ky: 'телефондо', example: 'Bleiben Sie am Telefon.', grammar: 'am Telefon bleiben = не класть трубку; am = an dem', grammarKy: 'am Telefon bleiben = трубканы коюп койбоо; am = an dem', related: ['der Notruf', 'die Praxis'] },
    ],
    questions: [
      { q: 'Welche Nummer ruft eine Person im Notfall an?', options: ['112', '110', '116'], answer: 0 },
      { q: 'Was soll die Person am Telefon sagen?', options: ['Den Namen des Arztes', 'Wo sie ist und was passiert ist', 'Wie alt sie ist'], answer: 1 },
      { q: 'Was hilft bei Stress?', options: ['Mehr arbeiten', 'Kaffee trinken', 'Sich mit Musik entspannen'], answer: 2 },
    ],
    source: UNIT_14_SOURCE,
  },
]

export const UNIT_14_SPEAKING: SpeakingScenario[] = [
  {
    id: 'a2-sp-14-01',
    title: 'Beim Arzt',
    titleRu: 'У врача',
    titleKy: 'Дарыгерде',
    icon: '🩺',
    level: 'A2',
    goal: {
      ru: 'Вы на приёме у врача (на «Sie»). Скажите, что у вас болит и как давно, ответьте на вопросы врача, повторите его совет и спросите, можно ли вам работать.',
      ky: 'Сиз дарыгердин кабылдамасындасыз («Sie» формасында сүйлөшөсүз). Эмнеңиз оорууда жана качандан бери экенин айтыңыз, дарыгердин суроолоруна жооп бериңиз, анын кеңешин кайталап, иштесеңиз болорун же болбосун сураңыз.',
    },
    turns: [
      {
        ai: 'Guten Tag, ich bin Dr. Berger. Was fehlt Ihnen?',
        aiRu: 'Добрый день, я доктор Бергер. На что жалуетесь?',
        aiKy: 'Кайырлуу күн, мен доктор Бергермин. Сизге эмне болду?',
        hints: ['Ich habe Fieber und Husten.', 'Mir tut der Hals weh.'],
        keywords: ['fieber', 'husten', 'hals'],
      },
      {
        ai: 'Seit wann haben Sie das?',
        aiRu: 'Как давно это у вас?',
        aiKy: 'Муну менен качандан бери ооруп жатасыз?',
        hints: ['Seit zwei Tagen.', 'Seit Montag.'],
        keywords: ['seit'],
      },
      {
        ai: 'Ich untersuche jetzt Ihren Hals. Wo tut es weh? Fühlen Sie sich sehr schlecht?',
        aiRu: 'Сейчас я осмотрю ваше горло. Где болит? Вы чувствуете себя очень плохо?',
        aiKy: 'Азыр мен сиздин тамагыңызды текшерем. Кайсы жериңиз ооруйт? Өзүңүздү абдан жаман сезип жатасызбы?',
        hints: ['Der Kopf tut mir weh.', 'Ich fühle mich müde und krank.'],
        keywords: ['weh', 'fühle', 'krank'],
      },
      {
        ai: 'Ich gebe Ihnen Tabletten. Nehmen Sie zweimal am Tag eine Tablette und bleiben Sie drei Tage zu Hause. Haben Sie noch Fragen?',
        aiRu: 'Я выпишу вам таблетки. Принимайте по таблетке два раза в день и оставайтесь три дня дома. У вас есть ещё вопросы?',
        aiKy: 'Мен сизге таблетка берем. Күнүнө эки жолу бирден таблетка ичип, үч күн үйдө болуңуз. Дагы суроолоруңуз барбы?',
        hints: ['Darf ich arbeiten?', 'Soll ich viel trinken?', 'Danke, ich bleibe im Bett.'],
        keywords: ['darf', 'soll', 'bett'],
      },
    ],
    source: UNIT_14_SOURCE,
  },
]

export const UNIT_14_WRITING: WritingTask[] = [
  {
    id: 'a2-wr-14-01',
    unit: 14,
    level: 'A2',
    title: 'Eine E-Mail an den Chef: Ich bin krank',
    situation: {
      ru: 'Вы заболели и не можете прийти на работу. Напишите короткое официальное письмо начальнику (на «Sie»): скажите, что вы больны и с каких пор, что у вас болит, что вы идёте к врачу, что вам нельзя или нужно делать, и предложите связаться с вами, если у него будут вопросы (с wenn).',
      ky: 'Сиз ооруп калып, жумушка келе албайсыз. Жетекчиңизге («Sie» формасында) кыска расмий кат жазыңыз: ооруп калганыңызды жана качандан бери экенин, эмнеңиз оорууда экенин, дарыгерге баратканыңызды, эмне кылууга болбой же кылуу керек экенин айтыңыз жана суроолору болсо, сиз менен байланышууну сунуштаңыз (wenn менен).',
    },
    formal: true,
    minWords: 50,
    mustInclude: [
      { label: 'Anrede (Sehr geehrte Frau … / Sehr geehrter Herr …)', patterns: ['sehr geehrte'] },
      { label: 'krank sein, seit wann (seit …)', patterns: ['seit '] },
      { label: 'Beschwerde (Fieber, Husten, Kopf tut weh …)', patterns: ['fieber', 'husten', 'schnupfen', 'kopfschmerzen', 'bauchschmerzen', 'weh'] },
      { label: 'Arzt', patterns: ['arzt'] },
      { label: 'Modalverb (darf / muss / soll)', patterns: ['darf', 'muss', 'soll'] },
      { label: 'wenn-Satz (Wenn Sie Fragen haben, …)', patterns: ['wenn '] },
      { label: 'Bitte an den Chef (… rufen Sie mich bitte an)', patterns: ['bitte'] },
      { label: 'Schluss (Mit freundlichen Grüßen)', patterns: ['mit freundlichen grüßen'] },
    ],
    model:
      'Sehr geehrter Herr Braun, ich bin seit Montag krank. Ich habe Fieber und Husten, und der Kopf tut mir weh. Heute gehe ich zum Arzt. Ich darf nicht arbeiten und muss bis Freitag zu Hause bleiben. Wenn Sie Fragen haben, rufen Sie mich bitte an. Morgen schreibe ich Ihnen wieder. Mit freundlichen Grüßen, Tom Weber',
    tips: [
      {
        ru: 'Официальное письмо: «Sehr geehrter Herr …» в начале и «Mit freundlichen Grüßen» в конце. К начальнику обращайтесь на «Sie».',
        ky: 'Расмий кат: башында «Sehr geehrter Herr …», аягында «Mit freundlichen Grüßen». Жетекчиге «Sie» формасында кайрылыңыз.',
      },
      {
        ru: 'Что болит: «Der Kopf tut mir weh» (человек — в Dativ: mir) или «Ich habe Fieber und Husten».',
        ky: 'Эмне оорууда: «Der Kopf tut mir weh» (адам Dativде: mir) же «Ich habe Fieber und Husten».',
      },
      {
        ru: 'Нельзя и нужно: «Ich darf nicht arbeiten», «Ich muss zu Hause bleiben». Модальный глагол — на втором месте, инфинитив — в конце.',
        ky: 'Болбойт жана керек: «Ich darf nicht arbeiten», «Ich muss zu Hause bleiben». Модалдык этиш экинчи орунда, инфинитив аягында.',
      },
      {
        ru: 'Предложение с wenn: «Wenn Sie Fragen haben, rufen Sie mich bitte an». В части с wenn глагол — в конце, потом главная часть начинается с глагола.',
        ky: 'wenn менен сүйлөм: «Wenn Sie Fragen haben, rufen Sie mich bitte an». wenn бөлүгүндө этиш аягында, андан кийин башкы бөлүк этиштен башталат.',
      },
    ],
    source: UNIT_14_SOURCE,
  },
]
