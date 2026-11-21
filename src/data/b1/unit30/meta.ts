import type { B1UnitMeta } from '../meta-types'
import { UNIT_30_SPEAKING_ID } from './unit'

/**
 * Unit 30 metadata: learning objectives (German + independent Russian and Kyrgyz), the classification of the three approved concepts — Nomen-Verb-Verbindungen (P-lim, a CLOSED
 * list of 20; decision D-8 open, fallback receptive only), `sodass` / `so … dass` / `damit` / `um … zu` (P; `sodass` was receptive in Unit 28 and is productive from here) and
 * the text-structuring words (P-lim, a closed list) —, strands (respectful disagreement, a short structured talk, Wortbildung), the two micro-tasks (opinion; message to the
 * neighbours) and the spaced-revision set (Unit 29, Unit 27, A2). The Russian and Kyrgyz texts are AI-assisted first drafts that no reviewer has checked. All associations,
 * neighbourhoods and people are fictional; opinions on community matters are shown as the views of named persons.
 */
export const UNIT_30_META: B1UnitMeta = {
  unit: 30,
  canDo: [
    {
      de: 'Ich kann über Ehrenamt, Nachbarschaft und das Zusammenleben verschiedener Menschen sprechen und meine Meinung respektvoll sagen.',
      ru: 'Я могу говорить об общественной работе, соседях и совместной жизни разных людей и уважительно высказывать своё мнение.',
      ky: 'Мен коомдук иш, кошуналар жана ар түрдүү адамдардын бирге жашоосу жөнүндө сүйлөп, өз пикиримди сый менен айта алам.',
    },
    {
      de: 'Ich kann Ziel und Folge ausdrücken (damit, um … zu, sodass, so … dass) und Nomen-Verb-Verbindungen aus der Liste benutzen.',
      ru: 'Я могу выражать цель и следствие (damit, um … zu, sodass, so … dass) и использовать пары «существительное + глагол» из списка.',
      ky: 'Мен максатты жана натыйжаны билдире алам (damit, um … zu, sodass, so … dass) жана тизмедеги «зат атооч + этиш» жуптарын колдоно алам.',
    },
    {
      de: 'Ich kann einen kurzen Vortrag und einen Text gliedern (Einleitung – zwei Punkte – Schluss) und dabei erstens, außerdem, dennoch und daher benutzen.',
      ru: 'Я могу структурировать короткое выступление и текст (вступление — два пункта — заключение), используя erstens, außerdem, dennoch и daher.',
      ky: 'Мен кыска чыгууну жана текстти (киришүү — эки пункт — жыйынтык) erstens, außerdem, dennoch жана daher колдонуп түзө алам.',
    },
  ],
  objectives: {
    lesen: {
      de: 'Ich kann in einer Reportage und in zwei Leserbriefen Ziele, Folgen und unterschiedliche Meinungen erkennen.',
      ru: 'Я могу найти в репортаже и в двух письмах в газету цели, следствия и разные мнения.',
      ky: 'Мен репортажда жана гезитке жазылган эки катта максаттарды, натыйжаларды жана ар кандай пикирлерди таба алам.',
    },
    hoeren: {
      de: 'Ich kann ein Interview mit einer Vereinsvorsitzenden und eine Anwohnerversammlung in den wichtigen Punkten verstehen, auch wenn Meinungen verschieden sind.',
      ru: 'Я могу понять главное в интервью с председателем объединения и в собрании жильцов, даже если мнения расходятся.',
      ky: 'Мен бирикменин төрагасы менен болгон маектеги жана тургундардын чогулушундагы негизги нерселерди, пикирлер ар башка болсо да, түшүнө алам.',
    },
    sprechen: {
      de: 'Ich kann einen kurzen Vortrag über ein Nachbarschaftsprojekt halten, auf einen Einwand respektvoll reagieren und andere zum Mitmachen einladen.',
      ru: 'Я могу сделать короткое выступление о проекте для соседей, уважительно ответить на возражение и пригласить других участвовать.',
      ky: 'Мен кошуналар үчүн долбоор жөнүндө кыска чыгуу жасай алам, каршылыкка сый менен жооп берип, башкаларды катышууга чакыра алам.',
    },
    schreiben: {
      de: 'Ich kann einen Leserbrief zu einem Nachbarschaftsprojekt schreiben und kurze Texte (Meinung, Nachricht an die Nachbarn).',
      ru: 'Я могу написать письмо в газету о проекте для соседей и короткие тексты (мнение, сообщение соседям).',
      ky: 'Мен кошуналар үчүн долбоор жөнүндө гезитке кат жана кыска тексттерди (пикир, кошуналарга билдирүү) жаза алам.',
    },
  },
  concepts: [
    {
      conceptId: 'b1-nomen-verb-verbindungen',
      proficiency: 'P-lim',
      load: 'M',
      role: 'new',
      // the closed list of 20 expressions (cap 20): the learner is held to these only; decision D-8 is open (fallback: receptive only)
      closedList: [
        'eine Entscheidung treffen',
        'Kontakt aufnehmen',
        'in Kontakt bleiben',
        'Verantwortung übernehmen',
        'einen Beitrag leisten',
        'Hilfe leisten',
        'Rücksicht nehmen',
        'zur Verfügung stehen',
        'zur Verfügung stellen',
        'in Frage kommen',
        'eine Rolle spielen',
        'Interesse zeigen',
        'Bescheid geben',
        'Stellung nehmen',
        'zur Sprache kommen',
        'Unterstützung finden',
        'einen Vorschlag machen',
        'in Anspruch nehmen',
        'Erfahrungen sammeln',
        'eine Frage stellen',
      ],
    },
    {
      conceptId: 'b1-konsekutiv-final',
      proficiency: 'P',
      load: 'M',
      role: 'new',
    },
    {
      conceptId: 'b1-textkohaesion',
      proficiency: 'P-lim',
      load: 'L',
      role: 'new',
      // the closed list of the text-structuring words: the curriculum six plus `zweitens` (the pair of `erstens`)
      closedList: ['erstens', 'zweitens', 'außerdem', 'darüber hinaus', 'dennoch', 'daher', 'zum Beispiel'],
    },
  ],
  scenario: {
    id: UNIT_30_SPEAKING_ID,
    unexpectedElement: {
      de: 'Ein Zuhörer erhebt einen Einwand: „Ist das nicht zu teuer? Wer soll das bezahlen?“ Der Lernende muss respektvoll reagieren und eine Lösung nennen.',
      ru: 'Слушатель возражает: «Разве это не слишком дорого? Кто будет за это платить?» Нужно уважительно ответить и назвать решение.',
      ky: 'Угуучу каршы чыгат: «Бул өтө кымбат эмеспи? Муну ким төлөйт?» Сый менен жооп берип, чечимди айтуу керек.',
    },
  },
  strands: {
    repairChunks: [
      {
        de: 'Habe ich Sie richtig verstanden? Sie machen sich Sorgen, weil es teuer ist?',
        ru: 'Я правильно вас понял? Вы беспокоитесь, потому что это дорого?',
        ky: 'Мен сизди туура түшүндүмбү? Сиз кымбат болгондуктан тынчсызданып жатасызбы?',
      },
      {
        de: 'Das ist ein berechtigter Einwand. Darüber möchte ich nachdenken.',
        ru: 'Это обоснованное возражение. Я хочу над этим подумать.',
        ky: 'Бул орундуу каршылык. Мен муну ойлонгум келет.',
      },
      {
        de: 'Könnten Sie das bitte noch einmal anders erklären?',
        ru: 'Не могли бы вы объяснить это ещё раз иначе?',
        ky: 'Муну дагы бир жолу башкача түшүндүрүп бере аласызбы?',
      },
      {
        de: 'Ich verstehe Ihre Meinung. Wir können zusammen eine Lösung suchen.',
        ru: 'Я понимаю вашу точку зрения. Мы можем вместе поискать решение.',
        ky: 'Мен сиздин пикириңизди түшүнөм. Биз чогуу чечим издей алабыз.',
      },
    ],
    strategyNote: {
      de: 'Respektvoll diskutieren und kurz sprechen: Gliedere deinen Vortrag in Einleitung, zwei Punkte und Schluss. Nenne bei einem Einwand zuerst, was du verstehst („Das ist ein berechtigter Einwand“), und dann deine Sicht. Sprich von deiner Meinung („Ich finde“), nicht von „den Jungen“, „den Alten“ oder anderen Gruppen.',
      ru: 'Как спорить уважительно и говорить коротко: разделите выступление на вступление, два пункта и заключение. При возражении сначала назовите, что вы понимаете («Das ist ein berechtigter Einwand»), а потом свою точку зрения. Говорите о своём мнении («Ich finde»), а не о «молодых», «старых» или других группах.',
      ky: 'Сый менен талашуу жана кыска сүйлөө: чыгууңузду киришүү, эки пункт жана жыйынтыкка бөлүңүз. Каршылык болгондо адегенде эмнени түшүнгөнүңүздү айтыңыз («Das ist ein berechtigter Einwand»), анан өз көз карашыңызды. Өз пикириңиз жөнүндө айтыңыз («Ich finde»), «жаштар», «карылар» же башка топтор жөнүндө эмес.',
    },
    wortbildungNote: {
      de: 'Wörter bilden: Nomen + Nomen: Nachbarschaft + Hilfe = die Nachbarschaftshilfe, Familie + Modell = das Familienmodell, Treff + Punkt = der Treffpunkt, Stadt + Teil = der Stadtteil (der Artikel kommt vom letzten Wort). Mit -schaft entsteht ein Nomen für eine Gruppe oder einen Zustand: die Gemeinschaft. Mit -ung wird aus einem Verb ein Nomen: versammeln → die Versammlung, unterstützen → die Unterstützung. Adjektive mit -lich und -ig: ehrenamtlich, freiwillig.',
      ru: 'Как образуются слова: существительное + существительное: Nachbarschaft + Hilfe = die Nachbarschaftshilfe, Familie + Modell = das Familienmodell, Treff + Punkt = der Treffpunkt, Stadt + Teil = der Stadtteil (артикль берётся от последнего слова). С -schaft получается существительное для группы или состояния: die Gemeinschaft. С -ung из глагола получается существительное: versammeln → die Versammlung, unterstützen → die Unterstützung. Прилагательные на -lich и -ig: ehrenamtlich, freiwillig.',
      ky: 'Сөздөр кантип түзүлөт: зат атооч + зат атооч: Nachbarschaft + Hilfe = die Nachbarschaftshilfe, Familie + Modell = das Familienmodell, Treff + Punkt = der Treffpunkt, Stadt + Teil = der Stadtteil (артикль акыркы сөздөн алынат). -schaft менен топ же абал үчүн зат атооч пайда болот: die Gemeinschaft. -ung менен этиштен зат атооч жасалат: versammeln → die Versammlung, unterstützen → die Unterstützung. -lich жана -ig менен бүткөн сын атоочтор: ehrenamtlich, freiwillig.',
    },
  },
  microTasks: [
    { kind: 'meinung', taskId: 'b1-wr-30-02' },
    { kind: 'note', taskId: 'b1-wr-30-03' },
  ],
  revision: {
    fromPrevious: ['v29-17', 'v29-26', 'v29-27', 'v29-38'],
    fromThirdBack: ['v27-20', 'v27-39'],
    fromA2: ['v19-30', 'v13-25'],
  },
}
