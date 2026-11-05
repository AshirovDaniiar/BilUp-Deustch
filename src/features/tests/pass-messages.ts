import type { Lang } from '../../data/types'

/**
 * Explains the pass rule on a result (V-05). The Kyrgyz lines are an UNREVIEWED best effort (same status as src/i18n/ky.ts).
 * Placeholders: {need} {got}
 */
export const PASS_MESSAGES: Record<Lang, { notYet: string; done: string }> = {
  ru: { notYet: 'Раздел пока не засчитан: нужно набрать не менее {need}% (у вас {got}%). Попробуйте ещё раз.', done: 'Раздел засчитан ✓' },
  ky: {
    notYet: 'Бөлүм азырынча эсептелген жок: кеминде {need}% керек (сизде {got}%). Дагы бир жолу аракет кылыңыз.',
    done: 'Бөлүм эсептелди ✓',
  },
  de: {
    notYet: 'Noch nicht abgeschlossen: Du brauchst mindestens {need} % (du hast {got} %). Versuche es noch einmal.',
    done: 'Abschnitt abgeschlossen ✓',
  },
}
