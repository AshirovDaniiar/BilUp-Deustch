import { describe, expect, it } from 'vitest'
import { currentBundle } from '../scripts/content-validate/bundle'
import { validateContent, type ContentBundle } from '../scripts/content-validate/validate'

const clone = (): ContentBundle => structuredClone(currentBundle())
const rules = (b: ContentBundle) =>
  validateContent(b)
    .filter(i => i.severity === 'error')
    .map(i => `${i.rule}|${i.where}`)

describe('content-validate skeleton: current src/data', () => {
  it('the shipped content has no id or reference-integrity errors', () => {
    expect(rules(currentBundle() as ContentBundle)).toEqual([])
  })

  it('reports (informational) how much content lacks Kyrgyz text', () => {
    const info = validateContent(currentBundle() as ContentBundle).find(i => i.rule === 'l10n-coverage')
    expect(info?.severity).toBe('info')
    expect(info?.message).toMatch(/\d+\/\d+ L10n strings have no Kyrgyz text/)
  })
})

describe('content-validate skeleton: it actually detects problems (mutation checks on a copy)', () => {
  it('duplicate ids', () => {
    const b = clone()
    b.vocabulary.push({ ...b.vocabulary[0] })
    expect(rules(b)).toContain(`unique-id|vocabulary`)
  })

  it('vocabulary pointing to a missing unit / missing related word', () => {
    const b = clone()
    b.vocabulary[0] = { ...b.vocabulary[0], unit: 999, related: ['does-not-exist'] }
    expect(rules(b)).toEqual(
      expect.arrayContaining([`ref-unit|vocabulary:${b.vocabulary[0].id}`, `ref-vocab|vocabulary:${b.vocabulary[0].id}`]),
    )
  })

  it('unit referencing a missing grammar concept', () => {
    const b = clone()
    b.units[0] = { ...b.units[0], grammarIds: [...b.units[0].grammarIds, 'ghost-concept'] }
    expect(rules(b)).toContain(`ref-grammar|units:${b.units[0].id}`)
  })

  it('exercise with missing concept, and choice answer not among the options', () => {
    const b = clone()
    const i = b.exercises.findIndex(e => e.type === 'choice' && e.options)
    b.exercises[i] = { ...b.exercises[i], concept: 'ghost', answer: '__nope__' }
    expect(rules(b)).toEqual(
      expect.arrayContaining([`ref-grammar|exercises:${b.exercises[i].id}`, `answer-in-options|exercises:${b.exercises[i].id}`]),
    )
  })

  it('listening question with an out-of-range answer index', () => {
    const b = clone()
    b.listening[0] = { ...b.listening[0], questions: [{ q: 'x', options: ['a', 'b'], answer: 5 }] }
    expect(rules(b)).toContain(`answer-index|listening:${b.listening[0].id}#0`)
  })

  it('real-life topic pointing to a missing speaking scenario', () => {
    const b = clone()
    b.realLife[0] = { ...b.realLife[0], speakingScenarioId: 'ghost' }
    expect(rules(b)).toContain(`ref-speaking|realLife:${b.realLife[0].id}`)
  })

  it('does not mutate the validated bundle', () => {
    const b = clone()
    const before = JSON.stringify(b)
    validateContent(b)
    expect(JSON.stringify(b)).toBe(before)
  })
})
