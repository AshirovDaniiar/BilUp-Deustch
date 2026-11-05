import { useEffect, useMemo, useRef, useState } from 'react'
import type { CopyInfo } from '../storage/persistence'
import { RECOVERY_MESSAGES } from './recovery-messages'
import type { StorageNoticeKind } from './storage-messages'

/** the recovery panel knows the S1 kinds only; the S2 notices are mapped onto the closest one by StorageNotice */
type PanelKind = Exclude<StorageNoticeKind, 'history-not-saved' | 'history-readonly' | 'replaced' | 'upgrade-pending'>
import { useApp } from './store'

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ''))

/**
 * The learner-facing recovery screen. Principles: explain, never act on its own, verify before offering, confirm before replacing,
 * and keep everything it replaces (the loader/restore code quarantines the current record first). Nothing here deletes data.
 */
export function RecoveryPanel({ kind, onClose, onDownload }: { kind: PanelKind; onClose: () => void; onDownload: () => void }) {
  const { lang, storage } = useApp()
  const m = RECOVERY_MESSAGES[lang]
  const [copies, setCopies] = useState<CopyInfo[]>(() => storage.copies())
  const [confirming, setConfirming] = useState<string | null>(null)
  const [freshAsk, setFreshAsk] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const candidate = storage.report.candidate
  const intro = m.intro[kind]
  const dateFmt = useMemo(() => new Intl.DateTimeFormat(lang, { dateStyle: 'medium', timeStyle: 'short' }), [lang])

  const refresh = () => setCopies(storage.copies())
  const doRestore = (key: string) => {
    const r = storage.restore(key)
    setConfirming(null)
    setMessage(r.status === 'unwritable' && r.writesDisabled ? fill(m.restoreFailed, { reason: r.reason ?? '' }) : m.restoredOk)
    refresh()
  }

  return (
    <div className="recovery-wrap">
      <div className="recovery" role="dialog" aria-modal="true" aria-labelledby="recovery-title">
        <h2 id="recovery-title" className="recovery__title">
          {m.title}
        </h2>
        <p>{intro}</p>
        {storage.report.reason && (
          <p className="recovery__reason">
            <b>{m.reasonLabel}:</b> {storage.report.reason}
          </p>
        )}
        <p className="recovery__safe">{m.safe}</p>

        {message && (
          <p role="status" className="recovery__msg">
            {message}
          </p>
        )}

        {candidate && storage.readOnly && (
          <section className="recovery__box" aria-label={m.candidateTitle}>
            <h3>{m.candidateTitle}</h3>
            <p>{fill(m.candidateBody, { xp: candidate.xp, n: candidate.completed })}</p>
            <button
              type="button"
              className="storage-btn storage-btn--primary"
              onClick={() => {
                const r = storage.confirmRecovery()
                setMessage(
                  r && !(r.status === 'unwritable' && r.writesDisabled) ? m.restoredOk : fill(m.restoreFailed, { reason: r?.reason ?? '' }),
                )
                refresh()
              }}
            >
              {m.useCandidate}
            </button>
          </section>
        )}

        <section aria-label={m.preserved}>
          <h3>{m.preserved}</h3>
          {copies.length === 0 && <p>{m.noCopies}</p>}
          <ul className="recovery__list">
            {copies.map(c => (
              <li key={c.key} className="recovery__item">
                <div>
                  <b>{m.kind[c.kind]}</b> — {c.restorable ? m.verified : c.intact ? m.unusable : m.damaged}
                  <div className="recovery__meta">
                    {fill(m.summary, {
                      date: c.savedAt ? dateFmt.format(c.savedAt) : '—',
                      kb: Math.max(1, Math.round(c.bytes / 1024)),
                      xp: c.xp,
                      n: c.completed,
                    })}
                  </div>
                </div>
                {c.restorable &&
                  (confirming === c.key ? (
                    <div className="recovery__confirm">
                      <p>{m.confirmRestore}</p>
                      <button type="button" className="storage-btn storage-btn--primary" onClick={() => doRestore(c.key)}>
                        {m.confirm}
                      </button>
                      <button type="button" className="storage-btn" onClick={() => setConfirming(null)}>
                        {m.cancel}
                      </button>
                    </div>
                  ) : (
                    <button type="button" className="storage-btn" onClick={() => setConfirming(c.key)}>
                      {m.restore}
                    </button>
                  ))}
              </li>
            ))}
          </ul>
        </section>

        {(kind === 'unreadable' || kind === 'pending') && storage.readOnly && (
          <section>
            {freshAsk ? (
              <div className="recovery__confirm">
                <p>{m.startFreshConfirm}</p>
                <button
                  type="button"
                  className="storage-btn storage-btn--primary"
                  onClick={() => {
                    storage.startFresh()
                    setFreshAsk(false)
                    setMessage(m.restoredOk)
                    refresh()
                  }}
                >
                  {m.confirm}
                </button>
                <button type="button" className="storage-btn" onClick={() => setFreshAsk(false)}>
                  {m.cancel}
                </button>
              </div>
            ) : (
              <button type="button" className="storage-btn" onClick={() => setFreshAsk(true)}>
                {m.startFresh}
              </button>
            )}
          </section>
        )}

        <div className="recovery__actions">
          <button type="button" className="storage-btn storage-btn--primary" onClick={onDownload}>
            {m.download}
          </button>
          {storage.saveFailed && (
            <button type="button" className="storage-btn" onClick={() => setMessage(storage.retrySave() ? m.saveOk : m.saveStillFailing)}>
              {m.retrySave}
            </button>
          )}
          {storage.readOnly && kind !== 'future' && (
            <button
              type="button"
              className="storage-btn"
              onClick={() => {
                const r = storage.retry()
                setMessage(r.writesDisabled ? fill(m.retryStillBad, { reason: r.reason ?? '' }) : m.retryOk)
                refresh()
              }}
            >
              {m.retryLoad}
            </button>
          )}
          <button ref={closeRef} type="button" className="storage-btn" onClick={onClose}>
            {m.close}
          </button>
        </div>
      </div>
    </div>
  )
}
