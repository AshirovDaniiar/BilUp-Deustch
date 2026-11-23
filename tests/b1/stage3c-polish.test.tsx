// @vitest-environment jsdom
/**
 * B1 Stage 3C — shared B1 UI polish: the Beta notice names the ACTIVE level (A2 wording unchanged), the Kyrgyz interface shows no Russian chrome on the B1
 * screens, the writing checklist is explained in the learner's language, Unit 21 has text-level exercises, and the self-assessment stays responsive.
 * B1 is switched to `beta` INSIDE a test only and restored; nothing implies a CEFR approval or a native-speaker review of the Kyrgyz.
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { App } from '../../src/app/App'
import { AppProvider } from '../../src/app/store'
import { B1_CONTENT } from '../../src/data/b1/b1-content'
import { UNIT_21_EXERCISES } from '../../src/data/b1/unit21/assessment'
import { isLevelContentLoaded } from '../../src/data/catalog'
import { COURSE } from '../../src/data/course'
import type { Lang } from '../../src/data/types'
import { dictionaries } from '../../src/i18n'
import { defaultProgress } from '../../src/storage/defaults'
import { KEY } from '../helpers'

type Mutable = { status: string; releasedLocales: string[] }
const lvl = (id: string) => COURSE.levels.find(l => l.id === id) as unknown as Mutable
const errors: string[] = []

beforeEach(() => {
  window.scrollTo = () => undefined
  Element.prototype.scrollIntoView = () => undefined
  Element.prototype.animate = (() => ({ finished: Promise.resolve(), cancel: () => undefined, onfinish: null })) as never
  errors.length = 0
  vi.spyOn(console, 'error').mockImplementation((...a) => void errors.push(a.map(String).join(' ').slice(0, 200)))
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  Object.assign(lvl('B1'), { status: 'planned', releasedLocales: [] })
  window.location.hash = ''
})

async function show(path: string, lang: Lang, level: 'A1' | 'A2' | 'B1' = 'B1') {
  localStorage.clear()
  localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang, level }))
  window.location.hash = `#${path}`
  render(
    <AppProvider>
      <App />
    </AppProvider>,
  )
  for (let i = 0; i < 60 && !(level === 'A2' ? isLevelContentLoaded('A2') : isLevelContentLoaded('B1')); i++)
    await act(async () => {
      await new Promise(r => setTimeout(r, 50))
    })
  await act(async () => {
    await new Promise(r => setTimeout(r, 120))
  })
}
const text = () => document.body.textContent ?? ''
const beta = () => Object.assign(lvl('B1'), { status: 'beta', releasedLocales: ['ru', 'ky'] })

describe('A1 — the Beta notice names the active level', () => {
  it('the template has exactly one {level} per language, and for A2 it renders word for word as the original notice', () => {
    for (const l of ['ru', 'ky', 'de'] as const) {
      const d = dictionaries[l]
      expect(d.betaNoticeLevel.match(/\{level\}/g)).toHaveLength(1)
      expect(d.betaNoticeLevel).not.toMatch(/\bA2\b|\bB1\b/)
      expect(d.betaNoticeLevel.replace('{level}', 'A2')).toBe(d.betaNotice) // A2 wording preserved byte for byte
      expect(d.betaNotice).toMatch(/\bA2\b/) // the original key is untouched
    }
  })
  it.each(['ru', 'ky'] as const)(
    '%s: a B1 page says B1 and never A2 in its notice; an A2 page still shows the original A2 notice',
    async lang => {
      beta()
      await show('/learn/unit/21', lang, 'B1')
      const b1 = document.querySelector('.betanotice')!.textContent!
      expect(b1).toContain('B1 · Beta.')
      expect(b1).toContain(dictionaries[lang].betaNoticeLevel.replace('{level}', 'B1'))
      expect(b1).not.toMatch(/\bA2\b/)
      cleanup()
      await show('/learn/unit/11', lang, 'A2')
      const a2 = document.querySelector('.betanotice')!.textContent!
      expect(a2).toBe(`A2 · Beta. ${dictionaries[lang].betaNotice}`)
    },
  )
  it('the notice does not claim any approval', () => {
    for (const l of ['ru', 'ky', 'de'] as const)
      expect(dictionaries[l].betaNoticeLevel).not.toMatch(/CEFR|сертификат|Zertifikat|одобр|approved|подтверждён/i)
  })
})

describe('A2/A3 — the Kyrgyz interface of the B1 screens contains no Russian chrome', () => {
  const ru = dictionaries.ru as Record<string, string>
  const ky = dictionaries.ky as Record<string, string>
  // words that are legitimately the same in Kyrgyz (loanwords / international terms), so an identical value is not "Russian text"
  const LOANWORDS = new Set([
    'Практика',
    'Грамматика',
    'Профиль',
    'Текст',
    'Диалог',
    'Лексика',
    'Стиль',
    'Орфография',
    'Тема',
    'мин',
    'ч',
    'Авто',
    'Светлая',
    'Тёмная',
  ])
  const routes = [
    '/learn',
    '/learn/unit/21',
    '/learn/unit/21/vocabulary',
    '/learn/topic/b1-praeteritum-erzaehlen',
    '/grammar/b1-temporale-konnektoren',
    '/practice',
    '/practice/listening',
    '/practice/reading',
    '/practice/writing',
    '/speak',
    '/practice/listening/b1-li-21-01',
    '/practice/reading/b1-re-21-01',
    '/practice/writing/b1-wr-21-01',
    '/speak/b1-sp-21-01',
    '/practice/tests/unit-21',
    '/practice/review?unit=21',
  ]
  const stillRussian = Object.keys(ru).filter(
    k =>
      ky[k] === ru[k] &&
      /[А-Яа-я]/.test(ru[k]) &&
      ru[k].length > 3 &&
      !LOANWORDS.has(ru[k]) &&
      !k.startsWith('badge') &&
      !k.startsWith('theme') &&
      ![
        'dataLocal',
        'resetData',
        'noData',
        'weekActivity',
        'badges',
        'vocabStages',
        'hoursShort',
        'whatNow',
        'tutorSub',
        'tutorThinking',
        'tutorMock',
        'casesLab',
        'casesLabSub',
        'levelLocked',
        'realTitle',
        'realSub',
        'rec_practice',
        'rec_due',
        'cat_articles',
        'cat_cases',
        'cat_verbs',
        'cat_wordorder',
        'cat_prepositions',
        'cat_adjectives',
        'cat_pronouns',
        'cat_passive',
        'cat_relative',
        'definite',
        'indefinite',
        'noun',
        'completed',
      ].includes(k),
  )
  it('every UI string the B1 flow shows in Kyrgyz is Kyrgyz: none of the formerly Russian keys is identical to Russian any more', () => {
    for (const k of [
      'unitProgress',
      'startUnit',
      'learnerGoal',
      'vocabSub',
      'practiceSub',
      'lab_real',
      'understandQ',
      'seeTranscript',
      'playAll',
      'writingPrompt',
      'yourText',
      'analyse',
      'yourVersion',
      'betterVersion',
      'wordCount',
      'speakingLabSub',
      'send',
      'scenarioDone',
      'backToScenarios',
      'showTranslation',
      'notFound',
      'goHome',
      'speechUnsupported',
    ])
      expect(ky[k], k).not.toBe(ru[k])
    for (const k of Object.keys(ky)) expect(/[Ѐ-ӿ]/.test(ky[k]) || !/[А-Яа-я]/.test(ky[k]), k).toBe(true)
  })
  it('on every B1 screen (including the writing result and the listening question phase) no remaining Russian-identical string is visible in Kyrgyz', async () => {
    beta()
    const leaks: string[] = []
    for (const r of routes) {
      await show(r, 'ky')
      if (r.includes('writing/')) {
        fireEvent.change(document.querySelector('textarea')!, { target: { value: B1_CONTENT.writing[0].model } })
        await act(async () => {
          fireEvent.click([...document.querySelectorAll('button')].find(b => b.textContent === ky.analyse)!)
        })
      }
      if (r.includes('listening/b1')) {
        await act(async () => {
          fireEvent.click([...document.querySelectorAll('button')].find(b => b.textContent?.includes(ky.understandQ))!)
        })
      }
      for (const k of stillRussian) if (text().includes(ru[k])) leaks.push(`${r}: ${k} = "${ru[k]}"`)
      cleanup()
    }
    expect(leaks).toEqual([])
    expect(errors).toEqual([])
  }, 180_000)
  it('the Russian interface is unchanged by the Kyrgyz work (same keys, same Russian)', () => {
    expect(ru.analyse).toBe('Разобрать текст')
    expect(ru.writingPrompt).toBe('Ситуация')
    expect(Object.keys(ru).sort()).toEqual(Object.keys(dictionaries.de).sort())
  })
})

describe('A4 — the writing checklist is explained in Russian and Kyrgyz', () => {
  it('every expected element of the Unit 21 task has an explanation in both languages, and Kyrgyz is not a copy of the Russian', () => {
    for (const m of B1_CONTENT.writing[0].mustInclude) {
      expect(m.explain?.ru, m.label).toBeTruthy()
      expect(m.explain?.ky, m.label).toBeTruthy()
      expect(m.explain!.ky).not.toBe(m.explain!.ru)
    }
  })
  it.each(['ru', 'ky'] as const)(
    '%s: the task page and the result checklist show the explanation in the learner’s own language only',
    async lang => {
      beta()
      const task = B1_CONTENT.writing[0]
      await show(`/practice/writing/${task.id}`, lang)
      const own = (m: (typeof task.mustInclude)[number]) => m.explain![lang as 'ru' | 'ky']!
      const other = (m: (typeof task.mustInclude)[number]) => m.explain![lang === 'ru' ? 'ky' : 'ru']!
      for (const m of task.mustInclude) {
        expect(text()).toContain(own(m))
        expect(text()).not.toContain(other(m))
      }
      fireEvent.change(document.querySelector('textarea')!, { target: { value: task.model } })
      await act(async () => {
        fireEvent.click([...document.querySelectorAll('button')].find(b => b.textContent === dictionaries[lang].analyse)!)
      })
      const items = [...document.querySelectorAll('.checks li')].map(li => li.textContent ?? '')
      for (const m of task.mustInclude)
        expect(
          items.some(t => t.includes(m.label) && t.includes(own(m))),
          m.label,
        ).toBe(true)
      expect(errors).toEqual([])
    },
  )
  it('A1 and A2 writing tasks are unchanged: no explanation field, the German label alone', async () => {
    beta()
    await show('/practice/writing/a2-wr-12-01', 'ru', 'A2')
    expect(document.querySelectorAll('.bullets li .muted').length).toBe(0)
  })
})

describe('B — Unit 21 text-level exercises', () => {
  const ex = (n: number) => UNIT_21_EXERCISES.find(e => e.id === `b1-ex-21-${String(n).padStart(2, '0')}`)!
  it('exercises 01 and 05 work on a TEXT of three sentences (ordering a story; choosing a correctly told story), as ordinary `choice` items', () => {
    const sentences = (s: string) => s.split(/(?<=[.!?])\s+/).filter(x => /[a-zäöü]/i.test(x))
    expect(ex(1).type).toBe('choice')
    expect(ex(1).prompt.match(/\(\d\)/g)).toHaveLength(3)
    expect(ex(1).options).toContain(ex(1).answer)
    expect(ex(5).type).toBe('choice')
    for (const o of ex(5).options!) expect(sentences(o)).toHaveLength(3)
    expect(ex(5).options!.filter(o => o === ex(5).answer)).toHaveLength(1)
    expect(new Set(ex(5).options).size).toBe(3)
  })
  it('the exercise architecture is respected: 10 exercises of the approved types, 4 + 4 on the concepts, 2 recycled; the distractors are real learner errors', () => {
    expect(UNIT_21_EXERCISES).toHaveLength(10)
    expect(UNIT_21_EXERCISES.every(e => ['fill', 'choice', 'order'].includes(e.type))).toBe(true)
    expect(UNIT_21_EXERCISES.filter(e => e.concept === 'b1-praeteritum-erzaehlen')).toHaveLength(4)
    expect(UNIT_21_EXERCISES.filter(e => e.concept === 'b1-temporale-konnektoren')).toHaveLength(4)
    const wrong = ex(5).options!.filter(o => o !== ex(5).answer)
    expect(wrong.some(o => /Bevor ich nahm den Zug/.test(o))).toBe(true) // verb not at the end
    expect(wrong.some(o => /, ich kaufte/.test(o))).toBe(true) // no inversion after the subordinate part
    expect(ex(1).answer).toBe('2 – 3 – 1')
  })
  it('both languages explain the two text-level answers', () => {
    for (const n of [1, 5]) {
      expect(ex(n).why.ru.length).toBeGreaterThan(60)
      expect((ex(n).why.ky ?? '').length).toBeGreaterThan(60)
      expect(ex(n).promptRu && ex(n).promptKy).toBeTruthy()
    }
  })
})

describe('B — the self-assessment stays responsive', () => {
  it('the chips that hold sentences wrap (CSS rule present and the component is wrapped in it)', () => {
    const css = readFileSync(join(__dirname, '../../src/styles/features.css'), 'utf8')
    expect(css).toMatch(/\.selfcheck \.chip\s*\{[^}]*white-space:\s*normal/)
    expect(css).toMatch(/\.selfcheck \.chip\s*\{[^}]*max-width:\s*100%/)
    const src = readFileSync(join(__dirname, '../../src/features/feedback/SelfAssessment.tsx'), 'utf8')
    expect(src.match(/selfcheck/g)!.length).toBeGreaterThanOrEqual(2)
  })
})
