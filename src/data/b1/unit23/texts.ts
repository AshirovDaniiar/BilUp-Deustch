import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_23_SOURCE, UNIT_23_SPEAKING_ID } from './unit'

/**
 * Unit 23 texts: 2 listening scripts, 2 readings, 1 speaking scenario, 1 writing task. Targets of the band for Units 23–26: reading 120–180 words,
 * listening 120–160, sentences ≤ 24 words (95th percentile ≤ 18), 6 speaking turns, writing 70–80 words. Original material; the Kyrgyz is an AI-assisted
 * first draft that has not been reviewed by a native speaker.
 * Scope guard (curriculum v2): relative clauses only with the pronoun in the Nominativ or Akkusativ (der, die, das, den); zu-Infinitiv and um … zu;
 * `ohne … zu` and `statt … zu` appear in ONE reading only, glossed (receptive). No damit, Passiv, Konjunktiv II, Genitiv, adjectives without article, relative
 * clauses with a preposition or Dativ, and no verb with an obligatory prepositional object (Unit 28).
 * Listening: the dialogues are played with the browser's text-to-speech (the existing mechanism of the listening lab). That playback has NOT been
 * verified on real devices, so no final-test item depends on audio.
 */
export const UNIT_23_LISTENING: ListeningExercise[] = [
  {
    id: 'b1-li-23-01',
    unit: 23,
    level: 'B1',
    title: 'Das Vorstellungsgespräch',
    lines: [
      {
        speaker: 'Frau Becker',
        text: 'Guten Tag, Herr Aydin. Schön, dass Sie da sind. Bitte nehmen Sie Platz.',
        ru: 'Добрый день, господин Айдын. Хорошо, что вы пришли. Присаживайтесь, пожалуйста.',
        ky: 'Кайырлуу күн, Айдын мырза. Келгениңиз жакшы болду. Отуруңуз, сураныч.',
      },
      {
        speaker: 'Herr Aydin',
        text: 'Guten Tag, Frau Becker. Vielen Dank für die Einladung.',
        ru: 'Добрый день, госпожа Беккер. Большое спасибо за приглашение.',
        ky: 'Кайырлуу күн, Беккер айым. Чакыргандыгыңыз үчүн чоң рахмат.',
      },
      {
        speaker: 'Frau Becker',
        text: 'Sie möchten bei uns im Lager arbeiten. Was haben Sie vorher gemacht?',
        ru: 'Вы хотите работать у нас на складе. Что вы делали раньше?',
        ky: 'Сиз бизде кампада иштегиңиз келет. Мурун эмне кылдыңыз?',
      },
      {
        speaker: 'Herr Aydin',
        text: 'Ich habe vier Jahre in einer Firma gearbeitet, die Pakete verschickt.',
        ru: 'Я четыре года работал в фирме, которая отправляет посылки.',
        ky: 'Мен төрт жыл посылкаларды жөнөтүүчү фирмада иштедим.',
      },
      {
        speaker: 'Frau Becker',
        text: 'Das klingt gut. Was war dort Ihre wichtigste Aufgabe?',
        ru: 'Звучит хорошо. Какова была там ваша главная обязанность?',
        ky: 'Жакшы угулат. Ал жерде сиздин эң маанилүү милдетиңиз эмне болду?',
      },
      {
        speaker: 'Herr Aydin',
        text: 'Ich habe die Pakete sortiert, die am Morgen gekommen sind, und die Fahrer eingeteilt.',
        ru: 'Я сортировал посылки, которые приходили утром, и распределял водителей.',
        ky: 'Мен эртең менен келген посылкаларды иргеп, айдоочуларды бөлүштүрдүм.',
      },
      {
        speaker: 'Frau Becker',
        text: 'Und was sind Ihre Stärken?',
        ru: 'А каковы ваши сильные стороны?',
        ky: 'Ал эми сиздин күчтүү жактарыңыз кандай?',
      },
      {
        speaker: 'Herr Aydin',
        text: 'Ich bin zuverlässig und arbeite selbstständig. Eine Schwäche ist, dass ich manchmal zu viel arbeite.',
        ru: 'Я надёжен и работаю самостоятельно. Моя слабая сторона — иногда я слишком много работаю.',
        ky: 'Мен ишенимдүүмүн жана өз алдынча иштейм. Алсыз жагым — кээде өтө көп иштейм.',
      },
      {
        speaker: 'Frau Becker',
        text: 'Warum möchten Sie die Firma wechseln?',
        ru: 'Почему вы хотите сменить фирму?',
        ky: 'Эмне үчүн фирманы алмаштыргыңыз келет?',
      },
      {
        speaker: 'Herr Aydin',
        text: 'Ich suche eine Arbeit, die näher an meinem Wohnort ist, um mehr Zeit für meine Familie zu haben.',
        ru: 'Я ищу работу поближе к дому, чтобы больше времени проводить с семьёй.',
        ky: 'Мен үй-бүлөм үчүн көбүрөөк убакыт болушу үчүн, жашаган жериме жакыныраак жумуш издеп жатам.',
      },
      {
        speaker: 'Frau Becker',
        text: 'Es ist wichtig, im Team zu arbeiten. Können Sie das?',
        ru: 'Важно уметь работать в команде. Вы это умеете?',
        ky: 'Командада иштей билүү маанилүү. Сиз буга жөндөмдүүсүзбү?',
      },
      {
        speaker: 'Herr Aydin',
        text: 'Ja, das gefällt mir. Ich habe immer versucht, meinen Kollegen zu helfen.',
        ru: 'Да, мне это нравится. Я всегда старался помогать своим коллегам.',
        ky: 'Ооба, бул мага жагат. Мен дайыма кесиптештериме жардам берүүгө аракет кылганмын.',
      },
      {
        speaker: 'Frau Becker',
        text: 'Gut. Die Probezeit dauert sechs Monate. Sie hören bald von uns.',
        ru: 'Хорошо. Испытательный срок — шесть месяцев. Вы скоро получите от нас ответ.',
        ky: 'Жакшы. Сынак мөөнөтү алты ай. Жакында биздин жообубузду угасыз.',
      },
      {
        speaker: 'Herr Aydin',
        text: 'Das ist in Ordnung. Vielen Dank, Frau Becker. Auf Wiedersehen.',
        ru: 'Хорошо. Большое спасибо, госпожа Беккер. До свидания.',
        ky: 'Макул. Чоң рахмат, Беккер айым. Кайра көрүшкөнчө.',
      },
    ],
    questions: [
      {
        q: 'Was hat Herr Aydin vorher gemacht?',
        options: ['Er hat in einer Firma für Pakete gearbeitet.', 'Er hat lange in einer Werkstatt Autos repariert.', 'Er war Student.'],
        answer: 0,
      },
      {
        q: 'Warum sucht er eine neue Arbeit?',
        options: [
          'Er will mehr Geld verdienen.',
          'Er möchte näher am Wohnort arbeiten und mehr Zeit für die Familie haben.',
          'Die Firma hat ihn entlassen.',
        ],
        answer: 1,
      },
      {
        q: 'Was sagt Herr Aydin über seine Schwäche?',
        options: ['Er kommt oft zu spät.', 'Er kann nicht im Team arbeiten.', 'Er arbeitet manchmal zu viel.'],
        answer: 2,
      },
      { q: 'Wie lange dauert die Probezeit?', options: ['Drei Monate.', 'Sechs Monate.', 'Ein Jahr.'], answer: 1 },
    ],
    keywords: ['Aufgabe', 'Stärke', 'Schwäche', 'Probezeit', 'selbstständig'],
    source: UNIT_23_SOURCE,
  },
  {
    id: 'b1-li-23-02',
    unit: 23,
    level: 'B1',
    title: 'Ein Anruf in der Personalabteilung',
    lines: [
      {
        speaker: 'Frau Köhler',
        text: 'Personalabteilung, Köhler. Guten Morgen.',
        ru: 'Отдел кадров, Кёлер. Доброе утро.',
        ky: 'Кадрлар бөлүмү, Кёлер. Куттуу таң.',
      },
      {
        speaker: 'Herr Berger',
        text: 'Guten Morgen, Frau Köhler. Hier ist Tom Berger. Ich habe morgen einen Termin bei Ihnen.',
        ru: 'Доброе утро, госпожа Кёлер. Это Том Бергер. У меня завтра встреча у вас.',
        ky: 'Куттуу таң, Кёлер айым. Бул Том Бергер. Менин эртең сизде жолугушуум бар.',
      },
      {
        speaker: 'Frau Köhler',
        text: 'Ja, Herr Berger, das Vorstellungsgespräch um zehn Uhr. Gibt es ein Problem?',
        ru: 'Да, господин Бергер, собеседование в десять часов. Что-то случилось?',
        ky: 'Ооба, Бергер мырза, саат ондогу маек. Бир көйгөй барбы?',
      },
      {
        speaker: 'Herr Berger',
        text: 'Leider ja. Ich bin krank und habe Fieber. Ich rufe an, um den Termin abzusagen.',
        ru: 'К сожалению, да. Я болен, у меня температура. Я звоню, чтобы отменить встречу.',
        ky: 'Тилекке каршы, ооба. Мен ооруп калдым, ысытмам бар. Жолугушууну жокко чыгаруу үчүн чалып жатам.',
      },
      {
        speaker: 'Frau Köhler',
        text: 'Das tut mir leid. Haben Sie schon eine Krankmeldung?',
        ru: 'Мне очень жаль. У вас уже есть больничный?',
        ky: 'Абдан өкүнүчтүү. Ооруп калганыңыз жөнүндө билдирүүңүз барбы?',
      },
      {
        speaker: 'Herr Berger',
        text: 'Ja, ich habe sie heute vom Arzt bekommen. Ich schicke sie Ihnen per E-Mail.',
        ru: 'Да, я получил её сегодня у врача. Я отправлю её вам по электронной почте.',
        ky: 'Ооба, мен аны бүгүн дарыгерден алдым. Мен аны сизге электрондук почта аркылуу жиберем.',
      },
      {
        speaker: 'Frau Köhler',
        text: 'Das ist nicht nötig. Wir verschieben das Gespräch einfach.',
        ru: 'Это не нужно. Мы просто перенесём собеседование.',
        ky: 'Бул керек эмес. Биз маекти жөн гана жылдырабыз.',
      },
      {
        speaker: 'Herr Berger',
        text: 'Danke. Ich habe noch eine Frage: Ist die Frist für meine Unterlagen schon vorbei?',
        ru: 'Спасибо. У меня ещё вопрос: срок для моих документов уже прошёл?',
        ky: 'Рахмат. Дагы бир суроом бар: документтерим үчүн мөөнөт өтүп кеттиби?',
      },
      {
        speaker: 'Frau Köhler',
        text: 'Nein, Ihre Unterlagen sind rechtzeitig angekommen. Das ist kein Problem.',
        ru: 'Нет, ваши документы пришли вовремя. Это не проблема.',
        ky: 'Жок, документтериңиз өз убагында келди. Бул көйгөй эмес.',
      },
      {
        speaker: 'Herr Berger',
        text: 'Wann kann ich mich vorstellen?',
        ru: 'Когда я смогу прийти на собеседование?',
        ky: 'Качан маекке келе алам?',
      },
      {
        speaker: 'Frau Köhler',
        text: 'Nächste Woche, am Dienstag um zehn Uhr. Der Chef, den Sie kennenlernen sollen, ist dann wieder im Büro.',
        ru: 'На следующей неделе, во вторник в десять часов. Начальник, с которым вам нужно познакомиться, будет тогда снова в офисе.',
        ky: 'Кийинки жумада, шейшембиде саат ондо. Таанышышыңыз керек болгон начальник ошондо кайрадан кеңседе болот.',
      },
      {
        speaker: 'Herr Berger',
        text: 'Perfekt. Dann bin ich wieder gesund. Vielen Dank für Ihr Verständnis.',
        ru: 'Отлично. Тогда я буду снова здоров. Большое спасибо за ваше понимание.',
        ky: 'Эң сонун. Ошондо мен кайра дени сак болом. Түшүнгөнүңүз үчүн чоң рахмат.',
      },
      {
        speaker: 'Frau Köhler',
        text: 'Gute Besserung, Herr Berger. Bis Dienstag.',
        ru: 'Скорейшего выздоровления, господин Бергер. До вторника.',
        ky: 'Тез айыгып кетиңиз, Бергер мырза. Шейшембиге чейин.',
      },
    ],
    questions: [
      {
        q: 'Warum ruft Herr Berger an?',
        options: ['Er will die Stelle absagen, weil er eine andere hat.', 'Er will den Termin absagen, weil er krank ist.', 'Er hat die Frist verpasst.'],
        answer: 1,
      },
      {
        q: 'Was sagt Frau Köhler zur Krankmeldung?',
        options: ['Sie braucht sie sofort.', 'Sie ist nicht nötig.', 'Er soll sie per Post schicken.'],
        answer: 1,
      },
      { q: 'Wann ist das neue Gespräch?', options: ['Am Freitag.', 'Am Montag.', 'Am Dienstag.'], answer: 2 },
      {
        q: 'Sind die Unterlagen rechtzeitig angekommen?',
        options: ['Ja, es gibt kein Problem.', 'Nein, sie fehlen noch.', 'Das weiß man nicht.'],
        answer: 0,
      },
    ],
    keywords: ['Krankmeldung', 'Frist', 'Unterlagen', 'Bewerber'],
    source: UNIT_23_SOURCE,
  },
]

export const UNIT_23_READING: ReadingText[] = [
  {
    id: 'b1-re-23-01',
    unit: 23,
    level: 'B1',
    title: 'Stellenanzeige und Bewerbung',
    body: [
      'Die Firma Nordlicht sucht ab sofort einen Mitarbeiter für den Kundenservice. Ihre Aufgabe ist es, Kunden am Telefon zu beraten. Wir suchen eine Person, die gern mit Menschen arbeitet.',
      'Sie haben eine Ausbildung im Büro oder im Verkauf. Berufserfahrung ist ein Vorteil, aber keine Voraussetzung. Wir bieten Ihnen eine unbefristete Stelle, eine Probezeit von sechs Monaten und ein gutes Arbeitsklima. Schicken Sie Ihre Unterlagen bis zum 15. Mai an unsere Abteilung für Personal.',
      'Sehr geehrte Damen und Herren, ich möchte mich bei Ihnen als Mitarbeiterin im Kundenservice bewerben. Drei Jahre habe ich in einem Geschäft gearbeitet, das viele Kunden hatte. Dort habe ich gelernt, ruhig zu bleiben. Ich bin zuverlässig, flexibel und teamfähig. Um Sie persönlich kennenzulernen, komme ich gern zu einem Gespräch. Mit freundlichen Grüßen, Jana Weiß',
    ],
    gloss: [
      {
        word: 'ab sofort',
        ru: 'с этого момента, немедленно',
        ky: 'азыртан баштап, дароо',
        example: 'Wir suchen ab sofort eine Verkäuferin.',
        grammar: 'устойчивое выражение в объявлениях',
        grammarKy: 'жарыяларда колдонулган туруктуу сөз айкашы',
        related: [],
      },
      {
        word: 'Sehr geehrte Damen und Herren',
        ru: 'Уважаемые дамы и господа (формальное обращение)',
        ky: 'Урматтуу айымдар жана мырзалар (расмий кайрылуу)',
        example: 'Sehr geehrte Damen und Herren, ich habe Ihre Anzeige gelesen.',
        grammar: 'формальное начало письма; в конце — Mit freundlichen Grüßen',
        grammarKy: 'каттын расмий башталышы; аягында — Mit freundlichen Grüßen',
        related: [],
      },
      {
        word: 'das viele Kunden hatte',
        ru: 'у которого было много клиентов (Relativsatz)',
        ky: 'көптөгөн кардарлары болгон (Relativsatz)',
        example: 'Ich arbeite in einem Betrieb, der Möbel baut.',
        grammar: 'das = Nominativ, Neutrum (das Geschäft); глагол в конце',
        grammarKy: 'das = Nominativ, орто род (das Geschäft); этиш аягында',
        related: [],
      },
      {
        word: 'kennenzulernen',
        ru: 'познакомиться (kennenlernen с zu)',
        ky: 'таанышуу (kennenlernen этиши zu менен)',
        example: 'Um Sie kennenzulernen, rufe ich an.',
        grammar: 'um … zu: zu стоит внутри слова — kennen-zu-lernen',
        grammarKy: 'um … zu: zu сөздүн ичине кирет — kennen-zu-lernen',
        related: [],
      },
    ],
    questions: [
      {
        q: 'Was ist die Aufgabe in dieser Stelle?',
        options: ['Möbel im Laden verkaufen und liefern.', 'Kunden am Telefon beraten.', 'Unterlagen sortieren.'],
        answer: 1,
      },
      {
        q: 'Was ist für die Stelle keine Voraussetzung?',
        options: ['Eine Ausbildung.', 'Zwei Fremdsprachen.', 'Berufserfahrung.'],
        answer: 2,
      },
      {
        q: 'Warum kommt Jana Weiß gern zu einem Gespräch?',
        options: ['Um die Firma persönlich kennenzulernen.', 'Um dort sofort mehr Geld zu verdienen als jetzt.', 'Um ihre Unterlagen abzuholen.'],
        answer: 0,
      },
    ],
    source: UNIT_23_SOURCE,
  },
  {
    id: 'b1-re-23-02',
    unit: 23,
    level: 'B1',
    title: 'Mein Weg im Beruf',
    body: [
      'Ich heiße Murat und arbeite seit einem Jahr in einem Betrieb, der Möbel baut. Meine Abteilung ist klein, aber das Arbeitsklima ist sehr gut. Mein Vorgesetzter ist ein Mann, den alle respektieren. Vorher habe ich in einem Büro gearbeitet. Das war nicht schlecht, aber ich wollte mehr Kontakt zu Menschen.',
      'In der Probezeit musste ich viel lernen. Die Einarbeitung hat zwei Wochen gedauert. Eine Kollegin hat mir am Anfang jeden Tag geholfen. Am Freitag trinken wir zusammen Kaffee. Statt den ganzen Tag im Büro zu sitzen, besuche ich oft Kunden. Ich habe die Stelle bekommen, ohne eine Prüfung zu machen.',
      'Mein Ziel ist es, in drei Jahren Abteilungsleiter zu werden. Um meine Qualifikation zu verbessern, mache ich abends eine Weiterbildung. Das ist anstrengend, aber ich bin motiviert.',
    ],
    gloss: [
      {
        word: 'Statt … zu',
        ru: 'вместо того чтобы (только для понимания)',
        ky: '…нын ордуна (түшүнүү үчүн гана)',
        example: 'Statt zu schlafen, lerne ich Deutsch.',
        grammar: 'statt + инфинитив с zu; в этом юните — только для чтения',
        grammarKy: 'statt + zu менен инфинитив; бул бөлүмдө окуу үчүн гана',
        related: [],
      },
      {
        word: 'ohne … zu',
        ru: 'без того чтобы (только для понимания)',
        ky: '…бастан (түшүнүү үчүн гана)',
        example: 'Er geht, ohne sich zu verabschieden.',
        grammar: 'ohne + инфинитив с zu; в этом юните — только для чтения',
        grammarKy: 'ohne + zu менен инфинитив; бул бөлүмдө окуу үчүн гана',
        related: [],
      },
      {
        word: 'den alle respektieren',
        ru: 'которого все уважают (Relativsatz, Akkusativ)',
        ky: 'баары урматтаган (Relativsatz, Akkusativ)',
        example: 'Das ist ein Mann, den alle mögen.',
        grammar: 'den = Akkusativ, мужской род: alle respektieren den Mann',
        grammarKy: 'den = Akkusativ, эркек род: alle respektieren den Mann',
        related: [],
      },
      {
        word: 'Abteilungsleiter',
        ru: 'руководитель отдела',
        ky: 'бөлүм башчысы',
        example: 'Der Abteilungsleiter hat ein Büro im ersten Stock.',
        grammar: 'der Abteilungsleiter — мужской род (женский: die Abteilungsleiterin)',
        grammarKy: 'der Abteilungsleiter — эркек род (аял: die Abteilungsleiterin)',
        related: [],
      },
    ],
    questions: [
      {
        q: 'Wie findet Murat das Arbeitsklima in seiner Abteilung?',
        options: ['Sehr anstrengend.', 'Eher schlecht.', 'Sehr gut.'],
        answer: 2,
      },
      { q: 'Was macht Murat abends?', options: ['Eine Weiterbildung.', 'Kunden besuchen.', 'Möbel bauen.'], answer: 0 },
      { q: 'Was möchte Murat in drei Jahren werden?', options: ['Verkäufer.', 'Abteilungsleiter.', 'Selbstständig.'], answer: 1 },
    ],
    source: UNIT_23_SOURCE,
  },
]

export const UNIT_23_SPEAKING: SpeakingScenario[] = [
  {
    id: UNIT_23_SPEAKING_ID,
    title: 'Im Vorstellungsgespräch',
    titleRu: 'На собеседовании',
    titleKy: 'Маекте',
    icon: '💼',
    level: 'B1',
    goal: {
      ru: 'Вы на собеседовании. Объясните, почему хотите работать в этой фирме, расскажите об опыте и сильных сторонах и о своих целях. В середине разговора планы неожиданно меняются.',
      ky: 'Сиз маектесиз. Эмне үчүн бул фирмада иштегиңиз келерин түшүндүрүңүз, тажрыйбаңыз жана күчтүү жактарыңыз, максаттарыңыз жөнүндө айтыңыз. Маектин ортосунда пландар күтүлбөгөн жерден өзгөрөт.',
    },
    turns: [
      {
        ai: 'Guten Tag! Schön, dass Sie da sind. Warum möchten Sie bei uns arbeiten?',
        aiRu: 'Добрый день! Хорошо, что вы пришли. Почему вы хотите работать у нас?',
        aiKy: 'Кайырлуу күн! Келгениңиз жакшы болду. Эмне үчүн бизде иштегиңиз келет?',
        hints: [
          'Ich möchte bei Ihnen arbeiten, um Erfahrung zu sammeln.',
          'Ich suche eine Stelle, die gut zu mir passt.',
          'Es ist mir wichtig, in einem Team zu arbeiten.',
        ],
        keywords: ['möchte', 'um', 'stelle', 'wichtig'],
      },
      {
        ai: 'Was haben Sie vorher gemacht? Erzählen Sie bitte.',
        aiRu: 'Что вы делали раньше? Расскажите, пожалуйста.',
        aiKy: 'Мурун эмне кылдыңыз? Айтып берсеңиз.',
        hints: ['Ich habe drei Jahre in einer Firma gearbeitet, die …', 'Meine wichtigste Aufgabe war …', 'Dort habe ich viel gelernt.'],
        keywords: ['jahre', 'firma', 'aufgabe', 'gelernt'],
      },
      {
        ai: 'Was sind Ihre Stärken? Und was ist eine Schwäche?',
        aiRu: 'Каковы ваши сильные стороны? А какова слабая?',
        aiKy: 'Күчтүү жактарыңыз кандай? Алсыз жагыңыз кандай?',
        hints: ['Ich bin zuverlässig und flexibel.', 'Eine Stärke von mir ist, dass …', 'Eine Schwäche ist, dass ich manchmal …'],
        keywords: ['stärke', 'schwäche', 'zuverlässig', 'flexibel'],
      },
      {
        ai: 'Entschuldigung, mein Chef ist gerade gekommen. Können wir kurz unterbrechen? Oder möchten Sie den Termin lieber verschieben?',
        aiRu: 'Извините, только что пришёл мой начальник. Можем сделать небольшой перерыв? Или вы предпочитаете перенести встречу?',
        aiKy: 'Кечиресиз, начальнигим дагы эле келди. Бир аз тыныгып алсак болобу? Же жолугушууну башка күнгө жылдырууну каалайсызбы?',
        hints: [
          'Das ist kein Problem, ich kann warten.',
          'Moment, ich überlege kurz.',
          'Ich habe Zeit, wir können in zehn Minuten weitermachen.',
        ],
        keywords: ['problem', 'warten', 'zeit', 'moment'],
      },
      {
        ai: 'Danke für Ihre Geduld. Wo sehen Sie sich in drei Jahren?',
        aiRu: 'Спасибо за терпение. Кем вы видите себя через три года?',
        aiKy: 'Чыдамдуулугуңуз үчүн рахмат. Үч жылдан кийин өзүңүздү кайда көрөсүз?',
        hints: ['Mein Ziel ist es, … zu werden.', 'Ich habe vor, eine Weiterbildung zu machen.', 'Das ist eine gute Frage. Ich möchte …'],
        keywords: ['ziel', 'vor', 'weiterbildung', 'werden'],
      },
      {
        ai: 'Haben Sie noch Fragen an uns?',
        aiRu: 'Есть ли у вас ещё вопросы к нам?',
        aiKy: 'Бизге дагы суроолоруңуз барбы?',
        hints: ['Wie ist das Arbeitsklima im Team?', 'Wie lange dauert die Einarbeitung?', 'Gibt es eine Probezeit?'],
        keywords: ['arbeitsklima', 'einarbeitung', 'probezeit'],
      },
    ],
    source: UNIT_23_SOURCE,
  },
]

export const UNIT_23_WRITING: WritingTask[] = [
  {
    id: 'b1-wr-23-01',
    unit: 23,
    level: 'B1',
    title: 'Ein Bewerbungsschreiben',
    situation: {
      ru: 'Вы прочитали объявление о вакансии в интернете (например, сотрудник в магазине, на складе или в офисе). Напишите формальное письмо с заявкой: назовите должность, расскажите о своём опыте и качествах, объясните цель и предложите прийти на собеседование. Не меньше 80 слов.',
      ky: 'Сиз интернеттен бош орун жөнүндө жарыяны окудуңуз (мисалы, дүкөндө, кампада же кеңседе кызматкер). Расмий өтүнүч катты жазыңыз: кызматты атаңыз, тажрыйбаңыз жана сапаттарыңыз жөнүндө айтыңыз, максатыңызды түшүндүрүңүз жана маекке келүүнү сунуштаңыз. Кеминде 80 сөз.',
    },
    formal: true,
    minWords: 80,
    mustInclude: [
      {
        label: 'Anrede und Gruß (Sehr geehrte Damen und Herren … / Mit freundlichen Grüßen)',
        patterns: ['sehr geehrte', 'mit freundlichen grüßen', 'freundlichen grüßen'],
        explain: {
          ru: 'Формальное обращение в начале и формальное прощание в конце письма.',
          ky: 'Каттын башында расмий кайрылуу, аягында расмий коштошуу.',
        },
      },
      {
        label: 'Bezug auf die Stelle (Ich habe Ihre Stellenanzeige gelesen … / Ich möchte mich bewerben)',
        patterns: ['stellenanzeige', 'stelle als', 'stelle im', 'möchte mich', 'bewerbe mich'],
        explain: {
          ru: 'Скажите, на какую должность вы подаёте заявку и откуда о ней узнали.',
          ky: 'Кайсы кызматка өтүнүч берип жатканыңызды жана ал жөнүндө кайдан билгениңизди айтыңыз.',
        },
      },
      {
        label: 'Erfahrung oder Qualifikation (Seit … Jahren arbeite ich … / Ich habe eine Ausbildung …)',
        patterns: ['erfahrung', 'ausbildung', 'jahre', 'jahren', 'gearbeitet', 'qualifikation'],
        explain: { ru: 'Расскажите о своём опыте работы или образовании.', ky: 'Жумуш тажрыйбаңыз же билимиңиз жөнүндө айтыңыз.' },
      },
      {
        label: 'Ein Relativsatz (… , der / die / das / den …)',
        patterns: [', der ', ', die ', ', das ', ', den '],
        explain: {
          ru: 'Одно предложение с Relativsatz: глагол в конце, запятая перед der / die / das / den.',
          ky: 'Relativsatz менен бир сүйлөм: этиш аягында, der / die / das / den алдында үтүр.',
        },
      },
      {
        label: 'Ein Satz mit um … zu',
        patterns: [', um ', '. um ', ' um sie ', ' um mich '],
        explain: {
          ru: 'Одно предложение с um … zu: цель действия, zu перед инфинитивом.',
          ky: 'um … zu менен бир сүйлөм: аракеттин максаты, zu инфинитивдин алдында.',
        },
      },
      {
        label: 'Wunsch nach einem Gespräch (Gern komme ich zu einem Gespräch)',
        patterns: ['gespräch', 'vorstellungsgespräch', 'termin'],
        explain: { ru: 'Предложите прийти на собеседование.', ky: 'Маекке келүүнү сунуштаңыз.' },
      },
    ],
    model:
      'Sehr geehrte Damen und Herren, ich habe Ihre Stellenanzeige für den Kundenservice gelesen und möchte mich bei Ihnen bewerben. Seit drei Jahren arbeite ich in einem Geschäft, das viele Kunden hat. Dort habe ich gelernt, ruhig und freundlich zu bleiben. Ich bin zuverlässig, flexibel und teamfähig. Ich lerne schnell und arbeite gern im Team. Meine Stärke ist die Kundenberatung. Außerdem besuche ich einen Kurs, um meine Deutschkenntnisse zu verbessern. Meine Unterlagen finden Sie im Anhang. Gern komme ich zu einem Gespräch. Mit freundlichen Grüßen, Anna Berg',
    tips: [
      {
        ru: 'Начните формально: «Sehr geehrte Damen und Herren» и закончите «Mit freundlichen Grüßen». Используйте Sie, а не du.',
        ky: 'Расмий баштаңыз: «Sehr geehrte Damen und Herren» жана «Mit freundlichen Grüßen» менен аяктаңыз. du эмес, Sie колдонуңуз.',
      },
      {
        ru: 'Опишите опыт одним Relativsatz: «Ich arbeite in einem Geschäft, das viele Kunden hat». Проверьте род (das Geschäft → das), падеж и глагол в конце.',
        ky: 'Тажрыйбаңызды бир Relativsatz менен сүрөттөңүз: «Ich arbeite in einem Geschäft, das viele Kunden hat». Жынысын (das Geschäft → das), жалгоосун жана этиштин аягында турганын текшериңиз.',
      },
      {
        ru: 'Объясните цель через um … zu: «Ich besuche einen Kurs, um meine Deutschkenntnisse zu verbessern». Zu стоит прямо перед инфинитивом; у глагола с приставкой — внутри: kennenzulernen.',
        ky: 'Максатыңызды um … zu менен түшүндүрүңүз: «Ich besuche einen Kurs, um meine Deutschkenntnisse zu verbessern». zu инфинитивдин дароо алдында турат; приставкасы бар этиште — ичинде: kennenzulernen.',
      },
      {
        ru: 'Пишите коротко и по делу: должность, опыт, качества, цель, предложение прийти на собеседование.',
        ky: 'Кыска жана так жазыңыз: кызмат, тажрыйба, сапаттар, максат, маекке келүү сунушу.',
      },
      {
        ru: 'После написания пройдите по списку ниже и оцените себя сами: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
        ky: 'Жазып бүткөндөн кийин төмөнкү тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
      },
    ],
    source: UNIT_23_SOURCE,
  },
]
