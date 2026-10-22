export const dayKey = (d = new Date()) => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const addDays = (d: Date, n: number) => {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

/** Consecutive active days ending today (or yesterday, so the streak is not lost before the learner opens the app). */
export function streakOf(dates: string[]): number {
  const set = new Set(dates)
  let cursor = new Date()
  if (!set.has(dayKey(cursor))) cursor = addDays(cursor, -1)
  let n = 0
  while (set.has(dayKey(cursor))) {
    n++
    cursor = addDays(cursor, -1)
  }
  return n
}

/** Monday-based week containing today → list of day keys. */
export function currentWeek(): string[] {
  const now = new Date()
  const offset = (now.getDay() + 6) % 7
  return Array.from({ length: 7 }, (_, i) => dayKey(addDays(now, i - offset)))
}

export function greetingKey(): 'goodMorning' | 'goodDay' | 'goodEvening' {
  const h = new Date().getHours()
  return h < 11 ? 'goodMorning' : h < 18 ? 'goodDay' : 'goodEvening'
}
