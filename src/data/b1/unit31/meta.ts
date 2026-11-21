import type { B1UnitMeta } from '../meta-types'
import { UNIT_31_SPEAKING_ID } from './unit'

/**
 * Unit 31 metadata: learning objectives (German + independent Russian and Kyrgyz), the classification of the two approved concepts — the formal register (P, light) and Aktiv ↔ Passiv
 * with the Zustandspassiv (P; the Zustandspassiv is LIMITED to a closed list of ten participles; decision D-8 open, fallback receptive only) —, the RECEPTIVE Konjunktiv II der Vergangenheit
 * (one glossed reading, never required), strands (clarifying a procedure, reading and relaying an office letter = mediation, Wortbildung), the three micro-tasks (mediation of an office
 * letter, opinion, a formal note about a missed appointment), topic evidence for the required topic "emergency / police" and the spaced-revision set (Unit 30, Unit 28, A2 Unit 19).
 * The Russian and Kyrgyz texts are AI-assisted first drafts that no reviewer has checked. All offices, providers, police stations, file numbers, deadlines and contract terms are fictional,
 * attributed to the fictional document or scenario; nothing is German law and nothing is legal advice.
 */
export const UNIT_31_META: B1UnitMeta = {
  unit: 31,
  canDo: [
    {
      de: 'Ich kann einen formellen Brief oder eine formelle E-Mail an ein Amt oder einen Anbieter schreiben und am Telefon höflich nach Unterlagen, Terminen und Fristen fragen.',
      ru: 'Я могу написать формальное письмо или электронное письмо в учреждение или оператору и вежливо спросить по телефону о документах, приёмах и сроках.',
      ky: 'Мен мекемеге же операторго расмий кат же электрондук кат жаза алам жана телефон аркылуу документтер, кабыл алуу убактылары жана мөөнөттөр жөнүндө сылык сурай алам.',
    },
    {
      de: 'Ich kann einen Behördenbrief verstehen und seinen Inhalt in zwei, drei Sätzen weitergeben.',
      ru: 'Я могу понять письмо из учреждения и пересказать его содержание в двух-трёх предложениях.',
      ky: 'Мен мекемеден келген катты түшүнүп, анын мазмунун эки-үч сүйлөм менен айтып бере алам.',
    },
    {
      de: 'Ich kann Aktiv und Passiv unterscheiden und mit dem Zustandspassiv sagen, was schon erledigt ist.',
      ru: 'Я могу различать Aktiv и Passiv и с помощью Zustandspassiv сказать, что уже сделано.',
      ky: 'Мен Aktiv менен Passivди айырмалап, Zustandspassiv менен эмне буга чейин эле жасалганын айта алам.',
    },
  ],
  objectives: {
    lesen: {
      de: 'Ich kann in einem Behördenschreiben und in einer Vertragsmail Fristen, fehlende Unterlagen und Bedingungen finden und sehen, ob etwas gerade bearbeitet wird oder schon erledigt ist.',
      ru: 'Я могу найти в письме учреждения и в письме по договору сроки, недостающие документы и условия и увидеть, обрабатывается ли что-то сейчас или уже сделано.',
      ky: 'Мен мекеменин катында жана келишим боюнча катта мөөнөттөрдү, жетишпеген документтерди жана шарттарды таап, бир нерсе азыр иштетилип жатабы же буга чейин эле бүттүбү, көрө алам.',
    },
    hoeren: {
      de: 'Ich kann ein Telefonat mit einer Behörde und eine Diebstahlmeldung bei der Polizei in den wichtigen Punkten verstehen, besonders den Stand, fehlende Unterlagen und nächste Schritte.',
      ru: 'Я могу понять главное в разговоре с ведомством и в заявлении о краже в полиции, особенно статус, недостающие документы и дальнейшие шаги.',
      ky: 'Мен ведомство менен болгон сүйлөшүүдөгү жана полицияга уурулук жөнүндө билдирүүдөгү негизги нерселерди, айрыкча абалын, жетишпеген документтерди жана кийинки кадамдарды түшүнө алам.',
    },
    sprechen: {
      de: 'Ich kann bei einem Amt anrufen, den Stand klären, auf ein fehlendes Dokument ruhig reagieren, nach einer Frist fragen und eine schriftliche Bestätigung erbitten.',
      ru: 'Я могу позвонить в учреждение, выяснить статус, спокойно отреагировать на недостающий документ, спросить о сроке и попросить письменное подтверждение.',
      ky: 'Мен мекемеге чалып, абалын тактап, жетишпеген документке сабырдуу жооп берип, мөөнөт жөнүндө сурап, жазуу жүзүндөгү ырастоону суранай алам.',
    },
    schreiben: {
      de: 'Ich kann eine formelle Anfrage schreiben und kurze Texte (Behördenbrief weitergeben, Meinung, formelle Nachricht zu einem verpassten Termin).',
      ru: 'Я могу написать формальный запрос и короткие тексты (пересказать письмо учреждения, мнение, формальное сообщение о пропущенном приёме).',
      ky: 'Мен расмий суроо жана кыска тексттерди (мекеменин катын айтып берүү, пикир, өткөрүп жиберилген кабыл алуу жөнүндө расмий билдирүү) жаза алам.',
    },
  },
  differenceFromA2: {
    de: 'A2 (Unit 19) fragt nach dem Weg, nach Öffnungszeiten und füllt einfache Formulare aus; B1 versteht Verfahren, Behördenbriefe und Vertragsbedingungen und schreibt formell.',
    ru: 'В A2 (юнит 19) вы спрашивали дорогу и часы работы и заполняли простые бланки; в B1 вы понимаете процедуры, письма учреждений и условия договоров и пишете формально.',
    ky: 'A2 деңгээлинде (19-бөлүм) жолду жана иштөө убактысын сурадыңыз жана жөнөкөй бланктарды толтурдуңуз; B1 деңгээлинде процедураларды, мекемелердин каттарын жана келишим шарттарын түшүнөсүз жана расмий жазасыз.',
  },
  concepts: [
    { conceptId: 'b1-formelle-sprache', proficiency: 'P', load: 'L', role: 'new' },
    {
      conceptId: 'b1-aktiv-passiv-zustandspassiv',
      proficiency: 'P',
      load: 'M',
      role: 'new',
      // LIMITED-productive inside the concept: the Zustandspassiv, only with the ten participles of the list (decision D-8 is open; fallback: receptive only)
      constructions: [
        {
          label: 'Zustandspassiv (sein + Partizip II): ausgefüllt, unterschrieben, geschlossen, geöffnet, bearbeitet, erledigt, genehmigt, abgelehnt, geprüft, eingereicht',
          proficiency: 'P-lim',
          forms: ['ist ausgefüllt', 'ist unterschrieben', 'ist geschlossen', 'ist geöffnet', 'ist bearbeitet', 'ist erledigt', 'ist genehmigt', 'ist abgelehnt', 'ist geprüft', 'ist eingereicht'],
        },
      ],
    },
  ],
  // RECEPTIVE (no concept): glossed in ONE reading, never required in a gap, a word order, a writing checklist or a speaking hint
  receptiveOnly: [
    {
      label: 'Konjunktiv II der Vergangenheit (Ich hätte früher nachfragen sollen)',
      proficiency: 'R',
      forms: ['hätte früher nachfragen sollen', 'hätte beachten sollen', 'hätte nachfragen sollen', 'hätte machen sollen'],
    },
  ],
  scenario: {
    id: UNIT_31_SPEAKING_ID,
    unexpectedElement: {
      de: 'Ein Dokument fehlt: „Leider fehlt noch ein Dokument: Der Nachweis über Ihren Wohnort ist nicht in der Anlage.“ Der Lernende muss ruhig reagieren, nach der Frist fragen und eine schriftliche Bestätigung erbitten.',
      ru: 'Не хватает документа: «К сожалению, не хватает ещё одного документа: подтверждения вашего места жительства нет в приложении». Нужно спокойно отреагировать, спросить о сроке и попросить письменное подтверждение.',
      ky: 'Документ жетишпейт: «Тилекке каршы, дагы бир документ жетишпейт: жашаган жериңиз боюнча тастыктоочу документ тиркемеде жок». Сабырдуу жооп берип, мөөнөт жөнүндө сурап, жазуу жүзүндөгү ырастоону суроо керек.',
    },
  },
  strands: {
    repairChunks: [
      {
        de: 'Habe ich Sie richtig verstanden? Der Antrag ist noch nicht geprüft?',
        ru: 'Я правильно вас понял? Заявление ещё не проверено?',
        ky: 'Мен сизди туура түшүндүмбү? Арыз дагы текшерилген жокпу?',
      },
      {
        de: 'Entschuldigung, könnten Sie das bitte noch einmal wiederholen?',
        ru: 'Извините, не могли бы вы ещё раз повторить?',
        ky: 'Кечиресиз, муну дагы бир жолу кайталап бере аласызбы?',
      },
      {
        de: 'Meinen Sie, dass ich noch etwas nachreichen muss?',
        ru: 'Вы имеете в виду, что я должен что-то ещё представить?',
        ky: 'Сиз мен дагы бир нерсе тапшыруум керек дегенди айтып жатасызбы?',
      },
      {
        de: 'Könnten Sie mir das bitte schriftlich bestätigen?',
        ru: 'Не могли бы вы подтвердить мне это письменно?',
        ky: 'Муну мага жазуу жүзүндө ырастап бере аласызбы?',
      },
    ],
    strategyNote: {
      de: 'Informationen weitergeben (Mediation) und Behördenbriefe lesen: Suche zuerst die Fakten (Wer schreibt? Was fehlt? Bis wann — laut Brief? Was soll ich tun?). Gib dann nur diese Fakten in zwei, drei Sätzen in eigenen Worten weiter und nenne die Quelle („steht im Brief“). Fristen und Bedingungen gelten nur für dieses Schreiben oder diesen Vertrag; was sonst gilt, fragst du das Amt.',
      ru: 'Как передать информацию (медиация) и читать письма учреждений: сначала найдите факты (Кто пишет? Что не хватает? До какого срока — согласно письму? Что мне делать?). Затем передайте только эти факты в двух-трёх предложениях своими словами и назовите источник («steht im Brief»). Сроки и условия действуют только для этого письма или этого договора; что действует в других случаях, спрашивайте у учреждения.',
      ky: 'Маалыматты кантип берүү (медиация) жана мекемелердин каттарын кантип окуу: адегенде фактыларды табыңыз (Ким жазат? Эмне жетишпейт? Кайсы мөөнөткө чейин — кат боюнча? Мен эмне кылышым керек?). Андан кийин ушул фактыларды гана эки-үч сүйлөм менен өз сөзүңүз менен айтып, булагын атаңыз («steht im Brief»). Мөөнөттөр менен шарттар ушул катка же ушул келишимге гана таандык; башка учурларда эмне колдонулаарын мекемеден сураңыз.',
    },
    wortbildungNote: {
      de: 'Wörter bilden: Nomen + Nomen: Akten + Zeichen = das Aktenzeichen, Zahlung + Frist = die Zahlungsfrist, Ansprechen + Partner = der Ansprechpartner (der Artikel kommt vom letzten Wort). Mit -er bezeichnet man Personen oder Firmen: der Anbieter, der Sachbearbeiter. Mit -ung wird aus einem Verb ein Nomen: bestätigen → die Bestätigung, genehmigen → die Genehmigung. Adjektive mit -ig und -lich: zuständig, vollständig, verbindlich, erforderlich; mit un- das Gegenteil: vollständig → unvollständig.',
      ru: 'Как образуются слова: существительное + существительное: Akten + Zeichen = das Aktenzeichen, Zahlung + Frist = die Zahlungsfrist, Ansprechen + Partner = der Ansprechpartner (артикль берётся от последнего слова). С -er обозначают людей или компании: der Anbieter, der Sachbearbeiter. С -ung из глагола получается существительное: bestätigen → die Bestätigung, genehmigen → die Genehmigung. Прилагательные на -ig и -lich: zuständig, vollständig, verbindlich, erforderlich; с un- получается противоположное значение: vollständig → unvollständig.',
      ky: 'Сөздөр кантип түзүлөт: зат атооч + зат атооч: Akten + Zeichen = das Aktenzeichen, Zahlung + Frist = die Zahlungsfrist, Ansprechen + Partner = der Ansprechpartner (артикль акыркы сөздөн алынат). -er менен адамдарды же компанияларды белгилешет: der Anbieter, der Sachbearbeiter. -ung менен этиштен зат атооч жасалат: bestätigen → die Bestätigung, genehmigen → die Genehmigung. -ig жана -lich менен бүткөн сын атоочтор: zuständig, vollständig, verbindlich, erforderlich; un- менен каршы маани пайда болот: vollständig → unvollständig.',
    },
  },
  microTasks: [
    { kind: 'mediation', taskId: 'b1-wr-31-02' },
    { kind: 'meinung', taskId: 'b1-wr-31-03' },
    { kind: 'note', taskId: 'b1-wr-31-04' },
  ],
  // the required topic "emergency / police": vocabulary, the listening about a reported theft and the notice words of the unit
  topics: [
    {
      topic: 'emergency-police',
      itemIds: ['v31-21', 'v31-22', 'v31-23', 'v31-24', 'v31-25', 'v31-35', 'b1-li-31-02'],
    },
  ],
  revision: {
    fromPrevious: ['v30-7', 'v30-10', 'v30-23', 'v30-30'],
    fromThirdBack: ['v28-17', 'v28-18'],
    fromA2: ['v19-1', 'v19-38'],
  },
}
