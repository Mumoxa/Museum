// Data for the matching and ordering activities. Each entry is a fact the child can check
// against the chapter text, so puzzles reinforce the story rather than add new claims.

export interface MatchPair { left: string; right: string }
export interface MatchSet {
  id: string;
  prompt: string;
  rightLabel: string;
  pairs: MatchPair[];
  explain: string;
}

export const MATCH_SETS: Record<string, MatchSet> = {
  evidence: {
    id: 'evidence',
    prompt: 'Match each clue to the kind of evidence it gives us.',
    rightLabel: 'Kind of evidence',
    pairs: [
      { left: 'Shell beads with holes drilled through them, found in a cave layer', right: 'Archaeology' },
      { left: 'Painted animals and dancers on a rock shelter wall', right: 'Rock art' },
      { left: 'A story about a great flood, told by an elder', right: 'Oral history' },
      { left: 'A letter written by the Dutch company in 1652', right: 'Written record' },
    ],
    explain: 'Archaeology comes from digging up objects, rock art from painted walls, oral history from memory passed on by people, and written records from documents. Each kind can be checked against the others.',
  },
  trade: {
    id: 'trade',
    prompt: 'Match each need of a sea voyage with the reason it mattered.',
    rightLabel: 'Why it mattered',
    pairs: [
      { left: 'Fresh fruit and vegetables', right: 'Prevented scurvy on long voyages' },
      { left: 'Spices from Asia', right: 'Flavoured and preserved food, and sold for high prices' },
      { left: 'A sea route around Africa', right: 'Avoided expensive middlemen on land and sea' },
    ],
    explain: 'Fresh food stopped scurvy, spices were rare and valuable, and a sea route cut out middlemen. Those needs made the Cape a useful stopping point.',
  },
  rulers: {
    id: 'rulers',
    prompt: 'Match each power to the period when it governed the Cape.',
    rightLabel: 'Period',
    pairs: [
      { left: 'The Dutch East India Company (VOC)', right: '1652 to 1795' },
      { left: 'The first British occupation', right: '1795 to 1803' },
      { left: 'The Batavian Republic, under French influence', right: '1803 to 1806' },
      { left: 'The second British occupation, confirmed by treaty', right: '1806 to 1814' },
    ],
    explain: 'The Cape changed hands several times in a few decades. Each change was decided by wars and treaties in Europe, and each affected the people who lived here.',
  },
  presidents: {
    id: 'presidents',
    prompt: 'Match each President to the years they served.',
    rightLabel: 'Years served',
    pairs: [
      { left: 'Nelson Mandela', right: '1994 to 1999' },
      { left: 'Thabo Mbeki', right: '1999 to 2008' },
      { left: 'Kgalema Motlanthe', right: '2008 to 2009' },
      { left: 'Jacob Zuma', right: '2009 to 2018' },
      { left: 'Cyril Ramaphosa', right: '2018 onwards' },
    ],
    explain: 'Ramaphosa has served since 2018. His term is still continuing, so check a current source for the latest news.',
  },
};

export interface OrderSet {
  id: string;
  prompt: string;
  items: string[];   // in the correct order (earliest first)
  explain: string;
}

export const ORDER_SETS: Record<string, OrderSet> = {
  freedom: {
    id: 'freedom',
    prompt: 'Put these moments of the struggle in order, from earliest to latest.',
    items: [
      'The ANC is founded (1912)',
      'Sharpeville shootings (21 March 1960)',
      'Mandela is sentenced to life imprisonment (June 1964)',
      'Soweto uprising (16 June 1976)',
      'Mandela is released (11 February 1990)',
      'The first democratic election (27 April 1994)',
    ],
    explain: 'Each step led to the next. Protest, repression, armed resistance, uprising, international pressure and then negotiations all shaped the country we have today.',
  },
  recent: {
    id: 'recent',
    prompt: 'Put these events of recent South African history in order.',
    items: [
      'The first democratic election (27 April 1994)',
      'Nevirapine ruling by the Constitutional Court (5 July 2002)',
      'Cyril Ramaphosa becomes President (February 2018)',
      'The ANC loses its majority in Parliament (29 May 2024 election)',
    ],
    explain: 'All of these are confirmed events. Open questions about 2026 are not on this list, because their outcomes are not yet known.',
  },
};
