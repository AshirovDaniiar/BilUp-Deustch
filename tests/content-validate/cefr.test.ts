// @vitest-environment node
/**
 * Stage 6A — CEFR rules. What is checked reliably (declared level vs the unit that holds the item) fails; what can only be
 * estimated (B1+ constructions, text and sentence length) is a REVIEW FLAG, never a pass; and a human sign-off is required.
 */
import { describe, expect, it } from 'vitest'
import { B1_PLUS_PATTERNS, LISTENING_WORDS_MAX, READING_WORDS, SENTENCE_WORDS_MAX } from '../../scripts/content-validate/rules/cefr'
import type { ContentBundle, Issue } from '../../scripts/content-validate/types'
import { validateContent } from '../../scripts/content-validate/validate'
import type { LanguageLevel } from '../../src/data/types'
import { emptyA2Bundle, validA2Bundle } from './fixtures'

const run = (b: ContentBundle, mode: 'authoring' | 'release' = 'authoring'): Issue[] => validateContent(b, { mode })
const rules = (b: ContentBundle, sev: Issue['severity']) =>
  run(b)
    .filter(i => i.severity === sev)
    .map(i => i.rule)

const withReading = (text: string[]) => {
  const b = validA2Bundle()
  b.reading.find(r => r.id === 'a2-re-11-01')!.body = text
  return b
}
/** the fixture's two paragraphs plus an extra sentence */
const BASE = [
  'Ich wohne in einer kleinen Stadt. Meine Wohnung hat zwei Zimmer und einen Balkon. Am Morgen trinke ich Kaffee und lese die Zeitung.',
  'Danach gehe ich zur Arbeit. Ich arbeite in einem Büro im Zentrum. Abends koche ich gern und sehe fern. Am Wochenende besuche ich meine Familie.',
]

describe('RELIABLE: the declared level must agree with the unit that holds the item (errors)', () => {
  const tagged: [string, (b: ContentBundle, level: LanguageLevel) => void][] = [
    ['grammar', (b, l) => (b.grammar.find(g => g.id === 'a2-concept-one')!.level = l)],
    ['listening', (b, l) => (b.listening.find(x => x.id === 'a2-li-11-01')!.level = l)],
    ['reading', (b, l) => (b.reading.find(x => x.id === 'a2-re-11-01')!.level = l)],
    ['writing', (b, l) => (b.writing.find(x => x.id === 'a2-wr-11-01')!.level = l)],
    ['speaking', (b, l) => (b.speaking.find(x => x.id === 'a2-sp-11-01')!.level = l)],
  ]
  it.each(tagged)('%s: tagged B1/B2/C1 inside an A2 unit is rejected as too advanced', (_n, set) => {
    for (const level of ['B1', 'B2', 'C1'] as const) {
      const b = validA2Bundle()
      set(b, level)
      expect(rules(b, 'error'), level).toContain('cefr-too-advanced-tag')
    }
  })

  it.each(tagged)('%s: tagged A1 inside an A2 unit is rejected as a level mismatch', (_n, set) => {
    const b = validA2Bundle()
    set(b, 'A1')
    expect(rules(b, 'error')).toContain('cefr-level-mismatch')
  })

  it('a unit that lies in the A2 id range but declares another level is rejected', () => {
    const b = validA2Bundle()
    b.units.find(u => u.id === 11)!.level = 'B1'
    expect(rules(b, 'error')).toContain('cefr-unit-level')
  })

  it('the tag is not trusted: correctly tagged A2 text with a B1 construction is still flagged for review', () => {
    const b = withReading([...BASE, 'Ich bleibe zu Hause, obwohl ich gesund bin.'])
    expect(rules(b, 'error')).toEqual([])
    expect(rules(b, 'review')).toContain('cefr-structure-konj-b1')
  })
})

describe('HEURISTIC: signals that raise REVIEW flags (never errors, never a pass)', () => {
  const sentences: [string, string, string][] = [
    ['passiv', 'Das Haus wird gebaut.', 'Passiv'],
    ['konj-b1', 'Ich bleibe zu Hause, obwohl ich gesund bin.', 'obwohl'],
    ['konj-b1', 'Ich lerne viel, damit ich eine gute Arbeit finde.', 'damit'],
    ['trotzdem', 'Es regnet, trotzdem gehe ich spazieren.', 'trotzdem'],
    ['relativsatz', 'Das ist der Mann, der hier wohnt.', 'Relativsatz'],
    ['plusquam', 'Er hatte das Buch schon gelesen.', 'Plusquamperfekt'],
    ['konj2-past', 'Ich hätte das Buch gern gelesen.', 'Konjunktiv II der Vergangenheit'],
    ['genitiv', 'Das ist das Auto des Mannes.', 'Genitiv'],
    ['futur2', 'Er wird das Buch gelesen haben.', 'Futur II'],
  ]
  it.each(sentences)('%s: "%s" is flagged for a CEFR reviewer', (id, sentence) => {
    const b = withReading([...BASE, sentence])
    expect(rules(b, 'error')).toEqual([])
    const flags = run(b).filter(i => i.rule === `cefr-structure-${id}`)
    expect(flags).toHaveLength(1)
    expect(flags[0].severity).toBe('review')
    expect(flags[0].message).toMatch(/Heuristic — a CEFR reviewer must decide/)
  })

  it('the table of constructions is exactly what is documented (a pinned list, so changes are deliberate)', () => {
    expect(B1_PLUS_PATTERNS.map(p => p.id)).toEqual([
      'passiv',
      'konj-b1',
      'trotzdem',
      'relativsatz',
      'plusquam',
      'konj2-past',
      'genitiv',
      'futur2',
    ])
  })

  it('ordinary A2 sentences (Perfekt, weil/dass/wenn, Modalverben, Komparativ, Dativ) are NOT flagged', () => {
    const b = withReading([
      ...BASE,
      'Gestern habe ich einen Kuchen gebacken. Ich bleibe zu Hause, weil ich müde bin. Ich weiß, dass er kommt. Wenn es regnet, nehme ich einen Schirm. Ich möchte ein Brot kaufen. Der Zug ist schneller als der Bus. Ich gebe dem Kind ein Buch. Ja, die Wohnung ist frei.',
    ])
    expect(rules(b, 'review')).toEqual([])
  })

  it('long sentences and text lengths outside the A2 range are flagged', () => {
    const long = Array.from({ length: SENTENCE_WORDS_MAX + 3 }, () => 'Haus').join(' ') + '.'
    expect(run(withReading([...BASE, long])).some(i => i.rule === 'cefr-sentence-length' && i.severity === 'review')).toBe(true)

    const tooShort = withReading(['Ich wohne hier.'])
    expect(rules(tooShort, 'review')).toContain('cefr-text-length')
    const wordsOf = (n: number) => Array.from({ length: n }, () => 'Haus.').join(' ')
    expect(rules(withReading([wordsOf(READING_WORDS.max + 5)]), 'review')).toContain('cefr-text-length')

    const b = validA2Bundle()
    b.listening.find(l => l.id === 'a2-li-11-01')!.lines[0].text = Array.from({ length: LISTENING_WORDS_MAX + 5 }, () => 'Haus.').join(' ')
    expect(run(b).some(i => i.rule === 'cefr-text-length' && i.where.startsWith('listening:'))).toBe(true)
  })

  it('every heuristic is a review flag: flags never turn into errors or warnings by themselves', () => {
    const b = withReading([...BASE, 'Das Haus wird gebaut. Ich bleibe zu Hause, obwohl ich gesund bin. Er hatte das Buch gelesen.'])
    for (const i of run(b).filter(x => x.rule.startsWith('cefr-structure-'))) expect(i.severity).toBe('review')
    expect(rules(b, 'error')).toEqual([])
    expect(rules(b, 'warning')).toEqual([])
  })
})

describe('SIGN-OFF: a human must confirm the CEFR level of every unit that has content', () => {
  it('missing sign-off while authoring: a review flag (and the validator says so)', () => {
    const b = validA2Bundle()
    b.reviews = {}
    const flag = run(b).find(i => i.rule === 'cefr-signoff-missing')
    expect(flag?.severity).toBe('review')
    expect(flag?.where).toBe('units:11')
  })

  it('a recorded `cefr: false` is the same as no review', () => {
    const b = validA2Bundle()
    b.reviews = { 11: { cefr: false, ru: true, ky: true } }
    expect(rules(b, 'review')).toContain('cefr-signoff-missing')
  })

  it('release run, or a RELEASED level: the missing sign-off is an ERROR; a BETA level reports it as an explicit review flag (not blocking)', () => {
    const b = validA2Bundle()
    b.reviews = {}
    expect(run(b, 'release').some(i => i.rule === 'cefr-signoff-missing' && i.severity === 'error')).toBe(true)
    const released = validA2Bundle('released')
    released.reviews = { 11: { ru: true, ky: true } }
    expect(run(released).some(i => i.rule === 'cefr-signoff-missing' && i.severity === 'error')).toBe(true)
    const beta = validA2Bundle('beta')
    beta.reviews = { 11: { ru: true, ky: true } }
    expect(run(beta).some(i => i.rule === 'cefr-signoff-missing' && i.severity === 'error')).toBe(false)
    expect(run(beta).some(i => i.rule === 'cefr-signoff-missing' && i.severity === 'review')).toBe(true)
  })

  it('a recorded review clears it', () => {
    expect(rules(validA2Bundle(), 'review')).toEqual([])
    expect(run(validA2Bundle(), 'release').some(i => i.rule === 'cefr-signoff-missing')).toBe(false)
  })

  it('the validator states its limits every time it runs (no lexical check; no pretence of automatic CEFR validation)', () => {
    const limits = run(emptyA2Bundle()).find(i => i.rule === 'cefr-limits')
    expect(limits?.severity).toBe('info')
    expect(limits?.message).toMatch(/no lexical check/)
  })
})

describe('LIMITATIONS, measured on the real A1 German (all existing units relabelled as a strict level)', () => {
  const asStrict = () => {
    const b = emptyA2Bundle()
    b.course = [{ id: 'A2', status: 'planned', unitIdRange: [1, 20], releasedLocales: [] }]
    return b
  }
  const flagged = (b: ContentBundle) =>
    new Set(
      run(b)
        .filter(i => i.rule.startsWith('cefr-structure-') || i.rule === 'cefr-sentence-length' || i.rule === 'cefr-text-length')
        .map(i => i.where.split('#')[0]),
    )

  it('no false positives on genuine A1 text: only the two real B1 constructions are found (Genitiv concept, "trotzdem" in a writing model)', () => {
    expect([...flagged(asStrict())].sort()).toEqual(['grammar:genitiv', 'writing:wr10'])
  })

  it('the B1-tagged reading text re10 is NOT detected by any heuristic — only its declared tag reveals it', () => {
    const b = asStrict()
    expect([...flagged(b)].some(w => w === 'reading:re10')).toBe(false)
    // relabel the real unit 6 as A2 and the text keeps its B1 tag: the reliable (tag) rule catches what the heuristics cannot
    b.units = b.units.map(u => ({ ...u, level: 'A2' as const }))
    expect(run(b).some(i => i.rule === 'cefr-too-advanced-tag' && i.where === 'reading:re10')).toBe(true)
  })
})

describe('A1 is unaffected', () => {
  it('the real content: no errors, no warnings, no review flags', () => {
    const issues = run(emptyA2Bundle())
    expect(issues.filter(i => i.severity !== 'info')).toEqual([])
  })

  it('legacy A2/B1-tagged fragments inside A1 units are not CEFR errors (D-1: they stay A1)', () => {
    const b = emptyA2Bundle()
    expect(b.listening.filter(l => l.level !== 'A1').length).toBeGreaterThan(0)
    expect(run(b).filter(i => i.rule.startsWith('cefr-') && i.severity === 'error')).toEqual([])
  })
})
