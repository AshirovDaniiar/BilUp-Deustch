import { buildCurriculum } from '../curriculum'
import { A2_UNITS } from './units'

/**
 * A2 curriculum v2: exactly 43 units, in this order, each with the 8 standard sections (built by the same `buildCurriculum` as A1).
 * No existing A2 unit has one of these titles, so all 43 are empty containers (ids 200 + position) and the ten authored units
 * 11–20 are kept as hidden legacy content. Lives in the lazy A2 chunk because it needs the legacy units.
 */
export const A2_CURRICULUM_TITLES: readonly string[] = [
  'Mein letztes Jahr', 'Besondere Erlebnisse und Erinnerungen', 'Als ich ein Kind war', 'Meine tägliche Routine', 'Körperpflege und Gesundheit',
  'Menschen helfen und begegnen', 'Geschenke und Überraschungen', 'Worüber sprechen wir?', 'Meine Zukunftspläne', 'Geschichten und Erlebnisse erzählen',
  'Warum ist das so?', 'Was ich denke und glaube', 'Was mache ich, wenn …?', 'Besondere Momente im Leben', 'Höflich nachfragen',
  'Wünsche und persönliche Ziele', 'Gründe und Folgen', 'Menschen beschreiben', 'Neue Menschen kennenlernen', 'Eigenschaften und Charakter',
  'Familie und Besitz', 'Menschen und Berufe', 'Beziehungen und Kommunikation', 'Jeder, niemand und etwas', 'Menschen, die ich kenne',
  'Dinge, die ich brauche', 'Stadt oder Land?', 'Das Beste in meinem Leben', 'Früher und heute im Vergleich', 'Gute und schlechte Eigenschaften',
  'Mein Alltag und meine Umgebung', 'Meine Wohnung und mein Wohnort', 'Gespräche und Reaktionen', 'Die Umgebung und ihre Besonderheiten',
  'Schwierigkeiten im Alltag', 'Entscheidungen und Konsequenzen', 'Was macht meine Stadt besonders?', 'Entscheidungen treffen',
  'Zwei Möglichkeiten verbinden', 'Was ist mir wichtig?', 'Im Hotel und im Restaurant', 'Wenn ich mehr Zeit hätte …', 'Ratschläge und Anweisungen',
]

/**
 * The approved grammar topic of each new A2 unit (same order as the titles). `concept` is the id of an EXISTING legacy A2 grammar lesson that is a confirmed
 * (exact or clearly equivalent) match; it is attached to the unit by reference, once. No `concept` = no suitable lesson, only a partial match awaiting a decision, or only a
 * B1 / other-level lesson (never imported) = the Grammar section stays empty. See docs/BILUP_A2_GRAMMAR_MAPPING_REPORT.md.
 */
export const A2_GRAMMAR_TOPICS: readonly { topic: string; concept?: string }[] = [
  { topic: 'Perfekt: Vertiefung', concept: 'a2-perfekt-erfahrungen' },
  { topic: 'Partizip II: regelmäßige und unregelmäßige Verben' },
  { topic: 'Präteritum: Modalverben und häufige Verben' },
  { topic: 'Reflexive Verben', concept: 'a2-reflexive-verben' },
  { topic: 'Reflexivpronomen' },
  { topic: 'Verben mit Dativ' },
  { topic: 'Verben mit Akkusativ und Dativ' },
  { topic: 'Verben mit Präpositionen', concept: 'a2-verben-mit-praepositionen' },
  { topic: 'Futur I' },
  { topic: 'Satzstellung im Hauptsatz: Vertiefung' },
  { topic: 'Nebensätze mit weil' },
  { topic: 'Nebensätze mit dass' },
  { topic: 'Nebensätze mit wenn', concept: 'a2-wenn-saetze' },
  { topic: 'Temporalsätze mit als und wenn', concept: 'a2-wenn-als' },
  { topic: 'Indirekte Fragen', concept: 'a2-indirekte-fragen' },
  { topic: 'Infinitiv mit zu' },
  { topic: 'Satzverbindungen mit deshalb und deswegen', concept: 'a2-deshalb-darum' },
  { topic: 'Adjektivdeklination mit bestimmtem Artikel', concept: 'a2-adjektivendungen-definit' },
  { topic: 'Adjektivdeklination mit unbestimmtem Artikel', concept: 'a2-adjektivendungen-indefinit' },
  { topic: 'Adjektivdeklination ohne Artikel' },
  { topic: 'Genitiv: Grundlagen' },
  { topic: 'N-Deklination' },
  { topic: 'Personalpronomen im Akkusativ und Dativ: Vertiefung', concept: 'a2-personalpronomen-dativverben' },
  { topic: 'Indefinitpronomen' },
  { topic: 'Relativpronomen im Nominativ' },
  { topic: 'Relativpronomen im Akkusativ' },
  { topic: 'Komparativ', concept: 'a2-komparativ-superlativ' },
  { topic: 'Superlativ' },
  { topic: 'Vergleichssätze mit als und wie' },
  { topic: 'Adjektive als Nomen' },
  { topic: 'Adverbien der Zeit, des Ortes und der Art und Weise' },
  { topic: 'Wechselpräpositionen: Wo und Wohin?', concept: 'a2-positionsverben' },
  { topic: 'Pronominaladverbien: darauf, darüber, damit' },
  { topic: 'Präpositionen mit Genitiv: erste Einführung' },
  { topic: 'Konnektor: trotzdem' },
  { topic: 'Konnektor: deshalb und deswegen' },
  { topic: 'Konnektor: außerdem' },
  { topic: 'Konnektoren: entweder … oder' },
  { topic: 'Konnektoren: sowohl … als auch' },
  { topic: 'Konnektoren: nicht nur … sondern auch' },
  { topic: 'Konjunktiv II: höfliche Bitten' },
  { topic: 'Konjunktiv II: Wünsche' },
  { topic: 'Imperativ: Vertiefung', concept: 'a2-imperativ' },
]

const grammarByTitle = Object.fromEntries(
  A2_CURRICULUM_TITLES.flatMap((title, i) => {
    const c = A2_GRAMMAR_TOPICS[i]?.concept
    return c ? [[title, [c]] as const] : []
  }),
)

const built = buildCurriculum('A2', A2_CURRICULUM_TITLES, A2_UNITS, 200, grammarByTitle)
/** The 43 units a learner sees in A2. */
export const A2_VISIBLE_UNITS = built.units
/** The ten pre-v2 A2 units: hidden, untouched, addressable by id. */
export const A2_LEGACY_UNITS = built.legacyUnits
