import type { B1UnitMeta } from '../meta-types'
import { UNIT_26_SPEAKING_ID } from './unit'

/**
 * Unit 26 metadata: learning objectives (German + independent Russian and Kyrgyz), the productive / limited-productive / receptive classification of the
 * three approved concepts (with the closed list of `lassen`), the receptive constructions, strands (listening strategy numbers and names, communication
 * repair, Wortbildung), the two micro-tasks (opinion and MEDIATION — partial coverage, no competence claim), topic evidence for book and film, and the
 * spaced-revision set. The Russian and Kyrgyz texts are AI-assisted first drafts that no reviewer has checked. The classification is the approved
 * product-design default; decision D-1 (`sich lassen` is receptive; the placement of the productive use is unconfirmed) is still OPEN.
 * All news, films and people in the unit are fictional.
 */
export const UNIT_26_META: B1UnitMeta = {
  unit: 26,
  canDo: [
    {
      de: 'Ich kann Nachrichten und Quellen beurteilen und Tatsache und Meinung unterscheiden.',
      ru: 'Я могу оценивать новости и источники и отличать факт от мнения.',
      ky: 'Мен жаңылыктарды жана булактарды баалап, фактыны пикирден айыра алам.',
    },
    {
      de: 'Ich kann wiedergeben, was jemand gesagt oder geschrieben hat.',
      ru: 'Я могу пересказать, что кто-то сказал или написал.',
      ky: 'Мен кимдир бирөө эмне айтканын же жазганын айтып бере алам.',
    },
    {
      de: 'Ich kann einen Film oder ein Buch empfehlen und Probleme mit Geräten schildern.',
      ru: 'Я могу порекомендовать фильм или книгу и описать проблемы с техникой.',
      ky: 'Мен тасманы же китепти сунуштап, техника менен болгон көйгөйлөрдү сүрөттөй алам.',
    },
  ],
  objectives: {
    lesen: {
      de: 'Ich kann in einer Meldung und in einem Leserkommentar Tatsachen, Meinungen und Quellen erkennen.',
      ru: 'Я могу в сообщении и в комментарии читателя распознать факты, мнения и источники.',
      ky: 'Мен кабарда жана окурмандын комментарийинде фактыларды, пикирлерди жана булактарды таба алам.',
    },
    hoeren: {
      de: 'Ich kann eine kurze Radionachricht und ein Gespräch im Handyshop in den wichtigen Punkten verstehen, besonders Zahlen und Namen.',
      ru: 'Я могу понять главное в короткой радионовости и в разговоре в магазине телефонов, особенно числа и названия.',
      ky: 'Мен кыска радио жаңылыгында жана телефон дүкөнүндөгү сүйлөшүүдө негизги нерселерди, айрыкча сандарды жана аттарды түшүнө алам.',
    },
    sprechen: {
      de: 'Ich kann den Inhalt eines Films erzählen, meinen Eindruck nennen, ihn empfehlen und eine Behauptung als Meinung erkennen.',
      ru: 'Я могу рассказать содержание фильма, назвать своё впечатление, порекомендовать его и распознать утверждение как мнение.',
      ky: 'Мен тасманын мазмунун айтып берип, таасиримди билдирип, аны сунуштап жана ырастоону пикир катары таанып аламын.',
    },
    schreiben: {
      de: 'Ich kann einen Kommentar zu einem Medienthema schreiben und eine Nachricht mit eigenen Worten weitergeben.',
      ru: 'Я могу написать комментарий к медиатеме и передать сообщение своими словами.',
      ky: 'Мен медиа темасына комментарий жазып, билдирүүнү өз сөзүм менен өткөрүп бере алам.',
    },
  },
  differenceFromA2: {
    de: 'A2 spricht über Freizeit und Vorlieben; B1 beurteilt Medien, nennt Risiken und Quellen und berichtet, was andere gesagt oder geschrieben haben.',
    ru: 'В A2 вы говорили о свободном времени и предпочтениях; в B1 вы оцениваете СМИ, называете риски и источники и сообщаете, что сказали или написали другие.',
    ky: 'A2 деңгээлинде сиз бош убакыт жана жактырган нерселер жөнүндө сүйлөдүңүз; B1 деңгээлинде басма сөздү баалайсыз, тобокелдиктерди жана булактарды атайсыз жана башкалар эмне айтканын же жазганын билдиресиз.',
  },
  concepts: [
    {
      conceptId: 'b1-passiv-praeteritum-modal',
      proficiency: 'P',
      load: 'M',
      role: 'new',
      // productive: Passiv Präsens with a modal verb; LIMITED-productive: Passiv Präteritum (wurde + Partizip II) on a closed list of verbs
      constructions: [
        {
          label: 'Passiv Präteritum (wurde + Partizip II): veröffentlichen, gründen, bauen, erfinden, eröffnen, absagen',
          proficiency: 'P-lim',
          forms: ['wurde', 'wurden'],
        },
      ],
    },
    {
      conceptId: 'b1-lassen',
      proficiency: 'P-lim',
      load: 'L',
      role: 'new',
      // the closed list: the learner is held to these expressions only
      closedList: [
        'etwas reparieren lassen',
        'etwas ändern lassen',
        'etwas prüfen lassen',
        'sich die Haare schneiden lassen',
        'sich etwas schicken lassen',
        'etwas liefern lassen',
      ],
      // RECEPTIVE: `sich lassen` (Das lässt sich lösen): glossed in one reading, never required (decision D-1 is open)
      constructions: [
        {
          label: 'sich lassen (Das lässt sich lösen)',
          proficiency: 'R',
          forms: ['lässt sich lösen', 'lässt sich erklären', 'lassen sich lösen', 'lassen sich erklären'],
        },
      ],
    },
    { conceptId: 'b1-wiedergeben-indikativ', proficiency: 'P', load: 'M', role: 'new' },
  ],
  receptiveOnly: [{ label: 'Partizip I als Adjektiv (die steigenden Besucherzahlen)', proficiency: 'R', forms: ['steigenden'] }],
  scenario: {
    id: UNIT_26_SPEAKING_ID,
    unexpectedElement: {
      de: 'Die Freundin sagt, dass im Netz steht: „Der Film ist langweilig.“ Der Lernende muss Meinung und Tatsache unterscheiden.',
      ru: 'Подруга говорит, что в сети пишут, будто фильм скучный: нужно отличить мнение от факта.',
      ky: 'Курбусу тармакта тасма зериктирет деп жазышат дейт: пикир менен фактыны айыруу керек.',
    },
  },
  strands: {
    repairChunks: [
      {
        de: 'Entschuldigung, wie war der Name noch einmal?',
        ru: 'Извините, как было название ещё раз?',
        ky: 'Кечиресиз, аталышы кандай болгон эле?',
      },
      {
        de: 'Woher weißt du das? Wo hast du das gelesen?',
        ru: 'Откуда ты это знаешь? Где ты это прочитал?',
        ky: 'Муну кайдан билесиң? Кайда окудуң?',
      },
      {
        de: 'Habe ich Sie richtig verstanden? Das Update ist kostenlos?',
        ru: 'Я правильно вас понял? Обновление бесплатное?',
        ky: 'Мен сизди туура түшүндүмбү? Жаңыртуу акысызбы?',
      },
      {
        de: 'Können Sie das bitte noch einmal langsam sagen?',
        ru: 'Не могли бы вы повторить это ещё раз медленно?',
        ky: 'Муну дагы бир жолу жайыраак айтып берсеңиз болобу?',
      },
    ],
    strategyNote: {
      de: 'Hörstrategie Zahlen und Namen: Höre zuerst auf Zahlen (Preis, Tag, Uhrzeit) und Namen (Ort, Person). Schreibe sie kurz auf. Bei Nachrichten steht das Wichtigste am Anfang.',
      ru: 'Стратегия аудирования «числа и названия»: сначала слушайте числа (цена, день, время) и названия (место, имя). Кратко записывайте их. В новостях главное стоит в начале.',
      ky: 'Угуу стратегиясы «сандар жана аттар»: адегенде сандарга (баа, күн, убакыт) жана аттарга (жер, адам) кулак салыңыз. Аларды кыскача жазып алыңыз. Жаңылыктарда эң маанилүүсү башында турат.',
    },
    wortbildungNote: {
      de: 'Wörter bilden: Verb → Nomen mit -ung (melden → die Meldung, handeln → die Handlung, werben → die Werbung). Person mit -er (lesen → der Leser, nutzen → der Nutzer, spielen → der Schauspieler). Zusammengesetzte Nomen: Daten + Schutz = der Datenschutz (der Artikel kommt vom letzten Wort). Mit un- bekommt ein Adjektiv das Gegenteil: seriös → unseriös.',
      ru: 'Как образуются слова: глагол → существительное с -ung (melden → die Meldung, handeln → die Handlung, werben → die Werbung). Человек с -er (lesen → der Leser, nutzen → der Nutzer, spielen → der Schauspieler). Составные существительные: Daten + Schutz = der Datenschutz (артикль берётся от последнего слова). Приставка un- даёт противоположное значение: seriös → unseriös.',
      ky: 'Сөздөр кантип түзүлөт: этиш → -ung менен зат атооч (melden → die Meldung, handeln → die Handlung, werben → die Werbung). Адам -er менен (lesen → der Leser, nutzen → der Nutzer, spielen → der Schauspieler). Татаал зат атоочтор: Daten + Schutz = der Datenschutz (артикль акыркы сөздөн алынат). un- приставкасы тескери маани берет: seriös → unseriös.',
    },
  },
  microTasks: [
    { kind: 'meinung', taskId: 'b1-wr-26-02' },
    { kind: 'mediation', taskId: 'b1-wr-26-03' },
  ],
  topics: [
    {
      topic: 'book-film',
      itemIds: ['v26-19', 'v26-20', 'v26-21', 'v26-22', 'v26-33', 'b1-re-26-02', UNIT_26_SPEAKING_ID],
    },
  ],
  revision: {
    fromPrevious: ['v25-34', 'v25-25', 'v25-23', 'v25-9'],
    fromThirdBack: ['v23-18', 'v23-20'],
    fromA2: ['v16-13', 'v16-14', 'v16-18', 'v16-20'],
  },
}
