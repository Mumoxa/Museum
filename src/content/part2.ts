import type { Chapter } from './types';

const PHOTO = '/images/photos/';

export const part2: Chapter[] = [
  // ───────────────────────────── CHAPTER 4 ─────────────────────────────
  {
    id: 'ch4',
    num: '4',
    title: 'The Ships Arrive',
    subtitle: 'Jan van Riebeeck, April 1652, and the Khoekhoe communities of Table Bay',
    accent: '#3d5a6c',
    mood: 'Three ships, one bay, and people already living there.',
    sources: ['wiki_riebeeck', 's2a3', 'kids_riebeeck', 'saho_riebeeck', 'wiki_dutchcape', 'robben_kids'],
    quiz: [
      {
        q: 'Why did the Dutch East India Company set up a station at Table Bay in 1652?',
        options: ['To start a national parliament', 'To provide fresh water, vegetables and meat for passing ships', 'To mine diamonds', 'To fight the British army'],
        answer: 1,
        explain: 'The station was a supply point. It was not founded as a country. Its purpose was to help ships travelling between Europe and Asia.',
      },
      {
        q: 'What were the Khoekhoe communities doing near Table Bay when the Dutch arrived?',
        options: ['Living only in the mountains with no animals', 'Herding cattle and sheep, and trading with ships', 'Building a Dutch fort', 'Working in a gold mine'],
        answer: 1,
        explain: 'The Khoekhoe were herders with large numbers of cattle and sheep. They traded animals with the newcomers, and their grazing land became central to the conflict that followed.',
      },
      {
        q: 'What was one result of the Dutch settlement that changed the land permanently?',
        options: ['The land became a national park', 'Farms were granted to settlers, which took over grazing land used by the Khoekhoe', 'The Khoekhoe moved to Europe', 'The bay was closed to all ships'],
        answer: 1,
        explain: 'As settlers took land for farms, Khoekhoe grazing areas were lost. This led to conflict, including a war in 1659–1660.',
      },
    ],
    sides: [
      {
        kind: 'opener',
        title: 'The Ships Arrive',
        blocks: [
          { t: 'fig', src: PHOTO + 'table-mountain-camps-bay.jpg', alt: 'View from the top of Table Mountain over Camps Bay and the Atlantic Ocean.', caption: 'A view from the top of Table Mountain, over the Atlantic coast near Cape Town.', credit: 'Sumit Surai', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Cape_Town_-View_From_The_Table_Mountain.jpg' },
          { t: 'lead', text: 'Luchelle, imagine standing on Table Mountain in 1652. You see unfamiliar ships coming into the bay. But who was already living below the mountain?' },
          { t: 'anchor', when: '6 April 1652', where: 'Table Bay, at the south-western tip of Africa' },
        ],
      },
      {
        kind: 'page',
        title: 'Three ships and a mountain',
        blocks: [
          { t: 'p', text: 'On 6 April 1652, three ships of the Dutch East India Company (the VOC) sailed into Table Bay. Their leader was Jan van Riebeeck, a Dutch surgeon and merchant. The ships were the Drommedaris, the Goede Hoop and the Reijger.' },
          { t: 'p', text: 'Van Riebeeck had orders from the company. He was to build a fort, grow vegetables and fruit, and obtain cattle and sheep from the local people. In plain words, the company wanted a place where its ships could be restocked.' },
          { t: 'p', text: 'The people living around the bay were Khoekhoe communities, who had lived in this landscape for a very long time. They knew where the water was, which grazing was best, and how to move their herds with the seasons.' },
          { t: 'mum', text: 'Ask your child: when a visitor arrives at your home, what do you offer them first? Talk about why hospitality matters in many cultures, and how it can go well or badly.' },
        ],
      },
      {
        kind: 'page',
        title: 'A garden for ships',
        blocks: [
          { t: 'p', text: 'The newcomers needed food, and they needed it quickly. They began to plant gardens and grow grain, vegetables and fruit. By 28 April 1652, just three weeks after landing, they had chosen a site for a garden and started sowing seeds.' },
          { t: 'p', text: 'They also needed meat, and the easiest source was the herds of the Khoekhoe. At first, they traded: metal tools, tobacco, beads and other goods were exchanged for cattle and sheep. Both sides had their own reasons. The Khoekhoe wanted metal and trade goods. The Dutch wanted animals to feed ships’ crews.' },
          { t: 'fact', text: 'Autshumato, a Khoekhoe man known to the Dutch as Harry, worked as an interpreter and go-between for the newcomers. In 1658 the Dutch sent him to Robben Island. He escaped after about a year and a half.', source: 'robben_kids' },
        ],
      },
      {
        kind: 'page',
        title: 'Land, cattle and conflict',
        blocks: [
          { t: 'p', text: 'Trade quickly became harder. The settlement grew, and the Dutch began to want more land for farms. From 1657, some former company employees were allowed to take farms of their own, along the Liesbeek River and beyond.' },
          { t: 'p', text: 'Those farms included grazing lands that Khoekhoe families had used for generations. Animals were taken, people were pushed away from water, and tensions built up. Khoekhoe leaders resisted, and the Dutch used their guns and soldiers to protect the settlers.' },
          { t: 'p', text: 'There was armed conflict between the two peoples, including a war in 1659–1660. Historians describe it as an important turning point: the Khoekhoe were losing control of the land that had supported their way of life.' },
          { t: 'ask', text: 'Who do you think should decide who may use land? Try to explain your answer as if you were a Khoekhoe herder in 1657, and then as if you were a Dutch settler.' },
        ],
      },
      {
        kind: 'page',
        title: 'The people who were brought here',
        blocks: [
          { t: 'p', text: 'The settlement was not only about the Dutch and the Khoekhoe. From the 1650s onwards, the Dutch brought [[enslaved]] people to the Cape from their Asian territories, including Indonesia, India and Sri Lanka, as well as from Madagascar and East Africa.' },
          { t: 'p', text: 'These people were forced to build roads, houses and the Castle, to farm, cook, and care for households. They were treated as property. Their own names, families, languages and religions were often taken away or suppressed. Their descendants became part of the Cape’s many communities, and their histories are an important part of this story.' },
          { t: 'note', text: 'Slavery at the Cape lasted until 1834–1838, when Britain’s laws ended it, after the settlement had already been ruled by Britain for decades. Chapter 7 explains more.' },
        ],
      },
      {
        kind: 'interactive',
        title: 'Walk the coastline',
        blocks: [
          { t: 'p', text: 'Tap the points on the coast to find what each place meant to the newcomers, and to the people who were already there.' },
          { t: 'interactive', name: 'inkmap', title: 'The Cape coast', note: 'cape' },
        ],
      },
      {
        kind: 'quiz',
        title: 'Quick check',
        blocks: [
          { t: 'quiz' },
          { t: 'ask', text: 'Why do you think the Khoekhoe traded their animals at first? What were they hoping to gain?' },
        ],
      },
      {
        kind: 'handoff',
        title: 'Why build a castle?',
        blocks: [
          { t: 'mystery', text: 'Luchelle, the garden is growing and the settlement is getting bigger. But a shadow falls across the bay: other European ships are coming, and a strong stone wall is about to rise by the sea. Why would a company build a castle, in a place where no king lived?' },
          { t: 'tellmore', items: [
            { q: 'Was the Cape a colony in 1652?', a: 'Not at first. The company’s instructions described a refreshment station. Over time, the settlement grew, took land and governed people, so it became a colony. Historians debate exactly when that change happened, which is a good reminder that historical labels are sometimes simplifications.' },
            { q: 'Did Table Bay have only one name?', a: 'Places in southern Africa have had many names: those given by the people who lived there, by the Dutch, by the British, and by later governments. Many names are being restored or discussed today. The English name Table Bay refers to the mountain above it.' },
          ] },
        ],
      },
    ],
  },

  // ───────────────────────────── CHAPTER 5 ─────────────────────────────
  {
    id: 'ch5',
    num: '5',
    title: 'Why Did They Build a Castle?',
    subtitle: 'The Castle of Good Hope, 1666–1679, and five bastions guarding a company’s power',
    accent: '#6e4f35',
    mood: 'A five-pointed fortress built for a trading company, not a king.',
    sources: ['castle_artefacts', 'castle_history', 'castle_commons'],
    quiz: [
      {
        q: 'Why was the Castle of Good Hope built?',
        options: ['As a royal palace for a king who lived in Africa', 'As a fortress to protect the VOC’s power, its settlement, and its ships at the Cape', 'As a museum', 'As a prison for British soldiers'],
        answer: 1,
        explain: 'The Castle was built by the VOC, a company with soldiers and power to make treaties. It defended the settlement against rivals and was the centre of Dutch administration.',
      },
      {
        q: 'Why were the Castle’s five corners called bastions?',
        options: ['They were places where ships docked', 'They were angled corners of the fort that let defenders shoot along the walls and protect blind spots', 'They were churches', 'They were stables for horses'],
        answer: 1,
        explain: 'Bastions are pointed corners that allow defenders to fire along the walls. Each bastion also had its own store and garrison.',
      },
      {
        q: 'Who did much of the hard labour in building and running the Castle?',
        options: ['Only Dutch soldiers', 'Enslaved people, soldiers, workers and other labourers, many of them forced', 'Visiting British sailors', 'Nobody, it built itself'],
        answer: 1,
        explain: 'Enslaved and forced labourers were essential to building and maintaining the Castle. Its walls were built by people whose names were rarely recorded.',
      },
    ],
    sides: [
      {
        kind: 'opener',
        title: 'Why Did They Build a Castle?',
        blocks: [
          { t: 'fig', src: PHOTO + 'castle-main-entrance.jpg', alt: 'The main gateway of the Castle of Good Hope, with a carved pediment and Dutch coat of arms.', caption: 'The Castle’s main gateway, known as the Van der Stel Gate, built in 1682. Its carved coat of arms shows the Dutch Republic.', credit: 'Roché Petersen', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Castle_of_Good_Hope_Main_Entrance.jpg' },
          { t: 'lead', text: 'Luchelle, a royal castle is built for a king. This castle, in Cape Town, was built for a trading company, and that difference tells you almost everything about why it exists.' },
          { t: 'anchor', when: '1666 to 1679', where: 'Cape Town, on the shore of Table Bay' },
        ],
      },
      {
        kind: 'page',
        title: 'No king lived here',
        blocks: [
          { t: 'p', text: 'Why build a castle if no king lived inside it? The answer is that the Castle belonged to the [[VOC]]. The company was a business with huge power: it had ships, soldiers, money and the authority to make treaties and fight wars across the world.' },
          { t: 'p', text: 'In the 1660s, England and the Dutch Republic were rivals again. Ships and colonies were threatened by rivals who were also at war for trade. The company wanted a strong stone fortress at the Cape to protect its ships, its stores and its settlement from enemies, and also from threats it feared from local communities.' },
          { t: 'p', text: 'Work began on 2 January 1666, when the first stones were laid. Construction stopped and started many times, because the company often hesitated to spend money on it. It was finished in 1679.' },
        ],
      },
      {
        kind: 'page',
        title: 'Five bastions, one plan',
        blocks: [
          { t: 'p', text: 'The fort is shaped like a pentagon, a five-sided star, with a [[bastion]] at each corner. The angled bastions were designed so that defenders on the walls could cover the ground in front of the others. Each bastion also had its own garrison, its own ammunition store and its own workshops.' },
          { t: 'p', text: 'In 1679 the five bastions were named after titles of William III of Orange-Nassau, the Dutch Stadtholder. They are Leerdam, Buuren, Katzenellenbogen, Nassau and Oranje. Names like these told everyone that the fort belonged to a Dutch power and its princes.' },
          { t: 'fig', src: PHOTO + 'castle-of-good-hope.jpg', alt: 'A view of the Castle of Good Hope showing its stone walls.', caption: 'The Castle of Good Hope, Cape Town: the oldest surviving colonial building in South Africa.', credit: 'Michael Fu', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Castle_of_Good_Hope.jpg' },
          { t: 'fact', text: 'The Castle is the oldest surviving colonial building in South Africa, and it has stood on the same shore since the 1670s.', source: 'castle_history' },
        ],
      },
      {
        kind: 'page',
        title: 'Life inside the walls',
        blocks: [
          { t: 'p', text: 'The Castle was a whole town inside walls. It housed soldiers and sailors, officials and their families, a church, bakers, blacksmiths, stores of food and gunpowder, workshops and offices. It was the headquarters of the company’s government at the Cape.' },
          { t: 'p', text: 'Governors and officials ruled from here, collected taxes, decided who could buy land, and sent orders to farmers, traders and the people they controlled. Public announcements were once made from the famous balcony, the Kat, over the inner courtyard.' },
          { t: 'p', text: 'The Castle also held prisoners. Some were soldiers and sailors; others were enslaved or punished for disobeying company rules. Its cells and courts show how a colonial power used force to keep order.' },
          { t: 'ask', text: 'If you lived inside this fort in 1700, which job would you have been given? Would you have had any choice?' },
        ],
      },
      {
        kind: 'page',
        title: 'Who built it?',
        blocks: [
          { t: 'p', text: 'Stone walls do not build themselves. Much of the labour came from enslaved people and forced labourers, as well as from soldiers and company workers. Their names are rarely recorded in the official records, which makes them harder to remember today.' },
          { t: 'p', text: 'When you walk around the Castle now, remember that its beauty and strength were built by many people who had no say in why it was built, and who were not free to leave. History is not only about who gave the orders.' },
          { t: 'mum', text: 'Walk round your neighbourhood or a school and ask: who built this, and whose names are written down? Talk about how historians search for names that were left out.' },
        ],
      },
      {
        kind: 'interactive',
        title: 'Inside the five-point fortress',
        blocks: [
          { t: 'p', text: 'Tap each bastion on the plan to see what it did. This plan is a simplified diagram to help you see the military logic, not an exact survey.' },
          { t: 'interactive', name: 'castle', title: 'The five bastions' },
        ],
      },
      {
        kind: 'quiz',
        title: 'Quick check',
        blocks: [
          { t: 'quiz' },
          { t: 'mum', text: 'Ask: what would you build to protect something that mattered a lot to you? What would you need to make it strong?' },
        ],
      },
      {
        kind: 'handoff',
        title: 'The island in the bay',
        blocks: [
          { t: 'mystery', text: 'From the Castle walls, you can see a low island in the bay, flat and quiet in the sun. Its name means "seals" in Dutch. Over the centuries, the island would hold many people whose stories needed to be heard.' },
          { t: 'tellmore', items: [
            { q: 'Why was the Castle still important after the British arrived?', a: 'It remained the seat of government and military power at the Cape. Under British rule it continued to be a military base for many years. Its walls still stand in the city, and the buildings now house museums.' },
            { q: 'What does VOC stand for?', a: 'Verenigde Oost-Indische Compagnie, the Dutch United East India Company. It was founded in 1602 and was among the largest trading companies of its time.' },
          ] },
        ],
      },
    ],
  },

  // ───────────────────────────── CHAPTER 6 ─────────────────────────────
  {
    id: 'ch6',
    num: '6',
    title: 'The Island of Many Stories',
    subtitle: 'Robben Island: exile, isolation, a prison of resisters, and a museum of freedom',
    accent: '#4d5e4f',
    mood: 'Seals, exiles, patients, prisoners and a museum, all on one small island.',
    sources: ['sa_robben_wiki', 'robben_kids', 'robben_history', 'robben_museum_tour', 'robben_unesco'],
    quiz: [
      {
        q: 'Why is the island called Robben Island?',
        options: ['Because of its many robbers', 'Because "robben" is the Dutch word for seals, and seals once lived there', 'Because it was once a robbery base', 'Because it is shaped like a robin'],
        answer: 1,
        explain: 'Robben is Dutch for seals. The island’s name comes from the seals that once lived on its shores.',
      },
      {
        q: 'Why was Nelson Mandela held on Robben Island?',
        options: ['He was a visiting sailor', 'He was a political prisoner who opposed apartheid, and was sentenced to life imprisonment in 1964', 'He ran a school there', 'He was a tourist'],
        answer: 1,
        explain: 'Mandela was convicted after the Rivonia Trial and sentenced to life imprisonment in 1964. He was held on Robben Island from 1964 to 1982.',
      },
      {
        q: 'Which statement about the island’s history is most accurate?',
        options: ['It was only a prison', 'It has been used for many purposes over centuries: exile, a leprosy settlement, military use, a prison, and now a museum and World Heritage Site', 'It has never had people living on it', 'It was a holiday camp'],
        answer: 1,
        explain: 'Robben Island has a long, complicated history. Each period tells a different part of the story of the country.',
      },
    ],
    sides: [
      {
        kind: 'opener',
        title: 'The Island of Many Stories',
        blocks: [
          { t: 'fig', src: PHOTO + 'cape-town-robben-island.jpg', alt: 'Cape Town seen from Table Mountain, with Robben Island in the bay.', caption: 'Robben Island lies in Table Bay, about seven kilometres from Cape Town. It is the small island on the left.', credit: 'Andreas Tusche', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Cape_Town_and_Robben_Island_seen_from_Table_Mountain.jpg' },
          { t: 'lead', text: 'Luchelle, the island is low and flat, but it has held exiles, patients, soldiers and political prisoners. Its story is one of the most important in this book.' },
          { t: 'anchor', when: 'From the 1600s to today', where: 'Robben Island, Table Bay' },
        ],
      },
      {
        kind: 'page',
        title: 'The seals, and the first exiles',
        blocks: [
          { t: 'p', text: 'Sailors who passed the Cape gave the island its Dutch name, Robben, for the seals that lived on its shores. Ships often anchored nearby, and the island was used for many purposes.' },
          { t: 'p', text: 'In 1658, the Dutch sent Autshumato, a Khoekhoe interpreter, to the island after a dispute with the Dutch authorities. He spent about a year and a half there before escaping by boat.' },
          { t: 'p', text: 'Over the centuries, many other people were sent to the island as punishment or exile. Among them were African leaders who resisted colonial rule, including Makhanda (also known as Nxele), a Xhosa leader who drowned in 1819 while trying to swim back to the mainland.' },
          { t: 'ask', text: 'Why might a government decide to send a person to an island, rather than to a prison in a city? What do you think that does to the people who are sent there?' },
        ],
      },
      {
        kind: 'page',
        title: 'A settlement for people with leprosy',
        blocks: [
          { t: 'p', text: 'In the 1800s, the island was used as a settlement for people with [[leprosy]]. Leprosy is now curable, but at the time it was poorly understood and feared. People with the disease were often separated from families and sent away to places like this.' },
          { t: 'p', text: 'The settlement was an isolated community with its own hospital, village and graves. It closed in 1931, after many decades of use. Those who lived there deserve to be remembered with compassion, not fear.' },
          { t: 'note', text: 'Some graves on the island belong to people who were sent there because of their illness. Visitors are asked to remember them with respect.' },
        ],
      },
      {
        kind: 'page',
        title: 'A maximum-security prison',
        blocks: [
          { t: 'p', text: 'In 1961, the South African government turned the island into a [[maximum security]] prison for political opponents of apartheid. Hundreds of people from the African National Congress, the Pan Africanist Congress and other movements were held here over three decades.' },
          { t: 'p', text: 'Prisoners worked in the island’s limestone quarry, breaking rock in the sun. The rules were strict. Prisoners were kept apart from each other and were often separated by the sections of the prison.' },
          { t: 'p', text: 'Nelson Mandela was held here from 1964 to 1982, for eighteen of the twenty-seven years he spent in prison. He was held in cell 5 of Section B. The cell is small, with a sleeping mat, a bucket and a little window. Mandela later wrote that the prison became a kind of university, where prisoners taught each other languages, history and politics.' },
          { t: 'fig', src: PHOTO + 'mandela-cell-schavda.jpg', alt: 'A bare prison cell with a bed on the floor on Robben Island.', caption: 'A prison cell in Section B of the Robben Island prison, where Nelson Mandela was held.', credit: 'Schavda', license: 'CC BY-SA 3.0', url: "https://commons.wikimedia.org/wiki/File:Nelson_Mandela's_cell-Robben_Island.jpg" },
        ],
      },
      {
        kind: 'page',
        title: 'From prison to museum',
        blocks: [
          { t: 'p', text: 'The last political prisoners left the island in 1991, and the prison closed in 1996. Robben Island Museum was established in 1997. Today, tours are often led by former political prisoners, who explain their own experiences.' },
          { t: 'p', text: 'In 1999, the island was inscribed as a UNESCO World Heritage Site. That status recognises it as a place of universal value, a symbol of the struggle against oppression, and of reconciliation.' },
          { t: 'fact', text: 'Robben Island was used for many purposes over the centuries, including as a military post during the Second World War. Each of these periods left traces in the landscape.', source: 'sa_robben_wiki' },
        ],
      },
      {
        kind: 'interactive',
        title: 'Explore the island',
        blocks: [
          { t: 'p', text: 'Tap the markers on the photograph, or the periods in the timeline, to explore the island’s story across the centuries.' },
          { t: 'interactive', name: 'robben', title: 'Robben Island, layer by layer' },
        ],
      },
      {
        kind: 'quiz',
        title: 'Quick check',
        blocks: [
          { t: 'quiz' },
          { t: 'mum', text: 'Read the Mandela cell text together. Talk about why it matters that places of suffering are kept as museums and memorials.' },
        ],
      },
      {
        kind: 'handoff',
        title: 'Redcoats in the bay',
        blocks: [
          { t: 'mystery', text: 'Luchelle, the next visitors to the bay will not be sailors from the Netherlands. They wear red coats, and they arrive with cannons, to take the Cape for a second time, and then keep it.' },
          { t: 'tellmore', items: [
            { q: 'What is a political prisoner?', a: 'Someone imprisoned because of their political beliefs or actions, usually for opposing a government, rather than for a crime such as theft. Many political prisoners in South Africa were jailed under laws that were used against peaceful protest as well as armed resistance.' },
            { q: 'Why did the island matter to people outside South Africa?', a: 'Because it was a symbol of injustice. International campaigns calling for the release of political prisoners drew attention to the island. The later decision to keep it as a museum and World Heritage Site reflects its global significance.' },
          ] },
        ],
      },
    ],
  },

  // ───────────────────────────── CHAPTER 7 ─────────────────────────────
  {
    id: 'ch7',
    num: '7',
    title: 'When the British Took the Cape',
    subtitle: 'Europe at war, British occupation, the return of the Dutch, and the sea road to India',
    accent: '#7b3f3a',
    mood: 'Flags change, but the sea road to India does not.',
    sources: ['wiki_dutchcape', 'castle_history'],
    quiz: [
      {
        q: 'Why did Britain want the Cape in 1795?',
        options: ['To find gold', 'To keep the sea route to India and Asia out of French hands during the wars in Europe', 'To build a holiday resort', 'To return the Castle to the Portuguese'],
        answer: 1,
        explain: 'The Cape controlled the sea road to India. When France took over the Dutch Republic, Britain feared France would gain the Cape.',
      },
      {
        q: 'What happened to the Cape at the Treaty of Amiens in 1803?',
        options: ['It became independent', 'It was returned to the Batavian Republic (a Dutch-led state under French influence)', 'It was given to Portugal', 'It was given to the Khoekhoe'],
        answer: 1,
        explain: 'Under the Treaty of Amiens, Britain handed the Cape back to the Batavian Republic. The peace did not last, and Britain returned in 1806.',
      },
      {
        q: 'Did the Khoekhoe, San and enslaved people have a say in these changes?',
        options: ['Yes, they signed every treaty', 'No, they were not parties to the treaties, and their lives were changed by decisions made in Europe and Cape Town', 'Yes, they ran the government', 'It did not matter to them'],
        answer: 1,
        explain: 'Treaties between European powers decided who ruled the Cape. The people living there were affected, even though they did not take part in those decisions.',
      },
    ],
    sides: [
      {
        kind: 'opener',
        title: 'When the British Took the Cape',
        blocks: [
          { t: 'fig', src: PHOTO + 'castle-front-entrance.jpg', alt: 'The front entrance of the Castle of Good Hope in Cape Town.', caption: 'The front entrance to the Castle of Good Hope. The Castle changed hands several times in the years covered by this chapter.', credit: 'Debbielouise', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:The_Castle_of_Good_Hope_Cape_Town_-_Front_Entrance_to_the_Castle_2.JPG' },
          { t: 'lead', text: 'Luchelle, imagine the flag over the Castle changing three times in just over ten years. Who was really in charge, and why did it keep changing?' },
          { t: 'anchor', when: '1795 to 1814', where: 'Cape Town and the Cape Colony' },
        ],
      },
      {
        kind: 'page',
        title: 'Europe at war',
        blocks: [
          { t: 'p', text: 'In the 1790s, France was in revolution, and then at war with much of Europe. The French forces took over the Dutch Republic in 1795 and set up a new state called the [[Batavian Republic]], which followed French direction.' },
          { t: 'p', text: 'Britain was at war with France. British leaders were worried that France, through its Dutch allies, would take the Cape. That would give the French control of the sea road to India, which Britain depended on for trade and power.' },
          { t: 'p', text: 'These long conflicts are known as the [[Napoleonic Wars]]. Their effects reached far beyond Europe, and the Cape was one of the places where they were felt most strongly.' },
        ],
      },
      {
        kind: 'page',
        title: 'The changing flags',
        blocks: [
          { t: 'p', text: 'British forces landed near False Bay and defeated Dutch defenders at the Battle of Muizenberg. The Cape was occupied on 7 August 1795. The Dutch administration did not disappear, but British authority now stood above it.' },
          { t: 'p', text: 'Under the Treaty of Amiens in 1802, Britain returned the Cape to the Batavian Republic. The handover took place on 1 March 1803. The peace did not last. War between Britain and France resumed in May 1803.' },
          { t: 'p', text: 'In January 1806, British forces returned and defeated the Dutch and French defenders at the Battle of Blaauwberg, on 8 January 1806. The occupation lasted until a treaty in 1814 confirmed the transfer of sovereignty to Britain.' },
          { t: 'fact', text: 'Between 1795 and 1814, control of the Cape changed hands several times. The British first occupied it in 1795, returned it in 1803, and retook it in 1806.', source: 'wiki_dutchcape' },
        ],
      },
      {
        kind: 'page',
        title: 'Why the Cape mattered',
        blocks: [
          { t: 'p', text: 'The Cape was a strategic point. Ships travelling to India, Ceylon and the East Indies had to pass it, and a fleet based there could protect that route, or disrupt a rival’s trade.' },
          { t: 'p', text: 'For Britain, controlling the Cape was about protecting its trade and its power in Asia. For the people living in the Cape, it meant new laws, new officials, and a new language of government: English.' },
          { t: 'ask', text: 'If your city changed its ruler three times in ten years, what would the people in your town want most? What would stay the same?' },
        ],
      },
      {
        kind: 'page',
        title: 'Life under new rules',
        blocks: [
          { t: 'p', text: 'Under British rule, the Cape’s government changed. English became the language of administration and courts, and British officials took up posts that had previously been held by Dutch officials.' },
          { t: 'p', text: 'Britain abolished slavery across its empire. The law passed in 1833 meant that enslaved people in the Cape were to be freed in 1834, but many were made to work as "apprentices" for several more years, until 1838. It was a freedom with many limits.' },
          { t: 'p', text: 'For the Khoekhoe, the San and many others, the changes did not bring equal land or equal rights. Frontier conflicts continued, and the Cape’s eastern boundary, where Xhosa communities lived, was a place of repeated wars.' },
          { t: 'note', text: 'Remember: the people who lived in the Cape were not silent bystanders. They resisted, negotiated, worked for better terms, and sometimes collaborated with the new rulers.' },
        ],
      },
      {
        kind: 'interactive',
        title: 'Who was in charge?',
        blocks: [
          { t: 'p', text: 'Match each power with the period when it governed the Cape. Think about how each change affected the people who lived there.' },
          { t: 'interactive', name: 'match', title: 'Rulers at the Cape', note: 'rulers' },
        ],
      },
      {
        kind: 'quiz',
        title: 'Quick check',
        blocks: [
          { t: 'quiz' },
          { t: 'mum', text: 'Talk about a time someone else decided something important for your family. How did that feel? Why might it be harder for people who had no vote or voice?' },
        ],
      },
      {
        kind: 'handoff',
        title: 'The kingdoms beyond the mountains',
        blocks: [
          { t: 'mystery', text: 'Luchelle, the Cape was not the whole country, and the British were not the only ones with ambitions. Far to the north-east, a young man named Shaka is growing up among the Zulu, and within a few years he will lead one of the most powerful armies in southern Africa. Beyond the mountains, the Basotho and the Xhosa are watching the newcomers too. Turn the page and see what happens next.' },
          { t: 'tellmore', items: [
            { q: 'What was the Batavian Republic?', a: 'A state set up in 1795 by French-backed Dutch revolutionaries, which replaced the old Dutch Republic. It was closely tied to France, and it ruled the Cape briefly between 1803 and 1806.' },
            { q: 'Why did Britain keep the Cape after 1814?', a: 'The Cape was valuable for its harbour, its position on the sea route to India, and its agricultural land. Britain formally took control through the 1814 agreement, and the colony became an important part of the British Empire.' },
          ] },
        ],
      },
    ],
  },
];
