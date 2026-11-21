import type { B1UnitMeta } from '../meta-types'
import { UNIT_27_SPEAKING_ID } from './unit'

/**
 * Unit 27 metadata: learning objectives (German + independent Russian and Kyrgyz), the productive / limited-productive classification of the two approved
 * concepts (with the closed list of the Genitiv prepositions), strands (communication repair "höflich nachhaken", Wortbildung), the opinion micro-task, the topic
 * evidence for money and banking, and the spaced-revision set. The Russian and Kyrgyz texts are AI-assisted first drafts that no reviewer has checked. The
 * classification is the approved product-design default; decision D-7 (productive use of the Genitiv prepositions is unconfirmed; fallback: receptive only)
 * is still OPEN. `statt` is the Genitiv preposition here; `statt … zu` (Unit 23) stays receptive and is not taught. The unit is language learning with fictional
 * shops and sums: it makes no statement of consumer law and gives no legal advice.
 */
export const UNIT_27_META: B1UnitMeta = {
  unit: 27,
  canDo: [
    {
      de: 'Ich kann Wünsche und hypothetische Situationen ausdrücken und höflich um etwas bitten.',
      ru: 'Я могу выражать желания и гипотетические ситуации и вежливо о чём-то просить.',
      ky: 'Мен каалоолорду жана гипотетикалык абалдарды билдирип, бир нерсени сылык өтүнө алам.',
    },
    {
      de: 'Ich kann reklamieren, eine Lösung aushandeln und einfache Bank- und Vertragsangelegenheiten klären.',
      ru: 'Я могу подать рекламацию, договориться о решении и прояснить простые вопросы банка и договора.',
      ky: 'Мен даттануу берип, чечим боюнча макулдашып, банк жана келишим боюнча жөнөкөй маселелерди тактай алам.',
    },
    {
      de: 'Ich kann Gründe mit wegen, trotz, während und statt nennen.',
      ru: 'Я могу называть причины с помощью wegen, trotz, während и statt.',
      ky: 'Мен wegen, trotz, während жана statt менен себептерди атай алам.',
    },
  ],
  objectives: {
    lesen: {
      de: 'Ich kann in einer Kundenbewertung und in einem Beschwerdebrief Problem, Wunsch und Lösung erkennen.',
      ru: 'Я могу найти в отзыве клиента и в письме с жалобой проблему, пожелание и решение.',
      ky: 'Мен кардардын пикиринен жана даттануу катынан көйгөйдү, каалоону жана чечимди таба алам.',
    },
    hoeren: {
      de: 'Ich kann einen Anruf beim Kundenservice und bei der Bank in den wichtigen Punkten verstehen, besonders Zahlen, Fristen und die Reaktion der Gegenseite.',
      ru: 'Я могу понять главное в разговоре со службой поддержки и с банком, особенно числа, сроки и реакцию собеседника.',
      ky: 'Мен тейлөө кызматы жана банк менен сүйлөшүүдө негизги нерселерди, айрыкча сандарды, мөөнөттөрдү жана каршы тараптын жообун түшүнө алам.',
    },
    sprechen: {
      de: 'Ich kann reklamieren, höflich nachhaken und eine Lösung aushandeln, auch wenn die Gegenseite zuerst ablehnt.',
      ru: 'Я могу подать рекламацию, вежливо настаивать и договориться о решении, даже если собеседник сначала отказывает.',
      ky: 'Мен даттануу берип, сылык кайталап сурап, каршы тарап адегенде баш тартса да чечим боюнча макулдаша алам.',
    },
    schreiben: {
      de: 'Ich kann eine formelle Reklamation mit Konjunktiv II und einer Genitiv-Präposition schreiben.',
      ru: 'Я могу написать формальную рекламацию с Konjunktiv II и предлогом с Genitiv.',
      ky: 'Мен Konjunktiv II жана Genitiv менен предлогу бар расмий даттануу жаза алам.',
    },
  },
  differenceFromA2: {
    de: 'A2 kauft ein und nennt Mengen; B1 spricht über Rechte, Geld und Beschwerden: Es beschreibt Probleme, bittet höflich und handelt Lösungen aus.',
    ru: 'В A2 вы делали покупки и называли количества; в B1 вы говорите о правах, деньгах и жалобах: описываете проблемы, вежливо просите и договариваетесь о решениях.',
    ky: 'A2 деңгээлинде сиз сатып алуу жасадыңыз жана өлчөмдөрдү атадыңыз; B1 деңгээлинде укуктар, акча жана даттануулар жөнүндө сүйлөйсүз: көйгөйлөрдү сүрөттөйсүз, сылык суранасыз жана чечимдер боюнча макулдашасыз.',
  },
  concepts: [
    { conceptId: 'b1-konjunktiv2-wuensche-irreal', proficiency: 'P', load: 'H', role: 'new' },
    {
      conceptId: 'b1-genitiv-praepositionen',
      proficiency: 'P-lim',
      load: 'M',
      role: 'new',
      // the closed list of four prepositions: the learner is held to these only (decision D-7 is open)
      closedList: ['wegen', 'trotz', 'während', 'statt'],
    },
  ],
  scenario: {
    id: UNIT_27_SPEAKING_ID,
    unexpectedElement: {
      de: 'Die Gegenseite lehnt zuerst ab: „Leider ist das nicht möglich.“ Der Lernende muss höflich nachhaken und eine Lösung suchen.',
      ru: 'Собеседник сначала отказывает: «К сожалению, это невозможно». Нужно вежливо настаивать и искать решение.',
      ky: 'Каршы тарап адегенде баш тартат: «Тилекке каршы, бул мүмкүн эмес». Сылык кайталап сурап, чечим издөө керек.',
    },
  },
  strands: {
    repairChunks: [
      {
        de: 'Könnten Sie das bitte noch einmal prüfen?',
        ru: 'Не могли бы вы проверить это ещё раз?',
        ky: 'Муну дагы бир жолу текшерип бере аласызбы?',
      },
      {
        de: 'Ich verstehe Ihre Regel. Gibt es trotzdem eine Möglichkeit?',
        ru: 'Я понимаю ваше правило. Есть ли всё же какая-то возможность?',
        ky: 'Мен сиздин эрежеңизди түшүнөм. Ошентсе да бир мүмкүнчүлүк барбы?',
      },
      {
        de: 'Habe ich Sie richtig verstanden? Sie erstatten die Hälfte?',
        ru: 'Я правильно вас понял? Вы возмещаете половину?',
        ky: 'Мен сизди туура түшүндүмбү? Сиз жарымын кайтарып бересизби?',
      },
      {
        de: 'Könnten Sie mir das bitte schriftlich bestätigen?',
        ru: 'Не могли бы вы подтвердить мне это письменно?',
        ky: 'Муну мага жазуу жүзүндө ырастап бере аласызбы?',
      },
    ],
    strategyNote: {
      de: 'Höflich nachhaken: Zeige zuerst Verständnis („Ich verstehe …“), dann frage mit Konjunktiv II nach („Könnten Sie …?“) und nenne einen Grund („Wegen …“). So bleibt das Gespräch freundlich, und du kommst zu einer Lösung.',
      ru: 'Вежливо настаивать: сначала покажите понимание («Ich verstehe …»), затем спросите с Konjunktiv II («Könnten Sie …?») и назовите причину («Wegen …»). Так разговор остаётся дружелюбным, и вы придёте к решению.',
      ky: 'Сылык кайталап суроо: адегенде түшүнгөнүңүздү көрсөтүңүз («Ich verstehe …»), анан Konjunktiv II менен сураңыз («Könnten Sie …?») жана себебин атаңыз («Wegen …»). Ошентип сүйлөшүү достук бойдон калат жана чечимге келесиз.',
    },
    wortbildungNote: {
      de: 'Wörter bilden: Verb → Nomen mit -ung (reklamieren → die Reklamation, bestellen → die Bestellung, zahlen → die Zahlung, erstatten → die Erstattung). Person mit -er (verbrauchen → der Verbraucher, handeln → der Händler). Zusammengesetzte Nomen: Mobilfunk + Vertrag = der Mobilfunkvertrag (der Artikel kommt vom letzten Wort). zurück- + Verb: zurückgeben, zurückzahlen.',
      ru: 'Как образуются слова: глагол → существительное с -ung (reklamieren → die Reklamation, bestellen → die Bestellung, zahlen → die Zahlung, erstatten → die Erstattung). Человек с -er (verbrauchen → der Verbraucher, handeln → der Händler). Составные существительные: Mobilfunk + Vertrag = der Mobilfunkvertrag (артикль берётся от последнего слова). zurück- + глагол: zurückgeben, zurückzahlen.',
      ky: 'Сөздөр кантип түзүлөт: этиш → -ung менен зат атооч (reklamieren → die Reklamation, bestellen → die Bestellung, zahlen → die Zahlung, erstatten → die Erstattung). Адам -er менен (verbrauchen → der Verbraucher, handeln → der Händler). Татаал зат атоочтор: Mobilfunk + Vertrag = der Mobilfunkvertrag (артикль акыркы сөздөн алынат). zurück- + этиш: zurückgeben, zurückzahlen.',
    },
  },
  microTasks: [{ kind: 'meinung', taskId: 'b1-wr-27-02' }],
  topics: [
    {
      topic: 'money-banking',
      itemIds: ['v27-10', 'v27-11', 'v27-12', 'v27-13', 'v27-14', 'v27-15', 'v27-17', 'b1-re-27-02', 'b1-li-27-02', UNIT_27_SPEAKING_ID],
    },
  ],
  revision: {
    fromPrevious: ['v26-14', 'v26-11', 'v26-12', 'v26-2'],
    fromThirdBack: ['v24-3', 'v24-5'],
    fromA2: ['v15-30', 'v15-31', 'v19-20'],
  },
}
