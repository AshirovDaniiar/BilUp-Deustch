// Content validator.
//   Core rules (P0, unchanged): id uniqueness and reference integrity of whatever bundle it is given.
//   Stage 6A rules, in ./rules: localization (RU + KY independent), CEFR (structure + review flags), answers (structure + exact position
//   test), references (cross-level + provenance), metadata (tests, final tests, minimums, release gates).
// It is NOT the P3 pack validator (04 §6): no manifests, no pack format, no provenance database.
//
// Level policy: the legacy level (A1) is measured and reported but never failed by the strict rules; every other level is strict.
// A bundle without a `course` is legacy as a whole — which is why the original A1 bundle validates exactly as before.
import { makeContext } from './context'
import { answerRules } from './rules/answers'
import { assessmentRules } from './rules/assessment'
import { b1Rules } from './rules/b1'
import { cefrRules } from './rules/cefr'
import { conventionRules, planRules } from './rules/identity'
import { localizationRules } from './rules/localization'
import { metadataRules } from './rules/metadata'
import { referenceRules } from './rules/references'
import { schemaRules } from './rules/schema'
import { templateRules } from './rules/templates'
import type { ContentBundle, Issue, Options } from './types'
import type { L10n } from '../../src/data/types'

export type { ContentBundle, Issue, Mode, Options, ReviewRecord, Severity } from './types'

export function validateContent(c: ContentBundle, options: Options = {}): Issue[] {
  const ctx = makeContext(c, options.mode ?? 'authoring')
  const { issues, err } = ctx

  // ───────────── core rules (unchanged) ─────────────
  const dup = (name: string, ids: (string | number)[]) => {
    const seen = new Set<string | number>()
    for (const id of ids) {
      if (seen.has(id)) err('unique-id', name, `duplicate id "${id}"`)
      seen.add(id)
    }
    return seen
  }
  const unitIds = dup(
    'units',
    c.units.map(u => u.id),
  )
  const vocabIds = dup(
    'vocabulary',
    c.vocabulary.map(v => v.id),
  )
  const grammarIds = dup(
    'grammar',
    c.grammar.map(g => g.id),
  )
  dup(
    'exercises',
    c.exercises.map(e => e.id),
  )
  dup(
    'listening',
    c.listening.map(e => e.id),
  )
  dup(
    'reading',
    c.reading.map(e => e.id),
  )
  dup(
    'writing',
    c.writing.map(e => e.id),
  )
  const speakingIds = dup(
    'speaking',
    c.speaking.map(e => e.id),
  )
  dup(
    'realLife',
    c.realLife.map(e => e.id),
  )
  dup(
    'tests',
    c.tests.map(e => e.id),
  )

  const unitRef = (name: string, id: string, unit: number | undefined) => {
    if (unit != null && !unitIds.has(unit)) err('ref-unit', `${name}:${id}`, `unit ${unit} does not exist`)
  }
  for (const v of c.vocabulary) {
    unitRef('vocabulary', v.id, v.unit)
    for (const r of Array.isArray(v.related) ? v.related : [])
      if (!vocabIds.has(r)) err('ref-vocab', `vocabulary:${v.id}`, `related id "${r}" does not exist`)
  }
  for (const u of c.units)
    for (const g of Array.isArray(u.grammarIds) ? u.grammarIds : [])
      if (!grammarIds.has(g)) err('ref-grammar', `units:${u.id}`, `grammar id "${g}" does not exist`)
  for (const g of c.grammar) unitRef('grammar', g.id, g.unit)
  for (const e of c.exercises) {
    unitRef('exercises', e.id, e.unit)
    if (e.concept && !grammarIds.has(e.concept)) err('ref-grammar', `exercises:${e.id}`, `concept "${e.concept}" does not exist`)
    if ((e.type === 'choice' || e.type === 'article') && e.options && !e.options.includes(e.answer))
      err('answer-in-options', `exercises:${e.id}`, `answer "${e.answer}" is not among the options`)
    if (e.type === 'order' && e.words && [...e.words].sort().join('|') !== e.answer.split(' ').sort().join('|'))
      err('order-tokens', `exercises:${e.id}`, 'scrambled words do not match the answer sentence')
  }
  const qCheck = (name: string, id: string, qs: { options: string[]; answer: number }[]) =>
    (Array.isArray(qs) ? qs : []).forEach((q, i) => {
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= (q.options?.length ?? 0))
        err('answer-index', `${name}:${id}#${i}`, `answer index ${q.answer} out of range`)
    })
  for (const l of c.listening) {
    unitRef('listening', l.id, l.unit)
    qCheck('listening', l.id, l.questions)
  }
  for (const r of c.reading) {
    unitRef('reading', r.id, r.unit)
    qCheck('reading', r.id, r.questions)
  }
  for (const w of c.writing) unitRef('writing', w.id, w.unit)
  for (const r of c.realLife) {
    if (r.speakingScenarioId && !speakingIds.has(r.speakingScenarioId))
      err('ref-speaking', `realLife:${r.id}`, `scenario "${r.speakingScenarioId}" does not exist`)
    if (r.challenge.answer < 0 || r.challenge.answer >= r.challenge.options.length)
      err('answer-index', `realLife:${r.id}`, 'challenge answer out of range')
  }
  for (const t of c.tests) unitRef('tests', t.id, t.unit)

  // ───────────── Stage 6A rules ─────────────
  planRules(ctx)
  schemaRules(ctx)
  conventionRules(ctx)
  localizationRules(ctx)
  cefrRules(ctx)
  answerRules(ctx)
  referenceRules(ctx)
  metadataRules(ctx)
  assessmentRules(ctx)
  templateRules(ctx)
  b1Rules(ctx) // B1 profile (Stage 2C): silent for a bundle without B1 content

  // Informational: how much LEGACY (non-strict) L10n content has no Kyrgyz text. Strict levels cannot have any (an error above).
  const l10ns: L10n[] = []
  for (const g of c.grammar) if (!ctx.strict(ctx.levelOfUnit(g.unit))) l10ns.push(g.title, g.summary, g.discover, g.why, ...g.when)
  for (const e of c.exercises) if (!ctx.strict(ctx.levelOfUnit(e.unit))) l10ns.push(e.why)
  const missingKy = l10ns.filter(x => !x.ky).length
  issues.push({
    severity: 'info',
    rule: 'l10n-coverage',
    where: 'grammar+exercises',
    message: `${missingKy}/${l10ns.length} L10n strings have no Kyrgyz text (would silently fall back to Russian today)`,
  })
  return issues
}
