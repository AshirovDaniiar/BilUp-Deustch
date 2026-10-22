import { useLayoutEffect, useRef, useState } from 'react'
import { useApp } from '../../app/store'
import { Segmented } from '../../components/ui'
import { SpeakButton } from '../../components/SpeakButton'
import { CASE_BY_CONCEPT } from '../../data/cases'
import type { GrammarConcept } from '../../data/types'
import {
  ARTICLE_COLUMNS, CONJ_LABS, NEGATION_ITEMS, PLURAL_TYPES, PREP_POSITIONS, PRONOUNS, ROLE_LABEL, SENTENCE_LABS, TIMELINE,
  type Block, type Role,
} from '../../data/visuals'
import { tr } from '../../utils/text'
import { CaseLab } from './CaseLab'

/** FLIP animation: blocks keep their id across variants and glide to their new position. */
function useFlip(deps: unknown[]) {
  const nodes = useRef(new Map<string, HTMLElement>())
  const prev = useRef(new Map<string, { x: number; y: number }>())
  useLayoutEffect(() => {
    const seen = new Set<string>()
    nodes.current.forEach((el, id) => {
      seen.add(id)
      const pos = { x: el.offsetLeft, y: el.offsetTop }
      const before = prev.current.get(id)
      if (before && (before.x !== pos.x || before.y !== pos.y)) {
        el.animate([{ transform: `translate(${before.x - pos.x}px, ${before.y - pos.y}px)` }, { transform: 'none' }], { duration: 480, easing: 'cubic-bezier(.2,.8,.2,1)' })
      } else if (!before) {
        el.animate([{ opacity: 0, transform: 'scale(.85)' }, { opacity: 1, transform: 'none' }], { duration: 320 })
      }
      prev.current.set(id, pos)
    })
    prev.current.forEach((_, id) => !seen.has(id) && prev.current.delete(id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return (id: string) => (el: HTMLElement | null) => {
    if (el) nodes.current.set(id, el)
    else nodes.current.delete(id)
  }
}

export function SentenceBlocks({ conceptId }: { conceptId: string }) {
  const { lang } = useApp()
  const lab = SENTENCE_LABS[conceptId]
  const [vi, setVi] = useState(0)
  const variant = lab?.variants[Math.min(vi, (lab?.variants.length ?? 1) - 1)]
  const ref = useFlip([vi, conceptId])
  if (!lab || !variant) return null
  const roles = Array.from(new Set(variant.blocks.map(b => b.role)))
  const verbIndex = variant.blocks.findIndex(b => b.role === 'verb')
  return (
    <div className="lab">
      <Segmented value={String(vi)} onChange={v => setVi(Number(v))} options={lab.variants.map((v, i) => ({ id: String(i), label: v.label }))} label="variant" />
      <div className="blocks" aria-live="polite">
        {variant.blocks.map((b: Block, i: number) => (
          <span key={b.id} ref={ref(b.id)} className={`blk blk--${b.role} ${i === verbIndex && b.role === 'verb' ? 'blk--anchor' : ''}`}>
            <small className="blk__pos">{i + 1}</small>
            {b.text}
          </span>
        ))}
      </div>
      <div className="row">
        <SpeakButton text={variant.blocks.map(b => b.text).join(' ')} small />
        <p className="grow break">{tr(variant.explain, lang)}</p>
      </div>
      <div className="row">
        {roles.map((r: Role) => (
          <span key={r} className={`legend legend--${r}`}>{tr(ROLE_LABEL[r], lang)}</span>
        ))}
      </div>
      <p className="muted small">{tr(lab.note, lang)}</p>
    </div>
  )
}

export function ConjugationLab({ conceptId }: { conceptId: string }) {
  const { lang } = useApp()
  const verbs = CONJ_LABS[conceptId] ?? []
  const [vi, setVi] = useState(0)
  const verb = verbs[vi]
  if (!verb) return null
  const stem = verb.inf.replace(/en$|n$/, '')
  return (
    <div className="lab">
      <Segmented value={String(vi)} onChange={v => setVi(Number(v))} options={verbs.map((v, i) => ({ id: String(i), label: v.inf }))} label="verb" />
      <div className="conj" key={verb.inf}>
        {PRONOUNS.map((p, i) => {
          const form = verb.forms[i]
          const regular = form.startsWith(stem)
          return (
            <div key={p} className="conj__row" style={{ animationDelay: `${i * 60}ms` }}>
              <span className="conj__pron">{p}</span>
              <span className="conj__form de">
                {regular ? (
                  <>
                    <span className="conj__stem">{stem}</span>
                    <span className="conj__end">{form.slice(stem.length)}</span>
                  </>
                ) : (
                  <span className="conj__irr">{form}</span>
                )}
              </span>
              <SpeakButton text={`${p.split(' ')[0]} ${form}`} small />
            </div>
          )
        })}
      </div>
      {verb.note && <p className="muted small">{tr(verb.note, lang)}</p>}
    </div>
  )
}

export function PrepLab() {
  const { lang } = useApp()
  const [idx, setIdx] = useState(1)
  const [mode, setMode] = useState<'wo' | 'wohin'>('wo')
  const p = PREP_POSITIONS[idx]
  const sentence = mode === 'wo' ? p.wo : p.wohin
  const from = { x: 36, y: 40 }
  return (
    <div className="lab">
      <div className="row">
        {PREP_POSITIONS.map((x, i) => (
          <button key={x.prep} type="button" className={`chip ${i === idx ? 'is-active' : ''}`} onClick={() => setIdx(i)}>
            {x.prep}
          </button>
        ))}
      </div>
      <Segmented
        value={mode}
        onChange={setMode}
        options={[{ id: 'wo', label: 'Wo? → Dativ' }, { id: 'wohin', label: 'Wohin? → Akkusativ' }]}
        label="mode"
      />
      <svg viewBox="0 0 300 210" className={`prepsvg prepsvg--${mode}`} role="img" aria-label={sentence}>
        <line x1="10" y1="188" x2="290" y2="188" className="prepsvg__floor" />
        {p.behind && <circle cx={p.x} cy={p.y} r="13" className="prepsvg__ball" />}
        <g className="prepsvg__box">
          <rect x="100" y="100" width="100" height="60" rx="8" />
          {p.twoBoxes && <rect x="22" y="100" width="60" height="60" rx="8" />}
          {p.twoBoxes && <rect x="218" y="100" width="60" height="60" rx="8" />}
        </g>
        {p.twoBoxes && <rect x="100" y="100" width="100" height="60" rx="8" className="prepsvg__ghost" />}
        {!p.behind && (
          <g key={`${idx}-${mode}`} className={mode === 'wohin' ? 'prepsvg__move' : ''} style={{ ['--fx' as string]: `${from.x - p.x}px`, ['--fy' as string]: `${from.y - p.y}px` }}>
            <circle cx={p.x} cy={p.y} r="13" className="prepsvg__ball" />
          </g>
        )}
        {mode === 'wohin' && !p.behind && (
          <path d={`M ${from.x} ${from.y} Q ${(from.x + p.x) / 2} ${Math.min(from.y, p.y) - 24} ${p.x} ${p.y}`} className="prepsvg__path" fill="none" />
        )}
        <text x="150" y="203" textAnchor="middle" className="prepsvg__label">{mode === 'wo' ? 'Wo? — Position' : 'Wohin? — Richtung'}</text>
      </svg>
      <div className="whybox">
        <div className="de break whybox__sentence">
          {sentence}
          <SpeakButton text={sentence} small />
        </div>
        <div className="muted small">{mode === 'wo' ? (lang === 'de' ? 'Position, keine Bewegung → Dativ' : 'Положение, нет движения → Dativ') : lang === 'de' ? 'Bewegung in eine Richtung → Akkusativ' : 'Движение, направление → Akkusativ'}</div>
      </div>
    </div>
  )
}

export function TimelineLab() {
  const { lang } = useApp()
  const [sel, setSel] = useState('past')
  const cur = TIMELINE.find(x => x.id === sel)!
  return (
    <div className="lab">
      <div className="timeline">
        <div className="timeline__axis" />
        {TIMELINE.map(x => (
          <button key={x.id} type="button" className={`timeline__node ${sel === x.id ? 'is-active' : ''}`} onClick={() => setSel(x.id)} aria-pressed={sel === x.id}>
            <span className="timeline__dot" />
            <span>{tr(x.label, lang)}</span>
            <small>{x.tense}</small>
          </button>
        ))}
      </div>
      <div className="whybox" key={sel}>
        <div className="de break whybox__sentence">
          {cur.sentence}
          <SpeakButton text={cur.sentence} small />
        </div>
        <div className="muted small">{cur.ru}</div>
        <div className="row" style={{ marginTop: 10 }}>
          {cur.parts.map(p => (
            <span key={p.text} className={`blk blk--${p.role}`}>
              {p.text}
            </span>
          ))}
        </div>
      </div>
      <p className="muted small">Perfekt = haben / sein (2-е место) + Partizip II (в конец): ge-lern-t, ge-fahr-en.</p>
    </div>
  )
}

export function NegationLab() {
  const { lang } = useApp()
  const [i, setI] = useState(0)
  const [choice, setChoice] = useState<'kein' | 'nicht' | null>(null)
  const item = NEGATION_ITEMS[i]
  const done = choice !== null
  const ok = choice === item.rule
  return (
    <div className="lab">
      <div className="row">
        {NEGATION_ITEMS.map((_, k) => (
          <button key={k} type="button" className={`chip ${k === i ? 'is-active' : ''}`} onClick={() => { setI(k); setChoice(null) }}>
            {k + 1}
          </button>
        ))}
      </div>
      <div className="whybox">
        <div className="de break whybox__sentence">{item.positive}</div>
        <div className="muted small">kein? nicht?</div>
      </div>
      <div className="row">
        <button type="button" className={`option ${done && item.rule === 'kein' ? 'is-right' : ''} ${choice === 'kein' && !ok ? 'is-wrong' : ''}`} onClick={() => setChoice('kein')}>kein-</button>
        <button type="button" className={`option ${done && item.rule === 'nicht' ? 'is-right' : ''} ${choice === 'nicht' && !ok ? 'is-wrong' : ''}`} onClick={() => setChoice('nicht')}>nicht</button>
      </div>
      {done && (
        <div className={`feedback ${ok ? 'feedback--ok' : 'feedback--bad'}`}>
          <div className="de break">{item.negative}</div>
          <p>{tr(item.reason, lang)}</p>
        </div>
      )}
      <ol className="tree">
        <li className={done && item.rule === 'kein' ? 'is-on' : ''}>Существительное с <b>ein-</b> или без артикля? → <b>kein-</b></li>
        <li className={done && item.rule === 'nicht' ? 'is-on' : ''}>Глагол, прилагательное, der/die/das-слово? → <b>nicht</b></li>
      </ol>
    </div>
  )
}

export function PluralLab() {
  const { lang } = useApp()
  const [ti, setTi] = useState(1)
  const type = PLURAL_TYPES[ti]
  return (
    <div className="lab">
      <div className="row">
        {PLURAL_TYPES.map((x, i) => (
          <button key={x.label} type="button" className={`chip ${i === ti ? 'is-active' : ''}`} onClick={() => setTi(i)}>
            {x.label}
          </button>
        ))}
      </div>
      <p className="muted small">{tr(type.hint, lang)}</p>
      <div className="stack stack--sm" key={ti}>
        {type.pairs.map(([s, p], k) => (
          <div key={s} className="pluralrow" style={{ animationDelay: `${k * 90}ms` }}>
            <span className="de">{s}</span>
            <span aria-hidden className="pluralrow__arrow">→</span>
            <span className="de pluralrow__pl">{p}</span>
            <SpeakButton text={p} small />
          </div>
        ))}
      </div>
    </div>
  )
}

export function ArticleLab() {
  const [open, setOpen] = useState<string | null>(null)
  return (
    <div className="lab">
      <div className="artgrid">
        {ARTICLE_COLUMNS.map(col => (
          <div key={col.art} className={`artcol artcol--${col.tone}`}>
            <button type="button" className="artcol__head" onClick={() => setOpen(open === col.art ? null : col.art)} aria-expanded={open === col.art}>
              {col.art}
            </button>
            <div className="artcol__nouns">
              {col.nouns.map(n => (
                <span key={n} className="de">{n}</span>
              ))}
            </div>
            {open === col.art && (
              <ul className="artcol__hints">
                {col.hints.map(h => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <p className="muted small">Нажмите на артикль — увидите подсказки по окончаниям.</p>
    </div>
  )
}

export function ConceptVisual({ concept }: { concept: GrammarConcept }) {
  switch (concept.visual) {
    case 'cases':
      return <CaseLab initial={CASE_BY_CONCEPT[concept.id] ?? 'nom'} />
    case 'verbpos':
    case 'separable':
    case 'modal':
      return <SentenceBlocks conceptId={SENTENCE_LABS[concept.id] ? concept.id : 'verb-position'} />
    case 'conjugation':
      return <ConjugationLab conceptId={concept.id} />
    case 'prepositions':
      return <PrepLab />
    case 'timeline':
      return <TimelineLab />
    case 'negation':
      return <NegationLab />
    case 'plural':
      return <PluralLab />
    case 'articles':
      return <ArticleLab />
    case 'none':
      return SENTENCE_LABS[concept.id] ? <SentenceBlocks conceptId={concept.id} /> : null
    default:
      return null
  }
}
