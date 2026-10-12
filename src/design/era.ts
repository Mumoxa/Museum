/* ============================================================================
   ERA IDENTITY
   ----------------------------------------------------------------------------
   Each chapter is a world. This table is the single source of truth for a
   chapter's visual identity: its tint family, its illustrated plate, its
   engraved mark, and the six or seven real things the reader can look for in
   it. Chapters read this and nothing else; no component invents its own era
   colour.

   Tint families are muted, historically plausible pigments, chosen so that
   the gold accent still reads on top of every one of them:
     deep = the ground the era sits on (near-black, still tinted)
     mid  = the ink of the era (used for rules, seals, marks)
     glow = the era's light (used for text and lines ON the dark ground)
   ========================================================================= */

export interface EraRelic {
  /** Stable id, used as the key in saved progress. */
  id: string;
  /** What the reader calls it. */
  name: string;
  /** One factual line about the object, drawn from the book's own content. */
  note: string;
  /** Source id in content/sources.ts that supports the note. */
  source: string;
  /** Where it hides on the page, as a percentage of the plate box. */
  x: number;
  y: number;
}

export interface Era {
  id: string;
  /** Printed chapter number, or a word for the front and back of the book. */
  num: string;
  title: string;
  subtitle: string;
  /** Short line for the expedition map site card. */
  mood: string;
  tint: { deep: string; mid: string; glow: string };
  /** Illustrated plate in public/images/art/eras/. */
  plate?: string;
  /** One-sentence description of the plate, used as alt text. */
  plateAlt?: string;
  /** Real objects from this chapter that the reader can find and keep. */
  relics: EraRelic[];
}

/* Ordered as the book is ordered. */
export const ERAS: Era[] = [
  {
    id: 'prologue',
    num: 'Prologue',
    title: 'The Magic History Book',
    subtitle: 'A book that remembers everything, and a compass that points to the past',
    mood: 'A dusty book, a brass compass, and one enormous question.',
    tint: { deep: '#33270c', mid: '#8a6a2b', glow: '#d9b761' },
    relics: [
      {
        id: 'compass',
        name: 'The brass compass',
        note: 'The compass on the cover does not point north. It points to a time. It has a ring of years around it instead of a ring of letters.',
        source: 'sanparks_rhino',
        x: 26, y: 68,
      },
      {
        id: 'dust-cover',
        name: 'The tea-coloured dust cover',
        note: 'The book was waiting under a dust cover the colour of strong tea. That colour is what old paper turns when it has been in the light for a long time.',
        source: 'sanparks_rhino',
        x: 72, y: 34,
      },
    ],
  },
  {
    id: 'ch1',
    num: '1',
    title: 'Before There Was South Africa',
    subtitle: 'Deep human history, stone tools, ochre paint, rock art and the first herders',
    mood: 'Caves by the sea, painted walls, and very old tools.',
    tint: { deep: '#2a2217', mid: '#8a7043', glow: '#d9bd82' },
    plate: 'era-deep-time.jpg',
    plateAlt: 'An illustration of a coastal cave mouth at dusk, with ochre figures of eland and hunters glowing faintly on the wall.',
    relics: [
      {
        id: 'ochre',
        name: 'A lump of red ochre',
        note: 'Ochre is a soft iron-rich earth. People ground it and mixed it with fat to make paint. Some of the oldest artists in the world used this exact red.',
        source: 'blombos_henshilwood',
        x: 30, y: 40,
      },
      {
        id: 'stone-point',
        name: 'A stone point',
        note: 'A worked stone point takes hours to make and strikes flint off in flakes smaller than a fingernail. It was a tool, and it was also, probably, a beautiful thing to own.',
        source: 'blombos_henshilwood',
        x: 66, y: 62,
      },
    ],
  },
  {
    id: 'ch2',
    num: '2',
    title: 'Kings, Kingdoms and Communities',
    subtitle: 'The hill of the jackal, the golden rhinoceros, and many nations across the land',
    mood: 'A hill of golden secrets and kingdoms that traded across the world.',
    tint: { deep: '#33260c', mid: '#a07a2a', glow: '#e3c169' },
    plate: 'era-kingdoms.jpg',
    plateAlt: 'An illustration of a dry-stone-walled hilltop settlement on golden highveld grass at sunset.',
    relics: [
      {
        id: 'gold-rhino',
        name: 'The golden rhinoceros',
        note: 'A small wooden rhinoceros covered in thin gold foil, found at Mapungubwe. It is one of the most famous objects ever found in southern Africa.',
        source: 'mapungubwe_kids',
        x: 40, y: 55,
      },
      {
        id: 'trade-bead',
        name: 'A glass trade bead',
        note: 'Thousands of glass beads were found at Mapungubwe. They were made in India or Persia, which means someone carried them thousands of kilometres to reach that hill.',
        source: 'globe_mapungubwe',
        x: 68, y: 44,
      },
    ],
  },
  {
    id: 'ch3',
    num: '3',
    title: 'The World Beyond Africa',
    subtitle: 'Spices, sea routes, Portugal, the Netherlands and the race for riches',
    mood: 'Why sailors dared to sail around a continent.',
    tint: { deep: '#16233a', mid: '#3a5c86', glow: '#9dc0e6' },
    plate: 'era-ocean.jpg',
    plateAlt: 'An illustration of a small fifteenth century sailing ship alone on a vast grey ocean.',
    relics: [
      {
        id: 'astrolabe',
        name: 'A mariner’s astrolabe',
        note: 'A heavy brass ring with a movable arm. A sailor held it up to the sun or a star to measure its height, and from that worked out how far south he had sailed.',
        source: 'wiki_dutchcape',
        x: 32, y: 36,
      },
      {
        id: 'spice-chest',
        name: 'A chest of cloves and pepper',
        note: 'Pepper and cloves grew far away and were worth their weight in silver by the time they reached Europe. That profit, not curiosity, paid for the ships.',
        source: 'wiki_dutchcape',
        x: 70, y: 60,
      },
    ],
  },
  {
    id: 'ch4',
    num: '4',
    title: 'The Ships Arrive',
    subtitle: 'Jan van Riebeeck, April 1652, and the Khoekhoe communities of Table Bay',
    mood: 'Three ships, one bay, and people already living there.',
    tint: { deep: '#16283a', mid: '#44708a', glow: '#a6c9de' },
    plate: 'era-table-bay.jpg',
    plateAlt: 'An illustration of three sailing ships entering a wide bay beneath a huge flat-topped mountain at dawn.',
    relics: [
      {
        id: 'logbook',
        name: 'Van Riebeeck’s journal',
        note: 'The commander kept a daily journal. Most of what we know about the first years at the Cape comes from one man’s careful, and one-sided, record.',
        source: 'wiki_riebeeck',
        x: 30, y: 52,
      },
      {
        id: 'cattle',
        name: 'A herd of long-horned cattle',
        note: 'The Khoekhoe people living around Table Bay were herders. They traded cattle and sheep with passing ships long before any fort was built.',
        source: 'wiki_riebeeck',
        x: 72, y: 66,
      },
    ],
  },
  {
    id: 'ch5',
    num: '5',
    title: 'Why Did They Build a Castle?',
    subtitle: 'The Castle of Good Hope, 1666 to 1679, and five bastions guarding a company’s power',
    mood: 'A five-pointed fortress built for a trading company, not a king.',
    tint: { deep: '#2f2115', mid: '#8a6440', glow: '#d8ae81' },
    plate: 'era-castle.jpg',
    plateAlt: 'An illustration of a pentagonal stone star fort with five pointed bastions on a flat coastal plain.',
    relics: [
      {
        id: 'cannon',
        name: 'A cannon on the Leerdam bastion',
        note: 'The five bastions were named Leerdam, Buuren, Catzenellenbogen, Nassau and Oranje. If you say those names out loud you can hear where the builders came from.',
        source: 'castle_history',
        x: 34, y: 44,
      },
      {
        id: 'keystone',
        name: 'A carved stone keystone',
        note: 'The Castle was built by hand from local stone and seashell lime. Enslaved people and soldiers did the hardest of that work.',
        source: 'castle_history',
        x: 66, y: 58,
      },
    ],
  },
  {
    id: 'ch6',
    num: '6',
    title: 'The Island of Many Stories',
    subtitle: 'Robben Island: exile, isolation, a prison of resisters, and a museum of freedom',
    mood: 'Seals, exiles, patients, prisoners and a museum, all on one small island.',
    tint: { deep: '#1c2723', mid: '#5b7360', glow: '#a9c4ac' },
    plate: 'era-island.jpg',
    plateAlt: 'An illustration of a low flat island seen across a cold grey sea, with a small limestone tower.',
    relics: [
      {
        id: 'gull-egg',
        name: 'A seabird’s egg',
        note: 'The island was named after the seals and the birds before it was ever used as a prison. Sailors used to stop there for eggs and fresh meat.',
        source: 'sa_robben_wiki',
        x: 72, y: 30,
      },
      {
        id: 'lime-quarry',
        name: 'A chip of limestone',
        note: 'Prisoners were made to work the island’s lime quarry. The chalk-white dust damaged their eyes and their lungs for the rest of their lives.',
        source: 'sa_robben_wiki',
        x: 32, y: 62,
      },
    ],
  },
  {
    id: 'ch7',
    num: '7',
    title: 'When the British Took the Cape',
    subtitle: 'Europe at war, British occupation, the return of the Dutch, and the sea road to India',
    mood: 'Flags change, but the sea road to India does not.',
    tint: { deep: '#331715', mid: '#94443e', glow: '#dda49c' },
    relics: [
      {
        id: 'flag',
        name: 'A folded flag',
        note: 'Between 1795 and 1806 the Cape changed hands three times. Each time a new flag went up, the same harbour below it stayed busy.',
        source: 'wiki_dutchcape',
        x: 34, y: 40,
      },
      {
        id: 'india-chart',
        name: 'A chart of the route to India',
        note: 'The Cape mattered because of a single line drawn on a map: the sea road from Europe to India. Everything else followed from that.',
        source: 'wiki_dutchcape',
        x: 68, y: 58,
      },
    ],
  },
  {
    id: 'ch8',
    num: '8',
    title: 'Kingdoms, Treks, Wars and Gold',
    subtitle: 'The Zulu and Basotho kingdoms, the Great Trek, diamonds, gold and the South African War',
    mood: 'Kingdoms rising, republics forming, and a war over gold.',
    tint: { deep: '#361c10', mid: '#a2562f', glow: '#e2a87e' },
    plate: 'era-gold.jpg',
    plateAlt: 'An illustration of a gold mining headframe on a dusty highveld ridge under a vast pale sky.',
    relics: [
      {
        id: 'brass-bangle',
        name: 'A brass bangle',
        note: 'Brass, glass and cloth were traded inland for cattle, ivory and hides. An object as small as a bangle could travel a thousand kilometres from the coast.',
        source: 'saho_boerwar',
        x: 68, y: 44,
      },
      {
        id: 'gold-nugget',
        name: 'A gold reef nugget',
        note: 'The gold found on the Witwatersrand in 1886 was not in a river. It was locked in rock deep underground, which is why so many men went down shafts.',
        source: 'saho_boerwar',
        x: 32, y: 60,
      },
    ],
  },
  {
    id: 'ch9',
    num: '9',
    title: 'One Country, But Not Equal',
    subtitle: 'The Union of 1910, the Natives Land Act, and the apartheid laws',
    mood: 'A new country was born, but its rules were very unfair.',
    tint: { deep: '#241f33', mid: '#6b5a80', glow: '#c0b0d6' },
    relics: [
      {
        id: 'land-act-page',
        name: 'A page of the 1913 Land Act',
        note: 'The Natives Land Act set aside roughly seven per cent of the country for the majority of its people. The numbers on the page are the cruel part.',
        source: 'saho_boerwar',
        x: 34, y: 42,
      },
      {
        id: 'pass-book',
        name: 'A pass book',
        note: 'A pass was a small book a Black South African had to carry and produce on demand. Not carrying it was a crime. This is what "a law that reaches into a pocket" means.',
        source: 'saho_boerwar',
        x: 68, y: 62,
      },
    ],
  },
  {
    id: 'ch10',
    num: '10',
    title: 'The Fight for Freedom',
    subtitle: 'Congress, protest, Sharpeville, Robben Island, Soweto and the release of Nelson Mandela',
    mood: 'Many people, many organisations, and a long road to freedom.',
    tint: { deep: '#33100f', mid: '#9a3a34', glow: '#e29b92' },
    plate: 'era-struggle.jpg',
    plateAlt: 'An illustration of a township skyline at dusk with lamps coming on and a violet sky.',
    relics: [
      {
        id: 'petition',
        name: 'A signed petition',
        note: 'The 1955 Freedom Charter was built out of thousands of ordinary suggestions collected door to door. It was written by many hands, not one.',
        source: 'sharpe_apartheid',
        x: 36, y: 44,
      },
      {
        id: 'ballot-poster',
        name: 'A hand-painted protest poster',
        note: 'Banners and posters were painted by hand, often at night, often by people who knew they might be arrested for carrying them.',
        source: 'sharpe_apartheid',
        x: 68, y: 66,
      },
    ],
  },
  {
    id: 'ch11',
    num: '11',
    title: 'A Country Chooses Democracy',
    subtitle: 'The 1994 election, the first Parliament for everyone, and a Constitution with a Bill of Rights',
    mood: 'One person, one vote, and a long line of patient voters.',
    tint: { deep: '#11261f', mid: '#37705c', glow: '#92c9ae' },
    plate: 'era-democracy.jpg',
    plateAlt: 'An illustration of an extraordinarily long queue of people winding across a dry field towards a distant polling station at dawn.',
    relics: [
      {
        id: 'ballot-ballot',
        name: 'A ballot paper',
        note: 'In April 1994 people queued for hours, some for a whole day, to put one cross on one piece of paper. It was the first election where every adult could vote.',
        source: 'ipu_1994',
        x: 34, y: 58,
      },
      {
        id: 'constitution',
        name: 'The Bill of Rights',
        note: 'Chapter 2 of the 1996 Constitution is the Bill of Rights. It is the part that says what the government may never do to you.',
        source: 'const_pdf',
        x: 70, y: 40,
      },
    ],
  },
  {
    id: 'ch12',
    num: '12',
    title: 'Our Country Today',
    subtitle: 'From 1994 to October 2026: presidents, progress, HIV, power, elections and open questions',
    mood: 'What we know, what is still uncertain, and what is still being decided.',
    tint: { deep: '#142433', mid: '#3f6d94', glow: '#9fc3e0' },
    plate: 'era-today.jpg',
    plateAlt: 'An illustration of a modern city beneath a flat-topped mountain at dawn, with a thin cloud spilling over the edge.',
    relics: [
      {
        id: 'load-chart',
        name: 'A load-shedding schedule',
        note: 'A timetable of when the power will go off. It is a very ordinary piece of paper that tells a very large story about electricity and who gets it.',
        source: 'gen_ref',
        x: 36, y: 40,
      },
      {
        id: 'newspaper',
        name: 'A newspaper from this week',
        note: 'History does not stop at the last page of a book. The final chapter is deliberately left open, because it is still being written.',
        source: 'bizt_2026',
        x: 68, y: 62,
      },
    ],
  },
  {
    id: 'epilogue',
    num: 'Epilogue',
    title: 'The Back Endpaper',
    subtitle: 'Your certificate, and the questions you have not asked yet',
    mood: 'The last page is a door, not a wall.',
    tint: { deep: '#2e2510', mid: '#a5842f', glow: '#e6cd7d' },
    /* No plate and no photograph on the endpaper, so there is nothing to hide
       an object in. The epilogue gives a certificate instead. */
    relics: [],
  },
];

export const ERA_BY_ID: Record<string, Era> = Object.fromEntries(ERAS.map((e) => [e.id, e]));

export const ALL_RELICS: EraRelic[] = ERAS.flatMap((e) => e.relics);

/** CSS custom properties for a chapter-scoped surface. */
export function eraVars(id: string): Record<string, string> {
  const era = ERA_BY_ID[id];
  if (!era) return {};
  return {
    '--era-deep': era.tint.deep,
    '--era-mid': era.tint.mid,
    '--era-glow': era.tint.glow,
  };
}
