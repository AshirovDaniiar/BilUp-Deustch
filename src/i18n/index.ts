import type { Lang } from '../data/types'
import { de } from './de'
import { ky } from './ky'
import { ru, type Dict } from './ru'

export type TKey = keyof Dict
export const dictionaries: Record<Lang, Dict> = { ru: ru as Dict, ky, de }
export const LANG_LABELS: Record<Lang, string> = { ru: 'Русский', ky: 'Кыргызча', de: 'Deutsch' }
export const makeT = (lang: Lang) => (key: TKey): string => dictionaries[lang][key] ?? (ru as Dict)[key]
export type TFn = ReturnType<typeof makeT>
