import type { B1UnitMeta } from '../meta-types'
import { UNIT_22_SPEAKING_ID } from './unit'

/**
 * Unit 22 metadata: learning objectives (German + independent Russian and Kyrgyz), the productive / receptive classification of the three approved
 * concepts, strands, comparison phrases and the spaced-revision set. The Russian and Kyrgyz texts are AI-assisted first drafts that no reviewer has
 * checked. The classification is the approved product-design default; it is NOT confirmed by an independent CEFR expert (Unit 22 carries no ⚑ decision).
 * `einerseits … andererseits` and `nicht nur … sondern auch` are declared RECEPTIVE: they are glossed in a reading and never required in a task or a test.
 */
export const UNIT_22_META: B1UnitMeta = {
  unit: 22,
  canDo: [
    {
      de: 'Ich kann meine Meinung äußern, begründen und höflich zustimmen oder widersprechen.',
      ru: 'Я могу высказать своё мнение, обосновать его, вежливо согласиться или возразить.',
      ky: 'Мен өз пикиримди айтып, аны негиздеп, сылык түрдө макул боло же каршы чыга алам.',
    },
    {
      de: 'Ich kann zwei Dinge vergleichen und ein Gegenargument anerkennen.',
      ru: 'Я могу сравнить две вещи и признать встречный довод.',
      ky: 'Мен эки нерсени салыштырып, каршы далилди моюнга ала алам.',
    },
    {
      de: 'Ich kann an einer einfachen Diskussion über ein bekanntes Thema teilnehmen.',
      ru: 'Я могу участвовать в простом обсуждении на знакомую тему.',
      ky: 'Мен таанаш тема боюнча жөнөкөй талкууга катыша алам.',
    },
  ],
  objectives: {
    lesen: {
      de: 'Ich kann in einem Forumsbeitrag oder Leserbrief die Meinung, die Gründe und die Gegenargumente erkennen.',
      ru: 'Я могу найти в сообщении на форуме или в письме читателя мнение, причины и встречные доводы.',
      ky: 'Мен форумдагы билдирүүдөн же окурмандын катынан пикирди, себептерди жана каршы далилдерди таба алам.',
    },
    hoeren: {
      de: 'Ich kann in einem Gespräch erkennen, wer zustimmt und wer widerspricht, und welche Gründe genannt werden.',
      ru: 'Я могу понять в разговоре, кто соглашается, кто возражает и какие приводятся причины.',
      ky: 'Мен маектен ким макул болуп, ким каршы чыккандыгын жана кандай себептер айтылганын түшүнө алам.',
    },
    sprechen: {
      de: 'Ich kann in einer Diskussion meine Meinung sagen, auf einen Einwand reagieren und eine Lösung vorschlagen.',
      ru: 'Я могу в обсуждении высказать мнение, отреагировать на возражение и предложить решение.',
      ky: 'Мен талкууда пикир айтып, каршы пикирге жооп берип, чечим сунуштай алам.',
    },
    schreiben: {
      de: 'Ich kann einen kurzen Forumsbeitrag mit Meinung, Grund, Zugeständnis und Tipp schreiben.',
      ru: 'Я могу написать короткий пост для форума с мнением, причиной, уступкой и советом.',
      ky: 'Мен пикир, себеп, макул болуу жана кеңеш камтыган форумга кыска пост жаза алам.',
    },
  },
  differenceFromA2: {
    de: 'A2 äußert Vorlieben und macht Vorschläge; B1 wägt ab: Es gibt einen Grund, ein Gegenargument und trotzdem eine klare Position.',
    ru: 'В A2 вы говорили о том, что вам нравится, и делали предложения; в B1 вы взвешиваете: приводите причину, признаёте встречный довод и всё же сохраняете позицию.',
    ky: 'A2 деңгээлинде сиз эмне жакканын айтып, сунуштарды бердиңиз; B1 деңгээлинде таразалайсыз: себеп келтирип, каршы далилди моюнга алып, бирок өз позицияңызды сактайсыз.',
  },
  concepts: [
    { conceptId: 'b1-konzessive-saetze', proficiency: 'P', load: 'M', role: 'new' },
    {
      conceptId: 'b1-doppelkonnektoren',
      proficiency: 'P',
      load: 'M',
      role: 'new',
      // productive: je … desto, weder … noch, entweder … oder, sowohl … als auch; RECEPTIVE: the two below (glossed in a reading, never required)
      constructions: [
        { label: 'einerseits … andererseits', proficiency: 'R', forms: ['einerseits', 'andererseits'] },
        { label: 'nicht nur … sondern auch', proficiency: 'R', forms: ['nicht nur', 'sondern auch'] },
      ],
    },
    { conceptId: 'b1-adjektive-dativ-genitiv', proficiency: 'P', load: 'L', role: 'new' },
  ],
  scenario: {
    id: UNIT_22_SPEAKING_ID,
    unexpectedElement: {
      de: 'Der Gesprächspartner widerspricht zuerst mit einem Gegenargument.',
      ru: 'Собеседник сначала возражает и приводит встречный довод.',
      ky: 'Маектеш адегенде каршы далил келтирип каршы чыгат.',
    },
  },
  strands: {
    repairChunks: [
      { de: 'Das habe ich nicht verstanden.', ru: 'Я этого не понял.', ky: 'Мен муну түшүнгөн жокмун.' },
      { de: 'Meinst du …?', ru: 'Ты имеешь в виду …?', ky: 'Сен … деп айтып жатасыңбы?' },
      { de: 'Kannst du das genauer erklären?', ru: 'Можешь объяснить это подробнее?', ky: 'Муну так түшүндүрүп бере аласыңбы?' },
      { de: 'Lass mich bitte ausreden.', ru: 'Дай мне, пожалуйста, договорить.', ky: 'Сураныч, сөзүмдү бүтүрүп алайын.' },
    ],
    strategyNote: {
      de: 'Suche beim Lesen zuerst die Meinung und den Grund. Signalwörter wie zwar, aber, obwohl und trotzdem zeigen ein Gegenargument.',
      ru: 'При чтении сначала найдите мнение и причину. Слова-сигналы zwar, aber, obwohl и trotzdem указывают на встречный довод.',
      ky: 'Окуп жатканда адегенде пикирди жана себепти табыңыз. zwar, aber, obwohl жана trotzdem сыяктуу белги сөздөр каршы далилди көрсөтөт.',
    },
    comparisonPhrases: ['im Vergleich zu', 'im Gegensatz zu', 'dagegen'],
  },
  revision: {
    fromPrevious: ['v21-12', 'v21-14', 'v21-15', 'v21-36'],
    fromThirdBack: ['v19-6', 'v19-7'],
    fromA2: ['v20-18', 'v20-21'],
  },
}
