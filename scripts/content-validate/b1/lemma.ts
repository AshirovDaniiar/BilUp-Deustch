// Lemma normalisation for the vocabulary-overlap check (B1 Stage 2C).
// A vocabulary item's German headword (`de`) is reduced to comparable lemma keys: lower-case, without the leading article, without a
// reflexive "sich", without parenthesised additions, split at "/", ";" and "," (gender pairs such as "der Arzt, die Ärztin" give two keys).
// This is deliberately conservative: it finds the same headword listed twice, not related word forms (no stemming, no word list).
const strip = (s: string) =>
  s
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[|·]/g, '')
    .replace(/\bsich\b/g, ' ')
    .replace(/^\s*(der|die|das|ein|eine)\s+/, '')
    .replace(/\s+/g, ' ')
    .trim()

export function lemmaKeys(de: string): string[] {
  return (typeof de === 'string' ? de : '')
    .split(/[/;,]/)
    .map(strip)
    .filter(k => k !== '')
}
