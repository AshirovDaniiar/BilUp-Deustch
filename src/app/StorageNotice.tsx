import { useRef, useState } from 'react'
import { RecoveryPanel } from './RecoveryPanel'
import { useApp } from './store'
import { FAILURE_KINDS, STORAGE_MESSAGES, type StorageNoticeKind } from './storage-messages'
import './storage-notice.css'

/**
 * Tells the learner when stored data was repaired/recovered/unreadable, or cannot be saved — and opens the recovery screen where
 * they can download everything preserved, restore a verified copy, retry, or start fresh (each after an explicit confirmation).
 * Renders nothing on a normal load. The notice itself never changes or deletes stored data.
 */
/** the recovery panel knows the S1 kinds; the S2 notices map onto the closest one */
const panelKind = (k: StorageNoticeKind): 'repaired' | 'recovered' | 'pending' | 'unreadable' | 'future' | 'readonly' | 'save-failed' =>
  k === 'history-not-saved' || k === 'history-readonly' ? 'save-failed' : k === 'replaced' || k === 'upgrade-pending' ? 'repaired' : k

export function StorageNotice() {
  const { lang, storage } = useApp()
  const { report } = storage
  const [open, setOpen] = useState(false)
  const lastKind = useRef<StorageNoticeKind>('repaired')
  // session-only: the durable record of a damaged preferences/tutor record is its quarantine copy, not this note
  const [sliceDismissed, setSliceDismissed] = useState(false)

  let kind: StorageNoticeKind | null = null
  if (report.status === 'future-version') kind = 'future'
  else if (report.status === 'recovery-pending') kind = 'pending'
  else if (report.status === 'unreadable') kind = 'unreadable'
  else if (report.status === 'recovered') kind = 'recovered'
  else if (report.status === 'unwritable' && report.writesDisabled) kind = 'readonly'
  else if (report.status === 'repaired' || (report.status === 'migrated' && report.issues.length > 0)) kind = 'repaired'
  // informational S2 notices (dismissible per episode, STO-94): only when nothing more important shows
  if (!kind && storage.replacedNotice) kind = 'replaced'
  if (!kind && storage.upgradePending && report.status !== 'future-version') kind = 'upgrade-pending'
  // FAILURE notices (owner decisions R3 / STO-100): highest priority, NOT dismissible while the condition lasts, with retry
  if (storage.historyPending > 0) kind = 'history-not-saved'
  if (storage.historyReadonly) kind = 'history-readonly'
  if (storage.saveFailed) kind = 'save-failed'
  const isFailure = kind !== null && FAILURE_KINDS.includes(kind)

  if (kind) lastKind.current = kind
  const m = STORAGE_MESSAGES[lang]
  // lowest priority (S1 design 4): only when no core notice is showing, never blocks, never opens the recovery screen
  const sliceNotes = !kind && !sliceDismissed ? report.sliceNotices : []
  if (sliceNotes.length > 0 && !open)
    return (
      <div className="storage-note storage-note--low" role="status" data-testid="slice-notice">
        <div className="storage-note__text">
          {sliceNotes.map(n => (
            <span key={n.slice} data-slice={n.slice} data-kind={n.kind}>
              {m.slice[n.kind].replace('{name}', m.slice.names[n.slice])}
            </span>
          ))}
        </div>
        <div className="storage-note__actions">
          <button type="button" className="storage-btn" onClick={() => setSliceDismissed(true)}>
            {m.close}
          </button>
        </div>
      </div>
    )
  // an open recovery screen stays open after a successful action (e.g. "saved"), so the learner sees the confirmation
  if (!open && (!kind || (storage.noticeDismissed && !isFailure))) return null

  const download = () => {
    const items = storage.recoveryItems()
    const blob = new Blob([JSON.stringify({ app: 'bilup', exportedAt: new Date().toISOString(), items }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bilup-data-copy-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  return (
    <>
      {kind && (isFailure || !storage.noticeDismissed) && (
        <div
          className="storage-note"
          role="alert"
          data-testid="storage-notice"
          data-kind={kind}
          data-persistent={isFailure ? 'true' : 'false'}
        >
          <div className="storage-note__text">
            <strong>{m.titles[kind]}</strong>
            <span>{m.bodies[kind].replace('{n}', String(storage.historyPending))}</span>
          </div>
          <div className="storage-note__actions">
            {isFailure && (
              <button
                type="button"
                className="storage-btn storage-btn--primary"
                data-testid="notice-retry"
                onClick={() => storage.retrySave()}
              >
                {m.retry}
              </button>
            )}
            <button type="button" className={isFailure ? 'storage-btn' : 'storage-btn storage-btn--primary'} onClick={() => setOpen(true)}>
              {m.options}
            </button>
            {kind !== 'save-failed' && !isFailure && (
              <button type="button" className="storage-btn" onClick={download}>
                {m.download}
              </button>
            )}
            {/* failure notices cannot be dismissed while the failure or unsaved condition persists */}
            {!isFailure && (
              <button type="button" className="storage-btn" onClick={storage.dismissNotice}>
                {m.close}
              </button>
            )}
          </div>
        </div>
      )}
      {open && <RecoveryPanel kind={panelKind(kind ?? lastKind.current)} onClose={() => setOpen(false)} onDownload={download} />}
    </>
  )
}
