import { buildCurriculum } from '../curriculum'
import { B1_V2_LESSON_OF_UNIT } from './grammar-v2'
import { UNIT_21 } from './unit21/unit'
import { UNIT_22 } from './unit22/unit'
import { UNIT_23 } from './unit23/unit'
import { UNIT_24 } from './unit24/unit'
import { UNIT_25 } from './unit25/unit'
import { UNIT_26 } from './unit26/unit'
import { UNIT_27 } from './unit27/unit'
import { UNIT_28 } from './unit28/unit'
import { UNIT_29 } from './unit29/unit'
import { UNIT_30 } from './unit30/unit'
import { UNIT_31 } from './unit31/unit'
import { UNIT_32 } from './unit32/unit'

/**
 * B1 curriculum v2: exactly 36 units, in this order, each with the 8 standard sections (built by the same `buildCurriculum` as A1 and A2).
 * STRUCTURE ONLY: no existing B1 title matches, so all 36 are empty containers (ids 300 + position = 301–336) and the twelve authored units 21–32 are kept
 * as hidden legacy content (untouched, addressable by id). Nothing is mapped or migrated here. Lives in the lazy B1 chunk because it needs the legacy units.
 */
export const B1_CURRICULUM: readonly { title: string; grammarTopic: string }[] = [
  { title: 'Geschichten und Erlebnisse erzählen', grammarTopic: 'Präteritum: regelmäßige und unregelmäßige Verben' },
  { title: 'Was vorher passiert war', grammarTopic: 'Plusquamperfekt' },
  { title: 'Vergangenheit, Gegenwart und Zukunft', grammarTopic: 'Zeitformen im Vergleich' },
  { title: 'Wie wird die Zukunft aussehen?', grammarTopic: 'Futur I: Vermutungen und Prognosen' },
  { title: 'Beziehungen und Gespräche', grammarTopic: 'Verben mit Präpositionen: Vertiefung' },
  { title: 'Arbeit, Alltag und Entscheidungen', grammarTopic: 'Funktionsverbgefüge: Grundlagen' },
  { title: 'Was mache ich vorher und nachher?', grammarTopic: 'Temporalsätze mit bevor und nachdem' },
  { title: 'Schwierigkeiten und Herausforderungen', grammarTopic: 'Nebensätze mit obwohl' },
  { title: 'Zwei Dinge gleichzeitig', grammarTopic: 'Nebensätze mit während' },
  { title: 'Veränderungen im Leben', grammarTopic: 'Nebensätze mit seitdem und bis' },
  { title: 'Pläne, Ziele und Möglichkeiten', grammarTopic: 'Infinitivkonstruktionen mit zu' },
  { title: 'Ziele erreichen und Wünsche verwirklichen', grammarTopic: 'Um … zu und damit' },
  { title: 'Verschiedene Möglichkeiten verbinden', grammarTopic: 'Zweiteilige Konnektoren' },
  { title: 'Komplexe Gedanken ausdrücken', grammarTopic: 'Erweiterte Satzverbindungen' },
  { title: 'Menschen, denen ich begegne', grammarTopic: 'Relativsätze im Dativ' },
  { title: 'Menschen und Dinge, über die ich spreche', grammarTopic: 'Relativsätze mit Präpositionen' },
  { title: 'Alles, was mir wichtig ist', grammarTopic: 'Relativsätze mit was und wo' },
  { title: 'Wie werden Produkte hergestellt?', grammarTopic: 'Passiv Präsens' },
  { title: 'Wie wurde früher gearbeitet?', grammarTopic: 'Passiv Präteritum' },
  { title: 'Wie sieht die Welt heute aus?', grammarTopic: 'Zustandspassiv' },
  { title: 'Wenn ich die Möglichkeit hätte …', grammarTopic: 'Konjunktiv II: Wünsche und irreale Situationen' },
  { title: 'Was würde ich an deiner Stelle tun?', grammarTopic: 'Konjunktiv II: Ratschläge und Bedingungen' },
  { title: 'Was andere Menschen gesagt haben', grammarTopic: 'Indirekte Rede: Grundlagen' },
  { title: 'Nachrichten und Informationen wiedergeben', grammarTopic: 'Konjunktiv I: Einführung' },
  { title: 'Besitz, Herkunft und Zusammenhänge', grammarTopic: 'Genitiv und Genitivpräpositionen' },
  { title: 'Menschen, Orte und Dinge genauer beschreiben', grammarTopic: 'Adjektivdeklination: Vertiefung' },
  { title: 'Menschen und ihre Eigenschaften', grammarTopic: 'N-Deklination: Vertiefung' },
  { title: 'Eigenschaften und Beschreibungen', grammarTopic: 'Partizip I und II als Adjektive' },
  { title: 'Informationen richtig strukturieren', grammarTopic: 'Wortstellung im Mittelfeld' },
  { title: 'Handlungen und Prozesse als Nomen', grammarTopic: 'Nominalisierung: Grundlagen' },
  { title: 'Alltagssprache und formelle Sprache', grammarTopic: 'Verbalstil und Nominalstil: Einführung' },
  { title: 'Gegensätze und unerwartete Situationen', grammarTopic: 'Konzessive Konnektoren' },
  { title: 'Ursachen und Konsequenzen', grammarTopic: 'Konsekutive Konnektoren' },
  { title: 'Ziele und Absichten', grammarTopic: 'Finale Konnektoren' },
  { title: 'Gesellschaft, Umwelt und Veränderungen', grammarTopic: 'Präpositionen mit Genitiv' },
  { title: 'Worauf kommt es an?', grammarTopic: 'Präpositionaladverbien: Vertiefung' },
]

/** The twelve pre-v2 B1 units (ids 21–32), exactly as before. */
export const B1_LEGACY_SOURCE = [UNIT_21, UNIT_22, UNIT_23, UNIT_24, UNIT_25, UNIT_26, UNIT_27, UNIT_28, UNIT_29, UNIT_30, UNIT_31, UNIT_32]

export const B1_CURRICULUM_TITLES: readonly string[] = B1_CURRICULUM.map(u => u.title)

// every new unit references its own grammar lesson (authored for curriculum v2, one per unit); the other seven sections stay empty
const grammarByTitle = Object.fromEntries(
  B1_CURRICULUM_TITLES.flatMap((title, i) => (B1_V2_LESSON_OF_UNIT[i + 1] ? [[title, [B1_V2_LESSON_OF_UNIT[i + 1]]] as const] : [])),
)
const built = buildCurriculum(
  'B1',
  B1_CURRICULUM_TITLES,
  B1_LEGACY_SOURCE,
  300,
  grammarByTitle,
  {},
  Object.fromEntries(B1_CURRICULUM.map(u => [u.title, u.grammarTopic])),
)
/** The 36 units a learner sees in B1. */
export const B1_VISIBLE_UNITS = built.units
/** The twelve pre-v2 B1 units: hidden, untouched, addressable by id. */
export const B1_LEGACY_UNITS = built.legacyUnits
