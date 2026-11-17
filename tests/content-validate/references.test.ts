// @vitest-environment node
/**
 * Stage 6A — reference rules. Internal references stay inside a level; authored A2 material must declare its provenance, and the
 * declaration is checked (complete, well-formed, not a placeholder). The validator never invents a reference and never goes online.
 */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { isHttpUrl } from '../../scripts/content-validate/rules/references'
import type { ContentBundle, Issue } from '../../scripts/content-validate/types'
import { validateContent } from '../../scripts/content-validate/validate'
import type { ContentSource } from '../../src/data/types'
import { emptyA2Bundle, validA2Bundle } from './fixtures'

const run = (b: ContentBundle, mode: 'authoring' | 'release' = 'authoring'): Issue[] => validateContent(b, { mode })
const only = (b: ContentBundle, rule: string, mode: 'authoring' | 'release' = 'authoring') => run(b, mode).filter(i => i.rule === rule)

type Carrier = 'reading' | 'listening' | 'grammar' | 'writing' | 'speaking'
const CARRIERS: [Carrier, string][] = [
  ['reading', 'a2-re-11-01'],
  ['listening', 'a2-li-11-01'],
  ['grammar', 'a2-concept-one'],
  ['writing', 'a2-wr-11-01'],
  ['speaking', 'a2-sp-11-01'],
]
const setSource = (b: ContentBundle, c: Carrier, id: string, source: ContentSource | undefined) => {
  const item = (b[c] as unknown as { id: string; source?: ContentSource }[]).find(x => x.id === id)!
  if (source === undefined) delete item.source
  else item.source = source
}

afterEach(() => vi.unstubAllGlobals())

describe('provenance of authored A2 material', () => {
  it.each(CARRIERS)('%s: a missing `source` is flagged — a warning while authoring, an error for a release', (c, id) => {
    const b = validA2Bundle()
    setSource(b, c, id, undefined)
    const authoring = only(b, 'source-missing')
    expect(authoring).toHaveLength(1)
    expect(authoring[0].severity).toBe('warning')
    expect(authoring[0].where).toBe(`${c}:${id}`)
    expect(only(b, 'source-missing', 'release')[0].severity).toBe('error')
    expect(only(validA2Bundle('beta'), 'source-missing')).toEqual([]) // the fixture is complete...
    const beta = validA2Bundle('beta')
    setSource(beta, c, id, undefined)
    expect(only(beta, 'source-missing')[0].severity).toBe('error') // ...and a visible level can never lack provenance
  })

  it.each(CARRIERS)('%s: a malformed or incomplete declaration is an error', (c, id) => {
    const bad: [string, unknown, string][] = [
      ['unknown kind', { kind: 'made-up' }, 'source-malformed'],
      ['no kind', {}, 'source-malformed'],
      ['authored without an author', { kind: 'authored' }, 'source-malformed'],
      ['authored with a blank author', { kind: 'authored', author: '   ' }, 'source-malformed'],
      ['adapted without a citation', { kind: 'adapted', license: 'CC BY 4.0' }, 'source-malformed'],
      ['adapted without a licence', { kind: 'adapted', citation: 'Some Book, 2020' }, 'source-malformed'],
      ['external with neither', { kind: 'external' }, 'source-malformed'],
    ]
    for (const [name, source, rule] of bad) {
      const b = validA2Bundle()
      setSource(b, c, id, source as ContentSource)
      expect(
        run(b).some(i => i.rule === rule && i.severity === 'error' && i.where === `${c}:${id}`),
        name,
      ).toBe(true)
    }
  })

  it('placeholder provenance ("TODO", "unknown", "n/a") is rejected — nothing is invented to make validation pass', () => {
    for (const author of ['TODO', 'unknown', 'n/a', 'TBD', '???']) {
      const b = validA2Bundle()
      setSource(b, 'reading', 'a2-re-11-01', { kind: 'authored', author })
      expect(
        run(b).some(i => i.rule === 'source-placeholder' && i.severity === 'error'),
        author,
      ).toBe(true)
    }
    const c = validA2Bundle()
    setSource(c, 'reading', 'a2-re-11-01', { kind: 'external', citation: 'TODO', license: 'tbd', url: 'https://example.org/x' })
    expect(only(c, 'source-placeholder')).toHaveLength(2)
  })

  it('urls must be valid http(s) addresses', () => {
    for (const url of ['not a url', 'ftp://example.org/x', 'javascript:alert(1)', 'http://localhost', '//example.org', '']) {
      const b = validA2Bundle()
      setSource(b, 'reading', 'a2-re-11-01', { kind: 'external', citation: 'Real Book, 2020, p. 4', license: 'CC BY 4.0', url })
      expect(only(b, 'source-url-malformed').length, JSON.stringify(url)).toBe(1)
      expect(isHttpUrl(url)).toBe(false)
    }
    expect(isHttpUrl('https://www.example.org/a?b=1')).toBe(true)
  })

  it('a complete external source passes, with REVIEW flags for what cannot be verified offline', () => {
    const b = validA2Bundle()
    setSource(b, 'reading', 'a2-re-11-01', {
      kind: 'external',
      citation: 'Real Book, 2020, p. 4',
      license: 'CC BY 4.0',
      url: 'https://example.org/book',
    })
    expect(run(b).filter(i => i.severity === 'error')).toEqual([])
    expect(only(b, 'source-url-unchecked')[0].severity).toBe('review')
    const noUrl = validA2Bundle()
    setSource(noUrl, 'reading', 'a2-re-11-01', { kind: 'adapted', citation: 'Real Book, 2020, p. 4', license: 'CC BY 4.0' })
    expect(only(noUrl, 'source-unverifiable')[0].severity).toBe('review')
  })

  it('never goes to the network and never fills anything in (the validator is offline and read-only)', () => {
    const fetchSpy = vi.fn(() => Promise.reject(new Error('network is off limits')))
    vi.stubGlobal('fetch', fetchSpy)
    const b = validA2Bundle()
    setSource(b, 'reading', 'a2-re-11-01', {
      kind: 'external',
      citation: 'Real Book, 2020, p. 4',
      license: 'CC BY 4.0',
      url: 'https://example.org/book',
    })
    const before = JSON.stringify(b)
    run(b)
    run(b, 'release')
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(JSON.stringify(b)).toBe(before)
    const missing = validA2Bundle()
    setSource(missing, 'reading', 'a2-re-11-01', undefined)
    run(missing)
    expect((missing.reading.find(r => r.id === 'a2-re-11-01') as { source?: unknown }).source).toBeUndefined()
  })
})

describe('references stay inside a level', () => {
  it('an A2 unit may not list an A1 grammar concept; an A2 word may not relate to an A1 word', () => {
    const b = validA2Bundle()
    b.units.find(u => u.id === 11)!.grammarIds = ['a2-concept-one', 'articles']
    expect(only(b, 'ref-cross-level').map(i => i.where)).toEqual(['units:11'])
    const c = validA2Bundle()
    c.vocabulary.find(v => v.id === 'v11-1')!.related = ['v1-1']
    expect(only(c, 'ref-cross-level').map(i => i.where)).toEqual(['vocabulary:v11-1'])
  })

  it('an A2 handwritten exercise may not belong to an A1 concept (article drills share the first level\'s "articles" concept by design)', () => {
    const b = validA2Bundle()
    b.exercises.find(e => e.id === 'a2-ex-11-01')!.concept = 'perfekt'
    expect(only(b, 'ref-cross-level').map(i => i.where)).toEqual(['exercises:a2-ex-11-01'])
    const drill = validA2Bundle()
    drill.exercises.push({
      id: 'art-v11-1',
      type: 'article',
      unit: 11,
      concept: 'articles',
      prompt: 'Beispielwort1',
      options: ['der', 'die', 'das'],
      answer: 'der',
      why: { ru: 'x', ky: 'y' },
    })
    expect(only(drill, 'ref-cross-level')).toEqual([])
  })

  it('an A2 test may not point at a unit of another level', () => {
    const b = validA2Bundle()
    b.tests.find(t => t.id === 'unit-11')!.unit = 5
    expect(run(b).some(i => i.rule === 'ref-cross-level' && i.where === 'tests:unit-11')).toBe(true)
  })

  it('references to things that do not exist are still caught by the core rules', () => {
    const b = validA2Bundle()
    b.units.find(u => u.id === 11)!.grammarIds.push('ghost')
    b.vocabulary.find(v => v.id === 'v11-1')!.related = ['ghost']
    b.exercises.find(e => e.id === 'a2-ex-11-01')!.concept = 'ghost'
    expect(
      run(b)
        .filter(i => i.severity === 'error')
        .map(i => i.rule),
    ).toEqual(expect.arrayContaining(['ref-grammar', 'ref-vocab']))
  })
})

describe('A1 is unaffected', () => {
  it('A1 material has no `source` and is NOT flagged (provenance is required from A2 on)', () => {
    const issues = run(emptyA2Bundle())
    expect(issues.filter(i => i.rule.startsWith('source-'))).toEqual([])
    expect(issues.filter(i => i.rule === 'ref-cross-level')).toEqual([])
    expect(issues.filter(i => i.severity !== 'info')).toEqual([])
  })
})
