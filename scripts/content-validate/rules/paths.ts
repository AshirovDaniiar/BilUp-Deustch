// Path resolution shared by the schema and localization rules.
export type Hit = { where: string; value: unknown; present: boolean }

/** Resolve `a.b[].c` against an object: every element of every array on the way is visited; `where` carries the indices. */
export function resolve(obj: unknown, path: string, prefix = ''): Hit[] {
  if (path === '') return [{ where: prefix, value: obj, present: obj !== undefined }]
  const [head, ...rest] = path.split('.')
  const isArray = head.endsWith('[]')
  const key = isArray ? head.slice(0, -2) : head
  const child = obj !== null && typeof obj === 'object' ? (obj as Record<string, unknown>)[key] : undefined
  const restPath = rest.join('.')
  const at = prefix ? `${prefix}.${key}` : key
  if (!isArray) return resolve(child, restPath, at)
  if (!Array.isArray(child)) return [{ where: `${at}[]`, value: undefined, present: false }]
  return child.flatMap((el, i) => resolve(el, restPath, `${at}[${i}]`))
}
