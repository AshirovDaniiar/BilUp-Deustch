import type { Lang } from '../data/types'

/**
 * Texts of the data-recovery screen (chrome, 02 §3). Russian and German are straightforward; the Kyrgyz lines are an UNREVIEWED best
 * effort (same status as src/i18n/ky.ts) and must pass the Kyrgyz review (Q2/Q16) before the Kyrgyz release gate.
 * Placeholders: {xp} {n} {date} {kb} {reason}
 */
export interface RecoveryMessages {
  title: string
  close: string
  intro: {
    pending: string
    unreadable: string
    repaired: string
    recovered: string
    readonly: string
    future: string
    'save-failed': string
  }
  reasonLabel: string
  preserved: string
  noCopies: string
  kind: { backup: string; quarantine: string; legacy: string }
  verified: string
  damaged: string
  unusable: string
  summary: string
  restore: string
  confirmRestore: string
  confirm: string
  cancel: string
  restoredOk: string
  restoreFailed: string
  candidateTitle: string
  candidateBody: string
  useCandidate: string
  startFresh: string
  startFreshConfirm: string
  retryLoad: string
  retrySave: string
  retryStillBad: string
  retryOk: string
  saveStillFailing: string
  saveOk: string
  download: string
  safe: string
}

export const RECOVERY_MESSAGES: Record<Lang, RecoveryMessages> = {
  ru: {
    title: 'Восстановление данных',
    close: 'Закрыть',
    intro: {
      pending:
        'Сохранённые данные повреждены, и приложение не стало ничего перезаписывать. Мы нашли копию и показываем её, но на устройстве пока ничего не изменено. Решите, что делать.',
      unreadable:
        'Сохранённые данные нельзя прочитать. Они не удалены: их точная копия лежит на устройстве. Приложение ничего не перезапишет, пока вы не решите.',
      repaired: 'Часть записей была повреждена и исправлена. Исходные данные сохранены как копия.',
      recovered: 'Данные восстановлены по вашему решению. Прежняя запись сохранена как копия.',
      readonly: 'Чтобы не перезаписать ваши данные, в этом сеансе изменения не сохраняются.',
      future: 'Данные созданы более новой версией приложения. Эта версия их не изменяет.',
      'save-failed': 'Хранилище браузера недоступно или переполнено, поэтому прогресс сейчас не сохраняется.',
    },
    reasonLabel: 'Причина',
    preserved: 'Сохранённые копии',
    noCopies: 'Копий нет.',
    kind: { backup: 'Резервная копия', quarantine: 'Копия повреждённых данных', legacy: 'Исходная запись старой версии' },
    verified: 'проверена',
    damaged: 'повреждена (не совпадает контрольная сумма)',
    unusable: 'не читается',
    summary: '{date} · {kb} КБ · XP: {xp} · пройдено: {n}',
    restore: 'Восстановить',
    confirmRestore: 'Заменить текущий прогресс этой копией? Текущая запись сначала сохранится как копия.',
    confirm: 'Да, восстановить',
    cancel: 'Отмена',
    restoredOk: 'Готово: прогресс восстановлен.',
    restoreFailed: 'Не удалось восстановить: {reason}. Ничего не изменено.',
    candidateTitle: 'Найдена копия',
    candidateBody: 'XP: {xp}, пройдено: {n}. Нажмите, чтобы сохранить её как текущий прогресс (повреждённая запись останется в копиях).',
    useCandidate: 'Сохранить найденную копию',
    startFresh: 'Начать с нуля',
    startFreshConfirm: 'Начать с чистого листа? Повреждённые данные останутся сохранёнными как копия.',
    retryLoad: 'Повторить попытку',
    retrySave: 'Повторить сохранение',
    retryStillBad: 'Пока не получилось: {reason}. Ничего не изменено.',
    retryOk: 'Готово: данные прочитаны.',
    saveStillFailing: 'Сохранить пока не удаётся. Освободите место в браузере и попробуйте снова.',
    saveOk: 'Готово: прогресс сохранён.',
    download: 'Скачать все сохранённые данные',
    safe: 'Эти действия безопасны: ничто не удаляется.',
  },
  ky: {
    title: 'Маалыматты калыбына келтирүү',
    close: 'Жабуу',
    intro: {
      pending:
        'Сакталган маалымат бузулган, колдонмо эч нерсени үстүнөн жазган жок. Көчүрмө табылды жана көрсөтүлүп жатат, бирок түзмөктө азырынча эч нерсе өзгөргөн жок. Эмне кылууну өзүңүз чечиңиз.',
      unreadable:
        'Сакталган маалыматты окуу мүмкүн эмес. Ал өчүрүлгөн жок: так көчүрмөсү түзмөктө сакталган. Сиз чечмейинче колдонмо эч нерсени үстүнөн жазбайт.',
      repaired: 'Айрым жазуулар бузулган экен жана оңдолду. Баштапкы маалымат көчүрмө катары сакталды.',
      recovered: 'Маалымат сиздин чечимиңиз боюнча калыбына келтирилди. Мурунку жазуу көчүрмө катары сакталды.',
      readonly: 'Маалыматыңызды үстүнөн жазып албоо үчүн бул сеанста өзгөртүүлөр сакталбайт.',
      future: 'Маалымат колдонмонун жаңыраак версиясында түзүлгөн. Бул версия аны өзгөртпөйт.',
      'save-failed': 'Браузердин сактагычы жеткиликсиз же толуп калган, ошондуктан жетишкендик азыр сакталбайт.',
    },
    reasonLabel: 'Себеп',
    preserved: 'Сакталган көчүрмөлөр',
    noCopies: 'Көчүрмө жок.',
    kind: { backup: 'Камдык көчүрмө', quarantine: 'Бузулган маалыматтын көчүрмөсү', legacy: 'Эски версиянын баштапкы жазуусу' },
    verified: 'текшерилди',
    damaged: 'бузулган (текшерүү суммасы дал келбейт)',
    unusable: 'окулбайт',
    summary: '{date} · {kb} КБ · XP: {xp} · өтүлгөн: {n}',
    restore: 'Калыбына келтирүү',
    confirmRestore: 'Азыркы жетишкендикти ушул көчүрмө менен алмаштыруу керекпи? Азыркы жазуу адегенде көчүрмө катары сакталат.',
    confirm: 'Ооба, калыбына келтирүү',
    cancel: 'Жокко чыгаруу',
    restoredOk: 'Даяр: жетишкендик калыбына келтирилди.',
    restoreFailed: 'Калыбына келтирүү мүмкүн болгон жок: {reason}. Эч нерсе өзгөргөн жок.',
    candidateTitle: 'Көчүрмө табылды',
    candidateBody: 'XP: {xp}, өтүлгөн: {n}. Аны азыркы жетишкендик катары сактоо үчүн басыңыз (бузулган жазуу көчүрмөлөрдө калат).',
    useCandidate: 'Табылган көчүрмөнү сактоо',
    startFresh: 'Нөлдөн баштоо',
    startFreshConfirm: 'Таза баракчадан баштоо керекпи? Бузулган маалымат көчүрмө катары сакталып калат.',
    retryLoad: 'Кайра аракет кылуу',
    retrySave: 'Сактоону кайталоо',
    retryStillBad: 'Азырынча болбоду: {reason}. Эч нерсе өзгөргөн жок.',
    retryOk: 'Даяр: маалымат окулду.',
    saveStillFailing: 'Азырынча сактоо мүмкүн эмес. Браузерде орун бошотуп, кайра аракет кылыңыз.',
    saveOk: 'Даяр: жетишкендик сакталды.',
    download: 'Бардык сакталган маалыматты жүктөп алуу',
    safe: 'Бул аракеттер коопсуз: эч нерсе өчүрүлбөйт.',
  },
  de: {
    title: 'Datenwiederherstellung',
    close: 'Schließen',
    intro: {
      pending:
        'Die gespeicherten Daten sind beschädigt; die App hat nichts überschrieben. Wir haben eine Kopie gefunden und zeigen sie an, auf dem Gerät ist aber noch nichts verändert. Entscheide, was passieren soll.',
      unreadable:
        'Die gespeicherten Daten sind nicht lesbar. Sie sind nicht gelöscht: Eine exakte Kopie liegt auf dem Gerät. Die App überschreibt nichts, bevor du entscheidest.',
      repaired: 'Ein Teil der Einträge war beschädigt und wurde repariert. Die Originaldaten sind als Kopie gesichert.',
      recovered: 'Die Daten wurden auf deine Entscheidung hin wiederhergestellt. Der frühere Eintrag ist als Kopie gesichert.',
      readonly: 'Um deine Daten nicht zu überschreiben, werden Änderungen in dieser Sitzung nicht gespeichert.',
      future: 'Die Daten stammen aus einer neueren App-Version. Diese Version ändert sie nicht.',
      'save-failed': 'Der Browser-Speicher ist nicht verfügbar oder voll, deshalb wird dein Fortschritt gerade nicht gespeichert.',
    },
    reasonLabel: 'Grund',
    preserved: 'Gesicherte Kopien',
    noCopies: 'Keine Kopien vorhanden.',
    kind: { backup: 'Sicherung', quarantine: 'Kopie beschädigter Daten', legacy: 'Originaleintrag der alten Version' },
    verified: 'geprüft',
    damaged: 'beschädigt (Prüfsumme stimmt nicht)',
    unusable: 'nicht lesbar',
    summary: '{date} · {kb} KB · XP: {xp} · abgeschlossen: {n}',
    restore: 'Wiederherstellen',
    confirmRestore: 'Den aktuellen Fortschritt durch diese Kopie ersetzen? Der aktuelle Eintrag wird vorher als Kopie gesichert.',
    confirm: 'Ja, wiederherstellen',
    cancel: 'Abbrechen',
    restoredOk: 'Fertig: Fortschritt wiederhergestellt.',
    restoreFailed: 'Wiederherstellung nicht möglich: {reason}. Nichts wurde geändert.',
    candidateTitle: 'Kopie gefunden',
    candidateBody:
      'XP: {xp}, abgeschlossen: {n}. Tippe, um sie als aktuellen Fortschritt zu speichern (der beschädigte Eintrag bleibt als Kopie erhalten).',
    useCandidate: 'Gefundene Kopie speichern',
    startFresh: 'Neu beginnen',
    startFreshConfirm: 'Mit leerem Stand beginnen? Die beschädigten Daten bleiben als Kopie erhalten.',
    retryLoad: 'Erneut versuchen',
    retrySave: 'Speichern erneut versuchen',
    retryStillBad: 'Noch nicht möglich: {reason}. Nichts wurde geändert.',
    retryOk: 'Fertig: Daten gelesen.',
    saveStillFailing: 'Speichern ist noch nicht möglich. Schaffe Platz im Browser und versuche es erneut.',
    saveOk: 'Fertig: Fortschritt gespeichert.',
    download: 'Alle gesicherten Daten herunterladen',
    safe: 'Diese Aktionen sind sicher: Nichts wird gelöscht.',
  },
}
