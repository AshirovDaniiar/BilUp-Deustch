import { useApp } from '../app/store'
import { availableLevels, resolveActiveLevel } from '../data/course'
import { BetaNotice } from './BetaNotice'
import { Chip } from './ui'

/**
 * Level switch for the course screens. Shows only levels the learner may enter (released for their language); with a single
 * available level there is nothing to choose, so nothing is rendered — never a locked or "coming soon" level.
 * The choice is the stored level preference (the same value the dashboard and progress use).
 */
export function LevelTabs() {
  const { state, actions, t } = useApp()
  const levels = availableLevels(state.lang)
  const active = resolveActiveLevel(state.level, state.lang)
  if (levels.length < 2) return <BetaNotice level={active} />
  return (
    <>
      <div className="levels" role="tablist" aria-label={t('level')}>
        {levels.map(l => (
          <Chip key={l} tone="blue" active={l === active} onClick={() => actions.setProfile({ level: l })}>
            {l}
          </Chip>
        ))}
      </div>
      <BetaNotice level={active} />
    </>
  )
}
