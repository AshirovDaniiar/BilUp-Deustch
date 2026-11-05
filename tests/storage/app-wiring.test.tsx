import { act, fireEvent, render, screen } from '@testing-library/react'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { AppProvider, useApp } from '../../src/app/store'
import { StorageNotice } from '../../src/app/StorageNotice'
import { STORAGE_MESSAGES } from '../../src/app/storage-messages'
import { QuizRunner, type QuizActivity } from '../../src/features/tests/QuizRunner'
import type { Question } from '../../src/features/tests/questions'
import { POLICIES } from '../../src/progress/policy'
import { LEGACY_AWARDS } from '../../src/storage/persistence'
import { KEYS } from '../../src/storage/persistence'
import { fixture, mkResult, stored, storedRecord } from '../helpers'

const q = (id: string, answer = 'richtig'): Question => ({
  id,
  type: 'choice',
  prompt: `Frage ${id}`,
  options: [answer, 'falsch'],
  answer,
  skill: 'grammar',
  kind: 'grammar',
})

function XpProbe({ onCtx }: { onCtx: (c: ReturnType<typeof useApp>) => void }) {
  onCtx(useApp())
  return null
}

/** Plays a whole quiz through the real QuizRunner: answer correctly, press continue/finish. */
async function playQuiz(questions: Question[], activity?: QuizActivity) {
  let ctx!: ReturnType<typeof useApp>
  const view = render(
    <AppProvider>
      <XpProbe onCtx={c => (ctx = c)} />
      <QuizRunner questions={questions} onDone={() => {}} activity={activity ?? { id: `quiz:${questions[0].id}`, kind: 'quiz' }} />
    </AppProvider>,
  )
  for (let i = 0; i < questions.length; i++) {
    fireEvent.click(screen.getByRole('button', { name: 'richtig' }))
    await act(async () => {})
    fireEvent.click(screen.getByRole('button', { name: i + 1 >= questions.length ? 'Завершить' : 'Продолжить' }))
    await act(async () => {})
  }
  view.unmount()
  return ctx
}

describe('real feature wiring: QuizRunner reports an ActivityResult; XP is credited once per question and once per activity', () => {
  it('first play pays 5 per correct question + 10 completion bonus; REPLAYING the same quiz pays nothing', async () => {
    const quiz = [q('t1'), q('t2'), q('t3')]
    await playQuiz(quiz)
    expect(stored().xp).toBe(3 * 5 + 10)
    const creditAfterFirst = storedRecord().credit
    await playQuiz(quiz) // same questions, same activity: a replay (a NEW attempt, recorded in the history)
    expect(stored().xp).toBe(25)
    expect(storedRecord().credit.entries).toHaveLength(4) // 3 questions + 1 completion bonus — no new credit
    expect(storedRecord().credit).toEqual(creditAfterFirst)
    expect(storedRecord().activity.results).toHaveLength(2)
    expect(storedRecord().activity.results.map((r: { xp: number }) => r.xp)).toEqual([25, 0])
  })

  it('a different set of NEW questions still earns (first-time credit is per question)', async () => {
    await playQuiz([q('a1')])
    await playQuiz([q('a2')])
    expect(stored().xp).toBe((5 + 10) * 2)
  })

  it('overlapping sets: a repeated question pays nothing, a new one pays', async () => {
    await playQuiz([q('o1'), q('o2')])
    expect(stored().xp).toBe(20)
    await playQuiz([q('o2'), q('o3')])
    expect(stored().xp).toBe(20 + 5 + 10) // o3 + the new set's completion bonus
  })

  it('XP survives an app restart in the middle of a replay series (reload, then replay: still 0)', async () => {
    const quiz = [q('r1'), q('r2')]
    await playQuiz(quiz)
    const xp = stored().xp
    await playQuiz(quiz)
    await playQuiz(quiz)
    expect(stored().xp).toBe(xp)
  })

  it('a wrong answer pays nothing and records a mistake; answering it right later pays once', async () => {
    let ctx!: ReturnType<typeof useApp>
    const view = render(
      <AppProvider>
        <XpProbe onCtx={c => (ctx = c)} />
        <QuizRunner questions={[q('w1')]} onDone={() => {}} activity={{ id: 'quiz:w1', kind: 'quiz' }} />
      </AppProvider>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'falsch' }))
    await act(async () => {})
    expect(ctx.state.xp).toBe(0)
    expect(ctx.state.mistakes).toHaveLength(1)
    view.unmount()
    await playQuiz([q('w1')])
    expect(stored().xp).toBe(15)
  })
})

describe('call-site contract (static): features report results, they never touch XP or completion', () => {
  const root = join(__dirname, '../../src')
  const files = (dir: string): string[] =>
    readdirSync(dir).flatMap(n => {
      const p = join(dir, n)
      return statSync(p).isDirectory() ? files(p) : /\.(ts|tsx)$/.test(n) ? [p] : []
    })
  const sources = files(root).map(p => ({ p: p.replace(root, 'src').replaceAll('\\', '/'), s: readFileSync(p, 'utf8') }))

  it('no component calls addXp() or complete() any more', () => {
    for (const { p, s } of sources) {
      expect(s, p).not.toMatch(/\.addXp\(/)
      expect(s, p).not.toMatch(/actions\.complete\(/)
    }
  })

  it('every QuizRunner / QuizPage usage declares its activity', () => {
    const uses = sources.flatMap(({ p, s }) => [...s.matchAll(/<(QuizRunner|QuizPage)\b[\s\S]*?\/>/g)].map(m => ({ file: p, tag: m[0] })))
    expect(uses.length).toBeGreaterThanOrEqual(7)
    for (const u of uses) expect(u.tag, u.file).toMatch(/activity=/)
  })

  it('the features that report results do so through useAttempt (one attempt id per attempt)', () => {
    const reporters = [
      'src/features/speaking/SpeakingLab.tsx',
      'src/features/writing/WritingLab.tsx',
      'src/features/reallife/RealLife.tsx',
      'src/features/vocabulary/WordCard.tsx',
      'src/screens/TopicScreen.tsx',
      'src/screens/UnitScreen.tsx',
      'src/screens/PracticeScreens.tsx',
      'src/features/tests/QuizRunner.tsx',
    ]
    for (const f of reporters) expect(sources.find(x => x.p === f)!.s, f).toMatch(/useAttempt\(\)/)
  })

  it('legacy "already credited" amounts are not below what the policy awards (otherwise migrated learners could re-earn)', () => {
    expect(LEGACY_AWARDS.topic).toBeGreaterThanOrEqual(POLICIES.lesson.firstCompletionBonus)
    expect(LEGACY_AWARDS.speak).toBeGreaterThanOrEqual(POLICIES['speaking-scenario'].firstCompletionBonus)
    expect(LEGACY_AWARDS.real).toBeGreaterThanOrEqual(POLICIES['real-life'].firstCompletionBonus)
    expect(LEGACY_AWARDS.write).toBeGreaterThanOrEqual(POLICIES.writing.firstCompletionBonus)
    expect(LEGACY_AWARDS.daily).toBeGreaterThanOrEqual(POLICIES.daily.firstCompletionBonus)
    expect(LEGACY_AWARDS.quiz).toBeGreaterThanOrEqual(POLICIES.quiz.firstCompletionBonus)
    expect(LEGACY_AWARDS.word).toBeGreaterThanOrEqual(POLICIES['word-practice'].xpPerUnit)
  })

  it('nothing outside the storage layer and the provider writes learner progress keys', () => {
    for (const { p, s } of sources) {
      if (p.startsWith('src/storage/') || p === 'src/app/store.tsx') continue
      expect(s, p).not.toMatch(/localStorage\.setItem\(\s*['"`]bilup-deutsch:/)
    }
  })
})

describe('StorageNotice', () => {
  const mount = (seed?: Record<string, string>) => {
    for (const [k, v] of Object.entries(seed ?? {})) localStorage.setItem(k, v)
    return render(
      <AppProvider>
        <StorageNotice />
      </AppProvider>,
    )
  }

  it('renders nothing on a fresh install, on a clean migration and on a normal restart', () => {
    expect(mount().container.querySelector('.storage-note')).toBeNull()
  })

  it('clean migration of a valid legacy record is silent', () => {
    mount({ [KEYS.legacy]: fixture('legacy/v1-full.json') })
    expect(screen.queryByTestId('storage-notice')).toBeNull()
  })

  it('migration that had to repair fields tells the learner and offers a copy', () => {
    mount({ [KEYS.legacy]: fixture('legacy/malformed-wrong-types.json') })
    const n = screen.getByTestId('storage-notice')
    expect(n.getAttribute('data-kind')).toBe('repaired')
    expect(screen.getByText(STORAGE_MESSAGES.ru.titles.repaired)).toBeTruthy()
    expect(n.getAttribute('role')).toBe('alert')
  })

  it('unreadable legacy data: explains that nothing was deleted', () => {
    mount({ [KEYS.legacy]: fixture('legacy/malformed-truncated-json.txt') })
    expect(screen.getByTestId('storage-notice').getAttribute('data-kind')).toBe('unreadable')
    expect(screen.getByText(STORAGE_MESSAGES.ru.bodies.unreadable)).toBeTruthy()
  })

  it('"Download" produces a JSON file containing the exact preserved bytes; nothing in storage changes', () => {
    mount({ [KEYS.legacy]: fixture('legacy/malformed-truncated-json.txt') })
    const before = { ...localStorage }
    const blobs: Blob[] = []
    URL.createObjectURL = vi.fn((b: Blob) => (blobs.push(b), 'blob:x'))
    URL.revokeObjectURL = vi.fn()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    fireEvent.click(screen.getByRole('button', { name: STORAGE_MESSAGES.ru.download }))
    expect(click).toHaveBeenCalled()
    const readBlob = (b: Blob) =>
      new Promise<string>(res => {
        const r = new FileReader()
        r.onload = () => res(String(r.result))
        r.readAsText(b)
      })
    return readBlob(blobs[0]).then(text => {
      const items = JSON.parse(text).items as { kind: string; raw: string }[]
      expect(items.map(i => i.kind).sort()).toEqual(['legacy', 'quarantine'])
      for (const i of items) expect(i.raw).toBe(fixture('legacy/malformed-truncated-json.txt'))
      expect({ ...localStorage }).toEqual(before)
    })
  })

  it('"Close" dismisses it', () => {
    mount({ [KEYS.legacy]: fixture('legacy/malformed-null.json') })
    fireEvent.click(screen.getByRole('button', { name: STORAGE_MESSAGES.ru.close }))
    expect(screen.queryByTestId('storage-notice')).toBeNull()
  })

  it('a newer-version record: read-only notice, and nothing is written even after interaction', () => {
    const future = JSON.stringify({ schemaVersion: 9, progress: { xp: 1 } })
    let ctx!: ReturnType<typeof useApp>
    localStorage.setItem(KEYS.current, future)
    render(
      <AppProvider>
        <XpProbe onCtx={c => (ctx = c)} />
        <StorageNotice />
      </AppProvider>,
    )
    expect(screen.getByTestId('storage-notice').getAttribute('data-kind')).toBe('future')
    act(
      () =>
        void ctx.actions.record(
          mkResult({ activityId: 'word-practice:k', kind: 'word-practice', items: [{ itemRef: 'word:k', outcome: 'correct' }] }),
        ),
    )
    expect(ctx.state.xp).toBe(3)
    expect(localStorage.getItem(KEYS.current)).toBe(future)
  })

  it('save failure shows a notice (without the download button)', () => {
    let ctx!: ReturnType<typeof useApp>
    render(
      <AppProvider>
        <XpProbe onCtx={c => (ctx = c)} />
        <StorageNotice />
      </AppProvider>,
    )
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError')
    })
    act(
      () =>
        void ctx.actions.record(
          mkResult({ activityId: 'word-practice:k', kind: 'word-practice', items: [{ itemRef: 'word:k', outcome: 'correct' }] }),
        ),
    )
    expect(screen.getByTestId('storage-notice').getAttribute('data-kind')).toBe('save-failed')
    expect(screen.queryByRole('button', { name: STORAGE_MESSAGES.ru.download })).toBeNull()
  })

  it('every language defines every notice text (no silent fallback)', () => {
    const kinds = Object.keys(STORAGE_MESSAGES.ru.titles).sort()
    for (const lang of ['ky', 'de'] as const) {
      expect(Object.keys(STORAGE_MESSAGES[lang].titles).sort()).toEqual(kinds)
      expect(Object.keys(STORAGE_MESSAGES[lang].bodies).sort()).toEqual(kinds)
      for (const v of [...Object.values(STORAGE_MESSAGES[lang].titles), ...Object.values(STORAGE_MESSAGES[lang].bodies)])
        expect(v.trim()).not.toBe('')
    }
  })

  it('uses the learner’s interface language', () => {
    mount({ [KEYS.legacy]: JSON.stringify({ lang: 'de', xp: '1', completed: 'bad' }) })
    expect(screen.getByText(STORAGE_MESSAGES.de.titles.repaired)).toBeTruthy()
  })
})
