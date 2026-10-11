export const SKILLS = {
 whole:'Fraction of a whole', equivalent:'Fractions, decimals & percents', percent:'Percent of a number', ratio:'Ratios & parts', proportion:'Direct proportions', reverse:'Reverse percents', inverse:'Inverse proportions'
};
export const KEY='lantern-hollow-v1';
export const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const pick=(xs,r)=>xs[Math.floor(r()*xs.length)];
export const fmt=n=>Number(n.toFixed(4)).toString();
export function fresh(){return {version:1,total:0,journeys:0,skills:Object.fromEntries(Object.keys(SKILLS).map(k=>[k,{score:.18,attempts:0,correct:0,streak:0,errors:0,transfer:0,forms:[],last:-1}])),review:[],history:[],sessions:[],active:null};}
export function restore(raw){
 try {
 const s=JSON.parse(raw),integer=n=>Number.isInteger(n)&&n>=0;
 const validEvent=e=>e&&e.skill in SKILLS&&typeof e.prompt==='string'&&typeof e.answer==='string'&&typeof e.chosen==='string'&&typeof e.correct==='boolean'&&Number.isFinite(e.score)&&Number.isFinite(Date.parse(e.at));
 if(!s||s.version!==1||!integer(s.total)||!integer(s.journeys)||!s.skills||!Array.isArray(s.history)||!Array.isArray(s.sessions)||!Array.isArray(s.review))return null;
 for(const k of Object.keys(SKILLS)){const t=s.skills[k];if(!t||!Number.isFinite(t.score)||t.score<0||t.score>1||!Array.isArray(t.forms)||!t.forms.every(n=>[0,1,2].includes(n))||!['attempts','correct','streak','errors','transfer'].every(k=>integer(t[k]))||!Number.isInteger(t.last))return null;}
 if(!s.history.every(validEvent)||!s.review.every(x=>x&&x.skill in SKILLS&&integer(x.due)))return null;
 if(!s.sessions.every(x=>x&&Number.isFinite(Date.parse(x.at))&&integer(x.correct)&&integer(x.independent)&&x.scores&&Object.keys(SKILLS).every(k=>Number.isFinite(x.scores[k])&&x.scores[k]>=0&&x.scores[k]<=1)))return null;
 if(s.active){const a=s.active,q=a.question;if(!Array.isArray(a.results)||a.results.length>10||!a.results.every(validEvent)||!q||!(q.skill in SKILLS)||!Array.isArray(q.choices)||q.choices.length!==4||new Set(q.choices).size!==4||!q.choices.every(x=>typeof x==='string')||!q.choices.includes(q.answer)||!['prompt','hint','explain'].every(k=>typeof q[k]==='string')||![1,2,3,4].includes(q.level)||![0,1,2].includes(q.form))return null;
 if(a.feedback&&!validEvent(a.feedback)||a.results.length===10&&!a.feedback||a.repair&&!(a.repair in SKILLS))return null;
 if(q.visual&&(q.visual.type==='bar'?(!integer(q.visual.parts)||q.visual.parts>100||!integer(q.visual.filled)||q.visual.filled>q.visual.parts):q.visual.type==='table'?(!Array.isArray(q.visual.headers)||!Array.isArray(q.visual.rows)||!q.visual.rows.every(Array.isArray)):true))return null;
 }
 return s;
 }catch{return null;}
}
export const tier=t=>t.score<.38?1:t.score<.62?2:t.score<.82?3:4;
export function mastery(t){return t.attempts===0?'Not explored':t.score>=.82&&t.transfer>=2&&t.forms.length>=2?'Growing strong':t.score>=.5?'Taking root':'Exploring';}
function options(answer,distractors,r){let a=[String(answer),...distractors.map(String)].filter((x,i,all)=>all.indexOf(x)===i);let n=1;while(a.length<4){let x=fmt((Number(answer)||1)+n++);if(!a.includes(x))a.push(x);}a=a.slice(0,4);for(let i=a.length-1;i>0;i--){let j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const fraction=(n,d)=>`${n}/${d}`;
export function question(skill,level=1,form=0,transfer=false,r=Math.random){
 let prompt,answer,explain,hint,visual=null,bad=[],meta={};
 const d=pick(level===1?[2,4]:level===2?[4,5,10]:[5,8,10,20],r);
 const n=level===1?1:pick(level===4?[2,3,4]:[1,2,3],r);const unit=pick(level===1?[2,3,4]:level===2?[4,6,8]:[6,9,12,15],r);const total=d*unit;
 const p=pick(level===1?[10,25,50]:level===2?[20,25,40,75]:[5,15,30,60,80],r);
 const base=pick(level<=2?[20,40,60,80,100]:[120,160,180,240,300],r);
 const a=pick(level===1?[1,2]:[2,3,4],r),b=a+pick([1,2,3],r),scale=pick(level===1?[2,3]:level===2?[3,4,5]:[6,8,12],r);
 if(skill==='whole'){
   answer=fmt(total*n/d);meta={n,d,total};
   prompt=form%3===0?`There are ${total} glowberries. Pip puts ${fraction(n,d)} of them in a lantern basket. How many go in?`:form%3===1?`A ${total}-step trail is split into ${d} equal stretches. You have walked ${n} ${n===1?'stretch':'stretches'}. How many steps is that?`:`${fraction(n,d)} × ${total} = ?`;
   if(form%3===0)visual={type:'bar',parts:d,filled:n,label:`${total} berries altogether · ${n} of ${d} equal groups`};
   hint=`Split the whole into ${d} equal groups, then take ${n}.`;
   explain=`${total} ÷ ${d} = ${unit} in each group. Take ${n} ${n===1?'group':'groups'}: ${unit} × ${n} = ${answer}.`;
   bad=[fmt(total/d),fmt(total-n),fmt(total*d/n),fmt(Number(answer)+unit)];
   if(transfer){answer=fmt(total-total*n/d);prompt=`The moths ate ${fraction(n,d)} of ${total} glowberries. How many berries are LEFT for the lanterns?`;explain+=` That is the amount eaten. Left: ${total} − ${fmt(total*n/d)} = ${answer}.`;bad=[fmt(total*n/d),fmt(total-n),fmt(total+d)];visual=null;}
 }else if(skill==='equivalent'){
   const pairs=level===1?[[1,2],[1,4],[3,4]]:level===2?[[1,5],[2,5],[3,5],[1,10]]:[[1,8],[3,8],[5,8],[7,20],[3,20]];
   const [num,den]=pick(pairs,r);const pct=num/den*100;meta={num,den,pct};
   if(form%3===0){answer=fmt(pct);prompt=`The lantern is ${fraction(num,den)} full. What percent full is it?`;bad=[fmt(num/den),fmt(den/num*100),fmt(num*10)];visual={type:'bar',parts:den,filled:num,label:`${num} of ${den} equal parts full`};}
   else if(form%3===1){answer=fmt(num/den);prompt=`A firefly meter reads ${fmt(pct)}%. Which decimal names the same amount?`;bad=[fmt(pct/10),fmt(pct),fmt(num/den+.1)];}
   else{answer=fraction(num,den);prompt=`Which fraction matches ${fmt(num/den)} of a full flask?`;bad=[fraction(den,num),fraction(num,den*10),fraction(num+1,den)];}
   hint='Percent means out of 100. A fraction is its top number divided by its bottom number.';
   explain=`${num} ÷ ${den} = ${fmt(num/den)}. Multiply that decimal by 100 to get ${fmt(pct)}%. All three describe the same share.`;
   if(transfer){const delta=pick([-5,0,5],r);const other=pct+delta;answer=delta===0?'They are equal':delta>0?'The percent lantern':'The fraction lantern';prompt=`Two same-sized lanterns: one is ${fraction(num,den)} full and one is ${fmt(other)}% full. Which holds more light?`;bad=['They are equal','The percent lantern','The fraction lantern','Cannot tell'].filter(x=>x!==answer);explain+=` Compare ${fmt(pct)}% with ${fmt(other)}%. ${answer}.`;visual=null;}
 }else if(skill==='percent'){
   answer=fmt(base*p/100);meta={p,base};
   prompt=form%3===0?`The village has ${base} lanterns. ${p}% need new wicks. How many need wicks?`:form%3===1?`Find ${p}% of ${base} glowstones.`:`A seed chest holds ${base} seeds. For every 100 seeds, ${p} are silver. How many silver seeds are in this chest?`;
   hint=`Find 1% by dividing ${base} by 100, then multiply by ${p}.`;
   explain=`${p}% = ${fmt(p/100)}. ${base} × ${fmt(p/100)} = ${answer}.`;
   bad=[fmt(base-p),fmt(base/p),fmt(base*p),fmt(base*p/10)];
   if(transfer){prompt=`A lantern costs ${base} coins. The owl offers ${p}% off. How many coins do you PAY?`;answer=fmt(base*(1-p/100));bad=[fmt(base*p/100),fmt(base-p),fmt(base*(1+p/100))];explain+=` That is the discount. Pay ${base} − ${fmt(base*p/100)} = ${answer} coins.`;}
 }else if(skill==='ratio'){
   meta={a,b,scale};answer=fmt(b*scale);
   prompt=form%3===0?`Pip mixes ${a} scoops of blue dust for every ${b} scoops of gold dust. With ${a*scale} blue scoops, how many gold scoops keep the same mix?`:form%3===1?`Blue : gold = ${a} : ${b}. Blue = ${a*scale}. Gold = ?`:`A lantern string repeats ${a} blue lights, then ${b} gold lights. With ${a*scale} blue lights in complete repeats, how many gold lights are there?`;
   if(form%3===1)visual={type:'table',headers:['Blue','Gold'],rows:[[a,b],[a*scale,'?']]};
   hint=`The blue amount is multiplied by ${scale}. Do the same to gold.`;
   explain=`${a*scale} ÷ ${a} = ${scale}. Keep the mix: ${b} × ${scale} = ${answer}.`;
   bad=[fmt(a*scale+b-a),fmt((a+b)*scale),fmt(a*scale/b)];
   if(transfer){prompt=`A pouch has ${a+b} equal-sized gems: ${a} green and ${b} amber. What fraction of ALL the gems are green?`;answer=fraction(a,a+b);bad=[fraction(a,b),fraction(b,a+b),fraction(a+b,a)];explain=`The whole is ${a} + ${b} = ${a+b} gems. Green is ${a} of those ${a+b}: ${answer}. A part-to-part ratio is different from a fraction of the whole.`;visual=null;}
 }else if(skill==='proportion'){
   const count=a+1,rate=unit;answer=fmt(count*scale*rate);meta={count,rate,scale};
   prompt=form%3===0?`${count} lanterns need ${count*rate} metres of ribbon. At the same rate, how much ribbon do ${count*scale} lanterns need?`:form%3===1?`Complete the matching amounts: ${count} / ${count*rate} = ${count*scale} / ?`:`A map uses ${count} cm for ${count*rate} km. How many km does ${count*scale} cm represent?`;
   if(form%3===0)visual={type:'table',headers:['Lanterns','Ribbon (m)'],rows:[[count,count*rate],[count*scale,'?']]};
   hint=`Find the amount for one: ${count*rate} ÷ ${count}.`;
   explain=`One needs ${count*rate} ÷ ${count} = ${rate}. For ${count*scale}, multiply: ${count*scale} × ${rate} = ${answer}.`;
   bad=[fmt(count*rate+count*scale-count),fmt(count*scale/rate),fmt(count*rate/scale)];
   if(transfer){answer=fmt(rate);prompt=`A ${count}-candle bundle costs ${count*rate} coins. Candles cost the same individually. What is the most you should pay for ONE candle?`;bad=[fmt(count*rate),fmt(count),fmt(rate+count)];explain=`The bundle has ${count} equal shares of the price: ${count*rate} ÷ ${count} = ${rate} coins each.`;visual=null;}
 }else if(skill==='reverse'){
   const part=base*p/100;meta={p,base,part};answer=fmt(base);
   prompt=form%3===0?`${p}% of the village's lanterns is ${fmt(part)} lanterns. How many lanterns are there altogether?`:form%3===1?`${fmt(part)} is ${p}% of which number?`:`A flask is ${p}% full and contains ${fmt(part)} mL. How many mL does a FULL flask hold?`;
   hint=`${fmt(part)} is only ${p} out of every 100 parts. Find 1%, then 100%.`;
   explain=`1% is ${fmt(part)} ÷ ${p} = ${fmt(base/100)}. So 100% is ${fmt(base/100)} × 100 = ${base}. Check: ${p}% of ${base} is ${fmt(part)}.`;
   bad=[fmt(part*p/100),fmt(part*100),fmt(part+p)];
   if(transfer&&level>=2){const sale=base*(100-p)/100;prompt=`After ${p}% off, a lantern costs ${fmt(sale)} coins. What was its ORIGINAL price?`;explain=`You pay ${100-p}% of the original. Original = ${fmt(sale)} ÷ ${fmt((100-p)/100)} = ${base}.`;bad=[fmt(sale*(1+p/100)),fmt(sale+p),fmt(sale*p/100)];hint=`After ${p}% off, ${100-p}% remains. That remaining share costs ${fmt(sale)}.`;}
   else if(transfer){prompt=`${fmt(part)} glowing windows are exactly ${p}% of a village's windows. How many windows are DARK?`;answer=fmt(base-part);bad=[fmt(base),fmt(part),fmt(part*p/100)];explain+=` Dark windows: ${base} − ${fmt(part)} = ${answer}.`;}
 }else if(skill==='inverse'){
   const workers=level===1?2:a+1,hours=scale*(level===1?2:3),factor=level===1?2:pick([2,3],r);answer=fmt(hours/factor);meta={workers,hours,factor};
   prompt=form%3===0?`${workers} beetles finish a trail in ${hours} hours. ${workers*factor} beetles work at the same speed per beetle, sharing the SAME job. How many hours will it take?`:form%3===1?`Same job, equal workers: ${workers} workers take ${hours} hours. ${workers*factor} workers take ? hours.`:`One cart makes a delivery in ${hours} hours. Another goes ${factor} times as fast along the SAME route. How many hours does it take?`;
   hint=`The job stays the same. ${factor} times as much speed means dividing the time by ${factor}.`;
   explain=`The same work is shared ${factor} times as fast. ${hours} ÷ ${factor} = ${answer} hours. More workers or speed means less time here.`;
   bad=[fmt(hours*factor),fmt(hours-factor),fmt(hours+factor)];
   if(transfer){const faster=pick([true,false],r);prompt=`A snail travels at ${faster?'double':'half'} its usual speed on the SAME path, without stopping. What happens to its travel time?`;answer=faster?'It is halved':'It doubles';bad=['It is halved','It doubles','It stays the same','It drops by 2 hours'].filter(x=>x!==answer);explain=`Distance = speed × time. For the same distance, ${faster?'twice the speed needs half the time':'half the speed needs twice the time'}.`;}
 }else throw Error('Unknown skill');
 // Highest tier introduces a second step or reverses the known quantity.
 if(level===4&&!transfer){
   if(skill==='percent'){const second=10;answer=fmt(base*(1-p/100)*(1+second/100));prompt=`A ${base}-coin lantern is discounted ${p}%, then a 10% delivery fee is added to the DISCOUNTED price. What is the final cost?`;explain=`After the discount: ${base} × ${fmt(1-p/100)} = ${fmt(base*(1-p/100))}. Add 10% of that new price: ${fmt(base*(1-p/100))} × 1.1 = ${answer}.`;hint='Apply the discount first. The delivery percent uses that new, smaller price.';bad=[fmt(base*(1-(p-second)/100)),fmt(base*p/100),fmt(base*(1-p/100))];meta.second=second;}
   if(skill==='ratio'){prompt=`A ${ (a+b)*scale }-bead bracelet uses blue : gold = ${a} : ${b}. How many beads are GOLD?`;answer=fmt(b*scale);explain=`There are ${a+b} ratio parts. Each part is ${(a+b)*scale} ÷ ${a+b} = ${scale} beads. Gold has ${b} parts: ${b} × ${scale} = ${answer}.`;hint=`Add the ratio parts: ${a} + ${b}. Split the total into that many equal parts.`;visual=null;}
   if(skill==='proportion'){const c=meta.count,rate=meta.rate;prompt=`${c} lanterns use ${c*rate} metres of ribbon. At that rate, how many lanterns can you trim with ${c*scale*rate} metres?`;answer=fmt(c*scale);explain=`One lantern uses ${rate} metres. ${c*scale*rate} ÷ ${rate} = ${answer} lanterns.`;hint='Find ribbon per lantern, then divide the total ribbon by that amount.';bad=[fmt(c*scale*rate),fmt(c*scale/rate),fmt(c*scale*rate*rate)];visual=null;}
   if(skill==='reverse'){const newPrice=base*(1+p/100);prompt=`A shop increases a lantern's price by ${p}%. The new price is ${fmt(newPrice)} coins. What was the original price?`;answer=fmt(base);explain=`The new price is ${100+p}% of the original. ${fmt(newPrice)} ÷ ${fmt(1+p/100)} = ${base}.`;hint=`The new price is ${100+p}% of the old price, not 100%.`;bad=[fmt(newPrice*(1-p/100)),fmt(newPrice-p),fmt(newPrice*p/100)];}
   if(skill==='inverse'){const w=meta.workers,h=meta.hours,f=meta.factor;prompt=`${w*f} equally fast beetles finish one job in ${h} hours. Only ${w} beetles are available for the SAME job. How many hours do they need?`;answer=fmt(h*f);explain=`There are ${f} times fewer workers, so the same job takes ${f} times as long: ${h} × ${f} = ${answer}.`;hint='Fewer workers means more time for the same job.';bad=[fmt(h/f),fmt(h-f),fmt(h+f)];}
 }
 return {skill,level,form,transfer,prompt,answer:String(answer),choices:options(answer,bad,r),explain,hint,visual,meta,assisted:false,repair:false};
}
export function choose(s,r=Math.random){
 const run=s.active,index=run.results.length;let skill,repair=false;const due=s.review.find(x=>x.due<=s.total);
 if(run.repair){skill=run.repair;run.repair=null;repair=true;}
 else if(due){skill=due.skill;s.review.splice(s.review.indexOf(due),1);}
 else {const keys=Object.keys(SKILLS);const last=run.results.at(-1)?.skill;
   skill=keys.map(k=>({k,w:(s.skills[k].attempts===0?3:1-s.skills[k].score)+(s.total-s.skills[k].last)*.045+(k===last?-2:0)+r()*.3})).sort((a,b)=>b.w-a.w)[0].k;}
 const t=s.skills[skill];const transfer=!repair&&(index===4||index===9||!!due);
 const form=(t.attempts+Math.floor(r()*2))%3;let q=question(skill,repair?Math.max(1,tier(t)-1):tier(t),form,transfer,r);
 // Avoid immediate identical retries without relying on indefinite generation loops.
 for(let i=0;i<8&&s.history.slice(-12).some(h=>h.prompt===q.prompt);i++)q=question(skill,q.level,(form+i+1)%3,transfer,r);
 q.repair=repair;return q;
}
export function start(s,r=Math.random){if(s.active)return s.active;s.active={started:new Date().toISOString(),results:[],question:null,feedback:null,repair:null};s.active.question=choose(s,r);return s.active;}
export function submit(s,choice){
 const run=s.active;if(!run||run.feedback||!run.question.choices.includes(choice))return null;
 const q=run.question,t=s.skills[q.skill],correct=choice===q.answer;const independent=correct&&!q.assisted&&!q.repair;
 t.attempts++;t.correct+=correct?1:0;t.last=s.total;t.streak=independent?t.streak+1:0;
 if(independent){t.score=clamp(t.score+.095*(1-t.score)+(q.transfer?.035:0),.05,.97);if(!t.forms.includes(q.form))t.forms.push(q.form);if(q.transfer)t.transfer++;}
 else if(!correct){t.score=clamp(t.score-.105,.05,.97);t.errors++;}
 if(!correct||q.assisted){if(!q.repair)run.repair=q.skill;s.review=s.review.filter(x=>x.skill!==q.skill);s.review.push({skill:q.skill,due:s.total+4});}
 const event={at:new Date().toISOString(),skill:q.skill,prompt:q.prompt,answer:q.answer,chosen:choice,correct,assisted:q.assisted,repair:q.repair,transfer:q.transfer,level:q.level,score:t.score};
 s.total++;s.history.push(event);s.history=s.history.slice(-500);run.results.push(event);run.feedback=event;
 return event;
}
export function advance(s,r=Math.random){
 if(!s.active?.feedback)return false;
 if(s.active.results.length===10){s.journeys++;const summary={at:new Date().toISOString(),correct:s.active.results.filter(x=>x.correct).length,independent:s.active.results.filter(x=>x.correct&&!x.assisted&&!x.repair).length,scores:Object.fromEntries(Object.entries(s.skills).map(([k,t])=>[k,t.score]))};s.sessions.push(summary);s.sessions=s.sessions.slice(-100);s.active=null;return summary;}
 s.active.feedback=null;s.active.question=choose(s,r);return true;
}
