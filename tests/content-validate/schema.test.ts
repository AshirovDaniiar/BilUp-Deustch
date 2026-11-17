// @vitest-environment node
/**
 * Stage 6B — runtime schemas for every A2 content type. The TypeScript types describe the shape; these tests prove the DATA is checked
 * against it (JSON, scripts and casts can bypass the compiler): missing required fields, wrong types, bad enumerations, empty lists,
 * and the per-kind structure of exercises.
 */
import { describe, expect, it } from 'vitest'
import { A2_SCHEMA } from '../../scripts/content-validate/rules/schema'
import type { ContentBundle, Issue } from '../../scripts/content-validate/types'
import { validateContent } from '../../scripts/content-validate/validate'
import { emptyA2Bundle, validA2Bundle } from './fixtures'

const run = (b: ContentBundle): Issue[] => validateContent(b)
const errs = (b: ContentBundle) => run(b).filter(i => i.severity === 'error')
const hit = (b: ContentBundle, rule: string, where: string) => errs(b).some(i => i.rule === rule && i.where.startsWith(where))

type Coll =
  | 'units'
  | 'vocabulary'
  | 'grammar'
  | 'exercises'
  | 'listening'
  | 'reading'
  | 'speaking'
  | 'writing'
  | 'tests'
  | 'whyNotes'
  | 'placementItems'
  | 'tutorTemplates'
  | 'instructions'
/** how to find one item of each collection in the fixture, and the `where` prefix the validator reports for it */
const ITEMS: Record<Coll, { find: (b: ContentBundle) => Record<string, unknown>; where: string }> = {
  units: { find: b => b.units.find(u => u.id === 11) as never, where: 'units:11' },
  vocabulary: { find: b => b.vocabulary.find(v => v.id === 'v11-1') as never, where: 'vocabulary:v11-1' },
  grammar: { find: b => b.grammar.find(g => g.id === 'a2-concept-one') as never, where: 'grammar:a2-concept-one' },
  exercises: { find: b => b.exercises.find(e => e.id === 'a2-ex-11-01') as never, where: 'exercises:a2-ex-11-01' },
  listening: { find: b => b.listening.find(l => l.id === 'a2-li-11-01') as never, where: 'listening:a2-li-11-01' },
  reading: { find: b => b.reading.find(r => r.id === 'a2-re-11-01') as never, where: 'reading:a2-re-11-01' },
  speaking: { find: b => b.speaking.find(s => s.id === 'a2-sp-11-01') as never, where: 'speaking:a2-sp-11-01' },
  writing: { find: b => b.writing.find(w => w.id === 'a2-wr-11-01') as never, where: 'writing:a2-wr-11-01' },
  tests: { find: b => b.tests.find(t => t.id === 'unit-11') as never, where: 'tests:unit-11' },
  whyNotes: { find: b => b.whyNotes?.find(n => n.conceptId === 'a2-concept-one') as never, where: 'whyNotes:a2-concept-one' },
  placementItems: { find: b => b.placementItems?.find(p => p.id === 'a2-pl-01') as never, where: 'placementItems:a2-pl-01' },
  tutorTemplates: {
    find: b => b.tutorTemplates?.find(t => t.id === 'a2-tt-explain-intro') as never,
    where: 'tutorTemplates:a2-tt-explain-intro',
  },
  instructions: { find: b => b.instructions?.find(i => i.id === 'a2-in-listening') as never, where: 'instructions:a2-in-listening' },
}

/** the fixture world, with one why-note so every collection has an item to break */
function world(): ContentBundle {
  const b = validA2Bundle()
  if (b.whyNotes?.length) return b
  b.whyNotes = [
    {
      sentence: 'Ich bin müde.',
      ru: 'Я устал.',
      ky: 'Мен чарчадым.',
      word: 'bin',
      reason: { ru: 'Первое лицо', ky: 'Биринчи жак' },
      conceptId: 'a2-concept-one',
      more: [{ de: 'Du bist da.', ru: 'Ты здесь.', ky: 'Сен ошондосуң.' }],
    },
  ]
  return b
}

describe('the compliant world satisfies every schema', () => {
  it('no error, no warning, no review flag — including the why-note', () => {
    expect(run(world()).filter(i => i.severity !== 'info')).toEqual([])
  })
})

describe('a missing required field is rejected (every required field of every content type)', () => {
  const cases = (Object.keys(A2_SCHEMA) as (keyof typeof A2_SCHEMA)[]).flatMap(coll =>
    (A2_SCHEMA[coll] as { path: string; optional?: true }[])
      .filter(f => !f.optional && !f.path.includes('[]') && !f.path.includes('.') && coll in ITEMS)
      .map(f => [coll, f.path] as const),
  )
  it('there are cases for every collection that has an item in the fixture', () => {
    expect(new Set(cases.map(c => c[0]))).toEqual(new Set(Object.keys(ITEMS)))
  })

  it.each(cases)('%s.%s', (coll, field) => {
    const b = world()
    const item = ITEMS[coll as Coll].find(b)
    delete item[field]
    const found = errs(b)
    // `unit` and `level` also decide which rules apply to the item: its absence must not let the item escape all of them
    expect(found.length, `${coll}.${field} was deleted but nothing failed`).toBeGreaterThan(0)
    if (field !== 'unit')
      expect(
        found.some(i => i.rule.startsWith('schema-') && i.where.includes(ITEMS[coll as Coll].where.split(':')[0])),
        `${coll}.${field}`,
      ).toBe(true)
  })
})

describe('a field of the wrong type or an invalid enumeration is rejected', () => {
  const bad: [Coll, string, unknown][] = [
    ['units', 'id', '11'],
    ['units', 'grammarIds', 'a2-concept-one'],
    ['units', 'grammarIds', []],
    ['vocabulary', 'unit', '11'],
    ['vocabulary', 'unit', 11.5],
    ['vocabulary', 'pos', 'noun-ish'],
    ['vocabulary', 'article', 'das-das'],
    ['vocabulary', 'related', 'v11-2'],
    ['grammar', 'category', 'astrology'],
    ['grammar', 'visual', 'hologram'],
    ['grammar', 'when', []],
    ['grammar', 'examples', []],
    ['grammar', 'level', 'A3'],
    ['exercises', 'type', 'essay'],
    ['exercises', 'unit', null],
    ['listening', 'lines', []],
    ['listening', 'questions', []],
    ['listening', 'keywords', 'Arzt'],
    ['reading', 'body', []],
    ['reading', 'body', 'one string'],
    ['speaking', 'turns', []],
    ['speaking', 'icon', 3],
    ['writing', 'formal', 'yes'],
    ['writing', 'minWords', 0],
    ['writing', 'minWords', 12.5],
    ['writing', 'mustInclude', []],
    ['tests', 'kind', 'exam'],
    ['tests', 'size', '15'],
    ['tests', 'size', 0],
    ['placementItems', 'band', 'extreme'],
    ['placementItems', 'skill', 'singing'],
    ['tutorTemplates', 'kind', 'chatter'],
    ['tutorTemplates', 'placeholders', 'concept'],
    ['instructions', 'scope', 'everywhere'],
  ]
  it.each(bad)('%s.%s = %j', (coll, field, value) => {
    const b = world()
    ITEMS[coll].find(b)[field] = value
    expect(errs(b).length).toBeGreaterThan(0)
    if (field !== 'unit' && field !== 'id') expect(hit(b, 'schema-type', ITEMS[coll].where.split(':')[0]), `${coll}.${field}`).toBe(true)
  })

  it('numbers that arrive as strings (data from JSON) are not silently accepted', () => {
    const b = world()
    const t = ITEMS.tests.find(b)
    t.size = '15'
    expect(hit(b, 'schema-type', 'tests:unit-11')).toBe(true)
  })
})

describe('nested structures are checked too', () => {
  it('listening/reading questions: options array, answer index type', () => {
    for (const [coll, id] of [
      ['listening', 'a2-li-11-01'],
      ['reading', 'a2-re-11-01'],
    ] as const) {
      const bad = world()
      ;(ITEMS[coll].find(bad).questions as Record<string, unknown>[])[0].options = 'eins zwei drei'
      expect(hit(bad, 'schema-type', `${coll}:${id}`)).toBe(true)
      const idx = world()
      ;(ITEMS[coll].find(idx).questions as Record<string, unknown>[])[0].answer = '1'
      expect(hit(idx, 'schema-type', `${coll}:${id}`)).toBe(true)
    }
  })

  it('every line of a dialogue needs its speaker; every gloss entry its word; every turn its hints', () => {
    const l = world()
    delete (ITEMS.listening.find(l).lines as Record<string, unknown>[])[0].speaker
    expect(hit(l, 'schema-missing', 'listening:a2-li-11-01#lines[0].speaker')).toBe(true)
    const r = world()
    delete (ITEMS.reading.find(r).gloss as Record<string, unknown>[])[0].word
    expect(hit(r, 'schema-missing', 'reading:a2-re-11-01#gloss[0].word')).toBe(true)
    const s = world()
    ;(ITEMS.speaking.find(s).turns as Record<string, unknown>[])[0].hints = []
    expect(hit(s, 'schema-type', 'speaking:a2-sp-11-01#turns[0].hints')).toBe(true)
  })

  it('grammar: speak-prompt keywords, example German text, mistake structure', () => {
    const b = world()
    const g = ITEMS.grammar.find(b)
    ;(g.speakPrompt as Record<string, unknown>).keywords = []
    ;(g.examples as Record<string, unknown>[])[0].de = ''
    delete (g.mistakes as Record<string, unknown>[])[0].right
    const found = errs(b).map(i => `${i.rule}@${i.where}`)
    expect(found).toEqual(
      expect.arrayContaining([
        'schema-type@grammar:a2-concept-one#speakPrompt.keywords',
        'schema-type@grammar:a2-concept-one#examples[0].de',
        'schema-missing@grammar:a2-concept-one#mistakes[0].right',
      ]),
    )
  })

  it('final-test questions and writing must-include items', () => {
    const b = world()
    delete (b.finalTests![0].questions[0] as unknown as Record<string, unknown>).skill
    expect(hit(b, 'schema-missing', 'finalTests:unit11/a2-ft-11-01')).toBe(true)
    const w = world()
    ;(ITEMS.writing.find(w).mustInclude as Record<string, unknown>[])[0].patterns = []
    expect(hit(w, 'schema-type', 'writing:a2-wr-11-01#mustInclude[0].patterns')).toBe(true)
  })
})

describe('exercise structure depends on its kind', () => {
  const ex = (b: ContentBundle) => ITEMS.exercises.find(b)
  const found = (b: ContentBundle) =>
    errs(b)
      .filter(i => i.rule === 'schema-exercise')
      .map(i => i.message)

  it('choice / fill / article need at least two distinct options that contain the answer', () => {
    const noOptions = world()
    delete ex(noOptions).options
    expect(found(noOptions).join()).toMatch(/at least two options/)
    const notThere = world()
    ex(notThere).answer = 'nicht dabei'
    expect(found(notThere).join()).toMatch(/not one of the options/)
    const dupes = world()
    ex(dupes).options = ['bin', 'BIN', 'ist']
    expect(found(dupes).join()).toMatch(/same text/)
  })

  it('a fill exercise has exactly one blank', () => {
    for (const prompt of ['Ich bin müde.', 'Ich ___ ___ müde.']) {
      const b = world()
      ex(b).prompt = prompt
      expect(found(b).join(), prompt).toMatch(/exactly one blank/)
    }
  })

  it('an article exercise offers exactly der / die / das', () => {
    const b = world()
    b.exercises.push({
      id: 'art-v11-1',
      type: 'article',
      unit: 11,
      concept: 'articles',
      prompt: 'Beispielwort1',
      options: ['der', 'die'],
      answer: 'der',
      promptRu: 'x',
      promptKy: 'y',
      why: { ru: 'a', ky: 'b' },
    })
    expect(found(b).join()).toMatch(/exactly der \/ die \/ das/)
  })

  it('an order exercise needs its scrambled words, and they must match the answer', () => {
    const b = world()
    Object.assign(ex(b), { type: 'order', answer: 'Ich bin müde', options: undefined })
    expect(found(b).join()).toMatch(/needs its scrambled words/)
    Object.assign(ex(b), { words: ['Ich', 'bin', 'froh'] })
    expect(found(b).join()).toMatch(/do not match/)
    Object.assign(ex(b), { words: ['müde', 'Ich', 'bin'] })
    expect(found(b)).toEqual([])
  })

  it('a noun needs its article and only a noun has one', () => {
    const noun = world()
    delete ITEMS.vocabulary.find(noun).article
    expect(hit(noun, 'schema-missing', 'vocabulary:v11-1#article')).toBe(true)
    const verb = world()
    Object.assign(ITEMS.vocabulary.find(verb), { pos: 'verb' })
    expect(hit(verb, 'schema-type', 'vocabulary:v11-1#article')).toBe(true)
  })
})

describe('no item can escape the level rules by losing its unit', () => {
  it.each(['vocabulary', 'grammar', 'exercises', 'listening', 'reading', 'writing'] as const)('%s without a unit is rejected', coll => {
    const b = world()
    delete ITEMS[coll].find(b).unit
    expect(hit(b, 'schema-missing', `${ITEMS[coll].where}#unit`)).toBe(true)
  })

  it('a final-test entry without a unit is rejected', () => {
    const b = world()
    delete (b.finalTests![0] as unknown as Record<string, unknown>).unit
    expect(errs(b).some(i => i.rule === 'schema-missing' && i.where === 'finalTests')).toBe(true)
  })
})

describe('A1 is unaffected', () => {
  it('the real content satisfies the unit requirement and raises no schema error (the A1 shapes are not held to the A2 schema)', () => {
    expect(errs(emptyA2Bundle()).filter(i => i.rule.startsWith('schema-'))).toEqual([])
  })
})
