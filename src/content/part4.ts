import type { Chapter } from './types';

const PHOTO = `${import.meta.env.BASE_URL}images/photos/`;

export const part4: Chapter[] = [
  // ───────────────────────────── CHAPTER 11 ─────────────────────────────
  {
    id: 'ch11',
    num: '11',
    title: 'A Country Chooses Democracy',
    subtitle: 'The 1994 election, the first Parliament for everyone, and a Constitution with a Bill of Rights',
    accent: '#2f5d50',
    mood: 'One person, one vote, and a long line of patient voters.',
    sources: ['ipu_1994', 'wiki_1994', 'omalley_1994', 'const_pdf', 'parliament_const'],
    quiz: [
      {
        q: 'When was the first election in which all adults of every race could vote?',
        options: ['1910', '1948', '27 April 1994', '1996'],
        answer: 2,
        explain: 'The election took place from 26 to 29 April 1994, with 27 April as the main day of voting. It was the first national election in which all adults could vote.',
      },
      {
        q: 'What is the role of the Constitutional Court?',
        options: ['It collects taxes', 'It has the final say on what the Constitution means, and can strike down laws that break it', 'It runs schools', 'It chooses the national anthem'],
        answer: 1,
        explain: 'The Constitutional Court protects the Constitution. It can declare laws and presidential actions invalid if they break it.',
      },
      {
        q: 'Why is separation of powers important?',
        options: ['It makes government cheaper', 'It divides power between Parliament, the executive and the courts, so each can check the others', 'It means one person decides everything', 'It is only a rule for schools'],
        answer: 1,
        explain: 'Separation of powers stops any one part of government from becoming too powerful. It is one of the key ideas of a democratic constitution.',
      },
    ],
    sides: [
      {
        kind: 'opener',
        title: 'A Country Chooses Democracy',
        blocks: [
          { t: 'fig', src: PHOTO + 'parliament-cape-town.jpg', alt: 'The Houses of Parliament in Cape Town.', caption: 'The Houses of Parliament, Cape Town, where the democratic Parliament has met since the end of apartheid.', credit: 'Discott', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Houses_of_Parliament,_Parliament_Street,_Cape_Town_WLM_2013.JPG' },
          { t: 'lead', text: 'Luchelle, imagine standing in a queue that stretches around the block, waiting for hours, because your vote might be the first you have ever been allowed to cast.' },
          { t: 'anchor', when: '26 to 29 April 1994', where: 'Polling stations across the whole country' },
        ],
      },
      {
        kind: 'page',
        title: 'Talks and a temporary Constitution',
        blocks: [
          { t: 'p', text: 'After 1990, the government and the liberation movements began long, difficult negotiations about the future. They met in forums such as CODESA, the Convention for a Democratic South Africa, which argued over how power would be shared.' },
          { t: 'p', text: 'The negotiators agreed on an interim Constitution in 1993. It set the rules for a first democratic election, and it would be replaced by a final Constitution once elected representatives had written it.' },
          { t: 'p', text: 'Negotiations were not peaceful all the time. Violence, especially in parts of KwaZulu-Natal and on the Witwatersrand, claimed many lives. Election campaigns were held against that background, and the peace process was fragile.' },
        ],
      },
      {
        kind: 'page',
        title: 'The first vote for everyone',
        blocks: [
          { t: 'p', text: 'The election was held from 26 to 29 April 1994, with 27 April as the main voting day. People of every race voted for a national Parliament for the first time. Many waited in long queues, some for many hours, and many were first-time voters.' },
          { t: 'p', text: 'The African National Congress won 62.65% of the vote, which gave it 252 of the 400 seats in the National Assembly. The National Party won 20.39%, and the Inkatha Freedom Party 10.54%.' },
          { t: 'p', text: 'Parliament elected Nelson Mandela as President on 9 May 1994. He was inaugurated at the Union Buildings in Pretoria on 10 May 1994. The place where the Union had been declared, and where apartheid had been governed, now held a black president.' },
          { t: 'fig', src: PHOTO + 'union-buildings.jpg', alt: 'The Union Buildings in Pretoria.', caption: 'The Union Buildings in Pretoria, where Nelson Mandela was inaugurated as President on 10 May 1994.', credit: 'Zakysant', license: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Union-buildings-pretoria.JPG' },
          { t: 'fact', text: 'In the 1994 election, the ANC won 252 of 400 seats in the National Assembly, which gave it a clear majority in Parliament.', source: 'ipu_1994' },
        ],
      },
      {
        kind: 'page',
        title: 'A Constitution for everyone',
        blocks: [
          { t: 'p', text: 'The new Constitution was adopted by the National Assembly on 8 May 1996, signed by President Mandela on 10 December 1996, and came into force on 4 February 1997.' },
          { t: 'p', text: 'It contains a Bill of Rights, which protects rights such as equality, dignity, freedom, housing, healthcare, food, water, education and the right to vote. It also protects the rights of people to use their own languages and practise their cultures.' },
          { t: 'p', text: 'The Constitution has a famous phrase in its preamble: "South Africa belongs to all who live in it, united in our diversity." It was written as a promise, and it is still being tested today.' },
          { t: 'note', text: 'The Constitution is long. Read a short part of it with a grown-up, perhaps the Bill of Rights, to see how clearly it is written.' },
        ],
      },
      {
        kind: 'page',
        title: 'Three powers, one balance',
        blocks: [
          { t: 'p', text: 'The Constitution divides government into three parts. This is the [[separation of powers]].' },
          { t: 'p', text: 'The [[National Assembly]] has 400 members elected by proportional representation. It makes laws and holds the executive to account. The [[National Council of Provinces]] represents the nine provinces, with ten delegates from each. Together they form Parliament.' },
          { t: 'p', text: 'The President is elected by the National Assembly from among its members. The President leads the national executive, carrying out the laws. The courts, including the [[Constitutional Court]], interpret the law and can strike down laws and actions that break the Constitution.' },
          { t: 'ask', text: 'Why might it be a good idea for the people who make laws to be different from the people who check them? What could go wrong if they were the same people?' },
        ],
      },
      {
        kind: 'page',
        title: 'Truth, memory and reconciliation',
        blocks: [
          { t: 'p', text: 'The Truth and Reconciliation Commission was set up in 1995 to look at human rights violations under apartheid. Victims told their stories publicly. People who confessed to politically motivated crimes could apply for amnesty.' },
          { t: 'p', text: 'The Commission’s work was welcomed by many and criticised by others. Some felt that justice was not done fully. Others said that telling the truth in public was an important step. Historians still discuss its successes and its limits.' },
          { t: 'mum', text: 'Talk with your child about a time when someone said sorry, or a time when you were sorry. What helped the other person forgive, and what made it hard?' },
        ],
      },
      {
        kind: 'interactive',
        title: 'Build your own democracy',
        blocks: [
          { t: 'p', text: 'Place the powers in the right boxes. Each power has a job, and the boxes should check each other. Can you build a government that is fair and balanced?' },
          { t: 'interactive', name: 'democracy', title: 'Separation of powers' },
        ],
      },
      {
        kind: 'quiz',
        title: 'Quick check',
        blocks: [
          { t: 'quiz' },
          { t: 'mum', text: 'Ask your child to describe a rule at school or home that feels fair. Then ask what makes a rule fair, and who should be able to change it.' },
        ],
      },
      {
        kind: 'handoff',
        title: 'Twenty-nine years later',
        blocks: [
          { t: 'mystery', text: 'Luchelle, the first democratic election was held nearly thirty years ago. Since then, many things have changed, and some things are still hard. What does the country look like today? Turn the page and find out.' },
          { t: 'tellmore', items: [
            { q: 'Why was the 1994 election so important?', a: 'It was the first national election in which adults of every race could vote, and it created a Parliament elected by everyone. It also began a long period of constitutional democracy in which the courts can protect rights.' },
            { q: 'What does "proportional representation" mean?', a: 'It means parties receive seats in Parliament in proportion to the share of votes they win. It allows smaller parties to be represented, but it also means that large coalitions are often needed to form a government.' },
          ] },
        ],
      },
    ],
  },

  // ───────────────────────────── CHAPTER 12 ─────────────────────────────
  {
    id: 'ch12',
    num: '12',
    title: 'Our Country Today',
    subtitle: 'From 1994 to October 2026: presidents, progress, HIV, power, elections and open questions',
    accent: '#355c7d',
    mood: 'What we know, what is still uncertain, and what is still being decided.',
    sources: ['wiki_2024', 'brit_2024', 'iacl_gnu', 'tac_pubmed', 'tac_dullah', 'rio_ramaphosa', 'africanews_ill', 'dw_impeach', 'ramaphosa_farm', 'bizt_2026'],
    quiz: [
      {
        q: 'Which key event happened in 2002 that affected millions of people living with HIV?',
        options: ['The Constitutional Court ordered the government to make nevirapine available in public hospitals for preventing mother-to-child transmission', 'The end of the Union', 'The first democratic election', 'The opening of Robben Island as a museum'],
        answer: 0,
        explain: 'On 5 July 2002, the Constitutional Court ruled in the Treatment Action Campaign case that the government must make nevirapine available in public hospitals.',
      },
      {
        q: 'What happened in the 2024 national election?',
        options: ['The ANC won a large majority for the first time', 'The ANC lost its majority in Parliament, and a Government of National Unity was formed', 'The election was cancelled', 'Only one party stood'],
        answer: 1,
        explain: 'The ANC won 40.18% of the vote and 159 seats. It no longer had a majority. A Government of National Unity was formed in June 2024, and Ramaphosa was re-elected as President.',
      },
      {
        q: 'Why is it important to separate confirmed events from open questions?',
        options: ['Because open questions are never important', 'Because some questions are still being decided by courts and voters, and the outcome is not yet known', 'Because history cannot be written about recent events', 'Because it is more fun'],
        answer: 1,
        explain: 'Recent events are often still developing. A careful historian labels them as open, and checks back later for the outcome.',
      },
    ],
    sides: [
      {
        kind: 'opener',
        title: 'Our Country Today',
        blocks: [
          { t: 'lead', text: 'Luchelle, this chapter is about the years when your parents and teachers were alive and living through events. It is written as carefully as possible, with clear labels for what is settled and what is still open.' },
          { t: 'anchor', when: '1994 to October 2026', where: 'South Africa, and its place in the world' },
          { t: 'interactive', name: 'timeline', title: 'The long line of time' },
        ],
      },
      {
        kind: 'page',
        title: 'Presidents since 1994',
        blocks: [
          { t: 'p', text: 'Nelson Mandela was President from 1994 to 1999. He chose to serve one term, and he worked for reconciliation. Thabo Mbeki followed, serving from 1999 to 2008. Kgalema Motlanthe was President from 2008 to 2009, and Jacob Zuma served from 2009 until he resigned in 2018.' },
          { t: 'p', text: 'Cyril Ramaphosa became President in February 2018. He was re-elected by Parliament in June 2024, after the election that year. You can match the presidents to their terms in the activity below.' },
          { t: 'interactive', name: 'match', title: 'Presidents and their terms', note: 'presidents' },
        ],
      },
      {
        kind: 'page',
        title: 'Health, HIV and a court case',
        blocks: [
          { t: 'p', text: 'HIV and AIDS caused enormous suffering in South Africa. For many years the government was slow and divided about providing [[antiretroviral]] medicine in public health services, which could keep people alive and prevent transmission to babies.' },
          { t: 'p', text: 'In 2002, the Treatment Action Campaign took the government to court. On 5 July 2002, the Constitutional Court ruled that the government must make nevirapine available in public hospitals to prevent mother-to-child transmission of HIV. Later, the government widened its treatment programme.' },
          { t: 'fact', text: 'On 5 July 2002, the Constitutional Court ruled that nevirapine must be made available in public hospitals to help prevent HIV passing from mother to child.', source: 'tac_pubmed' },
          { t: 'ask', text: 'Why might a court be needed to make sure that a government provides medicine to its people? Who else could help?' },
        ],
      },
      {
        kind: 'page',
        title: 'Progress and what is still hard',
        blocks: [
          { t: 'p', text: 'South Africa has built many things since 1994: new homes, electricity, water and schools for millions of people, a free press, an independent judiciary, and a strong Bill of Rights. Millions of people have grown up with rights that their parents did not have.' },
          { t: 'p', text: 'Other problems remain. South Africa is among the most unequal societies in the world, and unemployment is very high, especially among young people. Power cuts known as [[load-shedding]] have affected households and businesses in recent years, and many communities still lack reliable services. Gender-based violence is a national crisis that many people are working to end.' },
          { t: 'mum', text: 'Ask your child which problem in your area they would most like to see solved, and what one person can do to help. Talk about the difference between making a difference and blaming others.' },
        ],
      },
      {
        kind: 'page',
        title: 'The election of 2024',
        blocks: [
          { t: 'p', text: 'The national election was held on 29 May 2024. The ANC won 40.18% of the vote and 159 seats. It was the first time since 1994 that it did not win a majority. The Democratic Alliance won 87 seats and uMkhonto weSizwe (MK) won 58.' },
          { t: 'p', text: 'Because no party had a majority, the parties formed a [[Government of National Unity]] in June 2024. On 14 June 2024, Parliament re-elected Cyril Ramaphosa as President, by 283 votes to 54, and he was sworn in on 19 June.' },
          { t: 'fact', text: 'The 2024 election was the first in which the ANC lost its outright majority in Parliament. The ANC held 159 of the 400 seats.', source: 'wiki_2024' },
        ],
      },
      {
        kind: 'page',
        title: 'Open questions, as of October 2026',
        blocks: [
          { t: 'note', text: 'Everything in this page is dated and open. It describes what was reported up to 12 October 2026, and it is not a prediction. Check a trusted, current news source or the Parliament website for updates.' },
          { t: 'p', text: 'In September 2026, President Ramaphosa was taken ill after a summit in New Delhi and was booked off public engagements. The nature of his illness has not been made public. By late September, he was campaigning again. Reports described the matter as open, and his health and work are watched closely.' },
          { t: 'p', text: 'In May 2026 the Constitutional Court ruled that a report about the 2022 Phala Phala matter must be referred to an impeachment committee. Ramaphosa said he would not resign, and challenged the process in the Western Cape High Court, which heard the case in early September and reserved judgment. The outcome is not yet known. A court also paused the process in July 2026, according to news reports.' },
          { t: 'p', text: 'Local government elections are scheduled for 4 November 2026. On 12 October 2026, the government said it was releasing about 2.5 million hectares of state land to black farmers. Both of these are open questions. Their results will be decided by people, courts and time.' },
        ],
      },
      {
        kind: 'interactive',
        title: 'What happened, in what order?',
        blocks: [
          { t: 'p', text: 'Put these key moments in order, from earliest to latest. Each card is a confirmed event, from the first election to the 2024 result.' },
          { t: 'interactive', name: 'order', title: 'Our recent story', note: 'recent' },
        ],
      },
      {
        kind: 'quiz',
        title: 'Quick check',
        blocks: [
          { t: 'quiz' },
          { t: 'mum', text: 'Ask: what news have you heard recently about the country? Which parts are clearly known, and which parts are still being decided? How can you find out more?' },
        ],
      },
      {
        kind: 'handoff',
        title: 'What comes next is yours',
        blocks: [
          { t: 'mystery', text: 'Luchelle, you have reached the last chapter of the past. Now the book turns to you: the story is not finished, and it will need readers who ask questions, check their sources, and remember everyone who helped shape the country.' },
          { t: 'tellmore', items: [
            { q: 'What is a Government of National Unity?', a: 'A government formed by several parties working together when no single party has a majority. It requires agreement on a shared programme, and it can be fragile, so it is watched closely.' },
            { q: 'Why did the country hold elections in 2024 after no party won a majority?', a: 'The Constitution requires the National Assembly to elect the President. Elections are held every five years, and the results decide how power is shared. In 2024 the results meant that the parties had to form a coalition.' },
          ] },
        ],
      },
    ],
  },

  // ───────────────────────────── EPILOGUE ─────────────────────────────
  {
    id: 'epilogue',
    num: 'Epilogue',
    title: 'You Are Part of the Story',
    subtitle: 'A journey from the first cave-painters to today, and a certificate for you',
    accent: '#8a6a2b',
    mood: 'A path through time, and a certificate with your name on it.',
    sources: ['gen_ref', 'const_pdf'],
    quiz: [
      {
        q: 'What should you do when you read a claim in a book, a film or on the internet about the past?',
        options: ['Believe it at once', 'Ask who made it, what the evidence is, and whether other sources agree', 'Never read about history again', 'Only believe the first website you find'],
        answer: 1,
        explain: 'The three detective rules from the Prologue apply everywhere: look for evidence, ask who made the record, and be honest about gaps.',
      },
      {
        q: 'What is the minimum voting age in South Africa?',
        options: ['16', '18', '21', '25'],
        answer: 1,
        explain: 'The Constitution sets 18 as the minimum age to vote in national elections.',
      },
      {
        q: 'Which two things were the first question of this book about?',
        options: ['Ships and castles', 'Who lived here first, and how the land changed', 'Gold and diamonds only', 'Sport and music'],
        answer: 1,
        explain: 'The first question was about the people who lived here before South Africa had its name, and the story has been about how the land and its people changed.',
      },
    ],
    sides: [
      {
        kind: 'opener',
        title: 'You Are Part of the Story',
        blocks: [
          { t: 'lead', text: 'Luchelle, you have travelled from painted caves and golden rhinos, through ships, castles, islands, wars and elections, to the present day.' },
          { t: 'interactive', name: 'journey', title: 'The journey so far' },
        ],
      },
      {
        kind: 'page',
        title: 'What the journey showed',
        blocks: [
          { t: 'p', text: 'Many peoples have lived in this land for a very long time, and the first South Africans were not the Europeans who arrived by ship. Khoekhoe and San communities, farmers and herders, kingdoms like Mapungubwe, and many others, all shaped the land and its history.' },
          { t: 'p', text: 'Colonial powers, including the Dutch and British, arrived with ships, trade and force. Those arrivals changed everything. Their laws divided people, took land, and created the unfair systems that many people fought against.' },
          { t: 'p', text: 'Yet the story is not only about what was done to people. It is also about what people did for each other: the Khoekhoe who traded and adapted, the enslaved who built and kept their cultures alive, the leaders who negotiated, the students who marched, and the ordinary people who stood in queues to vote.' },
        ],
      },
      {
        kind: 'page',
        title: 'Eleven languages, one Constitution',
        blocks: [
          { t: 'p', text: 'South Africa has eleven official languages, including isiZulu, isiXhosa, Afrikaans, English, Sesotho, Setswana and others. The Constitution recognises them as equal in status, and the country has to balance its many languages in schools, courts and public life.' },
          { t: 'p', text: 'Because so many languages are spoken, the government has to publish and teach in several of them. Think about which languages you hear at home, at school and in your neighbourhood.' },
          { t: 'note', text: 'Some languages, such as those of the San and Khoekhoe peoples, have click sounds, which are written with special symbols.' },
        ],
      },
      {
        kind: 'page',
        title: 'Challenges and hopes',
        blocks: [
          { t: 'p', text: 'Today, South Africa faces serious problems: high unemployment, inequality, electricity supply problems, crime, and violence against women and children. These problems have deep roots in the past, and they will not be fixed quickly.' },
          { t: 'p', text: 'Yet the country also has courts that protect rights, a free press, active citizens, and young people who are asking hard questions. Those things are the building blocks of a fair future.' },
          { t: 'ask', text: 'What is one problem in your community that you would like to understand better? Who could you ask, and what evidence would you look for?' },
        ],
      },
      {
        kind: 'page',
        title: 'How to keep learning',
        blocks: [
          { t: 'p', text: 'Ask your grandparents, neighbours and teachers what they remember. Oral history is a powerful source, and it is often the only record of what ordinary people saw and felt.' },
          { t: 'p', text: 'Visit a museum or a heritage site, such as the Castle, Robben Island, Mapungubwe or Constitution Hill. Read a book, look at a photograph, and then ask who made it and why.' },
          { t: 'p', text: 'When you are eighteen, you will be able to vote in national elections. That is one of the most important rights in the Constitution, and it belongs to you.' },
        ],
      },
      {
        kind: 'interactive',
        title: 'Your Time-Travel Certificate',
        blocks: [
          { t: 'p', text: 'Type your name, and the book will make a certificate for you. You can save it as an image, print it, or both. Everything is stored only on this device; nothing is sent anywhere.' },
          { t: 'interactive', name: 'certificate', title: 'Luchelle’s certificate' },
        ],
      },
      {
        kind: 'handoff',
        title: 'The end of the book',
        blocks: [
          { t: 'mystery', text: 'Luchelle, the compass has finished its work. But the book is still open, and the next page is blank. Only you can fill it, with questions, with stories, and with the courage to ask who was there.' },
          { t: 'tellmore', items: [
            { q: 'Where can I read more?', a: 'Look for the source list on each page, and visit South African History Online (sahistory.org.za) for classroom-level articles. Check museums and their official websites, and ask a librarian for books written for young readers.' },
            { q: 'How do I know if a picture is real?', a: 'Look for a caption, a date, a photographer or artist, and a licence or museum record. Be careful with pictures that do not say where they came from. Artistic interpretations are labelled as such in this book.' },
          ] },
        ],
      },
    ],
  },
];
