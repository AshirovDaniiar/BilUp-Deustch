// Identity rules (Stage 6B): the unit plan, defined units against the plan, and the A2 ID conventions.
//
//  - PLAN: the approved plan must define exactly the units of the level's id range, once each, with stable unique keys and titles.
//  - DEFINED UNITS: an authored unit must be a planned unit — same id, same stable key, same German title, same level. Level assignment
//    always goes through the parent unit (D-1), so a unit that is not in the plan cannot hold content.
//  - CONVENTIONS: ids follow predictable forms (docs/authoring/A2_AUTHORING_GUIDE.md §2). A deviation is a warning while authoring and an
//    error for a release. Conventions are about names only: nothing in the application parses an id.
import type { LanguageLevel } from '../../../src/data/types'
import { conventions } from '../conventions'
import type { Ctx } from '../context'

export function planRules(ctx: Ctx): void {
  const { bundle } = ctx
  const plan = bundle.plan ?? []
  for (const level of bundle.course ?? []) {
    if (!ctx.strict(level.id)) continue
    const mine = plan.filter(p => p.level === level.id)
    if (mine.length === 0) {
      // a PLANNED level that has no units yet (not started) needs no plan; a level that is visible, or that already holds units, does
      if (bundle.units.some(u => ctx.levelOfUnit(u.id) === level.id) || (plan.length > 0 && ctx.statusOf(level.id) !== 'planned'))
        ctx.err('plan-missing', level.id, `${level.id} has units but no approved unit plan`)
      continue
    }
    const [lo, hi] = level.unitIdRange
    const ids = new Set<number>()
    const keys = new Set<string>()
    const titles = new Set<string>()
    for (const p of mine) {
      const at = `plan:${p.id}`
      if (ids.has(p.id)) ctx.err('plan-duplicate', at, `unit id ${p.id} is planned twice`)
      ids.add(p.id)
      if (keys.has(p.key)) ctx.err('plan-duplicate', at, `unit key "${p.key}" is used twice`)
      keys.add(p.key)
      if (titles.has(p.titleDe)) ctx.err('plan-duplicate', at, `title "${p.titleDe}" is used twice`)
      titles.add(p.titleDe)
      if (p.id < lo || p.id > hi) ctx.err('plan-range', at, `unit id ${p.id} lies outside ${level.id}'s id range ${lo}–${hi}`)
      if (!conventions(level.id.toLowerCase()).unitKey.re.test(p.key))
        ctx.err('plan-key', at, `unit key "${p.key}" does not match ${conventions(level.id.toLowerCase()).unitKey.form}`)
    }
    for (let id = lo; id <= hi; id++)
      if (!ids.has(id))
        ctx.err(
          'plan-incomplete',
          `plan:${id}`,
          `unit ${id} is missing from the ${level.id} plan (it must define exactly units ${lo}–${hi})`,
        )
  }

  // an authored unit must BE a planned unit
  for (const u of bundle.units) {
    const level = ctx.levelOfUnit(u.id)
    if (!ctx.strict(level) || plan.length === 0) continue
    const p = plan.find(x => x.id === u.id)
    const at = `units:${u.id}`
    if (!p) {
      ctx.err('unit-not-planned', at, `unit ${u.id} is not in the approved ${level} plan`)
      continue
    }
    if (u.key !== p.key) ctx.err('unit-key-mismatch', at, `unit key "${u.key}" differs from the planned stable key "${p.key}"`)
    if (u.title !== p.titleDe) ctx.err('unit-title-mismatch', at, `unit title "${u.title}" differs from the approved title "${p.titleDe}"`)
    if (u.level !== p.level) ctx.err('unit-level-mismatch', at, `unit declares ${u.level} but is planned as ${p.level}`)
  }
}

export function conventionRules(ctx: Ctx): void {
  const { bundle } = ctx
  const check = (level: LanguageLevel | undefined, where: string, id: string, c: { form: string; re: RegExp }, extra = '') => {
    if (!ctx.strict(level) || !level) return
    if (!c.re.test(id))
      ctx.add(ctx.gate(level, 'warning'), 'id-convention', where, `id "${id}" does not follow the convention ${c.form}${extra}`)
  }
  const p = (level: LanguageLevel | undefined) => (level ?? 'a2').toLowerCase()
  const cv = (level: LanguageLevel | undefined) => conventions(p(level))

  for (const u of bundle.units)
    if (u.key !== undefined) check(ctx.levelOfUnit(u.id), `units:${u.id}`, u.key, cv(ctx.levelOfUnit(u.id)).unitKey)
  for (const v of bundle.vocabulary)
    check(ctx.levelOfUnit(v.unit), `vocabulary:${v.id}`, v.id, cv(ctx.levelOfUnit(v.unit)).vocabulary(v.unit))
  for (const g of bundle.grammar) check(ctx.levelOfUnit(g.unit), `grammar:${g.id}`, g.id, cv(ctx.levelOfUnit(g.unit)).grammar)
  const vocabById = new Map(bundle.vocabulary.map(v => [v.id, v]))
  for (const e of bundle.exercises) {
    const lvl = ctx.levelOfUnit(e.unit)
    if (e.type === 'article') {
      check(lvl, `exercises:${e.id}`, e.id, cv(lvl).articleDrill(e.unit))
      const src = vocabById.get(e.id.replace(/^art-/, ''))
      if (ctx.strict(lvl) && lvl && e.id.startsWith('art-') && (!src || src.unit !== e.unit))
        ctx.err(
          'article-drill-source',
          `exercises:${e.id}`,
          `an article drill is generated from a noun of the SAME unit: "${e.id.replace(/^art-/, '')}" is not a unit ${e.unit} word`,
        )
    } else check(lvl, `exercises:${e.id}`, e.id, cv(lvl).exercise(e.unit))
  }
  for (const l of bundle.listening) check(ctx.levelOfUnit(l.unit), `listening:${l.id}`, l.id, cv(ctx.levelOfUnit(l.unit)).listening(l.unit))
  for (const r of bundle.reading) check(ctx.levelOfUnit(r.unit), `reading:${r.id}`, r.id, cv(ctx.levelOfUnit(r.unit)).reading(r.unit))
  for (const w of bundle.writing) check(ctx.levelOfUnit(w.unit), `writing:${w.id}`, w.id, cv(ctx.levelOfUnit(w.unit)).writing(w.unit))
  for (const s of bundle.speaking) check(ctx.levelOfScenario(s.id), `speaking:${s.id}`, s.id, cv(ctx.levelOfScenario(s.id)).speaking)
  for (const t of bundle.tests) {
    const c = cv(t.level)
    if (t.kind === 'topic' && t.unit !== undefined) check(t.level, `tests:${t.id}`, t.id, c.unitTest(t.unit))
    else if (t.kind === 'level') check(t.level, `tests:${t.id}`, t.id, c.levelTest)
    else if (t.kind === 'placement') check(t.level, `tests:${t.id}`, t.id, c.placementTest)
  }
  for (const ft of bundle.finalTests ?? [])
    for (const q of ft.questions)
      check(ctx.levelOfUnit(ft.unit), `finalTests:unit${ft.unit}/${q.id}`, q.id, cv(ctx.levelOfUnit(ft.unit)).finalQuestion(ft.unit))
  const first = ctx.firstStrictLevel()
  for (const q of bundle.placementItems ?? []) check(first, `placementItems:${q.id}`, q.id, cv(first).placementItem)
  for (const t of bundle.tutorTemplates ?? [])
    check(t.unit === undefined ? first : ctx.levelOfUnit(t.unit), `tutorTemplates:${t.id}`, t.id, cv(first).tutorTemplate)
  for (const i of bundle.instructions ?? [])
    check(i.unit === undefined ? first : ctx.levelOfUnit(i.unit), `instructions:${i.id}`, i.id, cv(first).instruction)
}
