// @vitest-environment jsdom
/**
 * Stage 9C — independent Russian and Kyrgyz output of every A2 assessment and practice flow: language-aware builders, listening / reading explanations,
 * the daily challenge, vocabulary tests, /practice/review, unit tests, the reading and listening labs, the assessment i18n keys, and unchanged A1 behaviour.
 * A2 content is loaded through `tests/load-a2.ts` (test-only; visibility is switched on inside single tests and always restored).
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import '../load-a2'
import { AppProvider } from '../../src/app/store'
import { listeningOf, readingOf, testsOf, vocabularyOf } from '../../src/data/catalog'
import { COURSE } from '../../src/data/course'
import { TESTS } from '../../src/data/reallife'
import type { TestDef, VocabularyItem } from '../../src/data/types'
import { QuizRunner } from '../../src/features/tests/QuizRunner'
import * as Q from '../../src/features/tests/questions'
import { dictionaries } from '../../src/i18n'
import { ReadingView } from '../../src/features/reading/ReadingLab'
import { defaultProgress } from '../../src/storage/defaults'
import { seeded } from '../../src/utils/random'
import { KEY } from '../helpers'

const calls = vi.hoisted(() => ({
  buildTest: [] as unknown[][],
  unitReview: [] as unknown[][],
  vocab: [] as unknown[][],
  daily: [] as unknown[][],
}))
vi.mock('../../src/features/tests/questions', async importOriginal => {
  const m = await importOriginal<typeof import('../../src/features/tests/questions')>()
  return {
    ...m,
    buildTest: (...a: Parameters<typeof m.buildTest>) => (calls.buildTest.push(a), m.buildTest(...a)),
    unitReviewQuestions: (...a: Parameters<typeof m.unitReviewQuestions>) => (calls.unitReview.push(a), m.unitReviewQuestions(...a)),
    vocabQuestion: (...a: Parameters<typeof m.vocabQuestion>) => (calls.vocab.push(a), m.vocabQuestion(...a)),
    buildLevelDaily: (...a: Parameters<typeof m.buildLevelDaily>) => (calls.daily.push(a), m.buildLevelDaily(...a)),
  }
})
import { DailyScreen, ReviewScreen, TestRunnerPage } from '../../src/screens/PracticeScreens'

const a2 = () => COURSE.levels.find(l => l.id === 'A2') as unknown as { status: string; releasedLocales: string[] }
const defOf = (kind: TestDef['kind'], size = 12, unit?: number): TestDef => ({
  id: `x-${kind}`,
  title: { ru: 'x' },
  kind,
  level: 'A2',
  size,
  ...(unit ? { unit } : {}),
})
const VOC = vocabularyOf('A2')
const A2_WORD = VOC.find(v => v.ru !== v.ky)!
const A1_WORD = { ...A2_WORD, unit: 3, id: 'v3-test' } as VocabularyItem // a unit of A1: the legacy question must not change
const kyGlosses = new Set(VOC.map(v => v.ky))
const ruOnly = new Set(
  VOC.filter(v => v.ru !== v.ky)
    .map(v => v.ru)
    .filter(g => !kyGlosses.has(g)),
)
const RU_TEMPLATES = [dictionaries.ru.qMeaning.split('{w}')[0], dictionaries.ru.qGerman.split('{w}')[0]]

beforeEach(() => {
  window.scrollTo = () => undefined
  localStorage.clear()
  for (const k of Object.keys(calls) as (keyof typeof calls)[]) calls[k].length = 0
})
afterEach(() => {
  cleanup()
  Object.assign(a2(), { status: 'planned', releasedLocales: [] })
})

describe('language-aware vocabulary questions', () => {
  it('Russian learner: Russian prompt, Russian options, strict, explanation in both languages (shown strictly)', () => {
    const q = Q.vocabQuestion(A2_WORD, 0, seeded('a'), 'ru')
    expect(q.strict).toBe(true)
    expect(q.prompt).toBe(dictionaries.ru.qMeaning.replace('{w}', q.prompt.slice(q.prompt.indexOf('«') + 1, q.prompt.indexOf('»'))))
    expect(q.answer).toBe(A2_WORD.ru)
    expect(q.options).toContain(A2_WORD.ru)
    expect(q.why?.ru).toContain(A2_WORD.ru)
    expect(q.why?.ky).toContain(A2_WORD.ky)
    expect(Q.questionWhy(q, 'ru')).toContain(A2_WORD.ru)
  })
  it('Kyrgyz learner: Kyrgyz prompt, Kyrgyz options, Kyrgyz explanation — and nothing Russian', () => {
    const q = Q.vocabQuestion(A2_WORD, 0, seeded('a'), 'ky')
    expect(q.strict).toBe(true)
    expect(q.prompt.startsWith(dictionaries.ky.qMeaning.split('{w}')[0])).toBe(true)
    for (const t of RU_TEMPLATES) expect(q.prompt.includes(t)).toBe(false)
    expect(q.answer).toBe(A2_WORD.ky)
    for (const o of q.options ?? []) expect(ruOnly.has(o), `Russian gloss "${o}" among Kyrgyz options`).toBe(false)
    const why = Q.questionWhy(q, 'ky')!
    expect(why).toContain(A2_WORD.ky)
    expect(why).toContain(dictionaries.ky.qWordIs.split('{w}')[1].split('{g}')[0])
    expect(why.includes(A2_WORD.ru)).toBe(A2_WORD.ky.includes(A2_WORD.ru))
    expect(q.promptRu).toBeUndefined()
  })
  it('the other direction (German answer): the prompt carries the learner-language gloss, the options are German', () => {
    for (const lang of ['ru', 'ky'] as const) {
      const q = Q.vocabQuestion(A2_WORD, 1, seeded('b'), lang)
      expect(q.prompt).toContain(lang === 'ky' ? A2_WORD.ky : A2_WORD.ru)
      expect(q.options).toContain(q.answer)
      expect(q.options!.filter(o => o === q.answer)).toHaveLength(1)
    }
  })
  it('the same word and seed give the same question skeleton in both languages (only the language differs)', () => {
    const ru = Q.vocabQuestion(A2_WORD, 0, seeded('s'), 'ru')
    const ky = Q.vocabQuestion(A2_WORD, 0, seeded('s'), 'ky')
    expect(ru.id).toBe(ky.id)
    expect(ru.vocabId).toBe(ky.vocabId)
    expect(ru.options).toHaveLength(ky.options!.length)
  })
  it('A1 behaviour unchanged: an A1 word, with or without a language, is exactly the legacy Russian question; an A2 word without a language too', () => {
    const legacy = Q.vocabQuestion(A1_WORD, 0, seeded('z'))
    expect(Q.vocabQuestion(A1_WORD, 0, seeded('z'), 'ky')).toEqual(legacy)
    expect(Q.vocabQuestion(A1_WORD, 0, seeded('z'), 'ru')).toEqual(legacy)
    expect(legacy.strict).toBeUndefined()
    expect(legacy.prompt.startsWith('Что значит')).toBe(true)
    const noLang = Q.vocabQuestion(A2_WORD, 0, seeded('z'))
    expect(noLang.strict).toBeUndefined()
    expect(noLang.prompt.startsWith('Что значит')).toBe(true)
  })
})

describe('listening and reading explanations in both languages', () => {
  it('every A2 listening question explains in Russian AND Kyrgyz (strict), naming the dialogue; the two texts differ', () => {
    for (const ex of listeningOf('A2').slice(0, 20))
      for (const q of Q.listeningQuestions(ex, 'seed')) {
        expect(q.strict).toBe(true)
        const ru = Q.questionWhy(q, 'ru')!
        const ky = Q.questionWhy(q, 'ky')!
        expect(ru).toContain(ex.title)
        expect(ky).toContain(ex.title)
        expect(ru).not.toBe(ky)
        expect(ky).toBe(dictionaries.ky.qListenWhy.replace('{t}', ex.title))
        expect(Q.questionWhy(q, 'de')).toBeUndefined() // the German interface never receives A2 Russian / Kyrgyz text
      }
  })
  it('A1 listening questions keep their legacy Russian-only explanation (unchanged)', () => {
    const ex = { ...listeningOf('A2')[0], unit: 3 }
    const q = Q.listeningQuestions(ex, 's')[0]
    expect(q.strict).toBeUndefined()
    expect(q.why).toEqual({ ru: `Ключевая информация звучит в диалоге «${ex.title}». Прочитайте текст и сравните.` })
  })
  it('A2 reading questions are strict: the explanation (the German passage) is available in both languages; A1 stays legacy', () => {
    const t = readingOf('A2')[0]
    const q = Q.readingQuestions(t, 's')[0]
    expect(q.strict).toBe(true)
    expect(Q.questionWhy(q, 'ky')).toBe(t.body.join(' '))
    expect(Q.questionWhy(q, 'ru')).toBe(t.body.join(' '))
    const a1 = Q.readingQuestions({ ...t, unit: 3 }, 's')[0]
    expect(a1.strict).toBeUndefined()
  })
})

describe('every builder, every language: no Russian reaches a Kyrgyz learner', () => {
  const defs: TestDef[] = [defOf('vocabulary', 15), defOf('level', 15), defOf('grammar', 12), defOf('listening', 8), defOf('placement', 12)]
  const unitDefs = () => testsOf('A2').filter(t => t.kind === 'topic')
  const all = () => [...defs, ...unitDefs()]
  it('buildTest(def, "ky"): every question of an A2 test is strict, has a Kyrgyz hint/explanation where it has any, and never shows a Russian-only text', () => {
    for (const def of all()) {
      const qs = Q.buildTest(def, 'ky')
      expect(qs.length, def.id).toBeGreaterThan(0)
      for (const q of qs) {
        expect(q.strict, `${def.id}:${q.id}`).toBe(true)
        const hint = Q.questionHint(q, 'ky')
        if (q.promptRu) expect(hint, q.id).not.toBe(q.promptRu === q.promptKy ? '' : q.promptRu)
        expect(Q.questionWhy(q, 'ky'), `${def.id}:${q.id} explanation`).toBeTruthy()
        for (const o of q.options ?? []) expect(ruOnly.has(o), `${def.id}:${q.id}: Russian gloss "${o}"`).toBe(false)
        for (const t of RU_TEMPLATES) expect(q.prompt.includes(t), `${def.id}:${q.id}`).toBe(false)
      }
    }
  })
  it('buildTest(def, "ru") never shows a Kyrgyz text', () => {
    for (const def of all()) {
      const qs = Q.buildTest(def, 'ru')
      for (const q of qs) {
        expect(q.strict, `${def.id}:${q.id}`).toBe(true)
        const hint = Q.questionHint(q, 'ru')
        if (q.promptKy && q.promptKy !== q.promptRu) expect(hint).not.toBe(q.promptKy)
        expect(Q.questionWhy(q, 'ru'), `${def.id}:${q.id}`).toBeTruthy()
      }
    }
  })
  it('the unit tests (authored finals) carry independent Russian and Kyrgyz prompts and explanations in every unit', () => {
    for (const def of unitDefs()) {
      const qs = Q.buildTest(def, 'ky')
      expect(qs).toHaveLength(15)
      for (const q of qs) {
        expect(Q.questionHint(q, 'ky')).toBeTruthy()
        expect(Q.questionHint(q, 'ru')).toBeTruthy()
        expect(Q.questionHint(q, 'ky')).not.toBe(Q.questionHint(q, 'ru'))
      }
    }
  })
  it('unitReviewQuestions(unit, size, "ky") (the /practice/review quiz): vocabulary part in Kyrgyz, exercises strict with Kyrgyz', () => {
    const qs = Q.unitReviewQuestions(11, 10, 'ky')
    expect(qs.length).toBeGreaterThan(0)
    for (const q of qs) {
      expect(q.strict, q.id).toBe(true)
      for (const t of RU_TEMPLATES) expect(q.prompt.includes(t), q.id).toBe(false)
      for (const o of q.options ?? []) expect(ruOnly.has(o), `${q.id}: "${o}"`).toBe(false)
    }
  })
  it('the daily challenge: Kyrgyz vocabulary questions, a Kyrgyz phrase of the day, the same words in both languages, deterministic per date', () => {
    const date = '2026-03-05'
    const ky = Q.buildLevelDaily(date, 'A2', 'ky')!
    const ru = Q.buildLevelDaily(date, 'A2', 'ru')!
    expect(ky.vocab.map(q => q.vocabId)).toEqual(ru.vocab.map(q => q.vocabId))
    for (const q of ky.vocab) {
      expect(q.strict).toBe(true)
      for (const o of q.options ?? []) expect(ruOnly.has(o)).toBe(false)
    }
    expect(ky.phrase.strict).toBe(true)
    expect(ky.phrase.ky).toBeTruthy()
    expect(ky.phrase.ru).toBeTruthy()
    expect(ky.phrase.ky).not.toBe(ky.phrase.ru)
    expect(ky.phrase.de).toBe(ru.phrase.de)
    expect(ky.speaking.prompt.ky).toBeTruthy()
    for (const q of [...ky.grammar, ...ky.listening]) expect(q.strict, q.id).toBe(true)
    expect(Q.buildLevelDaily(date, 'A2', 'ky')).toEqual(ky)
  })
  it('the A1 daily challenge is byte-identical with or without a language, and equals the legacy buildDaily', () => {
    const date = '2026-03-05'
    expect(Q.buildLevelDaily(date, 'A1', 'ky')).toEqual(Q.buildLevelDaily(date, 'A1'))
    expect(Q.buildLevelDaily(date, 'A1', 'ru')).toEqual(Q.buildDaily(date))
    const d = Q.buildDaily(date)
    expect(d.phrase.strict).toBeUndefined()
    expect(d.vocab.every(q => q.strict === undefined)).toBe(true)
  })
  it('A1 tests are unchanged by the language parameter (same shape, no strict question)', () => {
    for (const def of TESTS) {
      const withKy = Q.buildTest(def, 'ky')
      const without = Q.buildTest(def)
      expect(withKy.length, def.id).toBe(without.length)
      for (const q of withKy) {
        expect(q.strict, def.id).toBeUndefined()
        expect(q.promptKy, def.id).toBeUndefined()
      }
    }
  })
})

describe('the screens pass the learner language to the builders', () => {
  const show = (node: React.ReactNode, lang: 'ru' | 'ky', level: 'A1' | 'A2' = 'A1') => {
    localStorage.clear()
    localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang, level }))
    return render(<AppProvider>{node}</AppProvider>)
  }
  for (const lang of ['ru', 'ky'] as const) {
    it(`unit test page (${lang}): buildTest(def, "${lang}")`, async () => {
      show(<TestRunnerPage id="unit-11" />, lang)
      await act(async () => {})
      expect(calls.buildTest.length).toBeGreaterThan(0)
      expect(calls.buildTest.every(a => a[1] === lang)).toBe(true)
    })
    it(`unit review (${lang}): unitReviewQuestions(11, 10, "${lang}")`, async () => {
      show(<ReviewScreen unit={11} />, lang)
      await act(async () => {})
      expect(calls.unitReview.length).toBeGreaterThan(0)
      expect(calls.unitReview.every(a => a[0] === 11 && a[2] === lang)).toBe(true)
    })
    it(`daily challenge (${lang}): buildLevelDaily(date, "A2", "${lang}")`, async () => {
      Object.assign(a2(), { status: 'beta', releasedLocales: ['ru', 'ky'] })
      show(<DailyScreen />, lang, 'A2')
      await act(async () => {})
      expect(calls.daily.length).toBeGreaterThan(0)
      expect(calls.daily.every(a => a[1] === 'A2' && a[2] === lang)).toBe(true)
    })
  }
  it('the question screen shows the Kyrgyz explanation of a wrong vocabulary answer and no Russian', async () => {
    const q = Q.vocabQuestion(A2_WORD, 0, seeded('ui'), 'ky')
    localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang: 'ky' }))
    render(
      <AppProvider>
        <QuizRunner questions={[q]} onDone={() => undefined} activity={{ id: 'x', kind: 'quiz' }} />
      </AppProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: q.options!.find(o => o !== q.answer)! }))
    await act(async () => {})
    const text = document.body.textContent ?? ''
    expect(text).toContain(A2_WORD.ky)
    expect(text.includes(`${A2_WORD.ru} =`) && A2_WORD.ru !== A2_WORD.ky).toBe(false)
  })
  it('the A2 reading lab shows a word explanation in the learner language only', async () => {
    const t = readingOf('A2').find(x => x.gloss.some(g => !g.word.includes(' ') && g.ru !== g.ky))!
    const g = t.gloss.find(x => !x.word.includes(' ') && x.ru !== x.ky)!
    for (const lang of ['ky', 'ru'] as const) {
      cleanup()
      show(<ReadingView id={t.id} />, lang)
      await act(async () => {})
      fireEvent.click(screen.getAllByRole('button', { name: g.word })[0])
      await act(async () => {})
      const text = document.body.textContent ?? ''
      const mine = lang === 'ky' ? g.ky : g.ru
      const other = lang === 'ky' ? g.ru : g.ky
      expect(text).toContain(mine)
      if (!mine.includes(other) && !other.includes(mine)) expect(text.includes(other)).toBe(false)
    }
  })
})

describe('assessment-related interface keys (de / ru / ky audit)', () => {
  const KEYS = [
    // tests, results, feedback
    'testsTitle',
    'testsSub',
    'testPlacement',
    'testLevel',
    'testTopic',
    'questionOf',
    'check',
    'continue',
    'finish',
    'retry',
    'result',
    'correct',
    'incorrect',
    'why',
    'strengths',
    'weaknesses',
    'yourLevelIs',
    'nextTopics',
    'noWeak',
    'lastResult',
    'strongAreas',
    'weakAreas',
    'hints',
    'tapBlock',
    'audioUnavailable',
    // daily
    'dailyTitle',
    'todayResult',
    'dailyVocab',
    'dailyGrammar',
    'dailyListening',
    'dailySpeaking',
    'dailyPhrase',
    'dailyAlready',
    'dailyChallengeDesc',
    // review, articles, labs
    'dueWords',
    'noDueWords',
    'reviewDue',
    'reviewVocab',
    'trainArticles',
    'articleNoticeTitle',
    'articleNoticeBody',
    'lab_daily',
    'lab_tests',
    'lab_review',
    'lab_articles',
    'lab_daily_d',
    'lab_tests_d',
    'lab_review_d',
    'lab_listening_d',
    'listenFirst',
    'tapWord',
    'whyChanges',
    'writingHint',
    'stepTest',
    'rec_articles',
    'rec_listening',
    // skills
    'sk_grammar',
    'sk_vocabulary',
    'sk_wordorder',
    'sk_spelling',
    'sk_style',
    'sk_formality',
    'sk_listening',
    'sk_reading',
    'sk_writing',
    'sk_speaking',
    'sk_pronunciation',
    'sk_fluency',
    'sk_naturalness',
    // Stage 9B / 9C question texts
    'qMeaning',
    'qGerman',
    'qWordIs',
    'qListenWhy',
  ] as const
  // identical to Russian on purpose: established loan words that Kyrgyz writes the same way
  const SAME_AS_RU_ALLOWED = new Set(['sk_grammar', 'sk_spelling', 'sk_style', 'dailyGrammar'])
  const d = (l: 'ru' | 'ky' | 'de', k: string) => (dictionaries[l] as Record<string, string>)[k]
  it('every key exists, is non-empty and is defined in all three languages', () => {
    for (const k of KEYS) for (const l of ['ru', 'ky', 'de'] as const) expect(d(l, k)?.trim(), `${l}.${k}`).toBeTruthy()
  })
  it('the Kyrgyz text of an assessment key is Kyrgyz (not a Russian copy) except for the documented loan words', () => {
    for (const k of KEYS) if (!SAME_AS_RU_ALLOWED.has(k)) expect(d('ky', k), `ky.${k} equals Russian`).not.toBe(d('ru', k))
    for (const k of SAME_AS_RU_ALLOWED) expect(d('ky', k)).toBe(d('ru', k))
  })
  it('the German text of an assessment key is German (differs from Russian)', () => {
    for (const k of KEYS) expect(d('de', k), `de.${k} equals Russian`).not.toBe(d('ru', k))
  })
  it('Kyrgyz assessment texts use Kyrgyz letters (ү ө ң) in most multi-word strings; placeholders are the same in all three languages', () => {
    const long = KEYS.filter(k => d('ky', k).split(' ').length >= 3)
    expect(long.filter(k => /[үөңҮӨҢ]/.test(d('ky', k))).length / long.length).toBeGreaterThan(0.4)
    for (const k of ['qMeaning', 'qGerman', 'qWordIs', 'qListenWhy'] as const) {
      const ph = (s: string) => (s.match(/\{[a-z]\}/g) ?? []).sort().join(',')
      expect(ph(d('ky', k)), k).toBe(ph(d('ru', k)))
      expect(ph(d('de', k)), k).toBe(ph(d('ru', k)))
    }
  })
  it('the remaining Kyrgyz-equals-Russian keys among the assessment-related ones are only the documented loan words', () => {
    const same = KEYS.filter(k => d('ky', k) === d('ru', k))
    expect(same.sort()).toEqual([...SAME_AS_RU_ALLOWED].sort())
  })
})

describe('boundaries', () => {
  it('no A2 level / placement test exists; A2 stays planned and invisible', () => {
    expect(a2()).toMatchObject({ status: 'planned', releasedLocales: [] })
    expect(testsOf('A2').some(t => t.kind === 'level' || t.kind === 'placement')).toBe(false)
  })
})
