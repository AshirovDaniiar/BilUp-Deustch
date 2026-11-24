import { UnitIcon } from '../components/UnitIcon'
import { useMemo, useState } from 'react'
import { A } from '../app/router'
import { useApp } from '../app/store'
import { Button, Card, Chip, PageHeader, Sheet } from '../components/ui'
import { displayWord } from '../data/vocabulary'
import { unitNumber } from '../data/curriculum'
import { levelOfUnit, unitsOfLevel, vocabularyIndex, vocabularyOf } from '../data/catalog'
import { activeLevel, articleConfusion, stageCounts } from '../features/progress/stats'
import { WordCard } from '../features/vocabulary/WordCard'
import { stageOf, STAGES } from '../services/srs'
import { locStrict, normalize } from '../utils/text'

export function VocabularyScreen() {
  const { state, t, lang } = useApp()
  const [q, setQ] = useState('')
  const [unit, setUnit] = useState<number | 'all' | 'saved'>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const level = activeLevel(state)
  const counts = stageCounts(state, level)
  const conf = articleConfusion(state, level)
  const words = vocabularyOf(level)
  const units = unitsOfLevel(level)

  const list = useMemo(() => {
    const nq = normalize(q)
    return words.filter(v => {
      if (unit === 'saved' ? !state.saved.includes(v.id) : unit !== 'all' && v.unit !== unit) return false
      if (!nq) return true
      return normalize(v.de).includes(nq) || normalize(v.ru).includes(nq) || normalize(v.ky).includes(nq)
    })
  }, [q, unit, state.saved, words])

  const open = openId ? vocabularyIndex.get(openId) : undefined
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
        <Chip active={unit === 'all'} tone="blue" onClick={() => setUnit('all')}>{t('allWords')} · {words.length}</Chip>
        <Chip active={unit === 'saved'} tone="violet" onClick={() => setUnit('saved')}>★ {t('savedWords')} · {state.saved.length}</Chip>
        {units.map(u => <Chip key={u.id} active={unit === u.id} onClick={() => setUnit(u.id)}><UnitIcon /> {unitNumber(u)}</Chip>)}
      </div>

      <div className="wordlist">
        {list.map(v => {
          const st = stageOf(state.mastery[v.id])
          return (
            <button key={v.id} type="button" className="wordrow" onClick={() => setOpenId(v.id)}>
              <span className={`artbadge artbadge--sm ${v.article ? `art--${v.article}` : 'art--none'}`}>{v.article ?? '•'}</span>
              <span className="grow wordrow__text"><b className="break">{v.de}</b><span className="muted small break">{levelOfUnit(v.unit) !== 'A1' ? locStrict(v.ru, v.ky, lang) : v.ru}</span></span>
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
