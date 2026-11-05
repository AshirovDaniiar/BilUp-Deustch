import { StorageError, type KeyValueStore } from '../../src/storage/kv'

/** In-memory KeyValueStore with a write log, so tests can assert ORDER of operations. */
export interface MemKV extends KeyValueStore {
  m: Map<string, string>
  /** every successful or attempted mutation, in order: `set:<key>` / `remove:<key>` */
  log: string[]
  snapshot(): Record<string, string>
}

export function memoryKV(initial: Record<string, string> = {}): MemKV {
  const m = new Map(Object.entries(initial))
  const log: string[] = []
  return {
    m,
    log,
    get: k => m.get(k) ?? null,
    set: (k, v) => {
      log.push(`set:${k}`)
      m.set(k, v)
    },
    remove: k => {
      log.push(`remove:${k}`)
      m.delete(k)
    },
    keys: p => [...m.keys()].filter(k => k.startsWith(p)).sort(),
    snapshot: () => Object.fromEntries(m),
  }
}

export class SimulatedCrash extends Error {
  constructor(public readonly point: string) {
    super(`simulated crash at ${point}`)
  }
}

export type SetFault = false | 'quota' | 'unavailable' | 'crash-before' | 'crash-after' | 'lie'
export interface Faults {
  /** decide per `set` call (nth counts from 1 across all keys) */
  set?: (key: string, nth: number) => SetFault
  get?: (key: string) => boolean
  keys?: boolean
}

/** Wraps a MemKV and injects failures. Mutations that "crash" either happen or not, exactly as in a real interruption. */
export function faultyKV(inner: MemKV, faults: Faults): MemKV {
  let nth = 0
  return {
    ...inner,
    get: k => {
      if (faults.get?.(k)) throw new StorageError('unavailable', `injected read failure for ${k}`)
      return inner.get(k)
    },
    keys: p => {
      if (faults.keys) throw new StorageError('unavailable', 'injected enumerate failure')
      return inner.keys(p)
    },
    set: (k, v) => {
      nth++
      const f = faults.set?.(k, nth) ?? false
      if (f === 'quota') throw new StorageError('quota', `injected quota failure for ${k}`)
      if (f === 'unavailable') throw new StorageError('unavailable', `injected write failure for ${k}`)
      if (f === 'crash-before') throw new SimulatedCrash(`before set ${k}`)
      if (f === 'lie') return inner.set(k, v + ' ') // stores something different from what was written
      inner.set(k, v)
      if (f === 'crash-after') throw new SimulatedCrash(`after set ${k}`)
    },
  }
}
