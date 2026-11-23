import type { Derived } from './derived-01'

/** Units 326 and 329 — ENRICHED lessons (see derived-01.ts). */
export const DERIVED_03: Derived[] = [
  {
    from: 'b1-adjektive-dativ-genitiv',
    spec: {
      n: 26,
      slug: 'adjektivdeklination-vertiefung',
      topic: 'Adjektivdeklination: Vertiefung',
      title: ['Adjektivdeklination — Dativ, Genitiv и множественное число', 'Adjektivdeklination — Dativ, Genitiv жана көптүк сан'],
      ex: [
        ['Das ist das Haus meiner netten Nachbarin.', 'Это дом моей милой соседки.', 'Бул менин жакшы кошуна аялымдын үйү.', 'Genitiv: meiner netten Nachbarin (-en)'],
        ['Trotz des schlechten Wetters sind wir gewandert.', 'Несмотря на плохую погоду, мы ходили в поход.', 'Аба ырайы жаман болсо да, биз тоого чыктык.', 'Genitiv: des schlechten Wetters (-en)'],
        ['Er hat einen interessanten Vortrag gehalten.', 'Он прочитал интересный доклад.', 'Ал кызыктуу баяндама жасады.', 'Akkusativ м. р.: einen interessanten (-en)'],
      ],
      when: [
        ['Сводка окончаний после артикля: Nominativ — der große / die große / das große (ein großer / eine große / ein großes); Akkusativ — den großen / die große / das große (einen großen); Dativ — dem großen / der großen / dem großen; Genitiv — des großen / der großen / des großen. Во множественном числе после артикля — всегда -en.', 'Артиклден кийинки жалгоолордун жыйынтыгы: Nominativ — der große / die große / das große (ein großer / eine große / ein großes); Akkusativ — den großen / die große / das große (einen großen); Dativ — dem großen / der großen / dem großen; Genitiv — des großen / der großen / des großen. Артиклден кийин көптүк санда — дайыма -en.'],
      ],
      tasks: [
        ['f', 'Ich suche einen ___ Job. (neu)', 'Я ищу новую работу.', 'Мен жаңы жумуш издеп жатам.', 'neuen', ['neue', 'neuer'], ['Akkusativ мужского рода после einen — -en.', 'einenден кийин эркек род Akkusativ — -en.']],
        ['f', 'Wir wohnen in einer ___ Wohnung. (klein)', 'Мы живём в маленькой квартире.', 'Биз кичинекей батирде жашайбыз.', 'kleinen', ['kleine', 'kleiner'], ['Dativ женского рода после einer — -en.', 'einerден кийин аял род Dativ — -en.']],
        ['f', 'Mit dem ___ Auto sind wir gefahren. (neu)', 'Мы ехали на новой машине.', 'Биз жаңы машина менен бардык.', 'neuen', ['neues', 'neue'], ['Dativ среднего рода после dem — -en.', 'demден кийин орто род Dativ — -en.']],
        ['f', 'Das ist das Haus meiner ___ Nachbarin. (nett)', 'Это дом моей милой соседки.', 'Бул менин жакшы кошуна аялымдын үйү.', 'netten', ['nette', 'netter'], ['Genitiv после meiner — -en.', 'meinerден кийин Genitiv — -en.']],
        ['c', 'Welcher Satz ist richtig?', 'Какое предложение правильное?', 'Кайсы сүйлөм туура?', 'Ich helfe den netten Kolleginnen.', ['Ich helfe den nette Kolleginnen.', 'Ich helfe die netten Kolleginnen.'], ['Множественное число в Dativ после den — -en; helfen требует Dativ.', 'Көптүк сан Dativде denден кийин — -en; helfen Dativди талап кылат.']],
        ['c', 'Welche Endung steht nach „des“ (Genitiv Singular)?', 'Какое окончание стоит после «des» (Genitiv единственного числа)?', '«des»тен кийин (жекелик сандын Genitivи) кайсы жалгоо турат?', '-en', ['-e', '-er'], ['Nach des / der im Genitiv: -en.', 'des / derден кийин Genitivде: -en.']],
        ['o', 'Trotz des schlechten Wetters sind wir gewandert.', 'Несмотря на плохую погоду, мы ходили в поход.', 'Аба ырайы жаман болсо да, биз тоого чыктык.', ['Genitiv: des schlechten Wetters; sind — второе место, gewandert — в конце.', 'Genitiv: des schlechten Wetters; sind — экинчи орунда, gewandert — аягында.']],
      ],
    },
  },
  {
    from: 'b1-satzbau-mittelfeld',
    spec: {
      n: 29,
      slug: 'wortstellung-im-mittelfeld',
      topic: 'Wortstellung im Mittelfeld',
      title: ['Wortstellung im Mittelfeld — Satzklammer, Pronomen, TeKaMoLo', 'Mittelfeldдеги сөздөрдүн тартиби — Satzklammer, ат атоочтор, TeKaMoLo'],
      ex: [
        ['Wir haben dem Chef gestern die Unterlagen geschickt.', 'Мы вчера отправили начальнику документы.', 'Биз кечээ жетекчиге документтерди жөнөттүк.', 'Dativ-существительное перед Akkusativ-существительным'],
        ['Ich gebe sie dir heute Abend zurück.', 'Я верну их тебе сегодня вечером.', 'Мен аларды сага бүгүн кечинде кайтарып берем.', 'два местоимения: Akkusativ → Dativ'],
        ['Sie fährt jeden Tag wegen der Arbeit mit dem Bus ins Büro.', 'Она каждый день из-за работы ездит на автобусе в офис.', 'Ал күн сайын жумуштан улам автобус менен кеңсеге барат.', 'TeKaMoLo: Temporal – Kausal – Modal – Lokal'],
      ],
      tasks: [
        ['f', 'Ich gebe ___ ihm.', 'Я даю это ему.', 'Мен муну ага берем.', 'es', ['ihn', 'ihm'], ['Два местоимения: сначала Akkusativ (es), потом Dativ (ihm).', 'Эки ат атооч: адегенде Akkusativ (es), анан Dativ (ihm).']],
        ['c', 'Welche Reihenfolge ist richtig (TeKaMoLo)?', 'Какой порядок правильный (TeKaMoLo)?', 'Кайсы тартип туура (TeKaMoLo)?', 'gestern – aus Neugier – zu Fuß – in die Stadt', ['in die Stadt – gestern – zu Fuß – aus Neugier', 'zu Fuß – gestern – in die Stadt – aus Neugier'], ['Temporal (gestern) – Kausal (aus Neugier) – Modal (zu Fuß) – Lokal (in die Stadt).', 'Тартиби: Temporal (gestern) – Kausal (aus Neugier) – Modal (zu Fuß) – Lokal (in die Stadt).']],
        ['c', 'Welcher Satz ist richtig?', 'Какое предложение правильное?', 'Кайсы сүйлөм туура?', 'Wir haben dem Chef gestern die Unterlagen geschickt.', ['Wir haben gestern geschickt dem Chef die Unterlagen.', 'Wir dem Chef haben gestern die Unterlagen geschickt.'], ['Спрягаемый глагол — на втором месте, Partizip II — в конце, между ними Mittelfeld.', 'Жакталган этиш — экинчи орунда, Partizip II — аягында, алардын ортосунда Mittelfeld.']],
        ['o', 'Sie fährt jeden Tag wegen der Arbeit mit dem Bus ins Büro.', 'Она каждый день из-за работы ездит на автобусе в офис.', 'Ал күн сайын жумуштан улам автобус менен кеңсеге барат.', ['Порядок: время – причина – способ – место.', 'Тартиби: убакыт – себеп – ыкма – жер.']],
      ],
    },
  },
]
