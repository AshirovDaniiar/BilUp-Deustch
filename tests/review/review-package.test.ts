// @vitest-environment node
/**
 * Stage 7A.3 — independent-review preparation. The review packages are generated from the shipped data and committed; these tests keep
 * them in step with the content, and prove that nothing in the tracker or the code records a human approval that did not happen.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { A2_REVIEWS } from '../../scripts/content-validate/reviews'
import { PACKAGE_FILES, cefrPackage, kyPackage } from '../../scripts/review/unit-package'
import { A2_INSTRUCTIONS } from '../../src/data/a2/instructions'
import {
  exercisesForUnit,
  finalTestOfUnit,
  grammarForUnit,
  listeningForUnit,
  readingForUnit,
  vocabularyForUnit,
} from '../../src/data/catalog'

const root = join(__dirname, '../..')
const read = (f: string) => readFileSync(join(root, f), 'utf8')
const TRACKER = 'docs/review/A2_UNIT11_REVIEW_TRACKER.md'

describe('the committed packages equal the shipped content (regenerate with `npm run review:package`)', () => {
  it('CEFR package is up to date', () => expect(read(PACKAGE_FILES.cefr)).toBe(cefrPackage(11)))
  it('Kyrgyz package is up to date', () => expect(read(PACKAGE_FILES.ky)).toBe(kyPackage(11)))
  it('generation is deterministic and the fingerprint reflects the content', () => {
    expect(cefrPackage(11)).toBe(cefrPackage(11))
    expect(cefrPackage(11).match(/fingerprint: `([0-9a-f]{12})`/)).not.toBeNull()
    expect(kyPackage(11).match(/fingerprint: `([0-9a-f]{12})`/)).not.toBeNull()
  })
})

describe('CEFR package completeness', () => {
  const doc = cefrPackage(11)
  it('contains every vocabulary item, every grammar example, every listening line, every reading paragraph, every exercise and every final-test question', () => {
    for (const v of vocabularyForUnit(11)) {
      expect(doc, v.id).toContain(v.de)
      expect(doc, v.id).toContain(v.example)
    }
    for (const g of grammarForUnit(11)) {
      expect(doc).toContain(g.id)
      for (const e of g.examples) expect(doc).toContain(e.de)
      for (const m of g.mistakes) expect(doc).toContain(m.wrong)
    }
    for (const l of listeningForUnit(11)) for (const x of l.lines) expect(doc).toContain(x.text)
    for (const r of readingForUnit(11)) for (const p of r.body) expect(doc).toContain(p)
    for (const e of exercisesForUnit(11)) expect(doc).toContain(e.id)
    for (const q of finalTestOfUnit(11)!.questions) {
      expect(doc).toContain(q.id)
      expect(doc).toContain(q.answer)
    }
  })
  it('lists F1–F11 and the remaining questions, with empty reviewer columns (no pre-filled verdicts)', () => {
    for (let i = 1; i <= 11; i++) expect(doc).toContain(`| F${i} |`)
    expect(doc).toContain('## 12. Remaining CEFR questions')
    expect(doc).toContain('☐ approved')
    expect(doc).not.toContain('☑')
    expect(doc).not.toMatch(/\[x\]/i)
  })
  it('states that no person has reviewed it', () => expect(doc).toContain('not yet reviewed by any person'))
})

describe('Kyrgyz package completeness', () => {
  const doc = kyPackage(11)
  it('contains every Kyrgyz learning instruction, every vocabulary translation and every listening translation', () => {
    for (const i of A2_INSTRUCTIONS.filter(x => x.unit === 11)) expect(doc, i.id).toContain(i.text.ky.replace(/\|/g, '\\|'))
    for (const v of vocabularyForUnit(11)) {
      expect(doc, v.id).toContain(v.ky)
      expect(doc, v.id).toContain(v.exampleKy!)
    }
    for (const l of listeningForUnit(11)) for (const x of l.lines) expect(doc).toContain(x.ky!)
    for (const g of grammarForUnit(11)) {
      expect(doc).toContain(g.summary.ky!)
      for (const m of g.mistakes) expect(doc).toContain(m.note.ky!)
    }
    for (const e of exercisesForUnit(11)) expect(doc).toContain(e.why.ky!)
    for (const q of finalTestOfUnit(11)!.questions) expect(doc).toContain(q.why.ky)
  })
  it('lists the nine unresolved items and the nine applied corrections', () => {
    for (const k of ['K4', 'K7', 'K8', 'K9', 'K12', 'K13', 'K14', 'K16', 'K18']) expect(doc, k).toContain(`| ${k} |`)
    for (const k of ['K1', 'K2', 'K3', 'K5', 'K6', 'K10', 'K11', 'K15', 'K17']) expect(doc, k).toContain(`| ${k} |`)
  })
  it('has an empty decision column for every field (272 fields) and states that no native speaker has reviewed it', () => {
    expect(doc).toContain('**Total fields in the table above: 272.**')
    expect(doc).toContain('no native speaker has reviewed it')
    const fieldRows = doc.split('\n').filter(l => /^\| \d+ \| /.test(l))
    expect(fieldRows).toHaveLength(272)
    for (const l of fieldRows) expect(l.endsWith('|  |'), l.slice(0, 60)).toBe(true) // last column (decision) is empty
  })
})

describe('the tracker records no review', () => {
  const t = read(TRACKER)
  it('exists, says NOT STARTED, and every checklist status is NOT STARTED', () => {
    expect(existsSync(join(root, TRACKER))).toBe(true)
    expect(t).toContain('NOT STARTED')
    const statusCells = t.split('\n').filter(l => /^\| (C\d+|K-\w+) \|/.test(l))
    expect(statusCells.length).toBe(15 + 14)
    for (const l of statusCells) expect(l, l.slice(0, 50)).toContain('| NOT STARTED |')
  })
  it('has empty reviewer names, dates, fingerprints and ticked boxes', () => {
    expect(t).not.toMatch(/\|\s*(APPROVED|CHANGES REQUESTED|REJECTED|IN PROGRESS)\s*\|/) // only listed as legend, never as a recorded status
    expect(t).not.toContain('☑')
    expect(t).not.toMatch(/\[x\]/i)
    for (const field of ['Reviewer name', 'Review start date', 'Review completion date', 'Package fingerprint reviewed'])
      for (const l of t.split('\n').filter(x => x.startsWith(`| ${field} |`))) expect(l, l).toMatch(/\|\s*\|$/)
    const signoff = t.split('\n').filter(l => /^\| (CEFR \(|Russian \||Kyrgyz \|)/.test(l) && l.includes('NOT STARTED'))
    expect(signoff).toHaveLength(3)
    for (const l of signoff) expect(l).toMatch(/\|\s*\|\s*\|\s*\|\s*NOT STARTED\s*\|$/)
  })
  it('tells the reader that only a person records sign-off', () => {
    expect(t).toContain('only by the people who performed the review')
    expect(t).toContain('not the authoring assistant')
  })
})

describe('no sign-off exists anywhere in the code', () => {
  it('A2_REVIEWS is empty', () => expect(A2_REVIEWS).toEqual({}))
})
