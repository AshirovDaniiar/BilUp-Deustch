// @vitest-environment jsdom
/**
 * Stage 9D — A2 learning screens: an A2 learner sees ONLY their own language (Russian or Kyrgyz) in the word card, the vocabulary list, grammar and topic
 * lessons, the speaking lab and the home-screen scenario subtitle; Kyrgyz never falls back to Russian; A1 screens keep their display.
 * A2 is loaded through tests/load-a2.ts; visibility is switched on inside single tests and always restored.
 */
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import '../load-a2'
import { AppProvider } from '../../src/app/store'
import { grammarIndex, speakingIndex, vocabularyOf, whyNotesForConcept } from '../../src/data/catalog'
import { COURSE } from '../../src/data/course'
import { VOCABULARY, vocabForUnit } from '../../src/data/vocabulary'
import { WordCard } from '../../src/features/vocabulary/WordCard'
import { SpeakingList, SpeakingSession } from '../../src/features/speaking/SpeakingLab'
import { dictionaries } from '../../src/i18n'
import { GrammarDetail } from '../../src/screens/GrammarScreen'
import { HomeScreen } from '../../src/screens/HomeScreen'
import { TopicScreen } from '../../src/screens/TopicScreen'
import { VocabStudy } from '../../src/screens/UnitScreen'
import { VocabularyScreen } from '../../src/screens/VocabularyScreen'
import { defaultProgress } from '../../src/storage/defaults'
import { locStrict } from '../../src/utils/text'
import { KEY } from '../helpers'

const a2 = () => COURSE.levels.find(l => l.id === 'A2') as unknown as { status: string; releasedLocales: string[] }
const WORD = vocabularyOf('A2').find(v => v.ru !== v.ky && v.exampleRu !== v.exampleKy && !v.ky.includes(v.ru) && !v.ru.includes(v.ky))!
const CONCEPT = grammarIndex.get('a2-vorschlaege-verabredungen')!
const SCENARIO = speakingIndex.get('a2-sp-20-01')!
const show = (node: React.ReactNode, lang: 'ru' | 'ky', level: 'A1' | 'A2' = 'A1', completed: string[] = []) => {
  localStorage.clear()
  localStorage.setItem(KEY, JSON.stringify({ ...defaultProgress(), lang, level, completed }))
  return render(<AppProvider>{node}</AppProvider>)
}
const text = () => document.body.textContent ?? ''
/** the text contains `mine` and not `other` (when the two are not substrings of one another) */
const only = (mine: string, other: string) => {
  expect(text()).toContain(mine)
  if (!mine.includes(other) && !other.includes(mine)) expect(text().includes(other), `"${other}" leaked`).toBe(false)
}

beforeEach(() => {
  window.scrollTo = () => undefined
  // jsdom lacks these browser APIs (animations of sheets / visuals, scrolling of the chat)
  Element.prototype.scrollIntoView = () => undefined
  Element.prototype.animate = (() => ({ finished: Promise.resolve(), cancel: () => undefined, onfinish: null })) as never
})
afterEach(() => {
  cleanup()
  Object.assign(a2(), { status: 'planned', releasedLocales: [] })
})

describe('locStrict', () => {
  it('own language only; a missing Kyrgyz text is not replaced by Russian; nothing for German', () => {
    expect(locStrict('ru', 'ky', 'ru')).toBe('ru')
    expect(locStrict('ru', 'ky', 'ky')).toBe('ky')
    expect(locStrict('ru', undefined, 'ky')).toBeUndefined()
    expect(locStrict('ru', 'ky', 'de')).toBeUndefined()
  })
})

describe('A2 word card', () => {
  for (const lang of ['ky', 'ru'] as const)
    it(`${lang}: meaning and example translation in ${lang} only`, () => {
      show(<WordCard item={WORD} />, lang)
      only(lang === 'ky' ? WORD.ky : WORD.ru, lang === 'ky' ? WORD.ru : WORD.ky)
      only(lang === 'ky' ? WORD.exampleKy! : WORD.exampleRu!, lang === 'ky' ? WORD.exampleRu! : WORD.exampleKy!)
    })
  it('A1 word card keeps "Russian / Kyrgyz" (unchanged)', () => {
    const a1 = VOCABULARY.find(v => v.ky && v.ru !== v.ky)!
    show(<WordCard item={a1} />, 'ky')
    expect(text()).toContain(a1.ru)
    expect(text()).toContain(a1.ky)
  })
  it('A1 curriculum word keeps Russian as the primary example translation and exposes Kyrgyz below it', () => {
    const word = vocabForUnit(102)[0]
    show(<WordCard item={word} />, 'ky')

    expect(text()).toContain(word.exampleRu)
    expect(text()).toContain(word.exampleKy)
    expect(text().indexOf(word.exampleRu)).toBeLessThan(text().indexOf(word.exampleKy!))
  })
})

describe('A1 curriculum vocabulary study', () => {
  it('uses the unit vocabulary count for progress and next-word navigation', () => {
    const words = vocabForUnit(102)
    show(<VocabStudy id={102} />, 'ru')
    expect(text()).toContain('1 / 25')
    expect(text()).toContain(words[0].de)

    fireEvent.click(screen.getByRole('button', { name: /Дальше/ }))
    expect(text()).toContain('2 / 25')
    expect(text()).toContain(words[1].de)
  })
})

describe('A2 vocabulary list', () => {
  it('Kyrgyz learner: Kyrgyz glosses, no Russian-only gloss in the list; Russian learner: Russian glosses', async () => {
    Object.assign(a2(), { status: 'beta', releasedLocales: ['ru', 'ky'] })
    show(<VocabularyScreen />, 'ky', 'A2')
    await act(async () => {})
    const kyAll = new Set(vocabularyOf('A2').map(v => v.ky))
    const ruOnly = vocabularyOf('A2')
      .filter(v => v.ru !== v.ky && !kyAll.has(v.ru))
      .map(v => v.ru)
    const shown = vocabularyOf('A2').filter(v => text().includes(v.de))
    expect(shown.length).toBeGreaterThan(5)
    for (const v of shown.slice(0, 20)) expect(text(), v.de).toContain(v.ky)
    for (const g of ruOnly.filter(x => x.length > 4).slice(0, 80)) expect(text().includes(g), `Russian gloss "${g}"`).toBe(false)
    cleanup()
    show(<VocabularyScreen />, 'ru', 'A2')
    await act(async () => {})
    for (const v of vocabularyOf('A2')
      .filter(v => text().includes(v.de))
      .slice(0, 10))
      expect(text(), v.de).toContain(v.ru)
  })
})

describe('A2 grammar lesson and topic lesson', () => {
  const ex = CONCEPT.examples[0]
  const note = whyNotesForConcept(CONCEPT.id)[0]
  for (const lang of ['ky', 'ru'] as const) {
    it(`grammar detail (${lang}): example and why-note translations in ${lang} only`, () => {
      show(<GrammarDetail id={CONCEPT.id} />, lang)
      only(lang === 'ky' ? ex.ky! : ex.ru, lang === 'ky' ? ex.ru : ex.ky!)
      only(lang === 'ky' ? note.ky! : note.ru, lang === 'ky' ? note.ru : note.ky!)
      expect(CONCEPT.examples.length).toBeGreaterThan(1)
    })
    it(`topic lesson (${lang}): the why-note translation in ${lang} only, on the first step and on the example step`, async () => {
      show(<TopicScreen id={CONCEPT.id} />, lang)
      await act(async () => {})
      only(lang === 'ky' ? note.ky! : note.ru, lang === 'ky' ? note.ru : note.ky!)
      const steps = screen.getAllByRole('button').filter(b => b.className.includes('step'))
      for (const s of steps.slice(1, 4)) {
        fireEvent.click(s)
        await act(async () => {})
        const all = [...CONCEPT.examples, ...CONCEPT.reallife]
        for (const e of all)
          if (e.ru !== e.ky && !e.ru.includes(e.ky!) && !e.ky!.includes(e.ru))
            expect(text().includes(lang === 'ky' ? e.ru : e.ky!), `${lang}: other language "${lang === 'ky' ? e.ru : e.ky}"`).toBe(false)
      }
    })
  }
  it('A1 lesson keeps its Russian translations (unchanged)', () => {
    const a1 = [...grammarIndex.values()].find(c => c.unit <= 10 && c.examples.length)!
    show(<GrammarDetail id={a1.id} />, 'ky')
    expect(text()).toContain(a1.examples[0].ru)
  })
})

describe('A2 speaking lab', () => {
  it('list: the scenario subtitle in the learner language only', async () => {
    Object.assign(a2(), { status: 'beta', releasedLocales: ['ru', 'ky'] })
    for (const lang of ['ky', 'ru'] as const) {
      cleanup()
      show(<SpeakingList />, lang, 'A2')
      await act(async () => {})
      only(lang === 'ky' ? SCENARIO.titleKy! : SCENARIO.titleRu, lang === 'ky' ? SCENARIO.titleRu : SCENARIO.titleKy!)
    }
  })
  for (const lang of ['ky', 'ru'] as const)
    it(`session (${lang}): the AI-turn translation in ${lang} only`, async () => {
      show(<SpeakingSession id={SCENARIO.id} />, lang)
      await act(async () => {})
      fireEvent.click(screen.getByRole('button', { name: new RegExp(dictionaries[lang].showTranslation) }))
      await act(async () => {})
      const t0 = SCENARIO.turns[0]
      only(lang === 'ky' ? t0.aiKy! : t0.aiRu, lang === 'ky' ? t0.aiRu : t0.aiKy!)
    })
})

describe('home screen', () => {
  it('A2 active (curriculum v2: only empty containers): Continue Learning shows the A1 unit and no A2 scenario or foreign-language subtitle', async () => {
    Object.assign(a2(), { status: 'beta', releasedLocales: ['ru', 'ky'] })
    for (const lang of ['ky', 'ru'] as const) {
      cleanup()
      show(<HomeScreen />, lang, 'A2')
      await act(async () => {})
      expect(text()).toContain('A1 ·')
      expect([...speakingIndex.values()].filter(s => s.level === 'A2').some(s => text().includes(s.title))).toBe(false)
    }
  })
  it('A1 home screen keeps the Russian scenario subtitle for a Kyrgyz learner (unchanged)', async () => {
    show(<HomeScreen />, 'ky', 'A1')
    await act(async () => {})
    const sc = [...speakingIndex.values()].filter(s => s.level === 'A1').find(s => text().includes(s.title))
    if (sc) expect(text()).toContain(sc.titleRu)
  })
})

describe('boundaries', () => {
  it('A2 stays planned and invisible', () => {
    expect(a2()).toMatchObject({ status: 'planned', releasedLocales: [] })
  })
})
