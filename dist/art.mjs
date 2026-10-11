export const REGIONS = ['Mosslight Meadow','Copper Creek','Mushroom Grove','Moonwater Marsh','Starfall Ridge','The Great Lantern Tree'];

// Pip retains his orange face and white muzzle, now dressed for a tiny arena tour.
export function fox(){return `<svg viewBox="0 0 120 124" aria-hidden="true">
 <path d="M35 79Q7 96 9 57Q17 66 30 57" fill="#bd4b36" stroke="#3b1d3b" stroke-width="3"/><path d="M9 57Q6 71 18 82L24 61" fill="#ffe5c6"/>
 <path d="M35 64Q24 103 53 107H88Q110 89 89 61" fill="#792b8f" stroke="#2b1838" stroke-width="3"/>
 <path d="M32 17L55 33H73L98 14L103 58Q102 87 68 91Q28 87 28 56Z" fill="#f18b54" stroke="#40233a" stroke-width="3"/>
 <path d="M35 25L50 41L36 45M90 27L78 40L94 45" fill="#8d3b46"/><path d="M30 61L66 74L101 59Q99 86 67 91Q37 88 30 61" fill="#fff0d0"/>
 <path d="M42 51H60L62 61H42ZM74 51H92L90 61H72Z" fill="#252341" stroke="#f1d155" stroke-width="2"/><path d="M60 56h14" stroke="#f1d155" stroke-width="2"/>
 <path d="M62 70Q68 66 74 70L68 77Z" fill="#39253c"/><path d="M59 82Q68 87 77 81" stroke="#9b5271" stroke-width="2" fill="none"/>
 <path d="M40 88L54 99L65 93L79 99L93 87L88 109H44Z" fill="#382942" stroke="#ef6295" stroke-width="2"/><path d="M65 94l3 7 4-7" fill="#ffe56d"/>
 <path d="M74 105L86 116L109 93L101 84L91 94L80 90L68 99Z" fill="#f15b91" stroke="#252341" stroke-width="3"/><path d="M86 105L112 76" stroke="#f6e1a1" stroke-width="7" stroke-linecap="round"/><path d="M83 105L102 86M91 108L108 90" stroke="#252341" stroke-width="2"/><path d="M108 79l7-6m-5 11 7-6" stroke="#f6e1a1" stroke-width="3"/>
 </svg>`;}
export function owl(){return `<svg viewBox="0 0 120 124" aria-hidden="true"><path d="M27 13L45 28H78L97 13L99 64Q106 108 63 108Q19 108 23 64Z" fill="#7a6ab0" stroke="#2d2445" stroke-width="3"/><path d="M30 46Q43 25 61 49Q84 25 96 46L92 76Q64 103 33 76Z" fill="#f1dfd5"/><path d="M33 50h27l3 14H36ZM64 50h27l-3 14H67Z" fill="#282544" stroke="#e4ce62" stroke-width="2"/><path d="M60 56h5" stroke="#e4ce62" stroke-width="3"/><path d="M55 73L69 73L62 83Z" fill="#ecaa55"/><path d="M22 67Q-1 83 28 97M99 67Q123 83 94 97" fill="#574a91"/><path d="M52 106L58 118L65 109L71 118L77 105" fill="#ef63ad"/></svg>`;}

const positions=[[120,293],[209,277],[302,303],[407,303],[496,270],[586,235],[675,235],[763,214],[843,180],[924,150]];
export function landscape(progress=0,region=0){
 const palettes=[['#321a61','#fa5b8b','#3fe2e5'],['#352057','#ff9b54','#59e6ef'],['#301d68','#ef72d8','#55e6d9'],['#152e60','#ed5bb2','#5ee5f7'],['#2a2159','#f48f8f','#77ddfc'],['#402052','#ffbb5e','#66e6c5']];
 const [sky,pink,cyan]=palettes[region%6],suffix=`lh-${region}-${progress}`;
 const stars=Array.from({length:55},(_,i)=>{const x=(i*157+29)%1060,y=(i*79+12)%164;return `<path d="M${x} ${y-2}v4m-2-2h4" stroke="${i%5?'#a7abd5':'#fff0ad'}" stroke-width="${i%5?1:2}" opacity="${i%3?.45:.9}"/>`;}).join('');
 const pines=Array.from({length:19},(_,i)=>{const x=(i*137+18)%1090-20,y=157+(i%4)*16,s=.72+(i%3)*.23;return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 14v77" stroke="#1c1844" stroke-width="7"/><path d="M0 -44L-37 34H-23L-48 70H48L23 34H37Z" fill="${i%3?'#181d4b':'#282154'}" stroke="${i%3?cyan:pink}" stroke-width="2" stroke-opacity=".55"/></g>`;}).join('');
 const lanterns=positions.map(([x,y],i)=>`<g transform="translate(${x} ${y})"><ellipse cy="21" rx="17" ry="5" fill="#090c29" opacity=".7"/><path d="M0 16V-23Q0 -34 13 -34" stroke="#b3a9d6" stroke-width="3" fill="none"/><path d="M7 -38h15v22H7Z" fill="${i<progress?'#fff19a':'#26295a'}" stroke="${i<progress?'#ffe878':cyan}" stroke-width="2"/><path d="M11 -32h7" stroke="${i<progress?'#ed6e9d':'#64718c'}" stroke-width="5"/>${i<progress?`<circle cx="14" cy="-27" r="26" fill="#ffde83" opacity=".24" filter="url(#${suffix}-glow)"/>`:''}</g>`).join('');
 const foxAt=positions[Math.min(progress,9)];
 return `<svg class="landscape" viewBox="0 0 1060 400" role="img" aria-label="A neon woodland trail with ${progress} of ten lanterns lit">
 <defs><linearGradient id="${suffix}-sky" x2="0" y2="1"><stop stop-color="#0b102d"/><stop offset=".72" stop-color="${sky}"/><stop offset="1" stop-color="#a83881"/></linearGradient><filter id="${suffix}-glow"><feGaussianBlur stdDeviation="7"/></filter><linearGradient id="${suffix}-ground" x2="0" y2="1"><stop stop-color="#231a52"/><stop offset="1" stop-color="#0b112d"/></linearGradient></defs>
 <rect width="1060" height="400" fill="url(#${suffix}-sky)"/>${stars}
 <path d="M70 8L270 184M318 0L392 180M865 0L740 171M1030 30L838 188" stroke="${pink}" stroke-width="16" opacity=".07"/><path d="M28 0L325 183M1025 0L811 185" stroke="${cyan}" stroke-width="19" opacity=".06"/>
 <circle cx="834" cy="75" r="52" fill="#ffd1ac" opacity=".95"/><path d="M783 76h102M789 86h91M798 96h72M811 106h45" stroke="${sky}" stroke-width="3" opacity=".7"/>
 <path d="M0 211L96 140L166 194L288 92L414 208L535 125L642 210L755 142L854 206L944 119L1060 200V400H0" fill="#252050" stroke="${pink}" stroke-width="2" stroke-opacity=".6"/>
 <path d="M0 232Q180 171 347 222Q537 145 688 219Q900 157 1060 218V400H0" fill="#151c46"/>${pines}
 <path d="M0 272Q230 210 443 279Q666 193 1060 211V400H0" fill="url(#${suffix}-ground)"/>
 <g opacity=".6" stroke="${cyan}" stroke-width="1"><path d="M0 386h1060M0 349h1060M0 319h1060M0 295h1060"/><path d="M530 258L0 400M530 258L176 400M530 258L344 400M530 258L716 400M530 258L884 400M530 258L1060 400"/></g>
 <path d="M-30 376Q140 209 327 319T605 240T831 203T1050 137" fill="none" stroke="#0b102d" stroke-width="49"/><path d="M-30 376Q140 209 327 319T605 240T831 203T1050 137" fill="none" stroke="${pink}" stroke-width="32"/><path d="M-30 376Q140 209 327 319T605 240T831 203T1050 137" fill="none" stroke="#492c72" stroke-width="25"/><path d="M-30 376Q140 209 327 319T605 240T831 203T1050 137" fill="none" stroke="#ffb5db" stroke-width="2" stroke-dasharray="4 18"/>
 <g transform="translate(916 56)"><path d="M-35 62L14 9L69 62Z" fill="#f451a6" stroke="#ffe1b7" stroke-width="3"/><rect x="-22" y="63" width="75" height="67" fill="#1b214e" stroke="${cyan}" stroke-width="3"/><rect x="-2" y="75" width="24" height="55" fill="#ee60b2"/><path d="M2 88h17m-17 8h17" stroke="#fae3c3" stroke-width="2"/><rect x="30" y="79" width="14" height="16" fill="#ffd871"/><path d="M-30 61h91" stroke="#fee3a8" stroke-width="3"/><path d="M-19 112h69" stroke="${pink}" stroke-width="5"/></g>
 ${lanterns}
 <g class="fox-on-trail" transform="translate(${foxAt[0]-37} ${foxAt[1]-46})"><svg width="65" height="67" viewBox="0 0 120 124">${fox().replace(/<svg[^>]*>|<\/svg>/g,'')}</svg></g>
 <g transform="translate(52 307)"><path d="M0 6v18M23 5v18" stroke="${cyan}" stroke-width="5"/><path d="M-11 5Q0 -14 12 5ZM11 4Q23 -16 35 4Z" fill="${pink}" stroke="#3c2355" stroke-width="3"/><circle cx="-2" cy="-2" r="2" fill="#fff0bd"/><circle cx="23" cy="-3" r="2" fill="#fff0bd"/></g>
 </svg>`;
}
