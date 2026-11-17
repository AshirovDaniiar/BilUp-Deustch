import type { GrammarConcept, L10n, WhyNote } from '../../types'
import { UNIT_15_SOURCE } from '../provenance'

const l = (ru: string, ky: string): L10n => ({ ru, ky })

/**
 * Unit 15 grammar (Stage 7F). Three concepts of the approved Stage 7B plan, each with a capped scope (docs/authoring/A2_UNIT15_DESIGN_NOTES.md):
 *  1. `a2-adjektivendungen-definit` — endings after der/die/das, dieser/diese/dieses, welcher: Nominativ and Akkusativ, singular and plural (-e / -en). No Dativ, no Genitiv.
 *  2. `a2-mengen-indefinitpronomen` — measure words without plural -s / article (ein Kilo Äpfel), einen / keinen / welche as replacement, wie viel / wie viele.
 *  3. `a2-hoefliche-bitten` — a CLOSED list of polite chunks (Können Sie …? Darf ich …? Ich möchte … Ich hätte gern …); `hätte gern` is a phrase, never explained as a form (audit D-3).
 * Not taught: Dativ endings, endings in the plural without article, the neuter pronouns eins / keins, other Konjunktiv II forms, `lassen`.
 */
export const UNIT_15_GRAMMAR: GrammarConcept[] = [
  {
    id: 'a2-adjektivendungen-definit',
    category: 'adjectives',
    level: 'A2',
    unit: 15,
    visual: 'articles',
    title: l(
      'Окончания прилагательных после der / die / das, dieser и welcher',
      'der / die / das, dieser жана welcher сөздөрүнөн кийинки сын атоочтордун аякталышы',
    ),
    summary: l(
      'В юните 13 вы выучили окончания после ein-. Теперь — после определённого артикля (der, die, das), после dieser / diese / dieses и после welcher / welche / welches. Здесь всё проще: почти везде окончание -e, и только в двух случаях — -en: мужской род в Akkusativ (den blauen Pullover) и множественное число (die roten Hosen). Примеры: «Die rote Jacke gefällt mir», «Das weiße Kleid ist schön», «Ich nehme den grauen Mantel», «Diese schwarzen Hosen sind reduziert». Только Nominativ и Akkusativ; Dativ (in der roten Jacke) мы здесь не учим.',
      '13-бөлүмдө ein- сөзүнөн кийинки аякталыштарды үйрөндүңүз. Эми — аныкталган артикльден (der, die, das), dieser / diese / dieses жана welcher / welche / welches сөздөрүнөн кийинки аякталыштар. Бул жерде баары жөнөкөйрөөк: дээрлик баардык жерде -e аякталышы, ал эми эки учурда гана -en: эркек жынстагы сөз Akkusativде (den blauen Pullover) жана көптүк санда (die roten Hosen). Мисалдар: «Die rote Jacke gefällt mir», «Das weiße Kleid ist schön», «Ich nehme den grauen Mantel», «Diese schwarzen Hosen sind reduziert». Nominativ менен Akkusativ гана; Dativ (in der roten Jacke) бул жерде үйрөнүлбөйт.',
    ),
    discover: l(
      'Сравните: «Ich nehme einen blauen Pullover» и «Ich nehme den blauen Pullover». Какое окончание у blau в обоих предложениях? А что будет с женским родом: «die blaue Jacke»?',
      '«Ich nehme einen blauen Pullover» жана «Ich nehme den blauen Pullover» деген сүйлөмдөрдү салыштырыңыз. Экөөндө тең blau сөзүнүн аякталышы кандай? Ал эми аял жынсында «die blaue Jacke» кандай болот?',
    ),
    why: l(
      'В магазине вы постоянно выбираете между похожими вещами: «Welchen Mantel? — Den grauen». Для этого нужны именно эти окончания. Хорошая новость: после определённого артикля их всего два — -e и -en. Правило: -en — только для der-слов в Akkusativ (den) и для множественного числа; всё остальное — -e.',
      'Дүкөндө окшош буюмдардын арасынан дайыма тандайсыз: «Welchen Mantel? — Den grauen». Ал үчүн дал ушул аякталыштар керек. Жакшы жаңылык: аныкталган артикльден кийин алардын экөө гана бар — -e жана -en. Эреже: -en — Akkusativдеги эркек жынстагы сөздөр (den) жана көптүк сан үчүн гана; калган баары — -e.',
    ),
    when: [
      l(
        'Мужской род: Nominativ — der blaue Pullover; Akkusativ — den blauen Pullover.',
        'Эркек жынс: Nominativ — der blaue Pullover; Akkusativ — den blauen Pullover.',
      ),
      l(
        'Женский и средний род: Nominativ и Akkusativ одинаковы — die rote Jacke, das weiße Kleid (всегда -e).',
        'Аял жана орто жынс: Nominativ менен Akkusativ бирдей — die rote Jacke, das weiße Kleid (ар дайым -e).',
      ),
      l(
        'Множественное число: после die / diese всегда -en — die roten Hosen, diese schwarzen Kleider.',
        'Көптүк сан: die / diese сөздөрүнөн кийин ар дайым -en — die roten Hosen, diese schwarzen Kleider.',
      ),
      l(
        'Вопрос с welcher: Welchen Mantel möchten Sie? — Den grauen. Welche Jacke gefällt Ihnen? — Die rote.',
        'welcher менен суроо: Welchen Mantel möchten Sie? — Den grauen. Welche Jacke gefällt Ihnen? — Die rote.',
      ),
    ],
    examples: [
      { de: 'Die rote Jacke gefällt mir.', ru: 'Красная куртка мне нравится.', ky: 'Кызыл куртка мага жагат.', focus: 'die rote Jacke (die, -e)' },
      { de: 'Das weiße Kleid ist schön.', ru: 'Белое платье красивое.', ky: 'Ак көйнөк сонун.', focus: 'das weiße Kleid (das, -e)' },
      { de: 'Ich nehme den grauen Mantel.', ru: 'Я беру серое пальто.', ky: 'Мен боз пальтону алам.', focus: 'den grauen Mantel (den, -en)' },
      { de: 'Der blaue Pullover passt mir gut.', ru: 'Синий свитер мне хорошо подходит.', ky: 'Көк жемпир мага жакшы туура келет.', focus: 'der blaue Pullover (der, -e)' },
      { de: 'Diese schwarzen Hosen sind reduziert.', ru: 'Эти чёрные брюки со скидкой.', ky: 'Бул кара шымдар арзандатылган.', focus: 'diese schwarzen Hosen (Plural, -en)' },
      { de: 'Welchen Mantel möchten Sie? – Den grauen.', ru: 'Какое пальто вы хотите? — Серое.', ky: 'Кайсы пальтону каалайсыз? — Бозду.', focus: 'welchen … den grauen' },
    ],
    mistakes: [
      {
        wrong: 'Ich nehme den blaue Pullover.',
        right: 'Ich nehme den blauen Pullover.',
        note: l(
          'Мужской род в Akkusativ (den) требует окончания -en.',
          'Akkusativдеги эркек жынс (den) -en аякталышын талап кылат.',
        ),
      },
      {
        wrong: 'Die rote Hosen sind zu lang.',
        right: 'Die roten Hosen sind zu lang.',
        note: l(
          'Во множественном числе после die — всегда -en.',
          'Көптүк санда die сөзүнөн кийин ар дайым -en.',
        ),
      },
      {
        wrong: 'Ich nehme der blaue Pullover.',
        right: 'Ich nehme den blauen Pullover.',
        note: l(
          'После nehmen нужен Akkusativ: der → den, и прилагательное получает -en.',
          'nehmen этишинен кийин Akkusativ керек: der → den, жана сын атоочко -en кошулат.',
        ),
      },
      {
        wrong: 'Das weißen Kleid ist schön.',
        right: 'Das weiße Kleid ist schön.',
        note: l(
          'У среднего рода в Nominativ и Akkusativ после das — окончание -e.',
          'Орто жынста Nominativ жана Akkusativде das сөзүнөн кийин -e аякталышы турат.',
        ),
      },
    ],
    reallife: [
      { de: 'Welchen Mantel möchten Sie?', ru: 'Какое пальто вы хотите?', ky: 'Кайсы пальтону каалайсыз?', focus: 'welchen Mantel' },
      { de: 'Ich nehme die rote Jacke.', ru: 'Я беру красную куртку.', ky: 'Мен кызыл куртканы алам.', focus: 'die rote Jacke' },
      { de: 'Diese schwarzen Hosen sind zu groß.', ru: 'Эти чёрные брюки слишком большие.', ky: 'Бул кара шымдар өтө чоң.', focus: 'diese schwarzen Hosen' },
    ],
    dialogue: [
      { speaker: 'Verkäuferin', text: 'Welchen Pullover möchten Sie?', ru: 'Какой свитер вы хотите?', ky: 'Кайсы жемпирди каалайсыз?' },
      { speaker: 'Kunde', text: 'Den blauen, bitte.', ru: 'Синий, пожалуйста.', ky: 'Көкүн, сураныч.' },
      { speaker: 'Verkäuferin', text: 'Der blaue Pullover ist heute reduziert.', ru: 'Синий свитер сегодня со скидкой.', ky: 'Көк жемпир бүгүн арзандатылган.' },
      { speaker: 'Kunde', text: 'Dann nehme ich den blauen Pullover.', ru: 'Тогда я беру синий свитер.', ky: 'Анда мен көк жемпирди алам.' },
    ],
    speakPrompt: {
      prompt: l(
        'Вы в магазине одежды. Скажите, какую вещь вы выбираете и какого она цвета: два-три предложения.',
        'Сиз кийим дүкөнүндөсүз. Кандай буюмду тандаганыңызды жана анын кандай түстө экенин айтыңыз: эки-үч сүйлөм.',
      ),
      sample: 'Ich nehme den grauen Mantel. Die rote Jacke gefällt mir auch. Der blaue Pullover passt mir gut.',
      keywords: ['den grauen', 'die rote', 'der blaue'],
    },
    source: UNIT_15_SOURCE,
  },
  {
    id: 'a2-mengen-indefinitpronomen',
    category: 'pronouns',
    level: 'A2',
    unit: 15,
    visual: 'plural',
    title: l(
      'Количество: ein Kilo Äpfel; einen / keinen / welche; wie viel и wie viele',
      'Сан-өлчөм: ein Kilo Äpfel; einen / keinen / welche; wie viel жана wie viele',
    ),
    summary: l(
      'После меры (Kilo, Gramm, Liter, Stück …) существительное стоит без артикля и без предлога: «ein Kilo Äpfel», «ein Stück Kuchen», «drei Liter Milch». Мера в мужском и среднем роде после числа не получает -s (zwei Kilo, drei Liter, vier Stück), а женские меры берут -n / -en (zwei Flaschen, drei Dosen, vier Scheiben). Чтобы не повторять существительное, говорят: «Haben Sie Äpfel? — Ja, ich habe welche» (множественное число), «Haben Sie einen Mantel? — Nein, ich habe keinen» (мужской род), «eine / keine» (женский род). Вопросы: wie viel — с неисчисляемым существительным и о цене (Wie viel kostet das?), wie viele — с исчисляемым во множественном числе (Wie viele Flaschen?). Средний род (eins / keins) здесь не учим.',
      'Өлчөмдөн (Kilo, Gramm, Liter, Stück …) кийин зат атооч артикльсиз жана предлогсуз турат: «ein Kilo Äpfel», «ein Stück Kuchen», «drei Liter Milch». Эркек жана орто жынстагы өлчөм санактан кийин -s албайт (zwei Kilo, drei Liter, vier Stück), ал эми аял жынстагы өлчөмдөр -n / -en алат (zwei Flaschen, drei Dosen, vier Scheiben). Зат атоочту кайталабоо үчүн мындай дейт: «Haben Sie Äpfel? — Ja, ich habe welche» (көптүк сан), «Haben Sie einen Mantel? — Nein, ich habe keinen» (эркек жынс), «eine / keine» (аял жынс). Суроолор: wie viel — саналбай турган зат атооч менен жана баа жөнүндө (Wie viel kostet das?), wie viele — саналуучу көптүк сандагы зат атооч менен (Wie viele Flaschen?). Орто жынсты (eins / keins) бул жерде үйрөнбөйбүз.',
    ),
    discover: l(
      'Сравните: «Ich möchte zwei Kilo Äpfel» и «Ich möchte zwei Flaschen Wasser». Какая мера получает окончание во множественном числе, а какая — нет? А что вы ответите на «Haben Sie Äpfel?», не повторяя «Äpfel»?',
      '«Ich möchte zwei Kilo Äpfel» жана «Ich möchte zwei Flaschen Wasser» деген сүйлөмдөрдү салыштырыңыз. Кайсы өлчөм көптүк санда аякталыш алат, кайсынысы албайт? Ал эми «Haben Sie Äpfel?» деген суроого «Äpfel» сөзүн кайталабай эмне деп жооп бересиз?',
    ),
    why: l(
      'В магазине, на рынке и в кафе вы всё время называете количество и отвечаете коротко. Если сказать «zwei Kilos Äpfel» или «ein Kilo von Äpfeln», вас поймут, но фраза прозвучит неестественно. Короткий ответ «Ja, ich habe welche» звучит естественнее, чем повторение всего слова.',
      'Дүкөндө, базарда жана кафеде дайыма санды атап, кыска жооп бересиз. «zwei Kilos Äpfel» же «ein Kilo von Äpfeln» десеңиз, сизди түшүнөт, бирок сүйлөм табигый эмес угулат. «Ja, ich habe welche» деген кыска жооп сөздү толугу менен кайталаганга караганда табигыйыраак угулат.',
    ),
    when: [
      l(
        'Мера + существительное без артикля: ein Kilo Äpfel, hundert Gramm Käse, ein Stück Kuchen, eine Packung Nudeln.',
        'Өлчөм + артикльсиз зат атооч: ein Kilo Äpfel, hundert Gramm Käse, ein Stück Kuchen, eine Packung Nudeln.',
      ),
      l(
        'Число: der / das — без -s (zwei Kilo, drei Liter, vier Stück); die — с -n / -en (zwei Flaschen, drei Dosen, vier Scheiben).',
        'Сан: der / das — -s жок (zwei Kilo, drei Liter, vier Stück); die — -n / -en менен (zwei Flaschen, drei Dosen, vier Scheiben).',
      ),
      l(
        'Замена существительного: welche (мн. число), einen / keinen (м. род), eine / keine (ж. род). Haben Sie Tomaten? — Ja, ich habe welche. / Nein, ich habe keine.',
        'Зат атоочту алмаштыруу: welche (көптүк), einen / keinen (эркек жынс), eine / keine (аял жынс). Haben Sie Tomaten? — Ja, ich habe welche. / Nein, ich habe keine.',
      ),
      l(
        'Wie viel — цена и неисчисляемое: Wie viel kostet das? Wie viel Milch brauchen Sie? Wie viele — исчисляемое во мн. числе: Wie viele Flaschen?',
        'Wie viel — баа жана саналбай турган: Wie viel kostet das? Wie viel Milch brauchen Sie? Wie viele — саналуучу көптүк: Wie viele Flaschen?',
      ),
    ],
    examples: [
      { de: 'Ich möchte ein Kilo Äpfel.', ru: 'Я хотел бы килограмм яблок.', ky: 'Мен бир килограмм алма алгым келет.', focus: 'ein Kilo Äpfel' },
      { de: 'Wir brauchen drei Liter Milch.', ru: 'Нам нужно три литра молока.', ky: 'Бизге үч литр сүт керек.', focus: 'drei Liter (без -s)' },
      { de: 'Zwei Flaschen Wasser, bitte.', ru: 'Две бутылки воды, пожалуйста.', ky: 'Сураныч, эки бөтөлкө суу.', focus: 'zwei Flaschen (die → -n)' },
      { de: 'Haben Sie Tomaten? – Ja, ich habe welche.', ru: 'У вас есть помидоры? — Да, есть.', ky: 'Сизде томат барбы? — Ооба, бар.', focus: 'welche' },
      { de: 'Haben Sie einen Mantel in Größe 50? – Nein, ich habe keinen.', ru: 'У вас есть пальто размера 50? — Нет, у меня нет.', ky: 'Сизде 50-өлчөмдөгү пальто барбы? — Жок, менде жок.', focus: 'einen / keinen' },
      { de: 'Wie viele Brötchen möchten Sie? Wie viel kostet das?', ru: 'Сколько булочек вы хотите? Сколько это стоит?', ky: 'Канча булочка каалайсыз? Бул канча турат?', focus: 'wie viele / wie viel' },
    ],
    mistakes: [
      {
        wrong: 'Ich möchte zwei Kilos Äpfel.',
        right: 'Ich möchte zwei Kilo Äpfel.',
        note: l(
          'Мера в мужском и среднем роде после числа без -s: zwei Kilo, drei Liter.',
          'Эркек жана орто жынстагы өлчөм санактан кийин -s албайт: zwei Kilo, drei Liter.',
        ),
      },
      {
        wrong: 'Ich möchte ein Kilo von Äpfeln.',
        right: 'Ich möchte ein Kilo Äpfel.',
        note: l(
          'После меры существительное идёт без предлога von и в той же форме, что в словаре.',
          'Өлчөмдөн кийин зат атооч von предлогусуз жана сөздүктөгү формасында турат.',
        ),
      },
      {
        wrong: 'Haben Sie Tomaten? – Ja, ich habe sie.',
        right: 'Haben Sie Tomaten? – Ja, ich habe welche.',
        note: l(
          'Когда речь о «некоторых, сколько-то», берут welche, а не sie.',
          'Бир аз, кандайдыр бир сан жөнүндө сөз болгондо sie эмес, welche колдонулат.',
        ),
      },
      {
        wrong: 'Wie viel Flaschen brauchen Sie?',
        right: 'Wie viele Flaschen brauchen Sie?',
        note: l(
          'С исчисляемым существительным во множественном числе — wie viele.',
          'Саналуучу көптүк сандагы зат атооч менен — wie viele.',
        ),
      },
    ],
    reallife: [
      { de: 'Ich hätte gern 200 Gramm Käse.', ru: 'Я хотел бы 200 граммов сыра.', ky: 'Мен 200 грамм сыр алгым келет.', focus: '200 Gramm Käse' },
      { de: 'Wie viel kostet das Kilo?', ru: 'Сколько стоит килограмм?', ky: 'Килограммы канча турат?', focus: 'wie viel' },
      { de: 'Haben Sie auch Joghurt? – Nein, leider nicht.', ru: 'У вас есть и йогурт? — Нет, к сожалению.', ky: 'Сизде йогурт да барбы? — Жок, тилекке каршы.', focus: 'ответ без повтора' },
    ],
    dialogue: [
      { speaker: 'Kunde', text: 'Haben Sie Äpfel?', ru: 'У вас есть яблоки?', ky: 'Сизде алма барбы?' },
      { speaker: 'Verkäufer', text: 'Ja, ich habe welche. Wie viele möchten Sie?', ru: 'Да, есть. Сколько вам нужно?', ky: 'Ооба, бар. Канчасын каалайсыз?' },
      { speaker: 'Kunde', text: 'Zwei Kilo, bitte. Und eine Flasche Wasser.', ru: 'Два килограмма, пожалуйста. И бутылку воды.', ky: 'Эки килограмм, сураныч. Жана бир бөтөлкө суу.' },
      { speaker: 'Verkäufer', text: 'Das macht vier Euro.', ru: 'С вас четыре евро.', ky: 'Төрт евро болду.' },
    ],
    speakPrompt: {
      prompt: l(
        'Закажите на рынке три продукта с количеством: сколько чего вы хотите.',
        'Базарда үч азыкты санын көрсөтүп заказ кылыңыз: эмнеден канча каалайсыз.',
      ),
      sample: 'Ich möchte ein Kilo Äpfel, zwei Flaschen Wasser und ein Stück Käse.',
      keywords: ['kilo', 'flaschen', 'stück'],
    },
    source: UNIT_15_SOURCE,
  },
  {
    id: 'a2-hoefliche-bitten',
    category: 'verbs',
    level: 'A2',
    unit: 15,
    visual: 'modal',
    title: l(
      'Вежливые просьбы: Können Sie …? Darf ich …? Ich möchte … Ich hätte gern …',
      'Сылык өтүнүчтөр: Können Sie …? Darf ich …? Ich möchte … Ich hätte gern …',
    ),
    summary: l(
      'В магазине, кафе и мастерской вежливость — это набор готовых оборотов. Просьба к другому: «Können Sie mir helfen?», «Können Sie das bitte wiederholen?». Разрешение: «Darf ich die Jacke anprobieren?». Желание: «Ich möchte einen Tee» и «Ich hätte gern einen Tee». Последний оборот учите целиком, как готовую фразу, без разбора его формы. Резкие формы — «Ich will …», «Geben Sie mir …!» — звучат грубо. Добавляйте bitte и «Entschuldigung» в начале. В вопросе с Können Sie / Darf ich второй глагол стоит в конце: «Können Sie mir das Kleid zeigen?».',
      'Дүкөндө, кафеде жана устаканада сылыктык — даяр сөз айкаштарынын жыйындысы. Башка адамга өтүнүч: «Können Sie mir helfen?», «Können Sie das bitte wiederholen?». Уруксат: «Darf ich die Jacke anprobieren?». Каалоо: «Ich möchte einen Tee» жана «Ich hätte gern einen Tee». Акыркы айкашты даяр фраза катары бүтүндөй, формасын талдабай үйрөнүңүз. «Ich will …», «Geben Sie mir …!» сыяктуу кескин формалар орой угулат. bitte сөзүн жана башында «Entschuldigung» кошуңуз. Können Sie / Darf ich менен суроодо экинчи этиш аягында турат: «Können Sie mir das Kleid zeigen?».',
    ),
    discover: l(
      'Сравните три способа заказать чай: «Ich will einen Tee», «Geben Sie mir einen Tee!», «Ich hätte gern einen Tee, bitte». Какой из них вы скажете незнакомому официанту — и почему?',
      'Чай заказдоонун үч жолун салыштырыңыз: «Ich will einen Tee», «Geben Sie mir einen Tee!», «Ich hätte gern einen Tee, bitte». Тааныш эмес официантка кайсынысын айтат элеңиз жана эмне үчүн?',
    ),
    why: l(
      'Вежливый тон важен в сфере услуг не меньше, чем правильная грамматика: прямая форма может обидеть. Вам не нужно строить новые формы: достаточно знать несколько готовых оборотов и вставлять в них нужные слова. Все глаголы вы уже знаете из A1 и из юнитов 12 и 14.',
      'Тейлөө тармагында сылык үн туура грамматикадан кем эмес маанилүү: түз форма таарынтышы мүмкүн. Жаңы формаларды түзүүнүн кереги жок: бир нече даяр айкашты билип, ага керектүү сөздөрдү коюу жетиштүү. Бардык этиштерди A1 деңгээлинен жана 12 жана 14-бөлүмдөрдөн билесиз.',
    ),
    when: [
      l(
        'Просьба к человеку: Können Sie mir helfen? Können Sie das bitte wiederholen? (mir — Dativ, из юнита 12).',
        'Адамга өтүнүч: Können Sie mir helfen? Können Sie das bitte wiederholen? (mir — Dativ, 12-бөлүмдөн).',
      ),
      l(
        'Разрешение: Darf ich die Jacke anprobieren? Darf ich hier zahlen?',
        'Уруксат: Darf ich die Jacke anprobieren? Darf ich hier zahlen?',
      ),
      l(
        'Желание: Ich möchte einen Kaffee. Ich hätte gern einen Kaffee. Обороты можно сочетать со словом bitte.',
        'Каалоо: Ich möchte einen Kaffee. Ich hätte gern einen Kaffee. Айкаштарды bitte сөзү менен айкалыштырса болот.',
      ),
      l(
        'Первое слово: Entschuldigung, … Entschuldigung, wo ist die Kasse? (вежливо привлечь внимание).',
        'Биринчи сөз: Entschuldigung, … Entschuldigung, wo ist die Kasse? (сылык көңүл буруу).',
      ),
    ],
    examples: [
      { de: 'Können Sie mir bitte helfen?', ru: 'Вы можете мне, пожалуйста, помочь?', ky: 'Сураныч, мага жардам бере аласызбы?', focus: 'Können Sie mir …?' },
      { de: 'Darf ich die Jacke anprobieren?', ru: 'Можно мне примерить куртку?', ky: 'Курткаңызды кийип көрсөм болобу?', focus: 'Darf ich …?' },
      { de: 'Ich möchte bitte einen Tee.', ru: 'Я хотел бы, пожалуйста, чай.', ky: 'Сураныч, мен чай алгым келет.', focus: 'Ich möchte …' },
      { de: 'Ich hätte gern eine Portion Nudeln.', ru: 'Я хотел бы порцию макарон.', ky: 'Мен бир үлүш макарон алгым келет.', focus: 'Ich hätte gern (целая фраза)' },
      { de: 'Entschuldigung, wo ist die Kasse?', ru: 'Извините, где касса?', ky: 'Кечиресиз, касса кайда?', focus: 'Entschuldigung' },
    ],
    mistakes: [
      {
        wrong: 'Ich will einen Kaffee.',
        right: 'Ich möchte einen Kaffee.',
        note: l(
          'Ich will звучит как требование. В магазине и кафе берут Ich möchte … или Ich hätte gern …',
          'Ich will талап сыяктуу угулат. Дүкөндө жана кафеде Ich möchte … же Ich hätte gern … колдонулат.',
        ),
      },
      {
        wrong: 'Geben Sie mir einen Kaffee!',
        right: 'Ich hätte gern einen Kaffee, bitte.',
        note: l(
          'Команда с Geben Sie звучит резко. Вежливее — просьба с bitte.',
          'Geben Sie менен буйрук кескин угулат. Сылыгыраак — bitte менен өтүнүч.',
        ),
      },
      {
        wrong: 'Können Sie helfen mir?',
        right: 'Können Sie mir helfen?',
        note: l(
          'Второй глагол стоит в самом конце, а mir — перед ним.',
          'Экинчи этиш эң аягында турат, ал эми mir андан мурун келет.',
        ),
      },
      {
        wrong: 'Darf ich anprobieren die Jacke?',
        right: 'Darf ich die Jacke anprobieren?',
        note: l(
          'Инфинитив (anprobieren) стоит в конце вопроса, после дополнения.',
          'Инфинитив (anprobieren) суроонун аягында, толуктоочтон кийин турат.',
        ),
      },
    ],
    reallife: [
      { de: 'Können Sie das bitte wiederholen?', ru: 'Вы можете это повторить, пожалуйста?', ky: 'Сураныч, муну кайталай аласызбы?', focus: 'Können Sie …?' },
      { de: 'Darf ich mit Karte zahlen?', ru: 'Можно оплатить картой?', ky: 'Карта менен төлөсөм болобу?', focus: 'Darf ich …?' },
      { de: 'Ich hätte gern die Rechnung, bitte.', ru: 'Счёт, пожалуйста.', ky: 'Сураныч, эсепти алып келиңиз.', focus: 'Ich hätte gern' },
    ],
    dialogue: [
      { speaker: 'Kellner', text: 'Guten Tag. Was möchten Sie?', ru: 'Добрый день. Что вы желаете?', ky: 'Кайырлуу күн. Сиз эмне каалайсыз?' },
      { speaker: 'Gast', text: 'Ich hätte gern einen Tee und ein Stück Kuchen, bitte.', ru: 'Я хотел бы чай и кусочек торта, пожалуйста.', ky: 'Сураныч, мен чай жана бир бөлүк торт алгым келет.' },
      { speaker: 'Kellner', text: 'Gern. Sonst noch etwas?', ru: 'Конечно. Что-нибудь ещё?', ky: 'Макул. Дагы бир нерсе барбы?' },
      { speaker: 'Gast', text: 'Ja, können Sie mir bitte die Speisekarte bringen?', ru: 'Да, вы можете принести мне меню, пожалуйста?', ky: 'Ооба, сураныч, мага менюну алып келе аласызбы?' },
    ],
    speakPrompt: {
      prompt: l(
        'Вы в кафе. Вежливо закажите напиток и еду и попросите счёт.',
        'Сиз кафедесиз. Сылык түрдө суусундук жана тамак заказ кылып, эсеп сураңыз.',
      ),
      sample: 'Ich hätte gern einen Tee und ein Stück Kuchen, bitte. Können Sie mir später die Rechnung bringen?',
      keywords: ['ich hätte gern', 'können sie', 'bitte'],
    },
    source: UNIT_15_SOURCE,
  },
]

/** "Why?" notes of Unit 15. */
export const UNIT_15_WHY_NOTES: WhyNote[] = [
  {
    sentence: 'Ich nehme den grauen Mantel.',
    ru: 'Я беру серое пальто.',
    ky: 'Мен боз пальтону алам.',
    word: 'grauen',
    conceptId: 'a2-adjektivendungen-definit',
    reason: l(
      'Mantel — мужской род. После nehmen нужен Akkusativ: der Mantel → den Mantel. Для мужского рода в Akkusativ после артикля окончание — -en: den grauen Mantel.',
      'Mantel — эркек жынстагы сөз. nehmen этишинен кийин Akkusativ керек: der Mantel → den Mantel. Артикльден кийин Akkusativдеги эркек жынс үчүн аякталыш — -en: den grauen Mantel.',
    ),
    more: [
      { de: 'Der graue Mantel ist reduziert.', ru: 'Серое пальто со скидкой.', ky: 'Боз пальто арзандатылган.' },
      { de: 'Welchen Pullover möchten Sie? – Den blauen.', ru: 'Какой свитер вы хотите? — Синий.', ky: 'Кайсы жемпирди каалайсыз? — Көктү.' },
    ],
  },
  {
    sentence: 'Die roten Hosen sind zu lang.',
    ru: 'Красные брюки слишком длинные.',
    ky: 'Кызыл шымдар өтө узун.',
    word: 'roten',
    conceptId: 'a2-adjektivendungen-definit',
    reason: l(
      'Hosen — множественное число. После die (и diese) во множественном числе окончание всегда -en: die roten Hosen.',
      'Hosen — көптүк сан. Көптүк санда die (жана diese) сөзүнөн кийин аякталыш ар дайым -en: die roten Hosen.',
    ),
    more: [
      { de: 'Diese schwarzen Kleider sind schön.', ru: 'Эти чёрные платья красивые.', ky: 'Бул кара көйнөктөр сонун.' },
      { de: 'Die roten Hosen passen mir nicht.', ru: 'Красные брюки мне не подходят.', ky: 'Кызыл шымдар мага туура келбейт.' },
    ],
  },
  {
    sentence: 'Ich möchte zwei Kilo Äpfel.',
    ru: 'Я хотел бы два килограмма яблок.',
    ky: 'Мен эки килограмм алма алгым келет.',
    word: 'Kilo',
    conceptId: 'a2-mengen-indefinitpronomen',
    reason: l(
      'Kilo — мера среднего рода. После числа она остаётся без -s (zwei Kilo), а существительное идёт сразу за ней без артикля и без von.',
      'Kilo — орто жынстагы өлчөм. Санактан кийин ал -s албай калат (zwei Kilo), ал эми зат атооч артикльсиз жана von сөзүсүз дароо андан кийин турат.',
    ),
    more: [
      { de: 'Zwei Flaschen Wasser, bitte.', ru: 'Две бутылки воды, пожалуйста.', ky: 'Сураныч, эки бөтөлкө суу.' },
      { de: 'Drei Liter Milch kosten vier Euro.', ru: 'Три литра молока стоят четыре евро.', ky: 'Үч литр сүт төрт евро турат.' },
    ],
  },
  {
    sentence: 'Haben Sie Tomaten? – Ja, ich habe welche.',
    ru: 'У вас есть помидоры? — Да, есть.',
    ky: 'Сизде томат барбы? — Ооба, бар.',
    word: 'welche',
    conceptId: 'a2-mengen-indefinitpronomen',
    reason: l(
      'Welche заменяет существительное во множественном числе, когда речь о «каком-то количестве»: ich habe welche = «у меня есть (сколько-то)». Отрицание — keine.',
      'Welche көптүк сандагы зат атоочту алмаштырат, «кандайдыр бир сан» жөнүндө сөз болгондо: ich habe welche = «менде бар (бир аз)». Четтөө — keine.',
    ),
    more: [
      { de: 'Haben Sie einen Mantel? – Nein, ich habe keinen.', ru: 'У вас есть пальто? — Нет, у меня нет.', ky: 'Сизде пальто барбы? — Жок, менде жок.' },
      { de: 'Haben Sie Brötchen? – Nein, leider keine.', ru: 'У вас есть булочки? — Нет, к сожалению.', ky: 'Сизде булочка барбы? — Жок, тилекке каршы.' },
    ],
  },
  {
    sentence: 'Können Sie mir bitte helfen?',
    ru: 'Вы можете мне, пожалуйста, помочь?',
    ky: 'Сураныч, мага жардам бере аласызбы?',
    word: 'mir',
    conceptId: 'a2-hoefliche-bitten',
    reason: l(
      'Вежливая просьба строится как вопрос с Können Sie. Helfen требует Dativ (mir — из юнита 12), а второй глагол helfen стоит в конце.',
      'Сылык өтүнүч Können Sie менен суроо катары түзүлөт. Helfen Dativ талап кылат (mir — 12-бөлүмдөн), ал эми экинчи этиш helfen аягында турат.',
    ),
    more: [
      { de: 'Darf ich die Jacke anprobieren?', ru: 'Можно мне примерить куртку?', ky: 'Курткаңызды кийип көрсөм болобу?' },
      { de: 'Ich hätte gern einen Kaffee, bitte.', ru: 'Я хотел бы кофе, пожалуйста.', ky: 'Сураныч, мен кофе алгым келет.' },
    ],
  },
]
