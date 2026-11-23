import type { Derived } from './derived-01'

/** Units 332 and 335 — ENRICHED lessons (see derived-01.ts). */
export const DERIVED_04: Derived[] = [
  {
    from: 'b1-konzessive-saetze',
    spec: {
      n: 32,
      slug: 'konzessive-konnektoren',
      topic: 'Konzessive Konnektoren',
      title: ['Konzessive Konnektoren — obwohl, trotzdem, zwar … aber, obgleich', 'Konzessive Konnektoren — obwohl, trotzdem, zwar … aber байламталары'],
      ex: [
        ['Obwohl er krank war, ging er zur Arbeit.', 'Хотя он был болен, он пошёл на работу.', 'Ал оорусаң да жумушка барды.', 'obwohl + глагол в конце'],
        ['Sie hat wenig Zeit, trotzdem hilft sie uns.', 'У неё мало времени, тем не менее она нам помогает.', 'Анын убактысы аз, ошого карабай ал бизге жардам берет.', 'trotzdem + глагол сразу'],
        ['Das Hotel ist zwar teuer, aber es liegt zentral.', 'Отель, правда, дорогой, но расположен в центре.', 'Мейманкана кымбат болгону менен борбордо жайгашкан.', 'zwar … aber'],
      ],
      tasks: [
        ['f', '___ es regnet, gehen wir spazieren.', 'Хотя идёт дождь, мы идём гулять.', 'Жамгыр жааса да, биз сейилдеп чыгабыз.', 'Obwohl', ['Weil', 'Damit'], ['Противоречие ожиданию — obwohl.', 'Күткөнгө карама-каршылык — obwohl.']],
        ['f', 'Es regnet. ___ gehen wir spazieren.', 'Идёт дождь. Тем не менее мы идём гулять.', 'Жамгыр жаап жатат. Ошого карабай биз сейилдеп чыгабыз.', 'Trotzdem', ['Deshalb', 'Obwohl'], ['Trotzdem — главное предложение, глагол сразу после него.', 'trotzdem — башкы бөлүк, этиш андан дароо кийин.']],
        ['c', 'Welcher Satz ist richtig?', 'Какое предложение правильное?', 'Кайсы сүйлөм туура?', 'Obwohl er müde ist, arbeitet er weiter.', ['Obwohl er müde ist, er arbeitet weiter.', 'Obwohl er ist müde, arbeitet er weiter.'], ['После придаточного с obwohl главное начинается с глагола.', 'obwohl менен кошумча бөлүктөн кийин башкысы этиштен башталат.']],
        ['o', 'Das Hotel ist zwar teuer, aber es liegt zentral.', 'Отель, правда, дорогой, но расположен в центре.', 'Мейманкана кымбат болгону менен борбордо жайгашкан.', ['Zwar … aber: две части, в каждой глагол на втором месте.', 'zwar … aber: эки бөлүк, ар биринде этиш экинчи орунда.']],
      ],
    },
  },
  {
    from: 'b1-genitiv-praepositionen',
    spec: {
      n: 35,
      slug: 'praepositionen-mit-genitiv',
      topic: 'Präpositionen mit Genitiv',
      title: ['Präpositionen mit Genitiv — wegen, trotz, während, statt, innerhalb, außerhalb', 'Genitiv менен предлогдор — wegen, trotz, während, statt, innerhalb, außerhalb'],
      ex: [
        ['Wegen des Regens bleiben wir zu Hause.', 'Из-за дождя мы остаёмся дома.', 'Жамгырдан улам биз үйдө калабыз.', 'wegen + Genitiv'],
        ['Innerhalb einer Woche bekommen Sie eine Antwort.', 'В течение недели вы получите ответ.', 'Бир жуманын ичинде сиз жооп аласыз.', 'innerhalb + Genitiv'],
        ['Außerhalb der Stadt gibt es viele Seen.', 'За пределами города много озёр.', 'Шаардан тышкары көптөгөн көл бар.', 'außerhalb + Genitiv'],
      ],
      tasks: [
        ['f', 'Wegen ___ Regens bleiben wir zu Hause.', 'Из-за дождя мы остаёмся дома.', 'Жамгырдан улам биз үйдө калабыз.', 'des', ['dem', 'den'], ['Wegen + Genitiv: des Regens.', 'wegen предлогунан кийин Genitiv: des Regens.']],
        ['f', 'Trotz ___ Verspätung kamen wir pünktlich an. (die Verspätung)', 'Несмотря на опоздание, мы приехали вовремя.', 'Кечигүүгө карабай биз убагында жеттик.', 'der', ['des', 'die'], ['Женский род в Genitiv — der.', 'Аял род Genitivде — der.']],
        ['c', 'Welche Präposition passt zu „Ersatz“?', 'Какой предлог подходит по смыслу «вместо»?', '«Ордуна» мааниси үчүн кайсы предлог ылайыктуу?', 'statt', ['während', 'innerhalb'], ['Statt + Genitiv = «вместо».', 'statt + Genitiv = «ордуна».']],
        ['o', 'Außerhalb der Stadt gibt es viele Seen.', 'За пределами города много озёр.', 'Шаардан тышкары көптөгөн көл бар.', ['Außerhalb der Stadt — первый блок, gibt — на втором месте.', 'außerhalb der Stadt — биринчи блок, gibt — экинчи орунда.']],
      ],
    },
  },
]
