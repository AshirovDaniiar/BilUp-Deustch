// Exact (not simulated) statistics for the answer-position check. Deterministic: no random numbers anywhere.

const lnFactorial = (() => {
  const cache = [0]
  return (n: number): number => {
    for (let i = cache.length; i <= n; i++) cache[i] = cache[i - 1] + Math.log(i)
    return cache[n]
  }
})()

/** Binomial probability mass P(X = k) for X ~ Bin(n, p). */
export function binomialPmf(n: number, k: number, p: number): number {
  if (k < 0 || k > n) return 0
  const ln = lnFactorial(n) - lnFactorial(k) - lnFactorial(n - k) + k * Math.log(p) + (n - k) * Math.log(1 - p)
  return Math.exp(ln)
}

/**
 * Two-sided exact binomial p-value ("minimum likelihood"): the probability, if every answer position were equally likely
 * (success probability p per question), of a count at least as unlikely as the one observed.
 */
export function binomialTwoSidedP(n: number, observed: number, p: number): number {
  const target = binomialPmf(n, observed, p)
  let sum = 0
  for (let i = 0; i <= n; i++) {
    const pm = binomialPmf(n, i, p)
    if (pm <= target * (1 + 1e-9)) sum += pm
  }
  return Math.min(1, sum)
}
