import type { Lang } from '../data/types'

/**
 * Texts of the install / update notices (chrome, 02 §3). Kept inside the PWA module so no existing dictionary changes in P0b.
 * Russian and German are straightforward; the Kyrgyz lines are an UNREVIEWED best effort in the same status as src/i18n/ky.ts
 * and must go through the Kyrgyz review process (Q2/Q16) before the Kyrgyz release gate.
 */
export interface PwaMessages {
  updateTitle: string
  updateBody: string
  updateAction: string
  later: string
  installTitle: string
  installBody: string
  installAction: string
  iosTitle: string
  iosBody: string
  close: string
}

export const PWA_MESSAGES: Record<Lang, PwaMessages> = {
  ru: {
    updateTitle: 'Доступна новая версия',
    updateBody: 'Обновите приложение, когда будете готовы. Ваш прогресс сохранится.',
    updateAction: 'Обновить',
    later: 'Позже',
    installTitle: 'Установить приложение',
    installBody: 'Быстрый доступ с домашнего экрана. Уроки по-прежнему требуют подключения к интернету.',
    installAction: 'Установить',
    iosTitle: 'Добавить на экран «Домой»',
    iosBody: 'Нажмите «Поделиться», затем «На экран «Домой»».',
    close: 'Закрыть',
  },
  ky: {
    updateTitle: 'Жаңы версия бар',
    updateBody: 'Даяр болгондо колдонмону жаңыртыңыз. Жетишкендигиңиз сакталат.',
    updateAction: 'Жаңыртуу',
    later: 'Кийинчерээк',
    installTitle: 'Колдонмону орнотуу',
    installBody: 'Башкы экрандан тез ачуу. Сабактар үчүн интернет керек.',
    installAction: 'Орнотуу',
    iosTitle: '«Башкы экранга» кошуу',
    iosBody: '«Бөлүшүү» баскычын басып, «Башкы экранга» тандаңыз.',
    close: 'Жабуу',
  },
  de: {
    updateTitle: 'Neue Version verfügbar',
    updateBody: 'Aktualisiere die App, sobald du bereit bist. Dein Fortschritt bleibt erhalten.',
    updateAction: 'Aktualisieren',
    later: 'Später',
    installTitle: 'App installieren',
    installBody: 'Schneller Zugriff vom Startbildschirm. Lerninhalte benötigen weiterhin eine Internetverbindung.',
    installAction: 'Installieren',
    iosTitle: 'Zum Home-Bildschirm hinzufügen',
    iosBody: 'Tippe auf „Teilen“ und dann auf „Zum Home-Bildschirm“.',
    close: 'Schließen',
  },
}
