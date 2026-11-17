// Localization rules (Stage 6A). Russian and Kyrgyz are INDEPENDENT explanation languages:
//   - every localised field of every strict-level (A2) item needs a Russian AND a Kyrgyz text,
//   - empty / whitespace / placeholder text is invalid,
//   - Kyrgyz that is merely a copy of the Russian is invalid (that is the "silent Russian fallback" smuggled into the data),
//   - nothing is ever filled in from the other language.
// The rules never look at characters (Kyrgyz shares letters with Russian — 02 §7.0); only presence, emptiness, placeholders and identity.
import type { Ctx } from '../context'
import { resolve } from './paths'

const norm = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase()
const PLACEHOLDER = /(^|\W)(todo|tbd|fixme|xxx|lorem ipsum|\?\?\?)(\W|$)/i

type Spec =
  | { kind: 'l10n'; path: string } //                            an object { ru, ky, de? }
  | { kind: 'pair'; base: string; ru: string; ky: string; word?: true } //    two sibling string fields (e.g. promptRu / promptKy)
  | { kind: 'text'; path: string } //                            plain (German) content that must simply not be empty

type Collection =
  | 'units'
  | 'vocabulary'
  | 'grammar'
  | 'exercises'
  | 'listening'
  | 'reading'
  | 'speaking'
  | 'writing'
  | 'tests'
  | 'finalTests'
  | 'whyNotes'
  | 'placementItems'
  | 'tutorTemplates'
  | 'instructions'

/** Every localised field of every content type. Adding a field to a type means adding it here (a test pins the list). */
export const A2_LOCALIZATION: Record<Collection, Spec[]> = {
  units: [
    { kind: 'text', path: 'title' },
    { kind: 'l10n', path: 'subtitle' },
  ],
  vocabulary: [
    { kind: 'text', path: 'de' },
    { kind: 'text', path: 'example' },
    { kind: 'pair', base: '', ru: 'ru', ky: 'ky', word: true }, // the allow-list may excuse this pair (loanword / name / number) …
    { kind: 'pair', base: '', ru: 'exampleRu', ky: 'exampleKy' }, // … never the example sentence
  ],
  grammar: [
    { kind: 'l10n', path: 'title' },
    { kind: 'l10n', path: 'summary' },
    { kind: 'l10n', path: 'discover' },
    { kind: 'l10n', path: 'why' },
    { kind: 'l10n', path: 'when[]' },
    { kind: 'l10n', path: 'speakPrompt.prompt' },
    { kind: 'l10n', path: 'mistakes[].note' },
    { kind: 'text', path: 'speakPrompt.sample' },
    { kind: 'text', path: 'examples[].de' },
    { kind: 'pair', base: 'examples[]', ru: 'ru', ky: 'ky' },
    { kind: 'text', path: 'reallife[].de' },
    { kind: 'pair', base: 'reallife[]', ru: 'ru', ky: 'ky' },
    { kind: 'text', path: 'dialogue[].text' },
    { kind: 'pair', base: 'dialogue[]', ru: 'ru', ky: 'ky' },
    { kind: 'text', path: 'mistakes[].wrong' },
    { kind: 'text', path: 'mistakes[].right' },
  ],
  exercises: [
    { kind: 'text', path: 'prompt' },
    { kind: 'text', path: 'answer' },
    { kind: 'pair', base: '', ru: 'promptRu', ky: 'promptKy' },
    { kind: 'l10n', path: 'why' },
  ],
  listening: [
    { kind: 'text', path: 'title' },
    { kind: 'text', path: 'lines[].text' },
    { kind: 'pair', base: 'lines[]', ru: 'ru', ky: 'ky' },
  ],
  reading: [
    { kind: 'text', path: 'title' },
    { kind: 'text', path: 'body[]' },
    { kind: 'pair', base: 'gloss[]', ru: 'ru', ky: 'ky' },
    { kind: 'pair', base: 'gloss[]', ru: 'grammar', ky: 'grammarKy' },
  ],
  speaking: [
    { kind: 'text', path: 'title' },
    { kind: 'l10n', path: 'goal' },
    { kind: 'pair', base: '', ru: 'titleRu', ky: 'titleKy' },
    { kind: 'text', path: 'turns[].ai' },
    { kind: 'pair', base: 'turns[]', ru: 'aiRu', ky: 'aiKy' },
  ],
  writing: [
    { kind: 'text', path: 'title' },
    { kind: 'l10n', path: 'situation' },
    { kind: 'l10n', path: 'tips[]' },
    { kind: 'text', path: 'model' },
  ],
  tests: [{ kind: 'l10n', path: 'title' }],
  finalTests: [
    { kind: 'text', path: 'prompt' },
    { kind: 'text', path: 'answer' },
    { kind: 'pair', base: '', ru: 'promptRu', ky: 'promptKy' },
    { kind: 'l10n', path: 'why' },
  ],
  whyNotes: [
    { kind: 'text', path: 'sentence' },
    { kind: 'text', path: 'word' },
    { kind: 'pair', base: '', ru: 'ru', ky: 'ky' },
    { kind: 'l10n', path: 'reason' },
    { kind: 'text', path: 'more[].de' },
    { kind: 'pair', base: 'more[]', ru: 'ru', ky: 'ky' },
  ],
  placementItems: [
    { kind: 'text', path: 'prompt' },
    { kind: 'text', path: 'answer' },
    { kind: 'pair', base: '', ru: 'promptRu', ky: 'promptKy' },
    { kind: 'l10n', path: 'why' },
  ],
  tutorTemplates: [{ kind: 'l10n', path: 'text' }],
  instructions: [{ kind: 'l10n', path: 'text' }],
}

type Reporter = {
  base: string
  id: string
  collection: Collection
  ctx: Ctx
  sameAsRu: Set<string>
}

function checkText(r: Reporter, where: string, value: unknown, label: string) {
  const at = `${r.collection}:${r.id}#${where}`
  if (typeof value !== 'string') return r.ctx.err('content-missing', at, `${label} is missing`)
  if (value.trim() === '') return r.ctx.err('content-empty', at, `${label} is empty`)
  if (PLACEHOLDER.test(value)) r.ctx.err('l10n-placeholder', at, `${label} contains placeholder text ("${value.slice(0, 40)}")`)
}

function checkPair(r: Reporter, where: string, ru: unknown, ky: unknown, ruName: string, kyName: string, wordPair = false) {
  const at = `${r.collection}:${r.id}#${where}`
  for (const [lang, v, name] of [['ru', ru, ruName] as const, ['ky', ky, kyName] as const]) {
    if (v === undefined || v === null)
      r.ctx.err(`l10n-missing-${lang}`, at, `${name} is missing — there is no fallback to the other language`)
    else if (typeof v !== 'string') r.ctx.err(`l10n-missing-${lang}`, at, `${name} is not text`)
    else if (v.trim() === '') r.ctx.err(`l10n-empty-${lang}`, at, `${name} is empty`)
    else if (PLACEHOLDER.test(v)) r.ctx.err('l10n-placeholder', at, `${name} contains placeholder text ("${v.slice(0, 40)}")`)
  }
  if (typeof ru === 'string' && typeof ky === 'string' && ru.trim() !== '' && ky.trim() !== '' && norm(ru) === norm(ky)) {
    const words = norm(ru).split(' ').length
    const allowed = wordPair && r.collection === 'vocabulary' && r.sameAsRu.has(r.id)
    if (allowed) r.ctx.add('info', 'l10n-ky-equals-ru-allowed', at, `${kyName} equals ${ruName} (allow-listed as intentional)`)
    else if (words >= 2 || ru.trim().length >= 8)
      r.ctx.err(
        'l10n-ky-equals-ru',
        at,
        `${kyName} is a copy of ${ruName} ("${ru.trim().slice(0, 40)}") — Kyrgyz must be authored, not copied from Russian`,
      )
    else
      r.ctx.add(
        'review',
        'l10n-ky-equals-ru-short',
        at,
        `${kyName} equals ${ruName} ("${ru.trim()}"): confirm it is intentional (loanword / name / number) or author the Kyrgyz`,
      )
  }
}

function checkL10n(r: Reporter, where: string, value: unknown) {
  const at = `${r.collection}:${r.id}#${where}`
  if (value === undefined || value === null || typeof value !== 'object')
    return r.ctx.err('l10n-missing-ru', at, `${where} is missing (needs Russian and Kyrgyz)`)
  const o = value as { ru?: unknown; ky?: unknown }
  checkPair(r, where, o.ru, o.ky, `${where}.ru`, `${where}.ky`)
}

/** Apply the specs of one collection to one item. */
function checkItem(r: Reporter, item: unknown) {
  for (const spec of A2_LOCALIZATION[r.collection]) {
    if (spec.kind === 'text') {
      for (const h of resolve(item, spec.path)) {
        // an absent ARRAY (no entries) is not a missing text: the counts are the business of the minimums rule
        if (!h.present && h.where.endsWith('[]')) continue
        checkText(r, h.where, h.value, h.where)
      }
    } else if (spec.kind === 'l10n') {
      for (const h of resolve(item, spec.path)) {
        if (!h.present && h.where.endsWith('[]')) continue
        checkL10n(r, h.where, h.value)
      }
    } else {
      for (const b of resolve(item, spec.base)) {
        if (!b.present && b.where.endsWith('[]')) continue
        const o = (b.value ?? {}) as Record<string, unknown>
        const prefix = b.where ? `${b.where}.` : ''
        checkPair(
          r,
          `${prefix}${spec.ru}/${spec.ky}`,
          o[spec.ru],
          o[spec.ky],
          `${prefix}${spec.ru}`,
          `${prefix}${spec.ky}`,
          spec.word === true,
        )
      }
    }
  }
}

export function localizationRules(ctx: Ctx): void {
  const { bundle } = ctx
  const sameAsRu = new Set(bundle.sameAsRu ?? [])
  const run = <T extends { id: string | number }>(
    collection: Collection,
    items: T[] | undefined,
    levelOf: (x: T) => ReturnType<Ctx['levelOfUnit']>,
  ) => {
    for (const item of items ?? []) {
      if (!ctx.strict(levelOf(item))) continue
      checkItem({ base: '', id: String(item.id), collection, ctx, sameAsRu }, item)
    }
  }
  run('units', bundle.units, u => ctx.levelOfUnit(u.id))
  run('vocabulary', bundle.vocabulary, v => ctx.levelOfUnit(v.unit))
  run('grammar', bundle.grammar, g => ctx.levelOfUnit(g.unit))
  run('exercises', bundle.exercises, e => ctx.levelOfUnit(e.unit))
  run('listening', bundle.listening, l => ctx.levelOfUnit(l.unit))
  run('reading', bundle.reading, t => ctx.levelOfUnit(t.unit))
  run('writing', bundle.writing, w => ctx.levelOfUnit(w.unit))
  run('speaking', bundle.speaking, s => ctx.levelOfScenario(s.id))
  run('tests', bundle.tests, t => t.level)
  ;(bundle.whyNotes ?? []).forEach((n, i) => {
    if (ctx.strict(ctx.levelOfUnit(bundle.grammar.find(g => g.id === n.conceptId)?.unit)))
      checkItem({ base: '', id: `${n.conceptId}/${i}`, collection: 'whyNotes', ctx, sameAsRu }, n)
  })
  run('placementItems', bundle.placementItems, () => ctx.firstStrictLevel())
  run('tutorTemplates', bundle.tutorTemplates, t => (t.unit === undefined ? ctx.firstStrictLevel() : ctx.levelOfUnit(t.unit)))
  run('instructions', bundle.instructions, t => (t.unit === undefined ? ctx.firstStrictLevel() : ctx.levelOfUnit(t.unit)))
  for (const ft of bundle.finalTests ?? []) {
    if (!ctx.strict(ctx.levelOfUnit(ft.unit))) continue
    for (const q of ft.questions) checkItem({ base: '', id: `unit${ft.unit}/${q.id}`, collection: 'finalTests', ctx, sameAsRu }, q)
  }
}
