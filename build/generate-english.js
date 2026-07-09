/* Hand-curated, vetted SEAG-standard English bank. Content is authored (not
   randomly generated) because correctness here is semantic. A structural
   verifier (verify-english.js) checks every item. */
const fs = require('fs');
const Q=[]; let c={};
function id(t){c[t]=(c[t]||0)+1;return `E-${t.toUpperCase().slice(0,3)}-${String(c[t]).padStart(2,'0')}`;}
function mcq(topic,stem,answer,distractors,explanation,skill,difficulty=2){
  const options=[answer,...distractors];
  Q.push({id:id(topic),topic,type:'mcq',difficulty,stem,options,answer,skill,explanation});
}

/* ===================== SYNONYMS & ANTONYMS ===================== */
const SYN=[
  ['happy','Glad',['Sad','Angry','Tired','Quiet']],
  ['big','Large',['Tiny','Thin','Empty','Fast']],
  ['begin','Start',['Finish','Stop','Close','End']],
  ['quick','Rapid',['Slow','Heavy','Late','Calm']],
  ['brave','Courageous',['Afraid','Weak','Gentle','Silly']],
  ['difficult','Hard',['Easy','Simple','Light','Plain']],
  ['cold','Chilly',['Warm','Hot','Mild','Boiling']],
  ['shout','Yell',['Whisper','Mutter','Sigh','Hum']],
  ['tired','Weary',['Awake','Lively','Fresh','Alert']],
  ['clever','Intelligent',['Foolish','Dull','Lazy','Slow']],
  ['enormous','Gigantic',['Tiny','Small','Narrow','Short']],
  ['purchase','Buy',['Sell','Give','Lose','Keep']],
  ['beautiful','Gorgeous',['Ugly','Plain','Dull','Drab']],
  ['strange','Peculiar',['Normal','Ordinary','Usual','Common']],
  ['reply','Respond',['Ignore','Ask','Question','Forget']],
  ['furious','Enraged',['Pleased','Calm','Content','Relaxed']],
  ['brief','Short',['Long','Lengthy','Endless','Vast']],
  ['gather','Collect',['Scatter','Drop','Spill','Lose']],
  ['ancient','Old',['Modern','New','Recent','Fresh']],
  ['famous','Renowned',['Unknown','Obscure','Hidden','Private']],
];
SYN.forEach(([w,ans,dis],i)=>mcq('synonyms',`Choose the word that means the SAME as '${w}'.`,ans,dis,`'${ans}' is a synonym of '${w}'.`,'synonyms',i<6?1:i<14?2:3));
const ANT=[
  ['hot','Cold',['Warm','Boiling','Heated','Sunny']],
  ['ancient','Modern',['Old','Aged','Historic','Past']],
  ['generous','Mean',['Kind','Giving','Caring','Helpful']],
  ['arrive','Depart',['Come','Reach','Land','Enter']],
  ['increase','Decrease',['Grow','Rise','Expand','Add']],
  ['victory','Defeat',['Win','Success','Triumph','Prize']],
  ['expand','Shrink',['Grow','Stretch','Widen','Swell']],
  ['praise','Criticise',['Admire','Applaud','Thank','Cheer']],
  ['permanent','Temporary',['Lasting','Forever','Fixed','Stable']],
  ['artificial','Natural',['Fake','False','Plastic','Man-made']],
  ['accept','Reject',['Receive','Agree','Take','Allow']],
  ['brave','Cowardly',['Bold','Fearless','Daring','Heroic']],
  ['transparent','Opaque',['Clear','Glassy','See-through','Bright']],
  ['generous','Selfish',['Giving','Kind','Warm','Caring']],
  ['ascend','Descend',['Climb','Rise','Soar','Mount']],
  ['abundant','Scarce',['Plentiful','Ample','Full','Rich']],
];
ANT.forEach(([w,ans,dis],i)=>mcq('synonyms',`Choose the word that means the OPPOSITE of '${w}'.`,ans,dis,`'${ans}' is the opposite of '${w}'.`,'antonyms',i<5?1:i<11?2:3));
// odd-one-out (word groups)
[
  ['Shout',['Whisper','Mutter','Murmur','Mumble'],'The others all mean to speak quietly; "shout" is loud.'],
  ['Oak',['Rose','Tulip','Daisy','Lily'],'The others are flowers; an oak is a tree.'],
  ['Trout',['Eagle','Robin','Sparrow','Owl'],'The others are birds; a trout is a fish.'],
  ['Copper',['Rose','Violet','Amber','Scarlet'],'The others are colours; copper is a metal (though used for a colour too, it is the odd one as a metal).'],
  ['Sprint',['Stroll','Amble','Wander','Saunter'],'The others mean to walk slowly; "sprint" means to run fast.'],
].forEach(([ans,dis,ex])=>mcq('synonyms','Which word is the ODD ONE OUT?',ans,dis,ex,'word groups',3));

/* ===================== CLOZE ===================== */
[
  ['The sun was so bright that we had to ___ our eyes.','shield',['show','share','shine','shout'],'To "shield" your eyes means to protect them from the brightness.',2],
  ['She was ___ tired that she fell asleep at once.','so',['to','two','too','though'],'"so … that" shows a result.',2],
  ['The explorers were ___ by the beauty of the ancient temple.','amazed',['amaze','amazing','amazement','amazes'],'"were amazed" is the correct verb form here.',2],
  ['Despite the rain, the match ___ ahead as planned.','went',['gone','going','goes','go'],'The past tense "went" fits after "the match".',2],
  ['The librarian asked us to speak in a ___ voice.','quiet',['loud','huge','bright','fast'],'In a library you speak in a "quiet" voice.',1],
  ['He ran quickly ___ he did not want to miss the bus.','because',['although','unless','or','but'],'"because" gives the reason.',2],
  ['The soup was ___ hot to eat straight away.','too',['to','two','so','though'],'"too hot" means excessively hot.',2],
  ['The detective searched for ___ that would solve the mystery.','clues',['clews','cluess','clue','clueing'],'"clues" is the correct plural for pieces of evidence.',2],
  ['We could not go outside ___ it was raining heavily.','because',['so','therefore','however','yet'],'"because" introduces the reason.',2],
  ['The old bridge was ___ dangerous that it was closed.','so',['too','very','more','such'],'"so … that" links to the result "it was closed".',2],
  ['She spoke ___ that no one could hear her.','quietly',['quiet','quieter','quietest','quietness'],'An adverb ("quietly") is needed to describe how she spoke.',2],
  ['If you heat ice, it ___ into water.','melts',['melt','melted','melting','molten'],'The present tense "melts" fits a general fact.',2],
  ['The knight drew his sword and ___ towards the dragon.','charged',['charge','charging','charges','charger'],'The past tense "charged" matches "drew".',2],
  ['I have ___ finished all of my homework already.','already',['all ready','allready','aready','al ready'],'"already" (one word) means by this time.',3],
  ['Neither the cat ___ the dog was in the garden.','nor',['or','and','but','so'],'"neither … nor" go together.',3],
].forEach(([stem,ans,dis,ex,d])=>mcq('cloze',stem,ans,dis,ex,'cloze',d));

/* ===================== SPELLING ===================== */
// correct spelling MCQs
[
  ['necessary',['neccessary','necesary','nesessary','neccesary'],'"Necessary" has one "c" and two "s"s.'],
  ['separate',['seperate','seperete','separete','sepparate'],'"Separate" has "a-r-a" in the middle.'],
  ['beautiful',['beutiful','beautifull','beatiful','beautful'],'"Beautiful" begins "b-e-a-u" and ends with one "l".'],
  ['February',['Febuary','Februrary','Feburary','Februairy'],'"February" has an "r" after the "b".'],
  ['rhythm',['rythm','rhythem','rythem','rhthym'],'"Rhythm" is spelled r-h-y-t-h-m.'],
  ['embarrass',['embarass','embarras','embbarrass','embarrus'],'"Embarrass" has two "r"s and two "s"s.'],
  ['occasion',['ocasion','occassion','ocassion','occaision'],'"Occasion" has two "c"s and one "s".'],
  ['definitely',['definately','definitly','definetly','defiantly'],'"Definitely" has no "a" — it comes from "finite".'],
  ['believe',['beleive','belive','beleave','baleive'],'"Believe" follows "i before e except after c".'],
  ['tomorrow',['tommorow','tomorow','tommorrow','tomoro'],'"Tomorrow" has one "m" and two "r"s.'],
  ['mischievous',['mischievious','mischevous','mischivous','mischeivous'],'"Mischievous" ends "-ievous" (no extra "i").'],
  ['weird',['wierd','weard','weeird','wired'],'"Weird" is an exception to "i before e".'],
].forEach(([ans,dis,ex])=>mcq('spelling','Which word is spelled correctly?',ans,dis,ex,'spelling',ans.length>8?3:2));
// spot the incorrect (SEAG-style, includes "No mistake" option sometimes)
[
  ['definately',['friend','because','believe','No mistake'],'The correct spelling is "definitely".'],
  ['recieve',['achieve','ceiling','receipt','No mistake'],'"Receive" follows "e before i after c" — "recieve" is wrong.'],
  ['adress',['address','arrive','appear','No mistake'],'"Address" has two "d"s — "adress" is wrong.'],
  ['libary',['library','February','ordinary','No mistake'],'"Library" has two "r"s — "libary" is wrong.'],
].forEach(([ans,dis,ex])=>mcq('spelling','Which word is spelled INCORRECTLY?',ans,dis,ex,'spelling',2));
// plurals
[
  ['baby','babies',['babys','babyes','babis','babbies'],'Consonant + "y" changes to "ies".'],
  ['knife','knives',['knifes','knifves','knive','knifs'],'Many "fe" words change to "ves".'],
  ['tomato','tomatoes',['tomatos','tomatoies','tomatose','tomattoes'],'"Tomato" adds "es" in the plural.'],
  ['child','children',['childs','childes','childrens','childern'],'"Child" has an irregular plural, "children".'],
  ['leaf','leaves',['leafs','leafes','leeves','leavs'],'"Leaf" changes "f" to "ves".'],
].forEach(([w,ans,dis,ex])=>mcq('spelling',`Which is the correct plural of '${w}'?`,ans,dis,ex,'plurals',2));

/* ===================== PUNCTUATION ===================== */
[
  ['Which sentence is punctuated correctly?','Where are you going?',['Where are you going.','where are you going?','Where are you going','where are you going'],'A question starts with a capital and ends with a question mark.','sentence punctuation',1],
  ['One dog owns the bone. Which sentence is correct?',"The dog's bone was buried.",["The dogs' bone was buried.",'The dogs bone was buried.',"The dog's bone were buried.","The dogs's bone was buried."],'For one dog, the apostrophe goes before the "s": dog\'s.','apostrophes',2],
  ['Which sentence uses commas correctly in a list?','I bought apples, pears and grapes.',['I bought apples pears and grapes.','I bought, apples pears and grapes.','I, bought apples pears, and grapes.','I bought apples, pears, and grapes,'],'Commas separate list items, with "and" before the last.','commas in lists',2],
  ['Which sentence shows speech punctuated correctly?','"Stop!" shouted the man.',['Stop! shouted the man.','"Stop! shouted the man."','"Stop"! shouted the man.','"Stop! "shouted the man.'],'The spoken words and their punctuation go inside the speech marks.','speech marks',3],
  ['Which sentence uses capital letters correctly?','We visited London in July.',['We visited london in july.','we visited London in July.','We Visited London In July.','we visited london in July.'],'Capitals begin a sentence and mark names of places and months.','capital letters',1],
  ["Which is the correct short form of 'do not'?","don't",["do'nt","dont'","d'ont",'dont'],'The apostrophe replaces the missing "o".','contractions',2],
  ['Which sentence is punctuated correctly?','It was cold, so we lit a fire.',['It was cold so, we lit a fire.','It was cold so we lit a fire,','It was, cold so we lit a fire.','It was cold; so we lit a fire.'],'A comma goes before "so" when it joins two clauses.','commas',2],
  ['Which correctly shows the book belonging to James?',"James's book",['James book',"Jame's book",'Jamess book',"James` book"],'Add apostrophe + s to show James owns the book.','apostrophes',3],
  ['Which sentence needs a question mark?','Are you coming with us',['The sky is blue','I like cheese','Close the door','The bell rang loudly'],'"Are you coming with us" is a question.','question marks',2],
  ['Which sentence is correctly punctuated?','My friends, who live nearby, came round.',['My friends who live nearby came round.','My friends, who live nearby came round.','My friends who live nearby, came round.','My, friends who live nearby came round.'],'A pair of commas separates the extra information "who live nearby".','commas for clauses',3],
  ['Where should the apostrophe go: "The childrens toys"?',"The children's toys",["The childrens' toys",'The childrens toys',"The children`s toys","The child's toys"],'"Children" is already plural, so add \'s: children\'s.','apostrophes',3],
  ['Which uses a colon correctly?','You will need: a pen, paper and a ruler.',['You will need a pen: paper and a ruler.','You: will need a pen, paper and a ruler.','You will need a pen, paper: and a ruler.','You will: need a pen, paper and a ruler.'],'A colon can introduce a list.','colons',3],
].forEach(([stem,ans,dis,ex,skill,d])=>mcq('punctuation',stem,ans,dis,ex,skill,d));

/* ===================== GRAMMAR ===================== */
[
  ["Which word is the NOUN in: 'The happy dog barked loudly.'?",'dog',['happy','barked','loudly','the'],'A noun names a person, place or thing — "dog".','word classes',1],
  ["Which word is the VERB in: 'She quickly opened the door.'?",'opened',['quickly','door','she','the'],'A verb is a doing word — "opened".','word classes',1],
  ["Which word is the ADJECTIVE in: 'The tall tree swayed.'?",'tall',['tree','swayed','the','a'],'An adjective describes a noun — "tall".','word classes',1],
  ["Which word is the ADVERB in: 'He spoke softly.'?",'softly',['spoke','he','the','a'],'An adverb describes how a verb is done — "softly".','word classes',2],
  ["Choose the correct word: 'The children ___ playing outside.'",'are',['is','was','am','be'],'"Children" is plural, so use "are".','subject-verb agreement',2],
  ["Which is the past tense of 'run'?",'ran',['runned','running','runs','run'],'"Run" is irregular: its past tense is "ran".','verb tenses',1],
  ["Choose the correct word: 'She is taller ___ her brother.'",'than',['then','that','there','thin'],'"Than" is used for comparing.','commonly confused words',2],
  ["Which pronoun best replaces 'Sara' in: 'Sara likes apples.'?",'She',['He','It','They','Her'],'"She" replaces the girl\'s name.','pronouns',2],
  ["Choose the correct plural: 'There are three ___ in the field.'",'sheep',['sheeps','sheepes','shept','sheepies'],'"Sheep" stays the same in the plural.','irregular plurals',2],
  ["Which sentence is grammatically correct?",'They were happy.',['They was happy.','They is happy.','They am happy.','They be happy.'],'"They" takes "were" in the past tense.','subject-verb agreement',1],
  ["Choose the correct word: 'I have ___ my homework.'",'done',['did','doing','does','done did'],'After "have" we use "done".','verb forms',2],
  ["Choose the correct word: 'The dog wagged ___ tail.'",'its',["it's",'its\'','it is','their'],'"Its" (no apostrophe) shows possession.','possessive pronouns',3],
  ["Which word is a CONJUNCTION in: 'I stayed in because it rained.'?",'because',['stayed','it','rained','in'],'A conjunction joins clauses — "because".','word classes',3],
  ["Choose the correct word: 'There ___ many people at the fair.'",'were',['was','is','has','be'],'"People" is plural, so use "were".','subject-verb agreement',2],
  ["Which is written in the FUTURE tense?",'I will visit my gran.',['I visited my gran.','I visit my gran.','I am visiting my gran.','I had visited my gran.'],'"will visit" shows the future.','verb tenses',2],
].forEach(([stem,ans,dis,ex,skill,d])=>mcq('grammar',stem,ans,dis,ex,skill,d));

/* ===================== VOCAB & WORD LOGIC ===================== */
[
  ['Foot is to leg as hand is to ___?','arm',['finger','glove','wrist','elbow'],'A foot is at the end of a leg; a hand is at the end of an arm.','analogies',2],
  ['Puppy is to dog as kitten is to ___?','cat',['mouse','pet','kitten','paw'],'A puppy is a young dog; a kitten is a young cat.','analogies',1],
  ["Which word means 'a person who writes books'?",'author',['reader','printer','teacher','editor'],'An "author" writes books.','word meanings',2],
  ['Hot is to cold as up is to ___?','down',['high','top','above','over'],'Hot/cold are opposites, like up/down.','analogies (opposites)',2],
  ["Which word means 'to make something better'?",'improve',['worsen','break','ignore','spoil'],'To "improve" means to make better.','word meanings',2],
  ['A place where you borrow books is a ___?','library',['bookshop','museum','gallery','office'],'You borrow books from a "library".','word meanings',1],
  ["Which word means 'happening once a year'?",'annual',['monthly','daily','weekly','hourly'],'"Annual" means once every year.','word meanings',3],
  ['Bird is to fly as fish is to ___?','swim',['water','fin','sea','scale'],'A bird flies; a fish swims.','analogies',2],
  ["Which word means 'a baby cow'?",'calf',['foal','lamb','cub','kid'],'A baby cow is a "calf".','word meanings',2],
  ['Author is to book as composer is to ___?','symphony',['orchestra','piano','concert','stage'],'An author creates a book; a composer creates a symphony (music).','analogies',3],
  ['Finger is to hand as toe is to ___?','foot',['leg','nail','sock','knee'],'Fingers are on a hand; toes are on a foot.','analogies',2],
  ["A group of wolves is called a ___?",'pack',['flock','herd','swarm','shoal'],'Wolves live in a "pack".','collective nouns',2],
  ["A group of ships is called a ___?",'fleet',['pack','flock','herd','pride'],'A group of ships is a "fleet".','collective nouns',3],
  ["Which word means 'able to be seen through'?",'transparent',['opaque','solid','hollow','coloured'],'"Transparent" means see-through.','word meanings',3],
  ['Which pair are HOMOPHONES (sound the same)?','their / there',['big / large','hot / cold','run / ran','see / look'],'"Their" and "there" sound the same but are spelled differently.','homophones',3],
].forEach(([stem,ans,dis,ex,skill,d])=>mcq('vocab',stem,ans,dis,ex,skill,d));

fs.writeFileSync('/tmp/martinedu/data/english/questions.json', JSON.stringify(Q,null,1));
const byTopic={}; Q.forEach(q=>byTopic[q.topic]=(byTopic[q.topic]||0)+1);
console.log('ENGLISH (non-comprehension) total:',Q.length); console.log(byTopic);
