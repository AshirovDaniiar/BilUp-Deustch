import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_29_SOURCE, UNIT_29_SPEAKING_ID } from './unit'

/**
 * Unit 29 texts: 2 listening scripts (hotel reception; interview on an everyday-life comparison), 2 readings (an experience report; a hotel review with a notice of a
 * cancelled train), 1 speaking scenario (a cancelled train, compensation and a short comparison of travel habits) and 3 writing tasks (the main travel report and TWO short
 * micro-tasks: an opinion with a comparison and a factual hotel review). Targets of the band for Units 27–29 and the curriculum text for Unit 29: reading 170–210 words,
 * listening 150–180, sentences ≤ 25 words (95th percentile ≤ 20), 7 speaking turns, writing 85 words.
 * Original material; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native speaker.
 * ALL travellers, hotels, railway companies and people are FICTIONAL and labelled so. Every custom is a PERSONAL IMPRESSION of a named, fictional person ("mein Eindruck",
 * "nur meine Erfahrung", "keine Regel für alle") and is never stated as a fact about a country or a population; no text describes the real rules of a real company.
 * Scope guard (curriculum v2): relative clauses with the Dativ and with a preposition (in dem, mit denen, bei der, auf den); Plusquamperfekt (hatte / war + Partizip II) and
 * `nachdem` + Plusquamperfekt with the main clause in the Perfekt or in the Präteritum of the closed list of Unit 21; the Genitiv attribute only in the readings and
 * the Genitiv explanation, glossed, never in a speaking hint or a writing model (receptive, decision D-7). No Genitiv relative pronoun (dessen / deren), no `damit`,
 * no `sodass`, no Konjunktiv II of the past, no Futur II, no Passiv Perfekt. Comparison phrases ↻ Unit 22: im Vergleich zu, im Gegensatz zu, anders als, dagegen.
 * Listening: the dialogues are played with the browser's text-to-speech (the existing mechanism of the listening lab). That playback has NOT been
 * verified on real devices, so no final-test item depends on audio.
 */
export const UNIT_29_LISTENING: ListeningExercise[] = [
  {
    id: 'b1-li-29-01',
    unit: 29,
    level: 'B1',
    title: 'An der Hotelrezeption (erfunden)',
    lines: [
      {
        speaker: 'Frau Kern',
        text: 'Guten Abend, willkommen im Hotel Lindenhof. Wie kann ich Ihnen helfen?',
        ru: 'Добрый вечер, добро пожаловать в отель «Линденхоф». Чем могу помочь?',
        ky: 'Кайырлуу кеч, «Линденхоф» мейманканасына кош келиңиз. Сизге кандай жардам бере алам?',
      },
      {
        speaker: 'Herr Wagner',
        text: 'Guten Abend. Ich habe ein Zimmer mit Balkon gebucht, auf den Namen Wagner.',
        ru: 'Добрый вечер. Я забронировал номер с балконом, на фамилию Вагнер.',
        ky: 'Кайырлуу кеч. Мен балконду бөлмө заказдаганмын, Вагнердин атына.',
      },
      {
        speaker: 'Frau Kern',
        text: 'Einen Moment, bitte. Es tut mir leid, Herr Wagner. Das Zimmer, das Sie gebucht hatten, ist leider nicht frei.',
        ru: 'Одну минуту, пожалуйста. Мне очень жаль, господин Вагнер. Номер, который вы забронировали, к сожалению, не свободен.',
        ky: 'Бир мүнөт, сураныч. Кечиресиз, Вагнер мырза. Сиз заказдаган бөлмө, тилекке каршы, бош эмес.',
      },
      {
        speaker: 'Herr Wagner',
        text: 'Das verstehe ich nicht. Ich hatte das Zimmer schon vor drei Wochen gebucht.',
        ru: 'Я этого не понимаю. Я забронировал номер ещё три недели назад.',
        ky: 'Мен муну түшүнбөйм. Мен бөлмөнү үч жума мурун эле заказдагам.',
      },
      {
        speaker: 'Frau Kern',
        text: 'Das weiß ich. Aber in dem Zimmer gab es gestern einen Wasserschaden. Wir haben es leider nicht wieder fertig gemacht.',
        ru: 'Это я знаю. Но вчера в этом номере была протечка воды. К сожалению, мы не успели привести его в порядок.',
        ky: 'Муну билем. Бирок кечээ ал бөлмөдө суу агып кеткен. Тилекке каршы, биз аны кайра даярдай алган жокпуз.',
      },
      {
        speaker: 'Herr Wagner',
        text: 'Und was machen wir jetzt? Ich bin sehr müde, weil ich den ganzen Tag gefahren bin.',
        ru: 'И что нам теперь делать? Я очень устал, потому что целый день был в дороге.',
        ky: 'Эми эмне кылабыз? Мен абдан чарчадым, анткени бүтүн күнү жолдо болдум.',
      },
      {
        speaker: 'Frau Kern',
        text: 'Ich kann Ihnen ein ruhiges Zimmer ohne Balkon geben. Es ist sauber und neu eingerichtet. Als Entschädigung bekommen Sie das Frühstück gratis.',
        ru: 'Я могу предложить вам тихий номер без балкона. Он чистый и заново обставлен. В качестве компенсации завтрак для вас будет бесплатным.',
        ky: 'Мен сизге балконсуз тынч бөлмө бере алам. Ал таза жана жаңыдан жабдылган. Компенсация катары эртең мененки тамак сизге акысыз болот.',
      },
      {
        speaker: 'Herr Wagner',
        text: 'Das ist in Ordnung. Ich möchte aber meine Beschwerde schriftlich abgeben.',
        ru: 'Хорошо. Но я хочу подать свою жалобу письменно.',
        ky: 'Макул. Бирок мен даттанууму жазуу жүзүндө тапшыргым келет.',
      },
      {
        speaker: 'Frau Kern',
        text: 'Natürlich. Das Formular, auf dem Sie alles notieren können, liegt hier. Das Frühstück bekommen Sie ab sieben Uhr.',
        ru: 'Конечно. Бланк, в котором вы можете всё записать, лежит здесь. Завтрак вы получите с семи часов.',
        ky: 'Албетте. Баарын жазып койсо болгон бланк мына бул жерде. Эртең мененки тамакты саат жетиден тартып аласыз.',
      },
      {
        speaker: 'Herr Wagner',
        text: 'Vielen Dank für Ihre Hilfe. Dann gehe ich jetzt schlafen. Gute Nacht.',
        ru: 'Большое спасибо за вашу помощь. Тогда я пойду спать. Спокойной ночи.',
        ky: 'Жардамыңыз үчүн чоң рахмат. Анда мен эми уктаганы барам. Тынч уктаңыз.',
      },
    ],
    questions: [
      {
        q: 'Was ist das Problem?',
        options: ['Das Zimmer ist zu teuer.', 'Das gebuchte Zimmer ist nicht frei.', 'Herr Wagner hat keine Buchung.'],
        answer: 1,
      },
      {
        q: 'Warum ist das Zimmer nicht frei?',
        options: ['Es gab einen Wasserschaden.', 'Ein anderer Gast wohnt dort noch.', 'Es wird gerade neu gebaut.'],
        answer: 0,
      },
      {
        q: 'Was bekommt Herr Wagner als Entschädigung?',
        options: ['Ein größeres Zimmer.', 'Das Geld für die Nacht zurück.', 'Das Frühstück gratis.'],
        answer: 2,
      },
      {
        q: 'Was möchte Herr Wagner außerdem tun?',
        options: ['Eine Beschwerde schriftlich abgeben.', 'Ein anderes Hotel in der Stadt suchen.', 'Zimmer 8 besichtigen.'],
        answer: 0,
      },
    ],
    keywords: ['Rezeption', 'Entschädigung', 'Beschwerde'],
    source: UNIT_29_SOURCE,
  },
  {
    id: 'b1-li-29-02',
    unit: 29,
    level: 'B1',
    title: 'Interview: Zwei Alltage im Vergleich (erfunden)',
    lines: [
      {
        speaker: 'Frau Bauer',
        text: 'Herr Sadyr, Sie haben ein Jahr im Ausland gearbeitet. Was war für Sie der größte Unterschied im Alltag?',
        ru: 'Господин Садыр, вы год проработали за границей. Какая разница в повседневной жизни была для вас самой большой?',
        ky: 'Садыр мырза, сиз чет өлкөдө бир жыл иштедиңиз. Күнүмдүк жашоодогу эң чоң айырма сиз үчүн эмне болду?',
      },
      {
        speaker: 'Herr Sadyr',
        text: 'Für mich war es das Planen von Terminen. Meine Kollegen, mit denen ich gearbeitet habe, haben ihr Wochenende früh geplant. Das ist nur meine Erfahrung, keine Regel für alle.',
        ru: 'Для меня это было планирование встреч. Мои коллеги, с которыми я работал, рано планировали свои выходные. Это только мой опыт, а не правило для всех.',
        ky: 'Мен үчүн бул жолугушууларды пландоо болду. Мен менен иштеген кесиптештерим дем алыш күндөрүн эрте пландашчу. Бул менин тажрыйбам гана, баарына эреже эмес.',
      },
      {
        speaker: 'Frau Bauer',
        text: 'Gab es auch ein Missverständnis?',
        ru: 'А было ли и недоразумение?',
        ky: 'Түшүнбөстүк да болдубу?',
      },
      {
        speaker: 'Herr Sadyr',
        text: 'Ja. Ich hatte meine Kollegen spontan für den Sonntag eingeladen. In meiner Familie ist das normal. Nachdem ich sie gefragt hatte, haben sie freundlich abgesagt. Sie hatten schon etwas geplant.',
        ru: 'Да. Я спонтанно пригласил коллег на воскресенье. В моей семье это нормально. Когда я их спросил, они вежливо отказались. У них уже были планы.',
        ky: 'Ооба. Мен кесиптештеримди жекшембиге капысынан чакырган элем. Менин үй-бүлөмдө бул кадимки көрүнүш. Мен алардан сурагандан кийин алар сылык баш тартышты. Алардын буга чейин эле планы бар болчу.',
      },
      {
        speaker: 'Frau Bauer',
        text: 'Wie haben Sie reagiert?',
        ru: 'Как вы отреагировали?',
        ky: 'Сиз кандай жооп бердиңиз?',
      },
      {
        speaker: 'Herr Sadyr',
        text: 'Zuerst war ich überrascht. Dann habe ich gefragt: Wann passt es euch? Im Vergleich zu früher plane ich jetzt mehr.',
        ru: 'Сначала я удивился. Потом я спросил: «Когда вам удобно?» По сравнению с прежним, теперь я больше планирую.',
        ky: 'Адегенде мен таң калдым. Анан: «Силерге качан ыңгайлуу?» — деп сурадым. Мурункуга салыштырмалуу, азыр мен көбүрөөк пландайм.',
      },
      {
        speaker: 'Frau Bauer',
        text: 'Und gibt es auch Gemeinsamkeiten?',
        ru: 'А есть ли и общее?',
        ky: 'Ал эми ортоктуктар да барбы?',
      },
      {
        speaker: 'Herr Sadyr',
        text: 'Natürlich. Gastfreundschaft habe ich an beiden Orten erlebt. Die Familie, bei der ich gewohnt habe, hat mich wie einen Gast behandelt. Dagegen war das Frühstück sehr kurz.',
        ru: 'Конечно. Гостеприимство я встретил в обоих местах. Семья, у которой я жил, принимала меня как гостя. Зато завтрак был очень коротким.',
        ky: 'Албетте. Конок тосууну мен эки жерде тең көрдүм. Мен жашаган үй-бүлө мени конок катары кабыл алды. Ал эми эртең мененки тамак абдан кыска болду.',
      },
      {
        speaker: 'Frau Bauer',
        text: 'Was raten Sie anderen?',
        ru: 'Что вы советуете другим?',
        ky: 'Башкаларга эмне кеңеш бересиз?',
      },
      {
        speaker: 'Herr Sadyr',
        text: 'Fragen Sie nach, wenn etwas unklar ist. Jeder Mensch ist anders. Das sind nur meine Eindrücke.',
        ru: 'Переспрашивайте, если что-то непонятно. Каждый человек разный. Это только мои впечатления.',
        ky: 'Бир нерсе түшүнүксүз болсо, кайра сурап алыңыз. Ар бир адам башка. Бул менин таасирлерим гана.',
      },
    ],
    questions: [
      {
        q: 'Was war für Herrn Sadyr der größte Unterschied?',
        options: ['Das Essen.', 'Das Planen von Terminen.', 'Die Wohnung.'],
        answer: 1,
      },
      {
        q: 'Was hatte Herr Sadyr getan?',
        options: ['Er hatte Kollegen für den Sonntag eingeladen.', 'Er hatte ein Geschenk vergessen.', 'Er hatte einen Termin verpasst.'],
        answer: 0,
      },
      {
        q: 'Wie haben die Kollegen reagiert?',
        options: ['Sie sind alle spontan gekommen und haben Kuchen mitgebracht.', 'Sie waren sehr böse.', 'Sie haben abgesagt, weil sie schon etwas geplant hatten.'],
        answer: 2,
      },
      {
        q: 'Was rät Herr Sadyr?',
        options: ['Man soll nachfragen, wenn etwas unklar ist.', 'Man soll nie spontan sein.', 'Man soll alle Bräuche sofort übernehmen.'],
        answer: 0,
      },
    ],
    keywords: ['Alltag', 'Unterschied', 'Gastfreundschaft'],
    source: UNIT_29_SOURCE,
  },
]

export const UNIT_29_READING: ReadingText[] = [
  {
    id: 'b1-re-29-01',
    unit: 29,
    level: 'B1',
    title: 'Mein erstes Jahr in Leipzig (erfunden)',
    body: [
      'Erfundener Erfahrungsbericht: Ich heiße Aigerim und komme aus Osch. Seit einem Jahr lebe ich in Leipzig. Nachdem ich angekommen war, habe ich zuerst eine Wohnung gesucht. Jetzt wohne ich bei einer älteren Frau, mit der ich mich gut verstehe.',
      'Am Anfang hatte ich einen kleinen Kulturschock. Ich hatte nicht gewusst, dass viele Leute hier früh zu Abend essen. Im Vergleich zu meiner Familie, bei der das Essen spät und lang ist, war das sehr kurz. Auch die Mitte der Stadt war für mich ungewohnt, weil sie mir so ruhig vorkam.',
      'Bei der Pünktlichkeit habe ich Unterschiede erlebt. Mein Kollege Jan, dem Pünktlichkeit sehr wichtig ist, kommt immer zehn Minuten früher. Meine Freundin Lena dagegen kommt manchmal etwas später. Das ist nur mein Eindruck, keine Regel für alle.',
      'Nachdem ich einige Wochen hier gelebt hatte, habe ich mich gut eingewöhnt. Die Meinung meiner Eltern ist mir wichtig, deshalb rufe ich sie jeden Sonntag an. Ich habe Freunde gefunden, mit denen ich oft koche. Im Gegensatz zum Anfang fühle ich mich jetzt zu Hause.',
    ],
    gloss: [
      {
        word: 'Nachdem ich angekommen war, …',
        ru: 'После того как я приехала, … (сначала приезд, потом остальное)',
        ky: 'Мен келгенден кийин, … (адегенде келүү, андан кийин калганы)',
        example: 'Nachdem wir angekommen waren, haben wir gegessen.',
        grammar: 'nachdem + Plusquamperfekt: war / hatte + Partizip II в конце; главная часть в Perfekt',
        grammarKy: 'nachdem + Plusquamperfekt: аягында war / hatte + Partizip II; башкы бөлүк Perfektте',
        related: [],
      },
      {
        word: 'mit der ich mich gut verstehe',
        ru: 'с которой я хорошо лажу (предлог + относительное местоимение)',
        ky: 'мен жакшы мамиле түзгөн (предлог + байланыш сөзү)',
        example: 'Das ist die Frau, mit der ich spreche.',
        grammar: 'mit + Dativ: mit der (die Frau); глагол в конце придаточного',
        grammarKy: 'mit + Dativ: mit der (die Frau); этиш кошумча бөлүктүн аягында',
        related: [],
      },
      {
        word: 'dem Pünktlichkeit sehr wichtig ist',
        ru: 'для которого пунктуальность очень важна (Dativ)',
        ky: 'ал үчүн убакытты так сактоо абдан маанилүү (Dativ)',
        example: 'Der Kollege, dem das wichtig ist, kommt früh.',
        grammar: 'wichtig sein + Dativ: «кому важно?» → dem (der Kollege)',
        grammarKy: 'wichtig sein + Dativ: «кимге маанилүү?» → dem (der Kollege)',
        related: [],
      },
      {
        word: 'die Mitte der Stadt',
        ru: 'центр города (Genitiv: «чего? города»)',
        ky: 'шаардын борбору (Genitiv: «эмненин? шаардын»)',
        example: 'Die Mitte der Stadt ist ruhig.',
        grammar: 'Genitivattribut: der Stadt (feminin). Только узнавать; в речи можно «die Mitte von der Stadt»',
        grammarKy: 'Genitivattribut: der Stadt (аял жынысы). Таануу үчүн гана; сүйлөөдө «die Mitte von der Stadt» деп айтса болот',
        related: [],
      },
      {
        word: 'die Meinung meiner Eltern',
        ru: 'мнение моих родителей (Genitiv множественного числа)',
        ky: 'ата-энемдин пикири (көптүк сандагы Genitiv)',
        example: 'Das Haus meiner Eltern ist klein.',
        grammar: 'Genitivattribut: meiner Eltern = «чьё?». Только узнавать; в речи «die Meinung von meinen Eltern»',
        grammarKy: 'Genitivattribut: meiner Eltern = «кимдики?». Таануу үчүн гана; сүйлөөдө «die Meinung von meinen Eltern»',
        related: [],
      },
    ],
    questions: [
      { q: 'Aussage: Aigerim hatte schon vor ihrer Ankunft in Leipzig eine Wohnung.', options: ['richtig', 'falsch', 'steht nicht im Text'], answer: 1 },
      {
        q: 'Was sagt Aigerim über Jan und Lena?',
        options: ['Alle Menschen hier sind pünktlich.', 'Lena kommt immer zu früh.', 'Jan kommt früher, Lena manchmal später; das ist ihr Eindruck.'],
        answer: 2,
      },
      {
        q: 'Wie fühlt sich Aigerim jetzt?',
        options: ['Sie fühlt sich jetzt zu Hause.', 'Sie möchte bald wieder zurück nach Osch.', 'Sie hat noch keine Freunde.'],
        answer: 0,
      },
    ],
    source: UNIT_29_SOURCE,
  },
  {
    id: 'b1-re-29-02',
    unit: 29,
    level: 'B1',
    title: 'Hotelbewertung und Zugausfall (erfunden)',
    body: [
      'Hotelbewertung (erfunden), Hotel Seeblick: Wir hatten ein Zimmer mit Seeblick gebucht. Nachdem wir lange an der Rezeption gewartet hatten, haben wir ein anderes Zimmer bekommen. Die Frau, mit der ich gesprochen habe, war freundlich und hat sich entschuldigt. Das Zimmer war sauber, aber die Straße war sehr laut. Am nächsten Morgen war alles besser. Das Frühstück war frisch, und das Personal hat uns viele Tipps für Ausflüge gegeben.',
      'Als Entschädigung haben wir ein kostenloses Frühstück bekommen. Der Name des Hotels klingt ruhig, aber das Zimmer war es nicht. Ich empfehle das Hotel für Gäste, denen Ruhe nicht so wichtig ist. Das ist nur meine Meinung.',
      'Mitteilung der Nordlicht-Bahn (erfunden): Heute fällt der Zug nach Dresden aus. Fahrgäste, die ihre Fahrkarte schon gekauft hatten, bekommen das Geld zurück. Nach Dresden fährt ein Ersatzzug, auf den die Fahrgäste am Gleis 4 warten können. Die Nummer des Ersatzzuges steht auf der Anzeige. Wer Hilfe braucht, kann am Servicepunkt fragen. Die Mitarbeiter, denen die Fahrgäste ihre Fragen stellen, helfen gern. Bitte denken Sie an Ihre Fahrkarte.',
    ],
    gloss: [
      {
        word: 'Wir hatten … gebucht',
        ru: 'Мы (раньше) забронировали … (Plusquamperfekt: что было раньше)',
        ky: 'Биз (мурда) … заказдаган элек (Plusquamperfekt: эмне мурун болгон)',
        example: 'Ich hatte ein Zimmer gebucht.',
        grammar: 'hatte / hatten + Partizip II в конце: действие раньше другого в прошлом',
        grammarKy: 'hatte / hatten + аягында Partizip II: өткөндөгү башка иштен мурунку аракет',
        related: [],
      },
      {
        word: 'Gäste, denen Ruhe nicht so wichtig ist',
        ru: 'гости, для которых тишина не так важна (Dativ множественного числа)',
        ky: 'тынчтык алар үчүн анча маанилүү эмес конокторго (көптүк сандагы Dativ)',
        example: 'Das sind Leute, denen ich oft helfe.',
        grammar: 'denen = Dativ множественного числа (wichtig sein + Dativ)',
        grammarKy: 'denen = көптүк сандагы Dativ (wichtig sein + Dativ)',
        related: [],
      },
      {
        word: 'ein Ersatzzug, auf den die Fahrgäste warten können',
        ru: 'запасной поезд, которого пассажиры могут ждать (warten auf + Akkusativ)',
        ky: 'жүргүнчүлөр күтүп турса боло турган кошумча поезд (warten auf + Akkusativ)',
        example: 'Der Zug, auf den ich warte, kommt gleich.',
        grammar: 'предлог auf + Akkusativ: auf den (der Zug); пара warten auf',
        grammarKy: 'auf + Akkusativ предлогу: auf den (der Zug); warten auf жубу',
        related: [],
      },
      {
        word: 'der Name des Hotels',
        ru: 'название отеля (Genitiv: «чего? отеля»)',
        ky: 'мейманкананын аты (Genitiv: «эмненин? мейманкананын»)',
        example: 'Der Name des Hotels steht hier.',
        grammar: 'Genitivattribut: des Hotels (neutral, -s). Только узнавать; в речи «der Name von dem Hotel»',
        grammarKy: 'Genitivattribut: des Hotels (орто род, -s). Таануу үчүн гана; сүйлөөдө «der Name von dem Hotel»',
        related: [],
      },
      {
        word: 'die Nummer des Ersatzzuges',
        ru: 'номер запасного поезда (Genitiv)',
        ky: 'кошумча поездин номери (Genitiv)',
        example: 'Die Nummer des Zuges steht hier.',
        grammar: 'Genitivattribut: des Ersatzzuges (maskulin, -es). Только узнавать',
        grammarKy: 'Genitivattribut: des Ersatzzuges (эркек род, -es). Таануу үчүн гана',
        related: [],
      },
    ],
    questions: [
      { q: 'Aussage: Das Hotel Seeblick hat einen eigenen Parkplatz für die Gäste.', options: ['richtig', 'falsch', 'steht nicht im Text'], answer: 2 },
      {
        q: 'Für wen empfiehlt die Person das Hotel?',
        options: ['Für Gäste, die unbedingt einen Seeblick suchen.', 'Für Gäste, denen Ruhe nicht so wichtig ist.', 'Für Familien mit kleinen Kindern.'],
        answer: 1,
      },
      {
        q: 'Wo können die Fahrgäste auf den Ersatzzug warten?',
        options: ['An der Rezeption.', 'Im Zug nach Dresden.', 'Am Gleis 4.'],
        answer: 2,
      },
    ],
    source: UNIT_29_SOURCE,
  },
]

export const UNIT_29_SPEAKING: SpeakingScenario[] = [
  {
    id: UNIT_29_SPEAKING_ID,
    title: 'Der Zug fällt aus',
    titleRu: 'Поезд отменили',
    titleKy: 'Поезд жокко чыгарылды',
    icon: '🚆',
    level: 'B1',
    goal: {
      ru: 'Вы на вокзале: ваш поезд отменили (вымышленная железнодорожная компания «Nordlicht-Bahn»). Объясните, что случилось и что было раньше, попросите компенсацию, отреагируйте на неожиданный ответ и коротко сравните поездки у вас и здесь — как личное впечатление, а не как правило для всех.',
      ky: 'Сиз вокзалдасыз: поезд жокко чыгарылды (ойдон чыгарылган «Nordlicht-Bahn» темир жол компаниясы). Эмне болгонун жана мурда эмне болгонун түшүндүрүңүз, компенсация сураңыз, күтүлбөгөн жоопко реакция кылыңыз жана өзүңүздө жана бул жерде саякаттоону кыскача салыштырыңыз — баарына эреже катары эмес, жеке таасир катары.',
    },
    turns: [
      {
        ai: 'Guten Tag, Nordlicht-Bahn, Servicecenter. Wie kann ich Ihnen helfen?',
        aiRu: 'Добрый день, «Nordlicht-Bahn», сервисный центр. Чем могу помочь?',
        aiKy: 'Кайырлуу күн, «Nordlicht-Bahn», тейлөө борбору. Сизге кандай жардам бере алам?',
        hints: [
          'Guten Tag. Mein Zug ist ausgefallen.',
          'Der Zug, mit dem ich fahren wollte, fährt nicht.',
          'Ich möchte mich beschweren.',
        ],
        keywords: ['zug', 'ausgefallen', 'beschweren', 'fahren'],
      },
      {
        ai: 'Das tut mir leid. Wohin wollten Sie denn fahren, und wann sollte der Zug fahren?',
        aiRu: 'Мне очень жаль. А куда вы хотели ехать и когда должен был ехать поезд?',
        aiKy: 'Кечиресиз. Сиз кайда баргыңыз келди жана поезд качан жүрүшү керек эле?',
        hints: [
          'Ich wollte um 14 Uhr nach Dresden fahren.',
          'Ich habe schon eine Stunde auf dem Bahnsteig gewartet.',
          'Ich hatte einen Anschluss in Dresden.',
        ],
        keywords: ['dresden', 'bahnsteig', 'anschluss', 'gewartet'],
      },
      {
        ai: 'Haben Sie die Fahrkarte schon gekauft?',
        aiRu: 'Вы уже купили билет?',
        aiKy: 'Сиз билетти сатып алдыңызбы?',
        hints: [
          'Ja, ich hatte die Fahrkarte schon gestern gekauft.',
          'Nachdem ich die Fahrkarte gekauft hatte, habe ich eine Unterkunft gebucht.',
          'Ich habe sie hier, bitte.',
        ],
        keywords: ['fahrkarte', 'gekauft', 'unterkunft', 'gebucht'],
      },
      {
        ai: 'Danke. Eine Entschädigung gibt es bei uns leider nur online, hier kann ich nur einen Gutschein geben.',
        aiRu: 'Спасибо. Компенсацию у нас, к сожалению, можно получить только онлайн, здесь я могу выдать только ваучер.',
        aiKy: 'Рахмат. Бизде компенсацияны, тилекке каршы, онлайн гана алса болот, бул жерде мен ваучер гана бере алам.',
        hints: [
          'Das ist schade, ich hatte mit einer Entschädigung gerechnet.',
          'Moment, ich überlege kurz. Wie funktioniert das online?',
          'Kann ich das bitte schriftlich bekommen?',
        ],
        keywords: ['entschädigung', 'online', 'gutschein', 'schriftlich'],
      },
      {
        ai: 'Online geht es ganz einfach. Soll ich Ihnen die Internetseite aufschreiben, oder möchten Sie den Gutschein?',
        aiRu: 'Онлайн это совсем просто. Мне записать вам адрес сайта, или вы хотите ваучер?',
        aiKy: 'Онлайн абдан жөнөкөй. Сизге сайттын дарегин жазып берейинби, же ваучерди каалайсызбы?',
        hints: [
          'Bitte schreiben Sie mir die Internetseite auf.',
          'Ich nehme lieber den Gutschein.',
          'Habe ich Sie richtig verstanden? Beides geht nicht?',
        ],
        keywords: ['internetseite', 'aufschreiben', 'gutschein', 'verstanden'],
      },
      {
        ai: 'Gern. Übrigens: Sie sind nicht von hier. Wie ist das Reisen bei Ihnen zu Hause im Vergleich?',
        aiRu: 'С удовольствием. Кстати, вы не отсюда. А как у вас дома обстоит дело с поездками, если сравнивать?',
        aiKy: 'Макул. Айтмакчы, сиз бул жактан эмессиз. Сиздин жерде саякаттоо кандай, салыштырганда?',
        hints: [
          'Im Vergleich zu hier fahren bei uns mehr Leute mit dem Bus.',
          'Das ist nur mein Eindruck, keine Regel für alle.',
          'Mir ist aufgefallen, dass die Züge hier pünktlicher sind, dagegen sind die Preise höher.',
        ],
        keywords: ['vergleich', 'eindruck', 'aufgefallen', 'dagegen'],
      },
      {
        ai: 'Danke für das Gespräch. Gute Reise, und denken Sie an den Gutschein oder die Internetseite!',
        aiRu: 'Спасибо за разговор. Счастливого пути, и не забудьте про ваучер или сайт!',
        aiKy: 'Сүйлөшкөнүңүз үчүн рахмат. Жолуңуз шыдыр болсун, ваучерди же сайтты унутпаңыз!',
        hints: [
          'Vielen Dank für Ihre Hilfe. Auf Wiedersehen.',
          'Ich schreibe heute noch meine Beschwerde.',
          'Danke, ich denke daran. Schönen Tag noch.',
        ],
        keywords: ['dank', 'hilfe', 'beschwerde', 'wiedersehen'],
      },
    ],
    source: UNIT_29_SOURCE,
  },
]

const TIP_SELF = {
  ru: 'После написания пройдите по списку ниже и оцените себя сами: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
  ky: 'Жазып бүткөндөн кийин төмөнкү тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
}

export const UNIT_29_WRITING: WritingTask[] = [
  {
    id: 'b1-wr-29-01',
    unit: 29,
    level: 'B1',
    title: 'Ein Reisebericht: Meine schönste Reise',
    situation: {
      ru: 'Напишите короткий отчёт о поездке — настоящей или придуманной: куда вы ездили, с кем, что случилось раньше и позже, как это было по сравнению с домом. Опишите места и людей Relativsatz с предлогом и скажите, что это только ваше личное впечатление.',
      ky: 'Саякат жөнүндө кыска баян жазыңыз — чыныгы же ойдон чыгарылган: кайда бардыңыз, ким менен, мурда жана кийин эмне болду, үй менен салыштырганда кандай болду. Жерлерди жана адамдарды предлогу бар Relativsatz менен сүрөттөңүз жана бул сиздин жеке таасириңиз гана экенин айтыңыз.',
    },
    formal: false,
    minWords: 85,
    mustInclude: [
      {
        label: 'Wohin, wann, mit wem (Letzten Sommer war ich mit … in …)',
        patterns: ['war ich', 'waren wir', 'letzten', 'im sommer', 'im herbst', 'vor einem', 'mit meiner', 'mit meinem'],
        explain: {
          ru: 'Скажите, куда, когда и с кем вы ездили.',
          ky: 'Кайда, качан жана ким менен саякаттаганыңызды айтыңыз.',
        },
      },
      {
        label: 'Relativsatz mit Präposition (das Café, in dem wir … / die Leute, mit denen wir …)',
        patterns: [' in dem ', ' in der ', ' mit dem ', ' mit denen ', ' mit der ', ' bei dem ', ' bei der ', ' bei denen ', ' in das ', ' auf den ', ' von dem '],
        explain: {
          ru: 'Одно предложение, где предлог стоит перед относительным местоимением: «Das Café, in dem wir gefrühstückt haben, …».',
          ky: 'Предлог байланыш сөзүнүн алдында турган бир сүйлөм: «Das Café, in dem wir gefrühstückt haben, …».',
        },
      },
      {
        label: 'Plusquamperfekt (Wir hatten … gebucht / Wir waren … angekommen)',
        patterns: ['hatten ', 'hatte ', 'waren ', ' war '],
        explain: {
          ru: 'Одно предложение о том, что было раньше: hatte / war + Partizip II в конце.',
          ky: 'Мурда эмне болгонун айткан бир сүйлөм: аягында hatte / war + Partizip II.',
        },
      },
      {
        label: 'nachdem (Nachdem wir angekommen waren, …)',
        patterns: ['nachdem'],
        explain: {
          ru: 'Предложение с nachdem: в придаточной части Plusquamperfekt, после запятой сразу глагол.',
          ky: 'nachdem менен сүйлөм: кошумча бөлүктө Plusquamperfekt, үтүрдөн кийин дароо этиш.',
        },
      },
      {
        label: 'Ein Vergleich (Im Vergleich zu … / Im Gegensatz zu … / dagegen)',
        patterns: ['im vergleich', 'im gegensatz', 'anders als', 'dagegen', 'genauso', 'ähnlich'],
        explain: {
          ru: 'Сравните место или обычай с тем, что вам знакомо: im Vergleich zu …, im Gegensatz zu …, dagegen.',
          ky: 'Жерди же каада-салтты өзүңүзгө тааныш нерсе менен салыштырыңыз: im Vergleich zu …, im Gegensatz zu …, dagegen.',
        },
      },
      {
        label: 'Ein persönlicher Eindruck (Mir ist aufgefallen, … / Das ist nur mein Eindruck)',
        patterns: ['mir ist aufgefallen', 'mein eindruck', 'mein erster eindruck', 'ich fand', 'ich finde', 'mir hat'],
        explain: {
          ru: 'Скажите, что это ваше личное впечатление, а не правило для всех: «Das ist nur mein Eindruck».',
          ky: 'Бул баарына эреже эмес, жеке таасириңиз экенин айтыңыз: «Das ist nur mein Eindruck».',
        },
      },
      {
        label: 'Eine Empfehlung (Ich empfehle … / Ich würde …)',
        patterns: ['empfehle', 'empfehlen', 'lohnt sich', 'rate ich'],
        explain: {
          ru: 'Закончите коротким советом другу: «Ich empfehle die Stadt für ein langes Wochenende».',
          ky: 'Досуңузга кыска кеңеш менен аяктаңыз: «Ich empfehle die Stadt für ein langes Wochenende».',
        },
      },
    ],
    model:
      'Letzten Sommer war ich mit meiner Schwester in Dresden. Wir hatten ein kleines Zimmer gebucht, das mitten in der Altstadt war. Nachdem wir angekommen waren, haben wir sofort die Stadt besichtigt. Das Café, in dem wir gefrühstückt haben, war sehr gemütlich. Im Vergleich zu meiner Heimatstadt war es dort ruhiger, dagegen waren die Preise höher. Mir ist aufgefallen, dass die Leute, mit denen wir gesprochen haben, sehr hilfsbereit waren. Das Essen war gut und nicht zu teuer. Das ist nur mein Eindruck. Ich empfehle die Stadt für ein langes Wochenende.',
    tips: [
      {
        ru: 'Рассказывайте по порядку: сначала предыстория (Plusquamperfekt: «Wir hatten … gebucht»), потом события (Perfekt: «haben wir … besichtigt»). Nachdem: придаточное — Plusquamperfekt, главная часть — Perfekt.',
        ky: 'Иретине жараша айтыңыз: адегенде алдыңкы окуя (Plusquamperfekt: «Wir hatten … gebucht»), анан окуялар (Perfekt: «haben wir … besichtigt»). nachdem: кошумча бөлүк — Plusquamperfekt, башкы бөлүк — Perfekt.',
      },
      {
        ru: 'Relativsatz с предлогом: предлог перед местоимением, глагол в конце: «die Leute, mit denen wir gesprochen haben». Genitiv писать не нужно — достаточно «von + Dativ».',
        ky: 'Предлогу бар Relativsatz: предлог байланыш сөзүнүн алдында, этиш аягында: «die Leute, mit denen wir gesprochen haben». Genitivди жазуунун кереги жок — «von + Dativ» жетиштүү.',
      },
      {
        ru: 'Пишите о людях и местах как о личном впечатлении («mir ist aufgefallen», «nur mein Eindruck»), а не как о правиле для целой страны.',
        ky: 'Адамдар жана жерлер жөнүндө бүт өлкөгө эреже катары эмес, жеке таасир катары жазыңыз («mir ist aufgefallen», «nur mein Eindruck»).',
      },
      TIP_SELF,
    ],
    source: UNIT_29_SOURCE,
  },
  {
    id: 'b1-wr-29-02',
    unit: 29,
    level: 'B1',
    title: 'Meine Meinung: Pauschalreise oder selbst planen?',
    situation: {
      ru: 'Друг спрашивает, что лучше: организованная поездка или поездка, которую вы планируете сами. Напишите 2–3 предложения: ваше мнение, причина и сравнение обоих вариантов (плюсы и минусы).',
      ky: 'Досуңуз уюштурулган саякат менен өзүңүз пландаган саякаттын кайсынысы жакшы экенин сурап жатат. 2–3 сүйлөм жазыңыз: пикириңиз, себеби жана эки вариантты салыштыруу (артыкчылыктары жана кемчиликтери).',
    },
    formal: false,
    minWords: 30,
    mustInclude: [
      {
        label: 'Meinung (Ich finde, … / Meiner Meinung nach …)',
        patterns: ['ich finde', 'meiner meinung nach', 'ich glaube', 'ich denke'],
        explain: { ru: 'Скажите своё мнение: «Ich finde, …».', ky: 'Пикириңизди айтыңыз: «Ich finde, …».' },
      },
      {
        label: 'Grund (weil / denn)',
        patterns: ['weil', 'denn', 'deshalb'],
        explain: {
          ru: 'Назовите причину: denn (обычный порядок слов) или weil (глагол в конце).',
          ky: 'Себебин атаңыз: denn (сөздөрдүн иреттери адаттагыдай) же weil (этиш аягында).',
        },
      },
      {
        label: 'Vergleich (im Gegensatz dazu / dagegen / im Vergleich zu)',
        patterns: ['im gegensatz', 'im vergleich', 'dagegen', 'anders als', 'während'],
        explain: {
          ru: 'Сравните оба варианта: im Gegensatz dazu, dagegen, im Vergleich zu.',
          ky: 'Эки вариантты салыштырыңыз: im Gegensatz dazu, dagegen, im Vergleich zu.',
        },
      },
    ],
    model:
      'Ich finde, eine Pauschalreise ist bequem, denn man muss nichts organisieren. Im Gegensatz dazu hat man bei einer selbst geplanten Reise mehr Freiheit. Dagegen ist sie anstrengender. Für mich ist die Freiheit wichtiger, weil ich gern neue Orte entdecke.',
    tips: [
      {
        ru: 'Мнение, причина, сравнение: три предложения достаточно. «Im Gegensatz dazu» и «dagegen» ставят вторую часть против первой.',
        ky: 'Пикир, себеп, салыштыруу: үч сүйлөм жетиштүү. «Im Gegensatz dazu» жана «dagegen» экинчи бөлүктү биринчисине каршы коёт.',
      },
      {
        ru: 'Пишите «ich finde», а не «так бывает у всех». Ваше мнение — это только ваше мнение.',
        ky: '«ich finde» деп жазыңыз, «баарында ушундай болот» эмес. Сиздин пикириңиз — бул сиздин пикириңиз гана.',
      },
      TIP_SELF,
    ],
    source: UNIT_29_SOURCE,
  },
  {
    id: 'b1-wr-29-03',
    unit: 29,
    level: 'B1',
    title: 'Eine sachliche Hotelbewertung',
    situation: {
      ru: 'Вы жили в вымышленном отеле, и была проблема (номер не тот, шум). Напишите короткую деловую оценку: что вы заказали и что было раньше (Plusquamperfekt), кого вы спросили (Relativsatz с предлогом), и вежливо попросите о компенсации.',
      ky: 'Сиз ойдон чыгарылган мейманканада жашадыңыз жана көйгөй болду (бөлмө башка, ызы-чуу). Кыскача так баа жазыңыз: эмнени заказдагыңызды жана мурда эмне болгонун (Plusquamperfekt), кимден сурагыныңызды (предлогу бар Relativsatz) жазыңыз жана компенсацияны сылык сураныңыз.',
    },
    formal: false,
    minWords: 40,
    mustInclude: [
      {
        label: 'Plusquamperfekt (Wir hatten … gebucht / nachdem wir … gewartet hatten)',
        patterns: ['hatten ', 'hatte ', 'waren ', ' war '],
        explain: {
          ru: 'Скажите, что вы заказали или сделали раньше: hatte + Partizip II.',
          ky: 'Мурда эмнени заказдаганыңызды же эмне кылганыңызды айтыңыз: hatte + Partizip II.',
        },
      },
      {
        label: 'Relativsatz mit Präposition (die Frau, mit der ich gesprochen habe)',
        patterns: [' mit der ', ' mit dem ', ' mit denen ', ' bei der ', ' in dem ', ' auf dem '],
        explain: {
          ru: 'Опишите человека или место предложением с предлогом: «Die Frau, mit der ich gesprochen habe, …».',
          ky: 'Адамды же жерди предлогу бар сүйлөм менен сүрөттөңүз: «Die Frau, mit der ich gesprochen habe, …».',
        },
      },
      {
        label: 'Sachlicher Ton und die Bitte (Ich bitte um … / eine kleine Entschädigung)',
        patterns: ['entschädigung', 'ich bitte', 'bitte um', 'erstattung'],
        explain: {
          ru: 'Спокойно и по делу: назовите проблему и вежливо попросите о компенсации.',
          ky: 'Сабырдуу жана так: көйгөйдү атап, компенсацияны сылык сураныңыз.',
        },
      },
    ],
    model:
      'Wir hatten ein Zimmer mit Seeblick gebucht. Nachdem wir lange an der Rezeption gewartet hatten, haben wir ein anderes Zimmer bekommen. Die Frau, mit der ich gesprochen habe, war freundlich. Die Straße war aber sehr laut. Ich bitte um eine kleine Entschädigung.',
    tips: [
      {
        ru: 'Пишите по делу и вежливо: что было заказано, что произошло, кто помог, чего вы просите. Без обвинений.',
        ky: 'Так жана сылык жазыңыз: эмне заказдалган, эмне болду, ким жардам берди, эмнени сурайсыз. Айыптоосуз.',
      },
      {
        ru: 'Plusquamperfekt для предыстории («Wir hatten … gebucht»), Perfekt для того, что случилось потом.',
        ky: 'Алдыңкы окуя үчүн Plusquamperfekt («Wir hatten … gebucht»), андан кийин болгон нерсе үчүн Perfekt.',
      },
      TIP_SELF,
    ],
    source: UNIT_29_SOURCE,
  },
]
