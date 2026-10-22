import { useMemo, useState } from 'react'
import { A } from '../app/router'
import { useApp } from '../app/store'
import { Button, Card, Chip, PageHeader, Sheet } from '../components/ui'
import { UNITS } from '../data/units'
import { VOCABULARY, displayWord, vocabById } from '../data/vocabulary'
import { articleConfusion, stageCounts } from '../features/progress/stats'
import { WordCard } from '../features/vocabulary/WordCard'
import { stageOf, STAGES } from '../services/srs'
import { normalize } from '../utils/text'

export function VocabularyScreen() {
  const { state, t } = useApp()
  const [q, setQ] = useState('')
  const [unit, setUnit] = useState<number | 'all' | 'saved'>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const counts = stageCounts(state)
  const conf = articleConfusion(state)

  const list = useMemo(() => {
    const nq = normalize(q)
    return VOCABULARY.filter(v => {
      if (unit === 'saved' ? !state.saved.includes(v.id) : unit !== 'all' && v.unit !== unit) return false
      if (!nq) return true
      return normalize(v.de).includes(nq) || normalize(v.ru).includes(nq) || normalize(v.ky).includes(nq)
    })
  }, [q, unit, state.saved])

  const open = openId ? vocabById.get(openId) : undefined
  return (
    <div className="stack">
      <PageHeader eyebrow="📖" title={t('vocabTitle')} sub={t('vocabSub')} right={<Button to="/practice/review" variant="soft" size="sm">{t('reviewDue')}</Button>} />

      {conf.active && (
        <Card tone="violet">
          <div className="h3">{t('articleNoticeTitle')}</div>
          <p className="muted small">{t('articleNoticeBody')}</p>
          <Button to="/practice/articles" variant="violet" size="sm">{t('trainArticles')} →</Button>
        </Card>
      )}

      <div className="stagebar" aria-label="mastery">
        {STAGES.map(s => (
          <div key={s} className={`stagebar__item stagebar__item--${s}`}>
            <b>{counts[s]}</b>
            <span>{t(`stage_${s}` as 'stage_new')}</span>
          </div>
        ))}
      </div>

      <input className="search" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder={t('search')} aria-label={t('search')} />
      <div className="row catchips">
        <Chip active={unit === 'all'} tone="blue" onClick={() => setUnit('all')}>{t('allWords')} · {VOCABULARY.length}</Chip>
        <Chip active={unit === 'saved'} tone="violet" onClick={() => setUnit('saved')}>★ {t('savedWords')} · {state.saved.length}</Chip>
        {UNITS.map(u => <Chip key={u.id} active={unit === u.id} onClick={() => setUnit(u.id)}>{u.icon} {u.id}</Chip>)}
      </div>

      <div className="wordlist">
        {list.map(v => {
          const st = stageOf(state.mastery[v.id])
          return (
            <button key={v.id} type="button" className="wordrow" onClick={() => setOpenId(v.id)}>
              <span className={`artbadge artbadge--sm ${v.article ? `art--${v.article}` : 'art--none'}`}>{v.article ?? '•'}</span>
              <span className="grow wordrow__text"><b className="break">{v.de}</b><span className="muted small break">{v.ru}</span></span>
              <span className={`dot dot--${st}`} aria-label={st} />
            </button>
          )
        })}
        {list.length === 0 && <p className="muted">—</p>}
      </div>

      <Sheet open={!!open} onClose={() => setOpenId(null)} title={open ? displayWord(open) : ''}>
        {open && <WordCard item={open} onOpen={setOpenId} />}
      </Sheet>
      <A to="/practice/articles" className="linkrow">🔠 {t('trainArticles')} <span aria-hidden>→</span></A>
    </div>
  )
}
