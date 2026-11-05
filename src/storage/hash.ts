/** Small non-cryptographic fingerprint (FNV-1a 32-bit + length). Used only to name/dedupe backup copies and detect drift. */
export function fingerprint(raw: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return `${(h >>> 0).toString(16).padStart(8, '0')}-${raw.length.toString(16)}`
}
