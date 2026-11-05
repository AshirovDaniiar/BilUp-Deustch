import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RECOVERY_MESSAGES } from '../../src/app/recovery-messages'
import { STORAGE_MESSAGES } from '../../src/app/storage-messages'
import { AppProvider, useApp } from '../../src/app/store'
import { StorageNotice } from '../../src/app/StorageNotice'
import { fingerprint } from '../../src/storage/hash'
import { KEYS } from '../../src/storage/persistence'
import { fixture, mkResult } from '../helpers'

/**
 * The learner-facing recovery flow through the REAL provider, notice and panel (jsdom localStorage, no mocks of our own code).
 * Texts come from the message tables, so the tests follow the shipped wording.
 */
// the shipped fixtures are Kyrgyz-UI learners; these tests read the Russian texts, so the fixtures are switched to the Russian UI
const ru = (name: string) => fixture(name).replace('"lang": "ky"', '"lang": "ru"')
const REAL = ru('legacy/v1-realistic.json')
const FULL = ru('legacy/v1-full.json')
const R = RECOVERY_MESSAGES.ru
const N = STORAGE_MESSAGES.ru
const CORRUPT = '{"schemaVersion":2,"courseId":"de-general","progress":{"xp":9'

let ctx!: ReturnType<typeof useApp>
const Probe = () => {
  ctx = useApp()
  return null
}
const mount = () =>
  render(
    <AppProvider>
      <Probe />
      <StorageNotice />
    </AppProvider>,
  )
const seed = (entries: Record<string, string>) => Object.entries(entries).forEach(([k, v]) => localStorage.setItem(k, v))
const backupKey = (raw: string, ts = 1) => `${KEYS.backup}${String(ts).padStart(13, '0')}:${fingerprint(raw)}`
const openOptions = () => fireEvent.click(screen.getByRole('button', { name: N.options }))
const dialog = () => screen.getByRole('dialog')
const validRecord = JSON.parse(REAL)
const word = () => mkResult({ activityId: 'word-practice:k', kind: 'word-practice', items: [{ itemRef: 'word:k', outcome: 'correct' }] })

afterEach(() => vi.restoreAllMocks())

describe('recovery screen: an unreadable record with a usable legacy copy (recovery-pending)', () => {
  const setup = () => {
    seed({ [KEYS.current]: CORRUPT, [KEYS.legacy]: REAL })
    return mount()
  }

  it('shows an alert, proposes the candidate IN MEMORY and replaces nothing on disk', () => {
    setup()
    expect(screen.getByTestId('storage-notice').getAttribute('data-kind')).toBe('pending')
    expect(ctx.state.xp).toBe(412) // shown…
    expect(ctx.storage.readOnly).toBe(true)
    expect(localStorage.getItem(KEYS.current)).toBe(CORRUPT) // …but not written
    act(() => void ctx.actions.record(word()))
    expect(localStorage.getItem(KEYS.current)).toBe(CORRUPT) // still nothing written while the decision is open
  })

  it('opening the options gives an accessible dialog that explains the situation and says nothing will be deleted', () => {
    setup()
    openOptions()
    const d = dialog()
    expect(d.getAttribute('aria-modal')).toBe('true')
    expect(d.getAttribute('aria-labelledby')).toBe('recovery-title')
    expect(within(d).getByText(R.intro.pending)).toBeTruthy()
    expect(within(d).getByText(R.safe)).toBeTruthy()
    expect(document.activeElement?.textContent).toBe(R.close) // focus moves into the dialog
  })

  it('CONFIRM: "save the found copy" replaces the record, quarantine keeps the damaged bytes, the notice switches to "recovered"', () => {
    setup()
    openOptions()
    fireEvent.click(within(dialog()).getByRole('button', { name: R.useCandidate }))
    expect(ctx.storage.readOnly).toBe(false)
    expect(ctx.state.xp).toBe(412)
    expect(JSON.parse(localStorage.getItem(KEYS.current)!).schemaVersion).toBe(2)
    const q = Object.entries(localStorage).filter(([k]) => k.startsWith(KEYS.quarantine))
    expect(q.map(([, v]) => v)).toContain(CORRUPT)
    expect(ctx.storage.report.status).toBe('recovered')
    expect(screen.getByText(R.restoredOk)).toBeTruthy()
    // saving works again afterwards
    act(() => void ctx.actions.record(word()))
    expect(JSON.parse(localStorage.getItem(KEYS.current)!).progress.xp).toBe(415)
    expect(localStorage.getItem(KEYS.legacy)).toBe(REAL)
  })

  it('CANCEL: closing the dialog (button) changes nothing — the choice stays open and nothing is written', () => {
    setup()
    openOptions()
    fireEvent.click(within(dialog()).getByRole('button', { name: R.close }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(localStorage.getItem(KEYS.current)).toBe(CORRUPT)
    expect(ctx.storage.readOnly).toBe(true)
    expect(screen.getByTestId('storage-notice')).toBeTruthy() // the notice is still there
  })

  it('ESCAPE closes the dialog without any change', () => {
    setup()
    openOptions()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(localStorage.getItem(KEYS.current)).toBe(CORRUPT)
  })

  it('other keys do not close the dialog', () => {
    setup()
    openOptions()
    fireEvent.keyDown(document, { key: 'Enter' })
    expect(screen.getByRole('dialog')).toBeTruthy()
  })

  it('the full list of preserved copies is shown with verified status and no restore button for unusable ones', () => {
    seed({ [KEYS.current]: CORRUPT, [KEYS.legacy]: REAL, [`${KEYS.backup}0000000000009:${fingerprint('x')}`]: 'tampered bytes' })
    mount()
    openOptions()
    const items = within(dialog()).getAllByRole('listitem')
    const text = items.map(i => i.textContent ?? '')
    expect(text.some(t => t.includes(R.kind.legacy) && t.includes(R.verified))).toBe(true)
    expect(text.some(t => t.includes(R.kind.quarantine))).toBe(true) // the quarantined damaged record
    const tampered = items.find(i => (i.textContent ?? '').includes(R.damaged))!
    expect(within(tampered).queryByRole('button', { name: R.restore })).toBeNull()
  })
})

describe('recovery screen: restoring a verified backup', () => {
  const GOOD = FULL
  const setup = () => {
    seed({
      [KEYS.current]: CORRUPT,
      [KEYS.legacy]: REAL,
      [backupKey(GOOD)]: GOOD, // intact backup with different content (xp 340)
      [`${KEYS.backup}0000000000009:${fingerprint('x')}`]: 'tampered bytes', // fails its integrity check
    })
    return mount()
  }

  it('offers Restore only for intact + usable copies', () => {
    setup()
    openOptions()
    const restorable = within(dialog()).getAllByRole('button', { name: R.restore })
    expect(restorable.length).toBe(2) // the legacy record and the intact backup
  })

  it('RESTORE needs a confirmation; cancelling it changes nothing', () => {
    setup()
    openOptions()
    const backupRow = within(dialog())
      .getAllByRole('listitem')
      .find(i => (i.textContent ?? '').includes('XP: 340'))!
    fireEvent.click(within(backupRow).getByRole('button', { name: R.restore }))
    expect(screen.getByText(R.confirmRestore)).toBeTruthy()
    expect(localStorage.getItem(KEYS.current)).toBe(CORRUPT) // not yet
    fireEvent.click(within(dialog()).getByRole('button', { name: R.cancel }))
    expect(screen.queryByText(R.confirmRestore)).toBeNull()
    expect(localStorage.getItem(KEYS.current)).toBe(CORRUPT)
    expect(ctx.state.xp).toBe(412)
  })

  it('RESTORE confirmed: the chosen backup becomes the record, the replaced one is quarantined first, the epoch rises', () => {
    setup()
    openOptions()
    const backupRow = within(dialog())
      .getAllByRole('listitem')
      .find(i => (i.textContent ?? '').includes('XP: 340'))!
    fireEvent.click(within(backupRow).getByRole('button', { name: R.restore }))
    fireEvent.click(within(dialog()).getByRole('button', { name: R.confirm }))
    expect(ctx.state.xp).toBe(340)
    const rec = JSON.parse(localStorage.getItem(KEYS.current)!)
    expect(rec.progress.xp).toBe(340)
    expect(rec.epoch).toBeGreaterThan(0)
    expect(Object.values(localStorage)).toContain(CORRUPT) // the damaged bytes are still stored
    expect(screen.getByText(R.restoredOk)).toBeTruthy()
    expect(localStorage.getItem(KEYS.legacy)).toBe(REAL)
    expect(Object.values(localStorage)).toContain(GOOD) // the backup itself is kept
  })

  it('a backup that is tampered with AFTER the screen opened is refused at restore time and nothing changes', () => {
    setup()
    openOptions()
    const key = backupKey(GOOD)
    const backupRow = within(dialog())
      .getAllByRole('listitem')
      .find(i => (i.textContent ?? '').includes('XP: 340'))!
    fireEvent.click(within(backupRow).getByRole('button', { name: R.restore }))
    localStorage.setItem(key, GOOD.replace('Aigerim', 'Hacked')) // bytes change under the same key
    fireEvent.click(within(dialog()).getByRole('button', { name: R.confirm }))
    expect(screen.getAllByText(/integrity/i).length).toBeGreaterThan(0)
    expect(localStorage.getItem(KEYS.current)).toBe(CORRUPT)
    expect(ctx.state.xp).toBe(412)
  })
})

describe('recovery screen: start fresh (no usable copy at all)', () => {
  it('requires a confirmation; confirming quarantines the damaged bytes first and then saves an empty record', () => {
    seed({ [KEYS.current]: CORRUPT })
    mount()
    expect(screen.getByTestId('storage-notice').getAttribute('data-kind')).toBe('unreadable')
    expect(ctx.storage.readOnly).toBe(true)
    openOptions()
    fireEvent.click(within(dialog()).getByRole('button', { name: R.startFresh }))
    expect(screen.getByText(R.startFreshConfirm)).toBeTruthy()
    // cancel first
    fireEvent.click(within(dialog()).getByRole('button', { name: R.cancel }))
    expect(localStorage.getItem(KEYS.current)).toBe(CORRUPT)
    // then confirm
    fireEvent.click(within(dialog()).getByRole('button', { name: R.startFresh }))
    fireEvent.click(within(dialog()).getByRole('button', { name: R.confirm }))
    expect(ctx.storage.readOnly).toBe(false)
    expect(ctx.state.xp).toBe(0)
    expect(Object.values(localStorage)).toContain(CORRUPT) // preserved in quarantine
    expect(JSON.parse(localStorage.getItem(KEYS.current)!).schemaVersion).toBe(2)
    act(() => void ctx.actions.record(word()))
    expect(JSON.parse(localStorage.getItem(KEYS.current)!).progress.xp).toBe(3)
  })

  it('without a decision the corrupt record is never replaced, whatever the learner does in the app', () => {
    seed({ [KEYS.current]: CORRUPT })
    mount()
    act(() => void ctx.actions.record(word()))
    act(() => ctx.actions.setProfile({ name: 'X' }))
    expect(localStorage.getItem(KEYS.current)).toBe(CORRUPT)
  })
})

describe('recovery screen: retry', () => {
  it('RETRY SAVING: while storage is still full the learner is told so; once space exists the same state is saved', () => {
    mount()
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError')
    })
    act(() => void ctx.actions.record(word()))
    expect(screen.getByTestId('storage-notice').getAttribute('data-kind')).toBe('save-failed')
    openOptions()
    fireEvent.click(within(dialog()).getByRole('button', { name: R.retrySave }))
    expect(screen.getByText(R.saveStillFailing)).toBeTruthy()
    expect(localStorage.getItem(KEYS.current)).toBeNull()
    set.mockRestore() // space is available again
    fireEvent.click(within(dialog()).getByRole('button', { name: R.retrySave }))
    expect(screen.getByText(R.saveOk)).toBeTruthy()
    expect(JSON.parse(localStorage.getItem(KEYS.current)!).progress.xp).toBe(3)
    expect(ctx.storage.saveFailed).toBe(false)
  })

  it('RETRY LOADING after a transient storage failure: a clearer picture appears, and still nothing is overwritten', () => {
    seed({ [KEYS.current]: CORRUPT, [KEYS.legacy]: FULL })
    const set = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('full', 'QuotaExceededError')
    })
    mount() // the quarantine copy cannot be written → read-only
    expect(ctx.storage.report.status).toBe('unwritable')
    expect(ctx.storage.readOnly).toBe(true)
    openOptions()
    fireEvent.click(within(dialog()).getByRole('button', { name: R.retryLoad }))
    expect(screen.getByText(/Пока не получилось/)).toBeTruthy()
    set.mockRestore()
    fireEvent.click(within(dialog()).getByRole('button', { name: R.retryLoad }))
    expect(ctx.storage.report.status).toBe('recovery-pending') // now a candidate exists…
    expect(ctx.storage.report.candidate?.xp).toBe(340)
    expect(localStorage.getItem(KEYS.current)).toBe(CORRUPT) // …and the record is STILL not replaced without a decision
  })

  it('a newer-version record cannot be "retried" away: no retry button, nothing written', () => {
    const future = JSON.stringify({ schemaVersion: 9, progress: {} })
    seed({ [KEYS.current]: future })
    mount()
    openOptions()
    expect(within(dialog()).queryByRole('button', { name: R.retryLoad })).toBeNull()
    expect(within(dialog()).getByText(R.intro.future)).toBeTruthy()
    expect(localStorage.getItem(KEYS.current)).toBe(future)
  })
})

describe('recovery screen: download', () => {
  it('the panel offers the same exact-bytes download as the notice', () => {
    seed({ [KEYS.current]: CORRUPT })
    mount()
    const blobs: Blob[] = []
    URL.createObjectURL = vi.fn((b: Blob) => (blobs.push(b), 'blob:x'))
    URL.revokeObjectURL = vi.fn()
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
    openOptions()
    fireEvent.click(within(dialog()).getByRole('button', { name: R.download }))
    expect(click).toHaveBeenCalled()
    expect(blobs).toHaveLength(1)
  })

  it('all three languages define every recovery text (no silent fallback)', () => {
    const keys = Object.keys(RECOVERY_MESSAGES.ru).sort()
    for (const lang of ['ky', 'de'] as const) {
      expect(Object.keys(RECOVERY_MESSAGES[lang]).sort()).toEqual(keys)
      expect(Object.keys(RECOVERY_MESSAGES[lang].intro).sort()).toEqual(Object.keys(RECOVERY_MESSAGES.ru.intro).sort())
    }
  })

  it('the valid legacy fixture really holds the XP the tests rely on', () => {
    expect(validRecord.xp).toBe(412)
  })
})
