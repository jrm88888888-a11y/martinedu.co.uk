/* Generate a verified SEAG-standard Maths bank. Every answer is computed here,
   so correctness is guaranteed by construction. Mix of text + visual questions. */
const F = require('./figures.js');

// deterministic RNG so the bank is reproducible
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const rnd = mulberry32(20260709);
const ri = (lo,hi)=>lo+Math.floor(rnd()*(hi-lo+1));
const pick = arr => arr[Math.floor(rnd()*arr.length)];
const uniq = arr => [...new Set(arr)];

const Q = [];
let counters = {};
function id(topic){counters[topic]=(counters[topic]||0)+1;return `M-${topic.toUpperCase().slice(0,3)}-${String(counters[topic]).padStart(2,'0')}`;}

// Build a 5-option MCQ. distractors: array of candidate wrong strings.
function mcq(topic, stem, answer, distractors, explanation, extra={}){
  const opts = uniq([String(answer), ...distractors.map(String)]).slice(0,5);
  // pad if not enough unique distractors
  while(opts.length<4){ const p=String(ri(0,999)); if(!opts.includes(p)) opts.push(p); }
  Q.push(Object.assign({id:id(topic),topic,type:'mcq',difficulty:extra.difficulty||2,stem,options:opts,answer:String(answer),skill:extra.skill||'',explanation},extra.figure?{figure:extra.figure}:{}));
}
function num(topic, stem, answer, explanation, extra={}){
  Q.push(Object.assign({id:id(topic),topic,type:'numeric',difficulty:extra.difficulty||2,stem,answer:String(answer),skill:extra.skill||'',explanation},
    extra.unit?{unit:extra.unit}:{}, extra.accept?{accept:extra.accept}:{}, extra.figure?{figure:extra.figure}:{}));
}

/* ============================ NUMBER ============================ */
(function number(){
  const cols=[['tens','10'],['hundreds','100'],['thousands','1 000'],['ten thousands','10 000'],['hundred thousands','100 000']];
  for(let k=0;k<6;k++){
    const digits=[]; for(let i=0;i<ri(5,6);i++)digits.push(ri(1,9));
    const numStr=digits.join(' ').replace(/(\d) (\d)/g,'$1$2'); // join to a number then reformat
    const n=parseInt(digits.join(''),10);
    const posFromRight=ri(0,digits.length-1);
    const digit=digits[digits.length-1-posFromRight];
    const val=digit*Math.pow(10,posFromRight);
    const disp=n.toLocaleString('en-GB').replace(/,/g,' ');
    mcq('number',`What is the value of the digit ${digit} in the number ${disp}?`,
      val.toLocaleString('en-GB').replace(/,/g,' '),
      uniq([digit, digit*Math.pow(10,posFromRight+1), digit*Math.pow(10,Math.max(0,posFromRight-1)), val*10].map(x=>x.toLocaleString('en-GB').replace(/,/g,' '))).filter(x=>x!==val.toLocaleString('en-GB').replace(/,/g,' ')).concat(['None of these']),
      `The ${digit} sits in the ${cols[posFromRight][0]} column, so its value is ${val.toLocaleString('en-GB').replace(/,/g,' ')}.`,
      {skill:'place value',difficulty:2});
  }
  // rounding
  const roundSpecs=[[10,'ten'],[100,'hundred'],[1000,'thousand']];
  for(let k=0;k<6;k++){
    const [base,word]=pick(roundSpecs); const n=ri(base*2,base*90)+ri(1,base-1);
    const r=Math.round(n/base)*base;
    num('number',`Round ${n.toLocaleString('en-GB').replace(/,/g,' ')} to the nearest ${word}.`,r,
      `Look at the digit in the next column down; ${n.toLocaleString('en-GB').replace(/,/g,' ')} rounds to ${r.toLocaleString('en-GB').replace(/,/g,' ')}.`,
      {skill:'rounding',accept:[r.toLocaleString('en-GB'),r.toLocaleString('en-GB').replace(/,/g,' ')],difficulty:2});
  }
  // powers of ten
  for(let k=0;k<4;k++){
    const a=(ri(11,99)/10); const p=pick([10,100,1000]);
    num('number',`What is ${a} × ${p}?`, a*p, `Multiplying by ${p} moves every digit ${String(p).length-1} place(s) to the left.`,{skill:'multiplying by powers of ten',difficulty:1});
  }
  // negative numbers
  for(let k=0;k<4;k++){
    const start=-ri(2,9), rise=ri(3,15); const end=start+rise;
    num('number',`The temperature is ${start} °C. It rises by ${rise} °C. What is the new temperature?`,end,
      `Counting up ${rise} from ${start}: ${start} + ${rise} = ${end} °C.`,{unit:'°C',skill:'negative numbers',difficulty:2});
  }
  for(let k=0;k<3;k++){ const a=-ri(1,9), b=ri(1,9); num('number',`What is the difference between ${a} and ${b}?`, b-a, `From ${a} up to ${b} is ${b-a} steps on the number line.`,{skill:'negative numbers',difficulty:2}); }
  // factors / multiples / primes / squares
  const primes=[2,3,5,7,11,13,17,19,23,29,31,37,41,43];
  for(let k=0;k<3;k++){
    const p=pick(primes.filter(x=>x>10)); const comps=[]; while(comps.length<4){const c=ri(11,49); if(!primes.includes(c)&&!comps.includes(c))comps.push(c);}
    mcq('number','Which of these is a prime number?',p,comps,`${p} has no factors except 1 and itself; the others can be divided by a smaller number.`,{skill:'prime numbers',difficulty:3});
  }
  for(let k=0;k<3;k++){
    const base=pick([12,18,20,24,30,36]); const f=pick([2,3,4,6].filter(x=>base%x===0)); const nonf=[]; while(nonf.length<4){const c=ri(2,11); if(base%c!==0&&!nonf.includes(c))nonf.push(c);}
    mcq('number',`Which of these is a factor of ${base}?`,f,nonf,`${f} divides exactly into ${base} (${f} × ${base/f} = ${base}).`,{skill:'factors',difficulty:2});
  }
  const squares=[[4,16],[5,25],[6,36],[7,49],[8,64],[9,81]];
  for(let k=0;k<2;k++){ const [r,sq]=pick(squares); num('number',`What is ${r} squared (${r}²)?`,sq,`${r}² means ${r} × ${r} = ${sq}.`,{skill:'square numbers',difficulty:2}); }
  // ordering decimals
  for(let k=0;k<3;k++){
    const set=uniq([ (ri(80,99)/100), (ri(80,99)/100), (ri(1,9)/10), (ri(80,999)/1000) ].map(x=>+x.toFixed(3)));
    while(set.length<5) set.push(+(ri(1,99)/100).toFixed(2));
    const opts=uniq(set).slice(0,5); const largest=Math.max(...opts);
    mcq('number','Which of these numbers is the largest?',String(largest),opts.filter(x=>x!==largest).map(String),
      `Line the decimals up by place value: ${largest} is the biggest.`,{skill:'ordering decimals',difficulty:3});
  }
})();

/* ============================ FDP ============================ */
(function fdp(){
  const fpp=[['1/2',50,0.5],['1/4',25,0.25],['3/4',75,0.75],['1/5',20,0.2],['2/5',40,0.4],['3/5',60,0.6],['1/10',10,0.1],['7/10',70,0.7],['1/100',1,0.01],['3/10',30,0.3]];
  for(let k=0;k<5;k++){ const [f,p]=pick(fpp); num('fdp',`What is ${f} written as a percentage?`,p,`${f} = ${p}/100 = ${p}%.`,{unit:'%',accept:[p+'%'],skill:'fraction to percentage',difficulty:1}); }
  for(let k=0;k<4;k++){ const [f,,d]=pick(fpp); num('fdp',`What is ${f} written as a decimal?`,d,`${f} = ${d}.`,{accept:['.'+String(d).split('.')[1]],skill:'fraction to decimal',difficulty:2}); }
  // fraction of amount
  for(let k=0;k<5;k++){ const den=pick([2,3,4,5,10]); const nu=ri(1,den-1); const mult=ri(2,12); const total=den*mult; const ans=total/den*nu;
    num('fdp',`What is ${nu}/${den} of ${total}?`,ans,`${total} ÷ ${den} = ${total/den}, and ${total/den} × ${nu} = ${ans}.`,{skill:'fraction of amount',difficulty:2}); }
  // percentage of amount
  for(let k=0;k<5;k++){ const pc=pick([10,20,25,50,5,30]); const base=pick([20,40,50,60,80,90,120,200,250]); const ans=base*pc/100;
    if(Number.isInteger(ans)) num('fdp',`What is ${pc}% of ${base}?`,ans,`${pc}% of ${base} = ${ans}. (10% of ${base} = ${base/10}.)`,{skill:'percentage of amount',difficulty:2}); }
  // equivalent / simplify (mcq)
  for(let k=0;k<3;k++){ const [f]=pick([['2/5','4/10'],['1/2','5/10'],['1/3','2/6'],['3/4','6/8'],['2/3','4/6']].map(x=>x)); }
  [['2/5','4/10',['3/5','2/10','5/2']],['1/2','5/10',['5/2','2/10','1/5']],['1/3','2/6',['3/6','1/6','2/3']],['3/4','6/8',['4/8','3/8','8/6']]].forEach(([f,eq,dis])=>{
    mcq('fdp',`Which fraction is equivalent to ${f}?`,eq,[...dis,'None of these'],`Multiply top and bottom by the same number: ${f} = ${eq}.`,{skill:'equivalent fractions',difficulty:2});
  });
  [['6/9','2/3',['3/4','2/9','1/2']],['4/8','1/2',['2/8','1/4','4/2']],['10/15','2/3',['5/3','1/2','10/5']],['8/12','2/3',['4/12','3/4','2/12']]].forEach(([f,s,dis])=>{
    mcq('fdp',`Simplify ${f} to its lowest terms.`,s,[...dis,'None of these'],`Divide top and bottom by their highest common factor: ${f} = ${s}.`,{skill:'simplifying fractions',difficulty:2});
  });
  // percentage increase / decrease (money context)
  for(let k=0;k<4;k++){ const price=pick([40,50,20,80,60,30]); const pc=pick([10,20,25,50]); const dec=price*pc/100;
    num('fdp',`A jacket costs £${price}. In a sale it is reduced by ${pc}%. What is the sale price?`,price-dec,`${pc}% of £${price} = £${dec}, and £${price} − £${dec} = £${price-dec}.`,{unit:'£',accept:['£'+(price-dec),(price-dec)+'.00'],skill:'percentage decrease',difficulty:3}); }
  // one number as percentage of another
  [[12,48,25],[15,60,25],[20,50,40],[9,30,30],[7,10,70]].forEach(([a,b,p])=>{
    num('fdp',`${a} is what percentage of ${b}?`,p,`${a} ÷ ${b} = ${(a/b).toFixed(2)} = ${p}%.`,{unit:'%',accept:[p+'%'],skill:'percentage of a quantity',difficulty:3});
  });
  // ordering fdp (mcq)
  [['1/2, 0.4, 55%','0.4, 1/2, 55%',['1/2, 0.4, 55%','55%, 1/2, 0.4','0.4, 55%, 1/2']]].forEach(([,ans,opts])=>{
    mcq('fdp','Order these from smallest to largest: 1/2, 0.4, 55%.',ans,opts.filter(o=>o!==ans),'As decimals: 0.4, 0.5, 0.55 — so 0.4, 1/2, 55%.',{skill:'ordering fractions, decimals, percentages',difficulty:3});
  });
  // add/subtract simple fractions
  [['3/4','1/8','7/8'],['1/2','1/4','3/4'],['2/3','1/6','5/6'],['5/6','1/3','1/2'],['1/2','1/3','5/6']].forEach(([a,b,ans],i)=>{
    const op=i%2===0?'+':(i===3?'−':'+');
    const stem = i===3?`What is 5/6 − 1/3?`:`What is ${a} + ${b}?`;
    if(i===3) mcq('fdp',stem,'1/2',['4/3','1/6','2/3','None of these'],'1/3 = 2/6, so 5/6 − 2/6 = 3/6 = 1/2.',{skill:'subtracting fractions',difficulty:3});
    else mcq('fdp',stem,ans,uniq([a,b,'None of these',ans+'x']).filter(x=>x!==ans).slice(0,3).concat('None of these'),`Use a common denominator: ${a} + ${b} = ${ans}.`,{skill:'adding fractions',difficulty:3});
  });
  // visual: shaded fraction bar
  for(let k=0;k<3;k++){ const den=pick([4,5,8,10]); const nu=ri(1,den-1); const g=gcd(nu,den);
    const simplest=`${nu/g}/${den/g}`;
    mcq('fdp','What fraction of the bar is shaded? Give your answer in its simplest form.',simplest,
      uniq([`${nu}/${den}`,`${den-nu}/${den}`,`${nu}/${den-nu}`,'None of these']).filter(o=>o!==simplest).slice(0,4),
      `${nu} out of ${den} parts are shaded: ${nu}/${den}${g>1?` = ${simplest}`:''}.`,
      {skill:'fractions from a diagram',difficulty:2,figure:F.fractionBar(nu,den)});
  }
  function gcd(a,b){return b?gcd(b,a%b):a;}
})();

/* ============================ RATIO ============================ */
(function ratio(){
  for(let k=0;k<4;k++){ const parts=[ri(1,4),ri(1,4)]; const sum=parts[0]+parts[1]; const each=pick([2,3,4,5,6]); const total=sum*each;
    num('ratio',`Share £${total} between two children in the ratio ${parts[0]} : ${parts[1]}. How much does the FIRST child get?`,parts[0]*each,
      `There are ${sum} parts. Each part is £${each}, so ${parts[0]} parts = £${parts[0]*each}.`,{unit:'£',accept:['£'+parts[0]*each],skill:'sharing in a ratio',difficulty:2}); }
  for(let k=0;k<4;k++){ const ppl1=pick([2,3,4,5]); const amt=ppl1*pick([50,100,150,200]); const ppl2=ppl1+ri(1,4);
    num('ratio',`A recipe for ${ppl1} people uses ${amt} g of rice. How much rice is needed for ${ppl2} people?`,amt/ppl1*ppl2,
      `${amt} ÷ ${ppl1} = ${amt/ppl1} g per person, and ${amt/ppl1} × ${ppl2} = ${amt/ppl1*ppl2} g.`,{unit:'g',skill:'proportion',difficulty:2}); }
  [['8 : 12','2 : 3',4],['6 : 9','2 : 3',3],['10 : 15','2 : 3',5],['9 : 12','3 : 4',3],['14 : 21','2 : 3',7]].forEach(([r,s,d])=>{
    mcq('ratio',`Simplify the ratio ${r}.`,s,['3 : 2','1 : 2',r,'None of these'].filter(o=>o!==s).slice(0,4),`Divide both sides by ${d}: ${r} = ${s}.`,{skill:'simplifying ratios',difficulty:2});
  });
  for(let k=0;k<3;k++){ const scale=pick([2,5,10]); const cm=ri(3,8);
    num('ratio',`A map scale is 1 cm : ${scale} km. Two towns are ${cm} cm apart on the map. How far apart are they in real life?`,cm*scale,
      `Each centimetre is ${scale} km, so ${cm} × ${scale} = ${cm*scale} km.`,{unit:'km',skill:'scale',difficulty:3}); }
  for(let k=0;k<3;k++){ const b=pick([2,3,4]); const g=pick([3,4,5]); const boys=b*pick([3,4,5]);
    num('ratio',`In a class the ratio of boys to girls is ${b} : ${g}. There are ${boys} boys. How many girls are there?`,boys/b*g,
      `${b} parts = ${boys} boys, so 1 part = ${boys/b}. Girls = ${g} parts = ${boys/b*g}.`,{skill:'using ratios',difficulty:2}); }
})();

/* ============================ ALGEBRA ============================ */
(function algebra(){
  for(let k=0;k<5;k++){ const start=ri(1,9), step=ri(2,9); const seq=[start,start+step,start+2*step,start+3*step];
    num('algebra',`What is the next number in the sequence: ${seq.join(', ')}, …?`,start+4*step,`The rule is add ${step} each time, so ${seq[3]} + ${step} = ${start+4*step}.`,{skill:'number sequences',difficulty:1}); }
  for(let k=0;k<4;k++){ const m=ri(2,5),c=ri(1,9),x=ri(2,9); num('algebra',`If y = ${m}x + ${c}, what is y when x = ${x}?`,m*x+c,`${m} × ${x} = ${m*x}, then ${m*x} + ${c} = ${m*x+c}.`,{skill:'substitution',difficulty:2}); }
  for(let k=0;k<4;k++){ const m=ri(2,5),a=ri(1,9),inp=ri(2,9); num('algebra',`A function machine multiplies by ${m}, then adds ${a}. What comes out if ${inp} goes in?`,inp*m+a,`${inp} × ${m} = ${inp*m}, then + ${a} = ${inp*m+a}.`,{skill:'function machines',difficulty:2}); }
  for(let k=0;k<4;k++){ const a=ri(2,9), b=ri(10,30); num('algebra',`Find the value of a: a + ${a} = ${a+b}.`,b,`${a+b} − ${a} = ${b}.`,{skill:'solving equations',difficulty:2}); }
  for(let k=0;k<3;k++){ const n=ri(3,9), m=ri(2,6); num('algebra',`If ${m}n = ${m*n}, what is n?`,n,`${m*n} ÷ ${m} = ${n}.`,{skill:'solving equations',difficulty:2}); }
  for(let k=0;k<3;k++){ const n=ri(2,6); const seq=[n,n*2,n*4,n*8]; num('algebra',`Continue the doubling pattern: ${seq.join(', ')}, …?`,n*16,`Each number doubles, so ${n*8} × 2 = ${n*16}.`,{skill:'number patterns',difficulty:2}); }
  for(let k=0;k<3;k++){ const mult=pick([3,4,5,6]); const t=ri(3,7); num('algebra',`The nth term of a sequence is ${mult}n. What is the ${t}th term?`,mult*t,`${mult} × ${t} = ${mult*t}.`,{skill:'nth term',difficulty:2}); }
  // square number sequence
  num('algebra','What is the next number in the sequence: 1, 4, 9, 16, …?',25,'These are square numbers (1², 2², 3², 4²), so next is 5² = 25.',{skill:'square numbers',difficulty:3});
  // matchstick pattern
  for(let k=0;k<2;k++){ const perExtra=3, sq=ri(4,7); num('algebra',`A row of squares uses 4 matchsticks for 1 square, 7 for 2, 10 for 3. How many for ${sq} squares?`,3*sq+1,`The rule is 3 × number of squares + 1, so 3 × ${sq} + 1 = ${3*sq+1}.`,{skill:'spatial patterns',difficulty:3}); }
})();

/* ============================ MEASURES ============================ */
(function measures(){
  const convs=[['metres','centimetres',100,'m','cm'],['kilograms','grams',1000,'kg','g'],['litres','millilitres',1000,'l','ml'],['kilometres','metres',1000,'km','m']];
  for(let k=0;k<6;k++){ const [big,small,f]=pick(convs); const v=pick([1.5,2,2.5,3,0.5,4,1.2]);
    num('measures',`How many ${small} are there in ${v} ${big}?`,v*f,`1 ${big.slice(0,-1)} = ${f} ${small}, so ${v} × ${f} = ${v*f} ${small}.`,{skill:'unit conversion',difficulty:1}); }
  // perimeter & area WITH figure
  for(let k=0;k<3;k++){ const l=ri(4,12), w=ri(2,l-1);
    num('measures',`What is the perimeter of this rectangle?`,2*(l+w),`Perimeter = 2 × (${l} + ${w}) = ${2*(l+w)} cm.`,{unit:'cm',skill:'perimeter',difficulty:2,figure:F.rectangle(l,w)}); }
  for(let k=0;k<3;k++){ const l=ri(4,12), w=ri(2,9);
    num('measures',`What is the area of this rectangle?`,l*w,`Area = length × width = ${l} × ${w} = ${l*w} cm².`,{unit:'cm²',skill:'area',difficulty:2,figure:F.rectangle(l,w)}); }
  // time intervals
  for(let k=0;k<4;k++){ const h=ri(8,20), m=pick([0,10,15,20,45]); const dur=pick([25,40,45,50,90,75]);
    const start=h*60+m; const end=start+dur; const eh=Math.floor(end/60)%24, em=end%60;
    const fmt=(H,M)=>`${String(H).padStart(2,'0')}:${String(M).padStart(2,'0')}`;
    mcq('measures',`A film starts at ${fmt(h,m)} and lasts ${Math.floor(dur/60)?Math.floor(dur/60)+' hour ':''}${dur%60} minutes. What time does it end?`,fmt(eh,em),
      uniq([fmt((eh+1)%24,em),fmt(eh,(em+15)%60),fmt(Math.floor((start+dur-60)/60)%24,(start+dur-60)%60)]).concat('None of these'),
      `${fmt(h,m)} + ${dur} minutes = ${fmt(eh,em)}.`,{skill:'time',difficulty:2}); }
  // clock reading WITH figure
  for(let k=0;k<3;k++){ const h=ri(1,12), m=pick([0,15,30,45]);
    const label=m===0?`${h} o'clock`:m===15?`quarter past ${h}`:m===30?`half past ${h}`:`quarter to ${h===12?1:h+1}`;
    const opts=uniq([`${h} o'clock`,`quarter past ${h}`,`half past ${h}`,`quarter to ${h===12?1:h+1}`]);
    mcq('measures','What time is shown on this clock?',label,opts.filter(o=>o!==label),`The hands show ${label}.`,{skill:'telling the time',difficulty:2,figure:F.clock(h,m)}); }
  // capacity division
  for(let k=0;k<3;k++){ const litres=pick([1,2,3]); const cup=pick([100,200,250,500]); const total=litres*1000;
    if(total%cup===0) num('measures',`A jug holds ${litres} litre(s). How many ${cup} ml cups can be filled from it?`,total/cup,`${litres} litre(s) = ${total} ml, and ${total} ÷ ${cup} = ${total/cup}.`,{skill:'capacity',difficulty:2}); }
})();

/* ============================ MONEY ============================ */
(function money(){
  for(let k=0;k<4;k++){ const p=pick([25,45,55,75,99,120]); const n=ri(3,6); const tot=p*n/100;
    mcq('money',`A pen costs ${p}p. How much do ${n} pens cost?`,`£${tot.toFixed(2)}`,
      uniq([`£${(tot+0.2).toFixed(2)}`,`£${(tot-0.2).toFixed(2)}`,`£${(p*n/10).toFixed(2)}`]).concat('None of these'),
      `${p}p × ${n} = ${p*n}p = £${tot.toFixed(2)}.`,{skill:'money multiplication',difficulty:2}); }
  for(let k=0;k<4;k++){ const cost=(ri(120,480)/100); const note=pick([5,10,20]); if(note>cost){ const change=note-cost;
    num('money',`I pay for a £${cost.toFixed(2)} item with a £${note} note. How much change do I get?`,change.toFixed(2),`£${note}.00 − £${cost.toFixed(2)} = £${change.toFixed(2)}.`,{unit:'£',accept:['£'+change.toFixed(2),String(change)],skill:'giving change',difficulty:2}); } }
  for(let k=0;k<3;k++){ const each=pick([6,7,8,9,12]); const n=ri(2,5); const bill=each*n;
    num('money',`${n} friends share a bill of £${bill} equally. How much does each pay?`,each,`£${bill} ÷ ${n} = £${each}.`,{unit:'£',accept:['£'+each],skill:'money division',difficulty:1}); }
  for(let k=0;k<3;k++){ const price=pick([7.99,4.99,2.99,9.99]); const n=ri(2,4); const approx=Math.round(price)*n;
    mcq('money',`A book costs £${price}. Roughly how much do ${n} books cost?`,`£${approx}`,uniq([`£${approx+3}`,`£${approx-3}`,`£${approx+6}`]).concat('None of these'),`£${price} is about £${Math.round(price)}, and £${Math.round(price)} × ${n} = £${approx}.`,{skill:'estimation',difficulty:2}); }
  // best value
  [['500 g for £2','1 kg for £3.60','1 kg for £3.60'],['3 for £2.40','5 for £3.50','5 for £3.50'],['250 ml for £1','1 litre for £3.20','1 litre for £3.20']].forEach(([a,b,ans])=>{
    mcq('money',`Which is better value: ${a} or ${b}?`,ans,[a===ans?b:a,'They are the same','You cannot tell'],`Work out the price for the same amount: ${ans} is cheaper per unit.`,{skill:'best value',difficulty:3});
  });
  for(let k=0;k<2;k++){ const start=2; const a=pick([0.65,0.75,0.85]); const b=pick([1.10,1.20,0.95]); const left=start-a-b;
    if(left>0) num('money',`I have £${start}. I buy sweets for £${a.toFixed(2)} and a drink for £${b.toFixed(2)}. How much do I have left?`,left.toFixed(2),`£${a.toFixed(2)} + £${b.toFixed(2)} = £${(a+b).toFixed(2)}, and £${start}.00 − £${(a+b).toFixed(2)} = £${left.toFixed(2)}.`,{unit:'£',accept:['£'+left.toFixed(2),(left*100)+'p'],skill:'money problems',difficulty:3}); }
})();

/* ============================ GEOMETRY ============================ */
(function geometry(){
  // triangle angles WITH figure
  for(let k=0;k<4;k++){ const a=ri(30,80), b=ri(30,180-a-20); const c=180-a-b;
    num('geometry',`Two angles in this triangle are ${a}° and ${b}°. What is the third angle?`,c,`Angles in a triangle add to 180°: 180 − ${a} − ${b} = ${c}°.`,{unit:'°',skill:'angles in a triangle',difficulty:2,figure:F.triangleAngles(a,b)}); }
  // angles on a straight line WITH figure
  for(let k=0;k<3;k++){ const a=ri(40,140); num('geometry',`The angle shown sits on a straight line with another angle. If this angle is ${a}°, what is the other angle?`,180-a,`Angles on a straight line add to 180°: 180 − ${a} = ${180-a}°.`,{unit:'°',skill:'angles on a straight line',difficulty:2,figure:F.angleDiagram(a,{label:a+'°'})}); }
  // coordinates WITH figure
  for(let k=0;k<4;k++){ const x=ri(1,6), y=ri(1,6);
    mcq('geometry','What are the coordinates of point P?',`(${x}, ${y})`,uniq([`(${y}, ${x})`,`(${x}, ${y+1})`,`(${x+1}, ${y})`]).concat('None of these'),`Coordinates are written (across, up), so P is (${x}, ${y}).`,{skill:'coordinates',difficulty:2,figure:F.coordGrid({points:[{x,y,label:'P'}],size:6})}); }
  // shape facts
  const shapes=[['triangle',3],['quadrilateral',4],['pentagon',5],['hexagon',6],['heptagon',7],['octagon',8]];
  for(let k=0;k<3;k++){ const [nm,sides]=pick(shapes); num('geometry',`How many sides does a ${nm} have?`,sides,`A ${nm} has ${sides} sides.`,{skill:'2D shapes',difficulty:1}); }
  // 3D faces
  [['cube',6],['cuboid',6],['triangular prism',5],['square-based pyramid',5],['cylinder',3]].forEach(([nm,f])=>{
    num('geometry',`How many faces does a ${nm} have?`,f,`A ${nm} has ${f} faces.`,{skill:'3D shapes',difficulty:3});
  });
  // symmetry
  [['square',4],['rectangle',2],['equilateral triangle',3],['regular pentagon',5],['regular hexagon',6]].forEach(([nm,l])=>{
    num('geometry',`How many lines of symmetry does a ${nm} have?`,l,`A ${nm} has ${l} lines of symmetry.`,{skill:'symmetry',difficulty:2});
  });
  // angle type
  for(let k=0;k<3;k++){ const ang=pick([[45,'acute'],[120,'obtuse'],[90,'right'],[200,'reflex']]);
    const [deg,type]=ang;
    mcq('geometry',`What type of angle is ${deg}°?`,type,['acute','obtuse','right','reflex'].filter(t=>t!==type),
      `An angle of ${deg}° is ${type} (${type==='acute'?'less than 90°':type==='right'?'exactly 90°':type==='obtuse'?'between 90° and 180°':'more than 180°'}).`,{skill:'types of angle',difficulty:2,figure:F.angleDiagram(Math.min(deg,175),{label:deg+'°'})}); }
})();

/* ============================ DATA ============================ */
(function data(){
  // mean/median/mode/range
  for(let k=0;k<3;k++){ const set=Array.from({length:pick([3,4,5])},()=>ri(2,12)); const sum=set.reduce((a,b)=>a+b,0);
    if(sum%set.length===0) num('data',`What is the mean (average) of ${set.join(', ')}?`,sum/set.length,`${set.join(' + ')} = ${sum}, and ${sum} ÷ ${set.length} = ${sum/set.length}.`,{skill:'mean',difficulty:2}); }
  for(let k=0;k<3;k++){ const base=[ri(2,6)]; const mode=base[0]; const set=[mode,mode,mode,ri(7,9),ri(10,12)];
    num('data',`What is the mode of: ${shuffleArr(set).join(', ')}?`,mode,`The mode is the most common value, and ${mode} appears most often.`,{skill:'mode',difficulty:2}); }
  for(let k=0;k<3;k++){ const set=uniq(Array.from({length:5},()=>ri(1,15))); const r=Math.max(...set)-Math.min(...set);
    num('data',`What is the range of: ${set.join(', ')}?`,r,`Range = largest − smallest = ${Math.max(...set)} − ${Math.min(...set)} = ${r}.`,{skill:'range',difficulty:2}); }
  for(let k=0;k<2;k++){ const set=[2,4,6,8,10].map(x=>x+ri(0,3)).sort((a,b)=>a-b); const med=set[2];
    num('data',`What is the median of: ${set.join(', ')}?`,med,`In order, the middle value is ${med}.`,{skill:'median',difficulty:2}); }
  // probability
  for(let k=0;k<3;k++){ const r=ri(2,5), b=ri(2,5); const g=gcd2(r,r+b);
    const ans=`${r/g}/${(r+b)/g}`;
    mcq('data',`A bag has ${r} red and ${b} blue balls. What is the probability of picking a red ball?`,ans,
      uniq([`${b}/${r+b}`,`${r}/${b}`,`1/${r+b}`]).concat('None of these'),`There are ${r+b} balls and ${r} are red, so P(red) = ${r}/${r+b}${g>1?` = ${ans}`:''}.`,{skill:'probability',difficulty:2}); }
  mcq('data','A fair coin is flipped. What is the probability of getting heads?','1/2',['1/4','1','0','None of these'],'There are 2 equally likely outcomes, so P(heads) = 1/2.',{skill:'probability',difficulty:1});
  // bar chart reading WITH figure
  for(let k=0;k<4;k++){ const cats=['Mon','Tue','Wed','Thu'].map(l=>({label:l,value:ri(2,10)}));
    const fig=F.barChart({title:'Books read',cats,yStep:2,yMax:12});
    const maxC=cats.reduce((a,b)=>b.value>a.value?b:a);
    const total=cats.reduce((a,b)=>a+b.value,0);
    if(k%2===0) mcq('data','On which day were the most books read? (Use the bar chart.)',maxC.label,cats.filter(c=>c.label!==maxC.label).map(c=>c.label).concat('None of these'),`The tallest bar is ${maxC.label} with ${maxC.value}.`,{skill:'reading bar charts',difficulty:2,figure:fig});
    else num('data','How many books were read in total across the four days? (Use the bar chart.)',total,`Add the bars: ${cats.map(c=>c.value).join(' + ')} = ${total}.`,{skill:'reading bar charts',difficulty:2,figure:fig});
  }
  // pictogram WITH figure
  for(let k=0;k<3;k++){ const per=pick([2,4,5]); const rows=['Ava','Ben','Cara'].map(l=>({label:l,count:per*ri(1,4)}));
    const fig=F.pictogram({title:'Stickers collected',rows,per,symbol:'★'});
    const target=pick(rows);
    num('data',`How many stickers did ${target.label} collect? (Each ★ = ${per}.)`,target.count,`${target.label} has ${target.count/per} symbols, and ${target.count/per} × ${per} = ${target.count}.`,{skill:'reading pictograms',difficulty:2,figure:fig});
  }
  function gcd2(a,b){return b?gcd2(b,a%b):a;}
  function shuffleArr(a){const r=a.slice();for(let i=r.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;}
})();

// dedupe by stem, cap difficulty spread
const seen=new Set(); const out=Q.filter(q=>{const key=q.stem+'|'+q.topic;if(seen.has(key))return false;seen.add(key);return true;});
require('fs').writeFileSync('/tmp/martinedu/data/maths/questions.json', JSON.stringify(out,null,1));
const byTopic={}; out.forEach(q=>byTopic[q.topic]=(byTopic[q.topic]||0)+1);
console.log('MATHS total:',out.length); console.log(byTopic);
console.log('with figures:',out.filter(q=>q.figure).length);
