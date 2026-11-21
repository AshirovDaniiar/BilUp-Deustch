import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_24_SOURCE } from './unit'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 24 grammar — the two APPROVED concepts of the unit (docs/b1/B1_ID_CONVENTIONS.md), nothing else:
 *  1. `b1-passiv-praesens` (H, productive): Vorgangspassiv im Präsens, werden + Partizip II (also separable verbs: abgeholt, angeschlossen), optional `von` + Dativ.
 *     Passiv Perfekt (`ist … worden`) is RECEPTIVE only: it is glossed in one reading and never required in a task, a test, a hint or a checklist item (decision D-5:
 *     a reviewer may promote it to limited-productive). NOT taught: Passiv with a modal verb and Passiv Präteritum (both Unit 26), Zustandspassiv (Unit 31).
 *  2. `b1-adjektive-ohne-artikel` (M, productive): adjective endings without an article in the Nominativ, Akkusativ and Dativ (housing advertisements).
 *     NOT taught: Genitiv endings, Partizip I/II as adjective (Unit 26).
 * Not taught here: Konjunktiv II (Unit 25), relative clauses with a preposition (Unit 29), damit (Unit 30), verbs with a prepositional object (Unit 28).
 * Russian and Kyrgyz are written independently; the Kyrgyz is an AI-assisted first draft that has not been reviewed by a native speaker. It describes the
 * grammar idea and does not use invented grammatical labels (see docs/authoring/A2_KY_TERMINOLOGY_GLOSSARY.md).
 */
export const UNIT_24_GRAMMAR: GrammarConcept[] = [
  {
    id: 'b1-passiv-praesens',
    category: 'passive',
    level: 'B1',
    unit: 24,
    visual: 'verbpos',
    title: l(
      'Passiv Präsens (wird … gemacht) — когда важно действие, а не исполнитель',
      'Passiv Präsens (wird … gemacht) — аракет маанилүү болуп, аткаруучу маанилүү болбогондо',
    ),
    summary: l(
      'В правилах дома и объявлениях важно, ЧТО делается, а не КТО это делает: «Der Müll wird jeden Dienstag abgeholt» — «Мусор вывозят каждый вторник». Это Passiv (Vorgangspassiv). Он строится из формы werden (ich werde, du wirst, er/sie/es wird, wir/sie werden) и Partizip II в самом конце: «Die Wohnung wird renoviert». Подлежащее активного предложения (кто делает) обычно исчезает; если его нужно назвать, ставится von + Dativ: «Die Heizung wird vom Hausmeister kontrolliert». Дополнение в Akkusativ из активного предложения становится подлежащим: «Der Hausmeister repariert den Wasserhahn» → «Der Wasserhahn wird repariert».',
      'Үйдүн эрежелеринде жана жарыяларда ким кылып жатканы эмес, ЭМНЕ кылынып жатканы маанилүү: «Der Müll wird jeden Dienstag abgeholt» — «Таштанды ар шейшембиде алынып кетилет». Бул Passiv (Vorgangspassiv). Ал werden этишинин формасынан (ich werde, du wirst, er/sie/es wird, wir/sie werden) жана эң аягында турган Partizip II формасынан турат: «Die Wohnung wird renoviert». Активдүү сүйлөмдөгү аракетти аткаруучу көбүнчө айтылбайт; аны атоо керек болсо, von + Dativ коюлат: «Die Heizung wird vom Hausmeister kontrolliert». Активдүү сүйлөмдөгү Akkusativ толуктоочу Passiv сүйлөмүндө ээ болот: «Der Hausmeister repariert den Wasserhahn» → «Der Wasserhahn wird repariert».',
    ),
    discover: l(
      'Сравните: «Der Hausmeister repariert den Wasserhahn» и «Der Wasserhahn wird repariert». Кто теперь главный в предложении? Что случилось с «der Hausmeister» и где стоит глагол repariert?',
      '«Der Hausmeister repariert den Wasserhahn» жана «Der Wasserhahn wird repariert» сүйлөмдөрүн салыштырыңыз. Эми сүйлөмдө кимге көңүл бурулат? «der Hausmeister» эмне болду жана repariert этиши кайда турат?',
    ),
    why: l(
      'В A2 вы говорили: «Der Hausmeister repariert …». На B1 нужно понимать и объяснять процессы и правила: что делается с квартирой, как вывозят мусор, как оформляют договор. Passiv встречается в объявлениях, правилах дома, инструкциях и новостях — и в речи, когда исполнитель неважен или неизвестен.',
      'A2 деңгээлинде сиз «Der Hausmeister repariert …» деп айттыңыз. B1 деңгээлинде процесстерди жана эрежелерди түшүнүү жана түшүндүрүү керек: батир менен эмне болуп жатат, таштанды кандай чыгарылат, келишим кандай түзүлөт. Passiv жарыяларда, үйдүн эрежелеринде, нускамаларда жана жаңылыктарда, ошондой эле аткаруучу маанилүү эмес же белгисиз болгон сүйлөшүүдө кездешет.',
    ),
    when: [
      l(
        'Шаг 1 — когда использовать: если важен процесс, правило или результат, а не исполнитель. «Im Haus wird nicht geraucht». «Die Küche wird neu gestrichen». Исполнитель неизвестен, очевиден или неважен.',
        '1-кадам — качан колдонуу: аткаруучу эмес, процесс, эреже же жыйынтык маанилүү болгондо. «Im Haus wird nicht geraucht». «Die Küche wird neu gestrichen». Аткаруучу белгисиз, түшүнүктүү же маанилүү эмес.',
      ),
      l(
        'Шаг 2 — образование: werden в нужной форме + Partizip II в конце. Единственное число: «Die Wohnung wird renoviert». Множественное: «Die Zimmer werden gestrichen». Хорошо запомнить: wird (er, sie, es) и werden (wir, sie).',
        '2-кадам — түзүлүшү: werden этишинин керектүү формасы + эң аягында Partizip II. Жекелик сан: «Die Wohnung wird renoviert». Көптүк сан: «Die Zimmer werden gestrichen». wird (er, sie, es) жана werden (wir, sie) формаларын жакшы эстеп алыңыз.',
      ),
      l(
        'Шаг 3 — из Aktiv в Passiv: Akkusativ-дополнение становится подлежащим (den Wasserhahn → der Wasserhahn), исполнитель исчезает или получает von + Dativ (vom Hausmeister). Смысл не меняется. Partizip II с отделяемой приставкой: abholen → abgeholt, anschließen → angeschlossen.',
        '3-кадам — Aktivден Passivге: Akkusativ толуктоочу ээ болот (den Wasserhahn → der Wasserhahn), аткаруучу түшүп калат же von + Dativ алат (vom Hausmeister). Маани өзгөрбөйт. Приставкасы ажыраган этиштин Partizip II формасы: abholen → abgeholt, anschließen → angeschlossen.',
      ),
      l(
        'Только для понимания: Passiv Perfekt — «Die Heizung ist erneuert worden» («Отопление заменили»). Вы встретите его в текстах, писать его пока не нужно. Passiv с модальными глаголами («muss repariert werden») и в Präteritum («wurde repariert») появятся в юните 26.',
        'Түшүнүү үчүн гана: Passiv Perfekt — «Die Heizung ist erneuert worden» («Жылытуу жаңыланды»). Аны тексттерден көрөсүз, бирок жазуу азырынча керек эмес. Модаль этиштер менен Passiv («muss repariert werden») жана Präteritum («wurde repariert») 26-бөлүмдө келет.',
      ),
    ],
    examples: [
      {
        de: 'Die Wohnung wird im Mai renoviert.',
        ru: 'Квартиру ремонтируют в мае.',
        ky: 'Батир майда оңдолот.',
        focus: 'wird … renoviert (Singular)',
      },
      {
        de: 'Der Müll wird jeden Dienstag abgeholt.',
        ru: 'Мусор вывозят каждый вторник.',
        ky: 'Таштанды ар шейшембиде алынып кетилет.',
        focus: 'abgeholt (abholen: ab-ge-holt)',
      },
      {
        de: 'Die Zimmer werden vor dem Einzug gestrichen.',
        ru: 'Комнаты красят перед заселением.',
        ky: 'Бөлмөлөр көчүп кирерден мурун боёлот.',
        focus: 'werden … gestrichen (Plural)',
      },
      {
        de: 'Die Heizung wird vom Hausmeister kontrolliert.',
        ru: 'Отопление проверяет смотритель дома.',
        ky: 'Жылытууну үйдү кароочу текшерет.',
        focus: 'vom Hausmeister (von + Dativ: der Handelnde)',
      },
      {
        de: 'Die Miete wird am Monatsanfang überwiesen.',
        ru: 'Арендная плата переводится в начале месяца.',
        ky: 'Ижара акысы айдын башында которулат.',
        focus: 'wird … überwiesen',
      },
    ],
    mistakes: [
      {
        wrong: 'Der Wasserhahn wird reparieren.',
        right: 'Der Wasserhahn wird repariert.',
        note: l(
          'После wird нужен Partizip II (repariert), а не инфинитив. Инфинитив с wird — это уже будущее время (Futur).',
          'wird этишинен кийин Partizip II (repariert) керек, инфинитив эмес. wird менен инфинитив келечек чакты билдирет (Futur).',
        ),
      },
      {
        wrong: 'Die Zimmer wird gestrichen.',
        right: 'Die Zimmer werden gestrichen.',
        note: l(
          'Подлежащее «die Zimmer» — множественное число, поэтому werden, а не wird.',
          '«die Zimmer» ээси көптүк санда, ошондуктан wird эмес, werden.',
        ),
      },
      {
        wrong: 'Der Müll wird abgeholt jeden Dienstag.',
        right: 'Der Müll wird jeden Dienstag abgeholt.',
        note: l(
          'Partizip II стоит в самом конце предложения: …, wird … abgeholt.',
          'Partizip II сүйлөмдүн эң аягында турат: …, wird … abgeholt.',
        ),
      },
      {
        wrong: 'Die Heizung wird von der Hausmeister kontrolliert.',
        right: 'Die Heizung wird vom Hausmeister kontrolliert.',
        note: l(
          'После von стоит Dativ, мужской род: von dem = vom Hausmeister.',
          'von сөзүнөн кийин Dativ турат, эркек род: von dem = vom Hausmeister.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Hier wird nicht geraucht.',
        ru: 'Здесь не курят.',
        ky: 'Бул жерде тамеки чегилбейт.',
        focus: 'Regel: Passiv ohne Subjekt',
      },
      {
        de: 'Die Waschmaschine wird heute angeschlossen.',
        ru: 'Стиральную машину подключают сегодня.',
        ky: 'Кир жуугуч машина бүгүн туташтырылат.',
        focus: 'angeschlossen',
      },
      {
        de: 'Die Abrechnung wird per Post geschickt.',
        ru: 'Расчёт присылают по почте.',
        ky: 'Эсеп-кысап почта аркылуу жөнөтүлөт.',
        focus: 'wird … geschickt',
      },
    ],
    dialogue: [
      {
        speaker: 'Frau Demir',
        text: 'Wann wird die Wohnung renoviert?',
        ru: 'Когда будут ремонтировать квартиру?',
        ky: 'Батир качан оңдолот?',
      },
      {
        speaker: 'Herr Lenz',
        text: 'Sie wird im Juni gestrichen, und die Küche wird neu eingebaut.',
        ru: 'Её покрасят в июне, и кухню заново установят.',
        ky: 'Ал июнда боёлот, ашкана жаңыдан орнотулат.',
      },
      {
        speaker: 'Frau Demir',
        text: 'Und der Wasserhahn?',
        ru: 'А кран?',
        ky: 'Ал эми суу краны?',
      },
      {
        speaker: 'Herr Lenz',
        text: 'Er wird noch diese Woche vom Hausmeister repariert.',
        ru: 'Его ещё на этой неделе починит смотритель дома.',
        ky: 'Аны ушул жумада эле үйдү кароочу оңдойт.',
      },
      {
        speaker: 'Frau Demir',
        text: 'Wunderbar. Wird die Heizung auch kontrolliert?',
        ru: 'Замечательно. Отопление тоже проверят?',
        ky: 'Сонун. Жылытуу да текшерилеби?',
      },
      {
        speaker: 'Herr Lenz',
        text: 'Ja, die Heizung wird jeden Herbst kontrolliert.',
        ru: 'Да, отопление проверяют каждую осень.',
        ky: 'Ооба, жылытуу ар күздө текшерилет.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Расскажите, как в вашем доме организованы мусор, уборка и ремонт. Используйте Passiv: «Der Müll wird … abgeholt», «Das Treppenhaus wird … geputzt».',
        'Үйүңүздө таштанды, тазалоо жана ремонт кандай уюштурулганын айтып бериңиз. Passiv колдонуңуз: «Der Müll wird … abgeholt», «Das Treppenhaus wird … geputzt».',
      ),
      sample:
        'In meinem Haus wird der Müll jeden Dienstag abgeholt. Das Treppenhaus wird einmal pro Woche geputzt. Im Sommer werden die Wände gestrichen.',
      keywords: ['wird', 'werden', 'abgeholt', 'müll'],
    },
    source: UNIT_24_SOURCE,
  },
  {
    id: 'b1-adjektive-ohne-artikel',
    category: 'adjectives',
    level: 'B1',
    unit: 24,
    visual: 'articles',
    title: l(
      'Adjektive ohne Artikel — окончания в объявлениях (helle Zimmer, in ruhiger Lage)',
      'Adjektive ohne Artikel — жарыялардагы жалгоолор (helle Zimmer, in ruhiger Lage)',
    ),
    summary: l(
      'Если перед существительным нет артикля, прилагательное само показывает род, число и падеж: оно получает окончание, как у определённого артикля. Nominativ: -er (m), -e (f), -es (n), -e (pl) — «kalter Kaffee», «frische Luft», «kaltes Wasser», «helle Zimmer». Akkusativ отличается только у мужского рода: -en — «frischen Kaffee». Dativ: -em (m, n), -er (f), -en (pl) — «mit großem Balkon», «in ruhiger Lage», «mit neuen Fenstern». Так пишут объявления о квартирах и ищут жильё.',
      'Зат атоочтун алдында артикль жок болсо, сын атооч өзү жынысты, санды жана жалгоону көрсөтөт: ал аныкталган артикль сыяктуу уланды алат. Nominativ: -er (эркек), -e (аял), -es (орто), -e (көптүк) — «kalter Kaffee», «frische Luft», «kaltes Wasser», «helle Zimmer». Akkusativ эркек родто гана айырмаланат: -en — «frischen Kaffee». Dativ: -em (эркек, орто), -er (аял), -en (көптүк) — «mit großem Balkon», «in ruhiger Lage», «mit neuen Fenstern». Батир жөнүндө жарыялар ушинтип жазылат жана турак жай ушинтип издейт.',
    ),
    discover: l(
      'Сравните: «die ruhige Lage» и «ruhige Lage», «der große Balkon» и «mit großem Balkon». Какое слово теперь показывает род и падеж? Что стало с окончанием прилагательного?',
      '«die ruhige Lage» жана «ruhige Lage», «der große Balkon» жана «mit großem Balkon» сөз айкаштарын салыштырыңыз. Эми жынысты жана жалгоону кайсы сөз көрсөтүп турат? Сын атоочтун уланды эмне болду?',
    ),
    why: l(
      'В A2 вы использовали прилагательные после артикля («die neue Küche», «eine helle Wohnung»). Но в объявлениях, в описаниях и после слов вроде viel, wenig и в общих высказываниях артикля нет: «Helle Zimmer, ruhige Lage, neue Küche». Эту форму нужно понимать при чтении и использовать, когда вы описываете жильё.',
      'A2 деңгээлинде сиз сын атоочтарды артикльден кийин колдондуңуз («die neue Küche», «eine helle Wohnung»). Бирок жарыяларда, сүрөттөөлөрдө жана жалпы пикирлерде артикль болбойт: «Helle Zimmer, ruhige Lage, neue Küche». Бул формаларды окууда түшүнүү жана турак жайды сүрөттөгөндө колдонуу керек.',
    ),
    when: [
      l(
        'Шаг 1 — артикля нет, значит окончание «как у артикля»: der → -er, die → -e, das → -es, die (pl) → -e. «Kalter Kaffee», «frische Luft», «kaltes Wasser», «helle Zimmer».',
        '1-кадам — артикль жок, демек уланды «артикль сыяктуу»: der → -er, die → -e, das → -es, die (көптүк) → -e. «Kalter Kaffee», «frische Luft», «kaltes Wasser», «helle Zimmer».',
      ),
      l(
        'Шаг 2 — Akkusativ: меняется только мужской род: -er → -en. «Er trinkt starken Kaffee». У женского, среднего рода и множественного числа форма та же, что в Nominativ: «Wir suchen helle Zimmer».',
        '2-кадам — Akkusativ: эркек родто гана өзгөрөт: -er → -en. «Er trinkt starken Kaffee». Аял, орто родто жана көптүк санда форма Nominativ менен бирдей: «Wir suchen helle Zimmer».',
      ),
      l(
        'Шаг 3 — Dativ: мужской и средний род -em, женский -er, множественное число -en. «mit großem Balkon», «mit warmem Wasser», «in ruhiger Lage», «in alten Häusern». Если перед словом стоит предлог, смотрите на род и падеж, который он требует.',
        '3-кадам — Dativ: эркек жана орто родто -em, аял родто -er, көптүк санда -en. «mit großem Balkon», «mit warmem Wasser», «in ruhiger Lage», «in alten Häusern». Сөздүн алдында предлог болсо, анын талап кылган жалгоосун жана жынысты карап көрүңүз.',
      ),
      l(
        'В этом юните — только Nominativ, Akkusativ и Dativ. Окончания в Genitiv вам пока не нужны. Если артикль есть (der, ein, mein, kein), действуют правила A2: «die neue Küche», «eine helle Wohnung».',
        'Бул бөлүмдө Nominativ, Akkusativ жана Dativ гана бар. Genitiv жалгоолору азырынча керек эмес. Артикль болсо (der, ein, mein, kein), A2 эрежелери иштейт: «die neue Küche», «eine helle Wohnung».',
      ),
    ],
    examples: [
      {
        de: 'Helle Zimmer machen eine Wohnung freundlich.',
        ru: 'Светлые комнаты делают квартиру приятной.',
        ky: 'Жарык бөлмөлөр батирди жагымдуу кылат.',
        focus: 'Helle (Nominativ, Plural: -e)',
      },
      {
        de: 'Aus dem Hahn tropft kaltes Wasser.',
        ru: 'Из крана капает холодная вода.',
        ky: 'Крандан муздак суу тамчылап жатат.',
        focus: 'kaltes (Nominativ, Neutrum: -es)',
      },
      {
        de: 'Wir suchen helle Zimmer in zentraler Lage.',
        ru: 'Мы ищем светлые комнаты в центральном районе.',
        ky: 'Биз борбордо жайгашкан жарык бөлмөлөрдү издеп жатабыз.',
        focus: 'helle (Akkusativ, Plural) · zentraler (Dativ, Femininum: -er)',
      },
      {
        de: 'Er trinkt jeden Morgen starken Kaffee.',
        ru: 'Он каждое утро пьёт крепкий кофе.',
        ky: 'Ал күн сайын эртең менен күчтүү кофе ичет.',
        focus: 'starken (Akkusativ, Maskulinum: -en)',
      },
      {
        de: 'Wir vermieten eine Wohnung mit großem Balkon und neuer Küche.',
        ru: 'Мы сдаём квартиру с большим балконом и новой кухней.',
        ky: 'Биз чоң балкондуу жана жаңы ашканалуу батирди ижарага беребиз.',
        focus: 'großem (Dativ, Maskulinum: -em) · neuer (Dativ, Femininum: -er)',
      },
    ],
    mistakes: [
      {
        wrong: 'Hell Zimmer sind schön.',
        right: 'Helle Zimmer sind schön.',
        note: l(
          'Перед существительным без артикля прилагательное получает окончание: helle Zimmer.',
          'Артикли жок зат атоочтун алдында сын атооч уланды алат: helle Zimmer.',
        ),
      },
      {
        wrong: 'Die Wohnung liegt in ruhige Lage.',
        right: 'Die Wohnung liegt in ruhiger Lage.',
        note: l(
          'После in (где?) стоит Dativ; женский род без артикля — окончание -er: in ruhiger Lage.',
          'in (кайда?) сөзүнөн кийин Dativ турат; артикли жок аял родто уланды -er: in ruhiger Lage.',
        ),
      },
      {
        wrong: 'Wir vermieten die Wohnung mit großen Balkon.',
        right: 'Wir vermieten die Wohnung mit großem Balkon.',
        note: l(
          'После mit стоит Dativ; мужской род без артикля — окончание -em: mit großem Balkon.',
          'mit сөзүнөн кийин Dativ турат; артикли жок эркек родто уланды -em: mit großem Balkon.',
        ),
      },
      {
        wrong: 'Er trinkt kalter Kaffee.',
        right: 'Er trinkt kalten Kaffee.',
        note: l(
          'Kaffee здесь дополнение (Akkusativ), мужской род — окончание -en, а не -er.',
          'Kaffee бул жерде толуктоочу (Akkusativ), эркек род — уланды -en, -er эмес.',
        ),
      },
    ],
    reallife: [
      {
        de: 'Zu vermieten: helle 2-Zimmer-Wohnung, ruhige Lage, mit neuer Küche.',
        ru: 'Сдаётся: светлая двухкомнатная квартира, тихий район, с новой кухней.',
        ky: 'Ижарага берилет: эки бөлмөлүү жарык батир, тынч жер, жаңы ашканалуу.',
        focus: 'helle, ruhige (Nominativ) · neuer (Dativ)',
      },
      {
        de: 'Ich schlafe lieber bei frischer Luft.',
        ru: 'Я предпочитаю спать при свежем воздухе.',
        ky: 'Мен таза абада уктаганды жакшы көрөм.',
        focus: 'frischer (Dativ, Femininum)',
      },
      {
        de: 'In alten Häusern ist es oft hellhörig.',
        ru: 'В старых домах часто плохая звукоизоляция.',
        ky: 'Эски үйлөрдө көбүнчө үн өтүп турат.',
        focus: 'alten (Dativ, Plural: -en)',
      },
    ],
    dialogue: [
      {
        speaker: 'Herr Kurz',
        text: 'Was suchen Sie genau?',
        ru: 'Что именно вы ищете?',
        ky: 'Сиз так эмнени издеп жатасыз?',
      },
      {
        speaker: 'Frau Weber',
        text: 'Ich suche helle Zimmer in ruhiger Lage.',
        ru: 'Я ищу светлые комнаты в тихом районе.',
        ky: 'Мен тынч жердеги жарык бөлмөлөрдү издеп жатам.',
      },
      {
        speaker: 'Herr Kurz',
        text: 'Wir haben eine Wohnung mit großem Balkon und neuer Küche.',
        ru: 'У нас есть квартира с большим балконом и новой кухней.',
        ky: 'Бизде чоң балкондуу жана жаңы ашканалуу батир бар.',
      },
      {
        speaker: 'Frau Weber',
        text: 'Das klingt gut. Wie hoch ist die Miete?',
        ru: 'Звучит хорошо. Какая арендная плата?',
        ky: 'Жакшы угулат. Ижара акысы канча?',
      },
      {
        speaker: 'Herr Kurz',
        text: 'Die Kaltmiete ist günstig, aber mit hohen Heizkosten.',
        ru: 'Аренда без коммунальных платежей недорогая, но расходы на отопление высокие.',
        ky: 'Коммуналдык төлөмсүз ижара акысы арзан, бирок жылытуу чыгымдары жогору.',
      },
    ],
    speakPrompt: {
      prompt: l(
        'Опишите вашу идеальную квартиру или комнату. Используйте прилагательные без артикля: «Ich suche helle Zimmer in ruhiger Lage, mit großem Balkon».',
        'Идеалдуу батириңизди же бөлмөңүздү сүрөттөп бериңиз. Артикльсиз сын атоочтарды колдонуңуз: «Ich suche helle Zimmer in ruhiger Lage, mit großem Balkon».',
      ),
      sample: 'Ich suche helle Zimmer in ruhiger Lage, mit großem Balkon und neuer Küche. Frische Luft ist mir wichtig.',
      keywords: ['helle', 'ruhiger', 'großem', 'neuer'],
    },
    source: UNIT_24_SOURCE,
  },
]

/** "Why?" notes: one word explained in one sentence. */
export const UNIT_24_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Der Müll wird jeden Dienstag abgeholt.',
    ru: 'Мусор вывозят каждый вторник.',
    ky: 'Таштанды ар шейшембиде алынып кетилет.',
    word: 'abgeholt',
    conceptId: 'b1-passiv-praesens',
    reason: l(
      'Passiv = werden + Partizip II. У глагола abholen отделяемая приставка ab-, поэтому Partizip II — abgeholt (ab-ge-holt), и он стоит в самом конце.',
      'Passiv = werden + Partizip II. abholen этишинин ажыраган ab- приставкасы бар, ошондуктан Partizip II — abgeholt (ab-ge-holt), ал эң аягында турат.',
    ),
    more: [
      {
        de: 'Die Waschmaschine wird heute angeschlossen.',
        ru: 'Стиральную машину подключают сегодня.',
        ky: 'Кир жуугуч машина бүгүн туташтырылат.',
      },
      {
        de: 'Die Küche wird neu eingebaut.',
        ru: 'Кухню устанавливают заново.',
        ky: 'Ашкана жаңыдан орнотулат.',
      },
    ],
  },
  {
    sentence: 'Die Heizung wird vom Hausmeister kontrolliert.',
    ru: 'Отопление проверяет смотритель дома.',
    ky: 'Жылытууну үйдү кароочу текшерет.',
    word: 'vom',
    conceptId: 'b1-passiv-praesens',
    reason: l(
      'Если в Passiv нужно назвать исполнителя, ставится von + Dativ: von dem Hausmeister = vom Hausmeister. Без него смысл тот же: «Die Heizung wird kontrolliert».',
      'Passiv сүйлөмүндө аткаруучуну атоо керек болсо, von + Dativ коюлат: von dem Hausmeister = vom Hausmeister. Аны койбосоң да маани ошол бойдон калат: «Die Heizung wird kontrolliert».',
    ),
    more: [
      {
        de: 'Der Wasserhahn wird vom Hausmeister repariert.',
        ru: 'Кран чинит смотритель дома.',
        ky: 'Суу кранын үйдү кароочу оңдойт.',
      },
      {
        de: 'Die Abrechnung wird per Post geschickt.',
        ru: 'Расчёт присылают по почте.',
        ky: 'Эсеп-кысап почта аркылуу жөнөтүлөт.',
      },
    ],
  },
  {
    sentence: 'Helle Zimmer machen eine Wohnung freundlich.',
    ru: 'Светлые комнаты делают квартиру приятной.',
    ky: 'Жарык бөлмөлөр батирди жагымдуу кылат.',
    word: 'Helle',
    conceptId: 'b1-adjektive-ohne-artikel',
    reason: l(
      'Артикля нет, поэтому окончание показывает падеж и число сам: «Zimmer» — множественное число, Nominativ, значит -e: helle Zimmer.',
      'Артикль жок, ошондуктан уланды жалгоону жана санды өзү көрсөтөт: «Zimmer» — көптүк сан, Nominativ, демек -e: helle Zimmer.',
    ),
    more: [
      {
        de: 'Aus dem Hahn tropft kaltes Wasser.',
        ru: 'Из крана капает холодная вода.',
        ky: 'Крандан муздак суу тамчылап жатат.',
      },
      {
        de: 'Er trinkt jeden Morgen starken Kaffee.',
        ru: 'Он каждое утро пьёт крепкий кофе.',
        ky: 'Ал күн сайын эртең менен күчтүү кофе ичет.',
      },
    ],
  },
  {
    sentence: 'Wir vermieten eine Wohnung mit großem Balkon und neuer Küche.',
    ru: 'Мы сдаём квартиру с большим балконом и новой кухней.',
    ky: 'Биз чоң балкондуу жана жаңы ашканалуу батирди ижарага беребиз.',
    word: 'großem',
    conceptId: 'b1-adjektive-ohne-artikel',
    reason: l(
      'После mit стоит Dativ. «der Balkon» — мужской род, значит -em: mit großem Balkon. «die Küche» — женский род, значит -er: mit neuer Küche.',
      'mit сөзүнөн кийин Dativ турат. «der Balkon» — эркек род, демек -em: mit großem Balkon. «die Küche» — аял род, демек -er: mit neuer Küche.',
    ),
    more: [
      {
        de: 'Die Wohnung liegt in zentraler Lage.',
        ru: 'Квартира находится в центральном районе.',
        ky: 'Батир борбордо жайгашкан.',
      },
      {
        de: 'In alten Häusern ist es oft hellhörig.',
        ru: 'В старых домах часто плохая звукоизоляция.',
        ky: 'Эски үйлөрдө көбүнчө үн өтүп турат.',
      },
    ],
  },
]
