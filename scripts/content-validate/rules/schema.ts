// Runtime schemas for every A2 content type (Stage 6B). The TypeScript types describe the shape; these check the DATA against it —
// presence, type, enumerations, non-empty arrays — so a malformed item is rejected even if it was written without type checking
// (JSON, a script, a cast). Localised fields are the localization rules' business; this module owns structure.
import { LEVELS } from '../../../src/data/types'
import type { Ctx } from '../context'
import { resolve } from './paths'

type Kind =
  | 'string'
  | 'int'
  | 'posint'
  | 'boolean'
  | 'object'
  | 'array'
  | 'nonEmptyArray'
  | 'stringArray'
  | 'nonEmptyStringArray'
  | { enum: readonly string[] }
interface Field {
  path: string
  kind: Kind
  optional?: true
}

export const POS = ['noun', 'verb', 'adj', 'phrase', 'other'] as const
export const EXERCISE_TYPES = ['choice', 'fill', 'order', 'article'] as const
export const GRAMMAR_CATEGORIES = [
  'articles',
  'cases',
  'verbs',
  'tenses',
  'wordorder',
  'prepositions',
  'adjectives',
  'pronouns',
  'conjunctions',
  'passive',
  'konjunktiv',
  'relative',
] as const
export const GRAMMAR_VISUALS = [
  'cases',
  'verbpos',
  'conjugation',
  'separable',
  'timeline',
  'prepositions',
  'articles',
  'negation',
  'plural',
  'modal',
  'none',
] as const
export const TEST_KINDS = ['placement', 'level', 'topic', 'grammar', 'vocabulary', 'listening', 'speaking'] as const
export const QUESTION_SKILLS = ['grammar', 'vocabulary', 'listening', 'reading'] as const
export const TEMPLATE_KINDS = ['explain', 'example', 'quiz-prompt', 'quiz-correct', 'quiz-wrong', 'encourage', 'clarify'] as const
export const INSTRUCTION_SCOPES = [
  'unit',
  'vocabulary',
  'grammar',
  'listening',
  'reading',
  'speaking',
  'writing',
  'review',
  'test',
] as const
export const PLACEMENT_BANDS = ['low', 'mid', 'high'] as const

const question = (base: string): Field[] => [
  { path: `${base}q`, kind: 'string' },
  { path: `${base}options`, kind: 'nonEmptyStringArray' },
  { path: `${base}answer`, kind: 'int' },
]

/** One table per content type: the fields every item must have, with their types. */
export const A2_SCHEMA = {
  plan: [
    { path: 'id', kind: 'posint' },
    { path: 'key', kind: 'string' },
    { path: 'level', kind: { enum: LEVELS } },
    { path: 'titleDe', kind: 'string' },
  ],
  units: [
    { path: 'id', kind: 'posint' },
    { path: 'key', kind: 'string' },
    { path: 'level', kind: { enum: LEVELS } },
    { path: 'title', kind: 'string' },
    { path: 'icon', kind: 'string' },
    { path: 'subtitle', kind: 'object' },
    { path: 'grammarIds', kind: 'nonEmptyStringArray' },
  ],
  vocabulary: [
    { path: 'id', kind: 'string' },
    { path: 'unit', kind: 'posint' },
    { path: 'pos', kind: { enum: POS } },
    { path: 'article', kind: { enum: ['der', 'die', 'das'] }, optional: true },
    { path: 'plural', kind: 'string', optional: true },
    { path: 'de', kind: 'string' },
    { path: 'example', kind: 'string' },
    { path: 'related', kind: 'stringArray' },
  ],
  grammar: [
    { path: 'id', kind: 'string' },
    { path: 'category', kind: { enum: GRAMMAR_CATEGORIES } },
    { path: 'level', kind: { enum: LEVELS } },
    { path: 'unit', kind: 'posint' },
    { path: 'visual', kind: { enum: GRAMMAR_VISUALS } },
    { path: 'when', kind: 'nonEmptyArray' },
    { path: 'examples', kind: 'nonEmptyArray' },
    { path: 'mistakes', kind: 'array' },
    { path: 'reallife', kind: 'array' },
    { path: 'dialogue', kind: 'array' },
    { path: 'speakPrompt', kind: 'object' },
    { path: 'speakPrompt.sample', kind: 'string' },
    { path: 'speakPrompt.keywords', kind: 'nonEmptyStringArray' },
    { path: 'examples[].de', kind: 'string' },
    { path: 'mistakes[].wrong', kind: 'string' },
    { path: 'mistakes[].right', kind: 'string' },
  ],
  exercises: [
    { path: 'id', kind: 'string' },
    { path: 'type', kind: { enum: EXERCISE_TYPES } },
    { path: 'unit', kind: 'posint' },
    { path: 'concept', kind: 'string', optional: true },
    { path: 'prompt', kind: 'string' },
    { path: 'answer', kind: 'string' },
    { path: 'options', kind: 'stringArray', optional: true },
    { path: 'words', kind: 'stringArray', optional: true },
  ],
  listening: [
    { path: 'id', kind: 'string' },
    { path: 'unit', kind: 'posint' },
    { path: 'level', kind: { enum: LEVELS } },
    { path: 'title', kind: 'string' },
    { path: 'lines', kind: 'nonEmptyArray' },
    { path: 'lines[].speaker', kind: 'string' },
    { path: 'lines[].text', kind: 'string' },
    { path: 'questions', kind: 'nonEmptyArray' },
    ...question('questions[].'),
    { path: 'keywords', kind: 'stringArray' },
  ],
  reading: [
    { path: 'id', kind: 'string' },
    { path: 'unit', kind: 'posint' },
    { path: 'level', kind: { enum: LEVELS } },
    { path: 'title', kind: 'string' },
    { path: 'body', kind: 'nonEmptyStringArray' },
    { path: 'gloss', kind: 'array' },
    { path: 'gloss[].word', kind: 'string' },
    { path: 'gloss[].example', kind: 'string' },
    { path: 'gloss[].related', kind: 'stringArray' },
    { path: 'questions', kind: 'nonEmptyArray' },
    ...question('questions[].'),
  ],
  speaking: [
    { path: 'id', kind: 'string' },
    { path: 'title', kind: 'string' },
    { path: 'icon', kind: 'string' },
    { path: 'level', kind: { enum: LEVELS } },
    { path: 'goal', kind: 'object' },
    { path: 'turns', kind: 'nonEmptyArray' },
    { path: 'turns[].ai', kind: 'string' },
    { path: 'turns[].hints', kind: 'nonEmptyStringArray' },
    { path: 'turns[].keywords', kind: 'nonEmptyStringArray' },
  ],
  writing: [
    { path: 'id', kind: 'string' },
    { path: 'unit', kind: 'posint' },
    { path: 'level', kind: { enum: LEVELS } },
    { path: 'title', kind: 'string' },
    { path: 'formal', kind: 'boolean' },
    { path: 'minWords', kind: 'posint' },
    { path: 'mustInclude', kind: 'nonEmptyArray' },
    { path: 'mustInclude[].label', kind: 'string' },
    { path: 'mustInclude[].patterns', kind: 'nonEmptyStringArray' },
    { path: 'model', kind: 'string' },
    { path: 'tips', kind: 'array' },
  ],
  tests: [
    { path: 'id', kind: 'string' },
    { path: 'title', kind: 'object' },
    { path: 'kind', kind: { enum: TEST_KINDS } },
    { path: 'level', kind: { enum: LEVELS } },
    { path: 'size', kind: 'posint' },
    { path: 'unit', kind: 'int', optional: true },
  ],
  finalTests: [
    { path: 'id', kind: 'string' },
    { path: 'prompt', kind: 'string' },
    { path: 'options', kind: 'nonEmptyStringArray' },
    { path: 'answer', kind: 'string' },
    { path: 'skill', kind: { enum: QUESTION_SKILLS } },
    { path: 'concept', kind: 'string', optional: true },
  ],
  whyNotes: [
    { path: 'sentence', kind: 'string' },
    { path: 'word', kind: 'string' },
    { path: 'conceptId', kind: 'string' },
    { path: 'reason', kind: 'object' },
    { path: 'more', kind: 'array' },
    { path: 'more[].de', kind: 'string' },
  ],
  placementItems: [
    { path: 'id', kind: 'string' },
    { path: 'prompt', kind: 'string' },
    { path: 'options', kind: 'nonEmptyStringArray' },
    { path: 'answer', kind: 'string' },
    { path: 'skill', kind: { enum: QUESTION_SKILLS } },
    { path: 'band', kind: { enum: PLACEMENT_BANDS } },
  ],
  tutorTemplates: [
    { path: 'id', kind: 'string' },
    { path: 'kind', kind: { enum: TEMPLATE_KINDS } },
    { path: 'unit', kind: 'posint', optional: true },
    { path: 'text', kind: 'object' },
    { path: 'placeholders', kind: 'stringArray', optional: true },
  ],
  instructions: [
    { path: 'id', kind: 'string' },
    { path: 'scope', kind: { enum: INSTRUCTION_SCOPES } },
    { path: 'unit', kind: 'posint', optional: true },
    { path: 'text', kind: 'object' },
  ],
} satisfies Record<string, Field[]>

type Collection = keyof typeof A2_SCHEMA

function describe(v: unknown): string {
  if (v === undefined) return 'missing'
  if (v === null) return 'null'
  return `${typeof v === 'string' ? JSON.stringify(v.slice(0, 20)) : Array.isArray(v) ? 'an array' : typeof v}`
}

function ok(kind: Kind, v: unknown): boolean {
  if (typeof kind === 'object') return typeof v === 'string' && kind.enum.includes(v)
  switch (kind) {
    case 'string':
      return typeof v === 'string' && v.trim() !== ''
    case 'int':
      return typeof v === 'number' && Number.isInteger(v)
    case 'posint':
      return typeof v === 'number' && Number.isInteger(v) && v > 0
    case 'boolean':
      return typeof v === 'boolean'
    case 'object':
      return v !== null && typeof v === 'object' && !Array.isArray(v)
    case 'array':
      return Array.isArray(v)
    case 'nonEmptyArray':
      return Array.isArray(v) && v.length > 0
    case 'stringArray':
      return Array.isArray(v) && v.every(x => typeof x === 'string' && x.trim() !== '')
    case 'nonEmptyStringArray':
      return Array.isArray(v) && v.length > 0 && v.every(x => typeof x === 'string' && x.trim() !== '')
  }
}

const expected = (k: Kind) =>
  typeof k === 'object'
    ? `one of ${k.enum.join(' | ')}`
    : {
        string: 'non-empty text',
        int: 'an integer',
        posint: 'a positive integer',
        boolean: 'true/false',
        object: 'an object',
        array: 'an array',
        nonEmptyArray: 'a non-empty array',
        stringArray: 'an array of non-empty strings',
        nonEmptyStringArray: 'a non-empty array of non-empty strings',
      }[k]

/** Check one item against its schema; `where` is the prefix of every reported location. */
export function checkSchema(ctx: Ctx, collection: Collection, where: string, item: unknown) {
  for (const f of A2_SCHEMA[collection] as Field[]) {
    for (const h of resolve(item, f.path)) {
      if (!h.present && h.where.endsWith('[]')) continue // an empty list has no elements to check; non-emptiness is its own field
      if (!h.present || h.value === undefined) {
        if (!f.optional)
          ctx.err('schema-missing', `${where}#${h.where || f.path}`, `required field "${f.path}" is missing (expected ${expected(f.kind)})`)
        continue
      }
      if (!ok(f.kind, h.value))
        ctx.err('schema-type', `${where}#${h.where}`, `"${f.path}" must be ${expected(f.kind)} (got ${describe(h.value)})`)
    }
  }
}

/** Conditional structure that a flat schema cannot express: what each kind of exercise / question must contain. */
export function checkExerciseShape(
  ctx: Ctx,
  where: string,
  e: { type?: string; prompt?: string; answer?: string; options?: string[]; words?: string[] },
) {
  if (e.type === 'choice' || e.type === 'fill' || e.type === 'article') {
    if (!Array.isArray(e.options) || e.options.length < 2)
      ctx.err('schema-exercise', where, `a ${e.type} exercise needs at least two options`)
    else {
      if (!e.options.includes(e.answer as string)) ctx.err('schema-exercise', where, `answer "${e.answer}" is not one of the options`)
      if (new Set(e.options.map(o => o.trim().toLowerCase())).size !== e.options.length)
        ctx.err('schema-exercise', where, 'two options have the same text')
      if (e.type === 'article' && [...e.options].sort().join('|') !== 'das|der|die')
        ctx.err('schema-exercise', where, 'an article exercise offers exactly der / die / das')
    }
  }
  if (e.type === 'fill' && typeof e.prompt === 'string' && e.prompt.split('___').length !== 2)
    ctx.err('schema-exercise', where, 'a fill exercise has exactly one blank "___" in its prompt')
  if (e.type === 'order') {
    if (!Array.isArray(e.words) || e.words.length < 2) ctx.err('schema-exercise', where, 'an order exercise needs its scrambled words')
    else if (typeof e.answer === 'string' && [...e.words].sort().join('|') !== e.answer.split(' ').sort().join('|'))
      ctx.err('schema-exercise', where, 'the scrambled words do not match the answer sentence')
  }
}

export function schemaRules(ctx: Ctx): void {
  const { bundle } = ctx

  // The unit is what assigns an item to a level (D-1). An item without a valid unit would escape EVERY level-scoped rule, so this
  // check applies to all levels: no content item may lack its unit.
  const needUnit = (collection: string, items: { id: string; unit?: unknown }[]) => {
    for (const x of items)
      if (!Number.isInteger(x.unit))
        ctx.err(
          'schema-missing',
          `${collection}:${x.id}#unit`,
          '"unit" must be an integer: the unit is what assigns an item to a level, so an item without one would escape every level rule',
        )
  }
  needUnit('vocabulary', bundle.vocabulary)
  needUnit('grammar', bundle.grammar)
  needUnit('exercises', bundle.exercises)
  needUnit('listening', bundle.listening)
  needUnit('reading', bundle.reading)
  needUnit('writing', bundle.writing)
  for (const u of bundle.units)
    if (!Number.isInteger(u.id))
      ctx.err('schema-missing', `units:${u.id}#id`, '"id" must be an integer: a unit without one cannot be assigned to a level')
  for (const s of bundle.speaking)
    if (typeof s.id !== 'string' || s.id === '')
      ctx.err('schema-missing', `speaking:${s.id}#id`, '"id" is required: the scenario id is what assigns it to a unit')
  for (const t of bundle.tests)
    if (!(LEVELS as readonly string[]).includes(t.level))
      ctx.err(
        'schema-missing',
        `tests:${t.id}#level`,
        `"level" must be one of ${LEVELS.join(' | ')}: a test without a level would escape every level rule`,
      )
  for (const [i, n] of (bundle.whyNotes ?? []).entries())
    if (typeof n.conceptId !== 'string' || n.conceptId === '')
      ctx.err('schema-missing', `whyNotes:#${i}#conceptId`, '"conceptId" is required: the concept assigns the note to a unit and level')
  for (const ft of bundle.finalTests ?? [])
    if (!Number.isInteger(ft.unit)) ctx.err('schema-missing', 'finalTests', 'a final-test entry must name its unit')
  for (const p of bundle.plan ?? []) checkSchema(ctx, 'plan', `plan:${p.id}`, p)
  for (const u of bundle.units) if (ctx.strict(ctx.levelOfUnit(u.id))) checkSchema(ctx, 'units', `units:${u.id}`, u)
  for (const v of bundle.vocabulary) {
    if (!ctx.strict(ctx.levelOfUnit(v.unit))) continue
    checkSchema(ctx, 'vocabulary', `vocabulary:${v.id}`, v)
    if (v.pos === 'noun' && !v.article)
      ctx.err('schema-missing', `vocabulary:${v.id}#article`, 'a noun needs its article (der / die / das)')
    if (v.pos !== 'noun' && v.article)
      ctx.err('schema-type', `vocabulary:${v.id}#article`, `only a noun has an article (this is a ${v.pos})`)
  }
  for (const g of bundle.grammar) if (ctx.strict(ctx.levelOfUnit(g.unit))) checkSchema(ctx, 'grammar', `grammar:${g.id}`, g)
  for (const e of bundle.exercises) {
    if (!ctx.strict(ctx.levelOfUnit(e.unit))) continue
    checkSchema(ctx, 'exercises', `exercises:${e.id}`, e)
    checkExerciseShape(ctx, `exercises:${e.id}`, e)
  }
  for (const l of bundle.listening) if (ctx.strict(ctx.levelOfUnit(l.unit))) checkSchema(ctx, 'listening', `listening:${l.id}`, l)
  for (const r of bundle.reading) if (ctx.strict(ctx.levelOfUnit(r.unit))) checkSchema(ctx, 'reading', `reading:${r.id}`, r)
  for (const s of bundle.speaking) if (ctx.strict(ctx.levelOfScenario(s.id))) checkSchema(ctx, 'speaking', `speaking:${s.id}`, s)
  for (const w of bundle.writing) if (ctx.strict(ctx.levelOfUnit(w.unit))) checkSchema(ctx, 'writing', `writing:${w.id}`, w)
  for (const t of bundle.tests) if (ctx.strict(t.level)) checkSchema(ctx, 'tests', `tests:${t.id}`, t)
  for (const ft of bundle.finalTests ?? []) {
    if (!ctx.strict(ctx.levelOfUnit(ft.unit))) continue
    if (!Number.isInteger(ft.unit)) ctx.err('schema-type', `finalTests:unit${ft.unit}`, '"unit" must be an integer')
    if (!Array.isArray(ft.questions)) ctx.err('schema-type', `finalTests:unit${ft.unit}`, '"questions" must be an array')
    else ft.questions.forEach((q, i) => checkSchema(ctx, 'finalTests', `finalTests:unit${ft.unit}/${q?.id ?? i}`, q))
  }
  ;(bundle.whyNotes ?? []).forEach((n, i) => {
    if (ctx.strict(ctx.levelOfUnit(bundle.grammar.find(g => g.id === n.conceptId)?.unit)))
      checkSchema(ctx, 'whyNotes', `whyNotes:${n.conceptId}/${i}`, n)
  })
  for (const p of bundle.placementItems ?? []) checkSchema(ctx, 'placementItems', `placementItems:${p.id}`, p)
  for (const t of bundle.tutorTemplates ?? []) checkSchema(ctx, 'tutorTemplates', `tutorTemplates:${t.id}`, t)
  for (const i of bundle.instructions ?? []) checkSchema(ctx, 'instructions', `instructions:${i.id}`, i)
}
