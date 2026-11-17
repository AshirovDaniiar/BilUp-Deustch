/** In-memory stand-ins for CacheStorage / fetch / a service-worker global, so worker logic is tested without a browser. */
export interface Net {
  /** url → response factory; absent = network failure (offline) */
  routes: Map<string, () => Response>
  offline: boolean
  calls: string[]
}

export const makeNet = (routes: Record<string, string | (() => Response)> = {}): Net => ({
  routes: new Map(Object.entries(routes).map(([u, v]) => [u, typeof v === 'string' ? () => new Response(v) : v])),
  offline: false,
  calls: [],
})

export const netFetch =
  (net: Net) =>
  async (input: Request | string): Promise<Response> => {
    const url = typeof input === 'string' ? input : input.url
    net.calls.push(url)
    if (net.offline) throw new TypeError('Failed to fetch')
    const r = net.routes.get(url)
    if (!r) return new Response('not found', { status: 404 })
    return r()
  }

class FakeCache {
  store = new Map<string, { body: string; status: number }>()
  puts: string[] = []
  constructor(private net: Net) {}
  async addAll(reqs: Request[]) {
    // like the real Cache.addAll: all-or-nothing, rejects on any network failure or non-2xx
    const fetched: [string, { body: string; status: number }][] = []
    for (const r of reqs) {
      const res = await netFetch(this.net)(r)
      if (!res.ok) throw new TypeError(`addAll: bad response ${res.status} for ${r.url}`)
      fetched.push([r.url, { body: await res.text(), status: res.status }])
    }
    for (const [u, v] of fetched) this.store.set(u, v)
  }
  async put(req: Request | string, res: Response) {
    const u = typeof req === 'string' ? req : req.url
    this.puts.push(u)
    this.store.set(u, { body: await res.text(), status: res.status })
  }
  async keys() {
    return [...this.store.keys()].map(u => new Request(u))
  }
  async delete(req: Request | string) {
    return this.store.delete(typeof req === 'string' ? req : req.url)
  }
  async match(req: Request | string) {
    const u = typeof req === 'string' ? req : req.url
    const v = this.store.get(u)
    return v ? new Response(v.body, { status: v.status }) : undefined
  }
}

export class FakeCaches {
  map = new Map<string, FakeCache>()
  broken = false
  constructor(public net: Net) {}
  async open(name: string) {
    if (this.broken) throw new Error('storage unavailable')
    if (!this.map.has(name)) this.map.set(name, new FakeCache(this.net))
    return this.map.get(name)! as unknown as Cache
  }
  async keys() {
    if (this.broken) throw new Error('storage unavailable')
    return [...this.map.keys()]
  }
  async delete(name: string) {
    return this.map.delete(name)
  }
  async has(name: string) {
    return this.map.has(name)
  }
  get names() {
    return [...this.map.keys()]
  }
  cache(name: string) {
    return this.map.get(name) as unknown as { store: Map<string, unknown>; puts: string[] }
  }
  asCaches() {
    return this as unknown as CacheStorage
  }
}

export const req = (url: string, init: { method?: string; mode?: string; headers?: Record<string, string> } = {}) => ({
  url,
  method: init.method ?? 'GET',
  mode: init.mode ?? 'no-cors',
  headers: { get: (n: string) => init.headers?.[n.toLowerCase()] ?? null },
})
