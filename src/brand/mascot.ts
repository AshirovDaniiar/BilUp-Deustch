import type { L10n } from '../data/types'

/**
 * BilUp snow leopard — the official brand mascot (shared by BilUp Til, and later Test / STEM).
 *
 * Asset architecture
 *   brand/mascot/source/snow-leopard-master.png   canonical master (1254², never shipped, never edited)
 *   public/brand/mascot/                          optimised derivatives (everything in public/ is precached by the service worker,
 *                                                 so only small files belong here)
 *
 * A POSE is one canonical-reference variation (same face, proportions, fur, kalpak, hoodie). Only `welcome` exists today.
 * To add a pose (thinking, celebrating, …): produce it from the master, add `<pose>-640.webp`, `<pose>-320.webp`,
 * `<pose>-avatar-192.webp`, `<pose>-avatar-96.webp` to public/brand/mascot/, and add one entry below. Components fall back to
 * `welcome` for any pose without its own files.
 */
export type MascotPose = 'welcome'
export type MascotVariant = 'illustration' | 'avatar'

interface PoseAssets {
  /** full character, square. 1x / 2x */
  illustration: { small: string; large: string; smallPx: number; largePx: number }
  /** head + kalpak crop, square — for small UI (header, chat, result) where the full figure would be illegible */
  avatar: { small: string; large: string; smallPx: number; largePx: number }
  alt: L10n
}

const DIR = 'brand/mascot/'

export const MASCOT: Record<MascotPose, PoseAssets> = {
  welcome: {
    illustration: { small: `${DIR}snow-leopard-320.webp`, large: `${DIR}snow-leopard-640.webp`, smallPx: 320, largePx: 640 },
    avatar: { small: `${DIR}avatar-96.webp`, large: `${DIR}avatar-192.webp`, smallPx: 96, largePx: 192 },
    alt: {
      ru: 'Снежный барс BilUp — маскот и спутник в обучении: в калпаке, бирюзовой толстовке, с книгой',
      ky: 'BilUp илбирси — окууда жолдош маскот: калпак кийген, бирюза худиде, китеп кармап',
      de: 'Der BilUp-Schneeleopard — Maskottchen und Lernbegleiter mit Kalpak, türkisem Hoodie und Buch',
    },
  },
}

/** Short accessible name for the avatar when it is the only content of a control (not needed when next to the wordmark). */
export const MASCOT_NAME: L10n = { ru: 'Снежный барс BilUp', ky: 'BilUp илбирси', de: 'BilUp-Schneeleopard' }
