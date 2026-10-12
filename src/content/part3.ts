import type { Chapter } from './types';

const PHOTO = `${import.meta.env.BASE_URL}images/photos/`;

export const part3: Chapter[] = [
  // ───────────────────────────── CHAPTER 8 ─────────────────────────────
  {
    id: 'ch8',
    num: '8',
    title: 'Kingdoms, Treks, Wars and Gold',
    subtitle: 'The Zulu and Basotho kingdoms, the Great Trek, diamonds, gold and the South African War',
    accent: '#8c4a2f',
    mood: 'Kingdoms rising, republics forming, and a war over gold.',
    sources: ['saho_isandlwana', 'isand_brit', 'saho_boerwar', 'wiki_union_boer', 'wiki_wh_boer'],
    quiz: [
      {
        q: 'What happened at Isandlwana on 22 January 1879?',
        options: ['A British victory with few casualties', 'A Zulu army defeated a British camp, with over 1,300 British soldiers and African auxiliaries killed', 'A peace treaty was signed', 'Gold was discovered'],
        answer: 1,
        explain: 'Isandlwana was one of the worst defeats for a British army in the 19th century. Its story is complicated and needs to be told from several sides.',
      },
      {
        q: 'Why did historians argue about the word mfecane?',
        options: ['It is a Dutch word for a fort', 'They disagreed about what caused the upheaval of the early 1800s, and about how much blame belongs to the Zulu kingdom', 'It was not used at all', 'It is the name of a river'],
        answer: 1,
        explain: 'The period of upheaval had many causes, including drought, trade and raids. Historians still debate how much the Zulu expansion, the slave trade and other pressures contributed.',
      },
      {
        q: 'What were the camps used in the South African War?',
        options: ['Sports grounds', 'Concentration camps where many civilians, mostly Boer women and children and many Black Africans, died from disease and hunger', 'Mining schools', 'Hotels for soldiers'],
        answer: 1,
        explain: 'Thousands of Boer women and children, and many Black Africans, died in British camps. Conditions were terrible, and the deaths are a painful part of this war’s history.',
      },
    ],
    sides: [
      {
        kind: 'opener',
        title: 'Kingdoms, Treks, Wars and Gold',
        blocks: [
          { t: 'fig', src: PHOTO + 'isandlwana-battlefield.jpg', alt: 'The Isandlwana battlefield, a wide grassy plain under a sky.', caption: 'The Isandlwana battlefield, KwaZulu-Natal. The battle here was fought on 22 January 1879.', credit: 'RedNovember82', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Isandlwana_Battlefield.JPG' },
          { t: 'lead', text: 'Luchelle, in less than a century, the land between the mountains and the sea was split by new borders, new republics, a diamond rush and a bitter war over gold.' },
          { t: 'anchor', when: 'About 1816 to 1902', where: 'Across the interior and the coast' },
        ],
      },
      {
        kind: 'page',
        title: 'Shaka and the Zulu kingdom',
        blocks: [
          { t: 'p', text: 'In the early 1800s, communities in what is now KwaZulu-Natal were changing fast. Under [[Shaka]], the Zulu kingdom grew into a powerful state with a reorganised army, and it absorbed or defeated many neighbouring communities.' },
          { t: 'p', text: 'Historians use the word [[mfecane]] (or difaqane) for this wider upheaval. Scholars argue about what caused it. Some stress Zulu expansion. Others point to drought, the growing demand for ivory and slaves through Portuguese and Cape trade, and the movement of people who were fleeing wars.' },
          { t: 'p', text: 'Whatever the causes, many families were displaced, and new communities were formed by people who had escaped or been driven from their homes. This is a good example of how history is never just one story.' },
          { t: 'ask', text: 'If a huge army came near your home, what would you do to protect your family? Would you run, fight, or talk? Why would each choice be hard?' },
        ],
      },
      {
        kind: 'page',
        title: 'Moshoeshoe and the Basotho',
        blocks: [
          { t: 'p', text: 'Further west, Moshoeshoe I brought together many families and refugees to form the Basotho nation. He chose a flat-topped mountain, Thaba Bosiu, as a fortress. Its cliffs and paths could be defended against armies.' },
          { t: 'p', text: 'Moshoeshoe was a skilled diplomat. He dealt with both the Boer republics and the British, trying to protect his people’s land. In 1868 the Basotho asked for British protection, and their land became the British territory of Basutoland, which later became Lesotho.' },
          { t: 'fact', text: 'Lesotho is the only country in the world that is entirely above 1,000 metres in elevation. The Basotho nation was built, in part, around a mountain fortress.' },
        ],
      },
      {
        kind: 'page',
        title: 'The Great Trek and new republics',
        blocks: [
          { t: 'p', text: 'After the British abolished slavery in 1834, many Dutch-speaking farmers, called [[Voortrekkers]], left the Cape Colony in the late 1830s and 1840s. They were angry about British laws and about losing workers and land. They moved inland to find new farmland.' },
          { t: 'p', text: 'They founded new states, including the Natalia republic on the coast, and later the Transvaal (South African Republic) and the Orange Free State. These states were governed by white settlers and had their own laws, and they did not recognise equal rights for the African communities living in their lands.' },
          { t: 'p', text: 'The Trek brought the settlers into direct conflict with the kingdoms of the interior. Each side had its own reasons, and each side believed it was defending its home.' },
        ],
      },
      {
        kind: 'page',
        title: 'Diamonds and gold',
        blocks: [
          { t: 'p', text: 'In 1867, a diamond was found near the Orange River. Diamond rushes followed, and by the 1870s the mines of [[Kimberley]] were some of the biggest in the world. Thousands of workers came, many of them African men who worked for very low wages under strict rules.' },
          { t: 'p', text: 'In 1886, gold was discovered on the Witwatersrand, the ridge where Johannesburg now stands. It was the largest gold field the world had seen. Mines grew quickly, bringing new towns, roads, railways and workers from across the region and from overseas.' },
          { t: 'p', text: 'Minerals made some people very rich. They also made the British Empire even more determined to control southern Africa. The gold fields would be at the heart of the next war.' },
        ],
      },
      {
        kind: 'page',
        title: 'Isandlwana, 1879',
        blocks: [
          { t: 'fig', src: PHOTO + 'isandlwana-panorama.jpg', alt: 'A wide panoramic view of the Isandlwana battlefield.', caption: 'A panoramic view of the Isandlwana battlefield, where a British camp was overrun in 1879.', credit: 'Bizcallers', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:View_Of_the_Isandlwana_Battlefield.jpg' },
          { t: 'p', text: 'In 1879, British forces invaded the Zulu kingdom, hoping to bring the southern colonies under a single government. On 22 January, a large Zulu army attacked a British camp at Isandlwana. Over 1,300 British soldiers and African auxiliaries were killed.' },
          { t: 'p', text: 'The battle was a shock in Britain. It did not end the war, which ended after the Battle of Ulundi in July 1879, and the Zulu king Cetshwayo was later captured. Many Zulu families lost sons, homes and cattle, and the kingdom was broken into smaller parts.' },
          { t: 'note', text: 'Numbers at Isandlwana differ between sources, and Zulu casualties are estimated rather than counted. Historians are careful about exact totals.' },
        ],
      },
      {
        kind: 'page',
        title: 'The South African War',
        blocks: [
          { t: 'p', text: 'From 1899 to 1902, Britain fought the Boer republics of the Transvaal and the Orange Free State. The war was about control of the gold fields and the wider power of the British Empire. Many Boer farmers fought as commandos, moving quickly across the veld.' },
          { t: 'p', text: 'To defeat the commandos, the British used [[scorched earth]] tactics, burning farms and destroying crops and supplies. Families were moved into [[concentration camp]]s. Disease, hunger and bad conditions killed tens of thousands of people.' },
          { t: 'p', text: 'Historians estimate that about 26,000 to 28,000 Boer people died in the camps, most of them children. At least 14,000 to 20,000 Black African people also died in camps set up for them. Some camp records were poor, so the exact numbers remain uncertain.' },
          { t: 'p', text: 'The war ended with the Treaty of Vereeniging in May 1902. The Boer republics became British colonies, and the path to the Union in 1910 had begun.' },
        ],
      },
      {
        kind: 'interactive',
        title: 'People and powers',
        blocks: [
          { t: 'p', text: 'Tap each portrait card to see who the person was, and what they are remembered for. These are name cards, not photographs, so they do not show what the people looked like.' },
          { t: 'interactive', name: 'portraits', title: 'Leaders of the 1800s', note: '1800s' },
          { t: 'interactive', name: 'territory', title: 'Who controlled this area?', note: '1840' },
        ],
      },
      {
        kind: 'quiz',
        title: 'Quick check',
        blocks: [
          { t: 'quiz' },
          { t: 'mum', text: 'Talk about two sides of a story. Ask your child: how would the Zulu, Basotho, Boer and British families each describe the same battle?' },
        ],
      },
      {
        kind: 'handoff',
        title: 'One country, but not equal',
        blocks: [
          { t: 'mystery', text: 'Luchelle, the war is over. The British and the Boer republics are now joined. But somebody is putting together a new country on paper, and they have decided who counts. Turn the page to meet the Union.' },
          { t: 'tellmore', items: [
            { q: 'What was the Transvaal?', a: 'The Transvaal was the Boer republic north of the Vaal River, formally called the South African Republic. Its name came from its position across the Vaal River, and it was one of the two independent Boer republics that fought the British in 1899–1902.' },
            { q: 'What were concentration camps?', a: 'Camps where people were confined under guard, usually without enough food, shelter or medical care. The British set them up for civilians whose farms had been destroyed. The camps were used for Boer families and for many Black African people, and their conditions led to great loss of life.' },
          ] },
        ],
      },
    ],
  },

  // ───────────────────────────── CHAPTER 9 ─────────────────────────────
  {
    id: 'ch9',
    num: '9',
    title: 'One Country, But Not Equal',
    subtitle: 'The Union of 1910, the Natives Land Act, and the apartheid laws',
    accent: '#5b4a6b',
    mood: 'A new country was born, but its rules were very unfair.',
    sources: ['saho_landact', 'natjust_wiki', 'ph_parl', 'parliament_const', 'saho_boerwar'],
    quiz: [
      {
        q: 'When did the Union of South Africa come into being?',
        options: ['1652', '1834', '1910', '1994'],
        answer: 2,
        explain: 'On 31 May 1910, four British colonies came together to form the Union of South Africa.',
      },
      {
        q: 'How much land did the Natives Land Act of 1913 set aside for African ownership?',
        options: ['About 7%', 'About 50%', 'About 80%', 'None'],
        answer: 0,
        explain: 'Africans, who were the large majority of the population, were restricted to about 7% of the land. Later laws increased that to about 13%, still far less than their share of people.',
      },
      {
        q: 'What made apartheid different from earlier unfair laws?',
        options: ['It was only about money', 'It was a system of laws, from 1948, that separated people by race and gave white people the most power and rights in every part of life', 'It was a sport', 'It ended slavery'],
        answer: 1,
        explain: 'Apartheid was a complete system that controlled where people could live, work, travel, study and vote, based on race.',
      },
    ],
    sides: [
      {
        kind: 'opener',
        title: 'One Country, But Not Equal',
        blocks: [
          { t: 'fig', src: PHOTO + 'union-buildings.jpg', alt: 'The Union Buildings in Pretoria, with a statue in the foreground.', caption: 'The Union Buildings in Pretoria, the seat of the national government, with a statue of J.B.M. Hertzog in the foreground.', credit: 'Zakysant', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Union-buildings-pretoria.JPG' },
          { t: 'lead', text: 'Luchelle, look at the Union Buildings in Pretoria. They were built to show a new country’s power. But the rules inside the country were written to keep power in very few hands.' },
          { t: 'anchor', when: '31 May 1910 to 1994', where: 'Pretoria and Cape Town, the seats of government' },
        ],
      },
      {
        kind: 'page',
        title: 'Four colonies make one country',
        blocks: [
          { t: 'p', text: 'On 31 May 1910, the [[Union of South Africa]] came into being. Four British colonies, the Cape, Natal, the Transvaal and the Orange River Colony (the former Orange Free State), joined together under one government and one Parliament.' },
          { t: 'p', text: 'Parliament met in Cape Town, and the executive government sat in Pretoria. Its leaders were white men, and the Union was a self-governing country under the British Crown.' },
          { t: 'p', text: 'The Union was built by men who had fought each other in the South African War only a few years earlier. The Union brought together the two white groups that had fought each other, and it was built on the exclusion of everyone else.' },
          { t: 'fig', src: PHOTO + 'parliament-cape-town.jpg', alt: 'The Houses of Parliament in Cape Town, a grand building with a clock tower.', caption: 'The Houses of Parliament in Cape Town. The building was completed in 1885, and the new Union Parliament met here.', credit: 'Discott', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Houses_of_Parliament,_Parliament_Street,_Cape_Town_WLM_2013.JPG' },
        ],
      },
      {
        kind: 'page',
        title: 'Who could vote?',
        blocks: [
          { t: 'p', text: 'In the Union, only white men could vote for national Parliament, except in some cases in the Cape, where a small number of men of other races who met property and education rules could vote. That tiny number is important, but it was far from equal.' },
          { t: 'p', text: 'Women could not vote in national elections until 1930, and then only white women were given the vote. Most women of other races did not gain a national vote until 1994.' },
          { t: 'ask', text: 'If you could not vote, but laws were made that affected your school, your work and where you could sleep, what would you do to make your voice heard?' },
        ],
      },
      {
        kind: 'page',
        title: 'The Natives Land Act, 1913',
        blocks: [
          { t: 'p', text: 'On 19 June 1913, Parliament passed the [[Natives Land Act]]. It said that most of the land could only be owned by white people. African people, who made up the large majority of the population, were restricted to a small area of the country, about 7% of the land.' },
          { t: 'p', text: 'Many African families who had farmed, rented or worked land were forced off it, and sharecroppers were driven into wage labour. The law was a major turning point in land ownership, and its effects are still felt today.' },
          { t: 'p', text: 'Later, the 1936 Trust and Land Act increased the area to about 13%. Even then, it was far less than the land people had lived on and used for generations.' },
          { t: 'fact', text: 'The Natives Land Act of 1913 restricted African land ownership to about 7% of the country. It was extended to 13% in 1936.', source: 'saho_landact' },
        ],
      },
      {
        kind: 'page',
        title: 'Apartheid',
        blocks: [
          { t: 'p', text: 'In 1948, the National Party won the election and began to introduce [[apartheid]], which means "apartness" in Afrikaans. It was a system of laws that divided people by race and controlled almost every part of life.' },
          { t: 'p', text: 'The [[pass laws]] forced Africans to carry passes showing where they could go. Group Areas laws forced people of different races to live apart, often moving families out of homes they had owned or rented for generations. Schooling was separated, and [[Bantu education]] was designed to limit the opportunities of African learners.' },
          { t: 'p', text: 'Under apartheid, people were classified by race and their lives were controlled by these categories. Many families were broken up, and communities were uprooted. Resistance grew, and it was met with force.' },
          { t: 'note', text: 'Some people who lived under apartheid were complicit in it, and many were harmed by it. The system was built to benefit a minority, and it hurt the majority.' },
        ],
      },
      {
        kind: 'page',
        title: 'The republic and the Commonwealth',
        blocks: [
          { t: 'p', text: 'In 1961, after a referendum that was open only to white voters, South Africa became a republic and left the [[Commonwealth]]. The Union had been a dominion within the British Empire, and now the country was fully its own state.' },
          { t: 'p', text: 'Becoming a republic did not give the vote to most people in the country. It was a change of title, not a change in who had power. In the same year, the government increased its use of force against its opponents.' },
          { t: 'interactive', name: 'votes', title: 'Who could vote, and when?' },
        ],
      },
      {
        kind: 'quiz',
        title: 'Quick check',
        blocks: [
          { t: 'quiz' },
          { t: 'mum', text: 'Ask your child: why do you think the government of the time wanted to keep these laws in place? Then ask whether a law can be fair if only some people could make it.' },
        ],
      },
      {
        kind: 'handoff',
        title: 'Who said no?',
        blocks: [
          { t: 'mystery', text: 'Luchelle, the laws were written with pens and signed in offices. But across the country, people were already refusing them, marching, organising, writing and singing. The next chapter follows their courage.' },
          { t: 'tellmore', items: [
            { q: 'What was a dominion?', a: 'A self-governing country within the British Empire, such as Canada, Australia and New Zealand. The Union of South Africa was a dominion from 1910 until it became a republic in 1961.' },
            { q: 'Why did only white women get the vote in 1930?', a: 'In 1930 the Union extended the franchise to white women, but not to other women. The decision reflects the racial rules of the time and is an important part of the story of who was excluded from voting.' },
          ] },
        ],
      },
    ],
  },

  // ───────────────────────────── CHAPTER 10 ─────────────────────────────
  {
    id: 'ch10',
    num: '10',
    title: 'The Fight for Freedom',
    subtitle: 'Congress, protest, Sharpeville, Robben Island, Soweto and the release of Nelson Mandela',
    accent: '#7a2e2e',
    mood: 'Many people, many organisations, and a long road to freedom.',
    sources: ['sharpe_swarthmore', 'sharpe_apartheid', 'sharpe_britannica', 'pieterson_brit', 'soweto_aljazeera', 'robben_history'],
    quiz: [
      {
        q: 'What happened at Sharpeville on 21 March 1960?',
        options: ['A peaceful election', 'Police opened fire on a crowd protesting the pass laws, killing 69 people by the official count', 'A treaty was signed', 'A sports match'],
        answer: 1,
        explain: 'The official count was 69 killed and 180 wounded. Some scholars say the real numbers were higher. The massacre led to a crackdown and to the banning of the ANC and PAC.',
      },
      {
        q: 'Why did students protest in Soweto on 16 June 1976?',
        options: ['They wanted a new school uniform', 'They objected to being taught in Afrikaans, a language many saw as the language of oppression', 'They wanted to close all schools', 'They were celebrating a holiday'],
        answer: 1,
        explain: 'Students objected to Afrikaans being forced as a medium of instruction. The protest became one of the most important moments in the struggle.',
      },
      {
        q: 'Who was Hector Pieterson?',
        options: ['A police officer', 'A 12-year-old schoolboy who was shot and killed on 16 June 1976', 'A famous singer', 'A president'],
        answer: 1,
        explain: 'Hector Pieterson, aged 12, was shot during the Soweto protest. A photograph of him, taken by Sam Nzima, became one of the most powerful images of the time.',
      },
    ],
    sides: [
      {
        kind: 'opener',
        title: 'The Fight for Freedom',
        blocks: [
          { t: 'fig', src: PHOTO + 'mandela-cell-mannix.jpg', alt: 'A small bare prison cell on Robben Island with a window.', caption: 'A cell on Robben Island, where political prisoners were held for many years. It is preserved as part of the museum.', credit: 'Paul Mannix', license: 'CC BY-SA 2.0', url: 'https://commons.wikimedia.org/wiki/File:Nelson_Mandela%27s_prison_cell,_Robben_Island,_South_Africa.jpg' },
          { t: 'lead', text: 'Luchelle, freedom was not won by one person. It was won by many people, in many places, over many years, often at great cost.' },
          { t: 'anchor', when: '1912 to 1994', where: 'Towns, townships, cities and prisons across the country' },
        ],
      },
      {
        kind: 'page',
        title: 'Organising for rights',
        blocks: [
          { t: 'p', text: 'In 1912, African leaders founded what became the [[African National Congress]]. It began as the South African Native National Congress, and it sent delegations to Britain to ask for equal rights. Those requests were largely ignored.' },
          { t: 'p', text: 'Women organised too. In 1956, about 20,000 women marched to the Union Buildings in Pretoria to protest against pass laws for women. Their protest is remembered every year on 9 August.' },
          { t: 'p', text: 'Other movements came and went. The Pan Africanist Congress was formed in 1959 by people who broke from the ANC. In the 1970s, Black Consciousness, led by young activists such as [[Steve Biko]], encouraged pride and self-reliance. Unions, churches, student groups and civic associations all played a part.' },
        ],
      },
      {
        kind: 'page',
        title: 'Sharpeville, 1960',
        blocks: [
          { t: 'p', text: 'In March 1960, the PAC and the ANC called protests against the pass laws. At Sharpeville, a township near Vereeniging, a large crowd gathered outside the police station. The police opened fire.' },
          { t: 'p', text: 'The official figures record 69 people killed and 180 wounded. Many were shot in the back as they tried to leave. Some scholars estimate higher numbers. It was a turning point: the ANC and the PAC were banned, and many leaders went underground or into exile.' },
          { t: 'fact', text: 'The Sharpeville massacre took place on 21 March 1960. The official count was 69 people killed. Each year, 21 March is commemorated as Human Rights Day.', source: 'sharpe_britannica' },
          { t: 'ask', text: 'Why might a peaceful protest be dangerous in a country where the government is afraid of its own people? What could people do next?' },
        ],
      },
      {
        kind: 'page',
        title: 'Armed struggle and the trial',
        blocks: [
          { t: 'p', text: 'After Sharpeville, many activists concluded that peaceful protest was no longer enough. In 1961 the ANC and its allies formed an armed wing, uMkhonto weSizwe (MK), to carry out sabotage against government targets.' },
          { t: 'p', text: 'In 1962, Nelson Mandela was arrested and later sentenced. At the Rivonia Trial in 1963 and 1964, he and other leaders were convicted. In June 1964 he was sentenced to life imprisonment, and he was taken to Robben Island.' },
          { t: 'p', text: 'Many of the same leaders spent their best years in prison, including Walter Sisulu, Govan Mbeki and Ahmed Kathrada. Their families and their communities kept the struggle going outside.' },
        ],
      },
      {
        kind: 'page',
        title: 'Soweto, 1976',
        blocks: [
          { t: 'p', text: 'In 1976, the government ordered that some subjects in African schools be taught in Afrikaans. Many students saw Afrikaans as the language of their oppressors, and they refused.' },
          { t: 'p', text: 'On 16 June 1976, thousands of students marched in Soweto, outside Johannesburg. The police opened fire. [[Hector Pieterson]], who was 12, was shot and killed. Sam Nzima’s photograph of his body, carried by another student, shocked the world.' },
          { t: 'fig', src: PHOTO + 'hector-pieterson-grave.jpg', alt: 'A headstone in a cemetery in Soweto.', caption: 'The grave of Hector Pieterson at Avalon Cemetery, Soweto. 16 June is now South Africa’s Youth Day.', credit: 'Andrew Hall', license: 'CC BY-SA 4.0', url: "https://commons.wikimedia.org/wiki/File:Hector_Pieterson's_Grave,_Avalon_Cemetery,_Soweto.jpg" },
          { t: 'p', text: 'At least 176 people were killed in the protests that followed. Some estimates are much higher. Students were the first to rise, and the uprising spread across the country in the months that followed.' },
          { t: 'note', text: 'This book uses a photograph of the grave rather than Sam Nzima’s famous image, because the licence for that image could not be verified for this book.' },
        ],
      },
      {
        kind: 'page',
        title: 'Freedom, step by step',
        blocks: [
          { t: 'p', text: 'Through the 1980s, workers, students, churches and communities organised strikes, boycotts and civic action. Many countries applied [[sanctions]] to South Africa, cutting off trade, investment and sporting links.' },
          { t: 'p', text: 'On 11 February 1990, Nelson Mandela walked out of Victor Verster Prison, near Paarl, a free man after 27 years in prison. The release was not the end of the struggle. It was the start of negotiations for a democratic constitution.' },
          { t: 'interactive', name: 'portraits', title: 'People who led and shaped the fight', note: 'freedom' },
        ],
      },
      {
        kind: 'interactive',
        title: 'Put the events in order',
        blocks: [
          { t: 'p', text: 'Drag the events into the right order, from earliest to latest. Click a card to move it up or down if you are using a keyboard.' },
          { t: 'interactive', name: 'order', title: 'The road to freedom', note: 'freedom' },
        ],
      },
      {
        kind: 'quiz',
        title: 'Quick check',
        blocks: [
          { t: 'quiz' },
          { t: 'mum', text: 'Ask: who taught you about this history? Do you know any stories from your grandparents or neighbours about these years?' },
        ],
      },
      {
        kind: 'handoff',
        title: 'Writing a new law',
        blocks: [
          { t: 'mystery', text: 'Luchelle, the struggle has won the right to vote. But now there is a huge task: to write a new Constitution, for everyone. The leaders must sit down together, and a country of many languages must learn to trust each other.' },
          { t: 'tellmore', items: [
            { q: 'What is a sanction?', a: 'A penalty, usually economic, applied by countries to pressure another country to change its behaviour. In the 1980s, many countries and organisations imposed trade, investment and sports restrictions on South Africa.' },
            { q: 'Why is the ANC called "the ANC" in most sources?', a: 'Its full name is the African National Congress. It was founded in 1912 as the South African Native National Congress, and it changed its name in 1923.' },
          ] },
        ],
      },
    ],
  },
];
