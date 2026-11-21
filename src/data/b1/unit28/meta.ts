import type { B1UnitMeta } from '../meta-types'
import { UNIT_28_SPEAKING_ID } from './unit'

/**
 * Unit 28 metadata: learning objectives (German + independent Russian and Kyrgyz), the productive / limited-productive classification of the three approved
 * concepts (with the closed lists of Futur I and of the 20 verb + preposition pairs), the receptive `sodass`, strands (listening strategy, communication repair,
 * MEDIATION, Wortbildung), the THREE micro-tasks (opinion, mediation of a school letter / course information, apology note to the school), topic evidence for
 * school and Kita, the spaced-revision set and the Wiederholungsblock of Units 25–27. The Russian and Kyrgyz texts are AI-assisted first drafts that no reviewer
 * has checked. The classification is the approved product-design default; decision D-3 (Futur I productive only for forecasts and conjecture with `wohl`;
 * fallback: receptive only) is still OPEN. All schools, courses and people are fictional.
 */
export const UNIT_28_META: B1UnitMeta = {
  unit: 28,
  canDo: [
    {
      de: 'Ich kann über Ausbildung, Studium und Lernstrategien sprechen und Pläne, Vermutungen und Bedingungen ausdrücken.',
      ru: 'Я могу говорить об образовании, учёбе и стратегиях обучения и выражать планы, предположения и условия.',
      ky: 'Мен билим берүү, окуу жана окуу стратегиялары жөнүндө сүйлөп, пландарды, божомолдорду жана шарттарды билдире алам.',
    },
    {
      de: 'Ich kann mit Schule und Kita sprechen und einen Schulbrief oder eine Kursinfo in zwei, drei Sätzen weitergeben.',
      ru: 'Я могу говорить со школой и детским садом и пересказать школьное письмо или информацию о курсе в двух-трёх предложениях.',
      ky: 'Мен мектеп жана бала бакча менен сүйлөшүп, мектептин катын же курс жөнүндө маалыматты эки-үч сүйлөм менен айтып бере алам.',
    },
    {
      de: 'Ich kann Verben mit Präposition benutzen und mit wo(r)- und da(r)- fragen und antworten.',
      ru: 'Я могу использовать глаголы с предлогом, задавать вопросы и отвечать с wo(r)- и da(r)-.',
      ky: 'Мен предлогу бар этиштерди колдонуп, wo(r)- жана da(r)- менен суроо берип, жооп бере алам.',
    },
  ],
  objectives: {
    lesen: {
      de: 'Ich kann in einem Erfahrungsbericht und in einem Schulbrief Pläne, Bedingungen und Termine erkennen.',
      ru: 'Я могу найти в рассказе об опыте и в школьном письме планы, условия и сроки.',
      ky: 'Мен тажрыйба жөнүндөгү баянда жана мектептин катында пландарды, шарттарды жана мөөнөттөрдү таба алам.',
    },
    hoeren: {
      de: 'Ich kann eine Studienberatung und ein Telefonat mit der Kita in den wichtigen Punkten verstehen, besonders Fristen, Bedingungen und die unerwartete Auskunft.',
      ru: 'Я могу понять главное в консультации по учёбе и в телефонном разговоре с детским садом, особенно сроки, условия и неожиданную информацию.',
      ky: 'Мен окуу боюнча кеңеште жана бала бакча менен телефон сүйлөшүүдө негизги нерселерди, айрыкча мөөнөттөрдү, шарттарды жана күтүлбөгөн маалыматты түшүнө алам.',
    },
    sprechen: {
      de: 'Ich kann in einem Elterngespräch Fragen stellen, über Pläne sprechen und reagieren, wenn ein Platz nicht verfügbar ist.',
      ru: 'Я могу в беседе с учителем задавать вопросы, говорить о планах и реагировать, если место недоступно.',
      ky: 'Мен мугалим менен сүйлөшүүдө суроолорду берип, пландар жөнүндө айтып, орун жок болгондо жооп бере алам.',
    },
    schreiben: {
      de: 'Ich kann eine halbformelle Anfrage zu einem Kurs schreiben und kurze Texte (Meinung, Weitergabe einer Information, Entschuldigung an die Schule).',
      ru: 'Я могу написать полуформальный запрос о курсе и короткие тексты (мнение, пересказ информации, объяснительная в школу).',
      ky: 'Мен курс жөнүндө жарым расмий суроо жана кыска тексттерди (пикир, маалыматты айтып берүү, мектепке кечирим каты) жаза алам.',
    },
  },
  differenceFromA2: {
    de: 'A2 spricht über Freizeit und Vorlieben; B1 spricht über Ausbildung und Zukunft, drückt Pläne, Vermutungen und Bedingungen aus und kommuniziert mit Schule und Kita.',
    ru: 'В A2 вы говорили о свободном времени и предпочтениях; в B1 вы говорите об образовании и будущем, выражаете планы, предположения и условия и общаетесь со школой и детским садом.',
    ky: 'A2 деңгээлинде сиз бош убакыт жана жактырган нерселер жөнүндө сүйлөдүңүз; B1 деңгээлинде билим берүү жана келечек жөнүндө сүйлөйсүз, пландарды, божомолдорду жана шарттарды билдиресиз жана мектеп жана бала бакча менен байланышасыз.',
  },
  concepts: [
    {
      conceptId: 'b1-futur1-vermutungen',
      proficiency: 'P-lim',
      load: 'L',
      role: 'new',
      // the closed list of ten infinitives with werden (forecast; conjecture with wohl); decision D-3 is open
      closedList: ['sein', 'haben', 'kommen', 'gehen', 'schaffen', 'bestehen', 'lernen', 'studieren', 'arbeiten', 'geben'],
    },
    {
      conceptId: 'b1-falls-sobald-solange',
      proficiency: 'P',
      load: 'L',
      role: 'new',
      // RECEPTIVE: `sodass` (glossed in one reading, never required; productive in Unit 30)
      constructions: [{ label: 'sodass (Der Kurs ist online, sodass man überall lernen kann)', proficiency: 'R', forms: ['sodass'], receptiveThrough: 29 }],
    },
    {
      conceptId: 'b1-verben-praepositionen',
      proficiency: 'P-lim',
      load: 'M',
      role: 'new',
      // the closed list of 20 pairs (cap 20): Akkusativ first, then Dativ; the first six are the A2 pairs (revised)
      closedList: [
        'warten auf + Akk',
        'sich freuen auf + Akk',
        'denken an + Akk',
        'sich interessieren für + Akk',
        'sprechen über + Akk',
        'sich freuen über + Akk',
        'sich bewerben um + Akk',
        'sich ärgern über + Akk',
        'sich kümmern um + Akk',
        'sich entscheiden für + Akk',
        'sich vorbereiten auf + Akk',
        'hoffen auf + Akk',
        'achten auf + Akk',
        'sich erinnern an + Akk',
        'teilnehmen an + Dat',
        'träumen von + Dat',
        'abhängen von + Dat',
        'sich beschäftigen mit + Dat',
        'anfangen mit + Dat',
        'aufhören mit + Dat',
      ],
    },
  ],
  scenario: {
    id: UNIT_28_SPEAKING_ID,
    unexpectedElement: {
      de: 'Es gibt keinen Betreuungsplatz: „Für die Betreuung am Nachmittag ist leider kein Platz frei.“ Der Lernende muss höflich reagieren und eine Lösung suchen.',
      ru: 'Места для присмотра нет: «К сожалению, на присмотр во второй половине дня нет свободного места». Нужно вежливо отреагировать и искать решение.',
      ky: 'Бала багуу үчүн орун жок: «Тилекке каршы, түштөн кийинки бала багуу үчүн бош орун жок». Сылык жооп берип, чечим издөө керек.',
    },
  },
  strands: {
    repairChunks: [
      {
        de: 'Entschuldigung, wie war die Frist noch einmal?',
        ru: 'Извините, какой был срок ещё раз?',
        ky: 'Кечиресиз, мөөнөт кандай болгон эле?',
      },
      {
        de: 'Habe ich Sie richtig verstanden? Es ist kein Platz frei?',
        ru: 'Я правильно вас понял? Свободных мест нет?',
        ky: 'Мен сизди туура түшүндүмбү? Бош орун жокпу?',
      },
      {
        de: 'Könnten Sie mir das bitte schriftlich geben?',
        ru: 'Не могли бы вы дать мне это письменно?',
        ky: 'Муну мага жазуу жүзүндө бере аласызбы?',
      },
      {
        de: 'Gibt es eine Möglichkeit, auf die Warteliste zu kommen?',
        ru: 'Есть ли возможность попасть в список ожидания?',
        ky: 'Күтүү тизмесине кирүүгө мүмкүнчүлүк барбы?',
      },
    ],
    strategyNote: {
      de: 'Informationen weitergeben (Mediation): Lies den Brief oder die Kursinfo zuerst nach Fakten (Wer? Wann? Wie viel? Bis wann?). Gib dann nur diese Fakten in zwei, drei Sätzen weiter („Die Kursinfo schreibt, dass …“) und bewerte nichts.',
      ru: 'Как передать информацию (медиация): сначала прочитайте письмо или информацию о курсе, ища факты (Кто? Когда? Сколько? До какого срока?). Затем передайте только эти факты в двух-трёх предложениях («Die Kursinfo schreibt, dass …») и ничего не оценивайте.',
      ky: 'Маалыматты кантип өткөрүү (медиация): адегенде катты же курс жөнүндө маалыматты окуп, фактыларды издеңиз (Ким? Качан? Канча? Качанга чейин?). Андан кийин ушул фактыларды эки-үч сүйлөм менен гана өткөрүңүз («Die Kursinfo schreibt, dass …») жана эч нерсени баалабаңыз.',
    },
    wortbildungNote: {
      de: 'Wörter bilden: Nomen + Nomen: Schul + System = das Schulsystem, Lern + Plan = der Lernplan, Kurs + Gebühr = die Kursgebühr, Eltern + Abend = der Elternabend (der Artikel kommt vom letzten Wort). Verb → Nomen mit -ung: betreuen → die Betreuung, bescheinigen → die Bescheinigung. Person mit -er: teilnehmen → der Teilnehmer. -pflichtig: kostenpflichtig = man muss bezahlen.',
      ru: 'Как образуются слова: существительное + существительное: Schul + System = das Schulsystem, Lern + Plan = der Lernplan, Kurs + Gebühr = die Kursgebühr, Eltern + Abend = der Elternabend (артикль берётся от последнего слова). Глагол → существительное с -ung: betreuen → die Betreuung, bescheinigen → die Bescheinigung. Человек с -er: teilnehmen → der Teilnehmer. -pflichtig: kostenpflichtig = нужно платить.',
      ky: 'Сөздөр кантип түзүлөт: зат атооч + зат атооч: Schul + System = das Schulsystem, Lern + Plan = der Lernplan, Kurs + Gebühr = die Kursgebühr, Eltern + Abend = der Elternabend (артикль акыркы сөздөн алынат). Этиш → -ung менен зат атооч: betreuen → die Betreuung, bescheinigen → die Bescheinigung. Адам -er менен: teilnehmen → der Teilnehmer. -pflichtig: kostenpflichtig = акы төлөө керек.',
    },
  },
  microTasks: [
    { kind: 'meinung', taskId: 'b1-wr-28-02' },
    { kind: 'mediation', taskId: 'b1-wr-28-03' },
    { kind: 'note', taskId: 'b1-wr-28-04' },
  ],
  topics: [
    {
      topic: 'school-kita',
      itemIds: ['v28-8', 'v28-19', 'v28-20', 'v28-21', 'v28-22', 'b1-re-28-01', 'b1-li-28-02', 'b1-wr-28-04', UNIT_28_SPEAKING_ID],
    },
  ],
  revision: {
    fromPrevious: ['v27-20', 'v27-21', 'v27-10', 'v27-14'],
    fromThirdBack: ['v25-9', 'v25-11'],
    fromA2: ['v14-24', 'v15-30'],
    // Wiederholungsblock (curriculum v2: Units 24, 28, 32): words of Units 25–27 for one dedicated review round
    block: [
      'v25-1',
      'v25-3',
      'v25-9',
      'v25-10',
      'v25-11',
      'v25-19',
      'v25-20',
      'v25-22',
      'v25-25',
      'v26-2',
      'v26-4',
      'v26-11',
      'v26-12',
      'v26-14',
      'v26-19',
      'v26-21',
      'v27-1',
      'v27-2',
      'v27-10',
      'v27-14',
      'v27-20',
      'v27-21',
    ],
  },
}
