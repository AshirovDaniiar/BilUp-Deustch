// Assessment rules (Stage 6B): the agreed distinction between practice and assessment, the level test and the placement extension.
//
//  - Each unit has 8 revision (Wiederholung) exercises AND 15 SEPARATELY AUTHORED final-test questions. "Separately authored" is checked:
//    a final-test question may not reuse a revision exercise (same prompt and answer, or the same id), or the test would only repeat practice.
//  - The level test is exactly one test definition per level (it is composed from the level's own pools, like A1's).
//  - The placement extension is authored items (separate from final tests and exercises), calibrated in bands, and its test definition's
//    size is the number of items. No items and no definition = no A2 placement, which is the honest state today.
import type { Ctx } from '../context'

const norm = (s: unknown) => (typeof s === 'string' ? s.trim().replace(/\s+/g, ' ').toLowerCase() : '')
/** Authored A2 placement items needed for a calibrated extension (two per band). */
export const PLACEMENT_MIN_ITEMS = 6

export function assessmentRules(ctx: Ctx): void {
  const { bundle } = ctx

  // ───── final tests are not the revision exercises ─────
  const keyOf = (prompt: unknown, answer: unknown) => `${norm(prompt)}|${norm(answer)}`
  for (const ft of bundle.finalTests ?? []) {
    if (!ctx.strict(ctx.levelOfUnit(ft.unit))) continue
    const exercises = bundle.exercises.filter(e => e.unit === ft.unit)
    const byKey = new Map(exercises.map(e => [keyOf(e.prompt, e.answer), e.id]))
    const ids = new Set(exercises.map(e => e.id))
    for (const q of ft.questions ?? []) {
      const at = `finalTests:unit${ft.unit}/${q.id}`
      if (ids.has(q.id)) ctx.err('final-test-reuses-exercise', at, `question id "${q.id}" is also a revision exercise id`)
      const same = byKey.get(keyOf(q.prompt, q.answer))
      if (same)
        ctx.err(
          'final-test-reuses-exercise',
          at,
          `same prompt and answer as revision exercise "${same}": final-test questions must be authored separately from the unit's revision exercises`,
        )
    }
  }

  // ───── level test ─────
  for (const level of bundle.course ?? []) {
    if (!ctx.strict(level.id)) continue
    const levelTests = bundle.tests.filter(t => t.kind === 'level' && t.level === level.id)
    if (levelTests.length > 1)
      ctx.err(
        'level-test-duplicate',
        level.id,
        `${level.id} has ${levelTests.length} level tests (${levelTests.map(t => t.id).join(', ')}): exactly one is allowed`,
      )
  }

  // ───── placement extension ─────
  const level = ctx.firstStrictLevel()
  const items = bundle.placementItems ?? []
  const defs = bundle.tests.filter(t => t.kind === 'placement' && ctx.strict(t.level))
  if (defs.length > 1)
    ctx.err(
      'placement-duplicate',
      'placement',
      `${defs.length} A2 placement definitions (${defs.map(d => d.id).join(', ')}): exactly one is allowed`,
    )
  if (!level) return
  if (defs.length === 0 && items.length === 0) {
    ctx.add('info', 'placement-empty', level, `${level} has no placement extension: no ${level} placement is offered or claimed`)
    return
  }
  const sev = ctx.gate(level, 'info')
  if (defs.length === 1 && items.length === 0) ctx.err('placement-empty', defs[0].id, 'the placement definition has no authored items')
  if (defs.length === 0 && items.length > 0)
    ctx.err(
      'placement-definition',
      'placement',
      'authored placement items exist but there is no placement test definition (kind "placement")',
    )
  if (defs.length === 1 && items.length > 0 && defs[0].size !== items.length)
    ctx.err('placement-size', `tests:${defs[0].id}`, `the definition says ${defs[0].size} items but ${items.length} are authored`)
  if (items.length > 0 && items.length < PLACEMENT_MIN_ITEMS)
    ctx.add(sev, 'placement-minimum', 'placement', `${items.length} placement items (minimum ${PLACEMENT_MIN_ITEMS})`)
  if (items.length > 0) {
    const bands = new Set(items.map(i => i.band))
    for (const b of ['low', 'mid', 'high'] as const)
      if (!bands.has(b))
        ctx.add(
          sev,
          'placement-band',
          'placement',
          `no placement item in the "${b}" band: placement needs items calibrated across the level`,
        )
  }
  // placement items are separate from final tests and revision exercises
  const used = new Map<string, string>()
  for (const ft of bundle.finalTests ?? [])
    for (const q of ft.questions ?? []) used.set(keyOf(q.prompt, q.answer), `final-test question "${q.id}"`)
  for (const e of bundle.exercises)
    if (ctx.strict(ctx.levelOfUnit(e.unit))) used.set(keyOf(e.prompt, e.answer), `revision exercise "${e.id}"`)
  for (const q of items) {
    const other = used.get(keyOf(q.prompt, q.answer))
    if (other)
      ctx.add(
        'warning',
        'placement-reuses-content',
        `placementItems:${q.id}`,
        `same prompt and answer as ${other}: placement items should be authored separately`,
      )
  }
}
