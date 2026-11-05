/**
 * Thin key-value contract (05 §6). Synchronous in P1 because the adapter is localStorage.
 * Errors are NEVER swallowed here: callers decide how to degrade. `get` returns the raw string exactly as stored.
 */
export type StorageErrorKind = 'unavailable' | 'quota' | 'verify'

export class StorageError extends Error {
  readonly kind: StorageErrorKind
  constructor(kind: StorageErrorKind, message: string, options?: { cause?: unknown }) {
    super(message, options)
    this.name = 'StorageError'
    this.kind = kind
  }
}

export interface KeyValueStore {
  get(key: string): string | null
  set(key: string, raw: string): void
  remove(key: string): void
  keys(prefix: string): string[]
}

const isQuota = (e: unknown) =>
  e instanceof Error && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || /quota/i.test(e.message))

/** localStorage adapter. Accessing `window.localStorage` itself can throw (sandboxed frames, blocked cookies). */
export function localStorageKV(getStorage: () => Storage = () => window.localStorage): KeyValueStore {
  const s = (): Storage => {
    try {
      return getStorage()
    } catch (e) {
      throw new StorageError('unavailable', 'localStorage is not accessible', { cause: e })
    }
  }
  return {
    get(key) {
      try {
        return s().getItem(key)
      } catch (e) {
        if (e instanceof StorageError) throw e
        throw new StorageError('unavailable', `cannot read "${key}"`, { cause: e })
      }
    },
    set(key, raw) {
      try {
        s().setItem(key, raw)
      } catch (e) {
        if (e instanceof StorageError) throw e
        throw new StorageError(isQuota(e) ? 'quota' : 'unavailable', `cannot write "${key}"`, { cause: e })
      }
    },
    remove(key) {
      try {
        s().removeItem(key)
      } catch (e) {
        if (e instanceof StorageError) throw e
        throw new StorageError('unavailable', `cannot remove "${key}"`, { cause: e })
      }
    },
    keys(prefix) {
      try {
        const st = s()
        const out: string[] = []
        for (let i = 0; i < st.length; i++) {
          const k = st.key(i)
          if (k !== null && k.startsWith(prefix)) out.push(k)
        }
        return out.sort()
      } catch (e) {
        if (e instanceof StorageError) throw e
        throw new StorageError('unavailable', 'cannot enumerate keys', { cause: e })
      }
    },
  }
}

/** Writes and reads back; throws StorageError('verify') when the stored value differs from what was written. */
export function setVerified(kv: KeyValueStore, key: string, raw: string): void {
  kv.set(key, raw)
  if (kv.get(key) !== raw) throw new StorageError('verify', `read-back of "${key}" did not match`)
}
