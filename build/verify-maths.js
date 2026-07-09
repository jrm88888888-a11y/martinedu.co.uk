/* Independent verifier: re-derives answers from the STEM text where the
   question type is machine-parseable, and structurally checks every item.
   This catches generator formula bugs (checker is written separately). */
const fs = require('fs');
const Q = JSON.parse(fs.readFileSync('/tmp/martinedu/data/maths/questions.json','utf8'));
let errors=[], checked=0;
const numOf = s => { const m=String(s).replace(/[£,%\s]/g,'').match(/-?\d+\.?\d*/); return m?parseFloat(m[0]):NaN; };

for(const q of Q){
  // structural
  if(!q.id||!q.topic||!q.stem||q.answer===undefined) errors.push([q.id,'missing field']);
  if(q.type==='mcq'){
    if(!q.options||q.options.length<4) errors.push([q.id,'fewer than 4 options']);
    if(q.options && !q.options.map(String).includes(String(q.answer))) errors.push([q.id,'answer not among options: '+q.answer]);
    if(q.options && new Set(q.options.map(String)).size!==q.options.length) errors.push([q.id,'duplicate options']);
  }
  const s=q.stem, a=numOf(q.answer);
  // Re-derivations
  let m;
  if(m=s.match(/What is ([\d.]+) × (\d+)\?/)){ checked++; if(Math.abs(parseFloat(m[1])*parseFloat(m[2])-a)>1e-9) errors.push([q.id,'mult wrong']); }
  else if(m=s.match(/Round ([\d ]+) to the nearest (ten|hundred|thousand)\./)){ checked++; const n=parseFloat(m[1].replace(/\s/g,'')); const base={ten:10,hundred:100,thousand:1000}[m[2]]; if(Math.round(n/base)*base!==a) errors.push([q.id,'round wrong']); }
  else if(m=s.match(/What is (\d+)% of (\d+)\?/)){ checked++; if(parseFloat(m[1])*parseFloat(m[2])/100!==a) errors.push([q.id,'pct-of wrong']); }
  else if(m=s.match(/What is (\d+)\/(\d+) of (\d+)\?/)){ checked++; if(parseFloat(m[3])/parseFloat(m[2])*parseFloat(m[1])!==a) errors.push([q.id,'frac-of wrong']); }
  else if(m=s.match(/temperature is (-?\d+) °C\. It rises by (\d+)/)){ checked++; if(parseFloat(m[1])+parseFloat(m[2])!==a) errors.push([q.id,'neg wrong']); }
  else if(m=s.match(/perimeter of this rectangle/)){ checked++; const f=q.figure.match(/>(\d+) cm</g); if(f){const nums=[...q.figure.matchAll(/>(\d+) cm</g)].map(x=>+x[1]); if(nums.length>=2 && 2*(nums[0]+nums[1])!==a) errors.push([q.id,'perim wrong '+nums]); } }
  else if(m=s.match(/area of this rectangle/)){ checked++; const nums=[...q.figure.matchAll(/>(\d+) cm</g)].map(x=>+x[1]); if(nums.length>=2 && nums[0]*nums[1]!==a) errors.push([q.id,'area wrong '+nums]); }
  else if(m=s.match(/Two angles in this triangle are (\d+)° and (\d+)°/)){ checked++; if(180-+m[1]-+m[2]!==a) errors.push([q.id,'tri angle wrong']); }
  else if(m=s.match(/this angle is (\d+)°, what is the other/)){ checked++; if(180-+m[1]!==a) errors.push([q.id,'straight-line wrong']); }
  else if(m=s.match(/mean \(average\) of ([\d, ]+)\?/)){ checked++; const arr=m[1].split(',').map(x=>+x); if(arr.reduce((x,y)=>x+y,0)/arr.length!==a) errors.push([q.id,'mean wrong']); }
  else if(m=s.match(/range of: ([\d, ]+)\?/)){ checked++; const arr=m[1].split(',').map(x=>+x); if(Math.max(...arr)-Math.min(...arr)!==a) errors.push([q.id,'range wrong']); }
  else if(m=s.match(/median of: ([\d, ]+)\?/)){ checked++; const arr=m[1].split(',').map(x=>+x).sort((x,y)=>x-y); if(arr[Math.floor(arr.length/2)]!==a) errors.push([q.id,'median wrong']); }
  else if(m=s.match(/next number in the sequence: ([\d, ]+), …/)){ checked++; const arr=m[1].split(',').map(x=>+x); const d=arr[1]-arr[0]; if(arr.every((v,i)=>i===0||v-arr[i-1]===d)){ if(arr[arr.length-1]+d!==a) errors.push([q.id,'seq wrong']); } }
}
console.log('Maths verified re-derivations:',checked,'| structural+semantic errors:',errors.length);
if(errors.length) { console.log(JSON.stringify(errors.slice(0,40),null,1)); process.exit(1); }
console.log('ALL MATHS CHECKS PASSED');
