// Content-validation SKELETON (P0). Checks id uniqueness and reference integrity of the CURRENT src/data only.
// It is not the P3 content-validate CLI (04 §6): no manifests, no pack format, no release gates, no provenance.
import type {
  Exercise,
  GrammarConcept,
  L10n,
  LearningUnit,
  ListeningExercise,
  ReadingText,
  RealLifeTopic,
  SpeakingScenario,
  TestDef,
  VocabularyItem,
  WritingTask,
} from '../../src/data/types'

export interface ContentBundle {
  units: LearningUnit[]
  vocabulary: VocabularyItem[]
  grammar: GrammarConcept[]
  exercises: Exercise[]
  listening: ListeningExercise[]
  reading: ReadingText[]
  writing: WritingTask[]
  speaking: SpeakingScenario[]
  realLife: RealLifeTopic[]
  tests: TestDef[]
}

export interface Issue {
  severity: 'error' | 'info'
  rule: string
  where: string
  message: string
}

export function validateContent(c: ContentBundle): Issue[] {
  const issues: Issue[] = []
  const err = (rule: string, where: string, message: string) => issues.push({ severity: 'error', rule, where, message })

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
    for (const r of v.related) if (!vocabIds.has(r)) err('ref-vocab', `vocabulary:${v.id}`, `related id "${r}" does not exist`)
  }
  for (const u of c.units)
    for (const g of u.grammarIds) if (!grammarIds.has(g)) err('ref-grammar', `units:${u.id}`, `grammar id "${g}" does not exist`)
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
    qs.forEach((q, i) => {
      if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length)
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

  // Informational only: how much L10n content has no Kyrgyz text (current behaviour = silent Russian fallback, 02 §5).
  const l10ns: L10n[] = []
  for (const g of c.grammar) l10ns.push(g.title, g.summary, g.discover, g.why, ...g.when)
  for (const e of c.exercises) l10ns.push(e.why)
  const missingKy = l10ns.filter(x => !x.ky).length
  issues.push({
    severity: 'info',
    rule: 'l10n-coverage',
    where: 'grammar+exercises',
    message: `${missingKy}/${l10ns.length} L10n strings have no Kyrgyz text (would silently fall back to Russian today)`,
  })
  return issues
}
