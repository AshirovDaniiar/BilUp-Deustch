/** Attempt / result identity. Created when an attempt STARTS, so a double-fired finish handler or a replay cannot create a second credit. */
export function newResultId(): string {
  const c = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto
  if (c?.randomUUID) return c.randomUUID()
  const rnd = () =>
    Math.floor(Math.random() * 0x100000000)
      .toString(16)
      .padStart(8, '0')
  return `${Date.now().toString(16)}-${rnd()}-${rnd()}`
}
