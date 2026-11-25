import { describe, expect, it } from 'vitest'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { B1_V2_LESSON_OF_UNIT } from '../../src/data/b1/grammar-v2'
import { B1_CURRICULUM, B1_CURRICULUM_TITLES, B1_LEGACY_UNITS, B1_VISIBLE_UNITS } from '../../src/data/b1/curriculum'
import { allUnits, registerLevelContent, unitById, unitsOfLevel } from '../../src/data/catalog'
import { levelOfUnitId } from '../../src/data/course'
import { isPlaceholderUnit, unitNumber } from '../../src/data/curriculum'
import { SECTIONS } from '../../src/data/units'
import { currentUnit, requiredSections, unitHasContent } from '../../src/features/progress/stats'
import { defaultProgress } from '../../src/storage/defaults'
import { grammarOf } from '../../src/data/catalog'

registerLevelContent('B1', B1_CONTENT)

// the table exactly as supplied (title, grammar topic), in order
const SUPPLIED: [string, string][] = [
  ['Geschichten und Erlebnisse erzählen', 'Präteritum: regelmäßige und unregelmäßige Verben'],
  ['Was vorher passiert war', 'Plusquamperfekt'],
  ['Vergangenheit, Gegenwart und Zukunft', 'Zeitformen im Vergleich'],
  ['Wie wird die Zukunft aussehen?', 'Futur I: Vermutungen und Prognosen'],
  ['Beziehungen und Gespräche', 'Verben mit Präpositionen: Vertiefung'],
  ['Arbeit, Alltag und Entscheidungen', 'Funktionsverbgefüge: Grundlagen'],
  ['Was mache ich vorher und nachher?', 'Temporalsätze mit bevor und nachdem'],
  ['Schwierigkeiten und Herausforderungen', 'Nebensätze mit obwohl'],
  ['Zwei Dinge gleichzeitig', 'Nebensätze mit während'],
  ['Veränderungen im Leben', 'Nebensätze mit seitdem und bis'],
  ['Pläne, Ziele und Möglichkeiten', 'Infinitivkonstruktionen mit zu'],
  ['Ziele erreichen und Wünsche verwirklichen', 'Um … zu und damit'],
  ['Verschiedene Möglichkeiten verbinden', 'Zweiteilige Konnektoren'],
  ['Komplexe Gedanken ausdrücken', 'Erweiterte Satzverbindungen'],
  ['Menschen, denen ich begegne', 'Relativsätze im Dativ'],
  ['Menschen und Dinge, über die ich spreche', 'Relativsätze mit Präpositionen'],
  ['Alles, was mir wichtig ist', 'Relativsätze mit was und wo'],
  ['Wie werden Produkte hergestellt?', 'Passiv Präsens'],
  ['Wie wurde früher gearbeitet?', 'Passiv Präteritum'],
  ['Wie sieht die Welt heute aus?', 'Zustandspassiv'],
  ['Wenn ich die Möglichkeit hätte …', 'Konjunktiv II: Wünsche und irreale Situationen'],
  ['Was würde ich an deiner Stelle tun?', 'Konjunktiv II: Ratschläge und Bedingungen'],
  ['Was andere Menschen gesagt haben', 'Indirekte Rede: Grundlagen'],
  ['Nachrichten und Informationen wiedergeben', 'Konjunktiv I: Einführung'],
  ['Besitz, Herkunft und Zusammenhänge', 'Genitiv und Genitivpräpositionen'],
  ['Menschen, Orte und Dinge genauer beschreiben', 'Adjektivdeklination: Vertiefung'],
  ['Menschen und ihre Eigenschaften', 'N-Deklination: Vertiefung'],
  ['Eigenschaften und Beschreibungen', 'Partizip I und II als Adjektive'],
  ['Informationen richtig strukturieren', 'Wortstellung im Mittelfeld'],
  ['Handlungen und Prozesse als Nomen', 'Nominalisierung: Grundlagen'],
  ['Alltagssprache und formelle Sprache', 'Verbalstil und Nominalstil: Einführung'],
  ['Gegensätze und unerwartete Situationen', 'Konzessive Konnektoren'],
  ['Ursachen und Konsequenzen', 'Konsekutive Konnektoren'],
  ['Ziele und Absichten', 'Finale Konnektoren'],
  ['Gesellschaft, Umwelt und Veränderungen', 'Präpositionen mit Genitiv'],
  ['Worauf kommt es an?', 'Präpositionaladverbien: Vertiefung'],
]

describe('B1 curriculum v2: 36 units × 9 sections (structure only)', () => {
  it('exactly 36 new units, in the supplied order, with the exact titles', () => {
    expect(B1_VISIBLE_UNITS).toHaveLength(36)
    expect(B1_VISIBLE_UNITS.map(u => u.title)).toEqual(SUPPLIED.map(r => r[0]))
    expect([...B1_CURRICULUM_TITLES]).toEqual(SUPPLIED.map(r => r[0]))
    expect(unitsOfLevel('B1')).toBe(B1_VISIBLE_UNITS)
    expect(new Set(B1_VISIBLE_UNITS.map(u => u.title)).size).toBe(36)
  })
  it('numbered 1–36 with ids 301–336 (300 + position); all unique and free of every existing id', () => {
    expect(B1_VISIBLE_UNITS.map(unitNumber)).toEqual(Array.from({ length: 36 }, (_, i) => i + 1))
    expect(B1_VISIBLE_UNITS.map(u => u.id)).toEqual(Array.from({ length: 36 }, (_, i) => 301 + i))
    const ids = allUnits.map(u => u.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const u of B1_VISIBLE_UNITS) expect(levelOfUnitId(u.id)).toBe('B1')
    expect(levelOfUnitId(337)).toBeUndefined()
    // no collision with the other levels' ranges (A1 102–138, A2 201–243, B1 legacy 21–32)
    for (const u of allUnits.filter(u => u.level !== 'B1')) expect(u.id < 301 || u.id > 336).toBe(true)
  })
  it('each unit carries its approved grammar topic as metadata; its Grammar lesson (if written) is the one lesson of that unit', () => {
    B1_VISIBLE_UNITS.forEach((u, i) => {
      expect(u.grammarTopic).toBe(SUPPLIED[i][1])
      expect(u.grammarIds).toEqual(B1_V2_LESSON_OF_UNIT[i + 1] ? [B1_V2_LESSON_OF_UNIT[i + 1]] : [])
      expect(u.grammarPartial).toBeUndefined()
    })
    expect(B1_CURRICULUM.map(r => r.grammarTopic)).toEqual(SUPPLIED.map(r => r[1]))
  })
  it('9 standard sections with Merksätze after Grammar; the first thirty-six units also have vocabulary and review content', () => {
    expect(SECTIONS).toEqual(['vocabulary', 'grammar', 'merksaetze', 'listening', 'reading', 'speaking', 'writing', 'review', 'test'])
    expect(SECTIONS.indexOf('merksaetze')).toBe(2)
    expect(B1_VISIBLE_UNITS).toHaveLength(36)
    expect(B1_VISIBLE_UNITS.length * SECTIONS.length).toBe(324)
    for (const u of B1_VISIBLE_UNITS) {
      expect(isPlaceholderUnit(u)).toBe(true)
      const hasVocabulary = u.id >= 301 && u.id <= 336
      expect(requiredSections(u.id)).toEqual([
        ...(hasVocabulary ? ['vocabulary'] : []),
        ...(u.grammarIds.length ? ['grammar'] : []),
        'merksaetze',
        'reading',
        ...(hasVocabulary ? ['review'] : []),
      ])
      expect(unitHasContent(u.id)).toBe(true)
    }
  })
  it('curriculum units with authored content can be selected without changing stored progress', () => {
    const p = defaultProgress()
    expect(currentUnit(p, 'B1')?.id).toBe(301)
    expect(p.completed).toEqual([])
  })
  it('the twelve authored units 21–32 are hidden legacy, untouched and still addressable by id', () => {
    expect(B1_LEGACY_UNITS.map(u => u.id)).toEqual([21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32])
    expect(B1_LEGACY_UNITS).toEqual(B1_CONTENT.legacyUnits)
    for (const u of B1_LEGACY_UNITS) {
      expect(unitsOfLevel('B1')).not.toContain(u)
      expect(unitById(u.id)).toBe(u)
      expect(unitHasContent(u.id)).toBe(true)
    }
    // no automatic mapping: the legacy lessons are not referenced by any new unit and none was added or removed
    expect(grammarOf('B1')).toHaveLength(B1_CONTENT.grammar.length)
    expect(B1_CONTENT.grammar.filter(g => g.unit < 100)).toHaveLength(29) // the 29 legacy lessons, unchanged
    expect(B1_CONTENT.grammar.filter(g => g.unit >= 301)).toHaveLength(Object.keys(B1_V2_LESSON_OF_UNIT).length)
    for (const u of B1_VISIBLE_UNITS) for (const id of u.grammarIds) expect(B1_LEGACY_UNITS.some(l => l.grammarIds.includes(id))).toBe(false) // never a legacy lesson
  })
})
