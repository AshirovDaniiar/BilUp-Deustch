import type { B1UnitMeta } from '../meta-types'
import { UNIT_29_SPEAKING_ID } from './unit'

/**
 * Unit 29 metadata: learning objectives (German + independent Russian and Kyrgyz), the classification of the three approved concepts — relative clause with Dativ and
 * preposition (P), Genitivattribut (R: the conservative, enforced classification; decision D-7 is OPEN, a closed productive set is the pending upgrade) and
 * Plusquamperfekt / nachdem (P; decision D-6 is OPEN, fallback receptive first) —, strands (communication repair for misunderstandings, a note on comparing without
 * stereotypes, Wortbildung, comparison phrases), the two micro-tasks (opinion with a comparison; factual hotel review), the spaced-revision set (Unit 28, Unit 26, A2 Unit 18).
 * The Russian and Kyrgyz texts are AI-assisted first drafts that no reviewer has checked. All travellers, hotels and companies are fictional; a custom is always
 * presented as a personal impression.
 */
export const UNIT_29_META: B1UnitMeta = {
  unit: 29,
  canDo: [
    {
      de: 'Ich kann von einer Reise erzählen und dabei sagen, was vorher passiert war (Plusquamperfekt, nachdem).',
      ru: 'Я могу рассказать о поездке и при этом сказать, что произошло раньше (Plusquamperfekt, nachdem).',
      ky: 'Мен саякат жөнүндө айтып, мурда эмне болгонун айта алам (Plusquamperfekt, nachdem).',
    },
    {
      de: 'Ich kann Orte und Personen mit Relativsätzen genauer beschreiben und Alltag und Bräuche als persönlichen Eindruck vergleichen.',
      ru: 'Я могу точнее описывать места и людей с помощью Relativsatz и сравнивать повседневную жизнь и обычаи как личное впечатление.',
      ky: 'Мен жерлерди жана адамдарды Relativsatz менен тагыраак сүрөттөп, күнүмдүк жашоону жана каада-салттарды жеке таасир катары салыштыра алам.',
    },
    {
      de: 'Ich kann ein Problem auf der Reise sachlich schildern und höflich um eine Lösung oder eine Entschädigung bitten.',
      ru: 'Я могу спокойно описать проблему в поездке и вежливо попросить о решении или компенсации.',
      ky: 'Мен саякаттагы көйгөйдү сабырдуу баяндап, чечим же компенсация сурай алам.',
    },
  ],
  objectives: {
    lesen: {
      de: 'Ich kann in einem Erfahrungsbericht und in einer Hotelbewertung Hintergrundereignisse, Vergleiche und einfache Genitivattribute erkennen.',
      ru: 'Я могу найти в рассказе об опыте и в отзыве об отеле предысторию, сравнения и простые Genitivattribut.',
      ky: 'Мен тажрыйба баянында жана мейманкана жөнүндөгү пикирде алдыңкы окуяларды, салыштырууларды жана жөнөкөй Genitivattributту таба алам.',
    },
    hoeren: {
      de: 'Ich kann ein Gespräch an der Hotelrezeption und ein Interview über zwei Alltage in den wichtigen Punkten verstehen.',
      ru: 'Я могу понять главное в разговоре на ресепшене отеля и в интервью о двух повседневных жизнях.',
      ky: 'Мен мейманкананын ресепшнинде болгон сүйлөшүүдө жана эки күнүмдүк жашоо жөнүндөгү маектеги негизги нерселерди түшүнө алам.',
    },
    sprechen: {
      de: 'Ich kann bei einem Zugausfall erklären, was passiert ist, eine Entschädigung verlangen und kurz Reisegewohnheiten vergleichen.',
      ru: 'Я могу при отмене поезда объяснить, что случилось, попросить компенсацию и коротко сравнить привычки в поездках.',
      ky: 'Мен поезд жокко чыгарылганда эмне болгонун түшүндүрүп, компенсация сурап, саякат адаттарын кыскача салыштыра алам.',
    },
    schreiben: {
      de: 'Ich kann einen Reisebericht schreiben und kurze Texte (Meinung mit Vergleich, sachliche Hotelbewertung).',
      ru: 'Я могу написать отчёт о поездке и короткие тексты (мнение со сравнением, деловой отзыв об отеле).',
      ky: 'Мен саякат баянын жана кыска тексттерди (салыштыруу менен пикир, мейманкана жөнүндө так баа) жаза алам.',
    },
  },
  differenceFromA2: {
    de: 'A2 (Unit 18) nennt Reiseziele, Verkehr und Buchungen; B1 erzählt Reiseerfahrungen mit Hintergrund, vergleicht Alltag und Bräuche, beschreibt Orte und Personen genauer und klärt Konflikte unterwegs.',
    ru: 'В A2 (юнит 18) вы называли места назначения, транспорт и бронирование; в B1 вы рассказываете об опыте поездок с предысторией, сравниваете повседневность и обычаи, точнее описываете места и людей и спокойно решаете конфликты в пути.',
    ky: 'A2 деңгээлинде (18-бөлүм) барчу жерлерди, транспортту жана заказ берүүнү атадыңыз; B1 деңгээлинде саякат тажрыйбасын алдыңкы окуялары менен айтасыз, күнүмдүк жашоону жана каада-салттарды салыштырасыз, жерлерди жана адамдарды тагыраак сүрөттөйсүз жана жолдогу келишпестиктерди сабырдуу чечесиз.',
  },
  concepts: [
    {
      conceptId: 'b1-relativsaetze-dativ-praeposition',
      proficiency: 'P',
      load: 'M',
      role: 'new',
    },
    {
      // RECEPTIVE: the Genitiv attribute is recognised in texts and never required in a gap, a word order, a writing checklist or a speaking prompt
      conceptId: 'b1-genitivattribute',
      proficiency: 'R',
      load: 'M',
      role: 'new',
    },
    {
      conceptId: 'b1-plusquamperfekt-nachdem',
      proficiency: 'P',
      load: 'M',
      role: 'new',
    },
  ],
  scenario: {
    id: UNIT_29_SPEAKING_ID,
    unexpectedElement: {
      de: 'Es gibt keine Entschädigung am Schalter: „Eine Entschädigung gibt es bei uns leider nur online, hier kann ich nur einen Gutschein geben.“ Der Lernende muss ruhig reagieren und nachfragen.',
      ru: 'Компенсацию на месте не дают: «Компенсацию у нас, к сожалению, можно получить только онлайн, здесь я могу выдать только ваучер». Нужно спокойно отреагировать и уточнить.',
      ky: 'Компенсация ошол жерде берилбейт: «Бизде компенсацияны, тилекке каршы, онлайн гана алса болот, бул жерде мен ваучер гана бере алам». Сабырдуу жооп берип, кайра сурап алуу керек.',
    },
  },
  strands: {
    repairChunks: [
      {
        de: 'Habe ich Sie richtig verstanden? Beides geht nicht?',
        ru: 'Я правильно вас понял? Ни то, ни другое невозможно?',
        ky: 'Мен сизди туура түшүндүмбү? Экөө тең мүмкүн эмеспи?',
      },
      {
        de: 'Könnten Sie das bitte anders erklären?',
        ru: 'Не могли бы вы объяснить это иначе?',
        ky: 'Муну башкача түшүндүрүп бере аласызбы?',
      },
      {
        de: 'Das war ein Missverständnis. Ich wollte sagen, dass …',
        ru: 'Это было недоразумение. Я хотел сказать, что …',
        ky: 'Бул түшүнбөстүк болду. Мен … деп айткым келген.',
      },
      {
        de: 'Bei mir zu Hause ist das anders. Wie ist das hier?',
        ru: 'У меня дома это по-другому. А как здесь?',
        ky: 'Менин үйүмдө бул башкача. Бул жерде кандай?',
      },
    ],
    strategyNote: {
      de: 'Vergleichen ohne Klischees: Sprich von deinen eigenen Erfahrungen („Mir ist aufgefallen …“, „In meiner Familie …“, „Das ist nur mein Eindruck“), nicht von ganzen Ländern oder Gruppen. Frage nach, wenn etwas unklar ist, und nimm eine Gewohnheit nicht als Regel für alle.',
      ru: 'Как сравнивать без клише: говорите о собственном опыте («Mir ist aufgefallen …», «In meiner Familie …», «Das ist nur mein Eindruck»), а не о целых странах или группах. Переспрашивайте, если что-то непонятно, и не принимайте одну привычку за правило для всех.',
      ky: 'Клишесиз салыштыруу: өз тажрыйбаңыз жөнүндө айтыңыз («Mir ist aufgefallen …», «In meiner Familie …», «Das ist nur mein Eindruck»), бүтүн өлкөлөр же топтор жөнүндө эмес. Бир нерсе түшүнүксүз болсо, кайра сурап алыңыз жана бир адатты баарына эреже катары кабыл албаңыз.',
    },
    wortbildungNote: {
      de: 'Wörter bilden: Nomen + Nomen: Reise + Panne = die Reisepanne, Zug + Ausfall = der Zugausfall, Kultur + Schock = der Kulturschock (der Artikel kommt vom letzten Wort). Aus Adjektiven werden Nomen mit -keit / -heit: höflich → die Höflichkeit, pünktlich → die Pünktlichkeit. Mit un- wird das Gegenteil: gewohnt → ungewohnt.',
      ru: 'Как образуются слова: существительное + существительное: Reise + Panne = die Reisepanne, Zug + Ausfall = der Zugausfall, Kultur + Schock = der Kulturschock (артикль берётся от последнего слова). Из прилагательных получаются существительные с -keit / -heit: höflich → die Höflichkeit, pünktlich → die Pünktlichkeit. С приставкой un- получается противоположное значение: gewohnt → ungewohnt.',
      ky: 'Сөздөр кантип түзүлөт: зат атооч + зат атооч: Reise + Panne = die Reisepanne, Zug + Ausfall = der Zugausfall, Kultur + Schock = der Kulturschock (артикль акыркы сөздөн алынат). Сын атоочтордон -keit / -heit менен зат атоочтор жасалат: höflich → die Höflichkeit, pünktlich → die Pünktlichkeit. un- приставкасы менен каршы маани пайда болот: gewohnt → ungewohnt.',
    },
    // comparison language ↻ Unit 22 (required in Unit 29): at least two of these occur in the readings, listenings or exercises
    comparisonPhrases: ['im Vergleich zu', 'im Gegensatz zu', 'anders als', 'dagegen'],
  },
  microTasks: [
    { kind: 'meinung', taskId: 'b1-wr-29-02' },
    { kind: 'note', taskId: 'b1-wr-29-03' },
  ],
  revision: {
    fromPrevious: ['v28-7', 'v28-15', 'v28-17', 'v28-18'],
    fromThirdBack: ['v26-3', 'v26-8'],
    fromA2: ['v18-4', 'v18-37'],
  },
}
