// B1 rules (Stage 2C): the dedicated B1 validation profile. It runs ON TOP of the generic strict-level rules (identity, schema, localisation,
// answers, references, metadata, provenance), which already apply to B1 unchanged, and adds what the approved curriculum v2 demands of B1:
//
//   vocabulary   38–42 items per unit; lemma reuse across levels and units is allowed, duplicates within a unit are not
//   grammar      allocation against the curriculum (counts, load, roles; ids only once the approval is recorded); productive vs receptive
//   texts        reading / listening length, sentence length, speaking turns and writing length per unit band (profile.ts)
//   components   learning objectives (de + ru + ky), 2 readings / 2 listenings, final-test composition, strands, micro-tasks, revision sets
//   parity       RU/KY structural parity of the B1 text pairs (script, numbers, placeholders, quoted German, size)
//
// SEVERITY: structural facts that are plainly wrong (a duplicated lemma, a reference that does not exist, a receptive-only form required in a
// production item) are ALWAYS errors. Targets of the curriculum (counts, bands, strands) are warnings while B1 is `planned` / being authored and
// become errors when B1 is beta / released or in release mode (ctx.gate), exactly like the unit minimums.
// While the owner's approval is not recorded (b1Curriculum.approved === false) no permanent identity is enforced: the allocation is checked
// structurally and a single review flag says so.
//
// Every message names WHAT is wrong, WHERE, the expected value, and "Fix:" what to do.
// A bundle with no B1 content yields no issues at all (A1/A2 validation is unchanged).
import type { B1Construction, B1Text, B1UnitMeta } from '../../../src/data/b1/meta'
import type { LearningUnit, VocabularyItem } from '../../../src/data/types'
import { lemmaKeys } from '../b1/lemma'
import type { B1Curriculum, B1UnitSpec } from '../b1/types'
import type { Ctx } from '../context'
import { b1BandOf } from '../profile'

const LEVEL = 'B1' as const
export const B1_VOCABULARY_TARGET = { min: 38, max: 42 } as const
const OBJECTIVE_STARTS = 'Ich kann'

const words = (s: string) => s.split(/\s+/).filter(Boolean).length
const sentenceList = (s: string) => s.split(/(?<=[.!?])\s+/).filter(x => x.trim() !== '')
const nonEmpty = (s: unknown): s is string => typeof s === 'string' && s.trim() !== ''
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const mentions = (text: string, form: string) =>
  new RegExp(`(^|[^\\p{L}])${esc(form.toLowerCase())}($|[^\\p{L}])`, 'u').test(text.toLowerCase())
const p95 = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b)
  return s.length === 0 ? 0 : s[Math.min(s.length - 1, Math.ceil(0.95 * s.length) - 1)]
}
const cyr = (s: string) => /[Ѐ-ӿ]/.test(s)
const letters = (s: string) => (s.match(/\p{L}/gu) ?? []).length

export function b1Rules(ctx: Ctx): void {
  const { bundle } = ctx
  if (!bundle.course?.some(l => l.id === LEVEL)) return
  // The legacy B1 units receive the full profile; curriculum-v2 vocabulary gets the same within-unit duplicate check.
  const legacyRange = bundle.course?.find(l => l.id === LEVEL)?.unitIdRange
  const owned = (unit: number) => ctx.levelOfUnit(unit) === LEVEL && !!legacyRange && unit >= legacyRange[0] && unit <= legacyRange[1]
  const ownsVocabulary = (unit: number) =>
    owned(unit) || (ctx.levelOfUnit(unit) === LEVEL && unit >= 301 && unit <= 336)
  const b1Units: LearningUnit[] = bundle.units.filter(u => owned(u.id))
  const metas = (bundle.b1Meta ?? []).slice()
  const hasItems =
    bundle.vocabulary.some(v => owned(v.unit)) ||
    bundle.grammar.some(g => owned(g.unit)) ||
    bundle.reading.some(r => owned(r.unit)) ||
    bundle.listening.some(l => owned(l.unit)) ||
    bundle.exercises.some(e => owned(e.unit)) ||
    bundle.writing.some(w => owned(w.unit))
  if (b1Units.length === 0 && metas.length === 0 && !hasItems) return

  const soft = ctx.gate(LEVEL, 'warning')
  const fail = (
    rule: string,
    where: string,
    what: string,
    fix: string,
    severity: 'error' | 'warning' | 'review' = soft as 'error' | 'warning',
  ) => ctx.add(severity, rule, where, `${what}. Fix: ${fix}`)
  const hard = (rule: string, where: string, what: string, fix: string) => fail(rule, where, what, fix, 'error')

  const cur = bundle.b1Curriculum
  const approved = cur?.approved === true
  const specOf = (unit: number): B1UnitSpec | undefined => cur?.units.find(s => s.unit === unit)
  const metaOf = new Map<number, B1UnitMeta>()
  for (const m of metas) {
    if (metaOf.has(m.unit))
      hard('b1-meta-duplicate', `b1Meta:${m.unit}`, `unit ${m.unit} has two metadata entries`, 'keep one entry per unit')
    metaOf.set(m.unit, m)
    if (!owned(m.unit))
      hard(
        'b1-meta-orphan',
        `b1Meta:${m.unit}`,
        `metadata names unit ${m.unit}, which is not a B1 unit`,
        'use a B1 unit id (21–32) that exists in the units list',
      )
    else if (!b1Units.some(u => u.id === m.unit))
      hard(
        'b1-meta-orphan',
        `b1Meta:${m.unit}`,
        `metadata names unit ${m.unit}, which is not authored`,
        'author the unit or remove its metadata',
      )
  }

  if (!approved && (b1Units.length > 0 || hasItems))
    ctx.add(
      'review',
      'b1-curriculum-unapproved',
      LEVEL,
      'the owner approval of B1 curriculum v2 is not recorded (scripts/content-validate/b1/approval.ts): grammar allocation is checked structurally only',
    )

  checkDecisions(ctx, { hard, curriculum: cur, authored: b1Units.length > 0 })
  checkLevelTest(ctx, { hard, authored: b1Units.length > 0 })

  // ───────────── shared lookups ─────────────
  const vocabUnit = new Map(bundle.vocabulary.map(v => [v.id, v.unit]))
  const grammarById = new Map(bundle.grammar.map(g => [g.id, g]))

  // ───────────── vocabulary: two unit families ─────────────
  // Legacy Units 21–32 keep the original contract: a NEW B1 word must not repeat an A1/A2 lemma unless an allowance explains
  // the new sense, and a lemma may not repeat anywhere in legacy B1. The comparison corpus is the legacy A1/A2 range
  // (A1 1–10, A2 11–20) the contract was authored against; the approved A1 102–138 and A2 201–243 vocabulary integrations
  // are new curriculum material and are covered by their own tests, so they must not re-open legacy B1 content.
  // Curriculum-v2 Units 301–336 follow the approved source policy: reuse across units and levels is allowed; only a duplicate
  // inside one unit is rejected. The 38–42 count target is applied only to the legacy units (the per-unit loop below uses `b1Units`).
  const isLegacyA1A2 = (unit: number) => {
    const level = ctx.levelOfUnit(unit)
    return (level === 'A1' && unit >= 1 && unit <= 10) || (level === 'A2' && unit >= 11 && unit <= 20)
  }
  const earlier = new Map<string, VocabularyItem[]>()
  for (const v of bundle.vocabulary) {
    if (!isLegacyA1A2(v.unit)) continue
    for (const k of lemmaKeys(v.de)) earlier.set(k, [...(earlier.get(k) ?? []), v])
  }
  const allowances = metas.flatMap(m => (m.vocabularyAllowances ?? []).map(a => ({ ...a, unit: m.unit })))
  const used = new Set<string>()
  const legacyFirst = new Map<string, VocabularyItem>()
  const v2First = new Map<string, VocabularyItem>()
  for (const v of bundle.vocabulary) {
    const isLegacy = owned(v.unit)
    const isV2 = !isLegacy && ownsVocabulary(v.unit)
    if (!isLegacy && !isV2) continue
    const at = `vocabulary:${v.id}`
    const keys = lemmaKeys(v.de)

    if (isLegacy) {
      const hits = [...new Map(keys.flatMap(k => earlier.get(k) ?? []).map(h => [h.id, h])).values()]
      if (hits.length > 0) {
        const allow = allowances.find(a => a.id === v.id && hits.some(h => h.id === a.earlierId))
        const list = hits.map(h => `${h.id} "${h.de}" (unit ${h.unit}, ${ctx.levelOfUnit(h.unit)})`).join(', ')
        if (!allow)
          hard(
            'b1-vocab-repeats-earlier-level',
            at,
            `"${v.de}" is listed as NEW B1 vocabulary but is already taught as ${list}`,
            "remove it from the unit's new words (revise it as a recycled item instead), or - if the B1 sense is genuinely different - add {id, earlierId, note} to the unit's vocabularyAllowances",
          )
        else {
          used.add(`${allow.id}|${allow.earlierId}`)
          if (!nonEmpty(allow.note) || allow.note.trim().length < 10)
            hard(
              'b1-vocab-allowance-note',
              at,
              `the allowance for "${v.de}" has no explanation of the new sense`,
              'write a note (≥ 10 characters) saying how the B1 meaning differs',
            )
        }
      }
      for (const k of keys) {
        const first = legacyFirst.get(k)
        if (first && first.id !== v.id)
          hard(
            'b1-vocab-duplicate-in-level',
            at,
            `"${v.de}" repeats ${first.id} "${first.de}" (unit ${first.unit}) within legacy B1`,
            'keep one entry; list later uses as recycled items',
          )
        else legacyFirst.set(k, v)
      }
      continue
    }

    for (const k of keys) {
      const duplicateKey = v.pos === 'noun' && v.article ? `${k}\u0000${v.article}` : k
      const unitKey = `${v.unit}\u0000${duplicateKey}`
      const first = v2First.get(unitKey)
      if (first && first.id !== v.id)
        hard(
          'b1-vocab-duplicate-in-level',
          at,
          `"${v.de}" repeats ${first.id} "${first.de}" in the same unit (${v.unit})`,
          'keep one entry in this unit; repeats in other units are allowed',
        )
      else v2First.set(unitKey, v)
    }
  }
  for (const a of allowances)
    if (!used.has(`${a.id}|${a.earlierId}`))
      fail(
        'b1-vocab-allowance-unused',
        `b1Meta:${a.unit}`,
        `the allowance {${a.id}, ${a.earlierId}} does not match any repeated lemma`,
        'remove the allowance',
      )

  // ───────────── concept totals ─────────────
  const b1Concepts = bundle.grammar.filter(g => owned(g.unit))
  if (cur && b1Concepts.length > 29)
    fail(
      'b1-allocation-total',
      LEVEL,
      `B1 defines ${b1Concepts.length} grammar concepts; the curriculum target is 29`,
      'merge or remove concepts, or record an approved curriculum change',
    )

  // ───────────── per unit ─────────────
  for (const unit of b1Units) {
    const u = unit.id
    const at = `units:${u}`
    const band = b1BandOf(u)
    const spec = specOf(u)
    const meta = metaOf.get(u)
    const vocab = bundle.vocabulary.filter(v => v.unit === u)
    const readings = bundle.reading.filter(r => r.unit === u)
    const listenings = bundle.listening.filter(l => l.unit === u)
    const grammar = bundle.grammar.filter(g => g.unit === u)
    const writing = bundle.writing.filter(w => w.unit === u)
    const handExercises = bundle.exercises.filter(e => e.unit === u && e.type !== 'article')
    const final = (bundle.finalTests ?? []).find(f => f.unit === u)

    // ── vocabulary count
    if (vocab.length < B1_VOCABULARY_TARGET.min || vocab.length > B1_VOCABULARY_TARGET.max)
      fail(
        'b1-vocab-count',
        at,
        `unit ${u} has ${vocab.length} new vocabulary items; the B1 target is ${B1_VOCABULARY_TARGET.min}–${B1_VOCABULARY_TARGET.max}`,
        vocab.length < B1_VOCABULARY_TARGET.min
          ? `add ${B1_VOCABULARY_TARGET.min - vocab.length} or more words`
          : `remove ${vocab.length - B1_VOCABULARY_TARGET.max} or more words (or move them to the receptive list)`,
      )

    // ── component counts
    if (readings.length !== 2)
      fail(
        'b1-reading-count',
        at,
        `unit ${u} has ${readings.length} reading texts; B1 units have 2`,
        'author exactly 2 reading texts' + (u === 32 ? ' (one long, one short)' : ''),
      )
    if (listenings.length !== 2)
      fail(
        'b1-listening-count',
        at,
        `unit ${u} has ${listenings.length} listening texts; B1 units have 2`,
        'author exactly 2 listening texts',
      )
    if (handExercises.length > 10)
      fail(
        'b1-exercise-count',
        at,
        `unit ${u} has ${handExercises.length} handwritten exercises; the B1 standard is 8–10`,
        'remove the surplus exercises',
      )

    // ── texts per band
    if (band) {
      const wc = (body: string[]) => (Array.isArray(body) ? body : []).reduce((a, p) => a + words(p), 0)
      if (band.readingLong && band.readingShort && readings.length === 2) {
        const sorted = readings.map(r => ({ id: r.id, n: wc(r.body) })).sort((a, b) => b.n - a.n)
        const [lo, hi] = band.readingLong
        const [slo, shi] = band.readingShort
        if (sorted[0].n < lo || sorted[0].n > hi)
          fail(
            'b1-reading-length',
            `reading:${sorted[0].id}`,
            `the long reading text of unit ${u} has ${sorted[0].n} words; expected ${lo}–${hi}`,
            'adjust the length',
          )
        if (sorted[1].n < slo || sorted[1].n > shi)
          fail(
            'b1-reading-length',
            `reading:${sorted[1].id}`,
            `the short reading text of unit ${u} has ${sorted[1].n} words; expected ${slo}–${shi}`,
            'adjust the length',
          )
      } else
        for (const r of readings) {
          const n = wc(r.body)
          if (n < band.reading[0] || n > band.reading[1])
            fail(
              'b1-reading-length',
              `reading:${r.id}`,
              `reading text has ${n} words; units ${band.units[0]}–${band.units[1]} target ${band.reading[0]}–${band.reading[1]}`,
              n < band.reading[0] ? `add about ${band.reading[0] - n} words` : `cut about ${n - band.reading[1]} words`,
            )
        }
      for (const l of listenings) {
        const n = (l.lines ?? []).reduce((a, x) => a + words(x.text), 0)
        if (n < band.listening[0] || n > band.listening[1])
          fail(
            'b1-listening-length',
            `listening:${l.id}`,
            `listening text has ${n} words; units ${band.units[0]}–${band.units[1]} target ${band.listening[0]}–${band.listening[1]}`,
            n < band.listening[0] ? `add about ${band.listening[0] - n} words` : `cut about ${n - band.listening[1]} words`,
          )
      }
      const lens = [
        ...readings.flatMap(r => (r.body ?? []).flatMap(sentenceList)),
        ...listenings.flatMap(l => (l.lines ?? []).flatMap(x => sentenceList(x.text))),
      ].map(words)
      if (lens.length > 0) {
        const mx = Math.max(...lens)
        const q = p95(lens)
        if (mx > band.sentenceMax)
          fail(
            'b1-sentence-length',
            at,
            `the longest sentence of unit ${u} has ${mx} words; the limit is ${band.sentenceMax}`,
            'split long sentences',
          )
        if (q > band.sentenceP95)
          fail(
            'b1-sentence-length',
            at,
            `the 95th-percentile sentence length of unit ${u} is ${q} words; the limit is ${band.sentenceP95}`,
            'shorten the typical sentence',
          )
      }
      const sid = bundle.unitSpeaking?.[LEVEL]?.[u - 21]
      const sc = sid ? bundle.speaking.find(s => s.id === sid) : undefined
      if (!sc) fail('b1-speaking-missing', at, `unit ${u} has no speaking scenario assigned`, 'assign a scenario in unitSpeaking')
      else if (sc.turns.length < band.speakingTurns[0] || sc.turns.length > band.speakingTurns[1])
        fail(
          'b1-speaking-turns',
          `speaking:${sc.id}`,
          `the scenario has ${sc.turns.length} turns; unit ${u} targets ${band.speakingTurns[0] === band.speakingTurns[1] ? band.speakingTurns[0] : `${band.speakingTurns[0]}–${band.speakingTurns[1]}`}`,
          'add or remove turns',
        )
      const microIds = new Set((meta?.microTasks ?? []).map(t => t.taskId))
      const mains = writing.filter(w => !microIds.has(w.id))
      for (const w of mains)
        (w.mustInclude ?? []).forEach((m, i) => {
          if (!nonEmpty(m.explain?.ru) || !nonEmpty(m.explain?.ky))
            fail(
              'b1-checklist-localized',
              `writing:${w.id}#mustInclude[${i}]`,
              `the checklist item "${m.label}" has no explanation in both Russian and Kyrgyz (the German label alone is not understood by every learner)`,
              'add `explain: { ru, ky }` to the item',
            )
        })
      if (mains.length === 0)
        fail('b1-writing-missing', at, `unit ${u} has no main writing task`, 'author a writing task (micro-tasks do not count)')
      for (const w of mains) {
        const lo = w.formal ? band.formalMin : band.writing[0]
        if (w.minWords < lo || w.minWords > band.writing[1])
          fail(
            'b1-writing-length',
            `writing:${w.id}`,
            `minWords is ${w.minWords}; unit ${u} targets ${lo}–${band.writing[1]}${w.formal ? ' (formal)' : ''}`,
            `set minWords between ${lo} and ${band.writing[1]}`,
          )
      }
    }

    // ── final-test composition
    if (final) {
      const qs = final.questions
      const n = (s: string) => qs.filter(q => q.skill === s).length
      const [g, v, r, l] = [n('grammar'), n('vocabulary'), n('reading'), n('listening')]
      const okListening = g === 6 && v === 3 && r === 4 && l === 2
      const okNoListening = g === 8 && v === 3 && r === 4 && l === 0
      if (qs.length === 15 && !okListening && !okNoListening)
        fail(
          'b1-final-composition',
          `finalTests:unit${u}`,
          `the unit test has grammar ${g} / vocabulary ${v} / reading ${r} / listening ${l}; expected 6/3/4/2 (or 8/3/4/0 while listening is not device-verified)`,
          'rebalance the 15 questions',
        )
      const production = qs.filter(q => q.skill === 'grammar' && /___/.test(q.prompt)).length
      if (production < 2)
        fail(
          'b1-final-production',
          `finalTests:unit${u}`,
          `only ${production} grammar items ask the learner to complete a sentence (___); at least 2 are required`,
          'turn grammar items into gap-fill items',
        )
      const unitOfConcept = (id: string | undefined) => (id ? grammarById.get(id)?.unit : undefined)
      const recycled = qs.filter(q => (unitOfConcept(q.concept) ?? u) < u)
      const fromA2 = recycled.filter(q => {
        const cu = unitOfConcept(q.concept)
        return cu !== undefined && cu >= 11 && cu <= 20
      })
      if (recycled.length < 2)
        fail(
          'b1-final-recycling',
          `finalTests:unit${u}`,
          `${recycled.length} questions recycle earlier concepts (↻); at least 2 are required`,
          "add questions whose `concept` is an earlier unit's concept",
        )
      else if (u <= 24 && fromA2.length < 1)
        fail(
          'b1-final-recycling',
          `finalTests:unit${u}`,
          `no recycled question comes from A2; Units 21–24 need at least 1`,
          'add a question on an A2 concept',
        )
    }

    // ── grammar allocation
    const mc = meta?.concepts ?? []
    if (spec) {
      if (grammar.length !== spec.concepts.length)
        fail(
          'b1-allocation-count',
          at,
          `unit ${u} has ${grammar.length} grammar concepts; the curriculum allocates ${spec.concepts.length}`,
          grammar.length < spec.concepts.length ? 'add the missing concept' : 'remove or move the surplus concept',
        )
      if (mc.length > 0) {
        if (approved) {
          const want = new Set(spec.concepts.map(c => c.id))
          for (const c of mc)
            if (!want.has(c.conceptId))
              hard(
                'b1-allocation-id',
                `grammar:${c.conceptId}`,
                `concept "${c.conceptId}" is not in the approved allocation of unit ${u}`,
                `use one of: ${[...want].join(', ')}`,
              )
          for (const s of spec.concepts) {
            const got = mc.find(c => c.conceptId === s.id)
            if (got && s.expertReview)
              ctx.add(
                'review',
                'b1-expert-review-pending',
                `grammar:${got.conceptId}`,
                `the classification ${s.proficiency} of "${got.conceptId}" awaits independent expert (CEFR) verification (${s.expertReview.decision}): ${s.expertReview.note}. The owner approved the product design; this is not an official CEFR approval`,
              )
            if (!got)
              hard(
                'b1-allocation-missing',
                at,
                `the approved concept "${s.id}" is missing from unit ${u}`,
                'author it and declare it in the unit metadata',
              )
            else if (got.proficiency !== s.proficiency || got.load !== s.load || got.role !== s.role)
              hard(
                'b1-allocation-classification',
                `grammar:${got.conceptId}`,
                `declared ${got.proficiency}/${got.load}/${got.role} but the approved allocation says ${s.proficiency}/${s.load}/${s.role}`,
                'correct the metadata or record an approved curriculum change',
              )
            else if (s.listCap !== undefined && (got.closedList?.length ?? 0) > s.listCap)
              fail(
                'b1-closed-list-size',
                `grammar:${got.conceptId}`,
                `the closed list has ${got.closedList!.length} entries; the cap is ${s.listCap}`,
                'shorten the list',
              )
          }
        } else {
          const sig = (xs: readonly { proficiency: string; load: string; role: string }[]) =>
            xs
              .map(x => `${x.proficiency}/${x.load}/${x.role}`)
              .sort()
              .join(' ')
          if (sig(mc) !== sig(spec.concepts))
            ctx.add(
              'review',
              'b1-allocation-provisional-diff',
              at,
              `declared classification [${sig(mc)}] differs from the provisional allocation [${sig(spec.concepts)}] (not enforced until the approval is recorded): the owner/reviewer must decide`,
            )
        }
      }
    }
    if (mc.filter(c => c.load === 'H').length >= 2)
      fail(
        'b1-allocation-overload',
        at,
        `unit ${u} combines ${mc.filter(c => c.load === 'H').length} paradigm-heavy (H) concepts`,
        'move one H concept to another unit',
      )
    if (u === 32 && mc.some(c => c.role === 'new'))
      hard(
        'b1-unit32-new-grammar',
        at,
        'Unit 32 declares a NEW grammar concept; Unit 32 is consolidation and exam preparation with no new grammar system',
        "declare its concepts as role 'revision'",
      )

    // ── metadata required from here on
    if (!meta) {
      fail(
        'b1-meta-missing',
        at,
        `unit ${u} has no B1 metadata (objectives, classification, strands)`,
        'add a B1UnitMeta entry for the unit (src/data/b1/meta.ts)',
      )
      continue
    }
    checkMeta(ctx, { meta, unit: u, spec, grammar: grammar.map(g => g.id), writing: writing.map(w => w.id), fail, hard })

    // ── spaced revision
    checkRevision({ meta, unit: u, spec, vocabUnit, fail, hard })
  }

  // ───────────── productive vs receptive ─────────────
  checkReceptive(ctx, { metas, hard, owned })

  // ───────────── RU/KY parity ─────────────
  checkParity(ctx, { fail, owned, metas })
}

type Fail = (rule: string, where: string, what: string, fix: string, severity?: 'error' | 'warning' | 'review') => void
type Hard = (rule: string, where: string, what: string, fix: string) => void

// ───────────────────────── metadata ─────────────────────────
function textProblems(t: B1Text | undefined): string[] {
  if (!t || typeof t !== 'object') return ['missing']
  const out: string[] = []
  for (const k of ['de', 'ru', 'ky'] as const) if (!nonEmpty(t[k])) out.push(`${k} is empty`)
  if (nonEmpty(t.ru) && nonEmpty(t.ky) && t.ru.trim() === t.ky.trim()) out.push('Kyrgyz is a copy of the Russian text')
  return out
}

/**
 * The structure of the authored indicative level assessment (P1 remediation, audit §9 item 3: "add validator rules for its structure"). These are STRUCTURAL guarantees of the form b1-level-v2, not
 * a judgement of its quality: the definition size equals the number of items; every item is well-formed; at least 3 word-order items; every grammar concept of the level is examined by at least one item;
 * reading passages have at least 80 words; the listening note exists whenever no listening item does; no certificate / exam-board wording.
 */
function checkLevelTest(ctx: Ctx, a: { hard: Hard; authored: boolean }): void {
  const lt = ctx.bundle.b1LevelTest
  const def = ctx.bundle.tests.find(t => t.kind === 'level' && t.level === LEVEL)
  // checked only for the complete B1 course (a level test definition exists); a missing definition is reported by `unit-minimum`
  if (!a.authored || lt === undefined || def === undefined) return
  const Q = lt.questions
  const at = (id: string) => `tests:${def?.id ?? 'level-b1'}:${id}`
  if (def.size !== Q.length)
    a.hard(
      'b1-level-test',
      `tests:${def.id}`,
      `the definition says ${def.size} items but ${Q.length} are authored`,
      'make the size equal to the number of items',
    )
  if (new Set(Q.map(q => q.id)).size !== Q.length) a.hard('b1-level-test', 'tests', 'two level-test items share an id', 'keep ids unique')
  const partKeys = new Set(lt.parts.map(p => p.key))
  for (const q of Q) {
    if (!partKeys.has(q.part))
      a.hard('b1-level-test', at(q.id), `the item names the part ${q.part}, which is not listed in `, 'list the part or correct the item')
    if (q.words) {
      if ([...q.words].sort().join('|') !== q.answer.split(' ').sort().join('|'))
        a.hard('b1-level-test', at(q.id), 'the word-order tokens are not a permutation of the answer', 'fix the tokens')
    } else {
      if (q.options.length !== 3 || new Set(q.options).size !== 3)
        a.hard('b1-level-test', at(q.id), 'a choice item needs three distinct options', 'give three options')
      if (q.options.filter(o => o === q.answer).length !== 1)
        a.hard('b1-level-test', at(q.id), 'the correct answer must appear exactly once among the options', 'fix the options')
    }
    if (!q.promptRu || !q.promptKy || !q.why.ru || !q.why.ky)
      a.hard('b1-level-test', at(q.id), 'the item lacks a Russian or Kyrgyz prompt or explanation', 'author both languages')
  }
  if (Q.filter(q => q.words).length < 3)
    a.hard('b1-level-test', 'tests', 'the level assessment needs at least 3 word-order items', 'add word-order items')
  const legacy = ctx.bundle.course?.find(l => l.id === LEVEL)?.unitIdRange
  const concepts = ctx.bundle.grammar.filter(g => ctx.levelOfUnit(g.unit) === LEVEL && !!legacy && g.unit >= legacy[0] && g.unit <= legacy[1]).map(g => g.id)
  const tagged = new Set(Q.flatMap(q => (q.concept ? [q.concept] : [])))
  for (const c of concepts)
    if (!tagged.has(c)) a.hard('b1-level-test', `grammar:${c}`, `no level-test item examines the concept "${c}"`, 'tag an item with it')
  for (const t of tagged)
    if (!concepts.includes(t))
      a.hard('b1-level-test', `tests:${def?.id ?? 'level-b1'}`, `an item names the unknown concept "${t}"`, 'use a concept of the level')
  for (const q of Q.filter(x => x.part === 'C')) {
    const passage = q.prompt.split('„')[1]?.split('“')[0] ?? ''
    if (passage.split(/\s+/).filter(Boolean).length < 80)
      a.hard('b1-level-test', at(q.id), 'the reading passage has fewer than 80 words', 'lengthen the passage')
  }
  if (!Q.some(q => q.part === 'D') && !(lt.listeningNote?.ru && lt.listeningNote?.ky))
    a.hard(
      'b1-level-test',
      'tests',
      'no listening items and no listening note: success would be reported without listening evidence',
      'add the ru/ky listeningNote',
    )
  if (/Goethe|telc|TestDaF|ÖSD|CEFR|Zertifikat/.test(JSON.stringify([lt.bands, lt.statement, lt.companion, lt.listeningNote, lt.parts])))
    a.hard(
      'b1-level-test',
      'tests',
      'the assessment wording names an exam board, a certificate or a CEFR level',
      'remove it: the assessment is indicative only',
    )
}

/**
 * The register of open curriculum decisions (P1 remediation): every decision D-1…D-14 must be registered, none may be marked approved, every `expertReview.decision` of a concept must be a
 * registered id, and every decision that no concept carries raises ONE review flag so that it cannot be forgotten. A register entry flagged `carriedByConcept` must really be carried by a concept.
 */
function checkDecisions(ctx: Ctx, a: { hard: Hard; curriculum: B1Curriculum | undefined; authored: boolean }): void {
  const reg = ctx.bundle.b1Decisions
  // the register describes the complete curriculum: skipped for partial/synthetic bundles with fewer than 12 specified units
  if (!a.authored || reg === undefined || (a.curriculum?.units.length ?? 0) < 12) return
  const ids = new Set(reg.map(d => d.id))
  if (ids.size !== reg.length)
    a.hard('b1-decision-register', 'decisions', 'the decision register lists an id twice', 'keep one entry per decision')
  for (let i = 1; i <= 14; i++)
    if (!ids.has(`D-${i}`))
      a.hard(
        'b1-decision-register',
        `decisions:D-${i}`,
        `decision D-${i} of the approval dossier is not registered`,
        'register every decision D-1…D-14',
      )
  const carried = new Set(
    (a.curriculum?.units ?? []).flatMap(u => u.concepts.flatMap(c => (c.expertReview ? [c.expertReview.decision] : []))),
  )
  for (const id of carried)
    if (!ids.has(id))
      a.hard(
        'b1-decision-register',
        `decisions:${id}`,
        `a concept carries the review id "${id}", which is not in the decision register`,
        'use a registered decision id',
      )
  for (const d of reg) {
    const status = d.status as string
    if (status === 'approved' || !/^pending-/.test(status))
      a.hard(
        'b1-decision-register',
        `decisions:${d.id}`,
        `decision ${d.id} has the status "${status}"`,
        'only a person may record an approval, in the dossier; the register keeps "pending-…"',
      )
    if (d.carriedByConcept && !carried.has(d.id))
      a.hard(
        'b1-decision-register',
        `decisions:${d.id}`,
        `decision ${d.id} is registered as carried by a concept, but no concept of curriculum.ts names it`,
        'attach the review to its concept or correct the register',
      )
    if (!d.carriedByConcept && carried.has(d.id))
      a.hard(
        'b1-decision-register',
        `decisions:${d.id}`,
        `decision ${d.id} is carried by a concept but registered as not carried`,
        'set carriedByConcept',
      )
    if (!d.carriedByConcept)
      ctx.add(
        'review',
        'curriculum-decision-open',
        `decisions:${d.id}`,
        `decision ${d.id} (${d.title}) is unresolved: ${d.status}${d.expertRequired ? ', needs an independent German/CEFR expert' : ''}. Implemented: ${d.implemented}. Fallback: ${d.fallback}`,
      )
  }
}

function checkMeta(
  ctx: Ctx,
  a: { meta: B1UnitMeta; unit: number; spec: B1UnitSpec | undefined; grammar: string[]; writing: string[]; fail: Fail; hard: Hard },
) {
  const { meta, unit: u, spec, fail, hard } = a
  const at = `b1Meta:${u}`
  const text = (what: string, t: B1Text | undefined, requireIch = false) => {
    const p = textProblems(t)
    if (p.length)
      fail(
        'b1-objective-invalid',
        `${at}#${what}`,
        `${what} is not complete (${p.join('; ')})`,
        'give the German "Ich kann …" sentence and independent Russian and Kyrgyz texts',
      )
    else if (requireIch && !t!.de.trim().startsWith(OBJECTIVE_STARTS))
      fail(
        'b1-objective-form',
        `${at}#${what}`,
        `the German text "${t!.de.slice(0, 40)}" does not start with "${OBJECTIVE_STARTS}"`,
        'phrase the objective as a can-do statement: "Ich kann …"',
      )
  }
  if (!Array.isArray(meta.canDo) || meta.canDo.length < 2 || meta.canDo.length > 3)
    fail(
      'b1-objective-count',
      `${at}#canDo`,
      `unit ${u} has ${meta.canDo?.length ?? 0} can-do goals; the standard is 2–3`,
      'declare 2–3 can-do goals',
    )
  ;(meta.canDo ?? []).forEach((t, i) => text(`canDo[${i}]`, t, true))
  for (const k of ['lesen', 'hoeren', 'sprechen', 'schreiben'] as const) text(`objectives.${k}`, meta.objectives?.[k], true)
  if (spec?.requires.differenceFromA2) text('differenceFromA2', meta.differenceFromA2)

  // concept classification
  const seen = new Set<string>()
  for (const c of meta.concepts ?? []) {
    const cat = `grammar:${c.conceptId}`
    if (seen.has(c.conceptId)) hard('b1-meta-duplicate', cat, `concept "${c.conceptId}" is declared twice in unit ${u}`, 'declare it once')
    seen.add(c.conceptId)
    if (!a.grammar.includes(c.conceptId))
      hard(
        'b1-meta-concept-unknown',
        cat,
        `the metadata of unit ${u} names concept "${c.conceptId}", which is not a grammar concept of that unit`,
        'use the id of a concept authored in this unit',
      )
    if (!['P', 'P-lim', 'R'].includes(c.proficiency))
      hard(
        'b1-proficiency-invalid',
        cat,
        `proficiency "${String(c.proficiency)}" is not P, P-lim or R`,
        'classify the concept as P (productive), P-lim (closed list) or R (receptive)',
      )
    if (!['H', 'M', 'L'].includes(c.load)) hard('b1-load-invalid', cat, `load "${String(c.load)}" is not H, M or L`, 'declare the load')
    if (c.proficiency === 'P-lim' && (!Array.isArray(c.closedList) || c.closedList.length === 0))
      fail(
        'b1-closed-list-missing',
        cat,
        'a P-lim concept must declare its closed list',
        'add `closedList` with the verbs / patterns the learner is held to',
      )
    for (const k of c.constructions ?? [])
      if (!Array.isArray(k.forms) || k.forms.length === 0 || !k.forms.every(nonEmpty))
        hard(
          'b1-construction-forms',
          cat,
          `construction "${k.label}" has no surface forms`,
          'list the forms (lower-case) that reveal the construction',
        )
  }
  for (const gid of a.grammar)
    if (!seen.has(gid))
      fail(
        'b1-proficiency-missing',
        `grammar:${gid}`,
        `concept "${gid}" has no productive/receptive classification`,
        'add it to the unit metadata with proficiency, load and role',
      )

  // strands and micro-tasks
  const chunks = meta.strands?.repairChunks ?? []
  if (chunks.length < 3)
    fail(
      'b1-strand-repair',
      `${at}#repairChunks`,
      `unit ${u} has ${chunks.length} communication-repair chunks; at least 3 are required`,
      'add repair chunks (e.g. asking to repeat, paraphrasing)',
    )
  chunks.forEach((t, i) => {
    const p = textProblems(t)
    if (p.length)
      fail(
        'b1-strand-repair',
        `${at}#repairChunks[${i}]`,
        `repair chunk ${i + 1} is not complete (${p.join('; ')})`,
        'give German, Russian and Kyrgyz',
      )
  })
  text('strands.strategyNote', meta.strands?.strategyNote)
  text('scenario.unexpectedElement', meta.scenario?.unexpectedElement)
  if (spec?.requires.wortbildung) text('strands.wortbildungNote', meta.strands?.wortbildungNote)
  const micro = meta.microTasks ?? []
  for (const t of micro)
    if (!a.writing.includes(t.taskId))
      hard(
        'b1-micro-unknown',
        `${at}#microTasks`,
        `micro-task "${t.taskId}" is not a writing task of unit ${u}`,
        'point it at an authored writing task of this unit',
      )
  const need = (kind: 'meinung' | 'mediation', req: boolean | undefined) => {
    if (req && !micro.some(t => t.kind === kind && a.writing.includes(t.taskId)))
      fail(
        `b1-strand-${kind}`,
        at,
        `unit ${u} requires a ${kind === 'meinung' ? 'opinion-with-reason' : 'mediation (relaying information)'} micro-task and has none`,
        `add a short writing task and declare it in microTasks with kind '${kind}'`,
      )
  }
  need('meinung', spec?.requires.meinungMicroTask)
  need('mediation', spec?.requires.mediationMicroTask)
  if (spec?.requires.comparison) {
    const phrases = (meta.strands?.comparisonPhrases ?? []).filter(nonEmpty)
    const corpus = [
      ...ctx.bundle.reading.filter(r => r.unit === u).flatMap(r => r.body ?? []),
      ...ctx.bundle.listening.filter(l => l.unit === u).flatMap(l => (l.lines ?? []).map(x => x.text)),
      ...ctx.bundle.exercises.filter(e => e.unit === u).map(e => e.prompt ?? ''),
    ]
      .join(' ')
      .toLowerCase()
    const found = phrases.filter(p => corpus.includes(p.toLowerCase()))
    if (phrases.length < 3 || found.length < 2)
      fail(
        'b1-strand-comparison',
        at,
        `unit ${u} needs ≥ 3 comparison phrases of which ≥ 2 occur in its texts (found ${found.length} of ${phrases.length})`,
        'declare comparison phrases and use them in a reading, listening or exercise',
      )
  }
  if (spec && spec.requires.recapConcepts > 0) {
    const ids = meta.recapConcepts ?? []
    if (ids.length < spec.requires.recapConcepts)
      fail(
        'b1-bridge-recap',
        at,
        `the A2→B1 bridge recaps ${ids.length} earlier concepts; ${spec.requires.recapConcepts} are required`,
        'list earlier-unit concept ids in recapConcepts',
      )
    for (const id of ids) {
      const g = ctx.bundle.grammar.find(x => x.id === id)
      if (!g || g.unit >= u)
        hard(
          'b1-bridge-recap',
          at,
          `recap concept "${id}" does not exist or is not from an earlier unit`,
          'use an existing concept of an earlier unit',
        )
    }
  }
  for (const req of spec?.requires.topics ?? []) {
    const t = (meta.topics ?? []).find(x => x.topic === req)
    const items = new Set([
      ...ctx.bundle.vocabulary.filter(x => x.unit === u).map(x => x.id),
      ...ctx.bundle.reading.filter(x => x.unit === u).map(x => x.id),
      ...ctx.bundle.listening.filter(x => x.unit === u).map(x => x.id),
      ...ctx.bundle.exercises.filter(x => x.unit === u).map(x => x.id),
      ...ctx.bundle.writing.filter(x => x.unit === u).map(x => x.id),
      ...ctx.bundle.speaking.map(x => x.id),
    ])
    if (!t || t.itemIds.length === 0)
      fail(
        'b1-topic-missing',
        at,
        `unit ${u} must cover the topic "${req}" and cites no evidence`,
        `add {topic: '${req}', itemIds: [...]} naming items of the unit that carry it`,
      )
    else
      for (const id of t.itemIds)
        if (!items.has(id))
          hard('b1-topic-evidence', at, `topic "${req}" cites "${id}", which is not an item of unit ${u}`, 'cite existing item ids')
  }
}

function checkRevision(a: {
  meta: B1UnitMeta
  unit: number
  spec: B1UnitSpec | undefined
  vocabUnit: Map<string, number>
  fail: Fail
  hard: Hard
}) {
  const { meta, unit: u, spec, vocabUnit, fail, hard } = a
  const at = `b1Meta:${u}#revision`
  const rev = meta.revision
  if (!rev)
    return fail(
      'b1-revision-missing',
      at,
      `unit ${u} declares no spaced-revision set`,
      'add `revision` (fromPrevious, fromThirdBack, fromA2 …)',
    )
  const group = (name: string, ids: string[], min: number, inUnit: (n: number) => boolean, where: string) => {
    if (ids.length < min)
      fail(
        'b1-revision-size',
        at,
        `${name} lists ${ids.length} words; at least ${min} are required`,
        `add ${min - ids.length} more vocabulary ids ${where}`,
      )
    for (const id of ids) {
      const n = vocabUnit.get(id)
      if (n === undefined)
        hard('b1-revision-unknown', at, `${name} cites "${id}", which is not a vocabulary item`, 'cite existing vocabulary ids')
      else if (!inUnit(n))
        fail('b1-revision-window', at, `${name} cites "${id}" of unit ${n}, outside the expected window`, `cite words ${where}`)
    }
  }
  group('fromPrevious', rev.fromPrevious ?? [], 4, n => n === u - 1, `from unit ${u - 1}`)
  group('fromThirdBack', rev.fromThirdBack ?? [], 2, n => n === u - 3, `from unit ${u - 3}`)
  if (spec?.requires.a2Revision) group('fromA2', rev.fromA2 ?? [], 2, n => n >= 11 && n <= 20, 'from A2 (units 11–20)')
  if (spec?.requires.revisionBlock) group('block', rev.block ?? [], 20, n => n >= u - 3 && n <= u - 1, `from units ${u - 3}–${u - 1}`)
}

// ───────────────────────── productive vs receptive ─────────────────────────
function checkReceptive(ctx: Ctx, a: { metas: readonly B1UnitMeta[]; hard: Hard; owned: (u: number) => boolean }) {
  const { metas, hard, owned } = a
  const { bundle } = ctx
  const receptive: { c: B1Construction; unit: number }[] = []
  const receptiveConcepts = new Map<string, number>()
  for (const m of metas) {
    for (const c of m.concepts ?? []) {
      if (c.proficiency === 'R') receptiveConcepts.set(c.conceptId, m.unit)
      for (const k of c.constructions ?? []) if (k.proficiency === 'R') receptive.push({ c: k, unit: m.unit })
    }
    for (const k of m.receptiveOnly ?? []) receptive.push({ c: { ...k, proficiency: 'R' }, unit: m.unit })
  }
  const check = (where: string, unit: number, texts: string[], isPattern = false) => {
    for (const { c } of receptive) {
      if (unit > (c.receptiveThrough ?? 32)) continue
      for (const form of c.forms) {
        const hit = texts.some(t => (isPattern ? t.toLowerCase().includes(form.toLowerCase()) : mentions(t, form)))
        if (hit)
          hard(
            'b1-receptive-required',
            where,
            `this production item requires "${form}" (${c.label}), which is receptive-only in B1`,
            'remove it from the production item, or reclassify the construction as productive (an approved curriculum change)',
          )
      }
    }
  }
  for (const e of bundle.exercises) {
    if (!owned(e.unit) || (e.type !== 'fill' && e.type !== 'order')) continue
    if (e.concept && receptiveConcepts.has(e.concept))
      hard(
        'b1-receptive-in-production',
        `exercises:${e.id}`,
        `a ${e.type} exercise practises "${e.concept}", a receptive-only concept`,
        'make it a recognition (choice) exercise or reclassify the concept',
      )
    check(`exercises:${e.id}`, e.unit, [e.answer ?? '', ...(e.words ?? [])])
  }
  for (const ft of bundle.finalTests ?? []) {
    if (!owned(ft.unit)) continue
    for (const q of ft.questions) {
      if (q.skill !== 'grammar' || !/___/.test(q.prompt)) continue
      if (q.concept && receptiveConcepts.has(q.concept))
        hard(
          'b1-receptive-in-production',
          `finalTests:unit${ft.unit}/${q.id}`,
          `a gap-fill question tests "${q.concept}", a receptive-only concept`,
          'turn it into a recognition question or reclassify the concept',
        )
      check(`finalTests:unit${ft.unit}/${q.id}`, ft.unit, [q.answer ?? ''])
    }
  }
  for (const w of bundle.writing)
    if (owned(w.unit))
      check(
        `writing:${w.id}`,
        w.unit,
        (w.mustInclude ?? []).flatMap(m => m.patterns ?? []),
        true,
      )
  for (const s of bundle.speaking) {
    const unit = (bundle.unitSpeaking?.[LEVEL] ?? []).indexOf(s.id)
    if (unit < 0) continue
    check(
      `speaking:${s.id}`,
      unit + 21,
      s.turns.flatMap(t => t.keywords ?? []),
    )
  }
}

// ───────────────────────── RU/KY parity ─────────────────────────
interface Pair {
  where: string
  ru: string
  ky: string
}

function pairsOf(ctx: Ctx, owned: (u: number) => boolean, metas: readonly B1UnitMeta[]): Pair[] {
  const { bundle } = ctx
  const out: Pair[] = []
  const add = (where: string, ru: unknown, ky: unknown) => {
    if (nonEmpty(ru) && nonEmpty(ky)) out.push({ where, ru, ky })
  }
  for (const v of bundle.vocabulary) {
    if (!owned(v.unit)) continue
    add(`vocabulary:${v.id}#translation`, v.ru, v.ky)
    add(`vocabulary:${v.id}#example`, v.exampleRu, v.exampleKy)
  }
  for (const e of bundle.exercises) if (owned(e.unit)) add(`exercises:${e.id}#prompt`, e.promptRu, e.promptKy)
  for (const l of bundle.listening) if (owned(l.unit)) l.lines?.forEach((x, i) => add(`listening:${l.id}#lines[${i}]`, x.ru, x.ky))
  for (const r of bundle.reading) if (owned(r.unit)) r.gloss?.forEach((x, i) => add(`reading:${r.id}#gloss[${i}]`, x.ru, x.ky))
  for (const g of bundle.grammar) {
    if (!owned(g.unit)) continue
    for (const k of ['title', 'summary', 'discover', 'why'] as const) add(`grammar:${g.id}#${k}`, g[k]?.ru, g[k]?.ky)
    g.when?.forEach((x, i) => add(`grammar:${g.id}#when[${i}]`, x.ru, x.ky))
    g.examples?.forEach((x, i) => add(`grammar:${g.id}#examples[${i}]`, x.ru, x.ky))
    g.reallife?.forEach((x, i) => add(`grammar:${g.id}#reallife[${i}]`, x.ru, x.ky))
    g.dialogue?.forEach((x, i) => add(`grammar:${g.id}#dialogue[${i}]`, x.ru, x.ky))
  }
  for (const w of bundle.writing) {
    if (!owned(w.unit)) continue
    add(`writing:${w.id}#situation`, w.situation?.ru, w.situation?.ky)
    w.mustInclude?.forEach((m, i) => add(`writing:${w.id}#mustInclude[${i}]`, m.explain?.ru, m.explain?.ky))
    w.tips?.forEach((t, i) => add(`writing:${w.id}#tips[${i}]`, t.ru, t.ky))
  }
  for (const s of bundle.speaking) {
    if ((bundle.unitSpeaking?.[LEVEL] ?? []).indexOf(s.id) < 0) continue
    add(`speaking:${s.id}#title`, s.titleRu, s.titleKy)
    add(`speaking:${s.id}#goal`, s.goal?.ru, s.goal?.ky)
    s.turns.forEach((t, i) => add(`speaking:${s.id}#turns[${i}]`, t.aiRu, t.aiKy))
  }
  for (const ft of bundle.finalTests ?? []) {
    if (!owned(ft.unit)) continue
    for (const q of ft.questions) {
      add(`finalTests:unit${ft.unit}/${q.id}#prompt`, q.promptRu, q.promptKy)
      add(`finalTests:unit${ft.unit}/${q.id}#why`, q.why?.ru, q.why?.ky)
    }
  }
  const mt = (where: string, t: B1Text | undefined) => add(where, t?.ru, t?.ky)
  for (const m of metas) {
    m.canDo?.forEach((t, i) => mt(`b1Meta:${m.unit}#canDo[${i}]`, t))
    for (const k of ['lesen', 'hoeren', 'sprechen', 'schreiben'] as const) mt(`b1Meta:${m.unit}#objectives.${k}`, m.objectives?.[k])
    mt(`b1Meta:${m.unit}#differenceFromA2`, m.differenceFromA2)
    mt(`b1Meta:${m.unit}#scenario.unexpectedElement`, m.scenario?.unexpectedElement)
    m.strands?.repairChunks?.forEach((t, i) => mt(`b1Meta:${m.unit}#repairChunks[${i}]`, t))
    mt(`b1Meta:${m.unit}#strategyNote`, m.strands?.strategyNote)
    mt(`b1Meta:${m.unit}#wortbildungNote`, m.strands?.wortbildungNote)
  }
  return out
}

const quotedGerman = (s: string): string[] =>
  [...s.matchAll(/«([^»]+)»|„([^“”"]+)[“”"]|"([^"]+)"/g)]
    .map(m => (m[1] ?? m[2] ?? m[3] ?? '').trim())
    .filter(q => q !== '' && /[A-Za-zÄÖÜäöüß]/.test(q) && !cyr(q))

function checkParity(ctx: Ctx, a: { fail: Fail; owned: (u: number) => boolean; metas: readonly B1UnitMeta[] }) {
  const { fail } = a
  for (const p of pairsOf(ctx, a.owned, a.metas)) {
    if (letters(p.ru) >= 5 && !cyr(p.ru))
      fail(
        'b1-parity-script',
        p.where,
        'the Russian text contains no Cyrillic letters (untranslated?)',
        'write the Russian text in Russian',
      )
    if (letters(p.ky) >= 5 && !cyr(p.ky))
      fail('b1-parity-script', p.where, 'the Kyrgyz text contains no Cyrillic letters (untranslated?)', 'write the Kyrgyz text in Kyrgyz')
    const nums = (s: string) => (s.match(/\d+/g) ?? []).sort().join(',')
    if (nums(p.ru) !== nums(p.ky))
      fail(
        'b1-parity-numbers',
        p.where,
        `the numbers differ: Russian [${nums(p.ru)}] vs Kyrgyz [${nums(p.ky)}]`,
        'make both texts carry the same numbers',
      )
    const ph = (s: string) => (s.match(/\{[A-Za-z0-9_]+\}/g) ?? []).sort().join(',')
    if (ph(p.ru) !== ph(p.ky))
      fail(
        'b1-parity-placeholder',
        p.where,
        `the placeholders differ: Russian [${ph(p.ru)}] vs Kyrgyz [${ph(p.ky)}]`,
        'use exactly the same {placeholders} in both texts',
      )
    for (const q of quotedGerman(p.ru))
      if (!p.ky.includes(q))
        fail(
          'b1-parity-quoted',
          p.where,
          `the German example "${q}" quoted in the Russian text is missing from the Kyrgyz text`,
          'quote the same German example in both texts',
        )
    if (p.ru.length >= 20 && (p.ky.length < 0.4 * p.ru.length || p.ky.length > 2.5 * p.ru.length))
      fail(
        'b1-parity-length',
        p.where,
        `the Kyrgyz text (${p.ky.length} characters) is very different in size from the Russian (${p.ru.length})`,
        'check that nothing is missing or added in one language',
        'review',
      )
  }
}
