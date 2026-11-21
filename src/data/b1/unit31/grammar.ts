import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_31_SOURCE } from './unit'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 31 grammar — the two APPROVED concepts of the unit (docs/b1/B1_ID_CONVENTIONS.md), nothing else:
 *  1. `b1-formelle-sprache` (L, productive): the formal register of letters, e-mails and phone calls to offices and providers — Anrede and Gruß (Sehr geehrte Frau …, Mit
 *     freundlichen Grüßen), polite requests (Ich bitte um …, Ich möchte Sie bitten, … zu …, Könnten Sie mir bitte mitteilen, …; Konjunktiv-II politeness revised from Units 25 / 27),
 *     formal verbs (mitteilen, beantragen, bestätigen, vorlegen), and the choice between the formal and the informal register.
 *  2. `b1-aktiv-passiv-zustandspassiv` (M, productive; decision D-8 for the Zustandspassiv, fallback receptive only): rewriting Aktiv ↔ Passiv (Präsens and Passiv with a modal verb,
 *     revised from Units 24 / 26), the Vorgangspassiv (werden + Partizip II) versus the Zustandspassiv (sein + Partizip II) — the Zustandspassiv is LIMITED to a closed list of
 *     ten participles: ausgefüllt, unterschrieben, geschlossen, geöffnet, bearbeitet, erledigt, genehmigt, abgelehnt, geprüft, eingereicht.
 *  RECEPTIVE (no concept): the Konjunktiv II der Vergangenheit (Ich hätte die Frist beachten sollen) is only understood in ONE glossed reading, never required in a gap, a word order, a
 *     writing checklist or a speaking hint; the Passiv Perfekt (… worden) stays receptive too. NOT taught: Konjunktiv I, Futur II, further Nomen-Verb-Verbindungen beyond Unit 30,
 *     the Mittelfeld rules of Unit 32.
 * ALL offices, providers, documents, file numbers, deadlines and contract terms are fictional and are attributed to the fictional document or scenario ("laut diesem Schreiben");
 * nothing is German law and nothing is legal advice. Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native
 * speaker. It describes the grammar idea and uses no invented grammatical labels (docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md).
 */
export const UNIT_31_GRAMMAR: GrammarConcept[] = [
  {
    id: 'b1-formelle-sprache',
    category: 'konjunktiv',
    level: 'B1',
    unit: 31,
    visual: 'none',
    title: l(
      'Formelle Sprache (Sehr geehrte …, Ich bitte um …, Könnten Sie mir bitte mitteilen …) — вежливо и официально',
      'Formelle Sprache (Sehr geehrte …, Ich bitte um …, Könnten Sie mir bitte mitteilen …) — сылык жана расмий',
    ),
    summary: l(
      'В письмах и звонках в учреждения и компании нужен официальный регистр: обращение «Sehr geehrte Frau Berger,» (или «Sehr geehrte Damen und Herren,»), прощание «Mit freundlichen Grüßen», форма Sie и вежливые просьбы. Три основных шаблона: «Ich bitte um + Akkusativ» (Ich bitte um eine Bestätigung), «Ich möchte Sie bitten, … zu + Infinitiv» (Ich möchte Sie bitten, den Antrag zu prüfen) и «Könnten Sie mir bitte mitteilen, …?» (Konjunktiv II для вежливости, как в юнитах 25 и 27). В разговоре с друзьями вы скажете проще: «Kannst du mir sagen, …?»',
      'Мекемелерге жана компанияларга каттарда жана чалууларда расмий регистр керек: «Sehr geehrte Frau Berger,» (же «Sehr geehrte Damen und Herren,») деп кайрылуу, «Mit freundlichen Grüßen» деп коштошуу, Sie формасы жана сылык өтүнүчтөр. Үч негизги калып: «Ich bitte um + Akkusativ» (Ich bitte um eine Bestätigung), «Ich möchte Sie bitten, … zu + Infinitiv» (Ich möchte Sie bitten, den Antrag zu prüfen) жана «Könnten Sie mir bitte mitteilen, …?» (сылыктык үчүн Konjunktiv II, 25 жана 27-бөлүмдөрдөгүдөй). Достор менен жөнөкөйүрөөк айтасыз: «Kannst du mir sagen, …?»',
    ),
    discover: l(
      'Сравните два сообщения: «Hallo, sag mir mal, wann das Amt offen ist» и «Sehr geehrte Damen und Herren, könnten Sie mir bitte mitteilen, wann das Amt geöffnet ist?» Что изменилось в обращении, в глаголе и в слове для «сказать»? Какое сообщение вы отправите в учреждение?',
      'Эки билдирүүнү салыштырыңыз: «Hallo, sag mir mal, wann das Amt offen ist» жана «Sehr geehrte Damen und Herren, könnten Sie mir bitte mitteilen, wann das Amt geöffnet ist?» Кайрылууда, этиште жана «айтуу» деген сөздө эмне өзгөрдү? Мекемеге кайсы билдирүүнү жөнөтөсүз?',
    ),
    why: l(
      'Учреждения и компании отвечают быстрее и точнее, когда письмо ясное и вежливое: понятно, кто пишет, чего он хочет и до какого срока. Формальный регистр — не «красивые слова», а признак уважения и структуры: обращение, повод, просьба, благодарность, прощание. В этом юните все учреждения и сроки вымышленные; вы учитесь языку, а не правовым правилам.',
      'Мекемелер жана компаниялар кат так жана сылык болгондо тезирээк жана тагыраак жооп беришет: ким жазып жатканы, эмнени каалаганы жана кайсы мөөнөткө чейин экени түшүнүктүү болот. Расмий регистр — «кооз сөздөр» эмес, сый менен түзүлүштүн белгиси: кайрылуу, себеп, өтүнүч, ыраазычылык, коштошуу. Бул бөлүмдө бардык мекемелер жана мөөнөттөр ойдон чыгарылган; сиз тилди үйрөнөсүз, укуктук эрежелерди эмес.',
    ),
    when: [
      l(
        'Шаг 1 — рамка письма: обращение («Sehr geehrte Frau Berger,» — женщине; «Sehr geehrter Herr Kaya,» — мужчине; «Sehr geehrte Damen und Herren,» — если адресат неизвестен), короткий повод («ich schreibe Ihnen wegen des Termins am Montag»), просьба, благодарность («Vielen Dank im Voraus») и прощание «Mit freundlichen Grüßen».',
        '1-кадам — каттын рамкасы: кайрылуу («Sehr geehrte Frau Berger,» — аял адамга; «Sehr geehrter Herr Kaya,» — эркек адамга; «Sehr geehrte Damen und Herren,» — адресат белгисиз болсо), кыска себеп («ich schreibe Ihnen wegen des Termins am Montag»), өтүнүч, ыраазычылык («Vielen Dank im Voraus») жана «Mit freundlichen Grüßen» деп коштошуу.',
      ),
      l(
        'Шаг 2 — три шаблона просьбы: «Ich bitte um eine schriftliche Bestätigung» (um + Akkusativ); «Ich möchte Sie bitten, den Antrag bis Freitag zu bearbeiten» (Sie bitten + инфинитив с zu в конце, как в юните 23); «Könnten Sie mir bitte mitteilen, ob der Antrag geprüft ist?» (Konjunktiv II + bitte).',
        '2-кадам — өтүнүчтүн үч калыбы: «Ich bitte um eine schriftliche Bestätigung» (um + Akkusativ); «Ich möchte Sie bitten, den Antrag bis Freitag zu bearbeiten» (Sie bitten + аягында zu менен инфинитив, 23-бөлүмдөгүдөй); «Könnten Sie mir bitte mitteilen, ob der Antrag geprüft ist?» (Konjunktiv II + bitte).',
      ),
      l(
        'Шаг 3 — формальные глаголы вместо разговорных: mitteilen (вместо sagen), erhalten или bekommen, beantragen, bestätigen, vorlegen, nachreichen. Все предложения — в форме Sie: «Könnten Sie mir …», «Haben Sie …», «Vielen Dank für Ihre Antwort».',
        '3-кадам — оозеки этиштердин ордуна расмийлери: mitteilen (sagen ордуна), erhalten же bekommen, beantragen, bestätigen, vorlegen, nachreichen. Бардык сүйлөмдөр Sie формасында: «Könnten Sie mir …», «Haben Sie …», «Vielen Dank für Ihre Antwort».',
      ),
      l(
        'Шаг 4 — выбор регистра: официальное письмо в учреждение — Sie, «Sehr geehrte …», «Mit freundlichen Grüßen». Сообщение другу или соседу — du, «Hallo …», «Viele Grüße». Не смешивайте: «Sehr geehrte Frau Berger, kannst du mir helfen?» — ошибка регистра. И помните: сроки и условия в примерах принадлежат вымышленному письму, а не закону.',
        '4-кадам — регистрди тандоо: мекемеге расмий кат — Sie, «Sehr geehrte …», «Mit freundlichen Grüßen». Досуңузга же кошунаңызга билдирүү — du, «Hallo …», «Viele Grüße». Аралаштырбаңыз: «Sehr geehrte Frau Berger, kannst du mir helfen?» — регистр катасы. Жана унутпаңыз: мисалдардагы мөөнөттөр менен шарттар ойдон чыгарылган каттыкы, мыйзамдыкы эмес.',
      ),
    ],
    examples: [
      {
        de: 'Sehr geehrte Frau Berger, ich schreibe Ihnen wegen des Termins am Montag.',
        ru: 'Уважаемая госпожа Бергер, я пишу вам по поводу приёма в понедельник.',
        ky: 'Урматтуу Бергер айым, мен сизге дүйшөмбүдөгү кабыл алуунун себеби боюнча жазып жатам.',
        focus: 'Anrede + Anlass (wegen)',
      },
      {
        de: 'Ich bitte um eine schriftliche Bestätigung.',
        ru: 'Прошу письменное подтверждение.',
        ky: 'Жазуу жүзүндөгү ырастоону сурайм.',
        focus: 'Ich bitte um + Akkusativ',
      },
      {
        de: 'Ich möchte Sie bitten, den Antrag bis Freitag zu bearbeiten.',
        ru: 'Я хотел бы попросить вас рассмотреть заявление до пятницы.',
        ky: 'Мен сизден арызды жума күнүнө чейин карап чыгууну өтүнгүм келет.',
        focus: 'Sie bitten, … zu + Infinitiv',
      },
      {
        de: 'Könnten Sie mir bitte mitteilen, welche Unterlagen ich vorlegen muss?',
        ru: 'Не могли бы вы сообщить мне, какие документы я должен предъявить?',
        ky: 'Кайсы документтерди көрсөтүшүм керек экенин мага билдирип бере аласызбы?',
        focus: 'Konjunktiv-II-Höflichkeit',
      },
      {
        de: 'Vielen Dank im Voraus. Mit freundlichen Grüßen',
        ru: 'Заранее благодарю. С уважением.',
        ky: 'Алдын ала ыраазычылык билдиремин. Урмат менен.',
        focus: 'Dank und Gruß',
      },
    ],
    mistakes: [
      {
        wrong: 'Ich bitte für eine schriftliche Bestätigung.',
        right: 'Ich bitte um eine schriftliche Bestätigung.',
        note: l(
          'Просят «чего-то» с предлогом um: «bitten um + Akkusativ».',
          '«Бир нерсени» сурашканда um предлогу колдонулат: «bitten um + Akkusativ».',
        ),
      },
      {
        wrong: 'Mit freundliche Grüße',
        right: 'Mit freundlichen Grüßen',
        note: l(
          'После mit нужен Dativ множественного числа: «freundlichen Grüßen».',
          'mit дан кийин көптүк сандагы Dativ керек: «freundlichen Grüßen».',
        ),
      },
      {
        wrong: 'Sehr geehrte Frau Berger, kannst du mir bitte helfen?',
        right: 'Sehr geehrte Frau Berger, könnten Sie mir bitte helfen?',
        note: l(
          'Нельзя смешивать регистры: в официальном письме везде Sie, а для вежливости — könnten.',
          'Регистрлерди аралаштырууга болбойт: расмий катта бардык жерде Sie, ал эми сылыктык үчүн — könnten.',
        ),
      },
      {
        wrong: 'Sehr geehrter Frau Berger,',
        right: 'Sehr geehrte Frau Berger,',
        note: l(
          'К женщине — «Sehr geehrte», к мужчине — «Sehr geehrter». Форма следует за адресатом.',
          'Аял адамга — «Sehr geehrte», эркек адамга — «Sehr geehrter». Форма адресатка жараша болот.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Sehr geehrte Damen und Herren, ich habe eine Frage zu meinem Vertrag.',
        ru: 'Уважаемые дамы и господа, у меня вопрос по моему договору.',
        ky: 'Урматтуу айымдар жана мырзалар, менин келишимим боюнча суроом бар.',
        focus: 'Anrede an unbekannte Personen',
      },
      {
        de: 'Ich möchte Sie bitten, mir einen neuen Termin zu bestätigen.',
        ru: 'Я хотел бы попросить вас подтвердить мне новый приём.',
        ky: 'Мен сизден мага жаңы кабыл алууну ырастоону өтүнгүм келет.',
        focus: 'Sie bitten, … zu',
      },
      {
        de: 'Für Ihre Antwort bedanke ich mich im Voraus.',
        ru: 'Заранее благодарю вас за ответ.',
        ky: 'Жообуңуз үчүн алдын ала ыраазычылык билдиремин.',
        focus: 'Dank',
      },
    ],
    dialogue: [
      {
        speaker: 'Sachbearbeiterin',
        text: 'Bürgeramt Brunnenau, guten Tag. Wie kann ich Ihnen helfen?',
        ru: 'Бюргерамт Бруннау, добрый день. Чем могу помочь?',
        ky: 'Бруннау бюргерамты, кайырлуу күн. Сизге кандай жардам бере алам?',
      },
      {
        speaker: 'Anrufer',
        text: 'Guten Tag. Könnten Sie mir bitte mitteilen, welche Unterlagen ich mitbringen muss?',
        ru: 'Добрый день. Не могли бы вы сообщить мне, какие документы я должен принести?',
        ky: 'Кайырлуу күн. Кайсы документтерди алып келишим керек экенин мага билдире аласызбы?',
      },
      {
        speaker: 'Sachbearbeiterin',
        text: 'Gern. Bitte bringen Sie Ihren Ausweis mit. Außerdem brauchen wir einen Nachweis.',
        ru: 'С удовольствием. Пожалуйста, принесите удостоверение. Кроме того, нам нужно подтверждающее.',
        ky: 'Кубанычка. Сураныч, күбөлүгүңүздү алып келиңиз. Мындан тышкары бизге тастыктоочу документ керек.',
      },
      {
        speaker: 'Anrufer',
        text: 'Vielen Dank. Ich möchte Sie noch bitten, mir das schriftlich zu bestätigen.',
        ru: 'Большое спасибо. Я хотел бы ещё попросить вас подтвердить мне это письменно.',
        ky: 'Чоң рахмат. Мен сизден муну мага жазуу жүзүндө ырастап берүүнү дагы өтүнгүм келет.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Представьте, что вы звоните в вымышленное учреждение. Вежливо спросите, какие документы нужны, и попросите письменное подтверждение: «Könnten Sie mir bitte mitteilen, …?», «Ich bitte um …».',
        'Ойдон чыгарылган мекемеге чалып жатканыңызды элестетиңиз. Кайсы документтер керек экенин сылык сураңыз жана жазуу жүзүндөгү ырастоону суранаңыз: «Könnten Sie mir bitte mitteilen, …?», «Ich bitte um …».',
      ),
      sample: 'Guten Tag. Könnten Sie mir bitte mitteilen, welche Unterlagen ich brauche? Ich bitte um eine schriftliche Bestätigung. Vielen Dank im Voraus.',
      keywords: ['könnten sie', 'mitteilen', 'ich bitte um', 'bestätigung'],
    },
    source: UNIT_31_SOURCE,
  },
  {
    id: 'b1-aktiv-passiv-zustandspassiv',
    category: 'passive',
    level: 'B1',
    unit: 31,
    visual: 'none',
    title: l(
      'Aktiv ↔ Passiv и Zustandspassiv (Der Antrag wird bearbeitet — Der Antrag ist genehmigt): процесс и результат',
      'Aktiv ↔ Passiv жана Zustandspassiv (Der Antrag wird bearbeitet — Der Antrag ist genehmigt): процесс жана жыйынтык',
    ),
    summary: l(
      'В официальных текстах чаще важен результат, а не тот, кто действует. Aktiv: «Die Behörde bearbeitet den Antrag». Passiv: «Der Antrag wird (von der Behörde) bearbeitet» — Akkusativ-дополнение становится подлежащим, глагол — werden + Partizip II, действующее лицо (если нужно) — с von. С модальным глаголом: «Der Antrag muss bis Freitag eingereicht werden». Есть и вторая форма: Vorgangspassiv описывает процесс («Das Formular wird gerade ausgefüllt»), Zustandspassiv — результат («Das Formular ist ausgefüllt»). Zustandspassiv вы используете только с десятью причастиями из списка: ausgefüllt, unterschrieben, geschlossen, geöffnet, bearbeitet, erledigt, genehmigt, abgelehnt, geprüft, eingereicht.',
      'Расмий тексттерде көбүнчө аракет кылуучу эмес, жыйынтык маанилүү. Aktiv: «Die Behörde bearbeitet den Antrag». Passiv: «Der Antrag wird (von der Behörde) bearbeitet» — Akkusativдеги толуктоочу ээ болот, этиш — werden + Partizip II, аракет кылуучу (керек болсо) — von менен. Модалдык этиш менен: «Der Antrag muss bis Freitag eingereicht werden». Экинчи форма да бар: Vorgangspassiv процессти сүрөттөйт («Das Formular wird gerade ausgefüllt»), Zustandspassiv — жыйынтыкты («Das Formular ist ausgefüllt»). Zustandspassivди тизмедеги он причастие менен гана колдоносуз: ausgefüllt, unterschrieben, geschlossen, geöffnet, bearbeitet, erledigt, genehmigt, abgelehnt, geprüft, eingereicht.',
    ),
    discover: l(
      'Сравните: «Die Behörde prüft den Antrag», «Der Antrag wird geprüft» и «Der Antrag ist geprüft». Что стало подлежащим во втором предложении? Чем третье отличается от второго — идёт ли проверка ещё или уже закончена?',
      '«Die Behörde prüft den Antrag», «Der Antrag wird geprüft» жана «Der Antrag ist geprüft» сүйлөмдөрүн салыштырыңыз. Экинчи сүйлөмдө эмне ээ болду? Үчүнчүсү экинчисинен эмнеси менен айырмаланат — текшерүү дагы жүрүп жатабы же бүттүбү?',
    ),
    why: l(
      'Письма и уведомления учреждений полны Passiv: «Ihr Antrag wird bearbeitet», «Das Formular muss ausgefüllt werden», «Der Antrag ist genehmigt». Если вы понимаете разницу между процессом и результатом, вы поймёте, нужно ли ещё ждать или всё готово, и сами сможете ясно описать статус: «Der Antrag wird gerade geprüft» — «Der Antrag ist geprüft».',
      'Мекемелердин каттары жана кабарламалары Passivге толгон: «Ihr Antrag wird bearbeitet», «Das Formular muss ausgefüllt werden», «Der Antrag ist genehmigt». Процесс менен жыйынтыктын айырмасын түшүнсөңүз, дагы күтүү керекпи же баары даярбы, билесиз жана статусту өзүңүз да ачык айта аласыз: «Der Antrag wird gerade geprüft» — «Der Antrag ist geprüft».',
    ),
    when: [
      l(
        'Шаг 1 — Aktiv → Passiv: Akkusativ-дополнение идёт на место подлежащего; глагол — werden в нужной форме + Partizip II в конце; бывшее подлежащее — с von и Dativ (или опускается). «Die Behörde bearbeitet den Antrag» → «Der Antrag wird von der Behörde bearbeitet».',
        '1-кадам — Aktiv → Passiv: Akkusativдеги толуктоочу ээнин ордуна өтөт; этиш — werden тиешелүү формада + аягында Partizip II; мурунку ээ — von жана Dativ менен (же түшүп калат). «Die Behörde bearbeitet den Antrag» → «Der Antrag wird von der Behörde bearbeitet».',
      ),
      l(
        'Шаг 2 — Passiv с модальным глаголом: модальный глагол на втором месте, в конце Partizip II + werden: «Der Antrag muss bis Freitag eingereicht werden», «Die Unterlagen können nachgereicht werden». Для множественного числа: «Die Unterlagen werden geprüft».',
        '2-кадам — Модалдык этиш менен Passiv: модалдык этиш экинчи орунда, аягында Partizip II + werden: «Der Antrag muss bis Freitag eingereicht werden», «Die Unterlagen können nachgereicht werden». Көптүк сан үчүн: «Die Unterlagen werden geprüft».',
      ),
      l(
        'Шаг 3 — процесс или результат: werden + Partizip II = процесс («Das Formular wird gerade ausgefüllt», слова gerade, jetzt, noch); sein + Partizip II = результат («Das Formular ist ausgefüllt», «Das Amt ist geschlossen», «Der Antrag ist genehmigt»). Ключевые слова: gerade → werden; schon / jetzt fertig → sein.',
        '3-кадам — процесс же жыйынтык: werden + Partizip II = процесс («Das Formular wird gerade ausgefüllt», gerade, jetzt, noch сөздөрү); sein + Partizip II = жыйынтык («Das Formular ist ausgefüllt», «Das Amt ist geschlossen», «Der Antrag ist genehmigt»). Негизги сөздөр: gerade → werden; schon / азыр даяр → sein.',
      ),
      l(
        'Шаг 4 — границы: Zustandspassiv вы используете только с десятью причастиями из списка (ausgefüllt, unterschrieben, geschlossen, geöffnet, bearbeitet, erledigt, genehmigt, abgelehnt, geprüft, eingereicht). Passiv Perfekt («ist … worden») вы только узнаёте в тексте, сами не пишете. Помните: статус в примерах принадлежит вымышленному письму.',
        '4-кадам — чектер: Zustandspassivди тизмедеги он причастие менен гана колдоносуз (ausgefüllt, unterschrieben, geschlossen, geöffnet, bearbeitet, erledigt, genehmigt, abgelehnt, geprüft, eingereicht). Passiv Perfektти («ist … worden») тексттен таанып гана жүрөсүз, өзүңүз жазбайсыз. Унутпаңыз: мисалдардагы статус ойдон чыгарылган каттыкы.',
      ),
    ],
    examples: [
      {
        de: 'Der Antrag wird von der Behörde bearbeitet.',
        ru: 'Заявление рассматривается ведомством.',
        ky: 'Арыз мекеме тарабынан каралат.',
        focus: 'Aktiv → Passiv, von + Dativ',
      },
      {
        de: 'Das Formular muss bis Freitag eingereicht werden.',
        ru: 'Бланк нужно подать до пятницы.',
        ky: 'Бланкты жума күнүнө чейин тапшыруу керек.',
        focus: 'Passiv mit Modalverb',
      },
      {
        de: 'Das Formular wird gerade ausgefüllt.',
        ru: 'Бланк сейчас заполняется.',
        ky: 'Бланк азыр толтурулуп жатат.',
        focus: 'Vorgangspassiv: gerade',
      },
      {
        de: 'Das Formular ist ausgefüllt und unterschrieben.',
        ru: 'Бланк заполнен и подписан.',
        ky: 'Бланк толтурулган жана кол коюлган.',
        focus: 'Zustandspassiv: Ergebnis',
      },
      {
        de: 'Die Tür ist zu: Das Amt ist heute geschlossen.',
        ru: 'Дверь закрыта: ведомство сегодня закрыто.',
        ky: 'Эшик жабык: мекеме бүгүн жабык.',
        focus: 'Zustandspassiv mit geschlossen',
      },
    ],
    mistakes: [
      {
        wrong: 'Der Antrag wird von die Behörde bearbeitet.',
        right: 'Der Antrag wird von der Behörde bearbeitet.',
        note: l(
          'После von нужен Dativ: «von der Behörde».',
          'von дан кийин Dativ керек: «von der Behörde».',
        ),
      },
      {
        wrong: 'Das Formular wird ausfüllen.',
        right: 'Das Formular wird ausgefüllt.',
        note: l(
          'После werden в Passiv нужен Partizip II (ausgefüllt), а не инфинитив.',
          'Passivде werden этишинен кийин Partizip II (ausgefüllt) керек, инфинитив эмес.',
        ),
      },
      {
        wrong: 'Der Antrag ist gerade bearbeitet.',
        right: 'Der Antrag wird gerade bearbeitet.',
        note: l(
          'Слово gerade означает, что процесс идёт сейчас: нужен werden. «Ist bearbeitet» описывает готовый результат.',
          'gerade сөзү процесс азыр жүрүп жатканын билдирет: werden керек. «Ist bearbeitet» даяр жыйынтыкты сүрөттөйт.',
        ),
      },
      {
        wrong: 'Der Antrag muss unterschrieben sein werden.',
        right: 'Der Antrag muss unterschrieben werden.',
        note: l(
          'Passiv с модальным глаголом: Partizip II + werden в конце, без лишнего sein.',
          'Модалдык этиш менен Passiv: аягында Partizip II + werden, ашыкча sein жок.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Ihr Antrag ist geprüft und wird jetzt weitergeleitet.',
        ru: 'Ваше заявление проверено и теперь передаётся дальше.',
        ky: 'Сиздин арызыңыз текшерилген жана азыр андан ары жөнөтүлүп жатат.',
        focus: 'Zustand + Vorgang',
      },
      {
        de: 'Die Unterlagen müssen vollständig vorgelegt werden.',
        ru: 'Документы нужно представить полностью.',
        ky: 'Документтерди толук көрсөтүү керек.',
        focus: 'Passiv mit Modalverb',
      },
      {
        de: 'Leider ist Ihr Antrag abgelehnt.',
        ru: 'К сожалению, ваше заявление отклонено.',
        ky: 'Тилекке каршы, сиздин арызыңыз четке кагылган.',
        focus: 'Zustandspassiv mit abgelehnt',
      },
    ],
    dialogue: [
      {
        speaker: 'Kundin',
        text: 'Guten Tag. Wird mein Antrag schon bearbeitet?',
        ru: 'Добрый день. Моё заявление уже рассматривается?',
        ky: 'Кайырлуу күн. Менин арызым буга чейин эле каралып жатабы?',
      },
      {
        speaker: 'Sachbearbeiter',
        text: 'Ja, er wird gerade geprüft. Das Formular ist ausgefüllt, aber es fehlt noch eine Unterschrift.',
        ru: 'Да, он сейчас проверяется. Бланк заполнен, но ещё не хватает подписи.',
        ky: 'Ооба, ал азыр текшерилип жатат. Бланк толтурулган, бирок кол тамга дагы жок.',
      },
      {
        speaker: 'Kundin',
        text: 'Kann die Unterschrift nachgereicht werden?',
        ru: 'Можно ли представить подпись позже?',
        ky: 'Кол тамганы кийинчерээк тапшырса болобу?',
      },
      {
        speaker: 'Sachbearbeiter',
        text: 'Ja, sie muss bis Freitag nachgereicht werden. Danach ist der Antrag erledigt.',
        ru: 'Да, её нужно представить до пятницы. После этого заявление будет обработано.',
        ky: 'Ооба, аны жума күнүнө чейин тапшыруу керек. Андан кийин арыз иштелип бүтөт.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Сообщите статус заявления двумя предложениями: одно о процессе (wird gerade …) и одно о результате (ist …). Используйте причастия из списка.',
        'Арыздын статусун эки сүйлөм менен билдириңиз: бири процесс жөнүндө (wird gerade …), бири жыйынтык жөнүндө (ist …). Тизмедеги причастиелерди колдонуңуз.',
      ),
      sample: 'Der Antrag wird gerade geprüft. Das Formular ist ausgefüllt und unterschrieben. Die Unterlagen müssen bis Freitag eingereicht werden.',
      keywords: ['wird gerade', 'ist', 'geprüft', 'eingereicht werden'],
    },
    source: UNIT_31_SOURCE,
  },
]

export const UNIT_31_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Könnten Sie mir bitte mitteilen, welche Unterlagen ich vorlegen muss?',
    ru: 'Не могли бы вы сообщить мне, какие документы я должен предъявить?',
    ky: 'Кайсы документтерди көрсөтүшүм керек экенин мага билдирип бере аласызбы?',
    word: 'Könnten',
    conceptId: 'b1-formelle-sprache',
    reason: l(
      'Könnten + bitte — это Konjunktiv II для вежливости (юниты 25 и 27); mitteilen — формальный глагол вместо sagen. Форма Sie обязательна в письме или звонке в учреждение.',
      'Könnten + bitte — сылыктык үчүн Konjunktiv II (25 жана 27-бөлүмдөр); mitteilen — sagen ордуна колдонулган расмий этиш. Мекемеге кат же чалууда Sie формасы милдеттүү.',
    ),
    more: [
      {
        de: 'Ich bitte um eine schriftliche Bestätigung.',
        ru: 'Прошу письменное подтверждение.',
        ky: 'Жазуу жүзүндөгү ырастоону сурайм.',
      },
      {
        de: 'Ich möchte Sie bitten, den Antrag bis Freitag zu bearbeiten.',
        ru: 'Я хотел бы попросить вас рассмотреть заявление до пятницы.',
        ky: 'Мен сизден арызды жума күнүнө чейин карап чыгууну өтүнгүм келет.',
      },
    ],
  },
  {
    sentence: 'Sehr geehrte Frau Berger, ich schreibe Ihnen wegen des Termins am Montag.',
    ru: 'Уважаемая госпожа Бергер, я пишу вам по поводу приёма в понедельник.',
    ky: 'Урматтуу Бергер айым, мен сизге дүйшөмбүдөгү кабыл алуунун себеби боюнча жазып жатам.',
    word: 'Sehr geehrte',
    conceptId: 'b1-formelle-sprache',
    reason: l(
      '«Sehr geehrte Frau …» — официальное обращение к женщине (к мужчине — «Sehr geehrter Herr …»). После него идёт запятая и предложение со строчной буквы, а в конце — «Mit freundlichen Grüßen».',
      '«Sehr geehrte Frau …» — аял адамга расмий кайрылуу (эркек адамга — «Sehr geehrter Herr …»). Андан кийин үтүр жана кичине тамга менен сүйлөм келет, ал эми аягында — «Mit freundlichen Grüßen».',
    ),
    more: [
      {
        de: 'Sehr geehrte Damen und Herren, ich habe eine Frage zu meinem Vertrag.',
        ru: 'Уважаемые дамы и господа, у меня вопрос по моему договору.',
        ky: 'Урматтуу айымдар жана мырзалар, менин келишимим боюнча суроом бар.',
      },
      {
        de: 'Vielen Dank im Voraus. Mit freundlichen Grüßen',
        ru: 'Заранее благодарю. С уважением.',
        ky: 'Алдын ала ыраазычылык билдиремин. Урмат менен.',
      },
    ],
  },
  {
    sentence: 'Der Antrag wird von der Behörde bearbeitet.',
    ru: 'Заявление рассматривается ведомством.',
    ky: 'Арыз мекеме тарабынан каралат.',
    word: 'wird',
    conceptId: 'b1-aktiv-passiv-zustandspassiv',
    reason: l(
      'Wird + Partizip II (bearbeitet) = Passiv: важно, что происходит с заявлением, а не кто его рассматривает. Тот, кто действует, называется с von + Dativ (von der Behörde) или не называется вовсе. Слово gerade показало бы процесс.',
      'Wird + Partizip II (bearbeitet) = Passiv: арыз менен эмне болору маанилүү, аны ким карап жатканы эмес. Аракет кылуучу von + Dativ менен (von der Behörde) аталат же такыр аталбайт. gerade сөзү процессти көрсөтмөк.',
    ),
    more: [
      {
        de: 'Das Formular muss bis Freitag eingereicht werden.',
        ru: 'Бланк нужно подать до пятницы.',
        ky: 'Бланкты жума күнүнө чейин тапшыруу керек.',
      },
      {
        de: 'Das Formular wird gerade ausgefüllt.',
        ru: 'Бланк сейчас заполняется.',
        ky: 'Бланк азыр толтурулуп жатат.',
      },
    ],
  },
  {
    sentence: 'Das Formular ist ausgefüllt und unterschrieben.',
    ru: 'Бланк заполнен и подписан.',
    ky: 'Бланк толтурулган жана кол коюлган.',
    word: 'ist',
    conceptId: 'b1-aktiv-passiv-zustandspassiv',
    reason: l(
      'Ist + Partizip II (ausgefüllt, unterschrieben) = Zustandspassiv: действие закончено, остался результат. Сравните «wird ausgefüllt» (идёт сейчас). Zustandspassiv вы используете с причастиями из списка.',
      'Ist + Partizip II (ausgefüllt, unterschrieben) = Zustandspassiv: аракет бүттү, жыйынтык калды. «wird ausgefüllt» (азыр жүрүп жатат) менен салыштырыңыз. Zustandspassivди тизмедеги причастиелер менен колдоносуз.',
    ),
    more: [
      {
        de: 'Die Tür ist zu: Das Amt ist heute geschlossen.',
        ru: 'Дверь закрыта: ведомство сегодня закрыто.',
        ky: 'Эшик жабык: мекеме бүгүн жабык.',
      },
      {
        de: 'Ihr Antrag ist geprüft und wird jetzt weitergeleitet.',
        ru: 'Ваше заявление проверено и теперь передаётся дальше.',
        ky: 'Сиздин арызыңыз текшерилген жана азыр андан ары жөнөтүлүп жатат.',
      },
    ],
  },
]
