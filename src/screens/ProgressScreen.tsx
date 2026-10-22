import { A } from '../app/router'
import { useApp } from '../app/store'
import { Card, PageHeader, ProgressBar, Ring, ScoreBar, SectionTitle } from '../components/ui'
import { grammarById } from '../data/grammar'
import { STAGES } from '../services/srs'
import { badges, completedTopics, levelProgress, masteredCount, SKILLS, skillPct, stageCounts, streak, weakConcepts, xpLevel } from '../features/progress/stats'
import { currentWeek } from '../utils/date'
import { tr } from '../utils/text'

const DAY = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

export function ProgressScreen() {
  const { state, t, lang } = useApp()
  const lvl = levelProgress(state)
  const xp = xpLevel(state.xp)
  const counts = stageCounts(state)
  const totalWords = STAGES.reduce((a, s) => a + counts[s], 0)
  const mins = Math.round(state.studySeconds / 60)
  const weak = weakConcepts(state, 1).slice(0, 4)
  const strong = SKILLS.filter(k => (skillPct(state, k) ?? 0) >= 80)
  const week = currentWeek()
  const hasData = state.xp > 0 || state.activeDates.length > 0

  return (
    <div className="stack">
      <PageHeader eyebrow="📈" title={t('progressTitle')} />

      <div className="grid grid--2">
        <Card className="overall">
          <div className="row">
            <Ring value={lvl} size={110} stroke={10}><span className="overall__lvl">{state.level}</span></Ring>
            <div className="grow">
              <div className="eyebrow">{t('overallLevel')}</div>
              <div className="h2">A1 · {lvl}%</div>
              <p className="muted small">XP {state.xp} · Lv {xp.level}</p>
              <ProgressBar value={xp.pct} tone="violet" label="XP" height={6} />
            </div>
          </div>
        </Card>
        <div className="grid statgrid">
          <Card><div className="stat__n">🔥 {streak(state)}</div><div className="muted small">{t('streak')}</div></Card>
          <Card><div className="stat__n">{mins >= 60 ? `${Math.floor(mins / 60)} ${t('hoursShort')} ${mins % 60}` : mins} <small>{mins >= 60 ? t('minutesShort') : t('minutesShort')}</small></div><div className="muted small">{t('studyTime')}</div></Card>
          <Card><div className="stat__n">{masteredCount(state)}</div><div className="muted small">{t('masteredWords')}</div></Card>
          <Card><div className="stat__n">{completedTopics(state)}</div><div className="muted small">{t('completedTopics')}</div></Card>
        </div>
      </div>

      {!hasData && <Card tone="blue"><p>{t('noData')}</p></Card>}

      <Card>
        <div className="eyebrow">{t('skills')}</div>
        <div className="skillgrid">
          {SKILLS.map(k => <ScoreBar key={k} label={t(`sk_${k}` as 'sk_grammar')} value={skillPct(state, k)} />)}
        </div>
      </Card>

      <div className="grid grid--2">
        <Card>
          <div className="eyebrow">{t('weekActivity')}</div>
          <div className="weekdots">
            {week.map((d, i) => <div key={d} className={`weekdot ${state.activeDates.includes(d) ? 'is-on' : ''}`}><span>{DAY[i]}</span></div>)}
          </div>
        </Card>
        <Card>
          <div className="eyebrow">{t('vocabStages')}</div>
          <div className="stackedbar" role="img" aria-label="vocabulary stages">
            {STAGES.map(s => <span key={s} className={`stackedbar__seg stackedbar__seg--${s}`} style={{ flexGrow: counts[s] }} title={`${t(`stage_${s}` as 'stage_new')}: ${counts[s]}`} />)}
          </div>
          <div className="row small" style={{ marginTop: 10 }}>
            {STAGES.map(s => <span key={s} className="legendline"><i className={`dot dot--${s}`} />{t(`stage_${s}` as 'stage_new')} {counts[s]}</span>)}
          </div>
          <p className="muted small">{totalWords} {t('words')}</p>
        </Card>
      </div>

      <div className="grid grid--2">
        <Card tone="yellow">
          <div className="eyebrow">{t('weakAreas')}</div>
          {weak.length === 0 ? <p className="small">{t('noWeak')}</p> : (
            <div className="stack stack--sm" style={{ marginTop: 8 }}>
              {weak.map(w => { const c = grammarById.get(w.id); return c ? <A key={w.id} to={`/learn/topic/${c.id}`} className="linkrow">🧪 {tr(c.title, lang)} · {w.n}× <span aria-hidden>→</span></A> : null })}
            </div>
          )}
        </Card>
        <Card tone="green">
          <div className="eyebrow">{t('strongAreas')}</div>
          {strong.length === 0 ? <p className="small muted">—</p> : <div className="row" style={{ marginTop: 8 }}>{strong.map(k => <span key={k} className="chip chip--green">{t(`sk_${k}` as 'sk_grammar')} · {skillPct(state, k)}%</span>)}</div>}
        </Card>
      </div>

      <SectionTitle>{t('badges')}</SectionTitle>
      <div className="badges">
        {badges(state).map(b => (
          <div key={b.id} className={`badge ${b.earned ? 'is-earned' : ''}`}>
            <span className="badge__icon" aria-hidden>{b.icon}</span>
            <span>{t(b.key)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
