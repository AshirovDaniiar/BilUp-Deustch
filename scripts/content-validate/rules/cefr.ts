// CEFR rules (Stage 6A). HONEST scope: no program can establish that German text is "genuinely A2". So the rules are split into
//
//   RELIABLE (errors)   — the declared level is consistent with the unit that holds the item, and nothing is declared above A2
//                         inside an A2 unit. These inspect structure and metadata, not language.
//   HEURISTIC (review)  — measurable signals that often indicate B1+ material: text length, sentence length, and a table of German
//                         constructions that curricula place at B1 or above. A hit means "a CEFR reviewer must look", never "wrong";
//                         absence of hits means nothing. They are reported as `review`, never as a pass.
//   SIGN-OFF            — an A2 unit with content needs a recorded human CEFR review. Without it: a review flag while authoring, an error
//                         when the level is released (or the run is a release run).
//
// There is NO lexical check: the repository holds no authoritative CEFR word list and none is invented here. Vocabulary level is
// therefore covered by the sign-off only.
import type { LanguageLevel } from '../../../src/data/types'
import type { Ctx } from '../context'
import { LISTENING_WORDS_MAX, READING_WORDS, SENTENCE_WORDS_MAX, B1_PLUS_PATTERNS, profileOf, type Pattern } from '../profile'

// Re-exported unchanged: the A2 calibration (tests import these names from here).
export { B1_PLUS_PATTERNS, LISTENING_WORDS_MAX, READING_WORDS, SENTENCE_WORDS_MAX, type Pattern }

const ORDER: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1']
const rank = (l: LanguageLevel) => ORDER.indexOf(l)

const words = (s: string) => s.split(/\s+/).filter(Boolean).length
const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).filter(x => x.trim() !== '')

interface TextItem {
  where: string
  unit: number
  texts: { field: string; text: string }[]
}

export function cefrRules(ctx: Ctx): void {
  const { bundle } = ctx

  // ───── RELIABLE: declared level vs the unit that holds the item ─────
  const declared = (collection: string, id: string, unit: number, level: LanguageLevel | undefined) => {
    const owner = ctx.levelOfUnit(unit)
    if (!ctx.strict(owner) || level === undefined) return
    if (rank(level) > rank(owner as LanguageLevel))
      ctx.err(
        'cefr-too-advanced-tag',
        `${collection}:${id}`,
        `declared ${level} but it belongs to ${owner} unit ${unit}: material above ${owner} is not ${owner} content`,
      )
    else if (level !== owner)
      ctx.err('cefr-level-mismatch', `${collection}:${id}`, `declared ${level} but it belongs to ${owner} unit ${unit}`)
  }
  for (const g of bundle.grammar) declared('grammar', g.id, g.unit, g.level)
  for (const l of bundle.listening) declared('listening', l.id, l.unit, l.level)
  for (const r of bundle.reading) declared('reading', r.id, r.unit, r.level)
  for (const w of bundle.writing) declared('writing', w.id, w.unit, w.level)
  for (const s of bundle.speaking) {
    const owner = ctx.levelOfScenario(s.id)
    if (ctx.strict(owner) && s.level !== owner)
      ctx.err(
        rank(s.level) > rank(owner as LanguageLevel) ? 'cefr-too-advanced-tag' : 'cefr-level-mismatch',
        `speaking:${s.id}`,
        `declared ${s.level} but it belongs to the ${owner} course module`,
      )
  }
  for (const u of bundle.units) {
    const owner = ctx.levelOfUnit(u.id)
    if (owner !== undefined && u.level !== owner)
      ctx.err('cefr-unit-level', `units:${u.id}`, `unit ${u.id} lies in the ${owner} id range but declares ${u.level}`)
  }

  // ───── HEURISTIC: measurable signals → review flags ─────
  const items: TextItem[] = []
  for (const r of bundle.reading)
    items.push({
      where: `reading:${r.id}`,
      unit: r.unit,
      texts: (Array.isArray(r.body) ? r.body : []).map((t, i) => ({ field: `body[${i}]`, text: t })),
    })
  for (const l of bundle.listening)
    items.push({
      where: `listening:${l.id}`,
      unit: l.unit,
      texts: (l.lines ?? []).map((x, i) => ({ field: `lines[${i}].text`, text: x.text })),
    })
  for (const w of bundle.writing) items.push({ where: `writing:${w.id}`, unit: w.unit, texts: [{ field: 'model', text: w.model ?? '' }] })
  for (const g of bundle.grammar)
    items.push({
      where: `grammar:${g.id}`,
      unit: g.unit,
      texts: [
        ...(g.examples ?? []).map((x, i) => ({ field: `examples[${i}].de`, text: x.de })),
        ...(g.reallife ?? []).map((x, i) => ({ field: `reallife[${i}].de`, text: x.de })),
        ...(g.dialogue ?? []).map((x, i) => ({ field: `dialogue[${i}].text`, text: x.text })),
      ],
    })
  for (const v of bundle.vocabulary)
    items.push({ where: `vocabulary:${v.id}`, unit: v.unit, texts: [{ field: 'example', text: v.example ?? '' }] })
  for (const e of bundle.exercises)
    items.push({
      where: `exercises:${e.id}`,
      unit: e.unit,
      texts: [
        { field: 'prompt', text: e.prompt ?? '' },
        { field: 'answer', text: e.answer ?? '' },
      ],
    })
  for (const ft of bundle.finalTests ?? [])
    for (const q of ft.questions)
      items.push({ where: `finalTests:unit${ft.unit}/${q.id}`, unit: ft.unit, texts: [{ field: 'prompt', text: q.prompt }] })

  for (const it of items) {
    const itemLevel = ctx.levelOfUnit(it.unit)
    if (!ctx.strict(itemLevel)) continue
    const prof = profileOf(itemLevel)
    const hit = new Set<string>()
    for (const { field, text } of it.texts) {
      const lower = text.toLowerCase()
      for (const p of prof.patterns) {
        if (hit.has(p.id) || !p.re.test(p.caseSensitive ? text : lower)) continue
        hit.add(p.id)
        ctx.add('review', `cefr-structure-${p.id}`, `${it.where}#${field}`, prof.patternMessage(p))
      }
      for (const s of prof.textChecks === 'generic' ? sentences(text) : []) {
        const n = words(s)
        if (n > SENTENCE_WORDS_MAX)
          ctx.add(
            'review',
            'cefr-sentence-length',
            `${it.where}#${field}`,
            `a sentence of ${n} words (> ${SENTENCE_WORDS_MAX}): long for ${prof.label} — review`,
          )
      }
    }
  }
  for (const r of bundle.reading) {
    if (!ctx.strict(ctx.levelOfUnit(r.unit)) || profileOf(ctx.levelOfUnit(r.unit)).textChecks !== 'generic') continue
    const n = (Array.isArray(r.body) ? r.body : []).reduce((a, p) => a + words(p), 0)
    if (n < READING_WORDS.min || n > READING_WORDS.max)
      ctx.add(
        'review',
        'cefr-text-length',
        `reading:${r.id}`,
        `${n} words (A2 reading texts usually have ${READING_WORDS.min}–${READING_WORDS.max}) — review`,
      )
  }
  for (const l of bundle.listening) {
    if (!ctx.strict(ctx.levelOfUnit(l.unit)) || profileOf(ctx.levelOfUnit(l.unit)).textChecks !== 'generic') continue
    const n = (l.lines ?? []).reduce((a, x) => a + words(x.text), 0)
    if (n > LISTENING_WORDS_MAX)
      ctx.add('review', 'cefr-text-length', `listening:${l.id}`, `${n} words of dialogue (> ${LISTENING_WORDS_MAX}) — review`)
  }

  // ───── SIGN-OFF: a human must confirm the level of every unit that has content ─────
  const stricts = bundle.units.map(u => u.id).filter(id => ctx.strict(ctx.levelOfUnit(id)))
  const withContent = new Set<number>()
  const touch = (unit: number) => withContent.add(unit)
  for (const x of [...bundle.vocabulary, ...bundle.grammar, ...bundle.exercises, ...bundle.listening, ...bundle.reading, ...bundle.writing])
    touch(x.unit)
  for (const id of stricts) {
    if (!withContent.has(id)) continue
    const level = ctx.levelOfUnit(id) as LanguageLevel
    if (bundle.reviews?.[id]?.cefr === true) continue
    ctx.add(
      ctx.gateReview(level, 'review'), // beta: an explicit sign-off flag; released: a blocking error
      'cefr-signoff-missing',
      `units:${id}`,
      `unit ${id} (${level}) has content but no recorded CEFR review — automated checks cannot establish the level`,
    )
  }
  ctx.add(
    'info',
    'cefr-limits',
    'cefr',
    'CEFR is checked structurally (declared level vs unit) and by heuristics that raise review flags (length, sentence length, B1+ constructions). There is no lexical check; vocabulary and text difficulty need a recorded human review.',
  )
}
