// Reference rules (Stage 6A).
//  1. INTERNAL — a level's content may only reference content of its own level (an A2 unit teaches A2 concepts, an A2 word relates to
//     A2 words, an A2 exercise belongs to an A2 concept). The existence of the referenced id is checked by the core rules.
//  2. PROVENANCE — authored educational material of a strict level must declare where it comes from (`source`). The validator only
//     CHECKS the declaration: it is complete, well-formed and not a placeholder. It never fills one in, never invents a citation,
//     and never goes to the network: whether a cited URL is reachable or says what is claimed is reported as a review flag.
import type { ContentSource } from '../../../src/data/types'
import type { Ctx } from '../context'

const PLACEHOLDER = /^(todo|tbd|n\/?a|unknown|none|xxx|\?+|-+|\.+)$|\b(todo|tbd|lorem ipsum)\b/i
const KINDS = new Set(['authored', 'adapted', 'external'])

export function isHttpUrl(s: string): boolean {
  try {
    const u = new URL(s)
    return (u.protocol === 'http:' || u.protocol === 'https:') && u.hostname.includes('.')
  } catch {
    return false
  }
}

function checkSource(ctx: Ctx, level: Parameters<Ctx['gate']>[0], where: string, source: ContentSource | undefined) {
  if (source === undefined || source === null) {
    ctx.add(
      ctx.gate(level, 'warning'),
      'source-missing',
      where,
      'no `source`: authored educational material must declare its provenance (authored / adapted / external)',
    )
    return
  }
  if (typeof source !== 'object' || !KINDS.has(source.kind))
    return ctx.err(
      'source-malformed',
      where,
      `source.kind must be one of authored | adapted | external (got ${JSON.stringify((source as { kind?: unknown }).kind)})`,
    )
  const text = (v: unknown) => (typeof v === 'string' ? v.trim() : '')
  const bad = (field: string, v: unknown, why: string) =>
    ctx.err(PLACEHOLDER.test(text(v)) && text(v) !== '' ? 'source-placeholder' : 'source-malformed', where, `source.${field} ${why}`)
  if (source.kind === 'authored') {
    if (text(source.author) === '' || PLACEHOLDER.test(text(source.author)))
      bad('author', source.author, 'is required for authored material (who is responsible for it) and must be a real name')
  } else {
    if (text(source.citation) === '' || PLACEHOLDER.test(text(source.citation)))
      bad('citation', source.citation, `is required for ${source.kind} material and must be a real citation`)
    if (text(source.license) === '' || PLACEHOLDER.test(text(source.license)))
      bad('license', source.license, `is required for ${source.kind} material (the licence or permission it is used under)`)
    if (text(source.url) === '')
      ctx.add(
        'review',
        'source-unverifiable',
        where,
        `${source.kind} material has no url: it cannot be verified from the repository — a reviewer must confirm the citation`,
      )
  }
  if (source.url !== undefined) {
    if (!isHttpUrl(text(source.url)))
      ctx.err('source-url-malformed', where, `source.url "${text(source.url).slice(0, 60)}" is not a valid http(s) URL`)
    else
      ctx.add(
        'review',
        'source-url-unchecked',
        where,
        'source.url is well-formed but is not fetched by the validator (offline, deterministic): a reviewer must confirm it supports the material',
      )
  }
}

export function referenceRules(ctx: Ctx): void {
  const { bundle } = ctx
  const levelOfGrammar = new Map(bundle.grammar.map(g => [g.id, ctx.levelOfUnit(g.unit)]))
  const levelOfVocab = new Map(bundle.vocabulary.map(v => [v.id, ctx.levelOfUnit(v.unit)]))
  const unitOfGrammar = new Map(bundle.grammar.map(g => [g.id, g.unit]))
  const unitOfVocab = new Map(bundle.vocabulary.map(v => [v.id, v.unit]))

  // 1. internal references stay inside the level
  for (const u of bundle.units) {
    const lvl = ctx.levelOfUnit(u.id)
    if (!ctx.strict(lvl)) continue
    for (const gid of Array.isArray(u.grammarIds) ? u.grammarIds : []) {
      const own = levelOfGrammar.get(gid)
      if (own !== undefined && own !== lvl)
        ctx.err('ref-cross-level', `units:${u.id}`, `${lvl} unit lists grammar concept "${gid}" of ${own}`)
      else if (own === lvl && unitOfGrammar.get(gid) !== u.id)
        ctx.err(
          'ref-cross-unit',
          `units:${u.id}`,
          `unit ${u.id} lists grammar concept "${gid}" which belongs to unit ${unitOfGrammar.get(gid)}`,
        )
    }
  }
  for (const v of bundle.vocabulary) {
    const lvl = ctx.levelOfUnit(v.unit)
    if (!ctx.strict(lvl)) continue
    for (const r of Array.isArray(v.related) ? v.related : []) {
      const own = levelOfVocab.get(r)
      if (own !== undefined && own !== lvl) ctx.err('ref-cross-level', `vocabulary:${v.id}`, `${lvl} word relates to "${r}" of ${own}`)
      else if (own === lvl && unitOfVocab.get(r) !== v.unit)
        ctx.err(
          'ref-cross-unit',
          `vocabulary:${v.id}`,
          `unit ${v.unit} word relates to "${r}" of unit ${unitOfVocab.get(r)}: related words are neighbours within one unit`,
        )
    }
  }
  for (const e of bundle.exercises) {
    const lvl = ctx.levelOfUnit(e.unit)
    if (!ctx.strict(lvl) || !e.concept) continue
    const own = levelOfGrammar.get(e.concept)
    // article drills point at the shared 'articles' concept of the first level by design; only handwritten exercises must stay inside
    if (e.type !== 'article' && own !== undefined && own !== lvl)
      ctx.err('ref-cross-level', `exercises:${e.id}`, `${lvl} exercise belongs to concept "${e.concept}" of ${own}`)
    else if (e.type !== 'article' && own === lvl && unitOfGrammar.get(e.concept) !== e.unit)
      ctx.err(
        'ref-cross-unit',
        `exercises:${e.id}`,
        `unit ${e.unit} revision exercise belongs to concept "${e.concept}" of unit ${unitOfGrammar.get(e.concept)}: revision exercises practise the unit's own concepts`,
      )
  }
  for (const t of bundle.tests) {
    if (!ctx.strict(t.level) || t.unit === undefined) continue
    const owner = ctx.levelOfUnit(t.unit)
    if (owner !== undefined && owner !== t.level)
      ctx.err('ref-cross-level', `tests:${t.id}`, `${t.level} test points at unit ${t.unit} of ${owner}`)
  }

  // "why?" notes belong to a concept that exists, of their own level
  for (const [i, n] of (bundle.whyNotes ?? []).entries()) {
    const owner = levelOfGrammar.get(n.conceptId)
    const concept = bundle.grammar.find(g => g.id === n.conceptId)
    if (!concept && bundle.course) {
      ctx.err('ref-grammar', `whyNotes:${n.conceptId}/${i}`, `concept "${n.conceptId}" does not exist`)
      continue
    }
    if (concept && ctx.strict(owner) && owner !== ctx.levelOfUnit(concept.unit))
      ctx.err('ref-cross-level', `whyNotes:${n.conceptId}/${i}`, 'note and concept belong to different levels')
  }

  // 2. provenance of authored educational material
  const prov = <T extends { id: string; source?: ContentSource }>(
    collection: string,
    items: T[],
    levelOf: (x: T) => ReturnType<Ctx['levelOfUnit']>,
  ) => {
    for (const x of items) {
      const lvl = levelOf(x)
      if (ctx.strict(lvl) && lvl) checkSource(ctx, lvl, `${collection}:${x.id}`, x.source)
    }
  }
  prov('reading', bundle.reading, r => ctx.levelOfUnit(r.unit))
  prov('listening', bundle.listening, l => ctx.levelOfUnit(l.unit))
  prov('grammar', bundle.grammar, g => ctx.levelOfUnit(g.unit))
  prov('writing', bundle.writing, w => ctx.levelOfUnit(w.unit))
  prov('speaking', bundle.speaking, s => ctx.levelOfScenario(s.id))
}
