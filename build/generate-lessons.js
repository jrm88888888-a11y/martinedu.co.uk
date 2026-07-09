/* Author child-friendly mini-lessons (theory + practice) for every topic that
   didn't already have one. Matches the shape of fdp.json / synonyms.json. */
const fs=require('fs'); const F=require('./figures.js');
const DIR='/tmp/martinedu/data/lessons';
function T(heading,html){return {type:'teach',heading,html};}
function P(stem,answer,opts){ // opts: {options, qtype, unit, accept, explain, figure}
  return Object.assign({type:'practice',stem,answer:String(answer)},opts);
}
function num(stem,answer,explain,extra={}){return P(stem,answer,Object.assign({qtype:'numeric',explain},extra));}
function mc(stem,answer,options,explain,extra={}){return P(stem,answer,Object.assign({options,explain},extra));}
function write(topic,subject,emoji,title,steps){
  fs.writeFileSync(`${DIR}/${topic}.json`, JSON.stringify({topic,subject,emoji,title,steps},null,1));
}
const cal='class=\'callout\'', tip='class=\'callout tip\'', ex='class=\'example-box\'';

/* ---------------- MATHS ---------------- */
write('number','maths','🔢','Number & Place Value',[
 T('Every digit has a place','<p>In a big number, <b>where</b> a digit sits tells you how much it is worth. This is called its <b>place value</b>.</p><div '+ex+'>In <b>4 573</b>:<br>4 = 4 thousands<br>5 = 5 hundreds<br>7 = 7 tens<br>3 = 3 ones</div><div '+cal+'>Each step to the LEFT is <b>10 times bigger</b>. 🔍</div>'),
 T('Rounding — find the nearest','<p>To round, look at the <b>next digit down</b>. If it is <b>5 or more</b>, round <b>up</b>. If it is <b>4 or less</b>, round <b>down</b>.</p><div '+ex+'>Round <b>48 617</b> to the nearest thousand:<br>The hundreds digit is <b>6</b> (5 or more) → round up → <b>49 000</b>. ✅</div>'),
 num('What is the value of the 6 in 3 628?',600,'The 6 is in the hundreds column, so it is worth 600.'),
 num('Round 3 486 to the nearest hundred.',3500,'The tens digit is 8 (5 or more), so round up to 3 500.',{accept:['3,500','3 500']}),
 mc('Which number is the largest?','0.91',['0.91','0.9','0.099','0.19'],'Line up the decimals: 0.91 is the biggest.'),
]);

write('ratio','maths','⚖️','Ratio & Proportion',[
 T('What a ratio means','<p>A ratio shows how much of <b>one thing</b> there is compared to <b>another</b>. The ratio <b>2 : 3</b> means "for every 2 of these, there are 3 of those".</p><div '+cal+'>🎨 Mix paint <b>2 : 3</b> → 2 tins red for every 3 tins blue.</div>'),
 T('Sharing in a ratio — the "parts" trick','<p>Add the numbers to find the <b>total parts</b>. Divide to find <b>one part</b>. Then multiply.</p><div '+ex+'>Share £<b>20</b> in the ratio <b>3 : 1</b>:<br>Parts = 3 + 1 = <b>4</b><br>One part = 20 ÷ 4 = <b>£5</b><br>First share = 3 × 5 = <b>£15</b> ✅</div>'),
 num('Share £24 between two people in the ratio 1 : 2. How much does the SECOND person get?',16,'Parts = 3, one part = £8, second person = 2 × 8 = £16.',{unit:'£',accept:['£16']}),
 num('A recipe for 4 people uses 200 g of pasta. How much is needed for 6 people?',300,'200 ÷ 4 = 50 g each, and 50 × 6 = 300 g.',{unit:'g'}),
 mc('Simplify the ratio 6 : 9.','2 : 3',['2 : 3','3 : 2','1 : 2','6 : 9'],'Divide both sides by 3: 6 : 9 = 2 : 3.'),
]);

write('algebra','maths','🧩','Algebra & Patterns',[
 T('Spot the rule','<p>A sequence follows a <b>rule</b>. Find what happens from one number to the next.</p><div '+ex+'>3, 7, 11, 15, … <br>Each time we <b>add 4</b>, so next is 15 + 4 = <b>19</b>. ✅</div><div '+tip+'>💡 Some patterns <b>multiply</b> (2, 4, 8, 16…) or are <b>square numbers</b> (1, 4, 9, 16…).</div>'),
 T('Letters stand for numbers','<p>In algebra a letter is just a <b>mystery number</b>. To find it, do the <b>opposite</b> operation.</p><div '+ex+'>Solve <b>a + 7 = 20</b>:<br>Do the opposite of +7 → subtract 7<br>a = 20 − 7 = <b>13</b> ✅</div>'),
 num('What is the next number: 5, 10, 20, 40, …?',80,'Each number doubles, so 40 × 2 = 80.'),
 num('If y = 3x + 2, what is y when x = 4?',14,'3 × 4 = 12, then 12 + 2 = 14.'),
 num('Solve: n − 6 = 9.',15,'Do the opposite of −6: 9 + 6 = 15.'),
]);

write('measures','maths','📏','Measures',[
 T('Bigger unit → smaller unit means MULTIPLY','<p>Going from a big unit to a small unit, you <b>multiply</b>.</p><div '+ex+'>1 m = 100 cm &nbsp;•&nbsp; 1 kg = 1000 g &nbsp;•&nbsp; 1 litre = 1000 ml</div><div '+cal+'>2.5 m = 2.5 × 100 = <b>250 cm</b> ✅</div>'),
 T('Perimeter and area','<p><b>Perimeter</b> = the distance all the way around (add the sides). <b>Area</b> = the space inside (length × width).</p>'+'<div class=\'figure\'>'+F.rectangle(6,4)+'</div>'+'<div '+ex+'>Perimeter = 2 × (6 + 4) = <b>20 cm</b><br>Area = 6 × 4 = <b>24 cm²</b></div>'),
 num('How many grams are there in 3 kg?',3000,'1 kg = 1000 g, so 3 × 1000 = 3000 g.',{unit:'g'}),
 num('What is the area of this rectangle?',15,'Area = 5 × 3 = 15 cm².',{unit:'cm²',figure:F.rectangle(5,3)}),
 num('How many minutes are there between 09:20 and 10:05?',45,'09:20 → 10:00 is 40 minutes, plus 5 more = 45.',{unit:'minutes'}),
]);

write('money','maths','💷','Money',[
 T('Pounds and pence','<p>There are <b>100 pence</b> in £1. Keep the decimal point lined up when you add or subtract money.</p><div '+ex+'>45p × 4 = 180p = <b>£1.80</b></div>'),
 T('Giving change','<p>Change = <b>what you gave</b> − <b>what it cost</b>.</p><div '+ex+'>Pay for a £3.60 item with £5:<br>£5.00 − £3.60 = <b>£1.40</b> ✅</div><div '+tip+'>💡 For "best value", work out the price for the <b>same amount</b> of each.</div>'),
 num('Three friends share a £24 bill equally. How much each?',8,'£24 ÷ 3 = £8.',{unit:'£',accept:['£8']}),
 num('You pay for a £2.75 item with a £5 note. How much change?',2.25,'£5.00 − £2.75 = £2.25.',{unit:'£',accept:['£2.25','2.25']}),
 mc('Which is better value?','1 kg for £3.60',['1 kg for £3.60','500 g for £2','They are the same'],'500 g for £2 is £4 per kg; 1 kg for £3.60 is cheaper.'),
]);

write('geometry','maths','📐','Shape & Space',[
 T('Angle facts to remember','<p>Angles that meet <b>on a straight line</b> add up to <b>180°</b>. Angles <b>in a triangle</b> also add up to <b>180°</b>. Angles <b>around a point</b> make <b>360°</b>.</p>'+'<div class=\'figure\'>'+F.triangleAngles(60,70)+'</div>'+'<div '+ex+'>Third angle = 180 − 60 − 70 = <b>50°</b> ✅</div>'),
 T('Coordinates: across then up','<p>We write coordinates as <b>(across, up)</b> — along the bottom first, then up the side.</p>'+'<div class=\'figure\'>'+F.coordGrid({points:[{x:3,y:2,label:'P'}],size:6})+'</div>'+'<div '+cal+'>Point P is at <b>(3, 2)</b>.</div>'),
 num('Two angles in a triangle are 50° and 60°. What is the third?',70,'180 − 50 − 60 = 70°.',{unit:'°',figure:F.triangleAngles(50,60)}),
 mc('What are the coordinates of point P?','(2, 4)',['(2, 4)','(4, 2)','(2, 2)','(4, 4)'],'Across 2, up 4 → (2, 4).',{figure:F.coordGrid({points:[{x:2,y:4,label:'P'}],size:6})}),
 num('How many lines of symmetry does a square have?',4,'A square has 4 lines of symmetry.'),
]);

write('data','maths','📊','Data & Probability',[
 T('Mean, median, mode and range','<p><b>Mean</b> = add them all, divide by how many. <b>Median</b> = the middle one in order. <b>Mode</b> = the most common. <b>Range</b> = biggest − smallest.</p><div '+ex+'>For 4, 6, 8: mean = (4+6+8) ÷ 3 = <b>6</b></div>'),
 T('Reading a bar chart','<p>Read up from the label to the top of the bar, then across to the number.</p>'+'<div class=\'figure\'>'+F.barChart({title:'Books read',cats:[{label:'Mon',value:4},{label:'Tue',value:6},{label:'Wed',value:3},{label:'Thu',value:8}],yStep:2,yMax:10})+'</div>'+'<div '+cal+'>Most books were read on <b>Thursday</b> (8).</div>'),
 num('What is the range of: 3, 9, 5, 12, 7?',9,'Range = 12 − 3 = 9.'),
 num('How many books were read in total? (Use the chart above the question.)',21,'4 + 6 + 3 + 8 = 21.',{figure:F.barChart({title:'Books read',cats:[{label:'Mon',value:4},{label:'Tue',value:6},{label:'Wed',value:3},{label:'Thu',value:8}],yStep:2,yMax:10})}),
 mc('A bag has 3 red and 2 blue balls. Probability of red?','3/5',['3/5','2/5','1/2','3/2'],'3 red out of 5 balls = 3/5.'),
]);

/* ---------------- ENGLISH ---------------- */
write('comprehension','english','📖','Reading Comprehension',[
 T('Two kinds of answer','<p>Some questions are <b>literal</b> — the answer is written right there in the text. Others are <b>inference</b> — you work it out from clues, like a detective. 🔎</p><div '+tip+'>💡 Always go <b>back to the text</b> and find the exact words that prove your answer.</div>'),
 T('Words in context','<p>If you meet a hard word, read the <b>whole sentence</b>. The other words give you clues about what it means.</p><div '+ex+'>"The <b>parched</b> traveller gulped down the water."<br>He gulped water → <b>parched</b> must mean <b>very thirsty</b>. ✅</div>'),
 mc('Read: "Maya\'s eyes lit up and she punched the air." How does Maya feel?','Delighted',['Delighted','Bored','Angry','Frightened'],'Eyes lighting up and punching the air are clues she is thrilled.'),
 mc('Read: "The abandoned house was silent and its windows were broken." The word "abandoned" means the house was:','left empty',['left empty','newly built','full of people','freshly painted'],'"Silent" and "broken windows" show no one lives there — it was left empty.'),
 mc('If a text gives facts to teach you about volcanoes, it is:','non-fiction',['non-fiction','a poem','a fairy tale','a play'],'A factual, informative text is non-fiction.'),
]);

write('cloze','english','🕳️','Cloze (Gap-fill)',[
 T('Read the whole sentence','<p>In a cloze, a word is missing. Read <b>past the gap</b> to the end — the rest of the sentence tells you which word fits.</p><div '+ex+'>"The sun was so bright we had to ___ our eyes."<br>You protect your eyes → <b>shield</b>. ✅</div>'),
 T('Watch the little words','<p>Tricky pairs catch people out: <b>too</b> (also / very), <b>to</b> (towards), <b>two</b> (2). Say the sentence in your head.</p><div '+cal+'>"The soup was <b>too</b> hot to eat." (too = more than you want)</div>'),
 mc('The library was ___ quiet that I could hear the clock.','so',['so','to','two','though'],'"so … that" links to the result.'),
 mc('We could not play outside ___ it was raining.','because',['because','although','unless','or'],'"because" gives the reason.'),
 mc('The soup was ___ hot to drink straight away.','too',['too','to','two','so'],'"too hot" means excessively hot.'),
]);

write('spelling','english','✏️','Spelling',[
 T('Handy spelling rules','<p>🔤 <b>i before e except after c</b>: bel<b>ie</b>ve, but re<b>ce</b>ive.<br>🔤 Consonant + y → <b>ies</b>: baby → bab<b>ies</b>.<br>🔤 Many "f/fe" words → <b>ves</b>: knife → kni<b>ves</b>.</p>'),
 T('Tricky words worth learning','<p>Some words just need practice. Say them in "chunks":</p><div '+ex+'>ne‑ces‑sar‑y (one c, two s)<br>sep‑a‑<b>rate</b> (there\'s <b>a rat</b> in separate!)<br>Feb‑<b>ru</b>‑ary (don\'t forget the r)</div>'),
 mc('Which word is spelled correctly?','beautiful',['beautiful','beutiful','beautifull','beatiful'],'"Beautiful" begins b-e-a-u and ends with one l.'),
 mc('Which is the correct plural of "baby"?','babies',['babies','babys','babyes','babis'],'Consonant + y changes to ies.'),
 mc('Which word is spelled INCORRECTLY?','definately',['definately','friend','believe','because'],'The correct spelling is "definitely".'),
]);

write('punctuation','english','❗','Punctuation',[
 T('Ending a sentence','<p>Every sentence <b>starts with a capital letter</b> and ends with a <b>. ? or !</b> A <b>?</b> is for questions; a <b>!</b> shows strong feeling.</p>'),
 T('The apostrophe has two jobs','<p>1) <b>Missing letters</b>: do not → do<b>n\'t</b>.<br>2) <b>Belonging</b>: the dog\'s bone (the bone of one dog).</p><div '+tip+'>💡 One owner → \'s (the girl\'s coat). More than one → s\' (the girls\' coats).</div>'),
 mc('Which sentence is correct?','Where are you going?',['Where are you going?','Where are you going.','where are you going?','Where are you going'],'A question needs a capital letter and a question mark.'),
 mc('Which shows the bone belonging to ONE dog?',"The dog's bone",["The dog's bone","The dogs' bone",'The dogs bone',"The dog`s bone"],'One dog → apostrophe before the s: dog\'s.'),
 mc('Which is the correct short form of "do not"?',"don't",["don't","do'nt","dont'",'dont'],'The apostrophe replaces the missing o.'),
]);

write('grammar','english','🔤','Grammar',[
 T('Word classes','<p><b>Noun</b> = a naming word (dog, London). <b>Verb</b> = a doing/being word (run, is). <b>Adjective</b> = describes a noun (tall). <b>Adverb</b> = describes a verb (quickly).</p><div '+ex+'>"The <u>happy</u> (adj) <u>dog</u> (noun) <u>barked</u> (verb) <u>loudly</u> (adverb)."</div>'),
 T('Making words agree','<p>The verb must match the subject. <b>One</b> thing → is/was; <b>more than one</b> → are/were.</p><div '+cal+'>The children <b>are</b> playing. (not "is")</div>'),
 mc("Which word is the VERB in: 'She quickly opened the door.'?",'opened',['opened','quickly','door','she'],'A verb is a doing word — "opened".'),
 mc("Choose the correct word: 'The children ___ playing.'",'are',['are','is','was','am'],'"Children" is plural, so use "are".'),
 mc("Which is the past tense of 'run'?",'ran',['ran','runned','running','runs'],'"Run" is irregular; its past tense is "ran".'),
]);

write('vocab','english','🧠','Vocabulary & Word Logic',[
 T('Cracking analogies','<p>An analogy shows a <b>relationship</b>. Work out how the first pair connect, then use the SAME link.</p><div '+ex+'>Puppy is to dog as kitten is to ___<br>A puppy is a baby dog → a kitten is a baby <b>cat</b>. ✅</div>'),
 T('Odd one out','<p>Find the <b>group</b> the words belong to — the odd one is the one that doesn\'t fit.</p><div '+cal+'>rose, tulip, daisy, <b>oak</b> → three flowers and one <b>tree</b>.</div>'),
 mc('Foot is to leg as hand is to ___?','arm',['arm','finger','glove','wrist'],'A foot ends a leg; a hand ends an arm.'),
 mc('Which is the ODD ONE OUT?','oak',['oak','rose','tulip','daisy'],'The others are flowers; oak is a tree.'),
 mc("Which word means 'happening once a year'?",'annual',['annual','monthly','daily','weekly'],'"Annual" means once every year.'),
]);

console.log('Lessons written to',DIR);
console.log(fs.readdirSync(DIR).join(', '));
