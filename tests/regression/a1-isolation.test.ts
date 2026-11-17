// @vitest-environment node
/**
 * A2 CONTENT CANNOT LEAK INTO A1 CONSUMERS (A2 plan, Stage 2).
 *
 * The strongest form of the guarantee: fill the A2 modules with fake content (a unit, vocabulary, an exercise, a listening
 * dialogue, a speaking scenario map entry), then re-run the whole A1 characterization (progress maths, seeded daily challenge,
 * every A1 test, unit reviews, concept questions) and require it to equal the Stage 0 baseline byte for byte.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { A2_EXERCISES } from '../../src/data/a2/exercises'
import { A2_LISTENING } from '../../src/data/a2/listening'
import { A2_UNITS, A2_UNIT_SPEAKING } from '../../src/data/a2/units'
import { A2_VOCABULARY } from '../../src/data/a2/vocabulary'
import type { Exercise, LearningUnit, ListeningExercise, VocabularyItem } from '../../src/data/types'
import { computeProgressBehaviour, computeQuestionBehaviour, computeSelectors } from './a1-snapshot'

const baseline = JSON.parse(readFileSync(join(__dirname, 'baselines/a1-behaviour.json'), 'utf8')) as {
  progress: ReturnType<typeof computeProgressBehaviour>
  questions: ReturnType<typeof computeQuestionBehaviour>
}
const selectorsBaseline = JSON.parse(readFileSync(join(__dirname, 'baselines/a1-selectors.json'), 'utf8')) as ReturnType<
  typeof computeSelectors
>

function withFakeA2<T>(fn: () => T): T {
  const unit = {
    id: 11,
    level: 'A2',
    title: 'Fake',
    subtitle: { ru: 'r', ky: 'k' },
    icon: '·',
    grammarIds: ['fake-concept'],
  } as LearningUnit
  const vocab = {
    id: 'v11-1',
    unit: 11,
    pos: 'noun',
    article: 'das',
    de: 'Beispiel',
    ru: 'пример',
    ky: 'мисал',
    example: 'x',
    exampleRu: 'x',
    related: [],
  } as VocabularyItem
  const ex = {
    id: 'a2-ex-1',
    type: 'fill',
    unit: 11,
    prompt: 'x ___',
    answer: 'a',
    options: ['a', 'b'],
    why: { ru: 'r', ky: 'k' },
  } as Exercise
  const lis = {
    id: 'a2-li-1',
    level: 'A2',
    unit: 11,
    title: 't',
    lines: [{ speaker: 's', text: 'Hallo', ru: 'Привет' }],
    questions: [{ q: 'q', options: ['a', 'b'], answer: 0 }],
    keywords: [],
  } as ListeningExercise
  A2_UNITS.push(unit)
  A2_VOCABULARY.push(vocab)
  A2_EXERCISES.push(ex)
  A2_LISTENING.push(lis)
  A2_UNIT_SPEAKING.push('fake-scenario')
  try {
    return fn()
  } finally {
    for (const arr of [A2_UNITS, A2_VOCABULARY, A2_EXERCISES, A2_LISTENING, A2_UNIT_SPEAKING] as unknown[][]) arr.length = 0
  }
}

describe('A2 content cannot leak into A1 consumers', () => {
  it('with A2 content present, A1 progress maths, required sections, badges, recommendations and word stages equal the Stage 0 baseline', () => {
    expect(withFakeA2(() => computeProgressBehaviour())).toEqual(baseline.progress)
  })

  it('with A2 content present, the seeded daily challenge, every A1 test, unit reviews and concept questions equal the Stage 0 baseline', () => {
    expect(withFakeA2(() => computeQuestionBehaviour())).toEqual(baseline.questions)
  })

  it('with A2 content present, the A1 selector baseline is unchanged', () => {
    expect(withFakeA2(() => computeSelectors())).toEqual(selectorsBaseline)
  })

  it('the temporary content is really gone afterwards', () => {
    withFakeA2(() => undefined)
    expect([A2_UNITS, A2_VOCABULARY, A2_EXERCISES, A2_LISTENING, A2_UNIT_SPEAKING].map(a => a.length)).toEqual([0, 0, 0, 0, 0])
  })
})
