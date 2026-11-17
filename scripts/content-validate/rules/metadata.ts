// Metadata rules (Stage 6A): identity and shape come from EXPLICIT metadata, never from ids, string formats or array positions.
//  - a unit's final test is the test definition with `kind: 'topic'` and that `unit`; its id may be anything, its `size` is what the
//    unit page shows and must equal the number of authored final-test questions;
//  - a unit's writing task is a task whose `unit` is that unit (no `wr<NN>` pattern is required or assumed);
//  - the unit→scenario list (positional by design of the A1 data) is validated: ids exist, none repeated, no more entries than units;
//  - the A2 content minimums, and the release gates (every unit signed off for CEFR / Russian / Kyrgyz before a level is offered).
import type { LanguageLevel } from '../../../src/data/types'
import type { Ctx } from '../context'

/** Minimum content of one strict-level unit (the quality standard approved for A2). */
export const UNIT_MINIMUMS = {
  vocabulary: 28,
  grammarMin: 2,
  grammarMax: 3,
  listening: 2,
  readingMin: 1,
  readingMax: 2,
  speaking: 1,
  writing: 1,
  exercises: 8,
  finalTest: 15,
}
const TEST_KINDS = new Set(['placement', 'level', 'topic', 'grammar', 'vocabulary', 'listening', 'speaking'])

export function metadataRules(ctx: Ctx): void {
  const { bundle } = ctx
  const courseLevels = bundle.course ?? []
  const unitIds = new Set(bundle.units.map(u => u.id))

  // ───── units: ids inside their level's range ─────
  const seenUnit = new Set<number>()
  for (const u of bundle.units) {
    if (seenUnit.has(u.id)) continue
    seenUnit.add(u.id)
    if (bundle.course && ctx.levelOfUnit(u.id) === undefined)
      ctx.err('unit-id-range', `units:${u.id}`, `unit id ${u.id} lies in no level's unit id range`)
  }

  // ───── test definitions ─────
  const topicByUnit = new Map<number, string[]>()
  for (const t of bundle.tests) {
    const at = `tests:${t.id}`
    if (!TEST_KINDS.has(t.kind)) ctx.err('test-kind', at, `unknown test kind "${t.kind}"`)
    if (!Number.isInteger(t.size) || t.size <= 0) ctx.err('test-size', at, `size must be a positive integer (got ${t.size})`)
    if (t.kind === 'topic') {
      if (t.unit === undefined) ctx.err('test-unit-missing', at, 'a topic test must say which unit it belongs to (`unit`)')
      else {
        if (!unitIds.has(t.unit) && ctx.strict(t.level)) ctx.err('ref-unit', at, `unit ${t.unit} does not exist`)
        const list = topicByUnit.get(t.unit) ?? []
        list.push(t.id)
        topicByUnit.set(t.unit, list)
      }
    } else if (t.unit !== undefined && ctx.strict(t.level)) ctx.err('test-unit-unexpected', at, `a ${t.kind} test is not bound to a unit`)
  }
  for (const [unit, ids] of topicByUnit)
    if (ids.length > 1)
      ctx.err(
        'test-duplicate-unit',
        `units:${unit}`,
        `unit ${unit} has ${ids.length} topic tests (${ids.join(', ')}): the unit page can show only one`,
      )

  // ───── final tests: explicit size and structure ─────
  const finalByUnit = new Map<number, number>()
  for (const ft of bundle.finalTests ?? []) {
    const lvl = ctx.levelOfUnit(ft.unit)
    finalByUnit.set(ft.unit, (finalByUnit.get(ft.unit) ?? 0) + 1)
    if (!unitIds.has(ft.unit)) ctx.err('ref-unit', `finalTests:unit${ft.unit}`, `unit ${ft.unit} does not exist`)
    if (!ctx.strict(lvl)) continue
    const def = (topicByUnit.get(ft.unit) ?? []).map(id => bundle.tests.find(t => t.id === id)).find(Boolean)
    if (!def)
      ctx.err(
        'final-test-definition',
        `finalTests:unit${ft.unit}`,
        `unit ${ft.unit} has authored final-test questions but no topic test definition`,
      )
    else if (def.size !== ft.questions.length)
      ctx.err(
        'final-test-size',
        `tests:${def.id}`,
        `the definition says ${def.size} questions but unit ${ft.unit} has ${ft.questions.length} authored`,
      )
    const ids = new Set<string>()
    ft.questions.forEach((q, i) => {
      const at = `finalTests:unit${ft.unit}#${i}`
      if (ids.has(q.id)) ctx.err('unique-id', at, `duplicate question id "${q.id}"`)
      ids.add(q.id)
      if (!Array.isArray(q.options) || q.options.length < 2) ctx.err('options-missing', at, 'a question needs at least two options')
      else {
        if (!q.options.includes(q.answer)) ctx.err('answer-mapping', at, `answer "${q.answer}" is not one of the options`)
        if (new Set(q.options.map(o => o.trim().toLowerCase())).size !== q.options.length)
          ctx.err('option-duplicate', at, 'two options have the same text')
        if (q.options.some(o => o.trim() === '')) ctx.err('option-empty', at, 'an option is empty')
      }
    })
  }
  for (const [unit, n] of finalByUnit)
    if (n > 1) ctx.err('final-test-duplicate', `finalTests:unit${unit}`, `unit ${unit} has ${n} final-test entries`)

  // ───── unit → scenario (positional) ─────
  for (const level of courseLevels) {
    const list = bundle.unitSpeaking?.[level.id]
    if (!list) continue
    const unitsOfLevel = bundle.units.filter(u => ctx.levelOfUnit(u.id) === level.id)
    const known = new Set(bundle.speaking.map(s => s.id))
    const seen = new Set<string>()
    list.forEach((id, i) => {
      const at = `unitSpeaking:${level.id}[${i}]`
      if (!known.has(id)) ctx.err('ref-speaking', at, `scenario "${id}" does not exist`)
      if (seen.has(id)) ctx.err('unit-speaking-duplicate', at, `scenario "${id}" is listed for two units`)
      seen.add(id)
    })
    if (list.length > unitsOfLevel.length && ctx.strict(level.id))
      ctx.err('unit-speaking-length', `unitSpeaking:${level.id}`, `${list.length} scenarios for ${unitsOfLevel.length} units`)
  }

  // ───── minimums and release gates, per strict level ─────
  for (const level of courseLevels) {
    if (!ctx.strict(level.id)) continue
    minimums(ctx, level.id, level.unitIdRange, topicByUnit, finalByUnit)
    gates(ctx, level.id)
  }
}

function minimums(
  ctx: Ctx,
  level: LanguageLevel,
  range: readonly [number, number],
  topicByUnit: Map<number, string[]>,
  finalByUnit: Map<number, number>,
) {
  const { bundle } = ctx
  const owned = (unit: number) => ctx.levelOfUnit(unit) === level
  const count = <T extends { unit: number }>(xs: T[], unit: number, pred: (x: T) => boolean = () => true) =>
    xs.filter(x => x.unit === unit && owned(x.unit) && pred(x)).length
  const units = bundle.units.filter(u => owned(u.id))
  const sev = ctx.gate(level, 'info')
  const M = UNIT_MINIMUMS

  if (units.length === 0 && sev !== 'error') {
    ctx.add(
      'info',
      'level-empty',
      level,
      `${level} has no units yet (status ${ctx.statusOf(level)}): nothing to validate beyond the registry`,
    )
    return
  }
  for (let id = range[0]; id <= range[1]; id++) {
    if (!units.some(u => u.id === id)) {
      const planned = bundle.plan?.find(p => p.id === id)
      ctx.add(sev, 'unit-missing', `units:${id}`, `${level} unit ${id}${planned ? ` "${planned.titleDe}"` : ''} is not defined`)
    }
  }
  for (const u of units) {
    const at = `units:${u.id}`
    const need = (what: string, have: number, min: number) =>
      have < min && ctx.add(sev, 'unit-minimum', at, `${what}: ${have} (minimum ${min})`)
    need('vocabulary items', count(bundle.vocabulary, u.id), M.vocabulary)
    need('grammar concepts', count(bundle.grammar, u.id), M.grammarMin)
    if (count(bundle.grammar, u.id) > M.grammarMax)
      ctx.add(
        'warning',
        'unit-maximum',
        at,
        `grammar concepts: ${count(bundle.grammar, u.id)} (the standard is ${M.grammarMin}–${M.grammarMax})`,
      )
    need('listening dialogues', count(bundle.listening, u.id), M.listening)
    need('reading texts', count(bundle.reading, u.id), M.readingMin)
    if (count(bundle.reading, u.id) > M.readingMax)
      ctx.add(
        'warning',
        'unit-maximum',
        at,
        `reading texts: ${count(bundle.reading, u.id)} (the standard is ${M.readingMin}–${M.readingMax})`,
      )
    need('writing tasks', count(bundle.writing, u.id), M.writing)
    need(
      'handwritten revision exercises',
      count(bundle.exercises, u.id, e => e.type !== 'article'),
      M.exercises,
    )
    const scenario = bundle.unitSpeaking?.[level]?.[u.id - range[0]]
    if (!scenario) ctx.add(sev, 'unit-minimum', at, 'no speaking scenario is assigned to the unit')
    if (!topicByUnit.has(u.id)) ctx.add(sev, 'unit-minimum', at, 'no topic test definition (kind "topic", unit) for the unit')
    const final = (bundle.finalTests ?? []).find(f => f.unit === u.id)
    need('final-test questions', final?.questions.length ?? 0, M.finalTest)
    if (final && final.questions.length !== M.finalTest && final.questions.length > 0)
      ctx.add(sev, 'unit-minimum', at, `final test has ${final.questions.length} questions (the standard is exactly ${M.finalTest})`)
  }
  if (!bundle.tests.some(t => t.kind === 'level' && t.level === level))
    if (ctx.phase(level) === 'beta')
      ctx.add(
        'review',
        'beta-level-test-missing',
        level,
        `${level} is in BETA without a level test definition (kind "level"): blocks a full release`,
      )
    else ctx.add(sev, 'unit-minimum', level, `no ${level} level test definition (kind "level")`)
  void finalByUnit
}

/**
 * Release gates: a level that is visible (beta/released) must be completely reviewed for every language it is released for.
 * Reviews are human sign-offs; the validator can only check that they exist.
 */
function gates(ctx: Ctx, level: LanguageLevel) {
  const status = ctx.statusOf(level)
  if (status === undefined || status === 'planned') return
  const info = ctx.bundle.course?.find(l => l.id === level)
  const units = ctx.bundle.units.filter(u => ctx.levelOfUnit(u.id) === level)
  if (units.length === 0) ctx.err('release-gate-empty', level, `${level} is ${status} but has no units`)
  for (const locale of info?.releasedLocales ?? []) {
    if (locale !== 'ru' && locale !== 'ky') continue
    for (const u of units)
      if (ctx.bundle.reviews?.[u.id]?.[locale] !== true)
        // beta: the missing human review is an explicit, non-blocking flag; released (or release mode): the blocking error
        if (ctx.phase(level) === 'released')
          ctx.err(
            'release-gate-review',
            `units:${u.id}`,
            `${level} is released for ${locale} but unit ${u.id} has no recorded ${locale === 'ky' ? 'Kyrgyz' : 'Russian'} review`,
          )
        else
          ctx.add(
            'review',
            'beta-review-pending',
            `units:${u.id}`,
            `${level} is in BETA for ${locale}: unit ${u.id} has no recorded ${locale === 'ky' ? 'Kyrgyz' : 'Russian'} review yet (blocks a full release)`,
          )
  }
}
