// @vitest-environment node
/**
 * Stage 6A — localization rules. Russian and Kyrgyz are independent: every localised field of every A2 content type needs both,
 * empty / copied / placeholder text is invalid, and nothing falls back from one language to the other.
 */
import { describe, expect, it } from 'vitest'
import { A2_LOCALIZATION } from '../../scripts/content-validate/rules/localization'
import type { ContentBundle, Issue } from '../../scripts/content-validate/types'
import { validateContent } from '../../scripts/content-validate/validate'
import { tr } from '../../src/utils/text'
import { clone, emptyA2Bundle, validA2Bundle } from './fixtures'

const run = (b: ContentBundle, mode: 'authoring' | 'release' = 'authoring'): Issue[] => validateContent(b, { mode })
const errors = (b: ContentBundle) => run(b).filter(i => i.severity === 'error')
const ruleSet = (issues: Issue[]) => issues.map(i => `${i.severity}|${i.rule}|${i.where}`)

type Coll =
  | 'units'
  | 'vocabulary'
  | 'grammar'
  | 'exercises'
  | 'listening'
  | 'reading'
  | 'speaking'
  | 'writing'
  | 'tests'
  | 'finalTests'
  | 'whyNotes'
  | 'placementItems'
  | 'tutorTemplates'
  | 'instructions'
interface Target {
  coll: Coll
  id: string
  /** path inside the item to the object holding the two fields (`''` = the item itself) */
  base: string
  ru: string
  ky: string
}
const T = (coll: Coll, id: string, base: string, ru = 'ru', ky = 'ky'): Target => ({ coll, id, base, ru, ky })

/** every localised field of every A2 content type, as a place to break */
const TARGETS: Target[] = [
  T('units', '11', 'subtitle'),
  T('vocabulary', 'v11-1', '', 'ru', 'ky'),
  T('vocabulary', 'v11-1', '', 'exampleRu', 'exampleKy'),
  ...['title', 'summary', 'discover', 'why', 'when[0]', 'speakPrompt.prompt', 'mistakes[0].note'].map(p =>
    T('grammar', 'a2-concept-one', p),
  ),
  ...['examples[0]', 'reallife[0]', 'dialogue[0]'].map(p => T('grammar', 'a2-concept-one', p)),
  T('exercises', 'a2-ex-11-01', '', 'promptRu', 'promptKy'),
  T('exercises', 'a2-ex-11-01', 'why'),
  T('listening', 'a2-li-11-01', 'lines[1]'),
  T('reading', 'a2-re-11-01', 'gloss[0]'),
  T('reading', 'a2-re-11-01', 'gloss[0]', 'grammar', 'grammarKy'),
  T('speaking', 'a2-sp-11-01', '', 'titleRu', 'titleKy'),
  T('speaking', 'a2-sp-11-01', 'goal'),
  T('speaking', 'a2-sp-11-01', 'turns[0]', 'aiRu', 'aiKy'),
  T('writing', 'a2-wr-11-01', 'situation'),
  T('writing', 'a2-wr-11-01', 'tips[0]'),
  T('tests', 'unit-11', 'title'),
  T('finalTests', 'a2-ft-11-01', '', 'promptRu', 'promptKy'),
  T('finalTests', 'a2-ft-11-01', 'why'),
  T('whyNotes', 'a2-concept-one', ''),
  T('whyNotes', 'a2-concept-one', 'reason'),
  T('whyNotes', 'a2-concept-one', 'more[0]'),
  T('placementItems', 'a2-pl-01', '', 'promptRu', 'promptKy'),
  T('placementItems', 'a2-pl-01', 'why'),
  T('tutorTemplates', 'a2-tt-explain-intro', 'text'),
  T('instructions', 'a2-in-listening', 'text'),
]

function holder(b: ContentBundle, t: Target): Record<string, unknown> {
  let item: unknown
  if (t.coll === 'finalTests') item = b.finalTests?.[0].questions.find(q => q.id === t.id)
  else if (t.coll === 'whyNotes') item = b.whyNotes?.find(n => n.conceptId === t.id)
  else item = (b[t.coll] as unknown as { id: string | number }[]).find(x => String(x.id) === t.id)
  let cur = item as Record<string, unknown>
  for (const tok of t.base === '' ? [] : t.base.split('.')) {
    const m = /^(\w+)(?:\[(\d+)\])?$/.exec(tok) as RegExpExecArray
    cur = (m[2] === undefined ? cur[m[1]] : (cur[m[1]] as unknown[])[Number(m[2])]) as Record<string, unknown>
  }
  return cur
}
const label = (t: Target) => `${t.coll}:${t.id}#${t.base || '(item)'}.${t.ky}`
const shortRu = (v: unknown) => typeof v === 'string' && v.trim().split(/\s+/).length < 2 && v.trim().length < 8

describe('the compliant A2 fixture is accepted (A2 content CAN be validated when it is introduced)', () => {
  it('no error, no warning, no review flag', () => {
    expect(ruleSet(run(validA2Bundle()).filter(i => i.severity !== 'info'))).toEqual([])
  })

  it('the fixture exercises every localised field: each spec of the table has a target here', () => {
    const covered = new Set(TARGETS.map(t => `${t.coll}|${t.base.replace(/\[\d+\]/g, '[]')}|${t.ru}|${t.ky}`))
    // every l10n/pair spec of the table is hit by at least one target (text specs have no Kyrgyz twin)
    for (const [coll, specs] of Object.entries(A2_LOCALIZATION))
      for (const s of specs) {
        if (s.kind === 'text') continue
        const key = s.kind === 'l10n' ? `${coll}|${s.path}|ru|ky` : `${coll}|${s.base}|${s.ru}|${s.ky}`
        expect(covered.has(key), `no test target for ${key}`).toBe(true)
      }
  })
})

describe.each(TARGETS.map(t => [label(t), t] as const))('%s', (_name, t) => {
  it('missing Kyrgyz is rejected (no fallback to Russian)', () => {
    const b = validA2Bundle()
    delete holder(b, t)[t.ky]
    expect(ruleSet(errors(b))).toEqual(expect.arrayContaining([expect.stringContaining('error|l10n-missing-ky|')]))
  })

  it('empty and whitespace-only Kyrgyz are rejected', () => {
    for (const v of ['', '   ', '\n']) {
      const b = validA2Bundle()
      holder(b, t)[t.ky] = v
      expect(
        errors(b).map(i => i.rule),
        JSON.stringify(v),
      ).toContain('l10n-empty-ky')
    }
  })

  it('Russian is just as required as Kyrgyz (the languages are independent, in both directions)', () => {
    const b = validA2Bundle()
    delete holder(b, t)[t.ru]
    expect(errors(b).map(i => i.rule)).toContain('l10n-missing-ru')
    const c = validA2Bundle()
    holder(c, t)[t.ru] = ''
    expect(errors(c).map(i => i.rule)).toContain('l10n-empty-ru')
  })

  it('Kyrgyz that is merely a copy of the Russian cannot pass', () => {
    const b = validA2Bundle()
    const h = holder(b, t)
    h[t.ky] = h[t.ru]
    const found = run(b).filter(i => i.rule.startsWith('l10n-ky-equals-ru'))
    expect(found.length).toBe(1)
    // long text: an error; a single short word (a name or loanword may legitimately be identical): a review flag, never a silent pass
    expect(found[0].severity).toBe(shortRu(h[t.ru]) ? 'review' : 'error')
  })

  it('placeholder text is rejected', () => {
    const b = validA2Bundle()
    holder(b, t)[t.ky] = 'TODO'
    expect(errors(b).map(i => i.rule)).toContain('l10n-placeholder')
  })
})

describe('the Russian fallback cannot pass validation', () => {
  it('the app would fall back at runtime — the validator refuses the data that relies on it', () => {
    const b = validA2Bundle()
    const g = b.grammar.find(x => x.id === 'a2-concept-one') as { title: { ru: string; ky?: string } }
    delete g.title.ky
    expect(tr(g.title as never, 'ky')).toBe(g.title.ru) // what a Kyrgyz learner would silently get today
    expect(errors(b).some(i => i.rule === 'l10n-missing-ky' && i.where.startsWith('grammar:a2-concept-one'))).toBe(true)
  })

  it('the allow-list covers vocabulary only, by id, and is reported (not hidden)', () => {
    const b = validA2Bundle()
    const v = b.vocabulary.find(x => x.id === 'v11-1')!
    v.ky = v.ru
    expect(errors(b).map(i => i.rule)).toContain('l10n-ky-equals-ru')
    b.sameAsRu = ['v11-1']
    expect(errors(b)).toEqual([])
    expect(run(b).some(i => i.severity === 'info' && i.rule === 'l10n-ky-equals-ru-allowed')).toBe(true)
    // the same id does not excuse a sentence
    v.exampleKy = v.exampleRu
    expect(errors(b).map(i => i.rule)).toContain('l10n-ky-equals-ru')
  })

  it('identity is judged after trimming, collapsing spaces and ignoring case (no trivially "different" copies)', () => {
    const b = validA2Bundle()
    const v = b.vocabulary.find(x => x.id === 'v11-1')!
    v.ky = `  ${v.ru.toUpperCase()}  `
    expect(errors(b).map(i => i.rule)).toContain('l10n-ky-equals-ru')
  })
})

describe('plain German content may not be empty either', () => {
  it.each([
    ['vocabulary', (b: ContentBundle) => (b.vocabulary.find(v => v.id === 'v11-1')!.de = ' ')],
    ['grammar example', (b: ContentBundle) => (b.grammar.find(g => g.id === 'a2-concept-one')!.examples[0].de = '')],
    ['listening line', (b: ContentBundle) => (b.listening.find(l => l.id === 'a2-li-11-01')!.lines[0].text = '')],
    ['reading paragraph', (b: ContentBundle) => (b.reading.find(r => r.id === 'a2-re-11-01')!.body[1] = '')],
    ['speaking turn', (b: ContentBundle) => (b.speaking.find(s => s.id === 'a2-sp-11-01')!.turns[0].ai = '')],
    ['writing model', (b: ContentBundle) => (b.writing.find(w => w.id === 'a2-wr-11-01')!.model = '')],
  ])('%s', (_n, mutate) => {
    const b = validA2Bundle()
    mutate(b)
    expect(errors(b).some(i => i.rule === 'content-empty')).toBe(true)
  })
})

describe('A1 is unaffected', () => {
  it('the real content, with the course registry, has no errors', () => {
    expect(errors(emptyA2Bundle())).toEqual([])
  })

  it('A1 items without Kyrgyz are NOT failed: A1 localisation content is legacy and untouched (still only measured)', () => {
    const b = clone(validA2Bundle())
    const g = b.grammar.find(x => x.id === 'articles')!
    delete g.title.ky
    delete (b.vocabulary.find(v => v.id === 'v1-1') as unknown as { ky?: string }).ky
    expect(errors(b)).toEqual([])
    const info = run(b).find(i => i.rule === 'l10n-coverage')
    expect(info?.severity).toBe('info')
    expect(info?.message).toMatch(/\d+\/\d+ L10n strings have no Kyrgyz text/)
  })

  it('the Kyrgyz-coverage measurement of A1 is unchanged by the new rules and the A2 fixture', () => {
    expect(run(emptyA2Bundle()).find(i => i.rule === 'l10n-coverage')?.message).toBe(
      run(validA2Bundle()).find(i => i.rule === 'l10n-coverage')?.message,
    )
  })

  it('validating does not modify the bundle', () => {
    const b = validA2Bundle()
    const before = JSON.stringify(b)
    run(b)
    run(b, 'release')
    expect(JSON.stringify(b)).toBe(before)
  })
})
