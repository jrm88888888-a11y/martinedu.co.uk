const fs=require('fs');
const main=JSON.parse(fs.readFileSync('/tmp/martinedu/data/english/questions.json','utf8'));
const comp=JSON.parse(fs.readFileSync('/tmp/martinedu/data/english/comprehension.json','utf8'));
let errors=[];
function check(q,ctx){
  if(!q.stem) errors.push([ctx,'no stem']);
  if(!q.options||q.options.length<4) errors.push([ctx,'<4 options: '+q.stem]);
  if(q.options){
    if(!q.options.includes(q.answer)) errors.push([ctx,'answer not in options: '+q.stem+' | ans='+q.answer]);
    if(new Set(q.options).size!==q.options.length) errors.push([ctx,'duplicate options: '+q.stem+' | '+JSON.stringify(q.options)]);
    if(q.options.some(o=>o===''||o==null)) errors.push([ctx,'empty option: '+q.stem]);
  }
}
main.forEach(q=>check(q,q.id));
comp.forEach(p=>p.questions.forEach((q,i)=>check(q,p.id+'-Q'+(i+1))));
console.log('English items:',main.length+comp.reduce((a,p)=>a+p.questions.length,0),'| errors:',errors.length);
if(errors.length){console.log(JSON.stringify(errors,null,1));process.exit(1);}
console.log('ALL ENGLISH CHECKS PASSED');
