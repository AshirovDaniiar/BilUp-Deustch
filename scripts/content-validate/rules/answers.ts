// Answer rules for Listening and Reading questions (Stage 6A).
//  1. STRUCTURE — options present, none empty, none duplicated, the correct index valid.
//  2. POSITION BIAS — where the authored correct answer sits. Judged with an EXACT binomial test on the authored data (no simulation, no
//     randomness): "if every position were equally likely, how unlikely is this count?". Strict levels are failed/warned; the legacy
//     level is only measured (its bias is known; the app shuffles option order per attempt since Stage 4, so it cannot be guessed).
//  3. RUNS — the same position four or more times in a row.
import type { LanguageLevel } from '../../../src/data/types'
import type { Ctx } from '../context'
import { binomialTwoSidedP } from '../stats'

interface Q {
  q: string
  options: string[]
  answer: number
}
interface Entry {
  where: string
  unit: number
  level: LanguageLevel | undefined
  q: Q
}

/** fewer questions than this cannot say anything statistical about positions */
export const MIN_QUESTIONS_FOR_DISTRIBUTION = 9
/** p-value below which a position is SUSPICIOUS (warning) / clearly biased (error) */
export const P_WARN = 0.01
export const P_ERROR = 0.001
export const RUN_LIMIT = 4

const norm = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase()

function structure(ctx: Ctx, e: Entry) {
  const level = e.level
  const sev = ctx.strict(level) ? 'error' : 'info'
  const { q, where } = e
  if (typeof q.q !== 'string' || q.q.trim() === '') ctx.add(sev, 'question-empty', where, 'question text is empty')
  if (!Array.isArray(q.options) || q.options.length < 2)
    return ctx.add(sev, 'options-missing', where, 'a question needs at least two options')
  if (q.options.length > 5) ctx.add(sev, 'options-count', where, `${q.options.length} options (at most 5)`)
  else if (ctx.strict(level) && q.options.length !== 3)
    ctx.add('warning', 'options-count', where, `${q.options.length} options; BilUp questions have 3`)
  q.options.forEach((o, i) => {
    if (typeof o !== 'string' || o.trim() === '') ctx.add(sev, 'option-empty', where, `option ${i + 1} is empty`)
  })
  const seen = new Map<string, number>()
  q.options.forEach((o, i) => {
    if (typeof o !== 'string') return
    const k = norm(o)
    if (seen.has(k) && k !== '')
      ctx.add(sev, 'option-duplicate', where, `options ${seen.get(k)! + 1} and ${i + 1} are the same text ("${o.trim().slice(0, 30)}")`)
    else seen.set(k, i)
  })
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length)
    ctx.add(sev, 'answer-mapping', where, `correct-answer index ${q.answer} does not point at an option`)
}

/** Count of correct answers per position, grouped by number of options. */
export function positionCounts(qs: { options: string[]; answer: number }[]): Map<number, number[]> {
  const byK = new Map<number, number[]>()
  for (const q of qs) {
    if (!Array.isArray(q.options) || !Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) continue
    const k = q.options.length
    const counts = byK.get(k) ?? new Array<number>(k).fill(0)
    counts[q.answer]++
    byK.set(k, counts)
  }
  return byK
}

function distribution(ctx: Ctx, skill: 'listening' | 'reading', level: LanguageLevel | undefined, entries: Entry[]) {
  const label = `${skill} ${level ?? 'legacy'}`
  const strict = ctx.strict(level)
  for (const [k, counts] of positionCounts(entries.map(e => e.q))) {
    const n = counts.reduce((a, b) => a + b, 0)
    const shares = counts.map(c => `${((100 * c) / n).toFixed(0)}%`).join(' / ')
    if (n < MIN_QUESTIONS_FOR_DISTRIBUTION) {
      ctx.add(
        'info',
        'answer-distribution-skipped',
        label,
        `${n} ${k}-option questions — too few for a position test (needs ${MIN_QUESTIONS_FOR_DISTRIBUTION})`,
      )
      continue
    }
    const worst = counts.map((c, pos) => ({ pos, c, p: binomialTwoSidedP(n, c, 1 / k) })).sort((a, b) => a.p - b.p)[0]
    const detail = `${n} ${k}-option questions; correct answer per position: ${counts.join('/')} (${shares}); most unusual: position ${worst.pos + 1} with ${worst.c}/${n} (exact binomial p = ${worst.p.toExponential(1)})`
    if (!strict)
      ctx.add('info', 'answer-distribution', label, `${detail}. Legacy level: measured only — option order is shuffled per attempt`)
    else if (worst.p < P_ERROR)
      ctx.add('error', 'answer-position-bias', label, `${detail} — the correct answer is concentrated in one position`)
    else if (worst.p < P_WARN) ctx.add('warning', 'answer-position-bias', label, `${detail} — suspicious concentration`)
    else ctx.add('info', 'answer-distribution', label, `${detail} — no concentration`)
  }
}

function runs(ctx: Ctx, skill: string, level: LanguageLevel | undefined, unit: number, entries: Entry[]) {
  let start = 0
  const flag = (from: number, to: number) => {
    const len = to - from
    if (len >= RUN_LIMIT)
      ctx.add(
        ctx.strict(level) ? 'warning' : 'info',
        'answer-position-run',
        `${skill} unit ${unit}`,
        `${len} questions in a row have the correct answer at position ${entries[from].q.answer + 1} (${entries[from].where} … ${entries[to - 1].where})`,
      )
  }
  for (let i = 1; i <= entries.length; i++) {
    if (
      i === entries.length ||
      entries[i].q.answer !== entries[start].q.answer ||
      entries[i].q.options.length !== entries[start].q.options.length
    ) {
      flag(start, i)
      start = i
    }
  }
}

export function answerRules(ctx: Ctx): void {
  const { bundle } = ctx
  const all: { skill: 'listening' | 'reading'; entries: Entry[] }[] = [
    {
      skill: 'listening',
      entries: bundle.listening.flatMap(l =>
        (Array.isArray(l.questions) ? l.questions : []).map((q, i) => ({
          where: `listening:${l.id}#${i}`,
          unit: l.unit,
          level: ctx.levelOfUnit(l.unit),
          q,
        })),
      ),
    },
    {
      skill: 'reading',
      entries: bundle.reading.flatMap(r =>
        (Array.isArray(r.questions) ? r.questions : []).map((q, i) => ({
          where: `reading:${r.id}#${i}`,
          unit: r.unit,
          level: ctx.levelOfUnit(r.unit),
          q,
        })),
      ),
    },
  ]
  for (const { skill, entries } of all) {
    for (const e of entries) structure(ctx, e)
    const levels = [...new Set(entries.map(e => e.level))]
    for (const level of levels) {
      const ofLevel = entries.filter(e => e.level === level)
      distribution(ctx, skill, level, ofLevel)
      for (const unit of [...new Set(ofLevel.map(e => e.unit))])
        runs(
          ctx,
          skill,
          level,
          unit,
          ofLevel.filter(e => e.unit === unit),
        )
    }
  }
}
