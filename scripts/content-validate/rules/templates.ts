// Tutor-template and learner-instruction rules (Stage 6B). Schema only — the tutor itself is migrated in its own stage.
// The guarantee being prepared: the AI tutor and the instructions can answer in Russian OR Kyrgyz from separately authored texts, and
// never by using one language as a stand-in for the other. So: both languages required (localization rules), ids unique, a template
// belongs to a real unit, and — the part only templates need — the SAME placeholders in both languages, so filling a template can
// never leave a hole in one language.
import type { Ctx } from '../context'

const PLACEHOLDER = /\{([A-Za-z][A-Za-z0-9]*)\}/g
const tokens = (s: unknown): string[] => (typeof s === 'string' ? [...s.matchAll(PLACEHOLDER)].map(m => m[1]) : [])
const setOf = (xs: string[]) => [...new Set(xs)].sort()

export function templateRules(ctx: Ctx): void {
  const { bundle } = ctx
  const unitKnown = (unit: number | undefined, where: string) => {
    if (unit === undefined) return
    if (!bundle.units.some(u => u.id === unit)) ctx.err('ref-unit', where, `unit ${unit} does not exist`)
  }

  const seen = new Set<string>()
  const dup = (collection: string, id: string) => {
    const k = `${collection}:${id}`
    if (seen.has(k)) ctx.err('unique-id', collection, `duplicate id "${id}"`)
    seen.add(k)
  }

  for (const t of bundle.tutorTemplates ?? []) {
    const at = `tutorTemplates:${t.id}`
    dup('tutorTemplates', t.id)
    unitKnown(t.unit, at)
    const ru = setOf(tokens(t.text?.ru))
    const ky = setOf(tokens(t.text?.ky))
    if (ru.join('|') !== ky.join('|'))
      ctx.err(
        'template-placeholders',
        at,
        `Russian uses {${ru.join('}, {')}} but Kyrgyz uses {${ky.join('}, {')}}: both languages must use exactly the same placeholders`,
      )
    const declared = new Set(t.placeholders ?? [])
    for (const name of new Set([...ru, ...ky]))
      if (!declared.has(name))
        ctx.err('template-placeholder-undeclared', at, `placeholder {${name}} is used but not declared in \`placeholders\``)
    for (const name of declared)
      if (!ru.includes(name) && !ky.includes(name))
        ctx.add('warning', 'template-placeholder-unused', at, `placeholder {${name}} is declared but no text uses it`)
  }

  for (const i of bundle.instructions ?? []) {
    const at = `instructions:${i.id}`
    dup('instructions', i.id)
    unitKnown(i.unit, at)
    if (tokens(i.text?.ru).length + tokens(i.text?.ky).length > 0)
      ctx.err('instruction-placeholder', at, 'an instruction is fixed text: it has no placeholders')
  }

  // placement items and final-test questions share one id space per collection
  for (const q of bundle.placementItems ?? []) dup('placementItems', q.id)
  const finalIds = new Set<string>()
  for (const ft of bundle.finalTests ?? [])
    for (const q of ft.questions ?? []) {
      if (finalIds.has(q.id)) ctx.err('unique-id', `finalTests:unit${ft.unit}`, `question id "${q.id}" is used in more than one place`)
      finalIds.add(q.id)
    }
}
