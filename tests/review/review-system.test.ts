// @vitest-environment node
/**
 * Stage 8A — the reusable A2 human-review system (units 11–20, three independent dimensions). These tests prove: every unit builds all three packages with the
 * required content; fingerprints detect changes and stay per dimension; an approval needs a real, complete, current human record; dimensions are independent;
 * no A1 data and no Russian fallback in a Kyrgyz package; the committed packages and records match the shipped data and record NO approval.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { A2_REVIEWS } from '../../scripts/content-validate/reviews'
import {
  DIMENSIONS,
  REVIEW_UNITS,
  STATUSES,
  approvedDimensions,
  buildModel,
  collectUnit,
  emptyRecord,
  evaluateRecord,
  fingerprintOf,
  packageMarkdown,
  packagePath,
  recordPath,
  reviewModel,
  type Dimension,
  type ReviewRecord,
} from '../../scripts/review/system'
import { cefrPackage, kyPackage } from '../../scripts/review/unit-package'
import { vocabularyOf } from '../../src/data/catalog'
import { COURSE } from '../../src/data/course'

const root = join(__dirname, '../..')
const read = (f: string) => readFileSync(join(root, f), 'utf8')
const fps = (u: number): Record<Dimension, string> => ({
  'de-cefr': fingerprintOf(reviewModel(u, 'de-cefr')),
  'ru-localization': fingerprintOf(reviewModel(u, 'ru-localization')),
  'ky-localization': fingerprintOf(reviewModel(u, 'ky-localization')),
})
const approvedRecord = (fp: string, d: Dimension = 'ru-localization'): ReviewRecord => ({
  ...emptyRecord(11, 'T', d),
  status: 'approved',
  reviewer: { name: 'Anna Example', qualification: 'native speaker, translator' },
  reviewDate: '2026-01-15',
  reviewedFingerprint: fp,
})

describe('every unit 11–20 builds all three review packages with the required content', () => {
  it('the system covers exactly units 11–20 and the three dimensions', () => {
    expect([...REVIEW_UNITS]).toEqual([11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    expect([...DIMENSIONS]).toEqual(['de-cefr', 'ru-localization', 'ky-localization'])
    expect([...STATUSES]).toEqual(['pending', 'in_review', 'changes_requested', 'approved'])
  })
  for (const u of REVIEW_UNITS) {
    it(`unit ${u}: three packages, each with the required sections and every item of the unit`, () => {
      const data = collectUnit(u)
      for (const d of DIMENSIONS) {
        const m = buildModel(data, d)
        expect(m.unit).toBe(u)
        expect(m.title).toBe(data.unit.title)
        const ids = m.sections.map(s => s.id)
        const required =
          d === 'de-cefr'
            ? ['unit', 'vocabulary', 'grammar', 'why-notes', 'listening', 'reading', 'speaking', 'writing', 'exercises', 'final-test']
            : [
                ...['unit', 'vocabulary', 'grammar', 'why-notes', 'listening', 'reading', 'speaking', 'writing', 'exercises', 'final-test'],
                'instructions',
              ]
        for (const s of required) expect(ids, `${u} ${d}`).toContain(s)
        const refs = new Set(m.sections.flatMap(s => s.rows.map(r => r.ref)))
        for (const v of data.vocab) expect(refs.has(`${v.id}.word`), v.id).toBe(true)
        for (const g of data.grammar) expect(refs.has(`${g.id}.title`), g.id).toBe(true)
        for (const l of data.listening) expect(refs.has(`${l.id}#${l.lines.length}`), l.id).toBe(true)
        for (const r of data.reading) expect(refs.has(`${r.id}#${r.body.length}`) || d !== 'de-cefr', r.id).toBe(true) // German-only paragraphs belong to the de-cefr package
        expect(refs.has(`${data.speaking.id}.goal`) || d === 'de-cefr').toBe(true)
        expect(refs.has(`${data.writing.id}.model`) || d !== 'de-cefr').toBe(true)
        for (const e of data.exercises) expect(refs.has(`${e.id}.prompt`), e.id).toBe(true)
        for (const q of data.final.questions) expect(refs.has(`${q.id}.prompt`), q.id).toBe(true)
        expect(data.final.questions).toHaveLength(15)
        expect(data.exercises).toHaveLength(8)
        expect(fingerprintOf(m)).toMatch(/^[0-9a-f]{12}$/)
        const doc = packageMarkdown(m)
        expect(doc).toContain(`Unit ${u}`)
        expect(doc).toContain(`\`${d}\``)
        expect(doc).toContain(fingerprintOf(m))
        expect(doc).toContain('not reviewed by any person')
      }
    })
  }
  it('the de-cefr package contains the German items and the receptive classification; the localization packages contain the German source next to the translation', () => {
    const de = packageMarkdown(reviewModel(20, 'de-cefr'))
    expect(de).toContain('recognition')
    expect(de).toContain('Wie wäre es mit einem Kaffee?')
    const ru = packageMarkdown(reviewModel(20, 'ru-localization'))
    expect(ru).toContain('Wie wäre es mit einem Kaffee?')
    expect(ru).toContain('Как насчёт кофе?')
  })
})

describe('fingerprints detect content changes and are independent per dimension', () => {
  const base = fps(20)
  it('are deterministic and different for the three dimensions', () => {
    expect(fps(20)).toEqual(base)
    expect(new Set(Object.values(base)).size).toBe(3)
    for (const u of REVIEW_UNITS) expect(new Set(Object.values(fps(u))).size).toBe(3)
  })
  it('a change of the German text changes all three', () => {
    const d = collectUnit(20)
    d.vocab[0].example += ' x'
    for (const dim of DIMENSIONS) expect(fingerprintOf(buildModel(d, dim)), dim).not.toBe(base[dim])
  })
  it('a change of the German-only part (a reading question) changes only the German package', () => {
    const d = collectUnit(20)
    d.reading[0].questions[0].q += ' x'
    expect(fingerprintOf(buildModel(d, 'de-cefr'))).not.toBe(base['de-cefr'])
    expect(fingerprintOf(buildModel(d, 'ru-localization'))).toBe(base['ru-localization'])
    expect(fingerprintOf(buildModel(d, 'ky-localization'))).toBe(base['ky-localization'])
  })
  it('a change of the Russian text changes only the Russian package', () => {
    const d = collectUnit(20)
    d.vocab[3].ru += ' x'
    d.final.questions[0].why.ru += ' x'
    expect(fingerprintOf(buildModel(d, 'ru-localization'))).not.toBe(base['ru-localization'])
    expect(fingerprintOf(buildModel(d, 'ky-localization'))).toBe(base['ky-localization'])
    expect(fingerprintOf(buildModel(d, 'de-cefr'))).toBe(base['de-cefr'])
  })
  it('a change of the Kyrgyz text changes only the Kyrgyz package', () => {
    const d = collectUnit(20)
    d.listening[0].lines[2].ky += ' x'
    d.grammar[1].summary.ky += ' x'
    expect(fingerprintOf(buildModel(d, 'ky-localization'))).not.toBe(base['ky-localization'])
    expect(fingerprintOf(buildModel(d, 'ru-localization'))).toBe(base['ru-localization'])
    expect(fingerprintOf(buildModel(d, 'de-cefr'))).toBe(base['de-cefr'])
  })
  it('the collected data is a copy: mutating it never changes the shipped content', () => {
    const d = collectUnit(20)
    d.vocab[0].ky = 'changed'
    expect(collectUnit(20).vocab[0].ky).not.toBe('changed')
    expect(fps(20)).toEqual(base)
  })
})

describe('approval rules: a human record, complete, for the current content', () => {
  const fp = fps(11)['ru-localization']
  it('a complete human record for the current fingerprint is approved', () => {
    const e = evaluateRecord(approvedRecord(fp), fp)
    expect(e).toEqual({ approved: true, stale: false, problems: [] })
  })
  it('a pending or empty record is never approved', () => {
    expect(evaluateRecord(emptyRecord(11, 'T', 'ru-localization'), fp).approved).toBe(false)
    expect(evaluateRecord({ ...emptyRecord(11, 'T', 'ru-localization'), status: 'in_review' }, fp).approved).toBe(false)
  })
  it('missing reviewer information prevents approval (name, qualification, date, fingerprint — each on its own)', () => {
    const r = approvedRecord(fp)
    for (const broken of [
      { ...r, reviewer: { ...r.reviewer, name: '' } },
      { ...r, reviewer: { ...r.reviewer, qualification: '  ' } },
      { ...r, reviewDate: '' },
      { ...r, reviewDate: '15.01.2026' },
      { ...r, reviewDate: '2026-13-45' },
      { ...r, reviewedFingerprint: '' },
    ]) {
      const e = evaluateRecord(broken, fp)
      expect(e.approved, JSON.stringify(broken)).toBe(false)
      expect(e.problems.length).toBeGreaterThan(0)
    }
  })
  it('an AI or automated "reviewer" can never approve', () => {
    for (const name of ['Claude', 'ChatGPT', 'GPT-4', 'AI assistant', 'automated check', 'Gemini', 'review bot'])
      expect(evaluateRecord({ ...approvedRecord(fp), reviewer: { name, qualification: 'native speaker' } }, fp).approved, name).toBe(false)
  })
  it('a change of the content invalidates the earlier approval (stale), and only regenerating + reviewing again restores it', () => {
    const d = collectUnit(11)
    d.vocab[0].ru += ' x'
    const changed = fingerprintOf(buildModel(d, 'ru-localization'))
    expect(changed).not.toBe(fp)
    const e = evaluateRecord(approvedRecord(fp), changed)
    expect(e.approved).toBe(false)
    expect(e.stale).toBe(true)
    expect(evaluateRecord(approvedRecord(changed), changed).approved).toBe(true)
  })
  it('open blocker / major findings prevent approval; minor findings and resolved ones do not; changes_requested needs an open finding', () => {
    const f = (severity: 'blocker' | 'major' | 'minor' | 'suggestion', status: 'open' | 'resolved') => ({
      id: 'F1',
      ref: 'v11-1.word',
      severity,
      comment: 'c',
      status,
    })
    expect(evaluateRecord({ ...approvedRecord(fp), findings: [f('major', 'open')] }, fp).approved).toBe(false)
    expect(evaluateRecord({ ...approvedRecord(fp), findings: [f('blocker', 'open')] }, fp).approved).toBe(false)
    expect(
      evaluateRecord({ ...approvedRecord(fp), findings: [f('major', 'resolved'), f('minor', 'open'), f('suggestion', 'open')] }, fp)
        .approved,
    ).toBe(true)
    const cr: ReviewRecord = { ...approvedRecord(fp), status: 'changes_requested' }
    expect(evaluateRecord(cr, fp).approved).toBe(false)
    expect(evaluateRecord(cr, fp).problems.join(' ')).toMatch(/at least one open finding/)
    expect(evaluateRecord({ ...cr, findings: [f('major', 'open')] }, fp).problems).toEqual([])
  })
  it('an unknown status is rejected', () => {
    expect(evaluateRecord({ ...approvedRecord(fp), status: 'done' as never }, fp).approved).toBe(false)
  })
})

describe('the three review dimensions are independent', () => {
  it('an approved Russian package implies neither Kyrgyz nor German approval', () => {
    const f = fps(11)
    const records = [emptyRecord(11, 'T', 'de-cefr'), approvedRecord(f['ru-localization']), emptyRecord(11, 'T', 'ky-localization')]
    expect(approvedDimensions(records, f)).toEqual(['ru-localization'])
    expect(approvedDimensions([approvedRecord(f['ky-localization'], 'ky-localization')], f)).toEqual(['ky-localization'])
    expect(approvedDimensions([approvedRecord(f['de-cefr'], 'de-cefr')], f)).toEqual(['de-cefr'])
  })
  it('an approval carrying the fingerprint of ANOTHER dimension does not count', () => {
    const f = fps(11)
    expect(approvedDimensions([approvedRecord(f['ky-localization'], 'ru-localization')], f)).toEqual([])
  })
  it('a Kyrgyz change leaves an approved Russian review valid; a Russian change leaves an approved Kyrgyz review valid', () => {
    const before = fps(12)
    const d = collectUnit(12)
    d.vocab[0].ky += ' x'
    const afterKy = {
      ...before,
      'ky-localization': fingerprintOf(buildModel(d, 'ky-localization')),
      'ru-localization': fingerprintOf(buildModel(d, 'ru-localization')),
    }
    expect(afterKy['ru-localization']).toBe(before['ru-localization'])
    expect(approvedDimensions([approvedRecord(before['ru-localization'])], afterKy)).toEqual(['ru-localization'])
    expect(approvedDimensions([approvedRecord(before['ky-localization'], 'ky-localization')], afterKy)).toEqual([])
  })
})

describe('no A1 data and no Russian fallback in Kyrgyz', () => {
  it('every row reference of every package belongs to the unit (A2 ids of that unit; never an A1 id)', () => {
    const a1ids = new Set(vocabularyOf('A1').map(v => v.id))
    for (const u of REVIEW_UNITS)
      for (const d of DIMENSIONS)
        for (const s of reviewModel(u, d).sections)
          for (const r of s.rows) {
            expect(a1ids.has(r.ref.split('.')[0]), r.ref).toBe(false)
            expect(r.ref, r.ref).toMatch(new RegExp(`(^|-|#|\\.|:)(v${u}-|a2-[a-z]+-${u}-|unit-${u}\\.|a2-in-${u}-|a2-)`))
          }
  })
  it('a Kyrgyz package shows no Russian text and a Russian package no Kyrgyz text', () => {
    for (const u of REVIEW_UNITS) {
      const d = collectUnit(u)
      const ky = packageMarkdown(buildModel(d, 'ky-localization'))
      const ru = packageMarkdown(buildModel(d, 'ru-localization'))
      for (const v of d.vocab) {
        if (v.ru !== v.ky) {
          expect(ky.includes(`| ${v.ru} |`), `${v.id}: Russian gloss inside the Kyrgyz package`).toBe(false)
          expect(ru.includes(`| ${v.ky} |`), `${v.id}: Kyrgyz gloss inside the Russian package`).toBe(false)
        }
        expect(ky).toContain(v.ky)
        expect(ru).toContain(v.ru)
      }
      for (const i of d.instructions) {
        expect(ky).toContain(i.text.ky)
        expect(ky.includes(i.text.ru)).toBe(false)
      }
    }
  })
  it('every Kyrgyz field of the package is non-empty and is not a copy of the Russian field', () => {
    for (const u of REVIEW_UNITS) {
      const d = collectUnit(u)
      const kyRows = buildModel(d, 'ky-localization')
        .sections.flatMap(s => s.rows)
        .filter(r => r.value !== '')
      expect(kyRows.length).toBeGreaterThan(200)
      const ruMap = new Map(
        buildModel(d, 'ru-localization')
          .sections.flatMap(s => s.rows)
          .map(r => [r.ref, r.value]),
      )
      for (const r of kyRows) {
        expect(r.value.trim(), r.ref).not.toBe('')
        const ru = ruMap.get(r.ref)
        // identical short strings (a loan word, a number) are tolerated for one-word glosses only; longer copies are a fallback
        if (ru && r.value.split(/\s+/).length > 2) expect(r.value, `${u} ${r.ref}: Kyrgyz equals Russian`).not.toBe(ru)
      }
    }
  })
  it('no row of a localization package is empty on the localized side where the German source has a localized field', () => {
    for (const u of REVIEW_UNITS)
      for (const dim of ['ru-localization', 'ky-localization'] as const)
        for (const s of reviewModel(u, dim).sections)
          for (const r of s.rows)
            if (s.id !== 'unit' && !['title'].includes(r.label)) expect(r.value.trim(), `${dim} ${r.ref}`).not.toBe('')
  })
})

describe('the committed packages and records match the shipped data and record NO approval', () => {
  it('all 30 packages exist and equal the generated text (regenerate with `npm run review:system`)', () => {
    for (const u of REVIEW_UNITS)
      for (const d of DIMENSIONS) {
        expect(existsSync(join(root, packagePath(u, d))), packagePath(u, d)).toBe(true)
        expect(read(packagePath(u, d)), packagePath(u, d)).toBe(packageMarkdown(reviewModel(u, d)))
      }
  })
  it('every unit has a records file with exactly the three dimensions, all pending, no reviewer, no date, no fingerprint, no findings', () => {
    for (const u of REVIEW_UNITS) {
      const recs = JSON.parse(read(recordPath(u))) as ReviewRecord[]
      expect(recs.map(r => r.dimension)).toEqual(['de-cefr', 'ru-localization', 'ky-localization'])
      for (const r of recs) {
        expect(r.unit).toBe(u)
        expect(r.status).toBe('pending')
        expect(r.reviewer).toEqual({ name: '', qualification: '' })
        expect(r.reviewDate).toBe('')
        expect(r.reviewedFingerprint).toBe('')
        expect(r.findings).toEqual([])
        expect(evaluateRecord(r, fps(u)[r.dimension]).approved).toBe(false)
      }
    }
  })
  it('nothing is approved anywhere: A2_REVIEWS stays empty (A2 is in Beta with the reviews pending)', () => {
    expect(A2_REVIEWS).toEqual({})
    expect(COURSE.levels.find(l => l.id === 'A2')).toMatchObject({ status: 'beta', releasedLocales: ['ru', 'ky'] })
  })
  it('the Unit 11 packages and the locked review-package fingerprints are untouched by the new system', () => {
    const fp = (p: string) => /fingerprint: `([0-9a-f]{12})`/.exec(p)![1]
    expect([fp(cefrPackage(11)), fp(kyPackage(11))]).toEqual(['502db4af8249', 'dd636659c06f'])
    expect([fp(cefrPackage(20)), fp(kyPackage(20))]).toEqual(['3d596de6c98d', '4672a7bd87b7'])
  })
})

describe('no Russian-language metadata leaks into the German or Kyrgyz packages', () => {
  it('the Russian "focus" notes of grammar examples appear in no package', () => {
    for (const u of REVIEW_UNITS) {
      const d = collectUnit(u)
      for (const dim of DIMENSIONS) {
        const doc = packageMarkdown(buildModel(d, dim))
        for (const g of d.grammar)
          for (const e of g.examples)
            if (e.focus && /[а-яё]/i.test(e.focus)) expect(doc.includes(`| ${e.focus} |`), `${u} ${dim}: ${e.focus}`).toBe(false)
      }
    }
  })
})
