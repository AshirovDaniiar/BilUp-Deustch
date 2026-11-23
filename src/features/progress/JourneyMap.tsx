import type { CSSProperties } from 'react'
import { Mascot } from '../../components/Mascot'
import { Card } from '../../components/ui'
import { tr } from '../../utils/text'
import type { Lang } from '../../data/types'
import {
  JOURNEY_LEVELS,
  JOURNEY_TEXT,
  LEVEL_NAMES,
  MAP_H,
  MAP_W,
  SEGMENT_COUNT,
  isRight,
  mascotPoint,
  milestonePoint,
  segmentPath,
  travelled,
  type Journey,
  type JourneyLevel,
  type Milestone,
} from './journey'

const ROW_BOX = 124 // height (map units) reserved above each milestone's base for its mountain and label
const pctOf = (v: number, total: number) => `${(v / total) * 100}%`

function Mountain({ status, summit }: { status: Milestone['status']; summit: boolean }) {
  return (
    <svg className={`jm__peak jm__peak--${status}`} viewBox="0 0 100 80" aria-hidden focusable="false">
      <path className="jm__back" d="M52 80 L77 36 L100 80 Z" />
      <path className="jm__main" d="M2 80 L42 10 L96 80 Z" />
      <path className="jm__snow" d="M42 10 L30 32 L37 28 L43 35 L50 28 L59 33 Z" />
      {summit && <path className="jm__flag" d="M42 10 V-2 M42 -2 L56 3 L42 8" />}
    </svg>
  )
}

function MilestoneItem({ m, i, lang, onSelect }: { m: Milestone; i: number; lang: Lang; onSelect: (level: JourneyLevel) => void }) {
  const [x, y] = milestonePoint(i)
  const right = isRight(i)
  const summit = m.level === 'C2'
  const width = 25 + i * 2.2 // the peaks grow towards C2
  const meta =
    m.status === 'completed' ? `✓ ${tr(JOURNEY_TEXT.completed, lang)}` : m.status === 'locked' ? '🔒' : m.pct > 0 ? `${m.pct}%` : ''
  const style: CSSProperties = { top: pctOf(y - ROW_BOX, MAP_H), height: pctOf(ROW_BOX, MAP_H) }
  const peakStyle: CSSProperties = { left: pctOf(x, MAP_W), width: `${width}%` }
  const body = (
    <>
      <span className="jm__peakbox" style={peakStyle}>
        <Mountain status={m.status} summit={summit} />
      </span>
      <span className={`jm__label ${right ? 'jm__label--l' : 'jm__label--r'}`}>
        <span className="jm__lvl">{m.level}</span>
        <span className="jm__name">{tr(LEVEL_NAMES[m.level], lang)}</span>
        <span className="jm__meta">{meta}</span>
      </span>
    </>
  )
  const cls = `jm jm--${m.status}`
  return (
    <li className={cls} style={style} aria-current={m.status === 'current' ? 'step' : undefined}>
      {m.enterable ? (
        <button type="button" className="jm__hit" onClick={() => onSelect(m.level)} aria-label={`${m.level} · ${tr(LEVEL_NAMES[m.level], lang)} · ${meta}`}>
          {body}
        </button>
      ) : (
        <div className="jm__hit" role="img" aria-label={`${m.level} · ${tr(LEVEL_NAMES[m.level], lang)} · ${meta}`}>
          {body}
        </div>
      )}
    </li>
  )
}

/**
 * "My German learning journey": one winding road through six mountains (A1 → C2). The lit part of the road and the snow leopard's
 * position both come from `journey.position`, which is derived from the learner's saved progress — see features/progress/journey.ts.
 */
export function JourneyMap({ journey, lang, onSelect }: { journey: Journey; lang: Lang; onSelect: (level: JourneyLevel) => void }) {
  const [mx, my] = mascotPoint(journey.position)
  return (
    <Card as="section" className="jmap">
      <h2 className="h2 jmap__title">{tr(JOURNEY_TEXT.journeyTitle, lang)}</h2>
      <div className="jmap__stage" style={{ aspectRatio: `${MAP_W} / ${MAP_H}` }}>
        <svg className="jmap__road" viewBox={`0 0 ${MAP_W} ${MAP_H}`} aria-hidden focusable="false">
          {Array.from({ length: SEGMENT_COUNT }, (_, k) => {
            const d = segmentPath(k)
            const done = travelled(journey.position, k)
            return (
              <g key={k}>
                <path className="jmap__bed" d={d} />
                <path className="jmap__dash" d={d} />
                {done > 0 && <path className="jmap__lit" d={d} pathLength={1} strokeDasharray={`${done} 1`} />}
              </g>
            )
          })}
        </svg>
        <ol className="jmap__list" aria-label={tr(JOURNEY_TEXT.journeyTitle, lang)}>
          {journey.milestones.map((m, i) => (
            <MilestoneItem key={JOURNEY_LEVELS[i]} m={m} i={i} lang={lang} onSelect={onSelect} />
          ))}
        </ol>
        {journey.ready && (
          <div className="jmap__rider" style={{ left: pctOf(mx, MAP_W), top: pctOf(my, MAP_H) }}>
            <Mascot variant="cutout" size={62} decorative />
          </div>
        )}
      </div>
    </Card>
  )
}
