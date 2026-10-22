import { useEffect, useMemo, useState } from 'react'
import { useApp } from '../../app/store'
import { Segmented } from '../../components/ui'
import { CASES, CASE_ORDER, DEMO, type CaseId, type Gender } from '../../data/cases'
import { tr } from '../../utils/text'
import { ExampleList } from './Highlight'

type Tab = 'why' | 'when' | 'examples' | 'mistakes' | 'real'
const GENDERS: { id: Gender; label: string }[] = [
  { id: 'm', label: 'der Mann' },
  { id: 'f', label: 'die Frau' },
  { id: 'n', label: 'das Kind' },
  { id: 'pl', label: 'die Kinder' },
]

/** Interactive case system: pick a noun, press a case, watch article + noun transform. */
export function CaseLab({ initial = 'nom' }: { initial?: CaseId }) {
  const { t, lang } = useApp()
  const [gender, setGender] = useState<Gender>('m')
  const [active, setActive] = useState<CaseId>(initial)
  const [definite, setDefinite] = useState<'def' | 'indef'>('def')
  const [tab, setTab] = useState<Tab>('why')
  const [playing, setPlaying] = useState(false)

  useEffect(() => setActive(initial), [initial])

  // auto-play: step through the four cases to show the transformation
  useEffect(() => {
    if (!playing) return
    let i = 0
    setActive(CASE_ORDER[0])
    const id = window.setInterval(() => {
      i++
      if (i >= CASE_ORDER.length) {
        window.clearInterval(id)
        setPlaying(false)
        return
      }
      setActive(CASE_ORDER[i])
    }, 1300)
    return () => window.clearInterval(id)
  }, [playing])

  const demo = DEMO[gender]
  const useDef = definite === 'def' || gender === 'pl'
  const forms = useMemo(
    () => CASE_ORDER.map((c, i) => ({ c, art: (useDef ? demo.definite[i] : demo.indefinite[i]) ?? '', noun: demo.noun[i] })),
    [demo, useDef],
  )
  const base = forms[0]
  const info = CASES[active]
  const tabs: { id: Tab; label: string }[] = [
    { id: 'why', label: t('whyLabel') },
    { id: 'when', label: t('when') },
    { id: 'examples', label: t('examples') },
    { id: 'mistakes', label: t('mistakes') },
    { id: 'real', label: t('reallife') },
  ]

  return (
    <div className="lab caselab">
      <div className="row row--between">
        <Segmented value={gender} onChange={setGender} options={GENDERS} label={t('noun')} />
        {gender !== 'pl' && (
          <Segmented value={definite} onChange={setDefinite} options={[{ id: 'def', label: 'der / die / das' }, { id: 'indef', label: 'ein / eine' }]} label="article" />
        )}
      </div>

      <div className="casechain" role="list">
        {forms.map((f, i) => {
          const changedArt = f.art !== base.art
          const changedNoun = f.noun !== base.noun
          return (
            <div key={f.c} role="listitem" className="casechain__item">
              <button type="button" className={`casestep casestep--${f.c} ${active === f.c ? 'is-active' : ''}`} onClick={() => { setPlaying(false); setActive(f.c) }} aria-pressed={active === f.c}>
                <span className="casestep__name">{CASES[f.c].name}</span>
                <span className="casestep__q">{tr(CASES[f.c].question, lang)}</span>
                <span className="casestep__form" key={`${f.c}-${gender}-${definite}`}>
                  {f.art && <span className={changedArt && i > 0 ? 'chg' : ''}>{f.art}</span>} <span className={changedNoun && i > 0 ? 'chg' : ''}>{f.noun}</span>
                </span>
              </button>
              {i < forms.length - 1 && <span className="casechain__arrow" aria-hidden>↓</span>}
            </div>
          )
        })}
      </div>

      <div className="row">
        <button type="button" className="btn btn--soft btn--sm" onClick={() => setPlaying(true)} disabled={playing}>
          ▶ {t('play')}
        </button>
        <span className="muted small">{tr(info.short, lang)}</span>
      </div>

      <div className={`casedetail casedetail--${active}`}>
        <div className="row row--between">
          <h3 className="h3">
            {info.name} · {tr(info.question, lang)}
          </h3>
        </div>
        <div className="segmented segmented--wide" role="tablist">
          {tabs.map(x => (
            <button key={x.id} type="button" role="tab" aria-selected={tab === x.id} className={tab === x.id ? 'is-active' : ''} onClick={() => setTab(x.id)}>
              {x.label}
            </button>
          ))}
        </div>
        <div className="casedetail__body">
          {tab === 'why' && <p className="break">{tr(info.why, lang)}</p>}
          {tab === 'when' && (
            <ul className="bullets">
              {info.when.map(w => (
                <li key={w.ru} className="break">{tr(w, lang)}</li>
              ))}
            </ul>
          )}
          {tab === 'examples' && <ExampleList items={info.examples} />}
          {tab === 'mistakes' && (
            <ul className="mistakes">
              {info.mistakes.map(m => (
                <li key={m.wrong}>
                  <div className="bad break">✗ {m.wrong}</div>
                  <div className="good break">✓ {m.right}</div>
                  <div className="muted small break">{tr(m.note, lang)}</div>
                </li>
              ))}
            </ul>
          )}
          {tab === 'real' && <ExampleList items={info.reallife} />}
        </div>
      </div>
    </div>
  )
}
