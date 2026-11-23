import { useEffect } from 'react'
import { A, navigate, useRoute } from '../app/router'
import { useApp } from '../app/store'
import { BetaNotice } from '../components/BetaNotice'
import { PageHeader, ProgressBar } from '../components/ui'
import { unitsOfLevel, vocabularyForUnit } from '../data/catalog'
import { availableLevels } from '../data/course'
import { unitNumber } from '../data/curriculum'
import type { LanguageLevel } from '../data/types'
import { JOURNEY_LEVELS, LEVEL_NAMES, type JourneyLevel } from '../features/progress/journey'
import { activeLevel, unitHasContent, unitProgress } from '../features/progress/stats'
import { tr } from '../utils/text'

/** A small snow-capped peak. Pure decoration (the level and its name are the text next to it). */
function PeakIcon() {
  return (
    <svg className="peakcard__icon" viewBox="0 0 64 48" aria-hidden focusable="false">
      <path className="peakcard__back" d="M30 46 L48 18 L62 46 Z" />
      <path className="peakcard__main" d="M2 46 L26 6 L58 46 Z" />
      <path className="peakcard__snow" d="M26 6 L18 20 L23 17 L27 22 L32 17 L37 20 Z" />
    </svg>
  )
}

/** The six CEFR summits. Only levels the learner may enter (course registry + interface language) open; the rest are locked, never links. */
function LevelFolders() {
  const { state, actions, lang } = useApp()
  const open = availableLevels(lang)
  return (
    <div className="peaks">
      {JOURNEY_LEVELS.map(level => {
        const name = tr(LEVEL_NAMES[level], lang)
        const body = (
          <>
            <PeakIcon />
            <span className="peakcard__text">
              <span className="peakcard__lvl">{level}</span>
              <span className="peakcard__name">{name}</span>
            </span>
            <span className="peakcard__go" aria-hidden>{open.includes(level as LanguageLevel) ? '▶' : '🔒'}</span>
          </>
        )
        return open.includes(level as LanguageLevel) ? (
          <A
            key={level}
            to={`/learn?level=${level}`}
            className={`card card--interactive peakcard ${level === activeLevel(state) ? 'is-active' : ''}`}
            aria-label={`${level} · ${name}`}
            onClick={() => actions.setProfile({ level: level as LanguageLevel })}
          >
            {body}
          </A>
        ) : (
          <div key={level} className="card peakcard is-locked" role="img" aria-label={`🔒 ${level} · ${name}`}>
            {body}
          </div>
        )
      })}
    </div>
  )
}

/** The units of ONE level — the existing unit cards, unchanged, from the catalog and the saved progress. */
function LevelUnits({ level }: { level: LanguageLevel }) {
  const { state, t, lang } = useApp()
  const units = unitsOfLevel(level)
  return (
    <>
      <PageHeader title={`${level} · ${tr(LEVEL_NAMES[level], lang)}`} eyebrow={<A to="/learn">← {t('learnTitle')}</A>} />
      <BetaNotice level={level} />
      <div className="curriculum">
        {units.map(u => {
          const p = unitProgress(state, u.id)
          const empty = !unitHasContent(u.id) // A1 v2 container without content: no word count, no 0/0 progress
          return (
            <A key={u.id} to={`/learn/unit/${u.id}`} className="unitcard card card--interactive">
              <div className="unitcard__icon" aria-hidden>{u.icon}</div>
              <div className="grow">
                <div className="eyebrow">{t('unit').toUpperCase()} {String(unitNumber(u)).padStart(2, '0')} · {u.level}</div>
                <h3 className="h3">{u.title}</h3>
                {empty ? (
                  <p className="muted small break">{t('sec_empty')}</p>
                ) : (
                  <>
                    <p className="muted small break">{tr(u.subtitle, lang)}</p>
                    <div className="row small muted" style={{ marginTop: 8 }}>
                      {vocabularyForUnit(u.id).length > 0 && <><span>{vocabularyForUnit(u.id).length} {t('words')}</span>·</>}<span>{p.done}/{p.total} {t('unitProgress')}</span>
                    </div>
                    <ProgressBar value={p.pct} tone={p.pct === 100 ? 'green' : 'blue'} label={u.title} height={6} />
                  </>
                )}
              </div>
            </A>
          )
        })}
      </div>
    </>
  )
}

export function LearnScreen() {
  const { state, actions, t, lang } = useApp()
  const route = useRoute()
  const wanted = route.query.get('level') as JourneyLevel | null
  // a folder opens only for a level this learner may enter; any other value (locked, unknown) shows the six summits
  const folder = wanted && availableLevels(lang).includes(wanted as LanguageLevel) ? (wanted as LanguageLevel) : null
  const active = activeLevel(state)
  // a direct link to a folder makes it the working level (the same stored preference the level tabs used to set)
  useEffect(() => {
    if (folder && folder !== active) actions.setProfile({ level: folder })
  }, [folder, active]) // eslint-disable-line react-hooks/exhaustive-deps -- actions is stable
  useEffect(() => {
    if (wanted && !folder) navigate('/learn')
  }, [wanted, folder])
  return <div className="stack">{folder ? <LevelUnits level={folder} /> : (<><PageHeader title={t('learnTitle')} /><LevelFolders /></>)}</div>
}
