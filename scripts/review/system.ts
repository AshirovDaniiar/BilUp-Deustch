// Stage 8A — the reusable A2 human-review system (units 11–20). ADDITIVE: it does not touch the Unit 11 packages (`unit-package.ts`), the
// locked package fingerprints, the validator or `A2_REVIEWS`. Nothing here records or implies a human approval: the generator writes every
// record as `pending` with empty reviewer fields, and `evaluateRecord` refuses an approval that lacks a person, a date, the current fingerprint
// or that is signed by an AI.
//
// Three INDEPENDENT review dimensions per unit:
//   de-cefr          the German content (CEFR A2 suitability, naturalness) — German text only, no Russian/Kyrgyz
//   ru-localization  every Russian field next to its German source — no Kyrgyz
//   ky-localization  every Kyrgyz field next to its German source — no Russian (so no Russian fallback can hide in a Kyrgyz review)
// A fingerprint covers exactly the rows of one package, so a change of the Kyrgyz text changes only the Kyrgyz fingerprint.
import { createHash } from 'node:crypto'
import { A2_CONTENT } from '../../src/data/a2/a2-content'
import { A2_INSTRUCTIONS } from '../../src/data/a2/instructions'
import { UNIT_12_RECEPTIVE_WORDS } from '../../src/data/a2/unit12/vocabulary'
import { UNIT_13_RECEPTIVE_WORDS } from '../../src/data/a2/unit13/vocabulary'
import { UNIT_14_RECEPTIVE_WORDS } from '../../src/data/a2/unit14/vocabulary'
import { UNIT_15_RECEPTIVE_WORDS } from '../../src/data/a2/unit15/vocabulary'
import { UNIT_16_RECEPTIVE_WORDS } from '../../src/data/a2/unit16/vocabulary'
import { UNIT_17_RECEPTIVE_WORDS } from '../../src/data/a2/unit17/vocabulary'
import { UNIT_18_RECEPTIVE_WORDS } from '../../src/data/a2/unit18/vocabulary'
import { UNIT_19_RECEPTIVE_WORDS } from '../../src/data/a2/unit19/vocabulary'
import { UNIT_20_RECEPTIVE_WORDS } from '../../src/data/a2/unit20/vocabulary'
import { UNIT_11_RECEPTIVE_WORDS } from '../../src/data/a2/vocabulary'
import {
  exercisesForUnit,
  finalTestOfUnit,
  grammarForUnit,
  grammarIndex,
  listeningForUnit,
  readingForUnit,
  registerLevelContent,
  speakingForUnit,
  speakingIndex,
  topicTestOfUnit,
  unitById,
  vocabularyForUnit,
  whyNotesOf,
  writingForUnit,
} from '../../src/data/catalog'

registerLevelContent('A2', A2_CONTENT)

export const REVIEW_UNITS = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as const
export const DIMENSIONS = ['de-cefr', 'ru-localization', 'ky-localization'] as const
export type Dimension = (typeof DIMENSIONS)[number]
export const STATUSES = ['pending', 'in_review', 'changes_requested', 'approved'] as const
export type ReviewStatus = (typeof STATUSES)[number]
export const SEVERITIES = ['blocker', 'major', 'minor', 'suggestion'] as const
export type Severity = (typeof SEVERITIES)[number]

export interface Finding {
  id: string
  /** the row reference (e.g. `v20-3.example`, `a2-li-20-01#4`) */
  ref: string
  severity: Severity
  comment: string
  status: 'open' | 'resolved'
}
export interface ReviewRecord {
  schema: 1
  unit: number
  title: string
  dimension: Dimension
  status: ReviewStatus
  reviewer: { name: string; qualification: string }
  /** ISO date (YYYY-MM-DD) of the completed review */
  reviewDate: string
  /** the package fingerprint the reviewer actually reviewed */
  reviewedFingerprint: string
  findings: Finding[]
}

export interface Row {
  ref: string
  /** what the row is (e.g. "word", "example", "line") */
  label: string
  /** German source text (the text itself, for the de-cefr package) */
  source: string
  /** the localized text under review (ru / ky packages only) */
  value: string
  /** reviewer-relevant facts that are not text (part of speech, receptive, correct answer …) */
  note: string
}
export interface Section {
  id: string
  title: string
  rows: Row[]
}
export interface ReviewModel {
  unit: number
  key: string
  title: string
  dimension: Dimension
  sections: Section[]
}

// ───────────────────────── data collection (a plain, cloneable snapshot of one unit) ─────────────────────────
export interface UnitData {
  unit: NonNullable<ReturnType<typeof unitById>>
  receptive: string[]
  vocab: ReturnType<typeof vocabularyForUnit>
  grammar: ReturnType<typeof grammarForUnit>
  whyNotes: ReturnType<typeof whyNotesOf>
  listening: ReturnType<typeof listeningForUnit>
  reading: ReturnType<typeof readingForUnit>
  speaking: NonNullable<ReturnType<typeof speakingIndex.get>>
  writing: ReturnType<typeof writingForUnit>[number]
  exercises: ReturnType<typeof exercisesForUnit>
  final: NonNullable<ReturnType<typeof finalTestOfUnit>>
  testTitle: { ru: string; ky: string }
  instructions: typeof A2_INSTRUCTIONS
}

const RECEPTIVE: Record<number, readonly string[]> = {
  11: UNIT_11_RECEPTIVE_WORDS,
  12: UNIT_12_RECEPTIVE_WORDS,
  13: UNIT_13_RECEPTIVE_WORDS,
  14: UNIT_14_RECEPTIVE_WORDS,
  15: UNIT_15_RECEPTIVE_WORDS,
  16: UNIT_16_RECEPTIVE_WORDS,
  17: UNIT_17_RECEPTIVE_WORDS,
  18: UNIT_18_RECEPTIVE_WORDS,
  19: UNIT_19_RECEPTIVE_WORDS,
  20: UNIT_20_RECEPTIVE_WORDS,
}

/** A deep copy of the shipped data of one A2 unit: tests mutate the copy, never the shipped data. */
export function collectUnit(unitId: number): UnitData {
  if (!(REVIEW_UNITS as readonly number[]).includes(unitId)) throw new Error(`not an A2 unit: ${unitId}`)
  const unit = unitById(unitId)!
  const grammarIds = new Set(unit.grammarIds)
  const test = topicTestOfUnit(unitId)!
  return structuredClone({
    unit,
    receptive: [...RECEPTIVE[unitId]],
    vocab: vocabularyForUnit(unitId),
    grammar: grammarForUnit(unitId),
    whyNotes: whyNotesOf('A2').filter(n => grammarIndex.get(n.conceptId) && grammarIds.has(n.conceptId)),
    listening: listeningForUnit(unitId),
    reading: readingForUnit(unitId),
    speaking: speakingIndex.get(speakingForUnit(unitId) ?? '')!,
    writing: writingForUnit(unitId)[0],
    exercises: exercisesForUnit(unitId),
    final: finalTestOfUnit(unitId)!,
    testTitle: { ru: test.title.ru ?? '', ky: test.title.ky ?? '' },
    instructions: A2_INSTRUCTIONS.filter(i => i.unit === unitId),
  }) as UnitData
}

// ───────────────────────────────────────── model ─────────────────────────────────────────
const lc = (l: { ru?: string; ky?: string } | undefined, d: 'ru' | 'ky'): string => (l ? (l[d] ?? '') : '')
const opts = (o: string[], answer: string | number) =>
  o.map((x, i) => `${'ABC'[i]}) ${x}${(typeof answer === 'number' ? i === answer : x === answer) ? ' ✔' : ''}`).join(' · ')

/** Builds the rows of one review dimension. German-only for de-cefr; German source + one language for the localization packages. */
export function buildModel(data: UnitData, dimension: Dimension): ReviewModel {
  const loc = dimension === 'de-cefr' ? null : dimension === 'ru-localization' ? 'ru' : 'ky'
  const sections: Section[] = []
  const add = (id: string, title: string): Row[] => {
    const rows: Row[] = []
    sections.push({ id, title, rows })
    return rows
  }
  /** a row: `de` is the German text, `l` the localized pair {ru, ky}; skipped in a localization package when there is nothing to review */
  const row = (rows: Row[], ref: string, label: string, de: string | undefined, l: { ru?: string; ky?: string } | undefined, note = '') => {
    if (loc === null) {
      if (de !== undefined && de !== '') rows.push({ ref, label, source: de, value: '', note })
    } else {
      // a localization package lists ONLY rows that have a localized field (German-only rows belong to the de-cefr package)
      const v = lc(l, loc)
      if (v !== '') rows.push({ ref, label, source: de ?? '', value: v, note })
    }
  }
  const { unit } = data

  const u = add('unit', 'Unit')
  row(u, `unit-${unit.id}.title`, 'title', unit.title, undefined, `key ${unit.key}`)
  row(u, `unit-${unit.id}.subtitle`, 'subtitle', unit.subtitle.de, unit.subtitle)
  row(u, `unit-${unit.id}.test-title`, 'test title', undefined, data.testTitle)

  const v = add('vocabulary', 'Vocabulary')
  for (const x of data.vocab) {
    const rec = data.receptive.includes(x.de) ? 'recognition' : 'active'
    const word = `${x.article ? x.article + ' ' : ''}${x.de}${x.plural ? ' (Pl. ' + x.plural + ')' : ''}`
    row(v, `${x.id}.word`, 'word', word, { ru: x.ru, ky: x.ky }, `${x.pos}; ${rec}`)
    row(v, `${x.id}.example`, 'example', x.example, { ru: x.exampleRu, ky: x.exampleKy })
  }

  const g = add('grammar', 'Grammar')
  for (const c of data.grammar) {
    row(g, `${c.id}.title`, 'title', c.id, c.title, `${c.category}`)
    row(g, `${c.id}.summary`, 'explanation', undefined, c.summary)
    row(g, `${c.id}.discover`, 'discovery question', undefined, c.discover)
    row(g, `${c.id}.why`, 'why it matters', undefined, c.why)
    c.when.forEach((w, i) => row(g, `${c.id}.when#${i + 1}`, 'rule', undefined, w))
    c.examples.forEach((e, i) => row(g, `${c.id}.example#${i + 1}`, 'example', e.de, { ru: e.ru, ky: e.ky })) // `focus` is Russian-language metadata: deliberately not shown (it would leak Russian into the de-cefr and Kyrgyz packages)
    c.mistakes.forEach((m, i) => row(g, `${c.id}.mistake#${i + 1}`, 'mistake', `✘ ${m.wrong} → ✔ ${m.right}`, m.note))
    c.reallife.forEach((e, i) => row(g, `${c.id}.reallife#${i + 1}`, 'real-life', e.de, { ru: e.ru, ky: e.ky }))
    c.dialogue.forEach((d, i) => row(g, `${c.id}.dialogue#${i + 1}`, `dialogue (${d.speaker})`, d.text, { ru: d.ru, ky: d.ky }))
    row(g, `${c.id}.speak`, 'speaking prompt', c.speakPrompt.sample, c.speakPrompt.prompt, `keywords: ${c.speakPrompt.keywords.join(', ')}`)
  }

  const w = add('why-notes', '"Why?" notes')
  data.whyNotes.forEach((n, i) => {
    const ref = `${n.conceptId}.why-note#${i + 1}`
    row(w, `${ref}.sentence`, 'sentence', n.sentence, { ru: n.ru, ky: n.ky }, `word: ${n.word}`)
    row(w, `${ref}.reason`, 'reason', undefined, n.reason)
    n.more.forEach((m, j) => row(w, `${ref}.more#${j + 1}`, 'more', m.de, { ru: m.ru, ky: m.ky }))
  })

  const li = add('listening', 'Listening')
  for (const l of data.listening) {
    row(li, `${l.id}.title`, 'title', l.title, undefined)
    l.lines.forEach((x, i) => row(li, `${l.id}#${i + 1}`, `line (${x.speaker})`, x.text, { ru: x.ru, ky: x.ky }))
    l.questions.forEach((q, i) => row(li, `${l.id}.q#${i + 1}`, 'question', q.q, undefined, opts(q.options, q.answer)))
  }

  const re = add('reading', 'Reading')
  for (const r of data.reading) {
    row(re, `${r.id}.title`, 'title', r.title, undefined)
    r.body.forEach((p, i) => row(re, `${r.id}#${i + 1}`, 'paragraph', p, undefined))
    r.gloss.forEach((x, i) => {
      row(re, `${r.id}.gloss#${i + 1}`, 'gloss', x.word, { ru: x.ru, ky: x.ky }, x.example)
      row(re, `${r.id}.gloss#${i + 1}.grammar`, 'gloss note', undefined, { ru: x.grammar, ky: x.grammarKy })
    })
    r.questions.forEach((q, i) => row(re, `${r.id}.q#${i + 1}`, 'question', q.q, undefined, opts(q.options, q.answer)))
  }

  const sp = add('speaking', 'Speaking')
  const s = data.speaking
  row(sp, `${s.id}.title`, 'title', s.title, { ru: s.titleRu, ky: s.titleKy })
  row(sp, `${s.id}.goal`, 'goal', undefined, s.goal)
  s.turns.forEach((t, i) => row(sp, `${s.id}.turn#${i + 1}`, 'turn', t.ai, { ru: t.aiRu, ky: t.aiKy }, `hints: ${t.hints.join(' / ')}`))

  const wr = add('writing', 'Writing')
  const t = data.writing
  row(wr, `${t.id}.title`, 'title', t.title, undefined, t.formal ? 'formal' : 'informal')
  row(wr, `${t.id}.situation`, 'situation', undefined, t.situation)
  row(wr, `${t.id}.model`, 'model answer', t.model, undefined, `min ${t.minWords} words`)
  t.mustInclude.forEach((m, i) => row(wr, `${t.id}.must#${i + 1}`, 'required element', m.label, undefined))
  t.tips.forEach((x, i) => row(wr, `${t.id}.tip#${i + 1}`, 'tip', undefined, x))

  const ex = add('exercises', 'Revision exercises')
  for (const e of data.exercises) {
    const body = e.type === 'order' ? `${e.prompt} [${(e.words ?? []).join(' | ')}]` : e.prompt
    const options = e.type === 'order' ? `answer: ${e.answer}` : opts(e.options ?? [], e.answer)
    row(ex, `${e.id}.prompt`, `${e.type}`, body, { ru: e.promptRu, ky: e.promptKy }, `${options}; concept ${e.concept ?? ''}`)
    row(ex, `${e.id}.why`, 'explanation', undefined, e.why)
  }

  const ft = add('final-test', 'Final test')
  for (const q of data.final.questions) {
    row(
      ft,
      `${q.id}.prompt`,
      q.skill ?? 'question',
      q.prompt,
      { ru: q.promptRu, ky: q.promptKy },
      `${opts(q.options, q.answer)}${q.concept ? '; concept ' + q.concept : ''}`,
    )
    row(ft, `${q.id}.why`, 'explanation', undefined, q.why)
  }

  // learner instructions exist only in Russian and Kyrgyz
  const ins = add('instructions', 'Learner instructions')
  for (const i of data.instructions) row(ins, i.id, `instruction (${i.scope})`, undefined, i.text)

  return { unit: unit.id, key: unit.key ?? '', title: unit.title, dimension, sections: sections.filter(x => x.rows.length > 0) }
}

export const fingerprintOf = (m: ReviewModel): string =>
  createHash('sha256')
    .update(JSON.stringify([m.unit, m.dimension, m.sections]))
    .digest('hex')
    .slice(0, 12)

export const reviewModel = (unitId: number, dimension: Dimension) => buildModel(collectUnit(unitId), dimension)

// ───────────────────────────────────── records and approval rules ─────────────────────────────────────
export const emptyRecord = (unit: number, title: string, dimension: Dimension): ReviewRecord => ({
  schema: 1,
  unit,
  title,
  dimension,
  status: 'pending',
  reviewer: { name: '', qualification: '' },
  reviewDate: '',
  reviewedFingerprint: '',
  findings: [],
})

const AI_NAME = /\b(claude|anthropic|chatgpt|gpt-?\d*|openai|gemini|copilot|assistant|bot|ai|llm|automated|generated)\b/i
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

export interface Evaluation {
  /** true when the record is a valid human approval of the CURRENT content */
  approved: boolean
  /** the record says approved, but the content changed after the review: the approval no longer applies */
  stale: boolean
  problems: string[]
}

/** Judges one record against the current fingerprint of its package. Pure; only a complete human record can pass. */
export function evaluateRecord(r: ReviewRecord, currentFingerprint: string): Evaluation {
  const problems: string[] = []
  if (!STATUSES.includes(r.status)) problems.push(`unknown status "${r.status}"`)
  const named = r.reviewer.name.trim() !== '' && r.reviewer.qualification.trim() !== ''
  if (r.status !== 'pending' && r.reviewer.name.trim() === '') problems.push('a review that has started needs a reviewer name')
  if (r.status === 'approved' || r.status === 'changes_requested') {
    if (!named) problems.push('reviewer name and qualification are required')
    if (!ISO_DATE.test(r.reviewDate) || Number.isNaN(Date.parse(r.reviewDate)))
      problems.push('a valid ISO review date (YYYY-MM-DD) is required')
    if (r.reviewedFingerprint === '') problems.push('the reviewed package fingerprint is required')
  }
  if (r.reviewer.name && AI_NAME.test(r.reviewer.name)) problems.push('the reviewer must be a person, not an AI or automated process')
  const open = r.findings.filter(f => f.status === 'open')
  if (r.status === 'approved' && open.some(f => f.severity === 'blocker' || f.severity === 'major'))
    problems.push('open blocker/major findings prevent approval')
  if (r.status === 'changes_requested' && open.length === 0) problems.push('changes_requested needs at least one open finding')
  const stale = r.status === 'approved' && r.reviewedFingerprint !== '' && r.reviewedFingerprint !== currentFingerprint
  if (stale) problems.push('the content changed after the review (fingerprint mismatch): the approval is void')
  return { approved: r.status === 'approved' && problems.length === 0, stale, problems }
}

/** Per dimension, independently: the approved dimensions of a unit. An approval of one dimension never implies another. */
export function approvedDimensions(records: ReviewRecord[], fingerprints: Record<Dimension, string>): Dimension[] {
  return DIMENSIONS.filter(d => {
    const r = records.find(x => x.dimension === d)
    return !!r && evaluateRecord(r, fingerprints[d]).approved
  })
}

// ───────────────────────────────────────── Markdown ─────────────────────────────────────────
const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ')
const md = (cols: string[]) => `| ${cols.map(cell).join(' | ')} |`

const DIM_INFO: Record<Dimension, { who: string; ask: string }> = {
  'de-cefr': {
    who: 'a qualified German teacher',
    ask: 'Is each German item genuinely CEFR A2 (not A1 with a label, not B1), natural German, and does it teach what the unit claims? Receptive words must not be required anywhere.',
  },
  'ru-localization': {
    who: 'a native Russian speaker',
    ask: 'Is each Russian text correct, natural, faithful to the German source and free of calques? Russian is reviewed on its own: do not use the Kyrgyz text.',
  },
  'ky-localization': {
    who: 'a native Kyrgyz speaker',
    ask: 'Is each Kyrgyz text correct, natural, faithful to the German source and independently written — NOT a copy or a translation of the Russian? Kyrgyz is reviewed on its own: the Russian text is deliberately not shown.',
  },
}

export function packageMarkdown(m: ReviewModel): string {
  const fp = fingerprintOf(m)
  const info = DIM_INFO[m.dimension]
  const text = m.dimension === 'de-cefr' ? 'German' : m.dimension === 'ru-localization' ? 'Russian' : 'Kyrgyz'
  const out: string[] = [
    `# Unit ${m.unit} — ${m.dimension} review package`,
    '',
    '<!-- GENERATED FILE — produced by `npm run review:system` from the shipped data. Do not edit by hand; edit the data and regenerate. -->',
    '',
    `**Unit:** ${m.unit} · \`${m.key}\` · *${m.title}* · **Dimension:** \`${m.dimension}\` · for ${info.who}.`,
    '**Status of the content:** AI-assisted draft, **not reviewed by any person**. This package records nothing: the decision columns are empty and the review record (`docs/review/a2/records/unit-' +
      String(m.unit).padStart(2, '0') +
      '.json`) starts as `pending`.',
    `**Your question:** ${info.ask}`,
    '**Package fingerprint:** `' +
      fp +
      '` — copy it into the record as `reviewedFingerprint`; if the content changes the fingerprint changes and an approval of an older fingerprint no longer counts.',
    '',
    'How to review: read each table; write findings as `{ref, severity, comment}` in the record (severity: blocker / major / minor / suggestion); set the status (`in_review`, `changes_requested`, `approved`); an approval needs your name, qualification, the date and the fingerprint above. See `docs/authoring/A2_HUMAN_REVIEW_SYSTEM.md`.',
  ]
  for (const s of m.sections) {
    out.push('', `## ${s.title}  (${s.rows.length} rows)`, '')
    if (m.dimension === 'de-cefr') {
      out.push(md(['Ref', 'Kind', 'German', 'Facts', 'A2? ✔ / ✘', 'Comment']), md(['---', '---', '---', '---', '---', '---']))
      for (const r of s.rows) out.push(md([r.ref, r.label, r.source, r.note, '', '']))
    } else {
      out.push(
        md(['Ref', 'Kind', 'German (source)', `${text} (under review)`, 'Facts', 'OK? ✔ / ✘', 'Correction / comment']),
        md(['---', '---', '---', '---', '---', '---', '---']),
      )
      for (const r of s.rows) out.push(md([r.ref, r.label, r.source, r.value, r.note, '', '']))
    }
  }
  out.push('', '---', '', '**Package fingerprint: `' + fp + '`**', '')
  return out.join('\n')
}

export const unitSlug = (u: number) => `unit-${String(u).padStart(2, '0')}`
export const PACKAGE_DIR = 'docs/review/a2/packages'
export const RECORD_DIR = 'docs/review/a2/records'
export const packagePath = (u: number, d: Dimension) => `${PACKAGE_DIR}/${unitSlug(u)}-${d}.md`
export const recordPath = (u: number) => `${RECORD_DIR}/${unitSlug(u)}.json`

/** The records file of a unit: one record per dimension (initial state: all pending, empty reviewer). */
export const initialRecords = (u: number): ReviewRecord[] => {
  const title = unitById(u)!.title
  return DIMENSIONS.map(d => emptyRecord(u, title, d))
}
