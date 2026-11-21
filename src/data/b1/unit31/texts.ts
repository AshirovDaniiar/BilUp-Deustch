import type { ListeningExercise, ReadingText, SpeakingScenario, WritingTask } from '../../types'
import { UNIT_31_SOURCE, UNIT_31_SPEAKING_ID } from './unit'

/**
 * Unit 31 texts: 2 listening scripts (a phone call to an office; a theft reported to the police), 2 readings (a letter from an office with a form; a contract enquiry with the
 * provider's answer), 1 speaking scenario (a phone call to an office: clarify the procedure, a document is missing, a deadline) and 4 writing tasks (the main formal enquiry and THREE
 * short micro-tasks: mediation of an office letter, an opinion, a formal note about a missed appointment). Targets of the band for Units 30–31 and the curriculum text for Unit 31:
 * reading 150–170 words, listening 140–170, sentences ≤ 26 words (95th percentile ≤ 20), 7 speaking turns, formal writing 70 words.
 * Original material; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native speaker.
 * ALL offices, providers, police stations, people, file numbers, deadlines and contract terms are FICTIONAL and labelled so. Every deadline and every obligation is attributed to the
 * fictional document or scenario ("laut diesem Schreiben", "laut Vertragsbedingungen", "Diese Frist gilt nur für dieses Schreiben"); nothing is German law, nothing is legal advice.
 * Scope guard (curriculum v2): the formal register (Sehr geehrte …, Ich bitte um …, Ich möchte Sie bitten, … zu …, Könnten Sie mir bitte mitteilen …); Aktiv ↔ Passiv (Präsens and with a
 * modal verb) and the Vorgangspassiv versus the Zustandspassiv, the latter ONLY with the ten participles ausgefüllt, unterschrieben, geschlossen, geöffnet, bearbeitet, erledigt,
 * genehmigt, abgelehnt, geprüft, eingereicht. The Konjunktiv II der Vergangenheit appears in ONE reading ("Ich hätte früher nachfragen sollen"), glossed, receptive. No Passiv Perfekt
 * (… worden), no Futur II, no Konjunktiv I, no Genitiv attribute, no further Nomen-Verb-Verbindungen as production, no real office, company or law.
 * Listening: the dialogues are played with the browser's text-to-speech (the existing mechanism of the listening lab). That playback has NOT been
 * verified on real devices, so no final-test item depends on audio.
 */
export const UNIT_31_LISTENING: ListeningExercise[] = [
  {
    id: 'b1-li-31-01',
    unit: 31,
    level: 'B1',
    title: 'Ein Anruf beim Bürgeramt (erfunden)',
    lines: [
      {
        speaker: 'Frau Berger',
        text: 'Bürgeramt Brunnenau, guten Tag. Wie kann ich Ihnen helfen?',
        ru: 'Бюргерамт Бруннау, добрый день. Чем могу помочь?',
        ky: 'Бруннау бюргерамты, кайырлуу күн. Сизге кандай жардам бере алам?',
      },
      {
        speaker: 'Herr Kaya',
        text: 'Guten Tag. Ich rufe wegen meines Antrags an. Könnten Sie mir bitte mitteilen, wie der Stand ist?',
        ru: 'Добрый день. Я звоню по поводу моего заявления. Не могли бы вы сообщить, как обстоят дела?',
        ky: 'Кайырлуу күн. Мен арызым боюнча чалып жатам. Абалы кандай экенин мага билдире аласызбы?',
      },
      {
        speaker: 'Frau Berger',
        text: 'Gern. Haben Sie das Aktenzeichen? Dann sehe ich nach.',
        ru: 'С удовольствием. У вас есть номер дела? Тогда я посмотрю.',
        ky: 'Кубанычка. Сизде иштин номери барбы? Анда мен караймын.',
      },
      {
        speaker: 'Herr Kaya',
        text: 'Ja, es steht im Brief: siebzehn, null, vier, zwei, fünf.',
        ru: 'Да, он написан в письме: семнадцать, ноль, четыре, два, пять.',
        ky: 'Ооба, ал каттын ичинде жазылган: он жети, нөл, төрт, эки, беш.',
      },
      {
        speaker: 'Frau Berger',
        text: 'Danke. Ihr Antrag wird gerade bearbeitet. Das Formular ist ausgefüllt und unterschrieben. Leider fehlt noch der Nachweis über Ihren Wohnort.',
        ru: 'Спасибо. Ваше заявление сейчас рассматривается. Бланк заполнен и подписан. К сожалению, ещё не хватает подтверждения вашего места жительства.',
        ky: 'Рахмат. Сиздин арызыңыз азыр каралып жатат. Бланк толтурулган жана кол коюлган. Тилекке каршы, жашаган жериңиз боюнча тастыктоочу документ дагы жок.',
      },
      {
        speaker: 'Herr Kaya',
        text: 'Und wie lange dauert die Bearbeitung?',
        ru: 'А как долго длится рассмотрение?',
        ky: 'Ал эми иштетүү канча убакытка созулат?',
      },
      {
        speaker: 'Frau Berger',
        text: 'Laut unserem Schreiben dauert sie etwa zwei Wochen, wenn alles vollständig ist.',
        ru: 'Согласно нашему письму, примерно две недели, если всё полное.',
        ky: 'Биздин кат боюнча болжол менен эки жума, эгер баары толук болсо.',
      },
      {
        speaker: 'Herr Kaya',
        text: 'Das habe ich nicht gewusst. Bis wann muss ich ihn vorlegen?',
        ru: 'Этого я не знал. До какого срока мне его предъявить?',
        ky: 'Муну мен билген эмесмин. Аны кайсы мөөнөткө чейин көрсөтүшүм керек?',
      },
      {
        speaker: 'Frau Berger',
        text: 'Laut unserem Schreiben bis zum zwanzigsten Mai. Der Nachweis kann auch per Post nachgereicht werden.',
        ru: 'Согласно нашему письму, до двадцатого мая. Подтверждение можно также прислать по почте.',
        ky: 'Биздин кат боюнча жыйырманчы маага чейин. Тастыктоочу документти почта аркылуу да тапшырса болот.',
      },
      {
        speaker: 'Herr Kaya',
        text: 'Gut. Ich möchte Sie noch bitten, mir den Termin schriftlich zu bestätigen.',
        ru: 'Хорошо. Я хотел бы ещё попросить вас подтвердить мне срок письменно.',
        ky: 'Жакшы. Мен сизден мөөнөттү мага жазуу жүзүндө ырастоону дагы өтүнгүм келет.',
      },
      {
        speaker: 'Frau Berger',
        text: 'Das mache ich. Sie erhalten die Bestätigung heute noch. Bei Rückfragen ist Herr Wolf Ihr Ansprechpartner.',
        ru: 'Сделаю. Вы получите подтверждение ещё сегодня. При уточняющих вопросах контактное лицо — господин Вольф.',
        ky: 'Жасайм. Ырастоону бүгүн эле аласыз. Тактоочу суроолор болсо, байланыш адамы — Вольф мырза.',
      },
      {
        speaker: 'Herr Kaya',
        text: 'Vielen Dank für Ihre Hilfe. Auf Wiederhören.',
        ru: 'Большое спасибо за вашу помощь. До свидания.',
        ky: 'Жардамыңыз үчүн чоң рахмат. Жакшы калыңыз.',
      },
    ],
    questions: [
      {
        q: 'Warum ruft Herr Kaya an?',
        options: ['Er möchte wissen, wie es mit seinem Antrag steht.', 'Er möchte seinen alten Antrag heute zurückziehen.', 'Er möchte ein Formular abholen.'],
        answer: 0,
      },
      {
        q: 'Was fehlt laut Frau Berger noch?',
        options: ['Die Unterschrift.', 'Der Nachweis über den Wohnort.', 'Das Aktenzeichen.'],
        answer: 1,
      },
      {
        q: 'Wie kann Herr Kaya den Nachweis abgeben?',
        options: ['Nur persönlich am Schalter.', 'Nur per E-Mail.', 'Auch per Post.'],
        answer: 2,
      },
      {
        q: 'Was bekommt Herr Kaya noch heute?',
        options: ['Eine schriftliche Bestätigung.', 'Einen Termin im Amt.', 'Das genehmigte Formular.'],
        answer: 0,
      },
    ],
    keywords: ['Behörde', 'Aktenzeichen', 'Nachweis'],
    source: UNIT_31_SOURCE,
  },
  {
    id: 'b1-li-31-02',
    unit: 31,
    level: 'B1',
    title: 'Ein Diebstahl wird gemeldet (erfunden)',
    lines: [
      {
        speaker: 'Polizist',
        text: 'Polizeiwache Brunnenau, guten Tag. Was ist passiert?',
        ru: 'Полицейский участок Бруннау, добрый день. Что случилось?',
        ky: 'Бруннау полиция бөлүмү, кайырлуу күн. Эмне болду?',
      },
      {
        speaker: 'Frau Okan',
        text: 'Guten Tag. Ich möchte einen Diebstahl melden. Jemand hat mein Fahrrad gestern Abend gestohlen.',
        ru: 'Добрый день. Я хочу сообщить о краже. Кто-то украл мой велосипед вчера вечером.',
        ky: 'Кайырлуу күн. Мен уурулук жөнүндө билдиргим келет. Бирөө менин велосипедимди кечээ кечинде уурдап кетти.',
      },
      {
        speaker: 'Polizist',
        text: 'Das tut mir leid. Wo stand das Fahrrad, und wann haben Sie es zuletzt gesehen?',
        ru: 'Мне очень жаль. Где стоял велосипед и когда вы видели его в последний раз?',
        ky: 'Кечиресиз. Велосипед кайда турган жана аны акыркы жолу качан көрдүңүз?',
      },
      {
        speaker: 'Frau Okan',
        text: 'Es stand am Bahnhof, gegen sechs Uhr. Ein Zeuge hat einen jungen Mann mit einer grünen Jacke gesehen.',
        ru: 'Он стоял у вокзала, около шести часов. Свидетель видел молодого человека в зелёной куртке.',
        ky: 'Ал вокзалда турган, саат алтыга жакын. Күбө жашыл куртка кийген жаш жигитти көргөн.',
      },
      {
        speaker: 'Polizist',
        text: 'Haben Sie ein Foto vom Fahrrad? Das hilft uns bei der Beschreibung.',
        ru: 'У вас есть фото велосипеда? Это поможет нам с описанием.',
        ky: 'Велосипеддин сүрөтү барбы? Бул бизге сүрөттөөдө жардам берет.',
      },
      {
        speaker: 'Frau Okan',
        text: 'Ich habe ein Foto auf meinem Handy. Das Fahrrad ist blau und hat einen Korb.',
        ru: 'У меня есть фото в телефоне. Велосипед синий, с корзиной.',
        ky: 'Телефонумда сүрөтү бар. Велосипед көк жана себети бар.',
      },
      {
        speaker: 'Polizist',
        text: 'Gut. Ihre Angaben werden jetzt aufgenommen. Haben Sie Ihren Ausweis dabei, damit ich Ihre Daten prüfen kann?',
        ru: 'Хорошо. Ваши данные сейчас записываются. У вас с собой удостоверение, чтобы я мог проверить ваши данные?',
        ky: 'Жакшы. Сиздин маалыматыңыз азыр жазылып жатат. Маалыматыңызды текшерүүм үчүн күбөлүгүңүз жаныңызбы?',
      },
      {
        speaker: 'Frau Okan',
        text: 'Leider nicht, weil er zu Hause liegt. Kann ich ihn später vorlegen?',
        ru: 'К сожалению, нет, потому что он дома. Могу я предъявить его позже?',
        ky: 'Тилекке каршы, жок, анткени ал үйдө жатат. Аны кийинчерээк көрсөтсөм болобу?',
      },
      {
        speaker: 'Polizist',
        text: 'Ja, das geht. Der Bericht ist geschrieben, aber er muss noch unterschrieben werden. Das Aktenzeichen steht oben.',
        ru: 'Да, можно. Заявление написано, но его ещё нужно подписать. Номер дела указан сверху.',
        ky: 'Ооба, болот. Билдирүү жазылды, бирок ага дагы кол коюу керек. Иштин номери жогору жагында.',
      },
      {
        speaker: 'Frau Okan',
        text: 'Muss ich auch meine Versicherung informieren?',
        ru: 'Нужно ли мне также сообщить моей страховой?',
        ky: 'Мен камсыздандыруума да билдиришим керекпи?',
      },
      {
        speaker: 'Polizist',
        text: 'Das müssen Sie bei Ihrer Versicherung erfragen. Sie meldet den Schaden nach ihren eigenen Regeln.',
        ru: 'Это вам нужно уточнить у вашей страховой. Она принимает сообщение об ущербе по своим правилам.',
        ky: 'Муну камсыздандырууңуздан сурашыңыз керек. Ал зыянды өз эрежелери боюнча кабыл алат.',
      },
    ],
    questions: [
      {
        q: 'Was möchte Frau Okan melden?',
        options: ['Einen Diebstahl.', 'Einen Verkehrsunfall.', 'Einen Wohnungsschaden.'],
        answer: 0,
      },
      {
        q: 'Was hat ein Zeuge gesehen?',
        options: ['Eine Frau mit einem Hund.', 'Einen Mann mit einem Fahrrad.', 'Einen jungen Mann mit einer grünen Jacke.'],
        answer: 2,
      },
      {
        q: 'Was fehlt noch bei der Meldung?',
        options: ['Der Ausweis, den sie später vorlegen kann.', 'Die Unterschrift des Zeugen unter dem Bericht.', 'Ein Foto vom Fahrrad.'],
        answer: 0,
      },
      {
        q: 'Wen soll Frau Okan wegen des Schadens fragen?',
        options: ['Ihren Vermieter.', 'Ihre Versicherung.', 'Das Bürgeramt.'],
        answer: 1,
      },
    ],
    keywords: ['Polizei', 'Diebstahl', 'Zeuge'],
    source: UNIT_31_SOURCE,
  },
]

export const UNIT_31_READING: ReadingText[] = [
  {
    id: 'b1-re-31-01',
    unit: 31,
    level: 'B1',
    title: 'Ein Schreiben vom Bürgeramt (erfunden)',
    body: [
      'Erfundenes Behördenschreiben, Bürgeramt Brunnenau, Aktenzeichen 17-0425: Sehr geehrter Herr Kaya, Ihr Antrag auf eine Bescheinigung ist eingegangen und wird gerade bearbeitet. Leider ist er unvollständig, weil noch der Nachweis über Ihren Wohnort fehlt. Das Bürgeramt prüft zuerst, ob alle Unterlagen vollständig sind.',
      'Bitte reichen Sie den Nachweis bis zum 20. Mai nach. Sie können ihn persönlich abgeben oder per Post schicken. Diese Frist gilt nur für dieses Schreiben. Falls Sie die Frist nicht einhalten können, teilen Sie uns das bitte vorher mit. Sobald der Nachweis vorliegt, wird Ihr Antrag weiter geprüft, und Sie erhalten einen Bescheid.',
      'Das Formular in der Anlage muss ausgefüllt und unterschrieben werden. Bitte nennen Sie in Ihrer Antwort immer das Aktenzeichen im Betreff, damit wir Ihren Antrag schnell finden. Wenn Sie persönlich kommen möchten, finden Sie die Öffnungszeiten auf unserer Internetseite. Bei Rückfragen ist Frau Berger Ihre Ansprechpartnerin. Mit freundlichen Grüßen, Bürgeramt Brunnenau.',
      'Formular (erfunden): Name: ____ Aktenzeichen: ____ Anlage: Nachweis über den Wohnort ☐ Das Formular ist ausgefüllt ☐ Das Formular ist unterschrieben ☐',
    ],
    gloss: [
      {
        word: 'wird gerade bearbeitet',
        ru: 'сейчас рассматривается (Vorgangspassiv: процесс идёт)',
        ky: 'азыр каралып жатат (Vorgangspassiv: процесс жүрүп жатат)',
        example: 'Der Antrag wird gerade geprüft.',
        grammar: 'werden + Partizip II + gerade: процесс',
        grammarKy: 'werden + Partizip II + gerade: жүрүп жаткан процесс',
        related: [],
      },
      {
        word: 'Das Formular ist ausgefüllt',
        ru: 'Бланк заполнен (Zustandspassiv: результат)',
        ky: 'Бланк толтурулган (Zustandspassiv: жыйынтык)',
        example: 'Das Formular ist ausgefüllt und unterschrieben.',
        grammar: 'sein + Partizip II: готовый результат; причастие из списка юнита',
        grammarKy: 'sein + Partizip II: даяр жыйынтык; бөлүмдүн тизмесиндеги причастие',
        related: [],
      },
      {
        word: 'muss ausgefüllt und unterschrieben werden',
        ru: 'должен быть заполнен и подписан (Passiv с модальным глаголом)',
        ky: 'толтурулуп, кол коюлушу керек (модалдык этиш менен Passiv)',
        example: 'Das Formular muss eingereicht werden.',
        grammar: 'модальный глагол … Partizip II + werden в конце',
        grammarKy: 'модалдык этиш … аягында Partizip II + werden',
        related: [],
      },
      {
        word: 'Bitte reichen Sie … nach. / teilen Sie uns … mit.',
        ru: 'Пожалуйста, представьте позже … / сообщите нам … (разделяемые глаголы, форма Sie)',
        ky: 'Сураныч, кийинчерээк тапшырыңыз … / бизге билдириңиз … (бөлүнүүчү этиштер, Sie формасы)',
        example: 'Bitte teilen Sie uns die Adresse mit.',
        grammar: 'приставка в конце: nachreichen, mitteilen; в официальных письмах — форма Sie',
        grammarKy: 'приставка аягында: nachreichen, mitteilen; расмий каттарда — Sie формасы',
        related: [],
      },
    ],
    questions: [
      { q: 'Aussage: Herr Kaya hat seinen Antrag online gestellt.', options: ['richtig', 'falsch', 'steht nicht im Text'], answer: 2 },
      {
        q: 'Bis wann soll der Nachweis nachgereicht werden — laut diesem Schreiben?',
        options: ['Bis zum 20. Mai.', 'Bis Ende des Jahres.', 'Bis zum nächsten Termin.'],
        answer: 0,
      },
      {
        q: 'Was soll Herr Kaya tun, wenn er die Frist nicht einhalten kann?',
        options: ['Gar nichts, die Frist gilt immer.', 'Dem Amt vorher Bescheid geben.', 'Einen neuen Antrag stellen.'],
        answer: 1,
      },
    ],
    source: UNIT_31_SOURCE,
  },
  {
    id: 'b1-re-31-02',
    unit: 31,
    level: 'B1',
    title: 'Eine Anfrage an den Anbieter (erfunden)',
    body: [
      'Erfundene E-Mail an den Anbieter NordNetz: Sehr geehrte Damen und Herren, in den Vertragsbedingungen steht, dass mein Vertrag eine Laufzeit von zwölf Monaten hat. Ich habe die Vertragsbedingungen erst gestern vollständig gelesen, obwohl ich den Vertrag schon lange habe. Der Vertrag läuft bald aus, und ich möchte keinen neuen Tarif. Ich habe die Kündigungsfrist nicht beachtet, weil ich sie nicht kannte. Ich hätte früher nachfragen sollen. Könnten Sie mir bitte mitteilen, ob eine Kündigung jetzt noch möglich ist? Ich bitte um eine schriftliche Antwort. Mit freundlichen Grüßen, Mira Okan',
      'Antwort von NordNetz (erfunden): Sehr geehrte Frau Okan, Ihre Anfrage ist bearbeitet. Laut diesen Vertragsbedingungen ist eine Kündigung nur schriftlich möglich und muss vier Wochen vor Vertragsende eingehen. Ihre Zahlung ist geprüft. Laut diesen Vertragsbedingungen beginnt die Frist, wenn Ihr Schreiben eingeht. Bitte nennen Sie die Vertragsnummer im Betreff, damit wir Ihr Schreiben zuordnen können. Das Schreiben mit allen Angaben wird Ihnen per Post geschickt. Bei Fragen ist Herr Wolf Ihr Ansprechpartner. Alle Angaben gelten nur für diesen Beispielvertrag.',
    ],
    gloss: [
      {
        word: 'Ich hätte früher nachfragen sollen.',
        ru: 'Мне следовало спросить раньше. (только для понимания)',
        ky: 'Мен эртерээк сурашым керек эле. (түшүнүү үчүн гана)',
        example: 'Ich hätte die Frist beachten sollen.',
        grammar: 'Konjunktiv II der Vergangenheit: hätte … sollen — сожаление о прошлом; в этом юните только для чтения',
        grammarKy: 'Konjunktiv II der Vergangenheit: hätte … sollen — өткөндөгү өкүнүч; бул бөлүмдө окуу үчүн гана',
        related: [],
      },
      {
        word: 'Könnten Sie mir bitte mitteilen, …? / Ich bitte um …',
        ru: 'Не могли бы вы сообщить мне …? / Прошу … (формальные просьбы)',
        ky: 'Мага … билдире аласызбы? / … сурайм (расмий өтүнүчтөр)',
        example: 'Ich bitte um eine Antwort.',
        grammar: 'Konjunktiv-II-Höflichkeit; bitten um + Akkusativ',
        grammarKy: 'Konjunktiv-II-сылыктык; bitten um + Akkusativ',
        related: [],
      },
      {
        word: 'Ihre Anfrage ist bearbeitet.',
        ru: 'Ваш запрос обработан. (Zustandspassiv: результат)',
        ky: 'Сиздин суроо-талабыңыз иштелип бүткөн. (Zustandspassiv: жыйынтык)',
        example: 'Der Antrag ist geprüft.',
        grammar: 'sein + Partizip II: результат; причастие из списка юнита',
        grammarKy: 'sein + Partizip II: жыйынтык; бөлүмдүн тизмесиндеги причастие',
        related: [],
      },
      {
        word: 'Laut diesen Vertragsbedingungen',
        ru: 'Согласно этим условиям договора (вымышленным)',
        ky: 'Бул (ойдон чыгарылган) келишим шарттары боюнча',
        example: 'Laut dem Brief ist das so.',
        grammar: 'laut + Dativ: ссылка на источник; срок принадлежит вымышленному договору',
        grammarKy: 'laut + Dativ: булакка шилтеме; мөөнөт ойдон чыгарылган келишимге таандык',
        related: [],
      },
    ],
    questions: [
      { q: 'Aussage: Frau Okan hat ihren Vertrag online abgeschlossen.', options: ['richtig', 'falsch', 'steht nicht im Text'], answer: 2 },
      {
        q: 'Wie ist eine Kündigung laut diesen Vertragsbedingungen möglich?',
        options: ['Telefonisch.', 'Nur schriftlich.', 'Per Nachricht an den Ansprechpartner.'],
        answer: 1,
      },
      {
        q: 'Wer ist Frau Okans Ansprechpartner?',
        options: ['Frau Berger.', 'Herr Kaya.', 'Herr Wolf.'],
        answer: 2,
      },
    ],
    source: UNIT_31_SOURCE,
  },
]

export const UNIT_31_SPEAKING: SpeakingScenario[] = [
  {
    id: UNIT_31_SPEAKING_ID,
    title: 'Anruf beim Bürgeramt',
    titleRu: 'Звонок в бюргерамт',
    titleKy: 'Бюргерамтка чалуу',
    icon: '📞',
    level: 'B1',
    goal: {
      ru: 'Вы звоните в вымышленное учреждение (Bürgeramt Brunnenau) из-за своего заявления. Вежливо уточните статус и нужные документы, отреагируйте на неожиданное сообщение, что одного документа не хватает, спросите о сроке и попросите письменное подтверждение. Срок называет сотрудник — он принадлежит вымышленному письму, а не закону. Это самооценка по списку, а не оценка баллами.',
      ky: 'Сиз арызыңыз боюнча ойдон чыгарылган мекемеге (Bürgeramt Brunnenau) чалып жатасыз. Статусту жана керектүү документтерди сылык тактаңыз, бир документ жетпей жатканы жөнүндөгү күтүлбөгөн кабарга жооп бериңиз, мөөнөт жөнүндө сураңыз жана жазуу жүзүндөгү ырастоону суранаңыз. Мөөнөттү кызматкер атайт — ал ойдон чыгарылган катка таандык, мыйзамга эмес. Бул упай менен эмес, тизме боюнча өзүн баалоо.',
    },
    turns: [
      {
        ai: 'Bürgeramt Brunnenau, guten Tag. Wie kann ich Ihnen helfen?',
        aiRu: 'Бюргерамт Бруннау, добрый день. Чем могу помочь?',
        aiKy: 'Бруннау бюргерамты, кайырлуу күн. Сизге кандай жардам бере алам?',
        hints: [
          'Guten Tag. Ich rufe wegen eines Antrags an.',
          'Guten Tag. Könnten Sie mir bitte mitteilen, wie es mit meinem Antrag steht?',
          'Guten Tag, ich habe vor zwei Wochen einen Antrag eingereicht.',
        ],
        keywords: ['antrag', 'stand', 'mitteilen', 'eingereicht'],
      },
      {
        ai: 'Haben Sie das Aktenzeichen? Es steht oben im Schreiben.',
        aiRu: 'У вас есть номер дела? Он указан в верхней части письма.',
        aiKy: 'Сизде иштин номери барбы? Ал каттын жогору жагында жазылган.',
        hints: [
          'Ja, einen Moment bitte, das Aktenzeichen ist siebzehn, null, vier, zwei, fünf.',
          'Entschuldigung, könnten Sie die Frage bitte wiederholen?',
          'Ich suche den Brief kurz. Bitte warten Sie einen Moment.',
        ],
        keywords: ['aktenzeichen', 'moment', 'brief', 'wiederholen'],
      },
      {
        ai: 'Danke. Ihr Antrag wird gerade bearbeitet. Das Formular ist ausgefüllt.',
        aiRu: 'Спасибо. Ваше заявление сейчас рассматривается. Бланк заполнен.',
        aiKy: 'Рахмат. Сиздин арызыңыз азыр каралып жатат. Бланк толтурулган.',
        hints: [
          'Das freut mich. Könnten Sie mir bitte mitteilen, welche Unterlagen noch gebraucht werden?',
          'Danke. Wird der Antrag bald genehmigt?',
          'Habe ich Sie richtig verstanden? Der Antrag ist noch nicht geprüft?',
        ],
        keywords: ['unterlagen', 'mitteilen', 'genehmigt', 'verstanden'],
      },
      {
        ai: 'Leider fehlt noch ein Dokument: Der Nachweis über Ihren Wohnort ist nicht in der Anlage.',
        aiRu: 'К сожалению, не хватает ещё одного документа: подтверждения вашего места жительства нет в приложении.',
        aiKy: 'Тилекке каршы, дагы бир документ жетишпейт: жашаган жериңиз боюнча тастыктоочу документ тиркемеде жок.',
        hints: [
          'Das habe ich nicht gewusst. Ich reiche den Nachweis gern nach.',
          'Moment, ich überlege kurz. Kann der Nachweis per Post nachgereicht werden?',
          'Das ist ärgerlich. Bis wann muss ich den Nachweis vorlegen?',
        ],
        keywords: ['nachweis', 'nachreichen', 'post', 'vorlegen'],
      },
      {
        ai: 'Laut unserem Schreiben bis zum zwanzigsten Mai. Diese Frist gilt nur für dieses Schreiben.',
        aiRu: 'Согласно нашему письму, до двадцатого мая. Этот срок действует только для этого письма.',
        aiKy: 'Биздин кат боюнча жыйырманчы маага чейин. Бул мөөнөт ушул катка гана таандык.',
        hints: [
          'Ich möchte Sie bitten, mir die Frist schriftlich zu bestätigen.',
          'Könnten Sie die Frist bitte um eine Woche verlängern?',
          'Gut, dann reiche ich den Nachweis bis dahin nach.',
        ],
        keywords: ['frist', 'bestätigen', 'verlängern', 'schriftlich'],
      },
      {
        ai: 'Das muss der Sachbearbeiter entscheiden. Er ruft Sie morgen zurück. Passt Ihnen das?',
        aiRu: 'Это должен решить сотрудник. Он перезвонит вам завтра. Вас это устраивает?',
        aiKy: 'Муну иш жүргүзүүчү кызматкер чечиши керек. Ал сизге эртең кайра чалат. Бул сизге ылайыктуубу?',
        hints: [
          'Ja, das passt. Ich bin morgen Vormittag zu erreichen.',
          'Könnten Sie mir bitte eine Nachricht schicken, falls ich nicht da bin?',
          'Das ist in Ordnung. Wie heißt der Sachbearbeiter?',
        ],
        keywords: ['sachbearbeiter', 'zurückrufen', 'erreichen', 'nachricht'],
      },
      {
        ai: 'Ich fasse zusammen: Sie reichen den Nachweis nach, und wir bestätigen die Frist schriftlich. Ist das richtig?',
        aiRu: 'Подведу итог: вы представляете подтверждение позже, а мы письменно подтверждаем срок. Это верно?',
        aiKy: 'Жыйынтыктайм: сиз тастыктоочу документти кийин тапшырасыз, ал эми биз мөөнөттү жазуу жүзүндө ырастайбыз. Туурабы?',
        hints: [
          'Ja, genau. Vielen Dank für Ihre Hilfe. Auf Wiederhören.',
          'Ja, das ist richtig. Vielen Dank für die Klärung.',
          'Danke, ich warte auf Ihre Bestätigung. Schönen Tag noch.',
        ],
        keywords: ['richtig', 'klärung', 'bestätigung', 'wiederhören'],
      },
    ],
    source: UNIT_31_SOURCE,
  },
]

const TIP_SELF = {
  ru: 'После написания пройдите по списку ниже и оцените себя сами: приложение проверяет только объём и ожидаемые слова, но не оценивает качество письма.',
  ky: 'Жазып бүткөндөн кийин төмөнкү тизме боюнча өзүңүздү өзүңүз баалаңыз: тиркеме көлөмдү жана күтүлгөн сөздөрдү гана текшерет, жазуунун сапатын баалабайт.',
}

export const UNIT_31_WRITING: WritingTask[] = [
  {
    id: 'b1-wr-31-01',
    unit: 31,
    level: 'B1',
    title: 'Eine formelle Anfrage an einen Anbieter oder ein Amt',
    situation: {
      ru: 'У вас договор с вымышленным оператором (или заявление в вымышленном учреждении), и вам нужно кое-что уточнить. Напишите формальный запрос: обращение, повод, вежливая просьба, одно предложение в Passiv или о статусе (Zustandspassiv), ссылка на срок или документы и заключение. Срок и условия называйте как принадлежащие вымышленному письму или договору, а не закону.',
      ky: 'Сизде ойдон чыгарылган оператор менен келишим (же ойдон чыгарылган мекемеде арыз) бар жана бир нерсени тактоо керек. Расмий суроо жазыңыз: кайрылуу, себеп, сылык өтүнүч, Passivде же статус жөнүндө (Zustandspassiv) бир сүйлөм, мөөнөткө же документтерге шилтеме жана жыйынтык. Мөөнөттү жана шарттарды ойдон чыгарылган кат же келишимдики катары атаңыз, мыйзамдыкы катары эмес.',
    },
    formal: true,
    minWords: 70,
    mustInclude: [
      {
        label: 'Anrede und Gruß (Sehr geehrte Damen und Herren, … / Mit freundlichen Grüßen)',
        patterns: ['sehr geehrte', 'sehr geehrter', 'mit freundlichen grüßen'],
        explain: {
          ru: 'Официальное обращение в начале («Sehr geehrte …») и «Mit freundlichen Grüßen» в конце; везде форма Sie.',
          ky: 'Башында расмий кайрылуу («Sehr geehrte …») жана аягында «Mit freundlichen Grüßen»; бардык жерде Sie формасы.',
        },
      },
      {
        label: 'Anlass (Ich schreibe Ihnen wegen … / zu Aktenzeichen …)',
        patterns: ['ich schreibe ihnen', 'wegen', 'aktenzeichen', 'bezug'],
        explain: {
          ru: 'Коротко скажите, по какому поводу вы пишете: «Ich schreibe Ihnen wegen …».',
          ky: 'Эмне себептен жазып жатканыңызды кыскача айтыңыз: «Ich schreibe Ihnen wegen …».',
        },
      },
      {
        label: 'Höfliche Bitte (Ich bitte um … / Könnten Sie mir bitte mitteilen, … / Ich möchte Sie bitten, … zu …)',
        patterns: ['ich bitte um', 'könnten sie', 'ich möchte sie bitten', 'würden sie'],
        explain: {
          ru: 'Одна вежливая просьба из шаблонов: «Ich bitte um …», «Könnten Sie mir bitte mitteilen, …», «Ich möchte Sie bitten, … zu …».',
          ky: 'Калыптардан бир сылык өтүнүч: «Ich bitte um …», «Könnten Sie mir bitte mitteilen, …», «Ich möchte Sie bitten, … zu …».',
        },
      },
      {
        label: 'Passiv oder Zustand (Der Antrag wird bearbeitet / ist geprüft)',
        patterns: ['wird ', 'werden ', ' ist geprüft', ' ist bearbeitet', ' ist eingereicht', ' ist genehmigt', ' ist abgelehnt', ' ist erledigt'],
        explain: {
          ru: 'Одно предложение о статусе: Vorgangspassiv («wird gerade bearbeitet») или Zustandspassiv с причастием из списка («ist geprüft»).',
          ky: 'Статус жөнүндө бир сүйлөм: Vorgangspassiv («wird gerade bearbeitet») же тизмедеги причастие менен Zustandspassiv («ist geprüft»).',
        },
      },
      {
        label: 'Frist, Unterlagen oder Vertrag (laut Schreiben / laut Vertragsbedingungen)',
        patterns: ['frist', 'unterlagen', 'vertrag', 'laufzeit', 'nachweis', 'laut '],
        explain: {
          ru: 'Упомяните срок, документы или условие договора и сошлитесь на письмо или договор: «laut Ihrem Schreiben».',
          ky: 'Мөөнөттү, документтерди же келишим шартын эскерип, катка же келишимге шилтеме бериңиз: «laut Ihrem Schreiben».',
        },
      },
      {
        label: 'Dank (Vielen Dank im Voraus / Für Ihre Antwort danke ich Ihnen)',
        patterns: ['vielen dank', 'danke', 'im voraus'],
        explain: {
          ru: 'Поблагодарите заранее: «Vielen Dank im Voraus».',
          ky: 'Алдын ала ыраазычылык билдириңиз: «Vielen Dank im Voraus».',
        },
      },
    ],
    model:
      'Sehr geehrte Damen und Herren, ich schreibe Ihnen wegen meines Vertrags mit NordNetz. Laut Ihren Vertragsbedingungen hat der Vertrag eine Laufzeit von zwölf Monaten. Könnten Sie mir bitte mitteilen, bis wann ich kündigen kann? Meine Anfrage vom Montag wird noch bearbeitet. Ich habe die Unterlagen vollständig eingereicht. Gibt es einen Ansprechpartner für meine Frage? Ich bitte um eine schriftliche Antwort bis Freitag. Vielen Dank im Voraus. Mit freundlichen Grüßen, Mira Okan',
    tips: [
      {
        ru: 'Порядок письма: обращение — повод — просьба — статус или срок — благодарность — прощание. Везде форма Sie; для вежливости используйте «Könnten Sie …».',
        ky: 'Каттын иреттери: кайрылуу — себеп — өтүнүч — статус же мөөнөт — ыраазычылык — коштошуу. Бардык жерде Sie формасы; сылыктык үчүн «Könnten Sie …» колдонуңуз.',
      },
      {
        ru: 'Срок и условия называйте со ссылкой («laut Ihrem Schreiben», «laut Vertragsbedingungen»). Не пишите их как общий закон. Конъюнктив II прошедшего времени («Ich hätte … sollen») писать не нужно.',
        ky: 'Мөөнөттү жана шарттарды шилтеме менен атаңыз («laut Ihrem Schreiben», «laut Vertragsbedingungen»). Аларды жалпы мыйзам катары жазбаңыз. Өткөн чактагы Konjunktiv II («Ich hätte … sollen») жазуунун кереги жок.',
      },
      TIP_SELF,
    ],
    source: UNIT_31_SOURCE,
  },
  {
    id: 'b1-wr-31-02',
    unit: 31,
    level: 'B1',
    title: 'Ein Behördenschreiben weitergeben',
    situation: {
      ru: 'Ваш друг не понимает письмо из вымышленного бюргерамта (из чтения этого юнита: заявление неполное, не хватает подтверждения места жительства, срок — 20 мая согласно письму). Перескажите содержание в двух-трёх предложениях своими словами, неформально (du).',
      ky: 'Досуңуз ойдон чыгарылган бюргерамттан келген катты түшүнбөй жатат (бул бөлүмдүн окуу текстинен: арыз толук эмес, жашаган жер боюнча тастыктоочу документ жетишпейт, мөөнөт — кат боюнча 20-май). Мазмунун эки-үч сүйлөм менен өз сөзүңүз менен, расмий эмес (du) айтып бериңиз.',
    },
    formal: false,
    minWords: 30,
    mustInclude: [
      {
        label: 'Der Kern (Der Antrag ist unvollständig / Es fehlt der Nachweis)',
        patterns: ['fehlt', 'unvollständig', 'nachweis'],
        explain: {
          ru: 'Назовите главное: что неполно или что не хватает.',
          ky: 'Негизгисин атаңыз: эмне толук эмес же эмне жетишпейт.',
        },
      },
      {
        label: 'Die Frist mit Quelle (Bis zum 20. Mai, steht im Brief)',
        patterns: ['20. mai', 'frist', 'bis zum', 'steht im brief', 'laut'],
        explain: {
          ru: 'Назовите срок и скажите, откуда он: «steht im Brief», «laut dem Brief».',
          ky: 'Мөөнөттү атап, ал кайдан экенин айтыңыз: «steht im Brief», «laut dem Brief».',
        },
      },
      {
        label: 'Was du tun sollst (Du musst … nachreichen / Du kannst … schicken)',
        patterns: ['musst', 'kannst', 'sollst', 'nachreichen', 'schicken'],
        explain: {
          ru: 'Скажите другу, что нужно сделать: «Du musst den Nachweis nachreichen».',
          ky: 'Досуңузга эмне кылуу керектигин айтыңыз: «Du musst den Nachweis nachreichen».',
        },
      },
      {
        label: 'Eigene Worte (Das Amt schreibt, dass …)',
        patterns: ['schreibt, dass', 'steht', 'das amt'],
        explain: {
          ru: 'Передайте содержание своими словами: «Das Amt schreibt, dass …». Не копируйте письмо.',
          ky: 'Мазмунду өз сөзүңүз менен айтыңыз: «Das Amt schreibt, dass …». Катты көчүрбөңүз.',
        },
      },
    ],
    model:
      'Das Amt schreibt, dass dein Antrag unvollständig ist. Es fehlt noch der Nachweis über deinen Wohnort. Du musst ihn bis zum 20. Mai nachreichen, das steht im Brief. Wenn du es nicht schaffst, sollst du dem Amt vorher Bescheid geben.',
    tips: [
      {
        ru: 'Не копируйте письмо, а перескажите: кто пишет, что случилось, что нужно сделать, до какого срока (со ссылкой на письмо). Формальные слова замените разговорными: «teilen mit» → «schreibt».',
        ky: 'Катты көчүрбөңүз, айтып бериңиз: ким жазат, эмне болду, эмне кылуу керек, кайсы мөөнөткө чейин (катка шилтеме менен). Расмий сөздөрдү оозеки сөздөргө алмаштырыңыз: «teilen mit» → «schreibt».',
      },
      {
        ru: 'Не добавляйте ничего от себя: если вы не знаете, что бывает при нарушении срока, так и скажите — это вопрос к учреждению.',
        ky: 'Өзүңүздөн эч нерсе кошпоңуз: мөөнөт бузулганда эмне болорун билбесеңиз, ошентип айтыңыз — бул мекемеге суроо.',
      },
      TIP_SELF,
    ],
    source: UNIT_31_SOURCE,
  },
  {
    id: 'b1-wr-31-03',
    unit: 31,
    level: 'B1',
    title: 'Meine Meinung: Brief oder E-Mail an ein Amt?',
    situation: {
      ru: 'Друг спрашивает, лучше ли написать в учреждение письмо на бумаге или электронное письмо. Напишите 2–3 предложения: ваше мнение, причина и ещё одна точка зрения (у другого человека может быть другая причина). Не называйте своё мнение правилом.',
      ky: 'Досуңуз мекемеге кагазга жазылган кат жазуу жакшыбы же электрондук кат жакшыбы деп сурап жатат. 2–3 сүйлөм жазыңыз: пикириңиз, себеби жана дагы бир көз караш (башка адамдын башка себеби болушу мүмкүн). Пикириңизди эреже катары атабаңыз.',
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
        label: 'Grund (weil / denn / damit)',
        patterns: ['weil', 'denn', 'damit', 'deshalb'],
        explain: {
          ru: 'Назовите причину: weil, denn, damit.',
          ky: 'Себепти атаңыз: weil, denn, damit.',
        },
      },
      {
        label: 'Eine andere Sicht (Andere finden … / Dennoch …)',
        patterns: ['andere', 'manche', 'dennoch', 'nicht jeder'],
        explain: {
          ru: 'Упомяните другую точку зрения: andere, manche, dennoch.',
          ky: 'Башка көз карашты эскериңиз: andere, manche, dennoch.',
        },
      },
    ],
    model:
      'Ich finde, eine E-Mail ist praktisch, weil sie schnell ankommt und ich eine Kopie behalte. Andere finden einen Brief besser, denn er ist verbindlich und man hat etwas in der Hand. Dennoch frage ich vorher, was das Amt wünscht.',
    tips: [
      {
        ru: 'Мнение, причина, другая точка зрения: три предложения достаточно. Правила приёма писем у каждого учреждения свои — их нужно спросить у самого учреждения.',
        ky: 'Пикир, себеп, башка көз караш: үч сүйлөм жетиштүү. Каттарды кабыл алуу эрежелери ар бир мекемеде өзүнчө — аны мекемеден өзүнөн сурап билүү керек.',
      },
      {
        ru: 'Пишите «ich finde», а не «так правильно». Ваше мнение — это только ваше мнение.',
        ky: '«ich finde» деп жазыңыз, «ушундай туура» эмес. Сиздин пикириңиз — бул сиздин пикириңиз гана.',
      },
      TIP_SELF,
    ],
    source: UNIT_31_SOURCE,
  },
  {
    id: 'b1-wr-31-04',
    unit: 31,
    level: 'B1',
    title: 'Ein verpasster Termin: eine formelle Nachricht',
    situation: {
      ru: 'Вы не пришли на приём в вымышленное учреждение (вы были больны). Напишите короткое формальное сообщение: обращение, причина, вежливая просьба о новом приёме и благодарность. Не пишите подробностей о здоровье.',
      ky: 'Сиз ойдон чыгарылган мекемеге кабыл алууга келе алган жоксуз (ооруп калдыңыз). Кыска расмий билдирүү жазыңыз: кайрылуу, себеп, жаңы кабыл алууну сылык суроо жана ыраазычылык. Ден соолук боюнча майда-чүйдөсүн жазбаңыз.',
    },
    formal: true,
    minWords: 30,
    mustInclude: [
      {
        label: 'Anrede und Gruß (Sehr geehrte Frau … / Mit freundlichen Grüßen)',
        patterns: ['sehr geehrte', 'sehr geehrter', 'mit freundlichen grüßen'],
        explain: {
          ru: 'Официальное обращение и «Mit freundlichen Grüßen».',
          ky: 'Расмий кайрылуу жана «Mit freundlichen Grüßen».',
        },
      },
      {
        label: 'Der Grund (Ich konnte den Termin nicht wahrnehmen, weil …)',
        patterns: ['konnte', 'leider', 'krank', 'termin', 'verpasst'],
        explain: {
          ru: 'Назовите причину коротко: «Ich konnte den Termin leider nicht wahrnehmen, weil ich krank war».',
          ky: 'Себебин кыскача атаңыз: «Ich konnte den Termin leider nicht wahrnehmen, weil ich krank war».',
        },
      },
      {
        label: 'Die Bitte (Könnten Sie mir bitte einen neuen Termin geben? / Ich bitte um …)',
        patterns: ['könnten sie', 'ich bitte um', 'neuen termin', 'neuer termin', 'ich möchte sie bitten'],
        explain: {
          ru: 'Вежливая просьба о новом приёме: «Könnten Sie mir bitte einen neuen Termin mitteilen?».',
          ky: 'Жаңы кабыл алуу жөнүндө сылык өтүнүч: «Könnten Sie mir bitte einen neuen Termin mitteilen?».',
        },
      },
      {
        label: 'Dank (Vielen Dank im Voraus)',
        patterns: ['vielen dank', 'danke', 'im voraus'],
        explain: { ru: 'Поблагодарите заранее.', ky: 'Алдын ала ыраазычылык билдириңиз.' },
      },
    ],
    model:
      'Sehr geehrte Frau Berger, ich konnte den Termin am Montag leider nicht wahrnehmen, weil ich krank war. Könnten Sie mir bitte einen neuen Termin mitteilen? Die Unterlagen sind vollständig und werden zum Termin mitgebracht. Vielen Dank im Voraus. Mit freundlichen Grüßen, Mira Okan',
    tips: [
      {
        ru: 'Коротко и вежливо: что случилось, просьба, благодарность. Достаточно слова «krank», подробности не нужны.',
        ky: 'Кыска жана сылык: эмне болду, өтүнүч, ыраазычылык. «krank» сөзү жетиштүү, майда-чүйдөсү керек эмес.',
      },
      {
        ru: 'Не обещайте того, что вы не можете выполнить, и не ссылайтесь на правила: решение принимает учреждение.',
        ky: 'Аткара албай турган нерсеге убада бербеңиз жана эрежелерге шилтеме жасабаңыз: чечимди мекеме кабыл алат.',
      },
      TIP_SELF,
    ],
    source: UNIT_31_SOURCE,
  },
]
