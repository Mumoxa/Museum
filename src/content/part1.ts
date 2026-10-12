import type { Chapter } from './types';

const PHOTO = `${import.meta.env.BASE_URL}images/photos/`;

export const part1: Chapter[] = [
  // ───────────────────────────── PROLOGUE ─────────────────────────────
  {
    id: 'prologue',
    num: 'Prologue',
    title: 'The Magic History Book',
    subtitle: 'A book that remembers everything, and a compass that points to the past',
    accent: '#8a6a2b',
    mood: 'A dusty book, a compass, and one question.',
    sources: ['sanparks_rhino'],
    quiz: [
      {
        q: 'What is the central question of this whole book?',
        options: ['When did the first ships reach the Cape?', 'Who lived here before South Africa was called South Africa?', 'Who won the 1994 election?', 'How tall is Table Mountain?'],
        answer: 1,
        explain: 'Every chapter comes back to that question. The answer is that many peoples lived here for a very long time before the name South Africa existed.',
      },
      {
        q: 'Why is it useful to ask "Who wrote this down?"',
        options: ['Because every story is untrue', 'Because different people can remember the same event differently, so we check evidence', 'Because only kings wrote history', 'Because it makes the book longer'],
        answer: 1,
        explain: 'Historians compare sources. A soldier, a farmer, a child and a government official may describe the same day in very different ways.',
      },
    ],
    sides: [
      {
        kind: 'opener',
        title: 'The Magic History Book',
        blocks: [
          { t: 'fig', src: PHOTO + 'cape-town-robben-island.jpg', alt: 'Cape Town and the sea from Table Mountain, with Robben Island visible as a small island on the left.', caption: 'Cape Town from the top of Table Mountain. Robben Island is the small island on the left, out in Table Bay.', credit: 'Andreas Tusche', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Cape_Town_and_Robben_Island_seen_from_Table_Mountain.jpg' },
          { t: 'lead', text: 'Luchelle, the book was waiting on the top shelf, under a dust cover the colour of strong tea.' },
          { t: 'anchor', when: 'Today', where: 'Your bookshelf' },
          { t: 'mystery', text: 'When you opened it, the pages were blank for a moment. Then a compass drew itself across the first page, and the words began to appear.' },
        ],
      },
      {
        kind: 'page',
        title: 'The first question',
        blocks: [
          { t: 'p', text: 'The first page said one line, in gold letters that seemed to glow: "Who lived here before South Africa was called South Africa?"' },
          { t: 'p', text: 'Luchelle, that is a question that many clever people have spent their lives trying to answer. The short answer is: many different peoples, in many different places, for a very, very long time.' },
          { t: 'p', text: 'The name South Africa is quite recent. It became the name of a single country in 1910, when several British colonies came together to form the [[Union of South Africa]]. Long before that, there were hunters, herders, farmers, ironworkers, traders and kings, all living on this land.' },
          { t: 'fact', text: 'People have lived in southern Africa for much longer than in any other part of the world that we know about. Some of the oldest evidence of modern human behaviour is found in the Western Cape.', source: 'blombos_henshilwood' },
        ],
      },
      {
        kind: 'page',
        title: 'How this book works',
        blocks: [
          { t: 'p', text: 'This is a book you can turn. Click the corner of a page, press the arrow keys, or swipe on a phone or tablet. Your place is saved on this device, so you can close the book and come back later.' },
          { t: 'p', text: 'Some words are underlined with a dotted line. Tap one, and the book will explain it in plain words. Some pages have a small "sources" button where you can see where the facts came from.' },
          { t: 'p', text: 'You can ask the book to read aloud to you. You can also switch on a simpler reading mode, with no page-turning, if you prefer.' },
          { t: 'mum', text: 'Read the first two pages together. Ask your child: which question do you most want the book to answer?' },
        ],
      },
      {
        kind: 'page',
        title: 'Three detective rules',
        blocks: [
          { t: 'p', text: 'Historians are a little like detectives. They work from clues, and they follow three simple rules.' },
          { t: 'h', text: 'Rule 1: Look for evidence' },
          { t: 'p', text: 'Evidence can be a broken clay pot, a painting on a rock, a bead, or a letter written 300 years ago. Each piece of evidence tells us something, but rarely everything.' },
          { t: 'h', text: 'Rule 2: Ask who made the record' },
          { t: 'p', text: 'A record is made by somebody, for a reason. A government report, a newspaper, a family story and a painting can all describe the same day differently.' },
          { t: 'h', text: 'Rule 3: Be honest about gaps' },
          { t: 'p', text: 'Sometimes the evidence is missing. A good historian says "we do not know" rather than guessing. You will see those words in this book, and that is a good sign.' },
          { t: 'ask', text: 'What is one thing in your home that a historian might find in a thousand years, and what would they wrongly guess about it?' },
        ],
      },
      {
        kind: 'interactive',
        title: 'Set the time-compass',
        blocks: [
          { t: 'p', text: 'The compass in the book can point to any era. Turn the dial, and the needle will show where you are going next.' },
          { t: 'interactive', name: 'compass', title: 'The time-compass' },
        ],
      },
      {
        kind: 'handoff',
        title: 'The mystery at the end of the page',
        blocks: [
          { t: 'mystery', text: 'Luchelle, the compass has stopped pointing at the past of the land. It is pointing down, to a mountain, and a shining shape hidden inside it. Turn the page and follow the needle.' },
          { t: 'tellmore', items: [
            { q: 'Why do historians say "before South Africa"?', a: 'Because the country called South Africa took its present form only in 1910 (as the Union) and later as a republic. The land, and the people on it, existed long before those names. Historians often write about "southern Africa" for the wider region, which is a better way to describe the many places and peoples before the modern borders.' },
            { q: 'What is "oral history"?', a: 'It is the memory of people who passed their knowledge on by speech, song and story. It is an important kind of evidence, and it can be checked against archaeology, rock art and written records. See the glossary term [[oral history]].' },
          ] },
        ],
      },
    ],
  },

  // ───────────────────────────── CHAPTER 1 ─────────────────────────────
  {
    id: 'ch1',
    num: '1',
    title: 'Before There Was South Africa',
    subtitle: 'Deep human history, stone tools, ochre paint, rock art and the first herders',
    accent: '#6b5b3a',
    mood: 'Caves by the sea, painted walls, and very old tools.',
    sources: ['blombos_henshilwood', 'blombos_conversation', 'blombos_guardian', 'blombos_britannica', 'robben_kids'],
    quiz: [
      {
        q: 'How do we know what happened more than 100,000 years ago, before anyone wrote things down?',
        options: ['Someone must have guessed', 'By digging up and dating objects, and by studying rock art and oral history', 'From the names of modern cities', 'We do not know anything about it'],
        answer: 1,
        explain: 'Archaeologists dig carefully and date layers of soil and objects. They combine this with rock art and with oral history, which is checked against other evidence.',
      },
      {
        q: 'Why were the shell beads and engraved ochre at Blombos Cave so important?',
        options: ['They show that people were making symbols and ornaments tens of thousands of years ago', 'They prove that the cave was used for a shop', 'They are copies from Europe', 'They are only 300 years old'],
        answer: 0,
        explain: 'Decorated objects and marks suggest symbolic thinking. Beads and engraved ochre are some of the earliest evidence for that kind of behaviour anywhere.',
      },
      {
        q: 'Which statement best describes the people of southern Africa before 1652?',
        options: ['They were all the same group with one way of life', 'They were many different communities, with hunter-gatherers, herders, farmers and ironworkers living in different places and at different times', 'They had no leaders, no trade and no stories', 'They lived only in the far north'],
        answer: 1,
        explain: 'The past is not a single ladder. Several ways of life existed side by side, and they overlapped, traded and sometimes fought.',
      },
    ],
    sides: [
      {
        kind: 'opener',
        title: 'Before There Was South Africa',
        blocks: [
          { t: 'fig', src: PHOTO + 'blombos-lithic-industries.jpg', alt: 'Photograph of stone tools and flakes from Blombos Cave.', caption: 'Stone tools from the Middle Stone Age levels at Blombos Cave, Western Cape, dated to about 105,000–90,000 years ago.', credit: 'Katja Douze, Sarah Wurz and Christopher S. Henshilwood', license: 'CC BY 4.0', url: 'https://commons.wikimedia.org/wiki/File:Lithic_Industries_at_Blombos_Cave,_Southern_Cape,_South_Africa_(c._105_%E2%80%93_90_Ka).jpg' },
          { t: 'lead', text: 'Luchelle, imagine a cave on a cliff above the sea. The tide is coming in. Inside, somebody is grinding red earth into powder, mixing it with something, and carefully making a paint.' },
          { t: 'anchor', when: 'More than 100,000 years ago', where: 'Blombos Cave, southern Cape coast' },
        ],
      },
      {
        kind: 'page',
        title: 'How do we know?',
        blocks: [
          { t: 'p', text: 'Imagine trying to learn about your grandmother’s childhood, when nobody wrote anything down. You would ask family members, look at old photographs and find old objects in a box. Scientists use very similar methods to learn about people who lived tens of thousands of years ago.' },
          { t: 'p', text: 'The main tool is [[archaeology]]. Archaeologists dig in layers, like the pages of a very slow book, and record exactly where each object was found. They date the layers using scientific methods, and they study tools, bones, seeds and paint.' },
          { t: 'p', text: 'Another kind of evidence is rock art, the paintings and engravings on cave walls and rock shelters. Then there is [[oral history]], the stories and knowledge that families and communities have passed down by speaking and singing. Historians treat oral history carefully, checking it against the other evidence.' },
          { t: 'mum', text: 'Ask your child what they would dig up first if they had a special dig in the garden. Then talk about why the layers closest to the surface are usually the newest.' },
        ],
      },
      {
        kind: 'page',
        title: 'Blombos Cave',
        blocks: [
          { t: 'p', text: 'Blombos Cave sits on the southern Cape coast, near Still Bay. For more than a hundred thousand years, people came to this place to make stone tools, cook, and eat shellfish from the sea.' },
          { t: 'p', text: 'Some of the most surprising finds are small, but powerful. Scientists found shell beads, with holes carefully drilled through them, that are about 75,000 years old. Some of these shells still carry traces of red [[ochre]].' },
          { t: 'p', text: 'They also found pieces of ochre with carefully engraved, geometric patterns. Those patterns were made on purpose, and they are among the earliest known examples of marks that seem to carry meaning. In older layers, about 100,000 years ago, people even had a paint kit: ochre, bone and shell containers, and a substance that helped the paint stick.' },
          { t: 'fact', text: 'A cross-hatched drawing on a small stone flake at Blombos is about 73,000 years old. Scientists believe it may be the oldest known drawing made by a human.', source: 'blombos_conversation' },
        ],
      },
      {
        kind: 'page',
        title: 'The painters of the rocks',
        blocks: [
          { t: 'p', text: 'Later, many communities in southern Africa made rock paintings. Across the Drakensberg mountains, in the Western Cape and in the north, painted shelters show animals such as eland, people in lively poses, and patterns in red, white and black.' },
          { t: 'p', text: 'Many of these paintings were made by the [[San]] communities, who were hunter-gatherers. They knew the land very well: where water was, when the plants were ripe, and where animals gathered. Many paintings seem to show dancing, ceremonies and healing, and some researchers link them to spiritual experiences.' },
          { t: 'p', text: 'The San were not "the past" of southern Africa in a way that disappeared. Their languages, knowledge and descendants continue today. Many San communities ask that they be named by the community names they use themselves.' },
          { t: 'ask', text: 'If a rock painting is 2,000 years old, what would you want to know about the person who made it? Which of your questions could a scientist answer, and which would stay a mystery?' },
        ],
      },
      {
        kind: 'page',
        title: 'Herders, farmers and ironworkers',
        blocks: [
          { t: 'p', text: 'Over the last few thousand years, new ways of living arrived and spread. Some communities kept large herds of cattle and sheep. These [[pastoralist]] communities, including the [[Khoekhoe]], moved with their animals to find good grazing and water.' },
          { t: 'p', text: 'Other communities grew crops and made iron tools. Archaeologists call this period the [[Iron Age]]. Farming and ironworking communities spread across much of the region over many centuries, bringing new skills, new trade and new towns.' },
          { t: 'p', text: 'This is the important point, Luchelle: these ways of living did not replace one another in one neat line. Hunter-gatherers, herders and farmers lived side by side, traded with each other, married into each other’s families and sometimes competed for land.' },
          { t: 'note', text: 'Historians now describe southern Africa’s past as a network of many communities rather than a single line of progress.' },
        ],
      },
      {
        kind: 'interactive',
        title: 'What kind of evidence is it?',
        blocks: [
          { t: 'p', text: 'Match each clue with the kind of evidence it gives us. Some clues fit more than one category, so think about what each one can tell us best.' },
          { t: 'interactive', name: 'match', title: 'Evidence detective', note: 'evidence' },
        ],
      },
      {
        kind: 'quiz',
        title: 'Quick check',
        blocks: [
          { t: 'quiz' },
          { t: 'ask', text: 'Scientists say the Blombos patterns were made on purpose. How could they know that, when nobody left a written note?' },
          { t: 'mum', text: 'Talk together about one object you own that would tell a future historian something about your life.' },
        ],
      },
      {
        kind: 'handoff',
        title: 'A golden secret under a hill',
        blocks: [
          { t: 'mystery', text: 'Luchelle, in the far north, there is a flat-topped hill where a kingdom once looked down on the rivers. Its people buried their leaders with treasures. One treasure was small enough to hold in your hand, and it was made of gold.' },
          { t: 'tellmore', items: [
            { q: 'How do scientists date very old things?', a: 'They use several methods, including radiocarbon dating for once-living material such as charcoal, shell and bone, and luminescence dating for sand and sediment that was last exposed to sunlight. Each method has limits, so scientists check results against each other.' },
            { q: 'Why is Blombos so famous?', a: 'Because it has several different kinds of symbolic evidence in the same sequence of layers: beads, engraved ochre, paint-making equipment and a drawing. Together, they show that symbolic behaviour had deep roots in this region.' },
          ] },
        ],
      },
    ],
  },

  // ───────────────────────────── CHAPTER 2 ─────────────────────────────
  {
    id: 'ch2',
    num: '2',
    title: 'Kings, Kingdoms and Communities',
    subtitle: 'The hill of the jackal, the golden rhinoceros, and many nations across the land',
    accent: '#7a5a22',
    mood: 'A hill of golden secrets and kingdoms that traded across the world.',
    sources: ['mapungubwe_kids', 'sanparks_rhino', 'globe_mapungubwe'],
    quiz: [
      {
        q: 'What does the name Mapungubwe mean?',
        options: ['Golden rhino', 'Hill of the jackal', 'Place of salt', 'River of gold'],
        answer: 1,
        explain: 'Mapungubwe is usually explained as "hill of the jackal" (or "place of jackals"), from Sesotho and Venda words.',
      },
      {
        q: 'Why did people leave the hill of Mapungubwe around 1300?',
        options: ['A foreign army defeated them', 'Drier, colder conditions and changing trade made farming and living there harder', 'They were tired of gold', 'The rhinos chased them away'],
        answer: 1,
        explain: 'Scientists think that climate change, drought and shifting trade routes made the hill harder to live on, so people spread out to new places.',
      },
      {
        q: 'Why is a map like the Mapungubwe map a snapshot, not a permanent border?',
        options: ['Because borders on modern maps were not there in the same way, and kingdoms changed shape over time', 'Because maps are always wrong', 'Because there were no borders anywhere on earth', 'Because the maps were drawn by children'],
        answer: 0,
        explain: 'Kingdoms and communities expanded, shrank and moved. Modern borders, such as those of South Africa, did not exist when the kingdoms did.',
      },
    ],
    sides: [
      {
        kind: 'opener',
        title: 'Kings, Kingdoms and Communities',
        blocks: [
          { t: 'fig', src: PHOTO + 'mapungubwe-hill.jpg', alt: 'Mapungubwe Hill, a flat-topped hill in the Limpopo landscape, seen from the north.', caption: 'Mapungubwe Hill, seen from the north, in the Limpopo Valley near where South Africa meets Botswana and Zimbabwe.', credit: 'Marius Loots', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Mapungubwe_hill_limpopo.jpg' },
          { t: 'lead', text: 'Luchelle, a hill with a flat top rises from the flat land of the Limpopo Valley. Long ago, a whole kingdom lived around its slopes.' },
          { t: 'anchor', when: 'About 900–1300 CE', where: 'The Limpopo Valley, northern South Africa' },
        ],
      },
      {
        kind: 'page',
        title: 'The hill of the jackal',
        blocks: [
          { t: 'p', text: 'Mapungubwe is usually explained as "hill of the jackal". Sesotho and Venda speakers gave the name, and it stuck. The hill became the centre of a kingdom that was, at its height, one of the largest in southern Africa.' },
          { t: 'p', text: 'At its peak, perhaps around nine thousand people lived in the region. Leaders lived on the hilltop, and ordinary families lived in the valleys around it. This separation between the leader and the people is one of the clues that tells us how the society was organised.' },
          { t: 'fact', text: 'Scientists have found glass beads and other objects at Mapungubwe that came from far away, showing that its people took part in long-distance trade, including with the Indian Ocean coast.', source: 'mapungubwe_kids' },
        ],
      },
      {
        kind: 'page',
        title: 'The golden rhinoceros',
        blocks: [
          { t: 'p', text: 'In 1933, archaeologists digging on the hill found a grave with many treasures. The most famous was a tiny rhinoceros, covered in thin sheets of gold. It is small enough to sit in the palm of your hand.' },
          { t: 'p', text: 'It was made in about the thirteenth century. Historians think the rhino may have been a symbol of power. The [[kingdom]]’s leader may have been expected to be, like a black rhino, quite solitary and unpredictable.' },
          { t: 'p', text: 'At first, some people refused to believe that such a fine object had been made by an African kingdom. The sad part of that story is that the hill was not declared a national heritage site for many years, and the history of the kingdom was left out of many school books.' },
        ],
      },
      {
        kind: 'page',
        title: 'Why people moved on',
        blocks: [
          { t: 'p', text: 'Around the year 1300, the hill was slowly abandoned. Its people did not vanish. They moved away in search of new land and water.' },
          { t: 'p', text: 'Scientists point to a drier and colder period, and to changes in the trade routes that had made the hill rich. Farming became harder, and communities spread out across the region. Some of the knowledge, skills and traditions of Mapungubwe were carried to new places.' },
          { t: 'ask', text: 'If the rain changed and your home became harder to live in, what would your family do first? What might you need to take with you?' },
        ],
      },
      {
        kind: 'page',
        title: 'Many kingdoms, many languages',
        blocks: [
          { t: 'p', text: 'Mapungubwe was not the only kingdom in the region. Later, stone-walled towns such as Great Zimbabwe, further north, grew large and wealthy through gold and cattle trade. Across the south and east, communities built homes, farms and chiefdoms, each with its own leaders and customs.' },
          { t: 'p', text: 'Southern Africa is home to many languages, grouped into families. The Nguni languages (such as isiXhosa and isiZulu), the Sotho-Tswana languages (such as Sesotho and Setswana), Venda and Tsonga are examples. Languages spread, mixed and changed as people moved, married and traded.' },
          { t: 'p', text: 'That is why the people of this region have always been diverse. There was never one "African" nation with one king, in the way that a book might describe it.' },
          { t: 'note', text: 'The name for a leader varies between communities: king, queen, chief, paramount chief, or other titles. Look for the local name when you read other books.' },
        ],
      },
      {
        kind: 'interactive',
        title: 'Map the kingdoms',
        blocks: [
          { t: 'p', text: 'Tap the markers on the map to explore some of the places in this chapter and the next. The coloured shapes show the approximate heartland of each community, not a fixed border.' },
          { t: 'interactive', name: 'inkmap', title: 'Kingdoms and communities' },
        ],
      },
      {
        kind: 'quiz',
        title: 'Quick check',
        blocks: [
          { t: 'quiz' },
          { t: 'mum', text: 'Look at a map of South Africa together. Which places does your family know? Which names do you think belong to the people who lived there first?' },
        ],
      },
      {
        kind: 'handoff',
        title: 'Strangers on the horizon',
        blocks: [
          { t: 'mystery', text: 'Luchelle, hold the compass steady. Far across the ocean, sailors are looking for a sea road to the spices of Asia. Soon, their ships will round the southern tip of Africa, and everything will change.' },
          { t: 'tellmore', items: [
            { q: 'How do historians know about Mapungubwe’s trade?', a: 'They study objects found in the excavations, such as glass beads, ceramics and metals, and compare them with objects from other places. Those comparisons show that goods came from far away, including from the Indian Ocean coast. This kind of evidence is called trade archaeology.' },
            { q: 'Why is it important not to draw modern borders on ancient maps?', a: 'Because modern borders were drawn much later, by colonial powers, and they often cut across communities. Ancient kingdoms and communities had different boundaries, and those boundaries changed over time.' },
          ] },
        ],
      },
    ],
  },

  // ───────────────────────────── CHAPTER 3 ─────────────────────────────
  {
    id: 'ch3',
    num: '3',
    title: 'The World Beyond Africa',
    subtitle: 'Spices, sea routes, Portugal, the Netherlands and the race for riches',
    accent: '#2f4a6b',
    mood: 'Why sailors dared to sail around a continent.',
    sources: ['wiki_dutchcape', 'wiki_riebeeck', 'mapungubwe_kids'],
    quiz: [
      {
        q: 'Why were spices like pepper and cloves so valuable in Europe?',
        options: ['They were cheap and common', 'They added flavour, helped keep food from spoiling, and were traded at very high prices', 'They were used only as paint', 'They made ships go faster'],
        answer: 1,
        explain: 'Before fridges, spices helped preserve and flavour food, and they were rare and expensive to bring from Asia. Whoever controlled the trade could become very rich.',
      },
      {
        q: 'What did Bartolomeu Dias achieve in 1488?',
        options: ['He discovered gold in Johannesburg', 'He sailed around the southern tip of Africa into the Indian Ocean', 'He founded the Dutch East India Company', 'He invented the compass'],
        answer: 1,
        explain: 'Dias rounded the southern tip of Africa in 1488, opening a sea route between Europe and the Indian Ocean.',
      },
      {
        q: 'Was the Dutch settlement at the Cape in 1652 under English rule?',
        options: ['Yes, the Dutch were ruled from London', 'No, the Dutch Republic was an independent state, and England and the Dutch were rivals', 'Yes, but only in the summer', 'The Dutch did not have a country'],
        answer: 1,
        explain: 'The Dutch Republic was independent and was England’s rival. The First Anglo-Dutch War between them began in 1652, in the same year that the Cape settlement was founded.',
      },
    ],
    sides: [
      {
        kind: 'opener',
        title: 'The World Beyond Africa',
        blocks: [
          { t: 'interactive', name: 'globe', title: 'A globe that turns slowly' },
          { t: 'lead', text: 'Luchelle, look at the globe turning slowly. Africa sits in the middle, a huge continent with a tail of land at the bottom. For ships in the 1400s, that tail was the way to somewhere enormously valuable.' },
          { t: 'anchor', when: '1488–1498', where: 'From Lisbon and Amsterdam, around Africa, to India' },
        ],
      },
      {
        kind: 'page',
        title: 'Why would anyone sail for months?',
        blocks: [
          { t: 'p', text: 'Why would a sailor spend many months on a wooden ship, with bad food and storms, just to reach a place far away? Because of the [[spice trade]].' },
          { t: 'p', text: 'Pepper, cloves, cinnamon and nutmeg came from islands and lands in Asia. In Europe they were rare and worth a fortune. They flavoured food, helped keep meat from going bad, and were used in medicine. For a long time, merchants who brought spices over land and through the Mediterranean earned huge sums.' },
          { t: 'p', text: 'Portugal and then the Netherlands wanted a sea route that would let them bring spices directly, without paying the middlemen. That is why the sea around Africa suddenly became so important.' },
          { t: 'ask', text: 'Which ordinary thing in your kitchen would have been priced like treasure 600 years ago? Why?' },
        ],
      },
      {
        kind: 'page',
        title: 'Portugal finds the way',
        blocks: [
          { t: 'p', text: 'In 1488, the Portuguese captain Bartolomeu Dias sailed around the southern tip of Africa. Storms pushed his ships far out to sea, and when the weather calmed, he found that the coast now turned to the north-east. He had found the way into the Indian Ocean.' },
          { t: 'p', text: 'Almost ten years later, in 1497 and 1498, Vasco da Gama sailed the same route further, along the east coast of Africa and across the Indian Ocean. He reached Calicut, on the Indian coast, in May 1498. A new sea road between Europe and Asia had been opened.' },
          { t: 'p', text: 'For the Portuguese, this meant a new trading empire. For the people living along the coasts of Africa and Asia, it meant new visitors with powerful ships, who wanted to control trade.' },
        ],
      },
      {
        kind: 'page',
        title: 'The Dutch are coming',
        blocks: [
          { t: 'p', text: 'In the 1600s the Netherlands became a great trading nation. In 1602, Dutch merchants joined together to form the [[VOC]], the Dutch East India Company. It had ships, soldiers and the power to make treaties and wage war in faraway seas.' },
          { t: 'p', text: 'The Dutch were not part of the British Empire. The Dutch Republic was an independent country. England and the Dutch Republic were rivals, fighting for trade and sea power. The First Anglo-Dutch War between them began in 1652, the same year the Dutch settled at the Cape.' },
          { t: 'fact', text: 'Jan van Riebeeck landed at Table Bay on 6 April 1652, while the Dutch Republic and England were rivals, and the war between them had not yet started.', source: 'wiki_riebeeck' },
        ],
      },
      {
        kind: 'page',
        title: 'The sailor’s problem: scurvy',
        blocks: [
          { t: 'p', text: 'A long sea voyage had a dangerous enemy: [[scurvy]], an illness caused by a lack of vitamin C. Sailors who ate only dry biscuits and salted meat for months could become very weak, and many died.' },
          { t: 'p', text: 'Fresh water, fresh vegetables, fresh meat and fruit could save lives. So ships looked for safe places to stop and refill. Those places are called refreshment stations. The Cape of Good Hope, with its bay, mountain and stream, was an obvious choice.' },
          { t: 'p', text: 'This is the cause and effect that drove so much of this story. Ships needed food and water, which made the Cape valuable. Then the people who lived there, and the land they used, became part of the story too.' },
        ],
      },
      {
        kind: 'interactive',
        title: 'Routes and riches',
        blocks: [
          { t: 'p', text: 'Press play and watch a ship sail along the route Dias and Da Gama took. Then compare it with the Dutch route to the Cape.' },
          { t: 'interactive', name: 'shiproute', title: 'Sea routes to Asia' },
          { t: 'interactive', name: 'match', title: 'Why was it valuable?', note: 'trade' },
        ],
      },
      {
        kind: 'quiz',
        title: 'Quick check',
        blocks: [
          { t: 'quiz' },
          { t: 'mum', text: 'Ask: if you could sell one thing from home to a faraway country for a fortune, what would it be, and what would you need to carry it safely?' },
        ],
      },
      {
        kind: 'handoff',
        title: 'Who was in Table Bay?',
        blocks: [
          { t: 'mystery', text: 'Luchelle, the ships are now anchored in Table Bay. The sailors are tired and hungry, and the sun is rising over a mountain with a flat top. Who was already living beneath it?' },
          { t: 'tellmore', items: [
            { q: 'What is the difference between a colony and a trading station?', a: 'A trading station is a place for trade and resupply, usually with few permanent settlers. A colony is a territory settled and governed by another country, often with permanent families, land-taking and control over the people living there. The Cape began as a refreshment station but gradually became a colony.' },
            { q: 'Who were the Portuguese and Dutch rivals?', a: 'Portugal, Spain, the Netherlands, England and France all competed for trade in Asia during this period. Each wanted a share of the spice and silk trades, and their rivalry led to many naval battles.' },
          ] },
        ],
      },
    ],
  },
];
