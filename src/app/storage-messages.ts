import type { Lang } from '../data/types'

/**
 * Texts of the storage notice (chrome, 02 §3). Russian and German are straightforward; the Kyrgyz lines are an UNREVIEWED
 * best effort (same status as src/i18n/ky.ts and src/pwa/messages.ts) and must pass the Kyrgyz review (Q2/Q16) BEFORE any Kyrgyz release.
 *
 * S2 additions: failure notices (`save-failed`, `history-not-saved`, `history-readonly`) are PERSISTENT — they cannot be dismissed while the
 * failure lasts — and warn that unsaved work may be lost on closing or reloading (owner decisions R3 / STO-100). `replaced` and
 * `upgrade-pending` are informational (dismissible per episode, STO-94).
 */
export type StorageNoticeKind =
  | 'repaired'
  | 'recovered'
  | 'pending'
  | 'unreadable'
  | 'future'
  | 'readonly'
  | 'save-failed'
  | 'history-not-saved'
  | 'history-readonly'
  | 'replaced'
  | 'upgrade-pending'

/** the kinds that describe a failure or an unsaved condition: NOT dismissible while it lasts */
export const FAILURE_KINDS: readonly StorageNoticeKind[] = ['save-failed', 'history-not-saved', 'history-readonly']

export interface StorageMessages {
  titles: Record<StorageNoticeKind, string>
  bodies: Record<StorageNoticeKind, string>
  download: string
  close: string
  options: string
  /** retry button of the failure notices */
  retry: string
  /** shown when "reset progress" was refused because the safety copy could not be made (STO-17) */
  resetRefused: string
  /** shown when Reset / Start Fresh / Restore / Rollback is refused because the layout-2 upgrade has not completed (owner decision C5) */
  upgradePendingRefusal: string
  /** low-priority notes about the preferences / tutor / history records (S1 design 4): `{name}` is replaced by the record name */
  slice: {
    names: Record<'prefs' | 'tutor' | 'results', string>
    damaged: string
    newer: string
    unsafe: string
  }
}

export const STORAGE_MESSAGES: Record<Lang, StorageMessages> = {
  ru: {
    titles: {
      repaired: 'Часть сохранённых данных была исправлена',
      recovered: 'Прогресс восстановлен из резервной копии',
      pending: 'Сохранённые данные повреждены — нужно ваше решение',
      unreadable: 'Не удалось прочитать сохранённый прогресс',
      future: 'Данные созданы более новой версией приложения',
      readonly: 'Прогресс сейчас не сохраняется',
      'save-failed': 'Не удаётся сохранить прогресс',
      'history-not-saved': 'История попыток пока не сохранена',
      'history-readonly': 'История попыток создана более новой версией приложения',
      replaced: 'Прогресс был заменён в другом окне',
      'upgrade-pending': 'Обновление хранилища ещё не завершено',
    },
    bodies: {
      repaired: 'Мы исправили повреждённые записи. Копия исходных данных сохранена на этом устройстве — ничего не удалено.',
      recovered: 'Копия повреждённых данных сохранена на этом устройстве.',
      pending: 'Мы нашли копию и показываем её, но на устройстве ничего не перезаписано. Выберите, что делать.',
      unreadable:
        'Ваши данные не удалены: они сохранены на устройстве. Скачайте копию, чтобы не потерять их. Сейчас приложение начинает с чистого листа.',
      future: 'Чтобы не повредить их, изменения в этой версии не сохраняются.',
      readonly: 'Чтобы не перезаписать ваши данные, в этом сеансе изменения не сохраняются. Скачайте копию данных.',
      'save-failed':
        'Хранилище браузера недоступно или переполнено. Несохранённая работа может быть потеряна при закрытии или перезагрузке вкладки. Нажмите «Повторить».',
      'history-not-saved':
        'Не сохранено записей истории: {n}. Прогресс (XP) сохранён. Несохранённая история может быть потеряна при закрытии или перезагрузке вкладки. Нажмите «Повторить».',
      'history-readonly':
        'История попыток в этой версии не записывается, чтобы её не повредить. Новые записи хранятся только в памяти и могут быть потеряны при закрытии или перезагрузке вкладки.',
      replaced: 'Другое окно заменило ваш прогресс. Ваша последняя попытка сохранена в истории, но её XP не входит в текущий прогресс.',
      'upgrade-pending':
        'Обновление хранилища не завершилось. Ваши данные не изменены; сброс, новое начало и восстановление пока недоступны. Приложение повторит попытку.',
    },
    download: 'Скачать копию',
    close: 'Закрыть',
    options: 'Варианты',
    retry: 'Повторить',
    resetRefused: 'Сброс не выполнен: не удалось сохранить резервную копию текущих данных (возможно, нет места). Ничего не изменено.',
    upgradePendingRefusal: 'Операция не выполнена: сначала должно завершиться обновление хранилища. Ничего не изменено.',
    slice: {
      names: { prefs: 'Настройки', tutor: 'Чат с тьютором', results: 'История попыток' },
      damaged: '{name}: данные не удалось прочитать, они сброшены к значениям по умолчанию. Исходная копия сохранена на этом устройстве.',
      newer: '{name}: данные созданы более новой версией приложения и оставлены без изменений.',
      unsafe: '{name}: не удалось сделать резервную копию, поэтому данные оставлены как есть.',
    },
  },
  ky: {
    titles: {
      repaired: 'Сакталган маалыматтын бир бөлүгү оңдолду',
      recovered: 'Жетишкендик камдык көчүрмөдөн калыбына келтирилди',
      pending: 'Сакталган маалымат бузулган — сиздин чечимиңиз керек',
      unreadable: 'Сакталган жетишкендикти окуу мүмкүн болгон жок',
      future: 'Маалымат колдонмонун жаңыраак версиясында түзүлгөн',
      readonly: 'Жетишкендик азыр сакталбайт',
      'save-failed': 'Жетишкендикти сактоо мүмкүн эмес',
      'history-not-saved': 'Аракеттердин тарыхы азырынча сакталган жок',
      'history-readonly': 'Аракеттердин тарыхы колдонмонун жаңыраак версиясында түзүлгөн',
      replaced: 'Жетишкендик башка терезеде алмаштырылды',
      'upgrade-pending': 'Сактагычты жаңыртуу али аяктаган жок',
    },
    bodies: {
      repaired: 'Бузулган жазууларды оңдодук. Баштапкы маалыматтын көчүрмөсү ушул түзмөктө сакталды — эч нерсе өчүрүлгөн жок.',
      recovered: 'Бузулган маалыматтын көчүрмөсү ушул түзмөктө сакталды.',
      pending: 'Көчүрмө табылды жана көрсөтүлүп жатат, бирок түзмөктө эч нерсе үстүнөн жазылган жок. Эмне кылууну тандаңыз.',
      unreadable:
        'Маалыматыңыз өчүрүлгөн жок: ал түзмөктө сакталган. Жоготпоо үчүн көчүрмөсүн жүктөп алыңыз. Азыр колдонмо нөлдөн башталат.',
      future: 'Аларга зыян келтирбөө үчүн бул версияда өзгөртүүлөр сакталбайт.',
      readonly: 'Маалыматыңызды үстүнөн жазып албоо үчүн бул сеанста өзгөртүүлөр сакталбайт. Маалыматтын көчүрмөсүн жүктөп алыңыз.',
      'save-failed':
        'Браузердин сактагычы жеткиликсиз же толуп калган. Сакталбаган иш өтмөктү жапканда же кайра жүктөгөндө жоголушу мүмкүн. «Кайра аракет кылуу» баскычын басыңыз.',
      'history-not-saved':
        'Сакталбаган тарых жазуулары: {n}. Жетишкендик (XP) сакталды. Сакталбаган тарых өтмөктү жапканда же кайра жүктөгөндө жоголушу мүмкүн. «Кайра аракет кылуу» баскычын басыңыз.',
      'history-readonly':
        'Аракеттердин тарыхы бул версияда зыян келтирбөө үчүн жазылбайт. Жаңы жазуулар эс тутумда гана турат жана өтмөктү жапканда же кайра жүктөгөндө жоголушу мүмкүн.',
      replaced:
        'Башка терезе жетишкендигиңизди алмаштырды. Акыркы аракетиңиз тарыхта сакталды, бирок анын XP учурдагы жетишкендикке кирбейт.',
      'upgrade-pending':
        'Сактагычты жаңыртуу аякталган жок. Маалыматыңыз өзгөргөн жок; тазалоо, жаңыдан баштоо жана калыбына келтирүү азырынча жеткиликсиз. Колдонмо кайра аракет кылат.',
    },
    download: 'Көчүрмөнү жүктөө',
    close: 'Жабуу',
    options: 'Варианттар',
    retry: 'Кайра аракет кылуу',
    resetRefused:
      'Тазалоо аткарылган жок: учурдагы маалыматтын камдык көчүрмөсүн сактоо мүмкүн болгон жок (орун жетишсиз болушу мүмкүн). Эч нерсе өзгөргөн жок.',
    upgradePendingRefusal: 'Аракет аткарылган жок: адегенде сактагычты жаңыртуу аяктоого тийиш. Эч нерсе өзгөргөн жок.',
    slice: {
      names: { prefs: 'Жөндөөлөр', tutor: 'Тьютор менен чат', results: 'Аракеттердин тарыхы' },
      damaged: '{name}: маалыматты окуу мүмкүн болгон жок, ал баштапкы маанилерге кайтарылды. Баштапкы көчүрмө ушул түзмөктө сакталды.',
      newer: '{name}: маалымат колдонмонун жаңыраак версиясында түзүлгөн жана өзгөртүүсүз калтырылды.',
      unsafe: '{name}: камдык көчүрмө жасалган жок, ошондуктан маалымат өзгөртүлгөн жок.',
    },
  },
  de: {
    titles: {
      repaired: 'Ein Teil der gespeicherten Daten wurde repariert',
      recovered: 'Fortschritt aus Sicherung wiederhergestellt',
      pending: 'Gespeicherte Daten beschädigt – deine Entscheidung ist nötig',
      unreadable: 'Gespeicherter Fortschritt nicht lesbar',
      future: 'Daten stammen aus einer neueren App-Version',
      readonly: 'Fortschritt wird derzeit nicht gespeichert',
      'save-failed': 'Fortschritt kann nicht gespeichert werden',
      'history-not-saved': 'Versuchsverlauf noch nicht gespeichert',
      'history-readonly': 'Versuchsverlauf stammt aus einer neueren App-Version',
      replaced: 'Fortschritt wurde in einem anderen Fenster ersetzt',
      'upgrade-pending': 'Die Speicher-Aktualisierung ist noch nicht abgeschlossen',
    },
    bodies: {
      repaired: 'Beschädigte Einträge wurden repariert. Eine Kopie der Originaldaten liegt auf diesem Gerät – nichts wurde gelöscht.',
      recovered: 'Eine Kopie der beschädigten Daten liegt auf diesem Gerät.',
      pending: 'Wir haben eine Kopie gefunden und zeigen sie an, auf dem Gerät wurde aber nichts überschrieben. Wähle, was passieren soll.',
      unreadable:
        'Deine Daten sind nicht gelöscht: Sie liegen auf dem Gerät. Lade eine Kopie herunter, um sie zu sichern. Die App startet jetzt leer.',
      future: 'Um sie nicht zu beschädigen, werden Änderungen in dieser Version nicht gespeichert.',
      readonly: 'Um deine Daten nicht zu überschreiben, werden Änderungen in dieser Sitzung nicht gespeichert. Lade eine Kopie herunter.',
      'save-failed':
        'Der Browser-Speicher ist nicht verfügbar oder voll. Nicht gespeicherte Arbeit kann beim Schließen oder Neuladen des Tabs verloren gehen. Tippe auf „Erneut versuchen“.',
      'history-not-saved':
        'Nicht gespeicherte Verlaufseinträge: {n}. Dein Fortschritt (XP) ist gespeichert. Der nicht gespeicherte Verlauf kann beim Schließen oder Neuladen des Tabs verloren gehen. Tippe auf „Erneut versuchen“.',
      'history-readonly':
        'Der Versuchsverlauf wird in dieser Version nicht geschrieben, um ihn nicht zu beschädigen. Neue Einträge liegen nur im Arbeitsspeicher und können beim Schließen oder Neuladen des Tabs verloren gehen.',
      replaced:
        'Ein anderes Fenster hat deinen Fortschritt ersetzt. Dein letzter Versuch bleibt im Verlauf erhalten, seine XP gehören aber nicht zum aktuellen Fortschritt.',
      'upgrade-pending':
        'Die Speicher-Aktualisierung wurde nicht abgeschlossen. Deine Daten sind unverändert; Zurücksetzen, Neu starten und Wiederherstellen sind vorerst nicht möglich. Die App versucht es erneut.',
    },
    download: 'Kopie herunterladen',
    close: 'Schließen',
    options: 'Optionen',
    retry: 'Erneut versuchen',
    resetRefused:
      'Zurücksetzen nicht durchgeführt: Von den aktuellen Daten konnte keine Sicherung erstellt werden (vielleicht ist der Speicher voll). Nichts wurde geändert.',
    upgradePendingRefusal:
      'Vorgang nicht durchgeführt: Zuerst muss die Speicher-Aktualisierung abgeschlossen werden. Nichts wurde geändert.',
    slice: {
      names: { prefs: 'Einstellungen', tutor: 'Tutor-Chat', results: 'Versuchsverlauf' },
      damaged: '{name}: Daten nicht lesbar, auf Standardwerte zurückgesetzt. Eine Kopie des Originals liegt auf diesem Gerät.',
      newer: '{name}: Daten stammen aus einer neueren App-Version und bleiben unverändert.',
      unsafe: '{name}: Es konnte keine Sicherung erstellt werden, daher blieben die Daten unverändert.',
    },
  },
}
