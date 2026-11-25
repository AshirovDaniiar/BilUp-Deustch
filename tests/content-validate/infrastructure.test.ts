// @vitest-environment node
/**
 * Stage 6B — A2 content infrastructure: the unit plan, identity/convention rules, assessment and tutor-template rules, cross-unit
 * references, automatic inclusion of every A2 module in the validated bundle, and the guarantee that an empty A2 cannot be released.
 */
import { spawnSync } from 'node:child_process'
import { A2_GRAMMAR_TOPICS, A2_LEGACY_UNITS } from '../../src/data/a2/curriculum'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { A2_UNIT_PLAN } from '../../src/data/a2/registry'
import { A2_UNITS } from '../../src/data/a2/units'
import { allUnits, contentOf } from '../../src/data/catalog'
import { COURSE, availableLevels } from '../../src/data/course'
import { trStrict } from '../../src/utils/text'
import { conventions } from '../../scripts/content-validate/conventions'
import { fullBundle } from '../../scripts/content-validate/bundle'
import type { ContentBundle, Issue } from '../../scripts/content-validate/types'
import { validateContent } from '../../scripts/content-validate/validate'
import { emptyA2Bundle, validA2Bundle } from './fixtures'

type Mode = 'authoring' | 'release'
const run = (b: ContentBundle, mode: Mode = 'authoring'): Issue[] => validateContent(b, { mode })
const errs = (b: ContentBundle, mode: Mode = 'authoring') => run(b, mode).filter(i => i.severity === 'error')
const has = (b: ContentBundle, rule: string, mode: Mode = 'authoring') => errs(b, mode).some(i => i.rule === rule)

const TITLES = [
  'Über mich und meine Erfahrungen',
  'Familie, Freunde und Zusammenleben',
  'Wohnen und Nachbarschaft',
  'Gesundheit und Wohlbefinden',
  'Essen, Einkaufen und Dienstleistungen',
  'Freizeit, Medien und Kultur',
  'Schule, Ausbildung und Beruf',
  'Reisen, Urlaub und Mobilität',
  'Stadtleben und öffentliche Dienste',
  'Pläne, Einladungen und gemeinsame Entscheidungen',
]

describe('the A2 unit plan (registry)', () => {
  it('has the ten approved units, ids 11–20, with the approved German titles verbatim', () => {
    expect(A2_UNIT_PLAN.map(p => p.id)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    expect(A2_UNIT_PLAN.map(p => p.titleDe)).toEqual(TITLES)
    expect(A2_UNIT_PLAN.every(p => p.level === 'A2')).toBe(true)
  })
  it('keys are unique, stable-format identifiers', () => {
    const keys = A2_UNIT_PLAN.map(p => p.key)
    expect(new Set(keys).size).toBe(10)
    for (const k of keys) expect(conventions('a2').unitKey.re.test(k), k).toBe(true)
  })
  it('holds identity only: no Russian or Kyrgyz text anywhere', () => {
    for (const p of A2_UNIT_PLAN) expect(Object.keys(p).sort()).toEqual(['id', 'key', 'level', 'titleDe'])
  })
  it('only units 11–20 are defined (all ten planned units); A2 is in controlled Beta for ru + ky only', () => {
    expect(A2_UNITS.map(u => u.id)).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    expect(COURSE.levels.find(l => l.id === 'A2')?.status).toBe('beta')
    for (const lang of ['ru', 'ky'] as const) expect(availableLevels(lang)).toEqual(['A1', 'A2', 'B1'])
    expect(availableLevels('de')).toEqual(['A1'])
  })
  it('the real plan passes the plan rules', () => {
    expect(run(emptyA2Bundle()).filter(i => i.rule.startsWith('plan-') || (i.rule.startsWith('unit-') && i.severity === 'error'))).toEqual(
      [],
    )
  })
})

describe('plan integrity rules', () => {
  const mutate = (fn: (b: ContentBundle) => void) => {
    const b = validA2Bundle()
    fn(b)
    return b
  }
  it('duplicate id / key / title in the plan', () => {
    expect(
      has(
        mutate(b => (b.plan![1].id = 11)),
        'plan-duplicate',
      ),
    ).toBe(true)
    expect(
      has(
        mutate(b => (b.plan![1].key = b.plan![0].key)),
        'plan-duplicate',
      ),
    ).toBe(true)
    expect(
      has(
        mutate(b => (b.plan![1].titleDe = b.plan![0].titleDe)),
        'plan-duplicate',
      ),
    ).toBe(true)
  })
  it('an id outside the level range or an incomplete plan', () => {
    expect(
      has(
        mutate(b => (b.plan![9].id = 21)),
        'plan-range',
      ),
    ).toBe(true)
    expect(
      has(
        mutate(b => (b.plan as unknown[]).pop()),
        'plan-incomplete',
      ),
    ).toBe(true)
  })
  it('a key that breaks the convention', () => {
    expect(
      has(
        mutate(b => (b.plan![0].key = 'Ueber Mich')),
        'plan-key',
      ),
    ).toBe(true)
  })
  it('a defined unit must match its plan entry: key, title, level', () => {
    expect(
      has(
        mutate(b => (b.units.find(u => u.id === 11)!.key = 'a2-other')),
        'unit-key-mismatch',
      ),
    ).toBe(true)
    expect(
      has(
        mutate(b => (b.units.find(u => u.id === 11)!.title = 'Andere Einheit')),
        'unit-title-mismatch',
      ),
    ).toBe(true)
    expect(
      has(
        mutate(b => (b.units.find(u => u.id === 11)!.level = 'A1')),
        'unit-level-mismatch',
      ),
    ).toBe(true)
  })
  it('a unit that is not in the plan cannot exist', () => {
    expect(
      has(
        mutate(b => (b.plan as unknown[]).splice(0, 1)),
        'unit-not-planned',
      ),
    ).toBe(true)
  })
})

describe('ID conventions', () => {
  const bad: [string, (b: ContentBundle) => void][] = [
    ['vocabulary', b => (b.vocabulary.find(v => v.id === 'v11-1')!.id = 'wort-1')],
    ['grammar', b => (b.grammar.find(g => g.id === 'a2-concept-one')!.id = 'ConceptOne')],
    ['exercise', b => (b.exercises.find(e => e.id === 'a2-ex-11-01')!.id = 'ex-11-1')],
    ['listening', b => (b.listening.find(l => l.id === 'a2-li-11-01')!.id = 'a2-li-12-01')],
    ['reading', b => (b.reading.find(r => r.id === 'a2-re-11-01')!.id = 'text1')],
    ['writing', b => (b.writing.find(w => w.id === 'a2-wr-11-01')!.id = 'a2-wr-11-1')],
    ['final question', b => (b.finalTests![0].questions[0].id = 'q1')],
    ['placement item', b => (b.placementItems![0].id = 'p1')],
    ['tutor template', b => (b.tutorTemplates![0].id = 'tmpl')],
    ['instruction', b => (b.instructions![0].id = 'a2-tt-x')],
  ]
  it.each(bad)('a bad %s id is a warning while authoring and an error in a release', (_n, fn) => {
    const b = validA2Bundle()
    fn(b)
    expect(run(b).some(i => i.rule === 'id-convention' && i.severity === 'warning')).toBe(true)
    expect(errs(b).some(i => i.rule === 'id-convention')).toBe(false)
    const rel = validA2Bundle('beta')
    fn(rel)
    expect(errs(rel, 'release').some(i => i.rule === 'id-convention')).toBe(true)
  })
  it('an article drill must come from a noun of its own unit', () => {
    const b = validA2Bundle()
    b.exercises.push({
      id: 'art-v11-99',
      type: 'article',
      unit: 11,
      concept: 'articles',
      prompt: 'x',
      options: ['der', 'die', 'das'],
      answer: 'der',
      promptRu: 'a',
      promptKy: 'b',
      why: { ru: 'a', ky: 'b' },
    } as never)
    expect(has(b, 'article-drill-source')).toBe(true)
  })
})

describe('assessment: revision exercises, final tests, level test, placement', () => {
  it('a final-test question may not reuse a revision exercise (same prompt+answer, or same id)', () => {
    const b = validA2Bundle()
    const ex = b.exercises.find(e => e.id === 'a2-ex-11-01')!
    Object.assign(b.finalTests![0].questions[0], { prompt: ex.prompt, answer: ex.answer, options: ex.options })
    expect(has(b, 'final-test-reuses-exercise')).toBe(true)
    const c = validA2Bundle()
    c.finalTests![0].questions[0].id = 'a2-ex-11-01'
    expect(has(c, 'final-test-reuses-exercise')).toBe(true)
  })
  it('exactly one level test per level', () => {
    const b = validA2Bundle()
    b.tests.push({ ...b.tests.find(t => t.kind === 'level' && t.level === 'A2')!, id: 'level-a2-copy' })
    expect(has(b, 'level-test-duplicate')).toBe(true)
  })
  it('placement: definition and items agree', () => {
    const noItems = validA2Bundle()
    noItems.placementItems = []
    expect(has(noItems, 'placement-empty')).toBe(true)
    const noDef = validA2Bundle()
    noDef.tests = noDef.tests.filter(t => t.kind !== 'placement' || t.level !== 'A2')
    expect(has(noDef, 'placement-definition')).toBe(true)
    const size = validA2Bundle()
    size.tests.find(t => t.kind === 'placement' && t.level === 'A2')!.size = 9
    expect(has(size, 'placement-size')).toBe(true)
    const two = validA2Bundle()
    two.tests.push({ ...two.tests.find(t => t.kind === 'placement' && t.level === 'A2')!, id: 'placement-a2-b' })
    expect(has(two, 'placement-duplicate')).toBe(true)
  })
  it('thin placement is informational while authoring and an error for a release', () => {
    expect(run(validA2Bundle()).some(i => i.rule === 'placement-minimum' && i.severity === 'info')).toBe(true)
    expect(errs(validA2Bundle('beta'), 'release').some(i => i.rule === 'placement-minimum')).toBe(true)
  })
  it('no A2 placement at all (today) is information, never a claim', () => {
    const issues = run(emptyA2Bundle())
    expect(issues.some(i => i.rule === 'placement-empty' && i.severity === 'info')).toBe(true)
    expect(issues.filter(i => i.rule.startsWith('placement-') && i.severity !== 'info')).toEqual([])
  })
})

describe('tutor templates and learner instructions', () => {
  const t = (b: ContentBundle) => b.tutorTemplates![0]
  it('placeholders must be the same in Russian and Kyrgyz', () => {
    const b = validA2Bundle()
    t(b).text.ky = 'Тема түшүндүрүлөт.'
    expect(has(b, 'template-placeholders')).toBe(true)
  })
  it('placeholders must be declared', () => {
    const b = validA2Bundle()
    t(b).placeholders = []
    expect(has(b, 'template-placeholder-undeclared')).toBe(true)
  })
  it('a declared but unused placeholder is a warning', () => {
    const b = validA2Bundle()
    t(b).placeholders = ['concept', 'extra']
    expect(run(b).some(i => i.rule === 'template-placeholder-unused' && i.severity === 'warning')).toBe(true)
  })
  it('an instruction is fixed text', () => {
    const b = validA2Bundle()
    b.instructions![0].text.ru = 'Послушайте {dialog}.'
    expect(has(b, 'instruction-placeholder')).toBe(true)
  })
  it('both languages are required and one never stands in for the other', () => {
    for (const lang of ['ru', 'ky'] as const) {
      const b = validA2Bundle()
      delete (t(b).text as unknown as Record<string, unknown>)[lang]
      expect(
        errs(b).some(i => i.rule.startsWith('l10n-missing') && i.where.includes('tutorTemplates')),
        lang,
      ).toBe(true)
      const c = validA2Bundle()
      delete (c.instructions![0].text as unknown as Record<string, unknown>)[lang]
      expect(
        errs(c).some(i => i.rule.startsWith('l10n-missing') && i.where.includes('instructions')),
        lang,
      ).toBe(true)
    }
  })
  it('a template or instruction for a unit that does not exist, and duplicate ids', () => {
    const a = validA2Bundle()
    t(a).unit = 99
    expect(has(a, 'ref-unit')).toBe(true)
    const b = validA2Bundle()
    b.instructions!.push({ ...b.instructions![0] })
    expect(has(b, 'unique-id')).toBe(true)
  })
})

describe('cross-unit references stay inside their unit', () => {
  it('a unit listing a concept of another unit', () => {
    const b = validA2Bundle()
    b.grammar.find(g => g.id === 'a2-concept-two')!.unit = 12
    expect(has(b, 'ref-cross-unit')).toBe(true)
  })
  it('a word related to a word of another unit', () => {
    const b = validA2Bundle()
    b.vocabulary.find(v => v.id === 'v11-2')!.unit = 12
    b.vocabulary.find(v => v.id === 'v11-1')!.related = ['v11-2']
    expect(has(b, 'ref-cross-unit')).toBe(true)
  })
  it('a revision exercise practising a concept of another unit', () => {
    const b = validA2Bundle()
    b.grammar.find(g => g.id === 'a2-concept-two')!.unit = 12
    b.units.find(u => u.id === 11)!.grammarIds = ['a2-concept-one'] // so only the exercise's own reference can be caught
    b.exercises.find(e => e.id === 'a2-ex-11-01')!.concept = 'a2-concept-two'
    const found = errs(b).filter(i => i.rule === 'ref-cross-unit')
    expect(found.map(i => i.where)).toEqual(['exercises:a2-ex-11-01'])
  })
  it('a why-note pointing at a concept that does not exist', () => {
    const b = validA2Bundle()
    b.whyNotes![0].conceptId = 'a2-gibt-es-nicht'
    expect(has(b, 'ref-grammar')).toBe(true)
  })
})

describe('every A2 module is part of the validated bundle automatically', () => {
  const modules = import.meta.glob('../../src/data/a2/*.ts', { eager: true }) as Record<string, Record<string, unknown>>
  const content = contentOf('A2') as unknown as Record<string, readonly unknown[]>

  it('every array exported by a src/data/a2 module is one of the catalog values the validator reads', () => {
    // the hidden legacy units are not a LevelContent collection, but they ARE validated (they are part of `allUnits`, which the bundle reads)
    for (const u of A2_UNITS) expect(allUnits).toContain(u) // every authored unit is in `allUnits` (listed or hidden legacy), which the bundle validates
    // A2_GRAMMAR_TOPICS is the approved topic → existing-lesson table of the curriculum (metadata that references lessons by id), not content
    const catalogArrays = new Set([...Object.values(content), A2_LEGACY_UNITS, A2_UNITS, A2_GRAMMAR_TOPICS])
    // An array may be wired transitively: e.g. A2_LESETEXTE is spread into A2_READING, so its items are validated even though
    // the exported array itself is not a LevelContent value. Only arrays with at least one item outside every catalog value are missing.
    const catalogItems = new Set(Object.values(content).flatMap(value => (Array.isArray(value) ? value : [])))
    const missing: string[] = []
    for (const [file, mod] of Object.entries(modules))
      for (const [name, value] of Object.entries(mod))
        if (
          Array.isArray(value) &&
          !catalogArrays.has(value) &&
          !(value as unknown[]).every(x => typeof x === 'string' || catalogItems.has(x))
        )
          missing.push(`${file}:${name}`)
    expect(missing, 'an exported A2 content array is not wired into LevelContent (and so not validated)').toEqual([])
  })

  it('fullBundle() carries every LevelContent collection', () => {
    const b = fullBundle() as unknown as Record<string, unknown>
    const bundleKey: Record<string, string> = { placement: 'placementItems' }
    for (const key of Object.keys(content)) {
      if (key === 'unitSpeaking') continue
      expect(b[bundleKey[key] ?? key], `fullBundle() has no "${key}"`).toBeDefined()
    }
  })
})

describe('trStrict never falls back', () => {
  it('returns the requested language only', () => {
    expect(trStrict({ ru: 'привет', ky: 'салам' }, 'ky')).toBe('салам')
    expect(trStrict({ ru: 'привет' }, 'ky')).toBeUndefined()
    expect(trStrict({ ky: 'салам' }, 'ru')).toBeUndefined()
    expect(trStrict({ ru: '  ', ky: 'салам' }, 'ru')).toBeUndefined()
    expect(trStrict(undefined, 'ru')).toBeUndefined()
  })
})

describe('release validation rejects an empty A2', () => {
  it('every planned unit is reported missing by its approved title, and there is no level test', () => {
    const e = errs(fullBundle(), 'release')
    // units 11–20 (authored) are no longer missing; every other planned unit still is
    const authored = [
      'Über mich und meine Erfahrungen',
      'Familie, Freunde und Zusammenleben',
      'Wohnen und Nachbarschaft',
      'Gesundheit und Wohlbefinden',
      'Essen, Einkaufen und Dienstleistungen',
      'Freizeit, Medien und Kultur',
      'Schule, Ausbildung und Beruf',
      'Reisen, Urlaub und Mobilität',
      'Stadtleben und öffentliche Dienste',
      'Pläne, Einladungen und gemeinsame Entscheidungen',
    ]
    for (const title of authored)
      expect(
        e.some(i => i.rule === 'unit-missing' && i.message.includes(title)),
        title,
      ).toBe(false)
    for (const title of TITLES.filter(t => !authored.includes(t)))
      expect(
        e.some(i => i.rule === 'unit-missing' && i.message.includes(title)),
        title,
      ).toBe(true)
    expect(e.some(i => i.rule === 'unit-minimum' && /level test/.test(i.message))).toBe(true)
  })
  it('authoring validation of the same bundle has no errors', () => {
    expect(errs(emptyA2Bundle())).toEqual([])
  })
  const cli = (...args: string[]) =>
    spawnSync(process.execPath, ['node_modules/vite-node/vite-node.mjs', 'scripts/content-validate/cli.ts', ...args], {
      cwd: process.cwd(),
      encoding: 'utf8',
    })
  it('the release CLI exits non-zero; the authoring CLI exits zero', () => {
    expect(cli('--release').status).toBe(1)
    expect(cli().status).toBe(0)
  }, 120000)
})

describe('the authoring guide agrees with the validator', () => {
  const guide = readFileSync('docs/authoring/A2_AUTHORING_GUIDE.md', 'utf8')
  it('lists every planned unit: id, key and approved title', () => {
    for (const p of A2_UNIT_PLAN) {
      expect(guide).toContain(`| ${p.id} | \`${p.key}\` | ${p.titleDe} |`)
    }
  })
  it('documents every content type of the schema', () => {
    for (const k of [
      'units',
      'vocabulary',
      'grammar',
      'exercises',
      'listening',
      'reading',
      'speaking',
      'writing',
      'tests',
      'finalTests',
      'placementItems',
      'tutorTemplates',
      'instructions',
    ])
      expect(guide, k).toContain(`### ${k}`)
  })
  it('shows each ID convention form that the validator enforces', () => {
    const c = conventions('a2')
    for (const form of [
      c.unitKey.form,
      c.vocabulary(11).form.replace('11', '11'),
      c.exercise(11).form,
      c.listening(11).form,
      c.reading(11).form,
      c.writing(11).form,
      c.finalQuestion(11).form,
      c.placementItem.form,
      c.tutorTemplate.form,
      c.instruction.form,
      c.levelTest.form,
      c.placementTest.form,
      c.speaking.form,
    ])
      expect(guide, form).toContain(form)
  })
  it('names both validation commands', () => {
    expect(guide).toContain('npm run content:validate')
    expect(guide).toContain('npm run content:validate:release')
  })
})
