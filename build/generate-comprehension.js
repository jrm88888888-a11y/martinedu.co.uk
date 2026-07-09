/* Authored SEAG-standard reading passages: longer texts with literal,
   inferential and vocabulary-in-context questions. */
const fs=require('fs');
const passages=[
{
 id:'E-COMP-P1', title:'The Lighthouse Keeper', genre:'Fiction',
 text:`For forty years, Tomas had climbed the one hundred and twelve steps of the Craic Point lighthouse every evening at dusk. His legs no longer moved as quickly as they once had, and his knees complained on the cold stone, but he never missed a single night. The great lamp, he always said, did not care whether a man was young or old — it only cared whether it was lit.

On the evening the storm came, the sky turned the colour of a bruise. Rain lashed the windows and the wind screamed through the gaps in the old walls like something alive. Tomas lit the lamp as he always did and settled into his chair with a mug of tea, listening to the sea hurl itself against the rocks below.

It was almost midnight when he heard it: a thin, high sound, threading through the roar of the storm. At first he thought it was only the wind playing tricks. But it came again, and this time he was certain. It was a whistle — three short blasts, then three long ones. A ship was in trouble.

Tomas did not hesitate. He hauled the heavy signal horn from its hook and sounded a reply, then swung the lamp's beam out across the black water, sweeping it back and forth. For a heart-stopping moment he saw nothing but rain. Then, far out, a small fishing boat appeared, tipping wildly on the waves, its own light no brighter than a candle.

All through the night Tomas kept the beam moving, guiding the little boat inch by inch towards the safety of the harbour wall. By dawn the storm had blown itself out, and the boat lay bobbing gently in the calm water of the bay. Tomas, grey-faced and aching, finally allowed himself to sit down. He had not, he thought with a tired smile, missed a single night in forty years — and he did not intend to start now.`,
 questions:[
  ['How many steps did Tomas climb each evening?','One hundred and twelve',['Forty','One hundred','Twelve','A thousand'],'literal','The text says he climbed "one hundred and twelve steps".',1],
  ["What does 'the sky turned the colour of a bruise' suggest about the weather?",'It was dark and threatening',['It was bright and sunny','It was pink and pretty','It was pale and clear','It was foggy and grey'],'inference','A bruise is dark purple, suggesting a menacing, stormy sky.',3],
  ["The wind 'screamed … like something alive'. This comparison is an example of:",'a simile',['a fact','rhyme','a question','alliteration'],'language','"like something alive" compares the wind to a living thing using "like", so it is a simile.',3],
  ['What made Tomas certain a ship was in trouble?','A whistle of three short and three long blasts',['He saw the boat at once','The wind told him','His tea went cold','The lamp went out'],'literal','He heard "three short blasts, then three long ones" — a distress signal.',2],
  ["Why did the fishing boat's light look 'no brighter than a candle'?",'It was small and far away in the storm',['It was actually a candle','It had been switched off','It was daytime','It was on the harbour wall'],'inference','A real light seen from far off in rain looks tiny, showing how distant and vulnerable the boat was.',3],
  ["What does the word 'hauled' tell us about the signal horn?",'It was heavy',['It was light','It was broken','It was new'],'vocabulary','To "haul" means to pull with effort, so the horn was heavy.',2],
  ['How can we tell Tomas was dedicated to his work?','He never missed a night in forty years, even when old and tired',['He climbed the steps quickly','He disliked the sea','He slept through the storm','He built the lighthouse'],'inference','Continuing every night for forty years despite age and a storm shows great dedication.',2],
  ['Which word best describes Tomas at the end of the passage?','Exhausted but satisfied',['Frightened','Angry','Bored','Careless'],'inference','He is "grey-faced and aching" (exhausted) yet smiles, having saved the boat (satisfied).',3],
 ]
},
{
 id:'E-COMP-P2', title:'The Remarkable Octopus', genre:'Non-fiction',
 text:`Of all the creatures in the ocean, few are as astonishing as the octopus. With its soft, boneless body, eight curling arms and three hearts, it looks almost like a creature from a story. Yet everything about the octopus is real — and much of it is far stranger than fiction.

An octopus has no skeleton at all. This means it can squeeze its entire body through any gap larger than its beak, the only hard part of its body. Scientists have watched octopuses escape from tanks by slipping through holes no wider than a coin. Some have even climbed out of their tanks at night, crossed the floor, and helped themselves to fish from a neighbouring tank before returning, leaving their keepers baffled the next morning.

Perhaps the octopus's most famous trick is its ability to change colour. Special cells in its skin, called chromatophores, allow it to shift from red to brown to a mottled grey in less than a second. It uses this power to hide from predators, blending perfectly into rocks, sand or coral. It can even change the texture of its skin to look bumpy like a stone or smooth like the sea floor.

The octopus is also remarkably clever. In experiments, octopuses have learned to open jars to reach food inside, remembered the solutions weeks later, and even recognised individual human keepers. This is unusual, because most animals as intelligent as the octopus — such as dolphins and crows — live for many years. An octopus, by contrast, usually lives for only one or two.

For a creature with no bones, three hearts and blue blood, the octopus manages to be one of the cleverest hunters in the sea. It is a powerful reminder that intelligence in nature can take forms we would never expect.`,
 questions:[
  ['How many hearts does an octopus have?','Three',['One','Two','Eight','Ten'],'literal','The text says the octopus has "three hearts".',1],
  ['Why can an octopus squeeze through very small gaps?','It has no skeleton',['It is very small','It has eight arms','It can change colour','It has three hearts'],'literal','Having "no skeleton at all" lets it fit through any gap bigger than its beak.',2],
  ['What is the only hard part of an octopus?','Its beak',['Its arms','Its heart','Its skin','Its eye'],'literal','The passage calls the beak "the only hard part of its body".',1],
  ['Why were the keepers "baffled" in the morning?','They could not explain how fish had gone missing',['The octopus was ill','The tank was broken','It was very cold','The octopus had grown'],'inference','The octopus secretly took fish and returned, so the keepers were puzzled by the mystery.',3],
  ["What are 'chromatophores'?",'Cells that let the octopus change colour',['Its three hearts','Its eight arms','Its hard beak','Its blue blood'],'vocabulary','The text defines chromatophores as "special cells in its skin" that change colour.',2],
  ['Why does the writer find the octopus\'s intelligence "unusual"?','It is very clever yet lives only one or two years',['It cannot open jars','It has no brain','It never learns','It lives for many years'],'inference','Cleverness usually comes with a long life, but the octopus is clever despite a short one.',3],
  ["Which word is closest in meaning to 'astonishing'?",'Amazing',['Ordinary','Boring','Tiny','Ugly'],'vocabulary','"Astonishing" means very surprising or amazing.',2],
  ['What is the main purpose of this passage?','To inform the reader about the octopus',['To tell a made-up story','To persuade you to buy an octopus','To give instructions','To write a poem'],'inference','It presents facts to inform, making it a non-fiction, informative text.',2],
 ]
},
{
 id:'E-COMP-P3', title:'The Winter Robin', genre:'Poetry',
 text:`Upon the frosted garden gate,
A robin sits and sings,
While all the world is white and still
And snow hangs off the wings

Of every tree and every hedge;
Yet he, so small, so bold,
Puffs out his ember-coloured breast
And laughs against the cold.

No summer bird would dare to stay
When frost has locked the ground,
But he remains to guard the dark
And scatter down his sound —

A thread of song, a spark of red,
A promise, thin but true,
That even in the deepest freeze
The spring is coming through.`,
 questions:[
  ['Where is the robin sitting?','On the garden gate',['In a nest','On a rooftop','On the ground','In a hedge'],'literal','The poem opens "Upon the frosted garden gate, / A robin sits".',1],
  ["What does 'ember-coloured breast' tell us about the robin?",'Its breast is glowing red like a small fire',['Its breast is white','Its breast is grey','It has no feathers','Its breast is blue'],'vocabulary','An ember is a glowing red coal, so the robin\'s breast is fiery red.',3],
  ["The robin 'laughs against the cold'. This suggests the robin is:",'brave and cheerful',['sad and cold','tired and weak','frightened','asleep'],'inference','Laughing at the cold shows courage and cheerfulness in harsh weather.',3],
  ['According to the poem, what do "summer birds" do in winter?','They leave and do not stay',['They sing louder','They guard the garden','They turn white','They build nests'],'literal','"No summer bird would dare to stay / When frost has locked the ground".',2],
  ["What does the robin's song promise at the end of the poem?",'That spring is coming',['That it will snow more','That winter will never end','That the gate will open','That summer birds will return'],'inference','The final lines say the song is "A promise … / That … The spring is coming through."',3],
  ["'A spark of red' refers to:",'the robin',['the snow','the gate','the sun','a fire'],'inference','The robin has a red breast, so the "spark of red" is the robin itself.',3],
  ['Which pair of words in the poem rhyme?','bold / cold',['gate / sings','still / wings','tree / hedge','song / red'],'language','"bold" (line 6) rhymes with "cold" (line 8).',2],
  ['What is the overall mood of the poem?','Hopeful',['Angry','Terrified','Gloomy and hopeless','Silly'],'inference','Despite the cold, the poem ends on a promise of spring, creating a hopeful mood.',3],
 ]
},
{
 id:'E-COMP-P4', title:'Grace Darling and the Rescue', genre:'Non-fiction (biography)',
 text:`On the night of the 7th of September 1838, a fierce storm battered the coast of Northumberland in the north of England. In the darkness, a passenger steamship called the Forfarshire struck the rocks near the Farne Islands and broke apart. Many people were lost to the freezing sea, but a small group of survivors managed to cling to a bare rock, soaked and shivering, waiting desperately for help that seemed unlikely to come.

From the window of the nearby Longstone Lighthouse, a twenty-two-year-old woman named Grace Darling spotted the wreck at first light. Her father, William, was the lighthouse keeper. Together they could see the survivors, but the sea was so wild that the lifeboat from the mainland could not be launched. If anyone was going to reach the rock, it would have to be them.

Grace and her father climbed into their small wooden rowing boat, called a coble, and set out into the towering waves. Grace pulled at the oars with all her strength while her father prepared to haul people aboard. The journey was terrifying and exhausting, and more than once it seemed the little boat might be swallowed by the sea. Yet they reached the rock, and over two dangerous trips they carried nine survivors back to the safety of the lighthouse.

News of the rescue spread quickly across the country. Grace became famous almost overnight. People sent her letters, gifts and money, and artists queued to paint her portrait. Yet by all accounts Grace remained modest, insisting she had only done what anyone in her position ought to have done. She died just four years later, at the age of twenty-six, but her courage was never forgotten. Today she is remembered as one of the bravest heroines in British history.`,
 questions:[
  ['What was the name of the ship that was wrecked?','The Forfarshire',['The Longstone','The Farne','The Northumberland','The Coble'],'literal','The passage names the "passenger steamship called the Forfarshire".',1],
  ['How old was Grace Darling at the time of the rescue?','Twenty-two',['Twenty-six','Eighteen','Thirty','Sixteen'],'literal','She is described as "a twenty-two-year-old woman".',1],
  ['Why could the mainland lifeboat not help the survivors?','The sea was too wild to launch it',['It was too far away','It was broken','No one wanted to help','It was night time'],'literal','"the sea was so wild that the lifeboat from the mainland could not be launched".',2],
  ["What is a 'coble'?",'A small wooden rowing boat',['A lighthouse','A large steamship','A type of rock','A rope'],'vocabulary','The text explains they used "their small wooden rowing boat, called a coble".',2],
  ['How do we know the rescue was extremely dangerous?','More than once the boat nearly sank in the huge waves',['They went in the daytime','They only made one short trip','The sea was calm','They used a large lifeboat'],'inference','The text says "more than once it seemed the little boat might be swallowed by the sea".',2],
  ['How many survivors did Grace and her father rescue in total?','Nine',['Two','Seven','Twelve','Twenty-two'],'literal','They "carried nine survivors back to the safety of the lighthouse".',2],
  ["What does the passage tell us about Grace's character after she became famous?",'She stayed modest about what she had done',['She became proud and boastful','She stopped helping others','She moved to the city','She refused all letters'],'inference','She "remained modest, insisting she had only done what anyone … ought to have done".',3],
  ["Which word is closest in meaning to 'fierce' as used in the passage?",'Violent',['Gentle','Warm','Quiet','Brief'],'vocabulary','A "fierce" storm is a violent, powerful one.',2],
 ]
},
];
// attach shape: each question [stem, answer, distractors, skill, explanation, difficulty]
const out=passages.map(p=>({
  id:p.id, title:p.title, genre:p.genre, text:p.text,
  questions:p.questions.map(([stem,answer,dis,skill,explanation,difficulty])=>({
    type:'mcq', difficulty, stem, options:[answer,...dis], answer, skill, explanation
  }))
}));
fs.writeFileSync('/tmp/martinedu/data/english/comprehension.json', JSON.stringify(out,null,1));
console.log('COMPREHENSION passages:',out.length,'| questions:',out.reduce((a,p)=>a+p.questions.length,0));
