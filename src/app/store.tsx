import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import type { AIMessage, DailyResult, Lang, Mistake, SkillName, UserProgress } from '../data/types'
import { makeT, type TFn } from '../i18n'
import { review } from '../services/srs'
import { dayKey } from '../utils/date'

const KEY = 'bilup-deutsch:v1'

const emptyScores = (): UserProgress['scores'] => ({ vocabulary: [], grammar: [], listening: [], reading: [], writing: [], speaking: [] })

export const defaultState = (): UserProgress => ({
  name: 'Daniiar',
  lang: 'ru',
  theme: 'auto',
  level: 'A1',
  xp: 0,
  activeDates: [],
  studySeconds: 0,
  completed: [],
  mastery: {},
  saved: [],
  mistakes: [],
  scores: emptyScores(),
  daily: {},
  tests: [],
  weeklyGoal: 5,
  tutor: { messages: [] },
})

function load(): UserProgress {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<UserProgress>
    const base = defaultState()
    return { ...base, ...parsed, scores: { ...base.scores, ...(parsed.scores ?? {}) }, tutor: parsed.tutor ?? base.tutor }
  } catch {
    return defaultState()
  }
}

export interface Actions {
  addXp: (n: number) => void
  complete: (key: string) => void
  answerVocab: (id: string, correct: boolean) => void
  addMistake: (m: Omit<Mistake, 'at'>) => void
  toggleSaved: (id: string) => void
  addScore: (skill: SkillName, pct: number) => void
  setProfile: (p: Partial<Pick<UserProgress, 'name' | 'lang' | 'theme' | 'weeklyGoal' | 'level'>>) => void
  setDaily: (date: string, patch: Partial<DailyResult>) => void
  addTest: (t: UserProgress['tests'][number]) => void
  pushTutor: (msgs: AIMessage[]) => void
  clearTutor: () => void
  reset: () => void
}

interface Ctx { state: UserProgress; actions: Actions; t: TFn; lang: Lang }
const AppCtx = createContext<Ctx | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserProgress>(load)

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage may be unavailable (private mode) – the app still works for the session */
    }
  }, [state])

  // theme + document language
  useEffect(() => {
    const root = document.documentElement
    if (state.theme === 'auto') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', state.theme)
    root.lang = state.lang
  }, [state.theme, state.lang])

  // study time: count visible seconds in 15 s steps
  const stateRef = useRef(state)
  stateRef.current = state
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.visibilityState === 'visible') setState(s => ({ ...s, studySeconds: s.studySeconds + 15 }))
    }, 15000)
    return () => window.clearInterval(id)
  }, [])

  const touch = (s: UserProgress): UserProgress => {
    const k = dayKey()
    return s.activeDates.includes(k) ? s : { ...s, activeDates: [...s.activeDates, k].slice(-400) }
  }

  const actions = useMemo<Actions>(() => ({
    addXp: n => setState(s => touch({ ...s, xp: s.xp + n })),
    complete: key => setState(s => (s.completed.includes(key) ? s : touch({ ...s, completed: [...s.completed, key] }))),
    answerVocab: (id, correct) => setState(s => touch({ ...s, mastery: { ...s.mastery, [id]: review(s.mastery[id], correct) } })),
    addMistake: m => setState(s => ({ ...s, mistakes: [...s.mistakes, { ...m, at: Date.now() }].slice(-300) })),
    toggleSaved: id => setState(s => ({ ...s, saved: s.saved.includes(id) ? s.saved.filter(x => x !== id) : [...s.saved, id] })),
    addScore: (skill, pct) => setState(s => touch({ ...s, scores: { ...s.scores, [skill]: [...s.scores[skill], Math.round(pct)].slice(-30) } })),
    setProfile: p => setState(s => ({ ...s, ...p })),
    setDaily: (date, patch) => setState(s => {
      const prev = s.daily[date] ?? { date, vocab: [0, 0], grammar: [0, 0], listening: [0, 0], speaking: false }
      return touch({ ...s, daily: { ...s.daily, [date]: { ...prev, ...patch } } })
    }),
    addTest: t => setState(s => touch({ ...s, tests: [...s.tests, t].slice(-50) })),
    pushTutor: msgs => setState(s => ({ ...s, tutor: { messages: [...s.tutor.messages, ...msgs].slice(-60) } })),
    clearTutor: () => setState(s => ({ ...s, tutor: { messages: [] } })),
    reset: () => setState(defaultState()),
  }), [])

  const t = useMemo(() => makeT(state.lang), [state.lang])
  const value = useMemo(() => ({ state, actions, t, lang: state.lang }), [state, actions, t])
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useApp() {
  const c = useContext(AppCtx)
  if (!c) throw new Error('useApp must be used inside AppProvider')
  return c
}

