import type { LearningUnit } from './types'
import { buildCurriculum, unitNumber } from './curriculum'
import { UNITS } from './units'

/**
 * A1 curriculum v2: exactly 38 units, in this order, each with the 8 standard sections (`SECTIONS` in ./units).
 * A unit whose German title equals an existing unit's title REUSES that unit (same id, content, progress keys); every other title becomes
 * an empty unit with id 100 + its position. Similar-but-different titles are never merged. The legacy `UNITS` module is untouched.
 */
export const A1_CURRICULUM_TITLES: readonly string[] = [
  'Hallo & Ich', 'Wer bin ich?', 'Mein Tagesablauf', 'Familie und Freunde', 'Ich stelle mich vor', 'Mein Leben in Deutschland',
  'Neue Bekanntschaften', 'Fragen über mich', 'Was machst du gern?', 'Dinge und Gegenstände', 'In meinem Zimmer', 'Was ist das?',
  'Frühstück und Mahlzeiten', 'Meine Haustiere und Tiere', 'Zusammengesetzte Wörter im Alltag', 'Meine Familie und meine Sachen',
  'Fragen beim Einkaufen', 'Menschen und Dinge beschreiben', 'Was mache ich nicht?', 'Was habe ich nicht?', 'Wer oder was?',
  'Was kaufe und esse ich?', 'Meine täglichen Aktivitäten', 'Wem gehört das?', 'Geschenke für Freunde', 'Freunde und Geschenke',
  'Was kann und muss ich?', 'Meine Wünsche und Möglichkeiten', 'Mein Morgen und mein Alltag', 'Im Restaurant und zu Hause',
  'Meine Freizeit und Hobbys', 'Uhrzeit, Tage und Termine', 'Wohin gehe ich?', 'Wo bin ich?', 'Meine Wohnung und Möbel',
  'Früher und heute', 'Was habe ich gemacht?', 'Unterwegs in der Stadt',
]

/**
 * The approved grammar topic of each new A1 unit (same order as the titles). `concept` is the id of an EXISTING legacy A1 grammar lesson that
 * is a confirmed (exact or clearly equivalent) match; it is attached to the unit by reference. No `concept` = no existing lesson (or only a partial
 * match awaiting manual review) = the Grammar section stays empty. See docs/BILUP_A1_GRAMMAR_MAPPING_REPORT.md.
 */
export const A1_GRAMMAR_TOPICS: readonly { topic: string; concept?: string; /** the existing lesson covers the topic only in part: what it does cover */ partial?: string }[] = [
  { topic: 'Alphabet und Aussprache' },
  { topic: 'Personalpronomen im Nominativ' },
  { topic: 'Konjugation im Präsens', concept: 'regular-verbs' },
  { topic: 'Sein und haben', concept: 'sein-haben' },
  { topic: 'Aussagesätze' },
  { topic: 'Satzstellung: Verbposition 2', concept: 'verb-position' },
  { topic: 'Ja-/Nein-Fragen' },
  { topic: 'W-Fragen' },
  { topic: 'Verben mit Vokalwechsel' },
  { topic: 'Genus der Nomen', concept: 'articles' },
  { topic: 'Bestimmte Artikel' },
  { topic: 'Unbestimmte Artikel' },
  { topic: 'Nullartikel' },
  { topic: 'Plural der Nomen', concept: 'plural' },
  { topic: 'Komposita' },
  { topic: 'Possessivartikel', concept: 'possessive' },
  { topic: 'Interrogativartikel' },
  { topic: 'Demonstrativartikel' },
  { topic: 'Negation mit nicht' },
  { topic: 'Negation mit kein' },
  { topic: 'Nominativ', concept: 'nominativ' },
  { topic: 'Akkusativ', concept: 'akkusativ' },
  { topic: 'Personalpronomen im Akkusativ' },
  { topic: 'Dativ', concept: 'dativ' },
  { topic: 'Personalpronomen im Dativ' },
  { topic: 'Personalpronomen im Akkusativ und Dativ' },
  // PARTIAL (approved): the existing lesson teaches möchte, kann, muss — not wollen, not dürfen
  { topic: 'Modalverben: können, müssen, wollen, dürfen', concept: 'modal', partial: 'möchte, kann, muss' },
  { topic: 'Gebrauch der Modalverben' },
  { topic: 'Trennbare Verben', concept: 'separable' },
  { topic: 'Imperativ' },
  { topic: 'Hauptsätze verbinden: und, aber, oder, denn' },
  { topic: 'Temporale Präpositionen', concept: 'time-order' },
  { topic: 'Präpositionen mit Akkusativ', concept: 'akk-prep' },
  { topic: 'Präpositionen mit Dativ', concept: 'dativ-prep' },
  { topic: 'Wechselpräpositionen: Wo?', concept: 'wechsel' },
  { topic: 'Präteritum: sein und haben' },
  { topic: 'Perfekt mit haben und sein', concept: 'perfekt' },
  { topic: 'Zusammengesetzte Verben' },
]

const grammarByTitle = Object.fromEntries(
  A1_CURRICULUM_TITLES.flatMap((title, i) => {
    const c = A1_GRAMMAR_TOPICS[i]?.concept
    return c ? [[title, [c]] as const] : []
  }),
)
const partialByTitle = Object.fromEntries(
  A1_CURRICULUM_TITLES.flatMap((title, i) => {
    const t = A1_GRAMMAR_TOPICS[i]
    return t?.concept && t.partial ? [[title, { [t.concept]: t.partial }] as const] : []
  }),
)
const built = buildCurriculum('A1', A1_CURRICULUM_TITLES, UNITS, 100, grammarByTitle, partialByTitle)

/** The 38 units a learner sees in A1, in curriculum order. */
export const A1_UNITS: LearningUnit[] = built.units

/** Pre-v2 A1 units that match no new title: kept untouched (content, ids, progress keys) and addressable by id, but not listed. */
export const A1_LEGACY_UNITS: LearningUnit[] = built.legacyUnits

export { unitNumber }
