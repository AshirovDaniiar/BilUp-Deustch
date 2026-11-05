/**
 * Active-time measurement (05 §5, V-08). An interval counts only while the tab is visible AND the learner interacted within the idle
 * window (default 60 s [A]). Pure: every method takes the current time, so it is deterministic and testable without a browser.
 *
 * Invariant used by `advance`: `lastInteraction ≤ last` at all times (interactions are applied after advancing), so the active part of
 * [last, t] is exactly the overlap with [lastInteraction, lastInteraction + idle].
 */
export const DEFAULT_IDLE_MS = 60_000

export class ActiveTimeTracker {
  private totalMs = 0
  private flushedMs = 0
  private last: number
  private lastInteraction: number
  private visible = true

  constructor(
    start: number,
    private readonly idleMs = DEFAULT_IDLE_MS,
  ) {
    this.last = start
    this.lastInteraction = start // opening the app is itself an interaction
  }

  private advance(t: number): void {
    if (t <= this.last) return
    if (this.visible) {
      const activeUntil = Math.min(t, this.lastInteraction + this.idleMs)
      if (activeUntil > this.last) this.totalMs += activeUntil - this.last
    }
    this.last = t
  }

  /** a pointer / key / scroll / touch event */
  touch(t: number): void {
    this.advance(t)
    if (t > this.lastInteraction) this.lastInteraction = t
  }

  /** `visibilitychange`; returning to the tab counts as an interaction */
  setVisible(visible: boolean, t: number): void {
    this.advance(t)
    this.visible = visible
    if (visible && t > this.lastInteraction) this.lastInteraction = t
  }

  /** cumulative active milliseconds so far (monotonic) */
  mark(t: number): number {
    this.advance(t)
    return this.totalMs
  }

  /** whole seconds accumulated since the previous call; the sub-second remainder is carried over, nothing is lost or counted twice */
  consumeSeconds(t: number): number {
    this.advance(t)
    const seconds = Math.floor((this.totalMs - this.flushedMs) / 1000)
    this.flushedMs += seconds * 1000
    return seconds
  }
}
