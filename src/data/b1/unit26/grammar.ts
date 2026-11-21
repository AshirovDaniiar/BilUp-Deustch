import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_26_SOURCE } from './unit'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 26 grammar — the three APPROVED concepts of the unit (docs/b1/B1_ID_CONVENTIONS.md), nothing else:
 *  1. `b1-passiv-praeteritum-modal` (M): PRODUCTIVE Passiv Präsens with a modal verb (muss repariert werden, kann geändert werden) and LIMITED-productive
 *     Passiv Präteritum (wurde / wurden + Partizip II) on a closed list of verbs (veröffentlichen, gründen, bauen, erfinden, eröffnen, absagen). Passiv Perfekt
 *     (`… worden`) stays receptive (Unit 24) and does not appear here.
 *  2. `b1-lassen` (L, limited-productive): lassen + Infinitiv for "have something done" on a closed list of 6 expressions; `sich lassen` (Das lässt sich
 *     erklären) is RECEPTIVE only: glossed in one reading, never in a task or a test (decision D-1 is open).
 *  3. `b1-wiedergeben-indikativ` (M): reporting in the INDICATIVE only — Er sagt, dass …; Sie fragte, ob …; Es heißt, dass …; laut + Dativ — with the shift of
 *     pronouns; no Konjunktiv I (no "er sei"), no tense shift.
 * RECEPTIVE without a concept: Partizip I / II as an adjective (die steigenden Besucherzahlen, die gelöschten Dateien): glossed in one reading only.
 * Not taught here: Konjunktiv I, Genitiv, relative clauses with a preposition (Unit 29), damit (Unit 30), verbs with a prepositional object (Unit 28).
 * All news, places, films and people are fictional. Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted first draft that has not been
 * reviewed by a native speaker. It describes the grammar idea and uses no invented grammatical labels (docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md).
 */
export const UNIT_26_GRAMMAR: GrammarConcept[] = [
  {
    id: 'b1-passiv-praeteritum-modal',
    category: 'passive',
    level: 'B1',
    unit: 26,
    visual: 'verbpos',
    title: l(
      'Passiv с модальным глаголом (muss repariert werden) и Passiv Präteritum (wurde veröffentlicht)',
      'Модаль этиш менен Passiv (muss repariert werden) жана Passiv Präteritum (wurde veröffentlicht)',
    ),
    summary: l(
      'С модальным глаголом Passiv строится так: модальный глагол (müssen, können, sollen, dürfen) на втором месте + Partizip II + werden в самом конце: «Das Handy muss repariert werden», «Die App kann kostenlos geladen werden». Для событий в прошлом (новости, история) используется Passiv Präteritum: wurde / wurden + Partizip II: «Der Bericht wurde gestern veröffentlicht», «Die Zeitung wurde 1990 gegründet». В этом юните Passiv Präteritum — закрытый список глаголов: veröffentlichen, gründen, bauen, erfinden, eröffnen, absagen. Passiv Präsens без модального глагола вы знаете из юнита 24.',
      'Модаль этиш менен Passiv мындайча түзүлөт: модаль этиш (müssen, können, sollen, dürfen) экинчи орунда + Partizip II + эң аягында werden: «Das Handy muss repariert werden», «Die App kann kostenlos geladen werden». Өткөн окуялар (жаңылыктар, тарых) үчүн Passiv Präteritum колдонулат: wurde / wurden + Partizip II: «Der Bericht wurde gestern veröffentlicht», «Die Zeitung wurde 1990 gegründet». Бул бөлүмдө Passiv Präteritum — этиштердин жабык тизмеси: veröffentlichen, gründen, bauen, erfinden, eröffnen, absagen. Модаль этишсиз Passiv Präsens 24-бөлүмдөн белгилүү.',
    ),
    discover: l(
      'Сравните: «Der Bericht wird veröffentlicht» и «Der Bericht wurde veröffentlicht». Чем отличаются глаголы? А теперь: «Der Bericht muss veröffentlicht werden» — где оказался werden?',
      '«Der Bericht wird veröffentlicht» жана «Der Bericht wurde veröffentlicht» сүйлөмдөрүн салыштырыңыз. Этиштер эмнеси менен айырмаланат? Эми: «Der Bericht muss veröffentlicht werden» — werden кайда келип калды?',
    ),
    why: l(
      'В новостях, инструкциях и сообщениях службы поддержки почти всегда важно, ЧТО происходит и ЧТО нужно сделать, а не кто это делает: «Das Passwort muss geändert werden», «Die Brücke wurde gestern eröffnet». Без этих форм сообщение звучит неточно или слишком разговорно.',
      'Жаңылыктарда, нускамаларда жана колдоо кызматынын билдирүүлөрүндө ким кылганы эмес, ЭМНЕ болуп жатканы жана ЭМНЕ кылуу керектиги маанилүү: «Das Passwort muss geändert werden», «Die Brücke wurde gestern eröffnet». Бул формалар болбосо, билдирүү так эмес же өтө оозеки угулат.',
    ),
    when: [
      l(
        'Шаг 1 — Passiv Präsens с модальным глаголом: Modalverb (в нужной форме) + … + Partizip II + werden. «Alle Daten müssen gelöscht werden», «Das Update kann kostenlos installiert werden». Werden — инфинитив, он стоит в самом конце.',
        '1-кадам — модаль этиш менен Passiv Präsens: Modalverb (керектүү формада) + … + Partizip II + werden. «Alle Daten müssen gelöscht werden», «Das Update kann kostenlos installiert werden». werden — инфинитив, ал эң аягында турат.',
      ),
      l(
        'Шаг 2 — Passiv Präteritum (закрытый список): wurde (единственное число), wurden (множественное) + Partizip II в конце. «Die Redaktion wurde 1990 gegründet», «Die Spiele wurden abgesagt».',
        '2-кадам — Passiv Präteritum (жабык тизме): wurde (жекелик сан), wurden (көптүк сан) + аягында Partizip II. «Die Redaktion wurde 1990 gegründet», «Die Spiele wurden abgesagt».',
      ),
      l(
        'Шаг 3 — из Aktiv в Passiv: Akkusativ-дополнение становится подлежащим, исполнитель опускается или получает von + Dativ: «Ein Journalist veröffentlicht den Bericht» → «Der Bericht wird / wurde (von einem Journalisten) veröffentlicht».',
        '3-кадам — Aktivден Passivге: Akkusativ толуктоочу ээ болот, аткаруучу түшүп калат же von + Dativ алат: «Ein Journalist veröffentlicht den Bericht» → «Der Bericht wird / wurde (von einem Journalisten) veröffentlicht».',
      ),
      l(
        'Только для понимания: Passiv Perfekt («ist veröffentlicht worden»), Partizip как прилагательное («die steigenden Preise», «die gelöschten Dateien») и «sich lassen» («Das lässt sich erklären») встречаются в текстах; писать и говорить их пока не нужно.',
        'Түшүнүү үчүн гана: Passiv Perfekt («ist veröffentlicht worden»), сын атооч катары Partizip («die steigenden Preise», «die gelöschten Dateien») жана «sich lassen» («Das lässt sich erklären») тексттерде кездешет; аларды жазуу жана айтуу азырынча керек эмес.',
      ),
    ],
    examples: [
      {
        de: 'Das Handy muss repariert werden.',
        ru: 'Телефон нужно починить.',
        ky: 'Телефонду оңдоо керек.',
        focus: 'muss + Partizip II + werden',
      },
      {
        de: 'Alle Daten müssen gelöscht werden.',
        ru: 'Все данные нужно удалить.',
        ky: 'Бардык маалыматтарды өчүрүү керек.',
        focus: 'müssen (Plural) + gelöscht werden',
      },
      {
        de: 'Die App kann kostenlos geladen werden.',
        ru: 'Приложение можно скачать бесплатно.',
        ky: 'Тиркемени акысыз жүктөп алууга болот.',
        focus: 'kann + geladen werden',
      },
      {
        de: 'Der Bericht wurde gestern veröffentlicht.',
        ru: 'Репортаж был опубликован вчера.',
        ky: 'Репортаж кечээ жарыяланды.',
        focus: 'wurde + veröffentlicht (Präteritum)',
      },
      {
        de: 'Die neue Brücke wurde im Mai eröffnet.',
        ru: 'Новый мост открыли в мае.',
        ky: 'Жаңы көпүрө майда ачылды.',
        focus: 'wurde + eröffnet',
      },
    ],
    mistakes: [
      {
        wrong: 'Das Handy muss werden repariert.',
        right: 'Das Handy muss repariert werden.',
        note: l(
          'Werden — инфинитив, и он стоит в самом конце: …, Partizip II + werden.',
          'werden — инфинитив, ал эң аягында турат: …, Partizip II + werden.',
        ),
      },
      {
        wrong: 'Das Passwort muss geändert wird.',
        right: 'Das Passwort muss geändert werden.',
        note: l(
          'После модального глагола нужен инфинитив werden, а не wird.',
          'Модаль этиштен кийин wird эмес, werden инфинитиви керек.',
        ),
      },
      {
        wrong: 'Der Bericht wird gestern veröffentlicht.',
        right: 'Der Bericht wurde gestern veröffentlicht.',
        note: l(
          'Для события в прошлом (gestern) нужен Präteritum: wurde, а не wird.',
          'Өткөн окуя (gestern) үчүн Präteritum керек: wurde, wird эмес.',
        ),
      },
      {
        wrong: 'Die Zeitungen wurde gegründet.',
        right: 'Die Zeitungen wurden gegründet.',
        note: l(
          'Подлежащее «die Zeitungen» — множественное число, поэтому wurden.',
          'Ээси «die Zeitungen» — көптүк сан, ошондуктан wurden.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Das Konto muss mit einem neuen Passwort geschützt werden.',
        ru: 'Учётную запись нужно защитить новым паролем.',
        ky: 'Эсепти жаңы сыр сөз менен коргоо керек.',
        focus: 'muss … geschützt werden',
      },
      {
        de: 'Die Zeitung wurde vor hundert Jahren gegründet.',
        ru: 'Газета была основана сто лет назад.',
        ky: 'Гезит жүз жыл мурун негизделген.',
        focus: 'wurde … gegründet',
      },
      {
        de: 'Das Fußballspiel wurde abgesagt.',
        ru: 'Футбольный матч отменили.',
        ky: 'Футбол оюну жокко чыгарылды.',
        focus: 'wurde … abgesagt',
      },
    ],
    dialogue: [
      {
        speaker: 'Kundin',
        text: 'Mein Bildschirm ist kaputt. Kann das Handy repariert werden?',
        ru: 'У меня разбит экран. Телефон можно починить?',
        ky: 'Менин экраным сынды. Телефонду оңдоого болобу?',
      },
      {
        speaker: 'Verkäufer',
        text: 'Ja, der Bildschirm kann ausgetauscht werden. Die Reparatur dauert drei Tage.',
        ru: 'Да, экран можно заменить. Ремонт занимает три дня.',
        ky: 'Ооба, экранды алмаштырууга болот. Оңдоо үч күнгө созулат.',
      },
      {
        speaker: 'Kundin',
        text: 'Müssen meine Daten vorher gelöscht werden?',
        ru: 'Мои данные нужно предварительно удалить?',
        ky: 'Менин маалыматтарымды алдын ала өчүрүү керекпи?',
      },
      {
        speaker: 'Verkäufer',
        text: 'Nein, aber sie sollten gespeichert werden. Dann kann alles ganz einfach gemacht werden.',
        ru: 'Нет, но их стоит сохранить. Тогда всё можно сделать совсем просто.',
        ky: 'Жок, бирок аларды сактап коюу керек. Ошондо баарын жөнөкөй эле жасоого болот.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Опишите, что нужно сделать с вашим телефоном или компьютером, и что было сделано недавно. Используйте Passiv с модальным глаголом и wurde: «Der Akku muss … werden», «Die App wurde … ».',
        'Телефонуңуз же компьютериңиз менен эмне кылуу керек экенин жана жакында эмне кылынганын сүрөттөп бериңиз. Модаль этиш менен Passiv жана wurde колдонуңуз: «Der Akku muss … werden», «Die App wurde … ».',
      ),
      sample: 'Das Passwort muss geändert werden. Die App muss aktualisiert werden. Gestern wurde ein Bericht veröffentlicht.',
      keywords: ['muss', 'werden', 'wurde', 'passwort'],
    },
    source: UNIT_26_SOURCE,
  },
  {
    id: 'b1-lassen',
    category: 'verbs',
    level: 'B1',
    unit: 26,
    visual: 'modal',
    title: l(
      'lassen + Infinitiv — сделать что-то не самому (das Handy reparieren lassen)',
      'lassen + Infinitiv — бир нерсени өзү эмес, башка бирөө менен кылдыруу (das Handy reparieren lassen)',
    ),
    summary: l(
      'Когда вы не делаете что-то сами, а поручаете это другому человеку (мастеру, парикмахеру, службе), используется lassen + инфинитив в конце: «Ich lasse mein Handy reparieren», «Sie lässt sich die Haare schneiden». Lassen спрягается как сильный глагол: ich lasse, du lässt, er/sie/es lässt, wir lassen, ihr lasst, sie lassen. Инфинитив — без zu. В этом юните — закрытый список из 6 выражений: etwas reparieren lassen, etwas ändern lassen, etwas prüfen lassen, sich die Haare schneiden lassen, sich etwas schicken lassen, etwas liefern lassen.',
      'Бир нерсени өзүңүз эмес, башка адамга (устага, чач тарагычка, кызматка) тапшырып кылдырганда lassen + аягында инфинитив колдонулат: «Ich lasse mein Handy reparieren», «Sie lässt sich die Haare schneiden». lassen күчтүү этиш сыяктуу өзгөрөт: ich lasse, du lässt, er/sie/es lässt, wir lassen, ihr lasst, sie lassen. Инфинитив — zu жок. Бул бөлүмдө 6 туюндурмадан турган жабык тизме бар: etwas reparieren lassen, etwas ändern lassen, etwas prüfen lassen, sich die Haare schneiden lassen, sich etwas schicken lassen, etwas liefern lassen.',
    ),
    discover: l(
      'Сравните: «Ich repariere mein Handy» и «Ich lasse mein Handy reparieren». Кто чинит телефон в каждом случае? Где стоит инфинитив?',
      '«Ich repariere mein Handy» жана «Ich lasse mein Handy reparieren» сүйлөмдөрүн салыштырыңыз. Ар бир учурда телефонду ким оңдойт? Инфинитив кайда турат?',
    ),
    why: l(
      'В жизни многое делают за нас: ремонт техники, доставка, проверка документов. Фраза с lassen коротко объясняет это: «Ich lasse das Passwort ändern», «Wir lassen das Paket liefern». Это очень частая конструкция и в магазине техники, и в разговоре.',
      'Жашоодо көп нерсени биз үчүн башкалар жасайт: техниканы оңдоо, жеткирүү, документтерди текшерүү. lassen менен сүйлөм муну кыска түшүндүрөт: «Ich lasse das Passwort ändern», «Wir lassen das Paket liefern». Бул техника дүкөнүндө да, сүйлөшүүдө да абдан көп колдонулат.',
    ),
    when: [
      l(
        'Шаг 1 — форма: lassen на втором месте (спрягается), объект, инфинитив в конце. «Ich lasse mein Handy reparieren». «Du lässt dein Passwort prüfen».',
        '1-кадам — формасы: lassen экинчи орунда (жакка жараша өзгөрөт), толуктоочу, аягында инфинитив. «Ich lasse mein Handy reparieren». «Du lässt dein Passwort prüfen».',
      ),
      l(
        'Шаг 2 — с возвратным местоимением в Dativ (юнит 25): «Ich lasse mir die Haare schneiden», «Er lässt sich das Paket schicken».',
        '2-кадам — Dativдеги sich / mir / dir сыяктуу ат атооч менен (25-бөлүм): «Ich lasse mir die Haare schneiden», «Er lässt sich das Paket schicken».',
      ),
      l(
        'Шаг 3 — с модальным глаголом: «Ich muss mein Handy reparieren lassen» — два инфинитива в конце, lassen последним.',
        '3-кадам — модаль этиш менен: «Ich muss mein Handy reparieren lassen» — аягында эки инфинитив, lassen акыркы.',
      ),
      l(
        'Только для понимания: «sich lassen» со значением «можно» — «Das Problem lässt sich lösen» («проблему можно решить»). Это вы встретите в тексте; использовать это в речи пока не нужно.',
        'Түшүнүү үчүн гана: «мүмкүн» маанисиндеги «sich lassen» — «Das Problem lässt sich lösen» («көйгөйдү чечүүгө болот»). Муну текстте көрөсүз; сүйлөөдө азырынча колдонуунун кереги жок.',
      ),
    ],
    examples: [
      {
        de: 'Ich lasse mein Handy reparieren.',
        ru: 'Я отдаю телефон в ремонт.',
        ky: 'Мен телефонумду оңдотуп жатам.',
        focus: 'lasse + reparieren',
      },
      {
        de: 'Du lässt dein Passwort prüfen.',
        ru: 'Ты даёшь проверить свой пароль.',
        ky: 'Сен сыр сөзүңдү текшертип жатасың.',
        focus: 'lässt (du)',
      },
      {
        de: 'Wir lassen das Paket liefern.',
        ru: 'Мы заказываем доставку посылки.',
        ky: 'Биз посылканы алып келтирип жатабыз.',
        focus: 'lassen (wir)',
      },
      {
        de: 'Sie lässt sich die Haare schneiden.',
        ru: 'Она стрижётся (ей стригут волосы).',
        ky: 'Ал чачын кыркытып жатат.',
        focus: 'sich (Dativ) + schneiden lassen',
      },
      {
        de: 'Ich muss die Einstellungen ändern lassen.',
        ru: 'Мне нужно, чтобы изменили настройки.',
        ky: 'Мага жөндөөлөрдү өзгөрттүрүү керек.',
        focus: 'Modalverb + ändern lassen',
      },
    ],
    mistakes: [
      {
        wrong: 'Ich lasse mein Handy zu reparieren.',
        right: 'Ich lasse mein Handy reparieren.',
        note: l(
          'После lassen инфинитив стоит без zu.',
          'lassen этишинен кийин инфинитив zu жок турат.',
        ),
      },
      {
        wrong: 'Er lasst das Konto prüfen.',
        right: 'Er lässt das Konto prüfen.',
        note: l(
          'У er/sie/es и du гласная меняется: er lässt, du lässt (а ihr lasst).',
          'er/sie/es жана du үчүн үндүү өзгөрөт: er lässt, du lässt (ал эми ihr lasst).',
        ),
      },
      {
        wrong: 'Ich reparieren lasse mein Handy.',
        right: 'Ich lasse mein Handy reparieren.',
        note: l(
          'Lassen стоит на втором месте, а инфинитив — в самом конце.',
          'lassen экинчи орунда, ал эми инфинитив — эң аягында турат.',
        ),
      },
      {
        wrong: 'Wir lassen das Paket geliefert.',
        right: 'Wir lassen das Paket liefern.',
        note: l(
          'После lassen нужен инфинитив (liefern), а не Partizip II.',
          'lassen этишинен кийин Partizip II эмес, инфинитив (liefern) керек.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Ich lasse den Akku im Laden prüfen.',
        ru: 'Я проверяю аккумулятор в магазине (его проверяют мне).',
        ky: 'Мен батареяны дүкөндө текшертип жатам.',
        focus: 'prüfen lassen',
      },
      {
        de: 'Er lässt sich das Ladegerät nach Hause schicken.',
        ru: 'Он просит прислать зарядное устройство домой.',
        ky: 'Ал кубаттагычты үйүнө жиберттирип жатат.',
        focus: 'sich schicken lassen',
      },
      {
        de: 'Lass das bitte prüfen.',
        ru: 'Пожалуйста, пусть это проверят.',
        ky: 'Сураныч, муну текшертип кой.',
        focus: 'Imperativ: lass … prüfen',
      },
    ],
    dialogue: [
      {
        speaker: 'Verkäufer',
        text: 'Was kann ich für Sie tun?',
        ru: 'Чем я могу вам помочь?',
        ky: 'Мен сизге эмне кыла алам?',
      },
      {
        speaker: 'Kundin',
        text: 'Ich möchte mein Handy reparieren lassen. Der Akku hält nicht lange.',
        ru: 'Я хочу отдать телефон в ремонт. Аккумулятор держит недолго.',
        ky: 'Мен телефонумду оңдотким келет. Батарея көпкө чыдабайт.',
      },
      {
        speaker: 'Verkäufer',
        text: 'Wir können den Akku prüfen. Möchten Sie sich das Ergebnis per E-Mail schicken lassen?',
        ru: 'Мы можем проверить аккумулятор. Хотите, чтобы вам прислали результат по электронной почте?',
        ky: 'Биз батареяны текшере алабыз. Жыйынтыкты электрондук почта аркылуу жиберттиргиңиз келеби?',
      },
      {
        speaker: 'Kundin',
        text: 'Ja, gern. Und kann ich das Handy dann am Freitag abholen?',
        ru: 'Да, пожалуйста. А потом можно забрать телефон в пятницу?',
        ky: 'Ооба, сураныч. Анан телефонду жумада алып кете аламбы?',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите, что вы не делаете сами, а поручаете другим. Используйте lassen: «Ich lasse mein … reparieren», «Ich lasse mir die Haare schneiden».',
        'Өзүңүз эмес, башкаларга тапшырып кылдырган нерселериңиз жөнүндө айтып бериңиз. lassen колдонуңуз: «Ich lasse mein … reparieren», «Ich lasse mir die Haare schneiden».',
      ),
      sample: 'Ich lasse mein Handy reparieren. Ich lasse mir die Haare schneiden. Ich lasse das Passwort prüfen.',
      keywords: ['lasse', 'reparieren', 'prüfen'],
    },
    source: UNIT_26_SOURCE,
  },
  {
    id: 'b1-wiedergeben-indikativ',
    category: 'wordorder',
    level: 'B1',
    unit: 26,
    visual: 'verbpos',
    title: l(
      'Пересказ: Er sagt, dass … / Sie fragte, ob … / Es heißt, dass … / laut …',
      'Башкалардын сөзүн айтып берүү: Er sagt, dass … / Sie fragte, ob … / Es heißt, dass … / laut …',
    ),
    summary: l(
      'Чтобы передать чужие слова или сообщение из новостей, используйте: «Er sagt, dass …», «Sie schreibt, dass …», «Sie fragte, ob …», «Es heißt, dass …» и «laut + Dativ» («Laut dem Bericht …»). После dass и ob глагол стоит в конце. Прямая речь «Anna sagt: „Ich habe keine Zeit“» превращается в «Anna sagt, dass sie keine Zeit hat»: местоимения меняются по смыслу (ich → sie), время остаётся тем же. Здесь вы пользуетесь только обычным Indikativ — без особой формы «er sei». Различайте Tatsache (проверяемый факт), Meinung (мнение) и то, что «es heißt» (слух).',
      'Башкалардын сөзүн же жаңылыктардагы билдирүүнү айтып берүү үчүн колдонулат: «Er sagt, dass …», «Sie schreibt, dass …», «Sie fragte, ob …», «Es heißt, dass …» жана «laut + Dativ» («Laut dem Bericht …»). dass жана ob сөздөрүнөн кийин этиш аягында турат. Түз сөз «Anna sagt: „Ich habe keine Zeit“» «Anna sagt, dass sie keine Zeit hat» болуп өзгөрөт: ат атоочтор маанисине жараша алмашат (ich → sie), чак ошол бойдон калат. Бул жерде жөнөкөй Indikativди гана колдоносуз — «er sei» сыяктуу өзгөчө форма жок. Tatsache (текшерүүгө боло турган факт), Meinung (пикир) жана «es heißt» (имиш-аякта сөз) ортосундагы айырманы билиңиз.',
    ),
    discover: l(
      'Сравните: «Tom sagt: „Ich lese die Zeitung“» и «Tom sagt, dass er die Zeitung liest». Что изменилось в местоимении и где стоит глагол liest? Что осталось прежним?',
      '«Tom sagt: „Ich lese die Zeitung“» жана «Tom sagt, dass er die Zeitung liest» сүйлөмдөрүн салыштырыңыз. Ат атоочто эмне өзгөрдү жана liest этиши кайда турат? Эмне мурдагысындай калды?',
    ),
    why: l(
      'Рассказывая о новостях, сообщениях и разговорах, вы всё время передаёте чужие слова: «Der Kundendienst schreibt, dass das Update kostenlos ist». Так вы можете проверить источник и не выдать слух за факт: «Es heißt, dass …» — это ещё не доказанная информация.',
      'Жаңылыктар, билдирүүлөр жана сүйлөшүүлөр жөнүндө айтканда сиз дайыма башкалардын сөзүн айтып бересиз: «Der Kundendienst schreibt, dass das Update kostenlos ist». Ошентип булакты текшерип, имиш-аякта сөздү факт катары бербей аласыз: «Es heißt, dass …» — бул дагы далилденбеген маалымат.',
    ),
    when: [
      l(
        'Шаг 1 — утверждение: «Sie sagt, dass sie müde ist». Глагол в придаточной части — в конце. Можно также без dass, с обычным порядком слов: «Sie sagt, sie ist müde».',
        '1-кадам — ырастоо: «Sie sagt, dass sie müde ist». Кошумча бөлүктө этиш — аягында. dass жок да болот, сөздөрдүн ирети адаттагыдай: «Sie sagt, sie ist müde».',
      ),
      l(
        'Шаг 2 — вопрос: вопрос без вопросительного слова → ob: «Sie fragte: „Hast du Zeit?“» → «Sie fragte, ob ich Zeit habe». Вопрос с вопросительным словом сохраняет его: «Er fragte, wann das Update kommt».',
        '2-кадам — суроо: суроо сөзү жок суроо → ob: «Sie fragte: „Hast du Zeit?“» → «Sie fragte, ob ich Zeit habe». Суроо сөзү бар суроо аны сактайт: «Er fragte, wann das Update kommt».',
      ),
      l(
        'Шаг 3 — источники: «Es heißt, dass …» (так говорят), «Laut dem Bericht …» (laut + Dativ), «In der Zeitung steht, dass …». Назовите источник, если можете.',
        '3-кадам — булактар: «Es heißt, dass …» (айтышат), «Laut dem Bericht …» (laut + Dativ), «In der Zeitung steht, dass …». Мүмкүн болсо, булакты атаңыз.',
      ),
      l(
        'Шаг 4 — местоимения: ich → er/sie, du → ich (если вы передаёте слова собеседника), mein → sein/ihr. Время не меняется: Präsens остаётся Präsens, Perfekt остаётся Perfekt.',
        '4-кадам — ат атоочтор: ich → er/sie, du → ich (сүйлөшүүчүнүн сөзүн айтып жатсаңыз), mein → sein/ihr. Чак өзгөрбөйт: Präsens Präsens бойдон, Perfekt Perfekt бойдон калат.',
      ),
    ],
    examples: [
      {
        de: 'Tom sagt, dass er die Zeitung liest.',
        ru: 'Том говорит, что он читает газету.',
        ky: 'Том гезитти окуп жатканын айтат.',
        focus: 'sagt, dass + Verb am Ende; ich → er',
      },
      {
        de: 'Der Kundendienst schreibt, dass das Update kostenlos ist.',
        ru: 'Служба поддержки пишет, что обновление бесплатное.',
        ky: 'Тейлөө кызматы жаңыртуунун акысыз экенин жазат.',
        focus: 'schreibt, dass',
      },
      {
        de: 'Sie fragte, ob ich die Meldung gelesen habe.',
        ru: 'Она спросила, прочитал ли я сообщение.',
        ky: 'Ал мен кабарды окудумбу деп сурады.',
        focus: 'fragte, ob (Ja/Nein-Frage)',
      },
      {
        de: 'Es heißt, dass die Bibliothek länger geöffnet ist.',
        ru: 'Говорят, что библиотека теперь открыта дольше.',
        ky: 'Китепкана азыр узагыраак ачык деп айтышат.',
        focus: 'Es heißt, dass',
      },
      {
        de: 'Laut dem Bericht kommen mehr Besucher.',
        ru: 'Согласно репортажу, приходит больше посетителей.',
        ky: 'Репортаждын айтуусунча, келүүчүлөр көбөйүүдө.',
        focus: 'laut + Dativ',
      },
    ],
    mistakes: [
      {
        wrong: 'Tom sagt, dass er liest die Zeitung.',
        right: 'Tom sagt, dass er die Zeitung liest.',
        note: l(
          'После dass глагол уходит в самый конец придаточной части.',
          'dass сөзүнөн кийин этиш кошумча бөлүктүн эң аягына өтөт.',
        ),
      },
      {
        wrong: 'Anna sagt, dass ich keine Zeit habe.',
        right: 'Anna sagt, dass sie keine Zeit hat.',
        note: l(
          'Если Анна говорит о себе, то в пересказе ich становится sie, а глагол — hat.',
          'Анна өзү жөнүндө айтса, айтып бергенде ich sie болот, ал эми этиш — hat.',
        ),
      },
      {
        wrong: 'Sie fragte, dass ich Zeit habe.',
        right: 'Sie fragte, ob ich Zeit habe.',
        note: l(
          'Вопрос, на который отвечают «да» или «нет», передаётся с ob, а не с dass.',
          '«Ооба» же «жок» деп жооп берилген суроо ob менен айтылат, dass менен эмес.',
        ),
      },
      {
        wrong: 'Laut der Bericht ist der Film gut.',
        right: 'Laut dem Bericht ist der Film gut.',
        note: l(
          'После laut стоит Dativ: der Bericht → dem Bericht.',
          'laut сөзүнөн кийин Dativ турат: der Bericht → dem Bericht.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Mein Freund sagt, dass der Film spannend ist.',
        ru: 'Мой друг говорит, что фильм увлекательный.',
        ky: 'Менин досум тасма кызыктуу деп айтат.',
        focus: 'sagt, dass',
      },
      {
        de: 'In der Zeitung steht, dass die Brücke eröffnet wird.',
        ru: 'В газете написано, что мост откроют.',
        ky: 'Гезитте көпүрө ачылат деп жазылган.',
        focus: 'steht, dass',
      },
      {
        de: 'Er fragte, wann das Update kommt.',
        ru: 'Он спросил, когда выйдет обновление.',
        ky: 'Ал жаңыртуу качан чыгарын сурады.',
        focus: 'fragte, wann',
      },
    ],
    dialogue: [
      {
        speaker: 'Lena',
        text: 'Hast du die Nachricht von Jan gelesen?',
        ru: 'Ты прочитал сообщение от Яна?',
        ky: 'Сен Яндын билдирүүсүн окудуңбу?',
      },
      {
        speaker: 'Max',
        text: 'Ja. Er schreibt, dass er morgen nicht kommen kann.',
        ru: 'Да. Он пишет, что завтра не сможет прийти.',
        ky: 'Ооба. Ал эртең келе албай турганын жазат.',
      },
      {
        speaker: 'Lena',
        text: 'Und was fragt er?',
        ru: 'А что он спрашивает?',
        ky: 'Ал эмне деп сурап жатат?',
      },
      {
        speaker: 'Max',
        text: 'Er fragt, ob wir das Treffen verschieben können. Es heißt, dass es morgen schneit.',
        ru: 'Он спрашивает, можем ли мы перенести встречу. Говорят, что завтра будет снег.',
        ky: 'Ал жолугушууну жылдыра алабызбы деп сурайт. Эртең кар жаайт деп айтышат.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Передайте чужое сообщение: «Mein Freund schreibt, dass …», «Er fragt, ob …», «Laut dem Wetterbericht …». Скажите также, это факт или только слух.',
        'Башка бирөөнүн билдирүүсүн айтып бериңиз: «Mein Freund schreibt, dass …», «Er fragt, ob …», «Laut dem Wetterbericht …». Бул факт же имиш-аякта сөз экенин да айтыңыз.',
      ),
      sample: 'Mein Freund schreibt, dass er krank ist. Er fragt, ob ich ihm helfen kann. Laut dem Wetterbericht regnet es morgen.',
      keywords: ['schreibt', 'dass', 'fragt', 'laut'],
    },
    source: UNIT_26_SOURCE,
  },
]

/** "Why?" notes: one word explained in one sentence. */
export const UNIT_26_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Das Handy muss repariert werden.',
    ru: 'Телефон нужно починить.',
    ky: 'Телефонду оңдоо керек.',
    word: 'werden',
    conceptId: 'b1-passiv-praeteritum-modal',
    reason: l(
      'Passiv с модальным глаголом: muss на втором месте, Partizip II (repariert) и инфинитив werden — в самом конце. Без werden предложение не было бы Passiv.',
      'Модаль этиш менен Passiv: muss экинчи орунда, Partizip II (repariert) жана инфинитив werden — эң аягында. werden болбосо, сүйлөм passiv болбойт эле.',
    ),
    more: [
      {
        de: 'Alle Daten müssen gelöscht werden.',
        ru: 'Все данные нужно удалить.',
        ky: 'Бардык маалыматтарды өчүрүү керек.',
      },
      {
        de: 'Die App kann kostenlos geladen werden.',
        ru: 'Приложение можно скачать бесплатно.',
        ky: 'Тиркемени акысыз жүктөп алууга болот.',
      },
    ],
  },
  {
    sentence: 'Der Bericht wurde gestern veröffentlicht.',
    ru: 'Репортаж был опубликован вчера.',
    ky: 'Репортаж кечээ жарыяланды.',
    word: 'wurde',
    conceptId: 'b1-passiv-praeteritum-modal',
    reason: l(
      'Событие в прошлом (gestern): Passiv Präteritum = wurde + Partizip II. «Der Bericht» — единственное число, поэтому wurde (а не wurden).',
      'Өткөн окуя (gestern): Passiv Präteritum = wurde + Partizip II. «Der Bericht» — жекелик сан, ошондуктан wurde (wurden эмес).',
    ),
    more: [
      {
        de: 'Die neue Brücke wurde im Mai eröffnet.',
        ru: 'Новый мост открыли в мае.',
        ky: 'Жаңы көпүрө майда ачылды.',
      },
      {
        de: 'Die Spiele wurden abgesagt.',
        ru: 'Матчи отменили.',
        ky: 'Оюндар жокко чыгарылды.',
      },
    ],
  },
  {
    sentence: 'Ich lasse mein Handy reparieren.',
    ru: 'Я отдаю телефон в ремонт.',
    ky: 'Мен телефонумду оңдотуп жатам.',
    word: 'lasse',
    conceptId: 'b1-lassen',
    reason: l(
      'Lassen + инфинитив: ремонт делает кто-то другой. Lasse стоит на втором месте, инфинитив reparieren — в конце, без zu.',
      'lassen + инфинитив: оңдоону башка бирөө жасайт. lasse экинчи орунда, инфинитив reparieren — аягында, zu жок.',
    ),
    more: [
      {
        de: 'Wir lassen das Paket liefern.',
        ru: 'Мы заказываем доставку посылки.',
        ky: 'Биз посылканы алып келтирип жатабыз.',
      },
      {
        de: 'Du lässt dein Passwort prüfen.',
        ru: 'Ты даёшь проверить свой пароль.',
        ky: 'Сен сыр сөзүңдү текшертип жатасың.',
      },
    ],
  },
  {
    sentence: 'Tom sagt, dass er die Zeitung liest.',
    ru: 'Том говорит, что он читает газету.',
    ky: 'Том гезитти окуп жатканын айтат.',
    word: 'er',
    conceptId: 'b1-wiedergeben-indikativ',
    reason: l(
      'Том сказал «ich lese». В пересказе ich становится er (говорящий — Том, о котором мы рассказываем), глагол остаётся в Präsens и стоит в конце после dass.',
      'Том «ich lese» деп айтты. Айтып бергенде ich er болот (сүйлөгөн — биз жөнүндө айтып жаткан Том), этиш Präsensте калат жана dass сөзүнөн кийин аягында турат.',
    ),
    more: [
      {
        de: 'Sie fragte, ob ich die Meldung gelesen habe.',
        ru: 'Она спросила, прочитал ли я сообщение.',
        ky: 'Ал мен кабарды окудумбу деп сурады.',
      },
      {
        de: 'Laut dem Bericht kommen mehr Besucher.',
        ru: 'Согласно репортажу, приходит больше посетителей.',
        ky: 'Репортаждын айтуусунча, келүүчүлөр көбөйүүдө.',
      },
    ],
  },
]
