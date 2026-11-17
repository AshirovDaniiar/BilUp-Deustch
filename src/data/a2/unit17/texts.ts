import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_17_SOURCE } from '../provenance'

/**
 * Unit 17 texts (Stage 7H): 2 listening dialogues, 2 readings, 1 speaking scenario, 1 writing task.
 * Register and genre (brief: avoid excessive formal language): L1 is a short job interview (Sie, plain wording), L2 two colleagues (du); R1 is a job ad, R2 a
 * blog text; the writing task is a short PROFILE for a job portal (an `ich`-text), not an application e-mail; no telephone call and no e-mail in the unit.
 * Rules applied: `deshalb / darum` with the verb in position 2, `weil` with the verb at the end; `wenn` (present / future / repeated) and `als` only with `war` /
 * `hatte` or Perfekt; no `bevor / nachdem / während`, no `man`, no `trotzdem`; ordinals only in dates (none are needed here); occupations are named in the
 * masculine form with the feminine given in context; attributive adjectives only in the unit-13 / 15 scope.
 */
export const UNIT_17_LISTENING: ListeningExercise[] = [
  {
    id: 'a2-li-17-01',
    unit: 17,
    level: 'A2',
    title: 'Das Vorstellungsgespräch',
    lines: [
      { speaker: 'Frau Roth', text: 'Guten Tag, Herr Aliev. Setzen Sie sich bitte.', ru: 'Добрый день, господин Алиев. Присаживайтесь, пожалуйста.', ky: 'Кайырлуу күн, Алиев мырза. Отуруңуз, сураныч.' },
      { speaker: 'Frau Roth', text: 'Sie bewerben sich als Mechaniker. Was haben Sie gelernt?', ru: 'Вы претендуете на место механика. Что вы изучали?', ky: 'Сиз механик болуп иштөө үчүн арыз бердиңиз. Эмнени окудуңуз?' },
      { speaker: 'Herr Aliev', text: 'Ich habe eine Ausbildung als Mechaniker gemacht. Als ich 19 war, habe ich den Abschluss bekommen.', ru: 'Я прошёл обучение на механика. Когда мне было 19, я получил диплом.', ky: 'Мен механик болуп кесиптик окуу бүттүм. 19 жашымда мен бүтүрүү документин алдым.' },
      { speaker: 'Frau Roth', text: 'Und welche Erfahrung haben Sie?', ru: 'А какой у вас опыт?', ky: 'Ал эми сизде кандай тажрыйба бар?' },
      { speaker: 'Herr Aliev', text: 'Ich habe drei Jahre in einer Werkstatt gearbeitet. Ich arbeite gern im Team.', ru: 'Я три года работал в мастерской. Я люблю работать в команде.', ky: 'Мен үч жыл устаканада иштедим. Мен жамаат менен иштегенди жакшы көрөм.' },
      { speaker: 'Frau Roth', text: 'Warum suchen Sie eine neue Stelle?', ru: 'Почему вы ищете новое место?', ky: 'Эмне үчүн жаңы жумуш издеп жатасыз?' },
      { speaker: 'Herr Aliev', text: 'Meine Familie zieht nach Köln, deshalb suche ich hier eine Stelle.', ru: 'Моя семья переезжает в Кёльн, поэтому я ищу место здесь.', ky: 'Менин үй-бүлөм Кёльнгө көчүп келатат, ошондуктан мен бул жерден жумуш издеп жатам.' },
      { speaker: 'Frau Roth', text: 'Wir bieten Vollzeit, 38 Stunden pro Woche. Manchmal gibt es Überstunden.', ru: 'Мы предлагаем полную занятость, 38 часов в неделю. Иногда бывают сверхурочные.', ky: 'Биз толук жумуш убактысын сунуштайбыз, жумасына 38 саат. Кээде ашыкча иштелген саат болот.' },
      { speaker: 'Herr Aliev', text: 'Das ist kein Problem. Wann kann ich anfangen?', ru: 'Это не проблема. Когда я могу начать?', ky: 'Бул көйгөй эмес. Качан баштасам болот?' },
      { speaker: 'Frau Roth', text: 'Sie können im Juni anfangen. Den Arbeitsvertrag schicken wir Ihnen per Post.', ru: 'Вы можете начать в июне. Трудовой договор мы пришлём вам по почте.', ky: 'Сиз июнь айында баштасаңыз болот. Эмгек келишимин биз сизге почта аркылуу жөнөтөбүз.' },
    ],
    questions: [
      { q: 'Was hat Herr Aliev gelernt?', options: ['Bäcker', 'Mechaniker', 'Programmierer'], answer: 1 },
      { q: 'Warum sucht er eine neue Stelle?', options: ['Seine Familie zieht nach Köln.', 'Er verdient zu wenig.', 'Er mag sein Team nicht.'], answer: 0 },
      { q: 'Was bietet die Firma?', options: ['Teilzeit', 'Nur Überstunden', 'Vollzeit mit 38 Stunden pro Woche'], answer: 2 },
      { q: 'Wie bekommt er den Arbeitsvertrag?', options: ['Per E-Mail', 'Per Post', 'Im Büro'], answer: 1 },
    ],
    keywords: ['Ausbildung', 'Erfahrung', 'Vollzeit', 'Überstunden', 'Arbeitsvertrag'],
    source: UNIT_17_SOURCE,
  },
  {
    id: 'a2-li-17-02',
    unit: 17,
    level: 'A2',
    title: 'Paul arbeitet in Teilzeit',
    lines: [
      { speaker: 'Nina', text: 'Paul, stimmt es? Du arbeitest ab Mai in Teilzeit?', ru: 'Пауль, это правда? Ты с мая работаешь на неполную ставку?', ky: 'Пауль, чынбы? Сен майдан баштап толук эмес убакыт иштейсиңби?' },
      { speaker: 'Paul', text: 'Ja, ich mache eine Weiterbildung, deshalb arbeite ich nur vier Tage. Die Vorlesung ist am Freitag.', ru: 'Да, я прохожу курс повышения квалификации, поэтому работаю только четыре дня. Лекция — в пятницу.', ky: 'Ооба, мен квалификациямды жогорулатып жатам, ошондуктан төрт күн гана иштейм. Лекция жума күнү.' },
      { speaker: 'Nina', text: 'Warum eine Weiterbildung? Du hast doch schon eine gute Stelle.', ru: 'Зачем тебе курс? У тебя же уже хорошая работа.', ky: 'Эмнеге квалификация? Сенде жакшы жумуш бар го.' },
      { speaker: 'Paul', text: 'Ich möchte später mehr Geld verdienen, deshalb brauche ich ein Zertifikat. Die Weiterbildung dauert zwei Semester.', ru: 'Я хочу позже зарабатывать больше, поэтому мне нужен сертификат. Курс длится два семестра.', ky: 'Мен кийин көбүрөөк акча тапкым келет, ошондуктан мага тастыктама керек. Окуу эки жарым жылдык мезгилге созулат.' },
      { speaker: 'Nina', text: 'Und das Geld jetzt? Als ich vor zwei Jahren in Teilzeit gearbeitet habe, hatte ich zu wenig.', ru: 'А деньги сейчас? Когда я два года назад работала на неполную ставку, мне не хватало.', ky: 'Ал эми азыркы акча? Мен эки жыл мурун толук эмес убакыт иштегенде менде акча жетишчү эмес.' },
      { speaker: 'Paul', text: 'Ich spare schon lange. Wenn ich am Samstag arbeite, bekomme ich extra Geld.', ru: 'Я давно коплю. Когда я работаю в субботу, я получаю дополнительные деньги.', ky: 'Мен көптөн бери үнөмдөп жатам. Ишемби күнү иштесем, кошумча акча алам.' },
      { speaker: 'Nina', text: 'Dann bist du am Freitag nicht mehr im Team?', ru: 'Значит, в пятницу тебя уже нет в команде?', ky: 'Анда жума күнү сен жамаатта жоксуңбу?' },
      { speaker: 'Paul', text: 'Doch, aber nur am Telefon. Deshalb schreibe ich dir am Donnerstag eine Nachricht, wenn es Probleme gibt.', ru: 'Есть, но только по телефону. Поэтому в четверг я напишу тебе сообщение, если будут проблемы.', ky: 'Бар, бирок телефондо гана. Ошондуктан бейшемби күнү көйгөйлөр болсо, сага билдирүү жазам.' },
      { speaker: 'Nina', text: 'Gut. Ich finde die Idee gut.', ru: 'Хорошо. Мне идея нравится.', ky: 'Жакшы. Мага бул идея жагат.' },
      { speaker: 'Paul', text: 'Danke! Wenn du Fragen hast, ruf mich an.', ru: 'Спасибо! Если будут вопросы, позвони мне.', ky: 'Рахмат! Суроолоруң болсо, мага чал.' },
    ],
    questions: [
      { q: 'Warum macht Paul eine Weiterbildung?', options: ['Er möchte später mehr Geld verdienen.', 'Er hat keine Stelle.', 'Er mag die Firma nicht.'], answer: 0 },
      { q: 'Wie viele Tage arbeitet Paul deshalb?', options: ['Fünf Tage', 'Sechs Tage', 'Vier Tage'], answer: 2 },
      { q: 'Wann bekommt Paul extra Geld?', options: ['Wenn er Überstunden macht.', 'Wenn er am Samstag arbeitet.', 'Wenn er in Teilzeit ist.'], answer: 1 },
      { q: 'Was macht Paul, wenn es Probleme gibt?', options: ['Er schreibt Nina eine Nachricht.', 'Er kommt am Freitag.', 'Er ruft den Chef an.'], answer: 0 },
    ],
    keywords: ['Teilzeit', 'Weiterbildung', 'Zertifikat', 'Team', 'Nachricht'],
    source: UNIT_17_SOURCE,
  },
]

export const UNIT_17_READING: ReadingText[] = [
  {
    id: 'a2-re-17-01',
    unit: 17,
    level: 'A2',
    title: 'Mechaniker gesucht',
    body: [
      'Wir suchen: Mechaniker (m/w/d)',
      'Für unsere Werkstatt in Köln suchen wir ab Juni einen Mechaniker (m/w/d) in Vollzeit.',
      'Ihre Aufgaben: Autos reparieren, Kunden beraten, im Team arbeiten.',
      'Wir erwarten: eine Ausbildung als Mechaniker. Sie haben mindestens zwei Jahre Erfahrung und sprechen Deutsch. Teamarbeit ist für uns eine wichtige Fähigkeit.',
      'Wir bieten: einen Arbeitsvertrag für ein Jahr, 38 Stunden pro Woche und ein nettes Team.',
      'Wichtig: Wenn ein Arbeitnehmer kündigen möchte, schreibt er einen Brief. Eine Kündigung per E-Mail geht nicht.',
      'Ihre Bewerbung schicken Sie bitte an Frau Roth, Telefon 0221 123 456.',
    ],
    gloss: [
      { word: 'm/w/d', ru: 'м/ж/д: мужчина, женщина, другое — вакансия открыта для любого человека', ky: 'э/а/б: эркек, аял, башка — вакансия каалаган адамга ачык', example: 'Mechaniker (m/w/d) gesucht.', grammar: 'сокращение в вакансиях: männlich / weiblich / divers; профессия называется в мужской форме, но подходит всем', grammarKy: 'вакансиялардагы кыскартуу: männlich / weiblich / divers; кесип эркек формасында аталат, бирок баарына ылайыктуу', related: ['der Mechaniker', 'der Arbeitgeber'] },
      { word: 'Aufgaben', ru: 'задачи, обязанности', ky: 'милдеттер, тапшырмалар', example: 'Meine Aufgaben sind interessant.', grammar: 'die Aufgabe — задание; во множественном числе в объявлениях — «обязанности на работе»', grammarKy: 'die Aufgabe — тапшырма; көптүк санда жарыяларда — «жумуштагы милдеттер»', related: ['die Hausaufgabe', 'der Arbeitsvertrag'] },
      { word: 'ab Juni', ru: 'с июня', ky: 'июндан баштап', example: 'Ab Juni arbeite ich in Köln.', grammar: 'ab + месяц: начало с этого месяца; здесь говорить так не нужно, достаточно понимать', grammarKy: 'ab + ай: ушул айдан баштап; бул жерде өзүңүз айтпайсыз, түшүнүү жетиштүү', related: ['die Vollzeit', 'der Arbeitsvertrag'] },
      { word: 'mindestens', ru: 'не менее, по крайней мере', ky: 'эң аз дегенде', example: 'Der Kurs dauert mindestens drei Monate.', grammar: 'mindestens + число: нижняя граница; «mindestens zwei Jahre» = «два года или больше»', grammarKy: 'mindestens + сан: төмөнкү чек; «mindestens zwei Jahre» = «эки жыл же андан көп»', related: ['die Kenntnisse', 'das Zertifikat'] },
      { word: 'Bewerbung', ru: 'заявка на работу, пакет документов соискателя', ky: 'жумушка арыз, арызданын документтери', example: 'Ich schreibe meine Bewerbung.', grammar: 'die Bewerbung — существительное от sich bewerben; в вакансии — то, что вы отправляете работодателю', grammarKy: 'die Bewerbung — sich bewerben этишинен жасалган зат атооч; вакансияда — жумуш берүүчүгө жөнөтө турган документ', related: ['sich bewerben', 'das Vorstellungsgespräch'] },
    ],
    questions: [
      { q: 'Was ist eine Aufgabe im Job?', options: ['Autos verkaufen', 'Autos reparieren', 'Autos waschen'], answer: 1 },
      { q: 'Wie viel Erfahrung braucht der Bewerber?', options: ['Ein Jahr', 'Drei Jahre', 'Mindestens zwei Jahre'], answer: 2 },
      { q: 'Was bietet die Firma?', options: ['Einen Arbeitsvertrag für ein Jahr', 'Einen Vertrag für fünf Jahre', 'Nur Teilzeit'], answer: 0 },
    ],
    source: UNIT_17_SOURCE,
  },
  {
    id: 'a2-re-17-02',
    unit: 17,
    level: 'A2',
    title: 'Gestern habe ich angefangen',
    body: [
      'Gestern habe ich in der Bäckerei angefangen. Als ich um fünf Uhr in der Bäckerei war, hat mich der Chef begrüßt. Er hat mir das Team gezeigt, und ich habe meine Arbeitskleidung bekommen.',
      'Danach habe ich zwei Stunden Brötchen gemacht. Wenn ein Kunde kommt, helfe ich an der Kasse. Um elf Uhr hatte ich Pause. Am Ende war ich müde, aber glücklich. Morgen beginne ich wieder um fünf Uhr.',
    ],
    gloss: [
      { word: 'begrüßt', ru: 'поприветствовал', ky: 'саламдашты, тосуп алды', example: 'Der Chef hat mich begrüßt.', grammar: 'Partizip II от begrüßen; Perfekt: hat mich begrüßt — вспомогательный глагол hat на втором месте, Partizip II в конце', grammarKy: 'begrüßen этишинин Partizip II формасы; Perfekt: hat mich begrüßt — жардамчы этиш hat экинчи орунда, Partizip II аягында', related: ['grüßen', 'das Team'] },
      { word: 'Arbeitskleidung', ru: 'рабочая одежда', ky: 'жумуш кийими', example: 'Ich trage Arbeitskleidung.', grammar: 'составное существительное: die Arbeit + die Kleidung = die Arbeitskleidung (артикль — по последнему слову)', grammarKy: 'татаал зат атооч: die Arbeit + die Kleidung = die Arbeitskleidung (артикль акыркы сөз боюнча)', related: ['die Arbeitszeit', 'der Bäcker'] },
      { word: 'Brötchen', ru: 'булочки (небольшие)', ky: 'майда нан, булочка', example: 'Ich esse ein Brötchen.', grammar: 'das Brötchen — маленький хлеб; множественное число такое же: die Brötchen', grammarKy: 'das Brötchen — кичинекей нан; көптүк сан да ошондой: die Brötchen', related: ['der Bäcker', 'das Team'] },
      { word: 'an der Kasse', ru: 'на кассе', ky: 'кассада', example: 'Ich arbeite an der Kasse.', grammar: 'an + Dativ: место работы, «у кассы»; сочетание учится целиком', grammarKy: 'an + Dativ: иштеген жер, «кассанын жанында»; айкаш бүтүндөй жатталат', related: ['der Kunde', 'die Besprechung'] },
      { word: 'Am Ende', ru: 'в конце, под конец', ky: 'акырында, аягында', example: 'Am Ende war der Tag gut.', grammar: 'am Ende — время: «в конце дня / в итоге»; здесь достаточно узнавать', grammarKy: 'am Ende — убакыт: «күндүн аягында / акыры»; бул жерде тааный билүү жетиштүү', related: ['die Arbeitszeit', 'der Unterricht'] },
    ],
    questions: [
      { q: 'Was hat der Chef um fünf Uhr gemacht?', options: ['Er hat den Schreiber begrüßt.', 'Er hat ihm die Kasse gezeigt.', 'Er hat ihm Pause gegeben.'], answer: 0 },
      { q: 'Was macht der Schreiber, wenn ein Kunde kommt?', options: ['Er macht Brötchen.', 'Er hilft an der Kasse.', 'Er macht Pause.'], answer: 1 },
      { q: 'Wie fühlt sich der Schreiber am Ende?', options: ['Traurig', 'Wütend', 'Müde, aber glücklich'], answer: 2 },
    ],
    source: UNIT_17_SOURCE,
  },
]

export const UNIT_17_SPEAKING: SpeakingScenario[] = [
  {
    id: 'a2-sp-17-01',
    title: 'Im Vorstellungsgespräch',
    titleRu: 'На собеседовании',
    titleKy: 'Жумушка кабыл алуу маегинде',
    icon: '💼',
    level: 'A2',
    goal: {
      ru: 'Вы на собеседовании в пекарне (на «Sie»). Расскажите, чему вы учились, какой у вас опыт, почему вы хотите это место (с weil или deshalb) и когда вы можете начать.',
      ky: 'Сиз нан бышыруучу жайда жумушка кабыл алуу маегиндесиз («Sie» формасында). Эмнеге окуганыңызды, кандай тажрыйбаңыз бар экенин, эмне үчүн бул жерди каалаарыңызды (weil же deshalb менен) жана качан баштай аларыңызды айтыңыз.',
    },
    turns: [
      {
        ai: 'Guten Tag. Sie bewerben sich als Bäcker. Was haben Sie gelernt?',
        aiRu: 'Добрый день. Вы претендуете на место пекаря. Что вы изучали?',
        aiKy: 'Кайырлуу күн. Сиз нан бышыруучу болуп иштөө үчүн арыз бердиңиз. Эмнени окудуңуз?',
        hints: ['Ich habe eine Ausbildung als Bäcker gemacht.', 'Ich habe einen Kurs besucht und ein Zertifikat bekommen.'],
        keywords: ['ausbildung', 'zertifikat'],
      },
      {
        ai: 'Welche Erfahrung haben Sie?',
        aiRu: 'Какой у вас опыт?',
        aiKy: 'Сизде кандай тажрыйба бар?',
        hints: ['Ich habe drei Jahre in einer Bäckerei gearbeitet.', 'Als ich 20 war, habe ich in einer Bäckerei angefangen.'],
        keywords: ['jahre', 'als'],
      },
      {
        ai: 'Warum möchten Sie diese Stelle?',
        aiRu: 'Почему вы хотите это место?',
        aiKy: 'Эмне үчүн бул жумушту каалайсыз?',
        hints: ['Ich arbeite gern im Team, deshalb bewerbe ich mich.', 'Ich bewerbe mich, weil ich früh aufstehe.'],
        keywords: ['weil', 'deshalb'],
      },
      {
        ai: 'Wir bieten Vollzeit oder Teilzeit. Was möchten Sie? Und wann können Sie anfangen?',
        aiRu: 'Мы предлагаем полную или неполную занятость. Что вы хотите? И когда вы можете начать?',
        aiKy: 'Биз толук же толук эмес жумуш убактысын сунуштайбыз. Сиз эмнени каалайсыз? Жана качан баштай аласыз?',
        hints: ['Ich möchte in Vollzeit arbeiten.', 'Ich kann im Juni anfangen.'],
        keywords: ['vollzeit', 'juni'],
      },
    ],
    source: UNIT_17_SOURCE,
  },
]

export const UNIT_17_WRITING: WritingTask[] = [
  {
    id: 'a2-wr-17-01',
    unit: 17,
    level: 'A2',
    title: 'Mein Kurzprofil für ein Jobportal',
    situation: {
      ru: 'Вы создаёте короткий профиль на сайте вакансий (это не письмо, а текст от первого лица). Напишите: кто вы и какую работу ищете, чему вы учились, какой у вас опыт (Perfekt), одну причину с weil или deshalb, одно предложение с als или wenn и когда вы можете начать (полная или неполная занятость).',
      ky: 'Сиз вакансиялар сайтында кыска профиль түзүп жатасыз (бул кат эмес, биринчи жактан жазылган текст). Кимсиз жана кандай жумуш издеп жатасыз, эмнеге окудуңуз, кандай тажрыйбаңыз бар (Perfekt), weil же deshalb менен бир себеп, als же wenn менен бир сүйлөм жана качан баштай аласыз (толук же толук эмес жумуш убактысы) — жазыңыз.',
    },
    formal: false,
    minWords: 50,
    mustInclude: [
      { label: 'Wer sind Sie, welche Stelle suchen Sie (Ich bin … / Ich suche …)', patterns: ['ich bin', 'ich suche', 'ich möchte', 'bewerbe'] },
      { label: 'Ausbildung / Kurs / Zertifikat / Abschluss', patterns: ['ausbildung', 'kurs', 'zertifikat', 'abschluss'] },
      { label: 'Erfahrung im Perfekt (… gearbeitet / gemacht / gelernt)', patterns: ['gearbeitet', 'gemacht', 'gelernt', 'besucht', 'angefangen'] },
      { label: 'Grund mit weil oder deshalb / darum', patterns: ['weil ', 'deshalb', 'darum'] },
      { label: 'Satz mit als oder wenn', patterns: ['als ich', 'wenn ich'] },
      { label: 'Arbeitszeit und Beginn (Vollzeit / Teilzeit / anfangen)', patterns: ['vollzeit', 'teilzeit', 'anfangen'] },
    ],
    model:
      'Ich bin Aida Petrova und suche eine Stelle als Bäckerin. Ich habe in Bischkek eine Ausbildung als Bäckerin gemacht. Als ich 20 war, habe ich in einer Bäckerei angefangen, und ich habe drei Jahre dort gearbeitet. Jetzt wohne ich in Köln, deshalb suche ich hier eine neue Stelle. Ich arbeite gern im Team, weil ich gern mit Menschen spreche. Wenn ich früh anfange, bin ich sehr fit. Ich möchte in Vollzeit arbeiten und kann im Juni anfangen.',
    tips: [
      {
        ru: 'Это профиль, а не письмо: пишите от первого лица («Ich bin …», «Ich suche …»), без «Sehr geehrte …» и без «Mit freundlichen Grüßen».',
        ky: 'Бул профиль, кат эмес: биринчи жактан жазыңыз («Ich bin …», «Ich suche …»), «Sehr geehrte …» жана «Mit freundlichen Grüßen» жок.',
      },
      {
        ru: 'Опыт — в Perfekt: «Ich habe drei Jahre in einer Bäckerei gearbeitet». Образование: «Ich habe eine Ausbildung als … gemacht».',
        ky: 'Тажрыйба — Perfektте: «Ich habe drei Jahre in einer Bäckerei gearbeitet». Билим: «Ich habe eine Ausbildung als … gemacht».',
      },
      {
        ru: 'Причина: «…, deshalb suche ich hier eine Stelle» (глагол сразу после deshalb) или «…, weil ich gern im Team arbeite» (глагол в конце).',
        ky: 'Себеп: «…, deshalb suche ich hier eine Stelle» (этиш deshalb сөзүнөн кийин дароо) же «…, weil ich gern im Team arbeite» (этиш аягында).',
      },
      {
        ru: 'Als — одно событие в прошлом («Als ich 20 war, …»), wenn — повторяющееся или будущее («Wenn ich früh anfange, …»).',
        ky: 'Als — өткөндөгү бир жолку окуя («Als ich 20 war, …»), wenn — кайталануучу же келечектеги («Wenn ich früh anfange, …»).',
      },
    ],
    source: UNIT_17_SOURCE,
  },
]
